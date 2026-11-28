// Šibke točke: ročno vnesene + samodejno zaznane iz vseh mest, kjer učenec rešuje naloge (j 2026-11-04:
// »naj za šibke točke Evklid zbira info od povsod«). En skupen seznam za inštruktorja, Napredek, delovni
// list iz šibkih tem, igre (»Ponovi šibke teme«) in tedensko poročilo staršem.
//
// Viri (vsi lokalno, brez dodatnih klicev modela):
// - klepet z inštruktorjem (META vrstica) in naloge v Vadnici: tabela events (kot doslej, zdaj s topic_id);
// - igre, vprašanja »Preveri se« v učbeniku, naše pole NPZ/mature (»Imam prav«), kartice, kviz v razredu ter
//   orodja (skener, laboratorij, kviz atlasa; recordToolResult): tabela skill_results, samo dnevne vsote po temi (brez odgovorov, brez časov posameznih nalog).
// Vse gre pod isti ključ: id teme učne poti (npr. MAT-OS-8/linearne-enacbe). Prosto ime iz klepeta ali
// kartice se preslika na temo z lokalnim iskanjem po imenih tem (lekcija-za-vprasanje.js); kar se ne
// preslika, ostane pod svojim imenom.
import { getTopic, getPath } from "./curriculum.js";
import { topicForName } from "./lekcija-za-vprasanje.js";
import { stopnja } from "../public/stopnja.js";
import { loadLesson, legacyChecks, legacyClient } from "./textbook.js";
import { checkNumber, orderOk } from "../public/preveri-se.js";
import { loadOurPaper, ourPaperTopicTags } from "./our-papers.js";
import { partKey } from "../public/our-paper-key.js";
import { hasGenerator } from "./practice/index.js";

const SUBJECT_LABEL = { MAT: "MAT", FIZ: "FIZ", KEM: "KEM", BIO: "BIO", GEO: "GEO", RAC: "RAČ", EKO: "EKO" };

// Tema je šibka, če je imel učenec v zadnjih DAYS dneh vsaj MIN_TURNS odgovorov pri njej (iz vseh virov
// skupaj), je bil delež napak vsaj MIN_RATE in so napake vsaj iz dveh dni ali vsaj MIN_ERRORS_ONE_DAY
// (ena lekcija ali en kviz z dvema napakama še ni šibka tema).
export const MIN_TURNS = 3;
export const MIN_RATE = 0.4;
export const MIN_ERRORS_ONE_DAY = 3;
// Pola: največ toliko delov iste teme na eno zaprtje pole (pola ima pogosto več delov iste teme).
export const PAPER_MAX = 3;
export const DAYS = 60;
// Ena igra prinese veliko hitrih odgovorov; da igre ne preglasijo nalog in klepeta, šteje ena igra
// največ GAME_MAX odgovorov (napake sorazmerno).
export const GAME_MAX = 4;
export const SOURCES = ["chat", "practice", "game", "lesson", "paper", "cards", "kviz", "scan", "lab", "atlas", "ustno"];
// Orodja (P1-8, načrt treh prioritet, j 25. 11. 2026): skener (napaka v učenčevem rezultatu, ki jo potrdi preverjanje),
// laboratorij (napoved, sklep, »Preveri moj račun«) in kviz atlasa. Vsako vprašanje šteje enkrat na dan, ena tema iz
// enega orodja največ TOOL_DAY_MAX odgovorov na dan: kviz atlasa ima veliko hitrih vprašanj, ki jih oceni brskalnik,
// zato sam v enem dnevu ne naredi šibke teme (potrebna je še napaka drug dan ali drugje). Iz brskalnika največ
// TOOL_STUDENT_DAY_MAX zapisov na učenca na dan (skupaj, vse teme).
export const TOOL_SOURCES = ["scan", "lab", "atlas"];
// lab 2 (pregled 3, #1094 laboratorij): sklepa in račun enega poskusa v enem dnevu sama ne naredita šibke teme.
export const TOOL_DAY_MAX = { scan: 4, lab: 2, atlas: 2, ustno: 2 }; // ustno: recordUstno
export const TOOL_STUDENT_DAY_MAX = 60;
// Id vprašanja ali naloge, nikoli učenčevo besedilo ali vrednost (skill_seen hrani le, kaj je bilo šteto).
const TOOL_ITEM = /^[A-Za-z0-9_:.\/-]{1,80}$/;

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
  const key = t ? t.id : `~${fold(name)}|${subject || ""}`;
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
           date(created_at) AS day, COUNT(*) AS n, SUM(error) AS wrong, MAX(created_at) AS last
         FROM events WHERE student_id = ? AND topic IS NOT NULL AND created_at >= datetime('now', ?)
         GROUP BY source, topic_id, subject, topic, day`,
      )
      .all(student.id, `-${days} days`),
    ...db
      .prepare(
        `SELECT source, topic_id, subject, topic, day, n, wrong, last_at AS last
         FROM skill_results WHERE student_id = ? AND day >= date('now', ?)`,
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
      x = { key, topic_id: t?.id ?? null, subject: t?.subject ?? r.subject ?? null, topic: t ? t.name : r.topic, turns: 0, errors: 0, last_seen: "", sources: {}, errorDays: new Set() };
      by.set(key, x);
    }
    x.turns += r.n;
    x.errors += r.wrong || 0;
    if (r.wrong > 0) x.errorDays.add(r.day);
    if (r.last > x.last_seen) x.last_seen = r.last;
    const s = (x.sources[r.source] ||= { n: 0, wrong: 0 });
    s.n += r.n;
    s.wrong += r.wrong || 0;
  }
  return [...by.values()]
    .map(({ errorDays, ...x }) => ({ ...x, errorDays: errorDays.size, weak: isWeak({ ...x, errorDays: errorDays.size }) }))
    .sort((a, b) => (a.last_seen < b.last_seen ? 1 : a.last_seen > b.last_seen ? -1 : 0));
}

export const isWeak = (s) => s.turns >= MIN_TURNS && s.errors / s.turns >= MIN_RATE && (s.errorDays >= 2 || s.errors >= MIN_ERRORS_ONE_DAY);

export function detectWeakTopics(stats) {
  return stats
    .filter(isWeak)
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
// Teme delov so označene v content/exam-papers/teme/<id>.json (ourPaperTopicTags). Za del brez oznake (nova pola)
// temo poiščemo lokalno iz besedila naloge in naslovov rešitev (enako iskanje kot za ime iz klepeta). Sprejmemo le
// jasna ujemanja; del brez teme se ne šteje. Izračun enkrat na polo.
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
  const tags = ourPaperTopicTags(id); // označene teme (content/exam-papers/teme) imajo prednost pred ugibanjem po besedah
  if (lvl && paper.subject)
    for (const tk of paper.tasks || [])
      for (const p of tk.parts || []) {
        const key = partKey(tk, p);
        if (Object.hasOwn(tags, key) && (tags[key] === null || getTopic(tags[key]))) {
          if (tags[key]) map.set(key, tags[key]);
          continue;
        }
        const text = noMath(`${tk.intro || ""} ${p.text || ""} ${(p.ways || []).map((w) => `${w.title || ""} ${w.text || ""}`).join(" ")}`);
        const topicId = topicForName(text, { ...lvl, subject: paper.subject, school_system: "SI" });
        if (topicId) map.set(key, topicId);
      }
  paperMaps.set(id, map);
  return map;
}

// Pravilnost odgovora na vprašanje »Preveri se«: true / false, null = neveljaven odgovor (400).
export function answerOk(check, body) {
  if (check.type === "stevilo") {
    const v = typeof body?.v === "string" || typeof body?.v === "number" ? String(body.v).slice(0, 80) : "";
    const r = checkNumber(check, v);
    return r.empty ? null : r.ok;
  }
  if (check.type === "razvrsti") {
    const order = body?.order;
    const n = check.items.length;
    if (!Array.isArray(order) || order.length !== n || !order.every((x) => Number.isInteger(x) && x >= 0 && x < n) || new Set(order).size !== n) return null;
    return orderOk(check, order);
  }
  const o = Number(body?.o);
  if (!Number.isInteger(o) || o < 0 || o >= (check.options?.length || 0)) return null;
  return o === check.correct;
}

// Rezultat iz orodja (skener, laboratorij, kviz atlasa): ok = true/false, item = stalen id vprašanja ali naloge
// (TOOL_ITEM, npr. »ohm:racun«; dvakrat isto vprašanje isti dan šteje enkrat). Vrne true, če je bil rezultat zapisan. Skener kliče to funkcijo
// na strežniku (samo za status, ki ga potrdi preverjanje, nikoli za »Nepreverjeno«); laboratorij in atlas prek
// POST /api/students/:id/tool-check.
export function recordToolResult(db, studentId, { source, topicId, item, ok }) {
  if (!TOOL_SOURCES.includes(source) || typeof ok !== "boolean" || typeof item !== "string" || !TOOL_ITEM.test(item) || !getTopic(String(topicId || ""))) return false;
  const day = new Date().toISOString().slice(0, 10);
  const today = db.prepare("SELECT n FROM skill_results WHERE student_id = ? AND day = date('now') AND source = ? AND key = ?").get(studentId, source, topicId);
  if ((today?.n || 0) >= TOOL_DAY_MAX[source]) return false;
  if (!firstTime(db, studentId, `T|${source}|${topicId}|${item}|${day}`)) return false;
  return recordSkill(db, studentId, { source, topicId, n: 1, wrong: ok ? 0 : 1 });
}

// Ustno spraševanje (P1-4, načrt kakovosti pred obsegom, j 25. 11. 2026): ob koncu seje rezultati vprašanj, ki jih je
// ocenilo spraševanje (koda ali model; »napačno« še pregleda drug model), brez samoocene in preskočenih. Na temo na dan
// največ TOOL_DAY_MAX.ustno odgovorov, napake sorazmerno (kot GAME_MAX pri igrah), zato eno spraševanje samo ne naredi
// šibke teme. Ena seja šteje enkrat (skill_seen). rezultati: [{ topicId, ok }].
export function recordUstno(db, studentId, sejaId, rezultati = []) {
  const day = new Date().toISOString().slice(0, 10);
  const po = new Map();
  for (const r of rezultati) {
    if (typeof r?.ok !== "boolean" || !getTopic(String(r.topicId || ""))) continue;
    const x = po.get(r.topicId) || { n: 0, wrong: 0 };
    x.n++;
    if (!r.ok) x.wrong++;
    po.set(r.topicId, x);
  }
  let zapisano = 0;
  for (const [topicId, x] of po) {
    const today = db.prepare("SELECT n FROM skill_results WHERE student_id = ? AND day = date('now') AND source = 'ustno' AND key = ?").get(studentId, topicId);
    const prostor = TOOL_DAY_MAX.ustno - (today?.n || 0);
    if (prostor <= 0 || !firstTime(db, studentId, `U|${topicId}|${Number(sejaId)}|${day}`)) continue;
    const n = Math.min(x.n, prostor);
    if (recordSkill(db, studentId, { source: "ustno", topicId, n, wrong: Math.round((x.wrong * n) / x.n) })) zapisano += n;
  }
  return zapisano;
}

// ---------- Zapis iz brskalnika: »Preveri se« v učbeniku in »Imam prav« na naši poli ----------
export function mountSkillChecks(app, store, { loadStudent }) {
  const db = store.db;
  // Prvi odgovor na vprašanje »Preveri se« (en na dan za vprašanje); pravilnost preveri strežnik iz lekcije.
  // Izbira: { q, o } (indeks možnosti); vpiši število: { q, v } (besedilo vnosa); razvrsti: { q, order } (indeksi
  // elementov v pravilnem vrstnem redu, kot jih je učenec postavil). Stara aplikacija (brez glave x-app-kviz) šteje
  // q po svojem seznamu samo z izbiro (legacyChecks), zapis pa je pod indeksom vprašanja v lekciji.
  app.post("/api/students/:id/lesson-check", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const topicId = String(req.body?.topic || "");
    const q = Number(req.body?.q);
    const all = getTopic(topicId) && Number.isInteger(q) && q >= 0 ? loadLesson(topicId)?.checks : null;
    let check = null;
    let src = q;
    if (all && legacyClient(req)) {
      const hit = legacyChecks(all)[q];
      if (hit) [check, src] = [hit.c, hit.src];
    } else check = all?.[q] || null;
    const ok = check ? answerOk(check, req.body) : null;
    if (ok === null) return res.status(400).json({ error: "Neznano vprašanje." });
    const counted = firstTime(db, s.id, `L|${topicId}|${src}|${new Date().toISOString().slice(0, 10)}`);
    if (counted) recordSkill(db, s.id, { source: "lesson", topicId, n: 1, wrong: ok ? 0 : 1 });
    res.json({ counted });
  });
  // Naša pola: deli, ki jih je učenec ob koncu preveril (ok = »Imam prav«). Izbirni del z enim pravilnim odgovorom pride
  // z izbiro (sel: [indeks]); strežnik ga oceni sam in šteje vedno (pravi odgovor, ne le branje). Vsak del enkrat.
  app.post("/api/students/:id/paper-check", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const id = String(req.body?.paper || "");
    const paper = /^[A-Za-z0-9-]{3,80}$/.test(id) ? loadOurPaper(id) : null;
    if (!paper) return res.status(404).json({ error: "Pola ne obstaja." });
    const parts = Array.isArray(req.body?.parts) ? req.body.parts.slice(0, 120) : [];
    const byKey = new Map(paper.tasks.flatMap((tk) => tk.parts.map((p) => [partKey(tk, p), p])));
    // Izbira pri izbirnem delu z enim pravilnim odgovorom: true/false (oceni strežnik), sicer null.
    const izbira = (p, sel) =>
      p?.format === "choice" && Array.isArray(p.correct) && p.correct.length === 1 && Array.isArray(sel) && sel.length === 1 && Number.isInteger(sel[0]) ? sel[0] === p.correct[0] : null;
    const topics = paperTopics(id, paper);
    // Odprta rešitev brez »Imam prav« je napaka le, če je učenec v tem odpiranju označil vsaj en del
    // (torej pole res rešuje in si šteje točke); kdor le bere rešitve, nima napak.
    const grading = parts.some((p) => p?.ok === true || izbira(byKey.get(String(p?.key || "")), p?.sel) !== null);
    const perTopic = new Map();
    let counted = 0;
    for (const part of parts) {
      const key = String(part?.key || "");
      const auto = izbira(byKey.get(key), part?.sel);
      const ok = auto ?? part?.ok === true;
      if (!byKey.has(key) || (!ok && !grading)) continue;
      const topicId = topics.get(key);
      if (!topicId || (perTopic.get(topicId) || 0) >= PAPER_MAX || !firstTime(db, s.id, `P|${id}|${key}`)) continue;
      perTopic.set(topicId, (perTopic.get(topicId) || 0) + 1);
      if (recordSkill(db, s.id, { source: "paper", topicId, n: 1, wrong: ok ? 0 : 1 })) counted++;
    }
    res.json({ counted });
  });
  // »Kaj še ne znam« (P1-8, 2. del; j 25. 11. 2026: na vrhu Napredka): šibke teme z dokazom (napake, kje) in tem, kaj
  // učenec lahko naredi (vaja iz generatorja, ki jo preveri koda; lekcija). Ročno vnesene ostanejo kot oznake.
  app.get("/api/students/:id/vrzeli", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const teme = detectWeakTopics(skillStats(store, s)).map((w) => ({
      topic_id: w.topic_id,
      topic: w.topic,
      subject: w.subject,
      turns: w.turns,
      errors: w.errors,
      // Viri z napakami, od največ napak (največ trije), kot v tedenskem poročilu.
      viri: Object.entries(w.sources || {}).filter(([, v]) => v.wrong > 0).sort((a, b) => b[1].wrong - a[1].wrong).slice(0, 3).map(([k]) => k),
      vaja: !!w.topic_id && hasGenerator(w.topic_id),
      lekcija: !!w.topic_id && !!loadLesson(w.topic_id),
    }));
    res.json({ teme, rocne: s.manual_weaknesses || [] });
  });
  // Orodja v brskalniku (P1-8): laboratorij in kviz atlasa. { source: "lab" | "atlas", topic: id teme, item, ok }.
  // Pravilnost preveri orodje samo (izmerjena vrednost v poskusu, izbrani del v atlasu), kot pri igrah; skener
  // zapisuje na strežniku (recordToolResult), zato ga ta pot ne sprejme.
  app.post("/api/students/:id/tool-check", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const source = String(req.body?.source || "");
    const topicId = String(req.body?.topic || "");
    const item = req.body?.item;
    const ok = req.body?.ok;
    if (!["lab", "atlas"].includes(source) || !getTopic(topicId) || typeof item !== "string" || !TOOL_ITEM.test(item) || typeof ok !== "boolean") return res.status(400).json({ error: "Neveljaven rezultat." });
    const danes = db.prepare("SELECT COALESCE(SUM(n), 0) AS n FROM skill_results WHERE student_id = ? AND day = date('now') AND source IN ('lab', 'atlas')").get(s.id).n;
    if (danes >= TOOL_STUDENT_DAY_MAX) return res.json({ counted: false });
    res.json({ counted: recordToolResult(db, s.id, { source, topicId, item, ok }) });
  });
}
