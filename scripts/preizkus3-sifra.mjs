// Šifrirane naloge Preizkusa 3 (j 18. 11. 2026: besedila nalog ne smejo biti javna, repozitorij je javen).
// scripts/preizkus3-naloge.enc = JSON {"oblika": "evklid-preizkus3-enc", "v": 1, "alg": "aes-256-gcm", "iv", "tag",
// "data"} (base64). Ključ: 32 bajtov v base64, okolje PREIZKUS3_KLJUC (skrivnost v GitHubu, ne v repozitoriju). Glava
// (oblika, v, alg) je dodatni overjeni podatek (AAD): sprememba glave, šifre ali oznake pade pri odšifriranju.
// Šifriranje (lokalno, iz besedila, ki ni v repozitoriju):
//   PREIZKUS3_KLJUC=… node scripts/preizkus3-sifra.mjs --sifriraj <naloge.json> scripts/preizkus3-naloge.enc
import crypto from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

export const OBLIKA = "evklid-preizkus3-enc";
export const RAZLICICA = 1;
const ALG = "aes-256-gcm";
const aad = (v) => Buffer.from(`${OBLIKA}:${v}:${ALG}`, "utf8");

export function kljucIz(b64) {
  const k = Buffer.from(String(b64 || "").trim(), "base64");
  if (k.length !== 32) throw new Error("PREIZKUS3_KLJUC mora biti 32 bajtov v base64.");
  return k;
}

export function sifriraj(besedilo, kljuc) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv(ALG, kljuc, iv);
  c.setAAD(aad(RAZLICICA));
  const data = Buffer.concat([c.update(Buffer.from(besedilo, "utf8")), c.final()]);
  return JSON.stringify({ oblika: OBLIKA, v: RAZLICICA, alg: ALG, iv: iv.toString("base64"), tag: c.getAuthTag().toString("base64"), data: data.toString("base64") }) + "\n";
}

export function odsifriraj(enc, kljuc) {
  const o = JSON.parse(enc);
  if (o.oblika !== OBLIKA || o.v !== RAZLICICA || o.alg !== ALG) throw new Error(`Neznana oblika šifrirane datoteke (${o.oblika} v${o.v} ${o.alg}).`);
  const d = crypto.createDecipheriv(ALG, kljuc, Buffer.from(o.iv, "base64"));
  d.setAAD(aad(o.v));
  d.setAuthTag(Buffer.from(o.tag, "base64"));
  try {
    return Buffer.concat([d.update(Buffer.from(o.data, "base64")), d.final()]).toString("utf8");
  } catch {
    throw new Error("Odšifriranje ni uspelo (napačen ključ PREIZKUS3_KLJUC ali spremenjena datoteka).");
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [ukaz, vhod, izhod] = process.argv.slice(2);
  if (ukaz !== "--sifriraj" || !vhod || !izhod) {
    console.error("Uporaba: PREIZKUS3_KLJUC=… node scripts/preizkus3-sifra.mjs --sifriraj <naloge.json> <izhod.enc>");
    process.exit(1);
  }
  const besedilo = fs.readFileSync(vhod, "utf8");
  JSON.parse(besedilo); // le veljaven JSON
  fs.writeFileSync(izhod, sifriraj(besedilo, kljucIz(process.env.PREIZKUS3_KLJUC)));
  console.log(`Zapisano: ${izhod}`);
}
