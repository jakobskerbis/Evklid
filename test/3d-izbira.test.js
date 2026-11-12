// Dotik skozi prosojne plasti (public/3d/izbira.js, docs/3d.md »Picking«): koža, ovojnice in rentgen ne prestrežejo
// dotika, če je za njimi neprosojen del; tap samo na prosojno plast izbere to plast.
// 1) brez brskalnika: pomožna funkcija na umetnih zadetkih;
// 2) v pravem brskalniku (Playwright, če je nameščen): atlas s kožo, tap na sredino prsnega koša ne izbere kože.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { prviNeprosojen, prosojenZadetek } from "../public/3d/izbira.js";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const zad = (ime, material, distance, face = null) => ({ ime, object: { material }, distance, face });
const steklo = { transparent: true, opacity: 0.3 };
const pol = { transparent: true, opacity: 0.5 };
const trdno = { transparent: false, opacity: 1 };

test("izbira: prosojen zadetek preskoči, če je za njim neprosojen", () => {
  assert.equal(prviNeprosojen([zad("koza", steklo, 1), zad("rebro", trdno, 2), zad("srce", trdno, 3)]).ime, "rebro");
  assert.equal(prviNeprosojen([zad("a", steklo, 1), zad("b", steklo, 2)]).ime, "a", "samo prosojni: prvi");
  assert.equal(prviNeprosojen([zad("a", pol, 1), zad("b", trdno, 2)]).ime, "a", "opacity 0,5 še ni prosojna");
  assert.equal(prviNeprosojen([]), null);
  // nevidni ročaj (material visible: false) ostane izbirljiv
  assert.equal(prviNeprosojen([zad("rocaj", { visible: false, transparent: false, opacity: 1 }, 1), zad("b", trdno, 2)]).ime, "rocaj");
  // več materialov: šteje material zadete ploskve
  assert.equal(prosojenZadetek(zad("x", [trdno, steklo], 1, { materialIndex: 1 })), true);
  assert.equal(prosojenZadetek(zad("x", [trdno, steklo], 1, { materialIndex: 0 })), false);
  // lastno merilo (atlas: osnovaProsojnost, rentgen)
  const skozi = (h) => h.ime === "koza";
  assert.equal(prviNeprosojen([zad("koza", trdno, 1), zad("prsnica", trdno, 2)], skozi).ime, "prsnica");
});

const require = createRequire(import.meta.url);
let playwright = null;
for (const p of ["playwright", process.env.PLAYWRIGHT, "/opt/npm-tools/node_modules/playwright"].filter(Boolean)) {
  try {
    playwright = require(p);
    break;
  } catch {}
}
let browser = null;
try {
  if (playwright) browser = await playwright.chromium.launch();
} catch {}
const skip = browser ? false : "Playwright/Chromium ni nameščen";

test("atlas: koža vklopljena, tap na sredino prsnega koša izbere kost ali organ, ne kože", { skip, timeout: 120000 }, async () => {
  const sistem = new Map(JSON.parse(fs.readFileSync("public/3d/atlas-strukture.json", "utf8")).map((r) => [r.id, r.sistem]));
  const app = createApp(openDb(":memory:"), { accounts: true, scheduler: false, log: { error() {}, info() {}, warn() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  try {
    const p = await ctx.newPage();
    const napake = [];
    p.on("pageerror", (e) => napake.push(String(e)));
    await p.goto(`${base}/3d#atlas`, { waitUntil: "load" });
    await p.waitForFunction(() => window.__atlas?.kit, null, { timeout: 60000 });
    await p.evaluate(() => window.__atlas.preklopiSloj("koza", true));
    await p.waitForTimeout(1500); // začetni prelet kamere
    // Sredina prsnega koša (telo prsnice, atlas-strukture.json) na zaslonu
    const xy = await p.evaluate(async () => {
      const THREE = await import("/vendor/three/build/three.module.js");
      const kit = window.__atlas.kit;
      kit.camera.updateMatrixWorld();
      const v = new THREE.Vector3(0, 1.3, 0.1).project(kit.camera);
      const r = kit.canvas.getBoundingClientRect();
      return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height };
    });
    await p.mouse.click(xy.x, xy.y);
    await p.waitForTimeout(300);
    const id = await p.evaluate(() => window.__atlas.izbran);
    assert.ok(id, "tap na prsni koš ni izbral ničesar");
    assert.notEqual(sistem.get(id), "koza", `izbrana koža (${id}) namesto dela pod njo`);
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
    await browser.close();
    server.close();
  }
});

test.after(async () => {
  await browser?.close().catch(() => {});
});
