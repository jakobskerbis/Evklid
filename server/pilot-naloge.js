// Naloge za člane pilota (j 2026-11-06): »Pomagaj izboljšati Evklid« v zavihku Jaz.
// 1. skeniranje 10 nalog pod različnimi pogoji z oceno »Prebrano prav / narobe«,
// 2. preizkus petih delov aplikacije (»Deluje / Ne deluje«), 3. kje je zastavica za prijavo napake,
// 4. kratka anketa po enem tednu. Nagrada: značka »Pilot« (zbirka »Zmage na lestvicah«, skrita drugim) in XP,
// vsaka točka enkrat (pilot_rewards). Sodelovanje je prostovoljno.
//
// Kdo je v pilotu: račun, ki ga skrbnik označi (parents.pilot_at, Račun → »Pilot: naloge članov«), učenec šole
// s pilotno licenco (server/schools.js) ali vsi, ko je EVKLID_PILOT_VSI=1 (samo za preizkus na lastnem računalniku).
//
// Zasebnost: shranimo oceno, kratko opombo (šifrirano) in prepis naloge (šifrirano). Fotografijo samo ob izrecnem
// soglasju (kljukica ob nalogi), samo za profil, star vsaj 15 let (ista previdna meja kot soglasja v
// accounts/index.js); mlajšim kljukice ne ponudimo. Fotografija je šifrirana, izbriše se po PHOTO_DAYS dneh
// (zasebnost.js, runRetention) ali takoj, ko jo učenec izbriše. Skrbnik vidi samo vsote brez imen in e-naslovov.
import { seal, unseal } from "./crypto-polje.js";
import { cleanText } from "./settings.js";
import { schoolAccess } from "./schools.js";
import { ensureKnowledgeTables } from "./zbirke.js";
import { audit } from "./dnevnik-dostopov.js";

export const SCAN_CONDITIONS = ["light", "dark", "tilted", "handwritten", "printed", "board", "screen", "crumpled", "many", "notation"];
// Pet delov aplikacije za preizkus; »exams« (NPZ in matura) ima, kdor ima ta zavihek, drugi »3d«.
export const FEATURES = ["chat", "textbook", "graph", "cards", "exams", "3d"];
export const FEATURES_SHOWN = 5;
export const SURVEY_SCALE = ["overall", "tutor", "scan", "school"];
export const SURVEY_IMPROVE = ["tutor", "textbook", "practice", "scan", "calc", "speed", "look"];
export const SURVEY_AFTER_DAYS = 7;
// XP za vsako opravljeno točko (enkrat): 10 skeniranj, 5 delov, zastavica, anketa.
export const XP = { scan: 10, feature: 5, flag: 5, survey: 20 };
export const TOTAL = SCAN_CONDITIONS.length + FEATURES_SHOWN + 2;
export const BADGE = "pilot";
const NOTE_MAX = 300;
const MAX_IMAGE = 6 * 1024 * 1024;
const PROBLEMS_MAX = 5;
export const photoDays = () => {
  const n = Number(process.env.EVKLID_PILOT_PHOTO_DAYS);
  return Number.isInteger(n) && n > 0 && n <= 90 ? n : 30;
};
// Besedilo soglasja, kot ga shranimo ob fotografiji (dokaz, kaj je učenec potrdil).
export const PHOTO_CONSENT_TEXT = (n = photoDays()) =>
  `Shrani fotografijo, da izboljšamo branje. Na fotografiji naj bo samo naloga, brez obrazov in imen. Hranimo jo ${n} dni, nato se sama izbriše. Prej jo lahko izbrišeš pod »Pomagaj izboljšati Evklid«.`;

export function migratePilotTasks(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pilot_state (
      student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
      joined_at TEXT NOT NULL DEFAULT (datetime('now')),
      intro_at TEXT,                 -- obvestilo ob prvi prijavi zaprto (»Poglej naloge«, »Pozneje« ali ×)
      survey_notice_at TEXT          -- obvestilo o anketi po enem tednu zaprto
    );
    CREATE TABLE IF NOT EXISTS pilot_scans (
      id INTEGER PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      cond TEXT NOT NULL,            -- pogoj (SCAN_CONDITIONS)
      ok INTEGER NOT NULL,           -- 1 = prebrano prav
      note TEXT,                     -- šifrirano
      problems TEXT,                 -- prepis naloge (JSON, šifrirano)
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (student_id, cond)
    );
    CREATE TABLE IF NOT EXISTS pilot_photos (
      scan_id INTEGER PRIMARY KEY REFERENCES pilot_scans(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      image TEXT NOT NULL,           -- data URL, šifrirano
      consent TEXT NOT NULL,         -- besedilo, ki ga je učenec potrdil
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS pilot_features (
      id INTEGER PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      feature TEXT NOT NULL,
      ok INTEGER NOT NULL,
      note TEXT,                     -- šifrirano
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (student_id, feature)
    );
    CREATE TABLE IF NOT EXISTS pilot_survey (
      student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
      answers TEXT NOT NULL,         -- {"overall":1–5, …, "improve":"tutor"}
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    -- Nagrade: vsaka točka enkrat (scan:light, feature:chat, flag, survey). Ponovna ocena ne da novih XP.
    CREATE TABLE IF NOT EXISTS pilot_rewards (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      item TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (student_id, item)
    );
  `);
}

const hasParents = (db) => !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'parents'").get();
const hasCol = (db, t, c) => db.prepare(`PRAGMA table_info(${t})`).all().some((x) => x.name === c);

// Ali je profil v pilotu: "all" (EVKLID_PILOT_VSI=1), "account" (skrbnik označil račun), "school" (pilotna šola) ali null.
export function pilotMember(db, studentId) {
  if (process.env.EVKLID_PILOT_VSI === "1") return "all";
  try {
    if (hasParents(db) && hasCol(db, "parents", "pilot_at")) {
      const r = db.prepare("SELECT p.pilot_at FROM students s JOIN parents p ON p.id = s.parent_id WHERE s.id = ?").get(studentId);
      if (r?.pilot_at) return "account";
    }
  } catch {}
  try {
    if (schoolAccess(db, studentId)?.plan === "pilot") return "school";
  } catch {}
  return null;
}

// Fotografijo smemo ponuditi samo profilu z znano letnico rojstva, ki ni mlajši od 15 (previdno kot pri soglasjih:
// v letu 15. rojstnega dne še štejemo kot mlajšega).
export function photoAllowed(db, studentId, now = new Date()) {
  try {
    if (!hasCol(db, "students", "birth_year")) return false;
    const y = db.prepare("SELECT birth_year FROM students WHERE id = ?").get(studentId)?.birth_year;
    return Number.isInteger(y) && now.getFullYear() - y > 15;
  } catch {
    return false;
  }
}

const addDays = (sqlTime, days) => new Date(Date.parse(`${String(sqlTime).replace(" ", "T")}Z`) + days * 864e5);

export function pilotState(db, studentId, { now = new Date() } = {}) {
  const member = pilotMember(db, studentId);
  if (!member) return { member: false };
  migratePilotTasks(db);
  db.prepare("INSERT OR IGNORE INTO pilot_state (student_id) VALUES (?)").run(studentId);
  const st = db.prepare("SELECT * FROM pilot_state WHERE student_id = ?").get(studentId);
  const scans = {};
  for (const r of db.prepare("SELECT s.cond, s.ok, s.created_at, (p.scan_id IS NOT NULL) AS photo FROM pilot_scans s LEFT JOIN pilot_photos p ON p.scan_id = s.id WHERE s.student_id = ?").all(studentId))
    scans[r.cond] = { ok: !!r.ok, photo: !!r.photo, at: r.created_at };
  const features = {};
  for (const r of db.prepare("SELECT feature, ok, note FROM pilot_features WHERE student_id = ?").all(studentId)) features[r.feature] = { ok: !!r.ok, note: !!r.note };
  const rewards = new Set(db.prepare("SELECT item FROM pilot_rewards WHERE student_id = ?").all(studentId).map((r) => r.item));
  const survey = !!db.prepare("SELECT 1 FROM pilot_survey WHERE student_id = ?").get(studentId);
  const opens = addDays(st.joined_at, SURVEY_AFTER_DAYS);
  const surveyOpen = now >= opens;
  const done =
    Object.keys(scans).length + Math.min(FEATURES_SHOWN, Object.keys(features).length) + (rewards.has("flag") ? 1 : 0) + (survey ? 1 : 0);
  return {
    member: true,
    via: member,
    intro: !st.intro_at,
    surveyOpen,
    surveyOpensAt: opens.toISOString(),
    surveyNotice: surveyOpen && !survey && !st.survey_notice_at,
    photo: { allowed: photoAllowed(db, studentId, now), days: photoDays() },
    scans,
    features,
    flag: rewards.has("flag"),
    survey,
    badge: rewards.size > 0,
    done,
    total: TOTAL,
    xp: XP,
  };
}

// Prva nagrada da še značko »Pilot«. Vrne XP, ki jih je točka prinesla (0, če jih je že dobila).
function reward(db, progress, studentId, item, amount) {
  const first = !db.prepare("SELECT 1 FROM pilot_rewards WHERE student_id = ? LIMIT 1").get(studentId);
  const n = db.prepare("INSERT OR IGNORE INTO pilot_rewards (student_id, item) VALUES (?, ?)").run(studentId, item).changes;
  if (!n) return 0;
  if (first) {
    ensureKnowledgeTables(db);
    db.prepare("INSERT OR IGNORE INTO knowledge_items (student_id, item, topic_id, source) VALUES (?, ?, NULL, 'pilot')").run(studentId, BADGE);
  }
  if (progress) progress.award(studentId, [[amount, `pilot: ${item}`]]);
  else db.prepare("INSERT INTO xp_events (student_id, amount, reason) VALUES (?, ?, ?)").run(studentId, amount, `pilot: ${item}`);
  return amount;
}

const note = (v, name) => {
  const s = cleanText(v, NOTE_MAX);
  if (!s) return null;
  return seal(name && name.length > 1 ? s.replaceAll(name, "[ime]") : s);
};

// ---------- skrbnik: vsote brez imen (Račun → »Pilot: naloge članov«, scripts/pilot-naloge.js) ----------
export function pilotTasksReport(db) {
  migratePilotTasks(db);
  const scanRows = db.prepare("SELECT cond, COUNT(*) AS n, SUM(ok) AS ok FROM pilot_scans GROUP BY cond").all();
  const byCond = Object.fromEntries(scanRows.map((r) => [r.cond, r]));
  const scans = SCAN_CONDITIONS.map((c) => {
    const r = byCond[c] || { n: 0, ok: 0 };
    return { cond: c, n: r.n, ok: r.ok || 0, rate: r.n ? (r.ok || 0) / r.n : null };
  });
  const featRows = db.prepare("SELECT feature, COUNT(*) AS n, SUM(1 - ok) AS bad FROM pilot_features GROUP BY feature").all();
  const byFeat = Object.fromEntries(featRows.map((r) => [r.feature, r]));
  const features = FEATURES.map((f) => ({ feature: f, n: byFeat[f]?.n || 0, bad: byFeat[f]?.bad || 0 }));
  // Opombe brez imena in brez časa (vrstni red naključen po id-ju ne razkrije, kdo je pisal).
  const open = (v) => unseal(v, null);
  const notes = [
    ...db.prepare("SELECT 'scan' AS kind, cond AS what, ok, note FROM pilot_scans WHERE note IS NOT NULL").all(),
    ...db.prepare("SELECT 'feature' AS kind, feature AS what, ok, note FROM pilot_features WHERE note IS NOT NULL").all(),
  ]
    .map((r) => ({ kind: r.kind, what: r.what, ok: !!r.ok, note: open(r.note) }))
    .filter((r) => r.note)
    .sort((a, b) => a.kind.localeCompare(b.kind) || a.what.localeCompare(b.what) || a.note.localeCompare(b.note));
  const answers = db.prepare("SELECT answers FROM pilot_survey").all().map((r) => {
    try {
      return JSON.parse(r.answers);
    } catch {
      return {};
    }
  });
  const avg = Object.fromEntries(
    SURVEY_SCALE.map((q) => {
      const v = answers.map((a) => a[q]).filter((x) => Number.isInteger(x));
      return [q, v.length ? Math.round((v.reduce((s, x) => s + x, 0) / v.length) * 10) / 10 : null];
    }),
  );
  const improve = Object.fromEntries(SURVEY_IMPROVE.map((k) => [k, answers.filter((a) => a.improve === k).length]));
  const members = db.prepare("SELECT COUNT(*) AS n FROM pilot_state").get().n;
  const photos = db.prepare("SELECT COUNT(*) AS n FROM pilot_photos").get().n;
  const photoList = db.prepare("SELECT p.scan_id AS id, s.cond, s.ok FROM pilot_photos p JOIN pilot_scans s ON s.id = p.scan_id ORDER BY s.cond, p.scan_id").all()
    .map((r) => ({ id: r.id, cond: r.cond, ok: !!r.ok }));
  return { members, scans, features, notes, survey: { n: answers.length, avg, improve }, photos, photoList };
}

// Povzetek za jutranji pregled (Markdown, brez osebnih podatkov).
export function pilotTasksMarkdown(r) {
  const pc = (x) => (x == null ? "–" : `${Math.round(x * 100)} %`);
  const lines = [`# Pilot: naloge članov`, ``, `Člani, ki so odprli naloge: ${r.members}. Shranjenih fotografij: ${r.photos}.`, ``, `## Branje po pogojih`, ``, `| Pogoj | Ocen | Prav | Delež |`, `|---|---|---|---|`];
  for (const s of r.scans) lines.push(`| ${s.cond} | ${s.n} | ${s.ok} | ${pc(s.rate)} |`);
  lines.push(``, `## Deli aplikacije`, ``, `| Del | Ocen | Ne deluje |`, `|---|---|---|`);
  for (const f of r.features) lines.push(`| ${f.feature} | ${f.n} | ${f.bad} |`);
  lines.push(``, `## Anketa (${r.survey.n})`, ``);
  for (const [q, v] of Object.entries(r.survey.avg)) lines.push(`- ${q}: ${v ?? "–"}`);
  lines.push(`- izboljšati najprej: ${Object.entries(r.survey.improve).filter(([, n]) => n).map(([k, n]) => `${k} ${n}`).join(", ") || "–"}`);
  if (r.notes.length) {
    lines.push(``, `## Opombe`, ``);
    for (const n of r.notes) lines.push(`- ${n.kind}/${n.what} (${n.ok ? "prav/deluje" : "narobe/ne deluje"}): ${n.note.replace(/\s+/g, " ")}`);
  }
  return `${lines.join("\n")}\n`;
}

// ---------- API ----------
export function mountPilotTasks(app, store, { loadStudent, progress = null, accounts = false, isLocalRequest = () => false }) {
  const db = store.db;
  migratePilotTasks(db);
  const isAdmin = (req) => (accounts ? !!req.parent?.is_admin : isLocalRequest(req));
  const member = (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return null;
    if (!pilotMember(db, s.id)) {
      res.status(403).json({ error: "Naloge so samo za člane pilota." });
      return null;
    }
    db.prepare("INSERT OR IGNORE INTO pilot_state (student_id) VALUES (?)").run(s.id);
    return s;
  };
  const reply = (res, s, gained = 0) => res.json({ ...pilotState(db, s.id), gained });

  app.get("/api/students/:id/pilot", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    res.set("Cache-Control", "no-store").json(pilotState(db, s.id));
  });

  // Obvestilo zaprto: { what: "intro" | "survey" } (enkrat; ponovno odprtje je vedno v zavihku Jaz).
  app.post("/api/students/:id/pilot/seen", (req, res) => {
    const s = member(req, res);
    if (!s) return;
    const col = { intro: "intro_at", survey: "survey_notice_at" }[req.body?.what];
    if (!col) return res.status(400).json({ error: "Napačna zahteva." });
    db.prepare(`UPDATE pilot_state SET ${col} = COALESCE(${col}, datetime('now')) WHERE student_id = ?`).run(s.id);
    reply(res, s);
  });

  // Ocena branja: { cond, ok, note?, problems?: [besedilo], image?: dataURL, consent?: true }
  app.post("/api/students/:id/pilot/scan", (req, res) => {
    const s = member(req, res);
    if (!s) return;
    const b = req.body || {};
    if (!SCAN_CONDITIONS.includes(b.cond) || typeof b.ok !== "boolean") return res.status(400).json({ error: "Napačna zahteva." });
    const problems = Array.isArray(b.problems) ? b.problems.filter((p) => typeof p === "string").slice(0, PROBLEMS_MAX).map((p) => p.slice(0, 600)) : [];
    let image = null;
    if (b.image != null && b.consent === true) {
      // Fotografija samo ob soglasju in samo, kjer jo smemo ponuditi; sicer zavrnemo celo zahtevo (nič ne shranimo).
      if (!photoAllowed(db, s.id)) return res.status(403).json({ error: "Fotografije za ta profil ne shranjujemo.", photo: false });
      const m = /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.exec(String(b.image));
      if (!m || b.image.length > MAX_IMAGE) return res.status(400).json({ error: "Slika manjka ali je prevelika." });
      image = b.image;
    }
    const n = note(b.note, s.name);
    const prev = db.prepare("SELECT id FROM pilot_scans WHERE student_id = ? AND cond = ?").get(s.id, b.cond);
    db.exec("BEGIN IMMEDIATE");
    try {
      let id;
      if (prev) {
        db.prepare("UPDATE pilot_scans SET ok = ?, note = ?, problems = ?, created_at = datetime('now') WHERE id = ?").run(b.ok ? 1 : 0, n, problems.length ? seal(JSON.stringify(problems)) : null, prev.id);
        id = prev.id;
        // Nova ocena istega pogoja: stara fotografija ne sodi več k njej.
        db.prepare("DELETE FROM pilot_photos WHERE scan_id = ?").run(id);
      } else {
        id = db
          .prepare("INSERT INTO pilot_scans (student_id, cond, ok, note, problems) VALUES (?, ?, ?, ?, ?)")
          .run(s.id, b.cond, b.ok ? 1 : 0, n, problems.length ? seal(JSON.stringify(problems)) : null).lastInsertRowid;
      }
      if (image) db.prepare("INSERT INTO pilot_photos (scan_id, student_id, image, consent) VALUES (?, ?, ?, ?)").run(id, s.id, seal(image), PHOTO_CONSENT_TEXT());
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
    reply(res, s, reward(db, progress, s.id, `scan:${b.cond}`, XP.scan));
  });

  // Učenec izbriše svojo fotografijo (ocena ostane).
  app.delete("/api/students/:id/pilot/scan/:cond/photo", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    if (!SCAN_CONDITIONS.includes(req.params.cond)) return res.status(400).json({ error: "Napačna zahteva." });
    db.prepare("DELETE FROM pilot_photos WHERE scan_id IN (SELECT id FROM pilot_scans WHERE student_id = ? AND cond = ?)").run(s.id, req.params.cond);
    res.json({ ...pilotState(db, s.id), gained: 0 });
  });

  // Del aplikacije: { feature, ok, note? }; samo opomba k že dani oceni: { feature, note } (ok ostane).
  app.post("/api/students/:id/pilot/feature", (req, res) => {
    const s = member(req, res);
    if (!s) return;
    const b = req.body || {};
    if (!FEATURES.includes(b.feature)) return res.status(400).json({ error: "Napačna zahteva." });
    const prev = db.prepare("SELECT id, ok FROM pilot_features WHERE student_id = ? AND feature = ?").get(s.id, b.feature);
    if (typeof b.ok !== "boolean" && !prev) return res.status(400).json({ error: "Napačna zahteva." });
    const ok = typeof b.ok === "boolean" ? (b.ok ? 1 : 0) : prev.ok;
    const n = note(b.note, s.name);
    if (prev) db.prepare("UPDATE pilot_features SET ok = ?, note = COALESCE(?, note), created_at = datetime('now') WHERE id = ?").run(ok, n, prev.id);
    else db.prepare("INSERT INTO pilot_features (student_id, feature, ok, note) VALUES (?, ?, ?, ?)").run(s.id, b.feature, ok, n);
    reply(res, s, reward(db, progress, s.id, `feature:${b.feature}`, XP.feature));
  });

  // »Razumem« pri zastavici.
  app.post("/api/students/:id/pilot/flag", (req, res) => {
    const s = member(req, res);
    if (!s) return;
    reply(res, s, reward(db, progress, s.id, "flag", XP.flag));
  });

  // Anketa po enem tednu: { answers: { overall: 1–5, … }, improve }
  app.post("/api/students/:id/pilot/survey", (req, res) => {
    const s = member(req, res);
    if (!s) return;
    if (!pilotState(db, s.id).surveyOpen) return res.status(409).json({ error: "Anketa še ni odprta." });
    const a = req.body?.answers || {};
    const out = {};
    for (const q of SURVEY_SCALE) {
      if (!(Number.isInteger(a[q]) && a[q] >= 1 && a[q] <= 5)) return res.status(400).json({ error: "Odgovori na vsa vprašanja." });
      out[q] = a[q];
    }
    if (!SURVEY_IMPROVE.includes(req.body?.improve)) return res.status(400).json({ error: "Odgovori na vsa vprašanja." });
    out.improve = req.body.improve;
    db.prepare("INSERT INTO pilot_survey (student_id, answers) VALUES (?, ?) ON CONFLICT(student_id) DO UPDATE SET answers = excluded.answers, created_at = datetime('now')").run(
      s.id,
      JSON.stringify(out),
    );
    reply(res, s, reward(db, progress, s.id, "survey", XP.survey));
  });

  // --- skrbnik ---
  app.get("/api/admin/pilot-naloge", (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: "Samo za skrbnika." });
    const r = pilotTasksReport(db);
    let accountsList = [];
    if (accounts && hasParents(db) && hasCol(db, "parents", "pilot_at")) accountsList = db.prepare("SELECT email FROM parents WHERE pilot_at IS NOT NULL ORDER BY email").all().map((x) => x.email);
    res.set("Cache-Control", "no-store").json({ ...r, accounts: accountsList, canAdd: !!accounts });
  });

  // Skrbnik doda ali odstrani račun iz pilota: { email, on }
  app.post("/api/admin/pilot-naloge/clani", (req, res) => {
    if (!accounts) return res.status(404).json({ error: "Računi niso vklopljeni." });
    if (!isAdmin(req)) return res.status(403).json({ error: "Samo za skrbnika." });
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
    if (!email || email.length > 200) return res.status(400).json({ error: "Vpiši e-naslov." });
    const p = db.prepare("SELECT id FROM parents WHERE email = ?").get(email);
    if (!p) return res.status(404).json({ error: "Račun s tem e-naslovom ne obstaja." });
    const on = req.body?.on !== false;
    db.prepare(`UPDATE parents SET pilot_at = ${on ? "COALESCE(pilot_at, datetime('now'))" : "NULL"} WHERE id = ?`).run(p.id);
    audit(db, { req, parentId: req.parent?.id ?? null, actor: "admin", action: on ? "pilot_add" : "pilot_remove", target: `parent:${p.id}` });
    res.json({ ok: true });
  });

  // Fotografija za izboljšave branja (samo skrbnik; zapis v dnevnik dostopov).
  app.get("/api/admin/pilot-naloge/foto/:id", (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: "Samo za skrbnika." });
    const id = /^\d{1,12}$/.test(req.params.id) ? Number(req.params.id) : NaN;
    const r = Number.isInteger(id) ? db.prepare("SELECT image FROM pilot_photos WHERE scan_id = ?").get(id) : null;
    if (!r) return res.status(404).json({ error: "Fotografija ne obstaja." });
    const m = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(unseal(r.image, "") || "");
    if (!m) return res.status(404).json({ error: "Fotografija ne obstaja." });
    audit(db, { req, parentId: req.parent?.id ?? null, actor: "admin", action: "pilot_photo", target: `scan:${id}` });
    res.set({ "Content-Type": m[1], "Cache-Control": "no-store" }).send(Buffer.from(m[2], "base64"));
  });
}
