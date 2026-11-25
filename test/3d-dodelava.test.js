// Dodelave organov po izvozu (j 16. 11.: rob prereza srca, ledvična vena, pljuča): geometrija nove cevi in zapis
// razdalje do stene za pokrov reza.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cevSSteno, osVene, POLMER, STENA } from "../scripts/atlas/ledvica-dodelava.mjs";
import { razdaljaStene, delezStene, PAS } from "../scripts/atlas/rez-stena.mjs";
import { prekrizane, razpri } from "../scripts/atlas/pljuca-dodelava.mjs";
import { osZivca, cev, parametri, UV_KRPA } from "../scripts/atlas/oko-dodelava.mjs";
import * as G from "../scripts/atlas/zile-mreza.mjs";

const { v3 } = G;

test("ledvična vena: cev z dvojno steno je zaprta, navita navzven in ima prostornino stene", () => {
  const os = osVene([0, 0, 0], [0, 0, 1], [-0.02, 0, 0.012], [-1, 0, 0], 16);
  const c = cevSSteno(os, POLMER, POLMER - STENA, 16);
  assert.equal(c.P.length, c.N.length);
  assert.equal(c.P.length, c.T.length);
  // vsak rob (po položaju) si delita natanko dve ploskvi v nasprotnih smereh
  const k = (p) => p.map((x) => Math.round(x * 1e7)).join(",");
  const robovi = new Map();
  let vol = 0, slabih = 0;
  for (let q = 0; q < c.F.length; q += 3) {
    const t = [c.P[c.F[q]], c.P[c.F[q + 1]], c.P[c.F[q + 2]]];
    vol += v3.dot(t[0], v3.cross(t[1], t[2])) / 6;
    const n = v3.cross(v3.sub(t[1], t[0]), v3.sub(t[2], t[0]));
    if (v3.dot(n, v3.add(v3.add(c.N[c.F[q]], c.N[c.F[q + 1]]), c.N[c.F[q + 2]])) <= 0) slabih++;
    for (let i = 0; i < 3; i++) {
      const a = k(t[i]), b = k(t[(i + 1) % 3]);
      const kl = a < b ? `${a}|${b}` : `${b}|${a}`;
      const e = robovi.get(kl) || { n: 0, s: 0 };
      e.n++;
      e.s += a < b ? 1 : -1;
      robovi.set(kl, e);
    }
  }
  assert.equal(slabih, 0, "normale se ujemajo z navitjem");
  for (const e of robovi.values()) assert.deepEqual([e.n, e.s], [2, 0], "zaprta mnogoterna ploskev");
  let dol = 0;
  for (let i = 1; i < os.length; i++) dol += v3.dist(os[i], os[i - 1]);
  const pricakovano = Math.PI * (POLMER ** 2 - (POLMER - STENA) ** 2) * dol;
  assert.ok(vol > 0.85 * pricakovano && vol < 1.05 * pricakovano, `prostornina stene ${(vol * 1e9).toFixed(0)} mm³, pričakovano ≈ ${(pricakovano * 1e9).toFixed(0)}`);
});

// kocka s stranico a okoli izhodišča: 12 trikotnikov, navitih navzven
function kocka(a) {
  const h = a / 2;
  const V = [[-h, -h, -h], [h, -h, -h], [h, h, -h], [-h, h, -h], [-h, -h, h], [h, -h, h], [h, h, h], [-h, h, h]];
  const F = [[0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7], [0, 1, 5], [0, 5, 4], [2, 3, 7], [2, 7, 6], [1, 2, 6], [1, 6, 5], [0, 4, 7], [0, 7, 3]];
  return new Float64Array(F.flatMap((f) => f.flatMap((i) => V[i])));
}

test("rez-stena: razdalja do ploskve je linearna in ima prag 0,5 na ploskvi", () => {
  const tri = kocka(0.0105); // stena kocke pri ±5,25 mm: med središči vokslov
  const mreza = { lo: [-0.01, -0.01, -0.01], korak: 0.001, n: [20, 20, 20] };
  const r = razdaljaStene(tri, mreza, delezStene(tri, mreza).delez);
  const v = (i, j, k) => r[(k * 20 + j) * 20 + i];
  // središče voksla i je pri x = −10 + i + 0,5 mm; stena pri x = +5,25 mm → i = 14: 0,75 mm znotraj, i = 15: 0,25 mm zunaj
  const pricakovano = (mm) => 0.5 + mm / 1000 / (2 * PAS);
  assert.ok(Math.abs(v(14, 10, 10) - pricakovano(0.75)) < 0.012);
  assert.ok(Math.abs(v(15, 10, 10) - pricakovano(-0.25)) < 0.012);
  assert.ok(v(14, 10, 10) > 0.5 && v(15, 10, 10) < 0.5, "prag 0,5 loči znotraj in zunaj");
  assert.equal(v(10, 10, 10), 1, "globoko v tkivu");
  assert.equal(v(1, 1, 1), 0, "daleč zunaj");
  // 64 stopenj nikoli ne prečka praga: zapis je vedno liho mesto mreže 4k + 2
  for (const x of r) { const b = Math.round(x * 255); assert.ok(b === 0 || b === 255 || b % 4 === 2); }
});

test("pljuča: prekrižani listi (ploskvi si iz bližine gledata v obraz) so zaznani, pravi tanek list ne", () => {
  const list = (z1, z2) => {
    // dva kvadrata 10 mm: spodnji z normalo −z pri z1, zgornji z normalo +z pri z2 (pravi list: z1 < z2)
    const P = [0, 0, z1, 0.01, 0, z1, 0.01, 0.01, z1, 0, 0.01, z1, 0, 0, z2, 0.01, 0, z2, 0.01, 0.01, z2, 0, 0.01, z2];
    return { P, F: [0, 2, 1, 0, 3, 2, 4, 5, 6, 4, 6, 7] };
  };
  assert.equal(prekrizane(list(0, 0.001)).length, 0, "pravi list");
  assert.equal(prekrizane(list(0.001, 0)).length, 4, "strani v zamenjanem vrstnem redu");
});

test("pljuča: razpri razmakne prekrižana lista (strani spet v pravem vrstnem redu), pravega lista ne premakne", () => {
  const list = (z1, z2) => {
    const P = [0, 0, z1, 0.01, 0, z1, 0.01, 0.01, z1, 0, 0.01, z1, 0, 0, z2, 0.01, 0, z2, 0.01, 0.01, z2, 0, 0.01, z2];
    const N = [];
    for (let i = 0; i < 8; i++) N.push(0, 0, i < 4 ? -1 : 1);
    return { P, F: [0, 2, 1, 0, 3, 2, 4, 5, 6, 4, 6, 7], A: new Map([["NORMAL", { n: 3, d: N }]]) };
  };
  const m = list(0.001, 0);
  const r = razpri(m);
  assert.equal(r.krogi[0], 4);
  assert.equal(prekrizane(m).length, 0, "po razpri ni prekrižanih ploskev");
  assert.ok(m.P[2] < m.P[14], "spodnji list je spet pod zgornjim");
  const p = list(0, 0.001);
  const P0 = p.P.slice();
  assert.equal(razpri(p).premaknjenih, 0);
  assert.deepEqual(p.P, P0);
});

test("oko: vidni živec ima UV, ki se po cevi spreminja (krpa), ne ene same točke", () => {
  const os = osZivca([0, 0, -0.012], [0, 0, 0], [0.002, 0.003, -0.04], 20);
  const c = cev(os, 0.00175, 12);
  const T = parametri(os, c.P);
  const u = new Set(T.map((t) => t[0].toFixed(3))), v = new Set(T.map((t) => t[1].toFixed(3)));
  assert.ok(u.size >= 12 && v.size >= 20, "UV se spreminja po obodu in vzdolž osi");
  for (const [a, b] of T) assert.ok(Math.abs(a) <= 0.5 + 1e-9 && Math.abs(b) <= 0.5 + 1e-9);
  assert.ok(UV_KRPA > 0 && UV_KRPA < 0.002, "krpa ostane v enakomernem delu teksture");
});

test("zile-mreza: brezSirot odstrani dostopnike brez starša", async () => {
  const { Document } = await import("@gltf-transform/core");
  const doc = new Document();
  const b = doc.createBuffer();
  const a1 = doc.createAccessor().setType("SCALAR").setArray(new Float32Array([1])).setBuffer(b);
  doc.createAccessor().setType("SCALAR").setArray(new Float32Array([2])).setBuffer(b);
  doc.createMesh().addPrimitive(doc.createPrimitive().setAttribute("POSITION", a1));
  assert.equal(G.brezSirot(doc), 1);
  assert.equal(doc.getRoot().listAccessors().length, 1);
});
