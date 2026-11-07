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
  assert.match(tb, /if \(lost\) \(cur === 0 \? next : kajZdaj \|\| prev\)\.focus\(/, "zadnji korak: »Kaj zdaj?«");
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

const PAGE2 = `<!doctype html><meta charset="utf-8"><button id="zunaj">Zunaj</button>
<div id="o" role="dialog" aria-modal="true"><button id="o1">1</button><details><summary id="sum">Več</summary>x</details><p id="razlaga" tabindex="-1">Razlaga</p></div>
<div id="pop" role="dialog" hidden><button id="p1">P1</button><button id="p2">P2</button></div>
<div id="zaklep" hidden><input id="geslo"><button id="pozabil">Pozabil</button></div>
<button id="odpA">A</button>
<script type="module">
import { zadrziFokus } from "/fokus-okna.js";
window.z = zadrziFokus;
window.ready = true;
</script>`;

test("zadrziFokus: tuja okna, inert, summary, tabindex=-1, zapiranje v napačnem vrstnem redu", { skip }, async (t) => {
  const server = http.createServer((req, res) => {
    if (req.url === "/t2.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE2);
    if (req.url === "/fokus-okna.js") return res.writeHead(200, { "content-type": "text/javascript" }).end(src("fokus-okna.js"));
    res.writeHead(404).end();
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  const page = await browser.newPage();
  t.after(() => page.close().then(() => server.close()));
  await page.goto(`http://127.0.0.1:${server.address().port}/t2.html`);
  await page.waitForFunction(() => window.ready);
  const act = () => page.evaluate(() => document.activeElement.id || document.activeElement.tagName);
  await page.focus("#zunaj");
  await page.evaluate(() => { window.s = window.z(document.getElementById("o")); });
  assert.equal(await act(), "o1");
  await page.keyboard.press("Tab");
  assert.equal(await act(), "sum", "summary je v vrsti");
  // element s tabindex="-1" na koncu okna: Tab ne uide na stran, gre na začetek okna
  await page.evaluate(() => document.getElementById("razlaga").focus());
  await page.keyboard.press("Tab");
  assert.equal(await act(), "o1");
  await page.evaluate(() => document.getElementById("razlaga").focus());
  await page.keyboard.press("Shift+Tab");
  assert.equal(await act(), "sum", "Shift+Tab s tabindex=-1 na prejšnji element po DOM");
  // tuje okno zunaj sklada (oznaka formule #fx-pop): Tab ostane v njem
  await page.evaluate(() => { const p = document.getElementById("pop"); p.hidden = false; document.getElementById("p1").focus(); });
  await page.keyboard.press("Tab");
  assert.equal(await act(), "p2", "Tab v tujem oknu ni prestrežen");
  await page.evaluate(() => { document.getElementById("pop").hidden = true; });
  // zaklep profila: vse ostalo inert, Tab po zaklepu deluje
  await page.evaluate(() => { const z = document.getElementById("zaklep"); z.hidden = false; for (const el of document.body.children) if (el !== z && el.tagName !== "SCRIPT") el.inert = true; document.getElementById("geslo").focus(); });
  await page.keyboard.press("Tab");
  assert.equal(await act(), "pozabil", "Tab na zaklepnem zaslonu ni mrtev");
  await page.evaluate(() => { for (const el of document.body.children) el.inert = false; document.getElementById("zaklep").hidden = true; });
  // A spodaj, B nad njim; A se zapre prvi, B nato vrne fokus tja, kamor bi ga A (gumb #zunaj)
  await page.evaluate(() => { document.getElementById("o1").focus(); const p = document.getElementById("pop"); p.hidden = false; window.s2 = window.z(p); });
  assert.equal(await act(), "p1");
  await page.evaluate(() => { document.getElementById("o").hidden = true; window.s(); document.getElementById("pop").hidden = true; window.s2(); });
  assert.equal(await act(), "zunaj");
});

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
