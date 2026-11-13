// Debelina cevastih delov organov na prave mere (pregled krog 3): sečevod je bil širok ≈ 1,5 cm (pravi 3–5 mm), ledvična
// vena tanjša od arterije (prava vena ≈ 1 cm, arterija 5–6 mm; arterija v modelu že ustreza), vidni živec tanek kot nit (pravi 3–4 mm z ovojnico).
// Vsako oglišče se premakne pravokotno na os cevi (os = gladka srednjica vzdolž glavne smeri dela), tako da je srednji
// polmer cevi enak ciljnemu; topologija, UV, imena in kvantizacija ostanejo. Ponovljivo: obdelano vozlišče dobi
// extras.debelinaCevi in ga drugi zagon preskoči. »prehod«: ob koncu, ki je bližje točki »pri«, se debelina zvezno vrne na prvotno (lijak ob
// ledvičnem mehu, stik žile z vejami), da se cev ne odtrga od sosednjega dela.
// Zagon: node scripts/atlas/debelina-cevi.mjs [filter] [--suho]; nato node scripts/atlas/preveri-mreze.mjs <filter>.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as G from "./zile-mreza.mjs";

const MODELI = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "3d", "modeli");
// ledvica (2026-11-13): sečevod dobi pravo mero in raven konec že pri izvozu (izvozi-organe.py, ledvicni_meh), ledvični
// žili v drevesa.py – tanjšanje po peki je na mehu pustilo črno liso (del, ki je bil med peko skrit v debelem sečevodu)
const oko = [[/^Optic nerve \(II\)\.l$/, { polmer: 0.00175 }]];
export const NACRT = {
  "organi-3d/oko.glb": oko,
  "organi-3d/oko-telefon.glb": oko,
};

// glavna smer oblaka točk (potenčna metoda na kovariančni matriki)
function glavnaSmer(P, c) {
  const C = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < P.length; i += 3) {
    const x = P[i] - c[0], y = P[i + 1] - c[1], z = P[i + 2] - c[2];
    C[0] += x * x; C[1] += x * y; C[2] += x * z; C[3] += y * y; C[4] += y * z; C[5] += z * z;
  }
  let a = [1, 0.7, 0.4];
  for (let k = 0; k < 60; k++) {
    const b = [C[0] * a[0] + C[1] * a[1] + C[2] * a[2], C[1] * a[0] + C[3] * a[1] + C[4] * a[2], C[2] * a[0] + C[4] * a[1] + C[5] * a[2]];
    const l = Math.hypot(...b) || 1;
    a = b.map((x) => x / l);
  }
  return a;
}

export function odebeli(m, { polmer, prehod = null, korak = 0.001, raven = 0 }) {
  const n = m.P.length / 3;
  const c = [0, 0, 0];
  for (let i = 0; i < m.P.length; i++) c[i % 3] += m.P[i] / n;
  const a = glavnaSmer(m.P, c);
  const t = new Float64Array(n);
  let t0 = 1e9, t1 = -1e9;
  for (let i = 0; i < n; i++) {
    t[i] = (m.P[i * 3] - c[0]) * a[0] + (m.P[i * 3 + 1] - c[1]) * a[1] + (m.P[i * 3 + 2] - c[2]) * a[2];
    t0 = Math.min(t0, t[i]);
    t1 = Math.max(t1, t[i]);
  }
  // srednjica: težišče oglišč po rezinah vzdolž glavne smeri, zglajeno
  const st = Math.max(2, Math.ceil((t1 - t0) / korak));
  const vs = Array.from({ length: st }, () => [0, 0, 0, 0]);
  for (let i = 0; i < n; i++) {
    const b = Math.min(st - 1, Math.floor(((t[i] - t0) / (t1 - t0)) * st));
    for (let k = 0; k < 3; k++) vs[b][k] += m.P[i * 3 + k];
    vs[b][3]++;
  }
  let sr = vs.map((v) => (v[3] ? [v[0] / v[3], v[1] / v[3], v[2] / v[3]] : null));
  for (let b = 0; b < st; b++) if (!sr[b]) sr[b] = sr.slice(0, b).reverse().find(Boolean) || sr.slice(b).find(Boolean);
  for (let krog = 0; krog < 3; krog++) sr = sr.map((_, b) => [0, 1, 2].map((k) => (sr[Math.max(0, b - 1)][k] + 2 * sr[b][k] + sr[Math.min(st - 1, b + 1)][k]) / 4));
  const sredina = (ti) => {
    const x = Math.min(st - 1.001, Math.max(0, ((ti - t0) / (t1 - t0)) * st - 0.5));
    const b = Math.floor(x), f = x - b;
    return [0, 1, 2].map((k) => sr[b][k] * (1 - f) + sr[Math.min(st - 1, b + 1)][k] * f);
  };
  // pravokotni odmik od srednjice in srednji polmer
  const R = new Float64Array(n * 3);
  let vsota = 0;
  for (let i = 0; i < n; i++) {
    const s = sredina(t[i]);
    const d = [m.P[i * 3] - s[0], m.P[i * 3 + 1] - s[1], m.P[i * 3 + 2] - s[2]];
    const os = d[0] * a[0] + d[1] * a[1] + d[2] * a[2];
    for (let k = 0; k < 3; k++) R[i * 3 + k] = d[k] - os * a[k];
    vsota += Math.hypot(R[i * 3], R[i * 3 + 1], R[i * 3 + 2]);
  }
  const zdaj = vsota / n;
  const k0 = polmer / zdaj;
  if (Math.abs(k0 - 1) < 0.03) return { polmer: zdaj, faktor: 1 };
  // prehod: konec, ki je bližje točki »pri«
  let pri = null;
  if (prehod) {
    const tp = (prehod.pri[0] - c[0]) * a[0] + (prehod.pri[1] - c[1]) * a[1] + (prehod.pri[2] - c[2]) * a[2];
    pri = Math.abs(tp - t0) < Math.abs(tp - t1) ? t0 : t1;
  }
  for (let i = 0; i < n; i++) {
    let k = k0;
    if (pri !== null) {
      const x = Math.min(1, Math.abs(t[i] - pri) / prehod.dolzina);
      k = 1 + (k0 - 1) * x * x * (3 - 2 * x);
    }
    for (let j = 0; j < 3; j++) m.P[i * 3 + j] += R[i * 3 + j] * (k - 1);
  }
  // raven konec: oglišča v zadnjih »raven« metrih prostega konca se premaknejo vzdolž osi na ravnino pravokotno na os
  if (raven > 0 && pri !== null) {
    const konec = pri === t0 ? t1 : t0, smer = pri === t0 ? 1 : -1;
    const meja = konec - smer * raven;
    for (let i = 0; i < n; i++) {
      const cez = (t[i] - meja) * smer;
      if (cez > 0) for (let j = 0; j < 3; j++) m.P[i * 3 + j] -= a[j] * cez * smer * 0.97; // 3 % ostane: brez izrojenih trikotnikov
    }
  }
  return { polmer: zdaj, faktor: k0 };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const suho = process.argv.includes("--suho");
  const filter = process.argv.slice(2).find((x) => !x.startsWith("--"));
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  for (const [rel, nacrt] of Object.entries(NACRT)) {
    if (filter && !rel.includes(filter)) continue;
    const pot = path.join(MODELI, rel);
    const doc = await io.read(pot);
    let spremenjeno = 0;
    for (const node of doc.getRoot().listNodes()) {
      const mesh = node.getMesh();
      const korak = mesh && nacrt.find(([rx]) => rx.test(node.getName()));
      if (!korak) continue;
      // že obdelano (extras.debelinaCevi = ciljni polmer): srednji polmer po prehodu ni natanko ciljni, zato brez ponovitve
      if (node.getExtras().debelinaCevi === korak[1].polmer + (korak[1].raven || 0)) continue;
      for (const prim of mesh.listPrimitives()) {
        const m = G.preberi(node, prim);
        const r = odebeli(m, korak[1]);
        console.log(`${rel}: ${node.getName()}: polmer ${(r.polmer * 1000).toFixed(2)} mm → ${(korak[1].polmer * 1000).toFixed(2)} mm (×${r.faktor.toFixed(2)})`);
        if (r.faktor !== 1) {
          spremenjeno++;
          if (!suho) G.zapisi(doc, node, prim, m);
        }
      }
      node.setExtras({ ...node.getExtras(), debelinaCevi: korak[1].polmer + (korak[1].raven || 0) });
      spremenjeno++;
    }
    // stari dostopniki zamenjanih mrež ne smejo ostati v datoteki
    for (const acc of doc.getRoot().listAccessors()) if (acc.listParents().every((x) => x.propertyType === "Root")) acc.dispose();
    if (spremenjeno && !suho) await io.write(pot, doc);
  }
}
