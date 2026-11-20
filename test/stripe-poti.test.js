// Pilot korak 4 (j 2026-11-15): plačila Stripe v testnem načinu, vsaka pot od začetka do konca skozi podpisan webhook
// (/api/stripe/webhook): nakup, podaljšanje, neuspelo plačilo, preklic, vračilo, za naročnino, paket pred testom,
// dokup in darilno kodo. Preverja, kar vidi uporabnik (dostop v /api/account, vprašanja inštruktorju, meja AI),
// ne samo vrstice v bazi. Zemljevid vseh poti in testov: docs/placila-poti.md.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { signWebhook } from "../server/accounts/stripe.js";

const SECRET = "whsec_test";
const YEAR = new Date().getFullYear();
const ADULT = "1985-04-12";
const OK = { adult: true, withdrawal: true, terms: true };
const DAY = 86400;
const now = () => Math.floor(Date.now() / 1000);
const day = (n) => new Date(Date.now() + n * DAY * 1000).toISOString().slice(0, 10);

// Lažni Stripe + Resend: state.* je, kar Stripe vrne na GET (seja, naročnina, plačilo, račun).
function fakeStripe() {
  const calls = [];
  const state = { sessions: {}, subs: {}, charges: {}, invoices: {} };
  let n = 0;
  const fetchFn = async (url, init = {}) => {
    const body = init.body ? (init.headers["Content-Type"]?.includes("json") ? JSON.parse(init.body) : Object.fromEntries(new URLSearchParams(init.body))) : null;
    const u = new URL(url);
    calls.push({ method: init.method, path: u.pathname, body, host: u.host });
    const ok = (data) => ({ ok: true, status: 200, json: async () => data });
    if (u.host === "api.resend.com") return ok({ id: "email_" + ++n });
    const p = u.pathname.replace("/v1", "");
    if (p === "/customers") return ok({ id: "cus_" + ++n });
    if (/^\/customers\/\w+$/.test(p) && init.method === "DELETE")
      return state.customerDown ? { ok: false, status: 500, json: async () => ({ error: { message: "napaka" } }) } : ok({ id: p.split("/")[2], deleted: true });
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
    const inv = /^\/invoices\/(\w+)$/.exec(p);
    if (inv) return ok(state.invoices[inv[1]] || {});
    return { ok: false, status: 404, json: async () => ({ error: { message: "ni" } }) };
  };
  return { calls, state, fetchFn };
}

async function withServer(fn) {
  const store = openDb(":memory:");
  const stripe = fakeStripe();
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    stripeKey: "sk_test_x",
    resendKey: "re_x",
    webhookSecret: SECRET,
    fetchFn: stripe.fetchFn,
    log: { error() {}, info() {} },
    streamFn: async ({ onText }) => {
      onText("ok");
      return { text: 'ok\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>', stopReason: "end_turn" };
    },
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
  // Dogodek s podpisom, kot ga pošlje Stripe; vsak dogodek ima svoj id (dvojnike pošljemo z istim id).
  let ev = 0;
  const hook = async (type, object, id = `evt_${++ev}`) => {
    const raw = JSON.stringify({ id, type, created: now(), data: { object } });
    const r = await client()("/api/stripe/webhook", { method: "POST", raw, headers: { "stripe-signature": signWebhook(raw, SECRET) } });
    assert.equal(r.status, 200, `${type}: ${JSON.stringify(r.body)}`);
    return r.body;
  };
  try {
    await fn({ client, store, stripe, hook, app });
  } finally {
    server.close();
  }
}

// Starš s potrjenim e-naslovom, profil srednješolca, preizkus potekel; ask(): vprašanje inštruktorju.
async function account({ client, stripe, store }, email) {
  const a = client();
  const r = await a("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  await a(/\/api\/auth\/verify\?token=[\w-]+/.exec(stripe.calls.filter((c) => c.host === "api.resend.com").at(-1).body.text)[0]);
  const kid = (await a("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 17, consent: true } })).body;
  store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(r.body.parent.id);
  const conv = (await a(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
  const ask = async () => (await a(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "Koliko je 2 + 2?" } })).status;
  const acc = async () => (await a("/api/account")).body;
  return { a, parent: r.body.parent, kid, ask, acc };
}

const lastSession = (stripe) => stripe.calls.filter((c) => c.path === "/v1/checkout/sessions" && c.method === "POST").at(-1).body;
const customerOf = (store, id) => store.db.prepare("SELECT stripe_customer_id AS c FROM parents WHERE id = ?").get(id).c;

// Brezplačni paket: 1 vprašanje na dan, da je razlika med plačanim in brezplačnim dostopom vidna.
const ENV = { EVKLID_FREE_DAILY_QUESTIONS: "1" };
function withEnv(fn) {
  return async () => {
    const prev = {};
    for (const [k, v] of Object.entries(ENV)) (prev[k] = process.env[k]), (process.env[k] = v);
    try {
      await fn();
    } finally {
      for (const [k, v] of Object.entries(prev)) v === undefined ? delete process.env[k] : (process.env[k] = v);
    }
  };
}

test(
  "naročnina: nakup (Checkout) → podaljšanje → preklic ob koncu obdobja → konec; zamujen star dogodek ne vrne dostopa",
  withEnv(() =>
    withServer(async (ctx) => {
      const { stripe, store, hook } = ctx;
      const { a, parent, ask, acc } = await account(ctx, "narocnina@poti.si");
      assert.equal(await ask(), 200);
      assert.equal(await ask(), 429, "brezplačni paket: drugo vprašanje danes ni dovoljeno");

      // Nakup: Checkout → checkout.session.completed (Stripe naročnino prebere z GET /subscriptions/:id).
      const co = await a("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", ...OK } });
      assert.equal(co.status, 200, JSON.stringify(co.body));
      const s = lastSession(stripe);
      const plan = s["line_items[0][price]"].replace(/^price_/, "");
      const meta = { parent_id: String(parent.id), parent_uid: s["metadata[parent_uid]"] };
      const customer = customerOf(store, parent.id);
      const p1 = now() + 30 * DAY;
      // Oblika API 2024-06-20 (Stripe-Version v server/accounts/stripe.js): konec obdobja na naročnini, ne na postavki.
      const sub = (extra = {}) => ({ id: "sub_1", object: "subscription", customer, created: now(), status: "active", cancel_at_period_end: false, metadata: meta, current_period_end: p1, items: { data: [{ price: { lookup_key: plan } }] }, ...extra });
      stripe.state.subs.sub_1 = sub();
      await hook("checkout.session.completed", { id: "cs_1", object: "checkout.session", created: now(), customer, subscription: "sub_1", payment_status: "paid", metadata: meta, client_reference_id: String(parent.id) });
      let ac = await acc();
      assert.equal(ac.access.tier, "paid", "po nakupu: plačan dostop");
      assert.equal(ac.parent.subscription.plan, plan);
      assert.equal(Date.parse(ac.parent.subscription.period_end), p1 * 1000);
      assert.equal(await ask(), 200, "po nakupu: vprašanja spet gredo");
      const staro = sub(); // dogodek tega stanja pride pozneje še enkrat (zamujen)

      // Podaljšanje: invoice.paid za novo obdobje + customer.subscription.updated z novim koncem obdobja.
      const p2 = p1 + 30 * DAY;
      stripe.state.subs.sub_1 = sub({ current_period_end: p2 });
      await hook("invoice.paid", { id: "in_2", customer, subscription: "sub_1", currency: "eur", amount_paid: 1399, lines: { data: [{ amount: 1399, period: { start: p1, end: p2 } }] } });
      await hook("customer.subscription.updated", stripe.state.subs.sub_1);
      ac = await acc();
      assert.equal(ac.access.tier, "paid");
      assert.equal(Date.parse(ac.parent.subscription.period_end), p2 * 1000, "po podaljšanju: nov konec obdobja");

      // Preklic ob koncu obdobja: dostop ostane do konca plačanega obdobja.
      stripe.state.subs.sub_1 = sub({ cancel_at_period_end: true, current_period_end: p2 });
      await hook("customer.subscription.updated", stripe.state.subs.sub_1);
      ac = await acc();
      assert.equal(ac.access.tier, "paid", "preklicana naročnina velja do konca obdobja");
      assert.equal(ac.parent.subscription.cancel_at_period_end, true);
      assert.equal(await ask(), 200);

      // Konec obdobja: Stripe pošlje customer.subscription.deleted → brezplačni paket.
      stripe.state.subs.sub_1 = sub({ status: "canceled", cancel_at_period_end: true, ended_at: now(), current_period_end: p2 });
      await hook("customer.subscription.deleted", stripe.state.subs.sub_1);
      ac = await acc();
      assert.equal(ac.access.tier, "free", "po koncu naročnine: brezplačni paket");
      assert.equal(await ask(), 429, "po koncu naročnine: spet brezplačna meja vprašanj");

      // Zamujen dogodek starega stanja (active) po koncu: strežnik prebere trenutno stanje, dostopa ne vrne.
      await hook("customer.subscription.updated", staro);
      assert.equal((await acc()).access.tier, "free", "zamujen star dogodek ne vrne dostopa");
    }),
  ),
);

// Naročnina, kot jo pusti nakup: aktivna, plačan račun za tekoče obdobje.
async function subscribe({ stripe, store, hook }, { a, parent }, { amount = 1399 } = {}) {
  assert.equal((await a("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", ...OK } })).status, 200);
  const s = lastSession(stripe);
  const plan = s["line_items[0][price]"].replace(/^price_/, "");
  const meta = { parent_id: String(parent.id), parent_uid: s["metadata[parent_uid]"] };
  const customer = customerOf(store, parent.id);
  const start = now() - DAY;
  const end = start + 30 * DAY;
  const sub = (extra = {}) => ({ id: "sub_1", object: "subscription", customer, created: start, status: "active", cancel_at_period_end: false, metadata: meta, current_period_start: start, current_period_end: end, items: { data: [{ price: { lookup_key: plan } }] }, ...extra });
  stripe.state.subs.sub_1 = sub();
  await hook("checkout.session.completed", { id: "cs_1", object: "checkout.session", created: now(), customer, subscription: "sub_1", payment_status: "paid", metadata: meta });
  const invoice = { id: "in_1", customer, subscription: "sub_1", currency: "eur", amount_paid: amount, lines: { data: [{ amount, period: { start, end } }] } };
  await hook("invoice.paid", invoice);
  return { customer, sub, invoice, plan };
}

test(
  "naročnina: neuspelo plačilo → e-pošta enkrat, dostop v odlogu → po odlogu brezplačni paket → plačilo vrne dostop",
  withEnv(() =>
    withServer(async (ctx) => {
      const { stripe, store, hook } = ctx;
      const acct = await account(ctx, "neuspelo@poti.si");
      const { customer, sub } = await subscribe(ctx, acct);
      assert.equal((await acct.acc()).access.tier, "paid");
      const mails = () => stripe.calls.filter((c) => c.host === "api.resend.com").length;
      const pred = mails();

      // Kartica zavrnjena: invoice.payment_failed (Stripe ga ponovi ob vsakem poskusu) + naročnina past_due.
      const fail = { id: "in_2", customer, subscription: "sub_1", amount_due: 1399, attempt_count: 1 };
      await hook("invoice.payment_failed", fail);
      await hook("invoice.payment_failed", { ...fail, attempt_count: 2 });
      assert.equal(mails() - pred, 1, "e-pošta o neuspelem plačilu samo enkrat za isti račun");
      stripe.state.subs.sub_1 = sub({ status: "past_due" });
      await hook("customer.subscription.updated", stripe.state.subs.sub_1);
      assert.equal((await acct.acc()).access.tier, "paid", "v odlogu dostop ostane");
      assert.equal(await acct.ask(), 200);
      assert.equal(await acct.ask(), 200, "v odlogu velja plačana meja vprašanj, ne brezplačna");

      // Odlog mine (čas premaknemo v bazi): brezplačni paket.
      store.db.prepare("UPDATE parents SET past_due_since = datetime('now','-30 days') WHERE id = ?").run(acct.parent.id);
      assert.equal((await acct.acc()).access.tier, "free", "po odlogu: brezplačni paket");
      assert.equal(await acct.ask(), 429);

      // Plačilo uspe ob ponovnem poskusu: invoice.paid + active → dostop nazaj, odlog ponastavljen.
      stripe.state.subs.sub_1 = sub();
      await hook("invoice.paid", { id: "in_2", customer, subscription: "sub_1", currency: "eur", amount_paid: 1399, lines: { data: [{ amount: 1399, period: { start: now(), end: now() + 30 * DAY } }] } });
      await hook("customer.subscription.updated", stripe.state.subs.sub_1);
      assert.equal((await acct.acc()).access.tier, "paid", "po plačilu: dostop nazaj");
      assert.equal(store.db.prepare("SELECT past_due_since FROM parents WHERE id = ?").get(acct.parent.id).past_due_since, null);
      assert.equal(await acct.ask(), 200);
    }),
  ),
);

test("naročnina: delno in polno vračilo takoj znižata mejo AI, preklic po vračilu vzame dostop", async () => {
  await withServer(async (ctx) => {
    const { stripe, hook, app } = ctx;
    const acct = await account(ctx, "vracilo@poti.si");
    const { customer, sub, invoice } = await subscribe(ctx, acct);
    const cap = () => app.locals.usage.capsFor(acct.kid.id).find((c) => /^(s|pool):/.test(c.key))?.usd ?? 0;
    const polna = cap();
    assert.ok(polna > 0, "naročnina ima mejo AI");

    // Delno vračilo (npr. odstop sredi obdobja): polovica plačila.
    await hook("charge.refunded", { id: "ch_1", customer, invoice: invoice.id, payment_intent: "pi_s1", amount: 1399, amount_refunded: 700, refunded: false });
    const pol = cap();
    assert.ok(pol < polna - 1e-6, `delno vračilo ne zniža meje: ${polna} → ${pol}`);
    // Polno vračilo istega plačila.
    await hook("charge.refunded", { id: "ch_1", customer, invoice: invoice.id, payment_intent: "pi_s1", amount: 1399, amount_refunded: 1399, refunded: true });
    const nic = cap();
    assert.ok(nic < pol - 1e-6, `polno vračilo ne zniža meje še bolj: ${pol} → ${nic}`);
    assert.equal((await acct.acc()).access.tier, "paid", "vračilo samo ne prekliče naročnine (skrbnik jo prekliče v Stripu)");

    // Skrbnik prekliče naročnino takoj: customer.subscription.deleted → brezplačni paket.
    stripe.state.subs.sub_1 = sub({ status: "canceled", ended_at: now() });
    await hook("customer.subscription.deleted", stripe.state.subs.sub_1);
    assert.equal((await acct.acc()).access.tier, "free");
  });
});

test(
  "paket pred testom: nakup samo prek webhooka, dvojnik in zamujen async dogodek ne podaljšata, polno vračilo konča paket",
  withEnv(() =>
    withServer(async (ctx) => {
      const { stripe, store, hook } = ctx;
      const acct = await account(ctx, "paket@poti.si");
      await acct.a(`/api/students/${acct.kid.id}/schedule`, { method: "PUT", body: { events: [{ date: day(9), kind: "test", name: "Test iz odvodov" }] } });
      const co = await acct.a("/api/billing/pass", { method: "POST", body: { student_id: acct.kid.id, days: 14, test_date: day(9), test_name: "Test iz odvodov", ...OK } });
      assert.equal(co.status, 200, JSON.stringify(co.body));
      const s = lastSession(stripe);
      const passId = Number(s["metadata[pass_id]"]);
      assert.equal(await acct.ask(), 200);
      assert.equal(await acct.ask(), 429, "pred plačilom: brezplačni paket");

      // Kupec zapre zavihek pred vrnitvijo v aplikacijo: dostop vklopi samo webhook.
      const session = { id: "cs_p", object: "checkout.session", created: now(), payment_status: "paid", payment_intent: "pi_p", metadata: { kind: "pass", pass_id: String(passId), parent_id: String(acct.parent.id), parent_uid: s["metadata[parent_uid]"] } };
      await hook("checkout.session.completed", session, "evt_p1");
      const ac = await acct.acc();
      assert.equal(ac.children[0].premium, true, "po plačilu: poln dostop");
      assert.equal(ac.children[0].pass.days, 14);
      assert.equal(await acct.ask(), 200);
      const ends = store.db.prepare("SELECT ends_at FROM passes WHERE id = ?").get(passId).ends_at;

      // Isti dogodek znova (Stripe ponovi dostavo) in pozneje še async_payment_succeeded iste seje: brez spremembe.
      assert.equal((await hook("checkout.session.completed", session, "evt_p1")).duplicate, true);
      await hook("checkout.session.async_payment_succeeded", session);
      assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM passes WHERE status = 'active'").get().n, 1);
      assert.equal(store.db.prepare("SELECT ends_at FROM passes WHERE id = ?").get(passId).ends_at, ends, "dvojnik ne podaljša paketa");

      // Polno vračilo (amount = amount_refunded): paket se konča takoj.
      await hook("charge.refunded", { id: "ch_p", payment_intent: "pi_p", amount: 849, amount_refunded: 849, refunded: true });
      assert.equal(store.db.prepare("SELECT status FROM passes WHERE id = ?").get(passId).status, "refunded");
      assert.equal((await acct.acc()).children[0].premium, false, "po vračilu: brez polnega dostopa");
      assert.equal(await acct.ask(), 429);
    }),
  ),
);

test("dokup pogovorov: nakup doda kredit, vračilo ga odvzame, spor pri aktivnem kreditu ga odvzame", async () => {
  await withServer(async (ctx) => {
    const { stripe, store, hook, app } = ctx;
    const acct = await account(ctx, "dokup@poti.si");
    const balance = () => app.locals.credits?.balance?.(acct.parent.id) ?? store.db.prepare("SELECT COALESCE(SUM(credit_usd),0) AS s FROM ai_credit_buys WHERE parent_id = ? AND status = 'active'").get(acct.parent.id).s;
    const buy = async (pi) => {
      const r = await acct.a("/api/billing/credit", { method: "POST", body: { pack: "k10", ...OK } });
      assert.equal(r.status, 200, JSON.stringify(r.body));
      const s = lastSession(stripe);
      const meta = { kind: "credit", credit_id: s["metadata[credit_id]"], parent_id: String(acct.parent.id), parent_uid: s["metadata[parent_uid]"] };
      await hook("checkout.session.completed", { id: "cs_" + pi, object: "checkout.session", created: now(), payment_status: "paid", payment_intent: pi, metadata: meta });
      return Number(meta.credit_id);
    };
    const status = (id) => store.db.prepare("SELECT status FROM ai_credit_buys WHERE id = ?").get(id).status;
    assert.equal(balance(), 0);

    const k1 = await buy("pi_k1");
    assert.equal(status(k1), "active");
    const po = balance();
    assert.ok(po > 0, "po nakupu: kredit na računu");
    // Vračilo: kredit se odvzame.
    await hook("charge.refunded", { id: "ch_k1", payment_intent: "pi_k1", amount: 1000, amount_refunded: 1000, refunded: true });
    assert.equal(status(k1), "refunded");
    assert.ok(balance() < 1e-9, `po vračilu ostane kredit ${balance()}`);

    // Spor (chargeback) pri aktivnem kreditu: kredit se odvzame, naročnina (je ni) ostane nedotaknjena.
    const k2 = await buy("pi_k2");
    assert.ok(balance() > 0);
    await hook("charge.dispute.created", { id: "dp_k2", payment_intent: "pi_k2", charge: "ch_k2" });
    assert.equal(status(k2), "refunded");
    assert.ok(balance() < 1e-9);
  });
});

test("darilna koda: dvojni dogodek ustvari eno kodo, prejemnik dobi dostop, spor pri aktivni kodi ga vzame", async () => {
  await withServer(async (ctx) => {
    const { stripe, store, hook } = ctx;
    const kupec = await account(ctx, "kupec@poti.si");
    const r = await kupec.a("/api/billing/gift", { method: "POST", body: OK });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    const s = lastSession(stripe);
    const giftId = Number(s["metadata[gift_id]"]);
    const session = { id: "cs_g", object: "checkout.session", created: now(), payment_status: "paid", payment_intent: "pi_g", metadata: { kind: "gift", gift_id: String(giftId), parent_id: String(kupec.parent.id), parent_uid: s["metadata[parent_uid]"] } };
    await hook("checkout.session.completed", session, "evt_g1");
    const prva = store.db.prepare("SELECT code FROM gifts WHERE id = ?").get(giftId).code;
    assert.equal((await hook("checkout.session.completed", session, "evt_g1")).duplicate, true);
    await hook("checkout.session.async_payment_succeeded", session);
    const g = store.db.prepare("SELECT status, code FROM gifts WHERE id = ?").get(giftId);
    assert.equal(g.code, prva, "zamujen dogodek ne zamenja že poslane kode");
    assert.equal(g.status, "paid");
    assert.ok(g.code);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM gifts WHERE code IS NOT NULL").get().n, 1, "ena koda");

    const prejemnik = await account(ctx, "prejemnik@poti.si");
    const vpis = await prejemnik.a("/api/account/promo", { method: "POST", body: { code: g.code } });
    assert.equal(vpis.status, 200, JSON.stringify(vpis.body));
    assert.equal((await prejemnik.acc()).access.tier, "gift", "prejemnik ima dostop iz darila");

    await hook("charge.dispute.created", { id: "dp_g", payment_intent: "pi_g", charge: "ch_g" });
    assert.equal(store.db.prepare("SELECT status FROM gifts WHERE id = ?").get(giftId).status, "disputed");
    assert.equal((await prejemnik.acc()).access.tier, "free", "po sporu: prejemnik nima več dostopa");
  });
});

test("naročnina: preklic in nato nadaljevanje (pred koncem obdobja); neuspešni ponovni poskusi končajo z unpaid → brezplačni paket", async () => {
  await withServer(async (ctx) => {
    const { stripe, hook } = ctx;
    const acct = await account(ctx, "nadaljuj@poti.si");
    const { customer, sub } = await subscribe(ctx, acct);
    // Kupec v portalu prekliče, nato si premisli (»Renew«): cancel_at_period_end spet false.
    stripe.state.subs.sub_1 = sub({ cancel_at_period_end: true });
    await hook("customer.subscription.updated", stripe.state.subs.sub_1);
    assert.equal((await acct.acc()).parent.subscription.cancel_at_period_end, true);
    stripe.state.subs.sub_1 = sub();
    await hook("customer.subscription.updated", stripe.state.subs.sub_1);
    let ac = await acct.acc();
    assert.equal(ac.parent.subscription.cancel_at_period_end, false, "nadaljevanje odstrani preklic");
    assert.equal(ac.access.tier, "paid");

    // Vsi ponovni poskusi plačila spodletijo: Stripe naročnino označi unpaid (ali jo prekliče) → brez odloga.
    await hook("invoice.payment_failed", { id: "in_9", customer, subscription: "sub_1", amount_due: 1399, attempt_count: 4 });
    stripe.state.subs.sub_1 = sub({ status: "unpaid" });
    await hook("customer.subscription.updated", stripe.state.subs.sub_1);
    ac = await acct.acc();
    assert.equal(ac.access.tier, "free", "unpaid: brezplačni paket");
    stripe.state.subs.sub_1 = sub({ status: "canceled", ended_at: now() });
    await hook("customer.subscription.deleted", stripe.state.subs.sub_1);
    assert.equal((await acct.acc()).access.tier, "free");
  });
});

test("izbris računa: prekliče naročnino in nato izbriše stranko v Stripu; ob odprtem odstopu stranka ostane", async () => {
  await withServer(async (ctx) => {
    const { stripe, store } = ctx;
    const customerDeletes = () => stripe.calls.filter((c) => c.method === "DELETE" && c.path.startsWith("/v1/customers/")).map((c) => c.path);
    const settle = async (n) => {
      for (let i = 0; i < 50 && customerDeletes().length < n; i++) await new Promise((r) => setTimeout(r, 10));
    };

    // Plačan račun: naročnina se prekliče, račun izbriše, stranka v Stripu se izbriše v ozadju.
    const acct = await account(ctx, "izbris.stranke@poti.si");
    const { customer } = await subscribe(ctx, acct);
    assert.ok(customer);
    assert.equal((await acct.a("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
    await settle(1);
    assert.ok(stripe.calls.some((c) => c.method === "DELETE" && c.path === "/v1/subscriptions/sub_1"));
    assert.deepEqual(customerDeletes(), [`/v1/customers/${customer}`]);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM parents WHERE stripe_customer_id = ?").get(customer).n, 0);

    // Odprt odstop od pogodbe (vračilo še ni končano): stranka ostane, skrbnik jo izbriše ročno po zaključku.
    const b = await account(ctx, "odprt.odstop@poti.si");
    store.db.prepare("UPDATE parents SET stripe_customer_id = 'cus_odstop' WHERE id = ?").run(b.parent.id);
    store.db
      .prepare("INSERT INTO withdrawals (parent_id, name, email, contract, contract_text, source, submitted_at) VALUES (?, 'B', 'odprt.odstop@poti.si', 'sub', 'naročnina', 'app', ?)")
      .run(b.parent.id, new Date().toISOString());
    assert.equal((await b.a("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);

    // Stripe ne odgovori pravilno: izbris računa vseeno uspe.
    const c = await account(ctx, "stripe.ne.dela@poti.si");
    store.db.prepare("UPDATE parents SET stripe_customer_id = 'cus_napaka' WHERE id = ?").run(c.parent.id);
    stripe.state.customerDown = true;
    assert.equal((await c.a("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
    await settle(2);
    assert.deepEqual(customerDeletes(), [`/v1/customers/${customer}`, "/v1/customers/cus_napaka"], "brez cus_odstop");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM parents WHERE id IN (?, ?)").get(b.parent.id, c.parent.id).n, 0);
  });
});
