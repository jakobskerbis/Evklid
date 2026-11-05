---
name: evklid-scan
description: Skeniraj nalogo (Photomath-like scan + verified step-by-step solver), PR #165 (30 Oct 2026): files, endpoints, rules
metadata:
  type: project
  modified: 2026-10-30T06:20:29.425Z
---

j 2026-10-30: »naj ima evklid vsaj tako dobro skeniranje enačb in reševanje po korakih kot photomath«. Thread cmsg_011HYzNBAS5HRU1H7PcSE7Jt1mEbEYjGzQRQjuTsnEqDvt, PR #165 MERGED 30 Oct ~07:45 UTC after triple review.

- Own deterministic solver, pure JS no DOM: public/scan/solvecore.js (solve(text,{goal})), algebra.js (BigInt Q, polynomials P), verify.js (checks AI answers; shared with server). Covers linear/quadratic(4 methods)/higher degree/rational eq., inequalities, 2×2 systems, arithmetic, simplify, factor, derivatives. Every result verified; unsupported → ok:false → AI.
- Server server/scan.js: POST /api/students/:id/scan/read {image dataURL} and /scan/solve {text}; Sonnet (MODEL_MID), env EVKLID_SCAN_MODEL / EVKLID_SCAN_SOLVE_MODEL; usage kind "skeniranje"; AI answer re-verified + 1 retry; mock mode returns mock:true.
- UI public/scan/scan.js + public/scan.css; showView("scan") then showScan({text}) opens with a problem; history localStorage evklid.scan.<studentId>. Step texts are i18n keys scan.s.* / scan.w.* / scan.m.* (sl.js + 32 ui json).
- Ownership: calculator thread (cmsg_011HYzNBAS5HRU1H7PcSE7Jt9g4U6ZUA4ikKfxiCDBJTuB) agreed not to build its own CAS steps; it adds a »Reši po korakih« button that opens this screen. Scan imports public/graph/math.js, plot.js, model.js — don't change their exports/AST kinds without telling.
- `preveri-aplikacijo.cjs --samo telefon` always fails (phone part needs the profile the desktop part creates); run the full script.

- Check-step side letters are KaTeX macros \sideL/\sideR rendered from keys scan.sideL/scan.sideR (sl L/D, en LHS/RHS …); any other renderer (iOS app) must define them.
- Open follow-ups: symbol pad group names in public/symbols.js are Slovenian in all languages; rational/chained inequalities go to AI.

Related: [[evklid-triple-review]] [[evklid-i18n]]
