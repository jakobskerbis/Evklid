---
name: evklid-simulations
description: STEMMind in-house interactive simulations (public/sim): architecture, catalog, testing, ownership; PhET fully removed in PR #22 (2026-10-28) <!-- brand:legacy -->
metadata:
  type: project
---
All textbook simulations are our own (no PhET, no iframes). Merged to main in PR #22 on 2026-10-28.

- `public/sim/index.js`: `ENGINES` maps id → [file, export]; `mountSim(id, el, opts)` loads by dynamic import. The server imports it too (`hasEngine`). There are 156 engines, including the old `public/demos.js` ones.
- `public/sim/katalog.js`: `SIM_TOPICS` maps a topic id to one entry `[id, title, opts]` or to a list of them. It covers 335 topics: every OŠ, SŠ and TEK (competition/olympiad) topic for MAT/FIZ/KEM. University paths are NOT covered (see [[evklid-university]]).
- `public/sim/kit.js` holds the shared helpers: slider, select, segmented, axes, fnPath, draggable, animate, playButton, tex, layout.
- Engine files are grouped by area:
  - mat-*, mat-tek.js
  - fiz-*, fiz-tek.js
  - kem-skupno.js (element data, formulas, drawing) plus kem-snov, kem-reakcije, kem-racun, kem-organska and kem-tek.
- Styles live in `public/textbook.css`.
- Tests in `test/textbook.test.js` fail if:
  - a catalog topic or engine doesn't exist, or
  - any OŠ, SŠ or TEK topic has no sim.
  So a new curriculum topic needs a catalog entry.
- QA: `node scripts/preveri-simulacije.cjs` (PR #62) mounts every catalog sim at 360 px and fails on console errors, overflow, missing »Poskusi«/»Ponastavi«, unlabeled controls, .drag without keyboard. Quality bar: docs/kakovost.md §3, see [[evklid-quality-bar]].

**Ownership:** the textbook thread owns `content/lessons/*`. Some lessons still have a `phet:` header (now ignored) and mention PhET in the text. The textbook thread should remove these. `lesson-check.js` already forbids "PhET" in the text.

**Fidelity rule (j, 2026-10-28; PR #35):** every sim must show its input visually, not only as numbers.
- Use a fixed scale computed from the slider maximums; never auto-fit to the current value. Graph axes may use round 1/2/5 steps.
- Draw all forces in one shared scale. Body size follows the cube root of mass.
- When an arrow is clipped, draw it dashed and label it "skrajšana".
- Run animations in real time (e.g. free fall with the chosen g), or label the speed-up or slow-down ("N-krat počasneje").
- `prosti-pad` lives in fiz-meh.js `prostiPad`: the view zooms with h and shows a 1.7 m person for scale.
- QA check: set each slider to its min and max and compare the SVG without text. A slider that changes nothing visible is a bug, unless it is hidden in that mode or only changes motion.
