---
name: evklid-curriculum-coverage
description: 30 Oct 2026 report comparing Evklid lessons/topics with official Slovenian učni načrti; gaps and priority list; where official UN PDFs can be fetched
metadata:
  type: project
  modified: 2026-10-30T20:08:06.631Z
---

j's goal (30 Oct 2026): every subject and programme Evklid offers covers its curriculum completely.

Report (Claude Doc): https://claude.ai/artifact/UYzUiaaDvzutVLYkFtkbBB (thread cmsg_011HYzNBAS5HRU1H7PcSE7JtHyxqJLZ9pjxUisrjx246WY).
State then: school lessons 202/382 topics, faks 1st year 156/2298; all lessons still `stanje: osnutek` (none teacher-reviewed).

Topics missing from server/curriculum-data.js vs UN (not just unwritten lessons):
- OŠ MAT: Logika in jezik (množice, Venn/Carroll), lega točk/premic/ravnin v prostoru (9.). FIZ OŠ: sklop »Fizika in okolje« (9.).
- Gimnazija (verified 30 Oct against RIC matura catalogues): MAT logika, splošno o funkcijah, potenčna/korenska f., koordinatna geometrija; FIZ navor/ravnovesje, izmenični tok/transformator, EM valovanje, kinetična teorija; KEM anorganska kemija po skupinah PSE.

Sources: OŠ UN PDFs download fine from gov.si `.../MVI/Dokumenti/Osnovna-sola/Ucni-nacrti/obvezni/UN_<predmet>.pdf` (matematika, fizika, kemija; naravoslovje text is garbled by pdftotext; biologija name differs). Gimnazija UN PDFs unreachable (eportal returns HTML, portal.mss bad TLS); use RIC matura catalogues instead: links on https://www.ric.si/splosna-matura/predmeti/<matematika|fizika|kemija>/ (M-MAT-2026, M-FIZ-2028, M-KEM-2023), curl works.
j chose (30 Oct) option B: queue reordered by the report (textbook thread confirmed) + this thread adds the 20 missing topics with generators and sims (branch claude/project-thread-qobnx8); DONE: PR #242 merged 30 Oct (20 topics, vrz-* generators, sims incl. »domine« for induction; school topics now 402); ids sent to textbook thread for lessons after FIZ/KEM OŠ.

Related: [[evklid-textbook]] [[evklid-university]] [[evklid-quality-bar]]
