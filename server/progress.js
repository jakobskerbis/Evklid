// Napredovanje: prilagodljiva težavnost, obvladanje tem, odklepanje sklopov,
// preizkus znanja, razmaknjeno ponavljanje, XP in lestvica.
import crypto from "node:crypto";
import { getPath, getTopic, localTopic, localUnitTitle, baseTopicIds } from "./curriculum.js";
import { conceptsOfTopics } from "../public/games/learn-link.js";
import { sameSubject } from "./subjects.js";
import { uiLanguage } from "../public/i18n/languages.js";
import { generateTask, hasGenerator, publicTask, hintSteps } from "./practice/index.js";
import { checkAnswer } from "./practice/check.js";
import { CONTEST, TRAINING_TASKS, isCompetitionPath } from "./competition.js";
import { isExamPath, mockPlan, scaledScore, examGrade } from "./exams.js";
import { toChoice } from "./practice/choice.js";
import { taskLanguage, localName } from "./exams.js";
import { levelProgress, cleanXpGoal } from "../public/xp-levels.js";
import { nowParts } from "./schedule.js";

// Tekmovalni trening in poskusno tekmovanje veljata tudi za priprave na izpite.
const isPrepPath = (key) => isCompetitionPath(key) || isExamPath(key);

const pretestTier = (known) => (known >= 3 ? "višja" : known === 2 ? "srednja" : "osnovna");

// Naloge z enim poskusom in brez namigov (preizkusi, tekmovanja, test predznanja).
const ONE_SHOT = ["placement", "contest", "pretest"];

export const RULES = {
  levelUpStreak: 3, // 3 pravilni zapored -> težje
  masteryWindow: 10, // zadnjih 10 nalog
  masteryCorrect: 8, // vsaj 8 pravilnih v prvem poskusu
  masteryHard: 2, // od tega vsaj 2 na najvišji težavnosti
  maxAttempts: 3, // po 3 napačnih pokažemo rešen zgled
  reviewDays: [1, 3, 7, 21], // razmaki ponavljanja
  placementPass: 0.8,
  placementTasks: 6,
  reviewPerTopic: 2, // vsaka tema, ki je na vrsti, prinese 2 nalogi
  reviewSessionMax: 10,
  quickReviewTasks: 4, // »najprej 5 minut ponavljanja«
  backlogSuggest: 15, // nad tem predlagamo najprej ponavljanje
  dailyTasks: 10, // ~15 minut
  classTasks: 5, // ponovitev pred uro iz urnika (~5 minut)
  dailyNewShare: 0.7, // 70 % nove snovi, 30 % ponavljanja (obrne se, ko se ponavljanje nabere)
  unitTasks: 8,
  testTasks: 10,
  offlineXpPerDay: 10, // nalog brez povezave z XP na dan (kot dnevni sklop); ostale štejejo samo v napredek, ne v lige
  offlineIssuedDays: 14, // kako dolgo velja naloga iz paketa brez povezave
  offlinePacksPerDay: 8, // paketov brez povezave na dan na profil (menjava poti, več naprav)
};

const XP = {
  base: (level) => 5 + 5 * level, // 10 / 15 / 20
  minWithHelp: 2,
  fixBonus: 3,
  mastery: 25,
  placement: 40,
  daily: 15,
  dailyStreak: (days) => 5 * Math.min(days, 7),
};

const nowSql = () => new Date().toISOString().replace("T", " ").slice(0, 19);
const addDays = (d) => new Date(Date.now() + d * 86400000).toISOString().replace("T", " ").slice(0, 19);
const today = () => new Date().toISOString().slice(0, 10);
function shuffle(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export class Progress {
  constructor(store) {
    this.store = store;
    this.db = store.db;
  }

  // Jezik nalog pri dvojezičnih generatorjih (indijski izpiti): hindijsko za hindijščino in
  // jezike, ki v vmesniku padejo nazaj nanjo (bhodžpuri, maratščina …), sicer angleško.
  taskLang(studentId) {
    return taskLanguage(this.store.getStudent?.(studentId)?.settings?.language);
  }
  // Jezik vmesnika (za imena tem mednarodne poti v slovenskem vmesniku).
  uiLang(studentId) {
    return uiLanguage(this.store.getStudent?.(studentId)?.settings?.language);
  }

  // ---------- stanje teme ----------
  state(studentId, topicId) {
    return (
      this.db.prepare("SELECT * FROM topic_state WHERE student_id = ? AND topic_id = ?").get(studentId, topicId) || {
        student_id: studentId,
        topic_id: topicId,
        level: 1,
        streak: 0,
        status: "new",
        source: null,
        mastered_at: null,
        review_stage: 0,
        review_due: null,
        seen_example: 0,
      }
    );
  }
  saveState(s) {
    this.db
      .prepare(
        `INSERT INTO topic_state (student_id, topic_id, level, streak, status, source, mastered_at, review_stage, review_due, seen_example, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(student_id, topic_id) DO UPDATE SET level = excluded.level, streak = excluded.streak, status = excluded.status,
           source = excluded.source, mastered_at = excluded.mastered_at, review_stage = excluded.review_stage,
           review_due = excluded.review_due, seen_example = excluded.seen_example, updated_at = datetime('now')`,
      )
      .run(s.student_id, s.topic_id, s.level, s.streak, s.status, s.source, s.mastered_at, s.review_stage, s.review_due, s.seen_example);
  }
  markMastered(studentId, topicId, source) {
    const s = this.state(studentId, topicId);
    if (s.status === "mastered") return false;
    Object.assign(s, { status: "mastered", source, mastered_at: nowSql(), review_stage: 0, review_due: addDays(RULES.reviewDays[0]) });
    this.saveState(s);
    return true;
  }
  setStatus(studentId, topicId, status) {
    if (status === "mastered") return this.markMastered(studentId, topicId, "manual");
    const s = this.state(studentId, topicId);
    Object.assign(s, { status, mastered_at: null, review_due: null, review_stage: 0, source: null });
    this.saveState(s);
    return true;
  }

  // ---------- pregled učne poti ----------
  pathView(studentId, pathKey) {
    const path = getPath(pathKey);
    if (!path) return null;
    const states = Object.fromEntries(
      this.db
        .prepare("SELECT * FROM topic_state WHERE student_id = ? AND topic_id LIKE ?")
        .all(studentId, `${pathKey}/%`)
        .map((s) => [s.topic_id, s]),
    );
    const now = nowSql();
    const ui = this.uiLang(studentId);
    const units = path.units.map((u) => {
      const topics = u.topics.map((t0) => {
        const t = localTopic(t0, ui);
        const s = states[t.id] || {};
        return {
          id: t.id,
          name: t.name,
          goals: t.goals,
          practice: hasGenerator(t.id),
          status: s.status || "new",
          level: s.level || 1,
          review_due: s.review_due || null,
          due: !!(s.status === "mastered" && s.review_due && s.review_due <= now),
        };
      });
      const gated = topics.filter((t) => t.practice);
      const relevant = gated.length ? gated : topics;
      return {
        title: localUnitTitle(u, ui),
        topics,
        hasPractice: gated.length > 0,
        started: topics.some((t) => t.status !== "new"),
        mastered: relevant.every((t) => t.status === "mastered"),
        progress: relevant.filter((t) => t.status === "mastered").length / relevant.length,
      };
    });
    // Brez ključavnic (j, 31. 10. 2026): vsak sklop je vedno odprt. Sklop, pred katerim prejšnji sklop z vajami
    // še ni osvojen in ga učenec še ni začel, je »naprej« (ahead): pot zanj priporoči najprej temo iz prejšnjega
    // sklopa, dnevni trening, ponovitev pred uro in vaje brez povezave pa ostanejo pri snovi, kjer učenec je.
    // Tekmovalne in izpitne poti so brez priporočil: sklopi so neodvisni, učenec izbira sam.
    // Priporočimo sklop, kjer učenec je (zadnji neosvojen sklop z vajami, ki ni »naprej«), ne verige sklopov nazaj.
    let prevGate = null;
    let here = null;
    const ordered = !isPrepPath(pathKey);
    for (const u of units) {
      u.ahead = !!(ordered && u.hasPractice && prevGate && !prevGate.mastered && !u.started);
      if (u.ahead) {
        const from = here || prevGate;
        const t = from.topics.find((x) => x.practice && x.status !== "mastered");
        u.suggest = { unit: from.title, topic: t ? { id: t.id, name: t.name } : null };
      }
      if (u.hasPractice) prevGate = u;
      if (u.hasPractice && !u.ahead && !u.mastered) here = u;
    }
    const next =
      units.flatMap((u) => (u.ahead ? [] : u.topics)).find((t) => t.status !== "mastered") || null;
    return { key: path.key, label: path.label, units, next, dueCount: this.dueTopics(studentId, path.subject).length };
  }

  // subject: le teme izbranega predmeta (brez njega vse).
  dueTopics(studentId, subject = null) {
    return this.db
      .prepare(
        "SELECT topic_id FROM topic_state WHERE student_id = ? AND status = 'mastered' AND review_due IS NOT NULL AND review_due <= ? ORDER BY review_due",
      )
      .all(studentId, nowSql())
      .map((r) => r.topic_id)
      .filter((id) => hasGenerator(id) && sameSubject(getTopic(id)?.subject, subject));
  }

  // ---------- naloge ----------
  saveTask(studentId, task, mode, sessionId = null) {
    const r = this.db
      .prepare("INSERT INTO tasks (student_id, topic_id, mode, session_id, level, payload) VALUES (?, ?, ?, ?, ?, ?)")
      .run(studentId, task.topicId, mode, sessionId, task.level, JSON.stringify(task));
    return Number(r.lastInsertRowid);
  }
  getTask(id) {
    const t = this.db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
    return t && { ...t, payload: JSON.parse(t.payload) };
  }

  // Naslednja vaja pri temi. Prvič pri temi najprej pokažemo rešen zgled.
  nextPractice(studentId, topicId) {
    if (!hasGenerator(topicId)) return null;
    const s = this.state(studentId, topicId);
    if (!s.seen_example) {
      const ex = generateTask(topicId, 1, undefined, this.taskLang(studentId));
      s.seen_example = 1;
      if (s.status === "new") s.status = "learning";
      this.saveState(s);
      return { example: { ...publicTask(ex), solution: ex.solution, hint: ex.hint } };
    }
    if (s.status === "new") {
      s.status = "learning";
      this.saveState(s);
    }
    // Nedokončana naloga te teme počaka na učenca.
    const pending = this.db
      .prepare("SELECT * FROM tasks WHERE student_id = ? AND topic_id = ? AND mode = 'practice' AND session_id IS NULL AND solved = 0 AND attempts < ? ORDER BY id DESC LIMIT 1")
      .get(studentId, topicId, RULES.maxAttempts);
    if (pending) {
      return { task: { id: pending.id, mode: "practice", ...publicTask(JSON.parse(pending.payload)) }, state: { level: s.level, streak: s.streak }, resumed: true };
    }
    const task = generateTask(topicId, s.level, undefined, this.taskLang(studentId));
    const id = this.saveTask(studentId, task, "practice");
    return { task: { id, mode: "practice", ...publicTask(task) }, state: { level: s.level, streak: s.streak } };
  }

  // ---------- seje ----------
  // Seja ima načrt [{topic, mode, level?}]; naloge nastajajo sproti, zato se
  // težavnost pri novi snovi prilagaja tudi med sejo. Nedokončana seja se
  // ob vrnitvi nadaljuje pri isti nalogi.
  createSession(studentId, kind, plan, params = {}) {
    const id = crypto.randomUUID();
    this.db
      .prepare("INSERT INTO sessions (id, student_id, kind, params, plan) VALUES (?, ?, ?, ?, ?)")
      .run(id, studentId, kind, JSON.stringify(params), JSON.stringify(plan));
    return id;
  }
  openSession(studentId, kind, match = () => true) {
    const rows = this.db
      .prepare("SELECT * FROM sessions WHERE student_id = ? AND kind = ? AND finished = 0 ORDER BY created_at DESC, rowid DESC")
      .all(studentId, kind);
    for (const r of rows) {
      const sess = { ...r, params: JSON.parse(r.params), plan: JSON.parse(r.plan) };
      if (match(sess)) return sess;
    }
    return null;
  }
  getSession(id) {
    const r = this.db.prepare("SELECT * FROM sessions WHERE id = ?").get(id);
    return r && { ...r, params: JSON.parse(r.params), plan: JSON.parse(r.plan) };
  }

  sessionNext(sessionId) {
    const sess = this.getSession(sessionId);
    const maxA = (t) => (ONE_SHOT.includes(t.mode) ? 1 : RULES.maxAttempts);
    const isDone = (t) => t.solved || t.attempts >= maxA(t);
    let all = this.db.prepare("SELECT * FROM tasks WHERE session_id = ? ORDER BY id").all(sessionId);
    let open = all.find((t) => !isDone(t));
    if (!open && sess && all.length < sess.plan.length) {
      const item = sess.plan[all.length];
      const st = this.state(sess.student_id, item.topic);
      if (item.mode === "practice" && st.status === "new") {
        st.status = "learning";
        this.saveState(st);
      }
      const level = item.level ?? st.level;
      let task = generateTask(item.topic, level, undefined, this.taskLang(sess.student_id));
      // Izpitni format: izbirna vprašanja (A–D) namesto vpisa števila.
      if (item.format === "choice") task = toChoice(task, task.seed, item.options || 4);
      const id = this.saveTask(sess.student_id, task, item.mode, sessionId);
      all = this.db.prepare("SELECT * FROM tasks WHERE session_id = ? ORDER BY id").all(sessionId);
      open = all.find((t) => t.id === id);
    }
    const total = sess ? sess.plan.length : all.length;
    const done = all.filter(isDone).length;
    const kind = sess?.kind ?? all[0]?.mode;
    if (!open) {
      const out = { finished: true, sessionId, kind, total: all.length, correct: all.filter((t) => t.first_try_correct).length };
      if (sess?.kind === "contest") return { ...out, contest: this.finishContest(sess) };
      // Pojmi iger iz pravkar vadenih tem: nagradna igra na koncu (public/games/reward.js).
      out.reward = conceptsOfTopics(all.map((t) => t.topic_id), baseTopicIds);
      if (sess && !sess.finished) {
        this.db.prepare("UPDATE sessions SET finished = 1 WHERE id = ?").run(sessionId);
        if (sess.kind === "daily") out.xp = this.award(sess.student_id, [[XP.daily, "dnevni trening"]]);
      }
      return out;
    }
    const payload = JSON.parse(open.payload);
    const next = {
      sessionId,
      kind,
      index: done + 1,
      total,
      task: { id: open.id, mode: open.mode, topicName: localName(localTopic(getTopic(open.topic_id), this.uiLang(open.student_id))?.name, payload.textLang), ...publicTask(payload) },
    };
    if (sess?.kind === "contest") {
      next.deadline = sess.params.deadline;
      const item = sess.plan[all.indexOf(open)] || {};
      next.task.points = item.points ?? (CONTEST.points[payload.level] || 0);
      next.task.penalty = item.penalty || 0;
    }
    return next;
  }

  reviewBacklog(studentId, subject = null) {
    return this.dueTopics(studentId, subject).length * RULES.reviewPerTopic;
  }

  // Ponavljanje: naloge iz več tem izbranega predmeta, ki so na vrsti, prepletene med sabo.
  startReview(studentId, { quick = false, subject = null } = {}) {
    const open = this.openSession(studentId, "review", (x) => (x.params.subject || null) === subject);
    if (open) return this.sessionNext(open.id);
    const due = this.dueTopics(studentId, subject);
    if (!due.length) return null;
    const max = quick ? RULES.quickReviewTasks : RULES.reviewSessionMax;
    const topics = due.slice(0, Math.ceil(max / RULES.reviewPerTopic));
    const plan = [];
    for (let r = 0; r < RULES.reviewPerTopic; r++) for (const t of topics) plan.push({ topic: t, mode: "review", level: 2 });
    return this.sessionNext(this.createSession(studentId, "review", plan.slice(0, max), { quick, subject }));
  }

  // Preizkus znanja za sklop: ob uspehu so vse teme sklopa obvladane.
  startPlacement(studentId, pathKey, unitIndex) {
    const unit = getPath(pathKey)?.units[unitIndex];
    if (!unit) return null;
    const topics = unit.topics.filter((t) => hasGenerator(t.id));
    if (!topics.length) return null;
    const open = this.openSession(studentId, "placement", (x) => x.params.path === pathKey && x.params.unit === unitIndex);
    if (open) return this.sessionNext(open.id);
    const n = Math.max(RULES.placementTasks, topics.length);
    const plan = [];
    for (let i = 0; i < n; i++) plan.push({ topic: topics[i % topics.length].id, mode: "placement", level: i % 2 ? 3 : 2 });
    return this.sessionNext(this.createSession(studentId, "placement", plan, { path: pathKey, unit: unitIndex }));
  }

  // Začetni test predznanja teme: tri naloge (stopnja 1, 2, 3), en poskus, brez namigov.
  // Opravi ga vsak učenec na začetku nove teme; rezultat določi začetno stopnjo nalog
  // in zahtevnost razlage pri inštruktorju (server/results.js). Vrne { skip: true }, ko ni potreben.
  startPretest(studentId, topicId) {
    if (!getTopic(topicId) || !hasGenerator(topicId)) return { skip: true };
    const open = this.openSession(studentId, "pretest", (x) => x.params.topic === topicId);
    if (open) return this.sessionNext(open.id);
    const st = this.state(studentId, topicId);
    if (st.status !== "new" || st.pretest != null) return { skip: true };
    const plan = [1, 2, 3].map((level) => ({ topic: topicId, mode: "pretest", level }));
    return this.sessionNext(this.createSession(studentId, "pretest", plan, { topic: topicId }));
  }

  // Izid testa predznanja brez sprememb (tudi za ponovni »Preveri« po koncu testa).
  pretestScore(studentId, sessionId) {
    const all = this.db.prepare("SELECT level, first_try_correct, topic_id FROM tasks WHERE session_id = ? ORDER BY level, id").all(sessionId);
    const correct = all.filter((t) => t.first_try_correct).length;
    let known = 0; // stopnje, rešene zapored od najlažje
    for (const t of all) {
      if (!t.first_try_correct) break;
      known = t.level;
    }
    const level = this.state(studentId, all[0]?.topic_id).level;
    return { correct, total: all.length, known, level, tier: pretestTier(known), topicId: all[0]?.topic_id };
  }

  finishPretest(studentId, sessionId) {
    const { correct, total, known, topicId } = this.pretestScore(studentId, sessionId);
    const s = this.state(studentId, topicId);
    if (s.status !== "mastered") {
      s.status = "learning";
      s.level = Math.max(1, Math.min(3, known));
      s.streak = 0;
      this.saveState(s);
    }
    this.db.prepare("UPDATE topic_state SET pretest = ? WHERE student_id = ? AND topic_id = ?").run(known, studentId, topicId);
    return { correct, total, known, level: s.level, tier: pretestTier(known) };
  }

  // Test predznanja: »Tega še ne znam« – naloga šteje kot nerešena, naprej na naslednjo.
  skipPretestTask(studentId, row) {
    if (row.solved || row.attempts >= 1) return { error: "Ta naloga je že zaključena." };
    this.db.prepare("UPDATE tasks SET attempts = 1, solved = 0, first_try_correct = 0 WHERE id = ?").run(row.id);
    const next = this.sessionNext(row.session_id);
    return { skipped: true, correct: false, next, ...(next.finished ? { pretest: this.finishPretest(studentId, row.session_id) } : {}) };
  }

  // Tema za »Nova snov«: zadnja tema, ki se je učenec uči, sicer naslednja na poti.
  currentTopic(studentId, pathKey) {
    const view = this.pathView(studentId, pathKey);
    if (!view) return null;
    const open = new Map(view.units.filter((u) => !u.ahead).flatMap((u) => u.topics.map((t) => [t.id, t])));
    const recent = this.db
      .prepare("SELECT topic_id FROM topic_state WHERE student_id = ? AND topic_id LIKE ? AND status = 'learning' ORDER BY updated_at DESC")
      .all(studentId, `${pathKey}/%`)
      .map((r) => open.get(r.topic_id))
      .find((t) => t && t.practice);
    const t = recent || view.units.filter((u) => !u.ahead).flatMap((u) => u.topics).find((x) => x.status !== "mastered" && x.practice) || view.next;
    return t ? { id: t.id, name: t.name, practice: t.practice } : null;
  }

  // Današnji trening (~15 min): 70 % nove snovi in 30 % ponavljanja, prepleteno.
  // Ko se ponavljanje nabere, se razmerje obrne.
  startDaily(studentId, pathKey) {
    const open = this.openSession(studentId, "daily", (x) => x.created_at.slice(0, 10) === today());
    if (open) return this.sessionNext(open.id);
    const view = this.pathView(studentId, pathKey);
    if (!view) return null;
    const here = view.units.filter((u) => !u.ahead).flatMap((u) => u.topics).filter((t) => t.practice);
    const cur = this.currentTopic(studentId, pathKey);
    const fresh = [cur?.practice ? cur.id : null, ...here.filter((t) => t.status === "learning").map((t) => t.id)]
      .filter((v, i, a) => v && a.indexOf(v) === i)
      .slice(0, 2);
    const due = this.dueTopics(studentId, getPath(pathKey)?.subject);
    // Če ni ničesar na vrsti, priklic že osvojenih tem (brez vpliva na urnik ponavljanja).
    const old = due.length ? due : here.filter((t) => t.status === "mastered").map((t) => t.id);
    const oldMode = due.length ? "review" : "test";
    const backlog = due.length * RULES.reviewPerTopic;
    const share = backlog > RULES.backlogSuggest ? 1 - RULES.dailyNewShare : RULES.dailyNewShare;
    const N = RULES.dailyTasks;
    let nNew = fresh.length ? (old.length ? Math.round(N * share) : N) : 0;
    const nOld = old.length ? N - nNew : 0;
    if (!fresh.length && !old.length) return null;
    if (!nNew && !nOld) nNew = N;
    // Prepletanje: ponavljanje enakomerno razporejeno med novo snovjo.
    const plan = [];
    let a = 0, b = 0;
    for (let i = 0; i < nNew + nOld; i++) {
      const wantOld = nOld && (b + 1) / nOld <= (i + 1) / (nNew + nOld) + 1e-9;
      if ((wantOld && b < nOld) || a >= nNew) plan.push({ topic: old[b++ % old.length], mode: oldMode, level: 2 });
      else plan.push({ topic: fresh[a++ % fresh.length], mode: "practice" });
    }
    return this.sessionNext(this.createSession(studentId, "daily", plan, { path: pathKey, nNew, nOld }));
  }

  // Kratka ponovitev pred uro (in utrditev po njej) za predmet iz urnika: teme, ki se jih učenec
  // trenutno uči, in nazadnje osvojene teme (priklic). Ena seja na pot na dan.
  startClass(studentId, pathKey) {
    const open = this.openSession(studentId, "class", (x) => x.params.path === pathKey && x.created_at.slice(0, 10) === today());
    if (open) return this.sessionNext(open.id);
    const view = this.pathView(studentId, pathKey);
    if (!view) return null;
    const topics = view.units.filter((u) => !u.ahead).flatMap((u) => u.topics).filter((t) => t.practice);
    const ids = new Set(topics.map((t) => t.id));
    const recent = (status) =>
      this.db
        .prepare("SELECT topic_id FROM topic_state WHERE student_id = ? AND topic_id LIKE ? AND status = ? ORDER BY updated_at DESC LIMIT 3")
        .all(studentId, `${pathKey}/%`, status)
        .map((r) => r.topic_id)
        .filter((id) => ids.has(id));
    const cur = this.currentTopic(studentId, pathKey);
    const learning = [...new Set([...recent("learning"), cur?.practice ? cur.id : null].filter(Boolean))].slice(0, 2);
    const mastered = recent("mastered");
    const N = RULES.classTasks;
    const plan = [];
    for (let i = 0; i < N; i++) {
      const useOld = mastered.length && (!learning.length || i % 2 === 1);
      if (useOld) plan.push({ topic: mastered[(learning.length ? Math.floor(i / 2) : i) % mastered.length], mode: "review", level: 2 });
      else if (learning.length) plan.push({ topic: learning[i % learning.length], mode: "practice" });
    }
    if (!plan.length) return null;
    return this.sessionNext(this.createSession(studentId, "class", plan, { path: pathKey }));
  }

  // Vaja posameznega sklopa: prepletene naloge iz vseh tem sklopa (vsi sklopi so odprti).
  startUnit(studentId, pathKey, unitIndex) {
    const view = this.pathView(studentId, pathKey);
    const unit = view?.units[unitIndex];
    if (!unit) return null;
    const topics = unit.topics.filter((t) => t.practice).map((t) => t.id);
    if (!topics.length) return null;
    const open = this.openSession(studentId, "unit", (x) => x.params.path === pathKey && x.params.unit === unitIndex);
    if (open) return this.sessionNext(open.id);
    const order = shuffle(topics);
    const plan = Array.from({ length: Math.max(RULES.unitTasks, topics.length) }, (_, i) => ({ topic: order[i % order.length], mode: "practice" }));
    return this.sessionNext(this.createSession(studentId, "unit", plan, { path: pathKey, unit: unitIndex }));
  }

  // ---------- tekmovanja ----------
  // Tekmovalni trening: prepletene naloge iz vseh tem tekmovalne poti. Teme, ki se
  // jih učenec že uči, pridejo večkrat; težavnost se prilagaja kot pri vadnici.
  startCompetition(studentId, pathKey) {
    if (!isPrepPath(pathKey)) return null;
    const view = this.pathView(studentId, pathKey);
    const topics = view?.units.flatMap((u) => u.topics).filter((t) => t.practice) || [];
    if (!topics.length) return null;
    const open = this.openSession(studentId, "tek", (x) => x.params.path === pathKey);
    if (open) return this.sessionNext(open.id);
    const learning = shuffle(topics.filter((t) => t.status === "learning"));
    const rest = shuffle(topics.filter((t) => t.status !== "learning"));
    // Približno polovica nalog iz tem v učenju, ostalo iz drugih (tudi novih) tem.
    const pickLearning = learning.slice(0, Math.min(learning.length, 3));
    const pool = [...pickLearning, ...pickLearning, ...rest, ...learning.slice(3)];
    const chosen = [];
    for (const t of pool) {
      if (chosen.length >= TRAINING_TASKS) break;
      chosen.push(t.id);
    }
    while (chosen.length < TRAINING_TASKS) chosen.push(topics[chosen.length % topics.length].id);
    // Ista tema ne pride dvakrat zapored.
    const order = shuffle(chosen);
    for (let i = 1; i < order.length; i++) {
      if (order[i] !== order[i - 1]) continue;
      const j = order.findIndex((x, k) => k > i && x !== order[i - 1] && x !== order[i + 1]);
      if (j > 0) [order[i], order[j]] = [order[j], order[i]];
    }
    const plan = order.map((topic) => ({ topic, mode: "practice" }));
    return this.sessionNext(this.createSession(studentId, "tek", plan, { path: pathKey }));
  }

  // Poskusno tekmovanje: 10 nalog iz različnih tem, od lažjih k težjim, na čas,
  // en poskus, brez namigov. Rezultat (točke) je viden šele na koncu.
  startContest(studentId, pathKey) {
    if (!isPrepPath(pathKey)) return null;
    const path = getPath(pathKey);
    const topics = path.units.flatMap((u) => u.topics).filter((t) => hasGenerator(t.id)).map((t) => t.id);
    if (!topics.length) return null;
    const open = this.openSession(studentId, "contest", (x) => x.params.path === pathKey);
    if (open) {
      if (Date.now() <= open.params.deadline) return this.sessionNext(open.id);
      this.finishContest(open);
    }
    // Izpit: vprašanja in čas po formatu izpita; tekmovanje: 10 nalog od lažjih k težjim.
    const exam = isExamPath(pathKey) ? mockPlan(pathKey) : null;
    const order = shuffle(topics);
    const plan = exam ? exam.plan : CONTEST.levels.map((level, i) => ({ topic: order[i % order.length], mode: "contest", level }));
    const minutes = exam ? exam.minutes : CONTEST.minutes;
    const now = Date.now();
    const params = { path: pathKey, started: now, deadline: now + minutes * 60000, minutes };
    return this.sessionNext(this.createSession(studentId, "contest", plan, params));
  }

  // Točke tekmovanja: pravilno v edinem poskusu in pred iztekom časa.
  contestResult(sess) {
    const tasks = this.db.prepare("SELECT * FROM tasks WHERE session_id = ? ORDER BY id").all(sess.id);
    const items = sess.plan.map((p, i) => {
      const t = tasks[i];
      const payload = t ? JSON.parse(t.payload) : null;
      const pts = p.points ?? (CONTEST.points[p.level] || 0);
      const correct = !!t?.first_try_correct;
      const answered = t?.last_answer != null;
      return {
        topicName: localName(getTopic(p.topic)?.name || "", payload?.textLang),
        level: p.level,
        points: pts,
        // Negativne točke (JEE, NEET) samo za napačen odgovor, ne za izpuščeno vprašanje.
        earned: correct ? pts : answered ? p.penalty || 0 : 0,
        answered,
        correct,
        yourAnswer: t?.last_answer ?? null,
        taskId: t?.id ?? null,
        task: payload ? { ...publicTask(payload), solution: payload.solution, correctIndex: payload.answer.type === "choice" ? payload.answer.index : null } : null,
      };
    });
    const points = items.reduce((s, x) => s + x.earned, 0);
    const maxPoints = items.reduce((s, x) => s + x.points, 0);
    const usedMs = Math.min((sess.params.finishedAt || Date.now()) - sess.params.started, sess.params.minutes * 60000);
    const scaled = scaledScore(sess.params.path, points, maxPoints);
    const grade = examGrade(sess.params.path, points, maxPoints);
    const wrong = items.filter((x) => x.answered && !x.correct).length;
    return { points, maxPoints, correct: items.filter((x) => x.correct).length, wrong, total: items.length, minutes: Math.ceil(usedMs / 60000), scaled, grade, items };
  }

  // Zaključi tekmovanje (vse rešeno, učenec je končal ali je čas potekel). XP enkrat.
  finishContest(sess) {
    if (typeof sess === "string") sess = this.getSession(sess);
    if (!sess || sess.kind !== "contest") return null;
    if (!sess.finished) {
      sess.params.finishedAt = Math.min(Date.now(), sess.params.deadline);
      const result = this.contestResult(sess);
      sess.params.points = result.points;
      sess.params.maxPoints = result.maxPoints;
      this.db.prepare("UPDATE sessions SET finished = 1, params = ? WHERE id = ?").run(JSON.stringify(sess.params), sess.id);
      sess.finished = 1;
      // XP: pri izpitu največ 40 (kot pri tekmovanju), sorazmerno z rezultatom.
      const xp = isExamPath(sess.params.path) ? Math.round((40 * Math.max(0, result.points)) / result.maxPoints) : result.points;
      if (xp > 0) result.xp = this.award(sess.student_id, [[xp, isExamPath(sess.params.path) ? "poskusni izpit" : "poskusno tekmovanje"]]);
      return result;
    }
    return this.contestResult(sess);
  }

  // Tekmovanje: naloga ostane brez odgovora (0 točk), naprej na naslednjo.
  skipContestTask(studentId, taskId) {
    const row = this.getTask(taskId);
    if (row && row.student_id === studentId && row.mode === "pretest") return this.skipPretestTask(studentId, row);
    if (!row || row.student_id !== studentId || row.mode !== "contest") return { error: "Naloga ne obstaja." };
    if (row.solved || row.attempts >= 1) return { error: "Ta naloga je že zaključena." };
    const sess = this.getSession(row.session_id);
    if (!sess || sess.finished) return { error: "To tekmovanje je že končano." };
    if (Date.now() > sess.params.deadline) return { timeUp: true, contest: this.finishContest(sess) };
    this.db.prepare("UPDATE tasks SET attempts = 1, solved = 0, first_try_correct = 0 WHERE id = ?").run(taskId);
    const next = this.sessionNext(row.session_id);
    return { saved: true, skipped: true, next, ...(next.contest ? { contest: next.contest } : {}) };
  }

  // Pripravljenost na izpit (NPZ, matura): delež snovi izpita, ki jo učenec že zna, in tri najšibkejše teme.
  // Tema izpita šteje kot njena osnovna tema na Učni poti (MAT-EX-NPZ9/… ↔ MAT-OS-8/…): velja boljše stanje.
  // Ocena teme: obvladana 1 (za ponovitev 0,8), v učenju 0,2–0,6 po stopnji, nova 0.
  // Šibke so teme z najnižjo oceno; ob enaki oceni najprej tiste z več napačnimi prvimi odgovori.
  examReadiness(studentId, pathKey) {
    if (!isExamPath(pathKey)) return null;
    const path = getPath(pathKey);
    const now = nowSql();
    const stateOf = this.db.prepare("SELECT status, level, review_due FROM topic_state WHERE student_id = ? AND topic_id = ?");
    const tries = this.db.prepare("SELECT COUNT(*) AS n, SUM(CASE WHEN first_try_correct = 0 THEN 1 ELSE 0 END) AS wrong FROM tasks WHERE student_id = ? AND topic_id = ? AND first_try_correct IS NOT NULL");
    const ui = this.uiLang(studentId);
    const scoreOf = (s) => (!s ? 0 : s.status === "mastered" ? (s.review_due && s.review_due <= now ? 0.8 : 1) : s.status === "learning" ? 0.2 * Math.min(3, s.level || 1) : 0);
    const topics = [];
    path.units.forEach((u, ui0) =>
      u.topics.forEach((t0, ti) => {
        if (!hasGenerator(t0.id)) return;
        const ids = [t0.id, ...(t0.base || [])];
        let score = 0;
        let n = 0;
        let wrong = 0;
        for (const id of ids) {
          score = Math.max(score, scoreOf(stateOf.get(studentId, id)));
          const r = tries.get(studentId, id);
          n += r.n || 0;
          wrong += r.wrong || 0;
        }
        const t = localTopic(t0, ui);
        topics.push({ id: t0.id, name: t.name, unit: localUnitTitle(u, ui), score, tried: n, wrongRate: n ? wrong / n : 0, order: ui0 * 1000 + ti });
      }),
    );
    if (!topics.length) return { percent: 0, weakest: [] };
    const percent = Math.round((100 * topics.reduce((s, t) => s + t.score, 0)) / topics.length);
    const weakest = topics
      .filter((t) => t.score < 1)
      .sort((a, b) => a.score - b.score || b.wrongRate - a.wrongRate || b.tried - a.tried || a.order - b.order)
      .slice(0, 3)
      .map(({ id, name, unit, score }) => ({ id, name, unit, status: score === 0 ? "new" : score < 0.8 ? "learning" : "due" }));
    return { percent, weakest };
  }

  // Zadnji rezultati poskusnih tekmovanj na tej poti.
  contestHistory(studentId, pathKey, limit = 5) {
    return this.db
      .prepare("SELECT * FROM sessions WHERE student_id = ? AND kind = 'contest' AND finished = 1 ORDER BY created_at DESC, rowid DESC")
      .all(studentId)
      .map((r) => ({ ...r, params: JSON.parse(r.params) }))
      .filter((r) => r.params.path === pathKey && r.params.maxPoints)
      .slice(0, limit)
      .map((r) => ({ date: r.created_at.slice(0, 10), points: r.params.points, maxPoints: r.params.maxPoints }));
  }

  // Odprto tekmovanje (za gumb »Nadaljuj«), če čas še teče.
  openContest(studentId, pathKey) {
    const open = this.openSession(studentId, "contest", (x) => x.params.path === pathKey);
    return open && Date.now() <= open.params.deadline ? { deadline: open.params.deadline } : null;
  }

  // ---------- priprava na test ----------
  testPlan(studentId) {
    const r = this.db.prepare("SELECT * FROM test_plans WHERE student_id = ?").get(studentId);
    if (!r) return null;
    const units = JSON.parse(r.units);
    const path = getPath(r.path_key);
    const daysLeft = Math.round((Date.parse(r.test_date) - Date.parse(nowParts().date)) / 86400000); // slovenski dan, kot v urniku
    return {
      path: r.path_key,
      subject: path?.subject || null,
      units,
      unitTitles: units.map((i) => path?.units[i]?.title).filter(Boolean),
      date: r.test_date,
      daysLeft,
      // Test iz urnika (server/schedule.js): priprava mu sledi sama, dokler je učenec ne spremeni.
      eventId: r.event_id || null,
    };
  }
  setTestPlan(studentId, pathKey, units, date, eventId = null) {
    const path = getPath(pathKey);
    const clean = [...new Set((units || []).map(Number))].filter((i) => Number.isInteger(i) && path?.units[i]);
    if (!path || !clean.length || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) return null;
    this.db
      .prepare(
        `INSERT INTO test_plans (student_id, path_key, units, test_date, event_id) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(student_id) DO UPDATE SET path_key = excluded.path_key, units = excluded.units, test_date = excluded.test_date, event_id = excluded.event_id, created_at = datetime('now')`,
      )
      .run(studentId, pathKey, JSON.stringify(clean), date, eventId);
    // Stare nedokončane seje priprave zapremo, nova upošteva nov načrt.
    this.db.prepare("UPDATE sessions SET finished = 1 WHERE student_id = ? AND kind = 'test' AND finished = 0").run(studentId);
    return this.testPlan(studentId);
  }
  clearTestPlan(studentId) {
    this.db.prepare("DELETE FROM test_plans WHERE student_id = ?").run(studentId);
  }
  // Mešane naloge iz izbranih sklopov; bližje kot je test, težje so.
  startTest(studentId) {
    const plan = this.testPlan(studentId);
    if (!plan) return null;
    const open = this.openSession(studentId, "test", (x) => x.created_at.slice(0, 10) === today());
    if (open) return this.sessionNext(open.id);
    const path = getPath(plan.path);
    const topics = plan.units.flatMap((i) => path.units[i].topics).filter((t) => hasGenerator(t.id)).map((t) => t.id);
    if (!topics.length) return null;
    const d = plan.daysLeft;
    const levels = d >= 7 ? [1, 1, 2, 2, 2, 2, 2, 2, 3, 3] : d >= 3 ? [1, 2, 2, 2, 2, 3, 3, 3, 3, 3] : [2, 2, 3, 3, 3, 3, 3, 3, 3, 3];
    const order = shuffle(topics);
    const items = Array.from({ length: RULES.testTasks }, (_, i) => ({ topic: order[i % order.length], mode: "test", level: levels[i] }));
    return this.sessionNext(this.createSession(studentId, "test", items, { date: plan.date }));
  }

  // Pregled za spodnjo vrstico.
  modes(studentId, pathKey) {
    const dueCount = this.dueTopics(studentId, getPath(pathKey)?.subject).length;
    const backlog = dueCount * RULES.reviewPerTopic;
    const daily = this.db
      .prepare("SELECT finished FROM sessions WHERE student_id = ? AND kind = 'daily' AND date(created_at) = date('now') ORDER BY created_at DESC LIMIT 1")
      .get(studentId);
    const openKinds = this.db
      .prepare("SELECT DISTINCT kind FROM sessions WHERE student_id = ? AND finished = 0")
      .all(studentId)
      .map((r) => r.kind);
    return {
      newTopic: pathKey ? this.currentTopic(studentId, pathKey) : null,
      dueCount,
      reviewBacklog: backlog,
      suggestReview: backlog > RULES.backlogSuggest,
      daily: { done: !!daily?.finished, open: !!daily && !daily.finished },
      testPlan: this.testPlan(studentId),
      openKinds,
    };
  }

  // ---------- vaje brez povezave (lahki način) ----------
  // Paket nalog za teme poti, kjer učenec je (brez sklopov »naprej«): naloge z rešitvami, da jih odjemalec preveri sam.
  // Ob ponovni povezavi strežnik iz semena znova ustvari isto nalogo in odgovor preveri še enkrat.
  offlinePack(studentId, pathKey, perTopic = 6) {
    const view = this.pathView(studentId, pathKey);
    if (!view) return null;
    const topics = view.units.filter((u) => !u.ahead).flatMap((u) => u.topics.map((t) => ({ ...t, unit: u.title }))).filter((t) => t.practice);
    const path = getPath(pathKey);
    const tasks = {};
    const info = {};
    // Omejitev izdaje: največ RULES.offlinePacksPerDay paketov na dan (tabela offline_issued ne raste neomejeno).
    this.db.prepare("DELETE FROM offline_packs WHERE created_at < datetime('now','-1 day')").run();
    const packsToday = this.db.prepare("SELECT COUNT(*) AS n FROM offline_packs WHERE student_id = ?").get(studentId).n;
    if (packsToday >= RULES.offlinePacksPerDay) return { limited: true };
    this.db.prepare("INSERT INTO offline_packs (student_id) VALUES (?)").run(studentId);
    // Izdane naloge (seme, raven): sinhronizacija sprejme samo te, ne poljubnih semen (P2: neomejen XP).
    const issue = this.db.prepare("INSERT OR IGNORE INTO offline_issued (student_id, topic_id, seed, level) VALUES (?, ?, ?, ?)");
    this.db.prepare(`DELETE FROM offline_issued WHERE created_at < datetime('now','-${RULES.offlineIssuedDays} days')`).run();
    for (const t of topics) {
      const topic = getTopic(t.id);
      info[t.id] = { id: t.id, name: topic.name, goals: topic.goals, unit: topic.unit, path: pathKey, subject: topic.subject, pathLabel: path.label };
      tasks[t.id] = Array.from({ length: perTopic }, (_, i) => {
        const level = Math.max(1, Math.min(3, t.level + (i % 3 === 2 ? 1 : 0)));
        const task = generateTask(t.id, level, undefined, this.taskLang(studentId));
        issue.run(studentId, t.id, task.seed, level);
        return { level, seed: task.seed, task: publicTask(task), answer: task.answer, solution: task.solution, hint: task.hint };
      });
    }
    return { path: pathKey, created: new Date().toISOString(), view, topics: info, tasks };
  }

  // Odgovori brez povezave: [{ topic_id, level, seed, answer }]. Vsako nalogo štejemo enkrat.
  // Šteje samo naloga, ki jo je strežnik izdal v paketu (offline_issued, z isto ravnjo). V napredek štejejo vse,
  // XP (in s tem lige) pa največ RULES.offlineXpPerDay nalog na dan, toliko kot dnevni sklop: paket ima rešitve,
  // zato bi si kdo s skripto sicer »kupil« ligo (P2).
  offlineSync(studentId, results = []) {
    let synced = 0;
    let correct = 0;
    let skipped = 0;
    let noXp = 0;
    const seen = this.db.prepare("INSERT OR IGNORE INTO offline_results (student_id, topic_id, seed) VALUES (?, ?, ?)");
    const issued = this.db.prepare(
      `SELECT 1 FROM offline_issued WHERE student_id = ? AND topic_id = ? AND seed = ? AND level = ? AND created_at >= datetime('now','-${RULES.offlineIssuedDays} days')`,
    );
    let left = RULES.offlineXpPerDay - this.db.prepare("SELECT COUNT(*) AS n FROM offline_results WHERE student_id = ? AND date(created_at) = date('now')").get(studentId).n;
    for (const r of results.slice(0, 300)) {
      const level = Number(r?.level);
      const seed = Number(r?.seed);
      if (!getTopic(r?.topic_id) || !hasGenerator(r.topic_id) || ![1, 2, 3].includes(level) || !Number.isInteger(seed) || seed < 0 || seed >= 2 ** 31) continue;
      if (!issued.get(studentId, r.topic_id, seed, level)) {
        skipped += 1;
        continue;
      }
      if (!seen.run(studentId, r.topic_id, seed).changes) continue;
      const xp = left > 0;
      left -= 1;
      if (!xp) noXp += 1;
      const task = generateTask(r.topic_id, level, seed, this.taskLang(studentId));
      const id = this.saveTask(studentId, task, "practice");
      const out = this.answer(studentId, id, String(r.answer ?? "").slice(0, 200), { xp });
      synced += 1;
      if (out.correct) correct += 1;
    }
    return { synced, correct, ...(skipped ? { skipped } : {}), ...(noXp ? { no_xp: noXp } : {}) };
  }

  // ---------- odgovor ----------
  // opts.xp === false: odgovor šteje v napredek, XP pa ne (vaje brez povezave nad dnevno mejo).
  answer(studentId, taskId, input, opts = {}) {
    const giveXp = opts.xp !== false;
    const row = this.getTask(taskId);
    if (!row || row.student_id !== studentId) return { error: "Naloga ne obstaja." };
    const oneShot = ONE_SHOT.includes(row.mode);
    const maxAttempts = oneShot ? 1 : RULES.maxAttempts;
    if (row.solved || row.attempts >= maxAttempts) return this.closedAnswer(studentId, row);
    if (row.mode === "contest") {
      const sess = this.getSession(row.session_id);
      if (!sess || sess.finished) return { error: "To tekmovanje je že končano." };
      // Po izteku časa odgovor ne šteje več.
      if (Date.now() > sess.params.deadline) return { timeUp: true, contest: this.finishContest(sess) };
    }

    const task = row.payload;
    const res = checkAnswer(task.answer, input);
    // code/params: prevod sporočila v jeziku vmesnika (message ostane slovenski).
    const out = { kind: res.kind, message: res.message || null, ...(res.code ? { code: res.code, params: res.params || {} } : {}) };

    // Napake v zapisu (manjka enota, neokrajšan ulomek ...) ne štejemo kot poskus.
    if (["format", "unit", "simplify"].includes(res.kind)) {
      return { ...out, retry: true };
    }

    const correct = res.kind === "correct";
    const attempts = row.attempts + 1;
    const firstTry = row.attempts === 0;
    this.db
      .prepare(
        `UPDATE tasks SET attempts = ?, solved = ?, last_answer = ?, first_try_correct = COALESCE(first_try_correct, ?) WHERE id = ?`,
      )
      .run(attempts, correct ? 1 : 0, String(input).slice(0, 200), firstTry ? (correct ? 1 : 0) : null, taskId);

    const topic = getTopic(row.topic_id);
    // Analitika za šibke točke (enako kot META iz klepeta); test predznanja ne šteje,
    // saj nove snovi učenec še ne pozna.
    if (row.mode !== "pretest") this.store.addEvent({
      student_id: studentId,
      conversation_id: null,
      message_id: null,
      subject: topic?.subject ?? null,
      topic: topic?.name ?? null,
      topic_id: topic ? row.topic_id : null,
      error: correct ? 0 : 1,
      mode: "V",
      flag: "none",
    });

    if (row.mode === "contest") {
      out.saved = true;
      out.next = this.sessionNext(row.session_id);
      if (out.next.contest) out.contest = out.next.contest;
      return out;
    }
    if (row.mode === "pretest") {
      out.correct = correct;
      out.next = this.sessionNext(row.session_id);
      if (out.next.finished) out.pretest = this.finishPretest(studentId, row.session_id);
      return out;
    }
    if (row.mode === "placement") {
      out.correct = correct;
      if (!correct && res.kind === "rounding") out.message = res.message;
      out.next = this.sessionNext(row.session_id);
      if (out.next.finished) out.placement = this.finishPlacement(studentId, row.session_id);
      return out;
    }

    const s = this.state(studentId, row.topic_id);
    if (correct) {
      out.correct = true;
      out.solution = task.solution;
      const helped = row.hint_used || attempts > 1;
      let xp = helped ? Math.max(XP.minWithHelp, Math.floor(XP.base(row.level) / 2)) : XP.base(row.level);
      const reasons = [[xp, helped ? "pravilno (s pomočjo)" : "pravilno"]];
      if (attempts > 1) reasons.push([XP.fixBonus, "popravljena napaka"]);
      out.xp = giveXp ? this.award(studentId, reasons) : null;

      if (row.mode === "practice") {
        if (firstTry) {
          s.streak += 1;
          if (s.streak >= RULES.levelUpStreak && s.level < 3) {
            s.level += 1;
            s.streak = 0;
            out.levelUp = s.level;
          }
        }
        this.saveState(s);
        if (s.status !== "mastered" && this.checkMastery(studentId, row.topic_id)) {
          this.markMastered(studentId, row.topic_id, "practice");
          out.mastered = true;
          if (giveXp) out.xp = this.award(studentId, [[XP.mastery, "obvladana tema"]], out.xp);
        }
      }
      if (row.mode === "review" && firstTry) this.advanceReview(studentId, row.topic_id, true);
      if (row.session_id) out.next = this.sessionNext(row.session_id);
      // Samorazlaga: občasno vprašanje »zakaj?«
      if (Math.random() < 0.3) out.selfExplain = "Razloži sam sebi v enem stavku: zakaj je bil ključni korak pravilen?";
      return out;
    }

    // Napačno
    out.correct = false;
    if (row.mode === "practice" && firstTry) {
      s.streak = 0;
      if (s.level > 1) {
        s.level -= 1;
        out.levelDown = s.level;
      }
      this.saveState(s);
    }
    if (row.mode === "review" && firstTry) this.advanceReview(studentId, row.topic_id, false);
    this.db.prepare("UPDATE tasks SET hint_used = 1 WHERE id = ?").run(taskId);
    out.hint = task.hint;
    if (res.mistake) out.mistake = res.mistake;
    if (res.kind !== "rounding") Object.assign(out, { message: "Ni še pravilno. Poglej namig in poskusi znova. Kje si se zataknil?", code: "chk.tryAgain", params: {} });
    out.attemptsLeft = maxAttempts - attempts;
    if (out.attemptsLeft <= 0) {
      // Po treh poskusih: rešen zgled (učenje iz zgleda), nato nova naloga.
      out.solution = task.solution;
      Object.assign(out, { message: "Poglejva rešen zgled, nato poskusiš podobno nalogo.", code: "chk.example", params: {} });
    }
    if (row.session_id && out.attemptsLeft <= 0) out.next = this.sessionNext(row.session_id);
    return out;
  }

  // Ponovni »Preveri« pri že zaključeni nalogi (dvojni dotik, popravljen odgovor po edinem
  // poskusu, izgubljen odziv prek tunela): vrnemo shranjeni izid in naslednjo nalogo namesto
  // napake. Nič se ne šteje znova (brez XP, poskusov in sprememb stanja teme).
  closedAnswer(studentId, row) {
    const out = { closed: true, kind: row.solved ? "correct" : "wrong", correct: !!row.solved };
    if (row.mode === "contest") out.saved = true;
    if (!ONE_SHOT.includes(row.mode)) out.solution = row.payload.solution;
    if (row.session_id) {
      out.next = this.sessionNext(row.session_id);
      if (out.next.contest) out.contest = out.next.contest;
      if (out.next.finished && row.mode === "placement") out.placement = { ...this.placementScore(row.session_id), xp: null };
      if (out.next.finished && row.mode === "pretest") out.pretest = this.pretestScore(studentId, row.session_id);
    }
    return out;
  }

  // Lestev namigov pred odgovorom (practice/index.js hintSteps); uporaba namiga zmanjša XP.
  hint(studentId, taskId, upTo) {
    const row = this.getTask(taskId);
    if (!row || row.student_id !== studentId) return { error: "Naloga ne obstaja." };
    if (ONE_SHOT.includes(row.mode)) return { error: "Pri tej nalogi namigov ni." };
    const steps = hintSteps(row.payload);
    const n = Math.max(1, Math.min(steps.length, Number(upTo) || 1));
    if (steps.length) this.db.prepare("UPDATE tasks SET hint_used = 1 WHERE id = ?").run(taskId);
    return { steps: steps.slice(0, n), total: steps.length };
  }

  checkMastery(studentId, topicId) {
    const last = this.db
      .prepare(
        `SELECT first_try_correct, level FROM tasks
         WHERE student_id = ? AND topic_id = ? AND mode IN ('practice','review') AND first_try_correct IS NOT NULL
         ORDER BY id DESC LIMIT ?`,
      )
      .all(studentId, topicId, RULES.masteryWindow);
    const correct = last.filter((t) => t.first_try_correct).length;
    const hard = last.filter((t) => t.first_try_correct && t.level >= 3).length;
    return correct >= RULES.masteryCorrect && hard >= RULES.masteryHard;
  }

  advanceReview(studentId, topicId, ok) {
    const s = this.state(studentId, topicId);
    if (s.status !== "mastered") return;
    if (ok) {
      s.review_stage += 1;
      s.review_due = s.review_stage < RULES.reviewDays.length ? addDays(RULES.reviewDays[s.review_stage]) : null;
    } else {
      s.review_stage = 0;
      s.review_due = addDays(RULES.reviewDays[0]);
    }
    this.saveState(s);
  }

  placementScore(sessionId) {
    const all = this.db.prepare("SELECT first_try_correct FROM tasks WHERE session_id = ?").all(sessionId);
    const correct = all.filter((t) => t.first_try_correct).length;
    return { passed: correct / all.length >= RULES.placementPass, correct, total: all.length };
  }

  finishPlacement(studentId, sessionId) {
    const all = this.db.prepare("SELECT * FROM tasks WHERE session_id = ?").all(sessionId);
    const { passed, correct } = this.placementScore(sessionId);
    const topics = [...new Set(all.map((t) => t.topic_id))];
    let xp = null;
    if (passed) {
      // Vse teme sklopa (tudi brez vaj) štejemo kot obvladane.
      const t0 = getTopic(topics[0]);
      const unit = getPath(t0.path).units[t0.unitIndex];
      for (const t of unit.topics) this.markMastered(studentId, t.id, "placement");
      xp = this.award(studentId, [[XP.placement, "preizkus znanja"]]);
    } else {
      for (const id of topics) {
        const s = this.state(studentId, id);
        if (s.status === "new") {
          s.status = "learning";
          this.saveState(s);
        }
      }
    }
    return { passed, correct, total: all.length, xp };
  }

  // ---------- XP ----------
  award(studentId, items, prev = null) {
    const insert = this.db.prepare("INSERT INTO xp_events (student_id, amount, reason) VALUES (?, ?, ?)");
    const firstToday = !this.db
      .prepare("SELECT 1 FROM xp_events WHERE student_id = ? AND date(created_at) = date('now') LIMIT 1")
      .get(studentId);
    const all = [...items];
    if (firstToday) {
      const streak = this.dayStreak(studentId) + 1;
      if (streak > 1) all.push([XP.dailyStreak(streak), `${streak} dni zapored`]);
    }
    for (const [amount, reason] of all) insert.run(studentId, amount, reason);
    const gained = all.reduce((s, [a]) => s + a, 0) + (prev?.gained || 0);
    return { gained, items: [...(prev?.items || []), ...all.map(([amount, reason]) => ({ amount, reason }))], ...this.xpSummary(studentId) };
  }

  // Koliko zaporednih dni do včeraj je učenec zbiral XP. Današnji dan ga še ne prekine (milostni dan),
  // en zamujen dan na teden pa ga tudi ne (samodejna zamrznitev, kot pri Duolingu); zamrznjen dan ne šteje.
  dayStreak(studentId) {
    const days = this.db
      .prepare("SELECT DISTINCT date(created_at) AS d FROM xp_events WHERE student_id = ? ORDER BY d DESC LIMIT 400")
      .all(studentId)
      .map((r) => r.d);
    const set = new Set(days);
    const d = new Date();
    const dayAt = (i) => new Date(d.getTime() - i * 86400000).toISOString().slice(0, 10);
    let streak = set.has(today()) ? 1 : 0;
    let frozen = -Infinity; // zadnji zamrznjen dan (dni nazaj)
    for (let i = 1; i < 400; i++) {
      if (set.has(dayAt(i))) {
        streak += 1;
        continue;
      }
      // Zamrznitev: samo en manjkajoč dan med aktivnima (ali pred današnjim) in največ enkrat na 7 dni.
      if (set.has(dayAt(i + 1)) && i - frozen >= 7) {
        frozen = i;
        continue;
      }
      break;
    }
    return streak;
  }

  xpSummary(studentId) {
    const total = this.db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM xp_events WHERE student_id = ?").get(studentId).s;
    const week = this.db
      .prepare("SELECT COALESCE(SUM(amount),0) AS s FROM xp_events WHERE student_id = ? AND created_at >= ?")
      .get(studentId, weekStart()).s;
    const today = this.db
      .prepare("SELECT COALESCE(SUM(amount),0) AS s FROM xp_events WHERE student_id = ? AND date(created_at) = date('now')")
      .get(studentId).s;
    const lp = levelProgress(total);
    // Raven in napredek do naslednje (levelFrom/levelTo = skupni XP na začetku te in naslednje ravni),
    // današnji XP in dnevni cilj iz nastavitve profila xp_goal.
    const goal = cleanXpGoal(this.store.getStudent?.(studentId)?.settings?.xp_goal);
    return { total, week, today, goal, streak: this.dayStreak(studentId), level: lp.level, levelFrom: lp.from, levelTo: lp.to };
  }

}

// Ponedeljek tega tedna, 00:00 (UTC)
function weekStart() {
  const d = new Date();
  const day = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().slice(0, 10) + " 00:00:00";
}
