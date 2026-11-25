// Merjenje učinka v pilotu (server/pilot-ucinek.js): preizkus znanja na začetku in čez 14 dni (12 nalog iz kataloga
// mature MAT v dveh vzporednih oblikah A/B, izmenično, ocena s kodo, XP samo za opravljeno), vprašanje o plačilu (enkrat, samo polnoleten imetnik, 14 dni po
// začetku, »Raje ne povem«), vsote za skrbnika šele od 3 odgovorov, izvoz in izbris GDPR. Še obvestilo o novi
// različici politike zasebnosti (PRIVACY_VERSION).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { checkAnswer } from "../server/practice/check.js";
import * as MATH from "../public/graph/math.js";
import { exportOtherTables } from "../server/zasebnost.js";
import { rightInput, BLUEPRINT } from "../scripts/pilot-preizkus.js";
import { pilotTasksReport, pilotTasksMarkdown, XP, TOTAL, SCAN_CONDITIONS, FEATURES_SHOWN } from "../server/pilot-naloge.js";
import { QUIZ, QUIZ_FORMS, QUIZ_LEN, QUIZ_GAP_DAYS, impactReport, migratePilotImpact, quizState } from "../server/pilot-ucinek.js";
import { PRAG } from "../server/pilot-meritve.js";
import { PRIVACY_VERSION } from "../server/accounts/plans.js";
import { ownerOnly } from "../server/accounts/account-lock.js";
import SL from "../public/i18n/sl.js";

const quiet = { error() {}, warn() {}, info() {}, log() {} };

async function withServer(opts, fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: quiet, ...opts });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (path, o = {}) => {
      const res = await fetch(base + path, {
        method: o.method || "GET",
        headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
        body: o.body ? JSON.stringify(o.body) : undefined,
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar[kv.slice(0, i)] = kv.slice(i + 1);
      }
      return { status: res.status, body: await res.json().catch(() => null) };
    };
  };
  const warn = console.warn;
  console.warn = () => {};
  try {
    await fn({ client, store });
  } finally {
    console.warn = warn;
    server.close();
  }
}

// Pravilen odgovor za nalogo zamrznjene oblike (kot ga vpiše učenec).
const taskAt = (row, i) => QUIZ.forms[row.form][JSON.parse(row.items)[i]];
const rightAnswer = (row, i) => rightInput(taskAt(row, i));
const quizRow = (db, sid, phase) => db.prepare("SELECT * FROM pilot_quiz WHERE student_id = ? AND phase = ?").get(sid, phase);

test("obliki preizkusa: 12 nalog iz kataloga mature MAT, vzporedni (isti generator, ista vrsta odgovora, drug odgovor), koda ju oceni pravilno", () => {
  assert.equal(QUIZ_LEN, 12);
  assert.equal(QUIZ.slots.length, BLUEPRINT.length);
  assert.deepEqual(QUIZ.slots.map((s) => s.sklop), BLUEPRINT.map((b) => b[0]));
  assert.equal(new Set(QUIZ.slots.map((s) => s.sklop)).size, 12, "vsako mesto iz drugega sklopa kataloga");
  for (const f of QUIZ_FORMS) assert.equal(QUIZ.forms[f].length, 12, f);
  const texts = new Set();
  for (let i = 0; i < 12; i++) {
    const a = QUIZ.forms.A[i];
    const b = QUIZ.forms.B[i];
    assert.equal(a.generator, b.generator, `mesto ${i}: isti generator`);
    assert.equal(a.answer.type, b.answer.type, `mesto ${i}: ista vrsta odgovora`);
    assert.equal(a.answer.unit, b.answer.unit, `mesto ${i}: ista enota`);
    assert.equal(a.level, b.level);
    assert.equal(a.topicId, QUIZ.slots[i].topic, `mesto ${i}: tema iz načrta`);
    assert.equal(b.topicId, QUIZ.slots[i].topic);
    assert.notEqual(JSON.stringify(a.answer), JSON.stringify(b.answer), `mesto ${i}: drug odgovor`);
    for (const t of [a, b]) {
      assert.ok(!t.figure && !/višja raven/i.test(t.text), "brez slike in brez višje ravni");
      assert.ok(!("hint" in t) && !("solution" in t), "v zamrznjeni nalogi ni namiga in rešitve");
      const opts = { find: t.data?.find, text: t.text, math: MATH };
      assert.equal(checkAnswer(t.answer, rightInput(t), opts).kind, "correct", `${t.generator} ${t.seed}`);
      assert.notEqual(checkAnswer(t.answer, t.answer.type === "choice" ? String((t.answer.index + 1) % t.answer.options.length) : "123457", opts).kind, "correct", "napačen odgovor ni pravilen");
      texts.add(t.text);
    }
  }
  assert.equal(texts.size, 24, "nobena naloga se ne ponovi");
});

test("preizkus znanja: samo člani, 12 nalog, oblika A nato B (naslednji učenec B nato A), en odgovor na nalogo, XP enkrat, izbris", async () => {
  delete process.env.EVKLID_PILOT_VSI;
  await withServer({}, async ({ client, store }) => {
    const db = store.db;
    const call = client();
    const mk = async (name) => (await call("/api/students", { method: "POST", body: { name, settings: { curriculum_level: "4. letnik" } } })).body.id;
    const sid = await mk("Ana");
    assert.equal((await call(`/api/students/${sid}/pilot/quiz`, { method: "POST", body: { phase: "pre" } })).status, 403);
    process.env.EVKLID_PILOT_VSI = "1";
    try {
      const st0 = (await call(`/api/students/${sid}/pilot`)).body;
      assert.equal(st0.total, TOTAL);
      assert.equal(TOTAL, SCAN_CONDITIONS.length + FEATURES_SHOWN + 4);
      assert.deepEqual(st0.quiz.pre, { started: false, done: false });
      assert.equal((await call(`/api/students/${sid}/pilot/quiz`, { method: "POST", body: { phase: "post" } })).status, 409, "drugi šele po prvem");
      const r = await call(`/api/students/${sid}/pilot/quiz`, { method: "POST", body: { phase: "pre" } });
      assert.equal(r.status, 200);
      assert.equal(r.body.run.total, 12);
      assert.equal(r.body.run.task.text, QUIZ.forms.A[0].text, "prvi učenec začne z obliko A");
      assert.equal(r.body.run.task.answer, undefined, "odgovor ne gre k odjemalcu");
      const pre = quizRow(db, sid, "pre");
      assert.equal(pre.form, "A");
      assert.equal(pre.topic_id, QUIZ.version);
      // Napaka v zapisu ni odgovor; napačna številka naloge ne prepiše drugega odgovora.
      const fmt = await call(`/api/students/${sid}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: 0, answer: "" } });
      assert.equal(fmt.status, 422);
      assert.equal(fmt.body.retry, true);
      assert.equal((await call(`/api/students/${sid}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: 3, answer: "1" } })).status, 409);
      const xp0 = db.prepare("SELECT COALESCE(SUM(amount), 0) AS n FROM xp_events WHERE student_id = ?").get(sid).n;
      // Prva pravilno, druga napačno, ostale »Ne vem«: rezultat 1 od 12, XP samo ob koncu.
      let out = await call(`/api/students/${sid}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: 0, answer: rightAnswer(pre, 0) } });
      assert.equal(out.status, 200, JSON.stringify(out.body));
      assert.equal(out.body.gained, 0);
      assert.equal(out.body.run.index, 1);
      assert.equal(out.body.run.task.text, QUIZ.forms.A[1].text);
      out = await call(`/api/students/${sid}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: 1, answer: "123457" } });
      assert.equal(out.status, 200, JSON.stringify(out.body));
      for (let i = 2; i < 12; i++) out = await call(`/api/students/${sid}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: i, skip: true } });
      assert.equal(out.body.gained, XP.quiz);
      assert.equal(out.body.run.done, true);
      assert.equal(out.body.run.score, 1);
      assert.deepEqual(JSON.parse(quizRow(db, sid, "pre").answers), [1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
      assert.equal(out.body.quiz.pre.done, true);
      assert.equal(out.body.quiz.postOpen, false);
      assert.equal(db.prepare("SELECT COALESCE(SUM(amount), 0) AS n FROM xp_events WHERE student_id = ?").get(sid).n - xp0, XP.quiz, "XP samo za opravljeno, ne za pravilne");
      assert.equal((await call(`/api/students/${sid}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: 11, skip: true } })).status, 409, "končan");
      assert.equal((await call(`/api/students/${sid}/pilot/quiz`, { method: "POST", body: { phase: "pre" } })).body.run.done, true, "ponovni začetek vrne končanega");
      assert.equal((await call(`/api/students/${sid}/pilot/quiz`, { method: "POST", body: { phase: "post" } })).status, 409);

      // Drugi učenec začne z obliko B (izmenično).
      const sid2 = await mk("Bor");
      assert.equal((await call(`/api/students/${sid2}/pilot/quiz`, { method: "POST", body: { phase: "pre" } })).body.run.task.text, QUIZ.forms.B[0].text);
      assert.equal(quizRow(db, sid2, "pre").form, "B");

      // Čez 14 dni: vzporedna oblika B, obvestilo enkrat, vse pravilno.
      db.prepare(`UPDATE pilot_quiz SET finished_at = datetime('now', '-${QUIZ_GAP_DAYS} days', '-1 minute') WHERE student_id = ?`).run(sid);
      const st = (await call(`/api/students/${sid}/pilot`)).body;
      assert.equal(st.quiz.postOpen, true);
      assert.equal(st.quizNotice, true);
      await call(`/api/students/${sid}/pilot/seen`, { method: "POST", body: { what: "quiz" } });
      assert.equal((await call(`/api/students/${sid}/pilot`)).body.quizNotice, false);
      const p = await call(`/api/students/${sid}/pilot/quiz`, { method: "POST", body: { phase: "post" } });
      assert.equal(p.status, 200);
      assert.equal(p.body.run.task.text, QUIZ.forms.B[0].text);
      const post = quizRow(db, sid, "post");
      assert.equal(post.form, "B", "drugi preizkus z drugo obliko");
      for (let i = 0; i < 12; i++) {
        out = await call(`/api/students/${sid}/pilot/quiz/answer`, { method: "POST", body: { phase: "post", index: i, answer: rightAnswer(post, i) } });
        assert.equal(out.status, 200, `${i}: ${JSON.stringify(out.body)}`);
      }
      assert.equal(out.body.run.score, 12);
      assert.equal(out.body.gained, XP.quiz);
      assert.equal(out.body.done, 2);
      // Preizkus ne spremeni napredka teme (meri, ne uči).
      assert.equal(db.prepare("SELECT COUNT(*) AS n FROM tasks WHERE student_id = ?").get(sid).n, 0);
      // Izvoz GDPR (zasebnost.js) vsebuje oba preizkusa z obliko.
      const exp = exportOtherTables(db, { studentIds: [sid] });
      assert.deepEqual(exp.pilot_quiz.map((x) => [x.phase, x.form, x.score]).sort(), [["post", "B", 12], ["pre", "A", 1]]);
      // Izbris profila izbriše tudi preizkus (ON DELETE CASCADE).
      db.prepare("DELETE FROM students WHERE id = ?").run(sid);
      assert.equal(db.prepare("SELECT COUNT(*) AS n FROM pilot_quiz WHERE student_id = ?").get(sid).n, 0);
    } finally {
      delete process.env.EVKLID_PILOT_VSI;
    }
  });
});

test("preizkus znanja: odgovor brez enote pri nalogi z enoto šteje, prejšnji preizkus (pred obema oblikama) se umakne pod pre-v1", () => {
  const store = openDb(":memory:");
  const db = store.db;
  const i = QUIZ.forms.A.findIndex((t) => t.answer.unit);
  assert.ok(i >= 0, "vsaj ena naloga z enoto");
  const t = QUIZ.forms.A[i];
  const opts = { find: t.data?.find, text: t.text, math: MATH };
  const v = t.answer.decimals != null ? Number(t.answer.value).toFixed(t.answer.decimals) : String(t.answer.value);
  assert.equal(checkAnswer(t.answer, v, opts).code, "chk.addUnit", "strežnik doda enoto (kot v preizkusu)");
  assert.equal(checkAnswer(t.answer, `${v} ${t.answer.unit}`, opts).kind, "correct");
  assert.equal(rightInput(t), `${v} ${t.answer.unit}`);
  // Stara tabela brez stolpca form z začetim in končanim preizkusom.
  db.exec("DROP TABLE IF EXISTS pilot_quiz");
  db.exec(`CREATE TABLE pilot_quiz (student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE, phase TEXT NOT NULL, topic_id TEXT NOT NULL,
    items TEXT NOT NULL, answers TEXT NOT NULL, score INTEGER, created_at TEXT NOT NULL DEFAULT (datetime('now')), finished_at TEXT, PRIMARY KEY (student_id, phase))`);
  const sid = Number(db.prepare("INSERT INTO students (name, settings) VALUES ('Old', '{}')").run().lastInsertRowid);
  db.prepare("INSERT INTO pilot_quiz (student_id, phase, topic_id, items, answers, score, finished_at) VALUES (?, 'pre', 'x/t', '[]', '[1,1,0,0,0,0]', 2, datetime('now'))").run(sid);
  db.prepare("INSERT INTO pilot_quiz (student_id, phase, topic_id, items, answers, score, finished_at) VALUES (?, 'post', 'x/t', '[]', '[1,1,1,0,0,0]', 3, datetime('now'))").run(sid);
  migratePilotImpact(db);
  migratePilotImpact(db); // dvakrat brez napake
  assert.deepEqual(db.prepare("SELECT phase, form FROM pilot_quiz ORDER BY phase").all().map((r) => [r.phase, r.form]), [["post-v1", null], ["pre-v1", null]]);
  // Vrnitev na staro različico in nazaj: stara koda napiše novo »pre« brez oblike ob obstoječi pre-v1; zagon ne pade.
  db.prepare("INSERT INTO pilot_quiz (student_id, phase, topic_id, items, answers, created_at) VALUES (?, 'pre', 'x/t', '[]', '[null]', '2026-12-01 10:00:00')").run(sid);
  migratePilotImpact(db);
  assert.deepEqual(db.prepare("SELECT phase FROM pilot_quiz ORDER BY phase").all().map((r) => r.phase), ["post-v1", "pre-v1", "pre-v1-2026-12-01 10:00:00"]);
  assert.equal(quizState(db, sid).pre.started, false);
  const st = quizState(db, sid);
  assert.equal(st.pre.started, false, "nov preizkus začne znova");
  assert.equal(impactReport(db, 1).quiz.nPre, 0, "prejšnji ni v poročilu");
  assert.equal(exportOtherTables(db, { studentIds: [sid] }).pilot_quiz.length, 3, "prejšnji ostane v izvozu");
});

test("preizkus znanja: skrbnik vidi povprečja, obliki, vrstni red in sklope šele od 5 učencev, pred in po samo pri istih", () => {
  const store = openDb(":memory:");
  const db = store.db;
  impactReport(db, PRAG); // ustvari tabele
  let t = 0;
  const add = (sid, phase, form, right) => {
    const answers = Array.from({ length: 12 }, (_, i) => (right.includes(i) ? 1 : 0));
    db.prepare(`INSERT INTO pilot_quiz (student_id, phase, topic_id, items, answers, score, finished_at, form) VALUES (?, ?, ?, '[]', ?, ?, datetime('now', '+${t++} seconds'), ?)`).run(
      sid, phase, QUIZ.version, JSON.stringify(answers), right.length, form);
  };
  const ids = Array.from({ length: 10 }, (_, i) => Number(db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run(`U${i}`).lastInsertRowid));
  // Učenci 0–4 A nato B, 5–9 B nato A. Pred: 3 pravilne (mesta 0–2), po: 6 pravilnih (mesta 0–5).
  for (let i = 0; i < 4; i++) add(ids[i], "pre", "A", [0, 1, 2]);
  let q = impactReport(db, PRAG).quiz;
  assert.equal(q.nPre, "< 5");
  assert.equal(q.pre, null);
  assert.equal(q.byForm.A, null);
  assert.equal(q.slots, null);
  add(ids[4], "pre", "A", [0, 1, 2]);
  q = impactReport(db, PRAG).quiz;
  assert.equal(q.nPre, 5);
  assert.equal(q.pre, 0.25);
  assert.deepEqual(q.byForm, { A: { n: 5, avg: 0.25 }, B: null });
  assert.equal(q.nPaired, 0);
  for (let i = 5; i < 9; i++) add(ids[i], "pre", "B", [0, 1, 2]);
  q = impactReport(db, PRAG).quiz;
  assert.equal(q.nPre, 9, "skupno število je natančno");
  assert.equal(q.shownPre, 5, "povprečje samo v paketu po 5");
  assert.equal(q.byForm.B, null);
  add(ids[9], "pre", "B", [0, 1, 2]);
  for (let i = 0; i < 4; i++) add(ids[i], "post", "B", [0, 1, 2, 3, 4, 5]);
  q = impactReport(db, PRAG).quiz;
  assert.deepEqual(q.byForm.B, { n: 5, avg: 0.25 });
  assert.equal(q.nPaired, "< 5");
  assert.equal(q.diff, null);
  assert.equal(q.slots, null);
  add(ids[4], "post", "B", [0, 1, 2, 3, 4, 5]);
  q = impactReport(db, PRAG).quiz;
  assert.equal(q.nPaired, 5);
  assert.equal(q.pairedPre, 0.25);
  assert.equal(q.pairedPost, 0.5);
  assert.equal(q.diff, 0.25);
  assert.deepEqual(q.byOrder, { AB: { n: 5, pre: 0.25, post: 0.5, diff: 0.25 }, BA: null });
  assert.equal(q.slots.length, 12);
  assert.deepEqual(q.slots.slice(0, 4).map((s) => [s.pre, s.post]), [[1, 1], [1, 1], [1, 1], [0, 1]]);
  assert.equal(q.slots[0].sklop, QUIZ.slots[0].sklop);
  for (let i = 5; i < 10; i++) add(ids[i], "post", "A", [0, 1, 2, 3]);
  q = impactReport(db, PRAG).quiz;
  assert.equal(q.byOrder.BA.n, 5);
  assert.equal(q.byOrder.BA.diff, Math.round((1 / 12) * 1000) / 1000);
  const md = pilotTasksMarkdown(pilotTasksReport(db));
  assert.match(md, /## Preizkus znanja \(matura MAT, 12 nalog, obliki A in B\)/);
  assert.match(md, /vrstni red A nato B: 5, prej 25 %, po 50 %, razlika \+25 odstotnih točk/);
  assert.match(md, /\| 4\.3\.2 Racionalna števila \| 100 % \| 100 % \|/);
  // Samo »Ne vem« ni v povprečju, šteje se posebej.
  const u = Number(db.prepare("INSERT INTO students (name, settings) VALUES ('Z', '{}')").run().lastInsertRowid);
  db.prepare(`INSERT INTO pilot_quiz (student_id, phase, topic_id, items, answers, score, finished_at, form) VALUES (?, 'pre', ?, '[]', ?, 0, datetime('now', '+99 seconds'), 'A')`).run(u, QUIZ.version, JSON.stringify(Array(12).fill(-1)));
  q = impactReport(db, PRAG).quiz;
  assert.equal(q.nPre, 11);
  assert.equal(q.allSkip, 0, "zunaj paketa po 5 se ne šteje");
});

// Račun z lastnim profilom (letnica rojstva `age` let nazaj), potrjen e-naslov, v pilotu.
async function account(client, store, email, age, pilot = true) {
  const call = client();
  const y = new Date().getFullYear() - age;
  const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, country: "SI", birth_date: `${y}-01-15` } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  store.db.prepare(`UPDATE parents SET email_verified_at = datetime('now'), pilot_at = ${pilot ? "datetime('now')" : "NULL"} WHERE email = ?`).run(email);
  const s = await call("/api/students", { method: "POST", body: { name: "Maja", self: true, consent: true } });
  assert.equal(s.status, 201, JSON.stringify(s.body));
  return { call, sid: s.body.id, pid: store.db.prepare("SELECT id FROM parents WHERE email = ?").get(email).id };
}

test("plačilo: enkrat, 14 dni po začetku, samo polnoleten imetnik v pilotu, »Raje ne povem«, vsote od 3 naprej, izvoz in izbris", async () => {
  await withServer({ accounts: true, resendKey: "re_x", fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ id: "e" }) }) }, async ({ client, store }) => {
    const db = store.db;
    const a = await account(client, store, "starš@pilot.si", 40);
    await a.call(`/api/students/${a.sid}/pilot`); // profil odpre naloge danes (pilot_state.joined_at); šteje prejšnji začetek
    let acc = (await a.call("/api/account")).body;
    assert.deepEqual(acc.pilot_wtp, { open: false, done: false, opensAt: acc.pilot_wtp.opensAt });
    assert.equal((await a.call("/api/account/pilot-wtp", { method: "POST", body: { pay: "no" } })).status, 409, "še ni odprto");
    db.prepare("UPDATE parents SET pilot_at = datetime('now', '-15 days') WHERE id = ?").run(a.pid);
    acc = (await a.call("/api/account")).body;
    assert.equal(acc.pilot_wtp.open, true);
    assert.equal((await a.call("/api/account/pilot-wtp", { method: "POST", body: { pay: "nekaj" } })).status, 400);
    assert.equal((await a.call("/api/account/pilot-wtp", { method: "POST", body: { pay: "yes" } })).status, 400, "pri Da tudi znesek");
    assert.equal((await a.call("/api/account/pilot-wtp", { method: "POST", body: { pay: "yes", amount: "5to10" } })).status, 401, "brez gesla računa ne (otrok na starševi napravi)");
    assert.equal((await a.call("/api/account/pilot-wtp", { method: "POST", body: { pay: "yes", amount: "5to10", password: "napak" } })).status, 401);
    const ok = await a.call("/api/account/pilot-wtp", { method: "POST", body: { pay: "yes", amount: "5to10", password: "geslo1234" } });
    assert.equal(ok.status, 200, JSON.stringify(ok.body));
    assert.deepEqual(ok.body.wtp, { open: false, done: true });
    assert.equal((await a.call("/api/account/pilot-wtp", { method: "POST", body: { pay: "no", password: "geslo1234" } })).status, 409, "samo enkrat");
    assert.deepEqual({ ...db.prepare("SELECT pay, amount FROM pilot_wtp WHERE parent_id = ?").get(a.pid) }, { pay: "yes", amount: "5to10" });
    // Brez XP.
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM xp_events WHERE reason LIKE '%wtp%'").get().n, 0);
    // Izvoz GDPR vsebuje odgovor.
    const exp = (await a.call("/api/account/export", { method: "POST", body: { password: "geslo1234" } })).body;
    assert.match(JSON.stringify(exp.other), /pilot_wtp/);
    assert.match(JSON.stringify(exp.other), /5to10/);

    // Mladoleten imetnik (16) in račun zunaj pilota vprašanja ne dobita.
    const m = await account(client, store, "dijak@pilot.si", 16);
    db.prepare("UPDATE parents SET pilot_at = datetime('now', '-15 days') WHERE id = ?").run(m.pid);
    assert.equal((await m.call("/api/account")).body.pilot_wtp, null);
    assert.equal((await m.call("/api/account/pilot-wtp", { method: "POST", body: { pay: "skip" } })).status, 403);
    const n = await account(client, store, "ne@pilot.si", 40, false);
    assert.equal((await n.call("/api/account")).body.pilot_wtp, null);

    // Skrbnik: porazdelitev šele od 5 odgovorov (plačilo), število pod pragom »< 5«.
    assert.equal(impactReport(db, 3).wtp.pay, null);
    assert.equal(impactReport(db, 3).wtp.n, "< 5");
    for (const [i, pay] of [["b", "skip"], ["c", "maybe"], ["d", "no"], ["e", "no"]].entries()) {
      const x = await account(client, store, `${pay[0]}${i}@pilot.si`, 35);
      db.prepare("UPDATE parents SET pilot_at = datetime('now', '-15 days') WHERE id = ?").run(x.pid);
      const body = pay[1] === "maybe" ? { pay: "maybe", amount: "skip" } : { pay: pay[1] };
      assert.equal((await x.call("/api/account/pilot-wtp", { method: "POST", body: { ...body, password: "geslo1234" } })).status, 200);
      if (i < 3) assert.equal(impactReport(db, 3).wtp.pay, null, "pod 5 ni porazdelitve");
    }
    const w = impactReport(db, 3).wtp;
    assert.equal(w.n, 5);
    assert.deepEqual(w.pay, { yes: 1, maybe: 1, no: 2, skip: 1 });
    assert.equal(w.amount["5to10"], 1);
    assert.equal(db.prepare("SELECT amount FROM pilot_wtp WHERE pay = 'skip'").get().amount, null);

    // Izbris računa izbriše odgovor.
    assert.equal((await a.call("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM pilot_wtp WHERE parent_id = ?").get(a.pid).n, 0);
  });
});

test("zasebnost: nova različica politike pokaže obvestilo enkrat, nov račun ga ne vidi", async () => {
  await withServer({ accounts: true, resendKey: "re_x", fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ id: "e" }) }) }, async ({ client, store }) => {
    const a = await account(client, store, "zas@pilot.si", 40, false);
    const status = async () => (await a.call("/api/account/status")).body.parent;
    assert.equal((await status()).privacy_notice, null, "nov račun je sprejel trenutno različico");
    store.db.prepare("UPDATE parents SET privacy_version = '2026-10-29' WHERE id = ?").run(a.pid);
    assert.equal((await status()).privacy_notice, PRIVACY_VERSION);
    // Skrije ga samo imetnik z geslom računa (pasica v Računu), ne kdo drug na napravi s sejo.
    assert.equal((await a.call("/api/account/privacy-seen", { method: "POST" })).status, 401);
    assert.equal((await a.call("/api/account/privacy-seen", { method: "POST", body: { password: "napak" } })).status, 401);
    assert.equal((await status()).privacy_notice, PRIVACY_VERSION, "ostane, dokler ga imetnik ne potrdi");
    const r = await a.call("/api/account/privacy-seen", { method: "POST", body: { password: "geslo1234" } });
    assert.equal(r.status, 200);
    assert.equal(r.body.parent.privacy_notice, null);
    assert.equal((await status()).privacy_notice, null);
    assert.equal(store.db.prepare("SELECT privacy_version FROM parents WHERE id = ?").get(a.pid).privacy_version, "2026-10-29", "različica ob registraciji ostane");
    // Račun, ki je potrdil obvestilo prejšnje različice (2026-11-21), ob različici 2026-11-25 (varnost ob stiski,
    // obvestilo staršem; j 25. 11.) obvestilo vidi znova, enkrat.
    assert.equal(PRIVACY_VERSION, "2026-11-25");
    store.db.prepare("UPDATE parents SET privacy_seen = '2026-11-21' WHERE id = ?").run(a.pid);
    assert.equal((await status()).privacy_notice, "2026-11-25");
    assert.equal((await a.call("/api/account/privacy-seen", { method: "POST", body: { password: "geslo1234" } })).body.parent.privacy_notice, null);
    assert.equal((await status()).privacy_notice, null);
  });
  assert.ok(ownerOnly("/account/privacy-seen", "POST"));
  assert.ok(ownerOnly("/account/pilot-wtp", "POST"));
  for (const k of ["starsi.privTitle", "starsi.privText", "starsi.privRead", "starsi.privPw", "starsi.privHide", "starsi.wtpSkip", "pn.quizTitle"]) assert.ok(SL[k], k);
  assert.match(SL["starsi.privText"], /Nič vam ni treba narediti\./);
  assert.equal(SL["starsi.wtpSkip"], "Raje ne povem");
});
