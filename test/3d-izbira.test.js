// Dotik skozi kožo (public/3d/izbira.js, docs/3d.md »Picking«): v atlasu koža ne prestreže dotika, če je pod njo del;
// drugi tap na isto mesto izbere kožo. Pregledovalnik modelov ostane pri najbližjem zadetku (prosojni deli celic,
// organov in fizike ostanejo izbirljivi); preskoči le material z userData.skozi.
// 1) brez brskalnika: pomožna funkcija in citoskelet živalske celice;
// 2) v pravem brskalniku (Playwright, če je nameščen): atlas s kožo in prosojnimi učnimi cilji.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { skoziLupino, jeLupina } from "../public/3d/izbira.js";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import { naloziThree } from "./fixtures/3d-modeli.js";

const THREE = await naloziThree();
const zad = (ime, material, distance, face = null) => ({ ime, object: { material }, distance, face });
const lupina = { transparent: true, opacity: 0.5, userData: { skozi: true } };
const steklo = { transparent: true, opacity: 0.3, userData: {} };
const trdno = { transparent: false, opacity: 1, userData: {} };
const imena = (r) => [r.zadetek?.ime ?? null, r.spredaj.map((h) => h.ime)];

test("izbira: lupina se preskoči, če je za njo del; prosojno brez skozi ostane najbližji zadetek", () => {
  assert.deepEqual(imena(skoziLupino([zad("koza", lupina, 1), zad("koza2", lupina, 1.5), zad("rebro", trdno, 2)])), ["rebro", ["koza", "koza2"]]);
  assert.deepEqual(imena(skoziLupino([zad("a", lupina, 1), zad("b", lupina, 2)])), ["a", []], "samo lupina: prvi");
  assert.deepEqual(imena(skoziLupino([zad("ovojnica", steklo, 1), zad("b", trdno, 2)])), ["ovojnica", []], "prosojno brez skozi: najbližji");
  assert.deepEqual(imena(skoziLupino([])), [null, []]);
  assert.equal(jeLupina(zad("x", [trdno, lupina], 1, { materialIndex: 1 })), true);
  assert.equal(jeLupina(zad("x", [trdno, lupina], 1, { materialIndex: 0 })), false);
  // lastno merilo (atlas: razred koza)
  assert.deepEqual(imena(skoziLupino([zad("koza", trdno, 1), zad("prsnica", trdno, 2)], (h) => h.ime === "koza")), ["prsnica", ["koza"]]);
});

test("pregledovalnik: citoskelet živalske celice (prosojen) ostane izbirljiv kot najbližji zadetek", { skip: !THREE && "three ni nameščen" }, async () => {
  const { zgradi } = await import("../public/3d/modeli/celice/zivalska.js");
  const m = zgradi(THREE, { kakovost: "nizka", gibanje: false });
  m.group.updateMatrixWorld(true);
  const cito = m.deli.find((d) => d.id === "citoskelet");
  const mreza = cito.meshes[0];
  assert.ok(mreza.material.transparent && mreza.material.opacity < 0.5, "citoskelet ni več prosojen: preizkus ne preverja ničesar");
  const vidna = (o) => { for (let x = o; x; x = x.parent) if (!x.visible) return false; return true; };
  const rc = new THREE.Raycaster();
  const pos = mreza.geometry.attributes.position;
  const v = new THREE.Vector3();
  const kam = new THREE.Vector3(0.4, 0.6, 3);
  let zadetki = 0;
  for (let i = 0; i < pos.count; i += Math.max(1, Math.floor(pos.count / 200))) {
    v.fromBufferAttribute(pos, i).applyMatrix4(mreza.matrixWorld);
    rc.set(kam, v.clone().sub(kam).normalize());
    const hits = rc.intersectObject(m.group, true).filter((h) => vidna(h.object)).sort((a, b) => a.distance - b.distance);
    if (!hits.length) continue;
    assert.equal(skoziLupino(hits).zadetek, hits[0]);
    if (hits[0].object === mreza) zadetki++;
  }
  assert.ok(zadetki > 0, "citoskelet ni zadet niti enkrat");
  m.dispose?.();
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

test("atlas: tap skozi kožo izbere del pod njo, drugi tap kožo; prosojni učni cilji ostanejo izbirljivi", { skip, timeout: 180000 }, async () => {
  const vrstice = JSON.parse(fs.readFileSync("public/3d/atlas-strukture.json", "utf8"));
  const sistem = new Map(vrstice.map((r) => [r.id, r.sistem]));
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
    await p.waitForFunction(() => !window.__atlas.kit.leti, null, { timeout: 60000 }); // začetni prelet kamere
    const naZaslon = (c) =>
      p.evaluate(async (c) => {
        const THREE = await import("/vendor/three/build/three.module.js");
        const kit = window.__atlas.kit;
        kit.camera.updateMatrixWorld();
        const v = new THREE.Vector3(...c).project(kit.camera);
        const r = kit.canvas.getBoundingClientRect();
        return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height };
      }, c);
    // Preleti kamere: po izbiri počakamo stalen čas, začetni pogled (Home) počakamo do konca preleta.
    const brezPreleta = () => p.waitForFunction(() => !window.__atlas.kit.leti, null, { timeout: 60000 });
    const tap = async (c) => {
      const xy = await naZaslon(c);
      await p.mouse.click(xy.x, xy.y);
      await p.waitForTimeout(1200);
      return p.evaluate(() => window.__atlas.izbran);
    };
    const pocisti = async () => {
      await p.evaluate(() => window.__atlas.izberi(null));
      await p.locator("canvas").first().focus();
      await p.keyboard.press("Home");
      await p.waitForTimeout(200);
      await brezPreleta();
    };
    // Prosojni učni cilji (veliki pečni, roženica) ostanejo izbirljivi: vsaj en tap blizu središča jih izbere.
    const cilj = async (ime) => {
      const c = vrstice.find((r) => r.ime === ime && r.stran !== "l").c;
      const dobljeni = [];
      for (const [dx, dy] of [[0, 0], [0.01, 0], [0, 0.01]]) {
        await pocisti();
        dobljeni.push(await tap([c[0] + dx, c[1] + dy, c[2]]));
      }
      assert.ok(dobljeni.some((id) => vrstice.find((r) => r.id === id)?.ime === ime), `${ime} ni izbirljiv: ${[...new Set(dobljeni)].join(", ")}`);
    };
    await cilj("Greater omentum");
    await p.evaluate(() => window.__atlas.preklopiSloj("zivcevje", true));
    await p.waitForTimeout(2500); // plast se pokaže po nalaganju
    await cilj("Cornea");
    await p.evaluate(() => window.__atlas.preklopiSloj("zivcevje", false));
    // Koža: tap na sredino prsnega koša (telo prsnice) izbere kost ali organ, drugi tap kožo, tretji počisti.
    await p.evaluate(() => window.__atlas.preklopiSloj("koza", true));
    await p.waitForTimeout(500);
    await pocisti();
    const prsi = [0, 1.3, 0.1];
    const prvi = await tap(prsi);
    assert.ok(prvi, "tap na prsni koš ni izbral ničesar");
    assert.notEqual(sistem.get(prvi), "koza", `izbrana koža (${prvi}) namesto dela pod njo`);
    const drugi = await tap(prsi);
    assert.equal(sistem.get(drugi), "koza", `drugi tap ni izbral kože (${drugi})`);
    assert.equal(await tap(prsi), null, "tretji tap ne počisti izbire");
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
