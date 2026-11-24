// AUDIT-005 v pravem brskalniku (Playwright, če je nameščen): tipkovnica grafičnega kalkulatorja v slovenskem
// zapisu ima »;« in decimalno »,«; ob menjavi zapisa med sejo se tipke in besedila vrstic posodobijo (pomen ostane).
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
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html" };
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/graph.css"><link rel="stylesheet" href="/tipkovnica.css"><div id="g" style="height:600px"></div>
<script type="module">
import { createCalculator } from "/graph/calc.js";
window.loc = "sl";
localStorage.setItem("t-tipke", JSON.stringify({ zapis: 2, vejica: true, items: [{ id: "a", type: "expr", text: "y = max(1,5; 2)" }] }));
window.calc = createCalculator(document.getElementById("g"), { t: (k) => k, icon: () => "", locale: () => window.loc, storageKey: () => "t-tipke", studentId: () => "", toast() {}, askTutor() {} });
window.ready = true;
</script>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = path.join(PUB, path.normalize(url));
    if (!file.startsWith(PUB) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

let browser = null;
try {
  if (playwright) browser = await playwright.chromium.launch();
} catch {}
const skip = browser ? false : "Playwright/Chromium ni nameščen";

test("tipkovnica in besedila grafičnega kalkulatorja sledijo zapisu (vejica ↔ pika)", { skip }, async (t) => {
  const server = await serve();
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  t.after(async () => {
    await ctx.close();
    await browser.close();
    server.close();
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/t.html`);
  await page.waitForFunction(() => window.ready, null, { timeout: 8000 }).catch((e) => assert.fail(`${e.message}: ${errors.join("; ")}`));
  const keys = () => page.evaluate(() => [...document.querySelectorAll("#tipkovnica .tk-k")].map((b) => b.firstChild?.textContent));
  await page.tap(".gc-math");
  await page.waitForSelector("#tipkovnica:not([hidden])");
  let k = await keys();
  assert.ok(k.includes(";") && k.includes(",") && !k.includes("."), `slovenski zapis: ${k.join(" ")}`);
  // zapis se med sejo spremeni (jezik s piko): besedilo z enakim pomenom, tipke s piko
  await page.tap("#tipkovnica .tk-hide");
  await page.evaluate(() => {
    window.loc = "en";
    document.activeElement?.blur();
    window.calc.refresh();
  });
  assert.equal(await page.inputValue(".gc-input"), "y = max(1.5; 2)");
  await page.tap(".gc-math");
  await page.waitForSelector("#tipkovnica:not([hidden])");
  k = await keys();
  assert.ok(k.includes(",") && k.includes(".") && !k.includes(";"), `zapis s piko: ${k.join(" ")}`);
  assert.equal(await page.evaluate(() => window.calc.state.vejica), false);
  assert.deepEqual(errors, []);
});
