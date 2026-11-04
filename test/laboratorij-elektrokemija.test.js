// Virtualni laboratorij, elektrokemija (public/sim/lab-model-elektrokemija.js): elektroliza v Hofmannovem aparatu,
// galvanski člen, kovine v kislinah in raztopinah soli. Dovoljeno odstopanje je zapisano pri vsakem testu (docs/laboratorij.md).
import test from "node:test";
import assert from "node:assert/strict";
import {
  F, nernst, naklonDekada, faradayMol, prostorninaPlina, hH2SO4, phIzX, ElektrolizaBench, TEKOCINE_EL, HOFMANN,
  GalvanBench, KOVINE, SOLI, BREME, KovineBench, KINETIKA, reagiraS, VRSTA, barvaRaztopine, meterSpec, POENOSTAVITVE_ELEKTROKEMIJA,
} from "../public/sim/lab-model-elektrokemija.js";
import { AM_RANGES, VM_RANGES } from "../public/sim/lab-model.js";
import { pNas } from "../public/sim/lab-model-toplota.js";

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} ni ${b} ± ${tol}`);

// ---------------------------------------------------------------- elektroliza
function hofmann({ id = "h2so4", c = 0.5, el = "pt", U = 12, Ilim = 0.3, range = "10", seed = 1, T = 22, p = 98000, pol = "L-" } = {}) {
  const B = new ElektrolizaBench({ seed, T, p });
  B.elektrode = el;
  B.napolni(id, c); // pipi odprti: zrak uide
  B.odpriPipo(0, false);
  B.odpriPipo(1, false);
  B.amRange = range;
  B.pol = pol;
  B.U = U;
  B.Ilim = Ilim;
  B.vklop = true;
  return B;
}

test("Faraday: 1,000 A for 965 s gives 5,00 mmol H₂ (±0,5 %) and 2,50 mmol O₂", () => {
  near(faradayMol(1, 965, 2) * 1000, 5.0, 0.025, "n(H₂) = It/2F");
  near(faradayMol(1, 965, 4) * 1000, 2.5, 0.0125, "n(O₂) = It/4F");
  near(F, 96485.33, 0.01, "F (CODATA 2018)");
  // v aparatu: vodik, ki nastane, je točno Q/2F; skoraj ves se zbere kot plin (v cevi ali uide pod cevjo, ko je polna)
  const B = hofmann({ id: "h2so4", c: 1, Ilim: 1 });
  B.step(965);
  near(B.nGen.H2, B.Q / (2 * F), 1e-12, "nastali H₂ = Q/2F");
  const plin = B.arms[B.katoda].g.H2 + B.izlito.H2;
  assert.ok(plin >= 0.995 * B.nGen.H2, `zbranega vodika ${plin / B.nGen.H2}`);
});

test("V(H₂)/V(O₂) = 2,00 ± 0,05 once the oxygen lag is over (Pt, H₂SO₄, Na₂SO₄, NaOH)", () => {
  for (const id of ["h2so4", "na2so4", "naoh"]) {
    const B = hofmann({ id, c: 1, Ilim: 0.2 });
    while (B.volumni()[B.katoda] < 2) B.step(1);
    const [Vk0, Va0] = [B.volumni()[B.katoda], B.volumni()[B.anoda]];
    assert.ok(Vk0 / Va0 > 2.05, `${id}: kisik na začetku zaostaja (${Vk0 / Va0})`);
    while (B.volumni()[B.katoda] < 40 && B.t < 3600) B.step(10);
    const V = B.volumni();
    near(V[B.katoda] / V[B.anoda], 2, 0.05, `${id} razmerje`);
  }
});

test("gas volume from the ideal gas law minus water vapour, compressed by the liquid column", () => {
  const B = hofmann({ Ilim: 0.2, T: 20, p: 100000 });
  B.step(600);
  const n = B.arms[B.katoda].g.H2;
  const V0 = prostorninaPlina(n, B.T, 100000 - pNas(B.T)) * 1e6;
  const V = B.volumni()[B.katoda], dh = B.razlikaGladin(B.katoda);
  assert.ok(V < V0 && V > 0.95 * V0, "stolpec tekočine plin malo stisne");
  near(V, prostorninaPlina(n, B.T, 100000 - pNas(B.T) + TEKOCINE_EL.h2so4.rho(0.5) * 9.80665 * dh) * 1e6, 0.01, "V iz tlaka z ρgΔh");
  near(pNas(20), 2339, 12, "parni tlak vode pri 20 °C (CRC 2,339 kPa; Antoine ±0,5 %)");
});

test("decomposition voltage: Pt onset 1,7–1,9 V, graphite higher, nothing below 1,23 V", () => {
  const I = (el, U) => {
    const B = hofmann({ el, U, Ilim: 1 });
    return B.solve().If;
  };
  assert.ok(I("pt", 1.2) === 0, "pod 1,23 V ni elektrolize");
  assert.ok(I("pt", 1.6) < 1e-3, "Pt pri 1,6 V < 1 mA");
  assert.ok(I("pt", 1.9) > 3e-3, "Pt pri 1,9 V > 3 mA");
  assert.ok(I("grafit", 1.9) < I("pt", 1.9) / 5, "grafit potrebuje večjo napetost");
  assert.ok(I("grafit", 2.6) > 3e-3, "grafit pri 2,6 V teče");
});

test("distilled water at 12 V: I < 1 mA and no visible gas; Na₂SO₄ and H₂SO₄ conduct", () => {
  const B = hofmann({ id: "destilirana", c: 0 });
  B.step(600);
  assert.ok(B.last.I < 1e-3, `destilirana voda ${B.last.I} A`);
  assert.ok(B.volumni()[B.katoda] < 0.1, "skoraj nič plina");
  for (const id of ["na2so4", "h2so4"]) {
    const X = hofmann({ id, c: 0.5, Ilim: 1 });
    assert.ok(X.solve().I > 0.03, `${id} 0,5 mol/L: ${X.last.I} A`);
  }
  assert.ok(hofmann({ id: "vodovodna", c: 0 }).solve().I < 3e-3, "voda iz pipe le malo");
});

test("mistake: polarity swapped – hydrogen collects under the other tube", () => {
  const A = hofmann({ pol: "L-" }), B = hofmann({ pol: "L+" });
  A.step(400), B.step(400);
  assert.ok(A.volumni()[0] > 1.8 * A.volumni()[1], "levo vodik");
  assert.ok(B.volumni()[1] > 1.8 * B.volumni()[0], "zamenjana pola: vodik desno");
  assert.ok(B.sestava(1).H2 > 0.99);
});

test("mistake: tap left open – the gas escapes, nothing is collected; overfull tube spills from below", () => {
  const B = hofmann({ Ilim: 0.3 });
  B.odpriPipo(1, true);
  B.step(300);
  assert.equal(B.nPlina(1), 0);
  assert.ok(B.izlito.O2 > 0 || B.izlito.H2 > 0);
  const C = hofmann({ id: "h2so4", c: 1, Ilim: 1 });
  C.step(1200);
  assert.ok(C.volumni()[C.katoda] <= HOFMANN.Vmax + 0.01 && C.arms[C.katoda].polna, "polna cev");
  assert.ok(C.odcitek(C.katoda).cez, "odčitek čez skalo");
});

test("mistake: filling with the taps closed traps air in the tubes", () => {
  const B = new ElektrolizaBench({ seed: 2, T: 22, p: 98000 });
  B.pipa = [false, false];
  B.napolni("h2so4", 0.5);
  assert.ok(B.volumni()[0] > 50, "zrak ostane v cevi");
  B.odpriPipo(0, true);
  assert.equal(B.nPlina(0), 0);
});

test("mistake: too high current warms the liquid (Joule heating) and the 200 mA fuse blows", () => {
  const B = hofmann({ id: "h2so4", c: 1, Ilim: 1, range: "10" });
  B.step(600);
  assert.ok(B.T - 22 > 3, `segrevanje ${B.T - 22} K`);
  const S = hofmann({ id: "h2so4", c: 0.5, Ilim: 0.05 });
  S.step(600);
  assert.ok(S.T - 22 < 0.6, "pri 50 mA skoraj nič");
  const P = hofmann({ id: "h2so4", c: 1, Ilim: 1, range: "200m" });
  P.step(5);
  assert.ok(P.fuseOf().blown, "varovalka F 200 mA pregori pri ~0,5 A");
  assert.equal(P.solve().I, 0);
});

test("NaCl: chlorine at the anode (partly dissolves), volume ratio far from 2 : 1, solution near cathode basic", () => {
  const B = hofmann({ id: "nacl", c: 1, Ilim: 0.3 });
  B.indikator = true;
  B.step(900);
  const V = B.volumni();
  assert.ok(B.last.fCl2 > 0.8, `delež toka za Cl₂ ${B.last.fCl2}`);
  assert.ok(V[B.katoda] / V[B.anoda] > 2.5, `razmerje ${V[B.katoda] / V[B.anoda]}`);
  assert.ok(B.sestava(B.anoda).Cl2 > 0.5);
  assert.ok(B.pH(B.katoda) > 11 && B.pH(B.anoda) < 4, "pH ob katodi in anodi");
  assert.ok(B.preskus(B.anoda, "lakmus").plin === "Cl2" || B.volumni()[B.anoda] < 1.5);
  // pri 0,1 mol/L več kisika (manj kloridov ob anodi)
  const D = hofmann({ id: "nacl", c: 0.1, Ilim: 0.3 });
  D.step(900);
  assert.ok(D.last.fCl2 < B.last.fCl2);
});

test("graphite anode: part of the charge oxidises carbon, less oxygen (ratio > 2)", () => {
  const B = hofmann({ el: "grafit", Ilim: 0.2 });
  while (B.volumni()[B.katoda] < 40) B.step(10);
  const V = B.volumni();
  assert.ok(V[B.katoda] / V[B.anoda] > 2.08, `${V[B.katoda] / V[B.anoda]}`);
});

test("gas tests: glowing splint relights in O₂, burning splint pops in H₂", () => {
  const B = hofmann({ Ilim: 0.3 });
  B.step(300);
  assert.equal(B.preskus(B.anoda, "tlecka").plin, "O2");
  assert.equal(B.preskus(B.katoda, "goreca").plin, "H2");
  assert.equal(B.nPlina(B.katoda), 0, "plin je ušel ob preskusu");
  assert.equal(B.preskus(B.katoda, "goreca").ok, false, "premalo plina");
});

test("universal indicator in Na₂SO₄: cathode side turns basic, anode side acidic", () => {
  const B = hofmann({ id: "na2so4", c: 0.5, Ilim: 0.1 });
  B.step(120);
  assert.ok(B.pH(B.katoda) > 10 && B.pH(B.anoda) < 4);
  near(phIzX(1e-3), 3, 1e-6, "pH iz x");
  near(hH2SO4(1), 1.01, 0.005, "1 M H₂SO₄: [H⁺] ≈ 1,01 (Ka2 = 1,02·10⁻²)");
});

test("ammeter readings stay within the datasheet spec (300 seeds)", () => {
  for (let seed = 1; seed <= 300; seed++) {
    const B = hofmann({ seed, Ilim: 0.15, range: "200m" });
    B.step(1);
    const r = B.readA(), tr = B.last.I;
    assert.ok(Math.abs(r.value - tr * 1000) <= meterSpec(tr, AM_RANGES["200m"], "A") + 1e-9, `seme ${seed}: ${r.value} mA, res ${tr * 1000}`);
    const o = B.odcitek(B.katoda);
    assert.ok(Math.abs(o.value - B.volumni()[B.katoda]) <= HOFMANN.kal + HOFMANN.oko + 0.05 + 1e-9, "skala cevi");
  }
});

// ---------------------------------------------------------------- galvanski člen
function clen(L, cL, R, cR, { T = 25, most = "papir", seed = 1 } = {}) {
  const G = new GalvanBench({ seed, T });
  G.postavi(0, { kovina: L, c: cL });
  G.postavi(1, { kovina: R, c: cR });
  G.obrusi(0);
  G.obrusi(1);
  G.most = most;
  G.rdeca = 1;
  G.solve();
  return G;
}

test("Daniell cell Zn | Cu 1 mol/L at 25 °C: 1,10 V ± 0,01", () => {
  const G = clen("Zn", 1, "Cu", 1);
  near(G.emf(), 1.1, 0.01, "EMF");
  near(G.napovedE0(), 1.1037, 1e-4, "ΔE° (CRC)");
  near(G.last.U, 1.1, 0.01, "na sponkah voltmetra 10 MΩ");
});

test("Nernst slope 0,0296 V per decade for n = 2 at 25 °C (±0,5 mV), 0,0592 for Ag", () => {
  near(naklonDekada(25, 2), 0.0296, 0.0005, "RT ln10 / 2F");
  const e = (c) => clen("Zn", 1, "Cu", c).emf();
  near((e(1) - e(0.001)) / 3, 0.0296, 0.0005, "Daniell z redčenjem CuSO₄");
  const a = (c) => clen("Cu", 1, "Ag", c).emf();
  near((a(1) - a(0.01)) / 2, 0.0592, 0.0005, "srebro, n = 1");
  near(nernst(25, 1), 0.025693, 1e-6, "RT/F pri 25 °C");
});

test("concentration cell Cu 0,01 | Cu 1: 0,059 V ± 2 mV; same metal and concentration: 0 V", () => {
  const G = clen("Cu", 0.01, "Cu", 1);
  near(G.emf(), 0.059, 0.002, "koncentracijski člen");
  near(G.last.U, 0.059, 0.002, "na voltmetru");
  for (let s = 1; s <= 20; s++) {
    const Z = clen("Zn", 0.1, "Zn", 0.1, { seed: s });
    Z.step(30);
    assert.ok(Math.abs(Z.last.U) < 0.005, `isti kovini: ${Z.last.U}`);
  }
});

test("no salt bridge (or a dry strip): |U| < 0,01 V with drift", () => {
  for (const most of ["brez", "suh"])
    for (let s = 1; s <= 50; s++) {
      const G = clen("Zn", 1, "Cu", 1, { most, seed: s });
      for (let k = 0; k < 20; k++) {
        G.step(3);
        const r = G.readV();
        assert.ok(Math.abs(r.value) < 0.01, `${most}, seme ${s}: ${r.value}`);
      }
    }
});

test("mistake: swapped leads read negative; the more reactive metal is the negative pole", () => {
  const G = clen("Zn", 1, "Cu", 1);
  G.rdeca = 0;
  G.solve();
  assert.ok(G.readV().value < -1.05);
  for (const [a, b] of [["Mg", "Cu"], ["Zn", "Fe"], ["Fe", "Pb"], ["Pb", "Cu"], ["Cu", "Ag"]]) assert.ok(clen(a, 1, b, 1).emf() > 0, `${a} je negativni pol proti ${b}`);
  assert.ok(clen("Zn", 1, "Ag", 1).emf() > clen("Zn", 1, "Cu", 1).emf() && clen("Zn", 1, "Cu", 1).emf() > clen("Zn", 1, "Fe", 1).emf(), "napetost raste z razdaljo v vrsti");
});

test("magnesium: measured voltage well below the E° prediction (oxide film, corrosion)", () => {
  const G = clen("Mg", 1, "Cu", 1);
  assert.ok(G.napovedE0() - G.emf() > 0.5, `Mg|Cu ${G.emf()} proti ${G.napovedE0()}`);
  assert.ok(G.emf() > 1.6 && G.emf() < 2.2);
  const N = new GalvanBench({ seed: 1, T: 25 });
  N.postavi(0, { kovina: "Zn", c: 1 });
  N.postavi(1, { kovina: "Cu", c: 1 });
  N.most = "papir";
  N.obrusi(1);
  assert.ok(N.emf() < 1.08, "neobrušen cink: manjša napetost");
});

test("load: terminal voltage drops; a Daniell cell does not light an LED or turn a motor", () => {
  const G = clen("Zn", 1, "Cu", 1);
  G.breme = "R1k";
  const s = G.solve();
  assert.ok(s.U < 0.3 && s.U > 0.05, `pod 1 kΩ ${s.U}`);
  near(s.I, s.E / (s.Ri + 1000 + AM_RANGES["20m"].rsh), 2e-6, "I = E/(Ri + R)");
  G.breme = "led";
  assert.equal(G.solve().sveti, false);
  G.breme = "motor";
  assert.equal(G.solve().vrti, false);
  const U = clen("Zn", 1, "Cu", 1, { most: "ucev" });
  U.breme = "R1k";
  assert.ok(U.solve().U > 0.6, "U-cev ima manjši notranji upor");
  const M = clen("Mg", 1, "Ag", 1);
  M.breme = "led";
  assert.ok(M.solve().sveti, "Mg | Ag (~2,3 V) LED šibko prižge");
  M.breme = "brez";
  M.solve();
  assert.ok(M.readV().over, "na območju 2 V je OL");
});

test("metal in a foreign salt: Zn in CuSO₄ gets coated and drifts to the copper potential", () => {
  const G = new GalvanBench({ seed: 3, T: 25 });
  G.postavi(0, { kovina: "Zn", c: 1, sol: "CuSO4" });
  G.obrusi(0);
  assert.equal(G.tuja(0), "izpodriva");
  const E0 = G.E0pol(0);
  G.step(600);
  assert.ok(G.E0pol(0) > E0 + 0.9, "potencial zdrsne k bakru");
});

test("voltmeter readings within the datasheet spec (500 seeds)", () => {
  for (let seed = 1; seed <= 500; seed++) {
    const G = clen("Zn", 1, "Cu", 0.1, { seed });
    G.step(1);
    const r = G.readV();
    assert.ok(Math.abs(r.value - G.last.U) <= meterSpec(G.last.U, VM_RANGES["2"], "V") + 1e-9, `seme ${seed}`);
  }
});

// ---------------------------------------------------------------- kovine
function kovina(k, oblika, m, raztopina, c, { t = 60, seed = 1, mesaj = false } = {}) {
  const K = new KovineBench({ seed, T: 22, p: 98000 });
  K.ocala = true;
  K.nalij(raztopina, c);
  K.mesaj = mesaj;
  K.dodaj(k, oblika, m);
  K.step(t);
  return K;
}

test("acids: Mg faster than Zn faster than Fe; Cu gives no gas", () => {
  const v = (k) => {
    const K = kovina(k, "granule", 0.5, "HCl", 1, { t: 5 });
    return K.hitrostPlina();
  };
  assert.ok(v("Mg") > 10 * v("Zn") && v("Zn") > 5 * v("Fe") && v("Fe") > 0, `${v("Mg")} ${v("Zn")} ${v("Fe")}`);
  const Cu = kovina("Cu", "prah", 0.5, "HCl", 2, { t: 600 });
  assert.equal(Cu.nH2, 0);
  assert.ok(Cu.Vbrizga() < 0.5);
  near(Cu.kos.m, 0.5, 1e-12, "baker se ne raztaplja");
  const Ch = kovina("Mg", "trak", 0.05, "H2SO4", 1, { t: 5 }), Hc = kovina("Mg", "trak", 0.05, "HCl", 1, { t: 5 });
  near(Ch.hitrostPlina() / Hc.hitrostPlina(), 1.01, 0.03, "1 M H₂SO₄ ima na začetku le ~1 mol/L H⁺");
});

test("Mg ribbon in 1 M HCl: complete in ~1–3 min, gas volume from stoichiometry, solution warms", () => {
  const K = kovina("Mg", "trak", 0.05, "HCl", 1, { t: 300 });
  assert.ok(K.kos.m < 1e-6, "trak se raztopi");
  near(K.nH2, 0.05 / KOVINE.Mg.M, 1e-9, "n(H₂) = n(Mg)");
  const T = new KovineBench({ seed: 1, T: 22, p: 98000 });
  T.ocala = true;
  T.nalij("HCl", 1);
  T.dodaj("Mg", "trak", 0.05);
  let tKonec = 0;
  while (T.kos.m > 0.0025 && tKonec < 600) T.step(1), tKonec++;
  assert.ok(tKonec > 40 && tKonec < 200, `95 % v ${tKonec} s`);
  assert.ok(T.T - 22 > 3, `segrevanje ${T.T - 22}`);
});

test("displacement grid matches the reactivity series Mg > Zn > Fe > Cu > Ag", () => {
  const soli = { MgSO4: "Mg", ZnSO4: "Zn", FeSO4: "Fe", CuSO4: "Cu", AgNO3: "Ag" };
  for (const k of ["Mg", "Zn", "Fe", "Cu"])
    for (const [s, ion] of Object.entries(soli)) {
      const K = kovina(k, "trak", 0.5, s, s === "AgNO3" ? 0.1 : 0.5, { t: 600 });
      const exp = VRSTA.indexOf(k) < VRSTA.indexOf(ion);
      assert.equal(reagiraS(k, ion), exp, `${k} + ${s}`);
      assert.equal(K.prevleka() > 0.5, exp, `${k} v ${s}: prevleka ${K.prevleka()}`);
    }
  assert.deepEqual([...VRSTA].sort((a, b) => KOVINE[a].E0 - KOVINE[b].E0), VRSTA);
});

test("Zn powder in CuSO₄: blue fades, solution warms; Cu in AgNO₃ turns the solution blue", () => {
  const K = kovina("Zn", "prah", 0.5, "CuSO4", 0.1, { t: 1800, mesaj: true });
  const b0 = barvaRaztopine({ Cu: 0.1 }, 4), b1 = K.barva();
  assert.ok(b1[0] > b0[0] + 60, `modra barva zbledi: ${b0} → ${b1}`);
  const Z = kovina("Zn", "prah", 0.5, "CuSO4", 0.5, { t: 3600, mesaj: true });
  near(Z.tek.ioni.Cu, 0.025 - 0.5 / KOVINE.Zn.M, 1e-4, "pri 0,5 mol/L je cink omejitveni reaktant, raztopina ostane modra");
  assert.ok(K.T > 24, "toplo");
  const A = kovina("Cu", "trak", 0.5, "AgNO3", 0.1, { t: 1800 });
  near(A.tek.ioni.Cu, A.dep.Ag / 2, 1e-12, "na 2 Ag⁺ en Cu²⁺");
  assert.ok(A.barva()[0] < 242, "raztopina dobi modrikast odtenek");
  near(barvaRaztopine({}, 4)[2], 250, 0, "brezbarvna");
});

test("mistakes: no goggles, too concentrated acid and powder overflow, syringe overfilled", () => {
  const K = new KovineBench({ seed: 1 });
  assert.equal(K.nalij("HCl", 1).ok, false);
  K.ocala = true;
  assert.equal(K.nalij("HCl", 6).dim, true, "koncentrirana HCl se kadi");
  const P = kovina("Mg", "prah", 0.5, "HCl", 2, { t: 30 });
  assert.ok(P.prelito, "pena gre čez rob");
  assert.ok(P.batIzpadel, "bat izpade");
  assert.ok(P.odcitekBrizge().value !== P.odcitekBrizge().value, "ni odčitka");
  const S = kovina("Mg", "trak", 0.05, "HCl", 1, { t: 30 });
  assert.ok(!S.prelito && !S.batIzpadel, "pravilna izvedba");
  const L = kovina("Mg", "trak", 0.5, "HCl", 0.5, { t: 1800 });
  near(L.kos.m, 0.5 - (0.025 / 2) * KOVINE.Mg.M, 0.002, "kislina (25 mmol H⁺) je omejitveni reaktant: ostane 0,196 g Mg");
});

test("gas syringe and thermometer readings within spec, deterministic seeds", () => {
  for (let seed = 1; seed <= 200; seed++) {
    const K = kovina("Zn", "granule", 0.5, "HCl", 1, { t: 120, seed });
    const o = K.odcitekBrizge();
    assert.ok(Math.abs(o.value - K.Vbrizga()) <= 0.4 + 0.3 + 0.25 + 1e-9, `brizga seme ${seed}`);
  }
  const a = kovina("Zn", "granule", 0.5, "HCl", 1, { t: 60, seed: 9 }), b = kovina("Zn", "granule", 0.5, "HCl", 1, { t: 60, seed: 9 });
  assert.equal(a.odcitekBrizge().text, b.odcitekBrizge().text);
  assert.ok(Object.values(POENOSTAVITVE_ELEKTROKEMIJA).every((l) => l.length >= 4));
  assert.ok(Object.keys(SOLI).length === 6 && BREME.led && KINETIKA.k.Cu === 0);
});
