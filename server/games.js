// Igre (razdelek IGRE): najboljši rezultat in stopnja za vsako igro, XP za pravilne odgovore.
// Igra = vrsta igre + pojem, npr. "meteor:frac_add". Naloge nastanejo v brskalniku (public/games/topics.js).
import { gradeInfo } from "../public/regions.js";
import { baseTopicIds } from "./curriculum.js";
import { isCleared, PACE } from "../public/games/unlock.js";
import { WISH_IDS, weekKey } from "../public/games/wishes.js";
import { GENRE_IDS, cleanTitles } from "../public/games/childhood.js";
import { isLocalRequest } from "./feedback.js";
import { jeFaks } from "../public/stopnja.js";

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
    res.json({ year: schoolYear(s.settings), games, concepts, known: [...known], passed, xpToday: xpToday(s.id), xpPerDay: XP_PER_DAY, rated, wish });
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
