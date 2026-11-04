import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "katex";
import { splitFormulas, toTex, hasFormula } from "../public/vnos-formul.js";
import { TUTOR_CHIPS, applyTemplate } from "../public/tipkovnica-data.js";

// Ulomki, integrali, zaporedja in vsote v klepetu z inštruktorjem (j, 4. 11.): zapis s tipk se izriše kot formula.
const tex = (s) => splitFormulas(s).filter((p) => "tex" in p).map((p) => p.tex);

test("keyboard notation becomes formulas, the rest stays text", () => {
  assert.deepEqual(splitFormulas("Koliko je (3)/(4) + (1)/(8)?"), [{ text: "Koliko je " }, { tex: "\\frac{3}{4} + \\frac{1}{8}" }, { text: "?" }]);
  assert.deepEqual(tex("√(2)·x^(2)"), ["\\sqrt{2}·x^{2}"]);
  assert.deepEqual(tex("∛(8)"), ["\\sqrt[3]{8}"]);
  assert.deepEqual(tex("(x+1)^(2)"), ["(x+1)^{2}"]);
  assert.deepEqual(tex("10^(−3) m"), ["10^{−3}"]);
  // Zaporedja in vsote
  assert.deepEqual(tex("a_(n+1) = 2a_n + 3"), ["a_{n+1}", "a_{n}"]);
  assert.deepEqual(tex("∑_(n=1)^∞ (1)/(n^(2))"), ["\\sum_{n=1}^{∞} \\frac{1}{n^{2}}"]);
  // Integrali: tipka ∫ na plasti f(x), tipki ∫ in ∫ₐᵇ v vrstici nad tipkami
  assert.deepEqual(tex("∫(x^(2);0;1)"), ["\\int_{0}^{1} x^{2}\\,dx"]);
  assert.deepEqual(tex("∫(x;;)"), ["\\int x\\,dx"]);
  assert.deepEqual(tex("∫ (x^(2)) dx"), ["\\int x^{2}\\,dx"]);
  assert.deepEqual(tex("∫_(0)^(1) (x²) dx je?"), ["\\int_{0}^{1} x²\\,dx"]);
  assert.deepEqual(tex("lim_(x→0)((sin(x))/(x))"), ["\\lim_{x→0}", "\\frac{\\sin (x)}{x}"]);
  assert.deepEqual(tex("d/dx(x³)"), ["\\frac{d}{dx}"]);
  // Navadno besedilo ostane besedilo.
  for (const s of ["Živjo, kako rešim nalogo?", "3/4 + 1/8", "moja_spremenljivka", "(a) dx", "cena (z DDV) / (brez)"]) assert.ok(!hasFormula(s), s);
  assert.equal(toTex("a{b}%"), "a\\{b\\}\\%");
});

test("every formula from the tutor keys renders in KaTeX", () => {
  const samples = ["(3)/(4)", "x^(2)", "√((x+1)/(2))", "a_(n)", "∑_(n=1)^(10) n", "∫ (x) dx", "∫_(0)^(π) (sin(x)) dx", "∫(e^(x);0;1)", "lim_(x→∞)((1)/(x))", "a{b}%#&~"];
  for (const s of samples) for (const t of [toTex(s), ...tex(s)]) assert.doesNotThrow(() => katex.renderToString(t, { throwOnError: true, strict: "ignore" }), `${s} → ${t}`);
  // Prazna predloga (pravkar vstavljena tipka) se ne zlomi.
  for (const [, ins] of TUTOR_CHIPS) {
    const { value } = applyTemplate("", 0, 0, ins);
    for (const t of tex(value)) assert.doesNotThrow(() => katex.renderToString(t, { throwOnError: true, strict: "ignore" }), `${ins} → ${t}`);
  }
});

test("tutor input: keys for fractions, powers, sequences, integrals and sums; preview above the field", () => {
  const ins = TUTOR_CHIPS.map(([, v]) => v);
  for (const v of ["(@)/()", "^(@)", "_(@)", "∫ (@) dx", "∫_(@)^() () dx", "∑_(n=1)^(@) "]) assert.ok(ins.includes(v), v);
  const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
  assert.match(html, /id="formula-preview"[^>]*hidden/);
  const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /splitFormulas\(p\)\.map/, "sporočilo učenca izriše zapis s tipk");
  assert.match(app, /pv\.hidden = !show/);
});
