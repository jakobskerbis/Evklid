# Register revizijskih ugotovitev

Ureja ga samo Claude (commiti `[skip ci]` v veji `review/chatgpt-audit`). Pravila in statusi:
[README.md](README.md).

**Zadnji pregledani `main`:** `528c6c52eedf6183cca86c0a4c1c1d892661ce1a` (23. 11. 2026)
**Naslednji prosti ID:** AUDIT-004

| ID | Prioriteta | Področje | Kratek opis | Status | Pregledani commit | Komentar | PR popravka |
|---|---|---|---|---|---|---|---|
| AUDIT-001 | P1 | Skener, preverjanje rešitev | »Preverjeno« ob nepopolni množici rešitev (numerična rezerva; sistemi z več rešitvami tudi s SymPy) | ČAKA NA MOJO ODOBRITEV | `528c6c5` | [ChatGPT](https://github.com/jakobskerbis/Evklid/pull/934#issuecomment-7097462158) | – |
| AUDIT-002 | P2 | Matematični kalkulator | Neskončna vrsta/produkt vrne delno vsoto 100.000 členov kot vrednost, tudi pri divergentnih (∑1/n, ∑n, ∑(−1)ⁿ) | ČAKA NA MOJO ODOBRITEV | `528c6c5` | [ChatGPT](https://github.com/jakobskerbis/Evklid/pull/934#issuecomment-7097688909) | – |
| AUDIT-003 | P1 | Kalkulator, vnos integrala | Dotik na spodnjo mejo določenega integrala postavi kazalec v integrand (`∫(0x;;2)`), računalnik in telefon | ČAKA NA MOJO ODOBRITEV | `528c6c5` | [ChatGPT](https://github.com/jakobskerbis/Evklid/pull/934#issuecomment-7098980020) | – |

## Zgodovina statusov

Vsaka sprememba statusa: datum, ID, star → nov status, kdo, razlog ali dokaz (povezava).

- 23. 11. 2026: register ustvarjen.
- 23. 11. 2026: AUDIT-001 NOVO → POTRJENO → ČAKA NA MOJO ODOBRITEV (Claude). Ponovljeno brez in s SymPy 1.14; dodatno najden sistem z več rešitvami, ki ga SymPy preskoči.
- 23. 11. 2026: AUDIT-002 NOVO → POTRJENO → ČAKA NA MOJO ODOBRITEV (Claude). Ponovljeno; dodatno ∑n = 5000050000, ∑(−1)ⁿ = 0, neskončni produkt brez oznake približka.
- 23. 11. 2026: AUDIT-003 NOVO → POTRJENO → ČAKA NA MOJO ODOBRITEV (Claude). Ponovljeno v brskalniku (Chromium, 1280 in 360 px z dotikom); vzrok v `caretFromPoint()`.
