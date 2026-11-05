---
name: evklid-npz-matura
description: NPZ/matura section (j 30 Oct–4 Nov 2026): what is merged, RIC copyright rule, our own papers format and pipeline, j's decisions, what remains for after the 11 Nov reset
metadata:
  type: project
---

Thread »Dodaj razdelek za NPZ in maturo« cmsg_011HYzNBAS5HRU1H7PcSE7Jt9uNKFNTcvAUCjC3sfE7EH6 (handover /mnt/project-files/predaja/dodaj-razdelek-za-npz-in-maturo.md). Papers thread (4 Nov) »Napiši naše vadbene pole za NPZ in maturo«.

Merged code: #213 view #view-exams, readiness, POKLICNA, past-paper browser (links to ric.si only); #263 »Rešuj z inštruktorjem«; #272 open downloaded RIC PDF; #291 hidden `<kontekst_pole>`, OUR PAPERS content/exam-papers/<RIC id>.json, validator server/our-papers.js + `node scripts/check-paper.js [--pola N]`, UI public/our-paper.js; #348 maxPoints, choice-letter rule, SVG id scoping.

OUR PAPERS in app (4 Nov): NPZ6 MAT 2023–2026; NPZ9 MAT 2022–2026; NPZ9 FIZ 2019/2023/2024, KEM 2018/2022/2026, BIO 2020/2021/2025; MATURA MAT OR 2023–2026, VR 2024–2026; MATURA FIZ/KEM/BIO 2025; POKLICNA MAT 2024–2026 (PRs #348 #367 #370 #377 #380 #385 #389 #393 #396 #401 #420). Format: polas, task pola, sections A/B, numbering per (pola,section), part key "2-B3a", maxPoints when student chooses tasks. Paper page has no answer field (only »Pokaži rešitev« + self-check), so drawing parts say »nariši v zvezek«.
Structures of RIC originals (own words) in content/exam-papers/structures/*.json; NOT yet extracted: matura FIZ/KEM/BIO 2022–2024 (URL lists in briefs/urls-D.txt, urls-E.txt).
j card 11:23 4 Nov »Še 2–3 leta za vsak izpit« (~27 papers). 4 Nov done: 18 of the ~27 (thread cost 222,4 $). Remaining after 11 Nov reset (9): matura FIZ/KEM/BIO 2022–24 (structures first). Optimizer paces (≤2 heavy agents, merge per pair, report cost_usd).
Pipeline per paper: Opus writer (matura: one per pola, merged by script) → Opus reviewer effort high (numbers, facts, figures rendered light/dark with Playwright) → Opus reader (student's eyes, ti-form, no later answer given away). Briefs, merge.cjs and RIC URL lists urls-D/E: /mnt/project-files/evklid/npz-matura/briefs/ (paths inside point to an old scratchpad; adjust). Cost ≈ 15–20 $ per paper incl. reviews.

RIC copyright: never copy, proxy or store RIC papers; only structure (j 30 Oct). Draft request to RIC /mnt/project-files/evklid/npz-matura/prosnja-ric.md (not sent).
No separate Expo NPZ section (j: app shows the real website).

Related: [[evklid-gradiva]] [[evklid-competitions]] [[evklid-decisions]]
