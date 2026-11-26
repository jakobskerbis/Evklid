// PV-07 (docs/preverjanje.md, »Enote in zaokroževanje«): dimenzije formul v generatorjih in decimalke iz besedila.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { enotaVZapis, formulaVZapis, enoteNaloge, decimalkeBesedila, trditveNaloge, izmeriNabor, NABOR_ENOTE, popis } from "../scripts/enote-generatorjev.mjs";
import * as cas from "../server/cas.js";

const HAVE = await cas.casAvailable();
after(() => cas.casStop());

test("enote: TeX in besedilo v zapis za worker", () => {
  assert.equal(enotaVZapis("\\mathrm{J/(mol\\,K)}"), "J/((mol*K))");
  assert.equal(enotaVZapis("m/s²"), "m/s^(2)");
  assert.equal(enotaVZapis("L/100\\,km"), "L/(100*km)"); // vse za poševnico je imenovalec
  assert.equal(enotaVZapis("°C"), "K");
  assert.equal(enotaVZapis("%"), "percent");
  assert.equal(enotaVZapis("µmol/L"), "(mol/10^6)/L");
  assert.equal(enotaVZapis("kos"), null); // neznana enota: brez statusa
  assert.equal(enotaVZapis(""), "1");
});

test("formule: količine kot oznake, tisočice, enote in besedilo", () => {
  assert.deepEqual(formulaVZapis("U_0 = N B S \\omega"), { deli: ["§0§", "§1§*§2§*§3§*§4§"], kolicine: ["U_0", "N", "B", "S", "\\omega"] });
  assert.deepEqual(formulaVZapis("k = 20\\,000").deli, ["§0§", "20000"]);
  assert.deepEqual(formulaVZapis("R = 2\\ \\Omega").deli, ["§0§", "2*(ohm)"]);
  assert.equal(formulaVZapis("v = s \\cdot t \\quad (v_0 = 0)").deli[1], "§1§*§2§");
  assert.equal(formulaVZapis("P = \\dfrac{\\text{ugodni izidi}}{\\text{vsi izidi}}"), null);
  assert.equal(formulaVZapis("F_R = |F_1 - F_2|"), null);
  assert.equal(formulaVZapis("v\\,[\\mathrm{m/s}] = \\dfrac{v\\,[\\mathrm{km/h}]}{3{,}6}"), null);
});

test("enote naloge: podatki, iskana količina, definicija vmesne količine ni preverjanje", () => {
  const t = { data: { given: ["N = 40", "S = 326\\ \\mathrm{cm^2}", "B = 0{,}29\\ \\mathrm{T}", "\\nu = 2250\\ \\mathrm{obr/min}"], find: ["U_0"] }, formula: ["\\omega = 2\\pi\\nu", "U_0 = N B S \\omega"], answer: { type: "number", unit: "V" } };
  const e = enoteNaloge(t);
  assert.equal(e.enote.get("U_0"), "V");
  assert.match(e.formule[0].razlog, /definicija enote za \\omega/);
  assert.ok(e.formule[1].deli);
  // R, h, G niso privzete konstante (upor, višina, nukleotid)
  const r = enoteNaloge({ data: { given: ["U = 4\\ \\mathrm{V}"], find: ["I"] }, formula: ["I = \\dfrac{U}{R}"], answer: { type: "number", unit: "A" } });
  assert.match(r.formule[0].razlog, /definicija enote za R|brez enote: R/);
});

test("zaokroževanje: velja zadnje navodilo v besedilu", () => {
  assert.equal(decimalkeBesedila("Kolikšna je napetost? Zaokroži na dve decimalki."), 2);
  assert.equal(decimalkeBesedila("(povprečje zaokroži na dve decimalki). Zaokroži na eno decimalko."), 1);
  assert.equal(decimalkeBesedila("Zaokroži na celo število."), 0);
  assert.equal(decimalkeBesedila("Round your answer to 2 decimal places."), 2);
  assert.equal(decimalkeBesedila("Izračunaj ploščino."), null);
});

test("worker dim: enake dimenzije, seštevanje različnih, argument sinusa, število brez enote", { skip: !HAVE && "SymPy ni na voljo" }, async () => {
  const d = (...a) => cas.casCheck("dim", a);
  assert.equal((await d("V", "40 * T * cm^2 * (2*pi*(1/min))")).ok, true);
  assert.equal((await d("kg", "bar*L/((J/(mol*K))*K)")).ok, false);
  assert.equal((await d("m", "m + s")).ok, false);
  assert.equal((await d("1", "sin(m)")).ok, false);
  assert.equal((await d("1", "-log(mol/L)")).ok, true); // pH = −log c
  assert.equal((await d("K", "K + 273")).ok, null); // število brez enote ob količini: brez statusa
  assert.equal((await d("m", "x")).ok, null);
});

test("nabor enote-v1: vse napačne ujete, nič lažnih alarmov", { skip: !HAVE && "SymPy ni na voljo" }, async () => {
  const r = await izmeriNabor(NABOR_ENOTE, { cas });
  assert.equal(r.napacnoPotrjene, 0);
  assert.equal(r.lazniAlarmi, 0);
  assert.equal(r.ujete, r.napacnih);
  assert.equal(r.potrjenePravilne, r.pravilnih);
});

test("trditve naloge: napačna formula je napaka, zahteva po decimalkah se ujema z odgovorom", { skip: !HAVE && "SymPy ni na voljo" }, async () => {
  const t = { question: "Zaokroži na dve decimalki.", data: { given: ["s = 10\\ \\mathrm{m}", "t = 2\\ \\mathrm{s}"], find: ["v"] }, formula: ["v = s \\cdot t"], answer: { type: "number", unit: "m/s", decimals: 1 } };
  const tr = await trditveNaloge(t, { cas });
  assert.equal(tr.find((x) => x.vir === "enote").status, "napaka");
  assert.equal(tr.find((x) => x.vir === "zaokrozevanje").status, "napaka");
  const g = await popis({ semena: 20, predpona: "dod-fiz-ss-indukcija", cas });
  assert.equal(g.length, 1);
  assert.notEqual(g[0].enote, "napaka");
});
