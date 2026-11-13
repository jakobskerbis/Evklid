// Dnevnik dostopov (server/dnevnik-dostopov.js): prijave, izvozi, izbrisi, gesla, dejanja skrbnika in učiteljev.
//   node scripts/dnevnik-dostopov.js               zadnjih 200 zapisov
//   node scripts/dnevnik-dostopov.js ana@primer.si zapisi tega računa
// Naslovi IP so zgoščeni (ip_hash): enaka vrednost pomeni isti naslov, naslova samega ni mogoče prebrati.
import "../server/env.js";
import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { BRAND } from "../server/brand.js";
import { auditFor } from "../server/dnevnik-dostopov.js";

const file = process.env.EVKLID_DB || `data/${BRAND.slug}.db`;
if (!fs.existsSync(file)) {
  console.log(`Ni baze ${file}.`);
  process.exit(1);
}
const db = new DatabaseSync(file);
const email = process.argv[2];
let parentId;
if (email) {
  parentId = db.prepare("SELECT id FROM parents WHERE email = ?").get(email.trim())?.id;
  if (!parentId) {
    console.log("Računa s tem e-naslovom ni (ali je bil izbrisan; zapisi izbrisanih računov nimajo povezave).");
    process.exit(1);
  }
}
const rows = auditFor(db, parentId);
if (!rows.length) console.log("Ni zapisov.");
for (const r of rows.reverse()) {
  console.log(`${r.at} UTC  ${r.ok ? "  " : "✗ "}${r.actor.padEnd(7)} ${r.action.padEnd(22)} ${(r.target || "").padEnd(16)} račun ${r.parent_id ?? "–"}  ip ${r.ip_hash || "–"}`);
}
