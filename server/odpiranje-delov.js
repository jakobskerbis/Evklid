// Točka B2 (pilot, j 2026-11-14): kateri deli aplikacije se odpirajo in ali se isti učenec vanje vrača.
// Na profil in del hranimo samo prvi dan, zadnji dan in število dni z odprtjem (brez ur, naprave, IP ali piškotkov).
// Skrbnik vidi le skupna števila po delih, brez imen. Vrstice se po MAX_DNI dneh brez odprtja izbrišejo,
// z izbrisom profila pa takoj (tuji ključ). Izvoz podatkov jih zajame sam (server/accounts, exportOtherTables).
import { schoolStudents } from "./schools.js";
import { adminStudentIds } from "./rast.js";

// Deli aplikacije, ki jih štejemo (public/odprto.js mora imeti iste oznake).
export const DELI = ["lekcije", "vadnica", "instruktor", "svet3d", "laboratorij", "igre"];
const MAX_DNI = 120;
const DAY = 86400000;
const isoDay = (t) => new Date(t).toISOString().slice(0, 10);

export function migrateOdpiranje(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS odpiranje_delov (
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    del TEXT NOT NULL,
    prvi TEXT NOT NULL,
    zadnji TEXT NOT NULL,
    dni INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (student_id, del)
  ) WITHOUT ROWID`);
}

// Zabeleži odprtje dela na dan `now` (UTC dan kot drugje v merjenju). Isti dan večkrat = en dan.
export function zabeleziOdprtje(db, studentId, del, now = Date.now()) {
  if (!DELI.includes(del)) return false;
  const dan = isoDay(now);
  db.prepare(
    `INSERT INTO odpiranje_delov (student_id, del, prvi, zadnji, dni) VALUES (?, ?, ?, ?, 1)
     ON CONFLICT (student_id, del) DO UPDATE SET dni = dni + (excluded.zadnji > zadnji), zadnji = max(zadnji, excluded.zadnji)`,
  ).run(studentId, del, dan, dan);
  return true;
}

// Poročilo za zadnjih `days` dni (danes vključno): koliko učencev je del odprlo v obdobju, koliko od njih ga je
// odprlo vsaj dva različna dneva (vrnili so se) in delež med učenci, ki so v obdobju odprli kateri koli del.
export function porociloDelov(db, { days = 30, schoolId = null, now = Date.now(), adminEmails = [] } = {}) {
  migrateOdpiranje(db);
  const n = Math.min(MAX_DNI, Math.max(1, Math.floor(Number(days)) || 30));
  const today = isoDay(now);
  const from = isoDay(Date.parse(today) - (n - 1) * DAY);
  db.prepare("DELETE FROM odpiranje_delov WHERE zadnji < ?").run(isoDay(Date.parse(today) - MAX_DNI * DAY));
  const only = schoolId ? new Set(schoolStudents(db, schoolId)) : null;
  const admins = adminStudentIds(db, adminEmails);
  const counted = (id) => !admins.has(id) && (!only || only.has(id));
  const po = new Map(DELI.map((d) => [d, { del: d, odprli: 0, vrnili: 0 }]));
  const ucenci = new Set();
  for (const r of db.prepare("SELECT student_id AS s, del, dni FROM odpiranje_delov WHERE zadnji >= ? AND zadnji <= ?").all(from, today)) {
    if (!counted(r.s) || !po.has(r.del)) continue;
    ucenci.add(r.s);
    const v = po.get(r.del);
    v.odprli++;
    if (r.dni >= 2) v.vrnili++;
  }
  const delez = (a, b) => (b ? Math.round((a / b) * 1000) / 1000 : null);
  return {
    from,
    to: today,
    days: n,
    ucenci: ucenci.size,
    deli: [...po.values()].map((v) => ({ ...v, delez: delez(v.odprli, ucenci.size), delezVrnili: delez(v.vrnili, v.odprli) })),
  };
}

export function mountOdpiranje(app, store, { loadStudent, accounts, isLocalRequest, adminEmails = [] }) {
  migrateOdpiranje(store.db);
  // Odjemalec (public/odprto.js) pokliče ob odprtju dela; največ enkrat na dan in del.
  app.post("/api/students/:id/odprto", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const del = typeof req.body?.del === "string" ? req.body.del : "";
    if (!zabeleziOdprtje(store.db, s.id, del)) return res.status(400).json({ error: "Neznan del aplikacije." });
    res.status(204).end();
  });
  // Skrbnik (z računi) ali računalnik s strežnikom (brez računov): GET /api/admin/deli?days=30&school=ID
  app.get("/api/admin/deli", (req, res) => {
    const ok = accounts ? !!req.parent?.is_admin : isLocalRequest(req);
    if (!ok) return res.status(403).json({ error: "Samo za skrbnika." });
    const school = typeof req.query.school === "string" && /^\d{1,9}$/.test(req.query.school) ? Number(req.query.school) : null;
    const days = typeof req.query.days === "string" && /^\d{1,3}$/.test(req.query.days) ? Number(req.query.days) : 30;
    res.set("Cache-Control", "no-store").json(porociloDelov(store.db, { days, schoolId: school, adminEmails }));
  });
}
