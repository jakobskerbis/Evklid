#!/usr/bin/env node
// Izpiše kratka, popolna navodila (brief) za pisca ali pregledovalca lekcij, pripravljena za
// kopiranje v nalogo agenta. Orkestrator jih ne sestavlja ročno (docs/token-rules.md §2–4).
//   node scripts/lesson-brief.js MAT-OS-8/pitagorov-izrek FIZ-OS-8/vzgon      # pisec (2 temi)
//   node scripts/lesson-brief.js --review MAT-OS-8/pitagorov-izrek [...]     # pregledovalec (2. pregled)
//   node scripts/lesson-brief.js --read MAT-OS-8/pitagorov-izrek [...]       # bralec »z očmi učenca« (3. pregled)
// Angleško namenoma: bere ga agent, angleščina porabi manj žetonov. Deluje tudi za UNI-* teme.
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const review = args.includes("--review");
const read = !review && args.includes("--read"); // tretji pregled (j 2026-10-29: vse pregledano trikrat)
const ids = args.filter((a) => !a.startsWith("-"));
if (!ids.length) {
  console.error("uporaba: node scripts/lesson-brief.js [--review|--read] <id-teme> [...]");
  process.exit(1);
}
const here = path.dirname(fileURLToPath(import.meta.url));
const topics = JSON.parse(execFileSync(process.execPath, [path.join(here, "lesson-topic.js"), ...ids], { encoding: "utf8" }));
const missing = topics.filter((t) => t.error);
if (missing.length) {
  console.error(missing.map((t) => `${t.id}: ${t.error}`).join("\n"));
  process.exit(1);
}
const uni = topics.some((t) => t.id.startsWith("UNI-"));
const tek = topics.some((t) => /(^|-)TEK(-|$)/.test(t.id.split("/")[0])); // tekmovanja
const exemplar = topics[0].exemplar;
const files = topics.map((t) => t.file).join(" ");
// Avtorski miselni vzorec ob lekciji (nit Gradiva, docs/gradiva.md): isti id kot lekcija.
const maps = topics.map((t) => t.file.replace(/^content\/lessons\//, "content/gradiva/miselni/")).join(" ");

// Raznolikost oblike (j 2026-10-29: »Naj se lekcije po obliki ne ponavljajo in naj ne bodo monotone«).
// Vsaka tema dobi stalen načrt oblike (iz id-ja), sosednji temi v paru pa se vedno razlikujeta.
// Razdelki (Zakaj, Razlaga, Rešeni primeri …) ostanejo, ker jih aplikacija in checker potrebujeta; spreminja se, kako je lekcija zgrajena.
const FORM = {
  hook: [
    "a short story with a named person and a real problem they must solve",
    "a puzzle or riddle the student tries before any theory",
    "a surprising fact or paradox that seems wrong at first",
    "a small experiment or measurement the student can do at home or in class",
    "a historical moment: who needed this idea and why (no invented quotes or dates)",
    "a wrong claim from a classmate that the lesson will settle",
    "two everyday situations that look different but hide the same idea",
    "a concrete question with numbers from the student's life (prices, sport, phone, travel)",
  ],
  path: [
    "discovery: let the student notice a pattern in a few cases, then name and state the rule",
    "worked case first: solve one concrete case, then generalise step by step",
    "contrast: put the new idea next to a similar old one and build it from the differences",
    "misconception first: start from the tempting wrong idea and repair it",
    "build-up: one small block at a time, each tested with a one-line check question",
    "picture first: explain mostly through a described diagram, table or number line, symbols last",
  ],
  context: [
    "sport and games", "cooking and the kitchen", "travel and maps", "nature and weather", "music and sound",
    "technology and phones", "shopping and money", "building and crafts", "medicine and the body", "space and astronomy",
  ],
  quiz: [
    "mix: one »which is true«, one numeric, one »spot the mistake in this solution«, one comparison, one real-life case",
    "mix: one definition-in-context, one ordering/ranking, one »what happens if …«, two numeric",
    "mix: one »which picture/table fits«, one estimate, one »why« question, one reverse question, one transfer case",
    "mix: one »odd one out«, one numeric, one cause–effect, one »which step is wrong«, one real-life case",
  ],
  alts: [
    ["Na sliki", "Iz vsakdanjega življenja"],
    ["Kot zgodba", "Korak za korakom s številkami"],
    ["Na sliki", "Bolj natančno"],
    ["Z analogijo", "Iz vsakdanjega življenja"],
    ["Korak za korakom s številkami", "Kot zgodba"],
    ["Z analogijo", "Bolj natančno"],
  ],
};
// Fakultetne lekcije (j 2026-11-04): strokovni okviri namesto šolskih, »Uporaba v stroki« namesto »Iz vsakdanjega življenja«.
const UNI_FORM = {
  hook: [
    "a problem from a lab, plant, clinic or field site that this topic solves",
    "a puzzle or counter-intuitive result the student tries before any theory",
    "a surprising fact or paradox from research or engineering practice",
    "a real measurement or data set that the old tools cannot explain",
    "a historical moment: who needed this idea and why (no invented quotes or dates)",
    "a wrong claim from a fellow student that the lesson will settle",
    "two situations from different fields that hide the same structure",
    "an exam-style question the student cannot solve yet, answered at the end",
  ],
  context: [
    "chemical laboratory", "industrial process and plant", "environment and climate", "medicine and pharmacy", "materials and structures",
    "energy and electrical systems", "data, computing and measurement", "biology and biotechnology", "physics experiment", "economics and optimisation",
  ],
  alts: [
    ["Na sliki", "Uporaba v stroki"],
    ["Uporaba v stroki", "Korak za korakom s številkami"],
    ["Na sliki", "Bolj natančno"],
    ["Z analogijo", "Uporaba v stroki"],
    ["Korak za korakom s številkami", "Bolj natančno"],
    ["Z analogijo", "Bolj natančno"],
  ],
};
const hash = (str) => [...str].reduce((h, c) => (h * 31 + c.codePointAt(0)) >>> 0, 7);
const formPlan = (id, i) => {
  const h = hash(id) + i * 3; // i: položaj v paru → sosednji lekciji nikoli enaki
  const pick = (arr, salt) => arr[(h + salt) % arr.length];
  const F = id.startsWith("UNI-") ? { ...FORM, ...UNI_FORM } : FORM;
  const alts = pick(F.alts, 5);
  return { hook: pick(F.hook, 0), path: pick(F.path, 1), context: pick(F.context, 2), quiz: pick(F.quiz, 3), drugace: alts.map((a) => `Drugače: ${a}`) };
};

const WRITER = `# Evklid lesson brief: write ${topics.length} lesson${topics.length > 1 ? "s" : ""}

Read once: \`content/lessons/README.md\` (format) and \`${exemplar}\` (style). Do not read other lessons or explore the repo: \`previousSummaries\` below is what the student already knows.

Quality bar (docs/kakovost.md §1, all required):
- Correct. Compute every number with one \`node -e\` before writing it. \`check-lesson.js\` recomputes pure-number steps itself and fails on a mismatch.
- Level. Use only what \`before\` / \`previousSummaries\` taught; cover every goal in \`goals\`.
- Zakaj: start from a concrete situation or question the student knows, not a definition.
- Razlaga: concrete → picture → symbols; define each new term at first use; one idea per paragraph; at least one picture-like representation (table ≤ 4 columns, number line, diagram in words, or »simulacija spodaj« with one thing to try and what to notice). Exactly 2 \`:::premisli\` blocks that ask for a prediction or a »zakaj«, not a copy of the sentence above.
- Rešeni primeri: 3, easy → hard. Each: **Podatki:** (all given data with units) / **Iščemo:** / \`:::formula … :::\` / **Rešitev:** numbered steps with intermediate results and a short »why« clause / answer in a sentence. Primer 3 is a transfer case (word problem, reverse question or two steps). The last example (or »Primer 4 – zdaj ti«) leaves the final 1–2 steps to the student, answer hidden in a \`:::premisli\` block.
- Pogoste napake: 3–5 real misconceptions of this topic, each with the wrong reasoning, why it is wrong and the fix; the quiz distractors use the same misconceptions.
- Povzetek: a few bullet lines (the tutor gets it as context).
- Drugače: at least 2 truly different alternatives (»Na sliki«, »Iz vsakdanjega življenja«, »Korak za korakom s številkami«, »Bolj natančno«).
- Preveri se: 5 questions (1 recall, 2 understanding, 2 application), ≥ 3 options, exactly one \`+\`, every \`-\` option has its own \`~\` line (why a student picks it), \`>\` explains the right answer.
- Variety (docs/kakovost.md §1b): follow each topic's \`form\` plan below for the Zakaj opening, the Razlaga path, the main context (Zakaj and at least one example; other examples may use other contexts), the quiz question types and the 2 Drugače titles (add more alternatives only if they add something). Use the exemplar for format only, never copy its structure, openings or phrasing. Vary sentence openings and paragraph lengths; no stock phrases (»V tej lekciji se bomo naučili«, »Poglejmo si«, »Kot vidimo«) and no section that starts the same way as in the other lesson you write.
- Phone: no information only in colour; formulas fit 360 px or are split. 1300–2300 words, short sentences.
- Tappable formulas: end the file with one \`:::simboli\` block, one line per symbol of every \`$$…$$\` and \`:::formula\` formula: \`<TeX symbol> | <Slovenian name as in the lesson> | <defining relation in TeX or empty> | <unit in TeX, e.g. kg/m^3, mol/L, L\\,mol^{-1}\\,cm^{-1}; – if dimensionless; empty for pure maths> | <optional note ≤ 12 words>\`; maths inside a name or note goes in \`$…$\`. Meaning as used in THIS lesson (T in $T = I/I_0$ is »prepustnost«, not temperature). The checker lists symbols still missing.

House rules: Slovenian with the terminology of the level; decimal comma \`$3{,}5$\`; all math in LaTeX; the formula of an example only inside \`:::formula\`; header \`stanje: osnutek\` and \`avtor: AI\`; never mention PhET or a model name.${
  uni
    ? `\nUniversity (UNI-*) structure (j 2026-11-04, after comparing lessons with real past exams: exams are harder than our examples and about 40 % of an exam is theory). These rules replace the school ones where they differ:
- Generic: shared by every course with this topic; no faculty or course name; save to the listed \`file\`.
- Razlaga: precise definitions (**Definicija.**) and theorems with all their conditions (**Izrek.**) in the main explanation, with the short proofs or derivations an exam may ask (**Dokaz.** / **Izpeljava.**). »Drugače: Bolj natančno« is only for deeper or more general material. A topic without theorems (technical drawing, SQL, lab methods) states its exact definitions, rules and standards instead.
- Rešeni primeri: Primer 3 at real 1st-year exam level (several steps, the combination of methods an exam asks).
- New section \`## Za izpit\` right after \`## Povzetek\`: first »Znati moraš povedati:« with 3–6 bullets (exact definitions, theorems with conditions, the proofs or derivations to know); then 2–3 \`### Naloga N\` at real exam level, in your own words (never copy a real exam): at least one computational problem harder than Primer 3 and one theory task (»Natančno navedi … in dokaži …«, »Utemelji, ali …«, »Izpelji …«). Each task: full text with all data, then \`**Rešitev:**\` with complete numbered steps and the answer (the app hides it behind a button).
- Drugače: »Uporaba v stroki« (lab, industry, research, the profession) instead of »Iz vsakdanjega življenja«.
- Length 1800–3000 words.`
    : ""
}${
  tek
    ? "\nCompetition topic (Kenguru, Vegovo, olimpijada; Stefanovo = FIZ, Preglovo = KEM): the student already masters regular school material. Teach strategies and typical problem types; examples at competition level (easy ≈ Kenguru/school round, hard ≈ national round/olympiad) with complete solutions. Never cite real past problems, years or results."
    : ""
}

Workflow (docs/token-rules.md §2): one \`Write\` per file; one \`node -e\` for all numbers; then once \`node scripts/check-lesson.js -q ${files}\`; fix with \`Edit\`, never rewrite; do not read the file back. If \`lessonExists\` is true, upgrade the existing lesson: run the checker, fix what it and the bar flag, keep correct text.
Also write the mind map per lesson, \`${maps}\` (docs/gradiva.md): front matter \`avtor: AI\`, \`stanje: osnutek\`; 4–8 top-level bullets, each a 1–4 word keyword (no colon: details go in the sub-bullets) for the lesson's main ideas in teaching order (not a copy of Povzetek), each with 1–3 indented sub-bullets (formula in $…$, unit, example or typical mistake); no line over 12 words. Check: \`node scripts/check-gradivo.js -q ${maps}\`. If the map exists, fix it with \`Edit\` instead.
Reply ≤ 3 lines per lesson: \`OK <id>, <words> besed\` or what is unresolved. No lesson text in the reply.

## Topics
`;

const REVIEWER = `# Evklid review brief: ${topics.length} lesson${topics.length > 1 ? "s" : ""} (second, independent pass)

Run first: \`node scripts/check-lesson.js -q ${files}\` and \`node scripts/check-gradivo.js -q ${maps}\`. Format, LaTeX and pure-number steps are then already checked (it prints how many steps it recomputed and any mismatch). Read for content only and check:
1. Remaining numbers: substitutions, rounding, units and significant figures in every worked example (batch them into one \`node -e\`); every \`+\` quiz answer truly correct, every \`-\` truly wrong; every \`~\` names the real error.
2. Level fits the path: nothing used that the path has not taught yet; every goal covered.
3. »Podatki« lists all given data; steps say why; Primer 3 is a transfer case; the faded final step exists.
4. Pogoste napake are real misconceptions of this topic and match the distractors; the 2 »premisli« ask for a prediction or a »zakaj«.
5. Slovenian terminology of the level, decimal comma, tables ≤ 4 columns.
6. Not monotone: the opening, the explanation path and the quiz types are not the same template as the other lesson in this brief; no stock phrases (»V tej lekciji se bomo naučili«, »Poglejmo si«); fix the worst repetition with a small Edit.
7. \`:::simboli\`: every name, relation and unit matches its meaning in this lesson and the level (the card a student sees when tapping the symbol).
8. Mind map \`${maps}\`: every branch matches the lesson and adds nothing new; the lesson's main idea is a branch; maths renders.${uni ? "\n9. University lesson: generic (no faculty or course name); definitions and theorems with all conditions and the exam proofs in Razlaga; Primer 3 at exam level; »## Za izpit« after Povzetek with »Znati moraš povedati:« and 2–3 »### Naloga« (one harder computation, one theory task), each with a complete, correct »**Rešitev:**« (recompute it); »Uporaba v stroki« instead of »Iz vsakdanjega življenja«." : ""}${
  tek ? "\n9. Competition lesson: strategies and typical problem types at competition level (easy ≈ school round, hard ≈ national round), complete solutions, no real past problems, years or results cited." : ""
}
Fix with small \`Edit\`s, never rewrite. Do not read the exemplar or the README. Reply per lesson: \`<id>: N popravkov – <5–10 words each>\`, ≤ 5 lines.

## Lessons
`;

const READER = `# Evklid reading brief: ${topics.length} lesson${topics.length > 1 ? "s" : ""} (third pass, a student's eyes)

The checker and a second reviewer have already verified numbers, keys, level and format. You read each lesson once, start to end, as a careful student of the \`level\` below, and fix only what such a student would stumble on:
1. Clarity: every new term is explained before it is used; one idea per paragraph; a sentence you had to read twice gets rewritten shorter and more concrete.
2. Thinking: the 2 »premisli« blocks and the faded final step really make you stop and predict or explain; if the answer already stands in the sentence above, change the question, not the answer.
3. Not monotone (docs/kakovost.md §1b): the opening, the explanation path and the quiz do not feel like the same template as the other lessons in this brief; vary the worst repetition.
4. Flow: Zakaj → Razlaga → examples → quiz builds up; a jump that needs an unstated step gets one sentence.
5. Phone: no table wider than 4 columns, long formulas split, nothing conveyed only by colour.
6. Mind map \`${maps}\`: every branch matches the lesson and adds nothing new; the lesson's main idea is a branch; maths renders.${uni ? "\n7. University lesson: each »Za izpit« task can be solved with what the lesson teaches, and every step of its »**Rešitev:**« follows from the one before." : ""}
Small \`Edit\`s only (≤ 8 per lesson), never a rewrite. Keep every number, formula, structure and \`+\`/\`-\` key unchanged; if you believe a number or key is wrong, do not change it: add a reply line \`DVOM: <id> line <n>: <why>\` (the orchestrator checks every DVOM line). Then run \`node scripts/check-lesson.js -q ${files}\` and \`node scripts/check-gradivo.js -q ${maps}\` once. Do not read the exemplar or the README. Reply per lesson: \`<id>: N popravkov – <5–10 words each>\`, ≤ 4 lines.

## Lessons
`;

const compact = (t, i) =>
  read
    ? { id: t.id, file: t.file, level: t.pathLabel, goals: t.goals }
    : review
    ? { id: t.id, file: t.file, level: t.pathLabel, goals: t.goals, before: t.before }
    : {
        id: t.id,
        file: t.file,
        name: t.name,
        unit: t.unit,
        level: t.pathLabel,
        goals: t.goals,
        lessonExists: t.lessonExists,
        demos: t.demos,
        before: t.before,
        after: t.after,
        previousSummaries: t.previousSummaries,
        form: formPlan(t.id, i),
      };

process.stdout.write((read ? READER : review ? REVIEWER : WRITER) + topics.map((t, i) => JSON.stringify(compact(t, i), null, 1)).join("\n") + "\n");
