---
name: evklid-guest-mode
description: Kompreno guest mode (use without registration), env EVKLID_GUEST, dev-only, must be off before public launch — j 2026-10-29 <!-- brand:legacy -->
metadata:
  type: project
  modified: 2026-10-29T18:24:56.517Z
---

j asked 2026-10-29 18:15 (cosmetics thread): "Dodaj tudi moznost uporabe brez registracije ali prijave" + "Za zdaj" + "Ce bo kdaj public odstrani to moznost". Newest ask wins over the earlier mandatory-registration ask.

- Built in thread cmsg_011HYzNBAS5HRU1H7PcSE7JtErU9VmRtJDDy6b3cjkGr1B (branch claude/project-thread-akmgll). Code: server/accounts/guest.js, guest endpoints in server/accounts/index.js, UI in public/account.js (keys guest.* in i18n).
- Guest = parents row with is_guest=1, fake email gost-…@gost.invalid, 365-day session cookie; free tier, no trial, no e-mail, 1 profile.
- Anti-bypass: daily questions and monthly AI spend counted per network (sha256 of IP, IPv6 /64) across all guests incl. deleted ones (table guest_spent); max EVKLID_GUEST_PER_DAY (5) new guests per network per day. Siblings on one Wi-Fi share the guest allowance.
- Upgrade: POST /api/auth/upgrade keeps profile + progress, gives 7-day trial, needs e-mail verification. Login from a guest session moves the guest profile if the plan has room.
- Switch: EVKLID_GUEST=0 off, =1 on, unset = on unless NODE_ENV=production. render.yaml sets 0. **Before any public launch: EVKLID_GUEST=0** (docs/objava.md "Pred javno objavo").

Related: [[evklid-accounts-billing]]
