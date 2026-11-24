// AUDIT-003 (pregled #940): dotik ali klik na sredino vidnega znaka zapisa postavi kazalec ob ta znak – tudi v števcu
// ulomka, eksponentu, indeksu, mejah ∫ in ∑, pod lim. Točke dotika so iz izrisanega zapisa (okvirji znakov v
// .katex-html), ne iz merilnih točk kalkulatorja, zato test ujame tudi napako v preslikavi. Chromium (Android) klik ob
// dotiku premakne za ~8 px: preverimo tudi klik, ki je ±10 px stran od točke dotika (pointerdown).
// Brskalnik se zažene v testu (CI teče s --test-force-exit).
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { entryBase, caretTex, analyzeLive, liveTex } from "../public/graph/sci-vnos.js";

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

const env = { vars: {}, funcs: {}, ans: 0, deg: true, grad: false, comma: true };
// zapis kot v kalkulatorju (sci.js showEntry)
function appBase(t) {
  let r = null;
  try {
    r = analyzeLive(t, env);
  } catch {}
  return entryBase(t, env, (s) => (s === t && r && !r.error && r.tex ? r.tex : liveTex(s, env)));
}
// ulomki (števec/imenovalec), potence, indeksi, meje ∫ in ∑, lim, gnezdeno
const EXPR = ["(4+5)/(6−1)", "3/(4+√(9))", "1/(1/2+3)", "2^(10)+7", "x_(5)+2", "∫(x²;0;2)", "∫(x;−1;π)", "∑_(n=1)^(5) n", "limita(sin(x)/x; x; 0)", "d/dx(x³;2)", "√(x²+7)"];

for (const engine of ["chromium", "webkit", "firefox"]) {
  for (const [vw, opt] of [
    ["1280", { viewport: { width: 1280, height: 800 } }],
    ["360", { viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: engine === "firefox" ? undefined : true }],
  ]) {
    test(`${engine} ${vw}: dotik na sredino znaka postavi kazalec ob znak (AUDIT-003)`, { timeout: 300000 }, async (t) => {
      let browser = null;
      try {
        browser = playwright && (await playwright[engine].launch());
      } catch {}
      if (!browser) return t.skip(`${engine} ni nameščen`);
      const server = await serve();
      t.after(async () => {
        await browser.close();
        server.close();
      });
      const page = await (await browser.newContext(opt)).newPage();
      await page.goto(`http://127.0.0.1:${server.address().port}/t-sci.html`);
      await page.waitForFunction(() => window.ready);
      await page.evaluate(() => Promise.all([...document.fonts].filter((f) => /KaTeX/.test(f.family)).map((f) => f.load().catch(() => {}))));
      const set = (text, p) =>
        page.evaluate(([text, p]) => {
          const i = document.querySelector(".sc-input");
          i.focus({ preventScroll: true });
          i.value = text;
          i.dispatchEvent(new Event("input"));
          i.setSelectionRange(p, p);
          i.dispatchEvent(new KeyboardEvent("keyup"));
        }, [text, p]);
      const settle = () => page.evaluate(() => new Promise((r) => setTimeout(() => setTimeout(r, 0), 0)));
      const caret = () => page.evaluate(() => document.querySelector(".sc-input").selectionStart);
      let checked = 0;
      for (const ex of EXPR) {
        const base = appBase(ex);
        await set(ex, ex.length);
        const glyphs = await page.evaluate(() => {
          const root = document.querySelector(".sc-preview .katex-html");
          const out = [];
          const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
          for (let n; (n = w.nextNode()); ) {
            if (n.parentElement.closest(".sc-caret, .sc-hole")) continue;
            for (let k = 0; k < n.data.length; k++) {
              if (!n.data[k].trim() || n.data[k] === "​") continue;
              const r = document.createRange();
              r.setStart(n, k);
              r.setEnd(n, k + 1);
              const b = r.getBoundingClientRect();
              if (b.width >= 1) out.push({ ch: n.data[k], x: b.left + b.width / 2, y: b.top + b.height / 2 });
            }
          }
          return out;
        });
        // samo znaki, ki so v besedilu in v zapisu natanko enkrat: tam je pravo mesto kazalca enolično
        const count = (arr, c) => arr.filter((x) => x === c).length;
        for (const g of glyphs) {
          // oklepaji so v zapisu lahko drugje kot v besedilu (d/dx(x³;2): zaklepaj pred »|«), zato samo števke, črke, operatorji
          if (/[()[\]|]/.test(g.ch) || count([...ex], g.ch) !== 1 || count(glyphs.map((x) => x.ch), g.ch) !== 1) continue;
          const i = [...ex].indexOf(g.ch);
          // črka imena funkcije (»sin«): z #945 kazalec ne sme v ime, zato je prav tudi mesto pred imenom ali za oklepajem
          const word = /[A-Za-zčšž]{2,}(?=\s*\()/g;
          let inName = null;
          for (const m of ex.matchAll(word)) if (m.index <= i && i < m.index + m[0].length) inName = m;
          const want = new Set([caretTex(base, i), caretTex(base, i + 1), ...(inName ? [caretTex(base, inName.index), caretTex(base, ex.indexOf("(", inName.index) + 1)] : [])]);
          const shots = [["dotik", 0]];
          if (opt.hasTouch && engine === "chromium") shots.push(["klik +10 px", 10], ["klik −10 px", -10]);
          for (const [how, dy] of shots) {
            await set(ex, 0);
            if (dy) {
              // točka dotika (pointerdown) na znaku, klik premaknjen kot ob prilagoditvi dotika
              await page.evaluate(([x, y, dy]) => {
                const inp = document.querySelector(".sc-input");
                inp.dispatchEvent(new PointerEvent("pointerdown", { clientX: x, clientY: y, bubbles: true, pointerType: "touch" }));
                inp.dispatchEvent(new MouseEvent("click", { clientX: x, clientY: y + dy, bubbles: true, detail: 1 }));
              }, [g.x, g.y, dy]);
            } else if (opt.hasTouch) await page.touchscreen.tap(g.x, g.y);
            else await page.mouse.click(g.x, g.y);
            await settle();
            const p = await caret();
            assert.ok(want.has(caretTex(base, p)), `${engine} ${vw} ${ex}: ${how} na »${g.ch}« → kazalec @${p} (pričakovano ob @${i})`);
            checked++;
          }
        }
      }
      assert.ok(checked >= 40, `preverjenih ${checked}`);
      t.diagnostic(`${engine} ${vw}: ${checked} dotikov`);
    });
  }
}
