// Dotik skozi kožo (public/3d/izbira.js, docs/3d.md »Picking«): v atlasu koža ne prestreže dotika, če je pod njo del;
// drugi tap na isto mesto izbere kožo. Pregledovalnik modelov ostane pri najbližjem zadetku (prosojni deli celic,
// organov in fizike ostanejo izbirljivi); preskoči le material z userData.skozi.
// 1) brez brskalnika: pomožna funkcija in citoskelet živalske celice;
// 2) v pravem brskalniku (Playwright, če je nameščen): atlas s kožo in prosojnim učnim ciljem (veliki pečni).
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
test("atlas: tap skozi kožo izbere del pod njo, drugi tap kožo; veliki pečni ostane izbirljiv", { skip: playwright ? false : "Playwright ni nameščen", timeout: 180000 }, async (t) => {
  // Brskalnik zaženemo v preizkusu: z --test-force-exit (CI) se preizkus, registriran za vrhnjim await, ne zažene.
  let browser;
  try {
    browser = await playwright.chromium.launch();
  } catch {
    return t.skip("Chromium ni nameščen");
  }
  const vrstice = JSON.parse(fs.readFileSync("public/3d/atlas-strukture.json", "utf8"));
  const sistem = new Map(vrstice.map((r) => [r.id, r.sistem]));
  const app = createApp(openDb(":memory:"), { accounts: true, scheduler: false, log: { error() {}, info() {}, warn() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  // Manj gibanja: preleti kamere so takojšnji. Prelet napreduje po sličicah (dt ≤ 0,1 s), zato pri programskem risanju
  // v CI (sličica celega telesa traja več sekund) en sam prelet traja več kot minuto – od tod občasni padci.
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  try {
    const p = await ctx.newPage();
    const napake = [];
    p.on("pageerror", (e) => napake.push(String(e)));
    await p.goto(`${base}/3d#atlas`, { waitUntil: "load" });
    // __atlas je nastavljen šele po naloženih začetnih plasteh (odpriAtlas čaka nanje).
    await p.waitForFunction(() => window.__atlas?.kit, null, { timeout: 60000 });
    assert.equal(await p.evaluate(() => window.__atlas.kit.gibanje), false, "manj gibanja ni upoštevano: preleti niso takojšnji");
    // Števci za preizkus: poslušalci, dodani za atlasovimi, tečejo za njimi – ko se števec poveča, je dogodek obdelan.
    await p.evaluate(() => {
      Object.assign(window, { __tapi: 0, __spusti: 0, __tipke: 0 });
      const { kit } = window.__atlas;
      kit.naTap(() => window.__tapi++);
      kit.canvas.addEventListener("pointerup", () => window.__spusti++);
      kit.canvas.addEventListener("keydown", () => window.__tipke++);
    });
    const brezPreleta = () => p.waitForFunction(() => !window.__atlas.kit.leti, null, { timeout: 60000 });
    // Točko projiciramo vsakič znova (po izbiri ali Home je kamera drugje), na zaslonske (CSS) koordinate platna.
    const naZaslon = (c) =>
      p.evaluate(async (c) => {
        const THREE = await import("/vendor/three/build/three.module.js");
        const kit = window.__atlas.kit;
        kit.camera.updateMatrixWorld();
        const v = new THREE.Vector3(...c).project(kit.camera);
        const r = kit.canvas.getBoundingClientRect();
        return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height, z: v.z };
      }, c);
    // Tap šteje le, če pritisk in spust nista več kot 600 ms narazen (scena.js); pri obremenjenem CPU ju lahko loči
    // počasna sličica. Tak zavrnjen klik ne spremeni ničesar, zato ga ponovimo. Ponovimo le, ko je spust že obdelan in
    // tap ni bil sprejet – tako vsak klik da največ en tap in drugi tap nikoli ne pride namesto prvega.
    const tap = async (c, kateri) => {
      await brezPreleta();
      for (let poskus = 1; ; poskus++) {
        const xy = await naZaslon(c);
        assert.ok(xy.z > -1 && xy.z < 1 && xy.x >= 0 && xy.x <= 1280 && xy.y >= 0 && xy.y <= 800, `${kateri}: točka ${c} ni v kadru (${JSON.stringify(xy)})`);
        const prej = await p.evaluate(() => ({ tapi: window.__tapi, spusti: window.__spusti }));
        await p.mouse.click(xy.x, xy.y);
        await p.waitForFunction((n) => window.__spusti > n, prej.spusti, { timeout: 30000 });
        const tapi = await p.evaluate(() => window.__tapi);
        if (tapi === prej.tapi + 1) break;
        assert.equal(tapi, prej.tapi, `${kateri}: en klik je dal ${tapi - prej.tapi} tapov`);
        assert.ok(poskus < 5, `${kateri}: platno ni sprejelo tapa niti v 5 poskusih`);
      }
      await brezPreleta();
      return p.evaluate(() => window.__atlas.izbran);
    };
    const pocisti = async () => {
      await p.evaluate(() => window.__atlas.izberi(null));
      await p.locator("canvas").first().focus();
      const prej = await p.evaluate(() => window.__tipke);
      await p.keyboard.press("Home");
      await p.waitForFunction((n) => window.__tipke > n, prej, { timeout: 10000 });
      await brezPreleta();
      assert.equal(await p.evaluate(() => window.__atlas.izbran), null, "izbira ni počiščena");
    };
    // Prosojni učni cilj (veliki pečni, v privzetem bazenu kviza »Najdi«) ostane izbirljiv: tap na njegovo središče.
    await pocisti();
    const pecnica = vrstice.find((r) => r.ime === "Greater omentum");
    const izbranPecnica = await tap(pecnica.c, "veliki pečni");
    assert.equal(izbranPecnica, pecnica.id, `veliki pečni ni izbirljiv: tap na njegovo središče je izbral ${izbranPecnica}`);
    // Koža: tap na sredino prsnega koša (telo prsnice) izbere kost ali organ, drugi tap kožo, tretji počisti.
    // preklopiSloj vrne obljubo, ki se izpolni, ko je plast naložena in vidna.
    await p.evaluate(() => window.__atlas.preklopiSloj("koza", true));
    await pocisti();
    const prsi = [0, 1.3, 0.1];
    const prvi = await tap(prsi, "prvi tap");
    assert.ok(prvi, "tap na prsni koš ni izbral ničesar");
    assert.notEqual(sistem.get(prvi), "koza", `izbrana koža (${prvi}) namesto dela pod njo`);
    const drugi = await tap(prsi, "drugi tap");
    assert.equal(sistem.get(drugi), "koza", `drugi tap ni izbral kože (${drugi}), prvi je izbral ${prvi}`);
    const tretji = await tap(prsi, "tretji tap");
    assert.equal(tretji, null, `tretji tap ne počisti izbire (izbrano: ${tretji})`);
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
    await browser.close();
    server.close();
  }
});
