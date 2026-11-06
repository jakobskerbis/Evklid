import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { Stripe, signWebhook, verifyWebhook, formEncode } from "../server/accounts/stripe.js";
import { accessFor, isPremiumChild } from "../server/accounts/plans.js";
import { promoConfig } from "../server/accounts/promo.js";
import { weekKey, isSendTime } from "../server/accounts/weekly.js";

const SECRET = "whsec_test";
const YEAR = new Date().getFullYear();
const ADULT = "1985-04-12";

// Lažni Stripe + Resend: zapomni si klice in vrne smiselne odgovore.
function fakeFetch(calls) {
  let n = 0;
  return async (url, init = {}) => {
    const body = init.body ? (init.headers["Content-Type"]?.includes("json") ? JSON.parse(init.body) : Object.fromEntries(new URLSearchParams(init.body))) : null;
    const u = new URL(url);
    calls.push({ method: init.method, path: u.pathname, query: Object.fromEntries(u.searchParams), body, host: u.host });
    const ok = (data) => ({ ok: true, status: 200, json: async () => data });
    if (u.host === "api.resend.com") return ok({ id: "email_" + ++n });
    const p = u.pathname.replace("/v1", "");
    if (p === "/customers") return ok({ id: "cus_" + ++n });
    if (p === "/prices" && init.method === "GET") return ok({ data: [] });
    if (p === "/products") return ok({ id: "prod_1" });
    if (p === "/prices") return ok({ id: "price_" + body.lookup_key });
    if (p === "/checkout/sessions") return ok({ id: "cs_1", url: "https://checkout.stripe.test/cs_1" });
    if (p === "/billing_portal/configurations") return ok({ id: "bpc_1" });
    if (p === "/billing_portal/sessions") return ok({ url: "https://billing.stripe.test/p" });
    if (/\/balance_transactions$/.test(p)) return ok({ id: "cbtxn_1" });
    if (p.startsWith("/subscriptions")) return ok({ data: [] });
    return { ok: false, status: 404, json: async () => ({ error: { message: "ni" } }) };
  };
}

// Uporaba brez računa je v aplikaciji odstranjena; testi starih gostov jo vklopijo v kodi.
const withGuests = (fn) => withServer(fn, { guest: true });

async function withServer(fn, extra = {}) {
  const store = openDb(":memory:");
  const calls = [];
  const mails = [];
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    stripeKey: "sk_test_x",
    resendKey: "re_x",
    webhookSecret: SECRET,
    fetchFn: fakeFetch(calls),
    log: { error() {} },
    streamFn: async ({ onText }) => {
      onText("ok");
      return { text: 'ok\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>', stopReason: "end_turn" };
    },
    ...extra,
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  // Odjemalec s piškotki (en na starša).
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
      return { status: res.status, headers: res.headers, body: type.includes("json") ? await res.json() : await res.text() };
    };
  };
  try {
    await fn({ client, store, calls, mails, base });
  } finally {
    server.close();
  }
}

const verifyLink = (calls) => {
  const mail = calls.filter((c) => c.host === "api.resend.com").at(-1);
  return /\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0];
};

async function registerVerified(call, calls, email, extra = {}) {
  const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: ADULT, ...extra } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  const v = await call(verifyLink(calls));
  assert.equal(v.status, 302);
  return r.body.parent;
}

test("register, verify, consent and ownership", async () => {
  await withServer(async ({ client, calls }) => {
    const a = client();
    assert.equal((await a("/api/students")).status, 401);
    assert.equal((await a("/api/auth/register", { method: "POST", body: { email: "x@y.si", password: "geslo1234" } })).status, 400);

    const reg = await a("/api/auth/register", { method: "POST", body: { email: "Ana@Primer.si", password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
    assert.equal(reg.status, 201);
    assert.equal(reg.body.parent.email, "ana@primer.si");
    assert.equal(reg.body.dev_verify_url, undefined); // Resend je nastavljen

    // Pred potrditvijo e-naslova otroka ni mogoče dodati.
    const early = await a("/api/students", { method: "POST", body: { name: "Miha", birth_year: YEAR - 12, consent: true } });
    assert.equal(early.status, 403);
    await a(verifyLink(calls));

    const noConsent = await a("/api/students", { method: "POST", body: { name: "Miha", birth_year: YEAR - 12 } });
    assert.equal(noConsent.status, 400);
    const kid = await a("/api/students", { method: "POST", body: { name: "Miha", birth_year: YEAR - 12, consent: true } });
    assert.equal(kid.status, 201);

    const acc = (await a("/api/account")).body;
    assert.equal(acc.access.tier, "trial");
    assert.equal(acc.children[0].premium, true);

    // Drug starš ne vidi in ne more spreminjati tujega otroka.
    const b = client();
    await registerVerified(b, calls, "bor@primer.si");
    assert.deepEqual((await b("/api/students")).body, []);
    assert.equal((await b(`/api/students/${kid.body.id}`)).status, 404);
    assert.equal((await b(`/api/students/${kid.body.id}`, { method: "DELETE" })).status, 404);
    const conv = (await a(`/api/students/${kid.body.id}/conversations`, { method: "POST" })).body;
    assert.equal((await b(`/api/conversations/${conv.id}`)).status, 404);
    assert.equal((await a(`/api/conversations/${conv.id}`)).status, 200);
    // Poraba AI: starš prek povezave (telefon) je ne vidi; na računalniku s strežnikom jo vidi
    // in lahko račun označi kot skrbniški, nato jo vidi tudi na telefonu.
    const tunnel = { headers: { "X-Forwarded-For": "1.2.3.4" } };
    assert.equal((await b("/api/usage", tunnel)).status, 403);
    assert.equal((await b("/api/usage/claim", { method: "POST", ...tunnel })).status, 403);
    const local = await b("/api/usage");
    assert.equal(local.status, 200);
    assert.equal(local.body.can_claim, true);
    assert.equal((await b("/api/usage/claim", { method: "POST" })).status, 200);
    assert.equal((await b("/api/usage", tunnel)).status, 200);
    assert.equal((await b("/api/usage")).body.can_claim, false);
    assert.equal((await a("/api/usage", tunnel)).status, 403);

    // Odjava in ponovna prijava.
    await a("/api/auth/logout", { method: "POST" });
    assert.equal((await a("/api/students")).status, 401);
    assert.equal((await a("/api/auth/login", { method: "POST", body: { email: "ana@primer.si", password: "napacno12" } })).status, 401);
    assert.equal((await a("/api/auth/login", { method: "POST", body: { email: "ANA@primer.si", password: "geslo1234" } })).status, 200);
    assert.equal((await a("/api/students")).body.length, 1);
  });
});

test("free tier limits tutor questions; subscription via webhook lifts it", async () => {
  process.env.EVKLID_FREE_DAILY_QUESTIONS = "2";
  try {
    await withServer(async ({ client, calls, store }) => {
      const a = client();
      const parent = await registerVerified(a, calls, "cene@primer.si");
      const kid = (await a("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 10, consent: true } })).body;
      // Preizkus je potekel.
      store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();
      const conv = (await a(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
      const ask = (t) => a(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: t } });
      assert.equal((await ask("prvo")).status, 200);
      assert.equal((await ask("drugo")).status, 200);
      const blocked = await ask("tretje");
      assert.equal(blocked.status, 429);
      // Otrok, mlajši od 15 let: brez ponudbe nakupa (server/placila/ponudbe.js).
      assert.equal(blocked.body.upgrade, false);
      assert.doesNotMatch(blocked.body.error, /naročnin/);
      assert.equal(blocked.body.code, "block.freeDaily");
      assert.equal(blocked.body.hint, undefined);

      // Plačilo: checkout s pravilno ceno.
      const co = await a("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "year", adult: true, withdrawal: true } });
      assert.equal(co.body.url, "https://checkout.stripe.test/cs_1");
      const session = calls.find((c) => c.path === "/v1/checkout/sessions");
      assert.equal(session.body["line_items[0][price]"], "price_evklid_1_year");
      assert.equal(session.body.mode, "subscription");
      assert.equal(session.body["subscription_data[trial_end]"], undefined); // preizkus je že potekel
      assert.equal(calls.filter((c) => c.path === "/v1/prices" && c.method === "POST").length, 10, "cene po stopnjah in družinska paketa");
      const customer = store.db.prepare("SELECT stripe_customer_id FROM parents WHERE id = ?").get(parent.id).stripe_customer_id;

      // Webhook z napačnim podpisom je zavrnjen.
      const event = {
        type: "customer.subscription.updated",
        data: {
          object: {
            id: "sub_1",
            customer,
            status: "active",
            cancel_at_period_end: false,
            items: { data: [{ price: { id: "price_x", lookup_key: "evklid_1_year" }, current_period_end: 1893456000 }] },
          },
        },
      };
      const raw = JSON.stringify(event);
      const anon = client();
      assert.equal((await anon("/api/stripe/webhook", { method: "POST", raw, headers: { "stripe-signature": signWebhook(raw, "wrong") } })).status, 400);
      const okHook = await anon("/api/stripe/webhook", { method: "POST", raw, headers: { "stripe-signature": signWebhook(raw, SECRET) } });
      assert.equal(okHook.status, 200);

      const acc = (await a("/api/account")).body;
      assert.equal(acc.access.tier, "paid");
      assert.equal(acc.parent.subscription.plan, "evklid_1_year");
      assert.equal(acc.parent.subscription.period_end, "2030-01-01T00:00:00.000Z");
      assert.equal((await ask("tretje")).status, 200);
      assert.equal((await a("/api/billing/checkout", { method: "POST", body: { seats: 2, interval: "month", adult: true, withdrawal: true } })).status, 409);

      const portal = await a("/api/billing/portal", { method: "POST" });
      assert.equal(portal.body.url, "https://billing.stripe.test/p");
    });
  } finally {
    delete process.env.EVKLID_TRIAL_AI_USD;
    delete process.env.EVKLID_FREE_DAILY_QUESTIONS;
  }
});

test("daily tutor questions: the plan's limit is the floor, the AI budget raises it; the free plan keeps its own", async () => {
  process.env.EVKLID_FREE_DAILY_QUESTIONS = "2";
  process.env.EVKLID_OSEBNO_DAILY_QUESTIONS = "3";
  process.env.EVKLID_DAILY_QUESTIONS_MAX = "5";
  try {
    await withServer(async ({ client, calls, store }) => {
      const askAll = async (a, n) => {
        const kid = (await a("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 10, consent: true } })).body;
        const conv = (await a(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
        const out = [];
        for (let i = 0; i < n; i++) out.push((await a(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: `vprašanje ${i}` } })).status);
        return out;
      };
      // Brez proračuna: stalna meja Osebno (tu 3).
      const trial = client();
      await registerVerified(trial, calls, "meja@preizkus.si");
      const first = await askAll(trial, 4);
      assert.deepEqual(first, [200, 200, 200, 429]);
      // S proračunom (200 $, malo učencev): preizkus ima nizko stalno mejo AI (server/meje-ai.js, j 2026-11-06), zato
      // ostane stalna meja 3; z večjo mejo preizkusa meja zraste do zgornje meje (tu 5); brezplačni paket ostane 2.
      store.db.prepare("INSERT INTO kv (key, value) VALUES ('budget_base_usd', '200') ON CONFLICT(key) DO UPDATE SET value = excluded.value").run();
      const trial2 = client();
      await registerVerified(trial2, calls, "meja2@preizkus.si");
      assert.deepEqual(await askAll(trial2, 4), [200, 200, 200, 429]);
      process.env.EVKLID_TRIAL_AI_USD = "50";
      const trial2b = client();
      await registerVerified(trial2b, calls, "meja2b@preizkus.si");
      assert.deepEqual(await askAll(trial2b, 6), [200, 200, 200, 200, 200, 429]);
      delete process.env.EVKLID_TRIAL_AI_USD;
      const free = client();
      const p = await registerVerified(free, calls, "meja@brezplacno.si");
      store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(p.id);
      assert.deepEqual(await askAll(free, 3), [200, 200, 429]);
      // Zgornja meja pod stalno mejo paketa: velja stalna meja (proračun meje nikoli ne zniža).
      process.env.EVKLID_DAILY_QUESTIONS_MAX = "1";
      const trial3 = client();
      await registerVerified(trial3, calls, "meja3@preizkus.si");
      assert.deepEqual(await askAll(trial3, 4), [200, 200, 200, 429]);
    });
  } finally {
    delete process.env.EVKLID_FREE_DAILY_QUESTIONS;
    delete process.env.EVKLID_OSEBNO_DAILY_QUESTIONS;
    delete process.env.EVKLID_DAILY_QUESTIONS_MAX;
  }
});

test("limit hint by age: a parent picks the plan for under 18, an adult student picks it alone", async () => {
  process.env.EVKLID_FREE_DAILY_QUESTIONS = "1";
  try {
    await withServer(async ({ client, calls, store }) => {
      const ymd = (age) => `${YEAR - age}-01-01`;
      const blockedFor = async (email, birth, kidBody) => {
        const a = client();
        await registerVerified(a, calls, email, { birth_date: birth });
        const kid = (await a("/api/students", { method: "POST", body: kidBody })).body;
        store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();
        const conv = (await a(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
        const ask = (t) => a(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: t } });
        assert.equal((await ask("prvo")).status, 200);
        const r = await ask("drugo");
        assert.equal(r.status, 429);
        assert.equal(r.body.limit, true);
        return r.body;
      };
      // Študent (npr. FKKT, 1. letnik, 19 let) z lastnim profilom: naročnino izbere sam.
      const adult = await blockedFor("student@primer.si", ymd(19), { name: "Jakob", birth_year: YEAR - 19, self: true, consent: true });
      assert.equal(adult.hint, "block.hintAdult");
      assert.match(adult.error, /izberi naročnino v zavihku Račun/);
      assert.doesNotMatch(adult.error, /starš/);
      // Dijak (16) na računu staršev: naj starš izbere naročnino.
      const teen = await blockedFor("mama@primer.si", ADULT, { name: "Lara", birth_year: YEAR - 16, consent: true });
      assert.equal(teen.hint, "block.hintParent");
      assert.match(teen.error, /naj starš izbere naročnino/);
    });
  } finally {
    delete process.env.EVKLID_FREE_DAILY_QUESTIONS;
  }
});

test("free tier stops at the monthly AI budget (all free students and per student)", async () => {
  process.env.EVKLID_FREE_POOL_USD = "0.5";
  process.env.EVKLID_FREE_STUDENT_USD = "0";
  try {
    await withServer(async ({ client, calls, store }) => {
      const a = client();
      await registerVerified(a, calls, "meja@primer.si");
      const kid = (await a("/api/students", { method: "POST", body: { name: "Tia", birth_year: YEAR - 10, consent: true } })).body;
      const conv = (await a(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
      const ask = (t) => a(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: t } });
      // Med preizkusom meja brezplačnega paketa ne velja (preizkus ima svojo mejo, server/meje-ai.js).
      assert.equal((await ask("prvo")).status, 200);
      store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku', 'chat', 0.6)").run(kid.id);
      store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();
      const pool = await ask("drugo");
      assert.equal(pool.status, 429);
      assert.match(pool.body.error, /za vse porabljena/);
      assert.equal(pool.body.code, "block.freePool");
      process.env.EVKLID_FREE_POOL_USD = "0";
      process.env.EVKLID_FREE_STUDENT_USD = "0.5";
      const per = await ask("tretje");
      assert.equal(per.status, 429);
      assert.match(per.body.error, /Ta mesec si porabil/);
      assert.equal(per.body.code, "block.freeMonth");
      process.env.EVKLID_FREE_STUDENT_USD = "0";
      assert.equal((await ask("četrto")).status, 200);
    });
  } finally {
    delete process.env.EVKLID_FREE_POOL_USD;
    delete process.env.EVKLID_FREE_STUDENT_USD;
  }
});

test("checkout carries remaining app trial into Stripe", async () => {
  await withServer(async ({ client, calls }) => {
    const a = client();
    await registerVerified(a, calls, "dani@primer.si");
    await a("/api/billing/checkout", { method: "POST", body: { seats: 2, interval: "month", adult: true, withdrawal: true } });
    const session = calls.find((c) => c.path === "/v1/checkout/sessions");
    assert.equal(session.body["line_items[0][price]"], "price_evklid_druzina_month", "Družina namesto »2 otroka«");
    const days = (Number(session.body["subscription_data[trial_end]"]) * 1000 - Date.now()) / 86400000;
    assert.ok(days > 6.9 && days <= 7, String(days));
  });
});

test("referral: both parents get a free month after the first payment", async () => {
  await withServer(async ({ client, calls, store }) => {
    const a = client();
    const ref = await registerVerified(a, calls, "eva@primer.si");
    const b = client();
    const reg = await b("/api/auth/register", { method: "POST", body: { email: "fran@primer.si", password: "geslo1234", accept_privacy: true, birth_date: ADULT, referral_code: ref.referral_code.toLowerCase() } });
    assert.equal(reg.body.referred, true);
    await b("/api/billing/checkout", { method: "POST", body: { seats: 2, interval: "month", adult: true, withdrawal: true } });
    const customer = store.db.prepare("SELECT stripe_customer_id FROM parents WHERE email = 'fran@primer.si'").get().stripe_customer_id;

    const send = (status) => {
      const raw = JSON.stringify({
        type: "customer.subscription.updated",
        data: { object: { id: "sub_9", customer, status, items: { data: [{ price: { lookup_key: "evklid_2_month" }, current_period_end: 1893456000 }] } } },
      });
      return client()("/api/stripe/webhook", { method: "POST", raw, headers: { "stripe-signature": signWebhook(raw, SECRET) } });
    };
    await send("trialing");
    assert.equal(calls.filter((c) => c.path.endsWith("/balance_transactions")).length, 0); // še ni plačal
    await send("active");
    await send("active"); // ponovljen dogodek ne nagradi dvakrat

    const credits = calls.filter((c) => c.path.endsWith("/balance_transactions"));
    assert.equal(credits.length, 1);
    assert.equal(credits[0].body.amount, "-1599"); // povabljeni (stari paket »2 otroka«): dobropis v višini mesečne naročnine
    const referrer = (await a("/api/account")).body;
    assert.equal(referrer.referral.rewards, 1);
    assert.equal(referrer.access.tier, "trial"); // še v preizkusu, mesec se doda kot bonus
    const bonus = store.db.prepare("SELECT bonus_until FROM parents WHERE email = 'eva@primer.si'").get().bonus_until;
    assert.ok(Date.parse(bonus) > Date.now() + 29 * 86400000);
  });
});

test("weekly report, export and account deletion", async () => {
  await withServer(async ({ client, calls, store }) => {
    const a = client();
    await registerVerified(a, calls, "gal@primer.si");
    const kid = (await a("/api/students", { method: "POST", body: { name: "Zala", birth_year: YEAR - 13, consent: true, vir: "Šola Bežigrad" } })).body;
    store.db.prepare("INSERT INTO xp_events (student_id, amount, reason) VALUES (?, 40, 'test')").run(kid.id);

    const preview = await a("/api/account/weekly-report/preview");
    assert.match(preview.body, /Zala/);
    assert.match(preview.body, /Naslednji koraki/);
    assert.match(preview.body, /1 dan vaje/);
    const sent = await a("/api/account/weekly-report/send", { method: "POST" });
    assert.equal(sent.status, 200);
    const mail = calls.filter((c) => c.host === "api.resend.com").at(-1);
    assert.equal(mail.body.to[0], "gal@primer.si");
    assert.match(mail.body.subject, /Zala/);

    // Odjava od poročil prek povezave.
    const unsub = /\/api\/account\/unsubscribe\?token=[\w-]+/.exec(mail.body.text)[0];
    await client()(unsub);
    assert.equal((await a("/api/account")).body.parent.weekly_email, false);

    const consent = store.db.prepare("SELECT * FROM consents WHERE student_id = ?").get(kid.id);
    assert.equal(consent.under_15, 1);
    assert.equal(consent.parent_email, "gal@primer.si");

    const kidConv = store.createConversation(kid.id);
    store.setSummary(kidConv.id, "Rešujeta 2x = 10", 20);
    assert.equal((await a("/api/account/export")).status, 404);
    assert.equal((await a("/api/account/export", { method: "POST", body: { password: "narobe123" } })).status, 401);
    store.db.prepare("INSERT INTO game_scores (student_id, game, best, plays) VALUES (?, 'numline:frac', 12, 3)").run(kid.id);
    store.db.prepare("INSERT INTO daily_puzzle (student_id, day, level, started_at, solved, total_ms) VALUES (?, '2026-11-04', 'easy', 1, 1, 42000)").run(kid.id);
    const exp = await a("/api/account/export", { method: "POST", body: { password: "geslo1234" } });
    assert.equal(exp.body.children[0].name, "Zala");
    assert.equal(exp.body.children[0].vir, "sola-bezigrad", "vir profila (server/rast.js) je v izvozu");
    assert.equal(exp.body.parent.password_hash, undefined);
    assert.deepEqual(exp.body.children[0].reports, [], "prijave napak so v izvozu");
    const games = exp.body.children[0].games;
    assert.equal(games.scores[0].best, 12, "rezultati iger so v izvozu");
    assert.equal(games.daily_puzzle[0].total_ms, 42000, "dnevna uganka je v izvozu");
    assert.ok(Array.isArray(games.concept_days) && Array.isArray(games.ratings));
    assert.equal(exp.body.children[0].conversations.find((c) => c.id === kidConv.id).summary, "Rešujeta 2x = 10", "povzetek pogovora je v izvozu");

    assert.equal((await a("/api/account", { method: "DELETE", body: { password: "narobe123" } })).status, 401);
    assert.equal((await a("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM students").get().n, 0);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM consents").get().n, 0);
    assert.equal((await a("/api/account")).status, 401);
  });
});

test("weekly scheduler sends once per week", async () => {
  const { mountAccounts } = await import("../server/accounts/index.js");
  const express = (await import("express")).default;
  const store = openDb(":memory:");
  const calls = [];
  const api = mountAccounts(express(), store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn: fakeFetch(calls), log: { error() {} } });
  store.db.prepare(
    "INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code, email_verified_at) VALUES ('i@p.si', 'x', 'v', 't', 'C1', '2026-01-01')",
  ).run();
  const s = store.createStudent("Ivo");
  store.db.prepare("UPDATE students SET parent_id = 1 WHERE id = ?").run(s.id);
  // Dva tedna brez vaje: poročila ne pošljemo.
  assert.equal(await api.sendWeeklyAll(), 0);
  store.db.prepare("INSERT INTO xp_events (student_id, amount, reason) VALUES (?, 10, 'test')").run(s.id);
  assert.equal(await api.sendWeeklyAll(), 1);
  assert.equal(await api.sendWeeklyAll(), 0);
});

test("weekly report: what was learned, weak spots, next steps, Slovenian plurals", async () => {
  const { buildWeeklyReport, plural, headline, isQuiet } = await import("../server/accounts/weekly.js");
  const store = openDb(":memory:");
  const s = store.createStudent("Zala", { educational_track: "OSNOVNA_SOLA", curriculum_level: "6. razred", subject: "MAT" });
  const db = store.db;
  const topic = "MAT-OS-6/zapis-in-urejanje-velikih-stevil";
  const task = db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, attempts, solved, first_try_correct) VALUES (?, ?, 1, '{}', 1, 1, ?)");
  for (const ok of [0, 0, 1, 0]) task.run(s.id, topic, ok);
  db.prepare("INSERT INTO topic_state (student_id, topic_id, status, mastered_at) VALUES (?, ?, 'mastered', datetime('now'))").run(s.id, "MAT-OS-6/ulomki");
  const r = buildWeeklyReport(db, { name: "" }, [store.getStudent(s.id)], { appUrl: "https://x/", unsubscribeUrl: "https://x/u" });
  const w = r.children[0];
  assert.equal(w.solved, 4);
  assert.equal(w.accuracy, 25);
  assert.match(w.weak[0].name, /velikih števil/);
  assert.match(r.html, /Snov tega tedna/);
  assert.match(r.html, /Matematika/);
  assert.match(r.html, /Še vaditi/);
  assert.match(r.html, /Za pogovor doma/);
  assert.match(r.subject, /^Zala ta teden: 1 dan vaje/);
  assert.equal(r.quiet, false);
  // Profil »Zame«: brez nasvetov za starše.
  const me = buildWeeklyReport(db, { name: "" }, [store.getStudent(s.id)], { appUrl: "https://x/", unsubscribeUrl: "https://x/u", selfIds: [s.id] });
  assert.doesNotMatch(me.html, /Za pogovor doma/);
  assert.match(me.html, /Živjo, Zala/);
  assert.deepEqual([1, 2, 3, 5, 101, 102, 111].map((n) => plural(n, ["naloga", "nalogi", "naloge", "nalog"])), [
    "1 naloga", "2 nalogi", "3 naloge", "5 nalog", "101 naloga", "102 nalogi", "111 nalog",
  ]);
  assert.equal(headline({ active_days: 0 }), "Ta teden ni bilo vaje.");
  assert.equal(isQuiet({ active_days: 0, prev_active_days: 1 }), false);
  // Graf po dnevih: vsota stolpcev = rešene naloge + vprašanja, višine v celicah (Outlook), največji dan = 64 px.
  assert.equal(w.strip.length, 7);
  assert.equal(w.strip.reduce((n, d) => n + d.tasks, 0), w.solved);
  const { barsHtml } = await import("../server/accounts/weekly.js");
  const bars = barsHtml([{ label: "po", active: true, tasks: 6, asked: 2 }, { label: "to", active: true, tasks: 0, asked: 0 }, { label: "sr", active: false, tasks: 0, asked: 0 }]);
  assert.match(bars, /height="16" bgcolor="#b4c0f8"/);
  assert.match(bars, /height="48" bgcolor="#4f6bed"/);
  assert.match(bars, />8</);
  assert.match(bars, /✓/); // dejaven dan brez nalog
  assert.doesNotMatch(bars, /<div style="height/);
});

test("helpers: webhook signature, form encoding, access, week key", () => {
  const sig = signWebhook("{}", SECRET);
  assert.ok(verifyWebhook("{}", sig, SECRET));
  assert.ok(!verifyWebhook("{ }", sig, SECRET));
  assert.ok(!verifyWebhook("{}", signWebhook("{}", SECRET, 1000), SECRET));
  assert.equal(formEncode({ a: { b: 1 }, c: [{ d: 2 }], e: ["x"] }).toString(), "a%5Bb%5D=1&c%5B0%5D%5Bd%5D=2&e%5B0%5D=x");

  const now = Date.parse("2026-10-27T12:00:00Z");
  assert.equal(accessFor({ sub_status: "active", sub_seats: 2 }, now).tier, "paid");
  assert.equal(accessFor({ sub_status: "canceled", trial_ends_at: "2026-10-30T00:00:00Z" }, now).tier, "trial");
  assert.equal(accessFor({ bonus_until: "2026-11-30T00:00:00Z" }, now).tier, "bonus");
  assert.equal(accessFor({}, now).tier, "free");
  assert.ok(isPremiumChild({ seats: 1 }, [5, 3], 3));
  assert.ok(!isPremiumChild({ seats: 1 }, [5, 3], 5));

  assert.equal(weekKey(new Date("2026-10-27T12:00:00Z")), "2026-W44");
  assert.equal(weekKey(new Date("2027-01-01T12:00:00Z")), "2026-W53");
  assert.ok(isSendTime(new Date("2026-10-25T17:30:00Z"))); // nedelja 18:30 v Ljubljani
  assert.ok(!isSendTime(new Date("2026-10-26T17:30:00Z")));
});

test("anti-sharing: seats per plan, one profile swap per 30 days", async () => {
  await withServer(async ({ client, calls, store }) => {
    const a = client();
    await registerVerified(a, calls, "jan@primer.si");
    const add = (name) => a("/api/students", { method: "POST", body: { name, birth_year: YEAR - 11, consent: true } });
    // Preizkus: 2 profila.
    const k1 = (await add("Ana")).body;
    assert.equal((await add("Bor")).status, 201);
    const third = await add("Cene");
    assert.equal(third.status, 400);
    assert.equal(third.body.seats, true);

    // Menjava: izbris + nov profil je dovoljen enkrat.
    assert.equal((await a(`/api/students/${k1.id}`, { method: "DELETE" })).status, 200);
    const k3 = await add("Cene");
    assert.equal(k3.status, 201);
    await a(`/api/students/${k3.body.id}`, { method: "DELETE" });
    const again = await add("Dan");
    assert.equal(again.status, 400);
    assert.equal(again.body.swap, true);
    assert.ok((await a("/api/account")).body.swap_blocked_until);

    // Po 30 dneh spet gre.
    store.db.prepare("UPDATE profile_changes SET created_at = datetime('now','-31 days')").run();
    assert.equal((await add("Dan")).status, 201);

    // Brezplačni paket: samo 1 profil.
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();
    store.db.prepare("UPDATE profile_changes SET created_at = datetime('now','-31 days')").run();
    const kids = (await a("/api/students")).body;
    await a(`/api/students/${kids[0].id}`, { method: "DELETE" });
    await a(`/api/students/${kids[1].id}`, { method: "DELETE" });
    store.db.prepare("UPDATE profile_changes SET created_at = datetime('now','-31 days')").run();
    assert.equal((await add("Eva")).status, 201);
    assert.equal((await add("Fran")).body.seats, true);
  });
});

test("anti-sharing: a profile is open on one device at a time", async () => {
  await withServer(async ({ client, calls, store }) => {
    const phone = client();
    await registerVerified(phone, calls, "kaja@primer.si");
    const kid = (await phone("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 12, consent: true } })).body;
    assert.equal((await phone(`/api/students/${kid.id}/xp`)).status, 200);

    // Isti račun na drugi napravi (drug piškotek naprave).
    const tablet = client();
    assert.equal((await tablet("/api/auth/login", { method: "POST", body: { email: "kaja@primer.si", password: "geslo1234" } })).status, 200);
    assert.equal((await tablet("/api/students")).body.length, 1); // seznam profilov je viden
    const blocked = await tablet(`/api/students/${kid.id}/xp`);
    assert.equal(blocked.status, 409);
    assert.equal(blocked.body.taken, true);

    // Prevzem: tablica nadaljuje, telefon se ustavi.
    assert.equal((await tablet(`/api/students/${kid.id}/claim`, { method: "POST" })).status, 200);
    assert.equal((await tablet(`/api/students/${kid.id}/xp`)).status, 200);
    assert.equal((await phone(`/api/students/${kid.id}/xp`)).status, 409);
    const conv = (await tablet(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
    assert.equal((await phone(`/api/conversations/${conv.id}`)).status, 409);

    // Po 30 minutah nedejavnosti lahko druga naprava nadaljuje brez prevzema.
    store.db.prepare("UPDATE profile_claims SET last_seen = last_seen - 31 * 60000").run();
    assert.equal((await phone(`/api/students/${kid.id}/xp`)).status, 200);

    const acc = (await phone("/api/account")).body;
    assert.equal(acc.children[0].devices.length, 2);
    assert.equal(acc.device_warn_limit, 3);

    // Odjava z drugih naprav: tablica izgubi prijavo.
    await phone("/api/account/logout-others", { method: "POST" });
    assert.equal((await tablet("/api/students")).status, 401);
    assert.equal((await phone("/api/students")).status, 200);
  });
});

test("profile password: each profile has its own, once per device, locks other devices, owner can reset", async () => {
  await withServer(async ({ client, calls }) => {
    const phone = client();
    await registerVerified(phone, calls, "mia@primer.si");
    const add = (name, extra = {}) => phone("/api/students", { method: "POST", body: { name, birth_year: YEAR - 12, consent: true, ...extra } });
    assert.equal((await add("Prekratko", { profile_password: "123" })).status, 400);
    const ana = (await add("Ana", { profile_password: "ana-1" })).body;
    const bor = (await add("Bor")).body; // brez gesla: aplikacija ga zahteva ob prvem odprtju
    let list = (await phone("/api/students")).body;
    // Bor je bil ustvarjen zadnji; Ana se je ob tem na tej napravi ne zaklene (Bor nima gesla).
    assert.equal(list.find((s) => s.id === ana.id).needs_password, false);
    assert.equal(list.find((s) => s.id === bor.id).needs_password, true);
    assert.equal(JSON.stringify(list).includes("hash"), false);
    assert.equal((await phone(`/api/students/${bor.id}/xp`)).status, 200); // profil brez gesla ni zaklenjen

    // Prvo geslo za Bora: samo z set: true in vsaj 4 znaki.
    assert.equal((await phone(`/api/students/${bor.id}/unlock`, { method: "POST", body: { password: "bor-1" } })).status, 409);
    assert.equal((await phone(`/api/students/${bor.id}/unlock`, { method: "POST", body: { password: "12", set: true } })).status, 400);
    assert.equal((await phone(`/api/students/${bor.id}/unlock`, { method: "POST", body: { password: "bor-1", set: true } })).status, 200);
    assert.equal((await phone(`/api/students/${bor.id}/unlock`, { method: "POST", body: { password: "drugo", set: true } })).status, 401);

    // Geslo samo enkrat na napravo (j, 2026-10-30): odklep Bora ne zaklene Ane, menjava profila brez gesla.
    assert.equal((await phone(`/api/students/${ana.id}/xp`)).status, 200);
    const conv = (await phone(`/api/students/${ana.id}/conversations`, { method: "POST" })).body;
    assert.equal((await phone(`/api/students/${bor.id}/xp`)).status, 200);

    // Druga naprava: prijava v račun ne odpre profila; tudi pogovora ne.
    const tablet = client();
    assert.equal((await tablet("/api/auth/login", { method: "POST", body: { email: "mia@primer.si", password: "geslo1234" } })).status, 200);
    const locked = await tablet(`/api/students/${ana.id}/xp`);
    assert.equal(locked.status, 423);
    assert.equal(locked.body.locked, true);
    assert.equal(locked.body.name, "Ana");
    list = (await tablet("/api/students")).body;
    assert.deepEqual(Object.keys(list.find((s) => s.id === ana.id)).sort(), ["id", "locked", "name"]);
    assert.equal((await tablet(`/api/conversations/${conv.id}`)).status, 423);
    assert.equal((await tablet(`/api/students/${ana.id}/claim`, { method: "POST" })).status, 423);
    // Express ujema poti brez ozira na velike črke in dekodira parametre: tudi tako ostane profil zaklenjen.
    const enc = String(ana.id).replace(/\d/g, (d) => `%3${d}`);
    assert.equal((await tablet(`/api/STUDENTS/${ana.id}/xp`)).status, 423);
    assert.equal((await tablet(`/api/Conversations/${conv.id}`)).status, 423);
    assert.equal((await tablet(`/api/students/${enc}/xp`)).status, 404);
    assert.equal((await tablet(`/api/students/0x${ana.id.toString(16)}`)).status, 404);

    // Pozabljeno geslo: lastnik ga ponastavi z geslom računa; nato je profil zaklenjen povsod.
    const reset = (auth, password) => tablet("/api/account/profile-password", { method: "POST", body: { student_id: ana.id, auth, password } });
    assert.equal((await reset("narobe", "nova-ana")).status, 401);
    assert.equal((await reset("geslo1234", "ab")).status, 400);
    assert.equal((await reset("geslo1234", "nova-ana")).status, 200);
    assert.equal((await phone(`/api/students/${ana.id}/xp`)).status, 423);
    assert.equal((await phone(`/api/students/${ana.id}/unlock`, { method: "POST", body: { password: "ana-1" } })).status, 401);
    // Sprememba s sedanjim geslom profila (brez gesla računa).
    assert.equal((await reset("nova-ana", "tretja-ana")).status, 200);
    assert.equal((await tablet(`/api/students/${ana.id}/unlock`, { method: "POST", body: { password: "tretja-ana" } })).status, 200);
    assert.equal((await tablet(`/api/students/${ana.id}/xp`)).status, 409); // telefon ima profil še odprt → prevzem
    assert.equal((await tablet(`/api/students/${ana.id}/claim`, { method: "POST" })).status, 200);
    assert.equal((await tablet(`/api/students/${ana.id}/xp`)).status, 200);
    assert.equal((await tablet("/api/account")).body.children.every((c) => c.has_password), true);

    // Tuj profil: ni ga mogoče odkleniti ne ponastaviti.
    const other = client();
    await registerVerified(other, calls, "tuj@primer.si");
    assert.equal((await other(`/api/students/${ana.id}/unlock`, { method: "POST", body: { password: "tretja-ana" } })).status, 404);
    assert.equal((await other(`/api/students/${enc}/unlock`, { method: "POST", body: { password: "x1234", set: true } })).status, 404);
    assert.equal((await other(`/api/students/${enc}`)).status, 404);
    assert.equal((await other(`/api/Students/${ana.id}`)).status, 404);
    assert.equal((await other("/api/account/profile-password", { method: "POST", body: { student_id: ana.id, auth: "geslo1234", password: "x1234" } })).status, 404);

    // Geslo samo enkrat: po odjavi in ponovni prijavi z geslom računa profil ne zahteva gesla znova
    // (kdor pozna geslo računa, lahko geslo profila tako ali tako ponastavi). Brez seje pa nič ni dostopno.
    assert.equal((await tablet(`/api/students/${ana.id}/unlock`, { method: "POST", body: { password: "tretja-ana" } })).status, 200);
    await tablet("/api/auth/logout", { method: "POST" });
    assert.equal((await tablet(`/api/students/${ana.id}/xp`)).status, 401);
    assert.equal((await tablet("/api/auth/login", { method: "POST", body: { email: "mia@primer.si", password: "geslo1234" } })).status, 200);
    assert.equal((await tablet(`/api/students/${ana.id}/xp`)).status, 200);
    // »Odjavi vse druge naprave« pa profile drugod zaklene.
    await phone("/api/account/logout-others", { method: "POST" });
    assert.equal((await phone(`/api/students/${bor.id}/unlock`, { method: "POST", body: { password: "bor-1" } })).status, 200);
    await phone("/api/account/logout-others", { method: "POST" });
    assert.equal((await tablet("/api/students")).status, 401);
  });
});

test("profile password: guests are never locked", async () => {
  await withGuests(async ({ client }) => {
    const g = client();
    assert.equal((await guestStart(g)).status, 201);
    await guestKid(g);
    const kid = (await g("/api/students")).body[0];
    assert.equal(kid.needs_password, undefined);
    assert.equal((await g(`/api/students/${kid.id}/xp`)).status, 200);
    assert.equal((await g(`/api/students/${kid.id}/unlock`, { method: "POST", body: {} })).status, 200);
    assert.equal((await g("/api/account/profile-password", { method: "POST", body: { student_id: kid.id, auth: "", password: "abcd" } })).status, 403);
  });
});

test("brez e-pošte: povezava za potrditev in novo geslo samo na računalniku s strežnikom; omejitev registracij", async () => {
  await withServer(
    async ({ client }) => {
      const remote = { "X-Forwarded-For": "203.0.113.9" };
      const body = (email) => ({ email, password: "geslo1234", accept_privacy: true, birth_date: ADULT });
      const local = await client()("/api/auth/register", { method: "POST", body: body("doma@primer.si") });
      assert.match(local.body.dev_verify_url, /\/api\/auth\/verify\?token=/);
      const far = await client()("/api/auth/register", { method: "POST", body: body("tujec@primer.si"), headers: remote });
      assert.equal(far.status, 201);
      assert.equal(far.body.dev_verify_url, undefined);
      // Pozabljeno geslo: od drugod nikoli povezave v odgovoru (prevzem tujega računa).
      const forgot = await client()("/api/auth/forgot", { method: "POST", body: { email: "doma@primer.si" }, headers: remote });
      assert.equal(forgot.body.dev_reset_url, undefined);
      assert.match((await client()("/api/auth/forgot", { method: "POST", body: { email: "doma@primer.si" } })).body.dev_reset_url, /\?reset=/);
      // Povezave za novo geslo: največ 5 na uro za isti e-naslov (ne zasujemo nabiralnika).
      for (let i = 0; i < 3; i++) assert.equal((await client()("/api/auth/forgot", { method: "POST", body: { email: "doma@primer.si" } })).status, 200);
      assert.equal((await client()("/api/auth/forgot", { method: "POST", body: { email: "doma@primer.si" } })).status, 429);
      // Največ 5 novih računov z enega naslova na dan (prvi je že zgoraj).
      for (let i = 0; i < 4; i++) assert.equal((await client()("/api/auth/register", { method: "POST", body: body(`r${i}@primer.si`), headers: remote })).status, 201);
      assert.equal((await client()("/api/auth/register", { method: "POST", body: body("r9@primer.si"), headers: remote })).status, 429);
      // IPv6: vsi naslovi istega /64 štejejo skupaj.
      for (let i = 1; i <= 5; i++) assert.equal((await client()("/api/auth/register", { method: "POST", body: body(`v${i}@primer.si`), headers: { "X-Forwarded-For": `2001:db8:1:2::${i}` } })).status, 201);
      assert.equal((await client()("/api/auth/register", { method: "POST", body: body("v6@primer.si"), headers: { "X-Forwarded-For": "2001:db8:1:2:abcd::9" } })).status, 429);
      assert.equal((await client()("/api/auth/register", { method: "POST", body: body("v7@primer.si"), headers: { "X-Forwarded-For": "2001:db8:1:3::1" } })).status, 201);
    },
    { resendKey: "" },
  );
});

test("odjava z obrazcem (brez skripta) preusmeri na prijavo", async () => {
  await withServer(async ({ client, calls }) => {
    const a = client();
    await registerVerified(a, calls, "obrazec@primer.si");
    const r = await a("/api/auth/logout", { method: "POST", headers: { Accept: "text/html", "Content-Type": "application/x-www-form-urlencoded" } });
    assert.equal(r.status, 303);
    assert.equal(r.headers.get("location"), "/");
    assert.equal((await a("/api/students")).status, 401);
  });
});

test("textbook: interactive part only with a paid plan or trial; PDF is public", async () => {
  await withServer(async ({ client, calls, store, base }) => {
    const a = client();
    await registerVerified(a, calls, "uci@primer.si");
    const kid = (await a("/api/students", { method: "POST", body: { name: "Eva", birth_year: YEAR - 13, consent: true } })).body;
    const url = `/api/students/${kid.id}/lesson?id=MAT-OS-8/pitagorov-izrek`;
    const trial = (await a(url)).body;
    assert.equal(trial.interactive, true);
    assert.equal(trial.demo.id, "pitagora");
    assert.ok((await a(`/api/students/${kid.id}/lab`)).body.experiments.every((x) => !x.locked && x.id), "preizkus odklene laboratorij");

    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();
    const free = (await a(url)).body;
    assert.equal(free.interactive, false);
    assert.equal(free.demo, null);
    assert.equal(free.locked.demo, "Pitagorov izrek s kvadrati");
    assert.ok(free.lesson.sections.length > 3, "besedilo ostane brezplačno");
    // Zavihek Laboratorij: isti zaklep (brez simulacije, s pravili ponudb za »Poglej pakete«).
    const lab = (await a(`/api/students/${kid.id}/lab`)).body;
    assert.ok(lab.experiments.length >= 2 && lab.experiments.every((x) => x.locked && x.id === null && x.title && x.topics.length));
    assert.ok(lab.offers && "show" in lab.offers);
    // Laboratorij tujega profila, brez prijave ali z napačnim id: 4xx kot pri lekciji.
    const other = client();
    await registerVerified(other, calls, "tuj@primer.si");
    assert.equal((await other(`/api/students/${kid.id}/lab`)).status, 404);
    assert.equal((await client()(`/api/students/${kid.id}/lab`)).status, 401);
    for (const bad of ["__proto__", "abc", "%31", "1.5", "-1", "999999"]) assert.equal((await a(`/api/students/${bad}/lab`)).status, 404, bad);

    // Neprijavljen obiskovalec ne dobi lekcije prek API, PDF pa je javen.
    assert.equal((await client()(url)).status, 401);
    const pdf = await fetch(`${base}/ucbenik/MAT-OS-8`);
    assert.equal(pdf.status, 200);
  });
});

test("leagues with accounts: teacher's classes belong to the account; children join only their own", async () => {
  await withServer(async ({ client, calls }) => {
    const teacher = client();
    await registerVerified(teacher, calls, "ucitelj@sola.si");
    assert.equal((await client()("/api/classes", { method: "POST", body: { name: "8.b" } })).status, 401);
    const cls = (await teacher("/api/classes", { method: "POST", body: { name: "8.b" } })).body;
    assert.deepEqual((await teacher("/api/teacher/classes")).body.map((c) => c.code), [cls.code]);
    assert.equal((await teacher(`/api/classes/${cls.code}`)).status, 200); // brez ključa

    const parent = client();
    await registerVerified(parent, calls, "stars@primer.si");
    assert.equal((await parent(`/api/classes/${cls.code}`)).status, 403);
    const kidId = (await parent("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 12, consent: true } })).body.id;
    assert.equal((await parent(`/api/students/${kidId}/classes`, { method: "POST", body: { code: cls.code } })).status, 201);
    assert.equal((await teacher(`/api/students/${kidId}/league`)).status, 404); // tuj otrok
    assert.equal((await teacher(`/api/classes/${cls.code}`)).body.members.length, 1);
  });
});

test("sprememba cene: nova cena v Stripu, stara arhivirana; iskanje po največ 10 lookup_keys", async () => {
  const calls = [];
  const kv = new Map();
  kv.set("stripe_prices", JSON.stringify({ product: "prod_1", prices: { evklid_1_month: "price_old" }, amounts: { evklid_1_month: 899 } }));
  const fetchFn = async (url, init) => {
    const u = new URL(url);
    const body = init.body ? Object.fromEntries(new URLSearchParams(init.body)) : null;
    calls.push({ method: init.method, path: u.pathname, body });
    const ok = (data) => ({ ok: true, status: 200, json: async () => data });
    if (u.pathname === "/v1/prices" && init.method === "GET") {
      // Stara cena za 1 otroka (8,99 €), ostale so že prave.
      return ok({
        data: [
          { id: "price_old", lookup_key: "evklid_1_month", unit_amount: 899, product: "prod_1" },
          { id: "price_1y", lookup_key: "evklid_1_year", unit_amount: 9900, product: "prod_1" },
          { id: "price_2m", lookup_key: "evklid_2_month", unit_amount: 1599, product: "prod_1" },
          { id: "price_2y", lookup_key: "evklid_2_year", unit_amount: 13900, product: "prod_1" },
        ],
      });
    }
    if (u.pathname === "/v1/prices") return ok({ id: "price_new" });
    if (u.pathname === "/v1/prices/price_old") return ok({ id: "price_old", active: false });
    return { ok: false, status: 404, json: async () => ({ error: { message: "ni" } }) };
  };
  const stripe = new Stripe({ secretKey: "sk_test_x", fetchFn, kv: { get: (k) => kv.get(k), set: (k, v) => kv.set(k, v) } });
  const r = await stripe.ensurePrices();
  assert.equal(r.prices.evklid_1_month, "price_new");
  assert.equal(r.prices.evklid_1_year, "price_1y");
  const created = calls.find((c) => c.path === "/v1/prices" && c.method === "POST");
  assert.equal(created.body.unit_amount, "999");
  assert.equal(created.body.transfer_lookup_key, "true");
  assert.equal(calls.find((c) => c.path === "/v1/prices/price_old").body.active, "false");
  // Stripe sprejme največ 10 lookup_keys v enem GET /prices.
  const gets = calls.filter((c) => c.path === "/v1/prices" && c.method === "GET");
  assert.ok(gets.length >= 1);
  assert.equal(JSON.parse(kv.get("stripe_prices")).amounts.evklid_1_month, 999);
  // Drugi klic bere iz predpomnilnika.
  const n = calls.length;
  await stripe.ensurePrices();
  assert.equal(calls.length, n);
});


test("aktivacijska koda: poln dostop za prve N računov, enkrat na račun", async () => {
  const promo = { code: "EVKLID100", limit: 2, days: 365, seats: 1 };
  await withServer(async ({ client, calls, store }) => {
    // Ob registraciji (male črke, presledki), dostop po koncu preizkusa ostane.
    const a = client();
    const reg = await a("/api/auth/register", { method: "POST", body: { email: "a@kod.si", password: "geslo1234", accept_privacy: true, birth_date: ADULT, promo_code: " evklid100 " } });
    assert.equal(reg.status, 201);
    const days = (Date.parse(reg.body.promo_until) - Date.now()) / 86400000;
    assert.ok(days > 364.9 && days <= 365, String(days));
    let acc = (await a("/api/account")).body;
    assert.equal(acc.access.tier, "promo");
    assert.equal(acc.access.seats, 2); // med preizkusom ostaneta 2 profila
    assert.equal(acc.promo.redeemed, true);
    assert.equal(acc.promo.admin, undefined);
    store.db.prepare("UPDATE parents SET trial_ends_at = ? WHERE email = ?").run("2020-01-01T00:00:00Z", "a@kod.si");
    acc = (await a("/api/account")).body;
    assert.deepEqual([acc.access.tier, acc.access.seats], ["promo", 1]);
    // Drugič na istem računu ne gre.
    assert.equal((await a("/api/account/promo", { method: "POST", body: { code: "EVKLID100" } })).status, 400);

    // Napačna koda ne ustavi registracije.
    const b = client();
    const regB = await b("/api/auth/register", { method: "POST", body: { email: "b@kod.si", password: "geslo1234", accept_privacy: true, birth_date: ADULT, promo_code: "NAPAKA" } });
    assert.equal(regB.status, 201);
    assert.match(regB.body.promo_error, /ni veljavna/);
    assert.equal((await b("/api/account")).body.access.tier, "trial");
    // Pozneje v zavihku Račun.
    const ok = await b("/api/account/promo", { method: "POST", body: { code: "EVKLID100" } });
    assert.equal(ok.status, 200);
    assert.equal(ok.body.access.tier, "promo");

    // Limit 2 je dosežen.
    const c = client();
    await registerVerified(c, calls, "c@kod.si");
    const full = await c("/api/account/promo", { method: "POST", body: { code: "EVKLID100" } });
    assert.equal(full.status, 410);
    assert.match(full.body.error, /Vseh 2 aktivacij/);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM promo_redemptions").get().n, 2);

    // Preostanek kode se prenese v Stripe, da starš ne plača, dokler koda velja.
    store.db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = ?").run("a@kod.si");
    await a("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", adult: true, withdrawal: true } });
    const session = calls.find((x) => x.path === "/v1/checkout/sessions");
    const left = (Number(session.body["subscription_data[trial_end]"]) * 1000 - Date.now()) / 86400000;
    assert.ok(left > 364, String(left));
  }, { promo });
});

test("aktivacijska koda EVKLID3X: 3 meseci, zmogljivejši model največ Sonnet", async () => {
  const cfg = promoConfig({});
  assert.deepEqual([cfg.code, cfg.days, cfg.limit, cfg.maxModel], ["EVKLID3X", 90, 100, "sonnet"]);
  assert.equal(promoConfig({ EVKLID_PROMO_MODEL: "Opus" }).maxModel, null);
  const modes = [];
  const streamFn = async ({ mode, onText }) => {
    modes.push(mode);
    onText("ok");
    return { text: 'ok\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>', stopReason: "end_turn" };
  };
  const photoCaps = [];
  const schedulePhotoFn = async ({ capped }) => {
    photoCaps.push(capped);
    return { lessons: [], events: [], usage: null, model: "test" };
  };
  await withServer(async ({ client, calls, store }) => {
    const a = client();
    const reg = await registerVerified(a, calls, "sonnet@kod.si", { promo_code: "evklid3x" });
    const days = (Date.parse(store.db.prepare("SELECT promo_until FROM parents WHERE id = ?").get(reg.id).promo_until) - Date.now()) / 86400000;
    assert.ok(days > 89.9 && days <= 90, String(days));
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();
    const kid = (await a("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 10, consent: true } })).body;
    const conv = (await a(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
    const again = () => a(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "Razloži podrobneje.", deep: true } });
    // Prva ponovna razlaga: Haiku z več razmisleka; druga zapored: Sonnet namesto Opusa.
    assert.equal((await again()).status, 200);
    assert.equal((await again()).status, 200);
    assert.deepEqual(modes, ["think", "mid"]);
    // Tudi fotografija urnika ne gre k Opusu.
    const photo = () => a(`/api/students/${kid.id}/schedule/photo`, { method: "POST", body: { image: "data:image/jpeg;base64,AAAA" } });
    assert.equal((await photo()).status, 200);
    assert.deepEqual(photoCaps, [true]);
    // Tretja zaporedna prošnja: Opus. Novo sporočilo števec ponastavi.
    assert.equal((await again()).status, 200);
    assert.equal(modes.at(-1), "deep");
    await a(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "Hvala." } });
    await again();
    await again();
    assert.deepEqual(modes.slice(-3), ["chat", "think", "mid"]);
    // Skrita omejitev: 2 Opusa na dan (privzeto), nato tiho Sonnet.
    await again();
    assert.equal(modes.at(-1), "deep");
    const hidden = await again();
    assert.equal(modes.at(-1), "mid");
    assert.doesNotMatch(JSON.stringify(hidden.body), /zmogljivejš|hitrejši model/);
    // Z naročnino skrite omejitve ni: naslednja zaporedna prošnja (že nad 3.) gre k Opusu.
    store.db.prepare("UPDATE parents SET sub_status = 'active', sub_seats = 1 WHERE id = ?").run(reg.id);
    assert.equal((await again()).status, 200);
    assert.equal(modes.at(-1), "deep");
    await photo();
    assert.deepEqual(photoCaps, [true, false]);
  }, { promo: cfg, streamFn, schedulePhotoFn });
});

test("aktivacijska koda: skrbnik vidi porabo in povezavo", async () => {
  process.env.EVKLID_ADMIN_EMAILS = "skrbnik@kod.si";
  try {
    await withServer(async ({ client, calls, store }) => {
      const a = client();
      const old = store.createStudent("Iz časa pred računi");
      await a("/api/auth/register", { method: "POST", body: { email: "skrbnik@kod.si", password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
      // Skrbnik šele po potrditvi e-naslova (sicer bi se kdorkoli registriral s tem naslovom).
      assert.equal((await a("/api/usage", { headers: { "X-Forwarded-For": "1.2.3.4" } })).status, 403);
      assert.equal(store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(old.id).parent_id, null);
      await a(verifyLink(calls));
      assert.notEqual(store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(old.id).parent_id, null);
      assert.equal((await a("/api/usage", { headers: { "X-Forwarded-For": "1.2.3.4" } })).status, 200);
      const { admin } = (await a("/api/account")).body.promo;
      assert.equal(admin.code, "EVKLID3X");
      assert.deepEqual([admin.used, admin.limit, admin.days], [0, 100, 90]);
      assert.match(admin.url, /\/\?koda=EVKLID3X$/);
    });
  } finally {
    delete process.env.EVKLID_ADMIN_EMAILS;
  }
});

test("preverjanje starosti: premlad otrok dobi povezavo za starše, dijak ima samo svoj profil", async () => {
  const { minAgeOf, ageOn, parseBirthDate } = await import("../server/accounts/age.js");
  assert.equal(minAgeOf("SI"), 15);
  assert.equal(minAgeOf("US"), 15); // nikoli pod slovensko mejo
  assert.equal(minAgeOf("DE"), 16);
  assert.equal(minAgeOf("IN"), 18);
  assert.equal(parseBirthDate("2010-02-30"), null);
  assert.equal(ageOn("2010-06-15", new Date(Date.UTC(2025, 5, 14, 12))), 14);
  assert.equal(ageOn("2010-06-15", new Date(Date.UTC(2025, 5, 15, 12))), 15);
  // »Danes« po slovenskem času: 15. 6. ob 00:30 v Ljubljani je v UTC še 14. 6. (22:30), starost je že 15.
  assert.equal(ageOn("2010-06-15", new Date(Date.UTC(2025, 5, 14, 22, 30))), 15);
  assert.equal(ageOn("2010-06-15", new Date(Date.UTC(2025, 5, 14, 21, 30))), 14);

  const ymd = (yearsAgo) => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - yearsAgo);
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  };
  await withServer(async ({ client, calls, store }) => {
    const kid = client();
    const body = { email: "otrok@primer.si", password: "geslo1234", accept_privacy: true, country: "SI" };
    assert.equal((await kid("/api/auth/register", { method: "POST", body })).status, 400); // brez datuma
    const young = await kid("/api/auth/register", { method: "POST", body: { ...body, birth_date: ymd(12) } });
    assert.equal(young.status, 403);
    assert.equal(young.body.under_age, true);
    assert.equal(young.body.min_age, 15);
    // Nič ni shranjeno; drug datum na isti napravi deluje samo za polnoletne (starša).
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM parents").get().n, 0);
    assert.equal((await kid("/api/auth/register", { method: "POST", body: { ...body, birth_date: ymd(16) } })).status, 403);
    const parent = await kid("/api/auth/register", { method: "POST", body: { ...body, email: "stars@primer.si", birth_date: ymd(40) } });
    assert.equal(parent.status, 201);
    assert.equal(parent.body.parent.minor, false);

    // Strani za starše: cene brez prijave.
    const prices = await client()("/api/account/prices?country=SI");
    assert.equal(prices.status, 200);
    assert.equal(prices.body.currency, "EUR");
    assert.equal(prices.body.plans.length, 10);

    // Dijak (16) ustvari račun zase: samo en profil, letnica iz datuma rojstva.
    const teen = client();
    const reg = await teen("/api/auth/register", { method: "POST", body: { ...body, email: "dijak@primer.si", birth_date: ymd(16) } });
    assert.equal(reg.status, 201);
    assert.equal(reg.body.parent.minor, true);
    await teen(verifyLink(calls));
    const own = await teen("/api/students", { method: "POST", body: { name: "Jaka", birth_year: YEAR - 10, consent: true } });
    assert.equal(own.status, 201);
    assert.equal(own.body.birth_year, Number(ymd(16).slice(0, 4)));
    const consent = store.db.prepare("SELECT text FROM consents WHERE student_id = ?").get(own.body.id);
    assert.match(consent.text, /^Profil je moj/);
    const sibling = await teen("/api/students", { method: "POST", body: { name: "Brat", birth_year: YEAR - 8, consent: true } });
    assert.equal(sibling.status, 403);

    // Polnoleten dijak (npr. 18 let, SŠ) izbere »Zame«: lastno soglasje, letnica iz datuma rojstva.
    const adult = client();
    await registerVerified(adult, calls, "maturant@primer.si", { birth_date: ymd(18) });
    const mine = await adult("/api/students", { method: "POST", body: { name: "Tina", birth_year: YEAR - 9, self: true, consent: true } });
    assert.equal(mine.status, 201);
    assert.equal(mine.body.birth_year, Number(ymd(18).slice(0, 4)));
    assert.match(store.db.prepare("SELECT text FROM consents WHERE student_id = ?").get(mine.body.id).text, /^Profil je moj/);
    // Tedensko poročilo za »Zame« nagovori dijaka samega.
    assert.match((await adult("/api/account/weekly-report/preview")).body, /Živjo, Tina/);
    // Star račun brez datuma rojstva: »Zame« samo, če je letnica dovolj stara.
    store.db.prepare("UPDATE parents SET birth_date = NULL WHERE email = 'maturant@primer.si'").run();
    const tooYoung = await adult("/api/students", { method: "POST", body: { name: "Mlajši", birth_year: YEAR - 15, self: true, consent: true } });
    assert.equal(tooYoung.status, 403);
    assert.equal(tooYoung.body.self_too_young, true);
  });
});

// --- uporaba brez registracije (gost) ---
const guestStart = (call) => call("/api/auth/guest", { method: "POST", body: { accept_privacy: true } });
const guestKid = async (call, name = "Gost") => {
  const kid = await call("/api/students", { method: "POST", body: { name, birth_year: YEAR - 12, consent: true } });
  assert.equal(kid.status, 201, JSON.stringify(kid.body));
  return kid.body;
};

test("guest: use without registration, free tier, no e-mail", async () => {
  await withGuests(async ({ client }) => {
    const a = client();
    assert.equal((await a("/api/account/status")).body.guest_mode, true);
    assert.equal((await a("/api/auth/guest", { method: "POST", body: {} })).status, 400); // brez strinjanja z zasebnostjo
    // Naprava, zavrnjena pri registraciji zaradi starosti, tudi brez računa ne more naprej.
    const young = await client()("/api/auth/guest", { method: "POST", body: { accept_privacy: true }, headers: { cookie: "evklid_age=1" } });
    assert.equal(young.status, 403);
    const g = await guestStart(a);
    assert.equal(g.status, 201);
    assert.equal(g.body.parent.guest, true);
    assert.equal(g.body.parent.email, null);
    const st = (await a("/api/account/status")).body;
    assert.equal(st.logged_in, true);
    assert.equal(st.parent.guest, true);
    const kid = await guestKid(a); // brez potrditve e-naslova
    const acc = (await a("/api/account")).body;
    assert.equal(acc.access.tier, "free"); // gost nima preizkusa
    assert.equal(acc.max_children, 1);
    assert.equal((await a("/api/students", { method: "POST", body: { name: "Drugi", birth_year: YEAR - 12, consent: true } })).status, 400);
    assert.equal((await a("/api/account/weekly-report/send", { method: "POST" })).status, 400);
    assert.equal((await a("/api/auth/resend-verification", { method: "POST" })).status, 400);
    // Drug gost ne vidi tujega profila.
    const b = client();
    await guestStart(b);
    assert.equal((await b(`/api/students/${kid.id}`)).status, 404);
    // Gost izbriše vse brez gesla.
    assert.equal((await a("/api/account", { method: "DELETE", body: {} })).status, 200);
  });
});

test("guest: clearing cookies or deleting the profile does not give a new free allowance", async () => {
  process.env.EVKLID_FREE_DAILY_QUESTIONS = "2";
  try {
    await withGuests(async ({ client }) => {
      const a = client();
      await guestStart(a);
      const kid = await guestKid(a);
      const conv = (await a(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
      const ask = (call, c, t) => call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: t } });
      assert.equal((await ask(a, conv, "1")).status, 200);
      assert.equal((await ask(a, conv, "2")).status, 200);
      const blocked = await ask(a, conv, "3");
      assert.equal(blocked.status, 429);
      assert.match(blocked.body.error, /ustvari račun/);
      assert.equal(blocked.body.code, "block.freeDaily");
      assert.equal(blocked.body.hint, "block.hintGuest");

      // Nov gost z istega omrežja (izbrisani piškotki) deli isto kvoto.
      const b = client();
      await guestStart(b);
      const kidB = await guestKid(b);
      const convB = (await b(`/api/students/${kidB.id}/conversations`, { method: "POST" })).body;
      assert.equal((await ask(b, convB, "1")).status, 429);

      // Izbris pogovora kvote ne povrne.
      assert.equal((await a(`/api/conversations/${conv.id}`, { method: "DELETE" })).status, 200);
      const conv2 = (await a(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
      assert.equal((await ask(a, conv2, "4")).status, 429);
      // Nadgradnja brez potrditve e-naslova kvote ne povrne.
      const up = await b("/api/auth/upgrade", { method: "POST", body: { email: "lazni@primer.si", password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
      assert.equal(up.status, 200);
      assert.equal((await ask(b, convB, "x")).status, 429);
      // Tudi izbris profila ali vseh podatkov kvote ne povrne.
      assert.equal((await a(`/api/students/${kid.id}`, { method: "DELETE" })).status, 200);
      assert.equal((await a("/api/account", { method: "DELETE", body: {} })).status, 200);
      assert.equal((await ask(b, convB, "2")).status, 429);
      const c = client();
      await guestStart(c);
      const kidC = await guestKid(c);
      const convC = (await c(`/api/students/${kidC.id}/conversations`, { method: "POST" })).body;
      assert.equal((await ask(c, convC, "1")).status, 429);
    });
  } finally {
    delete process.env.EVKLID_FREE_DAILY_QUESTIONS;
  }
});

test("guest: monthly AI spend counts for the whole network, also after deletion", async () => {
  process.env.EVKLID_FREE_STUDENT_USD = "0.5";
  try {
    await withGuests(async ({ client, store }) => {
      const a = client();
      await guestStart(a);
      const kid = await guestKid(a);
      store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku', 'chat', 0.6)").run(kid.id);
      assert.equal((await a("/api/account", { method: "DELETE", body: {} })).status, 200);
      const b = client();
      await guestStart(b);
      const kidB = await guestKid(b);
      const conv = (await b(`/api/students/${kidB.id}/conversations`, { method: "POST" })).body;
      const r = await b(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "x" } });
      assert.equal(r.status, 429);
      assert.match(r.body.error, /Ta mesec si porabil/);
      assert.equal(r.body.code, "block.freeMonth");
      assert.equal(r.body.hint, "block.hintGuest");
    });
  } finally {
    delete process.env.EVKLID_FREE_STUDENT_USD;
  }
});

test("guest: limited number of new guests per network per day (deleted guests count too)", async () => {
  process.env.EVKLID_GUEST_PER_DAY = "2";
  try {
    await withGuests(async ({ client }) => {
      const first = client();
      assert.equal((await guestStart(first)).status, 201);
      assert.equal((await first("/api/account", { method: "DELETE", body: {} })).status, 200);
      assert.equal((await guestStart(client())).status, 201);
      const third = await guestStart(client());
      assert.equal(third.status, 429);
      assert.equal(third.body.guest_limit, true);
    });
  } finally {
    delete process.env.EVKLID_GUEST_PER_DAY;
  }
});

test("guest: upgrade to an account keeps the profile and progress", async () => {
  await withGuests(async ({ client, calls, store }) => {
    const a = client();
    await guestStart(a);
    const kid = await guestKid(a, "Nika");
    const conv = (await a(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
    assert.equal((await a(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "živjo" } })).status, 200);
    assert.equal((await a("/api/auth/upgrade", { method: "POST", body: { email: "nika@primer.si", password: "kratko", accept_privacy: true, birth_date: ADULT } })).status, 400);
    const up = await a("/api/auth/upgrade", { method: "POST", body: { email: "Nika@Primer.si", password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
    assert.equal(up.status, 200, JSON.stringify(up.body));
    assert.equal(up.body.parent.guest, false);
    assert.equal(up.body.parent.email, "nika@primer.si");
    const kids = (await a("/api/students")).body;
    assert.deepEqual(kids.map((k) => k.id), [kid.id]);
    assert.equal((await a(`/api/conversations/${conv.id}`)).status, 200);
    // Do potrditve e-naslova ostane brezplačni paket (ni preizkusa, ni aktivacijske kode).
    assert.equal((await a("/api/account")).body.access.tier, "free");
    assert.equal((await a("/api/account/promo", { method: "POST", body: { code: "EVKLID100" } })).status, 403);
    assert.equal((await a("/api/auth/upgrade", { method: "POST", body: { email: "x@primer.si", password: "geslo1234", accept_privacy: true, birth_date: ADULT } })).status, 400);
    // E-naslov potrdi kot pri registraciji: šele nato 7-dnevni preizkus; prijava z geslom deluje.
    // Poraba gosta ostane šteta za omrežje (guest_spent), preden se račun odklopi od omrežja (pregled #462).
    store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku-5-5', 'chat', 0.05)").run(kid.id);
    await a(verifyLink(calls));
    assert.equal((await a("/api/account")).body.access.tier, "trial");
    assert.ok(store.db.prepare("SELECT COALESCE(SUM(usd),0) AS u FROM guest_spent").get().u >= 0.05 - 1e-9, "poraba gosta v kvoti omrežja");
    const b = client();
    assert.equal((await b("/api/auth/login", { method: "POST", body: { email: "nika@primer.si", password: "geslo1234" } })).status, 200);
    assert.equal((await b("/api/students")).body.length, 1);
    // Obstoječ e-naslov: nadgradnja ga ne prevzame.
    const c = client();
    await guestStart(c);
    const dup = await c("/api/auth/upgrade", { method: "POST", body: { email: "nika@primer.si", password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
    assert.equal(dup.status, 409);
    assert.equal(dup.body.exists, true);
  });
});

test("guest: logging into an existing account moves the guest profile when there is room", async () => {
  await withGuests(async ({ client, calls, store }) => {
    const owner = client();
    await registerVerified(owner, calls, "lastnik@primer.si");
    const a = client();
    await guestStart(a);
    const kid = await guestKid(a, "Tim");
    const r = await a("/api/auth/login", { method: "POST", body: { email: "lastnik@primer.si", password: "geslo1234" } });
    assert.equal(r.status, 200);
    assert.equal(r.body.guest_moved, 1);
    assert.deepEqual((await owner("/api/students")).body.map((k) => k.id), [kid.id]);
    // Ni prostora v paketu (preizkus je potekel: 1 profil): prijava ne uspe, profil gosta ostane.
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z' WHERE email = 'lastnik@primer.si'").run();
    const b = client();
    await guestStart(b);
    await guestKid(b, "Ana");
    const full = await b("/api/auth/login", { method: "POST", body: { email: "lastnik@primer.si", password: "geslo1234" } });
    assert.equal(full.status, 409);
    assert.equal(full.body.guest_conflict, true);
    assert.equal((await b("/api/students")).body.length, 1);
    // Gost ne more do plačil ali aktivacijske kode.
    assert.equal((await b("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", adult: true, withdrawal: true } })).status, 403);
    assert.equal((await b("/api/account/promo", { method: "POST", body: { code: "EVKLID100" } })).status, 403);
  });
});

test("guest: switched off (default) stops guests but lets them create an account", async () => {
  await withServer(async ({ client, store }) => {
    const a = client();
    const off = await guestStart(a);
    assert.equal(off.status, 404);
    assert.equal((await a("/api/account/status")).body.guest_mode, false);
    // Gost, ustvarjen, ko je bil način še vklopljen.
    const id = Number(
      store.db
        .prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code, is_guest, guest_net) VALUES ('gost-x@gost.invalid', 'x', 'v', 'u', 'GOSTX12', 1, 'n')")
        .run().lastInsertRowid,
    );
    const { Sessions, COOKIE } = await import("../server/accounts/auth.js");
    const { token } = new Sessions(store.db).create(id);
    const b = (path, opts = {}) => a(path, { ...opts, headers: { cookie: `${COOKIE}=${token}` } });
    const r = await b("/api/students");
    assert.equal(r.status, 401);
    assert.equal(r.body.guest_off, true);
    const up = await b("/api/auth/upgrade", { method: "POST", body: { email: "pozno@primer.si", password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
    assert.equal(up.status, 200);
  });
});

test("guest mode is removed: off everywhere, EVKLID_GUEST cannot turn it on", async () => {
  const { guestModeOn, netKey } = await import("../server/accounts/guest.js");
  assert.equal(guestModeOn({}), false);
  assert.equal(guestModeOn({ NODE_ENV: "production", EVKLID_GUEST: "1" }), false);
  assert.equal(guestModeOn({ EVKLID_GUEST: "1" }), false);
  assert.equal(netKey("::ffff:10.0.0.7"), "10.0.0.7");
  assert.equal(netKey("2001:db8:1:2:aaaa::1"), netKey("2001:db8:1:2:bbbb:cccc:dddd:eeee"));
});

test("potrdi-racun.js potrdi e-naslov brez e-pošte (strežnik brez Resend)", async () => {
  const { confirmEmail } = await import("../scripts/potrdi-racun.js");
  const { migrateAccounts } = await import("../server/accounts/schema.js");
  const db = openDb(":memory:").db;
  migrateAccounts(db);
  db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code) VALUES (?, ?, ?, ?, ?)").run("Jaz@Primer.si", "x", "1", "u", "r");
  assert.deepEqual(confirmEmail(db, "nihce@primer.si"), { found: false });
  assert.deepEqual(confirmEmail(db, " jaz@primer.si "), { found: true, already: false });
  assert.ok(db.prepare("SELECT email_verified_at FROM parents").get().email_verified_at);
  assert.deepEqual(confirmEmail(db, "JAZ@primer.si"), { found: true, already: true });
});

test("account lock: owner actions need the account password on this device", async () => {
  await withServer(async ({ client, calls, store }) => {
    const a = client();
    await registerVerified(a, calls, "lastnik@primer.si");
    // Takoj po registraciji je naprava odklenjena.
    let st = (await a("/api/account/status")).body;
    assert.equal(st.account_lock, true);
    assert.equal(st.account_unlocked, true);
    const kid = (await a("/api/students", { method: "POST", body: { name: "Tine", birth_year: YEAR - 10, consent: true, profile_password: "tine1" } })).body;
    assert.ok(kid.id);

    // Zaklep (odhod iz zavihka Račun): otrok ne odpre računa, plačila, novega profila ali izbrisa.
    await a("/api/account/lock", { method: "POST" });
    st = (await a("/api/account/status")).body;
    assert.equal(st.account_unlocked, false);
    for (const [path, method, body] of [
      ["/api/account", "GET"],
      ["/API/Account/", "GET"],
      ["/api/account/export", "POST", { password: "x" }],
      ["/api/billing/checkout", "POST", { seats: 1, interval: "month" }],
      ["/api/billing/portal", "POST"],
      ["/api/account/logout-others", "POST"],
      ["/api/students", "POST", { name: "Drugi", birth_year: YEAR - 9, consent: true }],
      [`/api/students/${kid.id}`, "DELETE"],
    ]) {
      const r = await a(path, { method, body });
      assert.equal(r.status, 403, `${method} ${path}`);
      assert.equal(r.body.account_locked, true);
    }
    // Učenje deluje naprej (profil je odklenjen ob ustvarjanju na tej napravi).
    assert.equal((await a("/api/students")).status, 200);
    assert.equal((await a(`/api/students/${kid.id}/xp`)).status, 200);

    // Napačno geslo ne odklene, pravilno odklene.
    assert.equal((await a("/api/account/unlock", { method: "POST", body: { password: "narobe12" } })).status, 401);
    assert.equal((await a("/api/account")).status, 403);
    assert.equal((await a("/api/account/unlock", { method: "POST", body: { password: "geslo1234" } })).status, 200);
    assert.equal((await a("/api/account")).status, 200);

    // Odklep po EVKLID_ACCOUNT_UNLOCK_MIN (10) minutah nedejavnosti poteče.
    store.db.prepare("UPDATE account_unlocks SET expires_at = ?").run(Date.now() - 1);
    assert.equal((await a("/api/account")).status, 403);

    // Odklep velja samo za to napravo: nova prijava drugje jo odklene samo zase.
    const b = client();
    assert.equal((await b("/api/auth/login", { method: "POST", body: { email: "lastnik@primer.si", password: "geslo1234" } })).status, 200);
    assert.equal((await b("/api/account")).status, 200);
    assert.equal((await a("/api/account")).status, 403);
  }, { accountLock: true });
});

test("account lock: off by default (password only once, j 2026-10-30)", async () => {
  await withServer(async ({ client, calls }) => {
    const a = client();
    await registerVerified(a, calls, "brez@primer.si");
    await a("/api/account/lock", { method: "POST" });
    assert.equal((await a("/api/account")).status, 200);
    assert.equal((await a("/api/account/status")).body.account_lock, false);
    // Izvoz podatkov še vedno zahteva geslo računa.
    assert.equal((await a("/api/account/export", { method: "POST", body: { password: "narobe12" } })).status, 401);
  });
});

test("pošta: /healthz/stanje pove, ali Resend sprejema sporočila, brez e-naslovov", async () => {
  const { Mailer } = await import("../server/accounts/email.js");
  let ok = false;
  const fetchFn = async () =>
    ok
      ? new Response(JSON.stringify({ id: "m1" }), { status: 200 })
      : new Response(JSON.stringify({ message: "You can only send testing emails to your own email address (luka@example.com)." }), { status: 403 });
  const m = new Mailer({ apiKey: "re_x", fetchFn });
  await assert.rejects(m.send({ to: "luka@example.com", subject: "s", html: "h", text: "t" }));
  let s = m.status();
  assert.equal(s.nastavljena, true);
  assert.equal(s.napak, 1);
  assert.equal(s.poslanih, 0);
  assert.match(s.razlog, /^403 /);
  assert.doesNotMatch(s.razlog, /@/);
  ok = true;
  await m.send({ to: "luka@example.com", subject: "s", html: "h", text: "t" });
  s = m.status();
  assert.equal(s.poslanih, 1);
  assert.ok(s.zadnjiUspeh);
  assert.equal(new Mailer({ apiKey: "" }).status().nastavljena, false);

  const app = createApp(openDb(":memory:"), { accounts: true, scheduler: false, resendKey: "" });
  const server = app.listen(0);
  try {
    const st = await (await fetch(`http://127.0.0.1:${server.address().port}/healthz/stanje`)).json();
    assert.equal(st.posta.nastavljena, false);
    assert.equal(st.posta.napak, 0);
  } finally {
    server.close();
  }
});

test("premlad za račun: Evklid pošlje staršu povezavo, naslova ne shrani, omejitve proti zlorabi", () =>
  withServer(async ({ client, calls, store }) => {
    const c = client();
    const r = await c("/api/auth/ask-parent", { method: "POST", body: { email: "Mama@Primer.si", name: "Miha<script>" } });
    assert.equal(r.status, 200);
    const mail = calls.filter((x) => x.host === "api.resend.com").at(-1);
    assert.deepEqual(mail.body.to, ["mama@primer.si"]);
    assert.equal(mail.body.subject, "Prošnja za dovoljenje za Evklid");
    assert.match(mail.body.text, /^Mihascript bi rad/);
    assert.match(mail.body.text, /\/starsi\.html\?ime=Mihascript/);
    assert.doesNotMatch(mail.body.html, /<script/);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM parents").get().n, 0);
    assert.equal((await c("/api/auth/ask-parent", { method: "POST", body: { email: "ni-naslov" } })).status, 400);
    // Na isti naslov največ 2 na dan, z istega omrežja 3 na uro.
    assert.equal((await c("/api/auth/ask-parent", { method: "POST", body: { email: "mama@primer.si" } })).status, 200);
    assert.equal((await c("/api/auth/ask-parent", { method: "POST", body: { email: "mama@primer.si" } })).status, 429);
    assert.equal((await c("/api/auth/ask-parent", { method: "POST", body: { email: "oce@primer.si" } })).status, 200);
    assert.equal((await c("/api/auth/ask-parent", { method: "POST", body: { email: "teta@primer.si" } })).status, 429);
  }));

test("skrbnik ima profil lahko odprt na več napravah hkrati", async () => {
  process.env.EVKLID_ADMIN_EMAILS = "skrbnik@kod.si";
  try {
    await withServer(async ({ client, calls }) => {
      const phone = client();
      await registerVerified(phone, calls, "skrbnik@kod.si");
      const kid = (await phone("/api/students", { method: "POST", body: { name: "Jaka", birth_year: YEAR - 17, consent: true } })).body;
      assert.equal((await phone(`/api/students/${kid.id}/xp`)).status, 200);
      const pc = client();
      assert.equal((await pc("/api/auth/login", { method: "POST", body: { email: "skrbnik@kod.si", password: "geslo1234" } })).status, 200);
      assert.equal((await pc(`/api/students/${kid.id}/xp`)).status, 200);
      assert.equal((await phone(`/api/students/${kid.id}/xp`)).status, 200);
      assert.equal((await pc(`/api/students/${kid.id}/xp`)).status, 200);
    });
  } finally {
    delete process.env.EVKLID_ADMIN_EMAILS;
  }
});

// GDPR (čl. 15, 17, 20): izvoz zajame vse tabele računa in profilov (tudi prijave napak vseh vrst in mnenja),
// brez gesel in žetonov; izbris računa ali profila izbriše tudi mnenja, dnevnik obvestil in članstvo učitelja.
test("GDPR: izvoz vseh podatkov in izbris računa brez ostankov", async () => {
  await withServer(async ({ client, calls, store }) => {
    const a = client();
    const p = await registerVerified(a, calls, "gdpr@primer.si");
    const kid = (await a("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 10, consent: true } })).body;
    const kid2 = (await a("/api/students", { method: "POST", body: { name: "Eva", birth_year: YEAR - 9, consent: true } })).body;
    const db = store.db;
    db.prepare("INSERT INTO bug_reports (student_id, kind, reason, note) VALUES (?, 'app', 'gumb', 'gumb ne dela')").run(kid.id);
    db.prepare("INSERT INTO feedback (student_id, kind, name, ideas) VALUES (?, 'form', 'Lan', 'več iger')").run(kid.id);
    db.prepare("INSERT INTO feedback (student_id, kind, ideas) VALUES (?, 'form', 'temni način')").run(kid2.id);
    db.prepare("INSERT INTO offline_results (student_id, topic_id, seed) VALUES (?, 'MAT-OS-7-ulomki', 42)").run(kid.id);
    db.prepare("CREATE TABLE IF NOT EXISTS push_log (parent_id INTEGER NOT NULL, kind TEXT NOT NULL, period TEXT NOT NULL, PRIMARY KEY (parent_id, kind, period))").run();
    db.prepare("INSERT INTO push_log (parent_id, kind, period) VALUES (?, 'streak', '2026-11-05:1')").run(p.id);
    // Nepreverjena kartica, darilo, priporočilo, učiteljev razred in šola, UUID trgovine.
    db.prepare("INSERT INTO flashcards (student_id, front, back, norm, verified) VALUES (?, 'Kaj je 2+2?', '4', 'kaj je 2+2', 0)").run(kid.id);
    db.prepare("INSERT INTO gifts (buyer_id, amount, days, code) VALUES (?, 999, 30, 'DAR-TEST-0001')").run(p.id);
    db.prepare("INSERT INTO referral_rewards (referrer_id, referrer_reward) VALUES (?, 'mesec')").run(p.id);
    db.prepare("UPDATE parents SET store_account_token = 'uuid-trgovine-123' WHERE id = ?").run(p.id);
    const school = db.prepare("INSERT INTO schools (name, invite_code, created_by) VALUES ('OŠ Test', 'SOLA-T1', ?)").run(p.id).lastInsertRowid;
    const cls = db.prepare("INSERT INTO classes (code, name, kind, owner_parent_id, school_id) VALUES ('RAZ-T1', '7.a', 'class', ?, ?)").run(p.id, school).lastInsertRowid;
    // Učenec drugega računa v učiteljevem razredu z učiteljevo oznako.
    const other = client();
    await registerVerified(other, calls, "drugi@primer.si");
    const tuj = (await other("/api/students", { method: "POST", body: { name: "Tine", birth_year: YEAR - 12, consent: true } })).body;
    db.prepare("INSERT INTO class_members (class_id, student_id, teacher_label) VALUES (?, ?, 'Tine K.')").run(cls, tuj.id);
    db.prepare("INSERT INTO class_assignments (class_id, topic_id, title, created_by) VALUES (?, 'MAT-OS-7-ulomki', 'Ulomki', ?)").run(cls, p.id);
    const exp = (await a("/api/account/export", { method: "POST", body: { password: "geslo1234" } })).body;
    const lan = exp.children.find((c) => c.id === kid.id);
    assert.equal(lan.bug_reports[0].note, "gumb ne dela", "prijava napake aplikacije je v izvozu");
    assert.equal(lan.feedback[0].ideas, "več iger", "mnenje je v izvozu");
    assert.equal(exp.other.offline_results[0].seed, 42, "tabela brez posebnega izvoza je v izvozu (other)");
    const text = JSON.stringify(exp);
    assert.ok(!/password_hash|token_hash|"token"|store_account_token|uuid-trgovine/.test(text), "brez gesel in žetonov");
    assert.deepEqual(lan.flashcards.map((f) => [f.front, f.verified]), [["Kaj je 2+2?", 0]], "tudi nepreverjena kartica");
    assert.equal(exp.other.gifts?.[0]?.code, "DAR-TEST-0001", "kupljeno darilo");
    assert.equal(exp.other.referral_rewards?.[0]?.referrer_reward, "mesec", "priporočilo");
    assert.equal(exp.other.schools?.[0]?.name, "OŠ Test", "ustanovljena šola");
    assert.equal(exp.other.classes?.[0]?.name, "7.a", "učiteljev razred");
    assert.ok(!text.includes("Tine"), "brez podatkov drugih računov (učenec v razredu)");
    // Izbris profila izbriše njegova mnenja (prej so ostala brez lastnika).
    assert.equal((await a(`/api/students/${kid2.id}`, { method: "DELETE" })).status, 200);
    assert.equal(db.prepare("SELECT COUNT(*) n FROM feedback WHERE ideas = 'temni način' OR student_id IS NULL").get().n, 0);
    // Izbris računa: nič osebnega ne ostane.
    assert.equal((await a("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
    // Učiteljev razred (ime, koda, oznake »Tine K.«, naloge) gre z računom; učenec drugega računa ostane.
    assert.equal(db.prepare("SELECT COUNT(*) n FROM classes").get().n, 0, "razred izbrisan");
    assert.equal(db.prepare("SELECT COUNT(*) n FROM class_members").get().n, 0, "oznake učitelja izbrisane");
    assert.equal(db.prepare("SELECT COUNT(*) n FROM class_assignments").get().n, 0);
    assert.equal(db.prepare("SELECT created_by FROM schools").get().created_by, null, "šola brez povezave na račun");
    assert.ok(db.prepare("SELECT 1 FROM students WHERE id = ?").get(tuj.id), "učenec drugega računa ostane");
    for (const [t, where] of [["students", `id <> ${Number(tuj.id)}`], ["feedback", "1"], ["bug_reports", "1"], ["offline_results", "1"], ["push_log", "1"], ["consents", `parent_id = ${Number(p.id)}`], ["conversations", `student_id <> ${Number(tuj.id)}`]]) {
      assert.equal(db.prepare(`SELECT COUNT(*) n FROM ${t} WHERE ${where}`).get().n, 0, `${t} je prazna`);
    }
  });
});

// Odklep računa z geslom računa: ista meja za ves račun kot izvoz in geslo profila (acct<id>, 30 na uro), da otrok na
// starševi napravi z menjavo omrežja (mobilni podatki, Wi-Fi) ne ugiba gesla brez konca.
test("account unlock: wrong passwords from many networks hit the account-wide limit", async () => {
  await withServer(async ({ client, calls }) => {
    const a = client();
    await registerVerified(a, calls, "omejitev@primer.si");
    assert.ok((await a("/api/students", { method: "POST", body: { name: "Tine", birth_year: YEAR - 10, consent: true, profile_password: "tine1" } })).body.id);
    await a("/api/account/lock", { method: "POST" });
    const tryFrom = (ip, password = "narobe12") => a("/api/account/unlock", { method: "POST", body: { password }, headers: { "X-Forwarded-For": ip } });
    for (let i = 0; i < 30; i++) assert.equal((await tryFrom(`10.0.${Math.floor(i / 3)}.1`)).status, 401);
    const r = await tryFrom("10.9.9.9");
    assert.equal(r.status, 429, "po 30 napačnih poskusih z različnih omrežij odklep še ugiba");
    assert.match(r.body.error, /eno uro ali se odjavi in znova prijavi/, "sporočilo pove pravo okno in izhod");
    assert.equal((await tryFrom("10.9.9.10", "geslo1234")).status, 429);
  }, { accountLock: true });
});
