import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { Leagues, LEAGUE, TIERS, weekId, normalizeCode, isValidNickname } from "../server/leagues.js";

function setup(nowIso = "2026-10-28T10:00:00Z") {
  const store = openDb(":memory:");
  let now = new Date(nowIso);
  const leagues = new Leagues(store, { now: () => now });
  const xp = (studentId, amount, at) =>
    store.db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, ?, 'test', ?)").run(studentId, amount, at);
  return { store, leagues, xp, setNow: (iso) => (now = new Date(iso)) };
}

test("weekId is the Monday of the week (UTC)", () => {
  assert.equal(weekId(new Date("2026-10-28T10:00:00Z")), "2026-10-26"); // sreda
  assert.equal(weekId(new Date("2026-11-01T23:59:00Z")), "2026-10-26"); // nedelja
  assert.equal(weekId(new Date("2026-11-02T00:00:00Z")), "2026-11-02"); // ponedeljek
});

test("nicknames come only from the generated word lists", () => {
  const { store, leagues } = setup();
  const s = store.createStudent("Ana Novak");
  const p = leagues.profile(s.id);
  assert.ok(isValidNickname(p.nickname));
  assert.ok(!p.nickname.includes("Ana"));
  assert.equal(leagues.setNickname(s.id, "Ana Novak"), false);
  const opt = leagues.nicknameOptions()[0];
  assert.equal(leagues.setNickname(s.id, opt), true);
  assert.equal(leagues.profile(s.id).nickname, opt);
});

test("only students with XP this week are placed; groups cap at 30", () => {
  const { store, leagues, xp } = setup();
  const ids = [];
  for (let i = 0; i < 35; i++) {
    const s = store.createStudent(`U${i}`);
    ids.push(s.id);
    xp(s.id, 10 + i, "2026-10-27 09:00:00");
  }
  const idle = store.createStudent("Idle");
  const v = leagues.leagueView(ids[0]);
  assert.equal(v.joined, true);
  assert.equal(v.board.length, LEAGUE.groupSize);
  assert.equal(leagues.leagueView(ids[34]).board.length, 5);
  assert.equal(leagues.leagueView(idle.id).joined, false);
  // vzdevki, brez imen
  assert.ok(v.board.every((m) => isValidNickname(m.nickname)));
  assert.equal(v.board.filter((m) => m.me).length, 1);
});

test("OŠ and SŠ students are in separate groups", () => {
  const { store, leagues, xp } = setup();
  const a = store.createStudent("A");
  const b = store.createStudent("B", { educational_track: "SREDNJA_SOLA", curriculum_level: "1. letnik" });
  xp(a.id, 10, "2026-10-27 09:00:00");
  xp(b.id, 10, "2026-10-27 09:00:00");
  assert.equal(leagues.leagueView(a.id).board.length, 1);
  assert.equal(leagues.leagueView(b.id).board.length, 1);
});

test("week rollover promotes the top, demotes the bottom, and resets XP", () => {
  const { store, leagues, xp, setNow } = setup();
  const ids = [];
  for (let i = 0; i < 20; i++) {
    const s = store.createStudent(`U${i}`);
    ids.push(s.id);
    xp(s.id, 100 - i, "2026-10-27 09:00:00"); // U0 največ
  }
  // vsi začnejo v Srebrni, da lahko kdo tudi izpade
  for (const id of ids) leagues.profile(id);
  store.db.prepare("UPDATE league_profiles SET tier = 1").run();
  leagues.sync();

  setNow("2026-11-03T08:00:00Z");
  const first = leagues.leagueView(ids[0]);
  assert.equal(first.joined, false); // nov teden, še brez XP
  assert.equal(first.lastWeek.outcome, "up");
  assert.equal(first.tierName, TIERS[2]);
  const last = leagues.leagueView(ids[19]);
  assert.equal(last.lastWeek.outcome, "down");
  assert.equal(last.tierName, TIERS[0]);
  const mid = leagues.leagueView(ids[10]);
  assert.equal(mid.lastWeek.outcome, "stay");
  assert.equal(mid.tierName, TIERS[1]);
  const up = ids.filter((id) => leagues.profile(id).tier === 2).length;
  const down = ids.filter((id) => leagues.profile(id).tier === 0).length;
  assert.equal(up, LEAGUE.promote(20));
  assert.equal(down, LEAGUE.demote(20));

  // nova skupina tedna začne od 0
  xp(ids[19], 5, "2026-11-03 07:00:00");
  const v = leagues.leagueView(ids[19]);
  assert.equal(v.joined, true);
  assert.equal(v.board[0].xp, 5);
});

test("codes are normalized; class join, board, leave", () => {
  const { store, leagues, xp } = setup();
  assert.equal(normalizeCode("abc-234"), "ABC234");
  assert.equal(normalizeCode("abc"), null);
  const cls = leagues.createClass("8.b");
  assert.match(cls.code, /^[A-Z2-9]{3}-[A-Z2-9]{3}$/);
  const a = store.createStudent("A");
  const b = store.createStudent("B");
  assert.ok(leagues.join(a.id, cls.code.toLowerCase()).ok);
  assert.ok(leagues.join(b.id, cls.code.replace("-", " ")).ok);
  assert.ok(leagues.join(b.id, cls.code).already);
  xp(b.id, 30, "2026-10-27 09:00:00");
  const view = leagues.classesView(a.id);
  assert.equal(view.length, 1);
  assert.deepEqual(view[0].board.map((m) => m.xp), [30, 0]);
  assert.equal(view[0].board[1].me, true);
  assert.ok(leagues.leave(a.id, cls.id));
  assert.equal(leagues.classesView(a.id).length, 0);
});

test("wrong codes are throttled", () => {
  const { store, leagues } = setup();
  const a = store.createStudent("A");
  for (let i = 0; i < LEAGUE.maxFailedJoins; i++) assert.equal(leagues.join(a.id, "ZZZ-ZZZ").status, 404);
  assert.equal(leagues.join(a.id, "ZZZ-ZZZ").status, 429);
});

test("friends group is deleted when the last member leaves", () => {
  const { store, leagues } = setup();
  const a = store.createStudent("A");
  const g = leagues.createFriendsGroup(a.id, "Ekipa");
  assert.equal(leagues.classesView(a.id)[0].owner, true);
  leagues.leave(a.id, g.id);
  assert.equal(leagues.getByCode(g.code), undefined);
});

test("HTTP: teacher creates class, student joins, teacher sees nicknames only", async () => {
  const store = openDb(":memory:");
  const app = createApp(store);
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, { method = "GET", body, headers = {} } = {}) => {
    const r = await fetch(base + path, { method, headers: { "Content-Type": "application/json", ...headers }, body: body && JSON.stringify(body) });
    return { status: r.status, body: await r.json() };
  };
  try {
    const cls = (await call("/api/classes", { method: "POST", body: { name: "8.b" } })).body;
    assert.ok(cls.teacherKey);
    const s = (await call("/api/students", { method: "POST", body: { name: "Miha Kovač" } })).body;
    assert.equal((await call(`/api/students/${s.id}/classes`, { method: "POST", body: { code: cls.code } })).status, 201);
    const lg = (await call(`/api/students/${s.id}/league`)).body;
    assert.equal(lg.league.joined, false);
    assert.equal(lg.classes[0].name, "8.b");

    assert.equal((await call(`/api/classes/${cls.code}`)).status, 403);
    assert.equal((await call(`/api/classes/${cls.code}`, { headers: { "X-Teacher-Key": "narobe" } })).status, 403);
    const t = await call(`/api/classes/${cls.code}`, { headers: { "X-Teacher-Key": cls.teacherKey } });
    assert.equal(t.status, 200);
    assert.equal(t.body.members.length, 1);
    assert.ok(!JSON.stringify(t.body).includes("Miha"));

    const opts = (await call(`/api/students/${s.id}/nickname-options`)).body;
    assert.equal((await call(`/api/students/${s.id}/nickname`, { method: "PUT", body: { nickname: "Miha" } })).status, 400);
    assert.equal((await call(`/api/students/${s.id}/nickname`, { method: "PUT", body: { nickname: opts[0] } })).status, 200);

    const rm = await call(`/api/classes/${cls.code}/members/${t.body.members[0].ref}`, { method: "DELETE", headers: { "X-Teacher-Key": cls.teacherKey } });
    assert.equal(rm.body.ok, true);
    assert.equal((await call(`/api/students/${s.id}/league`)).body.classes.length, 0);
  } finally {
    server.close();
  }
});

test("logged-in teacher manages own classes without the key", () => {
  const { store, leagues } = setup();
  const mine = leagues.createClass("7.a", 42);
  assert.ok(leagues.authTeacher(mine.code, null, 42));
  assert.equal(leagues.authTeacher(mine.code, null, 7), null);
  assert.ok(leagues.authTeacher(mine.code, mine.teacherKey, 7));
  assert.deepEqual(leagues.teacherClasses(42).map((c) => c.name), ["7.a"]);
  assert.equal(leagues.teacherClasses(7).length, 0);
});

test("leaderboard wins give badges that cannot be bought; monthly board with avatars", async () => {
  const { store, leagues, xp, setNow } = setup();
  const ids = [];
  for (let i = 0; i < 4; i++) {
    const s = store.createStudent(`W${i}`);
    ids.push(s.id);
    xp(s.id, 50 - i * 10, "2026-10-27 09:00:00");
  }
  const lonely = store.createStudent("Sam").id; // sam v svoji skupini: zmaga ne šteje
  leagues.profile(lonely);
  store.db.prepare("UPDATE league_profiles SET tier = 3 WHERE student_id = ?").run(lonely);
  xp(lonely, 500, "2026-10-27 09:00:00");
  leagues.sync();
  store.db.prepare("INSERT INTO avatar_state (student_id, equipped) VALUES (?, ?)").run(ids[0], JSON.stringify({ hat: ["hat_crown"], badge: "el_fe" }));

  // Mesečna lestvica: vsi z XP v mesecu, z avatarjem.
  const m = leagues.monthView(ids[1]);
  assert.equal(m.month, "2026-10");
  assert.deepEqual(m.board.map((r) => r.xp), [500, 50, 40, 30, 20]);
  assert.ok(m.board[2].me && !m.me);
  assert.deepEqual(m.board[1].avatar.hat, ["hat_crown"]);

  // Nov teden: zmagovalec skupine dobi značko svoje lige, prvi trije stopničke; sam v skupini nič.
  setNow("2026-11-03T08:00:00Z");
  const v = leagues.leagueView(ids[0]);
  assert.equal(v.lastWeek.award, "win_week_0");
  assert.deepEqual(v.awards.sort(), ["win_month_podium", "win_week_0", "win_week_podium"]); // oktober je zaključen: 2. na mesečni
  assert.equal(leagues.leagueView(ids[2]).lastWeek.award, "win_week_podium");
  assert.equal(leagues.leagueView(ids[3]).lastWeek.award, null);
  assert.deepEqual(leagues.awards(ids[3]), []);
  assert.deepEqual(leagues.awards(lonely).sort(), ["win_month", "win_month_podium"]); // mesečni prvak, tedenska zmaga sam s sabo ne šteje
  // Značke so v inventarju avatarja, kupiti jih ni mogoče.
  const { Avatars } = await import("../server/avatar.js");
  const av = new Avatars(store.db);
  assert.ok(av.owned(lonely).includes("win_month"));
  assert.equal(av.buy(ids[3], "win_month").error, "earn");
});
