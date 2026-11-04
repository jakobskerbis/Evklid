import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { CONCEPTS, AREAS, makeQuestion, setNumberStyle, fr, poly, cx } from "../public/games/topics.js";
import { ENGINES, statement } from "../public/games/engines.js";
import { PACE, gameLock, isCleared, topicYear } from "../public/games/unlock.js";
import { LESSONS } from "../public/games/lessons.js";
import { getTopic } from "../server/curriculum.js";

test("games: every concept gives valid questions on every level, in both number styles", () => {
  for (const lang of ["sl", "en"]) {
    setNumberStyle(lang);
    for (const c of CONCEPTS) {
      for (let tier = 1; tier <= 3; tier++) {
        for (let i = 0; i < 150; i++) {
          const q = c.gen(tier);
          const where = `${lang} ${c.id} ${tier}: ${JSON.stringify(q)}`;
          assert.ok(q.q && q.a, where);
          assert.ok(q.w.length >= 3, `premalo napačnih – ${where}`);
          assert.ok(!q.w.includes(q.a), `napačen = pravilen – ${where}`);
          assert.equal(new Set(q.w).size, q.w.length, `podvojen – ${where}`);
          assert.ok(![q.q, q.a, ...q.w].some((x) => /\bNaN\b|undefined|Infinity|\bnull\b|\[object/.test(x)), where);
        }
      }
    }
  }
  setNumberStyle("sl");
});

test("games: answers are right (spot checks of the formatting helpers)", () => {
  setNumberStyle("sl");
  assert.equal(fr(6, 8), "3/4");
  assert.equal(fr(-4, 2), "−2");
  assert.equal(poly([1, -3, 2]), "x² − 3x + 2");
  assert.equal(poly([-1, 0, 0]), "−x²");
  assert.equal(cx(3, -1), "3 − i");
  assert.equal(cx(0, 2), "2i");
  // Rešitve enačb iz generatorja res zadoščajo enačbi.
  const lin = CONCEPTS.find((c) => c.id === "lin2");
  for (let i = 0; i < 200; i++) {
    const q = lin.gen(1);
    const [, a, b, rhs] = q.q.replace(/−/g, "-").match(/^(-?\d*)x ([+-] \d+) = (-?\d+)$/) || [];
    if (!a && a !== "") continue;
    const k = a === "" ? 1 : a === "-" ? -1 : Number(a);
    const x = Number(q.a.replace("x = ", "").replace("−", "-"));
    assert.equal(k * x + Number(b.replace(" ", "")), Number(rhs), q.q);
  }
});

test("games: at least 10 games in every area, unique ids, statements for the sorter", () => {
  for (const [id] of AREAS) {
    const n = CONCEPTS.filter((c) => c.area === id).length * ENGINES.length;
    assert.ok(n >= 10, `${id}: samo ${n} iger`);
  }
  assert.equal(new Set(CONCEPTS.map((c) => c.id)).size, CONCEPTS.length);
  assert.equal(new Set(ENGINES.map((e) => e.id)).size, ENGINES.length);
  assert.ok(CONCEPTS.length * ENGINES.length >= 300);
  assert.deepEqual(statement("? : 30 = 3 : 6", "15"), ["", "15 : 30 = 3 : 6"]);
  assert.deepEqual(statement("Praštevilo?", "17"), ["Praštevilo?", "17"]);
  assert.deepEqual(statement("2x = 8", "x = 4"), ["2x = 8", "⇒ x = 4"]);
  assert.deepEqual(statement("7 · 8", "56"), ["7 · 8", "= 56"]);
  assert.ok(makeQuestion("int_def", 3).q.includes("∫"));
  // Vsaka vrsta igre ima zgodbo (poglavja) v slovenščini in angleščini.
  for (const e of ENGINES) for (const lang of ["sl", "en"]) {
    assert.ok(e.story?.[lang]?.length >= 3, `${e.id} ${lang}: ni zgodbe`);
    for (const [title, text] of e.story[lang]) assert.ok(title && text.length > 10, `${e.id} ${lang}`);
  }
});

test("games API: best score, level and capped XP", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, {});
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, body) => {
    const res = await fetch(base + p, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: res.status, body: await res.json() };
  };
  try {
    const s = (await call("/api/students", { name: "Igralec", settings: { curriculum_level: "8. razred" } })).body;
    let r = await call(`/api/students/${s.id}/games`);
    assert.equal(r.body.year, 8);
    assert.deepEqual(r.body.games, {});
    assert.equal((await call(`/api/students/${s.id}/games/result`, { game: "bad id", score: 1 })).status, 400);
    r = await call(`/api/students/${s.id}/games/result`, { game: "meteor:frac_add", score: 120, correct: 12, wrong: 3, tier: 2 });
    assert.equal(r.body.xp, 6);
    assert.equal(r.body.best, 120);
    r = await call(`/api/students/${s.id}/games/result`, { game: "meteor:frac_add", score: 300, correct: 500, wrong: 0, tier: 3 });
    assert.equal(r.body.xp, 20); // največ 20 na igro
    assert.equal(r.body.newBest, true);
    r = await call(`/api/students/${s.id}/games/result`, { game: "runner:lin2", score: 50, correct: 100, wrong: 0, tier: 1 });
    r = await call(`/api/students/${s.id}/games/result`, { game: "runner:lin2", score: 10, correct: 100, wrong: 0, tier: 1 });
    assert.equal(r.body.xp, 14); // 60 na dan
    assert.equal(r.body.best, 50);
    r = await call(`/api/students/${s.id}/games`);
    assert.equal(r.body.games["meteor:frac_add"].best, 300);
    assert.equal(r.body.games["meteor:frac_add"].plays, 2);
    assert.equal(r.body.concepts.frac_add, 3);
    assert.equal(r.body.xpToday, 60);
    assert.equal(r.body.games["meteor:frac_add"].cleared, true); // 12 od 15 = 80 %
    assert.deepEqual(r.body.passed, []);
    assert.equal((await call(`/api/students/${s.id}/games/unlock`, { concept: "lin2", correct: 3 })).status, 400);
    assert.equal((await call(`/api/students/${s.id}/games/unlock`, { concept: "lin2", correct: 4 })).body.ok, true);
    r = await call(`/api/students/${s.id}/games`);
    assert.deepEqual(r.body.passed, ["lin2"]);
    assert.ok(Array.isArray(r.body.known));
  } finally {
    server.close();
  }
});

test("games: unlocking by knowledge and by game speed", () => {
  for (const e of ENGINES) assert.ok([1, 2, 3].includes(PACE[e.id]), `${e.id} nima hitrosti v unlock.js`);
  assert.ok(ENGINES.some((e) => PACE[e.id] === 1) && ENGINES.some((e) => PACE[e.id] === 2));
  const ids = new Set(CONCEPTS.map((c) => c.id));
  for (const [cid, topics] of Object.entries(LESSONS)) {
    assert.ok(ids.has(cid), `LESSONS: neznan pojem ${cid}`);
    for (const t of topics) assert.ok(getTopic(t), `LESSONS ${cid}: tema ${t} ne obstaja`);
  }
  assert.equal(topicYear("MAT-OS-7/x"), 7);
  assert.equal(topicYear("FIZ-SS-2/x"), 11);
  assert.ok(isCleared(8, 2) && !isCleared(8, 3) && !isCleared(7, 0));
  const calm = ENGINES.find((e) => PACE[e.id] === 1).id;
  const mid = ENGINES.find((e) => PACE[e.id] === 2).id;
  const fast = ENGINES.find((e) => PACE[e.id] === 3).id;
  const c = CONCEPTS.find((x) => x.id === "lin2");
  const st = (o = {}) => ({ year: c.year, known: new Set(), passed: new Set(), games: {}, ...o });
  // Snov iz višjega ali tega razreda je zaklenjena, iz nižjega odprta (mirne igre).
  assert.equal(gameLock(calm, c, st()).need, "learn");
  assert.equal(gameLock(calm, c, st({ year: c.year + 1 })), null);
  assert.equal(gameLock(calm, c, st({ passed: new Set(["lin2"]) })), null);
  for (const t of LESSONS.lin2 || []) assert.equal(gameLock(calm, c, st({ known: new Set([t]) })), null);
  // Hitrejše igre šele po opravljeni počasnejši igri te snovi.
  const ok = st({ passed: new Set(["lin2"]) });
  assert.deepEqual(gameLock(mid, c, ok), { need: "pace", pace: 1 });
  ok.games[`${calm}:lin2`] = { cleared: true };
  ok.games[`${mid}:frac_add`] = { cleared: true }; // druga snov ne šteje
  assert.equal(gameLock(mid, c, ok), null);
  assert.deepEqual(gameLock(fast, c, ok), { need: "pace", pace: 2 });
  ok.games[`${mid}:lin2`] = { cleared: true };
  assert.equal(gameLock(fast, c, ok), null);
});

test("avatar: coins from games, buying and wearing items", async () => {
  const { ITEMS, ITEM, SLOTS, avatarSvg, cleanAvatar, DEFAULT_AVATAR } = await import("../public/avatar.js");
  // Vsak predmet ima znan predal in izriše veljaven SVG.
  assert.equal(new Set(ITEMS.map((x) => x.id)).size, ITEMS.length);
  for (const slot of SLOTS) assert.ok(ITEMS.some((x) => x.slot === slot && x.price === 0), `${slot}: ni brezplačnega`);
  for (const x of ITEMS) {
    assert.ok(SLOTS.includes(x.slot) && x.name.sl && x.name.en, x.id);
    const svg = avatarSvg({ [x.slot]: x.id });
    assert.ok(svg.startsWith("<svg") && svg.endsWith("</svg>") && !/undefined|NaN/.test(svg), x.id);
  }
  assert.deepEqual(cleanAvatar({ hat: "hat_crown", eyes: "mouth_grin", body: "nope" }, []), DEFAULT_AVATAR);
  assert.deepEqual(cleanAvatar({ hat: "hat_crown" }, ["hat_crown"]).hat, ["hat_crown"]);

  const store = openDb(":memory:");
  const app = createApp(store, {});
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  const call = async (p, body) => {
    const res = await fetch(base + p, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: res.status, body: await res.json() };
  };
  try {
    const s = (await call("/api/students", { name: "Kupec", settings: { curriculum_level: "8. razred" } })).body;
    let r = await call(`/api/students/${s.id}/avatar`);
    assert.equal(r.body.coins, 0);
    assert.equal((await call(`/api/students/${s.id}/avatar/buy`, { item: "hat_cap" })).status, 400); // premalo kovancev
    r = await call(`/api/students/${s.id}/games/result`, { game: "maze:frac_add", score: 10, correct: 30, wrong: 1, tier: 1 });
    assert.equal(r.body.coins, 30);
    r = await call(`/api/students/${s.id}/avatar/buy`, { item: "hat_cap" });
    assert.equal(r.body.coins, 30 - ITEM.hat_cap.price);
    assert.ok(r.body.owned.includes("hat_cap"));
    // Nošnja: samo kupljeni ali brezplačni deli.
    r = await call(`/api/students/${s.id}/avatar`, { equipped: { hat: "hat_cap", outfit: "outfit_armor" } });
    assert.deepEqual(r.body.equipped.hat, ["hat_cap"]);
    assert.deepEqual(r.body.equipped.outfit, []);
    assert.equal((await call(`/api/students/${s.id}/avatar`, { equipped: { name: "x" } })).status, 400);
    // Dnevna meja kovancev.
    for (let i = 0; i < 6; i++) await call(`/api/students/${s.id}/games/result`, { game: "maze:frac_add", score: 1, correct: 40, wrong: 0, tier: 1 });
    assert.equal((await call(`/api/students/${s.id}/avatar`)).body.earnedToday, 150);
  } finally {
    server.close();
  }
});

test("games: lock is switched off (j 2026-10-29: »Odstrani zaporo iger«)", async () => {
  const { LOCKS_ON } = await import("../public/games/unlock.js");
  assert.equal(LOCKS_ON, false);
});

test("games: childhood questionnaire genres map to existing games; tutor can change the choice", async () => {
  const { GENRES, cleanChildhood, childhoodEngines } = await import("../public/games/childhood.js");
  const sl = (await import("../public/i18n/sl.js")).default;
  const ids = new Set(ENGINES.map((e) => e.id));
  for (const g of GENRES) {
    assert.ok(g.engines.length && g.engines.every((e) => ids.has(e)), g.id);
    assert.ok(sl[`games.g.${g.id}`], `games.g.${g.id}`);
  }
  assert.equal(cleanChildhood(null), null);
  assert.deepEqual(cleanChildhood(["snake", "x", "snake", " cards "]), ["snake", "cards"]);
  assert.deepEqual(childhoodEngines(["space", "cards"]), ["invaders", "meteor", "cards"]);
  const store = openDb(":memory:");
  const s = store.createStudent("Ana", {});
  assert.equal(s.settings.game_childhood, null);
  assert.deepEqual(store.updateStudent(s.id, { settings: { game_childhood: ["blocks", "nope"] } }).settings.game_childhood, ["blocks"]);
  const { createSettingsTools } = await import("../server/chat-settings.js");
  const t = createSettingsTools({ store, studentId: s.id, conversationId: 1, pending: new Map() });
  const r = JSON.parse((await t.onToolUse("change_settings", { changes: { game_childhood: ["match", "pet"] } })).content);
  assert.equal(r.status, "applied");
  assert.deepEqual(store.getStudent(s.id).settings.game_childhood, ["match", "pet"]);
  const bad = JSON.parse((await t.onToolUse("change_settings", { changes: { game_childhood: ["tetris"] } })).content);
  assert.equal(bad.status, "error");
});

test("games: ratings, weekly vote and the anonymous trends summary", async () => {
  const { weekKey } = await import("../public/games/wishes.js");
  const { gameTrends } = await import("../server/games.js");
  assert.equal(weekKey(new Date("2026-11-04T05:00:00Z")), "2026-11-04"); // sreda
  assert.equal(weekKey(new Date("2026-11-03T23:00:00Z")), "2026-10-28"); // torek → prejšnja sreda
  const store = openDb(":memory:");
  const app = createApp(store, {});
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (p, body) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  try {
    const ids = ["A", "B", "C"].map((n) => store.createStudent(n, {}).id);
    assert.equal((await post(`/api/students/${ids[0]}/games/rate`, { engine: "nope", up: true })).status, 400);
    assert.equal((await post(`/api/students/${ids[0]}/games/wish`, { genre: "tetris" })).status, 400);
    assert.equal((await post(`/api/students/${ids[0]}/games/rate`, { engine: "cards", up: true })).status, 200);
    assert.equal(gameTrends(store.db).enough, false); // premalo učencev: brez števil
    await post(`/api/students/${ids[1]}/games/rate`, { engine: "cards", up: false });
    await post(`/api/students/${ids[1]}/games/wish`, { genre: "golf" });
    await post(`/api/students/${ids[2]}/games/wish`, { genre: "darts" });
    await post(`/api/students/${ids[2]}/games/wish`, { genre: "golf" }); // glas se zamenja
    const tr = gameTrends(store.db);
    assert.equal(tr.enough, true);
    assert.deepEqual(tr.ratings.cards, { up: 1, down: 1 });
    assert.deepEqual(tr.wishes[tr.week], { golf: 2 });
    assert.ok(!JSON.stringify(tr).includes('"A"'));
    const g = await (await fetch(`${base}/api/students/${ids[2]}/games`)).json();
    assert.equal(g.wish, "golf");
    assert.equal((await fetch(`${base}/api/games/trends`)).status, 200); // na računalniku s strežnikom
    assert.equal((await fetch(`${base}/api/games/trends`, { headers: { "X-Forwarded-For": "203.0.113.5" } })).status, 403); // od drugod ne
    // trije igralci in en glas: samo igranje ne odpre števil (glas bi bil razkrit)
    const st2 = openDb(":memory:");
    createApp(st2, {});
    for (const n of ["D", "E", "F"]) st2.db.prepare("INSERT INTO game_scores (student_id, game, best) VALUES (?, 'cards:frac_add', 1)").run(st2.createStudent(n, {}).id);
    st2.db.prepare("INSERT INTO game_wishes (student_id, week, genre) VALUES (1, ?, 'golf')").run(weekKey());
    assert.equal(gameTrends(st2.db).enough, false);
  } finally {
    server.close();
  }
});

test("games: own childhood game titles map to genres or wishes", async () => {
  const { matchTitle, cleanTitles, GENRE_IDS } = await import("../public/games/childhood.js");
  const { WISH_IDS } = await import("../public/games/wishes.js");
  assert.deepEqual(matchTitle("Tetris"), { genre: "blocks" });
  assert.deepEqual(matchTitle("Minecraft"), { wish: "city" }); // ne »mines«
  assert.deepEqual(matchTitle("2048"), { wish: "merge" });
  assert.deepEqual(matchTitle("majnkraft"), { wish: "city" }); // slovenski zapis
  assert.deepEqual(matchTitle("Križci krožci"), { wish: "connect" });
  assert.deepEqual(matchTitle("nekaj čisto novega"), {});
  // pogoste besede in daljša imena ne smejo zadeti napačne zvrsti
  for (const [x, g] of [["Mario Kart", "racing"], ["Sonic Dash", "run"], ["Puzzle Bobble", "bubbles"], ["Jezni ptiči", "sling"], ["Angry Bird", "sling"], ["Vojna zvezd", "space"], ["Krtek", "moles"], ["tetirs", "blocks"], ["Talking Angela", "pet"], ["Worms", "sling"], ["Chrome dino", "run"], ["Royal Match", "match"]]) assert.deepEqual(matchTitle(x), { genre: g }, x);
  for (const x of ["Skače", "Pikaču", "Igra lovcev", "Navodila", "Pouk", "Premier league", "Swordigo", "Cookie Clicker", "Ninjago", "Darth Vader", "Papagaj", "Svetovna vojna", "Dinozavri"]) assert.deepEqual(matchTitle(x), {}, x);
  for (const x of ["Pac-Man", "Candy Crush", "Pou", "Uno", "Flappy Bird", "Plants vs Zombies", "Wordle"]) {
    const m = matchTitle(x);
    assert.ok(GENRE_IDS.includes(m.genre) || WISH_IDS.includes(m.wish), x);
  }
  assert.deepEqual(cleanTitles(["  Tetris ", "tetris", "<b>x</b>", "a".repeat(60), "1", "2", "3"]), ["Tetris", "b x /b", "a".repeat(40), "1", "2"]);
  const store = openDb(":memory:");
  const s = store.createStudent("Ana", {});
  assert.deepEqual(s.settings.game_titles, []);
  assert.deepEqual(store.updateStudent(s.id, { settings: { game_titles: ["Fortnite", "fortnite"] } }).settings.game_titles, ["Fortnite"]);
});

test("games: »Kdo je slepar?« – one impostor with a wrong answer, the crew is right, voting finds it", async () => {
  const { impostor, deal } = await import("../public/games/deduction.js");
  const { matchTitle } = await import("../public/games/childhood.js");
  const sl = (await import("../public/i18n/sl.js")).default;
  assert.ok(ENGINES.includes(impostor));
  for (const k of ["games.e.impostor", "games.e.impostor.how", "games.e.impostor.was", impostor.prompt]) assert.ok(sl[k], k);
  for (const x of ["Among Us", "amongus", "Mafija", "Town of Salem"]) assert.deepEqual(matchTitle(x), { genre: "impostor" }, x);
  for (const x of ["Jezus", "Suspenz"]) assert.deepEqual(matchTitle(x), {}, x);
  const cids = CONCEPTS.map((c) => c.id).filter((_, i) => i % 25 === 0);
  for (const cid of cids) for (const tier of [1, 3]) {
    const q = makeQuestion(cid, tier), n = tier >= 2 ? 4 : 3;
    const tasks = deal(q, () => makeQuestion(cid, tier), n);
    assert.equal(tasks.length, n, cid);
    const bad = tasks.filter((m) => m.imp);
    assert.equal(bad.length, 1, cid);
    assert.equal(bad[0].q, q.q);
    assert.notEqual(bad[0].claim, q.a, cid);
    assert.ok(q.w.includes(bad[0].claim), cid);
    assert.ok(tasks.filter((m) => m.q === q.q).length === 1 || new Set(tasks.map((m) => m.q)).size === 1, cid); // sleparjeva naloga samo enkrat
    assert.equal(bad[0].truth, q.a);
    // naloga z izbiro (»Katero število je največje?«) pokaže svoje možnosti; sleparjeve vsebujejo napačni in pravilni odgovor
    if (bad[0].pick) assert.ok(bad[0].pick.includes(q.a) && bad[0].pick.includes(bad[0].claim), cid);
  }
  // glas: pravilno samo za sleparja, en glas na rundo, tipke le 1–n
  const cid = cids[0];
  for (let round = 0; round < 12; round++) {
    const got = [];
    const G = { W: 400, H: 600, tier: 1, waiting: false, reduced: true, t: (k, v) => `${k} ${JSON.stringify(v)}`, ask: () => makeQuestion(cid, 1), answer: (ok, x, y, o) => got.push([ok, o]) };
    const e = impostor.create(G);
    e.reset();
    G.q = makeQuestion(cid, 1);
    e.question(G.q);
    const pick = round % 3;
    assert.ok(e.key(String(pick + 1), true));
    assert.equal(e.key(String(pick + 1), true), true);
    assert.equal(got.length, 1);
    assert.equal(e.key("4", true), false);
    const [ok, o] = got[0], crew = e.peek();
    assert.equal(ok, crew[pick].imp === true);
    // napačen glas: razlaga pove, kateri robotek je bil slepar, in pusti čas za branje
    if (!ok) assert.ok(o.delay >= 3 && o.note.includes(`"n":${crew.findIndex((m) => m.imp) + 1}`), o.note);
  }
});

test("games: grid pages of 60 across area sections (j: »največ 50 iger naenkrat zaradi laga«)", async () => {
  const { pageSlice, pageNums, PER_PAGE } = await import("../public/games/pages.js");
  const g = (id, n) => ({ id, games: Array.from({ length: n }, (_, i) => `${id}${i}`) });
  const flat = (r) => r.parts.flatMap((p) => p.games);
  // 50 + 70: druga stran začne z 11. igro drugega področja
  let r = pageSlice([g("a", 50), g("b", 70)], 1, 60);
  assert.deepEqual([r.page, r.pages, r.total], [1, 2, 120]);
  assert.deepEqual(r.parts.map((p) => [p.id, p.games.length, p.all]), [["b", 60, 70]]);
  assert.equal(flat(r)[0], "b10");
  // meja točno na koncu področja: brez praznih razdelkov
  r = pageSlice([g("a", 60), g("b", 60)], 0, 60);
  assert.deepEqual(r.parts.map((p) => p.id), ["a"]);
  r = pageSlice([g("a", 60), g("b", 60)], 1, 60);
  assert.deepEqual(r.parts.map((p) => p.id), ["b"]);
  // stran, ki je po ožji izbiri ni več → zadnja; prazna izbira → ena prazna stran
  r = pageSlice([g("a", 70)], 9, 60);
  assert.deepEqual([r.page, flat(r).length], [1, 10]);
  r = pageSlice([], 3);
  assert.deepEqual([r.page, r.pages, r.parts.length], [0, 1, 0]);
  // vse igre natanko enkrat, nobena stran nima več kot PER_PAGE
  const groups = [g("a", 7), g("b", 130), g("c", 1), g("d", 61)];
  const all = [];
  for (let p = 0; p < pageSlice(groups, 0).pages; p++) {
    const s = flat(pageSlice(groups, p));
    assert.ok(s.length <= PER_PAGE && s.length > 0);
    all.push(...s);
  }
  assert.deepEqual(all, groups.flatMap((x) => x.games));
  assert.deepEqual(pageNums(5, 111), [0, 3, 4, 5, 6, 7, 110]);
  assert.deepEqual(pageNums(0, 111, 1), [0, 1, 110]);
  assert.deepEqual(pageNums(0, 1), [0]);
});

test("games: adapt to the student's stage, and »Skrij igre« is a saved profile setting", async () => {
  const { STAGES, stageOf, startTierFor, gamesOn } = await import("../public/games/stage.js");
  const { normalizeSettings } = await import("../server/settings.js");
  // OŠ igrivo in od lahkega naprej; SŠ in fakulteta resnejši videz, težji začetek, hitreje težje.
  assert.equal(stageOf({ educational_track: "OSNOVNA_SOLA" }), "os");
  assert.equal(stageOf({ educational_track: "SREDNJA_SOLA" }), "ss");
  assert.equal(stageOf({ educational_track: "UNIVERZA" }), "faks");
  assert.equal(stageOf(null), "os");
  assert.equal(STAGES.os.calm, false);
  assert.ok(STAGES.ss.calm && STAGES.faks.calm);
  assert.ok(STAGES.os.tierUp > STAGES.ss.tierUp && STAGES.ss.tierUp >= STAGES.faks.tierUp);
  assert.equal(startTierFor("os", undefined), 1);
  assert.equal(startTierFor("ss", 1), 2);
  assert.equal(startTierFor("ss", 3), 3);
  assert.equal(startTierFor("faks", 1), 3);
  // Stikalo: privzeto vidno, »off« se ohrani, neveljavna vrednost ne.
  assert.equal(normalizeSettings({}).games, "on");
  assert.equal(normalizeSettings({ games: "off" }).games, "off");
  assert.equal(normalizeSettings({ games: "maybe" }).games, "on");
  assert.equal(gamesOn(normalizeSettings({})), true);
  assert.equal(gamesOn(normalizeSettings({ games: "off" })), false);
  // Splet in aplikacija imata isti obrazec: polje, besedilo v vseh jezikih in resnejši videz v CSS.
  const fs = await import("node:fs");
  const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
  assert.match(html, /name="games"/);
  for (const f of fs.readdirSync(new URL("../public/i18n/ui/", import.meta.url))) {
    const ui = JSON.parse(fs.readFileSync(new URL(`../public/i18n/ui/${f}`, import.meta.url), "utf8"));
    assert.ok(ui["set.hideGames"] && ui["set.hideGamesNote"], f);
  }
  assert.match(fs.readFileSync(new URL("../public/games.css", import.meta.url), "utf8"), /\.gm-calm \.gm-tile/);
});

// Igre, v katerih učenec odgovor naredi sam (public/games/produce.js, j 2026-11-01: »naj bodo igre bolj
// raznovrstne kot samo izbiranje pravilnih možnosti«).
const produce = await import("../public/games/produce.js");
const { FITS } = await import("../public/games/produce-fits.js");
const { numline, typed, readNumber, isPick, lineFor, lineValueText, lineHit, typedTask, checkTyped, readTyped, fitNow, padKeys } = produce;
// kot core.js: naloga, ki jo igra sprejme (engine.accept), in delež sprejetih
function drawFor(engine, cid, tier) {
  for (let i = 0; i < 60; i++) {
    const q = makeQuestion(cid, tier);
    if (engine.accept(q)) return [q, i];
  }
  return [null, 60];
}

test("games: produce-the-answer games apply only to concepts with one-number answers; the list is fresh", () => {
  setNumberStyle("sl");
  for (const e of [numline, typed]) {
    assert.ok(ENGINES.includes(e), e.id);
    assert.equal(e.added, "2026-11-04");
    const mine = CONCEPTS.filter((c) => e.fits(c)).map((c) => c.id);
    const now = CONCEPTS.filter((c) => fitNow[e.id](c)).map((c) => c.id);
    assert.deepEqual(mine, now, `${e.id}: seznam pojmov je star – zaženi node scripts/igre-pojmi.js`);
    assert.ok(mine.length >= 100, `${e.id}: samo ${mine.length} pojmov`);
    assert.ok(mine.length < CONCEPTS.length / 2, `${e.id}: preveč pojmov (${mine.length})`);
    for (const id of FITS[e.id]) assert.ok(CONCEPTS.some((c) => c.id === id), `${e.id}: neznan pojem ${id}`);
  }
  // naloge z izbiro in odgovori, ki niso eno število, niso za ti igri
  for (const id of ["prime", "frac_compare", "m_even", "factor", "quad", "system", "rem", "m_shapes"]) {
    assert.ok(!numline.fits(CONCEPTS.find((c) => c.id === id)) && !typed.fits(CONCEPTS.find((c) => c.id === id)), id);
  }
  for (const id of ["add", "mul", "frac_add", "dec_add", "lin2", "neg_add", "pct_of", "f_ohm"]) assert.ok(typed.fits(CONCEPTS.find((c) => c.id === id)), id);
  for (const id of ["add", "frac_add", "dec_add", "lin2", "neg_add", "round", "angles_tri"]) assert.ok(numline.fits(CONCEPTS.find((c) => c.id === id)), id);
  assert.ok(isPick({ q: "Največje?", a: "2/3", w: [] }) && isPick({ q: "Katero število je sodo?", a: "18", w: [] }) && isPick({ q: "Višina vrat je približno?", a: "2 m", w: [] }));
  assert.ok(!isPick({ q: "Imam 5 piškotov. Dobim še 4. Koliko jih imam?", a: "9", w: [] }) && !isPick({ q: "7 · 8", a: "56", w: [] }) && !isPick({ q: "? + 7 = 8", a: "1", w: [] }));
  // izbira med ponujenimi količinami (pregled 2): brez možnosti naloge ni mogoče rešiti
  for (const qq of ["Kaj je najdaljše?", "Kaj je najlažje?", "Kaj je največ denarja?", "Kaj je najmanj denarja?"]) assert.ok(isPick({ q: qq, a: "4,05 €", w: [] }), qq);
  // premica: razdelek je natančnost odgovora, zato brez odmika (3² ≠ 8); bližnja napaka ima svoj razdelek
  setNumberStyle("sl");
  for (let tier = 1; tier <= 3; tier++) assert.equal(lineFor({ q: "3²", a: "9", w: ["6", "−9", "12"] }, tier).tol, 0);
  assert.equal(lineFor({ q: "397 ≈ ? (10)", a: "400", w: ["390", "420", "410"] }, 1).u, 10);
  assert.equal(lineFor({ q: "34 − 14", a: "20", w: ["48", "30", "10"] }, 2).u, 1);
  assert.equal(lineFor({ q: "8,01 ≈ ? (0,1)", a: "8", w: ["8,2", "7,9", "8,1"] }, 3).u, 0.1);
  // portal: ploščice teh dveh iger le za ustrezne pojme
  const n = CONCEPTS.length * (ENGINES.length - 2) + FITS.numline.length + FITS.typed.length;
  assert.ok(n > CONCEPTS.length * (ENGINES.length - 2));
});

test("games: reading one-number answers (number style, units, prefixes) and typed input", () => {
  setNumberStyle("sl");
  const r = (a) => {
    const p = readNumber(a);
    return p && [p.v, p.kind, p.pre, p.unit.trim()];
  };
  assert.deepEqual(r("−3/4"), [-0.75, "frac", "", ""]);
  assert.deepEqual(r("0,75"), [0.75, "dec", "", ""]);
  assert.deepEqual(r("x = −12"), [-12, "int", "x = ", ""]);
  assert.deepEqual(r("12,5 m/s²"), [12.5, "dec", "", "m/s²"]);
  assert.deepEqual(r("45 %"), [45, "int", "", "%"]);
  assert.deepEqual(r("30°"), [30, "int", "", "°"]);
  assert.deepEqual(r("−100 °C"), [-100, "int", "", "°C"]);
  for (const a of ["7 ost. 1", "3 · 10⁴", "5 N v desno", "√2", "x² − 1", "{−2; 2}", "(3, 4)", "1 : 3", "0,666…", "2 2/3", "60 in 70", "0.75"]) assert.equal(readNumber(a), null, a);
  setNumberStyle("en");
  assert.deepEqual(r("0.75"), [0.75, "dec", "", ""]);
  assert.deepEqual(r("€20"), [20, "int", "€", ""]);
  assert.equal(readNumber("0,75"), null);
  setNumberStyle("sl");
  assert.deepEqual(readTyped(",5"), { n: 5, d: 10, kind: "dec" });
  assert.deepEqual(readTyped("−3/4"), { n: -3, d: 4, kind: "frac" });
  for (const s of ["", "−", ",", "3/0", "1,5/2", "/4", "1,2,3", "1/2/3"]) assert.equal(readTyped(s), null, s);
  // enakovredni zapisi, razen kadar naloga preverja prav zapis
  const q = (qq, a, w = []) => ({ q: qq, a, w });
  assert.equal(checkTyped("0,5", q("1/4 + 1/4", "1/2")), "ok");
  assert.equal(checkTyped(",5", q("1/4 + 1/4", "1/2")), "ok");
  assert.equal(checkTyped("2/4", q("1/4 + 1/4", "1/2")), "reduce");
  assert.equal(checkTyped("0,7", q("0,7 = ?", "7/10")), "asFrac");
  assert.equal(checkTyped("7/10", q("0,7 = ?", "7/10")), "ok");
  assert.equal(checkTyped("5/4", q("5/4 = ?", "1,25")), "asDec");
  assert.equal(checkTyped("1.25", q("5/4 = ?", "1,25")), "ok");
  assert.equal(checkTyped("0,8", q("20/25 = ?", "4/5")), "asFrac");
  assert.equal(checkTyped("4,0", q("2 + 2", "4")), "ok");
  assert.equal(checkTyped("8/2", q("2 + 2", "4")), "reduce");
  assert.equal(checkTyped("5", q("2 + 2", "4")), "no");
  assert.equal(checkTyped("−4", q("x + 6 = 2", "x = −4")), "ok");
  assert.equal(checkTyped("-4", q("x + 6 = 2", "x = −4")), "ok");
  assert.equal(checkTyped("4", q("x + 6 = 2", "x = −4")), "no");
  assert.equal(checkTyped("8,6", q("860 c = ?", "8,60 €")), "ok");
  assert.equal(checkTyped("1001", q("9₁₀ = ?₂", "1001")), "ok");
  assert.equal(checkTyped("1001,0", q("9₁₀ = ?₂", "1001")), "no");
  assert.deepEqual(padKeys([readNumber("3"), readNumber("−1/2")]), { neg: true, dec: true, frac: true });
  assert.deepEqual(padKeys([readNumber("3"), readNumber("12")]), { neg: false, dec: false, frac: false });
});

test("games: number line – every accepted concept and tier gives a finite answer on the drawn line", () => {
  for (const lang of ["sl", "en"]) {
    setNumberStyle(lang);
    for (const c of CONCEPTS.filter((x) => numline.fits(x))) {
      for (let tier = 1; tier <= 3; tier++) {
        let tries = 0;
        for (let i = 0; i < 40; i++) {
          const [q, k] = drawFor(numline, c.id, tier);
          tries += k + 1;
          const where = `${lang} ${c.id} ${tier}: ${q && `${q.q} → ${q.a}`}`;
          assert.ok(q, `${where}: ni sprejete naloge`);
          const L = lineFor(q, tier);
          assert.ok(L, where);
          const p = readNumber(q.a);
          assert.ok(Number.isFinite(p.v), where);
          assert.ok(Number.isInteger(L.at) && L.at >= 0 && L.at <= L.cells, `${where}: odgovor ni na premici (${L.at}/${L.cells})`);
          assert.ok(L.cells >= 4 && L.cells <= 40 && L.labels.length >= 2, `${where}: ${L.cells} razdelkov`);
          assert.ok(Math.abs(L.lo + L.at * L.u - p.v) < 1e-9 * Math.max(1, Math.abs(p.v)), `${where}: ${L.lo} + ${L.at}·${L.u}`);
          assert.ok(p.v >= L.lo - 1e-9 && p.v <= L.lo + L.cells * L.u + 1e-9, where);
          if (p.v >= 0) assert.ok(L.lo >= 0, `${where}: negativna premica za pozitiven odgovor`);
          // izpis na mestu odgovora je odgovor (isti zapis brez enote ali enakovreden), premica brez NaN
          const shown = readNumber(lineValueText(L, L.at));
          assert.ok(shown && Math.abs(shown.v - p.v) < 1e-9, `${where}: ${lineValueText(L, L.at)}`);
          for (const [, txt] of L.labels) assert.ok(!/NaN|undefined|Infinity|e[+-]/.test(txt), `${where}: ${txt}`);
          assert.ok(lineHit(L, L.at), where);
          assert.ok([0, 1].includes(L.tol) && (tier < 3 || L.tol === 0), where);
          // tipična napaka (napačni odgovor) na premici nikoli ne šteje kot zadetek
          for (const w of q.w.map(readNumber)) {
            if (!w || w.unit.trim() !== p.unit.trim()) continue;
            const kw = (w.v - L.lo) / L.u;
            if (Math.abs(kw - Math.round(kw)) < 1e-9 && kw >= 0 && kw <= L.cells) assert.ok(!lineHit(L, Math.round(kw)), `${where}: napačni ${w.v} je zadetek`);
          }
        }
        // igra med igro preskoči neustrezne naloge; teh ne sme biti toliko, da bi bila igra počasna
        assert.ok(tries <= 40 * 5, `${lang} ${c.id} ${tier}: ${tries} poskusov za 40 nalog`);
      }
    }
  }
  setNumberStyle("sl");
});

test("games: mental maths – the canonical answer and its equivalent forms count, wrong ones do not", () => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  for (const lang of ["sl", "en"]) {
    setNumberStyle(lang);
    const D = lang === "sl" ? "," : ".";
    for (const c of CONCEPTS.filter((x) => typed.fits(x))) {
      for (let tier = 1; tier <= 3; tier++) {
        for (let i = 0; i < 30; i++) {
          const [q] = drawFor(typed, c.id, tier);
          const where = `${lang} ${c.id} ${tier}: ${q && `${q.q} → ${q.a}`}`;
          assert.ok(q, where);
          const p = typedTask(q);
          assert.ok(p, where);
          // kar učenec vtipka: odgovor brez predpone (x =) in enote, ki ju igra pokaže ob polju
          const core = q.a.slice(p.pre.length, q.a.length - p.unit.length).trim();
          assert.equal(checkTyped(core, q), "ok", `${where}: »${core}«`);
          assert.equal(checkTyped(core.replace(/−/g, "-"), q), "ok", where);
          if (p.kind === "code") {
            assert.equal(checkTyped(`${core}1`, q), "no", where);
            continue;
          }
          if (p.kind === "dec") {
            assert.equal(checkTyped(`${core}0`, q), "ok", `${where}: ničla na koncu`);
            assert.equal(checkTyped(core.replace(D, D === "," ? "." : ","), q), "ok", `${where}: druga decimalna ločila`);
            if (Math.abs(p.v) < 1) assert.equal(checkTyped(core.replace(/^(−?)0/, "$1"), q), "ok", `${where}: brez ničle pred vejico`);
          }
          if (p.kind === "int") assert.equal(checkTyped(`${core}${D}0`, q), "ok", where);
          if (p.kind === "frac") {
            const [n, d] = [p.n, p.d];
            assert.equal(checkTyped(`${2 * n}/${2 * d}`.replace("-", "−"), q), "reduce", `${where}: neokrajšan`);
            if (10000 % d === 0) assert.ok(["ok", "asFrac"].includes(checkTyped(String(n / d).replace(".", D).replace("-", "−"), q)), `${where}: decimalni zapis`);
            assert.equal(gcd(n, d), 1, where);
          }
          // napačno: za ena več in vsak napačni odgovor z drugo vrednostjo
          const plus = p.kind === "frac" ? `${p.n + p.d}/${p.d}` : String(Math.round((p.v + 1) * 1e6) / 1e6).replace(".", D);
          assert.equal(checkTyped(plus.replace("-", "−"), q), "no", `${where}: ${plus}`);
          for (const w of q.w) {
            const x = readNumber(w);
            if (!x || Math.abs(x.v - p.v) < 1e-9) continue;
            const s = w.slice(x.pre.length, w.length - x.unit.length).trim();
            assert.equal(checkTyped(s, q), "no", `${where}: napačni »${s}«`);
          }
        }
      }
    }
  }
  setNumberStyle("sl");
});

// Motorja brez brskalnika: G.ui je preprost nadomestek, odgovor gre skozi G.answer kot v core.js.
function fakeG(cid, tier = 1) {
  const got = [];
  const el = { textContent: "" };
  const G = {
    W: 360, H: 480, tier, streak: 0, chapter: 1, waiting: false, running: true, paused: false, over: false, reduced: true, time: 0,
    t: (k, v) => `${k}${v ? JSON.stringify(v) : ""}`,
    ui: { innerHTML: "", querySelector: () => el, addEventListener() {} },
    answer: (ok, x, y, o) => got.push([ok, o]),
    stopTimer() {}, sound() {}, hint() {},
    got, el,
  };
  return G;
}

test("games: number line and mental maths engines – keys move, confirm and judge like the rules", () => {
  setNumberStyle("sl");
  for (const cid of ["add", "frac_add", "dec_add", "neg_add", "lin2"]) {
    for (let round = 0; round < 15; round++) {
      const G = fakeG(cid, 1 + (round % 3));
      const e = numline.create(G);
      e.resize();
      e.reset();
      const [q] = drawFor(numline, cid, G.tier);
      G.q = q;
      e.question(q);
      const { L } = e.peek();
      assert.ok(L, `${cid}: ${q.q} → ${q.a}`);
      // Home → skrajno levo, nato desno do izbranega razdelka; izpis za bralnik zaslona pove vrednost
      const right = round % 2 === 1;
      const want = right ? L.at : L.at + L.tol + 1 <= L.cells ? L.at + L.tol + 1 : L.at - L.tol - 1;
      e.key("Home", true);
      for (let k = 0; k < want; k++) e.key("ArrowRight", true);
      assert.equal(e.peek().cur, want);
      assert.ok(G.el.textContent.endsWith(lineValueText(L, want)), G.el.textContent);
      e.key("Enter", true);
      e.update(1);
      e.update(1);
      assert.equal(G.got.length, 1, cid);
      const [ok, o] = G.got[0];
      assert.equal(ok, right, `${cid}: ${q.q} → ${q.a} @ ${lineValueText(L, want)}`);
      // napaka ima smer in velikost: »za … premalo/preveč«
      if (!right) assert.match(o.note, want > L.at ? /games\.e\.numline\.high/ : /games\.e\.numline\.low/);
      // po odgovoru tipke ne štejejo več
      e.key("Enter", true);
      e.update(1);
      assert.equal(G.got.length, 1);
    }
  }
  for (const cid of ["add", "frac_add", "dec_add", "neg_add", "lin2", "r_dec2bin"]) {
    for (let round = 0; round < 10; round++) {
      const G = fakeG(cid, 1 + (round % 3));
      G.ask = (tier = G.tier) => drawFor(typed, cid, tier)[0];
      const e = typed.create(G);
      e.reset();
      const [q] = drawFor(typed, cid, G.tier);
      G.q = q;
      e.question(q);
      const p = typedTask(q);
      const core = q.a.slice(p.pre.length, q.a.length - p.unit.length).trim();
      const right = round % 2 === 0;
      const keys = [...(right ? core : `${core}9`)].map((ch) => (ch === "−" ? "-" : ch));
      for (const k of keys) assert.ok(e.key(k, true), `${cid}: tipka ${k}`);
      e.key("Enter", true);
      assert.equal(G.got.length, 1, `${cid}: ${q.q} → ${q.a} (${keys.join("")})`);
      assert.equal(G.got[0][0], right, `${cid}: ${q.q} → ${q.a} (${keys.join("")})`);
    }
  }
});

test("games: new game kinds have names, how-to text, pace, tile pattern and icon", async () => {
  const fs = await import("node:fs");
  const sl = (await import("../public/i18n/sl.js")).default;
  const css = fs.readFileSync(new URL("../public/games.css", import.meta.url), "utf8");
  const icons = fs.readFileSync(new URL("../public/icons.js", import.meta.url), "utf8");
  for (const e of ENGINES) {
    assert.ok(sl[`games.e.${e.id}`] && sl[`games.e.${e.id}.how`], e.id);
    assert.ok(css.includes(`.gm-k-${e.id}::before`), `.gm-k-${e.id}`);
    assert.ok(icons.includes(`"${e.icon}":`), `${e.id}: ikona ${e.icon}`);
  }
  for (const k of ["games.confirm", "games.yourAnswer", "games.e.numline.less", "games.e.numline.more", "games.e.numline.low", "games.e.numline.high", "games.e.typed.erase", "games.e.typed.neg", "games.e.typed.comma", "games.e.typed.slash", "games.e.typed.reduce", "games.e.typed.asFrac", "games.e.typed.asDec"]) assert.ok(sl[k], k);
  assert.match(css, /\.gm-calm \.gm-key/);
});

// Sestavi enačbo in Razvrsti po velikosti (public/games/produce2.js): odgovor sestaviš iz ploščic ali razvrstiš.
const produce2 = await import("../public/games/produce2.js");
const { tiles, order, tilesTask, tilesModel, orderItems, orderRound, orderOk, fitNow2, ORDER_N } = produce2;
// Neodvisen račun v plavajoči vejici (JavaScript), da preverjanje igre ne preverja samo sebe.
function jsEval(src, env = {}, lang = "sl") {
  let s = String(src).trim();
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  s = s.replace(/⁻?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => `^(${m.replace("⁻", "-").replace(/./g, (c) => (SUP.includes(c) ? SUP.indexOf(c) : c))})`);
  s = s.replace(/−/g, "-");
  if (lang === "sl") s = s.replace(/(\d),(\d)/g, "$1.$2");
  // ulomek brez presledkov (3/7) je eno število; » / « s presledki je deljenje
  s = s.replace(/(\d+(?:\.\d+)?)\/(\d+)/g, "($1/$2)");
  s = s.replace(/·|×/g, "*").replace(/:|÷/g, "/").replace(/%/g, "/100");
  // člen s koeficientom je celota: 2a⁷ = (2·a⁷), tudi ob deljenju (2a⁹ : 2a⁷)
  s = s.replace(/(\d+(?:\.\d+)?)([xyabC])(\^\(-?\d+\))?/g, "($1*$2$3)");
  // absolutna vrednost: | odpre na začetku ali za znakom/oklepajem, sicer zapre
  let out = "";
  for (const ch of s) {
    if (ch === "|") out += /(^|[-+*/(=^]\s*)$/.test(out) || !out.trim() ? "ABS(" : ")";
    else out += ch;
  }
  s = out;
  // fakulteta: število! ali (…)!
  for (let k = 0; k < 5 && s.includes("!"); k++) {
    s = s.replace(/(\d+)!/g, "FAKT($1)");
    const i = s.indexOf(")!");
    if (i >= 0) {
      let d = 0, j = i;
      for (; j >= 0; j--) {
        if (s[j] === ")") d++;
        if (s[j] === "(") d--;
        if (d === 0) break;
      }
      s = `${s.slice(0, j)}FAKT${s.slice(j, i + 1)}${s.slice(i + 2)}`;
    }
  }
  s = s.replace(/√/g, "SQRT").replace(/∛/g, "KBRT");
  s = s.replace(/(SQRT|KBRT)(\d+(?:\.\d+)?|[xyabC])/g, "$1($2)");
  // množenje brez znaka: 13x, 2(, )(, x(, 2sqrt, )x
  s = s.replace(/(\d|\))\s*(?=[xyabC(]|SQRT|KBRT|ABS|FAKT)/g, "$1*").replace(/([xyabC])\s*(?=\(|[xyabC])/g, "$1*");
  // potenca pred minusom spredaj: −3^(2) = −(3^(2))
  s = s.replace(/\^/g, "**");
  s = s.replace(/(^|[-+*/(=,]\s*)-(\d+(?:\.\d+)?|[xyabC])\*\*\((-?\d+)\)/g, "$1-($2**($3))");
  const fact = (n) => (Number.isInteger(n) && n >= 0 ? [...Array(n)].reduce((f, _, i) => f * (i + 1), 1) : NaN);
  return Function("ABS", "SQRT", "KBRT", "FAKT", ...Object.keys(env), `return (${s});`)(Math.abs, Math.sqrt, Math.cbrt, fact, ...Object.values(env));
}
const near9 = (a, b) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a), Math.abs(b));
const POINTS = [[2, 3, 5, 7, 11], [3, -1, 4, 1.5, -2], [-2.5, 6, 0.5, 9, 13], [7, 2, -3, 5, 0.25]];
const envAt = (vars, k) => Object.fromEntries([...vars].map((v, j) => [v, POINTS[k % 4][j]]));
const varsIn = (s) => new Set((String(s).match(/[xyabC]/g) || []));
// Ali je sestavljena enačba ali odgovor res pravilen (neodvisno od igre).
function trulyRight(T, q, f, lang) {
  const built = T.fill(f);
  if (T.mode === "blank") {
    const [l, r] = built.split("=");
    const vars = varsIn(built);
    let ok = 0;
    for (let k = 0; k < 4; k++) {
      const env = envAt(vars, k);
      let a, b;
      try {
        [a, b] = [jsEval(l, env, lang), jsEval(r, env, lang)];
      } catch {
        return false;
      }
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      if (!near9(a, b)) return false;
      ok++;
      if (!vars.size) break;
    }
    return ok > 0;
  }
  const want = q.a.replace(/^y\s?=\s?/, "");
  const vars = varsIn(want + built);
  let ok = 0;
  for (let k = 0; k < 4; k++) {
    const env = envAt(vars, k);
    const a = jsEval(built, env, lang), b = jsEval(want, env, lang);
    if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
    if (!near9(a, b)) return false;
    ok++;
  }
  if (!ok) return false;
  // brez spremenljivk (2 · 3 · 5, 1 : 4) mora biti oblika ista: iste ploščice, le v drugem vrstnem redu
  if (!vars.size) return f.filter((_, k) => T.slots[k].kind === "t").sort().join("|") === T.canon.filter((_, k) => T.slots[k].kind === "t").sort().join("|");
  return true;
}
// vse (ali naključne) razporeditve ploščic na mesta
function* arrangements(T, rnd, cap = 4000) {
  const term = T.slots.map((s, k) => (s.kind === "t" ? k : -1)).filter((k) => k >= 0);
  const ops = T.slots.map((s, k) => (s.kind === "o" ? k : -1)).filter((k) => k >= 0);
  const n = T.tiles.length;
  let total = 1;
  for (let i = 0; i < term.length; i++) total *= n - i;
  total *= T.stamps.length ** ops.length;
  const build = (perm, opc) => {
    const f = T.slots.map(() => null);
    term.forEach((k, i) => (f[k] = T.tiles[perm[i]].s));
    ops.forEach((k, i) => (f[k] = T.stamps[opc[i]]));
    return f;
  };
  if (total <= cap) {
    const rec = function* (perm) {
      if (perm.length === term.length) {
        const opsAll = (function* go(o) {
          if (o.length === ops.length) yield o;
          else for (let i = 0; i < T.stamps.length; i++) yield* go([...o, i]);
        })([]);
        for (const opc of opsAll) yield build(perm, opc);
        return;
      }
      for (let i = 0; i < n; i++) if (!perm.includes(i)) yield* rec([...perm, i]);
    };
    yield* rec([]);
  } else {
    for (let s = 0; s < cap; s++) {
      const idx = [...Array(n).keys()].sort(() => rnd() - 0.5).slice(0, term.length);
      yield build(idx, ops.map(() => Math.floor(rnd() * T.stamps.length)));
    }
  }
}

test("games: »Sestavi enačbo« and »Razvrsti po velikosti« apply only to fitting concepts; the list is fresh", () => {
  setNumberStyle("sl");
  for (const e of [tiles, order]) {
    assert.ok(ENGINES.includes(e), e.id);
    assert.equal(e.added, "2026-11-04");
    assert.equal(PACE[e.id], 1, `${e.id}: mirna igra`);
    const mine = CONCEPTS.filter((c) => e.fits(c)).map((c) => c.id);
    const now = CONCEPTS.filter((c) => fitNow2[e.id](c)).map((c) => c.id);
    assert.deepEqual(mine, now, `${e.id}: seznam pojmov je star – zaženi node scripts/igre-pojmi.js`);
    assert.ok(mine.length >= 20, `${e.id}: samo ${mine.length} pojmov`);
    assert.ok(mine.length < CONCEPTS.length / 4, `${e.id}: preveč pojmov (${mine.length})`);
    for (const id of FITS[e.id]) assert.ok(CONCEPTS.some((c) => c.id === id), `${e.id}: neznan pojem ${id}`);
  }
  const has = (e, id) => e.fits(CONCEPTS.find((c) => c.id === id));
  for (const id of ["add", "mul", "order", "frac_add", "dec_mul", "sqrt", "pow_rules", "factor", "expand", "binom", "factor_alg", "line_eq", "der_poly"]) assert.ok(has(tiles, id), `tiles ${id}`);
  for (const id of ["prime", "frac_compare", "m_word1", "lin1", "quad", "units", "m_clock"]) assert.ok(!has(tiles, id), `tiles ne ${id}`);
  for (const id of ["add", "mul", "frac_add", "frac_compare", "sqrt", "neg_exp", "abs"]) assert.ok(has(order, id), `order ${id}`);
  for (const id of ["prime", "m_even", "divrule", "lin1", "expand", "m_word1"]) assert.ok(!has(order, id), `order ne ${id}`);
  // ura (8:30) ni deljenje, besedilna naloga ni račun, napačno razumljen odstotek (180 + 20 %) ni pravilna enačba
  assert.equal(tilesModel({ q: "Koliko je ura?", a: "8:30", w: ["9:30", "8:00", "7:30"] }), null);
  assert.equal(tilesModel({ q: "180 + 20 %", a: "216", w: ["144", "200", "36"] }), null);
  assert.equal(tilesModel({ q: "4/8 = ?", a: "1/2", w: ["4/2", "1/8", "1"] }), null);
  assert.ok(tilesModel({ q: "10 % · 280", a: "28", w: ["252", "290", "280"] }));
  // kartice: le vprašanja o velikosti, vrednosti morajo biti različne
  assert.equal(orderItems({ q: "Katero število je sodo?", a: "4", w: ["17", "1", "3"] }), null);
  assert.equal(orderItems({ q: "Največje?", a: "2/4", w: ["1/2", "1/3", "1/5"] }), null);
  assert.equal(orderItems({ q: "Imam 5 jabolk. Dobim 3. Koliko jih imam?", a: "8", w: ["7", "9", "2"] }), null);
  assert.ok(orderItems({ q: "Katero število je največje?", a: "7/2", w: ["√8", "1,8", "3,2"] }));
  // »1(x + 8)« ni naloga; »−1(x + 4)« se pokaže kot »−(x + 4)«
  assert.equal(tilesModel({ q: "1(x + 8)", a: "x + 8", w: ["x + 1", "x − 8", "8x + 8"] }), null);
  assert.equal(tilesTask({ q: "−1(x + 4)", a: "−x − 4", w: ["−x + 4", "x − 4", "−4x − 4"] }, 1).lead, "−(x + 4)");
  // razstavljanje: enakovreden, a ne do konca razstavljen izraz (3(2x + 6)) ne šteje; isti členi v drugem redu da
  const fa = tilesTask({ q: "6x + 18", a: "6(x + 3)", w: ["3(2x + 6)", "6(x + 18)", "x(6 + 18)"] }, 1);
  const by = (a) => fa.slots.map((s, k) => (s.kind === "o" ? "+" : a[k]));
  assert.equal(fa.check(by(["3", "2x", null, "6"])).ok, false);
  assert.ok(fa.check(by(["6", "3", null, "x"])).ok);
  // negativen člen za računskim znakom dobi oklepaj (6 + (−5x), ne »6 + −5x«)
  const ln = tilesTask({ q: "k = −5, n = 6", a: "y = −5x + 6", w: ["y = 6x − 5", "y = 5x + 6", "y = −5x − 6"] }, 1);
  assert.equal(ln.fill(["6", "+", "−5x"]), "6 + (−5x)");
  assert.ok(ln.check(["6", "+", "−5x"]).ok);
});

test("games: »Sestavi enačbo« – always solvable, the canonical tiles count, every accepted arrangement is truly right", () => {
  let checked = 0, alt = 0;
  for (const lang of ["sl", "en"]) {
    setNumberStyle(lang);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (const c of CONCEPTS.filter((x) => tiles.fits(x))) {
      for (let tier = 1; tier <= 3; tier++) {
        let tries = 0;
        for (let i = 0; i < (lang === "sl" ? 12 : 5); i++) {
          const [q, k] = drawFor(tiles, c.id, tier);
          tries += k + 1;
          const where = `${lang} ${c.id} ${tier}: ${q && `${q.q} → ${q.a}`}`;
          assert.ok(q, `${where}: ni sprejete naloge`);
          const T = tilesTask(q, tier);
          assert.ok(T, where);
          assert.ok(T.slots.length >= 2 && T.slots.length <= 9, `${where}: ${T.slots.length} mest`);
          // rešljivo z danimi ploščicami: pravilne ploščice so v pladnju, znak med pečati
          const pool = T.tiles.map((x) => x.s);
          for (const [k, s] of T.slots.entries()) {
            if (s.kind === "o") assert.ok(T.stamps.includes(T.canon[k]), `${where}: manjka znak ${T.canon[k]}`);
            else {
              const at = pool.indexOf(T.canon[k]);
              assert.ok(at >= 0, `${where}: manjka ploščica ${T.canon[k]}`);
              pool.splice(at, 1);
            }
          }
          assert.ok(T.tiles.length > T.slots.filter((s) => s.kind === "t").length, `${where}: brez napačnih ploščic`);
          assert.equal(new Set(T.tiles.map((x) => x.s)).size + T.canon.filter((s, k, a) => T.slots[k].kind === "t" && a.indexOf(s) !== k).length, T.tiles.length, `${where}: podvojena napačna ploščica`);
          const canon = T.check(T.canon);
          assert.ok(canon.ok, `${where}: pravilna razporeditev ni sprejeta`);
          assert.ok(trulyRight(T, q, T.canon, lang), `${where}: pravilna razporeditev ni prava (${T.fill(T.canon)})`);
          assert.ok(!/NaN|undefined|Infinity/.test(T.right), where);
          // vsaka sprejeta razporeditev je res pravilna
          for (const f of arrangements(T, rnd, lang === "sl" ? 3000 : 600)) {
            const r = T.check(f);
            if (!r.ok) continue;
            checked++;
            if (f.join("|") !== T.canon.join("|")) alt++;
            assert.ok(trulyRight(T, q, f, lang), `${where}: sprejeto napačno »${T.fill(f)}«`);
          }
          // nepopolna razporeditev ni odgovor
          assert.equal(T.check(T.canon.map((s, k) => (k ? s : null))).ok, false, where);
        }
        assert.ok(tries <= (lang === "sl" ? 12 : 5) * 5, `${lang} ${c.id} ${tier}: ${tries} poskusov`);
      }
    }
  }
  setNumberStyle("sl");
  assert.ok(checked > 1000 && alt > 50, `${checked} sprejetih, ${alt} drugačnih pravilnih`);
});

test("games: »Razvrsti po velikosti« – distinct values, the stated order is the true order, shown forms are right", () => {
  for (const lang of ["sl", "en"]) {
    setNumberStyle(lang);
    const D = lang === "sl" ? "," : ".";
    for (const c of CONCEPTS.filter((x) => order.fits(x))) {
      for (let tier = 1; tier <= 3; tier++) {
        const ask = () => drawFor(order, c.id, tier)[0];
        for (let i = 0; i < (lang === "sl" ? 20 : 6); i++) {
          const q = ask();
          const R = orderRound(q, ask, tier);
          const where = `${lang} ${c.id} ${tier}: ${q.q} → ${q.a}`;
          assert.ok(R, where);
          const n = R.cards.length;
          assert.ok(n >= 4 && n <= ORDER_N[tier - 1], `${where}: ${n} kartic`);
          if (tier === 1) assert.equal(R.dir, 1, where);
          assert.equal(new Set(R.cards.map((x) => x.s)).size, n, `${where}: enaki kartici`);
          // vrednost vsake kartice neodvisno: račun na kartici ali zapis števila (3/4, 0,75, √8, 45 %)
          const vals = R.cards.map((x) => {
            const v = jsEval(x.s.replace(/\s*(%|€|°)$/, ""), {}, lang);
            assert.ok(near9(v, x.v), `${where}: ${x.s} = ${v}, ne ${x.v}`);
            if (x.a != null) assert.ok(near9(readNumber(x.a).v, v), `${where}: ${x.s} = ${x.a}`);
            return x.v;
          });
          for (let a = 0; a < n; a++) for (let b = 0; b < a; b++) assert.ok(Math.abs(vals[a] - vals[b]) > 1e-9 * Math.max(1, Math.abs(vals[a])), `${where}: enaki vrednosti ${R.cards[a].s}, ${R.cards[b].s}`);
          // pravilni vrstni red je res urejen v napisani smeri in edini sprejet
          assert.deepEqual([...R.right].sort(), [...Array(n).keys()], where);
          for (let k = 1; k < n; k++) assert.ok(R.dir * (vals[R.right[k]] - vals[R.right[k - 1]]) > 0, `${where}: vrstni red`);
          assert.ok(orderOk(R.cards, R.right, R.dir), where);
          assert.ok(!orderOk(R.cards, [...R.right].reverse(), R.dir), where);
          const swap = [...R.right];
          [swap[0], swap[1]] = [swap[1], swap[0]];
          assert.ok(!orderOk(R.cards, swap, R.dir), where);
          assert.ok(!orderOk(R.cards, R.cards.map((_, k) => k), R.dir) || R.cards.length < 2, `${where}: kartice so že urejene`);
          // razkrite vrednosti: pravi zapis (decimalna vejica po jeziku) in prava vrednost
          for (const x of R.cards) {
            if (!x.val) {
              assert.ok(!/\//.test(x.s) && !/√|∛/.test(x.s), `${where}: ${x.s} brez razkrite vrednosti`);
              continue;
            }
            assert.ok(!/NaN|undefined|Infinity/.test(x.val), where);
            const last = x.val.split(/[=≈]/).pop().trim();
            if (/\d[.,]\d/.test(last)) assert.ok(last.includes(D) && !last.includes(D === "," ? "." : ","), `${where}: ${x.val}`);
            const r = readNumber(last);
            assert.ok(r, `${where}: ${x.val}`);
            const tol = x.val.includes("≈") ? 0.5 * 10 ** -((last.split(D)[1] || "").length) + 1e-12 : 1e-9;
            assert.ok(Math.abs(r.v - x.v) <= tol * Math.max(1, x.val.includes("≈") ? 1 : Math.abs(x.v)), `${where}: ${x.s} ${x.val}`);
          }
        }
      }
    }
  }
  setNumberStyle("sl");
});

test("games: »Sestavi enačbo« and »Razvrsti po velikosti« engines – keys place, undo and judge like the rules", async () => {
  setNumberStyle("sl");
  const keyOf = (s) => String(s).replace(/−|⁻/g, "-").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).replace(/,/g, ".").replace(/·/g, "*");
  for (const cid of ["add", "mul", "order", "frac_add", "expand", "factor", "line_eq", "pow_rules", "factorial"]) {
    for (let round = 0; round < 9; round++) {
      const G = fakeG(cid, 1 + (round % 3));
      G.ask = (tier = G.tier) => drawFor(tiles, cid, tier)[0];
      const e = tiles.create(G);
      e.reset();
      const [q] = drawFor(tiles, cid, G.tier);
      G.q = q;
      e.question(q);
      const { T } = e.peek();
      assert.ok(T, `${cid}: ${q.q}`);
      assert.ok(e.headline());
      // prazno ni odgovor: le namig
      e.key("Confirm", true);
      assert.equal(G.got.length, 0, cid);
      // vtipkaj pravilne ploščice po vrsti (znak za + in −, števke in črke za ploščico)
      for (const [k, s] of T.canon.entries()) {
        if (T.slots[k].kind === "o") e.key(s === "+" ? "+" : s === "·" ? "*" : s === ":" ? ":" : "-", true);
        else {
          for (const ch of keyOf(s)) e.key(ch, true);
          if (e.peek().fill[k] == null) e.key("Enter", true);
        }
        assert.equal(e.peek().fill[k], s, `${cid}: ${q.q} → mesto ${k} (${T.canon.join(" ")}) ima ${e.peek().fill.join(" ")}`);
      }
      // Backspace vzame zadnjo ploščico, ponovno jo položi tipka
      e.key("Backspace", true);
      assert.equal(e.peek().fill.filter((x) => x == null).length, 1, cid);
      const k = e.peek().fill.indexOf(null), s = T.canon[k];
      if (T.slots[k].kind === "o") e.key(s === "+" ? "+" : s === "·" ? "*" : s === ":" ? ":" : "-", true);
      else {
        for (const ch of keyOf(s)) e.key(ch, true);
        if (e.peek().fill[k] == null) e.key("Enter", true);
      }
      e.key("Confirm", true);
      assert.equal(G.got.length, 1, `${cid}: ${q.q}`);
      assert.equal(G.got[0][0], true, `${cid}: ${q.q} → ${T.fill(e.peek().fill)}`);
      // po odgovoru tipke ne štejejo
      e.key("Confirm", true);
      assert.equal(G.got.length, 1);
    }
  }
  for (const cid of ["add", "frac_compare", "sqrt", "frac_add"]) {
    for (let round = 0; round < 8; round++) {
      const G = fakeG(cid, 1 + (round % 3));
      G.ask = (tier = G.tier) => drawFor(order, cid, tier)[0];
      const e = order.create(G);
      e.reset();
      const q = G.ask();
      G.q = q;
      e.question(q);
      const { R } = e.peek();
      assert.ok(R, cid);
      assert.ok(e.headline() === `games.e.order.${R.dir > 0 ? "up" : "down"}`);
      // naloga za seznam »Ponovi« je cel krog
      assert.ok(G.q.a.includes(R.dir > 0 ? " < " : " > "), G.q.a);
      const right = round % 2 === 0;
      const want = right ? R.right : [R.right[1], R.right[0], ...R.right.slice(2)];
      for (const i of want) {
        // kazalec s puščicami na kartico i, preslednica jo položi na naslednje mesto
        for (let s = 0; s < 10 && e.peek().cur !== i; s++) e.key("ArrowDown", true);
        assert.equal(e.peek().cur, i, cid);
        e.key(" ", true);
      }
      assert.deepEqual(e.peek().slot, want, cid);
      e.key("Enter", true);
      assert.equal(G.got.length, 1, cid);
      assert.equal(G.got[0][0], right, `${cid}: ${G.q.a}`);
      if (!right) assert.match(G.got[0][1].note, /games\.correctWas/);
    }
  }
  const sl = (await import("../public/i18n/sl.js")).default;
  for (const k of ["games.undo", "games.fillAll", "games.e.tiles.ask", "games.e.tiles.build", "games.e.tiles.sides", "games.e.tiles.pieces", "games.e.order.up", "games.e.order.down", "games.e.order.small", "games.e.order.big", "games.e.order.right"]) assert.ok(sl[k], k);
});

// Arabščina: imena pojmov in področij iz names-ar.js (prej angleška), vsak pojem ima ime.
test("games: Arabic concept and area names cover every concept", async () => {
  const T = await import("../public/games/topics.js");
  const { NAMES } = await import("../public/games/names-ar.js");
  const ids = [...T.AREAS.map((a) => `area:${a[0]}`), ...T.CONCEPTS.map((c) => c.id)];
  assert.deepEqual(ids.filter((id) => !NAMES[id]), [], "manjka arabsko ime");
  assert.deepEqual(Object.keys(NAMES).filter((id) => !ids.includes(id)), [], "odvečno ime");
  for (const id of ids) assert.match(NAMES[id], /[؀-ۿ]/, id);
  await T.loadConceptNames("ar");
  assert.equal(T.conceptName(T.CONCEPTS[0]), NAMES[T.CONCEPTS[0].id]);
  assert.equal(T.areaName(T.AREAS[0][0]), NAMES[`area:${T.AREAS[0][0]}`]);
  await T.loadConceptNames("de");
  assert.ok([T.CONCEPTS[0].name.sl, T.CONCEPTS[0].name.en].includes(T.conceptName(T.CONCEPTS[0])));
  await T.loadConceptNames("sl");
});
