import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSettings } from "../server/settings.js";
import { pathKeyFor, topicOrder, listPaths } from "../server/curriculum.js";
import { generateTask, hasGenerator } from "../server/practice/index.js";
import { simsForTopic } from "../public/sim/katalog.js";
import { cross, transcribe, translate, enzymeActivity } from "../public/sim/bio.js";

const BIO = ["BIO-OS-8", "BIO-OS-9", "BIO-SS-1", "BIO-SS-2", "BIO-SS-3", "BIO-SS-4"];

test("biologija po predmetniku: od 8. razreda in v gimnaziji, v 6. in 7. naravoslovje", () => {
  const os8 = normalizeSettings({ educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "BIO" });
  assert.equal(os8.subject, "BIO");
  assert.equal(pathKeyFor(os8), "BIO-OS-8");
  assert.equal(pathKeyFor({ ...os8, curriculum_level: "9. razred" }), "BIO-OS-9");
  assert.equal(normalizeSettings({ ...os8, curriculum_level: "6. razred" }).subject, "NAR");
  const ss = normalizeSettings({ educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik", subject: "BIO" });
  assert.equal(pathKeyFor(ss), "BIO-SS-4");
  assert.ok(listPaths("BIO").every((p) => p.school !== "UNI"), "fakultetna biologija ni med šolskimi potmi");
  assert.deepEqual(listPaths("BIO").map((p) => p.key), BIO);
});

test("vsaka tema biologije ima simulacijo in naloge", () => {
  for (const key of BIO)
    for (const t of topicOrder(key)) {
      assert.ok(simsForTopic(t.id).length, `${t.id}: simulacija`);
      assert.ok(hasGenerator(t.id), `${t.id}: naloge`);
      for (let level = 1; level <= 3; level++) assert.ok(generateTask(t.id, level, 7).answer, `${t.id} L${level}`);
    }
});

test("križanje, genetski kod in encimi računajo pravilno", () => {
  const mono = cross("mono", "Aa", "Aa");
  assert.deepEqual(Object.fromEntries(mono.geno), { AA: 1, Aa: 2, aa: 1 });
  const di = cross("di", "AaBb", "AaBb");
  assert.equal(di.n, 16);
  assert.equal(di.cells.filter((c) => c === "aabb").length, 1);
  assert.equal(di.cells.filter((c) => c.includes("A") && c.includes("B")).length, 9);
  const abo = cross("krvne", "Ai", "Bi");
  assert.deepEqual(abo.cells.sort(), ["AB", "Ai", "Bi", "ii"]);
  const x = cross("x", "XBXb", "XBY");
  assert.equal(x.cells.filter((c) => c === "XbY").length, 1, "četrtina otrok je bolan sin");
  assert.equal(transcribe("TACGGTCTAAAGATT"), "AUGCCAGAUUUCUAA");
  assert.deepEqual(translate("AUGCCAGAUUUCUAA"), ["Met", "Pro", "Asp", "Phe", "STOP"]);
  assert.ok(enzymeActivity("pepsin", 37, 2) > 0.95 && enzymeActivity("pepsin", 37, 7) < 0.05);
  assert.ok(enzymeActivity("amilaza", 70, 7) === 0, "nad optimumom se encim denaturira");
});
