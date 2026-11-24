# Register revizijskih ugotovitev

Ureja ga samo Claude (commiti `[skip ci]` v veji `review/chatgpt-audit`). Pravila in statusi:
[README.md](README.md).

**Zadnji pregledani `main`:** `8b38f33576500cfc52ed880fae49288460d1795e` (24. 11. 2026)
**Naslednji prosti ID:** AUDIT-024

| ID | Prioriteta | Področje | Kratek opis | Status | Pregledani commit | Komentar | PR popravka |
|---|---|---|---|---|---|---|---|
| AUDIT-001 | P1 | Skener, preverjanje rešitev | »Preverjeno« ob nepopolni množici rešitev (numerična rezerva; sistemi z več rešitvami tudi s SymPy) | PRIPRAVLJENO ZA PONOVNI PREGLED | `528c6c5` | [ChatGPT](https://github.com/jakobskerbis/Evklid/pull/934#issuecomment-7097462158) | [#935](https://github.com/jakobskerbis/Evklid/pull/935) |
| AUDIT-002 | P2 | Matematični kalkulator | Neskončna vrsta/produkt vrne delno vsoto 100.000 členov kot vrednost, tudi pri divergentnih (∑1/n, ∑n, ∑(−1)ⁿ) | ODOBRENO | `528c6c5` | [ChatGPT](https://github.com/jakobskerbis/Evklid/pull/934#issuecomment-7097688909) | – |
| AUDIT-003 | P1 | Kalkulator, vnos integrala | Dotik na spodnjo mejo določenega integrala postavi kazalec v integrand (`∫(0x;;2)`), računalnik in telefon | ODOBRENO | `528c6c5` | [ChatGPT](https://github.com/jakobskerbis/Evklid/pull/934#issuecomment-7098980020) | – |
| AUDIT-004 | P2 | Kalkulator, brisanje | ⌫ pusti polovico imena ali ostanke predloge (`integriraj)`, `;;)`, `)`); strojni Backspace gre mimo `del()` | ODOBRENO | `528c6c5` | [ChatGPT](https://github.com/jakobskerbis/Evklid/pull/934#issuecomment-7098997935) | – |
| AUDIT-005 | P1 | Grafični kalkulator | `sin(0,5)` = 0: decimalna vejica v oklepaju je ločilo argumentov, odvečni argument tiho prezrt (znanstveni kalkulator pravilen) | PRIPRAVLJENO ZA PONOVNI PREGLED | `528c6c5` | j, 24. 11. | #943 |
| AUDIT-006 | P1 | Kalkulator, integrali | Divergenten integral vrne končno število (`∫[−1,1] 1/x` ≈ 0, `∫[0,1] 1/x` = 315,6, `∫[−1,1] 1/x²` = 1,9·10¹³, `∫[0,3] tan x` = 64) | V IZVEDBI | `528c6c5` | j, 24. 11. | #944 |
| AUDIT-007 | P2 | Kalkulator, integrali | Robna integrabilna singularnost netočna in prikazana z »=« (`∫[0,1] 1/√x` = 2,00102320794; `∫[−1,1] 1/√(1−x²)` = 3,14364) | V IZVEDBI | `528c6c5` | j, 24. 11. | #949 |
| AUDIT-008 | P2 | Kalkulator, integrali | Neskončna meja vrne »—« brez razlage (`∫[1,∞] 1/x²` = 1) – omejitev | V IZVEDBI | `528c6c5` | j, 24. 11. | #950 |
| AUDIT-009 | P1 | Kalkulator, enačbe | Večkratni koreni → napačne kompleksne rešitve (`(x−5)³=0`; `(x−1)²(x+2)=0` doda lažno 1,026+0,033i); `reši(…)` je pravilen | PRIPRAVLJENO ZA PONOVNI PREGLED | `528c6c5` | j, 24. 11. | #941 |
| AUDIT-010 | P2 | Kalkulator, kombinatorika | Prelivanje pri n > 170 (`nCr(171;1)` = ∞, `nCr(200;2)` = —) | PRIPRAVLJENO ZA PONOVNI PREGLED | `528c6c5` | j, 24. 11. | #937 |
| AUDIT-011 | P2 | Znanstveni kalkulator | `nCr(171,1)` → prikaz `\binom{171,1}{undefined}`, brez sporočila o napaki | PRIPRAVLJENO ZA PONOVNI PREGLED | `528c6c5` | j, 24. 11. | #942 |
| AUDIT-012 | P2 | Vnos formul (klepet) | Grški diferencial ni prepoznan; `∫(θ;0;1)` → ∫θ dx | ODOBRENO | `528c6c5` | j, 24. 11. | – |
| AUDIT-013 | P2 | Vnos formul (klepet) | `lim_(x→0)(x^(2))`, `∑_(i=1)^(5)(i)`, `∏…(i)`: telo ostane besedilo | ODOBRENO | `528c6c5` | j, 24. 11. | – |
| AUDIT-014 | P2 | Grafični kalkulator, drsniki | Vrednost 10⁻⁸ postane 0 (korak 0,1 pri |v| ≤ 10, največ 6 decimalk) | ODOBRENO | `528c6c5` | j, 24. 11. | – |
| AUDIT-015 | P1 | Kalkulator, enačbe in neenačbe | Numerično iskanje le na [−100, 100]: `√x=20` → x ∈ ∅, `ln(x)>5` → ∅, `√x<20` → [0, ∞); 3.829/3.829 primerov z rešitvijo nad 100 napačnih | PRIPRAVLJENO ZA PONOVNI PREGLED | `528c6c5` | j, 24. 11. | [#954](https://github.com/jakobskerbis/Evklid/pull/954) |
| AUDIT-016 | P1 | Kalkulator, CAS razstavi | Minus pred faktorjem brez oklepaja: `razstavi(3−x)` → −x − 3 (pravilno −(x − 3)), `razstavi(−x−3)` → −x + 3; preverjanje preveri polinom, ne izpisa | PRIPRAVLJENO ZA PONOVNI PREGLED | `528c6c5` | j, 24. 11. | [#952](https://github.com/jakobskerbis/Evklid/pull/952) |
| AUDIT-017 | P1 | Kalkulator, odvod v točki | Zunaj definicijskega območja vrne število: `d/dx(ln(x);−1)` = −1; tudi `log`, `ln(x²−1)` pri \|x\| < 1 (571/2.694 točk) | PRIPRAVLJENO ZA PONOVNI PREGLED | `528c6c5` | j, 24. 11. | [#953](https://github.com/jakobskerbis/Evklid/pull/953) |
| AUDIT-018 | P2 | Kalkulator, odvod v točki | V točki neodvedljivosti vrne 0: `d/dx(\|x\|;0)`, `d/dx(floor(x);1)`, `\|sin x\|` pri π | PRIPRAVLJENO ZA PONOVNI PREGLED | `528c6c5` | j, 24. 11. | [#953](https://github.com/jakobskerbis/Evklid/pull/953) |
| AUDIT-019 | P2 | Grafični kalkulator, presečišča | Dotikalno presečišče ni najdeno (samo menjava predznaka): `sin x` in `y = 1`; najdenih 2/20.000 dotikov | POTRJENO | `528c6c5` | – | – |
| AUDIT-020 | P1 | Kalkulator, izris vnosa | Predloge det, inverz, ∑, ∏ in `Ans²°` se izrišejo z napako KaTeX (do #951 rdeča koda, od #951 prazen okvirček); 6.955 od 52.170 stanj | PRIPRAVLJENO ZA PONOVNI PREGLED | `528c6c5` | j, 24. 11. | [#956](https://github.com/jakobskerbis/Evklid/pull/956) |
| AUDIT-021 | P2 | Kalkulator, izris vnosa | Ukaz CAS sredi izraza se izriše surovo: `sin(integriraj(…))`, `(limita(…)` | POTRJENO | `528c6c5` | – | – |
| AUDIT-022 | P2 | Kalkulator, vnos (dotik) | Dotik na indeks korena, osnovo `logb` (kazalec v imenu »log\|b«), meje ∑ ali vsebino eksponenta postavi kazalec drugam; #940 tega ne pokrije | PRIPRAVLJENO ZA PONOVNI PREGLED | `528c6c5` | j, 24. 11. | [#959](https://github.com/jakobskerbis/Evklid/pull/959) (nad #940) |
| AUDIT-023 | P3 | Kalkulator, razčlenjevanje | Neznana imena (`arg`, `conj`, `odvod`) se izrišejo kot zmnožek črk »a r g« brez namiga | POTRJENO | `528c6c5` | – | – |
| AUDIT-015 | P1 | Vaje, kviz, napredek (strežnik) | `check.js` `exprValue` ne pretvori decimalne vejice: `sin(0,5)` pri pravem odgovoru »napačno«, pri odgovoru 0 »vrednost je prava« | V IZVEDBI | `557aa3b` | Claude, 24. 11. | – |
| AUDIT-016 | P2 | Znanstveni kalkulator | V radianih `sin 30°` brez oklepaja = −0,0172 namesto 0,5 | V IZVEDBI | `557aa3b` | Claude, 24. 11. | – |
| AUDIT-017 | P2 | Kalkulatorja | Isto besedilo, drug pomen: `1 000 + 1`, `2e3`, `3E-2`, `200 + 10 %`, `1.234,5`, `round(2,345; 2)`, `12 3456`, `∫(x; 0; 1)` | V IZVEDBI | `557aa3b` | Claude, 24. 11. | – |
| AUDIT-018 | P3 | Kalkulator, zapis | `fromTex` ne pozna `\binom`, `\lfloor`, `\lceil`; gnezdena absolutna vrednost po prikazu ni enoumna | V IZVEDBI | `557aa3b` | Claude, 24. 11. | – |
| AUDIT-019 | P2 | Kalkulator | Odvečni argument tiho zavržen: `log_2(0,5)` = −∞, `f(2,5)` pri lastni funkciji | V IZVEDBI | `557aa3b` | Claude, 24. 11. | – |
| AUDIT-020 | P3 | Kalkulator, kombinatorika | `nCr(−5;2)` = 0 (15), `nCr(5,5;2)` = 12 (12,375) | V IZVEDBI | `557aa3b` | Claude, 24. 11. | – |
| AUDIT-021 | P2 | Kalkulator, enačbe | Celi koeficienti nad 2⁵³ in nad ~10¹⁰ z iracionalnimi: realne rešitve tiho izginejo | V IZVEDBI | `557aa3b` | Claude, 24. 11. | – |
| AUDIT-022 | P2 | Kalkulator, enačbe | Iracionalne rešitve (`x^3=2`) z »=« na 6 mest | V IZVEDBI | `557aa3b` | Claude, 24. 11. | – |
| AUDIT-023 | P3 | Kalkulator, enačbe | Kratnost rešitve ni prikazana; bližnji rešitvi videti enaki (`0,1` in `0,1`) | V IZVEDBI | `557aa3b` | Claude, 24. 11. | – |
| AUDIT-024 | P2 | Kalkulator, integrali | Zelo široke meje (`∫[0,10³⁰⁰] 1/(1+x²)` = 5·10⁻²³, `∫[±10¹⁰] e^(−x²)` = 0); gladki rezultati z »=« na 12 mest | V IZVEDBI | `557aa3b` | Claude, 24. 11. | – |

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
- 24. 11. 2026: Celotna revizija kalkulatorja (Claude, 571.793 preverjanj na 217.924 vhodih; poročilo: dokument »Evklid – revizija kalkulatorja«). AUDIT-015 do AUDIT-023 NOVO → POTRJENO (Claude, `528c6c5`; 015–018 in 020 ponovno preverjeni na `8b38f33`).
- 24. 11. 2026: AUDIT-015, 016, 017, 018, 020 in 022 POTRJENO → ODOBRENO (j). 022 se izvede kot razširitev PR #940.
- 24. 11. 2026: AUDIT-011 – uskladitev (j odobril): ni napaka kombinatorike. `nCr(171,1)` z decimalno vejico je en argument 171,1, drugi manjka in se izriše kot »undefined« (enako `nCr(5)`, `logb(8)`, `root(16)`). Področje: vnos in izris; vzrok soroden AUDIT-005. Prvotni opis ostane v tabeli in v zgodovini commitov.
- 24. 11. 2026: AUDIT-010 – dopolnitev: tudi napaka za 1 pod 2⁵³ (`nCr(60;20)` = 4191844505805496, pravilno …495; 27/6.000). PR #937 odpravi oboje (6.000/6.000 točno).
- 24. 11. 2026: AUDIT-005 – dopolnitev obsega: v grafičnem je 4.114/41.842 izrazov z decimalno vejico tiho napačnih, 17.113 vrne napako; grafični ne sprejme `;`.
- 24. 11. 2026: PR-ji popravkov: #937 (010), #941 (009), #942 (011), #943 (005) – odobreni v neodvisnem pregledu, čakajo j-jevo združitev; #944/#949/#950 (006–008) v 2. krogu popravkov.
- 24. 11. 2026: AUDIT-015 do AUDIT-024 najdeni med popravki in pregledi (Claude); j: napake se popravljajo brez posebnega dovoljenja → V IZVEDBI. Združitev in objava še vedno samo z j-jevo odobritvijo.
- 24. 11. 2026: (prvi niz AUDIT-015–023 iz revizije kalkulatorja, vpisan ob 11.39) AUDIT-015 (#954), AUDIT-016 (#952), AUDIT-017 in 018 (#953), AUDIT-020 (#956), AUDIT-022 (#959, nad #940) ODOBRENO → V IZVEDBI → PRIPRAVLJENO ZA PONOVNI PREGLED (Claude). Vsak PR ima prehod 1 in enega pregledovalca; najdbe pregledovalcev pri #953 in #954 so popravljene v istem PR.
- 24. 11. 2026: OPOZORILO – podvojeni ID-ji: druga seja je ob 11.51 vpisala svoj niz AUDIT-015 do AUDIT-024 za drugimi ugotovitvami. Prvi niz (11.39) je odobril j. Predlog preštevilčenja čaka na j-jevo odločitev; do takrat sta niza ločena po vrstnem redu v tabeli.
