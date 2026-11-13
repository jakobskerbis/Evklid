// Virtualni laboratorij, elektrika (public/sim/lab-model-elektrika.js): vezava in prevodnost snovi.
// Dovoljeno odstopanje je zapisano pri vsakem testu (docs/laboratorij.md).
import test from "node:test";
import assert from "node:assert/strict";
import { AM_RANGES, VM_RANGES, meterSpec, fuseRate } from "../public/sim/lab-model.js";
import { VezBench, rSkupni, tester, MATERIALI, matR, TESTER } from "../public/sim/lab-model-elektrika.js";

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} ni ${b} ± ${tol}`);
const bench = (seed, set) => Object.assign(new VezBench({ seed }), set);

test("nominal totals: series R1 + R2 + R3, parallel 1/R = Σ 1/Ri, mixed R1 + (R2 ∥ R3)", () => {
  assert.equal(rSkupni("zaporedno", [100, 220, 470]), 790);
  near(rSkupni("vzporedno", [100, 220]), 68.75, 1e-9, "100 ∥ 220");
  near(rSkupni("mesano", [100, 220, 470]), 100 + 1 / (1 / 220 + 1 / 470), 1e-9, "mešana");
});

test("Kirchhoff in the model: series U = U1 + U2 (+ ammeter burden), parallel I = I1 + I2 (to 1e-6 relative)", () => {
  for (const vez of ["zaporedno", "vzporedno", "mesano"])
    for (const n of [2, 3]) {
      const b = bench(5, { vez, n, U0: 6 });
      b.am = { pos: "zaporedno", at: "glavni" };
      b.vm = { pos: "vzporedno", at: "glavni" };
      const st = b.solve(), e = st.el, c = b.count, Rsh = AM_RANGES["200m"].rsh;
      if (vez === "zaporedno") {
        near(e.slice(0, c).reduce((s, x) => s + x.U, 0) + st.Iam * Rsh, st.Uvm, 1e-6 * st.Uvm, `${vez} ${n}: vsota napetosti`);
        for (const x of e.slice(0, c)) near(x.I, st.Iam, 1e-6 * st.Iam, "isti tok");
      } else if (vez === "vzporedno") {
        near(e.slice(0, c).reduce((s, x) => s + x.I, 0), st.Iam, 1e-6 * st.Iam, `${vez} ${n}: vsota tokov`);
        for (const x of e.slice(0, c)) near(x.U, e[0].U, 1e-9, "ista napetost");
      } else {
        near(e[1].I + e[2].I, e[0].I, 1e-6 * e[0].I, "mešana: I1 = I2 + I3");
        near(e[1].U, e[2].U, 1e-9, "mešana: U2 = U3");
      }
    }
});

test("measured R_total = U/I agrees with R_true within the meter specs and with the colour code within ±5 % (200 seeds)", () => {
  for (let seed = 1; seed <= 200; seed++)
    for (const [vez, n, kinds] of [["zaporedno", 2, ["R100", "R220"]], ["zaporedno", 3, ["R47", "R220", "R470"]], ["vzporedno", 2, ["R100", "R220"]], ["vzporedno", 3, ["R220", "R470", "R470"]], ["mesano", 3, ["R100", "R220", "R470"]]]) {
      const b = bench(seed, { vez, n, U0: 6 });
      kinds.forEach((k, i) => b.setKind(i, k));
      b.am = { pos: "zaporedno", at: "glavni" };
      b.vm = { pos: "vzporedno", at: "glavni" };
      const st = b.solve(), Ia = b.readA(), Uv = b.readV();
      const Rtrue = (st.Uvm - st.Iam * AM_RANGES["200m"].rsh) / st.Iam; // brez ampermetra
      const Rm = Uv.value / (Ia.value / 1000);
      const rel = meterSpec(st.Uvm, VM_RANGES["20"], "V") / st.Uvm + meterSpec(st.Iam, AM_RANGES["200m"], "A") / (st.Iam * 1000);
      // izmerjeni U/I vključuje upor ampermetra (1 Ω): to je sistematska napaka metode, ki jo prištejemo
      near(Rm, Rtrue + AM_RANGES["200m"].rsh, rel * Rtrue + 1e-9, `seed ${seed} ${vez}`);
      near(Rtrue, b.nominalTotal(), 0.05 * b.nominalTotal(), `seed ${seed} ${vez}: toleranca uporov`);
    }
});

test("lamps: parallel 6 V lamps glow fully, series ones dimly; a removed lamp breaks a series circuit but not a parallel one", () => {
  const glow = (vez, remove) => {
    const b = bench(3, { vez, n: 2, U0: 6 });
    b.am = { pos: "brez", at: "glavni" };
    b.vm = { pos: "brez", at: "glavni" };
    b.setKind(0, "L6"), b.setKind(1, remove ? "prazno" : "L6");
    b.solve();
    return b.brightness(0);
  };
  const par = glow("vzporedno"), ser = glow("zaporedno");
  // žarnice imajo toleranco ±5 % upora, zato svetlost pri polni napetosti 0,9–1,1 nazivne
  assert.ok(par > 0.9 && par < 1.1, `vzporedno ${par}`);
  assert.ok(ser > 0.05 && ser < 0.15, `zaporedno (~3 V na vsaki: (3/6)^3,4 = 0,095) ${ser}`);
  assert.ok(glow("zaporedno", true) < 1e-6, "odvita žarnica prekine zaporedni krog");
  near(glow("vzporedno", true), par, 0.02, "vzporedno druga sveti naprej");
  // dve »enaki« žarnici vzporedno: toka se razlikujeta za največ ~10 % (toleranca ±5 %), a nista čisto enaka
  const b = bench(7, { vez: "vzporedno", n: 2, U0: 6 });
  b.setKind(0, "L6"), b.setKind(1, "L6");
  const [e1, e2] = b.solve().el;
  assert.ok(e1.I !== e2.I && Math.abs(e1.I / e2.I - 1) < 0.11, `toka ${e1.I} ${e2.I}`);
});

test("tester: ~0,3 A through a metal shows OL on 200 mA but does not blow the F 200 mA fuse (IEC 60127-2: holds ≥ 1 h at 1,5 In)", () => {
  const I = tester("baker", "zarnica", AM_RANGES["200m"].rsh).I;
  assert.ok(I > 0.2 && I < 1.5 * AM_RANGES["200m"].fuse, `tok ${I}`);
  assert.equal(fuseRate(I, AM_RANGES["200m"].fuse), 0);
});

test("mistakes: voltmeter in series, ammeter in parallel blows the fuse, short circuit hits the 1 A limit, 47 Ω burns at 12 V, 100 Ω survives", () => {
  const b = bench(2, { vez: "zaporedno", U0: 6 });
  b.vm = { pos: "zaporedno", at: "glavni" };
  b.am = { pos: "zaporedno", at: "1" };
  assert.ok(b.solve().Iam < 1e-6, "voltmeter zaporedno: tok skoraj nič");
  near(b.state.Uvm, 6, 0.01, "voltmeter zaporedno kaže napetost napajalnika");

  const f = bench(2, { vez: "vzporedno", U0: 6 });
  f.am = { pos: "vzporedno", at: "1" };
  f.step(1);
  assert.ok(f.fuseOf().blown && f.events.some((e) => e.type === "varovalka"), "ampermeter vzporedno: varovalka");

  const k = bench(2, { vez: "vzporedno", U0: 12 });
  k.setKind(1, "zica");
  k.am = { pos: "brez", at: "glavni" };
  assert.ok(k.step(0.1).cc && k.events.some((e) => e.type === "cc"), "žica vzporedno: kratek stik, omejitev 1 A");

  const z = bench(2, { vez: "vzporedno", U0: 12 });
  z.setKind(0, "R47"), z.setKind(1, "R100");
  z.am = { pos: "zaporedno", at: "glavni" };
  z.amRange = "10";
  z.step(60);
  assert.ok(z.parts[0].burnt, "47 Ω pri 12 V (3,1 W) zgori");
  assert.ok(!z.parts[1].burnt && z.parts[1].T > 200, "100 Ω pri 12 V (1,44 W) je vroč, a zdrži");
  z.replaceBurnt();
  assert.ok(!z.parts[0].burnt);
});

test("deterministic seed", () => {
  const read = (seed) => {
    const b = bench(seed, { U0: 7.3 });
    return [b.parts[0].R, b.readA().text, b.readV().text].join();
  };
  assert.equal(read(11), read(11));
  assert.notEqual(read(11), read(12));
});

// ------------------------------------------------------------------ prevodnost snovi
test("tester: metals light the lamp, pencil lead and 20 % salt water weakly, insulators and distilled water not at all", () => {
  near(matR(MATERIALI.baker), (1.68e-8 * 0.06) / (Math.PI * 0.0005 ** 2), 1e-12, "R bakrene žice iz ρ (CRC)");
  for (const id of ["baker", "aluminij", "zelezo"]) assert.equal(tester(id).stanje, "sveti", id);
  assert.equal(tester("grafit").stanje, "sibko", "mina 0,5 mm, 6 cm, ~9 Ω");
  assert.equal(tester("slana20").stanje, "sibko");
  assert.equal(tester("slana1").stanje, "ne", "1 % soli: žarnica ne sveti …");
  assert.equal(tester("slana1", "led").stanje, "sibko", "… LED pa da");
  assert.ok(tester("slana1").mehurcki, "… in mehurčki pokažejo, da tok teče");
  for (const id of ["zveplo", "steklo", "plastika", "les", "guma", "papir", "sol", "destilirana", "sladkorna"]) {
    assert.equal(tester(id).stanje, "ne", id);
    assert.equal(tester(id, "led").stanje, "ne", `${id} z LED`);
    assert.ok(tester(id).I < 1e-4, `${id}: tok pod 0,1 mA`);
  }
  // več soli, večji tok; tok skozi kovino omeji žarnica (~0,3 A pri 3,8 V)
  const I = ["destilirana", "slana1", "slana5", "slana20"].map((id) => tester(id).I);
  for (let i = 1; i < I.length; i++) assert.ok(I[i] > I[i - 1], `tok raste s koncentracijo: ${I}`);
  near(tester("baker").I, 0.3, 0.03, "baker: nazivni tok žarnice ±10 %");
  assert.ok(tester("baker").b > tester("grafit").b && tester("grafit").b > tester("slana5").b, "vrstni red svetlosti");
  assert.ok(TESTER.U - TESTER.Udec > 0, "elektroliza pusti del napetosti");
});

test("classification: copper, aluminium, iron are metals; graphite and sulfur non-metals; only iron is magnetic", () => {
  const by = (v) => Object.keys(MATERIALI).filter((k) => MATERIALI[k].vrsta === v).sort();
  assert.deepEqual(by("kovina"), ["aluminij", "baker", "zelezo"]);
  assert.deepEqual(by("nekovina"), ["grafit", "zveplo"]);
  assert.deepEqual(Object.keys(MATERIALI).filter((k) => MATERIALI[k].magnet), ["zelezo"]);
});
