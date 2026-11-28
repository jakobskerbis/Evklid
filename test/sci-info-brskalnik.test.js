// Vrstica »Asimptote« v podatkih znanstvenega kalkulatorja v pravem brskalniku (Playwright: Chromium in WebKit, kar je
// nameščeno), 1920 × 1080 v RAD (revizija 28. 11. 2026, P1): 1/tan x ima x = kπ, cos x · tan x in |x|/x nimata
// navpične asimptote, tan x ima x = π/2 + kπ. Prikazani TeX beremo iz KaTeX (annotation), po potrebi pod »Več«.
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
<div id="s" style="height:100vh"></div>
<script type="module">
import { createScientific } from "/graph/sci.js";
localStorage.clear();
window.sci = createScientific(document.getElementById("s"), { t: (k) => k, icon: () => "", locale: () => "sl", toast: () => {}, storageKey: () => "t-sci", canSteps: () => false, stage: () => null });
window.ready = true;
</script>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = url.startsWith("/vendor/katex/") ? path.join(KX, url.slice(14)) : path.join(PUB, path.normalize(url));
    if (!(file.startsWith(PUB) || file.startsWith(KX)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

const engines = [];
for (const name of ["chromium", "webkit"]) {
  try {
    if (playwright) engines.push([name, await playwright[name].launch()]);
  } catch {}
}
const skip = engines.length ? false : "Playwright ni nameščen";

test("podatki »Asimptote« pri 1920 × 1080 v RAD: 1/tan x, cos x · tan x, |x|/x, tan x, 1/x", { skip }, async (t) => {
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}/t.html`;
  t.after(async () => {
    for (const [, b] of engines) await b.close();
    server.close();
  });
  for (const [engine, browser] of engines) {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(url);
    await page.waitForFunction(() => window.ready);
    await page.click('.sc-angle [data-angle="rad"]');
    // vrstica »Asimptote« (ali null, če je ni) za zapis; podatki se izračunajo po premoru tipkanja
    const asym = async (text) => {
      await page.fill(".sc-input", text);
      await page.waitForFunction(
        (text) => {
          const box = document.querySelector(".sc-info");
          return document.querySelector(".sc-input").value === text && box && !box.hidden && !box.classList.contains("sc-info-empty");
        },
        text,
        { timeout: 15000 },
      );
      return page.evaluate(() => {
        const more = document.querySelector(".sc-info-more");
        if (more && more.getAttribute("aria-expanded") !== "true") more.click();
        const rowEl = [...document.querySelectorAll(".sc-info-row")].find((r) => r.querySelector(".sc-info-k").textContent === "sc.infoAsym");
        return rowEl ? rowEl.querySelector(".sc-info-v annotation")?.textContent ?? rowEl.querySelector(".sc-info-v").textContent : null;
      });
    };
    const where = engine;
    assert.equal(await asym("1/tan(x)"), "x = k\\pi,\\ k \\in \\mathbb{Z}", where);
    assert.equal(await asym("cos(x)*tan(x)"), null, where);
    assert.equal(await asym("abs(x)/x"), "y = -1,\\ y = 1", where);
    assert.equal(await asym("tan(x)"), "x = \\tfrac{\\pi}{2} + k\\pi,\\ k \\in \\mathbb{Z}", where);
    assert.equal(await asym("1/x"), "x = 0,\\ y = 0", where);
    assert.equal(await asym("(x^2-1)/(x-1)"), null, where);
    assert.deepEqual(errors, [], where);
    await ctx.close();
  }
});
