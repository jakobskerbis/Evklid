// Dodelava možganov (docs/3d.md »Brain finishing«): node scripts/atlas/mozgani-dodelava.mjs [--suho]
// Lističi malih možganov iz Z-Anatomy imajo stopničasto površino (»terase«, vidne odspodaj, ocena posnetkov 18. 11.):
// mreže so iz rezin MRI. Skripta jih zgladi s Taubinovim glajenjem (λ = 0,5, μ = −0,53, KROGOV krogov; ohrani
// prostornino, ne skrči) po zvarjenih ogliščih, robna oglišča (odprti robovi) ostanejo, normale iz nove geometrije.
// UV in teksture ostanejo. Enkrat (vozlišča dobijo extras »zglajeno«); mozgani.glb in mozgani-telefon.glb na mestu.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as G from "./zile-mreza.mjs";

const MAPA = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "3d", "modeli", "organi-3d");
export const TKIVA = new Set(["mali"]);
export const KROGOV = 8;

export function taubin(m, krogov = KROGOV, lam = 0.5, mu = -0.53) {
  G.zvari(m);
  const n = m.W.length;
  const sos = Array.from({ length: n }, () => new Set());
  for (let f = 0; f < m.F.length; f += 3) for (let k = 0; k < 3; k++) for (let q = 0; q < 3; q++) if (k !== q) sos[m.zvar[m.F[f + k]]].add(m.zvar[m.F[f + q]]);
  const robno = new Uint8Array(n);
  for (const l of G.robovi(m).values()) if (l.length === 1) { const h = l[0], f = (h / 3) | 0, k = h % 3; robno[m.zvar[m.F[f * 3 + k]]] = 1; robno[m.zvar[m.F[f * 3 + (k + 1) % 3]]] = 1; }
  let W = m.W.map((p) => p.slice());
  const korak = (f) => {
    const N = W.map((p, i) => {
      if (robno[i] || !sos[i].size) return p;
      const c = [0, 0, 0];
      for (const j of sos[i]) for (let k = 0; k < 3; k++) c[k] += W[j][k] / sos[i].size;
      return p.map((x, k) => x + f * (c[k] - x));
    });
    W = N;
  };
  for (let r = 0; r < krogov; r++) { korak(lam); korak(mu); }
  for (let i = 0; i < m.zvar.length; i++) for (let k = 0; k < 3; k++) m.P[i * 3 + k] = W[m.zvar[i]][k];
  G.zvari(m);
  const nor = m.A.get("NORMAL");
  if (nor) {
    const N = G.normaleZvarjenih(m);
    for (let i = 0; i < m.zvar.length; i++) for (let k = 0; k < 3; k++) nor.d[i * nor.n + k] = N[m.zvar[i]][k];
  }
  m.spremenjeno = true;
}

export async function dodelaj(datoteka, { suho = false } = {}) {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(datoteka);
  let st = 0;
  for (const node of doc.getRoot().listNodes()) {
    if (!node.getMesh() || !TKIVA.has(node.getExtras()?.tkivo) || node.getExtras()?.zglajeno) continue;
    for (const prim of node.getMesh().listPrimitives()) {
      const m = G.preberi(node, prim);
      taubin(m);
      if (!suho) G.zapisi(doc, node, prim, m);
    }
    if (!suho) node.setExtras({ ...node.getExtras(), zglajeno: KROGOV });
    st++;
  }
  if (st && !suho) { G.brezSirot(doc); await io.write(datoteka, doc); }
  return [`${path.basename(datoteka)}: zglajenih vozlišč ${st}`];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const suho = process.argv.includes("--suho");
  for (const ime of ["mozgani.glb", "mozgani-telefon.glb"]) for (const v of await dodelaj(path.join(MAPA, ime), { suho })) console.log(v);
}
