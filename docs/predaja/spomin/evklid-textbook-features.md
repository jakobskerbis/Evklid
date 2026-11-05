---
name: evklid-textbook-features
description: STEMMind textbook features built so far (per-subject books + PDFs, formula sheets, select-to-ask) and lesson batch status history <!-- brand:legacy -->
metadata:
  type: project
---

Done 2026-10-28 06:00, PR #18 merged: textbook home = subject tabs + level tabs (books MAT-OS, MAT-SS, MAT-TEK, … from listBooks() in server/textbook.js; SUBJECT_NAMES/SCHOOL_NAMES); PDF per book at /ucbenik/<SUBJ>-<OS|SS|TEK>; university students get tab "Moj študij" = book P-<programId> (/ucbenik/P-UL-FKKT-KEM). Per-subject PDFs rendered to /mnt/project-files/evklid/ucbenik/po-predmetih/ (rebuild after lesson batches).
Formula sheets (j 2026-10-28 06:37, PR #21 merged): content/formulas/<SUBJ>-<OS|SS>.md (Markdown tables + constants), route /ucbenik/<BOOK>/formule (also works for grade paths), button "Formule in konstante (PDF)" in book card; PDFs formule-<predmet>-<raven>.pdf in /mnt/project-files/evklid/ucbenik/po-predmetih/ (2–3 pages each). No sheet yet for TEK or university books.
Select-to-ask (j 2026-10-28 06:56, PR #24): in a lesson, selecting text shows a »Razloži« button (mouse + touch) that opens tutor chat for the topic with the quoted text (KaTeX → LaTeX); code in public/textbook.js wireSelectionAsk. PhET is gone from the app (PR #22 in-house sims, catalog public/sim/katalog.js); PR #25 removed all phet headers/mentions from lessons — refer to sims as »simulacija spodaj« with the katalog title.
j's phone copy of the textbook: Artifact https://claude.ai/artifact/8VaTWWZdsJig3c7QBQ4DXa + PDF /mnt/project-files/evklid/ucbenik/ucbenik-evklid-vse.pdf (742 pages, built 2026-10-27 17:55; rebuild when lessons change).
content/explanations.json is empty (never generated); topic card falls back to lesson intro + summary (lessonExplanation).

Rules and current process: [[evklid-textbook]]
Batch 6 (29.10, PR #65) first under docs/kakovost.md bar. Queue: scratchpad/queue.json (keys OS, SS, TEK, NB=NAR/BIO, NOVE; written pairs removed after each batch).
2026-10-29 15:30 j: lessons must vary in form, not monotone → PR #117: lesson-brief.js gives each topic a stable form plan (hook/path/context/quiz mix/Drugače titles), kakovost.md §1b; 18 existing new-bar non-UNI lessons appended to review-left for a variety pass.
Step view (PR #121, 2026-10-29, j: lessons not monotone): lessons open card by card by default (public/lesson-steps.js splits sections; quiz Q1 after Razlaga, Q2 after Pogoste napake, rest at end; »Vse naenkrat« toggle, localStorage tb-steps). Checker warns on stock phrases (»V tej lekciji« in 89 lessons). Form plans per topic: lesson-brief.js (PR #117, textbook thread).
2026-10-29 18:00: 5-hour limit binding (all threads stopped 15:58–17:50) → one batch per 5-h window at window start +10 min (faks +1h30); trigger reschedules to five_hour resetsAt+10min; five_hour warning/rejected = skip. Batches now writer→reviewer→reader (--read) per pair.
Pakets 8–9 (PR #146/#155): 16 new + 8 raises each, ~2.7 M ≈ 112k/lesson.
Paket 10 (PR #159): 15 new + 8 raises, 2.70 M.
Paket 11 (30.10 14:33, PR #226): 16 new + 8 MAT-OS-8 raises + 24 mind maps, 32 agents, 56 min, 2.88 M. Pace to 4 Nov: 1 batch/day 14:20 UTC.
Paket 12 (31.10 14:24, PR #244): 16 MAT-SS-3/4 + 8 raises, 2.88 M; simboli backfill 31 lessons (4 agents, 0.40 M), --brez empty.
Visual check (j 31.10, PR #250): `node scripts/preveri-videz-lekcij.cjs [--samo ids] [--vse]` renders all lessons phone+desktop; root-bar bug (icon CSS shrank KaTeX svg) fixed; public/sirina.js shrinks wide formulas/tables to 80 % then scroll; inline formulas never wrap; sim settings ≤6 values = buttons (kit.js GUMBI_DO). PR #251 (j 1.11): too-long formulas auto-fold at = (left side on top, each »= …« below; sirina.js zlozTex); ~79 formulas with one very long right side still shrink+scroll. PR #254 (j 1.11, even line spacing): inline formulas inline-block (−0.15em), inline \dfrac rendered as \frac, only still-too-tall ones get own line.
