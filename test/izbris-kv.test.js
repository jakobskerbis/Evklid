// Izbris računa: zapisi v kv, vezani na id računa (plačana obdobja za mejo AI, dobroimetje, vračila, okno meje,
// nadgradnja), ne smejo ostati. id računa (INTEGER PRIMARY KEY brez AUTOINCREMENT) dobi naslednji nov račun, ki bi
// sicer podedoval tuje dobroimetje (server/placila/placano.js ai_paid_bal_<id> šteje kot pravi denar za mejo AI) in
// podatke o plačilih izbrisanega računa (GDPR čl. 17).
import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { withAccounts } from "./racuni-pomoc.js";
import { migrateAccounts } from "../server/accounts/schema.js";

const KEYS = (id) => [`ai_paid_${id}`, `ai_paid_bal_${id}`, `ai_paid_refunds_${id}`, `ai_window_${id}`, `ai_upgrade_${id}`, `school_sub_end:${id}`];

test("izbris računa počisti kv zapise računa; nov račun z istim id jih ne podeduje", async () => {
  await withAccounts({}, async ({ call, store, kid }) => {
    const db = store.db;
    const pid = db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    const put = db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)");
    put.run(`ai_paid_${pid}`, JSON.stringify([{ sub: "sub_a", inv: "in_a", start: Date.now() - 1e9, end: Date.now() + 1e9, eur: 40, cents: 4999 }]));
    put.run(`ai_paid_bal_${pid}`, JSON.stringify({ credit: 5000, inv: { in_b: { added: 5000, usedReal: 0 } } }));
    put.run(`ai_paid_refunds_${pid}`, JSON.stringify({ in_a: 0.5 }));
    put.run(`ai_window_${pid}`, JSON.stringify({ sub: "sub_a", start: Date.now() }));
    put.run(`ai_upgrade_${pid}`, JSON.stringify({ from: "evklid_1_month", usd: 1.7, at: Date.now(), sub: "sub_a" }));
    put.run(`school_sub_end:${pid}`, "sub_a");
    put.run("ai_paid_bal_9999", "{}"); // drug račun ostane

    assert.equal((await call("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
    const left = KEYS(pid).filter((k) => db.prepare("SELECT 1 FROM kv WHERE key = ?").get(k));
    assert.deepEqual(left, [], "kv zapisi izbrisanega računa");
    assert.ok(db.prepare("SELECT 1 FROM kv WHERE key = 'ai_paid_bal_9999'").get(), "tuji zapis ostane");

    // Nov račun dobi isti id (zato bi podedoval zapise).
    const r = await call("/api/auth/register", { method: "POST", body: { email: "nov@x.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    assert.equal(r.body.parent.id, pid, "id se ponovno uporabi");
    assert.deepEqual(KEYS(pid).filter((k) => db.prepare("SELECT 1 FROM kv WHERE key = ?").get(k)), [], "nov račun začne brez zapisov");
  });
});

// Gost (accounts/guest.js), prevzem gosta in čiščenje nepotrjenih (zasebnost.js) brišejo z istim golim DELETE FROM parents.
test("sprožilec na parents: tudi golo DELETE FROM parents (gost, čiščenje nepotrjenih) počisti kv", async () => {
  await withAccounts({}, async ({ store, kid }) => {
    const db = store.db;
    const id = db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, '{}')").run(`ai_paid_bal_${id}`);
    db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, '{}')").run(`ai_paid_bal_${id}0`); // drug id (npr. 20 ≠ 2)
    db.prepare("DELETE FROM parents WHERE id = ?").run(id);
    assert.equal(db.prepare("SELECT 1 FROM kv WHERE key = ?").get(`ai_paid_bal_${id}`), undefined);
    assert.ok(db.prepare("SELECT 1 FROM kv WHERE key = ?").get(`ai_paid_bal_${id}0`), "podoben ključ drugega računa ostane");
  });
});

// Baza brez nove migracije, kot v produkciji: sirote že izbrisanih računov in star sprožilec brez school_sub_end.
function oldDb() {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys=ON; CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT); CREATE TABLE usage (id INTEGER PRIMARY KEY, parent_id INTEGER);");
  migrateAccounts(db);
  db.exec(`DROP TRIGGER kv_parent_delete; CREATE TRIGGER kv_parent_delete AFTER DELETE ON parents BEGIN
    DELETE FROM kv WHERE key IN ('ai_paid_' || OLD.id); END;`);
  db.exec("DELETE FROM kv WHERE key = 'kv_parent_orphans_cleaned'");
  return db;
}
const addParent = (db) =>
  Number(db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code) VALUES (?, 'h', '1', ?, ?)").run(`${Math.random()}@x.si`, `${Math.random()}`, `${Math.random()}`).lastInsertRowid);

test("migracija enkrat počisti zapise računov, izbrisanih pred sprožilcem; nov račun z istim id jih ne podeduje", () => {
  const db = oldDb();
  const live = addParent(db);
  const gone = addParent(db);
  const put = db.prepare("INSERT INTO kv (key, value) VALUES (?, ?)");
  for (const k of KEYS(gone)) put.run(k, '{"credit":5000}');
  for (const k of KEYS(live)) put.run(k, "{}");
  put.run("ai_school_ledger_start", "x"); // ključ brez id računa ostane
  put.run(`ai_paid_${gone}:pool`, "x"); // ključ z repom za id ni ključ računa (GLOB 'ai_paid_[0-9]*' bi ga zajel)
  put.run("ai_paid_", "x"); // sama predpona brez id
  db.prepare("DELETE FROM parents WHERE id = ?").run(gone); // star sprožilec pobriše samo ai_paid_
  migrateAccounts(db);
  const has = (k) => !!db.prepare("SELECT 1 FROM kv WHERE key = ?").get(k);
  assert.deepEqual(KEYS(gone).filter(has), [], "sirote izbrisanega računa");
  assert.deepEqual(KEYS(live).filter((k) => !has(k)), [], "zapisi živega računa ostanejo");
  assert.ok(has("ai_school_ledger_start"));
  assert.ok(has(`ai_paid_${gone}:pool`), "ključ z repom ostane");
  assert.ok(has("ai_paid_"), "sama predpona ostane");
  assert.equal(addParent(db), gone, "nov račun dobi isti id");
  assert.deepEqual(KEYS(gone).filter(has), []);
  // Drugi zagon ne briše več (enkratno) – zapis brez računa, ki bi ga dodal kdo drug, ostane.
  put.run("ai_paid_bal_777", "{}");
  migrateAccounts(db);
  assert.ok(has("ai_paid_bal_777"));
});

test("migracija zamenja star sprožilec (nov ključ school_sub_end velja tudi v obstoječi bazi)", () => {
  const db = oldDb();
  const id = addParent(db);
  migrateAccounts(db);
  db.prepare("INSERT INTO kv (key, value) VALUES (?, 'sub_x')").run(`school_sub_end:${id}`);
  db.prepare("DELETE FROM parents WHERE id = ?").run(id);
  assert.equal(db.prepare("SELECT 1 FROM kv WHERE key = ?").get(`school_sub_end:${id}`), undefined);
});
