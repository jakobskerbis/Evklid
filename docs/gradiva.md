# Learning material types (gradiva)

j's brief point 7 (2026-10-30), design doc »Evklid Osebno poleg šolske licence«, table »Vrste gradiv«.
English on purpose: agents read this file. Code: `server/gradiva.js`, `server/govor.js`, `public/gradiva.js`.

## Access

One function decides: `canUse(student, vrsta, topicId)` in `server/gradiva.js`. `free` types (made from
the free textbook text, no cost) are for everyone; topic materials follow `lessonInteractive` from
`server/placila/pravice.js` (school licence: its subjects and grades; Osebno: all); the weak-topic
worksheet is Osebno only. Locked materials are hidden in the lesson; offers belong to the offers work (brief point 3).

## Types

| Type | Status | Source | Access |
|---|---|---|---|
| One-page summary + mind map (`povzetek`) | built | lesson »Povzetek«, »Pogoste napake«, `:::formula` blocks; optional authored map | free, `/gradiva/povzetek/<POT>/<tema>` |
| Audio summary (`zvok`) | built | same text, LaTeX read aloud by `server/govor.js`, browser `speechSynthesis` with a Slovenian voice | free |
| Printable worksheet with solutions (`delovni-list`) | built | task generators (already reviewed), seeded: same »koda lista« = same sheet | paid; teachers free on the teacher page (class code + key or class owner), with or without the solutions page |
| Weak-topic worksheet | built | tasks of the last 60 days, ≥3 tasks and ≥40 % wrong at first try | paid, button on Napredek |
| Past NPZ / matura | links only | RIC holds all rights (»© Državni izpitni center, vse pravice pridržane« on every paper), so papers are linked on ric.si, never copied. The timed mock exam (PR #125) uses our own tasks in the RIC format | everyone |
| Home experiment (`poskus`), real-life project (`projekt`) | built; first batch 6 experiments + 4 projects (FIZ/KEM/NAR, 2026-11-04) | `content/gradiva/<vrsta>/<POT>/<tema>.md` | as topic materials |
| Short video from a simulation (`video`) | built; first batch 4 videos (2026-11-04) | script `content/gradiva/video/<POT>/<tema>.md` drives an existing simulation, captions read aloud | as topic materials |
| Live class quiz (`server/kviz.js`, `public/kviz.js`) | built | same task generators; teacher runs it on the projector from the class card, class members join in Lige | teachers free, only members of that class can join |

## Live class quiz

One quiz per class, in server memory only (one Render process; a quiz lasts one lesson and no results are
stored). It ends 30 min after the last activity or 3 h after it started. States: lobby → question → reveal → …
→ end; a question closes when the time is up or every player has answered. Points: 500 for a right answer plus
up to 500 for speed; an answer rounded differently counts as right; an empty or non-number answer, or a
missing unit, is not a mistake (the student types again, and the unit is shown next to the input). Players are
shown by their league nickname, as on the class board. Both screens ask the server every 1.5 s.

## Authored mind map (content)

Without a file the mind map branches are the lesson's summary bullets. A better map is a short file
`content/gradiva/miselni/<POT>/<tema>.md` (same id as the lesson):

```
---
avtor: AI
stanje: osnutek
---
- Upor
  - nasprotuje toku
  - enota ohm ($\Omega$)
- Ohmov zakon
  - $I = \dfrac{U}{R}$
```

Top-level bullets are branches (at most 8): a keyword of 1–4 words, no colon (as the lesson brief says).
Indented bullets are details. A branch written `Label: detail` still works: the detail is shown before the
indented bullets. With an authored map the summary page also shows the lesson summary.

## Written materials (content files)

Check every file with `node scripts/check-gradivo.js -q <files>` (format, KaTeX, simulation id, scene times).
Front matter always has `naslov`, `avtor: AI`, `stanje: osnutek|pregledano`. Examples: `test/fixtures/gradiva/`.
Write as the lessons do: Slovenian, addressing the student with »ti« (»Nariši …«, »Opazuj …«), the terms and
level of the topic (`node scripts/lesson-topic.js <id>`), maths in `$…$`, decimal comma, units with `\,`.
Every number and every claim in `Kaj opaziš`/`Zakaj` must match what really happens with those items.

**Home experiment** (`poskus`): only experiments that are safe at home with household items; anything with
acids, flames, mains electricity or heat beyond a kettle belongs to the virtual lab instead. Front matter also
`cas` (e.g. `20 min`) and `odrasli: da|ne` (`da` when any step uses hot water or a sharp knife;
the page then prints »Poskus delaj skupaj z odraslo osebo.«). Sections in
this order: `## Varnost` (always first, 2–4 concrete bullets: what could go wrong and how to avoid it),
`## Potrebuješ` (bullet list with amounts), `## Postopek` (numbered, 3–8 steps, one action each),
`## Kaj opaziš` (what the student should see, measured if possible), `## Zakaj` (≤ 4 sentences linking the
observation to the topic's law or formula), `## Vprašanje` (one question that asks to predict or explain a
change, not to repeat the text, then a line `> Odgovor: …`, printed at the bottom).

**Project** (`projekt`): `cas` (e.g. `1 teden`); sections `## Izziv` (one question from the student's own
life with a measurable answer), `## Potrebuješ`, `## Koraki` (numbered, 3–8), `## Kaj oddaš` (one concrete
product: table, graph, short report) and `## Merila` (3–5 bullets the teacher can tick off).

**Short video** (`video`): `simulacija` (an id from `public/sim/index.js` ENGINES, normally one listed for the
topic in `public/sim/katalog.js`), optional `moznosti` (JSON options for the simulation), `trajanje` m:ss
between 0:45 and 2:30. Each scene is `## m:ss` (first 0:00, increasing), one or two sentences of caption
(≤ 260 characters, read aloud), and action lines `- nastavi: <slider aria-label> = <value>` or
`- klikni: <button text or aria-label>`. Slider labels are the `label` of `kit.slider` in the simulation's source; for a `kit.select` the value is the option value or its text (use the value when the text contains »=«, e.g. »Zemlja (g = 9,81 m/s²)«: the line is split at the last »=«). A bullet line that is not an action is an error (usually a typo). The
player waits for the voice to finish a caption before the next scene, so keep captions short. One idea per
video, 4–8 scenes: each scene changes one thing and its caption says what to watch; the last scene states the
rule. A caption never names a value the simulation does not show at that moment.

## Content rules

All new content (maps, experiments, projects, video scripts) is written and reviewed by Opus or Fable,
three passes as lessons (`docs/token-rules.md` §3, §3b), at the pace the optimizer thread sets (§4).
Nothing here needs new content to work: every type above has a version built from reviewed material.
