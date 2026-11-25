// Meritve pilota v enem poročilu za skrbnika (N-09, načrt »Kakovost pred obsegom«, j 2026-11-25), brez imen:
// - vrnitev po 7, 14 in 30 dneh od začetka v pilotu (okna 7.–13., 14.–20., 30.–36. dan, server/rast.js);
// - samostojnost: delež nalog vadnice, rešenih pravilno v 1. poskusu brez namiga in brez vprašanja inštruktorju med
//   izdajo naloge in prvim odgovorom (tasks.answered_at; starejše naloge brez tega časa ne štejejo);
// - pogostost napak po temah: delež napačnih prvih odgovorov na temo, samo teme z vsaj PRAG učencev;
// - strošek AI na učenca (EUR na 30 dni v pilotu; povprečje in mediana, tudi učenci brez porabe).
// Kohorta: trenutni člani pilota (pilotMember, samo polnoletni). Vse vrednosti šele od PRAG (5) učencev naprej,
// manjša števila kot »< 5«, da se iz poročila ne da razbrati posameznika. Nič novega se ne shrani (razen časa prvega
// odgovora na nalogo), poročilo vrne samo števila; izvoz in izbris pokrijejo obstoječe tabele (tasks, usage …).
import { activeDaysOf, RETENTION_WINDOWS } from "./rast.js";
import { EUR_PER_USD } from "./usage.js";
import { getTopic } from "./curriculum.js";
import { shownN } from "./pilot-ucinek.js";

export const PRAG = 5;
const DAY = 86400000;
const isoDay = (t) => new Date(t).toISOString().slice(0, 10);
const dayDiff = (a, b) => Math.round((Date.parse(a) - Date.parse(b)) / DAY);
const r3 = (x) => Math.round(x * 1000) / 1000;
const hasTable = (db, n) => !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(n);
const hasCol = (db, t, c) => db.prepare(`PRAGMA table_info(${t})`).all().some((x) => x.name === c);
const PRACTICE = "('practice', 'review', 'list')";

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

export function pilotMetrics(db, { isMember, now = Date.now(), min = PRAG } = {}) {
  const ids = db.prepare("SELECT id FROM students ORDER BY id").all().map((r) => r.id).filter((id) => isMember(id));
  const n = ids.length;
  const base = { n: shownN(n, min), min };
  if (n < min) return { ...base, few: true };
  const today = isoDay(now);
  const start = startsOf(db, ids);
  const since = [...start.values()].sort()[0];

  // Vrnitev: profil šteje, ko je okno od začetka v pilotu celo minilo.
  const active = activeDaysOf(db, ids, since.slice(0, 10));
  const retention = {};
  for (const [k, [lo, hi]] of Object.entries(RETENTION_WINDOWS)) {
    const eligible = ids.filter((id) => dayDiff(today, start.get(id).slice(0, 10)) >= hi);
    const back = eligible.filter((id) => [...(active.get(id) || [])].some((d) => {
      const x = dayDiff(d, start.get(id).slice(0, 10));
      return x >= lo && x <= hi;
    })).length;
    retention[k] = eligible.length >= min ? { eligible: eligible.length, returned: back, pct: r3(back / eligible.length) } : { eligible: shownN(eligible.length, min), returned: null, pct: null };
  }

  // Naloge vadnice članov od začetka v pilotu (prvi odgovor je bil dan).
  const tasks = [];
  const tq = db.prepare(
    `SELECT id, topic_id, created_at, answered_at, hint_used, first_try_correct FROM tasks
     WHERE student_id = ? AND mode IN ${PRACTICE} AND first_try_correct IS NOT NULL AND created_at >= ?`,
  );
  for (const id of ids) for (const t of tq.all(id, start.get(id))) tasks.push({ ...t, student: id });

  // Samostojnost: samo naloge s časom prvega odgovora; vprašanje inštruktorju vmes (katerikoli pogovor) jo izloči.
  const asked = db.prepare(
    `SELECT 1 FROM conversations c JOIN messages m ON m.conversation_id = c.id
     WHERE c.student_id = ? AND m.role = 'user' AND m.created_at >= ? AND m.created_at <= ? LIMIT 1`,
  );
  const timed = tasks.filter((t) => t.answered_at);
  const timedStudents = new Set(timed.map((t) => t.student)).size;
  const independentN = timed.filter((t) => t.first_try_correct === 1 && !t.hint_used && !asked.get(t.student, t.created_at, t.answered_at)).length;
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

  // Strošek AI na učenca: EUR na 30 dni v pilotu (vsaj en dan), vključno z učenci brez porabe.
  let ai = null;
  if (hasTable(db, "usage")) {
    const uq = db.prepare("SELECT COALESCE(SUM(cost_usd), 0) AS usd FROM usage WHERE student_id = ? AND created_at >= ?");
    const per = ids
      .map((id) => {
        const days = Math.max(1, dayDiff(today, start.get(id).slice(0, 10)) + 1);
        return ((uq.get(id, start.get(id)).usd * EUR_PER_USD()) / days) * 30;
      })
      .sort((a, b) => a - b);
    const mid = per.length % 2 ? per[(per.length - 1) / 2] : (per[per.length / 2 - 1] + per[per.length / 2]) / 2;
    ai = { students: n, eurPerStudentMonth: r3(per.reduce((s, x) => s + x, 0) / n), medianEurPerStudentMonth: r3(mid), users: per.filter((x) => x > 0).length };
  }

  return { ...base, n, few: false, today, retention, independence, errors, hiddenTopics, ai };
}
