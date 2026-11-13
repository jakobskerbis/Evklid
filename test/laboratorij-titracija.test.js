// Virtualni laboratorij: titracija kisline z NaOH (public/sim/lab-model-titracija.js).
// Vsak test primerja model z vrednostjo iz literature; dovoljeno odstopanje je v imenu testa (docs/laboratorij.md).
import test from "node:test";
import assert from "node:assert/strict";
import { solvePH, volumeAtPH, inFraction, indicatorColor, INDIKATORJI as I, TitrBench, BIRETA, PIPETA, ERLENMAJERICA, KA_OCETNA } from "../public/sim/lab-model-titracija.js";

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} ni ${b} ± ${tol}`);
const r05 = (x) => Math.round(x / 0.05) * 0.05; // skrben učenec odčita bireto na 0,05 mL

// ------------------------------------------------------------------ pH iz bilance nabojev
test("initial pH: 0.1 M HCl 1.00 (±0.01), 0.1 M acetic acid 2.88 (±0.02)", () => {
  near(solvePH({ cl: 2.5, V: 25 }), 1.0, 0.01, "HCl");
  near(solvePH({ ac: 2.5, V: 25 }), 2.88, 0.02, "ocetna kislina");
});

test("equivalence: HCl + NaOH pH 7.00 (±0.01); acetic acid half-equivalence pH = pKa 4.76 (±0.02), equivalence 8.72 (±0.03)", () => {
  near(solvePH({ cl: 2.5, na: 2.5, V: 50 }), 7.0, 0.01, "močna–močna");
  near(-Math.log10(KA_OCETNA), 4.76, 0.005, "pKa");
  near(solvePH({ ac: 2.5, na: 1.25, V: 37.5 }), 4.76, 0.02, "polovica ekvivalence");
  near(solvePH({ ac: 2.5, na: 2.5, V: 50 }), 8.72, 0.03, "ekvivalenca");
  // čez ekvivalenco odloča presežek OH⁻, razredčen z dodano prostornino: 0,5 mmol v 55 mL → pH = 14 + log(0,5/55) = 11,96
  near(solvePH({ cl: 2.5, na: 3, V: 55 }), 11.96, 0.01, "HCl + 30 mL NaOH");
  near(solvePH({ ac: 2.5, na: 3, V: 55 }), 11.96, 0.01, "ocetna kislina + 30 mL NaOH");
  // pred ekvivalenco: HCl 1,5 mmol v 35 mL → pH 1,37; ocetna kislina Henderson–Hasselbalch 4,756 + log(1/1,5) = 4,58
  near(solvePH({ cl: 2.5, na: 1, V: 35 }), 1.37, 0.01, "HCl + 10 mL NaOH");
  near(solvePH({ ac: 2.5, na: 1, V: 35 }), 4.58, 0.01, "ocetna kislina + 10 mL NaOH");
  // pH monotono narašča z dodanim NaOH
  let prev = -1;
  for (let V = 0; V <= 50; V += 0.5) {
    const p = solvePH({ ac: 2.5, na: 0.1 * V, V: 25 + V });
    assert.ok(p > prev, `pH pri ${V} mL`);
    prev = p;
  }
});

// ------------------------------------------------------------------ indikatorji (25 mL vzorca, 0,1 mol/L, NaOH 0,1 mol/L)
test("phenolphthalein end point with HCl within 0.05 mL of equivalence", () => {
  near(volumeAtPH({ id: "hcl", c: 0.1 }, I.fenolftalein.konec), 25, 0.05, "fenolftalein, HCl");
  near(volumeAtPH({ id: "ocetna", c: 0.1 }, I.fenolftalein.konec), 25, 0.05, "fenolftalein, ocetna kislina");
});
test("methyl orange with acetic acid turns at 25–35 % of the equivalence volume (far too early)", () => {
  const f = volumeAtPH({ id: "ocetna", c: 0.1 }, I.metiloranz.konec) / 25;
  assert.ok(f >= 0.25 && f <= 0.35, `metiloranž se obarva pri ${(f * 100).toFixed(1)} %`);
  near(volumeAtPH({ id: "hcl", c: 0.1 }, I.metiloranz.konec), 25, 0.05, "metiloranž je pri HCl uporaben");
});
test("bromothymol blue end point with HCl within 0.1 mL of equivalence", () => {
  near(volumeAtPH({ id: "hcl", c: 0.1 }, I.bromtimol.konec), 25, 0.1, "bromtimol modro, HCl");
});
test("indicator colour follows the In⁻ fraction (Henderson–Hasselbalch): half at pKIn, colourless phenolphthalein in acid", () => {
  for (const k of ["fenolftalein", "metiloranz", "bromtimol"]) near(inFraction(I[k], I[k].pKIn), 0.5, 1e-12, k);
  const [r, g, b] = indicatorColor(I.fenolftalein, 4);
  assert.ok(r > 240 && g > 240 && b > 240, "brezbarvna v kislini");
  const pink = indicatorColor(I.fenolftalein, 8.2);
  assert.ok(pink[0] - pink[1] > 20, `bledo rožnata pri 8,2: ${pink}`);
  const deep = indicatorColor(I.fenolftalein, 11);
  assert.ok(deep[0] - deep[1] > 150, `močno rožnata pri 11: ${deep}`);
  const red = indicatorColor(I.metiloranz, 2), yellow = indicatorColor(I.metiloranz, 6);
  assert.ok(red[0] > 200 && red[1] < 80 && yellow[1] > 180 && yellow[2] < 60, "metiloranž rdeč → rumen");
  const ye = indicatorColor(I.bromtimol, 5), bl = indicatorColor(I.bromtimol, 9);
  assert.ok(ye[0] > 200 && ye[2] < 80 && bl[2] > 180 && bl[0] < 60, "bromtimol modro rumeno → modro");
});

// ------------------------------------------------------------------ titracija na mizi (kot učenec)
function prep(seed, { rinse = true, purge = true } = {}) {
  const b = new TitrBench({ seed });
  b.goggles = true;
  if (rinse) b.rinse();
  b.fill();
  if (purge) b.purge();
  return b;
}
// Ena titracija: odpipetiraj, dodaj indikator, odčitaj, curek do »fast« mL, nato po kapljicah do končne barve.
// overshoot: koliko sekund curek še teče, ko se barva že spremeni. Vrne odčitano porabo in pravo dodano prostornino.
function trial(b, id, ind, { fast = Infinity, overshoot = 0, pip } = {}) {
  if (b.reading() > 22) b.fill();
  b.pipette(id, pip);
  b.addIndicator(ind);
  const R1 = r05(b.reading());
  b.tap = "curek";
  while (b.reading() - R1 < fast && !b.endSeen()) b.step(0.05);
  b.tap = "zaprta";
  while (!b.endSeen() && b.reading() < 50) b.drop();
  if (overshoot) {
    b.tap = "curek";
    for (let t = 0; t < overshoot; t += 0.05) b.step(0.05);
    b.tap = "zaprta";
  }
  return { V: r05(b.reading()) - R1, added: b.flask.added, Vs: b.flask.Vs };
}
// Groba titracija in dve skrbni; koncentracija iz povprečja skrbnih (c(NaOH) = 0,1000 mol/L, pipeta 25,00 mL).
function determine(b, id, ind = "fenolftalein", opts = {}) {
  const rough = trial(b, id, ind, opts.first || {}).V;
  const V = [trial(b, id, ind, { fast: rough - 1.5, ...opts }).V, trial(b, id, ind, { fast: rough - 1.5, ...opts }).V];
  return { c: (0.1 * (V[0] + V[1])) / 2 / 25, V, rough };
}

test("careful titration recovers the seeded concentration within ±0.3 % (10 seeds, HCl and acetic acid, phenolphthalein)", () => {
  for (let seed = 1; seed <= 10; seed++)
    for (const id of ["hcl", "ocetna", "kis"]) {
      const b = prep(seed);
      const { c, V } = determine(b, id);
      near(c / b.c[id] - 1, 0, 0.003, `seed ${seed}, ${id}`);
      assert.ok(Math.abs(V[0] - V[1]) <= 0.1 + 1e-9, `seed ${seed}, ${id}: skrbni titraciji se ujemata (${V})`);
    }
});

test("mistakes: overshoot (+2 s open stopcock, > +5 %) and unrinsed burette (~0.8 mL water: first titration +1.1 to +2.2 %) give a too-high concentration", () => {
  for (let seed = 1; seed <= 10; seed++) {
    const over = prep(seed);
    const o = determine(over, "hcl", "fenolftalein", { overshoot: 2 });
    assert.ok(o.c / over.c.hcl - 1 > 0.05, `seed ${seed}: preliv ${((o.c / over.c.hcl - 1) * 100).toFixed(2)} %`);
    // 0,8 mL vode v ~51 mL titranta: c(NaOH) je ~1,6 % manjša, prva poraba ~1,6 % večja (±0,4 % zaradi pipete, birete in kapljic);
    // ko bireto dopolniš s svežim titrantom, se razredči manj (napaka se zmanjšuje)
    const wet = prep(seed, { rinse: false });
    const first = trial(wet, "hcl", "fenolftalein", { fast: 20 });
    const e1 = (0.1 * first.V) / 25 / wet.c.hcl - 1;
    assert.ok(e1 > 0.011 && e1 < 0.022, `seed ${seed}: neoprana bireta, prva titracija ${(e1 * 100).toFixed(2)} %`);
  }
});

test("mistake: air bubble in the burette tip adds its volume (0.2–0.5 mL) to the reading (±0.1 mL)", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const b = prep(seed, { purge: false });
    const Vb = b.bur.mehur;
    assert.ok(Vb >= 0.2 && Vb <= 0.5, `mehurček ${Vb}`);
    const t = trial(b, "hcl", "fenolftalein", { fast: 20 });
    assert.ok(b.events.some((e) => e.type === "mehurcek"), `seed ${seed}: curek izrine mehurček`);
    // odčitana poraba minus prava dodana prostornina = mehurček (odčitek ±0,05, bireta ±0,04)
    near(t.V - t.added, Vb, 0.1, `seed ${seed}`);
    const cTrue = b.c.hcl, cMeas = (0.1 * t.V) / 25;
    near(cMeas / cTrue - 1, Vb / (t.added), 0.006, `seed ${seed}: relativna napaka koncentracije`);
  }
  // kapljice mehurčka ne premaknejo: brez curka ni napake
  const d = prep(3, { purge: false });
  d.pipette("hcl");
  for (let i = 0; i < 40; i++) d.drop();
  assert.ok(d.bur.mehur > 0);
});

test("wrong indicator for a weak acid: methyl orange with acetic acid gives a far too low concentration (25–35 % of true)", () => {
  for (let seed = 1; seed <= 5; seed++) {
    const b = prep(seed);
    const t = trial(b, "ocetna", "metiloranz", { fast: 3 });
    const f = (0.1 * t.V) / 25 / b.c.ocetna;
    assert.ok(f > 0.25 && f < 0.35, `seed ${seed}: ${(f * 100).toFixed(1)} % prave koncentracije`);
  }
});

test("no indicator: the end point is never seen", () => {
  const b = prep(1);
  b.pipette("hcl");
  b.tap = "curek";
  for (let i = 0; i < 400; i++) b.step(0.1);
  assert.equal(b.endSeen(), false);
  assert.ok(b.pH() > 12, "raztopina je že močno bazična");
});

test("no goggles: NaOH and the acid cannot be used (the experiment does not start)", () => {
  const b = new TitrBench({ seed: 1 });
  assert.equal(b.rinse().ok, false);
  assert.equal(b.fill().ok, false);
  assert.equal(b.pipette("hcl").ok, false);
  assert.equal(b.filled, false);
});

// ------------------------------------------------------------------ pripomočki
test("equipment never exceeds its class A tolerance: pipette ±0.03 mL (ISO 648), burette ±0.05 mL (ISO 385), pH meter ±0.02", () => {
  for (let seed = 1; seed <= 500; seed++) {
    const b = new TitrBench({ seed });
    b.goggles = true;
    for (let k = 0; k < 3; k++) near(b.pipette("hcl").Vs, PIPETA.V, PIPETA.napaka, `seed ${seed}: pipeta`);
    for (let R1 = 0; R1 <= 50; R1 += 2.5)
      for (let R2 = R1; R2 <= 50; R2 += 2.5) assert.ok(Math.abs(b.calErr(R2) - b.calErr(R1)) <= BIRETA.napaka, `seed ${seed}: bireta ${R1}–${R2}`);
    for (let k = 0; k < 5; k++) {
      b.flask.na += 0.3;
      near(b.readPH(), b.pH(), 0.02 + 1e-9, `seed ${seed}: pH-meter`);
    }
  }
});

test("drops are about 0.05 mL (±10 %) and the stopcock flows 0.1 mL/s (drops) or 1 mL/s (stream)", () => {
  const b = prep(4);
  b.pipette("hcl");
  for (let i = 0; i < 50; i++) {
    const d = b.drop();
    assert.ok(d >= 0.045 - 1e-12 && d <= 0.055 + 1e-12, `kapljica ${d}`);
  }
  let a = b.flask.added;
  b.tap = "kapljice";
  for (let i = 0; i < 100; i++) b.step(0.1);
  near(b.flask.added - a, 1.0, 0.11, "10 s po kapljicah");
  a = b.flask.added;
  b.tap = "curek";
  for (let i = 0; i < 50; i++) b.step(0.1);
  near(b.flask.added - a, 5.0, 0.05, "5 s curek");
});

test("deterministic with the seeded RNG", () => {
  const run = (seed) => {
    const b = prep(seed, { purge: false });
    return [b.c.hcl, b.c.ocetna, ...determine(b, "ocetna").V, b.readPH()];
  };
  assert.deepEqual(run(11), run(11));
  assert.notDeepEqual(run(11), run(12));
});

test("burette: topping up never lowers the level, liquid is conserved, the level stops at the 50 mL mark", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const b = prep(seed);
    const cons = () => near(b.bur.u + b.bur.vol + b.bur.mehur, BIRETA.V + BIRETA.mrtva, 1e-9, `seed ${seed}: prostornina v bireti`);
    for (let k = 0; k < 5; k++) {
      const u0 = b.bur.u;
      b.fill(); // že (skoraj) polna: gladina se dvigne ali ostane, nikoli ne pade brez iztoka
      assert.ok(b.bur.u <= u0 + 1e-12, `seed ${seed}: dolivanje ne spusti gladine (${u0} → ${b.bur.u})`);
      cons();
    }
    b.pipette("hcl");
    b.tap = "curek";
    for (let i = 0; i < 1000 && b.tap === "curek"; i++) b.step(0.1);
    assert.equal(b.tap, "zaprta");
    assert.ok(b.events.some((e) => e.type === "prazna"));
    near(b.bur.u, BIRETA.V, 1e-9, `seed ${seed}: gladina pri 50 mL`);
    assert.equal(b.drop(), 0, "pod oznako 50 mL ne kaplja");
    cons();
    b.purge();
    assert.ok(b.bur.u <= BIRETA.V + 1e-9, `seed ${seed}: izpust zraka ne spusti gladine pod 50 mL`);
  }
});

test("unrinsed burette: the dilution (~1.6 %) shrinks after each top-up with fresh titrant", () => {
  const b = prep(5, { rinse: false });
  const d0 = 1 - b.bur.c / b.cNaOH;
  assert.ok(d0 > 0.014 && d0 < 0.018, `razredčitev ${d0}`);
  let prev = d0;
  for (let k = 0; k < 3; k++) {
    trial(b, "hcl", "fenolftalein", { fast: 20 });
    b.fill();
    const d = 1 - b.bur.c / b.cNaOH;
    assert.ok(d < prev && d > 0, `po ${k + 1}. dolivanju ${d}`);
    prev = d;
  }
});

test("pipetting mistakes: wet pipette ~0.8 % too low (−0.5 to −1.1 %), flask rinsed with sample ~2 % too high (+1.5 to +2.5 %), flask wet with water no error (±0.3 %)", () => {
  for (let seed = 1; seed <= 10; seed++) {
    const cases = [
      [{ pipeta: "mokra" }, -PIPETA.voda / PIPETA.V, -0.011, -0.005],
      [{ erlenmajerica: "vzorec" }, ERLENMAJERICA.ostanek / PIPETA.V, 0.015, 0.025],
      [{ erlenmajerica: "voda" }, 0, -0.003, 0.003],
      [{ erlenmajerica: "suha" }, 0, -0.003, 0.003],
    ];
    for (const [pip, , lo, hi] of cases) {
      const b = prep(seed);
      const { c } = determine(b, "ocetna", "fenolftalein", { pip, first: { pip } });
      const e = c / b.c.ocetna - 1;
      assert.ok(e > lo && e < hi, `seed ${seed}, ${JSON.stringify(pip)}: ${(e * 100).toFixed(2)} %`);
    }
  }
});
