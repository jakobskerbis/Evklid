// Domači zaslon po cilju (public/goal-data.js): bližnjici na Učni poti in četrti zavihek na telefonu.
import test from "node:test";
import assert from "node:assert/strict";
import { goalShortcuts, goalTabbarView, goalsFor } from "../public/goal-data.js";

const os = (goal) => ({ school_system: "SI", educational_track: "OSNOVNA_SOLA", goal });
const ss = (goal) => ({ school_system: "SI", educational_track: "SREDNJA_SOLA", goal });

test("goal shortcuts: each school goal gets two shortcuts, exam goals go above the modes", () => {
  assert.deepEqual(goalShortcuts(os("sprotno")), { first: false, items: ["scan", "games"] });
  assert.deepEqual(goalShortcuts(os(undefined)), { first: false, items: ["scan", "games"] });
  assert.deepEqual(goalShortcuts(os("test")), { first: false, items: ["scan", "chat"] });
  assert.deepEqual(goalShortcuts(os("npz")), { first: true, items: ["exams", "scan"] });
  assert.deepEqual(goalShortcuts(ss("matura")), { first: true, items: ["exams", "scan"] });
  assert.deepEqual(goalShortcuts(ss("tekmovanje")), { first: true, items: ["tek", "contest"] });
  assert.deepEqual(goalShortcuts(os("neznano")), { first: false, items: ["scan", "games"] });
  // vsak cilj, ki ga šola ponudi, ima dve bližnjici
  for (const s of [os(), ss()]) for (const g of goalsFor(s)) assert.equal(goalShortcuts({ ...s, goal: g }).items.length, 2, g);
});

test("goal shortcuts: university and regional systems", () => {
  assert.deepEqual(goalShortcuts({ educational_track: "UNIVERZA", goal: "izpit" }), { first: true, items: ["textbook", "chat"] });
  assert.deepEqual(goalShortcuts({ educational_track: "UNIVERZA", goal: "sprotno" }), { first: false, items: ["textbook", "chat"] });
  assert.deepEqual(goalShortcuts({ school_system: "HR", educational_track: "SREDNJA_SOLA", goal: "izpit" }), { first: true, items: ["izpiti", "scan"] });
  assert.deepEqual(goalShortcuts({ school_system: "HR", educational_track: "SREDNJA_SOLA", goal: "test" }), { first: false, items: ["scan", "chat"] });
});

test("phone tab bar: fourth tab follows the goal", () => {
  assert.equal(goalTabbarView(os("sprotno"), { siExams: true }), "competition");
  assert.equal(goalTabbarView(os("npz"), { siExams: true }), "exams");
  assert.equal(goalTabbarView(ss("matura"), { siExams: true }), "exams");
  assert.equal(goalTabbarView(ss("matura"), { siExams: false }), "competition");
  assert.equal(goalTabbarView(ss("tekmovanje"), { siExams: true }), "competition");
  assert.equal(goalTabbarView({ educational_track: "UNIVERZA", goal: "tekmovanje" }), null);
  assert.equal(goalTabbarView({ school_system: "HR", goal: "tekmovanje" }), "competition");
});
