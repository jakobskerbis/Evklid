---
name: evklid-lab
description: Virtual science lab (j's paid-package point 8): engines lab-ohm/lab-co2, Laboratorij view, 80-experiment plan, pace, owner thread
metadata:
  type: project
  modified: 2026-11-01T07:27:50.522Z
---
j's brief point 8: simulated FIZ/KEM/NAR/BIO experiments the student builds (also wrongly), measures with realistic noise, table + graph + conclusion question, real laws/literature data, a literature test per sim, Opus expert review. Rules, sources, code map: `docs/laboratorij.md`.

Thread: old cmsg_011HYzNBAS5HRU1H7PcSE7JtWrCGs3grp6Y6Jj3kHqkanY handed over 4 Nov 08:00 → /mnt/project-files/predaja/lab.md; NEW lab thread cmsg_011HYzNBAS5HRU1H7PcSE7JtViS4z1CbdbMDqeMEy9ruab (Elektrokemija first, ≤ 25 $, branch claude/project-thread-aay4js). j 4 Nov 07:57: »laboratorij naj bo čimbolj realističen«, 07:59 »tudi vizualno« (real-looking glass, liquids, metals, devices; phones smooth). j 09:34: finish all asked work regardless of limit; for whatever would eat the whole limit (the 80 plan) pick the most important; notify j when done. Merged #333 phone pin (all labs), #351 Gibanje A. j 12:18: run to 95 % weekly; optimizer ≤ 50 $ from 12:19, ≤ 2 heavy agents, OŠ FIZ/KEM core first. Handover /mnt/project-files/predaja/lab.md. LAB THREAD since 4 Nov 12:28: cmsg_011HYzNBAS5HRU1H7PcSE7JtMBKG99cULDQqBqTSNfFEBF (#392 Elektromagnetizem merged 4 Nov 14:04: lab-elektromagnet (+ raven:"os" variant), lab-sila-vodnik, lab-indukcija; 22.2 $; #409 Kemijske reakcije merged 15:29: lab-hitrost, lab-energija, lab-plamenska, each + raven:"os"; session 38.6 $ total. Optimizer: lab STOPPED until reset Wed 11 Nov). Report to Optimizator 2 cmsg_011HYzNBAS5HRU1H7PcSE7Jt8EQahEA2WPJwMnPr2UBLVB; j decisions as cards to cmsg_011HYzNBAS5HRU1H7PcSE7Jt6zBtvecoWzGJyRTNXXvC1w.

**Done:** PR #181 (lab-model.js pure models + test/laboratorij.test.js, lab.js UI parts, lab-fiz.js `lab-ohm`, lab-kem.js `lab-co2`). PR #207 graph »Prikaži« chips + slider marks (prikaz.js, kit axisMark/spanMark/axisSlider). PR #241 own view `lab` (public/laboratorij.js, server/laboratorij.js; new experiment = `lab-` catalogue entry + `LAB_INFO` in katalog.js). PR #252 phone bar 4th slot = Laboratorij (NPZ/Matura for those goals), Tekmovanja under Jaz.

**20 per subject (j 1 Nov 07:23):** plan doc https://claude.ai/artifact/KULjnimXo1Hghn2y3Pe5xo — 20 each FIZ, KEM, NAR (OŠ 6–7), BIO = 80 (2 done), grouped in ~17 shared benches. Report cost_usd before/after in each result reply; full triple review. Earlier PRs: #264 #271 #286. Merged 4 Nov: #308 Silomer in uteži (lab-hooke/gostota/vzgon/tlak), #312 Indikatorji (lab-ph/dokaz/slina); 96.14→115.97 $. #315 Optična klop (lab-lom, lab-leca) merged 07:54; 3 benches 96.14→120.31 $ (24 $, session cost undercounts subagents). #329 Elektrokemija (lab-elektroliza/galvanski/kovine) merged 4 Nov 09:36; new session cost_usd counts subagents fully: 47.8 $ incl. phone pin layout + app-wide equation break work (cap was 35 $) → real cost ~20–25 $/bench. Order: OŠ FIZ/KEM → NAR → BIO → SŠ.

**After the 80 (j 1 Nov 08:52):** lab keeps adding NEW experiments WEEKLY. When the 80 are merged, create a weekly scheduled task (Wed after the 02:00 UTC reset): 3 new experiments/week (one bench), picked from curriculum gaps + reserve list in the plan doc, full triple review, cost reported to optimizer (~15–20 $/week).

**How to build cheaply:** one fresh Opus author subagent with a tight brief (lab.js API, spec, test pattern), then two pregled.md reviewers; few own turns. Reviewers run in parallel with split file ownership (pass 2: model/tests/docs; pass 3: CSS/layout/wording), no commits by them. Branch claude/project-thread-sq9hrw: reset from origin/main per PR (remote branch gets deleted on merge; if it still exists, `git merge -s ours` before push, force-push denied).

**Sim ideas from j (1 Nov):** see [[evklid-sim-ideas]].

Related: [[evklid-token-rules]], [[evklid-usage-limits]], [[evklid-simulations]], [[evklid-quality-bar]].
