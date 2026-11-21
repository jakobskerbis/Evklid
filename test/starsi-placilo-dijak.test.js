// Za starše: »Moj otrok je dijak (15+) in ima svoj račun. Kako plačam?« (pregled javnih strani 21. 11. 2026, P4).
// Besedilo mora opisati povezavo za plačilo in darilno kodo tako, kot delujeta v kodi; v aplikaciji iz trgovine ga ni.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import SL from "../public/i18n/sl.js";
import { PAY_LINK_DAYS } from "../server/accounts/billing.js";
import { GIFT_ADULT_TEXT } from "../server/placila/darila.js";
import { storeHtml } from "../server/mobile/trgovina.js";

const html = readFileSync(new URL("../public/starsi.html", import.meta.url), "utf8");
const text = (h) => h.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const faq = () => html.match(/<details id="placilo-dijak">([\s\S]*?)<\/details>/)?.[1] || "";

test("vprašanje in odgovor: povezava za plačilo in darilna koda, z napisi gumbov iz aplikacije in rokom povezave", () => {
  const f = text(faq());
  assert.match(f, /Moj otrok je dijak \(15\+\) in ima svoj račun\. Kako plačam\?/);
  assert.ok(f.includes(SL["pay.askParent"]), "gumb v zavihku Račun");
  assert.ok(SL["pay.askParentText"].includes(`Velja ${PAY_LINK_DAYS} dni`) && f.includes(`Povezava velja ${PAY_LINK_DAYS} dni.`), "rok povezave");
  assert.ok(f.includes("brez prijave"), "starš plača brez prijave (placaj.html)");
  assert.ok(f.includes(SL["gift.codeSummary"]), "kje otrok vpiše kodo");
  assert.match(GIFT_ADULT_TEXT, /polnoletna oseba/);
  assert.ok(f.includes("samo polnoletna oseba"), "darilno kodo kupi samo polnoletna oseba");
  assert.match(f, /potrdi\w* (svoj )?e-naslov/, "pred povezavo in nakupom je potreben potrjen e-naslov");
  assert.ok(!/\d+(,\d+)? ?€/.test(f), "brez zneskov: cena je na povezavi in v zavihku Račun");
  // Povezava pod uvodom vodi na odgovor.
  assert.ok(html.includes('<a href="#placilo-dijak">'));
});

test("v aplikaciji iz trgovine (brez nakupa mimo trgovine) vprašanja in povezave nanj ni", () => {
  const store = storeHtml(html, true);
  assert.ok(!store.includes("placilo-dijak"));
  assert.ok(storeHtml(html, false).includes('<details id="placilo-dijak">'));
});
