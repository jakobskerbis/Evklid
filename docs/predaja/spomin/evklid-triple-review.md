---
name: evklid-triple-review
description: j's rule (2026-10-29) that every change/element is reviewed three times; docs/pregled.md, smoke test preveri-aplikacijo.cjs, first whole-app sweep PR #138 and its open items
metadata:
  type: project
  modified: 2026-10-29T18:49:43.146Z
---

j 2026-10-29 15:19: »Naj bo vsaka stvar in element v aplikaciji trikrat pregledan.« Thread "Triple-check every app element" (cmsg_011HYzNBAS5HRU1H7PcSE7JtESZw9qT9CNGMkb2QLedatG).

**Rule:** docs/pregled.md (pointer in CLAUDE.md, kakovost.md). Code PRs: pass 1 automatic (`npm test` + `node scripts/preveri-aplikacijo.cjs`, the Playwright smoke test of every tab/flow on desktop+phone+accounts, ~3 min, 0 problems on main after #138), passes 2 (function) and 3 (look/phone/i18n/content) by separate Opus reviewer agents; small PRs and look-only changes (no money, AI cost, accounts, data or lesson content) may combine 2+3 in one reviewer; those areas always get two (j 2026-10-30 20:25, docs/pregled.md). WIDENED j 2026-11-04 15:23 (PR #411): small fix = bug fix/tweak ≤ ~50 lines, no new screen/feature → pass 1 + ONE reviewer; money, prices, AI cost, accounts, personal data, tutor prompt and all content (lessons, exercises, papers, sims, videos, experiments) keep two separate reviewers. Lessons: checker + second Opus + third "student's eyes" reader (`lesson-brief.js --read`, token-rules §3b, owned by optimizer). Whole-app sweep (3 lenses in parallel + verifier) after big changes and before each public step.

**First sweep:** PR #138 merged 2026-10-29 ~19:00 UTC: ~45 fixes (history/back, add-profile cancel, tour per profile, 500s on __proto__ ids/bad JSON, chat list on phone, contrast, RTL logical CSS, Lige + textbook index translated, ~30 content fixes, tutor prompt now knows NAR/BIO).

**Open after #138:** lesson page, level-up, speech, account strings still Slovenian only (voice input fixed sl-SI); button.small 38 px < 44 px (design thread); uni generators one-line solutions, empty data, L1=L3; frog under »popolna preobrazba« (nar-data razvoj); paramecium »organi« (bio-data s2-dihanje); tek-fiz Lorentz shows 33·10^5; exam magnetism 2 sig figs; nar ločevanje same why for every option; quad_zero filler {−5; −5}; feedback after wrong answer repeats ladder hint; exam topics in English in Slovenian UI; game start card Esc; pad placeholder clipped on phone; Kalkulator empty-history hint clipped.

Related: [[evklid-quality-bar]] [[evklid-token-rules]]
