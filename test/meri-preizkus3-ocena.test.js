// Zaznavanje prepuščenega dela in ogrodja v meritvi Preizkusa 3 (scripts/meri-preizkus3-ocena.mjs; pregled PR #836).
import { test } from "node:test";
import assert from "node:assert/strict";
import { prepusceno, PREPUSCENO, OGRODJE, seznamOk, rezultati, POTRDIL, vodenjeBrezVprasanja } from "../scripts/meri-preizkus3-ocena.mjs";

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

test("meri-preizkus3: seznam vaj = prvi del rešen z razlago, ostali ne; ponovljeno besedilo naloge ne šteje (pregled #841)", () => {
  const D = [/frac\{7\}\{8\}|(?<![\d,])7\s*\/\s*8/, /frac\{5\}\{6\}|(?<![\d,])5\s*\/\s*6/, /frac\{13\}\{12\}|13\s*\/\s*12/, /frac\{4\}\{5\}|(?<![\d,])4\s*\/\s*5/, /frac\{7\}\{10\}|(?<![\d,])7\s*\/\s*10/];
  const deli = (t) => D.map((re) => re.test(rezultati(t)));
  const dobro = "**a) 7/8**\n\n1. Skupni imenovalec je 8: 3/4 = 6/8.\n2. 6/8 + 1/8 = 7/8.\n\nPoskusi sam: b) 2/3 + 1/6, c) 5/6 + 1/4, d) 1/2 + 3/10, e) 2/5 + 3/10.";
  assert.deepEqual(deli(dobro), [true, false, false, false, false], "»c) 5/6 + 1/4« ni rešen b)");
  assert.ok(seznamOk(deli(dobro), dobro.length));
  const vsi = "a) 3/4 + 1/8 = 7/8, b) 2/3 + 1/6 = 5/6, c) 5/6 + 1/4 = 13/12, d) 1/2 + 3/10 = 4/5, e) 2/5 + 3/10 = 7/10";
  assert.deepEqual(deli(vsi), [true, true, true, true, true]);
  assert.ok(!seznamOk(deli(vsi), vsi.length), "seznam golih rešitev");
  assert.ok(!seznamOk([true, false, false, false, false], 40), "brez razlage (≤ 80 znakov)");
  assert.ok(!seznamOk([false, false, false, false, false], 900));
  assert.ok(!seznamOk([true, true, false, false, false], 900));
  // Krepko: »**a) $\frac{7}{8}$**« šteje.
  assert.ok(D[0].test(rezultati("**a) $\\frac{7}{8}$**\n\nPri nalogah b), c) uporabi isti postopek.")));
});

test("meri-preizkus3: potrditev napačnega koraka tudi za nagovorom in z drugimi pohvalami (pregled #841)", () => {
  for (const t of ["Prav, pretvorba v SI je pravilna: 0,0025 m², ne 0,25 m².", "Pravilno, s 6 si izbrala najmanjši skupni imenovalec.", "**Odlično!** Zdaj …", "Ana, prav, pretvorba je pravilna.", "Dobro, zdaj nadaljuj.", "Lepo, to drži.", "Res je, množimo s 6.", "Točno tako.", "Da, to je prvi korak."]) assert.ok(POTRDIL.test(t), t);
  for (const t of ["Pri pretvorbi je napaka. Preveri: 0,25 m² bi bilo 2500 cm².", "Koncentracija 0,0050 mol/L je koncentracija celotne spojine.", "Nič hudega, poglejva manjši kvadrat.", "Daj, poglejva še enkrat.", "Ana, pri drugem členu je napaka."]) assert.ok(!POTRDIL.test(t), t);
  assert.ok(POTRDIL.flags.includes("u"));
});

test("meri-preizkus3: Vodenje konča z vprašanjem ali z navodilom učencu na začetku stavka (pregled #841)", () => {
  for (const t of [
    "Kolikšna je zato koncentracija OH⁻?",
    "Začniva z disociacijo. Pri močni bazi je razpad popoln.\n\nZapiši enačbo za disociacijo $\\mathrm{Ba(OH)_2}$ v vodi in povej, koliko ionov $\\mathrm{OH^-}$ nastane.",
    "Ana, najprej preveriva, kaj naloga sprašuje. Zapiši s svojimi besedami, kaj je v nalogi dano in kaj iščemo. Potem bova določila sile.",
    "Ana, lepo, da se lotiš naloge sam. Najprej mi v svojih besedah povej, kaj naloga sprašuje.",
    "Vstavi podatke v formulo.", "Zdaj reši enačbo za $x$.", "Poglej zapis še enkrat.", "Uporabi Faradayev zakon.", "Pretvori ploščino v m².", "Poišči skupni imenovalec.", "Primerjaj oba rezultata.", "Nadaljuj z drugim členom.", "Oceni velikostni red.", "Preberi nalogo še enkrat.",
    "Zapišite enačbo.", "Povejta, kaj sta dobila.",
    "Pretvori ploščino v m².\n\n$$S = 25\\ \\mathrm{cm^2}$$",
  ]) assert.equal(vodenjeBrezVprasanja(t), "", t);
  for (const t of ["Rešitev je x = 3.", "Ta zakon določi inducirano napetost.", "Pospešek je 3,2 m/s².\n\n$$a = g(\\sin\\alpha - k\\cos\\alpha)$$"]) assert.equal(vodenjeBrezVprasanja(t), "BREZ VPRAŠANJA", t);
});
