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
import { ownsStripeObject, ownerMismatch, parentFromMeta, purchaseMismatch } from "../server/accounts/ponoven-id.js";

const SECRET = "whsec_test";
const YEAR = new Date().getFullYear();
const ADULT = "1985-04-12";
const TEEN = `${YEAR - 16}-01-10`;
const day = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

// Lažni Stripe + Resend. stripe.sessions / stripe.subs: kar vrneta GET /checkout/sessions/:id in /subscriptions/:id.
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

test("helpers: pass prices (j 2026-11-04, 75 % rule), pass length, grace period, code form", () => {
  assert.deepEqual(PASSES.map((p) => [p.days, p.amount]), [[7, 549], [14, 849]]);
  assert.equal(passForDaysLeft(0).days, 7);
  assert.equal(passForDaysLeft(6).days, 7);
  assert.equal(passForDaysLeft(7).days, 14);
  assert.equal(passForDaysLeft(13).days, 14);
  assert.equal(passForDaysLeft(14), null, "30-dnevnega paketa ni več (j 2026-11-04)");
  const now = Date.now();
  assert.equal(paidActive({ sub_status: "active" }, now), true);
  assert.equal(paidActive({ sub_status: "past_due", past_due_since: new Date(now - 2 * 86400000).toISOString() }, now), true);
  assert.equal(paidActive({ sub_status: "past_due", past_due_since: new Date(now - (GRACE_DAYS + 1) * 86400000).toISOString() }, now), false);
  assert.equal(paidActive({ sub_status: "canceled" }, now), false);
  assert.equal(parseCode({ code: "ab", days: 5, max_uses: 1 }).error !== undefined, true);
  assert.deepEqual(parseCode({ code: " pomlad-26 ", days: "30", max_uses: "50", max_model: "sonnet" }).value, {
    code: "POMLAD-26",
    days: 30,
    seats: 1,
    max_model: "sonnet",
    max_uses: 50,
    valid_until: null,
    note: "",
  });
  assert.match(parseCode({ code: "KODA", days: 900, max_uses: 1 }).error, /730/);
});

test("aktivacijske kode v bazi: skrbnik ustvari in izklopi kodo, koda določa profile in model", async () => {
  process.env.EVKLID_ADMIN_EMAILS = "skrbnik@kod.si";
  process.env.EVKLID_PROMO_CODE = "EVKLID3X"; // A2: koda je vklopljena samo z nastavitvijo
  try {
    await withServer(async ({ client, stripe, store }) => {
      const admin = client();
      await registerVerified(admin, stripe, "skrbnik@kod.si");
      const list = await admin("/api/admin/promo-codes");
      assert.equal(list.status, 200);
      assert.deepEqual(list.body.codes.map((c) => [c.code, c.from_env, c.max_model]), [["EVKLID3X", true, "sonnet"]]);
      const made = await admin("/api/admin/promo-codes", { method: "POST", body: { code: "pomlad", days: 30, seats: 2, max_uses: 1, max_model: "" } });
      assert.equal(made.status, 201, JSON.stringify(made.body));
      assert.equal((await admin("/api/admin/promo-codes", { method: "POST", body: { code: "POMLAD", days: 30, max_uses: 1 } })).status, 409);
      assert.ok((await admin("/api/account")).body.promo.codes.some((c) => c.code === "POMLAD"));

      // Navaden starš ne vidi in ne ustvarja kod.
      const a = client();
      const parent = await registerVerified(a, stripe, "ana@kod.si");
      assert.equal((await a("/api/admin/promo-codes")).status, 403);
      assert.equal((await a("/api/admin/promo-codes", { method: "POST", body: { code: "MOJA", days: 9, max_uses: 9 } })).status, 403);
      assert.equal((await a("/api/account")).body.promo.codes, undefined);

      // Nova koda: 2 profila, brez omejitve modela; ena uporaba.
      const r = await a("/api/account/promo", { method: "POST", body: { code: "pomlad" } });
      assert.equal(r.status, 200, JSON.stringify(r.body));
      store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(parent.id);
      const acc = (await a("/api/account")).body;
      assert.deepEqual([acc.access.tier, acc.access.seats, acc.promo.seats], ["promo", 2, 2]);
      const b = client();
      await registerVerified(b, stripe, "bor@kod.si");
      assert.equal((await b("/api/account/promo", { method: "POST", body: { code: "POMLAD" } })).status, 410);

      // Izklopljena koda ni več veljavna, tudi po ponovnem vpisu kode iz .env ostane izklopljena.
      assert.equal((await admin("/api/admin/promo-codes/EVKLID3X/active", { method: "POST", body: { active: false } })).status, 200);
      const off = await b("/api/account/promo", { method: "POST", body: { code: "EVKLID3X" } });
      assert.equal(off.status, 400);
      assert.match(off.body.error, /ni veljavna/);
      const { createPromo, promoConfig } = await import("../server/accounts/promo.js");
      createPromo(store.db, promoConfig({ EVKLID_PROMO_CODE: "EVKLID3X" }));
      assert.equal(store.db.prepare("SELECT active FROM promo_codes WHERE code = 'EVKLID3X'").get().active, 0);
      // Koda, ki je ni več v .env (ali EVKLID_PROMO_CODE=off), se ob zagonu izklopi.
      store.db.prepare("UPDATE promo_codes SET active = 1 WHERE code = 'EVKLID3X'").run();
      createPromo(store.db, promoConfig({ EVKLID_PROMO_CODE: "off" }));
      assert.equal(store.db.prepare("SELECT active FROM promo_codes WHERE code = 'EVKLID3X'").get().active, 0);
      assert.equal(store.db.prepare("SELECT active FROM promo_codes WHERE code = 'POMLAD'").get().active, 1);
      assert.equal((await admin("/api/admin/promo-codes/NI-TAKE/active", { method: "POST", body: { active: true } })).status, 404);
    });
  } finally {
    delete process.env.EVKLID_ADMIN_EMAILS;
    delete process.env.EVKLID_PROMO_CODE;
  }
});

test("paket pred testom: ponudba samo brez naročnine, potrditve, plačilo, poln dostop, meja AI in vračilo", async () => {
  process.env.EVKLID_FREE_DAILY_QUESTIONS = "1";
  try {
    await withServer(async ({ client, stripe, store, hook }) => {
      const a = client();
      const parent = await registerVerified(a, stripe, "cene@paket.si");
      const kid = (await a("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 16, consent: true } })).body;
      store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();

      // Brez testa v urniku ni ponudbe.
      let offer = (await a(`/api/students/${kid.id}/pass-offer`)).body;
      assert.equal(offer.offer, null);
      assert.deepEqual(offer.passes.map((p) => p.amount), [549, 849]);
      // Test čez 9 dni: predlog je paket za 14 dni.
      await addTest(a, kid.id, day(9));
      offer = (await a(`/api/students/${kid.id}/pass-offer`)).body;
      assert.equal(offer.offer.test.name, "Test iz ulomkov");
      assert.equal(offer.offer.suggested, 14);
      assert.equal(offer.offer.pay_link, false);

      // Brez obeh potrditev ni plačila; test dlje, kot ga paket pokrije, ni dovoljen.
      const body = { student_id: kid.id, days: 14, test_date: day(9), test_name: "Test iz ulomkov" };
      const noConsent = await a("/api/billing/pass", { method: "POST", body });
      assert.equal(noConsent.status, 400);
      assert.equal(noConsent.body.consent, true);
      assert.equal((await a("/api/billing/pass", { method: "POST", body: { ...body, test_date: day(40), adult: true, withdrawal: true } })).status, 400);
      // 30-dnevnega paketa ni več; test čez 20 dni paket še ne pokrije (najdaljši je 14 dni).
      assert.equal((await a("/api/billing/pass", { method: "POST", body: { ...body, days: 30, test_date: day(20), adult: true, withdrawal: true } })).status, 400);
      assert.equal((await a("/api/billing/pass", { method: "POST", body: { ...body, test_date: day(20), adult: true, withdrawal: true } })).status, 400);
      assert.equal((await a("/api/billing/pass", { method: "POST", body: { ...body, days: 10, adult: true, withdrawal: true } })).status, 400);

      const co = await a("/api/billing/pass", { method: "POST", body: { ...body, adult: true, withdrawal: true } });
      assert.equal(co.status, 200, JSON.stringify(co.body));
      const session = stripe.calls.filter((c) => c.path === "/v1/checkout/sessions" && c.method === "POST").at(-1);
      assert.equal(session.body.mode, "payment");
      assert.equal(session.body["line_items[0][price_data][unit_amount]"], "849");
      assert.equal(session.body["line_items[0][price_data][currency]"], "eur");
      assert.equal(session.body["metadata[kind]"], "pass");
      const passId = Number(session.body["metadata[pass_id]"]);
      assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM billing_consents WHERE kind = 'pass'").get().n, 1);

      // Pred plačilom še ni polnega dostopa (brezplačni paket: 1 vprašanje na dan).
      const conv = (await a(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
      const ask = (t) => a(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: t } });
      assert.equal((await ask("prvo")).status, 200);
      assert.equal((await ask("drugo")).status, 429);

      // Vrnitev s plačilne strani: plačano → paket je aktiven (ponovljena potrditev ga ne podaljša).
      stripe.state.sessions.cs_paid = { id: "cs_paid", payment_status: "paid", payment_intent: "pi_1", metadata: { kind: "pass", pass_id: String(passId), parent_id: String(parent.id) } };
      const conf = await a("/api/billing/pass/confirm", { method: "POST", body: { session_id: "cs_paid" } });
      assert.equal(conf.status, 200);
      assert.equal(conf.body.paid, true);
      const ends = store.db.prepare("SELECT ends_at FROM passes WHERE id = ?").get(passId).ends_at;
      await a("/api/billing/pass/confirm", { method: "POST", body: { session_id: "cs_paid" } });
      assert.equal(store.db.prepare("SELECT ends_at FROM passes WHERE id = ?").get(passId).ends_at, ends);
      const left = (Date.parse(ends) - Date.now()) / 86400000;
      assert.ok(left > 13.9 && left <= 14, String(left));
      assert.equal((await ask("tretje")).status, 200);
      const acc = (await a("/api/account")).body;
      assert.equal(acc.children[0].premium, true);
      assert.equal(acc.children[0].pass.days, 14);
      // Aktiven paket: ni nove ponudbe in ni drugega nakupa.
      assert.equal((await a(`/api/students/${kid.id}/pass-offer`)).body.active.days, 14);
      assert.equal((await a("/api/billing/pass", { method: "POST", body: { ...body, adult: true, withdrawal: true } })).status, 409);
      // Tuj starš ne more potrditi tujega plačila.
      const b = client();
      await registerVerified(b, stripe, "tuj@paket.si");
      assert.equal((await b("/api/billing/pass/confirm", { method: "POST", body: { session_id: "cs_paid" } })).status, 404);
      assert.equal((await b(`/api/students/${kid.id}/pass-offer`)).status, 404);

      // Meja AI paketa (14 dni: 1,5 $) porabljena → do konca paketa velja brezplačni paket.
      store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-opus', 'chat', 1.6)").run(kid.id);
      assert.equal((await a("/api/account")).body.children[0].premium, false);
      store.db.prepare("DELETE FROM usage WHERE cost_usd = 1.6").run();

      // Vračilo prek webhooka: paket se takoj konča.
      assert.equal((await hook({ id: "evt_r1", type: "charge.refunded", data: { object: { payment_intent: "pi_1", refunded: false, amount_refunded: 300 } } })).status, 200);
      assert.equal(store.db.prepare("SELECT status FROM passes WHERE id = ?").get(passId).status, "refunded");
      assert.equal((await a("/api/account")).body.children[0].premium, false);

      // Z naročnino se paket ne ponudi in ga ni mogoče kupiti (j 2026-10-30).
      store.db.prepare("UPDATE parents SET sub_status = 'active', sub_seats = 1 WHERE id = ?").run(parent.id);
      assert.equal((await a(`/api/students/${kid.id}/pass-offer`)).body.offer, null);
      const sub = await a("/api/billing/pass", { method: "POST", body: { ...body, adult: true, withdrawal: true } });
      assert.equal(sub.status, 409);
      assert.equal(sub.body.subscription, true);
    });
  } finally {
    delete process.env.EVKLID_FREE_DAILY_QUESTIONS;
  }
});

test("paket pred testom: preizkus, ki pokrije test, ponudbe ne prikaže; webhook vklopi paket", async () => {
  await withServer(async ({ client, stripe, store, hook }) => {
    const a = client();
    const parent = await registerVerified(a, stripe, "pre@paket.si");
    const kid = (await a("/api/students", { method: "POST", body: { name: "Mia", birth_year: YEAR - 16, consent: true } })).body;
    await addTest(a, kid.id, day(2));
    // 7-dnevni preizkus traja dlje kot do dneva po testu.
    assert.equal((await a(`/api/students/${kid.id}/pass-offer`)).body.offer, null);
    await addTest(a, kid.id, day(12));
    assert.equal((await a(`/api/students/${kid.id}/pass-offer`)).body.offer.suggested, 14);

    await a("/api/billing/pass", { method: "POST", body: { student_id: kid.id, days: 14, test_date: day(12), adult: true, withdrawal: true } });
    const passId = store.db.prepare("SELECT id FROM passes").get().id;
    const evt = {
      id: "evt_p1",
      type: "checkout.session.completed",
      data: { object: { id: "cs_x", payment_status: "paid", payment_intent: "pi_9", metadata: { kind: "pass", pass_id: String(passId), parent_id: String(parent.id) } } },
    };
    assert.equal((await hook(evt)).status, 200);
    assert.equal(store.db.prepare("SELECT status, payment_id FROM passes WHERE id = ?").get(passId).payment_id, "pi_9");
    // Isti dogodek drugič: obdelan samo enkrat.
    const again = await hook(evt);
    assert.equal(again.body.duplicate, true);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM billing_events WHERE processed_at IS NOT NULL").get().n, 1);
    // Spor: paket se konča.
    await hook({ id: "evt_d1", type: "charge.dispute.created", data: { object: { payment_intent: "pi_9", charge: "ch_1" } } });
    assert.equal(store.db.prepare("SELECT status FROM passes WHERE id = ?").get(passId).status, "disputed");
  });
});

test("povezava za starše: najstnik ne plača sam, starš pregleda in plača brez računa", async () => {
  await withServer(async ({ client, stripe, store }) => {
    const teen = client();
    const parent = await registerVerified(teen, stripe, "dijak@paket.si", { birth_date: TEEN });
    const kid = (await teen("/api/students", { method: "POST", body: { name: "Nik", self: true, consent: true } })).body;
    assert.ok(kid.id, JSON.stringify(kid));
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();

    // Mladoletni imetnik: naročnine in paketa ne more plačati sam.
    const own = await teen("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", adult: true, withdrawal: true } });
    assert.equal(own.status, 403);
    assert.equal(own.body.pay_link, true);
    await addTest(teen, kid.id, day(5));
    assert.equal((await teen(`/api/students/${kid.id}/pass-offer`)).body.offer.pay_link, true);
    assert.equal((await teen("/api/billing/pass", { method: "POST", body: { student_id: kid.id, days: 7, test_date: day(5), adult: true, withdrawal: true } })).status, 403);

    // Povezava za naročnino.
    const link = await teen("/api/billing/pay-link", { method: "POST", body: { kind: "sub", seats: 1, interval: "month" } });
    assert.equal(link.status, 201, JSON.stringify(link.body));
    const token = new URL(link.body.url).searchParams.get("t");
    const mom = client();
    const view = await mom(`/api/pay/${token}`);
    assert.equal(view.status, 200);
    assert.equal(view.body.kind, "sub");
    assert.equal(view.body.name, "Nik");
    assert.equal(view.body.plan.amount, 999);
    assert.ok(!JSON.stringify(view.body).includes("dijak@paket.si"), "e-naslov ne sme biti viden");
    assert.equal((await mom("/api/pay/napacen-zeton-ki-ne-obstaja-123")).status, 404);

    // Brez e-naslova ali potrditev ne gre.
    assert.equal((await mom(`/api/pay/${token}/checkout`, { method: "POST", body: { email: "x", adult: true, withdrawal: true } })).status, 400);
    assert.equal((await mom(`/api/pay/${token}/checkout`, { method: "POST", body: { email: "mama@primer.si", adult: true } })).status, 400);
    const co = await mom(`/api/pay/${token}/checkout`, { method: "POST", body: { email: "mama@primer.si", adult: true, withdrawal: true } });
    assert.equal(co.status, 200, JSON.stringify(co.body));
    const session = stripe.calls.filter((c) => c.path === "/v1/checkout/sessions" && c.method === "POST").at(-1);
    assert.equal(session.body.mode, "subscription");
    assert.equal(session.body.customer_email, "mama@primer.si");
    assert.equal(session.body["line_items[0][price]"], "price_evklid_1_month");
    assert.equal(store.db.prepare("SELECT payer_email FROM billing_consents WHERE kind = 'pay_link_sub'").get().payer_email, "mama@primer.si");

    // Vrnitev s plačilne strani: naročnina je aktivna, plačnikova stranka postane stranka računa.
    stripe.state.subs.sub_7 = { id: "sub_7", customer: "cus_mama", status: "active", items: { data: [{ price: { lookup_key: "evklid_1_month" }, current_period_end: 1893456000 }] } };
    stripe.state.sessions.cs_sub = { id: "cs_sub", status: "complete", customer: "cus_mama", subscription: "sub_7", metadata: { parent_id: String(parent.id), parent_uid: session.body["metadata[parent_uid]"], pay_link: session.body["metadata[pay_link]"] } };
    assert.ok(session.body["metadata[parent_uid]"] && session.body["subscription_data[metadata][parent_uid]"], "uid tudi pri povezavi za starše");
    const done = await mom(`/api/pay/${token}/confirm`, { method: "POST", body: { session_id: "cs_sub" } });
    assert.equal(done.status, 200, JSON.stringify(done.body));
    assert.equal(done.body.paid, true);
    const row = store.db.prepare("SELECT stripe_customer_id, sub_status FROM parents WHERE id = ?").get(parent.id);
    assert.deepEqual([row.stripe_customer_id, row.sub_status], ["cus_mama", "active"]);
    assert.equal((await teen("/api/account")).body.access.tier, "paid");
    assert.equal((await mom(`/api/pay/${token}/checkout`, { method: "POST", body: { email: "mama@primer.si", adult: true, withdrawal: true } })).status, 409);
    // Z naročnino povezave za paket ni več.
    assert.equal((await teen("/api/billing/pay-link", { method: "POST", body: { kind: "pass", student_id: kid.id, days: 7, test_date: day(5) } })).status, 409);

    // Potekla povezava.
    store.db.prepare("UPDATE pay_links SET expires_at = '2020-01-01T00:00:00Z'").run();
    const old = await mom(`/api/pay/${token}`);
    assert.equal(old.status, 404);
    assert.equal(old.body.expired, true);
  });
});

test("povezava za starše: paket pred testom", async () => {
  await withServer(async ({ client, stripe, store }) => {
    const teen = client();
    const parent = await registerVerified(teen, stripe, "dijakinja@paket.si", { birth_date: TEEN });
    const kid = (await teen("/api/students", { method: "POST", body: { name: "Ema", self: true, consent: true } })).body;
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();
    const link = await teen("/api/billing/pay-link", { method: "POST", body: { kind: "pass", student_id: kid.id, days: 7, test_date: day(4), test_name: "Kontrolna iz kemije" } });
    assert.equal(link.status, 201, JSON.stringify(link.body));
    const token = new URL(link.body.url).searchParams.get("t");
    const dad = client();
    const view = (await dad(`/api/pay/${token}`)).body;
    assert.deepEqual([view.kind, view.name, view.plan.amount, view.test.name], ["pass", "Ema", 549, "Kontrolna iz kemije"]);
    await dad(`/api/pay/${token}/checkout`, { method: "POST", body: { email: "oce@primer.si", adult: true, withdrawal: true } });
    const first = stripe.calls.filter((c) => c.path === "/v1/checkout/sessions" && c.method === "POST").at(-1);
    // Drugi klik (npr. v drugem zavihku) uporabi isti neplačan paket: dve plačili ne dasta dveh paketov.
    await dad(`/api/pay/${token}/checkout`, { method: "POST", body: { email: "oce@primer.si", adult: true, withdrawal: true, lang: "en" } });
    const session = stripe.calls.filter((c) => c.path === "/v1/checkout/sessions" && c.method === "POST").at(-1);
    assert.equal(session.body["metadata[pass_id]"], first.body["metadata[pass_id]"]);
    assert.match(store.db.prepare("SELECT text FROM billing_consents ORDER BY rowid DESC").get().text, /\[jezik: en\]$/);
    assert.equal(session.body.mode, "payment");
    assert.equal(session.body.customer_email, "oce@primer.si");
    const passId = session.body["metadata[pass_id]"];
    stripe.state.sessions.cs_pp = { id: "cs_pp", payment_status: "paid", payment_intent: "pi_pp", metadata: { kind: "pass", pass_id: passId, parent_id: String(parent.id), pay_link: session.body["metadata[pay_link]"] } };
    // Zamudno plačilo (npr. SEPA) prispe po 48 urah, ko je paket že označen kot potekel: vseeno se vklopi.
    store.db.prepare("UPDATE passes SET status = 'expired' WHERE id = ?").run(Number(passId));
    const done = await dad(`/api/pay/${token}/confirm`, { method: "POST", body: { session_id: "cs_pp" } });
    assert.equal(done.body.paid, true);
    assert.equal((await teen("/api/account")).body.children[0].pass.days, 7);
    // Največ 5 odprtih povezav.
    for (let i = 0; i < 5; i++) await teen("/api/billing/pay-link", { method: "POST", body: { kind: "sub", seats: 1, interval: "month" } });
    assert.equal((await teen("/api/billing/pay-link", { method: "POST", body: { kind: "sub", seats: 1, interval: "month" } })).status, 429);
  });
});

test("neuspelo plačilo: e-pošta enkrat, poln dostop še 7 dni", async () => {
  await withServer(async ({ client, stripe, store, hook }) => {
    const a = client();
    const parent = await registerVerified(a, stripe, "kartica@paket.si");
    await a("/api/students", { method: "POST", body: { name: "Tim", birth_year: YEAR - 11, consent: true } });
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z', stripe_customer_id = 'cus_k' WHERE id = ?").run(parent.id);
    const sub = (status) => ({ id: "sub_k", customer: "cus_k", status, items: { data: [{ price: { lookup_key: "evklid_1_month" }, current_period_end: 1893456000 }] } });
    stripe.state.subs.sub_k = sub("past_due");
    await hook({ id: "evt_s1", type: "customer.subscription.updated", data: { object: sub("active") } });
    // Sveže stanje iz Stripa (past_due) ima prednost pred starejšim dogodkom.
    assert.equal(store.db.prepare("SELECT sub_status FROM parents WHERE id = ?").get(parent.id).sub_status, "past_due");
    assert.equal((await a("/api/account")).body.access.tier, "paid");
    const mails = () => stripe.calls.filter((c) => c.host === "api.resend.com" && /ni uspelo/.test(c.body.subject)).length;
    await hook({ id: "evt_f1", type: "invoice.payment_failed", data: { object: { id: "in_1", customer: "cus_k" } } });
    await hook({ id: "evt_f2", type: "invoice.payment_failed", data: { object: { id: "in_1", customer: "cus_k" } } });
    assert.equal(mails(), 1);
    store.db.prepare("UPDATE parents SET past_due_since = ? WHERE id = ?").run(new Date(Date.now() - 8 * 86400000).toISOString(), parent.id);
    assert.equal((await a("/api/account")).body.access.tier, "free");
    // Plačilo uspe: odlog se ponastavi.
    stripe.state.subs.sub_k = sub("active");
    await hook({ id: "evt_s2", type: "customer.subscription.updated", data: { object: sub("active") } });
    const row = store.db.prepare("SELECT sub_status, past_due_since FROM parents WHERE id = ?").get(parent.id);
    assert.deepEqual([row.sub_status, row.past_due_since], ["active", null]);
  });
});

test("dnevna opravila: usklajevanje, opomnik pred koncem kode in pred letno obnovitvijo, enkrat na dan", async () => {
  const store = openDb(":memory:");
  const stripe = fakeStripe();
  const api = mountAccounts(express(), store, { accounts: true, scheduler: false, stripeKey: "sk_test_x", resendKey: "re_x", fetchFn: stripe.fetchFn, log: { error() {} } });
  const add = (email, extra) => {
    store.db
      .prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code, email_verified_at) VALUES (?, 'x', 'v', 't', ?, '2026-01-01')")
      .run(email, email.slice(0, 6));
    const id = store.db.prepare("SELECT id FROM parents WHERE email = ?").get(email).id;
    const keys = Object.keys(extra);
    store.db.prepare(`UPDATE parents SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`).run(...keys.map((k) => extra[k]), id);
    return id;
  };
  const iso = (d) => new Date(Date.now() + d * 86400000).toISOString();
  add("koda@p.si", { promo_until: iso(5) });
  add("dalec@p.si", { promo_until: iso(20) });
  add("leto@p.si", { sub_status: "active", sub_plan: "evklid_1_year", sub_seats: 1, sub_period_end: iso(25), stripe_customer_id: "cus_y", sub_id: "sub_y" });
  add("mesec@p.si", { sub_status: "active", sub_plan: "evklid_1_month", sub_seats: 1, sub_period_end: iso(25) });
  add("odpoved@p.si", { sub_status: "active", sub_plan: "evklid_1_year", sub_seats: 1, sub_period_end: iso(25), sub_cancel_at_period_end: 1 });
  stripe.state.subs.sub_y = { id: "sub_y", customer: "cus_y", status: "active", items: { data: [{ price: { lookup_key: "evklid_1_year" }, current_period_end: Math.floor(Date.parse(iso(25)) / 1000) }] } };

  const out = await api.billing.billingDaily(new Date(), { force: true });
  assert.deepEqual([out.synced, out.promo_end, out.renewal], [1, 1, 1]);
  const subjects = stripe.calls.filter((c) => c.host === "api.resend.com").map((c) => [c.body.to[0], c.body.subject]);
  assert.deepEqual(subjects.map(([to]) => to).sort(), ["koda@p.si", "leto@p.si"]);
  assert.match(subjects.find(([to]) => to === "leto@p.si")[1], /obnovila/);
  // Drugič isti dan: nič novega (tudi z force se e-pošta ne ponovi).
  const again = await api.billing.billingDaily(new Date(), { force: true });
  assert.deepEqual([again.promo_end, again.renewal], [0, 0]);
  // Brez force pred 3.00 ali drugič isti dan ne teče.
  assert.equal(await api.billing.billingDaily(new Date()), null);
});

test("brez mikrotransakcij (j 2026-11-04): dokup samo paketi in samo polnoleten; stari 30-dnevni paket in povezava se bereta brez napake", async () => {
  await withServer(async ({ client, stripe, store }) => {
    const a = client();
    const parent = await registerVerified(a, stripe, "brez@mikro.si");
    const consent = { adult: true, withdrawal: true };
    // Poljubnega zneska ni več.
    let r = await a("/api/billing/credit", { method: "POST", body: { pack: "custom", amount_eur: 37.5, ...consent } });
    assert.equal(r.status, 400);
    assert.equal((await a("/api/billing/credit")).body.custom, undefined);
    assert.equal((await a("/api/billing/credit", { method: "POST", body: { pack: "k10", ...consent } })).status, 200);
    // Račun brez datuma rojstva (star račun): dokupa ne plača, dokler starosti ne poznamo.
    store.db.prepare("UPDATE parents SET birth_date = NULL WHERE id = ?").run(parent.id);
    r = await a("/api/billing/credit", { method: "POST", body: { pack: "k5", ...consent } });
    assert.equal(r.status, 403);
    assert.equal((await a("/api/billing/credit")).body.minor, true);
    // Mladoletni imetnik: 403.
    store.db.prepare("UPDATE parents SET birth_date = ? WHERE id = ?").run(TEEN, parent.id);
    assert.equal((await a("/api/billing/credit", { method: "POST", body: { pack: "k5", ...consent } })).status, 403);
    store.db.prepare("UPDATE parents SET birth_date = ? WHERE id = ?").run(ADULT, parent.id);

    // Že kupljen 30-dnevni paket (pred spremembo) velja do konca in se pokaže brez napake.
    const kid = (await a("/api/students", { method: "POST", body: { name: "Tia", birth_year: YEAR - 16, consent: true } })).body;
    const now = Date.now();
    store.db
      .prepare("INSERT INTO passes (parent_id, student_id, days, amount, currency, ai_usd, status, starts_at, ends_at, level) VALUES (?, ?, 30, 1399, 'EUR', 2.9, 'active', ?, ?, 'SS')")
      .run(parent.id, kid.id, new Date(now - 86400000).toISOString(), new Date(now + 29 * 86400000).toISOString());
    const offer = await a(`/api/students/${kid.id}/pass-offer`);
    assert.equal(offer.status, 200);
    assert.equal(offer.body.active.days, 30);
    assert.equal((await a("/api/account")).body.children[0].pass.days, 30);

    // Neplačana povezava za 30-dnevni paket (ustvarjena prej): ne velja več, plačati je ni mogoče.
    const { sha256 } = await import("../server/accounts/auth.js");
    const token = "stara-povezava-za-30-dni-xx";
    store.db.prepare("UPDATE passes SET status = 'refunded'").run(); // brez aktivnega paketa, da odgovor ni »že plačano«
    store.db
      .prepare("INSERT INTO pay_links (token_hash, parent_id, kind, plan_key, student_id, days, test_date, expires_at) VALUES (?, ?, 'pass', 'evklid_pass_30', ?, 30, ?, ?)")
      .run(sha256(token), parent.id, kid.id, day(20), new Date(now + 86400000).toISOString());
    const dad = client();
    r = await dad(`/api/pay/${token}`);
    assert.equal(r.status, 404);
    assert.equal(r.body.expired, true);
    r = await dad(`/api/pay/${token}/checkout`, { method: "POST", body: { email: "oce@primer.si", ...consent } });
    assert.equal(r.status, 410);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM passes WHERE days = 30").get().n, 1, "nov 30-dnevni paket ne nastane");
  });
});

// Pregled #505 A, P2-2 in #511 A, P1-1: id računa se po izbrisu ponovno uporabi. A odpre plačilo naročnine in izbriše
// račun, B dobi isti id, A plača. Realen časovni potek: seja je nastala pred B, naročnino pa Stripe ustvari šele ob
// plačilu (sub.created = zdaj, po B). Dogodek najde račun samo po id (stranke A ni več); velja samo enak parent_uid.
const lastSession = (stripe) => stripe.calls.filter((c) => c.path === "/v1/checkout/sessions" && c.method === "POST").at(-1).body;
const unmatchedRows = (store) =>
  store.db
    .prepare("SELECT key, value FROM kv WHERE key LIKE 'stripe_unmatched:%' ORDER BY key")
    .all()
    .map((r) => ({ id: r.key.slice("stripe_unmatched:".length), ...JSON.parse(r.value) }));

test("Stripe: plačilo izbrisanega računa ne gre novemu računu z istim id (realen potek, parent_uid, zapis neujemanja)", async () => {
  const errors = [];
  await withServer(
    async ({ client, store, stripe, hook }) => {
      const a = client();
      const A = await registerVerified(a, stripe, "a@ponoven.si");
      store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(A.id);
      const co = await a("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", adult: true, withdrawal: true } });
      assert.equal(co.status, 200, JSON.stringify(co.body));
      const sent = lastSession(stripe);
      const uidA = store.db.prepare("SELECT uid FROM parents WHERE id = ?").get(A.id).uid;
      assert.match(uidA, /^[0-9a-f]{32}$/, "nov račun dobi naključen uid");
      assert.equal(sent["metadata[parent_uid]"], uidA, "uid v metapodatkih seje");
      assert.equal(sent["subscription_data[metadata][parent_uid]"], uidA, "uid v metapodatkih naročnine");
      const customerA = store.db.prepare("SELECT stripe_customer_id AS c FROM parents WHERE id = ?").get(A.id).c;
      assert.ok(customerA);
      const sessionCreated = Math.floor(Date.now() / 1000) - 3600; // A je odprl plačilo pred eno uro
      assert.equal((await a("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);

      // A plača po izbrisu, novega računa še ni: plačilo nima lastnika → zapis za ročno vračilo.
      const session = { id: "cs_a", object: "checkout.session", created: sessionCreated, customer: customerA, client_reference_id: String(A.id), subscription: "sub_a", payment_status: "paid", amount_total: 999, currency: "eur", metadata: { parent_id: String(A.id), parent_uid: uidA } };
      assert.equal((await hook({ id: "evt_ra0", type: "checkout.session.completed", data: { object: session } })).status, 200);
      assert.deepEqual(unmatchedRows(store).map((r) => [r.id, r.reason, r.object, r.amount]), [["evt_ra0", "racun_ne_obstaja", "cs_a", 999]]);

      const b = client();
      const B = await registerVerified(b, stripe, "b@ponoven.si");
      assert.equal(B.id, A.id, "id se ponovno uporabi");
      store.db.prepare("UPDATE parents SET created_at = datetime('now', '-60 seconds') WHERE id = ?").run(B.id);
      const uidB = store.db.prepare("SELECT uid FROM parents WHERE id = ?").get(B.id).uid;
      assert.ok(uidB && uidB !== uidA, "uid se ne ponovi");

      // Naročnina nastane ob plačilu (created = zdaj, po računu B) in nosi uid A.
      stripe.state.subs.sub_a = { id: "sub_a", object: "subscription", customer: customerA, created: Math.floor(Date.now() / 1000), status: "active", metadata: { parent_id: String(A.id), parent_uid: uidA }, items: { data: [{ price: { lookup_key: "evklid_1_month" }, current_period_end: 1893456000 }] } };
      assert.equal((await hook({ id: "evt_ra1", type: "customer.subscription.created", data: { object: stripe.state.subs.sub_a } })).status, 200);
      assert.equal((await hook({ id: "evt_ra2", type: "checkout.session.completed", data: { object: session } })).status, 200);
      assert.equal((await hook({ id: "evt_ra3", type: "customer.subscription.updated", data: { object: stripe.state.subs.sub_a } })).status, 200);
      // Stara seja (pred namestitvijo, brez uid): samo client_reference_id ali metadata.parent_id; seja je starejša od B.
      const legacy = { ...session, id: "cs_a2", metadata: {} };
      assert.equal((await hook({ id: "evt_ra4", type: "checkout.session.completed", data: { object: legacy } })).status, 200);
      assert.equal((await hook({ id: "evt_ra5", type: "checkout.session.completed", data: { object: { ...legacy, id: "cs_a3", metadata: { parent_id: String(A.id) } } } })).status, 200);
      // Stara naročnina brez uid in brez stranke računa: po metapodatkih ne velja (sub.created ne pove, kdaj je bila seja).
      const legacySub = { ...stripe.state.subs.sub_a, id: "sub_a4", metadata: { parent_id: String(A.id) } };
      stripe.state.subs.sub_a4 = legacySub;
      assert.equal((await hook({ id: "evt_ra6", type: "customer.subscription.created", data: { object: legacySub } })).status, 200);

      const row = store.db.prepare("SELECT stripe_customer_id, sub_id, sub_status FROM parents WHERE id = ?").get(B.id);
      assert.deepEqual({ ...row }, { stripe_customer_id: null, sub_id: null, sub_status: null }, "B ne dobi A-jeve stranke in naročnine");
      assert.ok(errors.some((e) => /ni lastnik/.test(e)), "zapis v dnevnik za ročno vračilo");
      const rows = unmatchedRows(store);
      assert.deepEqual(
        rows.map((r) => [r.id, r.reason]),
        [["evt_ra0", "racun_ne_obstaja"], ["evt_ra1", "drug_racun"], ["evt_ra2", "drug_racun"], ["evt_ra4", "drug_racun"], ["evt_ra5", "drug_racun"]],
        "zapis za vsako plačilo (posodobitev naročnine ni plačilo; stara naročnina brez uid nima zapisa, sejo zapiše cs)",
      );
      assert.equal(rows[1].subscription, "sub_a");
      assert.ok(!JSON.stringify(rows).includes("ponoven.si"), "brez e-naslova v zapisu");
      assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM billing_events WHERE processed_at IS NOT NULL").get().n, 7);

      // Pravi lastnik po id iz metapodatkov (dogodek pred povezavo stranke, npr. povezava za starše) še vedno dobi naročnino.
      stripe.state.subs.sub_b = { ...stripe.state.subs.sub_a, id: "sub_b", customer: "cus_drug", metadata: { parent_id: String(B.id), parent_uid: uidB } };
      assert.equal((await hook({ id: "evt_rb1", type: "customer.subscription.created", data: { object: stripe.state.subs.sub_b } })).status, 200);
      assert.equal(store.db.prepare("SELECT sub_id FROM parents WHERE id = ?").get(B.id).sub_id, "sub_b");
      // Stara seja pravega lastnika (račun starejši od seje) še velja.
      store.db.prepare("UPDATE parents SET created_at = datetime('now', '-2 hours') WHERE id = ?").run(B.id);
      assert.equal(ownerMismatchOf(store, B.id, legacy), null);
    },
    { log: { error: (...a) => errors.push(a.join(" ")) } },
  );
});

const ownerMismatchOf = (store, id, obj) => ownerMismatch(store.db.prepare("SELECT * FROM parents WHERE id = ?").get(id), obj);

// Pregled #511 A, P2-2: paket pred testom in dokup imata id INTEGER PRIMARY KEY in se z računom izbrišeta; B dobi isti
// id računa in nakupa, A plača svojo sejo → nakup B se ne sme vklopiti.
test("Stripe: plačilo paketa in dokupa izbrisanega računa ne vklopi nakupa novega računa z istim id", async () => {
  await withServer(async ({ client, store, stripe, hook }) => {
    const buy = async (email) => {
      const c = client();
      const p = await registerVerified(c, stripe, email);
      store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(p.id);
      const kid = (await c("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 16, consent: true } })).body;
      await addTest(c, kid.id, day(5));
      const pr = await c("/api/billing/pass", { method: "POST", body: { student_id: kid.id, days: 7, test_date: day(5), test_name: "Test iz ulomkov", adult: true, withdrawal: true } });
      assert.equal(pr.status, 200, JSON.stringify(pr.body));
      const pass = lastSession(stripe);
      const cr = await c("/api/billing/credit", { method: "POST", body: { pack: "k5", adult: true, withdrawal: true } });
      assert.equal(cr.status, 200, JSON.stringify(cr.body));
      const credit = lastSession(stripe);
      return { c, p, pass, credit };
    };
    const A = await buy("a@paket-ponoven.si");
    const sessionOf = (sent, id) => ({
      id,
      object: "checkout.session",
      created: Math.floor(Date.now() / 1000) - 600,
      payment_status: "paid",
      payment_intent: "pi_" + id,
      amount_total: 549,
      metadata: Object.fromEntries(Object.entries(sent).filter(([k]) => k.startsWith("metadata[")).map(([k, v]) => [k.slice(9, -1), v])),
    });
    const passA = sessionOf(A.pass, "cs_pa");
    const creditA = sessionOf(A.credit, "cs_ka");
    assert.ok(passA.metadata.parent_uid && creditA.metadata.parent_uid, "uid v metapodatkih paketa in dokupa");
    assert.equal(A.pass["payment_intent_data[metadata][parent_uid]"], passA.metadata.parent_uid);
    assert.equal((await A.c("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);

    const B = await buy("b@paket-ponoven.si");
    assert.equal(B.p.id, A.p.id);
    assert.equal(B.pass["metadata[pass_id]"], A.pass["metadata[pass_id]"], "isti id paketa");
    assert.equal(B.credit["metadata[credit_id]"], A.credit["metadata[credit_id]"], "isti id dokupa");
    store.db.prepare("UPDATE passes SET created_at = datetime('now', '+1 seconds')").run(); // vrstica B je mlajša od seje A

    assert.equal((await hook({ id: "evt_pa1", type: "checkout.session.completed", data: { object: passA } })).status, 200);
    assert.equal((await hook({ id: "evt_ka1", type: "checkout.session.completed", data: { object: creditA } })).status, 200);
    // Stara seja brez uid (druga seja kot shranjena v vrstici B, vrstica mlajša od seje).
    const strip = (s, id) => ({ ...s, id, metadata: Object.fromEntries(Object.entries(s.metadata).filter(([k]) => k !== "parent_uid")) });
    assert.equal((await hook({ id: "evt_pa2", type: "checkout.session.completed", data: { object: strip(passA, "cs_pa2") } })).status, 200);
    assert.equal((await hook({ id: "evt_ka2", type: "checkout.session.completed", data: { object: strip(creditA, "cs_ka2") } })).status, 200);
    assert.deepEqual(store.db.prepare("SELECT status FROM passes").all().map((r) => r.status), ["pending"], "paket B se ne vklopi");
    assert.deepEqual(store.db.prepare("SELECT status FROM ai_credit_buys").all().map((r) => r.status), ["pending"], "dokup B se ne vklopi");
    assert.deepEqual(unmatchedRows(store).map((r) => [r.id, r.reason, r.kind]), [
      ["evt_ka1", "drug_racun", "credit"],
      ["evt_ka2", "drug_racun", "credit"],
      ["evt_pa1", "drug_racun", "pass"],
      ["evt_pa2", "drug_racun", "pass"],
    ]);

    // Plačilo B (lastna seja z uid B) se vklopi.
    const passB = sessionOf(B.pass, store.db.prepare("SELECT checkout_id FROM passes").get().checkout_id);
    const creditB = sessionOf(B.credit, store.db.prepare("SELECT checkout_id FROM ai_credit_buys").get().checkout_id);
    assert.equal((await hook({ id: "evt_pb", type: "checkout.session.completed", data: { object: passB } })).status, 200);
    assert.equal((await hook({ id: "evt_kb", type: "checkout.session.completed", data: { object: creditB } })).status, 200);
    assert.equal(store.db.prepare("SELECT status FROM passes").get().status, "active");
    assert.equal(store.db.prepare("SELECT status FROM ai_credit_buys").get().status, "active");
    assert.equal(unmatchedRows(store).length, 4);
  });
});

test("Stripe: darilna koda in »Podari« po izbrisu kupca: plačilo dobi zapis za ročno vračilo", async () => {
  await withServer(async ({ store, hook }) => {
    const gift = Number(store.db.prepare("INSERT INTO gifts (buyer_id, amount, currency, days, level) VALUES (NULL, 999, 'EUR', 30, 'OS')").run().lastInsertRowid);
    const fund = Number(store.db.prepare("INSERT INTO podari_fund (parent_id, kind, amount) VALUES (NULL, 'month', 500)").run().lastInsertRowid);
    const s = (kind, extra) => ({ id: "cs_" + kind, object: "checkout.session", payment_status: "paid", payment_intent: "pi_" + kind, amount_total: 999, metadata: { kind, parent_id: "7", ...extra } });
    assert.equal((await hook({ id: "evt_g", type: "checkout.session.completed", data: { object: s("gift", { gift_id: String(gift) }) } })).status, 200);
    assert.equal((await hook({ id: "evt_f", type: "checkout.session.completed", data: { object: s("podari", { fund_id: String(fund) }) } })).status, 200);
    assert.deepEqual(unmatchedRows(store).map((r) => [r.id, r.reason, r.payment_intent]), [["evt_f", "kupec_izbrisan", "pi_podari"], ["evt_g", "kupec_izbrisan", "pi_gift"]]);
  });
});

test("Stripe: zapis neujemanja ne uspe → dogodek ni označen kot obdelan (Stripe ga pošlje znova)", async () => {
  await withServer(async ({ store, hook }) => {
    store.db.exec("CREATE TRIGGER kv_no_unmatched BEFORE INSERT ON kv WHEN NEW.key LIKE 'stripe_unmatched:%' BEGIN SELECT RAISE(ABORT, 'disk poln'); END;");
    const session = { id: "cs_x", object: "checkout.session", created: 1, payment_status: "paid", client_reference_id: "42", metadata: { parent_id: "42", parent_uid: "f".repeat(32) } };
    assert.equal((await hook({ id: "evt_x", type: "checkout.session.completed", data: { object: session } })).status, 500);
    assert.equal(store.db.prepare("SELECT processed_at FROM billing_events WHERE id = 'evt_x'").get().processed_at, null);
  });
});

test("ponoven-id: račun je lastnik predmeta Stripa samo ob enakem uid (stara seja: ni mlajši od nje)", () => {
  const t = Date.parse("2026-11-07T10:00:00Z") / 1000;
  assert.equal(ownsStripeObject({ created_at: "2026-11-07 09:59:59" }, { created: t }), true);
  assert.equal(ownsStripeObject({ created_at: "2026-11-07 10:00:00" }, { created: t }), true, "ista sekunda");
  assert.equal(ownsStripeObject({ created_at: "2026-11-07 10:00:01" }, { created: t }), false, "brez zamika ure (P3-A)");
  assert.equal(ownsStripeObject({ created_at: "2026-11-07T10:00:01.000Z" }, { created: t }), false, "ISO zapis");
  assert.equal(ownsStripeObject({ created_at: "2026-11-07 10:00:01" }, {}), true, "brez created kot prej");
  assert.equal(ownsStripeObject(null, { created: t }), false);
  const p = { id: 5, uid: "a".repeat(32), created_at: "2026-11-08 00:00:00" };
  assert.equal(ownerMismatch(p, { object: "subscription", created: t + 99999, metadata: { parent_uid: "a".repeat(32) } }), null);
  assert.equal(ownerMismatch(p, { object: "subscription", created: t + 99999, metadata: { parent_uid: "b".repeat(32) } }), "drug_racun");
  assert.equal(ownerMismatch(p, { object: "subscription", created: t + 99999, metadata: {} }), "brez_uid");
  assert.equal(ownerMismatch(p, { object: "subscription", created: Date.parse("2026-11-09T00:00:00Z") / 1000, metadata: {} }), null, "stara naročnina: račun starejši od sub.created − 24 h");
  assert.equal(ownerMismatch(p, { object: "subscription", created: Date.parse("2026-11-08T23:59:58Z") / 1000, metadata: {} }), "brez_uid");
  assert.equal(ownerMismatch({ id: 5 }, { object: "subscription", metadata: { parent_uid: "" } }), null, "brez created kot prej");
  assert.equal(ownerMismatch(null, {}), "racun_ne_obstaja");
  const errs = [];
  const why = [];
  const getParent = (id) => (id === 5 ? p : null);
  assert.equal(parentFromMeta(getParent, "5", { id: "cs_1", object: "checkout.session", created: t }, { error: (...a) => errs.push(a.join(" ")) }, "x", (r) => why.push(r)), null);
  assert.deepEqual([errs.length, why], [1, ["drug_racun"]]);
  assert.equal(parentFromMeta(getParent, "x", { created: t }), null);
  assert.equal(parentFromMeta(getParent, "5", { object: "checkout.session", metadata: { parent_uid: p.uid } })?.id, 5);
  // Nakup: vrstica drugega računa, drug uid, ista seja brez uid, mlajša vrstica brez uid.
  const row = { parent_id: 5, checkout_id: "cs_9", created_at: "2026-11-07 10:00:00" };
  const s = (extra) => ({ id: "cs_9", created: t, metadata: { parent_id: "5", ...extra } });
  assert.equal(purchaseMismatch(null, p, s()), "nakup_ne_obstaja");
  assert.equal(purchaseMismatch(row, p, s({ parent_id: "6" })), "drug_racun");
  assert.equal(purchaseMismatch(row, p, s({ parent_uid: p.uid })), null);
  assert.equal(purchaseMismatch(row, p, s({ parent_uid: "c".repeat(32) })), "drug_racun");
  assert.equal(purchaseMismatch(row, p, s()), null, "stara seja: ista seja");
  assert.equal(purchaseMismatch({ ...row, checkout_id: "cs_8" }, p, s()), null, "stara seja: ponoven klik, vrstica starejša");
  assert.equal(purchaseMismatch({ ...row, checkout_id: "cs_8", created_at: "2026-11-07 10:00:01" }, p, s()), "drug_racun");
});

test("parents.uid: obstoječi računi ga dobijo ob migraciji, vsak drugačen", () => {
  const store = openDb(":memory:");
  createApp(store, { accounts: true, scheduler: false, log: { error() {} } });
  const db = store.db;
  db.exec("DROP INDEX idx_parents_uid");
  db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code) VALUES ('x@y.si', 'h', 1, 'u1', 'R1'), ('z@y.si', 'h', 1, 'u2', 'R2')").run();
  db.exec("UPDATE parents SET uid = NULL");
  createApp(store, { accounts: true, scheduler: false, log: { error() {} } });
  const uids = db.prepare("SELECT uid FROM parents ORDER BY email").all().map((r) => r.uid);
  assert.equal(uids.length, 2);
  assert.ok(uids.every((u) => /^[0-9a-f]{32}$/.test(u)) && uids[0] !== uids[1]);
  assert.throws(() => db.prepare("UPDATE parents SET uid = ? WHERE email = 'z@y.si'").run(uids[0]), /UNIQUE/);
});

// Dve naročnini istega kupca (pregled B #490, M8): dogodek stare ne vzame dostopa, ki ga daje druga.
const subState = (id, status) => ({ id, status, customer: "cus_k", items: { data: [{ price: { lookup_key: "evklid_1_month" } }] } });
const subRow = (store, pid) => ({ ...store.db.prepare("SELECT sub_id, sub_status FROM parents WHERE id = ?").get(pid) });
const setSub = (store, stripe, pid, id) => {
  store.db.prepare("UPDATE parents SET sub_id = ?, sub_status = 'active', sub_plan = 'evklid_1_month', stripe_customer_id = 'cus_k' WHERE id = ?").run(id, pid);
  stripe.state.subs[id] = subState(id, "active");
};

test("dogodek stare naročnine (preklic) ne prepiše trenutne veljavne naročnine", async () => {
  await withServer(async ({ client, stripe, store, hook }) => {
    const a = client();
    const p = await registerVerified(a, stripe, "stara@x.si");
    setSub(store, stripe, p.id, "sub_new");
    stripe.state.subs.sub_old = subState("sub_old", "canceled");
    for (const type of ["customer.subscription.deleted", "customer.subscription.updated"]) {
      const r = await hook({ id: "e_" + type, type, data: { object: { id: "sub_old", customer: "cus_k", status: "canceled" } } });
      assert.equal(r.status, 200);
      assert.deepEqual(subRow(store, p.id), { sub_id: "sub_new", sub_status: "active" }, type);
    }
    // Druga aktivna istega paketa (dvojni nakup, obnova) ne preklaplja; nakup višjega paketa trenutno zamenja.
    stripe.state.subs.sub_2 = subState("sub_2", "active");
    await hook({ id: "e2", type: "customer.subscription.updated", data: { object: { id: "sub_2", customer: "cus_k", status: "active" } } });
    assert.deepEqual(subRow(store, p.id), { sub_id: "sub_new", sub_status: "active" });
    stripe.state.subs.sub_3 = { ...subState("sub_3", "active"), items: { data: [{ price: { lookup_key: "evklid_faks_month" } }] } };
    await hook({ id: "e3", type: "customer.subscription.created", data: { object: { id: "sub_3", customer: "cus_k", status: "active" } } });
    assert.deepEqual(subRow(store, p.id), { sub_id: "sub_3", sub_status: "active" });
  });
});

test("konec trenutne naročnine ob drugi plačani naročnini istega kupca: velja druga", async () => {
  await withServer(async ({ client, stripe, store, hook }) => {
    const a = client();
    const p = await registerVerified(a, stripe, "dve@x.si");
    setSub(store, stripe, p.id, "sub_new");
    stripe.state.subs.sub_old = subState("sub_old", "active");
    stripe.state.subs.sub_new.status = "canceled";
    await hook({ id: "d1", type: "customer.subscription.deleted", data: { object: { id: "sub_new", customer: "cus_k", status: "canceled" } } });
    assert.deepEqual(subRow(store, p.id), { sub_id: "sub_old", sub_status: "active" });
    // Ko se konča še ta, dostopa ni več.
    stripe.state.subs.sub_old.status = "canceled";
    await hook({ id: "d2", type: "customer.subscription.deleted", data: { object: { id: "sub_old", customer: "cus_k", status: "canceled" } } });
    assert.deepEqual(subRow(store, p.id), { sub_id: "sub_old", sub_status: "canceled" });
  });
});

// Pregled A #497 (R1): stara naročnina past_due ob trenutni aktivni ne prevzame računa.
test("stara naročnina past_due ob trenutni aktivni ne prevzame računa", async () => {
  await withServer(async ({ client, stripe, store, hook }) => {
    const p = await registerVerified(client(), stripe, "pd@x.si");
    setSub(store, stripe, p.id, "sub_new");
    stripe.state.subs.sub_old = subState("sub_old", "past_due");
    await hook({ id: "pd1", type: "customer.subscription.updated", data: { object: { id: "sub_old", customer: "cus_k", status: "past_due" } } });
    assert.deepEqual(subRow(store, p.id), { sub_id: "sub_new", sub_status: "active" });
  });
});

test("trenutna preide v past_due, kupec ima drugo aktivno: velja druga", async () => {
  await withServer(async ({ client, stripe, store, hook }) => {
    const p = await registerVerified(client(), stripe, "pd2@x.si");
    setSub(store, stripe, p.id, "sub_new");
    stripe.state.subs.sub_old = subState("sub_old", "active");
    stripe.state.subs.sub_new.status = "past_due";
    await hook({ id: "pd2", type: "customer.subscription.updated", data: { object: { id: "sub_new", customer: "cus_k", status: "past_due" } } });
    assert.deepEqual(subRow(store, p.id), { sub_id: "sub_old", sub_status: "active" });
  });
});

// Spor pri enkratnem plačilu (dokup, paket, ki ga ni več v bazi, ker je bil profil izbrisan) ni spor pri naročnini:
// naročnine, ki jo starš plačuje, ne prekličemo. Spor pri računu naročnine jo prekliče kot doslej.
test("spor pri enkratnem plačilu ne prekliče naročnine; spor pri računu naročnine jo", async () => {
  await withServer(async ({ client, stripe, store, hook }) => {
    const a = client();
    const parent = await registerVerified(a, stripe, "spor@enkratno.si");
    store.db.prepare("UPDATE parents SET sub_id = 'sub_k', sub_status = 'active', sub_plan = 'evklid_1_month', stripe_customer_id = 'cus_k' WHERE id = ?").run(parent.id);
    stripe.state.subs.sub_k = { id: "sub_k", status: "active", customer: "cus_k", items: { data: [{ price: { lookup_key: "evklid_1_month" } }] } };
    const deleted = () => stripe.calls.filter((c) => c.method === "DELETE" && c.path.startsWith("/v1/subscriptions")).length;

    // 1) Dokup, ki je bil že vrnjen (delno ali v celoti), nato spor pri istem plačilu.
    store.db.prepare("INSERT INTO ai_credit_buys (parent_id, pack, amount, currency, credit_usd, status, payment_id) VALUES (?, 'k5', 500, 'EUR', 1, 'refunded', 'pi_c')").run(parent.id);
    stripe.state.charges.ch_c = { id: "ch_c", customer: "cus_k", payment_intent: "pi_c", invoice: null };
    assert.equal((await hook({ id: "evt_dc", type: "charge.dispute.created", data: { object: { payment_intent: "pi_c", charge: "ch_c" } } })).status, 200);
    assert.equal(deleted(), 0, "spor pri dokupu je preklical naročnino");

    // 2) Enkratno plačilo, ki ga v bazi ni več (paket izbrisanega profila: passes ON DELETE CASCADE).
    stripe.state.charges.ch_p = { id: "ch_p", customer: "cus_k", payment_intent: "pi_p", invoice: null };
    assert.equal((await hook({ id: "evt_dp", type: "charge.dispute.created", data: { object: { payment_intent: "pi_p", charge: "ch_p" } } })).status, 200);
    assert.equal(deleted(), 0, "spor pri paketu izbrisanega profila je preklical naročnino");
    assert.equal(store.db.prepare("SELECT sub_status FROM parents WHERE id = ?").get(parent.id).sub_status, "active");

    // 3) Spor pri računu te naročnine: naročnina se prekliče.
    stripe.state.charges.ch_s = { id: "ch_s", customer: "cus_k", payment_intent: "pi_s", invoice: "in_s" };
    stripe.state.invoices.in_s = { id: "in_s", subscription: "sub_k" };
    assert.equal((await hook({ id: "evt_ds", type: "charge.dispute.created", data: { object: { payment_intent: "pi_s", charge: "ch_s" } } })).status, 200);
    assert.equal(deleted(), 1);
    assert.equal(store.db.prepare("SELECT sub_status FROM parents WHERE id = ?").get(parent.id).sub_status, "canceled");
  });
});
