// Kateri modeli obstajajo: datoteke telesa (velikost in različica za napredek prenosa in predpomnilnik) in modeli iz
// kode po področjih (public/3d/modeli/<podrocje>/index.js, docs/3d.md). Strežnik pove, katera področja že obstajajo
// (server/tri-d.js), zato uvozimo samo ta; področje, ki ga ni ali se ne naloži, tiho preskočimo.
import { PODROCJA } from "./pogodba.js";

// Seznam datotek in področij (server/tri-d.js); brez povezave zadnja shranjena kopija (service worker).
let seznamObljuba = null;
export function seznamDatotek() {
  seznamObljuba ||= fetch(new URL("./modeli/seznam.json", import.meta.url).href)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null)
    .then((j) => j || { datoteke: {}, podrocja: [] });
  return seznamObljuba;
}

// Seznam modelov po področjih: vsako področje ima svoj public/3d/modeli/<podrocje>/index.js; manjkajoče preskočimo.
export async function seznamModelov() {
  const { podrocja = [] } = await seznamDatotek();
  const vsi = await Promise.all(
    PODROCJA.filter((p) => podrocja.includes(p)).map(async (p) => {
      try {
        const m = await import(new URL(`./modeli/${p}/index.js`, import.meta.url).href);
        return (Array.isArray(m.default) ? m.default : []).map((x) => ({ ...x, podrocje: x.podrocje || p, url: new URL(`./modeli/${p}/${String(x.pot || `${x.id}.js`).replace(/^\.\//, "")}`, import.meta.url).href }));
      } catch {
        return [];
      }
    }),
  );
  return vsi.flat();
}

export async function naloziModel(id) {
  const x = (await seznamModelov()).find((m) => m.id === id);
  if (!x) return null;
  const mod = await import(x.url);
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
