// Merjenje učinka v pilotu (j, 6. 11. 16:0x): kratek preizkus znanja na začetku in čez 14 dni ter vprašanje za starše
// (in polnoletne imetnike računa), ali bi za Evklid plačali. Del »Pomagaj izboljšati Evklid« (server/pilot-naloge.js).
//
// Preizkus znanja: 6 nalog iz obstoječih generatorjev vadnice (server/practice), iz teme, ki se jo bo učenec učil
// NASLEDNJO na svoji poti (še ni začeta, sicer še ni osvojena; nikoli osvojena), 2 lažji, 2 srednji, 2 težji (j, 6. 11.).
// Kdor prvič reši vseh 6, takoj dobi še 3 težje naloge (raven 3 iz naslednje teme na poti, sicer iz iste) – brez tega
// bi bil na stropu in napredka ne bi videli. Čez 14 dni ISTA sestava (z dodatnimi nalogami, če jih je imel), nove
// naloge (druga semena). Skrbnik vidi primere s stropom (6/6 prvič) posebej, da ne popačijo povprečij.
// Oceni koda (checkAnswer kot v kvizu), brez AI. En odgovor na nalogo, »Ne vem« šteje kot napačno. XP samo za
// opravljen preizkus (enkrat na fazo), nikoli za rezultat; izid ne vpliva na napredek, ravni ali lige.
//
// Plačilo: enkrat, 14 dni po začetku pilota; »Ali bi plačal?« (Da / Mogoče / Ne / Raje ne povem) in pri Da ali Mogoče
// še »Koliko na mesec?« (razponi v evrih ali Raje ne povem). Brez XP.
//
// Skrbnik vidi samo vsote brez imen in šele od MIN_GROUP odgovorov (povprečje pred in po, razlika pri istih učencih,
// porazdelitev odgovorov o plačilu). Izvoz GDPR: tabeli imata student_id/parent_id (zasebnost.js exportOtherTables),
// izbris profila ali računa ju pobriše (ON DELETE CASCADE).
import { generateTask, publicTask } from "./practice/index.js";
import { checkAnswer } from "./practice/check.js";
import { ageOn, ADULT_AGE } from "./accounts/age.js";

export const QUIZ_LEVELS = [1, 1, 2, 2, 3, 3];
export const QUIZ_EXTRA = [3, 3, 3]; // ob 6/6 v prvem preizkusu
export const QUIZ_GAP_DAYS = 14;
export const WTP_AFTER_DAYS = 14;
export const WTP_PAY = ["yes", "maybe", "no", "skip"];
export const WTP_AMOUNT = ["lt5", "5to10", "10to15", "15to20", "gt20", "skip"];
const PHASES = ["pre", "post"];
const ANSWER_TYPES = ["number", "fraction", "choice"]; // eno polje ali gumbi (brez koeficientov in slik)

export function migratePilotImpact(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pilot_quiz (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      phase TEXT NOT NULL,           -- pre | post
      topic_id TEXT NOT NULL,
      items TEXT NOT NULL,           -- JSON [{ seed, level, topic? }] (topic: dodatna naloga iz druge teme)
      answers TEXT NOT NULL,         -- JSON [1 | 0 | -1 | null] (-1 = »Ne vem«, null = še brez odgovora)
      score INTEGER,                 -- pravilnih, ko je preizkus končan
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      finished_at TEXT,
      PRIMARY KEY (student_id, phase)
    );
  `);
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

// Naloga preizkusa iz semena (ista naloga ob vsakem klicu).
const taskOf = (row, i, lang) => {
  const it = parse(row.items, [])[i];
  return it ? generateTask(it.topic || row.topic_id, it.level, it.seed, lang) : null;
};

// Semena za nalogo, ki jo vmesnik pokaže v enem polju ali z gumbi, brez slike in brez ponovitve besedila.
function pickItems(topicId, lang, levels = QUIZ_LEVELS, { tag = false, rand = () => Math.floor(Math.random() * 2 ** 31) } = {}) {
  const seen = new Set();
  const items = [];
  for (const level of levels) {
    let found = null;
    for (let k = 0; k < 40 && !found; k++) {
      const seed = rand();
      let t;
      try {
        t = generateTask(topicId, level, seed, lang);
      } catch {
        continue;
      }
      if (!t || t.figure || !ANSWER_TYPES.includes(t.answer?.type) || seen.has(t.text)) continue;
      seen.add(t.text);
      found = tag ? { seed, level, topic: topicId } : { seed, level };
    }
    if (!found) return null;
    items.push(found);
  }
  return items;
}

// Dodatne naloge (ob 6/6): iz naslednje teme, sicer iz iste; vrne null, če jih ni mogoče sestaviti.
const extraItems = (topicId, nextId, lang) => (nextId && pickItems(nextId, lang, QUIZ_EXTRA, { tag: true })) || pickItems(topicId, lang, QUIZ_EXTRA, { tag: true });
const isCeiling = (row) => parse(row.items, []).length > QUIZ_LEVELS.length;

const phaseView = (row) => {
  if (!row) return { started: false, done: false };
  const answers = parse(row.answers, []);
  const done = row.finished_at != null;
  return { started: true, done, index: answers.filter((a) => a != null).length, total: answers.length, harder: isCeiling(row), ...(done ? { score: row.score } : {}) };
};

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
export const block = (rows, size) => rows.slice(0, Math.floor(rows.length / size) * size);
// Število pod pragom je »< prag« (0 ostane 0), da iz natančnega števila ne sledi, kdo je ravno odgovoril.
export const shownN = (n, min) => (n > 0 && n < min ? `< ${min}` : n);
// Pri plačilu je prag višji (j, 6. 11.): skrbnik pozna vse račune v pilotu.
export const WTP_MIN = 5;

export function impactReport(db, minGroup) {
  migratePilotImpact(db);
  const rows = db.prepare("SELECT rowid, student_id, phase, score, items, answers, finished_at FROM pilot_quiz WHERE finished_at IS NOT NULL ORDER BY finished_at, rowid").all();
  const pct = (r) => r.score / Math.max(1, parse(r.answers, []).length);
  const avg = (xs) => Math.round((xs.reduce((s, x) => s + x, 0) / xs.length) * 1000) / 1000;
  // »Ne vem« pri vseh nalogah (-1): preizkus ni meritev znanja, zato ni v povprečjih; prikaže se samo število.
  const allSkip = (r) => parse(r.answers, []).every((a) => a === -1);
  const valid = rows.filter((r) => !allSkip(r));
  const postBy = new Map(valid.filter((r) => r.phase === "post").map((r) => [r.student_id, r]));
  // Pred in po samo pri istih učencih (sicer bi se primerjali različni ljudje). Strop (6/6 prvič, z dodatnimi težjimi
  // nalogami) posebej: drugače bi njihov visok začetek in drugačna sestava popačila povprečje ostalih.
  const group = (pre) => {
    const shownPre = block(pre, minGroup);
    const pairs = block(
      pre.filter((r) => postBy.has(r.student_id)).sort((a, b) => postBy.get(a.student_id).rowid - postBy.get(b.student_id).rowid || 0),
      minGroup,
    ).map((r) => [pct(r), pct(postBy.get(r.student_id))]);
    const nPaired = pre.filter((r) => postBy.has(r.student_id)).length;
    return {
      nPre: shownN(pre.length, minGroup),
      nPaired: shownN(nPaired, minGroup),
      shownPre: shownPre.length,
      shownPaired: pairs.length,
      pre: shownPre.length ? avg(shownPre.map(pct)) : null,
      pairedPre: pairs.length ? avg(pairs.map((p) => p[0])) : null,
      pairedPost: pairs.length ? avg(pairs.map((p) => p[1])) : null,
      diff: pairs.length ? avg(pairs.map((p) => p[1] - p[0])) : null,
    };
  };
  const pre = valid.filter((r) => r.phase === "pre");
  const quiz = { ...group(pre.filter((r) => !isCeiling(r))), ceiling: group(pre.filter(isCeiling)), allSkip: rows.filter(allSkip).length };
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
export function mountPilotImpact(app, db, { member, reward, reply, topicFor, nextTopicFor = () => null, langFor, accounts, isMember, confirmOwner = async () => false }) {
  migratePilotImpact(db);

  const publicQuiz = (row, lang) => {
    const v = phaseView(row);
    if (v.done || !v.started) return v;
    const t = taskOf(row, v.index, lang);
    return { ...v, task: t ? publicTask(t) : null };
  };

  // Začni (ali nadaljuj) preizkus: { phase: "pre" | "post" }
  app.post("/api/students/:id/pilot/quiz", (req, res) => {
    const s = member(req, res);
    if (!s) return;
    const phase = req.body?.phase;
    if (!PHASES.includes(phase)) return res.status(400).json({ error: "Napačna zahteva." });
    const lang = langFor(s.id);
    let row = rowOf(db, s.id, phase);
    if (!row) {
      let topic;
      let items;
      if (phase === "post") {
        const st = quizState(db, s.id);
        if (!st.postOpen) return res.status(409).json({ error: "Drugi preizkus še ni odprt." });
        const pre = rowOf(db, s.id, "pre");
        topic = pre.topic_id; // ista tema kot na začetku
        // Ista sestava kot prvič: kdor je imel dodatne težje naloge, jih ima tudi zdaj (iz iste teme kot takrat).
        const extraTopic = parse(pre.items, [])[QUIZ_LEVELS.length]?.topic;
        const base = pickItems(topic, lang);
        const extra = extraTopic ? pickItems(extraTopic, lang, QUIZ_EXTRA, { tag: true }) : [];
        items = base && extra ? [...base, ...extra] : null;
      } else {
        topic = topicFor(s);
        items = topic ? pickItems(topic, lang) : null;
      }
      if (!items) return res.status(409).json({ error: "Za tvojo pot preizkusa še ni.", unavailable: true });
      db.prepare("INSERT OR IGNORE INTO pilot_quiz (student_id, phase, topic_id, items, answers) VALUES (?, ?, ?, ?, ?)").run(
        s.id,
        phase,
        topic,
        JSON.stringify(items),
        JSON.stringify(items.map(() => null)),
      );
      row = rowOf(db, s.id, phase);
    }
    res.json({ run: publicQuiz(row, lang) });
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
    const lang = langFor(s.id);
    const task = taskOf(row, i, lang);
    if (!task) return res.status(409).json({ error: "Ta naloga ni več na voljo." });
    let ok = false;
    if (b.skip !== true) {
      const input = typeof b.answer === "string" || typeof b.answer === "number" ? String(b.answer).slice(0, 200) : "";
      let r = checkAnswer(task.answer, input);
      if (r.kind === "unit" && r.code === "chk.addUnit" && task.answer.unit) r = checkAnswer(task.answer, `${input} ${task.answer.unit}`);
      // Napaka v zapisu ni odgovor: učenec popravi (kot v kvizu).
      if (r.kind === "format" || r.kind === "unit") return res.status(422).json({ retry: true, code: r.code, params: r.params, message: r.message });
      ok = r.kind === "correct" || r.kind === "rounding" || r.kind === "simplify";
    }
    answers[i] = b.skip === true ? -1 : ok ? 1 : 0; // -1 = »Ne vem« (šteje kot nepravilno, a ločeno od napačnega)
    let last = answers.every((a) => a != null);
    const score = answers.filter((a) => a === 1).length;
    let items = row.items;
    // Strop: prvi preizkus brez napake → takoj še 3 težje naloge (enkrat), da drugi preizkus lahko pokaže napredek.
    if (last && b.phase === "pre" && answers.length === QUIZ_LEVELS.length && score === QUIZ_LEVELS.length) {
      const extra = extraItems(row.topic_id, nextTopicFor(s, row.topic_id), lang);
      if (extra) {
        items = JSON.stringify([...parse(row.items, []), ...extra]);
        answers.push(...extra.map(() => null));
        last = false;
      }
    }
    const n = db
      .prepare(`UPDATE pilot_quiz SET items = ?, answers = ?${last ? ", score = ?, finished_at = datetime('now')" : ""} WHERE student_id = ? AND phase = ? AND answers = ?`)
      .run(...[items, JSON.stringify(answers), ...(last ? [score] : []), s.id, b.phase, row.answers]).changes;
    if (!n) return res.status(409).json({ error: "Ta naloga je že zaključena." });
    // XP samo za opravljen preizkus, enkrat na fazo (ne za rezultat).
    const gained = last ? reward(s.id, `quiz:${b.phase}`) : 0;
    reply(res, s, gained, { run: publicQuiz(rowOf(db, s.id, b.phase), lang) });
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
