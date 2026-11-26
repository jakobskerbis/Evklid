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
| Textbook »Preveri se« | `POST /api/students/:id/lesson-check` (web `public/textbook.js`, app `mobile/src/app/topic/[id].tsx`); body `{ q, o }` (choice), `{ q, v }` (»vpiši število«, typed text) or `{ q, order }` (»razvrsti«, item indices as placed); server checks the answer (`answerOk` in `server/weaknesses.js`); old app builds without `x-app-kviz` count `q` in their choice-only list; once per question per day | `skill_results` |
| Our NPZ/matura papers | `POST /api/students/:id/paper-check` on close (`public/our-paper.js`): parts with the solution opened or »Imam prav« toggled; ok = ticked; an unticked part is wrong only if the student ticked at least one part in that sitting (only reading solutions counts nothing); once per part; max `PAPER_MAX` (3) parts per topic per sitting; part → topic by local search over task text and solution titles (`paperTopics`) | `skill_results` |
| Flashcards | `server/app.js` review route: first grade of a card per day; »še ne znam« is wrong only for a card already known (box ≥ 1), not a new card still being learnt | `skill_results` |
| Class live quiz | `server/kviz.js` answer route | `skill_results` |
| Tools (P1-8, j 2026-11-25 three-priority plan): scanner, lab, 3D atlas quiz | `recordToolResult(db, studentId, { source, topicId, item, ok })` in `server/weaknesses.js`. Scanner (`scan`) calls it on the server, only for the student's own result with a status that checking confirmed (right or »Napačno«), never for »Nepreverjeno« or a solution the scanner wrote itself. Lab (`lab`: first »Sklep« pick, first numeric »Preveri moj račun«; predictions do not count, a wrong prediction before measuring is the point of predicting) and atlas quiz (`atlas`) post `POST /api/students/:id/tool-check` `{ source, topic, item, ok }`; the tool itself judges right/wrong (measured value, chosen part), as games do. `topic` must be a path topic id (atlas parts need a mapping to BIO topics first). `item` is a stable question id matching `TOOL_ITEM` (letters, digits, `_:./-`, never the student's input): once per question per day; at most `TOOL_DAY_MAX` answers per topic per tool per day (scanner 4, lab 2, atlas 2, so the atlas quiz or one lab session alone never makes a topic weak in one day) and at most `TOOL_STUDENT_DAY_MAX` (60) browser-posted results per student per day | `skill_results` |
| Oral questioning »Vprašaj me« (P1-4, j 2026-11-25 quality plan) | `server/ustno-api.js` on the first »konec« of a sitting calls `recordUstno` (`server/weaknesses.js`): per topic, the questions the sitting graded (by code, or by the grading model; only its »napačno« verdicts get a second review), ok = scored »dobro« (≥ 3/4 of key points). Never self-assessment (»samoocena« sittings or a question whose model answer was opened first), never »Ne vem«/»Preskoči« (both arrive as `preskoci`) or unanswered questions. At most `TOOL_DAY_MAX.ustno` (2) answers per topic per day, errors scaled proportionally like games, so one sitting alone never makes a topic weak; one sitting counts once (`skill_seen` `U|topic|sitting|day`). An appeal after »konec« does not change what was recorded | `skill_results` |

Wiring status: the API is ready; the scanner (session A2, P3-9), lab and atlas owners add the calls in their own files. Lab: wired (public/sim/lab.js `LAB_PREVERJENO` event on the first »Sklep« pick and the first numeric »Preveri moj račun« per experiment, never after »Pokaži rešitev« and not for a factor-10ⁿ slip; public/laboratorij.js posts it only for the profile that opened the experiment. Topic: `SIBKE_TEME` in lab.js lists, per main experiment, the topics its conclusions and calculation really test; the one on the student's own school level (rank ≤ 2 in server/laboratorij.js) is used, otherwise nothing is sent. Item: `ohm:racun`, `ohm:sklep:<hash of the question text>`. Only from the Laboratorij view, not labs embedded in lessons; test/laboratorij-sibke.test.js).

Not sources (no right/wrong answer by the student): calculator (computes, the student is not graded), scanner when
it only solves for the student, daily puzzle (logic puzzles, no curriculum topic).

Tutor »Podobna naloga« (`<<ODPRI vaja>>`, #1088) opens a Vadnica task from a code-checked generator, so its answer is already a `practice` event (P1-4). The placement test of a new topic still does not count (the student has not learnt it yet).

Rule (`isWeak`): at least `MIN_TURNS` (3) answers in `DAYS` (60) days across all sources, error rate ≥ `MIN_RATE` (40 %), and errors on at least 2 days or at least `MIN_ERRORS_ONE_DAY` (3) errors (one lesson read with 2 wrong checks is not yet weak).
Privacy: `skill_results` keeps only daily counts per topic, `skill_seen` only what was counted and the day (no answers,
no times of day), 365 days, both in the data export (`weak_points`, `weak_points_seen`), deleted with the profile. No AI calls (free-tier cost cap).
