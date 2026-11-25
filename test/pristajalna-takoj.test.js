// Pristajalna stran že v prvem odgovoru strežnika (naloga hitrost prvega nalaganja, j 19. 11. 2026; zunanji pregled
// »LCP ~18 s na počasnem 4G«): server/pristajalna-takoj.js, server/vstopna-stran.js withLanding, public/zacetek.js,
// public/account.js renderLanding/endPrerenderedLanding. Videz se ne sme spremeniti: stran s strežnika je ista kot
// izris v brskalniku, app.js jo prevzame brez ponovnega izrisa, slogi za druge zaslone pridejo po prvem izrisu.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { acceptTags, landingLanguage, translator, translateStatic } from "../server/pristajalna-takoj.js";

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

globalThis.document ??= { documentElement: { dataset: {} }, querySelectorAll: () => [] };
const { landingHtml } = await import("../public/pristajalna.js");
const { t: tSl } = await import("../public/i18n.js");

const quiet = { error() {}, warn() {}, info() {}, log() {} };
function start(opts = {}) {
  const app = createApp(openDb(":memory:"), { accounts: true, scheduler: false, log: quiet, ...opts });
  const server = app.listen(0);
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}
const LATE_CSS = ["textbook.css", "risbe.css", "games.css", "okna.css", "drsniki.css"];

test("Accept-Language: oznake po prednosti, jezik samo, ko odloči prva oznaka", () => {
  assert.deepEqual(acceptTags("en-US,en;q=0.9,sl;q=0.95"), ["en-US", "sl", "en"]);
  assert.deepEqual(acceptTags(" sl-SI , *;q=0.1, de;q=0"), ["sl-SI"]);
  assert.deepEqual(landingLanguage("sl-SI,sl;q=0.9"), { lang: "sl", region: "SI", tag: "sl-SI", rtl: false });
  assert.equal(landingLanguage("en-US,en;q=0.9").lang, "en");
  assert.equal(landingLanguage("ar").rtl, true);
  assert.equal(landingLanguage("de-DE,de;q=0.9").lang, "de");
  // Prva oznaka ne ustreza nobenemu jeziku: odločila bi naslednja (brskalnik primerja le prvo), zato ne vnaprej.
  assert.equal(landingLanguage("xx-YY,sl;q=0.9"), null);
  assert.equal(landingLanguage(""), null);
  assert.equal(landingLanguage("sr-Latn-RS"), null, "srbska latinica nastane s prečrkovanjem v brskalniku");
});

test("prevajalnik strežnika: kot t() v brskalniku (veriga slovarjev, množinske oblike, statični napisi)", () => {
  const pub = new URL("../public/", import.meta.url).pathname;
  const sl = translator("sl", pub);
  assert.equal(sl("land.title"), tSl("land.title"));
  assert.equal(sl("land.trial", { n: 7 }), tSl("land.trial", { n: 7 }));
  const en = translator("en", pub);
  assert.notEqual(en("land.title"), sl("land.title"));
  assert.equal(en("ni.tega.kljuca"), "ni.tega.kljuca");
  const html = translateStatic('<b data-i18n="beta.title">Testna različica.</b> <button type="button" class="icon-btn" aria-label="Zapri obvestilo" title="Zapri obvestilo" data-i18n-aria="beta.close" data-i18n-title="beta.close">x</button>', en);
  assert.match(html, new RegExp(`>${en("beta.title").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<`));
  assert.match(html, new RegExp(`aria-label="${en("beta.close")}"`));
  assert.match(html, new RegExp(`title="${en("beta.close")}"`));
});

test("strežnik: obiskovalec brez seje dobi pristajalno stran, enako izrisu v brskalniku; prijavljen in aplikacija ne", async () => {
  const { server, base } = start();
  try {
    const res = await fetch(`${base}/`, { headers: { "accept-language": "sl-SI,sl;q=0.9" } });
    assert.match(res.headers.get("vary"), /Accept-Language/);
    assert.match(res.headers.get("vary"), /Cookie/);
    const html = await res.text();
    assert.match(html, /<meta name="evklid-pristajalna" content="sl" data-oznaka="sl-SI" data-smer="ltr"/);
    assert.ok(html.indexOf('name="evklid-pristajalna"') < html.indexOf('src="zacetek.js"'), "meta pred zacetek.js");
    // Ista stran, kot bi jo izrisal account.js (renderLanding) s cenami iz /api/account/prices: zato jo prevzame brez izrisa.
    const prices = await (await fetch(`${base}/api/account/prices?country=SI`)).json();
    const own = landingHtml(tSl, { name: "Evklid", prices });
    assert.ok(html.includes(`<main id="view-auth" class="view narrow" hidden data-vnaprej>${own}</main>`), "enak izris kot v brskalniku");
    // Moduli v <template> (po prvem izrisu), slogi za druge zaslone brez href, v istem vrstnem redu.
    assert.match(html, /<template id="evklid-moduli"><link rel="modulepreload" href="\/zagon\.js" fetchpriority="low">/);
    const head = html.slice(0, html.indexOf("</head>"));
    assert.ok(!/^\s*<link rel="modulepreload"/m.test(head), "nobenega modulepreload zunaj <template>");
    for (const f of ["style.css", "ui.css", "account.css"]) assert.ok(head.includes(`<link rel="stylesheet" href="${f}">`), f);
    // KaTeX (pristajalna stran nima formul) šele po prvem izrisu, na svojem mestu pred style.css (meritev 21. 11. 2026).
    assert.match(head, /<link rel="stylesheet" href="vendor\/nunito\/index\.css">\s*<template data-evklid-slogi><link rel="stylesheet" href="vendor\/katex\/katex\.min\.css"><\/template>\s*<link rel="stylesheet" href="style\.css">/);
    assert.equal(head.split('href="vendor/katex/katex.min.css"').length, 2, "KaTeX samo v <template>");
    const tplSlogi = /<link rel="stylesheet" href="account\.css">\s*<template data-evklid-slogi>(.*?)<\/template>\s*<link rel="stylesheet" href="touch\.css">\s*<template data-evklid-slogi>(.*?)<\/template>/.exec(head);
    assert.ok(tplSlogi, "slogi drugih zaslonov v <template> na svojem mestu, touch.css (tablice) pred prvim izrisom");
    for (const f of LATE_CSS) {
      assert.ok((tplSlogi[1] + tplSlogi[2]).includes(`<link rel="stylesheet" href="${f}">`), f);
      assert.equal(head.split(`href="${f}"`).length, 2, `${f} samo v <template>`);
    }
    assert.match(head, /<link rel="preload" href="\/vendor\/instrument-sans\/files\/instrument-sans-latin-wght-normal\.woff2" as="font" type="font\/woff2" crossorigin>/);
    assert.ok(tplSlogi[1].includes("textbook.css") && tplSlogi[2].includes("drsniki.css"), "vrstni red ostane");

    // Jedro slovenskih besedil namesto celega slovarja (meritev hitrosti 21. 11. 2026): obrazec za registracijo ne čaka
    // ~83 KB slovarja, obiskovalec, ki se ne registrira, ga ne prenese. Jedro je pred zagon.js (prebere ga i18n-osnova.js).
    assert.ok(!/modulepreload" href="\/i18n(?:\/sl)?\.js"/.test(html), "brez celega slovarja vnaprej");
    assert.ok(html.indexOf('<script type="application/json" id="evklid-sl-jedro">') > html.indexOf("</main>"), "jedro za vsebino strani");
    assert.ok(html.indexOf('id="evklid-sl-jedro"') < html.indexOf('<script type="module" src="zagon.js"'), "jedro pred zagon.js");
    const jedro = JSON.parse(html.match(/<script type="application\/json" id="evklid-sl-jedro">(.*?)<\/script>/s)[1]);
    for (const k of ["auth.registerTitle", "mob.register", "mob.email", "mob.password", "auth.privacy", "land.title"]) assert.equal(jedro[k], tSl(k), k);

    // Angleščina: stran in pasica »Testna različica« v angleščini; brez slovenskega jedra, cel slovar vnaprej kot prej.
    const en = await (await fetch(`${base}/`, { headers: { "accept-language": "en-US,en;q=0.9" } })).text();
    const tEn = translator("en", new URL("../public/", import.meta.url).pathname);
    assert.ok(en.includes(`<h1>${tEn("land.title")}</h1>`));
    assert.ok(en.includes(`<b data-i18n="beta.title">${tEn("beta.title")}</b>`));
    assert.ok(!en.includes("evklid-sl-jedro"));
    assert.match(en, /<link rel="modulepreload" href="\/i18n\/sl\.js" fetchpriority="low">/);

    // Seja, aplikacija za telefon ali brez jezika: navadna stran (z modulepreload v <head>), kot prej.
    for (const headers of [{ "accept-language": "sl", cookie: "sm_session=abc" }, { "accept-language": "sl", "user-agent": "EvklidApp/1.0" }, {}]) {
      const plain = await (await fetch(`${base}/`, { headers })).text();
      assert.ok(!plain.includes("evklid-pristajalna") && !plain.includes("data-vnaprej") && !plain.includes("data-evklid-slogi"), JSON.stringify(headers));
      assert.match(plain, /<link rel="modulepreload" href="\/app\.js" fetchpriority="low">/);
    }
    // 304 za isto različico, druga različica (jezik) ima drug ETag.
    const a = await fetch(`${base}/`, { headers: { "accept-language": "sl-SI", "accept-encoding": "br" } });
    const again = await fetch(`${base}/`, { headers: { "accept-language": "sl-SI", "accept-encoding": "br", "if-none-match": a.headers.get("etag") } });
    assert.equal(again.status, 304);
    const b = await fetch(`${base}/`, { headers: { "accept-language": "de-DE", "accept-encoding": "br" } });
    assert.notEqual(a.headers.get("etag"), b.headers.get("etag"));
  } finally {
    server.close();
  }
});

// Meritev hitrosti 21. 11. 2026: obiskovalec na /#registracija prej ~0,6 s videl okostje Učne poti (zavihki, »Nova snov«), obrazec
// je čakal cel slovar in vse sloge; pristajalna stran je po prvem izrisu prenesla še ~90 modulov drugih zaslonov (~0,8 MB).
test("brskalnik: /#registracija brez okostja aplikacije, besedila iz jedra; zasloni šele, ko obiskovalec začne izpolnjevati obrazec", { skip: !playwright && "Playwright ni nameščen", timeout: 120_000 }, async () => {
  const { server, base } = start();
  const browser = await playwright.chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, locale: "sl-SI", timezoneId: "Europe/Ljubljana", serviceWorkers: "block" });
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    const urls = [];
    p.on("request", (r) => urls.push(new URL(r.url()).pathname));
    // Cel slovar zadržimo: obrazec ga ne sme čakati.
    let spusti = null;
    const spusceno = new Promise((ok) => (spusti = ok));
    await p.route(/\/i18n(\/sl)?\.js$/, async (r) => {
      await spusceno;
      await r.continue();
    });
    await p.addInitScript(() => {
      window.__okostje = false;
      document.addEventListener("DOMContentLoaded", () => {
        window.__dcl = { slogi: document.documentElement.hasAttribute("data-zacetek-slogi"), tpl: !!document.querySelector("template[data-evklid-slogi]") };
        const vidno = (el) => !!el && el.checkVisibility({ visibilityProperty: true });
        const korak = () => {
          if (vidno(document.body) && !vidno(document.querySelector("#auth-form"))) window.__okostje ||= vidno(document.querySelector("#view-path")) || vidno(document.querySelector(".topbar .tabs"));
          if (!vidno(document.querySelector("#auth-form"))) requestAnimationFrame(korak);
        };
        korak();
      });
    });
    await p.goto(base + "/#registracija");
    await p.locator('#auth-form button[type="submit"]').waitFor({ state: "visible", timeout: 30_000 });
    assert.deepEqual(await p.evaluate(() => window.__dcl), { slogi: true, tpl: true }, "stran skrita, slogi drugih zaslonov še v <template>");
    assert.equal(await p.evaluate(() => window.__okostje), false, "nobene sličice z okostjem Učne poti pred obrazcem");
    assert.equal(await p.locator('#auth-form button[type="submit"]').textContent(), tSl("mob.register"));
    const i18n = await p.evaluate(() => import("/i18n-osnova.js").then((m) => ({ vse: m.vseNalozeno(), manjka: m.manjkajoci() })));
    assert.deepEqual(i18n, { vse: false, manjka: [] }, "obrazec samo z jedrom, brez manjkajočih besedil");
    await p.waitForFunction(() => !document.querySelector("template[data-evklid-slogi]") && !document.documentElement.hasAttribute("data-zacetek-slogi"));
    // Igre (3 s) in orodja kalkulatorja (2,5 s) po zagonu, zasloni po prvem izrisu: obiskovalec, ki ne izpolnjuje, nič od tega.
    await p.waitForTimeout(3500);
    const ZASLONI = ["/vadnica.js", "/racun.js", "/games/index.js", "/textbook.js", "/i18n/sl.js"];
    assert.deepEqual(ZASLONI.filter((u) => urls.includes(u)), [], "brez modulov drugih zaslonov pred izpolnjevanjem");
    spusti();
    await p.locator('#auth-form input[name="email"]').focus();
    await p.waitForFunction(() => import("/i18n-osnova.js").then((m) => m.vseNalozeno()), null, { timeout: 30_000 });
    await p.waitForFunction(() => performance.getEntriesByType("resource").some((e) => e.name.endsWith("/vadnica.js")), null, { timeout: 30_000 });
    assert.deepEqual(errors, []);
    await ctx.close();
  } finally {
    await browser.close();
    server.close();
  }
});

test("brez računov ni pristajalne strani: navadna vstopna stran", async () => {
  const { server, base } = start({ accounts: false });
  try {
    const html = await (await fetch(`${base}/`, { headers: { "accept-language": "sl-SI" } })).text();
    assert.ok(!html.includes("evklid-pristajalna") && !html.includes("data-evklid-slogi"));
  } finally {
    server.close();
  }
});

test("brskalnik: pristajalna stran vidna brez JavaScripta aplikacije, app.js jo prevzame brez izrisa; znan obiskovalec dobi prijavo", { skip: !playwright && "Playwright ni nameščen", timeout: 120_000 }, async () => {
  const { server, base } = start();
  const browser = await playwright.chromium.launch();
  const ctxOpts = { viewport: { width: 360, height: 740 }, locale: "sl-SI", timezoneId: "Europe/Ljubljana", serviceWorkers: "block" };
  try {
    // 1) Samo skripte v <head> (zacetek.js …), brez modulov in brez slogov za druge zaslone: stran je že vidna.
    {
      const ctx = await browser.newContext(ctxOpts);
      const p = await ctx.newPage();
      await p.route(/\.(js|css)(\?|$)/, (r) => {
        const u = r.request().url();
        const keep = /\/(theme|zacetek|brez-lebdenja)\.js/.test(u) || (/\.css/.test(u) && !LATE_CSS.some((f) => u.endsWith(`/${f}`)));
        return keep ? r.continue() : r.abort();
      });
      await p.goto(base + "/", { waitUntil: "load" });
      assert.equal(await p.evaluate(() => document.documentElement.hasAttribute("data-pristajalna")), true);
      assert.ok(await p.locator("#view-auth .land h1").isVisible(), "pristajalna stran vidna");
      assert.equal(await p.locator("#view-path").isVisible(), false, "Učna pot iz index.html ni vidna");
      assert.equal(await p.locator(".topbar .tabs").isVisible(), false, "zavihki skriti kot ob auth-mode");
      assert.equal(await p.locator("#test-notice").isVisible(), true, "pasica Testna različica že na mestu");
      await ctx.close();
    }
    // 2) Celoten zagon: isti element (brez ponovnega izrisa in animacije), vsi slogi vklopljeni, gumb deluje.
    {
      const ctx = await browser.newContext(ctxOpts);
      const p = await ctx.newPage();
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      await p.addInitScript(() => document.addEventListener("DOMContentLoaded", () => (window.__land = document.querySelector("#view-auth .land"))));
      await p.goto(base + "/");
      await p.waitForSelector("body.land-mode #view-auth .land", { timeout: 30_000 });
      await p.waitForFunction(() => !document.querySelector("template[data-evklid-slogi]") && !document.getElementById("evklid-moduli"));
      const s = await p.evaluate(() => ({
        same: !!window.__land && document.querySelector("#view-auth .land") === window.__land,
        attr: document.documentElement.hasAttribute("data-pristajalna"),
        vnaprej: document.getElementById("view-auth").hasAttribute("data-vnaprej"),
        css: [...document.querySelectorAll('head > link[rel="stylesheet"]')].map((l) => l.getAttribute("href")).join(" "),
      }));
      const css = s.css;
      delete s.css;
      assert.deepEqual(s, { same: true, attr: false, vnaprej: false });
      // Vsi slogi v strani in v istem vrstnem redu kot v public/index.html.
      const order = [...readFileSync(new URL("../public/index.html", import.meta.url), "utf8").matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map((m) => m[1]).join(" ");
      assert.equal(css, order);
      await p.click('[data-land="register"]');
      await p.waitForSelector("#auth-form", { timeout: 10_000 });
      assert.equal(new URL(p.url()).hash, "#registracija");
      assert.deepEqual(errors, []);
      await ctx.close();
    }
    // 3) Znan obiskovalec (na napravi je že bil prijavljen): prijava, pristajalna stran se ne pokaže in ne ostane v strani.
    {
      const ctx = await browser.newContext(ctxOpts);
      await ctx.addInitScript(() => localStorage.setItem("evklid.racun", "1"));
      const p = await ctx.newPage();
      // Slogi drugih zaslonov naj zamudijo: stran mora ostati skrita do njih (brez izrisa brez slogov).
      await p.route(/\/textbook\.css$/, async (r) => {
        await new Promise((ok) => setTimeout(ok, 1500));
        await r.continue();
      });
      await p.addInitScript(() => {
        // Vse odloči zacetek.js v <head>, ne šele zagon.js: ob razčlenjeni strani so moduli in slogi že vklopljeni.
        document.addEventListener("DOMContentLoaded", () => {
          const h = document.documentElement;
          window.__pre = h.hasAttribute("data-pristajalna");
          window.__dcl = { slogi: h.hasAttribute("data-zacetek-slogi"), moduli: !!document.getElementById("evklid-moduli"), tpl: !!document.querySelector("template[data-evklid-slogi]"), vis: getComputedStyle(document.body).visibility };
        });
      });
      await p.goto(base + "/");
      await p.waitForSelector("#auth-form", { timeout: 30_000 });
      assert.deepEqual(await p.evaluate(() => window.__dcl), { slogi: true, moduli: false, tpl: false, vis: "hidden" });
      const s = await p.evaluate(() => ({
        pre: window.__pre,
        land: !!document.querySelector("#view-auth .land"),
        slogi: document.documentElement.hasAttribute("data-zacetek-slogi"),
        pozneje: document.querySelectorAll("template[data-evklid-slogi]").length,
        visible: getComputedStyle(document.body).visibility,
      }));
      assert.deepEqual(s, { pre: false, land: false, slogi: false, pozneje: 0, visible: "visible" });
      await ctx.close();
    }
    // 3b) Prvi izris na telefonu (meritev 21. 11. 2026, FCP −150 ms): zacetek.js za slovensko stran ne ustvari
    //     Intl.DateTimeFormat (~40 ms na telefonu), brez-lebdenja.js počisti :hover šele po prvem izrisu (~50 ms),
    //     nato pa v vseh slogih, tudi v tistih, ki pridejo po izrisu (KaTeX).
    {
      const ctx = await browser.newContext({ ...ctxOpts, hasTouch: true, isMobile: true });
      const p = await ctx.newPage();
      await p.addInitScript(() => {
        const DTF = Intl.DateTimeFormat;
        window.__intl = [];
        Intl.DateTimeFormat = function (...a) {
          window.__intl.push((document.currentScript && document.currentScript.src) || "");
          return new DTF(...a);
        };
        Intl.DateTimeFormat.prototype = DTF.prototype;
        Intl.DateTimeFormat.supportedLocalesOf = DTF.supportedLocalesOf;
        const hover = () => [...document.styleSheets].reduce((n, s) => n + [...s.cssRules].filter((r) => (r.selectorText || "").includes(":hover")).length, 0);
        const po = new PerformanceObserver((l) => {
          if (!l.getEntriesByName("first-contentful-paint").length) return;
          po.disconnect();
          window.__fcp = { hover: hover(), intl: window.__intl.slice() };
        });
        po.observe({ type: "paint", buffered: true });
        window.__hover = hover;
      });
      await p.goto(base + "/");
      await p.waitForSelector("body.land-mode #view-auth .land", { timeout: 30_000 });
      await p.waitForFunction(() => window.__fcp && !document.querySelector("template[data-evklid-slogi]"));
      await p.waitForFunction(() => [...document.styleSheets].some((s) => /katex/.test(s.href || "")) && window.__hover() === 0, null, { timeout: 10_000 });
      const fcp = await p.evaluate(() => window.__fcp);
      assert.ok(fcp.hover > 0, "ob prvem izrisu :hover še ni počiščen (čiščenje ne zadrži izrisa)");
      assert.deepEqual(fcp.intl.filter((u) => u.endsWith("/zacetek.js")), [], "zacetek.js pred izrisom brez Intl.DateTimeFormat");
      assert.equal(await p.evaluate(() => matchMedia("(hover: none)").matches), true);
      await ctx.close();
    }
    // 4) Jezik brskalnika angleščina, a časovni pas Ljubljana: app.js izbere slovenščino, zato strani s strežnika ne pokaže.
    {
      const ctx = await browser.newContext({ ...ctxOpts, locale: "en-US" });
      const p = await ctx.newPage();
      await p.addInitScript(() => document.addEventListener("DOMContentLoaded", () => (window.__pre = document.documentElement.hasAttribute("data-pristajalna"))));
      await p.goto(base + "/");
      await p.waitForSelector("body.land-mode #view-auth .land", { timeout: 30_000 });
      assert.equal(await p.evaluate(() => window.__pre), false);
      assert.equal(await p.evaluate(() => document.documentElement.lang), "sl");
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
});
