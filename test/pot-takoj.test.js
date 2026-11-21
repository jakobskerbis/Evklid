// Učna pot v prvem odgovoru strani (server/pot-takoj.js, public/zacetna.js, public/zacetek.js potStreznika).
// Strežnik in app.js izrišeta isto Učno pot z istimi funkcijami; test preveri, da je HTML pred zagonom app.js enak
// tistemu, ki ga app.js izriše sam, da je stran osebna in ubežana, kdaj strežnik Učne poti ne izriše (okostje kot prej),
// da se dotik pred zagonom izvede, ko je app.js pripravljen, in da stran v drugem jeziku naprave ne velja.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { SI_EXAM_TRACKS, jezikStrani, napisiLupine } from "../server/pot-takoj.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const bopts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 240000 };
test.after(() => chromium?.close());
const quiet = { error() {}, warn() {}, info() {}, log() {} };
const NAV = { "sec-fetch-dest": "document", "sec-fetch-mode": "navigate", "accept-language": "sl-SI,sl;q=0.9" };
const META = /<meta name="evklid-pot" ([^>]*)>/;
const TPL = /<template id="evklid-pot">([^]*?)<\/template>\n/;

async function withServer(fn, env = {}) {
  const prej = Object.fromEntries(Object.keys(env).map((k) => [k, process.env[k]]));
  Object.assign(process.env, env);
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, log: quiet });
  for (const [k, v] of Object.entries(prej)) if (v === undefined) delete process.env[k];
  else process.env[k] = v;
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    const cookie = () => Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ");
    const call = async (path, o = {}) => {
      const res = await fetch(base + path, { method: o.method || "GET", redirect: "manual", headers: { "Content-Type": "application/json", cookie: cookie() }, body: o.body ? JSON.stringify(o.body) : undefined });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        jar[kv.slice(0, kv.indexOf("="))] = kv.slice(kv.indexOf("=") + 1);
      }
      return { status: res.status, body: await res.json().catch(() => null) };
    };
    // Stran prek http.get: fetch v Node glave Sec-Fetch-* prepiše.
    call.page = (headers = NAV) =>
      new Promise((ok, bad) => {
        http
          .get(base + "/", { headers: { cookie: cookie(), ...headers } }, (r) => {
            const b = [];
            r.on("data", (c) => b.push(c));
            r.on("end", () => ok({ status: r.statusCode, headers: r.headers, html: Buffer.concat(b).toString("utf8") }));
          })
          .on("error", bad);
      });
    call.jar = jar;
    return call;
  };
  // Račun z enim ali več profili; profil brez vprašalnika zanimanj in ogleda (Učna pot takoj).
  const signup = async (email, profiles) => {
    const c = client();
    const r = await c("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    const u = new URL(r.body.dev_verify_url);
    await c(u.pathname + u.search);
    const ids = [];
    for (const p of profiles) {
      const s = await c("/api/students", { method: "POST", body: { name: p.name, birth_year: new Date().getFullYear() - 13, consent: true } });
      assert.equal(s.status, 201, JSON.stringify(s.body));
      ids.push(s.body.id);
      const r2 = await c(`/api/students/${s.body.id}`, { method: "PUT", body: { settings: { interests: [], game_childhood: [], tour_version: 99, ...(p.settings || {}) } } });
      assert.equal(r2.status, 200, JSON.stringify(r2.body));
      await c(`/api/students/${s.body.id}/anketa-teden/pozneje`, { method: "POST", body: {} });
    }
    return { c, ids, sid: ids[0] };
  };
  try {
    await fn({ base, signup, store });
  } finally {
    server.close();
  }
}

test("NPZ in matura: SI_EXAM_TRACKS so ključi SI_EXAMS v public/exam-papers.js", () => {
  const src = fs.readFileSync(new URL("../public/exam-papers.js", import.meta.url), "utf8");
  const blok = /export const SI_EXAMS = \{([^]*?)\};/.exec(src);
  assert.ok(blok, "SI_EXAMS v exam-papers.js");
  const kljuci = [...blok[1].matchAll(/([A-Z_]+):/g)].map((m) => m[1]);
  assert.deepEqual(kljuci.sort(), [...SI_EXAM_TRACKS].sort());
});

test("jezik strani: jezik profila, sicer brskalnika; napisi lupine so ključi zgornje in spodnje vrstice", () => {
  const req = (al) => ({ headers: { "accept-language": al } });
  assert.equal(jezikStrani(req("sl-SI"), { language: "ar" }).lang, "ar");
  assert.equal(jezikStrani(req("sl-SI"), { language: "ar" }).rtl, true);
  assert.equal(jezikStrani(req("en-GB,en;q=0.8"), {}).lang, "en");
  assert.equal(jezikStrani(req("sl-SI"), {}).lang, "sl");
  const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
  const np = napisiLupine(html, (k) => `«${k}»`);
  for (const k of ["nav.path", "nav.chat", "nav.me", "mock.title", "beta.title", "beta.close", "xp.title", "nav.main"]) assert.equal(np[k], `«${k}»`, k);
  assert.equal(np["path.curriculumNote"], undefined, "Učna pot ni del lupine");
});

test("stran z Učno potjo: osebna (no-store, Vary: Cookie, brez ETag), ime ubežano, izklop EVKLID_POT_STREZNIK=0", async () => {
  const IME = "Ana </template><script>alert(1)</script>\" '";
  await withServer(async ({ signup }) => {
    const { c, sid } = await signup("pot@primer.si", [{ name: IME }]);
    const res = await c.page();
    assert.equal(res.status, 200);
    assert.equal(res.headers["cache-control"], "no-store");
    assert.match(res.headers.vary, /Cookie/);
    assert.equal(res.headers.etag, undefined);
    const meta = META.exec(res.html);
    assert.ok(meta, "meta evklid-pot");
    assert.ok(res.html.indexOf('name="evklid-pot"') < res.html.indexOf('src="zacetek.js"'), "meta pred zacetek.js");
    assert.match(meta[1], new RegExp(`data-s="${sid}"`));
    assert.match(meta[1], /data-jezik="sl" data-smer="ltr"/);
    assert.ok(!res.html.includes("<script>alert(1)"), "ime ni nikjer neubežano");
    assert.ok(!res.html.includes("</template><script>"), "ime ne konča <template>");
    assert.ok(!/[<>]/.test(meta[1]), "v atributih ni < ali >");
    const glava = JSON.parse(/data-glava="([^"]*)"/.exec(meta[1])[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));
    assert.equal(glava.n, (await c("/api/students")).body[0].name);
    assert.match(glava.n, /<\/template><script>/);
    const tpl = TPL.exec(res.html);
    assert.ok(tpl, "template evklid-pot");
    // Pred prvim <main>: zacetek.js vstavi Učno pot, ko vidi prvi <main>; predloga mora biti že razčlenjena (pregled #903).
    assert.ok(tpl.index < res.html.search(/\n {2}<main /), "pred prvim <main> v <body>");
    for (const id of ["xp-card", "modebar", "path-content", "path-level", "schedule-card", "stage-card"]) assert.match(tpl[1], new RegExp(`id="${id}"`), id);
    assert.ok(!/<script/i.test(tpl[1]), "v Učni poti ni skript");
    // Brez navigacije (service worker): navadna stran brez Učne poti.
    const sw = await c.page({ "sec-fetch-dest": "empty", "sec-fetch-mode": "cors" });
    assert.ok(!META.test(sw.html) && !TPL.test(sw.html));
  });
  await withServer(
    async ({ signup }) => {
      const { c } = await signup("izklop@primer.si", [{ name: "Ana" }]);
      const res = await c.page();
      assert.match(res.html, /id="evklid-zacetni"/, "začetni podatki ostanejo");
      assert.ok(!META.test(res.html) && !TPL.test(res.html), "izklop: brez Učne poti s strežnika");
    },
    { EVKLID_POT_STREZNIK: "0" },
  );
});

test("okostje kot prej: več profilov, cilj, fakulteta; stran se ne sestavi, ko česa ne zna enako", async () => {
  await withServer(async ({ signup }) => {
    const dva = await signup("dva@primer.si", [{ name: "Ana" }, { name: "Bor" }]);
    assert.ok(!META.test((await dva.c.page()).html), "več profilov: izbira profila");
    const datum = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
    const cilj = await signup("cilj@primer.si", [{ name: "Cene", settings: { goal: "npz", goal_date: datum } }]);
    assert.ok(!META.test((await cilj.c.page()).html), "cilj (vrstica in opomnik po uri naprave)");
    const faks = await signup("faks@primer.si", [{ name: "Dora", settings: { educational_track: "UNIVERZA" } }]);
    assert.ok(!META.test((await faks.c.page()).html), "fakulteta");
    const en = await signup("en@primer.si", [{ name: "Emma", settings: { language: "en" } }]);
    const m = META.exec((await en.c.page()).html);
    assert.ok(m, "drug jezik: Učna pot v jeziku profila");
    assert.match(m[1], /data-jezik="en"/);
    assert.match(m[1], /&quot;np&quot;:\{/, "napisi lupine v jeziku profila");
  });
});

// Element Učne poti brez oznak, ki jih ima samo ena stran (data-pogoj/data-nastal: zacetek.js; data-wired: app.js),
// skrit element samo kot skrit (app.js skrito kartico izprazni, strežnik vsebino pusti), brez ročke okna.
const ZAJEMI = (ids) => {
  const m = document.querySelector("main[data-streznik]") || document.getElementById("view-path");
  const out = {};
  for (const id of ids) {
    const el = m.querySelector("#" + id);
    if (!el || el.hidden) {
      out[id] = el ? "skrit" : null;
      continue;
    }
    const k = el.cloneNode(true);
    for (const x of [k, ...k.querySelectorAll("*")]) for (const a of ["data-pogoj", "data-nastal", "data-wired"]) x.removeAttribute(a);
    for (const x of k.querySelectorAll("[hidden]")) x.textContent = "";
    out[id] = k.outerHTML;
  }
  out.vrstni = [...m.children].filter((c) => !c.classList.contains("split-handle")).map((c) => c.id || c.className).join(",");
  out.kartice = [...(m.querySelector("#xp-card")?.parentElement?.children || [])].map((c) => c.id || c.className).join(",");
  return out;
};
const IDS = ["path-head", "path-level", "path-lower", "path-note", "lang-note", "xp-card", "schedule-card", "stage-card", "modebar", "goal-modes", "path-content", "feedback-card", "install-card", "goal-line", "level-card", "goal-reminder"];

async function stran(base, jar, { locale = "sl-SI", tz = "Europe/Ljubljana", init = () => {}, mobile = true, pot = "/" } = {}) {
  const ctx = await chromium.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 }, isMobile: mobile, hasTouch: mobile, locale, timezoneId: tz, serviceWorkers: "block", reducedMotion: "reduce" });
  await ctx.addCookies(Object.entries(jar).map(([name, value]) => ({ name, value, url: base })));
  await ctx.addInitScript(() => localStorage.setItem("evklid.tour", "done"));
  await ctx.addInitScript(init);
  const page = await ctx.newPage();
  const napake = [];
  page.on("pageerror", (e) => napake.push(e.message));
  // app.js zadržimo, dokler test ne reče: Učna pot s strežnika je na zaslonu, aplikacija še ne teče.
  let spusti = null;
  const zadrzano = new Promise((ok) => (spusti = ok));
  await page.route("**/zagon.js", async (r) => {
    await zadrzano;
    await r.continue().catch(() => {});
  });
  await page.goto(base + pot, { waitUntil: "commit" });
  const pripravljen = () => page.waitForFunction(() => !document.querySelector("main[data-posnetek]") && !document.documentElement.hasAttribute("data-zacetek") && document.querySelector("#view-path #xp-card .hero"), null, { timeout: 60000 });
  return { ctx, page, napake, spusti, pripravljen };
}

test("isti HTML: Učna pot s strežnika je enaka tisti, ki jo izriše app.js (slovenščina, telefon; arabščina, računalnik)", bopts, async () => {
  await withServer(async ({ base, signup }) => {
    const datum = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
    const sl = await signup("sl@primer.si", [{ name: "Lena" }]);
    await sl.c(`/api/students/${sl.sid}/schedule`, { method: "PUT", body: { lessons: [1, 2, 3, 4, 5, 6, 7].map((day) => ({ day, start: "23:00", end: "23:45", name: "Matematika" })), events: [{ date: datum(4), time: "08:00", kind: "test", name: "Test <b>ulomki</b>" }] } });
    const ar = await signup("ar@primer.si", [{ name: "Amira", settings: { language: "ar" } }]);
    // Star profil maturanta brez cilja: ponudba »cilj matura« (#goal-reminder) že s strežnika (public/zacetna.js).
    const mat = await signup("mat@primer.si", [{ name: "Maj", settings: { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik" } }]);
    for (const [u, o] of [
      [sl, {}],
      [ar, { locale: "ar", tz: "Asia/Dubai", mobile: false }],
      [mat, { ponudba: true }],
    ]) {
      const { ctx, page, napake, spusti, pripravljen } = await stran(base, u.c.jar, o);
      try {
        await page.waitForSelector("main[data-streznik] #xp-card .hero", { timeout: 30000 });
        const m = await page.evaluate(() => {
          const x = document.querySelector("main[data-streznik]");
          return { id: x.id, aria: x.getAttribute("aria-hidden"), inert: x.inert, dir: document.documentElement.dir, lang: document.documentElement.lang };
        });
        assert.deepEqual(m, { id: "view-path", aria: null, inert: false, dir: o.locale === "ar" ? "rtl" : "ltr", lang: o.locale === "ar" ? "ar" : "sl" }, "dostopna Učna pot pred zagonom");
        const pred = await page.evaluate(ZAJEMI, IDS);
        assert.ok(pred["xp-card"] && pred["path-content"] && pred.modebar, JSON.stringify(Object.keys(pred)));
        if (!o.locale && !o.ponudba) assert.match(pred["schedule-card"], /Test &lt;b&gt;ulomki&lt;\/b&gt;/, "dogodek iz urnika ubežan");
        if (o.ponudba) assert.match(pred["goal-reminder"], /data-matura-offer="yes"/, "ponudba cilja matura");
        else assert.equal(pred["goal-reminder"], "skrit");
        assert.match(pred.kartice, /xp-card,feedback-card,install-card/, "mnenje in namestitev tik pod #xp-card");
        // Napisi lupine že v jeziku profila (arabščina): enaki kot po zagonu.
        const lupina = () => page.evaluate(() => [...document.querySelectorAll(".topbar .tab span, #tabbar .tab span, #test-notice b")].map((e) => e.textContent).join("|"));
        const lupinaPred = await lupina();
        spusti();
        await pripravljen();
        await page.waitForLoadState("networkidle");
        const po = await page.evaluate(ZAJEMI, IDS);
        for (const id of [...IDS, "vrstni", "kartice"]) assert.equal(pred[id], po[id], `${o.locale || "sl"}: #${id}`);
        assert.equal(lupinaPred, await lupina(), "napisi lupine");
        assert.deepEqual(napake, []);
      } finally {
        await ctx.close();
      }
    }
  });
});

test("dotik pred zagonom: tema na Učni poti in zavihek spodnje vrstice se izvedeta, ko je app.js pripravljen", bopts, async () => {
  await withServer(async ({ base, signup }) => {
    const u = await signup("dotik@primer.si", [{ name: "Tine" }]);
    {
      const { ctx, page, napake, spusti, pripravljen } = await stran(base, u.c.jar);
      try {
        const tema = page.locator("main[data-streznik] #path-content .node[data-open]:visible").first();
        await tema.waitFor({ timeout: 30000 });
        const id = await tema.getAttribute("data-open");
        await tema.click();
        assert.equal(await page.evaluate(() => document.getElementById("view-topic").hidden), true, "pred zagonom se nič ne odpre");
        assert.equal(await tema.getAttribute("data-caka"), "", "dotik viden: gumb kot pritisnjen do zagona");
        spusti();
        await pripravljen();
        await page.waitForFunction(() => !document.getElementById("view-topic").hidden, null, { timeout: 30000 });
        assert.ok(id);
        assert.deepEqual(napake, []);
      } finally {
        await ctx.close();
      }
    }
    {
      const { ctx, page, napake, spusti, pripravljen } = await stran(base, u.c.jar);
      try {
        await page.waitForSelector("main[data-streznik] #xp-card .hero", { timeout: 30000 });
        await page.locator('#tabbar .tab[data-view="chat"]').click();
        spusti();
        await pripravljen();
        await page.waitForFunction(() => !document.getElementById("view-chat").hidden, null, { timeout: 30000 });
        // Oznaka AI je vidna, ko je viden pogovor (public/ai-oznaka).
        await page.waitForSelector("#view-chat #composer .ai-note", { state: "visible", timeout: 30000 });
        assert.deepEqual(napake, []);
      } finally {
        await ctx.close();
      }
    }
  });
});

test("pomaknjena Učna pot s strežnika ostane na istem mestu, ko app.js prevzame (pregled #903)", bopts, async () => {
  await withServer(async ({ base, signup }) => {
    const u = await signup("odmik@primer.si", [{ name: "Ota" }]);
    const { ctx, page, napake, spusti, pripravljen } = await stran(base, u.c.jar);
    try {
      await page.waitForSelector("main[data-streznik] #path-content .node", { timeout: 30000 });
      await page.waitForSelector("#tabbar", { state: "attached" });
      // Na telefonu se pomika sam <main> Učne poti.
      const cilj = await page.evaluate(() => {
        const m = document.querySelector("main[data-streznik]");
        m.scrollTop = Math.min(1200, m.scrollHeight - m.clientHeight);
        return m.scrollTop;
      });
      assert.ok(cilj > 300, `Učna pot je dovolj dolga za pomik (${cilj})`);
      spusti();
      await pripravljen();
      await page.waitForLoadState("networkidle");
      const po = await page.evaluate(() => document.getElementById("view-path").scrollTop);
      assert.ok(Math.abs(po - cilj) < 2, `pomik ostane (${cilj} → ${po})`);
      assert.deepEqual(napake, []);
    } finally {
      await ctx.close();
    }
  });
});

test("klik iz skripte med zagonom ni dotik: vrnitev s plačila konča kot brez Učne poti s strežnika (pregled #903)", bopts, async () => {
  await withServer(async ({ base, signup }) => {
    const u = await signup("placilo@primer.si", [{ name: "Pia" }]);
    const { ctx, page, napake, spusti, pripravljen } = await stran(base, u.c.jar, { pot: "/?billing=portal" });
    try {
      await page.waitForSelector("main[data-streznik] #xp-card .hero", { timeout: 30000 });
      spusti();
      await pripravljen();
      await page.waitForLoadState("networkidle");
      // Kot EVKLID_POT_STREZNIK=0: klik account.js na zavihek Račun ni shranjen kot dotik, ki bi se izvedel na koncu zagona.
      assert.deepEqual(await page.evaluate(() => [document.getElementById("view-path").hidden, document.getElementById("view-account").hidden]), [false, true]);
      assert.equal(await page.evaluate(() => !!document.querySelector('meta[name="evklid-pot"]')), false, "podatki glave s strežnika po zagonu niso več v strani");
      assert.deepEqual(napake, []);
    } finally {
      await ctx.close();
    }
  });
});

test("drug jezik naprave ali vrstni red na napravi: okostje kot prej, Učna pot s strežnika se ne pokaže", bopts, async () => {
  await withServer(async ({ base, signup }) => {
    const u = await signup("jezik@primer.si", [{ name: "Urh" }]);
    // Jezik naprave: app.js ob izbiri profila preklopi na jezik profila in stran naloži znova (ključ zato le ob prvem nalaganju).
    const enkrat = () => {
      if (sessionStorage.getItem("t.enkrat")) return;
      sessionStorage.setItem("t.enkrat", "1");
      localStorage.setItem("evklid.lang", "en");
    };
    for (const init of [enkrat, () => localStorage.setItem("evklid.vrsta.path", '["modebar"]')]) {
      const { ctx, page, spusti, pripravljen } = await stran(base, u.c.jar, { init });
      try {
        await page.waitForSelector("main[data-posnetek]", { state: "attached", timeout: 30000 });
        assert.equal(await page.evaluate(() => !!document.querySelector("main[data-streznik]")), false);
        assert.equal(await page.evaluate(() => !!document.querySelector("main[data-posnetek].zo-pot")), true, "okostje Učne poti");
        spusti();
        await pripravljen().catch(async (e) => {
          throw new Error(e.message + " " + JSON.stringify(await page.evaluate(() => ({ z: document.documentElement.getAttribute("data-zacetek"), pos: !!document.querySelector("main[data-posnetek]"), hero: !!document.querySelector("#view-path #xp-card .hero"), vidni: [...document.querySelectorAll("body > main:not([hidden])")].map((m) => m.id), url: location.href }))));
        });
      } finally {
        await ctx.close();
      }
    }
  });
});
