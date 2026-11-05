---
name: evklid-payments-design
description: Evklid payment system (2026-10-30): BUILT in Stripe test mode, PR #167 merged; passes before tests, promo codes in DB, parent pay link; MoR still open
metadata:
  type: project
  modified: 2026-10-30T06:30:28.975Z
---

Design doc (Slovenian Claude Doc): https://claude.ai/artifact/AgDdgmn2fPnEKYi7MWfb3n. Thread cmsg_011HYzNBAS5HRU1H7PcSE7Jt2TtggWS5GDxwehfAwrV1Lv. Extends [[evklid-accounts-billing]], [[evklid-release]].

**Built and merged 2026-10-30, PR #167** (j picked »Zgradi vse v testnem načinu«). Stripe test mode only; no real money until j has an s.p.
- Code: server/accounts/billing.js (passes, pay links, consents, webhook dedupe table billing_events, billingDaily), plans.js (PASSES, paidActive with 7-day past_due grace), promo.js (promo_codes table + admin routes). Front end: public/pass-offer.js (card in Urnik), pay-ui.js, placaj.html/js (parent page), account.js (admin codes, minor → pay link). Tests test/placila.test.js.
- Passes: 7/14/30 days, 5.19/7.79/11.69 € (j: 30 % above first proposal), AI caps 0.75/1.5/3 $. Offered ONLY when the student has no active subscription (j 05:21) and has a test in the next 30 days that trial/promo doesn't cover. Any refund (incl. partial) or dispute ends the pass.
- Minors (holder <18) can't check out; pay link valid 7 days, max 5 open. Two consents are required before every payment and are stored with their language.
- EVKLID_PROMO_CODE=off (or a changed code) deactivates the old env code; admin disable persists.
- Apple coexistence: the iOS thread adds the parents.sub_provider column; billing only reads it.

**Not built (open):** Merchant of Record (Stripe Managed Payments first, else Paddle) + OSS VAT, needed once there is an s.p. Known small gaps: ur/hi pay.withdrawal has gendered verbs; after a pass's AI cap is used up, the student has no free AI for the rest of the month.

**Microtransactions plan (4 Nov 2026, thread cmsg_011HYzNBAS5HRU1H7PcSE7JtRcmDNRojJFkZ92gyEJ6MyX):** /mnt/project-files/evklid/placljivi-paket/mikrotransakcije-nacrt.md. Proposed keep: top-up 5/10/20, passes 7+14 days, gift code, Podari mesec, upgrade; drop: custom top-up amount, 30-day pass, Podari 2/5/10 € checkout add-on. j CHOSE the proposal 4 Nov 20:47 (card); code after 11 Nov reset.
