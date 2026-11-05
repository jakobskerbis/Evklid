---
name: evklid-landing
description: Landing page on evklid.app for new visitors before sign-in (j card 4 Nov 11:22): PR #363, files, routing rules, status
metadata:
  type: project
  modified: 2026-11-04T12:00:48.301Z
---

j chose on card (»Odločitve zate«, 4 Nov 2026 11:22) to build ONLY the landing page for new visitors before sign-in; step tracker and quick buttons stay for later. Thread »Zgradi pristajalno stran evklid.app« cmsg_011HYzNBAS5HRU1H7PcSE7JtUDyLDy5Dfvc4WiRSNHvhKx.

- PR #363 MERGED 4 Nov 12:13 UTC after j chose »Da, objavi« (card 12:03). Screenshots /mnt/project-files/evklid/pristajalna/.
- Code: public/pristajalna.js (markup), `.land*` CSS at end of public/account.css, keys `land.*` in sl.js + 32 ui/*.json, routing in public/account.js (localStorage `evklid.racun` = device was logged in → login directly; hashes #prijava/#registracija/#pozabljeno-geslo; logo → landing). Prices live from /api/account/prices.
- True-claim fixes from review: learning path only from 6th grade (1–5: tutor + games), chapters skip via »Preizkus znanja« (not locked), faks has no exam dates in data.
- Android app keeps its native sign-in; landing is web only.

**How to apply:** any new app feature worth advertising → add a card/claim here only if it is true for all levels; keep claims in sync with docs/opis-evklida.md. Related [[evklid-pricing-levels]] [[evklid-marketing]].
