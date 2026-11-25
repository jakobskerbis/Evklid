// Maturitetni poskus lab-grelnik (public/sim/matura/lab-grelnik.js), uvožen v test/laboratorij-matura.test.js:
// meritve iz dnevnika in tabele, toleranca iz simulacije skrbnega dijaka in igra v brskalniku (igra).
import test from "node:test";
import assert from "node:assert/strict";
import { MATURA } from "../../public/sim/lab-matura-naloge.js";
import { GrelnikBench, VODA } from "../../public/sim/lab-model-toplota.js";

// Vrstice dnevnika kot v lab-toplota.js → labGrelnik (pour, weigh, setOn, record, say, potT).
const NALIL = "V čaši je sveža voda iz pipe (približno 200 g). Stehtaj jo.";
const TEH = "Tehtnica: 201,3 g vode.";
const VKL = "Grelec je vklopljen, štoparica teče.";
const IZK = "Grelec je izklopljen (segreval je 300,0 s). Premešaj vodo in odčitaj najvišjo temperaturo.";
const NEPREM = "Voda ni premešana: termometer ob strani kaže manj od povprečne temperature.";
const DVIGNIL = "Grelec si dvignil iz vode.";
const PRENAP = "Na grelcu je 13,5 V, več od nazivnih 12 V. Grelec se bolj greje, kot je zanj varno.";
// Kontekst kot lab-vodeno.js → kontekst (dnevnik, vrstice, zadnji).
const ctx = (dn, vrstice) => ({
  dnevnik: dn,
  vrstice,
  zadnji: (...res) => {
    for (let k = dn.length - 1; k >= 0; k--) {
      const i = res.findIndex((re) => re.test(dn[k]));
      if (i >= 0) return i;
    }
    return -1;
  },
});
const z = (x, d) => x.toFixed(d).replace(".", ",");
const vr = (t, T, I = 4.05, rocni = false) => ({ "t [s]": z(t, rocni ? 1 : 0), "U [V]": I > 0.2 ? "11,72" : "0,00", "I [A]": z(I, 2), "T [°C]": z(T, 1) });
// Segrevanje 300 s od 18,0 °C do 31,4 °C, po izklopu samodejni zapis in ročni zapis z mešanjem.
const tabela = (Tmax = 32.0) => [vr(0, 18.0), ...Array.from({ length: 10 }, (_, i) => vr(30 * (i + 1), 18 + 1.34 * (i + 1))), vr(330, Tmax - 0.4, 0.01), vr(341.5, Tmax, 0.01, true)];

test("heater matura: measurement criteria read the log and the table", () => {
  const t = MATURA["lab-grelnik"];
  const ok = (dn, vrstice = tabela()) => t.meritve.map((m) => m.ok(ctx(dn, vrstice)));
  assert.deepEqual(ok([TEH, VKL, IZK]), [true, true, true, true]);
  assert.deepEqual(ok([NALIL, TEH, VKL, IZK]), [true, true, true, true]);
  // Tehtal je pred nalivanjem ali šele po vklopu.
  assert.equal(ok([TEH, NALIL, VKL, IZK])[0], false);
  assert.equal(ok([VKL, TEH, IZK])[0], false);
  // Grelec zunaj vode ali prek 12 V.
  assert.deepEqual(ok([TEH, VKL, DVIGNIL, IZK]).slice(0, 2), [true, false]);
  assert.equal(ok([TEH, VKL, PRENAP, IZK])[1], false);
  // Voda se je segrela le za 8 °C.
  assert.equal(ok([TEH, VKL, IZK], [vr(0, 18.0), vr(150, 24.0), vr(200, 25.6, 0.01), vr(211.5, 26.0, 0.01, true)])[2], false);
  // Grelec še greje: ni končne temperature.
  assert.deepEqual(ok([TEH, VKL]).slice(2), [false, false]);
  // Ročni zapis brez mešanja (opozorilo) ne šteje.
  assert.equal(ok([TEH, VKL, IZK, NEPREM])[3], false);
  assert.equal(ok([TEH, VKL, IZK], tabela().slice(0, -1))[3], false, "le samodejni zapis po izklopu");
  assert.deepEqual(ok([], []), [false, false, false, false]);
});

test("heater matura: the true efficiency comes from the model's true values", () => {
  const t = MATURA["lab-grelnik"];
  const B = new GrelnikBench({ seed: 5 });
  assert.ok(Number.isNaN(t.resnica(B)), "brez segrevanja ni izkoristka");
  // Idealni grelec (brez izgub): vse električno delo ostane v vodi, izkoristek je 100 %.
  const I = new GrelnikBench({ seed: 5, idealno: true });
  I.tekla = true;
  I.on = true;
  I.step(120);
  I.on = false;
  I.step(30);
  assert.ok(Math.abs(t.resnica(I) - 100) < 0.01, `idealni grelec: ${t.resnica(I)}`);
});

// Skrben dijak: 200 g vode stehta, vklopi pri 12 V, 300 s segreva in vsakih 30 s zapiše U in I, po izklopu meša in vsakih
// 5 s odčita temperaturo, za T₂ vzame najvišjo, za t čas iz dnevnika (na 0,1 s).
test("heater tolerance: a careful student lands within tol in at least 95 % of heaters", () => {
  const t = MATURA["lab-grelnik"];
  const N = 500;
  let v = 0;
  for (let s = 1; s <= N; s++) {
    const B = new GrelnikBench({ seed: s * 7919 });
    B.step(20);
    const m = B.readM().value / 1000, T1 = B.readT().value;
    B.tekla = true;
    B.on = true;
    const U = [], I = [];
    for (let k = 1; k <= 10; k++) B.step(30), U.push(B.readV().value), I.push(B.readA().value);
    B.on = false;
    const tOn = Math.round(B.tOn * 10) / 10;
    B.mesaj = true;
    let T2 = -Infinity;
    for (let k = 0; k < 24; k++) B.step(5), (T2 = Math.max(T2, B.readT().value));
    const povp = (a) => a.reduce((x, y) => x + y) / a.length;
    const eta = (100 * m * VODA.c * (T2 - T1)) / (povp(U) * povp(I) * tOn);
    const prava = t.resnica(B);
    assert.ok(prava > 80 && prava < 95, `prava vrednost ${prava}`);
    if (Math.abs(eta - prava) / prava <= t.tol) v++;
  }
  assert.ok(v / N >= 0.95, `le ${v}/${N} znotraj ${t.tol * 100} %`);
});

// Igra v brskalniku (test/laboratorij-matura.test.js): teče v testni strani po »Začni nalogo«, s kliki kot učenec.
export async function igra() {
  const izbira = async (t, b) => {
    const box = [...m.querySelectorAll(".demo-slider-label")].find((x) => txt(x) === t)?.parentElement;
    const g = [...(box?.querySelectorAll(".seg-btn") || [])].find((x) => txt(x).startsWith(b));
    if (!g) throw new Error("ni izbire " + t + " " + b);
    g.click();
    await wait(120);
  };
  const vrstic = () => m.querySelectorAll("table.lab-table tbody tr").length;
  await gumb("Stehtaj vodo");
  await gumb("Vklopi grelec");
  await izbira("hitrost časa", "×60");
  await dokler(() => vrstic() >= 11, 30000); // t = 0 in 10 samodejnih zapisov: 300 s
  await gumb("Izklopi grelec");
  await izbira("hitrost časa", "×10");
  await stikalo("mešaj z mešalno palčko");
  await wait(3000); // 30 s: voda se premeša, grelec odda preostalo toploto
  for (let k = 0; k < 3; k++) await gumb("Zapiši meritev"), await wait(400);
}
