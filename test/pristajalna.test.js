// Pristajalna stran pred prijavo (public/pristajalna.js, j 2026-11-04): cene s strežnika po stopnjah,
// vsi napisi prevedeni in pot do prijave ter registracije.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { plansFor } from "../server/accounts/plans.js";

// i18n.js ob nalaganju prevede statične napise v strani: v Node je stran prazna.
globalThis.document ??= { documentElement: { dataset: {} }, querySelectorAll: () => [] };
const { landingHtml, levelPrices } = await import("../public/pristajalna.js");
// Uvozi so pred prvim testom: po njem bi jih --test-force-exit izpustil skupaj s testi.
const { guaranteeAdvertised, GUARANTEE } = await import("../server/placila/garancija.js");
const { default: SL } = await import("../public/i18n/sl.js");
const { PROVIDER } = await import("../public/pristajalna.js");
const nos = await import("../scripts/pristajalna-noscript.js");
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

test("pas pri vrhu: tri dejstva so vedno, garancije brez stikala ni", () => {
  const prices = { currency: "EUR", plans: plansFor("EUR"), trial_days: 7, min_age: 15 };
  for (const html of [landingHtml({ name: "Evklid" }), landingHtml({ name: "Evklid", prices, money })]) {
    assert.match(html, /Račune preveri program</);
    assert.doesNotMatch(html, /ne AI/);
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

test("prvo dejstvo brez »ne AI« v vseh jezikih (j 2026-11-10)", async () => {
  const { readdirSync } = await import("node:fs");
  const SLx = (await import("../public/i18n/sl.js")).default;
  assert.equal(SLx["land.fact1"], "Račune preveri program");
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const v = JSON.parse(readFileSync(new URL(f, dir), "utf8"))["land.fact1"];
    assert.ok(v && !/AI|KI|IA|MI|ИИ|ШІ|ذكاء|هوش|人工|인공/.test(v), `${f}: ${v}`);
  }
  assert.equal(JSON.parse(readFileSync(new URL("de.json", dir), "utf8"))["land.fact1"], "Berechnungen prüft ein Programm");
});

// Pregled »kupca« 16. 11. 2026: ponudnik in kontakt na vstopni strani, pristajalna stran tudi brez JavaScripta.

test("ponudnik in kontakt v nogi sta ista kot upravljavec v obvestilu o zasebnosti", () => {
  const html = landingHtml({ name: "Evklid" });
  assert.match(html, /class="land-provider">Evklid razvija in upravlja Jakob Skerbiš · Kontakt: <a href="mailto:zasebnost@evklid\.app">/);
  const priv = readFileSync(new URL("../public/zasebnost.html", import.meta.url), "utf8");
  const sec = priv.slice(priv.indexOf("1. Upravljavec"), priv.indexOf("<h2>", priv.indexOf("1. Upravljavec")));
  assert.ok(sec.includes(PROVIDER.name) && sec.includes(`mailto:${PROVIDER.email}`), "public/zasebnost.html točka 1 se ujema s PROVIDER");
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const d = JSON.parse(readFileSync(new URL(f, dir), "utf8"));
    assert.ok(d["land.provider"]?.includes("{app}") && d["land.provider"].includes("{name}"), `${f}: land.provider`);
    assert.ok(d["land.contact"] && /JavaScript/.test(d["land.noJs"] || ""), `${f}: land.contact, land.noJs`);
  }
});

test("index.html: pristajalna stran v <noscript> je posodobljena (node scripts/pristajalna-noscript.js)", () => {
  const src = readFileSync(nos.INDEX, "utf8");
  assert.equal(nos.withBlock(src), src, "zaženi node scripts/pristajalna-noscript.js");
});

test("index.html brez JavaScripta: najprej pristajalna stran, lupina skrita, brez skritih obvestil v besedilu", () => {
  const src = readFileSync(nos.INDEX, "utf8");
  const body = src.slice(src.indexOf("<body>") + "<body>".length).trimStart();
  assert.ok(body.startsWith(nos.START), "blok je prvi v <body>");
  const block = src.slice(src.indexOf(nos.START), src.indexOf(nos.END));
  assert.match(block, /<noscript>[\s\S]*<\/noscript>/);
  assert.match(block, /<h1>Rešitev najdeš sam\. Evklid ti pokaže pot\.<\/h1>/);
  assert.match(block, /13,99\s€ na mesec/);
  assert.match(block, /ali 139\s€ na leto/);
  assert.match(block, /7 dni brezplačno, brez kartice\./);
  assert.match(block, /Za mlajše od 15 let račun ustvari starš\./);
  assert.match(block, /Jakob Skerbiš · Kontakt: <a href="mailto:zasebnost@evklid\.app">/);
  assert.match(block, /href="\/zasebnost\.html"/);
  assert.match(block, /class="land-nojs"/);
  assert.doesNotMatch(block, /data-land=|<svg|land\.|undefined|garancija\.html/);
  const head = src.slice(0, src.indexOf("</head>"));
  assert.match(head, /<noscript><style>body > :not\(noscript\) \{ display: none !important; \}<\/style><\/noscript>/);
  // Skrito obvestilo o izklopljenem klepetu napiše šele i18n.js (data-i18n), ko ga aplikacija res pokaže.
  assert.doesNotMatch(src, /začasno izklopljen/);
  assert.match(src, /<div id="chat-off" class="chat-off" role="status" data-i18n="chat\.off" hidden><\/div>/);
});
