import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// i18n.js ob nalaganju prevede statične napise v strani: v Node je stran prazna.
globalThis.document ??= { documentElement: { dataset: {} }, querySelectorAll: () => [] };
const { levelChoices } = await import("../public/level-picker.js");

// Glava Inštruktorja (j, 4. 11.): predmet, način in letnik se zamenjajo kar v glavi.
test("tutor header: year choices keep the school type and mark the current year", () => {
  const os = levelChoices({ educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred" });
  assert.equal(os.length, 9);
  assert.equal(os.find((x) => x.current).settings.curriculum_level, "8. razred");
  const ss = levelChoices({ educational_track: "SREDNJA_SOLA", curriculum_level: "2. letnik gimnazija" });
  assert.deepEqual(ss.map((x) => x.settings.curriculum_level).slice(0, 2), ["1. letnik gimnazija", "2. letnik gimnazija"]);
  assert.equal(ss.filter((x) => x.current).length, 1);
  const uni = levelChoices({ educational_track: "UNIVERZA", study_program: "UL-FKKT-KEM", curriculum_level: "1. letnik" });
  assert.ok(uni.every((x) => x.settings.study_program === "UL-FKKT-KEM"), "program ostane");
  const reg = levelChoices({ school_system: "IN-CBSE", educational_track: "SREDNJA_SOLA", curriculum_level: "Class 9" });
  assert.deepEqual(reg.map((x) => x.label), ["Class 9", "Class 10"], "le razredi iste stopnje");
  assert.ok(reg.every((x) => x.settings.school_system === "IN-CBSE"));
  assert.deepEqual(levelChoices({}), []);
});

test("tutor header: subject, mode and year are dropdowns, the programme stays text", () => {
  const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  const fn = app.slice(app.indexOf("function renderState("), app.indexOf("// Formule v odgovorih inštruktorja"));
  for (const k of ["subject", "mode", "level"]) assert.match(fn, new RegExp(`pick\\("${k}"`), k);
  assert.match(fn, /program && `<span class="chip">/);
  assert.match(fn, /pickSubject\(it\)/, "predmet kot v meniju profila");
  assert.match(fn, /solving_mode: e\.target\.value/);
  assert.match(fn, /schoolSubjectsFor\(next\.educational_track/, "predmet, ki ga novi razred nima, se zamenja");
  const css = readFileSync(new URL("../public/style.css", import.meta.url), "utf8");
  assert.match(css, /\.chat-head #chat-state \.chip-pick \.dd-btn \{[^}]*border: 0/, "tih meni brez okvirja");
});
