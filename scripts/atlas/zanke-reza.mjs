// Zanke preseka vozlišč GLB z ravnino prereza organa (koordinati ravnine kot v public/3d/organ-presek.js: točka =
// O + x·U + y·V, metri GLB). Vhod za naslikane rezne ploskve (tkivo.rezSlika, npr. scripts/atlas/mali-mozgani-rez.py).
// Zagon: node scripts/atlas/zanke-reza.mjs <organ> <izhod.json> [tkivo,tkivo …]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { preberi } from "./zile-mreza.mjs";
import { zankePreseka, ploscina } from "../../public/3d/organ-presek.js";

const ORGANI = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "3d", "modeli", "organi-3d");
const [organ, izhod, tkiva] = process.argv.slice(2);
if (!organ || !izhod) throw new Error("zagon: node scripts/atlas/zanke-reza.mjs <organ> <izhod.json> [tkiva]");
const j = JSON.parse(fs.readFileSync(path.join(ORGANI, `${organ}.json`), "utf8"));
const rv = j.prerez.ravnine[0];
const l = Math.hypot(...rv.n);
const n = rv.n.map((x) => x / l), d = (rv.d || 0) / l;
const hoce = tkiva ? new Set(tkiva.split(",")) : null;
// ZANKE_GLB: drug GLB istega organa (npr. surov izvoz z ORGANI_TEKSTURE=0 pred peko)
const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(process.env.ZANKE_GLB || path.join(ORGANI, `${organ}.glb`));
const out = [];
for (const node of doc.getRoot().listNodes()) {
  const tkivo = node.getExtras()?.tkivo;
  if (!node.getMesh() || (hoce && !hoce.has(tkivo))) continue;
  // vsi primitivi vozlišča (vsak zase: zanka, ki bi tekla čez mejo primitivov, odpade)
  const zanke = [];
  let os = null;
  for (const prim of node.getMesh().listPrimitives()) {
    const m = preberi(node, prim);
    const r = zankePreseka(m.P, m.F, n, d, 1e-6, j.tkiva?.[tkivo]?.rezPresek?.skleni || 0);
    os = r;
    zanke.push(...r.zanke.filter((z) => Math.abs(ploscina(z)) > 1e-7));
  }
  if (zanke.length) out.push({ ime: node.getName(), tkivo, zanke, O: os.O, U: os.U, V: os.V });
}
fs.writeFileSync(izhod, JSON.stringify(out));
console.log(`${organ}: ${out.length} vozlišč z zankami → ${izhod}`);
