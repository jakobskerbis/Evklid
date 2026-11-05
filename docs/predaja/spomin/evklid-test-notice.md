---
name: evklid-test-notice
description: Evklid "Testna verzija" banner (PR #214, merged 2026-10-30): what it lists, how lines switch off, how to hide it at launch
metadata:
  type: project
  modified: 2026-10-30T12:45:08.398Z
---

j asked 2026-10-30 for a notice that Evklid and the tutor are a test version, listing what doesn't work. PR #214 merged 2026-10-30.

- Banner under the header (public/testna-verzija.js, #test-notice); list comes from /api/config `test_notice` (server/app.js testNotice()).
- Lines: tutorOff (AI credit ran out in last 24 h, flag `ai_credit_out_at` in kv, cleared on first successful call) else tutor; pay until STRIPE_SECRET_KEY is *_live_*; email until RESEND_API_KEY; apps (always, remove when store apps ship); report-bug button.
- Dismissal stored per device by list signature; reappears when the list changes.
- At public launch set EVKLID_TESTNA_VERZIJA=off on Render to hide it.
- Known pre-existing smoke failure on main (not from this PR): preveri-aplikacijo step `racun odjava-prijava` (403 /api/account, owner lock).

Related: [[evklid-release]], [[evklid-render]].
