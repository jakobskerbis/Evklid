---
name: evklid-token-rules
description: Token/quality rules and pacing for all Evklid threads (docs/token-rules.md, lesson-brief.js, check-lesson, napredek.js); pace and limits in evklid-usage-limits; optimizer thread owns them
metadata:
  type: feedback
  modified: 2026-10-30T07:47:41.624Z
---

j (2026-10-29): as few tokens as possible, quality first. j 12:59 UTC: "naj vse niti uporabljajo niti za najboljšo kakovost relativno na to koliko porabe še imamo" = spend what is left on the best quality; fewer lessons rather than worse ones. j 08:42 (decision card, weekly at 54 %): "Upočasni do 4. 11.". Rules: docs/token-rules.md. Owner: optimizer thread ([[evklid-optimizer-thread]]).

**Limits and pace:** see [[evklid-usage-limits]] (the weekly cap binds since 30 Oct 2026; one batch per 5-hour window at most, paced by the optimizer).

**How to apply:**
- Opus/Fable writer + second independent review + third »student's eyes« reader (`lesson-brief.js --read`, §3b). Never Sonnet. Never drop the review, the recomputation or the key check. Code PRs follow docs/pregled.md.
- Briefs: `node scripts/lesson-brief.js [--review|--read] <ids>`. PR #117 adds a per-topic `form` plan for variety (~+250 tokens, could be tightened).
- `node scripts/check-lesson.js -q <files>` recomputes the numeric steps.
- Before a batch: get_session → external_metadata.rate_limit_info (rateLimitType five_hour/seven_day, status, resetsAt).
- Usage (subagent_tokens, comparable only): textbook batch (32 agents, ~48 min) ≈ 2.7M ≈ 110–117k per lesson; faks batch (40 agents, ~59 min) ≈ 3.4M ≈ 95k per lesson, 142k per new one; ~150 fixes per faks batch.
- `node scripts/napredek.js [--json|--straza]`: progress numbers for the 3-hourly report to j.

See [[evklid-optimizer-thread]] [[evklid-textbook]] [[evklid-quality-bar]] [[evklid-ai-cost]].
