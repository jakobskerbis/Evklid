---
name: evklid-games
description: Evklid IGRE section: j's asks 2026-10-29, design (engines × concepts), PRs #89–#236, marked path, all grades 1+, 31 engines, childhood questionnaire, avatar shop
metadata:
  type: project
  modified: 2026-11-04T12:00:00.000Z
---
j 29 Oct: IGRE portal, playing = doing maths, original designs only.

**Done, PR #89 merged 2026-10-29:** public/games/ (topics.js, engines.js, core.js, index.js), server/games.js (game_scores table, best/tier, XP 1 per 2 correct, cap 20/game, 60/day), test/games.test.js, docs/oblikovanje.md »Igre«. Desktop tab »Igre«; phone: row on Jaz.

**PR #105:** arcade.js, arcade2.js, build.js, sensors.js engines; other subjects in public/games/subjects/ (README). Game settings go in public/settings-registry.js.

**Locks:** LOCKS_ON=false in unlock.js (all open); new engine needs PACE.

**j 14:42 (every area, every grade from 1st):** PR #124 merged: mat15.js (MAT 1–5), spo.js (SPO 1–3), nit.js (NIT 4–5), mat2.js (maths path topics without a game); fiz2/kem2 (PR #133), bio2/nar2 (PR #141): every MAT/FIZ/KEM/BIO/NAR path topic has ≥1 game. PR #127: profile allows OŠ 1.–5. razred.

**PR #151 (2026-10-29 evening, j: Papa's / Hill Climb / Pou mini games / Fruit Ninja / Where's My Water / Minesweeper style):** public/games/fun.js 8 engines diner, hills, pet, catcher, pairs, slicer, water, mines (27 engines total).

**PR #174 (2026-10-30, j: childhood-games questionnaire):** public/games/childhood.js 26 generic genres → engines, profile setting game_childhood, banner; retro.js new engines blocks, match, cards (30 total). New genre = GENRES entry + games.g.<id> in all languages, never a brand name.

**Weekly new games (PR #197):** 👍/👎 vote per game, week Wed–Wed UTC, private admin panel »Glasovi tedna« (votes NOT public). Wed 06:13 UTC task: j pastes list → winner + 2–3 options on a card → build after j picks (docs/igre-tedensko.md). PR #222 own titles in questionnaire.

**PR #231 (30 Oct, j »dodaj amongus style igre«):** deduction.js engine `impostor` »Kdo je slepar?« (original robots, airlock; crew tasks via G.ask(), HUD instruction via engine.prompt, feedback via G.answer note; choice tasks show option chips). Genre `impostor` in GENRES (27 genres). English name »faker«. PR #236: grid paged, 60 games/page (pages.js).

**Astra example (j 1 Nov):** »Linearni žarek« style, screenshots /mnt/project-files/evklid/igre-vzor/; own originals, mix many interaction kinds.

Avatar/shop files belong to the cosmetics thread.

Design guide docs/igre-smernice.md (PR #96).

**4 Nov (thread cmsg_011HYzNBAS5HRU1H7PcSE7Jt4sHE4mDDPEPxq8w5Ehx2bq):** #282 public/games/stage.js: OŠ playful, SŠ/faks .gm-calm look + harder start tier (2/3); profile setting games on|off »Skrij igre«. #289 produce.js engines numline + typed (answer produced, exact value; produce-fits.js via scripts/igre-pojmi.js). #313 produce2.js tiles (Sestavi enačbo) + order (Razvrsti); grid mixes engine order per concept. Varied-games plan done. j 4 Nov: one new game kind EVERY WEEK (task trig_01RE6S7LHzB878NC9WdhrJZa Thu 07:17 UTC; vote winner first, else backlog: graph points, guess equation, pipes, nonogram). #345 reward.js (game after daily training), learn-link.js »Ponovi šibke teme«, pilot metrics GET /api/games/pilot (admin, k-anon ≥3). #353 daily puzzle (daily.js, server/daily-puzzle.js; same for all, 3 levels, hints, ranking). #364: export incl. games/league/avatar; daily puzzle 2-col via @container; names-ar.js (only ar; other non-sl/en langs show English names). Open: daily puzzle cheatable (client-side), some SŠ topics lack reward game. Optimizer: cmsg_011HYzNBAS5HRU1H7PcSE7Jt8EQahEA2WPJwMnPr2UBLVB; Thursday run ≤15 $. Decisions → decisions thread cmsg_011HYzNBAS5HRU1H7PcSE7Jt6zBtvecoWzGJyRTNXXvC1w. Votes task trig_015hSoQ3e31yEC9mmvutf5xu paused (j: list fills in a few weeks); one-shot trig_015ss4AusX7Ppt2WBnNnVENw re-enables it 25 Nov.

See [[evklid-i18n]], [[evklid-ui-design]], [[evklid-token-rules]].
