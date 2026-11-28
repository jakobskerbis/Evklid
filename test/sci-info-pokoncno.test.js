// Podatki znanstvenega kalkulatorja v pravem brskalniku (Playwright: Chromium in WebKit, kar je nameščeno), j 28. 11. 2026:
// mali graf kotne funkcije v DEG pokaže dve periodi (prej [−5°; 5°], ravna črta), podatki se pokažejo tudi na tablici
// pokončno (820 × 1180, 1024 × 1366) in na telefonu (390 × 844, 360 × 740); na 375 × 667 ni prostora.
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

test("podatki s sin x v DEG: dve periodi na malem grafu; tudi pokončno (tablica, telefon), razen premajhnega zaslona", { skip }, async (t) => {
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}/t.html`;
  t.after(async () => {
    for (const [, b] of engines) await b.close();
    server.close();
  });
  for (const [engine, browser] of engines) {
    for (const [w, h, shown] of [
      [1366, 1024, true], // iPad ležeče (.sc-c)
      [820, 1180, true], // iPad pokončno (.sc-p)
      [1024, 1366, true], // iPad Pro 13 pokončno (.sc-tall + .sc-p)
      [390, 844, true], // telefon pokončno (.sc-pn): nižji podatki, ključ nad vrednostjo
      [360, 740, true],
      [375, 667, false], // iPhone SE: premalo prostora nad tipkami, zgodovina ostane
    ]) {
      const where = `${engine} ${w}×${h}`;
      const ctx = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(url);
      await page.waitForFunction(() => window.ready);
      await page.click('.sc-angle [data-angle="deg"]');
      await page.fill(".sc-input", "sin(x)");
      if (shown) {
        await page.waitForFunction(() => {
          const box = document.querySelector(".sc-info");
          return box && !box.hidden && !box.classList.contains("sc-info-empty") && box.querySelector("svg");
        }, null, { timeout: 15000 });
        const s = await page.evaluate(() => {
          const box = document.querySelector(".sc-info");
          const r = box.getBoundingClientRect();
          const keys = document.querySelector(".sc-keys").getBoundingClientRect();
          // vrednosti niso odrezane (telefon: dolge ničle se pomanjšajo)
          const clipped = [...box.querySelectorAll(".sc-info-v")].some((v) => v.scrollWidth > v.clientWidth + 1);
          return { on: document.querySelector(".sc").classList.contains("sc-info-on"), h: r.height, above: r.bottom <= keys.top + 1, dots: box.querySelectorAll("path.dot").length, clipped };
        });
        assert.ok(s.on && s.h > 100 && s.above && !s.clipped, `${where}: podatki vidni nad tipkami ${JSON.stringify(s)}`);
        assert.equal(s.dots, 5, `${where}: ničle −360°…360°`);
      } else {
        await page.waitForTimeout(900);
        assert.equal(await page.evaluate(() => document.querySelector(".sc-info").getBoundingClientRect().height), 0, where);
      }
      assert.deepEqual(errors, [], where);
      await ctx.close();
    }
  }
});
