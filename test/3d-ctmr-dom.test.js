// CT ob fotografiji v pravem brskalniku (Playwright, če je nameščen): vzorec iz repozitorija (prsni koš moškega, mali CT
// 2 mm). OŠ: gumbov »Slika« ni; SŠ: »Fotografija / CT« (MR na prsnem košu ni), CT pokaže sivo sliko in izbiro okna,
// menjava okna (pljuča) spremeni sliko brez nove zahteve, dotik na rezini še vedno pove ime strukture; nazaj na OŠ → fotografija.
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

const skupina = (page, oznaka) => page.locator(`[role=radiogroup][aria-label="${oznaka}"]`);

// nasičenost barv na sredini odra (posnetek zaslona, dekodiran v strani): fotografija je barvna, CT siv
async function barvitost(page) {
  const oder = await page.locator("canvas").first().boundingBox();
  const png = await page.screenshot({ clip: { x: oder.x + oder.width * 0.3, y: oder.y + oder.height * 0.35, width: oder.width * 0.4, height: oder.height * 0.3 } });
  return page.evaluate(async (b64) => {
    const im = new Image();
    im.src = `data:image/png;base64,${b64}`;
    await im.decode();
    const c = document.createElement("canvas");
    c.width = im.width; c.height = im.height;
    const g = c.getContext("2d");
    g.drawImage(im, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let s = 0, n = 0, sv = 0;
    for (let i = 0; i < d.length; i += 4) { s += Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]); sv += d[i + 1]; n++; }
    return { nasicenost: s / n, svetlost: sv / n };
  }, png.toString("base64"));
}

test("pravi prerez: CT ob fotografiji (SŠ), okno CT, ime ob dotiku, OŠ brez CT", { skip, timeout: 180000 }, async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce", locale: "sl-SI" });
  await ctx.addInitScript(() => { try { localStorage.setItem("evklid.lang", "sl"); } catch {} });
  const page = await ctx.newPage();
  const napake = [], zahteve = [];
  page.on("pageerror", (e) => napake.push(String(e.message)));
  page.on("request", (r) => zahteve.push(r.url()));
  try {
    await page.goto(`${base}/3d#organ-pravi-prerez`);
    await page.waitForSelector(".k3-lepljivo .k3-drsnik:not([hidden]) input[type=range]", { state: "visible", timeout: 90000 });
    await page.waitForFunction(() => !document.querySelector(".k3-nalaganje"), null, { timeout: 90000 });
    assert.equal(await skupina(page, "Slika").filter({ visible: true }).count(), 0, "OŠ: CT/MR skrita");
    await skupina(page, "Podrobnost").getByRole("radio", { name: "SŠ" }).click();
    const slika = skupina(page, "Slika").filter({ visible: true });
    await slika.waitFor({ state: "visible", timeout: 30000 });
    assert.deepEqual(await slika.getByRole("radio").allTextContents(), ["Fotografija", "CT"], "MR na prsnem košu ni");
    await page.waitForTimeout(800);
    const foto = await barvitost(page);
    await slika.getByRole("radio", { name: "CT" }).click();
    const okno = skupina(page, "Okno CT");
    await okno.waitFor({ state: "visible" });
    await page.waitForTimeout(800);
    const ct = await barvitost(page);
    assert.ok(foto.nasicenost > 3 * ct.nasicenost + 4, `CT je siv (fotografija ${foto.nasicenost.toFixed(1)}, CT ${ct.nasicenost.toFixed(1)})`);
    const predOknom = zahteve.length;
    await okno.getByRole("radio", { name: "Pljuča" }).click();
    await page.waitForTimeout(600);
    const pljuca = await barvitost(page);
    assert.ok(pljuca.svetlost > ct.svetlost + 20, `v oknu pljuč so mehka tkiva svetlejša (${pljuca.svetlost.toFixed(0)} > ${ct.svetlost.toFixed(0)})`);
    assert.equal(zahteve.slice(predOknom).filter((u) => /\/rezine\//.test(u)).length, 0, "menjava okna brez nove zahteve");
    // dotik na sredini rezine: ime strukture iz iste mreže oznak kot pri fotografiji
    const oder = await page.locator("canvas").first().boundingBox();
    let ime = "";
    for (const [u, v] of [[0.5, 0.42], [0.45, 0.5], [0.55, 0.45], [0.5, 0.55]]) {
      await page.mouse.click(oder.x + oder.width * u, oder.y + oder.height * v);
      await page.waitForTimeout(700);
      ime = await page.evaluate(() => (document.querySelector(".k3-info:not([hidden]) .k3-info-ime")?.textContent || "").trim());
      if (ime) break;
    }
    assert.ok(ime.length > 2, "dotik na CT pove ime strukture");
    // nazaj na OŠ: fotografija, gumbov ni
    await skupina(page, "Podrobnost").getByRole("radio", { name: "OŠ" }).click();
    await page.waitForTimeout(800);
    assert.equal(await skupina(page, "Slika").filter({ visible: true }).count(), 0);
    assert.ok((await barvitost(page)).nasicenost > 3 * ct.nasicenost + 4, "OŠ: spet fotografija");
    assert.ok(await page.getByText("Courtesy of the U.S. National Library of Medicine").first().isVisible(), "navedba NLM ostane vidna");
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
  }
});
