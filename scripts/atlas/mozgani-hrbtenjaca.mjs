// Začetek hrbtenjače pod podaljšano hrbtenjačo (docs/3d.md »Round r1, brain«): node scripts/atlas/mozgani-hrbtenjaca.mjs [--suho]
// Ocena 20. nov: v celoti se je pod senčnim režnjem videl le kratek bel štrcelj debla (deblo iz aseg sub-01 se konča ob
// spodnjem robu vidnega polja MRI). Pravi preparat možganov ima podaljšano hrbtenjačo do velike odprtine in začetek
// hrbtenjače (odrezan). Skripta deblu (vozlišče »Brainstem (MRI)«) doda zaprto cev: os nadaljuje smer spodnjega dela
// debla (težišči prerezov 4 in 14 mm nad dnom), prerez je elipsa, ki se z mere spodnjega dela podaljšane hrbtenjače
// zoži na hrbtenjačo (11 × 8,5 mm), dolžina DOLZINA, raven odrezan konec. Začne se ZACETEK nad dnom (v deblu: brez
// reže). UV, barva in normala-vir: najbližje oglišče debla zrcalne točke čez dno (tekstura podaljšane hrbtenjače se
// zvezno nadaljuje). Os in polmera gredo v mozgani.json (prerez.hrbtenjaca), risba reza (mozgani-rez-mri.py) po njih
// nariše sredinski prerez hrbtenjače. Enkrat: vozlišče dobi extras »hrbtenjaca«.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as G from "./zile-mreza.mjs";

const MAPA = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "3d", "modeli", "organi-3d");
export const DOLZINA = 0.03, ZACETEK = 0.004, HRBTENJACA = [0.0055, 0.00425]; // polosi (levo-desno, spredaj-zadaj) m

// Os in polosi iz oglišč debla (glTF: y gor, z spredaj). Vrne { os: [[x,y,z]…], a: [..], b: [..] } (polosi po osi).
export function osHrbtenjace(W, { dolzina = DOLZINA, zacetek = ZACETEK, rob = 12 } = {}) {
  let yMin = Infinity;
  for (const p of W) yMin = Math.min(yMin, p[1]);
  const prerez = (h, d = 0.0015) => {
    const s = W.filter((p) => Math.abs(p[1] - (yMin + h)) < d);
    const c = [0, 0, 0];
    for (const p of s) for (let k = 0; k < 3; k++) c[k] += p[k] / s.length;
    const odm = (k) => { const v = s.map((p) => Math.abs(p[k] - c[k])).sort((a, b) => a - b); return v[Math.floor(0.9 * (v.length - 1))] || 0.004; };
    return { c, a: odm(0), b: odm(2) };
  };
  const p0 = prerez(4 * 0.001), p1 = prerez(14 * 0.001);
  let d = G.v3.norm(G.v3.sub(p0.c, p1.c));
  if (d[1] > -0.5) d = G.v3.norm([d[0] * 0.3, -1, d[2]]); // vedno pretežno navzdol
  const zac = G.v3.add(p0.c, G.v3.mul(d, (0.004 - zacetek) / Math.max(0.3, -d[1]))); // ZACETEK nad dnom debla
  const os = [], a = [], b = [];
  for (let i = 0; i <= rob; i++) {
    const u = i / rob, s = u * (dolzina + zacetek);
    // os se v spodnjem delu rahlo upogne nazaj (vratna lordoza: hrbtenjača sledi kanalu za zobom axisa)
    os.push(G.v3.add(G.v3.add(zac, G.v3.mul(d, s)), [0, 0, -0.003 * u * u]));
    const g = Math.min(1, Math.max(0, (s - zacetek) / 0.016)), t = g * g * (3 - 2 * g);
    a.push(p0.a * (1 - t) + HRBTENJACA[0] * t);
    b.push(p0.b * (1 - t) + HRBTENJACA[1] * t);
  }
  return { os, a, b, dno: yMin };
}

// Zaprta eliptična cev (ravna pokrova) okoli osi; os x elipse = svetovni x (levo-desno).
export function cevElipsa(os, a, b, stranic) {
  const P = [], N = [], F = [];
  for (let i = 0; i < os.length; i++) {
    const t = G.v3.norm(G.v3.sub(os[Math.min(os.length - 1, i + 1)], os[Math.max(0, i - 1)]));
    const x = G.v3.norm(G.v3.sub([1, 0, 0], G.v3.mul(t, t[0])));
    const y = G.v3.cross(t, x);
    for (let j = 0; j < stranic; j++) {
      const f = (2 * Math.PI * j) / stranic, c = Math.cos(f), s = Math.sin(f);
      P.push(G.v3.add(os[i], G.v3.add(G.v3.mul(x, a[i] * c), G.v3.mul(y, b[i] * s))));
      N.push(G.v3.norm(G.v3.add(G.v3.mul(x, c / a[i]), G.v3.mul(y, s / b[i]))));
    }
  }
  for (let i = 0; i + 1 < os.length; i++) for (let j = 0; j < stranic; j++) {
    const p = i * stranic + j, q = i * stranic + (j + 1) % stranic;
    F.push(p, q, q + stranic, p, q + stranic, p + stranic);
  }
  for (const [i, smer] of [[0, -1], [os.length - 1, 1]]) {
    const t = G.v3.mul(G.v3.norm(G.v3.sub(os[Math.min(os.length - 1, i + 1)], os[Math.max(0, i - 1)])), smer);
    const s0 = P.length;
    for (let j = 0; j < stranic; j++) { P.push(P[i * stranic + j].slice()); N.push(t); }
    P.push(os[i].slice()); N.push(t);
    for (let j = 0; j < stranic; j++) { const p = s0 + j, q = s0 + (j + 1) % stranic; if (smer > 0) F.push(p, q, s0 + stranic); else F.push(q, p, s0 + stranic); }
  }
  let v = 0;
  for (let q = 0; q < F.length; q += 3) v += G.v3.dot(P[F[q]], G.v3.cross(P[F[q + 1]], P[F[q + 2]]));
  if (v < 0) for (let q = 0; q < F.length; q += 3) { const t = F[q + 1]; F[q + 1] = F[q + 2]; F[q + 2] = t; }
  return { P, N, F };
}

export async function dodaj(datoteka, { suho = false } = {}) {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(datoteka);
  const telefon = /-telefon\.glb$/.test(datoteka);
  const node = doc.getRoot().listNodes().find((n) => n.getMesh() && /^Brainstem/.test(n.getName()));
  if (!node) throw new Error(`${path.basename(datoteka)}: ni debla`);
  const prim = node.getMesh().listPrimitives()[0];
  const m = G.preberi(node, prim);
  if (node.getExtras()?.hrbtenjaca) return { porocilo: `${path.basename(datoteka)}: hrbtenjača že dodana`, opis: node.getExtras().hrbtenjaca };
  const o = osHrbtenjace(m.W, { rob: telefon ? 9 : 14 });
  const c = cevElipsa(o.os, o.a, o.b, telefon ? 14 : 22);
  const n0 = m.P.length / 3;
  const najblizje = (p) => { let v = 0, bd = Infinity; for (let r = 0; r < n0; r++) { const d = (m.P[r * 3] - p[0]) ** 2 + (m.P[r * 3 + 1] - p[1]) ** 2 + (m.P[r * 3 + 2] - p[2]) ** 2; if (d < bd) { bd = d; v = r; } } return v; };
  const zrcali = (p) => [p[0], o.dno + Math.abs(p[1] - o.dno) + 0.002, p[2]]; // nad dno: tekstura podaljšane hrbtenjače
  const zac = n0;
  for (let i = 0; i < c.P.length; i++) G.dodajOglisce(m, c.P[i], [[najblizje(zrcali(c.P[i])), 1]], m.A.has("NORMAL") ? { NORMAL: c.N[i] } : {});
  for (const f of c.F) m.F.push(zac + f);
  m.spremenjeno = true;
  const opis = { os: o.os.map((p) => p.map((x) => +x.toFixed(5))), a: o.a.map((x) => +x.toFixed(5)), b: o.b.map((x) => +x.toFixed(5)) };
  if (!suho) {
    G.zapisi(doc, node, prim, m);
    // zapisi pusti stare dostopnike v dokumentu (brez staršev razen korena): sicer gredo v GLB še enkrat (+27 kB telefon)
    for (const acc of doc.getRoot().listAccessors()) if (acc.listParents().every((p) => p === doc.getRoot())) acc.dispose();
    node.setExtras({ ...(node.getExtras() || {}), hrbtenjaca: 1 });
    await io.write(datoteka, doc);
  }
  return { porocilo: `${path.basename(datoteka)}: hrbtenjača ${(DOLZINA * 1000).toFixed(0)} mm, +${c.F.length / 3} trikotnikov, dno debla y = ${(o.dno * 1000).toFixed(1)} mm`, opis, tri: c.F.length / 3 };
}

async function glavni() {
  const suho = process.argv.includes("--suho");
  const j = path.join(MAPA, "mozgani.json");
  const podatki = JSON.parse(fs.readFileSync(j, "utf8"));
  for (const [ime, kljuc] of [["mozgani.glb", "racunalnik"], ["mozgani-telefon.glb", "telefon"]]) {
    const r = await dodaj(path.join(MAPA, ime), { suho });
    console.log(r.porocilo);
    if (suho) continue;
    if (kljuc === "racunalnik" && r.opis?.os) podatki.prerez.hrbtenjaca = r.opis;
    if (r.tri && podatki.trikotniki?.[kljuc]) podatki.trikotniki[kljuc] += r.tri;
  }
  if (!suho) fs.writeFileSync(j, JSON.stringify(podatki, null, 1) + "\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await glavni();
