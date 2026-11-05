---
name: evklid-tutor-accuracy
description: j asked (30 Oct 2026) whether Haiku is accurate enough; planned 50-task Haiku vs Sonnet test after API credit (~5 Nov) and live answer checks (code + model if needed)
metadata:
  type: project
  modified: 2026-11-04T08:01:07.181Z
---

j 2026-10-30 ~19:50 (thread cmsg_011HYzNBAS5HRU1H7PcSE7JtCXhSZk46TY4tFKkVQPJUu3): »ali bo haiku dovolj natančen«, »kako vemo da haiku ne da najprej napačnega rezultata«. Then: »vgradi kontrolo kode za vse kar je primerno« + »in model če je potrebno«.

- Test script `scripts/primerjava-modelov.js` (50 worked examples from lessons, Haiku chat vs Sonnet mid with the app's real prompt, Opus grades vs lesson solution; `--dry`, `--max-usd 5`). j said »okej« to running it once credit arrives (~5 Nov). Estimate ~5.2 $ for 50 tasks → run `--n 5` first, then `--n 45` to stay under the 5 $ ask-j line (or ask j). Needs an API key: Render Shell or j's PC.
- Live checks (being built 30 Oct): pre-solve with own solver (public/scan/solvecore.js) gives the tutor the verified result; post-check recalculates arithmetic and appends »Popravek«; Sonnet review only for competitions/university/re-explain Haiku answers without calculations, daily cap EVKLID_LIVE_CHECK_DAILY_USD 0.30 $ (j found 1 $ too high, 30 Oct 20:23), not free plan, not in budget saving mode.

- Queued after the live-check PR (j »ja«, 30 Oct 20:16): weekly AI review of the tutor system prompt: sample conversations + mistakes caught by the live check → draft prompt changes → test on the fixed 50-task set → PR; never merge prompt changes without j's approval; low cost. Data scope (j 31 Oct 03:30 »kar bo boljše za natančnost«): caught + reported mistakes AND a sample of whole conversations, with names removed, no photos, not kept after the review. Build after the 4 Nov usage reset; needs API credit (~5 Nov) to run. Data-protection thread limits (31 Oct): line in public/zasebnost.html purposes + row in docs/varnost-podatkov.md (6(1)(f), retention 0); exclude under-15 and opted-out (setting »Uporabi moje pogovore za izboljšanje Evklida« or opt-in only); strip emails/phones/URLs/school names/typed names; decrypt with unseal() in memory only, never to disk/logs/repo; skip safety-flagged convs; max 50 convs/week; audit(db,{actor:'system',action:'prompt_review'}) from server/dnevnik-dostopov.js.

- PR #240 merged 31 Oct 03:52. Promised j: once API credit is back (~5 Nov), review the first corrections/reviews (usage kinds `popravek`, `preverjanje`) for false corrections and report; `EVKLID_LIVE_CHECK=0` is the off switch.

- 4 Nov (j »nadaljuj kontrolo«): j ran on Render Shell `primerjava-modelov.js --n 5` = 0.31 $: Haiku 4 ok + 1 minor, Sonnet 4 ok + 1 error (competition task, impossible follow-up exercise). Next: `--n 45` (~4.5 $, under 5 $). Script `scripts/pregled-popravkov.js` (PR #296) lists live-check corrections; Render deploys only in a quiet moment, so j fetched it with curl from raw.githubusercontent. Prod usage (30 d, 4 Nov): model ids undated, prices correct (#297 dated-id fix is only a guard). 6 answers, 0 corrections; 3 Haiku chat 0.0057 $, 3 Opus boost 0.334 $ (budget level 3, by design). Real test 5 tasks cost 0.31 $ → 50 ≈ 3 $; j asked to run --n 50 --max-usd 5.
- Daily question limit (PR #297, j chose budget scaling 4 Nov): fixed plan limits (Osebno 60, school 15) are the floor, budget raises up to EVKLID_DAILY_QUESTIONS_MAX 200 via usage.dailyLimit; free stays 10; monthly share still blocks.

- Weekly prompt review: optimizer moved it to the week of 11 Nov (reminder set for 11 Nov 08:00 UTC; ask the optimizer for a cap first). Not built yet.
- 4 Nov results and decisions: see [[evklid-model-comparison]] (SŠ → Haiku think, prompt rule tested).

**Why:** live answers stream unchecked; only cached answers had the triple check (server/verify.js).
**How to apply:** report test results to j with error rate per level; use them to decide where model review is worth it. See [[evklid-ai-cost]], [[evklid-ai-budget]].
