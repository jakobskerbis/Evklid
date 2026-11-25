// Maturitetni poskus lab-hooke (public/sim/matura/lab-hooke.js), uvožen v test/laboratorij-matura.test.js:
// meritve iz dnevnika in tabele, toleranca iz simulacije skrbnega dijaka in igra v brskalniku (igra).
import test from "node:test";
import assert from "node:assert/strict";
import { MATURA } from "../../public/sim/lab-matura-naloge.js";
import { HookeBench, VZMET, G_SOLA } from "../../public/sim/lab-model-sile.js";

const ZAC = "Začetni odčitek: 4,7 cm. Podaljšek je odčitek z utežmi minus ta odčitek.";
const NIHA = "Vzmet še niha: kazalec se premika, odčitek ni zanesljiv. Počakaj ali jo umiri z roko.";
const PARA = "Gledal si od zgoraj: zaradi paralakse je odčitek za ~2 mm prevelik.";
// Vrstica tabele kot v lab-sile.js → record (glave brez oznak <i>).
const vr = (m, x, vz = "mehka") => ({ vzmet: vz, "m [g]": String(m), "F = mg [N]": ((m / 1000) * 9.81).toFixed(2).replace(".", ","), "odčitek [cm]": (4.7 + x).toFixed(1).replace(".", ","), "podaljšek x [cm]": x.toFixed(1).replace(".", ",") });
const vrsta = (mase, k = 15, vz = "mehka") => [vr(0, 0, vz), ...mase.map((m) => vr(m, (((m / 1000) * 9.81) / k) * 100, vz))];

test("Hooke matura: measurement criteria read the log and the table", () => {
  const t = MATURA["lab-hooke"];
  const ok = (dn, vrstice) => t.meritve.map((m) => m.ok({ dnevnik: dn, vrstice }));
  const pet = vrsta([50, 100, 150, 200, 250]);
  assert.deepEqual(ok([ZAC], pet), [true, true, true, true]);
  // Začetni odčitek s poševnim pogledom: točka 1 in 3 ne štejeta.
  assert.deepEqual(ok([PARA, ZAC], pet), [false, true, false, true]);
  // Kasneje nihajoča vzmet: le točka 3.
  assert.deepEqual(ok([ZAC, NIHA], pet), [true, true, false, true]);
  // Premalo mas ali premajhen razpon.
  assert.deepEqual(ok([ZAC], vrsta([50, 100, 150, 200])).slice(0, 2), [true, false]);
  assert.equal(ok([ZAC], vrsta([20, 40, 50, 100, 150]))[1], false, "največja masa 150 g");
  // Točka 1 cm nad premico (npr. po preobremenitvi, trajni podaljšek): ni na premici.
  const zamik = [...pet.slice(0, 5), vr(250, (((0.25 * 9.81) / 15) * 100) + 1)];
  assert.equal(ok([ZAC], zamik)[3], false);
  // Ponovljena meritev pri isti masi nadomesti napačno.
  assert.equal(ok([ZAC], [...zamik, vr(250, ((0.25 * 9.81) / 15) * 100)])[3], true);
  // Meritve na srednji vzmeti ne štejejo.
  assert.deepEqual(ok([ZAC], vrsta([50, 100, 150, 200, 250], 30, "srednja")), [false, false, false, false]);
  assert.deepEqual(ok([], []), [false, false, false, false]);
});

// Skrben dijak: začetni odčitek in vsi odčitki z očesom v višini kazalca pri mirni vzmeti, mase 50–250 g, odčitek na 1 mm,
// F = m · 9,81 m/s² na 0,01 N. k določi iz naklona premice skozi izhodišče ali kot povprečje F/x po točkah.
test("Hooke tolerance: a careful student lands within tol in at least 95 % of springs", () => {
  const t = MATURA["lab-hooke"];
  const N = 500;
  let vNaklon = 0, vPovp = 0;
  for (let s = 1; s <= N; s++) {
    const B = new HookeBench({ seed: s * 7919 });
    const mirno = () => {
      B.umiri();
      for (let n = 0; B.nihanje() >= VZMET.mirna && n < 1000; n++) B.step(0.1);
    };
    const x0 = B.odcitek(0).value;
    let sxy = 0, sxx = 0;
    const ki = [];
    for (const [m, ut] of [[50, [3]], [100, [4]], [150, [3, 4]], [200, [5]], [250, [3, 5]]]) {
      for (const i of [...B.obesene]) B.snemi(i);
      for (const i of ut) B.obesi(i);
      mirno();
      const x = Math.round((B.odcitek(0).value - x0) * 1000) / 10, F = Math.round((m / 1000) * G_SOLA * 100) / 100;
      sxy += x * F;
      sxx += x * x;
      ki.push(F / x);
    }
    const prava = t.resnica(B);
    assert.ok(prava >= 14.25 && prava <= 15.75);
    if (Math.abs((sxy / sxx) * 100 - prava) / prava <= t.tol) vNaklon++;
    if (Math.abs((ki.reduce((a, b) => a + b) / ki.length) * 100 - prava) / prava <= t.tol) vPovp++;
  }
  assert.ok(vNaklon / N >= 0.95, `naklon: le ${vNaklon}/${N} znotraj ${t.tol * 100} %`);
  assert.ok(vPovp / N >= 0.95, `povprečje: le ${vPovp}/${N} znotraj ${t.tol * 100} %`);
});

// Igra v brskalniku (test/laboratorij-matura.test.js): teče v testni strani po »Začni nalogo«, s kliki kot učenec.
export async function igra() {
  const lcd = () => txt(m.querySelector(".lab-lcd"));
  await gumb("Zapiši meritev"); // začetni odčitek, oko v višini kazalca
  for (const g of [[50], [100], [100, 50], [200], [200, 50]]) {
    await gumb("Snemi vse");
    for (const x of g) await gumb(x + " g");
    await gumb("Umiri vzmet");
    await wait(250);
    await dokler(() => /kazalec miruje/.test(lcd()));
    await gumb("Zapiši meritev");
  }
}
