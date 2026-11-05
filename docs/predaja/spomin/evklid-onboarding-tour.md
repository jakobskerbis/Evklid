---
name: evklid-onboarding-tour
description: STEMMind first-use tutorial (PR #130, 2026-10-29): what it shows, per-profile tour_version, how to add a step <!-- brand:legacy -->
metadata:
  type: project
  modified: 2026-10-29T18:06:45.532Z
---

j (2026-10-29 16:01): "Za vsakega uporabnika ob prvi uporabi naredi tutorial kako aplikacija deluje in kje so kakšne od njenih značilnosti". Built in PR #130 (merged).

- Code: `TOUR` array + `startTour()` / `maybeTour()` in public/app.js, overlay `#tour` in public/index.html, CSS `.tour*` in public/style.css. Steps: welcome, how you learn, daily training, path, modes, then one step per tab (`.tab[data-view=…]`), »Jaz« (phone), profile button, end. Steps whose element is not visible are skipped (desktop 18, phone 11).
- Once per profile: `settings.tour_version` (server, server/settings.js normalizeSettings; deliberately NOT in DEFAULT_SETTINGS so the tutor's settings tool can't touch it). Shown while < `TOUR_VERSION` (2). Bump TOUR_VERSION to show a changed tour to everyone once. Replay: Nastavitve → »Ponovi uvodni ogled«.
- New feature tab → add a TOUR step + `tour.<x>Text` key in sl.js and all 32 ui/*.json ([[evklid-i18n]]).
- Browser check script pattern: scratchpad shot-tour.cjs (server with EVKLID_MOCK=1, EVKLID_DB temp, student with `settings.interests: []` to skip the interests questionnaire).

Related: [[evklid-ui-design]]
