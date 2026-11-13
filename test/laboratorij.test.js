// Virtualni laboratorij: vsak model primerjamo z znano vrednostjo iz literature ali z zakonom,
// dovoljeno odstopanje je zapisano pri vsakem testu (docs/laboratorij.md).
import test from "node:test";
import assert from "node:assert/strict";
import {
  rng, makeMeter, meterRead, meterSpec, fuseRate, lampR, fitOrigin, OhmBench, AM_RANGES, VM_RANGES, ZARNICA,
  Co2Bench, VM_SOBA, M, APNICA, BUCKA, CO2_TOPNOST,
} from "../public/sim/lab-model.js";
import { flaskLevel } from "../public/sim/lab-kem.js";

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} ni ${b} ± ${tol}`);

// ------------------------------------------------------------------ merilniki
test("multimeter stays within its datasheet accuracy (±(0,5 % + 2 digita) V, ±(1 % + 2 digita) mA)", () => {
  for (let seed = 1; seed <= 300; seed++) {
    const r = rng(seed), m = makeMeter(r);
    for (const [v, rg, kind] of [[5.93, VM_RANGES["20"], "V"], [1.234, VM_RANGES["2"], "V"], [0.0612, AM_RANGES["200m"], "A"], [0.0127, AM_RANGES["20m"], "A"], [0.255, AM_RANGES["10"], "A"]]) {
      const rd = meterRead(m, v, rg, kind);
      assert.ok(Math.abs(rd.value - v * rg.k) <= meterSpec(v, rg, kind) + 1e-9, `seed ${seed}: ${rd.text} za ${v}`);
    }
  }
  assert.equal(meterRead(makeMeter(rng(1)), 0.25, AM_RANGES["200m"], "A").text, "OL", "nad območjem kaže OL");
  assert.equal(meterRead(makeMeter(rng(1)), 6, VM_RANGES["2"], "V").text, "OL");
});

test("fast fuse blows inside the IEC 60127-2 (F) time windows", () => {
  const t = (x) => 1 / fuseRate(x, 1);
  assert.equal(fuseRate(1.5, 1), 0, "1,5 × In: zdrži vsaj 1 h");
  assert.ok(t(2.1) <= 1800, "2,1 × In: največ 30 min");
  assert.ok(t(2.75) >= 0.01 && t(2.75) <= 2, `2,75 × In: 10 ms–2 s (${t(2.75)})`);
  assert.ok(t(4) >= 0.003 && t(4) <= 0.3, `4 × In: 3 ms–0,3 s (${t(4)})`);
  assert.ok(t(10) <= 0.02, `10 × In: < 20 ms (${t(10)})`);
});

// ------------------------------------------------------------------ Ohmov zakon
test("correct circuit obeys Ohm's law with the ammeter burden (tolerance 0,01 %)", () => {
  const b = new OhmBench({ seed: 7 });
  b.U0 = 6;
  const st = b.solve();
  const R = b.parts.R100.R;
  // ampermeter 1 Ω zaporedno, voltmeter 10 MΩ vzporedno z uporom, notranji upor 0,05 Ω
  const Rp = 1 / (1 / R + 1 / 10e6);
  near(st.Iam, 6 / (0.05 + 1 + Rp), 6e-8, "tok");
  near(st.Uvm, (6 * Rp) / (0.05 + 1 + Rp), 1e-6, "napetost");
  assert.ok(Math.abs(R - 100) <= 5, "upor v toleranci ±5 %");
});

test("measured R from the I(U) slope matches the resistor within tolerance + meter accuracy", () => {
  for (let seed = 1; seed <= 40; seed++) {
    const b = new OhmBench({ seed });
    const pts = [];
    for (const U of [1, 2, 4, 6, 8]) {
      b.U0 = U;
      b.step(0.4);
      pts.push([b.readV().value, b.readA().value]);
    }
    const Rmeas = 1000 / fitOrigin(pts);
    // upor je ±5 %, merilnika skupaj ~±2 %, segrevanje pri 0,64 W malo poveča upor (50 ppm/K)
    near(Rmeas, 100, 100 * 0.075, `seed ${seed}`);
    near(Rmeas, b.parts.R100.R, b.parts.R100.R * 0.025, `seed ${seed} (pravi upor)`);
  }
});

test("wiring mistakes have real consequences", () => {
  // voltmeter zaporedno: skoraj ni toka, voltmeter kaže napetost vira
  const a = new OhmBench({ seed: 2 });
  a.U0 = 9;
  a.vmPos = "zaporedno";
  const sa = a.solve();
  assert.ok(Math.abs(sa.Iam) < 1e-6, "tok skozi 10 MΩ je pod 1 µA");
  near(sa.Uvm, 9, 0.001, "voltmeter kaže skoraj 9 V");
  // ampermeter vzporedno na območju 200 mA: kratek stik, napajalnik omeji tok na 1 A, varovalka pregori v < 0,3 s
  const b = new OhmBench({ seed: 3 });
  b.U0 = 6;
  b.amPos = "vzporedno";
  b.step(0.3);
  assert.ok(b.fuse.mA.blown, "varovalka pregori");
  assert.ok(b.events.some((e) => e.type === "cc"), "napajalnik preide v omejitev toka");
  // na območju 10 A varovalka zdrži, upornik je v kratkem stiku
  const c = new OhmBench({ seed: 3 });
  c.U0 = 6;
  c.amPos = "vzporedno";
  c.amRange = "10";
  c.step(1);
  assert.ok(!c.fuse.A10.blown);
  near(c.state.Iam, 1, 0.01, "tok omejen na 1 A");
  assert.ok(Math.abs(c.state.Uload) < 0.02, "na uporniku skoraj ni napetosti");
});

test("0,5 W resistor overheats and burns only well above its rating", () => {
  const ok = new OhmBench({ seed: 4 });
  ok.U0 = 7; // 100 Ω pri 7 V: 0,49 W
  ok.step(60);
  assert.ok(!ok.parts.R100.burnt, "pri nazivni moči zdrži");
  const hot = new OhmBench({ seed: 4 });
  hot.load = "R47";
  hot.U0 = 12; // ~3 W, 6-krat preveč
  hot.amRange = "10";
  hot.step(20);
  assert.ok(hot.parts.R47.burnt, "pri ~3 W zgori v nekaj sekundah");
  const t = hot.events.find((e) => e.type === "zgorel").t;
  assert.ok(t > 2 && t < 15, `čas do dima ${t} s`);
  const warm = new OhmBench({ seed: 4 });
  warm.U0 = 12; // 100 Ω pri 12 V: 1,44 W, vroč, a ne zgori
  warm.step(60);
  assert.ok(!warm.parts.R100.burnt && warm.events.some((e) => e.type === "vroc"));
});

test("lamp follows the tungsten rules: P ∝ U^1,6, cold filament ~10× smaller resistance", () => {
  near(6 / lampR(6), ZARNICA.Ir, 1e-12, "nazivni tok pri 6 V");
  near((3 / lampR(3)) / (6 / lampR(6)), 0.5 ** 0.6, 1e-9, "tok pri pol napetosti");
  // hladna nitka: literatura navaja 10- do 15-krat manjši upor kot pri svetenju (60 Ω → 4–6 Ω)
  assert.ok(lampR(0.001) >= 60 / 15 && lampR(0.001) <= 60 / 10, `hladna nitka ${lampR(0.001)} Ω`);
  // napajalnik iz 0 V naravnost na 8 V: s hladno nitko bi tok presegel 1 A, a v CC napetost ne sme preseči nastavljene
  const s8 = new OhmBench({ seed: 5 });
  s8.load = "L6";
  s8.solve();
  s8.U0 = 8;
  const st8 = s8.solve();
  assert.ok(!st8.cc && st8.Usup <= 8, `napajalnik ${st8.Usup} V`);
  near(st8.Iload, 0.1 * (st8.Uload / 6) ** 0.6, 1e-6, "tok žarnice pri 8 V (I ∝ U^0,6)");
  const b = new OhmBench({ seed: 5 });
  b.load = "L6";
  b.U0 = 12;
  b.step(1);
  assert.ok(b.parts.L6.burnt, "pri 12 V nitka pregori");
  const t12 = b.events.find((e) => e.type === "nitka").t;
  assert.ok(t12 > 0.3 && t12 < 1, `pri 12 V najprej močno zasveti (${t12} s)`);
  const c = new OhmBench({ seed: 5 });
  c.load = "L6";
  c.U0 = 9; // 1,5 × nazivna: življenjska doba 1000 h / 1,5^13 ≈ 5 h
  c.step(120);
  assert.ok(!c.parts.L6.burnt, "pri 9 V zdrži");
});

// ------------------------------------------------------------------ CO₂
test("molar volume at 20 °C and 101,325 kPa is 24,05 L/mol (ideal gas, CODATA R)", () => {
  near(VM_SOBA * 1000, 24.055, 0.005, "Vm");
});

test("1,00 g NaHCO₃ with excess HCl releases 0,524 g CO₂ (law of conservation of mass), part stays dissolved at first", () => {
  const b = new Co2Bench({ seed: 1 });
  b.pour("hcl", 50);
  const g = b.addSoda(1.0);
  const m0 = b.massTrue();
  const th = (g / M.NaHCO3) * M.CO2;
  near(th, 0.5239, 0.003, "teorija");
  b.step(30);
  const loss30 = m0 - b.massTrue();
  // po 30 s je v 50 mL še do 0,038 mol/L · 0,05 L · 44 g/mol = 0,084 g raztopljenega CO₂, v 80 mL nad tekočino
  // pa do 0,08 L · (1,84 − 1,20) g/L = 0,051 g CO₂ več, kot bi tehtal zrak (gostoti pri 20 °C, CRC)
  assert.ok(loss30 < th - 0.03 && loss30 > th - 0.135, `po 30 s: ${loss30}`);
  b.step(3600);
  near(m0 - b.massTrue(), th, 0.005, "po 1 h je ušel ves CO₂");
  // prostornina plina pri 20 °C: 1 g sode → 286 mL
  near((g / M.NaHCO3) * VM_SOBA * 1e6, 286, 4, "mL CO₂");
});

test("limiting reagent: 1,5 g soda + 15 mL vinegar (0,833 mol/L) gives only n(CH₃COOH) of CO₂", () => {
  const b = new Co2Bench({ seed: 2 });
  b.pour("kis", 15);
  const nAcid = 0.833 * b.acid.V;
  b.addSoda(1.5);
  b.step(600);
  assert.equal(b.spilled, 0, "brez prelivanja");
  near(b.reacted(), nAcid, 1e-6, "vsa ocetna kislina");
  near(b.reacted(), 0.0125, 0.0005, "mol CO₂ (merilni valj ±0,5 mL)");
  assert.ok(b.soda > 0.004, "ostane neporabljena soda");
});

test("lemon juice: 46,7 g/L citric acid (Penniston 2008), three protons per molecule", () => {
  const b = new Co2Bench({ seed: 3 });
  b.pour("limona", 15);
  const V = b.acid.V;
  b.addSoda(1.5);
  b.step(600);
  assert.equal(b.spilled, 0, "brez prelivanja");
  near(b.reacted(), (46.7 / M.citronska) * 3 * V, 2e-4, "3 × n(citronske kisline)");
});

test("water and soda: no gas", () => {
  const b = new Co2Bench({ seed: 4 });
  b.pour("voda", 30);
  b.addSoda(1);
  b.step(60);
  assert.equal(b.reacted(), 0);
  assert.equal(b.t0, null);
});

test("limewater turns milky with CO₂ (Ca(OH)₂ 1,73 g/L), and clears again with a large excess", () => {
  near(APNICA.c * 74.09, 1.73, 0.01, "topnost Ca(OH)₂");
  const b = new Co2Bench({ seed: 5 });
  b.setStopper("cevka");
  b.pour("kis", 30);
  b.addSoda(1);
  b.step(60);
  assert.ok(b.milky() > 0.9, "motna");
  const c = new Co2Bench({ seed: 5 });
  c.setStopper("cevka");
  c.epruveta = "voda";
  c.pour("kis", 30);
  c.addSoda(1);
  c.step(60);
  assert.equal(c.milky(), 0, "voda ostane bistra");
  const d = new Co2Bench({ seed: 6 });
  d.setStopper("cevka");
  for (let i = 0; i < 4; i++) d.pour("hcl", 20), d.addSoda(1.5), d.step(120);
  assert.ok(d.events.some((e) => e.type === "bistra"), "ob velikem presežku se zbistri");
});

test("splint goes out below 15 % O₂ and burns in air", () => {
  const b = new Co2Bench({ seed: 7 });
  assert.equal(b.splint().out, false, "v zraku gori");
  b.pour("kis", 30);
  b.addSoda(1);
  b.step(20);
  assert.equal(b.splint().out, true, "po reakciji ugasne");
  b.step(900);
  assert.equal(b.splint().out, false, "po 15 min se CO₂ izmeša z zrakom");
});

test("too much foam overflows a 100 mL flask; a closed stopper pops", () => {
  const big = new Co2Bench({ seed: 8 });
  big.pour("kis", 50);
  big.addSoda(3);
  big.step(60);
  assert.ok(big.spilled > 1, "3 g sode in 50 mL kisa se prelije");
  const small = new Co2Bench({ seed: 8 });
  small.pour("kis", 30);
  small.addSoda(1);
  small.step(60);
  assert.equal(small.spilled, 0, "1 g in 30 mL ostane v bučki");
  const shut = new Co2Bench({ seed: 9 });
  shut.setStopper("zaprto");
  shut.pour("kis", 30);
  shut.addSoda(1);
  shut.step(10);
  assert.ok(shut.events.some((e) => e.type === "zamasek"), "zamašek izleti");
});

test("CO₂ solubility and flask geometry match the real values", () => {
  near(CO2_TOPNOST * M.CO2, 1.69, 0.05, "g CO₂ na liter pri 20 °C (Sander 2015)");
  // bučka s 50 mL tekočine in samim CO₂ nad njo: 80 mL · (1,842 − 1,204) g/L = 0,051 g (CRC, 20 °C), ±3 % (idealni plin)
  const b = new Co2Bench({ seed: 1 });
  b.pour("voda", 50);
  b.x = 1;
  near(b.headspaceMass(), (BUCKA.V - b.Vliq) * (1.842 - 1.204), 0.002, "CO₂ nad tekočino");
  // ISO 1773, 100 mL: višina 105 mm; nazivnih 100 mL je pod ramo stožca (80 mm), do vrha vratu ~135 mL
  assert.ok(flaskLevel(100) < 80, "100 mL pod ramo");
  near(flaskLevel(BUCKA.V * 1000), 92, 4, "130 mL sega v vrat (do vrha ~135 mL)");
});
