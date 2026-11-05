---
name: evklid-weak-points
description: Šibke točke from every task surface (j 4 Nov 2026): one list in server/weaknesses.js keyed by path topic id; PR #437; sources, rules, what is not a source
metadata:
  type: project
  modified: 2026-11-04T20:02:47.336Z
---

j 4 Nov 19:30: »Naj za šibke točke Evklid zbira info od povsod, kjer uporabnik rešuje naloge.« Thread cmsg_011HYzNBAS5HRU1H7PcSE7JtESDzVfw7rSbUCvgmd9AmbE, PR #437 (triple reviewed).

- One list `server/weaknesses.js` (doc docs/sibke-tocke.md) for tutor prompt, Napredek, weak worksheet, games »Ponovi šibke teme«, weekly parent email.
- Sources: chat META + Vadnica (events + topic_id), games, textbook »Preveri se« (web + mobile), our NPZ/matura papers, flashcards, class kviz (skill_results daily counts). No AI calls.
- Not sources yet: lab, calculator, scanner, daily puzzle, 3D atlas quiz (no path topic). Possible later: scanner as a »needed help« signal; per-skill mastery builds on skill_results.
- Free names → topic via local `topicForName` (lekcija-za-vprasanje.js); papers map ~40 % of parts.

**Why:** j wants weak points to reflect all work, not only chat. **How to apply:** any new task surface should call `recordSkill` with a path topic id.
