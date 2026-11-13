// Točka A3: besedilo od modela in učencev (public/rich.js renderRich) ne naloži slike z druge strani, nima slogov
// (style z url()), obrazcev, polj in gumbov. Povezave in lastne slike ostanejo. Preverjeno v Chromiumu s pravim DOMPurify.
// Zagon: node --test test/rich-strogo.test.js (brez Playwrighta se preskoči; PLAYWRIGHT=<pot do paketa>).
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const require = createRequire(import.meta.url);
let playwright = null;
for (const p of ["playwright", process.env.PLAYWRIGHT, "/opt/npm-tools/node_modules/playwright", "/opt/node22/lib/node_modules/playwright"].filter(Boolean)) {
  try {
    playwright = require(p);
    break;
  } catch {}
}

const NAPAD = [
  "Poglej sliko: ![x](https://napadalec.example/sled.png) in <img src=\"https://napadalec.example/a.png\" srcset=\"https://napadalec.example/b.png 2x\">",
  "<img src=\"//napadalec.example/c.png\"> <img src=\"/icons/icon-192.png\"> <img src=\"data:image/png;base64,iVBORw0KGgo=\">",
  "<p style=\"background:url(https://napadalec.example/d.png)\">slog</p><style>body{background:url(https://napadalec.example/e.png)}</style>",
  "<form action=\"https://napadalec.example/f\"><input name=\"geslo\" placeholder=\"Geslo\"><button>Prijava</button></form><textarea>t</textarea><select><option>o</option></select>",
  "<svg><image href=\"https://napadalec.example/g.png\"/></svg> <video poster=\"https://napadalec.example/h.png\"><source src=\"https://napadalec.example/i.mp4\"></video>",
  "<table background=\"https://napadalec.example/j.png\"><tr><td>c</td></tr></table>",
  "[povezava](https://sl.wikipedia.org/wiki/Evklid) in $x^2$",
].join("\n\n");

test("A3: renderRich odstrani zunanje slike, sloge in obrazce; povezave in lastne slike ostanejo", { skip: playwright ? false : "Playwright ni nameščen", timeout: 60000 }, async (t) => {
  let browser;
  try {
    browser = await playwright.chromium.launch();
  } catch {
    return t.skip("Chromium ni nameščen");
  }
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const page = await browser.newPage();
    const zunanje = [];
    page.on("request", (r) => r.url().includes("napadalec.example") && zunanje.push(r.url()));
    await page.goto(`${base}/o-evklidu.html`);
    await page.addScriptTag({ url: "/vendor/dompurify/purify.min.js" });
    await page.addScriptTag({ url: "/vendor/marked/lib/marked.umd.js" });
    const html = await page.evaluate(async (src) => {
      const { createRenderer } = await import("/rich.js");
      const r = createRenderer({ katex: { renderToString: (tex) => `<span class="katex" style="color:inherit">${tex}</span>` } });
      const out = r.renderRich(src);
      const box = document.createElement("div");
      box.innerHTML = out;
      document.body.append(box);
      await new Promise((ok) => setTimeout(ok, 300));
      return out;
    }, NAPAD);
    assert.doesNotMatch(html, /napadalec\.example/, html);
    assert.doesNotMatch(html, /<(form|input|button|textarea|select|option|style)\b/i, html);
    assert.doesNotMatch(html, /\sstyle="background/i);
    assert.doesNotMatch(html, /\s(srcset|poster|background)=/i);
    assert.match(html, /<img src="\/icons\/icon-192\.png">/, "lastna slika ostane");
    assert.match(html, /<img src="data:image\/png;base64,/, "data:image ostane");
    assert.match(html, /<a href="https:\/\/sl\.wikipedia\.org\/wiki\/Evklid">povezava<\/a>/, "povezava ostane");
    assert.match(html, /<span class="katex" style="color:inherit">x\^2<\/span>/, "formula (KaTeX po čiščenju) ostane s slogom");
    assert.deepEqual(zunanje, []);
  } finally {
    await browser.close();
    server.close();
  }
});
