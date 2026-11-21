// Dnevni opomnik cilja ne gre na dan, ko je učenec že vadil (pregled #917, 2. prehod, 4 in 5): meje dneva v
// Ljubljani (poletni in zimski čas), vsi viri vaje v eni omejeni poizvedbi, potisno obvestilo preskoči otroka,
// ki je vadil, in ga ne zasede v push_log.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { ljDayBounds, vadilDanes } from "../server/accounts/goal-reminder.js";
import { mountPush } from "../server/mobile/push.js";

test("ljDayBounds: polnoč v Ljubljani v UTC, poletni in zimski čas ter dan premika ure", () => {
  assert.deepEqual(ljDayBounds("2026-12-02"), ["2026-12-01 23:00:00", "2026-12-02 23:00:00"]);
  assert.deepEqual(ljDayBounds("2026-07-15"), ["2026-07-14 22:00:00", "2026-07-15 22:00:00"]);
  assert.deepEqual(ljDayBounds("2026-03-29"), ["2026-03-28 23:00:00", "2026-03-29 22:00:00"]); // 23 ur
  assert.deepEqual(ljDayBounds("2026-10-25"), ["2026-10-24 22:00:00", "2026-10-25 23:00:00"]); // 25 ur
});

test("vadilDanes: XP, dogodek, naloga s poskusom ali lastno sporočilo ta dan; ne dan prej ali odgovor inštruktorja", () => {
  const store = openDb(":memory:");
  const { db } = store;
  const day = "2026-12-02";
  const nov = () => store.createStudent("U", {}).id;
  const a = nov();
  db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 5, 'x', '2026-12-01 22:59:59')").run(a);
  assert.equal(vadilDanes(db, a, day), false, "23.59 prejšnji dan ne šteje");
  db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 5, 'x', '2026-12-01 23:00:00')").run(a);
  assert.equal(vadilDanes(db, a, day), true, "0.00 v Ljubljani šteje");
  const b = nov();
  db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 5, 'x', '2026-12-02 23:00:00')").run(b);
  assert.equal(vadilDanes(db, b, day), false, "naslednji dan ne šteje");
  const c = nov();
  const conv = store.createConversation(c).id;
  db.prepare("INSERT INTO messages (conversation_id, role, api_content, display_text, created_at) VALUES (?, 'assistant', '\"\"', 'x', '2026-12-02 10:00:00')").run(conv);
  assert.equal(vadilDanes(db, c, day), false, "samo odgovor inštruktorja ne šteje");
  db.prepare("INSERT INTO messages (conversation_id, role, api_content, display_text, created_at) VALUES (?, 'user', '\"\"', 'x', '2026-12-02 10:00:00')").run(conv);
  db.prepare("UPDATE conversations SET updated_at = '2026-12-02 10:00:01' WHERE id = ?").run(conv);
  assert.equal(vadilDanes(db, c, day), true, "lastno sporočilo inštruktorju šteje");
  const d = nov();
  db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, attempts, created_at) VALUES (?, 't', 1, '{}', 1, '2026-12-02 08:00:00')").run(d);
  assert.equal(vadilDanes(db, d, day), true, "naloga s poskusom šteje");
});

test("sendGoalPushAll: otrok, ki je danes že vadil, ne dobi obvestila in ni zaseden v push_log", async () => {
  const store = openDb(":memory:");
  const { db } = store;
  const far = "2027-06-01";
  const ana = store.createStudent("Ana", { goal: "matura", goal_date: far, goal_reminder: true });
  const bor = store.createStudent("Bor", { goal: "matura", goal_date: far, goal_reminder: true });
  db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 5, 'x', '2026-12-02 09:00:00')").run(bor.id);
  const sent = [];
  const fetchFn = async (url, o) => {
    const msgs = JSON.parse(o.body);
    sent.push(...msgs);
    return { json: async () => ({ data: msgs.map(() => ({ status: "ok" })) }) };
  };
  const ctx = { db, children: () => [ana, bor].map((s) => store.getStudent(s.id)) };
  const { sendGoalPushAll } = mountPush({ post() {} }, ctx, { fetchFn, scheduler: false, log: { error() {} } });
  db.exec("PRAGMA foreign_keys = OFF");
  db.prepare("INSERT INTO push_tokens (token, parent_id, platform) VALUES ('ExponentPushToken[abcdefghijkl]', 1, 'android')").run();
  const now = new Date("2026-12-02T15:30:00Z");
  assert.equal(await sendGoalPushAll(now), 1);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].data.student_id, ana.id);
  assert.deepEqual(db.prepare("SELECT period FROM push_log").all().map((r) => r.period), [`2026-12-02:${ana.id}`]);
  assert.equal(await sendGoalPushAll(now), 0, "drugič isti dan nič");
});
