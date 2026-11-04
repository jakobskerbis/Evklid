import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { Progress, RULES } from "../server/progress.js";
import { roundHalfUp, fmt } from "../server/practice/check.js";
import { windowHistory } from "../server/usage.js";
import { nowParts } from "../server/schedule.js";

function correctInput(a) {
  if (a.type === "number") return (a.decimals != null ? fmt(roundHalfUp(a.value, a.decimals), a.decimals) : fmt(a.value)) + (a.unit ? " " + a.unit : "");
  if (a.type === "fraction") return `${a.num}/${a.den}`;
  if (a.type === "choice") return String(a.index);
  return a.values.join(",");
}
function setup() {
  const store = openDb(":memory:");
  const p = new Progress(store);
  const s = store.createStudent("Ana");
  return { store, p, s };
}
const TOPIC = "MAT-OS-8/pitagorov-izrek";

test("first practice shows a worked example, then tasks", () => {
  const { p, s } = setup();
  const first = p.nextPractice(s.id, TOPIC);
  assert.ok(first.example && first.example.solution);
  const second = p.nextPractice(s.id, TOPIC);
  assert.ok(second.task.id);
  assert.equal(second.task.answerType, "number");
  assert.equal(second.task.solution, undefined); // odgovor ostane na strežniku
});

test("difficulty adapts and topic is mastered after 8/10 with 2 hard", () => {
  const { p, s } = setup();
  p.nextPractice(s.id, TOPIC);
  let mastered = false, levels = [];
  for (let i = 0; i < 12 && !mastered; i++) {
    const { task } = p.nextPractice(s.id, TOPIC);
    levels.push(task.level);
    const row = p.getTask(task.id);
    const res = p.answer(s.id, task.id, correctInput(row.payload.answer));
    assert.equal(res.correct, true, JSON.stringify(res));
    assert.ok(res.xp.gained > 0);
    mastered = !!res.mastered;
  }
  assert.deepEqual(levels.slice(0, 7), [1, 1, 1, 2, 2, 2, 3]);
  assert.ok(mastered);
  const st = p.state(s.id, TOPIC);
  assert.equal(st.status, "mastered");
  assert.ok(st.review_due);
});

test("a mistake lowers difficulty and returns a hint, not the solution", () => {
  const { p, s } = setup();
  p.nextPractice(s.id, TOPIC);
  const st = p.state(s.id, TOPIC);
  st.level = 2;
  p.saveState(st);
  const { task } = p.nextPractice(s.id, TOPIC);
  const wrong = `99999 ${p.getTask(task.id).payload.answer.unit || ""}`;
  const res = p.answer(s.id, task.id, wrong);
  assert.equal(res.correct, false);
  assert.ok(res.hint);
  assert.equal(res.solution, undefined);
  assert.equal(res.levelDown, 1);
  // Še dva napačna poskusa: nato rešen zgled
  p.answer(s.id, task.id, wrong);
  const last = p.answer(s.id, task.id, wrong);
  assert.ok(last.solution);
});

test("all units open; later units only get a recommendation; placement test skips a unit", () => {
  const { p, s } = setup();
  let view = p.pathView(s.id, "MAT-OS-8");
  assert.ok(view.units.every((u) => u.locked === undefined), "ni več ključavnic");
  assert.equal(view.units[0].ahead, false);
  assert.equal(view.units[1].ahead, true);
  // Priporočilo kaže na prvo neosvojeno temo prejšnjega sklopa z vajami.
  const first = view.units[0].topics.find((t) => t.practice);
  assert.deepEqual(view.units[1].suggest, { unit: view.units[0].title, topic: { id: first.id, name: first.name } });
  assert.ok(view.units.filter((u) => u.ahead).every((u) => u.suggest.topic.id === first.id), "vsi sklopi naprej kažejo tja, kjer učenec je");
  // Sklop »naprej« lahko vadiš takoj (prej je bil zaklenjen).
  const later = p.startUnit(s.id, "MAT-OS-8", 2);
  assert.ok(later.task.id, "vaja sklopa naprej deluje");
  view = p.pathView(s.id, "MAT-OS-8");
  assert.equal(view.units[2].ahead, false, "začet sklop ni več »naprej«");
  assert.equal(view.units[2].suggest, undefined);
  const start = p.startPlacement(s.id, "MAT-OS-8", 0);
  let next = start, result;
  while (!next.finished) {
    const row = p.getTask(next.task.id);
    const res = p.answer(s.id, next.task.id, correctInput(row.payload.answer));
    next = res.next;
    result = res.placement;
  }
  assert.equal(result.passed, true);
  view = p.pathView(s.id, "MAT-OS-8");
  assert.equal(view.units[0].mastered, true);
  assert.equal(view.units[1].ahead, false);
  assert.equal(view.units[1].suggest, undefined);
});

test("review mixes due topics and pushes the next review out", () => {
  const { p, s, store } = setup();
  for (const t of ["MAT-OS-8/pitagorov-izrek", "MAT-OS-8/linearne-enacbe"]) p.markMastered(s.id, t, "manual");
  store.db.prepare("UPDATE topic_state SET review_due = datetime('now','-1 hour')").run();
  let next = p.startReview(s.id);
  const topics = new Set();
  while (!next.finished) {
    const row = p.getTask(next.task.id);
    topics.add(row.topic_id);
    next = p.answer(s.id, next.task.id, correctInput(row.payload.answer)).next;
  }
  assert.equal(topics.size, 2);
  assert.equal(p.dueTopics(s.id).length, 0);
  assert.ok(p.state(s.id, "MAT-OS-8/pitagorov-izrek").review_stage >= 1);
});

test("review and its badge cover only the selected subject (NAR also matches FIZ/KEM/BIO)", () => {
  const { p, s, store } = setup();
  for (const t of ["MAT-OS-8/pitagorov-izrek", "FIZ-OS-8/merske-napake"]) p.markMastered(s.id, t, "manual");
  store.db.prepare("UPDATE topic_state SET review_due = datetime('now','-1 hour')").run();
  assert.deepEqual(p.dueTopics(s.id, "MAT"), ["MAT-OS-8/pitagorov-izrek"]);
  assert.deepEqual(p.dueTopics(s.id, "FIZ"), ["FIZ-OS-8/merske-napake"]);
  assert.equal(p.dueTopics(s.id).length, 2);
  assert.equal(p.dueTopics(s.id, "NAR").length, 1); // fizika iz 8. razreda šteje k naravoslovju
  assert.equal(p.modes(s.id, "FIZ-OS-8").dueCount, 1);
  assert.equal(p.pathView(s.id, "MAT-OS-8").dueCount, 1);
  const mat = p.startReview(s.id, { subject: "MAT" });
  assert.equal(p.getTask(mat.task.id).topic_id, "MAT-OS-8/pitagorov-izrek");
  // Odprta serija drugega predmeta se ne nadaljuje: fizika dobi svojo.
  const fiz = p.startReview(s.id, { subject: "FIZ" });
  assert.equal(p.getTask(fiz.task.id).topic_id, "FIZ-OS-8/merske-napake");
  assert.equal(p.startReview(s.id, { subject: "MAT" }).sessionId, mat.sessionId);
});

test("history window trims in chunks so the cached prefix stays stable", () => {
  const msgs = (n) => Array.from({ length: n }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: String(i) }));
  assert.equal(windowHistory(msgs(19), 10).length, 19); // 10 izmenjav
  assert.equal(windowHistory(msgs(37), 10).length, 37); // 19 izmenjav: še vse
  assert.equal(windowHistory(msgs(39), 10)[0].content, "20"); // 20 izmenjav: odrežemo 10
  assert.equal(windowHistory(msgs(55), 10)[0].content, "20"); // enak začetek do 29 izmenjav
});

test("practice resumes the same unanswered task", () => {
  const { p, s } = setup();
  p.nextPractice(s.id, TOPIC); // zgled
  const a = p.nextPractice(s.id, TOPIC);
  const b = p.nextPractice(s.id, TOPIC);
  assert.equal(b.task.id, a.task.id);
  assert.ok(b.resumed);
});

test("daily training mixes ~70% new and ~30% review, resumes, and gives a bonus", () => {
  const { p, s } = setup();
  const path = "MAT-OS-8";
  // dve osvojeni temi, ki sta na vrsti za ponavljanje
  const view = p.pathView(s.id, path);
  const practiceTopics = view.units.flatMap((u) => u.topics).filter((t) => t.practice);
  for (const t of practiceTopics.slice(0, 2)) {
    p.markMastered(s.id, t.id, "manual");
    p.db.prepare("UPDATE topic_state SET review_due = '2000-01-01 00:00:00' WHERE student_id = ? AND topic_id = ?").run(s.id, t.id);
  }
  const first = p.startDaily(s.id, path);
  assert.equal(first.total, 10);
  const again = p.startDaily(s.id, path);
  assert.equal(again.task.id, first.task.id); // nadaljevanje
  const sess = p.getSession(first.sessionId);
  const modes = sess.plan.map((x) => x.mode);
  assert.equal(modes.filter((m) => m === "review").length, 3);
  assert.equal(modes.filter((m) => m === "practice").length, 7);
  assert.ok(modes.indexOf("review") < 5); // ponavljanje je vmes, ne šele na koncu
  let next = first, bonus = null;
  for (let i = 0; i < 20 && !next.finished; i++) {
    const row = p.getTask(next.task.id);
    const r = p.answer(s.id, next.task.id, correctInput(row.payload.answer));
    next = r.next;
    if (next.finished) bonus = next.xp;
  }
  assert.ok(next.finished);
  assert.ok(bonus.items.some((x) => x.reason === "dnevni trening"));
  assert.equal(p.modes(s.id, path).daily.done, true);
});

test("daily flips to mostly review when review piles up", () => {
  const { p, s } = setup();
  const path = "MAT-OS-8";
  const all = p.pathView(s.id, path).units.flatMap((u) => u.topics).filter((t) => t.practice);
  for (const t of all.slice(0, 9)) {
    p.markMastered(s.id, t.id, "manual");
    p.db.prepare("UPDATE topic_state SET review_due = '2000-01-01 00:00:00' WHERE student_id = ? AND topic_id = ?").run(s.id, t.id);
  }
  p.setStatus(s.id, all[9].id, "learning");
  const m = p.modes(s.id, path);
  assert.ok(m.suggestReview);
  const d = p.startDaily(s.id, path);
  const plan = p.getSession(d.sessionId).plan;
  assert.equal(plan.filter((x) => x.mode === "review").length, 7);
  const q = p.startReview(s.id, { quick: true });
  assert.equal(q.total, RULES.quickReviewTasks);
});

test("test prep: harder tasks closer to the date; unit practice in every unit", () => {
  const { p, s } = setup();
  const path = "MAT-OS-8";
  const view = p.pathView(s.id, path);
  const ui = view.units.findIndex((u) => u.hasPractice);
  // Slovenski dan, kot ga šteje progress.testPlan (nowParts), sicer test pade med 23:00 in 24:00 UTC.
  const base = Date.parse(`${nowParts().date}T12:00:00Z`);
  const later = new Date(base + 10 * 86400000).toISOString().slice(0, 10);
  const soon = new Date(base + 1 * 86400000).toISOString().slice(0, 10);
  assert.equal(p.setTestPlan(s.id, path, [], later), null);
  p.setTestPlan(s.id, path, [ui], later);
  const far = p.getSession(p.startTest(s.id).sessionId).plan;
  p.setTestPlan(s.id, path, [ui], soon);
  const near = p.getSession(p.startTest(s.id).sessionId).plan;
  const avg = (pl) => pl.reduce((a, x) => a + x.level, 0) / pl.length;
  assert.ok(avg(near) > avg(far));
  assert.equal(p.testPlan(s.id).daysLeft, 1);
  const ahead = view.units.findIndex((u) => u.ahead && u.hasPractice);
  if (ahead >= 0) assert.ok(p.startUnit(s.id, path, ahead).task.id, "sklopi naprej niso zaklenjeni");
  const u = p.startUnit(s.id, path, ui);
  assert.ok(u.task.id);
  assert.equal(p.startUnit(s.id, path, ui).task.id, u.task.id);
});

test("tekmovanja: trening brez zaklepanja, poskusno tekmovanje s točkami in časom", () => {
  const { p, s } = setup();
  const view = p.pathView(s.id, "MAT-TEK-OS");
  assert.ok(view.units.length > 1 && view.units.every((u) => !u.ahead && !u.suggest), "tekmovalni sklopi so brez priporočil");

  const tr = p.startCompetition(s.id, "MAT-TEK-OS");
  assert.equal(tr.total, 10);
  assert.ok(tr.task.topicName);

  let n = p.startContest(s.id, "MAT-TEK-SS");
  assert.equal(n.total, 10);
  assert.ok(n.deadline > Date.now());
  assert.equal(n.task.points, 3);
  // Prva naloga pravilno, druga narobe, tretjo preskočimo, nato končamo.
  let row = p.getTask(n.task.id);
  let r = p.answer(s.id, n.task.id, correctInput(row.payload.answer));
  assert.equal(r.saved, true);
  assert.equal(r.correct, undefined, "med tekmovanjem ni povratne informacije");
  assert.equal(r.hint, undefined);
  n = r.next;
  const a2 = p.getTask(n.task.id).payload.answer;
  const wrong = a2.type === "number" ? fmt(a2.value + 1000) + (a2.unit ? " " + a2.unit : "") : a2.type === "choice" ? String((a2.index + 1) % a2.options.length) : a2.type === "fraction" ? `${a2.num + 1}/${a2.den}` : a2.values.map((v) => v + 1).join(",");
  r = p.answer(s.id, n.task.id, wrong);
  assert.equal(r.saved, true);
  // En poskus: ponovni odgovor ne šteje znova, vrne shranjeni izid in isto naslednjo nalogo.
  const again = p.answer(s.id, n.task.id, "1");
  assert.equal(again.error, undefined);
  assert.equal(again.closed, true);
  assert.equal(again.correct, false);
  assert.equal(again.next.task.id, r.next.task.id);
  n = r.next;
  r = p.skipContestTask(s.id, n.task.id);
  assert.equal(r.skipped, true);
  assert.equal(p.openContest(s.id, "MAT-TEK-SS") != null, true);
  const res = p.finishContest(r.next.sessionId);
  assert.equal(res.points, 3);
  assert.equal(res.maxPoints, 40);
  assert.equal(res.items[0].correct, true);
  assert.equal(res.items[2].yourAnswer, null);
  assert.ok(res.items[0].task.solution);
  assert.equal(res.xp.gained, 3);
  assert.equal(p.openContest(s.id, "MAT-TEK-SS"), null);
  assert.deepEqual(p.contestHistory(s.id, "MAT-TEK-SS").map((h) => [h.points, h.maxPoints]), [[3, 40]]);
  // Po koncu odgovori ne štejejo več; ponovni zaključek ne doda XP.
  const ids = p.db.prepare("SELECT id FROM tasks WHERE session_id = ? ORDER BY id").all(r.next.sessionId).map((x) => x.id);
  assert.equal(p.answer(s.id, ids.at(-1), "1").error, "To tekmovanje je že končano.");
  assert.equal(p.finishContest(r.next.sessionId).xp, undefined);
});

test("tekmovanja: po izteku časa odgovor ne šteje", () => {
  const { p, s } = setup();
  const n = p.startContest(s.id, "FIZ-TEK-OS");
  const sess = p.getSession(n.sessionId);
  sess.params.deadline = Date.now() - 1000;
  p.db.prepare("UPDATE sessions SET params = ? WHERE id = ?").run(JSON.stringify(sess.params), sess.id);
  const row = p.getTask(n.task.id);
  const r = p.answer(s.id, n.task.id, correctInput(row.payload.answer));
  assert.equal(r.timeUp, true);
  assert.equal(r.contest.points, 0);
  // Nov začetek ustvari novo tekmovanje.
  const again = p.startContest(s.id, "FIZ-TEK-OS");
  assert.notEqual(again.sessionId, n.sessionId);
});

test("prior-knowledge pretest: three levels, one try, skip = not known, sets level and tutor tier", async () => {
  const { studentResults } = await import("../server/results.js");
  const { store, p, s } = setup();
  let out = p.startPretest(s.id, TOPIC);
  assert.equal(out.total, 3);
  assert.equal(out.task.level, 1);
  assert.equal(p.startPretest(s.id, TOPIC).task.id, out.task.id, "odprt test se nadaljuje");
  assert.equal(p.hint(s.id, out.task.id, 1).error, "Pri tej nalogi namigov ni.");
  // Stopnja 1 pravilno, stopnja 2 napačno, stopnja 3 »Tega še ne znam«.
  let r = p.answer(s.id, out.task.id, correctInput(p.getTask(out.task.id).payload.answer));
  assert.equal(r.correct, true);
  assert.equal(r.next.task.level, 2);
  assert.equal(r.solution, undefined, "test ne pokaže rešitve");
  const a2 = p.getTask(r.next.task.id).payload.answer;
  r = p.answer(s.id, r.next.task.id, correctInput(a2.type === "number" ? { ...a2, value: a2.value * 3 + 7 } : { ...a2, index: (a2.index + 1) % 3, num: a2.num + 1, values: (a2.values || []).map((v) => v + 1) }));
  assert.equal(r.correct, false);
  const again = p.answer(s.id, r.next.task.id - 1, "1");
  assert.ok(again.closed && again.correct === false && again.next.task.id === r.next.task.id, "en poskus");
  r = p.skipContestTask(s.id, r.next.task.id);
  assert.equal(r.skipped, true);
  assert.deepEqual({ ...r.pretest, tier: r.pretest.tier }, { correct: 1, total: 3, known: 1, level: 1, tier: "osnovna" });
  const st = p.state(s.id, TOPIC);
  assert.equal(st.status, "learning");
  assert.equal(st.pretest, 1);
  assert.deepEqual(p.startPretest(s.id, TOPIC), { skip: true }, "test je samo enkrat");
  // Napake v testu niso šibke točke; v promptu je rezultat testa.
  assert.equal(store.topicStats(s.id).length, 0);
  const res = studentResults(store, s.id, TOPIC);
  assert.match(res.text, /začetni test predznanja: rešene stopnje 1 od 3/);
  assert.equal(res.tier, "osnovna");
  store.db.prepare("UPDATE topic_state SET pretest = 3 WHERE student_id = ?").run(s.id);
  assert.equal(studentResults(store, s.id, TOPIC).tier, "višja");
  // Tema, ki se je učenec že uči, testa nima.
  p.nextPractice(s.id, "MAT-OS-8/uporaba-pitagorovega-izreka");
  assert.deepEqual(p.startPretest(s.id, "MAT-OS-8/uporaba-pitagorovega-izreka"), { skip: true });
});

test("second Preveri on a closed placement task returns the saved verdict, not an error", () => {
  const { p, s } = setup();
  const n = p.startPlacement(s.id, "MAT-OS-8", 0);
  const a = p.getTask(n.task.id).payload.answer;
  const wrong = a.type === "number" ? fmt(a.value + 1000) + (a.unit ? " " + a.unit : "") : a.type === "choice" ? String((a.index + 1) % a.options.length) : a.type === "fraction" ? `${a.num + 1}/${a.den}` : a.values.map((v) => v + 1).join(",");
  const first = p.answer(s.id, n.task.id, wrong);
  assert.equal(first.correct, false);
  // Učenec popravi odgovor in znova pritisne »Preveri« (ali dvakrat tapne).
  const second = p.answer(s.id, n.task.id, correctInput(a));
  assert.equal(second.error, undefined);
  assert.equal(second.closed, true);
  assert.equal(second.correct, false, "velja prvi odgovor");
  assert.equal(second.next.task.id, first.next.task.id, "ista naslednja naloga");
  assert.equal(p.getTask(n.task.id).attempts, 1, "poskus se ne šteje znova");
});

test("closed practice task: repeat check shows the saved result without new XP", () => {
  const { store, p, s } = setup();
  p.nextPractice(s.id, TOPIC);
  const { task } = p.nextPractice(s.id, TOPIC);
  const input = correctInput(p.getTask(task.id).payload.answer);
  const first = p.answer(s.id, task.id, input);
  assert.equal(first.correct, true);
  const xp = store.db.prepare("SELECT COALESCE(SUM(amount), 0) AS x FROM xp_events WHERE student_id = ?").get(s.id).x;
  const again = p.answer(s.id, task.id, input);
  assert.equal(again.closed, true);
  assert.equal(again.correct, true);
  assert.ok(again.solution);
  assert.equal(store.db.prepare("SELECT COALESCE(SUM(amount), 0) AS x FROM xp_events WHERE student_id = ?").get(s.id).x, xp, "brez dodatnih XP");
});

test("international path in the Slovenian UI shows Slovenian topic and unit names", () => {
  const store = openDb(":memory:");
  const p = new Progress(store);
  const sl = store.createStudent("Mojca", { school_system: "NG", curriculum_level: "SS 3", subject: "MAT", language: "sl" });
  const en = store.createStudent("Ada", { school_system: "NG", curriculum_level: "SS 3", subject: "MAT", language: "en" });
  const key = "MAT-INT-12";
  const unitIdx = p.pathView(en.id, key).units.findIndex((u) => u.topics.some((t) => t.name === "Vectors in the plane and in space"));
  assert.ok(unitIdx >= 0, "tema na mednarodni poti");
  const slView = p.pathView(sl.id, key);
  const slTopic = slView.units[unitIdx].topics.find((t) => t.id.endsWith("/vectors-in-the-plane-and-in-space"));
  assert.equal(slTopic.name, "Vektorji v ravnini in prostoru");
  assert.equal(slView.units[unitIdx].title, "Vektorji");
  // Preizkus znanja: naslov nad nalogo je v jeziku vmesnika.
  const tSl = p.startPlacement(sl.id, key, unitIdx);
  const tEn = p.startPlacement(en.id, key, unitIdx);
  assert.ok(!/[A-Z][a-z]+ in the /.test(tSl.task.topicName), tSl.task.topicName);
  assert.notEqual(tSl.task.topicName, tEn.task.topicName);
});

test("XP summary: level progress, today's XP and the daily goal from the profile", () => {
  const { store, p, s } = setup();
  let x = p.xpSummary(s.id);
  assert.deepEqual([x.total, x.level, x.levelFrom, x.levelTo, x.today, x.goal], [0, 1, 0, 50, 0, 50]);
  p.award(s.id, [[60, "pravilno"]]);
  x = p.xpSummary(s.id);
  assert.deepEqual([x.total, x.level, x.levelFrom, x.levelTo, x.today], [60, 2, 50, 200, 60]);
  store.updateStudent(s.id, { settings: { xp_goal: 100 } });
  assert.equal(p.xpSummary(s.id).goal, 100);
  store.updateStudent(s.id, { settings: { xp_goal: 77 } });
  assert.equal(p.xpSummary(s.id).goal, 50, "neznan cilj → privzeti");
});
