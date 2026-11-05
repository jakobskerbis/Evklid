# Handover: Add university study-program tutors (faks lessons)

Old thread cmsg_011HYzNBAS5HRU1H7PcSE7JtTTzpXKqhPt5Lc56qTZzbDB, 4 Nov 2026 08:25 UTC. Context was 290k, so per docs/token-rules.md the work moves to a new thread. Memory: evklid-university, evklid-faks-structure, evklid-faks-progress-dashboard (read those first).

## Goal
University tutors for 71 Slovenian programmes, plus textbook lessons for every course topic, 1st year first. Lessons are Opus only and triple-reviewed (writer, then reviewer effort high, then student reader).

## j's decisions (4 Nov)
- 07:44, card »Prilagodim zgradbo fakultetnih lekcij?«: »Da, po primerjavi z izpiti«. The exam-based structure is merged in PR #319 (docs/kakovost.md §1c).
- 07:46 cmsg_011HYzNBAS5HRU1H7PcSE7JtWMg2kA5wxgTf4VxoUQbv57: the structure applies to ALL 180 existing faks lessons.
- 07:47 cmsg_011HYzNBAS5HRU1H7PcSE7JtRvNDXVarUhW5ZLUtUDTzL7: »najprej naredi fkkt ul«.
- 06:15: queued work may run up to 40 % of the weekly limit in total.
- Earlier: 30 Oct »Zdaj FKKT, ostalo po 4. 11.« (expand the 1st-year courses to their official učni načrti, done for UL FKKT Kemija in PR #221). 29 Oct: lessons must not be monotone.

## Pace / cap (optimizer cmsg_011HYzNBAS5HRU1H7PcSE7JtEMiTgSpbZu2iAmVotBg46y)
- The cap is 187 $ from 06:15 UTC 4 Nov.
- Spent so far: batch 1 (PR #314) 40.7 $; exam pilot + structure PR ≈ 11 $. Old session cost_usd went 407.58 → 459.29.
- **Thu 5 Nov and Sat 7 Nov:** one batch each, ≤ 50 $. The optimizer pings at 06:30 UTC. Each batch is 24 new UL FKKT 1st-year topics in the new structure. Report cost_usd before and after each batch.
- **Mon 9 Nov:** restructure the first ~25 existing UL FKKT lessons, ≤ 25 $. This needs a new restructure prompt: add »Za izpit« and rigour to Razlaga, raise Primer 3, change »Iz vsakdanjega življenja« → »Uporaba v stroki«, then diff review.
- **From 11 Nov:** the rest of UL FKKT, then the other faks lessons. Syllabus expansion: UL FMF (25 courses), then UL BF (68), then the others. UNI-UMFKKT-MATB has a wrong topic list (its exams test linear algebra, ODEs and Fourier series); fix it from the official učni načrt.

## Tools (copied to /mnt/project-files/evklid/faks-orodja/)
- `S=/mnt/project-files/evklid/faks-orodja sh $S/pripravi.sh $S/lekcije-11-args.json 24 0 0 UL-FKKT` writes the args: 12 pairs, UL FKKT topics, most-shared first. Copy the folder to your scratchpad first and set S to it, because the mount is slow. Arguments 3 and 4 (raises and variety from varied.txt / vary-todo.txt) are old-bar work: keep them at 0 until the restructure prompt exists.
- Then run `Workflow({scriptPath: <copy of lekcije.js>, args: <the json>})`. Writers and reviewers run `node scripts/lesson-brief.js [--review|--read]`, which already contains the UNI rules.
- Pass 1 before the PR: `node scripts/check-lesson.js -q`, `node scripts/check-gradivo.js -q` on changed files, `npm test`, `node scripts/preveri-aplikacijo.cjs`.
- PR on branch claude/project-thread-<new>, squash merge.
- Then refresh the dashboard, following memory evklid-faks-progress-dashboard (dataset version 3).
- fkkt-razsiri.js is the workflow pattern for syllabus expansion (writer + verifier per course group, curl + pdftotext on official PDFs only).
- izpiti/*.json are the exam-pilot reports: gap lists only, no exam text.

## Pitfalls
- The repo was renamed to jakobskerbis/Evklid. GitHub MCP still works with repo "stemmind"; subscribe_pr_activity only accepts "stemmind". <!-- brand:legacy -->
- After a merge the remote branch is deleted, so the next push recreates it.
- Run `npm install` after a rebase (new deps appear on main).
- preveri-aplikacijo can fail once on »pc okna« view-chat: rerun it, and compare with main if it fails again.
- Never read server/university-extra.js or docs/predmetniki-*.md whole. Never add curricula from memory. Never copy exam text.
- The agent cap for non-lesson work is 2 agents. Ask the optimizer before going over the cap.

## Open cards
None. No scheduled wakes are active.
