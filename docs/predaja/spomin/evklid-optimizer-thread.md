---
name: evklid-optimizer-thread
description: Standing "optimizer" thread (j, 2026-10-29): mandate, guardrail, 4-hourly scheduled check, what it owns, this week's open items
metadata:
  type: project
  modified: 2026-11-04T02:33:23.938Z
---

Thread "Optimize performance and tokens for all threads": 4 Nov 11:35 3rd handover (/mnt/project-files/predaja/optimizator.md), new thread »Optimizator 2« cmsg_011HYzNBAS5HRU1H7PcSE7Jt8EQahEA2WPJwMnPr2UBLVB (session_01SUDXUJj2DcTwdanZq8bdpk); wakes there: 4-hourly trig_01HsVx8Tz3L3aGV2mTfQ8sfC, faks trig_013a9sYbSqZ1WZzmJiM7Kzsi, weekly plan trig_01JZh2F7GqKJrVtN1MwWG9N1. Before: cmsg_011HYzNBAS5HRU1H7PcSE7JtEMiTgSpbZu2iAmVotBg46y (07:31–11:35). Previous: cmsg_011HYzNBAS5HRU1H7PcSE7JtRD8HLfR81B3wJiA5ayzef5 (4 Nov 03:32–07:31). Old: cmsg_011HYzNBAS5HRU1H7PcSE7Jt5AUCukRyA1d68WhKK6jw3U (handed over, /mnt/project-files/predaja/optimizator.md).
- j 2026-10-29 08:02: "nit optimizator … izboljševanje performansa ob manjši porabi tokenov za vse niti".
- 08:33: "naj se konstantno izboljšuje, razen če bi spremembe škodile funkcionalnosti". This is a standing mandate with a do-no-harm guardrail: tests green, small PRs, never trade lesson quality for tokens.

**Owns**
- docs/token-rules.md, scripts/lesson-brief.js, scripts/napredek.js (progress report), server/lesson-math.js (arithmetic check).
- The weekly plan ([[evklid-post-reset-queue]]) and the thread cleanup (j 3 Nov: big threads hand over to fresh ones, /mnt/project-files/predaja/).
- Usage measurement ([[evklid-usage-measuring]]). Details in [[evklid-token-rules]].

**Cadence**
- j 30 Oct 11:57: wake by itself every 4 hours and end at once when there is nothing to improve.
- Scheduled task trig_01L89VanD7dgT9Hhk2xetdUD (old trig_01A7CH9zJxkm13oQoE2UT3BK disabled), `CRON_TZ=Europe/Ljubljana 28 0,4,8,12,16,20 * * *`, bound to this session, with a lean prompt:
  - one watchdog Bash (napredek.js + --straza) and get_session;
  - act only on new lessons (≤ 60-word Slovenian report to j), a due pace change, a failed thread or red main, a stalled restart, one low-risk improvement.
- Threads report batches and caps here; reply only with a result.

**Session setup:** Opus 5.5, effort max, ultracode on (j's choice 29 Oct). Use many-agent workflows only for substantive audits. Non-lesson rule: ≤ 2 agents.

**Open (4 Nov)**
- Weekly plan sent to the coordinator and the textbook thread at 02:25 UTC.
- Restarts and merges are in progress through the coordinator.
- PR #276 merged 4 Nov: docs/token-rules.md now has $ caps instead of max-3, the handover rule (over ~200k with work left), and effort by thread type.
- Chemistry and FKKT routines go back to Monday crons after today's runs.
- 4 Nov 07:30: 2nd handover at 293k (predaja/optimizator.md); coordinator opens a fresh thread; update the thread id at the top then. Earlier: 4 Nov 03:35 new thread, wakes recreated. 4-hourly trig_01L89VanD7dgT9Hhk2xetdUD; faks Sat check trig_01AEMMfz7Lr3pixuJPDohSJb (7 Nov 06:30 UTC); chem/FKKT cron fix one-shot trig_01XqRPS1R4TwtADvPpQBBqeh (4 Nov 08:10 UTC); next weekly plan trig_01Cx43Tc5duwbAzPQLeNi7PF (11 Nov 02:05 UTC). Repo path in container: /home/user/Evklid. napredek.js --straza says »npm test pade« when node_modules is missing; run npm install first (main green, 639 tests, 4 Nov).
- The repo is now jakobskerbis/Evklid. PR activity events may not arrive under the old name.

Related: [[evklid-token-rules]] [[evklid-quality-bar]] [[evklid-textbook]] [[evklid-usage-limits]]
