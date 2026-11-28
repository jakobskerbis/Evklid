// Znanstveni kalkulator na telefonu ležeče (pregled 28. 11. 2026, P1): tipke so bile v stolpcu višje od zaslona,
// »Izračunaj«, 0 in vejica so padli pod spodnji rob (pri 740 × 360 se je »=« začel pri ~394 px). Ležeče in nizko
// (graph.css, @media landscape, max-height 480 px) so funkcijske tipke in številke druga ob drugi, vrstica in zapis
// v eni vrsti, zgodovina zgoraj. Preizkus z dotikom: 7 + 8, zasuk, »Izračunaj« → izid 15 je viden.
// Pokončni telefon in iPad ostaneta kot prej (kalkulator-ipad.test.js pokrije tablico in računalnik).
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
// glava 62 px kot vrstica zavihkov kalkulatorja v aplikaciji (Znanstveni, Grafični …)
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/graph.css"><link rel="stylesheet" href="/okna.css"><script src="/vendor/katex/katex.min.js"></script>
<style>body { margin: 0; } #ovoj { height: 100vh; display: flex; flex-direction: column; } #glava { height: 62px; flex: none; }</style>
<div id="ovoj"><div id="glava"></div><div id="s"></div></div>
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

// [ime, začetna velikost, velikost ob »Izračunaj« (zasuk) ali null, pričakovana postavitev]
const CASES = [
  ["zasuk 360×740 → 740×360", [360, 740], [740, 360], "lezece"],
  ["zasuk 390×844 → 844×390", [390, 844], [844, 390], "lezece"],
  ["ležeče 740×360", [740, 360], null, "lezece"],
  ["ležeče 844×390", [844, 390], null, "lezece"],
  ["ležeče 915×412 (Android)", [915, 412], null, "lezece"],
  ["ležeče 932×430 (iPhone Pro Max)", [932, 430], null, "lezece"],
  ["ležeče 667×375 (iPhone SE)", [667, 375], null, "lezece"],
  ["ležeče 568×320 (najnižji)", [568, 320], null, "lezece"],
  ["pokončno 360×740", [360, 740], null, "pokoncno"],
  ["iPad 820×1180", [820, 1180], null, "pokoncno"],
  ["iPad 1180×820", [1180, 820], null, "C"],
];

const keyBox = (page, ins) =>
  page.evaluate((ins) => {
    const e = document.querySelector(`.sc-key[data-ins="${ins}"]`);
    const b = e.getBoundingClientRect();
    const x = b.left + b.width / 2;
    const y = b.top + b.height / 2;
    const hit = document.elementFromPoint(x, y);
    return { x, y, top: b.top, bottom: b.bottom, h: b.height, hit: !!hit?.closest(`.sc-key[data-ins="${ins}"]`) };
  }, ins);

async function tap(page, ins, where) {
  const k = await keyBox(page, ins);
  assert.ok(k.hit && k.bottom <= page.viewportSize().height + 0.5, `${where}: tipka ${ins} je na zaslonu in jo dotik zadene (${JSON.stringify(k)})`);
  await page.touchscreen.tap(k.x, k.y);
  await page.waitForTimeout(60);
  return k;
}

test("znanstveni kalkulator: telefon ležeče, »Izračunaj« na zaslonu (dotik)", { skip }, async (t) => {
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}/t-sci.html`;
  t.after(async () => {
    for (const [, b] of engines) await b.close();
    server.close();
  });
  for (const [engine, browser] of engines) {
    for (const [name, start, end, want] of CASES) {
      const where = `${engine} ${name}`;
      const ctx = await browser.newContext({ viewport: { width: start[0], height: start[1] }, hasTouch: true, isMobile: engine === "chromium" });
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(url);
      await page.waitForFunction(() => window.ready);
      for (const ins of ["7", "+", "8"]) await tap(page, ins, where);
      if (end) {
        await page.setViewportSize({ width: end[0], height: end[1] });
        await page.waitForTimeout(250);
      }
      const vh = page.viewportSize().height;
      const m = await page.evaluate(() => {
        const r = (q) => document.querySelector(q).getBoundingClientRect().toJSON();
        const keys = [...document.querySelectorAll(".sc-keys .sc-key")].map((e) => e.getBoundingClientRect());
        const entry = document.querySelector(".sc-entry");
        const e = entry.getBoundingClientRect();
        const top = document.elementFromPoint(e.left + e.width / 2, e.top + e.height / 2);
        return {
          input: document.querySelector(".sc-input").value,
          live: document.querySelector(".sc-live").textContent,
          entryVisible: e.height > 0 && e.bottom <= innerHeight + 0.5 && !!top && entry.contains(top),
          fn: r(".sc-fn"),
          num: r(".sc-num"),
          keyMin: Math.min(...keys.map((b) => b.height)),
          keyBottom: Math.max(...keys.map((b) => b.bottom)),
          hscroll: document.documentElement.scrollWidth > innerWidth,
          vscroll: document.documentElement.scrollHeight > innerHeight,
        };
      });
      // vnos se ob zasuku ohrani; med vnosom sta zapis in sproten izid vidna
      assert.equal(m.input, "7+8", `${where}: vnos`);
      assert.ok(m.entryVisible, `${where}: zapis je viden med vnosom`);
      assert.match(m.live, /15/, `${where}: sproten izid`);
      assert.ok(m.keyBottom <= vh + 0.5, `${where}: vse tipke so na zaslonu (${m.keyBottom} > ${vh})`);
      assert.equal(m.hscroll, false, `${where}: brez vodoravnega drsenja`);
      assert.equal(m.vscroll, false, `${where}: stran ne drsi navpično`);
      if (want === "lezece") {
        assert.ok(m.fn.right <= m.num.left + 0.5 && Math.abs(m.fn.top - m.num.top) < 1, `${where}: funkcije in številke druga ob drugi`);
        assert.ok(m.keyMin >= (vh <= 340 ? 34 : 40), `${where}: tipke dovolj velike za prst (${m.keyMin})`);
      } else if (want === "pokoncno") {
        assert.ok(m.fn.bottom <= m.num.top + 0.5, `${where}: pokončno funkcije nad številkami (kot prej)`);
      }
      // spodnja vrstica (0, vejica, Ans, =) dosegljiva
      for (const ins of ["0", "#dec", "Ans"]) {
        const k = await keyBox(page, ins);
        assert.ok(k.hit && k.bottom <= vh + 0.5, `${where}: tipka ${ins} dosegljiva (${JSON.stringify(k)})`);
      }
      const eq = await tap(page, "#eq", where);
      await page.waitForTimeout(150);
      const res = await page.evaluate(() => {
        const row = document.querySelector(".sc-history .sc-h-row.last .sc-h-res");
        if (!row) return null;
        const b = row.getBoundingClientRect();
        const hist = document.querySelector(".sc-history").getBoundingClientRect();
        const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        return { b: [Math.round(b.top), Math.round(b.bottom)], hist: [Math.round(hist.top), Math.round(hist.bottom)], text: row.textContent, visible: b.height > 0 && b.top >= hist.top - 0.5 && b.bottom <= hist.bottom + 0.5 && b.bottom <= innerHeight && !!hit && row.contains(hit) };
      });
      assert.ok(res && /15/.test(res.text), `${where}: izid 15 po dotiku »Izračunaj« (tipka y=${Math.round(eq.top)}, ${JSON.stringify(res)})`);
      assert.ok(res.visible, `${where}: izid 15 je viden (${JSON.stringify(res)})`);
      assert.deepEqual(errors, [], where);
      await ctx.close();
    }
  }
});
