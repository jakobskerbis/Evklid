---
name: evklid-faks-structure
description: Exam-based structure of university lessons (j 4 Nov 2026 after a past-exam comparison), its rollout order (UL FKKT first) and the faks pace/cap for 4–11 Nov
metadata:
  type: project
  modified: 2026-11-04T08:02:56.895Z
---

**Past-exam pilot (4 Nov 2026, j asked »ali lahko lekcije primerjaš s preteklimi izpitnimi roki«):** 20 public Matematika exams. UL FKKT: users.fmf.uni-lj.si/magajna 2013–14, theory parts only. UM FKKT: fkkt.um.si/ukemat 2023–26. Exam text is never copied or stored; reports are in the faks thread scratchpad izpiti/*.json.
- Result: 71 task types, 18 covered, 38 partly, 15 missing.
- The UL FKKT gaps are the PR #221 topics that have no lesson yet (Taylor series, hyperbolic/area functions, improper integrals, ODE types).
- Our examples are below exam level, and the theory part (definitions, theorems, proofs, ≈ 40 % of an exam) was not practised.
- The UNI-UMFKKT-MATB topic list is WRONG: its exams test linear algebra, ODEs (systems, Euler, Riccati) and Fourier series. Fix it from the official učni načrt with the next syllabus expansion.

**Structure (j chose »Da, po primerjavi z izpiti« 07:44; 07:46 »naj velja za vse lekcije ne le nove«):** docs/kakovost.md §1c, PR #319.
1. Definitions, theorems and exam proofs go in Razlaga.
2. Primer 3 is at exam level.
3. New `## Za izpit` section after Povzetek: »Znati moraš povedati:« plus 2–3 `### Naloga` with `**Rešitev:**` (hidden behind a button).
4. »Drugače: Uporaba v stroki« replaces »Iz vsakdanjega življenja«.
5. Length 1800–3000 words.

check-lesson only WARNS until all 180 old university lessons are reworked; then make it an error.

**Order (j 07:47 »najprej naredi fkkt ul«):** UL FKKT first. 139 UL FKKT 1st-year topics have no lesson. Thu 5 and Sat 7 Nov batches take only these, in the new structure, via `pripravi.sh … UL-FKKT`. Mon 9 Nov: restructure the first ~25 existing UL FKKT lessons (≤ 25 $). Next week: the rest of UL FKKT (~65–75 $), then the other ~90 faks lessons and the syllabus expansion (UL FMF first, then UL BF; UM FKKT Matematika B fix).

**Cap 4–11 Nov:** 187 $ from 06:15 UTC 4 Nov (optimizer thread cmsg_011HYzNBAS5HRU1H7PcSE7JtEMiTgSpbZu2iAmVotBg46y). Batch 1 used 40.7 $ (cost_usd 407.58 → 448.27). The optimizer pings at 06:30 UTC on Thu and Sat. Report cost_usd before and after each step. Still no »Faks lekcije 2«.

Handover 4 Nov 08:25 to new thread cmsg_011HYzNBAS5HRU1H7PcSE7JtHA4fzZiaYBVmPh8JHBoryE: /mnt/project-files/predaja/add-university-study-program-tutors.md, tools in /mnt/project-files/evklid/faks-orodja/. Structure PR #319 merged; week spend 51.7 $ of 187.

**PLAN CHANGED 4 Nov 09:34 (j cmsg_011HYzNBAS5HRU1H7PcSE7JtTw2vVCQo5mZXdLeQf9AR9E »dokončaj vse ne glede na limit«, via optimizer):** no Thu/Sat wait. Slice = UL FKKT 1st year only: rework ALL 91 existing UL FKKT lessons, then new UL FKKT 1st-year lessons, back to back, ≤ 4 heavy agents (lekcije.js args.max), budget ≤ 300 $ from 09:38 (thread session cost_usd 1.10 at start). Other faculties next week. Report cost_usd after each batch/PR to Optimizator 2 cmsg_011HYzNBAS5HRU1H7PcSE7Jt8EQahEA2WPJwMnPr2UBLVB (from 11:34), say »done« at the end; notify j when done. Rework run wf_d0c94627-a51 started 09:45 on branch claude/project-thread-t0xk19.

**STOP 4 Nov 12:14 (j 12:13 »naj zaključi najpomembnejše stvari takoj«, weekly 72 %):** no new faks agents until reset Wed 11 Nov; cap ≤ 30 $ more. Rework run stopped: all 31 writers done (91 lessons, cost_usd 99.2 at stop), reviewers done for groups 1–12 = 36 lessons (19 MAT, 11 KEMIJA, 6 FIZ). Those 36 get the student-reader pass (run wf_31b084fc-655) and then one PR. The other 55 reworked-but-unreviewed lessons are saved as /mnt/project-files/evklid/faks-orodja/wip/predelava-13-31-nepregledano.patch (file list wip.txt there; git apply on main, then run reviewer + reader only, groups 13–31 of predelava-vse-args.json). New UL FKKT lessons not started. **12:18 update (j »naj delo teče do 95 %«):** finish the 36, then review the 55 saved rewrites (passes 2+3) and merge in small batches; ≤ 60 $ more from 12:19 (cost_usd then ≈ 99.5), max 2 heavy agents, no new 1st-year lessons this week, hard stop when the optimizer says 95 %. **PR #375 merged 12:36: 36 lessons (19 MAT, 11 KEMIJA, 6 FIZ) in the new structure, cost_usd 110.7.** Next: review-only run wf_df15c000-a43 (lekcije.js args.reviewOnly) on groups 13–21 = 27 lessons applied from the patch; then groups 22–31 (28 lessons) if budget allows. **PR #378 merged 13:04: +27 lessons (cost_usd 127.0).** Last 28 (groups 22–31) review-only run wf_c1ca8fda-7a0 started 13:06; **DONE 13:34: PR #387 merged, all 91 existing UL FKKT lessons are in the exam structure (#375 36, #378 27, #387 28), cost_usd 145.3 at the end (≈ 144 $ total for the rework). WIP patch deleted (fully applied).** Next, after the 11 Nov reset and with an optimizer cap: new UL FKKT 1st-year lessons (139 topics, lekcije-11-args.json; regenerate it with pripravi.sh … UL-FKKT), then the other ~90 faks lessons (lekcije.js args.restructure), then the syllabus expansion (UL FMF, UL BF, UM FKKT MATB fix). Rework cost ≈ 1.6 $/lesson (writer ~2.2 $/3 lessons, reviewer ~2 $, reader ~0.9 $).

Related: [[evklid-university]] [[evklid-quality-bar]] [[evklid-post-reset-queue]]
