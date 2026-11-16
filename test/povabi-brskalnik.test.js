// Povabilo po uspehu v brskalniku (360 × 740, dotik): osvojena tema po pravilni nalogi pokaže kartico
// »Pokaži Evklida prijatelju« s povezavo iz Računa; »Ne zdaj« jo skrije in ob naslednjem uspehu je ni.
// Odgovor strežnika na nalogo je tu prirejen (mastered), da test ne čaka na osvojitev teme.
// POVABI_POSNETKI=<mapa> shrani posnetke (svetlo, temno, arabščina, 1280).
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 240000 };
const SHOTS = process.env.POVABI_POSNETKI || "";
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

async function nastavi(base, store, { birthYear }) {
  const reg = await fetch(`${base}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: `povabi${birthYear}@test.si`, password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" }),
  });
  assert.equal(reg.status, 201);
  const cookie = reg.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
  store.db.prepare("UPDATE parents SET email_verified_at = datetime('now')").run();
  const s = await fetch(`${base}/api/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({ name: "Ana", birth_year: birthYear, consent: true, settings: { school: "SREDNJA_SOLA", grade: "3. letnik", tour_version: 99 } }),
  });
  assert.equal(s.status, 201, await s.clone().text());
  return { cookie, id: (await s.json()).id };
}

async function doUspeha(p, base) {
  await p.goto(base + "/");
  await p.waitForSelector(".iq-wrap [data-iq=skip]", { timeout: 15000 }).then((b) => b.click()).catch(() => {});
  await p.waitForSelector("#xp-card .next-row[data-open]", { timeout: 20000 });
  await p.click("#xp-card .next-row[data-open]");
  await p.waitForSelector("#view-topic .topic-head, #view-topic #practice .task", { timeout: 15000 });
  for (let i = 0; i < 6 && (await p.locator("#p-skip").isVisible()); i++) {
    await p.click("#p-skip");
    await p.waitForTimeout(400);
  }
  if (await p.locator("#pt-practice").isVisible()) await p.click("#pt-practice");
  else await p.click("#t-practice");
  await p.waitForTimeout(400);
  if (await p.locator("#ex-next").isVisible()) await p.click("#ex-next");
  await p.waitForSelector("#practice .task .task-text", { timeout: 15000 });
  const choice = p.locator("#practice .task .choices .choice");
  if (await choice.count()) await choice.first().click();
  else {
    await p.fill("#answer", "1");
    await p.locator("#practice .answer-row button.primary").click();
  }
  await p.waitForSelector("#feedback .fb.mastered", { timeout: 15000 });
}

async function stran(ctx, base, cookie, id, init = () => {}) {
  await ctx.addCookies(cookie.split("; ").map((c) => ({ name: c.split("=")[0], value: c.slice(c.indexOf("=") + 1), url: base })));
  await ctx.addInitScript(
    ([sid]) => {
      localStorage.setItem("evklid.tour", "1");
      localStorage.setItem("studentId", String(sid));
    },
    [id],
  );
  await ctx.addInitScript(init);
  const p = await ctx.newPage();
  // Prirejen izid: pravilno in tema osvojena.
  await p.route("**/api/students/*/tasks/*/answer", async (route) => {
    const r = await route.fetch();
    const d = await r.json().catch(() => ({}));
    await route.fulfill({ response: r, json: { ...d, correct: true, retry: false, closed: false, mistake: null, hint: null, mastered: true, xp: d.xp || { gained: 10, items: [] } } });
  });
  return p;
}

test("povabilo po osvojeni temi: kartica, Kopiraj, Ne zdaj, 7 dni", opts, async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, stripeKey: "", resendKey: "", log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const { cookie, id } = await nastavi(base, store, { birthYear: 2008 });
  const ctx = await chromium.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: "sl-SI", serviceWorkers: "block", permissions: ["clipboard-read", "clipboard-write"] });
  try {
    const p = await stran(ctx, base, cookie, id);
    const napake = [];
    p.on("pageerror", (e) => napake.push(e.message));
    await doUspeha(p, base);
    const kartica = p.locator("#feedback .povabi");
    await kartica.waitFor({ timeout: 10000 });
    const besedilo = await kartica.innerText();
    assert.match(besedilo, /Pokaži Evklida prijatelju/);
    assert.doesNotMatch(besedilo, /brezplačno|plača/, "plačila izklopljena: brez obljube nagrade");
    const url = await kartica.locator("input").inputValue();
    assert.match(url, /\/\?ref=[A-Z0-9]+$/);
    assert.equal(url, (await (await fetch(`${base}/api/account`, { headers: { cookie } })).json()).referral.url);
    // Brez vodoravnega drsenja, gumbi dovolj veliki za dotik.
    assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "vodoravno drsenje");
    for (const b of await kartica.locator("button").all()) assert.ok((await b.boundingBox()).height >= 40, "gumb nižji od 40 px");
    const rec = JSON.parse(await p.evaluate((sid) => localStorage.getItem(`evklid.povabi.${sid}`), id));
    assert.ok(rec.shown > Date.now() - 60000);
    if (SHOTS) {
      await kartica.scrollIntoViewIfNeeded();
      await p.screenshot({ path: `${SHOTS}/360-svetlo-sl.png` });
    }
    await kartica.locator("[data-povabi-copy]").click();
    assert.equal(await p.evaluate(() => navigator.clipboard.readText()), url);
    await kartica.locator("[data-povabi-later]").click();
    assert.equal(await p.locator("#feedback .povabi").count(), 0);
    assert.ok(JSON.parse(await p.evaluate((sid) => localStorage.getItem(`evklid.povabi.${sid}`), id)).dismissed > 0);
    // Naslednji uspeh v 7 dneh: brez kartice.
    await p.click("#fb-next");
    await p.waitForSelector("#practice .task .task-text", { timeout: 15000 });
    const choice = p.locator("#practice .task .choices .choice");
    if (await choice.count()) await choice.first().click();
    else {
      await p.fill("#answer", "1");
      await p.locator("#practice .answer-row button.primary").click();
    }
    await p.waitForSelector("#feedback .fb.mastered", { timeout: 15000 });
    await p.waitForTimeout(800);
    assert.equal(await p.locator("#feedback .povabi").count(), 0);
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
  }
  // Posnetki: temno, arabščina, računalnik (vsak s svežim zapisom na napravi).
  if (SHOTS) {
    const vrste = [
      ["360-temno-sl.png", { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, colorScheme: "dark", locale: "sl-SI" }, () => {}],
      ["360-svetlo-ar.png", { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: "ar" }, () => {}, "ar"],
      ["1280-svetlo-sl.png", { viewport: { width: 1280, height: 800 }, locale: "sl-SI" }, () => {}, "sl"],
    ];
    for (const [ime, o, init, jezik] of vrste) {
      // Jezik vmesnika sledi profilu (app.js selectStudent), zato ga nastavimo v profilu.
      if (jezik) store.db.prepare("UPDATE students SET settings = json_set(settings, '$.language', ?) WHERE id = ?").run(jezik, id);
      const c = await chromium.newContext({ ...o, serviceWorkers: "block" });
      try {
        const p = await stran(c, base, cookie, id, init);
        await doUspeha(p, base).catch(async (e) => {
          await p.screenshot({ path: `${SHOTS}/napaka-${ime}` });
          throw e;
        });
        const k = p.locator("#feedback .povabi");
        await k.waitFor({ timeout: 10000 });
        await k.scrollIntoViewIfNeeded();
        await p.screenshot({ path: `${SHOTS}/${ime}` });
      } finally {
        await c.close();
      }
    }
  }
  server.close();
});

test("povabilo: profil mlajši od 15 ga ne vidi", opts, async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, stripeKey: "", resendKey: "", log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const { cookie, id } = await nastavi(base, store, { birthYear: new Date().getFullYear() - 13 });
  const ctx = await chromium.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: "sl-SI", serviceWorkers: "block" });
  try {
    const p = await stran(ctx, base, cookie, id);
    await doUspeha(p, base);
    await p.waitForTimeout(1500);
    assert.equal(await p.locator("#feedback .povabi").count(), 0);
  } finally {
    await ctx.close();
    server.close();
  }
});

test.after(() => chromium?.close());
