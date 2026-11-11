# Token rules for every thread and agent

Written in English on purpose: it is read by agents, and English needs fewer tokens than Slovenian.

## 0. Quality comes first (j, 2026-10-29)

Save tokens only where lesson quality stays the same. Never to save tokens:
- drop the second-Opus review, the recalculation of every worked example, or the quiz-key check;
- shorten lessons, remove »Drugače« sections, worked examples or quiz questions;
- switch writers or reviewers to Sonnet or Haiku (Opus or Fable only; Opus is the default).

Since 2026-10-29 13:00 UTC j has the Claude Max 20x plan and set the rule (12:59): every thread spends the remaining usage on the best quality it can buy, relative to what is left. Quality steps (second review, raising old lessons to `docs/kakovost.md` §1, reviewer effort high) come before more lessons per day.

Everything below cuts waste (re-reading, idle turns, long replies), not content. A terse style is for agent replies, relays and reports, never for student-facing text (lessons, practice tasks and hints, games, the tutor's explanations).

## 1. Never read these whole

| File | Size | Use instead |
|---|---|---|
| `server/university-extra.js` | 1.1 MB (~400k tokens) | `node scripts/lesson-topic.js <id>`, `node scripts/fakultetne-lekcije.js --json --n 16` |
| `docs/predmetniki-*.md` | 17–118 KB | `grep -n` for the one course you need |
| `content/references/*.json` | >150 KB | `grep` / a `node -e` filter |
| `server/university-data.js`, `server/curriculum-data.js` | 30–60 KB | the two scripts above |
| other lessons in the same path | ~5k tokens each | `previousSummaries` in the `lesson-topic.js` output |

Read a big file only with `offset`/`limit` or `grep -n`, never twice in one agent.

## 2. Lesson writer agents

- The whole prompt of a writer agent is the output of `node scripts/lesson-brief.js <id> <id>`: it already holds the rules of §2, `docs/kakovost.md` §1/§1b and the topic JSON (`previousSummaries`, goals, demos, `form` plan). `--review <ids>` is the reviewer brief, `--read <ids>` the third-pass reader brief. The orchestrator passes only the ids in the workflow args; the agent's first step runs the script itself and follows it (workflow args shrink from ~100 KB to ~2 KB per batch). Do not write briefs by hand and do not add the README or exemplar text to the prompt. Agents do not explore the repo beyond that.
- Give each writer **2 related topics** (same path, adjacent in the learning path). The fixed cost of an agent (system prompt, tools, reading the format and exemplar) is then paid once for two lessons. Do not go above 3.
- Read at most: `content/lessons/README.md` (format) and `exemplar` (style, `content/lessons/FIZ-OS-9/upor-in-ohmov-zakon.md`). Use `previousSummaries` for what the student already knows; open a sibling lesson only if a summary is missing and it is truly needed.
- Keep the writing brief in the workflow script short (aim ≤ 400 words): level, j's rules (Podatki/Iščemo in every worked example, formula only in `:::formula`, Slovenian terms, decimal comma, »avtor: AI«, no »PhET«), the topic JSON. Do not paste README or the exemplar into the prompt as well as letting the agent read it.
- Write each file with one `Write`. Check numbers with one `node -e` call (cheaper and more reliable than mental arithmetic). Run `node scripts/check-lesson.js -q <files>` once; fix failures with `Edit`, not a rewrite. Do not `cat` the file back.
- Final reply to the orchestrator: ≤ 3 lines per lesson (`OK <id>, <words> besed` or what is unresolved). No lesson text in the reply.

## 3. Reviewer agents (second Opus, keep it)

- Give each reviewer **2 lessons** (3 only for diff-only raise reviews), effort `high`, and only: the file paths, the topic level (path label + goals), and the checklist below. No exemplar, no README.
- Run `node scripts/check-lesson.js -q <files>` first; the format, LaTeX and every pure-number step (`$37 \cdot 7 = 259$`) are then already checked (the checker prints how many steps it recomputed and fails on a mismatch), so the reviewer reads for content only.
- Checklist: the remaining numbers in worked examples recomputed (substitutions, rounding, units and significant figures; batch them into one `node -e`); every »+« quiz answer truly correct and every »-« truly wrong; level fits the path (nothing not yet taught); Slovenian terminology; »Podatki« lists all given data.
- Fix with small `Edit`s. Never rewrite the whole file. Reply: `<id>: N popravkov – <5–10 words each>`, ≤ 5 lines per lesson.
- For upgrading old lessons to the new format: run the checker first and fix only what it and the checklist flag; keep correct text as it is.
- Old lessons raised to the new bar (new `:::premisli`, `~` lines, 5th quiz question, faded example) get a second pass too: one reviewer per 3 raised lessons reads only `git diff origin/main -- <files>` and checks quiz keys, `~` lines, premisli answers, new numbers and level. The checker verifies arithmetic only; wrong quiz keys are where the earlier errors were.

## 3b. Reader agents (third pass, j 2026-10-29: everything in the app is reviewed three times)

- Every new lesson gets a third pass after the reviewer: an Opus »student's eyes« reader, prompt = `node scripts/lesson-brief.js --read <ids>`, **2–3 lessons per reader** (one reader per writer pair, or buffered across pairs, as long as there is no barrier), default effort, small `Edit`s only (clarity, premisli and faded step that really make the student think, not monotone per `docs/kakovost.md` §1b, flow, phone). It never changes numbers or quiz keys; it reports doubts instead.
- Readers report doubts about numbers or quiz keys as `DVOM:` lines instead of editing. Before the commit the orchestrator checks each one (one `node -e`, or the two lines around it) and fixes or dismisses it.
- Raised old lessons already have three passes (original writer, raise writer, diff-only reviewer): no extra agent.
- Run it as the third stage of the same pipeline (writer → reviewer → reader per pair), not as a barrier, so readers start while other pairs are still being written. Cost ≈ +1 agent per 3 lessons.
- Code PRs follow `docs/pregled.md` (pass 1 `npm test` + UI smoke test, passes 2 and 3 by reviewer agents; small fixes need pass 1 plus one reviewer, j 2026-11-04).

## 4. Orchestrator (the thread itself)

Each tool call resends the thread's whole context, which is large in long-running threads, so fewer calls matter most here.
- One wake = launch the batch, end the turn. Do not poll; the workflow notifies you.
- All threads and j's own Claude share j's 5-hour and weekly usage limits (Claude Max 20x since 2026-10-29); when one runs out, everything stops until its reset.
- **5-hour window.** On 2026-10-29 every thread stopped from 15:58 to 17:50 UTC on the 5-hour limit, because two lesson pipelines, several feature threads and long-context orchestrators ran at once. So each lesson thread runs **at most one batch per 5-hour window**, early in the window and one after the other: textbook thread at window start + 10 min, faks thread at window start + 1 h 30 min. The window start is the `resetsAt` that `get_session` showed during the previous window while `rateLimitType` was `five_hour` (windows chain back-to-back while threads are busy); at the end of each batch, schedule the next start from it. While it shows `seven_day`, take slot times from the optimizer's pace. A full batch is textbook 16 new + 8 raises + readers, faks 24 new + 6 raises + 6 variety + readers; the weekly pace may make it smaller or rarer. Faks topics are split between threads with `node scripts/fakultetne-lekcije.js --json --n 24 --deli 2 --del 0` (faks thread) and `--del 1` (textbook thread once OŠ+SŠ+TEK are done).
- **Weekly pace.** The weekly limit binds first when threads run around the clock: on 2026-10-30 it stood at 52 % with 68 % of the week left. So the optimizer thread sets a weekly pace (which lesson batches run, how big, at what times) from j's Usage screenshots and the sessions' `usage.cost_usd` (`get_session` with a session id): (90 % − weekly %) ÷ days to the weekly reset = % of the weekly limit per day for all threads together, school lessons before faks. Each pace message says `tight week: yes` or `no`.
- **Non-lesson threads** run at most 2 agents at once and no many-agent workflow unless j asks for one. Any number of feature threads (non-lesson threads other than the coordinator and the optimizer) may work at the same time (j, 2026-11-03; the earlier limit of 3 is dropped). Each stays within the dollar cap (`usage.cost_usd`) that the optimizer's weekly pace gives it for the week (memory `evklid-post-reset-queue`). The cap must also cover review passes 2 and 3 (`docs/pregled.md`; one reviewer for small fixes). A thread that reaches its cap before its review passes are done pushes its unfinished work to its branch, does not merge, reports `usage.cost_usd` to the optimizer thread and stops; a thread that finishes within its cap reports it once too. When j's Usage screenshot is above the optimizer's daily line, the coordinator pauses lesson batches first, then the lowest features of the weekly pace.
- Before launching a batch, call `get_session` (claude-code-remote MCP, no arguments) and read `external_metadata.rate_limit_info`: `allowed` → only what the latest weekly pace gives this slot (nothing → skip); `allowed_warning` or `rejected` on `five_hour` → skip the slot (a batch cut off mid-way wastes its agents) and tell the optimizer thread; `allowed_warning` on `seven_day` → follow the latest pace marked `tight week: yes`, and without one skip the slot and tell the optimizer thread (the warning means usage is ahead of a steady weekly pace, not that the limit is near; late in the week the limit may stop everything without a warning first); `rejected` on `seven_day` → stop until its `resetsAt`.
- Long-running orchestrators: every tool call re-reads the thread's whole context (200–400k tokens in threads that run for days), so one call can cost as much as a small agent. Put several steps into one Bash call, never paste large outputs into the thread, and keep scheduled wakes rare (the optimizer checks every 4 h, not every hour).
- **Handing over to a new thread.** j asked on 2026-11-03 that the biggest threads continue in new threads with a handover, so that nothing important is lost. A new thread starts with about 100k tokens of instructions, tools and memory (measured 2026-11-04), so the cut-off is: the thread still has work before the weekly reset and its context is over about 200k tokens (`get_session` with no arguments → `external_metadata.context_usage.used_tokens`; check when starting a new task).
  1. The old thread writes `/mnt/project-files/predaja/<thread-title-in-kebab-case>.md` (at most 6 KB) with: the goal; j's decisions with dates and message ids; open work and the next step; cards still waiting for j's answer; PRs and branches; artifacts and links; its scheduled wakes (id, time, what each does); pitfalls; the memory files it maintains. It also updates its memory file.
  2. It finishes a PR that a scheduled wake already started, disables its scheduled wakes (`update_trigger` with `enabled: false`), sends the file path to the coordinator (`message_coordinator`) and stops.
  3. The coordinator opens a thread with the same goal and title and gives it the path, or sends the path to a smaller thread that works on the same code. The new thread reads the handover and memory, not the old thread's history, recreates the scheduled wakes and re-posts open cards. The coordinator resolves the old thread and updates the thread ids in `MEMORY.md`.
  A thread with no work before the weekly reset costs nothing while it waits, so it does not hand over.
- A message to another thread wakes a long-context session that re-reads its whole context on every step (see above), so send one only with a result, a question or a blocker, never an acknowledgment alone. Do not paste file contents or earlier messages into replies, relays or agent prompts; pass paths and ids, plus the few rules from this file the agent needs. Agents reply with results only: no preamble, no recap of the brief.
- Report each batch to the optimizer thread: agents per role, wall time, `subagent_tokens` (the Workflow tool's total: input + output over all turns, probably with cache reads; comparable between batches, not exact accounting), tokens per lesson, and `rate_limit_info` (type, status) from a `get_session` call at batch end. The optimizer thread adjusts the pace from these reports and j's screenshots.
- Do not read lesson files, memory files or old thread messages to report on a batch; use the agents' short replies.
- After the batch, one command: `node scripts/check-lesson.js -q $(git diff --name-only origin/main -- content/lessons) && npm test 2>&1 | tail -6`, then one command for `git add/commit/push`.
- Status: update the checklist; send at most one short reply per batch (≤ 60 words). No replies for routine steps.
- Write memory only when something new is decided, and update the existing file instead of adding a new one.

## 5. Model and effort

- **Fable where it has a noticeable edge, else Opus (j, 2026-11-11).** Use Fable for every agent or thread whose result is clearly better with it: writing and reviewing hard lessons (competition topics, faks 3rd year and up, proofs, numerics, multi-step derivations), hard bugs and architecture, 3D/geometry and other maths-heavy code, the second reviewer on money, accounts, personal data, child safety or the tutor prompt, and design or quality judgement j will see. Routine work (easy lessons, small fixes, mechanical edits, coordination, logs) stays on Opus, where Fable adds little; routine code review and bug hunting may stay on Sonnet (j, 2026-11-07).
- **Fable runs out → Opus, keep going.** Fable has its own smaller weekly counter on j's Usage screen. When a Fable agent or thread hits that limit, rerun or continue the same step on Opus at once, with the same prompt and passes; do not pause or wait for the reset, and note the switch in the report. Fable also costs about 2.5 times as much as Opus against the shared weekly limit, so it counts toward the 90 %/95 % stops.
- Never Sonnet or Haiku for content.
- Writers run at the default effort; reviewers at `high` (numbers are still verified with `node -e`, effort buys a more careful reading of level and reasoning).
- Do not tell agents to shorten or compress their reasoning: the effort setting controls it, and lesson quality depends on it.
- Effort of the agents a thread launches outside lesson batches: `high` for features and hard bugs, `medium` for small or routine work, `max` only when j asks; agents in lesson batches keep the levels above. A thread's own model and effort are j's choice; the coordinator may suggest them when it opens a thread. Mechanical work with no student-facing text may run on Sonnet, but never review passes 2 and 3 (`docs/pregled.md`). Model choice for Fable follows the first two points of this section.

## 6. App runtime cost (the tutor)

Already done in PR #26 and #47 (see `docs/stroski-ai.md`): Haiku by default, Opus only for »Razloži podrobneje«, static system prompt cached with 1 h TTL, history trimmed, reuse/hint answers without a model. When changing `prompts/system_prompt.md`, keep everything above `<!-- EVKLID:NASTAVITVE` byte-identical for all students, or the cache stops working.

For new API calls: static instructions first, the per-request part last; add `cache_control` only where the static prefix is longer than the model's minimum cacheable length and repeats within the cache lifetime. Jobs on the API key that send many independent requests use the Message Batches API at half price, as `scripts/generate-lessons.js` and `scripts/generate-explanations.js` do; this does not replace the §2–§4 lesson pipeline and its three passes.
