// Popravek datuma rojstva imetnika računa (samo skrbnik, ne samopostrežno):
//   node scripts/popravi-datum-rojstva.js ime@primer.si 1985-04-12
// Uporaba: starš se je zatipkal ali je na njegovi napravi datum vpisal otrok in je račun zato »mladoleten«.
// Pred popravkom skrbnik preveri, da prošnja res prihaja od imetnika (odgovor s tega e-naslova).
// Poženi v mapi aplikacije (Render → Shell). Vsak popravek gre v dnevnik dostopov (actor admin, birth_date_fix),
// brez e-naslova in brez datuma; tudi izpis v konzolo ju ne ponovi.
import "../server/env.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { BRAND } from "../server/brand.js";
import { parseBirthDate, ageOn, MIN_HOLDER_AGE } from "../server/accounts/age.js";
import { audit } from "../server/dnevnik-dostopov.js";

// Vrne { ok } ali { error } (besedilo za skrbnika, brez osebnih podatkov).
export function fixBirthDate(db, email, date, now = new Date()) {
  const b = parseBirthDate(date);
  const age = b ? ageOn(b, now) : null;
  if (age === null || age < MIN_HOLDER_AGE || age > 120) return { error: "Datum ni pravilen (oblika LLLL-MM-DD, starost 5–120 let)." };
  const row = db.prepare("SELECT id FROM parents WHERE lower(email) = lower(?) AND is_guest = 0").get(String(email || "").trim());
  if (!row) return { error: "Računa s tem e-naslovom ni." };
  const iso = `${b.y}-${String(b.m).padStart(2, "0")}-${String(b.d).padStart(2, "0")}`;
  db.prepare("UPDATE parents SET birth_date = ?, birth_asked_at = COALESCE(birth_asked_at, ?) WHERE id = ?").run(iso, now.toISOString(), row.id);
  audit(db, { parentId: row.id, actor: "admin", action: "birth_date_fix" });
  return { ok: true };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [email, date] = process.argv.slice(2);
  if (!email || !email.includes("@") || !date) {
    console.log("Uporaba: node scripts/popravi-datum-rojstva.js ime@primer.si LLLL-MM-DD");
    process.exit(1);
  }
  const file = process.env.EVKLID_DB || `data/${BRAND.slug}.db`;
  if (!fs.existsSync(file)) {
    console.log(`Baze ${file} ni. Poženi v mapi aplikacije oz. nastavi EVKLID_DB.`);
    process.exit(1);
  }
  const db = new DatabaseSync(file);
  db.exec("PRAGMA busy_timeout = 5000"); // strežnik lahko ravno piše (WAL)
  const r = fixBirthDate(db, email, date);
  db.close();
  console.log(r.ok ? "Datum rojstva je popravljen (zapisano v dnevnik dostopov). Imetnik naj osveži aplikacijo." : r.error);
  if (!r.ok) process.exit(1);
}
