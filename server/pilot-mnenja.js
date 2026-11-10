// Mnenja članov pilota (j, 2026-11-10): ocena 1–5 zvezdic, »Kaj ti je najbolj všeč?«, »Kaj te najbolj moti?« in
// ločeno dovoljenje za objavo brez imena (samo razred ali letnik). Aplikacija vpraša po smiselni uporabi (3 dni
// uporabe ali 10 rešenih nalog), največ enkrat na teden; vedno je dostopno v Jaz → »Povej mnenje« (public/mnenje.js).
// - Nič se ne objavi samodejno: dovoljenje je samo zapis (publish = 1 in besedilo, ki ga je učenec potrdil); objavo
//   naredi človek. Dovoljenje se da kadar koli preklicati (POST …/mnenje/objava).
// - Mlajši od 15 let (ali brez letnice rojstva): stikala ne vidi in strežnik dovoljenja ne sprejme (GDPR čl. 8,
//   brez soglasja starša objava ni mogoča).
// - Brez imena: v tabeli ni imena, ime profila v besedilu zamenja »[ime]«; skrbnik vidi seznam brez imena, brez
//   številke profila in brez ure (samo mesec). Besedili sta šifrirani (server/crypto-polje.js SEALED).
// - Izbris profila ali računa izbriše mnenja (ON DELETE CASCADE); izvoz podatkov jih vsebuje (accounts/index.js).
import { cleanText } from "./settings.js";
import { seal, unseal } from "./crypto-polje.js";
import { pilotMember } from "./pilot-naloge.js";

export const MIN_DAYS = 3; // dni uporabe (dnevi z vsaj eno točko XP)
export const MIN_SOLVED = 10; // ali rešenih nalog
export const ASK_EVERY_DAYS = 7; // vprašanje največ enkrat na teden
export const AFTER_OPINION_DAYS = 30; // po oddanem mnenju aplikacija sama ne vpraša znova prej kot čez 30 dni
export const TEXT_MAX = 600;
export const DAILY_MAX = 3; // oddanih mnenj na profil na dan
export const PUBLISH_MIN_AGE = 15;
// Različica besedila dovoljenja (public/i18n mn.publish): ob spremembi pomena povečaj.
export const CONSENT_VERSION = 1;

const hasCol = (db, t, c) => db.prepare(`PRAGMA table_info(${t})`).all().some((x) => x.name === c);

export function migrateOpinions(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pilot_mnenja (
      id INTEGER PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      stars INTEGER NOT NULL,          -- 1–5
      liked TEXT,                      -- »Kaj ti je najbolj všeč?« (šifrirano)
      bothers TEXT,                    -- »Kaj te najbolj moti?« (šifrirano)
      grade TEXT,                      -- razred ali letnik ob oddaji (edina oznaka ob morebitni objavi)
      publish INTEGER NOT NULL DEFAULT 0, -- 1 = dovoli objavo brez imena
      consent TEXT,                    -- JSON {v, lang, text, at}: kaj je potrdil; ob preklicu dobi še withdrawn_at
      lang TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_pilot_mnenja_student ON pilot_mnenja(student_id, created_at);
    -- Kdaj je aplikacija nazadnje sama vprašala (največ enkrat na teden).
    CREATE TABLE IF NOT EXISTS pilot_mnenja_vprasano (
      student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
      asked_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

const ms = (sqlTime) => Date.parse(`${String(sqlTime).replace(" ", "T")}Z`);
const sqlTime = (d) => new Date(d).toISOString().slice(0, 19).replace("T", " ");

// Objavo sme dovoliti samo profil z znano letnico rojstva, ki ni mlajši od 15 (previdno kot pri fotografijah v
// pilotu: v letu 15. rojstnega dne še šteje kot mlajši).
export function publishAllowed(db, studentId, now = new Date()) {
  try {
    if (!hasCol(db, "students", "birth_year")) return false;
    const y = db.prepare("SELECT birth_year FROM students WHERE id = ?").get(studentId)?.birth_year;
    return Number.isInteger(y) && now.getFullYear() - y > PUBLISH_MIN_AGE;
  } catch {
    return false;
  }
}

// Smiselna uporaba: vsaj MIN_DAYS dni z vajo ali vsaj MIN_SOLVED rešenih nalog.
export function usageOf(db, studentId) {
  const days = db.prepare("SELECT COUNT(DISTINCT substr(created_at, 1, 10)) AS n FROM xp_events WHERE student_id = ?").get(studentId).n;
  const solved = db.prepare("SELECT COUNT(*) AS n FROM tasks WHERE student_id = ? AND solved = 1").get(studentId).n;
  return { days, solved };
}

export function opinionState(db, studentId, { now = new Date() } = {}) {
  if (!pilotMember(db, studentId)) return { member: false };
  migrateOpinions(db);
  const last = db.prepare("SELECT created_at FROM pilot_mnenja WHERE student_id = ? ORDER BY id DESC LIMIT 1").get(studentId);
  const asked = db.prepare("SELECT asked_at FROM pilot_mnenja_vprasano WHERE student_id = ?").get(studentId);
  const { days, solved } = usageOf(db, studentId);
  const t = now.getTime();
  const due =
    (days >= MIN_DAYS || solved >= MIN_SOLVED) &&
    (!asked || t - ms(asked.asked_at) >= ASK_EVERY_DAYS * 864e5) &&
    (!last || t - ms(last.created_at) >= AFTER_OPINION_DAYS * 864e5);
  return {
    member: true,
    due,
    canPublish: publishAllowed(db, studentId, now),
    sent: db.prepare("SELECT COUNT(*) AS n FROM pilot_mnenja WHERE student_id = ?").get(studentId).n,
    // Ali ima katero od oddanih mnenj dovoljenje za objavo (za gumb »Prekliči dovoljenje za objavo«).
    published: !!db.prepare("SELECT 1 FROM pilot_mnenja WHERE student_id = ? AND publish = 1 LIMIT 1").get(studentId),
  };
}

const text = (v, name) => {
  const s = typeof v === "string" ? cleanText(v.replace(/\s+/g, " "), TEXT_MAX) : "";
  if (!s) return null;
  return seal(name && name.length > 1 ? s.replaceAll(name, "[ime]") : s);
};

// Seznam za skrbnika: brez imena, brez številke profila, brez ure (samo mesec); najnovejša najprej.
export function opinionsReport(db) {
  migrateOpinions(db);
  const rows = db
    .prepare("SELECT stars, liked, bothers, grade, publish, substr(created_at, 1, 7) AS month FROM pilot_mnenja ORDER BY id DESC LIMIT 500")
    .all()
    .map((r) => ({ stars: r.stars, liked: unseal(r.liked, null) || "", bothers: unseal(r.bothers, null) || "", grade: r.grade || "", publish: !!r.publish, month: r.month }));
  const n = rows.length;
  return { n, avg: n ? Math.round((rows.reduce((a, r) => a + r.stars, 0) / n) * 10) / 10 : null, opinions: rows };
}

export function mountOpinions(app, store, { loadStudent, accounts = false, isLocalRequest = () => false }) {
  const db = store.db;
  migrateOpinions(db);
  const isAdmin = (req) => (accounts ? !!req.parent?.is_admin : isLocalRequest(req));
  const member = (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return null;
    if (!pilotMember(db, s.id)) {
      res.status(403).json({ error: "Mnenja so samo za člane pilota." });
      return null;
    }
    return s;
  };

  app.get("/api/students/:id/pilot/mnenje", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    res.set("Cache-Control", "no-store").json(opinionState(db, s.id));
  });

  // Aplikacija je vprašanje pokazala: naslednjič najprej čez teden dni (tudi če ga učenec zapre brez odgovora).
  app.post("/api/students/:id/pilot/mnenje/vprasano", (req, res) => {
    const s = member(req, res);
    if (!s) return;
    db.prepare("INSERT INTO pilot_mnenja_vprasano (student_id, asked_at) VALUES (?, datetime('now')) ON CONFLICT(student_id) DO UPDATE SET asked_at = excluded.asked_at").run(s.id);
    res.json(opinionState(db, s.id));
  });

  app.post("/api/students/:id/pilot/mnenje", (req, res) => {
    const s = member(req, res);
    if (!s) return;
    const b = req.body || {};
    const stars = Number(b.stars);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) return res.status(400).json({ error: "Izberi oceno od 1 do 5." });
    if (db.prepare("SELECT COUNT(*) AS n FROM pilot_mnenja WHERE student_id = ? AND created_at >= ?").get(s.id, sqlTime(Date.now() - 864e5)).n >= DAILY_MAX)
      return res.status(429).json({ error: "Za danes je mnenj dovolj. Hvala!" });
    // Dovoljenje za objavo: samo izrecna vrednost true, samo za profil, ki ni mlajši od 15 let, in samo z besedilom,
    // ki ga je učenec videl ob stikalu (dokaz privolitve).
    const consentText = cleanText(b.consent_text, 400);
    const publish = b.publish === true && publishAllowed(db, s.id) && !!consentText;
    const lang = cleanText(b.lang, 12) || s.settings?.language || "sl";
    const consent = publish ? JSON.stringify({ v: CONSENT_VERSION, lang, text: consentText, at: new Date().toISOString() }) : null;
    db.prepare("INSERT INTO pilot_mnenja (student_id, stars, liked, bothers, grade, publish, consent, lang) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
      s.id,
      stars,
      text(b.liked, s.name),
      text(b.bothers, s.name),
      cleanText(s.settings?.curriculum_level, 60) || null,
      publish ? 1 : 0,
      consent,
      lang,
    );
    db.prepare("INSERT INTO pilot_mnenja_vprasano (student_id, asked_at) VALUES (?, datetime('now')) ON CONFLICT(student_id) DO UPDATE SET asked_at = excluded.asked_at").run(s.id);
    res.status(201).json({ ...opinionState(db, s.id), publish });
  });

  // Preklic dovoljenja za objavo (vsa mnenja profila). Tudi bivši član pilota ga lahko prekliče.
  app.post("/api/students/:id/pilot/mnenje/objava", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    if (req.body?.publish !== false) return res.status(400).json({ error: "Tukaj lahko dovoljenje samo prekličeš." });
    const at = new Date().toISOString();
    for (const r of db.prepare("SELECT id, consent FROM pilot_mnenja WHERE student_id = ? AND publish = 1").all(s.id)) {
      let c = {};
      try {
        c = JSON.parse(r.consent) || {};
      } catch {}
      db.prepare("UPDATE pilot_mnenja SET publish = 0, consent = ? WHERE id = ?").run(JSON.stringify({ ...c, withdrawn_at: at }), r.id);
    }
    res.json(opinionState(db, s.id));
  });

  app.get("/api/admin/pilot-mnenja", (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: "Samo za skrbnika." });
    res.set("Cache-Control", "no-store").json(opinionsReport(db));
  });
}
