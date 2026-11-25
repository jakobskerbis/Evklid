// Imena tem in sklopov v jeziku vmesnika (server/imena-tem/*.json, server/curriculum.js localTopic):
// učenec z nemškim, hrvaškim, italijanskim, madžarskim ali angleškim vmesnikom na mednarodni poti
// ne vidi slovenskih (ali angleških) imen tem in sklopov.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { getPath, getTopic, localTopic, localUnitTitle } from "../server/curriculum.js";
import { EN, EN_UNITS, INT_LEVELS } from "../server/region-curricula.js";
import { LIVE_UI_LANGUAGES } from "../public/i18n/languages.js";
import { openDb } from "../server/db.js";
import { Progress } from "../server/progress.js";

const imena = (l) => JSON.parse(fs.readFileSync(new URL(`../server/imena-tem/${l}.json`, import.meta.url), "utf8"));
const PREVEDENI = LIVE_UI_LANGUAGES.filter((l) => l !== "sl" && l !== "en");
const INT_POTI = Object.entries(INT_LEVELS).flatMap(([s, levels]) => Object.keys(levels).map((n) => `${s}-INT-${n}`));

test("prevodi imen: vsak ključ je obstoječa slovenska tema ali sklop, nobeno ime ni prazno", () => {
  for (const l of [...PREVEDENI, "en"]) {
    const d = imena(l);
    for (const [id, ime] of Object.entries(d.teme)) {
      assert.ok(getTopic(id) && !getTopic(id).base, `${l}: ${id} ni slovenska tema`);
      assert.ok(typeof ime === "string" && ime.trim() === ime && ime.length > 1, `${l}: ${id}`);
    }
    for (const [sklop, ime] of Object.entries(d.sklopi || {})) {
      assert.ok(EN_UNITS[sklop], `${l}: sklop »${sklop}« ne obstaja`);
      assert.ok(ime.trim() === ime && ime.length > 1, `${l}: ${sklop}`);
    }
  }
  // Angleški dodatek samo za teme, ki jih EN še nima (sicer bi se imeni razšli).
  for (const id of Object.keys(imena("en").teme)) assert.ok(!EN[id], `en.json: ${id} je že v EN`);
});

test("nemška, hrvaška, italijanska, madžarska in angleška mednarodna pot nimajo slovenskih imen tem in sklopov", () => {
  const d = Object.fromEntries(PREVEDENI.map((l) => [l, imena(l)]));
  const en = imena("en");
  let n = 0;
  for (const key of INT_POTI) {
    for (const u of getPath(key).units) {
      for (const t of u.topics) {
        const id = t.base[0];
        n++;
        for (const l of PREVEDENI) {
          assert.equal(localTopic(t, l).name, d[l].teme[id], `${l}: ${t.id} (${t.sl.name})`);
          assert.equal(localTopic(t, l).unit, d[l].sklopi[t.sl.unit], `${l}: sklop ${t.sl.unit}`);
        }
        const ang = localTopic(t, "en");
        assert.equal(ang.name, EN[id]?.split("|")[0].trim() || en.teme[id], `en: ${t.id}`);
        assert.ok(EN[id] || en.cilji[id], `en: cilji ${t.id}`);
        assert.notEqual(ang.goals, t.sl.goals, `en: cilji ${t.id} so slovenski`);
        // Slovenski vmesnik ostane slovenski.
        assert.equal(localTopic(t, "sl").name, t.sl.name);
      }
      for (const l of PREVEDENI) assert.equal(localUnitTitle(u, l), d[l].sklopi[u.sl.title], `${l}: ${key} ${u.sl.title}`);
      assert.equal(localUnitTitle(u, "en"), EN_UNITS[u.sl.title]);
      assert.equal(localUnitTitle(u, "sl"), u.sl.title);
    }
  }
  assert.ok(n > 300, `${n} tem`);
});

test("veriga jezikov: srbščina dobi hrvaška imena, francoščina angleška; slovenske poti v drugem jeziku", () => {
  const t = getPath("MAT-INT-11").units[0].topics.find((x) => x.base[0] === "MAT-SS-2/iracionalne-enacbe");
  assert.equal(localTopic(t, "de").name, "Wurzelgleichungen");
  assert.equal(localTopic(t, "sr").name, "Iracionalne jednadžbe");
  assert.equal(localTopic(t, "fr").name, "Equations with surds");
  assert.equal(localTopic(t, "sl").name, "Iracionalne enačbe");
  // Slovenska pot z nemškim vmesnikom: ista imena po id slovenske teme.
  const si = getTopic("MAT-SS-2/iracionalne-enacbe");
  assert.equal(localTopic(si, "de").name, "Wurzelgleichungen");
  assert.equal(localTopic(si, "sl").name, si.name);
  assert.equal(localUnitTitle(getPath("MAT-SS-2").units[0], "hu"), "Hatványok és gyökök");
  // Indijska pot ima svoja angleška imena; fakultetne teme ostanejo, kot so (tudi sklop).
  const ind = getTopic("MAT-IN-8/squares-and-their-patterns");
  assert.equal(localTopic(ind, "de").name, ind.name);
  const uni = getTopic("UNI-ULFKKT-MAT/odvod-funkcije");
  assert.ok(uni, "fakultetna tema");
  for (const l of LIVE_UI_LANGUAGES) assert.deepEqual(localTopic(uni, l), uni, l);
});

test("učna pot nemškega učenca: imena tem in sklopov v nemščini", () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Lena", { school_system: "DE", curriculum_level: "Klasse 12 (Q1)", language: "de" });
  const view = new Progress(store).pathView(s.id, "MAT-INT-11");
  const de = imena("de");
  const imenaDe = new Set(Object.values(de.teme));
  const sklopiDe = new Set(Object.values(de.sklopi));
  assert.ok(view.units.length > 3);
  for (const u of view.units) {
    assert.ok(sklopiDe.has(u.title), u.title);
    for (const t of u.topics) assert.ok(imenaDe.has(t.name), t.name);
  }
  assert.ok(imenaDe.has(view.next.name));
});
