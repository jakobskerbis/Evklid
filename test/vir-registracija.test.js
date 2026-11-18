// #753: povezava z oznako vira in sidrom (/?vir=pilot#registracija) odpre obrazec za registracijo, ne pristajalne
// strani. public/account.js je poizvedbo umaknil iz naslova skupaj s sidrom; zdaj ostane sidro, oznaka vira pa se
// še vedno šteje (obisk na strežniku, server/rast.js) in shrani v brskalniku (public/vir.js) za nov profil.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

const UA = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";

test("account.js: ob umiku poizvedbe iz naslova sidro ostane", () => {
  const src = readFileSync(new URL("../public/account.js", import.meta.url), "utf8");
  assert.match(src, /if \(q\.toString\(\)\) history\.replaceState\(null, "", location\.pathname \+ location\.hash\);/);
  assert.doesNotMatch(src, /if \(q\.toString\(\)\) history\.replaceState\(null, "", location\.pathname\);/);
});

test("/?vir=…#registracija odpre registracijo, #prijava prijavo, brez sidra pristajalno stran; vir se šteje", { skip: !playwright && "Playwright ni nameščen", timeout: 90_000 }, async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn: async () => ({ ok: true, status: 200, json: async () => ({}) }), log: { error() {}, warn() {}, info() {}, log() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await playwright.chromium.launch();
  const open = async (path) => {
    // Navaden telefon: »HeadlessChrome« bi strežnik štel za robota in obiska ne bi preštel (server/pilot.js BOT).
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, locale: "sl-SI", serviceWorkers: "block", userAgent: UA });
    const p = await ctx.newPage();
    await p.goto(base + path);
    await p.waitForSelector("#view-auth h1", { timeout: 20_000 });
    return { ctx, p };
  };
  try {
    for (const [path, h1, hash, vir] of [
      ["/?vir=pilot#registracija", "Nov račun", "#registracija", "pilot"],
      ["/?utm_source=facebook#registracija", "Nov račun", "#registracija", "facebook"],
      ["/?vir=sola#prijava", "Prijava", "#prijava", "sola"],
    ]) {
      const { ctx, p } = await open(path);
      assert.equal(await p.locator("#view-auth h1").textContent(), h1, path);
      assert.equal(await p.locator("#auth-form").count(), 1, `${path}: obrazec`);
      assert.equal(await p.locator("#view-auth .land").count(), 0, `${path}: ni pristajalne strani`);
      const url = new URL(p.url());
      assert.equal(url.search, "", `${path}: poizvedba umaknjena`);
      assert.equal(url.hash, hash, `${path}: sidro ostane`);
      const saved = await p.evaluate(() => JSON.parse(localStorage.getItem("evklid_vir") || "null"));
      assert.equal(saved?.v, vir, `${path}: vir shranjen v brskalniku`);
      await ctx.close();
    }
    // Brez sidra ostane pristajalna stran (nov obiskovalec).
    const { ctx, p } = await open("/?vir=pilot");
    await p.waitForSelector("#view-auth .land", { timeout: 20_000 });
    assert.equal(new URL(p.url()).hash, "");
    await ctx.close();
    // Strežnik je preštel vse štiri obiske z oznako.
    const rows = Object.fromEntries(store.db.prepare("SELECT vir, SUM(n) AS n FROM source_visits GROUP BY vir").all().map((r) => [r.vir, r.n]));
    assert.deepEqual(rows, { facebook: 1, pilot: 2, sola: 1 });
  } finally {
    await browser.close();
    server.close();
  }
});
