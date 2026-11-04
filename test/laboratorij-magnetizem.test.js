// Virtualni laboratorij, elektromagnetizem (public/sim/lab-model-magnetizem.js): elektromagnet, tokovna tehtnica, indukcija.
// Dovoljeno odstopanje je zapisano pri vsakem testu (docs/laboratorij.md).
import test from "node:test";
import assert from "node:assert/strict";
import {
  ElektromagnetBench, TehtnicaBench, IndukcijaBench, MU0, TULJAVE, GRETJE, BAKER, JEDRA, ZELEZO, HALL, TESLA_RANGES, MAGNETI, VODNIKI,
  TEHTNICA, SENZOR, NAPAJALNIK_EM, bTuljavaOs, bSolenoid, bBiotSavart, bZelezo, teslaSpec, pretokTuljava, integralPolja, silaNaVodnik,
  POENOSTAVITVE_MAGNETIZEM, MAGNET_IND, pretokOvoj,
} from "../public/sim/lab-model-magnetizem.js";

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} ni ${b} ± ${tol}`);
const rel = (a, b, tol, msg) => assert.ok(Math.abs(a / b - 1) <= tol, `${msg}: ${a} ni ${b} ± ${tol * 100} %`);
const types = (B) => B.events.map((e) => e.type);

function em({ tuljava = "t500", jedro = "zrak", U = 6, seed = 1, idealno = true, ...rest } = {}) {
  const B = new ElektromagnetBench({ seed, idealno });
  Object.assign(B, { tuljava, jedro, U, vklop: true }, rest);
  B.solve();
  return B;
}

// ---------------------------------------------------------------- elektromagnet: polje tuljave
test("long solenoid: B = μ0 N I / L in the middle within 1 % (thin and thick formula)", () => {
  const N = 1000, I = 2, L = 1;
  const B0 = (MU0 * N * I) / L;
  rel(bSolenoid({ N, I, L, R: 0.01 }), B0, 0.01, "tanka");
  rel(bTuljavaOs({ N, I, L, r1: 0.01, r2: 0.02 }), B0, 0.01, "debela");
  // na koncu dolge tuljave je polovica
  rel(bSolenoid({ N, I, L, R: 0.01, z: L / 2 }), B0 / 2, 0.01, "konec");
});

test("finite coil: closed formula = on-axis Biot–Savart over a helix within 0,1 %", () => {
  for (const z of [0, 0.02, 0.05, 0.12]) {
    const p = { N: 200, I: 1.5, L: 0.06, R: 0.03, z };
    rel(bSolenoid(p), bBiotSavart(p), 0.001, `z = ${z} m`);
  }
  // debela tuljava = povprečje tankih plasti po polmeru (200 plasti)
  for (const z of [0, 0.04, 0.1]) {
    let s = 0;
    for (let i = 0; i < 200; i++) s += bSolenoid({ N: 500, I: 1, L: 0.06, R: 0.024 + ((i + 0.5) * 0.01) / 200, z });
    rel(bTuljavaOs({ N: 500, I: 1, z }), s / 200, 0.001, `debela, z = ${z} m`);
  }
});

test("school coil 500 turns, 2 A: ~15 mT in the middle (literature-size number, ±10 %)", () => {
  rel(bTuljavaOs({ N: 500, I: 2 }), 0.015, 0.1, "B v sredini");
  // podatki kompleta: 250/500/1000 ovojev, R ∝ N², pri Imax vse grejejo ~15 W (±10 %)
  for (const t of Object.values(TULJAVE)) rel(t.Imax ** 2 * t.R, 15, 0.1, `${t.name}: P pri Imax`);
});

// ---------------------------------------------------------------- jedro
test("iron core multiplies the field (rod ≥ 20×) and saturates below 2 T", () => {
  const zrak = em({ U: 12 }), palica = em({ U: 12, jedro: "palica" });
  assert.ok(palica.b(0.065) / zrak.b(0.065) > 20, "palica okrepi polje ob polu");
  // krivulja B–H: pri velikem H se J ustavi pri Js
  assert.ok(bZelezo(1e5) < 2, "nasičenje železa");
  near(bZelezo(1e3), 1.43, 0.05, "B pri 1 kA/m (mehko jeklo)");
  // U-jedro brez ploščic: 4× več amper-ovojev da le ~10 % več polja
  const u = em({ jedro: "u", razmik: 0 });
  const b1 = u.bJedro(1250), b4 = u.bJedro(5000);
  assert.ok(b4 < 2 && b1 > 1.5, `nasičeno: ${b1}, ${b4}`);
  assert.ok(b4 / b1 < 1.15, "nasičenje: B skoraj ne raste");
  // z 2 mm ploščicama je krog linearen: B ∝ N I v 1 %
  u.razmik = 2;
  rel(u.bJedro(500) / u.bJedro(100), 5, 0.01, "linearno z režo");
  assert.ok(u.bJedro(500) < (MU0 * 500) / (2 * 0.002), "železo doda malo magnetnega upora");
});

test("clips: rod lifts ~10–30, air coil none, hardened nail keeps one for a moment", () => {
  const p = em({ U: 12, jedro: "palica" });
  const n = p.dvigniSponke();
  assert.ok(n >= 10 && n <= 30, `palica: ${n} sponk`);
  assert.equal(em({ U: 12 }).dvigniSponke(), 0, "zračna tuljava");
  const z = em({ U: 12, jedro: "zebelj" });
  assert.ok(z.dvigniSponke() > 5, "žebelj ob toku");
  z.step(1);
  z.vklop = false;
  z.step(0.1);
  assert.equal(z.dvigniSponke(), 1, "remanenca žeblja obdrži eno sponko");
  z.step(10);
  assert.equal(z.sponke, 0, "remanenca pojema, sponka odpade");
  assert.ok(types(z).includes("sponke"));
  // zamenjano jedro ne podeduje remanence: namesto magnetnega žeblja vstaviš palico, brez toka ne drži ničesar
  const zz = em({ U: 12, jedro: "zebelj" });
  zz.step(1);
  zz.vklop = false;
  zz.step(0.1);
  zz.jedro = "palica";
  assert.equal(zz.dvigniSponke(), 0, "nova palica brez remanence");
  zz.step(0.1);
  assert.equal(zz.M(), 0);
  // mehko železo po izklopu ne drži ničesar
  p.step(1);
  p.vklop = false;
  p.step(0.2);
  assert.equal(p.dvigniSponke(), 0, "mehko železo");
});

test("compass deflects and turns the other way when the current is reversed", () => {
  const B = em({ U: 6 });
  const k = B.kompas().kot;
  assert.ok(Math.abs(k) > 30 && Math.abs(k) < 90, `odklon ${k}°`);
  B.smer = -1;
  B.solve();
  near(B.kompas().kot, -k, 1e-9, "obrnjen tok");
});

// ---------------------------------------------------------------- teslameter
test("teslameter: reading within ±(2 % + 1 digit) of the true field over 40 seeds; OL above the range", () => {
  for (let seed = 1; seed <= 40; seed++) {
    const B = em({ U: 4, seed, idealno: false });
    B.vklop = false;
    B.solve();
    B.nicli();
    B.vklop = true;
    B.solve();
    for (const z of [0, 0.05, 0.1]) {
      B.sonda.z = z;
      const Bt = B.b(z), r = B.readT();
      near(r.value, Bt * 1e3, teslaSpec(Bt, "20"), `seed ${seed}, z ${z}`);
    }
  }
  const B = em({ U: 12, jedro: "palica" });
  B.sonda.z = B.zMin;
  assert.equal(B.readT().text, "OL", "20 mT je premalo ob polu palice");
  B.sonda.range = "2000";
  assert.equal(B.readT().over, false);
  assert.ok(TESLA_RANGES["2000"].max >= 2);
});

test("mistake: zero not set shows Earth's field + Hall offset; zero set with current on reads −B after switch-off", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const B = em({ U: 0, seed, idealno: false });
    const r = B.readT().value;
    // zemeljsko polje navpično 42,8 µT + odmik do ±0,03 mT (3σ: 0,09 mT)
    assert.ok(Math.abs(r - (42.8e-3 + B.hall.odmik * 1e3)) <= 0.02, `seed ${seed}: ${r}`);
    B.nicli();
    assert.ok(Math.abs(B.readT().value) <= 0.01, "po nastavitvi ničle");
  }
  const B = em({ U: 6, idealno: false, seed: 3 });
  B.sonda.z = 0;
  const bOn = B.b(0);
  B.nicli();
  B.vklop = false;
  B.solve();
  near(B.readT().value, -bOn * 1e3, teslaSpec(bOn, "20"), "ničla ob toku: po izklopu kaže −B");
});

test("mistake: probe turned 90° reads almost nothing on the axis", () => {
  const B = em({ U: 6 });
  B.sonda.z = 0;
  const vzdolz = B.readT().value;
  B.sonda.orient = "prec";
  const precno = B.readT().value;
  assert.ok(Math.abs(precno) < 0.05 * Math.abs(vzdolz), `${precno} proti ${vzdolz}`);
  near(precno, vzdolz * Math.sin(HALL.nagib), 0.05, "ostane nagib 1,5°");
});

// ---------------------------------------------------------------- krog, gretje, varovalke
test("coil heating: R(T) = R20 (1 + α ΔT), current falls in CV mode, thermal cut at 120 °C and reclose at 90 °C", () => {
  const B = em({ tuljava: "t1000", U: 12 });
  const I0 = B.st.I;
  B.step(3000);
  rel(B.Rcoil(), TULJAVE.t1000.R * (1 + BAKER.alfa * (B.T - 20)), 1e-12, "R(T)");
  assert.ok(B.T > 50 && B.T < GRETJE.izklop, `T = ${B.T}`);
  rel(B.st.I, 12 / (B.Rcoil() + 0.01 + NAPAJALNIK_EM.vodniki + NAPAJALNIK_EM.rs), 1e-9, "Ohm z vročim uporom");
  assert.ok(B.st.I < 0.9 * I0, "tok pade za >10 %");

  // pri Imax se navitje ustali pod 120 °C (lak razreda B)
  const ok = em({ U: 6.5 });
  ok.step(6000);
  assert.ok(!ok.odprto && ok.T < 100, `pri Imax: ${ok.T}`);

  // mistake: 3 A skozi tuljavo za 2,5 A
  const vroc = em({ U: 12 });
  vroc.step(0.1);
  assert.ok(types(vroc).includes("prevec"));
  let t = 0;
  while (!vroc.odprto && t < 5000) vroc.step(10), (t += 10);
  assert.ok(vroc.odprto, "termično varovalo");
  assert.ok(t > 1500 && t < 4000, `izklop po ${t} s`);
  assert.ok(types(vroc).includes("vonj") && types(vroc).includes("izklop"));
  near(vroc.solve().I, 0, 1e-12, "odprto varovalo: ni toka");
  while (vroc.odprto && t < 10000) vroc.step(10), (t += 10);
  assert.ok(!vroc.odprto && vroc.T <= GRETJE.vklop + 0.5, "ponovni vklop pod 90 °C");
});

test("mistake: ammeter in parallel with the coil — mA fuse blows; on 10 A it shorts the coil", () => {
  const B = em({ U: 6, amPos: "vzporedno", amRange: "200m" });
  assert.ok(B.st.cc, "skoraj kratek stik: napajalnik v CC");
  B.step(1);
  assert.ok(B.fuse.mA.blown && types(B).includes("varovalka"));
  assert.equal(B.readA().value, 0, "pregorela varovalka: ampermeter kaže 0");
  B.replaceFuse();
  assert.equal(B.fuse.mA.blown, false);
  const A = em({ U: 6, amPos: "vzporedno" });
  assert.ok(Math.abs(A.st.Icoil) < 0.02 && Math.abs(A.st.Iam) > 2.9, "skoraj ves tok gre skozi ampermeter");
  // zaporedno na mA: varovalka 0,2 A pregori
  const C = em({ U: 6, amRange: "200m" });
  C.step(5);
  assert.ok(C.fuse.mA.blown && C.solve().I === 0, "zaporedno na mA");
});

// ---------------------------------------------------------------- tokovna tehtnica
function tt({ seed = 1, idealno = true, I = 2, ...rest } = {}) {
  const B = new TehtnicaBench({ seed, idealno });
  Object.assign(B, rest);
  B.tariraj();
  Object.assign(B, { Ilim: I, vklop: true });
  B.solve();
  return B;
}

test("current balance: F = B I L within 1 % (L = 1, 2, 4 cm; 8 cm within 0,5 % of ∫B dl)", () => {
  for (const L of VODNIKI) {
    for (const I of [1, 3, 5]) {
      const B = tt({ L, I });
      const F = silaNaVodnik({ B: MAGNETI.B0, I, L });
      if (L < 0.08) rel(B.sila, F, 0.01, `L ${L}, I ${I}`);
      else rel(B.sila, I * integralPolja(B.magneti, -L / 2, L / 2), 1e-9, "8 cm: integral");
      rel(B.dmPravi, (F / 9.806) * 1000, L < 0.08 ? 0.011 : 0.02, "Δm = F/g");
    }
  }
  // integral analitično = numerično (Simpson, 4000 korakov)
  const B = tt();
  const f = (x) => B.magneti.reduce((s, m) => s + (m.B / 2) * (Math.tanh((x - m.x1) / MAGNETI.rob) - Math.tanh((x - m.x2) / MAGNETI.rob)), 0);
  let s = 0;
  const a = -0.05, b = 0.05, n = 4000, hh = (b - a) / n;
  for (let i = 0; i <= n; i++) s += f(a + i * hh) * (i === 0 || i === n ? 1 : i % 2 ? 4 : 2);
  rel(integralPolja(B.magneti, a, b), (s * hh) / 3, 1e-6, "∫B dx");
});

test("balance sign: N in front, current to the right → wire pushed up → reading rises; either flip makes it negative", () => {
  const B = tt({ I: 4, seed: 2, idealno: false });
  assert.ok(B.read().value > 1, "Δm > 0");
  B.smer = -1;
  B.solve();
  assert.ok(B.read().value < -1, "obrnjen tok");
  B.smer = 1;
  B.polaritetaMag = -1;
  B.solve();
  assert.ok(B.read().value < -1, "obrnjena pola");
});

test("balance noise: Δm reading within ±0,01 g of the true value (+0,05 % calibration) right after taring, 30 seeds", () => {
  for (let seed = 1; seed <= 30; seed++) {
    const B = tt({ seed, idealno: false, I: 3 });
    for (let k = 0; k < 40; k++) {
      const d = B.read().value - B.dmPravi;
      assert.ok(Math.abs(d) <= TEHTNICA.d + Math.abs(B.dmPravi) * TEHTNICA.umeritev + 1e-9, `seed ${seed}: ${d}`);
    }
    // lezenje ničle v nekaj minutah ostane pod 0,01 g (+ šum 0,01 g)
    B.step(600);
    assert.ok(Math.abs(B.lez) <= TEHTNICA.lezenje * 1.01, `lezenje ${B.lez}`);
  }
});

test("mistake: balance not tared shows the magnet holder (~170 g)", () => {
  const B = new TehtnicaBench({ seed: 4 });
  const m = B.read().value;
  assert.ok(m > 160 && m < 190, `${m} g`);
});

test("mistake: wire above the gap feels ~8 % of the force, field along the wire ~2 % (1° tilt)", () => {
  const ref = tt({ I: 4 }).sila;
  rel(tt({ I: 4, visina: "nad" }).sila / ref, 0.08, 1e-9, "nad režo");
  rel(tt({ I: 4, visina: "rob" }).sila / ref, 0.6, 1e-9, "na robu reže");
  rel(tt({ I: 4, kot: "vzporedno" }).sila / ref, Math.sin(Math.PI / 180), 1e-9, "vzporedno");
});

test("board heating at 5 A warns but does not change the force; mA range fuse blows", () => {
  const B = tt({ I: 5 });
  const F = B.sila;
  B.step(300);
  assert.ok(types(B).includes("toplo") && B.Tplosca > 40);
  near(B.sila, F, 1e-15, "sila ostane");
  B.amRange = "200m";
  B.step(2);
  assert.ok(B.fuse.mA.blown && types(B).includes("varovalka"));
  const st = B.solve();
  assert.equal(st.I, 0);
  assert.ok(Number.isFinite(st.Usup), "napajalnik kaže napetost odprtih sponk");
  assert.ok(B.st.cc === false);
});

test("fewer magnets: force scales with the number of magnets the wire spans (±8 % spread per magnet)", () => {
  const B = tt({ I: 3, L: 0.08, idealno: false, seed: 7 });
  const F6 = B.sila;
  B.nMag = 3;
  const F3 = B.sila;
  assert.ok(F3 / F6 > 0.4 && F3 / F6 < 0.6, `${F3 / F6}`);
  for (const b of B.Bm) assert.ok(Math.abs(b / MAGNETI.B0 - 1) <= 3 * MAGNETI.raztros, "raztros magnetov");
});

// ---------------------------------------------------------------- indukcija
function pad({ h = 0.3, tuljava = "t500", seed = 1, idealno = true, ...rest } = {}) {
  const B = new IndukcijaBench({ seed, idealno });
  Object.assign(B, { h, tuljava, fs: 10000 }, rest);
  B.spusti();
  return B;
}

test("induction: ∫U dt over each peak = N ΔΦ within 2 % for three drop heights", () => {
  for (const h of [0.1, 0.2, 0.35]) {
    const B = pad({ h });
    const a = B.analiza(), N = B.coil.N;
    // severni pol spodaj: magnetizacija kaže navzdol (s = −1); U = −dΛ/dt, zato ∫U dt = Λ(začetek) − Λ(konec)
    const L0 = pretokTuljava(0, N, -1), Lh = pretokTuljava(h, N, -1), Ld = pretokTuljava(B.run.G.pot(B.run.G.tEnd).z, N, -1);
    rel(a.P1, Lh - L0, 0.02, `h ${h}: prvi vrh`);
    rel(a.P2, L0 - Ld, 0.02, `h ${h}: drugi vrh`);
  }
  // ploščina ni odvisna od hitrosti: pri 20 cm in 35 cm je enaka v 2 % (magnet začne daleč od tuljave)
  rel(pad({ h: 0.2 }).analiza().P1, pad({ h: 0.35 }).analiza().P1, 0.02, "enaka ploščina");
});

test("induction: peak voltage ∝ speed within 5 %; second peak larger and of opposite sign", () => {
  const k = [];
  for (const h of [0.1, 0.2, 0.3, 0.35]) {
    const B = pad({ h }), [p1, p2] = B.vrhoviPravi(), a = B.analiza();
    k.push(p1.U / p1.v, -p2.U / p2.v);
    near(Math.sqrt(2 * 9.806 * (h - p1.z)), p1.v, 1e-3, "prosti pad");
    assert.ok(Math.sign(a.U1) === -Math.sign(a.U2), "nasprotna predznaka");
    assert.ok(Math.abs(a.U2) > Math.abs(a.U1), "drugi vrh je večji (hitrejši magnet)");
    rel(a.U1, p1.U, 0.02, "10 kHz ujame vrh");
  }
  for (const x of k) rel(x, k[0], 0.05, "U/v");
  // več ovojev, več napetosti (∝ N v 2 %)
  rel(pad({ tuljava: "t1000" }).vrhoviPravi()[0].U / pad({ tuljava: "t250" }).vrhoviPravi()[0].U, 4, 0.02, "U ∝ N");
});

test("induction: flux of the magnet through one turn = exact coaxial-loop mutual inductance (Maxwell, elliptic integrals) within 0,1 %; dipole far away within 0,5 %", () => {
  // Valj z magnetizacijo M = površinski tok M na polmeru R; pretok skozi ovoj a = ∫ M · M12(R, a, z′) dz′ (Maxwell, Jackson 5.37).
  const KE = (k) => {
    let a = 1, b = Math.sqrt(1 - k * k), c = k, sum = (k * k) / 2, p = 1;
    for (let i = 0; i < 30 && Math.abs(c) > 1e-16; i++) {
      const an = (a + b) / 2;
      c = (a - b) / 2;
      b = Math.sqrt(a * b);
      a = an;
      p *= 2;
      sum += (p * c * c) / 2;
    }
    const K = Math.PI / (2 * a);
    return { K, E: K * (1 - sum) };
  };
  const M12 = (a, b, d) => {
    const k = Math.sqrt((4 * a * b) / ((a + b) ** 2 + d * d)), { K, E } = KE(k);
    return MU0 * Math.sqrt(a * b) * ((2 / k - k) * K - (2 / k) * E);
  };
  const { Br, D, L, m } = MAGNET_IND, n = 1000;
  near(m, 2.25, 0.02, "m = Br V/μ0 za Ø 12 × 20 mm, Br 1,25 T");
  for (const a of [0.024, 0.034]) {
    for (const z of [0, 0.01, 0.02, 0.04, 0.1]) {
      let s = 0;
      for (let i = 0; i < n; i++) s += M12(D / 2, a, z - L / 2 + ((i + 0.5) * L) / n);
      rel(pretokOvoj(z, a), ((Br / MU0) * L * s) / n, 0.001, `a ${a}, z ${z}`);
    }
    const z = 0.3;
    rel(pretokOvoj(z, a), (MU0 * m * a * a) / (2 * (a * a + z * z) ** 1.5), 0.005, "dipol");
  }
});

test("induction: flipping the magnet inverts the signal; Lenz sign with N pole down (flux counted upward)", () => {
  const a = pad().analiza(), b = pad({ pol: -1 }).analiza();
  // N spodaj: pretok skozi tuljavo kaže navzdol in raste, Λ (navzgor) pada, U = −dΛ/dt > 0; ko magnet odhaja, U < 0
  assert.ok(a.U1 > 0 && a.U2 < 0, `${a.U1}, ${a.U2}`);
  near(b.U1, -a.U1, 2 * new IndukcijaBench().lsb, "prvi vrh");
  near(b.U2, -a.U2, 2 * new IndukcijaBench().lsb, "drugi vrh");
});

test("mistake: ±1 V range clips the 1000-turn coil at 1 V", () => {
  const B = pad({ tuljava: "t1000", range: "1", fs: 1000 });
  assert.ok(B.run.clipped);
  const a = B.analiza();
  near(Math.abs(a.U1), 1, 1e-9, "odrezan vrh");
  assert.ok(Math.abs(B.vrhoviPravi()[0].U) > 1.5, "prava napetost je večja");
  assert.equal(pad({ tuljava: "t1000", range: "10", fs: 1000 }).run.clipped, false);
});

test("mistake: 100 Hz sampling misses the peak (lower on average, never higher than noise allows)", () => {
  const tru = Math.abs(pad().vrhoviPravi()[0].U), r = [];
  for (let seed = 1; seed <= 30; seed++) r.push(Math.abs(pad({ seed, idealno: false, fs: 100 }).analiza().U1) / tru);
  const mean = r.reduce((a, b) => a + b) / r.length;
  assert.ok(mean < 0.98, `povprečje ${mean}`);
  assert.ok(Math.min(...r) < 0.9, "vsaj en spust zgreši vrh za >10 %");
  for (const x of r) assert.ok(x <= 1.015, "nikoli nad pravim vrhom (+1 % umeritve, šum)");
});

test("sensor noise ~0,5 LSB (≤ 1 LSB) before the magnet arrives", () => {
  const B = pad({ idealno: false, seed: 4 });
  const u = B.run.vzorci.filter((p) => p[0] < 0.1).map((p) => p[1]);
  const m = u.reduce((a, b) => a + b) / u.length;
  const sd = Math.sqrt(u.reduce((a, b) => a + (b - m) ** 2, 0) / u.length);
  assert.ok(sd <= B.lsb && sd >= 0.3 * B.lsb, `σ = ${sd / B.lsb} LSB`);
  near(B.lsb, 20 / 2 ** SENZOR.bitov, 1e-12, "12 bitov na ±10 V");
});

test("mistake: open circuit records only mains hum; narrow tube jams the magnet", () => {
  const o = pad({ idealno: false, prikljuceno: false, fs: 1000 });
  for (const [, U] of o.run.vzorci) assert.ok(Math.abs(U) < 0.05, "brum < 50 mV");
  const z = pad({ idealno: false, cev: "ozka", fs: 1000 });
  assert.ok(z.run.G.zataknjen);
  for (const [, U] of z.run.vzorci) assert.ok(Math.abs(U) <= 3 * z.lsb, "zataknjen magnet: nič napetosti");
});

test("galvanometer: a falling magnet barely kicks it (two opposite pulses), a slow hand push deflects it", () => {
  const spust = pad({ merilnik: "galvanometer", tuljava: "t1000" }).galvOdklon;
  const roka = pad({ merilnik: "galvanometer", tuljava: "t1000", nacin: "roka", vRoka: 0.3 }).galvOdklon;
  assert.ok(Math.abs(spust) < 0.25, `spust: ${spust}`);
  assert.ok(Math.abs(roka) > 0.5, `roka: ${roka}`);
  // z roko: oba sunka imata enako ploščino (pretok tja in nazaj)
  const r = pad({ nacin: "roka", vRoka: 0.3, fs: 1000 }).analiza();
  rel(-r.P1, r.P2, 0.02, "tja in nazaj");
  // roka do 1 m/s: lega se ne zlomi (zvezno gibanje, največja hitrost dosežena)
  for (const vRoka of [0.6, 1]) {
    const G = new IndukcijaBench({ idealno: true });
    G.nacin = "roka";
    G.vRoka = vRoka;
    const g = G.gibanje();
    let prev = g.pot(0).z, skok = 0, vmax = 0;
    for (let t = 0; t < g.tEnd; t += 1e-4) {
      const p = g.pot(t);
      skok = Math.max(skok, Math.abs(p.z - prev));
      vmax = Math.max(vmax, Math.abs(p.v));
      prev = p.z;
    }
    assert.ok(skok <= vRoka * 1e-4 * 1.01, `v ${vRoka}: skok ${skok}`);
    near(vmax, vRoka, 1e-9, "največja hitrost");
  }
});

test("simplifications are listed for all three benches and in Slovene", () => {
  for (const k of ["elektromagnet", "sila", "indukcija"]) {
    assert.ok(POENOSTAVITVE_MAGNETIZEM[k].length >= 4, k);
    for (const s of POENOSTAVITVE_MAGNETIZEM[k]) assert.ok(!/phet/i.test(s) && /[čšž]/i.test(POENOSTAVITVE_MAGNETIZEM[k].join(" ")), s);
  }
  assert.ok(JEDRA.palica.Nd > 0.03 && JEDRA.palica.Nd < 0.06, "razmagnetilni faktor palice 12 × 2 cm");
  assert.ok(ZELEZO.Js < 2.2);
});
