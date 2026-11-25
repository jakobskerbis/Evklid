// Maturitetna naloga lab-ohm (public/sim/matura/lab-ohm.js), uvozi jo test/laboratorij-matura.test.js.
// Brez brskalnika: točkovnik meritev in umerjena toleranca. Privzeti izvoz je igra v brskalniku (teče v testni strani).
import test from "node:test";
import assert from "node:assert/strict";
import { MATURA } from "../../public/sim/lab-matura-naloge.js";
import { OhmBench, fitOrigin } from "../../public/sim/lab-model.js";
import { fixed } from "../../public/sim/lab.js";

const naloga = MATURA["lab-ohm"];
const PRAV = { ampermeter: "zaporedno", voltmeter: "vzporedno" };
const ctx = ({ dnevnik = [], vrstice = [], par = PRAV } = {}) => ({ dnevnik, vrstice, par: (n) => par[n] ?? "" });
const vr = (U, I, p = "100 Ω") => ({ porabnik: p, "U [V]": U, "I [mA]": I, "U/I [Ω]žarnica": "–" });
const ok = (o) => naloga.meritve.map((m) => m.ok(ctx(o)));

test("ohm matura: measurement criteria read the table, the settings and the log", () => {
  const pet = [["1,50", "15,2"], ["2,50", "25,1"], ["3,50", "35,3"], ["4,50", "45,2"], ["5,50", "55,4"]].map(([U, I]) => vr(U, I));
  assert.deepEqual(ok({ vrstice: pet }), [true, true, true, true]);
  assert.deepEqual(ok({ vrstice: pet.slice(0, 4) }), [false, false, false, true], "štiri napetosti (do 4,5 V) niso dovolj");
  assert.deepEqual(ok({ vrstice: [...pet.slice(0, 4), vr("4,50", "45,3")] }).slice(0, 1), [false], "ista napetost dvakrat");
  assert.deepEqual(ok({ vrstice: [...pet.slice(0, 4), vr("6,00", "OL")] }).slice(0, 1), [false], "meritev brez toka (OL) ne šteje");
  assert.deepEqual(ok({ vrstice: pet.map((r) => ({ ...r, porabnik: "47 Ω" })) }), [false, false, false, false], "drug upornik");
  // Območje napetosti: od največ 2 V do vsaj 5 V.
  const ozko = ["2,50", "3,00", "3,50", "4,00", "4,50"].map((U) => vr(U, "30,0"));
  assert.deepEqual(ok({ vrstice: ozko }).slice(0, 2), [true, false]);
  // Pregret upornik (lab-fiz.js → say.vroc, say.zgorel).
  assert.equal(ok({ vrstice: pet, dnevnik: ["Upornik se greje: moč 0,72 W je večja od dovoljene 0,50 W."] })[2], false);
  assert.equal(ok({ vrstice: pet, dnevnik: ["Upornik je zgorel (dim, zoglenela prevleka). Krog je prekinjen. Preveč moči: P = U·I."] })[2], false);
  // Vezava merilnikov in varovalka (say.varovalka).
  assert.equal(ok({ vrstice: pet, par: { ampermeter: "vzporedno", voltmeter: "vzporedno" } })[3], false, "ampermeter vzporedno");
  assert.equal(ok({ vrstice: pet, par: { ampermeter: "zaporedno", voltmeter: "zaporedno" } })[3], false, "voltmeter zaporedno");
  const POK = "Pok! V ampermetru je pregorela varovalka (tok 2,31 A). Ampermeter zdaj ne meri toka. Ampermeter ima zelo majhen upor, zato ga vedno veži zaporedno.";
  assert.equal(ok({ vrstice: pet, dnevnik: [POK, "Nova varovalka je v ampermetru."] })[3], false, "pregorela varovalka");
  assert.equal(ok({})[3], false, "brez meritev ni točke za vezavo");
});

// Iz meritev: premica I(U) skozi izhodišče iz popolnih meritev upornika 100 Ω (vsaj tri), R = 1000/naklon (tok v mA).
test("ohm matura: the result from the student's own table", () => {
  const tri = [vr("2,00", "19,8"), vr("4,00", "39,7"), vr("6,00", "59,4"), vr("5,00", "OL"), vr("3,00", "45,0", "47 Ω")];
  const k = (2 * 19.8 + 4 * 39.7 + 6 * 59.4) / (4 + 16 + 36);
  assert.ok(Math.abs(naloga.izMeritev(ctx({ vrstice: tri })) - 1000 / k) < 1e-9);
  assert.ok(Math.abs(naloga.izMeritev(ctx({ vrstice: tri })) - 101.0) < 0.1);
  assert.ok(Number.isNaN(naloga.izMeritev(ctx({ vrstice: tri.slice(1) }))), "dve meritvi upornika 100 Ω sta premalo za premico");
  assert.ok(Number.isNaN(naloga.izMeritev(ctx())));
});

// Toleranca: skrben dijak (pravilna vezava, območji 200 mA in 20 V, 7 napetosti od 1 do 7 V, vsakič 3 s za odčitek,
// premica skozi izhodišče) mora biti v 95 % vzorcev znotraj tol. Napako dela le stalna umeritev merilnikov (V do 0,4 %,
// mA do 0,8 %) in segrevanje upornika (pri 7 V ~0,4 %).
test("ohm tolerance: a careful student lands within tol in at least 95 % of samples", () => {
  const N = 500;
  let v = 0, ujema = 0;
  for (let s = 1; s <= N; s++) {
    const B = new OhmBench({ seed: s * 7919 });
    const vrstice = [], pts = [];
    for (const U of [1, 2, 3, 4, 5, 6, 7]) {
      B.U0 = U;
      B.step(3);
      const I = B.readA(), V = B.readV();
      pts.push([V.value, I.value]);
      vrstice.push(vr(fixed(V.value, 2), fixed(I.value, 1)));
    }
    assert.ok(!B.events.some((e) => e.type === "vroc" || e.type === "zgorel"), "pri 7 V se upornik ne pregreje");
    assert.deepEqual(ok({ vrstice }), [true, true, true, true], "skrben dijak dobi vse točke za meritve");
    const prava = naloga.resnica(B);
    assert.ok(Math.abs(prava / 100 - 1) <= 0.05 + 1e-9, "upor je v toleranci ±5 %");
    const R = 1000 / fitOrigin(pts), mer = naloga.izMeritev(ctx({ vrstice }));
    if (Math.abs(R - prava) / prava <= naloga.tol) v++;
    // Rezultat skrbnega dijaka izhaja iz njegovih meritev (lab-matura.js → oceni: do 2·tol od izMeritev).
    if (Math.abs(R - mer) <= 2 * naloga.tol * mer) ujema++;
  }
  assert.ok(v / N >= 0.95, `le ${v}/${N} znotraj ${naloga.tol * 100} %`);
  assert.ok(ujema / N >= 0.99, `iz meritev: le ${ujema}/${N} do 2·tol`);
});

// Igra v brskalniku: šest napetosti od 1,5 do 6,5 V z privzeto vezavo. Vrne pričakovane točke za meritve.
export default async () => {
  const volt = () => Number(([...m.querySelectorAll(".lab-lcd")].find((x) => /voltmeter/.test(x.textContent))?.querySelector(".lab-lcd-val")?.textContent || "").replace(",", "."));
  for (const U of [1.5, 2.5, 3.5, 4.5, 5.5, 6.5]) {
    await drsnik("napetost napajalnika", U);
    await dokler(() => Math.abs(volt() - U) < 0.3);
    await gumb("Zapiši meritev");
  }
  return 4;
};

// Napis 100 Ω brez ujemajočih se meritev: upornik, ki se od napisa razlikuje za vsaj 3 % (»↺ Ponastavi« da nov upornik,
// kot bi učenec vzel drugega iz škatle), izmerjen kot zgoraj. Oddaja »100« ni iz meritev: 0 točk za rezultat.
export const znano = {
  vrednost: 100,
  igra: async () => {
    for (let k = 0; k < 30 && Math.abs(m._labBench.parts.R100.R / 100 - 1) < 0.03; k++) {
      m.querySelector(".demo-reset").click();
      await wait(600);
      await dokler(() => m.querySelector(".lab-mat .lab-mat-polja") && m._labBench?.parts);
    }
    belezi();
    const volt = () => Number(([...m.querySelectorAll(".lab-lcd")].find((x) => /voltmeter/.test(x.textContent))?.querySelector(".lab-lcd-val")?.textContent || "").replace(",", "."));
    for (const U of [1.5, 2.5, 3.5, 4.5, 5.5, 6.5]) {
      await drsnik("napetost napajalnika", U);
      await dokler(() => Math.abs(volt() - U) < 0.3);
      await gumb("Zapiši meritev");
    }
  },
};
