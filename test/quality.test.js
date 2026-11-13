import test from "node:test";
import assert from "node:assert/strict";
import { checkAnswer } from "../server/practice/check.js";
import { hintSteps, publicTask } from "../server/practice/index.js";

test("checker names typical mistakes: generator list, sign, power of ten, reciprocal, factor 2", () => {
  const a = { type: "number", value: 2.5, unit: "kg", decimals: 2, mistakes: [{ value: 2500, why: "Si pretvoril g v kg?" }] };
  assert.equal(checkAnswer(a, "2500 kg").mistake.message, "Si pretvoril g v kg?");
  assert.equal(checkAnswer(a, "25 kg").mistake.code, "chk.magnitudeBig");
  assert.equal(checkAnswer(a, "0,025 kg").mistake.code, "chk.magnitudeSmall");
  assert.equal(checkAnswer(a, "-2,5 kg").mistake.code, "chk.sign");
  assert.equal(checkAnswer(a, "0,4 kg").mistake.code, "chk.reciprocal");
  assert.equal(checkAnswer(a, "5 kg").mistake.code, "chk.factor2Big");
  assert.equal(checkAnswer(a, "7 kg").mistake, undefined);
  assert.equal(checkAnswer(a, "2,50 kg").kind, "correct");
  const c = { type: "choice", options: ["a", "b", "c"], index: 1, why: ["a je napačno, ker …", null, "c …"] };
  assert.equal(checkAnswer(c, "0").mistake.message, "a je napačno, ker …");
  assert.equal(checkAnswer(c, "1").kind, "correct");
});

test("hint ladder: data → formula → first step", () => {
  const task = { text: "x", hint: "Najprej …", data: { given: ["m = 2"], find: ["F"] }, formula: "F = m g", answer: { type: "number", value: 1 } };
  assert.deepEqual(hintSteps(task).map((s) => s.kind), ["data", "formula", "hint"]);
  assert.equal(publicTask(task).hintSteps, 3);
  assert.deepEqual(hintSteps({ hint: "h" }).map((s) => s.kind), ["hint"]);
});

test("hint endpoint logic: steps open one by one, mark the task as helped", async () => {
  const { openDb } = await import("../server/db.js");
  const { Progress } = await import("../server/progress.js");
  const store = openDb(":memory:");
  const p = new Progress(store);
  const s = store.createStudent("Ana");
  p.nextPractice(s.id, "FIZ-OS-8/gostota"); // rešen zgled
  const { task } = p.nextPractice(s.id, "FIZ-OS-8/gostota");
  assert.ok(task.hintSteps >= 2);
  const h1 = p.hint(s.id, task.id, 1);
  assert.equal(h1.steps.length, 1);
  assert.equal(h1.steps[0].kind, "data");
  const all = p.hint(s.id, task.id, 9);
  assert.equal(all.steps.length, all.total);
  assert.equal(p.getTask(task.id).hint_used, 1);
});

test("fraction answers: listed mistakes and reciprocal", () => {
  const a = { type: "fraction", num: 3, den: 4, mistakes: [{ value: 3 / 7, why: "Imenovalcev ne seštevaj." }] };
  assert.equal(checkAnswer(a, "3/7").mistake.message, "Imenovalcev ne seštevaj.");
  assert.equal(checkAnswer(a, "4/3").mistake.code, "chk.reciprocal");
  assert.equal(checkAnswer(a, "3/4").kind, "correct");
  assert.equal(checkAnswer(a, "1/2").mistake, undefined);
});
