// Popravek žil (scripts/atlas/popravi-zile.mjs, zile-mreza.mjs): na umetnih ceveh preveri, da stena z debelino,
// pokrovi, dopolnitev odrezane stene in usmeritev dajo zaprto mrežo brez lukenj, nemnogoternih robov in obrnjenih
// ploskev (isti pregled kot scripts/atlas/preveri-mreze.mjs).
import { test } from "node:test";
import assert from "node:assert/strict";
import * as G from "../scripts/atlas/zile-mreza.mjs";
import { stena, polna, dopolni, stiki, zakrpaj, zasijRobove, vDrugiMrezi, konecProst } from "../scripts/atlas/popravi-zile.mjs";
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

test("popravek žil: zgostitev oglate cevi da 24 stranic na krogu, raven rob vzdolž cevi ostane", () => {
  const m = cev({ n: 12 });
  const T0 = m.F.length / 3;
  const dT = G.zgosti(m, 0.00015);
  assert.ok(dT > 0);
  // vsak obroč 12 → 24 oglišč, vzdolžni robovi (ravna cev) se ne razpolovijo: konca imata 24 oglišč
  assert.deepEqual(G.zanke(m).map((z) => z.length), [24, 24]);
  // nova oglišča ležijo na krogu (ne na tetivi): polmer vseh oglišč 10 mm ± 0,03 mm
  for (const p of m.W) assert.ok(Math.abs(Math.hypot(p[0], p[2]) - 0.01) < 3e-5, `polmer ${Math.hypot(p[0], p[2])}`);
  // skladna mreža: brez T-stikov in obrnjenih ploskev, dva odprta konca
  const r = analiziraj(Float64Array.from(m.P), Uint32Array.from(m.F));
  assert.deepEqual([r.luknje, r.nemnogoterni, r.obrnjene, r.izrojeni], [2, 0, 0, 0]);
  assert.ok(m.F.length / 3 < 3.1 * T0, "zgostitev samo po obodu");
  // pod pragom se nič ne spremeni (24 stranic: odstopanje 0,09 mm)
  assert.equal(G.zgosti(m, 0.00015), 0);
  // stena zgoščene cevi je zaprta
  stena({ ime: "cev", m }, 2.5);
  assert.deepEqual(pregled(m), [0, 0, 0, 0, 0, 0]);
});

test("popravek žil: skrit konec (stik, konec v sosednji žili) dobi obroč iz oglišč sten, brez ravnega roba", () => {
  const a = cev(), b = cev();
  const kl = (p) => `${Math.round(p[0] / 2e-6)},${Math.round(p[1] / 2e-6)},${Math.round(p[2] / 2e-6)}`;
  const skrita = new Set(b.W.filter((p) => Math.abs(p[1]) < 1e-9).map(kl)); // konec pri y = 0
  stena({ ime: "a", m: a }, 2.5);
  stena({ ime: "b", m: b }, 2.5, { skrita });
  assert.deepEqual(pregled(b), [0, 0, 0, 0, 0, 0]);
  assert.equal(a.F.length, b.F.length);
  assert.equal(a.P.length - b.P.length, 3 * 24, "skriti obroč ne podvoji 12 + 12 oglišč");
  // na skritem koncu ni oglišča z normalo vzdolž osi (raven rob), na vidnem je
  const osne = (m, y) => { const n = m.A.get("NORMAL").d; let st = 0; for (let i = 0; i < m.P.length / 3; i++) if (Math.abs(m.P[i * 3 + 1] - y) < 1e-9 && Math.abs(n[i * 3 + 1]) > 0.9) st++; return st; };
  assert.equal(osne(b, 0), 0);
  assert.equal(osne(b, 0.08), 24);
  assert.equal(osne(a, 0), 24);
});

test("popravek žil: izpostavljen del skritega konca (ob drobni žili) ima obroč z normalo zunanje stene, tudi poševen", () => {
  const kl = (p) => `${Math.round(p[0] / 2e-6)},${Math.round(p[1] / 2e-6)},${Math.round(p[2] / 2e-6)}`;
  for (const strig of [0, 0.7]) {
    const narejena = (izp) => {
      const m = cev();
      for (let i = 0; i < m.P.length / 3; i++) m.P[i * 3 + 1] += strig * m.P[i * 3]; // poševen konec
      G.zvari(m);
      const skrita = new Set(m.W.filter((p) => Math.abs(p[1] - strig * p[0]) < 1e-9).map(kl));
      stena({ ime: "c", m }, 2.5, { skrita, izpostavljena: izp ? skrita : null });
      G.poravnajNormale(m); // drugi klic kot v popravi(): ne sme obrniti ničesar več
      assert.equal(G.poravnajNormale(m), 0);
      assert.deepEqual(pregled(m), [0, 0, 0, 0, 0, 0]);
      return m;
    };
    const a = narejena(false), b = narejena(true);
    assert.equal(b.P.length - a.P.length, 3 * 12, "12 novih oglišč obroča");
    assert.equal(a.F.length, b.F.length);
    // oglišča na notranjem polmeru z normalo navzven: samo nova oglišča obroča
    const navzven = (m) => { const n = m.A.get("NORMAL").d; let st = 0; for (let i = 0; i < m.P.length / 3; i++) { const x = m.P[i * 3], z = m.P[i * 3 + 2]; if (Math.abs(m.P[i * 3 + 1] - strig * x) < 0.004 && Math.hypot(x, z) < 0.009 && x * n[i * 3] + z * n[i * 3 + 2] > 0) st++; } return st; };
    assert.equal(navzven(a), 0);
    assert.equal(navzven(b), 12);
  }
});

test("popravek žil: svetlina v zaprti zunanji lupini se ne obrne (tudi čez dve prekrivajoči se lupini), štrleč obrnjen kos pa", () => {
  // dve zaprti polni cevi, ki se prekrivata vzdolž osi (deblo + veja), in ena svetlina skozi obe
  const zaprta = (o) => { const m = cev(o); polna({ ime: "c", m }, true); return m; };
  const zdruzi = (...ms) => {
    const P = [], N = [], C = [], F = [];
    for (const m of ms) { const o = P.length / 3; P.push(...m.P); N.push(...m.A.get("NORMAL").d); C.push(...m.A.get("COLOR_0").d); F.push(...m.F.map((i) => i + o)); }
    return mreza(P, N, C, F);
  };
  const obrni = (m) => { for (let f = 0; f < m.F.length; f += 3) [m.F[f + 1], m.F[f + 2]] = [m.F[f + 2], m.F[f + 1]]; return m; };
  const svetlina = obrni(zaprta({ r: 0.006, L: 0.11, y0: 0.005 }));
  const m = zdruzi(zaprta({ L: 0.07 }), zaprta({ L: 0.07, y0: 0.05, zasuk: 0.2 }), svetlina);
  const V0 = prostornina(m);
  assert.deepEqual(G.usmeri(m), { obrnjene: 0, navznoter: 0 });
  assert.equal(prostornina(m), V0);
  assert.equal(pregled(m)[4], 0, "pregled svetline ne šteje za obrnjeno navznoter");
  // obrnjen kos, ki štrli iz lupine (večina zunaj), se obrne navzven; pregled ga pred tem šteje
  const strli = zdruzi(zaprta({ L: 0.07 }), obrni(zaprta({ r: 0.003, L: 0.05, y0: 0.06 })));
  assert.equal(pregled(strli)[4], 1);
  assert.equal(G.usmeri(strli).navznoter, 1);
  assert.equal(pregled(strli)[4], 0);
});

test("popravek žil: stik obročev z različnim številom oglišč dobi unijo oglišč (brez T-stikov), stena obeh je zaprta", () => {
  const a = cev({ L: 0.04, n: 12 }), b = cev({ L: 0.04, y0: 0.04, n: 16, zasuk: 0.07 });
  assert.ok(stiki([{ ime: "a", m: a }, { ime: "b", m: b }]) > 0);
  const kl = (p) => p.map((c) => Math.round(c * 1e7)).join(",");
  const naStiku = (m) => new Set(G.zanke(m).flat().map((e) => m.W[e.w]).filter((p) => Math.abs(p[1] - 0.04) < 1e-4).map(kl));
  const sa = naStiku(a), sb = naStiku(b);
  assert.ok(sa.size >= 16 && sa.size === sb.size, `oglišč na stiku ${sa.size} in ${sb.size}`);
  for (const k of sb) assert.ok(sa.has(k), "oglišče stika manjka v drugem delu");
  // ponovitev ne spremeni ničesar
  assert.equal(stiki([{ ime: "a", m: a }, { ime: "b", m: b }]), 0);
  for (const m of [a, b]) {
    const r = analiziraj(Float64Array.from(m.P), Uint32Array.from(m.F));
    assert.deepEqual([r.luknje, r.nemnogoterni, r.obrnjene, r.izrojeni], [2, 0, 0, 0]);
    stena({ ime: "c", m }, 1.5);
    assert.deepEqual(pregled(m), [0, 0, 0, 0, 0, 0]);
  }
});

test("popravek žil: stik dveh delov ima v obeh delih iste trikotnike pregrade, nasprotno navite (pregledovalnik jo odstrani)", () => {
  const a = cev({ L: 0.04 }), b = cev({ L: 0.04, y0: 0.04 });
  const deli = [{ ime: "a", m: a }, { ime: "b", m: b }];
  stiki(deli);
  const kl = (p) => `${Math.round(p[0] / 2e-6)},${Math.round(p[1] / 2e-6)},${Math.round(p[2] / 2e-6)}`;
  const skrita = new Set(a.W.filter((p) => Math.abs(p[1] - 0.04) < 1e-9).map(kl));
  stena(deli[0], 2.5, { skrita });
  stena(deli[1], 2.5, { skrita });
  // trikotniki pregrade: vsa tri oglišča v ravnini stika y = 0,04
  const pregrada = (m) => {
    const out = [];
    for (let f = 0; f < m.F.length; f += 3) {
      const p = [0, 1, 2].map((k) => G.pol(m, m.F[f + k]));
      if (!p.every((q) => Math.abs(q[1] - 0.04) < 1e-9)) continue;
      const k = p.map(kl);
      const i = k.indexOf([...k].sort()[0]);
      out.push([k[i], k[(i + 1) % 3], k[(i + 2) % 3]]);
    }
    return out;
  };
  const pa = pregrada(a), pb = pregrada(b);
  assert.equal(pa.length, 24);
  assert.equal(pb.length, 24);
  const vB = new Set(pb.map((k) => k.join("|")));
  for (const k of pa) assert.ok(vB.has([k[0], k[2], k[1]].join("|")), "trikotnik pregrade nima nasprotno navitega dvojnika v sosednjem delu");
});

test("popravek žil: razcepišče (trije deli v istem obroču) dobi v vseh delih isto normalo", () => {
  // glavna cev do y = 0,04, veji se začneta v njenem končnem obroču in gresta poševno narazen
  const veja = (dx) => {
    const m = cev({ L: 0.04, y0: 0.04 });
    for (let i = 0; i < m.P.length / 3; i++) m.P[i * 3] += dx * (m.P[i * 3 + 1] - 0.04);
    return G.zvari(m);
  };
  const deli = [{ ime: "glavna", m: cev({ L: 0.04 }) }, { ime: "leva", m: veja(-0.6) }, { ime: "desna", m: veja(0.6) }];
  stiki(deli);
  const kl = (p) => `${Math.round(p[0] / 2e-6)},${Math.round(p[1] / 2e-6)},${Math.round(p[2] / 2e-6)}`;
  const normale = deli.map(({ m }) => {
    const n = m.A.get("NORMAL").d, o = new Map();
    for (let i = 0; i < m.P.length / 3; i++) if (Math.abs(m.P[i * 3 + 1] - 0.04) < 1e-9) o.set(kl(G.pol(m, i)), [n[i * 3], n[i * 3 + 1], n[i * 3 + 2]]);
    return o;
  });
  assert.equal(normale[0].size, 12);
  for (const [k, n] of normale[0]) for (const o of normale.slice(1)) {
    assert.ok(o.has(k), "oglišče obroča manjka v veji");
    assert.ok(G.v3.dist(n, o.get(k)) < 1e-9, `normala na razcepišču se razlikuje: ${n} ≠ ${o.get(k)}`);
  }
});

test("popravek žil: pokrov drobne žile ima oglišče v sredini z normalo v smeri osi; reža med skoraj enakima ogliščema se zašije", () => {
  const m = cev({ r: 0.001, L: 0.02, korak: 0.002, n: 6 });
  polna({ ime: "cevka", m }, "kupola");
  assert.deepEqual(pregled(m), [0, 0, 0, 0, 0, 0]);
  const n = m.A.get("NORMAL").d;
  // rob pokrova ima svoja oglišča z normalo med steno in osjo (6 na vsakem koncu)
  let nagnjenih = 0;
  for (let i = 0; i < m.P.length / 3; i++) if (Math.hypot(m.P[i * 3], m.P[i * 3 + 2]) > 1e-4 && Math.abs(n[i * 3 + 1]) > 0.7) nagnjenih++;
  assert.equal(nagnjenih, 12);
  const sredini = [];
  for (let i = 0; i < m.P.length / 3; i++) if (Math.hypot(m.P[i * 3], m.P[i * 3 + 2]) < 1e-9) sredini.push([m.P[i * 3 + 1], n[i * 3 + 1]]);
  assert.equal(sredini.length, 2);
  for (const [y, ny] of sredini) assert.ok(y < 0.01 ? y < 0 && ny < -0.99 : y > 0.02 && ny > 0.99, `pokrov ni izbočen z osno normalo (y ${y}, n ${ny})`);
  // reža: oglišče sredi zaprte cevke podvojimo in kopijo premaknemo za 2 µm (štirje odprti robovi, ki niso zanka v eni smeri)
  const r = cev({ r: 0.001, L: 0.02, korak: 0.002, n: 6 });
  polna({ ime: "r", m: r }, "kupola");
  const i0 = 5 * 6 + 2;
  const kopija = G.dodajOglisce(r, [r.P[i0 * 3] + 2e-6, r.P[i0 * 3 + 1], r.P[i0 * 3 + 2]], [[i0, 1]]);
  let st = 0;
  for (let f = 0; f < r.F.length; f += 3) for (let k = 0; k < 3; k++) if (r.F[f + k] === i0 && st++ % 2 === 0) r.F[f + k] = kopija;
  G.zvari(r);
  assert.ok(pregled(r)[0] > 0, "poskusna reža ni nastala");
  assert.ok(zasijRobove(r) >= 1);
  assert.equal(pregled(r)[0], 0);
});

test("popravek žil: konec drobne žile, ki tiči v drugi žili, ostane raven; prosti konec dobi kupolo", () => {
  const debela = cev({ r: 0.004, L: 0.02, korak: 0.002, n: 8 });
  polna({ ime: "debela", m: debela }, true);
  for (let i = 0; i < debela.P.length / 3; i++) debela.P[i * 3 + 1] += 0.015; // debela žila: y od 0,015 do 0,035
  const mreze = [{ m: debela, mn: [-0.004, 0.015, -0.004], mx: [0.004, 0.035, 0.004] }];
  assert.equal(vDrugiMrezi([0, 0.02, 0], mreze), true);
  assert.equal(vDrugiMrezi([0, 0.01, 0], mreze), false);
  assert.equal(vDrugiMrezi([0.006, 0.02, 0], mreze), false);
  const m = cev({ r: 0.001, L: 0.02, korak: 0.002, n: 6 }); // tanka: y od 0 do 0,02, zgornji konec v debeli
  const r = polna({ ime: "tanka", m }, "kupola", (c, ven, rr) => !vDrugiMrezi(G.v3.add(c, G.v3.mul(ven, 0.3 * rr)), mreze));
  assert.equal(r.koncev, 2);
  assert.equal(r.ravnih, 1);
  assert.deepEqual(pregled(m), [0, 0, 0, 0, 0, 0]);
  let najY = -Infinity, najmanjY = Infinity;
  for (let i = 0; i < m.P.length / 3; i++) { najY = Math.max(najY, m.P[i * 3 + 1]); najmanjY = Math.min(najmanjY, m.P[i * 3 + 1]); }
  assert.ok(Math.abs(najY - 0.02) < 1e-9, `konec v drugi žili ne sme segati čez obroč (${najY})`);
  assert.ok(najmanjY < -1e-4, "prosti konec ni izbočen");
});

test("popravek žil: konec ob stopnici, delno potopljen konec in konec tik ob sosedi ostanejo ravni; res prost konec dobi kupolo", () => {
  // debela žila (r 4 mm, zaprta) vzdolž y, premaknjena za dx; tanka (r 1 mm) od y = 0 do 0,02 na osi x = 0
  const soseda = (dx, y0, L = 0.02) => {
    const m = cev({ r: 0.004, L, korak: 0.002, n: 8, y0 });
    polna({ ime: "debela", m }, true);
    for (let i = 0; i < m.P.length / 3; i++) m.P[i * 3] += dx;
    G.zvari(m);
    return [{ m, mn: [dx - 0.004, y0, -0.004], mx: [dx + 0.004, y0 + L, 0.004] }];
  };
  const naOsi = (mreze) => (c, ven, r) => !vDrugiMrezi(G.v3.add(c, G.v3.mul(ven, 0.3 * r)), mreze) && !vDrugiMrezi(G.v3.add(c, G.v3.mul(ven, 0.05 * r)), mreze);
  const primer = (mreze, prost = (c, ven, r, obroc) => konecProst(c, ven, r, obroc, mreze)) => {
    const m = cev({ r: 0.001, L: 0.02, korak: 0.002, n: 6 });
    const r = polna({ ime: "tanka", m }, "kupola", prost);
    assert.deepEqual(pregled(m), [0, 0, 0, 0, 0, 0]);
    let najY = -Infinity, najmanjY = Infinity;
    for (let i = 0; i < m.P.length / 3; i++) { najY = Math.max(najY, m.P[i * 3 + 1]); najmanjY = Math.min(najmanjY, m.P[i * 3 + 1]); }
    assert.ok(najmanjY < -1e-4, "spodnji, prosti konec ni izbočen");
    return { ravnih: r.ravnih, zgorajRaven: Math.abs(najY - 0.02) < 1e-9, konci: r.konci };
  };
  // 1. stopnica: debela se začne v ravnini konca tanke, os tanke je zunaj nje, rob pa sega vanjo
  const stopnica = soseda(0.0045, 0.02);
  assert.deepEqual(primer(stopnica, naOsi(stopnica)).ravnih, 0, "preskus samo na osi bi moral ta konec šteti za prost (sicer primer ne preverja ničesar)");
  let r = primer(stopnica);
  assert.equal(r.ravnih, 1);
  assert.ok(r.zgorajRaven, "konec ob stopnici ne sme dobiti kupole");
  assert.deepEqual(r.konci.map((k) => k.raven).sort(), [false, true]);
  // 2. delno potopljen konec: tanka teče ob steni debele in je z eno stranjo v njej
  const potopljen = soseda(0.0043, 0.01);
  assert.equal(primer(potopljen, naOsi(potopljen)).ravnih, 0);
  r = primer(potopljen);
  assert.equal(r.ravnih, 1);
  assert.ok(r.zgorajRaven, "delno potopljen konec ne sme dobiti kupole");
  // 3. dotik: noben vzorec ni v sosedi, rob konca pa je 0,05 r od njene stene
  const dotik = soseda(0.00505, 0.01);
  assert.equal(primer(dotik, naOsi(dotik)).ravnih, 0);
  r = primer(dotik);
  assert.equal(r.ravnih, 1);
  assert.ok(r.zgorajRaven, "konec tik ob sosedi ne sme dobiti kupole");
  // 4. res prost konec: soseda je 3 polmere stran
  r = primer(soseda(0.008, 0.01));
  assert.equal(r.ravnih, 0);
  assert.ok(!r.zgorajRaven, "prosti konec ni izbočen");
  // 5. tanka igla skozi ploskev kupole med vzorci (noben vzorec ni v njej ali blizu nje): odloči presek trikotnikov
  const igla = cev({ r: 0.00002, L: 0.002, korak: 0.001, n: 6, y0: 0.0195 });
  polna({ ime: "igla", m: igla }, true);
  const q = [0.001 * (1 + Math.cos(Math.PI / 3)) / 2 * 0.75, 0, 0.001 * Math.sin(Math.PI / 3) / 2 * 0.75]; // na ploskvi kupole, četrt poti od roba k vrhu
  for (let i = 0; i < igla.P.length / 3; i++) { igla.P[i * 3] += q[0]; igla.P[i * 3 + 2] += q[2]; }
  G.zvari(igla);
  r = primer([{ m: igla, mn: [q[0] - 0.00002, 0.0195, q[2] - 0.00002], mx: [q[0] + 0.00002, 0.0215, q[2] + 0.00002] }]);
  assert.equal(r.ravnih, 1);
  assert.ok(r.zgorajRaven, "kupola, ki jo prebada soseda, ne sme ostati");
  // 6. konec v celoti v sosedi (kot doslej)
  r = primer(soseda(0, 0.015));
  assert.equal(r.ravnih, 1);
  assert.ok(r.zgorajRaven);
});
