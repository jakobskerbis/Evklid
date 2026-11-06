// Enkraten pregled imen razredov in skupin prijateljev, ki so že v bazi (pred PR #491): imena s kontakti
// (e-naslov, telefon, povezava, profil na omrežjih; public/ime-skupine.js). Samo bere in izpiše; nič ne spremeni.
//   node scripts/imena-skupin.js            # izpis
//   node scripts/imena-skupin.js --json     # za nadaljnjo obdelavo
// Na Render: Shell, v mapi aplikacije (EVKLID_DB). Kaj z zadetki (preimenovati v »Skupina«, izbrisati), odloči skrbnik.
import "../server/env.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { BRAND } from "../server/brand.js";
import { nameHasContact } from "../public/ime-skupine.js";

export function contactNames(db) {
  // Baza brez tabel razredov (stara ali prazna): ni imen.
  if (db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name IN ('classes', 'class_members')").all().length < 2) return [];
  return db
    .prepare("SELECT id, kind, code, name, (SELECT COUNT(*) FROM class_members m WHERE m.class_id = classes.id) AS members FROM classes ORDER BY id")
    .all()
    .filter((r) => nameHasContact(r.name));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const file = process.env.EVKLID_DB || `data/${BRAND.slug}.db`;
  if (!fs.existsSync(file)) {
    console.log(`Baze ${file} ni. Poženi v mapi aplikacije oz. nastavi EVKLID_DB.`);
    process.exit(1);
  }
  const db = new DatabaseSync(file, { readOnly: true });
  db.exec("PRAGMA busy_timeout = 5000");
  const rows = contactNames(db);
  db.close();
  if (process.argv.includes("--json")) console.log(JSON.stringify(rows, null, 2));
  else if (!rows.length) console.log("Nobeno ime razreda ali skupine ne vsebuje kontakta.");
  else {
    console.log(`Imena s kontaktom: ${rows.length}`);
    for (const r of rows) console.log(`#${r.id} ${r.kind} ${r.code} (${r.members} članov): ${JSON.stringify(r.name)}`);
  }
}
