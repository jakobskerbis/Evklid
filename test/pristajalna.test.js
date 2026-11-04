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
