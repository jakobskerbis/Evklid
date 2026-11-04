# Šibke točke (weak points) from every task surface

j 2026-11-04: »Naj za šibke točke Evklid zbira info od povsod, kjer uporabnik rešuje naloge.« English on purpose (agents read it).

**One list, one key.** `server/weaknesses.js` builds the weak-topic list for every consumer: tutor prompt
(`weaknessesForPrompt`), Napredek page (`GET /api/students/:id/progress`), worksheet from weak topics
(`server/gradiva.js weakTopicIds`), games »Ponovi šibke teme« (`server/games.js weakFor`) and the weekly
parent email (`server/accounts/weekly.js`). The key is the learning-path topic id (`MAT-OS-8/linearne-enacbe`).
A free name (chat META, flashcard) is mapped locally with `topicForName` (`server/lekcija-za-vprasanje.js`,
same word index as the textbook lesson search, clear matches only); unmapped names stay under their own name.

| Source | Where it is written | Stored in |
|---|---|---|
| Tutor chat (META error=0/1) | `server/app.js` (topic = conversation path topic, else mapped META topic) | `events` (+ `topic_id`) |
| Vadnica, daily, unit, contest, test prep, offline sync | `server/progress.js answer()` | `events` (+ `topic_id`) |
| Games | `server/games.js` result; concept → topic via `public/games/lessons.js` (`topicForGame`), max `GAME_MAX` answers per game | `skill_results` |
| Textbook »Preveri se« | `POST /api/students/:id/lesson-check` (web `public/textbook.js`, app `mobile/src/app/topic/[id].tsx`); server checks the answer; once per question per day | `skill_results` |
| Our NPZ/matura papers | `POST /api/students/:id/paper-check` on close (`public/our-paper.js`): parts with the solution opened or »Imam prav« toggled; ok = ticked; an unticked part is wrong only if the student ticked at least one part in that sitting (only reading solutions counts nothing); once per part; max `PAPER_MAX` (3) parts per topic per sitting; part → topic by local search over task text and solution titles (`paperTopics`) | `skill_results` |
| Flashcards | `server/app.js` review route: first grade of a card per day; »še ne znam« is wrong only for a card already known (box ≥ 1), not a new card still being learnt | `skill_results` |
| Class live quiz | `server/kviz.js` answer route | `skill_results` |

Not sources (no right/wrong answer by the student): lab, calculator, scanner (solves for the student), daily
puzzle (logic puzzles, no curriculum topic), 3D atlas quiz (no path topic for its concepts yet).

Rule (`isWeak`): at least `MIN_TURNS` (3) answers in `DAYS` (60) days across all sources, error rate ≥ `MIN_RATE` (40 %), and errors on at least 2 days or at least `MIN_ERRORS_ONE_DAY` (3) errors (one lesson read with 2 wrong checks is not yet weak).
Privacy: `skill_results` keeps only daily counts per topic, `skill_seen` only what was counted and the day (no answers,
no times of day), 365 days, both in the data export (`weak_points`, `weak_points_seen`), deleted with the profile. No AI calls (free-tier cost cap).
