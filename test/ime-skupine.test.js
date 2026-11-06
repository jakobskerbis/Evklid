// Imena skupin prijateljev in razredov vidijo drugi otroci: brez kontaktov (e-naslov, telefon, povezava, omrežja).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { nameHasContact } from "../public/ime-skupine.js";
import SL from "../public/i18n/sl.js";

const BAD = ["snap: ana123", "Dodaj me na Insta", "piši 041 123 456", "+386 41 123456", "0038641123456", "ana@gmail.com", "ana＠gmail", "ana (at) gmail", "www.x.si", "discord.gg/abc", "https://x.co", "t.me/ana", "ig: ana_12", "TikTok ana", "WhatsApp skupina", "viber 041123456", "мой инстаграм"];
const OK = ["8.b", "Matematiki 2025/26", "Razred 2025 2026", "Prijatelji", "Ekipa 7.a", "Fizika 9", "Instrumenti", "Snaga", "Diskretna matematika", "Igralci", "Tigri", "Šah 1 2 3", "Messi fans"];

test("ime skupine: kontakti zavrnjeni, navadna imena razredov in skupin ne", () => {
  assert.deepEqual(BAD.filter((n) => !nameHasContact(n)), []);
  assert.deepEqual(OK.filter(nameHasContact), []);
});

test("ime skupine: strežnik zavrne kontakte pri skupini prijateljev, razredu in učiteljevem razredu", async () => {
  const store = openDb(":memory:");
  const server = createApp(store).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, body) => {
    const r = await fetch(base + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return { status: r.status, body: await r.json() };
  };
  try {
    const s = (await call("/api/students", { name: "Ana" })).body;
    const fg = await call(`/api/students/${s.id}/friend-groups`, { name: "snap: ana_2012" });
    assert.equal(fg.status, 400);
    assert.equal(fg.body.code, "lg.nameContact");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM classes").get().n, 0);
    assert.equal((await call(`/api/students/${s.id}/friend-groups`, { name: "Matematiki" })).status, 201);
    const cl = await call("/api/classes", { name: "8.b piši 041 123 456" });
    assert.equal(cl.status, 400);
    assert.equal(cl.body.code, "lg.nameContact");
    assert.equal((await call("/api/classes", { name: "8.b" })).status, 201);
  } finally {
    server.close();
  }
  // Učiteljev razred z računom: isto preverjanje (server/schools.js).
  assert.match(fs.readFileSync(new URL("../server/schools.js", import.meta.url), "utf8"), /nameHasContact\(name\)/);
});

test("ime skupine: opozorilo v vseh 33 jezikih", () => {
  assert.ok(SL["lg.nameContact"]);
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.equal(files.length, 32);
  for (const f of files) {
    const v = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"))["lg.nameContact"];
    assert.ok(v && v !== SL["lg.nameContact"], f);
  }
});
