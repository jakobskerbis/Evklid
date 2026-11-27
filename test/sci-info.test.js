// Podatki v praznem delu zaslona kalkulatorja (public/graph/sci-info.js; načrt z dopolnitvami ChatGPT, 27. 11. 2026).
import test from "node:test";
import assert from "node:assert/strict";
import { infoFor, plotSvg, INFO_FIRST } from "../public/graph/sci-info.js";
import { analyze } from "../public/graph/scisolve.js";

const env = { vars: {}, funcs: {}, ans: 0, deg: false };
const info = (s, { profile = null, deg = false, r } = {}) => {
  const e = { ...env, deg };
  return infoFor(s, r ?? analyze(s, { ...e, comma: true, live: true }), { profile, comma: true, env: e });
};
const keys = (d) => d.rows.map((x) => x.key);
const row = (d, k) => d.rows.find((x) => x.key === k);

test("enačba x² − 5x + 6 = 0: najprej rešitvi, nato diskriminanta in Vieta", () => {
  const d = info("x^2-5x+6=0");
  assert.deepEqual(keys(d).slice(0, 3), ["sc.infoSolutions", "sc.infoDisc", "sc.infoVieta"]);
  assert.match(row(d, "sc.infoSolutions").tex, /x_\{1\} = 2.*x_\{2\} = 3/);
  assert.equal(row(d, "sc.infoDisc").tex, "D = 1");
});

test("izraz x² − 5x + 6: najprej razstavljeno, teme T(5/2; −1/4)", () => {
  const d = info("x^2-5x+6");
  assert.equal(d.rows[0].key, "sc.infoFactor");
  assert.match(d.rows[0].tex, /x - 2.*x - 3/);
  assert.match(row(d, "sc.infoVertex").tex, /T\(\\tfrac\{5\}\{2\};\\,-\\tfrac\{1\}\{4\}\)/);
});

test("analiza (x² − 1)/(x − 1): x ≠ 1 prvi, ničla le −1, prazna točka (1, 2) na grafu", () => {
  const d = info("(x^2-1)/(x-1)", { profile: "ana" });
  assert.deepEqual(keys(d).slice(0, 3), ["sc.infoDomain", "sc.infoRoots", "sc.infoDeriv"]);
  assert.equal(row(d, "sc.infoDomain").tex, "x \\neq 1");
  assert.equal(row(d, "sc.infoRoots").tex, "x = -1");
  assert.deepEqual(d.plot.holes, [[1, 2]]);
  assert.match(plotSvg(d.plot.fn, d.plot.roots, { holes: d.plot.holes }), /class="hole"/);
});

test("sprejemni preizkus: x² − 1 → e^x, e^x nima realnih ničel (brez lažne ničle pri robu)", () => {
  assert.match(row(info("x^2-1"), "sc.infoRoots").tex, /x_\{1\} = -1/);
  const d = info("e^x", { profile: "ana" });
  assert.equal(row(d, "sc.infoRoots").text, "sc.infoNoRoots");
  assert.equal(row(d, "sc.infoAsym").tex, "y = 0");
  assert.deepEqual(d.plot.roots, []);
  assert.deepEqual(analyze("e^x=0", { ...env, live: true }).roots, []);
});

test("kotne: perioda v izbranem načinu, tangens z navpičnimi asimptotami, v DEG brez odvoda", () => {
  assert.equal(row(info("sin(x)"), "sc.infoPeriod").tex, "2\\pi");
  const deg = info("sin(x)", { deg: true });
  assert.equal(row(deg, "sc.infoPeriod").tex, "360^{\\circ}");
  assert.equal(row(deg, "sc.infoDeriv"), undefined);
  assert.equal(row(info("sin(x)"), "sc.infoRange").tex, "[-1;\\,1]");
  assert.match(row(info("tan(x)"), "sc.infoAsym").tex, /x = \\tfrac\{\\pi\}\{2\} \+ k\\pi/);
});

test("logaritem: definicijsko območje x > 0 in asimptota x = 0", () => {
  const d = info("ln(x)");
  assert.equal(d.rows[0].tex, "x > 0");
  assert.equal(row(d, "sc.infoAsym").tex, "x = 0");
});

test("kompleksno: |z|, konjugirano; pri z = 0 »Argument ni določen«", () => {
  const d = info("3+4i");
  assert.equal(row(d, "sc.infoAbs").tex, "|z| = 5");
  assert.equal(row(d, "sc.infoConj").tex, "\\bar{z} = 3 - 4i");
  assert.equal(row(info("0", { r: { kind: "complex", re: 0, im: 0 } }), "sc.infoArg").text, "sc.infoArgNone");
});

test("fizika: 72 km/h najprej 20 m/s; število: točno, mešano, prafaktorji", () => {
  assert.equal(info("72⟦km/h⟧").rows[0].tex, "20\\,\\mathrm{m/s}");
  assert.equal(row(info("0.75"), "sc.infoExact").tex, "\\tfrac{3}{4}");
  assert.equal(row(info("7/3"), "sc.infoMixed").tex, "2\\tfrac{1}{3}");
  assert.equal(row(info("360"), "sc.infoPrimes").tex, "2^{3}\\cdot 3^{2}\\cdot 5");
});

test("kemija: molska masa, atomi; naboj le, če ga zapis določa", () => {
  const d = info("M(H2SO4)", { r: { kind: "value", value: 98.07 } });
  assert.match(row(d, "sc.infoMolar").tex, /^M = 98\{,\}07/);
  assert.equal(row(d, "sc.infoCharge"), undefined);
  assert.equal(row(info("M(SO4^2-)", { r: { kind: "value", value: 96 } }), "sc.infoCharge").tex, "2-");
  assert.equal(row(info("M(Fe)", { r: { kind: "value", value: 55.8 } }), "sc.infoCharge"), undefined);
});

test("vidne so prve tri vrstice, ostale pod »Več«", () => {
  assert.equal(INFO_FIRST, 3);
  assert.ok(info("x^2-1", { profile: "ana" }).rows.length > INFO_FIRST);
});
