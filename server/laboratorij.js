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

export function mountLab(app, { loadStudent, accounts }) {
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
