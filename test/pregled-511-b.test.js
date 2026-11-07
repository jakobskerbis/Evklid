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

// ---------- Pregled B #511: lastni scenariji ----------
const now = () => Math.floor(Date.now() / 1000);
const subObj = (id, customer, created, pid, extra = {}) => ({ id, object: "subscription", customer, created, status: "active", metadata: { parent_id: String(pid) }, items: { data: [{ price: { lookup_key: "evklid_1_month" }, current_period_end: 1893456000 }] }, ...extra });
const row = (store, id) => ({ ...store.db.prepare("SELECT stripe_customer_id, sub_id, sub_status FROM parents WHERE id = ?").get(id) });
const EMPTY = { stripe_customer_id: null, sub_id: null, sub_status: null };

// A odpre Checkout (seja pred B), izbriše račun, B dobi isti id, A plača. Stripe naročnino ustvari OB PLAČILU
// (sub.created = zdaj, po B), customer.subscription.created pogosto pride pred checkout.session.completed.
async function deletedThenPays({ client, store, stripe, hook }, order) {
  const a = client();
  const A = await registerVerified(a, stripe, "a@b511.si");
  store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(A.id);
  assert.equal((await a("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", adult: true, withdrawal: true } })).status, 200);
  const cusA = store.db.prepare("SELECT stripe_customer_id AS c FROM parents WHERE id = ?").get(A.id).c;
  assert.equal((await a("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
  const b = client();
  const B = await registerVerified(b, stripe, "b@b511.si");
  assert.equal(B.id, A.id);
  const sessCreated = now() - 3600;
  store.db.prepare("UPDATE parents SET created_at = datetime('now', '-10 minutes') WHERE id = ?").run(B.id); // B nastal po seji
  stripe.state.subs.sub_a = subObj("sub_a", cusA, now(), A.id); // realno: naročnina nastane ob plačilu
  const session = { id: "cs_a", object: "checkout.session", created: sessCreated, customer: cusA, client_reference_id: String(A.id), subscription: "sub_a", payment_status: "paid", metadata: { parent_id: String(A.id) } };
  const ev = {
    cs: { id: "evt_cs", type: "checkout.session.completed", data: { object: session } },
    sc: { id: "evt_sc", type: "customer.subscription.created", data: { object: stripe.state.subs.sub_a } },
    su: { id: "evt_su", type: "customer.subscription.updated", data: { object: stripe.state.subs.sub_a } },
    ip: { id: "evt_ip", type: "invoice.paid", data: { object: { id: "in_a", customer: cusA, amount_paid: 999, subscription: "sub_a", billing_reason: "subscription_create", subscription_details: { metadata: { parent_id: String(A.id) } }, payment_intent: "pi_a", lines: { data: [] } } } },
  };
  for (const k of order) assert.equal((await hook(ev[k])).status, 200, k);
  return { A, B, cusA };
}

test("B511-1a: A izbriše račun in plača; vrstni red cs → sub.created → invoice.paid: B ne dobi ničesar", async () => {
  await withServer(async (ctx) => {
    const { B } = await deletedThenPays(ctx, ["cs", "sc", "ip"]);
    assert.deepEqual(row(ctx.store, B.id), EMPTY);
  });
});

test("B511-1b: realen vrstni red Stripa sub.created pred cs: B ne dobi ničesar", async () => {
  await withServer(async (ctx) => {
    const { B } = await deletedThenPays(ctx, ["sc", "su", "cs"]);
    assert.deepEqual(row(ctx.store, B.id), EMPTY);
  });
});

test("B511-2: trije računi z istim id zapored; star dogodek naročnine A (A je imel plačano, izbris jo prekliče) ne gre C", async () => {
  await withServer(async ({ client, store, stripe, hook }) => {
    const ids = [];
    let cus;
    for (const e of ["x1@b511.si", "x2@b511.si"]) {
      const c = client();
      const P = await registerVerified(c, stripe, e);
      ids.push(P.id);
      if (!cus) {
        store.db.prepare("UPDATE parents SET stripe_customer_id = 'cus_old', sub_id = 'sub_old', sub_status = 'active', created_at = datetime('now','-30 days') WHERE id = ?").run(P.id);
        stripe.state.subs.sub_old = subObj("sub_old", "cus_old", now() - 20 * 86400, P.id);
        cus = "cus_old";
      }
      assert.equal((await c("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
    }
    const c3 = client();
    const C = await registerVerified(c3, stripe, "x3@b511.si");
    assert.ok(ids.every((i) => i === C.id), "id ponovno uporabljen trikrat");
    // izbris je naročnino preklical; Stripe pošlje deleted (in kasneje morda updated)
    const canceled = { ...stripe.state.subs.sub_old, status: "canceled" };
    stripe.state.subs.sub_old = canceled;
    assert.equal((await hook({ id: "evt_d", type: "customer.subscription.deleted", data: { object: canceled } })).status, 200);
    assert.equal((await hook({ id: "evt_u", type: "customer.subscription.updated", data: { object: { ...canceled, status: "active" } } })).status, 200);
    assert.deepEqual(row(store, C.id), EMPTY);
  });
});

test("B511-3: ponarejen webhook (brez podpisa, napačen ključ, star čas, spremenjeno telo) → 400, nič se ne zgodi", async () => {
  await withServer(async ({ client, store, stripe }) => {
    const a = client();
    const A = await registerVerified(a, stripe, "f@b511.si");
    const ev = { id: "evt_f", type: "customer.subscription.updated", data: { object: subObj("sub_f", "cus_f", now(), A.id) } };
    const raw = JSON.stringify(ev);
    const post = (headers, body = raw) => client()("/api/stripe/webhook", { method: "POST", raw: body, headers });
    assert.equal((await post({})).status, 400);
    assert.equal((await post({ "stripe-signature": signWebhook(raw, "whsec_wrong") })).status, 400);
    assert.equal((await post({ "stripe-signature": signWebhook(raw, SECRET, now() - 3600) })).status, 400);
    assert.equal((await post({ "stripe-signature": signWebhook(raw, SECRET) }, raw.replace("sub_f", "sub_g"))).status, 400);
    assert.equal((await post({ "stripe-signature": "t=1,v1=" })).status, 400);
    assert.deepEqual(row(store, A.id), EMPTY);
    assert.equal(store.db.prepare("SELECT COUNT(*) n FROM billing_events").get().n, 0);
  });
});

test("B511-4: ponovljen dogodek in napačen vrstni red za pravega lastnika (brez stranke, samo metadata)", async () => {
  await withServer(async ({ client, store, stripe, hook }) => {
    const a = client();
    const A = await registerVerified(a, stripe, "r@b511.si");
    store.db.prepare("UPDATE parents SET created_at = datetime('now','-1 day') WHERE id = ?").run(A.id);
    const s = subObj("sub_r", "cus_new", now(), A.id);
    stripe.state.subs.sub_r = { ...s, status: "canceled" }; // sveže stanje: že preklicana
    // deleted pride pred created; created ponovljen
    assert.equal((await hook({ id: "evt_r2", type: "customer.subscription.deleted", data: { object: { ...s, status: "canceled" } } })).status, 200);
    assert.equal((await hook({ id: "evt_r1", type: "customer.subscription.created", data: { object: s } })).status, 200);
    const again = await hook({ id: "evt_r1", type: "customer.subscription.created", data: { object: s } });
    assert.equal(again.body.duplicate, true);
    assert.equal(row(store, A.id).sub_status, "canceled", "sveže stanje zmaga");
  });
});

test("B511-5: vračilo in spor pri plačilu izbrisanega A ne vplivata na B; pri pravem lastniku delujeta", async () => {
  await withServer(async (ctx) => {
    const { store, stripe, hook } = ctx;
    const { B, cusA } = await deletedThenPays(ctx, ["cs"]);
    store.db.prepare("UPDATE parents SET stripe_customer_id = 'cus_b', sub_id = 'sub_b', sub_status = 'active' WHERE id = ?").run(B.id);
    stripe.state.subs.sub_b = subObj("sub_b", "cus_b", now(), B.id);
    stripe.state.charges.ch_a = { id: "ch_a", customer: cusA, invoice: null };
    assert.equal((await hook({ id: "evt_rf", type: "charge.refunded", data: { object: { id: "ch_a", customer: cusA, amount: 999, amount_refunded: 999, payment_intent: "pi_a", invoice: "in_a" } } })).status, 200);
    assert.equal((await hook({ id: "evt_dp", type: "charge.dispute.created", data: { object: { id: "dp_a", charge: "ch_a", payment_intent: "pi_a" } } })).status, 200);
    assert.equal(row(store, B.id).sub_status, "active", "B ostane nedotaknjen");
    // spor pri B-jevem plačilu: B-jeva naročnina preklicana
    stripe.state.charges.ch_b = { id: "ch_b", customer: "cus_b", invoice: null };
    assert.equal((await hook({ id: "evt_dpb", type: "charge.dispute.created", data: { object: { id: "dp_b", charge: "ch_b", payment_intent: "pi_b" } } })).status, 200);
    assert.equal(row(store, B.id).sub_status, "canceled");
  });
});

test("B511-6a: dokup pogovorov z istim id računa IN istim id nakupa: A plača, B dobi kredit", async () => {
  await withServer(async ({ client, store, stripe, hook }) => {
    const consent = { adult: true, withdrawal: true };
    const a = client();
    const A = await registerVerified(a, stripe, "ka@b511.si");
    assert.equal((await a("/api/billing/credit", { method: "POST", body: { pack: "k20", ...consent } })).status, 200);
    const cA = store.db.prepare("SELECT id FROM ai_credit_buys WHERE parent_id = ?").get(A.id).id;
    assert.equal((await a("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
    const b = client();
    const B = await registerVerified(b, stripe, "kb@b511.si");
    assert.equal((await b("/api/billing/credit", { method: "POST", body: { pack: "k5", ...consent } })).status, 200);
    const cB = store.db.prepare("SELECT id FROM ai_credit_buys WHERE parent_id = ?").get(B.id).id;
    assert.equal(cB, cA, "id nakupa ponovno uporabljen");
    const session = { id: "cs_ka", created: now() - 600, customer: "cus_x", payment_status: "paid", payment_intent: "pi_ka", metadata: { kind: "credit", credit_id: String(cA), parent_id: String(A.id) } };
    store.db.prepare("UPDATE parents SET created_at = datetime('now','-1 minute') WHERE id = ?").run(B.id);
    assert.equal((await hook({ id: "evt_ka", type: "checkout.session.completed", data: { object: session } })).status, 200);
    assert.equal(store.db.prepare("SELECT status FROM ai_credit_buys WHERE id = ?").get(cB).status, "pending", "B-jev neplačan nakup ne sme postati aktiven");
  });
});

test("B511-6b: darilna koda izbrisanega kupca: B z istim id ne dobi kode; šolska naročnina pravega lastnika deluje", async () => {
  await withServer(async ({ client, store, stripe, hook }) => {
    const a = client();
    const A = await registerVerified(a, stripe, "ga@b511.si");
    const gid = store.db.prepare("INSERT INTO gifts (buyer_id, amount, days, status, checkout_id) VALUES (?, 9900, 365, 'pending', 'cs_g') RETURNING id").get(A.id).id;
    assert.equal((await a("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
    const B = await registerVerified(client(), stripe, "gb@b511.si");
    assert.equal(B.id, A.id);
    const session = { id: "cs_g", created: now() - 600, payment_status: "paid", payment_intent: "pi_g", metadata: { kind: "gift", gift_id: String(gid), parent_id: String(A.id) } };
    assert.equal((await hook({ id: "evt_g", type: "checkout.session.completed", data: { object: session } })).status, 200);
    const g = store.db.prepare("SELECT buyer_id, status, code FROM gifts WHERE id = ?").get(gid);
    assert.equal(g.status, "pending");
    assert.equal(g.code, null);
    // šolska cena: pravi lastnik (star račun), naročnina s šolskim lookup_key, samo metadata (stranka še ni povezana)
    store.db.prepare("UPDATE parents SET created_at = datetime('now','-1 day') WHERE id = ?").run(B.id);
    stripe.state.subs.sub_s = { ...subObj("sub_s", "cus_s", now(), B.id), items: { data: [{ price: { lookup_key: "evklid_sola_month" }, current_period_end: 1893456000 }] } };
    assert.equal((await hook({ id: "evt_s", type: "customer.subscription.created", data: { object: stripe.state.subs.sub_s } })).status, 200);
    assert.equal(row(store, B.id).sub_id, "sub_s");
  });
});

test("B511-7: obstoječ plačnik (star created_at, stranka povezana, star dogodek brez created) ostane plačnik", async () => {
  await withServer(async ({ client, store, stripe, hook }) => {
    const P = await registerVerified(client(), stripe, "old@b511.si");
    store.db.prepare("UPDATE parents SET created_at = '2025-01-01 10:00:00', stripe_customer_id = 'cus_o', sub_id = 'sub_o', sub_status = 'active' WHERE id = ?").run(P.id);
    // Naročnina, ki je nastala pred... created_at (npr. račun ustvarjen kasneje kot stranka v Stripu)
    stripe.state.subs.sub_o = subObj("sub_o", "cus_o", Date.parse("2024-06-01") / 1000, P.id, { status: "past_due" });
    assert.equal((await hook({ id: "evt_o1", type: "customer.subscription.updated", data: { object: stripe.state.subs.sub_o } })).status, 200);
    assert.equal(row(store, P.id).sub_status, "past_due", "po stranki: časovni pogoj se ne uporabi");
    // invoice.paid po stranki
    assert.equal((await hook({ id: "evt_o2", type: "invoice.paid", data: { object: { id: "in_o", customer: "cus_o", amount_paid: 999, subscription: "sub_o", payment_intent: "pi_o", lines: { data: [] } } } })).status, 200);
    // dogodek brez created, samo metadata (stranke ni)
    store.db.prepare("UPDATE parents SET stripe_customer_id = NULL WHERE id = ?").run(P.id);
    stripe.state.subs.sub_o2 = subObj("sub_o2", "cus_o2", undefined, P.id);
    delete stripe.state.subs.sub_o2.created;
    assert.equal((await hook({ id: "evt_o3", type: "customer.subscription.updated", data: { object: stripe.state.subs.sub_o2 } })).status, 200);
    assert.equal(row(store, P.id).sub_id, "sub_o2");
  });
});
