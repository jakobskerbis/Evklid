// Prijave napak: v odgovorih inštruktorja (gumb »Prijavi napako« pod vsakim odgovorom), v lekcijah
// (gumb »Prijavi napako« v vsaki lekciji) in skrbnikove prijave iz klepeta (napaka v aplikaciji ali
// inštruktorju). Skrbnik jih vidi v Računu (»Prijave napak«) in jih označi kot popravljene.
// Prijava shrani odgovor, vprašanje pred njim in razlog, odgovor pa odstrani iz predpomnilnika
// (answer_cache), da ga ne dobi noben drug učenec. Stikalo EVKLID_CHAT_OFF=1 izklopi klepet za vse.
// Postopek ob neljubem dogodku: docs/krizni-nacrt.md.
import { cleanText } from "./settings.js";
import { seal, unseal } from "./crypto-polje.js";
import { appVersion } from "./razlicica.js";
import { migrateReports } from "./db.js";
import { exportTokenOk, exportAllowed } from "./izvozni-kljuc.js";
import { audit } from "./dnevnik-dostopov.js";

export const REPORT_REASONS = ["wrong", "unsafe", "other"];
// Stanje prijave: odprta, v pregledu (popravek v PR s številko pr) ali popravljena.
export const REPORT_STATES = ["open", "in_review", "fixed"];
// Razlogi pri prijavi napake v lekciji.
export const LESSON_REASONS = ["wrong", "unclear", "broken", "other"];
// Največ prijav enega učenca na dan (zaščita pred zlorabo).
const MAX_PER_DAY = 30;

export const chatOff = () => process.env.EVKLID_CHAT_OFF === "1";

// Kratka koda sporočila, vidna pod odgovorom (#00YA). Z njo v bazi najdemo sporočilo s posnetka zaslona.
export const messageCode = (id) => `#${Number(id).toString(36).toUpperCase().padStart(4, "0")}`;
export function parseMessageCode(code) {
  const m = /^#?([0-9a-z]{1,10})$/i.exec(String(code ?? "").trim());
  return m ? parseInt(m[1], 36) : null;
}

export function ensureReportsTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS message_reports (
      id INTEGER PRIMARY KEY,
      -- Ob izbrisu profila se izbrišejo tudi njegove prijave (vprašanje je lahko osebno).
      student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      conversation_id INTEGER,
      message_id INTEGER NOT NULL UNIQUE,
      reason TEXT NOT NULL,          -- wrong | unsafe | other
      note TEXT,
      question TEXT,                 -- vprašanje učenca pred odgovorom
      answer TEXT NOT NULL,          -- odgovor, kot ga je videl učenec
      purged INTEGER NOT NULL DEFAULT 0, -- koliko shranjenih odgovorov je bilo izbrisanih
      status TEXT NOT NULL DEFAULT 'open', -- open | in_review | fixed
      fixed_at TEXT,
      device TEXT,
      raw TEXT,
      shown TEXT,
      pr INTEGER,                    -- številka PR s popravkom (samodejni pregled prijav)
      version TEXT,                  -- različica aplikacije ob prijavi (server/razlicica.js)
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    -- Prijave iz lekcij (kind = lesson) in skrbnikove prijave iz klepeta (kind = app).
    CREATE TABLE IF NOT EXISTS bug_reports (
      id INTEGER PRIMARY KEY,
      student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      kind TEXT NOT NULL,            -- lesson | app
      topic_id TEXT,                 -- lekcija
      step INTEGER,                  -- korak lekcije (po korakih), od 1
      conversation_id INTEGER,
      reason TEXT NOT NULL,
      note TEXT,                     -- šifrirano
      context TEXT,                  -- šifrirano: zadnja sporočila pogovora (skrbnik)
      device TEXT,
      status TEXT NOT NULL DEFAULT 'open', -- open | in_review | fixed
      fixed_at TEXT,
      pr INTEGER,                    -- številka PR s popravkom (samodejni pregled prijav)
      version TEXT,                  -- različica aplikacije ob prijavi
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  migrateReports(db); // server/db.js
}

// Odstrani odgovor iz predpomnilnika. Tam je shranjen z {{IME}} namesto imena učenca.
export function purgeCachedAnswer(db, text, name = "") {
  if (!text) return 0;
  const generic = name.length > 1 ? text.replaceAll(name, "{{IME}}") : text;
  return Number(db.prepare("DELETE FROM answer_cache WHERE text IN (?, ?)").run(text, generic).changes || 0);
}

export function listReports(db, limit = 200) {
  return db
    .prepare("SELECT * FROM message_reports ORDER BY id DESC LIMIT ?")
    .all(limit)
    .map((r) => ({ ...openReport(r), code: messageCode(r.message_id) }));
}

// Opomba, vprašanje in odgovor so šifrirani (server/crypto-polje.js).
export const openReport = (r) => r && { ...r, note: unseal(r.note), question: unseal(r.question), answer: unseal(r.answer), raw: unseal(r.raw), shown: unseal(r.shown) };
// Izrisan HTML sporočila s spleta: največ 200 000 znakov (dolg postopek s formulami), brez skriptov
// (prikaz za skrbnika ga še strogo očisti, public/prijave.js safeShown).
export const SHOWN_MAX = 200000;
const cleanShown = (v) => (typeof v === "string" && v.length <= SHOWN_MAX && !/<script\b/i.test(v) ? v : null);

const openBug = (r) => r && { ...r, note: unseal(r.note), context: unseal(r.context) };

// Vse prijave za skrbnika, najnovejše najprej: odgovori inštruktorja, lekcije, aplikacija.
export function adminReports(db, { status = "open", limit = 300 } = {}) {
  const where = status === "all" ? "" : "WHERE status != 'fixed'";
  const msgs = db
    .prepare(`SELECT * FROM message_reports ${where} ORDER BY id DESC LIMIT ?`)
    .all(limit)
    .map((r) => ({ ...openReport(r), kind: "message", code: messageCode(r.message_id) }));
  const bugs = db.prepare(`SELECT * FROM bug_reports ${where} ORDER BY id DESC LIMIT ?`).all(limit).map(openBug);
  const open = (t) => (t ? db.prepare(`SELECT COUNT(*) AS n FROM ${t} WHERE status != 'fixed'`).get().n : 0);
  const reports = [...msgs, ...bugs].sort((a, b) => (a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0)).slice(0, limit);
  return { reports, open: open("message_reports") + open("bug_reports") };
}

// Ograja, daljša od vseh ``` v besedilu (odgovor ima lahko svoje bloke kode).
const fenced = (text, lang = "") => {
  const fence = "`".repeat(Math.max(3, ...(text.match(/`+/g) || []).map((m) => m.length + 1)));
  return [fence + lang, text, fence];
};

// Povzetek v Markdownu: skrbnik ga prenese in da Claudu, ki napake popravi.
export function reportsMarkdown({ reports }, topicName = () => null) {
  const lines = ["# Prijave napak (odprte)", ""];
  if (!reports.length) lines.push("Ni odprtih prijav.");
  for (const r of reports) {
    const head =
      r.kind === "message"
        ? `## Odgovor inštruktorja ${r.code} · ${r.reason}`
        : r.kind === "lesson"
          ? `## Lekcija ${r.topic_id}${topicName(r.topic_id) ? ` (${topicName(r.topic_id)})` : ""}${r.step ? `, korak ${r.step}` : ""} · ${r.reason}`
          : `## Aplikacija / inštruktor · skrbnik`;
    lines.push(head, `- čas: ${r.created_at} UTC${r.device ? ` · ${r.device}` : ""}`);
    if (r.note) lines.push(`- opomba: ${r.note}`);
    if (r.question) lines.push("", "Vprašanje:", "", "> " + r.question.replace(/\n/g, "\n> "));
    if (r.answer) lines.push("", "Odgovor (kot ga je videl učenec):", "", "> " + r.answer.replace(/\n/g, "\n> "));
    if (r.raw && r.raw !== r.answer) lines.push("", "Surovo besedilo modela:", "", ...fenced(r.raw));
    if (r.shown) lines.push("", "Izrisan HTML (splet):", "", ...fenced(r.shown.slice(0, 6000), "html"));
    if (r.context) lines.push("", "Zadnja sporočila:", "", r.context);
    lines.push("");
  }
  return lines.join("\n");
}

// Ime učenca v prostem besedilu zamenja z [ime] (vprašanje in opomba pri odgovoru inštruktorja se shranita brez tega).
// Celo ime, nato vsak njegov del (»Ana Novak« → tudi »Ana«, »Novak«) kot samostojna beseda (»Analiza« ostane).
const escRe = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const withoutName = (text, name) => {
  if (typeof text !== "string" || !name || name.length < 2) return text;
  const parts = String(name).split(/\s+/).filter((w) => w.length > 2);
  return parts.reduce((t, w) => t.replace(new RegExp(`(?<![\\p{L}\\p{N}])${escRe(w)}(?![\\p{L}\\p{N}])`, "gu"), "[ime]"), text.replaceAll(name, "[ime]"));
};
const newestFirst = (a, b) => (a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : b.id - a.id);

/**
 * Prijave za samodejni pregled (GET /api/prijave/izvoz): samo to, kar je potrebno za popravek. Brez id-jev
 * učenca, pogovora in sporočila (tudi brez kode sporočila), brez imena (zamenjano z [ime]), brez zadnjih
 * sporočil pogovora in brez izrisanega HTML. Vsako polje je našteto posebej, da novo polje v bazi ne uide v izvoz.
 */
export function reviewExport(db, { all = false, limit = 200, topicName = () => null } = {}) {
  const where = all ? "" : "WHERE r.status != 'fixed'";
  const nameOf = "(SELECT name FROM students WHERE id = r.student_id) AS student_name";
  const msgs = db.prepare(`SELECT r.*, ${nameOf} FROM message_reports r ${where} ORDER BY r.id DESC LIMIT ?`).all(limit);
  const bugs = db.prepare(`SELECT r.*, ${nameOf} FROM bug_reports r ${where} ORDER BY r.id DESC LIMIT ?`).all(limit);
  const out = [];
  for (const row of msgs) {
    const r = openReport(row);
    const name = row.student_name;
    const answer = withoutName(r.answer, name) || null;
    const raw = withoutName(r.raw, name) || null;
    out.push({
      id: row.id,
      kind: "message",
      reason: row.reason,
      note: withoutName(r.note, name) || null,
      view: "chat",
      topic_id: null,
      topic_name: null,
      step: null,
      device: row.device || null,
      version: row.version || null,
      question: withoutName(r.question, name) || null,
      answer,
      raw: raw && raw !== answer ? raw : null,
      created_at: row.created_at,
      status: row.status,
      pr: row.pr ?? null,
      fixed_at: row.fixed_at || null,
    });
  }
  for (const row of bugs) {
    const name = row.student_name;
    out.push({
      id: row.id,
      kind: row.kind,
      reason: row.kind === "app" ? null : row.reason,
      note: withoutName(unseal(row.note), name) || null,
      // Pri skrbnikovi prijavi je v reason zaslon, s katerega je prijavil (npr. chat).
      view: row.kind === "app" ? withoutName(row.reason, name) : "lesson",
      topic_id: row.topic_id || null,
      topic_name: row.topic_id ? topicName(row.topic_id) : null,
      step: row.step ?? null,
      device: row.device || null,
      version: row.version || null,
      question: null,
      answer: null,
      raw: null,
      created_at: row.created_at,
      status: row.status,
      pr: row.pr ?? null,
      fixed_at: row.fixed_at || null,
    });
  }
  return out.sort(newestFirst).slice(0, limit);
}

const tableOf = (kind) => (kind === "message" ? "message_reports" : kind === "lesson" || kind === "app" ? "bug_reports" : null);

/** Nastavi stanje prijave. Vrne null (napačen vhod), 0 (prijava ne obstaja) ali 1. */
export function setReportState(db, kind, id, { status, pr } = {}) {
  const table = tableOf(kind);
  if (!table || !Number.isSafeInteger(id) || id < 1 || !REPORT_STATES.includes(status)) return null;
  if (pr !== undefined && pr !== null && !(Number.isSafeInteger(pr) && pr > 0 && pr < 1e7)) return null;
  if (status === "in_review" && !pr) return null; // »V pregledu« vedno s številko PR
  if (status === "open" && pr) return null; // odprta prijava nima PR
  const kindCheck = table === "bug_reports" ? " AND kind = ?" : "";
  const fixedAt = status === "fixed" ? new Date().toISOString().slice(0, 19).replace("T", " ") : null;
  // Odprta prijava nima PR; popravljena brez nove številke obdrži prejšnjo.
  const prSql = status === "open" ? "NULL" : status === "fixed" && !pr ? "pr" : "?";
  const args = [status, fixedAt, ...(prSql === "?" ? [pr] : []), id, ...(kindCheck ? [kind] : [])];
  return Number(db.prepare(`UPDATE ${table} SET status = ?, fixed_at = ?, pr = ${prSql} WHERE id = ?${kindCheck}`).run(...args).changes);
}

/** Prijave enega učenca za Račun: kdaj in kaj je prijavil ter stanje popravka (brez besedil). */
export function studentReports(db, studentId, topicName = () => null) {
  const msgs = db.prepare("SELECT id, created_at, status, pr FROM message_reports WHERE student_id = ? ORDER BY id DESC LIMIT 50").all(studentId).map((r) => ({ ...r, kind: "message" }));
  const bugs = db.prepare("SELECT id, kind, topic_id, step, created_at, status, pr FROM bug_reports WHERE student_id = ? ORDER BY id DESC LIMIT 50").all(studentId);
  return [...msgs, ...bugs]
    .sort(newestFirst)
    .slice(0, 50)
    .map((r) => ({ kind: r.kind, topic_name: r.topic_id ? topicName(r.topic_id) || r.topic_id : null, step: r.step ?? null, created_at: r.created_at, status: r.status, pr: r.pr ?? null }));
}

export function mountReports(app, store, { loadConversation, loadStudent, localOnly, isAdmin = () => false, topicName = () => null }) {
  ensureReportsTable(store.db);

  const deviceOf = (d) => cleanText([d?.device, d?.screen].filter((x) => typeof x === "string").join(" "), 40) || null;

  app.post("/api/conversations/:id/messages/:mid/report", (req, res) => {
    const conv = loadConversation(req, res);
    if (!conv) return;
    const mid = /^\d+$/.test(req.params.mid) ? Number(req.params.mid) : NaN;
    const msgs = store.listMessages(conv.id);
    const i = msgs.findIndex((m) => m.id === mid);
    if (i < 0 || msgs[i].role !== "assistant") return res.status(404).json({ error: "Sporočilo ne obstaja." });
    const reason = REPORT_REASONS.includes(req.body?.reason) ? req.body.reason : null;
    if (!reason) return res.status(400).json({ error: "Izberi, kaj je narobe." });
    const code = messageCode(mid);
    if (store.db.prepare("SELECT 1 FROM message_reports WHERE message_id = ?").get(mid)) return res.json({ ok: true, code, already: true });
    const today = store.db
      .prepare("SELECT COUNT(*) AS n FROM message_reports WHERE student_id = ? AND created_at >= datetime('now','-1 day')")
      .get(conv.student_id).n;
    if (today >= MAX_PER_DAY) return res.status(429).json({ error: "Danes si poslal že veliko prijav. Hvala!" });

    const msg = msgs[i];
    const question = msgs.slice(0, i).reverse().find((m) => m.role === "user");
    const raw = msg.api_content?.find?.((b) => b.type === "text")?.text || "";
    const name = store.getStudent(conv.student_id)?.name || "";
    const purged = purgeCachedAnswer(store.db, raw, name);
    // Odgovor ostane kot zapis dogodka tudi po izbrisu pogovora, zato brez učenčevega imena.
    const anonymize = (t) => (name.length > 1 ? t.replaceAll(name, "[ime]") : t);
    store.db
      .prepare("INSERT INTO message_reports (student_id, conversation_id, message_id, reason, note, question, answer, purged, device, raw, shown, version) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(
        conv.student_id,
        conv.id,
        mid,
        reason,
        seal(cleanText(req.body?.note, 500) || null),
        seal(question?.display_text?.slice(0, 2000) || null),
        seal(anonymize(msg.display_text).slice(0, 8000)),
        purged,
        deviceOf(req.body),
        raw ? seal(anonymize(raw).slice(0, 12000)) : null,
        // Ime samo v besedilu, ne v oznakah in razredih (npr. ime »ma« bi pokvarilo <math>).
        cleanShown(req.body?.shown) ? seal(req.body.shown.replace(/>([^<]*)</g, (_, t) => `>${anonymize(t)}<`)) : null,
        appVersion() || null,
      );
    console.warn(`[evklid] prijava napake ${code} (${reason}), pogovor ${conv.id}`);
    res.status(201).json({ ok: true, code });
  });

  // Seznam prijav: samo na računalniku, kjer teče strežnik.
  app.get("/api/reports", localOnly, (_req, res) => res.json({ reports: listReports(store.db) }));

  const perDay = (sid) =>
    store.db.prepare("SELECT COUNT(*) AS n FROM bug_reports WHERE student_id = ? AND created_at >= datetime('now','-1 day')").get(sid).n +
    store.db.prepare("SELECT COUNT(*) AS n FROM message_reports WHERE student_id = ? AND created_at >= datetime('now','-1 day')").get(sid).n;
  // »Prijavi napako« v lekciji: razlog, opomba, korak. Skrbnik jo vidi v Računu.
  app.post("/api/students/:id/lesson-report", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const topic = String(req.body?.topic || "");
    if (!/^[\w./-]{1,120}$/.test(topic) || !topicName(topic)) return res.status(404).json({ error: "Lekcija ne obstaja." });
    const reason = LESSON_REASONS.includes(req.body?.reason) ? req.body.reason : null;
    if (!reason) return res.status(400).json({ error: "Izberi, kaj je narobe." });
    if (perDay(s.id) >= MAX_PER_DAY) return res.status(429).json({ error: "Danes si poslal že veliko prijav. Hvala!" });
    const step = Number.isInteger(req.body?.step) && req.body.step > 0 && req.body.step < 1000 ? req.body.step : null;
    const note = cleanText(req.body?.note, 500);
    const id = store.db
      .prepare("INSERT INTO bug_reports (student_id, kind, topic_id, step, reason, note, device, version) VALUES (?, 'lesson', ?, ?, ?, ?, ?, ?)")
      .run(s.id, topic, step, reason, note ? seal(s.name?.length > 1 ? note.replaceAll(s.name, "[ime]") : note) : null, deviceOf(req.body), appVersion() || null).lastInsertRowid;
    console.warn(`[evklid] prijava napake v lekciji ${topic} (${reason})`);
    res.status(201).json({ ok: true, id: Number(id) });
  });

  // Skrbnik v klepetu: »Prijavi napako« (v aplikaciji ali pri inštruktorju) z zadnjimi sporočili pogovora.
  app.post("/api/students/:id/bug", (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: "Samo za skrbnika." });
    const s = loadStudent(req, res);
    if (!s) return;
    const note = String(req.body?.note || "").trim().slice(0, 2000);
    if (!note) return res.status(400).json({ error: "Opiši napako." });
    let convId = null;
    let context = null;
    const cid = Number(req.body?.conversation_id);
    if (Number.isInteger(cid) && cid > 0) {
      const c = store.getConversation(cid);
      if (c && c.student_id === s.id) {
        convId = c.id;
        const msgs = store.listMessages(c.id).slice(-10);
        context = msgs.map((m) => `**${m.role === "user" ? "Učenec" : `Inštruktor ${messageCode(m.id)}`}:** ${String(m.display_text || "").slice(0, 3000)}`).join("\n\n") || null;
      }
    }
    const view = cleanText(req.body?.view, 30);
    const id = store.db
      .prepare("INSERT INTO bug_reports (student_id, kind, conversation_id, reason, note, context, device, version) VALUES (?, 'app', ?, ?, ?, ?, ?, ?)")
      .run(s.id, convId, view || "chat", seal(note), context ? seal(context) : null, deviceOf(req.body), appVersion() || null).lastInsertRowid;
    console.warn(`[evklid] skrbnik je prijavil napako #${id}`);
    res.status(201).json({ ok: true, id: Number(id) });
  });

  // Seznam za skrbnika (Račun → Prijave napak), označi kot popravljeno, prenos v Markdownu.
  const adminOnly = (req, res, next) => (isAdmin(req) ? next() : res.status(403).json({ error: "Samo za skrbnika." }));
  app.get("/api/admin/reports", adminOnly, (req, res) => {
    const status = req.query.status === "all" ? "all" : "open";
    const out = adminReports(store.db, { status });
    res.json({ ...out, reports: out.reports.map((r) => (r.kind === "lesson" ? { ...r, topic_name: topicName(r.topic_id) } : r)) });
  });
  app.get("/api/admin/reports/export", adminOnly, (_req, res) => {
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="prijave-napak.md"');
    res.send(reportsMarkdown(adminReports(store.db), topicName));
  });
  app.post("/api/admin/reports/:kind/:rid", adminOnly, (req, res) => {
    const table = req.params.kind === "message" ? "message_reports" : ["lesson", "app"].includes(req.params.kind) ? "bug_reports" : null;
    const rid = /^\d+$/.test(req.params.rid) ? Number(req.params.rid) : NaN;
    const status = ["open", "fixed"].includes(req.body?.status) ? req.body.status : null;
    if (!table || !status) return res.status(400).json({ error: "Napačna zahteva." });
    const kindCheck = table === "bug_reports" ? " AND kind = ?" : "";
    const args = [status, status === "fixed" ? new Date().toISOString().slice(0, 19).replace("T", " ") : null, rid, ...(kindCheck ? [req.params.kind] : [])];
    // Skrbnik ročno: »Znova odpri« izbriše številko PR, »Popravljeno« jo obdrži.
    const n = store.db.prepare(`UPDATE ${table} SET status = ?, fixed_at = ?${status === "open" ? ", pr = NULL" : ""} WHERE id = ?${kindCheck}`).run(...args).changes;
    if (!n) return res.status(404).json({ error: "Prijava ne obstaja." });
    res.json({ ok: true, status });
  });

  // Učenec v Računu: svoje prijave in stanje popravka (»V pregledu · PR #N«). Lastništvo preveri server/accounts.
  app.get("/api/students/:id/prijave", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    res.json({ reports: studentReports(store.db, s.id, topicName) });
  });

  // Samodejni pregled prijav (dnevni zagon, ki ga nastavi koordinator): izvoz in stanje s ključem EVKLID_EXPORT_TOKEN v glavi
  // Authorization (ali skrbnik ali računalnik s strežnikom). Poti sta mimo gesla in prijave (gate.js, accounts),
  // zato brez ključa odgovorita 404, kot da ju ni.
  const hidden = (res) => res.status(404).json({ error: "Ne obstaja." });
  const actorOf = (req) => (!exportTokenOk(req) && req.parent?.is_admin ? { actor: "admin", parentId: req.parent.id } : { actor: "system", parentId: null });
  app.get("/api/prijave/izvoz", (req, res) => {
    res.set("Cache-Control", "no-store");
    if (!exportAllowed(req)) return hidden(res);
    const prijave = reviewExport(store.db, { all: req.query.stanje === "vse", topicName });
    audit(store.db, { req, ...actorOf(req), action: "reports_export", target: `reports:${prijave.length}` });
    res.json({ at: new Date().toISOString(), version: appVersion() || null, prijave });
  });
  app.post("/api/prijave/:kind/:id/stanje", (req, res) => {
    res.set("Cache-Control", "no-store");
    if (!exportAllowed(req)) return hidden(res);
    const id = /^\d{1,9}$/.test(req.params.id) ? Number(req.params.id) : NaN;
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const pr = body.pr === undefined || body.pr === null ? undefined : body.pr;
    const n = setReportState(store.db, req.params.kind, id, { status: body.status, pr });
    if (n === null) return res.status(400).json({ error: "Napačna zahteva: kind message | lesson | app, status open | in_review (s pr) | fixed, pr celo število." });
    if (!n) return res.status(404).json({ error: "Prijava ne obstaja." });
    audit(store.db, { req, ...actorOf(req), action: "report_state", target: `${req.params.kind}:${id}:${body.status}${pr ? `:pr${pr}` : ""}` });
    const row = store.db.prepare(`SELECT status, pr FROM ${tableOf(req.params.kind)} WHERE id = ?`).get(id);
    res.json({ ok: true, kind: req.params.kind, id, status: row.status, pr: row.pr ?? null });
  });
}
