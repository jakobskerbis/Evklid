// Ovire na telefonu (generalka dijaka 18. 11. 2026): ena vrstica »Imam kodo« ob registraciji (vrsto kode določi
// strežnik), Račun in »Potrdi e-naslov« brez besedil za starše pri profilu »Zame« (self_only), raven mature
// »Še ne vem« (letnik brez ravni) in letnik z ravnijo v enem izbirnem seznamu glave Inštruktorja.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { nextLevel } from "../server/level-up.js";
import { createRequire } from "node:module";
import SL from "../public/i18n/sl.js";

globalThis.document ??= { documentElement: { dataset: {} }, querySelectorAll: () => [] };
const { levelChoices, ravenChoices } = await import("../public/level-picker.js");

const ROOT = path.join(import.meta.dirname, "..");
const KEYS = ["code.have", "code.label", "code.hint", "code.giftLater", "code.unknown", "code.refOk", "acct.trialSelf", "lp.unsure", "lp.unsureSub"];
const ADULT = `${new Date().getFullYear() - 18}-01-01`;

test("novi ključi: v sl.js in vseh 32 ui/*.json, prevedeni, {date} ohranjen", () => {
  const dir = path.join(ROOT, "public/i18n/ui");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.equal(files.length, 32);
  for (const k of KEYS) assert.ok(SL[k], `sl ${k}`);
  for (const f of files) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    for (const k of KEYS) {
      assert.ok(j[k], `${f} ${k}`);
      assert.notEqual(j[k], SL[k], `${f} ${k} ni preveden`);
    }
    assert.match(j["acct.trialSelf"], /\{date\}/, f);
  }
});

async function withServer(env, fn) {
  const old = {};
  for (const [k, v] of Object.entries(env)) [old[k], process.env[k]] = [process.env[k], v];
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, resendKey: "", log: { error() {}, info() {}, warn() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    let cookie = "";
    return async (p, body) => {
      const res = await fetch(base + p, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json", cookie }, body: body ? JSON.stringify(body) : undefined });
      const set = res.headers.getSetCookie().map((c) => c.split(";")[0]);
      if (set.length) cookie = [...cookie.split("; ").filter(Boolean), ...set].join("; ");
      return { status: res.status, body: await res.json().catch(() => null) };
    };
  };
  try {
    await fn(client, store.db, base);
  } finally {
    server.close();
    for (const [k, v] of Object.entries(old)) v === undefined ? delete process.env[k] : (process.env[k] = v);
  }
}
const YEAR = new Date().getFullYear();
const reg = (c, email, extra = {}) => c("/api/auth/register", { email, password: "geslo-12345", birth_date: ADULT, accept_privacy: true, accept_terms: true, country: "SI", ...extra });

test("registracija z eno kodo: strežnik prepozna aktivacijsko, priporočila, darilno, vabilo in neznano kodo", async () => {
  await withServer({ EVKLID_PROMO_CODE: "MATURA26", EVKLID_VABILA: "pilot-ana-2026" }, async (client) => {
    const a = client();
    const first = await reg(a, "prvi@primer.si");
    assert.equal(first.status, 201);
    assert.equal(first.body.code_kind, undefined, "brez kode brez vrste");
    const refCode = first.body.parent.referral_code;

    const promo = await reg(client(), "promo@primer.si", { code: " matura26 " });
    assert.equal(promo.body.code_kind, "promo");
    assert.equal(promo.body.promo_pending, true, "aktivacijska koda čaka na potrditev kot prej");

    const ref = await reg(client(), "ref@primer.si", { code: refCode.toLowerCase() });
    assert.equal(ref.body.code_kind, "referral");
    assert.equal(ref.body.referred, true);

    const gift = await reg(client(), "dar@primer.si", { code: "dar-ab12-cd34" });
    assert.equal(gift.body.code_kind, "gift");
    assert.equal(gift.body.promo_error, undefined, "darilna koda ni napačna aktivacijska koda");

    const inv = await reg(client(), "vabilo@primer.si", { code: "PILOT-ANA-2026" });
    assert.equal(inv.body.code_kind, "invite", "koda vabila (brez ozira na velike črke)");
    assert.equal(inv.body.invite, "pending", "vpisana koda vabila pride do pendInvite (#819) prek req.body.invite");

    const bad = await reg(client(), "napacna@primer.si", { code: "NEZNANO1" });
    assert.equal(bad.status, 201, "neznana koda registracije ne ustavi");
    assert.equal(bad.body.code_kind, "unknown");
    assert.equal(bad.body.promo_error, undefined);

    // Stara polja (mobilna aplikacija, starejši odjemalci) delujejo kot prej.
    const old = await reg(client(), "staro@primer.si", { promo_code: "MATURA26", referral_code: refCode });
    assert.equal(old.body.promo_pending, true);
    assert.equal(old.body.referred, true);
    assert.equal(old.body.code_kind, undefined);
  });
});

test("self_only: polnoleten dijak s profilom »Zame« (status in Račun), starš z otrokovim profilom ne", async () => {
  await withServer({}, async (client) => {
    const d = client();
    await reg(d, "dijak@primer.si");
    assert.equal((await d("/api/account/status")).body.self_only, false, "brez profila");
    const s = await d("/api/students", { name: "Luka", self: true, birth_year: Number(ADULT.slice(0, 4)), consent: true });
    assert.equal(s.status, 201, JSON.stringify(s.body));
    assert.equal((await d("/api/account/status")).body.self_only, true);
    assert.equal((await d("/api/account")).body.self_only, true);
  });
});

test("raven mature »Še ne vem«: letnik brez ravni, izbira v glavi je en seznam z ravnijo v napisu letnika", () => {
  const unsure = { educational_track: "SREDNJA_SOLA", curriculum_level: "3. letnik", subject: "MAT" };
  const r = ravenChoices(unsure);
  assert.deepEqual(r.map((x) => x.settings.curriculum_level), ["3. letnik OR", "3. letnik VR", "3. letnik"]);
  assert.equal(r.find((x) => x.current).label, SL["lp.unsure"]);
  assert.deepEqual(levelChoices(unsure).map((x) => x.label), ["1. letnik", "2. letnik", "3. letnik", "4. letnik"]);
  const vr = { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR" };
  assert.equal(ravenChoices(vr).find((x) => x.current).settings.curriculum_level, "4. letnik VR");
  assert.deepEqual(levelChoices(vr).map((x) => x.label), ["1. letnik VR", "2. letnik VR", "3. letnik VR", "4. letnik VR"]);
  assert.deepEqual(ravenChoices({ educational_track: "SREDNJA_SOLA", curriculum_level: "2. letnik gimnazija" }), []);
});

test("self_only: starš z lastnim profilom in otrokovim profilom ni »samo zase«", async () => {
  await withServer({}, async (client, db) => {
    const a = client();
    await reg(a, "stars-oba@primer.si");
    const own = await a("/api/students", { name: "Jaz", self: true, birth_year: YEAR - 40, consent: true });
    assert.equal(own.status, 201, JSON.stringify(own.body));
    assert.equal((await a("/api/account/status")).body.self_only, true, "le lasten profil");
    // Otrokov profil zahteva potrjen e-naslov (#747).
    db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = ?").run("stars-oba@primer.si");
    const kid = await a("/api/students", { name: "Lan", birth_year: YEAR - 10, consent: true });
    assert.equal(kid.status, 201, JSON.stringify(kid.body));
    assert.equal((await a("/api/account/status")).body.self_only, false, "lasten in otrokov profil");
    assert.equal((await a("/api/account")).body.self_only, false);
  });
});

test("self_only: imetnik 15–17 let z lastnim profilom", async () => {
  await withServer({}, async (client) => {
    const d = client();
    const r = await reg(d, "dijak16@primer.si", { birth_date: `${YEAR - 16}-01-01` });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    const s = await d("/api/students", { name: "Tia", self: true, birth_year: YEAR - 16, consent: true });
    assert.equal(s.status, 201, JSON.stringify(s.body));
    const st = (await d("/api/account/status")).body;
    assert.equal(st.parent.minor, true);
    assert.equal(st.self_only, true);
  });
});

test("Imam kodo: izklopljena ali pretečena aktivacijska koda ni »promo«; priporočilo iz povezave, ki ga ni več, ostane tiho", async () => {
  await withServer({ EVKLID_PROMO_CODE: "MATURA26" }, async (client, db) => {
    db.prepare("UPDATE promo_codes SET active = 0 WHERE code = 'MATURA26'").run();
    assert.equal((await reg(client(), "izklop@primer.si", { code: "MATURA26" })).body.code_kind, "unknown");
    db.prepare("UPDATE promo_codes SET active = 1, valid_until = '2000-01-01' WHERE code = 'MATURA26'").run();
    assert.equal((await reg(client(), "potekla@primer.si", { code: "MATURA26" })).body.code_kind, "unknown");
  });
  const src = fs.readFileSync(path.join(ROOT, "public/account.js"), "utf8");
  assert.match(src, /r\.code_kind === "unknown" && !fromRef/, "neznano priporočilo iz ?ref= brez obvestila");
  assert.match(src, /<details class="reg-code"/, "lasten razred, ne .code-row (skrbniške vrstice)");
  assert.match(fs.readFileSync(path.join(ROOT, "public/account.css"), "utf8"), /\.reg-code summary \{ margin: 0; padding: 10px 0; line-height: 24px; \}/, "»Imam kodo« visok 44 px");
});

test("prehod v višji letnik: letnik brez ravni (»Še ne vem«) ostane brez ravni", () => {
  const ss = (curriculum_level) => nextLevel({ educational_track: "SREDNJA_SOLA", curriculum_level }).settings.curriculum_level;
  assert.equal(ss("3. letnik"), "4. letnik");
  assert.equal(ss("3. letnik OR"), "4. letnik OR");
  assert.equal(ss("2. letnik VR"), "3. letnik VR");
  assert.equal(ss("1. letnik gimnazija"), "2. letnik OR", "drugi zapisi kot prej");
});

test("glava: ime seznama letnika pove tudi raven, črta pred »Druga šola …«, kljukica pri trenutni ravni", () => {
  const app = fs.readFileSync(path.join(ROOT, "public/app.js"), "utf8");
  const fn = app.slice(app.indexOf("function renderState("), app.indexOf("async function wireStatePicks("));
  assert.match(fn, /ravni\.length \? `\$\{t\("set\.school"\)\}, \$\{t\("tbk\.level"\)\}`/);
  assert.match(fn, /x\.current \? " data-checked" : ""/);
  assert.match(fn, /opt\("other", t\("chat\.levelOther"\), false, " data-sep"\)/);
  const dd = fs.readFileSync(path.join(ROOT, "public/dropdown.js"), "utf8");
  assert.match(dd, /data-sep[\s\S]*role="separator"/);
  assert.match(dd, /data-checked[\s\S]*aria-checked="true"/);
  assert.match(fs.readFileSync(path.join(ROOT, "public/ui.css"), "utf8"), /\.dd-opt\[aria-checked="true"\] \.dd-check/);
});

const require = createRequire(import.meta.url);
let playwright = null;
for (const p of ["playwright", process.env.PLAYWRIGHT, "/opt/npm-tools/node_modules/playwright"].filter(Boolean)) {
  try {
    playwright = require(p);
    break;
  } catch {}
}

test("registracija v brskalniku: shranjeno vabilo (/vabilo) gre na strežnik skupaj z aktivacijsko kodo iz ?koda=", { skip: playwright ? false : "Playwright ni nameščen", timeout: 90000 }, async (t) => {
  let browser;
  try {
    browser = await playwright.chromium.launch();
  } catch (err) {
    return t.skip(`Chromium se ne zažene: ${err.message}`);
  }
  try {
    await withServer({ EVKLID_PROMO_CODE: "MATURA26", EVKLID_VABILA: "pilot-ana-2026" }, async (_client, _db, base) => {
      const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true, locale: "sl-SI", serviceWorkers: "block" });
      await ctx.addInitScript(() => localStorage.setItem("evklid.vabilo", "PILOT-ANA-2026"));
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(base + "/?koda=MATURA26#registracija");
      const f = page.locator("#auth-form");
      await f.waitFor({ timeout: 20000 });
      assert.equal(await f.locator('[name="code"]').inputValue(), "MATURA26", "v vrstici je aktivacijska koda iz povezave");
      const summary = await f.locator(".reg-code summary").boundingBox();
      assert.ok(summary.height >= 44, `»Imam kodo« ${summary.height}px`);
      await f.locator('[name="email"]').fill("vabilo-koda@primer.si");
      await f.locator('[name="password"]').fill("geslo-12345");
      await f.locator('[name="birth_date"]').fill(`${YEAR - 17}-03-03`);
      for (const box of await f.locator('input[type="checkbox"][required]').all()) await box.check();
      const [req] = await Promise.all([page.waitForRequest((r) => r.url().endsWith("/api/auth/register")), f.locator('button[type="submit"]').click()]);
      const res = await req.response();
      const body = req.postDataJSON();
      assert.equal(body.invite, "PILOT-ANA-2026", "shranjeno vabilo ni izgubljeno");
      assert.equal(body.code, "MATURA26");
      const out = await res.json();
      assert.equal(out.code_kind, "promo");
      assert.equal(out.promo_pending, true);
      assert.equal(out.invite, "pending", "vabilo čaka na potrditev e-naslova (#819)");
      assert.deepEqual(errors, []);
      await ctx.close();
    });
  } finally {
    await browser.close();
  }
});
