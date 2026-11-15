// Učbenik, brskanje po vseh učbenikih (j, 15. 11. 2026: pod kartico »Matematika · osnovna šola« dolgo ni bilo seznama
// lekcij): med nalaganjem kazala piše »Nalagam …« namesto prazne strani, kazala drugih učbenikov se naložijo v ozadju
// in ostanejo v pomnilniku, zato menjava predmeta ali ravni (in vrnitev) ne čaka več na strežnik.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 180000 };

test("Učbenik: »Nalagam …« med čakanjem, kazala vnaprej, menjava ravni brez novega čakanja", opts, async () => {
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
    // Počasen strežnik za kazala (kot na telefonu ali tablici ob slabi povezavi).
    const kazala = [];
    let zamik = 1500;
    await p.route("**/api/textbook/toc?*", async (route) => {
      kazala.push(new URL(route.request().url()).searchParams.get("book"));
      await new Promise((ok) => setTimeout(ok, zamik));
      await route.continue();
    });
    await p.goto(base + "/healthz");
    const id = await p.evaluate(() =>
      fetch("/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Kazalo", settings: { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR", subject: "MAT", tour_version: 99 } }) })
        .then((r) => r.json())
        .then((s) => s.id),
    );
    await p.evaluate((id) => localStorage.setItem("studentId", String(id)), id);
    await p.goto(base + "/?pogled=textbook");
    await p.waitForSelector(".iq-wrap [data-iq=skip]", { timeout: 8000 }).then((b) => b.click()).catch(() => {});
    await p.waitForSelector("#view-textbook .tb-book", { timeout: 15000 }).catch(async (e) => { await p.screenshot({ path: "/tmp/claude-0/dbg.png" }); throw e; });
    // Prvo kazalo (učenčev učbenik) še nalaga: vidno sporočilo, ne prazen prostor.
    assert.match(await p.locator("#tb-body").innerText(), /Nalagam/);
    await p.waitForSelector("#tb-body .tb-part", { timeout: 10000 });
    assert.deepEqual(kazala, ["MAT-SS"]);

    // Vsi učbeniki: kazala drugih se naložijo v ozadju (vsako enkrat).
    await p.click("#tb-browse");
    await p.waitForSelector('#view-textbook [data-book="MAT-OS"]');
    for (let i = 0; i < 200 && kazala.length < 12; i++) await p.waitForTimeout(100);
    assert.equal(kazala.length, 12, `vnaprej naložena kazala: ${kazala.join(", ")}`);
    assert.equal(new Set(kazala).size, kazala.length, "nobeno kazalo dvakrat");

    // Menjava ravni in predmeta je zdaj takojšnja in brez nove zahteve, tudi ob počasnem strežniku.
    zamik = 5000;
    for (const izbira of ['[data-book="MAT-OS"]', '[data-subj="FIZ"]', '[data-book="FIZ-SS"]', '[data-subj="MAT"]', '[data-book="MAT-OS"]']) {
      const t0 = Date.now();
      await p.click(`#view-textbook ${izbira}`);
      await p.waitForSelector("#tb-body .tb-part", { timeout: 1000 });
      assert.ok(Date.now() - t0 < 1000, `${izbira}: ${Date.now() - t0} ms`);
    }
    assert.match(await p.locator("#view-textbook .tb-book h2").innerText(), /Matematika · osnovna šola/);
    assert.ok((await p.locator("#tb-body .tb-topic").count()) > 20, "seznam lekcij je viden");
    assert.equal(kazala.length, 12, "brez novih zahtev za kazala");
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
    server.close();
  }
});

test.after(() => chromium?.close());
