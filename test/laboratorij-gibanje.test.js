// Virtualni laboratorij, gibanje (public/sim/lab-model-gibanje.js): klanec, prosti pad, drugi Newtonov zakon.
// Dovoljeno odstopanje je zapisano pri vsakem testu (docs/laboratorij.md).
import test from "node:test";
import assert from "node:assert/strict";
import {
  ProgaBench, PadBench, PROGA, VOZICEK, SKRIPEC, PREDMETI, CASOVNIK, SPUST, VRATA, G_LJ, gostotaZraka, koncnaHitrost,
  pospesekKlanec, pospesekNewton, casovnikRead, casovnikSpec, makeCasovnik, zastira, naklonSkoziIzhodisce, premica, POENOSTAVITVE_GIBANJE,
} from "../public/sim/lab-model-gibanje.js";
import { rng } from "../public/sim/lab-model.js";

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} ni ${b} ± ${tol}`);
const rel = (a, b, tol, msg) => assert.ok(Math.abs(a / b - 1) <= tol, `${msg}: ${a} ni ${b} ± ${tol * 100} %`);

function klanec({ kvadri = 3, seed = 1, idealno = false, izravnaj = true, spust = "magnet", nacin = "spust", g1 = 0.4, g2 = 0.9, zarek = 0.07, palice = 0 } = {}) {
  const B = new ProgaBench({ seed, idealno });
  if (izravnaj) B.izravnaj();
  B.kvadri = kvadri;
  B.nPalic = palice;
  B.spust = spust;
  B.nacin = nacin;
  B.zarek = zarek;
  B.postaviVrata(0, g1);
  B.postaviVrata(1, g2);
  B.spusti();
  return B;
}
// pospešek iz časov od spusta (magnet: od trenutka, ko se voziček res premakne)
const aIzCasov = (B) => {
  const m = B.meritev(), z = B.magnet.zamik;
  return [[B.vrata[0].x - PROGA.u0, m.t1 - z], [B.vrata[1].x - PROGA.u0, m.t2 - z]].map(([s, t]) => (2 * s) / (t * t));
};

// ---------------------------------------------------------------- klanec
test("frictionless incline: a = g sin θ / (1 + I/(m r²)) within 0,5 % (wheel inertia ~4 %)", () => {
  for (const n of [1, 3, 5]) {
    const B = klanec({ kvadri: n, idealno: true });
    const a = pospesekKlanec({ sin: B.sinTheta, mur: 0 });
    near(B.sinTheta, n * 0.02, 1e-4, "sin θ = h / 100 cm");
    for (const x of aIzCasov(B)) rel(x, a, 0.005, `${n} kvadri`);
    rel(a, (G_LJ * B.sinTheta) / (1 + VOZICEK.Iw / VOZICEK.m), 1e-9, "formula");
    assert.ok(a < 0.97 * G_LJ * B.sinTheta && a > 0.95 * G_LJ * B.sinTheta, "vrtenje koles vzame ~4 %");
  }
});

test("incline with rolling friction μr: a = g (sin θ − μr cos θ) / (1 + I/(m r²)) within 0,5 %; heavier cart only slightly faster", () => {
  const vals = [];
  for (let seed = 1; seed <= 20; seed++) {
    const B = klanec({ kvadri: 2, seed });
    assert.ok(B.mur >= 0.002 && B.mur <= 0.005, "μr v mejah literature");
    const a = pospesekKlanec({ sin: B.sinTheta, mur: B.mur, M: B.M });
    for (const x of aIzCasov(B)) rel(x, a, 0.005, `seme ${seed}`);
    vals.push(a);
  }
  const L = klanec({ kvadri: 2, seed: 4 }), T = klanec({ kvadri: 2, seed: 4, palice: 2 });
  const aL = pospesekKlanec({ sin: L.sinTheta, mur: L.mur, M: L.M }), aT = pospesekKlanec({ sin: T.sinTheta, mur: T.mur, M: T.M });
  assert.ok(aT > aL && aT < 1.04 * aL, `težji voziček le malo hitrejši (manjši delež vrtenja): ${aL} → ${aT}`);
});

test("flag speed v = d/Δt equals the true speed at mid-blocking within 2 % (0,1 ms resolution, dEff 0,2 mm)", () => {
  for (let seed = 1; seed <= 30; seed++) {
    const B = klanec({ kvadri: 4, seed });
    const m = B.meritev(), A = B.run.tr[0];
    const v = VOZICEK.zastavica / m.dt1, vt = B.hitrost((A.tin + A.tout) / 2);
    rel(v, vt, 0.02, `seme ${seed}`);
  }
});

test("timer: reading never further than ±(0,01 % + 0,1 ms) from the true time (500 seeds), always a multiple of 0,1 ms", () => {
  for (let seed = 1; seed <= 500; seed++) {
    const c = makeCasovnik(rng(seed));
    for (const t of [0.0031, 0.2468, 1.5, 9.87654]) {
      const x = casovnikRead(c, t);
      assert.ok(Math.abs(x - t) <= casovnikSpec(t) + 1e-12, `seme ${seed}, ${t}: ${x}`);
      near(x * 1e4, Math.round(x * 1e4), 1e-6, "zadnja števka 0,1 ms");
    }
  }
  assert.equal(CASOVNIK.res, 1e-4);
  // na progi: kanal t₂ in Δt₂ od pravih prehodov (jitter vrat je del poti, ne časovnika)
  for (let seed = 1; seed <= 100; seed++) {
    const B = klanec({ kvadri: 3, seed }), m = B.meritev(), A = B.run.tr[1];
    assert.ok(Math.abs(m.t2 - (A.tin - B.run.ts)) <= casovnikSpec(m.t2) + 1e-12, `t₂ seme ${seed}`);
    assert.ok(Math.abs(m.dt2 - (A.tout - A.tin)) <= casovnikSpec(m.dt2) + 1e-12, `Δt₂ seme ${seed}`);
  }
});

test("s(t²) through the origin with the magnet; release delay 5 ms ± 1,5 ms (ocena) is in the timer reading", () => {
  const B = klanec({ kvadri: 3, seed: 7 });
  const pts = [];
  for (const [g1, g2] of [[0.3, 0.5], [0.6, 0.8], [0.95, 1.05]]) {
    B.postaviVrata(0, g1);
    B.postaviVrata(1, g2);
    B.spusti();
    const m = B.meritev();
    pts.push([m.t1 ** 2, g1 - PROGA.u0], [m.t2 ** 2, g2 - PROGA.u0]);
  }
  const a = 2 * naklonSkoziIzhodisce(pts);
  rel(a, pospesekKlanec({ sin: B.sinTheta, mur: B.mur }), 0.02, "a = 2k");
  assert.ok(B.magnet.zamik >= 0.0035 && B.magnet.zamik <= 0.0065, "zamik magneta");
  assert.ok(B.run.tm === B.run.pot[1][0] && B.run.ts === 0, "časovnik začne ob izklopu, voziček kasneje");
});

test("mistake: track not level at 0 blocks — the cart drifts or stays; after levelling it stays put", () => {
  const D = new ProgaBench({ seed: 3 });
  D.beta = 0.006; // miza nagnjena 6 mm/m navzdol v smeri gibanja
  D.spusti();
  assert.ok(D.lega(Infinity).u > PROGA.u0 + 0.3, "voziček se sam odpelje");
  const U = new ProgaBench({ seed: 3 });
  U.beta = -0.004; // navzgor: ne premakne se
  U.spusti();
  near(U.lega(Infinity).u, PROGA.u0, 1e-9, "obstane");
  // z enim kvadrom (sin θ = 0,02) da neizravnana miza pospešek z napako ~25 %
  U.kvadri = 1;
  U.spusti();
  const aU = pospesekKlanec({ sin: U.sinTheta, mur: U.mur }), aL = pospesekKlanec({ sin: 0.02, mur: U.mur });
  assert.ok(aU < 0.85 * aL, `neizravnana proga: ${aU} proti ${aL}`);
  const L = new ProgaBench({ seed: 3 });
  L.izravnaj();
  assert.ok(Math.abs(L.beta) <= 0.0003 + 1e-12, "libela ±0,3 mm/m");
  L.spusti();
  near(L.lega(Infinity).u, PROGA.u0, 1e-9, "na izravnani progi brez kvadrov voziček miruje (μr > nagib)");
});

test("mistake: release with a push (v₀ ≠ 0) — times shorter and s(t²) has an intercept", () => {
  const M = klanec({ kvadri: 2, seed: 5, spust: "magnet" }), P = klanec({ kvadri: 2, seed: 5, spust: "potisk" });
  const m = M.meritev(), p = P.meritev();
  assert.ok(p.t1 < 0.75 * m.t1, `s potiskom hitreje: ${p.t1} proti ${m.t1}`);
  const v0 = P.hitrost(P.run.tm + 0.001);
  assert.ok(v0 >= SPUST.potisk[0] - 0.01 && v0 <= SPUST.potisk[1] + 0.01, "v₀");
  const aP = aIzCasov(P);
  assert.ok(Math.abs(aP[0] / aP[1] - 1) > 0.1, "a = 2s/t² ni več enak pri obeh vratih");
});

test("mistake: gates in the wrong order (mode gate 1 → gate 2) — timer starts at gate 1 and waits forever", () => {
  const B = klanec({ kvadri: 3, seed: 2, nacin: "vrata", g1: 0.8, g2: 0.4 });
  const m = B.meritev();
  assert.equal(m.t12, null, "ni ustavljen");
  const c = B.casovnik(B.run.tEnd + 5);
  assert.ok(c.t1 > 5 && !c.stop[0], "časovnik teče naprej");
  const OK = klanec({ kvadri: 3, seed: 2, nacin: "vrata", g1: 0.4, g2: 0.8 }).meritev();
  assert.ok(OK.t12 > 0.3 && OK.t12 < 1.5, `pravilni vrstni red: ${OK.t12}`);
});

test("mistake: beam above the flag (no signal), on the cart body (Δt ×8), on the track profile (always dark)", () => {
  assert.equal(zastira(0.1).kaj, "nic");
  const N = klanec({ zarek: 0.1 }).meritev();
  assert.equal(N.t1, null);
  assert.equal(N.dt1, null);
  const ok = klanec({ zarek: 0.07, seed: 4 }).meritev(), body = klanec({ zarek: 0.03, seed: 4 }).meritev();
  assert.ok(body.dt1 > 6 * ok.dt1, `telo vozička (17 cm) namesto zastavice (2 cm): ${body.dt1} proti ${ok.dt1}`);
  assert.ok(body.t1 < ok.t1, "telo zastre žarek prej kot zastavica");
  const P = klanec({ zarek: 0.005 });
  assert.equal(P.meritev().t1, null);
  assert.ok(P.zastrt(0) && P.zastrt(1), "LED ves čas sveti");
});

test("hand release with the start key: start offset up to ±0,1 s (σ 40 ms, ocena)", () => {
  let big = 0;
  for (let seed = 1; seed <= 60; seed++) {
    const B = klanec({ kvadri: 3, seed, spust: "roka" });
    const off = B.run.ts - B.run.tm;
    assert.ok(Math.abs(off) <= 2.5 * SPUST.roka.sigma + 1e-12);
    if (Math.abs(off) > 0.02) big++;
  }
  assert.ok(big > 20, "pogosto več kot 20 ms");
});

test("bumper at the end of the track: the cart hits it and bounces back with ~1/3 of the speed", () => {
  const B = klanec({ kvadri: 5, seed: 1 });
  assert.ok(B.run.udarec && B.run.udarec.v > 1, "udarec v odbijač");
  const t = B.run.udarec.t;
  assert.ok(B.hitrost(t + 0.02) < 0 && Math.abs(B.hitrost(t + 0.02)) < 0.4 * B.run.udarec.v, "odboj nazaj");
  near(B.lega(Infinity).u, PROGA.uMax, 0.01, "na koncu obmiruje ob odbijaču");
});

// ---------------------------------------------------------------- prosti pad
function pad({ predmet = "jeklo", h = 1, seed = 1, idealno = false, spust = "magnet", premik = null } = {}) {
  const P = new PadBench({ seed, idealno });
  P.predmet = predmet;
  P.spust = spust;
  P.premik = premik ?? -P.zamikVrat; // poravnana vrata
  P.postavi(h);
  P.spusti();
  return P;
}

test("steel ball from 1,000 m: t = 0,4517 s ± 1 ms (g = 9,806 m/s², drag included, no release delay)", () => {
  const P = pad({ idealno: true });
  near(P.meritev().t, 0.4517, 0.001, "t");
  near(Math.sqrt(2 / G_LJ), 0.45162, 0.00001, "vakuum");
  assert.ok(P.run.tin > Math.sqrt(2 / G_LJ), "zračni upor malo podaljša čas");
  near(P.run.tin, Math.sqrt(2 / G_LJ), 0.0005, "upor pri jekleni kroglici < 0,5 ms");
});

test("steel ball: g from the slope of h(t²) within 2 % (real noise, 5 ms magnet delay), delay matters at small h", () => {
  for (let seed = 1; seed <= 10; seed++) {
    const pts = [];
    for (const h of [0.4, 0.8, 1.2, 1.6, 2.0]) {
      const P = pad({ h, seed });
      pts.push([P.meritev().t ** 2, P.hNom]);
    }
    const { a, b } = premica(pts);
    rel(2 * a, G_LJ, 0.02, `seme ${seed}: g iz naklona premice`);
    assert.ok(2 * a < G_LJ, "zamik δ zmanjša naklon za ~δ/t ≈ 1 %");
    assert.ok(b < 0, "premica ne gre skozi izhodišče: zamik spusta");
  }
  // mistake: gate 2 cm below the magnet — the delay is ~8 % of the time, g is >10 % too small
  const P = pad({ h: 0.02, seed: 3 }), g = (2 * P.hNom) / P.meritev().t ** 2;
  assert.ok(g < 0.9 * G_LJ, `g pri 2 cm: ${g}`);
  const Q = pad({ h: 1.5, seed: 3 }), g2 = (2 * Q.hNom) / Q.meritev().t ** 2;
  rel(g2, G_LJ, 0.02, "pri 1,5 m le ~1 %");
});

test("air: ρ = pM/RT (1,157 kg/m³ at 22 °C and 98 kPa); ping-pong ball: terminal speed 8–9,5 m/s and measurably slower from 2 m", () => {
  near(gostotaZraka(22, 98000), 1.157, 0.002, "gostota zraka");
  near(gostotaZraka(0, 101325), 1.2922, 0.002, "pri normalnih pogojih (literatura 1,2922)");
  const vt = koncnaHitrost(PREDMETI.pingpong, 1.157);
  assert.ok(vt > 8 && vt < 9.5, `končna hitrost žogice ${vt}`);
  near(PREDMETI.jeklo.m, 0.01684, 0.0001, "16 mm jeklena kroglica 16,8 g");
  const S = pad({ h: 2, idealno: true }), T = pad({ h: 2, idealno: true, predmet: "pingpong", spust: "klesce" });
  assert.ok(T.run.tin - T.run.tm - (S.run.tin - S.run.tm) > 0.02, "žogica zaostane > 20 ms");
  assert.ok(T.hitrostPri(2) < 0.92 * S.hitrostPri(2), "in je počasnejša");
  // pri 2 m (6,3 m/s) je upor jeklene kroglice ~1,3 % teže, žogice ~50 %: 2k iz h(t²) je za žogico > 5 % pod g
  near((2 * G_LJ * 2) / koncnaHitrost(PREDMETI.jeklo, 1.157) ** 2, 0.013, 0.001, "upor/teža jeklo pri 2 m");
  const pts = [0.4, 0.8, 1.2, 1.6, 2.0].map((h) => {
    const X = pad({ h, idealno: true, predmet: "pingpong", spust: "klesce" });
    return [(X.run.tin - X.run.tm) ** 2, h];
  });
  assert.ok(2 * naklonSkoziIzhodisce(pts) < 0.95 * G_LJ, `žogica: 2k = ${2 * naklonSkoziIzhodisce(pts)}`);
});

test("coffee filter reaches its terminal speed ~1,1 m/s (literature ~1–1,5 m/s) within 0,5 m; feather ~0,6 m/s", () => {
  const F = pad({ predmet: "filter", spust: "klesce", h: 1, idealno: true });
  const vt = koncnaHitrost(PREDMETI.filter, F.rho);
  assert.ok(vt > 1 && vt < 1.3, `filter ${vt}`);
  rel(F.hitrostPri(0.5), vt, 0.02, "po pol metra že končna hitrost");
  rel(F.hitrostPri(1.5), vt, 0.001, "ne pospešuje več");
  const t1 = F.run.tin - F.run.tm, F2 = pad({ predmet: "filter", spust: "klesce", h: 2, idealno: true }), t2 = F2.run.tin - F2.run.tm;
  rel((2 - 1) / (t2 - t1), vt, 0.01, "enakomerno gibanje: razlika poti / razlika časov = končna hitrost");
  near(koncnaHitrost(PREDMETI.pero, F.rho), 0.6, 0.05, "pero");
});

test("mistakes: electromagnet does not hold the ping-pong ball; gate offset larger than the radius misses the ball", () => {
  const P = new PadBench({ seed: 1 });
  P.predmet = "pingpong";
  P.spust = "magnet";
  assert.equal(P.drzi(), false);
  assert.equal(P.spusti(), null);
  P.spust = "klesce";
  assert.ok(P.drzi() && P.spusti());
  // odmik 9 mm > polmer 8 mm: kroglica gre mimo žarka, časovnik ne ustavi
  const M = pad({ seed: 2 });
  M.premik = 0.009 - M.zamikVrat;
  M.spusti();
  assert.equal(M.meritev().t, null);
  // odmik 5 mm: žarek seka tetivo, Δt krajši, v = D/Δt prevelik
  const C = pad({ seed: 2, idealno: true, premik: 0.005 }), O = pad({ seed: 2, idealno: true, premik: 0 });
  const vC = PREDMETI.jeklo.D / C.meritev().dt, vO = PREDMETI.jeklo.D / O.meritev().dt;
  assert.ok(vC > 1.2 * vO, `tetiva: ${vC} proti ${vO}`);
  assert.ok(Math.abs(pad({ seed: 9 }).zamikVrat) >= 0.002, "vrata so ob postavitvi zamaknjena");
});

test("release delays: magnet 5 ± 1,5 ms per device ± 0,3 ms per drop, clamp 12 ± 4 ms ± 1,5 ms (ocena); timer starts at the release signal", () => {
  for (let seed = 1; seed <= 50; seed++) {
    const P = pad({ seed }), K = pad({ seed, spust: "klesce" });
    const zm = P.zamikSpust.magnet, zk = K.zamikSpust.klesce;
    assert.ok(zm >= 0.0035 - 1e-12 && zm <= 0.0065 + 1e-12, `magnet (naprava) ${zm}`);
    assert.ok(Math.abs(P.run.tm - zm) <= SPUST.magnet.jitter + 1e-12, `magnet (spust) ${P.run.tm}`);
    assert.ok(zk >= 0.008 - 1e-12 && zk <= 0.016 + 1e-12, `klešče (naprava) ${zk}`);
    assert.ok(Math.abs(K.run.tm - zk) <= SPUST.klesce.jitter + 1e-12, `klešče (spust) ${K.run.tm}`);
    assert.ok(Math.abs(P.meritev().t - P.run.tin) <= casovnikSpec(P.run.tin) + 1e-12, "časovnik v mejah");
  }
});

// ---------------------------------------------------------------- drugi Newtonov zakon
function newton({ naObes = 2, naVoz = 4, palice = 0, podlozka = null, seed = 1, idealno = false, g1 = 0.3, g2 = 0.7, skripec = 0, nacin = "spust", vrvica = true, spust = "magnet" } = {}) {
  const B = new ProgaBench({ seed, idealno, skripec: true });
  B.izravnaj();
  B.podlozka = podlozka ?? Math.round(B.mur * 1000 * 2) / 2; // pravilna izravnava trenja na 0,5 mm
  B.naObes = naObes;
  B.naVoz = naVoz;
  B.nPalic = palice;
  B.visinaSkripca = skripec;
  B.nacin = nacin;
  B.vrvica = vrvica;
  B.spust = spust;
  B.postaviVrata(0, g1);
  B.postaviVrata(1, g2);
  B.spusti();
  return B;
}
const aN = (B) => {
  const m = B.meritev(), z = B.magnet.zamik;
  return (2 * (B.vrata[1].x - PROGA.u0)) / (m.t2 - z) ** 2;
};

test("Newton II: a = (m_o g − F_p) / (M + m_o + I_k/r² + I_p/r²) within 0,5 % (frictionless, level)", () => {
  for (const [o, v, p] of [[0, 6, 0], [2, 4, 0], [6, 0, 0], [3, 3, 2]]) {
    const B = newton({ naObes: o, naVoz: v, palice: p, idealno: true, podlozka: 0 });
    const a = pospesekNewton({ mo: B.mo, M: B.M });
    rel(aN(B), a, 0.005, `${o}/${v}/${p}`);
    rel(a, (B.mo * G_LJ - SKRIPEC.Fp) / (B.M + B.mo + VOZICEK.Iw + SKRIPEC.Ip), 1e-12, "formula");
  }
});

test("Newton II: moving masses keeps total mass; a ∝ F through the origin when friction is compensated, intercept when not", () => {
  const pts = [], ptsN = [];
  for (let o = 0; o <= 5; o++) {
    const B = newton({ naObes: o, naVoz: 6 - o, seed: 11 });
    near(B.M + B.mo, newton({ naObes: 0, naVoz: 6, seed: 11 }).M + newton({ naObes: 0, naVoz: 6, seed: 11 }).mo, 1e-12, "skupna masa enaka");
    pts.push([B.moNaz * 9.81, aN(B)]);
    const N = newton({ naObes: o, naVoz: 6 - o, seed: 11, podlozka: 0 });
    ptsN.push([N.moNaz * 9.81, aN(N)]);
  }
  const L = premica(pts), LN = premica(ptsN);
  assert.ok(Math.abs(L.b) < 0.02, `izravnano: premica skozi izhodišče (b = ${L.b})`);
  assert.ok(LN.b < -0.02, `brez izravnave trenja: odsek na osi (b = ${LN.b})`);
  rel(L.a, 1 / (0.25 + 0.07 + VOZICEK.Iw + SKRIPEC.Ip), 0.04, "naklon = 1/m (m s kolesi in škripcem)");
});

test("Newton II: every 10 g mass is in one place (cart, hanger or box); moving one keeps exactly the same set", () => {
  const B = new ProgaBench({ seed: 5, skripec: true });
  B.naObes = 4;
  B.naVoz = 4; // prekriva se z obešalom: utežica gre na voziček in z obešala izgine (nikoli ni šteta dvakrat)
  assert.equal(B.naVoz + B.naObes, 6);
  B.naVoz = 2;
  B.naObes = 1;
  assert.equal(B.kje.filter((k) => k === "s").length, 3, "3 v škatli");
  const sum = () => B.M - B.mVoz + B.mo - B.mObes;
  const s0 = sum();
  assert.ok(B.prestavi("v", "o"));
  near(sum(), s0, 1e-15, "z vozička na obešalo gre ista utežica");
  assert.ok(B.prestavi("o", "v"));
  near(sum(), s0, 1e-15, "in nazaj");
  assert.ok(B.prestavi("s", "o"));
  assert.ok(Math.abs(sum() - s0 - 0.01) <= 2e-5, "iz škatle pride ena utežica");
  for (let i = 0; i < 10; i++) B.prestavi("s", "o");
  assert.equal(B.naObes + B.naVoz, 6, "škatla je prazna, več utežic ni");
  B.naVoz = 0;
  assert.ok(!B.prestavi("v", "o"), "na vozičku ni utežic");
});

test("Newton II: a ∝ 1/m at constant force (cart bars 0/1/2 × 250 g)", () => {
  const pts = [];
  for (const p of [0, 1, 2]) {
    const B = newton({ naObes: 2, naVoz: 0, palice: p, seed: 4 });
    pts.push([1 / (B.Mnaz + B.moNaz), aN(B)]);
  }
  const k = naklonSkoziIzhodisce(pts);
  for (const [x, y] of pts) rel(y, k * x, 0.06, "a·m ≈ F");
  assert.ok(pts[0][1] > 2 * pts[2][1], "trikrat težji voziček: dobra tretjina pospeška");
});

test("mistakes: hanger hits the floor after 82 cm (a lower at the far gate), pulley 5 cm too high (a ~1 % lower near the pulley), string off", () => {
  const B = newton({ naObes: 4, naVoz: 2, g1: 0.3, g2: 1.05, seed: 2, nacin: "vrata" });
  assert.ok(B.run.tla && B.run.tla.u < 1, "obešalo na tleh");
  near(B.run.tla.u - PROGA.u0, SKRIPEC.H0, 0.002, "po 82 cm");
  const a = pospesekNewton({ mo: B.mo, M: B.M, sin: B.sinTheta, mur: B.mur }), m = B.meritev();
  const v1 = VOZICEK.zastavica / m.dt1, v2 = VOZICEK.zastavica / m.dt2, aV = (v2 * v2 - v1 * v1) / (2 * (B.vrata[1].x - B.vrata[0].x));
  assert.ok(aV < 0.95 * a, `a = (v₂² − v₁²)/2s premajhen: ${aV} proti ${a}`);
  // pravi pospešek med 75 in 95 cm: škripec 5 cm previsoko → vrvica poševno (φ do 13°), vodoravna komponenta manjša
  const aLok = (X) => {
    const [A, C] = X.run.tr;
    return (X.hitrost(C.tin) - X.hitrost(A.tin)) / (C.tin - A.tin);
  };
  const P = newton({ naObes: 3, naVoz: 3, skripec: 1, g1: 0.75, g2: 0.95, seed: 2, idealno: true, podlozka: 0 });
  const O = newton({ naObes: 3, naVoz: 3, skripec: 0, g1: 0.75, g2: 0.95, seed: 2, idealno: true, podlozka: 0 });
  assert.ok(aLok(P) < 0.995 * aLok(O), `vrvica poševno: ${aLok(P)} proti ${aLok(O)}`);
  const S = newton({ vrvica: false, seed: 2 });
  assert.equal(S.meritev().t1, null, "brez vrvice voziček stoji (trenje izravnano)");
});

test("friction compensation check: pushed cart without string keeps its speed (Δt₁ ≈ Δt₂) only when the shim is right", () => {
  const ok = newton({ vrvica: false, spust: "potisk", seed: 8, nacin: "vrata" }).meritev();
  const no = newton({ vrvica: false, spust: "potisk", seed: 8, nacin: "vrata", podlozka: 0 }).meritev();
  const too = newton({ vrvica: false, spust: "potisk", seed: 8, nacin: "vrata", podlozka: 8 }).meritev();
  rel(ok.dt2 / ok.dt1, 1, 0.03, "izravnano: enaka hitrost");
  assert.ok(no.dt2 / no.dt1 > 1.03, "brez podložke se ustavlja");
  assert.ok(too.dt2 / too.dt1 < 0.97, "preveč nagnjeno: pospešuje");
});

test("data: M3 masses, cart, simplifications and sources", () => {
  for (let seed = 1; seed <= 200; seed++) {
    const B = new ProgaBench({ seed, skripec: true });
    for (const m of B.utezi) assert.ok(Math.abs(m - 0.01) <= 2e-5 + 1e-12, "10 g ±20 mg");
    assert.ok(Math.abs(B.mObes - 0.01) <= 2e-5 + 1e-12);
    for (const v of B.vrata) assert.ok(Math.abs(v.x - v.nom) <= 3 * VRATA.postavitev + 1e-12);
  }
  near(PREDMETI.pingpong.m, 0.0027, 1e-9, "ITTF 2,7 g");
  near(PREDMETI.pingpong.D, 0.04, 1e-9, "ITTF 40 mm");
  assert.ok(Object.values(POENOSTAVITVE_GIBANJE).every((l) => l.length >= 4));
  const a = klanec({ seed: 9 }).meritev(), b = klanec({ seed: 9 }).meritev();
  assert.deepEqual(a, b, "isto seme, ista meritev");
});
