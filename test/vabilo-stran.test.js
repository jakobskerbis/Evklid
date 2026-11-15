// Stran /vabilo (public/vabilo.html, j 2026-11-15): besedila v vseh jezikih, telefon 360×740 na dotik: koda iz
// povezave → dobrodošlica z enim gumbom »Ustvari račun« (registracija, vir pilot), napačna koda → prijazno
// sporočilo in povezava na navadno registracijo. Koda ostane samo v brskalniku (evklid.vabilo), naslov je brez nje.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const read = (f) => fs.readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8");

test("vabilo: vsi ključi vab.* v sl.js in vseh prevodih, z istimi spremenljivkami", async () => {
  const { default: sl } = await import("../public/i18n/sl.js");
  const keys = Object.keys(sl).filter((k) => k.startsWith("vab."));
  assert.ok(keys.length >= 20, `${keys.length} ključev`);
  const used = new Set([...(read("vabilo.js") + read("vabilo.html")).matchAll(/["'](vab\.[A-Za-z0-9]+)["']/g)].map((m) => m[1]));
  for (const k of used) assert.ok(sl[k], `sl.js: ${k}`);
  const vars = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
  const files = fs.readdirSync(new URL("../public/i18n/ui/", import.meta.url));
  assert.equal(files.length, 32);
  for (const f of files) {
    const d = JSON.parse(read(`i18n/ui/${f}`));
    for (const k of keys) {
      assert.ok(typeof d[k] === "string" && d[k].trim(), `${f}: ${k}`);
      assert.equal(vars(d[k]), vars(sl[k]), `${f}: ${k} spremenljivke`);
      if (f !== "sl.json" && !/^(vab\.(codeLabel|check))$/.test(k)) assert.notEqual(d[k], sl[k], `${f}: ${k} ni preveden`);
    }
  }
});

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 120000 };
test.after(() => chromium?.close());

test("vabilo: telefon 360×740 – veljavna koda, gumb Ustvari račun, napačna koda", opts, async () => {
  const old = process.env.EVKLID_VABILA;
  process.env.EVKLID_VABILA = "Gim-Test1";
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const ctx = await chromium.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: "sl-SI", serviceWorkers: "block" });
  try {
    const p = await ctx.newPage();
    const napake = [];
    p.on("pageerror", (e) => napake.push(e.message));
    p.on("console", (m) => m.type() === "error" && napake.push(m.text()));
    await p.goto(`${base}/vabilo?koda=gim-test1`);
    await p.waitForSelector(".vab-ok");
    const text = await p.locator(".vab-ok").innerText();
    assert.match(text, /Dobrodošel\(a\) v pilotu!/);
    assert.match(text, /15\. 12\. 2026/, "datum konca pilota s strežnika");
    assert.match(text, /zavihku Jaz gumb »Povej mnenje«/);
    assert.match(text, /potrdimo ročno/);
    assert.doesNotMatch(text, /€|garant|zagotovo/i);
    assert.equal(await p.locator("#vab-form").isHidden(), true);
    assert.equal(await p.locator("main a.btn-primary, main button.primary:visible").count(), 1, "en glavni gumb");
    assert.equal(await p.getAttribute("#vab-create", "href"), "/#registracija");
    assert.equal(new URL(p.url()).search, "", "koda ni več v naslovu");
    await p.waitForFunction(() => localStorage.getItem("evklid_vir"));
    assert.equal(await p.evaluate(() => JSON.parse(localStorage.getItem("evklid_vir")).v), "pilot", "vir pilot, ne razred");
    assert.equal(await p.evaluate(() => localStorage.getItem("evklid.vabilo")), "gim-test1");
    assert.equal(await p.title(), "Vabilo v pilot – Evklid");
    assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "brez vodoravnega drsenja");
    const box = await p.locator("#vab-create").boundingBox();
    assert.ok(box.height >= 44 && box.width >= 260, `gumb ${box.width}×${box.height}`);
    // Gumb odpre registracijo; vir pilot se zapiše za nov profil (public/vir.js).
    await p.tap("#vab-create");
    await p.waitForSelector("#auth-form", { timeout: 15000 });
    assert.equal(new URL(p.url()).hash, "#registracija");

    // Napačna koda, vpisana ročno.
    const q = await ctx.newPage();
    q.on("pageerror", (e) => napake.push(e.message));
    await q.goto(`${base}/vabilo`);
    await q.waitForSelector("#vab-koda");
    await q.tap("#vab-form button.primary");
    assert.match(await q.locator("#vab-out").innerText(), /Vpiši kodo iz vabila/);
    await q.fill("#vab-koda", "ne-obstaja");
    await q.tap("#vab-form button.primary");
    await q.waitForSelector(".vab-bad");
    assert.match(await q.locator(".vab-bad").innerText(), /Te kode ne poznamo/);
    assert.equal(await q.getAttribute(".vab-bad a", "href"), "/#registracija");
    assert.equal(await q.evaluate(() => localStorage.getItem("evklid.vabilo")), "gim-test1", "napačna koda ne prepiše shranjene");
    assert.equal(await q.locator("#vab-form").isVisible(), true, "lahko poskusi znova");
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
    server.close();
    old === undefined ? delete process.env.EVKLID_VABILA : (process.env.EVKLID_VABILA = old);
  }
});
