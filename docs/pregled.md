# Triple review: every change is checked three times

j (2026-10-29): »Naj bo vsaka stvar in element v aplikaciji trikrat pregledan.« Every feature, screen,
task, game, text and lesson is reviewed three times before it reaches students. English on purpose:
agents read this file (see `docs/token-rules.md`). The bar each pass checks against is `docs/kakovost.md`
(content) and `docs/oblikovanje.md` (look).

Small fixes get one reviewer instead of two (§1, last paragraph; j, 2026-11-04).

The author's own checking does not count as one of the three passes. Pass 1 is automatic; passes 2
and 3 are separate reviewer agents (Opus, or Fable for the hardest content; never Sonnet or Haiku for
content) that did not write the change and start from a fresh context with only the diff, the
commands below and the checklist of their lens.

## 1. Code and UI changes (every PR that touches `public/`, `server/`, `prompts/`, `scripts/`)

**Pass 1 – automatic (must be green before passes 2 and 3):**
- **Green CI on the PR** (j, 2026-11-06). `.github/workflows/testi.yml` runs two parallel jobs on every
  PR and push to main: `testi` (`npm test`, Chromium + WebKit) and `preveri`
  (`node scripts/preveri-aplikacijo.cjs`), in test mode with no secrets. Read the result with
  `gh api repos/jakobskerbis/evklid/commits/<sha>/check-runs -q '.check_runs[]|"\(.name) \(.status) \(.conclusion) \(.output.annotations_count) \(.id)"'`
  (both `completed success`); on failure the run's artifacts hold the log and screenshots
  (`gh api repos/jakobskerbis/evklid/actions/runs/<run>/artifacts`). A new push to a PR cancels its old run
  (pushes to main are never cancelled).
- **`annotations_count > 0` on `testi` = a flaky test**: a failed test file passed only on its single retry.
  Read `gh api repos/jakobskerbis/evklid/check-runs/<id>/annotations` (and the `testi-dnevnik` artifact),
  then fix the test in the same PR, or write it in the PR body with a reason. Green with a retry is not
  clean.
- Locally (2-core server, under `flock /tmp/evklid-tezko.lock`) run only the affected test files
  (`node --test test/x.test.js`) and screenshots; CI covers the full `npm test` and
  `preveri-aplikacijo.cjs` (it clicks through every tab and main flow on desktop and phone in test mode;
  fails on page errors, console errors, HTTP ≥ 400, horizontal scroll, raw i18n keys).
- when touched: `node scripts/preveri-generatorje.js` (0 errors), `node scripts/kakovost-nalog.js <prefix>`,
  `node scripts/preveri-simulacije.cjs`, `node scripts/check-lesson.js -q <files>`,
  `node scripts/preveri-formule.cjs` (sims, `public/sirina.js` or KaTeX output: no formula may scroll at 360 px)

**Pass 2 – function (reviewer agent 1):** reads the diff and the code paths it touches, and uses the
feature in the running app (test mode, throwaway `EVKLID_DB`). Checklist: does every button and
input do what it says; state refreshes after the action; back/close/Esc work; empty, error, offline
and slow states; another profile's data never visible; invalid API input returns 4xx not 5xx; no
regression in the flows next to it; a test exists for each server change.

**Pass 3 – look, phone, language and content (reviewer agent 2):** screenshots of every changed screen
at 360×740 and 1280×800, light and dark, Slovenian plus one RTL language (Arabic); the reviewer looks
at them. Checklist: nothing overlaps, clips or scrolls sideways; touch targets ≥ 40 px; contrast AA;
focus visible and keyboard works; icon buttons have `aria-label`; no information only in colour;
every new string has a key in `public/i18n/sl.js` and all 32 `public/i18n/ui/*.json`, none left in
Slovenian in other languages; a new top tab, menu row or two-panel view works with movable windows,
row reordering and width handles (`docs/oblikovanje.md` »Nove stvari«); correct Slovenian (terms of the school level, decimal comma); any
student-facing maths/physics/chemistry is correct and at the right level.

Each reviewer fixes what it is sure about with small edits (or returns a list), then the author
reruns pass 1. Merge only when all three passes are clean or every open item is written in the PR
body with a reason.

**Small fixes: one reviewer (j, 2026-10-30, widened 2026-11-04).** A small fix is a bug fix or small
tweak to existing code or look (at most about 50 changed lines; no new screen, tab, feature or game;
CSS, layout, UI wording and screenshots count as small). Passes 2 and 3 are then one reviewer agent
covering both checklists; it is still a different agent from the author, and pass 1 still runs.
Always two separate reviewers, whatever the size: anything touching money, prices, AI usage or cost,
accounts, personal data, the tutor prompt, or student-facing content (lessons, exercises, papers,
simulations, videos, experiments, maths/physics/chemistry text) (j, 2026-10-30: the second and third
reviews keep catching money and cost bugs there). When unsure, treat it as big.

## 2. Lessons (`content/lessons/**`)

1. automatic: `node scripts/check-lesson.js -q` (format, LaTeX, every pure-number step recomputed);
2. second Opus reviewer: numbers, quiz keys and `~` lines, level, terminology (`lesson-brief.js --review`);
3. third Opus reader (student's eyes, not numbers): reads the lesson as a student of that level would
   and checks that it is clear, not monotone and not the same shape as its neighbours on the path
   (`docs/kakovost.md` §1b), and that every `:::premisli` and the faded example make the student
   think. Brief: `node scripts/lesson-brief.js --read <ids>` (3 lessons per reader, effort default,
   small `Edit`s only, never numbers or quiz keys); stage described in `docs/token-rules.md` §3b,
   which the optimizer thread owns.

## 3. Tasks, sims, games, exams (content written as code or data)

1. automatic: `preveri-generatorje.js` (40 seeds × 3 levels), `kakovost-nalog.js`, `preveri-simulacije.cjs`, `npm test`;
2. reviewer 1 (Opus): samples generated tasks at every level and recomputes answers with `node -e`;
   checks hints, `mistakes.why`, units, rounding, level;
3. reviewer 2 (Opus): plays the game / sim / exam in the app on phone width and checks the pedagogy
   against `docs/kakovost.md` §2–§3 and `docs/igre-smernice.md`.

## 4. Whole-app review

Besides per-PR reviews, the whole app gets the three passes as one sweep (first sweep: 2026-10-29,
thread »Triple-check every app element«): three reviewer agents in parallel, one per lens (function;
look/phone/i18n; content/pedagogy), then one independent verifier agent that rereads all their fixes.
Repeat the sweep after any large change (new tab, new design version) and at least before each
public step (teacher pilot, open beta).
