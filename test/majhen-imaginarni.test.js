// AUDIT-045: (x − 1)² + 10⁻²⁰ = 0 je kazal x₁ = 1, x₂ = 1 (prave rešitve 1 ± 10⁻¹⁰ i), x² + 10⁻³⁰ = 0 pa x = 0.
// Koeficienti so točni ulomki, zato je par točno kompleksen. Pričakovano: SymPy roots().
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, solutionTex } from "../public/graph/scisolve.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
const close = (a, b) => Math.abs(a - b) <= 1e-12 * Math.max(Math.abs(a), Math.abs(b), 1e-300);

test("kompleksni par z zelo majhnim imaginarnim delom (SymPy)", () => {
  // [enačba, realne, kompleksne [re, im]]
  const CASES = [
    ["(x−1)^2+10^(−20)=0", [], [[1, -1e-10], [1, 1e-10]]],
    ["x^2+10^(−30)=0", [], [[0, -1e-15], [0, 1e-15]]],
    ["(x−1)((x−1)^2+10^(−20))=0", [1], [[1, -1e-10], [1, 1e-10]]],
    ["(x−3)^2+10^(−12)=0", [], [[3, -1e-6], [3, 1e-6]]],
    ["x^2−2x+1+10^(−16)=0", [], [[1, -1e-8], [1, 1e-8]]],
    ["(x+2)^2+4·10^(−18)=0", [], [[-2, -2e-9], [-2, 2e-9]]],
  ];
  for (const [t, real, cx] of CASES) {
    const r = analyze(t, ENV);
    assert.deepEqual(r.roots, real, t);
    assert.equal(r.complex.length, cx.length, `${t}: ${JSON.stringify(r.complex)}`);
    r.complex.forEach(([a, b], i) => assert.ok(close(a, cx[i][0]) && close(b, cx[i][1]), `${t}: ${a} ${b}`));
  }
});

test("zapis pokaže imaginarni del, ne 0", () => {
  assert.equal(solutionTex(analyze("(x−1)^2+10^(−20)=0", ENV)), "x_{1} = 1-1\\cdot 10^{-10}\\,i,\\quad x_{2} = 1+1\\cdot 10^{-10}\\,i");
  assert.equal(solutionTex(analyze("(x−1)^2=0", ENV)), "x_{1,2} = 1\\;(\\text{dvojna rešitev})"); // AUDIT-032
  assert.equal(solutionTex(analyze("x^2+1=0", ENV)), "x_{1,2} = \\pm i");
});
