// AUDIT-039: izbira (Shift+puščica, vlečenje), ki zajame le del predloge, se pri ⌫, Delete ali tipkanju razširi na celo
// predlogo: ne ostane »;0;1)« (prej surovo besedilo).
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { selectionSpan, backspace, deleteForward, entryBase } from "../public/graph/sci-vnos.js";

const env = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
test("selectionSpan: izbira v eni reži ostane, čez mejo predloge se razširi (AUDIT-039)", () => {
  assert.deepEqual(selectionSpan("∫(x;0;1)", 0, 3), [0, 8]);
  assert.deepEqual(selectionSpan("∫(x;0;1)", 2, 5), [0, 8]);
  assert.deepEqual(selectionSpan("∫(x²+1;0;1)", 2, 4), [2, 4]);
  assert.deepEqual(selectionSpan("sin(30)+2", 2, 6), [0, 7]);
  assert.deepEqual(selectionSpan("2+(3+4)·5", 0, 4), [0, 7]);
  assert.deepEqual(selectionSpan("2+3", 0, 1), [0, 1]);
  for (const [t, s, e] of [["∫(x;0;1)", 0, 3], ["∫(x;0;1)", 3, 8], ["d/dx(x³;2)", 2, 7], ["limita(x; x; 0)", 0, 9], ["√(2)+1", 1, 3], ["det([[1; 2]; [3; 4]])", 5, 12]]) {
    for (const fn of [backspace, deleteForward]) {
      const r = fn(t, s, e);
      assert.ok(!r.text.trim() || entryBase(r.text, env)?.ok, `${t} [${s},${e}) ${fn.name} → ${r.text}`);
    }
  }
});

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

const PUB = path.resolve("public");
const KX = path.resolve("node_modules/katex/dist");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/graph.css"><script src="/vendor/katex/katex.min.js"></script><div id="s" style="height:700px"></div>
<script type="module">
import { createScientific } from "/graph/sci.js";
localStorage.clear();
window.sci = createScientific(document.getElementById("s"), { t: (k) => k, icon: () => "", locale: () => "sl", storageKey: () => "t-sci", toast() {}, canSteps: () => false });
window.ready = true;
</script>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/t-sci.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = url.startsWith("/vendor/katex/") ? path.join(KX, url.slice(14)) : path.join(PUB, path.normalize(url));
    if (!(file.startsWith(PUB) || file.startsWith(KX)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

const engines = [];
for (const name of ["chromium", "webkit", "firefox"]) {
  try {
    if (playwright) engines.push([name, await playwright[name].launch()]);
  } catch {}
}
const skip = engines.length ? false : "Playwright ni nameščen";


test("Shift+puščica čez del predloge, nato ⌫ ali tipka: brez ostankov (AUDIT-039)", { skip }, async (t) => {
  const server = await serve();
  t.after(async () => {
    for (const [, b] of engines) await b.close();
    server.close();
  });
  for (const [engine, browser] of engines) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`http://127.0.0.1:${server.address().port}/t-sci.html`);
    await page.waitForFunction(() => window.ready);
    const start = (text, p) =>
      page.evaluate(([text, p]) => {
        const i = document.querySelector(".sc-input");
        i.focus();
        i.value = text;
        i.dispatchEvent(new Event("input"));
        i.setSelectionRange(p, p);
      }, [text, p]);
    const state = () => page.evaluate(() => ({ v: document.querySelector(".sc-input").value, raw: !!document.querySelector(".sc-preview .text, .sc-preview .katex-error, .sc-preview .mat-napaka") }));
    for (const key of ["Backspace", "Delete", "7"]) {
      await start("∫(x;0;1)", 0);
      for (let k = 0; k < 3; k++) await page.keyboard.press("Shift+ArrowRight");
      await page.keyboard.press(key);
      const s = await state();
      assert.equal(s.v, key === "7" ? "7" : "", `${engine} ${key}: ${s.v}`);
      assert.ok(!s.raw, `${engine} ${key}: izrisano`);
    }
    await page.close();
  }
});
