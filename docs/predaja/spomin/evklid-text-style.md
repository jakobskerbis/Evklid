---
name: evklid-text-style
description: j's rule (30 Oct 2026) that no app text may be clumsy; style rules docs/besedila.md (ti for students, vi for parents/teachers, no model/API jargon), thread "Polish all app text for clarity"
metadata:
  type: feedback
  modified: 2026-10-30T19:49:49.346Z
---

j 30 Oct 2026 19:47 UTC sent a screenshot of the extra-conversations purchase note (»Število pogovorov je ocena: odvisno od moči modela, ki odgovarja, jih lahko dobiš tudi več«, next to »dokupite«) and asked that such clumsy text never appear anywhere in Evklid. Thread cmsg_011HYzNBAS5HRU1H7PcSE7JtG6zJP5KoCb72WRRpqsgo5b.

**Why:** mixed ti/vi on one screen, exposed model internals, awkward word order.

**How to apply:** every new or changed UI string follows docs/besedila.md: students and the account owner in the app = ti; parents, teachers, schools, payers on their pages/e-mails = vi; never both on one screen; no model/API/token/server words for students (admin-only meter.*, admin.*, usage.*, pilot.* may); short, active, »…« quotes, decimal comma; legal/payment meaning never changes silently. test/besedila.test.js checks the mechanical rules. First sweep PR #239 merged 30 Oct ~21:00 UTC (~150 strings, 32 locales). Open: students still see »Koda: 401 neveljaven API ključ« on tutor errors (pinned by test/api-napaka.test.js); offered j to hide it.

Related: [[evklid-triple-review]] [[evklid-quality-bar]]
