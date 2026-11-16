// Drevo 3D sveta (j, 15. 11. 2026: »ikone niso vidne takoj, rabijo sekundo ali dve«; »vse se ob kliku odpre takoj«):
// ikone podvej se naložijo vnaprej, ko je raven narisana, zato je ob dotiku na vejo nova raven takoj z vsemi ikonami;
// strežnik ikone in sličice pošlje z dnevnim predpomnjenjem (prej max-age=0: po vsaki objavi znova čakanje).
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createApp, SLIKE_3D_CACHE } from "../server/app.js";
import { openDb } from "../server/db.js";
import { DREVO, ikoneVnaprej, ikonaVeje } from "../public/3d/drevo.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 180000 };

test("ikoneVnaprej: podveje vidnih vej enkrat, brez Image (strežnik) nič", () => {
  // V Node ni Image: funkcija vrne število novih naslovov in ne vrže.
  const n = ikoneVnaprej([DREVO[0]], "antik");
  assert.equal(n, DREVO[0].otroci.length);
  assert.ok(ikonaVeje(DREVO[0].otroci[0].id, "antik").startsWith("/3d/ikone-drevo/antik/"));
});

test("strežnik: ikone vej in sličice z dnevnim predpomnjenjem, ostale datoteke ne", async () => {
  const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const r = await fetch(`${base}${ikonaVeje("biologija", "cist")}`);
    assert.equal(r.status, 200);
    assert.equal(r.headers.get("cache-control"), SLIKE_3D_CACHE);
    assert.match(SLIKE_3D_CACHE, /max-age=86400/);
    const js = await fetch(`${base}/3d/drevo.js`);
    assert.doesNotMatch(js.headers.get("cache-control") || "", /max-age=86400/, "koda ostane brez dolgega predpomnjenja");
  } finally {
    server.close();
  }
});

test("Uči se → 3D svet: ikone podvej vnaprej, dotik na vejo pokaže ikone takoj", opts, async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const ctx = await chromium.newContext({ viewport: { width: 1024, height: 1366 }, hasTouch: true, locale: "sl-SI", serviceWorkers: "block" });
  try {
    await ctx.addInitScript(() => localStorage.setItem("evklid.tour", "1"));
    const p = await ctx.newPage();
    const napake = [];
    p.on("pageerror", (e) => napake.push(e.message));
    // Počasna povezava za ikone: brez vnaprejšnjega nalaganja bi bila nova raven 1,5 s brez ikon.
    const ikone = [];
    await p.route("**/3d/ikone-drevo/**", async (route) => {
      ikone.push(new URL(route.request().url()).pathname);
      await new Promise((ok) => setTimeout(ok, 1500));
      await route.continue();
    });
    await p.goto(base + "/healthz");
    const id = await p.evaluate(() =>
      fetch("/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Ikone", settings: { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR", subject: "MAT", tour_version: 99 } }) })
        .then((r) => r.json())
        .then((s) => s.id),
    );
    await p.evaluate((id) => localStorage.setItem("studentId", String(id)), id);
    await p.goto(base + "/?pogled=3d");
    await p.waitForSelector("#uci-3d-content .uci-3d-veja img", { timeout: 15000 });
    const prva = await p.locator("#uci-3d-content .uci-3d-veja[data-pot]").first();
    const pot = await prva.getAttribute("data-pot");
    const veja = DREVO.find((v) => v.id === pot);
    // Ikone podvej prve veje se naložijo, še preden se je učenec dotaknil veje.
    for (let i = 0; i < 60 && !veja.otroci.every((o) => ikone.some((u) => u.endsWith(`/${o.id}.webp`))); i++) await p.waitForTimeout(100);
    for (const o of veja.otroci) assert.ok(ikone.some((u) => u.endsWith(`/${o.id}.webp`)), `ikona ${o.id} ni naložena vnaprej`);
    await p.waitForTimeout(1700); // počakamo, da prispejo (počasna povezava)
    const pred = ikone.length;
    await prva.click();
    await p.waitForFunction((pot) => document.querySelector(`#uci-3d-content [data-pot^="${pot}/"]`), pot);
    // Vse ikone nove ravni so takoj izrisane in nobena ni šla znova na strežnik.
    const t0 = Date.now();
    await p.waitForFunction(() => [...document.querySelectorAll("#uci-3d-content .uci-3d-veja img")].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 1000 });
    assert.ok(Date.now() - t0 < 1000);
    const ponovno = ikone.slice(pred).filter((u) => veja.otroci.some((o) => u.endsWith(`/${o.id}.webp`)));
    assert.deepEqual(ponovno, [], "ikone nove ravni ne gredo znova na strežnik");
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
    server.close();
  }
});

test.after(() => chromium?.close());
