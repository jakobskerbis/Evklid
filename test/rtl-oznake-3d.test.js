// AUDIT-057: 3D graf (plot3d.js, Orodja → Analiza) na strani z dir="rtl" (arabščina) je oznake osi pisal od desne
// proti levi (»5−« namesto »−5«). Platno zdaj riše vse besedilo od leve proti desni. Pravi brskalnik (Chromium in
// WebKit, kar je nameščeno).
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
const PAGE = `<!doctype html><html dir="rtl" lang="ar"><meta charset="utf-8"><canvas id="c" style="width:500px;height:400px"></canvas>
<script type="module">
window.texts = [];
const orig = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function (txt, ...rest) {
  window.texts.push([String(txt), this.direction]);
  return orig.call(this, txt, ...rest);
};
import { createPlot3d } from "/graph/plot3d.js";
const c = document.getElementById("c");
c.width = 500;
c.height = 400;
window.p = createPlot3d(c, { f: (x, y) => x * x - y * y, x: [-5, 5], y: [-5, 5], label: (z) => String(z).replace("-", "−") });
window.p.draw();
window.ready = true;
</script>`;
const engines = [];
for (const name of ["chromium", "webkit"]) {
  try {
    if (playwright) engines.push([name, await playwright[name].launch()]);
  } catch {}
}
const skip = engines.length ? false : "Playwright ni nameščen";

test("RTL: oznake 3D grafa od leve proti desni", { skip }, async (t) => {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/stran.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = path.join(PUB, path.normalize(url));
    if (!file.startsWith(PUB) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": file.endsWith(".js") ? "text/javascript" : "application/octet-stream" }).end(fs.readFileSync(file));
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  t.after(async () => {
    for (const [, b] of engines) await b.close();
    server.close();
  });
  for (const [engine, browser] of engines) {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/stran.html`);
    await page.waitForFunction(() => window.ready && window.texts.length > 2);
    const texts = await page.evaluate(() => window.texts);
    assert.equal(await page.evaluate(() => document.documentElement.dir), "rtl", engine);
    assert.ok(texts.some(([s]) => /^[−-]\d/.test(s)), `${engine}: ${texts.map((x) => x[0]).join(" | ")}`);
    assert.deepEqual(texts.filter(([, d]) => d !== "ltr"), [], engine);
    assert.deepEqual(errors, [], engine);
    await page.close();
  }
});
