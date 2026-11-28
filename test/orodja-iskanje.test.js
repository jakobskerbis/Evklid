// Orodja po predmetih in temah ter iskanje v Orodjih in Formulah (j 28. 11. 2026: »naj so orodja v kalkulatorju
// urejena po predmetih in temah, da ne bodo vsa v eni predolgi vrsti«, »naj imajo formule in orodja tudi iskanje«).
// Razvrstitev preverimo v Node, izbiro in iskanje v pravem brskalniku (Playwright Chromium, telefon 360 × 740).
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import { TOOL_GROUPS, toolPlace, fold } from "../public/graph/tools-groups.js";
import SL from "../public/i18n/sl.js";

test("razvrstitev: vsako orodje je pri vsaj enem predmetu, nobena tema nima več kot pet orodij, vsi napisi obstajajo", () => {
  const all = new Set(Object.values(TOOL_GROUPS).flatMap((g) => g.flatMap(([, l]) => l)));
  for (const k of ["units", "eq", "calc", "stats", "sheet", "tests", "prob", "trials", "vec", "matrix", "plot3", "ode", "err", "complex", "base", "tvm", "table", "rxn", "conc", "solub"]) assert.ok(all.has(k), k);
  for (const [s, g] of Object.entries(TOOL_GROUPS)) {
    assert.ok(SL[`subj.${s}`], s);
    for (const [id, l] of g) {
      assert.ok(l.length <= 5, id);
      assert.ok(SL[`sc.tg.${id}`], id);
      assert.equal(new Set(l).size, l.length, id);
    }
  }
  assert.deepEqual(toolPlace("rxn", "MAT"), { subj: "KEM", topic: "rxn" });
  assert.deepEqual(toolPlace("units", "KEM"), { subj: "KEM", topic: "kcalc" });
  assert.deepEqual(toolPlace("units", "MAT"), { subj: "FIZ", topic: "meas" });
  assert.equal(fold(" Enačbe  "), "enacbe");
});

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 180000 };
test.after(() => chromium?.close());

async function openCalc(base) {
  const ctx = await chromium.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: "sl-SI", serviceWorkers: "block" });
  await ctx.addInitScript(() => localStorage.setItem("evklid.tour", "1"));
  const p = await ctx.newPage();
  await p.goto(base + "/healthz");
  const id = await p.evaluate(() =>
    fetch("/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Iskanje", settings: { school: "OSNOVNA_SOLA", grade: "8. razred" } }) })
      .then((r) => r.json())
      .then((s) => s.id),
  );
  await p.evaluate((id) => localStorage.setItem("studentId", String(id)), id);
  await p.goto(base + "/");
  await p.waitForSelector('.topbar .tab[data-view="graph"]', { state: "attached", timeout: 60000 });
  await p.waitForSelector("#view-path #xp-card .hero", { timeout: 60000 });
  await p.evaluate(() => document.querySelector('.topbar .tab[data-view="graph"]').click());
  await p.waitForFunction(() => [...document.querySelectorAll("#graph-slot > *")].some((c) => !c.hidden && c.getClientRects().length), null, { timeout: 60000 });
  return { ctx, p };
}

test("Orodja: predmet → tema → orodja, iskanje čez vse predmete; Formule: iskanje po listu", opts, async () => {
  const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const { ctx, p } = await openCalc(base);
  try {
    await p.evaluate(() => document.querySelector('#view-graph [data-calc-mode="tools"]').click());
    await p.waitForSelector("#view-graph .tl .tl-pick [data-tool]", { timeout: 60000 });
    const state = () =>
      p.evaluate(() => {
        const r = document.querySelector("#view-graph .tl");
        const vis = (el) => !!el && !el.hidden && el.getClientRects().length > 0;
        return {
          subj: r.querySelector(".tl-subj .active")?.dataset.subj || null,
          topic: vis(r.querySelector(".tl-topics")) ? r.querySelector(".tl-topics .active")?.dataset.topic : null,
          tools: [...r.querySelectorAll(".tl-pick [data-tool]")].filter(vis).map((b) => b.dataset.tool),
          active: r.querySelector(".tl-pick .active")?.dataset.tool || null,
          view: [...r.querySelectorAll(".tl-body > .tl-view")].map((v) => v.className.replace("tl-view tl-", "")),
          wide: r.scrollWidth > r.clientWidth + 1,
        };
      });
    let s = await state();
    assert.equal(s.subj, "MAT");
    assert.equal(s.topic, "alg");
    assert.deepEqual(s.tools, ["eq", "complex", "matrix", "base"]); // le orodja teme, ne vseh 20 v eni vrsti
    assert.equal(s.wide, false); // nič ne gre čez rob
    await p.click('#view-graph .tl-topics [data-topic="stat"]');
    s = await state();
    assert.equal(s.active, "stats");
    assert.deepEqual(s.view, ["stats"]);
    // iskanje brez šumnikov najde orodja vseh predmetov; tap skoči v predmet in temo orodja
    await p.fill("#view-graph .tl-search input", "enacb");
    s = await state();
    assert.equal(s.topic, null);
    assert.deepEqual(s.tools, ["eq", "ode", "rxn"]);
    await p.click('#view-graph .tl-pick [data-tool="rxn"]');
    s = await state();
    assert.deepEqual([s.subj, s.topic, s.active], ["KEM", "rxn", "rxn"]);
    assert.equal(await p.inputValue("#view-graph .tl-search input"), "");
    await p.fill("#view-graph .tl-search input", "xyzq");
    assert.equal(await p.evaluate(() => !document.querySelector("#view-graph .tl-none").hidden), true);
    // fizika: enote; predmet brez izbranega orodja odpre prvo orodje predmeta
    await p.fill("#view-graph .tl-search input", "");
    await p.click('#view-graph .tl-subj [data-subj="FIZ"]');
    s = await state();
    assert.deepEqual([s.subj, s.topic, s.active], ["FIZ", "meas", "units"]);

    // Formule: iskanje »pitagor« pusti le kartice z zadetkom, kazalo se skrije; prazno iskanje vrne vse
    await p.evaluate(() => document.querySelector('#view-graph [data-calc-mode="formulas"]').click());
    await p.waitForSelector("#view-graph .fm .fm-sec", { timeout: 60000 });
    await p.evaluate(() => {
      document.querySelector('#view-graph .fm-subj [data-k="MAT"]').click();
      document.querySelector('#view-graph .fm-lvl [data-k="OS"]').click();
    });
    await p.waitForFunction(() => document.querySelector("#view-graph .fm-sec[id^=fm-MAT-OS]"), null, { timeout: 60000 });
    const all = await p.evaluate(() => document.querySelectorAll("#view-graph .fm-sec").length);
    await p.fill("#view-graph .fm-search input", "pitagor");
    await p.waitForTimeout(400);
    const f = await p.evaluate(() => {
      const r = document.querySelector("#view-graph .fm");
      const secs = [...r.querySelectorAll(".fm-sec")].filter((x) => !x.hidden);
      const items = [...r.querySelectorAll(".fm-item")].filter((x) => !x.hidden && x.getClientRects().length);
      return { secs: secs.length, items: items.map((x) => x.textContent), toc: r.querySelector(".fm-toc-bar").hidden, none: r.querySelector(".fm-none").hidden };
    });
    assert.ok(f.secs >= 1 && f.secs < all, `${f.secs} od ${all}`);
    assert.ok(f.items.every((x) => /pitagor/i.test(x)) || f.items.length === 0, f.items.join(" | "));
    assert.equal(f.toc, true);
    assert.equal(f.none, true);
    await p.fill("#view-graph .fm-search input", "qqqzz");
    await p.waitForTimeout(400);
    assert.equal(await p.evaluate(() => document.querySelector("#view-graph .fm-none").hidden), false);
    await p.fill("#view-graph .fm-search input", "");
    await p.waitForTimeout(400);
    assert.equal(await p.evaluate(() => [...document.querySelectorAll("#view-graph .fm-sec")].filter((x) => !x.hidden).length), all);
  } finally {
    await ctx.close();
    server.close();
  }
});
