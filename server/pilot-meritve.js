// Meritve pilota v enem poročilu za skrbnika (N-09, načrt »Kakovost pred obsegom«, j 2026-11-25), brez imen:
// - vrnitev po 7, 14 in 30 dneh od začetka v pilotu (okna 7.–13., 14.–20., 30.–36. dan, server/rast.js);
// - samostojnost: delež nalog vadnice, rešenih pravilno v 1. poskusu brez namiga in brez vprašanja inštruktorju med
//   izdajo naloge in prvim odgovorom (tasks.answered_at; starejše naloge brez tega časa ne štejejo);
// - pogostost napak po temah: delež napačnih prvih odgovorov na temo, samo teme z vsaj PRAG učencev;
// - strošek AI na učenca (EUR na 30 dni v pilotu; povprečje in mediana, tudi učenci brez porabe).
// Kohorta: člani pilota (pilotMember; od N-11 samo polnoletni profili). Da se iz razlike dveh poročil ne da razbrati
// posameznika (pregled 2 PR #1123):
// - poročilo je TEDENSKI POSNETEK: šteje samo podatke do ponedeljka 00:00 (UTC) tega tedna, izračuna se enkrat na
//   teden in shrani (pilotMetricsWeekly), zato se čez teden ne spreminja, tudi če se članstvo vmes spremeni;
// - kohorta so člani v paketih po PRAG (5) po vrsti začetka (block); vrnitev šteje samo pakete upravičenih;
// - vse vrednosti šele od PRAG učencev naprej, manjša števila kot »< 5«; strošek AI samo, ko AI uporablja vsaj PRAG.
// Nič novega se ne shrani (razen časa prvega odgovora na nalogo), poročilo vrne samo števila; izvoz in izbris
// pokrijejo obstoječe tabele (tasks, usage …).
import { activeDaysOf, RETENTION_WINDOWS } from "./rast.js";
import { EUR_PER_USD } from "./usage.js";
import { getTopic } from "./curriculum.js";
import { shownN, block } from "./pilot-ucinek.js";

export const PRAG = 5;
const DAY = 86400000;
const isoDay = (t) => new Date(t).toISOString().slice(0, 10);
const sqlTime = (t) => new Date(t).toISOString().replace("T", " ").slice(0, 19);
const dayDiff = (a, b) => Math.round((Date.parse(a) - Date.parse(b)) / DAY);
const r3 = (x) => Math.round(x * 1000) / 1000;
const hasTable = (db, n) => !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(n);
const hasCol = (db, t, c) => db.prepare(`PRAGMA table_info(${t})`).all().some((x) => x.name === c);
const PRACTICE = "('practice', 'review', 'list')";

// Ponedeljek 00:00 UTC tedna, v katerem je `now` (meja posnetka).
export function weekStart(now) {
  const d = new Date(isoDay(now));
  return d.getTime() - ((d.getUTCDay() + 6) % 7) * DAY;
}

// Kandidati za člane (da pilotMember ne kličemo za vse profile): odprli naloge pilota, račun v pilotu ali v razredu
// (pilotna šola). Z EVKLID_PILOT_VSI (samo preizkus na lastnem računalniku) vsi.
function candidates(db) {
  if (process.env.EVKLID_PILOT_VSI === "1") return db.prepare("SELECT id FROM students ORDER BY id").all().map((r) => r.id);
  const parts = [];
  if (hasTable(db, "pilot_state")) parts.push("SELECT student_id AS id FROM pilot_state");
  if (hasTable(db, "parents") && hasCol(db, "parents", "pilot_at") && hasCol(db, "students", "parent_id"))
    parts.push("SELECT s.id FROM students s JOIN parents p ON p.id = s.parent_id WHERE p.pilot_at IS NOT NULL");
  if (hasTable(db, "class_members")) parts.push("SELECT student_id AS id FROM class_members");
  if (!parts.length) return [];
  return db.prepare(`SELECT DISTINCT id FROM (${parts.join(" UNION ")}) ORDER BY id`).all().map((r) => r.id);
}

// Začetek v pilotu: prej od »račun je v pilotu« (pilot_at) in »profil je prvič odprl naloge« (pilot_state), sicer
// nastanek profila (pilotna šola).
function startsOf(db, ids) {
  const parents = hasTable(db, "parents") && hasCol(db, "parents", "pilot_at") && hasCol(db, "students", "parent_id");
  const st = hasTable(db, "pilot_state");
  const q = db.prepare(
    `SELECT s.created_at AS c, ${parents ? "(SELECT pilot_at FROM parents p WHERE p.id = s.parent_id)" : "NULL"} AS a,
       ${st ? "(SELECT joined_at FROM pilot_state ps WHERE ps.student_id = s.id)" : "NULL"} AS j
     FROM students s WHERE s.id = ?`,
  );
  const out = new Map();
  for (const id of ids) {
    const r = q.get(id);
    if (!r) continue;
    const t = [r.a, r.j].filter(Boolean).sort()[0] || r.c;
    out.set(id, String(t).replace("T", " ").slice(0, 19));
  }
  return out;
}

// Prvi indeks v urejenem seznamu z vrednostjo >= x.
function lowerBound(arr, x) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (arr[m] < x) lo = m + 1;
    else hi = m;
  }
  return lo;
}

// Poročilo skrbnika: izračun enkrat na teden, shranjen do naslednjega ponedeljka (samo skupna števila, brez osebnih
// podatkov). Tako odstranitev in ponovna dodaja članov med tednom ne spremeni poročila (pregled 2 PR #1123: iz
// zaporednih poročil z drugačnim članstvom bi se dali izračunati podatki posameznika). Hrani se zadnjih 8 tednov.
export function pilotMetricsWeekly(db, opts = {}) {
  db.exec("CREATE TABLE IF NOT EXISTS pilot_meritve_tedni (week TEXT NOT NULL, min INTEGER NOT NULL, data TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')), PRIMARY KEY (week, min))");
  const min = opts.min ?? PRAG;
  const week = isoDay(weekStart(opts.now ?? Date.now()));
  const row = db.prepare("SELECT data FROM pilot_meritve_tedni WHERE week = ? AND min = ?").get(week, min);
  if (row) return JSON.parse(row.data);
  const m = pilotMetrics(db, { ...opts, min });
  db.prepare("INSERT OR IGNORE INTO pilot_meritve_tedni (week, min, data) VALUES (?, ?, ?)").run(week, min, JSON.stringify(m));
  db.prepare("DELETE FROM pilot_meritve_tedni WHERE week < ?").run(isoDay(weekStart(opts.now ?? Date.now()) - 56 * DAY));
  return m;
}

export function pilotMetrics(db, { isMember, now = Date.now(), min = PRAG } = {}) {
  const cut = weekStart(now);
  const asOf = sqlTime(cut); // podatki do ponedeljka 00:00 tega tedna
  const today = isoDay(cut);
  const all = candidates(db).filter((id) => isMember(id));
  const start = startsOf(db, all);
  // Kohorta: člani, ki so začeli pred posnetkom, po vrsti začetka, v paketih po `min`.
  const started = all.filter((id) => start.get(id) < asOf).sort((a, b) => (start.get(a) < start.get(b) ? -1 : start.get(a) > start.get(b) ? 1 : a - b));
  const ids = block(started, min);
  const n = started.length;
  const base = { n: shownN(n, min), min, asOf: today };
  if (!ids.length) return { ...base, few: true };
  const since = start.get(ids[0]);

  // Vrnitev: profil šteje, ko je okno od začetka v pilotu celo minilo; upravičeni v paketih po vrsti začetka.
  const active = activeDaysOf(db, ids, since.slice(0, 10), asOf);
  const retention = {};
  for (const [k, [lo, hi]] of Object.entries(RETENTION_WINDOWS)) {
    const eligibleAll = ids.filter((id) => dayDiff(today, start.get(id).slice(0, 10)) > hi);
    const eligible = block(eligibleAll, min);
    const back = eligible.filter((id) => [...(active.get(id) || [])].some((d) => {
      const x = dayDiff(d, start.get(id).slice(0, 10));
      return x >= lo && x <= hi;
    })).length;
    retention[k] = eligible.length ? { eligible: eligible.length, returned: back, pct: r3(back / eligible.length) } : { eligible: shownN(eligibleAll.length, min), returned: null, pct: null };
  }

  // Naloge vadnice kohorte od začetka v pilotu do posnetka (prvi odgovor je bil dan pred posnetkom).
  const tasks = [];
  const tq = db.prepare(
    `SELECT topic_id, created_at, answered_at, hint_used, first_try_correct FROM tasks
     WHERE student_id = ? AND mode IN ${PRACTICE} AND first_try_correct IS NOT NULL AND created_at >= ? AND created_at < ?
       AND (answered_at IS NULL OR answered_at < ?)`,
  );
  for (const id of ids) for (const t of tq.all(id, start.get(id), asOf, asOf)) tasks.push({ ...t, student: id });

  // Samostojnost: samo naloge s časom prvega odgovora; vprašanje inštruktorju vmes (katerikoli pogovor) jo izloči.
  // Časi vprašanj učenca se preberejo enkrat na učenca in iščejo z bisekcijo.
  const mq = db.prepare(
    `SELECT m.created_at AS t FROM conversations c JOIN messages m ON m.conversation_id = c.id
     WHERE c.student_id = ? AND m.role = 'user' AND m.created_at >= ? AND m.created_at < ? ORDER BY m.created_at`,
  );
  const asks = new Map();
  const askedBetween = (sid, from, to) => {
    if (!asks.has(sid)) asks.set(sid, mq.all(sid, start.get(sid), asOf).map((r) => r.t));
    const a = asks.get(sid);
    const i = lowerBound(a, from);
    return i < a.length && a[i] <= to;
  };
  const timed = tasks.filter((t) => t.answered_at);
  const timedStudents = new Set(timed.map((t) => t.student)).size;
  const independentN = timed.filter((t) => t.first_try_correct === 1 && !t.hint_used && !askedBetween(t.student, t.created_at, t.answered_at)).length;
  const independence =
    timedStudents >= min
      ? { students: timedStudents, tasks: timed.length, independent: independentN, pct: r3(independentN / timed.length) }
      : { students: shownN(timedStudents, min), tasks: null, independent: null, pct: null };

  // Napake po temah: samo teme z vsaj `min` učenci (sicer bi se dal razbrati posameznik).
  const byTopic = new Map();
  for (const t of tasks) {
    if (!byTopic.has(t.topic_id)) byTopic.set(t.topic_id, { students: new Set(), n: 0, wrong: 0 });
    const g = byTopic.get(t.topic_id);
    g.students.add(t.student);
    g.n++;
    if (t.first_try_correct === 0) g.wrong++;
  }
  const errors = [...byTopic.entries()]
    .filter(([, g]) => g.students.size >= min)
    .map(([id, g]) => ({ topic: getTopic(id)?.name || id, students: g.students.size, tasks: g.n, wrongPct: r3(g.wrong / g.n) }))
    .sort((a, b) => b.wrongPct - a.wrongPct || b.tasks - a.tasks)
    .slice(0, 20);
  const hiddenTopics = [...byTopic.values()].filter((g) => g.students.size < min).length;

  // Strošek AI na učenca: EUR na 30 dni v pilotu (vsaj en dan), vključno z učenci brez porabe; samo, ko AI uporablja
  // vsaj `min` učencev (sicer bi povprečje × število razkrilo porabo enega).
  let ai = null;
  if (hasTable(db, "usage")) {
    const uq = db.prepare("SELECT COALESCE(SUM(cost_usd), 0) AS usd FROM usage WHERE student_id = ? AND created_at >= ? AND created_at < ?");
    const per = ids
      .map((id) => {
        const days = Math.max(1, dayDiff(today, start.get(id).slice(0, 10)));
        return ((uq.get(id, start.get(id), asOf).usd * EUR_PER_USD()) / days) * 30;
      })
      .sort((a, b) => a - b);
    const users = per.filter((x) => x > 0).length;
    const mid = per.length % 2 ? per[(per.length - 1) / 2] : (per[per.length / 2 - 1] + per[per.length / 2]) / 2;
    ai =
      users >= min
        ? { students: ids.length, users, eurPerStudentMonth: r3(per.reduce((s, x) => s + x, 0) / ids.length), medianEurPerStudentMonth: r3(mid) }
        : { students: ids.length, users: shownN(users, min), eurPerStudentMonth: null, medianEurPerStudentMonth: null };
  }

  return { ...base, n, cohort: ids.length, few: false, retention, independence, errors, hiddenTopics, ai };
}
