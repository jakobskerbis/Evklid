# Brief add-on: write ONE izpitna pola of a matura paper

Read and follow /tmp/claude-0/-home-user-Evklid/c92b5c82-a2fd-5a5c-a1b4-eeb69e57bb18/scratchpad/writer-brief.md exactly, with one difference: you write only the IZPITNA POLA named in your prompt (call it N).

- Structure: /home/user/Evklid/content/exam-papers/structures/<id>.json — write exactly the structure's tasks with "pola": N (same sections, n, points per part, formats). Respect that pola's calculator rule.
- Output a complete paper object to /tmp/claude-0/-home-user-Evklid/c92b5c82-a2fd-5a5c-a1b4-eeb69e57bb18/scratchpad/parts/<id>-pN.json (not into the repo): id, exam "MATURA", subject, minutes, points = sum of your parts, author "AI", tools, polas = BOTH polas from the structure with minutes and a Slovenian ti-form tools sentence, sections (when the structure has them) with short Slovenian titles, tasks = only pola N. If the structure has maxListed, also set maxPoints = structure points.
- Another writer writes the other pola at the same time: choose contexts unlikely to repeat (say in your report which topics/contexts you used), and do not repeat the ideas of the newer papers of the same subject already in /home/user/Evklid/content/exam-papers/ (skim their task texts only).
- Validate with `cd /home/user/Evklid && node scripts/check-paper.js /tmp/claude-0/-home-user-Evklid/c92b5c82-a2fd-5a5c-a1b4-eeb69e57bb18/scratchpad/parts/<id>-pN.json --pola N` until ✓.
