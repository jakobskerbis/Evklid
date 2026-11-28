// Obrazec za registracijo pred zagonom aplikacije (meritev hitrosti 21. 11. 2026: na /#registracija je gumb »Ustvari
// račun« čakal ~50 modulov app.js, na računalniku 2,6 s). Strežnik da module obrazca (zagon.js, account.js z odvisnostmi)
// na začetek seznama, public/zagon.js uvozi account.js takoj (obrazecVnaprej, ko public/zacetek.js nastavi obrazec),
// app.js obrazec prevzame brez ponovnega izrisa, registracija pred tem počaka initAccount (continueFlow).
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { moduleDeps } from "../server/startup-files.js";
import { OBRAZEC } from "../server/vstopna-stran.js";

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

const quiet = { error() {}, warn() {}, info() {}, log() {} };
const PUB = new URL("../public", import.meta.url).pathname;
function start() {
  const store = openDb(":memory:");
  const server = createApp(store, { accounts: true, scheduler: false, log: quiet }).listen(0);
  return { store, server, base: `http://127.0.0.1:${server.address().port}` };
}
const modulesOf = (html) => [...html.matchAll(/<link rel="modulepreload" href="([^"]+)"/g)].map((m) => m[1]);

test("strežnik: moduli obrazca so prvi na seznamu (pristajalna stran in navadna stran), app.js ni med njimi", async () => {
  const prvi = new Set(OBRAZEC.flatMap((m) => moduleDeps(PUB, m)));
  assert.ok(prvi.has("/account.js") && prvi.has("/zagon.js") && prvi.has("/i18n-osnova.js"));
  assert.ok(!prvi.has("/app.js"), "obrazec ne čaka app.js");
  const { server, base } = start();
  try {
    for (const lang of ["sl-SI,sl;q=0.9", ""]) {
      const mods = modulesOf(await (await fetch(`${base}/`, { headers: { "accept-language": lang } })).text());
      assert.ok(mods.length > prvi.size + 20, lang);
      assert.equal(mods[0], "/zagon.js", lang);
      assert.deepEqual(new Set(mods.slice(0, prvi.size)), prvi, `${lang || "brez jezika"}: najprej moduli obrazca`);
      assert.ok(mods.includes("/app.js"));
    }
    // Brez jedra besedil (nemščina): cel slovar takoj za moduli obrazca, ne za ~50 moduli app.js.
    const de = modulesOf(await (await fetch(`${base}/`, { headers: { "accept-language": "de-DE,de;q=0.9" } })).text());
    assert.deepEqual(de.slice(prvi.size, prvi.size + 2), ["/i18n.js", "/i18n/sl.js"]);
  } finally {
    server.close();
  }
});

test("v brskalniku: obrazec pred app.js, vpisano ostane, registracija pred app.js odpre aplikacijo; pristajalna stran brez tega", { skip: !playwright && "Playwright ni nameščen", timeout: 120_000 }, async () => {
  const { server, base } = start();
  const browser = await playwright.chromium.launch();
  // app.js zadržimo, dokler test ne reče: tako je jasno, kaj se zgodi pred zagonom aplikacije.
  const open = async (path, w = 390, h = 844, locale = "sl-SI", timezoneId = "Europe/Ljubljana") => {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, locale, timezoneId, serviceWorkers: "block" });
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    const prijave = [];
    p.on("request", (r) => r.method() === "POST" && /\/api\/auth\//.test(r.url()) && prijave.push(r.url()));
    let spusti;
    const app = new Promise((ok) => (spusti = ok));
    let appPoslan = false;
    await p.route(/\/app\.js$/, async (r) => {
      await app;
      appPoslan = true;
      await r.continue();
    });
    await p.goto(base + path);
    return { ctx, p, errors, spusti, prijave, appPoslan: () => appPoslan };
  };
  const gumb = (p, text) => p.waitForFunction((tx) => [...document.querySelectorAll("#view-auth button")].some((b) => b.textContent.includes(tx) && !b.disabled && b.checkVisibility({ visibilityProperty: true })), text, { timeout: 20_000 });
  try {
    // 1. Registracija: obrazec in pasica sta vidna pred app.js; poizvedba z oznako vira umaknjena, sidro ostane.
    {
      const { ctx, p, errors, spusti, prijave, appPoslan } = await open("/?utm_source=test#registracija");
      await gumb(p, "Ustvari račun");
      assert.equal(appPoslan(), false, "app.js še ni prenesen");
      const st = await p.evaluate(() => ({
        auth: document.body.classList.contains("auth-mode"),
        skrito: document.documentElement.hasAttribute("data-zacetek-slogi"),
        tn: !document.getElementById("test-notice").hidden,
        url: location.search + location.hash,
        vir: JSON.parse(localStorage.getItem("evklid_vir") || "null")?.v,
      }));
      assert.deepEqual(st, { auth: true, skrito: false, tn: true, url: "#registracija", vir: "test" });
      const f = p.locator("#auth-form");
      await f.locator('[name="name"]').fill("Ana");
      await f.locator('[name="email"]').fill("ana@primer.si");
      await f.locator('[name="password"]').fill("geslo12345");
      await f.locator('[name="birth_date"]').fill("2008-05-05");
      for (const box of await f.locator('input[type="checkbox"][required]').all()) await box.check();
      await p.evaluate(() => (document.querySelector("#auth-form").dataset.prej = "1"));
      // Dva hitra dotika: ena registracija, gumb zaseden, brez napake »e-naslov je že registriran« (pregled #932).
      await p.evaluate(() => {
        const b = document.querySelector('#auth-form button[type="submit"]');
        b.click();
        b.click();
        document.querySelector("#auth-form").requestSubmit();
      });
      // Račun je ustvarjen, a brez app.js (onReady) ni kam naprej: obrazec ostane, gumb zaseden, nič ne utripne.
      await p.waitForTimeout(800);
      assert.deepEqual(prijave.map((u) => new URL(u).pathname), ["/api/auth/register"], "ena zahteva");
      assert.equal(await p.locator("#auth-form .form-error").isHidden(), true, "brez napake");
      assert.deepEqual(await p.evaluate(() => { const b = document.querySelector('#auth-form button[type="submit"]'); return [b.disabled, b.getAttribute("aria-busy")]; }), [true, "true"]);
      assert.equal(await p.locator("#child-form").count(), 0, "brez app.js ne naprej");
      assert.equal(await p.locator('#auth-form[data-prej="1"] [name="email"]').inputValue(), "ana@primer.si");
      spusti();
      await p.waitForSelector("#child-form", { timeout: 30_000 });
      await p.fill('#child-form input[name="name"]', "Ana");
      for (let i = 0; i < 4 && (await p.locator("#child-form .lp-opt").count()); i++) {
        await p.locator("#child-form .lp-opt").nth(i === 0 ? 1 : 0).click();
        await p.waitForTimeout(150);
      }
      await p.check('#child-form input[name="whose"][value="self"]');
      for (const c of await p.locator("#child-form input[type=checkbox][required]:visible").all()) await c.check();
      await p.click('#child-form button[type="submit"]');
      await p.waitForFunction(() => !document.body.classList.contains("auth-mode") && !document.getElementById("view-path").hidden, null, { timeout: 30_000 });
      assert.deepEqual(errors, []);
      await ctx.close();
    }
    // 2. app.js pride, ko je obrazec že izpolnjen: isti obrazec ostane (vpisano, fokus), napaka strežnika kot prej.
    {
      const { ctx, p, errors, spusti } = await open("/#prijava", 1440, 900);
      await gumb(p, "Prijava");
      await p.locator('#auth-form [name="email"]').fill("ni@primer.si");
      await p.locator('#auth-form [name="password"]').focus();
      await p.evaluate(() => (document.querySelector("#auth-form").dataset.prej = "1"));
      spusti();
      await p.waitForFunction(() => !document.documentElement.hasAttribute("data-zacetek") && [...document.styleSheets].some((s) => /textbook\.css/.test(s.href || "")), null, { timeout: 30_000 });
      assert.equal(await p.locator('#auth-form[data-prej="1"] [name="email"]').inputValue(), "ni@primer.si", "app.js obrazca ne izriše znova");
      assert.equal(await p.evaluate(() => document.activeElement?.name), "password");
      await p.locator('#auth-form [name="password"]').fill("napacno123");
      await p.locator('#auth-form button[type="submit"]').click();
      await p.waitForFunction(() => !document.querySelector("#auth-form .form-error").hidden, null, { timeout: 10_000 });
      // Nazaj na registracijo in naprej deluje kot prej.
      await p.click('#view-auth [data-go="register"]');
      await gumb(p, "Ustvari račun");
      assert.equal(new URL(p.url()).hash, "#registracija");
      assert.deepEqual(errors, []);
      await ctx.close();
    }
    // 3. Nemščina: cel slovar je takoj za moduli obrazca, obrazec pride pred app.js, v nemščini (pregled #932).
    {
      const { ctx, p, errors, spusti, appPoslan } = await open("/#registracija", 1440, 900, "de-DE", "Europe/Berlin");
      await p.waitForSelector('#auth-form button[type="submit"]', { state: "visible", timeout: 20_000 });
      assert.equal(appPoslan(), false, "app.js še ni prenesen");
      assert.equal(await p.evaluate(() => document.documentElement.lang), "de");
      assert.notEqual((await p.locator("#view-auth h1").textContent()).trim(), "Nov račun");
      spusti();
      await p.waitForFunction(() => !document.documentElement.hasAttribute("data-zacetek"), null, { timeout: 30_000 });
      assert.deepEqual(errors, []);
      await ctx.close();
    }
    // 4. Pristajalna stran (brez sidra) in povezava s kodo (?ref=): brez obrazca pred app.js, kot prej.
    for (const path of ["/", "/?ref=ABC123#registracija"]) {
      const { ctx, p, spusti } = await open(path);
      await p.waitForTimeout(1500);
      assert.equal(await p.evaluate(() => typeof window.evklidZacetek?.obrazec), "undefined", path);
      assert.equal(await p.locator("#auth-form").count(), 0, `${path}: brez obrazca pred app.js`);
      spusti();
      if (path === "/") await p.waitForSelector("#view-auth .land:visible", { timeout: 20_000 });
      else {
        await gumb(p, "Ustvari račun");
        assert.equal(await p.locator('#auth-form [name="code"]').inputValue(), "ABC123");
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
});

// Pristajalna stran (prvi obisk v produkciji): »Začni brezplačno« ali »Prijava« pred zagonom aplikacije odpre obrazec, ko je
// account.js prenesen, ne šele po app.js (meritev 27. 11. 2026, telefon, počasen 4G: ~4,2 s → ~1,9 s po odprtju strani).
// Slogi za druge zaslone pridejo šele za moduli obrazca (public/zacetek.js slogi), da jim ne vzamejo povezave.
test("v brskalniku: pristajalna stran odpre obrazec pred app.js; slogi drugih zaslonov za moduli obrazca", { skip: !playwright && "Playwright ni nameščen", timeout: 120_000 }, async () => {
  const { server, base } = start();
  const browser = await playwright.chromium.launch();
  const open = async ({ zadrziRacun = false } = {}) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "sl-SI", timezoneId: "Europe/Ljubljana", serviceWorkers: "block" });
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    const zahteve = [];
    p.on("request", (r) => zahteve.push(new URL(r.url()).pathname));
    let spusti;
    const app = new Promise((ok) => (spusti = ok));
    let appPoslan = false;
    await p.route(/\/app\.js$/, async (r) => {
      await app;
      appPoslan = true;
      await r.continue();
    });
    let spustiRacun;
    const racun = new Promise((ok) => (spustiRacun = ok));
    if (zadrziRacun)
      await p.route(/\/account\.js$/, async (r) => {
        await racun;
        await r.continue();
      });
    await p.goto(base + "/");
    await p.waitForSelector("#view-auth .land", { state: "visible", timeout: 20_000 });
    return { ctx, p, errors, zahteve, spusti, spustiRacun, appPoslan: () => appPoslan };
  };
  const vidnaForma = (p) => p.waitForSelector('#auth-form button[type="submit"]', { state: "visible", timeout: 20_000 });
  try {
    // 1. Registracija s pristajalne strani: obrazec pred app.js, isti kot na /#registracija; app.js ga prevzame brez izrisa.
    {
      const { ctx, p, errors, spusti, appPoslan } = await open();
      await p.click('#view-auth a[data-land="register"]');
      await vidnaForma(p);
      assert.equal(appPoslan(), false, "app.js še ni prenesen");
      assert.equal(new URL(p.url()).hash, "#registracija");
      const st = await p.evaluate(() => ({ auth: document.body.classList.contains("auth-mode"), pristajalna: document.documentElement.hasAttribute("data-pristajalna"), naslov: document.querySelector("#view-auth h1")?.textContent.trim(), skrito: getComputedStyle(document.body).visibility }));
      assert.deepEqual(st, { auth: true, pristajalna: false, naslov: "Nov račun", skrito: "visible" });
      await p.locator('#auth-form [name="email"]').fill("ana@primer.si");
      await p.evaluate(() => (document.querySelector("#auth-form").dataset.prej = "1"));
      spusti();
      await p.waitForFunction(() => !document.getElementById("account-tab").hidden, null, { timeout: 30_000 });
      assert.equal(await p.locator('#auth-form[data-prej="1"] [name="email"]').inputValue(), "ana@primer.si", "app.js obrazca ne izriše znova");
      // Nazaj: pristajalna stran, kot prej.
      await p.goBack();
      await p.waitForSelector("#view-auth .land", { state: "visible", timeout: 10_000 });
      assert.deepEqual(errors, []);
      await ctx.close();
    }
    // 2. Prijava s pristajalne strani: obrazec za prijavo pred app.js.
    {
      const { ctx, p, errors, appPoslan } = await open();
      await p.click('#view-auth a[data-land="login"]');
      await vidnaForma(p);
      assert.equal(appPoslan(), false);
      assert.equal(new URL(p.url()).hash, "#prijava");
      assert.equal(await p.locator('#auth-form [name="password"]').count(), 1);
      assert.deepEqual(errors, []);
      await ctx.close();
    }
    // 3. Dotik, preden je account.js tu: obrazec se pokaže, ko pride; slogi drugih zaslonov šele za njim (ne pred njim).
    {
      const { ctx, p, errors, zahteve, spustiRacun, appPoslan } = await open({ zadrziRacun: true });
      await p.click('#view-auth a[data-land="register"]');
      await p.waitForTimeout(1000);
      assert.equal(zahteve.includes("/textbook.css"), false, "slogi drugih zaslonov ne pred moduli obrazca");
      assert.equal(await p.locator("#auth-form").count(), 0);
      spustiRacun();
      await vidnaForma(p);
      assert.equal(appPoslan(), false);
      await p.waitForFunction(() => [...document.styleSheets].some((s) => /textbook\.css/.test(s.href || "")), null, { timeout: 10_000 });
      assert.deepEqual(errors, []);
      await ctx.close();
    }
    // 4. Brez dotika in brez account.js: slogi drugih zaslonov pridejo najkasneje ~3 s po izrisu (zacetek.js), pristajalna stran ostane.
    {
      const { ctx, p, zahteve } = await open({ zadrziRacun: true });
      await p.waitForFunction(() => [...document.styleSheets].some((s) => /textbook\.css/.test(s.href || "")), null, { timeout: 10_000 });
      assert.ok(zahteve.includes("/textbook.css"));
      assert.equal(await p.locator("#view-auth .land").isVisible(), true);
      await ctx.close();
    }
    // 6. Dotik, Nazaj, preden je account.js tu, in nov dotik: obrazec še vedno pred app.js (pregled PR #1203).
    {
      const { ctx, p, errors, spustiRacun, appPoslan } = await open({ zadrziRacun: true });
      await p.click('#view-auth a[data-land="register"]');
      await p.goBack();
      await p.waitForFunction(() => location.hash === "");
      await p.click('#view-auth a[data-land="register"]');
      spustiRacun();
      await vidnaForma(p);
      assert.equal(appPoslan(), false);
      assert.deepEqual(errors, []);
      await ctx.close();
    }
    // 5. Dotik, ko app.js že teče, a pristajalna stran še čaka cene (account.js renderLanding, do 1,5 s): obrazec, ne prazen zaslon.
    {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "sl-SI", timezoneId: "Europe/Ljubljana", serviceWorkers: "block" });
      const p = await ctx.newPage();
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      let stevec = 0;
      await p.route(/\/api\/account\/prices/, async (r) => {
        if (stevec++ === 0) await new Promise((ok) => setTimeout(ok, 1400)); // samo klic renderLanding (strežnik je cene že dal v stran)
        await r.continue();
      });
      await p.goto(base + "/");
      await p.waitForFunction(() => !document.getElementById("account-tab").hidden, null, { timeout: 30_000 });
      await p.click('#view-auth a[data-land="register"]');
      await vidnaForma(p);
      await p.waitForTimeout(1500); // cene so prišle: obrazec ostane
      assert.equal(await p.locator("#auth-form").isVisible(), true);
      assert.equal(new URL(p.url()).hash, "#registracija");
      assert.deepEqual(errors, []);
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
});
