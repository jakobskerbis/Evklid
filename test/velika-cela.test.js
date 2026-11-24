// AUDIT-050: celo število nad 2⁵³ je bilo prikazano zaokroženo z »=«: nCr(100; 50) = 1,008913445·10²⁹ (točno
// 100891344545564193334812497256). Zdaj evaluate da točne števke (big, BigInt kot besedilo) ali oznako približka
// (bigApprox), sci.js pa do 40 mest vse števke z »=«, sicer »≈«. Pričakovano: SymPy binomial, 2**n, factorial.
import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate } from "../public/graph/scicore.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };

const EXACT = [
  ["nCr(100;50)", "100891344545564193334812497256"],
  ["2^60", "1152921504606846976"],
  ["nCr(60;30)", "118264581564861424"],
  ["2^53+1", "9007199254740993"],
  ["-(2^60)", "-1152921504606846976"],
  ["nPr(30;15)", "202843204931727360000"],
  ["10^20", "100000000000000000000"],
];
for (const [text, want] of EXACT)
  test(`AUDIT-050: ${text} = ${want}`, () => {
    const r = evaluate(text, { ...ENV });
    assert.equal(r.big, want);
    assert.equal(r.bigApprox, undefined);
    assert.equal(r.value, Number(BigInt(want)));
  });

test("AUDIT-050: 100! točno (zadnje mesto double prej napačno)", () => {
  const r = evaluate("100!", { ...ENV });
  assert.equal(r.big.length, 158);
  assert.ok(r.big.startsWith("93326215443944152681"));
  assert.equal(r.value, Number(BigInt(r.big)));
});

test("AUDIT-050: brez točnih števk je rezultat približek", () => {
  for (const t of ["e^50", "sum(k^3; k; 1; 100000)", "π·10^20"]) {
    const r = evaluate(t, { ...ENV });
    assert.equal(r.bigApprox, true, t);
    assert.equal(r.big, undefined, t);
  }
});

test("AUDIT-050: do 2⁵³ − 1 nič novega", () => {
  for (const t of ["2^53-1", "nCr(50;25)", "123456789", "2^0,5"]) {
    const r = evaluate(t, { ...ENV });
    assert.equal(r.big, undefined, t);
    assert.equal(r.bigApprox, undefined, t);
  }
});

test("AUDIT-050: Ans in spremenljivke z velikim doublom nimajo točnih števk (Ans + 1 po nCr(100; 50))", () => {
  const ans = evaluate("nCr(100;50)", { ...ENV }).value;
  const a = evaluate("2^60", { ...ENV }).value;
  for (const [t, env] of [["Ans+1", { ans }], ["Ans", { ans }], ["a+1", { vars: { a } }], ["a·3", { vars: { a: 1 / 3 * 3e20 } }]]) {
    const r = evaluate(t, { ...ENV, ...env });
    assert.equal(r.big, undefined, t);
    assert.equal(r.bigApprox, true, t);
  }
  // celo varno število v spremenljivki ostane točno: a = 3, a·2^60
  assert.equal(evaluate("a·2^60", { ...ENV, vars: { a: 3 } }).big, "3458764513820540928");
});

test("AUDIT-050: vpisano število z več kot 15 mesti (tap na rezultat + 1) nima točnih števk", () => {
  for (const t of ["100891344545564193334812497256+1", "9007199254740993", "0,33333333333333333333·3·10^20"]) {
    const r = evaluate(t, { ...ENV });
    assert.equal(r.big, undefined, t);
    assert.equal(r.bigApprox, true, t);
  }
  assert.equal(evaluate("100000000000000000000+1", { ...ENV }).big, "100000000000000000001");
});
