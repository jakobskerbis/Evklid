// Potrditev e-naslova ni zid pred prvo nalogo (#747, j 2026-11-17). Pred potrditvijo: en lasten profil in učenje z
// brezplačnim paketom v kvoti omrežja (novi računi z izmišljenimi naslovi ne dobijo vsak svoje); profil za otroka,
// drugi profil, plačila, izvoz, gesla profilov, aktivacijska koda in poročilo na e-pošto šele po potrditvi.
// Ponovno pošiljanje povezave ima mejo na strežniku (točka 4), mladoletni dobi e-pošto s »ti« (točka 2).
// Spletni del: opomnik po rešeni nalogi (public/potrditev-po-nalogi.js) v Chromiumu na telefonu.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const META = '\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>';
const YEAR = new Date().getFullYear();

async function withServer(env, fn) {
  const prev = {};
  for (const [k, v] of Object.entries(env)) {
    prev[k] = process.env[k];
    process.env[k] = v;
  }
  const store = openDb(":memory:");
  const mails = [];
  const fetchFn = async (url, init = {}) => {
    if (new URL(url).host === "api.resend.com") mails.push(JSON.parse(init.body));
    return { ok: true, status: 200, json: async () => ({ id: "x" }) };
  };
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    resendKey: "re_x",
    fetchFn,
    log: { error() {}, info() {}, warn() {} },
    streamFn: async ({ onText }) => {
      onText("ok");
      return { text: "ok" + META, stopReason: "end_turn" };
    },
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = (headers = {}) => {
    const jar = {};
    return async (p, opts = {}) => {
      const res = await fetch(base + p, {
        method: opts.method || "GET",
        redirect: "manual",
        headers: { "Content-Type": "application/json", ...headers, cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
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
  const register = async (call, email, birth) => {
    const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: birth } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
  };
  const mailTo = (email) => mails.filter((m) => m.to[0] === email);
  const verify = async (call, email) => assert.equal((await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mailTo(email).at(-1).text)[0])).status, 302);
  const parent = (email) => store.db.prepare("SELECT * FROM parents WHERE email = ?").get(email);
  try {
    await fn({ store, client, register, verify, parent, mailTo, base });
  } finally {
    server.close();
    for (const [k, v] of Object.entries(prev)) v === undefined ? delete process.env[k] : (process.env[k] = v);
  }
}

const ask = async (call, kidId, n) => {
  const conv = (await call(`/api/students/${kidId}/conversations`, { method: "POST" })).body;
  const out = [];
  for (let i = 0; i < n; i++) out.push(await call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: `vprašanje ${i}` } }));
  return out;
};

test("#747: dijak (16) brez potrditve ustvari svoj profil in se uči; drugi profil šele po potrditvi", async () => {
  await withServer({ EVKLID_FREE_DAILY_QUESTIONS: "2" }, async ({ client, register, verify, parent, mailTo, store }) => {
    const a = client();
    await register(a, "dijak@primer.si", `${YEAR - 16}-03-04`);
    const st = (await a("/api/account/status")).body;
    assert.equal(st.parent.verified, false);
    const kid = await a("/api/students", { method: "POST", body: { name: "Tia", birth_year: YEAR - 16, consent: true } });
    assert.equal(kid.status, 201, JSON.stringify(kid.body));
    // Naloga in inštruktor delujeta pred potrditvijo (brezplačni paket: 2 vprašanji, nato namig za potrditev).
    const next = await a(`/api/students/${kid.body.id}/practice/next`, { method: "POST", body: {} });
    assert.ok(next.status < 400, `vadnica ${next.status}`);
    const r = await ask(a, kid.body.id, 3);
    assert.deepEqual(r.map((x) => x.status), [200, 200, 429]);
    assert.equal(r[2].body.code, "block.freeDaily");
    assert.equal(r[2].body.hint, "block.hintVerify");
    assert.match(r[2].body.error, /potrdi e-naslov/);
    // Drug profil pred potrditvijo ne gre.
    const second = await a("/api/students", { method: "POST", body: { name: "Brat", birth_year: YEAR - 10, consent: true } });
    assert.equal(second.status, 403);
    assert.equal(second.body.verify, true);

    // E-pošta za mladoletnega: »ti«, brez izjave zakonitega zastopnika (#747 točka 2).
    const m = mailTo("dijak@primer.si")[0];
    assert.equal(m.subject, "Potrdi e-naslov za Evklid");
    assert.doesNotMatch(m.html, /zakoniti zastopnik/);

    await verify(a, "dijak@primer.si");
    const p = parent("dijak@primer.si");
    assert.ok(p.email_verified_at);
    assert.equal(p.guest_net, null, "po potrditvi ne šteje več v kvoto omrežja");
    assert.ok(Date.parse(p.trial_ends_at) > Date.now(), "preizkus velja");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM students WHERE parent_id = ?").get(p.id).n, 1, "profil in napredek ostaneta");
  });
});

test("#747: polnoleten imetnik pred potrditvijo: lasten profil da, profil za otroka ne; varnostna dejanja zaprta", async () => {
  await withServer({}, async ({ client, register, verify, mailTo }) => {
    const a = client();
    await register(a, "stars@primer.si", "1985-04-12");
    assert.match(mailTo("stars@primer.si")[0].html, /zakoniti zastopnik/, "polnoletni: besedilo kot prej");
    const child = await a("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 9, consent: true } });
    assert.equal(child.status, 403);
    assert.equal(child.body.verify, true);
    const own = await a("/api/students", { method: "POST", body: { name: "Jaz", self: true, birth_year: 1985, consent: true } });
    assert.equal(own.status, 201, JSON.stringify(own.body));

    const blocked = [
      ["/api/billing/checkout", { plan: "monthly" }],
      ["/api/billing/pass", {}],
      ["/api/billing/pay-link", {}],
      ["/api/account/export", { password: "geslo1234" }],
      ["/api/account/profile-password", { student_id: own.body.id, auth: "geslo1234", password: "novogeslo" }],
      ["/api/account/promo", { code: "X" }],
      ["/api/account/weekly-report/send", {}],
      ["/API/Account/Export/", { password: "geslo1234" }],
    ];
    for (const [p, body] of blocked) {
      const r = await a(p, { method: "POST", body });
      assert.equal(r.status, 403, `${p}: ${r.status} ${JSON.stringify(r.body)}`);
      assert.equal(r.body.verify, true, p);
    }
    // Branje stanja in izbris lastnega profila ostaneta (GDPR, napačen e-naslov).
    assert.equal((await a("/api/account")).status, 200);

    await verify(a, "stars@primer.si");
    assert.equal((await a("/api/account/export", { method: "POST", body: { password: "geslo1234" } })).status, 200);
    const later = await a("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 9, consent: true } });
    assert.equal(later.status, 201, JSON.stringify(later.body));
  });
});

test("#747: nepotrjeni računi z istega omrežja si delijo brezplačno kvoto (izmišljeni naslovi ne dajo novih vprašanj)", async () => {
  await withServer({ EVKLID_FREE_DAILY_QUESTIONS: "2" }, async ({ client, register }) => {
    const a = client();
    await register(a, "prvi@primer.si", `${YEAR - 17}-01-01`);
    const ka = (await a("/api/students", { method: "POST", body: { name: "A", birth_year: YEAR - 17, consent: true } })).body;
    assert.deepEqual((await ask(a, ka.id, 2)).map((x) => x.status), [200, 200]);
    const b = client();
    await register(b, "drugi@primer.si", `${YEAR - 17}-01-01`);
    const kb = (await b("/api/students", { method: "POST", body: { name: "B", birth_year: YEAR - 17, consent: true } })).body;
    const r = await ask(b, kb.id, 1);
    assert.equal(r[0].status, 429);
    assert.equal(r[0].body.hint, "block.hintVerify");
  });
});

test("#747 točka 4: ponovno pošiljanje povezave ima mejo na strežniku (3 na 15 min na račun)", async () => {
  await withServer({}, async ({ client, register, mailTo }) => {
    const a = client({ "x-forwarded-for": "203.0.113.7" });
    await register(a, "znova@primer.si", "1990-01-01");
    for (let i = 0; i < 3; i++) assert.equal((await a("/api/auth/resend-verification", { method: "POST" })).status, 200, `poskus ${i + 1}`);
    const r = await a("/api/auth/resend-verification", { method: "POST" });
    assert.equal(r.status, 429);
    assert.ok(r.body.retry_after > 0 && r.body.retry_after <= 900, String(r.body.retry_after));
    assert.equal(r.headers.get("retry-after"), String(r.body.retry_after));
    assert.equal(mailTo("znova@primer.si").length, 4, "registracija + 3 ponovna pošiljanja, četrtega ni");
  });
});

// Spletni del: po registraciji ni zaslona »Potrdi e-naslov«, ampak obrazec za lasten profil; po pravilno rešeni nalogi
// kartica s »Pošlji znova« in »Pozneje«. Lasten strežnik (vrata 3561), testni način.
let chromium = null;
const require = createRequire(import.meta.url);
for (const p of ["playwright", process.env.PLAYWRIGHT, "/opt/npm-tools/node_modules/playwright"].filter(Boolean)) {
  try {
    ({ chromium } = require(p));
    break;
  } catch {}
}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 240000 };

test("#747 splet: registracija → lasten profil brez potrditve → po rešeni nalogi opomnik za potrditev", opts, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "potrdi-"));
  const port = 3561 + Math.floor(Math.random() * 300);
  const env = { ...process.env, PORT: String(port), EVKLID_MOCK: "1", EVKLID_MOCK_DELAY_MS: "0", EVKLID_NEWS: "0", EVKLID_DB: path.join(dir, "t.db"), EVKLID_PASSWORD: "", ANTHROPIC_API_KEY: "", RESEND_API_KEY: "", STRIPE_SECRET_KEY: "", EVKLID_ACCOUNTS: "1" };
  const srv = spawn(process.execPath, ["server/index.js"], { cwd: new URL("..", import.meta.url).pathname, env, stdio: "ignore" });
  const base = `http://127.0.0.1:${port}`;
  let browser;
  try {
    for (let i = 0; i < 150; i++) {
      try {
        if ((await fetch(base + "/healthz")).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 200));
    }
    browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true, locale: "sl-SI", serviceWorkers: "block" });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base + "/#registracija");
    await page.waitForSelector("#auth-form");
    const f = page.locator("#auth-form");
    await f.locator('[name="email"]').fill("splet@primer.si");
    await f.locator('[name="password"]').fill("geslo1234");
    await f.locator('[name="birth_date"]').fill(`${YEAR - 16}-05-05`);
    for (const box of await f.locator('input[type="checkbox"][required]').all()) await box.check();
    await f.locator('button[type="submit"], button.primary').first().click();
    // Ni zidu: obrazec za lasten profil z opombo, da se e-naslov potrdi pozneje.
    await page.waitForSelector("#child-form", { timeout: 20000 });
    assert.equal(await page.locator("#verify-done").count(), 0, "zaslon »Potrdi e-naslov« se ne pokaže");
    assert.ok((await page.locator("#view-auth").innerText()).includes("E-naslov lahko potrdiš pozneje"));

    // Opomnik po rešeni nalogi: modul neposredno (naloga v testnem načinu je naključna).
    const pid = await page.evaluate(async () => {
      const r = await fetch("/api/students", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Splet", birth_year: new Date().getFullYear() - 16, consent: true }) });
      return (await r.json()).id;
    });
    assert.ok(pid);
    await page.goto(base + "/");
    await page.waitForFunction(() => !document.body.classList.contains("auth-mode"), null, { timeout: 30000 }).catch(() => {});
    await page.evaluate(async () => {
      const slot = document.createElement("div");
      slot.id = "test-slot";
      document.body.prepend(slot);
      const acc = await import("/account.js");
      // Stanje računa je naloženo ob zagonu aplikacije.
      for (let i = 0; i < 50 && !acc.accountStatus(); i++) await new Promise((r) => setTimeout(r, 100));
      await (await import("/potrditev-po-nalogi.js")).potrdiPoNalogi(slot);
    });
    const card = page.locator("#test-slot .potrdi-kartica");
    await card.waitFor({ timeout: 10000 });
    assert.ok((await card.innerText()).includes("splet@primer.si"));
    const resend = card.locator('[data-potrdi="znova"]');
    const box = await resend.boundingBox();
    assert.ok(box.height >= 40, `gumb ${box.height} px`);
    await resend.tap();
    await page.waitForFunction(() => document.querySelector('#test-slot [role="status"]')?.textContent.startsWith("Poslano"));
    await card.locator('[data-potrdi="pozneje"]').tap();
    assert.equal(await page.locator("#test-slot .potrdi-kartica").count(), 0);
    assert.ok(await page.evaluate(() => Number(localStorage.getItem("evklid.potrdi_pozneje")) > 0));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "brez vodoravnega drsenja");
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    srv.kill();
  }
});
