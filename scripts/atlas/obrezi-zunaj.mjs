// Pljuča: veje bronhijev in žil v pljučih (tkiva »…-v«) so ponekod molele iz poenostavljenih režnjev (pregled krog 4:
// »palčke« pod kupolo prepone v prerezu, konci žil skozi plevro). Trikotniki, ki imajo vsa tri oglišča zunaj vseh
// režnjev, se odstranijo. Znotraj/zunaj: parnost zadetkov žarka z mrežo režnja v treh smereh (odloči večina); ob hilusu
// (odprtina v mreži režnja, tam veje upravičeno izstopajo) se ne reže. Ponovljivo (drugi zagon ne najde ničesar).
// Zagon: node scripts/atlas/obrezi-zunaj.mjs [--suho]; nato node scripts/atlas/preveri-mreze.mjs pljuca.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as G from "./zile-mreza.mjs";

const MODELI = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "3d", "modeli");
const DATOTEKE = ["organi-3d/pljuca.glb", "organi-3d/pljuca-telefon.glb"];
const VEJE = new Set(["dihalna-v", "pljucna-arterija-v", "pljucna-vena-v"]);
// območje hilusa (m, koordinate organa): tu se ne reže
const obHilusu = (x, y) => Math.abs(x) < 0.05 && y > -0.06 && y < 0.06;

const suho = process.argv.includes("--suho");
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
for (const rel of DATOTEKE) {
  const pot = path.join(MODELI, rel);
  const doc = await io.read(pot);
  const rezi = [];
  for (const node of doc.getRoot().listNodes()) {
    if (!node.getMesh() || node.getExtras()?.tkivo !== "pljuca") continue;
    for (const prim of node.getMesh().listPrimitives()) {
      const m = G.preberi(node, prim);
      const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
      for (let i = 0; i < m.P.length; i++) { lo[i % 3] = Math.min(lo[i % 3], m.P[i]); hi[i % 3] = Math.max(hi[i % 3], m.P[i]); }
      rezi.push({ m, lo, hi, ploskve: Array.from({ length: m.F.length / 3 }, (_, f) => f) });
    }
  }
  const znotraj = (p) => {
    const smeri = [[p[0] < 0 ? -1 : 1, 0.07, 0.11], [0.09, 0.13, -1], [0.12, 1, 0.08]];
    for (const r of rezi) {
      if (p[0] < r.lo[0] || p[0] > r.hi[0] || p[1] < r.lo[1] || p[1] > r.hi[1] || p[2] < r.lo[2] || p[2] > r.hi[2]) continue;
      let lihih = 0;
      for (const d of smeri) if (G.steviloZadetkov(r.m, p, d, r.ploskve) % 2 === 1) lihih++;
      if (lihih >= 2) return true;
    }
    return false;
  };
  let vseh = 0, delov = 0;
  for (const node of doc.getRoot().listNodes()) {
    if (!node.getMesh() || !VEJE.has(node.getExtras()?.tkivo)) continue;
    for (const prim of node.getMesh().listPrimitives()) {
      const m = G.preberi(node, prim);
      const n = m.P.length / 3;
      const zunaj = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        const p = [m.P[i * 3], m.P[i * 3 + 1], m.P[i * 3 + 2]];
        zunaj[i] = !obHilusu(p[0], p[1]) && !znotraj(p) ? 1 : 0;
      }
      const F = [];
      for (let f = 0; f < m.F.length; f += 3) if (!(zunaj[m.F[f]] && zunaj[m.F[f + 1]] && zunaj[m.F[f + 2]])) F.push(m.F[f], m.F[f + 1], m.F[f + 2]);
      const odstranjenih = (m.F.length - F.length) / 3;
      if (!odstranjenih) continue;
      console.log(`${rel}: ${node.getName()}: −${odstranjenih} trikotnikov od ${m.F.length / 3}`);
      vseh += odstranjenih;
      delov++;
      if (!suho) {
        m.F = F;
        m.spremenjeno = true;
        G.zapisi(doc, node, prim, m);
      }
    }
  }
  console.log(`${rel}: odstranjenih ${vseh} trikotnikov v ${delov} delih`);
  // stari dostopniki zamenjanih mrež ne smejo ostati v datoteki
  for (const acc of doc.getRoot().listAccessors()) if (acc.listParents().every((x) => x.propertyType === "Root")) acc.dispose();
  if (vseh && !suho) await io.write(pot, doc);
}
