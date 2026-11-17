// Zaslon »Potrdi e-naslov« (public/account.js renderVerify, renderVerifyLink; pregled uvoda 15. 11. 2026, oviri 1 in 4):
// »Sem potrdil(a)« pri nepotrjenem naslovu to vidno pove (role=status), pri potrjenem gre naprej; »Pošlji znova« pove,
// kdaj je spet na voljo; mladoletni imetnik ne »izjavlja, da je starš«; povezava v drugem brskalniku je mirna, zaščita
// računa pa je pod »Težave?« (aria-expanded) in dela kot prej. Vsi novi ključi so v vseh jezikih.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import SL from "../public/i18n/sl.js";

const require = createRequire(import.meta.url);
const ROOT = path.join(import.meta.dirname, "..");
const KEYS = ["verify.notYet", "verify.resendHint", "verify.resendWait", "verify.otherBrowser", "verify.otherBrowserPw", "verify.trouble", "verify.selfNote", "verify.parentNote"];
const PARENT_LINE = /starš ali zakoniti zastopnik/;

test("novi ključi potrditve e-naslova: v sl.js in vseh ui/*.json, {s} ohranjen, ne v slovenščini", () => {
  const dir = path.join(ROOT, "public/i18n/ui");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.equal(files.length, 32);
  for (const k of KEYS) assert.ok(SL[k], `sl ${k}`);
  for (const f of files) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    for (const k of KEYS) {
      assert.ok(j[k], `${f} ${k}`);
      assert.notEqual(j[k], SL[k], `${f} ${k} ni preveden`);
    }
    assert.match(j["verify.resendWait"], /\{s\}/, f);
  }
});

let playwright = null;
for (const p of ["playwright", process.env.PLAYWRIGHT, "/opt/npm-tools/node_modules/playwright"].filter(Boolean)) {
  try {
    playwright = require(p);
    break;
  } catch {}
}

const ymdYearsAgo = (y) => {
  const d = new Date();
  return `${d.getFullYear() - y}-01-01`;
};

test("Potrdi e-naslov na telefonu: sporočilo »še ni potrjeno«, Pošlji znova, stavek o staršu, drug brskalnik", { skip: playwright ? false : "Playwright ni nameščen", timeout: 120000 }, async (t) => {
  let browser;
  try {
    browser = await playwright.chromium.launch();
  } catch (err) {
    return t.skip(`Chromium se ne zažene: ${err.message}`);
  }
  const app = createApp(openDb(":memory:"), { accounts: true, scheduler: false, log: { error() {}, info() {}, warn() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const errors = [];
  const phone = async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true, locale: "sl-SI" });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    return { ctx, page };
  };
  // Registracija v brskalniku (piškotek seje ostane v kontekstu), nato zaslon »Potrdi e-naslov«. Od #747 potrditev ni
  // več zid pred profilom: lasten profil nastane brez potrditve, zaslon odpre kartica v zavihku Račun (#verify-open).
  const register = async (page, email, years) => {
    await page.goto(base + "/");
    const r = await page.evaluate(
      async ([email, birth]) => {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: "geslo-12345", birth_date: birth, accept_privacy: true, country: "SI" }),
        });
        return { status: res.status, body: await res.json() };
      },
      [email, ymdYearsAgo(years)],
    );
    assert.equal(r.status, 201, JSON.stringify(r.body));
    await page.goto(base + "/");
    await page.locator("#child-form").waitFor();
    const kid = await page.evaluate(async (y) => {
      const res = await fetch("/api/students", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Jaz", self: true, birth_year: y, consent: true }) });
      return res.status;
    }, new Date().getFullYear() - years);
    assert.equal(kid, 201, "lasten profil pred potrditvijo (#747)");
    await page.goto(base + "/");
    // Zavihek Račun je pripravljen, ko ga account.js pokaže (hidden = false); do takrat klik ne naredi nič, zato
    // klikamo, dokler se kartica ne izriše.
    await page.waitForFunction(
      () => {
        if (document.querySelector("#verify-open")?.checkVisibility()) return true;
        const tab = document.querySelector("#account-tab");
        if (tab && !tab.hidden && !document.body.classList.contains("auth-mode")) tab.click();
        return false;
      },
      null,
      { polling: 700, timeout: 30000 },
    );
    await page.locator("#verify-open").tap();
    await page.locator("#verify-done").waitFor();
    return r.body.dev_verify_url;
  };
  try {
    // 1) Mladoletna dijakinja (16): nevtralen stavek, »še ni potrjeno«, Pošlji znova, nato potrditev → naprej.
    {
      const { ctx, page } = await phone();
      const link = await register(page, "dijakinja@example.com", 16);
      assert.ok(link, "razvojna povezava za potrditev");
      const note = await page.locator(".verify-note").innerText();
      assert.doesNotMatch(note, PARENT_LINE, "mladoletna ne izjavlja, da je starš");
      assert.equal(note, SL["verify.selfNote"]);
      assert.doesNotMatch(await page.locator("#view-auth").innerText(), PARENT_LINE);

      const state = page.locator("#verify-state");
      assert.equal(await state.evaluate((el) => el.parentElement.getAttribute("role")), "status");
      assert.equal(await state.isVisible(), false);
      await page.locator("#verify-done").tap();
      await state.waitFor({ state: "visible" });
      assert.equal(await state.innerText(), SL["verify.notYet"]);
      // Drugi dotik: sporočilo ostane (bralnik ga prebere znova), zaslon ostane.
      await page.locator("#verify-done").tap();
      await page.waitForFunction((txt) => document.querySelector("#verify-state")?.textContent === txt && !document.querySelector("#verify-state").hidden, SL["verify.notYet"]);

      const resend = page.locator("#verify-resend");
      assert.equal(await resend.getAttribute("aria-describedby"), "verify-resend-hint");
      assert.equal(await page.locator("#verify-resend-hint").innerText(), SL["verify.resendHint"]);
      await resend.tap();
      // Razvojni način zaslon izriše znova; gumb je zaklenjen in pove, čez koliko sekund.
      await page.waitForFunction(() => /^Poslano\./.test(document.querySelector("#verify-resend-hint")?.textContent || ""));
      assert.match(await page.locator("#verify-resend-hint").innerText(), /^Poslano\. Znova lahko pošlješ čez \d+ s\./);
      assert.ok(await page.locator("#verify-resend").isDisabled());

      // Stara povezava po »Pošlji znova« ne velja več: potrdimo z novo (razvojna povezava na zaslonu).
      const fresh = await page.locator('#view-auth a[href*="/api/auth/verify"]').getAttribute("href");
      assert.notEqual(fresh, link);
      const res = await page.request.get(fresh, { maxRedirects: 0 });
      assert.match(res.headers().location || "", /verified=1/);
      await page.locator("#verify-done").tap();
      // Profil že obstaja (#747): po potrditvi naravnost v aplikacijo.
      await page.waitForFunction(() => !document.body.classList.contains("auth-mode"));
      // Zaslon za potrditev ni več viden (#view-auth je skrit; vsebino ob naslednjem zaslonu prepiše shell()).
      assert.equal(await page.locator("#view-auth").isVisible(), false);
      assert.equal(await page.locator("#verify-state").isVisible(), false);
      await ctx.close();
    }
    // 2) Polnoleten imetnik: stavek o staršu ali zakonitem zastopniku ostane.
    {
      const { ctx, page } = await phone();
      const link = await register(page, "stars@example.com", 40);
      const adultNote = await page.locator(".verify-note").innerText();
      assert.match(adultNote, PARENT_LINE);
      assert.equal(adultNote, SL["verify.parentNote"], "polnoletni: pogojni stavek (samo če ustvari profil za otroka)");
      // 3) Povezava v drugem brskalniku: mirno besedilo, rdeči gumb skrit pod »Težave?«.
      const other = await phone();
      await other.page.goto(link);
      await other.page.locator("#auth-form input[name=password]").waitFor();
      const text = await other.page.locator("#view-auth").innerText();
      assert.ok(text.includes(SL["verify.otherBrowser"]) && text.includes(SL["verify.otherBrowserPw"]), text);
      const trouble = other.page.locator("#verify-trouble");
      assert.equal(await trouble.getAttribute("aria-expanded"), "false");
      assert.equal(await other.page.locator("#verify-not-mine").isVisible(), false, "rdeči gumb ni viden takoj");
      const box = await trouble.boundingBox();
      assert.ok(box.height >= 40, `dotik ${box.height}px`);
      await trouble.tap();
      assert.equal(await trouble.getAttribute("aria-expanded"), "true");
      assert.ok(await other.page.locator("#verify-not-mine").isVisible());
      await trouble.tap();
      assert.equal(await other.page.locator("#verify-not-mine").isVisible(), false);
      // Geslo potrdi kot prej.
      await other.page.fill("#auth-form input[name=password]", "geslo-12345");
      await other.page.locator("#auth-form button[type=submit]").tap();
      await other.page.waitForFunction(() => !document.body.classList.contains("auth-mode")); // profil že obstaja (#747)
      const sw = await other.page.evaluate(() => document.documentElement.scrollWidth);
      assert.ok(sw <= 360, `brez vodoravnega drsenja (${sw})`);
      await other.ctx.close();
      await ctx.close();
    }
    // 4) »Računa nisem ustvaril jaz« pod »Težave?« naredi isto kot prej (zaščita računa).
    {
      const { ctx, page } = await phone();
      const link = await register(page, "tuj@example.com", 30);
      const other = await phone();
      await other.page.goto(link);
      await other.page.locator("#verify-trouble").tap();
      other.page.once("dialog", (d) => d.accept());
      await other.page.locator("#verify-not-mine").tap();
      await other.page.getByRole("heading", { name: "Račun je zaščiten" }).waitFor();
      await other.ctx.close();
      await ctx.close();
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
    server.close();
  }
});
