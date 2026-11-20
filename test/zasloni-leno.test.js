// Zasloni, ki niso Učna pot, niso del prvega odprtja (naloga hitrost, docs/meritve/prijavljen-mobilno-2026-11-19.md
// točka 2): vadnica s tekmovanji in NPZ (vadnica.js), zavihek Račun s plačili (racun.js), kalkulator
// (kalkulator-zaslon.js), stran Urnik (schedule.js), Kartice, Kotiček, Laboratorij, naloge pilota in gumbi orodij.
// Test preveri, da jih statični graf prvega odprtja nima (nujno.js in kartica urnika na Učni poti ostaneta), da se po
// prvem izrisu naložijo sami (takojšen kasnejši klik, kopija za delo brez povezave) in da se vsak zaslon prvič odpre
// pravilno tudi, ko modul še prihaja: takoj »Nalagam …«, nato prava vsebina, brez napak in brez ključev namesto besedil.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { startupFiles, moduleDeps } from "../server/startup-files.js";
import { kljuciJedra, kljuciZaslonov, ZASLONI_V_JEDRU } from "../server/i18n-jedro.js";
import SL from "../public/i18n/sl.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUB = path.join(ROOT, "public");
const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 240000 };
test.after(() => chromium?.close());
const quiet = { error() {}, warn() {}, info() {}, log() {} };

// Moduli zaslonov, ki se naložijo po prvem izrisu Učne poti ali ob prvi uporabi.
const LENI = ["/vadnica.js", "/racun.js", "/kalkulator-zaslon.js", "/schedule.js", "/flashcards.js", "/corner.js", "/laboratorij.js", "/pilot-naloge.js", "/odpri.js", "/pad.js", "/enote-izbira.js", "/credit-card.js", "/garancija-ui.js", "/odstop-ui.js", "/pass-offer.js", "/chat-settings.js", "/settings-registry.js", "/interests.js", "/games/childhood.js", "/prijave.js"];

test("prvo odprtje: moduli drugih zaslonov niso v statičnem grafu, varnostni zaznavalnik in kartica urnika sta", () => {
  const list = startupFiles(PUB, "index.html");
  for (const u of LENI) assert.ok(!list.includes(u), `${u} je del prvega odprtja`);
  for (const u of ["/nujno.js", "/account.js", "/urnik-kartica.js", "/offline.js"]) assert.ok(list.includes(u), `${u} ni del prvega odprtja`);
  // Leni moduli z besedili ne uvozijo celega slovarja (i18n.js, ~75 KB): prvi klik ga ne čaka. Zasloni z malo besedila
  // (ZASLONI_V_JEDRU) imajo besedila v jedru in uvozijo i18n-osnova.js (prvi klik čaka le svoj modul), Račun s plačili
  // svoj del slovarja (i18n-zasloni.js, zunaj prvega odprtja). Vsak ključ iz njih je v jedru ali v delu.
  assert.ok(!list.includes("/i18n-zasloni.js"), "i18n-zasloni.js je del prvega odprtja");
  for (const u of ZASLONI_V_JEDRU) assert.ok(!list.includes(`/${u}`), `${u} je del prvega odprtja`);
  // Ves statični podgraf zaslonov v jedru (npr. vadnica.js → pad.js → enote-izbira.js) je brez i18n-zasloni.js: prvi
  // dotik teme ne čaka 24 KB besedil zaslonov (pregled 2 hitrost-skupaj).
  for (const u of ZASLONI_V_JEDRU) assert.ok(!moduleDeps(PUB, u).includes("/i18n-zasloni.js"), `${u}: statično uvozi i18n-zasloni.js`);
  for (const u of ["/racun.js", "/pilot-naloge.js", "/garancija-ui.js", "/odstop-ui.js", "/credit-card.js"]) assert.match(fs.readFileSync(path.join(PUB, u), "utf8"), /from "\.\/i18n-zasloni\.js"/, `${u}: ne uvozi i18n-zasloni.js`);
  const jedro = new Set(kljuciJedra(PUB, SL));
  const del = new Set(kljuciZaslonov(PUB, SL));
  assert.deepEqual([...del].filter((k) => jedro.has(k)), [], "ključ v delu in v jedru");
  for (const u of LENI) {
    const src = fs.readFileSync(path.join(PUB, u), "utf8");
    assert.doesNotMatch(src, /from "\.\/i18n\.js"/, `${u}: uvozi cel slovar (i18n.js)`);
    for (const m of src.matchAll(/["'`]([A-Za-z][\w-]*(?:\.[\w-]+)+)["'`]/g)) if (SL[m[1]] !== undefined) assert.ok(jedro.has(m[1]) || del.has(m[1]), `${u}: ${m[1]} ni ne v jedru ne v delu`);
  }
  // Strežnik jih po zagonu vnaprej stisne (server/app.js ZASLONI_POZNEJE), kot datoteke prvega odprtja.
  const srv = fs.readFileSync(path.join(ROOT, "server", "app.js"), "utf8");
  const pozneje = srv.match(/const ZASLONI_POZNEJE = \[([^\]]*)\]/)[1];
  for (const u of ["vadnica.js", "racun.js", "kalkulator-zaslon.js", "schedule.js", "flashcards.js", "corner.js", "laboratorij.js", "pilot-naloge.js", "odpri.js", "chat-settings.js", "prijave.js"]) assert.ok(pozneje.includes(`"${u}"`), u);
});

async function streznik(fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, log: quiet });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = {};
  const call = async (p, o = {}) => {
    const res = await fetch(base + p, { method: o.method || "GET", redirect: "manual", headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") }, body: o.body ? JSON.stringify(o.body) : undefined });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      jar[kv.slice(0, kv.indexOf("="))] = kv.slice(kv.indexOf("=") + 1);
    }
    return { status: res.status, body: await res.json().catch(() => null) };
  };
  try {
    const r = await call("/api/auth/register", { method: "POST", body: { email: "zasloni@evklid.test", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    const u = new URL(r.body.dev_verify_url);
    await call(u.pathname + u.search);
    const s = await call("/api/students", { method: "POST", body: { name: "Lena", birth_year: new Date().getFullYear() - 13, consent: true, settings: { school: "OSNOVNA_SOLA", grade: "8. razred" } } });
    assert.equal(s.status, 201, JSON.stringify(s.body));
    await fn({ base, jar });
  } finally {
    server.close();
  }
}

async function stran(base, jar, viewport = { width: 390, height: 844 }) {
  const mobile = viewport.width < 700;
  const ctx = await chromium.newContext({ viewport, hasTouch: mobile, isMobile: mobile, locale: "sl-SI", serviceWorkers: "block" });
  await ctx.addCookies(Object.entries(jar).map(([name, value]) => ({ name, value, url: base })));
  await ctx.addInitScript(() => {
    localStorage.setItem("evklid.tour", "done");
    localStorage.setItem("evklid.interests.asked", "1");
  });
  const page = await ctx.newPage();
  const napake = [];
  page.on("pageerror", (e) => napake.push(e.message));
  return { ctx, page, napake };
}

const kljuci = (txt) => Object.keys(SL).filter((k) => /^[a-z]+\.[a-zA-Z]+$/.test(k) && txt.includes(k));

test("prvi klik na vsak odložen zaslon, medtem ko modul še prihaja: takoj »Nalagam …«, nato prava vsebina", opts, () =>
  streznik(async ({ base, jar }) => {
    const { ctx, page, napake } = await stran(base, jar);
    try {
      // Vse lene module zadržimo; vsakega spustimo šele, ko je njegov zaslon že odprt.
      // Cel slovar (i18n.js, i18n/sl.js) zadržimo do konca: zasloni se morajo izrisati samo z jedrom in svojim delom.
      const cakajo = new Map([...LENI, "/i18n.js", "/i18n/sl.js"].map((u) => [u, Promise.withResolvers()]));
      await page.route(
        (url) => cakajo.has(url.pathname),
        async (route) => {
          await cakajo.get(new URL(route.request().url()).pathname).promise;
          await route.continue().catch(() => {});
        },
      );
      const spusti = (...u) => u.forEach((x) => cakajo.get(x).resolve());
      // Prenesene datoteke beležimo tu (medpomnilnik Resource Timing v strani ima omejeno število vnosov).
      const preneseno = new Set();
      page.on("requestfinished", (r) => preneseno.add(new URL(r.url()).pathname));
      await page.goto(base + "/", { waitUntil: "commit" });
      // Učna pot ne čaka nobenega od njih.
      await page.waitForSelector("#view-path #xp-card .hero", { timeout: 60000 });
      // Kartice so način na Učni poti (#modebar), drugo zavihki.
      const zavihek = (v) => page.evaluate((v) => document.querySelector(`#tabbar .tab[data-view="${v}"], .topbar .tab[data-view="${v}"], #modebar [data-mode="${v}"]`).click(), v);
      const vidno = (sel) => page.waitForSelector(sel, { state: "visible", timeout: 20000 });
      const nalagam = async (sel) => assert.match(await page.locator(sel).first().innerText(), /Nalagam/, `${sel}: brez »Nalagam …« med nalaganjem`);

      // Tema z Učne poti (vadnica.js): klik počaka modul, nato se tema odpre.
      await page.evaluate(() => document.querySelector("#view-path [data-open]").click());
      await page.waitForTimeout(400);
      assert.ok(await page.locator("#view-path").isVisible(), "tema se ne odpre brez modula");
      spusti("/vadnica.js", "/pad.js", "/enote-izbira.js");
      await vidno("#view-topic #topic-content .topic-head h1");

      // Tekmovanja (vadnica.js je zdaj naložen).
      await zavihek("competition");
      await vidno("#view-competition");
      await page.waitForFunction(() => !/Nalagam/.test(document.querySelector("#competition-content").innerText), null, { timeout: 20000 });

      // Račun (racun.js s plačili, garancijo, odstopom): takoj »Nalagam …«, nato zavihek Račun.
      await zavihek("account");
      await vidno("#view-account");
      await nalagam("#view-account");
      spusti("/racun.js", "/credit-card.js", "/garancija-ui.js", "/odstop-ui.js", "/pilot-naloge.js", "/prijave.js");
      await vidno("#view-account h1");
      assert.equal((await page.locator("#view-account h1").innerText()).trim(), SL["nav.account"]);
      assert.ok(await page.locator("#view-account .kolone").count(), "stolpci zavihka Račun");
      assert.deepEqual(kljuci(await page.locator("#view-account").innerText()), [], "ključ namesto besedila v zavihku Račun");

      // Kartice, Urnik, Kotiček: takoj »Nalagam …«, nato vsebina.
      for (const [v, mod, sel, gotovo] of [
        ["cards", ["/flashcards.js"], "#view-cards", "#view-cards > :not(p.muted)"],
        ["schedule", ["/schedule.js", "/pass-offer.js"], "#view-schedule .sch-body", "#view-schedule .sch-body > :not(p.muted)"],
        ["corner", ["/corner.js", "/interests.js"], "#corner-content", "#corner-content > :not(p.muted)"],
      ]) {
        await zavihek(v);
        await vidno(`#view-${v}`);
        await nalagam(sel);
        spusti(...mod);
        await vidno(gotovo);
        assert.deepEqual(kljuci(await page.locator(`#view-${v}`).innerText()), [], `${v}: ključ namesto besedila`);
      }

      // Uči se → Laboratorij (laboratorij.js).
      await zavihek("uci");
      await page.evaluate(() => document.querySelector('#view-uci [data-uci-tab="lab"]').click());
      await vidno("#view-lab");
      spusti(...LENI);
      await page.waitForFunction(() => !/Nalagam/.test(document.querySelector("#lab-content").innerText), null, { timeout: 20000 });

      // Po prvem izrisu se vsi naložijo sami (kasnejši klik takoj, service worker jih shrani za delo brez povezave).
      assert.equal(await page.evaluate(() => import("/i18n-osnova.js").then((m) => m.vseNalozeno())), false, "cel slovar je bil zadržan");
      assert.deepEqual(await page.evaluate(() => import("/i18n-osnova.js").then((m) => m.manjkajoci())), [], "ključi, ki jih ni bilo ne v jedru ne v delu");
      spusti("/i18n.js", "/i18n/sl.js");
      // Kalkulator: orodja (graph/calc.js dobi t() od app.js) počakajo cel slovar, kot pred delitvijo.
      await zavihek("graph");
      await vidno("#view-graph");
      await vidno("#graph-slot > :not([hidden]):not(p)");
      assert.deepEqual(kljuci(await page.locator("#view-graph").innerText()), [], "graph: ključ namesto besedila");
      const sami = LENI.filter((u) => !["/credit-card.js", "/garancija-ui.js", "/odstop-ui.js", "/pass-offer.js"].includes(u));
      for (let i = 0; i < 120 && !sami.every((u) => preneseno.has(u)); i++) await page.waitForTimeout(500);
      assert.deepEqual(sami.filter((u) => !preneseno.has(u)), [], "moduli, ki se po prvem izrisu niso naložili sami");
      assert.deepEqual(napake, []);
    } finally {
      await ctx.close();
    }
  }),
);

test("po prvem izrisu: moduli zaslonov pridejo sami, klik na Račun, Kartice in Kalkulator odpre vsebino brez čakanja", opts, () =>
  streznik(async ({ base, jar }) => {
    const { ctx, page, napake } = await stran(base, jar, { width: 1280, height: 800 });
    try {
      await page.goto(base + "/");
      await page.waitForSelector("#view-path #xp-card .hero", { timeout: 60000 });
      await page.waitForFunction((l) => l.every((u) => performance.getEntriesByType("resource").some((e) => new URL(e.name).pathname === u)), ["/vadnica.js", "/racun.js", "/kalkulator-zaslon.js", "/schedule.js", "/flashcards.js"], { timeout: 30000 });
      await page.waitForLoadState("networkidle");
      // Modul je že tu: zavihek se izriše brez vmesnega »Nalagam …« (samo klic API).
      for (const [v, gotovo] of [["account", "#view-account h1"], ["cards", "#view-cards > :not(p.muted)"], ["graph", "#graph-slot > :not([hidden]):not(p)"]]) {
        const t0 = Date.now();
        await page.evaluate((v) => document.querySelector(`.topbar .tab[data-view="${v}"], #modebar [data-mode="${v}"]`).click(), v);
        await page.waitForSelector(gotovo, { state: "visible", timeout: 10000 });
        assert.ok(Date.now() - t0 < 5000, `${v}: ${Date.now() - t0} ms`);
      }
      // Kalkulator čez cel zaslon z Učne poti (gumb .calc-open) in nazaj.
      await page.evaluate(() => document.querySelector('.topbar .tab[data-view="path"]').click());
      await page.evaluate(() => document.querySelector("#view-path .calc-open, .calc-open:not([hidden])")?.click());
      await page.waitForSelector("#graph-overlay:not([hidden])", { timeout: 10000 }).catch(() => null);
      if (await page.locator("#graph-overlay:not([hidden])").count()) {
        await page.keyboard.press("Escape");
        await page.waitForSelector("#graph-overlay[hidden]", { state: "attached", timeout: 10000 });
      }
      assert.deepEqual(napake, []);
    } finally {
      await ctx.close();
    }
  }),
);

test("prvo sporočilo inštruktorju, medtem ko nastavitve naprave (chat-settings.js) še prihajajo: gre s posnetkom naprave", opts, () =>
  streznik(async ({ base, jar }) => {
    const { ctx, page, napake } = await stran(base, jar);
    try {
      let spusti;
      const caka = new Promise((r) => (spusti = r));
      await page.route((url) => url.pathname === "/chat-settings.js", async (route) => {
        await caka;
        await route.continue().catch(() => {});
      });
      const telesa = [];
      page.on("request", (r) => /\/api\/conversations\/\d+\/messages$/.test(new URL(r.url()).pathname) && r.method() === "POST" && telesa.push(r.postDataJSON()));
      await page.addInitScript(() => localStorage.setItem("evklid.pisava", "velika"));
      await page.goto(base + "/", { waitUntil: "commit" });
      await page.waitForSelector("#view-path #xp-card .hero", { timeout: 60000 });
      await page.evaluate(() => document.querySelector('#tabbar .tab[data-view="chat"], .topbar .tab[data-view="chat"]').click());
      await page.waitForSelector("#view-chat #input", { state: "visible", timeout: 20000 });
      await page.locator("#input").fill("Koliko je 2 + 3?");
      await page.locator("#send").tap();
      await page.waitForTimeout(600);
      assert.equal(telesa.length, 0, "sporočilo je šlo brez posnetka naprave");
      spusti();
      await page.waitForFunction(() => performance.getEntriesByType("resource").some((e) => /\/messages$/.test(e.name)), null, { timeout: 20000 }).catch(() => null);
      for (let i = 0; i < 40 && !telesa.length; i++) await page.waitForTimeout(250);
      assert.equal(telesa.length, 1, "sporočilo ni šlo po prihodu modula");
      assert.equal(typeof telesa[0].device, "object", JSON.stringify(telesa[0]));
      assert.equal(telesa[0].text, "Koliko je 2 + 3?");
      assert.deepEqual(napake, []);
    } finally {
      await ctx.close();
    }
  }),
);
