---
name: evklid-university
description: Evklid university track (all Slovenian natural-science + tech/medicine faculties, 71 programmes): data files, source rules, PR history, lesson batch tooling
metadata:
  type: project
  modified: 2026-11-04T08:02:46.119Z
---

j (2026-10-27/28): university tutors per study programme for ALL Slovenian natural-science faculties and ALL academic courses. Thread "Add university study-program tutors": since 4 Nov 08:21 cmsg_011HYzNBAS5HRU1H7PcSE7JtHA4fzZiaYBVmPh8JHBoryE (old cmsg_011HYzNBAS5HRU1H7PcSE7JtTTzpXKqhPt5Lc56qTZzbDB).

**PRs:** #16 base, #19 picker (public/level-picker.js), #20/#33/#37 → 44 programmes from official curricula (1077 courses). #210 (30 Oct, j »Tehnika in medicina«): +27 programmes = 71; EMŠ programmes `degree:"EMŠ"`, only pre-clinical years (≤4). #221: courses expanded to official učni načrti via server/university-razsiritve.js (COURSE_EXTENSIONS, add-only, after/before); done UL FKKT Kemija 1st year (+78 topics). #88: Nastavitve Predmet select lists programme courses (settings.study_course). #314 (4 Nov): faks batch 24 new + 6 raises + 6 variety, 40.7 $.
- Data: server/university-data.js + university-extra.js (scripts/uvozi-fakultete.py; never read whole).
- Sources: docs/predmetniki-naravoslovne-fakultete.md. curl/pdftotext works for uni-lj.si, um.si, upr.si, ung.si; WebFetch fails. RULE: never add curricula from model memory.
- Generator coverage test: original 44 programmes >28 %, later >14 %. Generators server/practice/generators/uni.js; TODO uni generators per docs/kakovost.md §2.
- Lessons: Opus/Fable only. Same title+subject = one shared lesson. `node scripts/fakultetne-lekcije.js --letnik 1 [--program UL-FKKT] --n N` lists missing ones. Batch tooling in /mnt/project-files/evklid/faks-orodja/ (copy to your scratchpad, set S): pripravi.sh <out> <n> <k> <v> [program] + Workflow lekcije.js (writer → reviewer effort high → student reader, 3 per reader; raises/variety + diff review). Full batch ≈ 40 agents, 3.8M subagent tokens, ≈ 41 $. Next args file lekcije-11. 24 old lessons to raise, 6 variety reworks left (varied.txt / vary-todo.txt).
- Progress dashboard: [[evklid-faks-progress-dashboard]]. Exam-based structure and pace this week: [[evklid-faks-structure]].

**How to apply:** university content is a draft (stanje: osnutek) for a human check before launch; screenshots in /mnt/project-files/evklid/posnetki-univerza/.
