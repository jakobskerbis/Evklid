// AUDIT-014: drsnik grafičnega kalkulatorja z zelo majhno vrednostjo (10⁻⁸) je ne zaokroži na 0: korak je sorazmeren
// z velikostjo (model.js sliderRange), vrednost se zapiše s toliko decimalkami, kot jih ima korak (calc.js).
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { sliderRange, sliderText, buildModel, emptyState } from "../public/graph/model.js";

test("sliderRange: korak sorazmeren z velikostjo, majhna vrednost znotraj razpona (AUDIT-014)", () => {
  assert.deepEqual(sliderRange(1e-8), { min: -1e-7, max: 1e-7, step: 1e-9 });
  assert.deepEqual(sliderRange(-3e-8), { min: -1e-7, max: 1e-7, step: 1e-9 });
  assert.deepEqual(sliderRange(0.05), { min: -0.1, max: 0.1, step: 0.001 });
  for (const v of [1e-12, 2.5e-6, 0.004, 0.09, -0.07]) {
    const r = sliderRange(v);
    assert.ok(r.min < v && v < r.max, `${v} znotraj razpona`);
    assert.ok(r.step <= Math.abs(v) / 5, `${v}: korak ${r.step}`);
    assert.equal(Math.round(v / r.step) * r.step !== 0, true, `${v} ne postane 0`);
  }
  // običajne vrednosti kot prej
  assert.deepEqual(sliderRange(0), { min: -10, max: 10, step: 0.1 });
  assert.deepEqual(sliderRange(2), { min: -10, max: 10, step: 0.1 });
  assert.deepEqual(sliderRange(0.1), { min: -10, max: 10, step: 0.1 });
  assert.deepEqual(sliderRange(100), { min: -100, max: 100, step: 1 });
  assert.deepEqual(sliderRange(12345), { min: -100000, max: 100000, step: 1000 });
});

test("sliderText: zapis, ki ga kalkulator spet prebere kot drsnik, nikoli 0 ali z e (AUDIT-014)", () => {
  assert.equal(sliderText(1e-8, 1e-9), "0.00000001");
  assert.equal(sliderText(3e-8, 1e-9), "0.00000003");
  assert.equal(sliderText(1e-12, 1e-15), "0.000000000001");
  assert.equal(sliderText(0.1 + 0.2, 0.1), "0.3");
  assert.equal(sliderText(-2.5, 0.1), "-2.5");
  assert.equal(sliderText(0, 0.1), "0");
  for (const v of [1e-8, 3e-8, 1e-12, 4.2e-6, 12345]) {
    const st = { ...emptyState(), items: [{ id: "a", type: "expr", text: `a = ${sliderText(v, sliderRange(v).step / 100)}` }] };
    const o = buildModel(st).items[0];
    assert.equal(o.kind, "slider", `${v}: ${st.items[0].text}`);
    assert.ok(Math.abs(o.value - v) <= Math.abs(v) * 1e-9, `${v} → ${o.value}`);
  }
  // okno grafa v klepetu (odpri.js) zapiše vrednost s sliderText, ne String(v) (»3e-8« = 3·e − 8)
  const odpri = readFileSync(new URL("../public/odpri.js", import.meta.url), "utf8");
  assert.match(odpri, /it\.text = `\$\{o\.name\} = \$\{sliderText\(v, r\.step\)\}`/);
  assert.doesNotMatch(odpri, /it\.text = `\$\{o\.name\} = \$\{v\}`/);
});

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}
const PUB = path.resolve("public");
const KX = path.resolve("node_modules/katex/dist");
const PAGE = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/graph.css"><script src="/vendor/katex/katex.min.js"></script><div id="g" style="height:700px"></div>
<script type="module">
import { createCalculator } from "/graph/calc.js";
localStorage.clear();
window.calc = createCalculator(document.getElementById("g"), { t: (k) => k, icon: () => "", locale: () => "sl", storageKey: () => "t-calc", studentId: () => "", toast() {}, askTutor() {} });
window.ready = true;
</script>`;
// brskalnik se zažene v testu: CI teče s --test-force-exit, ki konča proces, preden bi se zagnal na vrhu datoteke
test("drsnik 10⁻⁸ v brskalniku: premik desno in levo vrne 10⁻⁸, nikoli 0 (AUDIT-014)", { timeout: 300000 }, async (t) => {
  let browser = null;
  try {
    if (playwright) browser = await playwright.chromium.launch();
  } catch {}
  if (!browser) return t.skip("Playwright/Chromium ni nameščen");
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = url.startsWith("/vendor/katex/") ? path.join(KX, url.slice(14)) : path.join(PUB, path.normalize(url));
    if (!(file.startsWith(PUB) || file.startsWith(KX)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : "application/octet-stream" }).end(fs.readFileSync(file));
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  t.after(async () => {
    await browser.close();
    server.close();
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/t.html`);
  await page.waitForFunction(() => window.ready);
  const text = () => page.evaluate(() => window.calc.state.items[0].text);
  for (const [start, after] of [["a = 0.00000001", "a = 0.00000001"], ["b = 0.000004", "b = 0.000004"], ["c = 0.05", "c = 0.05"], ["d = 2", "d = 2"]]) {
    await page.evaluate((s) => window.calc.show([s]), start);
    await page.waitForTimeout(100);
    await page.focus(".gc-range");
    await page.keyboard.press("ArrowRight");
    assert.notEqual(await text(), start, `${start}: drsnik se premakne`);
    assert.doesNotMatch(await text(), /= -?0$/, `${start}: ne postane 0`);
    await page.keyboard.press("ArrowLeft");
    assert.equal(await text(), after, `${start}: desno in levo vrne vrednost`);
  }
  // predvajanje (Play): vrednost ostane majhna in različna od 0, ne skoči na 0 in tam obstane
  for (const start of ["a = 0.00000001", "a = 0.000000000001", "a = 0.001"]) {
    await page.evaluate((s) => window.calc.show([s]), start);
    await page.waitForTimeout(100);
    await page.click(".gc-play");
    await page.waitForTimeout(600);
    await page.click(".gc-play");
    const txt = await text();
    const v = Number(txt.split("=")[1]);
    const v0 = Number(start.split("=")[1]);
    assert.ok(Number.isFinite(v) && v !== 0, `${start}: po predvajanju ${txt}`);
    assert.ok(Math.abs(v) <= Math.abs(v0) * 10 + 1e-15, `${start}: v razponu ${txt}`);
    assert.doesNotMatch(txt, /e/i, `${start}: brez zapisa z e`);
  }
  assert.deepEqual(errors, []);
});
