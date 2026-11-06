// Naloge za člane pilota (j 2026-11-06): »Pomagaj izboljšati Evklid« v zavihku Jaz.
// 1. skeniranje 10 nalog pod različnimi pogoji z oceno »Prebrano prav / narobe«,
// 2. preizkus petih delov aplikacije (»Deluje / Ne deluje«), 3. kje je zastavica za prijavo napake,
// 4. kratka anketa po enem tednu, 5. preizkus znanja na začetku in čez 14 dni (server/pilot-ucinek.js). Nagrada: značka »Pilot« (zbirka »Zmage na lestvicah«, skrita drugim) in XP,
// vsaka točka enkrat (pilot_rewards). Sodelovanje je prostovoljno.
//
// Kdo je v pilotu: račun, ki ga skrbnik označi (parents.pilot_at, Račun → »Pilot: naloge članov«), učenec šole
// s pilotno licenco (server/schools.js) ali vsi, ko je EVKLID_PILOT_VSI=1 (samo za preizkus na lastnem računalniku).
//
// Zasebnost: shranimo oceno, kratko opombo (šifrirano) in prepis naloge (šifrirano). Fotografijo samo ob izrecnem
// soglasju (kljukica ob nalogi), samo za profil, star vsaj 15 let (ista previdna meja kot soglasja v
// accounts/index.js); mlajšim kljukice ne ponudimo. Brez ključa EVKLID_DATA_KEY fotografij ne sprejmemo (sicer bi bile
// nešifrirane). Prepis naloge shranimo samo skupaj s fotografijo. Fotografija se izbriše ob expires_at (največ 30 dni,
// zasebnost.js runRetention), ob izstopu računa iz pilota ali takoj, ko jo učenec ali starš izbriše; v varnostne kopije
// ne gre (kopije.js). Skrbnik vidi vsote šele od MIN_GROUP odgovorov naprej, opombe brez imena profila, fotografije
// s soglasjem (vsak ogled v dnevniku dostopov) in e-naslove računov, ki jih je sam dodal v pilot.
import { seal, unseal, encryptionOn } from "./crypto-polje.js";
import { cleanText } from "./settings.js";
import { schoolAccess } from "./schools.js";
import { ensureKnowledgeTables } from "./zbirke.js";
import { audit } from "./dnevnik-dostopov.js";
import { quizState, wtpState, impactReport, mountPilotImpact, block, shownN } from "./pilot-ucinek.js";

export const SCAN_CONDITIONS = ["light", "dark", "tilted", "handwritten", "printed", "board", "screen", "crumpled", "many", "notation"];
// Pet delov aplikacije za preizkus; »exams« (NPZ in matura) ima, kdor ima ta zavihek, drugi »3d«.
export const FEATURES = ["chat", "textbook", "graph", "cards", "exams", "3d"];
export const FEATURES_SHOWN = 5;
export const SURVEY_SCALE = ["overall", "tutor", "scan", "school"];
export const SURVEY_IMPROVE = ["tutor", "textbook", "practice", "scan", "calc", "speed", "look"];
export const SURVEY_AFTER_DAYS = 7;
// XP za vsako opravljeno točko (enkrat): 10 skeniranj, 5 delov, zastavica, anketa.
export const XP = { scan: 10, feature: 5, flag: 5, survey: 20, quiz: 10 }; // quiz: za opravljen preizkus (pred, po), ne za rezultat
export const TOTAL = SCAN_CONDITIONS.length + FEATURES_SHOWN + 2 + 2;
export const BADGE = "pilot";
const NOTE_MAX = 300;
// Odjemalec pošlje izrez ≤ 1600 px (JPEG 0,88), torej ≤ ~1,5 MB; več ne sprejmemo.
const MAX_IMAGE = 2 * 1024 * 1024;
// Največ toliko shranjenih fotografij na profil na dan (vsaka prepiše prejšnjo istega pogoja, a gre skozi WAL in AES).
export const PHOTO_DAILY_MAX = 30;
// Vsote in povprečja (anketa, deleži, opombe) pokažemo šele od toliko odgovorov naprej, da ne razkrijejo posameznika.
export const MIN_GROUP = 3;
export const PHOTO_MAX_DAYS = 30;
export const CONSENT_VERSION = 3; // 3: stavek o izbrisu (preklicu) je zdaj viden tudi ob kljukici (pregled A3)
// 2: jasno, da fotografijo ob branju prebere ponudnik AI (kot vsako skeniranje), shranjene kopije pa ne dobi
const PROBLEMS_MAX = 5;
export const photoDays = () => {
  const n = Number(process.env.EVKLID_PILOT_PHOTO_DAYS);
  return Number.isInteger(n) && n > 0 && n <= PHOTO_MAX_DAYS ? n : PHOTO_MAX_DAYS; // krajši rok je dovoljen, daljši ne
};
// Besedilo soglasja, kot ga shranimo ob fotografiji (dokaz, kaj je učenec potrdil).
export const PHOTO_CONSENT_TEXT = (n = photoDays()) =>
  `Shrani fotografijo, da izboljšamo branje. Na fotografiji naj bo samo naloga, brez obrazov in imen. Shranimo jo skupaj s prebranim besedilom. Vidi ju samo skrbnik Evklida. Hranimo ju ${n} ${n === 1 ? "dan" : n === 2 ? "dneva" : "dni"}, nato se sama izbrišeta. Kot pri vsakem skeniranju fotografijo prebere umetna inteligenca, da Evklid razume nalogo. Shranjene kopije ne pošljemo nikomur. Prej ju lahko izbrišeš pod »Pomagaj izboljšati Evklid«.`;
// Zapis soglasja: različica, jezik, v katerem ga je učenec videl, rok in slovensko besedilo te različice.
export const consentRecord = (lang, n = photoDays()) => JSON.stringify({ v: CONSENT_VERSION, lang, days: n, text: PHOTO_CONSENT_TEXT(n) });

export function migratePilotTasks(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pilot_state (
      student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
      joined_at TEXT NOT NULL DEFAULT (datetime('now')),
      intro_at TEXT,                 -- obvestilo ob prvi prijavi zaprto (»Poglej naloge«, »Pozneje« ali ×)
      survey_notice_at TEXT,         -- obvestilo o anketi po enem tednu zaprto
      quiz_notice_at TEXT,           -- obvestilo o drugem preizkusu znanja (čez 14 dni) zaprto
      photo_day TEXT,                -- dan (UTC) in število shranjenih fotografij tega dne (PHOTO_DAILY_MAX)
      photo_n INTEGER NOT NULL DEFAULT 0
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
      consent TEXT NOT NULL,         -- JSON {v, lang, days, text}: kaj je učenec potrdil
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT                -- izbris (rok iz soglasja, največ PHOTO_MAX_DAYS)
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
  // Prepis naloge velja skupaj s fotografijo (isto soglasje): ko fotografija izgine (izbris, rok, izstop, kopija),
  // izgine tudi prepis. Sproži se ob vsakem DELETE, tudi v varnostni kopiji (kopije.js).
  db.exec(`CREATE TRIGGER IF NOT EXISTS pilot_photo_gone AFTER DELETE ON pilot_photos BEGIN
    UPDATE pilot_scans SET problems = NULL WHERE id = OLD.scan_id;
  END`);
  // Migracije za baze iz prve različice (pred pregledom PR #474).
  if (!hasCol(db, "pilot_photos", "expires_at")) {
    db.exec("ALTER TABLE pilot_photos ADD COLUMN expires_at TEXT");
    db.exec(`UPDATE pilot_photos SET expires_at = datetime(created_at, '+${PHOTO_MAX_DAYS} days') WHERE expires_at IS NULL`);
  }
  if (!hasCol(db, "pilot_state", "photo_day")) db.exec("ALTER TABLE pilot_state ADD COLUMN photo_day TEXT");
  if (!hasCol(db, "pilot_state", "quiz_notice_at")) db.exec("ALTER TABLE pilot_state ADD COLUMN quiz_notice_at TEXT");
  if (!hasCol(db, "pilot_state", "photo_n")) db.exec("ALTER TABLE pilot_state ADD COLUMN photo_n INTEGER NOT NULL DEFAULT 0");
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
  if (!encryptionOn()) return false; // brez ključa bi bila fotografija v bazi in kopijah nešifrirana
  try {
    if (!hasCol(db, "students", "birth_year")) return false;
    const y = db.prepare("SELECT birth_year FROM students WHERE id = ?").get(studentId)?.birth_year;
    return Number.isInteger(y) && now.getFullYear() - y > 15;
  } catch {
    return false;
  }
}

// Bivši člani (šoli je potekla pilotna licenca, učenec je zapustil razred): fotografije izbrišemo pri dnevnem čiščenju
// (zasebnost.js runRetention), torej najpozneje v enem dnevu. Ob odstranitvi računa iz pilota takoj (clani, spodaj).
export function dropFormerPhotos(db) {
  if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'pilot_photos'").get()) return 0;
  const ids = db.prepare("SELECT DISTINCT student_id AS id FROM pilot_photos").all().map((r) => r.id).filter((id) => !pilotMember(db, id));
  let n = 0;
  for (const id of ids) n += Number(db.prepare("DELETE FROM pilot_photos WHERE student_id = ?").run(id).changes);
  return n;
}

// Za Račun (starš): ali je profil v pilotu in koliko fotografij je shranjenih.
// Vprašanje o plačilu v Računu (starš ali polnoleten imetnik računa, server/pilot-ucinek.js).
export function pilotWtp(db, parent) {
  return wtpState(db, parent, { isMember: (id) => !!pilotMember(db, id) });
}

export function pilotSummary(db, studentId) {
  let photos = 0;
  try {
    photos = db.prepare("SELECT COUNT(*) AS n FROM pilot_photos WHERE student_id = ?").get(studentId).n;
  } catch {}
  return { member: !!pilotMember(db, studentId), photos };
}

const addDays = (sqlTime, days) => new Date(Date.parse(`${String(sqlTime).replace(" ", "T")}Z`) + days * 864e5);

export function pilotState(db, studentId, { now = new Date() } = {}) {
  const member = pilotMember(db, studentId);
  if (!member) {
    // Bivši član (odstranjen iz pilota, šoli je potekla licenca): fotografije še lahko izbriše (Jaz, Račun).
    let photos = [];
    try {
      photos = db.prepare("SELECT s.cond FROM pilot_photos p JOIN pilot_scans s ON s.id = p.scan_id WHERE p.student_id = ? ORDER BY s.cond").all(studentId).map((r) => r.cond);
    } catch {}
    return photos.length ? { member: false, photos } : { member: false };
  }
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
  const quiz = quizState(db, studentId, now);
  const done =
    Object.keys(scans).length + Math.min(FEATURES_SHOWN, Object.keys(features).length) + (rewards.has("flag") ? 1 : 0) + (survey ? 1 : 0) + (quiz.pre.done ? 1 : 0) + (quiz.post.done ? 1 : 0);
  return {
    member: true,
    via: member,
    intro: !st.intro_at,
    surveyOpen,
    surveyOpensAt: opens.toISOString(),
    surveyNotice: surveyOpen && !survey && !st.survey_notice_at,
    quiz,
    quizNotice: quiz.postOpen && !quiz.post.done && !st.quiz_notice_at,
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
// Pod MIN_GROUP odgovori so deleži, povprečja in opombe null (UI: »Premalo odgovorov«), da ne razkrijejo posameznika.
// Proti razlikovanju (pregled B3, j 6. 11.): vsote se računajo samo iz prvih ⌊n/3⌋·3 odgovorov po vrsti vnosa, zato se
// spremenijo šele, ko pridejo vsaj 3 novi (iz dveh zaporednih poročil se odgovor enega ne da izračunati); število pod
// pragom je »< 3«. E-naslovi članov niso na isti strani kot vsote (/api/admin/pilot-naloge/clani).
export function pilotTasksReport(db) {
  migratePilotTasks(db);
  const few = (n) => n < MIN_GROUP;
  const B = (rows) => block(rows, MIN_GROUP);
  const N = (n) => shownN(n, MIN_GROUP);
  const scanRows = db.prepare("SELECT id, cond, ok FROM pilot_scans ORDER BY id").all();
  const scans = SCAN_CONDITIONS.map((c) => {
    const all = scanRows.filter((r) => r.cond === c);
    const b = B(all);
    const ok = b.filter((r) => r.ok).length;
    return b.length ? { cond: c, n: N(all.length), shown: b.length, ok, rate: ok / b.length } : { cond: c, n: N(all.length), shown: 0, ok: null, rate: null };
  });
  const featRows = db.prepare("SELECT id, feature, ok FROM pilot_features ORDER BY id").all();
  const features = FEATURES.map((f) => {
    const all = featRows.filter((r) => r.feature === f);
    const b = B(all);
    return { feature: f, n: N(all.length), shown: b.length, bad: b.length ? b.filter((r) => !r.ok).length : null };
  });
  // Opombe brez imena in brez časa; tudi te v paketih po 3 (nova opomba se ne pokaže sama), nato urejene po besedilu.
  const open = (v) => unseal(v, null);
  const noteRows = [
    ...db.prepare("SELECT 'scan' AS kind, id, cond AS what, ok, note FROM pilot_scans WHERE note IS NOT NULL").all(),
    ...db.prepare("SELECT 'feature' AS kind, id + 1000000000 AS id, feature AS what, ok, note FROM pilot_features WHERE note IS NOT NULL").all(),
  ]
    .map((r) => ({ id: r.id, kind: r.kind, what: r.what, ok: !!r.ok, note: open(r.note) }))
    .filter((r) => r.note)
    .sort((a, b) => a.id - b.id);
  const notes = B(noteRows)
    .map(({ id, ...r }) => r)
    .sort((a, b) => a.kind.localeCompare(b.kind) || a.what.localeCompare(b.what) || a.note.localeCompare(b.note));
  const allAnswers = db.prepare("SELECT answers FROM pilot_survey ORDER BY created_at, student_id").all().map((r) => {
    try {
      return JSON.parse(r.answers);
    } catch {
      return {};
    }
  });
  const answers = B(allAnswers);
  const avg = Object.fromEntries(
    SURVEY_SCALE.map((q) => {
      const v = answers.map((a) => a[q]).filter((x) => Number.isInteger(x));
      return [q, v.length ? Math.round((v.reduce((s, x) => s + x, 0) / v.length) * 10) / 10 : null];
    }),
  );
  const improve = answers.length ? Object.fromEntries(SURVEY_IMPROVE.map((k) => [k, answers.filter((a) => a.improve === k).length])) : null;
  // Samo trenutni člani (pilot_state ostane tudi po izstopu, zaradi izvoza in izbrisa).
  const members = db.prepare("SELECT student_id FROM pilot_state").all().filter((r) => pilotMember(db, r.student_id)).length;
  const photos = db.prepare("SELECT COUNT(*) AS n FROM pilot_photos").get().n;
  const photoList = db.prepare("SELECT p.scan_id AS id, s.cond, s.ok FROM pilot_photos p JOIN pilot_scans s ON s.id = p.scan_id ORDER BY s.cond, p.scan_id").all()
    .map((r) => ({ id: r.id, cond: r.cond, ok: !!r.ok }));
  // Opombe šele, ko je v pilotu vsaj MIN_GROUP članov.
  const showNotes = !few(members) && notes.length > 0;
  return {
    members,
    minGroup: MIN_GROUP,
    impact: impactReport(db, MIN_GROUP),
    scans,
    features,
    notes: showNotes ? notes : [],
    notesHidden: !showNotes && noteRows.length > 0,
    survey: { n: N(allAnswers.length), shown: answers.length, avg, improve, hidden: !answers.length },
    photos,
    photoList,
  };
}

// Povzetek za jutranji pregled (Markdown): samo števila, brez opomb in prostih besedil (te so na skrbniški strani).
export function pilotTasksMarkdown(r) {
  const pc = (x) => (x == null ? "–" : `${Math.round(x * 100)} %`);
  const num = (x) => (x == null ? "–" : x);
  const lines = [`# Pilot: naloge članov`, ``, `Člani v pilotu, ki so odprli naloge: ${r.members}. Shranjenih fotografij: ${r.photos}. Opomb: ${(r.notes || []).length || (r.notesHidden ? `manj kot ${r.minGroup} prikazanih` : 0)}.`, `Deleži in povprečja so prikazani šele od ${r.minGroup} odgovorov naprej (–) in se osvežijo šele po ${r.minGroup} novih (plačilo: po 5).`, ``, `## Branje po pogojih`, ``, `| Pogoj | Ocen | Prav | Delež |`, `|---|---|---|---|`];
  for (const s of r.scans) lines.push(`| ${s.cond} | ${s.n} | ${num(s.ok)} | ${pc(s.rate)} |`);
  lines.push(``, `## Deli aplikacije`, ``, `| Del | Ocen | Ne deluje |`, `|---|---|---|`);
  for (const f of r.features) lines.push(`| ${f.feature} | ${f.n} | ${num(f.bad)} |`);
  lines.push(``, `## Anketa (${r.survey.n})`, ``);
  for (const [q, v] of Object.entries(r.survey.avg)) lines.push(`- ${q}: ${v ?? "–"}`);
  lines.push(`- izboljšati najprej: ${r.survey.improve ? Object.entries(r.survey.improve).filter(([, n]) => n).map(([k, n]) => `${k} ${n}`).join(", ") || "–" : "–"}`);
  const q = r.impact?.quiz;
  const w = r.impact?.wtp;
  if (q) {
    lines.push(``, `## Preizkus znanja`, ``, `- začetni preizkus (brez stropa): ${q.nPre}, povprečje ${pc(q.pre)}`, `- oba preizkusa (isti učenci, brez stropa): ${q.nPaired}, prej ${pc(q.pairedPre)}, po 14 dneh ${pc(q.pairedPost)}, razlika ${q.diff == null ? "–" : `${q.diff >= 0 ? "+" : "−"}${Math.round(Math.abs(q.diff) * 100)} odstotnih točk`}`);
    const c = q.ceiling;
    if (q.allSkip) lines.push(`- preizkusi samo z »Ne vem« (niso v povprečjih): ${q.allSkip}`);
    if (c) lines.push(`- strop (prvič 6/6, dodatne težje naloge; posebej): ${c.nPre}, oba preizkusa ${c.nPaired}, prej ${pc(c.pairedPre)}, po 14 dneh ${pc(c.pairedPost)}, razlika ${c.diff == null ? "–" : `${c.diff >= 0 ? "+" : "−"}${Math.round(Math.abs(c.diff) * 100)} odstotnih točk`}`);
  }
  if (w) {
    const dist = (o) => (o ? Object.entries(o).filter(([, n]) => n).map(([k, n]) => `${k} ${n}`).join(", ") || "–" : "–");
    lines.push(``, `## Pripravljenost za plačilo (${w.n})`, ``, `- bi plačali: ${dist(w.pay)}`, `- znesek na mesec: ${dist(w.amount)}`);
  }
  return `${lines.join("\n")}\n`;
}

// Data URL slike: PNG, JPEG ali WebP z ujemajočimi se magičnimi bajti (ne poljubna datoteka s takim imenom).
function isImage(dataUrl) {
  const m = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!m) return false;
  const head = Buffer.from(m[2].slice(0, 24), "base64");
  if (m[1] === "jpeg") return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  if (m[1] === "png") return head.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  return head.subarray(0, 4).toString("latin1") === "RIFF" && head.subarray(8, 12).toString("latin1") === "WEBP";
}

// ---------- API ----------
export function mountPilotTasks(app, store, { loadStudent, progress = null, accounts = false, isLocalRequest = () => false, topicFor = () => null, nextTopicFor = () => null, owner = null }) {
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
  const reply = (res, s, gained = 0, extra = {}) => res.json({ ...pilotState(db, s.id), gained, ...extra });
  // Merjenje učinka: preizkus znanja (učenec) in vprašanje o plačilu (Račun).
  mountPilotImpact(app, db, {
    member,
    reply,
    reward: (sid, item) => reward(db, progress, sid, item, XP.quiz),
    topicFor,
    nextTopicFor,
    langFor: (sid) => progress?.taskLang?.(sid) || "sl",
    accounts,
    isMember: (id) => !!pilotMember(db, id),
    confirmOwner: owner?.confirmOwner || (async () => false),
  });

  app.get("/api/students/:id/pilot", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    res.set("Cache-Control", "no-store").json(pilotState(db, s.id));
  });

  // Obvestilo zaprto: { what: "intro" | "survey" | "quiz" } (enkrat; ponovno odprtje je vedno v zavihku Jaz).
  app.post("/api/students/:id/pilot/seen", (req, res) => {
    const s = member(req, res);
    if (!s) return;
    const col = { intro: "intro_at", survey: "survey_notice_at", quiz: "quiz_notice_at" }[req.body?.what];
    if (!col) return res.status(400).json({ error: "Napačna zahteva." });
    db.prepare(`UPDATE pilot_state SET ${col} = COALESCE(${col}, datetime('now')) WHERE student_id = ?`).run(s.id);
    reply(res, s);
  });

  // Ocena branja: { cond, ok, note?, problems?: [besedilo], image?: dataURL, consent?: true, lang? }
  // Prepis (problems) shranimo samo skupaj s fotografijo (isto soglasje); brez nje samo oceno in opombo.
  app.post("/api/students/:id/pilot/scan", (req, res) => {
    const s = member(req, res);
    if (!s) return;
    const b = req.body || {};
    if (!SCAN_CONDITIONS.includes(b.cond) || typeof b.ok !== "boolean") return res.status(400).json({ error: "Napačna zahteva." });
    let image = null;
    if (b.image != null && b.consent === true) {
      // Fotografija samo ob soglasju in samo, kjer jo smemo ponuditi; sicer zavrnemo celo zahtevo (nič ne shranimo).
      if (typeof b.image !== "string") return res.status(400).json({ error: "Slika manjka ali je prevelika." });
      if (!encryptionOn()) return res.status(503).json({ error: "Fotografij zdaj ne shranjujemo.", photo: false });
      if (!photoAllowed(db, s.id)) return res.status(403).json({ error: "Fotografije za ta profil ne shranjujemo.", photo: false });
      if (b.image.length > MAX_IMAGE || !isImage(b.image)) return res.status(400).json({ error: "Slika manjka ali je prevelika." });
      const today = new Date().toISOString().slice(0, 10);
      const day = db.prepare("SELECT photo_day, photo_n FROM pilot_state WHERE student_id = ?").get(s.id);
      if (day?.photo_day === today && day.photo_n >= PHOTO_DAILY_MAX) return res.status(429).json({ error: "Danes je shranjenih fotografij dovolj. Poskusi jutri.", photo: false });
      image = b.image;
    }
    const problems =
      image && Array.isArray(b.problems) ? b.problems.filter((p) => typeof p === "string").slice(0, PROBLEMS_MAX).map((p) => p.slice(0, 600)) : [];
    const lang = typeof b.lang === "string" && /^[a-z]{2,3}(?:-[A-Za-z]{2,4})?$/.test(b.lang) ? b.lang : "sl";
    const n = note(b.note, s.name);
    const prev = db.prepare("SELECT id FROM pilot_scans WHERE student_id = ? AND cond = ?").get(s.id, b.cond);
    db.exec("BEGIN IMMEDIATE");
    try {
      let id;
      if (prev) {
        id = prev.id;
        // Nova ocena istega pogoja: stara fotografija (in z njo prepis, sprožilec) ne sodi več k njej. Najprej izbris,
        // nato nova ocena, sicer bi sprožilec pobrisal novi prepis.
        db.prepare("DELETE FROM pilot_photos WHERE scan_id = ?").run(id);
        db.prepare("UPDATE pilot_scans SET ok = ?, note = ?, problems = ?, created_at = datetime('now') WHERE id = ?").run(b.ok ? 1 : 0, n, problems.length ? seal(JSON.stringify(problems)) : null, id);
      } else {
        id = db
          .prepare("INSERT INTO pilot_scans (student_id, cond, ok, note, problems) VALUES (?, ?, ?, ?, ?)")
          .run(s.id, b.cond, b.ok ? 1 : 0, n, problems.length ? seal(JSON.stringify(problems)) : null).lastInsertRowid;
      }
      if (image) {
        const days = photoDays();
        db.prepare(`INSERT INTO pilot_photos (scan_id, student_id, image, consent, expires_at) VALUES (?, ?, ?, ?, datetime('now', '+${days} days'))`).run(id, s.id, seal(image), consentRecord(lang, days));
        db.prepare(
          "UPDATE pilot_state SET photo_n = CASE WHEN photo_day = date('now') THEN photo_n + 1 ELSE 1 END, photo_day = date('now') WHERE student_id = ?",
        ).run(s.id);
      }
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

  // Vse fotografije profila naenkrat (bivši član v Jaz, starš v Računu). Ocene ostanejo.
  app.delete("/api/students/:id/pilot/photos", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const n = db.prepare("DELETE FROM pilot_photos WHERE student_id = ?").run(s.id).changes;
    res.json({ ...pilotState(db, s.id), gained: 0, deleted: Number(n) });
  });

  // Starš v Računu izbriše fotografije profila. Samo imetnik (OWNER_ONLY v account-lock.js) in ne mimo gesla profila:
  // brat na skupni napravi ne sme izbrisati sestrinih fotografij (preklic tujega soglasja, pregled B3).
  app.delete("/api/account/pilot-photos/:sid", (req, res) => {
    if (!accounts || !req.parent) return res.status(404).json({ error: "Ne obstaja." });
    const sid = /^\d{1,12}$/.test(req.params.sid) ? Number(req.params.sid) : NaN;
    const own = Number.isInteger(sid) && db.prepare("SELECT 1 FROM students WHERE id = ? AND parent_id = ?").get(sid, req.parent.id);
    if (!own) return res.status(404).json({ error: "Učenec ne obstaja." });
    if (owner?.profileLockedFor?.(req, sid)) return res.status(423).json({ error: "Profil je zaklenjen. Najprej ga odkleni z njegovim geslom.", profile_locked: true });
    const n = db.prepare("DELETE FROM pilot_photos WHERE student_id = ?").run(sid).changes;
    audit(db, { req, parentId: req.parent.id, actor: "parent", action: "pilot_photos_delete", target: `student:${sid}` });
    res.json({ ...pilotSummary(db, sid), deleted: Number(n) });
  });

  // Del aplikacije: { feature, ok, note? }; samo opomba k že dani oceni: { feature, note } (ok ostane).
  app.post("/api/students/:id/pilot/feature", (req, res) => {
    const s = member(req, res);
    if (!s) return;
    const b = req.body || {};
    if (!FEATURES.includes(b.feature)) return res.status(400).json({ error: "Napačna zahteva." });
    // Aplikacija pokaže 5 delov: »exams« ali »3d« (kdor nima NPZ/mature). Drugega iz para ne sprejmemo.
    const other = { exams: "3d", "3d": "exams" }[b.feature];
    if (other && db.prepare("SELECT 1 FROM pilot_features WHERE student_id = ? AND feature = ?").get(s.id, other)) return res.status(409).json({ error: "Ta del ni med tvojimi nalogami." });
    const prev = db.prepare("SELECT id, ok FROM pilot_features WHERE student_id = ? AND feature = ?").get(s.id, b.feature);
    if (typeof b.ok !== "boolean" && !prev) return res.status(400).json({ error: "Napačna zahteva." });
    const ok = typeof b.ok === "boolean" ? (b.ok ? 1 : 0) : prev.ok;
    const n = note(b.note, s.name);
    if (prev) db.prepare("UPDATE pilot_features SET ok = ?, note = COALESCE(?, note), created_at = datetime('now') WHERE id = ?").run(ok, n, prev.id);
    else db.prepare("INSERT INTO pilot_features (student_id, feature, ok, note) VALUES (?, ?, ?, ?)").run(s.id, b.feature, ok, n);
    const rewarded = db.prepare("SELECT COUNT(*) AS n FROM pilot_rewards WHERE student_id = ? AND item LIKE 'feature:%'").get(s.id).n;
    const hasIt = !!db.prepare("SELECT 1 FROM pilot_rewards WHERE student_id = ? AND item = ?").get(s.id, `feature:${b.feature}`);
    reply(res, s, hasIt || rewarded < FEATURES_SHOWN ? reward(db, progress, s.id, `feature:${b.feature}`, XP.feature) : 0);
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
    // Brez e-naslovov: ti so na ločeni strani (spodaj), da jih skrbnik ne vidi ob porazdelitvah (pregled B3).
    res.set("Cache-Control", "no-store").json({ ...pilotTasksReport(db), canAdd: !!accounts });
  });

  // Seznam računov v pilotu (samo za dodajanje in odstranjevanje; brez vsot).
  app.get("/api/admin/pilot-naloge/clani", (req, res) => {
    if (!accounts) return res.status(404).json({ error: "Računi niso vklopljeni." });
    if (!isAdmin(req)) return res.status(403).json({ error: "Samo za skrbnika." });
    const list = hasParents(db) && hasCol(db, "parents", "pilot_at") ? db.prepare("SELECT email FROM parents WHERE pilot_at IS NOT NULL ORDER BY email").all().map((x) => x.email) : [];
    res.set("Cache-Control", "no-store").json({ accounts: list });
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
    // Izstop iz pilota: fotografije profilov tega računa izbrišemo takoj (soglasje velja za sodelovanje v pilotu).
    if (!on) db.prepare("DELETE FROM pilot_photos WHERE student_id IN (SELECT id FROM students WHERE parent_id = ?)").run(p.id);
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
