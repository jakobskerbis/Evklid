// 3D simulacija v lekciji (public/3d/sim.js) brez povezave: tudi ko se napake.js ne naloži, okvir pokaže sporočilo
// »Preveri povezavo« in gumb »Poskusi znova«, ki naloži znova (pregled z napravo: prej je ostal samo napis »3D«).
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

test("sim3d: brez napake.js in modelov sporočilo o povezavi in »Poskusi znova«", { skip: playwright ? false : "Playwright ni nameščen", timeout: 120000 }, async (t) => {
  let browser;
  try {
    browser = await playwright.chromium.launch();
  } catch {
    return t.skip("Chromium ni nameščen");
  }
  const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, info() {}, warn() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, locale: "sl-SI", serviceWorkers: "block" });
  try {
    const p = await ctx.newPage();
    const napake = [];
    p.on("pageerror", (e) => napake.push(String(e)));
    let modeli = 0;
    await p.route("**/3d/napake.js", (r) => r.abort("internetdisconnected"));
    await p.route("**/3d/modeli.js", (r) => (modeli++, r.abort("internetdisconnected")));
    await p.goto(`${base}/healthz`);
    const besedili = await p.evaluate(async () => {
      const { t } = await import("/i18n.js");
      const el = document.createElement("div");
      el.id = "sim";
      document.body.append(el);
      const { sim3d } = await import("/3d/sim.js");
      sim3d(el, { model: "celica-zivalska" });
      return [t("a3.loadError"), t("a3.retry")];
    });
    await p.waitForSelector("#sim button", { timeout: 20000 });
    assert.equal(await p.textContent("#sim p"), besedili[0]);
    assert.equal(await p.textContent("#sim button"), besedili[1]);
    assert.notEqual(besedili[0], "3D");
    const prej = modeli;
    await p.click("#sim button");
    for (let i = 0; i < 200 && modeli === prej; i++) await p.waitForTimeout(100);
    assert.ok(modeli > prej, "»Poskusi znova« naloži znova");
    await p.waitForSelector("#sim button", { timeout: 20000 });
    assert.equal(await p.textContent("#sim p"), besedili[0]);
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
    await browser.close();
    server.close();
  }
});
