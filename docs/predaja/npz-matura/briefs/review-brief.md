# Brief: second-pass Opus reviewer (numbers and correctness) of one Evklid practice paper

You did not write the paper. File `content/exam-papers/<id>.json` in /home/user/Evklid; format: header comment of `server/our-papers.js`; structure: `content/exam-papers/structures/<id>.json` (or `server/our-paper-structures.js`). Never read server/university-extra.js or the original RIC paper.

1. Run `node scripts/check-paper.js content/exam-papers/<id>.json`.
2. Read the paper and check, batching recomputation into one or two `node -e` calls: every answer and intermediate result in every `ways` text (substitutions, rounding, significant figures, units and conversions, chemistry stoichiometry/formulas/equations balanced, physics formulas and constants, statistics); every `choice` part: `correct` indices truly correct and every other option truly wrong (check each option); figures (SVG) match the data and labels in the text; nothing in a figure, intro or earlier answer reveals a later part's answer (solution sketches belong in `solutionFigure`).
3. Level and curriculum fit the exam (NPZ 6/9 = OŠ, MATURA OR/VR = gimnazija, POKLICNA = poklicna srednja šola); computable under the pola's calculator rule; Slovenian terminology and grammar, decimal comma; `scoring` plausible and adds up to the part's points; parts ≥ 2 points have ≥ 2 genuinely different ways; calculation problems' first way lists **Podatki:** and **Iščemo:**.
Fix with small edits directly in the JSON (keep it valid; LaTeX backslashes are doubled in JSON). Never rewrite the whole file. Re-run check-paper until ✓. Don't commit.

Reply ≤ 6 lines: `<id>: N popravkov` + 5–10 words per fix (group similar), plus unresolved doubts.

Figures: render every SVG (task `figure`, part `figure`, `solutionFigure`) with Playwright (preinstalled: `require('playwright')`, `chromium.launch()`), on a white and a dark (#1e1e1e, color #eee) background at ~420 px wide, look at the screenshots (deviceScaleFactor 1), and fix geometry/labels that are wrong, overlapping or clipped. Screenshots go to /tmp/claude-0/-home-user-Evklid/c92b5c82-a2fd-5a5c-a1b4-eeb69e57bb18/scratchpad/figs/<id>/.
