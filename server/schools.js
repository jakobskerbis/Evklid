// Šole, učitelji, razredi s šolsko licenco in razredne naloge.
// Načrt »Evklid Osebno in šolska licenca« (j, 2026-10-30), točka 2:
// - učiteljev račun je zastonj: nobena pot tukaj ne preverja naročnine;
// - šola ima učitelje (skrbnik + sodelavci s kodo šole) in licence (mesta, predmeti, letniki, velja do, mesečna meja AI);
// - razred je razred iz lig (server/leagues.js) z dodanim school_id, letnikom in predmetom;
// - zasebni prostor: učitelj vidi samo razredne naloge (rezultate pri dodeljenih temah od dodelitve dalje) in lestvico XP,
//   nikoli pogovorov z inštruktorjem, drugih tem, ocen ali česa drugega iz profila;
// - izvoz in prenos napredka na drugo šolo sta vedno zastonj (GDPR čl. 20), tudi brez licence.
// Pravice (kaj šolska licenca odklene) računa server/placila/pravice.js z `schoolAccess()` od tu.
import crypto from "node:crypto";
import { getPath, getTopic, baseTopicIds } from "./curriculum.js";
import { audit } from "./dnevnik-dostopov.js";

export const SCHOOL = {
  maxSchoolsPerTeacher: 3,
  maxClassesPerTeacher: 40,
  maxAssignmentsPerClass: 300,
  doneSolved: 5, // toliko rešenih nalog pri temi od dodelitve dalje = opravljeno (ali tema osvojena)
  maxFailedJoins: 10, // na uro, proti ugibanju kod šol
};
export const PLANS = ["class", "school", "pilot"];
// Cene šolske licence v € na učenca na leto (j, 2026-10-30). Edino mesto za cene: stran /sole, obrazec in predračun
// (server/sole.js) jih berejo od tu. Pilotna cena velja `years` let.
export const SCHOOL_LICENCE_PRICES = {
  class: { eur: 20, years: 1 }, // licenca za razrede
  school: { eur: 14, years: 1 }, // cela šola
  pilot: { eur: 12, years: 2 }, // pilotna šola
};
// Pilotna cena samo za prvih 10 šol (j 2026-11-04 »Vse da«); potem šola dobi navadno ceno.
export const PILOT_SCHOOLS_MAX = 10;
// Privzeta mesečna meja AI licence (j 2026-11-04): 25 % mesečne cene na učenca (cena na leto / 12), v $.
// EVKLID_SCHOOL_AI_EUR (npr. 0.5) jo nastavi na stalen znesek v € na učenca. Licenca z ai_cap_usd_month ima svojo mejo.
const EUR_PER_USD = 0.92; // kot COST.eurPerUsd v server/accounts/plans.js
export function schoolAiEurPerStudent(plan) {
  const fixed = Number(process.env.EVKLID_SCHOOL_AI_EUR);
  if (process.env.EVKLID_SCHOOL_AI_EUR && Number.isFinite(fixed) && fixed >= 0) return fixed;
  return ((SCHOOL_LICENCE_PRICES[plan]?.eur || SCHOOL_LICENCE_PRICES.school.eur) / 12) * 0.25;
}
export const defaultAiCapUsd = (lic) => Math.round(((Number(lic.seats) || 0) * schoolAiEurPerStudent(lic.plan) / EUR_PER_USD) * 100) / 100;
// Koliko šol ima pilotno licenco; ali ta šola (ali nova) še lahko dobi pilotno ceno.
export function pilotSchoolIds(db) {
  if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'school_licences'").get()) return [];
  return db.prepare("SELECT DISTINCT school_id AS id FROM school_licences WHERE plan = 'pilot' ORDER BY school_id").all().map((r) => r.id);
}
export const pilotOpen = (db, schoolId = null) => {
  const ids = pilotSchoolIds(db);
  return ids.length < PILOT_SCHOOLS_MAX || (schoolId != null && ids.includes(schoolId));
};
export const STAGES = ["OS", "SS"];
export const SUBJECTS = ["MAT", "FIZ", "KEM", "BIO", "NAR"];

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const day = (d = new Date()) => new Date(d).toISOString().slice(0, 10);
const json = (v) => (v == null ? null : JSON.stringify(v));
const parse = (v) => {
  try {
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
};
const clean = (v, max = 60) => (typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, max) : "");
const isDay = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));
const fmtCode = (c) => (c?.length === 6 ? `${c.slice(0, 3)}-${c.slice(3)}` : c);
// Število iz JSON/poti: objekti in polja niso števila (Number({toString: 1}) bi vrgel izjemo → 500).
const num = (v) => (typeof v === "number" ? v : typeof v === "string" && v.trim() ? Number(v) : NaN);
// Neobvezen id šole: prazno = brez šole, sicer celo število (drugače NaN → 404).
const optId = (v) => (v == null || v === "" ? null : Number.isInteger(num(v)) ? num(v) : NaN);
const normCode = (c) => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);

export function migrateSchools(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schools (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      place TEXT NOT NULL DEFAULT '',
      stage TEXT NOT NULL DEFAULT 'OS',          -- OS | SS
      invite_code TEXT NOT NULL UNIQUE,          -- koda za sodelavce (učitelje iste šole)
      created_by INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS school_teachers (
      school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
      parent_id INTEGER NOT NULL,                -- račun učitelja (parents.id)
      role TEXT NOT NULL DEFAULT 'teacher',      -- admin | teacher
      joined_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (school_id, parent_id)
    );
    -- Licenca, ki jo šola plača (e-račun prek UJP) ali podarjena/pilotska. Vpiše jo skrbnik Evklida.
    CREATE TABLE IF NOT EXISTS school_licences (
      id INTEGER PRIMARY KEY,
      school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
      plan TEXT NOT NULL,                        -- class | school | pilot
      seats INTEGER NOT NULL,                    -- toliko učencev (prvi po datumu pridružitve) dobi šolske pravice
      price_eur REAL NOT NULL DEFAULT 0,         -- na učenca na leto (za evidenco, ne za obračun)
      subjects TEXT,                             -- JSON ["MAT","FIZ"] ali NULL = vsi šolski predmeti
      grades TEXT,                               -- JSON [6,7,8,9] ali NULL = vsi letniki
      valid_from TEXT NOT NULL,
      valid_until TEXT NOT NULL,                 -- zadnji veljavni dan (YYYY-MM-DD)
      ai_cap_usd_month REAL,                     -- mesečna meja stroška AI za vso šolo (NULL = defaultAiCapUsd)
      invoice_ref TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_school_licences ON school_licences(school_id, valid_until);
    CREATE TABLE IF NOT EXISTS class_assignments (
      id INTEGER PRIMARY KEY,
      class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
      topic_id TEXT NOT NULL,
      title TEXT NOT NULL,
      due TEXT,                                  -- YYYY-MM-DD ali NULL
      created_by INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_class_assignments ON class_assignments(class_id);
  `);
  const cols = db.prepare("PRAGMA table_info(classes)").all().map((c) => c.name);
  if (!cols.includes("school_id")) db.exec("ALTER TABLE classes ADD COLUMN school_id INTEGER REFERENCES schools(id) ON DELETE SET NULL");
  if (!cols.includes("grade")) db.exec("ALTER TABLE classes ADD COLUMN grade INTEGER");
  if (!cols.includes("subject")) db.exec("ALTER TABLE classes ADD COLUMN subject TEXT");
  // Učitelj izklopi ponudbe plačljivih paketov za učence razreda (pravila ponudb v pravice.js).
  if (!cols.includes("offers_off")) db.exec("ALTER TABLE classes ADD COLUMN offers_off INTEGER NOT NULL DEFAULT 0");
  if (!cols.includes("path")) db.exec("ALTER TABLE classes ADD COLUMN path TEXT"); // učna pot razreda, npr. MAT-OS-7
  const mcols = db.prepare("PRAGMA table_info(class_members)").all().map((c) => c.name);
  // Oznaka, ki jo učitelj sam pripiše vzdevku (npr. »Ana K.«); učenec imena ne vpisuje.
  if (!mcols.includes("teacher_label")) db.exec("ALTER TABLE class_members ADD COLUMN teacher_label TEXT");
  db.exec("CREATE INDEX IF NOT EXISTS idx_classes_school ON classes(school_id)");
}

// Veljavna licenca šole na dan `today` (najkasneje veljavna, ob enakem roku tista z več mesti).
export function activeLicence(db, schoolId, today = day()) {
  const l = db
    .prepare("SELECT * FROM school_licences WHERE school_id = ? AND valid_from <= ? AND valid_until >= ? ORDER BY valid_until DESC, seats DESC LIMIT 1")
    .get(schoolId, today, today);
  return l ? { ...l, subjects: parse(l.subjects), grades: parse(l.grades) } : null;
}

// Učenci šole (razredi kind='class') po prvi pridružitvi; prvih `seats` ima licenco.
export function schoolStudents(db, schoolId) {
  if (!ready(db)) return [];
  return db
    .prepare(
      `SELECT m.student_id AS id, MIN(m.joined_at) AS first FROM class_members m JOIN classes c ON c.id = m.class_id
       WHERE c.school_id = ? AND c.kind = 'class' GROUP BY m.student_id ORDER BY first, m.student_id`,
    )
    .all(schoolId)
    .map((r) => r.id);
}

// Šolske pravice učenca (za server/placila/pravice.js): null, če ni v razredu šole z veljavno licenco in prostim mestom.
// { schoolId, schoolName, licenceId, plan, subjects, grades, validUntil, aiCapUsdMonth }
export function schoolAccess(db, studentId, now = new Date()) {
  if (!ready(db)) return null;
  const today = day(now);
  const schools = db
    .prepare(
      `SELECT DISTINCT s.id, s.name, s.stage FROM class_members m JOIN classes c ON c.id = m.class_id JOIN schools s ON s.id = c.school_id
       WHERE m.student_id = ? AND c.kind = 'class' ORDER BY s.id`,
    )
    .all(studentId);
  for (const s of schools) {
    const lic = activeLicence(db, s.id, today);
    if (!lic) continue;
    if (!schoolStudents(db, s.id).slice(0, lic.seats).includes(studentId)) continue;
    return {
      schoolId: s.id,
      schoolName: s.name,
      stage: s.stage, // OS | SS (letniki licence so številke v tej stopnji)
      licenceId: lic.id,
      plan: lic.plan,
      subjects: lic.subjects,
      grades: lic.grades,
      validUntil: lic.valid_until,
      aiCapUsdMonth: lic.ai_cap_usd_month ?? defaultAiCapUsd(lic),
    };
  }
  return null;
}

// Ali so šolske tabele že ustvarjene (pravice.js lahko vpraša, preden se mountSchools izvede).
function ready(db) {
  try {
    return !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'school_licences'").get() &&
      db.prepare("PRAGMA table_info(classes)").all().some((c) => c.name === "offers_off");
  } catch {
    return false;
  }
}

// Za pravila ponudb (pravice.js): ali je učenec v kakem razredu učitelja, v razredu šole (z mestom ali brez)
// in ali je učitelj katerega od njegovih razredov izklopil ponudbe.
export function schoolMembership(db, studentId) {
  if (!ready(db)) return { inClass: false, inSchool: false, offersOff: false };
  const r = db
    .prepare(
      `SELECT COUNT(*) AS n, SUM(c.school_id IS NOT NULL) AS school, MAX(c.offers_off) AS off FROM class_members m
       JOIN classes c ON c.id = m.class_id WHERE m.student_id = ? AND c.kind = 'class'`,
    )
    .get(studentId);
  return { inClass: r.n > 0, inSchool: (r.school || 0) > 0, offersOff: !!r.off };
}

// Rezultati razreda pri dodeljenih temah. Samo naloge pri teh temah od dodelitve dalje (zasebni prostor).
export function assignmentResults(db, assignment, studentIds) {
  const out = new Map(studentIds.map((id) => [id, { status: "todo", solved: 0, firstTry: 0, tried: 0 }]));
  if (!studentIds.length) return out;
  const topics = [...new Set([assignment.topic_id, ...baseTopicIds(assignment.topic_id)])];
  const qs = (a) => a.map(() => "?").join(",");
  const rows = db
    .prepare(
      `SELECT student_id, COUNT(*) AS tried, SUM(solved) AS solved, SUM(CASE WHEN first_try_correct = 1 THEN 1 ELSE 0 END) AS first
       FROM tasks WHERE topic_id IN (${qs(topics)}) AND student_id IN (${qs(studentIds)}) AND created_at >= ? AND attempts > 0
       GROUP BY student_id`,
    )
    .all(...topics, ...studentIds, assignment.created_at);
  const mastered = new Set(
    db
      .prepare(
        `SELECT student_id FROM topic_state WHERE topic_id IN (${qs(topics)}) AND student_id IN (${qs(studentIds)})
         AND status = 'mastered' AND mastered_at >= ?`,
      )
      .all(...topics, ...studentIds, assignment.created_at)
      .map((r) => r.student_id),
  );
  for (const r of rows) {
    const o = out.get(r.student_id);
    Object.assign(o, { tried: r.tried, solved: r.solved || 0, firstTry: r.first || 0, status: "started" });
  }
  for (const [id, o] of out) if (mastered.has(id) || o.solved >= SCHOOL.doneSolved) o.status = "done";
  return out;
}

export class Schools {
  constructor(db) {
    this.db = db;
    migrateSchools(db);
    this.failedJoins = new Map();
  }

  newInvite() {
    for (;;) {
      const c = Array.from({ length: 8 }, () => CODE_CHARS[crypto.randomInt(CODE_CHARS.length)]).join("");
      if (!this.db.prepare("SELECT 1 FROM schools WHERE invite_code = ?").get(c)) return c;
    }
  }

  role(schoolId, parentId) {
    return this.db.prepare("SELECT role FROM school_teachers WHERE school_id = ? AND parent_id = ?").get(schoolId, parentId)?.role || null;
  }

  create(parentId, { name, place, stage }) {
    const n = this.db.prepare("SELECT COUNT(*) AS n FROM school_teachers WHERE parent_id = ?").get(parentId).n;
    if (n >= SCHOOL.maxSchoolsPerTeacher) return { error: `Učitelj je lahko na največ ${SCHOOL.maxSchoolsPerTeacher} šolah.` };
    const r = this.db
      .prepare("INSERT INTO schools (name, place, stage, invite_code, created_by) VALUES (?, ?, ?, ?, ?)")
      .run(name, place, STAGES.includes(stage) ? stage : "OS", this.newInvite(), parentId);
    const id = Number(r.lastInsertRowid);
    this.db.prepare("INSERT INTO school_teachers (school_id, parent_id, role) VALUES (?, ?, 'admin')").run(id, parentId);
    return { id };
  }

  join(parentId, code) {
    const now = Date.now();
    const recent = (this.failedJoins.get(parentId) || []).filter((t) => now - t < 3600_000);
    if (recent.length >= SCHOOL.maxFailedJoins) return { error: "Preveč napačnih poskusov. Poskusite znova čez eno uro.", status: 429 };
    const s = this.db.prepare("SELECT * FROM schools WHERE invite_code = ?").get(normCode(code));
    if (!s) {
      this.failedJoins.set(parentId, [...recent, now]);
      return { error: "Koda šole ne obstaja.", status: 404 };
    }
    if (this.role(s.id, parentId)) return { id: s.id, already: true };
    const n = this.db.prepare("SELECT COUNT(*) AS n FROM school_teachers WHERE parent_id = ?").get(parentId).n;
    if (n >= SCHOOL.maxSchoolsPerTeacher) return { error: `Učitelj je lahko na največ ${SCHOOL.maxSchoolsPerTeacher} šolah.`, status: 400 };
    this.db.prepare("INSERT INTO school_teachers (school_id, parent_id, role) VALUES (?, ?, 'teacher')").run(s.id, parentId);
    return { id: s.id };
  }

  // Učitelj zapusti šolo: njegovi razredi ostanejo njegovi, a niso več del šole (brez licence).
  leave(parentId, schoolId) {
    if (!this.role(schoolId, parentId)) return false;
    this.db.prepare("DELETE FROM school_teachers WHERE school_id = ? AND parent_id = ?").run(schoolId, parentId);
    this.db.prepare("UPDATE classes SET school_id = NULL WHERE school_id = ? AND owner_parent_id = ?").run(schoolId, parentId);
    // Skrbnik je odšel: skrbnik postane najstarejši sodelavec.
    if (!this.db.prepare("SELECT 1 FROM school_teachers WHERE school_id = ? AND role = 'admin'").get(schoolId)) {
      this.db
        .prepare("UPDATE school_teachers SET role = 'admin' WHERE rowid = (SELECT rowid FROM school_teachers WHERE school_id = ? ORDER BY joined_at LIMIT 1)")
        .run(schoolId);
    }
    return true;
  }

  licenceView(schoolId) {
    const lic = activeLicence(this.db, schoolId);
    const students = schoolStudents(this.db, schoolId).length;
    const next = this.db
      .prepare("SELECT valid_from, valid_until, plan, seats FROM school_licences WHERE school_id = ? AND valid_from > ? ORDER BY valid_from LIMIT 1")
      .get(schoolId, day());
    return {
      students,
      licence: lic
        ? { plan: lic.plan, seats: lic.seats, subjects: lic.subjects, grades: lic.grades, validUntil: lic.valid_until, aiCapUsdMonth: lic.ai_cap_usd_month ?? defaultAiCapUsd(lic) }
        : null,
      next: next || null,
    };
  }

  schoolsOf(parentId) {
    return this.db
      .prepare("SELECT s.*, t.role FROM school_teachers t JOIN schools s ON s.id = t.school_id WHERE t.parent_id = ? ORDER BY s.id")
      .all(parentId)
      .map((s) => ({
        id: s.id,
        name: s.name,
        place: s.place,
        stage: s.stage,
        role: s.role,
        inviteCode: fmtCodeLong(s.invite_code),
        teachers: this.db.prepare("SELECT COUNT(*) AS n FROM school_teachers WHERE school_id = ?").get(s.id).n,
        ...this.licenceView(s.id),
      }));
  }

  classesOf(parentId) {
    return this.db
      .prepare(
        `SELECT c.*, (SELECT COUNT(*) FROM class_members m WHERE m.class_id = c.id) AS members,
         (SELECT COUNT(*) FROM class_assignments a WHERE a.class_id = c.id) AS assignments
         FROM classes c WHERE c.kind = 'class' AND c.owner_parent_id = ? ORDER BY c.id`,
      )
      .all(parentId)
      .map((c) => this.publicClass(c));
  }

  publicClass(c) {
    return {
      id: c.id,
      code: fmtCode(c.code),
      name: c.name,
      schoolId: c.school_id ?? null,
      grade: c.grade ?? null,
      subject: c.subject ?? null,
      path: c.path ?? null,
      offersOff: !!c.offers_off,
      showcaseOff: !!c.showcase_off,
      members: c.members,
      assignments: c.assignments,
    };
  }

  assignments(classId) {
    return this.db.prepare("SELECT * FROM class_assignments WHERE class_id = ? ORDER BY COALESCE(due, '9999'), id").all(classId);
  }

  // Pregled razreda za učitelja: vzdevki, oznake, XP (lige) in rezultati samo pri razrednih nalogah.
  overview(cls, board) {
    const members = this.db.prepare("SELECT student_id, teacher_label, joined_at FROM class_members WHERE class_id = ?").all(cls.id);
    const label = new Map(members.map((m) => [m.student_id, m.teacher_label || ""]));
    const ids = members.map((m) => m.student_id);
    const rows = board.map((m) => ({ ref: m._id, nickname: m.nickname, label: label.get(m._id) || "", xp: m.xp, month: m.month, total: m.total }));
    const assignments = this.assignments(cls.id).map((a) => {
      const res = assignmentResults(this.db, a, ids);
      const per = {};
      for (const [id, r] of res) per[id] = r;
      const done = [...res.values()].filter((r) => r.status === "done").length;
      return { id: a.id, topicId: a.topic_id, title: a.title, due: a.due, createdAt: a.created_at, done, results: per };
    });
    return { ...this.publicClass({ ...cls, members: ids.length }), schoolName: cls.school_id ? this.db.prepare("SELECT name FROM schools WHERE id = ?").get(cls.school_id)?.name : null, members: rows, assignments };
  }

  addAssignment(cls, parentId, { topicId, due }) {
    const topic = getTopic(topicId);
    if (!topic || ["UNI", "TEK"].includes(getPath(topic.path)?.school)) return { error: "Izberite temo s seznama." };
    if (due != null && due !== "" && !isDay(due)) return { error: "Rok ni pravi datum." };
    const n = this.db.prepare("SELECT COUNT(*) AS n FROM class_assignments WHERE class_id = ?").get(cls.id).n;
    if (n >= SCHOOL.maxAssignmentsPerClass) return { error: "Razred ima že preveč nalog. Izbrišite stare." };
    const title = topic.sl?.name || topic.name;
    const r = this.db
      .prepare("INSERT INTO class_assignments (class_id, topic_id, title, due, created_by) VALUES (?, ?, ?, ?, ?)")
      .run(cls.id, topic.id, title, due || null, parentId);
    return { id: Number(r.lastInsertRowid), topicId: topic.id, title, due: due || null };
  }

  // Naloge vseh razredov učenca z njegovim stanjem (samo za učenca samega).
  studentAssignments(studentId) {
    const classes = this.db
      .prepare(
        `SELECT c.id, c.name, c.school_id, s.name AS school FROM class_members m JOIN classes c ON c.id = m.class_id
         LEFT JOIN schools s ON s.id = c.school_id WHERE m.student_id = ? AND c.kind = 'class' ORDER BY m.joined_at, c.id`,
      )
      .all(studentId);
    return classes.map((c) => ({
      classId: c.id,
      className: c.name,
      schoolId: c.school_id ?? null,
      school: c.school || null,
      items: this.assignments(c.id).map((a) => {
        const r = assignmentResults(this.db, a, [studentId]).get(studentId);
        return { id: a.id, topicId: a.topic_id, title: a.title, due: a.due, status: r.status, solved: r.solved, goal: SCHOOL.doneSolved };
      }),
    }));
  }

  // Prenos na drugo šolo: pridruži se razredu (kodo preveri liga) in izstopi iz razredov drugih šol.
  // Napredek je v profilu učenca, zato gre z njim; nič se ne briše in nič ne stane.
  leaveOtherSchools(studentId, keepClassId) {
    const keep = this.db.prepare("SELECT school_id FROM classes WHERE id = ?").get(keepClassId)?.school_id ?? null;
    if (keep === null) return []; // razred brez šole: stare šole ostanejo
    const left = this.db
      .prepare(
        `SELECT c.id, c.name FROM class_members m JOIN classes c ON c.id = m.class_id
         WHERE m.student_id = ? AND c.kind = 'class' AND c.id <> ? AND c.school_id IS NOT NULL AND c.school_id IS NOT ?`,
      )
      .all(studentId, keepClassId, keep);
    for (const c of left) this.db.prepare("DELETE FROM class_members WHERE class_id = ? AND student_id = ?").run(c.id, studentId);
    return left.map((c) => c.name);
  }
}

const fmtCodeLong = (c) => (c?.length === 8 ? `${c.slice(0, 4)}-${c.slice(4)}` : c);

const csvCell = (v) => {
  const s = String(v ?? "");
  // Celice, ki se začnejo z =, +, -, @, preglednica ne sme izvesti kot formule.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[",;\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

// HTTP poti. Šole potrebujejo račune (req.parent); razrede lahko učitelj brez računa upravlja s ključem (X-Teacher-Key).
export function mountSchools(app, store, { loadStudent, leagues, accounts = true }) {
  const schools = new Schools(store.db);
  const db = store.db;
  const needParent = (req, res) => {
    if (!req.parent) res.status(401).json({ error: "Prijavite se.", login: true });
    return req.parent || null;
  };
  const needVerified = (req, res) => {
    const p = needParent(req, res);
    if (p && !p.email_verified_at) {
      res.status(403).json({ error: "Najprej potrdite e-naslov (povezava v e-pošti).", verify: true });
      return null;
    }
    return p;
  };
  const teacherClass = (req, res) => {
    const cls = leagues.authTeacher(req.params.code, req.get("x-teacher-key"), req.parent?.id ?? null);
    if (!cls) res.status(403).json({ error: "Napačna koda ali ključ razreda." });
    return cls;
  };
  const schoolOf = (req, res, admin = false) => {
    const p = needParent(req, res);
    if (!p) return null;
    const id = Number(req.params.id);
    const role = Number.isInteger(id) ? schools.role(id, p.id) : null;
    if (!role || (admin && role !== "admin")) {
      res.status(404).json({ error: "Šola ne obstaja." });
      return null;
    }
    return id;
  };
  const isAdmin = (req, res) => {
    if (!req.parent?.is_admin) {
      res.status(403).json({ error: "Samo za skrbnika." });
      return false;
    }
    return true;
  };

  // --- učitelj: šole ---
  app.get("/api/teacher/home", (req, res) => {
    // Brez računov (EVKLID_ACCOUNTS ni 1) stran za učitelje dela samo z razredi s ključem v brskalniku.
    if (!accounts && !req.parent) return res.json({ accounts: false, verified: false, schools: [], classes: [], doneSolved: SCHOOL.doneSolved });
    const p = needParent(req, res);
    if (!p) return;
    res.json({ verified: !!p.email_verified_at, schools: schools.schoolsOf(p.id), classes: schools.classesOf(p.id), doneSolved: SCHOOL.doneSolved });
  });
  app.post("/api/schools", (req, res) => {
    const p = needVerified(req, res);
    if (!p) return;
    const name = clean(req.body?.name, 80);
    if (name.length < 3) return res.status(400).json({ error: "Vpišite ime šole." });
    const out = schools.create(p.id, { name, place: clean(req.body?.place, 60), stage: req.body?.stage });
    if (out.error) return res.status(400).json(out);
    res.status(201).json(schools.schoolsOf(p.id).find((s) => s.id === out.id));
  });
  app.post("/api/schools/join", (req, res) => {
    const p = needVerified(req, res);
    if (!p) return;
    const out = schools.join(p.id, req.body?.code);
    if (out.error) return res.status(out.status || 400).json({ error: out.error });
    res.status(out.already ? 200 : 201).json(schools.schoolsOf(p.id).find((s) => s.id === out.id));
  });
  app.delete("/api/schools/:id/me", (req, res) => {
    const id = schoolOf(req, res);
    if (id) res.json({ ok: schools.leave(req.parent.id, id) });
  });

  // --- učitelj: razredi ---
  app.post("/api/teacher/classes", (req, res) => {
    const p = needParent(req, res);
    if (!p) return;
    const name = clean(req.body?.name, 40);
    if (!name) return res.status(400).json({ error: "Vpišite ime razreda, npr. 8.b." });
    const schoolId = optId(req.body?.schoolId);
    if (schoolId !== null && !(Number.isInteger(schoolId) && schools.role(schoolId, p.id))) return res.status(404).json({ error: "Šola ne obstaja." });
    const count = db.prepare("SELECT COUNT(*) AS n FROM classes WHERE kind = 'class' AND owner_parent_id = ?").get(p.id).n;
    if (count >= SCHOOL.maxClassesPerTeacher) return res.status(400).json({ error: `Največ ${SCHOOL.maxClassesPerTeacher} razredov na učitelja.` });
    // Učna pot razreda (predmet in letnik), npr. MAT-OS-7; neobvezno.
    const path = req.body?.path ? getPath(typeof req.body.path === "string" ? req.body.path : "") : null;
    if (req.body?.path && (!path || ["UNI", "TEK"].includes(path.school))) return res.status(400).json({ error: "Izberite predmet in letnik s seznama." });
    const c = leagues.createClass(name, p.id);
    db.prepare("UPDATE classes SET school_id = ?, grade = ?, subject = ?, path = ? WHERE id = ?").run(schoolId, path?.grade ?? null, path?.subject ?? null, path?.key ?? null, c.id);
    res.status(201).json(schools.classesOf(p.id).find((x) => x.id === c.id));
  });
  // Razred v drugo šolo (prenos, ko učitelj zamenja šolo) ali brez šole. Vedno zastonj.
  app.put("/api/teacher/classes/:code/school", (req, res) => {
    const cls = teacherClass(req, res);
    if (!cls) return;
    const p = needParent(req, res);
    if (!p) return;
    // Samo lastnik razreda (ključ tujega razreda ne zadošča, da bi ga vpisal v svojo šolo in porabil njena mesta).
    // Star razred brez lastnika (samo ključ) ob tem postane učiteljev, da ga vidi na vseh napravah in ga odnese, če zapusti šolo.
    if (cls.owner_parent_id != null && cls.owner_parent_id !== p.id) return res.status(403).json({ error: "Razred lahko v šolo prestavi samo učitelj, ki ga je ustvaril." });
    const schoolId = optId(req.body?.schoolId);
    if (schoolId !== null && !(Number.isInteger(schoolId) && schools.role(schoolId, p.id))) return res.status(404).json({ error: "Šola ne obstaja." });
    db.prepare("UPDATE classes SET school_id = ?, owner_parent_id = ? WHERE id = ?").run(schoolId, p.id, cls.id);
    res.json({ ok: true });
  });
  // Učitelj izklopi (ali spet vklopi) ponudbe plačljivih paketov za učence razreda.
  app.put("/api/teacher/classes/:code/offers", (req, res) => {
    const cls = teacherClass(req, res);
    if (!cls) return;
    if (typeof req.body?.off !== "boolean") return res.status(400).json({ error: "Manjka off: true ali false." });
    db.prepare("UPDATE classes SET offers_off = ? WHERE id = ?").run(req.body.off ? 1 : 0, cls.id);
    res.json({ ok: true, offersOff: req.body.off });
  });
  app.get("/api/teacher/classes/:code/overview", (req, res) => {
    const cls = teacherClass(req, res);
    if (cls) res.json({ ...schools.overview(cls, leagues.classBoard(cls.id)), week: leagues.week(), doneSolved: SCHOOL.doneSolved });
  });
  app.put("/api/teacher/classes/:code/members/:ref", (req, res) => {
    const cls = teacherClass(req, res);
    if (!cls) return;
    const ok = db.prepare("UPDATE class_members SET teacher_label = ? WHERE class_id = ? AND student_id = ?").run(clean(req.body?.label, 40) || null, cls.id, Number(req.params.ref)).changes > 0;
    if (!ok) return res.status(404).json({ error: "Učenca ni v razredu." });
    res.json({ ok });
  });
  app.post("/api/teacher/classes/:code/assignments", (req, res) => {
    const cls = teacherClass(req, res);
    if (!cls) return;
    const out = schools.addAssignment(cls, req.parent?.id ?? null, { topicId: typeof req.body?.topicId === "string" ? req.body.topicId : "", due: req.body?.due });
    if (out.error) return res.status(400).json(out);
    res.status(201).json(out);
  });
  app.delete("/api/teacher/classes/:code/assignments/:aid", (req, res) => {
    const cls = teacherClass(req, res);
    if (cls) res.json({ ok: db.prepare("DELETE FROM class_assignments WHERE id = ? AND class_id = ?").run(Number(req.params.aid), cls.id).changes > 0 });
  });
  // Izvoz pregleda razreda (CSV, ločilo podpičje za slovenski Excel). Vedno zastonj.
  app.get("/api/teacher/classes/:code/export.csv", (req, res) => {
    const cls = teacherClass(req, res);
    if (!cls) return;
    const v = schools.overview(cls, leagues.classBoard(cls.id));
    const head = ["Vzdevek", "Oznaka", "XP ta teden", "XP skupaj", ...v.assignments.map((a) => `${a.title}${a.due ? ` (${a.due})` : ""}`)];
    const st = { done: "opravljeno", started: "začeto", todo: "ni začeto" };
    const lines = [head, ...v.members.map((m) => [m.nickname, m.label, m.xp, m.total, ...v.assignments.map((a) => `${st[a.results[m.ref].status]} (${a.results[m.ref].solved})`)])];
    const file = `razred-${v.name.replace(/[^\p{L}\p{N}]+/gu, "-")}.csv`;
    audit(db, { req, parentId: req.parent?.id ?? null, actor: "teacher", action: "class_export", target: `class:${cls.id}` });
    res.set("Content-Disposition", `attachment; filename="${encodeURIComponent(file)}"; filename*=UTF-8''${encodeURIComponent(file)}`);
    res.type("text/csv; charset=utf-8").send("﻿" + lines.map((l) => l.map(csvCell).join(";")).join("\r\n"));
  });
  // Teme za dodelitev: pot predmeta in letnika (OŠ/SŠ).
  app.get("/api/teacher/topics", (req, res) => {
    const path = getPath(String(req.query.path || ""));
    if (!path || path.school === "UNI" || path.school === "TEK") return res.status(404).json({ error: "Pot ne obstaja." });
    res.json(path.units.map((u) => ({ unit: u.sl?.title || u.title, topics: u.topics.map((t) => ({ id: t.id, name: t.sl?.name || t.name })) })));
  });

  // --- učenec ---
  app.get("/api/students/:id/assignments", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const access = schoolAccess(db, s.id);
    res.json({ classes: schools.studentAssignments(s.id), licence: access && { school: access.schoolName, validUntil: access.validUntil, plan: access.plan } });
  });
  app.post("/api/students/:id/transfer", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const code = typeof req.body?.code === "string" ? req.body.code : "";
    const target = leagues.getByCode(code);
    // Koda skupine prijateljev: zavrnemo, preden bi se učenec pridružil.
    if (target && target.kind !== "class") return res.status(400).json({ error: "To je koda skupine prijateljev, ne razreda." });
    // Najprej izstop iz razredov drugih šol (da omejitev števila skupin ne ustavi prenosa), nato pridružitev; ob napaki nič.
    let left = [];
    let out;
    db.exec("BEGIN IMMEDIATE");
    try {
      if (target) left = schools.leaveOtherSchools(s.id, target.id);
      out = leagues.join(s.id, code);
      db.exec(out.error ? "ROLLBACK" : "COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
    if (out.error) return res.status(out.status || 400).json({ error: out.error });
    res.json({ ok: true, class: out.class, left });
  });
  // Izvoz napredka za šolo (JSON): razredi, naloge, stanje tem. Vedno zastonj, tudi brez licence.
  app.get("/api/students/:id/school-export", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const topics = db.prepare("SELECT topic_id, level, status, mastered_at, updated_at FROM topic_state WHERE student_id = ? ORDER BY topic_id").all(s.id);
    const data = { exported_at: new Date().toISOString(), student: s.name, classes: schools.studentAssignments(s.id), topics };
    audit(db, { req, parentId: req.parent?.id ?? null, action: "school_export", target: `student:${s.id}` });
    res.set("Content-Disposition", `attachment; filename="napredek-${s.id}.json"`);
    res.type("application/json").send(JSON.stringify(data, null, 2));
  });

  // --- skrbnik Evklida: licence (po plačanem e-računu ali za pilot) ---
  app.get("/api/admin/schools", (req, res) => {
    if (!isAdmin(req, res)) return;
    audit(db, { req, parentId: req.parent.id, actor: "admin", action: "schools_view" });
    res.json(
      db.prepare("SELECT id, name, place, stage, created_at FROM schools ORDER BY id").all().map((s) => ({
        ...s,
        ...schools.licenceView(s.id),
        licences: db.prepare("SELECT * FROM school_licences WHERE school_id = ? ORDER BY valid_from").all(s.id),
      })),
    );
  });
  app.post("/api/admin/schools/:id/licences", (req, res) => {
    if (!isAdmin(req, res)) return;
    const id = Number(req.params.id);
    if (!db.prepare("SELECT 1 FROM schools WHERE id = ?").get(id)) return res.status(404).json({ error: "Šola ne obstaja." });
    const b = req.body || {};
    const seats = num(b.seats);
    const list = (v, ok) => (Array.isArray(v) && v.length && v.every(ok) ? v : null);
    if (!PLANS.includes(b.plan)) return res.status(400).json({ error: `Paket: ${PLANS.join(", ")}.` });
    if (b.plan === "pilot" && !pilotOpen(db, id)) return res.status(409).json({ error: `Pilotna cena velja samo za prvih ${PILOT_SCHOOLS_MAX} šol.` });
    if (!Number.isInteger(seats) || seats < 1 || seats > 5000) return res.status(400).json({ error: "Število mest 1–5000." });
    const from = b.validFrom || day();
    if (!isDay(from) || !isDay(b.validUntil) || b.validUntil < from) return res.status(400).json({ error: "Veljavnost: validFrom ≤ validUntil (YYYY-MM-DD)." });
    const cap = b.aiCapUsdMonth == null || b.aiCapUsdMonth === "" ? null : num(b.aiCapUsdMonth);
    if (cap !== null && !(cap >= 0 && cap <= 10000)) return res.status(400).json({ error: "Meja AI 0–10000 $ na mesec." });
    const price = b.priceEur == null || b.priceEur === "" ? 0 : num(b.priceEur);
    if (!(price >= 0 && price <= 1000)) return res.status(400).json({ error: "Cena 0–1000 € na učenca." });
    const r = db
      .prepare(
        `INSERT INTO school_licences (school_id, plan, seats, price_eur, subjects, grades, valid_from, valid_until, ai_cap_usd_month, invoice_ref, note)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        id,
        b.plan,
        seats,
        price,
        json(list(b.subjects, (x) => SUBJECTS.includes(x))),
        json(list(b.grades, (x) => Number.isInteger(x) && x >= 1 && x <= 13)),
        from,
        b.validUntil,
        cap,
        clean(b.invoiceRef, 60),
        clean(b.note, 200),
      );
    audit(db, { req, parentId: req.parent.id, actor: "admin", action: "licence_add", target: `school:${id}` });
    res.status(201).json({ id: Number(r.lastInsertRowid), ...schools.licenceView(id) });
  });
  app.delete("/api/admin/licences/:lid", (req, res) => {
    if (!isAdmin(req, res)) return;
    const ok = db.prepare("DELETE FROM school_licences WHERE id = ?").run(Number(req.params.lid)).changes > 0;
    audit(db, { req, parentId: req.parent.id, actor: "admin", action: "licence_delete", target: `licence:${Number(req.params.lid)}`, ok });
    res.json({ ok });
  });

  return schools;
}
