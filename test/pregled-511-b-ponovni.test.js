// Novi sistem plačil: aktivacijske kode v bazi, paketi pred testom, povezava za starše,
// potrditve pred plačilom, webhooki brez dvojnikov, odlog ob neuspelem plačilu in dnevna opravila.
import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { mountAccounts } from "../server/accounts/index.js";
import { signWebhook } from "../server/accounts/stripe.js";
import { PASSES, passForDaysLeft, paidActive, GRACE_DAYS } from "../server/accounts/plans.js";
import { parseCode } from "../server/accounts/promo.js";
import { ownsStripeObject, parentFromMeta } from "../server/accounts/ponoven-id.js";

const SECRET = "whsec_test";
const YEAR = new Date().getFullYear();
const ADULT = "1985-04-12";
const TEEN = `${YEAR - 16}-01-10`;
const day = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

// Lažni Stripe + Resend. stripe.sessions / stripe.subs: kar vrneta GET /checkout/sessions/:id in /subscriptions/:id.
function fakeStripe() {
  const calls = [];
  const state = { sessions: {}, subs: {}, charges: {} };
  let n = 0;
  const fetchFn = async (url, init = {}) => {
    const body = init.body ? (init.headers["Content-Type"]?.includes("json") ? JSON.parse(init.body) : Object.fromEntries(new URLSearchParams(init.body))) : null;
    const u = new URL(url);
    calls.push({ method: init.method, path: u.pathname, body, host: u.host });
    const ok = (data) => ({ ok: true, status: 200, json: async () => data });
    if (u.host === "api.resend.com") return ok({ id: "email_" + ++n });
    const p = u.pathname.replace("/v1", "");
    if (p === "/customers") return ok({ id: "cus_" + ++n });
    if (p === "/prices" && init.method === "GET") return ok({ data: [] });
    if (p === "/products") return ok({ id: "prod_1" });
    if (p === "/prices") return ok({ id: "price_" + body.lookup_key });
    if (p === "/checkout/sessions" && init.method === "POST") return ok({ id: "cs_" + ++n, url: "https://checkout.stripe.test/" + n });
    const cs = /^\/checkout\/sessions\/(\w+)$/.exec(p);
    if (cs) return ok(state.sessions[cs[1]] || { id: cs[1] });
    const sub = /^\/subscriptions\/(\w+)$/.exec(p);
    if (sub && init.method === "DELETE") return ok({ ...(state.subs[sub[1]] || { id: sub[1], items: { data: [] } }), status: "canceled" });
    if (sub) return ok(state.subs[sub[1]] || {});
    if (p === "/subscriptions") return ok({ data: Object.values(state.subs) });
    const ch = /^\/charges\/(\w+)$/.exec(p);
    if (ch) return ok(state.charges[ch[1]] || {});
    return { ok: false, status: 404, json: async () => ({ error: { message: "ni" } }) };
  };
  return { calls, state, fetchFn };
}

async function withServer(fn, extra = {}) {
  const store = openDb(":memory:");
  const stripe = fakeStripe();
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    stripeKey: "sk_test_x",
    resendKey: "re_x",
    webhookSecret: SECRET,
    fetchFn: stripe.fetchFn,
    log: { error() {} },
    streamFn: async ({ onText }) => {
      onText("ok");
      return { text: 'ok\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>', stopReason: "end_turn" };
    },
    ...extra,
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || "GET",
        redirect: "manual",
        headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; "), ...(opts.headers || {}) },
        body: opts.raw ?? (opts.body ? JSON.stringify(opts.body) : undefined),
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar[kv.slice(0, i)] = kv.slice(i + 1);
      }
      const type = res.headers.get("content-type") || "";
      return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
    };
  };
  const hook = (event) => {
    const raw = JSON.stringify(event);
    return client()("/api/stripe/webhook", { method: "POST", raw, headers: { "stripe-signature": signWebhook(raw, SECRET) } });
  };
  try {
    await fn({ client, store, stripe, hook });
  } finally {
    server.close();
  }
}

async function registerVerified(call, stripe, email, extra = {}) {
  const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: ADULT, ...extra } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  const mail = stripe.calls.filter((c) => c.host === "api.resend.com").at(-1);
  await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
  return r.body.parent;
}

const addTest = (call, kidId, date, name = "Test iz ulomkov") =>
  call(`/api/students/${kidId}/schedule`, { method: "PUT", body: { events: [{ date, kind: "test", name }] } });

// ---------- Ponovni pregled B #511 (6d6810f6) ----------
const now = () => Math.floor(Date.now() / 1000);
const row = (store, id) => ({ ...store.db.prepare("SELECT stripe_customer_id, sub_id, sub_status FROM parents WHERE id = ?").get(id) });
const EMPTY = { stripe_customer_id: null, sub_id: null, sub_status: null };
const lastSession = (stripe) => stripe.calls.filter((c) => c.path === "/v1/checkout/sessions" && c.method === "POST").at(-1).body;
const unmatchedKeys = (store) => store.db.prepare("SELECT key, value FROM kv WHERE key LIKE 'stripe_unmatched:%'").all();
const subOf = (id, customer, created, meta, extra = {}) => ({ id, object: "subscription", customer, created, status: "active", metadata: meta, items: { data: [{ price: { lookup_key: "evklid_1_month" }, current_period_end: 1893456000 }] }, ...extra });

// A odpre Checkout, izbriše račun; B se registrira `bAfterS` sekund po seji; A plača zdaj.
async function attack({ client, store, stripe, hook }, { legacy = false, bAfterS = 3600, order = ["sc", "cs", "ip"] } = {}) {
  const a = client();
  const A = await registerVerified(a, stripe, "a@rr.si");
  store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(A.id);
  assert.equal((await a("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", adult: true, withdrawal: true } })).status, 200);
  const body = lastSession(stripe);
  const uidA = body["metadata[parent_uid]"];
  assert.ok(uidA, "uid v metadata seje");
  assert.equal(body["subscription_data[metadata][parent_uid]"], uidA, "uid v subscription_data");
  const cusA = store.db.prepare("SELECT stripe_customer_id AS c FROM parents WHERE id = ?").get(A.id).c;
  assert.equal((await a("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
  const B = await registerVerified(client(), stripe, "b@rr.si");
  assert.equal(B.id, A.id);
  const sessCreated = now() - 3 * 3600;
  store.db.prepare("UPDATE parents SET created_at = datetime(?, 'unixepoch') WHERE id = ?").run(sessCreated + bAfterS, B.id);
  const meta = legacy ? { parent_id: String(A.id) } : { parent_id: String(A.id), parent_uid: uidA };
  stripe.state.subs.sub_a = subOf("sub_a", cusA, now(), meta);
  const session = { id: "cs_a", object: "checkout.session", created: sessCreated, customer: cusA, client_reference_id: String(A.id), subscription: "sub_a", payment_status: "paid", amount_total: 999, currency: "eur", metadata: meta };
  const ev = {
    cs: { id: "evt_cs", type: "checkout.session.completed", data: { object: session } },
    sc: { id: "evt_sc", type: "customer.subscription.created", data: { object: stripe.state.subs.sub_a } },
    su: { id: "evt_su", type: "customer.subscription.updated", data: { object: stripe.state.subs.sub_a } },
    ip: { id: "evt_ip", type: "invoice.paid", data: { object: { id: "in_a", object: "invoice", customer: cusA, amount_paid: 999, subscription: "sub_a", billing_reason: "subscription_create", subscription_details: { metadata: meta }, payment_intent: "pi_a", lines: { data: [] } } } },
  };
  for (const k of order) assert.equal((await hook(ev[k])).status, 200, k);
  return { A, B, uidA };
}

test("RR1: uid, realen čas (sub.created = zdaj), B 1 h po seji: B nič, zapis v kv", async () => {
  await withServer(async (ctx) => {
    const { B } = await attack(ctx, { order: ["sc", "su", "cs", "ip"] });
    assert.deepEqual(row(ctx.store, B.id), EMPTY);
    const k = unmatchedKeys(ctx.store).map((r) => r.key).sort();
    assert.deepEqual(k, ["stripe_unmatched:evt_cs", "stripe_unmatched:evt_sc"]);
    const rec = JSON.parse(unmatchedKeys(ctx.store)[0].value);
    assert.ok(!JSON.stringify(rec).includes("@"), "brez e-naslova");
  });
});

test("RR2: uid, B registriran 1 min po seji (znotraj 5-min zamika ure): B nič", async () => {
  await withServer(async (ctx) => {
    const { B } = await attack(ctx, { bAfterS: 60, order: ["cs", "sc"] });
    assert.deepEqual(row(ctx.store, B.id), EMPTY);
  });
});

test("RR3: stara seja brez uid, B 1 min po seji (znotraj zamika): kaj dobi B? (prehodno okno)", async () => {
  await withServer(async (ctx) => {
    const { B } = await attack(ctx, { legacy: true, bAfterS: 60, order: ["cs"] });
    const r = row(ctx.store, B.id);
    console.log("RR3 B:", JSON.stringify(r));
    assert.deepEqual(r, EMPTY, "B dobi A-jevo stranko/naročnino v prehodnem oknu");
  });
});

test("RR4: stara seja brez uid, B 1 h po seji: sub.created in cs zavrnjena", async () => {
  await withServer(async (ctx) => {
    const { B } = await attack(ctx, { legacy: true, order: ["sc", "cs", "ip"] });
    assert.deepEqual(row(ctx.store, B.id), EMPTY);
  });
});

test("RR5: pravi račun, mlajši od 24 h, povezava za plačilo z uid: sub.created pred cs, brez lažnih zapisov", async () => {
  await withServer(async ({ client, store, stripe, hook }) => {
    const teen = client();
    const P = await registerVerified(teen, stripe, "dijak@rr.si", { birth_date: TEEN });
    await teen("/api/students", { method: "POST", body: { name: "Nik", self: true, consent: true } });
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();
    const link = await teen("/api/billing/pay-link", { method: "POST", body: { kind: "sub", seats: 1, interval: "month" } });
    const token = new URL(link.body.url).searchParams.get("t");
    const co = await client()(`/api/pay/${token}/checkout`, { method: "POST", body: { email: "mama@rr.si", adult: true, withdrawal: true } });
    assert.equal(co.status, 200, JSON.stringify(co.body));
    const body = lastSession(stripe);
    const meta = { parent_id: String(P.id), parent_uid: body["subscription_data[metadata][parent_uid]"] };
    assert.ok(meta.parent_uid);
    stripe.state.subs.sub_m = subOf("sub_m", "cus_mama", now(), meta);
    assert.equal((await hook({ id: "evt_m1", type: "customer.subscription.created", data: { object: stripe.state.subs.sub_m } })).status, 200);
    assert.equal(row(store, P.id).sub_id, "sub_m", "naročnina takoj (po uid)");
    const sess = { id: "cs_m", object: "checkout.session", created: now() - 30, customer: "cus_mama", subscription: "sub_m", payment_status: "paid", metadata: { ...meta, pay_link: body["metadata[pay_link]"] } };
    assert.equal((await hook({ id: "evt_m2", type: "checkout.session.completed", data: { object: sess } })).status, 200);
    assert.deepEqual(row(store, P.id), { stripe_customer_id: "cus_mama", sub_id: "sub_m", sub_status: "active" });
    assert.deepEqual(unmatchedKeys(store), []);
  });
});

test("RR6: pravi račun < 24 h, STARA povezava brez uid (prehod): naročnina pride po cs; lažen zapis za sub.created?", async () => {
  await withServer(async ({ client, store, stripe, hook }) => {
    const teen = client();
    const P = await registerVerified(teen, stripe, "dijak2@rr.si", { birth_date: TEEN });
    store.db.prepare("UPDATE parents SET created_at = datetime('now','-2 hours') WHERE id = ?").run(P.id);
    const meta = { parent_id: String(P.id) };
    stripe.state.subs.sub_l = subOf("sub_l", "cus_mama2", now(), meta);
    assert.equal((await hook({ id: "evt_l1", type: "customer.subscription.created", data: { object: stripe.state.subs.sub_l } })).status, 200);
    const sess = { id: "cs_l", object: "checkout.session", created: now() - 3600, customer: "cus_mama2", subscription: "sub_l", payment_status: "paid", metadata: { ...meta, pay_link: "x" } };
    assert.equal((await hook({ id: "evt_l2", type: "checkout.session.completed", data: { object: sess } })).status, 200);
    assert.equal(row(store, P.id).sub_id, "sub_l");
    console.log("RR6 kv:", JSON.stringify(unmatchedKeys(store).map((r) => r.key)));
  });
});

test("RR7: zapis v kv ne uspe → 500, ni označen kot obdelan; ponovitev → 200 + zapis; tretja → duplicate", async () => {
  await withServer(async (ctx) => {
    const { store, hook } = ctx;
    store.db.exec("CREATE TRIGGER no_unm BEFORE INSERT ON kv WHEN NEW.key LIKE 'stripe_unmatched:%' BEGIN SELECT RAISE(ABORT, 'disk full'); END;");
    const a = ctx.client();
    const A = await registerVerified(a, ctx.stripe, "k@rr.si");
    const ev = { id: "evt_k", type: "checkout.session.completed", data: { object: { id: "cs_k", object: "checkout.session", created: now() - 3600, customer: "cus_zz", subscription: null, payment_status: "paid", metadata: { parent_id: String(A.id), parent_uid: "tuj" } } } };
    const r1 = await hook(ev);
    assert.equal(r1.status, 500);
    const be = store.db.prepare("SELECT processed_at, error FROM billing_events WHERE id = 'evt_k'").get();
    assert.equal(be.processed_at, null);
    assert.match(be.error, /disk/);
    store.db.exec("DROP TRIGGER no_unm");
    assert.equal((await hook(ev)).status, 200);
    assert.equal(unmatchedKeys(store).length, 1);
    assert.equal((await hook(ev)).body.duplicate, true);
    assert.equal(unmatchedKeys(store).length, 1);
  });
});

test("RR8: dokup: dvojni dogodek (completed + async_payment_succeeded, ponovitev po 500) pripiše kredit enkrat", async () => {
  await withServer(async ({ client, store, stripe, hook }) => {
    const a = client();
    const A = await registerVerified(a, stripe, "kr@rr.si");
    assert.equal((await a("/api/billing/credit", { method: "POST", body: { pack: "k10", adult: true, withdrawal: true } })).status, 200);
    const body = lastSession(stripe);
    const meta = { kind: "credit", credit_id: body["metadata[credit_id]"], parent_id: String(A.id), parent_uid: body["metadata[parent_uid]"] };
    assert.ok(meta.parent_uid);
    const s = { id: "cs_kr", object: "checkout.session", created: now(), payment_status: "paid", payment_intent: "pi_kr", metadata: meta };
    const bal = () => store.db.prepare("SELECT COUNT(*) n, SUM(credit_usd) s FROM ai_credit_buys WHERE parent_id = ? AND status = 'active'").get(A.id);
    assert.equal((await hook({ id: "evt_k1", type: "checkout.session.completed", data: { object: s } })).status, 200);
    assert.equal((await hook({ id: "evt_k2", type: "checkout.session.async_payment_succeeded", data: { object: s } })).status, 200);
    assert.equal((await hook({ id: "evt_k1", type: "checkout.session.completed", data: { object: s } })).body.duplicate, true);
    assert.equal(bal().n, 1);
    assert.deepEqual(unmatchedKeys(store), []);
  });
});

test("RR9: B z istim id in istim id dokupa, uid: A-jevo plačilo ne aktivira B-jevega nakupa", async () => {
  await withServer(async ({ client, store, stripe, hook }) => {
    const c = { adult: true, withdrawal: true };
    const a = client();
    const A = await registerVerified(a, stripe, "d1@rr.si");
    await a("/api/billing/credit", { method: "POST", body: { pack: "k20", ...c } });
    const bodyA = lastSession(stripe);
    await a("/api/account", { method: "DELETE", body: { password: "geslo1234" } });
    const b = client();
    const B = await registerVerified(b, stripe, "d2@rr.si");
    await b("/api/billing/credit", { method: "POST", body: { pack: "k5", ...c } });
    assert.equal(lastSession(stripe)["metadata[credit_id]"], bodyA["metadata[credit_id]"]);
    const s = { id: "cs_d1", object: "checkout.session", created: now(), payment_status: "paid", payment_intent: "pi_d1", metadata: { kind: "credit", credit_id: bodyA["metadata[credit_id]"], parent_id: String(A.id), parent_uid: bodyA["metadata[parent_uid]"] } };
    assert.equal((await hook({ id: "evt_d1", type: "checkout.session.completed", data: { object: s } })).status, 200);
    assert.equal(store.db.prepare("SELECT status FROM ai_credit_buys WHERE parent_id = ?").get(B.id).status, "pending");
    assert.equal(unmatchedKeys(store).length, 1);
  });
});

test("RR10: obstoječi naročniki brez uid: po stranki (posodobitev, plačilo, preklic) in stari nakup paketa z istim checkout_id", async () => {
  await withServer(async ({ client, store, stripe, hook }) => {
    const P = await registerVerified(client(), stripe, "star@rr.si");
    store.db.prepare("UPDATE parents SET created_at = '2026-11-07 23:00:00', stripe_customer_id = 'cus_s', sub_id = 'sub_s', sub_status = 'active' WHERE id = ?").run(P.id);
    stripe.state.subs.sub_s = subOf("sub_s", "cus_s", Date.parse("2025-03-01") / 1000, { parent_id: String(P.id) }, { status: "past_due" });
    assert.equal((await hook({ id: "e1", type: "customer.subscription.updated", data: { object: stripe.state.subs.sub_s } })).status, 200);
    assert.equal(row(store, P.id).sub_status, "past_due");
    stripe.state.subs.sub_s = { ...stripe.state.subs.sub_s, status: "active" };
    assert.equal((await hook({ id: "e2", type: "invoice.paid", data: { object: { id: "in_s", object: "invoice", customer: "cus_s", amount_paid: 999, subscription: "sub_s", payment_intent: "pi_s", lines: { data: [] } } } })).status, 200);
    assert.equal((await hook({ id: "e3", type: "customer.subscription.updated", data: { object: stripe.state.subs.sub_s } })).status, 200);
    assert.equal(row(store, P.id).sub_status, "active");
    // nova naročnina istega obstoječega kupca (npr. po preklicu), brez uid, created zdaj, po stranki
    stripe.state.subs.sub_s2 = subOf("sub_s2", "cus_s", now(), { parent_id: String(P.id) });
    assert.equal((await hook({ id: "e4", type: "customer.subscription.created", data: { object: stripe.state.subs.sub_s2 } })).status, 200);
    assert.equal(row(store, P.id).sub_id, "sub_s2");
    assert.deepEqual(unmatchedKeys(store), []);
  });
});

test("RR11: selitev stare baze brez stolpca uid: vsak račun dobi edinstven uid, nov račun tudi", async () => {
  const { migrateAccounts } = await import("../server/accounts/schema.js");
  const store = openDb(":memory:");
  const db = store.db;
  migrateAccounts(db);
  for (let i = 0; i < 3; i++) db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code) VALUES (?, 'x', '1', ?, ?)").run(`m${i}@rr.si`, `t${i}`, `r${i}`);
  db.exec("DROP TRIGGER parents_uid; DROP INDEX idx_parents_uid; ALTER TABLE parents DROP COLUMN uid;");
  migrateAccounts(db);
  const u = db.prepare("SELECT uid FROM parents").all().map((r) => r.uid);
  assert.equal(new Set(u).size, 3);
  assert.ok(u.every((x) => /^[0-9a-f]{32}$/.test(x)));
  migrateAccounts(db); // ponovni zagon: uid se ne spremeni
  assert.deepEqual(db.prepare("SELECT uid FROM parents").all().map((r) => r.uid), u);
  const id = db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code) VALUES ('n@rr.si', 'x', '1', 'tn', 'rn')").run().lastInsertRowid;
  assert.match(db.prepare("SELECT uid FROM parents WHERE id = ?").get(id).uid, /^[0-9a-f]{32}$/);
});
