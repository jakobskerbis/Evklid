// Vnos znanstvenega kalkulatorja je viden samo kot lep zapis s kazalcem (j, 5. 11.; pregled #457).
import { test } from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { readFileSync } from "node:fs";
import { entryBase, entryTex, caretTex, caretStops, stopsTex, stripCaret, complete, analyzeLive, CARET, HOLE, TRUST } from "../public/graph/sci-vnos.js";
import { previewTex } from "../public/graph/scisolve.js";
import { functionDef } from "../public/graph/scicore.js";

const env = { vars: {}, funcs: {}, ans: 0, deg: true, grad: false, comma: true };
const carets = (tex) => tex.split(CARET).length - 1;
const render = (tex) => katex.renderToString(tex, { throwOnError: true, strict: "ignore", trust: TRUST });
// za vsak položaj kazalca: natanko en kazalec, zapis brez kazalca je enak zapisu besedila, KaTeX ga izriše
function everyCaret(text, expected, e = env) {
  const base = entryBase(text, e);
  assert.ok(base?.ok, text);
  for (let p = 0; p <= text.length; p++) {
    const tex = caretTex(base, p);
    assert.equal(carets(tex), 1, `${text} @${p}: ${tex}`);
    assert.equal(stripCaret(tex), expected, `${text} @${p}: kazalec spremeni zapis`);
    render(tex);
  }
}

test("kazalec je samostojen atom: zapis brez kazalca je enak previewTex(besedilo) na vsakem položaju", () => {
  for (const t of ["1/2", "2^(10)", "√(2)+3", "12345", "sin(30)", "2+3", "x³−8", "2,5+1"]) everyCaret(t, previewTex(t, env));
  // razstavi gre po poti predogleda (ukaz CAS), ne po previewTex, ki ime razbije na črke
  const r = analyzeLive("razstavi(x^3-8)", env);
  assert.match(r.tex, /\\operatorname\{razstavi\}/);
  everyCaret("razstavi(x^3-8)", r.tex);
});

test("kazalec stoji tam, kjer je v besedilu (ulomek, potenca, število, ime funkcije)", () => {
  const at = (t, p) => entryTex(t, p, env).tex.replace(CARET, "‸");
  assert.equal(at("1/2", 2), "\\frac{1}{‸2}");
  assert.equal(at("1/2", 1), "\\frac{1‸}{2}");
  assert.equal(at("12345", 2), "12‸345");
  assert.equal(at("2^(10)", 1), "2‸^{10}");
  assert.equal(at("2^(10)", 3), "2^{‸10}");
  assert.equal(at("2^(10)", 6), "2^{10}‸");
  assert.equal(at("2+3", 0), "‸2+3");
  assert.equal(at("sin(30)", 4), "\\sin\\left(‸30\\right)");
  for (const p of [1, 2]) assert.ok(!/s.*‸.*in|\\sin‸?[a-z]/.test(at("sin(30)", p)), at("sin(30)", p)); // ime funkcije ostane celo
  assert.equal(at("x³−8", 2), "x^{3}‸-8");
});

test("ukazi, kemija, lastne funkcije in decimalna vejica gredo po isti poti kot predogled", () => {
  const tex = (t, e = env, p) => stripCaret(entryTex(t, p ?? t.length, e).tex);
  assert.match(tex("razstavi(x³−8)"), /^\\operatorname\{razstavi\}\\left\(x\^\{3\}-8\\right\)$/);
  assert.match(tex("limita(sin(x)/x;x;0)"), /^\\lim\\limits_\{x \\to 0\}/);
  assert.equal(tex("f(x)=x^2"), "f\\left(x\\right) = x^{2}");
  assert.equal(tex("M(H2O)"), "M(\\mathrm{H_{2}O})");
  const f = functionDef("f(x)=x^2+1");
  assert.equal(tex("f(2)", { ...env, funcs: { f } }), "f\\left(2\\right)");
  assert.equal(tex("2.5+1"), "2{,}5+1", "slovenščina: vejica");
  assert.equal(tex("2.5+1", { ...env, comma: false }), "2.5+1", "angleščina: pika");
  for (const t of ["razstavi(x³−8)", "limita(sin(x)/x;x;0)", "M(H2O)", "∫(x;0;1)", "d/dx(x^2)"]) everyCaret(t, tex(t));
  // nedokončan ukaz: ime ukaza, ne črke
  assert.match(entryTex("razstavi(", 9, env).tex, /^\\operatorname\{razstavi\}\\left\(/);
});

test("za operatorjem s kazalcem se vidita znak in prazen okvirček", () => {
  const e = entryTex("2×", 2, env);
  assert.ok(e.ok);
  assert.equal(e.tex, `2\\cdot${CARET} ${HOLE}`);
  assert.equal(entryTex("e^(", 3, env).tex, `e^{${CARET}${HOLE}}`);
  assert.equal(entryTex("5+", 2, env).tex, `5+${CARET}${HOLE}`);
  assert.match(entryTex("sin(", 4, env).tex, /^\\sin\\left\(.*sc-caret.*sc-hole.*\\right\)$/);
  assert.match(entryTex("(2+3)/", 6, env).tex, /^\\frac\{2\+3\}\{/);
  assert.equal(complete("sin(2+(3", "7").text, "sin(2+(3))");
  assert.equal(complete("2+", "7777").text, "2+7777");
  assert.equal(complete("2+", "7777").at(2), 2, "kazalec je pred okvirčkom");
});

test("samostojni kalkulator (mobilna aplikacija) ima spustne menije kot aplikacija: »Samodejno« cel pri 360 px", () => {
  const src = readFileSync(new URL("../public/kalkulator.js", import.meta.url), "utf8");
  assert.match(src, /^import "\.\/dropdown\.js";$/m);
});

test("nerazčlenljivo besedilo ni surovo; vedno natanko en kazalec; merilne točke za dotik", () => {
  assert.equal(entryTex("", 0), null);
  for (const [t, c] of [["2x+3=7", 6], ["d/dx(x^2", 8], ["∫(x;0;", 6], ["3;", 2], ["))", 1], ["x$#", 3], ["5ee^(e", 3]]) {
    const e = entryTex(t, c, env);
    assert.ok(e && carets(e.tex) === 1, `${t}: ${e && e.tex}`);
    render(e.tex);
  }
  const base = entryBase("1/2+3", env);
  const stops = caretStops(base);
  assert.deepEqual(stops.map((s) => s.p), [0, 1, 2, 3, 4, 5]);
  const html = render(stopsTex(base));
  assert.equal((html.match(/data-evk-p=/g) || []).length, stops.length);
});
