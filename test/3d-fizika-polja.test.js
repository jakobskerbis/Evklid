// Znanstvene preverbe 3D modelov električnega in magnetnega polja (public/3d/modeli/fizika/).
import { test } from "node:test";
import assert from "node:assert/strict";
import * as E from "../public/3d/modeli/fizika/elektricno-polje.js";
import * as M from "../public/3d/modeli/fizika/magnetno-polje.js";

const THREE = await import("three").catch(() => null);
const len = (v) => Math.hypot(v[0], v[1], v[2]);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const rel = (a, b) => Math.abs(a - b) / Math.abs(b);

// ---------------------------------------------------------------- električno polje --

test("E točkastega naboja na razdalji r je kq/r² (0,5 %) in kaže radialno", () => {
  for (const [qnC, zn] of [[5, 1], [3, -1], [10, 1]]) {
    const nab = E.naboji("tocka", qnC, zn);
    for (const p of [[0.03, 0, 0], [0, 0.05, 0.02], [-0.02, -0.04, 0.06]]) {
      const e = E.poljeE(nab, ...p), r = len(p);
      const pricak = (E.K * qnC * 1e-9) / (r * r);
      assert.ok(rel(len(e), pricak) < 0.005, `|E| = ${len(e)}, pričakovano ${pricak}`);
      assert.ok(zn * dot(e, p) / (len(e) * r) > 0.99999, "smer E ni radialna (ven pri +, noter pri −)");
    }
  }
});

test("dipol: na simetrali je E antiparalelen dipolnemu momentu", () => {
  const nab = E.naboji("dipol", 5);
  const p = [0, 0, 0];
  for (const c of nab) { p[0] += c.q * c.x; p[1] += c.q * c.y; p[2] += c.q * c.z; }
  assert.ok(len(p) > 0);
  for (const t of [[0, 0.03, 0], [0, -0.05, 0.02], [0, 0.01, -0.07], [0, 0.06, 0.06]]) {
    const e = E.poljeE(nab, ...t);
    assert.ok(len(cross(e, p)) / (len(e) * len(p)) < 1e-9, `E ni vzporeden p v ${t}`);
    assert.ok(dot(e, p) < 0, `E ni antiparalelen p v ${t}`);
  }
});

test("potencial je skladen s poljem: E = −∇V", () => {
  const nab = E.naboji("enaka", 4), h = 1e-6;
  for (const t of [[0.01, 0.03, 0.02], [-0.05, 0.01, -0.03]]) {
    const e = E.poljeE(nab, ...t);
    const g = [0, 1, 2].map((i) => { const a = t.slice(), b = t.slice(); a[i] += h; b[i] -= h; return -(E.potencial(nab, ...a) - E.potencial(nab, ...b)) / (2 * h); });
    for (let i = 0; i < 3; i++) assert.ok(Math.abs(g[i] - e[i]) < 1e-4 * len(e));
  }
});

test("silnice so tangentne na E, začnejo pri + in končajo pri − ali na robu", () => {
  for (const post of ["tocka", "dipol", "kondenzator"]) {
    const nab = E.naboji(post, 5, 1);
    const crte = E.silnice(post, 5, 1);
    assert.ok(crte.length > 0);
    let n = 0;
    for (const c of crte) {
      const P = c.tocke;
      for (let i = 2; i < P.length - 2; i += 3) {
        const a = P[i], b = P[i + 1], d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
        if (len(d) < 1e-6) continue;
        const m = [(a[0] + b[0]) / 2 * E.ENOTA, (a[1] + b[1]) / 2 * E.ENOTA, (a[2] + b[2]) / 2 * E.ENOTA];
        const e = E.poljeE(nab, ...m);
        assert.ok(dot(d, e) / (len(d) * len(e)) > 0.995, `${post}: silnica ni tangentna na E`);
        n++;
      }
      if (post !== "kondenzator") {
        const zac = P[0], kon = P[P.length - 1];
        const blizu = (p, znak) => nab.some((c) => Math.sign(c.q) === znak && Math.hypot(p[0] - c.x / E.ENOTA, p[1] - c.y / E.ENOTA, p[2] - c.z / E.ENOTA) < 0.06);
        assert.ok(blizu(zac, 1) || len(zac) > E.R_POGLED - 0.01, `${post}: silnica se ne začne pri + naboju`);
        assert.ok(blizu(kon, -1) || len(kon) > E.R_POGLED - 0.01, `${post}: silnica se ne konča pri − naboju ali na robu`);
      }
    }
    assert.ok(n > 50);
  }
});

test("Faradayevo pravilo: število silnic je sorazmerno z nabojem", () => {
  for (const q of [1, 4, 10]) assert.equal(E.silnice("tocka", q, 1).length, E.SILNIC_NA_NC * q);
  assert.equal(E.silnice("tocka", 3, -1).length, E.SILNIC_NA_NC * 3);
  assert.equal(E.silnice("enaka", 2, 1).length, 2 * E.SILNIC_NA_NC * 2);
});

test("kondenzator: polje v reži je skoraj homogeno, kaže od + k − plošči, pretok po Gaussu", () => {
  const nab = E.naboji("kondenzator", 5);
  const e0 = E.poljeE(nab, 0, 0, 0);
  assert.ok(e0[0] > 0 && Math.abs(e0[1]) < 1e-6 * e0[0] && Math.abs(e0[2]) < 1e-6 * e0[0]);
  for (const t of [[0.003, 0, 0], [-0.003, 0.01, 0], [0, -0.01, 0.01]]) assert.ok(rel(len(E.poljeE(nab, ...t)), len(e0)) < 0.05, `nehomogeno v ${t}`);
  // končni plošči: v središču E ≈ σ/ε₀ (robni pojav ga zmanjša za največ ~11 %)
  const S = (2 * E.PLOSCA.pol * E.ENOTA) ** 2, sigma = 5e-9 / S, ideal = sigma / E.EPS0;
  assert.ok(e0[0] > 0.88 * ideal && e0[0] < ideal, `E = ${e0[0]}, σ/ε₀ = ${ideal}`);
  const d = E.delezPretokaVRezi();
  assert.ok(d > 0.5 && d < 1, `delež pretoka v reži ${d}`);
});

test("ekvipotencialne ploskve točkastega naboja so krogle r = kq/V", () => {
  const nab = E.naboji("tocka", 1, 1), kq = E.K * 1e-9;
  const ravni = [kq / 0.09, kq / 0.045];
  const tris = E.izoploskve((x, y, z) => E.potencial(nab, x * E.ENOTA, y * E.ENOTA, z * E.ENOTA), ravni, 40, 0.9, true);
  assert.ok(tris.length > 500);
  for (const t of tris.slice(0, 2000)) {
    const r = len(t.a) * E.ENOTA, pricak = kq / ravni[t.li];
    assert.ok(rel(r, pricak) < 0.03, `r = ${r}, pričakovano ${pricak}`);
    assert.ok(dot(t.na, t.a) / (len(t.na) * len(t.a)) > 0.98, "normala ni v smeri E");
  }
});

test("preizkusni naboj: ob spustu brez animacije pristane na − plošči, energija se ohrani", { skip: !THREE && "three ni nameščen" }, () => {
  const m = E.zgradi(THREE, { kakovost: "nizka", gibanje: false, zacetek: { postavitev: "kondenzator", q: 8, x: -0.25, y: 1, z: 0 } });
  const n = (id) => m.nadzor.find((x) => x.id === id);
  const p0 = [-0.0025, 0.01, 0];
  n("spusti").ob();
  const izpis = n("gibanje").vrednost();
  assert.match(izpis, /negativno ploščo/);
  const p1 = m.deli.find((d) => d.id === "preizkusni-naboj").tocka.map((c) => c * E.ENOTA);
  assert.ok(p1[0] > 0.002, `končni x = ${p1[0]}`);
  const nab = E.naboji("kondenzator", 8);
  const v = Number(izpis.match(/v = ([\d,]+) cm\/s/)[1].replace(",", ".")) / 100;
  const vPricak = Math.sqrt((2 * E.Q0 * (E.potencial(nab, ...p0) - E.potencial(nab, ...p1))) / E.MASA);
  assert.ok(rel(v, vPricak) < 0.03, `v = ${v}, iz energije ${vPricak}`);
  assert.match(n("E").vrednost(), /^E = \d+,\d · 10[⁰¹²³⁴⁵⁶⁷⁸⁹]+ N\/C$/);
});

// ---------------------------------------------------------------- magnetno polje --

test("eliptična integrala K in E", () => {
  const [K, Ek] = M.elipticna(0.5);
  assert.ok(Math.abs(K - 1.8540746773) < 1e-9 && Math.abs(Ek - 1.3506438810) < 1e-9);
  const [K0, E0] = M.elipticna(0);
  assert.ok(Math.abs(K0 - Math.PI / 2) < 1e-12 && Math.abs(E0 - Math.PI / 2) < 1e-12);
});

test("raven vodnik: Biot–Savart da B = μ₀I/(2πr) (2 %), smer po pravilu desne roke", () => {
  for (const [I, r] of [[10, 0.05], [3, 0.012], [20, 0.08]]) {
    const v = M.vir("vodnik", { I, smer: 1 });
    const b = M.poljeB(v, r, 0.02, 0);
    assert.ok(rel(len(b), (M.MU0 * I) / (2 * Math.PI * r)) < 0.02, `B = ${len(b)}`);
    assert.ok(b[2] < 0 && Math.abs(b[0]) < 1e-9 * len(b) && Math.abs(b[1]) < 1e-9 * len(b), "tok +y: B v točki +x mora kazati v −z");
    const bn = M.poljeB(M.vir("vodnik", { I, smer: -1 }), r, 0.02, 0);
    assert.ok(bn[2] > 0, "obratna smer toka obrne polje");
  }
});

test("krožna zanka: eliptična formula se ujema z vsoto 720 odsekov, v središču μ₀I/(2R)", () => {
  const a = 0.03, I = 7, v = M.vir("zanka", { I });
  const odseki = [];
  for (let k = 0; k < 720; k++) {
    const f1 = (k / 720) * 2 * Math.PI, f2 = ((k + 1) / 720) * 2 * Math.PI;
    odseki.push([0, a * Math.cos(f1), a * Math.sin(f1), 0, a * Math.cos(f2), a * Math.sin(f2), I]);
  }
  const poligon = { odseki, zanke: [] };
  for (const t of [[0, 0, 0], [0.01, 0.02, 0.005], [-0.02, 0.0, 0.045], [0.004, 0.026, 0]]) {
    const b1 = M.poljeB(v, ...t), b2 = M.poljeB(poligon, ...t);
    assert.ok(len([b1[0] - b2[0], b1[1] - b2[1], b1[2] - b2[2]]) < 0.005 * len(b2), `razlika v ${t}`);
  }
  assert.ok(rel(M.poljeB(v, 0, 0, 0)[0], (M.MU0 * I) / (2 * a)) < 1e-9);
});

test("dolga tuljava: B v središču se približa μ₀nI (5 %), kratka sledi formuli končne tuljave", () => {
  const N = 300, I = 2, L = 0.3, R = 0.01;
  const b = M.poljeB(M.vir("tuljava", { N, I, dolzina: L, polmer: R }), 0, 0, 0);
  assert.ok(rel(b[0], (M.MU0 * N * I) / L) < 0.05, `B = ${b[0]}`);
  const t = M.TULJAVA, n = 20, bk = M.poljeB(M.vir("tuljava", { N: n, I: 1 }), 0, 0, 0)[0];
  const koncna = ((M.MU0 * n) / t.dolzina) * (t.dolzina / Math.hypot(t.dolzina, 2 * t.polmer));
  assert.ok(rel(bk, koncna) < 0.01, `B = ${bk}, končna tuljava ${koncna}`);
  // polje v notranjosti je homogeno
  const v = M.vir("tuljava", { N: 40, I: 1 });
  const b0 = M.poljeB(v, 0, 0, 0)[0];
  for (const p of [[0.01, 0.005, 0], [-0.015, 0, -0.008]]) assert.ok(rel(len(M.poljeB(v, ...p)), b0) < 0.06);
});

test("magnet: silnice izstopajo iz severnega in vstopajo v južni pol", () => {
  const v = M.vir("magnet"), L = M.MAGNET.dolzina, h = M.MAGNET.pol;
  for (const y of [-0.6 * h, 0, 0.5 * h]) for (const z of [-0.5 * h, 0.3 * h]) {
    assert.ok(M.poljeB(v, L / 2 + 0.001, y, z)[0] > 0, "pred severnim polom mora B kazati ven (+x)");
    assert.ok(M.poljeB(v, -L / 2 - 0.001, y, z)[0] > 0, "pred južnim polom mora B kazati noter (+x)");
  }
  assert.ok(M.poljeB(v, 0, 0.04, 0)[0] < 0, "zunaj ob magnetu teče polje od N proti S");
  const crte = M.silniceB("magnet", { visoka: false });
  let iz = 0, v2 = 0;
  const Lw = L / 2 / M.ENOTA, hw = h / M.ENOTA;
  for (const c of crte)
    for (let i = 1; i < c.tocke.length; i++) {
      const a = c.tocke[i - 1], b = c.tocke[i];
      for (const [xs, stej] of [[Lw, () => iz++], [-Lw, () => v2++]])
        if ((a[0] - xs) * (b[0] - xs) < 0 && Math.abs(a[1]) < hw && Math.abs(a[2]) < hw) { assert.ok(b[0] > a[0], "silnica gre skozi pol v napačni smeri"); stej(); }
    }
  assert.ok(iz > 5 && v2 > 5, `prehodov skozi N: ${iz}, skozi S: ${v2}`);
});

test("magnetne silnice so sklenjene in tangentne na B; okoli vodnika so krogi", () => {
  const crte = M.silniceB("vodnik", { visoka: false });
  for (const c of crte) {
    assert.ok(c.zaprta, "silnica okoli vodnika ni sklenjena");
    const r = c.tocke.map((p) => Math.hypot(p[0], p[2])), y = c.tocke.map((p) => p[1]);
    assert.ok((Math.max(...r) - Math.min(...r)) / Math.min(...r) < 0.005, "silnica ni krog");
    assert.ok(Math.max(...y) - Math.min(...y) < 1e-3);
  }
  const v = M.vir("zanka", { I: 1 });
  const zc = M.silniceB("zanka", { visoka: false });
  assert.ok(zc.filter((c) => c.zaprta).length >= 6);
  for (const c of zc)
    for (let i = 3; i < c.tocke.length - 1; i += 5) {
      const a = c.tocke[i], b = c.tocke[i + 1], d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      if (len(d) < 1e-6) continue;
      const bb = M.poljeB(v, ...[0, 1, 2].map((k) => ((a[k] + b[k]) / 2) * M.ENOTA));
      assert.ok(dot(d, bb) / (len(d) * len(bb)) > 0.995, "silnica ni tangentna na B");
    }
});

test("izpis: B vodnika je μ₀I/(2πr) z decimalno vejico", { skip: !THREE && "three ni nameščen" }, () => {
  const m = M.zgradi(THREE, { kakovost: "nizka", gibanje: true, zacetek: { vir: "vodnik", I: 10, kx: 3, ky: 2, kz: 4 } });
  const n = (id) => m.nadzor.find((x) => x.id === id);
  assert.equal(n("formula").vrednost(), "B = μ₀I/(2πr) = 40 µT pri r = 5,0 cm (I = 10 A)");
  assert.match(n("kompasB").vrednost(), /^B = 40 µT/);
});
