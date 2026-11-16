// Pregled A3 PR #462 (krog 3): luknje, ki so padle na 57f6dcc6; zdaj morajo uspeti.
import test from "node:test";
import assert from "node:assert/strict";
import { withAccounts, META } from "./racuni-pomoc.js";
import { createPaidPeriods } from "../server/placila/placano.js";
import { parseFx } from "../server/tecaji.js";
import { EUR_PER_UNIT } from "../server/accounts/plans.js";

const iso = (ms) => new Date(ms).toISOString();
const sql = (ms) => iso(ms).slice(0, 19).replace("T", " ");
const DAY = 86400000;
const streamFn = async ({ onText }) => { onText("ok"); return { text: "ok" + META, stopReason: "end_turn", model: "claude-haiku-5-5", usage: { input_tokens: 10, output_tokens: 5 } }; };
const ask = async (call, kid) => {
  const conv = (await call(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
  return call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "Koliko je 2 + 3?" } });
};
const spend = (store, kid, usd, atMs) => store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, created_at, parent_id) VALUES (?, 'claude-haiku-5-5', 'chat', ?, ?, (SELECT parent_id FROM students WHERE id = ?))").run(kid.id, usd, sql(atMs), kid.id);
const kvOf = (db) => ({ get: (k) => db.prepare("SELECT value FROM kv WHERE key = ?").get(k)?.value ?? null, set: (k, v) => db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(k, v) });
const addMonths = (t, k) => { const d = new Date(t); d.setUTCMonth(d.getUTCMonth() + k); return d.getTime(); };

test("A3-1: kupon 100 % za vedno – uro po obnovitvi (račun še ni plačan) velja polna meja cenika", async () => {
  await withAccounts({}, async ({ call, store, kid }) => {
    const now = Date.now();
    const renewed = now - 3600_000;
    const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    store.db.prepare("UPDATE parents SET sub_status='active', sub_id='sub_g', sub_provider='stripe', sub_plan='evklid_faks_month', sub_seats=1, sub_period_end=?, country='SI' WHERE id=?").run(iso(addMonths(renewed, 1)), pid);
    const pp = createPaidPeriods(kvOf(store.db));
    const prevStart = addMonths(renewed, -1);
    pp.record(pid, { id: "in_prev", subscription: "sub_g", currency: "eur", lines: { data: [{ amount: 1999, discount_amounts: [{ amount: 1999 }], period: { start: prevStart / 1000, end: renewed / 1000 } }] } }, { country: "SI" });
    spend(store, kid, 3.0, now - 60_000);
    const r = await ask(call, kid);
    assert.equal(r.status, 429, "plačano 0 €, poraba 3 $ v novem oknu, inštruktor še odgovarja");
  }, { streamFn });
});

test("A3-2: brezplačni mesec za priporočilo (dobroimetje) šteje kot plačilo", async () => {
  await withAccounts({}, async ({ call, store, kid }) => {
    const now = Date.now();
    const start = now - 2 * DAY;
    const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    store.db.prepare("UPDATE parents SET sub_status='active', sub_id='sub_r', sub_provider='stripe', sub_plan='evklid_faks_month', sub_seats=1, sub_period_end=?, country='SI' WHERE id=?").run(iso(addMonths(start, 1)), pid);
    const pp = createPaidPeriods(kvOf(store.db));
    // Račun plačan iz dobroimetja (dobropis -19,99 € iz giveFreeMonth): amount_paid 0, vrstica polna.
    pp.record(pid, { id: "in_r", subscription: "sub_r", currency: "eur", amount_paid: 0, starting_balance: -1999, ending_balance: 0, lines: { data: [{ amount: 1999, period: { start: start / 1000, end: addMonths(start, 1) / 1000 } }] } }, { country: "SI" });
    spend(store, kid, 1.5, now - 60_000);
    const r = await ask(call, kid);
    assert.equal(r.status, 429, "denarja 0 €, a meja polna");
  }, { streamFn });
});

test("A3-3: ponovljen invoice.paid po vračilu ponastavi vračilo", () => {
  const m = new Map();
  const pp = createPaidPeriods({ get: (k) => m.get(k) ?? null, set: (k, v) => m.set(k, v) });
  const t0 = Date.UTC(2026, 10, 1), t1 = t0 + 30 * DAY;
  const inv = { id: "in_x", subscription: "s", currency: "eur", lines: { data: [{ amount: 999, period: { start: t0 / 1000, end: t1 / 1000 } }] } };
  pp.record(1, inv, { country: "SI" });
  pp.refund(1, "in_x", 1);
  pp.record(1, inv, { country: "SI" });
  assert.equal(pp.eurIn(1, "s", t0, t1).eur, 0, "vračilo izgubljeno");
});

test("A3-4: tečaj – zastarel vir (date pred letom) velja kot svež; zastrupljen do 1,5×", () => {
  const r = parseFx({ date: "2025-01-01", eur: { inr: 1 / (EUR_PER_UNIT.INR * 1.49) } });
  assert.ok(!r.INR, "star podatek ali 1,49× stalnega tečaja sprejet");
});

test("A3-1 kontrola: z vrstico 0 € za tekoče okno → 429", async () => {
  await withAccounts({}, async ({ call, store, kid }) => {
    const now = Date.now();
    const renewed = now - 3600_000;
    const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    store.db.prepare("UPDATE parents SET sub_status='active', sub_id='sub_g', sub_provider='stripe', sub_plan='evklid_faks_month', sub_seats=1, sub_period_end=?, country='SI' WHERE id=?").run(iso(addMonths(renewed, 1)), pid);
    const pp = createPaidPeriods(kvOf(store.db));
    pp.record(pid, { id: "in_cur", subscription: "sub_g", currency: "eur", lines: { data: [{ amount: 1999, discount_amounts: [{ amount: 1999 }], period: { start: renewed / 1000, end: addMonths(renewed, 1) / 1000 } }] } }, { country: "SI" });
    spend(store, kid, 3.0, now - 60_000);
    assert.equal((await ask(call, kid)).status, 429);
  }, { streamFn });
});
