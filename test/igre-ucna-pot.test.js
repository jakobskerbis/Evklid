// Povezava iger z učno potjo (j 2026-11-01, docs/igre-smernice.md §12): nagradna igra po dnevnem treningu,
// vrsta »Ponovi šibke teme« in merjenje v pilotu (samo za skrbnika).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { rewardOffer } from "../public/games/reward.js";
import { TOPIC_CONCEPTS, conceptsOfTopics, weakConcepts, gameFor, rewardGame, WEAK_MAX } from "../public/games/learn-link.js";
import { LESSONS } from "../public/games/lessons.js";
import { CONCEPTS } from "../public/games/topics.js";
import { ENGINES, fits } from "../public/games/engines.js";
import { weakFor, noteGame, notePathActivity, gamePilot, MIN_STUDENTS, RETURN_MINUTES } from "../server/games.js";

const FRAC_TOPIC = LESSONS.frac_add[0];

test("reward game: offered only when the daily training or the daily XP goal is done and games are on", () => {
  const n = { reward: ["frac_add"] };
  assert.deepEqual(rewardOffer({}, "daily", n), ["frac_add"]); // dnevni trening opravljen
  assert.equal(rewardOffer({ games: "off" }, "daily", n), null); // »Skrij igre«
  assert.equal(rewardOffer({}, "review", n), null); // ponavljanje brez doseženega cilja
  assert.equal(rewardOffer({}, "review", n, { today: 30, goal: 50 }), null);
  assert.deepEqual(rewardOffer({}, "review", n, { today: 50, goal: 50 }), ["frac_add"]); // cilj dosežen
  assert.deepEqual(rewardOffer({}, "unit", { ...n, xp: { today: 80, goal: 50 } }), ["frac_add"]);
  assert.equal(rewardOffer({ games: "off" }, "unit", { ...n, xp: { today: 80, goal: 50 } }), null);
  assert.equal(rewardOffer({}, "daily", { reward: [] }), null); // ni igre za vadeno snov
  assert.equal(rewardOffer({}, "daily", null), null);
});

test("reward game: practised topics map to game concepts, produce-the-answer games first", () => {
  assert.ok(TOPIC_CONCEPTS[FRAC_TOPIC].includes("frac_add"));
  assert.deepEqual(conceptsOfTopics([]), []);
  const cs = conceptsOfTopics([FRAC_TOPIC, FRAC_TOPIC, "neznana/tema"]);
  assert.ok(cs.includes("frac_add") && cs.length <= 6);
  // regijska tema prek osnovne teme
  assert.deepEqual(conceptsOfTopics(["X/regija"], (id) => (id === "X/regija" ? [FRAC_TOPIC] : [])), conceptsOfTopics([FRAC_TOPIC]));
  const c = (id) => CONCEPTS.find((x) => x.id === id);
  // »Računanje na pamet« in podobne igre, ko pojmu ustrezajo; sicer mirna igra za vse pojme
  assert.ok(["numline", "tiles", "order", "typed"].includes(gameFor(c("add"), ENGINES, fits).id));
  for (const x of CONCEPTS) assert.ok(gameFor(x, ENGINES, fits), x.id); // vsak pojem ima igro
  assert.notEqual(gameFor(c("add"), ENGINES, fits, [gameFor(c("add"), ENGINES, fits).id]).id, gameFor(c("add"), ENGINES, fits).id);
  const id = rewardGame(["ni_pojma", "add"], CONCEPTS, ENGINES, fits);
  assert.match(id, /^[a-z]+:add$/);
  assert.equal(rewardGame([], CONCEPTS, ENGINES, fits), null);
});

test("weak topics: most mistakes this week first (path and games together), at most twice the row", () => {
  const w = weakConcepts([{ topic_id: FRAC_TOPIC, n: 3 }], [{ concept: "add", n: 1 }, { concept: "sub", n: 5 }, { concept: "mul", n: 0 }]);
  assert.equal(w[0].concept, "sub");
  assert.deepEqual(w.find((x) => x.concept === "frac_add"), { concept: "frac_add", path: 3, game: 0, n: 3 });
  assert.ok(!w.some((x) => x.concept === "mul")); // brez napak ni šibka
  assert.deepEqual(weakConcepts([], []), []);
  const many = weakConcepts([], CONCEPTS.slice(0, 40).map((c, i) => ({ concept: c.id, n: i + 1 })));
  assert.equal(many.length, WEAK_MAX * 2);
  assert.equal(many[0].n, 40);
});

const http = async (fn) => {
  const store = openDb(":memory:");
  const app = createApp(store, {});
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, body, headers = {}) => {
    const res = await fetch(base + p, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json", ...headers }, body: body ? JSON.stringify(body) : undefined });
    return { status: res.status, body: await res.json() };
  };
  try {
    await fn({ store, db: store.db, call });
  } finally {
    server.close();
  }
};

test("daily training: the finished session lists game concepts of the practised topics", async () => {
  await http(async ({ call }) => {
    const s = (await call("/api/students", { name: "Ana", settings: { curriculum_level: "7. razred" } })).body;
    let r = (await call(`/api/students/${s.id}/daily`, {})).body;
    assert.ok(r.task, "dnevni trening ima naloge");
    let fin = null;
    for (let i = 0; i < 200 && !fin; i++) {
      const out = (await call(`/api/students/${s.id}/tasks/${r.task.id}/answer`, { answer: r.task.answerType === "choice" ? "A" : "987654" })).body;
      if (out.next?.finished) fin = out.next;
      else if (out.next?.task) r = out.next;
    }
    assert.ok(fin, "trening se konča");
    assert.ok(Array.isArray(fin.reward) && fin.reward.length > 0 && fin.reward.every((c) => CONCEPTS.some((x) => x.id === c)), "pojmi vadenih tem");
    assert.ok(fin.xp && fin.xp.goal > 0, "konec dnevnega treninga pove XP in cilj");
  });
});

test("weak topics row and pilot counters: from path mistakes and game answers, without names", async () => {
  await http(async ({ db, call, store }) => {
    const s = (await call("/api/students", { name: "Bor", settings: { curriculum_level: "7. razred" } })).body;
    // napake na učni poti ta teden (napačen prvi odgovor) in ena stara napaka, ki ne šteje
    const ins = db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, attempts, first_try_correct, created_at) VALUES (?, ?, 1, '{}', ?, ?, datetime('now', ?))");
    ins.run(s.id, FRAC_TOPIC, 2, 0, "-1 days");
    ins.run(s.id, FRAC_TOPIC, 1, 0, "-2 days");
    ins.run(s.id, FRAC_TOPIC, 1, 1, "-1 days"); // pravilno: ni napaka
    ins.run(s.id, FRAC_TOPIC, 0, null, "-1 days"); // neodgovorjena
    ins.run(s.id, FRAC_TOPIC, 1, 0, "-20 days"); // prestara
    let g = (await call(`/api/students/${s.id}/games`)).body;
    assert.deepEqual(g.weak.find((x) => x.concept === "frac_add"), { concept: "frac_add", path: 2, game: 0, n: 2 });
    // igra na šibki temi in na drugi temi; napake v igri štejejo k šibkim temam
    await call(`/api/students/${s.id}/games/result`, { game: "typed:frac_add", score: 10, correct: 6, wrong: 2, tier: 1 });
    await call(`/api/students/${s.id}/games/result`, { game: "meteor:sq_root_nope", score: 10, correct: 3, wrong: 1, tier: 1 });
    g = (await call(`/api/students/${s.id}/games`)).body;
    assert.equal(g.weak.find((x) => x.concept === "frac_add").n, 4);
    const day = db.prepare("SELECT plays, returns, pending FROM game_days WHERE student_id = ?").get(s.id);
    assert.deepEqual({ ...day }, { plays: 2, returns: 0, pending: 2 });
    const acc = db.prepare("SELECT concept, weak, correct, wrong FROM game_concept_days WHERE student_id = ? ORDER BY concept").all(s.id);
    assert.deepEqual(acc.map((r) => [r.concept, r.weak, r.correct, r.wrong]), [["frac_add", 1, 6, 2], ["sq_root_nope", 0, 3, 1]]);
    // vrnitev na pot: odgovor na nalogo v RETURN_MINUTES po igrah šteje vsako igro niza enkrat
    notePathActivity(db, s.id);
    notePathActivity(db, s.id);
    assert.equal(db.prepare("SELECT returns FROM game_days WHERE student_id = ?").get(s.id).returns, 2);
    // prepozno: brez vrnitve
    noteGame(db, s.id, "add", 1, 0);
    db.prepare("UPDATE game_days SET last_end = datetime('now', ?) WHERE student_id = ?").run(`-${RETURN_MINUTES + 5} minutes`, s.id);
    notePathActivity(db, s.id);
    assert.equal(db.prepare("SELECT returns FROM game_days WHERE student_id = ?").get(s.id).returns, 2);
    // premalo igralcev: brez števil
    assert.equal(gamePilot(db).enough, false);
    for (const n of ["C", "D"]) noteGame(db, store.createStudent(n, {}).id, "add", 2, 2);
    const p = gamePilot(db);
    assert.equal(p.enough, true);
    assert.equal(p.players, MIN_STUDENTS);
    assert.equal(p.totals.plays, 5);
    assert.equal(p.totals.returns, 2);
    assert.equal(p.totals.returnRate, 40);
    assert.equal(p.totals.weakAccuracy, 75); // 6 od 8
    assert.equal(p.totals.otherAccuracy, Math.round((100 * 8) / 13)); // 3+1+2+2 od 4+1+4+4
    assert.ok(!/Bor|"C"|student_id/.test(JSON.stringify(p)), "brez imen in id-jev");
    assert.equal(weakFor(db, 9999).length, 0);
  });
});

test("pilot metrics: admin only (computer running the server), invalid period → 400", async () => {
  await http(async ({ call }) => {
    assert.equal((await call("/api/games/pilot")).status, 200);
    assert.equal((await call("/api/games/pilot?days=7")).status, 200);
    assert.equal((await call("/api/games/pilot", null, { "X-Forwarded-For": "203.0.113.5" })).status, 403);
    assert.equal((await call("/api/games/pilot?days=abc")).status, 400);
    assert.equal((await call("/api/games/pilot?days=0")).status, 400);
    assert.equal((await call("/api/games/pilot?days=999")).status, 400);
  });
});

test("reward and weak row: hidden games hide the offer; the docs describe the three features", async () => {
  const fs = await import("node:fs");
  const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /rewardOffer\(state\.student\.settings/);
  const doc = fs.readFileSync(new URL("../docs/igre-smernice.md", import.meta.url), "utf8");
  assert.match(doc, /Ponovi šibke teme/);
  assert.match(doc, /api\/games\/pilot/);
});

test("pilot metrics: days with fewer than MIN_STUDENTS players are merged or left out (also from totals)", async () => {
  await http(async ({ db, store }) => {
    const ids = ["A", "B", "C", "D"].map((n) => store.createStudent(n, {}).id);
    const day = (id, ago, plays, returns) =>
      db.prepare("INSERT INTO game_days (student_id, day, plays, returns) VALUES (?, date('now', ?), ?, ?)").run(id, `-${ago} days`, plays, returns);
    const acc = (id, ago, c, w) =>
      db.prepare("INSERT INTO game_concept_days (student_id, day, concept, weak, correct, wrong) VALUES (?, date('now', ?), 'add', 0, ?, ?)").run(id, `-${ago} days`, c, w);
    for (const id of ids.slice(0, 3)) {
      day(id, 0, 2, 1); // danes 3 igralci: lastna vrstica
      acc(id, 0, 3, 1);
    }
    day(ids[3], 1, 5, 5); // včeraj samo D
    acc(ids[3], 1, 0, 9);
    let p = gamePilot(db);
    assert.deepEqual(p.rows.map((r) => r.players), [3], "dan z enim igralcem ni prikazan");
    assert.equal(p.hiddenDays, 1);
    assert.equal(p.totals.plays, 6, "in ni v vsotah (razlika bi ga izdala)");
    assert.equal(p.totals.otherAccuracy, 75);
    // še dva dneva z A in B: združeni dnevi imajo 3 različne igralce → ena vrstica brez datuma
    day(ids[0], 2, 1, 0);
    day(ids[1], 3, 1, 1);
    p = gamePilot(db);
    assert.deepEqual(p.rows.map((r) => [r.day === null, r.players, r.plays, r.returns]), [[false, 3, 6, 3], [true, 3, 7, 6]]);
    assert.equal(p.hiddenDays, 0);
    assert.equal(p.totals.plays, 13);
    assert.equal(p.totals.otherAccuracy, Math.round((100 * 9) / 21));
  });
});

test("pilot metrics: a return after midnight counts the waiting games of yesterday once", async () => {
  await http(async ({ db, store }) => {
    const id = store.createStudent("E", {}).id;
    db.prepare("INSERT INTO game_days (student_id, day, plays, pending, last_end) VALUES (?, date('now', '-1 days'), 1, 1, datetime('now', '-10 minutes'))").run(id);
    noteGame(db, id, "add", 1, 0);
    notePathActivity(db, id);
    notePathActivity(db, id);
    const rows = db.prepare("SELECT plays, returns, pending FROM game_days WHERE student_id = ? ORDER BY day").all(id).map((r) => ({ ...r }));
    assert.deepEqual(rows, [{ plays: 1, returns: 1, pending: 0 }, { plays: 1, returns: 1, pending: 0 }]);
  });
});

test("pilot tables: created on an existing database without them", () => {
  const store = openDb(":memory:");
  createApp(store, {});
  store.db.exec("DROP TABLE game_days; DROP TABLE game_concept_days;");
  createApp(store, {});
  assert.ok(store.db.prepare("SELECT name FROM sqlite_master WHERE name = 'game_days'").get());
  assert.equal(gamePilot(store.db).players, 0);
});
