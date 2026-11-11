// Pregled žive kontrole odgovorov (server/live-check.js; j 2026-11-04 »nadaljuj kontrolo«): koliko popravkov,
// pregledov in sodb je bilo, koliko so stale, in vsak popravek z vprašanjem učenca, da preverimo,
// ali je bil popravek upravičen (lažni popravek = koda ali pregled je zmotno »popravil« pravilen odgovor).
//   node scripts/pregled-popravkov.js            zadnjih 7 dni
//   node scripts/pregled-popravkov.js --dni 30   --najvec 40
// Baza: data/evklid.db ali EVKLID_DB, samo branje. Brez API, brez stroškov. Šifrirana besedila prebere z
// EVKLID_DATA_KEY samo v pomnilniku (na strežniku je nastavljen; lokalno: node --env-file-if-exists=.env …);
// e-naslovi, telefonske številke, povezave in ime učenca (tudi sklonjeno) se zakrijejo.
import "../server/env.js";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import { BRAND } from "../server/brand.js";
import { messageCode } from "../server/reports.js";
import { openMessage } from "../server/db.js";
import { UNREADABLE } from "../server/crypto-polje.js";

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

// Zakrije osebne podatke in ime učenca (z vsemi skloni: Ana, Ane, Anin …), matematike ne spreminja.
function clean(text, name = "", { head = 500, tail = 0 } = {}) {
  let s = String(text || "")
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[e-naslov]")
    .replace(/https?:\/\/\S+|www\.\S+/g, "[povezava]")
    .replace(/(?<!\d|\d[.,])(?:\+386[\s/-]?|0)\d{1,2}[\s/-]?\d{3}[\s/-]?\d{3,4}(?!\d|[.,]\d)/g, "[telefon]")
    .replace(/\s+/g, " ")
    .trim();
  for (const part of String(name).split(/\s+/).filter((p) => p.length > 1)) {
    const stem = part.length > 2 ? part.replace(/[aeiou]$/i, "") : part;
    const esc = stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    s = s.replace(new RegExp(`(?<![\\p{L}])${esc}\\p{L}{0,4}(?![\\p{L}])`, "giu"), "[ime]");
  }
  if (s.length <= head + tail) return s;
  return tail ? `${s.slice(0, head)} … ${s.slice(-tail)}` : `${s.slice(0, head)} …`;
}

// Popravek je zadnji citat odgovora z naslovom v jeziku učenca (server/live-check.js fixBlock, insertFix).
const FIX_RE = /\n\n> \*\*[\p{L}\p{M}]{2,20}(?: [\p{L}\p{M}]{2,20})?:\*\* /gu;
function fixStart(text) {
  let at = -1;
  for (const m of String(text || "").matchAll(FIX_RE)) at = m.index;
  if (at < 0) return -1;
  // Za njim so samo vrstice citata (META in kartic v besedilu za prikaz ni).
  return text.slice(at + 2).split("\n").every((l) => l.startsWith(">") || !l.trim()) ? at : -1;
}

const kinds = db
  .prepare(
    `SELECT kind, COUNT(*) AS n, COALESCE(SUM(cost_usd),0) AS usd FROM usage
     WHERE kind IN ('chat','boost','popravek','preverjanje','preverjanje-sola','sodba') AND created_at >= datetime('now', ?) GROUP BY kind`,
  )
  .all(since);
const by = Object.fromEntries(kinds.map((k) => [k.kind, k]));
const fmt = (k) => `${by[k]?.n || 0} (${(by[k]?.usd || 0).toFixed(3)} $)`;
const answers = (by.chat?.n || 0) + (by.boost?.n || 0);
console.log(`Živa kontrola, zadnjih ${DAYS} dni (UTC):`);
console.log(`  odgovori inštruktorja ${answers} (${(((by.chat?.usd || 0) + (by.boost?.usd || 0))).toFixed(3)} $)`);
// Klic popravka je zapisan tudi, ko model odgovori »OK« (brez popravka) in ob ponovnem odgovoru po napačni sodbi.
console.log(`  klici popravka ${fmt("popravek")} · pregledi s Sonnetom ${fmt("preverjanje")} · pri SŠ/OŠ ${fmt("preverjanje-sola")} · pregledi sodb ${fmt("sodba")}`);

// Odgovori z vidnim popravkom (»Popravek:« v besedilu za prikaz) in vprašanje učenca pred njimi.
const rows = db
  .prepare(
    `SELECT m.*, s.name AS student_name FROM messages m JOIN conversations c ON c.id = m.conversation_id
     LEFT JOIN students s ON s.id = c.student_id
     WHERE m.role = 'assistant' AND m.created_at >= datetime('now', ?) ORDER BY m.id DESC`,
  )
  .all(since);
const found = [];
let unreadable = 0;
for (const r of rows) {
  const m = openMessage(r);
  if (m.display_text === UNREADABLE) unreadable++;
  const at = fixStart(m.display_text);
  if (at >= 0) found.push({ m, at, name: r.student_name || "" });
}
if (unreadable) console.log(`\nPOZOR: ${unreadable} odgovorov ni mogoče prebrati (manjka EVKLID_DATA_KEY), zato štetje ni popolno.`);
console.log(`\nOdgovori z vidnim popravkom: ${found.length}${answers ? ` (${((found.length / answers) * 100).toFixed(1)} % odgovorov)` : ""}${found.length > MAX ? `, prikazanih ${MAX} (več z --najvec)` : ""}`);
for (const { m, at, name } of found.slice(0, MAX)) {
  const q = db.prepare("SELECT * FROM messages WHERE conversation_id = ? AND id < ? AND role = 'user' ORDER BY id DESC LIMIT 1").get(m.conversation_id, m.id);
  const text = m.display_text;
  console.log(`\n=== ${messageCode(m.id)} · ${m.created_at} UTC ===`);
  console.log(`Učenec: ${q ? clean(openMessage(q).display_text, name, { head: 400 }) : "(ni vprašanja)"}`);
  // Začetek in konec odgovora: napačen rezultat je navadno na koncu.
  console.log(`Odgovor: ${clean(text.slice(0, at), name, { head: 250, tail: 600 })}`);
  console.log(`POPRAVEK: ${clean(text.slice(at).replace(/^>\s?/gm, ""), name, { head: 500 })}`);
}
console.log("\nKoda (#…) odpre cel pogovor: node scripts/najdi-sporocilo.js \"#koda\"");
