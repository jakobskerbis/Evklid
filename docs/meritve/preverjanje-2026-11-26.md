# Matematično preverjanje na referenčnem naboru (2026-11-26)

## Povzetek
- Glavna številka: napačno potrjene trditve 0/471 (skener: skener s SymPy, kot ga vidi učenec; cilj 0, nižje je bolje), 95-% interval 0,0 % – 0,9 %
- Pomeni: koliko napačnih rešitev iz nabora bi učenec videl kot »Izračunano« ali »Dokazano«; zgornja meja intervala je pri 95-% zaupanju največji delež, ki ga meritev še dopušča, če bi bile trditve med seboj neodvisne (niso, glej Omejitve).
- Ne pomeni: da je preverjanje pravilno pri nalogah ali vrstah napak, ki jih nabor nima, ali pri rešitvah, ki jih AI zapiše drugače.

## Nabor
- Vir in različica: `test/fixtures/preverjanje/nabor-v2.json`, sha256 trditev `a2a3f6a4267e236000e6f6a5062024360aa37e0c127224fc05cbac59d4816d4e`; delež uradnih virov (RIC, DMFA, ZOTKS): 0 % (trditve so generirane)
- Kdo je določil pričakovani izid in kdaj: Referenčni nabor v2 (N-01, docs/preverjanje.md): prvih 384 trditev je enakih kot v v1, ostale so nove družine. Resnica iz konstrukcije. Vseh 636 novih trditev so pred zagonom preverjevalnikov na slepo (premešane, brez oznak) ocenili trije neodvisni pregledovalci (ločeni agenti AI brez kode Evklida, ne človeški strokovnjaki; 26. 11. 2026). Razhajanja: racun2-062 (5/5 + 5/5 = 2, ne 10/10 = 1) je pregledovalčeva napaka; racun2-084 in racun2-108 sta bili napaka nabora (−2^n namesto (−2)^n), popravljeni z oklepajem. Ustvari scripts/nabor-preverjanje.mjs; ne urejaj na roko.
- Skriti kontrolni del: ne; primeri so iz istega generatorja, kot ga uporablja razvoj (test/preverjanje-meritev.test.js)
- Sestava: 1020 trditev, 508 pravilnih in 512 napačnih ali robnih; 12 z mejo statusa (zaokrožen odgovor); 28 skupin: polinom 80, koren-nicle 20, priblizek 8, luknja 20, koren 20, neenacba 30, identiteta 30, odvod 30, integral 22, racun 44, limita 10, enote 11, periodicna 10, velika 6, skoraj 26, druge 17, eksp 38, log 38, abs 39, sistem 60, trig-id 40, odvod2 62, integral2 48, limita2 30, racun2 157, neenacba2 54, enote2 30, ekvivalentno 40

## Metoda
- Ukaz: `node scripts/meri-preverjanje.mjs --strogo --json docs/meritve/preverjanje-2026-11-26.json --porocilo docs/meritve/preverjanje-2026-11-26.md`
- Commit: `a7daf65a215f268bbe42223f867f5303efde8310`; brez modela AI; SymPy prek server/cas.js (motorja sympy in skener), skener-lokalno brez Pythona
- Stroj in okolje: Node v22.23.5, linux; Python 3.13.18, SymPy 1.14.0
- Ocenjevanje: program (razvrsti v scripts/meri-preverjanje.mjs) primerja status motorja z resnico iz nabora
- Interval: Wilsonov 95-% (pri 0 je zgornja meja 3,84/(n + 3,84)); spodnja meja zaokrožena navzdol, zgornja navzgor

## Izidi

### sympy (surov SymPy)

| Merilo | Vrednost | k/n | Imenovalec | 95-% interval | Cilj | Prej |
|---|---|---|---|---|---|---|
| Trditve z obliko za motor (štetje, ne vzorec) | 100,0 % | 1020/1020 | trditve nabora | – | – | – |
| Napačno potrjene (izračunano, dokazano) | 0,0 % | 0/512 | napačne trditve | 0,0 % – 0,8 % | 0 | – |
| Status nad upravičenim | 0,0 % | 0/12 | trditve z mejo statusa | 0,0 % – 24,3 % | 0 | – |
| Napačne s šibkim statusom (numerično, delno) | 1,0 % | 5/512 | napačne trditve | 0,4 % – 2,3 % | – | – |
| Zaznane napake | 98,4 % | 504/512 | napačne trditve | 96,9 % – 99,3 % | – | – |
| Lažni alarmi | 0,0 % | 0/508 | pravilne trditve | 0,0 % – 0,8 % | 0 | – |
| Pravilne potrjene (izračunano, dokazano) | 95,3 % | 484/508 | pravilne trditve | 93,0 % – 96,9 % | – | – |
| Pravilne s šibkim statusom (numerično, delno) | 4,3 % | 22/508 | pravilne trditve | 2,8 % – 6,5 % | – | – |
| Nepreverjene (in »v teku«) | 0,5 % | 5/1020 | ocenjene trditve | 0,2 % – 1,2 % | – | – |
| Pokritost: dokončna ocena (pravilna potrjena ali napaka zaznana) | 96,9 % | 988/1020 | ocenjene trditve | 95,6 % – 97,8 % | – | – |
| Izjeme preverjevalnika | 0,0 % | 0/1020 | ocenjene trditve | 0,0 % – 0,4 % | 0 | – |

Zahteve SymPy brez odgovora (rok, sesutje, ni na voljo): 0 (cilj 0).

### skener (skener s SymPy, kot ga vidi učenec)

| Merilo | Vrednost | k/n | Imenovalec | 95-% interval | Cilj | Prej |
|---|---|---|---|---|---|---|
| Trditve z obliko za motor (štetje, ne vzorec) | 92,1 % | 939/1020 | trditve nabora | – | – | – |
| Napačno potrjene (izračunano, dokazano) | 0,0 % | 0/471 | napačne trditve | 0,0 % – 0,9 % | 0 | – |
| Status nad upravičenim | 0,0 % | 0/10 | trditve z mejo statusa | 0,0 % – 27,8 % | 0 | – |
| Napačne s šibkim statusom (numerično, delno) | 0,0 % | 0/471 | napačne trditve | 0,0 % – 0,9 % | – | – |
| Zaznane napake | 99,2 % | 467/471 | napačne trditve | 97,8 % – 99,7 % | – | – |
| Lažni alarmi | 0,0 % | 0/468 | pravilne trditve | 0,0 % – 0,9 % | 0 | – |
| Pravilne potrjene (izračunano, dokazano) | 96,6 % | 452/468 | pravilne trditve | 94,5 % – 97,9 % | – | – |
| Pravilne s šibkim statusom (numerično, delno) | 3,4 % | 16/468 | pravilne trditve | 2,1 % – 5,5 % | – | – |
| Nepreverjene (in »v teku«) | 0,4 % | 4/939 | ocenjene trditve | 0,1 % – 1,1 % | – | – |
| Pokritost: dokončna ocena (pravilna potrjena ali napaka zaznana) | 97,9 % | 919/939 | ocenjene trditve | 96,7 % – 98,7 % | – | – |
| Izjeme preverjevalnika | 0,0 % | 0/939 | ocenjene trditve | 0,0 % – 0,5 % | 0 | – |

Zahteve SymPy brez odgovora (rok, sesutje, ni na voljo): 0 (cilj 0).

### skener-lokalno (skener brez SymPy)

| Merilo | Vrednost | k/n | Imenovalec | 95-% interval | Cilj | Prej |
|---|---|---|---|---|---|---|
| Trditve z obliko za motor (štetje, ne vzorec) | 92,1 % | 939/1020 | trditve nabora | – | – | – |
| Napačno potrjene (izračunano, dokazano) | 0,0 % | 0/471 | napačne trditve | 0,0 % – 0,9 % | 0 | – |
| Status nad upravičenim | 0,0 % | 0/10 | trditve z mejo statusa | 0,0 % – 27,8 % | 0 | – |
| Napačne s šibkim statusom (numerično, delno) | 0,8 % | 4/471 | napačne trditve | 0,3 % – 2,2 % | – | – |
| Zaznane napake | 98,1 % | 462/471 | napačne trditve | 96,4 % – 99,0 % | – | – |
| Lažni alarmi | 8,5 % | 40/468 | pravilne trditve | 6,3 % – 11,5 % | 0 | – |
| Pravilne potrjene (izračunano, dokazano) | 36,3 % | 170/468 | pravilne trditve | 32,0 % – 40,8 % | – | – |
| Pravilne s šibkim statusom (numerično, delno) | 53,2 % | 249/468 | pravilne trditve | 48,6 % – 57,7 % | – | – |
| Nepreverjene (in »v teku«) | 1,5 % | 14/939 | ocenjene trditve | 0,8 % – 2,5 % | – | – |
| Pokritost: dokončna ocena (pravilna potrjena ali napaka zaznana) | 67,3 % | 632/939 | ocenjene trditve | 64,2 % – 70,3 % | – | – |
| Izjeme preverjevalnika | 0,0 % | 0/939 | ocenjene trditve | 0,0 % – 0,5 % | 0 | – |

## Napake in neuspehi
- Napačno potrjene: 0 (motorji: sympy, skener, skener-lokalno)
- Napačne s šibkim statusom, sympy (5): skoraj-002 (numericno), skoraj-006 (numericno), skoraj-008 (numericno), skoraj-010 (numericno), skoraj-026 (numericno)
- Napačne s šibkim statusom, skener-lokalno (4): periodicna-004 (delno), periodicna-006 (delno), periodicna-010 (delno), druge-017 (delno)
- Lažni alarmi, skener-lokalno (40): log-001 (napaka), log-003 (napaka), log-005 (napaka), log-007 (napaka), log-011 (napaka), log-013 (napaka), log-015 (napaka), log-017 (napaka), log-021 (napaka), log-023 (napaka), log-025 (napaka), log-027 (napaka), log-031 (napaka), log-033 (napaka), log-035 (napaka), log-037 (napaka), racun2-013 (napaka), racun2-027 (napaka), racun2-043 (napaka), racun2-059 (napaka), racun2-118 (napaka), racun2-120 (napaka), racun2-122 (napaka), racun2-124 (napaka), racun2-126 (napaka), racun2-128 (napaka), racun2-130 (napaka), racun2-132 (napaka), racun2-134 (napaka), racun2-136 (napaka), racun2-138 (napaka), racun2-140 (napaka), racun2-142 (napaka), racun2-144 (napaka), racun2-146 (napaka), racun2-148 (napaka), racun2-150 (napaka), racun2-152 (napaka), racun2-154 (napaka), racun2-156 (napaka)
- Pravilne s šibkim statusom, sympy (22): priblizek-001 (numericno), priblizek-003 (numericno), priblizek-005 (numericno), priblizek-007 (numericno), enote-001 (numericno), enote-009 (numericno), periodicna-001 (numericno), periodicna-003 (numericno), periodicna-005 (numericno), periodicna-007 (numericno), periodicna-009 (numericno), skoraj-011 (numericno), skoraj-013 (numericno), skoraj-014 (numericno), skoraj-016 (numericno), skoraj-018 (numericno), skoraj-022 (numericno), druge-016 (numericno), enote2-007 (numericno), enote2-019 (numericno), enote2-021 (numericno), ekvivalentno-025 (numericno)
- Pravilne s šibkim statusom, skener (16): priblizek-001 (numericno), priblizek-003 (numericno), priblizek-005 (numericno), priblizek-007 (numericno), periodicna-001 (delno), periodicna-003 (delno), periodicna-005 (delno), periodicna-007 (delno), periodicna-009 (delno), skoraj-011 (numericno), skoraj-013 (numericno), skoraj-014 (numericno), skoraj-016 (numericno), skoraj-018 (numericno), skoraj-022 (numericno), druge-016 (delno)
- Pravilne s šibkim statusom, skener-lokalno (249): priblizek-001 (numericno), priblizek-003 (numericno), priblizek-005 (numericno), priblizek-007 (numericno), luknja-001 (numericno), luknja-003 (numericno), luknja-005 (numericno), luknja-007 (numericno), luknja-009 (numericno), luknja-011 (numericno), luknja-013 (numericno), luknja-015 (numericno), luknja-017 (numericno), luknja-019 (numericno), koren-001 (numericno), koren-003 (numericno), koren-005 (numericno), koren-007 (numericno), koren-009 (numericno), koren-011 (numericno), koren-013 (numericno), koren-015 (numericno), koren-017 (numericno), koren-019 (numericno), identiteta-009 (numericno), identiteta-011 (numericno), identiteta-013 (numericno), identiteta-015 (numericno), identiteta-017 (numericno), identiteta-023 (numericno), identiteta-027 (numericno), identiteta-029 (numericno), odvod-003 (numericno), odvod-005 (numericno), odvod-007 (numericno), odvod-009 (numericno), odvod-011 (numericno), odvod-013 (numericno), odvod-015 (numericno), odvod-017 (numericno), odvod-019 (numericno), odvod-023 (numericno), odvod-025 (numericno), odvod-027 (numericno), integral-001 (numericno), integral-003 (numericno), integral-005 (numericno), integral-007 (numericno), integral-009 (numericno), integral-011 (numericno), integral-013 (numericno), integral-015 (numericno), integral-017 (numericno), integral-019 (numericno), integral-021 (numericno), racun-027 (numericno), racun-029 (numericno), periodicna-001 (delno), periodicna-003 (delno), periodicna-005 (delno), periodicna-007 (delno), periodicna-009 (delno), skoraj-016 (numericno), skoraj-018 (numericno), skoraj-022 (numericno), druge-001 (numericno), druge-003 (numericno), druge-005 (numericno), druge-007 (numericno), druge-009 (numericno), druge-016 (delno), eksp-001 (numericno), eksp-003 (numericno), eksp-005 (numericno), eksp-007 (numericno), eksp-009 (numericno), eksp-011 (numericno), eksp-013 (numericno), eksp-015 (numericno), eksp-017 (numericno), eksp-019 (numericno), eksp-021 (numericno), eksp-023 (numericno), eksp-025 (numericno), eksp-027 (numericno), eksp-029 (numericno), eksp-031 (numericno), eksp-033 (numericno), eksp-035 (numericno), eksp-037 (numericno), log-009 (numericno), log-019 (numericno), log-029 (numericno), abs-001 (numericno), abs-004 (numericno), abs-006 (numericno), abs-008 (numericno), abs-010 (numericno), abs-012 (numericno), abs-014 (numericno), abs-016 (numericno), abs-018 (numericno), abs-020 (numericno), abs-022 (numericno), abs-024 (numericno), abs-026 (numericno), abs-028 (numericno), abs-030 (numericno), abs-032 (numericno), abs-034 (numericno), abs-036 (numericno), abs-038 (numericno), sistem-001 (delno), sistem-005 (delno), sistem-007 (delno), sistem-009 (delno), sistem-011 (delno), sistem-013 (delno), sistem-017 (delno), sistem-019 (delno), sistem-021 (delno), sistem-023 (delno), sistem-025 (delno), sistem-029 (delno), sistem-031 (delno), sistem-033 (delno), sistem-035 (delno), sistem-037 (delno), sistem-041 (delno), sistem-043 (delno), sistem-045 (delno), sistem-047 (delno), sistem-049 (delno), sistem-053 (delno), sistem-055 (delno), sistem-057 (delno), sistem-059 (delno), trig-id-001 (numericno), trig-id-003 (numericno), trig-id-005 (numericno), trig-id-007 (numericno), trig-id-009 (numericno), trig-id-011 (numericno), trig-id-013 (numericno), trig-id-015 (numericno), trig-id-017 (numericno), trig-id-019 (numericno), trig-id-021 (numericno), trig-id-023 (numericno), trig-id-025 (numericno), trig-id-027 (numericno), trig-id-029 (numericno), trig-id-031 (numericno), trig-id-033 (numericno), trig-id-035 (numericno), trig-id-037 (numericno), trig-id-039 (numericno), odvod2-003 (numericno), odvod2-005 (numericno), odvod2-007 (numericno), odvod2-009 (numericno), odvod2-011 (numericno), odvod2-017 (numericno), odvod2-019 (numericno), odvod2-021 (numericno), odvod2-023 (numericno), odvod2-025 (numericno), odvod2-027 (numericno), odvod2-033 (numericno), odvod2-035 (numericno), odvod2-037 (numericno), odvod2-039 (numericno), odvod2-041 (numericno), odvod2-043 (numericno), odvod2-049 (numericno), odvod2-051 (numericno), odvod2-057 (numericno), odvod2-059 (numericno), integral2-001 (numericno), integral2-003 (numericno), integral2-005 (numericno), integral2-007 (numericno), integral2-009 (numericno), integral2-011 (numericno), integral2-013 (numericno), integral2-015 (numericno), integral2-017 (numericno), integral2-019 (numericno), integral2-021 (numericno), integral2-023 (numericno), integral2-025 (numericno), integral2-027 (numericno), integral2-029 (numericno), integral2-031 (numericno), integral2-033 (numericno), integral2-035 (numericno), integral2-037 (numericno), integral2-039 (numericno), integral2-041 (numericno), integral2-043 (numericno), integral2-045 (numericno), integral2-047 (numericno), racun2-001 (numericno), racun2-003 (numericno), racun2-017 (numericno), racun2-031 (numericno), racun2-033 (numericno), racun2-047 (numericno), racun2-049 (numericno), racun2-063 (numericno), racun2-065 (numericno), neenacba2-001 (numericno), neenacba2-003 (numericno), neenacba2-005 (numericno), neenacba2-007 (numericno), neenacba2-009 (numericno), neenacba2-011 (numericno), neenacba2-013 (numericno), neenacba2-015 (numericno), neenacba2-017 (numericno), neenacba2-019 (numericno), neenacba2-021 (numericno), neenacba2-023 (numericno), neenacba2-025 (numericno), neenacba2-027 (numericno), neenacba2-029 (numericno), neenacba2-031 (numericno), neenacba2-033 (numericno), neenacba2-035 (numericno), neenacba2-037 (numericno), neenacba2-039 (numericno), neenacba2-041 (numericno), neenacba2-043 (numericno), neenacba2-045 (numericno), neenacba2-047 (numericno), neenacba2-049 (numericno), neenacba2-051 (numericno), neenacba2-053 (numericno), ekvivalentno-001 (numericno), ekvivalentno-007 (numericno), ekvivalentno-009 (numericno), ekvivalentno-011 (numericno), ekvivalentno-013 (numericno), ekvivalentno-015 (numericno), ekvivalentno-019 (numericno), ekvivalentno-033 (numericno), ekvivalentno-035 (numericno), ekvivalentno-037 (numericno), ekvivalentno-039 (numericno)

## Omejitve
- Trditve niso neodvisne: nastanejo iz 28 družin predlog, ki pogosto uspejo ali padejo skupaj (ena napaka v razčlenjevanju zadene vso družino). Intervali predpostavljajo neodvisne trditve, zato so preozki; prava negotovost je večja.
- Nabor je generiran iz konstrukcije (enačbe, odvodi, integrali, računi, enote …), ne iz pravih učenčevih nalog; rešitve so v obliki, kot jo vrne AI skenerja, ne kot bi jo zapisal učenec.
- Meja za napačno potrjene velja samo za vrste napak v naboru. Dokazi Lean (PV-06 in naprej) in pokritost trditev po delih aplikacije (PV-04) tu niso zajeti.

## Stroški
Klicev API: 0, cena: 0 $ (meritev ne kliče modela).
