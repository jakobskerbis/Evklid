// Merjenje v pilotu (j 2026-10-30, točka 6 načrta »Evklid Osebno in šolska licenca»):
// vprašanja inštruktorju na dan, strošek AI na učenca in obiski strani za starše.
// Obiski: samo števec na dan in stran (brez IP, piškotkov ali naprave), zato ne potrebuje privolitve.
import { schoolStudents } from "./schools.js";
import { EUR_PER_USD } from "./usage.js";

// Strani za starše in šole, ki jih štejemo (pot → ime v poročilu).
export const COUNTED = { "/starsi.html": "starsi", "/placaj.html": "placaj", "/sole": "sole", "/sole.html": "sole" };
export const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|curl|wget|python|headless/i;
const MAX_DAYS = 120;

export function migratePilot(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS page_visits (
    day TEXT NOT NULL,
    page TEXT NOT NULL,
    n INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (day, page)
  )`);
}

const isoDay = (d) => new Date(d).toISOString().slice(0, 10);

// Vmesna plast pred statičnimi datotekami: prešteje ogled strani za starše (GET, ne roboti, ne predogledi povezav).
export function visitCounter(db) {
  migratePilot(db);
  const inc = db.prepare("INSERT INTO page_visits (day, page, n) VALUES (?, ?, 1) ON CONFLICT(day, page) DO UPDATE SET n = n + 1");
  return (req, res, next) => {
    const page = req.method === "GET" ? COUNTED[req.path] : null;
    if (page && !BOT.test(req.get("user-agent") || "") && !/prefetch|prerender/i.test(`${req.get("purpose") || ""} ${req.get("sec-purpose") || ""}`)) {
      // Šteje samo ogled, ki je stran res dobil (200 ali 304), ne 404 (npr. /sole, ko strani še ni).
      res.on("finish", () => {
        if (res.statusCode >= 400) return;
        try {
          inc.run(isoDay(Date.now()), page);
        } catch {}
      });
    }
    next();
  };
}

// Poročilo za zadnjih `days` dni (danes vključno); z `schoolId` samo učenci te šole (obiski strani so za vse).
export function pilotReport(db, { days = 30, schoolId = null, now = Date.now() } = {}) {
  migratePilot(db);
  const n = Math.min(MAX_DAYS, Math.max(1, Math.floor(Number(days)) || 30));
  const to = isoDay(now);
  const from = isoDay(now - (n - 1) * 86400000);
  const ids = schoolId ? schoolStudents(db, schoolId) : null;
  const inIds = ids ? `AND student_id IN (${ids.map(() => "?").join(",") || "NULL"})` : "";
  const args = ids || [];
  const q = db
    .prepare(
      `SELECT substr(m.created_at, 1, 10) AS day, COUNT(*) AS questions, COUNT(DISTINCT c.student_id) AS students
       FROM messages m JOIN conversations c ON c.id = m.conversation_id
       WHERE m.role = 'user' AND m.created_at >= ? AND m.created_at < date(?, '+1 day') ${inIds.replace("student_id", "c.student_id")}
       GROUP BY day`,
    )
    .all(from, to, ...args);
  const cost = db
    .prepare(
      `SELECT substr(created_at, 1, 10) AS day, SUM(cost_usd) AS usd, SUM(CASE WHEN student_id IS NOT NULL THEN cost_usd ELSE 0 END) AS studentUsd
       FROM usage WHERE created_at >= ? AND created_at < date(?, '+1 day') ${inIds} GROUP BY day`,
    )
    .all(from, to, ...args);
  const visits = db.prepare("SELECT day, page, n FROM page_visits WHERE day >= ? AND day <= ?").all(from, to);
  const totals = (sql) => db.prepare(sql).get(from, to, ...args);
  const askers = totals(
    `SELECT COUNT(DISTINCT c.student_id) AS n FROM messages m JOIN conversations c ON c.id = m.conversation_id
     WHERE m.role = 'user' AND m.created_at >= ? AND m.created_at < date(?, '+1 day') ${inIds.replace("student_id", "c.student_id")}`,
  ).n;
  const users = totals(`SELECT COUNT(DISTINCT student_id) AS n FROM usage WHERE student_id IS NOT NULL AND created_at >= ? AND created_at < date(?, '+1 day') ${inIds}`).n;

  const byDay = new Map();
  for (let i = 0; i < n; i++) {
    const day = isoDay(now - (n - 1 - i) * 86400000);
    byDay.set(day, { day, questions: 0, askers: 0, aiUsd: 0, visits: { starsi: 0, placaj: 0, sole: 0 } });
  }
  for (const r of q) if (byDay.has(r.day)) Object.assign(byDay.get(r.day), { questions: r.questions, askers: r.students });
  let studentUsd = 0; // brez stroškov, ki niso vezani na učenca (npr. povzetek mnenj, izbrisani profili)
  for (const r of cost) {
    if (!byDay.has(r.day)) continue;
    byDay.get(r.day).aiUsd = r.usd || 0;
    studentUsd += r.studentUsd || 0;
  }
  for (const r of visits) if (byDay.has(r.day)) byDay.get(r.day).visits[r.page] = (byDay.get(r.day).visits[r.page] || 0) + r.n;
  const rows = [...byDay.values()];
  const firstUse = rows.findIndex((r) => r.aiUsd > 0);
  const activeDays = firstUse < 0 ? n : n - firstUse;
  const sum = (f) => rows.reduce((a, r) => a + f(r), 0);
  const questions = sum((r) => r.questions);
  const askerDays = sum((r) => r.askers);
  const aiUsd = sum((r) => r.aiUsd);
  const round = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;
  return {
    from,
    to,
    days: n,
    schoolId: schoolId || null,
    students: ids ? ids.length : null, // učenci šole (z licenco ali brez)
    rows: rows.map((r) => ({ ...r, aiUsd: round(r.aiUsd, 4) })),
    totals: {
      questions,
      questionsPerDay: round(questions / n, 1),
      // Na učenca, ki je ta dan kaj vprašal (povprečje čez dneve z vprašanji).
      questionsPerAskerDay: askerDays ? round(questions / askerDays, 1) : 0,
      askers,
      aiUsd: round(aiUsd, 4),
      aiEur: round(aiUsd * EUR_PER_USD(), 4),
      aiUsers: users,
      // Strošek AI na učenca, ki je AI uporabil, preračunan na 30 dni.
      // Dnevi od prve porabe v obdobju (pilot, mlajši od izbranega obdobja, ne zniža ocene).
      aiEurPerStudentMonth: users ? round(((studentUsd * EUR_PER_USD()) / users) * (30 / activeDays), 3) : 0,
      visits: {
        starsi: sum((r) => r.visits.starsi),
        placaj: sum((r) => r.visits.placaj),
        sole: sum((r) => r.visits.sole),
      },
    },
  };
}

// Skrbnik (z računi) ali računalnik s strežnikom (brez računov): GET /api/admin/pilot?days=30&school=ID
export function mountPilot(app, store, { accounts, isLocalRequest }) {
  const db = store.db;
  app.get("/api/admin/pilot", (req, res) => {
    const ok = accounts ? !!req.parent?.is_admin : isLocalRequest(req);
    if (!ok) return res.status(403).json({ error: "Samo za skrbnika." });
    const school = typeof req.query.school === "string" && /^\d{1,9}$/.test(req.query.school) ? Number(req.query.school) : null;
    const days = typeof req.query.days === "string" && /^\d{1,3}$/.test(req.query.days) ? Number(req.query.days) : 30;
    let schools = [];
    try {
      schools = db.prepare("SELECT id, name FROM schools ORDER BY name").all();
    } catch {}
    res.json({ ...pilotReport(db, { days, schoolId: school }), schools });
  });
}
