// Ustno spraševanje, iskanje snovi (j, 17. 11. 2026): »Za to snov še ni vprašanj« samo po iskanju, ki ga je učenec
// sam vpisal (ne ob besedilu, prevzetem iz zadnjega sporočila v klepetu); primer v polju (»npr. …«) je tema z
// učenčeve učne poti (njegov predmet in raven), ne vedno »Ohmov zakon«; rezultat računa ima gumb Σ (tipkovnica).
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import { getPath, pathKeyFor } from "../server/curriculum.js";
import SL from "../public/ustno/besedila/sl.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 180000 };

async function local(fn) {
  const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, body, method) => {
    const r = await fetch(base + p, { method: method || (body ? "POST" : "GET"), headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: r.status, body: await r.json() };
  };
  try {
    await fn({ call, base });
  } finally {
    server.close();
  }
}

const LEVELS = [
  { subject: "FIZ", educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred" },
  { subject: "MAT", educational_track: "OSNOVNA_SOLA", curriculum_level: "6. razred" },
  { subject: "KEM", educational_track: "SREDNJA_SOLA", curriculum_level: "1. letnik" },
];

test("strežnik: brez snovi predogled vrne primer s poti učenca (predmet in raven), ki ga iskanje najde", async () => {
  await local(async ({ call }) => {
    const seen = new Set();
    for (const settings of LEVELS) {
      const s = (await call("/api/students", { name: "Ana", settings })).body;
      const r = await call(`/api/students/${s.id}/ustno`);
      assert.equal(r.status, 200);
      assert.equal(r.body.snov, null);
      const names = getPath(pathKeyFor(s.settings)).units.flatMap((u) => u.topics.map((t) => t.name));
      assert.ok(typeof r.body.primer === "string" && names.includes(r.body.primer), `${settings.subject} ${settings.curriculum_level}: ${r.body.primer}`);
      seen.add(r.body.primer);
      const hit = await call(`/api/students/${s.id}/ustno?besedilo=${encodeURIComponent(r.body.primer)}`);
      assert.ok(hit.body.snov, `iskanje »${r.body.primer}« najde snov`);
      // Ko je snov znana, primera ni.
      assert.equal("primer" in hit.body, false);
    }
    assert.equal(seen.size, LEVELS.length, "vsaka raven in predmet ima svoj primer");
  });
});

test("besedila: »npr. {tema}« v vseh 33 jezikih", () => {
  assert.equal(SL["u.isciPhTema"], "npr. {tema}");
  const dir = new URL("../public/ustno/besedila/", import.meta.url);
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const d = JSON.parse(readFileSync(new URL(f, dir), "utf8"));
    assert.match(d["u.isciPhTema"] || "", /\{tema\}/, f);
  }
});

test("brskalnik: brez »ni vprašanj« ob besedilu iz klepeta, po iskanju da; primer s poti; Σ pri rezultatu", opts, async () => {
  await local(async ({ call, base }) => {
    const s = (await call("/api/students", { name: "Ana", settings: { ...LEVELS[0], interests: [] } })).body;
    const primer = (await call(`/api/students/${s.id}/ustno`)).body.primer;
    const ctx = await chromium.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript((id) => (localStorage.setItem("studentId", String(id)), localStorage.setItem("evklid.tour", "1")), s.id);
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(base + "/");
    await p.waitForSelector("#view-path #xp-card .hero", { timeout: 60000 });
    // Klepet: zadnje sporočilo ni snov z vprašanji → okno za iskanje brez sporočila o napaki.
    const u = await p.evaluate(() => import("/ustno/ustno.js"));
    await p.evaluate(async (sid) => {
      const m = document.createElement("div");
      m.className = "msg user";
      m.textContent = "Živjo, kako si?";
      document.querySelector("#messages").append(m);
      const api = async (url) => (await fetch(url)).json();
      const st = await (await fetch(`/api/students/${sid}`)).json();
      const mod = await import("/ustno/ustno.js");
      await mod.odpri("pogovor", { api, student: st, renderRich: (x) => x });
    }, s.id);
    await p.waitForSelector('.us-form[data-us="isci"]');
    const form = await p.$eval('.us-form[data-us="isci"]', (f) => ({ text: f.textContent, ph: f.querySelector("input").placeholder, val: f.querySelector("input").value }));
    assert.ok(!form.text.includes(SL["u.niVprasanj"]), "brez napake, dokler učenec ne išče");
    assert.equal(form.ph, `npr. ${primer}`);
    assert.equal(form.val, "");
    // Učenec vpiše snov brez vprašanj → sporočilo, vpisano ostane v polju.
    await p.fill('.us-form input[name="q"]', "qwzx neobstojece");
    await p.click('.us-form button[type="submit"]');
    await p.waitForFunction((t) => document.querySelector('.us-form[data-us="isci"]')?.textContent.includes(t), SL["u.niVprasanj"]);
    assert.equal(await p.inputValue('.us-form input[name="q"]'), "qwzx neobstojece");
    assert.ok(u, "modul se naloži");
    // Račun: rezultat ima gumb Σ; Evklidova tipkovnica se odpre nad oknom in tipka vpiše v polje.
    await p.route("**/ustno/zacni", (r) => r.fulfill({ json: { id: 1, naslov: "Ohmov zakon", vprasanja: [{ besedilo: "Kolikšen tok teče skozi upornik 4 Ω pri napetosti 12 V?", govor: "Kolikšen tok?", vrsta: "izracunaj", enota: "A", pojmi: 2 }] } }));
    await p.evaluate(async (sid) => {
      const api = async (url, o = {}) => {
        const r = await fetch(url, { method: o.method || "GET", headers: { "content-type": "application/json" }, body: o.body ? JSON.stringify(o.body) : undefined });
        const j = await r.json();
        if (!r.ok) throw Object.assign(new Error(j.error), { body: j });
        return j;
      };
      const st = await (await fetch(`/api/students/${sid}`)).json();
      const mod = await import("/ustno/ustno.js");
      await mod.odpri({ tema: "FIZ-OS-9/upor-in-ohmov-zakon" }, { api, student: st, renderRich: (x) => x });
    }, s.id);
    // Tipkanje (Chromium ima prepoznavo govora: privzeti »glas« bi najprej pokazal obvestilo), brez branja na glas.
    await p.check('.us-form[data-us="nastavi"] input[name="nacin"][value="tipkanje"]');
    await p.uncheck('.us-form[data-us="nastavi"] input[name="beri"]');
    await p.click('.us-form[data-us="nastavi"] button[type="submit"]');
    const sym = p.locator('.us-in-row [data-us="sym"]');
    await sym.waitFor();
    await sym.click();
    await p.waitForSelector("#tipkovnica:not([hidden])");
    assert.equal(await sym.getAttribute("aria-expanded"), "true");
    // Okno se dvigne nad tipkovnico: polje za rezultat ni pod tipkami.
    await p.waitForTimeout(400);
    const over = await p.evaluate(() => {
      const f = document.querySelector('input[name="rezultat"]').getBoundingClientRect();
      const k = document.querySelector("#tipkovnica").getBoundingClientRect();
      return { fieldBottom: Math.round(f.bottom), kbTop: Math.round(k.top) };
    });
    assert.ok(over.fieldBottom <= over.kbTop, `polje pod tipkovnico: ${JSON.stringify(over)}`);
    await p.locator("#tipkovnica .tk-tab").first().click(); // plast številk (prva)
    const seven = p.locator("#tipkovnica .tk-k", { hasText: /^7$/ }).first();
    await seven.click();
    assert.match(await p.inputValue('input[name="rezultat"]'), /7/);
    // Oddaj s tipkovnice → naslednji zaslon okna: tipkovnica se zapre (ne ostane tk-open in spodnji odmik); Esc tudi.
    await p.route("**/ustno/1/odgovor", (r) => r.fulfill({ status: 500, json: { error: "Preizkus" } }));
    await p.locator("#tipkovnica .tk-k.go").click();
    await p.waitForSelector('.us-box [data-us="retry"]');
    assert.equal(await p.evaluate(() => document.body.classList.contains("tk-open")), false, "po oddaji");
    await p.keyboard.press("Escape");
    await p.waitForFunction(() => !document.querySelector("dialog.us-okno")?.open);
    assert.equal(await p.evaluate(() => document.body.classList.contains("tk-open")), false, "po Esc");
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

test("odjemalec: rezultat računa ima gumb Σ in Evklidovo tipkovnico (kot skeniranje)", () => {
  const src = readFileSync(new URL("../public/ustno/ustno.js", import.meta.url), "utf8");
  assert.match(src, /name="rezultat"[\s\S]{0,400}data-us="sym"/);
  assert.match(src, /configureKeyboard\(result, \{ math: true, layers: \["num", "fx", "sym", "abc"\]/);
  assert.match(src, /toggleKeyboard\(result, \{ layer: "sym" \}\)/);
});
