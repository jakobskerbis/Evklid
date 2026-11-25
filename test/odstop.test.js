// Funkcija za odstop od pogodbe (ZVPot-1A, 138.a člen) in splošni pogoji za zastavico EVKLID_POGOJI_OBJAVLJENI.
// Stripe in Resend sta lažna (testni ključ, brez pravih klicev): preverjamo obvestilo o odstopu brez prijave, potrdilo
// o prejemu z vsebino ter datumom in uro, samodejni odstop prijavljenega imetnika (vračilo + takojšen preklic),
// celotno vračilo brez izrecne zahteve ali z EVKLID_ODSTOP_VRACILO=celotno, pravi ključ brez samodejnega vračila,
// skrbniški seznam, zaprta prava plačila do objave pogojev, ponovno potrditev pogojev in stran /pogoji.html.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { signWebhook } from "../server/accounts/stripe.js";
import { submittedText, WITHDRAW_LABEL, CONFIRM_LABEL, stripLinks } from "../server/placila/odstop.js";
import { publishedHtml } from "../server/pogoji-stran.js";
import { TERMS_VERSION } from "../server/accounts/potrdilo.js";
import SL from "../public/i18n/sl.js";
import fs from "node:fs";

const SECRET = "whsec_test";
const YEAR = new Date().getFullYear();
const ADULT = "1985-04-12";
const OK = { adult: true, withdrawal: true, terms: true };
const DAY = 86400;
const now = () => Math.floor(Date.now() / 1000);

function fakeStripe() {
  const calls = [];
  const state = { sessions: {}, subs: {}, invoices: [], refunds: [], intents: {}, failNextRefund: false, mailFail: false, cancelGone: false, cancelError: false, refundStatus: "succeeded" };
  let n = 0;
  const fetchFn = async (url, init = {}) => {
    const body = init.body ? Object.fromEntries(new URLSearchParams(init.body)) : null;
    const u = new URL(url);
    const parsed = u.host === "api.resend.com" && init.body ? JSON.parse(init.body) : body;
    calls.push({ method: init.method, path: u.pathname, body: parsed, host: u.host, query: Object.fromEntries(u.searchParams), headers: init.headers || {} });
    const ok = (data) => ({ ok: true, status: 200, json: async () => data });
    if (u.host === "api.resend.com") return state.mailFail ? { ok: false, status: 500, json: async () => ({ message: "ni" }) } : ok({ id: "email_" + ++n });
    const p = u.pathname.replace("/v1", "");
    if (p === "/customers") return ok({ id: "cus_" + ++n });
    if (p === "/prices" && init.method === "GET") return ok({ data: [] });
    if (p === "/products") return ok({ id: "prod_1" });
    if (p === "/prices") return ok({ id: "price_" + body.lookup_key });
    if (p === "/checkout/sessions" && init.method === "POST") return ok({ id: "cs_" + ++n, url: "https://checkout.stripe.test/" + n });
    const sub = /^\/subscriptions\/(\w+)$/.exec(p);
    if (sub && init.method === "DELETE" && state.cancelError) return { ok: false, status: 400, json: async () => ({ error: { code: "x", message: "boom" } }) };
    if (sub && init.method === "DELETE" && state.cancelGone) return { ok: false, status: 404, json: async () => ({ error: { code: "resource_missing", message: "No such subscription" } }) };
    if (sub && init.method === "DELETE") return ok({ ...(state.subs[sub[1]] || { id: sub[1], items: { data: [] } }), status: "canceled", ended_at: now() });
    if (sub) return ok(state.subs[sub[1]] || {});
    if (p === "/subscriptions") return ok({ data: Object.values(state.subs) });
    if (p === "/invoices" && init.method === "GET") return ok({ data: state.invoices, has_more: false });
    if (p === "/refunds" && init.method === "GET") return ok({ data: state.refunds.filter((r) => r.payment_intent === u.searchParams.get("payment_intent")) });
    if (p === "/refunds" && init.method === "POST") {
      const key = init.headers?.["Idempotency-Key"];
      const again = key && state.refunds.find((r) => r.key === key);
      if (again) return ok(again);
      const r = { id: "re_" + ++n, amount: Number(body.amount), payment_intent: body.payment_intent, status: state.refundStatus, metadata: { kind: body["metadata[kind]"], withdrawal_id: body["metadata[withdrawal_id]"] }, key };
      state.refunds.push(r);
      // Stripe vračilo naredi, odgovor pa se izgubi (prekinjena povezava).
      if (state.failNextRefund) {
        state.failNextRefund = false;
        throw new Error("The operation was aborted due to timeout");
      }
      return ok(r);
    }
    const pi = /^\/payment_intents\/(\w+)$/.exec(p);
    if (pi) return ok(state.intents[pi[1]] || { id: pi[1], amount_received: 0, latest_charge: { amount_refunded: 0 } });
    return { ok: false, status: 404, json: async () => ({ error: { message: "ni" } }) };
  };
  return { calls, state, fetchFn };
}

async function withServer(fn, { key = "sk_test_x", env = {} } = {}) {
  const prev = {};
  for (const [k, v] of Object.entries(env)) (prev[k] = process.env[k]), (process.env[k] = v);
  const store = openDb(":memory:");
  const stripe = fakeStripe();
  const app = createApp(store, {
    // (app.locals.withdrawals: dnevni ponovni poskus potrdil)
    accounts: true,
    scheduler: false,
    stripeKey: key,
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
  let ev = 0;
  const hook = async (type, object) => {
    const raw = JSON.stringify({ id: `evt_${++ev}`, type, created: now(), data: { object } });
    const r = await client()("/api/stripe/webhook", { method: "POST", raw, headers: { "stripe-signature": signWebhook(raw, SECRET) } });
    assert.equal(r.status, 200, `${type}: ${JSON.stringify(r.body)}`);
  };
  try {
    await fn({ client, store, stripe, hook, app });
  } finally {
    server.close();
    for (const [k, v] of Object.entries(prev)) v === undefined ? delete process.env[k] : (process.env[k] = v);
  }
}

const mails = (stripe) => stripe.calls.filter((c) => c.host === "api.resend.com").map((c) => c.body);

async function account({ client, stripe, store }, email) {
  const a = client();
  const r = await a("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: ADULT, name: "Ana Novak" } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  await a(/\/api\/auth\/verify\?token=[\w-]+/.exec(mails(stripe).at(-1).text)[0]);
  await a("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 17, consent: true } });
  store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(r.body.parent.id);
  return { a, parent: r.body.parent };
}

// Naročnina, kupljena prek Checkout (zapis soglasja z izjavo o odstopu), s plačanim računom za tekoče obdobje.
async function subscribe({ stripe, store, hook }, { a, parent }, { amount = 1399, status = "active", paid = true } = {}) {
  const co = await a("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", ...OK } });
  assert.equal(co.status, 200, JSON.stringify(co.body));
  const s = stripe.calls.filter((c) => c.path === "/v1/checkout/sessions" && c.method === "POST").at(-1).body;
  const plan = s["line_items[0][price]"].replace(/^price_/, "");
  const meta = { parent_id: String(parent.id), parent_uid: s["metadata[parent_uid]"] };
  const customer = store.db.prepare("SELECT stripe_customer_id AS c FROM parents WHERE id = ?").get(parent.id).c;
  const start = now() - DAY;
  const end = start + 30 * DAY;
  stripe.state.subs.sub_1 = { id: "sub_1", object: "subscription", customer, created: start, status, cancel_at_period_end: false, metadata: meta, current_period_start: start, current_period_end: end, items: { data: [{ price: { lookup_key: plan } }] } };
  await hook("checkout.session.completed", { id: "cs_1", object: "checkout.session", created: now(), customer, subscription: "sub_1", payment_status: "paid", metadata: meta });
  if (!paid) return { customer, start, end };
  const invoice = { id: "in_1", customer, subscription: "sub_1", payment_intent: "pi_sub1", currency: "eur", created: start, amount_paid: amount, charge: { amount_refunded: 0 }, lines: { data: [{ amount, period: { start, end } }] } };
  stripe.state.invoices.push(invoice);
  await hook("invoice.paid", invoice);
  return { customer, start, end };
}

test("oznake funkcije in potrdila sta iz zakona (138.a člen ZVPot-1A) in enaki na strani", () => {
  assert.equal(WITHDRAW_LABEL, "Kliknite tukaj za odstop od pogodbe");
  assert.equal(CONFIRM_LABEL, "Potrdi odstop od pogodbe");
  assert.equal(SL["odstop.open"], WITHDRAW_LABEL);
  assert.equal(SL["odstop.confirm"], CONFIRM_LABEL);
  // Datum in ura z sekundami po slovenskem času (zimski čas CET, poletni CEST).
  assert.match(submittedText("2026-11-18T13:05:33.120Z"), /^18\. 11\. 2026 ob 14\.05\.33 \(CET\)$/);
  assert.match(submittedText("2026-07-01T08:00:09Z"), /^1\. 7\. 2026 ob 10\.00\.09 \(CEST\)$/);
  // Povezava na funkcijo v nogi vseh javnih strani in na pristajalni strani.
  for (const f of ["index.html", "zasebnost.html", "starsi.html", "sole.html", "garancija.html", "o-evklidu.html", "zakaj-evklid.html"])
    // index.html: noga je izpis pristajalne strani (scripts/pristajalna-noscript.js), drugod z data-i18n.
    assert.match(fs.readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8"), f === "index.html" ? /<a href="\/odstop\.html">Odstop od pogodbe<\/a>/ : /<a href="\/odstop\.html" data-i18n="land\.withdraw">Odstop od pogodbe<\/a>/, f);
  assert.ok(fs.readFileSync(new URL("../public/pristajalna.js", import.meta.url), "utf8").includes('href="/odstop.html"'));
});

test("brez prijave: obvestilo o odstopu se zapiše, potrdilo o prejemu gre takoj na vpisan e-naslov z vsebino, datumom in uro", () =>
  withServer(async ({ client, store, stripe }) => {
    const a = client();
    const view = await a("/api/withdrawal");
    assert.equal(view.status, 200);
    assert.equal(view.body.logged_in, false);
    assert.equal(view.body.days, 14);
    assert.equal((await a("/api/withdrawal", { method: "POST", body: { email: "x@primer.si", details: "naročnina" } })).body.field, "name");
    assert.equal((await a("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "ni-naslov", details: "naročnina" } })).body.field, "email");
    assert.equal((await a("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "ana@primer.si" } })).body.field, "details");
    const r = await a("/api/withdrawal", { method: "POST", body: { name: "Ana Novak", email: "ana@primer.si", details: "Naročnina SŠ, kupljena 16. 11. 2026" } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    assert.equal(r.body.ack_sent, true);
    assert.equal(r.body.processed, false, "brez prijave: obdela skrbnik");
    const row = store.db.prepare("SELECT * FROM withdrawals").get();
    assert.equal(row.source, "public");
    assert.equal(row.status, "received");
    assert.equal(row.ack_ok, 1);
    assert.equal(row.parent_id, null);
    const m = mails(stripe).at(-1);
    assert.deepEqual(m.to, ["ana@primer.si"]);
    assert.match(m.subject, /potrdilo o prejemu odstopa od pogodbe/);
    for (const part of ["Obveščam vas, da odstopam od pogodbe.", "Ana Novak", "Naročnina SŠ, kupljena 16. 11. 2026", `Oddano: ${submittedText(row.submitted_at)}`]) assert.ok(m.text.includes(part), part);
    assert.equal(m.html, undefined, "brez prijave samo besedilo, brez HTML");
    assert.equal(stripe.calls.filter((c) => c.path === "/v1/refunds").length, 0, "brez prijave ni vračila");
  }));

test("prijavljen imetnik v 14 dneh: izbere naročnino, odstop se izvede takoj (sorazmerno vračilo, takojšen preklic)", () =>
  withServer(async (ctx) => {
    const { stripe, store } = ctx;
    const acct = await account(ctx, "odstop@primer.si");
    await subscribe(ctx, acct);
    assert.equal((await acct.a("/api/account")).body.withdrawal_open, true, "povezava v zavihku Račun");
    const v = (await acct.a("/api/withdrawal")).body;
    assert.equal(v.logged_in, true);
    assert.equal(v.email, "odstop@primer.si");
    const o = v.options.find((x) => x.id === "sub");
    assert.ok(o, JSON.stringify(v.options));
    assert.equal(o.refund.mode, "sorazmerno", "plačnik je pred plačilom potrdil takojšen začetek");
    assert.ok(o.refund.cents > 0 && o.refund.cents < 1399, String(o.refund.cents));
    const r = await acct.a("/api/withdrawal", { method: "POST", body: { name: "Ana Novak", email: "odstop@primer.si", contract: "sub" } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    assert.equal(r.body.processed, true);
    const refunds = stripe.calls.filter((c) => c.path === "/v1/refunds");
    assert.equal(refunds.length, 1);
    assert.equal(refunds[0].body.payment_intent, "pi_sub1");
    assert.equal(Number(refunds[0].body.amount), o.refund.cents);
    assert.equal(refunds[0].body["metadata[kind]"], "withdrawal");
    assert.ok(stripe.calls.some((c) => c.method === "DELETE" && c.path === "/v1/subscriptions/sub_1"), "naročnina takoj preklicana");
    const row = store.db.prepare("SELECT * FROM withdrawals").get();
    assert.equal(row.status, "done");
    assert.equal(row.refund_cents, o.refund.cents);
    assert.equal(row.source, "app");
    const ack = mails(stripe).filter((m) => /odstopa od pogodbe/.test(m.subject));
    assert.equal(ack.length, 1, "eno potrdilo o prejemu");
    assert.ok(ack[0].text.includes("Naročnina Evklid, sklenjeno"));
    assert.equal((await acct.a("/api/account")).body.access.tier, "free", "po odstopu brezplačni paket");
    // Ponovitev: pogodbe ni več v seznamu (ni dvojnega vračila).
    assert.equal((await acct.a("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "odstop@primer.si", contract: "sub" } })).status, 409);
    assert.equal(stripe.calls.filter((c) => c.path === "/v1/refunds").length, 1);
  }));

test("EVKLID_ODSTOP_VRACILO=celotno: vrne celotno plačilo obdobja", () =>
  withServer(
    async (ctx) => {
      const acct = await account(ctx, "celotno@primer.si");
      await subscribe(ctx, acct);
      const o = (await acct.a("/api/withdrawal")).body.options.find((x) => x.id === "sub");
      assert.equal(o.refund.mode, "celotno");
      assert.equal(o.refund.cents, 1399);
      await acct.a("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "celotno@primer.si", contract: "sub" } });
      assert.equal(Number(ctx.stripe.calls.find((c) => c.path === "/v1/refunds").body.amount), 1399);
    },
    { env: { EVKLID_ODSTOP_VRACILO: "celotno" } },
  ));

test("brez zapisa izrecne zahteve za takojšen začetek: celotno vračilo", () =>
  withServer(async (ctx) => {
    const acct = await account(ctx, "brez-soglasja@primer.si");
    await subscribe(ctx, acct);
    ctx.store.db.prepare("UPDATE billing_consents SET text = replace(text, '[odstop: ', '[x: ')").run();
    const o = (await acct.a("/api/withdrawal")).body.options.find((x) => x.id === "sub");
    assert.equal(o.refund.mode, "celotno");
    assert.equal(o.refund.cents, 1399);
  }));

test("skrbnik: seznam obvestil, povezava z računom in izvedba, ročni zaključek; drugi ne vidijo", () =>
  withServer(
    async (ctx) => {
      const { client, store, stripe } = ctx;
      const acct = await account(ctx, "kupec@primer.si");
      await subscribe(ctx, acct);
      // Obvestilo brez prijave (npr. z drugega telefona): skrbnik ga poveže z računom in izvede.
      const anon = client();
      await anon("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "kupec@primer.si", details: "naročnina včeraj" } });
      await anon("/api/withdrawal", { method: "POST", body: { name: "Bor", email: "bor@primer.si", details: "nakup v App Store" } });
      assert.equal((await acct.a("/api/admin/withdrawals")).status, 403);
      const adm = await account(ctx, "skrbnik@primer.si");
      const list = (await adm.a("/api/admin/withdrawals")).body;
      assert.equal(list.withdrawals.length, 2);
      assert.equal(list.test_mode, true);
      const [bor, ana] = list.withdrawals; // novejše najprej
      assert.equal(ana.name, "Ana");
      assert.equal((await adm.a(`/api/admin/withdrawals/${ana.id}/process`, { method: "POST", body: { parent_id: acct.parent.id, contract: "nekaj" } })).status, 400);
      const done = await adm.a(`/api/admin/withdrawals/${ana.id}/process`, { method: "POST", body: { parent_id: acct.parent.id, contract: "sub" } });
      assert.equal(done.status, 200, JSON.stringify(done.body));
      assert.equal(done.body.withdrawals.find((w) => w.id === ana.id).status, "done");
      assert.equal(stripe.calls.filter((c) => c.path === "/v1/refunds").length, 1);
      assert.equal((await adm.a(`/api/admin/withdrawals/${ana.id}/process`, { method: "POST", body: {} })).status, 409, "ni dvakrat");
      assert.equal((await adm.a(`/api/admin/withdrawals/${bor.id}/close`, { method: "POST", body: {} })).status, 400);
      const closed = await adm.a(`/api/admin/withdrawals/${bor.id}/close`, { method: "POST", body: { note: "App Store: odstop pri trgovini" } });
      assert.equal(closed.body.withdrawals.find((w) => w.id === bor.id).status, "closed");
      assert.ok(store.db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action LIKE 'withdrawal_%'").get().n >= 4);
    },
    { env: { EVKLID_ADMIN_EMAILS: "skrbnik@primer.si" } },
  ));

test("pravi ključ Stripa: brez objavljenih pogojev so plačila zaprta, odstop se zapiše in potrdi, vračila ne izvede sam", () =>
  withServer(
    async (ctx) => {
      const { stripe, store } = ctx;
      const acct = await account(ctx, "live@primer.si");
      const co = await acct.a("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", ...OK } });
      assert.equal(co.status, 409);
      assert.equal(co.body.terms_draft, true);
      assert.equal(stripe.calls.filter((c) => c.path === "/v1/checkout/sessions").length, 0);
      // Naročnina iz časa pred tem (vpisana neposredno): funkcija za odstop deluje, vračilo čaka skrbnika.
      store.db.prepare("UPDATE parents SET sub_id = 'sub_1', sub_status = 'active', sub_plan = 'evklid_2_month', sub_period_end = ? WHERE id = ?").run(new Date(Date.now() + 29 * DAY * 1000).toISOString(), acct.parent.id);
      assert.ok((await acct.a("/api/withdrawal")).body.options.some((o) => o.id === "sub"));
      const r = await acct.a("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "live@primer.si", contract: "sub" } });
      assert.equal(r.status, 201);
      assert.equal(r.body.processed, false);
      assert.equal(r.body.ack_sent, true);
      assert.equal(stripe.calls.filter((c) => c.path === "/v1/refunds").length, 0);
      assert.equal(store.db.prepare("SELECT status FROM withdrawals").get().status, "received");
    },
    { key: "sk_live_x" },
  ));

test("objavljeni pogoji: pravi ključ odpre plačila; nova različica zahteva ponovno potrditev", () =>
  withServer(
    async (ctx) => {
      const { store } = ctx;
      const acct = await account(ctx, "pogoji@primer.si");
      assert.equal((await acct.a("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", ...OK } })).status, 200);
      // Registracija brez potrditve pogojev (star račun): obvestilo o novih pogojih.
      store.db.prepare("DELETE FROM consents WHERE student_id IS NULL").run();
      store.db.prepare("DELETE FROM billing_consents").run();
      assert.equal((await acct.a("/api/account")).body.parent.terms_notice, TERMS_VERSION);
      assert.equal((await acct.a("/api/account/terms", { method: "POST", body: { version: "2000-01-01", accept: true } })).status, 409);
      const ok = await acct.a("/api/account/terms", { method: "POST", body: { version: TERMS_VERSION, accept: true } });
      assert.equal(ok.status, 200);
      assert.equal(ok.body.parent.terms_notice, null);
      const row = store.db.prepare("SELECT version, created_at FROM consents WHERE student_id IS NULL").get();
      assert.equal(row.version, TERMS_VERSION);
      assert.ok(row.created_at);
      // Starejša potrjena različica → obvestilo.
      store.db.prepare("UPDATE consents SET version = '2020-01-01' WHERE student_id IS NULL").run();
      assert.equal((await acct.a("/api/account")).body.parent.terms_notice, TERMS_VERSION);
      const cfg = (await acct.a("/api/config")).body;
      assert.deepEqual(cfg.terms, { version: TERMS_VERSION, published: true });
    },
    { key: "sk_live_x", env: { EVKLID_POGOJI_OBJAVLJENI: "1" } },
  ));

test("neobjavljeni pogoji: brez obvestila o ponovni potrditvi; stran /pogoji.html kaže osnutek", () =>
  withServer(async (ctx) => {
    const acct = await account(ctx, "osnutek@primer.si");
    ctx.store.db.prepare("DELETE FROM consents WHERE student_id IS NULL").run();
    assert.equal((await acct.a("/api/account")).body.parent.terms_notice, null);
    assert.deepEqual((await acct.a("/api/config")).body.terms, { version: TERMS_VERSION, published: false });
    const html = (await acct.a("/pogoji.html")).body;
    assert.ok(html.includes("Splošni pogoji so v pripravi."));
    assert.ok(html.includes('content="noindex"'));
    assert.ok(html.includes("Kliknite tukaj za odstop od pogodbe"), "12. točka pove, kje je funkcija za odstop");
  }));

test("objavljeni pogoji: strežnik odstrani dele osnutka (pasica, noindex), različica ostane", () =>
  withServer(
    async ({ client }) => {
      const html = (await client()("/pogoji.html")).body;
      assert.ok(!html.includes("v pripravi"));
      assert.ok(!html.includes('content="noindex"'));
      assert.ok(!html.includes("osnutek -->"));
      assert.ok(html.includes("Različica 21. 11. 2026"));
      const src = fs.readFileSync(new URL("../public/pogoji.html", import.meta.url), "utf8");
      assert.equal(publishedHtml(src), html);
    },
    { env: { EVKLID_POGOJI_OBJAVLJENI: "1" } },
  ));

const ADMIN = { EVKLID_ADMIN_EMAILS: "skrbnik@primer.si" };
const refundPosts = (stripe) => stripe.calls.filter((c) => c.path === "/v1/refunds" && c.method === "POST");

test("idempotentno vračilo: odgovor na prvo vračilo se izgubi → ponovitev nič več ne vrne; neuspel odstop ni več na seznamu", () =>
  withServer(
    async (ctx) => {
      const { stripe, store } = ctx;
      const acct = await account(ctx, "prekinjeno@primer.si");
      await subscribe(ctx, acct);
      stripe.state.failNextRefund = true;
      const r = await acct.a("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "prekinjeno@primer.si", contract: "sub" } });
      assert.equal(r.status, 201);
      assert.equal(r.body.processed, false);
      const w = store.db.prepare("SELECT * FROM withdrawals").get();
      assert.equal(w.status, "failed");
      assert.equal(JSON.parse(w.refunds).pi_sub1.state, "pending", "oznaka pred klicem");
      assert.equal(refundPosts(stripe)[0].headers["Idempotency-Key"], `withdrawal-${w.id}-pi_sub1`);
      // Neuspel odstop iste pogodbe ni več na seznamu (drugo obvestilo ne sme sprožiti drugega vračila).
      assert.ok(!(await acct.a("/api/withdrawal")).body.options.some((o) => o.id === "sub"));
      assert.equal((await acct.a("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "prekinjeno@primer.si", contract: "sub" } })).status, 409);
      const adm = await account(ctx, "skrbnik@primer.si");
      const again = await adm.a(`/api/admin/withdrawals/${w.id}/process`, { method: "POST", body: {} });
      assert.equal(again.status, 200, JSON.stringify(again.body));
      assert.equal(refundPosts(stripe).length, 1, "ponovitev najde vračilo pri Stripu (metadata.withdrawal_id) in ga ne ponovi");
      assert.equal(stripe.state.refunds.length, 1);
      const done = store.db.prepare("SELECT * FROM withdrawals WHERE id = ?").get(w.id);
      assert.equal(done.status, "done");
      assert.equal(done.refund_cents, stripe.state.refunds[0].amount);
      // Skrbnik je dobil opozorilo o neuspelem odstopu.
      assert.ok(mails(stripe).some((m) => m.to[0] === "skrbnik@primer.si" && /čaka/.test(m.subject)));
    },
    { env: ADMIN },
  ));

test("premalo za vrniti (že vrnjeno drugje): stanje »ni uspelo« z zapisom, ne »izvedeno«", () =>
  withServer(async (ctx) => {
    const { stripe, store } = ctx;
    const acct = await account(ctx, "premalo@primer.si");
    await subscribe(ctx, acct);
    stripe.state.invoices[0].charge = { amount_refunded: 1399 };
    const r = await acct.a("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "premalo@primer.si", contract: "sub" } });
    assert.equal(r.body.processed, false);
    const w = store.db.prepare("SELECT * FROM withdrawals").get();
    assert.equal(w.status, "failed");
    assert.match(w.note, /^vrnjeno 0,00\s€ od \d+,\d\d\s€, uredi ročno$/);
    assert.equal(refundPosts(stripe).length, 0);
  }));

test("preizkus brez plačila: nič za vrniti, brez vrstice o vračilu; preklic samo te naročnine, že preklicana = uspeh", () =>
  withServer(async (ctx) => {
    const { stripe, store } = ctx;
    const acct = await account(ctx, "preizkus@primer.si");
    await subscribe(ctx, acct, { status: "trialing", paid: false });
    store.db.prepare("UPDATE parents SET sub_status = 'trialing' WHERE id = ?").run(acct.parent.id);
    const o = (await acct.a("/api/withdrawal")).body.options.find((x) => x.id === "sub");
    assert.ok(o);
    assert.equal(o.paid_cents, 0);
    assert.equal(o.refund.cents, 0);
    stripe.state.cancelGone = true;
    const r = await acct.a("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "preizkus@primer.si", contract: "sub" } });
    assert.equal(r.body.processed, true, JSON.stringify(r.body));
    assert.equal(refundPosts(stripe).length, 0);
    assert.ok(!stripe.calls.some((c) => c.path === "/v1/subscriptions" && c.method === "GET"), "ne preklicuje drugih naročnin kupca");
    const ack = mails(stripe).find((m) => /odstopa od pogodbe/.test(m.subject));
    assert.ok(!/vračilo/i.test(ack.text), ack.text);
    assert.ok(ack.text.includes("je potrdilo o prejemu vašega obvestila z datumom in uro oddaje"));
    assert.ok(!/pravočasno/.test(ack.text), "brez trditve o pravočasnosti");
  }));

test("zgornja meja: znesek ob oddaji obvestila velja tudi, če je izračun ob obdelavi višji", () =>
  withServer(
    async (ctx) => {
      const { stripe, store } = ctx;
      const acct = await account(ctx, "meja@primer.si");
      await subscribe(ctx, acct);
      await acct.a("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "meja@primer.si", contract: "sub" } });
      const w = store.db.prepare("SELECT * FROM withdrawals").get();
      assert.equal(w.status, "received", "samodejno izklopljeno");
      store.db.prepare("UPDATE withdrawals SET refund_target = 100 WHERE id = ?").run(w.id);
      const adm = await account(ctx, "skrbnik@primer.si");
      assert.equal((await adm.a(`/api/admin/withdrawals/${w.id}/process`, { method: "POST", body: {} })).status, 200);
      assert.equal(Number(refundPosts(stripe)[0].body.amount), 100);
    },
    { env: { ...ADMIN, EVKLID_ODSTOP_SAMODEJNO: "0" } },
  ));

test("soglasje po začetku pogodbe ne šteje za izrecno zahtevo: celotno vračilo", () =>
  withServer(async (ctx) => {
    const acct = await account(ctx, "pozno@primer.si");
    await subscribe(ctx, acct);
    ctx.store.db.prepare("UPDATE billing_consents SET created_at = datetime('now', '+2 hours'), checkout_id = NULL").run();
    const o = (await acct.a("/api/withdrawal")).body.options.find((x) => x.id === "sub");
    assert.equal(o.refund.mode, "celotno");
  }));

test("obrazec brez prijave: največ 2 potrdili na naslov na dan, brez povezav v e-pošti; skrbnik dobi opozorilo, izbriše neželeno, pošlje znova", () =>
  withServer(
    async (ctx) => {
      const { client, stripe, store } = ctx;
      const anon = client();
      const body = { name: "Klik www.zlo.example", email: "zrtev@primer.si", details: "Glej https://zlo.example/x in zlo.com/y ali pisi na a@b.si" };
      for (let i = 0; i < 3; i++) assert.equal((await anon("/api/withdrawal", { method: "POST", body })).status, 201);
      const toVictim = mails(stripe).filter((m) => m.to[0] === "zrtev@primer.si");
      assert.equal(toVictim.length, 2, "tretje potrdilo zadržano");
      for (const m of toVictim) {
        assert.ok(!/zlo|https?:|www\.|a@b\.si/.test(m.text), m.text);
        assert.ok(m.text.includes("[povezava]"));
      }
      const rows = store.db.prepare("SELECT * FROM withdrawals ORDER BY id").all();
      assert.equal(rows[2].ack_ok, -1);
      assert.equal(mails(stripe).filter((m) => m.to[0] === "skrbnik@primer.si" && /čaka/.test(m.subject)).length, 3, "skrbnik za vsako neizvedeno obvestilo");
      const adm = await account(ctx, "skrbnik@primer.si");
      // Napaka je koda (prevod na odjemalcu).
      assert.equal((await anon("/api/withdrawal", { method: "POST", body: { email: "x@primer.si" } })).body.code, "name");
      store.db.prepare("UPDATE withdrawals SET submitted_at = ? WHERE id = ?").run(new Date(Date.now() - 8 * 86400000).toISOString(), rows[0].id);
      const list = (await adm.a("/api/admin/withdrawals")).body.withdrawals;
      assert.equal(list.find((w) => w.id === rows[0].id).overdue, true, "starejše od 7 dni");
      assert.equal(list.find((w) => w.id === rows[1].id).overdue, false);
      const resend = await adm.a(`/api/admin/withdrawals/${rows[2].id}/ack`, { method: "POST", body: {} });
      assert.equal(resend.status, 200);
      assert.equal(store.db.prepare("SELECT ack_ok FROM withdrawals WHERE id = ?").get(rows[2].id).ack_ok, 1);
      assert.equal((await adm.a(`/api/admin/withdrawals/${rows[1].id}`, { method: "DELETE" })).status, 200);
      assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM withdrawals").get().n, 2);
      assert.equal((await acctDelete(ctx, adm)).status, 409, "obvestila prijavljenega imetnika ni mogoče izbrisati");
    },
    { env: ADMIN },
  ));

// Obvestilo prijavljenega imetnika (parent_id) skrbnik ne more izbrisati kot neželeno.
async function acctDelete(ctx, adm) {
  const acct = await account(ctx, "pravi@primer.si");
  await acct.a("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "pravi@primer.si", details: "nakup" } });
  const id = ctx.store.db.prepare("SELECT id FROM withdrawals WHERE parent_id = ?").get(acct.parent.id).id;
  return adm.a(`/api/admin/withdrawals/${id}`, { method: "DELETE" });
}

test("potrdilo, ki ni bilo poslano: dnevni ponovni poskus", () =>
  withServer(async (ctx) => {
    const { client, stripe, store, app } = ctx;
    stripe.state.mailFail = true;
    const r = await client()("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "pozneje@primer.si", details: "naročnina" } });
    assert.equal(r.body.ack_sent, false);
    assert.equal(store.db.prepare("SELECT ack_ok FROM withdrawals").get().ack_ok, 0);
    stripe.state.mailFail = false;
    assert.equal(await app.locals.withdrawals.retryAcks(), 0, "še ni minil dan");
    assert.equal(await app.locals.withdrawals.retryAcks(Date.now() + 86400000 + 1000), 1);
    assert.equal(store.db.prepare("SELECT ack_ok FROM withdrawals").get().ack_ok, 1);
  }));

test("predpogodbena informacija o funkciji za odstop ob potrditvah pred plačilom (ti in vi)", () => {
  const src = fs.readFileSync(new URL("../public/pay-ui.js", import.meta.url), "utf8");
  assert.match(src, /\$\{withdrawInfo\(vi\)\}/);
  assert.ok(SL["pay.withdrawInfo"].includes("»Kliknite tukaj za odstop od pogodbe«") && SL["pay.withdrawInfo"].includes("{link}"));
  assert.ok(SL["payp.withdrawInfo"].startsWith("Odstopite"));
  for (const f of ["placaj.html", "vabilo.html", "ucitelj.html"]) assert.ok(fs.readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8").includes('href="/odstop.html"'), f);
});

test("prijavljen imetnik: potrdilo samo na e-naslov računa (vpisan naslov je samo podatek)", () =>
  withServer(async (ctx) => {
    const { stripe, store } = ctx;
    const acct = await account(ctx, "lastnik@primer.si");
    const r = await acct.a("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "tuj@primer.si", details: "nakup" } });
    assert.equal(r.status, 201);
    assert.equal(r.body.withdrawal.email, "lastnik@primer.si");
    const w = { ...store.db.prepare("SELECT email, ack_to FROM withdrawals").get() };
    assert.deepEqual(w, { email: "tuj@primer.si", ack_to: "lastnik@primer.si" });
    assert.ok(!mails(stripe).some((m) => m.to[0] === "tuj@primer.si"));
    assert.ok(mails(stripe).some((m) => m.to[0] === "lastnik@primer.si" && /odstopa/.test(m.subject)));
  }));

test("zadržana potrdila: skrbnik dobi največ eno povzetno opozorilo na dan; neuspelo pošiljanje šteje v mejo naslova", () =>
  withServer(
    async (ctx) => {
      const { client, stripe } = ctx;
      const anon = client();
      stripe.state.mailFail = true; // prvo potrdilo ne gre (ack_ok 0), šteje v mejo
      await anon("/api/withdrawal", { method: "POST", body: { name: "A", email: "z@primer.si", details: "x x x" } });
      stripe.state.mailFail = false;
      for (let i = 0; i < 3; i++) await anon("/api/withdrawal", { method: "POST", body: { name: "A", email: "z@primer.si", details: "x x x" } });
      assert.equal(mails(stripe).filter((m) => m.to[0] === "z@primer.si").length, 2, "prvo neuspelo, drugo poslano, tretje in četrto zadržano");
      const summary = mails(stripe).filter((m) => m.to[0] === "skrbnik@primer.si" && /povzetek/.test(m.text));
      assert.equal(summary.length, 1, "en povzetek za dve zadržani");
    },
    { env: ADMIN },
  ));

test("delno vrnjeno: zaključi samo z »vrnjeno ročno«, pogodba ostane zasedena; ni prevezave; Stripe zavrne vračilo → skrbnik, brez ponovitve", () =>
  withServer(
    async (ctx) => {
      const { stripe, store } = ctx;
      const acct = await account(ctx, "zavrnjeno@primer.si");
      await subscribe(ctx, acct);
      stripe.state.refundStatus = "failed";
      await acct.a("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "zavrnjeno@primer.si", contract: "sub" } });
      const w = store.db.prepare("SELECT * FROM withdrawals").get();
      assert.equal(w.status, "failed");
      assert.equal(JSON.parse(w.refunds).pi_sub1.state, "failed");
      const adm = await account(ctx, "skrbnik@primer.si");
      assert.equal((await adm.a(`/api/admin/withdrawals/${w.id}/process`, { method: "POST", body: { parent_id: adm.parent.id } })).status, 409, "ni prevezave, ko so vračila");
      assert.equal((await adm.a(`/api/admin/withdrawals/${w.id}/process`, { method: "POST", body: {} })).status, 409);
      assert.equal(refundPosts(stripe).length, 1, "zavrnjenega ključa ne ponovimo");
      // Delno vrnjeno (npr. ročno 500 centov): zapiranje brez potrditve ne gre.
      store.db.prepare("UPDATE withdrawals SET refund_cents = 500 WHERE id = ?").run(w.id);
      assert.equal((await adm.a(`/api/admin/withdrawals/${w.id}/close`, { method: "POST", body: { note: "x" } })).status, 409);
      assert.equal((await adm.a(`/api/admin/withdrawals/${w.id}/close`, { method: "POST", body: { note: "ostalo v Stripu", refunded_manually: true } })).status, 200);
      assert.match(store.db.prepare("SELECT note FROM withdrawals WHERE id = ?").get(w.id).note, /^vrnjeno ročno/);
    },
    { env: ADMIN },
  ));

test("preklic: druga napaka Stripa (naročnina ni preklicana) ni »že preklicana«", () =>
  withServer(async (ctx) => {
    const { stripe, store } = ctx;
    const acct = await account(ctx, "napaka@primer.si");
    await subscribe(ctx, acct, { status: "trialing", paid: false });
    store.db.prepare("UPDATE parents SET sub_status = 'trialing' WHERE id = ?").run(acct.parent.id);
    stripe.state.cancelError = true;
    const r = await acct.a("/api/withdrawal", { method: "POST", body: { name: "Ana", email: "napaka@primer.si", contract: "sub" } });
    assert.equal(r.body.processed, false);
    assert.equal(store.db.prepare("SELECT status FROM withdrawals").get().status, "failed");
  }));

test("brez povezav v e-pošti, a »dr.Novak« ostane; do 1000 znakov", () => {
  assert.equal(stripLinks("dr.Novak, glej zlo.com/x"), "dr.Novak, glej [povezava]");
  assert.equal(stripLinks("a".repeat(1500)).length, 1000);
});
