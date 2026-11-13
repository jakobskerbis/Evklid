// Virtualni laboratorij, »Silomer in uteži« (public/sim/lab-model-sile.js): Hookov zakon, gostota, vzgon, hidrostatični tlak.
// Dovoljeno odstopanje je zapisano pri vsakem testu (docs/laboratorij.md).
import test from "node:test";
import assert from "node:assert/strict";
import {
  HookeBench, GostotaBench, VzgonBench, TlakBench, VZMETI, VZMET, UTEZI, UTEZI_MPE, VZORCI, TEKOCINE, VALJ, TEHTNICA, SILOMER,
  MANOMETER, G_LJ, G_SOLA, naklonSkoziIzhodisce, premica, vzgon, hidroTlak, makeTehtnica, tehtnicaRead, POENOSTAVITVE_SILE,
} from "../public/sim/lab-model-sile.js";
import { rng } from "../public/sim/lab-model.js";

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} ni ${b} ± ${tol}`);

// Učenec: odčita neobremenjeno vzmet, nato obeša uteži, vsakič umiri vzmet, počaka in odčita.
function hooke(seed, id, nabori, { oko = 0, cakaj = 6 } = {}) {
  const b = new HookeBench({ seed });
  b.izberi(id);
  b.step(cakaj);
  const x0 = b.odcitek(oko).value;
  const pts = [];
  for (const nabor of nabori) {
    for (const i of [...b.obesene]) b.snemi(i);
    for (const i of nabor) b.obesi(i);
    b.umiri();
    b.step(cakaj);
    const m = nabor.reduce((s, i) => s + UTEZI[i], 0) / 1000;
    pts.push([b.odcitek(oko).value - x0, m * G_SOLA]);
  }
  return { b, x0, pts, k: naklonSkoziIzhodisce(pts) };
}
// Uteži: 0:10 1:20 2:20 3:50 4:100 5:200 g
const POD_MEJO = { mehka: [[3], [4], [3, 4], [5], [3, 5]], srednja: [[3], [4], [3, 4], [5], [4, 5]], trda: [[4], [5], [4, 5], [1, 4, 5], [0, 1, 2, 3, 4, 5]] };

test("data: densities, M3 tolerances and cylinder class against literature", () => {
  // CRC Handbook (20 °C): voda 0,99821, 4 % NaCl 1,0268, etanol 0,7893, Al 2,70, Cu 8,96; Engineering ToolBox: olje 0,919–0,925,
  // jeklo 7,75–8,05, medenina 8,40–8,73, smreka 0,40–0,50, PVC 1,30–1,45, granit 2,60–2,80.
  const lit = { voda: [0.9981, 0.9983], slana: [1.0263, 1.0273], etanol: [0.7888, 0.7898], olje: [0.919, 0.925] };
  for (const [id, [a, b]] of Object.entries(lit)) assert.ok(TEKOCINE[id].rho >= a && TEKOCINE[id].rho <= b, id);
  const litZ = { aluminij: [2.69, 2.71], baker: [8.94, 8.97], jeklo: [7.75, 8.05], medenina: [8.4, 8.73], les: [0.4, 0.5], plastika: [1.3, 1.45], kamen: [2.6, 2.8] };
  for (const [id, [a, b]] of Object.entries(litZ)) assert.ok(VZORCI[id].rho >= a && VZORCI[id].rho <= b, id);
  // OIML R111-1:2004, razred M3 (mg): 10 g 20, 20 g 25, 50 g 30, 100 g 50, 200 g 100
  assert.deepEqual(Object.fromEntries(Object.entries(UTEZI_MPE).map(([n, v]) => [n, Math.round(v * 1000)])), { 10: 20, 20: 25, 50: 30, 100: 50, 200: 100 });
  assert.equal(VALJ.tol, 1.0, "ISO 4788 100 mL razred B");
  assert.ok(VALJ.a + VALJ.b <= VALJ.tol, "napaka skale ≤ razred B");
  assert.ok(SILOMER.gain * SILOMER.max + SILOMER.branje / 2 <= SILOMER.tol, "silomer ±1 razdelek");
  near(SILOMER.k, SILOMER.max / 0.1, 1e-9, "5 N na 10 cm");
});

test("g: school 9,81, Ljubljana 9,806 m/s² (GRS 80 + free air), within 0,1 %", () => {
  near(G_LJ, 9.806, 0.0005, "g Ljubljana");
  near(G_LJ / G_SOLA, 1, 0.001, "razlika");
});

test("hooke: k from the student's fit through the origin within ±3 % of the true k (3 springs × 30 seeds)", () => {
  for (const id of Object.keys(VZMETI))
    for (let seed = 1; seed <= 30; seed++) {
      const { b, k } = hooke(seed, id, POD_MEJO[id]);
      near(k / b.kNom[id], 1, 0.03, `${id} seed ${seed}`);
      near(b.kNom[id] / VZMETI[id].k, 1, VZMET.tol + 1e-9, `toleranca ${id}`);
      assert.equal(b.raztegnjena, false, `${id} se ne sme raztegniti pod mejo`);
    }
});

test("hooke: ideal spring, 100 g on 15 N/m → 6,54 cm (±0,1 mm); fit of an ideal line is exact", () => {
  const b = new HookeBench({ idealno: true });
  b.obesi(4);
  near(b.podaljsek(), (0.1 * G_LJ) / 15, 1e-9, "x");
  near(b.podaljsek(), 0.0654, 0.0001, "6,54 cm");
  const L = premica([[1, 3], [2, 5], [3, 7]]);
  near(L.a, 2, 1e-12, "a");
  near(L.b, 1, 1e-12, "b");
  near(naklonSkoziIzhodisce([[1, 2], [2, 4]]), 2, 1e-12, "k");
});

test("hooke: permanent deformation only above the elastic limit; unloaded reading then shows the residual (F − Fy)/k", () => {
  for (let seed = 1; seed <= 10; seed++) {
    const b = new HookeBench({ seed });
    b.step(10);
    const x0 = b.odcitek().value;
    b.obesi(5); // 200 g = 1,96 N < 2,5 N
    b.umiri();
    b.step(10);
    b.snemi(5);
    b.umiri();
    b.step(10);
    near(b.odcitek().value, x0, 0.0011, "pod mejo se vrne (odčitek na 1 mm)");
    assert.equal(b.raztegnjena, false);
    for (const i of [3, 4, 5]) b.obesi(i); // 350 g = 3,43 N > 2,5 N
    b.step(10);
    for (const i of [...b.obesene]) b.snemi(i);
    b.umiri();
    b.step(15);
    const ostane = (0.35 * G_LJ - 2.5) / b.kNom.mehka;
    assert.ok(b.raztegnjena);
    near(b.odcitek().value - x0, ostane, 0.003, `trajni podaljšek (seed ${seed})`);
    assert.ok(ostane > 0.05, "vidno: več kot 5 cm");
    // nova vzmet je spet cela
    b.novaVzmet("mehka");
    assert.equal(b.raztegnjena, false);
  }
});

test("hooke: reading while the spring still swings jitters by more than 1 mm; waiting removes it; parallax ±1,7 mm", () => {
  let mocno = 0;
  for (let seed = 1; seed <= 20; seed++) {
    const b = new HookeBench({ seed });
    b.obesi(4);
    b.step(0.3);
    assert.equal(b.odcitek().mirna, false);
    if (Math.abs(b.polozaj() - b.p0 - b.podaljsek()) > 0.001) mocno++;
    b.step(15);
    assert.equal(b.odcitek().mirna, true);
    near(b.odcitek(1).value - b.odcitek(0).value, VZMET.paralaksa, 0.0011, "paralaksa");
    near(b.odcitek(-1).value - b.odcitek(0).value, -VZMET.paralaksa, 0.0011, "paralaksa");
  }
  assert.ok(mocno >= 10, `nihanje premalo (${mocno})`);
});

test("hooke: masses within OIML R111 class M3 (500 seeds)", () => {
  for (let seed = 1; seed <= 500; seed++) {
    const b = new HookeBench({ seed });
    for (const u of b.utezi) assert.ok(Math.abs(u.m - u.n) <= UTEZI_MPE[u.n] + 1e-12, `${u.n} g: ${u.m}`);
  }
});

// Učenec: natoči vodo, odčita V₁, vzorec previdno potisne v valj, odčita V₂, stehta vzorec.
function gostota(seed, id, i, { V1 = 50, nacin = "zdrsni", zica = false, menisk = "dno" } = {}) {
  const b = new GostotaBench({ seed });
  b.nalij("voda", V1);
  const a = b.odcitekV(menisk).value;
  b.potopi(id, i, { nacin, zica });
  const c = b.odcitekV(menisk).value;
  const m = b.tehtajVzorec(id, i).value;
  return { b, rho: m / (c - a), V: c - a, m };
}

test("density: aluminium 30 cm³ by displacement = 2,70 g/cm³ ±3 % (100 seeds); all sinking samples ±6 % with their largest size", () => {
  for (let seed = 1; seed <= 100; seed++) near(gostota(seed, "aluminij", 2).rho, 2.7, 0.03 * 2.7, `Al seed ${seed}`);
  for (const id of ["jeklo", "medenina", "baker", "plastika", "kamen"])
    for (let seed = 1; seed <= 20; seed++) near(gostota(seed, id, 2).rho / VZORCI[id].rho, 1, 0.06, `${id} seed ${seed}`);
});

test("density: wood floats (computed density = water) unless pushed under with a thin wire (0,45 ±5 %)", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const p = gostota(seed, "les", 2);
    assert.equal(p.b.vzorec.plava, true);
    near(p.rho, 1.0, 0.04, "plava: izgleda kot voda");
    const z = gostota(seed, "les", 2, { zica: true });
    near(z.rho / 0.45, 1, 0.05, "z žico");
  }
});

test("density: bubble gives a lower density, sample not fully submerged a higher one, meniscus top matters only for liquids", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const ok = gostota(seed, "aluminij", 2), meh = gostota(seed, "aluminij", 2, { nacin: "spusti" });
    assert.ok(meh.b.vzorec.meh >= 0.4 && meh.b.vzorec.meh <= 1.0);
    assert.ok(meh.rho < ok.rho, `mehurček (seed ${seed})`);
    const plitvo = gostota(seed, "aluminij", 2, { V1: 15 });
    assert.equal(plitvo.b.vzorec.potopljen, false);
    assert.ok(plitvo.rho > 1.04 * ok.rho, `ni potopljen (seed ${seed})`);
    // oba odčitka pri vrhu: napaka se odšteje (±0,5 mL)
    near(gostota(seed, "aluminij", 2, { menisk: "vrh" }).V, ok.V, 0.51, "vrh − vrh");
  }
  // tekočina: m/V z odčitkom pri dnu ±3 %, pri vrhu premalo
  for (const id of Object.keys(TEKOCINE))
    for (let seed = 1; seed <= 20; seed++) {
      const b = new GostotaBench({ seed });
      const m0 = b.tehtajValj().value;
      b.nalij(id, 60);
      const m = b.tehtajValj().value - m0, rho = m / b.odcitekV().value, rhoVrh = m / b.odcitekV("vrh").value;
      near(rho / TEKOCINE[id].rho, 1, 0.03, `${id} seed ${seed}`);
      assert.ok(rhoVrh < rho, `${id}: vrh meniska`);
    }
});

test("density: measuring cylinder within ISO 4788 class B (±1,0 mL) and balance within ±0,1 g (500 seeds)", () => {
  for (let seed = 1; seed <= 500; seed++) {
    const b = new GostotaBench({ seed });
    for (const V of [20, 50, 80, 95]) {
      b.tek = { id: "voda", V };
      assert.ok(Math.abs(b.odcitekV().value - V) <= VALJ.tol + VALJ.korak / 2, `valj ${V} mL (seed ${seed})`);
    }
    const t = makeTehtnica(rng(seed));
    for (const g of [0, 10.03, 123.47, 599.96]) assert.ok(Math.abs(tehtnicaRead(t, g).value - g) <= TEHTNICA.tol + 1e-9, `tehtnica ${g} g`);
  }
});

test("buoyancy: 100 cm³ in water = 0,981 N ±2 %; salt water more, ethanol and oil less; student's readings ±0,06 N", () => {
  near(vzgon(TEKOCINE.voda.rho, 100), 0.9982 * 9.806 * 0.1, 1e-9, "voda: F = ρ g V (99,82 g · 9,806 m/s²)");
  near(vzgon(TEKOCINE.voda.rho, 100), 0.981, 0.003 * 0.981, "voda ≈ 0,981 N (±0,3 %)");
  assert.ok(vzgon(TEKOCINE.slana.rho, 100) > vzgon(TEKOCINE.voda.rho, 100) * 1.02);
  assert.ok(vzgon(TEKOCINE.olje.rho, 100) < vzgon(TEKOCINE.voda.rho, 100));
  assert.ok(vzgon(TEKOCINE.etanol.rho, 100) < vzgon(TEKOCINE.olje.rho, 100));
  for (let seed = 1; seed <= 50; seed++)
    for (const tek of Object.keys(TEKOCINE)) {
      const b = new VzgonBench({ seed });
      b.nicla = true;
      b.tek = tek;
      const F0 = b.odcitek().value;
      b.s = 0.09; // ves pod gladino, nad dnom
      assert.equal(b.globina(), b.H);
      assert.equal(b.dno(), false);
      const Fv = F0 - b.odcitek().value;
      near(Fv, vzgon(TEKOCINE[tek].rho, b.V), 0.06, `${tek} seed ${seed}`);
      near(b.V, 100, 0.5, "prostornina valja");
    }
});

test("buoyancy: grows with the immersed volume (level rise included), touching the bottom drops the reading, zero offset cancels in F_vzg", () => {
  const b = new VzgonBench({ idealno: true });
  b.s = 0.02;
  const d = b.globina();
  near(d, (0.02 * b.A) / (b.A - b.a), 1e-12, "dvig gladine");
  near(b.Vizp(), b.a * d * 1e6, 1e-9, "V_izp");
  near((b.m / 1000) * G_LJ - b.sila(), vzgon(0.9982, b.Vizp()), 1e-12, "Arhimed");
  b.s = 0.1;
  const prosto = b.sila();
  b.s = b.h0 + 0.01; // 1 cm niže od dna
  assert.ok(b.dno());
  near(prosto - b.sila(), 0.5, 1e-9, "dno: 50 N/m · 1 cm");
  for (let seed = 1; seed <= 30; seed++) {
    const c = new VzgonBench({ seed });
    c.tek = "voda";
    const A0 = c.odcitek().value;
    assert.ok(A0 - c.sila() >= 0.06, "ničla ni naravnana: teža preveč");
    c.s = 0.09;
    const Fv = A0 - c.odcitek().value;
    near(Fv, vzgon(TEKOCINE.voda.rho, c.V), 0.06, "razlika se odšteje");
    c.nicla = true;
    c.s = 0;
    c.obesen = false;
    assert.ok(Math.abs(c.odcitek().value) <= SILOMER.branje / 2 + 1e-9, "naravnana ničla");
  }
});

test("pressure: p at 10 cm of water = 981 Pa (±0,5 %); water U-tube shows Δh = 10 cm ±3 %, oil less, salt water more; orientation does not matter", () => {
  near(hidroTlak(TEKOCINE.voda.rho, 0.1), 981, 0.005 * 981, "p");
  const dh = (tek, h, smer = "dol", seed = 1) => {
    const b = new TlakBench({ seed });
    b.tek = tek;
    b.smer = smer;
    b.h = h;
    b.ustali();
    return b.odcitek().dh;
  };
  for (let seed = 1; seed <= 20; seed++) {
    near(dh("voda", 0.1, "dol", seed), 100, 3, "voda 10 cm");
    assert.ok(dh("olje", 0.1, "dol", seed) < 94);
    // Δh = ρ_tekočine / ρ_vode · h (· 0,99 opna), na 1 mm
    for (const tek of ["olje", "slana", "etanol"])
      near(dh(tek, 0.1, "dol", seed), (100 * MANOMETER.opna * TEKOCINE[tek].rho) / MANOMETER.rho, 1, `${tek}: razmerje gostot`);
    assert.ok(dh("slana", 0.1, "dol", seed) > 101);
    assert.equal(dh("voda", 0.2, "gor", seed), dh("voda", 0.2, "stran", seed));
    assert.equal(dh("voda", 0.2, "gor", seed), dh("voda", 0.2, "dol", seed));
  }
  // linearno z globino: 5, 10, 20 cm
  const p = [0.05, 0.1, 0.2].map((h) => [h * 100, dh("voda", h)]);
  near(premica(p).a, 9.9, 0.1, "mm na cm");
  near(premica(p).b, 0, 1, "skozi izhodišče");
});

test("pressure: one leg shows half of Δh; a leaking tube drifts to zero; overfilling spills the manometer", () => {
  const b = new TlakBench({ seed: 3 });
  b.h = 0.2;
  b.ustali();
  const o = b.odcitek();
  near(o.desni, o.dh / 2, 1, "en krak");
  near(o.levi, -o.dh / 2, 1, "drugi krak");
  b.pusca = true;
  for (let i = 0; i < 300; i++) b.step(0.2); // 60 s
  assert.ok(b.odcitek().dh < 0.05 * o.dh, `pušča: ${b.odcitek().dh}`);
  const c = new TlakBench({ seed: 3 });
  c.tek = "slana";
  c.h = MANOMETER.hMax;
  c.ustali();
  assert.equal(c.prelito, true);
  assert.ok(Number.isNaN(c.odcitek().dh));
  c.napolni();
  c.ustali();
  assert.equal(c.odcitek().dh, 0, "napolnjen pri isti globini kaže 0");
});

test("deterministic with a seed; simplifications listed for all four experiments", () => {
  const a = hooke(7, "srednja", POD_MEJO.srednja), b = hooke(7, "srednja", POD_MEJO.srednja);
  assert.deepEqual(a.pts, b.pts);
  assert.equal(gostota(7, "kamen", 1, { nacin: "spusti" }).rho, gostota(7, "kamen", 1, { nacin: "spusti" }).rho);
  for (const k of ["hooke", "gostota", "vzgon", "tlak"]) assert.ok(POENOSTAVITVE_SILE[k].length >= 4, k);
});
