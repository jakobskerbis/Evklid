import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { getTopic, listPaths, topicOrder, sameTopics } from "../server/curriculum.js";
import { parseLesson, lessonView, searchTextbook, tocView, simsFor, LESSONS_DIR, lessonSummaryForPrompt, expandFormulaBlocks, hideSolutions } from "../server/textbook.js";
import { checkLessonSource } from "../server/lesson-check.js";
import { SIM_TOPICS, simsForTopic } from "../public/sim/katalog.js";
import { hasEngine } from "../public/sim/index.js";

test("parseLesson: front matter, sections, alternatives, checks", () => {
  const l = parseLesson(`---
stanje: pregledano
demo: ohm
---
## Razlaga
Besedilo.
## Drugače: Na sliki
Slika.
## Preveri se
? Koliko je $2 + 2$?
- 3
+ 4
> Ker je tako.
? Brez pravilnega
- a
- b
`);
  assert.equal(l.meta.stanje, "pregledano");
  assert.equal(l.meta.demo, "ohm");
  assert.deepEqual(l.sections, [{ title: "Razlaga", md: "Besedilo." }]);
  assert.deepEqual(l.alternatives, [{ title: "Na sliki", md: "Slika." }]);
  assert.equal(l.checks.length, 1, "vprašanje brez pravilnega odgovora se izpusti");
  assert.deepEqual(l.checks[0], { q: "Koliko je $2 + 2$?", options: ["3", "4"], correct: 1, why: "Ker je tako.", optionWhy: ["", ""] });
});

test("lesson files load for competition paths too", () => {
  const dir = path.join(LESSONS_DIR, "MAT-TEK-OS");
  fs.mkdirSync(dir, { recursive: true });
  const topic = tocView("MAT-TEK-OS").units[0].topics[0];
  const real = path.join(LESSONS_DIR, `${topic.id}.md`);
  const existed = fs.existsSync(real);
  if (!existed) fs.writeFileSync(real, fs.readFileSync(path.join(LESSONS_DIR, "FIZ-OS-9", "upor-in-ohmov-zakon.md"), "utf8"));
  try {
    assert.ok(lessonView(topic.id).lesson, "lekcija tekmovalne poti se naloži");
  } finally {
    if (!existed) fs.rmSync(real);
    if (!fs.readdirSync(dir).length) fs.rmdirSync(dir);
  }
});

test("university topic shared by several courses uses one lesson", () => {
  const shared = sameTopics("UNI-ULFKKT-MAT/" + tocView("UNI-ULFKKT-MAT").units[0].topics[0].id.split("/")[1]);
  assert.ok(shared.length > 1, "prva tema UL FKKT Matematike je tudi v drugih predmetih");
  const [first, other] = shared;
  const dir = path.join(LESSONS_DIR, first.split("/")[0]);
  const file = path.join(LESSONS_DIR, `${first}.md`);
  const hadDir = fs.existsSync(dir);
  const existed = fs.existsSync(file);
  fs.mkdirSync(dir, { recursive: true });
  if (!existed) fs.writeFileSync(file, fs.readFileSync(path.join(LESSONS_DIR, "FIZ-OS-9", "upor-in-ohmov-zakon.md"), "utf8"));
  try {
    assert.ok(lessonView(other).lesson, "druga kopija teme vzame skupno lekcijo");
    assert.equal(getTopic(other).name, getTopic(first).name);
  } finally {
    if (!existed) fs.rmSync(file);
    if (!hadDir) fs.rmdirSync(dir);
  }
});

test("worked-example solution sits behind »Pokaži rešitev«; the closing »Premisli« stays visible", () => {
  const md = [
    "### Primer 1: hitrost",
    "",
    "Avto prevozi 100 km v 2 h. Kolikšna je hitrost?",
    "",
    "**Rešitev:** Uporabimo $v = s/t$.",
    "",
    "$v = 50$ km/h.",
    "",
    "### Primer 2: čas",
    "",
    "**Rešitev:**",
    "Čas je $t = s/v$.",
    "",
    ":::premisli",
    "Kaj se zgodi s hitrostjo, če čas podvojimo?",
    "---",
    "Razpolovi se.",
    ":::",
  ].join("\n");
  const html = hideSolutions(expandFormulaBlocks(md));
  assert.equal(html.match(/<details class="tb-solution"><summary>Pokaži rešitev<\/summary>/g)?.length, 2);
  assert.match(html, /Uporabimo \$v = s\/t\$\.\n\n\$v = 50\$ km\/h\.\n\n<\/details>\n\n### Primer 2/);
  assert.match(html, /Čas je \$t = s\/v\$\.\n\n<\/details>\n\n<div class="tb-think">/);
  // Real lesson: the »Premisli« after the last example is outside the solution.
  const ex = lessonView("BIO-OS-8/celica-pod-mikroskopom").lesson.sections.find((s) => /rešen/i.test(s.title)).md;
  const lastSolution = ex.lastIndexOf('<details class="tb-solution">');
  const think = ex.indexOf('<div class="tb-think">', lastSolution);
  assert.ok(lastSolution >= 0 && think > lastSolution);
  assert.match(ex.slice(lastSolution, think), /<\/details>\s*$/);
});

test("formula blocks: hidden in app, printed in PDF, plain for the tutor", () => {
  const md = "Besedilo.\n\n:::formula\n$s = v \\cdot t$\n:::\n\nNaprej.";
  assert.match(expandFormulaBlocks(md), /<details class="tb-formula"><summary>Pokaži formulo<\/summary>\n\n\$s = v \\cdot t\$\n\n<\/details>/);
  assert.match(expandFormulaBlocks(md, "print"), /<div class="formula">/);
  assert.equal(expandFormulaBlocks(md, "plain"), "Besedilo.\n\n$s = v \\cdot t$\n\nNaprej.");
  const v = lessonView("FIZ-OS-9/upor-in-ohmov-zakon");
  const ex = v.lesson.sections.find((s) => /rešen/i.test(s.title)).md;
  assert.match(ex, /\*\*Podatki:\*\*/);
  assert.match(ex, /<details class="tb-formula">/);
  assert.doesNotMatch(ex, /:::/);
  assert.doesNotMatch(lessonSummaryForPrompt("FIZ-OS-9/upor-in-ohmov-zakon"), /:::/);
  // Preverjevalnik oblike: vzorčna lekcija je v redu, pokvarjena ne.
  const src = fs.readFileSync(path.join(LESSONS_DIR, "FIZ-OS-9", "upor-in-ohmov-zakon.md"), "utf8");
  assert.deepEqual(checkLessonSource(src, "FIZ-OS-9/upor-in-ohmov-zakon").errors, []);
  const broken = src.replace("**Podatki:** $R = 30", "Podatki $R = 30").replace("$U = R \\cdot I$", "$U = \\frac{R$");
  const r = checkLessonSource(broken, "FIZ-OS-9/upor-in-ohmov-zakon");
  assert.ok(r.errors.some((e) => /Podatki/.test(e)), r.errors.join("; "));
  assert.ok(r.errors.some((e) => /ne izriše/.test(e)), r.errors.join("; "));
});

test("every lesson file belongs to a topic and is complete", () => {
  for (const dir of fs.readdirSync(LESSONS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    for (const f of fs.readdirSync(path.join(LESSONS_DIR, dir.name)).filter((f) => f.endsWith(".md"))) {
      const id = `${dir.name}/${f.replace(/\.md$/, "")}`;
      assert.ok(getTopic(id), `${id}: tema ne obstaja`);
      const v = lessonView(id);
      const titles = v.lesson.sections.map((s) => s.title.toLowerCase());
      for (const need of ["razlaga", "rešeni primeri", "povzetek"]) assert.ok(titles.includes(need), `${id}: manjka »${need}«`);
      assert.ok(v.lesson.alternatives.length >= 2, `${id}: premalo drugačnih razlag`);
      assert.ok(v.lesson.checks.length >= 2, `${id}: premalo vprašanj`);
      if (v.lesson.status) assert.match(v.lesson.status, /^(osnutek|pregledano)$/);
      assert.ok(lessonSummaryForPrompt(id).length > 50);
      // Vsako vprašanje: natanko en pravilen odgovor, vsi odgovori različni.
      const raw = fs.readFileSync(path.join(LESSONS_DIR, dir.name, f), "utf8");
      const quiz = raw.split(/^## Preveri se\s*$/m)[1] || "";
      for (const raw of quiz.split(/^\? /m).slice(1)) {
        // Slika v vprašanju (:::risba … :::) ni del odgovorov; »vpiši število« (=) in »razvrsti« (1. …) imata svoja pravila (preveri-se.test.js).
        const block = raw.replace(/^:::risba[\s\S]*?^:::\s*$/gm, "");
        if (/^= /m.test(block) || /^\d+\. /m.test(block)) continue;
        const opts = block.split("\n").filter((l) => /^[+-] /.test(l));
        const q = block.split("\n")[0];
        assert.equal(opts.filter((l) => l.startsWith("+")).length, 1, `${id}: »${q}« nima natanko enega pravilnega odgovora`);
        assert.ok(opts.length >= 3, `${id}: »${q}« ima premalo odgovorov`);
        assert.equal(new Set(opts.map((l) => l.slice(2).trim())).size, opts.length, `${id}: »${q}« ima ponovljen odgovor`);
      }
    }
  }
});

test("simulation catalog points at real topics and engines", () => {
  for (const t of Object.keys(SIM_TOPICS)) {
    assert.ok(getTopic(t), `tema ne obstaja: ${t}`);
    for (const d of simsForTopic(t)) {
      assert.ok(hasEngine(d.id), `${t}: simulacija ${d.id} ne obstaja`);
      for (const it of d.opts?.items || []) assert.ok(hasEngine(it[0]), `${t}: ${it[0]}`);
    }
  }
});

test("every school and competition topic has its own simulation", () => {
  const paths = listPaths().filter((p) => /-(OS|SS|TEK)(-|$)/.test(p.key));
  assert.ok(paths.some((p) => p.key.includes("TEK")), "tekmovalne poti so v kurikulu");
  const bare = paths.flatMap((p) => topicOrder(p.key)).filter((t) => !simsFor(t.id).length).map((t) => t.id);
  assert.deepEqual(bare, []);
});

test("search ranks title matches and folds diacritics", () => {
  const hits = searchTextbook("pitagorov");
  assert.equal(hits[0].id, "MAT-OS-8/pitagorov-izrek");
  assert.ok(searchTextbook("enacb").some((h) => h.id === "KEM-OS-8/urejanje-kemijskih-enacb"));
  assert.ok(searchTextbook("hipotenuza").some((h) => h.id === "MAT-OS-8/pitagorov-izrek"), "najde tudi besedilo lekcije");
  assert.deepEqual(searchTextbook("x"), []);
});

test("toc marks lessons, demos and practice", () => {
  const toc = tocView("MAT-OS-8");
  const t = toc.units.flatMap((u) => u.topics).find((x) => x.id === "MAT-OS-8/pitagorov-izrek");
  assert.deepEqual([t.lesson, t.demo, t.practice], [true, true, true]);
  assert.equal(tocView("NI-POT"), null);
});

test("textbook API and PDF page", async () => {
  const store = openDb(":memory:");
  const app = createApp(store);
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const kid = await (await fetch(`${base}/api/students`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Ana" }) })).json();
    const lessonUrl = (id) => `${base}/api/students/${kid.id}/lesson?id=${id}`;
    const lesson = await (await fetch(lessonUrl("FIZ-OS-9/upor-in-ohmov-zakon"))).json();
    assert.equal(lesson.interactive, true, "brez računov je vse odklenjeno");
    // Kartica teme brez vnaprej pripravljene razlage pokaže povzetek lekcije.
    const topic = await (await fetch(`${base}/api/topic?id=FIZ-OS-9/upor-in-ohmov-zakon`)).json();
    assert.match(topic.explanation || "", /### Bistvo/);
    // Predmet in oznake lekcije: črke v razlagi in nalogah teme imajo pomen iz lekcije (:::simboli).
    assert.equal(topic.subject, "FIZ");
    assert.ok(topic.symbols?.some((g) => g.keys.includes("R")), "oznake lekcije");
    assert.equal(lesson.demo.id, "ohm");
    assert.equal(lesson.phet, undefined, "brez zunanjih simulacij");
    assert.equal(lesson.next.id.startsWith("FIZ-OS-9/"), true);
    const fall = await (await fetch(lessonUrl("FIZ-OS-9/prosti-pad"))).json();
    assert.equal(fall.demo.id, "prosti-pad");
    const missing = listPaths().flatMap((p) => topicOrder(p.key)).find((t) => !fs.existsSync(path.join(LESSONS_DIR, `${t.id}.md`)));
    if (missing) assert.equal((await (await fetch(lessonUrl(missing.id))).json()).lesson, null);
    assert.equal((await fetch(lessonUrl("../../etc/passwd"))).status, 404);
    assert.equal((await fetch(`${base}/api/textbook/toc?path=KEM-OS-8`)).status, 200);
    // Učbenik za vsak predmet posebej (in raven), s PDF-jem celega predmeta.
    const books = await (await fetch(`${base}/api/textbook/books`)).json();
    for (const k of ["MAT-OS", "MAT-SS", "FIZ-OS", "FIZ-SS", "KEM-OS", "KEM-SS"]) assert.ok(books.some((b) => b.key === k), k);
    const mat = await (await fetch(`${base}/api/textbook/toc?book=MAT-OS`)).json();
    assert.deepEqual(mat.parts.map((p) => p.key), ["MAT-OS-6", "MAT-OS-7", "MAT-OS-8", "MAT-OS-9"]);
    assert.equal(mat.subjectName, "Matematika");
    assert.equal((await fetch(`${base}/api/textbook/toc?book=NI-TO`)).status, 404);
    const fizBook = await (await fetch(`${base}/ucbenik/FIZ-OS`)).text();
    assert.match(fizBook, /Fizika/);
    assert.match(fizBook, /Fizika, 8\. razred/);
    assert.match(fizBook, /Fizika, 9\. razred/);
    assert.match(fizBook, /Upor in Ohmov zakon/);
    // Formule in konstante na ločenem listu za vsak predmet in raven.
    assert.equal(books.find((b) => b.key === "FIZ-SS").formulas, true);
    const sheet = await fetch(`${base}/ucbenik/FIZ-SS/formule`);
    assert.equal(sheet.status, 200);
    const sheetHtml = await sheet.text();
    assert.match(sheetHtml, /Fizika: formule in konstante/);
    assert.match(sheetHtml, /class="katex"/);
    assert.doesNotMatch(sheetHtml, /katex-error/);
    assert.match(await (await fetch(`${base}/ucbenik/MAT-OS-8/formule`)).text(), /Matematika: formule in konstante/);
    assert.equal((await fetch(`${base}/ucbenik/MAT-TEK/formule`)).status, 404);
    const hits = await (await fetch(`${base}/api/textbook/search?q=ohm`)).json();
    assert.equal(hits[0].id, "FIZ-OS-9/upor-in-ohmov-zakon");

    // PDF: cela pot in ena lekcija, formule že izrisane.
    const book = await fetch(`${base}/ucbenik/MAT-OS-8`);
    assert.equal(book.status, 200);
    const html = await book.text();
    assert.match(html, /Pitagorov izrek/);
    assert.match(html, /class="katex"/);
    assert.match(html, /Kazalo/);
    assert.match(html, /Rešitve/);
    assert.doesNotMatch(html, /@@MATH/);
    const ohm = await (await fetch(`${base}/ucbenik/FIZ-OS-9/upor-in-ohmov-zakon`)).text();
    assert.match(ohm, /<div class="formula">/);
    assert.doesNotMatch(ohm, /:::/);
    const one = await (await fetch(`${base}/ucbenik/KEM-OS-8/urejanje-kemijskih-enacb`)).text();
    assert.match(one, /Razloži drugače/);
    assert.doesNotMatch(one, /Kazalo/);
    assert.equal((await fetch(`${base}/ucbenik/MAT-OS-8/ni-teme`)).status, 404);
    assert.equal((await fetch(`${base}/ucbenik/NI-POTI`)).status, 404);
  } finally {
    server.close();
  }
});

test("lesson: »Premisli« blocks and per-option feedback »~«", () => {
  const l = parseLesson("## Preveri se\n? Q\n- a\n~ ker a ni prav\n+ b\n- c\n> zato b\n");
  assert.deepEqual(l.checks[0].optionWhy, ["ker a ni prav", "", ""]);
  const md = ":::premisli\nKaj je $2+2$?\n---\nJe $4$.\n:::";
  assert.match(expandFormulaBlocks(md), /tb-think[\s\S]*Kaj je[\s\S]*<details><summary>Pokaži odgovor<\/summary>[\s\S]*Je \$4\$/);
  assert.equal(expandFormulaBlocks(md, "plain"), "Vprašanje: Kaj je $2+2$?\nOdgovor: Je $4$.");
});

test("university lessons: check-lesson asks for the exam-oriented structure", () => {
  const base = fs.readFileSync(path.join(LESSONS_DIR, "FIZ-OS-9/upor-in-ohmov-zakon.md"), "utf8");
  const id = fs.readdirSync(LESSONS_DIR).filter((d) => d.startsWith("UNI-")).flatMap((d) => fs.readdirSync(path.join(LESSONS_DIR, d)).map((f) => `${d}/${f.replace(/\.md$/, "")}`))[0];
  const warns = (src) => checkLessonSource(src, id).warnings.join(" | ");
  assert.match(warns(base), /manjka razdelek »## Za izpit«/);
  assert.doesNotMatch(checkLessonSource(base, "FIZ-OS-9/upor-in-ohmov-zakon").warnings.join(" "), /Za izpit/);
  const exam = "\n## Za izpit\n\nZnati moraš povedati:\n- definicijo\n\n### Naloga 1\nIzračunaj $2+2$.\n\n**Rešitev:**\n1. $2+2=4$.\n\n### Naloga 2\nUtemelji.\n";
  const w = warns(base.replace(/\n## Drugače/, `${exam}\n## Drugače`));
  assert.doesNotMatch(w, /manjka razdelek »## Za izpit«/);
  assert.match(w, /1 nalog nima celotne rešitve/);
  // Enovrstična rešitev zadnje naloge na koncu razdelka je tudi skrita za gumbom.
  assert.match(hideSolutions("### Naloga 2\nUtemelji.\n\n**Rešitev:** Ker velja $2+2=4$."), /<details class="tb-solution">[\s\S]*Ker velja/);
});
