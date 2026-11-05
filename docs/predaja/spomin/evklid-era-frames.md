---
name: evklid-era-frames
description: History styles: columns/temple only in Antični; every other era shows the empty tutor chat inside a building of its own period (j 2026-11-04, e.g. Taj Mahal for India)
metadata:
  type: feedback
---

j (2026-11-04): »Stebri v inštruktorju so bili mišljeni samo za staro Grčijo, drugim temam izberi nekaj primernega iz njihovega obdobja.« Then, when shown decorative border frames: »Mislil sem v stilu Tadž Mahala za Indijo itd.« So he wants a recognisable BUILDING per era, not an ornamental border.

**Why:** columns are Greek; other eras should feel like their own place.

**How to apply:** only `antik` uses `chat.frame: "stebri"` / `arch`. Every other history style (incl. new weekly themes from the cosmetics thread, e.g. Egipt) gets `frame: "stavba"` + `building: {pediment, entablature|null, column: [cap, shaft, base], stylobate}` in public/theme.js ERAS — same parts and same ui.css layout as the temple (`:is([data-chat-frame="stebri"], [data-chat-frame="stavba"])`). Indija = Taj Mahal, Renesansa = Florence-style dome + rustic quoins, Hiša modrosti = iwan + ribbed dome + crenellated round towers. No religious symbols. test/teme.test.js enforces it. PR #294 merged 4 Nov (Greek thread cmsg_011HYzNBAS5HRU1H7PcSE7JtTWtAipVZqiDM19t8R91zX5). Related: [[evklid-ui-design]].
