// P7: podatki na napravi (public/offline.js). Zagon brez povezave (očiščen /api/config), brisanje osebnih
// podatkov ob odjavi in koncu seje, prvi lastnik po namestitvi, izvoz samo za profile računa, izbris profila.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

class MemoryStorage {
  constructor() {
    this.m = new Map();
  }
  get length() {
    return this.m.size;
  }
  key(i) {
    return [...this.m.keys()][i] ?? null;
  }
  getItem(k) {
    return this.m.has(k) ? this.m.get(k) : null;
  }
  setItem(k, v) {
    this.m.set(k, String(v));
  }
  removeItem(k) {
    this.m.delete(k);
  }
  clear() {
    this.m.clear();
  }
}

// public/offline.js uvozi »/practice/check.js« (pot v brskalniku); za test kopija z uvozom iz strežnika.
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-offline-"));
const check = pathToFileURL(path.resolve("server/practice/check.js")).href;
fs.writeFileSync(path.join(dir, "offline.mjs"), fs.readFileSync("public/offline.js", "utf8").replace('"/practice/check.js"', JSON.stringify(check)));
globalThis.localStorage = new MemoryStorage();
globalThis.location = { origin: "https://evklid.test" };
const deleted = [];
globalThis.caches = { keys: async () => ["evklid-v1-api-javni", "evklid-v1-static"], delete: async (n) => deleted.push(n) };
const off = await import(pathToFileURL(path.join(dir, "offline.mjs")).href);
test.after(() => fs.rmSync(dir, { recursive: true, force: true }));

const ls = globalThis.localStorage;
const fill = () => {
  ls.clear();
  const set = (k, v) => ls.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
  // osebno
  set("evklid.offline.pack.7", { path: "MAT-OS-8", tasks: {} });
  set("evklid.offline.queue.7", [{ topic_id: "x", seed: 1 }]);
  set("evklid.offline.students", [{ id: 7, name: "Ana" }]);
  set("evklid.offline.owner", 1);
  set("evklid.scan.7", [{ text: "naloga" }]);
  set("evklid.work.123", "2x = 4");
  set("evklid.graph.7", { expr: "x^2" });
  set("evklid.sci.7", { hist: ["1+1"] });
  set("evklid.goalSeen.7", "1");
  set("evklid.scheduleReminders", "1");
  set("evklid.scheduleNotified", "{}");
  set("evklid.ours.7.mat-2024", { score: 3 });
  set("evklid.levelup.7.2026", "1");
  set("teacherClasses", [{ code: "ABC", key: "skrivni-kljuc" }]);
  set("evklid_invite_name", "Ana");
  set("studentId", "7");
  // nastavitve videza (ostanejo)
  set("evklid.lang", "sl");
  set("evklid.theme", "dark");
  set("evklid.units", "si");
  set("evklid.config", { enums: {} });
};
const KEEP = ["evklid.config", "evklid.lang", "evklid.theme", "evklid.units"];

test("P7: odjava pobriše vse osebne podatke na napravi (tudi učiteljev ključ), ostanejo nastavitve videza", async () => {
  fill();
  deleted.length = 0;
  await off.clearPrivate();
  assert.deepEqual([...ls.m.keys()].sort(), KEEP);
  assert.deepEqual(deleted, ["evklid-v1-api-javni"], "predpomnilnik API, datoteke aplikacije ostanejo");
});

test("P7: zagon brez povezave – očiščen /api/config in seznam profilov", () => {
  ls.clear();
  off.saveConfig({ mock: false, enums: { a: 1 }, defaults: { level: "OS" }, chat_off: false, test_notice: [], admin: true, feedback: { prompt: true, ai: false, admin: true } });
  const cfg = off.offlineBootApi("/api/config");
  assert.deepEqual(cfg.enums, { a: 1 });
  assert.equal(cfg.admin, false, "brez skrbniške zastavice");
  assert.equal(cfg.feedback.admin, false);
  off.saveStudents([{ id: 3, name: "Lan", settings: { grade: 8 }, email: "x@y" }, { id: 4, name: "Žan", locked: true, settings: { grade: 6 } }]);
  assert.deepEqual(off.offlineBootApi("/api/students"), [{ id: 3, name: "Lan", settings: { grade: 8 } }, { id: 4, name: "Žan", locked: true }]);
  assert.deepEqual(off.offlineBootApi("/api/students/3/conversations"), []);
  assert.equal(off.offlineBootApi("/api/config", { method: "POST" }), undefined);
  assert.equal(off.offlineBootApi("/api/students/3/progress"), undefined);
});

test("P7: konec seje (iztek, odjava drugje) pobriše napravo, ki je imela lastnika", async () => {
  fill();
  assert.equal(await off.endedSession(), true);
  assert.deepEqual([...ls.m.keys()].sort(), KEEP);
  assert.equal(await off.endedSession(), false, "brez lastnika ni česa brisati");
});

test("P7: menjava računa in prvi lastnik po namestitvi", async () => {
  fill();
  assert.equal(await off.checkOwner(1), false, "isti račun: nič se ne pobriše");
  assert.ok(ls.getItem("evklid.scan.7"));
  assert.equal(await off.checkOwner(2), true, "drug račun");
  assert.equal(ls.getItem("evklid.scan.7"), null);
  assert.equal(ls.getItem("teacherClasses"), null);
  assert.equal(ls.getItem("evklid.offline.owner"), "2");

  // Podatki brez zapisa o lastniku (pred to različico): prvi, ki se prijavi, jih ne podeduje.
  fill();
  ls.removeItem("evklid.offline.owner");
  assert.equal(await off.checkOwner(5), true);
  assert.equal(ls.getItem("evklid.offline.queue.7"), null);
  // Prazna naprava (samo povezava s povabilom): nič se ne pobriše, ime iz povabila ostane.
  ls.clear();
  ls.setItem("evklid_invite_name", "Ana");
  assert.equal(await off.checkOwner(6), false);
  assert.equal(ls.getItem("evklid_invite_name"), "Ana");
});

test("P7: izvoz podatkov na napravi samo za profile računa", () => {
  fill();
  ls.setItem("evklid.scan.99", JSON.stringify([{ text: "tuje" }]));
  ls.setItem("evklid.offline.queue.99", JSON.stringify([{ seed: 9 }]));
  const d = off.deviceData([7]);
  assert.deepEqual(Object.keys(d.scanner_history), ["7"]);
  assert.deepEqual(Object.keys(d.offline_answers), ["7"]);
  assert.deepEqual(d.calculator["7"], { graph: { expr: "x^2" }, sci: { hist: ["1+1"] } });
  assert.equal(d.task_work["123"], "2x = 4");
  assert.ok(!JSON.stringify(d).includes("skrivni-kljuc"), "učiteljev ključ ne gre v izvoz");
  assert.deepEqual(off.deviceData([]).scanner_history, {});
});

test("P7: izbris profila pobriše njegove podatke na napravi", () => {
  fill();
  ls.setItem("evklid.scan.70", "[]");
  off.clearProfile(7);
  for (const k of ["evklid.offline.pack.7", "evklid.offline.queue.7", "evklid.scan.7", "evklid.graph.7", "evklid.sci.7", "evklid.goalSeen.7", "evklid.ours.7.mat-2024", "evklid.levelup.7.2026"]) {
    assert.equal(ls.getItem(k), null, k);
  }
  assert.ok(ls.getItem("evklid.scan.70"), "profil 70 ostane");
  assert.deepEqual(JSON.parse(ls.getItem("evklid.offline.students")), []);
});

test("hiter zagon (pregled #560 A5, A2): poln pomnilnik najprej pobriše posnetek zaslona; clearPrivate ustavi nov zapis", async () => {
  ls.clear();
  ls.setItem("evklid.zadnji-posnetek", "x".repeat(1000));
  // Pomnilnik je poln, dokler je posnetek na napravi.
  ls.setItem = function (k, v) {
    if (this.m.has("evklid.zadnji-posnetek")) throw new Error("QuotaExceededError");
    MemoryStorage.prototype.setItem.call(this, k, v);
  };
  try {
    off.saveStudents([{ id: 7, name: "A", settings: {} }]);
    assert.equal(ls.getItem("evklid.zadnji-posnetek"), null, "posnetek se umakne");
    assert.deepEqual(JSON.parse(ls.getItem("evklid.offline.students")), [{ id: 7, name: "A", settings: {} }], "zapis uspe v drugem poskusu");
    // Brez posnetka ni česa umakniti: neuspel zapis ostane neuspel (brez zanke).
    ls.setItem = () => {
      throw new Error("QuotaExceededError");
    };
    off.saveStudents([{ id: 8, name: "B", settings: {} }]);
    assert.deepEqual(JSON.parse(ls.getItem("evklid.offline.students")), [{ id: 7, name: "A", settings: {} }]);
  } finally {
    delete ls.setItem;
  }
  // Odjava, konec seje, menjava računa: zagon (public/zacetek.js) izve, da app.js posnetka ne sme zapisati znova.
  let n = 0;
  globalThis.evklidZacetek = { pozabi: () => n++ };
  try {
    await off.clearPrivate();
  } finally {
    delete globalThis.evklidZacetek;
  }
  assert.equal(n, 1);
});
