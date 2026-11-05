---
name: evklid-school-build
description: What the schools thread built (30 Oct 2026): school/licence tables + API, pilot metrics, prices PR #191, /sole page, contract doc; open j decisions
metadata:
  type: project
---

Schools thread cmsg_011HYzNBAS5HRU1H7PcSE7JtDjri6iP8TcwTf5J3DbtE91 (owns schools, access rules, offers, prices since 30 Oct 09:41). Design: [[evklid-school-paid-tier]].

- PR #178 merged: server/schools.js (schools, school_teachers, school_licences, class_assignments; classes.school_id/grade/subject/path/offers_off). Exports schoolAccess/schoolStudents/schoolMembership used by server/placila/sola-vir.js. Teacher page public/ucitelj.html. Admin adds licences: POST /api/admin/schools/:id/licences.
- PR #185 merged: server/pilot.js (page_visits counter for /starsi.html, /placaj.html, /sole; GET /api/admin/pilot; admin card »Merjenje v pilotu«).
- PR #191 MERGED 30 Oct ~12:10 UTC (j approved by card): Osebno ob šolski licenci 5,99 €/m or 49 €/yr (EUR only), gift code 49 € (server/placila/darila.js, consents kind 'gift'), two-step Naročnina picker (»Za koliko otrok?« first; j asked 30 Oct 10:03). j rule: never merge a prices PR without his card.
- /sole page: PR #212 MERGED 30 Oct 12:05 UTC (j card). Inline scripts are blocked by CSP on main (helmet, PR #209 era): page JS lives in public/sole.js.
- E-invoice: we do NOT generate e-SLOG; invoice via accounting software/provider to UJP. Seller data from env EVKLID_SELLER_NAME/_ADDRESS/_TAX_ID/_IBAN (unset → »[izpolni]«).
- Contract draft + 18 lawyer questions: https://claude.ai/artifact/HLjzSwh5uju5pR9JpEC7bM.
- j has NO s.p. (j 30 Oct 11:22): no invoices to schools and no live Stripe until someone opens an s.p./company; school pilot free, /sole collects inquiries only; seller env stays unset.
- School licence ends → Osebno school-price sub is NOT renewed (j 30 Oct 13:58, PR #219 merged): cancel_at_period_end + notice; restored if licence returns and Evklid had stopped it.
- Open for j: who will invoice (s.p./company); parent of under-15 can't buy pre-test pack in Account tab.
- Pricing proposal with all costs (1 Nov): /mnt/project-files/evklid/placljivi-paket/cenik-s-stroski.md (AI estimates ~1.1 €/student/mo; proposes 4 € AI soft cap per paid child, school cap 0.5 €/student/mo, gift 59 € or cap, +1 € in-app, +1/10 € when VAT payer). Waits for j's pick; build after 4 Nov reset.
- 1 Nov 13:15 my cost-proposal cards partly duplicated the APPROVED level pricing ([[evklid-pricing-levels]], owner thread cmsg_011HYzNBAS5HRU1H7PcSE7JtTr3mJ55Uszuud63V1gyLiu): gift + app-store cards withdrawn; AI cap "Da" = use approved per-stage allowances (2/3/5 $). Still open cards: school AI cap 0.5 €/student/mo, emphasise yearly plans, pilot 12 € only first 10 schools.
- j 1 Nov 13:37 »Skopiraj kar je dobro« (Astra): this thread builds refund guarantee (card on conditions first, ToS text, after 4 Nov reset); oral exam, audio summaries, focus mode routed via coordinator to their threads.
