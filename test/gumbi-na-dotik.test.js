// Gumbi na dotik v Safariju (iPad, iPhone; j 2026-11-15: v lekciji o ločevanju zmesi niso delali »Ustavi«, »Znova«,
// »Ponastavi« in »Naslednja«). Safari po dotiku nekaj deset milisekund opazuje stran; nov klikljiv element na zaslonu
// (poslušalec click/mousedown/mouseup ali gumb, polje, povezava) vzame kot meni ob lebdenju in klika ne pošlje nobenemu
// gumbu na strani. Animacija ga zato ne sme risati znova v vsaki sličici. Razlaga: scripts/gumbi-na-dotik.cjs.
import test, { before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { preveri, ponavlja } = require("../scripts/gumbi-na-dotik.cjs");

test("ponavlja: only elements that keep appearing (animation) count, a one-off change does not", () => {
  assert.deepEqual(ponavlja([]), []);
  assert.deepEqual(ponavlja([{ t: 10, opis: "button.layer-chip" }, { t: 12, opis: "button.layer-chip" }]), []);
  assert.deepEqual(ponavlja([{ t: 10, opis: "g.pt-cell" }, { t: 400, opis: "g.pt-cell" }]), ["g.pt-cell", "g.pt-cell"]);
});

test("sims that redraw every frame listen for clicks on a lasting parent, not on redrawn elements", () => {
  const kem = fs.readFileSync("public/sim/kem-organska.js", "utf8");
  const dest = kem.slice(kem.indexOf("export function destilacija"), kem.indexOf("// ----", kem.indexOf("export function destilacija")));
  assert.doesNotMatch(dest, /\bg\.addEventListener\("click"/, "destilacija: frakcija brez lastnega poslušalca");
  assert.match(dest, /svg\.addEventListener\("click"/);
  const tek = fs.readFileSync("public/sim/mat-tek.js", "utf8");
  const han = tek.slice(tek.indexOf("export function hanoi"), tek.indexOf("// ----", tek.indexOf("export function hanoi")));
  assert.doesNotMatch(han, /\bg\.addEventListener\("click"/, "hanoi: palica brez lastnega poslušalca");
  const lab = fs.readFileSync("public/sim/lab.js", "utf8");
  assert.match(lab, /legend\.addEventListener\("click"/);
  assert.match(lab, /if \(sig !== legSig\)/, "legenda grafa se nariše znova le, ko se spremeni");
});

let chromium = null;
before(async () => {
  try {
    const pw = require("playwright").chromium;
    await (await pw.launch()).close();
    chromium = pw;
  } catch {}
});

// Vse simulacije, ki so imele to napako, in nekaj drugih z neprestano animacijo (oder se riše vsako sličico).
const IDS = ["destilacija", "hanoi", "lab-grelnik", "lab-ohlajanje", "lab-mesanje", "lab-faze", "delci", "plini", "nihalo", "orbita", "razpad", "val", "titracija", "hitrost", "populacija", "krozenje"];

test("in a real browser no sim keeps creating clickable elements on its own", { timeout: 180000 }, async (t) => {
  if (!chromium) return t.skip("Playwright chromium ni nameščen");
  const { slabi, napake, skupaj } = await preveri({ ids: IDS, chromium, mirovanje: 900, vzporedno: 6 });
  assert.ok(skupaj >= IDS.length, `preverjenih le ${skupaj} simulacij`);
  assert.deepEqual(napake, [], napake.join("\n"));
  assert.deepEqual(slabi.map((s) => `${s.id} ${JSON.stringify(s.opts)}: ${s.najdbe.join(", ")}`), []);
});

// Grafični kalkulator: med predvajanjem drsnika se seznam osveži vsako sličico. Vrstice s parametrično ali polarno
// krivuljo (polji za meje t in θ) in z napako (»Dodaj drsnike«) so se prej gradile znova vsako sličico.
test("graphing calculator: playing a slider does not rebuild inputs and buttons of other rows", { timeout: 60000 }, async (t) => {
  if (!chromium) return t.skip("Playwright chromium ni nameščen");
  const http = await import("node:http");
  const path = await import("node:path");
  const { OPAZUJ } = require("../scripts/gumbi-na-dotik.cjs");
  const PUB = path.resolve("public");
  const PAGE = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="/style.css"><script>${OPAZUJ}</script><div id="g" style="height:700px"></div>
<script type="module">import { createCalculator } from "/graph/calc.js";
window.calc = createCalculator(document.getElementById("g"), { t: (k) => k, icon: () => "", locale: () => "sl", storageKey: () => "t-calc", studentId: () => "", toast() {}, askTutor() {} });</script>`;
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = path.join(PUB, path.normalize(url));
    let body;
    try {
      if (!file.startsWith(PUB + path.sep)) throw new Error("zunaj");
      body = fs.readFileSync(file);
    } catch {
      return res.writeHead(404).end();
    }
    res.writeHead(200, { "content-type": { ".js": "text/javascript", ".css": "text/css", ".json": "application/json" }[path.extname(file)] || "application/octet-stream" }).end(body);
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  const browser = await chromium.launch();
  try {
    const p = await (await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 1024, height: 1366 }, reducedMotion: "no-preference" })).newPage();
    await p.goto(`http://127.0.0.1:${server.address().port}/t.html`);
    await p.waitForFunction(() => window.calc);
    await p.evaluate(() => window.calc.show(["a = 1", "(a cos(t), sin(t))", "r = a + cos(θ)", "y = a x + c"]));
    await p.waitForTimeout(300);
    assert.equal(await p.locator(".gc-extra .gc-lim[data-dom]").count(), 4, "meje t in θ");
    assert.equal(await p.locator(".gc-extra .gc-chip").count(), 1, "»Dodaj drsnike« pri vrstici z napako");
    const before = await p.locator(".gc-extra .gc-lim[data-dom]").first().elementHandle();
    await p.locator(".gc-play").first().click();
    await p.evaluate(() => ((window.__najdbe = []), (window.__stej = true)));
    await p.waitForTimeout(1000);
    const najdbe = await p.evaluate(() => ((window.__stej = false), window.__najdbe.map((n) => n.opis)));
    assert.equal(await p.locator(".gc-play").first().getAttribute("data-on"), "true", "drsnik teče");
    assert.deepEqual([...new Set(najdbe)], []);
    assert.ok(await before.evaluate((el) => el.isConnected), "polje za mejo ostane isto");
  } finally {
    await browser.close();
    server.close();
  }
});
