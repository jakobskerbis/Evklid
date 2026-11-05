// Organi v 3D: stiskanje surovih GLB iz izvozi-organe.py in vpis vozlišč v public/3d/modeli/organi-3d/<organ>.json.
// Zagon: node scripts/atlas/organi.mjs <surova mapa> [organ …]
// GLB: dedup + kvantizacija (KHR_mesh_quantization), BREZ meshopt: organi se odpirajo tudi v lekcijah (pogon »3d-…«),
// kjer CSP glavne aplikacije ne dovoli WebAssembly za dekodirnik. Orodje: @gltf-transform/cli (MIT), samo za pripravo.
// JSON: besedila (deli, tkiva, pogledi, podrobnosti) pišemo ročno; skripta doda/posodobi samo deli[].vozlisca,
// velikost in število trikotnikov. Del iz izvoza, ki ga JSON še nima, doda kot ogrodje (ime/opis manjkata → test pade).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const CILJ = path.join(ROOT, "public", "3d", "modeli", "organi-3d");
const [src, ...izbrani] = process.argv.slice(2);
if (!src) {
  console.error("Uporaba: node scripts/atlas/organi.mjs <surova mapa> [organ …]");
  process.exit(1);
}
fs.mkdirSync(CILJ, { recursive: true });
const organi = izbrani.length ? izbrani : fs.readdirSync(src).filter((f) => f.endsWith(".vozlisca.json")).map((f) => f.replace(".vozlisca.json", ""));
const gt = (...a) => execFileSync("npx", ["--yes", "@gltf-transform/cli@4", ...a], { stdio: ["ignore", "ignore", "inherit"] });

for (const organ of organi) {
  for (const pripona of ["", "-telefon"]) {
    const vhod = path.join(src, `${organ}${pripona}.glb`);
    const tmp = path.join(src, `${organ}${pripona}.dedup.glb`);
    const izhod = path.join(CILJ, `${organ}${pripona}.glb`);
    gt("dedup", vhod, tmp);
    const imaSlike = (() => {
      const b = fs.readFileSync(tmp);
      return JSON.parse(b.subarray(20, 20 + b.readUInt32LE(12)).toString("utf8")).images?.length > 0;
    })();
    // Pečene teksture (peka.py, PNG brez izgub) → WebP: osnovna barva q90, ORM q82, normalna mapa q95 (brez blokov v
    // odsevih; brez izgub je ~3× večja in na zaslonu ni razlike). Tangente ostanejo 8-bitne kot normale.
    const q = imaSlike ? path.join(src, `${organ}${pripona}.q.glb`) : izhod;
    gt("quantize", tmp, q, "--quantize-position", "14", "--quantize-normal", "8", "--quantize-color", "8", "--quantize-texcoord", "14");
    if (imaSlike) {
      const w = path.join(src, `${organ}${pripona}.w.glb`);
      const w2 = path.join(src, `${organ}${pripona}.w2.glb`);
      gt("webp", q, w, "--slots", "baseColorTexture", "--quality", "90", "--effort", "100");
      // ORM (senca okolice, hrapavost) je gladek podatek: q82 je na zaslonu enak q90 in ~30 % manjši (telefon ≤ 2 MB)
      gt("webp", w, w2, "--slots", "{occlusionTexture,metallicRoughnessTexture}", "--quality", "82", "--effort", "100");
      gt("webp", w2, izhod, "--slots", "normalTexture", "--quality", "95", "--effort", "100");
      for (const f of [q, w, w2]) fs.rmSync(f, { force: true });
    }
    fs.rmSync(tmp, { force: true });
    console.log(`${path.relative(ROOT, izhod)}: ${(fs.statSync(izhod).size / 1024 / 1024).toFixed(2)} MB`);
  }
  const izvoz = JSON.parse(fs.readFileSync(path.join(src, `${organ}.vozlisca.json`), "utf8"));
  const pot = path.join(CILJ, `${organ}.json`);
  const j = fs.existsSync(pot) ? JSON.parse(fs.readFileSync(pot, "utf8")) : { organ, deli: [], tkiva: {}, pogledi: { celota: {} } };
  const poDelih = new Map();
  for (const v of izvoz.vozlisca) {
    if (!v.del) continue; // ozadje brez dela (npr. medialna stena možganov v prerezu): ni na seznamu delov
    if (!poDelih.has(v.del)) poDelih.set(v.del, []);
    poDelih.get(v.del).push(v.ime);
  }
  for (const [id, vozlisca] of poDelih) {
    let d = j.deli.find((x) => x.id === id);
    if (!d) j.deli.push((d = { id }));
    d.vozlisca = vozlisca.sort();
  }
  for (const d of j.deli) if (!poDelih.has(d.id)) d.vozlisca = [];
  for (const v of izvoz.vozlisca) j.tkiva[v.tkivo] ||= {};
  j.velikost = izvoz.velikost;
  j.trikotniki = { racunalnik: izvoz.trikotniki, telefon: izvoz.trikotnikiTelefon };
  fs.writeFileSync(pot, JSON.stringify(j, null, 1) + "\n");
  console.log(`${path.relative(ROOT, pot)}: ${j.deli.length} delov, ${izvoz.vozlisca.length} vozlišč`);
}
