// Virtualni laboratorij, kemijske reakcije (public/sim/lab-model-reakcije.js): hitrost reakcije, energija pri reakcijah, plamenska reakcija.
// Dovoljeno odstopanje je zapisano pri vsakem testu (docs/laboratorij.md).
import test from "node:test";
import assert from "node:assert/strict";
import {
  MarmorBench, MagnezijBench, TiosulfatBench, PeroksidBench, KalorimeterBench, PlamenBench, Brizga, BRIZGA, MARMOR_OBLIKE, MARMOR_MASE, KONC_HCL,
  TIO, TIO_VOLUMNI, casKriza, KATALIZATORJI, PEROKSID_V, TRDNE, DH, ekstrapolacija, entalpija, CRTE, IONI, spekterSoli, barvaSpektra, delezSvetlosti,
  cmf, valovRgb, kobalt, energijaFotona, reakcijskiCas, CLOVEK, tehtnicaR, tehtnicaBeri, TEHTNICA_R, POENOSTAVITVE_REAKCIJE, MG_TRAK,
} from "../public/sim/lab-model-reakcije.js";
import { M } from "../public/sim/lab-model.js";

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} ni ${b} ± ${tol}`);
const rel = (a, b, tol, msg) => assert.ok(Math.abs(a / b - 1) <= tol, `${msg}: ${a} ni ${b} ± ${tol * 100} %`);
const fin = (x, msg) => assert.ok(Number.isFinite(x), `${msg}: ${x}`);

function marmor({ c = 1, oblika = "srednji", m = 5, T = 20, seed = 1, idealno = true, vata = true } = {}) {
  const B = new MarmorBench({ seed, idealno, T: 20 });
  B.ocala = true;
  B.vata = vata;
  B.kopel(T);
  B.nalij(c);
  B.dodaj(oblika, m);
  return B;
}
function magnezij({ c = 1, cm = 5, seed = 1, idealno = true, ...rest } = {}) {
  const B = new MagnezijBench({ seed, idealno, T: 20 });
  Object.assign(B, { ocala: true }, rest);
  B.nalij(c);
  B.dodaj(cm);
  return B;
}
function tio(V, T, { seed = 1, idealno = true } = {}) {
  const B = new TiosulfatBench({ seed, idealno, T: 20 });
  B.ocala = true;
  B.kopel(T);
  B.pripravi(V);
  B.zlij();
  while (B.kriz == null && B.t < 3000) B.step(0.2);
  return B.kriz;
}
function peroksid(kat, { V = 5, T = 20, seed = 1, idealno = true, ...rest } = {}) {
  const B = new PeroksidBench({ seed, idealno, T: 20 });
  Object.assign(B, { ocala: true }, rest);
  B.kopel(T);
  B.nalij(V);
  B.dodaj(kat);
  return B;
}
// Kalorimeter: prva raztopina 2 min, zlivanje, nato odčitki vsakih 30 s 8 min; ΔH z ekstrapolacijo kot učenec.
function nevtralizacija({ posoda = "stiropor", pokrov = true, mesaj = true, kislina = "HCl", c = 1, seed = 1, idealno = true, termometer = "digitalni" } = {}) {
  const B = new KalorimeterBench({ seed, idealno });
  Object.assign(B, { posoda, pokrov, mesaj, termometer, ocala: true });
  B.nalij(kislina, c, 50);
  const pred = [];
  for (let i = 0; i < 4; i++) pred.push(B.readT().value), B.step(30);
  const T1 = pred.reduce((s, x) => s + x, 0) / pred.length;
  const d = B.pripravi2(c, 50);
  const T2 = Math.round(d.T * 10) / 10;
  B.zlij();
  const pts = [];
  for (let t = 0; t <= 480; t += 30) pts.push([B.t, B.readT().value]), B.step(30);
  const e = ekstrapolacija(pts, B.tMix);
  const Tz = (T1 + T2) / 2;
  return { B, e, pts, dH: entalpija({ m: 100, dT: e.T - Tz, n: B.nReakcija() }), dHmax: entalpija({ m: 100, dT: Math.max(...pts.map((p) => p[1])) - Tz, n: B.nReakcija() }) };
}

// ---------------------------------------------------------------- hitrost: marmor
test("marble: total mass loss = stoichiometric CO₂ of the limiting reagent within 2 % (chips with acid limiting, powder with CaCO₃ limiting)", () => {
  for (const [o, m, c] of [["srednji", 5, 1], ["srednji", 5, 2], ["prah", 1, 2], ["mali", 2, 2], ["srednji", 1, 1]]) {
    const B = marmor({ c, oblika: o, m });
    const m0 = B.masa();
    B.step(2400);
    const n = Math.min(m / M.CaCO3, (c * 40) / 1000 / 2);
    rel(m0 - B.masa(), n * M.CO2, 0.02, `${o} ${m} g, ${c} M`);
  }
});

test("marble: powder > small > medium > large chips (initial rate), rate ∝ [H⁺] (order 1 within 5 %), warmer bath is faster", () => {
  const r0 = (o, c = 1, T = 20) => {
    const B = marmor({ oblika: o, c, m: 2, T });
    B.step(0.5);
    return B.rate;
  };
  assert.ok(r0("prah") > r0("mali") && r0("mali") > r0("srednji") && r0("srednji") > r0("veliki"), "vrstni red velikosti");
  rel(r0("srednji", 2) / r0("srednji", 0.5), 4, 0.05, "red 1 glede na H⁺");
  const k30 = r0("srednji", 1, 30) / r0("srednji", 1, 20);
  assert.ok(k30 > 1.1 && k30 < 1.4, `topleje hitreje, a difuzijsko omejeno (Ea 15 kJ/mol): ${k30}`);
  // v prvih 60 s izgubi prah več mase kot koščki
  const loss = (o) => {
    const B = marmor({ oblika: o, c: 1, m: 1 });
    const a = B.masa();
    B.step(60);
    return a - B.masa();
  };
  assert.ok(loss("prah") > 2 * loss("srednji"), "prah hitreje");
});

test("marble: dissolved CO₂ and heavy CO₂ in the flask make the early mass loss smaller, then escape (no lost mass)", () => {
  const B = marmor({ c: 2, oblika: "mali", m: 5 });
  const m0 = B.masa();
  B.step(600);
  const prod = B.nCO2 * M.CO2, izg = m0 - B.masa();
  assert.ok(prod - izg > 0.02 && prod - izg < 0.15, `po 10 min še ni ves CO₂ ušel: ${prod - izg}`);
  assert.ok(B.st.nRaz > 0, "CO₂ raztopljen");
  B.step(3000);
  near(B.nCO2 * M.CO2 - (m0 - B.masa()), -0.01, 0.015, "na koncu ostane le izhlapevanje");
});

test("mistake: no cotton wool → acid spray, mass loss too large; powder with 2 M overflows with foam", () => {
  const a = marmor({ c: 2, oblika: "mali", m: 5, vata: true }), b = marmor({ c: 2, oblika: "mali", m: 5, vata: false });
  const ma = a.masa(), mb = b.masa();
  a.step(900);
  b.step(900);
  const la = ma - a.masa(), lb = mb - b.masa();
  assert.ok(lb > la * 1.03, `brez vate večja izguba: ${lb} > ${la}`);
  assert.ok(lb - la < 0.3, "a ne absurdno velika");
  const p = marmor({ c: 2, oblika: "prah", m: 5 });
  p.step(20);
  assert.ok(p.prelito && p.events.some((e) => e.type === "pena"), "pena čez rob");
  const q = marmor({ c: 1, oblika: "srednji", m: 5 });
  q.step(600);
  assert.ok(!q.prelito, "koščki se ne prelijejo");
});

test("balance: reading within ±0,01 g of the true mass when calm (200 seeds), 0,02 g more while it fizzes", () => {
  for (let s = 1; s <= 200; s++) {
    const B = marmor({ seed: s, idealno: false, c: 0.5, oblika: "veliki", m: 1 });
    B.step(1200);
    const m = B.masa(), o = B.beriMaso();
    assert.ok(Math.abs(o.value - m) <= 0.01 + 0.0005 * m + 1e-9, `seme ${s}: ${o.value} vs ${m}`);
  }
  const t = tehtnicaR(() => 0.5);
  assert.equal(tehtnicaBeri(t, 400).text, "OL");
  assert.equal(TEHTNICA_R.d, 0.01);
});

test("goggles: without goggles nothing is poured (every bench)", () => {
  for (const B of [new MarmorBench(), new MagnezijBench(), new TiosulfatBench(), new PeroksidBench()]) {
    const r = B.nalij ? B.nalij(1) : B.zlij();
    assert.equal(r.why, "ocala");
  }
  const T = new TiosulfatBench();
  T.pripravi(50);
  assert.equal(T.zlij().why, "ocala");
  const K = new KalorimeterBench();
  assert.equal(K.nalij("HCl", 1, 50).why, "ocala");
  const P = new PlamenBench();
  assert.equal(P.zajemi("Na").why, "ocala");
});

// ---------------------------------------------------------------- hitrost: magnezij in brizga
test("Mg + HCl: initial rate ∝ c (rate law order 1, within 5 %), n(H₂) = n(Mg) and V within the syringe spec", () => {
  const r = (c) => {
    const B = magnezij({ c, cm: 5 });
    B.step(0.2);
    return B.hitrost();
  };
  rel(r(2) / r(1), 2, 0.05, "2 M / 1 M");
  rel(r(1) / r(0.5), 2, 0.05, "1 M / 0,5 M");
  const B = magnezij({ c: 1, cm: 5 });
  B.step(600);
  rel(B.K.nH2, B.K.kos.m0 / 24.305, 0.005, "n(H₂) = n(Mg)");
  const Vid = B.brizga.idealna(B.K.nH2 - B.raztopljeno(), B.T);
  const o = B.brizga.beri();
  assert.ok(Math.abs(o.value - Vid) <= BRIZGA.kal + BRIZGA.jit + 0.25 + 0.9, `odčitek ${o.value} vs ${Vid}`);
  assert.ok(Vid > 50 && Vid < 65, `5 cm traku ~55 mL: ${Vid}`);
});

test("syringe: smooth plunger lags < 1 mL; stuck plunger lags more and jumps; leaking stopper loses gas; too much Mg pops the plunger", () => {
  const g = magnezij({ cm: 5 }), s = magnezij({ cm: 5, zatika: true }), l = magnezij({ cm: 5, pusca: true });
  for (const B of [g, s, l]) B.step(400);
  const Vid = g.brizga.idealna(g.K.nH2 - g.raztopljeno(), g.T);
  assert.ok(Vid - g.brizga.x < 1, `gladka: ${Vid - g.brizga.x}`);
  assert.ok(Vid - s.brizga.x > 3, `zatika se: ${Vid - s.brizga.x}`);
  assert.ok(l.brizga.x < g.brizga.x - 3, `pušča: ${l.brizga.x} < ${g.brizga.x}`);
  const p = magnezij({ cm: 12, c: 2 });
  p.step(300);
  assert.ok(p.brizga.izpadel && p.events.some((e) => e.type === "bat"), "bat izpade");
  assert.equal(p.brizga.beri().text, "bat je izpadel");
  const o = magnezij({ cm: 8, c: 2 });
  o.step(15);
  // 8 cm: ~90 mL, ne izpade
  o.step(600);
  assert.ok(!o.brizga.izpadel, "8 cm ne izpade");
});

// ---------------------------------------------------------------- hitrost: tiosulfat
test("thiosulfate: 1/t ∝ c within 5 %, ~45 s at 40 g/L and 20 °C, Arrhenius Q10 = 2,0 ± 0,2 between 20 and 30 °C", () => {
  const t = TIO_VOLUMNI.map((V) => tio(V, 20));
  const k = t.map((x, i) => 1 / x / TIO_VOLUMNI[i]);
  for (const x of k) rel(x, k[4], 0.05, "1/t ∝ c");
  assert.ok(t[4] > 40 && t[4] < 55, `t(50 mL) = ${t[4]}`);
  const q10 = tio(40, 20) / tio(40, 30);
  near(q10, 2, 0.2, "Q10");
  rel(tio(30, 20), casKriza(((TIO.c0 * 30) / 50) * (50 / 55), 20), 0.03, "analitično (brez ohlajanja)");
});

test("stopwatch: human reaction time 0,15–0,4 s (mean ~0,25 s); starting late shortens the measured time", () => {
  let s = 0;
  const r = (() => { let a = 7; return () => ((a = (a * 16807) % 2147483647) / 2147483647); })();
  for (let i = 0; i < 500; i++) {
    const x = reakcijskiCas(r);
    assert.ok(x >= CLOVEK.min && x <= CLOVEK.max);
    s += x;
  }
  near(s / 500, 0.25, 0.02, "povprečje");
  const B = new TiosulfatBench({ seed: 3, T: 20 });
  B.ocala = true;
  B.pripravi(50);
  B.zlij();
  B.step(5);
  B.zazeni(0); // pozen začetek: 5 s po zlitju
  while (B.kriz == null) B.step(0.1);
  B.step(B.kriz - B.t);
  const t = B.ustavi();
  assert.ok(t < B.kriz - 4.5, `prepozno zagnana štoparica: ${t} vs ${B.kriz}`);
});

// ---------------------------------------------------------------- hitrost: H₂O₂ in katalizatorji
test("H₂O₂: MnO₂, KI, liver, raw potato faster than none; boiled catalase ≈ none; total O₂ = n(H₂O₂)/2; warm bath faster, >55 °C kills catalase", () => {
  const v = (kat, T = 20) => {
    const B = peroksid(kat, { T });
    B.step(60);
    return B.brizga.idealna(B.nO2 - B.st.nRaz, B.T);
  };
  const brez = v("brez");
  assert.ok(brez < 1, `brez katalizatorja ~0: ${brez}`);
  for (const k of ["mno2_05", "mno2_01", "ki", "jetra", "krompir", "krompirNariban"]) assert.ok(v(k) > brez + 5, `${k} hitreje`);
  assert.ok(v("mno2_05") > v("mno2_01"), "več MnO₂ hitreje");
  assert.ok(v("krompirNariban") > v("krompir"), "nariban krompir (večja površina) hitreje");
  for (const k of ["krompirKuhan", "jetraKuhana"]) near(v(k), brez, 0.5, `${k} ≈ brez`);
  const B = peroksid("mno2_05");
  B.step(900);
  rel(B.nO2, B.nO2Stehiometrija(), 0.01, "ves O₂");
  assert.ok(v("krompir", 35) > v("krompir", 20), "toplejša kopel hitreje");
  assert.ok(v("krompir", 50) < v("krompir", 35), "nad ~45 °C katalaza razpada");
});

test("H₂O₂: glowing splint relights while O₂ evolves fast, not with boiled potato; MnO₂ is recovered with unchanged mass (±0,01 g)", () => {
  const a = peroksid("mno2_05");
  a.step(5);
  assert.equal(a.trska(), "vzplamti");
  const b = peroksid("krompirKuhan");
  b.step(60);
  assert.equal(b.trska(), "ugasne");
  for (let s = 1; s <= 30; s++) {
    const B = peroksid("mno2_05", { seed: s, idealno: false });
    B.step(300);
    const f = B.filtriraj();
    assert.ok(Math.abs(f.value - 0.5) <= 0.012, `MnO₂ ${f.value}`);
  }
  assert.equal(peroksid("ki").filtriraj(), null);
});

test("mistake: too much H₂O₂ (10 or 20 mL) overflows the 100 mL syringe and pops the plunger", () => {
  const B = peroksid("mno2_05", { V: 20 });
  B.step(120);
  assert.ok(B.brizga.izpadel);
  const C = peroksid("mno2_05", { V: 10 });
  let over = false;
  for (let i = 0; i < 100; i++) (C.step(1), (over ||= !!C.brizga.beri().cez || C.brizga.izpadel));
  assert.ok(over, "čez 100 mL");
});

// ---------------------------------------------------------------- energija
test("neutralisation: ideal run (polystyrene, lid, stirring) gives ΔH within 5 % of −57,1 kJ/mol after extrapolation; glass beaker clearly lower", () => {
  const a = nevtralizacija();
  rel(a.dH, DH.nevtr, 0.05, "stiropor");
  for (let s = 1; s <= 20; s++) rel(nevtralizacija({ seed: s, idealno: false }).dH, DH.nevtr, 0.07, `seme ${s} (termometer ±0,1 v razliki)`);
  const g = nevtralizacija({ posoda: "casa", pokrov: false });
  assert.ok(g.dH > -50 && g.dH < -35, `steklena čaša: ${g.dH}`);
  assert.ok(Math.abs(g.dH) < 0.88 * Math.abs(a.dH), "čaša manj");
  // brez pokrova manj kot s pokrovom (ali enako)
  assert.ok(nevtralizacija({ pokrov: false }).dH >= a.dH - 0.3);
});

test("mistakes: no stirring gives a low early reading (layers); weak acetic acid gives a smaller |ΔH|; too concentrated NaOH warns", () => {
  const B = new KalorimeterBench({ seed: 1, idealno: true });
  Object.assign(B, { mesaj: false, ocala: true });
  B.nalij("HCl", 1, 50);
  B.step(60);
  B.pripravi2(1, 50);
  B.zlij();
  B.step(10);
  const nem = B.readT().value;
  const C = new KalorimeterBench({ seed: 1, idealno: true });
  C.ocala = true;
  C.nalij("HCl", 1, 50);
  C.step(60);
  C.pripravi2(1, 50);
  C.zlij();
  C.step(10);
  assert.ok(C.readT().value - nem > 0.5, `brez mešanja prenizko: ${nem} vs ${C.readT().value}`);
  const o = nevtralizacija({ kislina: "CH3COOH" }), h = nevtralizacija();
  assert.ok(Math.abs(o.dH) < Math.abs(h.dH), `ocetna ${o.dH} vs ${h.dH}`);
  const D = new KalorimeterBench();
  D.ocala = true;
  assert.equal(D.nalij("HCl", 4, 50).jedko, true);
  D.pripravi2(4, 50);
  assert.equal(D.zlij().jedko, true);
});

test("dissolving: NH₄NO₃ ΔT < 0 (endothermic), NaOH and CaCl₂ ΔT > 0; ΔH from extrapolation within 10 % of CRC", () => {
  for (const [snov, g] of [["NH4NO3", 5], ["NaOH", 2], ["CaCl2", 3]]) {
    const B = new KalorimeterBench({ seed: 2, idealno: true });
    B.ocala = true;
    B.nalij("voda", 0, 100);
    B.step(60);
    const T0 = B.readT().value;
    B.stresi(snov, g);
    const pts = [];
    for (let t = 0; t <= 900; t += 30) pts.push([B.t, B.readT().value]), B.step(30);
    const endo = TRDNE[snov].dH > 0;
    const e = ekstrapolacija(pts, B.tMix, { endo });
    const dT = e.T - T0;
    assert.ok(endo ? dT < -2 : dT > 2, `${snov}: ΔT = ${dT}`);
    rel(entalpija({ m: 100 + g, dT, n: g / TRDNE[snov].M }), TRDNE[snov].dH, 0.1, snov);
  }
});

test("Mg + HCl in the calorimeter: warms > 10 K with 0,3 g and ΔH within 8 % of −466,85 kJ/mol", () => {
  const B = new KalorimeterBench({ seed: 1, idealno: true });
  B.ocala = true;
  B.nalij("HCl", 1, 50);
  B.step(60);
  const T0 = B.readT().value;
  B.dodajMg("prah", 0.3);
  const pts = [];
  for (let t = 0; t <= 900; t += 30) pts.push([B.t, B.readT().value]), B.step(30);
  const e = ekstrapolacija(pts, B.tMix);
  assert.ok(e.T - T0 > 10, `ΔT ${e.T - T0}`);
  rel(entalpija({ m: 50, dT: e.T - T0, n: 0.3 / 24.305 }), DH.Mg, 0.08, "ΔH Mg");
});

test("thermometric titration: highest temperature at the equivalence volume within one addition step", () => {
  for (const [dV, cB, cA] of [[2, 1, 1], [5, 1, 1], [1, 2, 1]]) {
    for (const posoda of ["stiropor", "casa"]) {
      const B = new KalorimeterBench({ seed: 4, idealno: true });
      Object.assign(B, { ocala: true, posoda });
      B.nalij("HCl", cA, 25);
      B.step(30);
      const pts = [];
      for (let V = dV; V <= 50; V += dV) {
        B.titriraj(dV, cB);
        B.step(20);
        pts.push([V, B.readT().value]);
      }
      const max = pts.reduce((a, p) => (p[1] > a[1] ? p : a));
      const Veq = (cA * 25) / cB;
      assert.ok(Math.abs(max[0] - Veq) <= dV + 1e-9, `${posoda} korak ${dV}: vrh pri ${max[0]} mL, ekvivalenca ${Veq}`);
    }
  }
});

test("glass thermometer reads in 0,5 °C steps; digital within ±0,5 °C", () => {
  const B = new KalorimeterBench({ seed: 5 });
  Object.assign(B, { ocala: true, termometer: "stekleni" });
  B.nalij("voda", 0, 100);
  B.step(30);
  const v = B.readT().value;
  near((v * 2) % 1, 0, 1e-9, "korak 0,5");
  near(v, B.T, 0.6, "stekleni");
});

// ---------------------------------------------------------------- plamenska reakcija
// NIST ASD (zrak): to so vrednosti, ki jih mora imeti model (±0,1 nm).
const NIST = { Li: [670.78], Na: [588.995, 589.592], K: [766.49, 769.9, 404.414], Ca: [422.673], Sr: [460.733], Ba: [553.548], Cu: [510.554, 515.324, 521.82] };
test("flame: emission lines match NIST within 0,1 nm and the spectrum of each salt contains them", () => {
  for (const [el, ls] of Object.entries(NIST)) {
    const sp = spekterSoli({ [el]: 1 }).filter((q) => q.crta).map((q) => q.l);
    for (const l of ls) assert.ok(sp.some((x) => Math.abs(x - l) <= 0.1), `${el} ${l} nm`);
  }
  // spektroskop: odčitek na ±1,5 nm
  const B = new PlamenBench({ seed: 1 });
  Object.assign(B, { ocala: true, prizgan: true, zrak: 1 });
  for (let i = 0; i < 4; i++) B.ocisti();
  B.namoci();
  B.zajemi("Li");
  B.vPlamenu = true;
  const c = B.odcitajCrte();
  assert.ok(c[0].el === "Li" && Math.abs(c[0].odcitek - 670.78) <= 1.5, JSON.stringify(c[0]));
});

test("flame colours: hue from the CIE observer (Li and Sr red, Na yellow-orange, Ca orange, Ba and Cu green/blue-green, K violet)", () => {
  const rgb = (el) => barvaSpektra(spekterSoli({ [el]: 1 })).rgb;
  const [rL, gL, bL] = rgb("Li");
  assert.ok(rL === 255 && gL < 40 && bL < 140, "Li");
  const [rN, gN, bN] = rgb("Na");
  assert.ok(rN === 255 && gN > 100 && gN < 200 && bN < 30, "Na");
  const [rC, gC] = rgb("Ca");
  assert.ok(rC === 255 && gC > 50 && gC < 140, "Ca");
  assert.ok(rgb("Ba")[1] === 255 && rgb("Ba")[0] < 120, "Ba");
  assert.ok(rgb("Cu")[1] > 150 && rgb("Cu")[2] > 150 && rgb("Cu")[0] < 120, "Cu");
  const [rK, , bK] = rgb("K");
  assert.ok(bK > 200 && rK > 80, "K vijolična");
  // spektralna barva 589 nm je rumeno oranžna, 470 nm modra
  assert.ok(valovRgb(589)[0] === 255 && valovRgb(589)[2] < 30);
  assert.ok(valovRgb(470)[2] === 255);
  assert.ok(cmf(766)[1] < 1e-4 && cmf(555)[1] > 0.95, "občutljivost očesa");
});

test("flame: Na contamination dominates; K seen only through cobalt glass; luminous flame hides the colour; dirty loop needs ~3 cleanings", () => {
  const mix = spekterSoli({ Na: 0.3, K: 1 });
  assert.ok(delezSvetlosti(mix, "Na") > 0.95, "Na prekrije K");
  assert.ok(delezSvetlosti(mix, "K", { steklo: true }) > 0.6, "skozi modro steklo K");
  assert.ok(kobalt(589) < 0.005 && kobalt(766) > 0.5 && kobalt(430) > 0.4, "kobaltovo steklo");
  const B = new PlamenBench({ seed: 2 });
  Object.assign(B, { ocala: true, prizgan: true, zrak: 1 });
  B.namoci();
  B.zajemi("Li");
  B.vPlamenu = true;
  assert.ok(delezSvetlosti(B.spekter(), "Na") > 0.6, "umazana zanka: rumeno");
  const C = new PlamenBench({ seed: 2 });
  Object.assign(C, { ocala: true, prizgan: true, zrak: 1 });
  let n = 0;
  while (C.ostanek() * 10 > 0.05 && n < 10) C.ocisti(), n++;
  assert.ok(n >= 2 && n <= 4, `čiščenj: ${n}`);
  C.namoci();
  C.zajemi("Li");
  C.vPlamenu = true;
  assert.ok(delezSvetlosti(C.spekter(), "Li") > 0.7, "čista zanka: Li");
  C.zrak = 0;
  assert.ok(C.vidnostSoli() < 0.2, `svetel plamen prekrije barvo: ${C.vidnostSoli()}`);
  // zanka, ki ni pomočena v HCl: sol se slabo prime
  const D = new PlamenBench({ seed: 2 });
  D.ocala = true;
  for (let i = 0; i < 4; i++) D.ocisti();
  D.zanka = { Na: 0, K: 0 };
  D.namocena = false;
  assert.equal(D.zajemi("Sr").slabo, true);
  assert.ok(D.zanka.Sr < 0.2);
  // sol izhlapi iz zanke v nekaj sekundah, kalij najhitreje
  Object.assign(D, { prizgan: true, zrak: 1, vPlamenu: true, zanka: { K: 1, Na: 1 } });
  D.step(5);
  assert.ok(D.zanka.K < D.zanka.Na && D.zanka.K < 0.25);
});

test("flame: unknown samples – one is Na + K, the others are single known ions; E = hc/λ for Na D is 2,1 eV", () => {
  for (let s = 1; s <= 20; s++) {
    const B = new PlamenBench({ seed: s });
    const X = Object.values(B.vzorci).filter((v) => v.neznan);
    assert.equal(X.length, 4);
    assert.equal(X.filter((v) => v.sestava.Na && v.sestava.K).length, 1);
    for (const v of X) for (const el of Object.keys(v.sestava)) assert.ok(el in IONI);
  }
  near(energijaFotona(589) / 1.602176634e-19, 2.105, 0.005, "E(Na D)");
  assert.ok(CRTE.Na[0][1] > CRTE.Na[1][1], "D2 močnejša od D1");
});

// ---------------------------------------------------------------- brez NaN
test("fuzz: random settings never give NaN", () => {
  let a = 11;
  const r = () => ((a = (a * 48271) % 2147483647) / 2147483647);
  const pick = (l) => l[Math.floor(r() * l.length)];
  for (let i = 0; i < 40; i++) {
    const T = 20 + r() * 30;
    const m = marmor({ c: pick(KONC_HCL), oblika: pick(Object.keys(MARMOR_OBLIKE)), m: pick(MARMOR_MASE), T, seed: i, idealno: false, vata: r() < 0.5 });
    m.step(r() * 400);
    fin(m.masa(), "marmor");
    fin(m.beriMaso().value, "tehtnica");
    const g = magnezij({ c: pick(KONC_HCL), cm: pick(MG_TRAK.dolzine), seed: i, idealno: false, zatika: r() < 0.3, pusca: r() < 0.3 });
    g.step(r() * 300);
    fin(g.brizga.x, "brizga Mg");
    const t = new TiosulfatBench({ seed: i });
    t.ocala = true;
    t.kopel(T);
    t.pripravi(pick(TIO_VOLUMNI));
    t.zlij();
    t.step(r() * 200);
    fin(t.vidnost(), "tiosulfat");
    const p = peroksid(pick(Object.keys(KATALIZATORJI)), { V: pick(PEROKSID_V), T, seed: i, idealno: false });
    p.step(r() * 300);
    fin(p.brizga.x, "brizga H₂O₂");
    fin(p.delezO2(), "O₂");
    const k = new KalorimeterBench({ seed: i });
    Object.assign(k, { ocala: true, posoda: pick(["stiropor", "casa"]), pokrov: r() < 0.5, mesaj: r() < 0.5, termometer: pick(["digitalni", "stekleni"]) });
    const w = pick(["nevtr", "trdna", "mg", "titr"]);
    if (w === "trdna") k.nalij("voda", 0, 100), k.stresi(pick(Object.keys(TRDNE)), 1 + r() * 9);
    else if (w === "mg") k.nalij("HCl", 1, 50), k.dodajMg(pick(["prah", "trak"]), 0.1 + r() * 0.4);
    else if (w === "titr") k.nalij("HCl", 1, 25), k.titriraj(5, 1), k.titriraj(5, 1);
    else k.nalij(pick(["HCl", "CH3COOH"]), 1, 50), k.pripravi2(pick([1, 2]), 50), k.zlij();
    k.step(r() * 600);
    fin(k.readT().value, "kalorimeter");
    const f = new PlamenBench({ seed: i });
    Object.assign(f, { ocala: true, prizgan: true, zrak: r(), steklo: r() < 0.5 });
    if (r() < 0.5) f.ocisti();
    f.zajemi(pick(Object.keys(f.vzorci)));
    f.vPlamenu = true;
    f.step(r() * 10);
    for (const c of f.barva().rgb) fin(c, "barva");
    fin(f.vidnostSoli(), "vidnost");
  }
  assert.equal(new Brizga(() => 0.5, { Vglava: 80, T: 20, p: 98000 }).beri().value, 0);
});

test("POENOSTAVITVE_REAKCIJE lists simplifications for every bench", () => {
  for (const k of ["hitrost", "energija", "plamenska"]) assert.ok(POENOSTAVITVE_REAKCIJE[k].length >= 3);
  assert.ok(Object.keys(KATALIZATORJI).length >= 8 && PEROKSID_V.includes(10));
});
