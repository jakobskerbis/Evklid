// Kateri modeli obstajajo: datoteke telesa (velikost in različica za napredek prenosa in predpomnilnik) in modeli iz
// kode po področjih (public/3d/modeli/<podrocje>/index.js, docs/3d.md). Strežnik pove, katera področja že obstajajo
// (server/tri-d.js), zato uvozimo samo ta; področje, ki ga ni ali se ne naloži, tiho preskočimo.
import { PODROCJA } from "./pogodba.js";
import { jsonAliNic } from "../odgovor.js";

// Seznam datotek in področij (server/tri-d.js); brez povezave zadnja shranjena kopija (service worker).
let seznamObljuba = null;
export function seznamDatotek() {
  seznamObljuba ||= fetch(new URL("./modeli/seznam.json", import.meta.url).href)
    .then((r) => jsonAliNic(r))
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


// Naprava na dotik: prst je glavni ali vsaj eden od kazalcev, ali zaslon zazna več prstov. iPad s tipkovnico Magic Keyboard,
// sledilno ploščico ali miško javi »pointer: fine«, Safari pa ne pozna deviceMemory, zato samo (pointer: coarse) ni dovolj:
// tak iPad je dobil visoko kakovost in podrobni nabor telesa in mu je zmanjkalo pomnilnika. maxTouchPoints > 1 ga ujame.
// Prenosnik z zaslonom na dotik zato tudi dobi »nizka« (ročno: ?kakovost=visoka).
export function naDotik(nav = typeof navigator !== "undefined" ? navigator : {}, mm = typeof matchMedia === "function" ? matchMedia : null) {
  if ((nav?.maxTouchPoints || 0) > 1) return true;
  if (!mm) return false;
  try {
    return mm("(pointer: coarse)").matches || mm("(any-pointer: coarse)").matches;
  } catch {
    return false;
  }
}

const shranjenaKakovost = () => {
  try {
    return localStorage.getItem("evklid.3d.kakovost");
  } catch {
    return null;
  }
};

// Kakovost 3D (scena.js, graditelji modelov): »visoka« samo na računalniku brez zaslona na dotik; telefon in tablica dobita
// »nizka« (60 sličic na sekundo in pomnilnik pred lepoto). Ročna izbira: ?kakovost=nizka|visoka ali shramba evklid.3d.kakovost.
export function kakovostNaprave() {
  const q = typeof location !== "undefined" ? new URLSearchParams(location.search).get("kakovost") : null;
  const izbrana = q || shranjenaKakovost();
  if (izbrana === "nizka" || izbrana === "visoka") return izbrana;
  const nav = typeof navigator !== "undefined" ? navigator : {};
  const jedra = nav.hardwareConcurrency || 4;
  const pomnilnik = nav.deviceMemory || 8; // Safari in Firefox ga ne poznata
  const lahki = nav.connection?.saveData === true;
  if (lahki || naDotik(nav) || jedra < 4 || pomnilnik < 4) return "nizka";
  return "visoka";
}

// Največ slikovnih točk platna (širina × višina v točkah naprave): 12,9-palčni iPad z gostoto 2 bi imel 2732 × 2048 = 5,6 M
// točk, z učinki (HalfFloat, 4× MSAA, GTAO) več kot 500 MB grafičnega pomnilnika. Gostoto zato znižamo, da platno ostane
// pod mejo, nikoli pa pod 1 (pod točko zaslona bi bila slika zamegljena).
export const NAJVEC_TOCK = { visoka: 2.5e6, nizka: 1.6e6 };
// Nad tem številom točk sestavljalnik učinkov (scena.js pripraviAO) riše brez glajenja MSAA (4× pomnilnik).
export const MSAA_DO_TOCK = 2.1e6;
export function locljivostPlatna(gostota, w, h, kakovost = "nizka") {
  const meja = NAJVEC_TOCK[kakovost] || NAJVEC_TOCK.nizka;
  const ploscina = Math.max(1, w) * Math.max(1, h);
  const g = Math.min(gostota, Math.sqrt(meja / ploscina));
  return Math.max(Math.min(1, gostota), Math.floor(g * 100) / 100);
}

// Mapa modelov telesa: podrobni modeli (telo-hd, ~3,5 M trikotnikov, 30 MB) samo na računalniku, sicer telo (telefonski
// nabor, ~1,8 M, 19 MB). Pravilo: kakovost »visoka« (samodejno ali ročna izbira) in naprava brez zaslona na dotik
// (naDotik), vsaj 4 GB pomnilnika (ali neznano) in zaslon vsaj 1024 px po daljši strani. Telefon in tablica vedno telo.
export function mapaTelesa({ kakovost, grobKazalec = false, pomnilnik = null, zaslon = 0, varcno = false } = {}) {
  if (kakovost !== "visoka" || grobKazalec || varcno) return "telo";
  if (pomnilnik != null && pomnilnik < 4) return "telo";
  if (!(zaslon >= 1024)) return "telo";
  return "telo-hd";
}
export function mapaTelesaNaprave(kakovost) {
  const nav = typeof navigator !== "undefined" ? navigator : {};
  const scr = typeof screen !== "undefined" ? screen : {};
  return mapaTelesa({ kakovost, grobKazalec: naDotik(nav), pomnilnik: nav.deviceMemory ?? null, zaslon: Math.max(scr.width || 0, scr.height || 0), varcno: nav.connection?.saveData === true });
}
