// Nalaganje prevodov vmesnika (public/i18n/languages.js uiDicts, public/i18n-osnova.js load): živ jezik ima vse ključe,
// zato tuj učenec ob prvem odprtju ne naloži še angleškega slovarja (nemški profil: prej de.json, en.json in sl.js).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { uiDicts, uiChain, LIVE_UI_LANGUAGES } from "../public/i18n/languages.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

let playwright = null;
try {
  playwright = createRequire(import.meta.url)("playwright");
} catch {}
const PUB = path.join(import.meta.dirname, "..", "public");

test("uiDicts: the chain up to the first live language, never Slovenian", () => {
  assert.deepEqual(uiDicts("sl"), []);
  assert.deepEqual(uiDicts("en"), ["en"]);
  for (const l of LIVE_UI_LANGUAGES.filter((x) => x !== "sl")) assert.deepEqual(uiDicts(l), [l], l);
  assert.deepEqual(uiDicts("fr"), ["fr", "en"]);
  assert.deepEqual(uiDicts("sr"), uiChain("sr").slice(0, uiChain("sr").indexOf("hr") + 1));
  assert.ok(uiDicts("sr").includes("hr") && !uiDicts("sr").includes("en"));
  assert.deepEqual(uiDicts("bho"), ["bho", "hi", "en"]);
  assert.deepEqual(uiDicts("xx"), []);
});

test("the UI and the AI label load only uiDicts; a live language does not wait for the Slovenian original", () => {
  const osnova = fs.readFileSync(path.join(PUB, "i18n-osnova.js"), "utf8");
  assert.match(osnova, /const chain = uiDicts\(lang\);/);
  // Brez prevoda (napaka omrežja) ali za nepopoln jezik počakamo izvirnik, kot prej.
  assert.match(osnova, /if \(izvirnik && !poln\) await izvirnik;/);
  assert.match(fs.readFileSync(path.join(PUB, "ai-oznaka", "ai-oznaka.js"), "utf8"), /const want = uiDicts\(lang\);/);
});

// V brskalniku: nemščina je pripravljena, preden pride sl.js; brez de.json počaka izvirnik; slovenščina ga čaka kot prej.
test("browser: a German UI is ready without sl.js; without de.json it waits for Slovenian; Slovenian still waits", { skip: !playwright && "Playwright ni nameščen", timeout: 120_000 }, async () => {
  const server = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, warn() {}, info() {}, log() {} } }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await playwright.chromium.launch();
  // jezik, pot, ki jo zadržimo (do sprostitve) ali zavrnemo → [pripravljen pred sprostitvijo, t("nav.path"), zahtevane datoteke]
  async function poskus(lang, { zadrzi, zavrni }) {
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const p = await ctx.newPage();
    const zahteve = [];
    p.on("request", (r) => zahteve.push(new URL(r.url()).pathname));
    let sprosti;
    const izpust = new Promise((ok) => (sprosti = ok));
    if (zadrzi) await p.route(`**${zadrzi}`, async (route) => (await izpust, route.continue()));
    if (zavrni) await p.route(`**${zavrni}`, (route) => route.abort());
    await p.goto(`${base}/healthz`);
    await p.evaluate((l) => localStorage.setItem("evklid.lang", l), lang);
    const prej = await p.evaluate(() =>
      import("/i18n-osnova.js").then((m) => Promise.race([m.ready.then(() => true), new Promise((ok) => setTimeout(() => ok(false), 2500))])),
    );
    sprosti();
    const besedilo = await p.evaluate(() => import("/i18n-osnova.js").then((m) => m.ready.then(() => m.t("nav.path"))));
    await ctx.close();
    return [prej, besedilo, zahteve];
  }
  try {
    const de = await poskus("de", { zadrzi: "/i18n/sl.js" });
    assert.deepEqual(de.slice(0, 2), [true, "Lernpfad"]);
    assert.ok(!de[2].includes("/i18n/ui/en.json"), "nemški profil ne naloži angleškega slovarja");
    assert.deepEqual((await poskus("de", { zavrni: "/i18n/ui/de.json" })).slice(0, 2), [true, "Učna pot"]);
    const brezDe = await poskus("de", { zavrni: "/i18n/ui/de.json", zadrzi: "/i18n/sl.js" });
    assert.equal(brezDe[0], false, "brez prevoda počaka izvirnik");
    assert.deepEqual((await poskus("sl", { zadrzi: "/i18n/sl.js" })).slice(0, 2), [false, "Učna pot"]);
  } finally {
    await browser.close();
    server.close();
  }
});
