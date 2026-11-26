// Merjenje učinka v pilotu (j, 6. 11. 16:0x; N-10, j 2026-11-25): preizkus znanja na začetku in čez 14 dni ter
// vprašanje za starše (in polnoletne imetnike računa), ali bi za Evklid plačali. Del »Pomagaj izboljšati Evklid«
// (server/pilot-naloge.js).
//
// Preizkus znanja (N-10, načrt »Kakovost pred obsegom«): 12 nalog iz 12 sklopov Predmetnega izpitnega kataloga za
// splošno maturo – matematika (osnovna raven), v dveh vzporednih oblikah A in B (isto mesto = ista tema, raven in tip
// naloge, druga števila). Obliki sta zamrznjeni v content/pilot-preizkus/matura-mat.json (scripts/pilot-preizkus.js),
// da se med pilotom ne spremenita. Polovica učencev začne z A in čez 14 dni reši B, polovica obratno (izmenično po vrsti
// začetka), da razlika v težavnosti oblik ne popači napredka. Oceni koda (checkAnswer kot v kvizu), brez AI. En odgovor
// na nalogo, »Ne vem« šteje kot napačno. XP samo za opravljen preizkus (enkrat na fazo), nikoli za rezultat; izid ne
// vpliva na napredek, ravni ali lige. Prejšnji preizkus (6 nalog iz naslednje teme na poti) ostane v bazi kot
// pre-v1/post-v1 (izvoz in izbris kot prej), v poročilu ga ni.
//
// Brez pomoči (j 26. 11. 2026, pregled pripravljenosti pilota, poseg 3): navodilo pove, da kandidat rešuje sam (brez
// inštruktorja, skenerja in drugih ljudi; računalo sme). Po zadnji nalogi ga vprašamo »Si pri kateri nalogi uporabil
// pomoč?« (help: yes | no); preizkus je končan (finished_at, rezultat, XP) šele z odgovorom. Takrat zapišemo še, ali je
// med reševanjem uporabil inštruktorja ali skener ali vadil (aided; okna do 30 min pred vsakim odgovorom, times, glej
// aidedDuring), pri drugem preizkusu pa tudi, katera mesta je med preizkusoma vadil (practiced). Vse to se ob koncu zapiše enkrat in se ne spreminja več, zato
// se paketi po 5 (zasebnost) ne spremenijo, ko kdo pozneje odgovori ali izbriše pogovor (pregled 2). Drugi preizkus s
// pomočjo ni v glavnem izidu.
//
// Glavni izid (isti pregled): pari (kandidat, mesto v obliki), kjer je kandidat nalogo v prvem preizkusu rešil napačno
// ali z »Ne vem«, in delež tistih, ki jih je čez 14 dni brez pomoči rešil pravilno (vzporedna naloga istega koncepta),
// ločeno za koncepte, ki jih je vmes vadil v Evklidu (vadnica, inštruktor ali vaja drugje s to temo med koncem prvega in
// začetkom drugega preizkusa), in tiste, ki jih ni; skupina šele od praga kandidatov. Poročilo šteje še povabljene (člane
// pilota), začete, končane, pare in odpadle (prvi končan, drugega ni končal v ODPAD_DAYS dneh po odprtju).
//
// Plačilo: enkrat, 14 dni po začetku pilota; »Ali bi plačal?« (Da / Mogoče / Ne / Raje ne povem) in pri Da ali Mogoče
// še »Koliko na mesec?« (razponi v evrih ali Raje ne povem). Brez XP.
//
// Skrbnik vidi samo vsote brez imen in šele od praga odgovorov (povprečje pred in po pri istih učencih, po obliki in
// vrstnem redu, po sklopih; porazdelitev odgovorov o plačilu). Izvoz GDPR: tabeli imata student_id/parent_id
// (zasebnost.js exportOtherTables), izbris profila ali računa ju pobriše (ON DELETE CASCADE).
import fs from "node:fs";
import { publicTask } from "./practice/index.js";
import { checkAnswer } from "./practice/check.js";
import * as MATH from "../public/graph/math.js";
import { ageOn, ADULT_AGE } from "./accounts/age.js";

export const QUIZ = JSON.parse(fs.readFileSync(new URL("../content/pilot-preizkus/matura-mat.json", import.meta.url), "utf8"));
export const QUIZ_FORMS = ["A", "B"];
export const QUIZ_LEN = QUIZ.slots.length;
export const QUIZ_GAP_DAYS = 14;
export const ODPAD_DAYS = 7; // drugi preizkus ni končan 7 dni po odprtju → odpadel
export const QUIZ_HELP = ["yes", "no"];
const MIN_ITEMS = 10; // delež in interval skupine šele od 10 nalog naprej
export const WTP_AFTER_DAYS = 14;
export const WTP_PAY = ["yes", "maybe", "no", "skip"];
export const WTP_AMOUNT = ["lt5", "5to10", "10to15", "15to20", "gt20", "skip"];
const PHASES = ["pre", "post"];
const otherForm = (f) => (f === "A" ? "B" : "A");

export function migratePilotImpact(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pilot_quiz (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      phase TEXT NOT NULL,           -- pre | post (prejšnji preizkus: pre-v1 | post-v1)
      topic_id TEXT NOT NULL,        -- različica oblik (QUIZ.version); pri prejšnjem tema
      items TEXT NOT NULL,           -- JSON: mesta v obliki [0..11]; pri prejšnjem [{ seed, level, topic? }]
      answers TEXT NOT NULL,         -- JSON [1 | 0 | -1 | null] (-1 = »Ne vem«, null = še brez odgovora)
      score INTEGER,                 -- pravilnih, ko je preizkus končan
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      finished_at TEXT,
      form TEXT,                     -- A | B (NULL = prejšnji preizkus)
      PRIMARY KEY (student_id, phase)
    );
  `);
  const cols = db.prepare("PRAGMA table_info(pilot_quiz)").all().map((c) => c.name);
  if (!cols.includes("form")) db.exec("ALTER TABLE pilot_quiz ADD COLUMN form TEXT");
  // aided: 1 = med preizkusom je uporabil inštruktorja ali skener (zapiše se ob koncu); help: odgovor kandidata.
  if (!cols.includes("aided")) db.exec("ALTER TABLE pilot_quiz ADD COLUMN aided INTEGER");
  if (!cols.includes("help")) db.exec("ALTER TABLE pilot_quiz ADD COLUMN help TEXT");
  // times: JSON časov odgovorov (za pomoč samo v času reševanja, ne med premorom).
  if (!cols.includes("times")) db.exec("ALTER TABLE pilot_quiz ADD COLUMN times TEXT");
  // practiced (samo drugi preizkus): JSON mest [0..11], katerih temo je vadil med preizkusoma (zapiše se ob koncu).
  if (!cols.includes("practiced")) db.exec("ALTER TABLE pilot_quiz ADD COLUMN practiced TEXT");
  // Prejšnji preizkus (pred N-10) se umakne pod pre-v1/post-v1: ostane v izvozu, nov preizkus začne znova. OR IGNORE:
  // vrstica brez oblike, ki bi jo ob vrnitvi na staro različico napisala stara koda ob obstoječi pre-v1, ne ustavi
  // zagona; dobi oznako s časom nastanka.
  db.prepare("UPDATE OR IGNORE pilot_quiz SET phase = phase || '-v1' WHERE form IS NULL AND phase IN ('pre', 'post')").run();
  db.prepare("UPDATE OR IGNORE pilot_quiz SET phase = phase || '-v1-' || created_at WHERE form IS NULL AND phase IN ('pre', 'post')").run();
  const hasParents = !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'parents'").get();
  if (hasParents)
    db.exec(`
      CREATE TABLE IF NOT EXISTS pilot_wtp (
        parent_id INTEGER PRIMARY KEY REFERENCES parents(id) ON DELETE CASCADE,
        pay TEXT NOT NULL,             -- WTP_PAY
        amount TEXT,                   -- WTP_AMOUNT (samo pri yes/maybe)
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);
}

const sqlDate = (s) => new Date(Date.parse(`${String(s).replace(" ", "T")}Z`));
const addDays = (s, d) => new Date(sqlDate(s).getTime() + d * 864e5);
const parse = (s, d) => {
  try {
    return JSON.parse(s);
  } catch {
    return d;
  }
};
const rowOf = (db, sid, phase) => db.prepare("SELECT * FROM pilot_quiz WHERE student_id = ? AND phase = ?").get(sid, phase);

// Naloga preizkusa: zamrznjena naloga oblike (kopija, da je klic ne spremeni).
const taskOf = (row, i) => {
  const t = QUIZ.forms[row?.form]?.[parse(row.items, [])[i]];
  return t ? structuredClone(t) : null;
};

// Oblika prvega preizkusa: izmenično po vrsti začetka (A, B, A, B …), da sta skupini »A nato B« in »B nato A« enako veliki.
function firstForm(db) {
  const n = db.prepare("SELECT COUNT(*) AS n FROM pilot_quiz WHERE phase = 'pre' AND form IS NOT NULL").get().n;
  return QUIZ_FORMS[n % 2];
}

const phaseView = (row) => {
  if (!row) return { started: false, done: false };
  const answers = parse(row.answers, []);
  const done = row.finished_at != null;
  // askHelp: vse naloge so odgovorjene, preizkus se konča z odgovorom na vprašanje o pomoči.
  const askHelp = !done && answers.length > 0 && answers.every((a) => a != null);
  return { started: true, done, index: answers.filter((a) => a != null).length, total: answers.length, ...(done ? { score: row.score } : {}), ...(askHelp ? { askHelp } : {}) };
};

// Pomoč med reševanjem: v oknu do HELP_WINDOW_MIN minut pred vsakim odgovorom (a ne pred prejšnjim odgovorom oziroma
// začetkom preizkusa), da premor sredi preizkusa (npr. teden vaje) ne šteje kot pomoč (pregled 3). Pomoč je: klic AI
// inštruktorja ali skenerja (HELP_KINDS v usage, tudi odgovor iz predpomnilnika), sporočilo inštruktorju, odgovor na
// nalogo vadnice ali vaja drugje (skill_results.last_at: pole, kviz, kartice …). Brez tabel: ne vemo → false.
export const HELP_WINDOW_MIN = 30;
export const HELP_KINDS = ["chat", "boost", "popravek", "prekinjeno", "sodba", "preverjanje", "verify", "reuse", "hint", "skeniranje"];
const sqlTimeOf = (d) => d.toISOString().replace("T", " ").slice(0, 19);
export function helpWindows(start, times) {
  const out = [];
  let prev = start;
  for (const t of times) {
    if (!t) continue;
    const from = sqlTimeOf(new Date(Math.max(sqlDate(prev).getTime(), sqlDate(t).getTime() - HELP_WINDOW_MIN * 60000)));
    out.push([from, t]);
    prev = t;
  }
  return out;
}
export function aidedDuring(db, sid, windows) {
  const kinds = HELP_KINDS.map(() => "?").join(",");
  const any = (sql, from, to, extra = []) => {
    try {
      return !!db.prepare(sql).get(sid, ...extra, from, to);
    } catch {
      return false;
    }
  };
  return windows.some(
    ([from, to]) =>
      any(`SELECT 1 FROM usage WHERE student_id = ? AND kind IN (${kinds}) AND created_at >= ? AND created_at <= ? LIMIT 1`, from, to, HELP_KINDS) ||
      any("SELECT 1 FROM messages m JOIN conversations c ON c.id = m.conversation_id WHERE c.student_id = ? AND m.role = 'user' AND m.created_at >= ? AND m.created_at <= ? LIMIT 1", from, to) ||
      any("SELECT 1 FROM tasks WHERE student_id = ? AND answered_at >= ? AND answered_at <= ? LIMIT 1", from, to) ||
      any("SELECT 1 FROM skill_results WHERE student_id = ? AND last_at >= ? AND last_at <= ? LIMIT 1", from, to),
  );
}

/** Stanje preizkusa za zaslon »Pomagaj izboljšati Evklid«. */
export function quizState(db, sid, now = new Date()) {
  migratePilotImpact(db);
  const pre = rowOf(db, sid, "pre");
  const post = rowOf(db, sid, "post");
  const opens = pre?.finished_at ? addDays(pre.finished_at, QUIZ_GAP_DAYS) : null;
  return {
    pre: phaseView(pre),
    post: phaseView(post),
    postOpen: !!opens && now >= opens,
    postOpensAt: opens ? opens.toISOString() : null,
  };
}

// Imetnik računa z znanim datumom rojstva, star vsaj 18 let (starš ali polnoleten učenec). Brez datuma ne vprašamo.
export const adultHolder = (p) => !!p?.birth_date && ageOn(p.birth_date) >= ADULT_AGE;

/** Vprašanje o plačilu za Račun: null, če ni za ta račun (ni v pilotu, ni znano polnoleten, gost). */
export function wtpState(db, parent, { isMember, now = new Date() }) {
  if (!parent || parent.is_guest || !adultHolder(parent)) return null;
  migratePilotImpact(db);
  const kids = db.prepare("SELECT id FROM students WHERE parent_id = ?").all(parent.id).map((r) => r.id);
  const members = kids.filter((id) => isMember(id));
  if (!members.length) return null;
  const done = db.prepare("SELECT pay, amount FROM pilot_wtp WHERE parent_id = ?").get(parent.id);
  if (done) return { open: false, done: true };
  // Začetek pilota za račun: prej od »skrbnik je dodal račun« in »profil je prvič odprl naloge«.
  let start = null;
  try {
    start = db.prepare(`SELECT MIN(joined_at) AS t FROM pilot_state WHERE student_id IN (${members.map(() => "?").join(",")})`).get(...members)?.t;
  } catch {}
  // Prej od obeh: skrbnik je dodal račun (pilot_at) ali profil je prvič odprl naloge (pilotna šola nima pilot_at).
  if (parent.pilot_at && (!start || parent.pilot_at < start)) start = parent.pilot_at;
  if (!start) return { open: false, done: false, opensAt: null };
  const opens = addDays(start, WTP_AFTER_DAYS);
  return { open: now >= opens, done: false, opensAt: opens.toISOString() };
}

// ---------- skrbnik: vsote brez imen ----------
// Vsote v paketih: iz prvih ⌊n/velikost⌋·velikost vrstic po vrsti vnosa (nove se pokažejo šele, ko jih je dovolj).
// Studentov t (dvostranski 95 %) za df prostostnih stopenj; nad 30 se približa 1,96.
const T95 = [12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.16, 2.145, 2.131, 2.12, 2.11, 2.101, 2.093, 2.086, 2.08, 2.074, 2.069, 2.064, 2.06, 2.056, 2.052, 2.048, 2.045, 2.042];
export const tCrit = (df) => (df < 1 ? Infinity : df <= 30 ? T95[df - 1] : df <= 60 ? 2.0 : 1.96);
export const block = (rows, size) => rows.slice(0, Math.floor(rows.length / size) * size);
// Število pod pragom je »< prag« (0 ostane 0), da iz natančnega števila ne sledi, kdo je ravno odgovoril.
export const shownN = (n, min) => (n > 0 && n < min ? `< ${min}` : n);
// Pri plačilu je prag višji (j, 6. 11.): skrbnik pozna vse račune v pilotu.
export const WTP_MIN = 5;

// Wilsonov 95-% interval za delež k/n (zaokrožen na tri decimalke); pri n = 0 null.
export function wilson(k, n, z = 1.96) {
  if (!n) return null;
  const p = k / n;
  const d = 1 + (z * z) / n;
  const c = (p + (z * z) / (2 * n)) / d;
  const h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  return [Math.max(0, Math.round((c - h) * 1000) / 1000), Math.min(1, Math.round((c + h) * 1000) / 1000)];
}

// Teme mesta i (tema sklopa in tema nalog obeh oblik).
const slotTopics = (i) => [...new Set([QUIZ.slots[i].topic, ...QUIZ_FORMS.map((f) => QUIZ.forms[f][i]?.topicId)].filter(Boolean))];

// Ali je učenec temo mesta vadil med `from` in `to`: odgovor na nalogo vadnice te teme (tasks.answered_at), korak pri
// inštruktorju s to temo (events.topic_id) ali vaja drugje (skill_results, po dnevih). Mesto ima samo svojo temo
// (sosednja tema, npr. uporaba odvoda pri mestu »odvod«, ne šteje).
export function practicedTopics(db, sid, from, to) {
  const out = new Set();
  const q = (sql) => {
    try {
      for (const r of db.prepare(sql).all(sid, from, to)) out.add(r.t);
    } catch {}
  };
  q("SELECT DISTINCT topic_id AS t FROM tasks WHERE student_id = ? AND mode IN ('practice', 'review', 'list') AND answered_at >= ? AND answered_at < ?");
  q("SELECT DISTINCT topic_id AS t FROM events WHERE student_id = ? AND topic_id IS NOT NULL AND created_at >= ? AND created_at < ?");
  // Pole mature in NPZ, poskusne pole, »Preveri se« v lekcijah, kviz, kartice, igre, ustno (po dnevih, UTC).
  q("SELECT DISTINCT topic_id AS t FROM skill_results WHERE student_id = ? AND topic_id IS NOT NULL AND day >= substr(?, 1, 10) AND day <= substr(?, 1, 10)");
  return out;
}

// Mesta, katerih temo je učenec vadil med `from` in `to` (zapiše se ob koncu drugega preizkusa).
export const practicedSlots = (db, sid, from, to) => {
  const done = practicedTopics(db, sid, from, to);
  return QUIZ.slots.map((_, i) => i).filter((i) => slotTopics(i).some((t) => done.has(t)));
};

// opts.invited: število članov pilota (profilov), ki lahko rešujejo preizkus; opts.now: za odpadle.
export function impactReport(db, minGroup, { invited = null, now = new Date() } = {}) {
  migratePilotImpact(db);
  const rows = db
    .prepare("SELECT rowid, student_id, phase, score, form, answers, created_at, finished_at, aided, help, practiced FROM pilot_quiz WHERE finished_at IS NOT NULL AND phase IN ('pre', 'post') AND form IS NOT NULL ORDER BY finished_at, rowid")
    .all();
  const pct = (r) => r.score / Math.max(1, parse(r.answers, []).length);
  const avg = (xs) => (xs.length ? Math.round((xs.reduce((s, x) => s + x, 0) / xs.length) * 1000) / 1000 : null);
  // »Ne vem« pri vseh nalogah (-1): preizkus ni meritev znanja, zato ni v povprečjih; prikaže se samo število.
  const allSkip = (r) => parse(r.answers, []).every((a) => a === -1);
  // Paketi: končane preizkuse vzamemo po času konca, LOČENO za vsako obliko (oz. vrstni red), v paketih po minGroup,
  // in jih šele v paketu delimo (samo »Ne vem«, ostali). Skupne vrednosti so unija paketov po oblikah. Tako se vsaka
  // prikazana skupina (skupaj, po obliki, po vrstnem redu, po sklopih) spremeni samo za cel paket ene oblike: iz
  // razlike dveh poročil se ne da izračunati rezultata posameznika (pregled A4 in pregled 2 PR #1123).
  const preAll = rows.filter((r) => r.phase === "pre");
  const postBy = new Map(rows.filter((r) => r.phase === "post").map((r) => [r.student_id, r]));
  const order = new Map(rows.map((r, i) => [r, i])); // vrstni red po času konca
  const pairAll = preAll.filter((r) => postBy.has(r.student_id)).sort((a, b) => order.get(postBy.get(a.student_id)) - order.get(postBy.get(b.student_id)));
  const preBlocks = Object.fromEntries(QUIZ_FORMS.map((f) => [f, block(preAll.filter((r) => r.form === f), minGroup)]));
  const pairBlocks = Object.fromEntries(QUIZ_FORMS.map((f) => [f, block(pairAll.filter((r) => r.form === f), minGroup)]));
  const usable = (r) => !allSkip(r) && !allSkip(postBy.get(r.student_id) || r);
  // Pred in po samo pri istih učencih (sicer bi se primerjali različni ljudje).
  const preOf = (f) => preBlocks[f].filter((r) => !allSkip(r));
  const pairsOf = (f) => pairBlocks[f].filter(usable);
  const pre = QUIZ_FORMS.flatMap(preOf);
  const pairs = QUIZ_FORMS.flatMap(pairsOf);
  const diffOf = (r) => pct(postBy.get(r.student_id)) - pct(r);
  const pairStats = (list) => ({
    pre: avg(list.map(pct)),
    post: avg(list.map((r) => pct(postBy.get(r.student_id)))),
    diff: avg(list.map(diffOf)),
  });
  const byForm = Object.fromEntries(QUIZ_FORMS.map((f) => {
    const g = preOf(f);
    return [f, preBlocks[f].length ? { n: g.length, avg: avg(g.map(pct)) } : null];
  }));
  const byOrder = Object.fromEntries(QUIZ_FORMS.map((f) => {
    const g = pairsOf(f);
    return [`${f}${otherForm(f)}`, pairBlocks[f].length && g.length ? { n: g.length, ...pairStats(g) } : null];
  }));
  // Po sklopih kataloga: delež pravilnih na tem mestu prej in po (isti učenci, oba preizkusa). Opisno (malo učencev).
  const share = (list, i) => avg(list.map((a) => (a[i] === 1 ? 1 : 0)));
  const slots = pairs.length
    ? QUIZ.slots.map((sl, i) => ({
        sklop: sl.sklop,
        pre: share(pairs.map((r) => parse(r.answers, [])), i),
        post: share(pairs.map((r) => parse(postBy.get(r.student_id).answers, [])), i),
      }))
    : null;
  const ps = pairs.length ? pairStats(pairs) : { pre: null, post: null, diff: null };
  // Negotovost: 95-% interval razlike (Studentov t za n − 1 prostostnih stopenj) in razlika kot
  // povprečje obeh vrstnih redov (če osip naredi skupini A→B in B→A neenaki, razlika oblik ne vpliva nanjo).
  let ci95 = null;
  if (pairs.length >= 2) {
    const d = pairs.map(diffOf);
    const m = d.reduce((x, y) => x + y, 0) / d.length;
    const sd = Math.sqrt(d.reduce((x, y) => x + (y - m) ** 2, 0) / (d.length - 1));
    const h = (tCrit(d.length - 1) * sd) / Math.sqrt(d.length);
    ci95 = [Math.round((m - h) * 1000) / 1000, Math.round((m + h) * 1000) / 1000];
  }
  // Glavni izid po konceptu: samo pari, kjer drugi preizkus ni bil s pomočjo (aided ali »Da«), v LASTNIH paketih po
  // minGroup po obliki in času konca (pomoč, vaja in odgovori se zapišejo ob koncu in se ne spreminjajo; pregled 2).
  // Preizkusi pred to različico (aided NULL) štejejo kot brez zapisa pomoči.
  const helped = (r) => r.aided === 1 || r.help === "yes";
  const soloAll = pairAll.filter((r) => usable(r) && !helped(postBy.get(r.student_id)));
  const solo = QUIZ_FORMS.flatMap((f) => block(soloAll.filter((r) => r.form === f), minGroup));
  // [napačno ali »Ne vem« prvič, od tega pravilno drugič, kandidati v skupini]
  const cnt = { all: [0, 0, new Set()], practiced: [0, 0, new Set()], notPracticed: [0, 0, new Set()] };
  const gaps = [];
  for (const r of solo) {
    const p = postBy.get(r.student_id);
    const a = parse(r.answers, []);
    const b = parse(p.answers, []);
    const done = new Set(parse(p.practiced, null) || []);
    gaps.push((sqlDate(p.finished_at) - sqlDate(r.finished_at)) / 864e5);
    QUIZ.slots.forEach((_, i) => {
      if (a[i] === 1) return;
      for (const g of [cnt.all, cnt[done.has(i) ? "practiced" : "notPracticed"]]) {
        g[0]++;
        if (b[i] === 1) g[1]++;
        g[2].add(r.student_id);
      }
    });
  }
  // Skupina »vadil« ali »ni vadil« se pokaže šele z vsaj minGroup kandidati (sicer bi lahko opisala enega človeka), delež
  // in interval šele od MIN_ITEMS nalog naprej (pregled 3).
  const outcome = ([n, k, who]) =>
    who.size < minGroup
      ? { hidden: true, candidates: shownN(who.size, minGroup) }
      : { candidates: who.size, n, improved: k, share: n >= MIN_ITEMS ? Math.round((k / n) * 1000) / 1000 : null, ci95: n >= MIN_ITEMS ? wilson(k, n) : null };
  const median = (xs) => {
    const v = [...xs].sort((x, y) => x - y);
    return v.length ? Math.round((v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2) * 10) / 10 : null;
  };
  const concept = solo.length
    ? { candidates: solo.length, gapDays: median(gaps), all: outcome(cnt.all), practiced: outcome(cnt.practiced), notPracticed: outcome(cnt.notPracticed) }
    : null;
  // Potek: začeli (prvi preizkus odprt), končali prvega, oba, odpadli (drugega niso končali ODPAD_DAYS dni po odprtju) in
  // tisti, ki še lahko končajo. Vsa števila pod pragom kot »< prag«.
  const started = db.prepare("SELECT COUNT(*) AS n FROM pilot_quiz WHERE phase = 'pre' AND form IS NOT NULL").get().n;
  const postDone = new Set(rows.filter((r) => r.phase === "post").map((r) => r.student_id));
  let dropped = 0;
  let waiting = 0;
  for (const r of preAll) {
    if (postDone.has(r.student_id)) continue;
    if (now >= addDays(r.finished_at, QUIZ_GAP_DAYS + ODPAD_DAYS)) dropped++;
    else waiting++;
  }
  const orders = Object.values(byOrder);
  const diffBalanced = orders.every(Boolean) ? Math.round(((orders[0].diff + orders[1].diff) / 2) * 1000) / 1000 : null;
  // Natančno je samo skupno število; štetja po skupinah so samo znotraj paketov.
  const quiz = {
    version: QUIZ.version,
    total: QUIZ_LEN,
    nPre: shownN(preAll.length, minGroup),
    nPaired: shownN(pairAll.length, minGroup),
    shownPre: pre.length,
    shownPaired: pairs.length,
    pre: avg(pre.map(pct)),
    pairedPre: ps.pre,
    pairedPost: ps.post,
    diff: ps.diff,
    ci95,
    diffBalanced,
    byForm,
    byOrder,
    slots,
    invited: invited == null ? null : shownN(invited, minGroup),
    started: shownN(started, minGroup),
    dropped: shownN(dropped, minGroup),
    waiting: shownN(waiting, minGroup),
    dropDays: ODPAD_DAYS,
    // Pari, kjer je bil drugi preizkus s pomočjo (niso v glavnem izidu); pod pragom »< prag«.
    helped: shownN(pairAll.filter((r) => helped(postBy.get(r.student_id))).length, minGroup),
    helpedAuto: shownN(pairAll.filter((r) => postBy.get(r.student_id).aided === 1).length, minGroup),
    helpedSelf: shownN(pairAll.filter((r) => postBy.get(r.student_id).help === "yes").length, minGroup),
    // Pari, kjer je bil s pomočjo PRVI preizkus (ostanejo v izidu; nižji imenovalec »napačno prvič«).
    helpedPre: shownN(pairAll.filter(helped).length, minGroup),
    concept,
    allSkip: QUIZ_FORMS.reduce((n, f) => n + preBlocks[f].filter(allSkip).length + pairBlocks[f].filter((r) => !allSkip(r) && allSkip(postBy.get(r.student_id))).length, 0),
  };
  let wtp = { n: 0, shown: 0, min: WTP_MIN, pay: null, amount: null };
  try {
    const all = db.prepare("SELECT pay, amount FROM pilot_wtp ORDER BY created_at, parent_id").all();
    const w = block(all, WTP_MIN);
    wtp = {
      n: shownN(all.length, WTP_MIN),
      shown: w.length,
      min: WTP_MIN,
      pay: w.length ? Object.fromEntries(WTP_PAY.map((k) => [k, w.filter((r) => r.pay === k).length])) : null,
      amount: w.length ? Object.fromEntries(WTP_AMOUNT.map((k) => [k, w.filter((r) => r.amount === k).length])) : null,
    };
  } catch {}
  return { quiz, wtp };
}

// ---------- API ----------
// member(req, res) → učenec v pilotu ali null (odgovor je že poslan); reward(sid, item, xp) → dobljeni XP.
export function mountPilotImpact(app, db, { member, reward, reply, accounts, isMember, confirmOwner = async () => false }) {
  migratePilotImpact(db);

  const publicQuiz = (row) => {
    const v = phaseView(row);
    if (v.done || !v.started) return v;
    const t = taskOf(row, v.index);
    return { ...v, task: t ? publicTask(t) : null };
  };

  // Začni (ali nadaljuj) preizkus: { phase: "pre" | "post" }
  app.post("/api/students/:id/pilot/quiz", (req, res) => {
    const s = member(req, res);
    if (!s) return;
    const phase = req.body?.phase;
    if (!PHASES.includes(phase)) return res.status(400).json({ error: "Napačna zahteva." });
    let row = rowOf(db, s.id, phase);
    if (!row) {
      let form;
      if (phase === "post") {
        const st = quizState(db, s.id);
        if (!st.postOpen) return res.status(409).json({ error: "Drugi preizkus še ni odprt." });
        form = otherForm(rowOf(db, s.id, "pre").form); // vzporedna oblika
      } else form = firstForm(db);
      const items = QUIZ.slots.map((_, i) => i);
      db.prepare("INSERT OR IGNORE INTO pilot_quiz (student_id, phase, topic_id, items, answers, form) VALUES (?, ?, ?, ?, ?, ?)").run(
        s.id,
        phase,
        QUIZ.version,
        JSON.stringify(items),
        JSON.stringify(items.map(() => null)),
        form,
      );
      row = rowOf(db, s.id, phase);
    }
    res.json({ run: publicQuiz(row) });
  });

  // Odgovor na trenutno nalogo: { phase, index, answer } ali { phase, index, skip: true } (»Ne vem«).
  app.post("/api/students/:id/pilot/quiz/answer", (req, res) => {
    const s = member(req, res);
    if (!s) return;
    const b = req.body || {};
    const row = PHASES.includes(b.phase) ? rowOf(db, s.id, b.phase) : null;
    if (!row) return res.status(400).json({ error: "Napačna zahteva." });
    if (row.finished_at) return res.status(409).json({ error: "Ta preizkus je že končan." });
    const answers = parse(row.answers, []);
    const i = answers.findIndex((a) => a == null);
    // Odgovor velja samo za nalogo, ki je na vrsti (dvojni klik ali stari zavihek ne prepiše drugega odgovora).
    if (b.index !== i) return res.status(409).json({ error: "Ta naloga je že zaključena." });
    const task = taskOf(row, i);
    if (!task) return res.status(409).json({ error: "Ta naloga ni več na voljo." });
    let ok = false;
    if (b.skip !== true) {
      const input = typeof b.answer === "string" || typeof b.answer === "number" ? String(b.answer).slice(0, 200) : "";
      const opts = { find: task.data?.find, text: task.text, math: MATH };
      let r = checkAnswer(task.answer, input, opts);
      if (r.kind === "unit" && r.code === "chk.addUnit" && task.answer.unit) r = checkAnswer(task.answer, `${input} ${task.answer.unit}`, opts);
      // Napaka v zapisu ni odgovor: učenec popravi (kot v kvizu).
      if (r.kind === "format" || r.kind === "unit") return res.status(422).json({ retry: true, code: r.code, params: r.params, message: r.message });
      ok = r.kind === "correct" || r.kind === "rounding" || r.kind === "simplify";
    }
    answers[i] = b.skip === true ? -1 : ok ? 1 : 0; // -1 = »Ne vem« (šteje kot nepravilno, a ločeno od napačnega)
    // Po zadnji nalogi preizkus še ni končan: konča ga odgovor na vprašanje o pomoči (/quiz/help).
    const times = parse(row.times, null) || [];
    times[i] = sqlTimeOf(new Date());
    const n = db
      .prepare("UPDATE pilot_quiz SET answers = ?, times = ? WHERE student_id = ? AND phase = ? AND answers = ? AND finished_at IS NULL")
      .run(JSON.stringify(answers), JSON.stringify(times), s.id, b.phase, row.answers).changes;
    if (!n) return res.status(409).json({ error: "Ta naloga je že zaključena." });
    reply(res, s, 0, { run: publicQuiz(rowOf(db, s.id, b.phase)) });
  });

  // Konec preizkusa: »Si pri kateri nalogi uporabil pomoč?« { phase, help: "yes" | "no" }, ko so odgovorjene vse naloge.
  // Šele zdaj: rezultat, čas konca, zapis pomoči (aided), pri drugem preizkusu vadena mesta, XP (enkrat na fazo).
  app.post("/api/students/:id/pilot/quiz/help", (req, res) => {
    const s = member(req, res);
    if (!s) return;
    const b = req.body || {};
    if (!PHASES.includes(b.phase) || !QUIZ_HELP.includes(b.help)) return res.status(400).json({ error: "Napačna zahteva." });
    const row = rowOf(db, s.id, b.phase);
    if (!row) return res.status(400).json({ error: "Napačna zahteva." });
    if (row.finished_at) return res.status(409).json({ error: "Ta preizkus je že končan." });
    const answers = parse(row.answers, []);
    if (!answers.length || answers.some((a) => a == null)) return res.status(409).json({ error: "Najprej odgovori na vse naloge." });
    const score = answers.filter((a) => a === 1).length;
    const aided = aidedDuring(db, s.id, helpWindows(row.created_at, parse(row.times, null) || [])) ? 1 : 0;
    const pre = b.phase === "post" ? rowOf(db, s.id, "pre") : null;
    const practiced = pre?.finished_at ? JSON.stringify(practicedSlots(db, s.id, pre.finished_at, row.created_at)) : null;
    const n = db
      .prepare("UPDATE pilot_quiz SET help = ?, score = ?, aided = ?, practiced = ?, finished_at = datetime('now') WHERE student_id = ? AND phase = ? AND finished_at IS NULL AND answers = ?")
      .run(b.help, score, aided, practiced, s.id, b.phase, row.answers).changes;
    if (!n) return res.status(409).json({ error: "Ta preizkus je že končan." });
    // XP samo za opravljen preizkus, enkrat na fazo (ne za rezultat).
    reply(res, s, reward(s.id, `quiz:${b.phase}`), { run: publicQuiz(rowOf(db, s.id, b.phase)) });
  });

  // Vprašanje o plačilu (Račun, samo lastnik računa, z geslom računa): { pay, amount?, password }
  // Geslo: zaklep računa je privzeto izklopljen, zato bi odgovor sicer lahko oddal otrok na starševi napravi (B3).
  app.post("/api/account/pilot-wtp", async (req, res) => {
    if (!accounts || !req.parent) return res.status(404).json({ error: "Ne obstaja." });
    const p = req.parent;
    const st = wtpState(db, p, { isMember });
    if (!st) return res.status(403).json({ error: "Vprašanje je samo za člane pilota." });
    if (st.done) return res.status(409).json({ error: "Odgovor je že shranjen." });
    if (!st.open) return res.status(409).json({ error: "Vprašanje še ni odprto." });
    const pay = req.body?.pay;
    if (!WTP_PAY.includes(pay)) return res.status(400).json({ error: "Izberi odgovor." });
    const needAmount = pay === "yes" || pay === "maybe";
    const amount = needAmount ? req.body?.amount : null;
    if (needAmount && !WTP_AMOUNT.includes(amount)) return res.status(400).json({ error: "Izberi znesek." });
    const owner = await confirmOwner(req);
    if (owner === "throttled") return res.status(429).json({ error: "Preveč poskusov. Poskusi čez eno uro." });
    if (!owner) return res.status(401).json({ error: "Napačno geslo.", password: true });
    db.prepare("INSERT OR IGNORE INTO pilot_wtp (parent_id, pay, amount) VALUES (?, ?, ?)").run(p.id, pay, amount);
    res.json({ wtp: wtpState(db, p, { isMember }) });
  });
}
