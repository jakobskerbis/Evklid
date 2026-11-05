---
name: evklid-i18n
description: STEMMind multi-language system (PR #40): how languages, UI translations and tutor language work, and what is still Slovenian-only <!-- brand:legacy -->
metadata:
  type: project
  modified: 2026-10-28T15:18:37.814Z
---

j asked (2026-10-28) for versions of the app "in all languages with over a million speakers, for future business opportunities". Built in PR #40, merged into main 2026-10-28.

- `public/i18n/languages.js`: 292 languages `[code, native, english, fallbackUI, millions]`, RTL set, `UI_LANGUAGES` (33 translated UIs). Server imports it too (settings enum).
- `public/i18n/sl.js` = Slovenian source catalog; `public/i18n/ui/<code>.json` per language, same keys (test/i18n.test.js enforces keys + placeholders + plural objects). sr-Latn is transliterated at runtime; zh-Hant generated from zh with opencc s2twp, then TW terms fixed by hand.
- `public/i18n.js`: `t(key, vars)`, `data-i18n*` attributes, fallback chain e.g. bho→hi→en→sl. Language stored in localStorage `stemmind.lang` and student `settings.language`; switching reloads the page. <!-- brand:legacy -->
- Tutor language: `{language}` in the dynamic part of prompts/system_prompt.md (below cache marker) + section "### Jezik pogovora".
- First start (PR #41, merged 2026-10-28, j's request "prilagojeno regiji, najbližji dialekt, angleščina kot default"): `detectLanguage(navigator.languages)` in languages.js picks language + region (zh-TW→zh-Hant, ar-EG→arz, sr-ME→sr-Latn, fa-AF→prs, aliases no→nb, fil→tl), else English. Region saved as `settings.region` (ISO 3166) and sent to the tutor prompt ("regija: Brazil (BR)"). Manual choice in Nastavitve wins. Existing students keep `language: sl`.
- Translations were written in-thread with no API spend. Adding a new UI string means adding the key to sl.js AND all 32 json files (or the test fails).

**Why:** future markets; dev version only for now.
**How to apply:** still Slovenian (phase 2): curriculum/topics/tasks, textbook lessons, simulations, textbook.js, leagues.js, pad.js, account/auth screens, server messages, new strings in speech.js/symbols.js/level-up.js. Translating lesson content needs API credit → ask j first. See [[evklid-textbook]], [[evklid-ui-design]].
