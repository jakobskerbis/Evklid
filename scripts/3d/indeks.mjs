// Iskalni kazalo za zavihek »Uči se → 3D svet« (public/3d/iskalnik.json): deli vsakega modela (id in ime, za iskanje
// »mitohondrij« → Živalska celica) in imena struktur atlasa (»stegnenica« → Atlas, odpre se na tej strukturi).
// Zagon: node scripts/3d/indeks.mjs   (po dodanem modelu ali delu; test/3d-iskanje.test.js preveri, da je kazalo ažurno)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as THREE from "three";
import { namestiPlatno } from "../../test/3d-preveri-gradnik.js";

const koren = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const D3 = path.join(koren, "public", "3d");
namestiPlatno();

export async function zgradiKazalo() {
  const modeli = {};
  for (const p of fs.readdirSync(path.join(D3, "modeli"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
    const f = path.join(D3, "modeli", p, "index.js");
    if (!fs.existsSync(f)) continue;
    for (const x of (await import(pathToFileURL(f).href)).default) {
      const mod = await import(pathToFileURL(path.join(D3, "modeli", p, String(x.pot || `${x.id}.js`))).href);
      // Vnos: [ime, ključ, vrednost]; ključ »del« odpre model na delu, drug ključ je nadzor (npr. telo=kocka).
      const deli = [];
      try {
        if (mod.organ) {
          const j = JSON.parse(fs.readFileSync(path.join(D3, "modeli", "organi-3d", `${mod.organ}.json`), "utf8"));
          for (const d of j.deli || []) deli.push([d.ime, "del", d.id, d.la || ""]);
        } else {
          const r = mod.zgradi(THREE, { kakovost: "nizka", gibanje: false, zacetek: {} });
          for (const d of r.deli || []) deli.push([d.ime, "del", d.id]);
          for (const c of r.nadzor || []) if (c.tip === "izbira") for (const [v, ime] of c.moznosti || []) deli.push([ime, c.id, v]);
        }
      } catch (e) {
        console.warn(`${x.id}: deli niso na voljo (${String(e.message).slice(0, 60)})`);
      }
      if (deli.length) modeli[x.id] = deli;
    }
  }
  // Atlas: eno ime na strukturo (leva in desna stran sta ista beseda); id prve vrstice odpre atlas na njej.
  const imena = JSON.parse(fs.readFileSync(path.join(D3, "atlas-imena.json"), "utf8"));
  const strukture = JSON.parse(fs.readFileSync(path.join(D3, "atlas-strukture.json"), "utf8"));
  const videno = new Set();
  const atlas = [];
  for (const s of strukture) {
    const i = imena[s.ime];
    if (!i?.sl || videno.has(s.ime)) continue;
    videno.add(s.ime);
    atlas.push([s.id, i.sl, i.la || ""]);
  }
  return { modeli, atlas };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const k = await zgradiKazalo();
  fs.writeFileSync(path.join(D3, "iskalnik.json"), JSON.stringify(k));
  console.log(`Modelov z deli: ${Object.keys(k.modeli).length}, struktur atlasa: ${k.atlas.length}`);
  process.exit(0);
}
