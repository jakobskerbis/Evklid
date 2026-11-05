---
name: evklid-faks-progress-dashboard
description: j's live list of university programmes with lesson progress (Dashboard artifact, 30 Oct 2026) and how to refresh it after each faks batch
metadata:
  type: reference
  modified: 2026-10-30T13:41:17.576Z
---

j asked on 30 Oct 2026 for a "realtime updating" list of finished programmes and how much each unfinished one still needs. It is the Dashboard artifact https://claude.ai/artifact/3SyVc55p1QwwsAPMbnCnX9 ("Napredek fakultetnih lekcij").

Its data is one attached JSON file, dataset `programi`. Rows give, per programme, the topics per year and how many have a lesson; a topic counts as having a lesson when `loadLesson` finds one, shared topics included. The page computes the totals itself with the calc `skupaj`.

**Refresh after every merged faks lesson batch, or after a curriculum change:**
1. Run `node scripts/napredek-programov.js <out.json>`.
2. Upload the file: Artifact publish with `asset: true` and the url above.
3. ArtifactData `update` on `datasets/programi`, setting the new `source.url` and `updated` {at, by}.

**State on 4 Nov 07:52 UTC (after PR #314):** 0 of 71 programmes complete; 3517 of 14309 programme topics have a lesson; dataset doc version 3.

Related: [[evklid-university]]
