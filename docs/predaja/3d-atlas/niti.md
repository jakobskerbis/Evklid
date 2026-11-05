# 3D atlas: three extra threads (from the atlas thread, 4 Nov 2026)

j allowed splitting the atlas into several threads (cmsg_011HYzNBAS5HRU1H7PcSE7JtWZPuX8TeTjj6DXUZTNmFE6). The atlas thread (cmsg_011HYzNBAS5HRU1H7PcSE7JtJvw81e9aNVtwH3sy7FQCwc) keeps phases 0–2: shared kit, /3d page and hub, body atlas, organs and organ systems, female organs (cap 335 $). Whole atlas cap 650 $.

## Common instructions (paste into each thread)

Repo jakobskerbis/Evklid, branch from fresh main. Read /mnt/project-files/evklid/3d-atlas/3d.md: the 3D model builder contract, authoritative. The shared kit, the /3d page, the hub and docs/3d.md arrive in a PR from the atlas thread; do not add docs/3d.md or kit files yourself. Plan j approved: https://claude.ai/artifact/Fhiz6ws6NsaDrivm97mAc1. Target look: the demo in /mnt/project-files/evklid/3d-atlas/nacrt-3d-atlas.html, but more detailed and more polished (Astra screenshots for comparison in /mnt/project-files/evklid/3d-atlas/astra/).

Ship only `public/3d/modeli/<area>/*.js` builders, `public/3d/modeli/<area>/index.js` and your own `test/3d-<area>.test.js` (validates `info`/`zgradi` with three from node_modules, triangle and draw-call budgets from 3d.md). Check visually with your own uncommitted harness (Playwright chromium with `--use-angle=swiftshader --enable-unsafe-swiftshader`). Content by Opus (never Sonnet), science checked, Slovenian school terms, every part has `ime` + `opis`. Triple review per docs/pregled.md, merge your own PR. Rate guard from the optimizer: at most about 4 heavy agents in parallel; check get_session rate_limit_info before each wave (five_hour allowed_warning → wait for resetsAt). After the kit PR is merged on main, add `public/sim/katalog.js` topics for your models (engine id `3d-<id>`). Report cost_usd to the optimizer thread at the end.

## 1) »3D celice« (cap 110 $), area `celice`

Živalska, rastlinska, bakterijska, kvasovka; virusi (bakteriofag T4, SARS-CoV-2, HIV); nevron, gladka mišična celica, skeletno mišično vlakno z zoomom na sarkomero, srčna mišična celica, eritrocit, levkociti (izbira vrste), trombocit, epitelna celica z mikrovili, čašasta celica, osteocit, maščobna celica, spermij, jajčece, paličica in čepek, palisadna celica, celica zapiralka, koreninski lasek, ksilem in floem, ameba, paramecij, evglena. Cut-away views; primerjava živalske in rastlinske celice; scale bar in µm/nm.

## 2) »3D kemija in fizika« (cap 100 $), areas `kemija`, `fizika`

Atom (Bohrov model in elektronski oblak, Z 1–36); orbitale s, p, d, f izračunane iz vodikove valovne funkcije (izbira n, l, m; barva faze; izoploskev); periodni sistem v 3D (tap → atom); okoli 40 molekul (kroglice in palčke / kalota, vezni koti, prosti elektronski pari, VSEPR oblika); DNK (B-oblika, pravilne mere), RNK; beljakovina iz PDB (CC0, vgrajeni poenostavljeni podatki); kristalne mreže (NaCl, CsCl, diamant, grafit, bcc, fcc, hcp, led); polja (točkasti naboj, dipol, kondenzator, paličasti magnet, raven vodnik, tuljava; silnice izračunane, preizkusni naboj).

## 3) »3D matematika, vesolje in procesi« (cap 100 $), areas `matematika`, `vesolje`, `procesi`

Geometrijska telesa (kocka, kvader, prizme, piramide, valj, stožec, krogla, prisekana telesa: mreža se razpre, prerez z ravnino, prostornina in površina z drsniki); grafi z = f(x, y) z drsniki in plastnicami; sončni sistem (preklop resničnega merila razdalj in velikosti, javno dobre teksture NASA ali teksture v kodi); letni časi, Lunine mene in mrki; procesi v celici (mitoza, mejoza, fotosinteza, sinteza beljakovin s predvajalnikom korakov).
