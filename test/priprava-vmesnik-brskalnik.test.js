// Priprava na test PR 7, regresije iz pregledov (26. 11. 2026) v pravem brskalniku:
// - vir, ki ga ni mogoče prebrati (meja strani, preizkusni način, napaka), se ne bere v neskončni zanki: en zahtevek,
//   nato »Poskusi znova«, ki sproži natanko enega novega;
// - napaka pri nalaganju datoteke (napačna vrsta) ostane vidna po novem izrisu seznama;
// - »Fotografiraj« in »Datoteka« sta dosegljiva s tipkovnico;
// - kljukic obsega ni mogoče odstraniti vseh (vsaj ena tema ostane na testu).
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import SL from "../public/priprava/sl.js";

process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");
const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 180000 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Najmanjša veljavna slika PNG (1 × 1): vrsta po vsebini je »slika«, vir čaka na branje.
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");

test.after(() => chromium?.close());

test("vmesnik v brskalniku: vir brez branja ne zanka zahtevkov, napaka nalaganja ostane, vhoda za datoteke s tipkovnico, vsaj ena tema", opts, async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: { log() {}, info() {}, warn() {}, error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const ctx = await chromium.newContext({ viewport: { width: 390, height: 844 }, locale: "sl-SI", serviceWorkers: "block" });
  try {
    const post = (p, body) => fetch(base + p, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json());
    const s = await post("/api/students", { name: "Eva", settings: { curriculum_level: "4. letnik", educational_track: "SREDNJA_SOLA", subject: "MAT", first_task: 1 } });
    const datum = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    const plan = (await post(`/api/students/${s.id}/test-plan`, { path: "MAT-SS-4", units: [2], date: datum })).plan;
    const zap = fs.readFileSync(new URL("./fixtures/priprava/mat-integrali.md", import.meta.url), "utf8");
    await post(`/api/students/${s.id}/priprave/${plan.pripravaId}/viri`, { besedilo: zap });
    await ctx.addInitScript((id) => {
      localStorage.setItem("evklid.tour", "1");
      localStorage.setItem("evklid.lang", "sl");
      localStorage.setItem("studentId", String(id));
    }, s.id);
    const p = await ctx.newPage();
    const napake = [];
    p.on("pageerror", (e) => napake.push(e.message));
    // Branje fotografije: strežnik odgovori, da je mesečna meja strani porabljena (vir ostane »branje«).
    let branj = 0;
    await p.route(/\/viri\/\d+\/preberi$/, (r) => {
      branj++;
      return r.fulfill({ status: 429, contentType: "application/json", body: JSON.stringify({ error: "Meja strani", code: "zapiski_strani" }) });
    });
    await p.goto(base + "/");
    await p.waitForFunction(() => !!document.querySelector('#modebar [data-mode="test"]'), null, { timeout: 60000 });
    // Prvi obisk z virom: »Danes«; zapiski prek »Moji zapiski«.
    for (let i = 0; i < 20 && !(await p.locator("[data-pr-zapiski]").count()); i++) {
      await p.evaluate(() => document.querySelector('#modebar [data-mode="test"]')?.click());
      await sleep(500);
    }
    await p.locator("[data-pr-zapiski]").click();
    await p.locator("[data-pr-foto]").waitFor({ state: "attached", timeout: 20000 });

    // Tipkovnica: oba vhoda za datoteke sta fokusabilna in ju Tab doseže.
    for (const sel of ["[data-pr-foto]", "[data-pr-datoteka]"]) {
      assert.ok(await p.locator(sel).evaluate((e) => !e.hidden && e.tabIndex >= 0 && getComputedStyle(e).display !== "none"), sel);
    }
    await p.locator("[data-pr-nazaj]").focus();
    await p.keyboard.press("Tab");
    assert.equal(await p.evaluate(() => document.activeElement?.hasAttribute("data-pr-foto")), true);
    await p.keyboard.press("Tab");
    assert.equal(await p.evaluate(() => document.activeElement?.hasAttribute("data-pr-datoteka")), true);

    // Napačna vrsta datoteke: sporočilo ostane po novem izrisu.
    await p.locator("[data-pr-datoteka]").setInputFiles({ name: "zapiski.txt", mimeType: "text/plain", buffer: Buffer.from("\u0000\u0001\u0002 ni dokument") });
    await p.waitForFunction(() => document.querySelector(".pr-err")?.textContent.trim().length > 0, null, { timeout: 15000 });
    await sleep(500);
    const sporocilo = await p.locator(".pr-err").textContent();
    assert.ok([SL["pr.err.priprava_vrsta"], SL["pr.err.priprava_prazno"]].includes(sporocilo.trim()), sporocilo);

    // Fotografija ob porabljeni meji: en zahtevek za branje, nato mir (prej: zanka zahtevkov in izrisov).
    await p.locator("[data-pr-foto]").setInputFiles({ name: "zvezek.png", mimeType: "image/png", buffer: PNG });
    await p.waitForFunction(() => document.querySelector(".pr-err")?.textContent.includes("strani"), null, { timeout: 15000 });
    await sleep(4000);
    assert.equal(branj, 1, `zahtevkov za branje: ${branj}`);
    assert.equal((await p.locator(".pr-err").textContent()).trim(), SL["pr.err.zapiski_strani"]);
    // »Poskusi znova« pri ustavljenem viru: natanko en nov zahtevek.
    const znova = p.locator("[data-pr-nadaljuj-vir]");
    assert.equal(await znova.count(), 1);
    await znova.click();
    await sleep(3000);
    assert.equal(branj, 2, `zahtevkov po »Poskusi znova«: ${branj}`);

    // Obseg: zadnje teme ni mogoče odstraniti.
    await p.locator("[data-pr-naprej]").click();
    await p.locator("[data-pr-tema]").first().waitFor({ timeout: 20000 });
    const kljukice = p.locator("[data-pr-tema]");
    const n = await kljukice.count();
    assert.ok(n >= 2);
    for (let i = 0; i < n; i++) {
      await kljukice.nth(i).uncheck({ force: true }).catch(() => {});
      await p.waitForFunction(() => ![...document.querySelectorAll("[data-pr-tema]")].some((x) => x.disabled), null, { timeout: 10000 });
    }
    assert.equal(await p.locator("[data-pr-tema]:checked").count(), 1);
    assert.equal((await p.locator(".pr-err").textContent()).trim(), SL["pr.keepOne"]);
    const shranjeno = await (await fetch(`${base}/api/students/${s.id}/priprave/${plan.pripravaId}`)).json();
    assert.equal(shranjeno.priprava.izkljucene.length, n - 1);
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
    await new Promise((r) => server.close(r));
    store.db.close();
  }
});
