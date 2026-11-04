// Virtualni laboratorij, indikatorji (public/sim/lab-model-indikatorji.js): pH snovi iz gospodinjstva, dokazne reakcije, amilaza iz sline.
// Dovoljeno odstopanje je zapisano pri vsakem testu (docs/laboratorij.md).
import test from "node:test";
import assert from "node:assert/strict";
import {
  phMesanice, pravPH, PH_VZORCI, PhBench, PH_METER_IND, zeljePas, zeljeBarva, papirOdcitek, papirBarva, PAPIR, razvrstitevOk, skupina,
  DokazBench, ZIVILA, PRESKUSI, NEGATIVNO, SlinaBench, casRazgradnje, hitrostAmilaze, EPRUVETE, POENOSTAVITVE_INDIKATORJI,
} from "../public/sim/lab-model-indikatorji.js";
import { solvePH } from "../public/sim/lab-model-titracija.js";
import { rng } from "../public/sim/lab-model.js";

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} ni ${b} ± ${tol}`);

test("pH of computed solutions (charge balance)", () => {
  near(pravPH("kis"), 2.4, 0.1, "0,8 M ocetna kislina (Harris: ½(pKa − log c) = 2,43)");
  near(pravPH("soda"), 8.3, 0.2, "1 % NaHCO₃ (CRC: 0,1 M NaHCO₃ pH 8,3)");
  near(pravPH("hcl"), 1.0, 0.005, "0,1 M HCl");
  near(pravPH("destilirana"), 5.6, 0.1, "voda v ravnotežju s CO₂ iz zraka");
  near(pravPH("amoniak"), 11.6, 0.1, "1 M NH₃ (pKb 4,75)");
  near(pravPH("odtok"), 13.7, 0.01, "0,5 M NaOH");
  // brez CO₂ in NH₃ je to ista bilanca kot pri titraciji
  for (const x of [{ cl: 0.01 }, { ac: 0.1 }, { ac: 0.1, na: 0.05 }]) near(phMesanice(x), solvePH({ ...x, V: 1 }), 1e-9, JSON.stringify(x));
  near(phMesanice({ ac: 0.1, co2: 1e-12 }), solvePH({ ac: 0.1, V: 1 }), 1e-3, "splošna bilanca = solvePH");
});

test("dilution 10×: strong acid +1, weak acid ~+0,5, baking soda unchanged", () => {
  near(pravPH("hcl", { krat: 10 }) - pravPH("hcl"), 1, 0.01, "HCl");
  near(pravPH("kis", { krat: 10 }) - pravPH("kis"), 0.5, 0.02, "kis");
  near(pravPH("soda", { krat: 10 }) - pravPH("soda"), 0, 0.05, "amfoterni NaHCO₃");
});

test("household pH within literature ranges, sorted as in the textbook", () => {
  for (const [k, v] of Object.entries(PH_VZORCI))
    for (const r of [0, 0.5, 1]) {
      const p = pravPH(k, { r });
      assert.ok(p >= v.lit[0] - 0.05 && p <= v.lit[1] + 0.05, `${k}: ${p} izven ${v.lit}`);
    }
  for (const k of ["limona", "kis", "kola", "kava", "destilirana", "hcl"]) assert.equal(skupina(pravPH(k)), "kislo", k);
  for (const k of ["soda", "milo", "amoniak", "odtok"]) assert.equal(skupina(pravPH(k)), "bazicno", k);
  assert.ok(razvrstitevOk(6.4, "nevtralno") && razvrstitevOk(6.4, "kislo") && !razvrstitevOk(6.4, "bazicno"), "mleko blizu meje");
  assert.ok(!razvrstitevOk(2.4, "nevtralno"));
});

test("universal indicator paper reading within ±1 of the true pH, colours follow the chart", () => {
  const r = rng(7);
  for (let i = 0; i < 2000; i++) {
    const p = r() * 14;
    assert.ok(Math.abs(papirOdcitek(p, r) - p) <= 1, `papir pri ${p}`);
  }
  for (let n = 0; n <= 14; n++) assert.deepEqual(papirBarva(n), PAPIR[n]);
});

test("red cabbage colour bands match the literature scale", () => {
  const exp = [[1.5, "rdeča"], [4, "rožnata"], [6, "vijolična"], [7.5, "modro vijolična"], [8.5, "modra"], [10, "modro zelena"], [12, "zelena"], [13.5, "rumena"]];
  for (const [p, ime] of exp) assert.equal(zeljePas(p).ime, ime, `pH ${p}`);
  // kisla stran rdeča (R > B), bazična zelena ali rumena (G > B)
  assert.ok(zeljeBarva(2)[0] > zeljeBarva(2)[2] && zeljeBarva(12)[1] > zeljeBarva(12)[2]);
});

test("pH meter: uncalibrated shows an offset, calibrated within spec, carry-over detectable", () => {
  let worst = 0;
  for (let seed = 1; seed <= 300; seed++) {
    const b = new PhBench({ seed });
    b.goggles = true;
    b.potopi("destilirana"); // blizu pH 7 zamik ni skrit z napako naklona
    const raw = b.readPH();
    assert.ok(Math.abs(raw - b.pH("destilirana")) >= 0.15, `neumerjen seed ${seed}: ${raw}`);
    b.umeri();
    for (const k of ["hcl", "soda", "odtok", "destilirana", "kis"]) {
      b.sperI();
      b.potopi(k);
      b.step(5);
      worst = Math.max(worst, Math.abs(b.readPH() - b.pH(k)));
    }
  }
  assert.ok(worst <= PH_METER_IND.napaka + 1e-9, `umerjen: največja napaka ${worst}`);
  // Neoprana elektroda iz čistila za odtoke v destilirano vodo: odčitek previsok, po spiranju pravilen.
  const b = new PhBench({ seed: 3 });
  b.goggles = true;
  b.umeri();
  b.potopi("odtok");
  b.potopi("destilirana");
  b.step(5);
  const dirty = b.readPH();
  b.sperI();
  b.potopi("destilirana");
  b.step(5);
  assert.ok(dirty - b.readPH() > 0.5, `prenos: ${dirty} vs ${b.readPH()}`);
  // brez očal ne začneš
  assert.equal(new PhBench().zelje("kis").ok, false);
});

test("deterministic seeds", () => {
  const a = new PhBench({ seed: 11 }), c = new PhBench({ seed: 11 });
  assert.deepEqual(a.lit, c.lit);
  assert.deepEqual(a.surov, c.surov);
  const s1 = new SlinaBench({ seed: 5 }), s2 = new SlinaBench({ seed: 5 });
  s1.zacni(), s2.zacni(), s1.step(120), s2.step(120);
  assert.deepEqual(s1.tubes.map((u) => u.S), s2.tubes.map((u) => u.S));
});

test("food tests: starch–iodine, Fehling only with heat and reducing sugar, biuret with protein", () => {
  const t = (id, test, o = {}) => {
    const b = new DokazBench();
    b.goggles = true;
    return b.preskus(id, test, { segrej: true, ...o });
  };
  assert.equal(t("kruh", "jod").ime, "modro črna");
  assert.equal(t("krompir", "jod").ime, "modro črna");
  assert.equal(t("glukoza", "jod").ime, NEGATIVNO.jod);
  assert.equal(t("sladkor", "fehling").pozitiven, false, "saharoza ne reducira");
  assert.equal(t("sladkor", "fehling", { hidroliza: true }).pozitiven, true, "po hidrolizi da");
  assert.equal(t("glukoza", "fehling").ime, "opečnato rdeča");
  assert.equal(t("glukoza", "fehling", { segrej: false }).ime, NEGATIVNO.fehling, "brez segrevanja ostane modra");
  assert.equal(t("med", "fehling").pozitiven, true);
  assert.equal(t("beljak", "biuret").ime, "vijolična");
  assert.equal(t("mleko", "biuret").pozitiven, true);
  assert.equal(t("olje", "biuret").pozitiven, false);
  assert.equal(t("olje", "madez").ime, "prosojen masten madež");
  assert.equal(t("voda", "madez").pozitiven, false);
  for (const k of Object.keys(PRESKUSI)) assert.equal(t("voda", k).pozitiven, false, `kontrola ${k}`);
  // umazana kapalka: glukoza v epruveto s saharozo da lažno pozitiven rezultat
  const b = new DokazBench();
  b.goggles = true;
  b.preskus("glukoza", "fehling", { segrej: true });
  const r = b.preskus("sladkor", "fehling", { segrej: true, cista: false });
  assert.ok(r.pozitiven && r.onesnazeno && !r.pravi);
  assert.equal(new DokazBench().preskus("kruh", "jod").ok, false, "brez očal");
  assert.ok(Object.keys(ZIVILA).length >= 9);
});

test("salivary amylase fastest at ~37 °C, boiled saliva and 70 °C never, too much starch slower", () => {
  const t = Object.fromEntries([0, 20, 37, 70].map((T) => [T, casRazgradnje(T)]));
  near(t[37] / 60, 5, 1, "37 °C v ~5 min (ocena)");
  assert.ok(t[37] < t[20] && t[20] < t[0] && t[70] === Infinity);
  assert.equal(casRazgradnje(37, { kuhana: true }), Infinity);
  let best = 0;
  for (let T = 0; T <= 80; T++) if (hitrostAmilaze(T) > hitrostAmilaze(best)) best = T;
  near(best, 38, 3, "vrh krivulje");
  assert.ok(casRazgradnje(37, { skrob: 5 }) > 3 * t[37]);
  // simulacija z jemanjem kapljic: 37 °C prvi, prekuhana slina in kontrola ostaneta modro črni 30 min
  const b = new SlinaBench({ seed: 2 });
  b.zacni();
  for (let m = 1; m <= 30; m++) b.step(60), b.vzorci();
  const by = Object.fromEntries(b.tubes.map((u) => [u.id, u]));
  assert.ok(by.t37.tKonec < by.t20.tKonec);
  for (const k of ["kuh", "t70", "kontrola", "t0"]) assert.equal(by[k].tKonec, null, k);
  // ista kapalka: encim iz 37 °C pride v prekuhano slino, ta začne razgrajevati
  const c = new SlinaBench({ seed: 2 });
  c.ista = true;
  c.zacni();
  for (let m = 1; m <= 30; m++) c.step(60), c.vzorci();
  assert.ok(c.tubes.find((u) => u.id === "kuh").S < 0.9, "onesnažena kapalka");
  assert.equal(EPRUVETE.length, 6);
});

test("simplifications are written", () => {
  for (const k of ["ph", "dokaz", "slina"]) assert.ok(POENOSTAVITVE_INDIKATORJI[k].length >= 3);
});
