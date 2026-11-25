// Maturitetna naloga lab-newton2 (public/sim/matura/lab-newton2.js), uvozi jo test/laboratorij-matura.test.js.
// Brez brskalnika: točkovnik meritev in umerjena toleranca. Privzeti izvoz je igra v brskalniku (teče v testni strani).
import test from "node:test";
import assert from "node:assert/strict";
import { MATURA } from "../../public/sim/lab-matura-naloge.js";
import { ProgaBench, PROGA, G_SOLA, premica } from "../../public/sim/lab-model-gibanje.js";
import { num } from "../../public/sim/lab.js";

const naloga = MATURA["lab-newton2"];
const ok = (dnevnik, vrstice = []) => naloga.meritve.map((m) => m.ok({ dnevnik, vrstice, par: () => "" }));
// Dnevnik motorja (lab-gibanje.js → labNewton2: levBtn, frame) in vrstica tabele (record).
const LIB = "Progo si izravnal z libelo (brez podložke). Nagib mize je zdaj manjši od 0,3 mm na meter.";
const TR_OK = "Preizkus trenja: Δt₂/Δt₁ = 1,006. Hitrost je skoraj enaka: trenje je izravnano.";
const TR_MALO = "Preizkus trenja: Δt₂/Δt₁ = 1,083. Voziček se ustavlja: podložka je premajhna.";
const vr = (m, F, a) => ({ "m [g]": String(m), "F [N]": num(F, 3), "v₁ [m/s]": "0,4", "v₂ [m/s]": "0,8", "a [m/s²]": num(a, 3) });

test("newton2 matura: measurement criteria read the log and the table", () => {
  const pet = [1, 2, 3, 4, 5].map((n) => vr(320, (10 + 10 * n) * 0.00981, n * 0.3));
  assert.deepEqual(ok([LIB, TR_MALO, TR_OK], pet), [true, true, true, true]);
  assert.deepEqual(ok([TR_OK], pet).slice(0, 2), [false, false], "brez libele");
  assert.equal(ok([LIB, TR_OK, TR_MALO], pet)[1], false, "zadnji preizkus trenja ni izravnan");
  assert.equal(ok([TR_OK, LIB], pet)[1], false, "preizkus pred libelo ne velja");
  assert.equal(ok([LIB, TR_OK], pet.slice(0, 4))[2], false, "štiri sile");
  // Utežica iz škatle spremeni tudi skupno maso: sile pri različnih masah se ne seštevajo.
  const mesano = [1, 2, 3, 4, 5].map((n) => vr(320 + (n > 2 ? 10 : 0), (10 + 10 * n) * 0.00981, n * 0.3));
  assert.deepEqual(ok([LIB, TR_OK], mesano).slice(2), [false, false]);
  // Obseg sil: od največ 0,2 N do vsaj 0,5 N pri isti masi.
  assert.equal(ok([LIB, TR_OK], [2, 3, 4, 5, 6].map((n) => vr(320, (10 + 10 * n) * 0.00981, n * 0.3)))[3], false, "najmanjša 0,29 N");
  assert.equal(ok([LIB, TR_OK], [0, 1, 2, 3, 4].map((n) => vr(320, (10 + 10 * n) * 0.00981, n * 0.3)))[3], false, "največja 0,49 N");
});

// Iz meritev: premica a(F) z odsekom pri skupni masi z največ različnimi silami (vsaj tri), m = 1/naklon.
test("newton2 matura: the result from the student's own table", () => {
  // a = (F − 0,005 N) / 0,335 kg pri 320 g; ena meritev pri drugi masi ne šteje.
  const rows = [0.1, 0.2, 0.3, 0.4].map((F) => vr(320, F, (F - 0.005) / 0.335));
  assert.ok(Math.abs(naloga.izMeritev({ vrstice: [...rows, vr(330, 0.5, 2)] }) - 0.335) < 0.002);
  const pts = rows.map((r) => [Number(r["F [N]"].replace(",", ".")), Number(r["a [m/s²]"].replace(",", "."))]);
  assert.ok(Math.abs(naloga.izMeritev({ vrstice: rows }) - 1 / premica(pts).a) < 1e-12);
  assert.ok(Number.isNaN(naloga.izMeritev({ vrstice: [...rows.slice(0, 2), vr(330, 0.3, 0.9), vr(340, 0.4, 1.2)] })), "pri vsaki masi največ dve sili");
  assert.ok(Number.isNaN(naloga.izMeritev({ vrstice: [] })));
});

// Toleranca: skrben dijak po libeli izravna trenje (podložka na korak 0,5 mm, kot jo najde s preizkusom), časovnik
// »od spusta«, elektromagnet, vrata pri 30 in 70 cm, sedem sil (0–6 utežic na obešalu) pri skupni masi 320 g,
// premica a(F) z odsekom (kot račun pod grafom). Mora biti v 95 % vzorcev znotraj tol.
test("newton2 tolerance: a careful student lands within tol in at least 95 % of samples", () => {
  const N = 300;
  let v = 0, ujema = 0;
  for (let s = 1; s <= N; s++) {
    const B = new ProgaBench({ seed: s * 7919, skripec: true });
    B.postaviVrata(0, 0.3), B.postaviVrata(1, 0.7);
    B.izravnaj();
    B.podlozka = Math.min(8, Math.max(0, Math.round(2000 * (B.mur - B.beta)) / 2));
    B.nacin = "spust";
    while (B.prestavi("o", "v"));
    const vrstice = [], pts = [];
    for (let n = 0; n <= 6; n++) {
      if (n) B.prestavi("v", "o");
      B.spusti();
      const m = B.meritev();
      const a = (2 * (B.vrata[1].nom - PROGA.u0)) / (m.t2 * m.t2), F = B.moNaz * G_SOLA; // kot record v lab-gibanje.js
      vrstice.push(vr(Math.round((B.Mnaz + B.moNaz) * 1000), F, a));
      pts.push([Number(num(F, 3).replace(",", ".")), Number(num(a, 3).replace(",", "."))]);
    }
    assert.deepEqual(ok([LIB, TR_OK], vrstice), [true, true, true, true], `seme ${s}: vse točke za meritve`);
    const prava = naloga.resnica(B);
    assert.ok(Math.abs(prava - 0.334) < 0.003, `seme ${s}: prava masa ${prava}`);
    const m = 1 / premica(pts).a, mer = naloga.izMeritev({ vrstice });
    if (Math.abs(m - prava) / prava <= naloga.tol) v++;
    // Rezultat skrbnega dijaka izhaja iz njegovih meritev (lab-matura.js → oceni: do 2·tol od izMeritev).
    if (Math.abs(m - mer) <= 2 * naloga.tol * mer) ujema++;
  }
  assert.ok(ujema / N >= 0.99, `iz meritev: le ${ujema}/${N} do 2·tol`);
  assert.ok(v / N >= 0.95, `le ${v}/${N} znotraj ${naloga.tol * 100} %`);
});

// Igra v brskalniku: libela, preizkus trenja s potiskom (podložko začne pri vrednosti, ki bi jo učenec našel po nekaj
// poskusih, da igra ni dolga), nato časovnik od spusta in pet sil od 0,2 do 0,59 N. Vrne pričakovane točke za meritve.
export default async () => {
  const vrh = () => m.querySelector(".lab-log li");
  await gumb("Izravnaj progo");
  const B = m._labBench;
  await preklopi("vrvica pripeta", false);
  await izbira("spust", "s potiskom");
  let p = Math.min(8, Math.max(0, Math.round(2000 * (B.mur - B.beta)) / 2)), ok = false;
  for (let k = 0; k < 10 && !ok; k++) {
    await drsnik("podložka pod levo nogo", p);
    const prej = vrh();
    await gumb("Spusti voziček");
    let t = "";
    try {
      await dokler(() => vrh() !== prej && /Preizkus trenja/.test(vrh().textContent), 16000);
      t = vrh().textContent;
    } catch {}
    if (/izravnano/.test(t)) ok = true;
    else if (/preveč nagnjena/.test(t)) p = Math.max(0, p - 0.5);
    else p = Math.min(8, p + 0.5);
  }
  if (!ok) throw new Error("trenje ni izravnano");
  await preklopi("vrvica pripeta", true);
  await izbira("spust", "elektromagnet");
  await izbira("časovnik", "od spusta");
  for (let n = 0; n < 5; n++) {
    if (n) await gumb("Utežico z vozička na obešalo");
    await gumb("Spusti voziček");
    const r = vrstic();
    for (let k = 0; k < 60 && vrstic() === r; k++) {
      await wait(200);
      await gumb("Zapiši meritev");
    }
    if (vrstic() === r) throw new Error("meritev ni zapisana: " + zadnjiDnevnik());
  }
  return 4;
};
