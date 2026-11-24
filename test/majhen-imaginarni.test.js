// AUDIT-045: (x − 1)² + 10⁻²⁰ = 0 je kazal x₁ = 1, x₂ = 1 (prave rešitve 1 ± 10⁻¹⁰ i), x² + 10⁻³⁰ = 0 pa x = 0.
// Koeficienti so točni ulomki, zato je par točno kompleksen. Pričakovano: SymPy roots().
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, solutionTex } from "../public/graph/scisolve.js";
import fs from "node:fs";

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

// Pregled #979: pri gručah stopnje ≥ 3 so bile realne in kompleksne ničle napačne (z »=«). Zdaj realne točno
// (Sturm in bisekcija na točnem polinomu), kompleksne s točnim Newtonom (Maehly) in polmerom napake.
test("gruče stopnje ≥ 3: realne točno, kompleksne z napako, nikoli lažni »=« (mpmath)", () => {
  const a = analyze("x^3−3x^2+3x−1+10^(−30)=0", ENV);
  assert.deepEqual(a.roots, [0.9999999999]);
  assert.ok(a.complex.every(([re, im]) => Math.abs(re - 1.00000000005) < 1e-20 && Math.abs(Math.abs(im) - 8.660254037844386e-11) < 1e-24));
  const tex = solutionTex(a);
  assert.ok(!tex.includes("= 1,") && !/x_\{\d\} = /.test(tex), tex); // vse z ≈
  const b = analyze("((x−4/3)^4−10^(−25))=0", ENV);
  assert.equal(b.roots.length, 2);
  assert.ok(Math.abs(b.roots[0] - (4 / 3 - 5.623413251903491e-7)) < 1e-15 && Math.abs(b.roots[1] - (4 / 3 + 5.623413251903491e-7)) < 1e-15);
  assert.equal(b.complex.length, 2);
});

// 500 naključnih gruč ((x − a)^k ± 10^(−e))·(drug faktor), k ≤ 4, e ≤ 30 (seme pregledovalca), ničle iz mpmath na
// 120 mest: pravo število realnih in kompleksnih ter vrednosti na 1e-11. Pred popravkom 369/500.
test("500 gruč iz mpmath: vse pravilne", () => {
  const cases = JSON.parse(fs.readFileSync(new URL("./fixtures/gruce-mpmath.json", import.meta.url)));
  let ok = 0;
  const bad = [];
  for (const c of cases) {
    const r = analyze(c.fac, ENV);
    const R = [];
    (r.roots || []).forEach((x, i) => {
      for (let t = 0; t < (r.mult?.[i] || 1); t++) R.push(x);
    });
    const C2 = [];
    [...(r.complex || [])].forEach((z, j) => {
      for (let t = 0; t < (r.cmult?.[j] || 1); t++) C2.push(z);
    });
    C2.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const good =
      R.length === c.real.length &&
      C2.length === c.cx.length &&
      R.every((x, i) => Math.abs(x - c.real[i]) <= 1e-11) &&
      C2.every((z, i) => Math.hypot(z[0] - c.cx[i][0], z[1] - c.cx[i][1]) <= 1e-11);
    if (good) ok++;
    else if (bad.length < 5) bad.push(c.fac);
  }
  assert.equal(ok, cases.length, JSON.stringify(bad));
});

test("redki polinomi: Sturmova veriga s pravim predznakom (hitro in pravilno, SymPy)", () => {
  // (5x⁶ − 24)(5x² − 32) = 0: realne ±(24/5)^(1/6), ±√(32/5)
  const t0 = performance.now();
  const r = analyze("(5x^6−24)(5x^2−32)=0", ENV);
  assert.ok(performance.now() - t0 < 1000, "prej ~60 s");
  const a = (24 / 5) ** (1 / 6);
  const b = Math.sqrt(32 / 5);
  assert.deepEqual(r.roots.map((x) => Number(x.toPrecision(13))), [-b, -a, a, b].map((x) => Number(x.toPrecision(13))));
  assert.equal(r.complex.length, 4);
  const s = analyze("(x−4)(x^6−20)(7x^2−40)=0", ENV);
  assert.equal(s.roots.length, 5);
  assert.equal(s.roots[4], 4);
});
