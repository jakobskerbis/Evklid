// Tabele skrbnika v pilotu se ne pomikajo vstran (j: nič ne drsi vstran; generalka AUDIT-095 27. 11. 2026: tabela
// konceptov 870 px v kartici 556 px na računalniku, na telefonu še 5 drugih tabel). Glave se lomijo med besedami,
// preozka tabela postane seznam »ime stolpca: vrednost« (public/pilot-tabele.js, account.css). Preverjeno v pravem
// brskalniku na računalniku, tablici in telefonu ter ob spremembi širine.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { QUIZ } from "../server/pilot-ucinek.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 240000 };
process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");
const ADMIN = "skrbnik@tabele.test";

// Strežnik z računi, skrbnikom s profilom in 10 pari preizkusa (tabela konceptov in tabela sklopov sta izpolnjeni).
async function withAdmin(fn) {
  const prev = process.env.EVKLID_ADMIN_EMAILS;
  process.env.EVKLID_ADMIN_EMAILS = ADMIN;
  const store = openDb(":memory:");
  const db = store.db;
  const app = createApp(store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ id: "x" }) }), log: { error() {}, warn() {}, info() {}, log() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const reg = await fetch(`${base}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: ADMIN, password: "geslo1234", accept_privacy: true, birth_date: "1990-01-01" }) });
    assert.equal(reg.status, 201);
    db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = ?").run(ADMIN);
    const ans = (right) => JSON.stringify(Array.from({ length: 12 }, (_, i) => (right.includes(i) ? 1 : 0)));
    const row = db.prepare("INSERT INTO pilot_quiz (student_id, phase, topic_id, items, answers, score, created_at, finished_at, form, aided, help, practiced) VALUES (?, ?, ?, '[]', ?, ?, ?, ?, ?, 0, 'no', ?)");
    for (let i = 0; i < 10; i++) {
      const sid = Number(db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run(`U${i}`).lastInsertRowid);
      const [f, g] = i % 2 ? ["B", "A"] : ["A", "B"];
      row.run(sid, "pre", QUIZ.version, ans([0, 1, 2]), 3, "2026-11-01 09:00:00", `2026-11-01 10:00:0${i}`, f, null);
      row.run(sid, "post", QUIZ.version, ans([0, 1, 2, 3, 4, 5]), 6, "2026-11-16 10:00:00", `2026-11-16 10:30:0${i}`, g, JSON.stringify(i < 6 ? [3, 4] : []));
    }
    await fn(base);
  } finally {
    server.close();
    if (prev === undefined) delete process.env.EVKLID_ADMIN_EMAILS;
    else process.env.EVKLID_ADMIN_EMAILS = prev;
  }
}

async function openAccount(base, width, height) {
  const ctx = await chromium.newContext({ viewport: { width, height }, locale: "sl-SI" });
  const page = await ctx.newPage();
  await page.goto(base + "/");
  // Skrbnikov profil nastane enkrat (na računalniku); nov profil na telefonu bi najprej odprl uvodni korak.
  await page.evaluate(async (email) => {
    await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: "geslo1234" }) });
    let [s] = await (await fetch("/api/students")).json();
    s ||= await (await fetch("/api/students", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Skrbnik", self: true, consent: true, settings: { curriculum_level: "4. letnik" } }) })).json();
    localStorage.setItem("studentId", String(s.id));
  }, ADMIN);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + "/?pogled=racun");
  await page.locator(".pilot-scroll", { hasText: "Skupina konceptov" }).waitFor({ timeout: 30000 });
  // Obe kartici (merjenje v pilotu in naloge članov) sta izrisani: počakamo na tabele, ne na fiksen čas.
  await page.waitForFunction(() => document.querySelectorAll("#pilot-out .pilot-scroll").length >= 1 && document.querySelectorAll("#pilot-tasks-out .pilot-scroll").length >= 3, null, { timeout: 30000 });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  return { ctx, page, errors };
}

// Vse vidne tabele pilota in cela stran: širina vsebine ≤ širina okvirja.
const measure = (page) =>
  page.evaluate(() => ({
    page: document.documentElement.scrollWidth - innerWidth,
    tables: [...document.querySelectorAll(".pilot-scroll")].filter((e) => e.offsetParent).map((e) => ({ head: e.querySelector("th")?.textContent.trim(), over: e.scrollWidth - e.clientWidth, stack: e.classList.contains("stack") })),
  }));
const concept = (r) => r.tables.find((x) => x.head === "Skupina konceptov");

test("tabele pilota se ne pomikajo vstran: računalnik, tablica, telefon (seznam kartic) in ob spremembi širine", opts, async () => {
  await withAdmin(async (base) => {
    for (const [w, h] of [[1280, 900], [768, 1000], [390, 844], [360, 740]]) {
      const { ctx, page, errors } = await openAccount(base, w, h);
      const r = await measure(page);
      assert.deepEqual(errors, [], `${w}: brez napak na strani`);
      assert.ok(r.tables.length >= 5, `${w}: tabele pilota so prikazane (${r.tables.length})`);
      assert.ok(r.page <= 0, `${w}: stran se ne pomika vstran`);
      for (const x of r.tables) assert.ok(x.over <= 1, `${w}: tabela »${x.head}« se pomika vstran za ${x.over} px`);
      // Na računalniku ostane prava tabela (glave v več vrsticah), na telefonu postane seznam kartic z imeni stolpcev.
      assert.equal(concept(r).stack, w < 600, `${w}: tabela konceptov ${w < 600 ? "kot kartice" : "kot tabela"}`);
      if (w < 600) {
        const labels = await page.locator(".pilot-scroll", { hasText: "Skupina konceptov" }).evaluate((e) => [...e.querySelectorAll("tbody tr:first-child td")].map((td) => td.dataset.label));
        assert.deepEqual(labels, ["Kandidatov", "Napačno ali »Tega še ne znam« prvič", "Pravilno drugič", "Delež", "95-odstotni interval"]);
      }
      await ctx.close();
    }
    // Ožanje in širjenje okna (ali obrnjen telefon): tabela se sama preuredi brez ponovnega nalaganja in brez napake
    // »ResizeObserver loop« (pregled PR #1209).
    const { ctx, page, errors } = await openAccount(base, 1280, 900);
    assert.equal(concept(await measure(page)).stack, false);
    for (const w of [900, 500, 390, 320, 1280, 390]) {
      await page.setViewportSize({ width: w, height: 844 });
      await page.waitForTimeout(250);
    }
    const r = await measure(page);
    assert.equal(concept(r).stack, true, "po zožitvi kartice");
    for (const x of r.tables) assert.ok(x.over <= 1, `po zožitvi: »${x.head}« ${x.over} px`);
    // Ime stolpca in vrednost v isti vrstici kartice.
    const cell = await page.locator(".pilot-scroll", { hasText: "Skupina konceptov" }).locator("tbody tr:first-child td").first().evaluate((td) => {
      const r = td.getBoundingClientRect();
      return { h: r.height, line: parseFloat(getComputedStyle(td).lineHeight) || 24 };
    });
    assert.ok(cell.h < cell.line * 1.8, `ime stolpca in vrednost v eni vrstici (${cell.h} px)`);
    assert.deepEqual(errors, [], "brez napak na strani");
    await ctx.close();
  });
});

test("CSS: glave se lomijo samo med besedami (brez deljenja besed), seznam kartic skrije glavo le vizualno", () => {
  const css = fs.readFileSync(new URL("../public/account.css", import.meta.url), "utf8");
  assert.match(css, /\.pilot-table thead th, \.pilot-table tbody tr > :first-child \{ white-space: normal; \}/);
  assert.doesNotMatch(css.match(/\.pilot-table[^{]*\{[^}]*\}/g).join("\n"), /hyphens/);
  assert.doesNotMatch(css, /\.pilot-scroll\.stack t[dh][^{]*\{[^}]*display: flex/, "celica s sestavljeno vsebino ni razbita na kose");
  assert.match(css, /\.pilot-scroll\.stack thead \{ position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset\(50%\)/);
});

test.after(() => chromium?.close());
