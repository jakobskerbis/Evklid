// AUDIT-003: dotik ali klik na spodnjo/zgornjo mejo določenega integrala (in na reže limite) ureja to režo,
// ne integranda (prej »∫(0x;;2)«). Pravi brskalnik (Playwright: Chromium, WebKit in Firefox, kar je nameščeno; CI ima Chromium in WebKit),
// 1280 px z miško in 360 px z dotikom.
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
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/graph.css"><script src="/vendor/katex/katex.min.js"></script><div id="s" style="height:700px"></div>
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
for (const name of ["chromium", "webkit", "firefox"]) {
  try {
    if (playwright) engines.push([name, await playwright[name].launch()]);
  } catch {}
}
const skip = engines.length ? false : "Playwright ni nameščen";

const VIEWS = [
  ["1280", { viewport: { width: 1280, height: 800 } }],
  ["360", { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true }],
];

test("klik/dotik na meje integrala in reže limite ureja pravo režo (AUDIT-003)", { skip }, async (t) => {
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}/t-sci.html`;
  t.after(async () => {
    for (const [, b] of engines) await b.close();
    server.close();
  });
  for (const [engine, browser] of engines) {
    for (const [vw, opt] of VIEWS) {
      // Firefox ne pozna isMobile (dotik pa ja)
      const ctx = await browser.newContext(engine === "firefox" ? { ...opt, isMobile: undefined } : opt);
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(url);
      await page.waitForFunction(() => window.ready);
      const where = `${engine} ${vw}`;
      // WebKit v Playwrightu po preventDefault na pointerdown ob dotiku ne pošlje klika (pravi iOS ga): tam klik
      const key = (ins) => (opt.hasTouch && engine !== "webkit" ? page.tap(`.sc-key[data-ins="${ins}"]`) : page.click(`.sc-key[data-ins="${ins}"]`));
      const at = async (x, y) => {
        if (opt.hasTouch) await page.touchscreen.tap(x, y);
        else await page.mouse.click(x, y);
        await page.waitForTimeout(30);
      };
      // središče n-tega okvirčka □ v zapisu (vrstni red v zapisu: spodnja meja, zgornja meja, integrand)
      const hole = async (n) => {
        const b = await page.evaluate((n) => {
          const r = [...document.querySelectorAll(".sc-preview .sc-hole")][n]?.getBoundingClientRect();
          return r && { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }, n);
        assert.ok(b, `${where}: okvirček ${n}`);
        await at(b.x, b.y);
      };
      const value = () => page.inputValue(".sc-input");
      const reset = async (ins) => {
        await page.evaluate((ins) => {
          const i = document.querySelector(".sc-input");
          i.value = "";
          window.sci.insert(ins);
        }, ins);
      };

      // vrstni red iz prijave: integrand, zgornja meja, spodnja meja
      await reset("∫(@;;)");
      await key("x");
      await hole(1);
      await key("2");
      await hole(0);
      await key("0");
      assert.equal(await value(), "∫(x;0;2)", `${where}: integrand, zgornja, spodnja`);

      // obratni vrstni red: spodnja, zgornja, nato integrand (vedno prvi prazni okvirček)
      await reset("∫(@;;)");
      await hole(0);
      await key("1");
      await hole(0); // spodnja je izpolnjena: prvi okvirček je zdaj zgornja meja
      await key("3");
      await hole(0);
      await key("x");
      assert.equal(await value(), "∫(x;1;3)", `${where}: spodnja, zgornja, integrand`);

      // sprememba samo ene meje: dotik na številko v spodnji meji, nato pisanje ostane v spodnji meji
      const zero = await page.evaluate(() => {
        const sub = [...document.querySelectorAll(".sc-preview .msupsub .vlist-t .mord")].find((e) => e.textContent === "1");
        const r = sub?.getBoundingClientRect();
        return r && { x: r.right - 0.5, y: r.top + r.height / 2 };
      });
      assert.ok(zero, `${where}: spodnja meja 1 v zapisu`);
      await at(zero.x, zero.y);
      await key("5");
      assert.equal(await value(), "∫(x;15;3)", `${where}: spodnja meja se spremeni, drugi reži ostaneta`);

      // limita: okvirček pod lim je točka a, telo je zadnji okvirček
      await reset("limita(@; x; )");
      await hole(0);
      await key("0");
      await hole(0);
      await key("x");
      const v = await value();
      assert.match(v, /^limita\(x; x; 0\)$/, `${where}: limita ${v}`);
      // dvojni klik (miška) na zapis ne izbere skritega »∫« ali »sin«: naslednja tipka ne pokvari predloge
      if (!opt.hasTouch) {
        for (const tx of ["∫(x²+1;0;2)", "sin(30)+cos(60)"]) {
          await reset(tx);
          const r = await page.evaluate(() => {
            const k = document.querySelector(".sc-preview .katex").getBoundingClientRect();
            return { x: k.left + k.width * 0.6, y: k.top + k.height / 2 };
          });
          await page.mouse.dblclick(r.x, r.y);
          await page.waitForTimeout(50);
          const sel = await page.evaluate(() => [document.querySelector(".sc-input").selectionStart, document.querySelector(".sc-input").selectionEnd]);
          assert.equal(sel[0], sel[1], `${where}: dvojni klik na ${tx} ne izbere besedila`);
        }
      }
      assert.deepEqual(errors, [], `${where}: napake na strani`);
      await ctx.close();
    }
  }
});
