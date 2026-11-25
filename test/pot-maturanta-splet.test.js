// Pot maturanta v brskalniku (telefon): nov profil 4. letnik OR dobi v obrazcu cilj matura z datumom, Učna pot kartico
// »Danes« zgoraj in brez vprašalnika ter vodiča; star profil s privzetim ciljem dobi ponudbo, ki z enim dotikom nastavi maturo.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import { maturaDatum } from "../public/goal-data.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 180000 };

test("maturant: obrazec, kartica Danes, brez uvoda, ponudba za star profil", opts, async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const ctx = await chromium.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: "sl-SI", serviceWorkers: "block" });
  try {
    const p = await ctx.newPage();
    const napake = [];
    p.on("pageerror", (e) => napake.push(e.message));
    // 1) Nov profil v obrazcu: SŠ → 4. letnik → OR izbere cilj matura z datumom roka; obrazec cilja ne pošlje sam.
    await p.goto(base + "/");
    await p.waitForSelector("#onboard-form");
    await p.fill('#onboard-form input[name="name"]', "Ana");
    for (const v of ["SREDNJA_SOLA", "4. letnik", "OR"]) await p.click(`#onboard-form .lp-opt[data-val="${v}"]`);
    assert.equal(await p.getAttribute('#onboard-form [data-goal="matura"]', "aria-checked"), "true");
    assert.equal(await p.inputValue('#onboard-form input[name="goal_date"]'), maturaDatum());
    await p.click('#onboard-form button[type="submit"]');
    await p.waitForSelector("#view-path #xp-card .hero.danes", { timeout: 20000 });
    const ana = store.db.prepare("SELECT id, settings FROM students WHERE name = 'Ana'").get();
    const st = JSON.parse(ana.settings);
    assert.deepEqual([st.goal, st.goal_date, st.goal_reminder, st.curriculum_level], ["matura", maturaDatum(), false, "4. letnik OR"]);
    const hero = await p.innerText("#xp-card .hero.danes");
    assert.match(hero, /Danes/);
    assert.match(hero, /Za maturo: /);
    assert.match(hero, /približno 15\s*min/);
    // Odštevanje »še N dni« samo v kartici Danes, vrstica cilja ima le datum.
    assert.match(hero, /še \d+ dni/);
    const line = await p.innerText("#goal-line");
    assert.match(line, /Matura/);
    assert.doesNotMatch(line, /še \d+ dni/);
    // Prva rešena naloga je za njo: ob vrnitvi na Učno pot ni vprašalnika »Kaj te zanima?« ne vodiča.
    store.updateStudent(ana.id, { settings: { first_task: 1 } });
    await p.reload();
    await p.waitForSelector("#view-path #xp-card .hero.danes");
    await p.waitForTimeout(2500);
    assert.equal(await p.locator(".iq-wrap").count(), 0, "brez vprašalnika zanimanj");
    assert.equal(await p.locator("#tour:visible").count(), 0, "brez vodiča");
    // Mnenje in namestitev sta pod kartico (nikoli nad glavnim dejanjem).
    const pod = await p.evaluate(() => ["feedback-card", "install-card"].every((id) => document.getElementById("xp-card").compareDocumentPosition(document.getElementById(id)) & Node.DOCUMENT_POSITION_FOLLOWING));
    assert.ok(pod);
    // Gumb »Vadi« odpre temo, ki je na vrsti na Učni poti (nova maturantka še ni vadila nobene teme iz »Najprej vadi«).
    const next = (await p.evaluate((id) => fetch(`/api/students/${id}/path`).then((r) => r.json()), ana.id)).next;
    assert.equal(await p.getAttribute("#xp-card [data-danes-topic]", "data-danes-topic"), next.id);
    await p.click("#xp-card [data-danes-topic]");
    await p.waitForSelector("#view-topic:not([hidden])");

    // 2) Star profil maturanta s privzetim ciljem: ponudba na vrhu, »Nastavi maturo« nastavi cilj in pokaže kartico Danes.
    const old = { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR", subject: "MAT", goal: "sprotno", goal_date: "", goal_reminder: true, interests: [], tour_version: 9, first_task: 1 };
    const oid = Number(store.db.prepare("INSERT INTO students (name, settings) VALUES ('Bor', ?)").run(JSON.stringify(old)).lastInsertRowid);
    await p.evaluate((id) => localStorage.setItem("studentId", String(id)), oid);
    await p.goto(base + "/");
    await p.waitForSelector('#goal-reminder [data-matura-offer="yes"]', { timeout: 20000 });
    assert.equal(await p.locator("#xp-card .hero.danes").count(), 0);
    await p.click('#goal-reminder [data-matura-offer="yes"]');
    assert.equal(await p.locator("#goal-reminder").isHidden(), true, "kartica izgine takoj");
    await p.waitForSelector("#view-path #xp-card .hero.danes", { timeout: 20000 });
    const bor = store.getStudent(oid).settings;
    assert.deepEqual([bor.goal, bor.goal_date, bor.goal_reminder, bor.matura_offer, bor.curriculum_level], ["matura", maturaDatum(), false, 1, "4. letnik VR"]);
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
    server.close();
  }
});

test.after(() => chromium?.close());
