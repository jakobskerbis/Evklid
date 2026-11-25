// Plavajoči elementi (UX PR 1, docs/NACRT-UX-UI.md §4): mehurček inštruktorja in obvestila ne prekrijejo polj, gumbov
// in površin z oznako data-ne-prekrij. Na nizkem zaslonu (ležeč telefon) in kadar okrogel mehurček nima prostega mesta,
// se umakne na rob kot jeziček. Plasti so spremenljivke v style.css. Preizkusi v brskalniku padejo na stari različici
// (UX-022 iskanje učbenika na ležečem telefonu, UX-104 prijava napake, UX-105 obvestilo čez gumb).
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
test.after(() => chromium?.close());
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 300000 };
const META = '\n<<META subject=MAT topic="-" error=0 mode=A flag=none done=0>>';
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

test("plasti: plavajoči elementi uporabljajo spremenljivke --z-* iz style.css (z rezervno vrednostjo za strani brez style.css)", () => {
  const style = read("public/style.css");
  const vars = Object.fromEntries([...style.matchAll(/--z-([a-z]+):\s*(\d+);/g)].map((m) => [m[1], Number(m[2])]));
  // Vrstni red plasti (od spodaj navzgor).
  const red = ["noga", "okno", "mehurcek", "obvestilo", "pojavno", "pasica", "modal", "tipkovnica", "zagon"];
  for (let i = 1; i < red.length; i++) assert.ok(vars[red[i - 1]] < vars[red[i]], `--z-${red[i - 1]} < --z-${red[i]}`);
  const pravila = [
    ["public/okna.css", /\.chat-bubble \{[^}]*z-index: var\(--z-mehurcek, 46\)/],
    ["public/okna.css", /\.okno \{[^}]*z-index: var\(--z-okno, 40\)/s],
    ["public/style.css", /\.toast \{[^}]*z-index: var\(--z-obvestilo, 50\)/],
    ["public/style.css", /\.toast \{[^}]*pointer-events: none/],
    ["public/touch.css", /z-index: var\(--z-noga, 30\)/],
    ["public/tipkovnica.css", /z-index: var\(--z-tipkovnica, 500\)/],
    ["public/account.css", /\.overlay \{[^}]*z-index: var\(--z-modal, 100\)/],
  ];
  for (const [f, re] of pravila) assert.match(read(f), re, f);
  // Rezervna vrednost je enaka vrednosti v style.css (sicer bi bila stran brez style.css v drugem vrstnem redu).
  for (const f of ["public/okna.css", "public/style.css", "public/touch.css", "public/tipkovnica.css", "public/account.css", "public/ui.css"])
    for (const m of read(f).matchAll(/var\(--z-([a-z]+), (\d+)\)/g)) assert.equal(Number(m[2]), vars[m[1]], `${f}: --z-${m[1]}`);
  // Iskanje učbenika in simulacije v lekciji imajo oznako data-ne-prekrij.
  const tb = read("public/textbook.js");
  assert.match(tb, /<input id="tb-q" type="search" data-ne-prekrij/);
  assert.match(tb, /class="tb-demo-mount" data-sim="\$\{i\}" data-ne-prekrij/);
});

async function withApp(fn) {
  const streamFn = async ({ onText }) => {
    const text = "Seštej enice, nato desetice." + META;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn" };
  };
  const app = createApp(openDb(":memory:"), { scheduler: false, streamFn, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  try {
    await fn(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}
// Telefon z enim pogovorom (mehurček se pokaže, ko klepet ni na zaslonu).
async function phone(base, viewport) {
  const ctx = await chromium.newContext({ viewport, isMobile: true, hasTouch: true, serviceWorkers: "block" });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(base + "/healthz");
  const id = await p.evaluate(() =>
    fetch("/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Nika", settings: { interests: [], educational_track: "OSNOVNA_SOLA", curriculum_level: "9. razred", subject: "MAT" } }) })
      .then((r) => r.json())
      .then((s) => s.id),
  );
  await p.evaluate((id) => (localStorage.setItem("studentId", String(id)), localStorage.setItem("evklid.tour", "1")), id);
  await p.goto(base + "/");
  await p.waitForSelector("#view-path #xp-card .hero", { timeout: 60000 });
  // Posnetek zadnjega zaslona (zacetek.js) pokaže kartico, preden app.js nastavi window.evklid.
  await p.waitForFunction(() => window.evklid && window.evklid.showView, null, { timeout: 60000 });
  await p.waitForLoadState("networkidle").catch(() => {});
  await p.evaluate(() => window.evklid.showView("chat"));
  await p.waitForSelector("#input", { state: "visible" });
  await p.fill("#input", "Koliko je 12 + 30?");
  await p.click("#send");
  await p.waitForSelector(".msg.assistant:not(.typing)");
  return { ctx, p, errors };
}
// Vidni polja in gumbi glavnega pogleda, ki jih element (selektor) prekrije za več kot 4 × 4 px.
const pokrito = (p, sel) =>
  p.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el || el.hidden || el.classList.contains("umaknjen") || !el.getClientRects().length) return [];
    const b = (el.querySelector(".cb-main") || el).getBoundingClientRect();
    return [...document.querySelectorAll("main.view:not([hidden]) :is(input:not([type=hidden]), select, textarea, button, a[href], [role=button], [role=switch]), [data-ne-prekrij]")]
      .filter((c) => c.checkVisibility() && !el.contains(c))
      .map((c) => [c, c.getBoundingClientRect()])
      .filter(([, r]) => r.width && Math.min(b.right, r.right) - Math.max(b.left, r.left) > 4 && Math.min(b.bottom, r.bottom) - Math.max(b.top, r.top) > 4)
      .map(([c]) => c.outerHTML.slice(0, 90));
  }, sel);
const mehurcek = (p) =>
  p.evaluate(() => {
    const b = document.querySelector("#chat-bubble");
    const r = b.querySelector(".cb-main").getBoundingClientRect();
    return { jezicek: b.classList.contains("jezicek"), umaknjen: b.classList.contains("umaknjen"), hidden: b.hidden, w: Math.round(r.width), left: Math.round(r.left), right: Math.round(innerWidth - r.right) };
  });

test("ležeč telefon 740 × 360: mehurček je jeziček ob robu in ne prekrije iskanja v učbeniku (UX-022, UX-101)", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, { width: 740, height: 360 });
    await p.evaluate(() => window.evklid.showView("textbook"));
    await p.waitForSelector("#tb-q", { state: "visible" });
    await p.waitForSelector("#chat-bubble:not([hidden])");
    await p.waitForTimeout(600); // mesto se popravi še 400 ms po menjavi pogleda (okna.js refreshBubble)
    const m = await mehurcek(p);
    assert.ok(m.umaknjen || m.jezicek, `na nizkem zaslonu mehurček ni okrogel sredi vsebine: ${JSON.stringify(m)}`);
    if (m.jezicek) {
      assert.equal(m.w, 24, "jeziček je širok 24 px (WCAG 2.5.8)");
      assert.ok(m.left === 0 || m.right === 0, "jeziček je tik ob robu");
    }
    assert.deepEqual(await pokrito(p, "#chat-bubble"), []);
    // Iskanje: rezultati pod poljem, mehurček ostane z njih.
    await p.fill("#tb-q", "ulom");
    await p.waitForTimeout(800);
    assert.deepEqual(await pokrito(p, "#chat-bubble"), []);
    // Tap na jeziček odpre klepet.
    if (m.jezicek) {
      await p.click("#chat-bubble .cb-main");
      await p.waitForSelector("#input", { state: "visible" });
    }
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

test("telefon 390 × 844: prijava napake v lekciji, površina data-ne-prekrij in obvestilo – nič prekrito (UX-104, UX-105)", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, { width: 390, height: 844 });
    await p.evaluate(() => window.evklid.showView("textbook"));
    await p.waitForSelector("#tb-body .tb-topic:not(.pending)");
    await p.locator("#tb-body .tb-topic:not(.pending)").first().click();
    await p.waitForSelector("#view-textbook .tb-title");
    await p.click("#tb-report");
    await p.waitForSelector("#view-textbook .report-box textarea, #view-textbook .report-box input");
    await p.waitForSelector("#chat-bubble:not([hidden])");
    // Polje za opis napake na višini mehurčka (tam ga je zunanji pregled videl prekritega).
    const y = await p.evaluate(() => document.querySelector("#chat-bubble").getBoundingClientRect().top);
    await p.evaluate((y) => {
      const el = document.querySelector("#view-textbook .report-box :is(textarea, input)");
      let sc = el.parentElement;
      while (sc && !(sc.scrollHeight > sc.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement;
      (sc || document.scrollingElement).scrollBy(0, el.getBoundingClientRect().top - y);
    }, y);
    await p.waitForTimeout(1100); // po drsenju se mehurček premakne (700 ms)
    assert.deepEqual(await pokrito(p, "#chat-bubble"), [], "mehurček prekrije prijavo napake");

    // Površina z oznako data-ne-prekrij tam, kjer stoji mehurček: mehurček se ji umakne (ob naslednji postavitvi).
    await p.evaluate(() => {
      const b = document.querySelector("#chat-bubble").getBoundingClientRect();
      const d = document.createElement("div");
      d.id = "ovira";
      d.setAttribute("data-ne-prekrij", "");
      Object.assign(d.style, { position: "fixed", left: "0", right: "0", top: `${b.top - 40}px`, height: "140px", background: "rgba(0,0,0,.05)" });
      document.body.append(d);
      dispatchEvent(new Event("resize"));
    });
    await p.waitForTimeout(400);
    assert.deepEqual(await pokrito(p, "#chat-bubble"), [], "mehurček prekrije površino data-ne-prekrij");
    await p.evaluate(() => document.querySelector("#ovira").remove());

    // Obvestilo: gumb tik nad spodnjo vrstico (kjer je obvestilo privzeto) – obvestilo gre drugam in ga ne prekrije.
    await p.evaluate(() => {
      const bar = document.querySelector("#tabbar").getBoundingClientRect();
      const v = document.querySelector("main.view:not([hidden])");
      const g = document.createElement("button");
      g.id = "spodnji-gumb";
      g.textContent = "Preveri odgovor";
      Object.assign(g.style, { position: "fixed", left: "16px", right: "16px", top: `${bar.top - 70}px`, height: "48px" });
      v.append(g);
      const t = document.querySelector("#toast");
      t.textContent = "Shranjeno";
      t.hidden = false;
      t.dataset.at = Date.now();
    });
    await p.waitForTimeout(100);
    assert.deepEqual(await pokrito(p, "#toast"), [], "obvestilo prekrije gumb");
    const tr = await p.evaluate(() => {
      const r = document.querySelector("#toast").getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, head: document.querySelector(".topbar").getBoundingClientRect().bottom, bar: document.querySelector("#tabbar").getBoundingClientRect().top };
    });
    assert.ok(tr.top >= tr.head && tr.bottom <= tr.bar, `obvestilo je med zgornjo in spodnjo vrstico: ${JSON.stringify(tr)}`);
    // Brez ovire je obvestilo spet nad spodnjo vrstico.
    await p.evaluate(() => {
      document.querySelector("#spodnji-gumb").remove();
      document.querySelector("#toast").dataset.at = Date.now() + 1;
    });
    await p.waitForTimeout(100);
    // Nad spodnjo vrstico oziroma nad krogi lekcije Nazaj · 1/12 · Naprej, kadar so na dnu.
    const spodaj = await p.evaluate(() => {
      const st = document.querySelector("#view-textbook .tb-stepper");
      const dno = Math.min(document.querySelector("#tabbar").getBoundingClientRect().top, st?.offsetParent ? st.getBoundingClientRect().top : Infinity);
      return dno - document.querySelector("#toast").getBoundingClientRect().bottom;
    });
    assert.ok(spodaj >= 12 && spodaj <= 40, `obvestilo stoji tik nad spodnjo vrstico (${spodaj} px)`);
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});
