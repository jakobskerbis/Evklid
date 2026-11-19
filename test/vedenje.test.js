// Točka 8 načrta izboljšav (19. 11. 2026): merjenje vedenja v skrbniškem poročilu rasti (server/rast.js vedenjeReport):
// delež aktivnih dni z rešeno nalogo in delež testov (urnik in priprava na test), pred katerimi je bil učenec aktiven.
// Zagon: node --test test/vedenje.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { growthReport, PRED_TESTOM_DNI } from "../server/rast.js";
import { Schedules } from "../server/schedule.js";
import { seal } from "../server/crypto-polje.js";

test("vedenje: dnevi z rešeno nalogo in aktivnost pred testom", () => {
  const { db } = openDb(":memory:");
  new Schedules(db); // ustvari tabelo schedules
  const DAY = 86400000;
  const now = Date.now();
  const midnight = Date.parse(new Date(now).toISOString().slice(0, 10));
  const at = (daysAgo, h = 10) => new Date(midnight - daysAgo * DAY + h * 3600000).toISOString().replace("T", " ").slice(0, 19);
  const day = (daysAgo) => at(daysAgo).slice(0, 10);
  const student = (name) => db.prepare("INSERT INTO students (name, settings, created_at) VALUES (?, '{}', ?)").run(name, at(40, 8)).lastInsertRowid;
  const ask = (s, daysAgo) => {
    const c = db.prepare("INSERT INTO conversations (student_id, created_at, updated_at) VALUES (?, ?, ?)").run(s, at(daysAgo), at(daysAgo)).lastInsertRowid;
    db.prepare("INSERT INTO messages (conversation_id, role, api_content, display_text, created_at) VALUES (?, 'user', '\"x\"', 'x', ?)").run(c, at(daysAgo));
  };
  const task = (s, daysAgo, solved) =>
    db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, solved, created_at) VALUES (?, 'MAT-SS-4-x', 1, '{}', ?, ?)").run(s, solved ? 1 : 0, at(daysAgo));

  // Ana: aktivna 3 dni (10, 9, 2 dni nazaj), naloge rešila 10 in 2 dni nazaj; test v urniku pred 1 dnevom.
  const ana = student("Ana");
  ask(ana, 10);
  task(ana, 10, true);
  ask(ana, 9);
  task(ana, 9, false);
  ask(ana, 2);
  task(ana, 2, true);
  db.prepare("INSERT INTO schedules (student_id, data) VALUES (?, ?)").run(
    ana,
    seal(JSON.stringify({ lessons: [], events: [{ date: day(1), kind: "test", name: "Matematika" }, { date: day(5), kind: "dogodek", name: "izlet" }] })),
  );
  // Bor: aktiven 1 dan (20 dni nazaj), test iz priprave na test pred 8 dnevi: pred njim ni bil aktiven.
  const bor = student("Bor");
  ask(bor, 20);
  db.prepare("INSERT INTO test_plans (student_id, path_key, units, test_date) VALUES (?, 'MAT-SS-4', '[]', ?)").run(bor, day(8));

  const v = growthReport(db, { days: 30, now }).vedenje;
  assert.equal(PRED_TESTOM_DNI, 3);
  assert.deepEqual([v.activeDays, v.solvedDays], [4, 2]);
  assert.equal(v.solvedPct, 0.5);
  assert.deepEqual([v.tests, v.beforeTest, v.beforeTestPct, v.days], [2, 1, 0.5, 3], "izlet ni test; Ana je bila aktivna 2 dni pred testom, Bor ne");
});

test("vedenje: test na prvi dan obdobja šteje aktivnost pred obdobjem (7 dni: začetek tedna = začetek obdobja)", () => {
  const { db } = openDb(":memory:");
  const DAY = 86400000;
  const now = Date.now();
  const midnight = Date.parse(new Date(now).toISOString().slice(0, 10));
  const at = (daysAgo) => new Date(midnight - daysAgo * DAY + 10 * 3600000).toISOString().replace("T", " ").slice(0, 19);
  const s = db.prepare("INSERT INTO students (name, settings, created_at) VALUES ('Cene', '{}', ?)").run(at(40)).lastInsertRowid;
  const c = db.prepare("INSERT INTO conversations (student_id, created_at, updated_at) VALUES (?, ?, ?)").run(s, at(8), at(8)).lastInsertRowid;
  db.prepare("INSERT INTO messages (conversation_id, role, api_content, display_text, created_at) VALUES (?, 'user', '\"x\"', 'x', ?)").run(c, at(8));
  db.prepare("INSERT INTO test_plans (student_id, path_key, units, test_date) VALUES (?, 'MAT-SS-4', '[]', ?)").run(s, at(6).slice(0, 10));
  const r = growthReport(db, { days: 7, now });
  assert.deepEqual([r.vedenje.tests, r.vedenje.beforeTest, r.vedenje.activeDays], [1, 1, 0], "aktivnost 8 dni nazaj je 2 dni pred testom 6 dni nazaj, a izven obdobja");
  assert.deepEqual([r.weeklyActive, r.activeProfiles ?? 0], [0, 0], "aktivnost pred obdobjem ne šteje med aktivne v tednu");
});

test("vedenje: brez podatkov ni deljenja z nič", () => {
  const { db } = openDb(":memory:");
  const v = growthReport(db, { days: 30 }).vedenje;
  assert.deepEqual(v, { activeDays: 0, solvedDays: 0, solvedPct: null, tests: 0, beforeTest: 0, beforeTestPct: null, days: 3 });
});
