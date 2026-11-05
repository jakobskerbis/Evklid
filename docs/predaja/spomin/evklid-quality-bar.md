---
name: evklid-quality-bar
description: j wants every lesson, task and simulation class-leading (2026-10-29); bar in docs/kakovost.md, tools, what was done, what remains
metadata:
  type: project
  modified: 2026-10-29T08:20:58.505Z
---

j (2026-10-29 05:24): "poskrbi da bodo vse lekcije naloge in simulacije v stemmindu class leading". Thread "Make lessons, tasks and simulations class-leading". <!-- brand:legacy -->

**Bar:** docs/kakovost.md (§1 lessons, §2 tasks, §3 sims), English for agents. Sent to both lesson threads 2026-10-29 ~05:55.

**Done:**
- PR #61: checker names typical mistakes (`answer.mistakes [{value, why}]`, choice `answer.why[]`, generic sign / power of 10 / reciprocal / factor 2; codes chk.* translated in 33 langs); hint ladder before answering (data → formula → first step, `POST /tasks/:id/hint`, halves XP); lessons: `:::premisli` blocks and `~` per-option feedback (checker warns if missing); exemplar FIZ-OS-9/upor-in-ohmov-zakon updated; `scripts/kakovost-nalog.js` audit.
- PR #62: sims keyboard (Tab/arrows, Enter), »Ponastavi« button, reduced motion, 360 px no overflow, »Poskusi« everywhere; `node scripts/preveri-simulacije.cjs` (260/260 clean).
- PR #66 + #70: 165 new generators (server/practice/generators/dodatne-*.js) → 0 of 335 OŠ/SŠ/TEK topics without tasks (was 155). Fraction answers also support `mistakes`.

- PR #76: existing mat/fiz/kem + tek/exam generators: levels differ, more variety, `mistakes`, step solutions.
- PR #77: phone CSS `.hint {display:none}` (chat tip) also hid `.fb.hint`; now scoped to `.composer > .hint`. Watch for generic class names in style.css media queries.

**Status:** thread done 2026-10-29. Left to others: uni- generators (university thread); lessons raised to the bar by the two lesson threads (TEK topics still lack lessons).

Related: [[evklid-textbook]] [[evklid-simulations]] [[evklid-token-rules]]
- Predmetnik (PR #90, merged 2026-10-29, j: "kakor piše v učnem načrtu"): OŠ 6./7. razred = MAT + NAR (Naravoslovje), OŠ 8./9. and SŠ = MAT/FIZ/KEM (server/subjects.js subjectForLevel, public/programs.js schoolSubjectsFor). Paths NAR-OS-6/7 in curriculum-data.js (draft per UN naravoslovje); topics may use "=> POT/tema" base refs to reuse FIZ/KEM generators+sims. NAR topics without base have sorting sims (public/sim/nar.js engine "uvrsti", data public/sim/nar-data.js) and choice tasks from the same sets (server/practice/generators/nar.js). NAR textbook lessons not written yet (Opus lesson batches). Biology added in PR #93 (merged 2026-10-29, j: "dodaj vse naravoslovne predmete"): BIO from OŠ 8. razred and all 4 gimnazija years (subjects.js LATE_SUBJECTS incl. BIO, REGIONAL_SUBJECTS stay MAT/FIZ/KEM). Paths BIO-OS-8/9, BIO-SS-1..4 (93 topics) from official UN (OŠ UN_biologija gov.si; gimnazija UN_BIOLOGIJA_gimn 2008: 1. A,C,D; 2. E,F bakterije/glive/rastline/snovi; 3. F uravnavanje..+G; 4. matura L–O + izbirni H–K). Sims: public/sim/bio.js (krizanje, hw, piramida, populacija, encim, osmoza, dna) + 92 sets in bio-data.js; tasks server/practice/generators/bio.js (sort tasks derived from katalog uvrsti entries + 11 calc generators). BIO lessons not written yet (93 topics for Opus lesson batches).
