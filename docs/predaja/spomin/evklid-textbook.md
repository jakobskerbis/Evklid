---
name: evklid-textbook
description: STEMMind interactive textbook (Učbenik): lesson format rules (Podatki + hidden formula), checker script, lesson-writing status, limits hit (2026-10-28) <!-- brand:legacy -->
metadata:
  type: project
  modified: 2026-10-28T00:51:05.268Z
---

j asked (2026-10-27) for a textbook with explanations of all concepts and interactive demos; detail like an average teacher's lesson, plus "explain differently". PR #5 (merged) built it; PR #8 (merged) added 98 Sonnet-written lessons (~$3.16 API).

Format (content/lessons/README.md): Markdown in content/lessons/<path>/<slug>.md; sections Zakaj / Razlaga / Rešeni primeri / Pogoste napake / Povzetek, "## Drugače: …" alternatives, "## Preveri se" quiz (? - + >). Front matter stanje: osnutek|pregledano, avtor: AI (never a model name).

Rules from j (2026-10-27 evening, apply to lessons AND task solutions in the app):
- every worked example ("rešen zgled") must list ALL given data from the text: `**Podatki:** …` + `**Iščemo:** …`
- the needed formula is shown only behind a button "Pokaži formulo": lesson syntax `:::formula … :::` (server/textbook.js expandFormulaBlocks → <details class="tb-formula"> in app, "Formula" box in PDF, plain text for tutor)
- `node scripts/check-lesson.js [files]` validates a lesson (sections, Podatki/Iščemo/formula per example, quiz: one +, ≥3 distinct options, KaTeX renders, no "PhET" in text). Exemplar lesson in new format: FIZ-OS-9/upor-in-ohmov-zakon.md.

j (2026-10-28 05:40): "lessons for all offered subjects for SŠ and OŠ". j (05:54): textbook per subject, interactive where possible, PDF per subject.
j 2026-10-28 16:29: lessons/explanations must be written AND reviewed by Opus or Fable only (never Sonnet); old lessons must also get an Opus review for level. Workflow script no longer sets model:'sonnet' (inherits session Opus). University thread id cmsg_011HYzNBAS5HRU1H7PcSE7JtTTzpXKqhPt5Lc56qTZzbDB.
j 2026-10-29: minimise tokens, quality first (docs/token-rules.md); queue.json round-robin, quality bar docs/kakovost.md §1 in all prompts; scratchpad/review-left.txt = lessons below the bar to raise.
Usage limit: workflows burn j's shared 5-hour limit. Since 2026-10-29: scratchpad build-args.py → args.json of scripts/lesson-brief.js briefs → workflow lesson-batch-v2.js (writer brief + --review brief; raises writer-only). Send batch usage to optimizer thread.
Container resets lose uncommitted work → auto-save loop (4 min).

Features and status history: [[evklid-textbook-features]]. Related: [[evklid-project]] [[evklid-accounts-billing]]

Since PR #204 (2026-10-30): writers also write a mind map content/gradiva/miselni/<POT>/<tema>.md (branches = keywords without a colon). Batch steps must include content/gradiva: autosave loop and commit add content/lessons + content/gradiva; check with node scripts/check-gradivo.js -q on the new maps.
2026-10-30 20:21 j approved new school order: MAT-SS-3/4 → FIZ/KEM OŠ → new topics from curriculum thread cmsg_011HYzNBAS5HRU1H7PcSE7JtHyxqJLZ9pjxUisrjx246WY (queue key NOVE) → FIZ/KEM SŠ → NAR/BIO → TEK; raises: NAPAKA, then MAT-SS-1/2. In build-args.py grp().
1.11 spot check: 10 lessons, 0 serious (PR #269). 4.11 PR #307 sim on the step that mentions it, equation guard server/lesson-identity.js. 4.11 09:40 successor thread cmsg_011HYzNBAS5HRU1H7PcSE7JtTw2vVCQo5mZXdLeQf9AR9E (handover /mnt/project-files/predaja/ucbenik.md): Done 14:30: all MAT-SS (#342, #366) and all FIZ/KEM-OS-8/9 (#374, #381, #398) written + raised, triple review, ~136 $. Next after 11 Nov reset: NOVE → FIZ/KEM SŠ → NAR/BIO → TEK (queue.json, stare-lekcije list trimmed). Workflow script copy has a pool of 4 pipes (args.pool) and per-item `extra` for raises. Triggers: morning 07:40 Ljubljana trig_014x4ndsE7J4X3WUfjGWk1d6, fallback batch trig_01EUav691KhbNAwG9bN99CRW (disabled). App (mobile/) shows no sims (native thread).
