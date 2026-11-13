// Ob neljubem dogodku (docs/krizni-nacrt.md): poišče sporočilo inštruktorja po kodi s posnetka zaslona
// ali po delu besedila in izpiše pogovor okoli njega, oznake (unsafe, distress …) in prijave napak.
//   node scripts/najdi-sporocilo.js "#00YA"          koda pod odgovorom
//   node scripts/najdi-sporocilo.js --besedilo "7 · 8 = 54"
//   node scripts/najdi-sporocilo.js --prijave         zadnje prijave napak
//   node scripts/najdi-sporocilo.js --odstrani "#00YA"  odstrani odgovor iz predpomnilnika (edina sprememba)
// Baza: data/evklid.db ali EVKLID_DB. Brez API, brez stroškov. Šifrirana besedila prebere z EVKLID_DATA_KEY.
import "../server/env.js";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import { BRAND } from "../server/brand.js";
import { messageCode, parseMessageCode, purgeCachedAnswer, openReport } from "../server/reports.js";
import { openMessage } from "../server/db.js";
import { unseal } from "../server/crypto-polje.js";

const file = process.env.EVKLID_DB || `data/${BRAND.slug}.db`;
if (!fs.existsSync(file)) {
  console.log(`Ni baze ${file}. Zaženi ukaz v mapi, kjer teče Evklid.`);
  process.exit(1);
}
const args = process.argv.slice(2);
const db = new DatabaseSync(file, { readOnly: args[0] !== "--odstrani" });
const hasTable = (t) => !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(t);
const cut = (s, n = 600) => (s.length > n ? `${s.slice(0, n)} …` : s);

function show(id) {
  const row = db.prepare("SELECT * FROM messages WHERE id = ?").get(id);
  const m = row && openMessage(row);
  if (!m) return console.log(`Sporočilo ${messageCode(id)} (id ${id}) ne obstaja. Posnetek je morda ponarejen ali iz druge baze.`);
  const conv = db.prepare("SELECT * FROM conversations WHERE id = ?").get(m.conversation_id);
  if (conv) conv.title = unseal(conv.title);
  console.log(`\n=== ${messageCode(id)} · sporočilo ${id} · pogovor ${m.conversation_id} »${conv?.title ?? ""}« · učenec ${conv?.student_id ?? "?"} · ${m.created_at} UTC ===`);
  const around = db.prepare("SELECT * FROM messages WHERE conversation_id = ? AND id BETWEEN ? AND ? ORDER BY id").all(m.conversation_id, id - 6, id + 1).map(openMessage);
  for (const x of around) console.log(`\n${x.id === id ? ">>" : "  "} [${x.role === "user" ? "učenec" : "inštruktor"} ${messageCode(x.id)}] ${cut(x.display_text, x.id === id ? 4000 : 600)}`);
  const ev = db.prepare("SELECT subject, topic, error, mode, flag FROM events WHERE message_id = ?").get(id);
  if (ev) console.log(`\nMETA: predmet ${ev.subject}, tema ${ev.topic}, napaka ${ev.error}, način ${ev.mode}, oznaka ${ev.flag}`);
  const raw = m.api_content.find?.((b) => b.type === "text")?.text || "";
  if (hasTable("answer_cache")) {
    const name = db.prepare("SELECT name FROM students WHERE id = ?").get(conv?.student_id ?? -1)?.name || "";
    const generic = name.length > 1 ? raw.replaceAll(name, "{{IME}}") : raw;
    const hit = db.prepare("SELECT key, hits, created_at FROM answer_cache WHERE text IN (?, ?)").get(raw, generic);
    if (hit) console.log(`\nPOZOR: odgovor je v predpomnilniku (ponovno uporabljen ${hit.hits}×, od ${hit.created_at}). Prijava ali izbris iz answer_cache ga odstrani.`);
  }
  if (hasTable("message_reports")) {
    const r = openReport(db.prepare("SELECT reason, note, purged, created_at FROM message_reports WHERE message_id = ?").get(id));
    if (r) console.log(`\nPrijavljeno ${r.created_at}: ${r.reason}${r.note ? ` – ${r.note}` : ""} (izbrisano iz predpomnilnika: ${r.purged})`);
  }
}

if (args[0] === "--prijave") {
  const rows = hasTable("message_reports") ? db.prepare("SELECT * FROM message_reports ORDER BY id DESC LIMIT 50").all().map(openReport) : [];
  if (!rows.length) console.log("Ni prijav napak.");
  for (const r of rows) console.log(`${r.created_at}  ${messageCode(r.message_id)}  ${r.reason.padEnd(6)}  ${cut((r.note ? `${r.note} | ` : "") + r.answer.replace(/\s+/g, " "), 140)}`);
} else if (args[0] === "--odstrani" && parseMessageCode(args[1])) {
  const m = db.prepare("SELECT m.api_content, s.name FROM messages m JOIN conversations c ON c.id = m.conversation_id LEFT JOIN students s ON s.id = c.student_id WHERE m.id = ?").get(parseMessageCode(args[1]));
  if (!m) console.log("Sporočilo ne obstaja.");
  else {
    const raw = openMessage(m).api_content.find?.((b) => b.type === "text")?.text || "";
    const n = hasTable("answer_cache") ? purgeCachedAnswer(db, raw, m.name || "") : 0;
    console.log(n ? `Odstranjeno iz predpomnilnika (${n}). Tega odgovora ne dobi nihče več.` : "Odgovora ni v predpomnilniku.");
  }
} else if (args[0] === "--besedilo" && args[1]) {
  // Besedilo je lahko šifrirano: preiščemo zadnjih 20 000 odgovorov v JS (SQL LIKE ga ne vidi).
  const rows = [];
  for (const r of db.prepare("SELECT id, display_text FROM messages WHERE role = 'assistant' ORDER BY id DESC LIMIT 20000").iterate()) {
    if (unseal(r.display_text).includes(args[1])) rows.push(r);
    if (rows.length >= 5) break;
  }
  if (!rows.length) console.log("Nobeno sporočilo inštruktorja ne vsebuje tega besedila.");
  for (const r of rows) show(r.id);
} else {
  const id = parseMessageCode(args[0]);
  if (!id) {
    console.log('Uporaba: node scripts/najdi-sporocilo.js "#00YA" | --besedilo "…" | --prijave | --odstrani "#00YA"');
    process.exit(1);
  }
  show(id);
}
