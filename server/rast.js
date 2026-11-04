// Lastna analitika rasti (j 2026-11-04, načrt rasti pred pilotom 15. 11.): od kod pridejo učenci,
// ali v prvih 24 urah rešijo prvo nalogo in ali se vrnejo naslednji dan in po 7 dneh (pogoj pilota: 40 %).
// Brez zunanjih sledilnikov, piškotkov in naslovov IP: vir je kratka oznaka na profilu (students.vir),
// obiski s povezav z oznako so samo število na dan in oznako (source_visits).
import { schoolStudents } from "./schools.js";
import { BOT } from "./pilot.js";

export const D7_TARGET = 0.4; // pogoj pilota v načrtu rasti: vsaj 40 % se vrne po 7 dneh
const MIN_D7 = 5; // manj profilov, starejših od 7 dni = premalo za oceno
const MAX_DAYS = 120;
const MAX_SOURCES_PER_DAY = 40; // tuje povezave ne morejo napolniti tabele z oznakami
// Strani, na katere vodijo povezave z oznako (aplikacija, strani za starše in šole).
const LANDING = new Set(["/", "/index.html", "/starsi.html", "/placaj.html", "/sole", "/sole.html"]);

const DAY = 86400000;
const isoDay = (t) => new Date(t).toISOString().slice(0, 10);
const dayDiff = (a, b) => Math.round((Date.parse(a) - Date.parse(b)) / DAY);
const addDays = (d, n) => isoDay(Date.parse(d) + n * DAY);

// Oznaka vira: male črke, številke, - in _, največ 32 znakov (»Facebook Učitelji« → »facebook-ucitelji«).
export function cleanSource(v) {
  if (typeof v !== "string") return null;
  const s = v
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "")
    .slice(0, 32)
    .replace(/[-_]+$/, "");
  return s || null;
}

// Vir iz povezave: ?utm_source= ali ?vir=, sicer priporočilo (?ref=) ali koda razreda (?koda=).
export function sourceFromQuery(q = {}) {
  const pick = (k) => (typeof q[k] === "string" ? q[k] : Array.isArray(q[k]) ? String(q[k][0] ?? "") : "");
  return cleanSource(pick("utm_source")) || cleanSource(pick("vir")) || (pick("ref").trim() ? "priporocilo" : pick("koda").trim() ? "razred" : null);
}

export function migrateRast(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS source_visits (
    day TEXT NOT NULL,
    vir TEXT NOT NULL,
    n INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (day, vir)
  )`);
}

// Ob ustvarjenju profila: zapiše vir, če ga profil še nima (prvi vir velja).
export function setSource(db, studentId, vir) {
  const v = cleanSource(vir);
  if (!v || !studentId) return;
  db.prepare("UPDATE students SET vir = ? WHERE id = ? AND vir IS NULL").run(v, studentId);
}

// Vmesna plast pred statičnimi datotekami: prešteje odprtje strani s povezave z oznako (GET, ne roboti, ne predogledi).
export function sourceVisitCounter(db) {
  migrateRast(db);
  const inc = db.prepare("INSERT INTO source_visits (day, vir, n) VALUES (?, ?, 1) ON CONFLICT(day, vir) DO UPDATE SET n = n + 1");
  const known = db.prepare("SELECT 1 FROM source_visits WHERE day = ? AND vir = ?");
  const count = db.prepare("SELECT COUNT(*) AS n FROM source_visits WHERE day = ?");
  return (req, res, next) => {
    if (req.method !== "GET" || !LANDING.has(req.path)) return next();
    const vir = sourceFromQuery(req.query);
    if (!vir || BOT.test(req.get("user-agent") || "") || /prefetch|prerender/i.test(`${req.get("purpose") || ""} ${req.get("sec-purpose") || ""}`)) return next();
    res.on("finish", () => {
      if (res.statusCode >= 400) return;
      try {
        const day = isoDay(Date.now());
        inc.run(day, known.get(day, vir) || count.get(day).n < MAX_SOURCES_PER_DAY ? vir : "drugo");
      } catch {}
    });
    next();
  };
}

const hasTable = (db, name) => !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(name);

// Profili skrbnika (EVKLID_ADMIN_EMAILS ali zastavica is_admin) se ne štejejo: to so preizkusi, ne učenci.
function adminStudentIds(db, adminEmails = []) {
  if (!hasTable(db, "parents")) return new Set();
  const cols = db.prepare("PRAGMA table_info(students)").all().map((c) => c.name);
  if (!cols.includes("parent_id")) return new Set();
  const emails = adminEmails.map((e) => String(e).trim().toLowerCase()).filter(Boolean);
  const rows = db
    .prepare(
      `SELECT s.id FROM students s JOIN parents p ON p.id = s.parent_id
       WHERE p.is_admin = 1 ${emails.length ? `OR lower(p.email) IN (${emails.map(() => "?").join(",")})` : ""}`,
    )
    .all(...emails);
  return new Set(rows.map((r) => r.id));
}

// Poročilo za zadnjih `days` dni (danes vključno); s `schoolId` samo učenci te šole.
// Aktiven dan = učenec ta dan odgovori na nalogo, vpraša inštruktorja ali dobi točke (events, messages, xp_events).
export function growthReport(db, { days = 30, schoolId = null, now = Date.now(), adminEmails = [] } = {}) {
  migrateRast(db);
  const n = Math.min(MAX_DAYS, Math.max(1, Math.floor(Number(days)) || 30));
  const today = isoDay(now);
  const from = addDays(today, -(n - 1));
  const weeks = Math.ceil(n / 7);
  const floor = addDays(today, -(weeks * 7 - 1)); // začetek najstarejšega tedna (≤ from)

  const only = schoolId ? new Set(schoolStudents(db, schoolId)) : null;
  const admins = adminStudentIds(db, adminEmails);
  const counted = (id) => !admins.has(id) && (!only || only.has(id));

  const students = db
    .prepare("SELECT id, vir, created_at, substr(created_at, 1, 10) AS d0 FROM students WHERE created_at >= ? ORDER BY id")
    .all(floor)
    .filter((s) => counted(s.id) && s.d0 <= today);

  const active = new Map(); // učenec → množica aktivnih dni
  const acts = db
    .prepare(
      `SELECT student_id AS s, substr(created_at, 1, 10) AS d FROM events WHERE created_at >= ?
       UNION SELECT c.student_id, substr(m.created_at, 1, 10) FROM messages m JOIN conversations c ON c.id = m.conversation_id
         WHERE m.role = 'user' AND m.created_at >= ?
       UNION SELECT student_id, substr(created_at, 1, 10) FROM xp_events WHERE created_at >= ?`,
    )
    .all(floor, floor, floor);
  for (const { s, d } of acts) {
    if (!counted(s) || d > today) continue;
    if (!active.has(s)) active.set(s, new Set());
    active.get(s).add(d);
  }

  const cohort = students.filter((s) => s.d0 >= from);
  // Prva rešena naloga v prvih 24 urah po ustvarjenju profila.
  const firstTask = new Set(
    db
      .prepare(
        `SELECT DISTINCT t.student_id AS id FROM tasks t JOIN students s ON s.id = t.student_id
         WHERE t.solved = 1 AND s.created_at >= ? AND t.created_at < datetime(s.created_at, '+1 day')`,
      )
      .all(from)
      .map((r) => r.id),
  );
  const backOn = (s, lo, hi) => [...(active.get(s.id) || [])].some((d) => {
    const k = dayDiff(d, s.d0);
    return k >= lo && k <= hi;
  });
  const d1Eligible = (s) => s.d0 < today;
  const d7Eligible = (s) => dayDiff(today, s.d0) >= 7;
  const share = (list, ok) => {
    const eligible = list.length;
    const returned = list.filter(ok).length;
    return { eligible, returned, pct: eligible ? Math.round((returned / eligible) * 1000) / 1000 : null };
  };
  const activation = share(cohort, (s) => firstTask.has(s.id));
  const d1 = share(cohort.filter(d1Eligible), (s) => backOn(s, 1, 1));
  const d7 = share(cohort.filter(d7Eligible), (s) => backOn(s, 7, 13));

  // Tedni od najstarejšega do tega (zadnji se konča danes): novi profili in aktivni učenci.
  const weekRows = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const end = addDays(today, -7 * i);
    const start = addDays(end, -6);
    let activeN = 0;
    for (const ds of active.values()) if ([...ds].some((d) => d >= start && d <= end)) activeN++;
    weekRows.push({ start, end, newProfiles: students.filter((s) => s.d0 >= start && s.d0 <= end).length, active: activeN });
  }

  // Viri: ogledi s povezav z oznako in profili, ustvarjeni v obdobju.
  const bySource = new Map();
  const row = (vir) => {
    if (!bySource.has(vir)) bySource.set(vir, { vir, visits: 0, profiles: 0, firstTask: 0, d7Eligible: 0, d7Returned: 0 });
    return bySource.get(vir);
  };
  for (const v of db.prepare("SELECT vir, SUM(n) AS n FROM source_visits WHERE day >= ? AND day <= ? GROUP BY vir").all(from, today)) row(v.vir).visits = v.n;
  for (const s of cohort) {
    const r = row(s.vir || "");
    r.profiles++;
    if (firstTask.has(s.id)) r.firstTask++;
    if (d7Eligible(s)) {
      r.d7Eligible++;
      if (backOn(s, 7, 13)) r.d7Returned++;
    }
  }
  const sources = [...bySource.values()].sort((a, b) => b.profiles - a.profiles || b.visits - a.visits || a.vir.localeCompare(b.vir));

  return {
    from,
    to: today,
    days: n,
    schoolId: schoolId || null,
    newProfiles: cohort.length,
    activation,
    d1,
    d7,
    goal: { target: D7_TARGET, status: d7.eligible < MIN_D7 ? "wait" : d7.pct >= D7_TARGET ? "met" : "notYet" },
    weeklyActive: weekRows.at(-1)?.active || 0,
    weeks: weekRows,
    sources,
  };
}

// Skrbnik (z računi) ali računalnik s strežnikom (brez računov): GET /api/admin/rast?days=30&school=ID
export function mountRast(app, store, { accounts, isLocalRequest, adminEmails = [] }) {
  app.get("/api/admin/rast", (req, res) => {
    const ok = accounts ? !!req.parent?.is_admin : isLocalRequest(req);
    if (!ok) return res.status(403).json({ error: "Samo za skrbnika." });
    const school = typeof req.query.school === "string" && /^\d{1,9}$/.test(req.query.school) ? Number(req.query.school) : null;
    const days = typeof req.query.days === "string" && /^\d{1,3}$/.test(req.query.days) ? Number(req.query.days) : 30;
    res.json(growthReport(store.db, { days, schoolId: school, adminEmails }));
  });
}
