---
name: evklid-model-comparison
description: Haiku vs Sonnet vs Haiku-think tutor accuracy test (4 Nov 2026, scripts/primerjava-modelov.js on Render) and the decision it led to (SŠ → Haiku think)
metadata:
  type: project
  modified: 2026-11-04T07:20:18.167Z
---

Test run on Render shell by j, 4 Nov 2026, graded by Opus against worked examples from lessons (`scripts/primerjava-modelov.js`).
- 50 tasks: Haiku (chat) 56 % correct / 30 % minor / **12 % errors** (OŠ 0 %, SŠ 27 %, TEK 13 %, UNI 8 %). Sonnet (mid) 76/18/**2 %** (SŠ 0 %, UNI 8 %). Cost 3.10 $.
- Most Haiku errors were in side remarks or invented extra exercises (impossible follow-ups), not the final result.
- Follow-up 23 SŠ+TEK tasks, Haiku think (high effort): **4 % errors** (SŠ 7 %, TEK 0 %), ~0.21 ¢/answer. Cost 0.47 $.
- Per-answer: Haiku ~0.1–0.15 ¢, Haiku think ~0.21 ¢, Sonnet ~3 ¢ (estimates; the first report's price column was the grader cost, bug fixed in PR #310).
- Decision (j: »najdi najboljšo rešitev«): SŠ students default to mode `think` (`EVKLID_SS_THINK`, server/usage.js chooseMode `secondary`), PR #310 (merged 4 Nov); free tier stays chat; think max_tokens 8000. Competitions already used think. OŠ stays plain Haiku.
- Same PR: local lesson search (`server/lekcija-za-vprasanje.js`, hidden note `<lekcija_ucbenika>`), OFF by default (`EVKLID_LESSON_SEARCH=1`) pending j decision card 4 Nov; hidden-note tags listed in server/skrite-opombe.js. Rolling chat summary (`<povzetek_pogovora>`) live since PR #301.
- Prompt rule test (j »ja« to prepare+test, 4 Nov): new Pravilnost bullet »Dodatne vaje in stranske trditve« (verify extra exercises + numeric side claims). Haiku chat on the 35 SŠ/TEK/UNI tasks with `--prompt`: 6/35 → 2/35 errors (SŠ 27→13 %, TEK 13→0, UNI 8→0), 0.70 $. j approved by card; merged PR #317 (07:5x UTC 4 Nov) with wording tweaks after review (»jo zase reši (rešitve ne zapišeš)«, »sicer jo popravi ali sestavi drugo«). Lesson note default ON (j card), same PR. All 4 Nov tests total 4.27 $.
- Script options: `--groups ss,tek`, `--from <json>`, `--modes chat,think,mid`. Render `data/` is NOT persistent across deploys (results file vanished after redeploy); deploys kill shell runs.

Related: [[evklid-tutor-accuracy]] [[evklid-usage-limits]]
