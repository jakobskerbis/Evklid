---
name: evklid-prijave-samodejno
description: Automatic bug-report triage for Evklid (j 4 Nov 2026): plan, thread, status, build after 11 Nov reset
metadata:
  type: project
  modified: 2026-11-04T20:51:34.192Z
---

j (4 Nov 2026): reports from »Prijavi napako« should be reviewed automatically, fixes prepared as PRs, j reviews/merges.
Thread cmsg_011HYzNBAS5HRU1H7PcSE7JtD8NKq2TBEHTkCS7aCYJ5hD. Plan /mnt/project-files/evklid/prijave-samodejno/nacrt.md.
Design: token export GET /api/prijave/izvoz + POST status (in_review + PR no., fixed), same EVKLID_EXPORT_TOKEN as /api/kozmetika/export; network secret for evklid.app must also allow /api/prijave/ (j changes in Project settings → environment). Daily scheduled run in that thread opens PRs, never merges, never quotes student text in PRs, max 5 PRs/run.
Cost estimate: ~1–2 % of weekly limit per week in pilot, no extra money. j chose DAILY (»Vsak dan zjutraj«, 5.43 Ljubljana) on 4 Nov 20:52; build reminder set for 11 Nov 10:07 Ljubljana. Optimizer caps: build PR ≤ 15 $, runs ≤ 2 % of week, report to optimizer if a week passes 1.5 %; priority 2 after scanner.

**Why:** j wants hands-off triage but keeps final review.
**How to apply:** Don't build before 11 Nov reset unless optimizer allows; see [[evklid-feedback]] for the older manual feedback loop.
