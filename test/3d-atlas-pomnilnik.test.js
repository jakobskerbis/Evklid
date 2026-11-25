// Atlas telesa na tablicah (j 25. 11. 2026): vsaka plast mora biti v pomnilniku enkrat. Prej je vsak del obdržal svojo
// geometrijo iz GLB poleg skupne v BatchedMesh (vsa oglišča dvakrat v RAM), izbrani del pa se je naložil na grafično
// kartico še enkrat (sij, obris) in tam ostal. Zdaj je geometrija dela pogled na BatchedMesh (atlas.js pogledDela).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
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

test("atlas: oglišča plasti samo v BatchedMesh, izbira delov ne naloži novih medpomnilnikov na grafično kartico", { skip: playwright ? false : "Playwright ni nameščen", timeout: 240000 }, async (t) => {
  let browser;
  try {
    browser = await playwright.chromium.launch({ args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  } catch {
    return t.skip("Chromium ni nameščen");
  }
  const vrstice = JSON.parse(fs.readFileSync("public/3d/atlas-strukture.json", "utf8"));
  const app = createApp(openDb(":memory:"), { accounts: true, scheduler: false, log: { error() {}, info() {}, warn() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 700 }, reducedMotion: "reduce", serviceWorkers: "block" });
  try {
    // Bajti, ki gredo na grafično kartico (bufferData / bufferSubData), in število medpomnilnikov.
    await ctx.addInitScript(() => {
      window.__gpu = { medpomnilniki: 0, bajti: 0 };
      const P = WebGL2RenderingContext.prototype;
      const cb = P.createBuffer;
      P.createBuffer = function () {
        window.__gpu.medpomnilniki++;
        return cb.call(this);
      };
      const bd = P.bufferData;
      P.bufferData = function (cilj, x, ...r) {
        if (x && typeof x === "object") window.__gpu.bajti += x.byteLength || 0;
        return bd.call(this, cilj, x, ...r);
      };
    });
    const p = await ctx.newPage();
    const napake = [];
    p.on("pageerror", (e) => napake.push(String(e)));
    await p.goto(`${base}/3d?kakovost=nizka#atlas`, { waitUntil: "load" });
    await p.waitForFunction(() => window.__atlas?.kit, null, { timeout: 120000 });
    await p.waitForTimeout(1500);
    const kopije = await p.evaluate(() => window.__atlas.kopijeOglisc);
    assert.ok(kopije.deli > 100, `naloženih delov ${kopije.deli}`);
    assert.equal(kopije.lastne, 0, `${kopije.lastne} od ${kopije.deli} delov ima svojo kopijo oglišč poleg BatchedMesh`);
    const prej = await p.evaluate(() => ({ ...window.__gpu }));
    const nalozeni = new Set(await p.evaluate(() => [...window.__atlas.kit.scene.getObjectsByProperty("isBatchedMesh", true)].map((b) => b.userData.sloj)));
    const ids = vrstice.filter((r) => nalozeni.has(r.sistem)).filter((_, i) => i % 97 === 0).slice(0, 8).map((r) => r.id);
    assert.ok(ids.length >= 4, `deli za izbiro: ${ids}`);
    for (const id of ids) {
      await p.evaluate((id) => window.__atlas.izberi(id, { leti: false, tiho: true }), id);
      await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      assert.equal(await p.evaluate(() => window.__atlas.izbran), id);
    }
    const po = await p.evaluate(() => ({ ...window.__gpu }));
    assert.equal(po.medpomnilniki - prej.medpomnilniki, 0, `izbira ${ids.length} delov je ustvarila ${po.medpomnilniki - prej.medpomnilniki} novih medpomnilnikov`);
    assert.ok(po.bajti - prej.bajti < 64 * 1024, `izbira delov je na grafično kartico poslala ${po.bajti - prej.bajti} B`);
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
    await browser.close();
    server.close();
  }
});
