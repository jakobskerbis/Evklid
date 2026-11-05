---
name: evklid-competitions
description: Tekmovanja tab (competition section) in STEMMind: what exists, where the code is, rules, merged in PR #23 on 2026-10-28 <!-- brand:legacy -->
metadata:
  type: project
---

Razdelek **Tekmovanja** (j's ask: section for competitors with only harder competition tasks) merged to main in PR #23 on 2026-10-28.

- Paths MAT/FIZ/KEM-TEK-OS/SS (topics in curriculum-data.js; titles fixed with the textbook thread, which writes lessons in content/lessons/<KEY>/). Hidden for UNIVERZA. Not shown in normal Učna pot path list.
- All tasks are code-generated (tek-mat-os.js, tek-mat-ss.js, tek-fiz.js, tek-kem.js; helpers tek-util.js), no API spend. Styled after competitions, not copies of past tasks.
- Tekmovalni trening: 10 interleaved tasks with hints. Poskusno tekmovanje: 10 tasks, 45 min, one attempt, no hints, 3/4/5 points (max 40), skip/finish, result + review, history of last 5; points → XP. Data in sessions.params (no schema change).
- Level names here: težja / zahtevna / izziv. Tutor chat on TEK topics uses track COMPETITION prompt (model unchanged).
- Screenshots: /mnt/project-files/evklid/posnetki-tekmovanja/.

**How to apply:** new competition topics need a generator in tek-*.js; run `node scripts/preveri-generatorje.js tek-` and npm test. Related: [[evklid-project]], [[evklid-textbook]].
