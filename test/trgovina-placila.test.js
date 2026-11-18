// A) Različica iz trgovine (Google Play, App Store) brez nakupa s kartico: User-Agent »EvklidApp/<različica> store«
//    (mobile/src/app/web.tsx), splet skrije obrazce (public/pay-ui.js, account.js), strežnik zavrne nakup
//    (server/mobile/trgovina.js). APK (kanal »direct«) in starejše aplikacije brez kanala ostanejo, kot so.
// B) Vrnitev v APK po plačilu v zavihku brskalnika: stran osveži stanje računa (evklid:spet, visibilitychange).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { storeAppRequest } from "../server/mobile/trgovina.js";

// public/i18n.js po nalaganju nastavi jezik na document (kot test/meja-placilo.test.js).
globalThis.document ??= { documentElement: { dataset: {} }, querySelectorAll: () => [] };
const { isStoreApp, markCheckout, checkoutPending, watchReturnFromPay, CHECKOUT_MAX_AGE } = await import("../public/pay-ui.js");

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}
const YEAR = new Date().getFullYear();
const CHROME = "Mozilla/5.0 (Linux; Android 14; Pixel 8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0 Mobile Safari/537.36";

test("aplikacija pošlje kanal: v User-Agent spletnega pogleda in v glavi X-App-Channel", () => {
  const web = read("mobile/src/app/web.tsx");
  assert.match(web, /applicationNameForUserAgent=\{`EvklidApp\/\$\{Constants\.expoConfig\?\.version \?\? "1"\} \$\{CHANNEL\}`\}/);
  assert.match(web, /AppState\.addEventListener\("change"/);
  assert.match(web, /window\.dispatchEvent\(new Event\('evklid:spet'\)\);true;/);
  assert.doesNotMatch(web, /WebBrowser\.openBrowserAsync\(req\.url\)/, "povezave gredo skozi openTab");
  const api = read("mobile/src/lib/api.ts");
  assert.equal(api.match(/"x-app-channel": CHANNEL/g)?.length, 2, "appHeaders in request");
});

test("isStoreApp: samo »EvklidApp/<različica> store«", () => {
  assert.equal(isStoreApp(`${CHROME} EvklidApp/1.4.0 store`), true);
  assert.equal(isStoreApp(`${CHROME} EvklidApp/1.4.0 direct`), false);
  assert.equal(isStoreApp(`${CHROME} EvklidApp/1.3.0`), false, "starejši APK brez kanala");
  assert.equal(isStoreApp(`${CHROME} EvklidApp/1.4.0 storefront`), false);
  assert.equal(isStoreApp(CHROME), false);
  assert.equal(isStoreApp(undefined), false);
});

test("strežnik prepozna zahtevo aplikacije iz trgovine", () => {
  const req = (h) => ({ get: (k) => h[k.toLowerCase()] });
  assert.equal(storeAppRequest(req({ "x-app-client": "android/1.4.0", "x-app-channel": "store" })), true);
  assert.equal(storeAppRequest(req({ "x-app-client": "android/1.4.0", "x-app-channel": "direct" })), false);
  assert.equal(storeAppRequest(req({ "x-app-client": "android/1.3.0" })), false, "starejša aplikacija brez kanala");
  assert.equal(storeAppRequest(req({ "x-app-channel": "store" })), false, "brez X-App-Client glava kanala ne šteje");
  assert.equal(storeAppRequest(req({ "user-agent": `${CHROME} EvklidApp/1.4.0 store` })), true);
  assert.equal(storeAppRequest(req({ "user-agent": `${CHROME} EvklidApp/1.4.0 direct` })), false);
});

// Shramba in okno brez brskalnika (sessionStorage, dogodki).
function fakeWindow() {
  const data = new Map();
  globalThis.sessionStorage = { getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, String(v)), removeItem: (k) => data.delete(k) };
  const win = new EventTarget();
  win.document = new EventTarget();
  win.document.visibilityState = "visible";
  return { win, data };
}

test("vrnitev po plačilu: sync enkrat na 5 s, zahvala ob novi naročnini, zapis se pobriše", async () => {
  const { win, data } = fakeWindow();
  try {
    let t = 1_000_000;
    const now = () => t;
    const calls = [];
    let tier = "free";
    const seen = [];
    const api = async (path, o) => (calls.push([path, o?.method]), { access: { tier } });
    const run = watchReturnFromPay({ api, now, win, onSynced: (x) => seen.push(x.becamePaid) });
    await run();
    assert.equal(calls.length, 0, "brez začetega nakupa ni klica");

    const realNow = Date.now;
    Date.now = now;
    markCheckout("sub");
    Date.now = realNow;
    win.dispatchEvent(new Event("evklid:spet"));
    await new Promise((r) => setTimeout(r, 0));
    assert.deepEqual(calls, [["/api/billing/sync", "POST"]]);
    assert.deepEqual(seen, [false]);
    assert.equal(checkoutPending(t), true, "še ni plačano: zapis ostane");

    t += 2000;
    win.document.dispatchEvent(new Event("visibilitychange"));
    await new Promise((r) => setTimeout(r, 0));
    assert.equal(calls.length, 1, "v 5 s največ ena osvežitev");

    t += 4000;
    tier = "paid";
    win.document.dispatchEvent(new Event("visibilitychange"));
    await new Promise((r) => setTimeout(r, 0));
    assert.equal(calls.length, 2);
    assert.deepEqual(seen, [false, true]);
    assert.equal(data.size, 0, "plačano: zapis pobrisan");

    t += 10_000;
    await run();
    assert.equal(calls.length, 2, "po plačilu ni več klicev");

    // Dokup pogovorov: ena osvežitev, brez zahvale za naročnino, zapis pobrisan (tudi brez plačane naročnine).
    tier = "free";
    Date.now = now;
    markCheckout("credit");
    Date.now = realNow;
    t += 10_000;
    await run();
    assert.deepEqual(seen, [false, true, false]);
    assert.equal(data.size, 0, "enkratno plačilo: zapis po prvi osvežitvi pobrisan");
    t += 10_000;
    await run();
    assert.equal(calls.length, 3, "brez nadaljnjih klicev");

    // Star zapis (več kot 2 uri) ne velja.
    Date.now = now;
    markCheckout("sub");
    Date.now = realNow;
    t += CHECKOUT_MAX_AGE + 1;
    await run();
    assert.equal(calls.length, 3);
    assert.equal(data.size, 0);
  } finally {
    delete globalThis.sessionStorage;
  }
});

function setup() {
  const store = openDb(":memory:");
  const calls = [];
  const fetchFn = async (url, init = {}) => {
    const u = new URL(url);
    const body = init.body && init.headers?.["Content-Type"]?.includes("json") ? JSON.parse(init.body) : null;
    calls.push({ host: u.host, path: u.pathname, method: init.method || "GET", body, raw: typeof init.body === "string" ? init.body : "" });
    const ok = (data) => ({ ok: true, status: 200, json: async () => data });
    if (u.pathname.endsWith("/prices") && init.method === "GET") return ok({ data: [] });
    if (u.pathname.endsWith("/checkout/sessions")) return ok({ id: "cs_1", url: "https://checkout.stripe.com/c/pay/cs_1" });
    return ok({ id: "x_1", data: [] });
  };
  const app = createApp(store, { accounts: true, scheduler: false, stripeKey: "sk_test_x", resendKey: "re_x", fetchFn, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = {};
  const call = async (path, o = {}) => {
    const res = await fetch(base + path, {
      method: o.method || "GET",
      redirect: "manual",
      headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; "), ...(o.headers || {}) },
      body: o.body ? JSON.stringify(o.body) : undefined,
    });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      jar[kv.slice(0, kv.indexOf("="))] = kv.slice(kv.indexOf("=") + 1);
    }
    return { status: res.status, body: (res.headers.get("content-type") || "").includes("json") ? await res.json() : null };
  };
  const account = async () => {
    const reg = await call("/api/auth/register", { method: "POST", body: { email: "stars@primer.si", password: "geslo1234", accept_privacy: true, birth_date: `${YEAR - 40}-03-01` } });
    assert.equal(reg.status, 201, JSON.stringify(reg.body));
    const mail = calls.filter((c) => c.host === "api.resend.com").at(-1);
    await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
    const kid = await call("/api/students", { method: "POST", body: { name: "Lara", birth_year: YEAR - 12, consent: true } });
    assert.equal(kid.status, 201, JSON.stringify(kid.body));
    store.db.prepare("UPDATE students SET settings = json_set(settings, '$.interests', json('[]'), '$.tour_version', 999, '$.language', 'sl')").run();
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z', birth_asked_at = datetime('now')").run();
    return kid.body.id;
  };
  return { store, calls, server, base, jar, call, account };
}

test("strežnik: aplikacija iz trgovine ne more začeti nakupa s kartico, APK in splet lahko", async () => {
  const s = setup();
  try {
    await s.account();
    const body = { seats: 1, interval: "month", adult: true, withdrawal: true, terms: true };
    const stripeCalls = () => s.calls.filter((c) => c.path.endsWith("/checkout/sessions")).length;
    for (const path of ["/api/billing/checkout", "/API/billing/Checkout", "/api/billing/gift", "/api/billing/credit", "/api/billing/pass", "/api/billing/upgrade", "/api/billing/podari", "/api/billing/pay-link", "/api/billing/portal", "/api/pay/abc123/checkout"]) {
      const r = await s.call(path, { method: "POST", body, headers: { "user-agent": `${CHROME} EvklidApp/1.4.0 store` } });
      assert.equal(r.status, 403, path);
      assert.equal(r.body.store_app, true, path);
    }
    const native = await s.call("/api/billing/checkout", { method: "POST", body, headers: { "x-app-client": "android/1.4.0", "x-app-channel": "store" } });
    assert.equal(native.status, 403);
    assert.equal(stripeCalls(), 0, "brez plačilne seje Stripa");
    // Stanje dokupa (GET) in potrditev ob vrnitvi ostaneta.
    assert.equal((await s.call("/api/billing/credit", { headers: { "user-agent": `${CHROME} EvklidApp/1.4.0 store` } })).status, 200);
    const old = await s.call("/api/billing/checkout", { method: "POST", body, headers: { "user-agent": `${CHROME} EvklidApp/1.3.0` } });
    assert.notEqual(old.body?.store_app, true, "starejši APK brez kanala");
    const apk = await s.call("/api/billing/checkout", { method: "POST", body, headers: { "user-agent": `${CHROME} EvklidApp/1.4.0 direct` } });
    assert.equal(apk.status, 200, JSON.stringify(apk.body));
    assert.equal(stripeCalls(), 2);
    // Stran za uspeh: »&app=1« samo za nakup iz aplikacije.
    const urls = s.calls.filter((c) => c.path.endsWith("/checkout/sessions")).map((c) => decodeURIComponent(c.raw));
    assert.match(urls[1], /billing=success&app=1&session_id=/);
    assert.equal((await s.call("/api/billing/checkout", { method: "POST", body, headers: { "user-agent": CHROME } })).status, 200);
    assert.match(decodeURIComponent(s.calls.filter((c) => c.path.endsWith("/checkout/sessions")).at(-1).raw), /billing=success&session_id=/);

    // /api/billing/sync: največ en klic Stripa na 5 s za istega starša.
    s.store.db.prepare("UPDATE parents SET stripe_customer_id = 'cus_x'").run();
    const subsCalls = () => s.calls.filter((c) => c.path.endsWith("/subscriptions") && c.method === "GET").length;
    const before = subsCalls();
    assert.equal((await s.call("/api/billing/sync", { method: "POST" })).status, 200);
    const again = await s.call("/api/billing/sync", { method: "POST" });
    assert.equal(again.status, 200);
    assert.ok(again.body.access, "vmes stanje iz baze");
    assert.equal(subsCalls() - before, 1);
  } finally {
    s.server.close();
  }
});

const opts = { skip: !playwright && "Playwright ni nameščen", timeout: 180_000 };

test("splet v aplikaciji: trgovina brez nakupov, APK osveži Račun ob vrnitvi s plačila", opts, async () => {
  const s = setup();
  const browser = await playwright.chromium.launch();
  try {
    const kid = await s.account();
    const open = async (ua) => {
      const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true, locale: "sl-SI", timezoneId: "Europe/Ljubljana", serviceWorkers: "block", userAgent: ua });
      await ctx.addCookies(Object.entries(s.jar).map(([name, value]) => ({ name, value, url: s.base })));
      await ctx.addInitScript((id) => {
        localStorage.setItem("evklid.lang", "sl");
        localStorage.setItem("studentId", String(id));
      }, kid);
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(s.base + "/?pogled=racun", { waitUntil: "load" });
      await page.locator("#view-account h1").waitFor({ timeout: 20_000 });
      await page.locator("#credit-card").waitFor({ state: "attached" });
      await page.waitForTimeout(300);
      return { ctx, page, errors };
    };

    // Kartica paketa pred testom z izmišljeno ponudbo (strežnik jo ponudi le ob testu v urniku).
    const passCard = (page) =>
      page.evaluate(async () => {
        const m = await import("/pass-offer.js");
        const el = document.createElement("div");
        const api = async () => ({ offer: { test: { name: "Ulomki", date: "2030-01-10" }, suggested: 7 }, passes: [{ days: 7, amount: 900, currency: "EUR" }] });
        await m.renderPassOffer(el, { api, studentId: 1, toast() {} });
        return el.querySelectorAll("form, [data-pass-now], [data-pass-link]").length;
      });
    const UNPAID = ["#plan-form", "#gift-form", "#podari-form", ".credit-go", "#promo-form"];
    const PAID = ["[data-upgrade]", "#portal-btn"];
    const STORE = `${CHROME} EvklidApp/1.4.0 store`;
    const APK = `${CHROME} EvklidApp/1.4.0 direct`;
    const counts = async (ua, sels) => {
      const x = await open(ua);
      const out = {};
      for (const sel of sels) out[sel] = await x.page.locator(sel).count();
      out.pass = await passCard(x.page);
      out.errors = x.errors;
      await x.ctx.close();
      return out;
    };
    // Isto stanje računa: v APK so obrazci, v različici iz trgovine nobenega (sicer 0 ne bi nič dokazal).
    const apkFree = await counts(APK, [...UNPAID, ".podari-card"]);
    const storeFree = await counts(STORE, [...UNPAID, "#plan-link", ".podari-card"]);
    for (const sel of UNPAID) {
      assert.ok(apkFree[sel] > 0, `APK: ${sel}`);
      assert.equal(storeFree[sel], 0, `trgovina: ${sel}`);
    }
    assert.ok(apkFree.pass > 0, "APK: paket pred testom");
    assert.equal(storeFree.pass, 0, "trgovina: brez paketa pred testom");
    assert.equal(storeFree["#plan-link"], 0);
    assert.equal(storeFree[".podari-card"], 0, "trgovina: brez kartice Podari");
    assert.ok(apkFree[".podari-card"] > 0);
    assert.deepEqual([...apkFree.errors, ...storeFree.errors], []);

    const end = new Date(Date.now() + 30 * 86400000).toISOString();
    s.store.db.prepare("UPDATE parents SET sub_status = 'active', sub_plan = 'evklid_1_month', sub_id = 'sub_x', sub_provider = 'stripe', stripe_customer_id = 'cus_x', sub_period_end = ?").run(end);
    const apkPaid = await counts(APK, PAID);
    const storePaid = await counts(STORE, PAID);
    for (const sel of PAID) {
      assert.ok(apkPaid[sel] > 0, `APK: ${sel}`);
      assert.equal(storePaid[sel], 0, `trgovina: ${sel}`);
    }
    s.store.db.prepare("UPDATE parents SET sub_status = NULL, sub_plan = NULL, sub_id = NULL, stripe_customer_id = NULL, sub_period_end = NULL").run();

    // APK: obrazec je; po odhodu na Stripe (zapis nakupa) in plačilu se ob vrnitvi Račun izriše znova.
    const apk = await open(`${CHROME} EvklidApp/1.4.0 direct`);
    await apk.page.locator("#plan-form").waitFor();
    await apk.page.evaluate(() => sessionStorage.setItem("evklid.checkout", String(Date.now())) || sessionStorage.setItem("evklid.checkout.vrsta", "sub"));
    s.store.db.prepare("UPDATE parents SET sub_status = 'active', sub_plan = 'evklid_1_month', sub_period_end = ?").run(end);
    await apk.page.evaluate(() => window.dispatchEvent(new Event("evklid:spet")));
    await apk.page.locator("#plan-form").waitFor({ state: "detached", timeout: 10_000 });
    await apk.page.locator("#toast", { hasText: "Hvala! Naročnina je aktivna." }).waitFor({ timeout: 5000 });
    assert.equal(await apk.page.evaluate(() => sessionStorage.getItem("evklid.checkout")), null);
    assert.ok(s.calls.length > 0);
    assert.deepEqual(apk.errors, []);
    await apk.ctx.close();

    // Stran za uspeh v zavihku brskalnika brez prijave: obvestilo namesto pristajalne strani.
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, locale: "sl-SI", serviceWorkers: "block" });
    await ctx.addInitScript(() => localStorage.setItem("evklid.lang", "sl"));
    const page = await ctx.newPage();
    await page.goto(s.base + "/?billing=success&app=1&session_id=cs_1", { waitUntil: "load" });
    await page.locator("#view-auth h1", { hasText: "Plačilo je uspelo. Vrni se v aplikacijo Evklid." }).waitFor({ timeout: 20_000 });
    // Brez »app=1« (plačilo na spletu): samo prijava; »cancel« ostane običajna stran.
    await page.goto(s.base + "/?billing=credit&session_id=cs_1", { waitUntil: "load" });
    await page.locator("#view-auth h1", { hasText: "Plačilo je uspelo. Prijavi se." }).waitFor({ timeout: 20_000 });
    await page.goto(s.base + "/?billing=cancel", { waitUntil: "load" });
    await page.locator("#view-auth h1").first().waitFor({ timeout: 20_000 });
    assert.equal(await page.locator("#paid-login").count(), 0);
    await page.goto(s.base + "/?billing=success&session_id=cs_1", { waitUntil: "load" });
    await page.locator("#paid-login").click();
    await page.locator('#view-auth input[type="password"]').waitFor({ timeout: 5000 });
    await ctx.close();
  } finally {
    await browser.close();
    s.server.close();
  }
});
