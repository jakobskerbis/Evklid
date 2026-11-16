// Dostopnost (iskalec napak 7): ime gumba izbirnika in kontrast besedila na javnih straneh.
// - dropdown.js: <label>Jezik <select>…</select></label> je dal gumbu ime iz celotnega textContent oznake, torej z
//   vsemi možnostmi (prvi zaslon: ~100 imen jezikov in vse države kot ime enega gumba za bralnik zaslona).
// - tisk učbenika in povzetka: modra #2f6fed na #f3f6fc (oznaka »Formula«, naslov »Formule«) = 4,2 : 1 < 4,5 (AA).
// - stran za starše in ikona nagrade v temnem načinu: belo na #6e9bff = 2,7 : 1.
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { shell } from "../server/textbook-print.js";
import { summaryPage } from "../server/gradiva.js";

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}
const PUB = path.resolve("public");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html" };
const PAGE = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css">
<label class="lang-field"><span class="sr-only">Jezik aplikacije</span>
  <select id="jezik">${Array.from({ length: 40 }, (_, i) => `<option>Jezik ${i}</option>`).join("")}</select></label>
<label for="drzava">Država</label><select id="drzava"><option>Slovenija</option><option>Hrvatska</option></select>
<select id="ime" aria-label="Lastno ime"><option>A</option></select>
<script type="module">import "/dropdown.js"; window.ready = true;</script>`;

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

test("izbirnik: ime gumba je samo besedilo oznake, brez možnosti", { skip }, async (t) => {
  const server = await serve();
  t.after(async () => {
    await browser.close();
    server.close();
  });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/t.html`);
  await page.waitForFunction(() => window.ready && document.querySelectorAll(".dd-btn").length === 3);
  const names = await page.$$eval(".dd-btn", (bs) => bs.map((b) => b.getAttribute("aria-label")));
  assert.deepEqual(names, ["Jezik aplikacije", "Država", "Lastno ime"]);
});

const lum = (h) => {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const colorOf = (css, sel, prop = "color") => new RegExp(`${sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{[^}]*?(?<![-\\w])${prop}:\\s*(#[0-9a-f]{6})`, "i").exec(css)?.[1];

test("tisk: modro besedilo na svetlem ozadju ima kontrast vsaj 4,5 : 1", () => {
  const css = shell("t", "");
  const formulaBg = colorOf(css, ".formula", "background");
  assert.ok(formulaBg, "ozadje .formula");
  for (const sel of [".formula-label", ".sheet h2", ".demo-note"]) {
    const c = colorOf(css, sel);
    assert.ok(c, sel);
    assert.ok(ratio(c, "#ffffff") >= 4.5, `${sel} ${c} na belem`);
  }
  assert.ok(ratio(colorOf(css, ".formula-label"), formulaBg) >= 4.5, `oznaka Formula na ${formulaBg}`);
  const sum = summaryPage("FIZ-OS-9/newtonovi-zakoni");
  if (sum) {
    const h2 = colorOf(sum, ".one h2");
    const fbox = colorOf(sum, ".fbox", "background");
    assert.ok(h2 && ratio(h2, "#ffffff") >= 4.5, `.one h2 ${h2}`);
    if (fbox) assert.ok(ratio(h2, fbox) >= 4.5, `naslov Formule ${h2} na ${fbox}`);
  }
});

test("poudarjen gumb na strani za starše in ikona nagrade: barva besedila iz --accent-text (temni način)", () => {
  const starsi = fs.readFileSync(path.join(PUB, "starsi.html"), "utf8");
  assert.match(starsi, /\.cta \{[^}]*background: var\(--accent\); color: var\(--accent-text\)/);
  assert.doesNotMatch(starsi, /a\.cta \{ color: #fff/);
  const style = fs.readFileSync(path.join(PUB, "style.css"), "utf8");
  assert.match(style, /\.reward-ic \{[^}]*color: var\(--accent-text\)/);
  // --accent-text v temni temi da kontrast ≥ 4,5 z --accent.
  const dark = /:root\.dark \{[^}]*?--accent: (#[0-9a-f]{6});[^}]*?--accent-text: (#[0-9a-f]{6})/i.exec(style);
  assert.ok(dark && ratio(dark[1], dark[2]) >= 4.5, String(dark?.slice(1)));
});
