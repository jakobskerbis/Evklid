// Točka B1 (pilot): skrbniška stran pokaže aktivne profile v obdobju in uporabo po viru (?vir=): aktivni, vrnitev
// naslednji dan, vprašanja na učenca na dan in strošek AI na učenca. Profili skrbnika se ne štejejo.
// Zagon: node --test test/pilot-po-viru.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { growthReport } from "../server/rast.js";
import { EUR_PER_USD } from "../server/usage.js";
import { migrateAccounts } from "../server/accounts/schema.js";

test("B1 uporaba po viru: aktivni, naslednji dan, vprašanja na dan, AI na učenca", () => {
  const { db } = openDb(":memory:");
  const DAY = 86400000;
  const now = Date.now();
  const midnight = Date.parse(new Date(now).toISOString().slice(0, 10));
  const at = (daysAgo, h = 10) => new Date(midnight - daysAgo * DAY + h * 3600000).toISOString().replace("T", " ").slice(0, 19);
  const student = (name, vir, daysAgo) => db.prepare("INSERT INTO students (name, settings, vir, created_at) VALUES (?, '{}', ?, ?)").run(name, vir, at(daysAgo, 8)).lastInsertRowid;
  const ask = (s, daysAgo, n = 1) => {
    const c = db.prepare("INSERT INTO conversations (student_id, created_at, updated_at) VALUES (?, ?, ?)").run(s, at(daysAgo), at(daysAgo)).lastInsertRowid;
    for (let i = 0; i < n; i++) db.prepare("INSERT INTO messages (conversation_id, role, api_content, display_text, created_at) VALUES (?, 'user', '\"x\"', 'x', ?)").run(c, at(daysAgo));
  };
  const cost = (s, daysAgo, usd) => db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, created_at) VALUES (?, 'claude-haiku-5-5', 'chat', ?, ?)").run(s, usd, at(daysAgo));

  // Maturant z Instagrama: 3 vprašanja prvi dan, 1 naslednji dan (vrnil se je), 0,40 $ AI.
  const ana = student("Ana", "instagram", 5);
  ask(ana, 5, 3);
  ask(ana, 4, 1);
  cost(ana, 5, 0.4);
  // Drugi z Instagrama: 2 vprašanji prvi dan, nato nič, 0,20 $ AI.
  const bor = student("Bor", "instagram", 3);
  ask(bor, 3, 2);
  cost(bor, 3, 0.2);
  // Star profil brez oznake (pred 60 dnevi), aktiven včeraj: šteje med aktivne, ne v novih.
  const old = student("Old", null, 60);
  ask(old, 1, 1);
  // Neaktiven star profil: ni aktiven.
  student("Spi", "instagram", 50);

  const r = growthReport(db, { days: 30, now });
  assert.equal(r.activeProfiles, 3);
  const ig = r.usageBySource.find((u) => u.vir === "instagram");
  assert.equal(ig.active, 2);
  assert.deepEqual([ig.d1Eligible, ig.d1Returned, ig.d1Pct], [2, 1, 0.5]);
  assert.equal(ig.questions, 6);
  assert.equal(ig.askerDays, 3);
  assert.equal(ig.questionsPerAskerDay, 2);
  assert.equal(ig.aiUsers, 2);
  assert.equal(ig.aiEurPerUser, Math.round(((0.6 * EUR_PER_USD()) / 2) * 1000) / 1000);
  const brez = r.usageBySource.find((u) => u.vir === "");
  assert.equal(brez.active, 1);
  assert.equal(brez.d1Eligible, 0, "star profil ni v kohorti");
  assert.equal(brez.aiUsers, 0);
});

test("B1 uporaba po viru: profili skrbnika se ne štejejo", () => {
  const { db } = openDb(":memory:");
  migrateAccounts(db);
  const pid = db
    .prepare("INSERT INTO parents (email, password_hash, is_admin, privacy_version, unsubscribe_token, referral_code) VALUES ('j@x.si', 'x', 1, 'v', 'u', 'r')")
    .run().lastInsertRowid;
  const s = db.prepare("INSERT INTO students (name, settings, vir, parent_id, created_at) VALUES ('J', '{}', 'test', ?, datetime('now', '-1 day'))").run(pid).lastInsertRowid;
  const c = db.prepare("INSERT INTO conversations (student_id) VALUES (?)").run(s).lastInsertRowid;
  db.prepare("INSERT INTO messages (conversation_id, role, api_content, display_text) VALUES (?, 'user', '\"x\"', 'x')").run(c);
  db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku-5-5', 'chat', 1)").run(s);
  const r = growthReport(db, { days: 30 });
  assert.equal(r.activeProfiles, 0);
  assert.deepEqual(r.usageBySource, []);
});
