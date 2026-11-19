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
    // Pečene teksture (peka.py, PNG brez izgub) → WebP: osnovna barva q90 (telefon q86), ORM q82 (telefon q70), normalna
    // mapa q95 (telefon q84; brez blokov v odsevih; brez izgub je ~3× večja in na zaslonu ni razlike). Telefon ima ≥ 5 %
    // rezerve pod mejo 2 MiB (test/3d-organi-glb.test.js). Tangente ostanejo 8-bitne kot normale.
    const q = imaSlike ? path.join(src, `${organ}${pripona}.q.glb`) : izhod;
    gt("quantize", tmp, q, "--quantize-position", "14", "--quantize-normal", "8", "--quantize-color", "8", "--quantize-texcoord", "14");
    if (imaSlike) {
      const w = path.join(src, `${organ}${pripona}.w.glb`);
      const w2 = path.join(src, `${organ}${pripona}.w2.glb`);
      // kakovost [osnovna, ORM, normalna]: ORM (senca okolice, hrapavost) je gladek podatek, q82 je na zaslonu enak q90;
      // normalna mapa visoko (brez blokov v odsevih). Če GLB preseže mejo (računalnik 6 MB, telefon 2 MiB s 5 % rezerve,
      // test/3d-organi-glb.test.js), znižamo kakovost po korakih (najprej osnovna in normalna, ORM že nizko).
      // Zadnji koraki telefona zmanjšajo slike (px), ker pri nizki kakovosti WebP nastanejo bloki (srce n8: CT stene).
      const lestev = pripona
        ? [[86, 70, 84], [80, 66, 78], [82, 66, 80, 896], [82, 66, 80, 832], [82, 66, 80, 768], [76, 60, 74, 768]]
        : [[90, 82, 95], [84, 76, 90], [78, 72, 85], [72, 66, 80], [78, 72, 85, 1792], [78, 72, 85, 1536]]; // zadnja: manjše slike (srce n11: geometrija 207k ≈ 5,2 MiB)
      const meja = (pripona ? 2 : 6) * 1024 * 1024 * (pripona ? 0.95 : 0.97);
      const r = path.join(src, `${organ}${pripona}.r.glb`);
      for (const [k, [qb, qo, qn, px]] of lestev.entries()) {
        if (px) gt("resize", q, r, "--width", String(px), "--height", String(px));
        gt("webp", px ? r : q, w, "--slots", "baseColorTexture", "--quality", String(qb), "--effort", "100");
        gt("webp", w, w2, "--slots", "{occlusionTexture,metallicRoughnessTexture}", "--quality", String(qo), "--effort", "100");
        gt("webp", w2, izhod, "--slots", "normalTexture", "--quality", String(qn), "--effort", "100");
        if (fs.statSync(izhod).size <= meja || k === lestev.length - 1) {
          if (k) console.log(`${organ}${pripona}: WebP q${qb}/${qo}/${qn}${px ? `, ${px} px` : ""} (meja ${(meja / 1048576).toFixed(2)} MiB)`);
          break;
        }
      }
      fs.rmSync(r, { force: true });
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
  // srce (srce_ct.py): štiriprostorska ravnina iz CT in prostorska tekstura reza (smer vlaken, maščoba) ob GLB
  if (izvoz.ravnina4 && j.prerez?.ravnine?.length) j.prerez.ravnine[0] = izvoz.ravnina4;
  if (izvoz.volumen) {
    fs.copyFileSync(path.join(src, izvoz.volumen.slika), path.join(CILJ, `${organ}-volumen.png`));
    j.prerez = { ...(j.prerez || {}), volumen: { ...(j.prerez?.volumen || {}), ...izvoz.volumen, slika: `${organ}-volumen.png` } };
  }
  j.trikotniki = { racunalnik: izvoz.trikotniki, telefon: izvoz.trikotnikiTelefon };
  fs.writeFileSync(pot, JSON.stringify(j, null, 1) + "\n");
  console.log(`${path.relative(ROOT, pot)}: ${j.deli.length} delov, ${izvoz.vozlisca.length} vozlišč`);
}
