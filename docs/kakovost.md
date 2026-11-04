# Quality bar: lessons, tasks, simulations

j (2026-10-29): every lesson, task and simulation in Evklid must be class-leading, i.e. better than
Khan Academy (worked examples, hints, mastery), Brilliant (active learning inside the lesson),
Photomath (step-by-step solutions), PhET (explorable sims with implicit scaffolding) and Desmos
(direct manipulation). English on purpose: agents read this file (see `docs/token-rules.md`).

Research behind the bar (short): worked examples then faded practice (Sweller, Renkl), retrieval
practice and spacing (Roediger & Karpicke, Cepeda), interleaving (Rohrer), feedback that names the
error, not just "wrong" (Hattie & Timperley, ASSISTments misconception feedback), self-explanation
(Chi), predict–observe–explain for sims (White & Gunstone, PhET design), multiple representations,
dual coding, concreteness fading. No "learning styles".

Each item is a check. Every change is reviewed three times against this bar (`docs/pregled.md`). "MUST" items are tested by a script where noted; reviewers check the rest.

## 1. Lessons (`content/lessons/**`, format in `content/lessons/README.md`)

Writers and reviewers: Opus (or Fable), never Sonnet. Checker: `node scripts/check-lesson.js -q`.

1. **MUST: correct.** Every number in worked examples recomputed (`node -e`), every quiz key checked, units and significant figures right, Slovenian terms of the school level (OŠ/SŠ/faks).
2. **MUST: right level.** Uses only what the path taught before (`previousSummaries`); goals from the curriculum are all covered.
3. **Zakaj** starts from something the student knows or sees (a concrete situation, a question), not from a definition.
4. **Razlaga** goes concrete → picture → symbols (concreteness fading). Every new term is defined at first use, in a short sentence. One idea per paragraph. For MAT/FIZ/KEM always at least one picture-like representation (table, number line, diagram described in words, or the simulation below).
5. **MUST: 2 "stop and think" checks inside Razlaga** (`:::premisli` block, see README): a short question the student answers in their head before reading on, answer hidden behind a button. Ask for a prediction or an explanation ("Kaj se zgodi, če …?", "Zakaj …?"), not a copy of the sentence above.
6. **Rešeni primeri: 3 examples, easy → hard,** each with Podatki / Iščemo / `:::formula` / numbered steps with intermediate results / answer in a sentence. Each step says *why*, not only *what* (one short clause). Example 3 is a transfer case (word problem, reverse question or two-step), not the same template with other numbers.
7. **Faded example:** the last example (or an extra "Primer 4 – zdaj ti") leaves the final 1–2 steps for the student, with the answer hidden in a `:::premisli` block.
8. **Pogoste napake:** 3–5 real misconceptions of this topic (not generic "be careful"), each with a wrong line of reasoning, why it is wrong, and the fix. These are the same misconceptions the quiz distractors use.
9. **Simulation:** Razlaga or an example says what to try in »simulacija spodaj« (one concrete instruction + what to notice), so the sim is used for a purpose.
10. **Preveri se: 5 questions** (minimum 3 is only the checker floor), mixed: 1 recall, 2 understanding, 2 application. Every wrong option is a real misconception and **MUST have its own `~` feedback line** (why a student picks it and what is wrong). The `>` line explains the correct answer.
11. **Drugače:** at least 2 alternatives that are really different (picture, everyday life, numbers step by step, more precise); not a rephrasing of Razlaga.
12. **Accessibility and phone:** no information only in colour; tables ≤ 4 columns (phone width); formulas short enough to fit 360 px or split over lines; descriptive link text.
13. **Length** 1300–2300 words (checker warns above 2800). Short sentences. Decimal comma. `avtor: AI`.

## 1b. Variety of form (j, 2026-10-29: »Naj se lekcije po obliki ne ponavljajo in naj ne bodo monotone«)

The sections stay (the app and `check-lesson.js` need them); what varies is how a lesson is built inside them.

- **Form plan.** `node scripts/lesson-brief.js` gives every topic a stable `form` plan picked from its id: the Zakaj opening (story, puzzle, paradox, home experiment, history, a classmate's wrong claim, two situations with one idea, numbers from the student's life), the Razlaga path (discovery, worked case first, contrast with an old idea, misconception first, small blocks with check questions, picture first), a main context (sport, kitchen, travel, nature, music, phones, money, crafts, body, space), a quiz mix (beyond plain multiple choice: spot the mistake, ordering, estimate, odd one out, which table fits, reverse question) and two `## Drugače: …` titles (also »Kot zgodba«, »Z analogijo«). Two lessons written together never get the same plan.
- **Exemplar = format only.** Never copy its structure, openings or phrasing.
- **Language.** Vary sentence openings and paragraph length; no stock phrases (»V tej lekciji se bomo naučili«, »Poglejmo si«, »Kot vidimo«); no two sections opening the same way.
- **Review.** The second pass checks that the plan was followed and removes the worst repetition with a small edit.
- **Old lessons.** Raises of old lessons apply the plan to Zakaj, Razlaga and the quiz without rewriting correct text wholesale.

## 1c. University lessons (`UNI-*`, j 2026-11-04, after comparing lessons with real past exams)

A comparison with 20 public 1st-year Matematika exams (UL FKKT, UM FKKT) showed that our hardest examples were easier than the exam tasks, and that about 40 % of an exam is theory (definitions, theorems, proofs), which the school structure did not practise. So university lessons differ from school lessons in five ways, and the same structure applies to all existing university lessons (they are reworked course by course, UL FKKT first):
1. Razlaga has precise definitions and theorems with all their conditions, plus the short proofs or derivations an exam may ask. »Drugače: Bolj natančno« only goes deeper.
2. Primer 3 is at real exam level.
3. A new section `## Za izpit` follows `## Povzetek`. It starts with »Znati moraš povedati:« and then gives 2–3 `### Naloga` at exam level, in our own words (never a copied exam): at least one computation harder than Primer 3 and one theory task, each with a complete `**Rešitev:**` (hidden behind a button in the app).
4. »Drugače: Uporaba v stroki« replaces »Iz vsakdanjega življenja«.
5. 1800–3000 words.

`node scripts/check-lesson.js` warns when a university lesson lacks this structure, and `node scripts/lesson-brief.js` gives the rules to writers and reviewers.

## 2. Tasks (code generators, `server/practice/generators/*.js`)

Generators are code (no API cost); they are written and reviewed by Opus too. Audit:
`node scripts/kakovost-nalog.js [prefix]`; correctness: `node scripts/preveri-generatorje.js [prefix]` must report 0 errors.

1. **MUST: coverage.** Every OŠ/SŠ/TEK topic has at least one generator, ideally two task types (e.g. compute + reverse, or compute + concept choice).
2. **MUST: correct answer** computed in code from the same rounded numbers shown in the text; `preveri-generatorje` passes for 40 seeds × 3 levels.
3. **Levels really differ:** L1 one step, numbers that are easy to handle; L2 two steps or a unit conversion or a short word problem; L3 multi-step, reverse question, or transfer to a new context. Not the same template with bigger numbers.
4. **Variety:** at least 8 different tasks per level over 24 seeds; real contexts (names from `NAMES`, everyday objects, lab situations); no repeated sentence for every task.
5. **MUST: every task has** `hint` (a strategy or first step, never the answer), `solution` (numbered steps, each on its own line, intermediate results, final value with unit), `data: { given, find }` for every word problem and every task with a formula, `formula` when a formula or rule is used. Rounding and unit are stated in the text.
6. **Misconception feedback:** number and fraction answers list 1–3 typical wrong results in `answer.mistakes: [{ value, why }]` (forgot the unit conversion, reciprocal, forgot ½, used diameter instead of radius, sign error, added instead of multiplied …). `why` names the likely error without giving the answer ("Si prostornino pretvoril v m³?"). Choice answers give `answer.why: [..]` with one line per option. The checker also detects generic errors itself (power of 10, sign, reciprocal).
7. **Choice tasks** only when the concept is qualitative; at least 3 options; every distractor is a real misconception; mixed with numeric tasks in the same topic.
8. **Hint ladder** works automatically from `data` → `formula` → `hint`; so these three must be in that order of help (data reminds, formula tells the tool, hint gives the first step).
9. **Phone:** text ≤ ~60 words, no table wider than 4 columns, answers typable on the phone keypad (no special symbols needed except units the keypad has).

## 3. Simulations (`public/sim/*.js`, catalog `public/sim/katalog.js`)

1. **MUST: every OŠ/SŠ/TEK topic has a sim** (test in `test/textbook.test.js`).
2. **MUST: fidelity** (PR #35): fixed scales from slider maximums, one force scale, real-time or labelled time scale, clipped arrows dashed and labelled. Every slider changes something visible.
   - **Slider ↔ graph** (j, 2026-10-30): a slider that is a position or interval on the graph is marked on the axis with its symbol and value (»x₀ = 1«, »h = 0,5«) in the slider's colour (`kit.axisMark`, `kit.spanMark`; the slider label gets the same swatch via `slider({ cls })`). Slider and mark move together and proportionally: dragging the mark (mouse, touch, arrow keys) moves the slider, snapped to its step and clamped to its range; an interval's bracket is its length in axis units; no axis rescaling while dragging. An x-position slider sits under the graph with its track spanning exactly the axis interval (`kit.axisSlider`), so the thumb is under the mark at every value (checked ≤ 2 px at min, middle, max, 360 and 1280 px by `scripts/preveri-simulacije.cjs`).
   - **Everything on a graph can be switched off** (j, 2026-10-30): every curve, line, point group, slider mark and the grid has an on/off chip under the graph (automatic for all sims, `public/sim/prikaz.js`; lab graphs: the legend). Give a curve a name with `data-name` when the legend text does not name it.
3. **Purpose:** each sim has a `tryText` »Poskusi:« with a concrete question to answer by exploring (predict → try → explain), not "move the slider".
4. **Multiple representations** linked live: the picture, the numbers (readout) and, where it fits, a graph or an equation update together.
5. **Direct manipulation** where it makes sense (drag points, bodies, vectors), not only sliders.
6. **MUST: accessible:** every control has a label (`aria-label`), draggable handles are reachable with Tab and move with arrow keys, readouts are `aria-live`, no information only in colour, respects `prefers-reduced-motion` (no autoplay).
7. **MUST: phone:** works at 360 px width with no horizontal scroll, touch targets ≥ 36 px, dragging does not scroll the page.
8. **MUST: no errors** in the console when mounted, and a »Ponastavi« (reset) button returns to the start state.
9. Dark mode readable (colours from CSS variables, `palette(el)`).

## 4. Odgovori inštruktorja v klepetu (sprotno preverjanje, j 2026-10-30)

Prvi rezultat, ki ga učenec vidi, mora biti pravilen. Kadar naš preverjeni reševalnik nalogo iz učenčevega sporočila reši (enačba, sistem, odvod, račun z vsaj dvema operacijama), model dobi pravilen rezultat v skriti opombi in z njim preveri svoj račun; pri vodenju (način A) ga ne izda prezgodaj. Vsak odgovor koda nato preveri: vsak številski račun in končne vrednosti neznank. Ob neujemanju se odgovoru pripne en kratek »Popravek:« (največ enkrat na odgovor). Kjer koda nima česa preveriti, tveganje pa je večje (tekmovanja, fakulteta, »Razloži podrobneje«), Haikujev odgovor pregleda še Sonnet z navodili preverjevalca iz `server/verify.js`. Koda: `server/live-check.js`, preizkusi: `test/live-check.test.js`, stroški: `docs/stroski-ai.md`.
