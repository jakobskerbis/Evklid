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

test("klepet: decimalni imenovalec ni ulomek celih števil", () => {
  assert.equal(type("3/4,5"), "3/4,5");
  assert.equal(type("3/4.5"), "3/4.5");
  assert.equal(type("3/45,2"), "3/45,2");
});

// V brskalniku (CI: Chromium + WebKit): polje klepeta z izrisom (predogled-vnosa.js) in lepim zapisom (lepi-zapis.js),
// kot v app.js. 3/4 se izriše kot ulomek KaTeX, ⌫ takoj za tem vrne »3/4« (prej je ⌫ izrisa le premaknil kazalec).
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
let playwright = null;
try {
  playwright = createRequire(import.meta.url)("playwright");
} catch {}
const PUB = path.resolve("public");
const NM = path.resolve("node_modules");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".html": "text/html" };
const PAGE = `<!doctype html><html lang="sl"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css">
<div id="klepet" style="padding:8px"><textarea id="input" rows="1" data-izris-v-polju style="width:100%;font-size:16px;padding:8px;box-sizing:border-box;resize:none"></textarea></div>
<script src="/vendor/katex/katex.min.js"></script>
<script type="module">
import { initPredogledVnosa } from "/predogled-vnosa.js";
import { attachPrettify } from "/lepi-zapis.js";
attachPrettify(document.getElementById("input"));
document.addEventListener("input", (e) => initPredogledVnosa(e.target), true);
window.ready = true;
</script></html>`;
const browsers = [];
for (const kind of ["chromium", "webkit"]) {
  try {
    if (playwright) browsers.push([kind, await playwright[kind].launch()]);
  } catch {}
}
const server = browsers.length
  ? await new Promise((ok) => {
      const s = http.createServer((req, res) => {
        const url = req.url.split("?")[0];
        if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
        const pre = url.startsWith("/vendor/katex/") ? "/vendor/katex/" : null;
        const base = pre ? path.join(NM, "katex/dist/") : PUB;
        const file = path.join(base, path.normalize(pre ? url.slice(pre.length) : url));
        if (!file.startsWith(base) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
        res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
      });
      s.listen(0, "127.0.0.1", () => ok(s));
    })
  : null;
test.after(async () => {
  for (const [, b] of browsers) await b.close();
  server?.close();
});
for (const [kind, browser] of browsers) {
  test(`klepet (${kind}): 3/4 se izriše kot ulomek KaTeX, ⌫ vrne 3/4, x^2 ni Unicode`, async () => {
    const p = await browser.newPage({ viewport: { width: 360, height: 740 } });
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(`http://127.0.0.1:${server.address().port}/t.html`);
    await p.waitForFunction(() => window.ready);
    await p.focus("#input");
    await p.keyboard.type("3/4");
    await p.waitForFunction(() => document.querySelector(".mfrac"));
    assert.equal(await p.inputValue("#input"), "(3)/(4)");
    await p.keyboard.press("Backspace");
    assert.equal(await p.inputValue("#input"), "3/4");
    await p.fill("#input", "");
    await p.keyboard.type("x^2 ");
    assert.equal(await p.inputValue("#input"), "x^2 ");
    await p.waitForFunction(() => document.querySelector(".msupsub"));
    assert.deepEqual(errors, []);
    await p.close();
  });
}
