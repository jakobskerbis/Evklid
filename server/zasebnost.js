// Varstvo podatkov učencev (docs/varnost-podatkov.md): šifriranje obstoječih vrstic ob zagonu,
// roki hrambe in dnevno čiščenje. Šifriranje polj: server/crypto-polje.js.
import { seal, unseal, isEncrypted, currentKeyId, encryptionOn, blindIndex, warnIfNoKey, SEALED, encryptionStats, openFlag } from "./crypto-polje.js";
import { normCard } from "./flashcards.js";
import { audit, ensureAuditTable } from "./dnevnik-dostopov.js";
import { PHOTO_MAX_DAYS, dropFormerPhotos } from "./pilot-naloge.js";
import { pocistiStare } from "./kopije.js";
import { eraseAccount } from "./accounts/izbris.js";

// Šifrirani stolpci (SEALED) in štetje neberljivih (encryptionStats) sta v crypto-polje.js: rabi ju tudi lahka nit
// za nočni preizkus kopij (server/kopije-preizkus.js), ki ne sme naložiti tega modula in vsega, kar ta uvaža.
export { SEALED, encryptionStats };

// --- roki hrambe (vse na enem mestu) ---
const days = (v, d) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : d);
export const RETENTION = {
  // Fotografije nalog v pogovorih: po toliko dneh ostane le opomba (besedilo pogovora ostane).
  imageDays: () => days(process.env.EVKLID_IMAGE_DAYS, 7),
  // Dnevnik dostopov: eno leto (varnostna sled za morebitne incidente).
  auditDays: 365,
  // Dnevnik poslanih e-poštnih sporočil (samo za preprečevanje dvojnega pošiljanja): eno leto.
  emailLogDays: 365,
  // Zapis obvestila o neaktivnem računu (kind »neaktivni«): izbris je 12 mesecev po obvestilu, zato dlje kot ostali.
  inactiveLogDays: 760,
  // Dnevnik obvestil na telefon (enako): 90 dni.
  pushLogDays: 90,
  // Nepotrjen račun brez plačil: brez profilov in seje toliko dni po registraciji, s profili toliko dni brez dejavnosti.
  unverifiedDays: 30,
  // Odpiranje delov aplikacije (točka B2, server/odpiranje-delov.js MAX_DNI): po toliko dneh brez odprtja.
  odpiranjeDni: 120,
  // Predpomnjeni odgovori inštruktorja se uporabijo 30 dni (app.js), nato izbrišejo (docs/izbris-izvoz.md, najdba 4).
  answerCacheDays: 30,
  // Naročila šol (school_orders: ime, e-naslov in telefon kontaktne osebe) od zadnje spremembe (updated_at).
  // j 2026-11-16: brez pogodbe 2 leti po zadnjem stiku, sklenjeno 10 let (računovodska listina).
  schoolOrderOpenDays: 730,
  schoolOrderWonDays: 3653,
  // Soglasje plačnika ob nakupu (billing_consents, z e-naslovom plačnika) po izbrisu računa: dokaz soglasja.
  // j 2026-11-16: 5 let po nakupu (splošni zastaralni rok, OZ 346).
  billingConsentDays: 1826,
  // Oznake dogodkov (events.flag razen »none«; stiska, nevarna vsebina, vrivanje, tema zunaj predmetov, fotografija;
  // j 18. 11. 2026, pregled #846): 90 dni od dogodka. Dogodek učenja ostane, oznaka postane »none« (clearOldFlags).
  flagDays: 90,
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
// Med selitvijo secure_delete (SQLite): staro nešifrirano besedilo (tudi oznaka »distress«) ne ostane v prostem
// prostoru strani baze. Po koncu nazaj na prejšnjo nastavitev.
export function* encryptionSteps(db, batch = 200) {
  if (!currentKeyId()) return;
  const restore = secureDelete(db);
  try {
    yield* sealSteps(db, batch);
  } finally {
    restore();
  }
}
function secureDelete(db) {
  let prev = null;
  try {
    prev = db.prepare("PRAGMA secure_delete").get()?.secure_delete ?? null;
    db.exec("PRAGMA secure_delete = ON");
  } catch {}
  return () => {
    try {
      if (prev !== null && db.isOpen !== false) db.exec(`PRAGMA secure_delete = ${Number(prev) ? "ON" : "OFF"}`);
    } catch {}
  };
}
function* sealSteps(db, batch) {
  const cur = currentKeyId();
  const fresh = `enc1:${cur}:%`;
  for (const t of SEALED) {
    if (!hasTable(db, t.table)) continue;
    const cols = t.cols.filter((c) => hasCol(db, t.table, c));
    const need = cols.map((c) => `(${c} IS NOT NULL AND ${c} NOT LIKE '${fresh}')`);
    if (t.norm) need.push(`norm NOT LIKE 'h1:${cur}:%'`);
    const only = t.where ? ` AND (${t.where})` : "";
    // Najprej samo rowid, vrstice nato ena po ena: sporočila s fotografijo imajo do 7 MB, 200 naenkrat bi na
    // strežniku s 512 MB pomnilnika lahko sprožilo OOM. Paket se konča tudi po ~8 MB besedila (zanka dogodkov).
    const pick = db.prepare(`SELECT rowid AS rid FROM ${t.table} WHERE rowid > ? AND (${need.join(" OR ")})${only} ORDER BY rowid LIMIT ?`);
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
          const vals = plain.map((v) => (v === null ? null : seal(t.pad ? String(v).padEnd(t.pad) : v)));
          if (t.clearIf && plain.some((v) => typeof v === "string" && v.trim() === t.clearIf.value)) {
            const have = t.clearIf.cols.filter((c) => hasCol(db, t.table, c));
            if (have.length) db.prepare(`UPDATE ${t.table} SET ${have.map((c) => `${c} = NULL`).join(", ")} WHERE rowid = ?`).run(r.rid);
          }
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
      // label: drugi vnos za isto tabelo (events.pregled) se šteje posebej, ne prepiše števila prvega.
      yield { table: t.label || t.table, changed };
    }
  }
}

export function migrateEncryption(db, batch = 200) {
  const out = {};
  for (const s of encryptionSteps(db, batch)) out[s.table] = s.changed;
  return out;
}


// Oznake dogodkov (events.flag razen »none«: stiska, nevarna vsebina, vrivanje, tema zunaj predmetov, fotografija),
// starejše od RETENTION.flagDays → »none«; dogodek učenja ostane. Brez ključa nič (napačna nastavitev ne sme brisati na
// slepo). Neberljive oznake (manjka stari ključ) ostanejo: niso nikoli obravnavane kot stiska, le preštete v dnevniku.
// Idempotentno; secure_delete, da staro besedilo ne ostane v prostih straneh.
export function clearOldFlags(db, before, { log = console } = {}) {
  if (!hasTable(db, "events") || !currentKeyId()) return 0;
  const ids = [];
  let unreadable = 0;
  for (const r of db.prepare("SELECT id, flag FROM events WHERE flag <> 'none' AND created_at < ?").iterate(before)) {
    if (openFlag(r.flag) === null) unreadable++;
    else ids.push(r.id);
  }
  if (unreadable) log.warn?.(`[evklid] neberljive oznake dogodkov, starejše od roka: ${unreadable} (manjka ključ v EVKLID_DATA_KEYS_OLD)`);
  if (!ids.length) return 0;
  // Z oznako gre tudi njen pregled (vrsta okna ob stiski, pregledano_ob; server/stiska-obvestilo.js).
  const upd = db.prepare(`UPDATE events SET flag = 'none'${hasCol(db, "events", "pregled") ? ", pregled = NULL" : ""} WHERE id = ?`);
  const restore = secureDelete(db);
  try {
    db.exec("BEGIN IMMEDIATE");
    try {
      for (const id of ids) upd.run(id);
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  } finally {
    restore();
  }
  return ids.length;
}

// Predpomnjeni odgovori z oznako stiske v vrstici META (<<META … flag=distress …>>). secure_delete: besedilo ne ostane
// v prostih straneh. Odgovorov z flag=none, ob katerih je stisko našel le lokalni zaznavalnik ali pregled B, iz
// besedila ni mogoče prepoznati; ti se izbrišejo z rokom predpomnilnika (30 dni).
export function purgeCachedDistress(db) {
  if (!hasTable(db, "answer_cache")) return 0;
  const restore = secureDelete(db);
  try {
    return Number(db.prepare("DELETE FROM answer_cache WHERE text LIKE '%<<META%flag=distress%'").run().changes);
  } finally {
    restore();
  }
}

// --- dnevno čiščenje ---
// Hramba zapisa neujemajočega se plačila Stripa (dni).
export const UNMATCHED_DAYS = 365;
export function runRetention(db, { now = Date.now(), log = console } = {}) {
  const out = { images: 0, sessions: 0, unlocks: 0, emailLog: 0, pushLog: 0, audit: 0, unverified: 0 };
  // Zapisi plačil, ki jih ni bilo mogoče pripisati računu (kv stripe_unmatched:*, accounts/ponoven-id.js): 365 dni
  // po zapisu (polje at), dovolj za ročno vračilo; neberljiv zapis brez časa se izbriše.
  if (hasTable(db, "kv")) {
    const cut = new Date(now - UNMATCHED_DAYS * 86400000).toISOString();
    for (const r of db.prepare("SELECT key, value FROM kv WHERE key LIKE 'stripe\\_unmatched:%' ESCAPE '\\'").all()) {
      let at = null;
      try {
        at = JSON.parse(r.value)?.at;
      } catch {}
      if (typeof at !== "string" || !(at >= cut)) out.unmatched = (out.unmatched || 0) + db.prepare("DELETE FROM kv WHERE key = ?").run(r.key).changes;
    }
  }
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
  // Fotografije iz nalog pilota (shranjene ob soglasju): ob roku iz soglasja (expires_at), nikoli pozneje kot
  // PHOTO_MAX_DAYS po shranitvi, tudi če se nastavitev vmes spremeni. Ocena ostane.
  if (hasTable(db, "pilot_photos")) {
    const t = Math.floor(now / 1000);
    const hasExp = hasCol(db, "pilot_photos", "expires_at");
    out.pilotPhotos = Number(
      db
        .prepare(
          `DELETE FROM pilot_photos WHERE created_at < datetime(?, 'unixepoch', ?)${hasExp ? " OR (expires_at IS NOT NULL AND expires_at < datetime(?, 'unixepoch'))" : ""}`,
        )
        .run(...(hasExp ? [t, `-${PHOTO_MAX_DAYS} days`, t] : [t, `-${PHOTO_MAX_DAYS} days`])).changes,
    );
    // Bivši člani pilota (šoli je potekla licenca): fotografije najpozneje v enem dnevu.
    try {
      out.pilotFormer = dropFormerPhotos(db);
    } catch {}
  }
  if (hasTable(db, "parent_sessions")) out.sessions = Number(db.prepare("DELETE FROM parent_sessions WHERE expires_at < ?").run(nowIso).changes);
  if (hasTable(db, "profile_unlocks")) out.unlocks = Number(db.prepare("DELETE FROM profile_unlocks WHERE expires_at < ?").run(now).changes);
  const ago = (d) => new Date(now - d * 86400000).toISOString().replace("T", " ").slice(0, 19);
  if (hasTable(db, "email_log")) {
    // Obvestilo o neaktivnem računu (server/accounts/neaktivni.js) mora ostati do izbrisa (12 mesecev po obvestilu) in še malo.
    out.emailLog = Number(db.prepare("DELETE FROM email_log WHERE kind <> 'neaktivni' AND created_at < ?").run(ago(RETENTION.emailLogDays)).changes);
    out.emailLog += Number(db.prepare("DELETE FROM email_log WHERE kind = 'neaktivni' AND created_at < ?").run(ago(RETENTION.inactiveLogDays)).changes);
  }
  if (hasTable(db, "push_log")) {
    // period se začne z datumom (YYYY-MM-DD:učenec).
    out.pushLog = Number(db.prepare("DELETE FROM push_log WHERE period GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]*' AND substr(period, 1, 10) < ?").run(ago(RETENTION.pushLogDays).slice(0, 10)).changes);
  }
  if (hasTable(db, "odpiranje_delov")) out.odpiranje = Number(db.prepare("DELETE FROM odpiranje_delov WHERE zadnji < ?").run(ago(RETENTION.odpiranjeDni).slice(0, 10)).changes);
  out.oznake = clearOldFlags(db, ago(RETENTION.flagDays), { log });
  // Varnostni odgovori ob stiski, shranjeni v predpomnilnik pred popravkom #846 (genericAnswer shrani celo besedilo z
  // vrstico META): izbris takoj, ne šele po 30 dneh. Idempotentno; šteje v answerCache (brez posebnega števila stisk).
  const cachedSafety = hasTable(db, "answer_cache") ? purgeCachedDistress(db) : 0;
  if (hasTable(db, "answer_cache")) out.answerCache = cachedSafety + Number(db.prepare("DELETE FROM answer_cache WHERE created_at < ?").run(ago(RETENTION.answerCacheDays)).changes);
  // Rok hrambe varnostnih kopij na disku tudi z EVKLID_BACKUPS=0 (ko ne teče dnevna kopija): docs/izbris-izvoz.md.
  try {
    const file = db.prepare("PRAGMA database_list").all().find((r) => r.name === "main")?.file;
    if (file) out.backups = pocistiStare(file, new Date(now));
  } catch (e) {
    log.error?.(`[evklid] čiščenje starih varnostnih kopij: ${e.message}`);
  }
  if (hasTable(db, "school_orders")) {
    // Sklenjeno: status »won« ali šola z licenco iz naročila (school_id); ostalo je povpraševanje brez pogodbe.
    const won = "(status = 'won' OR school_id IS NOT NULL)";
    const del = (cond, d) => (d ? Number(db.prepare(`DELETE FROM school_orders WHERE ${cond} AND updated_at < ?`).run(ago(d)).changes) : 0);
    out.schoolOrders = del(`NOT ${won}`, RETENTION.schoolOrderOpenDays) + del(won, RETENTION.schoolOrderWonDays);
  }
  if (RETENTION.billingConsentDays && hasTable(db, "billing_consents")) {
    // Samo soglasja izbrisanih računov (parent_id NULL); pri obstoječem računu ostanejo, dokler je račun.
    out.billingConsents = Number(db.prepare("DELETE FROM billing_consents WHERE parent_id IS NULL AND created_at < ?").run(ago(RETENTION.billingConsentDays)).changes);
  }
  if (RETENTION.billingConsentDays && hasTable(db, "withdrawals")) {
    // Obvestila o odstopu (ime, e-naslov, pogodba; server/placila/odstop.js): dokaz o pravočasnem odstopu, enako dolgo kot
    // soglasje ob nakupu. Pri obstoječem računu ostanejo, dokler je račun; po izbrisu računa 5 let od oddaje (preveri pravnik).
    out.withdrawals = Number(db.prepare("DELETE FROM withdrawals WHERE parent_id IS NULL AND submitted_at < ?").run(new Date(now - RETENTION.billingConsentDays * 86400000).toISOString()).changes);
  }
  ensureAuditTable(db);
  out.audit = Number(db.prepare("DELETE FROM audit_log WHERE at < ?").run(ago(RETENTION.auditDays)).changes);
  out.unverified = deleteStaleUnverified(db, { nowIso, before: ago(RETENTION.unverifiedDays) });
  const total = Object.values(out).reduce((a, b) => a + b, 0);
  if (total) log.info?.(`[evklid] čiščenje po rokih hrambe: ${JSON.stringify(out)}`);
  return out;
}

// Nepotrjeni računi (ne gostje; goste čisti server/accounts/guest.js), brez plačil ali kode:
// - brez profilov: po RETENTION.unverifiedDays od registracije, če nimajo veljavne seje;
// - s profili (#747: profil in učenje že pred potrditvijo, pregled 2): po RETENTION.unverifiedDays brez dejavnosti
//   (vprašanja, dogodki učenja, točke, odprtje profila na napravi). Seja tu ne šteje, ker velja dolgo.
// Izbris kot DELETE /api/account (server/accounts/izbris.js): poraba ostane šteta za omrežje. Ob dvomu račun ostane.
function deleteStaleUnverified(db, { nowIso, before }) {
  if (!hasTable(db, "parents") || !hasCol(db, "students", "parent_id")) return 0;
  const cols = db.prepare("PRAGMA table_info(parents)").all().map((c) => c.name);
  const paid = ["stripe_customer_id", "sub_id", "sub_status", "promo_until", "bonus_until"].filter((c) => cols.includes(c)).map((c) => `p.${c} IS NULL`);
  const none = (table, sql) => (hasTable(db, table) ? `AND NOT EXISTS (${sql})` : "");
  const active = [
    none("question_log", "SELECT 1 FROM question_log q JOIN students s ON s.id = q.student_id WHERE s.parent_id = p.id AND q.day >= @day"),
    none("events", "SELECT 1 FROM events e JOIN students s ON s.id = e.student_id WHERE s.parent_id = p.id AND e.created_at >= @before"),
    none("xp_events", "SELECT 1 FROM xp_events x JOIN students s ON s.id = x.student_id WHERE s.parent_id = p.id AND x.created_at >= @before"),
    none("profile_devices", "SELECT 1 FROM profile_devices d JOIN students s ON s.id = d.student_id WHERE s.parent_id = p.id AND d.last_seen >= @before"),
  ].join(" ");
  const ids = db
    .prepare(
      `SELECT p.id FROM parents p
       WHERE p.is_guest = 0 AND p.email_verified_at IS NULL AND p.created_at < @before
         ${paid.map((c) => `AND ${c}`).join(" ")}
         AND (
           (NOT EXISTS (SELECT 1 FROM students s WHERE s.parent_id = p.id)
             AND NOT EXISTS (SELECT 1 FROM parent_sessions ps WHERE ps.parent_id = p.id AND ps.expires_at > @now))
           OR (EXISTS (SELECT 1 FROM students s WHERE s.parent_id = p.id) ${active})
         )`,
    )
    .all({ before, now: nowIso, ...(hasTable(db, "question_log") ? { day: before.slice(0, 10) } : {}) })
    .map((r) => r.id);
  let n = 0;
  for (const id of ids) {
    try {
      eraseAccount(db, id, { transaction: true });
      n++;
    } catch {
      // račun ostane (naslednji dan znova)
    }
  }
  if (n) audit(db, { actor: "system", action: "unverified_deleted", target: `n:${n}` });
  return n;
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
