// Pregled žive kontrole odgovorov (server/live-check.js; j 2026-11-04 »nadaljuj kontrolo«): koliko popravkov,
// pregledov in sodb je bilo, koliko so stale, in vsak popravek z vprašanjem učenca, da preverimo,
// ali je bil popravek upravičen (lažni popravek = koda ali pregled je zmotno »popravil« pravilen odgovor).
//   node scripts/pregled-popravkov.js            zadnjih 7 dni
//   node scripts/pregled-popravkov.js --dni 30   --najvec 40
// Baza: data/evklid.db ali EVKLID_DB, samo branje. Brez API, brez stroškov. Šifrirana besedila prebere z
// EVKLID_DATA_KEY samo v pomnilniku; e-naslovi, telefonske številke, povezave in ime učenca se zakrijejo.
import "../server/env.js";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import { BRAND } from "../server/brand.js";
import { messageCode } from "../server/reports.js";
import { openMessage } from "../server/db.js";

const file = process.env.EVKLID_DB || `data/${BRAND.slug}.db`;
if (!fs.existsSync(file)) {
  console.log(`Ni baze ${file}. Zaženi ukaz v mapi, kjer teče Evklid.`);
  process.exit(1);
}
const arg = (name, d) => {
  const i = process.argv.indexOf(`--${name}`);
  const v = Number(process.argv[i + 1]);
  return i > 0 && Number.isFinite(v) && v > 0 ? Math.floor(v) : d;
};
const DAYS = arg("dni", 7);
const MAX = arg("najvec", 25);
const db = new DatabaseSync(file, { readOnly: true });
const since = `-${DAYS} days`;

// Zakrije osebne podatke in ime učenca; skrajša besedilo.
function clean(text, name = "", n = 500) {
  let s = String(text || "")
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[e-naslov]")
    .replace(/https?:\/\/\S+|www\.\S+/g, "[povezava]")
    .replace(/(?:\+\d{1,3}[\s/-]?)?(?:\d[\s/-]?){8,}\d/g, "[telefon]")
    .replace(/\s+/g, " ")
    .trim();
  for (const part of String(name).split(/\s+/).filter((p) => p.length > 1)) s = s.replaceAll(part, "[ime]");
  return s.length > n ? `${s.slice(0, n)} …` : s;
}

const kinds = db
  .prepare(
    `SELECT kind, COUNT(*) AS n, COALESCE(SUM(cost_usd),0) AS usd FROM usage
     WHERE kind IN ('chat','popravek','preverjanje','sodba') AND created_at >= datetime('now', ?) GROUP BY kind`,
  )
  .all(since);
const by = Object.fromEntries(kinds.map((k) => [k.kind, k]));
const fmt = (k) => `${by[k]?.n || 0} (${(by[k]?.usd || 0).toFixed(3)} $)`;
console.log(`Živa kontrola, zadnjih ${DAYS} dni (UTC):`);
console.log(`  odgovori inštruktorja ${fmt("chat")}`);
console.log(`  popravki ${fmt("popravek")} · pregledi s Sonnetom ${fmt("preverjanje")} · pregledi sodb ${fmt("sodba")}`);
const chats = by.chat?.n || 0;
if (chats) console.log(`  delež odgovorov s popravkom: ${(((by.popravek?.n || 0) / chats) * 100).toFixed(1)} %`);

// Odgovori z vidnim popravkom (»Popravek:« v besedilu za prikaz) in vprašanje učenca pred njimi.
const rows = db
  .prepare(
    `SELECT m.*, s.name AS student_name FROM messages m JOIN conversations c ON c.id = m.conversation_id
     LEFT JOIN students s ON s.id = c.student_id
     WHERE m.role = 'assistant' AND m.created_at >= datetime('now', ?) ORDER BY m.id DESC`,
  )
  .all(since);
const found = [];
for (const r of rows) {
  const m = openMessage(r);
  if (!/\*\*Popravek:\*\*|^>\s*Popravek:/m.test(m.display_text || "")) continue;
  found.push({ m, name: r.student_name || "" });
  if (found.length >= MAX) break;
}
console.log(`\nOdgovori s popravkom: ${found.length}${found.length >= MAX ? ` (prikazanih prvih ${MAX}, več z --najvec)` : ""}`);
for (const { m, name } of found) {
  const q = db.prepare("SELECT * FROM messages WHERE conversation_id = ? AND id < ? AND role = 'user' ORDER BY id DESC LIMIT 1").get(m.conversation_id, m.id);
  const text = m.display_text;
  const at = text.search(/>\s*\*\*Popravek:\*\*|>\s*Popravek:/);
  console.log(`\n=== ${messageCode(m.id)} · ${m.created_at} UTC ===`);
  console.log(`Učenec: ${q ? clean(openMessage(q).display_text, name, 400) : "(ni vprašanja)"}`);
  console.log(`Odgovor: ${clean(at > 0 ? text.slice(0, at) : text, name, 700)}`);
  if (at >= 0) console.log(`POPRAVEK: ${clean(text.slice(at).replace(/^>\s*/gm, ""), name, 500)}`);
}
console.log("\nKoda (#…) odpre cel pogovor: node scripts/najdi-sporocilo.js \"#koda\"");
