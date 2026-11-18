// Neaktivni računi (j 18. 11. 2026, po osnutku DPIA). Vklop samo z EVKLID_NEAKTIVNI=1 (privzeto izklopljeno, j vklopi
// po posvetu s pravnikom; docs/izbris-izvoz.md »Neaktivni računi«).
// - Potrjen račun brez prijave in dejavnosti 12 mesecev: eno kratko e-sporočilo imetniku računa (prijava ali izbris).
// - 24 mesecev brez dejavnosti: izbris računa po isti poti kot DELETE /api/account (eraseAccount, zapis pilota),
//   a najprej 30 dni po poslanem obvestilu. Brez poslanega obvestila nikoli izbrisa (tudi ne pri mladoletnih).
// - Mladoletni imetnik (račun zase, 15–17 let) in račun brez datuma rojstva, ki je samo »Zame« ali nima profilov:
//   obvestilo s »ti«, sicer enako.
//   Profili otrok nimajo e-naslova; sporočilo gre vedno samo na e-naslov imetnika računa.
// - Ne velja za goste in nepotrjene račune (njih čisti server/zasebnost.js), skrbnike, račune s plačano ali podarjeno
//   dobo, preostankom kredita AI ali veljavnim paketom, in za šolske račune (učitelji, ustanovitelji šol, lastniki
//   razredov; tudi po poteku licence): zanje velja pogodba o obdelavi s šolo.
// Dejavnost: prijava (nova seja), vsak klic API s sejo (parents.last_active_at, enkrat na dan), vprašanja, dogodki
// učenja, točke, rezultati vaj in odprtje profila na napravi. Zapis obvestila: email_log kind »neaktivni«, period = dan
// zadnje dejavnosti (po vrnitvi in novem letu mirovanja novo obvestilo, za isto mirovanje nikoli dvakrat).

export const NEAKTIVNI = { obvestiloDni: 365, izbrisDni: 730, poObvestiluDni: 30 };
export const neaktivniVklopljeni = () => process.env.EVKLID_NEAKTIVNI === "1";
const PAID = ["active", "trialing", "past_due"];

const DAY = 86400000;
const sqlTime = (ms) => new Date(ms).toISOString().replace("T", " ").slice(0, 19);
const hasTable = (db, t) => !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(t);
const hasCol = (db, t, c) => hasTable(db, t) && db.prepare(`PRAGMA table_info(${t})`).all().some((x) => x.name === c);
// Datumi v bazi so »LLLL-MM-DD HH:MM:SS« ali ISO; za primerjavo enotno.
const norm = (v) => (v ? String(v).replace("T", " ").slice(0, 19) : "");

// Računi z zadnjo dejavnostjo pred `before` (SQL čas). Vrne [{ id, email, birth_date, last }]. id: samo ta račun
// (ponovno preverjanje tik pred izbrisom).
export function idleAccounts(db, before, { today = before.slice(0, 10), id = null } = {}) {
  if (!hasTable(db, "parents")) return [];
  const pcols = db.prepare("PRAGMA table_info(parents)").all().map((c) => c.name);
  const viaKid = (table, col) =>
    hasTable(db, table) && hasTable(db, "students") ? `(SELECT MAX(x.${col}) FROM ${table} x JOIN students s ON s.id = x.student_id WHERE s.parent_id = p.id)` : null;
  const parts = [
    pcols.includes("last_active_at") ? "p.last_active_at" : null,
    "p.created_at",
    "p.email_verified_at",
    hasTable(db, "parent_sessions") ? "(SELECT MAX(created_at) FROM parent_sessions WHERE parent_id = p.id)" : null,
    viaKid("events", "created_at"),
    viaKid("xp_events", "created_at"),
    viaKid("profile_devices", "last_seen"),
    viaKid("question_log", "day"),
    viaKid("skill_results", "day"),
  ].filter(Boolean);
  // REPLACE: ISO (»T«) in SQL (presledek) zapis primerljiva.
  const last = `MAX(${parts.map((x) => `COALESCE(REPLACE(${x}, 'T', ' '), '')`).join(", ")})`;
  const none = (table, sql) => (hasTable(db, table) ? `NOT EXISTS (${sql})` : null);
  const skip = [
    "p.is_guest = 0",
    "p.email_verified_at IS NOT NULL",
    "p.is_admin = 0",
    id != null ? "p.id = @id" : null,
    pcols.includes("sub_status") ? `(p.sub_status IS NULL OR p.sub_status NOT IN (${PAID.map((s) => `'${s}'`).join(", ")}))` : null,
    ...["sub_period_end", "promo_until", "gift_until", "bonus_until"].filter((c) => pcols.includes(c)).map((c) => `(p.${c} IS NULL OR substr(p.${c}, 1, 10) < @today)`),
    // Preostanek kredita AI (server/placila/krediti.js balance) in veljaven paket (passes).
    hasTable(db, "ai_credit_buys")
      ? `(SELECT COALESCE(SUM(credit_usd), 0) FROM ai_credit_buys WHERE parent_id = p.id AND status = 'active')${hasTable(db, "ai_credit_use") ? " - (SELECT COALESCE(SUM(usd), 0) FROM ai_credit_use WHERE parent_id = p.id)" : ""} < 0.0001`
      : null,
    hasCol(db, "passes", "ends_at") ? none("passes", "SELECT 1 FROM passes WHERE parent_id = p.id AND status = 'active' AND (ends_at IS NULL OR substr(ends_at, 1, 10) >= @today)") : null,
    // Šolski računi v celoti (tudi po poteku licence): pogodba o obdelavi s šolo.
    none("school_teachers", "SELECT 1 FROM school_teachers WHERE parent_id = p.id"),
    hasCol(db, "schools", "created_by") ? none("schools", "SELECT 1 FROM schools WHERE created_by = p.id") : null,
    hasCol(db, "classes", "owner_parent_id") ? none("classes", "SELECT 1 FROM classes WHERE owner_parent_id = p.id AND kind = 'class'") : null,
  ].filter(Boolean);
  return db
    .prepare(
      `SELECT * FROM (SELECT p.id, p.email, ${pcols.includes("birth_date") ? "p.birth_date" : "NULL AS birth_date"}, ${last} AS last
         FROM parents p WHERE ${skip.join(" AND ")}) WHERE last < @before ORDER BY id`,
    )
    .all({ before, today, ...(id != null ? { id } : {}) })
    .map((r) => ({ ...r, last: norm(r.last) }));
}

const fmtDate = (ms) => {
  const d = new Date(ms);
  return `${d.getUTCDate()}. ${d.getUTCMonth() + 1}. ${d.getUTCFullYear()}`;
};

class StillActive extends Error {}

/**
 * Ena obdelava (enkrat na dan). dryRun: samo štetje, brez e-pošte in izbrisa (skrbniško poročilo).
 * ctx: { db, sendMail(to, msg) → bool, isMinor(p), selfOnly(id), childIds(id), isAdminEmail(p), erase(p, check),
 *        email({ appUrl, accountUrl, dateText, minor }) → { subject, text, html }, appUrl, audit(obj), log }
 * erase(p, check) mora poklicati check() v transakciji izbrisa, pred izbrisom: ta znova preveri mirovanje (in vrže
 * napako, če je račun medtem postal dejaven) ter zapiše izbris v dnevnik dostopov.
 */
export async function runInactive(ctx, { now = Date.now(), dryRun = false } = {}) {
  const { db, log = console } = ctx;
  const out = { obvestilo: 0, obvestiloMladoletnim: 0, izbris: 0, cakaRok: 0, napakePosiljanja: 0 };
  const today = sqlTime(now).slice(0, 10);
  const rows = idleAccounts(db, sqlTime(now - NEAKTIVNI.obvestiloDni * DAY), { today });
  const delBefore = sqlTime(now - NEAKTIVNI.izbrisDni * DAY);
  const noticeBefore = sqlTime(now - NEAKTIVNI.poObvestiluDni * DAY);
  const logged = hasCol(db, "email_log", "kind");
  const noticeOf = (id, period) => (logged ? db.prepare("SELECT ok, created_at FROM email_log WHERE parent_id = ? AND kind = 'neaktivni' AND period = ?").get(id, period) : null);
  const erased = [];
  for (const r of rows) {
    const p = db.prepare("SELECT * FROM parents WHERE id = ?").get(r.id);
    if (!p || ctx.isAdminEmail?.(p)) continue;
    // Mladoletni imetnik ali starost neznana (brez datuma rojstva in račun samo »Zame« ali brez profilov, pregled #846
    // P3-1): obvestilo s »ti«. Brez datuma rojstva s profili drugih (otrok) je imetnik starš: »vi«.
    const minor = !!ctx.isMinor(p) || (!p.birth_date && (!!ctx.selfOnly(p.id) || !(ctx.childIds?.(p.id)?.length > 0)));
    const period = r.last.slice(0, 10);
    const notice = noticeOf(p.id, period);
    if (notice?.ok) {
      if (r.last < delBefore && norm(notice.created_at) <= noticeBefore) {
        out.izbris++;
        if (!dryRun) erased.push({ p, period });
      } else out.cakaRok++;
      continue;
    }
    out.obvestilo++;
    if (minor) out.obvestiloMladoletnim++;
    if (dryRun) continue;
    // Izbris najprej 24 mesecev po zadnji dejavnosti, nikoli prej kot 30 dni po obvestilu.
    const lastMs = Date.parse(`${r.last.replace(" ", "T")}Z`);
    const delAt = Math.max(lastMs + NEAKTIVNI.izbrisDni * DAY, now + NEAKTIVNI.poObvestiluDni * DAY);
    const claim = db.prepare("INSERT OR IGNORE INTO email_log (parent_id, kind, period) VALUES (?, 'neaktivni', ?)").run(p.id, period);
    if (!claim.changes) continue; // drug tek je pravkar poslal
    const ok = await ctx.sendMail(p.email, ctx.email({ appUrl: ctx.appUrl, accountUrl: `${ctx.appUrl}?pogled=racun`, dateText: fmtDate(delAt), minor }));
    if (!ok) {
      // Ni poslano: zapis se umakne, naslednji dan nov poskus (izbris čaka na poslano obvestilo).
      db.prepare("DELETE FROM email_log WHERE parent_id = ? AND kind = 'neaktivni' AND period = ?").run(p.id, period);
      out.obvestilo--;
      if (minor) out.obvestiloMladoletnim--;
      out.napakePosiljanja++;
    }
  }
  for (const { p, period } of erased) {
    // V transakciji izbrisa: račun mora še vedno mirovati od istega dne (prijava med tekom izbris ustavi).
    const check = () => {
      const again = idleAccounts(db, delBefore, { today, id: p.id })[0];
      if (!again || again.last.slice(0, 10) !== period) throw new StillActive();
      ctx.audit?.({ actor: "system", parentId: p.id, action: "inactive_deleted" });
    };
    try {
      ctx.erase(p, check);
    } catch (e) {
      out.izbris--;
      if (!(e instanceof StillActive)) log.error?.(`[evklid] izbris neaktivnega računa: ${e.message}`);
    }
  }
  return out;
}
