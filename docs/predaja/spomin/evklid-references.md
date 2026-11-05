---
name: evklid-references
description: STEMMind "Referenčni material" for university courses (PR #49 merged 2026-10-28): data files, rules, link checker, host quirks <!-- brand:legacy -->
metadata:
  type: project
  modified: 2026-10-28T16:44:30.061Z
---

j asked (2026-10-28 15:47) for agents to research online libraries and a "Referenčni material" section in the university version. Built in thread "Add reference material for university", branch claude/project-thread-w4gtck, PR #49 (merged into main 2026-10-28 ~16:55).

- UI: Učbenik → Moj študij → toggle Lekcije / Referenčni material (public/textbook.js renderRefs; filters letnik, vrsta, "Samo v slovenščini"). i18n keys `refs.*` in sl.js + 32 json.
- Data: content/references/{matematika-racunalnistvo,fizika-inzenirstvo,kemija,biologija-geo-ekonomija}.json = themes (prefix mat-/rac-/fiz-/kem-/bio-/geo-/eko-, 3–8 items) + courses (UNI-… key → theme ids) + courseItems (faculty material for that course). server/references.js, API /api/references?program=|course=. Test test/references.test.js requires every programme course ≥3 sources and a licence matching the regex.
- Numbers: 212 themes, 1448 items, 1123 URLs, 536 Slovenian, all 1215 courses covered. Researched by 4 Sonnet agents (~380k tokens each, ~35–45 min).
- Link check: `node scripts/preveri-reference.js --cacert <bundle>`; fmf.uni-lj.si lacks its intermediate cert (add HARICA GEANT TLS R1 from crt.harica.gr to the CA bundle; never -k). Wikipedia gives 429 under parallel load (script retries).
- Soft-404 hosts (200 for any path): openstax.org, press.um.si, ebooks.uni-lj.si, dlib.si, youtube, khanacademy → verify titles (OpenStax CMS API /apps/cms/api/v2/pages/?type=books.Book, Wayback availability API for Khan). Blocked/unusable: pefprints.pef.uni-lj.si, open.umn.edu, bccampus (403), Khan (bot challenge), NCBI (reCAPTCHA).

**Why:** university students want curated legal study material per course. **How to apply:** new courses in university-data need a `courses` mapping or the test fails; re-run the link checker before launch.
