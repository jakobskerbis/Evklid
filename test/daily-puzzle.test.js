import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { setNumberStyle, withNumberStyle } from "../public/games/topics.js";
import { puzzleFor, checkAnswer, LEVELS, dayKey, isDay, prevDay, suggestedLevel, totalMs, timeText, HINT_MS, WRONG_MS } from "../public/games/daily.js";
import sl from "../public/i18n/sl.js";

const DAY0 = Date.parse("2026-01-01T00:00:00Z");
const days = (n) => Array.from({ length: n }, (_, i) => dayKey(new Date(DAY0 + i * 864e5)));
const plain = (s) => String(s).replace(/−/g, "-");
const keys = (p) => [p.q, ...p.hints, ...p.steps.filter((s) => typeof s !== "string"), { key: `dz.x.${p.x}` }];

test("daily puzzle: same day and level → same puzzle, any number style; days and levels differ", () => {
  setNumberStyle("sl");
  const kinds = { easy: new Set(), medium: new Set(), hard: new Set() };
  for (const d of days(60)) {
    for (const l of LEVELS) {
      const a = puzzleFor(d, l);
      const b = withNumberStyle("en", () => puzzleFor(d, l));
      assert.equal(a.answer, b.answer, `${d} ${l}`);
      assert.equal(a.kind, b.kind);
      assert.deepEqual(a, puzzleFor(d, l));
      kinds[l].add(a.kind);
    }
    // zaporedna dneva nimata iste vrste
    assert.notEqual(puzzleFor(d, "easy").kind, puzzleFor(prevDay(d), "easy").kind);
  }
  assert.ok(kinds.easy.size >= 4 && kinds.medium.size >= 5 && kinds.hard.size >= 6, JSON.stringify(Object.fromEntries(Object.entries(kinds).map(([k, v]) => [k, [...v]]))));
  assert.notDeepEqual(puzzleFor("2026-11-04", "easy"), puzzleFor("2026-11-04", "medium"));
  assert.equal(puzzleFor("2026-02-30", "easy"), null);
  assert.equal(puzzleFor("2026-11-04", "nope"), null);
  assert.ok(isDay("2026-11-04") && !isDay("2026-13-01") && !isDay("x"));
});

// Rešitev neodvisno izračunana iz prikazanih podatkov (ne iz generatorja).
function solve(p) {
  const v = p.q.vars;
  const N = (s) => Number(plain(s).replace(",", "."));
  if (p.kind === "seq") return null; // pravilo je v namigu; preveri ga spodnji test korakov
  if (p.kind === "think" && p.q.key === "dz.q.think") return (N(v.r) - N(v.a)) / N(v.m);
  if (p.kind === "think") return (N(v.m) * N(v.a)) / (N(v.m) - N(v.k));
  if (p.kind === "sumsq") return N(v.s) ** 2 - 2 * N(v.p);
  if (p.kind === "pct") return N(v.r) / ((1 + N(v.p) / 100) * (1 - N(v.q) / 100));
  if (p.kind === "div") {
    let n = N(v.N), c = 0;
    for (let i = 1; i <= n; i++) if (n % i === 0) c++;
    return c;
  }
  if (p.kind === "incl") {
    let c = 0;
    for (let i = 1; i <= N(v.N); i++) if (i % N(v.a) === 0 || i % N(v.b) === 0) c++;
    return c;
  }
  if (p.kind === "mod") {
    const [, a, e, m] = /^(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+) : (\d+)$/.exec(p.show.text);
    const ex = Number([...e].map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join(""));
    let r = 1n;
    for (let i = 0; i < ex; i++) r = (r * BigInt(a)) % BigInt(m);
    return Number(r);
  }
  if (p.kind === "box") {
    // poskusi vsa cela števila: natanko eno mora ustrezati enačbi
    const [l, r] = plain(p.show.text).split(" = ");
    const f = (s, x) => Function(`return ${s.replace(/□/g, `(${x})`).replace(/·/g, "*")}`)();
    const sols = [];
    for (let x = -50; x <= 50; x++) if (f(l, x) === f(r, x)) sols.push(x);
    assert.equal(sols.length, 1, p.show.text);
    return sols[0];
  }
  if (p.kind === "pyr") {
    // poskusi vse vrednosti na mestu »?« in sestavi piramido navzgor
    const rows = p.show.rows.map((r) => r.map((x) => (x == null ? null : N(x))));
    const bottom = rows.at(-1);
    const top = rows[0][0];
    const build = (b) => {
      let r = b;
      while (r.length > 1) r = r.slice(1).map((x, i) => r[i] + x);
      return r[0];
    };
    if (top == null) return build(bottom);
    const i = bottom.indexOf(null);
    const sols = [];
    for (let x = -100; x <= 100; x++) if (build(bottom.map((y, j) => (j === i ? x : y))) === top) sols.push(x);
    assert.equal(sols.length, 1);
    return sols[0];
  }
  throw new Error(p.kind);
}

test("daily puzzle: answers are right over 400 days × 3 levels; every step and hint text exists", () => {
  setNumberStyle("sl");
  for (const d of days(400)) {
    for (const l of LEVELS) {
      const p = puzzleFor(d, l);
      const where = `${d} ${l} ${p.kind} ${JSON.stringify(p.q.vars)} ${JSON.stringify(p.show)}`;
      assert.ok(Number.isInteger(p.answer), where);
      assert.ok(Math.abs(p.answer) < 1e6, where);
      const s = solve(p);
      if (s !== null) assert.ok(Math.abs(s - p.answer) < 1e-9, `${where} → ${s} ≠ ${p.answer}`);
      // zadnji korak rešitve se konča s pravilnim odgovorom
      const last = p.steps.at(-1);
      assert.ok(plain(last).endsWith(` ${plain(String(p.answer).replace("-", "−"))}`) || plain(last).endsWith(`= ${plain(String(p.answer))}`), `${where}: ${last}`);
      assert.equal(p.hints.length, 2, where);
      for (const k of keys(p)) assert.ok(sl[k.key], `${k.key} manjka v sl.js`);
      assert.ok(![JSON.stringify(p)].some((x) => /NaN|undefined|Infinity|null,null,null,null,null/.test(x.replace(/"rows":\[.*?\]\]/, ""))), where);
      // zaporedja: pravilo velja za vse prikazane člene in da odgovor
      if (p.kind === "seq") {
        const t = [...p.show.items.map((x) => Number(plain(x))), p.answer];
        const d1 = t.slice(1).map((x, i) => x - t[i]);
        const d2 = d1.slice(1).map((x, i) => x - d1[i]);
        const ratio = t.slice(1).map((x, i) => x / t[i]);
        const ok =
          d1.every((x) => x === d1[0]) ||
          d2.every((x) => x === d2[0]) ||
          ratio.every((x) => x === ratio[0]) ||
          [[1, 1], [1, 2], [2, 1]].some(([a, b]) => t.slice(2).every((x, i) => x === a * t[i + 1] + b * t[i])) ||
          [2, 3].some((a) => t.slice(1).every((x, i) => x - a * t[i] === t[1] - a * t[0]));
        assert.ok(ok, where);
      }
    }
  }
});

test("daily puzzle: answer checking, suggested level, time text", () => {
  setNumberStyle("sl");
  const p = { answer: 42 };
  for (const ok of ["42", " 42 ", "42,0", "42.0", "84/2"]) assert.equal(checkAnswer(p, ok), true, ok);
  for (const no of ["41", "−42", "4,2"]) assert.equal(checkAnswer(p, no), false, no);
  for (const bad of ["", "abc", "4 2", "1/0", "x".repeat(30), null]) assert.equal(checkAnswer(p, bad), null, String(bad));
  assert.equal(checkAnswer({ answer: -7 }, "−7"), true);
  assert.equal(checkAnswer({ answer: -7 }, "-7"), true);
  assert.equal(suggestedLevel("os", 5), "easy");
  assert.equal(suggestedLevel("os", 8), "medium");
  assert.equal(suggestedLevel("ss", 11), "medium");
  assert.equal(suggestedLevel("faks", 14), "hard");
  assert.equal(totalMs(40_000, 2, 1), 40_000 + 2 * HINT_MS + WRONG_MS);
  assert.equal(timeText(41_250), "41,2 s");
  assert.equal(timeText(65_000), "1:05");
});

test("daily puzzle: server checks answers, one attempt, hints, time, leaderboard, streak", async () => {
  setNumberStyle("sl");
  let clock = Date.parse("2026-11-04T10:00:00Z");
  const store = openDb(":memory:");
  const app = createApp(store, { dailyNow: () => clock });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = async (p, body, raw) => {
    const r = await fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: raw ?? JSON.stringify(body) });
    return { status: r.status, body: await r.json().catch(() => null) };
  };
  const get = async (p) => {
    const r = await fetch(base + p);
    return { status: r.status, body: await r.json().catch(() => null) };
  };
  try {
    const [a, b, c] = ["Ana", "Bor", "Cene"].map((n) => store.createStudent(n, {}).id);
    const day = "2026-11-04";
    const ans = puzzleFor(day, "easy").answer;
    const u = (id, x) => `/api/students/${id}/daily${x}`;

    // slab vnos → 4xx, nikoli 5xx
    assert.equal((await post(u(a, "/start"), { level: "x" })).status, 400);
    assert.equal((await post(u(a, "/start"), null, "{nope")).status, 400);
    assert.equal((await post(u(a, "/answer"), { level: "easy", answer: String(ans) })).status, 400); // ni začeta
    assert.equal((await get(u(a, "?level=zzz"))).status, 400);
    assert.equal((await get(u(9999, ""))).status, 404);
    assert.equal((await post(u("abc", "/start"), { level: "easy" })).status, 404);

    const st = await post(u(a, "/start"), { level: "easy" });
    assert.equal(st.status, 200);
    assert.equal(st.body.day, day);
    assert.equal(st.body.started, true);
    for (const bad of [{ answer: "abc" }, { answer: { x: 1 } }, { answer: "" }, { answer: ["1"] }, { day: "nope", answer: "1" }]) assert.equal((await post(u(a, "/answer"), { level: "easy", ...bad })).status, 400, JSON.stringify(bad));
    clock += 1000;
    // pravilen odgovor prehitro (1 s) ni verjeten
    assert.equal((await post(u(a, "/answer"), { level: "easy", answer: String(ans) })).status, 400);
    // napačen odgovor: poskus ostane, kazen se šteje
    const w = await post(u(a, "/answer"), { level: "easy", answer: String(ans + 1) });
    assert.deepEqual(w.body, { correct: false, wrong: 1 });
    assert.equal((await post(u(a, "/hint"), { level: "easy" })).body.hints, 1);
    // ponoven začetek ne požene ure znova
    clock += 30_000;
    assert.ok((await post(u(a, "/start"), { level: "easy" })).body.elapsed >= 31_000);
    // brskalnikov čas, daljši od strežnikovega, ni verjeten
    assert.equal((await post(u(a, "/answer"), { level: "easy", answer: String(ans), ms: 999_999 })).status, 400);
    const ok = await post(u(a, "/answer"), { level: "easy", answer: String(ans), ms: 30_500 });
    assert.equal(ok.status, 200);
    assert.equal(ok.body.correct, true);
    assert.equal(ok.body.time, 30_500);
    assert.equal(ok.body.total, 30_500 + HINT_MS + WRONG_MS);
    assert.equal(ok.body.board.rank, 1);
    assert.equal(ok.body.streak.days, 1);
    // en poskus na dan: drugi odgovor, namig ali predaja → 409
    assert.equal((await post(u(a, "/answer"), { level: "easy", answer: String(ans) })).status, 409);
    assert.equal((await post(u(a, "/hint"), { level: "easy" })).status, 409);
    assert.equal((await post(u(a, "/giveup"), { level: "easy" })).status, 409);

    // Bor: hitrejši brez kazni → prvi; brskalnikov čas sme biti le malo krajši od strežnikovega
    await post(u(b, "/start"), { level: "easy" });
    clock += 20_000;
    const bb = await post(u(b, "/answer"), { level: "easy", answer: String(ans), ms: 1 });
    assert.equal(bb.body.time, 15_000); // 20 s − 5 s zamika
    assert.equal(bb.body.board.rank, 1);
    // Cene se preda: ni na lestvici, dobi rešitev
    await post(u(c, "/start"), { level: "easy" });
    assert.equal((await post(u(c, "/hint"), { level: "easy" })).status, 200);
    assert.equal((await post(u(c, "/hint"), { level: "easy" })).status, 200);
    assert.equal((await post(u(c, "/hint"), { level: "easy" })).status, 400); // največ 2
    const g = await post(u(c, "/giveup"), { level: "easy" });
    assert.equal(g.body.answer, ans);
    assert.equal(g.body.board.rank, null);

    const lb = (await get(u(a, "?level=easy"))).body;
    assert.equal(lb.day, day);
    assert.deepEqual(lb.board.top.map((r) => r.me), [false, true]);
    assert.deepEqual(lb.board.top.map((r) => r.rank), [1, 2]);
    assert.ok(lb.board.top[0].total < lb.board.top[1].total);
    assert.equal(lb.board.rank, 2);
    assert.equal(lb.board.solvers, 2);
    assert.equal(lb.status.easy.solved, true);
    assert.equal(lb.status.medium.started, false);
    // zasebnost: samo vzdevek lige in avatar, brez imena in id-ja
    const json = JSON.stringify(lb.board);
    assert.ok(!/Ana|Bor|Cene|student_id/.test(json), json);
    assert.match(lb.board.top[0].nickname, /^\S+ \S+ \d+$/);
    const nick = store.db.prepare("SELECT nickname FROM league_profiles WHERE student_id = ?").get(b).nickname;
    assert.equal(lb.board.top[0].nickname, nick);

    // niz: včeraj in danes rešeno → 2; dan brez rešitve ga prekine
    store.db.prepare("INSERT INTO daily_puzzle (student_id, day, level, started_at, finished_at, solved, time_ms, total_ms) VALUES (?, '2026-11-03', 'hard', 0, 1, 1, 5000, 5000)").run(a);
    store.db.prepare("INSERT INTO daily_puzzle (student_id, day, level, started_at, finished_at, solved, time_ms, total_ms) VALUES (?, '2026-11-01', 'hard', 0, 1, 1, 5000, 5000)").run(a);
    assert.equal((await get(u(a, ""))).body.streak.days, 2);
    // naslednji dan je nova uganka; včerajšnji začeti poskus se da še končati
    await post(u(a, "/start"), { level: "medium" });
    clock += 864e5;
    assert.equal((await get(u(a, ""))).body.day, "2026-11-05");
    assert.equal((await get(u(a, ""))).body.status.medium.started, false);
    const y = puzzleFor(day, "medium").answer;
    const late = await post(u(a, "/answer"), { level: "medium", day, answer: String(y) });
    assert.equal(late.status, 200, JSON.stringify(late.body));
    assert.equal((await post(u(a, "/answer"), { level: "medium", day: "2026-10-01", answer: "1" })).status, 400); // prestar dan
  } finally {
    server.close();
  }
});

test("daily puzzle: another family's student is not reachable (accounts)", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, guest: true, scheduler: false, resendKey: "", log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (path, body) => {
      const r = await fetch(base + path, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") }, body: body ? JSON.stringify(body) : undefined });
      for (const c of r.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar[kv.slice(0, i)] = kv.slice(i + 1);
      }
      return { status: r.status, body: await r.json().catch(() => null) };
    };
  };
  try {
    const a = client();
    const b = client();
    await a("/api/auth/guest", { accept_privacy: true });
    await b("/api/auth/guest", { accept_privacy: true });
    const kid = await a("/api/students", { name: "Gost", birth_year: new Date().getFullYear() - 12, consent: true });
    assert.equal(kid.status, 201, JSON.stringify(kid.body));
    assert.equal((await a(`/api/students/${kid.body.id}/daily/start`, { level: "easy" })).status, 200);
    assert.equal((await b(`/api/students/${kid.body.id}/daily/start`, { level: "easy" })).status, 404);
    assert.equal((await b(`/api/students/${kid.body.id}/daily/answer`, { level: "easy", answer: "1" })).status, 404);
    assert.equal((await b(`/api/students/${kid.body.id}/daily?level=easy`)).status, 404);
  } finally {
    server.close();
  }
});
