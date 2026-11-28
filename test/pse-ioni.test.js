// Pregled 28. 11.: periodni sistem → Molska masa. Fe3+, Fe^3+ in Fe³⁺ so en atom Fe z nabojem 3+ (prej je Fe3+
// pokazal Fe₃, tri atome in 167,53 g/mol). Preveri vse, kar vidi dijak: izris formule, število atomov v tabeli,
// molsko maso, in isto pot v znanstveni kalkulator (»V kalkulator« in vpisan M(Fe3+)).
// Pravi brskalnik (Chromium in WebKit, kar je nameščeno), 1280 px z miško in 360 px z dotikom.
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}
const PUB = path.resolve("public");
const KX = path.resolve("node_modules/katex/dist");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/graph.css"><script src="/vendor/katex/katex.min.js"></script>
<div id="s" style="height:700px" hidden></div><div id="p"></div>
<script type="module">
import { createScientific } from "/graph/sci.js";
import { createPse } from "/graph/tools.js";
localStorage.clear();
const base = { t: (k) => k, icon: () => "", locale: () => "sl", toast() {} };
const sEl = document.getElementById("s");
const pEl = document.getElementById("p");
window.sci = createScientific(sEl, { ...base, storageKey: () => "t-sci", canSteps: () => false, chapter: () => null });
window.pse = createPse(pEl, { ...base, lang: () => "sl", onInsert: (x) => { pEl.hidden = true; sEl.hidden = false; window.sci.insert(x); } });
window.ready = true;
</script>`;
const engines = [];
for (const name of ["chromium", "webkit"]) {
  try {
    if (playwright) engines.push([name, await playwright[name].launch()]);
  } catch {}
}
const skip = engines.length ? false : "Playwright ni nameščen";

// TeX izrisane formule (KaTeX ga hrani v <annotation>), tabela atomov in molska masa
const read = (page) =>
  page.evaluate(() => {
    const res = document.querySelector(".pse-mm-res");
    return {
      tex: res?.querySelector("annotation")?.textContent || "",
      text: res?.innerText.replace(/\s+/g, " ") || "",
      rows: [...document.querySelectorAll(".pse-tab tbody tr")].map((r) => [...r.cells].slice(0, 2).map((c) => c.textContent.trim())),
    };
  });

test("PSE: naboj iona ne spremeni sestave in molske mase (Fe3+ = Fe), tudi v kalkulatorju", { skip }, async (t) => {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/stran.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = url.startsWith("/vendor/katex/") ? path.join(KX, url.slice(14)) : path.join(PUB, path.normalize(url));
    if (!(file.startsWith(PUB) || file.startsWith(KX)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  t.after(async () => {
    for (const [, b] of engines) await b.close();
    server.close();
  });
  for (const [engine, browser] of engines) {
    for (const [vw, opt] of [["1280", { viewport: { width: 1280, height: 800 } }], ["360", { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true }]]) {
      const ctx = await browser.newContext(opt);
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`http://127.0.0.1:${server.address().port}/stran.html`);
      await page.waitForFunction(() => window.ready);
      const where = `${engine} ${vw}`;
      const tap = (sel) => (opt.hasTouch && engine !== "webkit" ? page.tap(sel) : page.click(sel));
      const molar = async (f) => {
        await page.fill(".pse-f", f);
        return read(page);
      };
      const fe = await molar("Fe");
      assert.deepEqual(fe.rows, [["Fe", "1"]], where);
      assert.match(fe.text, /55,84/, where);
      for (const f of ["Fe3+", "Fe^3+", "Fe³⁺"]) {
        const r = await molar(f);
        assert.deepEqual(r.rows, [["Fe", "1"]], `${where} ${f}`);
        assert.match(r.tex, /\\mathrm\{Fe\}\^\{3\+\}/, `${where} ${f}: ${r.tex}`);
        assert.ok(r.text.includes("55,84") && !r.text.includes("167"), `${where} ${f}: ${r.text}`);
      }
      for (const f of ["Al3+", "Al³⁺"]) {
        const r = await molar(f);
        assert.deepEqual(r.rows, [["Al", "1"]], `${where} ${f}`);
        assert.match(r.text, /26,98/, `${where} ${f}`);
        assert.match(r.tex, /\\mathrm\{Al\}\^\{3\+\}/, `${where} ${f}`);
      }
      const nh4 = await molar("NH4+");
      assert.deepEqual(nh4.rows, [["N", "1"], ["H", "4"]], where);
      assert.match(nh4.tex, /\\mathrm\{NH_\{4\}\}\^\{\+\}/, where);
      const so4 = await molar("SO4^2−");
      assert.deepEqual(so4.rows, [["S", "1"], ["O", "4"]], where);
      assert.match(so4.tex, /\\mathrm\{SO_\{4\}\}\^\{2-\}/, where);
      assert.match(so4.text, /96,06/, where);
      const o22 = await molar("O22-");
      assert.deepEqual(o22.rows, [["O", "2"]], where);
      assert.match(o22.tex, /\\mathrm\{O_\{2\}\}\^\{2-\}/, `${where}: ${o22.tex}`);
      const h2o = await molar("H2O");
      assert.deepEqual(h2o.rows, [["H", "2"], ["O", "1"]], where);
      const fecl3 = await molar("FeCl3");
      assert.deepEqual(fecl3.rows, [["Fe", "1"], ["Cl", "3"]], where);
      assert.match(fecl3.text, /162,19/, where);
      assert.match(fecl3.tex, /\\mathrm\{FeCl_\{3\}\}/, where);
      // »V kalkulator« iz molske mase Fe3+: v kalkulatorju M(Fe) = 55,845
      await molar("Fe3+");
      await tap(".pse-mm-ins");
      assert.equal(await page.inputValue(".sc-input"), "M(Fe)", where);
      await page.press(".sc-input", "Enter");
      const last = () => page.locator(".sc-h-row.last .sc-h-res").innerText();
      assert.match(await last(), /55,845/, where);
      // vpisan M(Fe3+): prej napaka, zdaj M(Fe³⁺) = 55,845
      await page.fill(".sc-input", "M(Fe3+)");
      await page.press(".sc-input", "Enter");
      assert.match(await last(), /55,845/, where);
      const expr = await page.locator(".sc-h-row.last .sc-h-expr annotation").textContent();
      assert.match(expr, /\\mathrm\{Fe\}\^\{3\+\}/, `${where}: ${expr}`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), where);
      assert.deepEqual(errors, [], where);
      await ctx.close();
    }
  }
});
