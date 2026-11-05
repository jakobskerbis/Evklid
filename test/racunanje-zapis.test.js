// Zapis števil: tisočice s presledkom (K1), pika kot decimalno ločilo (P4), enote m/M (P5),
// ulomki z negativnim imenovalcem in 0/n (D3), arabske števke (D4).
import test from "node:test";
import assert from "node:assert/strict";
import { presolve, claimNote } from "../server/live-check.js";
import { solve, prep, texToText } from "../public/scan/solvecore.js";
import { evaluate } from "../public/graph/scicore.js";
import { checkAnswer, sameUnit } from "../server/practice/check.js";

const kind = (a, i) => checkAnswer(a, i).kind;

test("K1: »1 000« je tisoč v opombi inštruktorju, ne 1 · 0", () => {
  const p = presolve("Izračunaj 1 000 + 250 - 3");
  assert.equal(p.problems[0].answer, "1247");
  assert.match(claimNote("Dobil sem 1 247.", p), /CORRECT/);
  assert.equal(claimNote("Dobil sem 247.", p), null);
  assert.equal(presolve("Reši 2 000x + 500 = 4 500").problems[0].answer, "x = 2");
  assert.equal(presolve("Izračunaj $1\\,000 + 250 - 3$").problems[0].answer, "1247");
  assert.equal(presolve("Izračunaj $1~000 \\cdot 3 - 1$").problems[0].answer, "2999");
});

test("K1: nejasen presledek med števkami → brez »preverjenega« rezultata", () => {
  assert.equal(presolve("Izračunaj 12 34 + 1"), null);
  assert.equal(presolve("Izračunaj 2 + 3 4"), null);
});

test("K1: skener in kalkulator bereta tisočice s presledkom", () => {
  const r = solve("12 345");
  assert.ok(r.ok && r.verified);
  assert.equal(r.answer.tex, "12\\,345");
  assert.equal(solve("1\\,000+1").answer.tex, "1001");
  assert.equal(prep("1 000 000/4"), "(1000000/4)");
  assert.equal(texToText("1\\,000 + 1~000").replace(/\s/g, ""), "1000+1000");
  assert.equal(evaluate("1 000 000/4", {}).value, 250000);
  assert.equal(evaluate("1 000,5+1", {}).value, 1001.5);
});

test("P4: »2.500« s piko kot decimalnim ločilom je pravilno, ko je pravilen odgovor 2,5", () => {
  assert.equal(kind({ type: "number", value: 2.5, decimals: 3 }, "2.500"), "correct");
  assert.equal(kind({ type: "number", value: 0.125, decimals: 3 }, "0.125"), "correct");
  assert.equal(kind({ type: "number", value: 12.345, decimals: 3 }, "12.345"), "correct");
  assert.equal(kind({ type: "number", value: 12345 }, "12.345"), "correct");
  assert.equal(kind({ type: "number", value: 1200, unit: "m" }, "1.200 m"), "correct");
  assert.equal(kind({ type: "number", value: 7, decimals: 3 }, "2.500"), "wrong");
});

test("P5: velikost črke m/M loči predpono (mili ≠ mega)", () => {
  assert.equal(kind({ type: "number", value: 5, unit: "ms" }, "5 Ms"), "unit");
  assert.equal(kind({ type: "number", value: 5, unit: "mA" }, "5 MA"), "unit");
  assert.equal(kind({ type: "number", value: 5, unit: "mm" }, "5 Mm"), "unit");
  assert.equal(kind({ type: "number", value: 5, unit: "mJ" }, "5 MJ"), "unit");
  assert.equal(kind({ type: "number", value: 5, unit: "MPa" }, "5 mPa"), "unit");
  assert.equal(kind({ type: "number", value: 5, unit: "ms" }, "5 ms"), "correct");
  // kjer črka ne spremeni pomena, ostane brez razlike
  assert.equal(kind({ type: "number", value: 5, unit: "l" }, "5 L"), "correct");
  assert.equal(kind({ type: "number", value: 5, unit: "°C" }, "5 °c"), "correct");
  assert.equal(kind({ type: "number", value: 5, unit: "km/h" }, "5 Km/h"), "correct");
  assert.equal(kind({ type: "number", value: 5, unit: "Hz" }, "5 hz"), "correct");
  assert.ok(sameUnit("m²", "m^2") && !sameUnit("m", "M"));
});

test("D3: ulomek z minusom v imenovalcu in 0/n", () => {
  assert.equal(kind({ type: "fraction", num: -3, den: 4 }, "3/-4"), "correct");
  assert.equal(kind({ type: "fraction", num: 3, den: 4 }, "-3/-4"), "correct");
  assert.equal(kind({ type: "fraction", num: 0, den: 1 }, "0/5"), "correct");
  assert.equal(kind({ type: "fraction", num: 3, den: 4 }, "6/8"), "simplify");
});

test("D4: arabske števke in decimalna ločila", () => {
  assert.equal(kind({ type: "number", value: 2.5 }, "2،5"), "correct");
  assert.equal(kind({ type: "number", value: 2.5 }, "٢٫٥"), "correct");
  assert.equal(kind({ type: "number", value: 25 }, "۲۵"), "correct");
  assert.equal(kind({ type: "fraction", num: 3, den: 4 }, "٣/٤"), "correct");
});
