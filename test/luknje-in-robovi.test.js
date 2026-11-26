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

test("AUDIT-080 (pregled): rešitev ob polu ostane, ena rešitev ob luknji ni podvojena", () => {
  const one = (s, w) => {
    const got = roots(s);
    assert.equal(got.length, w.length, `${s}: ${got}`);
    w.forEach((x, i) => assert.ok(close(got[i], x, 1e-6), `${s}: ${got[i]} ≠ ${x}`));
  };
  one("1/x=50", [0.02]);
  one("1/x=10000", [0.0001]);
  one("1/(x-1)=100", [1.01]);
  one("1/(x-1)=10000", [1.0001]);
  one("x/(x-3)=1000", [1000 / 333]);
  one("1/(x^2-4)=30", [-Math.sqrt(4 + 1 / 30), Math.sqrt(4 + 1 / 30)]);
  one("1/x+x=100", [50 - Math.sqrt(2499), 50 + Math.sqrt(2499)]);
  one("(x^2-1)/(x-1)=1,99999", [0.99999]);
  one("(x^2-9)/(x+3)=-6,00001", [-3.00001]);
  one("(x^4-1)/(x^2-1)=2,0001", [-Math.sqrt(1.0001), Math.sqrt(1.0001)]);
  one("(x^2-10000)/(x-100)=200,00001", [100.00001]);
  one("√(x^2-2)=0", [-Math.SQRT2, Math.SQRT2]);
});

test("AUDIT-080 (pregled): luknje v e, v decimalki in v periodičnih enačbah", () => {
  for (const s of ["(x^2-e^2)/(x-e)=2e", "(x^2-1,23456^2)/(x-1,23456)=2,46912", "sin(2x)/sin(x)=2", "sin(2x)/sin(x)=-2", "tan(x)/sin(x)=1", "(1-cos(x))/sin(x)=0"]) {
    assert.equal(an(s).roots.length, 0, `${s}: ${an(s).roots}`);
  }
  // rešitev tik ob luknji se ne izpiše kot luknja (»≈ 1«)
  assert.match(solutionTex(an("(x^2-1)/(x-1)=2,0000001")), /1\{,\}0000001/);
});
