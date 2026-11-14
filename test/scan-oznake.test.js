// Skeniranje (j 14. 11. 2026): oznaka operacije stoji ob vrstici, na katero jo uporabimo; rešitev (interval ali
// točka) je označena tudi na grafu. public/scan/solvecore.js izvorOznak, oznakaGrafa.
import test from "node:test";
import assert from "node:assert/strict";
import { solve, izvorOznak, oznakaGrafa } from "../public/scan/solvecore.js";

const izvori = (text) => {
  const r = solve(text);
  const steps = r.methods[0].steps;
  const f = izvorOznak(steps, r.problemTex);
  return steps.map((s, i) => s.note && [f[i], s.note, s.tex]).filter(Boolean);
};

test("the operation stands beside the line it is applied to, the result below", () => {
  assert.deepEqual(izvori("x^2<4")[0], ["x^{2} < 4", "/ -4", "x^{2} - 4 < 0"]);
  const lin = izvori("2x+3=7");
  assert.equal(lin[0][0], "2x + 3 = 7");
  assert.equal(lin[1][0], "2x = 4");
});

test("a condition such as x ≠ 0 is never the line the operation is applied to", () => {
  const [first] = izvori("1/x+1/2=1");
  assert.equal(first[0], "\\frac{1}{x} + \\frac{1}{2} = 1");
});

test("steps without a note get no line before them", () => {
  const r = solve("x^2<4");
  const f = izvorOznak(r.methods[0].steps, r.problemTex);
  r.methods[0].steps.forEach((s, i) => s.note || assert.equal(f[i], null));
});

test("the graph marks the solution: interval for an inequality, points for an equation", () => {
  assert.deepEqual(oznakaGrafa(solve("x^2<4")), { intervals: [{ lo: -2, hi: 2, loClosed: false, hiClosed: false }] });
  assert.deepEqual(oznakaGrafa(solve("4x^2+8x-12<=0")).intervals[0], { lo: -3, hi: 1, loClosed: true, hiClosed: true });
  assert.deepEqual(oznakaGrafa(solve("2x-4<0")).intervals[0], { lo: null, hi: 2, loClosed: false, hiClosed: false });
  assert.deepEqual(oznakaGrafa(solve("x^2+2x+1<=0")).intervals, [{ point: -1 }]);
  assert.deepEqual(oznakaGrafa(solve("x^2-5x+6=0")), { points: [2, 3], curves: false });
  assert.deepEqual(oznakaGrafa(solve("2x+3=7")), { points: [2], curves: true });
  assert.ok(Math.abs(oznakaGrafa(solve("3x=2")).points[0] - 2 / 3) < 1e-12);
  assert.equal(oznakaGrafa(solve("x^2+1<0")), null); // prazna množica: ničesar
});
