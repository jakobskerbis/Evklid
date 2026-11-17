// Esc zapre izpitno polo (naša pola, public/our-paper.js; prenesena pola, public/paper-viewer.js) tudi, ko fokus
// ni v oknu (pregled celotne aplikacije, 17. 11. 2026). Kot gumb ×: označene točke ostanejo, šibke točke gredo naprej.
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

test("obe poli poslušata Esc tudi na dokumentu (escZaOkno) in ga ob zaprtju odstranita", () => {
  for (const f of ["our-paper.js", "paper-viewer.js"]) {
    const s = src(f);
    const m = s.match(/document\.addEventListener\("keydown", (\w+), true\)/);
    assert.ok(m, `${f}: poslušalec na dokumentu`);
    assert.match(s, new RegExp(`document\\.removeEventListener\\("keydown", ${m[1]}, true\\)`), `${f}: odstranjen ob zaprtju`);
    assert.match(s, /escZaOkno\(e, el\)/, f);
  }
});

const PAGE = `<!doctype html><meta charset="utf-8"><button id="odpri">Odpri</button>
<div id="drugo" role="dialog" aria-modal="true" hidden><button id="d1">D</button></div>
<script type="module">
import { openOurPaper, ourPaperOpen } from "/our-paper.js";
import { zadrziFokus } from "/fokus-okna.js";
const paper = { minutes: 10, tasks: [{ n: 1, parts: [{ id: "a", text: "1 + 1", points: 2, answer: "2" }] }] };
window.shranjeno = {};
window.oddano = null;
window.odpri = () => openOurPaper(paper, { title: "Pola", rich: (s) => String(s), score: { get: () => window.shranjeno, set: (v) => (window.shranjeno = v) }, onChecked: (p) => (window.oddano = p) });
window.odprta = ourPaperOpen;
window.drugo = () => { const d = document.getElementById("drugo"); d.hidden = false; window.sprostiDrugo = zadrziFokus(d); };
window.ready = true;
</script>`;

let browser = null;
try {
  if (playwright) browser = await playwright.chromium.launch();
} catch {}
const skip = browser ? false : "Playwright/Chromium ni nameščen";

test("naša pola: Esc zapre polo, ko je fokus na body, in ohrani označene točke", { skip }, async (t) => {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = path.join(PUB, path.normalize(url));
    if (!file.startsWith(PUB) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": file.endsWith(".js") ? "text/javascript" : "application/octet-stream" }).end(fs.readFileSync(file));
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  const page = await browser.newPage();
  t.after(async () => {
    await page.close();
    await browser.close();
    server.close();
  });
  const napake = [];
  page.on("pageerror", (e) => napake.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/t.html`);
  await page.waitForFunction(() => window.ready);

  // Fokus v poli (gumb ×): Esc zapre kot doslej.
  await page.evaluate(() => window.odpri());
  assert.equal(await page.evaluate(() => window.odprta()), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.evaluate(() => window.odprta()), false, "Esc s fokusom v poli");

  // Učenec označi »Imam prav«, fokus nato pristane na body (element s fokusom izgine): Esc vseeno zapre.
  await page.evaluate(() => window.odpri());
  await page.click("[data-op-got]");
  await page.evaluate(() => document.activeElement.blur());
  assert.equal(await page.evaluate(() => document.activeElement === document.body), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.evaluate(() => window.odprta()), false, "Esc s fokusom na body");
  assert.deepEqual(await page.evaluate(() => window.shranjeno), { "1a": true }, "označene točke ostanejo");
  assert.deepEqual(await page.evaluate(() => window.oddano), [{ key: "1a", ok: true }], "kot gumb ×: šibke točke");
  // Ob ponovnem odprtju je oznaka še tam.
  await page.evaluate(() => window.odpri());
  assert.equal(await page.isChecked("[data-op-got]"), true);

  // Drugo okno nad polo: Esc ne zapre pole pod njim.
  await page.evaluate(() => window.drugo());
  await page.evaluate(() => document.activeElement.blur());
  await page.keyboard.press("Escape");
  assert.equal(await page.evaluate(() => window.odprta()), true, "pola pod drugim oknom ostane");
  await page.evaluate(() => { document.getElementById("drugo").hidden = true; window.sprostiDrugo(); });
  await page.keyboard.press("Escape");
  assert.equal(await page.evaluate(() => window.odprta()), false);
  assert.deepEqual(napake, []);
});
