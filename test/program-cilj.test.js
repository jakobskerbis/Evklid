// Program (redni pouk / tekmovanja) ni več posebna izbira v Nastavitvah, sledi cilju (j, 4. 11.).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { normalizeSettings } from "../server/settings.js";
import { createSettingsTools } from "../server/chat-settings.js";

const OS = { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" };
const SS = { educational_track: "SREDNJA_SOLA", curriculum_level: "3. letnik gimnazija", subject: "MAT" };

test("Settings have no separate Program picker; the goal chips decide", () => {
  const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
  assert.ok(!html.includes('name="track"'), "izbirnik Program je spet v Nastavitvah");
  assert.ok(!html.includes('id="track-row"'));
});

test("track follows the goal: Tekmovanje = competition, every other goal = regular school", () => {
  assert.equal(normalizeSettings({ ...OS, goal: "tekmovanje" }).track, "COMPETITION");
  assert.equal(normalizeSettings({ ...OS, goal: "npz" }).track, "REGULAR");
  assert.equal(normalizeSettings({ ...SS, goal: "matura" }).track, "REGULAR");
  assert.equal(normalizeSettings({ ...OS }).track, "REGULAR");
  // fakulteta in regijski sistemi: tekmovanj ni
  assert.equal(normalizeSettings({ educational_track: "UNIVERZA", curriculum_level: "1. letnik", goal: "tekmovanje", track: "COMPETITION" }).track, "REGULAR");
  assert.equal(normalizeSettings({ school_system: "DE", track: "COMPETITION" }).track, "REGULAR");
});

test("old profiles with Program »Tekmovanja« get the goal Tekmovanje", () => {
  const s = normalizeSettings({ ...SS, track: "COMPETITION", goal: "matura", goal_date: "2027-05-01" });
  assert.equal(s.goal, "tekmovanje");
  assert.equal(s.track, "COMPETITION");
  assert.equal(s.goal_date, "2027-05-01");
});

test("changing the goal in Settings switches competition mode on and off", () => {
  const store = openDb(":memory:");
  const st = store.createStudent("Ana", { ...SS, track: "COMPETITION" });
  assert.equal(store.getStudent(st.id).settings.goal, "tekmovanje");
  // nov cilj iz Nastavitev (odjemalec track ne pošlje več)
  let s = store.updateStudent(st.id, { settings: { goal: "matura" } }).settings;
  assert.equal(s.goal, "matura");
  assert.equal(s.track, "REGULAR");
  s = store.updateStudent(st.id, { settings: { goal: "tekmovanje" } }).settings;
  assert.equal(s.track, "COMPETITION");
  // druga sprememba brez cilja tekmovalni način pusti
  s = store.updateStudent(st.id, { settings: { solving_mode: "B" } }).settings;
  assert.equal(s.track, "COMPETITION");
  assert.equal(s.goal, "tekmovanje");
});

test("tutor: track in chat changes the goal too", async () => {
  const store = openDb(":memory:");
  const st = store.createStudent("Bor", { ...OS, goal: "npz" });
  const t = createSettingsTools({ store, studentId: st.id, conversationId: 1, pending: new Map(), send: () => {} });
  const call = async (input) => JSON.parse((await t.onToolUse("change_settings", input)).content);
  let r = await call({ changes: { track: "COMPETITION" } });
  assert.equal(r.status, "applied");
  assert.equal(store.getStudent(st.id).settings.goal, "tekmovanje");
  assert.equal(store.getStudent(st.id).settings.track, "COMPETITION");
  r = await call({ changes: { track: "REGULAR" } });
  assert.equal(store.getStudent(st.id).settings.goal, "sprotno");
  assert.equal(store.getStudent(st.id).settings.track, "REGULAR");
});
