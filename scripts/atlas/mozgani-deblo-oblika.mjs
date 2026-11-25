// Oblika podaljšane hrbtenjače (docs/3d.md »Round r2, brain«): node scripts/atlas/mozgani-deblo-oblika.mjs [--suho]
// Ocena r1: deblo in hrbtenjača sta v celoti »enotna kremna cev brez mostu, olive in piramid«. Deblo iz aseg sub-01 ima
// most (≈ 2,5 × širši od podaljšane hrbtenjače), podaljšana hrbtenjača pa je gladek valj. Skripta oglišča debla (vozlišče
// »Brainstem (MRI)«, po mozgani-hrbtenjaca.mjs) radialno premakne okoli osi debla: olivi (sprednje stranska ovalna
// izboklina, ≈ 13 × 6 mm, OLIVA mm visoka, pod spodnjim robom mostu), piramidi (široka greben ob sredini spredaj, proti
// križanju piramid nižje plitvejša) in plitva sprednja sredinska brazda. Normale premaknjenih oglišč so na novo iz
// geometrije. Enkrat: vozlišče dobi extras »oblika«.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as G from "./zile-mreza.mjs";

const MAPA = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "3d", "modeli", "organi-3d");
export const OLIVA = 0.0022, PIRAMIDA = 0.0009, BRAZDA = 0.0007; // m

// Os debla: težišče oglišč (x, z) po rezinah višine y (glTF: y gor, z spredaj), zglajeno.
function os(W) {
  const korak = 0.002, rez = new Map();
  for (const p of W) {
    const k = Math.round(p[1] / korak);
    const r = rez.get(k) || [0, 0, 0];
    r[0] += p[0]; r[1] += p[2]; r[2]++;
    rez.set(k, r);
  }
  const kljuci = [...rez.keys()].sort((a, b) => a - b);
  const c = kljuci.map((k) => { const r = rez.get(k); return [k * korak, r[0] / r[2], r[1] / r[2]]; });
  return (y) => {
    let sx = 0, sz = 0, sw = 0;
    for (const [yy, x, z] of c) { const w = Math.exp(-(((yy - y) / 0.003) ** 2)); sx += w * x; sz += w * z; sw += w; }
    return [sx / sw, sz / sw];
  };
}

// Radialni premik oglišča p (os c = [x, z] na njegovi višini; yMost = spodnji rob mostu).
export function premik(p, c, yMost) {
  const dx = p[0] - c[0], dz = p[2] - c[1], r = Math.hypot(dx, dz);
  if (r < 1e-6) return 0;
  const th = Math.atan2(dx, dz); // 0 = spredaj
  const y = p[1];
  const yo = yMost - 0.0075; // sredina olive ≈ 7,5 mm pod spodnjim robom mostu
  const gOl = Math.exp(-(((y - yo) / 0.0052) ** 2)) * (Math.exp(-(((th - 0.95) / 0.36) ** 2)) + Math.exp(-(((th + 0.95) / 0.36) ** 2)));
  const gyP = Math.max(0, Math.min(1, (y - (yMost - 0.022)) / 0.008)) * (y < yMost + 0.001 ? 1 : 0);
  const gPi = gyP * (Math.exp(-(((th - 0.32) / 0.22) ** 2)) + Math.exp(-(((th + 0.32) / 0.22) ** 2)));
  const gBr = (y < yMost + 0.001 ? 1 : 0) * Math.exp(-((th / 0.13) ** 2));
  return OLIVA * gOl + PIRAMIDA * gPi - BRAZDA * gBr;
}

export async function oblikuj(datoteka, { suho = false } = {}) {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(datoteka);
  const node = doc.getRoot().listNodes().find((n) => n.getMesh() && /^Brainstem/.test(n.getName()));
  if (!node) throw new Error(`${path.basename(datoteka)}: ni debla`);
  if (node.getExtras()?.oblika) return `${path.basename(datoteka)}: oblika že dodana`;
  const prim = node.getMesh().listPrimitives()[0];
  const m = G.preberi(node, prim);
  const osD = os(m.W);
  // spodnji rob mostu: pod najbolj sprednjo točko trebuha mostu prva višina, kjer sprednji rob debla pade pod 30 % poti
  // do sprednjega roba podaljšane hrbtenjače 30 mm niže
  const spredaj = (y) => { const s = m.W.filter((p) => Math.abs(p[1] - y) < 0.001); return s.length ? Math.max(...s.map((p) => p[2])) : null; };
  let yT = 0, zT = -Infinity;
  for (const p of m.W) if (p[2] > zT) { zT = p[2]; yT = p[1]; }
  const ref = spredaj(yT - 0.03) ?? zT - 0.01;
  let yMost = null;
  for (let y = yT; y > yT - 0.03; y -= 0.0005) { const z = spredaj(y); if (z !== null && z < ref + 0.3 * (zT - ref)) { yMost = y; break; } }
  if (yMost === null) throw new Error("ni spodnjega roba mostu");
  const n = m.P.length / 3, vec = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const p = G.pol(m, i), c = osD(p[1]);
    const d = premik(p, c, yMost);
    if (Math.abs(d) < 1e-6) continue;
    const dx = p[0] - c[0], dz = p[2] - c[1], r = Math.hypot(dx, dz);
    m.P[i * 3] += (dx / r) * d; m.P[i * 3 + 2] += (dz / r) * d;
    vec[i] = Math.abs(d);
  }
  const N = G.normaleZvarjenih(m);
  let st = 0;
  for (let i = 0; i < n; i++) if (vec[i] > 0) {
    const a = m.A.get("NORMAL");
    if (!a) break;
    const w = Math.min(1, vec[i] / 0.0004), s = [0, 1, 2].map((k) => a.d[i * 3 + k] * (1 - w) + N[m.zvar[i]][k] * w);
    const l = Math.hypot(...s) || 1;
    G.nastaviAtribut(m, "NORMAL", i, s.map((x) => x / l));
    st++;
  }
  m.spremenjeno = true;
  if (!suho) {
    G.zapisi(doc, node, prim, m);
    for (const acc of doc.getRoot().listAccessors()) if (acc.listParents().every((p) => p === doc.getRoot())) acc.dispose();
    node.setExtras({ ...(node.getExtras() || {}), oblika: 1 });
    await io.write(datoteka, doc);
  }
  return `${path.basename(datoteka)}: spodnji rob mostu y = ${(yMost * 1000).toFixed(1)} mm, premaknjenih ${st} oglišč`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const suho = process.argv.includes("--suho");
  for (const ime of ["mozgani.glb", "mozgani-telefon.glb"]) console.log(await oblikuj(path.join(MAPA, ime), { suho }));
}
