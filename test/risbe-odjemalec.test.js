// Risbe skozi pravi odjemalčev izris (pregled PR #559, D): lekcija gre v brskalniku skozi rich.js (marked + DOMPurify)
// kot v aplikaciji. SVG mora ostati cel (iste oznake, atributi za dostopnost in barve brez CSS), odstavek tik pod
// blokom ostane odstavek, napisi pa podedujejo pisavo besedila lekcije. Playwright (če je nameščen).
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { expandFormulaBlocks } from "../server/textbook.js";

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

const PUB = path.resolve("public");
const NM = path.resolve("node_modules");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html" };

const MD = [
  "Pred sliko.",
  ":::risba graf",
  "opis: Graf kvadratne funkcije s točko T v koordinatnem sistemu.",
  "x: -2 .. 2",
  "y: -1 .. 4",
  "f: x^2",
  "točka: 1; 1 | T_1 | desno",
  "napis: -1; 3 | 10^-3 | sredina",
  ":::",
  "Za sliko **krepko**.",
].join("\n");
const HTML = expandFormulaBlocks(MD, "html");
const count = (html, tag) => (html.match(new RegExp(`<${tag}\\b`, "g")) || []).length;
const TAGS = ["svg", "title", "line", "polyline", "polygon", "circle", "path", "text", "tspan"];

const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/risbe.css">
<div id="lekcija"></div>
<script src="/vendor/katex/katex.min.js"></script><script src="/vendor/marked/marked.umd.js"></script><script src="/vendor/dompurify/purify.min.js"></script>
<script type="module">
import { createRenderer } from "/rich.js";
const { renderRich } = createRenderer();
document.getElementById("lekcija").innerHTML = renderRich(${JSON.stringify(HTML).replace(/</g, "\\u003c")});
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

test("risba v brskalniku: DOMPurify ohrani SVG, odstavek pod blokom, pisava lekcije", { skip }, async (t) => {
  const server = await serve();
  t.after(async () => {
    await browser.close();
    server.close();
  });
  const p = await browser.newPage({ viewport: { width: 360, height: 740 } });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(`http://127.0.0.1:${server.address().port}/t.html`);
  await p.waitForFunction(() => window.ready);
  const r = await p.evaluate((tags) => {
    const root = document.getElementById("lekcija");
    const svg = root.querySelector("figure.risba > svg.rs");
    const text = svg?.querySelector("text");
    const after = svg?.closest("figure").nextElementSibling;
    return {
      counts: Object.fromEntries(tags.map((t) => [t, root.getElementsByTagName(t).length])),
      attrs: svg && ["role", "aria-label", "fill", "stroke", "viewBox"].map((a) => svg.getAttribute(a)),
      tspan: [...root.querySelectorAll("tspan.rs-i")].map((e) => [e.textContent, e.getAttribute("dy")]),
      after: after && [after.tagName, after.innerHTML],
      before: svg?.closest("figure").previousElementSibling?.tagName,
      font: text && [getComputedStyle(text).fontFamily, getComputedStyle(root.querySelector("p")).fontFamily],
      width: svg?.getBoundingClientRect().width,
    };
  }, TAGS);
  assert.deepEqual(errors, []);
  for (const tag of TAGS) assert.equal(r.counts[tag], count(HTML, tag), `<${tag}> ostane po DOMPurify`);
  assert.deepEqual(r.attrs, ["img", "Graf kvadratne funkcije s točko T v koordinatnem sistemu.", "none", "currentColor", HTML.match(/viewBox="([^"]+)"/)[1]]);
  assert.deepEqual(r.tspan.map((x) => x[0]), ["1", "−3"]);
  assert.ok(r.tspan.every((x) => x[1] !== null), "dy ostane");
  assert.deepEqual(r.after, ["P", "Za sliko <strong>krepko</strong>."]);
  assert.equal(r.before, "P");
  assert.equal(r.font[0], r.font[1], "napisi risbe podedujejo pisavo besedila");
  assert.ok(r.width > 200 && r.width <= 360, `širina risbe na telefonu ${r.width}`);
});
