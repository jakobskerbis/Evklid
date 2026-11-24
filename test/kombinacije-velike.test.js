// AUDIT-010: nCr in nPr za n > 170 (prej ∞ ali NaN, ker je 171! že ∞). Pričakovane vrednosti: SymPy binomial/ff.
import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate } from "../public/graph/scicore.js";
import { parse, compile } from "../public/graph/math.js";

const ev = (t) => {
  const r = evaluate(t, { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true });
  assert.ok(!r.error, `${t}: ${JSON.stringify(r.error)}`);
  return r.value;
};

// [izraz, točen rezultat iz SymPy kot niz]; Number(niz) je najbližje število double, enako kot pri pravilnem računu
const CASES = [
  ["nCr(171;1)", "171"],
  ["nCr(200;2)", "19900"],
  ["nCr(1000;2)", "499500"],
  ["nPr(171;1)", "171"],
  ["nCr(5;2)", "10"],
  ["nCr(10;0)", "1"],
  ["nCr(10;10)", "1"],
  ["nCr(52;5)", "2598960"],
  ["nCr(300;3)", "4455100"],
  ["nCr(1000000;2)", "499999500000"],
  ["nCr(7;9)", "0"],
  ["nCr(60;30)", "118264581564861424"],
  ["nCr(171;85)", "181833483199708825951389268525434474441650682172920"],
  ["nCr(200;100)", "90548514656103281165404177077484163874504589675413336841320"],
  ["nCr(500;250)", "116744315788277682920934734762176619659230081180311446124100284957811112673608473715666417775521605376810865902709989580160037468226393900042796872256"],
  ["nPr(200;2)", "39800"],
  ["nPr(1000;2)", "999000"],
  ["nPr(10;3)", "720"],
  ["nPr(500;3)", "124251000"],
  ["nPr(1000;10)", "955860613004397508326213120000"],
  ["nPr(20;20)", "2432902008176640000"],
  ["nPr(5;7)", "0"],
];

test("nCr in nPr: točno tudi za n > 170 (SymPy)", () => {
  for (const [t, want] of CASES) assert.equal(ev(t), Number(want), t);
});

test("nCr in nPr: ∞ samo, ko je rezultat res večji od največjega števila", () => {
  // C(1000;500) ≈ 2,7·10^299 je še končen, C(1100;550) ≈ 10^329 in 171·170·…·2 = 171! nista
  assert.ok(Math.abs(ev("nCr(1000;500)") / 2.702882409454366e299 - 1) < 1e-14);
  assert.equal(ev("nCr(1100;550)"), Infinity);
  assert.equal(ev("nPr(171;170)"), Infinity);
  assert.ok(Number.isFinite(ev("nPr(170;170)")));
});

test("nCr na seznamih (grafični kalkulator) in v vsoti ostane kot prej", () => {
  assert.deepEqual(compile(parse("nCr([200, 5], 2)"))({}), [19900, 10]);
  assert.equal(compile(parse("nCr(n, 2)"))({ n: 300 }), 44850);
  assert.equal(ev("nCr(5;2)+nPr(5;2)"), 30);
});
