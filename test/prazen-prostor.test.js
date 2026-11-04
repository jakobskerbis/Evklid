// Prazen prostor na računalniku (j, 4. 11. 2026): Jaz, Napredek, Urnik, Lige in Moj kotiček dobijo vsebino,
// ki zapolni spodnji del strani (koledar aktivnosti, »Nadaljuj«, testi, urnik na steni, lestvica s 30 mesti, področja).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const pub = (f) => readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8");

test("napredek: API vrne XP po dnevih za zadnje leto", async () => {
  const store = openDb(":memory:");
  const server = createApp(store, {}).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const s = await (await fetch(`${base}/api/students`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Ana" }) })).json();
    const ins = store.db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, ?, 't', datetime('now', ?))");
    ins.run(s.id, 20, "-0 days");
    ins.run(s.id, 5, "-0 days");
    ins.run(s.id, 40, "-200 days");
    ins.run(s.id, 99, "-400 days"); // starejše od leta ni v koledarju
    const p = await (await fetch(`${base}/api/students/${s.id}/progress`)).json();
    assert.equal(p.xpDays.length, 2);
    assert.equal(p.xpDays.at(-1).xp, 25);
    assert.deepEqual(Object.keys(p.xpDays[0]).sort(), ["day", "xp"]);
  } finally {
    server.close();
  }
});

test("koledar aktivnosti: 53 tednov po 7 dni, nizi in ta teden", async () => {
  globalThis.document ??= { documentElement: { lang: "sl" }, querySelector: () => null, querySelectorAll: () => [] };
  globalThis.localStorage ??= { getItem: () => null, setItem: () => {} };
  globalThis.navigator ??= { language: "sl" };
  const { heatmapHtml, activityStats, weeksHtml } = await import("../public/aktivnost.js");
  const now = new Date("2026-11-04T12:00:00Z"); // sreda
  const day = (n) => new Date(+now - n * 86400000).toISOString().slice(0, 10);
  const xp = [0, 1, 2, 5, 6, 7, 8].map((n) => ({ day: day(n), xp: 10 + n }));
  const st = activityStats(xp, now);
  assert.equal(st.active, 7);
  assert.equal(st.best, 4); // 5., 6., 7. in 8. dan nazaj
  assert.equal(st.week, 10 + 11 + 12); // pon–sre
  const html = heatmapHtml(xp, now).split('class="hm-foot"')[0]; // brez legende
  assert.equal((html.match(/class="hm-m"/g) || []).length, 53, "oznaka meseca na vrh vsakega tedna");
  assert.equal((html.match(/<i class="hm-d (?:l\d|future)/g) || []).length, 53 * 7);
  assert.equal((html.match(/hm-d future/g) || []).length, 4, "čet–ned tega tedna še ni");
  assert.match(html, /hm-d l\d today/);
  assert.equal((weeksHtml(xp, now).match(/class="wk"/g) || []).length, 12);
  // Ozek vsebnik skrije prvih 27 tednov (27 × 8 celic), tako da ostane zadnje pol leta.
  assert.match(pub("ui.css"), /@container \(max-width: 560px\) \{ \.hm-grid > :nth-child\(-n \+ 216\)/);
});

test("Napredek in Jaz pokažeta koledar; Jaz ima Nadaljuj in teste", () => {
  const html = pub("index.html");
  assert.match(html, /class="card prog-akt"[\s\S]{0,120}id="prog-heatmap"/);
  assert.match(html, /id="prog-weeks"/);
  assert.match(html, /id="me-overview"/);
  const app = pub("app.js");
  assert.match(app, /\$\("#prog-heatmap"\)\.innerHTML = heatmapHtml\(p\.xpDays\)/);
  assert.match(app, /async function loadMeOverview\(\)[\s\S]{0,2000}heatmapHtml\(p\?\.xpDays \|\| \[\]\)/);
  assert.match(app, /b\.dataset\.me === "daily"\) startSession\("daily"/);
  assert.match(pub("ui.css"), /#view-progress > :is\(h1, \.prog-akt\) \{ flex-basis: 100%/);
});

test("Urnik: teden kot mreža čez vso širino, prazno polje doda uro ob ta dan in uro", () => {
  const js = pub("schedule.js");
  assert.match(js, /function gridHtml\(s, days\)/);
  assert.match(js, /data-add='\$\{JSON\.stringify\(at\)\}'/);
  assert.match(js, /\[data-add\]"\)\.forEach\(\(x\) => x\.addEventListener\("click", \(\) => lessonForm\(null, JSON\.parse/);
  assert.match(js, /function lessonForm\(l = null, at = \{\}\)/);
  const css = pub("schedule.css");
  assert.match(css, /\.sch-body \{[^}]*container-type: inline-size/);
  assert.match(css, /@container \(min-width: 640px\) \{[\s\S]*?\.sch-list \{ display: none; \}[\s\S]*?\.sch-grid \{[^}]*display: grid/);
});

test("Lige: tedenska lestvica čez vso širino, 30 mest v stolpcih, prosta mesta samo na širokem", () => {
  const js = pub("leagues.js");
  assert.match(js, /boardHtml\(L\.board, true, L\.groupSize \|\| 30\)/);
  assert.match(js, /class="card lg-weekly"/);
  const css = pub("leagues.css");
  assert.match(css, /#league-content > :is\(\.league-hero, \.lg-weekly\) \{ column-span: all; \}/);
  assert.match(css, /@container \(max-width: 640px\) \{ \.league-board li\.free \{ display: none; \} \}/);
});

test("Moj kotiček: brez novic ponudi področja, ki jih učenec še nima", () => {
  const js = pub("corner.js");
  assert.match(js, /function moreHtml\(s\)/);
  assert.match(js, /data-add-int/);
  assert.match(js, /if \(add\) return addInterest\(add\.dataset\.addInt\)/);
});

test("Jaz: vrstice mreže po vsebini, da se kartica s profilom ne stisne pod ikono (telefon, j 4. 11.)", () => {
  const rule = pub("ui.css").match(/#view-me \{ display: grid;[^}]*\}/)?.[0] || "";
  assert.match(rule, /grid-auto-rows: max-content/);
});
