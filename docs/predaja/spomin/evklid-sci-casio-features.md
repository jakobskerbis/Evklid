---
name: evklid-sci-casio-features
description: Scientific calculator PR #359 (4 Nov 2026): GRA angle unit, °′″ DMS, memory M, I_n/A^n, ratio (sorazmerje) solver — where the code is and the rules
metadata:
  type: project
  modified: 2026-11-04T11:43:46.124Z
---

PR #359 merged 2026-11-04 (thread »Dopolni znanstveni način kalkulatorja«), PR A of the keyboard/calculator handover /mnt/project-files/predaja/tipkovnica.md.

- Angle unit: sci.js `st.angle` = deg|rad|grad (old saved `deg:false` reads as rad). math.js `compile` ctx `grad` (wins over `deg`); TRIG takes the unit factor u. Exact values at multiples of a right angle (cos 90° = 0, tan 90° = NaN) in all units incl. graph mode, only for |q| < 2³¹. scisolve.js unitOf/PERIOD/ANGLE_SUP (gradians shown as ^{\mathrm{g}}). Calculus always radians. Graph mode stays DEG/RAD.
- DMS: scicore.prepare turns 30°15′20″ into (30°+15′+20″) with hidden vars G_{min}/G_{sec}; ′ ″ count as minutes/seconds only after a digit (f′(2) stays a derivative). dmsOf() for output; key °′″ is contextual; auto-DMS only in DEG.
- Memory: 2nd ( = M+, 2nd ) = M−, 2nd Ans = MR, »⋯« group mem with MC; M is a normal var in st.vars.
- Tools: matrix ops 11 = I_n, 12 = A^n (toolscore M.identity/M.pow); eq_ kind "ratio" = »Sorazmerje« (not »Razmerje«: a : b = c : d is sorazmerje in Slovenian school maths), toolscore solveRatio.
- Open: complex numbers in GRA/DEG are radians. PR B (spreadsheet, sequences in graph, dice/coin experiments) not done.

Related: [[evklid-graph-calculator]]
