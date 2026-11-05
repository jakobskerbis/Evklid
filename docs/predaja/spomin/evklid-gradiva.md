---
name: evklid-gradiva
description: New learning material types (j's brief point 7, 30 Oct 2026): what is built, RIC copyright decision, open parts, thread id
metadata:
  type: project
  modified: 2026-10-30T09:11:09.197Z
---

Thread »Add new learning material types« cmsg_011HYzNBAS5HRU1H7PcSE7JtQggKMZ4A1XQh3NZ4m8jwUh (from j's brief /mnt/project-files/evklid/placljivi-paket/prompt-za-koordinatorja.md, point 7). Overview in docs/gradiva.md.

- PR #177 (30 Oct): one-page summary + mind map (/gradiva/povzetek/<POT>/<tema>, free), audio summary (browser speechSynthesis, sl voice; server/govor.js reads LaTeX in Slovenian), printable worksheets with solutions from generators (paid, »koda lista« = seed), weak-topic worksheet on Napredek. Access in one function canUse in server/gradiva.js → swap to server/placila/pravice.js when the school-licence thread builds it.
- RIC copyright: every NPZ/matura paper says »© Državni izpitni center, vse pravice pridržane« → never copy past papers; link to ric.si (exams.js officialPapers), mock exam stays our own tasks. Asking RIC for permission would be j's call.
- PR #186 merged 30 Oct (formats poskus/projekt/video in server/gradiva-vsebina.js, player public/gradiva.js, docs/gradiva.md, scripts/check-gradivo.js). No content yet.
- PR #198 MERGED 30 Oct ~10:50 UTC: live class quiz (server/kviz.js in-memory, public/kviz.js; students join in Lige) + teacher worksheets (/api/teacher/classes/:code/delovni-list). Optimizer OK'd feature work until reset under the 3-thread cap.
- Content only by Opus/Fable with triple review. Optimizer pace (30 Oct 09:12): no content batches before weekly reset Wed 4 Nov; authored mind maps ride along in lesson batches (format + ≤150-token instruction in scripts/lesson-brief.js, check in check-lesson.js, coordinate with textbook thread which owns the brief); experiments/projects/video scripts = small separate batches in this thread after reset, at a pace the optimizer will send.

Related: [[evklid-token-rules]] [[evklid-textbook]] [[evklid-school-paid-tier]]

- 30 Oct: all point-7 code done. Mind maps ride in lesson batches (textbook PR #204: keyword branches, no colon; display fix PR #206); check is scripts/check-gradivo.js. Remaining: content batches after 4 Nov reset at optimizer's pace.
- 4 Nov 06:25: thread handed over (285k context). Handover /mnt/project-files/predaja/gradiva.md. First content batch cap 30 $ (optimizer 06:17): 6 experiments, 4 projects, 4 video scripts.
- 4 Nov ~06:45 UTC: FIRST CONTENT BATCH MERGED PR #304 (thread cmsg_011HYzNBAS5HRU1H7PcSE7JtLiQtzcbSesb5tT8hXRJMM8): poskus FIZ-OS-8 gostota/lom-svetlobe, FIZ-OS-9 prosti-pad/prenos-toplote, KEM-OS-9 raztopine, NAR-OS-7 zgradba-snovi; projekt FIZ-OS-9 elektricno-delo-in-moc, FIZ-OS-8 enakomerno-gibanje, KEM-SS-1 raztopine, NAR-OS-6 naravoslovni-postopki; video same 4 topics as lom/prosti-pad/raztopine/zgradba-snovi. Cost ~5,6 $ + 3 agents (thread writes itself, 2 Opus reviewers + 1 reader). Video check: Playwright context needs serviceWorkers:"block" for page.route; select option text with »=« breaks actions (split at last =) → use option value. Next batch only at optimizer's pace.
- 4 Nov 09:45: j 09:34 »finish everything regardless of limit« → remaining content (~216 videos pilot MAT-SS first, ~60 projects, ~45 experiments) handed to a new thread; handover /mnt/project-files/predaja/napisi-prvi-paket-gradiv.md, tools /mnt/project-files/evklid/gradiva-orodja/.
- 4 Nov 11:49: PR #354 merged (thread cmsg_011HYzNBAS5HRU1H7PcSE7JtWVC2XeqQ5Z5zkaFVMBEPyr): 22 videos MAT-SS-3/4, 6 projects MAT-SS-3/4, ~25 sim/player fixes. Agent brief /mnt/project-files/evklid/gradiva-orodja/brief.md; open sim bugs list sim-napake.md there. Handover /mnt/project-files/predaja/napisi-vsa-gradiva.md. Budget this week ≤ 200 $ (optimizer 2 cmsg_011HYzNBAS5HRU1H7PcSE7Jt8EQahEA2WPJwMnPr2UBLVB); decisions for j → cards in cmsg_011HYzNBAS5HRU1H7PcSE7Jt6zBtvecoWzGJyRTNXXvC1w.
- 4 Nov 17:05 (thread cmsg_011HYzNBAS5HRU1H7PcSE7JtXnaqDyfDLiMJPJC1bAEgJS, 37,75 $): PRs #394, #416, #426 merged (18 videos MAT-SS-2/MAT-SS-1 + sim fixes); no open branch. Next: remaining 6 MAT-SS-1 topics, then MAT-OS-9 (list in handover /mnt/project-files/predaja/napisi-vsa-gradiva.md). j rule 4 Nov: small fixes = pass 1 + one reviewer.
