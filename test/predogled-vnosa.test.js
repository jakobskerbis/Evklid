// Formule v poljih (j, 12. 11. 2026: »Naj se ulomki, koreni itd. izpisujejo tudi v takih poljih«; 14. 11.: »namesto
// surovega zapisa, ne skupaj z njim«): odgovor naloge pokaže formulo v polju, vmesni koraki pod poljem; vrednost polja ostane enaka,
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
<div class="sc"><input id="kalk"></div><div id="klepet" style="padding:8px"><textarea id="input" rows="1" data-izris-v-polju style="width:100%;font-size:16px;padding:8px;box-sizing:border-box;resize:none"></textarea></div>
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
  test(`formula v polju (${kind}, 360 px): ulomek v odgovoru namesto surovega zapisa, predogled pod vmesnimi koraki, v klepetu v polju, ne v kalkulatorju`, async () => {
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
        const n = document.getElementById(id).nextElementSibling;
        return n?.classList.contains("vnos-predogled") && !n.hidden ? n : null;
      };
      const f = document.getElementById("answer");
      const o = document.querySelector(".answer-row .vnos-izris");
      const a = f.getBoundingClientRect();
      const b = o.getBoundingClientRect();
      return {
        odgovor: o?.querySelector("annotation")?.textContent,
        pod: document.querySelector(".answer-row").nextElementSibling?.className || "",
        skrito: getComputedStyle(f).webkitTextFillColor,
        znotraj: b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom,
        koraki: [...(pv("koraki")?.querySelectorAll("annotation") || [])].map((x) => x.textContent),
        vrednost: f.value,
        kalk: !!pv("kalk") || !!document.querySelector(".sc .vnos-izris:not([hidden])"),
        klepet: (() => {
          const i = document.getElementById("input");
          const k = document.querySelector("#klepet .vnos-izris");
          return { predogled: !!pv("input"), izris: !!k && !k.hidden && !!k.querySelector(".mfrac"), skrito: i.classList.contains("vnos-izrisan"), visina: Number(i.dataset.izrisVisina) || 0 };
        })(),
        sirina: document.scrollingElement.scrollWidth,
      };
    });
    assert.equal(r.odgovor, "\\displaystyle \\frac{3}{4}");
    assert.ok(!/vnos-predogled/.test(r.pod), "pod poljem za odgovor ni več surovega zapisa in predogleda posebej");
    assert.ok(/rgba\(0, 0, 0, 0\)|transparent/.test(r.skrito), `surovo besedilo polja je nevidno (${r.skrito})`);
    assert.ok(r.znotraj, "izris je v polju");
    assert.deepEqual(r.koraki, ["\\displaystyle \\sqrt{2} + \\frac{\\square}{\\square}"]);
    assert.equal(r.vrednost, "(3)/(4)", "vrednost polja ostane, kot je napisana");
    assert.ok(!r.kalk, "kalkulator ima svoj izris");
    assert.ok(!r.klepet.predogled && r.klepet.izris && r.klepet.skrito, "klepet: ulomek je izrisan v polju, surov zapis ni viden");
    assert.ok(r.klepet.visina > 30, `polje klepeta je visoko kot izris (${r.klepet.visina})`);
    assert.ok(r.sirina <= 360);
    // Vrednost, ki jo nastavi koda (plošča Piši: prebrani zapis, Popravi), osveži izris brez dogodka »input«.
    await p.evaluate(() => (document.getElementById("answer").value = "(1)/(2)"));
    await p.waitForFunction(() => document.querySelector(".answer-row .vnos-izris annotation")?.textContent.includes("\\frac{1}{2}"));
    // Brez zapisa formule izris izgine in polje spet kaže svoje besedilo.
    await p.fill("#answer", "0,75");
    assert.deepEqual(await p.evaluate(() => [document.querySelector(".vnos-izris").hidden, document.getElementById("answer").className]), [true, ""]);
    // Kazalec: π()/() s kazalcem v števcu, → skoči v imenovalec (ne obstane med »)/(«), ⌫ ga vrne v števec.
    await p.fill("#answer", "π()/()");
    await p.evaluate(() => document.getElementById("answer").setSelectionRange(2, 2));
    await p.keyboard.type("1");
    await p.keyboard.press("ArrowRight");
    await p.keyboard.type("5");
    const k = () => p.evaluate(() => [document.getElementById("answer").value, document.getElementById("answer").selectionStart]);
    assert.deepEqual(await k(), ["π(1)/(5)", 7]);
    assert.ok(await p.evaluate(() => !!document.querySelector(".vnos-izris .vnos-kazalka")), "kazalec je narisan v izrisu");
    await p.keyboard.press("ArrowLeft");
    await p.keyboard.press("Backspace");
    assert.deepEqual(await k(), ["π(1)/(5)", 3], "⌫ na začetku imenovalca skoči na konec števca");
    // Tap v izris postavi kazalec na najbližje mesto (pred π na začetek, v imenovalec za 5).
    const o = await p.evaluate(() => JSON.parse(JSON.stringify(document.querySelector(".vnos-izris-v").getBoundingClientRect())));
    await p.mouse.click(o.left + 1, o.top + o.height / 2);
    assert.equal((await k())[1], 0);
    await p.mouse.click(o.right - 1, o.bottom - 3);
    assert.equal((await k())[1], 7);
    await p.evaluate(() => document.getElementById("answer").setSelectionRange(5, 5)); // med »)/(«
    await p.waitForFunction(() => [6, 3].includes(document.getElementById("answer").selectionStart));
    assert.deepEqual(errors, []);
    await ctx.close();
  });
}

for (const [kind, browser] of browsers) {
  test(`klepet (${kind}, 360 px): ulomek s tipke se izriše v polju, dolgo besedilo se prelomi, prazno polje brez izrisa`, async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(`http://127.0.0.1:${server.address().port}/t.html`);
    await p.waitForFunction(() => window.ready);
    await p.fill("#input", "()/()");
    await p.evaluate(() => document.getElementById("input").setSelectionRange(1, 1));
    await p.keyboard.type("3");
    const st = () =>
      p.evaluate(() => {
        const i = document.getElementById("input");
        const o = document.querySelector("#klepet .vnos-izris");
        const a = i.getBoundingClientRect();
        const b = o.getBoundingClientRect();
        return { v: i.value, tex: o.querySelector("annotation")?.textContent, kz: !!o.querySelector(".vnos-kazalka"), hidden: o.hidden, sirina: Math.round(b.width - a.width), visina: o.querySelector(".vnos-izris-v").offsetHeight, w: document.scrollingElement.scrollWidth };
      });
    let s = await st();
    assert.equal(s.v, "(3)/()");
    assert.match(s.tex, /^\\displaystyle \\frac\{3.*\}\{\\square\}$/);
    assert.ok(s.kz && !s.hidden && s.sirina <= 0 && s.sirina >= -4, JSON.stringify(s));
    const ena = s.visina;
    await p.fill("#input", "Koliko je (3)/(4) + (1)/(8)? Prosim razloži vsak korak posebej, da bom razumel, kako se seštevajo ulomki.");
    s = await st();
    assert.ok(s.visina > ena, "dolgo besedilo se prelomi v več vrstic");
    assert.ok(s.w <= 360, "nič ne gleda čez rob");
    await p.fill("#input", "");
    s = await st();
    assert.ok(s.hidden, "prazno polje: brez izrisa, viden je namig");
    assert.deepEqual(errors, []);
    await ctx.close();
  });
}
