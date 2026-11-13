// Predogled formul pod poljem za vnos (j, 12. 11. 2026: »Naj se ulomki, koreni itd. izpisujejo tudi v takih poljih«):
// zapis s tipkovnice v odgovoru naloge in v vmesnih korakih se izriše pod poljem, vrednost polja ostane enaka,
// v kalkulatorju in klepetu (svoj izris) se ne pokaže. Chromium in WebKit, kolikor ju Playwright ima.
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { predogledHtml } from "../public/predogled-vnosa.js";

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

test("predogled: besedilo ostane besedilo (escaped), zapis formule postane formula", () => {
  globalThis.katex = { renderToString: (t) => `[${t}]` };
  try {
    assert.equal(predogledHtml("Rešitev <b> (1)/(2) m"), "Rešitev &lt;b&gt; [\\displaystyle \\frac{1}{2}] m");
    assert.equal(predogledHtml("()/()"), "[\\displaystyle \\frac{\\square}{\\square}]");
  } finally {
    delete globalThis.katex;
  }
});

const PUB = path.resolve("public");
const NM = path.resolve("node_modules");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".html": "text/html" };
const PAGE = `<!doctype html><html lang="sl"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css">
<div class="card" style="margin:16px"><textarea id="koraki"></textarea><form class="answer-row"><input id="answer"><button class="primary">Preveri</button></form></div>
<div class="sc"><input id="kalk"></div><textarea id="input"></textarea>
<script src="/vendor/katex/katex.min.js"></script>
<script type="module">
import { initPredogledVnosa } from "/predogled-vnosa.js";
initPredogledVnosa();
window.ready = true;
</script></html>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const pre = url.startsWith("/vendor/katex/") ? "/vendor/katex/" : null;
    const base = pre ? path.join(NM, "katex/dist/") : PUB;
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

for (const [kind, browser] of browsers) {
  test(`predogled pod poljem (${kind}, 360 px): ulomek in koren v odgovoru in vmesnih korakih, ne v kalkulatorju in klepetu`, async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(`http://127.0.0.1:${server.address().port}/t.html`);
    await p.waitForFunction(() => window.ready);
    await p.fill("#answer", "(3)/(4)");
    await p.fill("#koraki", "x = √(2) + ()/()");
    await p.fill("#kalk", "(3)/(4)");
    await p.fill("#input", "(3)/(4)");
    const r = await p.evaluate(() => {
      const pv = (id) => {
        const f = document.getElementById(id);
        const n = (f.closest(".answer-row") || f).nextElementSibling;
        return n?.classList.contains("vnos-predogled") && !n.hidden ? n : null;
      };
      return {
        odgovor: pv("answer")?.querySelector("annotation")?.textContent,
        koraki: [...(pv("koraki")?.querySelectorAll("annotation") || [])].map((a) => a.textContent),
        vrednost: document.getElementById("answer").value,
        kalk: !!pv("kalk"),
        klepet: !!pv("input"),
        sirina: document.scrollingElement.scrollWidth,
      };
    });
    assert.equal(r.odgovor, "\\displaystyle \\frac{3}{4}");
    assert.deepEqual(r.koraki, ["\\displaystyle \\sqrt{2} + \\frac{\\square}{\\square}"]);
    assert.equal(r.vrednost, "(3)/(4)", "vrednost polja ostane, kot je napisana");
    assert.ok(!r.kalk && !r.klepet, "kalkulator in klepet imata svoj izris");
    assert.ok(r.sirina <= 360);
    // Vrednost, ki jo nastavi koda (plošča Piši: prebrani zapis, Popravi), osveži predogled brez dogodka »input«.
    await p.evaluate(() => (document.getElementById("answer").value = "(1)/(2)"));
    await p.waitForFunction(() => document.querySelector("form.answer-row + .vnos-predogled annotation")?.textContent.includes("\\frac{1}{2}"));
    // Brez zapisa formule predogled izgine.
    await p.fill("#answer", "0,75");
    assert.equal(await p.evaluate(() => document.querySelector("form.answer-row").nextElementSibling.hidden), true);
    await p.evaluate(() => (document.getElementById("answer").value = "(3)/(4)"));
    await p.waitForFunction(() => !document.querySelector("form.answer-row + .vnos-predogled").hidden);
    assert.deepEqual(errors, []);
    await ctx.close();
  });
}
