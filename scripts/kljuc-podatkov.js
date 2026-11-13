// Ključ za šifriranje osebnih podatkov v bazi (docs/varnost-podatkov.md).
//   node scripts/kljuc-podatkov.js            izpiše nov naključni ključ za EVKLID_DATA_KEY (v Render → Environment)
//   node scripts/kljuc-podatkov.js --preveri  koliko vrstic je šifriranih, nešifriranih in neberljivih
//   node scripts/kljuc-podatkov.js --sifriraj zašifrira preostale vrstice zdaj (sicer to naredi strežnik ob zagonu)
// Baza: data/evklid.db ali EVKLID_DB; ključ iz EVKLID_DATA_KEY (in EVKLID_DATA_KEYS_OLD).
import "../server/env.js";
import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { BRAND } from "../server/brand.js";
import { newKey, currentKeyId } from "../server/crypto-polje.js";
import { encryptionStats, migrateEncryption } from "../server/zasebnost.js";

const arg = process.argv[2];
if (!arg) {
  const key = newKey();
  console.log(key);
  console.error(
    "\nTo je nov ključ. Shrani ga v upravitelj gesel (brez njega so pogovori v bazi izgubljeni)\n" +
      "in ga vpiši v Render → Environment kot EVKLID_DATA_KEY. Ključa ne pošiljaj po e-pošti ali v klepet.",
  );
  process.exit(0);
}
const file = process.env.EVKLID_DB || `data/${BRAND.slug}.db`;
if (!fs.existsSync(file)) {
  console.log(`Ni baze ${file}.`);
  process.exit(1);
}
if (arg === "--sifriraj") {
  if (!currentKeyId()) {
    console.log("EVKLID_DATA_KEY ni nastavljen.");
    process.exit(1);
  }
  console.log(migrateEncryption(new DatabaseSync(file)));
  process.exit(0);
}
if (arg !== "--preveri") {
  console.log("Uporaba: node scripts/kljuc-podatkov.js [--preveri | --sifriraj]");
  process.exit(1);
}
const db = new DatabaseSync(file, { readOnly: true });
console.log(`Ključ: ${currentKeyId() ? `nastavljen (id ${currentKeyId()})` : "NI nastavljen"}`);
let bad = 0;
for (const s of encryptionStats(db)) {
  bad += s.unreadable;
  console.log(`${`${s.table}.${s.col}`.padEnd(28)} šifrirano ${String(s.encrypted).padStart(6)}  nešifrirano ${String(s.plain).padStart(6)}  neberljivo ${String(s.unreadable).padStart(4)}${s.oldKey ? `  s starim ključem ${s.oldKey}` : ""}`);
}
if (bad) console.log("\nNeberljive vrstice: manjka ključ, s katerim so bile šifrirane (EVKLID_DATA_KEYS_OLD).");
