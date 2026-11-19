// Naloga iz pretekle pole, omenjena v klepetu (public/naloga-pole.js, j 19. 11. 2026): prepoznava omembe,
// iskanje pole v katalogu in naloge v naši poli, ime datoteke izvirnika na ric.si.
import test from "node:test";
import assert from "node:assert/strict";
import { mentionsPaperTask, parsePaperTask, resolvePaper, findPaperTask, originalFiles, ricFileName, fileMatches, looksLikeRicFile } from "../public/naloga-pole.js";
import { PAPERS_SI } from "../server/exam-papers-si.js";
import { ourPaperIds, loadOurPaper } from "../server/our-papers.js";
import { paperContext } from "../server/paper-context.js";

const ours = ourPaperIds();
const catalog = PAPERS_SI.map((e) => (ours.has(e.id) ? { ...e, ours: true } : e));

test("parsePaperTask: izpit, predmet, raven, leto, pola, del, številka in del naloge", () => {
  assert.deepEqual(parsePaperTask("matura mat OR 2024 pola 1 naloga 5"), { n: 5, exam: "MATURA", subject: "MAT", level: "OR", year: 2024, pola: 1 });
  assert.deepEqual(parsePaperTask("Matura matematika višja raven 2025, 2. pola, nalogo B3"), { n: 3, section: "B", exam: "MATURA", subject: "MAT", level: "VR", year: 2025, pola: 2 });
  assert.deepEqual(parsePaperTask("npz 9 fizika 2023 naloga 12b"), { n: 12, part: "b", exam: "NPZ9", subject: "FIZ", year: 2023 });
  assert.deepEqual(parsePaperTask("NPZ za 6. razred 2025, 3. naloga"), { n: 3, exam: "NPZ6", year: 2025 });
  assert.equal(parsePaperTask("matura mat or 2024 prva pola 3. naloga del B").section, "B");
  assert.equal(parsePaperTask("matura mat or 2024 druga izpitna pola naloga 2").pola, 2);
  assert.equal(parsePaperTask("matura 2024 jesenski rok naloga 4").term, "jesenski");
  assert.equal(parsePaperTask("matura mat osnovna raven 2024 naloga 1").level, "OR");
  // brez izpita ali brez številke naloge ni omembe; leto ni številka naloge
  assert.equal(parsePaperTask("Kako rešim enačbo x^2 = 4?"), null);
  assert.equal(parsePaperTask("Ali je ta naloga težka?"), null);
  assert.equal(parsePaperTask("matura 2024 naloga 2024"), null);
  assert.equal(parsePaperTask("Kaj pride na maturi iz matematike?"), null);
  assert.equal(mentionsPaperTask("matura mat OR 2024 naloga 5"), true);
  assert.equal(mentionsPaperTask("pomagaj mi pri nalogi 5"), false);
  // številka naloge ni številka pole
  assert.equal(parsePaperTask("matura mat OR 2024 naloga 1 pola 2").pola, 2);
  assert.equal(parsePaperTask("matura mat OR 2024 naloga 2 pola 1").pola, 1);
  assert.deepEqual([parsePaperTask("matura mat OR 2024 pola 1. naloga 5")].map((r) => [r.pola, r.n]), [[1, 5]]);
  assert.equal(parsePaperTask("matura mat OR 2024 naloga 5 b").part, "b");
});

test("mentionsPaperTask: samo kratka omemba s predmetom ali letom, ne vprašanje z nalogo", () => {
  for (const s of ["Koliko časa imam na maturi za 1. nalogo?", "maturantski ples, naloga 3", "Na maturi 2024 iz mat OR je bila 5. naloga taka: koliko je 3/4 od 20?", "Rešujem nalogo 3 iz zbirke za maturo, x^2=4", "Na maturi 2024 iz mat OR je bila 5. naloga taka, kako jo rešim", "Matura mat or 2024, v nalogi 5 imam 3 rešitve", `matura mat OR 2024 naloga 5 ${"in še nekaj besedila ".repeat(5)}`])
    assert.equal(mentionsPaperTask(s), false, s);
  for (const s of ["matura mat OR 2024 pola 1 naloga 5", "matura 2024 naloga 3", "npz 9 fizika naloga 12"]) assert.equal(mentionsPaperTask(s), true, s);
});

test("resolvePaper: manjkajoče vpraša z gumbi, sicer najde polo (privzeto spomladanski rok)", () => {
  const ask = (s) => resolvePaper(parsePaperTask(s), catalog);
  assert.equal(ask("matura naloga 5").ask, "subject");
  assert.equal(ask("matura mat naloga 5").ask, "level");
  const y = ask("matura mat OR naloga 5");
  assert.equal(y.ask, "year");
  assert.ok(y.options.length <= 4 && y.options.length >= 2);
  // najprej leta, za katera imamo svojo polo
  assert.ok(y.options.every((o) => catalog.some((e) => e.exam === "MATURA" && e.level === "OR" && e.year === o.value && e.ours)));
  assert.equal(ask("npz matematika 2025 naloga 3").ask, "exam");
  assert.equal(ask("matura mat OR 2024 naloga 5").entry.id, "MATURA-MAT-OR-2024-spomladanski");
  assert.equal(ask("matura mat OR 2024 jesenski naloga 5").entry.id, "MATURA-MAT-OR-2024-jesenski");
  assert.equal(ask("npz 9 matematika 2025 naloga 3").entry.id, "NPZ9-MAT-2025-redni");
  assert.ok(ask("matura mat OR 2001 naloga 5").none);
  // jesenski rok z dvema terminoma: vpraša ali izbere izbranega
  assert.equal(ask("matura biologija 2023 jesenski naloga 5").ask, "session");
  assert.equal(ask("matura biologija 2023 jesenski 2. termin naloga 5").entry.id, "MATURA-BIO-2023-jesenski-2");
  assert.equal(ask("matura biologija 2023 jesenski rok, termin 1, naloga 5").entry.id, "MATURA-BIO-2023-jesenski-1");
  assert.equal(ask("matura biologija 2023 jesenski drugi termin naloga 5").entry.id, "MATURA-BIO-2023-jesenski-2");
  assert.equal(parsePaperTask("matura bio 2023 jesenski 2. termin naloga 1").n, 1);
  // gumb doda besedilo, ki ga parser prepozna
  for (const o of ask("matura mat naloga 5").options) assert.equal(parsePaperTask(`matura mat naloga 5 ${o.add}`).level, o.value);
  for (const o of ask("matura naloga 5").options) assert.equal(parsePaperTask(`matura naloga 5 ${o.add}`).subject, o.value);
  for (const o of ask("npz matematika 2025 naloga 3").options) assert.equal(parsePaperTask(`npz matematika 2025 naloga 3 ${o.add}`).exam, o.value);
});

test("findPaperTask: pola in del iz naše pole, vprašanje pri dvoumni številki", () => {
  const paper = loadOurPaper("MATURA-MAT-OR-2024-spomladanski");
  const p = (s) => findPaperTask(paper, parsePaperTask(s));
  assert.equal(p("matura mat OR 2024 naloga 5").ask, "pola");
  const sec = p("matura mat OR 2024 pola 1 naloga 5");
  assert.equal(sec.ask, "section");
  assert.deepEqual(sec.options.map((o) => o.value), ["A", "B"]);
  for (const o of sec.options) assert.equal(parsePaperTask(`matura mat OR 2024 pola 1 naloga 5 ${o.add}`).section, o.value);
  const hit = p("matura mat OR 2024 pola 2 naloga B4");
  assert.equal(hit.task.pola, 2);
  assert.equal(hit.task.section, "B");
  assert.equal(hit.task.n, 4);
  assert.equal(hit.part, null);
  assert.equal(p("matura mat OR 2024 pola 2 naloga B4b").part.id, "b");
  assert.ok(p("matura mat OR 2024 pola 1 naloga A12").missing);
  const npz = findPaperTask(loadOurPaper("NPZ9-MAT-2025-redni"), parsePaperTask("npz 9 2025 naloga 3"));
  assert.equal(npz.task.n, 3);
});

test("izvirnik: povezava na polo (brez navodil za ocenjevanje) in ime datoteke na ric.si", () => {
  const e = catalog.find((x) => x.id === "MATURA-MAT-OR-2024-spomladanski");
  assert.deepEqual(originalFiles(e, 2).map((f) => f.kind), ["paper2"]);
  assert.deepEqual(originalFiles(e).map((f) => f.kind), ["paper1", "paper2"]);
  assert.equal(ricFileName(originalFiles(e, 1)[0].url), "M241-401-1-1.pdf");
  assert.equal(ricFileName("https://www.ric.si/mma/m211-421-1-1-pdf/2021101409035879/?m=1"), "m211-421-1-1.pdf");
  assert.equal(fileMatches("M241-401-1-1 (1).pdf", originalFiles(e, 1)[0].url), true);
  assert.equal(fileMatches("M241-401-1-2.pdf", originalFiles(e, 1)[0].url), false);
  assert.equal(fileMatches("m211-421-1-1-pdf.pdf", "https://www.ric.si/mma/m211-421-1-1-pdf/x/"), true);
  // stare pole: ric.si da drugačno ime kot povezava
  assert.equal(fileMatches("N111-401-2-1.pdf", "https://www.ric.si/mma/n111-401mat-2-1/x/"), true);
  assert.equal(ricFileName("https://www.ric.si/mma/n111-401mat-2-1/x/"), "n111-401-2-1.pdf");
  assert.equal(fileMatches("P042-C101-1-1.pdf", "https://www.ric.si/mma/m042-c101-1-1/x/"), true);
  assert.equal(fileMatches("M212-421-2-2 novo .pdf", "https://www.ric.si/mma/M212-421-2-2_novo_.pdf/x/"), true);
  assert.equal(fileMatches("P061-C101-1-1.pdf", "https://www.ric.si/mma/p061-c101-1/x/"), true);
  assert.equal(fileMatches("M241-401-1-12.pdf", "https://www.ric.si/mma/M241-401-1-1.pdf/x/"), false);
  assert.equal(looksLikeRicFile("P241-C101-1-2.pdf"), true);
  assert.equal(looksLikeRicFile("moja-pola.pdf"), false);
  // vsaka pola v katalogu ima prepoznavno ime datoteke
  for (const e of catalog) for (const f of originalFiles(e)) assert.ok(fileMatches(ricFileName(f.url), f.url), f.url);
});

test("paperContext: cela naloga z deli da inštruktorju rešitve vseh delov", () => {
  const paper = { tasks: [{ pola: 2, section: "B", n: 4, parts: [{ id: "a", answer: "$x = 2$", ways: [{ title: "1", text: "A" }] }, { id: "b", answer: "$y = 3$", ways: [{ title: "1", text: "B" }] }] }] };
  const a = paperContext({ paper: "P", task: "2-B4", ours: "X" }, { loadOurs: () => paper });
  assert.match(a, /worked solution/);
  assert.match(a, /a\)\n\$x = 2\$\nA\nb\)\n\$y = 3\$\nB/);
  // pole brez naše različice: učenec naloge še ni poslal, inštruktor je ne sme ugibati
  const none = paperContext({ paper: "Splošna matura – Biologija, 2023", task: "1-7", noText: true });
  assert.match(none, /has not sent the task text yet/);
  assert.match(none, /task 1-7/);
});

test("besedila naloge pole v klepetu: vsak jezik ima vse ključe in iste spremenljivke", async () => {
  const { default: SL } = await import("../public/naloga-pole/besedila/sl.js");
  const { UI_LANGUAGES } = await import("../public/i18n/languages.js");
  const fs = await import("node:fs");
  const vars = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join();
  for (const code of UI_LANGUAGES.filter((c) => c !== "sl")) {
    const d = JSON.parse(fs.readFileSync(new URL(`../public/naloga-pole/besedila/${code}.json`, import.meta.url), "utf8"));
    assert.deepEqual(Object.keys(d).sort(), Object.keys(SL).sort(), code);
    for (const k of Object.keys(SL)) assert.equal(vars(d[k]), vars(SL[k]), `${code} ${k}`);
  }
  // modul se naloži šele ob omembi pole: ni statičnega uvoza v app.js
  const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /import\("\.\/naloga-pole\/klepet\.js"\)/);
  assert.doesNotMatch(app, /from "\.\/naloga-pole\/klepet\.js"/);
});
