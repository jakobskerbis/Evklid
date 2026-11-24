// AUDIT-024: izraz v odgovoru (»sin(0,5)«, »2,5·sin(0,5)«) se bere po istem pravilu za števila in vejico kot
// kalkulatorja (numberText v math.js): prej je bil »sin(0,5)« sin(0) (ali napaka), zato je pravi odgovor dobil
// »izraz«, napačen (rešitev 0) pa »Vrednost je prava«.
import test from "node:test";
import assert from "node:assert/strict";
import * as math from "../public/graph/math.js";
import { checkAnswer } from "../server/practice/check.js";
import { prepare } from "../public/graph/scicore.js";

const chk = (answer, input, opts = {}) => checkAnswer({ type: "number", ...answer }, input, { math, ...opts });
const verdict = (r) => `${r.kind}${r.code || r.mistake?.code ? `/${r.code || r.mistake?.code}` : ""}`;

test("decimalna vejica v funkciji: prava vrednost je »izračunaj do konca«, napačna je napačna", () => {
  const v = Math.sin(0.5);
  for (const inp of ["sin(0,5)", "sin 0,5", "2,5·sin(0,5)/2,5", "√(0,25)·2·sin(0,5)"]) {
    assert.equal(verdict(chk({ value: v, decimals: 2 }, inp)), "format/chk.calcFully", inp);
  }
  assert.equal(verdict(chk({ value: 2.5 * v, decimals: 2 }, "2,5·sin(0,5)")), "format/chk.calcFully");
  assert.equal(verdict(chk({ value: 1.5 }, "√(2,25)")), "format/chk.calcFully");
  // rešitev 0: sin(0,5) ni 0 (prej »Vrednost je prava«)
  for (const inp of ["sin(0,5)", "2,5·sin(0,5)"]) assert.equal(verdict(chk({ value: 0 }, inp)), "wrong/chk.expression", inp);
  // dve vrednosti in nejasen zapis nista eno število
  assert.equal(verdict(chk({ value: 2 }, "max(1,5; 2)")), "format/chk.calcFully");
  assert.equal(verdict(chk({ value: 1.5 }, "max(1,5; 2)")), "wrong/chk.expression");
});

test("naloga z decimalno piko: vejica v oklepaju loči vrednosti kot prej", () => {
  // pri dot izraza ne beremo (parseNumberWithUnit z dot), pravilo za piko ostane
  assert.equal(chk({ value: 2.5, dot: true }, "2.5").kind, "correct");
});

test("običajni zapisi števil imajo isto sodbo kot prej (pravilni ostanejo pravilni)", () => {
  const cases = [
    [{ value: 2.5 }, ["2,5", "2.5", "2,50", " 2,5 ", "+2,5"]],
    [{ value: 1000 }, ["1 000", "1000", "1.000", "1 000,0"]],
    [{ value: 1234.5 }, ["1.234,5", "1 234,5", "1234,5", "1234.5"]],
    [{ value: 0.5 }, ["0,5", "0.5", ",5"]],
    [{ value: 3.14, decimals: 2 }, ["3,14", "3.14"]],
    [{ value: 12.5, unit: "cm" }, ["12,5 cm", "12,5cm", "125 mm", "0,125 m"]],
    [{ value: 2500, unit: "m" }, ["2500 m", "2 500 m", "2,5 km"]],
    [{ value: 2 * Math.PI, decimals: 2 }, ["6,28", "2π"]],
    [{ value: -3 }, ["-3", "−3"]],
    [{ value: 7 }, ["7", "7,0"]],
    [{ value: 1.5 }, ["1,5"]],
    [{ value: 2500 }, ["2,5·10^3", "2,5 × 10^3", "2.500"]],
    [{ value: 0.001, unit: "kg" }, ["1 g", "0,001 kg", "1·10^-3 kg"]],
  ];
  for (const [a, ins] of cases) for (const inp of ins) assert.equal(chk(a, inp, { convert: true }).kind, "correct", `${JSON.stringify(a)} ${inp}`);
  assert.equal(verdict(chk({ value: 1.5 }, "3/2")), "format/chk.quotient");
  assert.equal(verdict(chk({ value: 1.5 }, "3:2")), "format/chk.quotient");
  assert.equal(chk({ value: 0.5 }, "½").kind, "format");
  assert.equal(verdict(chk({ value: 13.23, decimals: 2 }, "5√7")), "format/chk.calcFully");
});

test("numberText je isto pravilo kot znanstveni kalkulator", () => {
  for (const s of ["sin(0,5)", "1 000 + 1", "1.234,5", "max(1,5; 2)"]) assert.equal(math.numberText(s, true), prepare(s, { comma: true }), s);
  assert.throws(() => math.numberText("12 3456"), math.MathError);
  assert.throws(() => math.numberText("1.2.3"), math.MathError);
  assert.equal(math.numberText("max(1.5, 2)", false), "max(1.5, 2)");
});

test("znanstveni zapis z e v odgovoru (AUDIT-041): število, ne enota »e8«", () => {
  for (const [v, inp, unit] of [[1e8, "1e8"], [0.002, "2e-3"], [2500, "2,5e3"], [300, "3E2"], [0.0025, "2,5e-3 m", "m"], [3e8, "3e8 m/s", "m/s"]]) {
    assert.equal(chk({ value: v, unit }, inp).kind, "correct", inp);
  }
  assert.equal(verdict(chk({ value: 2e-8 }, "2/1e8")), "format/chk.calcFully");
  assert.equal(verdict(chk({ value: 2 / 300, decimals: 4 }, "2/3e2")), "format/chk.calcFully");
  assert.equal(verdict(chk({ value: 500 }, "1/2E-3")), "format/chk.calcFully");
  assert.equal(verdict(chk({ value: -100 }, "−1e2")), "correct");
  // e brez eksponenta ostane, kot je bilo
  assert.equal(chk({ value: 5 }, "5 e").kind, "correct");
});
