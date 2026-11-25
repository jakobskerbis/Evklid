// AUDIT-067 (j, evklid.app, Android, 24. 11. 2026): v prazen integrand ∫(□;0;1) je tipka xʸ vstavila »^(«, ki je požrl
// ločili in meje integrala: zapis ∫_□^□ □^{(□; 0; 1)} dx (surova ločila, pomen uničen). Pravi brskalnik, stran s
// kalkulatorjem, 1280 px z miško in 360 px z dotikom; tipke predlog v režah predlog. Brskalnik se zažene v testu.
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


// [vnos, kazalec, tipka (data-ins), pričakovan vnos ali null = tipka se ne zgodi]
const CASES = [
  ["∫(;0;1)", 2, "^(", "∫(^();0;1)"], // j, evklid.app 24. 11. 2026: prej ∫_□^□ □^{(□; 0; 1)} dx
  ["∫(;0;1)", 2, "√(", "∫(√();0;1)"],
  ["∫(;0;1)", 2, "sin(", "∫(sin();0;1)"],
  ["∫(;0;1)", 2, "×10^(", "∫(×10^();0;1)"],
  ["∫(;0;1)", 2, "²", "∫(²;0;1)"],
  ["∫(x;0;1)", 2, "sin(", "∫(sin(x);0;1)"],
  ["∫(x;0;1)", 3, "^(", "∫(x^();0;1)"],
  ["∫(x;0;1)", 5, "√(", "∫(x;0√();1)"],
  ["nCr(5;2)", 4, "√(", "nCr(√(5);2)"],
  ["∫(;0;1)", 2, ";", "∫(;0;1)"], // ∫ ima tri reže: ; gre v naslednjo režo
  ["sin(x)", 5, ";", null],
];
for (const engine of ["chromium", "webkit", "firefox"]) {
  for (const [vw, opt] of [
    ["1280", { viewport: { width: 1280, height: 800 } }],
    ["360", { viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: engine === "firefox" ? undefined : true }],
  ]) {
    test(`${engine} ${vw}: tipka predloge v reži ne pokvari zunanje predloge (AUDIT-067)`, { timeout: 300000 }, async (t) => {
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
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`http://127.0.0.1:${server.address().port}/t-sci.html`);
      await page.waitForFunction(() => window.ready);
      for (const [text, p, ins, want] of CASES) {
        await page.evaluate(([text, p]) => {
          const i = document.querySelector(".sc-input");
          i.focus({ preventScroll: true });
          i.value = text;
          i.dispatchEvent(new Event("input"));
          i.setSelectionRange(p, p);
          i.dispatchEvent(new KeyboardEvent("keyup"));
        }, [text, p]);
        const key = page.locator(`.sc-key[data-ins="${ins}"]`).first();
        // WebKit (Playwright) dotik na tipko ne sproži klika: kot v matriki, klik
        if (opt.hasTouch && engine !== "webkit") await key.tap();
        else await key.click();
        await page.evaluate(() => new Promise((r) => setTimeout(r, 30)));
        const s = await page.evaluate(() => {
          const prev = document.querySelector(".sc-preview");
          return { v: document.querySelector(".sc-input").value, shown: prev.textContent, raw: !!prev.querySelector(".text, .katex-error") };
        });
        const where = `${engine} ${vw} ${text} @${p} ${ins}`;
        assert.equal(s.v, want ?? text, `${where}: vnos`);
        assert.ok(!s.raw && !s.shown.includes(";"), `${where}: surov zapis ${JSON.stringify(s)}`);
        // meje integrala ostanejo vidne
        if (text.startsWith("∫(") && text.endsWith(";0;1)")) assert.match(s.shown, /∫\s*1\s*0|∫.*1.*0/su, `${where}: meje ${JSON.stringify(s.shown)}`);
      }
      // pregled #1017: zaporedja z lastnimi oklepaji in ; (zaslonske tipke; »kb:« = tipkovnica)
      for (const [keys, want] of [
        [["∫(@;;)", "(", "x", "+", "1", ")"], "∫((x+1);;)"],
        [["∫(@;;)", "(", "x", "+", "1", ")", "×", "2"], "∫((x+1)×2;;)"],
        [["d/dx(@)", "sin(", "x", ")", ";"], "d/dx(sin(x);)"],
        [["∫(@;;)", "x", ";", "0", ";", "1"], "∫(x;0;1)"],
        [["∫(@;;)", "x", "kb:;", "0", "kb:;", "1"], "∫(x;0;1)"],
        [["∫(@;;)", "kb:(", "x", "+", "1", "kb:)"], "∫((x+1);;)"],
      ]) {
        await page.evaluate(() => {
          const i = document.querySelector(".sc-input");
          i.focus({ preventScroll: true });
          i.value = "";
          i.dispatchEvent(new Event("input"));
        });
        for (const k of keys) {
          if (k.startsWith("kb:")) await page.keyboard.type(k.slice(3));
          else {
            const key = page.locator(`.sc-key[data-ins="${k}"]`).first();
            if (opt.hasTouch && engine !== "webkit") await key.tap();
            else await key.click();
          }
        }
        await page.evaluate(() => new Promise((r) => setTimeout(r, 30)));
        const s = await page.evaluate(() => {
          const prev = document.querySelector(".sc-preview");
          return { v: document.querySelector(".sc-input").value, shown: prev.textContent, raw: !!prev.querySelector(".text, .katex-error"), caret: !!prev.querySelector(".sc-caret") };
        });
        const where = `${engine} ${vw} ${keys.join(" ")}`;
        assert.equal(s.v, want, `${where}: vnos`);
        assert.ok(!s.raw && !s.shown.includes(";") && s.caret, `${where}: zapis ${JSON.stringify(s)}`);
      }
      assert.deepEqual(errors, [], `${engine} ${vw}: napake na strani`);
    });
  }
}
