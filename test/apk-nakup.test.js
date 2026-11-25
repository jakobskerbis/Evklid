// Nakup naročnine v APK s strani /prenesi (kanal "direct"): aplikacija ne kliče /api/billing/checkout sama (strežnik
// zahteva potrditve polnoletnosti in odstopa, ki jih da samo spletni obrazec), ampak odpre spletni zavihek Račun v
// aplikaciji: /api/mobile/web?to=/?pogled=racun (mobile/src/lib/billing.ts openWebAccount, src/app/web.tsx).
// Različica iz trgovin (Apple, Google) ostane nakup v trgovini.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { safeTarget } from "../server/mobile/web-session.js";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}
const YEAR = new Date().getFullYear();

test("APK: nakup odpre spletni zavihek Račun, trgovine ostanejo pri nakupu v trgovini", () => {
  const billing = read("mobile/src/lib/billing.ts");
  assert.doesNotMatch(billing, /api(<[^>]*>)?\("\/api\/billing\/checkout"/, "aplikacija ne pošilja nakupa brez potrditev");
  assert.match(billing, /export function openWebAccount\(\) \{\n\s*router\.dismissTo\(\{ pathname: "\/web", params: \{ to: "\/\?pogled=racun", n: String\(Date\.now\(\)\) \} \}\);/);
  const sub = read("mobile/src/app/subscription.tsx");
  assert.match(sub, /if \(!usesStoreBilling\) return openWebAccount\(\);/);
  assert.match(sub, /const out = await buyInStore\(p, info\.account_token\);/);
  assert.doesNotMatch(sub, /buyOnWeb/);
  const web = read("mobile/src/app/web.tsx");
  assert.match(web, /useLocalSearchParams<\{ to\?: string; n\?: string \}>\(\)/);
  assert.match(web, /useState\(\(\) => \(\{ uri: webStart\(to\), headers: appHeaders\(\) \}\)\)/);
  // Samo poti s seznama: povezava evklid:// ne sme prijavljenega WebViewa poslati drugam po evklid.app.
  assert.match(web, /const TO = new Set\(\["\/", "\/\?pogled=racun"\]\);\nconst webStart = \(to\?: string\) => `\$\{ORIGIN\}\/api\/mobile\/web\?to=\$\{encodeURIComponent\(typeof to === "string" && TO\.has\(to\) \? to : "\/"\)\}`;/);
  const src = web.match(/const TO = [^\n]*\nconst webStart = [^\n]*/)[0].replace("(to?: string)", "(to)");
  const webStart = new Function("ORIGIN", `${src}; return webStart;`)("https://evklid.app");
  assert.equal(webStart("/?pogled=racun"), "https://evklid.app/api/mobile/web?to=%2F%3Fpogled%3Dracun");
  assert.equal(webStart(), "https://evklid.app/api/mobile/web?to=%2F");
  assert.equal(webStart("/?reset=x"), "https://evklid.app/api/mobile/web?to=%2F");
  assert.equal(webStart("//drug.si/"), "https://evklid.app/api/mobile/web?to=%2F");
  // Pot gre skozi /api/mobile/web (seja aplikacije), strežnik jo sprejme; tuje poti ne.
  assert.equal(safeTarget("/?pogled=racun"), "/?pogled=racun");
  assert.equal(safeTarget("//drug.si/?pogled=racun"), "/");
});

const opts = { skip: !playwright && "Playwright ni nameščen", timeout: 120_000 };

test("splet: /?pogled=racun odpre zavihek Račun z obrazcem za naročnino (telefon)", opts, async () => {
  const store = openDb(":memory:");
  const calls = [];
  const fetchFn = async (url, init = {}) => {
    const u = new URL(url);
    const body = init.body && init.headers?.["Content-Type"]?.includes("json") ? JSON.parse(init.body) : null;
    calls.push({ host: u.host, body });
    const ok = (data) => ({ ok: true, status: 200, json: async () => data });
    if (u.pathname.endsWith("/prices") && init.method === "GET") return ok({ data: [] });
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
      headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
      body: o.body ? JSON.stringify(o.body) : undefined,
    });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      jar[kv.slice(0, kv.indexOf("="))] = kv.slice(kv.indexOf("=") + 1);
    }
    return { status: res.status, body: (res.headers.get("content-type") || "").includes("json") ? await res.json() : null };
  };
  const browser = await playwright.chromium.launch();
  try {
    const reg = await call("/api/auth/register", { method: "POST", body: { email: "stars@primer.si", password: "geslo1234", accept_privacy: true, birth_date: `${YEAR - 40}-03-01` } });
    assert.equal(reg.status, 201, JSON.stringify(reg.body));
    const mail = calls.filter((c) => c.host === "api.resend.com").at(-1);
    await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
    const kid = await call("/api/students", { method: "POST", body: { name: "Lara", birth_year: YEAR - 12, consent: true } });
    assert.equal(kid.status, 201, JSON.stringify(kid.body));
    store.db.prepare("UPDATE students SET settings = json_set(settings, '$.interests', json('[]'), '$.tour_version', 999, '$.language', 'sl')").run();
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z', birth_asked_at = datetime('now')").run();

    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true, locale: "sl-SI", timezoneId: "Europe/Ljubljana", serviceWorkers: "block" });
    await ctx.addCookies(Object.entries(jar).map(([name, value]) => ({ name, value, url: base })));
    await ctx.addInitScript((id) => {
      localStorage.setItem("evklid.lang", "sl");
      localStorage.setItem("studentId", String(id));
    }, kid.body.id);
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(base + "/?pogled=racun", { waitUntil: "load" });
    await page.locator("#plan-form").waitFor({ timeout: 20_000 });
    assert.equal(await page.locator("#view-account").isVisible(), true);
    assert.equal(await page.locator("#account-tab").evaluate((el) => el.classList.contains("active")), true, "zavihek Račun je označen");
    // Obrazec ima potrditvi pred plačilom (polnoletnost, odstop), ki ju aplikacija sama ni pošiljala; pokažeta se po izbiri paketa.
    assert.ok((await page.locator('#plan-form input[type="checkbox"]').count()) >= 2);
    await page.locator('#plan-form input[name=who][value="1"]').check();
    assert.equal(await page.locator("#plan-rest").isVisible(), true);
    for (const name of ["adult", "withdrawal"]) assert.equal(await page.locator(`#plan-form input[type="checkbox"][name="${name}"]`).isVisible(), true, `potrditev ${name} je vidna`);
    assert.equal(new URL(page.url()).search, "", "parameter izgine iz naslova");
    assert.equal(calls.some((c) => c.body?.mode === "subscription"), false, "brez plačilne seje Stripa samo ob odprtju");

    // Brez parametra ostane običajen zagon (ne Račun).
    await page.goto(base + "/", { waitUntil: "load" });
    // Pravi pogled po zagonu app.js (Učna pot s strežnika, server/pot-takoj.js, je pred tem main[data-posnetek]).
    await page.locator("main#view-path:not([data-posnetek])").waitFor({ state: "visible", timeout: 20_000 });
    assert.equal(await page.locator("#view-account").isVisible(), false);
    assert.deepEqual(errors, []);
    await ctx.close();
  } finally {
    await browser.close();
    server.close();
  }
});
