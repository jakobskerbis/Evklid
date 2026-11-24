// »Uporabi v računu« (graf → znanstveni kalkulator) v pravem brskalniku (Chromium in WebKit, kar je nameščeno),
// 360 px z dotikom in 1280 px z miško: označena točka na krivulji da gumba x = … in y = …, ploščina pod krivuljo
// vpiše ∫(f; a; b); znanstveni kalkulator iz tega izračuna isto vrednost.
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
<div id="g" style="height:700px"></div><div id="s" style="height:700px" hidden></div>
<script type="module">
import { createScientific } from "/graph/sci.js";
import { createCalculator } from "/graph/calc.js";
localStorage.clear();
localStorage.setItem("t-graph", JSON.stringify({ v: 1, zapis: 3, vejica: true, items: [{ id: "u1", type: "expr", text: "f(x) = x^2 - 1", color: 0, tools: { area: [0, 2] } }], view: { xmin: -4, xmax: 4, ymin: -3, ymax: 5 }, settings: { square: false } }));
const base = { t: (k, v) => (v?.v ? k + ":" + v.v : k), icon: () => "", locale: () => "sl", toast() {} };
const sEl = document.getElementById("s");
const gEl = document.getElementById("g");
window.sci = createScientific(sEl, { ...base, storageKey: () => "t-sci", canSteps: () => false });
window.graph = createCalculator(gEl, { ...base, storageKey: () => "t-graph", studentId: () => null,
  useInCalc: (text) => { gEl.hidden = true; sEl.hidden = false; window.sci.insert(text); window.used = text; } });
window.back = () => { sEl.hidden = true; gEl.hidden = false; window.graph.resize(); };
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

test("graf → znanstveni kalkulator: točka na krivulji (x, y) in ploščina ∫(f; a; b)", { skip }, async (t) => {
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

      // ploščina: vrstica ima gumb, v kalkulator gre ∫(x^2 - 1; 0; 2) in izračun da 2/3
      await tap('[data-act="use-area"]');
      assert.equal(await page.evaluate(() => window.used), "∫(x^2 - 1; 0; 2)", where);
      await page.press(".sc-input", "Enter");
      const res = await page.locator(".sc-h-row.last .sc-h-res").innerText();
      assert.match(res.replace(/\s/g, ""), /2.*3/, `${where}: ${res}`);

      // točka na krivulji: dotik krivulje pri x = 1,5 → gumba x in y
      await page.evaluate(() => window.back());
      const pt = await page.evaluate(() => {
        const v = window.graph.view;
        const r = v.canvas.getBoundingClientRect();
        return [r.left + v.X(1.5), r.top + v.Y(1.25)];
      });
      if (opt.hasTouch) await page.touchscreen.tap(pt[0], pt[1]);
      else await page.mouse.click(pt[0], pt[1]);
      await page.waitForSelector(".gc-use:not([hidden])");
      const btns = page.locator(".gc-use [data-use]");
      assert.equal(await btns.count(), 2, where);
      const label = await btns.nth(1).getAttribute("aria-label");
      assert.match(label, /^gc\.useValue:y = /, where);
      const y = await btns.nth(1).getAttribute("data-use");
      const x = await btns.nth(0).getAttribute("data-use");
      // vrednost je na krivulji (y = x² − 1), v zapisu z vejico
      const num = (s) => Number(s.replace(",", "."));
      assert.ok(Math.abs(num(y) - (num(x) ** 2 - 1)) < 1e-6, `${where}: ${x}, ${y}`);
      await tap(".gc-use [data-use]:nth-child(2)");
      assert.equal(await page.evaluate(() => window.used), y, where);
      // dotik praznega dela skrije gumba
      await page.evaluate(() => window.back());
      const empty = await page.evaluate(() => {
        const v = window.graph.view;
        const r = v.canvas.getBoundingClientRect();
        return [r.left + v.X(-3), r.top + v.Y(4)];
      });
      if (opt.hasTouch) await page.touchscreen.tap(empty[0], empty[1]);
      else await page.mouse.click(empty[0], empty[1]);
      assert.equal(await page.locator(".gc-use").isHidden(), true, where);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), where);
      assert.deepEqual(errors, [], where);
      await ctx.close();
    }
  }
});
