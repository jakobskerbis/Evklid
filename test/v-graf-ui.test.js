// »Pokaži na grafu« v pravem brskalniku (Playwright: Chromium in WebKit, kar je nameščeno), 360 px z dotikom in
// 1280 px z miško: gumb v znanstvenem kalkulatorju preklopi na grafični kalkulator, doda vrstice z orodji
// (ploščina, f′, tangenta, točke rešitev) k obstoječemu grafu, zgodovina znanstvenega kalkulatorja ostane.
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
localStorage.setItem("t-graph", JSON.stringify({ v: 1, zapis: 3, vejica: true, items: [{ id: "u1", type: "expr", text: "y = 1", color: 0 }], view: { xmin: -10, xmax: 10, ymin: -7, ymax: 7 }, settings: {} }));
const base = { t: (k) => k, icon: () => "", locale: () => "sl", toast: (m) => (window.toasts ||= []).push(m) };
const sEl = document.getElementById("s");
const gEl = document.getElementById("g");
window.graph = createCalculator(gEl, { ...base, storageKey: () => "t-graph", studentId: () => null });
window.sci = createScientific(sEl, { ...base, storageKey: () => "t-sci", canSteps: () => false,
  showOnGraph: async (req) => { sEl.hidden = true; gEl.hidden = false; window.graph.resize(); window.shown = await window.graph.showPlan(req); },
  stage: () => window.stage || null });
window.back = () => { gEl.hidden = true; sEl.hidden = false; };
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
const VIEWS = [
  ["1280", { viewport: { width: 1280, height: 800 } }],
  ["360", { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true }],
];

test("»Pokaži na grafu«: integral, odvod, enačba in divergenten integral v grafičnem kalkulatorju", { skip }, async (t) => {
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}/t.html`;
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
      // Počakamo na NOVO vrstico zgodovine (prej je ».last« takoj našel prejšnjo vrstico, dotik je šel na gumb, ki ga je
      // izris zgodovine nato zamenjal, in waitForFunction je v CI enkrat čakal 30 s; pregled #997).
      const run = async (text) => {
        await page.evaluate(() => window.back());
        const n = await page.locator(".sc-h-row").count();
        await page.fill(".sc-input", text);
        await page.press(".sc-input", "Enter");
        await page.waitForFunction((n) => document.querySelectorAll(".sc-h-row").length > n, n);
      };
      const show = async (sel = '.sc-h-row.last [data-act="graf"]') => {
        await page.evaluate(() => (window.shown = undefined));
        await page.locator(sel).waitFor({ state: "visible" });
        await tap(sel);
        await page.waitForFunction(() => window.shown !== undefined, null, { timeout: 60000 });
        return page.evaluate(() => JSON.parse(JSON.stringify(window.graph.state)));
      };

      // določeni integral: f z orodjem ploščine, obstoječi graf ostane
      await run("∫(x²;0;1)");
      const btn = page.locator('.sc-h-row.last [data-act="graf"]');
      assert.equal(await btn.count(), 1, where);
      assert.equal(await btn.getAttribute("aria-label"), null, where); // besedilo je v gumbu
      assert.match(await btn.innerText(), /sc\.showOnGraph/, where);
      let s = await show();
      assert.equal(s.items[0].text, "y = 1", `${where}: obstoječi graf ostane`);
      const f = s.items.find((x) => x.tools?.area);
      assert.ok(f, where);
      assert.deepEqual(f.tools.area, [0, 1], where);
      assert.equal(f.text, "f(x) = x^2", where);
      assert.ok(s.view.xmin < 0 && s.view.xmax > 1 && s.view.xmax < 4, `${where} ${JSON.stringify(s.view)}`);
      assert.ok(await page.isVisible("#g .gc-graph canvas"), where);

      // nazaj: zgodovina znanstvenega kalkulatorja je cela; starejša vrstica ima gumb z ikono (tipkovnica)
      await run("d/dx(x³; 2)");
      s = await show();
      assert.deepEqual(s.items.at(-1).tools, { tangent: 2 }, where);
      await page.evaluate(() => window.back());
      assert.equal(await page.locator(".sc-h-row").count(), 2, where);
      const old = page.locator('.sc-h-row:not(.last) .sc-h-graf');
      assert.equal(await old.getAttribute("aria-label"), "sc.showOnGraph", where);
      if (!opt.hasTouch) {
        await old.focus();
        await page.evaluate(() => (window.shown = undefined));
        await page.keyboard.press("Enter");
        await page.waitForFunction(() => window.shown !== undefined);
        s = await page.evaluate(() => JSON.parse(JSON.stringify(window.graph.state)));
        assert.equal(s.items.filter((x) => x.tools?.area).length, 2, `${where}: tipka Enter na gumbu`);
      }

      // enačba: obe strani in točki rešitev
      await run("x²−5x+6=0");
      s = await show();
      assert.equal(s.items.at(-1).text, "[(2; 0); (3; 0)]", where);

      // divergenten integral: brez osenčene vrednosti, sporočilo kalkulatorja kot opomba
      await page.evaluate(() => window.back());
      await page.fill(".sc-input", "∫(1/x;0;1)");
      await page.press(".sc-input", "Enter");
      await page.waitForSelector(".sc-live.sc-err .sc-h-graf");
      const msg = await page.locator(".sc-live.sc-err span").first().innerText();
      s = await show(".sc-live.sc-err .sc-h-graf");
      const last = s.items.at(-1);
      assert.match(last.text, /^(?:[a-z]\(x\)|y) = 1\/x$/, where);
      assert.equal(last.tools, undefined, where);
      assert.ok(s.items.some((x) => x.type === "note" && x.text.startsWith(msg)), `${where}: opomba ${msg}`);

      // sprememba nastavitve grafa (DEG) dobi kratko opombo
      await run("sin(x)=0,5");
      s = await show();
      assert.equal(s.settings.deg, true, where);
      assert.ok(s.items.some((x) => x.type === "note" && x.text.includes("gc.fromSci.setDeg")), where);

      // osnovna šola: integral brez gumba, enačba z njim
      await page.evaluate(() => (window.stage = "OS"));
      await run("∫(x;0;2)");
      assert.equal(await page.locator('.sc-h-row.last [data-act="graf"]').count(), 0, where);
      await run("2x+3=7");
      assert.equal(await page.locator('.sc-h-row.last [data-act="graf"]').count(), 1, where);
      await page.evaluate(() => (window.stage = null));

      // brez vodoravnega drsenja
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), where);
      assert.deepEqual(errors, [], where);
      await ctx.close();
    }
  }
});
