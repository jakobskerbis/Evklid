// A7: dve sočasni dostavi istega dogodka Stripe (ponovitev, ko prvi odgovor zamuja) obdelata dogodek samo enkrat.
// Zagon: node --test test/stripe-socasno.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { signWebhook } from "../server/accounts/stripe.js";

const SECRET = "whsec_socasno";

test("A7 sočasni dostavi istega dogodka: handleEvent teče enkrat, druga dostava dobi 409, ponovitev po koncu je dvojnik", async () => {
  const store = openDb(":memory:");
  let poizvedbe = 0;
  const fetchFn = async (url) => {
    if (new URL(url).pathname.startsWith("/v1/charges/")) {
      poizvedbe++;
      await new Promise((r) => setTimeout(r, 150)); // Stripe odgovarja počasi: druga dostava pride vmes
      return { ok: true, status: 200, json: async () => ({ id: "ch_1", customer: "cus_ni_v_bazi", invoice: null }) };
    }
    return { ok: true, status: 200, json: async () => ({ id: "x" }) };
  };
  const app = createApp(store, { accounts: true, scheduler: false, fetchFn, webhookSecret: SECRET, stripeKey: "sk_test_x", log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const url = `http://127.0.0.1:${server.address().port}/api/stripe/webhook`;
  const raw = JSON.stringify({ id: "evt_socasno", type: "charge.dispute.created", data: { object: { id: "dp_1", charge: "ch_1", payment_intent: "pi_ni_v_bazi" } } });
  const poslji = () => fetch(url, { method: "POST", headers: { "content-type": "application/json", "stripe-signature": signWebhook(raw, SECRET) }, body: raw }).then(async (r) => ({ status: r.status, body: await r.json() }));
  try {
    const [a, b] = await Promise.all([poslji(), poslji()]);
    assert.equal(poizvedbe, 1, "dogodek je bil obdelan " + poizvedbe + "-krat");
    assert.deepEqual([a.status, b.status].sort(), [200, 409], JSON.stringify([a, b]));
    const vrstica = store.db.prepare("SELECT processed_at, error FROM billing_events WHERE id = 'evt_socasno'").get();
    assert.ok(vrstica.processed_at, "dogodek je označen kot obdelan");
    assert.equal(vrstica.error, null);
    const c = await poslji();
    assert.equal(c.status, 200);
    assert.equal(c.body.duplicate, true);
    assert.equal(poizvedbe, 1);
  } finally {
    server.close();
  }
});

test("A7 prevzem, ki ga je pustil padli proces (starejši od 5 minut), se lahko prevzame znova", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, fetchFn: async () => ({ ok: true, status: 200, json: async () => ({}) }), webhookSecret: SECRET, stripeKey: "sk_test_x", log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const url = `http://127.0.0.1:${server.address().port}/api/stripe/webhook`;
  const poslji = (raw) => fetch(url, { method: "POST", headers: { "content-type": "application/json", "stripe-signature": signWebhook(raw, SECRET) }, body: raw }).then((r) => r.status);
  try {
    const ins = store.db.prepare("INSERT INTO billing_events (id, type, error) VALUES (?, 'customer.updated', ?)");
    ins.run("evt_star", `v obdelavi ${Date.now() - 6 * 60 * 1000}`);
    ins.run("evt_svez", `v obdelavi ${Date.now()}`);
    assert.equal(await poslji(JSON.stringify({ id: "evt_star", type: "customer.updated", data: { object: {} } })), 200);
    assert.ok(store.db.prepare("SELECT processed_at FROM billing_events WHERE id = 'evt_star'").get().processed_at);
    assert.equal(await poslji(JSON.stringify({ id: "evt_svez", type: "customer.updated", data: { object: {} } })), 409);
  } finally {
    server.close();
  }
});

test("A7 napaka z besedilom »v obdelavi …« dogodka ne zaklene; ponovitev ga obdela", async () => {
  const store = openDb(":memory:");
  let poskus = 0;
  const fetchFn = async (url) => {
    if (new URL(url).pathname.startsWith("/v1/charges/")) {
      poskus++;
      if (poskus === 1) return { ok: false, status: 500, json: async () => ({ error: { message: "v obdelavi 99999999999999" } }) };
      return { ok: true, status: 200, json: async () => ({ id: "ch_1", customer: "cus_ni_v_bazi", invoice: null }) };
    }
    return { ok: true, status: 200, json: async () => ({}) };
  };
  const app = createApp(store, { accounts: true, scheduler: false, fetchFn, webhookSecret: SECRET, stripeKey: "sk_test_x", log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const url = `http://127.0.0.1:${server.address().port}/api/stripe/webhook`;
  const raw = JSON.stringify({ id: "evt_napaka", type: "charge.dispute.created", data: { object: { id: "dp_2", charge: "ch_1", payment_intent: "pi_ni_v_bazi" } } });
  const poslji = () => fetch(url, { method: "POST", headers: { "content-type": "application/json", "stripe-signature": signWebhook(raw, SECRET) }, body: raw }).then((r) => r.status);
  try {
    assert.equal(await poslji(), 500);
    assert.match(store.db.prepare("SELECT error FROM billing_events WHERE id = 'evt_napaka'").get().error, /^napaka: v obdelavi/);
    assert.equal(await poslji(), 200);
    assert.ok(store.db.prepare("SELECT processed_at FROM billing_events WHERE id = 'evt_napaka'").get().processed_at);
  } finally {
    server.close();
  }
});
