// Skupne vrednosti (faza 2b): grafični kalkulator ponudi spremenljivke in funkcije znanstvenega (»Iz kalkulatorja:
// a = 5, f(x)«), znanstveni pa drsnike in funkcije grafa (»Iz grafa: …«). Nič se ne prenese tiho. Pravi brskalnik
// (Chromium in WebKit, kar je nameščeno), 360 px z dotikom in 1280 px z miško.
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
<div id="s" style="height:700px"></div><div id="g" style="height:700px" hidden></div>
<script type="module">
import { createScientific } from "/graph/sci.js";
import { createCalculator } from "/graph/calc.js";
localStorage.clear();
localStorage.setItem("t-graph", JSON.stringify({ v: 1, zapis: 3, vejica: true, items: [{ id: "u1", type: "expr", text: "k = 3", color: 0 }, { id: "u2", type: "expr", text: "g(x) = x^2 + 1", color: 1 }], view: { xmin: -10, xmax: 10, ymin: -7, ymax: 7 }, settings: {} }));
const base = { t: (k, v) => (v?.names ? k + ":" + v.names : k), icon: () => "", locale: () => "sl", toast() {} };
const sEl = document.getElementById("s");
const gEl = document.getElementById("g");
window.graph = createCalculator(gEl, { ...base, storageKey: () => "t-graph", studentId: () => null, shared: () => JSON.parse(localStorage.getItem("t-sci") || "null") });
window.sci = createScientific(sEl, { ...base, storageKey: () => "t-sci", canSteps: () => false, sharedGraph: () => window.graph.shared() });
window.toGraph = () => { sEl.hidden = true; gEl.hidden = false; window.graph.resize(); };
window.toSci = () => { gEl.hidden = true; sEl.hidden = false; };
window.ready = true;
</script>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/stran.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
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
const VIEWS = [
  ["1280", { viewport: { width: 1280, height: 800 } }],
  ["360", { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true }],
];

test("skupne vrednosti med znanstvenim in grafičnim kalkulatorjem (obe smeri)", { skip }, async (t) => {
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}/stran.html`;
  t.after(async () => {
    for (const [, b] of engines) await b.close();
    server.close();
  });
  for (const [engine, browser] of engines) {
    for (const [vw, opt] of VIEWS) {
      const ctx = await browser.newContext(opt);
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(url);
      await page.waitForFunction(() => window.ready);
      const where = `${engine} ${vw}`;
      const tap = (sel) => (opt.hasTouch && engine !== "webkit" ? page.tap(sel) : page.click(sel));
      const run = async (text) => {
        await page.fill(".sc-input", text);
        await page.press(".sc-input", "Enter");
      };

      // znanstveni → graf: a = 2,5 in f(x) = x² − a
      await run("a = 2,5");
      await run("f(x) = x² − 1");
      await page.evaluate(() => window.toGraph());
      await page.evaluate(() => {
        const g = window.graph;
        const s = JSON.parse(JSON.stringify(g.state));
        s.items.push({ id: "n1", type: "expr", text: "y = f(x) + a·x + b", color: 2 });
        g.loadState(s);
      });
      const chip = page.locator('[data-id="n1"] [data-act="fromsci"]');
      assert.match(await chip.innerText(), /gc\.fromCalc:.*f\(x\).*a = 2,5|gc\.fromCalc:.*a = 2,5.*f\(x\)/, where);
      // b ni v kalkulatorju: ostane drsnik
      assert.match(await page.locator('[data-id="n1"] [data-act="sliders"]').innerText(), /b$/, where);
      await tap('[data-id="n1"] [data-act="fromsci"]');
      let s = await page.evaluate(() => JSON.parse(JSON.stringify(window.graph.state)));
      const texts = s.items.map((x) => x.text);
      assert.ok(texts.includes("a = 2,5") && texts.includes("f(x) = x² − 1"), `${where}: ${texts}`);
      const row = await page.evaluate(() => window.graph.state.items.length);
      assert.ok(row >= 5, where);

      // graf → znanstveni: k (drsnik) in g(x) iz grafa
      await page.evaluate(() => window.toSci());
      await run("g(k) + k");
      await page.waitForSelector(".sc-from-graph");
      assert.match(await page.locator(".sc-from-graph").innerText(), /sc\.fromGraph:.*k = 3/, where);
      await tap(".sc-from-graph");
      const res = await page.locator(".sc-h-row.last .sc-h-res").innerText();
      assert.match(res, /13/, `${where}: ${res}`);
      // kotne funkcije pri različni enoti kota (kalkulator DEG, graf RAD; pregled #1002): ne ponudimo, pomen bi se spremenil
      await run("h(x) = sin(x)");
      await page.evaluate(() => window.toGraph());
      await page.evaluate(() => {
        const g = window.graph;
        const s = JSON.parse(JSON.stringify(g.state));
        s.items.push({ id: "n2", type: "expr", text: "y = h(x)", color: 3 }, { id: "n3", type: "expr", text: "w(x) = cos(x)", color: 4 });
        g.loadState(s);
      });
      assert.equal(await page.locator('[data-id="n2"] [data-act="fromsci"]').count(), 0, where);
      await page.evaluate(() => window.toSci());
      await run("w(0) + w(π)");
      assert.equal(await page.locator(".sc-from-graph").count(), 0, where);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), where);
      assert.deepEqual(errors, [], where);
      await ctx.close();
    }
  }
});
