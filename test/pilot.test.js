// Merjenje v pilotu (server/pilot.js): vprašanja na dan, strošek AI na učenca, obiski strani za starše.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { pilotReport } from "../server/pilot.js";

test("pilot report: questions per day, AI cost per student, parent page visits; admin only", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: false, scheduler: false, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const db = store.db;
    const a = db.prepare("INSERT INTO students (name, settings) VALUES ('Ana', '{}')").run().lastInsertRowid;
    const b = db.prepare("INSERT INTO students (name, settings) VALUES ('Bor', '{}')").run().lastInsertRowid;
    const conv = (s) => db.prepare("INSERT INTO conversations (student_id) VALUES (?)").run(s).lastInsertRowid;
    const ca = conv(a);
    const cb = conv(b);
    const msg = (c, role, ...when) =>
      db
        .prepare("INSERT INTO messages (conversation_id, role, api_content, display_text, created_at) VALUES (?, ?, '\"x\"', 'x', datetime('now', 'start of day', ?, ?))")
        .run(c, role, when[0], when[1] || "+0 seconds");
    // Časi od začetka dneva (UTC), da test ne pade okrog polnoči.
    for (let i = 0; i < 4; i++) msg(ca, "user", "+1 second");
    msg(ca, "assistant", "+1 second"); // odgovori se ne štejejo
    msg(cb, "user", "-1 second"); // včeraj ob 23:59:59
    msg(cb, "user", "-6 days"); // prvi dan obdobja 7 dni (00:00:00)
    msg(cb, "user", "-6 days", "-1 second"); // zunaj obdobja
    const use = (s, usd, when) => db.prepare("INSERT INTO usage (student_id, model, cost_usd, created_at) VALUES (?, 'haiku', ?, datetime('now', 'start of day', ?))").run(s, usd, when);
    use(a, 0.02, "+1 second");
    use(b, 0.04, "-1 day");
    use(null, 0.1, "+1 second"); // npr. povzetek mnenj: v skupnem strošku, ne v strošku na učenca

    // Obiski: navaden brskalnik dvakrat, robot in predogled povezave ne.
    const ua = { "User-Agent": "Mozilla/5.0 (iPhone)" };
    assert.equal((await fetch(`${base}/starsi.html`, { headers: ua })).status, 200);
    await fetch(`${base}/starsi.html?ime=Ana`, { headers: ua });
    await fetch(`${base}/starsi.html`, { headers: { "User-Agent": "facebookexternalhit/1.1" } });
    await fetch(`${base}/starsi.html`, { headers: { ...ua, "Sec-Purpose": "prefetch" } });
    await fetch(`${base}/starsi.html`, { headers: { ...ua, "Sec-Purpose": "prefetch;prerender" } });
    await fetch(`${base}/placaj.html`, { headers: ua });
    await fetch(`${base}/index.html`, { headers: ua });
    assert.equal((await fetch(`${base}/sole`, { headers: ua })).status, 200); // stran za šole (server/sole.js)
    assert.equal((await fetch(`${base}/sole.html?x`, { headers: ua })).status, 200);
    assert.equal((await fetch(`${base}/sole-ni`, { headers: ua })).status, 404);
    await new Promise((r) => setTimeout(r, 20)); // števec piše ob koncu odgovora

    const r = pilotReport(db, { days: 7 });
    assert.equal(r.rows.length, 7);
    assert.equal(r.totals.questions, 6);
    assert.equal(r.totals.askers, 2);
    assert.equal(r.rows.at(-1).questions, 4);
    assert.equal(r.rows.at(-2).questions, 1);
    assert.equal(r.rows[0].questions, 1);
    assert.equal(r.totals.questionsPerAskerDay, 2); // 6 vprašanj / 3 učenec-dnevi
    assert.equal(r.totals.aiUsd, 0.16);
    assert.equal(r.totals.aiUsers, 2);
    // Prva poraba je bila včeraj: ocena na 30 dni iz 2 dni porabe, ne iz vseh 7 dni obdobja.
    assert.ok(Math.abs(r.totals.aiEurPerStudentMonth - ((0.06 * 0.87) / 2) * (30 / 2)) < 0.001);
    assert.deepEqual(r.totals.visits, { starsi: 2, placaj: 1, sole: 2 });

    // Prek API (brez računov samo na računalniku s strežnikom); nesmiselni parametri ne podrejo poročila.
    const api = await (await fetch(`${base}/api/admin/pilot?days=abc&school[]=1`)).json();
    assert.equal(api.days, 30);
    assert.equal(api.totals.questions, 7); // 30 dni: tudi vprašanje pred 7 dnevi
    assert.equal(pilotReport(db, { days: 7, schoolId: 999 }).totals.questions, 0, "šola brez učencev");
    assert.equal(pilotReport(db, { days: 1e9 }).days, 120);
    assert.equal(pilotReport(db, { days: -5 }).days, 1);
    assert.equal((await fetch(`${base}/api/admin/pilot?days=-1&school=x`)).status, 200);
    // Prek povezave za telefon (posredniški strežnik) ne.
    assert.equal((await fetch(`${base}/api/admin/pilot`, { headers: { "X-Forwarded-For": "1.2.3.4" } })).status, 403);
  } finally {
    server.close();
  }
});

test("pilot report with accounts: only an admin parent", async () => {
  const store = openDb(":memory:");
  const fetchFn = async () => ({ ok: true, status: 200, json: async () => ({ id: "x" }) });
  const app = createApp(store, { accounts: true, scheduler: false, stripeKey: "", resendKey: "re_x", fetchFn, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const body = JSON.stringify({ email: "stars@pilot.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" });
    const reg = await fetch(`${base}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    assert.equal(reg.status, 201);
    const cookie = reg.headers
      .getSetCookie()
      .map((c) => c.split(";")[0])
      .join("; ");
    assert.equal((await fetch(`${base}/api/admin/pilot`)).status, 401, "brez prijave");
    // Tudi na računalniku s strežnikom starš brez pravic skrbnika ne vidi poročila.
    assert.equal((await fetch(`${base}/api/admin/pilot`, { headers: { cookie } })).status, 403);
    store.db.prepare("UPDATE parents SET is_admin = 1 WHERE email = ?").run("stars@pilot.si");
    const ok = await fetch(`${base}/api/admin/pilot?days=7`, { headers: { cookie } });
    assert.equal(ok.status, 200);
    assert.equal((await ok.json()).rows.length, 7);
  } finally {
    server.close();
  }
});
