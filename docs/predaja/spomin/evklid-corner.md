---
name: evklid-corner
description: Kotiček zanimanj (special-interest news corner, PR #111, 2026-10-29): questionnaire at start, RSS news per topic, pins, fullscreen newspaper/notice board
metadata:
  type: project
  modified: 2026-10-29T15:03:55.405Z
---

j asked (2026-10-29 14:39, 14:44): a "special interest" corner where each user pins news about topics they choose; a questionnaire at app start; a fullscreen mode that shows science articles like a newspaper or notice board. Built and merged in PR #111.

- Topics + feeds: `public/interests.js` (20 topics, max 8 per profile, own keyword topic). Sources: Science News Explores (kids), ScienceDaily, NASA, ESA, MMC RTV SLO (feeds 09, 12, title-match only), Kvarkadabra. No model writes news (no API cost).
- Server `server/corner.js`: RSS read every 2 h, stale-while-revalidate, table `news_cache`; pins in `corner_pins`; OŠ gets only "simple" sources by default; OŠ/SŠ filter out violence/drugs/sex/suicide (`isUnsafe`).
- Settings: `interests` (null = questionnaire not yet shown, [] = skipped), `interest_custom`, `news_level` (auto/simple/all), `news_lang` (all/mine); all in settings-registry so the tutor can change them; interests go into the dynamic prompt part.
- Client `public/corner.js` + `corner.css`: tab "Kotiček", Jaz row, Settings card; fullscreen overlay with Časopis / Oglasna deska modes. Rules in docs/oblikovanje.md "Kotiček zanimanj".
- Screenshots: /mnt/project-files/evklid/posnetki-koticek/.

**Why:** j wants motivation through personal interests, age-appropriate and without personal data.
**How to apply:** new topics → add to INTERESTS + `int.<id>` key in sl.js and all 32 UI json files. Note: `scripts/build-icons.js` must list every icon (PR #111 had to add unlock/castle that games added by hand to icons.js). See [[evklid-chat-settings]], [[evklid-i18n]], [[evklid-ui-design]].
