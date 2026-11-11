// Popravek žil (scripts/atlas/popravi-zile.mjs, zile-mreza.mjs): na umetnih ceveh preveri, da stena z debelino,
// pokrovi, dopolnitev odrezane stene in usmeritev dajo zaprto mrežo brez lukenj, nemnogoternih robov in obrnjenih
// ploskev (isti pregled kot scripts/atlas/preveri-mreze.mjs).
import { test } from "node:test";
import assert from "node:assert/strict";
import * as G from "../scripts/atlas/zile-mreza.mjs";
import { stena, polna, dopolni, stiki, zakrpaj } from "../scripts/atlas/popravi-zile.mjs";
import { analiziraj } from "../scripts/atlas/preveri-mreze.mjs";

// Cev vzdolž osi y: polmer r, dolžina L, n stranic, obroči na korak; oba konca odprta. Normale radialne, COLOR_0 = 1.
function cev({ r = 0.01, L = 0.08, n = 12, korak = 0.005, y0 = 0, zasuk = 0 } = {}) {
  const P = [], N = [], C = [], F = [];
  const st = Math.round(L / korak);
  for (let j = 0; j <= st; j++) for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI + zasuk;
    P.push(r * Math.cos(a), y0 + j * korak, r * Math.sin(a));
    N.push(Math.cos(a), 0, Math.sin(a));
    C.push(1, 1, 0, 1);
  }
  for (let j = 0; j < st; j++) for (let i = 0; i < n; i++) {
    const a = j * n + i, b = j * n + (i + 1) % n, c = a + n, d = b + n;
    F.push(a, c, b, b, c, d); // zunanja stran navzven
  }
  return mreza(P, N, C, F);
}
function mreza(P, N, C, F) {
  const m = { P, A: new Map([["NORMAL", { n: 3, d: N }], ["COLOR_0", { n: 4, d: C }]]), F, zrcaljeno: false, spremenjeno: false };
  return G.zvari(m);
}
// Obrez z ravnino z = z0 (ostane z ≥ z0), kot bisect v izvozu: nova oglišča na ravnini.
function obrezi(m, z0) {
  const P = m.P.slice(), N = m.A.get("NORMAL").d.slice(), C = m.A.get("COLOR_0").d.slice(), F = [];
  const rez = new Map();
  const naRobu = (a, b) => {
    const k = a < b ? `${a}_${b}` : `${b}_${a}`;
    if (rez.has(k)) return rez.get(k);
    const za = m.P[a * 3 + 2], zb = m.P[b * 3 + 2], t = (z0 - za) / (zb - za);
    const i = P.length / 3;
    for (let c = 0; c < 3; c++) { P.push(m.P[a * 3 + c] + (m.P[b * 3 + c] - m.P[a * 3 + c]) * t); N.push(N[a * 3 + c]); }
    P[i * 3 + 2] = z0;
    C.push(1, 1, 0, 1);
    rez.set(k, i);
    return i;
  };
  for (let f = 0; f < m.F.length; f += 3) {
    const v = [m.F[f], m.F[f + 1], m.F[f + 2]];
    const not = v.map((i) => m.P[i * 3 + 2] >= z0);
    const poly = [];
    for (let k = 0; k < 3; k++) {
      const a = v[k], b = v[(k + 1) % 3];
      if (not[k]) poly.push(a);
      if (not[k] !== not[(k + 1) % 3]) poly.push(naRobu(a, b));
    }
    for (let k = 1; k + 1 < poly.length; k++) F.push(poly[0], poly[k], poly[k + 1]);
  }
  return mreza(P, N, C, F);
}
const pregled = (m) => {
  const p = Float64Array.from(m.P);
  const r = analiziraj(p, Uint32Array.from(m.F));
  return [r.odprtiRobovi, r.luknje, r.nemnogoterni, r.obrnjene, r.navznoter, r.izrojeni];
};
const prostornina = (m) => { let V = 0; for (let f = 0; f < m.F.length; f += 3) V += G.v3.dot(G.pol(m, m.F[f]), G.v3.cross(G.pol(m, m.F[f + 1]), G.pol(m, m.F[f + 2]))) / 6; return V; };

test("popravek žil: stena z debelino da zaprto cev s svetlino (prostornina stene, obroča na koncih)", () => {
  const m = cev();
  assert.equal(analiziraj(Float64Array.from(m.P), Uint32Array.from(m.F)).luknje, 2);
  const r = stena({ ime: "cev", m }, 2.5);
  assert.equal(r.obrocev, 2);
  assert.deepEqual(pregled(m), [0, 0, 0, 0, 0, 0]);
  // prostornina stene dvanajstkotne cevi: L · (S(r) − S(r − t)), S = ploščina pravilnega dvanajstkotnika
  const S = (x) => 3 * x * x;
  const V = 0.08 * (S(0.01) - S(0.0075));
  assert.ok(Math.abs(prostornina(m) - V) / V < 0.02, `prostornina ${prostornina(m)} ≠ ${V}`);
  // ponovni klic ne naredi nič (ni več odprtih koncev)
  assert.equal(stena({ ime: "cev", m }, 2.5), null);
});

test("popravek žil: polna cevka (pokrovi) in usmeritev cevi, obrnjene navznoter", () => {
  const m = cev({ r: 0.001, L: 0.02, korak: 0.002 });
  for (let f = 0; f < m.F.length; f += 3) [m.F[f + 1], m.F[f + 2]] = [m.F[f + 2], m.F[f + 1]]; // navznoter
  const u = G.usmeri(m);
  assert.equal(u.navznoter, 1);
  assert.equal(polna({ ime: "cevka", m }).koncev, 2);
  assert.deepEqual(pregled(m), [0, 0, 0, 0, 0, 0]);
  assert.ok(prostornina(m) > 0);
  const raven = cev({ r: 0.001, L: 0.02, korak: 0.002, n: 6 });
  const prej = raven.P.length;
  polna({ ime: "cevka", m: raven }, true);
  assert.equal(raven.P.length, prej, "raven pokrov ne doda oglišč");
  assert.deepEqual(pregled(raven), [0, 0, 0, 0, 0, 0]);
});

test("popravek žil: odrezana stena cevi se dopolni na istem valju, konca ostaneta odprta", () => {
  const cela = cev({ L: 0.12 });
  // ravnina z = −11,5 mm odreže lečo vzdolž cevi; da ne seže do koncev, je cev na sredini izbočena proti −z
  for (let i = 0; i < cela.P.length / 3; i++) { const y = cela.P[i * 3 + 1]; cela.P[i * 3 + 2] -= 0.004 * Math.exp(-(((y - 0.06) / 0.02) ** 2)); }
  // cev zasukamo okrog osi z, da konca ne ležita na osni ravnini (osne ravnine so obrez škatle)
  const ko = Math.cos(0.35), si = Math.sin(0.35);
  for (let i = 0; i < cela.P.length / 3; i++) { const x = cela.P[i * 3], y = cela.P[i * 3 + 1]; cela.P[i * 3] = x * ko - y * si; cela.P[i * 3 + 1] = x * si + y * ko; }
  G.zvari(cela);
  const m = obrezi(cela, -0.0115);
  const prej = analiziraj(Float64Array.from(m.P), Uint32Array.from(m.F));
  assert.equal(prej.luknje, 3, "dva konca in leča");
  const dodano = dopolni([{ ime: "cev", m }]);
  assert.ok(dodano > 10, `dodanih trikotnikov ${dodano}`);
  G.zvari(m);
  const po = analiziraj(Float64Array.from(m.P), Uint32Array.from(m.F));
  assert.deepEqual([po.luknje, po.nemnogoterni, po.obrnjene], [2, 0, 0]);
  // nova oglišča ležijo na valju izvirne cevi (odstopanje pod 0,5 mm pri polmeru 10 mm)
  for (let i = cela.P.length / 3; i < m.P.length / 3; i++) {
    const x = m.P[i * 3] * ko + m.P[i * 3 + 1] * si, y = -m.P[i * 3] * si + m.P[i * 3 + 1] * ko;
    const dz = 0.004 * Math.exp(-(((y - 0.06) / 0.02) ** 2));
    const rr = Math.hypot(x, m.P[i * 3 + 2] + dz);
    assert.ok(rr < 0.0105 && rr > 0.0090, `oglišče ${i}: polmer ${rr}`);
  }
  assert.deepEqual(pregled((stena({ ime: "cev", m }, 1), m)), [0, 0, 0, 0, 0, 0]);
});

test("popravek žil: stik dveh delov iste cevi dobi ista oglišča; luknjica se zakrpa", () => {
  const a = cev({ L: 0.04 }), b = cev({ L: 0.04, y0: 0.04, zasuk: 0.1 });
  assert.equal(stiki([{ ime: "a", m: a }, { ime: "b", m: b }]), 1);
  const kl = (p) => p.map((c) => Math.round(c * 1e7)).join(",");
  const konecA = new Set(a.W.filter((p) => Math.abs(p[1] - 0.04) < 1e-9).map(kl));
  const zacetekB = b.W.filter((p) => Math.abs(p[1] - 0.04) < 1e-9).map(kl);
  assert.equal(zacetekB.length, 12);
  for (const k of zacetekB) assert.ok(konecA.has(k), "oglišče stika se ne ujema");
  const c = cev();
  c.F.splice(6 * (5 * 12 + 3), 3); // manjka en trikotnik sredi cevi
  G.zvari(c);
  assert.equal(zakrpaj({ ime: "c", m: c }, 30), 1);
  assert.equal(analiziraj(Float64Array.from(c.P), Uint32Array.from(c.F)).luknje, 2);
});
