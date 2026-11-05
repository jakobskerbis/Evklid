---
name: evklid-usage-measuring
description: How to measure Evklid thread usage in $ and convert it to % of the weekly limit (get_session cost_usd, snapshots, ~$40 per 1 %), with measured costs of PRs and batches
metadata:
  type: reference
  modified: 2026-11-04T02:27:51.057Z
---

- `get_session(session_id)` works for any project session (session_X = cse_X) and returns `usage.cost_usd` (API-equivalent, includes subagents), `external_metadata.context_usage.used_tokens` (context size) and `external_metadata.rate_limit_info` (one limit type at a time, no % value). After an auto-compaction used_tokens may still show the old size until the next turn ends.
- Context sizes 4 Nov: a fresh thread already holds 93–120k tokens (instructions, tools, memory); long threads 200–375k; autocompact at 384k. A thread over ~200k that still has work hands over to a fresh thread (docs/token-rules.md §4).
- Snapshot of all sessions: one Sonnet agent (~$1–3) calls get_session per id; files kosti-snapshot-*.json in the optimizer's scratchpad (lost when its container is reclaimed). Latest: kosti-snapshot-4.json, 4 Nov 02:15 UTC, 35 sessions.
- Calibration: Δ$ between two snapshots ÷ Δ% between two of j's screenshots at about the same times. 30 Oct: 1 % of the week ≈ $40; Fri 11:43 → Sat 03:55 UTC: $498 for 18 %, so ≈ $28; Sat 03:55 → Sun 10:40: $251 for 13 %, so ≈ $19 (snapshots miss coordinator sessions and j's own use, which grow when j sends many asks); Sat 03:55 → Wed 02:15: $381 for about 16–17 %, so ≈ $22–24. Estimates ran 4 points low on 1 Nov: trust j's screenshot. Biggest spenders Sat→Wed: textbook $80, keyboard $50, lab $46, optimizer $39, tutor prompt on Fable $25.
- Rates 30 Oct 09:33→11:43 UTC, no lessons: $117/h for all threads, ~$84/h of it feature threads; one working feature thread ≈ $10/h; long-context threads re-read 140–400k tokens per call.
- Costs: code PR like #186 (thread + 2 reviewers) ≈ $11; faks PR #210 (27 programmes, 16 agents, 2.4M subagent tokens) ≈ $50; textbook batch 11 on 30 Oct (16 new + 8 raises + 24 mind maps, 32 agents, 56 min, 2.88M subagent tokens) = $32.3 of session cost ≈ 0.8 % of the week, about $1.6 per lesson-equivalent (a raise counts as half). Lab: new bench + first experiment with triple review = $14.7 (PR #264, 1 Nov); new bench + 4 experiments = $16 (PR #286, 4 Nov), so about $4 per experiment and the 78 left ≈ $300. Independent audit pass (fresh Opus auditors) on 10 triple-reviewed lessons ≈ $6–8, so ≈ $0.7 per lesson (PR #269, 1 Nov); it found 0 serious and 1.3 minor issues per lesson, so extra audits pay off mainly for the 93 below-bar lessons.
- No tool shows the weekly % (j asked 1 Nov for a thread that sees total usage; answer: only j's screenshot is exact). From 4 Nov also count coordinator sessions (ids = parent_session_id on thread sessions, relay headers; coordinator 30 Oct 06:25–14:18 = $16.07, ≈ $2/h on a busy j day) and routine runs (list_triggers last_run.session_id) in snapshots; j's own app chats stay invisible. Lab and NPZ threads (1 Nov) suspect cost_usd misses part of subagent tokens (unverified).
- j's Usage panel also shows tokens per thread ("This project · running now"; 4.4B tokens in total on 30 Oct).

Related: [[evklid-usage-limits]], [[evklid-token-rules]].
