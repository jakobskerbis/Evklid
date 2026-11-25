// Izgubljen kontekst WebGL (iPad po menjavi aplikacije ali ob pomanjkanju pomnilnika): oder ne sme ostati črn.
// scena.js ob izgubi pokaže kartico z »Znova naloži«, ob obnovi naredi okolje (PMREM) znova in nariše prizor.
// Preizkus z WEBGL_lose_context v Chromiumu (swiftshader): slika po obnovi je enaka sliki pred izgubo.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const require = createRequire(import.meta.url);
let playwright = null;
for (const p of ["playwright", process.env.PLAYWRIGHT, "/opt/npm-tools/node_modules/playwright"].filter(Boolean)) {
  try {
    playwright = require(p);
    break;
  } catch {}
}

test("scena: po izgubi konteksta WebGL kartica »Znova naloži«, po obnovi spet slika modela", { skip: playwright ? false : "Playwright ni nameščen", timeout: 180000 }, async (t) => {
  let browser;
  try {
    browser = await playwright.chromium.launch({ args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  } catch {
    return t.skip("Chromium ni nameščen");
  }
  const app = createApp(openDb(":memory:"), { accounts: true, scheduler: false, log: { error() {}, info() {}, warn() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  // Majhen oder: swiftshader na počasnem CI riše vsako sličico na procesorju.
  const ctx = await browser.newContext({ viewport: { width: 640, height: 520 }, reducedMotion: "reduce", locale: "sl-SI", serviceWorkers: "block" });
  try {
    const p = await ctx.newPage();
    const napake = [];
    p.on("pageerror", (e) => napake.push(String(e)));
    await p.goto(`${base}/3d#celica-zivalska`, { waitUntil: "load" });
    await p.waitForSelector("canvas.k3-platno", { timeout: 60000 });
    // Namig na odru izgine po 9 s (sprememba slike, ki ni del prizora): skrijemo ga.
    await p.addStyleTag({ content: ".k3-namig { display: none !important; }" });
    // Posnetek dela strani, kjer je platno (ne locator.screenshot: ta na počasnem CI čaka, da se element »umiri«).
    const okvir = await p.locator("canvas.k3-platno").boundingBox();
    const clip = { x: Math.round(okvir.x), y: Math.round(okvir.y), width: Math.round(okvir.width), height: Math.round(okvir.height) };
    const posnetek = async () => (await p.screenshot({ clip, animations: "disabled", caret: "hide", scale: "css", timeout: 20000 })).toString("base64");
    // Povprečna razlika barv dveh posnetkov (0–255), v brskalniku (dekodiranje PNG).
    const razlika = (a, b) =>
      p.evaluate(async ([a, b]) => {
        const slika = async (s) => {
          const bm = await createImageBitmap(new Blob([Uint8Array.from(atob(s), (z) => z.charCodeAt(0))], { type: "image/png" })); // CSP: brez fetch(data:)
          const c = new OffscreenCanvas(bm.width, bm.height);
          const g = c.getContext("2d");
          g.drawImage(bm, 0, 0);
          return g.getImageData(0, 0, bm.width, bm.height).data;
        };
        const [x, y] = [await slika(a), await slika(b)];
        let v = 0;
        for (let i = 0; i < x.length; i += 4) v += Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]);
        return v / (x.length / 4) / 3;
      }, [a, b]);
    // Počakamo, da se slika umiri (model naložen, prvi sij delov ugasnjen): dva zaporedna posnetka skoraj enaka.
    const ustaljen = async () => {
      let a = await posnetek();
      for (let i = 0; i < 20; i++) {
        await p.waitForTimeout(300);
        const b = await posnetek();
        if ((await razlika(a, b)) < 0.5) return b;
        a = b;
      }
      return a;
    };
    const prej = await ustaljen();
    await p.evaluate(() => {
      const gl = document.querySelector("canvas.k3-platno").getContext("webgl2");
      window.__izguba = gl.getExtension("WEBGL_lose_context");
      window.__izguba.loseContext();
    });
    await p.waitForSelector(".k3-izguba", { timeout: 10000 });
    assert.match(await p.textContent(".k3-izguba"), /grafični pomnilnik[\s\S]*Znova naloži/);
    const med = await posnetek();
    await p.evaluate(() => window.__izguba.restoreContext());
    await p.waitForSelector(".k3-izguba", { state: "detached", timeout: 10000 });
    const po = await ustaljen();
    const dMed = await razlika(prej, med);
    const dPo = await razlika(prej, po);
    assert.ok(dMed > 4, `med izgubo bi moral biti oder prazen (razlika ${dMed.toFixed(2)})`);
    assert.ok(dPo < dMed * 0.25, `po obnovi slika ni kot prej (razlika ${dPo.toFixed(2)}, med izgubo ${dMed.toFixed(2)})`);
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
    await browser.close();
    server.close();
  }
});
