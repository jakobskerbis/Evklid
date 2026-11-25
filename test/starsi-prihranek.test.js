// Stran Za starše (public/starsi.js): prihranek letnega paketa kot razpon, izračunan iz cen (zunanji pregled 16. 11. 2026).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { LEVEL_PRICES, FAMILY_PRICES } from "../server/accounts/plans.js";

// Skripta brskalnika v peskovniku: samodejni del ob zagonu le nastavi povezave in čaka na fetch, ki se nikoli ne razreši.
function load() {
  const el = () => ({});
  const ctx = vm.createContext({
    URLSearchParams,
    location: { search: "" },
    navigator: { language: "sl-SI" },
    document: { getElementById: el },
    fetch: () => new Promise(() => {}),
  });
  vm.runInContext(readFileSync(new URL("../public/starsi.js", import.meta.url), "utf8"), ctx);
  return ctx.prihranekStarsi;
}

test("starsi.js: prihranek od najmanjšega do največjega, navzdol na cel odstotek", () => {
  const save = load();
  const pairs = [LEVEL_PRICES.OS, LEVEL_PRICES.SS, LEVEL_PRICES.FAKS, FAMILY_PRICES.druzina, FAMILY_PRICES.druzina_student].map((c) => [c.month, c.year]);
  assert.equal(save(pairs), " (prihranite od 17 do 41 %)");
  assert.equal(save([[1000, 10000], [2000, 20000]]), " (prihranite 16 %)", "en sam odstotek, ko so vsi enaki");
  assert.equal(save([[1000, 12000]]), "", "brez prihranka ni besedila");
  assert.equal(save([[1000, 13000]]), "", "dražji letni paket: brez besedila");
  assert.equal(save([[0, 9900], [999, 0]]), "", "manjkajoča cena se ne šteje");
});
