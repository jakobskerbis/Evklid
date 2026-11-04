// Kviz v živo za razred (kot Kahoot): učitelj vodi kviz na projektorju (ucitelj.html), učenci razreda
// odgovarjajo na svojih napravah (Lige). Naloge so iz generatorjev, kot delovni listi (že pregledane).
// Stanje je samo v pomnilniku: kviz traja eno šolsko uro, rezultatov ne shranjujemo, na Renderju teče
// en proces. Ena igra na razred; izbriše se po 30 minutah brez dejavnosti ali po 3 urah.
import crypto from "node:crypto";
import { getTopic } from "./curriculum.js";
import { hasGenerator } from "./practice/index.js";
import { checkAnswer } from "./practice/check.js";
import { worksheetTasks, answerHtml, optionHtml } from "./gradiva.js";
import { renderMd } from "./textbook-print.js";
import { recordSkill } from "./weaknesses.js";

export const KVIZ = {
  questions: [5, 8, 10, 12],
  seconds: [20, 30, 45, 60, 90],
  maxPlayers: 60,
  idleMs: 30 * 60_000,
  maxAgeMs: 3 * 3600_000,
  base: 500, // točke za pravilen odgovor
  bonus: 500, // dodatno za hitrost (sorazmerno s preostalim časom)
  graceMs: 1500, // zamik omrežja pri oddaji ob koncu časa
};

const rankOf = (sorted, score) => 1 + sorted.filter((p) => p.score > score).length;

export class Kvizi {
  constructor(now = () => Date.now()) {
    this.now = now;
    this.games = new Map(); // classId → igra
  }

  sweep() {
    const now = this.now();
    for (const [id, g] of this.games) if (now - g.touched > KVIZ.idleMs || now - g.created > KVIZ.maxAgeMs) this.games.delete(id);
  }

  // Nova igra za razred (prejšnja se konča). Brez nalog za temo vrne null.
  create(cls, { topicId, n, seconds, seed = 1 + Math.floor(Math.random() * 999999) }) {
    this.sweep();
    const topic = getTopic(topicId);
    if (!topic || !hasGenerator(topic.id)) return null;
    const count = KVIZ.questions.includes(n) ? n : 8;
    const tasks = worksheetTasks([topic.id], count, seed);
    if (!tasks.length) return null;
    const now = this.now();
    const g = {
      id: crypto.randomBytes(6).toString("hex"),
      classId: cls.id,
      className: cls.name,
      topic: { id: topic.id, name: topic.name },
      seconds: KVIZ.seconds.includes(seconds) ? seconds : 30,
      tasks,
      state: "lobby", // lobby → question → reveal → question … → end
      q: -1,
      startedAt: 0,
      endsAt: 0,
      players: new Map(), // studentId → { nick, score, correct, answers: [] }
      v: 1,
      created: now,
      touched: now,
    };
    this.games.set(cls.id, g);
    return g;
  }

  forClass(classId) {
    this.sweep();
    const g = this.games.get(classId) || null;
    if (g) this.tick(g);
    return g;
  }

  byId(id) {
    this.sweep();
    for (const g of this.games.values()) if (g.id === id) return this.tick(g);
    return null;
  }

  end(classId) {
    return this.games.delete(classId);
  }

  // Vprašanje se zapre samo, ko poteče čas (z zamikom graceMs, sicer pozna oddaja ne bi nikoli prišla
  // skozi) ali ko so odgovorili vsi. Po zaprtju je odgovor viden, zato potem ne sprejmemo nobene oddaje več.
  tick(g) {
    if (g.state === "question") {
      const all = g.players.size > 0 && [...g.players.values()].every((p) => p.answers[g.q]);
      if (all || this.now() >= g.endsAt + KVIZ.graceMs) {
        g.state = "reveal";
        g.v++;
      }
    }
    return g;
  }

  // Učitelj: naprej. from = stanje in vprašanje, ki ju vidi učitelj (dvojni klik ne preskoči vprašanja).
  next(g, from) {
    this.tick(g);
    if (from && (from.state !== g.state || from.q !== g.q)) return g;
    const now = this.now();
    if (g.state === "lobby" || (g.state === "reveal" && g.q + 1 < g.tasks.length)) {
      g.q++;
      g.state = "question";
      g.startedAt = now;
      g.endsAt = now + g.seconds * 1000;
    } else if (g.state === "question") g.state = "reveal";
    else if (g.state === "reveal") g.state = "end";
    else return g;
    g.v++;
    g.touched = now;
    return g;
  }

  join(g, studentId, nick) {
    g.touched = this.now();
    if (g.players.has(studentId)) return { ok: true };
    if (g.state === "end") return { error: "Kviz je že končan.", code: "kv.over", status: 409 };
    if (g.players.size >= KVIZ.maxPlayers) return { error: "Kviz je poln.", code: "kv.full", status: 409 };
    g.players.set(studentId, { nick, score: 0, correct: 0, answers: [] });
    g.v++;
    return { ok: true };
  }

  // Odgovor učenca. Napačna oblika (prazno, ni število) in manjkajoča enota nista napaka: vpiše znova.
  answer(g, studentId, q, input) {
    this.tick(g);
    const p = g.players.get(studentId);
    if (!p) return { error: "Najprej se pridruži kvizu.", status: 403 };
    if (g.state !== "question" || q !== g.q) return { error: "To vprašanje je že zaprto.", status: 409 };
    if (p.answers[q]) return { error: "Odgovor je že oddan.", code: "kv.sent", status: 409 };
    const now = this.now();
    if (now > g.endsAt + KVIZ.graceMs) return { error: "Čas je potekel.", code: "comp.timeUp", status: 409 };
    const task = g.tasks[q];
    let r = checkAnswer(task.answer, input);
    // Enoto pokaže vnosno polje; učenec vpiše samo število.
    if (r.kind === "unit" && r.code === "chk.addUnit" && task.answer.unit) r = checkAnswer(task.answer, `${input} ${task.answer.unit}`);
    if (r.kind === "format" || r.kind === "unit") return { retry: true, code: r.code, params: r.params, message: r.message };
    // Zaokroženo drugače (npr. 0,03 namesto 0,028) in neokrajšan ulomek ali koeficienti (6/8 namesto 3/4)
    // štejejo: kviz preverja razumevanje, ne zapisa. Ponovni vnos pri »simplify« bi pred zaprtjem izdal,
    // da je vrednost pravilna.
    const ok = r.kind === "correct" || r.kind === "rounding" || r.kind === "simplify";
    const left = Math.max(0, Math.min(1, (g.endsAt - now) / (g.seconds * 1000)));
    const points = ok ? Math.round(KVIZ.base + KVIZ.bonus * left) : 0;
    p.answers[q] = { ok, points, choice: task.answer.type === "choice" ? Number(input) : null };
    p.score += points;
    if (ok) p.correct++;
    g.touched = now;
    g.v++;
    this.tick(g);
    return { ok: true };
  }
}

const sortedPlayers = (g) => [...g.players.values()].sort((a, b) => b.score - a.score || a.nick.localeCompare(b.nick, "sl"));

function questionOut(g, withAnswer) {
  const t = g.tasks[g.q];
  if (!t) return null;
  const a = t.answer;
  const out = {
    html: renderMd(t.text),
    type: a.type,
    options: a.type === "choice" ? a.options.map((o) => optionHtml(t, o)) : null,
    unit: a.type === "number" ? a.unit || "" : "",
  };
  if (withAnswer) {
    // Pri izbiri velike črke kot na gumbih (A, B …), ne a), b) kot na delovnem listu.
    out.answerHtml = a.type === "choice" ? `${"ABCDEFGHIJ"[a.index]}) ${optionHtml(t, a.options[a.index])}` : answerHtml(t);
    out.index = a.type === "choice" ? a.index : null;
    out.solutionHtml = t.solution ? renderMd(t.solution) : "";
  }
  return out;
}

// Pogled za projektor (učitelj). Pravilen odgovor samo po zaprtju vprašanja.
export function hostView(g, now) {
  const players = sortedPlayers(g);
  const open = g.state === "reveal" || g.state === "end";
  const out = {
    id: g.id,
    v: g.v,
    state: g.state,
    q: g.q,
    total: g.tasks.length,
    seconds: g.seconds,
    now,
    endsAt: g.endsAt,
    className: g.className,
    topic: g.topic,
    players: players.length,
    nicks: g.state === "lobby" ? players.map((p) => p.nick) : undefined,
    answered: g.q >= 0 ? players.filter((p) => p.answers[g.q]).length : 0,
    question: g.state === "question" || g.state === "reveal" ? questionOut(g, g.state === "reveal") : null,
  };
  if (g.state === "reveal") {
    const t = g.tasks[g.q];
    const ans = players.map((p) => p.answers[g.q]);
    out.counts = {
      right: ans.filter((a) => a?.ok).length,
      wrong: ans.filter((a) => a && !a.ok).length,
      none: ans.filter((a) => !a).length,
      options: t.answer.type === "choice" ? t.answer.options.map((_, i) => ans.filter((a) => a?.choice === i).length) : null,
    };
  }
  if (open) out.board = players.slice(0, g.state === "end" ? KVIZ.maxPlayers : 5).map((p) => ({ nick: p.nick, score: p.score, correct: p.correct, rank: rankOf(players, p.score) }));
  return out;
}

// Točke brez odprtega vprašanja: dokler je vprašanje odprto, se po točkah, številu pravilnih in mestu
// ne sme videti, ali je bil oddan odgovor pravilen (učenec bi to lahko povedal sošolcem).
const frozen = (g, p) => {
  const a = g.state === "question" ? p.answers[g.q] : null;
  return { score: p.score - (a?.points || 0), correct: p.correct - (a?.ok ? 1 : 0) };
};

// Pogled učenca: vprašanje brez odgovora; po zaprtju svoj rezultat, točke in mesto.
export function playerView(g, studentId, now) {
  const players = [...g.players.values()].map((p) => frozen(g, p));
  const me = g.players.get(studentId);
  const mine = me?.answers[g.q] || null;
  const my = me ? frozen(g, me) : null;
  return {
    id: g.id,
    v: g.v,
    state: g.state,
    q: g.q,
    total: g.tasks.length,
    seconds: g.seconds,
    now,
    endsAt: g.endsAt,
    className: g.className,
    topic: g.topic.name,
    joined: !!me,
    answered: !!mine,
    question: g.state === "question" || g.state === "reveal" ? questionOut(g, g.state === "reveal") : null,
    result: g.state === "reveal" ? { ok: !!mine?.ok, points: mine?.points || 0, none: !mine } : null,
    score: my?.score || 0,
    correct: my?.correct || 0,
    rank: my && g.state !== "lobby" ? rankOf(players, my.score) : null,
    players: players.length,
  };
}

export function mountKviz(app, store, { loadStudent, leagues, kvizi = new Kvizi() }) {
  const db = store.db;
  const teacherClass = (req, res) => {
    const cls = leagues.authTeacher(req.params.code, req.get("x-teacher-key"), req.parent?.id ?? null);
    if (!cls) res.status(403).json({ error: "Napačna koda ali ključ razreda." });
    return cls;
  };
  const member = (classId, studentId) => !!db.prepare("SELECT 1 FROM class_members WHERE class_id = ? AND student_id = ?").get(classId, studentId);
  const send = (res, out) => (out.error ? res.status(out.status || 400).json({ error: out.error, code: out.code }) : res.json(out));

  // --- učitelj ---
  app.post("/api/teacher/classes/:code/kviz", (req, res) => {
    const cls = teacherClass(req, res);
    if (!cls) return;
    const g = kvizi.create(cls, { topicId: String(req.body?.topicId || ""), n: Number(req.body?.n), seconds: Number(req.body?.seconds) });
    if (!g) return res.status(404).json({ error: "Za to temo nalog za kviz še ni." });
    res.status(201).json(hostView(g, kvizi.now()));
  });
  app.get("/api/teacher/classes/:code/kviz", (req, res) => {
    const cls = teacherClass(req, res);
    if (!cls) return;
    const g = kvizi.forClass(cls.id);
    // Brez kviza 200 in state null: stran za učitelje ob vsakem pregledu razreda vpraša, ali kviz poteka.
    if (!g) return res.json({ state: null, error: "Kviz ni več na voljo.", code: "kv.gone" });
    g.touched = kvizi.now();
    res.json(hostView(g, kvizi.now()));
  });
  app.post("/api/teacher/classes/:code/kviz/naprej", (req, res) => {
    const cls = teacherClass(req, res);
    if (!cls) return;
    const g = kvizi.forClass(cls.id);
    if (!g) return res.status(404).json({ error: "Kviz ni več na voljo.", code: "kv.gone" });
    const from = typeof req.body?.state === "string" ? { state: req.body.state, q: Number(req.body.q) } : null;
    res.json(hostView(kvizi.next(g, from), kvizi.now()));
  });
  app.delete("/api/teacher/classes/:code/kviz", (req, res) => {
    const cls = teacherClass(req, res);
    if (cls) res.json({ ok: kvizi.end(cls.id) });
  });

  // --- učenec (samo člani razreda; učitelj vidi vzdevek iz lig, kot na lestvici razreda) ---
  app.get("/api/students/:id/kviz", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const classes = db.prepare("SELECT c.id FROM class_members m JOIN classes c ON c.id = m.class_id WHERE m.student_id = ? AND c.kind = 'class'").all(s.id);
    const games = classes.map((c) => kvizi.forClass(c.id)).filter((g) => g && g.state !== "end");
    res.json({ games: games.map((g) => ({ id: g.id, className: g.className, topic: g.topic.name, joined: g.players.has(s.id) })) });
  });
  const gameOf = (req, res, s) => {
    const g = kvizi.byId(String(req.params.gid));
    if (!g || !member(g.classId, s.id)) {
      res.status(404).json({ error: "Kviz ni več na voljo.", code: "kv.gone" });
      return null;
    }
    return g;
  };
  app.post("/api/students/:id/kviz/:gid/join", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const g = gameOf(req, res, s);
    if (!g) return;
    const out = kvizi.join(g, s.id, leagues.profile(s.id).nickname);
    if (out.error) return send(res, out);
    res.json(playerView(g, s.id, kvizi.now()));
  });
  app.get("/api/students/:id/kviz/:gid", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const g = gameOf(req, res, s);
    if (g) res.json(playerView(g, s.id, kvizi.now()));
  });
  app.post("/api/students/:id/kviz/:gid/odgovor", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const g = gameOf(req, res, s);
    if (!g) return;
    const input = req.body?.input;
    const out = kvizi.answer(g, s.id, Number(req.body?.q), typeof input === "number" ? input : String(input ?? "").slice(0, 80));
    if (out.error) return send(res, out);
    if (out.retry) return res.status(422).json({ error: out.message, code: out.code, params: out.params });
    // Šibke točke iz vseh virov (server/weaknesses.js): odgovor šteje pri temi kviza.
    const a = g.players.get(s.id)?.answers[Number(req.body?.q)];
    if (a) recordSkill(db, s.id, { source: "kviz", topicId: g.topic.id, n: 1, wrong: a.ok ? 0 : 1 });
    res.json(playerView(g, s.id, kvizi.now()));
  });
  return kvizi;
}
