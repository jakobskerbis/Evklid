// Prijave napak: v odgovorih inštruktorja (gumb »Prijavi napako« pod vsakim odgovorom), v lekcijah
// (gumb »Prijavi napako« v vsaki lekciji) in skrbnikove prijave iz klepeta (napaka v aplikaciji ali
// inštruktorju). Skrbnik jih vidi v Računu (»Prijave napak«) in jih označi kot popravljene.
// Prijava shrani odgovor, vprašanje pred njim in razlog, odgovor pa odstrani iz predpomnilnika
// (answer_cache), da ga ne dobi noben drug učenec. Stikalo EVKLID_CHAT_OFF=1 izklopi klepet za vse.
// Postopek ob neljubem dogodku: docs/krizni-nacrt.md.
import { cleanText } from "./settings.js";
import { seal, unseal } from "./crypto-polje.js";
import { exportTokenOk } from "./avatar.js";
import { audit } from "./dnevnik-dostopov.js";
import { migrateReportPr } from "./db.js";

export const REPORT_REASONS = ["wrong", "unsafe", "other"];
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
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  const cols = new Set(db.prepare("PRAGMA table_info(message_reports)").all().map((c) => c.name));
  if (!cols.has("status")) db.exec("ALTER TABLE message_reports ADD COLUMN status TEXT NOT NULL DEFAULT 'open'");
  if (!cols.has("fixed_at")) db.exec("ALTER TABLE message_reports ADD COLUMN fixed_at TEXT");
  // Kaj je učenec res videl (j, 4. 11.: napaka v izpisu formule se v prijavi ni videla): naprava,
  // surovo besedilo modela (šifrirano) in izrisan HTML sporočila s spleta (šifrirano).
  if (!cols.has("device")) db.exec("ALTER TABLE message_reports ADD COLUMN device TEXT");
  if (!cols.has("raw")) db.exec("ALTER TABLE message_reports ADD COLUMN raw TEXT");
  if (!cols.has("shown")) db.exec("ALTER TABLE message_reports ADD COLUMN shown TEXT");
  // Številka PR s popravkom (migracija v server/db.js).
  migrateReportPr(db);
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
// »Odprte« so vse, ki še niso popravljene (tudi tiste v pregledu s PR).
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
      .prepare("INSERT INTO message_reports (student_id, conversation_id, message_id, reason, note, question, answer, purged, device, raw, shown) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
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
      .prepare("INSERT INTO bug_reports (student_id, kind, topic_id, step, reason, note, device) VALUES (?, 'lesson', ?, ?, ?, ?, ?)")
      .run(s.id, topic, step, reason, note ? seal(s.name?.length > 1 ? note.replaceAll(s.name, "[ime]") : note) : null, deviceOf(req.body)).lastInsertRowid;
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
      .prepare("INSERT INTO bug_reports (student_id, kind, conversation_id, reason, note, context, device) VALUES (?, 'app', ?, ?, ?, ?, ?)")
      .run(s.id, convId, view || "chat", seal(note), context ? seal(context) : null, deviceOf(req.body)).lastInsertRowid;
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
    // Znova odprta prijava nima več PR (dnevni pregled jo vzame kot novo).
    const n = store.db.prepare(`UPDATE ${table} SET status = ?, fixed_at = ?${status === "open" ? ", pr = NULL" : ""} WHERE id = ?${kindCheck}`).run(...args).changes;
    if (!n) return res.status(404).json({ error: "Prijava ne obstaja." });
    res.json({ ok: true, status });
  });

  mountReportsExport(app, store, { topicName });
}

// ---------- izvoz za dnevni samodejni pregled prijav (docs/prijave-pregled.md) ----------
// Pot je mimo gesla in prijave (gate.js, accounts), zato jo varuje samo ključ EVKLID_EXPORT_TOKEN v glavi
// Authorization (kot /api/kozmetika/export, primerjava v stalnem času). Brez pravega ključa 404.
// Izvoz nima student_id, conversation_id, kode sporočila, naprave, izrisanega HTML in zadnjih sporočil
// pogovora; v besedilih zamenja ime, vzdevek, ime in e-naslov starša ter vsak e-naslov.

export const REPORT_STATES = ["open", "in_review", "fixed"];
const tableOf = (kind) => (kind === "message" ? "message_reports" : kind === "lesson" || kind === "app" ? "bug_reports" : null);
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// E-naslov, tudi »ana (at) gmail.com« in »ana @ gmail . com«; telefonska številka (041 123 456, 01 234 56 78,
// +386 41 123 456). Decimalna števila (0.3333333) niso telefon.
const EMAIL = /[\p{L}\p{N}._%+-]+\s*(?:@|\(at\)|\[at\])\s*[\p{L}\p{N}-]+(?:\s*\.\s*[\p{L}\p{N}-]+)*\s*\.\s*\p{L}{2,}/giu;
const PHONE = /(?<![\p{L}\p{N},.])(?:(?:\+|00)\d{1,3}[\s/-]?\(?\d{1,3}\)?|0[1-9]\d?)(?:[\s/-]?\d){6,8}(?!\p{N}|[.,]\d)/gu;
// Sklanjatve imen (Ana → Ani, Ano, Anin; Kos → Kosu, Kosom, Kosova): osnova brez končnega samoglasnika + končnica.
const ENDINGS = "a|e|i|o|u|in|ina|ine|ini|ino|inem|inim|ega|emu|em|om|ov|ova|ove|ovi|ovo|ju|ja|je|ji|jo|jem|evi|eva";

// Kaj bi v prostem besedilu lahko razkrilo učenca: ime (tudi posamezne besede), imena bratov in sester
// (isti starš), vzdevek v ligah, starš (ime, e-naslov), razredi in šola.
export function identityWords(db, studentId) {
  const words = new Set();
  const whole = new Set();
  const add = (v) => {
    const s = String(v || "").normalize("NFC").trim();
    if (s.length < 2) return;
    words.add(s);
    // Pri e-naslovu samo del pred @ (domena, npr. »gmail«, ni osebna).
    for (const w of s.split("@")[0].split(/[\s._-]+/)) if (w.length >= 2) words.add(w);
  };
  // Razred in šola samo kot celota (»Matematika 8b« ne sme pobrisati besede »matematika«).
  const addWhole = (v) => {
    const s = String(v || "").normalize("NFC").trim();
    if (s.length >= 3) whole.add(s);
  };
  const all = (sql) => {
    try {
      return db.prepare(sql).all(studentId);
    } catch {
      return []; // tabele ali stolpca ni (brez računov, lig ali šol)
    }
  };
  for (const r of all("SELECT name FROM students WHERE id = ?")) add(r.name);
  // Brat ali sestra pod istim staršem (stolpec parent_id je samo z računi).
  for (const r of all("SELECT name FROM students WHERE parent_id IS NOT NULL AND parent_id = (SELECT parent_id FROM students WHERE id = ?)")) add(r.name);
  for (const r of all("SELECT nickname FROM league_profiles WHERE student_id = ?")) add(r.nickname);
  for (const r of all("SELECT p.name, p.email FROM students s JOIN parents p ON p.id = s.parent_id WHERE s.id = ?")) {
    add(r.name);
    add(r.email);
  }
  for (const r of all("SELECT c.name FROM class_members m JOIN classes c ON c.id = m.class_id WHERE m.student_id = ?")) addWhole(r.name);
  for (const r of all("SELECT DISTINCT sc.name, sc.place FROM class_members m JOIN classes c ON c.id = m.class_id JOIN schools sc ON sc.id = c.school_id WHERE m.student_id = ?")) {
    addWhole(r.name);
    addWhole(r.place);
  }
  const pattern = (w) => {
    if (w.length < 3 || /[^\p{L}]/u.test(w)) return escRe(w);
    const stem = /[aeiou]$/i.test(w) && w.length >= 3 ? w.slice(0, -1) : w;
    return `${escRe(w)}|${escRe(stem)}(?:${ENDINGS})`;
  };
  return [...[...words].map(pattern), ...[...whole].map(escRe)].sort((a, b) => b.length - a.length);
}

// words: vzorci iz identityWords (ali navadne besede, ki jih tu ubežimo, če niso vzorec).
export function scrubText(text, words = []) {
  if (text === null || text === undefined || text === "") return null;
  let out = String(text).normalize("NFC").replace(EMAIL, "[e-naslov]").replace(PHONE, "[telefon]");
  if (words.length) out = out.replace(new RegExp(`(?<![\\p{L}\\p{N}])(?:${words.join("|")})(?![\\p{L}\\p{N}])`, "giu"), "[ime]");
  return out;
}

export function reportsForExport(db, { all = false, topicName = () => null, limit = 500 } = {}) {
  const where = all ? "" : "WHERE status != 'fixed'";
  const msgs = db.prepare(`SELECT id, student_id, reason, note, question, answer, status, pr, created_at FROM message_reports ${where} ORDER BY id DESC LIMIT ?`).all(limit);
  const bugs = db.prepare(`SELECT id, student_id, kind, topic_id, step, reason, note, status, pr, created_at FROM bug_reports ${where} ORDER BY id DESC LIMIT ?`).all(limit);
  const cache = new Map();
  const wordsOf = (sid) => {
    if (!cache.has(sid)) cache.set(sid, sid ? identityWords(db, sid) : []);
    return cache.get(sid);
  };
  const out = [
    ...msgs.map((r) => {
      const w = wordsOf(r.student_id);
      return {
        id: r.id,
        kind: "message",
        razlog: r.reason,
        besedilo: scrubText(unseal(r.note, ""), w),
        kontekst: { vprasanje: scrubText(unseal(r.question, ""), w), odgovor: scrubText(unseal(r.answer, ""), w) },
        stanje: r.status,
        pr: r.pr ?? null,
        cas: r.created_at,
      };
    }),
    ...bugs.map((r) => {
      const w = wordsOf(r.student_id);
      return {
        id: r.id,
        kind: r.kind,
        razlog: r.reason,
        besedilo: scrubText(unseal(r.note, ""), w),
        // Pri prijavah skrbnika iz klepeta brez zadnjih sporočil pogovora (tam piše učenec).
        kontekst: r.kind === "lesson" ? { lekcija: r.topic_id, ime_lekcije: topicName(r.topic_id), korak: r.step ?? null } : { pogled: r.reason },
        stanje: r.status,
        pr: r.pr ?? null,
        cas: r.created_at,
      };
    }),
  ];
  return out.sort((a, b) => (a.cas < b.cas ? 1 : a.cas > b.cas ? -1 : 0)).slice(0, limit);
}

export function mountReportsExport(app, store, { topicName = () => null } = {}) {
  const gone = (res) => res.status(404).json({ error: "Ne obstaja." });
  // Napačen ključ (glava je, ključ ni pravi) pusti sled v dnevniku dostopov.
  const denied = (req, res, action) => {
    if (req.headers.authorization) audit(store.db, { req, actor: "system", action, ok: false });
    return gone(res);
  };
  app.get("/api/prijave/izvoz", (req, res) => {
    res.set("Cache-Control", "no-store");
    if (!exportTokenOk(req)) return denied(req, res, "reports_export");
    const reports = reportsForExport(store.db, { all: req.query.stanje === "all", topicName });
    audit(store.db, { req, actor: "system", action: "reports_export", target: `reports:${reports.length}` });
    res.json({ at: new Date().toISOString(), prijave: reports });
  });
  app.post("/api/prijave/:kind/:id/stanje", (req, res) => {
    res.set("Cache-Control", "no-store");
    if (!exportTokenOk(req)) return denied(req, res, "report_status");
    const table = tableOf(req.params.kind);
    const id = /^\d{1,12}$/.test(req.params.id) ? Number(req.params.id) : NaN;
    if (!table || !Number.isSafeInteger(id)) return gone(res);
    const b = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const stanje = REPORT_STATES.includes(b.stanje) ? b.stanje : null;
    const hasPr = b.pr !== undefined && b.pr !== null;
    const pr = Number.isSafeInteger(b.pr) && b.pr > 0 && b.pr < 1e7 ? b.pr : null;
    const extra = Object.keys(b).some((k) => k !== "stanje" && k !== "pr");
    // in_review potrebuje PR; fixed ga lahko doda; open ga pobriše (PR je bil zaprt brez združitve).
    if (!stanje || extra || (hasPr && !pr) || (stanje === "in_review" && !pr) || (stanje === "open" && hasPr)) {
      return res.status(400).json({ error: "Napačna zahteva." });
    }
    const kindCheck = table === "bug_reports" ? " AND kind = ?" : "";
    const fixedAt = stanje === "fixed" ? new Date().toISOString().slice(0, 19).replace("T", " ") : null;
    const prSql = stanje === "open" ? ", pr = NULL" : pr ? ", pr = ?" : "";
    const args = [stanje, fixedAt, ...(pr ? [pr] : []), id, ...(kindCheck ? [req.params.kind] : [])];
    const n = store.db.prepare(`UPDATE ${table} SET status = ?, fixed_at = ?${prSql} WHERE id = ?${kindCheck}`).run(...args).changes;
    if (!n) return gone(res);
    audit(store.db, { req, actor: "system", action: "report_status", target: `${req.params.kind}:${id}:${stanje}` });
    const row = store.db.prepare(`SELECT status, pr FROM ${table} WHERE id = ?`).get(id);
    res.json({ ok: true, stanje: row.status, pr: row.pr ?? null });
  });
}
