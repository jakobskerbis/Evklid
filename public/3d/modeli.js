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

