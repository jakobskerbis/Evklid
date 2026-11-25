// Zavihek Laboratorij (public/laboratorij.js, server/laboratorij.js): vsi poskusi »lab-…« iz kataloga,
// vsak enkrat, z obstoječo simulacijo in temami učbenika; zaklep kot pri lekciji v učbeniku.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { SIM_TOPICS, simsForTopic, labExperiments, labKey, LAB_INFO } from "../public/sim/katalog.js";
import { ENGINES } from "../public/sim/index.js";
import { labList } from "../server/laboratorij.js";
import { getTopic } from "../server/curriculum.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { openWindowIntent, WINDOW_VIEWS } from "../server/chat-settings.js";

test("every lab- sim in the catalogue is in the lab list once, with an engine, info and its topics", () => {
  const list = labExperiments();
  const keys = list.map((x) => x.key);
  assert.equal(new Set(keys).size, keys.length, "poskus dvakrat na seznamu");
  for (const [topicId] of Object.entries(SIM_TOPICS))
    for (const d of simsForTopic(topicId).filter((d) => d.id.startsWith("lab-"))) {
      const x = list.find((y) => y.key === labKey(d.id, d.opts));
      assert.ok(x, `${d.id} pri ${topicId} ni v laboratoriju`);
      assert.ok(x.topics.some((tp) => tp.id === topicId), `${topicId} manjka pri ${x.key}`);
      assert.ok(Object.hasOwn(ENGINES, d.id), `simulacija ${d.id} ne obstaja`);
      assert.ok(getTopic(topicId), `tema ${topicId} ne obstaja`);
    }
  for (const x of list) {
    const info = LAB_INFO[x.key] || LAB_INFO[x.id];
    assert.ok(info?.title && info.desc && info.subject, `${x.key}: manjka naslov, opis ali predmet v LAB_INFO`);
  }
  // Vsak laboratorijski motor je tudi pri kakšni temi (sicer ga v zavihku ne bi bilo).
  for (const id of Object.keys(ENGINES).filter((k) => k.startsWith("lab-"))) assert.ok(list.some((x) => x.id === id), `${id} ni pri nobeni temi`);
  assert.ok(list.length >= 2);
});

test("lab list: the student's subject and grade first", () => {
  const kem = labList("KEM-OS-8");
  assert.equal(kem[0].subject, "KEM");
  assert.equal(kem[0].topics[0].path, "KEM-OS-8");
  const fiz = labList("FIZ-SS-2");
  assert.equal(fiz[0].subject, "FIZ");
  assert.equal(fiz[0].topics[0].path, "FIZ-SS-2");
  // Matematika 8. razred: najprej poskusi 8. razreda (kemija in od »Silomer in uteži« tudi fizika), šele nato 9. razred in SŠ.
  assert.match(labList("MAT-OS-8")[0].topics[0].path, /-OS-8$/);
  const m8 = labList("MAT-OS-8"), iFiz8 = m8.findIndex((x) => x.subject === "FIZ" && x.topics[0].path === "FIZ-OS-8");
  assert.ok(iFiz8 >= 0 && iFiz8 < m8.findIndex((x) => x.key === "lab-ohm"), "fizika 8. razreda pred lab-ohm (9. razred)");
  assert.ok(m8.findIndex((x) => x.key === "lab-co2") < m8.findIndex((x) => x.key === "lab-titracija"));
  for (const x of labList("")) assert.ok(x.topics.every((tp) => tp.name && tp.level && tp.path), x.key);
});

test("HTTP: lab list without accounts is unlocked (as the textbook)", async () => {
  const store = openDb(":memory:");
  const server = createApp(store).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const s = store.createStudent("Ana");
    const r = await (await fetch(`${base}/api/students/${s.id}/lab`)).json();
    assert.ok(r.experiments.length >= 2);
    assert.ok(r.experiments.every((x) => !x.locked && x.id && ENGINES[x.id]));
    const lesson = await (await fetch(`${base}/api/students/${s.id}/lesson?id=FIZ-OS-9/upor-in-ohmov-zakon`)).json();
    assert.equal(lesson.interactive, true);
  } finally {
    server.close();
    store.db.close();
  }
});

test("lab view: tab in »Uči se«, i18n and the tutor's open-window command", () => {
  const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
  assert.match(html, /data-uci-tab="lab"/);
  assert.match(html, /<section id="view-lab" class="uci-pane/);
  assert.ok(WINDOW_VIEWS.includes("lab"));
  assert.equal(openWindowIntent("odpri laboratorij").view, "lab");
});

test("povezave C3: graf meritev izpiše formulo iz lekcije (prvih 5 poskusov)", () => {
  const read = (p) => fs.readFileSync(new URL(`../public/sim/${p}`, import.meta.url), "utf8");
  assert.match(read("lab.js"), /if \(formula\) wrap\.append\(h\("p", \{ class: "lab-graph-formula", html: `Formula: \$\{formula\}` \}\)\)/);
  assert.ok(read("lab-fiz.js").includes("formula: tex(String.raw`I = \\frac{U}{R}`)"));
  assert.ok(read("lab-elektrika.js").includes("formula: tex(String.raw`R = \\frac{U}{I}`)"));
  assert.match(read("lab-sile.js"), /formula: "<i>F<\/i> = <i>k<\/i> · <i>x<\/i>"/);
  assert.match(read("lab-optika.js"), /formula: "<i>n<\/i>₁ sin α = <i>n<\/i>₂ sin β"/);
  assert.ok(read("lab-optika.js").includes("formula: tex(String.raw`\\frac{1}{f} = \\frac{1}{a} + \\frac{1}{b}`)"));
});

test("povezave C3: druga skupina formul (gostota, vzgon, tlak, sila na vodnik), oznake kot v poskusu", () => {
  const read = (p) => fs.readFileSync(new URL(`../public/sim/${p}`, import.meta.url), "utf8");
  const sile = read("lab-sile.js");
  assert.ok(sile.includes('formula: "<i>m</i> = ρ · <i>V</i>"'));
  assert.ok(sile.includes('formula: "<i>F</i><sub>vzg</sub> = ρ<sub>tek</sub> · <i>g</i> · <i>V</i><sub>izp</sub>"'));
  assert.ok(sile.includes('formula: "<i>p</i> = ρ · <i>g</i> · <i>h</i> = ρ<sub>v</sub> · <i>g</i> · Δ<i>h</i>"'));
  assert.equal(read("lab-magnetizem.js").split('formula: "<i>F</i> = <i>I</i> · <i>L</i> · <i>B</i>"').length - 1, 2);
});
