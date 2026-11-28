// Podatki v praznem delu zaslona kalkulatorja (public/graph/sci-info.js; načrt z dopolnitvami ChatGPT, 27. 11. 2026).
import test from "node:test";
import assert from "node:assert/strict";
import { infoFor, plotSvg, INFO_FIRST, divergesAt, fnOf } from "../public/graph/sci-info.js";
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
  assert.equal(row(info("M(Fe3+)", { r: { kind: "value", value: 167 } }), "sc.infoCharge"), undefined);
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

// Revizija 28. 11. 2026 (P1): navpična asimptota le, kjer gre celoten izraz vsaj z ene strani proti ±∞
test("navpične asimptote: 1/tan x pri kπ, cos x · tan x brez, |x|/x le vodoravni", () => {
  const as = (s, o) => row(info(s, o), "sc.infoAsym")?.tex ?? null;
  // 1/tan x: pol pri kπ; pri π/2 + kπ ni definirana, limita je 0 (prazna točka, ne asimptota in ne ničla)
  const c = info("1/tan(x)");
  assert.equal(row(c, "sc.infoAsym").tex, "x = k\\pi,\\ k \\in \\mathbb{Z}");
  assert.equal(row(c, "sc.infoRoots").text, "sc.infoNoRoots");
  assert.ok(c.plot.holes.some(([x, y]) => Math.abs(x - Math.PI / 2) < 1e-9 && y === 0), JSON.stringify(c.plot.holes));
  assert.equal(as("1÷tan(x)"), "x = k\\pi,\\ k \\in \\mathbb{Z}");
  // cos x · tan x = sin x na svoji domeni: odstranljive prekinitve pri π/2 + kπ, brez navpičnih asimptot
  const ct = info("cos(x)*tan(x)");
  assert.equal(row(ct, "sc.infoAsym"), undefined);
  assert.ok(ct.plot.holes.some(([x, y]) => Math.abs(x - Math.PI / 2) < 1e-9 && y === 1), JSON.stringify(ct.plot.holes));
  assert.match(plotSvg(ct.plot.fn, ct.plot.roots, { holes: ct.plot.holes }), /class="hole"/);
  // |x|/x: skok −1 → 1 pri 0, ni asimptote x = 0; vodoravni y = −1 in y = 1 ostaneta
  assert.equal(as("abs(x)/x"), "y = -1,\\ y = 1");
  assert.equal(row(info("abs(x)/x"), "sc.infoDomain").tex, "x \\neq 0");
  // kontrole
  assert.equal(as("tan(x)"), "x = \\tfrac{\\pi}{2} + k\\pi,\\ k \\in \\mathbb{Z}");
  assert.equal(as("1/x"), "x = 0,\\ y = 0");
  assert.equal(as("(x^2-1)/(x-1)"), null);
  assert.deepEqual(info("(x^2-1)/(x-1)").plot.holes, [[1, 2]]);
  // v stopinjah in pri analizi enako pravilo
  assert.equal(as("1/tan(x)", { deg: true }), "x = k \\cdot 180^{\\circ},\\ k \\in \\mathbb{Z}");
  assert.equal(as("cos(x)*tan(x)", { deg: true }), null);
  assert.equal(as("1/tan(x)", { profile: "ana" }), "x = k\\pi,\\ k \\in \\mathbb{Z}");
});

test("navpične asimptote: ostali poli, robovi in vgnezdeni imenovalci", () => {
  const as = (s) => row(info(s), "sc.infoAsym")?.tex ?? null;
  assert.equal(as("cot(x)"), "x = k\\pi,\\ k \\in \\mathbb{Z}");
  assert.equal(as("tan(x)^2"), "x = \\tfrac{\\pi}{2} + k\\pi,\\ k \\in \\mathbb{Z}");
  assert.equal(as("1/sin(x)^2"), "x = k\\pi,\\ k \\in \\mathbb{Z}");
  assert.equal(as("sin(2x)/sin(x)"), null); // = 2 cos x, luknje pri kπ
  assert.equal(as("ln(x)"), "x = 0");
  assert.equal(as("1/ln(x)"), "x = 1");
  assert.equal(as("1/sqrt(x-2)"), "x = 2");
  assert.equal(as("sqrt(x-2)"), null);
  assert.equal(as("(x^2-4)/(x^2-x-2)"), "x = -1,\\ y = 1"); // pri 2 prazna točka
  assert.equal(as("exp(1/x)"), "x = 0,\\ y = 1"); // le z desne proti +∞
  // vgnezden imenovalec: 1/√(sin x) ima pola z ene strani pri 2kπ in π + 2kπ (pri 3π/2 f ni definirana)
  assert.equal(as("tan(x)+1/sqrt(sin(x))"), "x_{1} = k \\cdot 2\\pi,\\ x_{2} = \\tfrac{\\pi}{2} + k \\cdot 2\\pi,\\ x_{3} = \\pi + k \\cdot 2\\pi,\\ k \\in \\mathbb{Z}");
  assert.equal(row(info("1/ln(abs(x))"), "sc.infoDomain").tex, "x \\in (-\\infty;\\,0) \\cup (0;\\,\\infty),\\ x \\neq -1,\\ 1");
  // pregled #1227: deljenje veže le naslednji člen (1/2 sin x = ½ sin x, 1/x(x + 1) = (x + 1)/x)
  for (const s of ["1/2sin(x)", "1/2cos(x)", "1:2x", "1÷2x"]) {
    assert.deepEqual(info(s).plot?.holes ?? [], [], s);
    assert.equal(as(s), null, s);
  }
  assert.equal(as("1/2tan(x)"), "x = \\tfrac{\\pi}{2} + k\\pi,\\ k \\in \\mathbb{Z}");
  assert.equal(as("1/x(x+1)"), "x = 0,\\ y = 1");
  // deljenje s potenco oklepaja: imenovalec ostane (x − 1)², definicijsko območje in asimptota ostaneta
  assert.equal(as("1/(x-1)^2"), "x = 1,\\ y = 0");
  assert.equal(row(info("(x+2)/(x-1)^2"), "sc.infoDomain").tex, "x \\neq 1");
  assert.equal(as("1/(2*sin(x)-1)^2"), "x_{1} = \\tfrac{\\pi}{6} + k \\cdot 2\\pi,\\ x_{2} = \\tfrac{5\\pi}{6} + k \\cdot 2\\pi,\\ k \\in \\mathbb{Z}");
  // enakomerno razmaknjeni poli v enem zapisu; 1/(tan x − 1) ima pol pri π/4 + kπ (ne pri π/2 + kπ)
  assert.equal(as("1/sin(x)"), "x = k\\pi,\\ k \\in \\mathbb{Z}");
  assert.equal(as("tan(x)+cot(x)"), "x = k \\cdot \\tfrac{\\pi}{2},\\ k \\in \\mathbb{Z}");
  assert.equal(as("1/(tan(x)-1)"), "x = \\tfrac{\\pi}{4} + k\\pi,\\ k \\in \\mathbb{Z}");
  assert.equal(as("tan(tan(x))"), null); // poli se kopičijo ob π/2: seznam ne bi bil popoln
  assert.equal(as("1/sin(tan(x))"), null);
  // brez zanesljivega imenovalca (velik vrh brez ničle imenovalca) ali z logaritmom: raje nič
  assert.equal(as("1/(sin(x)^2+0,000001)"), null);
  assert.equal(as("ln(sin(x))"), null);
});

test("divergesAt: pol, logaritem, enostranski pol; skok, prazna točka in nihanje niso asimptote", () => {
  const env = { vars: {}, funcs: {}, ans: 0, deg: false, live: true };
  const d = (s, a) => divergesAt(fnOf(s, env), a);
  assert.equal(d("1/x", 0), true);
  assert.equal(d("1/x^2", 0), true);
  assert.equal(d("ln(x)", 0), true);
  assert.equal(d("exp(1/x)", 0), true);
  assert.equal(d("tan(x)", Math.PI / 2), true);
  assert.equal(d("1/tan(x)", Math.PI / 2), false);
  assert.equal(d("cos(x)*tan(x)", Math.PI / 2), false);
  assert.equal(d("abs(x)/x", 0), false);
  assert.equal(d("(x^2-1)/(x-1)", 1), false);
  assert.equal(d("sin(x)/x", 0), false);
  assert.equal(d("sin(1/x)", 0), false);
  assert.equal(d("sqrt(x)", 0), false);
});
