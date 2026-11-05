---
name: evklid-stage-home
description: PR 3 of stage split (start page + tutor per stage) and payment leftovers, PR #350 MERGED 4 Nov 2026
metadata:
  type: project
---

Thread »Dokončaj plačila in začetno stran« (cmsg_011HYzNBAS5HRU1H7PcSE7JtFYZvfHowHiR5JxFL8zayzd), from handover /mnt/project-files/predaja/placila-2.md. PR #350 (branch claude/project-thread-4w7wgb).

- Start page per stage in public/zacetna.js (VRSTNI_RED): OŠ xp → games row → schedule; SŠ schedule first only with a test ≤14 days, matura row (SI only); faks »Moj študij« + exam dates from Urnik. Faks study year from 1 Oct (server/level-up.js).
- Tutor: faks paid default Haiku think, first »Razloži podrobneje« Sonnet (env EVKLID_UNI_MID=0 off); prompt lines for OŠ encouragement and faks longer explanations. Prompt + screenshots (/mnt/project-files/evklid/zacetna-stran/) need j's OK before merge.
- Payment leftovers fixed in same PR: picker i18n, block.* codes, mid-month upgrade prorates AI share, guarantee days in Ljubljana time, Podari fund ≥0, privacy row, school AI only seated students.
- MERGED 4 Nov 11:45 (squash fbe7666) after j »Ok« 11:19. j card 11:19: INR/BDT/IDR 2-child yearly raised to 5699 / 7999 / 1149000 (all regional plans have tiny AI share by the 75 % rule). Leftovers: /mnt/project-files/predaja/placila-3.md. Guarantee record: auto-deleted 10 years after decision (j card 11:52), PR #365 merged.

**Why:** j approved per-stage home/tutor 1 Nov; review before merge. **How to apply:** build leftovers from placila-3.md; see [[evklid-pricing-levels]], [[evklid-guarantee-podari]].
