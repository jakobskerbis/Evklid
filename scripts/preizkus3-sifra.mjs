// Šifrirane naloge Preizkusa 3 (j 18. 11. 2026: besedila nalog ne smejo biti javna, repozitorij je javen).
// scripts/preizkus3-naloge.enc = JSON {"oblika": "evklid-preizkus3-enc", "v": 1, "alg": "aes-256-gcm", "iv", "tag",
// "data"} (base64). Ključ: 32 bajtov v base64, okolje PREIZKUS3_KLJUC (skrivnost v GitHubu, ne v repozitoriju). Glava
// (oblika, v, alg) je dodatni overjeni podatek (AAD): sprememba glave, šifre ali oznake pade pri odšifriranju.
// Isti ključ šifrira tudi izid meritve (data/meri-preizkus3-vse*.json v artefaktu, j 18. 11.: odgovori pogosto
// navajajo nalogo). Lokalno (iz besedila oziroma artefakta, ki nista v repozitoriju):
//   PREIZKUS3_KLJUC=… node scripts/preizkus3-sifra.mjs --sifriraj <naloge.json> scripts/preizkus3-naloge.enc
//   PREIZKUS3_KLJUC=… node scripts/preizkus3-sifra.mjs --odsifriraj <izid.json> <izhod.json>
import crypto from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

export const OBLIKA = "evklid-preizkus3-enc";
export const RAZLICICA = 1;
const ALG = "aes-256-gcm";
const aad = (v) => Buffer.from(`${OBLIKA}:${v}:${ALG}`, "utf8");

// Natanko 32 bajtov v standardnem base64 (43 znakov in »=«): Buffer.from bi tiho preskočil neveljavne znake.
export function kljucIz(b64) {
  const t = String(b64 || "").trim();
  if (!/^[A-Za-z0-9+/]{43}=$/.test(t)) throw new Error("PREIZKUS3_KLJUC mora biti 32 bajtov v base64 (44 znakov).");
  return Buffer.from(t, "base64");
}
const TAG = 16;
export const jeSifrirano = (besedilo) => {
  try {
    return JSON.parse(besedilo)?.oblika === OBLIKA;
  } catch {
    return false;
  }
};

export function sifriraj(besedilo, kljuc) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv(ALG, kljuc, iv, { authTagLength: TAG });
  c.setAAD(aad(RAZLICICA));
  const data = Buffer.concat([c.update(Buffer.from(besedilo, "utf8")), c.final()]);
  return JSON.stringify({ oblika: OBLIKA, v: RAZLICICA, alg: ALG, iv: iv.toString("base64"), tag: c.getAuthTag().toString("base64"), data: data.toString("base64") }) + "\n";
}

export function odsifriraj(enc, kljuc) {
  const o = JSON.parse(enc);
  if (o.oblika !== OBLIKA || o.v !== RAZLICICA || o.alg !== ALG) throw new Error(`Neznana oblika šifrirane datoteke (${o.oblika} v${o.v} ${o.alg}).`);
  const iv = Buffer.from(String(o.iv), "base64");
  const tag = Buffer.from(String(o.tag), "base64");
  // Krajša oznaka bi oslabila overjanje (GCM sprejme tudi 4–15 bajtov): samo 16 bajtov, IV 12 bajtov.
  if (tag.length !== TAG || iv.length !== 12) throw new Error("Odšifriranje ni uspelo (neveljavna dolžina oznake ali IV).");
  const d = crypto.createDecipheriv(ALG, kljuc, iv, { authTagLength: TAG });
  d.setAAD(aad(o.v));
  d.setAuthTag(tag);
  try {
    return Buffer.concat([d.update(Buffer.from(o.data, "base64")), d.final()]).toString("utf8");
  } catch {
    throw new Error("Odšifriranje ni uspelo (napačen ključ PREIZKUS3_KLJUC ali spremenjena datoteka).");
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [ukaz, vhod, izhod] = process.argv.slice(2);
  if (!["--sifriraj", "--odsifriraj"].includes(ukaz) || !vhod || !izhod) {
    console.error("Uporaba: PREIZKUS3_KLJUC=… node scripts/preizkus3-sifra.mjs --sifriraj|--odsifriraj <vhod> <izhod>");
    process.exit(1);
  }
  try {
    const kljuc = kljucIz(process.env.PREIZKUS3_KLJUC);
    const besedilo = fs.readFileSync(vhod, "utf8");
    if (ukaz === "--sifriraj") JSON.parse(besedilo); // le veljaven JSON
    fs.writeFileSync(izhod, ukaz === "--sifriraj" ? sifriraj(besedilo, kljuc) : odsifriraj(besedilo, kljuc));
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  console.log(`Zapisano: ${izhod}`);
}
