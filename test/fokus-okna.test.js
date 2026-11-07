// Okna čez zaslon (aria-modal): fokus gre v okno, Tab ne uide na skrito stran pod njim, ob zaprtju se vrne
// (public/fokus-okna.js). Polje odgovora naloge ima ime za bralnik zaslona. Iskalec 9, 7. 11.
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
const src = (f) => fs.readFileSync(path.join(PUB, f), "utf8");

test("okna čez zaslon uporabljajo zadrziFokus (kalkulator, vodič, poskus, pola, naša pola, oglasna deska)", () => {
  const app = src("app.js");
  assert.match(app, /calcFokus = zadrziFokus\(\$\("#graph-overlay"\)/);
  assert.match(app, /sprosti = zadrziFokus\(box, \{ zacetni: box\.querySelector\('\[data-tour="next"\]'\)/);
  for (const f of ["odpri.js", "paper-viewer.js", "our-paper.js", "corner.js"]) assert.match(src(f), /zadrziFokus\(/, f);
});

test("polje odgovora in vmesni koraki imata aria-label", () => {
  assert.match(src("app.js"), /<input id="answer" aria-label="\$\{escapeHtml\(t\("games\.yourAnswer"\)\)\}"/);
  assert.match(src("app.js"), /<textarea class="work-text"[^>]* aria-label="\$\{escapeHtml\(t\("task\.work"\)\)\}"/);
});

test("lekcija: onemogočen gumb (zadnji korak, pravilen odgovor) fokusa ne odnese na začetek strani", () => {
  const tb = src("textbook.js");
  assert.match(tb, /if \(lost\) \(cur === 0 \? next : prev\)\.focus\(/);
  assert.match(tb, /why\.tabIndex = -1;[^\n]*\n\s*why\.focus\(/);
});

const PAGE = `<!doctype html><meta charset="utf-8"><button id="odpri">Odpri</button><button id="zadaj">Zadaj</button>
<div id="okno" role="dialog" aria-modal="true" hidden><button id="a">A</button><button id="skrit" hidden>S</button><input id="b"><button id="c" disabled>C</button></div>
<div id="okno2" role="dialog" aria-modal="true" hidden><button id="x">X</button><button id="y">Y</button></div>
<script type="module">
import { zadrziFokus } from "/fokus-okna.js";
const okno = document.getElementById("okno"), okno2 = document.getElementById("okno2");
document.getElementById("odpri").onclick = () => { okno.hidden = false; window.sprosti = zadrziFokus(okno); };
window.odpri2 = () => { okno2.hidden = false; window.sprosti2 = zadrziFokus(okno2, { zacetni: document.getElementById("y") }); };
window.ready = true;
</script>`;

let browser = null;
try {
  if (playwright) browser = await playwright.chromium.launch();
} catch {}
const skip = browser ? false : "Playwright/Chromium ni nameščen";

test("zadrziFokus v brskalniku", { skip }, async (t) => {
  const server = http.createServer((req, res) => {
    if (req.url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    if (req.url === "/fokus-okna.js") return res.writeHead(200, { "content-type": "text/javascript" }).end(src("fokus-okna.js"));
    res.writeHead(404).end();
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  const page = await browser.newPage();
  t.after(async () => {
    await browser.close();
    server.close();
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/t.html`);
  await page.waitForFunction(() => window.ready);
  const act = () => page.evaluate(() => document.activeElement.id || document.activeElement.tagName);
  await page.focus("#odpri");
  await page.keyboard.press("Enter");
  assert.equal(await act(), "a", "fokus gre na prvi gumb okna");
  const pot = [];
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("Tab");
    pot.push(await act());
  }
  assert.deepEqual(pot, ["b", "a", "b", "a"], "Tab kroži samo po oknu (brez skritih in onemogočenih)");
  await page.keyboard.press("Shift+Tab");
  assert.equal(await act(), "b", "Shift+Tab s prvega gre na zadnjega");
  // Drugo okno nad prvim: velja zadnje odprto, po zaprtju spet prvo.
  await page.evaluate(() => window.odpri2());
  assert.equal(await act(), "y");
  await page.keyboard.press("Tab");
  assert.equal(await act(), "x");
  await page.evaluate(() => { document.getElementById("okno2").hidden = true; window.sprosti2(); });
  assert.equal(await act(), "b", "fokus se vrne v prvo okno");
  await page.evaluate(() => { document.getElementById("okno").hidden = true; window.sprosti(); });
  assert.equal(await act(), "odpri", "ob zaprtju se fokus vrne na gumb, ki je okno odprl");
  await page.keyboard.press("Tab");
  assert.equal(await act(), "zadaj", "po zaprtju Tab spet deluje po strani");
});
