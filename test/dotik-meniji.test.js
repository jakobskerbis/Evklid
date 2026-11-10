// Telefon v pravem brskalniku (Playwright, če je nameščen):
// 1) grafični kalkulator piše z Evklidovo tipkovnico (ABC, 123, predloge z @, polje ne izgubi fokusa);
//    tipka 🌐 (japonščina) da polju telefonovo tipkovnico, ki ostane tudi po izgubi fokusa (#247);
// 2) dolg spustni meni se odpre čez gumb: izbrana možnost je v iskalnem okencu, seznam se začne za njo;
//    iskalnik piše z Evklidovo tipkovnico, seznam ostane odprt in nad njo.
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

const PUB = path.resolve("public");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html" };
const PAGES = {
  "/t-calc.html": `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/graph.css"><link rel="stylesheet" href="/tipkovnica.css"><div id="g" style="height:600px"></div><button id="ven" style="position:fixed;top:0;left:0;z-index:9999;width:44px;height:44px">x</button>
<script type="module">
import { createCalculator } from "/graph/calc.js";
window.calc = createCalculator(document.getElementById("g"), { t: (k) => k, icon: () => "", locale: () => "sl", storageKey: () => "t-calc", studentId: () => "", toast() {}, askTutor() {} });
window.ready = true;
</script>`,
  "/t-dd.html": `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/tipkovnica.css">
<div style="padding:120px 16px"><select id="dolg">${Array.from({ length: 30 }, (_, i) => `<option value="${i}"${i === 10 ? " selected" : ""}>Možnost ${i}</option>`).join("")}</select>
<select id="kratek"><option>Ena</option><option selected>Dve</option><option>Tri</option></select></div>
<div style="height:1200px"></div><select id="spodaj">${Array.from({ length: 30 }, (_, i) => `<option value="${i}">Jezik ${i}</option>`).join("")}</select><div style="height:400px"></div>
<script type="module">import "/dropdown.js"; import { initKeyboard } from "/tipkovnica.js"; initKeyboard(); window.ready = true;</script>`,
};

function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (PAGES[url]) return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGES[url]);
    const file = path.join(PUB, path.normalize(url));
    if (!file.startsWith(PUB) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

let browser = null;
try {
  if (playwright) browser = await playwright.chromium.launch();
} catch {}
const skip = browser ? false : "Playwright/Chromium ni nameščen";

test("touch-browser checks", { skip }, async (t) => {
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  t.after(async () => {
    await ctx.close();
    await browser.close();
    server.close();
  });

  await t.test("graphing calculator types with Evklid's keyboard; 🌐 keeps the phone keyboard for that field", async () => {
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`${base}/t-calc.html`);
    await page.waitForFunction(() => window.ready);
    const kb = "#tipkovnica";
    // tipka po napisu (brez namiga različic v kotu)
    const key = (label) => ({
      tap: async () => {
        const i = await page.evaluate((l) => [...document.querySelectorAll("#tipkovnica .tk-k")].findIndex((b) => b.firstChild?.textContent === l), label);
        assert.ok(i >= 0, `tipka ${label}`);
        await page.locator("#tipkovnica .tk-k").nth(i).tap();
        await page.waitForTimeout(20); // na dotik tipka deluje takoj po »touchend« (public/tipkovnica.js)
      },
    });
    await page.tap(".gc-input");
    await page.waitForSelector(`${kb}:not([hidden])`);
    assert.equal(await page.getAttribute(".gc-input", "inputmode"), "none", "telefonova tipkovnica se ne odpre");
    assert.equal(await page.locator(`${kb} .tk-rows`).getAttribute("data-layer"), "num", "kalkulator začne s 123");
    // ABC: črke iz naše tipkovnice, polje obdrži fokus (prej je ABC odprl telefonovo tipkovnico)
    await page.locator(`${kb} .tk-tab`, { hasText: "ABC" }).tap();
    await page.waitForSelector(`${kb} .tk-rows[data-layer="abc"]`);
    await key("y").tap();
    await page.locator(`${kb} .tk-tab`, { hasText: "123" }).tap();
    await page.waitForSelector(`${kb} .tk-rows[data-layer="num"]`);
    for (const k of ["=", "2", "x"]) await key(k).tap();
    assert.equal(await page.inputValue(".gc-input"), "y=2x");
    // predloga z @: kazalec gre v oklepaj
    await key("√").tap();
    await key("4").tap();
    assert.equal(await page.inputValue(".gc-input"), "y=2x√(4)");
    const st = await page.evaluate(() => ({ focused: document.activeElement?.classList.contains("gc-input"), inputmode: document.querySelector(".gc-input").getAttribute("inputmode"), open: !document.querySelector("#tipkovnica").hidden }));
    assert.deepEqual(st, { focused: true, inputmode: "none", open: true });
    // ⌄ skrije tipkovnico
    await page.tap(`${kb} .tk-hide`);
    await page.waitForSelector(kb, { state: "hidden" });
    assert.deepEqual(errors, []);
    await page.close();

    // Japonščina: ABC ima 🌐, ki da temu polju telefonovo tipkovnico.
    const jp = await ctx.newPage();
    jp.on("pageerror", (e) => errors.push(e.message));
    await jp.addInitScript(() => localStorage.setItem("evklid.lang", "ja"));
    await jp.goto(`${base}/t-calc.html`);
    await jp.waitForFunction(() => window.ready);
    await jp.tap(".gc-input");
    await jp.waitForSelector(`${kb}:not([hidden])`);
    await jp.locator(`${kb} .tk-tab`, { hasText: "ABC" }).tap();
    await jp.locator(`${kb} .tk-k`, { hasText: "🌐" }).tap();
    await jp.waitForTimeout(200);
    const sys = await jp.evaluate(() => {
      const f = document.querySelector(".gc-input");
      return { focused: document.activeElement === f, inputmode: f.getAttribute("inputmode"), hidden: document.querySelector("#tipkovnica").hidden };
    });
    assert.deepEqual(sys, { focused: true, inputmode: null, hidden: true });
    await jp.keyboard.type("y=2x");
    assert.equal(await jp.inputValue(".gc-input"), "y=2x");
    // Telefon polje ob odpiranju tipkovnice za hip odfokusira: naslednji dotik ne vrne naše tipkovnice.
    await jp.evaluate(() => document.querySelector(".gc-input").blur());
    await jp.waitForTimeout(100);
    await jp.tap(".gc-row .gc-main"); // vrstica z izrazom: dotik odpre urejanje
    await jp.waitForTimeout(100);
    assert.equal(await jp.evaluate(() => document.activeElement?.classList.contains("gc-input")), true, "dotik vrstice odpre urejanje");
    assert.equal(await jp.evaluate(() => document.querySelector("#tipkovnica").hidden), true, "🌐 ostane po izgubi fokusa");
    assert.equal(await jp.getAttribute(".gc-input", "inputmode"), null);
    // Dotik izven kalkulatorja konča način 🌐; naslednji dotik polja spet pokaže našo tipkovnico.
    await jp.evaluate(() => document.querySelector(".gc-input").blur());
    await jp.tap("#ven");
    await jp.tap(".gc-row .gc-main");
    await jp.waitForSelector(`${kb}:not([hidden])`);
    assert.equal(await jp.getAttribute(".gc-input", "inputmode"), "none");
    assert.deepEqual(errors, []);
    await jp.close();
  });

  await t.test("tipkovnica se zapre ob tapu zunaj polja in tipkovnice; blur, drsenje in tipke jo ne zaprejo (#247)", async () => {
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`${base}/t-calc.html`);
    await page.waitForFunction(() => window.ready);
    const kb = "#tipkovnica";
    const hidden = () => page.evaluate(() => document.querySelector("#tipkovnica").hidden);
    await page.tap(".gc-input");
    await page.waitForSelector(`${kb}:not([hidden])`);
    // izguba fokusa sama ne zapre (#247)
    await page.evaluate(() => document.querySelector(".gc-input").blur());
    await page.waitForTimeout(100);
    assert.equal(await hidden(), false, "blur ne zapre");
    // dotik tipke na tipkovnici in preklop plasti ne zapreta
    await page.locator(`${kb} .tk-tab`, { hasText: "ABC" }).tap();
    await page.waitForSelector(`${kb} .tk-rows[data-layer="abc"]`);
    await page.waitForTimeout(100);
    assert.equal(await hidden(), false, "tipka na tipkovnici ne zapre");
    // tap na polje samo ne zapre
    await page.tap(".gc-input");
    await page.waitForTimeout(100);
    assert.equal(await hidden(), false, "tap na polje ne zapre");
    // drsenje strani (premik prsta zunaj polja) ne zapre
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Input.synthesizeScrollGesture", { x: 180, y: 120, yDistance: -60, gestureSourceType: "touch" });
    await page.waitForTimeout(200);
    assert.equal(await hidden(), false, "drsenje ne zapre");
    // pravi tap zunaj zapre
    await page.tap("#ven");
    await page.waitForSelector(kb, { state: "hidden" });
    // ponovno odpiranje deluje, tap zunaj spet zapre
    await page.tap(".gc-input");
    await page.waitForSelector(`${kb}:not([hidden])`);
    await page.tap("#ven");
    await page.waitForSelector(kb, { state: "hidden" });
    assert.deepEqual(errors, []);
    await page.close();
  });

  await t.test("long dropdown opens over its button with the chosen item in the search box", async () => {
    const page = await ctx.newPage();
    await page.goto(`${base}/t-dd.html`);
    await page.waitForFunction(() => window.ready && document.querySelector(".dd-btn"));
    const btn = page.locator(".dd-btn").first();
    const b = await btn.boundingBox();
    await btn.tap();
    const list = page.locator(".dd-list");
    await list.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
    assert.ok(await list.evaluate((el) => el.classList.contains("over")));
    const input = list.locator(".dd-search input");
    assert.equal(await input.getAttribute("placeholder"), "Možnost 10");
    const ib = await input.boundingBox();
    assert.ok(Math.abs(ib.y - b.y) <= 1.5 && Math.abs(ib.x - b.x) <= 1.5 && Math.abs(ib.width - b.width) <= 1.5, `okence na mestu gumba (${ib.x},${ib.y} vs ${b.x},${b.y})`);
    // Izbrana možnost je v okencu, seznam se začne z naslednjo.
    assert.equal(await list.locator('.dd-opt[data-i="10"]').isHidden(), true);
    const firstVisible = await list.evaluate((el) => {
      const head = el.querySelector(".dd-search").getBoundingClientRect().bottom;
      return [...el.querySelectorAll(".dd-opt")].find((o) => !o.hidden && o.getBoundingClientRect().top >= head - 1)?.textContent;
    });
    assert.equal(firstVisible, "Možnost 11");
    // Tik pod okencem ni odrezane prejšnje vrstice.
    const underHead = await list.evaluate((el) => {
      const h = el.querySelector(".dd-search").getBoundingClientRect();
      return document.elementFromPoint(h.left + 30, h.bottom + 2)?.closest(".dd-opt")?.textContent;
    });
    assert.equal(underHead, "Možnost 11");
    // Iskanje najde tudi izbrano možnost.
    await input.fill("10");
    assert.equal(await list.locator('.dd-opt[data-i="10"]').isVisible(), true);
    await list.locator('.dd-opt[data-i="10"]').tap();
    assert.equal(await page.locator(".dd-list").count(), 0);
    assert.equal(await page.$eval("#dolg", (s) => s.value), "10");
    // Izbira druge možnosti.
    await btn.tap();
    await page.locator(".dd-search input").fill("2");
    await page.locator('.dd-opt[data-i="25"]').tap();
    assert.equal(await page.$eval("#dolg", (s) => s.value), "25");
  });

  await t.test("dropdown search types with Evklid's keyboard, never the phone's", async () => {
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`${base}/t-dd.html`);
    await page.waitForFunction(() => window.ready && document.querySelectorAll(".dd-btn").length === 3);
    const kb = "#tipkovnica";
    for (const which of [0, 2]) {
      const btn = page.locator(".dd-btn").nth(which);
      await btn.scrollIntoViewIfNeeded();
      if (which === 2) await page.evaluate(() => scrollBy(0, 300)); // gumb nizko na zaslonu
      await btn.tap();
      const input = page.locator(".dd-search input");
      assert.equal(await input.getAttribute("data-system-kb"), null);
      await input.tap();
      await page.waitForSelector(`${kb}:not([hidden])`);
      assert.equal(await input.getAttribute("inputmode"), "none", "telefonova tipkovnica se ne odpre");
      const i = await page.evaluate(() => [...document.querySelectorAll("#tipkovnica .tk-k")].findIndex((b) => b.firstChild?.textContent.toLowerCase() === "z"));
      assert.ok(i >= 0, "tipka z");
      await page.locator(`${kb} .tk-k`).nth(i).tap();
      await page.waitForTimeout(20);
      assert.equal((await input.inputValue()).toLowerCase(), "z");
      assert.equal(await page.locator(".dd-list").count(), 1, "tipka ne zapre seznama");
      // Iskalnik in seznam sta nad tipkovnico.
      const [top, sb, lb] = await page.evaluate(() => [
        document.getElementById("tipkovnica").getBoundingClientRect().top,
        document.querySelector(".dd-search input").getBoundingClientRect().bottom,
        document.querySelector(".dd-list").getBoundingClientRect().bottom,
      ]);
      assert.ok(sb <= top && lb <= top + 1, `nad tipkovnico (${sb}, ${lb} vs ${top})`);
      const opt = page.locator(".dd-opt:not([hidden])").first();
      const v = which === 2 ? await opt.getAttribute("data-i") : null;
      await opt.tap();
      assert.equal(await page.locator(".dd-list").count(), 0);
      await page.waitForSelector(kb, { state: "hidden" });
      if (which === 2) assert.equal(await page.$eval("#spodaj", (s) => s.value), v);
    }
    assert.deepEqual(errors, []);
    await page.close();
  });

  await t.test("short dropdown stays a plain list under the button", async () => {
    const page = await ctx.newPage();
    await page.goto(`${base}/t-dd.html`);
    await page.waitForFunction(() => window.ready && document.querySelectorAll(".dd-btn").length === 3);
    await page.locator(".dd-btn").nth(1).tap();
    const list = page.locator(".dd-list");
    assert.equal(await list.locator(".dd-search").count(), 0);
    assert.equal(await list.evaluate((el) => el.classList.contains("over")), false);
    assert.equal(await list.locator(".dd-opt").count(), 3);
  });
});
