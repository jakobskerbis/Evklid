// Interaktivne črke: na strani ena oznaka za vsak pomen, ista črka z drugim pomenom svoj ton, pomen iz
// formule in povedi (formula-data.js annotateTex, formula-card.js claimMarks / meaningOf).
import test from "node:test";
import assert from "node:assert/strict";
import { annotateTex, withFormulaSubject, parseSymbolsBlock } from "../public/formula-data.js";
import { cardFor, claimMarks, createMarkPage, releaseMarks, meaningOf } from "../public/formula-card.js";
import { createRenderer, sentenceAt } from "../public/rich.js";

const codes = (tex) => [...tex.matchAll(/fx=([^}]*)/g)].map((m) => decodeURIComponent(m[1].replace(/\./g, "%")));

test("kartica pokaže pomen, ki ga je izbrala formula (G v gravitacijskem zakonu)", () => {
  const g = codes(annotateTex("F = G\\frac{m_1 m_2}{r^2}", "FIZ")).find((c) => c.includes(":G"));
  assert.match(cardFor(g).label, /gravitacijska konstanta/);
});

test("poved izbere pomen dvoumne črke", () => {
  const [a] = codes(annotateTex("p", "FIZ", { sentence: "Gibalno količino p izračunamo kot zmnožek mase in hitrosti" }));
  assert.match(cardFor(a).label, /gibalna količina/);
  assert.equal(sentenceAt("Prvi stavek. Tu je @@MATH0@@ gibalna količina. Drugi.", "@@MATH0@@"), "Tu je gibalna količina");
});

test("na strani je klikljiva le prva pojavitev pomena; drug pomen iste črke dobi ton", () => {
  const sym = parseSymbolsBlock("a | realni del kompleksnega števila $z$ | | –").list;
  const az = withFormulaSubject("MAT", () => codes(annotateTex("z = a + bi")), sym).find((c) => c.endsWith(":a"));
  const fa = codes(annotateTex("F = m a", "FIZ")).find((c) => c.endsWith(":a"));
  assert.notEqual(meaningOf(az).id, meaningOf(fa).id);
  const page = createMarkPage();
  const plan = claimMarks(page, "stran", [az, fa, az, fa, fa]);
  assert.deepEqual(plan.map((p) => p.dup), [false, false, true, true, true]);
  assert.deepEqual(plan.slice(0, 2).map((p) => p.tone), [0, 1]);
});

test("aplikacija: več besedil na zaslonu si deli oznake, sprostitev vrne oznako", () => {
  const page = createMarkPage();
  const [m] = codes(annotateTex("m", "FIZ"));
  const A = {}, B = {};
  assert.equal(claimMarks(page, A, [m])[0].dup, false);
  assert.equal(claimMarks(page, B, [m])[0].dup, true);
  assert.equal(claimMarks(page, A, [m, m])[0].dup, false, "ponoven izris istega besedila ohrani oznako");
  releaseMarks(page, A);
  assert.equal(claimMarks(page, B, [m])[0].dup, false);
});

test("izris besedila poda poved v označevanje", () => {
  const seen = [];
  const r = createRenderer({ marked: { parse: (s) => s }, katex: { renderToString: (t) => t }, sanitize: (h) => h, annotate: (tex, o) => (seen.push(o?.sentence), tex) });
  r.renderRich("Hitrost $v$ merimo v m/s. Čas $t$ v sekundah.");
  assert.deepEqual(seen, ["Hitrost merimo v m/s", "Čas v sekundah"]);
});

test("formula ima prednost pred povedjo; poved odloči le, če imenuje natanko en pomen", () => {
  const label = (tex, sentence) => cardFor(codes(annotateTex(tex, "FIZ", { sentence })).find((c) => /:(G|h|c|p)(:|$)/.test(c))).label;
  assert.match(label("F = G\\frac{m_1 m_2}{r^2}", "Gibalna količina se ohranja, gravitacijska sila pa je"), /gravitacijska konstanta/);
  assert.match(label("E = h f", "višina ni pomembna"), /Planckova/);
  assert.doesNotMatch(label("Q = m c \\Delta T", "Svetloba se hitro segreje"), /svetlobe/);
  assert.match(label("G = 6{,}67\\cdot 10^{-11}", "Gravitacijska konstanta je"), /gravitacijska konstanta/);
  assert.match(label("h = 6{,}63\\cdot 10^{-34}", "Planck constant is"), /Planckova/);
});

test("ton pomena ostane, ko drugo besedilo sprosti oznake", () => {
  const sym = parseSymbolsBlock("a | realni del kompleksnega števila $z$ | | –").list;
  const az = withFormulaSubject("MAT", () => codes(annotateTex("z = a + bi")), sym).find((c) => c.endsWith(":a"));
  const fa = codes(annotateTex("F = m a", "FIZ")).find((c) => c.endsWith(":a"));
  const page = createMarkPage();
  const A = {}, B = {}, C = {};
  claimMarks(page, A, [az]);
  assert.equal(claimMarks(page, B, [fa])[0].tone, 1);
  releaseMarks(page, A);
  assert.equal(page.version, 1);
  assert.equal(claimMarks(page, C, [az])[0].tone, 0, "realni del ostane modre barve");
});

test("poved: okrajšave in formula sama v vrstici", () => {
  assert.equal(sentenceAt("Npr. sila @@MATH0@@ je 1. Newtonov zakon. Drugo.", "@@MATH0@@"), "Npr. sila je 1. Newtonov zakon");
  assert.equal(sentenceAt("Planckova konstanta:\n\n@@MATH0@@\n\nNaprej.", "@@MATH0@@"), "Planckova konstanta:");
});
