// Nabor sprejemnega preizkusa poti Vadnica → inštruktor (test/fixtures/pot-vadnice/poti.json, scripts/meri-pot-vadnice.mjs):
// naloge so še iste (odtis besedila), napačni odgovori ustrezajo tipični napaki naloge, pravilni so pravilni. Brez klicev API.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import { generateTask } from "../server/practice/index.js";
import { checkAnswer } from "../server/practice/check.js";
import { diagnoza } from "../server/vaja-opomba.js";
import { nalogaPoti, pravilenOdgovor } from "../scripts/meri-pot-vadnice.mjs";

const N = JSON.parse(fs.readFileSync(new URL("./fixtures/pot-vadnice/poti.json", import.meta.url), "utf8"));

test("sestava: 30 poti, 18 z napako, 6 standardnih, 6 nestandardnih, 10 konceptov iz oblik A/B", () => {
  const st = N.poti.reduce((o, p) => ((o[p.vrsta] = (o[p.vrsta] || 0) + 1), o), {});
  assert.deepEqual(st, { napaka: 18, standard: 6, nestandard: 6 });
  assert.equal(Object.keys(N.naloge).length, 10);
  const oblike = JSON.parse(fs.readFileSync(new URL("../content/pilot-preizkus/matura-mat.json", import.meta.url), "utf8"));
  const iz = new Set(Object.values(oblike.forms).flat().map((t) => `${t.topicId}|${t.generator}`));
  for (const n of Object.values(N.naloge)) assert.ok(iz.has(`${n.topic}|${n.generator}`), n.topic);
  assert.equal(new Set(N.poti.map((p) => p.id)).size, 30);
});

test("naloge iz generatorjev so nespremenjene (odtis besedila)", () => {
  for (const [id, n] of Object.entries(N.naloge)) {
    const t = nalogaPoti(n);
    assert.equal(t.generator, n.generator, id);
    assert.equal(crypto.createHash("sha256").update(t.text).digest("hex").slice(0, 16), n.besedilo_odtis, id);
  }
});

test("napačni odgovori ustrezajo tipični napaki, pravilni so pravilni; popravek po pomoči je pravilen", () => {
  for (const p of N.poti) {
    const t = nalogaPoti(N.naloge[p.naloga]);
    if (p.vrsta === "napaka") {
      const d = diagnoza(t, p.odgovor);
      assert.equal(d.pravilno, false, p.id);
      assert.ok(d.napaka, `${p.id}: odgovor ${p.odgovor} ne ustreza nobeni tipični napaki`);
      assert.ok(p.napacen_korak, p.id);
    } else {
      assert.equal(checkAnswer(t.answer, p.odgovor, { convert: true, text: t.text, find: t.data?.find }).kind, "correct", p.id);
    }
    assert.equal(checkAnswer(t.answer, pravilenOdgovor(t.answer), { convert: true, text: t.text, find: t.data?.find }).kind, "correct", p.id);
  }
});

test("naloga za pot je ista kot pri generateTask (ista tema, raven, seme, letnik)", () => {
  const n = N.naloge.logaritem;
  assert.equal(nalogaPoti(n).text, generateTask(n.topic, n.level, n.seed, "sl", n.year).text);
});
