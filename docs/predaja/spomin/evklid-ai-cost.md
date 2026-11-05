---
name: evklid-ai-cost
description: STEMMind AI cost per student after PR #47 (2026-10-28): what drives cost, caps, env switches, estimate script <!-- brand:legacy -->
metadata:
  type: project
---

PR #47 (merged 2026-10-28) cut estimated AI cost per typical active student from ~1.51 € to ~0.82 €/month (very active 13.7 → ~1.0 €, Tekmovanja 21.6 → ~0.9 €). Estimate: `node scripts/ocena-stroska.js` (`--db` adds real usage); details in docs/stroski-ai.md.

- Cost driver: one Haiku 5.5 reply ≈ 0.0004 €, one Opus 5.5 reply ≈ 0.04–0.07 €. »Razloži podrobneje« is always shown (PR #85, j 2026-10-29 "always re-explain, lowest cost"): 1st press = thinking Haiku, Opus only on the 2nd consecutive press (counter conversations.deep, reset by a normal message). Opus: effort low, last 3 exchanges, 1h cache TTL; max 5/day per student (EVKLID_DAILY_DEEP), above 1 $/month (EVKLID_STUDENT_SOFT_USD) the thinking Haiku (effort high) answers with a note; hard cap 3 $/month (EVKLID_STUDENT_MONTHLY_USD; render.yaml still sets 1.5).
- Tekmovanja now Haiku effort high by default; EVKLID_COMPETITION_DEEP=1 restores Opus for every reply (was the old behaviour; j may want it back if quality drops).
- No-model replies: Vadnica »Vprašaj STEMMind« first reply built by server/hints.js; learning-path topic starts reused via answer_cache (key includes topic + weaknesses). Logged in usage as kind reuse/hint, cost 0. <!-- brand:legacy -->
- Dashboard: Nastavitve → Poraba AI in € (EVKLID_EUR_PER_USD=0.87); parents see % of monthly limit per child.
- PR #86 (2026-10-29, j asked "števec porabe, ki ga vidim samo jaz, za vse profile"): top-bar usage counter (€ today, popover per profile with bar to monthly limit) visible only on the host PC or to admin accounts (EVKLID_ADMIN_EMAILS, or the "Pokaži števec tudi na mojem telefonu" button on the PC sets parents.is_admin). Through the tunnel /api/usage returns 403. Popover also shows the limit + price suggestion from server/advice.js (quality first, then profit: target 6 €/subscription, min 4 € even at full limit; price by trial→paid conversion, ≥10 ended trials). j 2026-10-29: keep the limit at 3 $ for now, adjust limit/price by demand later, quality and profit first; suggestions change nothing automatically.
- Not yet verified with a live API call (no key in cloud env); params used: Haiku thinking disabled + effort low for OCR/interview, Opus effort low, cache ttl 1h. See [[evklid-prompt]].
- Free tier (PR #129, merged 2026-10-29): free students never get Opus (thinking Haiku + note); monthly caps EVKLID_FREE_POOL_USD (default 10 $, all free students together) and EVKLID_FREE_STUDENT_USD (0.2 $), covering tutor, OCR and schedule photo. Max free student ≈ 0.12 €/month.
- Ads: j chose "Ne zdaj" (2026-10-29). Estimate: non-tracking ad ≈ 0.0005 €/impression ≈ 1 Haiku reply; 1 subscriber ≈ 100–200 free users with ads. Blockers: DSA art. 28 (no profiling ads to minors), cookie consent incl. parental under 15, privacy notice, own domain for AdSense. Revisit only with many free users; preferred alternative was own non-tracking sponsor slot for parents.
