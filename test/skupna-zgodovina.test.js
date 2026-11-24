// Skupna zgodovina zavihkov (faza 2e): izid iz PSE ali Orodij se v Znanstvenem pokaže kot čip »Nedavno«, izid
// Znanstvenega pa v meniju »Dodaj« Grafičnega kot drsnik z vrednostjo. Pravi brskalnik (Chromium in WebKit, kar je
// nameščeno), 360 px z dotikom in 1280 px z miško.
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
// isto kot kalkulator-zaslon.js izidi / dodajIzid
const izidi = () => JSON.parse(localStorage.getItem("t-izidi") || "[]");
window.dodaj = (x) => localStorage.setItem("t-izidi", JSON.stringify([x, ...izidi()].slice(0, 12)));
const base = { t: (k) => k, icon: () => "", locale: () => "sl", toast() {} };
const sEl = document.getElementById("s");
const gEl = document.getElementById("g");
window.sci = createScientific(sEl, { ...base, storageKey: () => "t-sci", canSteps: () => false, recent: izidi, addRecent: window.dodaj });
window.graph = createCalculator(gEl, { ...base, storageKey: () => "t-graph", studentId: () => null, recent: izidi });
window.toGraph = () => { sEl.hidden = true; gEl.hidden = false; window.graph.resize(); };
window.ready = true;
</script>`;
const engines = [];
for (const name of ["chromium", "webkit"]) {
  try {
    if (playwright) engines.push([name, await playwright[name].launch()]);
  } catch {}
}
const skip = engines.length ? false : "Playwright ni nameščen";

test("skupna zgodovina: PSE → Znanstveni (čip), Znanstveni → Grafični (drsnik)", { skip }, async (t) => {
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
      // molska masa iz PSE (kot insertIntoCalc): čip »Nedavno« v Znanstvenem
      await page.evaluate(() => (window.dodaj({ text: "18,015", src: "pse" }), window.sci.renderVars()));
      const chip = page.locator(".sc-recent");
      assert.equal(await chip.count(), 1, where);
      assert.match(await chip.getAttribute("aria-label"), /18,015 \(sc\.pseMode\)/, where);
      await tap(".sc-recent");
      assert.equal(await page.inputValue(".sc-input"), "18,015", where);
      await page.press(".sc-input", "Enter");
      // izid Znanstvenega gre v skupno zgodovino; v Znanstvenem se kot čip ne podvoji
      await page.fill(".sc-input", "6·7");
      await page.press(".sc-input", "Enter");
      assert.equal(await chip.count(), 1, where);
      // Grafični: meni »Dodaj« ponudi izid; dotik doda drsnik z vrednostjo
      await page.evaluate(() => window.toGraph());
      await tap('.gc-bar [data-act="add"]');
      const row = page.locator('[data-add="recent"]').first();
      assert.equal(await row.getAttribute("data-v"), "42", where);
      await row.click();
      const texts = await page.evaluate(() => window.graph.state.items.map((x) => x.text));
      assert.ok(texts.includes("a = 42"), `${where}: ${texts}`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), where);
      assert.deepEqual(errors, [], where);
      await ctx.close();
    }
  }
});
