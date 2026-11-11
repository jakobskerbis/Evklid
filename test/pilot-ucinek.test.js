// Merjenje učinka v pilotu (server/pilot-ucinek.js): preizkus znanja na začetku in čez 14 dni (ista tema, nove
// naloge, ocena s kodo, XP samo za opravljeno), vprašanje o plačilu (enkrat, samo polnoleten imetnik, 14 dni po
// začetku, »Raje ne povem«), vsote za skrbnika šele od 3 odgovorov, izvoz in izbris GDPR. Še obvestilo o novi
// različici politike zasebnosti (PRIVACY_VERSION).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { generateTask } from "../server/practice/index.js";
import { checkAnswer } from "../server/practice/check.js";
import { pilotTasksReport, pilotTasksMarkdown, XP, TOTAL, SCAN_CONDITIONS, FEATURES_SHOWN } from "../server/pilot-naloge.js";
import { QUIZ_LEVELS, QUIZ_EXTRA, QUIZ_GAP_DAYS, impactReport } from "../server/pilot-ucinek.js";
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

// Pravilen odgovor za nalogo iz semena (kot jo vidi strežnik).
function rightAnswer(row, i) {
  const it = JSON.parse(row.items)[i];
  const t = generateTask(row.topic_id, it.level, it.seed, "sl");
  const a = t.answer;
  const tries = a.type === "choice" ? a.options.map((_, k) => String(k)) : [a.value, a.text, a.answer, a.values?.[0], a.num != null ? `${a.num}/${a.den}` : null].filter((x) => x != null).map(String);
  const ok = tries.find((x) => checkAnswer(a, a.unit && a.type !== "choice" ? `${x} ${a.unit}` : x).kind === "correct");
  assert.ok(ok != null, `pravilen odgovor za ${t.generator}`);
  return a.unit && a.type !== "choice" ? `${ok} ${a.unit}` : ok;
}

test("preizkus znanja: samo člani, 6 nalog, en odgovor na nalogo, XP enkrat za opravljeno, drugi čez 14 dni iz iste teme", async () => {
  delete process.env.EVKLID_PILOT_VSI;
  await withServer({}, async ({ client, store }) => {
    const call = client();
    const s = await call("/api/students", { method: "POST", body: { name: "Ana", settings: { curriculum_level: "8. razred" } } });
    const sid = s.body.id;
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
      assert.equal(r.body.run.total, QUIZ_LEVELS.length);
      assert.ok(r.body.run.task.text);
      assert.equal(r.body.run.task.answer, undefined, "odgovor ne gre k odjemalcu");
      const pre = store.db.prepare("SELECT * FROM pilot_quiz WHERE student_id = ? AND phase = 'pre'").get(sid);
      assert.deepEqual(JSON.parse(pre.items).map((x) => x.level), QUIZ_LEVELS);
      // Napaka v zapisu ni odgovor; napačna številka naloge ne prepiše drugega odgovora.
      const fmt = await call(`/api/students/${sid}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: 0, answer: "" } });
      assert.equal(fmt.status, 422);
      assert.equal(fmt.body.retry, true);
      assert.equal((await call(`/api/students/${sid}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: 3, answer: "1" } })).status, 409);
      const xp0 = store.db.prepare("SELECT COALESCE(SUM(amount), 0) AS n FROM xp_events WHERE student_id = ?").get(sid).n;
      // Prva pravilno, ostale »Ne vem«: rezultat 1 od 6, XP samo ob koncu.
      let out = await call(`/api/students/${sid}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: 0, answer: rightAnswer(pre, 0) } });
      assert.equal(out.status, 200, JSON.stringify(out.body));
      assert.equal(out.body.gained, 0);
      assert.equal(out.body.run.index, 1);
      for (let i = 1; i < QUIZ_LEVELS.length; i++) out = await call(`/api/students/${sid}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: i, skip: true } });
      assert.equal(out.body.gained, XP.quiz);
      assert.equal(out.body.run.done, true);
      assert.equal(out.body.run.score, 1);
      assert.equal(out.body.quiz.pre.done, true);
      assert.equal(out.body.quiz.postOpen, false);
      assert.equal(store.db.prepare("SELECT COALESCE(SUM(amount), 0) AS n FROM xp_events WHERE student_id = ?").get(sid).n - xp0, XP.quiz, "XP samo za opravljeno, ne za pravilne");
      assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM xp_events WHERE student_id = ? AND reason = 'pilot: quiz:pre'").get(sid).n, 1);
      assert.equal((await call(`/api/students/${sid}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: 5, skip: true } })).status, 409, "končan");
      // Ponovni začetek vrne končan preizkus (ne novega).
      assert.equal((await call(`/api/students/${sid}/pilot/quiz`, { method: "POST", body: { phase: "pre" } })).body.run.done, true);
      assert.equal((await call(`/api/students/${sid}/pilot/quiz`, { method: "POST", body: { phase: "post" } })).status, 409);
      // Čez 14 dni: ista tema, iste ravni, druga semena; obvestilo enkrat.
      store.db.prepare(`UPDATE pilot_quiz SET finished_at = datetime('now', '-${QUIZ_GAP_DAYS} days', '-1 minute') WHERE student_id = ?`).run(sid);
      const st = (await call(`/api/students/${sid}/pilot`)).body;
      assert.equal(st.quiz.postOpen, true);
      assert.equal(st.quizNotice, true);
      await call(`/api/students/${sid}/pilot/seen`, { method: "POST", body: { what: "quiz" } });
      assert.equal((await call(`/api/students/${sid}/pilot`)).body.quizNotice, false);
      assert.equal((await call(`/api/students/${sid}/pilot/quiz`, { method: "POST", body: { phase: "post" } })).status, 200);
      const post = store.db.prepare("SELECT * FROM pilot_quiz WHERE student_id = ? AND phase = 'post'").get(sid);
      assert.equal(post.topic_id, pre.topic_id);
      assert.deepEqual(JSON.parse(post.items).map((x) => x.level), QUIZ_LEVELS);
      assert.notDeepEqual(JSON.parse(post.items).map((x) => x.seed), JSON.parse(pre.items).map((x) => x.seed));
      for (let i = 0; i < QUIZ_LEVELS.length; i++) out = await call(`/api/students/${sid}/pilot/quiz/answer`, { method: "POST", body: { phase: "post", index: i, answer: rightAnswer(post, i) } });
      assert.equal(out.body.run.score, QUIZ_LEVELS.length);
      assert.equal(out.body.gained, XP.quiz);
      assert.equal(out.body.done, 2);
      // Preizkus ne spremeni napredka teme (meri, ne uči).
      assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM tasks WHERE student_id = ?").get(sid).n, 0);
      // Izbris profila izbriše tudi preizkus (ON DELETE CASCADE).
      store.db.prepare("DELETE FROM students WHERE id = ?").run(sid);
      assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_quiz").get().n, 0);
    } finally {
      delete process.env.EVKLID_PILOT_VSI;
    }
  });
});

test("preizkus znanja: skrbnik vidi povprečja šele od 3 učencev, pred in po samo pri istih učencih", () => {
  const store = openDb(":memory:");
  const db = store.db;
  impactReport(db, 3); // ustvari tabele
  const add = (sid, phase, score) =>
    db.prepare("INSERT INTO pilot_quiz (student_id, phase, topic_id, items, answers, score, finished_at) VALUES (?, ?, 't', '[]', ?, ?, datetime('now'))").run(sid, phase, JSON.stringify([1, 1, 0, 0, 0, 0]), score);
  const ids = [1, 2, 3, 4].map((i) => Number(db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run(`U${i}`).lastInsertRowid));
  add(ids[0], "pre", 2);
  add(ids[0], "post", 4);
  add(ids[1], "pre", 3);
  add(ids[1], "post", 3);
  let q = impactReport(db, 3).quiz;
  assert.equal(q.nPre, "< 3");
  assert.equal(q.pre, null);
  assert.equal(q.diff, null);
  add(ids[2], "pre", 1);
  add(ids[3], "pre", 6); // brez drugega preizkusa: ni v primerjavi pred/po
  q = impactReport(db, 3).quiz;
  assert.equal(q.nPre, 4);
  assert.ok(q.pre > 0);
  assert.equal(q.nPaired, "< 3", "število pod pragom ni natančno");
  assert.equal(q.pairedPre, null, "pod pragom");
  add(ids[2], "post", 4);
  q = impactReport(db, 3).quiz;
  assert.equal(q.nPaired, 3);
  assert.equal(q.pairedPre, Math.round(((2 + 3 + 1) / 18) * 1000) / 1000);
  assert.equal(q.pairedPost, Math.round(((4 + 3 + 4) / 18) * 1000) / 1000);
  assert.equal(q.diff, Math.round((5 / 18) * 1000) / 1000);
  const md = pilotTasksMarkdown(pilotTasksReport(db));
  assert.match(md, /## Preizkus znanja/);
  assert.match(md, /razlika \+28 odstotnih točk/);
  // Samo »Ne vem« (-1 pri vseh nalogah): ni v povprečjih, šteje se posebej.
  const u5 = Number(db.prepare("INSERT INTO students (name, settings) VALUES ('U5', '{}')").run().lastInsertRowid);
  db.prepare("INSERT INTO pilot_quiz (student_id, phase, topic_id, items, answers, score, finished_at) VALUES (?, 'pre', 't', '[]', '[-1,-1,-1,-1,-1,-1]', 0, datetime('now'))").run(u5);
  let q2 = impactReport(db, 3).quiz;
  assert.equal(q2.nPre, 5);
  assert.equal(q2.allSkip, 0, "šteje se samo v paketu (A4): peti še ni v paketu po 3");
  const u6 = Number(db.prepare("INSERT INTO students (name, settings) VALUES ('U6', '{}')").run().lastInsertRowid);
  db.prepare("INSERT INTO pilot_quiz (student_id, phase, topic_id, items, answers, score, finished_at) VALUES (?, 'pre', 't', '[]', '[1,0,0,0,0,0]', 1, datetime('now', '+1 second'))").run(u6);
  q2 = impactReport(db, 3).quiz;
  assert.equal(q2.allSkip, 1);
  assert.equal(q2.shownPre, 5, "samo z »Ne vem« ni v povprečju");
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
    // Račun, ki je potrdil obvestilo prejšnje različice (2026-11-06), ob različici 2026-11-10 (#511) obvestilo vidi znova, enkrat.
    assert.equal(PRIVACY_VERSION, "2026-11-10");
    store.db.prepare("UPDATE parents SET privacy_seen = '2026-11-06' WHERE id = ?").run(a.pid);
    assert.equal((await status()).privacy_notice, "2026-11-10");
    assert.equal((await a.call("/api/account/privacy-seen", { method: "POST", body: { password: "geslo1234" } })).body.parent.privacy_notice, null);
    assert.equal((await status()).privacy_notice, null);
  });
  assert.ok(ownerOnly("/account/privacy-seen", "POST"));
  assert.ok(ownerOnly("/account/pilot-wtp", "POST"));
  for (const k of ["starsi.privTitle", "starsi.privText", "starsi.privRead", "starsi.privPw", "starsi.privHide", "starsi.wtpSkip", "pn.quizTitle"]) assert.ok(SL[k], k);
  assert.match(SL["starsi.privText"], /Nič vam ni treba narediti\./);
  assert.equal(SL["starsi.wtpSkip"], "Raje ne povem");
});

test("preizkus znanja brez stropa: naslednja neosvojena tema, 2/2/2 težavnost, ob 6/6 še 3 težje, strop posebej pri skrbniku", async () => {
  process.env.EVKLID_PILOT_VSI = "1";
  try {
    await withServer({}, async ({ client, store }) => {
      const db = store.db;
      const call = client();
      const mk = async (name) => (await call("/api/students", { method: "POST", body: { name, settings: { curriculum_level: "8. razred" } } })).body.id;
      const start = async (sid, phase = "pre") => call(`/api/students/${sid}/pilot/quiz`, { method: "POST", body: { phase } });
      assert.deepEqual(QUIZ_LEVELS, [1, 1, 2, 2, 3, 3], "2 lažji, 2 srednji, 2 težji");
      // Osvojena tema ni izbrana: drugi učenec ima prvo izbrano temo osvojeno.
      const a = await mk("A");
      await start(a);
      const t0 = db.prepare("SELECT topic_id FROM pilot_quiz WHERE student_id = ?").get(a).topic_id;
      const b = await mk("B");
      db.prepare("INSERT INTO topic_state (student_id, topic_id, status, mastered_at) VALUES (?, ?, 'mastered', datetime('now'))").run(b, t0);
      db.prepare("INSERT INTO topic_state (student_id, topic_id, status) VALUES (?, 'x/učim-se', 'learning')").run(b);
      await start(b);
      const tb = db.prepare("SELECT topic_id FROM pilot_quiz WHERE student_id = ?").get(b).topic_id;
      assert.notEqual(tb, t0, "osvojena tema ni v preizkusu");
      assert.notEqual(db.prepare("SELECT status FROM topic_state WHERE student_id = ? AND topic_id = ?").get(b, tb)?.status, "mastered");

      // Strop: vseh 6 pravilno → še 3 težje (raven 3), XP šele po zadnji.
      const pre = db.prepare("SELECT * FROM pilot_quiz WHERE student_id = ? AND phase = 'pre'").get(a);
      let out;
      for (let i = 0; i < QUIZ_LEVELS.length; i++) out = await call(`/api/students/${a}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: i, answer: rightAnswer(pre, i) } });
      assert.equal(out.status, 200, JSON.stringify(out.body));
      assert.equal(out.body.run.done, false);
      assert.equal(out.body.run.total, QUIZ_LEVELS.length + QUIZ_EXTRA.length);
      assert.equal(out.body.run.harder, true);
      assert.equal(out.body.gained, 0);
      const ext = db.prepare("SELECT * FROM pilot_quiz WHERE student_id = ? AND phase = 'pre'").get(a);
      const extra = JSON.parse(ext.items).slice(QUIZ_LEVELS.length);
      assert.deepEqual(extra.map((x) => x.level), QUIZ_EXTRA);
      assert.ok(extra.every((x) => x.topic), "dodatne naloge imajo svojo temo (naslednja na poti)");
      for (let i = QUIZ_LEVELS.length; i < QUIZ_LEVELS.length + QUIZ_EXTRA.length; i++) out = await call(`/api/students/${a}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: i, skip: true } });
      assert.equal(out.body.run.done, true);
      assert.equal(out.body.run.score, QUIZ_LEVELS.length);
      assert.equal(out.body.gained, XP.quiz);
      // Drugi preizkus: ista sestava, tudi dodatne težje naloge iz iste teme kot prvič.
      db.prepare(`UPDATE pilot_quiz SET finished_at = datetime('now', '-${QUIZ_GAP_DAYS} days', '-1 minute') WHERE student_id = ?`).run(a);
      assert.equal((await start(a, "post")).body.run.total, QUIZ_LEVELS.length + QUIZ_EXTRA.length);
      const post = JSON.parse(db.prepare("SELECT items FROM pilot_quiz WHERE student_id = ? AND phase = 'post'").get(a).items);
      assert.deepEqual(post.map((x) => x.level), [...QUIZ_LEVELS, ...QUIZ_EXTRA]);
      assert.equal(post[QUIZ_LEVELS.length].topic, extra[0].topic);
      // Skrbnik: strop je posebej, ne v povprečju ostalih.
      const postRow = db.prepare("SELECT * FROM pilot_quiz WHERE student_id = ? AND phase = 'post'").get(a);
      await call(`/api/students/${a}/pilot/quiz/answer`, { method: "POST", body: { phase: "post", index: 0, answer: rightAnswer(postRow, 0) } });
      for (let i = 1; i < post.length; i++) await call(`/api/students/${a}/pilot/quiz/answer`, { method: "POST", body: { phase: "post", index: i, skip: true } });
      const q = impactReport(db, 1).quiz;
      assert.equal(q.ceiling.nPre, 1);
      assert.equal(q.ceiling.nPaired, 1);
      assert.equal(q.ceiling.pairedPre, Math.round((6 / 9) * 1000) / 1000);
      assert.equal(q.ceiling.pairedPost, Math.round((1 / 9) * 1000) / 1000);
      assert.equal(q.shownPre, 0, "strop ni v začetnem povprečju");
      assert.equal(q.nPre, 1, "natančno je samo skupno število");
      assert.match(pilotTasksMarkdown(pilotTasksReport(db)), /strop \(prvič 6\/6/);
    });
  } finally {
    delete process.env.EVKLID_PILOT_VSI;
  }
});
