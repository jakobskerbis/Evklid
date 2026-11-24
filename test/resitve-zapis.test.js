// AUDIT-022: iracionalne rešitve so bile prikazane z »=« na 6 mest (x³ = 2: x = 1,259921). Zdaj točna oblika, ko jo
// znamo potrditi (∛2: q·x^k − p točno deli polinom), sicer »≈«. Vrednosti: SymPy real_roots / nroots.
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, solutionTex } from "../public/graph/scisolve.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
const tex = (t, env = ENV) => solutionTex(analyze(t, env));

test("koreni ᵏ√(p/q): točna oblika z »=« (SymPy)", () => {
  // [enačba, pričakovan začetek zapisa, SymPy realna ničla]
  const CASES = [
    ["x^3=2", "x_{1} = \\sqrt[3]{2} \\approx 1{,}259921", 1.25992104989],
    ["2x^3=−3", "x_{1} = -\\sqrt[3]{\\frac{3}{2}} \\approx -1{,}144714", -1.14471424255],
    ["x^4=5", "x_{1} = -\\sqrt[4]{5} \\approx -1{,}495349,\\quad x_{2} = \\sqrt[4]{5} \\approx 1{,}495349", 1.49534878122],
    ["x^5=7", "x_{1} = \\sqrt[5]{7} \\approx 1{,}475773", 1.47577316159],
    ["x^6=2", "x_{1} = -\\sqrt[6]{2} \\approx -1{,}122462,\\quad x_{2} = \\sqrt[6]{2} \\approx 1{,}122462", 1.12246204831],
    ["3x^3=5", "x_{1} = \\sqrt[3]{\\frac{5}{3}} \\approx 1{,}185631", 1.1856311015],
    ["x^3+2=0", "x_{1} = -\\sqrt[3]{2} \\approx -1{,}259921", -1.25992104989],
    ["(x^3−2)(x−1)=0", "x_{1} = 1,\\quad x_{2} = \\sqrt[3]{2} \\approx 1{,}259921", 1.25992104989],
    ["x^4−2=0", "x_{1} = -\\sqrt[4]{2} \\approx -1{,}189207,\\quad x_{2} = \\sqrt[4]{2} \\approx 1{,}189207", 1.189207115],
  ];
  for (const [t, start, root] of CASES) {
    const s = tex(t);
    assert.ok(s.startsWith(start), `${t}: ${s}`);
    assert.ok(analyze(t, ENV).roots.some((x) => Math.abs(Math.abs(x) - Math.abs(root)) < 1e-10), t);
  }
});

test("brez točne oblike: »≈« (tudi kompleksne in kotne)", () => {
  assert.equal(tex("2^x=5"), "x \\approx 2{,}321928"); // SymPy log(5)/log(2) = 2,32192809489
  assert.ok(tex("x^3−x−1=0").startsWith("x_{1} \\approx 1{,}324718,\\quad x_{2} \\approx -0{,}662359-0{,}56228\\,i")); // SymPy 1,32471795724
  assert.ok(tex("x^3=2").includes("x_{2} \\approx -0{,}629961-1{,}091124\\,i"));
  assert.equal(tex("sin(x)=0,75", { ...ENV, deg: true }), "x_{1} \\approx 48{,}590378^{\\circ},\\quad x_{2} \\approx 131{,}409622^{\\circ}"); // SymPy 48,5903778907
});

test("točne rešitve ostanejo z »=«", () => {
  assert.equal(tex("8x^3=1"), "x_{1} = \\frac{1}{2} \\approx 0{,}5,\\quad x_{2} = -\\frac{1}{4}-\\frac{\\sqrt{3}}{4}\\,i,\\quad x_{3} = -\\frac{1}{4}+\\frac{\\sqrt{3}}{4}\\,i");
  assert.equal(tex("(x−5)^3=0"), "x = 5");
  assert.equal(tex("x^3=8"), "x_{1} = 2,\\quad x_{2} = -1-\\sqrt{3}\\,i,\\quad x_{3} = -1+\\sqrt{3}\\,i");
  assert.equal(tex("sin(x)=0,5", { ...ENV, deg: true }), "x_{1} = 30^{\\circ},\\quad x_{2} = 150^{\\circ}");
  assert.ok(tex("(x−√(7))^2(x−π)=0").startsWith("x_{1} = \\sqrt{7} \\approx 2{,}645751"));
  assert.equal(tex("(x−0,1)(x−0,1000001)(x−3)=0"), "x_{1} = \\frac{1}{10} \\approx 0{,}1,\\quad x_{2} = 0{,}1000001,\\quad x_{3} = 3");
});

// Pregled #968: popolne potence izpod korena (SymPy real_roots: 2·∛2, 2·∛3, −3·∛2, ±2·∜3, 2·∜6 … ), vpisana
// decimalka ni nikoli π, končen decimalni zapis točne rešitve z vsemi mesti.
test("ᵏ√ brez popolnih potenc pod korenom (SymPy)", () => {
  const first = (t) => tex(t).split(",\\quad")[0];
  assert.equal(first("x^3=16"), "x_{1} = 2\\sqrt[3]{2} \\approx 2{,}519842");
  assert.equal(first("x^3=24"), "x_{1} = 2\\sqrt[3]{3} \\approx 2{,}884499");
  assert.equal(first("x^3=−54"), "x_{1} = -3\\sqrt[3]{2} \\approx -3{,}779763");
  assert.equal(first("x^4=48"), "x_{1} = -2\\sqrt[4]{3} \\approx -2{,}632148");
  assert.equal(first("x^5=96"), "x_{1} = 2\\sqrt[5]{3} \\approx 2{,}491462"); // SymPy 2·3^(1/5) = 2,49146187923
  assert.equal(first("16x^3=1"), "x_{1} = \\frac{1}{2}\\sqrt[3]{\\frac{1}{2}} \\approx 0{,}39685"); // SymPy 2^(2/3)/4
});

test("vpisana decimalka ni π, točna rešitev z vsemi mesti", () => {
  assert.ok(!tex("(x−3,14159265358979)(x−1)=0").includes("\\pi"));
  assert.ok(tex("(x−π)(x−1)=0").includes("\\pi"));
  assert.equal(tex("(x−1,0000001)(x−2)=0"), "x_{1} = 1{,}0000001,\\quad x_{2} = 2");
  assert.equal(tex("(x+20)(x+9,6537162)=0"), "x_{1} = -20,\\quad x_{2} = -9{,}6537162");
});
