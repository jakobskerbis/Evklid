---
name: evklid-dialect
description: Tutor dialect setting (PR #119, merged 2026-10-29): where it lives, rule that STEM terms stay standard, untested with real model
metadata:
  type: project
  modified: 2026-10-29T15:27:11.441Z
---

j asked 2026-10-29 15:18: user can set the tutor's dialect (narečje). Done in PR #119 (merged).

- Profile setting `dialect` ("" = knjižni jezik). List per conversation language in `public/dialects.js` (sl: pogovorno, ljubljansko, gorenjsko, dolenjsko, stajersko, prekmursko, korosko, primorsko; also en/de/es/pt/fr/nl/hr/it/ar variants and Hinglish). Reset to "" when language changes (server/settings.js normalizeSettings).
- Nastavitve: select »Narečje inštruktorja« (hidden if the language has no variants). Chat: registry entry + `get_settings options=dialect`, `change_settings` accepts id or name.
- Prompt rule (static part, »Jezik pogovora«): dialect colours only the chat tone; terms, formulas, units, Zapomni si, Povzetek, cards, tasks, Varnostni ščit stay standard. Chosen dialect + hint is below the cache line. Dialect is part of the answer-cache key.

**Why:** learning must stay correct for school; dialect is only flavour.
**How to apply:** not yet tested with a real API key (Haiku); if j reports a dialect sounding wrong, weaken or drop it in public/dialects.js. See [[evklid-chat-settings]], [[evklid-prompt]].
