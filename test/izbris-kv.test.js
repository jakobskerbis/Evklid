// Izbris računa: zapisi v kv, vezani na id računa (plačana obdobja za mejo AI, dobroimetje, vračila, okno meje,
// nadgradnja), ne smejo ostati. id računa (INTEGER PRIMARY KEY brez AUTOINCREMENT) dobi naslednji nov račun, ki bi
// sicer podedoval tuje dobroimetje (server/placila/placano.js ai_paid_bal_<id> šteje kot pravi denar za mejo AI) in
// podatke o plačilih izbrisanega računa (GDPR čl. 17).
import test from "node:test";
import assert from "node:assert/strict";
import { withAccounts } from "./racuni-pomoc.js";

const KEYS = (id) => [`ai_paid_${id}`, `ai_paid_bal_${id}`, `ai_paid_refunds_${id}`, `ai_window_${id}`, `ai_upgrade_${id}`];

test("izbris računa počisti kv zapise računa; nov račun z istim id jih ne podeduje", async () => {
  await withAccounts({}, async ({ call, store, kid, calls }) => {
    const db = store.db;
    const pid = db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    const put = db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)");
    put.run(`ai_paid_${pid}`, JSON.stringify([{ sub: "sub_a", inv: "in_a", start: Date.now() - 1e9, end: Date.now() + 1e9, eur: 40, cents: 4999 }]));
    put.run(`ai_paid_bal_${pid}`, JSON.stringify({ credit: 5000, inv: { in_b: { added: 5000, usedReal: 0 } } }));
    put.run(`ai_paid_refunds_${pid}`, JSON.stringify({ in_a: 0.5 }));
    put.run(`ai_window_${pid}`, JSON.stringify({ sub: "sub_a", start: Date.now() }));
    put.run(`ai_upgrade_${pid}`, JSON.stringify({ from: "evklid_1_month", usd: 1.7, at: Date.now(), sub: "sub_a" }));
    put.run("ai_paid_bal_9999", "{}"); // drug račun ostane

    assert.equal((await call("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
    const left = KEYS(pid).filter((k) => db.prepare("SELECT 1 FROM kv WHERE key = ?").get(k));
    assert.deepEqual(left, [], "kv zapisi izbrisanega računa");
    assert.ok(db.prepare("SELECT 1 FROM kv WHERE key = 'ai_paid_bal_9999'").get(), "tuji zapis ostane");

    // Nov račun dobi isti id (zato bi podedoval zapise).
    const r = await call("/api/auth/register", { method: "POST", body: { email: "nov@x.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    assert.equal(r.body.parent.id, pid, "id se ponovno uporabi");
    assert.equal(calls.length > 0, true);
  });
});

test("izbris gosta in čiščenje neaktivnih računov prav tako počistita kv (sprožilec na parents)", async () => {
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
