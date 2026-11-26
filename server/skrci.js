// Skrčene datoteke JS (N-08c, j 26. 11. 2026, kartica »Vse tri«): pred stiskanjem (server/compress.js) odstranimo
// komentarje in presledke ter skrajšamo sintakso (esbuild transform: minifyWhitespace + minifySyntax). Imena funkcij
// in spremenljivk ostanejo (izgubi se le ime funkcijskega izraza, ki ga koda ne uporabi: const f = function g() {}), zato so sporočila o napakah iz brskalnika še berljiva. Prenos prvega odprtja je ~27 %
// manjši (brotli), vsebina modula se ne spremeni. Samo datoteke aplikacije iz public/ (ne vendor, ne sw.js, ki mu
// strežnik vstavi različico); licenčni komentarji ostanejo (legalComments: "inline").
// Vklop: na produkciji (jeProdukcija) in v dimnem testu (scripts/preveri-aplikacijo.cjs), izklop EVKLID_SKRCI=0.
// Neuspeh (napaka razčlenjevanja) ne ustavi ničesar: datoteka gre nespremenjena.
import fs from "node:fs";
import { createRequire } from "node:module";
import { jeProdukcija } from "./crypto-polje.js";

export const skrciVklopljeno = (env = process.env) => env.EVKLID_SKRCI === "1" || (env.EVKLID_SKRCI !== "0" && jeProdukcija(env));

let esbuild = null;
let opozorjeno = false;
const IZPUSTI = /(^|[\\/])sw\.js$/;

// Največ NAENKRAT krčenj hkrati. Prvo odprtje po objavi (prazen predpomnilnik) zahteva ~130 modulov naenkrat; brez
// meje jih esbuild (svoj proces, šteje v 512 MB na Renderju) krči vse hkrati in zraste na ~145 MB, ki jih Go ne vrne
// takoj; dve naenkrat ~21 MB, skupni čas skoraj enak (stiskanje brotli tako ali tako čaka v niti zlib).
const NAENKRAT = 2;
let tece = 0;
const caka = [];
const vzemi = () => (tece < NAENKRAT ? (tece++, Promise.resolve()) : new Promise((r) => caka.push(r)));
const vrni = () => {
  const naslednji = caka.shift();
  if (naslednji) naslednji(); // mesto preide neposredno na čakajočega (tece ostane enak)
  else tece--;
};
export const skrciVrsta = () => ({ tece, caka: caka.length }); // testi

// Oznaka načina krčenja (različica esbuild): del ETag (server/compress.js) in različice datotek (server/app.js), da
// nova različica esbuild ali vklop/izklop ne pusti brskalniku in service workerju starih skrčenih kopij (304).
export const skrciOznaka = (() => {
  try {
    return `esbuild-${JSON.parse(fs.readFileSync(createRequire(import.meta.url).resolve("esbuild/package.json"), "utf8")).version}`;
  } catch {
    return "esbuild-?";
  }
})();

// Vrne skrčeno vsebino (Buffer) ali null, če datoteke ne krčimo.
export async function skrciJs(buf, file) {
  if (!file.endsWith(".js") || IZPUSTI.test(file)) return null;
  await vzemi();
  try {
    esbuild ||= await import("esbuild");
    const { code } = await esbuild.transform(buf.toString("utf8"), {
      minifyWhitespace: true,
      minifySyntax: true,
      legalComments: "inline",
      charset: "utf8",
      sourcefile: file,
      // Navadni skripti v slogu ES5 (zacetek.js v <head>, sole.js …) ostanejo ES5: brez »catch {}« (ES2019).
      supported: { "optional-catch-binding": false },
    });
    return Buffer.from(code);
  } catch (e) {
    // Datoteka gre nespremenjena (server/compress.js); enkrat v dnevnik, da izpad krčenja (manjka esbuild) ni tih.
    if (!opozorjeno) console.warn(`[evklid] krčenje JS ni uspelo (${file}), datoteke gredo nespremenjene: ${e?.message || e}`);
    opozorjeno = true;
    throw e;
  } finally {
    vrni();
  }
}
skrciJs.oznaka = skrciOznaka;
