// Pridržana kartica ali gumb-povezava (j 2026-11-13, »Odpri atlas« v Uči se → 3D svet): na telefonu brez modrega
// bliska ob dotiku in brez sivega oblačka z naslovom povezave (vlečenje ali meni povezave). Z miško ostane kot prej.
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";

const PUB = path.resolve("public");

test("CSS: no tap highlight anywhere, links have no callout or drag; zagon.js loads dotik.js", () => {
  const css = fs.readFileSync(path.join(PUB, "style.css"), "utf8");
  assert.match(css, /html \{ -webkit-tap-highlight-color: transparent; \}/);
  assert.match(css, /@media \(pointer: coarse\) \{ a\[href\] \{ -webkit-touch-callout: none; -webkit-user-drag: none; \} \}/);
  const k3 = fs.readFileSync(path.join(PUB, "3d/3d.css"), "utf8");
  assert.match(k3, /html \{ -webkit-tap-highlight-color: transparent; \}/);
  assert.match(k3, /@media \(pointer: coarse\) \{ \.k3 a\[href\] \{ -webkit-touch-callout: none; -webkit-user-drag: none; \} \}/);
  assert.match(fs.readFileSync(path.join(PUB, "zagon.js"), "utf8"), /^import "\.\/dotik\.js";/m);
});

const require = createRequire(import.meta.url);
let chromium = null;
before(async () => {
  try {
    chromium = await require("playwright").chromium.launch();
  } catch {}
});
after(() => chromium?.close());

const PAGE = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="/style.css">
<a class="card" id="k" href="/3d#atlas">Atlas človeškega telesa</a><p id="p">besedilo</p>
<script type="module" src="/zagon.js" data-moduli=""></script>`;

test("touch long-press on a link: context menu and drag are blocked; mouse keeps them", async (t) => {
  if (!chromium) return t.skip("Playwright chromium ni nameščen");
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = path.join(PUB, path.normalize(url));
    if (!file.startsWith(PUB) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    const type = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json" }[path.extname(file)] || "application/octet-stream";
    res.writeHead(200, { "content-type": type }).end(fs.readFileSync(file));
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  const ctx = await chromium.newContext({ hasTouch: true, isMobile: true, viewport: { width: 360, height: 740 } });
  try {
    const p = await ctx.newPage();
    await p.goto(`http://127.0.0.1:${server.address().port}/t.html`);
    await p.waitForFunction(() => window.getComputedStyle(document.documentElement).webkitTapHighlightColor === "rgba(0, 0, 0, 0)");
    const press = (id, pointerType, type) =>
      p.evaluate(
        ([id, pointerType, type]) => {
          const el = document.getElementById(id);
          el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerType }));
          const e = new MouseEvent(type, { bubbles: true, cancelable: true });
          el.dispatchEvent(e);
          return e.defaultPrevented;
        },
        [id, pointerType, type],
      );
    await p.waitForFunction(() => performance.getEntriesByName(new URL("/dotik.js", location).href).length > 0);
    assert.equal(await press("k", "touch", "contextmenu"), true, "dotik: meni povezave");
    assert.equal(await press("k", "touch", "dragstart"), true, "dotik: vlečenje povezave");
    assert.equal(await press("p", "touch", "contextmenu"), false, "dotik izven povezave ostane");
    assert.equal(await press("k", "mouse", "contextmenu"), false, "miška: desni klik ostane");
    assert.equal(await press("k", "mouse", "dragstart"), false, "miška: vlečenje ostane");
    await press("k", "touch", "pointerdown");
    await p.keyboard.press("Shift");
    const meni = await p.evaluate(() => {
      const e = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
      document.getElementById("k").dispatchEvent(e);
      return e.defaultPrevented;
    });
    assert.equal(meni, false, "tipka za meni po dotiku ostane");
  } finally {
    await ctx.close();
    server.close();
  }
});
