// Zapis števil: tisočice s presledkom (K1), pika kot decimalno ločilo (P4), enote m/M (P5),
// ulomki z negativnim imenovalcem in 0/n (D3), arabske števke (D4).
import test from "node:test";
import assert from "node:assert/strict";
import { presolve, claimNote, claimReadings } from "../server/live-check.js";
import { solve, prep, texToText, unclearNumber } from "../public/scan/solvecore.js";
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
  assert.ok(sameUnit("m²", "m^2") && !sameUnit("mm", "Mm"));
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

// Popravki pregleda PR #454

test("P4: »2.500« za 2,5 brez decimalk je pozabljena pretvorba (namig o velikostnem redu)", () => {
  const r = checkAnswer({ type: "number", value: 2.5 }, "2.500");
  assert.equal(r.kind, "wrong");
  assert.equal(r.mistake?.code, "chk.magnitudeBig");
  assert.equal(checkAnswer({ type: "number", value: 2.5, unit: "km" }, "2.500 km").mistake?.code, "chk.magnitudeBig");
  assert.equal(checkAnswer({ type: "number", value: 1.2, unit: "m" }, "1.200 m").mistake?.code, "chk.magnitudeBig");
  // »2 500« in »2.500« dasta isti namig
  assert.equal(checkAnswer({ type: "number", value: 2.5 }, "2 500").mistake?.code, "chk.magnitudeBig");
  // točna vrednost s tremi decimalkami: pika je decimalna
  assert.equal(kind({ type: "number", value: 12.345 }, "12.345"), "correct");
  assert.equal(kind({ type: "number", value: 1.125 }, "1.125"), "correct");
});

test("P4: vodilna ničla (»0.500«, »-0.250«) je vedno decimalni zapis", () => {
  assert.equal(kind({ type: "number", value: 0.5 }, "0.500"), "correct");
  assert.equal(kind({ type: "number", value: -0.25 }, "-0.250"), "correct");
  assert.equal(kind({ type: "number", value: 500 }, "0.500"), "wrong");
  assert.equal(kind({ type: "number", value: 2500 }, "2.500"), "correct");
});

test("P4/N3: »2.500« pri zaokroževanju na manj kot 3 decimalke ne pohvali izračuna in ne razkrije rezultata", () => {
  // 0 ali 1 decimalka: »2.500« skoraj gotovo ni decimalna pika, ampak pozabljena pretvorba (2500 m namesto 2,5 km)
  for (const d of [0, 1]) {
    const r = checkAnswer({ type: "number", value: 2.5, decimals: d }, "2.500");
    assert.equal(r.kind, "wrong", `decimals ${d}`);
    assert.equal(r.mistake?.code, "chk.magnitudeBig", `decimals ${d}`);
    assert.equal(r.reveal, undefined);
  }
  // 2 decimalki: dvoumno (2500 ali 2,500 z decimalko preveč) – napačno, a brez namiga, ki bi bil lahko napačen
  const r = checkAnswer({ type: "number", value: 2.5, decimals: 2 }, "2.500");
  assert.equal(r.kind, "wrong");
  assert.equal(r.mistake, undefined);
  assert.equal(r.reveal, undefined);
  // pri 3 decimalkah ostane decimalno branje
  assert.equal(kind({ type: "number", value: 2.5, decimals: 3 }, "2.500"), "correct");
  assert.equal(kind({ type: "number", value: 2.5004, decimals: 3 }, "2.500"), "correct");
  assert.equal(kind({ type: "number", value: 2.5006, decimals: 3 }, "2.500"), "rounding");
});

test("N1: pika za tisočice v besedilu naloge – inštruktor ne dobi napačnega »WRONG«", () => {
  assert.equal(presolve("Reši 2x = 1.000"), null);
  assert.equal(presolve("Reši x - 1.200 = -600"), null);
  assert.equal(presolve("Reši 2x + 3 = 5.003"), null);
  assert.equal(claimNote("x = 500", presolve("Reši 2x = 1.000")), null);
  // nedvoumni zapisi ostanejo
  assert.equal(presolve("Reši 2x = 1.5").problems[0].answerTex, "x = \\frac{3}{4}");
  assert.equal(presolve("Reši 8x = 0.125").problems[0].answerTex, "x = \\frac{1}{64}");
  assert.match(claimNote("x = 1.234,5", presolve("Reši 2x = 2469")), /CORRECT/);
});

test("N2: število v indeksu ali potenci (log_2 8, sin^2 30) ni nejasen zapis", () => {
  assert.equal(evaluate("log_2 8", {}).value, 3);
  assert.ok(Math.abs(evaluate("log_10 100", {}).value - 2) < 1e-12);
  assert.ok(Math.abs(evaluate("log_2 100", {}).value - Math.log2(100)) < 1e-12);
  assert.ok(Number.isFinite(evaluate("sin^2 30", {}).value));
  assert.ok(Math.abs(evaluate("log_2 1 000", {}).value - Math.log2(1000)) < 1e-12);
  assert.ok(!unclearNumber("sin^2 30°") && !unclearNumber("log_2 8"));
  const r = solve("sin^2 30°");
  assert.ok(r.ok, "skener sin^2 30°");
  // nejasni zapisi ostanejo nejasni
  for (const x of ["12 34 + 1", "2 1/2 + 1", "12 345,678 9"]) assert.ok(unclearNumber(x), x);
});

test("K1: »x = 1.250« (tisočice s piko) ni »WRONG« v opombi inštruktorju", () => {
  const p = presolve("Reši 2x + 3 = 2503");
  assert.doesNotMatch(claimNote("x = 1.250", p) || "", /WRONG/);
  assert.match(claimNote("x = 1.250", p), /CORRECT/);
  assert.match(claimNote("x = 1251", p), /WRONG/);
  // dvoumen napačen zapis: raje brez sodbe kot napačna sodba
  assert.equal(claimNote("x = 1.251", p), null);
  assert.match(claimNote("x = 1.25", presolve("Reši 2x + 3 = 5,5")), /CORRECT/);
  assert.match(claimNote("x = 1.250.000", presolve("Reši 2x = 2500000")), /CORRECT/);
  assert.match(claimNote("x = 1.234,5", presolve("Reši 2x = 2469")), /CORRECT/);
  assert.match(claimNote("1.250", presolve("Koliko je 1000 + 200 + 50?")), /CORRECT/);
  assert.deepEqual(claimReadings("1.250"), ["1.250", "1250"]);
  assert.deepEqual(claimReadings("0.250"), ["0.250"]);
  assert.deepEqual(claimReadings("1.250.000"), ["1250000"]);
});

test("P5: velike črke pri enotah brez predpone (Min, Mol, M, M/S, M2, DM3) ostanejo pravilne", () => {
  assert.equal(kind({ type: "number", value: 5, unit: "min" }, "5 Min"), "correct");
  assert.equal(kind({ type: "number", value: 5, unit: "mol" }, "5 Mol"), "correct");
  assert.equal(kind({ type: "number", value: 5, unit: "m" }, "5 M"), "correct");
  assert.equal(kind({ type: "number", value: 5, unit: "m/s" }, "5 M/S"), "correct");
  assert.equal(kind({ type: "number", value: 5, unit: "m²" }, "5 M2"), "correct");
  assert.equal(kind({ type: "number", value: 5, unit: "dm³" }, "5 DM3"), "correct");
  assert.equal(kind({ type: "number", value: 5, unit: "mmol" }, "5 Mmol"), "unit");
});

test("N4: zapis z vsemi velikimi (ali malimi) črkami pri enoti s predpono m/M ni napačna enota", () => {
  assert.equal(kind({ type: "number", value: 5, unit: "mm" }, "5 MM"), "correct");
  assert.equal(kind({ type: "number", value: 5, unit: "mg" }, "5 MG"), "correct");
  assert.equal(kind({ type: "number", value: 5, unit: "mmol" }, "5 MMOL"), "correct");
  assert.equal(kind({ type: "number", value: 5, unit: "MHz" }, "5 mhz"), "correct");
  assert.equal(kind({ type: "number", value: 5, unit: "MJ" }, "5 mj"), "correct");
  // če se preostanek enote ujema v velikosti črk, m/M še vedno šteje
  assert.equal(kind({ type: "number", value: 5, unit: "mJ" }, "5 MJ"), "unit");
  assert.equal(kind({ type: "number", value: 5, unit: "mm" }, "5 Mm"), "unit");
  assert.equal(kind({ type: "number", value: 5, unit: "ms" }, "5 Ms"), "unit");
});

test("K1: skener in kalkulator ne ugibata pri nejasnem zapisu števila", () => {
  for (const x of ["12 345,678 9", "12 34 + 1", "2 1/2 + 1", "1.2.3 + 1"]) {
    assert.ok(unclearNumber(x), x);
    assert.equal(solve(x).ok, false, x);
  }
  assert.equal(evaluate("12 3456", {}).error?.code, "unexpected");
  assert.equal(evaluate("1.2.3", {}).error?.code, "unexpected");
  // pika za tisočice z decimalno vejico je nedvoumna
  assert.equal(evaluate("1.234,5", {}).value, 1234.5);
  assert.equal(evaluate("1.234.567,8", {}).value, 1234567.8);
  assert.equal(solve("1.234,5 + 1").answer.tex, "1235{,}5");
  assert.ok(!unclearNumber("12 345 + 1") && !unclearNumber("x^2 = 4"));
});

test("D4: arabsko ločilo tisočic ٬", () => {
  assert.equal(kind({ type: "number", value: 2500 }, "٢٬٥٠٠"), "correct");
  assert.equal(kind({ type: "number", value: 2500 }, "۲٬۵۰۰"), "correct");
});
