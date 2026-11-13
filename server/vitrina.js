// Vitrina v razredu (j-jev dokument o kozmetiki, »Avatar, vitrina in socialni sloj«): v razredu, ki ga je
// odprl učitelj, učenec lahko vklopi »Pokaži mojo vitrino sošolcem«. Privzeto je izklopljeno (stolpec
// class_members.showcase_shared). Sošolci nato vidijo njegov avatar, do tri predmete iz vitrine (izbira je ista
// kot na profilu, server/zbirke.js) in vrstico z lestvice razreda, za vsak predmet pa samo temo in datum.
// Zasebnost (uporabniki so mladoletni):
// - samo razredi učitelja (kind = 'class'), ne skupine prijateljev; samo člani istega razreda;
// - učitelj lahko vitrine v razredu izklopi (classes.showcase_off) in učenec tega ne more obiti;
// - poti so pod /api/students/:id, zato z računi veljata lastništvo profila (starš) in geslo profila;
// - odgovor ima samo vzdevek (kot na lestvici), avatar, XP in predmete: brez id-jev, imen, šole, starosti.
import { getTopic } from "./curriculum.js";

// Dan pridobitve po slovenskem času (earned_at je UTC iz SQLite), brez ure.
const DAY = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Ljubljana", year: "numeric", month: "2-digit", day: "2-digit" });
export function dayOf(sql) {
  const d = new Date(`${String(sql || "").replace(" ", "T")}Z`);
  return Number.isNaN(d.getTime()) ? "" : DAY.format(d);
}

const SOURCES = new Set(["practice", "chat", "placement", "pass", "set", "xp", "league", "games"]);

export function ensureShowcaseColumns(db) {
  const cm = db.prepare("PRAGMA table_info(class_members)").all().map((c) => c.name);
  if (!cm.includes("showcase_shared")) db.exec("ALTER TABLE class_members ADD COLUMN showcase_shared INTEGER NOT NULL DEFAULT 0");
  const cl = db.prepare("PRAGMA table_info(classes)").all().map((c) => c.name);
  if (!cl.includes("showcase_off")) db.exec("ALTER TABLE classes ADD COLUMN showcase_off INTEGER NOT NULL DEFAULT 0");
}

export class ClassShowcase {
  constructor(db, { leagues, knowledge }) {
    this.db = db;
    this.leagues = leagues;
    this.knowledge = knowledge;
    ensureShowcaseColumns(db);
  }

  // Članstvo v razredu učitelja (ali null).
  membership(studentId, classId) {
    return this.db
      .prepare(
        `SELECT c.id, c.showcase_off, m.showcase_shared FROM class_members m JOIN classes c ON c.id = m.class_id
         WHERE m.student_id = ? AND m.class_id = ? AND c.kind = 'class'`,
      )
      .get(studentId, classId) || null;
  }

  setShared(studentId, classId, on) {
    const m = this.membership(studentId, classId);
    if (!m) return { error: "Nisi v tem razredu.", status: 404 };
    if (on && m.showcase_off) return { error: "Učitelj je vitrine v tem razredu izklopil.", status: 403 };
    this.db.prepare("UPDATE class_members SET showcase_shared = ? WHERE class_id = ? AND student_id = ?").run(on ? 1 : 0, classId, studentId);
    return { on: !!on };
  }

  // Izklop pobriše tudi vklope učencev: ko učitelj vitrine spet dovoli, se nobena ne pokaže brez novega vklopa.
  setTeacherOff(classId, off) {
    this.db.prepare("UPDATE classes SET showcase_off = ? WHERE id = ? AND kind = 'class'").run(off ? 1 : 0, classId);
    if (off) this.db.prepare("UPDATE class_members SET showcase_shared = 0 WHERE class_id = ?").run(classId);
  }

  // Predmeti vitrine učenca s temo in datumom (samo dan), brez id-jev teme in učenca.
  items(studentId) {
    const shown = this.knowledge.showcase(studentId);
    if (!shown.length) return [];
    const rows = new Map(this.knowledge.rows(studentId).map((r) => [r.item, r]));
    return shown.map((item) => {
      const r = rows.get(item);
      const t = r?.topic_id ? getTopic(r.topic_id) : null;
      // Samo ime teme in predmet (koda, npr. KEM), brez učne poti z razredom ali letnikom.
      return { item, date: dayOf(r?.earned_at), source: SOURCES.has(r?.source) ? r.source : null, topic: t ? { name: t.name, subject: t.subject || null } : null };
    });
  }

  // Vitrine razreda za gledalca, ki je član istega razreda; učenci brez vklopa se ne pokažejo.
  list(classId, viewerId) {
    const m = this.membership(viewerId, classId);
    if (!m) return null;
    if (m.showcase_off) return [];
    const shared = new Set(this.db.prepare("SELECT student_id FROM class_members WHERE class_id = ? AND showcase_shared = 1").all(classId).map((r) => r.student_id));
    if (!shared.size) return [];
    return this.leagues
      .classBoard(classId, viewerId)
      .filter((r) => shared.has(r._id))
      .map((r) => ({
        rank: r.rank,
        nickname: r.nickname,
        avatar: r.avatar,
        xp: r.xp,
        month: r.month,
        me: r.me,
        items: this.items(r._id),
      }));
  }

  // Pogled za učenca: vsi njegovi razredi učitelja, njegov vklop in vitrine sošolcev.
  view(studentId) {
    const classes = this.db
      .prepare(
        `SELECT c.id, c.showcase_off, m.showcase_shared FROM class_members m JOIN classes c ON c.id = m.class_id
         WHERE m.student_id = ? AND c.kind = 'class' ORDER BY m.joined_at, c.id`,
      )
      .all(studentId);
    return {
      classes: classes.map((c) => ({ id: c.id, on: !!c.showcase_shared && !c.showcase_off, off: !!c.showcase_off, list: this.list(c.id, studentId) || [] })),
    };
  }
}

export function mountClassShowcase(app, db, { loadStudent, leagues, knowledge }) {
  const vitrina = new ClassShowcase(db, { leagues, knowledge });
  app.get("/api/students/:id/vitrina", (req, res) => {
    const s = loadStudent(req, res);
    if (s) res.json(vitrina.view(s.id));
  });
  app.put("/api/students/:id/classes/:classId/vitrina", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    if (typeof req.body?.on !== "boolean") return res.status(400).json({ error: "Manjka on: true ali false." });
    const out = vitrina.setShared(s.id, Number(req.params.classId), req.body.on);
    if (out.error) return res.status(out.status).json({ error: out.error });
    res.json(out);
  });
  // Učitelj (ključ razreda ali prijavljen lastnik) vitrine v razredu izklopi ali spet dovoli.
  app.put("/api/teacher/classes/:code/showcase", (req, res) => {
    const cls = leagues.authTeacher(req.params.code, req.get("x-teacher-key"), req.parent?.id ?? null);
    if (!cls) return res.status(403).json({ error: "Napačna koda ali ključ razreda." });
    if (typeof req.body?.off !== "boolean") return res.status(400).json({ error: "Manjka off: true ali false." });
    vitrina.setTeacherOff(cls.id, req.body.off);
    res.json({ ok: true, showcaseOff: req.body.off });
  });
  return vitrina;
}
