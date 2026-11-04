// Garancija »Boljša ocena ali vrnemo denar« in »Podari Evklid« (j 2026-11-04): prijava, 8 tednov vaje,
// zahtevek, vračilo skrbnika, pilotne kode za šole, sklad (dodatek pri naročnini, »Podari mesec«) in vračila.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { signWebhook } from "../server/accounts/stripe.js";
import { weeksFor, GUARANTEE } from "../server/placila/garancija.js";

const SECRET = "whsec_test";
const YEAR = new Date().getFullYear();
const DAY = 86400000;
const sql = (ms) => new Date(ms).toISOString().slice(0, 19).replace("T", " ");

function fakeStripe() {
  const calls = [];
  const state = { sessions: {}, invoices: [] };
  let n = 0;
  const fetchFn = async (url, init = {}) => {
    const body = init.body ? (init.headers["Content-Type"]?.includes("json") ? JSON.parse(init.body) : Object.fromEntries(new URLSearchParams(init.body))) : null;
    const u = new URL(url);
    calls.push({ method: init.method, path: u.pathname, body, host: u.host, query: Object.fromEntries(u.searchParams) });
    const ok = (data) => ({ ok: true, status: 200, json: async () => data });
    if (u.host === "api.resend.com") return ok({ id: "email_" + ++n });
    const p = u.pathname.replace("/v1", "");
    if (p === "/customers") return ok({ id: "cus_" + ++n });
    if (p === "/prices" && init.method === "GET") return ok({ data: [] });
    if (p === "/products") return ok({ id: "prod_1" });
    if (p === "/prices") return ok({ id: "price_" + body.lookup_key });
    if (p === "/billing_portal/configurations") return ok({ id: "bpc_1", data: [] });
    if (p === "/checkout/sessions" && init.method === "POST") return ok({ id: "cs_" + ++n, url: "https://checkout.stripe.test/" + n });
    const cs = /^\/checkout\/sessions\/(\w+)$/.exec(p);
    if (cs) return ok(state.sessions[cs[1]] || { id: cs[1] });
    if (p === "/invoices") return ok({ data: state.invoices, has_more: false });
    if (p === "/refunds") {
      const inv = state.invoices.find((i) => i.payment_intent === body.payment_intent);
      return ok({ id: "re_" + ++n, amount: inv?.amount_paid || 0 });
    }
    const sub = /^\/subscriptions\/(\w+)$/.exec(p);
    if (sub && init.method === "DELETE") return ok({ id: sub[1], status: "canceled", customer: "cus_x", items: { data: [] } });
    if (sub) return ok({});
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

async function registerVerified(call, stripe, email) {
  const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  const mail = stripe.calls.filter((c) => c.host === "api.resend.com").at(-1);
  await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
  return r.body.parent;
}
const paid = (store, id) =>
  store.db.prepare("UPDATE parents SET sub_status = 'active', sub_id = 'sub_1', sub_plan = 'evklid_os_month', stripe_customer_id = 'cus_x', trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(id);

test("weeksFor: teden je ok pri vsaj 3 dneh vaje, zamujen teden je miss", () => {
  const start = Date.UTC(2026, 0, 5);
  const days = { 0: 3, 1: 2 };
  const w = weeksFor(start, (from) => days[Math.round((from - start) / (7 * DAY))] || 0, start + 10 * DAY);
  assert.equal(w.length, GUARANTEE.weeks);
  assert.deepEqual(w.slice(0, 3).map((x) => x.state), ["ok", "now", "future"]);
  const later = weeksFor(start, (from) => days[Math.round((from - start) / (7 * DAY))] || 0, start + 15 * DAY);
  assert.equal(later[1].state, "miss");
});

test("garancija: prijava v 14 dneh, 8 tednov vaje, zahtevek in vračilo skrbnika", async () => {
  process.env.EVKLID_ADMIN_EMAILS = "skrbnik@gar.si";
  try {
    await withServer(async ({ client, stripe, store }) => {
      const a = client();
      const parent = await registerVerified(a, stripe, "mama@gar.si");
      const kid = (await a("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 12, consent: true } })).body;
      // Brez naročnine prijava ni mogoča.
      let r = await a("/api/guarantee/enroll", { method: "POST", body: { student_id: kid.id, subject: "MAT", grade: 2, terms: true } });
      assert.equal(r.status, 409);
      paid(store, parent.id);
      assert.equal((await a("/api/account")).body.guarantee.can_enroll, true);
      // Ni plačanega računa → še ne velja; plačilo pred 20 dnevi → prepozno.
      r = await a("/api/guarantee/enroll", { method: "POST", body: { student_id: kid.id, subject: "MAT", grade: 2, terms: true } });
      assert.match(r.body.error, /prvim plačilom/);
      stripe.state.invoices = [{ id: "in_1", amount_paid: 999, created: Math.floor((Date.now() - 20 * DAY) / 1000), payment_intent: "pi_1", subscription: "sub_1" }];
      r = await a("/api/guarantee/enroll", { method: "POST", body: { student_id: kid.id, subject: "MAT", grade: 2, terms: true } });
      assert.match(r.body.error, /14 dneh/);
      stripe.state.invoices[0].created = Math.floor((Date.now() - 3 * DAY) / 1000);
      // Napačni vnosi so 4xx.
      for (const body of [{ student_id: 999, subject: "MAT", grade: 2, terms: true }, { student_id: kid.id, subject: "ZGO", grade: 2, terms: true }, { student_id: kid.id, subject: "MAT", grade: 5, terms: true }, { student_id: kid.id, subject: "MAT", grade: "x", terms: true }, { student_id: kid.id, subject: "MAT", grade: 2 }]) {
        r = await a("/api/guarantee/enroll", { method: "POST", body });
        assert.ok(r.status >= 400 && r.status < 500, JSON.stringify(body));
      }
      r = await a("/api/guarantee/enroll", { method: "POST", body: { student_id: kid.id, subject: "MAT", grade: 2, terms: true } });
      assert.equal(r.status, 201, JSON.stringify(r.body));
      assert.equal(r.body.guarantee.phase, "practice");
      // Druga prijava iste družine ni mogoča.
      r = await a("/api/guarantee/enroll", { method: "POST", body: { student_id: kid.id, subject: "FIZ", grade: 2, terms: true } });
      assert.equal(r.status, 409);
      // Zahtevek med vajo ne gre.
      r = await a("/api/guarantee/claim", { method: "POST", body: { grade: 2, honest: true } });
      assert.match(r.body.error, /po 8 tednih/);

      // 8 tednov nazaj, vsak teden 3 dni vaje (XP) → zahtevek je odprt.
      const start = Date.now() - 57 * DAY;
      store.db.prepare("UPDATE guarantees SET started_at = ?").run(new Date(start).toISOString());
      const ins = store.db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 10, 'vaja', ?)");
      for (let w = 0; w < 8; w++) for (const d of [0, 2, 4]) ins.run(kid.id, sql(start + (w * 7 + d) * DAY + 3600000));
      const g = (await a("/api/guarantee")).body.guarantee;
      assert.equal(g.phase, "claim");
      assert.deepEqual(g.weeks.map((w) => w.days), [3, 3, 3, 3, 3, 3, 3, 3]);
      r = await a("/api/guarantee/claim", { method: "POST", body: { grade: 2 } });
      assert.equal(r.status, 400);
      r = await a("/api/guarantee/claim", { method: "POST", body: { grade: 2, honest: true } });
      assert.equal(r.body.guarantee.status, "claimed");

      // Skrbnik vrne vsa plačila naročnine in prekliče naročnino; drugi ne more.
      assert.equal((await a("/api/admin/guarantees/1/refund", { method: "POST", body: {} })).status, 403);
      const adm = client();
      await registerVerified(adm, stripe, "skrbnik@gar.si");
      const list = (await adm("/api/admin/guarantees")).body.guarantees;
      assert.equal(list[0].status, "claimed");
      r = await adm(`/api/admin/guarantees/${list[0].id}/refund`, { method: "POST", body: {} });
      assert.equal(r.status, 200, JSON.stringify(r.body));
      assert.equal(r.body.guarantees[0].status, "refunded");
      assert.equal(r.body.guarantees[0].refunded_cents, 999);
      assert.equal(stripe.calls.filter((c) => c.path === "/v1/refunds").length, 1);
      assert.ok(stripe.calls.some((c) => c.method === "DELETE" && c.path === "/v1/subscriptions/sub_1"));
      // Drugič ne gre (ni več oddan zahtevek).
      assert.equal((await adm(`/api/admin/guarantees/${list[0].id}/refund`, { method: "POST", body: {} })).status, 409);
    });
  } finally {
    delete process.env.EVKLID_ADMIN_EMAILS;
  }
});

test("garancija: zamujen teden vaje ali boljša ocena ne prineseta vračila", async () => {
  await withServer(async ({ client, stripe, store }) => {
    const a = client();
    const parent = await registerVerified(a, stripe, "oce@gar.si");
    const kid = (await a("/api/students", { method: "POST", body: { name: "Ana", birth_year: YEAR - 12, consent: true } })).body;
    paid(store, parent.id);
    stripe.state.invoices = [{ id: "in_1", amount_paid: 999, created: Math.floor(Date.now() / 1000), payment_intent: "pi_1", subscription: "sub_1" }];
    assert.equal((await a("/api/guarantee/enroll", { method: "POST", body: { student_id: kid.id, subject: "FIZ", grade: 3, terms: true } })).status, 201);
    const start = Date.now() - 57 * DAY;
    store.db.prepare("UPDATE guarantees SET started_at = ?").run(new Date(start).toISOString());
    const ins = store.db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 10, 'vaja', ?)");
    for (let w = 0; w < 8; w++) for (const d of w === 4 ? [0, 1] : [0, 2, 4]) ins.run(kid.id, sql(start + (w * 7 + d) * DAY + 3600000));
    let g = (await a("/api/guarantee")).body.guarantee;
    assert.equal(g.phase, "lapsed");
    assert.equal(g.missed, 5);
    assert.match((await a("/api/guarantee/claim", { method: "POST", body: { grade: 3, honest: true } })).body.error, /5\. tednu/);
    // Peti teden dopolnjen → boljša ocena = »improved«, brez vračila.
    ins.run(kid.id, sql(start + (4 * 7 + 5) * DAY + 3600000));
    g = (await a("/api/guarantee/claim", { method: "POST", body: { grade: 4, honest: true } })).body.guarantee;
    assert.equal(g.status, "improved");
    // Rok: po 8 tednih + 60 dni zahtevka ni več.
    store.db.prepare("UPDATE guarantees SET status = 'active', started_at = ?").run(new Date(Date.now() - (56 + 61) * DAY).toISOString());
    assert.equal((await a("/api/guarantee")).body.guarantee.phase, "lapsed"); // brez vaje v teh tednih
  });
});

test("Podari Evklid: pilotne kode z mejami, sklad iz dodatka in »Podari mesec«, vračilo zniža sklad", async () => {
  process.env.EVKLID_ADMIN_EMAILS = "skrbnik@pod.si";
  try {
    await withServer(async ({ client, stripe, store, hook }) => {
      const adm = client();
      await registerVerified(adm, stripe, "skrbnik@pod.si");
      // Pilot: največ 3 na šolo.
      let r = await adm("/api/admin/podari/codes", { method: "POST", body: { school: "OŠ Prule", count: 3, source: "pilot" } });
      assert.equal(r.status, 201, JSON.stringify(r.body));
      assert.equal(r.body.codes.length, 3);
      assert.match(r.body.codes[0].code, /^DAR-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
      r = await adm("/api/admin/podari/codes", { method: "POST", body: { school: "oš prule", count: 1, source: "pilot" } });
      assert.equal(r.status, 409);
      for (const body of [{ school: "", count: 1, source: "pilot" }, { school: "X šola", count: 0, source: "pilot" }, { school: "X šola", count: 1, source: "kaj" }, { school: "X šola", count: 1, source: "pilot", level: "FAKS" }]) {
        assert.equal((await adm("/api/admin/podari/codes", { method: "POST", body })).status, 400, JSON.stringify(body));
      }
      // Sklad je prazen → kode iz sklada ni.
      assert.equal((await adm("/api/admin/podari/codes", { method: "POST", body: { school: "OŠ Bežigrad", count: 1, source: "sklad" } })).status, 409);

      // Starš vpiše pilotno kodo: 90 dni dostopa, na profilu ni oznake »podari«.
      const a = client();
      const parent = await registerVerified(a, stripe, "druzina@pod.si");
      store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(parent.id);
      r = await a("/api/account/promo", { method: "POST", body: { code: r.body?.codes?.[0]?.code || (await adm("/api/admin/podari")).body.codes[0].code } });
      assert.equal(r.status, 200, JSON.stringify(r.body));
      assert.equal(r.body.access.tier, "gift");
      assert.ok(!JSON.stringify(r.body.children).includes("podari"));
      assert.equal((await client()("/api/podari")).body.in_use_months, 3);

      // Dodatek pri naročnini: enkratna vrstica in podari_id v metadata naročnine.
      store.db.prepare("UPDATE parents SET gift_until = NULL WHERE id = ?").run(parent.id);
      r = await a("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", adult: true, withdrawal: true, podari: 500 } });
      assert.equal(r.status, 200, JSON.stringify(r.body));
      const cs = stripe.calls.filter((c) => c.path === "/v1/checkout/sessions" && c.method === "POST").at(-1).body;
      assert.equal(cs["line_items[1][price_data][unit_amount]"], "500");
      const podariId = cs["subscription_data[metadata][podari_id]"];
      assert.ok(podariId);
      // Neznan znesek dodatka se prezre.
      await a("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", adult: true, withdrawal: true, podari: 333 } });
      assert.equal(stripe.calls.filter((c) => c.path === "/v1/checkout/sessions" && c.method === "POST").at(-1).body["line_items[1][price_data][unit_amount]"], undefined);
      // invoice.paid potrdi dodatek (enkrat).
      const inv = { id: "in_9", customer: "cus_x", amount_paid: 1499, payment_intent: "pi_add", subscription_details: { metadata: { podari_id: podariId, parent_id: String(parent.id) } } };
      await hook({ id: "evt_1", type: "invoice.paid", data: { object: inv } });
      await hook({ id: "evt_2", type: "invoice.paid", data: { object: { ...inv, id: "in_10", payment_intent: "pi_next" } } });
      assert.equal(store.db.prepare("SELECT status, payment_id FROM podari_fund WHERE id = ?").get(Number(podariId)).payment_id, "pi_add");

      // »Podari mesec« (9,99 €): potrebni sta obe potrditvi, plačilo potrdi vrnitev.
      assert.equal((await a("/api/billing/podari", { method: "POST", body: { adult: true } })).status, 400);
      r = await a("/api/billing/podari", { method: "POST", body: { adult: true, understand: true } });
      assert.equal(r.status, 200);
      const fundId = store.db.prepare("SELECT id FROM podari_fund WHERE kind = 'month'").get().id;
      stripe.state.sessions.cs_pod = { id: "cs_pod", payment_status: "paid", payment_intent: "pi_pod", metadata: { kind: "podari", fund_id: String(fundId), parent_id: String(parent.id) } };
      r = await a("/api/billing/podari/confirm", { method: "POST", body: { session_id: "cs_pod" } });
      assert.equal(r.body.paid, true);
      let stats = (await client()("/api/podari")).body;
      assert.equal(stats.donated_months, 1); // 5 € + 9,99 € = 1 mesec OŠ
      assert.equal(stats.evklid_months, 9);

      // Sklad zdaj pokrije le 1 mesec, ne 3 → koda iz sklada še ni mogoča. Vračilo »Podari mesec« zniža sklad.
      assert.equal((await adm("/api/admin/podari/codes", { method: "POST", body: { school: "OŠ Bežigrad", count: 1, source: "sklad" } })).status, 409);
      await hook({ id: "evt_3", type: "charge.refunded", data: { object: { payment_intent: "pi_pod", amount_refunded: 999 } } });
      stats = (await client()("/api/podari")).body;
      assert.equal(stats.donated_months, 0);
      // Dovolj denarja v skladu → koda iz sklada; preklic nevpisane kode ga vrne.
      store.db.prepare("INSERT INTO podari_fund (kind, amount, status) VALUES ('month', 3000, 'paid')").run();
      r = await adm("/api/admin/podari/codes", { method: "POST", body: { school: "OŠ Bežigrad", count: 1, source: "sklad" } });
      assert.equal(r.status, 201, JSON.stringify(r.body));
      assert.equal(r.body.balance, 500 + 3000 - 2997);
      const skladCode = r.body.codes.find((c) => c.source === "sklad");
      r = await adm(`/api/admin/podari/codes/${skladCode.id}/revoke`, { method: "POST", body: {} });
      assert.equal(r.body.balance, 3500);
      assert.equal((await adm(`/api/admin/podari/codes/${skladCode.id}/revoke`, { method: "POST", body: {} })).status, 409);
      // Navaden uporabnik do skrbniških poti ne pride.
      assert.equal((await a("/api/admin/podari")).status, 403);
    });
  } finally {
    delete process.env.EVKLID_ADMIN_EMAILS;
  }
});
