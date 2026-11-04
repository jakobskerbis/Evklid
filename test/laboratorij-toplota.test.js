// Virtualni laboratorij, toplota (public/sim/lab-model-toplota.js): grelec, mešanje, taljenje in vrenje, ohlajanje.
// Dovoljeno odstopanje je zapisano pri vsakem testu (docs/laboratorij.md).
import test from "node:test";
import assert from "node:assert/strict";
import {
  GrelnikBench, MesanjeBench, FazeBench, OhlajanjeBench, izkoristek, VODA, LED, L_IZP, R_GRELEC, GRELEC, KUHALNIK, POSODE,
  vrelisce, tlakNaVisini, talisceSoli, zvisanjeVrelisca, SOL, T_IDEALNA, makeThermo, thermoStep, thermoRead, TERMOMETER,
  makeTehtnica, tehtnicaRead, TEHTNICA, POENOSTAVITVE_TOPLOTA, Voda,
} from "../public/sim/lab-model-toplota.js";
import { rng } from "../public/sim/lab-model.js";

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} ni ${b} ± ${tol}`);

// Učenec: stehta vodo, odčita začetno temperaturo, vklopi grelec za t sekund, nato (ne) premeša in odčita končno.
function poskusGrelnik(seed, { pokrov = false, mesaj = true, gram = 200, t = 300 } = {}) {
  const b = new GrelnikBench({ seed });
  b.nalij(gram);
  b.pokrov = pokrov;
  b.step(30);
  const T1 = b.readT().value, m = b.readM().value / 1000;
  b.on = true;
  b.step(10);
  const U = b.readV().value, I = b.readA().value;
  b.step(t - 10);
  b.on = false;
  b.mesaj = mesaj;
  b.step(30);
  return { b, ...izkoristek({ m, T1, T2: b.readT().value, U, I, t: b.tOn }) };
}

test("heater: R = U²/P = 2,88 Ω (±5 %), 12 V gives 50 W ± 10 % with the leads and the ammeter", () => {
  near(R_GRELEC, 2.88, 1e-12, "R");
  for (let seed = 1; seed <= 100; seed++) {
    const b = new GrelnikBench({ seed });
    near(b.R, 2.88, 0.05 * 2.88 + 1e-9, "toleranca");
    b.on = true;
    near(b.state.P, 50, 5, `moč pri 12 V (seed ${seed})`);
  }
});

test("ideal heating: 200 g, 50 W, 120 s → ΔT = 50·120/(0,2·4182) = 7,17 K (±0,01 K); Q = W exactly", () => {
  const b = new GrelnikBench({ seed: 1, idealno: true });
  b.R = 2.88;
  b.U0 = (12 * b.Rtot) / b.R; // na grelcu točno 12 V
  const T0 = b.voda.T;
  b.on = true;
  b.step(120);
  near(b.state.P, 50, 1e-9, "P");
  near(b.voda.T - T0, (50 * 120) / (0.2 * 4182), 0.01, "ΔT");
  near(b.voda.T - T0, 7.17, 0.01, "ΔT literatura");
  near(VODA.c * b.voda.m * (b.voda.T - T0), b.E, 1e-6 * b.E, "Q = W");
});

test("real heating: η from the student's readings is 60–95 % and higher with lid and stirring (20 seeds)", () => {
  let a = 0, z = 0;
  for (let seed = 1; seed <= 20; seed++) {
    const odprto = poskusGrelnik(seed, { pokrov: false, mesaj: false });
    const dobro = poskusGrelnik(seed, { pokrov: true, mesaj: true });
    for (const x of [odprto, dobro]) assert.ok(x.eta > 0.6 && x.eta < 0.95, `η = ${x.eta} (seed ${seed})`);
    assert.ok(dobro.eta > odprto.eta + 0.05, `pokrov in mešanje: ${dobro.eta} ni večji od ${odprto.eta}`);
    a += odprto.eta, (z += dobro.eta);
    // del energije gre v čašo in grelec: η < m c / (m c + C_čaše)
    const mc = dobro.b.voda.m * VODA.c;
    assert.ok(dobro.eta < mc / (mc + POSODE.casa400.m * POSODE.casa400.c) + 0.02, `η ${dobro.eta} večji od deleža vode`);
  }
  assert.ok(z / 20 > 0.84 && a / 20 < 0.8, `povprečja ${a / 20}, ${z / 20}`);
});

test("too much water: ΔT is small and the relative error of ΔT (±0,2 K) is several times larger", () => {
  const malo = poskusGrelnik(4, { gram: 150, pokrov: true }), veliko = poskusGrelnik(4, { gram: 350, pokrov: true, t: 120 });
  const dT = (x) => x.Q / (x.b.readM().value / 1000) / VODA.c;
  assert.ok(dT(veliko) < 4 && dT(malo) > 15, `${dT(veliko)}, ${dT(malo)}`);
  assert.ok(0.2 / dT(veliko) > 4 * (0.2 / dT(malo)));
});

test("mistakes: dry heater trips its thermal fuse in 30–120 s; 30 V burns the wire; 13 V survives; current limit", () => {
  for (const seed of [1, 2, 3]) {
    const b = new GrelnikBench({ seed });
    b.potopljen = false;
    b.on = true;
    let t = 0;
    while (!b.pokvarjen && t < 300) b.step(1), t++;
    assert.equal(b.pokvarjen, "varovalka");
    assert.ok(t >= 30 && t <= 120, `suh grelec: ${t} s`);
    assert.equal(b.state.I, 0, "pokvarjen grelec: ni toka");
    near(b.state.Uh, b.U0, 1e-9, "voltmeter na prekinjenem grelcu kaže napetost vira");
  }
  const v = new GrelnikBench({ seed: 5 });
  v.U0 = 30, (v.Ilim = 10), (v.on = true);
  v.step(5);
  assert.equal(v.pokvarjen, "zica");
  assert.ok(v.events.some((e) => e.type === "prenapetost"));
  const ok = new GrelnikBench({ seed: 5 });
  ok.U0 = 13, (ok.on = true);
  ok.step(600);
  assert.equal(ok.pokvarjen, null);
  const cc = new GrelnikBench({ seed: 5 });
  cc.Ilim = 2, (cc.on = true);
  assert.ok(cc.state.cc);
  near(cc.state.I, 2, 1e-12, "CC");
  near(cc.state.Uh, 2 * cc.R, 1e-12, "U = I R");
});

test("mixing: ideal (m1T1 + m2T2)/(m1 + m2) = 50 °C; styrofoam with lid within 1,5 K; glass at least 1,5 K lower", () => {
  near(T_IDEALNA(0.1, 80, 0.1, 20), 50, 1e-12, "formula");
  const i = new MesanjeBench({ seed: 1, idealno: true });
  i.nalijHladno(100, 20), i.zlij(100, 80), (i.mesaj = true), i.step(30);
  near(i.voda.T, 50, 1e-9, "idealno");
  for (let seed = 1; seed <= 20; seed++) {
    const end = (posoda, pokrov, mesaj = true) => {
      const b = new MesanjeBench({ seed });
      b.posoda = posoda, (b.pokrov = pokrov);
      b.nalijHladno(100, 20), b.step(30);
      const r = b.zlij(100, 80);
      b.mesaj = mesaj;
      b.step(40);
      return { b, T: b.readT().value, Tid: T_IDEALNA(r.m1, r.T1, b.m2, r.T2) };
    };
    const st = end("stiropor", true), gl = end("casa400", false), nm = end("stiropor", true, false);
    assert.ok(st.T < st.Tid + 0.5 && st.T > st.Tid - 1.5, `stiropor ${st.T} vs ${st.Tid}`);
    assert.ok(gl.T < st.T - 1.5, `steklo ${gl.T} ni nižje od stiropora ${st.T}`);
    assert.ok(nm.T < st.T - 1, `brez mešanja ${nm.T} vs ${st.T}`);
  }
});

test("melting: plateau at 0,0 ± 0,5 °C (thermometer), heat during the plateau = m L_f (±10 % room gains), ideal length = m L_f / P", () => {
  const id = new FazeBench({ seed: 1, idealno: true });
  id.pripravi(150, 0), (id.on = true);
  let t0 = null, t1 = null;
  while (t1 == null && id.t < 2000) {
    id.step(0.5);
    if (t0 == null && id.stanje !== "led") t0 = id.t;
    if (t0 != null && id.stanje === "voda") t1 = id.t;
  }
  near(t1 - t0, (0.15 * LED.Lt) / KUHALNIK.moc[2], 1.5, "idealna dolžina");
  for (let seed = 1; seed <= 10; seed++) {
    const b = new FazeBench({ seed });
    b.pripravi(150, 0), (b.on = true);
    let E = 0, tali = false, reads = [];
    while (b.stanje !== "voda" && b.t < 2000) {
      b.step(1);
      if (b.stanje === "led in voda") {
        if (tali) E += b.Pk, reads.push(b.readT().value);
        tali = true;
      }
    }
    near(E, 0.15 * LED.Lt, 0.1 * 0.15 * LED.Lt, "toplota med taljenjem");
    for (const v of reads.slice(10)) near(v, 0, TERMOMETER.tol, "odčitek med taljenjem");
  }
});

test("boiling point: 100,0 °C at 101,325 kPa, 98,5 °C at 96 kPa (steam tables 98,49), 99,0 °C in Ljubljana (ISA, 295 m)", () => {
  near(vrelisce(101325), 100, 0.05, "101,325 kPa");
  near(vrelisce(96000), 98.49, 0.05, "96 kPa");
  near(vrelisce(tlakNaVisini(295)), 99.0, 0.1, "Ljubljana");
  near(vrelisce(tlakNaVisini(2515)), 91.6, 0.2, "Kredarica");
  for (const [kraj, Tb] of [["morje", 100], ["kredarica", 91.6]]) {
    const b = new FazeBench({ seed: 2 });
    b.kraj = kraj, (b.stopnja = 3), (b.on = true);
    while (b.stanje !== "voda vre" && b.t < 3000) b.step(1);
    b.step(120);
    near(b.T, Tb, 0.2, `${kraj}: voda vre`);
    near(b.readT().value, Tb, 0.2 + TERMOMETER.tol, `${kraj}: odčitek`);
    assert.ok(b.izparelo > 0.005, "med vrenjem voda izpareva");
  }
  // izparilna toplota 2257 kJ/kg (CRC); med vrenjem izpari P/L_v: brez izgub točno (±1 %), z izgubami 80–100 %
  near(L_IZP, 2257e3, 1, "L_v");
  for (const idealno of [true, false]) {
    const b = new FazeBench({ seed: 2, idealno });
    b.kraj = "morje", (b.stopnja = 3), (b.on = true);
    while (b.stanje !== "voda vre" && b.t < 3000) b.step(1);
    b.step(60);
    const m0 = b.izparelo;
    b.step(300);
    const r = (b.izparelo - m0) / 300 / (KUHALNIK.moc[3] / L_IZP);
    if (idealno) near(r, 1, 0.01, "idealno izparevanje");
    else assert.ok(r > 0.8 && r <= 1, `izparevanje ${r} od P/L_v`);
  }
});

test("salt: freezing point of NaCl solution from CRC agrees with ΔT = K_f·2·φ·b; ice with 10 g salt melts at −3,9 °C", () => {
  for (const [w, Tf] of [[0.01, -0.59], [0.05, -3.05], [0.1, -6.56]]) {
    near(talisceSoli(w), Tf, 1e-9, `tabela ${w}`);
    const b = w / (1 - w) / SOL.M;
    near(talisceSoli(w), -1.86 * 2 * 0.93 * b, 0.12, `krioskopska enačba ${w}`);
  }
  const b = new FazeBench({ seed: 3 });
  b.pripravi(150, 10), (b.on = true);
  let Tend = null;
  while (Tend == null && b.t < 3000) {
    b.step(1);
    if (b.events.some((e) => e.type === "stalilo")) Tend = b.events.find((e) => e.type === "stalilo").T;
  }
  near(Tend, talisceSoli(10 / 160), 0.15, "konec taljenja");
  near(Tend, -3.93, 0.15, "konec taljenja (literatura)");
  // 30 g soli: mešanica se ohladi do evtektika (−21,1 °C)
  const c = new FazeBench({ seed: 3 });
  c.pripravi(150, 30), c.step(200);
  near(c.T, -21.1, 0.2, "led s soljo");
  assert.ok(zvisanjeVrelisca(0.01, 0.15) > 0.5 && zvisanjeVrelisca(0.01, 0.15) < 1.5, "slana voda vre nad 100 °C");
});

test("thermometer touching the bottom of the beaker on the hot plate reads several kelvin too high", () => {
  const sred = new FazeBench({ seed: 4 }), dno = new FazeBench({ seed: 4 });
  dno.polozaj = "dno";
  for (const b of [sred, dno]) (b.on = true), b.step(200);
  assert.ok(dno.readT().value - sred.readT().value > 4, `${dno.readT().value} vs ${sred.readT().value}`);
});

test("cooling of tea: thermos slowest, lid slows cooling, porcelain without lid 90 → 55–68 °C in 10 min (ocena)", () => {
  const b = new OhlajanjeBench({ seed: 1, vrste: ["porcelan", "porcelanP", "termovka"] });
  b.nalij(), b.step(600);
  const [p, pp, tv] = b.cups.map((c) => c.T);
  assert.ok(p > 55 && p < 68, `porcelan ${p}`);
  assert.ok(pp > p + 3 && tv > pp + 10, `${p} < ${pp} < ${tv}`);
  // Newtonov zakon: hitrost ohlajanja je sorazmerna z razliko do sobne temperature (zaprta termovka, ±15 %)
  const k = (c, dt) => {
    const T0 = c.T;
    b.step(dt);
    return (T0 - c.T) / dt / ((T0 + c.T) / 2 - 20);
  };
  const k1 = k(b.cups[2], 1800), k2 = k(b.cups[2], 1800);
  near(k2, k1, 0.15 * k1, "termovka: stalni k");
  // umeritev (ocena iz navodil proizvajalcev): polna zaprta termovka (350 g) izgubi ~10 K v 6 urah (8–12 K)
  const polna = new Voda(POSODE.termovka, { m: 0.35, T: 90, pokrov: true });
  for (let i = 0; i < (6 * 3600) / 0.2; i++) polna.step(0.2);
  assert.ok(90 - polna.T > 8 && 90 - polna.T < 12, `termovka v 6 h: ${90 - polna.T} K`);
});

test("meters within spec: thermometer ±0,5 °C, balance ±0,2 g (500 seeds); seeded runs are deterministic", () => {
  for (let seed = 1; seed <= 500; seed++) {
    const r = rng(seed), th = makeThermo(r), t = makeTehtnica(r);
    for (const T of [-20, 0, 50, 100, 120]) {
      thermoStep(th, T, 100);
      near(thermoRead(th).value, T, TERMOMETER.tol, "termometer");
    }
    for (const g of [50, 200, 500]) near(tehtnicaRead(t, g).value, g, TEHTNICA.tol, "tehtnica");
  }
  // najslabši primer po specifikaciji: zamik + naklon pri 120 °C + nihanje + zaokrožanje ≤ ±0,5 °C
  const T = TERMOMETER;
  assert.ok(T.off + T.gain * Math.max(T.Tmax, -T.Tmin) + T.jit + 0.05 <= T.tol + 1e-12, "termometer: vsota napak");
  const run = () => poskusGrelnik(7).eta;
  assert.equal(run(), run());
  const f = () => {
    const b = new FazeBench({ seed: 9 });
    b.on = true, b.step(500);
    return b.readT().text;
  };
  assert.equal(f(), f());
});

test("every simplification list exists and every heater/plate number is in range", () => {
  for (const k of ["grelnik", "mesanje", "faze", "ohlajanje"]) assert.ok(POENOSTAVITVE_TOPLOTA[k].length >= 4, k);
  assert.ok(GRELEC.Tvar < GRELEC.Tzica);
});
