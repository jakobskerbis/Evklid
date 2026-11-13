// Ostanki plačil (2026-11-04): razlog za ustavljen inštruktor v jeziku vmesnika (ključ i18n v odgovoru 429)
// in poraba AI šole samo za učence z mestom licence (server/placila/sola-vir.js).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { Usage, BLOCK_TEXT } from "../server/usage.js";
import { createSchoolSource } from "../server/placila/sola-vir.js";
import SL from "../public/i18n/sl.js";

test("blockInfo: vsak razlog ima ključ i18n z enakim slovenskim besedilom; blockReason vrne besedilo", () => {
  for (const [k, v] of Object.entries(BLOCK_TEXT)) assert.equal(SL[k], v, k);
  const store = openDb(":memory:");
  const u = new Usage(store.db);
  const sid = store.createStudent("Ana", {}).id;
  assert.equal(u.blockInfo(sid), null);
  u.creditOut = () => true;
  assert.deepEqual(u.blockInfo(sid), { error: BLOCK_TEXT["block.creditOut"], code: "block.creditOut" });
  assert.equal(u.blockReason(sid), BLOCK_TEXT["block.creditOut"]);
  process.env.EVKLID_DAILY_QUESTIONS = "3";
  try {
    u.questionsToday = () => 3;
    const b = u.blockInfo(sid);
    assert.equal(b.code, "block.daily");
    assert.deepEqual(b.params, { n: 3 });
    assert.match(b.error, /\(3 na dan\)/);
  } finally {
    delete process.env.EVKLID_DAILY_QUESTIONS;
  }
});

test("klepet: odgovor 429 ima code in params (odjemalec ga prevede), error ostane slovenski", async () => {
  process.env.EVKLID_DAILY_QUESTIONS = "1";
  const store = openDb(":memory:");
  const streamFn = async ({ onText }) => {
    onText("Odgovor.");
    return { content: [{ type: "text", text: "Odgovor." }], text: "Odgovor.", stopReason: "end_turn", model: "claude-haiku-5-5", usage: { input_tokens: 10, output_tokens: 5 } };
  };
  const server = createApp(store, { streamFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = async (path, body) => {
    const r = await fetch(base + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return { status: r.status, body: (r.headers.get("content-type") || "").includes("json") ? await r.json() : await r.text() };
  };
  try {
    const s = (await post("/api/students", { name: "Ana" })).body;
    const c = (await post(`/api/students/${s.id}/conversations`, {})).body;
    assert.equal((await post(`/api/conversations/${c.id}/messages`, { text: "Koliko je 2 + 2?" })).status, 200);
    const r = await post(`/api/conversations/${c.id}/messages`, { text: "Pa 3 + 3?" });
    assert.equal(r.status, 429);
    assert.equal(r.body.code, "block.daily");
    assert.deepEqual(r.body.params, { n: 1 });
    assert.equal(r.body.limit, true);
    assert.match(r.body.error, /\(1 na dan\)/);
  } finally {
    delete process.env.EVKLID_DAILY_QUESTIONS;
    server.close();
  }
});

test("šolska licenca: v mejo AI šole šteje samo poraba učencev z mestom licence", () => {
  const store = openDb(":memory:");
  const db = store.db;
  const ids = ["Ana", "Bor", "Cene"].map((n) => store.createStudent(n, {}).id);
  const spend = db.prepare("INSERT INTO usage (student_id, model, cost_usd) VALUES (?, 'm', ?)");
  spend.run(ids[0], 1);
  spend.run(ids[1], 2);
  spend.run(ids[2], 4); // tretji učenec nima mesta (licenca za 2)
  const lic = { schoolId: 7, schoolName: "OŠ Test", licenceId: 70, plan: "class", aiCapUsdMonth: 10 };
  const access = (_db, id) => (ids.slice(0, 2).includes(id) ? lic : null);
  const students = () => ids;
  // Vir z mesti (kot server/schools.js) in vir brez njih (šteje access()).
  for (const source of [{ access, students, seats: () => 2 }, { access, students }]) {
    const src = createSchoolSource(db, { source });
    src.clearCache();
    assert.equal(src.forStudent(ids[0])[0].ai_spent_usd, 3, JSON.stringify(Object.keys(source)));
    assert.deepEqual(src.forStudent(ids[2]), []);
  }
  // Osebni paket se še vedno ne šteje.
  const src = createSchoolSource(db, { source: { access, students, seats: () => 2 }, personalOf: (id) => id === ids[1] });
  src.clearCache();
  assert.equal(src.forStudent(ids[0])[0].ai_spent_usd, 1);
});

test("šolska licenca: učenec z mestom v dveh šolah šteje samo v šolo, ki mu da pravice", () => {
  const store = openDb(":memory:");
  const db = store.db;
  const [ana, bor, cene] = ["Ana", "Bor", "Cene"].map((n) => store.createStudent(n, {}).id);
  const spend = db.prepare("INSERT INTO usage (student_id, model, cost_usd) VALUES (?, 'm', ?)");
  spend.run(ana, 1);
  spend.run(bor, 2);
  spend.run(cene, 4);
  // Šola 7: Ana, Bor; šola 8: Bor, Cene. Bor dobi pravice v šoli 7 (access izbere eno šolo).
  const roster = { 7: [ana, bor], 8: [bor, cene] };
  const lic = (schoolId) => ({ schoolId, schoolName: `Šola ${schoolId}`, licenceId: schoolId * 10, plan: "class", aiCapUsdMonth: 10 });
  const access = (_db, id) => (id === cene ? lic(8) : lic(7));
  const source = {
    access,
    students: (_db, s) => roster[s],
    seats: () => 2,
    elsewhere: (_db, s, ids) => ids.filter((id) => Object.entries(roster).some(([o, list]) => Number(o) !== s && list.includes(id))),
  };
  const src = createSchoolSource(db, { source });
  src.clearCache();
  assert.equal(src.forStudent(ana)[0].ai_spent_usd, 3, "šola 7: Ana + Bor");
  assert.equal(src.forStudent(cene)[0].ai_spent_usd, 4, "šola 8: samo Cene, Bor ne šteje dvakrat");
});

test("šolska licenca (pravi vir, server/schools.js): učenec v razredih dveh šol šteje samo v prvo, ki mu da mesto", () => {
  const store = openDb(":memory:");
  createApp(store, { accounts: false, scheduler: false, log: { error() {} } }); // ustvari šolske tabele
  const { db } = store;
  const [ana, bor, cene] = ["Ana", "Bor", "Cene"].map((n) => store.createStudent(n, {}).id);
  const spend = db.prepare("INSERT INTO usage (student_id, model, cost_usd) VALUES (?, 'm', ?)");
  spend.run(ana, 1);
  spend.run(bor, 2);
  spend.run(cene, 4);
  const school = (n, members) => {
    const sid = Number(db.prepare("INSERT INTO schools (name, invite_code) VALUES (?, ?)").run(`Šola ${n}`, `INV${n}`).lastInsertRowid);
    db.prepare("INSERT INTO school_licences (school_id, plan, seats, valid_from, valid_until) VALUES (?, 'class', 30, '2026-01-01', '2099-01-01')").run(sid);
    const cid = Number(db.prepare("INSERT INTO classes (code, name, kind, school_id) VALUES (?, ?, 'class', ?)").run(`C${n}`, `${n}.a`, sid).lastInsertRowid);
    for (const id of members) db.prepare("INSERT INTO class_members (class_id, student_id) VALUES (?, ?)").run(cid, id);
    return sid;
  };
  const a = school(1, [ana, bor]);
  const b = school(2, [bor, cene]);
  const src = createSchoolSource(db);
  src.clearCache();
  assert.equal(src.forStudent(ana)[0].school_id, a);
  assert.equal(src.forStudent(ana)[0].ai_spent_usd, 3, "šola 1: Ana + Bor");
  assert.equal(src.forStudent(cene)[0].school_id, b);
  assert.equal(src.forStudent(cene)[0].ai_spent_usd, 4, "šola 2: samo Cene");
});
