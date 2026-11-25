// Virtualni laboratorij kot svoj zavihek (public/laboratorij.js, docs/laboratorij.md): vsi poskusi iz
// public/sim/katalog.js, vsak enkrat, s temami učbenika. Zaklep je isti kot v učbeniku (GET /api/students/:id/lesson):
// poskus je odklenjen, če bi bil interaktivni del lekcije odklenjen pri vsaj eni njegovi temi.
import { labExperiments, SIM_TOPICS, simsForTopic } from "../public/sim/katalog.js";
import { hasEngine } from "../public/sim/index.js";
import { getTopic, getPath, pathKeyFor } from "./curriculum.js";

const SUBJECT_ORDER = ["FIZ", "KEM", "NAR", "BIO"];
const parts = (key) => /^([A-Z]+)-([A-Z]+)-(\d+)$/.exec(key || "") || [];

// Seznam poskusov za učenca s potjo myPath (npr. FIZ-OS-9): najprej njegov predmet, nato poskusi njegovega
// razreda; tudi teme pri poskusu so v tem vrstnem redu.
export function labList(myPath = "") {
  const [, mySubj, mySchool, myGrade] = parts(myPath);
  const rank = (path) => {
    const [, subj, school, grade] = parts(path);
    if (path === myPath) return 0;
    if (school === mySchool && grade === myGrade) return 1;
    if (subj === mySubj && school === mySchool) return 2;
    return school === mySchool ? 3 : 4;
  };
  const list = labExperiments()
    .filter((x) => hasEngine(x.id))
    .map((x) => {
      const topics = x.topics
        .map((tp) => {
          const t = getTopic(tp.id);
          if (!t) return null;
          const label = getPath(t.path)?.label || t.path;
          return { id: t.id, name: t.name, path: t.path, subject: t.path.split("-")[0], level: label.split(",").slice(1).join(",").trim() || label, rank: rank(t.path) };
        })
        .filter(Boolean)
        .sort((a, b) => a.rank - b.rank);
      return { key: x.key, id: x.id, opts: x.opts, subject: x.subject, title: x.title, desc: x.desc, topics, rank: Math.min(9, ...topics.map((t) => t.rank)) };
    })
    .filter((x) => x.topics.length);
  const mine = (s) => (s === mySubj ? 0 : 1);
  const order = (s) => (SUBJECT_ORDER.includes(s) ? SUBJECT_ORDER.indexOf(s) : 99);
  const best = (s) => Math.min(...list.filter((x) => x.subject === s).map((x) => x.rank));
  return list.sort((a, b) => mine(a.subject) - mine(b.subject) || best(a.subject) - best(b.subject) || order(a.subject) - order(b.subject) || a.rank - b.rank);
}

// Teme učbenika, ki uporabljajo 3D model (3d-<id> v katalogu): gumb »Lekcija« v modelu (public/3d/stran.js), obratno
// kot »V 3D svetu« v lekciji. Vrstni red kot pri poskusih (najprej učenčeva pot). Lekcije niso zaklenjene.
export function teme3d(modelId, myPath = "") {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(modelId || "")) return [];
  const [, mySubj, mySchool, myGrade] = parts(myPath);
  const rank = (path) => {
    const [, subj, school, grade] = parts(path);
    if (path === myPath) return 0;
    if (school === mySchool && grade === myGrade) return 1;
    if (subj === mySubj && school === mySchool) return 2;
    return school === mySchool ? 3 : 4;
  };
  return Object.keys(SIM_TOPICS)
    .filter((id) => simsForTopic(id).some((d) => d.id === `3d-${modelId}`))
    .map((id) => {
      const t = getTopic(id);
      if (!t) return null;
      const label = getPath(t.path)?.label || t.path;
      return { id: t.id, name: t.name, level: label.split(",").slice(1).join(",").trim() || label, rank: rank(t.path) };
    })
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 8)
    .map(({ rank, ...x }) => x);
}

// Štetje uporabe laboratorija (načrt laboratorija, faza 1): koliko poskusov je bilo odprtih, v katerem načinu in koliko
// vodenih poskusov je bilo opravljenih. Samo števci na dan in poskus, brez učenca, naprave ali IP (kot obiski strani
// v server/pilot.js), zato niso osebni podatki. Branje: GET /api/admin/laboratorij?days=30 (skrbnik).
export const NACINI = ["vodeno", "prosto", "brez"];
export const DOGODKI = ["odprt", "preklop", "koncano"];
const MAX_DNI = 120;
export function migrateLab(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS lab_uporaba (
    dan TEXT NOT NULL,
    poskus TEXT NOT NULL,
    nacin TEXT NOT NULL,
    dogodek TEXT NOT NULL,
    n INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (dan, poskus, nacin, dogodek)
  )`);
}
const isoDan = (t) => new Date(t).toISOString().slice(0, 10);
export function labUporaba(db, { days = 30, now = Date.now() } = {}) {
  migrateLab(db);
  const n = Math.min(MAX_DNI, Math.max(1, Math.floor(Number(days)) || 30));
  const od = isoDan(now - (n - 1) * 86400000), _do = isoDan(now);
  const vrstice = db.prepare("SELECT poskus, nacin, dogodek, SUM(n) AS n FROM lab_uporaba WHERE dan >= ? AND dan <= ? GROUP BY poskus, nacin, dogodek").all(od, _do);
  const po = new Map();
  for (const r of vrstice) {
    const x = po.get(r.poskus) || { poskus: r.poskus, odprt: 0, vodeno: 0, prosto: 0, preklopi: 0, koncano: 0 };
    if (r.dogodek === "odprt") (x.odprt += r.n), r.nacin !== "brez" && (x[r.nacin] += r.n);
    else if (r.dogodek === "preklop") x.preklopi += r.n;
    else if (r.dogodek === "koncano") x.koncano += r.n;
    po.set(r.poskus, x);
  }
  const poskusi = [...po.values()].sort((a, b) => b.odprt - a.odprt || a.poskus.localeCompare(b.poskus));
  return { od, do: _do, days: n, poskusi, skupaj: poskusi.reduce((a, x) => a + x.odprt, 0) };
}

export function mountLab(app, { loadStudent, accounts, db = null, isAdmin = () => false }) {
  const inc = db ? (migrateLab(db), db.prepare("INSERT INTO lab_uporaba (dan, poskus, nacin, dogodek, n) VALUES (?, ?, ?, ?, 1) ON CONFLICT(dan, poskus, nacin, dogodek) DO UPDATE SET n = n + 1")) : null;
  const kljuci = new Set(labExperiments().map((x) => x.key));
  // Isti dogodek istega učenca pri istem poskusu se v 10 s šteje enkrat (dvojni klik, ponovni izris). Samo v pomnilniku.
  const nedavno = new Map();
  app.post("/api/students/:id/lab/uporaba", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const { key, nacin, dogodek } = req.body || {};
    if (!kljuci.has(key) || !NACINI.includes(nacin) || !DOGODKI.includes(dogodek)) return res.status(400).json({ error: "Neznan poskus ali dogodek." });
    const id = `${s.id}|${key}|${nacin}|${dogodek}`, t = Date.now();
    if (nedavno.size > 5000) nedavno.clear();
    if (t - (nedavno.get(id) || 0) > 10000) {
      nedavno.set(id, t);
      try {
        inc?.run(isoDan(t), key, nacin, dogodek);
      } catch {}
    }
    res.json({ ok: true });
  });
  if (db)
    app.get("/api/admin/laboratorij", (req, res) => {
      if (!isAdmin(req)) return res.status(403).json({ error: "Samo za skrbnika." });
      const days = typeof req.query.days === "string" && /^\d{1,3}$/.test(req.query.days) ? Number(req.query.days) : 30;
      res.json(labUporaba(db, { days }));
    });

  app.get("/api/students/:id/lab", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const myPath = pathKeyFor(s.settings) || "";
    const open = (x) => !accounts || x.topics.some((t) => accounts.lessonInteractive(s.id, t.id));
    // Zaklenjen poskus (kot lekcija brez interaktivnega dela) nima simulacije, ostanejo naslov, opis in teme.
    const experiments = labList(myPath).map((x) => (open(x) ? { ...x, locked: false } : { ...x, id: null, opts: {}, locked: true }));
    const anyLocked = experiments.some((x) => x.locked);
    // Pravila ponudb kot v učbeniku: gumb »Poglej pakete« le, ko ponudba s ceno sme biti prikazana.
    res.json({ myPath, experiments, ...(anyLocked ? { offers: accounts.offersFor(s.id) } : {}) });
  });
  app.get("/api/students/:id/svet3d/:model/teme", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    res.json({ teme: teme3d(String(req.params.model || ""), pathKeyFor(s.settings) || "") });
  });
}
