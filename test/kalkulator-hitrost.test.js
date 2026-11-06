// Kalkulator se odpre in menja razdelke takoj (j 6. 11. 2026, naloga hitrost +8, +9): razdelki ostanejo
// v pomnilniku (skrij/pokaži, brez ponovne gradnje), ostali se pripravijo ob nedejavnosti, velik list formul
// brskalnik izriše samo blizu zaslona. Meritev v brskalniku: node scripts/meri-hitrost.cjs.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const src = (p) => fs.readFileSync(new URL(`../public/${p}`, import.meta.url), "utf8");

test("razdelki kalkulatorja se ob preklopu skrijejo, ne odstranijo (stanje ostane)", () => {
  const app = src("app.js");
  const fn = app.slice(app.indexOf("function showCalcRoot("), app.indexOf("}", app.indexOf("function showCalcRoot(")) + 1);
  assert.match(fn, /el\.hidden = el !== root/, "ostali razdelki samo skriti");
  assert.doesNotMatch(fn, /replaceChildren|innerHTML|\.remove\(/, "preklop ne sme odstraniti drugih razdelkov");
  assert.match(app, /calcTools\[mode\] \|\|=/, "vsak razdelek se zgradi enkrat");
  assert.match(app, /function prebuildCalc\(/, "ostali razdelki se pripravijo ob nedejavnosti");
});

test("Orodja: vsako orodje (Enote, Enačbe …) se zgradi enkrat in ob vrnitvi ostane", () => {
  const tools = src("graph/tools.js");
  assert.match(tools, /if \(!views\[k\]\) \{/, "orodje se zgradi samo, če ga še ni");
});

test("Formule: list se ob vrnitvi ne izriše znova, kartice daleč od zaslona brskalnik preskoči", () => {
  const tools = src("graph/tools.js");
  assert.match(tools, /if \(k === lastKey && book && \(cache\[book\] \|\| loading === book\)\) return;/, "reload ne gradi lista znova");
  const css = src("graph.css");
  assert.match(css, /\.fm-body \.fm-sec:nth-child\(n \+ 3\) \{ content-visibility: auto; contain-intrinsic-size: auto \d+px; \}/);
  // formul v neizrisanem delu ne merimo (merjenje bi ga postavilo takoj), prilagodimo jih, ko se izriše
  for (const f of ["sirina.js", "drsniki.js"]) {
    const s = src(f);
    assert.match(s, /checkVisibility\(\{ contentVisibilityAuto: true \}\)/, f);
    assert.match(s, /addEventListener\("contentvisibilityautostatechange"/, f);
  }
});

test("Formule: list se pripravi ob nedejavnosti in izriše po kosih (brez dolge blokade glavne niti)", () => {
  const tools = src("graph/tools.js");
  assert.match(tools, /prepare\(\) \{\s*if \(lastKey\) return;/, "priprava ne prepiše lista, ki ga je učenec že odprl");
  assert.match(tools, /await kos\(\);\s*if \(my !== gen\) return;/, "izris po razdelkih, prekinljiv");
  const app = src("app.js");
  const fn = app.slice(app.indexOf("function prebuildCalc("), app.indexOf("document.querySelectorAll(\".calc-modes\")"));
  assert.match(fn, /tool\.prepare\?\.\(\)/, "prebuildCalc pripravi list formul");
  assert.match(fn, /saveData/, "ne ob varčevanju s podatki");
});

test("drsne vrstice: najprej vse mere, nato zapisi (brez ponavljanja postavitve strani za vsako vrstico)", () => {
  const d = src("drsniki.js");
  assert.match(d, /const oznaciVse = \(els\) => els\.map\(izmeri\)\.forEach\(uporabi\);/);
  assert.match(d, /oznaciVse\(vrste\)/);
  assert.match(d, /new ResizeObserver\(\(vnosi\) => oznaciVse\(/);
});

test("velik razdelek ob prvem prikazu: najprej slika z izbranim gumbom, razdelek v naslednji sliki", () => {
  const app = src("app.js");
  assert.match(app, /!calcShown\.has\(tool\.root\) && tool\.root\.getElementsByTagName\("\*"\)\.length > 2000/);
  assert.match(app, /requestAnimationFrame\(\(\) => setTimeout\(r, 0\)\)\);\s*if \(calcMode !== mode\) return;/);
});
