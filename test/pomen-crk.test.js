// Pomen črk po predmetu, razdelku in formuli (j, 1. 11. 2026): na listu s formulami iz matematike
// c ni »hitrost svetlobe«; izbire z logičnimi znaki se izrišejo, ne kot surov TeX.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { withFormulaSubject, symbolsIn } from "../public/formula-data.js";
import { checkFormulaSheet, foreignMeanings } from "../server/lesson-check.js";
import { formulaSheetSections, FORMULAS_DIR } from "../server/textbook.js";
import { generateTask, optionsAreTex, publicTask } from "../server/practice/index.js";

const SHEET = `## Števila

| | |
|---|---|
| Zakon o združevanju | $(a + b) + c = a + (b + c)$ |

:::simboli
a, b, c | poljubna števila | | |
:::

## Kvadratna enačba

| | |
|---|---|
| Rešitvi | $x_{1,2} = \\dfrac{-b \\pm \\sqrt{D}}{2a}$ |
`;

test("list s formulami: vsak razdelek ima svoje oznake, bloki se ne izpišejo", () => {
  const problems = checkFormulaSheet(SHEET, "MAT");
  assert.equal(problems.length, 1, problems.join("\n"));
  assert.match(problems[0], /Kvadratna enačba: ni bloka/);
  assert.ok(!problems.some((p) => p.startsWith("Števila")));
});

test("tuj pomen: c = hitrost svetlobe v matematiki je napaka, v fiziki ne", () => {
  const list = [{ keys: ["c"], n: "hitrost svetlobe (valovanja)" }, { keys: ["a"], n: "poljubno število" }];
  assert.equal(foreignMeanings(list, "MAT").length, 1);
  assert.match(foreignMeanings(list, "MAT")[0], /»c«.*FIZ/);
  assert.equal(foreignMeanings(list, "FIZ").length, 0);
});

test("oznake razdelka imajo prednost; brez njih velja slovar predmeta lista, ne fizike", () => {
  const tex = "(a + b) + c = a + (b + c)";
  const withGlossary = withFormulaSubject("MAT", () => symbolsIn(tex), [{ keys: ["a", "b", "c"], tex: ["a", "b", "c"], n: "poljubna števila", r: "", u: "", note: "" }]);
  assert.ok(withGlossary.every(([, subj]) => subj[0] === "@"));
  // Brez oznak: matematika nima pomena za c zunaj kvadratne enačbe.
  assert.deepEqual(symbolsIn(tex, "MAT"), []);
  // Tudi fizika tu nima pomena (pregled 463 §4); c = λν pa je hitrost svetlobe.
  assert.deepEqual(symbolsIn(tex, "FIZ"), []);
  assert.ok(symbolsIn("c = \\lambda \\nu", "FIZ").some(([k]) => k === "c"));
});

test("vsi listi s formulami: vsaka črka ima vrstico v svojem razdelku, brez tujih pomenov", () => {
  for (const f of fs.readdirSync(FORMULAS_DIR).filter((x) => x.endsWith(".md"))) {
    const key = f.slice(0, -3);
    const raw = fs.readFileSync(path.join(FORMULAS_DIR, f), "utf8");
    assert.deepEqual(checkFormulaSheet(raw, key.split("-")[0]), [], key);
    const sheet = formulaSheetSections(key);
    assert.ok(!sheet.md.includes(":::simboli"), `${key}: blok se ne sme izpisati`);
    assert.ok(sheet.sections.filter((s) => /\$/.test(s.md)).every((s) => s.symbols.length), `${key}: razdelek brez oznak`);
  }
});

test("izbire: čisti TeX se izriše kot formula tudi brez options_tex", () => {
  let found = 0;
  for (let s = 0; s < 80 && !found; s++) {
    const t = generateTask("MAT-SS-1/osnove-logike", 2, s * 7919 + 2, "sl");
    if (t.answer.type !== "choice" || !t.answer.options.some((o) => /\\wedge|\\vee|\\Rightarrow|\\neg/.test(o))) continue;
    found++;
    assert.equal(publicTask(t).optionsTex, true);
  }
  assert.ok(found, "naloga z logičnimi znaki v izbirah");
  // Besedilo z $…$ ostane besedilo (odjemalec izriše le dele med $).
  assert.equal(optionsAreTex({ answer: { type: "choice", options: ["$f(x) = x^4$", "$f(x) = x^3$"] } }), false);
  assert.equal(optionsAreTex({ answer: { type: "choice", options: ["da", "ne"] } }), false);
});
