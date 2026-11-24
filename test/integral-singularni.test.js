// AUDIT-007: integrabilne singularnosti na robu so bile netočne in prikazane z »=« na 11 mest:
// ∫(1/√x; 0; 1) = 2,00102320794 (točno 2), ∫(1/√(1 − x²); −1; 1) = 3,14364 (π).
// Zdaj: točna vrednost, kadar znamo nedoločeni integral (preverjen z odvodom in s številskim izidom),
// sicer tanh-sinh z oceno napake, approx/est (»≈«) in samo zanesljiva mesta. Pričakovano: SymPy.
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../public/graph/scisolve.js";
import { reliable } from "../public/graph/scicore.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };

// točni (prek F(b) − F(a)): [vnos, SymPy]
const EXACT = [
  ["∫(1/√(x);0;1)", 2],
  ["∫(1/√(1−x^2);−1;1)", Math.PI],
  ["∫(ln(x);0;1)", -1],
  ["∫(x·ln(x);0;1)", -0.25],
  ["∫(1/√(4−x^2);0;2)", Math.PI / 2],
  ["∫(1/∛(x);−1;1)", 0],
  ["∫(1/∛(x);0;8)", 6],
  ["∫(1/√(x−1);1;2)", 2],
  ["∫(1/√(1−x);0;1)", 2],
  ["∫(x^(−0,7);0;1)", 10 / 3],
  ["∫(1/√(x);1;0)", -2],
  ["∫(arcsin(x)/√(1−x^2);0;1)", 1.2337005501361698],
];
// približki (tanh-sinh): [vnos, SymPy N(Integral)]
const NUMERIC = [
  ["∫(1/√(sin(x));0;1)", 2.0348053192075697],
  ["∫(e^(−x)/√(x);0;1)", 1.4936482656248541],
  ["∫(ln(sin(x));0;π/2)", -1.0887930451518011],
  ["∫(1/((x+1)√(x));0;1)", 1.5707963267948966],
  ["∫(1/√(x(1−x));0;1)", Math.PI],
  ["∫(ln(x)^2;0;1)", 2],
];

test("integrabilne singularnosti: točna vrednost, kjer jo znamo (SymPy)", () => {
  for (const [t, want] of EXACT) {
    const r = analyze(t, ENV);
    assert.equal(r.kind, "value", `${t}: ${JSON.stringify(r)}`);
    assert.ok(Math.abs(r.value - want) <= 4e-15 * Math.max(1, Math.abs(want)), `${t}: ${r.value} ≠ ${want}`);
    assert.ok(!r.approx && !r.est, `${t}: točno, ne približek`);
  }
  assert.equal(analyze("∫(1/√(x);0;1)", ENV).value, 2);
  assert.equal(analyze("∫(1/√(1−x^2);−1;1)", ENV).value, Math.PI);
});

test("integrabilne singularnosti brez nedoločenega integrala: ≈ in samo pravilna mesta", () => {
  for (const [t, want] of NUMERIC) {
    const r = analyze(t, ENV);
    assert.equal(r.kind, "value", t);
    assert.ok(r.approx && r.est, `${t}: približek`);
    const digits = Math.abs(r.value).toPrecision(15).replace(/^0\.0*|\.|e.*$/g, "").replace(/0+$/, "").length;
    assert.ok(digits <= 12, `${t}: ${r.value} (${digits} mest, ne vseh 16)`);
    assert.ok(Math.abs(r.value - want) <= 1e-6 * Math.max(1, Math.abs(want)), `${t}: ${r.value} ≠ ${want}`);
    const ulp = 10 ** (Math.floor(Math.log10(Math.abs(r.value))) - digits + 1);
    assert.ok(Math.abs(r.value - want) <= ulp, `${t}: ${r.value} ni pravilen na vseh mestih (${want})`);
  }
});

test("reliable: zaokroži na mesta, ki jih dopušča napaka", () => {
  assert.equal(reliable(3.141592661727853, 4.2e-8), 3.141593); // log₁₀(π/4,2·10⁻⁸) ≈ 7,9 → 7 mest
  assert.equal(reliable(2.0348053192, 1e-10), 2.034805319);
  assert.equal(reliable(5, 0), 5);
  assert.equal(reliable(0.504077, 1.6e-4), 0.504);
});

test("navadni integrali niso približki (brez ≈)", () => {
  for (const t of ["∫(x^2;0;1)", "∫(sin(x);0;π)", "∫(e^x;0;1)"]) {
    const r = analyze(t, ENV);
    assert.ok(!r.approx && !r.est, t);
  }
});
