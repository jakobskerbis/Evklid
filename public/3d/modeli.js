// Kateri modeli obstajajo: datoteke telesa (velikost in različica za napredek prenosa in predpomnilnik) in modeli iz
// kode po področjih (public/3d/modeli/<podrocje>/index.js, docs/3d.md). Strežnik pove, katera področja že obstajajo
// (server/tri-d.js), zato uvozimo samo ta; področje, ki ga ni ali se ne naloži, tiho preskočimo.
import { PODROCJA } from "./pogodba.js";
import { jsonAliNic } from "../odgovor.js";

// Seznam datotek in področij (server/tri-d.js); brez povezave zadnja shranjena kopija (service worker).
let seznamObljuba = null;
export function seznamDatotek() {
  // Neuspeh (npr. minuta izpada med objavo) se ne zapomni: naslednji klic poskusi znova; napaka: true za stran /3d.
  seznamObljuba ||= fetch(new URL("./modeli/seznam.json", import.meta.url).href)
    .then((r) => jsonAliNic(r))
    .catch(() => null)
    .then((j) => {
      if (j) return j;
      seznamObljuba = null;
      return { datoteke: {}, podrocja: [], napaka: true };
    });
  return seznamObljuba;
}

// Seznam modelov po področjih: vsako področje ima svoj public/3d/modeli/<podrocje>/index.js; manjkajoče preskočimo.
// Seznam ima lastnost napaka: true, če seznama ali katerega področja ni bilo mogoče naložiti (povezava).
export async function seznamModelov() {
  const { podrocja = [], napaka = false } = await seznamDatotek();
  let manjka = napaka;
  const vsi = await Promise.all(
    PODROCJA.filter((p) => podrocja.includes(p)).map(async (p) => {
      try {
        const m = await import(new URL(`./modeli/${p}/index.js`, import.meta.url).href);
        return (Array.isArray(m.default) ? m.default : []).map((x) => ({ ...x, podrocje: x.podrocje || p, url: new URL(`./modeli/${p}/${String(x.pot || `${x.id}.js`).replace(/^\.\//, "")}`, import.meta.url).href }));
      } catch {
        manjka = true;
        return [];
      }
    }),
  );
  return Object.assign(vsi.flat(), { napaka: manjka });
}

// Model z id-jem; null, če ga res ni. Če ga ni zaradi povezave (seznam ali datoteka se ni naložila), vrže napako s
// povezava: true (stran /3d pokaže »Ni povezave« in poskusi znova, ne »Ta 3D prikaz ne obstaja«).
export async function naloziModel(id) {
  const seznam = await seznamModelov();
  const x = seznam.find((m) => m.id === id);
  const povezava = () => Object.assign(new Error("povezava"), { povezava: true });
  if (!x) {
    if (seznam.napaka) throw povezava();
    return null;
  }
  let mod;
  try {
    mod = await import(x.url);
  } catch {
    throw povezava();
  }
  if (!mod?.info || typeof mod.zgradi !== "function") return null;
  return mod;
}


// Mapa modelov telesa: podrobni modeli (telo-hd, ~3,5 M trikotnikov, 30 MB) samo na računalniku, sicer telo (telefonski
// nabor, ~1,8 M, 19 MB). Pravilo: kakovost »visoka« (scena.js: samodejno ali ročna izbira) in natančen kazalec (miška,
// ne prst), vsaj 4 GB pomnilnika (ali neznano) in zaslon vsaj 1024 px po daljši strani. Telefon in tablica vedno telo.
export function mapaTelesa({ kakovost, grobKazalec = false, pomnilnik = null, zaslon = 0, varcno = false } = {}) {
  if (kakovost !== "visoka" || grobKazalec || varcno) return "telo";
  if (pomnilnik != null && pomnilnik < 4) return "telo";
  if (!(zaslon >= 1024)) return "telo";
  return "telo-hd";
}
export function mapaTelesaNaprave(kakovost) {
  const nav = typeof navigator !== "undefined" ? navigator : {};
  const grob = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
  const scr = typeof screen !== "undefined" ? screen : {};
  return mapaTelesa({ kakovost, grobKazalec: grob, pomnilnik: nav.deviceMemory ?? null, zaslon: Math.max(scr.width || 0, scr.height || 0), varcno: nav.connection?.saveData === true });
}
