// Splošni pogoji ob nakupu in registraciji ter potrdilo o nakupu po e-pošti (#765 točki 2 in 3, j 2026-11-17).
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { signWebhook } from "../server/accounts/stripe.js";
import { TERMS_VERSION, termsVersionText, TERMS_TEXT } from "../server/accounts/potrdilo.js";
import { WITHDRAWAL_TEXT } from "../server/accounts/billing.js";

const SECRET = "whsec_test";
const ADULT = "1985-04-12";
const now = () => Math.floor(Date.now() / 1000);

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

const mails = (stripe) => stripe.calls.filter((c) => c.host === "api.resend.com").map((c) => c.body);
const lastSession = (stripe) => stripe.calls.filter((c) => c.path === "/v1/checkout/sessions" && c.method === "POST").at(-1);

async function account({ client, stripe }, email, extra = {}) {
  const a = client();
  const r = await a("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: ADULT, ...extra } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  await a(/\/api\/auth\/verify\?token=[\w-]+/.exec(mails(stripe).at(-1).text)[0]);
  return { a, parent: r.body.parent };
}

test("različica pogojev v kodi je ista kot na strani pogoji.html", () => {
  const html = readFileSync(new URL("../public/pogoji.html", import.meta.url), "utf8");
  assert.ok(html.includes(`Različica ${termsVersionText(TERMS_VERSION)}`), "datum »Različica« na strani = TERMS_VERSION");
  const sl = readFileSync(new URL("../public/i18n/sl.js", import.meta.url), "utf8");
  assert.ok(sl.includes(`"terms.accept": "Strinjam se s {link}."`) && sl.includes(`"terms.link": "splošnimi pogoji uporabe"`));
  assert.equal(TERMS_TEXT, "Strinjam se s splošnimi pogoji uporabe.");
});

test("registracija: potrditev pogojev se zapiše z različico; brez nje (mobilna aplikacija) registracija deluje", () =>
  withServer(async (ctx) => {
    const { store } = ctx;
    const yes = await account(ctx, "da@pogoji.si", { accept_terms: true });
    const row = store.db.prepare("SELECT * FROM consents WHERE parent_id = ? AND student_id IS NULL").get(yes.parent.id);
    assert.equal(row.version, TERMS_VERSION);
    assert.equal(row.text, TERMS_TEXT);
    assert.equal(row.parent_email, "da@pogoji.si");
    const no = await account(ctx, "ne@pogoji.si");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM consents WHERE parent_id = ?").get(no.parent.id).n, 0);
  }));

test("nakup brez potrditve pogojev: 400 na vseh poteh plačila", () =>
  withServer(async (ctx) => {
    const { a } = await account(ctx, "brez@pogoji.si");
    const paths = [
      ["/api/billing/checkout", { seats: 1, interval: "month", adult: true, withdrawal: true }],
      ["/api/billing/credit", { pack: "k5", adult: true, withdrawal: true }],
      ["/api/billing/gift", { adult: true, withdrawal: true }],
      ["/api/billing/podari", { adult: true, understand: true }],
    ];
    for (const [path, body] of paths) {
      const r = await a(path, { method: "POST", body });
      assert.equal(r.status, 400, path);
      assert.equal(r.body.terms, true, `${path}: ${JSON.stringify(r.body)}`);
    }
    const r = await a("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", adult: true, withdrawal: true } });
    assert.equal(r.status, 400);
    assert.equal(r.body.terms, true);
    assert.equal(ctx.store.db.prepare("SELECT COUNT(*) AS n FROM billing_consents").get().n, 0);
  }));

test("nakup: potrditve z različico pogojev in opisom; po plačilu eno potrdilo po e-pošti", () =>
  withServer(async (ctx) => {
    const { stripe, store, hook } = ctx;
    const { a, parent } = await account(ctx, "kupec@pogoji.si");
    const co = await a("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", adult: true, withdrawal: true, terms: true, lang: "sl" } });
    assert.equal(co.status, 200, JSON.stringify(co.body));
    const c = store.db.prepare("SELECT * FROM billing_consents WHERE parent_id = ?").get(parent.id);
    assert.equal(c.terms_version, TERMS_VERSION);
    assert.ok(c.text.includes(TERMS_TEXT) && c.text.includes(WITHDRAWAL_TEXT), c.text);
    assert.match(c.item, /^Naročnina: .+ na mesec, samodejno podaljšanje do preklica$/);
    assert.match(c.checkout_id, /^cs_/);
    const before = mails(stripe).length;
    const session = { id: c.checkout_id, object: "checkout.session", status: "complete", payment_status: "paid", amount_total: 999, currency: "eur", customer_details: { email: "kupec@pogoji.si" }, metadata: { parent_id: String(parent.id) } };
    // Nedokončano (async) plačilo: še brez potrdila.
    await hook("checkout.session.completed", { ...session, payment_status: "unpaid" });
    assert.equal(mails(stripe).length, before);
    await hook("checkout.session.async_payment_succeeded", session);
    await hook("checkout.session.async_payment_succeeded", session); // nov dogodek iste seje: brez drugega potrdila
    const sent = mails(stripe).slice(before);
    assert.equal(sent.length, 1);
    const m = sent[0];
    assert.equal(m.to[0], "kupec@pogoji.si");
    assert.match(m.subject, /potrdilo o nakupu/);
    assert.ok(m.text.includes(c.item), "kaj je kupljeno");
    assert.match(m.text, /Plačano ob nakupu: 9,99\s€/);
    assert.ok(m.text.includes(WITHDRAWAL_TEXT), "izjava o odstopu, ki jo je kupec potrdil");
    assert.ok(m.text.includes(`različica ${termsVersionText(TERMS_VERSION)}`) && m.text.includes("/pogoji.html"));
    assert.ok(m.text.includes("zasebnost@evklid.app") && m.text.includes("/pogoji.html#obrazec"), "kako odstopi");
    assert.ok(m.html.includes("zasebnost@evklid.app"));
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM email_log WHERE kind = 'purchase' AND ok = 1").get().n, 1);
  }));

test("seja brez zapisa potrditev (tuja ali stara) ne dobi potrdila", () =>
  withServer(async (ctx) => {
    const { stripe, hook } = ctx;
    const before = mails(stripe).length;
    await hook("checkout.session.completed", { id: "cs_tuja", object: "checkout.session", status: "complete", payment_status: "paid", amount_total: 500, currency: "eur", customer_details: { email: "x@y.si" }, metadata: {} });
    assert.equal(mails(stripe).length, before);
  }));
