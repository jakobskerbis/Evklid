// Dnevna uganka (public/games/daily.js): ena uganka na dan za vse, v treh stopnjah, lestvica po času.
// Strežnik uganko izračuna sam iz datuma in stopnje ter preveri vsak odgovor; čas meri sam (od začetka do
// pravilnega odgovora), namige in napačne odgovore šteje sam. En poskus na dan za vsako stopnjo.
// Zasebnost: na lestvici sta samo vzdevek lige in avatar (kot v ligah, server/leagues.js), nič drugega.
import { LEVELS, MAX_HINTS, MIN_MS, puzzleFor, checkAnswer, totalMs, dayKey, prevDay } from "../public/games/daily.js";
import { ensureAvatarTables, publicAvatar } from "./avatar.js";

export const BOARD_TOP = 10;
const SLACK_MS = 5_000; // čas, ki ga brskalnik izmeri, sme biti od strežnikovega krajši za zamik omrežja

export function ensureDailyTables(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_puzzle (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      day TEXT NOT NULL,              -- "YYYY-MM-DD" (UTC)
      level TEXT NOT NULL,            -- easy | medium | hard
      started_at INTEGER NOT NULL,    -- ms
      hints INTEGER NOT NULL DEFAULT 0,
      wrong INTEGER NOT NULL DEFAULT 0,
      finished_at INTEGER,
      solved INTEGER NOT NULL DEFAULT 0,
      time_ms INTEGER,
      total_ms INTEGER,               -- čas s kaznimi (lestvica)
      PRIMARY KEY (student_id, day, level)
    );
    CREATE INDEX IF NOT EXISTS idx_daily_board ON daily_puzzle(day, level, solved, total_ms);
  `);
}

export function mountDailyPuzzle(app, store, { loadStudent, leagues, now = () => Date.now() }) {
  const db = store.db;
  ensureDailyTables(db);
  ensureAvatarTables(db);
  const rowOf = db.prepare("SELECT * FROM daily_puzzle WHERE student_id = ? AND day = ? AND level = ?");
  const avatarOf = db.prepare("SELECT equipped FROM avatar_state WHERE student_id = ?");
  const today = () => dayKey(new Date(now()));

  const level = (v) => (LEVELS.includes(v) ? v : null);
  const bad = (res, error) => res.status(400).json({ error });

  // Stanje ene stopnje za učenca (brez rešitve, dokler poskus ni končan).
  const mine = (r) =>
    r
      ? { started: true, done: r.finished_at != null, solved: !!r.solved, hints: r.hints, wrong: r.wrong, elapsed: r.finished_at == null ? Math.max(0, now() - r.started_at) : null, time: r.time_ms, total: r.total_ms }
      : { started: false, done: false, solved: false, hints: 0, wrong: 0 };

  const board = (day, lv, studentId) => {
    const top = db
      .prepare("SELECT student_id, total_ms FROM daily_puzzle WHERE day = ? AND level = ? AND solved = 1 ORDER BY total_ms, finished_at, student_id LIMIT ?")
      .all(day, lv, BOARD_TOP)
      .map((r, i) => ({ rank: i + 1, nickname: leagues ? leagues.profile(r.student_id).nickname : "", avatar: publicAvatar(avatarOf.get(r.student_id)?.equipped), total: r.total_ms, me: r.student_id === studentId }));
    const solvers = db.prepare("SELECT COUNT(*) AS n FROM daily_puzzle WHERE day = ? AND level = ? AND solved = 1").get(day, lv).n;
    const r = rowOf.get(studentId, day, lv);
    let rank = null;
    if (r?.solved) {
      rank =
        db
          .prepare("SELECT COUNT(*) AS n FROM daily_puzzle WHERE day = ? AND level = ? AND solved = 1 AND (total_ms < ? OR (total_ms = ? AND (finished_at < ? OR (finished_at = ? AND student_id < ?))))")
          .get(day, lv, r.total_ms, r.total_ms, r.finished_at, r.finished_at, studentId).n + 1;
    }
    return { top, solvers, rank, total: r?.solved ? r.total_ms : null };
  };

  // Niz: zaporedni dnevi z vsaj eno rešeno uganko, ki se konča danes ali včeraj.
  const streak = (studentId) => {
    const days = new Set(db.prepare("SELECT DISTINCT day FROM daily_puzzle WHERE student_id = ? AND solved = 1 ORDER BY day DESC LIMIT 400").all(studentId).map((r) => r.day));
    let d = today();
    if (!days.has(d)) d = prevDay(d);
    let n = 0;
    while (days.has(d)) {
      n++;
      d = prevDay(d);
    }
    return { days: n, today: days.has(today()) };
  };

  // Odprt poskus: današnji, ali včerajšnji, če ga je učenec začel pred polnočjo (UTC).
  const openRow = (studentId, lv, day) => {
    const d = day ?? today();
    if (d !== today() && d !== prevDay(today())) return null;
    return rowOf.get(studentId, d, lv);
  };

  app.get("/api/students/:id/daily", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const lv = req.query.level === undefined ? null : level(req.query.level);
    if (req.query.level !== undefined && !lv) return bad(res, "Neznana stopnja.");
    const day = today();
    const status = Object.fromEntries(LEVELS.map((l) => [l, mine(rowOf.get(s.id, day, l))]));
    res.set("Cache-Control", "no-store").json({ day, status, streak: streak(s.id), board: lv ? board(day, lv, s.id) : null });
  });

  // Začetek: od tu teče čas (ponovni klic čas pusti teči, ne začne znova).
  app.post("/api/students/:id/daily/start", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const lv = level(req.body?.level);
    if (!lv) return bad(res, "Neznana stopnja.");
    const day = today();
    db.prepare("INSERT OR IGNORE INTO daily_puzzle (student_id, day, level, started_at) VALUES (?, ?, ?, ?)").run(s.id, day, lv, now());
    res.json({ day, ...mine(rowOf.get(s.id, day, lv)) });
  });

  const live = (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return null;
    const lv = level(req.body?.level);
    if (!lv) return bad(res, "Neznana stopnja."), null;
    const day = req.body?.day;
    if (day !== undefined && (typeof day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day))) return bad(res, "Neznan dan."), null;
    const r = openRow(s.id, lv, day);
    if (!r) return bad(res, "Uganka še ni začeta."), null;
    if (r.finished_at != null) return res.status(409).json({ error: "Današnji poskus je že porabljen." }), null;
    return { s, lv, r };
  };

  app.post("/api/students/:id/daily/hint", (req, res) => {
    const x = live(req, res);
    if (!x) return;
    if (x.r.hints >= MAX_HINTS) return bad(res, "Namigov ni več.");
    db.prepare("UPDATE daily_puzzle SET hints = hints + 1 WHERE student_id = ? AND day = ? AND level = ?").run(x.s.id, x.r.day, x.lv);
    res.json({ hints: x.r.hints + 1 });
  });

  app.post("/api/students/:id/daily/answer", (req, res) => {
    const x = live(req, res);
    if (!x) return;
    const { s, lv, r } = x;
    const p = puzzleFor(r.day, lv);
    const ok = checkAnswer(p, typeof req.body?.answer === "string" || typeof req.body?.answer === "number" ? String(req.body.answer) : "");
    if (ok === null) return bad(res, "Odgovor mora biti število.");
    const t = now();
    const server = t - r.started_at;
    if (!ok) {
      db.prepare("UPDATE daily_puzzle SET wrong = wrong + 1 WHERE student_id = ? AND day = ? AND level = ?").run(s.id, r.day, lv);
      return res.json({ correct: false, wrong: r.wrong + 1 });
    }
    // Čas: strežnikov (od začetka); brskalnikov le, če je verjeten (ne daljši in največ SLACK_MS krajši).
    if (server < MIN_MS) return bad(res, "Prehitro.");
    const client = Number(req.body?.ms);
    if (req.body?.ms !== undefined && (!Number.isFinite(client) || client < 0 || client > server + 1_000)) return bad(res, "Neverjeten čas.");
    const ms = req.body?.ms !== undefined ? Math.round(Math.max(MIN_MS, server - SLACK_MS, Math.min(client, server))) : server;
    const total = totalMs(ms, r.hints, r.wrong);
    const done = db
      .prepare("UPDATE daily_puzzle SET finished_at = ?, solved = 1, time_ms = ?, total_ms = ? WHERE student_id = ? AND day = ? AND level = ? AND finished_at IS NULL")
      .run(t, ms, total, s.id, r.day, lv);
    if (!done.changes) return res.status(409).json({ error: "Današnji poskus je že porabljen." });
    res.json({ correct: true, day: r.day, time: ms, total, hints: r.hints, wrong: r.wrong, board: board(r.day, lv, s.id), streak: streak(s.id) });
  });

  // Predam se: poskus je porabljen, rešitev se pokaže, na lestvici ga ni.
  app.post("/api/students/:id/daily/giveup", (req, res) => {
    const x = live(req, res);
    if (!x) return;
    const { s, lv, r } = x;
    db.prepare("UPDATE daily_puzzle SET finished_at = ?, solved = 0 WHERE student_id = ? AND day = ? AND level = ? AND finished_at IS NULL").run(now(), s.id, r.day, lv);
    res.json({ day: r.day, answer: puzzleFor(r.day, lv).answer, board: board(r.day, lv, s.id), streak: streak(s.id) });
  });
}
