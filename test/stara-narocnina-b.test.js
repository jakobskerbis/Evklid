// Pregled B #497: napadi na varovalo »dogodek druge naročnine« (N1–N8).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { signWebhook } from "../server/accounts/stripe.js";
import { paidActive, GRACE_DAYS } from "../server/accounts/plans.js";

const SECRET = "whsec_test";
const YEAR = new Date().getFullYear();
const DAY = 86400000;
const sql = (ms) => new Date(ms).toISOString().slice(0, 19).replace("T", " ");

function fakeStripe() {
  const calls = [];
  const state = { subs: {}, invoices: [], listFails: false };
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
    if (p === "/invoices") return ok({ data: state.invoices, has_more: false });
    if (p === "/refunds") {
      const inv = state.invoices.find((i) => i.payment_intent === body.payment_intent);
      return ok({ id: "re_" + ++n, amount: Number(body.amount) || inv?.amount_paid || 0 });
    }
    const sub = /^\/subscriptions\/(\w+)$/.exec(p);
    if (sub && init.method === "DELETE") {
      const s = state.subs[sub[1]] || { id: sub[1], customer: "cus_k", items: { data: [] } };
      s.status = "canceled";
      state.subs[sub[1]] = s;
      return ok({ ...s });
    }
    if (sub) return ok(state.subs[sub[1]] || {});
    if (p === "/subscriptions") {
      if (state.listFails) return { ok: false, status: 500, json: async () => ({ error: { message: "napaka" } }) };
      return ok({ data: Object.values(state.subs) });
    }
    return { ok: false, status: 404, json: async () => ({ error: { message: "ni" } }) };
  };
  return { calls, state, fetchFn };
}

async function withServer(fn) {
  const store = openDb(":memory:");
  const stripe = fakeStripe();
  const app = createApp(store, { accounts: true, scheduler: false, stripeKey: "sk_test_x", resendKey: "re_x", webhookSecret: SECRET, fetchFn: stripe.fetchFn, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || "GET",
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

async function register(call, stripe, email) {
  const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  const mail = stripe.calls.filter((c) => c.host === "api.resend.com").at(-1);
  await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
  return r.body.parent;
}

const S = (id, status, extra = {}) => ({ id, status, customer: "cus_k", items: { data: [{ price: { lookup_key: "evklid_1_month" } }] }, ...extra });
const row = (store, id) => store.db.prepare("SELECT * FROM parents WHERE id = ?").get(id);
const cur = (store, id) => {
  const r = row(store, id);
  return { sub_id: r.sub_id, sub_status: r.sub_status };
};
const setCurrent = (store, stripe, id, subId, status = "active") => {
  store.db.prepare("UPDATE parents SET sub_id = ?, sub_status = ?, sub_plan = 'evklid_1_month', stripe_customer_id = 'cus_k', trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(subId, status, id);
  stripe.state.subs[subId] = S(subId, status);
};
const ev = (id, type, sub) => ({ id, type, data: { object: { id: sub, customer: "cus_k" } } });

test("N1: stara naročnina preide v past_due → prepiše trenutno aktivno, po odlogu plačujoči starš izgubi dostop", async () => {
  await withServer(async ({ client, stripe, store, hook }) => {
    const p = await register(client(), stripe, "n1@x.si");
    setCurrent(store, stripe, p.id, "sub_new");
    // Stara naročnina (dvojni nakup, skrbnik je še ni preklical) ne uspe obnoviti plačila.
    stripe.state.subs.sub_old = S("sub_old", "past_due");
    await hook(ev("n1a", "customer.subscription.updated", "sub_old"));
    const after = cur(store, p.id);
    // Simuliramo, da je odlog potekel (Stripe ponavlja plačilo do ~3 tedne).
    store.db.prepare("UPDATE parents SET past_due_since = ? WHERE id = ?").run(new Date(Date.now() - (GRACE_DAYS + 1) * DAY).toISOString(), p.id);
    assert.deepEqual(after, { sub_id: "sub_new", sub_status: "active" }, "past_due stare naročnine prepiše trenutno aktivno");
    assert.equal(paidActive(row(store, p.id)), true, "starš plačuje sub_new, a nima dostopa");
  });
});

test("N2: zakonit preklic trenutne (edine) naročnine še vedno vzame dostop; tudi ob napaki seznama", async () => {
  await withServer(async ({ client, stripe, store, hook }) => {
    const p = await register(client(), stripe, "n2@x.si");
    setCurrent(store, stripe, p.id, "sub_a");
    stripe.state.subs.sub_a.status = "canceled";
    await hook(ev("n2a", "customer.subscription.deleted", "sub_a"));
    assert.deepEqual(cur(store, p.id), { sub_id: "sub_a", sub_status: "canceled" });
    // Napaka GET /subscriptions → webhook 500 (Stripe pošlje znova, pregled #497 A P3-1); ponovna dostava → canceled.
    setCurrent(store, stripe, p.id, "sub_b");
    stripe.state.subs.sub_b.status = "canceled";
    stripe.state.listFails = true;
    assert.equal((await hook(ev("n2b", "customer.subscription.deleted", "sub_b"))).status, 500);
    stripe.state.listFails = false;
    assert.equal((await hook(ev("n2b", "customer.subscription.deleted", "sub_b"))).status, 200);
    assert.deepEqual(cur(store, p.id), { sub_id: "sub_b", sub_status: "canceled" });
    // Zakonit unpaid/incomplete_expired trenutne → brez dostopa.
    setCurrent(store, stripe, p.id, "sub_c");
    stripe.state.subs.sub_c.status = "unpaid";
    await hook(ev("n2c", "customer.subscription.updated", "sub_c"));
    assert.equal(paidActive(row(store, p.id)), false);
  });
});

test("N3: konec trenutne, druga je le past_due/unpaid/incomplete → brez dostopa (ni novega odloga)", async () => {
  await withServer(async ({ client, stripe, store, hook }) => {
    const p = await register(client(), stripe, "n3@x.si");
    setCurrent(store, stripe, p.id, "sub_new");
    stripe.state.subs.sub_x = S("sub_x", "past_due");
    stripe.state.subs.sub_y = S("sub_y", "unpaid");
    stripe.state.subs.sub_z = S("sub_z", "incomplete");
    stripe.state.subs.sub_new.status = "canceled";
    await hook(ev("n3a", "customer.subscription.deleted", "sub_new"));
    assert.deepEqual(cur(store, p.id), { sub_id: "sub_new", sub_status: "canceled" });
    assert.equal(paidActive(row(store, p.id)), false);
  });
});

test("N4: trenutna past_due v odlogu, zamujen dogodek stare canceled → prezrt, odlog se ne podaljša", async () => {
  await withServer(async ({ client, stripe, store, hook }) => {
    const p = await register(client(), stripe, "n4@x.si");
    setCurrent(store, stripe, p.id, "sub_new", "past_due");
    const since = new Date(Date.now() - 3 * DAY).toISOString();
    store.db.prepare("UPDATE parents SET past_due_since = ? WHERE id = ?").run(since, p.id);
    stripe.state.subs.sub_old = S("sub_old", "canceled");
    await hook(ev("n4a", "customer.subscription.deleted", "sub_old"));
    assert.deepEqual(cur(store, p.id), { sub_id: "sub_new", sub_status: "past_due" });
    assert.equal(row(store, p.id).past_due_since, since);
    // Po izteku odloga stari dogodek sme prepisati (dostopa tako ali tako ni).
    store.db.prepare("UPDATE parents SET past_due_since = ? WHERE id = ?").run(new Date(Date.now() - 9 * DAY).toISOString(), p.id);
    await hook(ev("n4b", "customer.subscription.updated", "sub_old"));
    assert.equal(paidActive(row(store, p.id)), false);
  });
});

test("N5: nova naročnina incomplete (zavrnjena kartica / 3DS) ne vzame trenutne; ko postane active, zamenja", async () => {
  await withServer(async ({ client, stripe, store, hook }) => {
    const p = await register(client(), stripe, "n5@x.si");
    setCurrent(store, stripe, p.id, "sub_cur");
    stripe.state.subs.sub_inc = S("sub_inc", "incomplete");
    await hook(ev("n5a", "customer.subscription.created", "sub_inc"));
    assert.deepEqual(cur(store, p.id), { sub_id: "sub_cur", sub_status: "active" });
    stripe.state.subs.sub_inc.status = "incomplete_expired";
    await hook(ev("n5b", "customer.subscription.updated", "sub_inc"));
    assert.deepEqual(cur(store, p.id), { sub_id: "sub_cur", sub_status: "active" });
  });
});

test("N6: vrstni red – deleted stare (ki je še trenutna) pride pred created nove → velja nova", async () => {
  await withServer(async ({ client, stripe, store, hook }) => {
    const p = await register(client(), stripe, "n6@x.si");
    setCurrent(store, stripe, p.id, "sub_old");
    stripe.state.subs.sub_old.status = "canceled";
    stripe.state.subs.sub_new = S("sub_new", "active");
    await hook(ev("n6a", "customer.subscription.deleted", "sub_old"));
    assert.deepEqual(cur(store, p.id), { sub_id: "sub_new", sub_status: "active" });
    await hook(ev("n6b", "customer.subscription.created", "sub_new"));
    assert.deepEqual(cur(store, p.id), { sub_id: "sub_new", sub_status: "active" });
  });
});

test("N7: spor pri plačilu trenutne ob drugi aktivni → dostop ostane po drugi (ta je plačana)", async () => {
  await withServer(async ({ client, stripe, store, hook }) => {
    const p = await register(client(), stripe, "n7@x.si");
    setCurrent(store, stripe, p.id, "sub_new");
    stripe.state.subs.sub_old = S("sub_old", "active");
    // Neposredno: preklic trenutne → velja druga.
    stripe.state.subs.sub_new.status = "canceled";
    await hook(ev("n7a", "customer.subscription.deleted", "sub_new"));
    assert.deepEqual(cur(store, p.id), { sub_id: "sub_old", sub_status: "active" });
  });
});

test("N8: garancija vrne VSA plačila naročnin (tudi druge), prekliče le trenutno → dostop ostane po vrnjeni drugi", async () => {
  process.env.EVKLID_ADMIN_EMAILS = "skrbnik@n8.si";
  try {
    await withServer(async ({ client, stripe, store }) => {
      const a = client();
      const p = await register(a, stripe, "n8@x.si");
      const kid = (await a("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 12, consent: true } })).body;
      setCurrent(store, stripe, p.id, "sub_new");
      stripe.state.subs.sub_old = S("sub_old", "active");
      const t = Math.floor((Date.now() - 2 * DAY) / 1000);
      // Dvojni nakup: obe naročnini plačani isti dan.
      stripe.state.invoices = [
        { id: "in_o", amount_paid: 999, created: t, payment_intent: "pi_o", subscription: "sub_old" },
        { id: "in_n", amount_paid: 999, created: t + 60, payment_intent: "pi_n", subscription: "sub_new" },
      ];
      let r = await a("/api/guarantee/enroll", { method: "POST", body: { student_id: kid.id, subject: "MAT", grade: 2, terms: true } });
      assert.equal(r.status, 201, JSON.stringify(r.body));
      const start = Date.now() - 57 * DAY;
      store.db.prepare("UPDATE guarantees SET started_at = ?").run(new Date(start).toISOString());
      const ins = store.db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 10, 'vaja', ?)");
      for (let w = 0; w < 8; w++) for (const d of [0, 2, 4]) ins.run(kid.id, sql(start + (w * 7 + d) * DAY + 3600000));
      r = await a("/api/guarantee/claim", { method: "POST", body: { grade: 2, honest: true } });
      assert.equal(r.body.guarantee.status, "claimed", JSON.stringify(r.body));
      const adm = client();
      await register(adm, stripe, "skrbnik@n8.si");
      const g = (await adm("/api/admin/guarantees")).body.guarantees[0];
      r = await adm(`/api/admin/guarantees/${g.id}/refund`, { method: "POST", body: {} });
      assert.equal(r.status, 200, JSON.stringify(r.body));
      assert.equal(r.body.guarantees[0].refunded_cents, 1998, "vrnjeni sta obe plačili");
      assert.equal(paidActive(row(store, p.id)), false, `vse vrnjeno, a dostop ostane: ${JSON.stringify(cur(store, p.id))}`);
    });
  } finally {
    delete process.env.EVKLID_ADMIN_EMAILS;
  }
});
