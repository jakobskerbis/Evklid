// Znanstveni → Orodja (faza 2d): v fiziki in kemiji ima izid gumb »Pretvori enote«, ki odpre pretvornik enot z
// vpisano vrednostjo; »V kalkulator« vrne pretvorjeno vrednost (in jo kalkulator lahko shrani kot spremenljivko).
// Pravi brskalnik (Chromium in WebKit, kar je nameščeno), 360 px z dotikom in 1280 px z miško.
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
<div id="s" style="height:700px"></div><div id="o" style="height:700px" hidden></div>
<script type="module">
import { createScientific } from "/graph/sci.js";
import { createTools } from "/graph/tools.js";
localStorage.clear();
const base = { t: (k) => k, icon: () => "", locale: () => "sl", toast() {} };
const sEl = document.getElementById("s");
const oEl = document.getElementById("o");
window.toSci = () => { oEl.hidden = true; sEl.hidden = false; };
window.tools = createTools(oEl, { ...base, subject: () => "FIZ", onInsert: (x) => { window.toSci(); window.sci.insert(x); } });
window.sci = createScientific(sEl, { ...base, storageKey: () => "t-sci", canSteps: () => false, chapter: () => window.chapter || null,
  convert: (v) => { sEl.hidden = true; oEl.hidden = false; window.tools.units(v); } });
window.ready = true;
</script>`;
const engines = [];
for (const name of ["chromium", "webkit"]) {
  try {
    if (playwright) engines.push([name, await playwright[name].launch()]);
  } catch {}
}
const skip = engines.length ? false : "Playwright ni nameščen";

test("Pretvori enote: izid fizike v pretvornik in nazaj v kalkulator", { skip }, async (t) => {
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
      // matematika: brez gumba
      await page.fill(".sc-input", "12,5·4");
      await page.press(".sc-input", "Enter");
      assert.equal(await page.locator('[data-act="convert"]').count(), 0, where);
      // fizika: gumb, vrednost v pretvorniku
      await page.evaluate(() => {
        window.chapter = { id: "FIZ-SS-1/gibanje", subject: "FIZ", name: "Gibanje" };
        window.sci.adapt?.();
      });
      await page.fill(".sc-input", "12,5·4");
      await page.press(".sc-input", "Enter");
      await tap('.sc-h-row.last [data-act="convert"]');
      assert.equal(await page.inputValue(".un-val"), "50", where);
      assert.ok(await page.isVisible(".un-result"), where);
      const res = await page.locator(".un-result").innerText();
      assert.ok(res.trim() && res.trim() !== "—", `${where}: ${res}`);
      // nazaj v kalkulator: pretvorjena vrednost v vnos
      await tap(".un-ins");
      const val = await page.inputValue(".sc-input");
      assert.ok(/^[\d,]+(E-?\d+)?$/.test(val) && val !== "", `${where}: ${val}`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), where);
      assert.deepEqual(errors, [], where);
      await ctx.close();
    }
  }
});
