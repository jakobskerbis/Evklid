import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSettings } from "../server/settings.js";
import { pathKeyFor } from "../server/curriculum.js";

const uni = { educational_track: "UNIVERZA", study_program: "UM-FKKT-KI", curriculum_level: "1. letnik" };

test("fakulteta: predmet iz predmetnika izbrane smeri določi učno pot in predmet aplikacije", () => {
  const s = normalizeSettings({ ...uni, subject: "MAT", study_course: "UNI-UMFKKT-ANORG" });
  assert.equal(s.study_course, "UNI-UMFKKT-ANORG");
  assert.equal(s.subject, "KEM");
  assert.equal(pathKeyFor(s), "UNI-UMFKKT-ANORG");
  // Izbirni predmet velja v vsakem letniku.
  assert.equal(normalizeSettings({ ...uni, study_course: "UNI-UMFKKT-WBIOTEH" }).subject, "BIO");
  // Predmet drugega programa ali letnika ne velja: prvi predmet letnika po predmetu aplikacije.
  const other = normalizeSettings({ ...uni, subject: "FIZ", study_course: "UNI-ULFKKT-XYZ" });
  assert.equal(other.study_course, "");
  assert.equal(pathKeyFor(other), "UNI-UMFKKT-FIZ1");
  const next = normalizeSettings({ ...s, curriculum_level: "2. letnik" });
  assert.equal(next.study_course, "", "po prehodu v višji letnik velja predmetnik novega letnika");
  // OŠ in SŠ: brez predmeta iz predmetnika.
  assert.equal(normalizeSettings({ educational_track: "SREDNJA_SOLA", curriculum_level: "2. letnik", study_course: "UNI-UMFKKT-ANORG" }).study_course, "");
});

test("predmetnik OŠ: v 6. in 7. razredu naravoslovje namesto fizike in kemije", async () => {
  const { getPath, getTopic, baseTopicIds } = await import("../server/curriculum.js");
  const six = normalizeSettings({ educational_track: "OSNOVNA_SOLA", curriculum_level: "6. razred", subject: "FIZ" });
  assert.equal(six.subject, "NAR");
  assert.equal(pathKeyFor(six), "NAR-OS-6");
  assert.equal(pathKeyFor(normalizeSettings({ ...six, curriculum_level: "7. razred" })), "NAR-OS-7");
  assert.equal(normalizeSettings({ ...six, curriculum_level: "8. razred" }).subject, "FIZ", "v 8. razredu naravoslovja ni več");
  assert.equal(normalizeSettings({ educational_track: "OSNOVNA_SOLA", curriculum_level: "7. razred", subject: "MAT" }).subject, "MAT");
  assert.equal(normalizeSettings({ educational_track: "SREDNJA_SOLA", curriculum_level: "1. letnik", subject: "NAR" }).subject, "FIZ");
  assert.ok(getPath("NAR-OS-6").units.length >= 4);
  // Teme, ki se prekrivajo s fiziko in kemijo, vzamejo naloge iz osnovne teme.
  assert.deepEqual(baseTopicIds("NAR-OS-7/raztopine"), ["KEM-OS-9/raztopine"]);
  assert.equal(getTopic("NAR-OS-6/zgradba-rastline").subject, "NAR");
});

test("OŠ 1.–5. razred: izbira je dovoljena, učna pot pa je zaenkrat snov 6. razreda", () => {
  const three = normalizeSettings({ educational_track: "OSNOVNA_SOLA", curriculum_level: "3. razred", subject: "FIZ" });
  assert.equal(three.curriculum_level, "3. razred");
  assert.equal(three.subject, "NAR", "v nižjih razredih ni fizike");
  assert.equal(pathKeyFor(three), "NAR-OS-6");
  assert.equal(pathKeyFor({ ...three, subject: "MAT" }), "MAT-OS-6");
});
