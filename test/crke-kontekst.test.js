// Pomen črke iz konteksta (j, 6. 11. 2026): kartica »nedoločeni integral« z Lagrangevim izrekom je x₁
// pokazala kot »prvo rešitev (ničlo)« kvadratne enačbe. Vrstni red: definicija v istem besedilu → tema in
// besedilo → slovar le, če se tema ujema; sicer črka ni klikljiva (docs/pomen-crk.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { Marked } from "marked";
import { createRenderer } from "../public/rich.js";
import { annotateTex, withFormulaSubject, definitionsIn } from "../public/formula-data.js";
import { cardFor, configureCard } from "../public/formula-card.js";
import SL from "../public/i18n/sl.js";

configureCard({ katex, t: (k, v = {}) => String(SL[k] || k).replace(/\{(\w+)\}/g, (_, n) => v[n] ?? "") });
const fx = createRenderer({ marked: new Marked(), katex, sanitize: (h) => h, annotate: (tex, o) => annotateTex(tex, undefined, o) });
const codes = (html) => [...html.matchAll(/data-fx="([^"]+)"/g)].map((m) => decodeURIComponent(m[1].replace(/\./g, "%")));
const card = (html, key) => {
  const c = codes(html).find((x) => x.split(":")[2] === key);
  return c ? cardFor(c) : null;
};
const render = (subject, topic, text) => withFormulaSubject(subject, () => fx.renderRich(text), null, topic);

const LAGRANGE = "Za $H = G - F$ je $H' = 0$. Po Lagrangevem izreku je $H(x_2) - H(x_1) = H'(\\xi)(x_2 - x_1) = 0$, zato je $H$ konstantna.";

test("kartica z Lagrangevim izrekom (nedoločeni integral): x₁ in x₂ nista ničli, H je iz besedila", () => {
  const html = render("MAT", "nedoločeni integral\nZakaj se dve primitivni funkciji iste funkcije na intervalu razlikujeta le za konstanto?", LAGRANGE);
  assert.equal(card(html, "x_1"), null, "x₁ ni klikljiv");
  assert.equal(card(html, "x_2"), null, "x₂ ni klikljiv");
  assert.ok(!codes(html).some((c) => /ničla|x_1/.test(c)));
  const h = card(html, "H");
  assert.ok(h, "H ima pomen iz besedila");
  assert.match(h.html, /Oznaka iz besedila/);
  assert.match(h.html, /fx-line/); // zveza H = G − F
  assert.doesNotMatch(h.html, /Nima enote/);
});

test("ista formula brez teme in besedila: x₁ ni »ničla« (raje nič kot napačno)", () => {
  const html = render("MAT", "", "$H(x_2) - H(x_1) = H'(\\xi)(x_2 - x_1)$");
  assert.equal(card(html, "x_1"), null);
});

test("kvadratna enačba: x₁ je prva rešitev (ničla) – iz formule ali iz teme", () => {
  const byFormula = render("MAT", "", "Rešitvi sta $x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}$, torej $x_1$ in $x_2$.");
  assert.match(card(byFormula, "x_1,2").label, /rešitvi kvadratne enačbe/);
  const byTopic = render("MAT", "Kvadratna enačba", "Reši $x^2 - 5x + 6 = 0$. Rešitvi: $x_1 = 2$, $x_2 = 3$.");
  assert.match(card(byTopic, "x_1").label, /ničla/);
  assert.match(card(byTopic, "x_2").label, /ničla/);
});

test("kvadratna tema, a besedilo je o Lagrangevem izreku: x₁ ni ničla", () => {
  const html = render("MAT", "Kvadratna funkcija", "Po Lagrangevem izreku na intervalu $[x_1, x_2]$ velja …");
  assert.equal(card(html, "x_1"), null);
});

test("D, a, b, c: koeficienti in diskriminanta le pri kvadratni enačbi", () => {
  const quad = render("MAT", "Kvadratna enačba", "Diskriminanta je $D = b^2 - 4ac$.");
  assert.match(card(quad, "D").label, /diskriminanta/);
  const geo = render("MAT", "Štirikotniki", "Oglišča so $A$, $B$, $C$ in $D$; stranice $a$, $b$, $c$.");
  for (const k of ["D", "a", "b", "c"]) assert.equal(card(geo, k), null, k);
});

test("k, n: premica le v temi o premici, ne v zaporedjih ali kombinatoriki", () => {
  assert.match(card(render("MAT", "Linearna funkcija", "Graf je $y = k x + n$."), "k").label, /smerni/);
  assert.equal(card(render("MAT", "Zaporedja", "Za vsak $k$ velja $a_k < a_{k+1}$."), "k"), null);
  assert.equal(card(render("MAT", "Linearna funkcija", "Za vsak $k$ velja $k^2 \\ge 0$."), "k").label.includes("smerni"), true);
  assert.equal(card(render("MAT", "Kombinatorika", "Število je $\\binom{n}{k}$."), "n"), null);
});

test("r, d: polmer in premer le pri krogu; dx v integralu ni premer", () => {
  assert.match(card(render("MAT", "Krog", "Obseg je $o = 2\\pi r$."), "r").label, /polmer/);
  assert.equal(card(render("MAT", "Določeni integral", "$\\int_0^{\\pi} \\sin x \\, dx = 2$"), "d"), null);
});

test("fizika: M je navor le pri navoru, x raztezek le pri vzmeti, n lomni količnik le pri lomu", () => {
  assert.match(card(render("FIZ", "Navor", "$M = r F$"), "M").label, /navor/);
  assert.equal(card(render("FIZ", "Gravitacija", "$F = G \\frac{m M}{r^2}$"), "M"), null);
  assert.match(card(render("FIZ", "Prožnost", "$F = k x$"), "x").label, /raztezek/);
  assert.equal(card(render("FIZ", "Enakomerno gibanje", "$x = x_0 + v t$"), "x"), null);
  assert.match(card(render("FIZ", "Lom svetlobe", "$n = \\frac{c_0}{c}$"), "n").label, /lomni/);
  assert.equal(card(render("FIZ", "Plinska enačba", "$p V = n R T$"), "n"), null);
  // e^{-t/τ}: Eulerjevo število, ne naboj; A pri nihanju je amplituda, ne delo.
  assert.equal(card(render("FIZ", "Kondenzator", "$U = U_0 e^{-t/\\tau}$"), "e"), null);
  assert.equal(card(render("FIZ", "Nihanje", "$x = A \\sin(\\omega t)$"), "A"), null);
  assert.match(card(render("FIZ", "Delo", "$A = F s$"), "A").label, /delo/);
});

test("definicije v besedilu: »kjer je« da ime, številska vrednost ni definicija", () => {
  const d = definitionsIn("Velja $s = v t$, kjer je $v$ hitrost, $t$ čas in $s$ pot. Za $x = 2$ je $y = 4$. Naj bo $\\varphi = \\alpha + \\beta$.");
  const by = Object.fromEntries(d.map((e) => [e.keys[0], e]));
  assert.equal(by.v.n, "hitrost");
  assert.equal(by.t.n, "čas");
  assert.equal(by.s.n, "pot");
  assert.equal(by.x, undefined);
  assert.equal(by["φ"].r, "\\varphi = \\alpha + \\beta");
  // Ime iz besedila je enako slovarju: ostane kartica iz slovarja (z enoto).
  const html = render("FIZ", "Gibanje", "Velja $s = v t$, kjer je $v$ hitrost.");
  assert.match(card(html, "v").html, /m\/s|Enota/);
});

test("Za $x_1 = …$: definicija v besedilu ima prednost pred slovarjem", () => {
  const html = render("MAT", "Kvadratna enačba", "Naj bo $x_1 = \\frac{a + b}{2}$ sredina intervala.");
  const c = card(html, "x_1");
  assert.ok(c);
  assert.doesNotMatch(c.label, /ničla/);
  assert.match(c.html, /Oznaka iz besedila/);
});
