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
      createPromo(store.db, promoConfig({}));
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

      // Brez obeh potrditev ni plačila; test čez več kot 14 dni ni dovoljen.
      const body = { student_id: kid.id, days: 14, test_date: day(9), test_name: "Test iz ulomkov" };
      const noConsent = await a("/api/billing/pass", { method: "POST", body });
      assert.equal(noConsent.status, 400);
      assert.equal(noConsent.body.consent, true);
      assert.equal((await a("/api/billing/pass", { method: "POST", body: { ...body, test_date: day(40), adult: true, withdrawal: true } })).status, 400);
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
    stripe.state.sessions.cs_sub = { id: "cs_sub", status: "complete", customer: "cus_mama", subscription: "sub_7", metadata: { parent_id: String(parent.id), pay_link: session.body["metadata[pay_link]"] } };
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

test("odstranjene možnosti (j 2026-11-04): strežnik zavrne poljuben znesek dokupa in 30-dnevni paket; dokup le polnoletni", async () => {
  await withServer(async ({ client, stripe, store }) => {
    const sessions = () => stripe.calls.filter((c) => c.path === "/v1/checkout/sessions" && c.method === "POST").length;
    const a = client();
    await registerVerified(a, stripe, "odrasel@mikro.si");
    const kid = (await a("/api/students", { method: "POST", body: { name: "Ela", birth_year: YEAR - 16, consent: true } })).body;
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();
    const ok = { adult: true, withdrawal: true };

    // Dokup: kartica ne ponuja poljubnega zneska; strežnik ga zavrne v vseh oblikah.
    const info = (await a("/api/billing/credit")).body;
    assert.deepEqual(info.packs.map((p) => p.amount), [500, 1000, 2000]);
    assert.equal(info.custom, undefined);
    const n0 = sessions();
    for (const body of [{ pack: "custom", amount_eur: 37.5 }, { pack: "custom", amount_eur: 5 }, { pack: "k7" }, { amount_eur: 10 }]) {
      const r = await a("/api/billing/credit", { method: "POST", body: { ...body, ...ok } });
      assert.equal(r.status, 400, JSON.stringify(body));
    }
    assert.equal(sessions(), n0, "brez plačilne strani");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM ai_credit_buys").get().n, 0);
    // Paket 10 € gre naprej (znesek v plačilu je 10 €, ne kar pošlje brskalnik).
    const k10 = await a("/api/billing/credit", { method: "POST", body: { pack: "k10", amount_eur: 999, ...ok } });
    assert.equal(k10.status, 200, JSON.stringify(k10.body));
    const cs = stripe.calls.filter((c) => c.path === "/v1/checkout/sessions" && c.method === "POST").at(-1).body;
    assert.equal(cs["line_items[0][price_data][unit_amount]"], "1000");

    // Paket pred testom: 30 dni ni več mogoče kupiti; test čez 20 dni ni več ponujen.
    await addTest(a, kid.id, day(20));
    assert.equal((await a(`/api/students/${kid.id}/pass-offer`)).body.offer, null, "test čez 20 dni: 14-dnevni paket ga ne pokrije");
    assert.equal((await a("/api/billing/pass", { method: "POST", body: { student_id: kid.id, days: 30, test_date: day(20), ...ok } })).status, 400);
    await addTest(a, kid.id, day(10));
    const offer = (await a(`/api/students/${kid.id}/pass-offer`)).body;
    assert.deepEqual(offer.passes.map((p) => [p.days, p.amount]), [[7, 549], [14, 849]]);
    const n1 = sessions();
    assert.equal((await a("/api/billing/pass", { method: "POST", body: { student_id: kid.id, days: 30, test_date: day(10), ...ok } })).status, 400);
    assert.equal((await a("/api/billing/pay-link", { method: "POST", body: { kind: "pass", student_id: kid.id, days: 30, test_date: day(10) } })).status, 400);
    assert.equal(sessions(), n1);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM passes").get().n, 0);

    // Stara povezava za 30-dnevni paket (ustvarjena pred odstranitvijo): ne odpre plačila.
    const token = "x".repeat(32);
    const { createHash } = await import("node:crypto");
    store.db
      .prepare("INSERT INTO pay_links (token_hash, parent_id, kind, plan_key, student_id, days, test_date, test_name, expires_at) VALUES (?, ?, 'pass', 'evklid_pass_30', ?, 30, ?, 'Test', ?)")
      .run(createHash("sha256").update(token).digest("hex"), kid.parent_id ?? store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id, kid.id, day(10), new Date(Date.now() + 86400000).toISOString());
    const pub = client();
    assert.equal((await pub(`/api/pay/${token}`)).status, 404);
    assert.equal((await pub(`/api/pay/${token}/checkout`, { method: "POST", body: { email: "mama@mikro.si", ...ok } })).status, 410);
    assert.equal(sessions(), n1);

    // Mladoletni imetnik (16 let): dokupa ne vidi in ga strežnik zavrne tudi za pravi paket.
    const teen = client();
    await registerVerified(teen, stripe, "dijak@mikro.si", { birth_date: TEEN });
    assert.equal((await teen("/api/billing/credit")).body.minor, true);
    const r = await teen("/api/billing/credit", { method: "POST", body: { pack: "k5", ...ok } });
    assert.equal(r.status, 403);
    assert.equal(sessions(), n1);
  });
});
