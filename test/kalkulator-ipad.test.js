// Postavitev znanstvenega kalkulatorja na tablici in računalniku (j, 27. 11., izbira C): ležeče zgodovina v levem
// stolpcu, desno vrstica, velik zaslon in tik pod njim tipkovnica, ki zapolni višino; pokončno nad 860 px tipkovnica
// spodaj čez vso širino (kot telefon); visok zapis se pomanjša (zaslon ne drsi); nižji (pod 600 px) in ožji kalkulator (tudi v plavajočem oknu) ostane pri prejšnji postavitvi.
// Merilo je velikost kalkulatorja (sci.js, razreda sc-c in sc-tall), ne zaslona.
// Pravi brskalnik (Playwright: Chromium in WebKit, kar je nameščeno).
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
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/graph.css"><link rel="stylesheet" href="/okna.css"><script src="/vendor/katex/katex.min.js"></script>
<style>body { margin: 0; } #ovoj { height: 100vh; display: flex; flex-direction: column; } #ovoj.ozko { container: okno / inline-size; width: 700px; } #ovoj.nizko { container: okno / inline-size; width: 1000px; height: 500px; }</style>
<div id="ovoj"><div id="s"></div></div>
<script type="module">
import { createScientific } from "/graph/sci.js";
localStorage.clear();
window.sci = createScientific(document.getElementById("s"), { t: (k) => k, icon: () => "", locale: () => "sl", storageKey: () => "t-sci", toast() {}, canSteps: () => false });
window.ready = true;
</script>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/t-sci.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
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

const touch = { hasTouch: true, isMobile: true };
const VIEWS = [
  ["iPad 13 ležeče", { viewport: { width: 1366, height: 1024 }, ...touch }, "C"],
  ["iPad 11 ležeče", { viewport: { width: 1194, height: 834 }, ...touch }, "C"],
  ["iPad mini ležeče", { viewport: { width: 1133, height: 744 }, ...touch }, "C"],
  ["prenosnik 1280×720", { viewport: { width: 1280, height: 720 } }, "C"],
  ["nizek prenosnik 1366×620", { viewport: { width: 1366, height: 620 } }, "C"],
  ["pod mejo 1366×590", { viewport: { width: 1366, height: 590 } }, "stolpca"],
  ["računalnik", { viewport: { width: 1920, height: 1080 } }, "C"],
  ["iPad 13 pokončno", { viewport: { width: 1024, height: 1366 }, ...touch }, "pokončno"],
  ["iPad 11 pokončno", { viewport: { width: 834, height: 1194 }, ...touch }, "pokončno"],
  ["nizko okno", { viewport: { width: 1366, height: 500 } }, "stolpca"],
  ["ožje plavajoče okno", { viewport: { width: 1366, height: 1024 }, ...touch }, "pokončno", "ozko"],
  ["široko, nizko plavajoče okno", { viewport: { width: 1920, height: 1080 } }, "stolpca", "nizko"],
];

test("znanstveni kalkulator: postavitev na tablici in računalniku (izbira C)", { skip }, async (t) => {
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}/t-sci.html`;
  t.after(async () => {
    for (const [, b] of engines) await b.close();
    server.close();
  });
  for (const [engine, browser] of engines) {
    for (const [name, opt, want, okno] of VIEWS) {
      const ctx = await browser.newContext(opt);
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(url);
      await page.waitForFunction(() => window.ready);
      if (okno) {
        await page.evaluate((c) => document.getElementById("ovoj").classList.add(c), okno);
        await page.waitForTimeout(100);
      }
      const m = await page.evaluate(() => {
        const r = (q) => document.querySelector(q).getBoundingClientRect().toJSON();
        const keys = [...document.querySelectorAll(".sc-keys .sc-key")].map((e) => e.getBoundingClientRect());
        return {
          w: document.getElementById("ovoj").getBoundingClientRect().width,
          vh: document.getElementById("ovoj").getBoundingClientRect().bottom,
          eq: parseFloat(getComputedStyle(document.querySelector('.sc-key[data-ins="#eq"]')).fontSize),
          digit: parseFloat(getComputedStyle(document.querySelector('.sc-key[data-ins="7"]')).fontSize),
          hist: r(".sc-history"),
          bar: r(".sc-bar"),
          entry: r(".sc-entry"),
          keys: r(".sc-keys"),
          keyMin: Math.min(...keys.map((b) => b.height)),
          keyBottom: Math.max(...keys.map((b) => b.bottom)),
          title: getComputedStyle(document.querySelector(".sc-history"), "::before").content,
          hscroll: document.documentElement.scrollWidth > innerWidth,
        };
      });
      const where = `${engine} ${name}`;
      assert.ok(m.keyBottom <= m.vh + 0.5, `${where}: tipke so na zaslonu (${m.keyBottom} > ${m.vh})`);
      assert.equal(m.hscroll, false, where);
      assert.ok(m.eq >= m.digit, `${where}: »=« ni manjši od števk (${m.eq} < ${m.digit})`);
      // prejšnja postavitev: velikosti kot pred spremembo (nič ne uide iz nove postavitve)
      if (want === "stolpca" || okno) assert.equal(m.eq, 22.4, `${where}: »=« 1,4rem`);
      if (want === "C") {
        assert.ok(m.hist.right <= m.keys.left + 0.5 && m.hist.left < 1, `${where}: zgodovina levo`);
        assert.ok(m.hist.height >= m.vh - 1, `${where}: zgodovina čez vso višino`);
        assert.ok(Math.abs(m.bar.left - m.keys.left) < 1 && Math.abs(m.entry.left - m.keys.left) < 1, `${where}: vrstica, zaslon in tipke v istem stolpcu`);
        assert.ok(m.bar.bottom <= m.entry.top + 1 && Math.abs(m.entry.bottom - m.keys.top) < 1.5, `${where}: zaslon tik nad tipkovnico`);
        assert.ok(m.keys.bottom >= m.vh - 1, `${where}: tipkovnica sega do spodnjega roba`);
        assert.ok(m.entry.height >= 84, `${where}: zaslon je velik (${m.entry.height})`);
        assert.ok(m.keyMin >= 40, `${where}: tipke niso premajhne za prst (${m.keyMin})`);
        assert.ok(m.keys.width >= Math.min(m.w * 0.55, 860), `${where}: tipkovnica je široka (${m.keys.width})`);
        assert.match(m.title, /sc\.history/, `${where}: naslov stolpca iz prevedene oznake`);
      } else if (want === "pokončno") {
        assert.ok(m.keys.width >= m.w - 1 && m.keys.left < 1, `${where}: tipkovnica čez vso širino`);
        assert.ok(m.keys.top >= m.entry.bottom - 1 && m.entry.top >= m.hist.bottom - 1, `${where}: zgodovina, zaslon, tipke od zgoraj navzdol`);
        assert.ok(m.keyMin >= 36, `${where}: tipke (${m.keyMin})`);
        assert.equal(m.title, "none", `${where}: brez naslova stolpca`);
      } else {
        assert.ok(m.keys.left >= m.hist.right - 1 && m.keys.top < m.vh / 2, `${where}: tipkovnica desno ob zgodovini (prej)`);
      }
      // visok zapis (sistem enačb) ostane cel v zaslonu, ne čez vrstico nad njim; tipke ostanejo na zaslonu
      const tall = await page.evaluate(async () => {
        const i = document.querySelector(".sc-input");
        i.focus();
        i.value = "a+b+c+d=4; a−b=0; c−d=0; a+c=2";
        i.dispatchEvent(new Event("input", { bubbles: true }));
        await new Promise((r) => setTimeout(r, 300));
        const e = document.querySelector(".sc-entry").getBoundingClientRect();
        const p = document.querySelector(".sc-preview").getBoundingClientRect();
        const k = Math.max(...[...document.querySelectorAll(".sc-keys .sc-key")].map((b) => b.getBoundingClientRect().bottom));
        const el = document.querySelector(".sc-entry");
        const keys = [...document.querySelectorAll(".sc-keys .sc-key")].map((b) => b.getBoundingClientRect());
        const c = document.querySelector(".sc-preview .sc-caret")?.getBoundingClientRect();
        const l = document.querySelector(".sc-live").getBoundingClientRect();
        // dotik zadnje vrstice zapisa zadene (nevidni) vnos, ne KaTeX
        const hit = document.elementFromPoint(p.left + p.width / 2, p.bottom - 4);
        return {
          e: e.top, p: p.top, pb: p.bottom, eb: e.bottom, k, h: p.height, over: el.scrollHeight - el.clientHeight, scroll: el.scrollTop,
          caret: c ? c.top >= e.top - 0.5 && c.bottom <= e.bottom + 0.5 : false,
          live: l.height > 0 && l.bottom <= e.bottom + 0.5,
          keysTop: Math.min(...keys.map((b) => b.top)), keyMin: Math.min(...keys.map((b) => b.height)),
          hit: hit?.classList.contains("sc-input") || false,
          focus: getComputedStyle(el).boxShadow.includes("3px"),
        };
      });
      if (want === "C") {
        const at = `${where}: sistem enačb ${JSON.stringify(tall)}`;
        // zapis se pomanjša, zaslon ne drsi: kazalka, sproten izid in dotik delujejo, tipke so cele in pod zaslonom
        assert.ok(tall.h > 40 && tall.p >= tall.e - 0.5 && tall.pb <= tall.eb + 0.5, at);
        assert.ok(tall.over <= 1 && tall.scroll === 0, at);
        assert.ok(tall.caret && tall.live && tall.hit && tall.focus, at);
        assert.ok(tall.keysTop >= tall.eb - 0.5 && tall.keyMin >= 40, at);
      }
      if (want !== "stolpca") assert.ok(tall.k <= m.vh + 0.5, `${where}: tipke na zaslonu ob visokem zapisu`);
      assert.deepEqual(errors, [], where);
      await ctx.close();
    }
  }
});
