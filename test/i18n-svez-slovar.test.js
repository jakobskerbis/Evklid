// Stran s starejšim slovarjem od lenega modula (j 28. 11. 2026, iPad: podatki kalkulatorja so kazali »SC.INFOPERIOD«):
// ključ, ki ga ni niti v celem slovarju, enkrat naloži svež public/i18n/sl.js, doda le manjkajoče ključe in sproži
// »evklid:slovar« (sci.js tedaj znova izriše podatke). Ključi brez pike (koda napake strežnika) ne sprožijo ničesar.
import test from "node:test";
import assert from "node:assert/strict";

test("manjkajoč ključ po celem slovarju: svež slovar, le manjkajoči ključi, dogodek evklid:slovar", async () => {
  const dogodki = [];
  globalThis.document = Object.assign(new EventTarget(), { querySelectorAll: () => [], getElementById: () => null, documentElement: {} });
  document.addEventListener("evklid:slovar", () => dogodki.push(1));
  const m = await import("../public/i18n-osnova.js");
  // »star« slovar strani: drugačno besedilo za obstoječ ključ, brez novih ključev
  m.dodajSlovenscino({ "sc.infoRoots": "Ničle (star)" });
  assert.equal(m.t("rate_limited"), "rate_limited"); // brez pike: nič
  assert.equal(m.t("sc.infoPeriod"), "sc.infoPeriod");
  await new Promise((ok, no) => {
    document.addEventListener("evklid:slovar", ok, { once: true });
    setTimeout(() => no(new Error("brez dogodka evklid:slovar")), 10000);
  });
  assert.equal(m.t("sc.infoPeriod"), "Perioda");
  assert.equal(m.t("sc.infoRoots"), "Ničle (star)", "obstoječih besedil strani ne zamenja");
  assert.equal(m.t("ni.takega.kljuca"), "ni.takega.kljuca");
  await new Promise((ok) => setTimeout(ok, 50));
  assert.equal(dogodki.length, 1, "svež slovar enkrat na stran");
  delete globalThis.document;
});
