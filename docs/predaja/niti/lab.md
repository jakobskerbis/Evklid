# Handover: Laboratorij (virtual science lab) – 4 Nov 2026 ~11:40 UTC

Previous threads: cmsg_011HYzNBAS5HRU1H7PcSE7JtWrCGs3grp6Y6Jj3kHqkanY (to 4 Nov 08:00), cmsg_011HYzNBAS5HRU1H7PcSE7JtViS4z1CbdbMDqeMEy9ruab (4 Nov 08:00–11:40, context 270k → handover).
Memory: team memory `evklid-lab.md` (+ `evklid-sim-ideas.md`). Rules + code map: `docs/laboratorij.md` (rules 1–8; rule 7 = shared pinned drawing).

## j's rules (all still valid)
- Brief point 8: student builds the setup (also wrongly), real laws + literature data, datasheet noise, table + graph + conclusion question, simplifications in the sim, literature test per sim, triple review (docs/pregled.md). Thread merges its own PRs. Reply to j in simple Slovenian.
- j 4 Nov 07:57/07:59: »laboratorij naj bo čimbolj realističen«, »tudi vizualno« (real-looking glass, liquids, metals, devices, bubbles; phones smooth).
- j 4 Nov 09:34: »Dokončaj/naredi vse, kar sem ti poslal do zdaj, ne glede na limit, razen stvari, ki bi cel limit požrle – pri tistih izberi najpomembnejše. Ko končaš, mi pošlji obvestilo.« → the 80-plan is the »whole-limit« item: do the most important benches first.
- j 4 Nov 11:20: EVERY decision for j goes as a card-style message into the decisions thread »Zberi vse moje odločitve« cmsg_011HYzNBAS5HRU1H7PcSE7Jt6zBtvecoWzGJyRTNXXvC1w (message_thread: question, 2–4 options with one-line consequence, recommended option + why). Steps j must do also go there as list items. Not into the lab thread.
- j 1 Nov: after the 80, weekly scheduled task (Wed after 02:00 UTC reset), 3 new experiments/week.

## Optimizer (thread cmsg_011HYzNBAS5HRU1H7PcSE7JtEMiTgSpbZu2iAmVotBg46y → since 11:34 Optimizator 2 cmsg_011HYzNBAS5HRU1H7PcSE7Jt8EQahEA2WPJwMnPr2UBLVB; report there, tell it the new lab thread id), 4 Nov 09:39
Lab slice ≤ 250 $ from 09:39 (old session cost_usd 85.45 $ at 12:28 after #372; from 12:19 optimizer allows ≤ 50 $ more in total, ~46 $ left for the new thread ≈ 2 benches), ≤ 2 heavy agents at once, OŠ FIZ/KEM core first then SŠ, triple review, five_hour warning → wait for resetsAt. Report session cost_usd (get_session; now counts subagents fully) after each PR. Real cost ≈ 20–25 $ per bench (author + 2 reviewers).

## Done today
- #329 Elektrokemija: lab-elektroliza, lab-galvanski (activities γ±), lab-kovine.
- #333 Phone: drawing + meters pinned while controls scroll, for every `.lab` engine (lab.js `pripni`, toggle »Pripni sliko«, test/laboratorij-telefon.test.js). #351 adds: wide drawings full width on top on desktop.
- #351 Gibanje A: lab-klanec, lab-prosti-pad, lab-newton2.
- #372 Equation line breaks app-wide (j 08:36/08:38 »To naj velja za vse enačbe«): sirina.js initSirina, decVejica, scripts/preveri-formule.cjs; sims 83 → 0 scrolling, lessons 99 → 17.
- Totals: 27 lab engines; plan items done ≈ 25 of 80.

## Next (j 12:18: work runs to 95 % weekly; optimizer: ≤ 50 $ from 12:19 incl. equation PR, ≤ 2 heavy agents, hard stop when optimizer says 95 %; most important first)
1. FIZ OŠ: »Električni krog B« = #4 elektromagnet (FIZ-OS-9), #5 indukcija (FIZ-SS-3 but OŠ magnet too); #10 trenje (FIZ-OS-8, reuse lab-model-sile + track from lab-model-gibanje).
2. KEM OŠ: #5 plamenska reakcija, #12 hitrost reakcije (Mg/CaCO₃ in HCl, gas syringe; reuse lab-model-elektrokemija kinetics), #6–7 toplota gorenja/nevtralizacije (reuse MesanjeBench).
3. Gibanje B (SŠ): #15 trk vozičkov, #16 nihalo; #20 Boyle; #11 navor.
4. Then KEM #4, #13–17, #19–20; NAR; BIO (none yet).
Leftovers per bench: docs/laboratorij.md »Next«. Open small items: Arabic shows mirrored punctuation in Slovenian lab texts (all labs); repeated drops fill the event log with the same warning (gibanje); lab-ohm pin button covers a wire corner; tables with 6–8 columns still scroll sideways on phones in vezava/slina/gostota/lom; Mg in CuSO₄ has no Mg(OH)₂ passivation.

## How to build (worked well)
- Worktree per bench: `git worktree add -b lab-X /home/user/wt-X origin/main && ln -s /home/user/Evklid/node_modules /home/user/wt-X/node_modules` (run `npm ci` in the main checkout when main adds deps, e.g. `three`).
- One Opus author agent (effort high) with a tight brief: template = Elektrokemija or Gibanje files; new lab-model-X.js / lab-X.js / test; CSS prefix; ENGINES, SIM_TOPICS + LAB_INFO; docs; `el.classList.add("lab")`, drawing in `.demo-stage` followed by `.demo-controls` (pin is automatic); screenshots to /mnt/project-files/evklid/posnetki-laboratorij/<bench>/ via /mnt/project-files/predaja/lab-posnetki.cjs.
- Then pass 2 (science: model/tests/docs/katalog) → pass 3 (UI/CSS/wording + pass-2 UI bugs, commits all). Pass 1: npm test, preveri-aplikacijo.cjs (~5 min), preveri-simulacije.cjs (~10 min now, run in background).
- Branch claude/project-thread-<new id>: reset from origin/main per PR, merge the worktree branch, push, PR (attribution block), assign jakobskerbis, squash-merge. GitHub API sometimes 500s: wait 20 s and retry. Watch merge holds from the optimizer (Render shell tests).

## Update 4 Nov 15:30 UTC (thread cmsg_011HYzNBAS5HRU1H7PcSE7JtMBKG99cULDQqBqTSNfFEBF, branch claude/project-thread-8g3m13)
- #392 Elektromagnetizem merged: lab-elektromagnet (+ {raven:"os"} OŠ variant with qualitative conclusion; LAB_INFO key 'lab-elektromagnet:{"raven":"os"}'), lab-sila-vodnik, lab-indukcija. 22,2 $.
- #409 Kemijske reakcije merged: lab-hitrost, lab-energija, lab-plamenska, each with OŠ variant. ≈16,4 $. Session total 38,6 $.
- 33 lab engines now. Optimizer: lab stops until the weekly reset Wed 11 Nov.
- Next by importance: Gibanje B (trk vozičkov, nihalo), Boyle, navor, trenje; KEM #4, #13–17; transformer / eddy brake / tangent galvanometer (docs »Next«); NAR; BIO.
- Pitfalls: main checkout had no node_modules (symlink pointed nowhere) – run `npm ci` in a worktree and symlink from there; never `git add -A` with a node_modules symlink (.gitignore only covers the directory form `node_modules/`).
