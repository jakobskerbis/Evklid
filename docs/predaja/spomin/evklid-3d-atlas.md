---
name: evklid-3d-atlas
description: 3D atlas build (j 4 Nov 2026 »naredi celoten atlas zdaj«): threads, caps, pipeline, contract file, licence exclusions, open j decisions
metadata:
  type: project
  modified: 2026-11-04T04:28:55.236Z
---
≤ ~4 heavy agents, five_hour guard, triple review per PR, cost_usd to optimizer per PR.

Plan https://claude.ai/artifact/Fhiz6ws6NsaDrivm97mAc1

Threads: atlas (F0–F2 + female organs; cap 335 $) cmsg_011HYzNBAS5HRU1H7PcSE7JtJvw81e9aNVtwH3sy7FQCwc, branch claude/project-thread-tsujy3. »3D celice« cmsg_011HYzNBAS5HRU1H7PcSE7Jt1f4nGJyLvzbhdP835bgX1q (110 $). »3D kemija in fizika« cmsg_011HYzNBAS5HRU1H7PcSE7JtHXKbhfmkHeb1HLVevviUYs (done). »3D matematika, vesolje, procesi« cmsg_011HYzNBAS5HRU1H7PcSE7JtBUd5RrMH3X1Lv1AgBVAXsE (done).

Contract docs/3d.md (kit scena.js + pregledovalnik.js, builders modeli/<area>/<id>.js, three 0.186.1).

Pipeline: Blender 4.2.3 tarball; git clone Z-Anatomy/Models-of-human-anatomy (Startup.blend in Z-Anatomy.zip, TA2.csv Latin); scripts/atlas/izvozi-z-anatomy.py → raw GLB per layer; scripts/atlas/stisni.sh (gltf-transform dedup + meshopt); scripts/atlas/pripravi-podatke.py → public/3d/atlas-strukture.json. 3157 structures, 8 layers (okostje, sklepi, misice, zile, limfni, zivcevje, organi, koza), 16 MB. Female organs: scripts/atlas/zenski-organi.py.

Licence exclusions (possible NC origin): Cochlea, Vestibule, Renal pelvis, Intrarenal arteries/veins.

j rules (4 Nov): models as beautiful and accurate as possible, quality before count (phones stay smooth); if budget limits quality, tell j concretely what extra $ buys. Walls/membranes/layers need visible thickness (never paper-thin, solid cut edges). Body: phone set telo/ (COLOR_0 baked AO, factor 1) + desktop telo-hd/ (factor 2.2, 3.5 M tris, 30 MB).

PR #332 merged 4 Nov 09:45 (squash 5e022c4): /3d hub, kit, body atlas, telo + telo-hd. Organs: j rejected code-built organs → real meshes via scripts/atlas/izvozi-organe.py, public/3d/organ.js, modeli/organi-3d/, side-by-side with Astra. Optimizer now »Optimizator 2« cmsg_011HYzNBAS5HRU1H7PcSE7Jt8EQahEA2WPJwMnPr2UBLVB (11:34); decisions for j as cards via message_thread to cmsg_011HYzNBAS5HRU1H7PcSE7Jt6zBtvecoWzGJyRTNXXvC1w. »Uči se« merged PR #376; organs brain (MRI) + eye (HuBMAP) + heart merged PR #383 (4 Nov 13:30, 223 $ session); code-built uho/koža/kost/mišica dropped (scratchpad), redo later. #406 pljuča/ledvica (HRA + own pelvis)/jetra (+ own vein trees), #414 povečava merged 4 Nov 15:40, session 255 $. STOPPED until 11 Nov reset. Kidney cut still has glossy hollows. After-reset plan: /mnt/project-files/predaja/atlas-izboljsave.md (incl. step 3a real body cross-section, j 21:40). #445 quiz X-ray 5 s (j 21:36) waits for j OK. Brain cortex: CC0 MRI pial surfaces (openneuro-derivatives S3 ds000001-fmriprep freesurfer surf/lh.pial).

Open: expert name check before Jan. »3D celice« done (#311 29 cells, #337 katalog; #388 visual upgrade of 6 key cells with shader relief + wet sheen, ~19 $; other 23 cells could get the same upgrade later).

Sources: always the best possible open one (j 11:08), see [[evklid-best-sources]]; candidates per organ: HuBMAP HRA (CC BY 4.0), TotalSegmentator CT (CC BY 4.0), OpenNeuro MRI (CC0).

Related: [[evklid-sim-ideas]], [[evklid-simulations]], [[evklid-lab]], [[evklid-quality-bar]], [[evklid-best-sources]].

ZOOM CHAIN (j 14:38+14:56: after 11 Nov make micro sections AND the 6 organs more realistic: baked PBR surface textures, wet sheen, cut-face tissue texture, ~10–15 $/organ) (j 4 Nov 13:36 »Naredi to za vse v atlasu ko bo čas«): organ/structure → tissue section → cell via part field `povecava: "<model-id>"` and a »Poglej pod povečavo« button. Done: organ-mreznica, -mesicki, -nefron, -jetrni-reznjic, linked from all 6 organs. Later for every atlas layer (bone→osteon, muscle→sarcomere, skin, vessels, nerves).

UPGRADE PLAN for all 3D models after 11 Nov (4 Nov 18:40, ~350–465 $, steps 0–10 by impact): /mnt/project-files/predaja/atlas-izboljsave.md; no GLB has image textures yet.
