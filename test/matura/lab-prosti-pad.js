// Maturitetna naloga lab-prosti-pad (public/sim/matura/lab-prosti-pad.js), uvozi jo test/laboratorij-matura.test.js.
// Brez brskalnika: točkovnik meritev in umerjena toleranca. Privzeti izvoz je igra v brskalniku (teče v testni strani).
import test from "node:test";
import assert from "node:assert/strict";
import { MATURA } from "../../public/sim/lab-matura-naloge.js";
import { razmerjeHitrosti, SREDINA } from "../../public/sim/matura/lab-prosti-pad.js";
import { PadBench, PREDMETI, G_LJ, naklonSkoziIzhodisce } from "../../public/sim/lab-model-gibanje.js";
import { num } from "../../public/sim/lab.js";

const naloga = MATURA["lab-prosti-pad"];
const ok = (vrstice) => naloga.meritve.map((m) => m.ok({ dnevnik: [], vrstice, par: () => "" }));
// Vrstica tabele, kot jo zapiše lab-gibanje.js → labProstiPad → record.
const vr = (h, t, v, pr = "kroglica") => ({ predmet: pr, "h [m]": num(h, 2), "t [s]": num(t, 4), "t² [s²]": num(t * t, 4), "v [m/s]": v ? num(v, 2) : "–" });
// Spusti kroglico z višine h (vrata morda zamaknjena za `zamik` iz navpičnice) in vrne vrstico in čas.
function spusti(B, h, zamik = 0) {
  B.premik = -Math.round(B.zamikVrat * 2000) / 2000 + zamik; // naravnano na korak drsnika 0,5 mm
  B.postavi(h);
  B.spusti();
  const m = B.meritev();
  return { t: m.t, r: vr(h, m.t, m.dt ? PREDMETI.jeklo.L / m.dt : null) };
}

test("free-fall matura: measurement criteria read the table", () => {
  // Pravilne meritve (prava višina in čas, v = 2h/t): pet višin, tri ponovljene.
  const t = (h) => Math.sqrt((2 * h) / 9.81);
  const prav = [0.3, 0.5, 1, 1.5, 2, 0.5, 1, 1.5].map((h) => vr(h, t(h), (2 * h) / t(h)));
  assert.deepEqual(ok(prav), [true, true, true, true]);
  assert.deepEqual(ok(prav.slice(0, 4)), [false, true, false, true], "štiri višine, ni ponovitev");
  assert.deepEqual(ok(prav.filter((r) => r["h [m]"] !== "2")), [false, true, true, true], "brez 2 m: štiri višine");
  assert.equal(ok([0.6, 0.8, 1, 1.2, 1.5].map((h) => vr(h, t(h), (2 * h) / t(h))))[1], false, "najnižja nad 0,5 m");
  assert.deepEqual(ok(prav.map((r) => ({ ...r, predmet: "filter" }))), [false, false, false, false], "filter ne šteje");
  // Žarek kroglico oplazi: v = D/Δt je 7 % prevelik.
  assert.equal(ok(prav.map((r) => ({ ...r, "v [m/s]": num(Number(r["v [m/s]"].replace(",", ".")) * 1.07, 2) })))[3], false);
  assert.equal(ok(prav.map((r) => ({ ...r, "v [m/s]": "–" })))[3], false, "brez hitrosti ni preverjanja");
  // V modelu: vrata 3 mm iz navpičnice nimajo točke, naravnana jo imajo.
  for (const s of [11, 22, 33]) {
    const B = new PadBench({ seed: s });
    const mimo = [0.5, 1, 1.5, 2].map((h) => spusti(B, h, 0.003).r), sredina = [0.5, 1, 1.5, 2].map((h) => spusti(B, h).r);
    assert.ok(razmerjeHitrosti(mimo) > SREDINA, `seme ${s}: zamaknjena vrata`);
    assert.ok(razmerjeHitrosti(sredina) <= SREDINA, `seme ${s}: naravnana vrata`);
  }
});

// Iz meritev: povprečni čas kroglice pri vsaki višini, premica h(t²) skozi izhodišče (vsaj tri višine), g = 2 · naklon.
test("free-fall matura: the result from the student's own table", () => {
  const rows = [vr(0.5, 0.3200), vr(0.5, 0.3220), vr(1, 0.4530), vr(1.5, 0.5540), vr(1.5, 0.5560), vr(1, 0.3, null, "filter")];
  const pts = [[0.321 ** 2, 0.5], [0.453 ** 2, 1], [0.555 ** 2, 1.5]];
  const g = (2 * pts.reduce((s, [x, y]) => s + x * y, 0)) / pts.reduce((s, [x]) => s + x * x, 0);
  assert.ok(Math.abs(naloga.izMeritev({ vrstice: rows }) - g) < 1e-9);
  assert.ok(Math.abs(g - 9.739) < 0.001, `g = ${g}`);
  assert.ok(Number.isNaN(naloga.izMeritev({ vrstice: rows.filter((r) => r["h [m]"] !== "1") })), "dve višini sta premalo za premico");
  assert.ok(Number.isNaN(naloga.izMeritev({ vrstice: [] })));
});

// Toleranca: skrben dijak (vrata naravnana, kroglica z elektromagnetom, višine 0,2, 0,5, 1,0, 1,5 in 2,0 m, vsaka
// dvakrat, povprečni čas, premica h(t²) skozi izhodišče) mora biti v 95 % vzorcev znotraj tol in dobi vse točke za meritve.
test("free-fall tolerance: a careful student lands within tol in at least 95 % of samples", () => {
  const N = 500;
  let v = 0, najR = 0, ujema = 0;
  for (let s = 1; s <= N; s++) {
    const B = new PadBench({ seed: s * 7919 });
    const vrstice = [], pts = [];
    for (const h of [0.2, 0.5, 1, 1.5, 2]) {
      const a = spusti(B, h), b = spusti(B, h);
      vrstice.push(a.r, b.r);
      const t = (a.t + b.t) / 2;
      pts.push([t * t, h]);
    }
    assert.deepEqual(ok(vrstice), [true, true, true, true], `seme ${s}: skrben dijak dobi vse točke za meritve`);
    najR = Math.max(najR, razmerjeHitrosti(vrstice));
    const g = 2 * naklonSkoziIzhodisce(pts), prava = naloga.resnica(B);
    assert.equal(prava, G_LJ);
    if (Math.abs(g - prava) / prava <= naloga.tol) v++;
    // Rezultat skrbnega dijaka izhaja iz njegovih meritev (lab-matura.js → oceni: do 2·tol od izMeritev).
    const mer = naloga.izMeritev({ vrstice });
    if (Math.abs(g - mer) <= 2 * naloga.tol * mer) ujema++;
  }
  assert.ok(ujema / N >= 0.99, `iz meritev: le ${ujema}/${N} do 2·tol`);
  assert.ok(najR < SREDINA - 0.01, `razmerje v·t/(2h) pri naravnanih vratih do ${najR}`);
  assert.ok(v / N >= 0.95, `le ${v}/${N} znotraj ${naloga.tol * 100} %`);
});

// Igra v brskalniku: vrata naravna kot učenec v povečavi od zgoraj (zamik pozna model; drsnik ima korak 0,5 mm),
// nato osem spustov s petih višin (tri ponovljene). Vrne pričakovane točke za meritve.
export default async () => {
  await drsnik("premik vrat naprej–nazaj", -Math.round(m._labBench.zamikVrat * 2000) / 2);
  for (const cm of [30, 50, 100, 150, 200, 50, 100, 150]) {
    await drsnik("vrata pod predmetom", cm);
    await gumb("Spusti");
    const n = vrstic();
    for (let k = 0; k < 100 && vrstic() === n; k++) {
      await wait(200);
      await gumb("Zapiši meritev");
    }
    if (vrstic() === n) throw new Error("meritev ni zapisana: " + zadnjiDnevnik());
  }
  return 4;
};

// Učbeniški g = 9,81 m/s² po meritvah le z nizkih vrat (3 do 5 cm): zamik elektromagneta (~5 ms) je tu velik del časa
// padca, zato je g iz teh meritev za več kot 5 % premajhen. Oddaja »9,81« ni iz meritev: 0 točk za rezultat.
export const znano = {
  vrednost: 9.81,
  igra: async () => {
    await drsnik("premik vrat naprej–nazaj", -Math.round(m._labBench.zamikVrat * 2000) / 2);
    for (const cm of [3, 4, 5]) {
      await drsnik("vrata pod predmetom", cm);
      await gumb("Spusti");
      const n = vrstic();
      for (let k = 0; k < 100 && vrstic() === n; k++) {
        await wait(200);
        await gumb("Zapiši meritev");
      }
      if (vrstic() === n) throw new Error("meritev ni zapisana: " + zadnjiDnevnik());
    }
  },
};
