// Cene Osebno ob šolski licenci (5,99 € / 49 €), darilna koda 49 € (j 2026-10-30).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { signWebhook } from "../server/accounts/stripe.js";
import {
  PLANS,
  SCHOOL_PLANS,
  GIFT,
  isSchoolPlan,
  planByKey,
  accessFor,
} from "../server/accounts/plans.js";

const YEAR = new Date().getFullYear();
const SECRET = "whsec_test";

test("cene: Osebno ob šolski licenci 5,99 €/49 €, redne cene po stopnjah, darilo po letni ceni stopnje", () => {
  assert.deepEqual(
    PLANS.map((p) => p.amount),
    [999, 9900, 1399, 13900, 1999, 19900, 1999, 19900, 2799, 26900],
  );
  assert.deepEqual(
    SCHOOL_PLANS.map((p) => [p.interval, p.amount, p.seats]),
    [
      ["month", 599, 1],
      ["year", 4900, 1],
    ],
  );
  assert.equal(GIFT.amount, 9900, "darilo OŠ = letna cena OŠ");
  assert.equal(GIFT.days, 365);
  assert.equal(isSchoolPlan(SCHOOL_PLANS[1].key), true);
  assert.equal(isSchoolPlan(PLANS[0].key), false);
  assert.equal(planByKey(SCHOOL_PLANS[0].key).seats, 1);
  const until = new Date(Date.now() + 86400000).toISOString();
  assert.deepEqual(accessFor({ gift_until: until }), {
    tier: "gift",
    seats: 1,
    until,
    level: null, // staro darilo brez stopnje odpre vse stopnje
  });
  assert.equal(accessFor({ gift_until: until, gift_level: "SS" }).level, "SS");
});

function fakeStripe() {
  const calls = [];
  const state = { sessions: {} };
  let n = 0;
  const fetchFn = async (url, init = {}) => {
    const u = new URL(url);
    const body = init.body
      ? init.headers?.["Content-Type"]?.includes("json")
        ? JSON.parse(init.body)
        : Object.fromEntries(new URLSearchParams(init.body))
      : null;
    calls.push({ method: init.method, path: u.pathname, body, host: u.host });
    const ok = (data) => ({ ok: true, status: 200, json: async () => data });
    if (u.host === "api.resend.com") return ok({ id: "email_" + ++n });
    const p = u.pathname.replace("/v1", "");
    if (state.objects?.[p]) return ok(state.objects[p]);
    if (p === "/customers") return ok({ id: "cus_" + ++n });
    if (p === "/prices" && init.method === "GET") return ok({ data: [] });
    if (p === "/products") return ok({ id: "prod_1" });
    if (p === "/prices") return ok({ id: "price_" + body.lookup_key });
    if (p === "/billing_portal/configurations") return ok({ id: "bpc_1" });
    if (p === "/checkout/sessions" && init.method === "POST")
      return ok({ id: "cs_" + ++n, url: "https://checkout.stripe.test/" + n });
    const cs = /^\/checkout\/sessions\/(\w+)$/.exec(p);
    if (cs) return ok(state.sessions[cs[1]] || { id: cs[1] });
    return ok({ id: "x_" + ++n, data: [] });
  };
  return { calls, state, fetchFn };
}

async function withServer(fn) {
  const store = openDb(":memory:");
  const stripe = fakeStripe();
  const licensed = new Set();
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    stripeKey: "sk_test_x",
    resendKey: "re_x",
    webhookSecret: SECRET,
    fetchFn: stripe.fetchFn,
    log: { error() {} },
    schoolSource: {
      access: (db, id) =>
        licensed.has(id)
          ? {
              schoolId: 1,
              licenceId: 1,
              schoolName: "OŠ Test",
              plan: "class",
              subjects: null,
              grades: null,
              validUntil: null,
              aiCapUsdMonth: 0,
            }
          : null,
      students: () => [...licensed],
      membership: () => null,
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
        headers: {
          "Content-Type": "application/json",
          cookie: Object.entries(jar)
            .map(([k, v]) => `${k}=${v}`)
            .join("; "),
          ...(opts.headers || {}),
        },
        body: opts.raw ?? (opts.body ? JSON.stringify(opts.body) : undefined),
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar[kv.slice(0, i)] = kv.slice(i + 1);
      }
      const type = res.headers.get("content-type") || "";
      return {
        status: res.status,
        body: type.includes("json") ? await res.json() : await res.text(),
      };
    };
  };
  const register = async (email, birth = "1985-04-12") => {
    const a = client();
    const r = await a("/api/auth/register", {
      method: "POST",
      body: {
        email,
        password: "geslo1234",
        accept_privacy: true,
        birth_date: birth,
      },
    });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    const mail = stripe.calls.filter((c) => c.host === "api.resend.com").at(-1);
    await a(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
    return { a, parent: r.body.parent };
  };
  const hook = (event) => {
    const raw = JSON.stringify(event);
    return client()("/api/stripe/webhook", {
      method: "POST",
      raw,
      headers: { "stripe-signature": signWebhook(raw, SECRET) },
    });
  };
  try {
    await fn({ store, stripe, licensed, register, hook });
  } finally {
    server.close();
  }
}

const OK = { adult: true, withdrawal: true };

test("Osebno ob šolski licenci: le z otrokom s šolsko licenco, cena ni v portalu, mesto dobi šolski otrok", async () => {
  await withServer(async ({ store, stripe, licensed, register }) => {
    const { a, parent } = await register("sola@kod.si");
    const kid = async (name) =>
      (
        await a("/api/students", {
          method: "POST",
          body: { name, birth_year: YEAR - 13, consent: true },
        })
      ).body;
    const first = await kid("Ana");
    const second = await kid("Bor");
    const buy = (interval) =>
      a("/api/billing/checkout", {
        method: "POST",
        body: { school: true, interval, ...OK },
      });
    assert.equal((await a("/api/account")).body.school_plans.length, 0);
    assert.equal((await buy("month")).status, 403);
    licensed.add(second.id);
    const acc = (await a("/api/account")).body;
    assert.deepEqual(
      acc.school_plans.map((p) => p.amount),
      [599, 4900],
    );
    const r = await buy("year");
    assert.equal(r.status, 200, JSON.stringify(r.body));
    const price = stripe.calls.find(
      (c) =>
        c.path === "/v1/prices" &&
        c.method === "POST" &&
        c.body.lookup_key.endsWith("_sola_year"),
    );
    assert.equal(Number(price.body.unit_amount), 4900);
    const session = stripe.calls
      .filter((c) => c.path === "/v1/checkout/sessions")
      .at(-1);
    assert.equal(
      session.body["line_items[0][price]"],
      "price_" + SCHOOL_PLANS[1].key,
    );
    // Portal za preklop paketa ne ponuja šolskih cen.
    store.db
      .prepare("UPDATE parents SET stripe_customer_id = 'cus_k' WHERE id = ?")
      .run(parent.id);
    await a("/api/billing/portal", { method: "POST" });
    const conf = stripe.calls.find(
      (c) => c.path === "/v1/billing_portal/configurations",
    );
    assert.doesNotMatch(JSON.stringify(conf.body), /_sola_/);
    // Plačana šolska naročnina: poln dostop dobi otrok s šolsko licenco, ne prvi profil.
    store.db
      .prepare(
        "UPDATE parents SET sub_status = 'active', sub_seats = 1, sub_plan = ?, trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?",
      )
      .run(SCHOOL_PLANS[1].key, parent.id);
    const kids = (await a("/api/account")).body.children;
    assert.deepEqual(
      kids.map((c) => [c.id, c.premium]),
      [
        [first.id, false],
        [second.id, true],
      ],
    );
  });
});

test("darilna koda: nakup, koda po plačilu, vpis pri drugem računu, enkratna uporaba, vračilo", async () => {
  await withServer(async ({ store, stripe, register, hook }) => {
    const { a: buyer, parent } = await register("kupec@kod.si");
    assert.equal(
      (await buyer("/api/billing/gift", { method: "POST", body: {} })).status,
      400,
    ); // brez potrditev
    const r = await buyer("/api/billing/gift", { method: "POST", body: OK });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    const s = stripe.calls
      .filter((c) => c.path === "/v1/checkout/sessions")
      .at(-1);
    assert.equal(
      Number(s.body["line_items[0][price_data][unit_amount]"]),
      9900,
    );
    const giftId = s.body["metadata[gift_id]"];
    stripe.state.sessions.cs_paid = {
      id: "cs_paid",
      payment_status: "paid",
      payment_intent: "pi_gift",
      metadata: { kind: "gift", gift_id: giftId, parent_id: String(parent.id) },
    };
    const conf = await buyer("/api/billing/gift/confirm", {
      method: "POST",
      body: { session_id: "cs_paid" },
    });
    assert.equal(conf.body.paid, true);
    assert.match(conf.body.code, /^DAR-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    // Webhook za isto plačilo ne ustvari druge kode.
    await hook({
      id: "evt_g1",
      type: "checkout.session.completed",
      data: { object: stripe.state.sessions.cs_paid },
    });
    const list = (await buyer("/api/account")).body.gifts;
    assert.deepEqual(
      list.map((g) => [g.code, g.redeemed]),
      [[conf.body.code, false]],
    );

    // Prejemnik (z že porabljeno aktivacijsko kodo bi lahko vseeno vpisal darilo).
    const { a: friend } = await register("prejemnik@kod.si");
    const k = (
      await friend("/api/students", {
        method: "POST",
        body: { name: "Lan", birth_year: YEAR - 12, consent: true },
      })
    ).body;
    store.db
      .prepare(
        "UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z' WHERE email = 'prejemnik@kod.si'",
      )
      .run();
    const red = await friend("/api/account/promo", {
      method: "POST",
      body: { code: conf.body.code.toLowerCase() },
    });
    assert.equal(red.status, 200, JSON.stringify(red.body));
    assert.equal(red.body.access.tier, "gift");
    const days = (Date.parse(red.body.access.until) - Date.now()) / 86400000;
    assert.ok(days > 364.9 && days <= 365, String(days));
    assert.equal(
      (await friend("/api/account")).body.children.find((c) => c.id === k.id)
        .premium,
      true,
    );
    assert.match(
      (
        await friend("/api/account/promo", {
          method: "POST",
          body: { code: conf.body.code },
        })
      ).body.error,
      /že uporabljena/,
    );
    assert.equal((await buyer("/api/account")).body.gifts[0].redeemed, true);
    // Vračilo: dostop prejemnika se konča.
    await hook({
      id: "evt_g2",
      type: "charge.refunded",
      data: { object: { payment_intent: "pi_gift", amount_refunded: 9900 } },
    });
    assert.equal((await friend("/api/account")).body.access.tier, "free");
  });
});

test("darilna koda: mladoletni je ne more kupiti", async () => {
  await withServer(async ({ register }) => {
    const { a } = await register("najst@kod.si", `${YEAR - 16}-01-10`);
    assert.equal(
      (await a("/api/billing/gift", { method: "POST", body: OK })).status,
      403,
    );
  });
});

test("Osebno ob šolski licenci: stara povezava za starše ne da šolske cene, ko licence ni več", async () => {
  await withServer(async ({ licensed, register }) => {
    const { a } = await register("povezava@kod.si");
    const k = (await a("/api/students", { method: "POST", body: { name: "Eva", birth_year: YEAR - 13, consent: true } })).body;
    assert.equal((await a("/api/billing/pay-link", { method: "POST", body: { kind: "sub", school: true, interval: "month" } })).status, 403);
    licensed.add(k.id);
    const link = await a("/api/billing/pay-link", { method: "POST", body: { kind: "sub", school: true, interval: "month" } });
    assert.equal(link.status, 201, JSON.stringify(link.body));
    licensed.delete(k.id); // učenec je zapustil razred
    const token = new URL(link.body.url).searchParams.get("t");
    const pay = await a(`/api/pay/${token}/checkout`, { method: "POST", body: { email: "mama@kod.si", ...OK } });
    assert.equal(pay.status, 403, JSON.stringify(pay.body));
  });
});

test("darilna koda: izbris prejemnika ne sprosti kode, vračilo enega od dveh daril vzame le njegove dni, spor ne prekliče naročnine", async () => {
  await withServer(async ({ store, stripe, register, hook }) => {
    const { a: buyer, parent } = await register("kupec2@kod.si");
    const codes = [];
    for (const pi of ["pi_a", "pi_b", "pi_c"]) {
      await buyer("/api/billing/gift", { method: "POST", body: OK });
      const s = stripe.calls.filter((c) => c.path === "/v1/checkout/sessions").at(-1);
      const sid = "cs_" + pi;
      stripe.state.sessions[sid] = { id: sid, payment_status: "paid", payment_intent: pi, metadata: { kind: "gift", gift_id: s.body["metadata[gift_id]"], parent_id: String(parent.id) } };
      codes.push((await buyer("/api/billing/gift/confirm", { method: "POST", body: { session_id: sid } })).body.code);
    }
    // Prejemnik vpiše kodo med preizkusom: darilo začne teči po koncu preizkusa.
    const { a: gone } = await register("odhod@kod.si");
    const trialEnd = Date.parse((await gone("/api/account")).body.access.until);
    const red = await gone("/api/account/promo", { method: "POST", body: { code: codes[0] } });
    assert.equal(red.status, 200);
    assert.equal(red.body.access.tier, "trial");
    const until = Date.parse(red.body.gift_until);
    assert.ok(Math.abs(until - trialEnd - 365 * 86400000) < 5000);
    assert.equal((await gone("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
    const { a: other } = await register("drugi@kod.si");
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z' WHERE email = 'drugi@kod.si'").run();
    assert.match((await other("/api/account/promo", { method: "POST", body: { code: codes[0] } })).body.error, /že uporabljena/);
    // Dve darili: vračilo enega pusti drugo leto.
    for (const c of codes.slice(1)) assert.equal((await other("/api/account/promo", { method: "POST", body: { code: c } })).status, 200);
    await hook({ id: "evt_r1", type: "charge.refunded", data: { object: { payment_intent: "pi_b", amount_refunded: 9900 } } });
    const acc = (await other("/api/account")).body.access;
    assert.equal(acc.tier, "gift");
    const days = (Date.parse(acc.until) - Date.now()) / 86400000;
    assert.ok(days > 364.9 && days <= 365, String(days));
    // Spor po vračilu istega darila: kupčeva naročnina ostane.
    store.db.prepare("UPDATE parents SET sub_id = 'sub_k', sub_status = 'active', stripe_customer_id = 'cus_k' WHERE id = ?").run(parent.id);
    stripe.state.objects = { "/charges/ch_b": { id: "ch_b", customer: "cus_k" } };
    await hook({ id: "evt_d1", type: "charge.dispute.created", data: { object: { payment_intent: "pi_b", charge: "ch_b" } } });
    assert.ok(!stripe.calls.some((c) => c.method === "DELETE" && c.path.startsWith("/v1/subscriptions")));
    assert.equal(store.db.prepare("SELECT sub_status FROM parents WHERE id = ?").get(parent.id).sub_status, "active");
  });
});

test("Osebno ob šolski licenci po izteku licence: naročnina se ne podaljša, obvestilo; ob vrnjeni licenci spet teče", async () => {
  const { mountAccounts } = await import("../server/accounts/index.js");
  const express = (await import("express")).default;
  const store = openDb(":memory:");
  const stripe = fakeStripe();
  const licensed = new Set();
  const api = mountAccounts(express(), store, {
    accounts: true,
    scheduler: false,
    stripeKey: "sk_test_x",
    resendKey: "re_x",
    fetchFn: stripe.fetchFn,
    log: { error() {} },
    schoolSource: {
      access: (db, id) => (licensed.has(id) ? { schoolId: 1, licenceId: 1, schoolName: "OŠ", plan: "class", subjects: null, grades: null, validUntil: null, aiCapUsdMonth: 0 } : null),
      students: () => [...licensed],
      membership: () => null,
    },
  });
  const db = store.db;
  const add = (email, plan) => {
    db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code, email_verified_at) VALUES (?, 'x', 'v', 't', ?, '2026-01-01')").run(email, email);
    const pid = db.prepare("SELECT id FROM parents WHERE email = ?").get(email).id;
    const end = new Date(Date.now() + 100 * 86400000).toISOString();
    db.prepare("UPDATE parents SET sub_status = 'active', sub_plan = ?, sub_seats = 1, sub_period_end = ?, sub_id = ?, trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(plan, end, "sub_" + pid, pid);
    const kid = db.prepare("INSERT INTO students (name, settings, parent_id) VALUES ('Ana', '{}', ?)").run(pid).lastInsertRowid;
    return { pid, kid };
  };
  const s = add("sola@p.si", SCHOOL_PLANS[0].key);
  const r = add("redna@p.si", PLANS[0].key); // redna naročnina: nikoli
  const run = () => api.billing.billingDaily(new Date(), { force: true });
  const posts = (pid) => stripe.calls.filter((c) => c.path === `/v1/subscriptions/sub_${pid}` && c.method === "POST").map((c) => c.body.cancel_at_period_end);
  const flag = (pid) => db.prepare("SELECT sub_cancel_at_period_end AS c FROM parents WHERE id = ?").get(pid).c;
  const mails = () => stripe.calls.filter((c) => c.host === "api.resend.com" && /šolski licenci/i.test(c.body.subject));

  licensed.add(s.kid);
  assert.equal((await run()).school_ended, 0, "licenca velja: nič");
  licensed.delete(s.kid);
  const out = await run();
  assert.equal(out.school_ended, 1);
  assert.deepEqual(posts(s.pid), ["true"]);
  assert.equal(flag(s.pid), 1);
  assert.equal(mails().length, 1);
  assert.match(mails()[0].body.text, /ne bo samodejno podaljšala/);
  assert.equal((await run()).school_ended, 0, "samo enkrat");
  assert.equal(mails().length, 1);
  assert.deepEqual(posts(r.pid), [], "redne naročnine se ne dotakne");
  // Licenca spet velja pred koncem obdobja: podaljšanje se vrne.
  licensed.add(s.kid);
  assert.equal((await run()).school_resumed, 1);
  assert.deepEqual(posts(s.pid), ["true", "false"]);
  assert.equal(flag(s.pid), 0);
  // Starš je sam preklical: Evklid podaljšanja ne vrne in ga ne ustavlja znova.
  db.prepare("UPDATE parents SET sub_cancel_at_period_end = 1 WHERE id = ?").run(s.pid);
  licensed.delete(s.kid);
  await run();
  licensed.add(s.kid);
  await run();
  assert.deepEqual(posts(s.pid), ["true", "false"]);
  // Stara oznaka po koncu naročnine ne sme preskočiti nove naročnine po šolski ceni.
  const n = add("nova@p.si", SCHOOL_PLANS[0].key);
  await run();
  assert.deepEqual(posts(n.pid), ["true"]);
  db.prepare("UPDATE parents SET sub_id = ?, sub_cancel_at_period_end = 0 WHERE id = ?").run(`sub_${n.pid}b`, n.pid);
  await run();
  assert.deepEqual(stripe.calls.filter((c) => c.path === `/v1/subscriptions/sub_${n.pid}b` && c.method === "POST").map((c) => c.body.cancel_at_period_end), ["true"]);
});
