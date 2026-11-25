// Ležeč telefon in ohranjanje stanja (UX PR 2, docs/NACRT-UX-UI.md): klepet ostane na dnu ob obratu, kazalo učbenika
// ohrani položaj ob navigaciji, na nizkem zaslonu je glava klepeta v eni vrstici, prijava napake ne podaljša strani,
// Evklidova tipkovnica stoji ob strani in ne prekrije naloge; na iPadu pokončno so oznake klepeta cele (UX-100–102, 106).
// Vsak preizkus v brskalniku pade na stari različici.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
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

const P = { width: 390, height: 844 };
const L = { width: 844, height: 390 };
const obrni = async (p, v) => {
  await p.setViewportSize(v);
  await p.waitForTimeout(800);
};
const doDna = (p) => p.evaluate(() => { const m = document.querySelector("#messages"); return Math.round(m.scrollHeight - m.clientHeight - m.scrollTop); });

test("obrat: klepet na dnu ostane na dnu (pokončno → ležeče → pokončno)", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, P);
    for (const q of ["Razloži podrobneje", "Še en primer", "In še enega"]) {
      await p.fill("#input", q);
      await p.click("#send");
      await p.waitForTimeout(500);
    }
    await p.waitForTimeout(500);
    assert.ok((await doDna(p)) <= 8, "pred obratom na dnu");
    await obrni(p, L);
    assert.ok((await doDna(p)) <= 8, `po obratu na dnu (${await doDna(p)} px do dna)`);
    await obrni(p, P);
    assert.ok((await doDna(p)) <= 8, "po vrnitvi na dnu");
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

// Kratek pogovor gre pokončno cel na zaslon (brez drsenja), ležeče pa ne: odgovor je ostal skrit pod vrstico za pisanje.
test("obrat: kratek pogovor, ki pokončno ne drsi, po obratu pokaže zadnje sporočilo", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, P);
    await p.waitForTimeout(500);
    const prej = await p.evaluate(() => { const m = document.querySelector("#messages"); return { st: m.scrollTop, dno: m.scrollHeight - m.clientHeight - m.scrollTop }; });
    assert.ok(prej.st === 0 && prej.dno <= 1, `pokončno pogovor ne drsi (${JSON.stringify(prej)})`);
    await obrni(p, L);
    const vec = await p.evaluate(() => { const m = document.querySelector("#messages"); return m.scrollHeight - m.clientHeight; });
    assert.ok(vec > 20, `ležeče pogovor drsi (${vec} px), sicer preizkus nič ne pove`);
    assert.ok((await doDna(p)) <= 8, `po obratu na dnu (${await doDna(p)} px do dna)`);
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

test("navigacija: kazalo učbenika ohrani položaj (drugi zavihek in nazaj, lekcija in nazaj)", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, P);
    await p.evaluate(() => window.evklid.showView("textbook"));
    await p.waitForSelector("#tb-body .tb-topic:not(.pending)");
    const y0 = await p.evaluate(() => {
      const b = document.querySelector("#view-textbook");
      b.scrollTop = Math.min(600, b.scrollHeight - b.clientHeight - 10);
      return b.scrollTop;
    });
    assert.ok(y0 > 200, `kazalo je dovolj dolgo za preizkus (${y0})`);
    await p.waitForTimeout(300);
    await p.evaluate(() => window.evklid.showView("path"));
    await p.waitForTimeout(400);
    await p.evaluate(() => window.evklid.showView("textbook"));
    await p.waitForSelector("#tb-body .tb-topic:not(.pending)");
    await p.waitForTimeout(300);
    const y1 = await p.evaluate(() => document.querySelector("#view-textbook").scrollTop);
    assert.ok(Math.abs(y1 - y0) <= 2, `po vrnitvi z drugega zavihka ${y1}, prej ${y0}`);
    // Lekcija, ki je vidna na tem mestu, in »← Nazaj« v kazalo.
    const lesson = p.locator("#tb-body .tb-topic:not(.pending)").filter({ visible: true }).first();
    await lesson.click();
    await p.waitForSelector("#view-textbook .tb-title");
    await p.click("#tb-back");
    await p.waitForSelector("#tb-body .tb-topic:not(.pending)");
    await p.waitForTimeout(300);
    const y2 = await p.evaluate(() => document.querySelector("#view-textbook").scrollTop);
    assert.ok(Math.abs(y2 - y0) <= 2, `po »Nazaj« iz lekcije ${y2}, prej ${y0}`);
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

test("ležeč telefon 740 × 360: glava klepeta v eni vrstici, prijava napake ne podaljša strani, sporočila ostanejo vidna", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, { width: 740, height: 360 });
    const mere = () =>
      p.evaluate(() => ({
        doc: document.documentElement.scrollHeight - innerHeight,
        glava: Math.round(document.querySelector("#view-chat .chat-head").getBoundingClientRect().height),
        sporocila: Math.round(document.querySelector("#messages").clientHeight),
      }));
    let m = await mere();
    assert.ok(m.glava <= 60, `glava v eni vrstici (${m.glava} px)`);
    await p.evaluate(() => {
      const b = document.querySelector("#chat-bug");
      b.hidden = false; // prijavo vidita skrbnik in član pilota
      b.click();
    });
    await p.waitForSelector("#view-chat .bug-box textarea");
    m = await mere();
    assert.ok(m.doc <= 1, `stran ni višja od zaslona (${m.doc} px)`);
    assert.ok(m.sporocila >= 80, `sporočila ostanejo vidna (${m.sporocila} px)`);
    // Gumb Pošlji je viden in ga je mogoče tapniti brez drsenja.
    const send = await p.evaluate(() => {
      const r = document.querySelector("#view-chat .bug-box .rep-send").getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return r.bottom <= innerHeight && !!top?.closest(".rep-send");
    });
    assert.ok(send, "»Pošlji prijavo« je viden");
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

test("ležeč telefon 844 × 390: Evklidova tipkovnica stoji desno, naloga in polje za odgovor ostaneta vidna", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, L);
    await p.evaluate(() => window.evklid.showView("path"));
    await p.click("#xp-card .next-row[data-open]");
    await p.waitForSelector("#view-topic .topic-head, #view-topic #practice .task");
    // Test predznanja ali vaja: prva naloga s poljem za odgovor (tipkovnica se odpre ob dotiku polja).
    for (let i = 0; i < 8 && !(await p.locator("#answer").isVisible()); i++) {
      for (const s of ["#pt-practice", "#t-practice", "#ex-next", "#p-skip"])
        if (await p.locator(s).isVisible()) {
          await p.click(s, { timeout: 4000 });
          break;
        }
      await p.waitForTimeout(500);
    }
    await p.locator("#answer").tap();
    await p.waitForSelector(".tk:not([hidden])");
    await p.waitForTimeout(400);
    const m = await p.evaluate(() => {
      const tk = document.querySelector(".tk:not([hidden])").getBoundingClientRect();
      const pod = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const top = document.elementFromPoint(r.left + Math.min(20, r.width / 2), r.top + Math.min(10, r.height / 2));
        return { vidno: r.bottom > 0 && r.top < innerHeight && !!top && (el.contains(top) || top.contains(el)), desno: r.right <= tk.left + 1 };
      };
      return { tk: { left: Math.round(tk.left), top: Math.round(tk.top), w: Math.round(tk.width), h: Math.round(tk.height) }, odgovor: pod("#answer"), doc: document.documentElement.scrollHeight - innerHeight, vw: innerWidth };
    });
    assert.ok(m.tk.left > m.vw * 0.3 && m.tk.top <= 1, `tipkovnica ob desnem robu čez vso višino: ${JSON.stringify(m.tk)}`);
    assert.ok(m.odgovor?.vidno && m.odgovor.desno, `polje za odgovor je vidno levo od tipkovnice: ${JSON.stringify(m.odgovor)}`);
    assert.ok(m.doc <= 1, "stran ni višja od zaslona");
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

// RTL (arabščina): tipkovnica je desno kot v LTR, zato se tudi zaslon umakne levo (padding-inline-end bi odmaknil levo stran).
test("ležeč telefon 844 × 390, RTL: polje za odgovor je levo od tipkovnice, ne pod njo", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, L);
    await p.evaluate(() => (document.documentElement.dir = "rtl"));
    await p.evaluate(() => window.evklid.showView("path"));
    await p.click("#xp-card .next-row[data-open]");
    await p.waitForSelector("#view-topic .topic-head, #view-topic #practice .task");
    for (let i = 0; i < 8 && !(await p.locator("#answer").isVisible()); i++) {
      for (const s of ["#pt-practice", "#t-practice", "#ex-next", "#p-skip"])
        if (await p.locator(s).isVisible()) {
          await p.click(s, { timeout: 4000 });
          break;
        }
      await p.waitForTimeout(500);
    }
    await p.locator("#answer").tap();
    await p.waitForSelector(".tk:not([hidden])");
    await p.waitForTimeout(400);
    const m = await p.evaluate(() => {
      const tk = document.querySelector(".tk:not([hidden])").getBoundingClientRect();
      const a = document.querySelector("#answer").getBoundingClientRect();
      return { tk: Math.round(tk.left), odgovor: Math.round(a.right) };
    });
    assert.ok(m.odgovor <= m.tk + 1, `polje za odgovor levo od tipkovnice: ${JSON.stringify(m)}`);
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

// Dolg vnos v klepetu odpre okno s celim besedilom (razpri.js): ležeče z odprto tipkovnico je levo od nje, × je tapljiv.
test("ležeč telefon 844 × 390: okno z dolgim vnosom ni pod tipkovnico", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, L);
    await p.locator("#input").tap();
    await p.waitForSelector(".tk:not([hidden])");
    await p.evaluate(() => {
      const i = document.querySelector("#input");
      i.value = "Dolgo vprašanje o enačbah in funkcijah, ki ga je učenec prilepil iz poskusa. ".repeat(8);
      i.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await p.waitForSelector(".razpri");
    await p.waitForTimeout(300);
    const m = await p.evaluate(() => {
      const tk = document.querySelector(".tk:not([hidden])").getBoundingClientRect();
      const r = document.querySelector(".razpri").getBoundingClientRect();
      const x = document.querySelector(".razpri .razpri-x").getBoundingClientRect();
      const top = document.elementFromPoint(x.left + x.width / 2, x.top + x.height / 2);
      return { tk: Math.round(tk.left), okno: [Math.round(r.left), Math.round(r.right)], x: !!top?.closest(".razpri-x") };
    });
    assert.ok(m.okno[0] >= 0 && m.okno[1] <= m.tk + 1 && m.x, `okno levo od tipkovnice, × tapljiv: ${JSON.stringify(m)}`);
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

test("iPad 820 × 1180 pokončno: oznake klepeta so cele in izbira načina je tapljiva (UX-102)", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, { width: 820, height: 1180 });
    const slabe = await p.evaluate(() =>
      [...document.querySelectorAll("#chat-state .chip-pick .dd-btn")]
        .filter((e) => e.checkVisibility())
        .filter((e) => {
          const r = e.getBoundingClientRect();
          const top = document.elementFromPoint(r.left + 4, r.top + r.height / 2);
          return !top || !(e.contains(top) || top.contains(e)) || e.scrollWidth > e.clientWidth + 1;
        })
        .map((e) => e.textContent.trim()),
    );
    assert.deepEqual(slabe, [], "odrezane ali prekrite oznake");
    await p.click('#chat-state .chip-pick:has(select[data-pick="mode"]) .dd-btn', { timeout: 4000 });
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});
