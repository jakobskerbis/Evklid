import test from "node:test";
import assert from "node:assert/strict";
import { levelFor, levelStart, levelProgress, crossedMilestone, reasonKey, cleanXpGoal } from "../public/xp-levels.js";
import SL from "../public/i18n/sl.js";
import { openDb } from "../server/db.js";
import { createSettingsTools } from "../server/chat-settings.js";

test("levels: same curve as before (level = ⌊√(XP/50)⌋ + 1), progress inside a level", () => {
  for (const total of [0, 1, 49, 50, 199, 200, 449, 450, 4049, 4050, 123456]) {
    assert.equal(levelFor(total), Math.floor(Math.sqrt(total / 50)) + 1, String(total));
    assert.ok(levelStart(levelFor(total)) <= total && total < levelStart(levelFor(total) + 1));
  }
  assert.deepEqual(levelProgress(125), { level: 2, from: 50, to: 200, pct: 50 });
  assert.deepEqual(levelProgress(0), { level: 1, from: 0, to: 50, pct: 0 });
});

test("milestones, daily goal values and XP reasons", () => {
  assert.equal(crossedMilestone(90, 110), 100);
  assert.equal(crossedMilestone(240, 1010), 1000, "največji prestopljeni");
  assert.equal(crossedMilestone(100, 120), null, "že prej dosežen");
  assert.equal(cleanXpGoal("100"), 100);
  assert.equal(cleanXpGoal(55), 50);
  for (const r of ["pravilno", "pravilno (s pomočjo)", "popravljena napaka", "obvladana tema", "preizkus znanja", "4 dni zapored"]) {
    const k = reasonKey(r);
    assert.ok(k && SL[k[0]], r);
  }
  assert.deepEqual(reasonKey("4 dni zapored"), ["xp.r.streak", { n: 4 }]);
  assert.equal(reasonKey("kaj drugega"), null);
});

test("tutor can change the daily XP goal (only allowed values)", async () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Ana");
  const t = createSettingsTools({ store, studentId: s.id, conversationId: 1, pending: new Map(), send: () => {} });
  const call = async (input) => JSON.parse((await t.onToolUse("change_settings", input)).content);
  assert.equal((await call({ changes: { xp_goal: "100" } })).status, "applied");
  assert.equal(store.getStudent(s.id).settings.xp_goal, 100);
  assert.equal((await call({ changes: { xp_goal: "75" } })).status, "error");
  assert.equal(store.getStudent(s.id).settings.xp_goal, 100);
  assert.equal(JSON.parse((await t.onToolUse("get_settings", {})).content).profile.xp_goal, "100");
});
