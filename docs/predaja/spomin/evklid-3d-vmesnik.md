---
name: evklid-3d-vmesnik
description: 3D world UI thread (4 Nov 2026): new /3d hub + viewer page layout, branch claude/project-thread-xnxrap, open items and cell-upgrade estimate
metadata:
  type: project
  modified: 2026-11-04T20:48:16.208Z
---
Thread »Izboljšaj vmesnik 3D sveta« cmsg_011HYzNBAS5HRU1H7PcSE7JtUcDzQgqrbqw3UzWWtw2WNq owns the /3d UI (hub in public/3d/stran.js, viewer chrome `opts.stran` in pregledovalnik.js, 3d.css); atlas thread owns atlas.js, organ.js, modeli/**, »Uči se« (its stran.js change: `vgrajeno`/`starsu` in nazaj() and hub back link hidden when embedded — keep on rebase).

PR #379 MERGED 4 Nov 13:27 (j OK; 19.7 $): hub search (iskanje.js), area chips, shelves, thumbnails public/3d/slicice/*.webp via `node scripts/3d-slicice.cjs`, recent `evklid.3d.nedavno`, model page panel right/below, zoom, prev/next, fullscreen, Evklid keyboard on /3d. Docs in docs/3d.md »Hub and viewer page«. Big look change → j sees screenshots before merge.

PR #399 MERGED 4 Nov ~14:30 (~4.1 $): free trackball rotation around centre in viewer (public/3d/vrtenje.js zavrtiOkoli, scena.js opt `prostoVrtenje`, Ponastavi → `pokonci`); body atlas keeps upright orbit (offered j to change). Auto-mode denies force-push/reset --hard: build a new local branch from origin branch + cherry-pick + merge main, push to designated branch.

PR #433 + #441 MERGED 4 Nov (thread cmsg_011HYzNBAS5HRU1H7PcSE7JtHLGJdzELrBDfM9xzLV2tx4): REPLACE #405 scale rule. j's »hologram« = start-size outline, always visible (in fit even when bigger); on size change scene keeps old scale (group.scale) then eases to new fit (korak, `korakBrezGumba`) = illusion of growth; grid + axes continuous, axis numbers true cm. telesa.js has x/y/z coordinate axes (x toward viewer, y right, z up; origin back-left corner for box bases, else base centre). Kit: `model.povzetek()` chip top-left (V, P), slider name+value visible while dragging; izbira >8 options = custom dark listbox (no native select).

PR #405 MERGED 4 Nov ~15:08 (~4.8 $): telesa.js keeps scale (Dfiks) during dimension sliders (superseded by #433) + faint start-size outline `obris-zacetka`; uci-se.js 3D overlay width = visualViewport (guess fix for j's clipped right edge in Android app, NOT reproducible in Chromium) — waiting for j to confirm in app.

PR #415 MERGED 4 Nov ~15:45 (~2.8 $): rotation mode button (scena.js nacinVrtenja/poveziGumbVrtenja, localStorage evklid.3d.vrtenje, icons rotate-3d/globe) in viewer + atlas (atlas pogled() pokonci:true). PR #419 MERGED 4 Nov ~16:09 (~3.2 $): third mode »hoja« (first-person; OrbitControls off, target kept in front, W A S D/arrows/wheel/pinch, held Naprej/Nazaj pad .k3-hoja from poveziGumbVrtenja; leaving flies back outside).

PR #421 MERGED 4 Nov ~16:31 (~4.9 $): slider drag → viewer root `.k3-drsam`, only active range visible; + 6 Opus-review fixes. Reviewers must be OPUS (docs/token-rules.md), never Sonnet.

Gotcha: test/besedila.test.js forbids the word »model« in Slovenian UI strings (AI jargon rule) → use »Prejšnji«, »Opis«, »Poišči v 3D svetu«.

Cell visual upgrade (j asked 12:25): estimate 6 key cells 30–40 $, all 29 90–120 $; card sent to decisions thread, recommended all 29 after reset; j CHOSE 4 Nov 12:31 the 6 key cells now (animal, plant, bacterial, neuron, erythrocyte, SARS-CoV-2; ~30–40 $, pause past 95 %), in a cells thread. Related: [[evklid-3d-atlas]] [[evklid-brez-robov]].
