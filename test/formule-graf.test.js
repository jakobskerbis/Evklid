// Formule → graf (faza 2c): formula z izraženo količino dobi gumb »Nariši graf«; grafični kalkulator doda vrstico
// »s(t) = …« in drsnike za ostale količine. formulaPlot (Node) in addFormula v pravem brskalniku (Chromium in
// WebKit, kar je nameščeno; 360 in 1280 px).
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { formulaPlot, formulaToCalc } from "../public/graph/formula-calc.js";
import { buildModel, emptyState } from "../public/graph/model.js";

test("formulaPlot: izražena količina, spremenljivka na osi x, brez grafa za formule brez izražene količine", () => {
  assert.deepEqual(formulaPlot("s = v₀ t + (a t²)/2"), { lhs: "s", rhs: "v₀ t + (a t²)/2", v: "t" });
  assert.equal(formulaPlot("F = (G m₁ m₂)/r²").v, "r");
  assert.equal(formulaPlot("n = m/M").v, "m");
  assert.equal(formulaPlot("1/f = 1/a + 1/b"), null);
  assert.equal(formulaPlot("(p₁ V₁)/T₁ = (p₂ V₂)/T₂"), null);
  assert.equal(formulaPlot("d = 2 π"), null); // brez spremenljivke
  assert.equal(formulaPlot(formulaToCalc("v = v_0 + a t", "FIZ")).v, "t");
  // vrstica grafa iz formule se prebere (zapis 3) in drsniki manjkajo le za ostale količine
  const s = emptyState();
  s.zapis = 3;
  s.vejica = true;
  s.items = [{ id: "a", type: "expr", text: "s(t) = v₀ t + (a t²)/2" }];
  const o = buildModel(s).items[0];
  assert.deepEqual(o.missing.sort(), ["a", "v_0"]);
  assert.ok(fs.readFileSync("public/graph/tools.js", "utf8").includes("formulaPlot(vejica(text))"), "zbirka formul: gumb »Nariši graf«");
});

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}
const PUB = path.resolve("public");
const KX = path.resolve("node_modules/katex/dist");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/graph.css"><script src="/vendor/katex/katex.min.js"></script>
<div id="g" style="height:700px"></div>
<script type="module">
import { createCalculator } from "/graph/calc.js";
localStorage.clear();
localStorage.setItem("t-graph", JSON.stringify({ v: 1, zapis: 3, vejica: true, items: [{ id: "u1", type: "expr", text: "y = 1", color: 0 }, { id: "u2", type: "expr", text: "f(x) = x", color: 1 }], view: { xmin: -10, xmax: 10, ymin: -7, ymax: 7 }, settings: {} }));
window.graph = createCalculator(document.getElementById("g"), { t: (k) => k, icon: () => "", locale: () => "sl", toast() {}, storageKey: () => "t-graph", studentId: () => null });
window.ready = true;
</script>`;
const engines = [];
for (const name of ["chromium", "webkit"]) {
  try {
    if (playwright) engines.push([name, await playwright[name].launch()]);
  } catch {}
}
const skip = engines.length ? false : "Playwright ni nameščen";

test("addFormula: vrstica s(t) = …, drsniki za v₀ in a, obstoječi graf ostane, okno pokaže krivuljo", { skip }, async (t) => {
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
      const ok = await page.evaluate(() => window.graph.addFormula({ lhs: "s", rhs: "v₀ t + (a t²)/2", v: "t" }));
      assert.equal(ok, true, where);
      const s = await page.evaluate(() => JSON.parse(JSON.stringify(window.graph.state)));
      const texts = s.items.map((x) => x.text);
      assert.deepEqual(texts.slice(0, 2), ["y = 1", "f(x) = x"], where);
      assert.ok(texts.includes("s(t) = v₀ t + (a t²)/2"), `${where}: ${texts}`);
      assert.ok(texts.includes("v_0 = 1") && texts.includes("a = 1"), `${where}: ${texts}`);
      assert.equal(await page.locator(".gc-err").count(), 0, where);
      // ime f je zasedeno: druga formula z levo stranjo f dobi g
      await page.evaluate(() => window.graph.addFormula({ lhs: "f", rhs: "1/x", v: "x" }));
      const t2 = await page.evaluate(() => window.graph.state.items.map((x) => x.text));
      assert.ok(t2.includes("g(x) = 1/x"), `${where}: ${t2}`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), where);
      assert.deepEqual(errors, [], where);
      await ctx.close();
    }
  }
});
