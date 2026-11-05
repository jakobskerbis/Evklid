---
name: evklid-brez-robov
description: Rule "no empty side space" on every screen/platform + app WebView safe-area fix (j 2026-11-04, PR #335 merged)
metadata:
  type: feedback
  modified: 2026-11-04T15:14:56.435Z
---

j (2026-11-04): »Če je ob straneh zaslona na katerem koli delu Evklida prazen prostor, naj se prikaz spremeni tako, da ga izkoristi« — on every platform. Also: tutor header chips must not be truncated.

**Why:** j saw a wasted band above the tutor header in the Android app and centred 780 px pages with empty sides on desktop.

**How to apply:** never give a view or main wrapper a px `max-width` (`test/brez-robov.test.js` scans all public CSS incl. subfolders). Side gutter `--rob-strani`. Cards go in CSS columns by container width (`column-width: 400px`; wrap new card pages in `<div class="kolone">`), so it also works in movable windows. Safe-area offsets always `var(--varno-zg|--varno-sp, env(safe-area-inset-…, 0px))`: theme.js zeroes them when UA has ` EvklidApp/` because mobile/src/app/web.tsx already pads insets (else double gap). Exceptions: Evklid keyboard / input pad max 640 px. Rule text in docs/oblikovanje.md »Brez praznih robov«. Phone chat header: chips in own scrollable row, »Preberi lekcijo« first. Thread cmsg_011HYzNBAS5HRU1H7PcSE7JtFhtapB5kNmRUBRjAsnimML. Also empty LOWER half counts (j 4 Nov, marked Jaz/Napredek/Urnik/Lige/Kotiček): fill with useful content, not bigger cards — PR #402 (Urnik wall grid, year XP heatmap public/aktivnost.js + xpDays in /progress, Jaz overview, 30-slot league board, interest tiles); merged 4 Nov. Exception j asked 4 Nov: Settings on wide screens max 3 columns centred (ui.css #view-settings, docs/oblikovanje.md). Related: [[evklid-ui-design]] [[evklid-windows]].
