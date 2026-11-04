// Šibke točke iz vseh virov (server/weaknesses.js, j 2026-11-04): klepet, Vadnica, igre, učbenik, pole,
// kartice in kviz gredo pod isto temo učne poti; seznam je enak za inštruktorja, Napredek, delovni list in igre.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { recordSkill, skillStats, weakTopicsFor, weaknessesForPrompt, topicIdFor, topicForGame, paperTopics, GAME_MAX } from "../server/weaknesses.js";
import { topicForName } from "../server/lekcija-za-vprasanje.js";
import { loadLesson } from "../server/textbook.js";
import { loadOurPaper, ourPaperIds } from "../server/our-papers.js";
import { partKey } from "../public/our-paper-key.js";
import { weakFor, migrateGameDays } from "../server/games.js";
import { weakTopicIds } from "../server/gradiva.js";
import { sourceWords } from "../server/accounts/weekly.js";

const S8 = { subject: "MAT", curriculum_level: "8. razred", school_system: "SI" };
const LIN = "MAT-OS-8/linearne-enacbe";
const OHM = "FIZ-OS-9/upor-in-ohmov-zakon";

test("weak points: a free topic name maps to a path topic only when the match is clear", () => {
  assert.equal(topicForName("linearne enačbe", S8), LIN);
  assert.equal(topicForName("Pitagorov izrek", S8), "MAT-OS-8/pitagorov-izrek");
  assert.equal(topicForName("Ohmov zakon", { ...S8, subject: "FIZ", curriculum_level: "9. razred" }), OHM);
  assert.equal(topicForName("ulomki", S8), null); // več tem z ulomki: ne ugibamo
  assert.equal(topicForName("enačbe", S8), null);
  assert.equal(topicForName("xyz", S8), null);
  // Predmet imena (META) ima prednost pred predmetom profila.
  assert.equal(topicIdFor(S8, "FIZ", "Newtonovi zakoni"), topicForName("Newtonovi zakoni", { ...S8, subject: "FIZ" }));
});

test("weak points: a game counts at the path topic for the student's year, at most GAME_MAX answers", () => {
  assert.equal(topicForGame(["MAT-OS-7/sestevanje-in-odstevanje-ulomkov"], 8), "MAT-OS-7/sestevanje-in-odstevanje-ulomkov");
  assert.equal(topicForGame([LIN, "MAT-SS-1/linearne-enacbe"], 8), LIN);
  assert.equal(topicForGame([LIN, "MAT-SS-1/linearne-enacbe"], 11), "MAT-SS-1/linearne-enacbe");
  assert.equal(topicForGame(["MAT-SS-1/linearne-enacbe"], 6), "MAT-SS-1/linearne-enacbe"); // le višja: prva
  assert.equal(topicForGame([], 8), null);
  assert.equal(topicForGame(["ni/tema"], 8), null);
  const store = openDb(":memory:");
  const s = store.createStudent("Igralec", S8);
  recordSkill(store.db, s.id, { source: "game", topicId: LIN, n: 30, wrong: 15 });
  const [row] = store.db.prepare("SELECT n, wrong FROM skill_results").all();
  assert.deepEqual({ ...row }, { n: GAME_MAX, wrong: 2 });
  assert.equal(recordSkill(store.db, s.id, { source: "neznano", topicId: LIN }), false);
  assert.equal(recordSkill(store.db, s.id, { source: "game", topicId: "ni/tema" }), false);
  assert.equal(recordSkill(store.db, s.id, { source: "game", topicId: LIN, n: 0 }), false);
});

test("weak points: chat, practice and other sources merge under one path topic", () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Ana", S8);
  const ev = (topic, error, conv, topic_id = null) =>
    store.db.prepare("INSERT INTO events (student_id, conversation_id, subject, topic, error, mode, flag, topic_id) VALUES (?, ?, 'MAT', ?, ?, 'A', 'none', ?)").run(s.id, conv, topic, error, topic_id);
  const conv = store.createConversation(s.id).id;
  // Star zapis iz klepeta brez topic_id (prosto ime) + vaja s topic_id + kartica + vprašanje v učbeniku.
  ev("linearne enačbe", 1, conv);
  ev("Linearne enačbe", 0, null, LIN);
  recordSkill(store.db, s.id, { source: "cards", topicId: LIN, n: 1, wrong: 1 });
  recordSkill(store.db, s.id, { source: "lesson", topicId: LIN, n: 1, wrong: 1 });
  // Tema, ki se ne preslika, ostane pod svojim imenom.
  recordSkill(store.db, s.id, { source: "cards", subject: "MAT", topic: "Čudna tema", n: 1, wrong: 1 });
  const stats = skillStats(store, s);
  const lin = stats.find((x) => x.topic_id === LIN);
  assert.equal(lin.topic, "Linearne enačbe");
  assert.equal(lin.turns, 4);
  assert.equal(lin.errors, 3);
  assert.deepEqual(Object.keys(lin.sources).sort(), ["cards", "chat", "lesson", "practice"]);
  assert.ok(stats.some((x) => !x.topic_id && x.topic === "Čudna tema"));
  const weak = weakTopicsFor(store, s);
  assert.deepEqual(weak.map((w) => w.topic_id), [LIN]);
  assert.ok(weaknessesForPrompt(store, { ...s, manual_weaknesses: [] }).includes("Linearne enačbe (MAT)"));
  // Ista šibka tema v igrah (»Ponovi šibke teme«) in na delovnem listu.
  migrateGameDays(store.db);
  assert.ok(weakFor(store.db, s.id, s).length > 0);
  assert.equal(weakFor(store.db, s.id).length, 0); // brez učenca le zadnji teden nalog in iger, kot doslej
  assert.deepEqual(weakTopicIds(store.db, s.id, 3, s), [LIN]);
  assert.equal(sourceWords(lin.sources), "v klepetu in pri karticah");
  assert.equal(sourceWords({}), "pri nalogah");
});

test("weak points: every paper maps some parts to topics (local search, no AI)", () => {
  let mapped = 0;
  for (const id of ourPaperIds().keys()) mapped += paperTopics(id, loadOurPaper(id)).size;
  assert.ok(mapped > 50, `preslikanih delov: ${mapped}`);
});

test("weak points API: lesson checks, our papers, games, cards and the progress page feed one list", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, {});
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, body) => {
    const res = await fetch(base + p, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: res.status, body: await res.json() };
  };
  try {
    const s = (await call("/api/students", { name: "Bor", settings: { subject: "FIZ", curriculum_level: "9. razred" } })).body;
    const lesson = loadLesson(OHM);
    assert.ok(lesson?.checks?.length >= 2, "lekcija Ohmov zakon ima vprašanja");
    const wrongOpt = (c) => (c.correct + 1) % c.options.length;
    // Učbenik: strežnik sam preveri odgovor, isto vprašanje šteje enkrat na dan.
    assert.equal((await call(`/api/students/${s.id}/lesson-check`, { topic: OHM, q: 99, o: 0 })).status, 400);
    assert.equal((await call(`/api/students/${s.id}/lesson-check`, { topic: "X/y", q: 0, o: 0 })).status, 400);
    assert.equal((await call(`/api/students/${s.id}/lesson-check`, { topic: OHM, q: 0, o: 99 })).status, 400);
    let r = await call(`/api/students/${s.id}/lesson-check`, { topic: OHM, q: 0, o: wrongOpt(lesson.checks[0]) });
    assert.deepEqual(r.body, { counted: true });
    r = await call(`/api/students/${s.id}/lesson-check`, { topic: OHM, q: 0, o: lesson.checks[0].correct });
    assert.deepEqual(r.body, { counted: false });
    await call(`/api/students/${s.id}/lesson-check`, { topic: OHM, q: 1, o: wrongOpt(lesson.checks[1]) });
    // Nič še ni šibko (2 odgovora < 3).
    r = await call(`/api/students/${s.id}/progress`);
    assert.equal(r.body.weak.length, 0);
    const row = r.body.topics.find((x) => x.topic_id === OHM);
    assert.equal(row.turns, 2);
    assert.equal(row.errors, 2);
    // Kviz v razredu bi šel enako; tu tretja napaka pride iz kartice »še ne znam«.
    const card = store.cards.add(s.id, [{ front: "Ohmov zakon?", back: "U = R I" }], { subject: "FIZ", topic: "Ohmov zakon" })[0];
    await call(`/api/students/${s.id}/flashcards/${card.id}/review`, { ok: false });
    r = await call(`/api/students/${s.id}/progress`);
    assert.deepEqual(r.body.weak.map((w) => w.topic_id), [OHM]);
    assert.equal(r.body.weak[0].sources.cards.wrong, 1);

    // Naša pola: del z odprto rešitvijo brez »Imam prav« je napaka, označen del pravilen; vsak del enkrat.
    const [pid] = [...ourPaperIds().keys()].filter((id) => id.startsWith("NPZ9-FIZ"));
    const paper = loadOurPaper(pid);
    const map = paperTopics(pid, paper);
    const keys = [...map.keys()].slice(0, 2);
    assert.equal(keys.length, 2);
    assert.equal((await call(`/api/students/${s.id}/paper-check`, { paper: "ni-pole", parts: [] })).status, 404);
    r = await call(`/api/students/${s.id}/paper-check`, { paper: pid, parts: [{ key: keys[0], ok: false }, { key: keys[1], ok: true }, { key: "nič", ok: false }] });
    assert.equal(r.body.counted, 2);
    r = await call(`/api/students/${s.id}/paper-check`, { paper: pid, parts: [{ key: keys[0], ok: false }] });
    assert.equal(r.body.counted, 0);
    const papers = store.db.prepare("SELECT SUM(n) AS n, SUM(wrong) AS w FROM skill_results WHERE source = 'paper'").get();
    assert.deepEqual({ ...papers }, { n: 2, w: 1 });
    assert.ok(paper.tasks.some((tk) => tk.parts.some((p) => partKey(tk, p) === keys[0])));

    // Igra: pojem → tema poti (frac_add → seštevanje ulomkov), največ GAME_MAX odgovorov na igro.
    await call(`/api/students/${s.id}/games/result`, { game: "meteor:frac_add", score: 10, correct: 2, wrong: 10, tier: 1 });
    const g = store.db.prepare("SELECT topic_id, n, wrong FROM skill_results WHERE source = 'game'").get();
    assert.ok(g.topic_id, "igra ima temo");
    assert.equal(g.n, GAME_MAX);
    assert.equal(g.wrong, 3);
    r = await call(`/api/students/${s.id}/progress`);
    assert.ok(r.body.topics.some((x) => x.topic_id === g.topic_id && x.sources.game));
    // Izvoz podatkov in izbris profila zajameta nove zapise (ON DELETE CASCADE).
    store.deleteStudent(s.id);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM skill_results").get().n, 0);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM skill_seen").get().n, 0);
  } finally {
    server.close();
  }
});
