// Naša pola (public/our-paper.js, j 26. 11. 2026): pri izbirnih nalogah učenec odgovor izbere z dotikom na črko ali
// besedilo možnosti; rešitve so samo na koncu (»Preveri rešitve«), izbirni del z enim pravilnim odgovorom se oceni sam.
// Isto pri poskusnem izpitu (openExamSim): izbira med pisanjem, točke izbirnega dela so ob oceni že vpisane.
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

const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/competition.css">
<body><script type="module">
import { openOurPaper, openExamSim, closeOurPaper, ourPaperOpen } from "/our-paper.js";
const paper = { minutes: 10, tasks: [
  { n: 1, parts: [
    { id: "a", format: "choice", text: "Katera hitrost je največja?", choices: ["30 m/s", "1,8 km/min", "0,029 mm/µs", "110 km/h"], correct: [2], points: 2, answer: "C" },
    { id: "b", format: "choice", text: "Označi pravilni trditvi.", choices: ["P", "N", "P", "N"], correct: [0, 2], points: 2, answer: "A in C" },
    { id: "c", format: "open", text: "Izračunaj 2 + 3.", points: 1, answer: "5" },
  ] },
] };
window.shranjeno = {};
window.oddano = null;
window.odpri = () => openOurPaper(paper, { title: "Pola", rich: (s) => String(s), onTutor: () => {}, score: { get: () => window.shranjeno, set: (v) => (window.shranjeno = v) }, onChecked: (p) => (window.oddano = p) });
window.sim = null;
window.odpriSim = () => openExamSim(paper, { title: "Na čas", rich: (s) => String(s), store: { get: () => window.sim, set: (v) => (window.sim = JSON.parse(JSON.stringify(v))), clear: () => (window.sim = null) }, onSave: async () => ({ points: 0, maxPoints: 5, percent: 0, topics: [] }) });
window.zapri = closeOurPaper;
window.odprta = ourPaperOpen;
window.ready = true;
</script>`;

let browser = null;
try {
  if (playwright) browser = await playwright.chromium.launch();
} catch {}
const skip = browser ? false : "Playwright/Chromium ni nameščen";

test("naša pola: izbira z dotikom, rešitve samo na koncu, samodejna ocena izbirnega dela", { skip }, async (t) => {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = path.join(PUB, path.normalize(url));
    if (!file.startsWith(PUB) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return res.writeHead(404).end();
    const type = file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : file.endsWith(".json") ? "application/json" : "application/octet-stream";
    res.writeHead(200, { "content-type": type }).end(fs.readFileSync(file));
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  // Telefon (dotik); na tablici in računalniku je isti izris.
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  t.after(async () => {
    await ctx.close();
    await browser.close();
    server.close();
  });
  const napake = [];
  page.on("pageerror", (e) => napake.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/t.html`);
  await page.waitForFunction(() => window.ready);
  const pressed = (part) => page.$$eval(`[data-op="${part}"] [data-op-ch]`, (bs) => bs.map((b) => b.getAttribute("aria-pressed") === "true"));

  await page.evaluate(() => window.odpri());
  // Med reševanjem ni rešitev ne gumba za posamezno rešitev ne »Imam prav«.
  assert.equal(await page.locator(".op .op-sol, .op [data-op-show], .op [data-op-got]").count(), 0, "rešitve so samo na koncu");
  assert.equal(await page.locator(".op [data-op-finish]").count(), 1);
  // Vsaka možnost je gumb, dovolj velik za prst.
  for (const h of await page.$$eval(".op [data-op-ch]", (bs) => bs.map((b) => b.getBoundingClientRect().height))) assert.ok(h >= 44, `višina možnosti ${h}`);

  // En pravilni odgovor: dotik na črko izbere, dotik na drugo besedilo zamenja, drugi dotik na isto pobriše.
  await page.tap('[data-op="1a"] [data-op-ch="1"] .op-ch-l');
  assert.deepEqual(await pressed("1a"), [false, true, false, false]);
  await page.tap('[data-op="1a"] [data-op-ch="2"] .op-ch-t');
  assert.deepEqual(await pressed("1a"), [false, false, true, false]);
  await page.tap('[data-op="1a"] [data-op-ch="2"]');
  assert.deepEqual(await pressed("1a"), [false, false, false, false]);
  await page.tap('[data-op="1a"] [data-op-ch="2"] .op-ch-t');
  assert.deepEqual(await page.evaluate(() => window.shranjeno), { _izb: { "1a": [2] } }, "izbira ostane v napravi");
  // Več pravilnih: dotiki preklapljajo.
  await page.tap('[data-op="1b"] [data-op-ch="0"]');
  await page.tap('[data-op="1b"] [data-op-ch="1"]');
  assert.deepEqual(await pressed("1b"), [true, true, false, false]);
  assert.match(await page.textContent("[data-op-rest]"), /\b2\D+2\b/);

  // Zapri in odpri: izbira je še tam, rešitev še ni.
  await page.evaluate(() => window.zapri());
  assert.equal(await page.evaluate(() => window.oddano), null, "brez preverjanja ni šibkih točk");
  await page.evaluate(() => window.odpri());
  assert.deepEqual(await pressed("1a"), [false, false, true, false]);
  assert.equal(await page.locator(".op .op-sol").count(), 0);

  // Preveri rešitve: vse rešitve hkrati, 1a pravilno (2 t.), 1b in 1c z »Imam prav«.
  await page.tap("[data-op-finish]");
  assert.equal(await page.locator(".op .op-sol").count(), 3);
  assert.equal(await page.locator('[data-op="1a"] .op-ch.prav').count(), 1);
  assert.equal(await page.locator('[data-op="1a"] .op-izid.prav').count(), 1);
  assert.equal(await page.locator('[data-op="1a"] [data-op-got]').count(), 0, "izbirni del z enim odgovorom se oceni sam");
  assert.equal(await page.locator('[data-op="1b"] .op-ch.narobe').count(), 1, "napačno izbrana možnost je označena");
  assert.equal(await page.locator('[data-op="1b"] .op-ch.prav').count(), 2);
  assert.equal(await page.locator("[data-op-got]").count(), 2);
  assert.match(await page.textContent(".op-score"), /^\s*2 \/ 5 /);
  // Po koncu se izbira ne spreminja.
  await page.tap('[data-op="1a"] [data-op-ch="0"]', { force: true });
  assert.deepEqual(await pressed("1a"), [false, false, true, false]);
  await page.tap('[data-op="1c"] [data-op-got]');
  assert.match(await page.textContent(".op-score"), /^\s*3 \/ 5 /);
  await page.evaluate(() => window.zapri());
  assert.deepEqual(
    (await page.evaluate(() => window.oddano)).sort((a, b) => a.key.localeCompare(b.key)),
    [
      { key: "1a", ok: true },
      { key: "1c", ok: true },
    ],
  );
  assert.deepEqual(await page.evaluate(() => window.shranjeno), { "1a": true, "1c": true, _izb: { "1a": [2], "1b": [0, 1] }, _konec: true });

  // Ponovno odprta pola je preverjena; »Reši znova« (dvakrat) pobriše izbiro in točke.
  await page.evaluate(() => window.odpri());
  assert.equal(await page.locator(".op .op-sol").count(), 3);
  await page.tap("[data-op-redo]");
  assert.equal(await page.locator(".op .op-sol").count(), 3, "prvi pritisk samo vpraša");
  await page.tap("[data-op-redo]");
  assert.equal(await page.locator(".op .op-sol, .op [data-op-got]").count(), 0);
  assert.deepEqual(await pressed("1a"), [false, false, false, false]);
  assert.deepEqual(await page.evaluate(() => window.shranjeno), {});
  await page.evaluate(() => window.zapri());

  // Stara shranjena pola (samo »Imam prav«) se odpre z rešitvami.
  await page.evaluate(() => (window.shranjeno = { "1c": true }));
  await page.evaluate(() => window.odpri());
  assert.equal(await page.locator(".op .op-sol").count(), 3);
  assert.equal(await page.isChecked('[data-op="1c"] [data-op-got]'), true);
  await page.evaluate(() => window.zapri());

  // Poskusni izpit: izbira med pisanjem, ob oceni ima izbirni del z enim odgovorom točke že vpisane.
  await page.evaluate(() => window.odpriSim());
  await page.tap("[data-sim-start]");
  await page.tap('[data-op="1a"] [data-op-ch="0"] .op-ch-t');
  assert.deepEqual(await pressed("1a"), [true, false, false, false]);
  assert.deepEqual(await page.evaluate(() => window.sim.izb), { "1a": [0] });
  await page.tap("[data-sim-finish]");
  assert.equal(await page.evaluate(() => window.sim.pts["1a"]), 0, "napačen odgovor: 0 točk");
  assert.equal(await page.locator('[data-op="1a"] [data-sim-pt="0"].on').count(), 1);
  assert.equal(await page.locator('[data-op="1a"] .op-ch.narobe').count(), 1);
  assert.equal(await page.evaluate(() => window.sim.pts["1b"]), undefined, "več pravilnih: točke da učenec");
  await page.evaluate(() => window.zapri());
  assert.equal(await page.evaluate(() => window.odprta()), false);
  assert.deepEqual(napake, []);
});
