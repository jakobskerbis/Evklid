// Enoten matematični zapis, faza F2 (j, 24. 11. 2026; projektni dokument predlogi/enoten-matematicni-zapis-nacrt-2026-11-24.md):
// klepet piše zapis, ki ga izriše KaTeX (ne znakov Unicode), kviz v živo na projektorju ima iste formule kot aplikacija.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { prettify } from "../public/lepi-zapis.js";
import { splitFormulas, hasFormula } from "../public/vnos-formul.js";

const pub = (f) => fs.readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8");
const type = (str) => {
  let v = "";
  let run = null;
  for (const c of str) {
    v += c;
    const r = prettify(v, c, run);
    run = r?.run ?? null;
    if (r) v = v.slice(0, r.from) + r.text;
  }
  return v;
};

test("klepet: potenca, indeks in ulomek so po pisanju formula za KaTeX, ne Unicode", () => {
  for (const [s, tex] of [
    ["x^2", "x^{2}"],
    ["a_n", "a_{n}"],
    ["3/4", "\\frac{3}{4}"],
    ["x^(n+1)", "x^{n+1}"],
    ["sqrt(2)", "\\sqrt{2}"],
  ]) {
    const v = type(s);
    assert.ok(hasFormula(v), `${s} → ${v} ni formula`);
    assert.equal(splitFormulas(v)[0].tex, tex, s);
  }
  // V lepi-zapis.js ni več tabel nadpisanih/podpisanih znakov (vir zapisa x², ³⁄₄).
  assert.doesNotMatch(pub("lepi-zapis.js"), /\b(?:SUP|SUB)S?\b\s*=/);
});

test("kviz v živo: projektor zlaga dolge formule in ima ista pravila za formule", () => {
  const kviz = pub("kviz.js");
  assert.match(kviz, /import\("\.\/sirina\.js"\)/);
  assert.match(kviz, /naloziKnjiznice/);
  assert.match(kviz, /export function hostQuiz[^]*?sirinaFormul\(\)/);
  const css = pub("kviz.css");
  for (const re of [/\.kv \.mat-napaka/, /\.kv \.katex\.tb-zlozena/, /\.kv \.katex\.tb-dolga/, /\.kv \.katex:not\(svg \.katex\) \{ white-space: nowrap; \}/]) assert.match(css, re);
  const html = pub("ucitelj.html");
  assert.match(html, /vendor\/katex\/katex\.min\.css/);
  assert.match(html, /kviz\.css/);
});
