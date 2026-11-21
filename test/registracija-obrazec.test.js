// Obrazec za registracijo (pregled javnih strani 21. 11. 2026, P9): gumb »Pokaži geslo«, namig »Vsaj 8 znakov«
// (aria-describedby), cena iz /api/account/prices (tudi srednja šola) in vsa besedila prek t(), da obrazec v drugem jeziku
// ni napol slovenski.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import SL from "../public/i18n/sl.js";
import { plansFor } from "../server/accounts/plans.js";

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}
const UA = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";
const KEYS = ["auth.registerTitle", "auth.loginIntro", "auth.invited", "auth.birth", "auth.privacy", "auth.privacyLink", "auth.registerLink", "auth.showPassword", "auth.hidePassword", "price.none"];

test("account.js: obrazec brez slovenskih besedil v kodi in brez zapisane cene", () => {
  const src = readFileSync(new URL("../public/account.js", import.meta.url), "utf8");
  const form = src.slice(src.indexOf("function renderLogin("), src.indexOf('$("#auth-form").addEventListener("submit"'));
  for (const s of ["Nov račun", "Tvoje ime", "E-naslov", ">Geslo", "Tvoj datum rojstva", "Prebral(a) sem", "Ustvari račun", "Še nimaš računa", "Pozabljeno geslo", "Že imaš račun", "7 dni brezplačen", "eur(999)"])
    assert.ok(!form.includes(s), s);
  assert.match(form, /aria-describedby="auth-password-hint"/);
  assert.match(form, /class="pw-toggle" aria-controls="auth-password" aria-pressed="false"/);
});

test("novi napisi obrazca so v vseh jezikih prevedeni, z isto spremenljivko", () => {
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  for (const f of ["en", "de", "ar", "hr", "zh"]) {
    const d = JSON.parse(readFileSync(new URL(`${f}.json`, dir), "utf8"));
    for (const k of KEYS.filter((k) => k !== "auth.registerLink")) assert.notEqual(d[k], SL[k], `${f}: ${k}`); // »Registracija« je tudi hrvaško
    assert.ok(d["auth.privacy"].includes("{link}") && d["auth.invited"].includes("{name}"), f);
  }
});

test("v brskalniku: cena iz cenika, pokaži/skrij geslo, namig; v angleščini brez slovenščine", { skip: !playwright && "Playwright ni nameščen", timeout: 90_000 }, async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, log: { error() {}, warn() {}, info() {}, log() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await playwright.chromium.launch();
  // Angleški telefon v Sloveniji dobi slovenščino (public/i18n/languages.js), zato za angleščino časovni pas London.
  const open = async (locale, timezoneId = "Europe/Ljubljana") => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale, timezoneId, serviceWorkers: "block", userAgent: UA });
    const p = await ctx.newPage();
    await p.goto(`${base}/#registracija`);
    await p.waitForSelector("#auth-form input[name=birth_date]", { timeout: 20_000 });
    return { ctx, p };
  };
  try {
    const { ctx, p } = await open("sl-SI");
    const os = plansFor("EUR").find((x) => x.level === "OS" && x.interval === "month" && !x.family).amount;
    const ss = plansFor("EUR").find((x) => x.level === "SS" && x.interval === "month" && !x.family).amount;
    const fmt = (c) => `${(c / 100).toFixed(2).replace(".", ",")} €`;
    await p.waitForFunction(() => /€/.test(document.querySelector("#auth-intro")?.textContent || ""), null, { timeout: 10_000 });
    const intro = (await p.textContent("#auth-intro")).replace(/ /g, " ");
    assert.ok(intro.includes(`od ${fmt(os)} na mesec (srednja šola ${fmt(ss)})`), intro);
    assert.match(intro, /7 dni brezplačno, brez kartice\./);
    const pw = p.locator("#auth-password");
    assert.equal(await pw.getAttribute("aria-describedby"), "auth-password-hint");
    assert.equal((await p.textContent("#auth-password-hint")).trim(), SL["mob.passwordShort"]);
    await pw.fill("skrivnost1");
    const btn = p.locator(".pw-toggle");
    assert.equal(await btn.getAttribute("aria-label"), SL["auth.showPassword"]);
    await btn.click();
    assert.equal(await pw.getAttribute("type"), "text");
    assert.equal(await btn.getAttribute("aria-pressed"), "true");
    assert.equal(await btn.getAttribute("aria-label"), SL["auth.hidePassword"]);
    await btn.click();
    assert.equal(await pw.getAttribute("type"), "password");
    assert.equal(await pw.inputValue(), "skrivnost1", "geslo ostane");
    const box = await btn.boundingBox();
    assert.ok(box.width >= 40 && box.height >= 40, "gumb ≥ 40 px");
    await ctx.close();

    const en = await open("en-GB", "Europe/London");
    const text = await en.p.textContent("#view-auth");
    for (const s of ["Nov račun", "Tvoj datum rojstva", "Prebral(a) sem", "Ustvari račun", "Že imaš račun", "obvestilo o varstvu"]) assert.ok(!text.includes(s), `angleško: ${s}`);
    assert.ok(text.includes("New account") && text.includes("Your date of birth") && text.includes("privacy notice"), text.slice(0, 300));
    await en.ctx.close();
  } finally {
    await browser.close();
    server.close();
    store.db.close();
  }
});
