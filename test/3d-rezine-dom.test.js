// »Pravi prerez telesa« v pravem brskalniku (Playwright, če je nameščen), telefon 360 × 740 na strani /3d z vzorcem iz
// repozitorija: lepljivi drsnik ostane na vrhu plošče, ko se ta podrsa, preliv pod njim ne zatemni gradnika pod njim,
// dolg pritisk na + ponavlja korak in klik ob spustu ne doda še enega, OŠ gumba nimata »mm«, na odru ni namiga.
// Vedenje (DOM), ne besedilo kode: test/3d-rezine.test.js preveri pomožne funkcije.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

let browser = null;
try {
  // WebGL brez grafične kartice (CI): programski izris
  if (playwright) browser = await playwright.chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
} catch {}
const skip = browser ? false : "Playwright/Chromium ni nameščen";

let server = null, base = "";
test.before(async () => {
  if (!browser) return;
  const { createApp } = await import("../server/app.js");
  const { openDb } = await import("../server/db.js");
  server = createApp(openDb(":memory:")).listen(0);
  await new Promise((ok) => server.once("listening", ok));
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(async () => {
  await browser?.close();
  server?.close();
});

async function odpri() {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true, reducedMotion: "reduce", locale: "sl-SI" });
  await ctx.addInitScript(() => {
    try { localStorage.setItem("evklid.lang", "sl"); } catch {}
  });
  const page = await ctx.newPage();
  const napake = [];
  page.on("pageerror", (e) => napake.push(String(e.message)));
  await page.goto(`${base}/3d#organ-pravi-prerez`);
  await page.waitForSelector(".k3-lepljivo .k3-drsnik:not([hidden]) input[type=range]", { state: "visible", timeout: 60000 });
  await page.waitForFunction(() => !document.querySelector(".k3-nalaganje"), null, { timeout: 60000 });
  return { ctx, page, napake };
}

test("pravi prerez (telefon): lepljivi drsnik ostane na vrhu plošče, preliv samo v razmiku, OŠ brez mm, brez namiga", { skip, timeout: 120000 }, async () => {
  const { ctx, page, napake } = await odpri();
  try {
    const r = await page.evaluate(async () => {
      const lep = document.querySelector(".k3-lepljivo");
      const plosca = lep.parentElement;
      // plošča mora drseti: pod lepljivim drsnikom dodamo visok prazen gradnik, če vsebine ni dovolj
      if (plosca.scrollHeight <= plosca.clientHeight + 40) {
        const d = document.createElement("div");
        d.style.height = "900px";
        plosca.append(d);
      }
      const pred = lep.getBoundingClientRect().top - plosca.getBoundingClientRect().top;
      plosca.scrollTop = plosca.scrollHeight;
      await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
      const pr = plosca.getBoundingClientRect(), lr = lep.getBoundingClientRect();
      const dr = [...lep.querySelectorAll(".k3-drsnik")].find((e) => !e.hidden); // vidni drsnik (smer prereza)
      const inp = dr.querySelector("input[type=range]").getBoundingClientRect();
      // preliv (::after) in razmik do naslednjega gradnika
      const after = getComputedStyle(lep, "::after");
      const gap = parseFloat(getComputedStyle(plosca).rowGap);
      const gumbi = [...dr.querySelectorAll(".k3-drsnik-gumb")].map((b) => [b.getAttribute("aria-label"), b.title]);
      return {
        drsi: plosca.scrollTop > 0, pred, vrh: lr.top - pr.top, drsnikViden: inp.top >= pr.top && inp.bottom <= pr.bottom,
        poz: getComputedStyle(lep).position, visinaPreliva: parseFloat(after.height), gap, gumbi,
        napis: dr.querySelector(".k3-drsnik-vrh > span")?.textContent, izpis: dr.querySelector("output")?.textContent,
        namig: !!document.querySelector(".k3-oder-ovoj .k3-namig"),
      };
    });
    assert.equal(r.poz, "sticky");
    assert.ok(r.drsi, "plošča se je podrsala");
    assert.ok(Math.abs(r.vrh - r.pred) <= 2, `drsnik je ostal na vrhu plošče (${r.pred} → ${r.vrh} px)`);
    assert.ok(r.drsnikViden, "drsnik je viden v plošči");
    assert.ok(r.visinaPreliva > 0 && r.visinaPreliva <= r.gap, `preliv ${r.visinaPreliva} px ≤ razmik ${r.gap} px`);
    assert.equal(r.gumbi.length, 2);
    for (const [aria, title] of r.gumbi) {
      assert.ok(aria && title, "gumb ima ime");
      assert.doesNotMatch(`${aria} ${title}`, /mm|\d/, "OŠ: gumb brez milimetrov");
    }
    assert.equal(r.napis, "Lega rezine");
    assert.doesNotMatch(r.izpis, /\d|mm|Th/, "OŠ: lega brez številk");
    assert.ok(!r.namig, "na odru ni namiga, ki bi prekril rezino");
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
  }
});

test("pravi prerez: dolg pritisk na + ponavlja korak, spust ga ustavi, klik ob spustu ne doda koraka", { skip, timeout: 120000 }, async () => {
  const { ctx, page, napake } = await odpri();
  try {
    const vrednost = () => page.evaluate(() => Number(document.querySelector(".k3-lepljivo .k3-drsnik:not([hidden]) input[type=range]").value));
    const plus = page.locator(".k3-lepljivo .k3-drsnik:not([hidden]) .k3-drsnik-gumb").nth(1);
    const b = await plus.boundingBox();
    const v0 = await vrednost();
    // en klik (tap) = en korak
    await plus.click();
    assert.equal(await vrednost(), v0 + 1, "klik doda en korak");
    // dolg pritisk: ponavljanje po zamiku
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(300);
    assert.equal(await vrednost(), v0 + 1, "pred zamikom ni ponavljanja");
    await page.waitForTimeout(900);
    const med = await vrednost();
    assert.ok(med - (v0 + 1) >= 4, `dolg pritisk ponavlja korak (${med - v0 - 1} korakov)`);
    await page.mouse.up(); // spust sproži še »click«
    const poSpustu = await vrednost();
    assert.ok(poSpustu - med <= 1, "spust ustavi ponavljanje");
    await page.waitForTimeout(400);
    assert.equal(await vrednost(), poSpustu, "po spustu se vrednost ne spreminja več");
    // klik, ki konča dolg pritisk (pointerup in click takoj za njim), ne doda koraka
    const r = await page.evaluate(async () => {
      const gumb = document.querySelectorAll(".k3-lepljivo .k3-drsnik:not([hidden]) .k3-drsnik-gumb")[1];
      const inp = document.querySelector(".k3-lepljivo .k3-drsnik:not([hidden]) input[type=range]");
      const st = Number(inp.value);
      gumb.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0, pointerType: "touch" }));
      await new Promise((ok) => setTimeout(ok, 700));
      const predSpustom = Number(inp.value);
      gumb.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, button: 0, pointerType: "touch" }));
      gumb.click();
      await new Promise((ok) => setTimeout(ok, 300));
      return { st, predSpustom, po: Number(inp.value) };
    });
    assert.ok(r.predSpustom > r.st, "ponavljanje je teklo");
    assert.equal(r.po, r.predSpustom, "klik ob koncu dolgega pritiska ne doda koraka");
    // − nazaj in meja: na 0 ostane 0
    await page.evaluate(() => {
      const inp = document.querySelector(".k3-lepljivo .k3-drsnik:not([hidden]) input[type=range]");
      inp.value = 0;
      inp.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.locator(".k3-lepljivo .k3-drsnik:not([hidden]) .k3-drsnik-gumb").nth(0).click();
    assert.equal(await vrednost(), 0, "− ne gre pod najmanjšo vrednost");
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
  }
});
