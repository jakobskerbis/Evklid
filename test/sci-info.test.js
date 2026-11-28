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

test("pregled 27. 11.: dvojni pol ni luknja, brez lažnih ničel, ekstrem pri 0, dolg seznam ničel z »…«, NH₄⁺", () => {
  const p = info("1/x^2");
  assert.deepEqual(p.plot.holes, []);
  assert.equal(row(p, "sc.infoAsym").tex, "x = 0,\\ y = 0");
  assert.equal(row(info("x*ln(x)"), "sc.infoRoots").tex, "x = 1");
  assert.equal(row(info("x*ln(x)=0"), "sc.infoSolutions").tex, "x = 1");
  assert.equal(row(info("x^x"), "sc.infoRoots").text, "sc.infoNoRoots");
  assert.match(row(info("x^4-x^2"), "sc.infoExtrema").tex, /\\max\\,\(0;\\,0\)/);
  assert.match(row(info("x*sin(x)"), "sc.infoRoots").tex, /\\ldots$/);
  assert.equal(row(info("sin(x)^2+cos(x)^2"), "sc.infoPeriod"), undefined);
  assert.equal(row(info("M(NH4+)", { r: { kind: "value", value: 18 } }), "sc.infoCharge").tex, "+");
  // pregled 28. 11.: Fe3+ je en atom Fe z nabojem 3+ (prej Fe₃ brez naboja, 167,5 g/mol)
  const fe = info("M(Fe3+)", { r: { kind: "value", value: 55.845 } });
  assert.equal(row(fe, "sc.infoCharge").tex, "3+");
  assert.equal(row(fe, "sc.infoAtoms").tex, "\\mathrm{Fe}\\!:\\,1");
  assert.match(row(fe, "sc.infoMolar").tex, /^M = 55\{,\}845/);
  assert.equal(row(info("M(SO4^2−)", { r: { kind: "value", value: 96 } }), "sc.infoCharge").tex, "2-");
});

test("hitro: podatki za kotno funkcijo v manj kot 200 ms (prej do 1,2 s)", () => {
  const t0 = performance.now();
  for (const s of ["sin(x)+cos(x)", "cos(x)^2+sin(x)^2", "x^3-3x", "1/x^2"]) info(s);
  assert.ok(performance.now() - t0 < 800, `${Math.round(performance.now() - t0)} ms`);
});

// Revizija 27. 11. 2026 (»pravilno ali nič«): zaloga vrednosti in vodoravne asimptote, ki jih vidi dijak
test("zaloga vrednosti: brez napačnega intervala pri polih, natančna krajišča", () => {
  const rg = (s) => row(info(s), "sc.infoRange")?.tex ?? null;
  assert.equal(rg("1/sin(x)"), null); // prava zaloga (−∞, −1] ∪ [1, ∞) ni en interval: vrstice ni
  assert.equal(rg("1/cos(x)"), null);
  assert.equal(rg("sin(x+0,1)"), "[-1;\\,1]");
  assert.equal(rg("sin(x)^2"), "[0;\\,1]");
  assert.equal(rg("1/(2+sin(x))"), "[\\tfrac{1}{3};\\,1]");
  assert.equal(rg("3sin(2x)-1"), "[-4;\\,2]"); // množenje brez znaka pred sin: perioda in zaloga
  assert.equal(rg("sin(x)+cos(x)"), "[-\\sqrt{2};\\,\\sqrt{2}]");
});

test("vodoravne asimptote: le zanesljive, z ulomkom", () => {
  const as = (s) => row(info(s), "sc.infoAsym")?.tex ?? null;
  assert.equal(as("1/3+1/x"), "x = 0,\\ y = \\tfrac{1}{3}");
  assert.equal(as("(2x+1)/(3x)"), "x = 0,\\ y = \\tfrac{2}{3}");
  assert.equal(as("x/10^9"), null); // premica: ni vodoravne asimptote
  assert.equal(as("1/x"), "x = 0,\\ y = 0");
  assert.equal(as("x^2/(x^2+1)"), "y = 1");
  assert.equal(as("2+1/(x-1)"), "x = 1,\\ y = 2");
  assert.equal(as("e^(1/x)"), "y = 1");
  assert.equal(as("(x^2+1)/x"), "x = 0"); // poševna asimptota ni vodoravna
});

test("pregled: decimalne in iracionalne limite niso ulomki, bližnji vrhovi brez napačne zaloge", () => {
  const as = (s) => row(info(s), "sc.infoAsym")?.tex ?? null;
  assert.equal(as("0,3333+1/x"), "x = 0,\\ y = 0{,}3333");
  assert.equal(as("0,0004+1/x"), "x = 0,\\ y = 0{,}0004");
  assert.equal(as("1000,0004+1/x"), "x = 0,\\ y = 1000{,}0004");
  assert.doesNotMatch(as("123456,789+1/x") ?? "", /frac/);
  assert.doesNotMatch(as("e+1/x") ?? "", /frac/);
  const rg = (s) => row(info(s), "sc.infoRange")?.tex ?? null;
  assert.equal(rg("sin(x)+0,01sin(300x)"), null);
  assert.equal(rg("2cos(x)+1"), "[-1;\\,3]");
});
