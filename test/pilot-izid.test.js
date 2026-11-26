// AUDIT-095: meritev uspeha pilota do konca (j 26. 11. 2026, pregled pripravljenosti pilota, poseg 3; server/pilot-ucinek.js):
// - »brez pomoči«: navodilo; po zadnji nalogi vprašanje o pomoči, ki šele konča preizkus (rezultat, XP); zapis, ali je
//   kandidat med reševanjem (okna do 30 min pred vsakim odgovorom) uporabil inštruktorja, skener ali vaje;
// - ob koncu drugega preizkusa zapis vadenih mest (vadnica, inštruktor, vaja drugje) med preizkusoma;
// - poročilo: povabljeni, začeli, končali, pari, odpadli (drugega ni končal 7 dni po odprtju), še čakajo;
// - glavni izid po konceptu: napačno prvič → pravilno drugič brez pomoči, ločeno vadil / ni vadil (skupina od 5
//   kandidatov), imenovalec in Wilsonov interval; paketi po 5 samo iz parov brez pomoči; iz razlike dveh poročil se ne
//   da razbrati posameznika (pozni odgovor ali izbrisan pogovor ne spremeni zaprtega paketa; pregled 2).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { exportOtherTables } from "../server/zasebnost.js";
import { pilotTasksReport, pilotTasksMarkdown, XP } from "../server/pilot-naloge.js";
import { QUIZ, ODPAD_DAYS, HELP_WINDOW_MIN, impactReport, wilson, helpWindows, aidedDuring, practicedSlots } from "../server/pilot-ucinek.js";
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

// Odgovori na vseh 12 nalog (before(i) pred i-tim odgovorom), ne pa na vprašanje o pomoči.
async function answerAll(call, db, sid, phase, before = () => {}) {
  await call(`/api/students/${sid}/pilot/quiz`, { method: "POST", body: { phase } });
  const row = quizRow(db, sid, phase);
  let out;
  for (let i = 0; i < 12; i++) {
    before(i);
    out = await call(`/api/students/${sid}/pilot/quiz/answer`, { method: "POST", body: { phase, index: i, answer: rightInput(QUIZ.forms[row.form][i]) } });
    assert.equal(out.status, 200, JSON.stringify(out.body));
  }
  return out.body;
}

test("konec preizkusa: vprašanje o pomoči ga konča (rezultat, XP, enkrat), zapis pomoči med reševanjem, izvoz", async () => {
  process.env.EVKLID_PILOT_VSI = "1";
  try {
    await withServer(async ({ call, db }) => {
      const mk = async (name) => (await call("/api/students", { method: "POST", body: { name, settings: { curriculum_level: "4. letnik" } } })).body.id;
      const [a, b, c, d] = [await mk("Ana"), await mk("Bor"), await mk("Cene"), await mk("Dan")];
      // Pred zadnjo nalogo odgovor o pomoči ni mogoč.
      await call(`/api/students/${a}/pilot/quiz`, { method: "POST", body: { phase: "pre" } });
      assert.equal((await call(`/api/students/${a}/pilot/quiz/help`, { method: "POST", body: { phase: "pre", help: "no" } })).status, 409);
      // Uporaba AI pred začetkom preizkusa ne šteje.
      db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, created_at) VALUES (?, 'x', 'chat', 0, datetime('now', '-1 day'))").run(a);
      let body = await answerAll(call, db, a, "pre");
      assert.equal(body.run.done, false);
      assert.equal(body.run.askHelp, true);
      assert.equal(body.gained, 0, "XP šele ob koncu");
      assert.equal(body.quiz.pre.askHelp, true);
      assert.equal(quizRow(db, a, "pre").finished_at, null);
      assert.equal(JSON.parse(quizRow(db, a, "pre").times).length, 12, "čas vsakega odgovora");
      assert.equal((await call(`/api/students/${a}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: 11, skip: true } })).status, 409);
      assert.equal((await call(`/api/students/${a}/pilot/quiz/help`, { method: "POST", body: { phase: "pre", help: "mogoče" } })).status, 400);
      const h = await call(`/api/students/${a}/pilot/quiz/help`, { method: "POST", body: { phase: "pre", help: "no" } });
      assert.equal(h.status, 200);
      assert.equal(h.body.gained, XP.quiz);
      assert.equal(h.body.run.done, true);
      assert.equal(h.body.run.score, 12);
      assert.equal(h.body.run.askHelp, undefined);
      const ra = quizRow(db, a, "pre");
      assert.deepEqual([ra.help, ra.aided, ra.score, ra.finished_at != null, ra.practiced], ["no", 0, 12, true, null]);
      assert.equal((await call(`/api/students/${a}/pilot/quiz/help`, { method: "POST", body: { phase: "pre", help: "yes" } })).status, 409, "samo enkrat");
      assert.equal(quizRow(db, a, "pre").help, "no");
      // Skener med reševanjem → aided.
      await answerAll(call, db, b, "pre", (i) => i === 5 && db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'x', 'skeniranje', 0.01)").run(b));
      await call(`/api/students/${b}/pilot/quiz/help`, { method: "POST", body: { phase: "pre", help: "no" } });
      assert.equal(quizRow(db, b, "pre").aided, 1);
      // Sporočilo inštruktorju (tudi brez zapisa porabe) → aided.
      await answerAll(call, db, c, "pre", (i) => {
        if (i !== 3) return;
        const conv = Number(db.prepare("INSERT INTO conversations (student_id) VALUES (?)").run(c).lastInsertRowid);
        db.prepare("INSERT INTO messages (conversation_id, role, api_content, display_text) VALUES (?, 'user', '\"x\"', 'x')").run(conv);
      });
      await call(`/api/students/${c}/pilot/quiz/help`, { method: "POST", body: { phase: "pre", help: "yes" } });
      assert.deepEqual([quizRow(db, c, "pre").aided, quizRow(db, c, "pre").help], [1, "yes"]);
      // Zapis, ki ni pomoč (npr. urnik, zapiski), ne šteje.
      await answerAll(call, db, d, "pre", (i) => i === 2 && db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'x', 'urnik', 0.01)").run(d));
      await call(`/api/students/${d}/pilot/quiz/help`, { method: "POST", body: { phase: "pre", help: "no" } });
      assert.equal(quizRow(db, d, "pre").aided, 0);
      // Izvoz GDPR vsebuje nove podatke.
      const exp = exportOtherTables(db, { studentIds: [a] }).pilot_quiz[0];
      assert.deepEqual([exp.aided, exp.help, JSON.parse(exp.times).length], [0, "no", 12]);
    });
  } finally {
    delete process.env.EVKLID_PILOT_VSI;
  }
});

test("pomoč samo v oknih pred odgovori: premor sredi preizkusa (teden vaje) ne šteje", () => {
  const db = openDb(":memory:").db;
  const sid = Number(db.prepare("INSERT INTO students (name, settings) VALUES ('X', '{}')").run().lastInsertRowid);
  const times = ["2026-11-10 10:00:00", "2026-11-10 10:02:00", "2026-11-17 18:00:00", "2026-11-17 18:01:00"];
  const w = helpWindows("2026-11-10 09:59:00", times);
  assert.deepEqual(w, [
    ["2026-11-10 09:59:00", "2026-11-10 10:00:00"],
    ["2026-11-10 10:00:00", "2026-11-10 10:02:00"],
    ["2026-11-17 17:30:00", "2026-11-17 18:00:00"],
    ["2026-11-17 18:00:00", "2026-11-17 18:01:00"],
  ]);
  assert.equal(HELP_WINDOW_MIN, 30);
  const use = (at, kind = "chat") => db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, created_at) VALUES (?, 'x', ?, 0, ?)").run(sid, kind, at);
  use("2026-11-12 12:00:00"); // med premorom
  db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, answered_at) VALUES (?, 'MAT-SS-4/odvod', 1, '{}', '2026-11-14 12:00:00')").run(sid);
  assert.equal(aidedDuring(db, sid, w), false);
  db.prepare("INSERT INTO skill_results (student_id, day, source, key, topic_id, n, last_at) VALUES (?, '2026-11-17', 'paper', 'k', 'MAT-SS-4/odvod', 1, '2026-11-17 17:45:00')").run(sid);
  assert.equal(aidedDuring(db, sid, w), true, "vaja na poli 15 min pred odgovorom");
});

test("vadena mesta: vadnica (ne uvrstitev), inštruktor in vaja drugje med preizkusoma, samo tema mesta", () => {
  const db = openDb(":memory:").db;
  const sid = Number(db.prepare("INSERT INTO students (name, settings) VALUES ('X', '{}')").run().lastInsertRowid);
  const task = (topic, at, mode = "practice") => db.prepare("INSERT INTO tasks (student_id, topic_id, mode, level, payload, answered_at) VALUES (?, ?, ?, 1, '{}', ?)").run(sid, topic, mode, at);
  task(QUIZ.slots[0].topic, "2026-11-05 10:00:00");
  task(QUIZ.slots[1].topic, "2026-11-05 10:00:00", "placement"); // uvrstitev ni vaja
  task(QUIZ.slots[2].topic, "2026-10-30 10:00:00"); // pred prvim preizkusom
  task(QUIZ.slots[3].topic, null); // brez odgovora
  task("MAT-SS-4/uporaba-odvoda", "2026-11-05 10:00:00"); // sosednja tema ne šteje
  db.prepare("INSERT INTO events (student_id, topic_id, created_at) VALUES (?, ?, '2026-11-06 12:00:00')").run(sid, QUIZ.slots[4].topic);
  db.prepare("INSERT INTO skill_results (student_id, day, source, key, topic_id, n) VALUES (?, '2026-11-08', 'paper', 'k', ?, 3)").run(sid, QUIZ.slots[10].topic);
  db.prepare("INSERT INTO skill_results (student_id, day, source, key, topic_id, n) VALUES (?, '2026-11-20', 'paper', 'k2', ?, 3)").run(sid, QUIZ.slots[11].topic); // po začetku drugega
  // Mejna dneva po času (pregled 3): na dan prvega preizkusa PRED koncem ne šteje, na dan drugega pred začetkom šteje, po začetku ne.
  const sr = (day, key, slot, at) => db.prepare("INSERT INTO skill_results (student_id, day, source, key, topic_id, n, last_at) VALUES (?, ?, 'kviz', ?, ?, 1, ?)").run(sid, day, key, QUIZ.slots[slot].topic, at);
  sr("2026-11-01", "m1", 5, "2026-11-01 09:30:00");
  sr("2026-11-16", "m2", 6, "2026-11-16 09:00:00");
  sr("2026-11-16", "m3", 7, "2026-11-16 11:00:00");
  assert.deepEqual(practicedSlots(db, sid, "2026-11-01 10:00:00", "2026-11-16 10:00:00"), [0, 4, 6, 10]);
});

test("Wilsonov interval", () => {
  assert.equal(wilson(0, 0), null);
  assert.deepEqual(wilson(5, 10), [0.237, 0.763]);
  assert.deepEqual(wilson(9, 27), [0.186, 0.522]);
  assert.deepEqual(wilson(0, 3), [0, 0.562]);
  assert.deepEqual(wilson(3, 3), [0.438, 1]);
});

// Lokalni preizkusni podatki: pari s časi, pomočjo in vadenimi mesti, kot jih zapiše konec preizkusa.
function fixture() {
  const db = openDb(":memory:").db;
  impactReport(db, PRAG); // ustvari tabele
  const ids = Array.from({ length: 30 }, (_, i) => Number(db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run(`U${i}`).lastInsertRowid));
  const ans = (right) => JSON.stringify(Array.from({ length: 12 }, (_, i) => (right.includes(i) ? 1 : 0)));
  const row = (sid, phase, form, right, created, finished, extra = {}) =>
    db
      .prepare("INSERT INTO pilot_quiz (student_id, phase, topic_id, items, answers, score, created_at, finished_at, form, aided, help, practiced) VALUES (?, ?, ?, '[]', ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(sid, phase, QUIZ.version, ans(right), finished ? right.length : null, created, finished, form, extra.aided ?? 0, extra.help ?? (finished ? "no" : null), extra.practiced ? JSON.stringify(extra.practiced) : null);
  return { db, ids, row };
}

test("AUDIT-095: poročilo: potek pilota (povabljeni, odpadli), izločeni s pomočjo, glavni izid po konceptu iz paketov po 5 parov brez pomoči", () => {
  const { db, ids, row } = fixture();
  const now = new Date("2026-11-26T12:00:00Z");
  // 0–6: A nato B. Prej pravilno mesta 0–2, po 14 dneh mesta 0–5. 5 je med drugim uporabil skener, 6 je rekel »Da«.
  // Vadena mesta: 0–4 vsi mesto 3 in 4 (skupina »vadil« ima 5 kandidatov).
  for (let i = 0; i < 7; i++) {
    row(ids[i], "pre", "A", [0, 1, 2], "2026-11-01 09:00:00", `2026-11-01 10:00:0${i}`, i === 6 ? { aided: 1 } : {});
    row(ids[i], "post", "B", [0, 1, 2, 3, 4, 5], "2026-11-16 10:00:00", `2026-11-16 10:30:0${i}`, { practiced: i < 5 ? [3, 4] : [], ...(i === 5 ? { aided: 1 } : i === 6 ? { help: "yes" } : {}) });
  }
  // 7 začel in ni končal; 8–12 končali prvega 1. 11. brez drugega (odpadli); 13–17 končali prvega 20. 11. (čakajo).
  row(ids[7], "pre", "B", [], "2026-11-02 09:00:00", null);
  for (let i = 8; i < 13; i++) row(ids[i], "pre", "B", [0], "2026-11-01 09:00:00", `2026-11-01 11:00:0${i - 8}`);
  for (let i = 13; i < 18; i++) row(ids[i], "pre", "B", [0], "2026-11-20 09:00:00", `2026-11-20 11:00:0${i - 13}`);

  const q = impactReport(db, PRAG, { invited: 20, now }).quiz;
  assert.deepEqual([q.invited, q.started, q.nPre, q.nPaired, q.dropped, q.waiting, q.dropDays], [20, "15+", 17, 7, "5+", "5+", ODPAD_DAYS]);
  // Pomoč pri 5 in 6 je zunaj zaprtega paketa parov (0–4), zato se še ne šteje (štetja samo v paketih, pregled 3).
  assert.deepEqual([q.helped, q.helpedAuto, q.helpedSelf, q.helpedPre], [0, 0, 0, 0]);
  // 5 parov brez pomoči tvori en paket: 9 napačnih na kandidata (mesta 3–11), pravilno drugič mesta 3–5.
  const c = q.concept;
  assert.equal(c.candidates, 5);
  assert.equal(c.gapDays, 15);
  assert.deepEqual(c.practiced, { candidates: 5, n: 10, improved: 10, share: 1, ci95: wilson(10, 10) });
  assert.deepEqual(c.notPracticed, { candidates: 5, n: 35, improved: 5, share: 0.143, ci95: wilson(5, 35) });
  assert.deepEqual(c.all, { candidates: 5, n: 45, improved: 15, share: 0.333, ci95: wilson(15, 45) });

  // Pod pragom: števila kot »< 5«, pred iztekom roka nihče ni odpadel.
  const early = impactReport(db, PRAG, { invited: 3, now: new Date("2026-11-21T00:00:00Z") }).quiz;
  assert.equal(early.invited, "< 5");
  assert.equal(early.dropped, 0);
  assert.equal(early.waiting, "10+", "začeli, odpadli in čakajo samo v korakih po 5");
  assert.equal(impactReport(db, PRAG, { now }).quiz.invited, null, "brez podatka o povabljenih");
});

test("zasebnost: skupina »vadil« z manj kot 5 kandidati je skrita; delež šele od 10 nalog; zaprt paket se ne spremeni", () => {
  const { db, ids, row } = fixture();
  const now = new Date("2026-11-26T12:00:00Z");
  // 5 parov brez pomoči; vadil samo kandidat 0 (mesto 3).
  for (let i = 0; i < 5; i++) {
    row(ids[i], "pre", "A", [0, 1, 2], "2026-11-01 09:00:00", `2026-11-01 10:00:0${i}`);
    row(ids[i], "post", "B", [0, 1, 2, 3, 4, 5], "2026-11-16 10:00:00", `2026-11-16 10:30:0${i}`, { practiced: i === 0 ? [3] : [] });
  }
  let q = impactReport(db, PRAG, { now }).quiz;
  assert.deepEqual(q.concept.practiced, { hidden: true, candidates: "< 5" }, "en kandidat: skupina skrita");
  // Skrita je tudi druga podskupina, sicer bi »skupaj − ni vadil« dalo enega človeka (pregled 3).
  assert.deepEqual(q.concept.notPracticed, { hidden: true, candidates: "≥ 5" });
  assert.equal(q.concept.all.candidates, 5);
  const before = JSON.stringify(q.concept);
  // Kandidat izbriše pogovor (dogodki) ali kasneje vadi: zapis ob koncu se ne spremeni, poročilo ostane enako.
  db.prepare("INSERT INTO events (student_id, topic_id, created_at) VALUES (?, ?, '2026-11-10 12:00:00')").run(ids[1], QUIZ.slots[6].topic);
  db.prepare("DELETE FROM events").run();
  assert.equal(JSON.stringify(impactReport(db, PRAG, { now }).quiz.concept), before);
  // Šesti par s pomočjo ne spremeni paketa (paket je samo iz parov brez pomoči); šesti brez pomoči tudi ne (ni cel paket).
  row(ids[5], "pre", "A", [0], "2026-11-01 09:00:00", "2026-11-01 10:00:09");
  row(ids[5], "post", "B", [0, 1, 2, 3, 4, 5, 6, 7], "2026-11-16 10:00:00", "2026-11-16 10:31:00", { help: "yes" });
  row(ids[6], "pre", "A", [0], "2026-11-01 09:00:00", "2026-11-01 10:00:10");
  row(ids[6], "post", "B", [0, 1, 2, 3, 4, 5, 6, 7], "2026-11-16 10:00:00", "2026-11-16 10:32:00");
  q = impactReport(db, PRAG, { now }).quiz;
  assert.equal(JSON.stringify(q.concept), before);
  // Majhna skupina: delež in interval šele od 10 nalog.
  const { db: db2, ids: ids2, row: row2 } = fixture();
  for (let i = 0; i < 5; i++) {
    row2(ids2[i], "pre", "A", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "2026-11-01 09:00:00", `2026-11-01 10:00:0${i}`);
    row2(ids2[i], "post", "B", Array.from({ length: 12 }, (_, k) => k), "2026-11-16 10:00:00", `2026-11-16 10:30:0${i}`);
  }
  const small = impactReport(db2, PRAG, { now }).quiz.concept.all;
  assert.deepEqual(small, { candidates: 5, n: 5, improved: 5, share: null, ci95: null });
});

test("zasebnost: štetja pomoči samo v zaprtih paketih (razlika dveh poročil ne razkrije enega človeka)", () => {
  const { db, ids, row } = fixture();
  const now = new Date("2026-11-26T12:00:00Z");
  const pair = (i) => {
    row(ids[i], "pre", "A", [0], "2026-11-01 09:00:00", `2026-11-01 10:00:${String(i).padStart(2, "0")}`);
    row(ids[i], "post", "B", [0, 1], "2026-11-16 10:00:00", `2026-11-16 10:30:${String(i).padStart(2, "0")}`, { help: "yes" });
  };
  for (let i = 0; i < 5; i++) pair(i);
  assert.equal(impactReport(db, PRAG, { now }).quiz.helpedSelf, 5);
  for (let i = 5; i < 9; i++) {
    pair(i);
    const q = impactReport(db, PRAG, { now }).quiz;
    assert.equal(q.nPaired, i + 1);
    assert.equal(q.helpedSelf, 5, "nov par s pomočjo se pokaže šele s celim paketom");
  }
  pair(9);
  assert.equal(impactReport(db, PRAG, { now }).quiz.helpedSelf, 10);
});

test("poročilo skrbnika in jutranji povzetek pokažeta potek in izid po konceptu", () => {
  process.env.EVKLID_PILOT_VSI = "1";
  try {
    const { db, ids, row } = fixture();
    for (let i = 0; i < 5; i++) {
      row(ids[i], "pre", "A", [0, 1, 2], "2026-11-01 09:00:00", `2026-11-01 10:00:0${i}`);
      row(ids[i], "post", "B", [0, 1, 2, 3], "2026-11-16 10:00:00", `2026-11-16 10:30:0${i}`);
    }
    const r = pilotTasksReport(db);
    assert.equal(r.impact.quiz.invited, 30, "povabljeni = člani pilota");
    const md = pilotTasksMarkdown(r);
    assert.match(md, /potek: povabljeni 30, začeli prvi preizkus 5\+, končali prvega 5, končali oba 5, odpadli 0 \(drugega niso končali v 7 dneh po odprtju\), še lahko končajo 0/);
    assert.match(md, /Glavni izid: .*kandidatov: 5, mediana časa med preizkusoma: 15 dni\./);
    assert.match(md, /Izločeni, ker so imeli pri drugem preizkusu pomoč: 0/);
    assert.match(md, /\| vmes vadil v Evklidu \| 0 \| premalo kandidatov \|/);
    assert.match(md, /\| vmes ni vadil \| 5 \| 45 \| 5 \| 11 % \| 5 %–24 % \|/);
  } finally {
    delete process.env.EVKLID_PILOT_VSI;
  }
});

test("besedila: navodilo »brez pomoči« v živih jezikih, zamrznjeni prevodi brez starega navodila (nadomestni jezik)", () => {
  assert.match(SL["pn.quizText"], /brez inštruktorja in skenerja, brez drugih aplikacij in umetne inteligence/);
  assert.match(SL["pilot.n.quizWrongFirst"], new RegExp(SL["pretest.dontKnow"]), "ime gumba kot v preizkusu");
  for (const k of ["pn.quizHelpQ", "pn.quizHelpNo", "pn.quizHelpYes", "pilot.n.quizFunnel", "pilot.n.quizMain", "pilot.n.quizHelped", "pilot.n.quizConceptNote"]) assert.ok(SL[k], k);
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  for (const f of fs.readdirSync(dir)) {
    const code = f.replace(/\.json$/, "");
    const d = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
    if (["en", "de", "hr", "it", "hu"].includes(code)) {
      assert.match(d["pn.quizText"], /Photomath, ChatGPT/, code);
      assert.ok(d["pilot.n.quizWrongFirst"].includes(d["pretest.dontKnow"]), code);
    } else assert.equal(d["pn.quizText"], undefined, `${code}: staro navodilo brez »brez pomoči« ne ostane`);
  }
  const html = fs.readFileSync(new URL("../public/zasebnost.html", import.meta.url), "utf8");
  assert.match(html, /čas vsakega odgovora/);
  assert.match(html, /katere teme nalog je med preizkusoma vadil/);
});
