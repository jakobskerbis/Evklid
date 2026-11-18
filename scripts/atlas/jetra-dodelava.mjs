// Dodelava jeter (docs/3d.md »Liver finishing«): node scripts/atlas/jetra-dodelava.mjs [--suho]
// Šivi med segmenti (osem ločenih teles Couinaud iz Z-Anatomy) ostanejo: niti večji odmik (napihni-dele.mjs, 4 mm:
// stopnice) niti mešanje normal ob stiku (svetle grebene) jih ne skrije; pravi popravek je zlitje segmentov v eno
// površino (Blender, voxel remesh) in nova peka (naloga za j, RTX).
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as G from "./zile-mreza.mjs";

const MAPA = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "3d", "modeli", "organi-3d");
// Žolčevod je visel 7 cm pod jetri v zrak (dvanajstnika ni, ocena 18. 11.): odrežemo ga pri y = ZOLCEVOD_DO (višina dna
// žolčnika), konec zapremo (pahljača). Enkrat (extras »skrajsano«).
export const ZOLCEVOD_DO = -0.057;
// Veja prave jetrne arterije je na desnem robu desnega režnja (x < −92 mm) štrlela skozi površino (rdeča pika, ocena
// 18. 11.): ta konec odrežemo in zapremo (znotraj jeter). Enkrat (extras »skrajsano«).
export const ARTERIJA_DO = -0.092;

export function skrajsaj(m, odvec) {
  const F = [];
  for (let f = 0; f < m.F.length; f += 3) if (![0, 1, 2].every((k) => odvec(G.pol(m, m.F[f + k])))) F.push(m.F[f], m.F[f + 1], m.F[f + 2]);
  const odvzetih = (m.F.length - F.length) / 3;
  m.F = F;
  G.zvari(m);
  let zaprtih = 0;
  for (const z of G.zanke(m)) {
    const c = [0, 0, 0];
    for (const e of z) for (let k = 0; k < 3; k++) c[k] += m.P[e.r * 3 + k] / z.length;
    const ic = G.dodajOglisce(m, c, [[z[0].r, 1]]);
    for (const e of z) m.F.push(e.r2, e.r, ic);
    zaprtih++;
  }
  m.spremenjeno = true;
  return { odvzetih, zaprtih };
}

export async function dodelaj(datoteka, { suho = false } = {}) {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(datoteka);
  const por = [];
  const kos = [
    [/^Bile duct/, (p) => p[1] < ZOLCEVOD_DO, `žolčevod pod y = ${ZOLCEVOD_DO * 1000} mm`],
    [/^Proper hepatic artery/, (p) => p[0] < ARTERIJA_DO, `konec prave jetrne arterije pri x < ${ARTERIJA_DO * 1000} mm`],
  ];
  for (const [rx, odvec, opis] of kos) {
    const n = doc.getRoot().listNodes().find((x) => x.getMesh() && rx.test(x.getName()));
    if (!n || n.getExtras()?.skrajsano) continue;
    const prim = n.getMesh().listPrimitives()[0];
    const m = G.preberi(n, prim);
    const r = skrajsaj(m, odvec);
    por.push(`${path.basename(datoteka)}: odrezan ${opis} (${r.odvzetih} trikotnikov, zaprtih koncev ${r.zaprtih})`);
    if (!suho) { G.zapisi(doc, n, prim, m); n.setExtras({ ...n.getExtras(), skrajsano: 1 }); }
  }
  if (!por.length) return [`${path.basename(datoteka)}: brez sprememb`];
  if (!suho) { G.brezSirot(doc); await io.write(datoteka, doc); }
  return por;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const suho = process.argv.includes("--suho");
  for (const ime of ["jetra.glb", "jetra-telefon.glb"]) for (const v of await dodelaj(path.join(MAPA, ime), { suho })) console.log(v);
}
