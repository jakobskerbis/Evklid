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
async function phone(base, viewport, mobile = true) {
  const ctx = await chromium.newContext({ viewport, isMobile: mobile, hasTouch: mobile, serviceWorkers: "block" });
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

test("iPad 820 × 1180: zadetki, ki pridejo pozneje (brez vnosa ali klika), ne ostanejo pod mehurčkom (dimni test 25. 11.)", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, { width: 1180, height: 820 });
    await p.evaluate(() => window.evklid.showView("textbook"));
    await p.waitForSelector("#tb-q", { state: "visible" });
    await p.waitForSelector("#chat-bubble:not([hidden])");
    await p.waitForTimeout(900);
    assert.deepEqual(await pokrito(p, "#chat-bubble"), []);
    // Kot zadetki iskanja s strežnika: gumbi čez vso širino pogleda pod mehurčkom, dodani brez vnosa ali klika.
    await p.evaluate(() => {
      const r = document.querySelector("#chat-bubble .cb-main").getBoundingClientRect();
      const box = document.createElement("div");
      box.style.cssText = `position:fixed;left:24px;right:24px;top:${r.top - 60}px`;
      for (let i = 0; i < 4; i++) {
        const b = document.createElement("button");
        b.textContent = "Zadetek " + i;
        b.style.cssText = "display:block;width:100%;height:44px;margin:0 0 4px";
        box.append(b);
      }
      document.querySelector("#view-textbook").append(box);
    });
    await p.waitForTimeout(400); // brez vnosa in klika: mesto se popravi kmalu po spremembi vsebine
    assert.deepEqual(await pokrito(p, "#chat-bubble"), []);
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
    // Drsenje (brez nove vsebine) pripelje gumb pod obvestilo: obvestilo se umakne (dimni test računov 25. 11.).
    // Obvestilo se po nekaj sekundah samo skrije: pred drsenjem ga pokažemo znova.
    await p.evaluate(() => {
      const t = document.querySelector("#toast");
      t.hidden = false;
      t.dataset.at = Date.now() + 2;
    });
    await p.waitForTimeout(50);
    const zamik = await p.evaluate(() => {
      const v = document.querySelector("main.view:not([hidden])");
      // Drsni del pogleda (lekcija): tisti z največ vsebine pod robom.
      const sc = [v, ...v.querySelectorAll("*")]
        .filter((e) => /auto|scroll/.test(getComputedStyle(e).overflowY) && e.clientHeight > 200)
        .sort((x, y) => y.scrollHeight - y.clientHeight - (x.scrollHeight - x.clientHeight))[0];
      const g = document.createElement("button");
      g.id = "gumb-v-vsebini";
      g.textContent = "Ustvari profil";
      g.style.cssText = "display:block;width:100%;height:48px;margin:0 0 1200px";
      sc.append(g);
      const t = document.querySelector("#toast").getBoundingClientRect();
      sc.scrollBy({ top: g.getBoundingClientRect().top - t.top, behavior: "instant" });
      return Math.round(g.getBoundingClientRect().top - t.top);
    });
    assert.ok(Math.abs(zamik) < 4, `gumb je po drsenju na mestu obvestila (${zamik} px)`);
    await p.waitForTimeout(300); // mesto vidnega obvestila se preveri vsakih 200 ms
    assert.equal(await p.evaluate(() => document.querySelector("#toast").hidden), false, "obvestilo je še vidno");
    assert.deepEqual(await pokrito(p, "#toast"), [], "po drsenju obvestilo prekrije gumb");
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

test("telefon 360 × 740, klepet: obvestilo ne prekrije vrstice za pisanje in gumbov glave (dimni test 25. 11.)", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, { width: 360, height: 740 });
    await p.evaluate(() => {
      const t = document.querySelector("#toast");
      t.textContent = "Napaka je zapisana. Najdeš jo v Računu pod »Prijave napak«.";
      t.hidden = false;
      t.dataset.at = Date.now();
    });
    await p.waitForTimeout(100);
    assert.deepEqual(await pokrito(p, "#toast"), [], "obvestilo prekrije kontrolnik klepeta");
    const r = await p.evaluate(() => {
      const t = document.querySelector("#toast").getBoundingClientRect();
      return { top: t.top, bottom: t.bottom, head: document.querySelector("#view-chat .chat-head").getBoundingClientRect().bottom, comp: document.querySelector("#view-chat .composer").getBoundingClientRect().top };
    });
    assert.ok(r.top >= r.head && r.bottom <= r.comp, `obvestilo je med glavo in vrstico za pisanje: ${JSON.stringify(r)}`);
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

test("računalnik 1280 × 800, klepet v oknu ob učbeniku: obvestilo ne prekrije polja in gumbov okna (okna so pod obvestilom)", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, { width: 1280, height: 800 }, false);
    await p.evaluate(() => window.evklid.showView("textbook"));
    await p.waitForSelector("#tb-q", { state: "visible" });
    await p.evaluate(() => window.evklid.openWindow("chat", { snap: "left" }));
    await p.waitForSelector(".okno #input", { state: "visible" });
    await p.waitForTimeout(300);
    await p.evaluate(() => {
      const t = document.querySelector("#toast");
      t.textContent = "Napaka je zapisana. Najdeš jo v Računu pod »Prijave napak«.";
      t.hidden = false;
      t.dataset.at = Date.now();
    });
    await p.waitForTimeout(100);
    // pokrito: vsi vidni main.view, tudi tisti v oknu (.in-okno).
    assert.deepEqual(await pokrito(p, "#toast"), [], "obvestilo prekrije polje ali gumb klepeta v oknu");
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

test("telefon 390 × 844: klepet v spodnjem listu (tap na mehurček) – obvestilo ne prekrije vrstice za pisanje lista", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, { width: 390, height: 844 });
    await p.evaluate(() => window.evklid.showView("textbook"));
    await p.waitForSelector("#chat-bubble:not([hidden])");
    await p.waitForTimeout(600);
    await p.click("#chat-bubble .cb-main");
    await p.waitForSelector("#input", { state: "visible" });
    const vListu = await p.evaluate(() => !!document.querySelector("#input").closest(".okno"));
    await p.evaluate(() => {
      const t = document.querySelector("#toast");
      t.textContent = "Shranjeno";
      t.hidden = false;
      t.dataset.at = Date.now();
    });
    await p.waitForTimeout(100);
    assert.deepEqual(await pokrito(p, "#toast"), [], `obvestilo prekrije kontrolnik (klepet v listu: ${vListu})`);
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

test("telefon 390 × 844: obvestilo brez prostega mesta – novo ostane vidno, staro se umakne, ne prekriva novega stanja (dimni test 25. 11.: PSE v listu)", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, { width: 390, height: 844 });
    await p.evaluate(() => window.evklid.showView("path"));
    await p.waitForTimeout(300);
    const mreza = () =>
      p.evaluate(() => {
        const box = document.createElement("div");
        // Kot list kalkulatorja s tabelo PSE čez ves zaslon (okno je pod obvestilom).
        box.id = "mreza";
        box.className = "okno";
        box.style.cssText = "position:fixed;inset:0;display:grid;grid-template-columns:repeat(6,1fr);gap:2px;z-index:45;width:auto;height:auto";
        for (let i = 0; i < 6 * 16; i++) box.append(Object.assign(document.createElement("button"), { textContent: String(i) }));
        document.body.append(box);
      });
    const pokazi = (besedilo) =>
      p.evaluate((b) => {
        const t = document.querySelector("#toast");
        t.textContent = b;
        t.hidden = false;
        t.dataset.at = Date.now();
      }, besedilo);
    const skrito = () => p.evaluate(() => document.querySelector("#toast").hidden);
    // Obvestilo s prostim mestom, nato stanje brez prostega mesta (list čez ves zaslon): se skrije, ne prekriva gumbov.
    await pokazi("Zahteva je zapisana");
    await p.waitForTimeout(1100);
    await mreza();
    await p.waitForTimeout(400);
    assert.equal(await skrito(), true, "staro obvestilo se umakne, ko mu novo stanje vzame ves prostor");
    // Novo obvestilo v stanju brez prostega mesta: uporabnik ga vidi (ne izgine takoj).
    await pokazi("Shranjeno");
    await p.waitForTimeout(1500);
    assert.equal(await skrito(), false, "obvestilo, ki se pokaže brez prostega mesta, ostane vidno (ne le sekundo)");
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

test("hitrost: ura, ki menja le besedilo, ne sproža iskanja mesta za mehurček in obvestilo (pregled 2)", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, { width: 390, height: 844 });
    await p.evaluate(() => window.evklid.showView("path"));
    await p.waitForTimeout(800);
    const klici = await p.evaluate(async () => {
      const ura = document.createElement("span");
      document.querySelector("main.view:not([hidden])").append(ura);
      // Počakamo, da se pogled umiri (izris poti, mesto mehurčka po menjavi pogleda) in obvestilo izgine.
      await new Promise((r) => setTimeout(r, 1500));
      await new Promise((r) => {
        const t = document.querySelector("#toast");
        const go = () => (t.hidden ? r() : setTimeout(go, 100));
        go();
      });
      await new Promise((r) => setTimeout(r, 600));
      let n = 0;
      const prej = Document.prototype.querySelectorAll;
      Document.prototype.querySelectorAll = function (sel) {
        if (String(sel).includes("[role=switch]")) n++;
        return prej.call(this, sel);
      };
      for (let i = 0; i < 10; i++) {
        ura.textContent = `0:${String(i).padStart(2, "0")}`;
        await new Promise((r) => setTimeout(r, 150));
      }
      await new Promise((r) => setTimeout(r, 300));
      Document.prototype.querySelectorAll = prej;
      return n;
    });
    assert.equal(klici, 0, "besedilo ure ne sproži postavljanja");
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});
