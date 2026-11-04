// Virtualni laboratorij, optika (public/sim/lab-model-optika.js): optični disk (lab-lom) in optična klop z lečo (lab-leca).
// Dovoljeno odstopanje je zapisano pri vsakem testu (docs/laboratorij.md).
import test from "node:test";
import assert from "node:assert/strict";
import {
  LomBench, LecaBench, SNOVI, DISK, KLOP, LECE, N_ZRAK, snell, mejniKot, fresnel, sledi, naklon, slika, nejasnost, fIzMeritev, POENOSTAVITVE_OPTIKA,
} from "../public/sim/lab-model-optika.js";

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} ni ${b} ± ${tol}`);
const RAD = Math.PI / 180;

test("Snell: 30° from air into PMMA gives 19,6° ± 0,3° (n = 1,4881 at 650 nm, Sultanova 2009), the same in the ray tracer", () => {
  near(snell(N_ZRAK, SNOVI.pmma.n, 30), 19.6, 0.3, "snell");
  const T = sledi({ snov: "pmma", smer: "zrak", alfa: 30 });
  near(T.lom.kot, 19.6, 0.3, "sledenje");
  // žarek gre skozi središče in iz okrogle ploskve izstopi pravokotno: smer se ne spremeni
  near(T.lom.kot, snell(N_ZRAK, SNOVI.pmma.n, 30), 1e-6, "okrogla ploskev ne lomi");
  // BK7 in voda
  near(sledi({ snov: "bk7", alfa: 30 }).lom.kot, Math.asin(N_ZRAK * 0.5 / 1.5145) / RAD, 1e-6, "BK7");
  near(sledi({ snov: "voda", alfa: 45 }).lom.kot, 32.07, 0.05, "voda 45°");
});

test("reflection angle = incidence angle (mirror and the block's flat face, 0–85°)", () => {
  for (const snov of ["zrcalo", "pmma", "voda"])
    for (let a = 0; a <= 85; a += 5) near(sledi({ snov, alfa: a }).odboj.kot, a, 1e-6, `${snov} ${a}°`);
  for (let a = 0; a <= 80; a += 10) near(sledi({ snov: "pmma", smer: "snov", alfa: a }).odboj.kot, a, 1e-6, `znotraj ${a}°`);
  assert.equal(sledi({ snov: "zrcalo", alfa: 30 }).lom, null);
  near(sledi({ snov: "zrcalo", alfa: 30 }).odboj.I, DISK.zrcalo, 1e-9, "zrcalo 90 %");
});

test("critical angle PMMA 42,2° ± 0,3°; total internal reflection above it, refraction below", () => {
  near(mejniKot(SNOVI.pmma.n), 42.2, 0.3, "mejni kot");
  near(mejniKot(SNOVI.voda.n), 48.7, 0.3, "voda");
  near(mejniKot(SNOVI.bk7.n), 41.3, 0.3, "BK7");
  assert.ok(sledi({ snov: "pmma", smer: "snov", alfa: 41.5 }).lom, "pod mejnim kotom se lomi");
  for (const a of [42.5, 50, 70]) {
    const T = sledi({ snov: "pmma", smer: "snov", alfa: a });
    assert.equal(T.lom, null, `popolni odboj pri ${a}°`);
    near(T.odboj.I, (1 - fresnel(N_ZRAK, SNOVI.pmma.n, 0)) ** 2, 1e-6, "vse se odbije (le izgube na okrogli ploskvi)");
  }
  const b = new LomBench({ seed: 3 });
  b.smer = "snov";
  b.laser = true;
  b.nastavi(60);
  assert.equal(b.odcitaj().popolni, true);
});

test("Fresnel: normal incidence (n−1)²/(n+1)² = 3,85 % for PMMA; the weak reflected ray grows towards grazing incidence", () => {
  near(fresnel(1, SNOVI.pmma.n, 0), ((1.4881 - 1) / (1.4881 + 1)) ** 2, 1e-12, "formula");
  near(fresnel(1, SNOVI.pmma.n, 0) * 100, 3.85, 0.05, "3,85 %");
  // lomni količnik iz Sultanove Sellmeierjeve enačbe pri 650 nm, n² − 1 = 1,1819 λ²/(λ² − 0,011313), λ v µm (± 0,0002)
  near(SNOVI.pmma.n, Math.sqrt(1 + (1.1819 * 0.4225) / (0.4225 - 0.011313)), 2e-4, "Sultanova");
  near(sledi({ snov: "pmma", alfa: 0 }).odboj.I, fresnel(N_ZRAK, SNOVI.pmma.n, 0), 1e-12, "sledenje");
  assert.ok(fresnel(1, 1.4881, 80) > 0.35 && fresnel(1, 1.4881, 60) < 0.1, "pri 80° se odbije več kot tretjina");
  // pri Brewstrovem kotu p-del izgine: R = Rs/2
  const tb = Math.atan(1.4881) / RAD;
  assert.ok(fresnel(1, 1.4881, tb) < fresnel(1, 1.4881, tb - 10) + 0.05);
});

// Učenec: α = 10° … 80°, odčita lomni kot, nariše sin β od sin α.
function serija(seed, { snov = "pmma", smer = "zrak", zamik = 0, odPloskve = false, koti = [10, 20, 30, 40, 50, 60, 70, 80] } = {}) {
  const b = new LomBench({ seed });
  Object.assign(b, { snov, smer, zamik, laser: true });
  const pts = [];
  for (const a of koti) {
    b.nastavi(a);
    const r = b.odcitaj({ odPloskve });
    if (r.lom != null) pts.push([Math.sin(r.alfa * RAD), Math.sin(r.lom * RAD), r]);
  }
  return pts;
}

test("slope of sin β vs sin α = 1/n ± 2 % (PMMA, BK7, water; 20 seeds), block → air gives n", () => {
  for (const snov of ["pmma", "bk7", "voda"])
    for (let seed = 1; seed <= 20; seed++) {
      const k = naklon(serija(seed, { snov }));
      near(k * SNOVI[snov].n, 1, 0.02, `${snov} seed ${seed}`);
    }
  for (let seed = 1; seed <= 20; seed++) near(naklon(serija(seed, { smer: "snov", koti: [5, 10, 15, 20, 25, 30, 35, 40] })) / SNOVI.pmma.n, 1, 0.02, `snov → zrak ${seed}`);
});

test("reading noise within spec: angles read to 0,5° and within ±0,5° of the true angle (500 seeds)", () => {
  for (let seed = 1; seed <= 500; seed++) {
    const b = new LomBench({ seed });
    b.laser = true;
    const a = 5 + (seed % 75);
    b.nastavi(a);
    assert.ok(Math.abs(b.alfaPravi - a) <= DISK.nastavitev + 1e-12, "nastavitev");
    const T = b.sledi(), r = b.odcitaj();
    assert.equal((r.lom * 2) % 1, 0, "pol stopinje");
    assert.ok(Math.abs(r.lom - T.lom.kot) <= DISK.odcitek + 1e-9, `lom ${r.lom} vs ${T.lom.kot}`);
    assert.ok(Math.abs(r.odboj - T.odboj.kot) <= DISK.odcitek + 1e-9, "odboj");
  }
});

test("mistakes: laser off the centre changes the reading; measuring from the surface ruins Snell's law", () => {
  const T0 = sledi({ snov: "pmma", alfa: 40 }), T3 = sledi({ snov: "pmma", alfa: 40, zamik: 3 });
  assert.ok(Math.abs(T3.lom.kot - T0.lom.kot) > 0.5, `zamik 3 mm: ${T3.lom.kot} vs ${T0.lom.kot}`);
  assert.ok(Math.abs(T3.odboj.kot - T0.odboj.kot) > 0.5, "tudi odbiti žarek zadene skalo drugje");
  // z zamikom se žarek lomi še na okrogli ploskvi: naklon ni več 1/n
  const kz = naklon(serija(1, { zamik: 4 }));
  assert.ok(Math.abs(kz * SNOVI.pmma.n - 1) > 0.02, `zamik pokvari naklon: ${kz * SNOVI.pmma.n}`);
  // od ploskve: razmerje sinusov ni stalno
  const p = serija(2, { odPloskve: true }).map(([x, y]) => y / x);
  assert.ok(Math.max(...p) - Math.min(...p) > 0.3, "od ploskve razmerje ni stalno");
});

test("deterministic seeds", () => {
  assert.deepEqual(serija(7).map((p) => p[2]), serija(7).map((p) => p[2]));
  const a = new LecaBench({ seed: 9 }), b = new LecaBench({ seed: 9 });
  assert.deepEqual(a.fPravi, b.fPravi);
  assert.deepEqual(a.odcitaj(), b.odcitaj());
});

test("lens: a = 2f → b = 2f and magnification −1; thin-lens formula; a < f virtual and upright", () => {
  for (const f of LECE) {
    const s = slika(2 * f, f);
    near(s.b, 2 * f, 1e-9, `b pri f ${f}`);
    near(s.M, -1, 1e-12, "povečava");
    assert.ok(s.realna);
  }
  const v = slika(60, 100);
  assert.ok(!v.realna && v.b < 0 && v.M > 1, "lupa: navidezna, pokončna, povečana");
  near(v.M, 2.5, 1e-9, "M = f/(f − a)");
  assert.equal(slika(100, 100).realna, false);
  // ideal bench at a = 2f: screen at 2f is sharp, image 20 mm inverted
  const B = new LecaBench({ idealno: true });
  B.f = 100;
  B.premakni("P", 100); B.premakni("Z", 900); B.premakni("L", 300); B.premakni("Z", 500);
  const S = B.stanje();
  assert.ok(S.ostro);
  near(S.y, -20, 1e-9, "obrnjena, enako velika");
  assert.equal(B.odcitaj().a, 200);
});

test("lens: 1/a + 1/b = 1/f within the depth of focus; fit of f within ±3 % (20 seeds × 3 lenses)", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const B = new LecaBench({ seed });
    for (const f of LECE) {
      near(B.fPravi[f] / f, 1, KLOP.toleranca + 1e-12, "toleranca leče");
      B.f = f;
      const r = B.r, rows = [];
      for (const k of [1.3, 1.6, 2, 2.5, 3.2]) {
        const a = Math.round(k * f);
        if (a + 4 * f > 1000) continue;
        B.xP = 0; B.xZ = 1000; B.premakni("L", a); B.premakni("P", 0);
        const [s1, s2] = B.ostroObmocje();
        // meji globinske ostrine: krog nejasnosti D·|1 − s/b| je tam natanko meja ostrine (± 1e-9 mm)
        for (const sm of [s1, s2]) near(nejasnost(B.stanje().a, sm, B.fPravi[f]), B.cMeja, 1e-9, "meja ostrine");
        const xl = B.xL + B.dL;
        // učenec postavi zaslon nekam v območje, kjer se slika zdi ostra
        const xz = Math.round(xl + s1 + (s2 - s1) * (0.1 + 0.8 * r()));
        if (xz > 1000) continue;
        B.premakni("Z", xz);
        const S = B.stanje();
        assert.ok(S.ostro, `ostro (seed ${seed}, f ${f}, a ${a})`);
        const o = B.odcitaj();
        // posamezna meritev: zaslon je v območju ostrine (±0,5 mm zaokrožitve), odčitek b pa največ 2 mm od prave razdalje (oznake ±1 mm)
        assert.ok(S.s >= s1 - 0.5 && S.s <= s2 + 0.5, `s ${S.s} ni v [${s1}, ${s2}]`);
        assert.ok(Math.abs(o.b - S.s) <= 2 * KLOP.oznaka + 1e-9 && Math.abs(o.a - S.a) <= 2 * KLOP.oznaka + 1e-9, "oznake");
        rows.push({ a: o.a, b: o.b });
      }
      assert.ok(rows.length >= 3);
      near(fIzMeritev(rows) / B.fPravi[f], 1, 0.03, `f iz meritev (seed ${seed}, f ${f})`);
    }
  }
});

test("lens: a < f gives no sharp image anywhere on the rail; a + b < 4f never sharp; reading from the rail end is wrong", () => {
  const B = new LecaBench({ seed: 4 });
  B.f = 100;
  B.xP = 0; B.xZ = 1000; B.premakni("L", 80);
  for (let z = B.xL + 15; z <= 1000; z += 1) {
    B.premakni("Z", z);
    assert.equal(B.stanje().ostro, false, `a < f, zaslon pri ${z}`);
  }
  assert.equal(B.ostroObmocje(), null);
  // predmet in zaslon 3,8 f narazen: nobena lega leče ne da ostre slike
  const f = B.fPravi[100];
  B.xP = 100; B.xL = 200; B.xZ = Math.round(100 + 3.8 * f);
  let min = Infinity;
  for (let x = B.xP + 15; x <= B.xZ - 15; x++) (B.xL = x), (min = Math.min(min, B.stanje().c));
  assert.ok(min > 2 * B.cMeja, `najmanjša nejasnost ${min} mm`);
  // pri 4,2 f pa sta dve legi
  B.xZ = Math.round(100 + 4.2 * f);
  let n = 0;
  for (let x = B.xP + 15; x <= B.xZ - 15; x++) (B.xL = x), (n += B.stanje().ostro);
  assert.ok(n >= 2, "ostra slika obstaja");
  // napačno merjenje: od začetka tračnice
  B.xP = 50; B.xL = 250; B.xZ = 450;
  const r = B.odcitaj({ od: "konec" }), r0 = B.odcitaj();
  assert.equal(r.a - r0.a, 50);
  assert.ok(Math.abs(fIzMeritev([r]) - fIzMeritev([r0])) > 10);
  near(nejasnost(200, 200, 100), 0, 1e-12, "nejasnost v sliki");
});

test("image-size reading on the screen within ±0,5 mm of the true size (300 seeds)", () => {
  for (let seed = 1; seed <= 300; seed++) {
    const B = new LecaBench({ seed });
    B.xP = 50; B.xL = 250; B.xZ = 600;
    const S = B.stanje(), r = B.odcitaj();
    assert.equal((r.y * 2) % 1, 0);
    assert.ok(Math.abs(r.y - Math.abs(S.y)) <= KLOP.ravnilo + 1e-9, `${r.y} vs ${S.y}`);
  }
});

test("simplifications are written in plain words", () => {
  for (const k of ["lom", "leca"]) assert.ok(POENOSTAVITVE_OPTIKA[k].length >= 4 && POENOSTAVITVE_OPTIKA[k].every((t) => t.length < 260));
});
