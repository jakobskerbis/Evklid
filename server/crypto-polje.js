// Šifriranje osebnih polj v bazi (AES-256-GCM, node:crypto). Pregled: docs/varnost-podatkov.md.
// Zapis: enc1:<keyId>:<base64(iv 12 B | tag 16 B | šifrirano)>; keyId = prvih 8 hex sha256(ključa).
// Ključ: EVKLID_DATA_KEY (base64, 32 bajtov). Stari ključi za menjavo: EVKLID_DATA_KEYS_OLD="id:ključ,id:ključ"
// (id je lahko tudi poljuben, ključ se prepozna po svojem keyId). Brez ključa ostane besedilo nešifrirano
// (razvoj, testi, preizkusni način). Neberljiv zapis vrne nadomestno besedilo, strežnik se ne ustavi.
import crypto from "node:crypto";

export const PREFIX = "enc1:";
export const UNREADABLE = "[Tega besedila ni mogoče prebrati (manjka ključ za šifriranje).]";

const keyIdOf = (key) => crypto.createHash("sha256").update(key).digest("hex").slice(0, 8);

function parseKey(b64, name) {
  const key = Buffer.from(String(b64).trim(), "base64");
  if (key.length !== 32) throw new Error(`${name} mora biti 32 bajtov v base64 (node scripts/kljuc-podatkov.js).`);
  return key;
}

let cache = { sig: null, state: null };
// Ključi se preberejo iz okolja ob prvi uporabi (in znova, če se okolje spremeni – testi).
function keys() {
  const cur = process.env.EVKLID_DATA_KEY || "";
  const old = process.env.EVKLID_DATA_KEYS_OLD || "";
  const sig = `${cur}\n${old}`;
  if (cache.sig === sig) return cache.state;
  let state = null;
  if (cur) {
    const key = parseKey(cur, "EVKLID_DATA_KEY");
    const all = new Map([[keyIdOf(key), key]]);
    for (const part of old.split(",").map((s) => s.trim()).filter(Boolean)) {
      const k = parseKey(part.includes(":") ? part.slice(part.indexOf(":") + 1) : part, "EVKLID_DATA_KEYS_OLD");
      all.set(keyIdOf(k), k);
    }
    state = { id: keyIdOf(key), key, all };
  }
  cache = { sig, state };
  return state;
}

// Ključ za kopije baze zunaj strežnika (server/kopije-oblak.js), izpeljan iz EVKLID_DATA_KEY (HKDF), da ni
// nove skrivnosti. id = keyId ključa podatkov (tudi starega iz EVKLID_DATA_KEYS_OLD); brez id sedanji. Brez ključa null.
export function backupKey(id = null) {
  const k = keys();
  const raw = k ? (id ? k.all.get(id) : k.key) : null;
  if (!raw) return null;
  return { id: id || k.id, key: Buffer.from(crypto.hkdfSync("sha256", raw, Buffer.alloc(0), "baza-kopija-v1", 32)) };
}

export const encryptionOn = () => !!keys();
export const currentKeyId = () => keys()?.id ?? null;
export const isEncrypted = (v) => typeof v === "string" && v.startsWith(PREFIX);
// keyId šifriranega zapisa (ali null).
export const keyIdOfValue = (v) => (isEncrypted(v) ? v.slice(PREFIX.length, PREFIX.length + 8) : null);

// Zašifrira besedilo (null in undefined ostaneta). Brez ključa vrne besedilo nespremenjeno.
export function seal(text) {
  if (text === null || text === undefined) return text;
  const k = keys();
  const s = String(text);
  if (!k || isEncrypted(s)) return s;
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", k.key, iv);
  const body = Buffer.concat([c.update(s, "utf8"), c.final()]);
  return `${PREFIX}${k.id}:${Buffer.concat([iv, c.getAuthTag(), body]).toString("base64")}`;
}

// Odšifrira; nešifrirano besedilo vrne, kot je. Ob napaki vrne `fallback` (privzeto UNREADABLE).
export function unseal(value, fallback = UNREADABLE) {
  if (!isEncrypted(value)) return value;
  try {
    const id = value.slice(PREFIX.length, PREFIX.length + 8);
    const key = keys()?.all.get(id);
    if (!key || value[PREFIX.length + 8] !== ":") return fallback;
    const raw = Buffer.from(value.slice(PREFIX.length + 9), "base64");
    if (raw.length < 28) return fallback;
    const d = crypto.createDecipheriv("aes-256-gcm", key, raw.subarray(0, 12));
    d.setAuthTag(raw.subarray(12, 28));
    return Buffer.concat([d.update(raw.subarray(28)), d.final()]).toString("utf8");
  } catch {
    return fallback;
  }
}

// Ali je zapis berljiv s trenutnimi ključi (za --preveri).
export function canOpen(value) {
  if (!isEncrypted(value)) return true;
  return unseal(value, null) !== null;
}

// JSON polje: zašifriran niz JSON; ob neberljivem zapisu vrne `fallback`.
export const sealJson = (obj) => seal(JSON.stringify(obj));
export function unsealJson(value, fallback) {
  const s = unseal(value, null);
  if (s === null) return fallback;
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

// Slepi indeks (za UNIQUE/iskanje enakih vrednosti brez razkritja besedila): HMAC s ključem, izpeljanim iz
// EVKLID_DATA_KEY. Brez ključa vrne vrednost nespremenjeno.
export function blindIndex(text) {
  const k = keys();
  if (!k) return text;
  const sub = crypto.createHmac("sha256", k.key).update("evklid-indeks").digest();
  return `h1:${k.id}:${crypto.createHmac("sha256", sub).update(String(text)).digest("base64url").slice(0, 32)}`;
}

// Skrivnost za HMAC naslovov IP v dnevniku dostopov: iz ključa podatkov ali naključna, shranjena v bazi.
export function auditSecret(db) {
  const k = keys();
  if (k) return crypto.createHmac("sha256", k.key).update("evklid-dnevnik").digest();
  db.exec("CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL)");
  let v = db.prepare("SELECT value FROM kv WHERE key = 'audit_secret'").get()?.value;
  if (!v) {
    v = crypto.randomBytes(32).toString("base64");
    db.prepare("INSERT OR IGNORE INTO kv (key, value) VALUES ('audit_secret', ?)").run(v);
    v = db.prepare("SELECT value FROM kv WHERE key = 'audit_secret'").get().value;
  }
  return Buffer.from(v, "base64");
}

export const newKey = () => crypto.randomBytes(32).toString("base64");

// Opozorilo ob zagonu v produkciji brez ključa (enkrat).
let warned = false;
export function warnIfNoKey(log = console) {
  if (warned || keys()) return;
  const prod = process.env.NODE_ENV === "production" || /^https:/i.test(process.env.EVKLID_BASE_URL || "");
  if (!prod) return;
  warned = true;
  log.warn?.("[evklid] OPOZORILO: EVKLID_DATA_KEY ni nastavljen, pogovori se v bazi shranjujejo nešifrirani (docs/varnost-podatkov.md).");
}

// Šifrirani stolpci. Nešifrirano ostane, kar SQL uporablja za iskanje ali je skupno vsem (glej dokument):
// students.name (iskanje podvojenih), answer_cache (skupni, brez osebnih podatkov), knowledge_items (samo id-ji predmetov).
export const SEALED = [
  { table: "messages", cols: ["api_content", "display_text"] },
  { table: "conversations", cols: ["title"] },
  { table: "conversation_summaries", cols: ["text"] },
  { table: "message_reports", cols: ["note", "question", "answer", "raw", "shown"] },
  { table: "bug_reports", cols: ["note", "context"] },
  { table: "feedback", cols: ["name", "good", "bad", "ideas", "interview"] },
  { table: "schedules", cols: ["data"] },
  // norm (za UNIQUE) postane slepi indeks HMAC, sicer bi razkril vprašanje s kartice.
  { table: "flashcards", cols: ["front", "back"], norm: true },
  // Naloge za člane pilota (server/pilot-naloge.js): opombe, prepis naloge, fotografija (samo ob soglasju).
  { table: "pilot_scans", cols: ["note", "problems"] },
  { table: "pilot_features", cols: ["note"] },
  { table: "pilot_photos", cols: ["image"] },
  // Mnenja članov pilota (server/pilot-mnenja.js): prosto besedilo učenca.
  { table: "pilot_mnenja", cols: ["liked", "bothers"] },
  // Učenčevi zapiski (server/zapiski.js): naslov in prepis rokopisa.
  { table: "zapiski", cols: ["naslov", "prepis"] },
];

const hasTable = (db, t) => !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(t);
const hasCol = (db, t, c) => db.prepare(`PRAGMA table_info(${t})`).all().some((x) => x.name === c);

// Koliko vrstic je šifriranih, nešifriranih in neberljivih (scripts/kljuc-podatkov.js --preveri).
export function encryptionStats(db) {
  const out = [];
  for (const t of SEALED) {
    if (!hasTable(db, t.table)) continue;
    for (const c of t.cols.filter((x) => hasCol(db, t.table, x))) {
      const s = { table: t.table, col: c, encrypted: 0, plain: 0, unreadable: 0, oldKey: 0 };
      const cur = currentKeyId();
      for (const r of db.prepare(`SELECT ${c} AS v FROM ${t.table} WHERE ${c} IS NOT NULL`).iterate()) {
        if (!isEncrypted(r.v)) s.plain++;
        else if (!canOpen(r.v)) s.unreadable++;
        else {
          s.encrypted++;
          if (cur && !r.v.startsWith(`enc1:${cur}:`)) s.oldKey++;
        }
      }
      out.push(s);
    }
  }
  return out;
}
