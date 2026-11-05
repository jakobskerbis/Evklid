---
name: evklid-logo
description: Logo redesign thread (4 Nov 2026): current mismatch (in-app »elementi« vs graduation-cap install icons), 5 concepts A–E, waiting for j's pick
metadata:
  type: project
  modified: 2026-11-04T08:26:14.609Z
---

Thread "Zasnuj logo za Evklid" (cmsg_011HYzNBAS5HRU1H7PcSE7Jt4ztRq836xvJyNvDVDCmDCr), started 2026-11-04.

- Today: in-app logo = icon `elementi` (scripts/build-icons.js CUSTOM, Elements I.1), but favicon/install icons (public/icons/*.png, mobile/assets/*.png, assets/evklid.ico) are a generic graduation cap. New logo must replace all of them.
- 15 concepts (A Elementi, B »e« circle+line, C Euclid algorithm squares, D compass, E speech bubble+triangle; added on j «Še primerov»: F Ε with dot, G Pythagoras I.47, H owl from two circles+triangle, I icosahedron, J Ionic capital; «Še idej»: K golden ratio, L triangle+incircle (no centre dot: eye-in-triangle reads religious), M sparkle from arcs, N meander E, O laurel wreath+triangle) on artifact https://claude.ai/artifact/KHgjUG1KALBA2aNaijoy1q, source /mnt/project-files/evklid/logo/predlogi-logo.html.
- Big look change: nothing goes live until j picks (letter or mix). Then: refine, generate all sizes (Android adaptive + monochrome, iOS, favicon 16/32, ico), screenshots before PR. Rule: web and mobile must match ([[evklid-ui-design]]).
- j 4 Nov 08:38: wants directions Greek ornament, sparkle, golden ratio AND »instantly recognisable as a science app«. Round 2 on same artifact: P atom+sparkle, Q golden atom, R Erlenmeyer flask (triangle body)+sparkle (recommended), S flask with Greek pattern, T benzene hexagon+sparkle, U atom+triangle. 3-orbit atom looks like the React logo: avoid.
- Rounds 3–5 (08:42–08:53, j's flask/right-triangle/Euclid-theorem ideas V–Z4, T1–T5) were rejected by j.
- j 08:56 »Ne«, »Nekaj drugega« → rejected T round. Round 6: K1 prism (Pink Floyd risk), K2 DNA, K3 planet with ring + sparkle (recommended), K4 sine from circle (weak, reads »ov«), K5 pendulum, K6 crystal cube. 34 older ideas in collapsed section on the page.
- j 09:02 »K6 in K4 dodelaj« → round 7: K4a sine graph, K4b wave in circle, K6a salt crystal oblique cube big/small ions (recommended), K6b body-centred, K6c solid 3-face cube (small sizes).
- j 09:05 »A in c6 dodelaj« read as K6a + K6c → round 8: K6a2 line salt crystal (oblique cube, Cl big / Na small ions, halos), K6a3 + light faces, K6c2 solid same cube (pair with K6a2, recommended), K6c3 isometric solid. Function crystal2() in the page source.
- 09:11 j: »izberi tistega, ki bo najprimernejši« → chose K6a2 (line, in-app icon `kristal`) + K6c2 (solid, all install icons). PR #328 (branch claude/project-thread-dspck5): scripts/logotip.cjs generates every PNG/ICO/favicon.svg, test/logotip.test.js, docs/oblikovanje.md »Logotip«. Gradient #1F4BC8→#3A6BE6. Android launcher icon changes only with a new APK build. PWA shortcut-*.png still old cyan style (not logo).
- 2026-11-04 ~09:30 PR #328 MERGED (review clean, safe zones measured OK). Launcher icon on Android needs the next APK build (tell APK thread when it builds). Logo thread done unless j wants tweaks.
- 4 Nov 15:30 PR #408 merged: /favicon.ico serves assets/evklid.ico, every page links icons with ?v=kristal (bump ?v= on next logo change; test/logotip.test.js checks). APK build 7 (08:17) predates logo → launcher icon needs APK build 8 (j: expo.dev → Android, main, profile direct; paste link in Račun → Aplikacija za Android).
