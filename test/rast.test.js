// Rast in vračanje (server/rast.js): vir iz povezave, prva naloga v 24 urah, vrnitev naslednji dan in po 7 dneh.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { growthReport, cleanSource, sourceFromQuery } from "../server/rast.js";

test("source tags: cleaned to a short slug; referral and class code tag themselves", () => {
  assert.equal(cleanSource("Facebook Učitelji!"), "facebook-ucitelji");
  assert.equal(cleanSource("  "), null);
  assert.equal(cleanSource({ x: 1 }), null);
  assert.equal(cleanSource("a".repeat(50)).length, 32);
  assert.equal(sourceFromQuery({ utm_source: "Instagram", vir: "x" }), "instagram");
  assert.equal(sourceFromQuery({ ref: "ABC123" }), "priporocilo");
  assert.equal(sourceFromQuery({ koda: "K7X2" }), "razred");
  assert.equal(sourceFromQuery({ vir: ["tiktok", "x"] }), "tiktok");
  assert.equal(sourceFromQuery({}), null);
});

test("growth report: activation, next-day and 7-day return, weekly active, sources; admin only", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: false, scheduler: false, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const db = store.db;
    const DAY = 86400000;
    const now = Date.now();
    const midnight = Date.parse(new Date(now).toISOString().slice(0, 10)); // danes 00:00 UTC
    const at = (daysAgo, h = 10) => new Date(midnight - daysAgo * DAY + h * 3600000).toISOString().replace("T", " ").slice(0, 19);
    const student = (name, vir, daysAgo) => db.prepare("INSERT INTO students (name, settings, vir, created_at) VALUES (?, '{}', ?, ?)").run(name, vir, at(daysAgo, 8)).lastInsertRowid;
    const act = (s, daysAgo) => db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 5, 'test', ?)").run(s, at(daysAgo));
    const task = (s, daysAgo, solved = 1, h = 10) => db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, solved, attempts, created_at) VALUES (?, 'T', 1, '{}', ?, 1, ?)").run(s, solved, at(daysAgo, h));

    // Ana: prišla s Facebooka pred 10 dnevi, takoj rešila nalogo, se vrnila naslednji dan in 8. dan.
    const ana = student("Ana", "facebook", 10);
    task(ana, 10);
    act(ana, 10);
    act(ana, 9);
    act(ana, 2);
    // Bor: priporočilo pred 9 dnevi, nalogo rešil šele drugi dan (po 24 urah), potem nič.
    const bor = student("Bor", "priporocilo", 9);
    task(bor, 7, 1, 12);
    act(bor, 7);
    // Cene: brez oznake pred 8 dnevi, nerešena naloga, vrnila se 14. dan (zunaj okna 7.–13.): ne šteje.
    const cene = student("Cene", null, 8);
    task(cene, 8, 0);
    // Dan: danes (še ni zrel za vrnitev), rešil nalogo in vprašal inštruktorja.
    const dan = student("Dan", "facebook", 0);
    task(dan, 0);
    const conv = db.prepare("INSERT INTO conversations (student_id, created_at) VALUES (?, ?)").run(dan, at(0)).lastInsertRowid;
    db.prepare("INSERT INTO messages (conversation_id, role, api_content, display_text, created_at) VALUES (?, 'user', '\"x\"', 'x', ?)").run(conv, at(0));
    // Stari učenec (pred 40 dnevi): ni v kohorti, a je aktiven ta teden.
    const old = student("Old", "x", 40);
    act(old, 1);

    const r = growthReport(db, { days: 30, now });
    assert.equal(r.newProfiles, 4);
    assert.deepEqual(r.activation, { eligible: 4, returned: 2, pct: 0.5 }); // Ana in Dan
    assert.deepEqual(r.d1, { eligible: 3, returned: 1, pct: 0.333 }); // Dan danes še ni zrel
    assert.deepEqual(r.d7, { eligible: 3, returned: 1, pct: 0.333 }); // Ana (8. dan)
    assert.equal(r.goal.status, "wait"); // manj kot 5 profilov, starejših od 7 dni
    assert.equal(r.weeklyActive, 3); // Ana (pred 2 dnevoma), Old, Dan
    assert.equal(r.weeks.length, 5);
    assert.equal(r.weeks.at(-1).end, new Date(now).toISOString().slice(0, 10));
    const fb = r.sources.find((s) => s.vir === "facebook");
    assert.deepEqual(fb, { vir: "facebook", visits: 0, profiles: 2, firstTask: 2, d7Eligible: 1, d7Returned: 1 });
    assert.equal(r.sources.find((s) => s.vir === "").profiles, 1);

    // Ogledi s povezav z oznako; roboti, predogledi in strani brez oznake ne.
    const ua = { "User-Agent": "Mozilla/5.0 (iPhone)" };
    await fetch(`${base}/?utm_source=Facebook`, { headers: ua });
    await fetch(`${base}/starsi.html?vir=facebook`, { headers: ua });
    await fetch(`${base}/?vir=facebook`, { headers: { "User-Agent": "facebookexternalhit/1.1" } });
    await fetch(`${base}/?vir=facebook`, { headers: { ...ua, "Sec-Purpose": "prefetch" } });
    await fetch(`${base}/?ref=AB12CD`, { headers: ua });
    await fetch(`${base}/`, { headers: ua });
    await new Promise((res) => setTimeout(res, 20)); // števec piše ob koncu odgovora
    const r2 = growthReport(db, { days: 7, now });
    assert.equal(r2.sources.find((s) => s.vir === "facebook").visits, 2);
    assert.equal(r2.sources.find((s) => s.vir === "priporocilo").visits, 1);
    assert.equal(r2.newProfiles, 1);

    // Nov profil prek API zapiše vir (prvi vir velja); neveljavna oznaka se zavrže.
    const made = await (await fetch(`${base}/api/students`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Eva", vir: "TikTok Šola" }) })).json();
    assert.equal(db.prepare("SELECT vir FROM students WHERE id = ?").get(made.id).vir, "tiktok-sola");
    const none = await (await fetch(`${base}/api/students`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Fran", vir: { x: 1 } }) })).json();
    assert.equal(db.prepare("SELECT vir FROM students WHERE id = ?").get(none.id).vir, null);

    // Brez računov: samo računalnik s strežnikom (skrbnik); napačni parametri ne zrušijo poročila.
    const res = await fetch(`${base}/api/admin/rast?days=7&school=abc`);
    assert.equal(res.status, 200);
    assert.equal((await res.json()).days, 7);
    const remote = await fetch(`${base}/api/admin/rast`, { headers: { "X-Forwarded-For": "203.0.113.5" } });
    assert.ok([200, 403].includes(remote.status));
  } finally {
    server.close();
  }
});

test("growth report: admin profiles are not counted; goal met at 40 % with enough profiles", () => {
  const store = openDb(":memory:");
  createApp(store, { accounts: true, scheduler: false, log: { error() {} } });
  const db = store.db;
  const now = Date.now();
  const ts = (daysAgo) => new Date(now - daysAgo * 86400000).toISOString().replace("T", " ").slice(0, 19);
  const parent = (email, admin) => db.prepare("INSERT INTO parents (email, password_hash, is_admin, privacy_version, unsubscribe_token, referral_code) VALUES (?, 'x', ?, '1', ?, ?)").run(email, admin, `u-${email}`, `r-${email}`).lastInsertRowid;
  const boss = parent("boss@example.com", 0);
  const fam = parent("fam@example.com", 0);
  const kid = (p, d) => db.prepare("INSERT INTO students (name, settings, parent_id, created_at) VALUES ('k', '{}', ?, ?)").run(p, ts(d)).lastInsertRowid;
  kid(boss, 9);
  const kids = [kid(fam, 9), kid(fam, 9), kid(fam, 9), kid(fam, 9), kid(fam, 9)];
  for (const k of kids.slice(0, 2)) db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 1, 't', ?)").run(k, ts(1));
  const r = growthReport(db, { days: 30, now, adminEmails: ["BOSS@example.com"] });
  assert.equal(r.newProfiles, 5);
  assert.deepEqual(r.d7, { eligible: 5, returned: 2, pct: 0.4 });
  assert.equal(r.goal.status, "met");
});
