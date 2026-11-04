// Igre (razdelek IGRE): najboljši rezultat in stopnja za vsako igro, XP za pravilne odgovore.
// Igra = vrsta igre + pojem, npr. "meteor:frac_add". Naloge nastanejo v brskalniku (public/games/topics.js).
import { gradeInfo } from "../public/regions.js";
import { baseTopicIds } from "./curriculum.js";
import { isCleared, PACE } from "../public/games/unlock.js";
import { WISH_IDS, weekKey } from "../public/games/wishes.js";
import { GENRE_IDS, cleanTitles } from "../public/games/childhood.js";
import { isLocalRequest } from "./feedback.js";
import { jeFaks } from "../public/stopnja.js";
import { weakConcepts } from "../public/games/learn-link.js";

const GAME_ID = /^[a-z]{2,20}:[a-z0-9_]{2,30}$/;
const XP_PER_GAME = 20; // največ na igro (1 XP za vsaka 2 pravilna odgovora)
const XP_PER_DAY = 60; // največ na dan iz iger, da igre ne izrinejo učenja

const int = (v, max) => Math.max(0, Math.min(max, Math.floor(Number(v) || 0)));

// Leto šolanja (1–13) za izbiro iger in začetno težavnost; študent = 14.
export function schoolYear(settings = {}) {
  if (jeFaks(settings)) return 14;
  const info = gradeInfo(settings.school_system || "SI", settings.curriculum_level);
  if (info) return info.level;
  // Slovenski sistem: »7. razred« → 7, »2. letnik« (srednja šola) → 11.
  const m = /^(\d{1,2})\.\s*(razred|letnik)/.exec(String(settings.curriculum_level || "").trim());
  if (m) return m[2] === "letnik" ? 9 + Math.min(4, +m[1]) : Math.min(9, +m[1]);
  return 8;
}

export function mountGames(app, store, { loadStudent, progress, avatars, knowledge }) {
  const db = store.db;
  db.exec(`
    CREATE TABLE IF NOT EXISTS game_scores (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      game TEXT NOT NULL,
      best INTEGER NOT NULL DEFAULT 0,
      plays INTEGER NOT NULL DEFAULT 0,
      tier INTEGER NOT NULL DEFAULT 1,
      correct INTEGER NOT NULL DEFAULT 0,
      wrong INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (student_id, game)
    );
    -- Povratne informacije za tedenske nove igre (docs/igre-tedensko.md): 👍/👎 po vrsti igre in
    -- en glas na teden za naslednjo vrsto igre (public/games/wishes.js).
    CREATE TABLE IF NOT EXISTS game_ratings (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      engine TEXT NOT NULL,
      up INTEGER NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (student_id, engine)
    );
    CREATE TABLE IF NOT EXISTS game_wishes (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      week TEXT NOT NULL,
      genre TEXT NOT NULL,
      PRIMARY KEY (student_id, week)
    );
    CREATE TABLE IF NOT EXISTS game_unlocks (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      concept TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (student_id, concept)
    );
  `);
  migrateGameDays(db);
  // Igra je »opravljena«, ko je v eni igri dovolj pravilnih (unlock.js); odklene hitrejše igre te snovi.
  const cols = db.prepare("PRAGMA table_info(game_scores)").all().map((c) => c.name);
  if (!cols.includes("cleared")) db.exec("ALTER TABLE game_scores ADD COLUMN cleared INTEGER NOT NULL DEFAULT 0");
  const xpToday = (id) =>
    db
      .prepare("SELECT COALESCE(SUM(amount),0) AS s FROM xp_events WHERE student_id = ? AND reason LIKE 'igra:%' AND date(created_at) = date('now')")
      .get(id).s;

  app.get("/api/students/:id/games", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const rows = db.prepare("SELECT game, best, plays, tier, cleared FROM game_scores WHERE student_id = ?").all(s.id);
    const games = {};
    const concepts = {}; // zadnja stopnja pri pojmu (čez vse vrste iger)
    for (const r of rows) {
      games[r.game] = { best: r.best, plays: r.plays, tier: r.tier, cleared: !!r.cleared };
      const c = r.game.split(":")[1];
      concepts[c] = Math.max(concepts[c] || 1, r.tier);
    }
    // Obvladane teme učne poti (brez »to že znam«), regijske teme kot njihove osnovne teme.
    const known = new Set();
    for (const r of db.prepare("SELECT topic_id FROM topic_state WHERE student_id = ? AND status = 'mastered' AND COALESCE(source, '') <> 'manual'").all(s.id))
      for (const b of baseTopicIds(r.topic_id)) known.add(b);
    const passed = db.prepare("SELECT concept FROM game_unlocks WHERE student_id = ?").all(s.id).map((r) => r.concept);
    const rated = Object.fromEntries(db.prepare("SELECT engine, up FROM game_ratings WHERE student_id = ?").all(s.id).map((r) => [r.engine, !!r.up]));
    const wish = db.prepare("SELECT genre FROM game_wishes WHERE student_id = ? AND week = ?").get(s.id, weekKey())?.genre || null;
    res.json({ year: schoolYear(s.settings), games, concepts, known: [...known], passed, xpToday: xpToday(s.id), xpPerDay: XP_PER_DAY, rated, wish, weak: weakFor(db, s.id) });
  });

  // Preizkus pred igrami: 4 od 5 pravilnih odklene mirne igre te snovi.
  app.post("/api/students/:id/games/unlock", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const concept = String(req.body?.concept || "");
    if (!/^[a-z0-9_]{2,30}$/.test(concept)) return res.status(400).json({ error: "Neznana snov." });
    if (int(req.body.correct, 100) < 4) return res.status(400).json({ error: "Premalo pravilnih." });
    db.prepare("INSERT OR IGNORE INTO game_unlocks (student_id, concept) VALUES (?, ?)").run(s.id, concept);
    res.json({ ok: true });
  });

  app.post("/api/students/:id/games/result", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const game = String(req.body?.game || "");
    if (!GAME_ID.test(game)) return res.status(400).json({ error: "Neznana igra." });
    const score = int(req.body.score, 1_000_000);
    const correct = int(req.body.correct, 1000);
    const wrong = int(req.body.wrong, 1000);
    const tier = Math.max(1, int(req.body.tier, 3));
    const prev = db.prepare("SELECT best, cleared FROM game_scores WHERE student_id = ? AND game = ?").get(s.id, game);
    const cleared = isCleared(correct, wrong) ? 1 : 0;
    db.prepare(
      `INSERT INTO game_scores (student_id, game, best, plays, tier, correct, wrong, cleared) VALUES (?, ?, ?, 1, ?, ?, ?, ?)
       ON CONFLICT(student_id, game) DO UPDATE SET best = MAX(best, excluded.best), plays = plays + 1, tier = excluded.tier,
         correct = correct + excluded.correct, wrong = wrong + excluded.wrong, cleared = MAX(cleared, excluded.cleared), updated_at = datetime('now')`,
    ).run(s.id, game, score, tier, correct, wrong, cleared);
    noteGame(db, s.id, game.split(":")[1], correct, wrong);
    const room = Math.max(0, XP_PER_DAY - xpToday(s.id));
    const xp = Math.min(XP_PER_GAME, Math.floor(correct / 2), room);
    const summary = xp > 0 ? progress.award(s.id, [[xp, `igra: ${game}`]]) : null;
    const coins = avatars ? avatars.award(s.id, correct, `igra: ${game}`) : 0; // kovanci za avatar
    const zbirke = knowledge ? knowledge.sync(s.id) : []; // liki in predmeti iz iger (server/zbirke.js)
    res.json({
      xp,
      best: Math.max(prev?.best || 0, score),
      newBest: !!prev && score > prev.best,
      cleared: !!cleared,
      coins,
      zbirke,
      capped: room <= Math.floor(correct / 2) && correct >= 2,
      total: summary?.total ?? null,
    });
  });

  // 👍/👎 po koncu igre (zadnja ocena vrste igre velja, null jo odstrani).
  app.post("/api/students/:id/games/rate", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const engine = String(req.body?.engine || "");
    if (!Object.hasOwn(PACE, engine)) return res.status(400).json({ error: "Neznana igra." });
    const up = req.body?.up === true ? 1 : req.body?.up === false ? 0 : null;
    if (up === null) db.prepare("DELETE FROM game_ratings WHERE student_id = ? AND engine = ?").run(s.id, engine);
    else
      db.prepare(
        "INSERT INTO game_ratings (student_id, engine, up) VALUES (?, ?, ?) ON CONFLICT(student_id, engine) DO UPDATE SET up = excluded.up, updated_at = datetime('now')",
      ).run(s.id, engine, up);
    res.json({ ok: true });
  });

  // Glas za naslednjo vrsto igre: en na teden (od srede do srede), spremeniti ga je mogoče.
  app.post("/api/students/:id/games/wish", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const genre = String(req.body?.genre || "");
    if (!WISH_IDS.includes(genre)) return res.status(400).json({ error: "Neznana vrsta igre." });
    db.prepare("INSERT INTO game_wishes (student_id, week, genre) VALUES (?, ?, ?) ON CONFLICT(student_id, week) DO UPDATE SET genre = excluded.genre").run(s.id, weekKey(), genre);
    res.json({ ok: true, week: weekKey() });
  });

  // Anonimni povzetek za tedenske nove igre (docs/igre-tedensko.md). Vidi ga samo skrbnik ali kdor
  // aplikacijo odpre na računalniku, kjer teče strežnik (kot porabo AI).
  app.get("/api/games/trends", (req, res) => {
    if (!req.parent?.is_admin && !isLocalRequest(req)) return res.status(403).json({ error: "Samo za skrbnika." });
    res.set("Cache-Control", "no-store").json(gameTrends(db));
  });

  // Merjenje v pilotu (igre in učna pot), enako zaščiteno kot glasovi: GET /api/games/pilot?days=30
  app.get("/api/games/pilot", (req, res) => {
    if (!req.parent?.is_admin && !isLocalRequest(req)) return res.status(403).json({ error: "Samo za skrbnika." });
    const days = req.query.days === undefined ? 30 : /^\d{1,3}$/.test(String(req.query.days)) ? Number(req.query.days) : NaN;
    if (!(days >= 1 && days <= PILOT_MAX_DAYS)) return res.status(400).json({ error: "Neveljavno obdobje." });
    res.set("Cache-Control", "no-store").json(gamePilot(db, { days }));
  });
}

// Samo števila, brez imen učencev in id-jev (edino besedilo so lastni naslovi iger, največ 5 × 40 znakov,
// brez povezave z učencem); dokler prispeva manj kot MIN_STUDENTS učencev, nič
// (iz majhnih števil bi se dalo sklepati, kdo je kaj izbral).
export const MIN_STUDENTS = 3;
export function gameTrends(db, now = new Date()) {
  const week = weekKey(now);
  const last = weekKey(new Date(Date.parse(week) - 86400000));
  const contributors = new Set();
  const ratings = {};
  for (const r of db.prepare("SELECT student_id, engine, up FROM game_ratings").all()) {
    contributors.add(r.student_id);
    const x = (ratings[r.engine] ||= { up: 0, down: 0 });
    x[r.up ? "up" : "down"]++;
  }
  const wishes = { [last]: {}, [week]: {} };
  const allWishes = {};
  for (const r of db.prepare("SELECT student_id, week, genre FROM game_wishes").all()) {
    contributors.add(r.student_id);
    allWishes[r.genre] = (allWishes[r.genre] || 0) + 1;
    if (wishes[r.week]) wishes[r.week][r.genre] = (wishes[r.week][r.genre] || 0) + 1;
  }
  const childhood = {};
  const titles = {}; // lastni naslovi iger (malimi črkami → število učencev); samo za j-jev pregled
  for (const r of db.prepare("SELECT id, settings FROM students").all()) {
    let st = {};
    try {
      st = JSON.parse(r.settings || "{}") || {};
    } catch {}
    const ok = Array.isArray(st.game_childhood) ? st.game_childhood.filter((g) => GENRE_IDS.includes(g)) : [];
    const own = cleanTitles(st.game_titles);
    if (ok.length || own.length) contributors.add(r.id);
    for (const g of ok) childhood[g] = (childhood[g] || 0) + 1;
    for (const x of own) titles[x.toLowerCase()] = (titles[x.toLowerCase()] || 0) + 1;
  }
  // Igranost v zadnjih 7 dneh: koliko različnih učencev je igralo vrsto igre. Igranje ni mnenje,
  // zato ne šteje k MIN_STUDENTS (sicer bi trije igralci razkrili glas edinega glasovalca).
  const plays = {};
  for (const r of db.prepare("SELECT DISTINCT student_id, substr(game, 1, instr(game, ':') - 1) AS engine FROM game_scores WHERE updated_at >= datetime('now', '-7 days')").all()) {
    plays[r.engine] = (plays[r.engine] || 0) + 1;
  }
  const base = { week, lastWeek: last, minStudents: MIN_STUDENTS, students: contributors.size };
  if (contributors.size < MIN_STUDENTS) return { ...base, enough: false };
  return { ...base, enough: true, ratings, wishes, allWishes, childhood, titles, plays };
}

// ---------- Povezava z učno potjo in merjenje v pilotu (docs/igre-smernice.md §12) ----------
// Na učenca in dan samo števci (brez časov posameznih iger, brez naprave): igre, vrnitve na pot in
// pravilni/napačni odgovori v igrah, ločeno za šibke teme in ostale. Stari dnevi se brišejo.
export const RETURN_MINUTES = 30; // »vrnitev na pot«: naloga na učni poti v tem času po koncu igre
export const PILOT_MAX_DAYS = 120;
export function migrateGameDays(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS game_days (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      day TEXT NOT NULL,
      plays INTEGER NOT NULL DEFAULT 0,
      returns INTEGER NOT NULL DEFAULT 0,
      pending INTEGER NOT NULL DEFAULT 0, -- zadnja igra še čaka na vrnitev na pot
      last_end TEXT,
      PRIMARY KEY (student_id, day)
    );
    CREATE TABLE IF NOT EXISTS game_concept_days (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      day TEXT NOT NULL,
      concept TEXT NOT NULL,
      weak INTEGER NOT NULL DEFAULT 0, -- pojem je bil ob igri med učenčevimi šibkimi temami
      correct INTEGER NOT NULL DEFAULT 0,
      wrong INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (student_id, day, concept, weak)
    );
    CREATE INDEX IF NOT EXISTS idx_game_days_day ON game_days(day);
    CREATE INDEX IF NOT EXISTS idx_game_concept_days_day ON game_concept_days(day);
  `);
  pruneGameDays(db); // rok hrambe tudi, ko nihče ne igra (ob zagonu)
}

// Šibke teme učenca: napake na učni poti (napačen prvi odgovor) in v igrah v zadnjih 7 dneh.
export function weakFor(db, studentId) {
  const path = db
    .prepare(
      `SELECT topic_id, COUNT(*) AS n FROM tasks WHERE student_id = ? AND attempts > 0 AND COALESCE(first_try_correct, 0) = 0
         AND created_at >= datetime('now', '-7 days') GROUP BY topic_id`,
    )
    .all(studentId);
  const games = db
    .prepare("SELECT concept, SUM(wrong) AS n FROM game_concept_days WHERE student_id = ? AND day >= date('now', '-6 days') GROUP BY concept")
    .all(studentId);
  return weakConcepts(path, games, baseTopicIds);
}

// Konec igre: števec iger, čakanje na vrnitev na pot, točnost (šibka tema ali ne, pred to igro).
// pending = igre v nizu (razmik največ RETURN_MINUTES), ki še čakajo na vrnitev; starejši niz se ne šteje več.
export function noteGame(db, studentId, concept, correct, wrong) {
  const weak = weakFor(db, studentId).some((x) => x.concept === concept) ? 1 : 0;
  db.prepare(
    `INSERT INTO game_days (student_id, day, plays, pending, last_end) VALUES (?, date('now'), 1, 1, datetime('now'))
     ON CONFLICT(student_id, day) DO UPDATE SET plays = plays + 1,
       pending = CASE WHEN last_end >= datetime('now', ?) THEN pending + 1 ELSE 1 END, last_end = excluded.last_end`,
  ).run(studentId, `-${RETURN_MINUTES} minutes`);
  db.prepare(
    `INSERT INTO game_concept_days (student_id, day, concept, weak, correct, wrong) VALUES (?, date('now'), ?, ?, ?, ?)
     ON CONFLICT(student_id, day, concept, weak) DO UPDATE SET correct = correct + excluded.correct, wrong = wrong + excluded.wrong`,
  ).run(studentId, concept, weak, correct, wrong);
  pruneGameDays(db);
}
function pruneGameDays(db) {
  db.prepare("DELETE FROM game_days WHERE day < date('now', ?)").run(`-${PILOT_MAX_DAYS} days`);
  db.prepare("DELETE FROM game_concept_days WHERE day < date('now', ?)").run(`-${PILOT_MAX_DAYS} days`);
}

// Odgovor na učni poti: če je učenec v RETURN_MINUTES po igri spet pri nalogah, se vse igre niza, ki
// čakajo, štejejo kot vrnitev (vsaka igra največ enkrat; niz čez polnoč ostane pri dnevu svoje igre).
export function notePathActivity(db, studentId) {
  db.prepare(
    "UPDATE game_days SET returns = returns + pending, pending = 0 WHERE student_id = ? AND pending > 0 AND last_end >= datetime('now', ?)",
  ).run(studentId, `-${RETURN_MINUTES} minutes`);
}

// Povzetek za skrbnika: samo vsote čez učence, brez imen in id-jev; pri manj kot MIN_STUDENTS
// igralcih brez števil (iz majhnih števil bi se dalo sklepati, kdo je igral). Enako za vrstice po dnevih:
// dnevi z manj kot MIN_STUDENTS igralci so združeni v eno vrstico (day: null); če ima tudi ta manj kot
// MIN_STUDENTS različnih igralcev, ti dnevi niso v nobeni vrstici in ne v vsotah (razlika bi jih izdala).
export function gamePilot(db, { days = 30 } = {}) {
  const n = Math.max(1, Math.min(PILOT_MAX_DAYS, Math.floor(days) || 30));
  const since = `-${n - 1} days`;
  const players = db.prepare("SELECT COUNT(DISTINCT student_id) AS n FROM game_days WHERE day >= date('now', ?) AND plays > 0").get(since).n;
  const base = { days: n, minutes: RETURN_MINUTES, minStudents: MIN_STUDENTS, players };
  if (players < MIN_STUDENTS) return { ...base, enough: false };
  const byDay = db
    .prepare(
      `SELECT day, COUNT(DISTINCT student_id) AS players, SUM(plays) AS plays, SUM(returns) AS returns
       FROM game_days WHERE day >= date('now', ?) AND plays > 0 GROUP BY day ORDER BY day DESC`,
    )
    .all(since);
  const big = byDay.filter((r) => r.players >= MIN_STUDENTS);
  const small = byDay.filter((r) => r.players < MIN_STUDENTS).map((r) => r.day);
  let merged = null;
  if (small.length) {
    const marks = small.map(() => "?").join(",");
    const m = db
      .prepare(`SELECT COUNT(DISTINCT student_id) AS players, SUM(plays) AS plays, SUM(returns) AS returns FROM game_days WHERE plays > 0 AND day IN (${marks})`)
      .get(...small);
    if (m.players >= MIN_STUDENTS) merged = { day: null, dayCount: small.length, ...m };
  }
  const shown = new Set([...big.map((r) => r.day), ...(merged ? small : [])]);
  const rows = merged ? [...big, merged] : big;
  const acc = { weak: { correct: 0, wrong: 0 }, other: { correct: 0, wrong: 0 } };
  for (const r of db
    .prepare("SELECT day, weak, SUM(correct) AS c, SUM(wrong) AS w FROM game_concept_days WHERE day >= date('now', ?) GROUP BY day, weak")
    .all(since)) {
    if (!shown.has(r.day)) continue;
    const x = acc[r.weak ? "weak" : "other"];
    x.correct += r.c || 0;
    x.wrong += r.w || 0;
  }
  const rate = (a, b) => (b ? Math.round((100 * a) / b) : null);
  const plays = rows.reduce((s, r) => s + r.plays, 0);
  const returns = rows.reduce((s, r) => s + r.returns, 0);
  // igralec-dan: pri združeni vrstici iz posameznih dni (ne iz števila različnih igralcev)
  const playerDays = big.reduce((s, r) => s + r.players, 0) + (merged ? byDay.filter((r) => r.players < MIN_STUDENTS).reduce((s, r) => s + r.players, 0) : 0);
  return {
    ...base,
    enough: true,
    hiddenDays: merged ? 0 : small.length,
    totals: {
      plays,
      playsPerPlayerDay: playerDays ? Math.round((10 * plays) / playerDays) / 10 : 0,
      returns,
      returnRate: rate(returns, plays),
      weakAccuracy: rate(acc.weak.correct, acc.weak.correct + acc.weak.wrong),
      otherAccuracy: rate(acc.other.correct, acc.other.correct + acc.other.wrong),
      weakAnswers: acc.weak.correct + acc.weak.wrong,
      otherAnswers: acc.other.correct + acc.other.wrong,
    },
    rows: rows.map((r) => ({ ...r, returnRate: rate(r.returns, r.plays) })),
  };
}
