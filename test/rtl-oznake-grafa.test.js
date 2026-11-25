// AUDIT-056: na strani z dir="rtl" (arabščina) so bile oznake na grafu obrnjene – točka (2; 1) kot »(1;2)«, os »5−«.
// Platno zdaj riše vse besedilo od leve proti desni. Pravi brskalnik (Chromium in WebKit, kar je nameščeno).
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
const PAGE = `<!doctype html><html dir="rtl" lang="ar"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/graph.css"><script src="/vendor/katex/katex.min.js"></script>
<div id="g" style="height:600px"></div>
<script type="module">
// zapišemo smer vsakega besedila na platnu
window.texts = [];
const orig = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function (txt, ...rest) {
  window.texts.push([String(txt), getComputedStyle(this.canvas).direction, this.direction]);
  return orig.call(this, txt, ...rest);
};
import { createCalculator } from "/graph/calc.js";
localStorage.clear();
localStorage.setItem("t-graph", JSON.stringify({ v: 1, zapis: 3, vejica: true, items: [{ id: "p", type: "expr", text: "(2; 1)", color: 0 }, { id: "f", type: "expr", text: "y = x^2 - 3", color: 1, tools: { tangent: 1 } }], view: { xmin: -6, xmax: 6, ymin: -6, ymax: 6 }, settings: {} }));
window.graph = createCalculator(document.getElementById("g"), { t: (k) => k, icon: () => "", locale: () => "ar", toast() {}, storageKey: () => "t-graph", studentId: () => null });
window.ready = true;
</script>`;
const engines = [];
for (const name of ["chromium", "webkit"]) {
  try {
    if (playwright) engines.push([name, await playwright[name].launch()]);
  } catch {}
}
const skip = engines.length ? false : "Playwright ni nameščen";

test("RTL: besedilo na grafu (točke, osi, naklon) je od leve proti desni", { skip }, async (t) => {
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
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/stran.html`);
    await page.waitForFunction(() => window.ready && window.texts.length > 5);
    // i18n ob nalaganju nastavi smer po jeziku strani (sl): stran preklopimo v RTL in narišemo znova
    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
      window.texts = [];
      window.graph.refresh();
    });
    await page.waitForFunction(() => window.texts.length > 5);
    const texts = await page.evaluate(() => window.texts);
    assert.ok(texts.some(([s]) => /\(2; 1\)/.test(s)), `${engine}: ${texts.map((x) => x[0]).join(" | ")}`);
    assert.ok(texts.some(([s]) => /^[−-]\d/.test(s)), `${engine}: os z negativnimi števili`);
    assert.equal(await page.evaluate(() => document.documentElement.dir), "rtl", engine);
    const bad = texts.filter(([, , dir]) => dir !== "ltr");
    assert.deepEqual(bad, [], `${engine}: besedilo brez smeri ltr`);
    assert.deepEqual(errors, [], engine);
    await page.close();
  }
});
