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

// Med pisanjem je klepet ležeče ozek (tipkovnica desno): glava ostane ena vrstica in orodja niso pod tipkovnico
// (prej 844/740: oznake odrezane »Matematika · Voden«, gumbi pod tipkami; 640 × 360: glava tri vrstice, 130 px).
for (const v of [L, { width: 740, height: 360 }, { width: 640, height: 360 }]) {
  test(`ležeč telefon ${v.width} × ${v.height}: med pisanjem je glava klepeta ena vrstica, orodja levo od tipkovnice`, opts, async () => {
    await withApp(async (base) => {
      const { ctx, p, errors } = await phone(base, v);
      await p.locator("#input").tap();
      await p.waitForSelector(".tk:not([hidden])");
      await p.waitForTimeout(300);
      const m = await p.evaluate(() => {
        const tk = document.querySelector(".tk:not([hidden])").getBoundingClientRect();
        const glava = document.querySelector("#view-chat .chat-head");
        const gumbi = [...glava.querySelectorAll("button")].filter((b) => b.checkVisibility()).map((b) => {
          const r = b.getBoundingClientRect();
          const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          return { id: b.id || b.className, desno: Math.round(r.right), tapljiv: !!top && (b === top || b.contains(top)) };
        });
        return { tk: Math.round(tk.left), glava: Math.round(glava.getBoundingClientRect().height), gumbi };
      });
      assert.ok(m.glava <= 60, `glava v eni vrstici (${m.glava} px)`);
      for (const g of m.gumbi) assert.ok(g.desno <= m.tk + 1 && g.tapljiv, `gumb glave ni pod tipkovnico: ${JSON.stringify(g)} (tipkovnica od ${m.tk} px)`);
      // Dolgo vprašanje ne vzame sporočil: polje za pisanje je visoko največ tri vrstice (72 px).
      await p.evaluate(() => {
        const i = document.querySelector("#input");
        i.value = "vrstica\n".repeat(12);
        i.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await p.waitForTimeout(200);
      const h = await p.evaluate(() => Math.round(document.querySelector("#input").getBoundingClientRect().height));
      assert.ok(h <= 72, `polje za pisanje največ 72 px (${h} px)`);
      assert.deepEqual(errors, []);
      await ctx.close();
    });
  });
}

test("ležeč telefon 844 × 390: obvestilo med pisanjem je vidno levo od tipkovnice", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, L);
    await p.locator("#input").tap();
    await p.waitForSelector(".tk:not([hidden])");
    await p.evaluate(() => {
      const t = document.querySelector("#toast");
      t.textContent = "Napaka je zapisana. Najdeš jo v Računu pod »Prijave napak«.";
      t.hidden = false;
      t.dataset.at = Date.now();
    });
    await p.waitForTimeout(400);
    const m = await p.evaluate(() => {
      const t = document.querySelector("#toast");
      const r = t.getBoundingClientRect();
      const tk = document.querySelector(".tk:not([hidden])").getBoundingClientRect();
      return { skrito: t.hidden, levo: Math.round(r.left), desno: Math.round(r.right), vrh: Math.round(r.top), dno: Math.round(r.bottom), tk: Math.round(tk.left), h: innerHeight };
    });
    assert.ok(!m.skrito && m.levo >= 0 && m.desno <= m.tk + 1 && m.vrh >= 0 && m.dno <= m.h, `obvestilo vidno levo od tipkovnice: ${JSON.stringify(m)}`);
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

// Najnižji ležeč telefon (640 × 360): plošča je višja od zaslona; s flex-end je bil zgornji del (čipi) odrezan in nedosegljiv.
test("ležeč telefon 640 × 360: vse plasti tipkovnice so cele na zaslonu", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, { width: 640, height: 360 });
    await p.locator("#input").tap();
    await p.waitForSelector(".tk:not([hidden])");
    const n = await p.locator(".tk:not([hidden]) .tk-tab").count();
    for (let i = 0; i < n; i++) {
      await p.locator(".tk:not([hidden]) .tk-tab").nth(i).click();
      await p.waitForTimeout(200);
      const m = await p.evaluate(() => {
        const tk = document.querySelector(".tk:not([hidden])");
        const tipke = [...tk.querySelectorAll(".tk-in > *, .tk-k, .tk-chip")].filter((e) => e.checkVisibility()).map((e) => e.getBoundingClientRect());
        return { plast: tk.querySelector(".tk-tab.on")?.textContent, vrh: Math.round(Math.min(...tipke.map((r) => r.top))), dno: Math.round(Math.max(...tipke.map((r) => r.bottom))), h: innerHeight };
      });
      assert.ok(m.vrh >= 0 && m.dno <= m.h, `plast cela na zaslonu: ${JSON.stringify(m)}`);
    }
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

// Klepet 630–699 px (okno računalnika 900–969 px s seznamom pogovorov, tablica): oznake gredo v svojo vrstico. Prej je
// kasnejše splošno pravilo (.chat-head #chat-state { flex: 1 1 auto }) povozilo pravilo poizvedbe (flex: 1 1 100%),
// oznake so ostale ob naslovu in naslov se je stisnil na 9–43 px (»K«).
for (const w of [900, 960]) {
  test(`računalnik ${w} × 800: ozek klepet ima oznake pod naslovom, naslov ni stisnjen`, opts, async () => {
    await withApp(async (base) => {
      const { ctx, p, errors } = await phone(base, { width: w, height: 800 }, false);
      const m = await p.evaluate(() => {
        const r = (s) => document.querySelector(s).getBoundingClientRect();
        return { chat: Math.round(r("#view-chat .chat").width), naslov: Math.round(r("#chat-title").width), naslovDno: Math.round(r("#chat-title").bottom), oznakeVrh: Math.round(r("#chat-state").top) };
      });
      assert.ok(m.chat < 700, `klepet ožji od 700 px: ${JSON.stringify(m)}`);
      assert.ok(m.oznakeVrh >= m.naslovDno, `oznake v vrstici pod naslovom: ${JSON.stringify(m)}`);
      assert.ok(m.naslov >= 120, `naslov ni stisnjen: ${JSON.stringify(m)}`);
      assert.deepEqual(errors, []);
      await ctx.close();
    });
  });
}

// Modalno okno (<dialog>: ustno spraševanje, kviz) vzame tipkovnico vase (tipkovnica.js). Ležeče je bilo okno na sredini
// zaslona, tipkovnica desno pa je prekrila njegovo desno polovico (polje in gumb »Začni« do pol pod tipkami).
test("ležeč telefon 844 × 390: okno ustnega spraševanja je levo od tipkovnice", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, L);
    await p.click("#view-chat .chat-head [data-ustno]");
    await p.waitForSelector("dialog[open] .us-body input[name=q]");
    await p.locator("dialog[open] input[name=q]").tap();
    await p.waitForSelector("dialog[open] > .tk:not([hidden])");
    await p.waitForTimeout(300);
    const m = await p.evaluate(() => {
      const tk = document.querySelector("dialog[open] > .tk").getBoundingClientRect();
      const okno = document.querySelector("dialog[open]").getBoundingClientRect();
      const polje = document.querySelector("dialog[open] input[name=q]").getBoundingClientRect();
      const top = document.elementFromPoint(polje.right - 6, polje.top + polje.height / 2);
      return { tk: Math.round(tk.left), okno: [Math.round(okno.left), Math.round(okno.right)], polje: Math.round(polje.right), tapljivo: top?.name === "q" };
    });
    assert.ok(m.okno[0] >= 0 && m.okno[1] <= m.tk + 1 && m.tapljivo, `okno levo od tipkovnice, polje tapljivo do desnega roba: ${JSON.stringify(m)}`);
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

// Klepet kot spodnji list (mehurček nad učbenikom): list je bil čez vso širino, tipkovnica desno je prekrila polje za
// pisanje in »Pošlji« (polje 375–682 px, tipkovnica od 371 px).
test("ležeč telefon 844 × 390: klepet v spodnjem listu ima polje in »Pošlji« levo od tipkovnice", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, L);
    await p.evaluate(() => window.evklid.showView("textbook"));
    await p.waitForSelector("#chat-bubble:not([hidden])");
    await p.waitForTimeout(600);
    await p.click("#chat-bubble .cb-main");
    await p.waitForSelector(".okno-sheet #input", { state: "visible" });
    await p.locator("#input").tap();
    await p.waitForSelector(".tk:not([hidden])");
    await p.waitForTimeout(400);
    const m = await p.evaluate(() => {
      const tk = document.querySelector(".tk:not([hidden])").getBoundingClientRect();
      const tapljiv = (s) => {
        const e = document.querySelector(s);
        const r = e.getBoundingClientRect();
        const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return { desno: Math.round(r.right), tapljiv: !!top && (e === top || e.contains(top)) };
      };
      return { tk: Math.round(tk.left), polje: tapljiv("#input"), poslji: tapljiv("#send") };
    });
    for (const k of ["polje", "poslji"]) assert.ok(m[k].tapljiv && m[k].desno <= m.tk + 1, `${k} levo od tipkovnice in tapljiv: ${JSON.stringify(m)}`);
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

// Med pisanjem je klepet ležeče širok le 280–370 px, vrstica za pisanje pa je imela računalniški »Pošlji« z napisom
// (95 px): prazno polje je ostalo 106 px široko (na telefonu pokončno 168–198 px).
test("ležeč telefon 844 × 390: med pisanjem je »Pošlji« samo ikona, polje za pisanje ni stisnjeno", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await phone(base, L);
    await p.locator("#input").tap();
    await p.waitForSelector(".tk:not([hidden])");
    await p.waitForTimeout(400);
    const m = await p.evaluate(() => ({
      poslji: Math.round(document.querySelector("#send").getBoundingClientRect().width),
      polje: Math.round(document.querySelector("#input").getBoundingClientRect().width),
    }));
    assert.ok(m.poslji <= 48 && m.polje >= 150, `»Pošlji« z ikono, polje vsaj 150 px: ${JSON.stringify(m)}`);
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});
