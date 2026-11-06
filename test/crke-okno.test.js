// Okno pomena črke v pravem brskalniku (j, 6. 11.): v Ponavljanju je tap na x₁ obrnil kartico in okno je
// prekrilo vprašanje. Tap na črko, tap v oknu in zapiranje okna ne smejo sprožiti elementa okoli (kartica,
// vrstica, razdelek); okno ne prekrije formule (telefon: spodnji list); zapre se s tapom v prazno, ✕, Esc in Nazaj.
// Playwright (če je nameščen), telefon 360 × 740 in računalnik 1280 × 800.
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
// Kartica, ki se ob kliku obrne (kot .fc-flip v Ponavljanju), razdelek <details> in vrstica s formulo.
// Pred njimi je dovolj besedila, da je kartica na telefonu pri dnu zaslona (list bi jo prekril).
// Distančnik na koncu (flex:none, ker je body v style.css flex stolpec) omogoči drsenje tudi na računalniku.
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css">
<style>body{margin:0;padding:16px}.fc-flip{border:1px solid #888;padding:16px;cursor:pointer}.vrstica{padding:12px;border:1px solid #888}#drug-gumb{position:fixed;top:8px;right:8px;z-index:5}</style>
<p id="pred">${"Besedilo pred kartico. ".repeat(60)}</p>
<div class="fc-flip" role="button" tabindex="0" id="kartica"><div id="vsebina"></div><p id="prazno">Tapni za obrat</p></div>
<details id="razdelek"><summary id="povzetek"></summary><p>Vsebina</p></details>
<div class="vrstica" id="vrstica"></div>
<p>${"Besedilo za kartico. ".repeat(80)}</p>
<div style="height:120vh;flex:none"></div>
<button id="drug-gumb" type="button">Drug gumb</button>
<script src="/vendor/katex/katex.min.js"></script><script src="/vendor/marked/marked.umd.js"></script><script src="/vendor/dompurify/purify.min.js"></script>
<script type="module">
import { createRenderer } from "/rich.js";
import { initFormulaInfo, closeFormulaPop, annotateTex, withFormulaSubject } from "/formula-info.js";
const { renderRich, renderMath } = createRenderer({ annotate: (tex, o) => annotateTex(tex, undefined, o) });
window.obrati = 0; window.vrstica = 0; window.gumb = 0;
document.getElementById("vsebina").innerHTML = withFormulaSubject("MAT", () => renderRich("Rešitvi kvadratne enačbe sta $x_{1,2} = \\\\frac{-b \\\\pm \\\\sqrt{D}}{2a}$."), null, "Kvadratna enačba");
document.getElementById("povzetek").innerHTML = withFormulaSubject("FIZ", () => renderMath("F = m a", false), null, "Sila");
document.getElementById("vrstica").innerHTML = withFormulaSubject("FIZ", () => renderRich("Hitrost $v = \\\\frac{s}{t}$"), null, "Gibanje");
document.getElementById("kartica").addEventListener("click", () => window.obrati++);
document.getElementById("vrstica").addEventListener("click", () => window.vrstica++);
document.getElementById("drug-gumb").addEventListener("click", () => window.gumb++);
// Kot app.js: odprto okno doda zapis v zgodovino, Nazaj ga zapre.
initFormulaInfo({ opened: () => history.pushState({ fx: 1 }, ""), closed: () => {} });
addEventListener("popstate", () => { window.zaprtoNazaj = closeFormulaPop(); });
window.ready = true;
</script>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const vendor = { "/vendor/katex/": "katex/dist/", "/vendor/marked/": "marked/lib/", "/vendor/dompurify/": "dompurify/dist/" };
    const pre = Object.keys(vendor).find((k) => url.startsWith(k));
    const base = pre ? path.join(NM, vendor[pre]) : PUB;
    const file = path.join(base, path.normalize(pre ? url.slice(pre.length) : url));
    if (!file.startsWith(base) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

let browser = null;
try {
  if (playwright) browser = await playwright.chromium.launch();
} catch {}
const skip = browser ? false : "Playwright/Chromium ni nameščen";

const SHOTS = process.env.CRKE_POSNETKI || "";
const open = (p) => p.locator("#fx-pop:not([hidden])").count();
const overlap = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

test("okno pomena: dotik ne obrne kartice, okno ne prekrije formule, zapre se na vse načine", { skip }, async (t) => {
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await browser.close();
    server.close();
  });
  for (const vp of [{ width: 360, height: 740 }, { width: 1280, height: 800 }]) {
    const phone = vp.width < 500;
    const ctx = await browser.newContext({ viewport: vp, isMobile: phone, hasTouch: phone });
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(`${base}/t.html`);
    await p.waitForFunction(() => window.ready && document.querySelector("#kartica [data-fx][role=button]"));
    // Kartica pri dnu zaslona (kot na posnetku: odgovor pod vprašanjem).
    await p.$eval("#kartica", (el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight + el.offsetHeight + 20));
    const sym = p.locator("#kartica [data-fx][role=button]").first();
    const tap = (loc) => (phone ? loc.tap() : loc.click());

    // 1) Tap na črko: okno se odpre, kartica se ne obrne.
    await tap(sym);
    assert.equal(await open(p), 1, `${vp.width}: okno se odpre`);
    assert.equal(await p.evaluate(() => window.obrati), 0, `${vp.width}: tap na črko ne obrne kartice`);
    await p.waitForTimeout(150);
    // Okno ne prekrije formule, na katero se nanaša; na telefonu je spodnji list.
    const r = await p.evaluate(() => {
      const box = (el) => { const b = el.getBoundingClientRect(); return { left: b.left, right: b.right, top: b.top, bottom: b.bottom }; };
      const sym = document.querySelector("#kartica [data-fx].fx-open");
      return { pop: box(document.getElementById("fx-pop")), line: box(sym.closest(".katex")), para: box(sym.closest("p")), sheet: document.getElementById("fx-pop").classList.contains("fx-sheet"), h: innerHeight };
    });
    assert.ok(!overlap(r.pop, r.line), `${vp.width}: okno prekrije formulo ${JSON.stringify(r)}`);
    assert.ok(!overlap(r.pop, r.para), `${vp.width}: okno prekrije odstavek s formulo ${JSON.stringify(r)}`);
    assert.equal(r.sheet, phone, `${vp.width}: spodnji list samo na telefonu`);
    if (phone) assert.ok(Math.abs(r.pop.bottom - r.h) < 2 && r.line.bottom <= r.pop.top, "list je spodaj, formula nad njim");
    if (SHOTS) await p.screenshot({ path: path.join(SHOTS, `okno-${vp.width}.png`) });

    // 2) Tap v oknu ne obrne kartice in okna ne zapre.
    await tap(p.locator("#fx-pop .fx-title"));
    assert.equal(await open(p), 1);
    assert.equal(await p.evaluate(() => window.obrati), 0, `${vp.width}: tap v oknu ne obrne kartice`);
    // 3) ✕ zapre okno, kartica se ne obrne.
    await tap(p.locator("#fx-pop .fx-close"));
    assert.equal(await open(p), 0, `${vp.width}: ✕ zapre okno`);
    assert.equal(await p.evaluate(() => window.obrati), 0, `${vp.width}: ✕ ne obrne kartice`);
    // 4) Tap v prazno (na kartici) okno zapre, kartice ne obrne; naslednji tap jo obrne.
    await tap(sym);
    await tap(p.locator("#prazno"));
    assert.equal(await open(p), 0, `${vp.width}: tap v prazno zapre okno`);
    assert.equal(await p.evaluate(() => window.obrati), 0, `${vp.width}: tap, ki zapre okno, ne obrne kartice`);
    await tap(p.locator("#prazno"));
    assert.equal(await p.evaluate(() => window.obrati), 1, `${vp.width}: brez odprtega okna kartica se obrne`);
    // 5) Pravi gumb deluje že ob prvem dotiku, okno se zapre.
    await tap(sym);
    assert.equal(await open(p), 1);
    await tap(p.locator("#drug-gumb"));
    assert.equal(await p.evaluate(() => window.gumb), 1, `${vp.width}: gumb deluje ob prvem dotiku`);
    assert.equal(await open(p), 0);
    // 6) Nazaj zapre okno, Esc tudi; tipka Enter na črki ne obrne kartice.
    await p.$eval("#kartica", (el) => el.scrollIntoView({ block: "center" }));
    await tap(sym);
    await p.goBack();
    await p.waitForFunction(() => document.getElementById("fx-pop").hidden);
    assert.equal(await p.evaluate(() => window.zaprtoNazaj), true, `${vp.width}: Nazaj zapre okno`);
    if (!phone) {
      await sym.focus();
      await p.keyboard.press("Enter");
      assert.equal(await open(p), 1, "Enter na črki odpre okno");
      await p.keyboard.press("Escape");
      assert.equal(await open(p), 0, "Esc zapre okno");
    }
    const flips = await p.evaluate(() => window.obrati);
    assert.equal(flips, 1, `${vp.width}: kartica se je obrnila samo ob tapu v prazno brez okna`);
    // 7) Razdelek (<details>) in vrstica: tap na črko ne odpre razdelka in ne sproži vrstice.
    await p.$eval("#razdelek", (el) => el.scrollIntoView({ block: "center" }));
    await tap(p.locator("#povzetek [data-fx][role=button]").first());
    assert.equal(await p.$eval("#razdelek", (el) => el.open), false, `${vp.width}: tap na črko ne odpre razdelka`);
    await tap(p.locator("#fx-pop .fx-close"));
    await tap(p.locator("#vrstica [data-fx][role=button]").first());
    assert.equal(await p.evaluate(() => window.vrstica), 0, `${vp.width}: tap na črko ne sproži vrstice`);
    // 8) Druga črka ob odprtem oknu: en sam zapis v zgodovini, Nazaj enkrat zapre (pregled 463 b).
    await tap(p.locator("#fx-pop .fx-close"));
    const row = p.locator("#vrstica [data-fx][role=button]");
    const hist0 = await p.evaluate(() => history.length);
    await tap(row.nth(0));
    await tap(row.nth(1));
    assert.equal(await open(p), 1);
    assert.equal(await p.evaluate(() => history.length), hist0 + 1, `${vp.width}: menjava črke ne doda zapisa v zgodovini`);
    await p.goBack();
    await p.waitForFunction(() => document.getElementById("fx-pop").hidden);
    // 9) Drsenje zapre okno; sprememba širine (obrat) ga zapre, sprememba samo višine (vrstica brskalnika) ne (pregled 463 d).
    await p.$eval("#vrstica", (el) => el.scrollIntoView({ block: "center" }));
    await tap(row.nth(0));
    await p.waitForTimeout(600); // lastno drsenje okna (telefon) je mimo
    const y0 = await p.evaluate(() => scrollY);
    await p.evaluate(() => window.scrollBy(0, -40));
    assert.ok((await p.evaluate(() => scrollY)) < y0, `${vp.width}: stran se je premaknila`);
    await p.waitForFunction(() => document.getElementById("fx-pop").hidden);
    await tap(row.nth(0));
    await p.setViewportSize({ width: vp.width, height: vp.height - 60 });
    await p.waitForTimeout(100);
    assert.equal(await open(p), 1, `${vp.width}: nova višina okna ne zapre`);
    await p.setViewportSize({ width: vp.width - 40, height: vp.height - 60 });
    await p.waitForFunction(() => document.getElementById("fx-pop").hidden);
    await p.setViewportSize(vp);
    // 10) Tipkovnica: Enter premakne fokus v okno, Tab pride do ✕, Esc vrne fokus na črko (pregled 463 c).
    if (!phone) {
      await row.nth(0).focus();
      await p.keyboard.press("Enter");
      assert.equal(await p.evaluate(() => document.activeElement?.id), "fx-pop", "fokus je v oknu");
      assert.equal(await row.nth(0).getAttribute("aria-controls"), "fx-pop");
      await p.keyboard.press("Tab");
      assert.equal(await p.evaluate(() => document.activeElement?.classList.contains("fx-close")), true, "Tab pride do ✕");
      await p.keyboard.press("Escape");
      assert.equal(await open(p), 0);
      assert.equal(await p.evaluate(() => !!document.activeElement?.closest("#vrstica [data-fx]")), true, "fokus nazaj na črki");
      assert.equal(await row.nth(0).getAttribute("aria-controls"), null);
    }
    // 11) Od desne proti levi (arabščina): okno ne prekrije formule in ostane na zaslonu.
    await p.evaluate(() => { document.documentElement.dir = "rtl"; });
    await p.$eval("#vrstica", (el) => el.scrollIntoView({ block: "center" }));
    await tap(row.nth(0));
    await p.waitForTimeout(150);
    const q = await p.evaluate(() => {
      const box = (el) => { const b = el.getBoundingClientRect(); return { left: b.left, right: b.right, top: b.top, bottom: b.bottom }; };
      return { pop: box(document.getElementById("fx-pop")), line: box(document.querySelector("#vrstica .fx-open").closest(".katex")), w: innerWidth };
    });
    assert.ok(!overlap(q.pop, q.line), `${vp.width} RTL: okno prekrije formulo ${JSON.stringify(q)}`);
    assert.ok(q.pop.left >= -1 && q.pop.right <= q.w + 1, `${vp.width} RTL: okno je na zaslonu ${JSON.stringify(q)}`);
    if (SHOTS) await p.screenshot({ path: path.join(SHOTS, `okno-rtl-${vp.width}.png`) });
    await tap(p.locator("#fx-pop .fx-close"));
    await p.evaluate(() => { document.documentElement.dir = "ltr"; });
    assert.deepEqual(errors, []);
    await ctx.close();
  }
});
