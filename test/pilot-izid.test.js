// Meritev uspeha pilota do konca (j 26. 11. 2026, pregled pripravljenosti pilota, poseg 3; server/pilot-ucinek.js):
// - »brez pomoči«: navodilo, vprašanje ob koncu (enkrat, Da/Ne), zapis, ali je kandidat med preizkusom uporabil
//   inštruktorja ali skener (usage ali sporočilo inštruktorju);
// - poročilo: povabljeni, začeli, končali, pari, odpadli (drugega ni končal 7 dni po odprtju), še čakajo;
// - glavni izid po konceptu: napačno prvič → pravilno drugič brez pomoči, ločeno vadil / ni vadil, z imenovalcem in
//   Wilsonovim intervalom; samo iz paketov po 5 (zasebnost), drugi preizkus s pomočjo izločen.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { exportOtherTables } from "../server/zasebnost.js";
import { pilotTasksReport, pilotTasksMarkdown } from "../server/pilot-naloge.js";
import { QUIZ, QUIZ_GAP_DAYS, ODPAD_DAYS, impactReport, wilson, aidedSince } from "../server/pilot-ucinek.js";
import { PRAG } from "../server/pilot-meritve.js";
import { rightInput } from "../scripts/pilot-preizkus.js";
import SL from "../public/i18n/sl.js";
import fs from "node:fs";

const quiet = { error() {}, warn() {}, info() {}, log() {} };

async function withServer(fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: quiet });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, o = {}) => {
    const res = await fetch(base + path, { method: o.method || "GET", headers: { "Content-Type": "application/json" }, body: o.body ? JSON.stringify(o.body) : undefined });
    return { status: res.status, body: await res.json().catch(() => null) };
  };
  const warn = console.warn;
  console.warn = () => {};
  try {
    await fn({ call, db: store.db });
  } finally {
    console.warn = warn;
    server.close();
  }
}

const quizRow = (db, sid, phase) => db.prepare("SELECT * FROM pilot_quiz WHERE student_id = ? AND phase = ?").get(sid, phase);

async function finish(call, db, sid, phase, before = () => {}) {
  await call(`/api/students/${sid}/pilot/quiz`, { method: "POST", body: { phase } });
  before();
  const row = quizRow(db, sid, phase);
  let out;
  for (let i = 0; i < 12; i++) {
    const t = QUIZ.forms[row.form][i];
    out = await call(`/api/students/${sid}/pilot/quiz/answer`, { method: "POST", body: { phase, index: i, answer: rightInput(t) } });
    assert.equal(out.status, 200, JSON.stringify(out.body));
  }
  return out.body;
}

test("brez pomoči: ob koncu zapis uporabe inštruktorja ali skenerja, vprašanje enkrat (Da/Ne), v izvozu", async () => {
  process.env.EVKLID_PILOT_VSI = "1";
  try {
    await withServer(async ({ call, db }) => {
      const mk = async (name) => (await call("/api/students", { method: "POST", body: { name, settings: { curriculum_level: "4. letnik" } } })).body.id;
      const a = await mk("Ana");
      const b = await mk("Bor");
      const c = await mk("Cene");
      // Pred koncem: vprašanje o pomoči ni mogoče.
      await call(`/api/students/${a}/pilot/quiz`, { method: "POST", body: { phase: "pre" } });
      assert.equal((await call(`/api/students/${a}/pilot/quiz/help`, { method: "POST", body: { phase: "pre", help: "no" } })).status, 409);
      // Uporaba AI pred začetkom preizkusa ne šteje.
      db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, created_at) VALUES (?, 'x', 'chat', 0, datetime('now', '-1 day'))").run(a);
      let body = await finish(call, db, a, "pre");
      assert.equal(body.run.done, true);
      assert.equal(body.run.askHelp, true);
      assert.equal(body.quiz.pre.askHelp, true, "stanje za zaslon pove, da vprašanje čaka");
      assert.equal(quizRow(db, a, "pre").aided, 0);
      assert.equal((await call(`/api/students/${a}/pilot/quiz/help`, { method: "POST", body: { phase: "pre", help: "mogoče" } })).status, 400);
      const h = await call(`/api/students/${a}/pilot/quiz/help`, { method: "POST", body: { phase: "pre", help: "no" } });
      assert.equal(h.status, 200);
      assert.equal(h.body.run.askHelp, false);
      assert.equal(quizRow(db, a, "pre").help, "no");
      assert.equal((await call(`/api/students/${a}/pilot/quiz/help`, { method: "POST", body: { phase: "pre", help: "yes" } })).status, 409, "samo enkrat");
      assert.equal(quizRow(db, a, "pre").help, "no");
      assert.equal((await call(`/api/students/${a}/pilot`)).body.quiz.pre.askHelp, false);
      // Skener (vrstica v usage) med preizkusom → aided.
      body = await finish(call, db, b, "pre", () => db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'x', 'skeniranje', 0.01)").run(b));
      assert.equal(quizRow(db, b, "pre").aided, 1);
      // Sporočilo inštruktorju med preizkusom (tudi brez zapisa porabe) → aided.
      body = await finish(call, db, c, "pre", () => {
        const conv = Number(db.prepare("INSERT INTO conversations (student_id) VALUES (?)").run(c).lastInsertRowid);
        db.prepare("INSERT INTO messages (conversation_id, role, api_content, display_text) VALUES (?, 'user', '\"x\"', 'x')").run(conv);
      });
      assert.equal(quizRow(db, c, "pre").aided, 1);
      assert.equal(aidedSince(db, a, "2999-01-01 00:00:00"), false);
      // Izvoz GDPR vsebuje oba nova podatka.
      const exp = exportOtherTables(db, { studentIds: [a] }).pilot_quiz[0];
      assert.equal(exp.aided, 0);
      assert.equal(exp.help, "no");
    });
  } finally {
    delete process.env.EVKLID_PILOT_VSI;
  }
});

test("Wilsonov interval", () => {
  assert.equal(wilson(0, 0), null);
  assert.deepEqual(wilson(5, 10), [0.237, 0.763]);
  assert.deepEqual(wilson(9, 27), [0.186, 0.522]);
  assert.deepEqual(wilson(0, 3), [0, 0.562]);
  assert.deepEqual(wilson(3, 3), [0.438, 1]);
});

// Poročilo na lokalnih preizkusnih podatkih: povabljeni, začeli, končali, pari, odpadli, čakajo, izid po konceptu.
test("poročilo: potek pilota in glavni izid po konceptu (vadil / ni vadil), samo iz paketov po 5 in brez pomoči", () => {
  const db = openDb(":memory:").db;
  impactReport(db, PRAG); // ustvari tabele
  const ids = Array.from({ length: 16 }, (_, i) => Number(db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run(`U${i}`).lastInsertRowid));
  const ans = (right) => JSON.stringify(Array.from({ length: 12 }, (_, i) => (right.includes(i) ? 1 : 0)));
  const row = (sid, phase, form, right, created, finished, extra = {}) =>
    db
      .prepare("INSERT INTO pilot_quiz (student_id, phase, topic_id, items, answers, score, created_at, finished_at, form, aided, help) VALUES (?, ?, ?, '[]', ?, ?, ?, ?, ?, ?, ?)")
      .run(sid, phase, QUIZ.version, ans(right), finished ? right.length : null, created, finished, form, extra.aided ?? 0, extra.help ?? null);
  const now = new Date("2026-11-26T12:00:00Z");
  // 0–4: A nato B, prej pravilno mesta 0–2, po 14 dneh mesta 0–5. 3 je med drugim uporabil skener, 4 je rekel »Da«.
  for (let i = 0; i < 5; i++) {
    row(ids[i], "pre", "A", [0, 1, 2], "2026-11-01 09:00:00", `2026-11-01 10:00:0${i}`);
    row(ids[i], "post", "B", [0, 1, 2, 3, 4, 5], "2026-11-16 10:00:00", `2026-11-16 10:30:0${i}`, i === 3 ? { aided: 1 } : i === 4 ? { help: "yes" } : { help: "no" });
  }
  // Vaja med preizkusoma: 0 naloga vadnice teme mesta 3, 1 korak pri inštruktorju s temo mesta 4; 2 tema mesta 6 še
  // pred prvim preizkusom (ne šteje), naloga brez odgovora ne šteje.
  const task = (sid, topic, at) => db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, answered_at) VALUES (?, ?, 1, '{}', ?)").run(sid, topic, at);
  task(ids[0], QUIZ.slots[3].topic, "2026-11-05 12:00:00");
  db.prepare("INSERT INTO events (student_id, topic_id, created_at) VALUES (?, ?, '2026-11-06 12:00:00')").run(ids[1], QUIZ.slots[4].topic);
  task(ids[2], QUIZ.slots[6].topic, "2026-10-30 12:00:00");
  task(ids[2], QUIZ.slots[7].topic, null);
  // 5 je začel in ni končal; 6–10 so končali prvega 1. 11. in drugega niso (odpadli: 25 dni > 14 + 7);
  // 11–15 so končali prvega 20. 11. (drugi se odpre 4. 12., še čakajo).
  row(ids[5], "pre", "B", [], "2026-11-02 09:00:00", null);
  for (let i = 6; i < 11; i++) row(ids[i], "pre", "B", [0], "2026-11-01 09:00:00", `2026-11-01 11:00:0${i - 6}`);
  for (let i = 11; i < 16; i++) row(ids[i], "pre", "B", [0], "2026-11-20 09:00:00", `2026-11-20 11:00:0${i - 11}`);

  const q = impactReport(db, PRAG, { invited: 20, now }).quiz;
  assert.equal(q.invited, 20);
  assert.equal(q.started, 16);
  assert.equal(q.nPre, 15);
  assert.equal(q.nPaired, 5);
  assert.equal(q.dropped, 5);
  assert.equal(q.waiting, 5);
  assert.equal(q.dropDays, ODPAD_DAYS);
  assert.equal(q.helped, 2, "drugi preizkus s pomočjo (skener ali »Da«) ni v glavnem izidu");
  assert.equal(q.concept.candidates, 3);
  // 0: mesto 3 vadil (napačno → pravilno), 8 nevadenih napačnih, od tega 2 pravilno (4, 5); 1 enako z mestom 4;
  // 2: nič vadil (vaja pred prvim preizkusom ne šteje), 9 napačnih, 3 pravilno.
  assert.deepEqual(q.concept.practiced, { n: 2, improved: 2, share: 1, ci95: wilson(2, 2) });
  assert.deepEqual(q.concept.notPracticed, { n: 25, improved: 7, share: 0.28, ci95: wilson(7, 25) });
  assert.deepEqual(q.concept.all, { n: 27, improved: 9, share: 0.333, ci95: [0.186, 0.522] });
  // Pod pragom: števila kot »< 5«, izid po konceptu šele s paketom parov.
  const few = impactReport(db, PRAG, { invited: 3, now: new Date("2026-11-21T00:00:00Z") }).quiz;
  assert.equal(few.invited, "< 5");
  assert.equal(few.dropped, 0, "pred iztekom roka nihče ni odpadel");
  assert.equal(few.waiting, 10);
  db.prepare("DELETE FROM pilot_quiz WHERE student_id = ? AND phase = 'post'").run(ids[0]);
  const four = impactReport(db, PRAG, { now }).quiz;
  assert.equal(four.nPaired, "< 5");
  assert.equal(four.concept, null);
  assert.equal(four.helped, 0);
  assert.equal(four.invited, null, "brez podatka o povabljenih");
});

test("poročilo skrbnika in jutranji povzetek pokažeta potek in izid po konceptu", () => {
  process.env.EVKLID_PILOT_VSI = "1";
  try {
    const db = openDb(":memory:").db;
    impactReport(db, PRAG);
    const ids = Array.from({ length: 5 }, (_, i) => Number(db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run(`U${i}`).lastInsertRowid));
    const ans = (right) => JSON.stringify(Array.from({ length: 12 }, (_, i) => (right.includes(i) ? 1 : 0)));
    for (const [i, sid] of ids.entries()) {
      db.prepare("INSERT INTO pilot_quiz (student_id, phase, topic_id, items, answers, score, created_at, finished_at, form, aided) VALUES (?, 'pre', ?, '[]', ?, 3, datetime('now', '-20 days'), datetime('now', '-20 days', ?), 'A', 0)").run(sid, QUIZ.version, ans([0, 1, 2]), `+${i} seconds`);
      db.prepare("INSERT INTO pilot_quiz (student_id, phase, topic_id, items, answers, score, created_at, finished_at, form, aided) VALUES (?, 'post', ?, '[]', ?, 4, datetime('now', '-5 days'), datetime('now', '-5 days', ?), 'B', 0)").run(sid, QUIZ.version, ans([0, 1, 2, 3]), `+${i} seconds`);
    }
    const r = pilotTasksReport(db);
    assert.equal(r.impact.quiz.invited, 5, "povabljeni = člani pilota");
    const md = pilotTasksMarkdown(r);
    assert.match(md, /potek: povabljeni 5, začeli prvi preizkus 5, končali prvega 5, končali oba 5, odpadli 0 \(drugega niso končali v 7 dneh po odprtju\), še lahko končajo 0/);
    assert.match(md, /Glavni izid: .*kandidatov: 5, drugi preizkus s pomočjo \(izločeni\): 0\./);
    assert.match(md, /\| vmes ni vadil \| 45 \| 5 \| 11 % \| 5 %–24 % \|/);
    assert.match(md, /\| skupaj \| 45 \| 5 \|/);
    assert.ok(QUIZ_GAP_DAYS === 14);
  } finally {
    delete process.env.EVKLID_PILOT_VSI;
  }
});

test("besedila: navodilo »brez pomoči« v živih jezikih, zamrznjeni prevodi brez starega navodila (nadomestni jezik)", () => {
  assert.match(SL["pn.quizText"], /brez inštruktorja, skenerja in pomoči drugih ljudi/);
  for (const k of ["pn.quizHelpQ", "pn.quizHelpNo", "pn.quizHelpYes", "pilot.n.quizFunnel", "pilot.n.quizMain", "pilot.n.quizConceptNote"]) assert.ok(SL[k], k);
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  for (const f of fs.readdirSync(dir)) {
    const code = f.replace(/\.json$/, "");
    const d = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
    if (["en", "de", "hr", "it", "hu"].includes(code)) assert.ok(d["pn.quizHelpQ"] && d["pn.quizText"].split(". ").length > SL["pn.quizText"].split(". ").length - 2, code);
    else assert.equal(d["pn.quizText"], undefined, `${code}: staro navodilo brez »brez pomoči« ne ostane`);
  }
  const html = fs.readFileSync(new URL("../public/zasebnost.html", import.meta.url), "utf8");
  assert.match(html, /ali je med reševanjem uporabil inštruktorja ali skener/);
});
