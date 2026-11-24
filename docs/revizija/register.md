# Register revizijskih ugotovitev

Ureja ga samo Claude (commiti `[skip ci]` v veji `review/chatgpt-audit`). Pravila in statusi:
[README.md](README.md).

**Zadnji pregledani `main`:** `528c6c52eedf6183cca86c0a4c1c1d892661ce1a` (24. 11. 2026)
**Naslednji prosti ID:** AUDIT-015

| ID | Prioriteta | Področje | Kratek opis | Status | Pregledani commit | Komentar | PR popravka |
|---|---|---|---|---|---|---|---|
| AUDIT-001 | P1 | Skener, preverjanje rešitev | »Preverjeno« ob nepopolni množici rešitev (numerična rezerva; sistemi z več rešitvami tudi s SymPy) | PRIPRAVLJENO ZA PONOVNI PREGLED | `528c6c5` | [ChatGPT](https://github.com/jakobskerbis/Evklid/pull/934#issuecomment-7097462158) | [#935](https://github.com/jakobskerbis/Evklid/pull/935) |
| AUDIT-002 | P2 | Matematični kalkulator | Neskončna vrsta/produkt vrne delno vsoto 100.000 členov kot vrednost, tudi pri divergentnih (∑1/n, ∑n, ∑(−1)ⁿ) | ODOBRENO | `528c6c5` | [ChatGPT](https://github.com/jakobskerbis/Evklid/pull/934#issuecomment-7097688909) | – |
| AUDIT-003 | P1 | Kalkulator, vnos integrala | Dotik na spodnjo mejo določenega integrala postavi kazalec v integrand (`∫(0x;;2)`), računalnik in telefon | ODOBRENO | `528c6c5` | [ChatGPT](https://github.com/jakobskerbis/Evklid/pull/934#issuecomment-7098980020) | – |
| AUDIT-004 | P2 | Kalkulator, brisanje | ⌫ pusti polovico imena ali ostanke predloge (`integriraj)`, `;;)`, `)`); strojni Backspace gre mimo `del()` | ODOBRENO | `528c6c5` | [ChatGPT](https://github.com/jakobskerbis/Evklid/pull/934#issuecomment-7098997935) | – |
| AUDIT-005 | P1 | Grafični kalkulator | `sin(0,5)` = 0: decimalna vejica v oklepaju je ločilo argumentov, odvečni argument tiho prezrt (znanstveni kalkulator pravilen) | ODOBRENO | `528c6c5` | j, 24. 11. | – |
| AUDIT-006 | P1 | Kalkulator, integrali | Divergenten integral vrne končno število (`∫[−1,1] 1/x` ≈ 0, `∫[0,1] 1/x` = 315,6, `∫[−1,1] 1/x²` = 1,9·10¹³, `∫[0,3] tan x` = 64) | ODOBRENO | `528c6c5` | j, 24. 11. | – |
| AUDIT-007 | P2 | Kalkulator, integrali | Robna integrabilna singularnost netočna in prikazana z »=« (`∫[0,1] 1/√x` = 2,00102320794; `∫[−1,1] 1/√(1−x²)` = 3,14364) | ODOBRENO | `528c6c5` | j, 24. 11. | – |
| AUDIT-008 | P2 | Kalkulator, integrali | Neskončna meja vrne »—« brez razlage (`∫[1,∞] 1/x²` = 1) – omejitev | ODOBRENO | `528c6c5` | j, 24. 11. | – |
| AUDIT-009 | P1 | Kalkulator, enačbe | Večkratni koreni → napačne kompleksne rešitve (`(x−5)³=0`; `(x−1)²(x+2)=0` doda lažno 1,026+0,033i); `reši(…)` je pravilen | ODOBRENO | `528c6c5` | j, 24. 11. | – |
| AUDIT-010 | P2 | Kalkulator, kombinatorika | Prelivanje pri n > 170 (`nCr(171;1)` = ∞, `nCr(200;2)` = —) | ODOBRENO | `528c6c5` | j, 24. 11. | – |
| AUDIT-011 | P2 | Znanstveni kalkulator | `nCr(171,1)` → prikaz `\binom{171,1}{undefined}`, brez sporočila o napaki | ODOBRENO | `528c6c5` | j, 24. 11. | – |
| AUDIT-012 | P2 | Vnos formul (klepet) | Grški diferencial ni prepoznan; `∫(θ;0;1)` → ∫θ dx | ODOBRENO | `528c6c5` | j, 24. 11. | – |
| AUDIT-013 | P2 | Vnos formul (klepet) | `lim_(x→0)(x^(2))`, `∑_(i=1)^(5)(i)`, `∏…(i)`: telo ostane besedilo | ODOBRENO | `528c6c5` | j, 24. 11. | – |
| AUDIT-014 | P2 | Grafični kalkulator, drsniki | Vrednost 10⁻⁸ postane 0 (korak 0,1 pri |v| ≤ 10, največ 6 decimalk) | ODOBRENO | `528c6c5` | j, 24. 11. | – |

## Zgodovina statusov

Vsaka sprememba statusa: datum, ID, star → nov status, kdo, razlog ali dokaz (povezava).

- 23. 11. 2026: register ustvarjen.
- 23. 11. 2026: AUDIT-001 NOVO → POTRJENO → ČAKA NA MOJO ODOBRITEV (Claude). Ponovljeno brez in s SymPy 1.14; dodatno najden sistem z več rešitvami, ki ga SymPy preskoči.
- 23. 11. 2026: AUDIT-002 NOVO → POTRJENO → ČAKA NA MOJO ODOBRITEV (Claude). Ponovljeno; dodatno ∑n = 5000050000, ∑(−1)ⁿ = 0, neskončni produkt brez oznake približka.
- 23. 11. 2026: AUDIT-003 NOVO → POTRJENO → ČAKA NA MOJO ODOBRITEV (Claude). Ponovljeno v brskalniku (Chromium, 1280 in 360 px z dotikom); vzrok v `caretFromPoint()`.
- 23. 11. 2026: AUDIT-004 NOVO → POTRJENO → ČAKA NA MOJO ODOBRITEV (Claude). Ponovljeno v brskalniku; velja tudi za `∫(` in `d/dx(`.
- 23. 11. 2026: AUDIT-001 ČAKA NA MOJO ODOBRITEV → ODOBRENO (j) → V IZVEDBI → PRIPRAVLJENO ZA PONOVNI PREGLED (Claude). Popravek v [#935](https://github.com/jakobskerbis/Evklid/pull/935).
- 24. 11. 2026: AUDIT-002, AUDIT-003, AUDIT-004 ČAKA NA MOJO ODOBRITEV → ODOBRENO (j). Vsak dobi svojo vejo in PR.
- 24. 11. 2026: README §2 pravilo 3 zoženo na popravke iz revizije (j).
- 24. 11. 2026: AUDIT-005 do AUDIT-014 (ugotovitve iz j-jevega navodila) NOVO → POTRJENO → ODOBRENO (Claude preveril na `528c6c5`, pričakovane vrednosti s SymPy 1.14; j odobril izvedbo). Poročilo: projektni dokument `analize/revizija-kalkulator-2026-11-24.md`.
- 24. 11. 2026: Hitrost kazalca v dolgih izrazih (`predogled-vnosa.js`) ni nova prijava – že zapisano v PR #715.
- 24. 11. 2026: AUDIT-003 in AUDIT-004 preverjena na istem SHA, koda nespremenjena; j odobril izvedbo → ODOBRENO.
