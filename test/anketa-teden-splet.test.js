// Točka B3 v brskalniku: anketa se pokaže na Učni poti (7 dni po prvi uporabi, 2 aktivna dneva), »Pozneje« jo skrije,
// oddaja shrani tri odgovore. Brez cene v besedilu.
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
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 180000 };

test("B3 splet: anketa na Učni poti, Pozneje, oddaja", opts, async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const ctx = await chromium.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: "sl-SI", serviceWorkers: "block" });
  try {
    await ctx.addInitScript(() => localStorage.setItem("evklid.tour", "1"));
    const p = await ctx.newPage();
    const napake = [];
    p.on("pageerror", (e) => napake.push(e.message));
    await p.goto(base + "/healthz");
    const id = await p.evaluate(() =>
      fetch("/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Anketa", settings: { school: "SREDNJA_SOLA", grade: "4. letnik", tour_version: 99 } }) })
        .then((r) => r.json())
        .then((s) => s.id),
    );
    for (const d of [9, 2]) store.db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 5, 'task', datetime('now', ?))").run(id, `-${d} days`);
    await p.evaluate((id) => localStorage.setItem("studentId", String(id)), id);
    const odpri = async () => {
      await p.goto(base + "/");
      await p.waitForSelector(".iq-wrap [data-iq=skip]", { timeout: 8000 }).then((b) => b.click()).catch(() => {});
      return p.waitForSelector("#anketa-teden[open]", { timeout: 15000 });
    };
    const dlg = await odpri();
    const besedilo = await dlg.innerText();
    assert.match(besedilo, /Ti je Evklid ta teden pomagal pri matematiki\?/);
    assert.match(besedilo, /Bi Evklid priporočil prijatelju\?/, "brez znane starosti: priporočilo, ne plačilo");
    assert.doesNotMatch(besedilo, /€|plača/);
    await p.click('#anketa-teden [data-ank="pozneje"]');
    await p.waitForSelector("#anketa-teden", { state: "detached" });
    for (let i = 0; i < 30 && !store.db.prepare("SELECT pozneje FROM anketa_teden WHERE student_id = ?").get(id); i++) await p.waitForTimeout(100);
    assert.equal(store.db.prepare("SELECT pozneje FROM anketa_teden WHERE student_id = ?").get(id).pozneje, 1);
    // Čez 2 dni (skrito_do v preteklosti): spet; brez vseh odgovorov opozorilo, nato oddaja.
    store.db.prepare("UPDATE anketa_teden SET skrito_do = date('now', '-1 day') WHERE student_id = ?").run(id);
    await odpri();
    await p.click('#anketa-teden [data-ank-q="pomaga"][data-v="malo"]');
    await p.click('#anketa-teden [data-ank="poslji"]');
    assert.equal(await p.locator("#anketa-teden .pn-err").isVisible(), true);
    await p.click('#anketa-teden [data-ank-q="naprej"][data-v="da"]');
    await p.click('#anketa-teden [data-ank-q="tretje"][data-v="mogoce"]');
    assert.equal(await p.getAttribute('#anketa-teden [data-ank-q="pomaga"][data-v="malo"]', "aria-pressed"), "true");
    await p.click('#anketa-teden [data-ank="poslji"]');
    await p.waitForSelector("#anketa-teden", { state: "detached" });
    const r = store.db.prepare("SELECT vprasanje3, odgovori FROM anketa_teden WHERE student_id = ?").get(id);
    assert.deepEqual({ v: r.vprasanje3, o: JSON.parse(r.odgovori) }, { v: "priporocil", o: { pomaga: "malo", naprej: "da", tretje: "mogoce" } });
    // Oddana anketa se ne pokaže več.
    await p.goto(base + "/");
    await p.waitForTimeout(4000);
    assert.equal(await p.locator("#anketa-teden").count(), 0);
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
    server.close();
  }
});

test.after(() => chromium?.close());
