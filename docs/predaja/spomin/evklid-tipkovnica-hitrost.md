---
name: evklid-tipkovnica-hitrost
description: Evklid on-screen keyboard performance rules (PR #403, 4 Nov 2026): no page-wide :has, drsniki scoping, equal layer heights
metadata:
  type: project
  modified: 2026-11-04T14:56:18.476Z
---

PR #403 (merged 2026-11-04, j: »tipkovnica is feeling too clunky«). Phone at 6× CPU: key press 80 → 40 ms, long tasks 13 → 0.

- Never add `body:has(...)` / `.tk:has(...)` rules that can change on DOM insertion: each key press re-ran style for the whole page. Use a class instead (`body.boot-down-on`, `.tk.tk-abc`).
- public/drsniki.js MutationObserver: mutations only inside #tipkovnica scan only the keyboard; INPUT/TEXTAREA style changes ignored.
- tipkovnica.js: one persistent `.tk-prev` (class `on`, text via `.data`); ⇧ uses `paintShift()` in place, not `render()`.
- All layers equal height via `.tk-in.tk-multi` (CSS block at end of tipkovnica.css); on touch the empty suggestion strip is reserved ONLY when word suggestions are on (`reserveCtx`, PR #418; j: no empty space when off).
- Measuring: Playwright + CDP `Emulation.setCPUThrottlingRate`, Event Timing PerformanceObserver, tracing with invalidationTracking shows which selector invalidates.
- PR #412 (4 Nov): char/ins/lit keys and ⌫ act on pointerdown (j: »takoj, brez zamika«); glide start or long-press variant calls undoPress() (restores text, selection, ⇧ from down.shift). Double tap ⌫ ≤350 ms = word, triple = sentence (sentenceBack); hold repeats use {rep:true} so they never count as taps.
- PR #439: keys inside scrolling rows (.tk-ctx chips, .tk-scroll f(x)/Σ grids, .tk-sub, .tk-tablist) act on release only and only if the row did not scroll (j: swipe must not insert).
- Test: test/tipkovnica-gladko.test.js.

Related: [[evklid-graph-calculator]]
