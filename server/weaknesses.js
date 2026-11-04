// Šibke točke: ročno vnesene + samodejno zaznane iz vseh mest, kjer učenec rešuje naloge (j 2026-11-04:
// »naj za šibke točke Evklid zbira info od povsod«). En skupen seznam za inštruktorja, Napredek, delovni
// list iz šibkih tem, igre (»Ponovi šibke teme«) in tedensko poročilo staršem.
//
// Viri (vsi lokalno, brez dodatnih klicev modela):
// - klepet z inštruktorjem (META vrstica) in naloge v Vadnici: tabela events (kot doslej, zdaj s topic_id);
// - igre, vprašanja »Preveri se« v učbeniku, naše pole NPZ/mature (»Imam prav«), kartice in kviz v razredu:
//   tabela skill_results, samo dnevne vsote po temi (brez odgovorov, brez časov posameznih nalog).
// Vse gre pod isti ključ: id teme učne poti (npr. MAT-OS-8/linearne-enacbe). Prosto ime iz klepeta ali
// kartice se preslika na temo z lokalnim iskanjem po imenih tem (lekcija-za-vprasanje.js); kar se ne
// preslika, ostane pod svojim imenom.
import { getTopic, getPath } from "./curriculum.js";
import { topicForName } from "./lekcija-za-vprasanje.js";
import { stopnja } from "../public/stopnja.js";
import { loadLesson } from "./textbook.js";
import { loadOurPaper } from "./our-papers.js";
import { partKey } from "../public/our-paper-key.js";

const SUBJECT_LABEL = { MAT: "MAT", FIZ: "FIZ", KEM: "KEM", BIO: "BIO", GEO: "GEO", RAC: "RAČ", EKO: "EKO" };

// Tema je šibka, če je imel učenec v zadnjih DAYS dneh vsaj MIN_TURNS odgovorov pri njej (iz vseh virov
// skupaj) in je bil delež napak vsaj MIN_RATE.
export const MIN_TURNS = 3;
export const MIN_RATE = 0.4;
export const DAYS = 60;
// Ena igra prinese veliko hitrih odgovorov; da igre ne preglasijo nalog in klepeta, šteje ena igra
// največ GAME_MAX odgovorov (napake sorazmerno).
export const GAME_MAX = 4;
export const SOURCES = ["chat", "practice", "game", "lesson", "paper", "cards", "kviz"];

const fold = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Ime teme (META, kartica) → id teme učne poti ali null. Predmet imena ima prednost pred predmetom profila.
const memo = new Map();
export function topicIdFor(settings = {}, subject, name) {
  if (!name) return null;
  const s = { ...settings, subject: subject || settings.subject };
  const k = `${s.subject}|${s.school_system || ""}|${stopnja(s)}|${s.curriculum_level || ""}|${fold(name)}`;
  if (memo.has(k)) return memo.get(k);
  let id = null;
  try {
    id = topicForName(name, s);
  } catch {
    id = null;
  }
  if (memo.size > 5000) memo.clear();
  memo.set(k, id);
  return id;
}

// Prvi znani: učenec je vsaj enkrat odgovoril (vprašanje lekcije danes, del pole kadarkoli).
export function firstTime(db, studentId, item) {
  return db.prepare("INSERT OR IGNORE INTO skill_seen (student_id, item) VALUES (?, ?)").run(studentId, String(item).slice(0, 200)).changes > 0;
}

// Zapis rezultata: n odgovorov, od tega wrong napačnih, pri temi topicId (ali pod imenom topic).
export function recordSkill(db, studentId, { source, topicId = null, subject = null, topic = null, n = 1, wrong = 0 }) {
  if (!SOURCES.includes(source)) return false;
  n = Math.max(0, Math.floor(Number(n) || 0));
  wrong = Math.max(0, Math.min(n, Math.floor(Number(wrong) || 0)));
  if (source === "game" && n > GAME_MAX) {
    wrong = Math.round((wrong * GAME_MAX) / n);
    n = GAME_MAX;
  }
  if (!n) return false;
  const t = topicId ? getTopic(topicId) : null;
  if (topicId && !t) return false;
  const name = t ? t.name : String(topic || "").trim().slice(0, 80);
  if (!name) return false;
  const key = t ? t.id : `~${fold(name)}`;
  db.prepare(
    `INSERT INTO skill_results (student_id, day, source, key, topic_id, subject, topic, n, wrong) VALUES (?, date('now'), ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(student_id, day, source, key) DO UPDATE SET n = n + excluded.n, wrong = wrong + excluded.wrong, last_at = datetime('now')`,
  ).run(studentId, source, key, t?.id ?? null, t?.subject ?? subject ?? null, name, n, wrong);
  return true;
}

// Vse teme z odgovori v zadnjih `days` dneh, iz vseh virov, združene po temi.
// Vrne [{ key, topic_id, subject, topic, turns, errors, last_seen, sources: { chat: { n, wrong }, … } }].
export function skillStats(store, student, days = DAYS) {
  const db = store.db;
  const settings = student?.settings || {};
  const rows = [
    ...db
      .prepare(
        `SELECT CASE WHEN conversation_id IS NULL THEN 'practice' ELSE 'chat' END AS source, topic_id, subject, topic,
           COUNT(*) AS n, SUM(error) AS wrong, MAX(created_at) AS last
         FROM events WHERE student_id = ? AND topic IS NOT NULL AND created_at >= datetime('now', ?)
         GROUP BY source, topic_id, subject, topic`,
      )
      .all(student.id, `-${days} days`),
    ...db
      .prepare(
        `SELECT source, topic_id, subject, topic, SUM(n) AS n, SUM(wrong) AS wrong, MAX(last_at) AS last
         FROM skill_results WHERE student_id = ? AND day >= date('now', ?) GROUP BY source, key`,
      )
      .all(student.id, `-${days} days`),
  ];
  const by = new Map();
  for (const r of rows) {
    const id = r.topic_id && getTopic(r.topic_id) ? r.topic_id : topicIdFor(settings, r.subject, r.topic);
    const t = id ? getTopic(id) : null;
    const key = t ? t.id : `~${fold(r.topic)}|${r.subject || ""}`;
    let x = by.get(key);
    if (!x) {
      x = { key, topic_id: t?.id ?? null, subject: t?.subject ?? r.subject ?? null, topic: t ? t.name : r.topic, turns: 0, errors: 0, last_seen: "", sources: {} };
      by.set(key, x);
    }
    x.turns += r.n;
    x.errors += r.wrong || 0;
    if (r.last > x.last_seen) x.last_seen = r.last;
    const s = (x.sources[r.source] ||= { n: 0, wrong: 0 });
    s.n += r.n;
    s.wrong += r.wrong || 0;
  }
  return [...by.values()].sort((a, b) => (a.last_seen < b.last_seen ? 1 : a.last_seen > b.last_seen ? -1 : 0));
}

export function detectWeakTopics(stats) {
  return stats
    .filter((s) => s.turns >= MIN_TURNS && s.errors / s.turns >= MIN_RATE)
    .sort((a, b) => b.errors / b.turns - a.errors / a.turns || b.turns - a.turns)
    .slice(0, 8)
    .map((s) => ({ ...s, rate: s.errors / s.turns }));
}

// Šibke teme učenca (samodejno zaznane) iz vseh virov.
export const weakTopicsFor = (store, student, days = DAYS) => detectWeakTopics(skillStats(store, student, days));

export function weaknessesForPrompt(store, student) {
  const auto = weakTopicsFor(store, student).map((s) => `${s.topic}${s.subject ? ` (${SUBJECT_LABEL[s.subject] || s.subject})` : ""}`);
  const all = [...student.manual_weaknesses];
  for (const a of auto) {
    if (!all.some((m) => a.toLowerCase().startsWith(m.toLowerCase()))) all.push(a);
  }
  return all;
}

// Igra (pojem) → tema učne poti za učenca: med temami pojma (najzgodnejša prva) zadnja, ki ni nad
// učenčevim letom šolanja (year: 1–13, faks 14), sicer prva.
export function topicForGame(lessonTopics = [], year = 8) {
  if (!Array.isArray(lessonTopics)) return null; // npr. LESSONS["constructor"] iz id igre »meteor:constructor«
  const yearOf = (id) => {
    const p = getPath(getTopic(id)?.path);
    if (!p) return 99;
    if (p.school === "OS") return p.grade || 1;
    if (p.school === "SS") return 9 + (p.grade || 1);
    return 14;
  };
  const known = lessonTopics.filter((id) => getTopic(id));
  const fit = known.filter((id) => yearOf(id) <= year);
  return fit.length ? fit[fit.length - 1] : known[0] || null;
}

// ---------- Naše pole NPZ/mature: del pole → tema učne poti ----------
// Pole nimajo oznak tem, zato temo poiščemo lokalno iz besedila naloge in naslovov rešitev (enako iskanje kot
// za ime iz klepeta). Sprejmemo le jasna ujemanja; del brez teme se ne šteje. Izračun enkrat na polo.
const PAPER_LEVEL = {
  NPZ6: { curriculum_level: "6. razred", educational_track: "OSNOVNA_SOLA" },
  NPZ9: { curriculum_level: "9. razred", educational_track: "OSNOVNA_SOLA" },
  MATURA: { curriculum_level: "4. letnik", educational_track: "SREDNJA_SOLA" },
  POKLICNA: { curriculum_level: "4. letnik", educational_track: "SREDNJA_SOLA" },
};
const noMath = (s) => String(s || "").replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g, " ");
const paperMaps = new Map();
export function paperTopics(id, paper) {
  if (paperMaps.has(id)) return paperMaps.get(id);
  const map = new Map();
  const lvl = PAPER_LEVEL[paper?.exam];
  if (lvl && paper.subject)
    for (const tk of paper.tasks || [])
      for (const p of tk.parts || []) {
        const text = noMath(`${tk.intro || ""} ${p.text || ""} ${(p.ways || []).map((w) => `${w.title || ""} ${w.text || ""}`).join(" ")}`);
        const topicId = topicForName(text, { ...lvl, subject: paper.subject, school_system: "SI" });
        if (topicId) map.set(partKey(tk, p), topicId);
      }
  paperMaps.set(id, map);
  return map;
}

// ---------- Zapis iz brskalnika: »Preveri se« v učbeniku in »Imam prav« na naši poli ----------
export function mountSkillChecks(app, store, { loadStudent }) {
  const db = store.db;
  // Prvi odgovor na vprašanje »Preveri se« (en na dan za vprašanje); pravilnost preveri strežnik iz lekcije.
  app.post("/api/students/:id/lesson-check", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const topicId = String(req.body?.topic || "");
    const q = Number(req.body?.q);
    const o = Number(req.body?.o);
    const check = getTopic(topicId) && Number.isInteger(q) && q >= 0 ? loadLesson(topicId)?.checks?.[q] : null;
    if (!check || !Number.isInteger(o) || o < 0 || o >= (check.options?.length || 0)) return res.status(400).json({ error: "Neznano vprašanje." });
    const counted = firstTime(db, s.id, `L|${topicId}|${q}|${new Date().toISOString().slice(0, 10)}`);
    if (counted) recordSkill(db, s.id, { source: "lesson", topicId, n: 1, wrong: o === check.correct ? 0 : 1 });
    res.json({ counted });
  });
  // Naša pola: deli, pri katerih je učenec odprl rešitev ali označil »Imam prav« (ok = označeno). Vsak del enkrat.
  app.post("/api/students/:id/paper-check", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const id = String(req.body?.paper || "");
    const paper = /^[A-Za-z0-9-]{3,80}$/.test(id) ? loadOurPaper(id) : null;
    if (!paper) return res.status(404).json({ error: "Pola ne obstaja." });
    const parts = Array.isArray(req.body?.parts) ? req.body.parts.slice(0, 120) : [];
    const keys = new Set(paper.tasks.flatMap((tk) => tk.parts.map((p) => partKey(tk, p))));
    const topics = paperTopics(id, paper);
    let counted = 0;
    for (const part of parts) {
      const key = String(part?.key || "");
      if (!keys.has(key)) continue;
      const topicId = topics.get(key);
      if (!topicId || !firstTime(db, s.id, `P|${id}|${key}`)) continue;
      if (recordSkill(db, s.id, { source: "paper", topicId, n: 1, wrong: part.ok === true ? 0 : 1 })) counted++;
    }
    res.json({ counted });
  });
}
