#!/usr/bin/env node
// Straža: preveri, ali živo spletišče deluje. Samo branje (GET), brez prijave, brez računov, brez klicev AI.
// Zagon: node scripts/straza.mjs   (okolje: STRAZA_URL = drug naslov, npr. za preizkus; privzeto https://<domena iz brand.json>)
// Vsak preizkus ima 20 s časa; ob napaki en ponovni poskus čez 30 s (Render se lahko po ponovnem zagonu ~1 min prebuja).
// Konec z izhodno kodo 1, če kaj ne deluje: delovni tok v GitHubu pade in lastnik dobi e-pošto (.github/workflows/straza.yml).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const brand = JSON.parse(readFileSync(new URL("../brand.json", import.meta.url), "utf8"));
export const OSNOVA = (process.env.STRAZA_URL || `https://${brand.domain}`).replace(/\/+$/, "");
const ROK_MS = 20_000;
const PAUZA_MS = Number(process.env.STRAZA_PAUZA_MS ?? 30_000);

async function dobi(pot) {
  const r = await fetch(OSNOVA + pot, { signal: AbortSignal.timeout(ROK_MS), headers: { "User-Agent": "evklid-straza" }, redirect: "follow" });
  if (r.status !== 200) throw new Error(`odgovor ${r.status} namesto 200`);
  return r;
}

// Preizkusi: ime (slovensko, za povzetek), pot in funkcija, ki vrže napako, če vsebina ni pravilna.
export const PREIZKUSI = [
  { ime: "Zdravje strežnika (/healthz)", pot: "/healthz", preveri: async (r) => { if ((await r.text()).trim() !== "ok") throw new Error("odgovor ni »ok«"); } },
  {
    ime: "Stanje strežnika (/healthz/stanje)",
    pot: "/healthz/stanje",
    preveri: async (r) => {
      const j = await r.json();
      if (!j.razlicica || !j.id) throw new Error("manjka različica ali id");
      if (j.kopije?.napaka) throw new Error("varnostna kopija baze javlja napako");
      // Točka D4: opozorilo, ko je bil pomnilnik v zadnjih 15 minutah nad 85 % meje (Render ob meji proces ubije).
      const pm = j.pomnilnik;
      if (pm && pm.najvecDelez15min > (pm.opozorilo ?? 85))
        throw new Error(`pomnilnik ${pm.najvecDelez15min} % meje ${pm.mejaMb} MB v zadnjih 15 min (opozorilo nad ${pm.opozorilo ?? 85} %; zdaj ${pm.rssMb} MB)`);
    },
  },
  { ime: "Domača stran", pot: "/", preveri: async (r) => { const t = await r.text(); if (!t.includes("<title>" + brand.name) || !t.includes("zagon.js")) throw new Error("manjka naslov ali zagonski skript"); } },
  { ime: "Skript aplikacije (app.js)", pot: "/app.js", preveri: async (r) => { if ((await r.text()).length < 50_000) throw new Error("datoteka je prekratka"); } },
  { ime: "Podatki 3D atlasa (JSON)", pot: "/3d/atlas-imena.json", preveri: async (r) => { const j = await r.json(); if (!j || typeof j !== "object" || !Object.keys(j).length) throw new Error("prazen JSON"); } },
  { ime: "Javna nastavitev (/api/config)", pot: "/api/config", preveri: async (r) => { const j = await r.json(); if (!j.enums?.subject?.length) throw new Error("manjka seznam predmetov"); } },
];

async function poskusi(p) {
  try {
    await p.preveri(await dobi(p.pot));
    return null;
  } catch (e) {
    return e?.name === "TimeoutError" ? `ni odgovoril v ${ROK_MS / 1000} s` : String(e?.message || e);
  }
}

export async function zazeni(preizkusi = PREIZKUSI, pauzaMs = PAUZA_MS) {
  let napake = [];
  for (let poskus = 1; poskus <= 2; poskus++) {
    const kandidati = poskus === 1 ? preizkusi : napake.map((n) => n.p);
    napake = [];
    for (const p of kandidati) {
      const napaka = await poskusi(p);
      if (napaka) napake.push({ p, napaka });
    }
    if (!napake.length) break;
    if (poskus === 1) {
      console.log(`Neuspešni preizkusi (${napake.length}); ponovni poskus čez ${pauzaMs / 1000} s (strežnik se morda prebuja).`);
      await new Promise((r) => setTimeout(r, pauzaMs));
    }
  }
  return napake;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`Straža: preverjam ${OSNOVA}`);
  const napake = await zazeni();
  if (!napake.length) {
    console.log(`V redu: vseh ${PREIZKUSI.length} preizkusov uspešnih.`);
  } else {
    console.log(`NAPAKA: ${napake.length} od ${PREIZKUSI.length} preizkusov ne uspe na ${OSNOVA}:`);
    for (const { p, napaka } of napake) console.log(`  - ${p.ime} (${p.pot}): ${napaka}`);
    process.exit(1);
  }
}
