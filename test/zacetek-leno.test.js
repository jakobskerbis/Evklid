// Prvi izris Učne poti brez kode drugih zaslonov (naloga hitrost, docs/meritve/prijavljen-mobilno-2026-11-19.md točka 2):
// KaTeX, marked in DOMPurify (public/rich.js naloziKnjiznice), cel slovenski slovar (public/i18n-osnova.js + jedro s
// strežnika, server/i18n-jedro.js), Učbenik, oznake formul, varnostni zaznavalnik (nujno.js), Evklidova tipkovnica
// (tipkovnica-lena.js) in preverjanje brez povezave se naložijo po prvem izrisu ali ob prvi potrebi. Test preveri, da se
// Učna pot izriše, medtem ko brskalnik teh datotek še ne dobi, da ji ne manjka nobeno besedilo in da se nato vsak glavni
// zaslon prvič odpre pravilno (z besedili, formulami in tipkovnico).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { startupFiles } from "../server/startup-files.js";
import { kljuciJedra } from "../server/i18n-jedro.js";
import SL from "../public/i18n/sl.js";

const PUB = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 240000 };
test.after(() => chromium?.close());
const quiet = { error() {}, warn() {}, info() {}, log() {} };

// Datoteke, ki jih prvi izris Učne poti ne sme čakati.
const POZNEJE = ["/vendor/katex/katex.min.js", "/vendor/marked/lib/marked.umd.js", "/vendor/dompurify/purify.min.js", "/i18n.js", "/i18n/sl.js", "/textbook.js", "/formula-info.js", "/formula-data.js", "/sirina.js", "/nujno.js", "/tipkovnica.js", "/tipkovnica-data.js", "/our-paper.js"];

test("prvo odprtje: knjižnice za izris, cel slovar in moduli drugih zaslonov niso v statičnem grafu", () => {
  const list = startupFiles(PUB, "index.html");
  for (const u of POZNEJE) assert.ok(!list.includes(u), `${u} je del prvega odprtja`);
  // Moduli prvega odprtja uvozijo i18n-osnova.js; i18n.js (cel slovar) samo moduli, ki se naložijo pozneje.
  for (const u of list.filter((x) => x.endsWith(".js") && !x.startsWith("/vendor/"))) {
    const src = fs.readFileSync(path.join(PUB, u), "utf8");
    assert.doesNotMatch(src, /from\s+["'](?:\.\.?\/)+i18n\.js["']/, `${u}: uvozi i18n.js (cel slovar) namesto i18n-osnova.js`);
  }
  // Jedro: vsa besedila iz index.html in ključi, ki jih omenja app.js, ne pa besedila samo lenih modulov.
  const jedro = new Set(kljuciJedra(PUB, SL));
  for (const m of fs.readFileSync(path.join(PUB, "index.html"), "utf8").matchAll(/data-i18n(?:-ph|-title|-aria|-alt)?="([^"]+)"/g)) if (SL[m[1]] !== undefined) assert.ok(jedro.has(m[1]), m[1]);
  for (const k of ["nav.path", "daily.title", "unit.label", "xp.r.correct", "block.daily"]) assert.ok(jedro.has(k), k);
  assert.ok(jedro.size < Object.keys(SL).length * 0.7, `jedro ${jedro.size} od ${Object.keys(SL).length} ključev`);
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
    const r = await call("/api/auth/register", { method: "POST", body: { email: "leno@evklid.test", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    const u = new URL(r.body.dev_verify_url);
    await call(u.pathname + u.search);
    const s = await call("/api/students", { method: "POST", body: { name: "Lena", birth_year: new Date().getFullYear() - 13, consent: true, settings: { school: "OSNOVNA_SOLA", grade: "8. razred" } } });
    assert.equal(s.status, 201, JSON.stringify(s.body));
    await fn({ base, jar, id: s.body.id });
  } finally {
    server.close();
  }
}

test("Učna pot se izriše brez lenih datotek, brez manjkajočih besedil; nato se vsak glavni zaslon prvič odpre pravilno", opts, () =>
  streznik(async ({ base, jar, id }) => {
    const ctx = await chromium.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, locale: "sl-SI", serviceWorkers: "block" });
    try {
      await ctx.addCookies(Object.entries(jar).map(([name, value]) => ({ name, value, url: base })));
      await ctx.addInitScript(() => {
        localStorage.setItem("evklid.tour", "done");
        localStorage.setItem("evklid.interests.asked", "1");
      });
      const page = await ctx.newPage();
      const napake = [];
      page.on("pageerror", (e) => napake.push(e.message));
      // Lene datoteke zadržimo, dokler Učna pot ni izrisana: če bi jo katera zadrževala, se ne bi izrisala.
      const zadrzane = [];
      let spusti = null;
      const spusceno = new Promise((ok) => (spusti = ok));
      await page.route(
        (url) => POZNEJE.includes(url.pathname),
        async (route) => {
          zadrzane.push(new URL(route.request().url()).pathname);
          await spusceno;
          await route.continue();
        },
      );
      const html = await (await page.goto(base + "/", { waitUntil: "commit" })).text();
      assert.match(html, /<script type="application\/json" id="evklid-sl-jedro">/, "stran prijavljenega učenca ima jedro besedil");
      assert.doesNotMatch(html, /modulepreload" href="\/i18n(?:\/sl)?\.js"/);
      await page.waitForSelector("#view-path #xp-card .hero", { timeout: 60000 });
      await page.waitForTimeout(300);
      // Brez celega slovarja: nobeno besedilo na zaslonu ni ključ, noben t() ni iskal ključa zunaj jedra.
      const manjka = await page.evaluate(() => import("/i18n-osnova.js").then((m) => ({ vse: m.vseNalozeno(), manjka: m.manjkajoci() })));
      assert.equal(manjka.vse, false, "cel slovar je bil zadržan");
      assert.deepEqual(manjka.manjka, [], "ključi brez besedila pred celim slovarjem");
      const besedilo = await page.evaluate(() => document.body.innerText);
      const kljuci = Object.keys(SL).filter((k) => /\./.test(k) && besedilo.includes(k));
      assert.deepEqual(kljuci, [], "ključ namesto besedila");
      assert.ok(!(await page.locator("#view-path .rich-caka").count()), "Učna pot nima nadomestkov izrisa");
      // Izris pred knjižnicami da nadomestek, ki se zamenja s pravim izrisom, ko knjižnice pridejo.
      await page.evaluate(() =>
        import("/rich.js").then(({ createRenderer }) => {
          const el = document.createElement("div");
          el.id = "poskus-izrisa";
          el.innerHTML = createRenderer().renderRich("**krepko** in $x^2 + 1$");
          document.body.append(el);
        }),
      );
      assert.equal(await page.locator("#poskus-izrisa .rich-caka").count(), 1);
      // Spustimo lene datoteke: aplikacija jih naloži sama (zasloniPozneje), nadomestek se izriše.
      spusti();
      await page.waitForSelector("#poskus-izrisa .katex", { timeout: 30000 });
      assert.equal(await page.locator("#poskus-izrisa strong").textContent(), "krepko");
      assert.equal(await page.locator("#poskus-izrisa .rich-caka").count(), 0);
      await page.waitForFunction(() => import("/i18n-osnova.js").then((m) => m.vseNalozeno()), null, { timeout: 30000 });
      // Po prvem izrisu se naloži vse za druge zaslone (tudi za delo brez povezave).
      await page.waitForFunction((n) => n.every((u) => performance.getEntriesByType("resource").some((e) => new URL(e.name).pathname === u)), ["/nujno.js", "/tipkovnica.js", "/textbook.js", "/formula-info.js", "/vendor/katex/katex.min.js"], { timeout: 30000 });
      const zavihek = async (v) => {
        await page.evaluate((v) => document.querySelector(`#tabbar .tab[data-view="${v}"], .topbar .tab[data-view="${v}"]`).click(), v);
        await page.waitForSelector(`#view-${v}:not([hidden])`, { timeout: 20000 });
      };
      // Inštruktor: polje in gumb Pošlji; Evklidova tipkovnica (lena) se odpre z gumbom simbolov.
      await zavihek("chat");
      await page.waitForSelector("#input", { state: "visible" });
      await page.evaluate(() => document.querySelector("#sym-btn").click());
      await page.waitForSelector("#tipkovnica:not([hidden])", { timeout: 20000 });
      await page.evaluate(() => document.querySelector("#sym-btn").click());
      // Uči se → Učbenik: kazalo lekcij iz lenega textbook.js.
      await zavihek("uci");
      await page.evaluate(() => document.querySelector('[data-uci-tab="textbook"]').click());
      await page.waitForFunction(() => document.querySelector("#view-textbook")?.textContent.trim().length > 40 && !document.querySelector("#view-textbook > p.muted"), null, { timeout: 30000 });
      // Kalkulator (KaTeX in t() od app.js) in Jaz.
      await zavihek("graph").catch(() => {});
      await zavihek("me").catch(() => {});
      await zavihek("path");
      await page.waitForSelector("#view-path #xp-card .hero");
      // Tema z Učne poti: razlaga z izrisanimi formulami, brez nadomestkov.
      await page.evaluate(() => document.querySelector("#view-path [data-open]").click());
      await page.waitForSelector("#view-topic:not([hidden])", { timeout: 20000 });
      await page.waitForTimeout(1500);
      assert.equal(await page.locator(".rich-caka").count() - (await page.locator("#poskus-izrisa .rich-caka").count()), 0, "nadomestki ostali");
      const vse = await page.evaluate(() => document.body.innerText);
      assert.deepEqual(Object.keys(SL).filter((k) => /^[a-z]+\.[a-zA-Z]+$/.test(k) && vse.includes(k)), [], "ključ namesto besedila po odprtju zaslonov");
      assert.deepEqual(napake, []);
      assert.ok(zadrzane.includes("/vendor/katex/katex.min.js") && zadrzane.includes("/i18n/sl.js"), zadrzane.join(" "));
      assert.ok(id > 0);
    } finally {
      await ctx.close();
    }
  }),
);
