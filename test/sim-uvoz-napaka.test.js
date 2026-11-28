// Datoteka simulacije se ne naloži (j 28. 11. 2026, Android, Laboratorij »Hookov zakon«: med objavo je strežnik vračal
// 502, okvir poskusa je ostal prazen z obvestilom »Failed to fetch dynamically imported module …/sim/lab-sile.js«, in
// brskalnik si je neuspel modul zapomnil, zato se do osvežitve ni naložil noben poskus). public/sim/index.js mountSim:
// en hiter nov poskus z drugim naslovom, nato kartica »Poskusi znova«; gumb naloži znova, ali pa osveži stran, ko
// strežnik spet dela, a je spodletela skupna odvisnost (lab.js), ki je brskalnik ne prenese znova.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import { uvoziPogon } from "../public/sim/index.js";

const require = createRequire(import.meta.url);
let playwright = null;
for (const p of ["playwright", process.env.PLAYWRIGHT, "/opt/npm-tools/node_modules/playwright"].filter(Boolean)) {
  try {
    playwright = require(p);
    break;
  } catch {}
}

test("uvoziPogon: po neuspehu en nov poskus z drugim naslovom; SyntaxError brez novega poskusa", async () => {
  const klici = [];
  const napaka = new TypeError("Failed to fetch dynamically imported module: https://evklid.app/sim/lab-sile.js");
  const mod = await uvoziPogon("lab-sile.js", { uvozi: async (u) => (klici.push(u), klici.length === 1 ? Promise.reject(napaka) : { ok: 1 }), spi: async () => {} });
  assert.deepEqual(mod, { ok: 1 });
  assert.equal(klici.length, 2);
  assert.match(klici[0], /\/sim\/lab-sile\.js$/);
  assert.match(klici[1], /\/sim\/lab-sile\.js\?r=\d+$/);
  const sintaksa = Object.assign(new SyntaxError("The requested module './kit.js' does not provide an export named 'x'"));
  let n = 0;
  await assert.rejects(uvoziPogon("lab-sile.js", { uvozi: async () => (n++, Promise.reject(sintaksa)), spi: async () => {} }), SyntaxError);
  assert.equal(n, 1);
  // drugi poskus z gumba (prvic: false): en sam uvoz z novim naslovom, brez čakanja
  const drugi = [];
  await uvoziPogon("lab-sile.js", { prvic: false, uvozi: async (u) => (drugi.push(u), {}) });
  assert.equal(drugi.length, 1);
  assert.match(drugi[0], /\?r=\d+$/);
  assert.notEqual(drugi[0], klici[1]);
});

async function zOdrom(t, fn) {
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
    await fn(p, base);
    assert.deepEqual(napake, [], "brez neobravnavane napake (prej obvestilo »Napaka: Failed to fetch …«)");
  } finally {
    await ctx.close();
    await browser.close();
    server.close();
  }
}
const postavi = (p, base) =>
  p.goto(`${base}/healthz`).then(() =>
    p.evaluate(async () => {
      const el = document.createElement("div");
      el.id = "sim";
      document.body.append(el);
      const { mountSim } = await import("/sim/index.js");
      window.__mount = mountSim("lab-hooke", el, {}, "Hookov zakon").then((ok) => (window.__ok = ok));
    }),
  );
const naslov = (r) => new URL(r.request().url()).pathname + new URL(r.request().url()).search;

test("mountSim: kratek izpad (502) datoteke poskusa – drugi poskus naloži laboratorij brez kartice", { skip: playwright ? false : "Playwright ni nameščen", timeout: 120000 }, (t) =>
  zOdrom(t, async (p, base) => {
    const zahteve = [];
    await p.route("**/sim/lab-sile.js*", (r) => (zahteve.push(naslov(r)), zahteve.length === 1 ? r.fulfill({ status: 502, contentType: "text/html", body: "<h1>502</h1>" }) : r.continue()));
    await postavi(p, base);
    await p.waitForFunction(() => window.__ok === true, null, { timeout: 30000 });
    assert.equal(zahteve.length, 2);
    assert.match(zahteve[1], /\?r=\d+$/);
    assert.equal(await p.locator("#sim .sim-napaka").count(), 0);
    assert.ok((await p.locator("#sim.lab").count()) === 1 || (await p.locator("#sim svg").count()) > 0, "poskus je narisan");
  }));

test("mountSim: daljši izpad – kartica »Poskusi znova«, gumb po vrnitvi strežnika naloži poskus", { skip: playwright ? false : "Playwright ni nameščen", timeout: 120000 }, (t) =>
  zOdrom(t, async (p, base) => {
    let dol = true;
    let zahtev = 0;
    await p.route("**/sim/lab-sile.js*", (r) => (zahtev++, dol ? r.fulfill({ status: 502, contentType: "text/html", body: "<h1>502</h1>" }) : r.continue()));
    await p.route("**/healthz", (r) => (dol && r.request().resourceType() === "fetch" ? r.fulfill({ status: 502, body: "" }) : r.continue()));
    await postavi(p, base);
    await p.waitForSelector("#sim .sim-napaka button", { timeout: 30000 });
    const [besedilo, gumb] = await p.evaluate(async () => {
      const { t } = await import("/i18n.js");
      return [t("a3.noConnection"), t("a3.retry")];
    });
    assert.equal(await p.textContent("#sim .sim-napaka p"), besedilo);
    assert.equal(await p.textContent("#sim .sim-napaka button"), gumb);
    assert.equal(await p.evaluate(() => window.__ok), undefined, "mountSim čaka na uspešen nov poskus");
    // še vedno dol: nov poskus, strežnik ne odgovarja → spet kartica (brez osvežitve strani)
    const prej = zahtev;
    await p.click("#sim .sim-napaka button");
    await p.waitForFunction(() => document.querySelector("#sim .sim-napaka button:not([disabled])"), null, { timeout: 30000 });
    assert.ok(zahtev > prej);
    // strežnik spet dela: gumb naloži poskus, mountSim vrne true
    dol = false;
    await p.click("#sim .sim-napaka button");
    await p.waitForFunction(() => window.__ok === true, null, { timeout: 30000 });
    assert.equal(await p.locator("#sim .sim-napaka").count(), 0);
  }));

// Neuspel modul ostane v seznamu modulov (Safari, starejši Chromium): nov naslov zgornje datoteke ne pomaga, ker
// odvisnost (lab.js) ostane pod istim naslovom. To posnemamo z odvisnostjo, ki še vedno ne pride, ko /healthz že dela.
test("mountSim: odvisnost (lab.js) se ne naloži, strežnik dela – gumb osveži stran", { skip: playwright ? false : "Playwright ni nameščen", timeout: 120000 }, (t) =>
  zOdrom(t, async (p, base) => {
    await p.route("**/sim/lab.js*", (r) => r.fulfill({ status: 502, contentType: "text/html", body: "<h1>502</h1>" }));
    await postavi(p, base);
    await p.waitForSelector("#sim .sim-napaka button", { timeout: 30000 });
    const osvezena = p.waitForEvent("load", { timeout: 30000 });
    await p.click("#sim .sim-napaka button");
    await osvezena;
    assert.equal(await p.locator("#sim").count(), 0, "stran je osvežena");
  }));

// Novejši Chromium odvisnost po neuspehu prenese znova: gumb tedaj poskus naloži brez osvežitve strani.
test("mountSim: odvisnost (lab.js) je spet dosegljiva – gumb naloži poskus ali osveži stran", { skip: playwright ? false : "Playwright ni nameščen", timeout: 120000 }, (t) =>
  zOdrom(t, async (p, base) => {
    await p.route("**/sim/lab.js*", (r) => r.fulfill({ status: 502, contentType: "text/html", body: "<h1>502</h1>" }));
    await postavi(p, base);
    await p.waitForSelector("#sim .sim-napaka button", { timeout: 30000 });
    await p.unroute("**/sim/lab.js*");
    let osvezena = false;
    p.once("load", () => (osvezena = true));
    await p.click("#sim .sim-napaka button");
    await p.waitForFunction(() => window.__ok === true || !document.querySelector("#sim"), null, { timeout: 30000 });
    if (!osvezena) assert.equal(await p.locator("#sim .sim-napaka").count(), 0);
  }));
