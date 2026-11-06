// Pregled krog 3 (B) PR #462 (head 57f6dcc6): poskusi zlorabe trde meje AI. Vsak test PADE na 57f6dcc6 = luknja potrjena.
import test from "node:test";
import assert from "node:assert/strict";
import { withAccounts, META } from "./racuni-pomoc.js";
import { createApp } from "../server/app.js";
import { signWebhook } from "../server/accounts/stripe.js";
import { createPaidPeriods } from "../server/placila/placano.js";
import { Credits } from "../server/placila/krediti.js";
import * as P from "../server/accounts/plans.js";
import { refreshFx } from "../server/tecaji.js";

const DAY = 86400000;
const SECRET = "whsec_b3";
const iso = (ms) => new Date(ms).toISOString();
const sql = (ms) => iso(ms).slice(0, 19).replace("T", " ");
const streamFn = async ({ onText }) => {
  onText("ok");
  return { text: "ok" + META, stopReason: "end_turn", model: "claude-haiku-5-5", usage: { input_tokens: 10, output_tokens: 5 } };
};
const ask = async (call, kid) => {
  const conv = (await call(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
  return call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "Koliko je 2 + 3?" } });
};
const spend = (store, kid, usd, atMs) =>
  store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, created_at, parent_id) VALUES (?, 'claude-haiku-5-5', 'chat', ?, ?, (SELECT parent_id FROM students WHERE id = ?))").run(kid.id, usd, sql(atMs), kid.id);
const kvOf = (db) => ({
  get: (k) => db.prepare("SELECT value FROM kv WHERE key = ?").get(k)?.value ?? null,
  set: (k, v) => db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(k, v),
});
const memKv = () => {
  const m = new Map();
  return { get: (k) => m.get(k) ?? null, set: (k, v) => m.set(k, v) };
};
const line = (amount, startMs, endMs) => ({ amount, period: { start: Math.floor(startMs / 1000), end: Math.floor(endMs / 1000) } });
const monthBefore = (ms) => {
  const d = new Date(ms);
  d.setUTCMonth(d.getUTCMonth() - 1);
  return d.getTime();
};
const monthAfter = (ms) => {
  const d = new Date(ms);
  d.setUTCMonth(d.getUTCMonth() + 1);
  return d.getTime();
};

// H1: obnovitev je pri Stripu v osnutku ~1 h (invoice.created → finalizacija → plačilo), sub_period_end pa se premakne
// takoj (customer.subscription.updated). V tem času novo okno nima zapisa plačila → velja cenik (polna meja), čeprav
// obnovitev še ni plačana (lahko nikoli: kartica brez kritja → past_due šele ob poskusu plačila).
test("H1: obnovitev pred invoice.paid odpre polno mejo novega okna brez plačila", async () => {
  await withAccounts({}, async ({ call, store, kid }) => {
    const now = Date.now();
    const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    const renewedAt = now - 3600_000; // obnovitev pred 1 h, račun še v osnutku
    const oldStart = monthBefore(renewedAt);
    store.db.prepare("UPDATE parents SET sub_status='active', sub_id='sub_h1', sub_provider='stripe', sub_plan='evklid_1_month', sub_seats=1, sub_period_end=? WHERE id=?").run(iso(monthAfter(renewedAt)), pid);
    createPaidPeriods(kvOf(store.db)).record(pid, { id: "in_old", subscription: "sub_h1", currency: "eur", lines: { data: [line(999, oldStart, renewedAt)] } }, { country: "SI" });
    spend(store, kid, 2.0, renewedAt - 2 * DAY); // meja OŠ (1,9 $) v plačanem oknu porabljena
    const r = await ask(call, kid);
    assert.equal(r.status, 429, "nova (še neplačana) obdobje že daje polno mejo cenika");
  }, { streamFn });
});

// H1b: isto ob koncu preizkusa Stripe (trialing → active, prvi račun še v osnutku): profil, ki ni nikoli plačal (račun
// preizkusa 0 €), dobi za to uro polno mejo cenika (Faks 4,45 $); če plačilo nato pade, past_due vrne okno preizkusa.
test("H1b: konec preizkusa pred prvim plačilom: polna meja cenika brez plačila", async () => {
  await withAccounts({}, async ({ call, store, kid }) => {
    const now = Date.now();
    const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    const trialEnd = now - 3600_000;
    store.db.prepare("UPDATE parents SET sub_status='active', sub_id='sub_h1b', sub_provider='stripe', sub_plan='evklid_1_month', sub_seats=1, sub_period_end=? WHERE id=?").run(iso(monthAfter(trialEnd)), pid);
    // Račun preizkusa (0 €) je bil plačan (invoice.paid ob začetku preizkusa).
    createPaidPeriods(kvOf(store.db)).record(pid, { id: "in_trial", subscription: "sub_h1b", currency: "eur", lines: { data: [line(0, trialEnd - 7 * DAY, trialEnd)] } }, { country: "SI" });
    spend(store, kid, 1.0, now - 1800_000); // nad mejo brez plačila (0,5 $)
    const r = await ask(call, kid);
    assert.equal(r.status, 429, "po koncu preizkusa, pred prvim plačilom, velja polna meja cenika");
  }, { streamFn });
});

// H2: nagrada za priporočilo (giveFreeMonth) je dobropis na stanju stranke (balance_transactions). Naslednji račun
// ima vrstico 9,99 €, plača ga dobropis (amount_paid 0) → zapis šteje 9,99 € kot plačilo → polna meja za mesec brez
// denarja (kupon 100 % pa dobi le mejo aktivacijske kode 0,5 $).
test("H2: brezplačni mesec iz priporočila (dobropis) šteje kot plačan mesec", async () => {
  await withAccounts({}, async ({ store, kid, app, call }) => {
    const now = Date.now();
    const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    const end = now + 20 * DAY;
    const start = monthBefore(end);
    store.db.prepare("UPDATE parents SET sub_status='active', sub_id='sub_h2', sub_provider='stripe', sub_plan='evklid_1_month', sub_seats=1, sub_period_end=?, stripe_customer_id='cus_h2' WHERE id=?").run(iso(end), pid);
    const server = app.listen(0);
    try {
      const inv = { id: "in_free", object: "invoice", customer: "cus_h2", subscription: "sub_h2", currency: "eur", billing_reason: "subscription_cycle", total: 999, amount_due: 0, amount_paid: 0, starting_balance: -999, ending_balance: 0, lines: { data: [line(999, start, end)] } };
      const raw = JSON.stringify({ id: "evt_h2", type: "invoice.paid", data: { object: inv } });
      const res = await fetch(`http://127.0.0.1:${server.address().port}/api/stripe/webhook`, { method: "POST", headers: { "Content-Type": "application/json", "stripe-signature": signWebhook(raw, SECRET) }, body: raw });
      assert.equal(res.status, 200);
    } finally {
      server.close();
    }
    spend(store, kid, 1.0, now - DAY); // nad mejo okna brez plačila (0,5 $), pod cenikom OŠ (1,9 $)
    const r = await ask(call, kid);
    assert.equal(r.status, 429, "mesec, plačan z dobropisom priporočila, ima polno mejo plačanega meseca");
  }, { streamFn, webhookSecret: SECRET, stripeKey: "sk_test_x" });
});

// H3: charge.refunded pred invoice.paid (ponovitev webhooka po napaki 500 ali po izpadu strežnika) ali ponovljen
// invoice.paid po vračilu: record() vrstice tega računa zamenja z refunded: 0 → vračilo izgine, meja spet polna.
test("H3: vračilo se izgubi, če invoice.paid pride (ali se ponovi) za charge.refunded", () => {
  const t0 = Date.UTC(2026, 10, 1);
  const inv = { id: "in_r", subscription: "sub_r", currency: "eur", lines: { data: [line(999, t0, t0 + 30 * DAY)] } };
  const a = createPaidPeriods(memKv());
  a.record(1, inv, { country: "SI" });
  a.refund(1, "in_r", 1);
  a.record(1, inv, { country: "SI" }); // ponovitev (prvi poskus je vrnil 500 po zapisu)
  assert.equal(a.eurIn(1, "sub_r", t0, t0 + 30 * DAY).eur, 0, "ponovljen invoice.paid izbriše vračilo");
  const b = createPaidPeriods(memKv());
  b.refund(1, "in_r", 1); // vračilo pride prvo: ni vrstice, vračilo se zavrže
  b.record(1, inv, { country: "SI" });
  assert.equal(b.eurIn(1, "sub_r", t0, t0 + 30 * DAY).eur, 0, "vračilo pred invoice.paid se zavrže");
});

// H4: recoverHolds zapiše rezervo kot vrstico usage mimo usage.log → kredit (ai_credit_use) se ne zmanjša.
// Brezplačni profil s kreditom ima samo mejo credit:<račun> (usd = stanje kredita, spent 0): klic v teku ob
// ponovnem zagonu (deploy) je plačan pri Anthropicu, kredit ostane cel.
test("H4: rezervacija ob ponovnem zagonu ne zmanjša kredita (klic zastonj)", async () => {
  let release;
  const gate = new Promise((r) => (release = r));
  let started;
  const begun = new Promise((r) => (started = r));
  const slow = async ({ onText }) => {
    started();
    await gate;
    onText("ok");
    return { text: "ok" + META, stopReason: "end_turn", model: "claude-haiku-5-5", usage: { input_tokens: 20000, output_tokens: 2000 } };
  };
  await withAccounts({}, async ({ call, store, kid }) => {
    const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    const credits = new Credits(store.db);
    const id = credits.create(pid, { id: "k10", amount: 1000, currency: "EUR" });
    credits.activate(id, "pi_k");
    spend(store, kid, 0.25, Date.now() - 3600_000); // brezplačni del meseca (0,2 $) porabljen: dalje plača kredit
    const before = credits.balance(pid);
    const pending = ask(call, kid);
    await begun;
    const held = store.db.prepare("SELECT COALESCE(SUM(usd),0) s FROM ai_holds").get().s;
    assert.ok(held > 0, "rezervacija v bazi");
    // Ponovni zagon: nov proces na isti bazi (server/app.js pokliče recoverHolds).
    createApp(store, { accounts: true, scheduler: false, resendKey: "re_x", log: { error() {} } });
    const after = credits.balance(pid);
    release();
    await pending;
    assert.ok(credits.balance(pid) < after, "kontrola: običajen zapis klica gre iz kredita");
    assert.ok(before - after >= held - 1e-6, `kredit pred ${before}, po ${after}, rezerva ${held}: strošek klica ni šel iz kredita`);
  }, { streamFn: slow });
});

// H5: tečaj iz vira se šteje za svežega po času prenosa (at = now), ne po datumu podatkov (json.date). Zastarel ali
// zamrznjen odgovor CDN (@latest, predpomnilnik) z višjim tečajem (do +50 %) velja kot svež, z rezervo le 10 %.
test("H5: zastarel odgovor vira tečajev (date pred 2 letoma) velja kot svež", async () => {
  const fixed = P.EUR_PER_UNIT.INR;
  const db = { prepare: () => ({ run() {}, get() {} }) };
  await refreshFx(db, { fetchFn: async () => ({ ok: true, json: async () => ({ date: "2024-11-01", eur: { inr: 1 / (fixed * 1.45) } }) }), log: { warn() {} } });
  try {
    assert.ok(P.eurPerUnitNow("INR") <= fixed * (1 - P.FX_FIXED_RESERVE) + 1e-12, `zastarel tečaj ${P.eurPerUnitNow("INR")} > stalni z rezervo ${fixed * 0.8}`);
  } finally {
    P.setFxRates({}, 0);
  }
});

// H7: poraba šole (sola-vir.js spentUsd) sešteje porabo TRENUTNIH učencev z mestom; ko učenec zapusti razred (ali kupi
// osebni paket), njegova poraba ta mesec izpade iz meje šole → meja se sprosti za druge (po predpomnilniku 60 s ali
// prvem zapisu porabe), strošek AI šole preseže 25 % plačila licence. Ponovljivo z menjavo učencev.
for (const leaves of [false, true]) {
  test(`H7${leaves ? "" : " (kontrola)"}: ${leaves ? "sošolec zapusti razred → njegova poraba ne šteje več v mejo šole" : "sošolec ostane → meja šole porabljena"}`, async () => {
    await withAccounts({}, async ({ call, store, kid, members }) => {
      // Sošolec z drugim (brezplačnim) računom staršev.
      const other = store.createStudent("Odhod");
      const op = store.db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code) VALUES ('o@x.si', 'x', 1, 'tok_o', 'ref_o')").run().lastInsertRowid;
      store.db.prepare("UPDATE students SET parent_id = ? WHERE id = ?").run(op, other.id);
      members.push(kid.id, other.id);
      // Licenca pomočnika: 5 $ na mesec za šolo. Sošolec porabi 4,99 $, ta učenec 0,3 $ (nad brezplačno mejo 0,2 $).
      spend(store, other, 4.99, Date.now() - 7200_000);
      spend(store, kid, 0.3, Date.now() - 3600_000);
      if (leaves) members.splice(members.indexOf(other.id), 1); // zapusti razred (ali ga učitelj odstrani)
      const r = await ask(call, kid);
      assert.equal(r.status, 429, leaves ? "po odhodu sošolca je meja šole spet prosta (4,99 $ porabe izgine)" : "kontrola");
    }, { streamFn });
  });
}
