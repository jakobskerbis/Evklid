// Poskusni izpit na naši poli (j, 25. 11. 2026, modul NPZ in matura): učenec piše eno izpitno polo naše pole
// (content/exam-papers) s pravim časom in brez rešitev, nato se sam oceni po točkovniku (0 … točke dela).
// Strežnik preveri ključe in točke, sešteje rezultat po temah (paperTopics, isto kot šibke točke) in ga shrani kot
// končano sejo kind = 'pola' v tabeli sessions (ista kategorija podatkov kot poskusni izpit iz generatorjev:
// učni rezultat, izbriše se z učencem). Deli z manj kot polovico točk gredo v šibke točke (vir »paper«, vsak del
// enkrat, kot »Imam prav« na isti poli).
import { randomUUID } from "node:crypto";
import { loadOurPaper } from "./our-papers.js";
import { paperTopics, recordSkill, firstTime, PAPER_MAX } from "./weaknesses.js";
import { partKey, simScope } from "../public/our-paper-key.js";
import { getTopic } from "./curriculum.js";

export const SIM_PER_DAY = 20; // varovalka pred zlorabo (pola traja vsaj 45 minut)

// Rezultat: { points, maxPoints, percent, topics: [{ id, name, got, max }], parts (ocenjeni deli) } (šibkejše teme
// najprej, »Drugo« na koncu). Točke so cela števila (JSON number), ne besedilo.
export function gradeSim(paperId, paper, pola, given) {
  const scope = simScope(paper, pola);
  if (!scope) return null;
  const map = paperTopics(paperId, paper);
  const byTopic = new Map();
  const parts = [];
  let points = 0;
  for (const tk of scope.tasks)
    for (const p of tk.parts) {
      const key = partKey(tk, p);
      const raw = given?.[key];
      // Neocenjen del: pri izbirnih nalogah ga učenec ni izbral (ne šteje nikamor), sicer šteje 0 točk tudi pri temi.
      if (raw === undefined || raw === null) {
        if (scope.choice) continue;
      } else if (typeof raw !== "number" || !Number.isInteger(raw) || raw < 0 || raw > p.points) return { error: `Neveljavne točke pri ${key}.` };
      const got = raw ?? 0;
      points += got;
      if (raw !== undefined && raw !== null) parts.push({ key, got, max: p.points });
      const id = map.get(key) || "";
      const row = byTopic.get(id) || { id, got: 0, max: 0 };
      row.got += got;
      row.max += p.points;
      byTopic.set(id, row);
    }
  if (!parts.length) return { error: "Oceni vsaj en del." };
  points = Math.min(points, scope.maxPoints);
  const topics = [...byTopic.values()]
    .map((r) => ({ ...r, name: r.id ? getTopic(r.id)?.name || "" : "" }))
    .sort((a, b) => !a.id - !b.id || a.got / a.max - b.got / b.max || b.max - a.max);
  return { points, maxPoints: scope.maxPoints, percent: Math.round((100 * points) / scope.maxPoints), topics, parts };
}

// Zadnji rezultati poskusnih pol za izpit in predmet (stran »NPZ in matura«).
export function simHistory(db, studentId, exam, subject, limit = 5) {
  return db
    .prepare("SELECT params, created_at FROM sessions WHERE student_id = ? AND kind = 'pola' AND finished = 1 ORDER BY created_at DESC, rowid DESC LIMIT 200")
    .all(studentId)
    .map((r) => ({ ...JSON.parse(r.params), date: `${r.created_at.replace(" ", "T")}Z` })) // čas UTC; odjemalec izpiše lokalni dan
    .filter((r) => r.exam === exam && r.subject === subject)
    .slice(0, limit)
    .map(({ paper, pola, points, maxPoints, percent, seconds, topics, date }) => ({ paper, pola, points, maxPoints, percent, seconds, date, weak: weakOf(topics) }));
}

// Do tri teme z manj kot 70 % točk, najšibkejša prva (za gumb »Vadi«).
const weakOf = (topics = []) =>
  topics
    .filter((t) => t.id && t.max > 0 && t.got / t.max < 0.7)
    .slice(0, 3)
    .map(({ id, name, got, max }) => ({ id, name, got, max }));

export function mountPoskusnaPola(app, store, { loadStudent }) {
  const db = store.db;
  // Telo: { paper, pola (številka izpitne pole ali null), points: { "1-A3b": 2, … }, seconds }.
  app.post("/api/students/:id/exam-sim", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const id = String(req.body?.paper || "");
    const paper = /^[A-Za-z0-9-]{3,80}$/.test(id) ? loadOurPaper(id) : null;
    if (!paper) return res.status(404).json({ error: "Pola ne obstaja." });
    const pola = req.body?.pola === null || req.body?.pola === undefined ? null : Number(req.body.pola);
    const given = req.body?.points;
    if (!given || typeof given !== "object" || Array.isArray(given) || Object.keys(given).length > 200) return res.status(400).json({ error: "Manjkajo točke." });
    const r = gradeSim(id, paper, pola, given);
    if (!r) return res.status(400).json({ error: "Ta pola nima te izpitne pole." });
    if (r.error) return res.status(400).json({ error: r.error });
    const today = db.prepare("SELECT COUNT(*) AS n FROM sessions WHERE student_id = ? AND kind = 'pola' AND date(created_at) = date('now')").get(s.id).n;
    if (today >= SIM_PER_DAY) return res.status(429).json({ error: "Danes si shranil že veliko pol. Poskusi jutri." });
    const seconds = Math.max(0, Math.min(6 * 3600, Math.round(Number(req.body?.seconds) || 0)));
    const params = { paper: id, exam: paper.exam, subject: paper.subject, pola, points: r.points, maxPoints: r.maxPoints, percent: r.percent, seconds, topics: r.topics };
    db.prepare("INSERT INTO sessions (id, student_id, kind, params, plan, finished) VALUES (?, ?, 'pola', ?, '[]', 1)").run(randomUUID(), s.id, JSON.stringify(params));
    // Šibke točke: del z manj kot polovico točk je napaka; vsak del enkrat (skupaj z »Imam prav«), največ PAPER_MAX na temo.
    const map = paperTopics(id, paper);
    const perTopic = new Map();
    for (const p of r.parts) {
      const topicId = map.get(p.key);
      if (!topicId || (perTopic.get(topicId) || 0) >= PAPER_MAX || !firstTime(db, s.id, `P|${id}|${p.key}`)) continue;
      perTopic.set(topicId, (perTopic.get(topicId) || 0) + 1);
      recordSkill(db, s.id, { source: "paper", topicId, n: 1, wrong: 2 * p.got < p.max ? 1 : 0 });
    }
    res.json({ points: r.points, maxPoints: r.maxPoints, percent: r.percent, topics: r.topics, weak: weakOf(r.topics) });
  });
}
