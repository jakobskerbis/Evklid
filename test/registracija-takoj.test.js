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
  } finally {
    server.close();
  }
});

test("v brskalniku: obrazec pred app.js, vpisano ostane, registracija pred app.js odpre aplikacijo; pristajalna stran brez tega", { skip: !playwright && "Playwright ni nameščen", timeout: 120_000 }, async () => {
  const { server, base } = start();
  const browser = await playwright.chromium.launch();
  // app.js zadržimo, dokler test ne reče: tako je jasno, kaj se zgodi pred zagonom aplikacije.
  const open = async (path, w = 390, h = 844) => {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, locale: "sl-SI", timezoneId: "Europe/Ljubljana", serviceWorkers: "block" });
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    let spusti;
    const app = new Promise((ok) => (spusti = ok));
    let appPoslan = false;
    await p.route(/\/app\.js$/, async (r) => {
      await app;
      appPoslan = true;
      await r.continue();
    });
    await p.goto(base + path);
    return { ctx, p, errors, spusti, appPoslan: () => appPoslan };
  };
  const gumb = (p, text) => p.waitForFunction((tx) => [...document.querySelectorAll("#view-auth button")].some((b) => b.textContent.includes(tx) && !b.disabled && b.checkVisibility({ visibilityProperty: true })), text, { timeout: 20_000 });
  try {
    // 1. Registracija: obrazec in pasica sta vidna pred app.js; poizvedba z oznako vira umaknjena, sidro ostane.
    {
      const { ctx, p, errors, spusti, appPoslan } = await open("/?utm_source=test#registracija");
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
      await f.locator('button[type="submit"]').click();
      // Račun je ustvarjen, a brez app.js (onReady) ni kam naprej: obrazec ostane, nič ne utripne.
      await p.waitForTimeout(800);
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
    // 3. Pristajalna stran (brez sidra) in povezava s kodo (?ref=): brez obrazca pred app.js, kot prej.
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
