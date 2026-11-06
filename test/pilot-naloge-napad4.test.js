// Pregled A4 PR #474 (pregledovalec A, krog 4): novi napadi, zdaj zaprti (krog 6), in XP pilota zunaj garancije,
// niza dni in meritev vračanja (pregled B4).
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { impactReport } from "../server/pilot-ucinek.js";
import { pilotTasksReport } from "../server/pilot-naloge.js";
import { Progress } from "../server/progress.js";
import fs from "node:fs";

process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");
const IMG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ==";
const quiet = { error() {}, warn() {}, info() {}, log() {} };
const sentMail = [];
const mail = { accounts: true, resendKey: "re_x", fetchFn: async (url, o) => (sentMail.push(JSON.parse(o?.body || "{}")), { ok: true, status: 200, json: async () => ({ id: "e" }) }) };

async function withServer(opts, fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: quiet, ...mail, ...opts });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (path, o = {}) => {
      const res = await fetch(base + path, {
        method: o.method || "GET",
        headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
        body: o.body ? JSON.stringify(o.body) : undefined,
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar[kv.slice(0, i)] = kv.slice(i + 1);
      }
      return { status: res.status, body: await res.json().catch(() => null) };
    };
  };
  const warn = console.warn;
  console.warn = () => {};
  try {
    await fn({ client, store });
  } finally {
    console.warn = warn;
    server.close();
  }
}

async function account(client, store, email, age, { pilot = true, self = true } = {}) {
  const call = client();
  const y = new Date().getFullYear() - age;
  const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, country: "SI", birth_date: `${y}-01-15` } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  store.db.prepare(`UPDATE parents SET email_verified_at = datetime('now'), pilot_at = ${pilot ? "datetime('now', '-15 days')" : "NULL"} WHERE email = ?`).run(email);
  let sid = null;
  if (self) {
    const s = await call("/api/students", { method: "POST", body: { name: "Maja", self: true, consent: true } });
    assert.equal(s.status, 201, JSON.stringify(s.body));
    sid = s.body.id;
  }
  return { call, sid, pid: store.db.prepare("SELECT id FROM parents WHERE email = ?").get(email).id };
}


test("A4-1 vzporedni napačni poskusi gesla na privacy-seen: koliko jih preide omejitev 30/h", async () => {
  await withServer({}, async ({ client, store }) => {
    const a = await account(client, store, "brute@a4.si", 40, { pilot: false });
    store.db.prepare("UPDATE parents SET privacy_version = '2026-10-29' WHERE id = ?").run(a.pid);
    const rs = [];
    for (let k = 0; k < 6; k++) rs.push(...(await Promise.all(Array.from({ length: 10 }, (_, i) => a.call("/api/account/privacy-seen", { method: "POST", body: { password: `narobe${k}-${i}` } })))));
    const n401 = rs.filter((r) => r.status === 401).length;
    assert.ok(n401 <= 30, `${n401} ugibanj v eni uri`);
    // Isti števec kot izvoz (acct<id>): po teh poskusih tudi izvoz vrne 429, ne dodatnih 30 ugibanj.
    const e = await a.call("/api/account/export", { method: "POST", body: { password: "x" } });
    assert.equal(e.status, 429);
    // Neuspeli poskusi so v dnevniku dostopov.
    assert.ok(store.db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action = 'owner_confirm' AND ok = 0").get().n >= 1);
  });
});

test("A4-2 starš z dvema profiloma (z gesli) v Računu izbriše fotografije otroka na svoji napravi", async () => {
  await withServer({}, async ({ client, store }) => {
    const a = await account(client, store, "starsfoto@a4.si", 45, { self: false });
    const y = new Date().getFullYear() - 16;
    const s1 = (await a.call("/api/students", { method: "POST", body: { name: "Ana", birth_year: y, consent: true, profile_password: "ana12345" } })).body;
    const s2 = (await a.call("/api/students", { method: "POST", body: { name: "Bor", birth_year: y, consent: true, profile_password: "bor12345" } })).body;
    // otrok na svoji napravi (druga seja) shrani fotografijo; tu poenostavljeno: ista seja, nato odklepi izbrisani (starševa naprava)
    const sc = await a.call(`/api/students/${s2.id}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true, image: IMG, consent: true } });
    assert.equal(sc.status, 200, JSON.stringify(sc.body));
    store.db.prepare("DELETE FROM profile_unlocks").run();
    const r = await a.call(`/api/account/pilot-photos/${s2.id}`, { method: "DELETE", body: { password: "geslo1234" } });
    assert.equal(r.status, 200, "politika: starš v zavihku Račun pri profilu (z geslom računa, brez gesla profila)");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_photos").get().n, 0);
    // Brez gesla računa (brat na skupni napravi) ne.
    await a.call(`/api/students/${s2.id}/pilot/scan`, { method: "POST", body: { cond: "dark", ok: true, image: IMG, consent: true } });
    store.db.prepare("DELETE FROM profile_unlocks").run();
    assert.equal((await a.call(`/api/account/pilot-photos/${s2.id}`, { method: "DELETE" })).status, 401);
    void s1;
  });
});

test("A4-3 strop in »Ne vem«: natančna števila razkrijejo rezultat zadnjega učenca", () => {
  const db = openDb(":memory:").db;
  impactReport(db, 3);
  const add = (i, items, answers) => {
    const sid = Number(db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run(`U${i}`).lastInsertRowid);
    const score = answers.filter((x) => x === 1).length;
    db.prepare("INSERT INTO pilot_quiz (student_id, phase, topic_id, items, answers, score, finished_at) VALUES (?, 'pre', 't', ?, ?, ?, datetime('now', ?))").run(sid, JSON.stringify(items), JSON.stringify(answers), score, `+${i} seconds`);
  };
  const six = [1, 2, 3, 4, 5, 6].map((s) => ({ seed: s, level: 1 }));
  const nine = [...six, ...[7, 8, 9].map((s) => ({ seed: s, level: 3 }))];
  add(1, six, [1, 0, 1, 0, 1, 0]);
  add(2, six, [1, 1, 1, 0, 0, 0]);
  add(3, six, [0, 0, 1, 0, 1, 1]);
  const r0 = impactReport(db, 3).quiz;
  add(4, nine, [1, 1, 1, 1, 1, 1, 0, 1, 0]); // četrti: 6/6 v prvem delu
  const r1 = impactReport(db, 3).quiz;
  assert.equal(r1.ceiling.nPre, r0.ceiling.nPre, "iz spremembe števila strop/ne-strop se ne vidi, ali je zadnji rešil vse");
  add(5, six, [-1, -1, -1, -1, -1, -1]);
  const r2 = impactReport(db, 3).quiz;
  assert.equal(r2.allSkip, r1.allSkip, "»Ne vem« zadnjega se ne vidi, dokler ni nov paket");
  assert.deepEqual([r1.shownPre, r2.shownPre], [r0.shownPre, r0.shownPre]);
});

test("A4-4 anketa: ponovna oddaja (API dovoli) premakne vrstico in razkrije odgovor novega", () => {
  const db = openDb(":memory:").db;
  pilotTasksReport(db);
  const sids = [];
  const put = (sid, v, sec) => db.prepare("INSERT INTO pilot_survey (student_id, answers, created_at) VALUES (?, ?, datetime('now', ?)) ON CONFLICT(student_id) DO UPDATE SET answers = excluded.answers, created_at = excluded.created_at").run(sid, JSON.stringify({ overall: v, tutor: v, scan: v, school: v, improve: "scan" }), `+${sec} seconds`);
  for (let i = 0; i < 4; i++) sids.push(Number(db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run(`S${i}`).lastInsertRowid));
  put(sids[0], 5, 1); // lažni račun skrbnika (znan odgovor 5)
  put(sids[1], 4, 2);
  put(sids[2], 3, 3);
  const r3 = pilotTasksReport(db).survey;
  put(sids[3], 1, 4); // pravi učenec, skrit
  put(sids[0], 5, 5); // lažni račun odda znova → gre na konec
  const r4 = pilotTasksReport(db).survey;
  const leaked = Math.round((r4.avg.overall * 3 - r3.avg.overall * 3 + 5) * 10) / 10;
  assert.notEqual(Math.round(leaked), 1, "odgovor četrtega ni izračunljiv (vrstni red po rowid, posodobitev ga ne premakne)");
});

test("A4-5 račun brez gesla (Apple) skrije pasico in odgovori na plačilo s kodo, poslano na e-naslov", async () => {
  await withServer({}, async ({ client, store }) => {
    const a = await account(client, store, "apple@a4.si", 40);
    store.db.prepare("UPDATE parents SET privacy_version = '2026-10-29', password_hash = 'none$apple' WHERE id = ?").run(a.pid);
    assert.equal((await a.call("/api/account")).body.parent.has_password, false);
    assert.equal((await a.call("/api/account/privacy-seen", { method: "POST", body: { password: "" } })).status, 401);
    const codeOf = async () => {
      sentMail.length = 0;
      assert.equal((await a.call("/api/account/owner-code", { method: "POST" })).status, 200);
      const m = sentMail.find((x) => x.to?.[0] === "apple@a4.si");
      return /(\d{6})/.exec(m.text)[1];
    };
    let code = await codeOf();
    assert.equal((await a.call("/api/account/privacy-seen", { method: "POST", body: { code: code === "000000" ? "111111" : "000000" } })).status, 401, "napačna koda");
    assert.equal((await a.call("/api/account/privacy-seen", { method: "POST", body: { code } })).status, 200);
    assert.equal((await a.call("/api/account/privacy-seen", { method: "POST", body: { code } })).status, 401, "koda velja enkrat");
    code = await codeOf();
    assert.equal((await a.call("/api/account/pilot-wtp", { method: "POST", body: { pay: "skip", code } })).status, 200);
    // Račun z geslom kode ne dobi (potrdi z geslom).
    const b = await account(client, store, "geslo@a4.si", 40, { pilot: false });
    assert.equal((await b.call("/api/account/owner-code", { method: "POST" })).status, 400);
  });
});

test("B4: XP iz pilota ne začne niza dni, ne prinese bonusa za niz in ne šteje za garancijo ali meritve vračanja", () => {
  const store = openDb(":memory:");
  const db = store.db;
  const sid = Number(db.prepare("INSERT INTO students (name, settings) VALUES ('P', '{}')").run().lastInsertRowid);
  const p = new Progress(store);
  db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 10, 'pilot: scan:light', datetime('now', '-1 day'))").run(sid);
  const out = p.award(sid, [[5, "pilot: flag"]]);
  assert.equal(out.items.length, 1, "brez bonusa »N dni zapored«");
  assert.equal(p.dayStreak(sid), 0, "dnevi samo s pilotom niso niz");
  db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 10, 'vaja', datetime('now', '-1 day'))").run(sid);
  const out2 = p.award(sid, [[10, "vaja"]]);
  assert.ok(out2.items.some((i) => /dni zapored/.test(i.reason)), "prava vaja niz nadaljuje");
  // Garancija in meritve vračanja izločijo razlog »pilot: …« (poizvedbi).
  const g = fs.readFileSync(new URL("../server/placila/garancija.js", import.meta.url), "utf8");
  assert.match(g, /FROM xp_events WHERE student_id = \? AND created_at >= \? AND created_at < \? AND COALESCE\(reason, ''\) NOT LIKE 'pilot:%'/);
  const r = fs.readFileSync(new URL("../server/rast.js", import.meta.url), "utf8");
  assert.match(r, /FROM xp_events WHERE created_at >= \? AND COALESCE\(reason, ''\) NOT LIKE 'pilot:%'/);
});
