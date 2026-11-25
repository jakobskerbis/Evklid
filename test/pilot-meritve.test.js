// Meritve pilota (N-09, server/pilot-meritve.js): vrnitev po 7, 14 in 30 dneh od začetka v pilotu, samostojnost
// (pravilno v 1. poskusu brez namiga in brez vprašanja inštruktorju), napake po temah, strošek AI na učenca. Samo
// člani, brez imen, vse šele od 5 učencev; čas prvega odgovora (tasks.answered_at) je v izvozu in se izbriše s profilom.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { pilotMetrics, PRAG } from "../server/pilot-meritve.js";
import { growthReport } from "../server/rast.js";
import { EUR_PER_USD } from "../server/usage.js";
import { getTopic } from "../server/curriculum.js";
import { pilotTasksReport, pilotTasksMarkdown } from "../server/pilot-naloge.js";

const quiet = { error() {}, warn() {}, info() {}, log() {} };
const DAY = 86400000;
const NOW = Date.parse("2026-12-21T00:00:00Z"); // ponedeljek: posnetek tega tedna je ravno NOW
const ts = (daysAgo, min = 0) => new Date(NOW - daysAgo * DAY + min * 60000).toISOString().replace("T", " ").slice(0, 19);
const T1 = "MAT-SS-1/linearne-enacbe";
const T2 = "MAT-SS-2/koreni";

function fixture() {
  const store = openDb(":memory:");
  createApp(store, { accounts: true, scheduler: false, log: quiet });
  const db = store.db;
  const kid = (name, daysAgo) => Number(db.prepare("INSERT INTO students (name, settings, created_at) VALUES (?, '{}', ?)").run(name, ts(daysAgo)).lastInsertRowid);
  const s = ["Ana", "Bor", "Cene", "Dan", "Eva", "Fran"].map((n) => kid(n, 40));
  const out = kid("Zunaj", 40);
  // Prvi štirje so v računu, ki ga je skrbnik dodal v pilot pred 40 dnevi; Eva in Fran sta odprla naloge pilota pred 33
  // in 10 dnevi (začetek je prej od obeh).
  const pid = Number(db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code, pilot_at) VALUES ('p@x.si', 'x', '1', 'u', 'r', ?)").run(ts(40)).lastInsertRowid);
  for (const id of s.slice(0, 4)) db.prepare("UPDATE students SET parent_id = ? WHERE id = ?").run(pid, id);
  db.prepare("INSERT INTO pilot_state (student_id, joined_at) VALUES (?, ?)").run(s[4], ts(33));
  db.prepare("INSERT INTO pilot_state (student_id, joined_at) VALUES (?, ?)").run(s[5], ts(10));
  // Aktivnost: Ana 8. dan (točke), Cene 9. dan (vprašanje inštruktorju), Bor 15. dan (naloga), Dan 8. dan samo točke pilota.
  const xp = (sid, d, reason = "naloga") => db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 1, ?, ?)").run(sid, reason, ts(d));
  xp(s[0], 32);
  xp(s[3], 32, "pilot: quiz:pre");
  db.prepare("INSERT INTO events (student_id, subject, created_at) VALUES (?, 'MAT', ?)").run(s[1], ts(25));
  const conv = (sid) => Number(db.prepare("INSERT INTO conversations (student_id, created_at, updated_at) VALUES (?, ?, ?)").run(sid, ts(40), ts(0)).lastInsertRowid);
  const msg = (c, at) => db.prepare("INSERT INTO messages (conversation_id, role, api_content, display_text, created_at) VALUES (?, 'user', '\"x\"', 'x', ?)").run(c, at);
  msg(conv(s[2]), ts(31));
  for (let d = 0; d < 40; d++) xp(out, d); // ni član: ne šteje nikjer
  // Naloge vadnice.
  const task = (sid, { topic = T1, mode = "practice", d = 5, ftc = 1, hint = 0, answered = true }) =>
    db.prepare("INSERT INTO tasks (student_id, topic_id, mode, level, payload, hint_used, first_try_correct, created_at, answered_at) VALUES (?, ?, ?, 1, '{}', ?, ?, ?, ?)").run(
      sid, topic, mode, hint, ftc, ts(d), answered ? ts(d, 2) : null);
  for (const id of s.slice(0, 5)) task(id, {}); // samostojno
  task(s[0], { hint: 1 }); // z namigom
  task(s[1], { d: 4 }); // vmes vprašanje inštruktorju
  msg(conv(s[1]), ts(4, 1));
  task(s[2], { ftc: 0 }); // napačno v 1. poskusu
  task(s[3], { ftc: 0, answered: false }); // stara naloga brez časa odgovora: ni v samostojnosti, je v napakah
  task(s[4], { mode: "quiz" }); // ni vadnica
  task(s[4], { d: 35 }); // pred začetkom v pilotu
  task(s[0], { ftc: null }); // še brez odgovora
  task(s[0], { topic: T2, ftc: 0 }); // tema z enim učencem
  for (let i = 0; i < 6; i++) task(out, { ftc: 0 });
  // Poraba AI: vseh pet prvih v pilotu; Eva še 9 $ pred začetkom, Ana 100 $ po posnetku (ne šteje).
  const use = (sid, usd, d) => db.prepare("INSERT INTO usage (student_id, model, cost_usd, created_at) VALUES (?, 'x', ?, ?)").run(sid, usd, ts(d));
  use(s[0], 1, 5);
  use(s[1], 0.2, 6);
  use(s[2], 0.3, 7);
  use(s[3], 0.1, 8);
  use(s[4], 0.5, 3);
  use(s[4], 9, 35);
  use(s[0], 100, -1);
  use(out, 50, 2);
  const members = new Set(s);
  return { store, db, s, out, members, isMember: (id) => members.has(id) };
}

test("meritve pilota: vrnitev 7/14/30, samostojnost, napake po temah, strošek AI na učenca, samo člani", () => {
  const { db, isMember } = fixture();
  const m = pilotMetrics(db, { isMember, now: NOW });
  assert.equal(m.n, 6);
  assert.equal(m.cohort, 5, "paket po 5 po vrsti začetka: Fran (začel zadnji) še ni v kohorti");
  assert.equal(m.asOf, "2026-12-21");
  assert.equal(m.few, false);
  assert.equal(m.min, PRAG);
  assert.equal(PRAG, 5);
  // Vrnitev: Eva (začetek pred 33 dnevi) ne za 30 dni, zato je tam samo »< 5«.
  assert.deepEqual(m.retention.d7, { eligible: 5, returned: 2, pct: 0.4 }, "Ana (točke) in Cene (inštruktor); točke pilota ne štejejo");
  assert.deepEqual(m.retention.d14, { eligible: 5, returned: 1, pct: 0.2 }, "Bor 15. dan");
  assert.deepEqual(m.retention.d30, { eligible: "< 5", returned: null, pct: null });
  // Samostojnost: 9 nalog s časom odgovora (5 samostojnih; z namigom, z vprašanjem vmes, napačni v T1 in T2 ne).
  assert.deepEqual(m.independence, { students: 5, tasks: 9, independent: 5, pct: 0.556 });
  // Napake: samo T1 (5 učencev); T2 ima enega učenca in je skrita.
  assert.equal(m.errors.length, 1);
  assert.deepEqual(m.errors[0], { topic: getTopic(T1)?.name || T1, students: 5, tasks: 9, wrongPct: 0.222 });
  assert.equal(m.hiddenTopics, 1);
  // Strošek: EUR na 30 dni v pilotu do posnetka; poraba pred začetkom in po posnetku ne šteje.
  const e = EUR_PER_USD();
  const per = [(1 * e) / 40, (0.2 * e) / 40, (0.3 * e) / 40, (0.1 * e) / 40, (0.5 * e) / 33].map((x) => x * 30).sort((a, b) => a - b);
  assert.deepEqual(m.ai, {
    students: 5,
    users: 5,
    eurPerStudentMonth: Math.round((per.reduce((a, b) => a + b, 0) / 5) * 1000) / 1000,
    medianEurPerStudentMonth: Math.round(per[2] * 1000) / 1000,
  });
  // Brez imen in brez številk profilov.
  const json = JSON.stringify(m);
  for (const name of ["Ana", "Bor", "Cene", "Dan", "Eva", "Fran", "Zunaj"]) assert.doesNotMatch(json, new RegExp(name));
});

test("meritve pilota: pod pragom 5 samo »< 5«, strošek AI šele od 5 uporabnikov", () => {
  const { db, s, members, isMember } = fixture();
  const strict = pilotMetrics(db, { isMember, now: NOW, min: 6 });
  assert.equal(strict.n, 6);
  assert.equal(strict.cohort, 6);
  assert.equal(strict.retention.d7.pct, null, "5 upravičenih je pod pragom 6");
  assert.equal(strict.retention.d7.eligible, "< 6");
  assert.deepEqual(strict.independence, { students: "< 6", tasks: null, independent: null, pct: null });
  assert.deepEqual(strict.errors, []);
  assert.equal(strict.hiddenTopics, 2);
  assert.deepEqual(strict.ai, { students: 6, users: "< 6", eurPerStudentMonth: null, medianEurPerStudentMonth: null }, "5 uporabnikov je pod pragom 6");
  db.prepare("DELETE FROM usage WHERE student_id = ?").run(s[3]);
  const four = pilotMetrics(db, { isMember, now: NOW });
  assert.deepEqual(four.ai, { students: 5, users: "< 5", eurPerStudentMonth: null, medianEurPerStudentMonth: null });
  members.clear();
  s.slice(0, 4).forEach((id) => members.add(id));
  assert.deepEqual(pilotMetrics(db, { isMember, now: NOW }), { n: "< 5", min: 5, asOf: "2026-12-21", few: true });
  members.clear();
  assert.deepEqual(pilotMetrics(db, { isMember, now: NOW }), { n: 0, min: 5, asOf: "2026-12-21", few: true });
});

test("meritve pilota: iz razlike dveh poročil se posameznik ne da razbrati (tedenski posnetek, paketi po 5)", () => {
  const { db, s, members, isMember } = fixture();
  const r0 = pilotMetrics(db, { isMember, now: NOW });
  // Med tednom (dan za dnem) se poročilo ne spremeni, tudi ko pride nova aktivnost ali nov član.
  db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 1, 't', ?)").run(s[3], ts(-1));
  for (const d of [1, 3, 6]) assert.deepEqual(pilotMetrics(db, { isMember, now: NOW + d * DAY + 3600000 }), r0, `dan ${d}`);
  // Naslednji teden: nov član sam ne spremeni kohorte (paket po 5); upravičenih za vrnitev v paketih po 5.
  const join = (d) => {
    const id = Number(db.prepare("INSERT INTO students (name, settings, created_at) VALUES ('Gal', '{}', ?)").run(ts(d)).lastInsertRowid);
    db.prepare("INSERT INTO pilot_state (student_id, joined_at) VALUES (?, ?)").run(id, ts(d));
    members.add(id);
  };
  join(30);
  const r1 = pilotMetrics(db, { isMember, now: NOW + 7 * DAY });
  assert.equal(r1.n, 7);
  assert.equal(r1.cohort, 5, "šesti in sedmi še nista v kohorti");
  assert.equal(r1.retention.d7.eligible, 5);
  assert.equal(r1.retention.d30.eligible, 5, "Eva po 40 dneh dopolni paket upravičenih");
  for (let i = 0; i < 3; i++) join(20);
  const r2 = pilotMetrics(db, { isMember, now: NOW + 7 * DAY });
  assert.equal(r2.cohort, 10, "kohorta zraste za cel paket");
});

test("meritve pilota: v poročilu skrbnika in povzetku brez imen; naloge s časom odgovora izbrisane s profilom", () => {
  const { db, s } = fixture();
  process.env.EVKLID_PILOT_VSI = "1";
  try {
    const r = pilotTasksReport(db);
    assert.ok(r.meritve.n >= 6 && !r.meritve.few, "z EVKLID_PILOT_VSI so člani vsi profili (n so tisti, ki so začeli pred posnetkom)");
    const md = pilotTasksMarkdown(r);
    assert.match(md, /## Meritve pilota \(člani: \d+; tedenski posnetek do \d{4}-\d{2}-\d{2}\)/);
    assert.match(md, /samostojnost \(pravilno v 1\. poskusu brez namiga in inštruktorja\)/);
    assert.match(md, /strošek AI na učenca na 30 dni/);
    for (const name of ["Ana", "Bor", "Cene", "Zunaj"]) assert.doesNotMatch(md, new RegExp(name));
  } finally {
    delete process.env.EVKLID_PILOT_VSI;
  }
  // Izbris profila izbriše naloge s časom odgovora (ON DELETE CASCADE) in porabo ne pušča v meritvah.
  db.prepare("DELETE FROM students WHERE id = ?").run(s[0]);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM tasks WHERE student_id = ?").get(s[0]).n, 0);
});

test("odgovor na nalogo vadnice shrani čas prvega odgovora enkrat (tasks.answered_at), ta je v izvozu računa", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, log: quiet, resendKey: "re_x", fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ id: "e" }) }) });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = {};
  const call = async (path, body) => {
    const res = await fetch(base + path, {
      method: body ? "POST" : "GET",
      headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
      body: body ? JSON.stringify(body) : undefined,
    });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      const i = kv.indexOf("=");
      jar[kv.slice(0, i)] = kv.slice(i + 1);
    }
    return { status: res.status, body: await res.json().catch(() => null) };
  };
  const warn = console.warn;
  console.warn = () => {};
  try {
    const y = new Date().getFullYear() - 30;
    assert.equal((await call("/api/auth/register", { email: "cas@pilot.si", password: "geslo1234", accept_privacy: true, country: "SI", birth_date: `${y}-01-15` })).status, 201);
    store.db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = ?").run("cas@pilot.si");
    const sid = (await call("/api/students", { name: "Ana", self: true, consent: true })).body.id;
    assert.ok(sid);
    const ex = await call(`/api/students/${sid}/practice/next`, { topic_id: T1 });
    assert.ok(ex.body.example, "najprej zgled");
    const t = await call(`/api/students/${sid}/practice/next`, { topic_id: T1 });
    const id = t.body.task?.id;
    assert.ok(id, JSON.stringify(t.body).slice(0, 200));
    assert.equal(store.db.prepare("SELECT answered_at FROM tasks WHERE id = ?").get(id).answered_at, null);
    const wrong = async (x) => {
      const r = await call(`/api/students/${sid}/tasks/${id}/answer`, { answer: x });
      assert.equal(r.status, 200, JSON.stringify(r.body));
      assert.equal(r.body.correct, false, JSON.stringify(r.body).slice(0, 200));
    };
    await wrong("123457");
    const first = store.db.prepare("SELECT answered_at, first_try_correct, attempts FROM tasks WHERE id = ?").get(id);
    assert.ok(first.answered_at, "čas prvega odgovora");
    assert.equal(first.first_try_correct, 0);
    // Izvoz računa (GDPR) vsebuje čas prvega odgovora.
    const exp = await call("/api/account/export", { password: "geslo1234" });
    assert.equal(exp.status, 200, JSON.stringify(exp.body).slice(0, 200));
    const tasks = exp.body.children.find((c) => c.tasks?.length).tasks;
    assert.equal(tasks[0].answered_at, first.answered_at, "answered_at je v izvozu računa");
    // Naloga s prvim odgovorom pred to različico (brez časa): drugi odgovor časa ne doda (sicer napačno okno).
    store.db.prepare("UPDATE tasks SET answered_at = NULL WHERE id = ?").run(id);
    await wrong("123458");
    assert.equal(store.db.prepare("SELECT attempts FROM tasks WHERE id = ?").get(id).attempts, 2);
    assert.equal(store.db.prepare("SELECT answered_at FROM tasks WHERE id = ?").get(id).answered_at, null);
  } finally {
    console.warn = warn;
    server.close();
  }
});

test("rast: vrnitev po 14 in 30 dneh (okno 7 dni, profil šteje, ko je okno celo minilo)", () => {
  const { db } = (() => {
    const store = openDb(":memory:");
    createApp(store, { accounts: true, scheduler: false, log: quiet });
    return store;
  })();
  const kid = (d) => Number(db.prepare("INSERT INTO students (name, settings, created_at) VALUES ('k', '{}', ?)").run(ts(d)).lastInsertRowid);
  const xp = (sid, d) => db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 1, 't', ?)").run(sid, ts(d));
  const [a, b, c] = [kid(40), kid(40), kid(25)];
  xp(a, 25); // 15. dan
  xp(a, 9); // 31. dan
  xp(c, 11); // 14. dan
  xp(b, 2); // 38. dan: zunaj okna 30–36
  const r = growthReport(db, { days: 60, now: NOW });
  assert.deepEqual(r.d14, { eligible: 3, returned: 2, pct: 0.667 });
  assert.deepEqual(r.d30, { eligible: 2, returned: 1, pct: 0.5 });
});
