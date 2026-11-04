// Znanstvene preverbe modela »Molekule v 3D«: oblike VSEPR, vezni koti, dolžine in redi vezi, Lewisove strukture,
// molske mase, stereokemija glukoze ter proračun pri vsaki molekuli in vsakem prikazu.
import { test } from "node:test";
import assert from "node:assert/strict";
import { naloziThree, prestej, MEJE } from "./fixtures/3d-modeli.js";
import { MOLEKULE, ELEMENTI, OBLIKE, lewis, molskaMasa, kot, sosedi, skupineKotov, zgradi } from "../public/3d/modeli/kemija/molekule.js";

const THREE = await naloziThree();
const po = Object.fromEntries(MOLEKULE.map((m) => [m.id, m]));
const razd = (m, i, j) => Math.hypot(m.a[i][1] - m.a[j][1], m.a[i][2] - m.a[j][2], m.a[i][3] - m.a[j][3]);
const kotiOkoli = (m, c = m.c) => { const s = sosedi(m, c), k = []; for (let x = 0; x < s.length; x++) for (let y = x + 1; y < s.length; y++) k.push(kot(m, s[x], c, s[y])); return k; };

// pričakovana oblika (iz učbenikov, neodvisno od podatkov v modelu)
const OBLIKA = {
  "ogljikov-dioksid": "AX2E0", "berilijev-klorid": "AX2E0", "vodikov-cianid": "AX2E0", "ksenonov-difluorid": "AX2E3",
  "borov-trifluorid": "AX3E0", "zveplov-trioksid": "AX3E0", "karbonatni-ion": "AX3E0", "nitratni-ion": "AX3E0", metanal: "AX3E0",
  voda: "AX2E2", "vodikov-sulfid": "AX2E2", "zveplov-dioksid": "AX2E1", ozon: "AX2E1",
  metan: "AX4E0", tetraklorometan: "AX4E0", "amonijev-ion": "AX4E0", "sulfatni-ion": "AX4E0",
  amonijak: "AX3E1", "oksonijev-ion": "AX3E1", "fosforjev-triklorid": "AX3E1",
  "fosforjev-pentaklorid": "AX5E0", "zveplov-tetrafluorid": "AX4E1", "klorov-trifluorid": "AX3E2", "zveplov-heksafluorid": "AX6E0",
  "bromov-pentafluorid": "AX5E1", "ksenonov-tetrafluorid": "AX4E2",
  vodik: "AX1E0", kisik: "AX1E2", dusik: "AX1E1", klor: "AX1E3", "vodikov-klorid": "AX1E3",
  etan: "AX4E0", eten: "AX3E0", etin: "AX2E0", benzen: "AX3E0", metanol: "AX2E2", etanol: "AX4E0", "etanojska-kislina": "AX3E0",
  propanon: "AX3E0", cikloheksan: "AX4E0", glukoza: "AX2E2", secnina: "AX3E0", glicin: "AX3E1", "vodikov-peroksid": "AX2E2",
};
const IME_OBLIKE = {
  AX2E0: "linearna", AX2E3: "linearna", AX3E0: "trikotna ravninska", AX2E1: "kotna", AX2E2: "kotna", AX4E0: "tetraedrična",
  AX3E1: "trikotna piramidalna", AX5E0: "trikotna bipiramidalna", AX4E1: "gugalnica", AX3E2: "oblika črke T",
  AX6E0: "oktaedrična", AX5E1: "kvadratna piramidalna", AX4E2: "kvadratna ravninska",
};

// molske mase v g/mol (IUPAC: H 1,008; C 12,011; N 14,007; O 15,999; F 18,998; S 32,06; Cl 35,45 …)
const MASA = {
  vodik: 2.016, kisik: 31.998, dusik: 28.014, klor: 70.9, "vodikov-klorid": 36.458, "ogljikov-dioksid": 44.009,
  "berilijev-klorid": 79.912, "vodikov-cianid": 27.026, "ksenonov-difluorid": 169.286, "borov-trifluorid": 67.804,
  "zveplov-trioksid": 80.057, "karbonatni-ion": 60.008, "nitratni-ion": 62.004, metanal: 30.026, voda: 18.015,
  "vodikov-sulfid": 34.076, "zveplov-dioksid": 64.058, ozon: 47.997, metan: 16.043, tetraklorometan: 153.811,
  "amonijev-ion": 18.039, "sulfatni-ion": 96.056, amonijak: 17.031, "oksonijev-ion": 19.023, "fosforjev-triklorid": 137.324,
  "fosforjev-pentaklorid": 208.224, "zveplov-tetrafluorid": 108.052, "klorov-trifluorid": 92.444, "zveplov-heksafluorid": 146.048,
  "bromov-pentafluorid": 174.894, "ksenonov-tetrafluorid": 207.282, etan: 30.07, eten: 28.054, etin: 26.038, benzen: 78.114,
  "vodikov-peroksid": 34.014, secnina: 60.056, metanol: 32.042, etanol: 46.069, "etanojska-kislina": 60.052, propanon: 58.08,
  cikloheksan: 84.162, glukoza: 180.156, glicin: 75.067,
};

// število vezi (povezav med atomi) in posebni redi vezi
const VEZI = { benzen: 12, glukoza: 24, cikloheksan: 18, etan: 7, eten: 5, etin: 3, etanol: 8, "etanojska-kislina": 7, propanon: 9, glicin: 9, secnina: 7, metanol: 5, "vodikov-peroksid": 3, "zveplov-heksafluorid": 6, "fosforjev-pentaklorid": 5 };
const RED = [["dusik", 0, 1, 3], ["kisik", 0, 1, 2], ["vodik", 0, 1, 1], ["vodikov-cianid", 0, 2, 3], ["ogljikov-dioksid", 0, 1, 2], ["ogljikov-dioksid", 0, 2, 2]];

// izmerjeni koti pri osrednjem atomu (poskusne vrednosti; za PubChem konformerje širša toleranca)
const KOTI = {
  voda: [[104.5, 1]], amonijak: [[106.7, 1]], metan: [[109.47, 0.5]], tetraklorometan: [[109.47, 0.5]], "amonijev-ion": [[109.47, 0.5]],
  "sulfatni-ion": [[109.47, 0.5]], "borov-trifluorid": [[120, 0.5]], "zveplov-trioksid": [[120, 0.5]], "karbonatni-ion": [[120, 0.5]],
  "nitratni-ion": [[120, 0.5]], "ogljikov-dioksid": [[180, 0.1]], "berilijev-klorid": [[180, 0.1]], "vodikov-cianid": [[180, 0.1]],
  "ksenonov-difluorid": [[180, 0.1]], "zveplov-heksafluorid": [[90, 0.1], [180, 0.1]], "fosforjev-pentaklorid": [[90, 0.1], [120, 0.1], [180, 0.1]],
  "ksenonov-tetrafluorid": [[90, 0.1], [180, 0.1]], "vodikov-sulfid": [[92.1, 1]], "zveplov-dioksid": [[119.3, 1]], ozon: [[116.8, 1]],
  "oksonijev-ion": [[111.3, 1.5]], "fosforjev-triklorid": [[100.1, 1]], "zveplov-tetrafluorid": [[101.6, 1], [173.1, 1], [87.8, 1]],
  "klorov-trifluorid": [[87.5, 1], [175, 1]], "bromov-pentafluorid": [[84.8, 1], [89.5, 1], [169.6, 1]], metanal: [[116.2, 1], [121.9, 1]],
  etan: [[111.2, 1], [107.7, 1]], eten: [[117.4, 1], [121.3, 1]], etin: [[180, 0.1]], benzen: [[120, 0.1]], "vodikov-peroksid": [[94.8, 1]],
  secnina: [[116.8, 1], [121.6, 1]], metanol: [[108.5, 2]], etanol: [[109.5, 3]], "etanojska-kislina": [[111, 2], [123, 2.5], [126, 2]],
  propanon: [[116.5, 2], [121.7, 2]], cikloheksan: [[111.4, 1], [109.5, 1.5], [107, 1.5]], glukoza: [[112.5, 2]], glicin: [[107.5, 3]],
};

// izmerjene dolžine vezi v pm: [molekula, element 1, element 2, pričakovano]
const DOLZINE = [
  ["voda", "O", "H", 95.8], ["amonijak", "N", "H", 101.2], ["metan", "C", "H", 108.7], ["ogljikov-dioksid", "C", "O", 116.2],
  ["vodik", "H", "H", 74.1], ["dusik", "N", "N", 109.8], ["kisik", "O", "O", 120.8], ["klor", "Cl", "Cl", 198.8], ["vodikov-klorid", "H", "Cl", 127.5],
  ["zveplov-heksafluorid", "S", "F", 156.1], ["borov-trifluorid", "B", "F", 130.7], ["eten", "C", "C", 133.9], ["etin", "C", "C", 120.3],
  ["etan", "C", "C", 153.5], ["benzen", "C", "C", 139.7], ["ksenonov-tetrafluorid", "Xe", "F", 195.3],
];
const KOVALENTNI = { H: 31, Be: 96, B: 84, C: 76, N: 71, O: 66, F: 57, P: 107, S: 105, Cl: 102, Br: 120, Xe: 140 };

function sestava(f) { // "CO(NH₂)₂", "SO₄²⁻" → { C:1, O:1, N:2, H:4 }
  const s = f.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+$/, "").replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080));
  let k = 0;
  function skupina() {
    const r = {};
    while (k < s.length && s[k] !== ")") {
      let del;
      if (s[k] === "(") { k++; del = skupina(); k++; } else { const m = s.slice(k).match(/^[A-Z][a-z]?/); k += m[0].length; del = { [m[0]]: 1 }; }
      const n = s.slice(k).match(/^\d+/); const x = n ? +n[0] : 1; if (n) k += n[0].length;
      for (const [e, c] of Object.entries(del)) r[e] = (r[e] || 0) + c * x;
    }
    return r;
  }
  return skupina();
}

test("molekule: seznam, imena, formule in naboji", () => {
  assert.ok(MOLEKULE.length >= 40, `${MOLEKULE.length} molekul`);
  assert.equal(new Set(MOLEKULE.map((m) => m.id)).size, MOLEKULE.length);
  assert.ok(po.voda);
  for (const id of Object.keys(OBLIKA)) assert.ok(po[id], `manjka ${id}`);
  for (const m of MOLEKULE) {
    for (const x of m.a) assert.ok(ELEMENTI[x[0]], `${m.id}: ${x[0]}`);
    const st = {}; for (const x of m.a) st[x[0]] = (st[x[0]] || 0) + 1;
    assert.deepEqual(sestava(m.f), st, `${m.id}: formula ${m.f}`);
    const naboj = (m.f.match(/([²³]?)([⁺⁻])$/) || []);
    const q = naboj.length ? (naboj[1] === "²" ? 2 : naboj[1] === "³" ? 3 : 1) * (naboj[2] === "⁺" ? 1 : -1) : 0;
    assert.equal(m.q || 0, q, `${m.id}: naboj`);
    assert.equal(m.pol === null, !!m.q, `${m.id}: polarnost samo za nevtralne molekule`);
    for (const b of m.b) assert.ok(b[0] !== b[1] && m.a[b[0]] && m.a[b[1]] && [1, 2, 3].includes(b[2]), `${m.id}: vez ${b}`);
  }
});

test("molekule: Lewisove strukture, oktet in VSEPR oznaka", () => {
  for (const m of MOLEKULE) {
    const L = lewis(m);
    assert.equal(L.fc.reduce((a, b) => a + b, 0), m.q || 0, `${m.id}: vsota formalnih nabojev`);
    L.pari.forEach((p, i) => assert.ok(Number.isInteger(p) && p >= 0, `${m.id}: atom ${i} ima ${p} parov`));
    const vezni = m.b.reduce((s, b) => s + b[2], 0);
    assert.equal(2 * (vezni + L.pari.reduce((a, b) => a + b, 0)), L.valencni, `${m.id}: število elektronov`);
    m.a.forEach((x, i) => {
      const e = x[0], o = L.okoli[i];
      if (e === "H") assert.equal(o, 2, `${m.id}: H ima ${o} e⁻`);
      else if (["C", "N", "O", "F"].includes(e)) assert.equal(o, 8, `${m.id}: ${e}${i} ima ${o} e⁻`);
      else if (e === "B") assert.equal(o, 6, `${m.id}: B`);
      else if (e === "Be") assert.equal(o, 4, `${m.id}: Be`);
      else assert.ok(o >= 8, `${m.id}: ${e} ima ${o} e⁻`);
    });
    const X = sosedi(m, m.c).length, E = L.pari[m.c];
    assert.equal(`AX${X}E${E}`, m.vsepr, `${m.id}: VSEPR iz Lewisove strukture`);
    assert.equal(m.vsepr, OBLIKA[m.id], `${m.id}: pričakovana oblika`);
    assert.ok(OBLIKE[m.vsepr], `${m.id}: oblika v tabeli`);
    if (IME_OBLIKE[m.vsepr]) assert.equal(OBLIKE[m.vsepr].ime, IME_OBLIKE[m.vsepr]);
  }
  // pokrite vse srednješolske oblike
  for (const v of Object.keys(IME_OBLIKE)) assert.ok(MOLEKULE.some((m) => m.vsepr === v), `ni molekule z obliko ${v}`);
});

test("molekule: vezni koti pri osrednjem atomu", () => {
  for (const m of MOLEKULE) {
    const k = kotiOkoli(m);
    if (sosedi(m, m.c).length < 2) { assert.equal(m.a.length, 2, `${m.id}: osrednji atom brez kota`); continue; }
    const pric = KOTI[m.id];
    assert.ok(pric, `${m.id}: ni pričakovanih kotov`);
    for (const g of skupineKotov(m)) assert.ok(pric.some(([a, t]) => Math.abs(g.kot - a) <= t), `${m.id}: kot ${g.kot.toFixed(2)}° ni med ${pric.map((p) => p[0])}`);
    for (const [a, t] of pric) assert.ok(k.some((x) => Math.abs(x - a) <= t), `${m.id}: manjka kot ${a}° (${k.map((x) => x.toFixed(1))})`);
  }
  // ravninske molekule in ioni: vsi atomi v eni ravnini
  for (const id of ["ksenonov-tetrafluorid", "borov-trifluorid", "karbonatni-ion", "nitratni-ion", "zveplov-trioksid", "benzen", "eten", "metanal", "secnina", "klorov-trifluorid"]) {
    const m = po[id], P = m.a.map((x) => x.slice(1)), s = (a, b) => a.map((t, k) => t - b[k]);
    const u = s(P[1], P[0]), w = P.slice(2).map((q) => s(q, P[0])).find((q) => Math.hypot(...[u[1] * q[2] - u[2] * q[1], u[2] * q[0] - u[0] * q[2], u[0] * q[1] - u[1] * q[0]]) > 100);
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]], d = Math.hypot(...n);
    for (const q of P) assert.ok(Math.abs(s(q, P[0]).reduce((t, x, k) => t + (x * n[k]) / d, 0)) < 0.5, `${id}: ni ravninska`);
  }
  // trikotna piramida: osrednji atom izven ravnine treh sosedov
  for (const id of ["amonijak", "oksonijev-ion", "fosforjev-triklorid"]) {
    const m = po[id], k = kotiOkoli(m);
    assert.ok(k.reduce((a, b) => a + b, 0) < 350, `${id}: vsota kotov ${k.reduce((a, b) => a + b, 0)} (pri ravninski bi bila 360°)`);
  }
});

test("molekule: dolžine in redi vezi, brez prekrivanja nevezanih atomov", () => {
  for (const [id, e1, e2, d] of DOLZINE) {
    const m = po[id], b = m.b.find(([i, j]) => [m.a[i][0], m.a[j][0]].sort().join() === [e1, e2].sort().join());
    assert.ok(b, `${id}: ni vezi ${e1}–${e2}`);
    assert.ok(Math.abs(razd(m, b[0], b[1]) - d) < 0.15, `${id}: ${e1}–${e2} = ${razd(m, b[0], b[1]).toFixed(2)} pm, pričakovano ${d}`);
  }
  for (const [id, n] of Object.entries(VEZI)) assert.equal(po[id].b.length, n, `${id}: število vezi`);
  for (const [id, i, j, r] of RED) assert.equal(po[id].b.find((b) => (b[0] === i && b[1] === j) || (b[0] === j && b[1] === i))[2], r, `${id}: red vezi`);
  const ax = po["zveplov-tetrafluorid"], dax = [1, 2].map((i) => razd(ax, 0, i)), deq = [3, 4].map((i) => razd(ax, 0, i));
  assert.ok(Math.abs(dax[0] - 164.6) < 0.1 && Math.abs(deq[0] - 154.5) < 0.1, "SF₄: osne vezi daljše od ekvatorialnih");
  const p5 = po["fosforjev-pentaklorid"];
  assert.ok(Math.abs(razd(p5, 0, 1) - 212.7) < 0.1 && Math.abs(razd(p5, 0, 3) - 202.3) < 0.1, "PCl₅: osne in ekvatorialne vezi");
  for (const m of MOLEKULE) {
    const vez = new Set(m.b.map(([i, j]) => `${Math.min(i, j)}-${Math.max(i, j)}`));
    for (let i = 0; i < m.a.length; i++) for (let j = i + 1; j < m.a.length; j++) {
      const d = razd(m, i, j), rc = KOVALENTNI[m.a[i][0]] + KOVALENTNI[m.a[j][0]];
      const red = (m.b.find((b) => (b[0] === i && b[1] === j) || (b[0] === j && b[1] === i)) || [])[2] || 1;
      if (vez.has(`${i}-${j}`)) assert.ok(d > rc - 25 - 22 * (red - 1) && d < rc + 25, `${m.id}: vez ${m.a[i][0]}${i}–${m.a[j][0]}${j} = ${d.toFixed(1)} pm`);
      else assert.ok(d > 1.25 * rc, `${m.id}: nevezana atoma ${i}, ${j} preblizu (${d.toFixed(1)} pm)`);
    }
  }
});

test("molekule: molske mase", () => {
  for (const m of MOLEKULE) {
    assert.ok(MASA[m.id] !== undefined, `${m.id}: ni pričakovane mase`);
    assert.ok(Math.abs(molskaMasa(m) - MASA[m.id]) < 0.002, `${m.id}: M = ${molskaMasa(m)} ≠ ${MASA[m.id]}`);
  }
});

test("molekule: polarnost", () => {
  const nepolarne = ["vodik", "kisik", "dusik", "klor", "ogljikov-dioksid", "berilijev-klorid", "ksenonov-difluorid", "borov-trifluorid", "zveplov-trioksid", "metan", "tetraklorometan", "fosforjev-pentaklorid", "zveplov-heksafluorid", "ksenonov-tetrafluorid", "etan", "eten", "etin", "benzen", "cikloheksan"];
  for (const m of MOLEKULE) if (m.pol !== null) assert.equal(m.pol, !nepolarne.includes(m.id), `${m.id}: polarnost`);
});

function torzija(m, i, j, k, l) {
  const P = (x) => m.a[x].slice(1), s = (a, b) => a.map((t, n) => t - b[n]);
  const kr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], pk = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const b1 = s(P(j), P(i)), b2 = s(P(k), P(j)), b3 = s(P(l), P(k)), n1 = kr(b1, b2), n2 = kr(b2, b3), d = Math.hypot(...b2);
  return (Math.atan2(pk(kr(n1, b2.map((x) => x / d)), n2), pk(n1, n2)) * 180) / Math.PI;
}
function obroc(m, zacetek) { // šestčlenski obroč skozi atom `zacetek` (iskanje v globino)
  const pot = [zacetek];
  function isci() {
    if (pot.length === 6) return sosedi(m, pot[5]).includes(zacetek);
    for (const x of sosedi(m, pot[pot.length - 1])) {
      if (m.a[x][0] === "H" || pot.includes(x)) continue;
      pot.push(x); if (isci()) return true; pot.pop();
    }
    return false;
  }
  assert.ok(isci(), "ni šestčlenskega obroča");
  return pot;
}

test("molekule: stolasta oblika cikloheksana in β-D-glukopiranoze", () => {
  for (const [id, z] of [["cikloheksan", 0], ["glukoza", po.glukoza.c]]) {
    const m = po[id], r = obroc(m, z);
    const t = r.map((_, k) => torzija(m, r[k], r[(k + 1) % 6], r[(k + 2) % 6], r[(k + 3) % 6]));
    t.forEach((x, k) => { assert.ok(Math.abs(x) > 45 && Math.abs(x) < 70, `${id}: torzija ${x.toFixed(1)}°`); assert.ok(Math.sign(x) !== Math.sign(t[(k + 1) % 6]), `${id}: torzije izmenjujejo predznak`); });
  }
  // kiralnost: C1 in C5 sta R (β-D-glukopiranoza); R ⇔ det(a, b, c) < 0 za prednostne substituente a > b > c
  const m = po.glukoza, O5 = m.c, s = (i) => sosedi(m, i);
  const C1 = s(O5).find((i) => s(i).filter((j) => m.a[j][0] === "O").length === 2), C5 = s(O5).find((i) => i !== C1);
  const v = (i, c) => [m.a[i][1] - m.a[c][1], m.a[i][2] - m.a[c][2], m.a[i][3] - m.a[c][3]];
  const det = (a, b, c) => a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);
  const O1 = s(C1).find((j) => m.a[j][0] === "O" && j !== O5), C2 = s(C1).find((j) => m.a[j][0] === "C");
  assert.ok(det(v(O5, C1), v(O1, C1), v(C2, C1)) < 0, "glukoza: C1 ni R (β)");
  const C6 = s(C5).find((j) => m.a[j][0] === "C" && s(j).filter((k) => m.a[k][0] === "H").length === 2), C4 = s(C5).find((j) => m.a[j][0] === "C" && j !== C6);
  assert.ok(det(v(O5, C5), v(C4, C5), v(C6, C5)) < 0, "glukoza: C5 ni R (D-sladkor)");
});

/** Največja oddaljenost vidnega oglišča (tudi instanc) od izhodišča. */
function najdlje(group) {
  let r = 0;
  const v = new THREE.Vector3(), M = new THREE.Matrix4(), I = new THREE.Matrix4();
  group.updateMatrixWorld(true);
  group.traverse((o) => {
    for (let x = o; x; x = x.parent) if (!x.visible) return;
    const p = o.isMesh && o.geometry.attributes.position;
    if (!p) return;
    for (let k = 0; k < (o.isInstancedMesh ? o.count : 1); k++) {
      if (o.isInstancedMesh) { o.getMatrixAt(k, I); M.multiplyMatrices(o.matrixWorld, I); } else M.copy(o.matrixWorld);
      for (let i = 0; i < p.count; i++) r = Math.max(r, v.fromBufferAttribute(p, i).applyMatrix4(M).length());
    }
  });
  return r;
}

test("molekule: vsaka molekula v vsakem prikazu (proračun, deli, velikost)", { skip: !THREE && "three ni nameščen" }, () => {
  for (const kakovost of ["visoka", "nizka"]) {
    const mod = zgradi(THREE, { kakovost, gibanje: true });
    const n = (id) => mod.nadzor.find((x) => x.id === id);
    let najTri = 0;
    for (const mol of MOLEKULE) {
      n("molekula").ob(mol.id);
      for (const prikaz of ["kroglice", "kalota", "palcke"]) {
        n("prikaz").ob(prikaz);
        for (const vse of [true, false]) {
          n("pari").ob(vse); n("koti").ob(vse); n("vodik").ob(!vse);
          const tag = `${mol.id}/${prikaz}/${vse}/${kakovost}`;
          const { tri, klici } = prestej(mod.group);
          najTri = Math.max(najTri, tri);
          assert.ok(tri <= MEJE[kakovost].tri && klici <= MEJE[kakovost].klici, `${tag}: ${tri} trikotnikov, ${klici} klicev`);
          assert.ok(mod.deli.length > 0 && mod.deli.every((d) => d.meshes.length && Math.hypot(...d.tocka) < 1.6 && d.opis.length > 10), `${tag}: deli`);
          assert.equal(new Set(mod.deli.map((d) => d.id)).size, mod.deli.length, `${tag}: id-ji delov`);
          const s = new THREE.Box3().setFromObject(mod.group, true).getBoundingSphere(new THREE.Sphere());
          assert.ok(s.radius < 1.6 && s.radius > 0.3 && s.center.length() < 0.5, `${tag}: polmer ${s.radius.toFixed(2)}`);
          assert.ok(najdlje(mod.group) <= 1, `${tag}: oglišče ${najdlje(mod.group).toFixed(3)} od središča (okvir ima polmer 1)`);
          assert.ok(mod.merilo.m > 0 && /^\d+(,\d+)? nm$/.test(mod.merilo.oznaka), `${tag}: merilo`);
          for (const x of mod.nadzor) if (x.tip === "izpis") assert.ok(x.vrednost().length > 3, `${tag}: izpis ${x.id}`);
        }
      }
    }
    mod.dispose();
  }
});

test("molekule: izpisi z decimalno vejico", { skip: !THREE && "three ni nameščen" }, () => {
  const mod = zgradi(THREE, { kakovost: "nizka", gibanje: false });
  const iz = (id) => mod.nadzor.find((x) => x.id === id).vrednost();
  assert.equal(iz("formula"), "H₂O, M = 18,02 g/mol");
  assert.equal(iz("oblika"), "AX₂E₂ – kotna");
  for (const [id, pric] of [["glukoza", "C: AX₄ tetraedrična (109,5°) · O: AX₂E₂ kotna"], ["etan", "C: AX₄ tetraedrična (109,5°)"],
    ["glicin", "C: AX₄ tetraedrična (109,5°), AX₃ trikotna ravninska (120°) · N: AX₃E trikotna piramidalna · O: AX₂E₂ kotna"]]) {
    mod.nadzor.find((x) => x.id === "molekula").ob(id);
    assert.equal(iz("oblika"), pric, id);
  }
  assert.equal(mod.nadzor.find((x) => x.id === "molekula").moznosti.find((x) => x[0] === "voda")[1], "Voda – H₂O");
  const vodik = mod.nadzor.find((x) => x.id === "vodik");
  assert.equal(vodik.vidno(), true, "glicin: stikalo za vodik vidno");
  for (const id of ["voda", "zveplov-heksafluorid", "metan"]) { mod.nadzor.find((x) => x.id === "molekula").ob(id); assert.equal(vodik.vidno(), false, id); }
  mod.nadzor.find((x) => x.id === "molekula").ob("voda");
  assert.equal(iz("kot"), "idealno 109,5° · izmerjeno 104,5°");
  assert.match(iz("polarnost"), /^polarna/);
  mod.nadzor.find((x) => x.id === "molekula").ob("zveplov-heksafluorid");
  assert.equal(iz("oblika"), "AX₆ – oktaedrična");
  assert.equal(iz("kot"), "idealno 90°, 180° · izmerjeno 90°, 180°");
  assert.match(iz("polarnost"), /^nepolarna/);
  mod.nadzor.find((x) => x.id === "molekula").ob("sulfatni-ion");
  assert.equal(iz("polarnost"), "ion z nabojem 2−");
  mod.dispose();
});
