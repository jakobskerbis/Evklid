// Skupni izris matematike (public/mat/izris.js; j, 24. 11. 2026, enoten matematični zapis, faza F1).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import { izrisi, napakaIzraza, decVejica, NAPAKA_HTML } from "../public/mat/izris.js";

test("KaTeX kliče samo public/mat/izris.js", () => {
  const najdi = (d) =>
    fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(d, e.name);
      if (e.isDirectory()) return e.name === "vendor" || e.name === "node_modules" ? [] : najdi(p);
      return /\.(m?js|cjs)$/.test(e.name) ? [p] : [];
    });
  const kdo = [...najdi("public"), ...najdi("server")].filter((p) => !p.endsWith(path.join("mat", "izris.js")) && /\.renderToString\s*\(/.test(fs.readFileSync(p, "utf8")));
  assert.deepEqual(kdo, []);
});

test("neveljaven izraz: okvirček, nikoli rdeč surov LaTeX; vrzi in besedilo na zahtevo", () => {
  for (const t of ["\\frac{1}{", "x^", "\\neznano{x}", "\\begin{pmatrix}1"]) {
    const h = izrisi(t, { katex });
    assert.equal(h, NAPAKA_HTML, t);
    assert.doesNotMatch(h, /katex-error|\\frac/);
  }
  assert.throws(() => izrisi("\\frac{1}{", { katex, napaka: "vrzi" }));
  assert.equal(izrisi("a<\\frac{", { katex, napaka: "besedilo" }), "a&lt;\\frac{");
  assert.match(napakaIzraza("\\frac{1}{", { katex }), /KaTeX parse error/);
  assert.equal(napakaIzraza("\\frac{1}{2}", { katex }), null);
});

test("MathML za bralnike zaslona, blok, izhod", () => {
  assert.match(izrisi("x^2", { katex }), /<math xmlns/);
  assert.match(izrisi("x^2", { katex, blok: true }), /katex-display/);
  assert.doesNotMatch(izrisi("x^2", { katex, izhod: "html" }), /<math/);
});

test("decimalna vejica: 3,14 brez presledka; naštevanje ostane", () => {
  assert.equal(decVejica("0,041 + 3,5"), "0{,}041 + 3{,}5");
  assert.equal(decVejica("x_{1,2}"), "x_{1,2}");
  assert.equal(decVejica("\\{1,2,3\\}"), "\\{1,2,3\\}");
  assert.equal(izrisi("3,14", { katex, vejica: true }), izrisi("3{,}14", { katex }));
});

test("varnost: \\href, \\url, \\includegraphics in tuji \\htmlClass se ne izvedejo", () => {
  for (const t of ["\\href{javascript:alert(1)}{x}", "\\url{https://zlo.example}", "\\includegraphics{https://zlo.example/a.png}", "\\htmlClass{x}{y}", "\\htmlStyle{color:red}{y}"]) {
    const h = izrisi(t, { katex, zaupaj: "oznake" });
    assert.doesNotMatch(h, /href=|<img|javascript:|style="color:red"/, t);
  }
  // kazalec v polju je dovoljen samo s svojim razredom
  assert.match(izrisi("\\htmlClass{vnos-kazalka}{x}", { katex, zaupaj: "kazalec" }), /vnos-kazalka/);
  assert.doesNotMatch(izrisi("\\htmlClass{zlo}{x}", { katex, zaupaj: "kazalec" }), /class="[^"]*zlo/);
});

test("prevelik ali rekurziven izraz ne zamrzne (maxExpand, maxSize)", () => {
  const t0 = Date.now();
  const h = izrisi("\\def\\a{\\a\\a}\\a", { katex });
  assert.equal(h, NAPAKA_HTML);
  assert.doesNotMatch(izrisi("\\rule{1000em}{1000em}", { katex }), /height:1000em/);
  assert.ok(Date.now() - t0 < 2000);
});

test("brez naložene knjižnice: ubežano besedilo, nikoli HTML iz vnosa", () => {
  assert.equal(izrisi("<img src=x>"), '<span class="mat-caka">&lt;img src=x&gt;</span>');
});
