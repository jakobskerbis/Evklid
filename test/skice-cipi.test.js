// Čipi skic v listu formul na telefonu (j, 12. 11. 2026: »formule naj bodo v eni vrsti, kjer je mogoče, in x₁,₂
// naj se ne pomika«). Čip je vrstica flex (pika, formula, vrednost); sirina.js je formulo v njem meril po širini
// čipa samega, zato je bila vsaka »preširoka« in zložena v stolpec (b / = −2ap), x₁,₂ pa obrezan in drsen.
// Drsniki skic se premikajo po 1/10000 in kažejo ter računajo stotinke. Chromium in WebKit, kolikor ju Playwright ima.
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
const NM = path.resolve("node_modules");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html" };

// Kartica formul kot v kalkulatorju (graph/tools.js): .fm-item.has-skica > .fm-skica; zraven še formula v vrstici
// flex brez prelamljanja (ime levo, formula desno), ki gre v preostanek vrstice.
const PAGE = `<!doctype html><html lang="sl"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/graph.css">
<div class="fm"><div class="fm-wrap"><div class="fm-body"><section class="card fm-sec"><h2>Kvadratna funkcija</h2><div class="fm-list"><div class="fm-item has-skica"><div class="fm-skica" id="sk"></div></div></div>
<div id="vrsta" style="display:flex;gap:8px;align-items:baseline"><b>Ime</b><span id="f"></span></div></section></div></div></div>
<script src="/vendor/katex/katex.min.js"></script>
<script type="module">
import { initSirina } from "/sirina.js";
import narisi from "/skice/kvadratna.js";
initSirina();
narisi(document.getElementById("sk"));
document.getElementById("f").innerHTML = katex.renderToString("x_{1,2} = \\\\frac{-b \\\\pm \\\\sqrt{D}}{2a}");
await document.fonts.ready;
window.ready = true;
</script></html>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const vendor = { "/vendor/katex/": "katex/dist/" };
    const pre = Object.keys(vendor).find((k) => url.startsWith(k));
    const base = pre ? path.join(NM, vendor[pre]) : PUB;
    const file = path.join(base, path.normalize(pre ? url.slice(pre.length) : url));
    if (!file.startsWith(base) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

const browsers = [];
for (const kind of ["chromium", "webkit"]) {
  try {
    if (playwright) browsers.push([kind, await playwright[kind].launch()]);
  } catch {}
}
const server = browsers.length ? await serve() : null;
test.after(async () => {
  for (const [, b] of browsers) await b.close();
  server?.close();
});
if (!browsers.length) test("čipi skic v brskalniku", { skip: "Playwright ni nameščen" }, () => {});

for (const [kind, browser] of browsers) {
  test(`čipi skic (${kind}, 360 px): vsaka formula v eni vrstici, nič se ne pomika; drsnik po 1/10000, izpis na stotinke`, async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(`http://127.0.0.1:${server.address().port}/t.html`);
    await p.waitForFunction(() => window.ready);
    await p.waitForTimeout(300);
    const cipi = await p.evaluate(() =>
      [...document.querySelectorAll(".sk-chip")].map((c) => {
        const k = c.querySelector(".sk-tex .katex");
        return { tex: k.querySelector("annotation")?.textContent, zlozena: k.classList.contains("tb-zlozena"), drsna: k.classList.contains("tb-dolga") || k.scrollWidth > k.clientWidth + 1, visina: Math.round(k.getBoundingClientRect().height) };
      }),
    );
    assert.equal(cipi.length, 5);
    for (const c of cipi) {
      assert.ok(!c.zlozena && !c.drsna, `${c.tex}: zložena ali drsna`);
      assert.ok(c.visina < 30, `${c.tex}: formula v čipu ni v eni vrstici (${c.visina} px)`);
    }
    // Formula v vrstici flex brez prelamljanja ima prostor vrstice brez imena: ostane cela (gre v vrstico).
    const vrsta = await p.evaluate(() => {
      const k = document.querySelector("#f .katex");
      return { zlozena: k.classList.contains("tb-zlozena"), drsna: k.classList.contains("tb-dolga"), sirina: document.scrollingElement.scrollWidth };
    });
    assert.ok(!vrsta.zlozena && !vrsta.drsna, "formula ob imenu v vrstici flex");
    assert.ok(vrsta.sirina <= 360, `brez vodoravnega drsenja (${vrsta.sirina})`);

    // Drsnik p: korak 1/10000, izpis in čip T na stotinke.
    const d = await p.evaluate(() => {
      const i = [...document.querySelectorAll(".sk-slider input")][1];
      i.value = "1.2345";
      i.dispatchEvent(new Event("input"));
      return { step: i.step, izpis: i.closest(".sk-slider").querySelector("output").textContent };
    });
    assert.equal(Number(d.step), 0.0001);
    assert.equal(d.izpis, "1,23");
    await p.waitForFunction(() => /T\(1,23; −2\)/.test(document.querySelector(".sk-chip")?.textContent || ""), null, { timeout: 3000 });
    assert.deepEqual(errors, []);
    await ctx.close();
  });
}
