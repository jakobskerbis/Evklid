// Kartica ob porabljenih brezplačnih vprašanjih v brskalniku (telefon 360×740, dotik): mladoletni imetnik dobi
// »Pošlji povezavo staršu« (povezava za plačilo naročnine), polnoleten »Izberi naročnino« (zavihek Račun), brez
// plačil (Stripe ni nastavljen) samo primerjavo in Vadnico. Dnevna meja 1 vprašanje (EVKLID_FREE_DAILY_QUESTIONS).
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

const YEAR = new Date().getFullYear();

// Lažni Stripe in Resend (kot test/accounts.test.js): povezava za plačilo Stripa ne kliče.
function fakeFetch(calls) {
  return async (url, init = {}) => {
    const u = new URL(url);
    const body = init.body && init.headers?.["Content-Type"]?.includes("json") ? JSON.parse(init.body) : null;
    calls.push({ host: u.host, body });
    const ok = (data) => ({ ok: true, status: 200, json: async () => data });
    if (u.host === "api.resend.com") return ok({ id: "email_1" });
    if (u.pathname.endsWith("/prices") && init.method === "GET") return ok({ data: [] });
    return ok({ id: "x_1", data: [] });
  };
}

async function blockedAccount({ billing, age }) {
  const store = openDb(":memory:");
  const calls = [];
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    stripeKey: billing ? "sk_test_x" : "",
    resendKey: "re_x",
    fetchFn: fakeFetch(calls),
    log: { error() {}, warn() {}, info() {} },
    streamFn: async ({ onText }) => {
      onText("V redu.");
      return { text: 'V redu.\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>', stopReason: "end_turn" };
    },
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = {};
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, {
      method: opts.method || "GET",
      redirect: "manual",
      headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      jar[kv.slice(0, kv.indexOf("="))] = kv.slice(kv.indexOf("=") + 1);
    }
    return { status: res.status, body: (res.headers.get("content-type") || "").includes("json") ? await res.json() : null };
  };
  const reg = await call("/api/auth/register", { method: "POST", body: { email: "ucenec@primer.si", password: "geslo1234", accept_privacy: true, birth_date: `${YEAR - age}-03-01` } });
  assert.equal(reg.status, 201, JSON.stringify(reg.body));
  const mail = calls.filter((c) => c.host === "api.resend.com").at(-1);
  await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
  const kid = await call("/api/students", { method: "POST", body: { name: "Lara", birth_year: YEAR - age, self: true, consent: true } });
  assert.equal(kid.status, 201, JSON.stringify(kid.body));
  // Brez vprašalnika zanimanj in vodiča ob prvem zagonu; preizkus je potekel (brezplačni paket).
  store.db.prepare("UPDATE students SET settings = json_set(settings, '$.interests', json('[]'), '$.tour_version', 999, '$.language', 'sl')").run();
  store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z', birth_asked_at = datetime('now')").run();
  const conv = (await call(`/api/students/${kid.body.id}/conversations`, { method: "POST" })).body;
  assert.equal((await call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "prvo" } })).status, 200);
  return { server, base, jar, store };
}

async function cardFor(browser, acc) {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true, locale: "sl-SI", timezoneId: "Europe/Ljubljana" });
  await ctx.addCookies(Object.entries(acc.jar).map(([name, value]) => ({ name, value, url: acc.base })));
  await ctx.addInitScript(() => localStorage.setItem("evklid.lang", "sl"));
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(acc.base + "/", { waitUntil: "load" });
  const input = page.locator("#input");
  for (let i = 0; i < 45 && !(await input.isVisible().catch(() => false)); i++) {
    await page.evaluate(() => {
      const tour = document.querySelector("#tour");
      if (tour) tour.hidden = true;
      document.querySelector('.tab[data-view="chat"]')?.click();
    }).catch(() => {});
    await page.waitForTimeout(500);
  }
  await input.fill("Koliko je 2 + 2?");
  await page.locator("#send").tap();
  const card = page.locator(".meja-card");
  await card.waitFor({ timeout: 10_000 });
  return { ctx, page, card, errors };
}

const opts = { skip: !playwright && "Playwright ni nameščen", timeout: 120_000 };

test("kartica ob meji na telefonu: mladoletni, polnoleten in brez plačil", opts, async () => {
  process.env.EVKLID_FREE_DAILY_QUESTIONS = "1";
  const browser = await playwright.chromium.launch();
  const open = [];
  try {
    // Mladoletni imetnik (16): povezava za starša, brez gumba za plačilo v aplikaciji.
    const minor = await blockedAccount({ billing: true, age: 16 });
    open.push(minor.server);
    const m = await cardFor(browser, minor);
    assert.equal(await m.card.getAttribute("data-variant"), "offer-link");
    assert.equal(await m.card.getAttribute("role"), "group");
    assert.match(await m.card.innerText(), /Jutri jih spet dobiš/);
    assert.match(await m.card.innerText(), /9,99\s€ na mesec/);
    const btn = m.card.locator("[data-meja-link]");
    assert.ok((await btn.boundingBox()).height >= 44, "gumb vsaj 44 px");
    // Kartica fokusa ne prevzame (polje za pisanje ga obdrži ali pa ga nima nihče v kartici).
    assert.equal(await m.page.evaluate(() => !!document.activeElement?.closest(".meja-card")), false);
    await btn.tap();
    const link = m.card.locator(".pay-link input");
    await link.waitFor();
    assert.match(await link.inputValue(), /\/placaj\.html\?t=[\w-]{20,}/);
    const row = minor.store.db.prepare("SELECT kind, plan_key FROM pay_links").get();
    assert.equal(row.kind, "sub");
    assert.match(row.plan_key, /_1_month/);
    assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "brez vodoravnega drsenja");
    assert.deepEqual(m.errors, []);
    await m.ctx.close();

    // Polnoleten imetnik (19): »Izberi naročnino« odpre zavihek Račun.
    const adult = await blockedAccount({ billing: true, age: 19 });
    open.push(adult.server);
    const a = await cardFor(browser, adult);
    assert.equal(await a.card.getAttribute("data-variant"), "offer-account");
    assert.equal(await a.card.locator("[data-meja-link]").count(), 0);
    await a.card.locator("[data-meja-account]").tap();
    await a.page.locator("#plan-form").waitFor({ timeout: 10_000 });
    assert.deepEqual(a.errors, []);
    await a.ctx.close();

    // Plačila niso nastavljena: primerjava brez cene in brez gumba; Vadnica odpre vajo.
    const off = await blockedAccount({ billing: false, age: 19 });
    open.push(off.server);
    const o = await cardFor(browser, off);
    assert.equal(await o.card.getAttribute("data-variant"), "offer");
    assert.match(await o.card.innerText(), /Z naročnino dobiš/);
    assert.doesNotMatch(await o.card.innerText(), /€|Izberi naročnino|zavihku Račun/);
    await o.card.locator("[data-meja-practice]").tap();
    await o.page.locator("#view-topic").waitFor({ state: "visible", timeout: 10_000 });
    await o.ctx.close();
  } finally {
    delete process.env.EVKLID_FREE_DAILY_QUESTIONS;
    await browser.close();
    for (const s of open) s.close();
  }
});
