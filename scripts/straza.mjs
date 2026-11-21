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

// Stanje strežnika (/healthz/stanje) → { napake, opozorila }. Napaka podre Stražo (GitHub pošlje e-pošto), opozorilo se
// samo izpiše. Stanja, ki trajajo ves dan (strošek AI nad mejo, neuspel nočni preizkus kopije, neuspela e-pošta),
// so napaka samo eno uro po dogodku, nato samo opozorilo (docs/spremljanje.md). GitHub urnik zažene le na ~5–10 ur,
// zato to uro običajno ujame samo zagon po objavi. Strežnik sam pošlje skrbniku e-pošto za strošek AI in preizkus kopije.
export const SVEZE_MS = 60 * 60 * 1000;
export function presojaStanja(j, now = Date.now()) {
  const napake = [];
  const opozorila = [];
  const sveze = (iso) => !iso || now - Date.parse(iso) < SVEZE_MS;
  if (!j.razlicica || !j.id) napake.push("manjka različica ali id");
  if (j.kopije?.napaka) napake.push("varnostna kopija baze javlja napako");
  // Strežnik brez EVKLID_DATA_KEY (zažene se samo z EVKLID_ALLOW_PLAINTEXT=1) shranjuje osebne podatke nešifrirane.
  if (j.sifriranje === false) napake.push("šifriranje osebnih podatkov v bazi je izklopljeno (EVKLID_DATA_KEY ni nastavljen)");
  // Inštruktor v preizkusnem načinu (vnaprej pripravljeni odgovori): v produkciji samo z izrecnim EVKLID_MOCK=1.
  if (j.mock === true) napake.push("inštruktor teče v preizkusnem načinu (EVKLID_MOCK=1 ali brez ANTHROPIC_API_KEY)");
  // Točka D4: opozorilo, ko je bil pomnilnik v zadnjih 30 minutah nad 85 % meje (Render ob meji proces ubije).
  const pm = j.pomnilnik;
  if (pm && pm.najvecDelez > (pm.opozorilo ?? 85))
    napake.push(`pomnilnik ${pm.najvecDelez} % meje ${pm.mejaMb} MB v zadnjih ${pm.oknoMin ?? 30} min (opozorilo nad ${pm.opozorilo ?? 85} %; zdaj ${pm.mb} MB)`);
  // 6. korak priprave na pilot: strošek AI, nočni preizkus kopije, e-pošta.
  if (j.aiStrosek?.nadMejo) {
    if (sveze(j.aiStrosek.od)) napake.push(`strošek AI danes je nad mejo opozorila (od ${j.aiStrosek.od || "zdaj"}; skrbnik dobi e-pošto z zneskom)`);
    else opozorila.push("strošek AI danes je nad mejo opozorila (že javljeno)");
  }
  const pk = j.preverjanjeKopij;
  if (pk && pk.ok === false && !pk.prehodna) {
    if (sveze(pk.ob)) napake.push(`nočni preizkus obnove iz kopije (${pk.datum}) ni uspel`);
    else opozorila.push(`nočni preizkus obnove iz kopije (${pk.datum}) ni uspel (že javljeno)`);
  }
  // E-pošta: zadnje pošiljanje ni uspelo zaradi Resenda ali omrežja (ne zaradi enega napačnega naslova).
  const po = j.posta;
  if (po?.nastavljena && po.zadnjaNapaka && (!po.zadnjiUspeh || po.zadnjaNapaka > po.zadnjiUspeh) && /^(omrežje|401|403|429|5\d\d)/.test(po.razlog || "")) {
    if (sveze(po.zadnjaNapaka)) napake.push(`e-pošta (Resend) ne gre ven: ${po.razlog}`);
    else opozorila.push(`zadnje pošiljanje e-pošte ni uspelo (${po.razlog})`);
  }
  // Zdravje strežnika (server/zdravje.js): inštruktor AI ne dela, disk skoraj poln, nepričakovan ponovni zagon v zadnji uri.
  if (j.ai?.deluje === false) napake.push(`inštruktor AI ne dela (zadnja napaka: ${j.ai.vrsta}, zaporednih ${j.ai.zapored}; skrbnik dobi e-pošto)`);
  if (j.disk && j.disk.delez >= j.disk.opozorilo) napake.push(`disk z bazo je zaseden ${j.disk.delez} % (prosto ${j.disk.prostoMb} MB)`);
  if (j.zagoni?.zadnji && sveze(j.zagoni.zadnji)) napake.push(`strežnik se je nepričakovano znova zagnal ob ${j.zagoni.zadnji} (${j.zagoni.razlog})`);
  if (j.pdfUcbenika?.napaka) opozorila.push(`PDF učbenika: ${j.pdfUcbenika.napaka} (aplikacija ponudi tiskanje)`);
  if (j.kopije && !j.kopijeZunaj) opozorila.push("kopija baze zunaj Renderja (R2) ni nastavljena");
  return { napake, opozorila };
}
export const OPOZORILA = [];

// Preizkusi: ime (slovensko, za povzetek), pot in funkcija, ki vrže napako, če vsebina ni pravilna.
export const PREIZKUSI = [
  { ime: "Zdravje strežnika (/healthz)", pot: "/healthz", preveri: async (r) => { if ((await r.text()).trim() !== "ok") throw new Error("odgovor ni »ok«"); } },
  {
    ime: "Stanje strežnika (/healthz/stanje)",
    pot: "/healthz/stanje",
    preveri: async (r) => {
      const { napake, opozorila } = presojaStanja(await r.json());
      OPOZORILA.splice(0, OPOZORILA.length, ...opozorila);
      if (napake.length) throw new Error(napake.join("; "));
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
  for (const o of OPOZORILA) console.log(`Opozorilo: ${o}`);
  if (!napake.length) {
    console.log(`V redu: vseh ${PREIZKUSI.length} preizkusov uspešnih.`);
  } else {
    console.log(`NAPAKA: ${napake.length} od ${PREIZKUSI.length} preizkusov ne uspe na ${OSNOVA}:`);
    for (const { p, napaka } of napake) console.log(`  - ${p.ime} (${p.pot}): ${napaka}`);
    process.exit(1);
  }
}
