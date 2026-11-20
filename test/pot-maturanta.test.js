// Pot maturanta (j, 20. 11. 2026): 4. letnik SŠ (matematika) dobi cilj matura z datumom roka, Učna pot kartico »Danes«
// (ista tema kot »Najprej vadi« na strani NPZ in matura), star profil ponudbo, SŠ/faks/15+ pa ne dobi uvoda za otroke.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { Progress } from "../server/progress.js";
import { privzetiCilj, maturaDatum, ponudiMaturo, MATURA_SPOMLADI } from "../public/goal-data.js";
import { brezUvoda } from "../public/stopnja.js";

const SS4 = (raven = " OR") => ({ educational_track: "SREDNJA_SOLA", curriculum_level: `4. letnik${raven}`, subject: "MAT" });

test("matura date: first spring term from today on, empty when the year has no date yet", () => {
  assert.ok(MATURA_SPOMLADI.includes("2027-05-29"));
  assert.equal(maturaDatum("2026-11-20"), "2027-05-29");
  assert.equal(maturaDatum("2027-05-29"), "2027-05-29");
  assert.equal(maturaDatum("2027-05-30"), "");
});

test("default goal: 4. letnik SŠ maths with OR, VR or »še ne vem« gets matura, others nothing", () => {
  for (const r of [" OR", " VR", ""]) assert.deepEqual(privzetiCilj(SS4(r), "2026-11-20"), { goal: "matura", goal_date: "2027-05-29", goal_reminder: false }, r);
  assert.deepEqual(privzetiCilj({ ...SS4(), curriculum_level: "3. letnik VR" }), {});
  assert.deepEqual(privzetiCilj({ ...SS4(), subject: "FIZ" }), {});
  assert.deepEqual(privzetiCilj({ educational_track: "OSNOVNA_SOLA", curriculum_level: "9. razred" }), {});
  assert.deepEqual(privzetiCilj({ educational_track: "UNIVERZA", curriculum_level: "4. letnik" }), {});
  assert.deepEqual(privzetiCilj({ ...SS4(), school_system: "HR" }), {});
});

test("new profile: no goal chosen → matura with date and raven, reminder off; chosen goal stays and hides the offer", () => {
  const store = openDb(":memory:");
  for (const r of [" OR", " VR", ""]) {
    const s = store.createStudent("Ana", SS4(r)).settings;
    assert.equal(s.goal, "matura", r);
    assert.equal(s.goal_date, maturaDatum());
    assert.equal(s.goal_reminder, false, "brez samodejnega opomnika in e-pošte");
    assert.equal(s.curriculum_level, `4. letnik${r}`, "raven ostane");
    assert.ok(!ponudiMaturo(s));
  }
  const own = store.createStudent("Bor", { ...SS4(), goal: "sprotno" }).settings;
  assert.equal(own.goal, "sprotno");
  assert.equal(own.matura_offer, 1, "izbral sam: brez ponudbe");
  assert.ok(!ponudiMaturo(own));
  assert.equal(store.createStudent("Cene", { ...SS4(), curriculum_level: "3. letnik OR" }).settings.goal, "sprotno");
});

test("old profile with the default goal gets the offer until accepted or declined", () => {
  const old = { ...SS4(), goal: "sprotno", goal_date: "", goal_reminder: true };
  assert.ok(ponudiMaturo(old));
  assert.ok(!ponudiMaturo({ ...old, goal_date: "2027-03-01" }), "datum je izbral sam");
  assert.ok(!ponudiMaturo({ ...old, goal: "test" }));
  assert.ok(!ponudiMaturo({ ...old, matura_offer: 1 }));
  const store = openDb(":memory:");
  const id = store.db.prepare("INSERT INTO students (name, settings) VALUES ('Old', ?)").run(JSON.stringify(old)).lastInsertRowid;
  // »Ne, hvala« shrani samo oznako; oznaka ostane ob drugih spremembah.
  let s = store.updateStudent(Number(id), { settings: { matura_offer: 1 } }).settings;
  assert.equal(s.goal, "sprotno");
  assert.equal(s.matura_offer, 1);
  s = store.updateStudent(Number(id), { settings: { solving_mode: "B" } }).settings;
  assert.equal(s.matura_offer, 1);
  assert.ok(!ponudiMaturo(s));
});

test("intro (interests questionnaire and tour) only for primary school under 15", () => {
  const os = (y) => ({ settings: { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred" }, birth_year: y });
  assert.equal(brezUvoda(os(undefined), 2026), false);
  assert.equal(brezUvoda(os(2013), 2026), false);
  assert.equal(brezUvoda(os(2011), 2026), true, "15 let");
  assert.equal(brezUvoda({ settings: SS4() }, 2026), true);
  assert.equal(brezUvoda({ settings: { educational_track: "UNIVERZA", curriculum_level: "1. letnik" } }, 2026), true);
});

test("/path for goal matura: Danes data = due reviews, then the first »Najprej vadi« topic of the matura page", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const get = (p) => fetch(base + p).then((r) => r.json());
  try {
    const s = await fetch(base + "/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Eva", settings: SS4() }) }).then((r) => r.json());
    assert.equal(s.settings.goal, "matura");
    let p = await get(`/api/students/${s.id}/path`);
    const ex = await get(`/api/students/${s.id}/exams`);
    assert.ok(ex.readiness.weakest.length);
    assert.deepEqual(p.danes.next, { id: ex.readiness.weakest[0].id, name: ex.readiness.weakest[0].name }, "ista tema kot Najprej vadi");
    assert.equal(p.danes.due, 0);
    assert.equal(p.danes.minutes, 15);
    assert.equal(p.danes.odsoten, 0, "brez nalog ni vrnitve");
    // Tema poti, ki je na vrsti za ponavljanje, in zadnja naloga pred 8 dnevi.
    const topic = p.units[0].topics.find((t) => t.practice).id;
    const progress = new Progress(store);
    progress.markMastered(s.id, topic, "manual");
    store.db.prepare("UPDATE topic_state SET review_due = datetime('now', '-1 day') WHERE student_id = ?").run(s.id);
    store.db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, created_at) VALUES (?, ?, 1, '{}', datetime('now', '-8 days'))").run(s.id, topic);
    p = await get(`/api/students/${s.id}/path`);
    assert.equal(p.danes.due, 1);
    assert.equal(p.danes.review, 2);
    assert.equal(p.danes.minutes, 5);
    assert.equal(p.danes.odsoten, 8);
    // Drug cilj ali druga pot: brez kartice.
    assert.equal((await get(`/api/students/${s.id}/path?key=MAT-SS-1`)).danes, undefined);
    await fetch(base + `/api/students/${s.id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ settings: { goal: "sprotno" } }) });
    assert.equal((await get(`/api/students/${s.id}/path`)).danes, undefined);
  } finally {
    server.close();
  }
});
