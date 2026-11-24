// AUDIT-049: izguba natančnosti v plavajoči vejici. √(10¹⁶ + 1) − 10⁸ je dal »= 0« (≈ 5·10⁻⁹), 1 − cos(10⁻⁸) »= 0«,
// √(10¹⁰ + 1) − 10⁵ = 0,00000499999441672 (pravilnih 5 mest), ln(e¹⁰⁰⁰) »ni definiran«. Pričakovano: mpmath (40 mest).
import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate } from "../public/graph/scicore.js";
import { analyze } from "../public/graph/scisolve.js";
import { precise } from "../public/graph/natancnost.js";
import { compileLine } from "../public/graph/scicore.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);

// [vhod, vrednost (mpmath), ali je opomba »Računano z večjo natančnostjo«]
const CASES = [
  ["sqrt(10^16+1)-10^8", 5e-9, true],
  ["1-cos(10^(-8))", 5e-17, true],
  ["ln(e^(1000))", 1000, true],
  ["e^(1000)/e^(999)", 2.718281828459045, true],
  ["sqrt(10^10+1)-10^5", 4.999999999875e-6, true],
  ["sqrt(10^12+1)-10^6", 4.99999999999875e-7, true],
  ["(10^16+1)-10^16", 1, true],
  ["1000000,1-1000000", 0.1, true],
  ["π-3,141592653589793", 2.384626433832795e-16, true],
  ["e^(10^(-10))-1", 1.00000000005e-10, true],
  ["tan(1,5707963)", 37320539.58671654, true],
  // pravilni že prej: vrednost ostane, brez opombe
  ["sin(10^20)", -0.6452512852657808, false],
  ["(1/3)·3-1", 0, false],
  ["sin(π)", 0, false],
  ["2+3", 5, false],
  ["(-32)^(2/5)", 4, false],
  ["log_2(1/8)", -3, false],
  ["ln(e^(100))", 100, false],
];

for (const [text, want, note] of CASES)
  test(`AUDIT-049: ${text}`, () => {
    const r = evaluate(text, { ...ENV });
    assert.ok(!r.error, JSON.stringify(r));
    assert.ok(want === 0 ? r.value === 0 : rel(r.value, want) < 1e-14, `${r.value} ≠ ${want}`);
    assert.equal(!!r.precision, note);
    // analyze (zaslon kalkulatorja) da isto
    const a = analyze(text, { ...ENV });
    assert.equal(a.kind, "value");
    assert.equal(a.value, r.value);
  });

// šum zaokrožitve okoli 0 je 0 (√2² − 2 je bil 4,44·10⁻¹⁶)
test("AUDIT-049: √2² − 2 = 0", () => {
  assert.equal(evaluate("sqrt(2)^2-2", { ...ENV }).value, 0);
});

// kar ni definirano, ostane nedefinirano (ne izmislimo vrednosti)
test("AUDIT-049: nedefinirano ostane", () => {
  for (const t of ["tan(π/2)", "sqrt(-1)", "ln(0)", "1/0"]) {
    const r = evaluate(t, { ...ENV });
    assert.ok(r.error || !Number.isFinite(r.value), `${t}: ${JSON.stringify(r)}`);
  }
  assert.ok(Number.isNaN(evaluate("tan(90°)", { ...ENV, deg: true }).value));
});

// stopinje: sin 30° = 0,5 natančno
test("AUDIT-049: stopinje in gradi", () => {
  assert.ok(rel(evaluate("sin(30)", { ...ENV, deg: true }).value, 0.5) < 1e-15);
  assert.equal(evaluate("cos(100)", { ...ENV, grad: true }).value, 0);
  assert.ok(rel(evaluate("sin(30°)", { ...ENV }).value, 0.5) < 1e-15);
  assert.ok(rel(evaluate("1-cos(10^(-6))", { ...ENV, deg: true }).value, 1.523087098933543e-16) < 1e-12);
});

// drevo z delom, ki ga natančni račun ne pozna, vrne null (ostane navadni izračun)
test("AUDIT-049: neznani deli vrnejo null", () => {
  for (const t of ["arcsin(0,5)", "sum(k; k; 1; 10)", "floor(2,5)", "mod(7;3)"]) {
    const l = compileLine(t, { comma: true });
    assert.equal(precise(l.rw(l.ast), l.scope), null, t);
  }
});

// časovna meja: velike potence ne zamrznejo kalkulatorja
test("AUDIT-049: hitro tudi pri velikih številih", () => {
  const t0 = Date.now();
  for (const t of ["2^100000", "100!-99!", "e^(700)-e^(699)", "sqrt(10^300+1)-10^150", "sin(10^300)"]) evaluate(t, { ...ENV });
  assert.ok(Date.now() - t0 < 1500, `${Date.now() - t0} ms`);
});
