// Prijave napak: v odgovorih inštruktorja (gumb »Prijavi napako« pod vsakim odgovorom), v lekcijah
// (gumb »Prijavi napako« v vsaki lekciji) in skrbnikove prijave iz klepeta (napaka v aplikaciji ali
// inštruktorju). Skrbnik jih vidi v Računu (»Prijave napak«) in jih označi kot popravljene.
// Prijava shrani odgovor, vprašanje pred njim in razlog, odgovor pa odstrani iz predpomnilnika
// (answer_cache), da ga ne dobi noben drug učenec. Stikalo EVKLID_CHAT_OFF=1 izklopi klepet za vse.
// Postopek ob neljubem dogodku: docs/krizni-nacrt.md. Samodejni pregled prijav (izvoz s ključem, stanje
// »in_review« s PR): docs/prijave-samodejno.md.
import { cleanText } from "./settings.js";
import { seal, unseal } from "./crypto-polje.js";
import { exportTokenOk } from "./avatar.js";
import { audit } from "./dnevnik-dostopov.js";
import { BRAND } from "./brand.js";

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
      status TEXT NOT NULL DEFAULT 'open', -- open | fixed
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
  // Samodejni pregled prijav (docs/prijave-samodejno.md): status »in_review« in številka PR s popravkom.
  if (!cols.has("pr")) db.exec("ALTER TABLE message_reports ADD COLUMN pr INTEGER");
  const bugCols = new Set(db.prepare("PRAGMA table_info(bug_reports)").all().map((c) => c.name));
  if (!bugCols.has("pr")) db.exec("ALTER TABLE bug_reports ADD COLUMN pr INTEGER");
}

// Stanja prijave: odprta, popravek čaka na pregled (PR), popravljena.
export const REPORT_STATUSES = ["open", "in_review", "fixed"];
export const prUrl = (n) => (Number.isInteger(n) && n > 0 ? `https://github.com/${BRAND.repo}/pull/${n}` : null);

// Odgovor za druge učence: ime učenca → {{IME}}, samo kot cela beseda in ne glede na velike črke (»Nik« v
// »Nikoli« se ne zamenja, sicer bi naslednji učenec »Ana« prebral »Anaoli«). Če ime po zamenjavi še ostane
// kot začetek besede (sklonjena oblika »Jakobu«, »Lanom«, »Ani« ali beseda, ki se z imenom začne), vrne null:
// takega odgovora ne shranimo za druge učence, da ime ne pride do njih (P3). Enoznakovno ime ostane, kot je.
const NAME_EDGE_L = "(?<![\\p{L}\\p{N}_])";
const NAME_EDGE_R = "(?![\\p{L}\\p{N}_])";
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Brez naglasov in strešic (Žiga → Ziga, Zoë → Zoe), za primerjavo imena.
const plainLetters = (s) => String(s).normalize("NFD").replace(/\p{M}+/gu, "");

export function genericAnswer(text, name = "") {
  const out = genericExact(text, name);
  if (out === null) return null;
  // Ime brez strešic ali z drugimi naglasi (pregled #484 B P2-2): če ga primerjava brez naglasov še najde, odgovor ni skupen.
  const n = String(name || "").trim();
  if (n.length >= 2) {
    const flat = plainLetters(out);
    const again = genericExact(flat, plainLetters(n));
    if (again === null || again !== flat) return null;
    // Pomanjševalnice in vzdevki (Jakob → Jaka, Jakec; Matevž → Mato): beseda z veliko začetnico, ki se začne s
    // prvimi tremi črkami imena in je kratka, pomeni, da odgovor ni skupen (pregled #484 A P3-3). Ob dvomu se ne shrani.
    for (const w of plainLetters(n).split(/\s+/)) {
      if (w.length < 4) continue;
      const pre = w[0].toUpperCase() + w.slice(1, 3).toLowerCase();
      if (new RegExp(`${NAME_EDGE_L}${escRe(pre)}\\p{Ll}{0,4}${NAME_EDGE_R}`, "u").test(flat)) return null;
    }
  }
  return out;
}

function genericExact(text, name = "") {
  const n = String(name || "").trim();
  if (n.length < 2) return text;
  // Celo ime in posamezne besede imena (»Ana Marija« → tudi »Ana«, »Marija«).
  const parts = [n, ...n.split(/\s+/).filter((w) => w.length >= 2 && w !== n)];
  let out = String(text);
  for (const p of parts) out = out.replace(new RegExp(`${NAME_EDGE_L}${escRe(p)}${NAME_EDGE_R}`, "giu"), "{{IME}}");
  for (const p of parts) {
    if (new RegExp(`${NAME_EDGE_L}${escRe(p)}\\p{L}`, "iu").test(out)) return null; // Jakob → Jakobu
    const short = p.length <= 3;
    // Osnova brez končnega samoglasnika s kratko končnico: Ana → Ani, Ano; Luka → Luki.
    // Kratka imena (Mia, Tia, Ana): osnova je pogosta beseda (»mi«, »ti«), zato samo cele sklonjene oblike.
    const stem = p.replace(/[aeiouy]$/iu, "");
    if (stem !== p && stem.length >= 2) {
      const tail = short ? "(?:e|i|o|u|jo|ji|je|ju)" : "\\p{L}{0,3}";
      if (new RegExp(`${NAME_EDGE_L}${escRe(stem)}${tail}${NAME_EDGE_R}`, "iu").test(out)) return null;
    }
    // Premični e: Peter → Petru, Pavel → Pavlu, Aleksander → Aleksandru, Karel → Karlu.
    const moving = p.replace(/e(\p{L})$/iu, "$1");
    if (!short && moving !== p && moving.length >= 2 && new RegExp(`${NAME_EDGE_L}${escRe(moving)}\\p{L}{1,3}${NAME_EDGE_R}`, "iu").test(out)) return null;
  }
  return out;
}

// Odstrani odgovor iz predpomnilnika. Tam je shranjen z {{IME}} namesto imena učenca.
export function purgeCachedAnswer(db, text, name = "") {
  if (!text) return 0;
  // Tudi ključ starih zapisov (pred P3 je bila zamenjava replaceAll, npr. »{{IME}}oli«), dokler ne potečejo.
  const generic = genericAnswer(text, name) ?? text;
  const legacy = name.length > 1 ? text.replaceAll(name, "{{IME}}") : text;
  return Number(db.prepare("DELETE FROM answer_cache WHERE text IN (?, ?, ?)").run(text, generic, legacy).changes || 0);
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
  const reports = [...msgs, ...bugs].map((r) => ({ ...r, pr_url: prUrl(r.pr) })).sort((a, b) => (a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0)).slice(0, limit);
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

// Izvoz za samodejni pregled (docs/prijave-samodejno.md): odprte prijave in tiste s popravkom v pregledu.
// Brez id-jev učenca, pogovora in sporočila (koda sporočila #00YA ostane, da j najde odgovor v Računu).
const EXPORT_SHOWN = 6000;
// Ime učenca (in sklonjene oblike, npr. »Jakobu«) se v vseh besedilih zamenja z [ime]; odgovor in surovo
// besedilo sta že ob prijavi brez imena, vprašanje, opomba in zadnja sporočila pa ne.
export function scrubName(text, name = "") {
  if (!text) return text;
  const parts = [...new Set(String(name || "").trim().split(/\s+/).filter((w) => w.length >= 2))];
  let out = String(text);
  for (const p of parts) {
    const forms = [escRe(p) + (p.length >= 3 ? "\\p{L}{0,3}" : "")]; // Jakob, Jakobu, Jakobom
    const stem = p.replace(/[aeiouy]$/iu, "");
    // Ana → Ani, Ano (kratka osnova samo s sklonskimi končnicami); Luka → Luki, Luko.
    if (stem !== p && stem.length >= 2) forms.push(escRe(stem) + (stem.length >= 3 ? "\\p{L}{1,2}" : "(?:e|i|o|u|jo|ji|je|ju)"));
    const moving = p.replace(/e(\p{L})$/iu, "$1"); // Peter → Petru, Pavel → Pavlu
    if (p.length >= 4 && moving !== p) forms.push(escRe(moving) + "\\p{L}{1,3}");
    for (const f of forms) out = out.replace(new RegExp(`${NAME_EDGE_L}${f}${NAME_EDGE_R}`, "giu"), "[ime]");
  }
  return out;
}

export function exportReports(db, topicName = () => null) {
  const { reports } = adminReports(db, { status: "open", limit: 300 });
  const byId = db.prepare("SELECT name FROM students WHERE id = ?");
  const names = new Map();
  const nameOf = (id) => {
    if (!id) return "";
    if (!names.has(id)) names.set(id, byId.get(id)?.name || "");
    return names.get(id);
  };
  return reports.map((r) => [r, nameOf(r.student_id)]).map(([r, name]) => ({
    kind: r.kind,
    id: r.id,
    status: r.status,
    pr: r.pr ?? null,
    created_at: r.created_at,
    reason: r.reason,
    device: r.device || null,
    code: r.code || null,
    topic_id: r.topic_id || null,
    topic_name: r.topic_id ? topicName(r.topic_id) : null,
    step: r.step ?? null,
    note: scrubName(r.note, name) || null,
    question: scrubName(r.question, name) || null,
    answer: scrubName(r.answer, name) || null,
    raw: r.raw && r.raw !== r.answer ? scrubName(r.raw, name) : null,
    // Ime samo v besedilu, ne v oznakah in razredih (kot ob prijavi); tudi besedilo na začetku in na koncu
    // (po rezu na 6000 znakov ostane zadnje besedilo brez »<«).
    shown: r.shown ? r.shown.slice(0, EXPORT_SHOWN).replace(/(^|>)([^<]+)/g, (_, a, t) => a + scrubName(t, name)) : null,
    context: scrubName(r.context, name) || null,
  }));
}

export function mountReports(app, store, { loadConversation, loadStudent, localOnly, isAdmin = () => false, isPilot = null, topicName = () => null }) {
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
  // Člani pilota (isPilot, server/pilot-naloge.js) tudi, z dnevno mejo prijav kot drugje.
  app.post("/api/students/:id/bug", (req, res) => {
    const admin = isAdmin(req);
    if (!admin && !isPilot) return res.status(403).json({ error: "Samo za skrbnika." });
    const s = loadStudent(req, res);
    if (!s) return;
    if (!admin && !isPilot(s.id)) return res.status(403).json({ error: "Samo za skrbnika." });
    if (!admin && perDay(s.id) >= MAX_PER_DAY) return res.status(429).json({ error: "Danes si poslal že veliko prijav. Hvala!" });
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
    console.warn(`[evklid] ${admin ? "skrbnik" : "član pilota"} je prijavil napako #${id}`);
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
    // Znova odprta prijava nima več PR (kot POST /api/prijave/…/stanje z »open«).
    const n = store.db.prepare(`UPDATE ${table} SET status = ?, fixed_at = ?${status === "open" ? ", pr = NULL" : ""} WHERE id = ?${kindCheck}`).run(...args).changes;
    if (!n) return res.status(404).json({ error: "Prijava ne obstaja." });
    res.json({ ok: true, status });
  });
  // Samodejni pregled prijav (docs/prijave-samodejno.md): ključ EVKLID_EXPORT_TOKEN v glavi Authorization,
  // skrbnik ali računalnik s strežnikom. Brez tega 404, kot da poti ni. Pot je mimo gesla in prijave (gate.js, accounts).
  const exportAllowed = (req) => exportTokenOk(req) || isAdmin(req);
  const actorOf = (req) => (exportTokenOk(req) ? { actor: "system", parentId: null } : { actor: "admin", parentId: req.parent?.id ?? null });
  app.get("/api/prijave/izvoz", (req, res) => {
    res.set("Cache-Control", "no-store");
    if (!exportAllowed(req)) return res.status(404).json({ error: "Ne obstaja." });
    const reports = exportReports(store.db, topicName);
    audit(store.db, { req, ...actorOf(req), action: "reports_export", target: `reports:${reports.length}` });
    res.json({ at: new Date().toISOString(), reports });
  });
  // Stanje prijave: in_review + pr (popravek čaka na j-jev pregled), fixed (PR združen), open (PR zaprt brez združitve).
  app.post("/api/prijave/:kind/:rid/stanje", (req, res) => {
    res.set("Cache-Control", "no-store");
    if (!exportAllowed(req)) return res.status(404).json({ error: "Ne obstaja." });
    const kind = req.params.kind;
    const table = kind === "message" ? "message_reports" : ["lesson", "app"].includes(kind) ? "bug_reports" : null;
    const rid = /^\d{1,12}$/.test(req.params.rid) ? Number(req.params.rid) : NaN;
    const status = REPORT_STATUSES.includes(req.body?.status) ? req.body.status : null;
    const pr = req.body?.pr == null ? null : Number.isInteger(req.body.pr) && req.body.pr > 0 && req.body.pr < 1e7 ? req.body.pr : NaN;
    if (!table || !Number.isInteger(rid) || !status || Number.isNaN(pr) || (status === "in_review" && !pr)) return res.status(400).json({ error: "Napačna zahteva." });
    const kindCheck = table === "bug_reports" ? " AND kind = ?" : "";
    const fixedAt = status === "fixed" ? new Date().toISOString().slice(0, 19).replace("T", " ") : null;
    // Ob »open« ostane številka PR prazna; ob »fixed« brez pr ostane prejšnja (PR, ki je napako popravil).
    const n = store.db
      .prepare(`UPDATE ${table} SET status = ?, fixed_at = ?, pr = ${status === "open" ? "NULL" : "COALESCE(?, pr)"} WHERE id = ?${kindCheck}`)
      .run(...[status, fixedAt, ...(status === "open" ? [] : [pr]), rid, ...(kindCheck ? [kind] : [])]).changes;
    if (!n) return res.status(404).json({ error: "Prijava ne obstaja." });
    audit(store.db, { req, ...actorOf(req), action: "report_status", target: `${kind}:${rid}:${status}${pr ? `:pr${pr}` : ""}` });
    // Odgovor pove shranjeno številko PR (ob »fixed« brez pr ostane prejšnja).
    res.json({ ok: true, status, pr: store.db.prepare(`SELECT pr FROM ${table} WHERE id = ?`).get(rid)?.pr ?? null });
  });
}
