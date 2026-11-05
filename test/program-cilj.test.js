// Izbirnik »Program« je odstranjen (j, 4. 11. 2026, »Samo Cilj«): track se izpelje iz cilja.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { normalizeSettings } from "../server/settings.js";
import { openDb, migrateTrackToGoal } from "../server/db.js";

const OS = { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred" };
const SS = { educational_track: "SREDNJA_SOLA", curriculum_level: "3. letnik VR" };

test("track follows the goal: tekmovanje = COMPETITION, every other goal = REGULAR", () => {
  assert.equal(normalizeSettings({ ...OS, goal: "tekmovanje" }).track, "COMPETITION");
  assert.equal(normalizeSettings({ ...SS, goal: "tekmovanje" }).track, "COMPETITION");
  for (const goal of ["sprotno", "test", "npz"]) assert.equal(normalizeSettings({ ...OS, goal }).track, "REGULAR", goal);
  assert.equal(normalizeSettings({ ...SS, goal: "matura" }).track, "REGULAR");
  // Stari zapis track brez cilja ne vklopi več tekmovalnega načina mimo cilja.
  assert.equal(normalizeSettings({ ...OS, track: "COMPETITION", goal: "test" }).track, "REGULAR");
  // Fakulteta nima cilja tekmovanje.
  assert.equal(normalizeSettings({ educational_track: "UNIVERZA", curriculum_level: "1. letnik", goal: "tekmovanje" }).track, "REGULAR");
});

test("migration: old Program = Tekmovanja keeps competition mode; an explicit other goal wins", () => {
  const store = openDb(":memory:");
  const put = (settings) => {
    const r = store.db.prepare("INSERT INTO students (name, settings) VALUES (?, ?)").run("x", JSON.stringify(settings));
    return Number(r.lastInsertRowid);
  };
  const plain = put({ ...OS, track: "COMPETITION", goal: "sprotno" });
  const noGoal = put({ ...SS, track: "COMPETITION" });
  const matura = put({ ...SS, track: "COMPETITION", goal: "matura" });
  const faks = put({ educational_track: "UNIVERZA", curriculum_level: "1. letnik", study_program: "", track: "COMPETITION" });
  const regular = put({ ...OS, track: "REGULAR", goal: "sprotno" });

  assert.equal(migrateTrackToGoal(store.db), 4);
  const s = (id) => store.getStudent(id).settings;
  assert.equal(s(plain).goal, "tekmovanje");
  assert.equal(s(plain).track, "COMPETITION");
  assert.equal(s(noGoal).goal, "tekmovanje");
  assert.equal(s(matura).goal, "matura");
  assert.equal(s(matura).track, "REGULAR");
  assert.equal(s(faks).goal, "sprotno");
  assert.equal(s(faks).track, "REGULAR");
  assert.equal(s(regular).goal, "sprotno");
  // Enkratno: drugi zagon ne najde več nobene vrstice, ki bi jo bilo treba prepisati.
  assert.equal(migrateTrackToGoal(store.db), 0, "second start rewrites nothing");
  assert.equal(s(plain).goal, "tekmovanje");

  // Učenec po selitvi sam izbere drug cilj: ostane pri njem (selitev ga ne vrne na tekmovanje).
  store.updateStudent(plain, { settings: { goal: "test" } });
  assert.equal(s(plain).goal, "test");
  assert.equal(s(plain).track, "REGULAR");
  migrateTrackToGoal(store.db);
  assert.equal(s(plain).goal, "test");
});

test("Settings no longer show a separate Program selector", () => {
  const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
  assert.doesNotMatch(html, /name="track"/);
  assert.doesNotMatch(html, /id="track-row"/);
});
