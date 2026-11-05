---
name: evklid-regions
description: STEMMind versions for Asia/Africa (PR #45), local prices (#46), exam prep (#50, #51) and 61 national exams with Hindi tasks, NPZ/matura (#125) <!-- brand:legacy -->
metadata:
  type: project
  modified: 2026-10-28T16:07:54.199Z
---

PR #45 (merged 2026-10-28): regional versions.
- Setting `school_system` (public/regions.js: SI default, IN-CBSE, IN-ICSE, PK, BD, NP, LK, NG, GH, KE, TZ, UG, RW, ET, ZA, ZM, ZW, EG, FR-AF, PH, ID, VN, MY, INTL). Default from device country; everyone else stays SI.
- India paths follow NCERT (keys MAT/FIZ/KEM-IN-6..12); others use English INT paths (MAT-INT-n) from server/region-curricula.js. Regional topics have `base` ids and reuse Slovenian generators/lessons/sims. Task text and lessons are still Slovenian (known limit).
- Lite mode `data_mode` auto/lite/normal; brotli/gzip in server/compress.js; service worker public/sw.js; offline pack + server re-check sync (public/offline.js, offline_results table).
- Local prices confirmed by j 2026-10-28 (PR #46): ~4–5 €/month for one child, e.g. INR 399, NGN 7500, KES 649, USD 4.99 for other low-income countries (server/accounts/plans.js). Stripe lacks recurring M-Pesa/UPI; Paystack/Flutterwave/Razorpay later.
- PR #50 (merged 2026-10-28): exam prep. Outside SI the Competitions tab is "Exams" (examMode = regional system). Exams in server/exam-data.js (SAT, GAOKAO, JEEM, JEEA, NEET, CBSE10, CBSE12); paths `<SUBJ>-EX-<EXAM>` (school EX), English generators in hidden bank paths MAT/FIZ/KEM-EXB (server/practice/generators/exam-*.js). Mock exam reuses contest sessions (server/exams.js mockPlan, scaledScore; choice conversion server/practice/choice.js; JEE/NEET −1; SAT 200–800). New systems US and CN. Tests in test/exams.test.js.
- Known limits: NEET no biology, JEE chem no organic/inorganic, some topics reuse Slovenian base generators (Slovenian text), US/CN pay EUR.
- PR #51 (merged 2026-10-28): systems GB, DE, AT, CH(+LI), FR(+MC), BR; exams GCSE, ALEVEL (GB, PK, INTL), ABITUR, MATURAAT (maths only), MATURACH, BAC (FR, FR-AF), ENEM (5 options), WASSCE (NG, GH), JAMB (NG), KCSE, NSC. Mock `grades` (approximate by %) and `scale: [min, max, step]`. Countries without own exams (BD, NP, LK, EG, PH, ID, VN, MY, east Africa) fall back to SAT.
- PR #52 (merged): keypad (public/pad.js) translated; checker/practice feedback returns `code` + `params` (chk.*) and the client shows t(code) for non-Slovenian UI. New server feedback strings need a chk.* code + i18n keys.

- PR #125 (merged 2026-10-29): 61 exams in 34 countries. Exams are data in server/exam-data-{si,southasia,asia,africa,west}.js + exam-data.js (India, bank, older exams); helpers server/exam-helpers.js; `// Vir:` sources and `// Vrzeli:` gaps per exam. BIO subject added (BIO-EXB). India tasks bilingual en/hi (exam-in-*.js, exam-*.js; generator `langs:["en","hi"]`, gen(level,r,topic,lang), `bi(lang)`); Hindi names in server/exam-hi.js; taskLanguage(ui code). Gap topics in exam-gap-*.js. NPZ6/NPZ9/MATURA use Slovenian paths, shown via "NPZ in matura" switch in Tekmovanja (state.siExams). New systems KR, JP, IN-STATE. Coverage list for j: /mnt/project-files/evklid/drzavni-izpiti.md. Next: tasks in local languages (zh, vi, id, ar, ko, ja, ur, bn), STPM, Nepal IOE, Philippines, SQA Higher, poklicna matura. Old limit "NEET no biology / JEE no organic" is fixed.

Related: [[evklid-i18n]]
