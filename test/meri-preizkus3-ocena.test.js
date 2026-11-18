// Zaznavanje prepuščenega dela in ogrodja v meritvi Preizkusa 3 (scripts/meri-preizkus3-ocena.mjs; pregled PR #836).
import { test } from "node:test";
import assert from "node:assert/strict";
import { prepusceno, PREPUSCENO, OGRODJE } from "../scripts/meri-preizkus3-ocena.mjs";

test("meri-preizkus3: prepuščen del je zaznan, ponudba podobne naloge na koncu pa ne", () => {
  for (const t of ["a) **2**\n\nNaslednji korak: poskusi sam še b) in c).", "a) **2**\n\nNaslednji korak: poskusi sam rešiti b).", "a) **3,00**. b) pa lahko nato poskusiš sam.", "Rešiva a). Ostale poskusiš sam? Ostale lahko poskusiš sam."]) {
    assert.ok(prepusceno(t), t);
  }
  for (const t of ["a) **2**, b) **1**, c) **8**\n\nNaslednji korak: poskusi sam podobno nalogo.", "a) **2**, b) **1**\n\n**Naslednji korak:** poskusi sam."]) {
    assert.ok(!prepusceno(t), t);
  }
  // »poskusiš« s šumnikom (\p{L} z zastavico u), ne le ASCII \w.
  assert.ok(PREPUSCENO.flags.includes("u"));
  assert.ok(PREPUSCENO.test("Nalogo b) poskusiš sam."));
  // Ponudba podobne naloge sredi besedila ni izjema: izjema je le zadnja vrstica.
  assert.ok(prepusceno("Naslednji korak: poskusi sam še b) in c).\n\nČe želiš, rešiva skupaj."));
});

test("meri-preizkus3: ogrodje vključuje Preverimo in Preizkus:", () => {
  for (const t of ["**Preverimo:** 8 − 6 = 2.", "Preizkus: 17 + 28 = 45.", "**Podatki:** 6 ptičkov", "Preverba: drži."]) assert.ok(OGRODJE.test(t), t);
  assert.ok(!OGRODJE.test("a) Na veji je **8 ptičkov** (6 − 2 + 4 = 8)."));
});
