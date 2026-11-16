// Izbira dokupa pogovorov (public/credit-card.js; j 2026-11-15 izjema: samo videz dokupa): velike izbirne ploščice
// (prave radijske tipke, puščice), privzeto srednji paket, en gumb »Nadaljuj za skupaj {cena}«. Soglasja in tok
// plačila ostanejo enaki. Dokup se v testnem načinu ne pokaže (ni Stripa), zato odgovor /api/billing/credit
// nadomesti page.route z enako obliko, kot jo vrne server/accounts/billing.js.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const read = (f) => fs.readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8");

test("credit.payTotal: ključ v sl.js in vseh prevodih, z {price}", async () => {
  const { default: sl } = await import("../public/i18n/sl.js");
  assert.match(sl["credit.payTotal"], /\{price\}/);
  for (const f of fs.readdirSync(new URL("../public/i18n/ui/", import.meta.url))) {
    const v = JSON.parse(read(`i18n/ui/${f}`))["credit.payTotal"];
    assert.ok(v && v.includes("{price}"), f);
    if (f !== "sl.json") assert.notEqual(v, sl["credit.payTotal"], `${f} ni preveden`);
  }
});

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

const PACKS = [
  { id: "k5", amount: 500, currency: "EUR", conversations: 20 },
  { id: "k10", amount: 1000, currency: "EUR", conversations: 40 },
  { id: "k20", amount: 2000, currency: "EUR", conversations: 85 },
];

async function render(browser, base, data, posts) {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true });
  await ctx.addInitScript(() => localStorage.setItem("evklid.lang", "sl"));
  const p = await ctx.newPage();
  await p.route("**/api/billing/credit", (r) => {
    if (r.request().method() === "GET") return r.fulfill({ json: data });
    posts.push(r.request().postDataJSON());
    return r.fulfill({ json: { url: `${base}/?billing=cancel` } });
  });
  await p.goto(base + "/", { waitUntil: "load" });
  await p.evaluate(async () => {
    await (await import("/i18n.js")).ready;
    const { renderCreditCard } = await import("/credit-card.js");
    document.body.innerHTML = `<main><div id="credit-card"></div></main>`;
    const api = async (u, o = {}) => (await fetch(u, { method: o.method || "GET", headers: { "content-type": "application/json" }, body: o.body ? JSON.stringify(o.body) : undefined })).json();
    await renderCreditCard(document.getElementById("credit-card"), { api });
  });
  return { p, ctx };
}

test("dokup: ploščice, privzeto srednji paket, en gumb s skupnim zneskom, soglasja ostanejo obvezna", { skip: !playwright && "Playwright ni nameščen", timeout: 90_000 }, async () => {
  const srv = createApp(openDb(":memory:"), { scheduler: false }).listen(0);
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await playwright.chromium.launch();
  try {
    const posts = [];
    const { p, ctx } = await render(browser, base, { billing: true, balance_conversations: 0, minor: false, birth_missing: false, packs: PACKS }, posts);
    const radios = p.locator('.credit-packs input[type="radio"][name="pack"]');
    assert.equal(await radios.count(), 3);
    assert.equal(await p.locator('input[name="pack"]:checked').getAttribute("value"), "k10", "privzeto srednji paket");
    const cards = await p.locator(".credit-pack").allInnerTexts();
    assert.match(cards[1], /40 pogovorov/);
    assert.match(cards[1], /10\s€/);
    assert.ok(!cards.some((c) => /\$/.test(c)), "brez $ kredita");
    assert.equal(await p.locator("button[type=submit]").count(), 1, "en gumb");
    assert.equal((await p.locator(".credit-go").innerText()).replace(/\s/g, " "), "Nadaljuj za skupaj 10 €");
    // Tipkovnica: puščica premakne izbiro, gumb sledi.
    await p.locator('input[name="pack"]:checked').focus();
    await p.keyboard.press("ArrowDown");
    assert.equal(await p.locator('input[name="pack"]:checked').getAttribute("value"), "k20");
    assert.equal((await p.locator(".credit-go").innerText()).replace(/\s/g, " "), "Nadaljuj za skupaj 20 €");
    // Dotik na ploščico izbere paket; ploščica je dovolj velika za prst.
    await p.locator(".credit-pack").first().tap();
    assert.equal(await p.locator('input[name="pack"]:checked').getAttribute("value"), "k5");
    assert.ok((await p.locator(".credit-pack").first().boundingBox()).height >= 44);
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "brez vodoravnega drsenja");
    // Brez soglasij ni zahteve za plačilo.
    await p.locator(".credit-go").tap();
    assert.equal(await p.locator(".form-error").isVisible(), true);
    assert.equal(posts.length, 0);
    for (const c of await p.locator('.credit-card input[type="checkbox"]').all()) await c.check();
    await Promise.all([p.waitForURL(/billing=cancel/), p.locator(".credit-go").tap()]);
    assert.equal(posts.length, 1);
    assert.equal(posts[0].pack, "k5");
    await ctx.close();
    // Mladoletni imetnik: brez ploščic in brez gumba (tok nespremenjen).
    const m = await render(browser, base, { billing: true, balance_conversations: 0, minor: true, birth_missing: false, packs: PACKS }, posts);
    assert.equal(await m.p.locator('input[name="pack"]').count(), 0);
    assert.equal(await m.p.locator("button[type=submit]").count(), 0);
    await m.ctx.close();
  } finally {
    await browser.close();
    srv.close();
  }
});
