// Maturitetni poskus lab-lom (public/sim/matura/lab-lom.js), uvožen v test/laboratorij-matura.test.js:
// meritve iz dnevnika in tabele, toleranca iz simulacije skrbnega dijaka in igra v brskalniku (igra).
import test from "node:test";
import assert from "node:assert/strict";
import { MATURA } from "../../public/sim/lab-matura-naloge.js";
import { LomBench, SNOVI, naklon } from "../../public/sim/lab-model-optika.js";

const RAD = Math.PI / 180;
const PLOSKEV = "Kote si meril od ploskve. Vpadni, odbojni in lomni kot merimo od vpadne pravokotnice, sicer Snellov zakon ne velja.";
const MIMO = "Laser je 1,5 mm mimo središča: žarek ne zadene sredine ravne ploskve, zato se lomi še na okrogli ploskvi in odčitek je napačen. Zamik nastavi na 0.";
const LASER = "Laser je vklopljen. Nikoli ne glej v žarek in ga ne usmeri v oči sošolcev, tudi ne prek zrcala.";
const z = (x, d) => x.toFixed(d).replace(".", ",");
// Vrstica tabele kot v lab-optika.js → labLom → record.
const vr = (a, snov = "zrak → akril") => {
  const b = Math.asin(Math.sin(a * RAD) / 1.488) / RAD;
  return { "snov, smer": snov, "α": `${a} °`, odbojni: `${z(a, 1)} °`, "β": `${z(Math.round(b * 2) / 2, 1)} °`, "sin α": z(Math.sin(a * RAD), 3), "sin β": z(Math.sin(b * RAD), 3) };
};
// Kot od ploskve (90° − kot): pri prehodu iz zraka v akril je potem β > α.
const odPloskve = (a) => ({ ...vr(a), "α": `${90 - a} °`, "β": `${z(90 - Math.asin(Math.sin(a * RAD) / 1.488) / RAD, 1)} °` });

test("refraction matura: measurement criteria read the log and the table", () => {
  const t = MATURA["lab-lom"];
  const ok = (dn, vrstice) => t.meritve.map((m) => m.ok({ dnevnik: dn, vrstice }));
  const vse = [10, 20, 30, 40, 50, 60, 70, 80].map((a) => vr(a));
  assert.deepEqual(ok([LASER], vse), [true, true, true, true]);
  assert.deepEqual(ok([LASER], vse.slice(0, 5)), [false, false, true, true], "5 kotov do 50°");
  assert.deepEqual(ok([LASER], [30, 40, 50, 60, 70, 80].map((a) => vr(a))).slice(0, 2), [true, false], "najmanjši kot 30°");
  assert.deepEqual(ok([LASER, PLOSKEV], vse), [true, true, false, true]);
  assert.deepEqual(ok([LASER, MIMO], vse), [true, true, true, false]);
  // Vrstice, merjene od ploskve, in vrstice iz akrila v zrak ne štejejo za lom iz zraka v akril.
  assert.deepEqual(ok([LASER], [10, 20, 30, 40, 50, 60, 70, 80].map(odPloskve)), [false, false, false, false]);
  assert.deepEqual(ok([LASER], [10, 20, 30].map((a) => vr(a, "akril → zrak"))), [false, false, false, false]);
  assert.deepEqual(ok([], []), [false, false, false, false]);
});

// Skrben dijak: od vpadne pravokotnice, brez zamika, α = 10°, 20° … 80°, β na pol stopinje, sinusi na tri decimalke.
// n določi iz naklona premice sin β(sin α) ali kot povprečje sin α / sin β po točkah.
test("refraction tolerance: a careful student lands within tol in at least 95 % of runs", () => {
  const t = MATURA["lab-lom"];
  assert.equal(t.resnica(new LomBench({ seed: 3 })), SNOVI.pmma.n, "prava vrednost je lomni količnik akrila iz modela");
  const N = 500;
  let vNaklon = 0, vPovp = 0;
  for (let s = 1; s <= N; s++) {
    const B = new LomBench({ seed: s * 7919 });
    B.laser = true;
    const pts = [];
    for (let a = 10; a <= 80; a += 10) {
      B.nastavi(a);
      const r3 = (x) => Math.round(x * 1000) / 1000;
      pts.push([r3(Math.sin(a * RAD)), r3(Math.sin(B.odcitaj().lom * RAD))]);
    }
    const prava = t.resnica(B);
    if (Math.abs(1 / naklon(pts) - prava) / prava <= t.tol) vNaklon++;
    if (Math.abs(pts.reduce((v, [x, y]) => v + x / y, 0) / pts.length - prava) / prava <= t.tol) vPovp++;
  }
  assert.ok(vNaklon / N >= 0.95, `naklon: le ${vNaklon}/${N} znotraj ${t.tol * 100} %`);
  assert.ok(vPovp / N >= 0.95, `povprečje: le ${vPovp}/${N} znotraj ${t.tol * 100} %`);
});

// Igra v brskalniku (test/laboratorij-matura.test.js): teče v testni strani po »Začni nalogo«, s kliki kot učenec.
export async function igra() {
  const drsnik = async (t, v) => {
    const r = [...m.querySelectorAll(".demo-slider-label")].find((x) => txt(x).startsWith(t))?.parentElement.querySelector('input[type="range"]');
    if (!r) throw new Error("ni drsnika " + t);
    r.value = String(v);
    r.dispatchEvent(new Event("input", { bubbles: true }));
    await wait(80);
  };
  await stikalo("laser vklopljen");
  for (let a = 10; a <= 80; a += 10) {
    await drsnik("vpadni kot α", a);
    await gumb("Zapiši meritev");
  }
}
