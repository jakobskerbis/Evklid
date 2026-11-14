// Točka B2 v brskalniku: odprtje Inštruktorja, zavihkov »Uči se« (Učbenik, Laboratorij, 3D svet) in Iger zabeleži
// strežnik enkrat na dan in del (server/odpiranje-delov.js); ponovno odprtje istega dne ne pošlje nove zahteve.
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

test("B2 splet: odprti deli aplikacije se zabeležijo enkrat na dan", opts, async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const ctx = await chromium.newContext({ viewport: { width: 1280, height: 900 }, locale: "sl-SI", serviceWorkers: "block" });
  try {
    await ctx.addInitScript(() => localStorage.setItem("evklid.tour", "1"));
    const p = await ctx.newPage();
    const napake = [];
    p.on("pageerror", (e) => napake.push(e.message));
    let zahtev = 0;
    p.on("request", (r) => /\/odprto$/.test(r.url()) && zahtev++);
    await p.goto(base + "/healthz");
    const id = await p.evaluate(() =>
      fetch("/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Deli", settings: { school: "SREDNJA_SOLA", grade: "4. letnik" } }) })
        .then((r) => r.json())
        .then((s) => s.id),
    );
    await p.evaluate((id) => localStorage.setItem("studentId", String(id)), id);
    await p.goto(base + "/");
    await p.waitForSelector('.tab[data-view="chat"]', { state: "attached", timeout: 60000 });
    await p.waitForSelector(".iq-wrap [data-iq=skip]", { timeout: 10000 }).then((b) => b.click()).catch(() => {});
    const klik = (sel) => p.evaluate((sel) => document.querySelector(sel).click(), sel);
    const deli = () => store.db.prepare("SELECT del, dni FROM odpiranje_delov WHERE student_id = ? ORDER BY del").all(id).map((r) => `${r.del}:${r.dni}`);
    await klik('.tab[data-view="chat"]');
    await klik('.tab[data-view="uci"]');
    for (const t of ["textbook", "lab", "3d"]) await klik(`[data-uci-tab="${t}"]`);
    await klik('.tab[data-view="games"]');
    await klik('.tab[data-view="chat"]');
    await klik('[data-uci-tab="textbook"]');
    const pricakovano = ["igre:1", "instruktor:1", "laboratorij:1", "lekcije:1", "svet3d:1"];
    for (let i = 0; i < 50 && deli().join() !== pricakovano.join(); i++) await p.waitForTimeout(100);
    assert.deepEqual(deli(), pricakovano);
    assert.equal(zahtev, 5, "ponovno odprtje istega dne ne pošlje zahteve");
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
    server.close();
  }
});

test.after(() => chromium?.close());
