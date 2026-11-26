// AUDIT-081: ničla na robu definicijskega območja (√x = 0) se ne sme izgubiti.
// AUDIT-080: luknja v definicijskem območju ((x² − 1)/(x − 1) pri x = 1) ni rešitev, rešitev tik ob njej pa je.
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, solutionTex } from "../public/graph/scisolve.js";

const an = (s) => analyze(s, { comma: true });
const close = (a, b, eps = 1e-8) => Math.abs(a - b) <= eps * Math.max(1, Math.abs(b));
const roots = (s) => {
  const r = an(s);
  assert.equal(r.kind, "solve", s);
  return r.roots;
};

test("AUDIT-081: ničla na robu definicijskega območja", () => {
  for (const [s, want] of [
    ["√x=0", [0]],
    ["√(x)=0", [0]],
    ["√(x-4)=0", [4]],
    ["√(x^2-4)=0", [-2, 2]],
    ["√(x)+√(-x)=0", [0]],
    ["√(9-x^2)=0", [-3, 3]],
  ]) {
    const got = roots(s);
    assert.equal(got.length, want.length, `${s}: ${got}`);
    want.forEach((w, i) => assert.ok(close(got[i], w), `${s}: ${got[i]} ≠ ${w}`));
    // zapis je točen (x = 0), ne »x ∉ [−10¹²; 10¹²]«
    assert.doesNotMatch(solutionTex(an(s)), /notin/, s);
  }
  // obstoječe vedenje ostane: √x = 20 (AUDIT-015), √x = −1 nima rešitve
  assert.ok(close(roots("√x=20")[0], 400));
  assert.equal(roots("√x=-1").length, 0);
});

test("AUDIT-080: luknja ni rešitev", () => {
  for (const s of ["(x^2-1)/(x-1)=2", "(x^2-2)/(x-√2)=2√2", "(4x^2-1)/(2x-1)=2", "(x^2-10^6)/(x-1000)=2000", "sin(x)/x=1", "(1-cos(x))/x^2=0,5", "x^2/x=0"]) {
    const r = an(s);
    assert.equal(r.roots.length, 0, `${s}: ${r.roots}`);
    assert.match(solutionTex(r), /notin|varnothing/, s);
  }
});

test("AUDIT-080: rešitev tik ob luknji se najde", () => {
  for (const [s, w] of [
    ["(x^2-1)/(x-1)=2,0001", 1.0001],
    ["(x^2-1)/(x-1)=1,9999", 0.9999],
    ["(x^2-9)/(x-3)=6,0001", 3.0001],
    ["(x^2-1)/(x-1)=2,0000001", 1.0000001],
    ["(x^2-2)/(x-√2)=2√2+0,001", Math.SQRT2 + 0.001],
    ["(x^2-10^6)/(x-1000)=2000,5", 1000.5],
    ["x^2/x=0,001", 0.001],
    ["sin(x)/x=0,9999", 0.024495],
  ]) {
    const got = roots(s).filter((x) => x > 0);
    assert.equal(got.length, 1, `${s}: ${got}`);
    assert.ok(close(got[0], w, 1e-5), `${s}: ${got[0]} ≠ ${w}`);
  }
});

test("AUDIT-080: ostale rešitve ob luknji ostanejo, pol ni rešitev", () => {
  assert.deepEqual(roots("(x^3-1)/(x-1)=3"), [-2]);
  assert.deepEqual(roots("(x^2-1)/(x-1)=5"), [4]);
  assert.deepEqual(roots("(4x^2-1)/(2x-1)=3"), [1]);
  assert.equal(roots("1/(x-1)=0").length, 0);
  assert.deepEqual(roots("x^3-x=0"), [-1, 0, 1]);
});
