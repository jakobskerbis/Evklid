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
