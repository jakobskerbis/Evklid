// Pristajalna stran pred prijavo (public/pristajalna.js, j 2026-11-04): cene s strežnika po stopnjah,
// vsi napisi prevedeni in pot do prijave ter registracije.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { plansFor } from "../server/accounts/plans.js";

// i18n.js ob nalaganju prevede statične napise v strani: v Node je stran prazna.
globalThis.document ??= { documentElement: { dataset: {} }, querySelectorAll: () => [] };
const { landingHtml, levelPrices } = await import("../public/pristajalna.js");
const money = (minor, cur) => `${minor / 100} ${cur}`;

test("cene po stopnjah pridejo iz cenika (OŠ, SŠ, faks in družina)", () => {
  const prices = { currency: "EUR", plans: plansFor("EUR"), trial_days: 7, min_age: 15 };
  const lp = levelPrices(prices, money);
  assert.deepEqual(lp.OS, { month: "9.99 EUR", year: "99 EUR" });
  assert.deepEqual(lp.SS, { month: "13.99 EUR", year: "139 EUR" });
  assert.deepEqual(lp.FAKS, { month: "19.99 EUR", year: "199 EUR" });
  assert.equal(lp.family, "18.99 EUR");
  const html = landingHtml({ name: "Evklid", prices, money });
  assert.match(html, /13\.99 EUR na mesec/);
  assert.match(html, /7 dni brezplačno, brez kartice\./);
  assert.match(html, /Za mlajše od 15 let račun ustvari starš\./);
});

test("regijske cene brez stopnje: ena cena za vse stopnje, brez družine", () => {
  const prices = { currency: "INR", plans: [{ seats: 1, interval: "month", amount: 49900 }, { seats: 1, interval: "year", amount: 499900 }, { seats: 2, interval: "month", amount: 79900 }] };
  const lp = levelPrices(prices, money);
  for (const l of ["OS", "SS", "FAKS"]) assert.deepEqual(lp[l], { month: "499 INR", year: "4999 INR" });
  assert.equal(lp.family, "");
});

test("brez odgovora strežnika stran deluje brez cen in brez starosti", () => {
  const html = landingHtml({ name: "Evklid" });
  assert.doesNotMatch(html, /na mesec|undefined|land\./);
  assert.match(html, /data-land="register"/);
  assert.match(html, /data-land="login"/);
  assert.match(html, /href="\/zasebnost\.html"/);
});

test("account.js: nov obiskovalec dobi pristajalno stran, znana naprava prijavo; Nazaj deluje", () => {
  const src = readFileSync(new URL("../public/account.js", import.meta.url), "utf8");
  assert.match(src, /hashMode\(\) \|\| \(store\.get\(SEEN\) \? "login" : null\)/);
  assert.match(src, /store\.set\(SEEN, "1"\)/);
  assert.match(src, /addEventListener\("popstate"/);
  // Pozabljeno geslo ima svoj zapis, da Nazaj z njega vrne na prijavo, ne na registracijo ali pristajalno stran.
  assert.match(src, /"#pozabljeno-geslo": "forgot"/);
  const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /popstate", \(\) => \{\n[^\n]*\n\s*if \(document\.body\.classList\.contains\("auth-mode"\)\) return;/);
});

// Pas pri vrhu (j 2026-11-10): tri dejstva vedno, garancija samo, ko jo strežnik oglašuje.
const { guaranteeAdvertised, GUARANTEE } = await import("../server/placila/garancija.js");
const { default: SL } = await import("../public/i18n/sl.js");

test("pas pri vrhu: tri dejstva so vedno, garancije brez stikala ni", () => {
  const prices = { currency: "EUR", plans: plansFor("EUR"), trial_days: 7, min_age: 15 };
  for (const html of [landingHtml({ name: "Evklid" }), landingHtml({ name: "Evklid", prices, money })]) {
    assert.match(html, /Račune preveri program, ne AI/);
    assert.match(html, /Po slovenskem učnem načrtu/);
    assert.match(html, /class="land-facts"[\s\S]*Brez oglasov/);
    assert.doesNotMatch(html, /garancija\.html|land-gar|Boljša ocena/);
    assert.ok(html.indexOf("land-top") < html.indexOf("land-hero"), "pas je nad uvodom");
  }
});

test("pas pri vrhu: z oglašano garancijo pokaže obljubo, pogoje v eni vrstici in povezavo na pogoje", () => {
  const prices = { currency: "EUR", plans: plansFor("EUR"), trial_days: 7, guarantee: { weeks: GUARANTEE.weeks, min_days: GUARANTEE.minDays, enroll_days: GUARANTEE.enrollDays } };
  const html = landingHtml({ name: "Evklid", prices, money });
  assert.match(html, /class="land-gar"/);
  assert.match(html, /Boljša ocena ali vrnemo denar/);
  assert.match(html, /href="\/garancija\.html"/);
  assert.ok(html.includes(SL["gar.short"]));
  assert.ok(html.indexOf("land-gar") < html.indexOf("land-hero"));
});

test("pogoji v vrstici so isti kot v kodi in na strani s pogoji (8 tednov, 3 dni, vsa plačila)", () => {
  assert.ok(SL["gar.short"].includes(`${GUARANTEE.weeks} tednov`) && SL["gar.short"].includes(`${GUARANTEE.minDays} dni na teden`));
  assert.match(SL["gar.short"], /vrnemo vsa plačila naročnine/);
  const terms = readFileSync(new URL("../public/garancija.html", import.meta.url), "utf8");
  assert.ok(terms.includes(`${GUARANTEE.weeks} tednov, vsaj ${GUARANTEE.minDays} dni na teden`));
  assert.ok(terms.includes(`v ${GUARANTEE.enrollDays} dneh od prvega plačila`));
  assert.match(terms, /vrnemo vsa plačila naročnine/);
});

test("garancija se oglašuje samo s stikalom, živim Stripom in vklopljenimi pravimi vračili", () => {
  const live = { enabled: true, testMode: false };
  const on = { EVKLID_GARANCIJA_OGLAS: "1", EVKLID_GUARANTEE_LIVE: "1" };
  assert.equal(guaranteeAdvertised(live, on), true);
  assert.equal(guaranteeAdvertised(live, {}), false, "privzeto izklopljeno");
  assert.equal(guaranteeAdvertised(live, { EVKLID_GARANCIJA_OGLAS: "1" }), false, "brez pravih vračil");
  assert.equal(guaranteeAdvertised(live, { EVKLID_GUARANTEE_LIVE: "1" }), false, "brez stikala");
  assert.equal(guaranteeAdvertised({ enabled: true, testMode: true }, on), false, "testni način Stripa");
  assert.equal(guaranteeAdvertised({ enabled: false, testMode: false }, on), false, "brez Stripa");
  assert.equal(guaranteeAdvertised(null, on), false);
  assert.equal(guaranteeAdvertised(live, { ...on, EVKLID_GARANCIJA_OGLAS: "true" }), false, "samo vrednost 1");
});

test("/api/account/prices: garancija samo ob vklopu in samo pri cenah v evrih", async () => {
  const { openDb } = await import("../server/db.js");
  const { createApp } = await import("../server/app.js");
  const fetchFn = async () => ({ ok: true, status: 200, json: async () => ({ id: "x", data: [] }) });
  const get = async (stripeKey, env, path = "/api/account/prices") => {
    const prev = {};
    for (const k of ["EVKLID_GARANCIJA_OGLAS", "EVKLID_GUARANTEE_LIVE"]) {
      prev[k] = process.env[k];
      if (env[k] === undefined) delete process.env[k];
      else process.env[k] = env[k];
    }
    const app = createApp(openDb(":memory:"), { accounts: true, scheduler: false, stripeKey, resendKey: "re_x", fetchFn, log: { error() {}, warn() {}, info() {}, log() {} } });
    const server = app.listen(0);
    try {
      return await (await fetch(`http://127.0.0.1:${server.address().port}${path}`)).json();
    } finally {
      server.close();
      for (const [k, v] of Object.entries(prev)) {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      }
    }
  };
  const on = { EVKLID_GARANCIJA_OGLAS: "1", EVKLID_GUARANTEE_LIVE: "1" };
  assert.equal((await get("sk_test_x", {})).guarantee, undefined);
  assert.equal((await get("sk_test_x", on)).guarantee, undefined, "testni način: brez oglasa");
  assert.equal((await get("sk_live_x", {})).guarantee, undefined, "privzeto izklopljeno");
  assert.deepEqual((await get("sk_live_x", on)).guarantee, { weeks: 8, min_days: 3, enroll_days: 14 });
  const inr = await get("sk_live_x", on, "/api/account/prices?country=IN");
  if (inr.currency !== "EUR") assert.equal(inr.guarantee, undefined, "druga valuta: brez garancije");
});
