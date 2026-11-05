---
name: evklid-ai-budget
description: j's rule (30 Oct 2026) — tutor model choice paced to a 200 $/month API budget shared per profile by plan price, with in-app credit top-up keeping ≥50 % profit; thread + design
metadata:
  type: project
---

j 2026-10-30 (thread cmsg_011HYzNBAS5HRU1H7PcSE7JtCXhSZk46TY4tFKkVQPJUu3): model allocation should spend as close as possible to 200 $/month of API credit (expected with j's Claude Max plan, arrives ~5 Nov, j confirmed 30 Oct 13:27 »čez 6 dni«) and never exceed it; adapt to number of users and availability. 200 $ is the base shared by students for one month, split per profile by status: paid subscribers proportionally more by price than free. When a profile uses its monthly share it can buy more usage in the app; ≥50 % of each transaction stays as profit (j's example: pay 100 $ → 50 $ credit tied to the user account; j corrected "50 not 500").

MERGED as PR #211 (30 Oct 12:01, j approved packs on card). Built (server/proracun.js, server/placila/krediti.js, usage.js): pace levels (Opus/Sonnet under plan, Haiku ahead, stop 3 % before cap), weights (paid = €/month per child, trial/promo/pass 9.99, school 2, free 1), credit packs 5/10/20 € + any amount ≥5 € (no upper limit, j), shown only as ~conversations (0.05 $/conversation estimate, note 'more depending on model'), never the share. Free tier keeps its old caps (0.2 $/student, 10 $ pool): j confirmed 30 Oct 12:02 »naj bo meja za brezplačne ista«. Budget is NOT in the chat settings registry (financial). Admin edits it in the usage meter popover.

j is on the ULTRA plan (screenshot 1 Nov; upgraded ~27–29 Oct) = 200 $/month API credit, so the 200 $ budget is right. Claim after 7 days on plan (~3–5 Nov): claude.ai Settings → Billing → API credits → Link organization → "j's Individual Org" (the Console org with Evklid's usage); link is one-time.
DONE 3 Nov 12:12 UTC: j linked it, Console shows 200 $ promotional credit.
PLAN (j 1 Nov 11:26): downgrade Ultra → Max 5x on 28 Nov, one day before the 29 Nov renewal; from 29 Nov API credit = 100 $/month, so set the budget to 100 $ then. Crisis thread has a reminder for 28 Nov.

- 1 Nov (crisis thread): Anthropic help article says Max = 100 $/month API credit (Ultra 200 $); 200 $ may be double. Waiting for j to link credit and report the amount; then set the base in the usage meter (admin, kv budget_base_usd) or Render env EVKLID_MONTHLY_BUDGET_USD — no code change. Don't change before j confirms.

**Why:** today the API account ran out of credit (tutor showed "400 ni dobroimetja").
**How to apply:** pricing/limit changes go through this design; credit spend beyond 200 $ needs extra balance on the Anthropic account (auto-reload). See [[evklid-ai-cost]], [[evklid-accounts-billing]].
