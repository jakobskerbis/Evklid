// Varstvo podatkov učencev (docs/varnost-podatkov.md): šifriranje obstoječih vrstic ob zagonu,
// roki hrambe in dnevno čiščenje. Šifriranje polj: server/crypto-polje.js.
import { seal, unseal, isEncrypted, currentKeyId, encryptionOn, canOpen, blindIndex, warnIfNoKey } from "./crypto-polje.js";
import { normCard } from "./flashcards.js";
import { audit, ensureAuditTable } from "./dnevnik-dostopov.js";

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
];

// --- roki hrambe (vse na enem mestu) ---
const days = (v, d) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : d);
export const RETENTION = {
  // Fotografije nalog v pogovorih: po toliko dneh ostane le opomba (besedilo pogovora ostane).
  imageDays: () => days(process.env.EVKLID_IMAGE_DAYS, 7),
  // Dnevnik dostopov: eno leto (varnostna sled za morebitne incidente).
  auditDays: 365,
  // Dnevnik poslanih e-poštnih sporočil (samo za preprečevanje dvojnega pošiljanja): eno leto.
  emailLogDays: 365,
  // Dnevnik obvestil na telefon (enako): 90 dni.
  pushLogDays: 90,
  // Račun, ki e-naslova ni potrdil v toliko dneh in nima profilov, plačil ali seje, se izbriše.
  unverifiedDays: 30,
  // Soglasje plačnika ob nakupu (billing_consents, z e-naslovom plačnika) po izbrisu računa: dokaz soglasja.
  // ROK ODLOČI j (iskalec napak N2, predlog 5 let = 1826 dni); null = ne briši (stanje pred odločitvijo).
  billingConsentDays: null,
  // Potekle seje in odklepi profilov se izbrišejo takoj (niso več veljavni).
};

export const imageGoneText = (n = RETENTION.imageDays()) => `[Fotografija je bila po ${n} dneh izbrisana zaradi varstva podatkov.]`;
export const PHOTO_REJECTED_TEXT = "[Fotografija ni bila shranjena, ker ni povezana z učenjem.]";

const hasTable = (db, t) => !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(t);
const hasCol = (db, t, c) => db.prepare(`PRAGMA table_info(${t})`).all().some((x) => x.name === c);

// Zamenja slikovne bloke v vsebini sporočila z besedilom. Vrne null, če slike ni.
export function withoutImages(content, text) {
  if (!Array.isArray(content) || !content.some((b) => b?.type === "image")) return null;
  return content.map((b) => (b?.type === "image" ? { type: "text", text } : b));
}

// --- šifriranje obstoječih vrstic ---
// Zašifrira nešifrirane vrstice in znova zašifrira tiste s starim ključem. Idempotentno, ena transakcija na paket.
// Neberljive vrstice (neznan ključ) pusti pri miru. Vrne { [tabela]: število spremenjenih }.
const BATCH_BYTES = 8 * 1024 * 1024;
export function* encryptionSteps(db, batch = 200) {
  const cur = currentKeyId();
  if (!cur) return;
  const fresh = `enc1:${cur}:%`;
  for (const t of SEALED) {
    if (!hasTable(db, t.table)) continue;
    const cols = t.cols.filter((c) => hasCol(db, t.table, c));
    const need = cols.map((c) => `(${c} IS NOT NULL AND ${c} NOT LIKE '${fresh}')`);
    if (t.norm) need.push(`norm NOT LIKE 'h1:${cur}:%'`);
    // Najprej samo rowid, vrstice nato ena po ena: sporočila s fotografijo imajo do 7 MB, 200 naenkrat bi na
    // strežniku s 512 MB pomnilnika lahko sprožilo OOM. Paket se konča tudi po ~8 MB besedila (zanka dogodkov).
    const pick = db.prepare(`SELECT rowid AS rid FROM ${t.table} WHERE rowid > ? AND (${need.join(" OR ")}) ORDER BY rowid LIMIT ?`);
    const one = db.prepare(`SELECT ${cols.join(", ")}${t.norm ? ", norm" : ""} FROM ${t.table} WHERE rowid = ?`);
    const upd = db.prepare(`UPDATE ${t.table} SET ${cols.map((c) => `${c} = ?`).join(", ")}${t.norm ? ", norm = ?" : ""} WHERE rowid = ?`);
    let last = 0;
    let changed = 0;
    for (;;) {
      const rows = pick.all(last, batch);
      if (!rows.length) break;
      db.exec("BEGIN IMMEDIATE");
      try {
        let bytes = 0;
        for (const { rid } of rows) {
          if (bytes > BATCH_BYTES) break;
          last = rid;
          const r = { rid, ...one.get(rid) };
          for (const c of cols) bytes += r[c]?.length || 0;
          const plain = cols.map((c) => (r[c] === null ? null : unseal(r[c], null)));
          if (plain.some((v, i) => v === null && r[cols[i]] !== null)) continue; // neberljivo: pusti
          const vals = plain.map((v) => (v === null ? null : seal(v)));
          if (!t.norm) {
            upd.run(...vals, r.rid);
          } else {
            const norm = blindIndex(normCard(plain[0]));
            try {
              upd.run(...vals, norm, r.rid);
            } catch {
              upd.run(...vals, blindIndex(`${normCard(plain[0])}#${r.rid}`), r.rid); // podvojena kartica
            }
          }
          changed++;
        }
        db.exec("COMMIT");
      } catch (e) {
        db.exec("ROLLBACK");
        throw e;
      }
      yield { table: t.table, changed };
    }
  }
}

export function migrateEncryption(db, batch = 200) {
  const out = {};
  for (const s of encryptionSteps(db, batch)) out[s.table] = s.changed;
  return out;
}

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

// --- dnevno čiščenje ---
export function runRetention(db, { now = Date.now(), log = console } = {}) {
  const out = { images: 0, sessions: 0, unlocks: 0, emailLog: 0, pushLog: 0, audit: 0, unverified: 0 };
  const n = RETENTION.imageDays();
  // Fotografije: sporočila s sliko, starejša od n dni (has_image = 2 pomeni, da je slika že odstranjena).
  if (hasTable(db, "messages")) {
    // Samo id-ji, vsebina nato ena po ena (fotografija ima lahko do 7 MB; ob prvem čiščenju jih je veliko).
    const ids = db.prepare("SELECT id FROM messages WHERE has_image = 1 AND created_at < datetime(?, 'unixepoch', ?)").all(Math.floor(now / 1000), `-${n} days`);
    const one = db.prepare("SELECT api_content FROM messages WHERE id = ?");
    const upd = db.prepare("UPDATE messages SET api_content = ?, has_image = 2 WHERE id = ?");
    for (const { id } of ids) {
      const r = { id, api_content: one.get(id)?.api_content };
      if (r.api_content === undefined) continue;
      const plain = unseal(r.api_content, null);
      if (plain === null) continue; // neberljivo (manjka ključ): pusti
      let content;
      try {
        content = JSON.parse(plain);
      } catch {
        continue;
      }
      const next = withoutImages(content, imageGoneText(n));
      upd.run(next ? seal(JSON.stringify(next)) : r.api_content, r.id);
      if (next) out.images++;
    }
  }
  const nowIso = new Date(now).toISOString();
  if (hasTable(db, "parent_sessions")) out.sessions = Number(db.prepare("DELETE FROM parent_sessions WHERE expires_at < ?").run(nowIso).changes);
  if (hasTable(db, "profile_unlocks")) out.unlocks = Number(db.prepare("DELETE FROM profile_unlocks WHERE expires_at < ?").run(now).changes);
  const ago = (d) => new Date(now - d * 86400000).toISOString().replace("T", " ").slice(0, 19);
  if (hasTable(db, "email_log")) out.emailLog = Number(db.prepare("DELETE FROM email_log WHERE created_at < ?").run(ago(RETENTION.emailLogDays)).changes);
  if (hasTable(db, "push_log")) {
    // period se začne z datumom (YYYY-MM-DD:učenec).
    out.pushLog = Number(db.prepare("DELETE FROM push_log WHERE period GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]*' AND substr(period, 1, 10) < ?").run(ago(RETENTION.pushLogDays).slice(0, 10)).changes);
  }
  if (RETENTION.billingConsentDays && hasTable(db, "billing_consents")) {
    // Samo soglasja izbrisanih računov (parent_id NULL); pri obstoječem računu ostanejo, dokler je račun.
    out.billingConsents = Number(db.prepare("DELETE FROM billing_consents WHERE parent_id IS NULL AND created_at < ?").run(ago(RETENTION.billingConsentDays)).changes);
  }
  ensureAuditTable(db);
  out.audit = Number(db.prepare("DELETE FROM audit_log WHERE at < ?").run(ago(RETENTION.auditDays)).changes);
  out.unverified = deleteStaleUnverified(db, { nowIso, before: ago(RETENTION.unverifiedDays) });
  const total = Object.values(out).reduce((a, b) => a + b, 0);
  if (total) log.info?.(`[evklid] čiščenje po rokih hrambe: ${JSON.stringify(out)}`);
  return out;
}

// Nepotrjeni računi: samo brez profilov (profil brez potrditve ustvari le gost, ki je kasneje dobil račun;
// njegovi podatki so lahko v katerikoli tabeli: grafi, igre, urnik …), brez plačil ali kode, brez veljavne seje
// in ne gostje (goste čisti server/accounts/guest.js). Previdno: ob dvomu račun ostane.
function deleteStaleUnverified(db, { nowIso, before }) {
  if (!hasTable(db, "parents") || !hasCol(db, "students", "parent_id")) return 0;
  const cols = db.prepare("PRAGMA table_info(parents)").all().map((c) => c.name);
  const paid = ["stripe_customer_id", "sub_id", "sub_status", "promo_until", "bonus_until"].filter((c) => cols.includes(c)).map((c) => `p.${c} IS NULL`);
  const ids = db
    .prepare(
      `SELECT p.id FROM parents p
       WHERE p.is_guest = 0 AND p.email_verified_at IS NULL AND p.created_at < ?
         ${paid.map((c) => `AND ${c}`).join(" ")}
         AND NOT EXISTS (SELECT 1 FROM parent_sessions ps WHERE ps.parent_id = p.id AND ps.expires_at > ?)
         AND NOT EXISTS (SELECT 1 FROM students s WHERE s.parent_id = p.id)`,
    )
    .all(before, nowIso)
    .map((r) => r.id);
  for (const id of ids) {
    db.exec("BEGIN IMMEDIATE");
    try {
      db.prepare("DELETE FROM students WHERE parent_id = ?").run(id);
      db.prepare("DELETE FROM parents WHERE id = ?").run(id);
      db.prepare("UPDATE audit_log SET parent_id = NULL WHERE parent_id = ?").run(id);
      db.exec("COMMIT");
    } catch {
      db.exec("ROLLBACK");
    }
  }
  if (ids.length) audit(db, { actor: "system", action: "unverified_deleted", target: `n:${ids.length}` });
  return ids.length;
}

// Ob zagonu: opozorilo brez ključa, šifriranje v ozadju (paket za paketom, strežnik med tem odgovarja),
// čiščenje takoj in nato enkrat na dan.
export function startPrivacyJobs(db, { scheduler = true, log = console } = {}) {
  warnIfNoKey(log);
  const run = () => {
    if (db.isOpen === false) return;
    try {
      runRetention(db, { log });
    } catch (e) {
      log.error?.(`[evklid] čiščenje po rokih hrambe: ${e.message}`);
    }
  };
  if (!scheduler) return;
  if (encryptionOn()) {
    const steps = encryptionSteps(db);
    const done = {};
    const tick = () => {
      if (db.isOpen === false) return;
      try {
        const s = steps.next();
        if (s.done) {
          const total = Object.values(done).reduce((a, b) => a + b, 0);
          if (total) log.info?.(`[evklid] šifriranje obstoječih podatkov končano: ${JSON.stringify(done)}.`);
          return run();
        }
        done[s.value.table] = s.value.changed;
        setImmediate(tick).unref?.();
      } catch (e) {
        log.error?.(`[evklid] šifriranje obstoječih podatkov: ${e.message}`);
      }
    };
    setImmediate(tick).unref?.();
  } else {
    setImmediate(run).unref?.();
  }
  setInterval(run, 24 * 3600000).unref();
}

// --- izvoz vseh podatkov (GDPR čl. 15 in 20) ---
// Vse ostale tabele z vrsticami računa ali njegovih profilov (student_id, parent_id, lastnik razreda), ki jih
// izvoz v server/accounts/index.js ne zajame posebej: tako izvoz ne izpusti nove tabele. Gesla, žetoni in
// zgoščene vrednosti ostanejo zunaj; šifrirana polja gredo v izvoz odšifrirana.
const SECRET_COL = /hash|token|secret|password|salt|cipher/i;
const SECRET_TABLE = new Set(["parent_sessions", "profile_passwords", "profile_unlocks", "account_unlocks", "pay_links", "kv"]);
// Stolpci z računom: tudi kupec in prejemnik darila (gifts), priporočila (referral_rewards), ustanovitelj šole
// in avtor naloge razreda (created_by).
const OWNER_COLS = {
  student: ["student_id", "owner_student_id"],
  parent: ["parent_id", "owner_parent_id", "buyer_id", "redeemed_by", "referrer_id", "referred_id", "created_by"],
};
export function exportOtherTables(db, { parentId, studentIds = [], skip = [] }) {
  const out = {};
  const skipSet = new Set([...skip, "parents", "students"]);
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all().map((r) => r.name);
  for (const t of tables) {
    if (skipSet.has(t) || SECRET_TABLE.has(t)) continue;
    const cols = db.prepare(`PRAGMA table_info(${t})`).all().map((c) => c.name);
    const where = [];
    const args = [];
    for (const c of cols) {
      if (OWNER_COLS.student.includes(c) && studentIds.length) {
        where.push(`${c} IN (${studentIds.map(() => "?").join(",")})`);
        args.push(...studentIds);
      }
      if (OWNER_COLS.parent.includes(c) && parentId != null) {
        where.push(`${c} = ?`);
        args.push(parentId);
      }
    }
    if (!where.length) continue;
    const keep = cols.filter((c) => !SECRET_COL.test(c));
    const rows = db.prepare(`SELECT ${keep.map((c) => `"${c}"`).join(", ")} FROM ${t} WHERE ${where.join(" OR ")}`).all(...args);
    if (!rows.length) continue;
    out[t] = rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, typeof v === "string" && isEncrypted(v) ? unseal(v, null) : v])));
  }
  return out;
}
