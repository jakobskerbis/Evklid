// Na zaslonu je vedno vsaj ena klikljiva črka (j, 5. 11.): v dolgi lekciji, kjer se isti pomeni ponavljajo,
// mora oznaka po drsenju preiti na pojavitev, ki je zdaj na zaslonu (public/formula-info.js refreshMarks).
// Pravi brskalnik (Playwright, če je nameščen), telefon 360 × 740 in računalnik 1280 × 800.
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
const NM = path.resolve("node_modules");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html" };
// Lekcija: 80 odstavkov z istima formulama (F = m a, v = s/t), vmes besedilo; drsi ovoj kot v aplikaciji (.view).
const para = (i) => `Odstavek ${i}. Sila je $F = m a$, hitrost pa $v = \\frac{s}{t}$. ${"Besedilo brez formul. ".repeat(12)}`;
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css">
<style>html,body{height:100%;margin:0}body{display:flex;flex-direction:column}#lekcija{flex:1;min-height:0;overflow-y:auto}</style>
<main id="lekcija" class="view narrow"><div id="c"></div></main>
<script src="/vendor/katex/katex.min.js"></script><script src="/vendor/marked/marked.umd.js"></script><script src="/vendor/dompurify/purify.min.js"></script>
<script type="module">
import { createRenderer } from "/rich.js";
import { initFormulaInfo, annotateTex, setFormulaSubject } from "/formula-info.js";
setFormulaSubject("FIZ");
const { renderRich } = createRenderer({ annotate: (tex, o) => annotateTex(tex, undefined, o) });
document.getElementById("c").innerHTML = ${JSON.stringify(Array.from({ length: 80 }, (_, i) => para(i + 1)).join("\n\n"))}.split("\\n\\n").map((p) => "<p>" + renderRich(p) + "</p>").join("");
initFormulaInfo();
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

// Klikljive (ne ponovljene) oznake, ki so ta trenutek na zaslonu.
const onScreen = () =>
  [...document.querySelectorAll('[data-fx][role="button"]:not(.fx-dup)')].filter((el) => {
    const b = el.getBoundingClientRect();
    return b.bottom > 0 && b.top < innerHeight && b.width > 0;
  }).length;

test("na zaslonu je ob drsenju vedno vsaj ena klikljiva črka", { skip }, async (t) => {
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await browser.close();
    server.close();
  });
  for (const vp of [{ width: 360, height: 740 }, { width: 1280, height: 800 }]) {
    const ctx = await browser.newContext({ viewport: vp, isMobile: vp.width < 500, hasTouch: vp.width < 500 });
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(`${base}/t.html`);
    await p.waitForFunction(() => window.ready && document.querySelector("[data-fx][tabindex]"));
    await p.waitForTimeout(100);
    // Ena oznaka na pomen na strani ostane: F, m, a, v, s, t → največ 6 klikljivih na celi strani.
    const total = await p.evaluate(() => document.querySelectorAll('[data-fx][role="button"]:not(.fx-dup)').length);
    assert.ok(total > 0 && total <= 6, `${vp.width}: klikljivih oznak na strani ${total}`);
    const H = await p.$eval("#lekcija", (el) => el.scrollHeight - el.clientHeight);
    assert.ok(H > vp.height * 2, "lekcija je dovolj dolga za drsenje");
    for (const y of [0.25, 0.5, 0.75, 1].map((f) => Math.round(H * f))) {
      await p.$eval("#lekcija", (el, y) => (el.scrollTop = y), y);
      await p.waitForTimeout(250); // drsenje se umiri (120 ms) + sličica
      const n = await p.evaluate(onScreen);
      assert.ok(n >= 1, `${vp.width} px, drsenje ${y}: na zaslonu ni nobene klikljive črke`);
    }
    // Klik na oznako na zaslonu odpre kartico.
    await p.locator('[data-fx][role="button"]:not(.fx-dup)').filter({ visible: true }).last().click();
    assert.ok(await p.locator("#fx-pop:not([hidden])").count(), "klik na oznako odpre kartico");
    assert.deepEqual(errors, []);
    await ctx.close();
  }
});
