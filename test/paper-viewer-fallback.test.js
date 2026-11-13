// Rezerva pregledovalnika prenesene pole (public/paper-viewer.js): če se pdf.js ne naloži (starejši brskalnik, napaka
// uvoza), učenec dobi sporočilo in delujočo povezavo »Odpri PDF«; običajna pot z delujočim pdf.js je nespremenjena.
// Playwright (če je nameščen), telefon 360 × 740.
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
const { tinyPdf, SAMPLE } = require("./fixtures/tiny-pdf.cjs");

const PUB = path.resolve("public");
const PDFJS = path.resolve("node_modules/pdfjs-dist");
const TYPES = { ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html" };
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/competition.css">
<script type="module">
import { openPaperViewer } from "/paper-viewer.js";
window.odpri = (b64) => openPaperViewer(new File([Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))], "pola.pdf", { type: "application/pdf" }), { title: "Pola", onHelp() {}, onClose() {} });
window.ready = true;
</script>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const base = url.startsWith("/vendor/pdfjs/") ? PDFJS : PUB;
    const file = path.join(base, path.normalize(url.startsWith("/vendor/pdfjs/") ? url.slice("/vendor/pdfjs/".length) : url));
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
const b64 = tinyPdf(SAMPLE).toString("base64");

test("pdf.js se ne naloži: sporočilo in povezava »Odpri PDF« na isto datoteko; ob uspehu rezerve ni", { skip }, async (t) => {
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await browser.close();
    server.close();
  });
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
  // 1) uvoz pdf.js vrže napako
  const bad = await ctx.newPage();
  await bad.route("**/vendor/pdfjs/legacy/build/pdf.min.mjs", (r) => r.abort());
  await bad.goto(`${base}/t.html`);
  await bad.waitForFunction(() => window.ready);
  await bad.evaluate((d) => window.odpri(d), b64);
  const link = bad.locator(".pv .pv-fb-open");
  await link.waitFor({ timeout: 15000 });
  const href = await link.getAttribute("href");
  assert.match(href, /^blob:/);
  assert.equal(await link.getAttribute("target"), "_blank");
  assert.ok((await link.boundingBox()).height >= 40, "gumb je vsaj 40 px visok");
  assert.equal(await bad.locator(".pv .pv-page canvas").count(), 0);
  const head = await bad.evaluate(async (h) => (await (await fetch(h)).text()).slice(0, 5), href);
  assert.equal(head, "%PDF-", "povezava vodi na izbrano datoteko");
  assert.equal(await bad.locator(".pv-status").innerText(), "", "sporočilo ni podvojeno v statusni vrstici");
  assert.equal(await bad.locator(".pv-fallback p").count(), 1);
  // 1b) Evklidova aplikacija (WebView): samo sporočilo, brez gumba (blob: PDF bi odprl prazen zaslon)
  const appCtx = await browser.newContext({ viewport: { width: 360, height: 740 }, userAgent: "Mozilla/5.0 (Linux; Android 13) EvklidApp/1.0 Chrome/120" });
  const app = await appCtx.newPage();
  await app.route("**/vendor/pdfjs/legacy/build/pdf.min.mjs", (r) => r.abort());
  await app.goto(`${base}/t.html`);
  await app.waitForFunction(() => window.ready);
  await app.evaluate((d) => window.odpri(d), b64);
  await app.locator(".pv .pv-fallback p").waitFor({ timeout: 15000 });
  assert.equal(await app.locator(".pv-fb-open").count(), 0, "v aplikaciji ni gumba »Odpri PDF«");
  // 2) običajna pot: izris, brez rezerve
  const good = await ctx.newPage();
  await good.goto(`${base}/t.html`);
  await good.waitForFunction(() => window.ready);
  await good.evaluate((d) => window.odpri(d), b64);
  await good.waitForSelector(".pv .pv-page canvas[width]:not([width='0'])", { timeout: 15000 });
  assert.equal(await good.locator(".pv .pv-task").count(), 2, "najdeni nalogi");
  await good.waitForTimeout(500);
  assert.equal(await good.locator(".pv-fb-open").count(), 0);
});
