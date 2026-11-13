// Jetra: segmenti so ločena zaprta telesa z zaobljenimi robovi, med njimi je bila na površini v naravnih barvah vidna
// globoka ravna brazda (pregled kroga 3 in 4). Vsako oglišče segmenta se premakne vzdolž svoje normale za »odmik«:
// sosednja segmenta se ob stiku prekrijeta, brazda postane plitva guba, zunanja površina zraste enakomerno (brez stopnic).
// Topologija, UV in teksture ostanejo, segmenti so še vedno izbirljivi. Ponovljivo: vozlišče dobi extras.napihnjeno.
// Zagon: node scripts/atlas/napihni-dele.mjs [--suho]; nato node scripts/atlas/preveri-mreze.mjs jetra.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as G from "./zile-mreza.mjs";

const MODELI = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "3d", "modeli");
// 2026-11-12: jetra so ena sama površina, razdeljena na režnje že pri izvozu (scripts/atlas/jetra_geometrija.py), zato
// napihovanje segmentov ni več potrebno in bi nove režnje pokvarilo. Načrt je prazen; orodje ostane za druge organe.
export const NACRT = {};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const suho = process.argv.includes("--suho");
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  for (const [rel, { tkivo, odmik }] of Object.entries(NACRT)) {
    const pot = path.join(MODELI, rel);
    const doc = await io.read(pot);
    let spremenjeno = 0;
    for (const node of doc.getRoot().listNodes()) {
      if (!node.getMesh() || node.getExtras()?.tkivo !== tkivo || node.getExtras().napihnjeno === odmik) continue;
      for (const prim of node.getMesh().listPrimitives()) {
        const m = G.preberi(node, prim);
        // normala oglišča: povprečje normal vseh oglišč na istem mestu (šivi UV), da se mreža ob šivu ne razpre
        const N = m.A.get("NORMAL");
        if (!N) continue;
        const vsota = new Map();
        const kljuc = (i) => `${Math.round(m.P[i * 3] * 2e6)},${Math.round(m.P[i * 3 + 1] * 2e6)},${Math.round(m.P[i * 3 + 2] * 2e6)}`;
        const n = m.P.length / 3;
        const kl = Array.from({ length: n }, (_, i) => kljuc(i));
        for (let i = 0; i < n; i++) {
          const v = vsota.get(kl[i]) || [0, 0, 0];
          for (let c = 0; c < 3; c++) v[c] += N.d[i * N.n + c];
          vsota.set(kl[i], v);
        }
        for (let i = 0; i < n; i++) {
          const v = vsota.get(kl[i]);
          const l = Math.hypot(...v) || 1;
          for (let c = 0; c < 3; c++) m.P[i * 3 + c] += (v[c] / l) * odmik;
        }
        if (!suho) G.zapisi(doc, node, prim, m);
      }
      node.setExtras({ ...node.getExtras(), napihnjeno: odmik });
      console.log(`${rel}: ${node.getName()}: +${(odmik * 1000).toFixed(1)} mm`);
      spremenjeno++;
    }
    // stari dostopniki zamenjanih mrež ne smejo ostati v datoteki
    for (const acc of doc.getRoot().listAccessors()) if (acc.listParents().every((x) => x.propertyType === "Root")) acc.dispose();
    if (spremenjeno && !suho) await io.write(pot, doc);
  }
}
