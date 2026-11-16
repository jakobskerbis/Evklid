// Evklidova tipkovnica brez zatikanja (j, 4. 11.: »tipkovnica is feeling too clunky«):
// 1) pritisk tipke ne pregleda in ne preračuna vse strani (drsniki.js samo v tipkovnici, brez »:has« na plošči/telu);
// 2) ⇧ zamenja napise na mestu (iste tipke, brez ponovnega risanja plošče);
// 3) vse plasti (ABC, 123, f(x), Σ, Kem) so enako visoke, zato stran ob menjavi ne poskoči; pri izklopljenih
//    predlogih ni praznega pasu nad zavihki.
import test, { before } from "node:test";
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
const css = (f) => fs.readFileSync(path.join(PUB, f), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

test("no page-wide :has rules that re-run on every key press", () => {
  assert.doesNotMatch(css("tipkovnica.css"), /\.tk:has\(/, "plošča: razred tk-abc namesto :has");
  assert.doesNotMatch(css("ui.css"), /body:has\(> #boot-down\)/, "boot-down: razred na <body>");
  assert.match(fs.readFileSync(path.join(PUB, "app.js"), "utf8"), /classList\.add\("boot-down-on"\)/);
});

const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html" };
const PAGE = `<!doctype html><html lang="sl"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/drsniki.css"><link rel="stylesheet" href="/tipkovnica.css">
<div class="chip-row" style="display:flex;overflow-x:auto;width:200px">${"<span style='flex:none;width:80px'>x</span>".repeat(6)}</div>
<textarea id="t" style="width:300px"></textarea><div style="height:900px"></div>
<script type="module">
import { initDrsniki } from "/drsniki.js";
import { initKeyboard, configureKeyboard } from "/tipkovnica.js";
initDrsniki();
initKeyboard();
configureKeyboard(document.getElementById("t"), { layers: ["abc", "num", "fx", "sym", "kem"], start: "abc", enter: "send" });
// štejemo preglede vse strani (drsniki.js kliče document.querySelectorAll s seznamom drsnih vrstic)
window.full = 0;
const qsa = Document.prototype.querySelectorAll;
Document.prototype.querySelectorAll = function (s) {
  if (String(s).includes(".katex-display")) window.full++;
  return qsa.call(this, s);
};
window.ready = true;
</script>`;

// polje z dolgo vrstico predlog nad zavihki (kot Inštruktor)
const PAGE_CHIPS = `<!doctype html><html lang="sl"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/tipkovnica.css">
<input id="v" style="width:300px">
<script type="module">
import { initKeyboard, configureKeyboard } from "/tipkovnica.js";
initKeyboard();
configureKeyboard(document.getElementById("v"), { layers: ["abc", "num", "fx", "sym"], start: "abc", ctx: ["a/b", "x", "xⁿ", "√", "aₙ", "∫", "Σ", "π", "→", "≤", "≥", "≠", "·", "°", "∞", "±"].map((l) => [l, l]) });
window.ready = true;
</script>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    if (url === "/v.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE_CHIPS);
    const file = path.join(PUB, path.normalize(url));
    if (!file.startsWith(PUB) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

// Brskalnik se zažene v before(): vsi testi se registrirajo sinhrono (sicer jih --test-force-exit izpusti).
let browser = null;
before(async () => {
  try {
    if (playwright) browser = await playwright.chromium.launch();
  } catch {}
});
test.after(() => browser?.close());

for (const [name, opts] of [
  ["phone", { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true }],
  ["tablet", { viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true }],
  ["desktop", { viewport: { width: 1280, height: 800 } }],
]) {
  test(`keyboard stays light and the same height (${name})`, async (t) => {
    if (!browser) return t.skip("Playwright/Chromium ni nameščen");
    const server = await serve();
    const ctx = await browser.newContext({ ...opts, locale: "sl-SI" });
    t.after(async () => {
      await ctx.close();
      server.close();
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/t.html`);
    await page.waitForFunction(() => window.ready);
    const touch = !!opts.hasTouch;
    if (touch) await page.tap("#t");
    else {
      await page.click("#t");
      await page.evaluate(async () => (await import("/tipkovnica.js")).openKeyboard(document.getElementById("t")));
    }
    await page.waitForSelector("#tipkovnica:not([hidden])");
    await page.waitForTimeout(200);
    const press = async (sel) => {
      const loc = page.locator(sel).first();
      if (touch) await loc.tap();
      else await loc.click();
      await page.waitForTimeout(40);
    };
    const letter = (c) => `#tipkovnica .tk-rows .tk-k:text-is("${c}")`;

    // velika začetnica, nato male črke: iste tipke (napis zamenjan na mestu)
    assert.equal(await page.locator("#tipkovnica .tk-k.shift.on").count(), 1, "⇧ na začetku stavka");
    await page.evaluate(() => (document.querySelector("#tipkovnica .tk-rows button").dataset.mark = "1"));
    const before = await page.evaluate(() => window.full);
    await press(letter("A"));
    await press(letter("n"));
    await press(letter("a"));
    assert.equal(await page.inputValue("#t"), "Ana");
    assert.equal(await page.locator("#tipkovnica .tk-k.shift.on").count(), 0, "⇧ ugasne po prvi črki");
    assert.equal(await page.locator('#tipkovnica .tk-rows button[data-mark="1"]').count(), 1, "plošča ni narisana znova");
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate(() => window.full), before, "pritiski ne pregledajo vse strani");
    // ⇧ ročno: napisi postanejo veliki na istih tipkah
    await press("#tipkovnica .tk-k.shift");
    assert.equal(await page.locator(letter("Q")).count(), 1);
    assert.equal(await page.locator('#tipkovnica .tk-rows button[data-mark="1"]').count(), 1);
    await press(letter("Q"));
    assert.equal(await page.inputValue("#t"), "AnaQ");
    assert.equal(await page.locator(letter("q")).count(), 1, "enkratni ⇧ ugasne");

    // ⌫: en dotik = znak, dvoklik = beseda, troklik = poved; držanje briše po znakih (j, 4. 11.)
    const bsSel = await page.evaluate(() => {
      const b = [...document.querySelectorAll("#tipkovnica .tk-rows .tk-k")].find((x) => /briši|izbriši|delete/i.test(x.getAttribute("aria-label") || ""));
      b.dataset.bs = "1";
      return '#tipkovnica .tk-k[data-bs="1"]';
    });
    const tapBs = async (times) => {
      for (let i = 0; i < times; i++) {
        if (touch) await page.locator(bsSel).tap();
        else await page.locator(bsSel).click();
      }
      await page.waitForTimeout(40); // na dotik tipka deluje takoj po »touchend«
    };
    const setText = (v) => page.evaluate((v) => { const t = document.getElementById("t"); t.value = v; t.setSelectionRange(v.length, v.length); }, v);
    await setText("Prva poved. Druga beseda");
    await tapBs(1);
    assert.equal(await page.inputValue("#t"), "Prva poved. Druga besed", "en dotik");
    await page.waitForTimeout(500);
    await tapBs(2);
    assert.equal(await page.inputValue("#t"), "Prva poved. Druga ", "dvoklik");
    await page.waitForTimeout(500);
    await setText("Prva poved. Druga beseda");
    await tapBs(3);
    assert.equal(await page.inputValue("#t"), "Prva poved. ", "troklik");
    await page.waitForTimeout(500);
    // druga tipka vmes prekine dvoklik
    await setText("abc def");
    await tapBs(1);
    await press(letter("x"));
    await tapBs(1);
    assert.equal(await page.inputValue("#t"), "abc de", "⌫ x ⌫ ni dvoklik");
    await page.waitForTimeout(500);
    // črka se vpiše že ob pritisku; dolg pritisk na »s« in dvig izbere »š« (ne »sš«)
    {
      const center = async (l) => {
        const i = await page.evaluate((l) => [...document.querySelectorAll("#tipkovnica .tk-rows .tk-k")].findIndex((b) => b.firstChild?.textContent?.toLowerCase() === l), l);
        const b = await page.locator("#tipkovnica .tk-rows .tk-k").nth(i).boundingBox();
        return [b.x + b.width / 2, b.y + b.height / 2];
      };
      await page.evaluate(() => { const t = document.getElementById("t"); t.value = "a "; t.setSelectionRange(2, 2); });
      const [x, y] = await center("s");
      await page.mouse.move(x, y);
      await page.mouse.down();
      assert.match(await page.inputValue("#t"), /^a [sS]$/, "črka ob pritisku");
      await page.waitForTimeout(600);
      assert.equal(await page.locator("#tipkovnica .tk-pop").count(), 1, "različice");
      await page.mouse.up();
      await page.waitForTimeout(40);
      assert.match(await page.inputValue("#t"), /^a [šŠ]$/, "dolg pritisk zamenja črko");
      // z izbranim besedilom: različica zamenja izbiro (ne ostane še črka s pritiska)
      await page.waitForTimeout(500);
      await page.evaluate(() => { const t = document.getElementById("t"); t.value = "a xyz b"; t.setSelectionRange(2, 5); });
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.waitForTimeout(600);
      await page.mouse.up();
      await page.waitForTimeout(40);
      assert.match(await page.inputValue("#t"), /^a [šŠ] b$/, "različica namesto izbire");
    }
    await page.waitForTimeout(500);
    // ⌫ briše že ob pritisku (pred dvigom prsta), ob dvigu ne še enkrat
    await setText("abc");
    {
      const b = await page.locator(bsSel).boundingBox();
      await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
      await page.mouse.down();
      assert.equal(await page.inputValue("#t"), "ab", "⌫ ob pritisku");
      await page.mouse.up();
      await page.waitForTimeout(40);
      assert.equal(await page.inputValue("#t"), "ab", "ob dvigu ne briše znova");
    }
    await page.waitForTimeout(500);
    // držanje: po en znak
    await setText("ena dva tri");
    const box = await page.locator(bsSel).boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(700);
    await page.mouse.up();
    const held = await page.inputValue("#t");
    assert.ok(held.length < 11 && held.length >= 4 && "ena dva tri".startsWith(held), `držanje: »${held}«`);
    await page.waitForTimeout(500);

    // enaka višina v vseh plasteh
    const heights = {};
    for (const layer of ["abc", "num", "fx", "sym", "kem"]) {
      const i = await page.locator("#tipkovnica .tk-tab").evaluateAll((tabs, l) => tabs.findIndex((x) => x.textContent.trim().toLowerCase().startsWith({ abc: "abc", num: "123", fx: "f(x)", sym: "σ", kem: "kem" }[l])), layer);
      assert.ok(i >= 0, `zavihek ${layer}`);
      await press(`#tipkovnica .tk-tab >> nth=${i}`);
      assert.equal(await page.getAttribute("#tipkovnica .tk-rows", "data-layer"), layer);
      heights[layer] = await page.evaluate(() => document.getElementById("tipkovnica").offsetHeight);
      // predlogi besed so privzeto izklopljeni: nad zavihki ni praznega pasu (j, 4. 11.)
      assert.equal(await page.locator("#tipkovnica .tk-ctx").count(), 0, `brez pasu predlogov (${layer})`);
    }
    assert.equal(new Set(Object.values(heights)).size, 1, `višine: ${JSON.stringify(heights)}`);
    assert.deepEqual(errors, []);
  });
}

test("swiping the template row scrolls it and inserts nothing; a clean tap inserts (phone)", async (t) => {
  if (!browser) return t.skip("Playwright/Chromium ni nameščen");
  const server = await serve();
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: "sl-SI" });
  t.after(async () => {
    await ctx.close();
    server.close();
  });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/v.html`);
  await page.waitForFunction(() => window.ready);
  await page.tap("#v");
  await page.waitForSelector("#tipkovnica .tk-ctx .tk-chip");
  // Počasen strežnik (CI): počakaj, da se tipkovnica dokonča odpre, sicer poteg zgreši vrstico.
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running"), null, { timeout: 5000 });
  await page.waitForTimeout(100);
  const row = await page.locator("#tipkovnica .tk-ctx").boundingBox();
  const cdp = await ctx.newCDPSession(page);
  const y = row.y + row.height / 2;
  const touch = (type, x) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: x == null ? [] : [{ x, y }] });
  await touch("touchStart", row.x + row.width - 40);
  for (let i = 1; i <= 12; i++) {
    await touch("touchMove", row.x + row.width - 40 - i * 20);
    await page.waitForTimeout(16);
  }
  await touch("touchEnd");
  const moved = await page
    .waitForFunction(() => document.querySelector("#tipkovnica .tk-ctx").scrollLeft > 20, null, { timeout: 2000 })
    .then(() => true, () => false);
  assert.ok(moved, "vrstica se je pomaknila");
  assert.equal(await page.inputValue("#v"), "", "poteg ne vpiše predloge");
  await page.locator("#tipkovnica .tk-ctx .tk-chip").filter({ hasText: "π" }).tap();
  await page.waitForTimeout(60);
  assert.equal(await page.inputValue("#v"), "π", "čist dotik vpiše");
});
