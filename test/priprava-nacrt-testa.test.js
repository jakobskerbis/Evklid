// Priprava na test, PR 2b (docs/priprava.md): nekdanji test_plans je aktivna priprava (server/priprava/aktivna.js).
// Selitev starih načrtov, isti test ohrani isto pripravo (in njene vire), drug test naredi novo, odstranitev ne
// izbriše učenčevega gradiva, /priprave pokaže načrt, samodejni izbris 30 dni po testu. Brez AI.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDb } from "../server/db.js";
import { Progress } from "../server/progress.js";
import { nowParts } from "../server/schedule.js";
import { pocistiPriprave } from "../server/priprava/ciscenje.js";
import { unseal } from "../server/crypto-polje.js";
import { createApp } from "../server/app.js";

process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");
const quiet = { log() {}, info() {}, warn() {}, error() {} };
const DAN = 86400000;
const PATH = "MAT-OS-8";
// Datumi v slovenskem času, kot jih šteje progress.testPlan (nowParts).
const cez = (n) => new Date(Date.parse(`${nowParts().date}T12:00:00Z`) + n * DAN).toISOString().slice(0, 10);

function setup() {
  const store = openDb(":memory:");
  const p = new Progress(store);
  const s = store.createStudent("Ana");
  const ui = p.pathView(s.id, PATH).units.map((u, i) => (u.hasPractice ? i : -1)).filter((i) => i >= 0);
  return { store, db: store.db, p, s, ui };
}
const priprave = (db, sid) => db.prepare("SELECT id, aktivna, pot, datum_testa, dogodek_id FROM priprave WHERE student_id = ? ORDER BY id").all(sid).map((r) => ({ ...r }));
const dodajVir = (db, pid, sid) => db.prepare("INSERT INTO priprava_viri (priprava_id, student_id, vrsta, mime, velikost) VALUES (?, ?, 'besedilo', 'text/plain', 1)").run(pid, sid);

test("načrt testa je aktivna priprava: naslov šifriran, predmet iz poti, pripravaId v načrtu", () => {
  const { db, p, s, ui } = setup();
  assert.equal(p.testPlan(s.id), null);
  const plan = p.setTestPlan(s.id, PATH, [ui[0]], cez(6), "dog-1", "Test – Pitagorov izrek");
  assert.equal(plan.daysLeft, 6);
  assert.equal(plan.eventId, "dog-1");
  const [r] = priprave(db, s.id);
  assert.deepEqual(r, { id: plan.pripravaId, aktivna: 1, pot: PATH, datum_testa: cez(6), dogodek_id: "dog-1" });
  const raw = db.prepare("SELECT naslov, predmet FROM priprave WHERE id = ?").get(r.id);
  assert.notEqual(raw.naslov, "Test – Pitagorov izrek", "naslov je šifriran");
  assert.equal(unseal(raw.naslov), "Test – Pitagorov izrek");
  assert.equal(raw.predmet, "MAT");
  // Brez imena testa: ime učne poti.
  const { db: db2, p: p2, s: s2 } = setup();
  p2.setTestPlan(s2.id, PATH, [ui[0]], cez(3));
  assert.match(unseal(db2.prepare("SELECT naslov FROM priprave").get().naslov), /Matematika/);
});

test("isti test ohrani isto pripravo (sklopi, premaknjen datum, isti dogodek); drug test naredi novo", () => {
  const { db, p, s, ui } = setup();
  const a = p.setTestPlan(s.id, PATH, [ui[0]], cez(6), "dog-1").pripravaId;
  dodajVir(db, a, s.id);
  assert.equal(p.setTestPlan(s.id, PATH, ui.slice(0, 2), cez(6), "dog-1").pripravaId, a, "drugi sklopi");
  assert.equal(p.setTestPlan(s.id, PATH, [ui[0]], cez(8), "dog-1").pripravaId, a, "učitelj prestavi test");
  // Drug dogodek iz urnika je drug test, tudi na isti poti: stara priprava z viri ostane, a ni več aktivna.
  const b = p.setTestPlan(s.id, PATH, [ui[0]], cez(20), "dog-2").pripravaId;
  assert.notEqual(b, a);
  assert.deepEqual(priprave(db, s.id).map((r) => [r.id, r.aktivna]), [[a, 0], [b, 1]]);
  // Priprava brez virov se ob novem testu izbriše (kot prej prepis vrstice v test_plans).
  const c = p.setTestPlan(s.id, "MAT-OS-9", [0], cez(25), "dog-3")?.pripravaId;
  if (c) assert.deepEqual(priprave(db, s.id).map((r) => [r.id, r.aktivna]), [[a, 0], [c, 1]]);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM priprave WHERE student_id = ? AND aktivna = 1").get(s.id).n, 1);
});

test("ročni načrt: prestavljen datum je isti test; test, ki ga učenec nato vpiše v urnik, prevzame isto pripravo", () => {
  const { db, p, s, ui } = setup();
  const a = p.setTestPlan(s.id, PATH, [ui[0]], cez(6)).pripravaId;
  dodajVir(db, a, s.id);
  assert.equal(p.setTestPlan(s.id, PATH, [ui[0]], cez(9)).pripravaId, a);
  const plan = p.setTestPlan(s.id, PATH, [ui[0]], cez(9), "dog-1");
  assert.equal(plan.pripravaId, a);
  assert.equal(plan.eventId, "dog-1");
  assert.equal(priprave(db, s.id).length, 1);
});

test("stari test je mimo: ista pot z novim datumom je nov test", () => {
  const { db, p, s, ui } = setup();
  const a = p.setTestPlan(s.id, PATH, [ui[0]], cez(-2)).pripravaId;
  dodajVir(db, a, s.id);
  const b = p.setTestPlan(s.id, PATH, [ui[0]], cez(10)).pripravaId;
  assert.notEqual(b, a);
  assert.deepEqual(priprave(db, s.id).map((r) => r.aktivna), [0, 1]);
});

test("odstranitev načrta: brez virov se priprava izbriše, z viri ostane neaktivna; seja priprave se zapre", () => {
  const { db, p, s, ui } = setup();
  p.setTestPlan(s.id, PATH, [ui[0]], cez(5));
  p.clearTestPlan(s.id);
  assert.deepEqual(priprave(db, s.id), []);
  assert.equal(p.testPlan(s.id), null);
  const a = p.setTestPlan(s.id, PATH, [ui[0]], cez(5)).pripravaId;
  dodajVir(db, a, s.id);
  p.clearTestPlan(s.id);
  assert.deepEqual(priprave(db, s.id).map((r) => [r.id, r.aktivna]), [[a, 0]]);
  assert.equal(p.testPlan(s.id), null);
  p.clearTestPlan(s.id); // nič aktivnega: brez napake
  // Nov načrt zapre odprto sejo priprave (kot prej).
  p.setTestPlan(s.id, PATH, [ui[0]], cez(5));
  const sess = p.startTest(s.id);
  assert.ok(sess?.sessionId);
  p.setTestPlan(s.id, PATH, [ui[0]], cez(4));
  assert.equal(p.getSession(sess.sessionId).finished, 1);
});

test("meja 20 priprav: nov test posodobi aktivno pripravo z viri, namesto da doda 21.", () => {
  const { db, p, s, ui } = setup();
  for (let i = 0; i < 19; i++) db.prepare("INSERT INTO priprave (student_id, naslov) VALUES (?, 'x')").run(s.id);
  const a = p.setTestPlan(s.id, PATH, [ui[0]], cez(5), "dog-1").pripravaId;
  dodajVir(db, a, s.id);
  const b = p.setTestPlan(s.id, PATH, [ui[0]], cez(15), "dog-2").pripravaId;
  assert.equal(b, a);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM priprave WHERE student_id = ?").get(s.id).n, 20);
  assert.equal(p.testPlan(s.id).date, cez(15));
});

test("samodejni izbris 30 dni po testu odnese tudi aktivno pripravo; enolična aktivna na profil", () => {
  const { db, p, s, ui } = setup();
  p.setTestPlan(s.id, PATH, [ui[0]], cez(2));
  assert.equal(pocistiPriprave(db, { now: Date.now() + 31 * DAN }), 0);
  assert.equal(pocistiPriprave(db, { now: Date.now() + 33 * DAN }), 1);
  assert.equal(p.testPlan(s.id), null);
  db.prepare("INSERT INTO priprave (student_id, naslov, aktivna) VALUES (?, 'a', 1)").run(s.id);
  assert.throws(() => db.prepare("INSERT INTO priprave (student_id, naslov, aktivna) VALUES (?, 'b', 1)").run(s.id), /UNIQUE/);
});

test("selitev test_plans: brez stolpca event_id, profil z že aktivno pripravo, ponovni zagon", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "priprava-2b-"));
  const file = path.join(dir, "evklid.db");
  try {
    let store = openDb(file);
    store.db.exec("INSERT INTO students (id, name, settings) VALUES (1, 'A', '{}'), (2, 'B', '{}'), (3, 'C', '{}')");
    store.db.prepare("INSERT INTO priprave (student_id, naslov, aktivna, pot) VALUES (2, 'obstoječa', 1, 'FIZ-OS-8')").run();
    // Najstarejša oblika tabele (brez event_id).
    store.db.exec("CREATE TABLE test_plans (student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE, path_key TEXT NOT NULL, units TEXT NOT NULL, test_date TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')))");
    store.db.exec("INSERT INTO test_plans (student_id, path_key, units, test_date, created_at) VALUES (1, 'MAT-OS-8', '[0,2]', '2099-01-10', '2026-11-20 08:00:00'), (2, 'MAT-OS-8', '[1]', '2099-01-11', '2026-11-20 08:00:00')");
    store.db.close();
    store = openDb(file);
    const db = store.db;
    assert.equal(db.prepare("SELECT 1 FROM sqlite_master WHERE name = 'test_plans'").get(), undefined);
    const rows = db.prepare("SELECT student_id, naslov, predmet, pot, sklopi, datum_testa, dogodek_id, aktivna, created_at FROM priprave ORDER BY student_id, id").all();
    assert.equal(rows.length, 2, "profil 2 je že imel aktivno pripravo: njegov stari načrt se ne podvoji");
    assert.deepEqual({ ...rows[0], naslov: unseal(rows[0].naslov) }, {
      student_id: 1, naslov: "Priprava na test", predmet: "MAT", pot: "MAT-OS-8", sklopi: "[0,2]", datum_testa: "2099-01-10", dogodek_id: null, aktivna: 1, created_at: "2026-11-20 08:00:00",
    });
    assert.equal(rows[1].pot, "FIZ-OS-8");
    const p = new Progress(store);
    assert.deepEqual(p.testPlan(1).units, [0, 2]);
    store.db.close();
    store = openDb(file);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM priprave").get().n, 2);
    store.db.close();
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("API: /test-plan, /priprave in urnik so ena priprava", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: quiet });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const req = async (method, p, body) => {
    const r = await fetch(base + p, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: r.status, body: await r.json() };
  };
  try {
    const s = (await req("POST", "/api/students", { name: "Eva", settings: { curriculum_level: "8. razred" } })).body;
    const put = await req("PUT", `/api/students/${s.id}/schedule`, { events: [{ date: cez(5), kind: "test", name: "Test – Matematika", subject_name: "Matematika" }] });
    const plan = put.body.schedule.testPlan;
    assert.ok(plan?.pripravaId, "test v urniku sam odpre pripravo");
    const list = (await req("GET", `/api/students/${s.id}/priprave`)).body.priprave;
    assert.equal(list.length, 1);
    assert.deepEqual(
      { id: list[0].id, naslov: list[0].naslov, aktivna: list[0].aktivna, pot: list[0].pot, datum: list[0].datum_testa, dogodek: list[0].dogodek_id, sklopi: list[0].sklopi },
      { id: plan.pripravaId, naslov: "Test – Matematika", aktivna: true, pot: plan.path, datum: cez(5), dogodek: plan.eventId, sklopi: plan.units },
    );
    // Sprememba datuma prek /priprave je viden v načrtu testa (ista vrstica).
    await req("PUT", `/api/students/${s.id}/priprave/${plan.pripravaId}`, { datum_testa: cez(7) });
    assert.equal((await req("GET", `/api/students/${s.id}/test-plan`)).body.plan.date, cez(7));
    // Izbris priprave odstrani načrt; urnik ga ob naslednjem branju odpre znova.
    await req("DELETE", `/api/students/${s.id}/priprave/${plan.pripravaId}`);
    assert.equal((await req("GET", `/api/students/${s.id}/test-plan`)).body.plan, null);
    const again = (await req("GET", `/api/students/${s.id}/schedule`)).body.schedule.testPlan;
    assert.ok(again?.pripravaId);
    assert.equal(again.date, cez(5));
    // Tuj id priprave v /test-plan ni mogoč: pot vedno vzame aktivno pripravo profila iz poti.
    const t = await req("POST", `/api/students/${s.id}/test-plan`, { path: again.path, units: [0], date: cez(9) });
    assert.equal(t.status, 200);
    assert.equal((await req("GET", `/api/students/${s.id}/priprave`)).body.priprave.filter((x) => x.aktivna).length, 1);
  } finally {
    server.close();
  }
});
