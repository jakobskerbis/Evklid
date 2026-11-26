# Matematično preverjanje na referenčnem naboru (2026-11-26)

## Povzetek
- Glavna številka: napačno potrjene trditve 0/471 (skener, kot ga vidi učenec; cilj 0, nižje je bolje), 95-% interval 0,0 % – 0,8 %; vsi motorji skupaj 0
- Pomeni: koliko napačnih rešitev iz nabora bi učenec videl kot »Izračunano« ali »Dokazano«; zgornja meja intervala je največji delež, ki ga meritev še dopušča.
- Ne pomeni: da je preverjanje pravilno pri nalogah ali vrstah napak, ki jih nabor nima, ali pri rešitvah, ki jih AI zapiše drugače.

## Nabor
- Vir in različica: `test/fixtures/preverjanje/nabor-v2.json`, sha256 `2ef6bb855547cf7accb9e1bee2bab589aeecb8b2c720e245990c486a9b3255f3`; 1020 trditev; delež uradnih virov (RIC, DMFA, ZOTKS): 0 % (trditve so generirane)
- Kdo je določil pričakovani izid in kdaj: Referenčni nabor v2 (N-01, docs/preverjanje.md): prvih 384 trditev je enakih kot v v1, ostale so nove družine. Resnica iz konstrukcije. Vseh 636 novih trditev so pred zagonom preverjevalnikov na slepo (premešane, brez oznak) ocenili trije neodvisni pregledovalci (ločeni agenti AI brez kode Evklida, ne človeški strokovnjaki; 26. 11. 2026). Razhajanja: racun2-062 (5/5 + 5/5 = 2, ne 10/10 = 1) je pregledovalčeva napaka; racun2-084 in racun2-108 sta bili napaka nabora (−2^n namesto (−2)^n), popravljeni z oklepajem. Ustvari scripts/nabor-preverjanje.mjs; ne urejaj na roko.
- Skriti kontrolni del: ne; primeri so iz istega generatorja, kot ga uporablja razvoj (test/preverjanje-meritev.test.js)

## Metoda
- Ukaz: `node scripts/meri-preverjanje.mjs --json <izid>.json --porocilo <porocilo>.md --prej <prejsnja>.json`
- Commit: `126b13244dcde1da51f5c8fa5e9fb28464de31c6`; brez modela AI; SymPy prek server/cas.js (motor sympy in skener), skener-lokalno brez Pythona
- Ocenjevanje: program (razvrsti v scripts/meri-preverjanje.mjs) primerja status motorja z resnico iz nabora
- Interval: Wilsonov 95-% (pri 0 je zgornja meja 3,84/(n + 3,84)); velja le za vrste napak, ki jih nabor vsebuje

## Izidi

### sympy

| Merilo | Vrednost | k/n | Imenovalec | 95-% interval | Cilj | Prej |
|---|---|---|---|---|---|---|
| Pokritost nabora | 100,0 % | 1020/1020 | trditve nabora | 99,6 % – 100,0 % | – | – |
| Napačno potrjene | 0,0 % | 0/512 | napačne trditve | 0,0 % – 0,7 % | 0 | – |
| Status nad upravičenim | 0,0 % | 0/12 | trditve z mejo statusa | 0,0 % – 24,3 % | 0 | – |
| Napačne s šibkim statusom (numerično, delno) | 1,0 % | 5/512 | napačne trditve | 0,4 % – 2,3 % | – | – |
| Zaznane napake | 98,4 % | 504/512 | napačne trditve | 96,9 % – 99,2 % | – | – |
| Lažni alarmi | 0,0 % | 0/508 | pravilne trditve | 0,0 % – 0,8 % | 0 | – |
| Nepreverjene (in »v teku«) | 0,5 % | 5/1020 | ocenjene trditve | 0,2 % – 1,1 % | – | – |
| Izjeme preverjevalnika | 0,0 % | 0/1020 | ocenjene trditve | 0,0 % – 0,4 % | 0 | – |

### skener

| Merilo | Vrednost | k/n | Imenovalec | 95-% interval | Cilj | Prej |
|---|---|---|---|---|---|---|
| Pokritost nabora | 92,1 % | 939/1020 | trditve nabora | 90,2 % – 93,6 % | – | – |
| Napačno potrjene | 0,0 % | 0/471 | napačne trditve | 0,0 % – 0,8 % | 0 | – |
| Status nad upravičenim | 0,0 % | 0/10 | trditve z mejo statusa | 0,0 % – 27,8 % | 0 | – |
| Napačne s šibkim statusom (numerično, delno) | 0,0 % | 0/471 | napačne trditve | 0,0 % – 0,8 % | – | – |
| Zaznane napake | 99,2 % | 467/471 | napačne trditve | 97,8 % – 99,7 % | – | – |
| Lažni alarmi | 0,0 % | 0/468 | pravilne trditve | 0,0 % – 0,8 % | 0 | – |
| Nepreverjene (in »v teku«) | 0,4 % | 4/939 | ocenjene trditve | 0,2 % – 1,1 % | – | – |
| Izjeme preverjevalnika | 0,0 % | 0/939 | ocenjene trditve | 0,0 % – 0,4 % | 0 | – |

### skener-lokalno

| Merilo | Vrednost | k/n | Imenovalec | 95-% interval | Cilj | Prej |
|---|---|---|---|---|---|---|
| Pokritost nabora | 92,1 % | 939/1020 | trditve nabora | 90,2 % – 93,6 % | – | – |
| Napačno potrjene | 0,0 % | 0/471 | napačne trditve | 0,0 % – 0,8 % | 0 | – |
| Status nad upravičenim | 0,0 % | 0/10 | trditve z mejo statusa | 0,0 % – 27,8 % | 0 | – |
| Napačne s šibkim statusom (numerično, delno) | 0,8 % | 4/471 | napačne trditve | 0,3 % – 2,2 % | – | – |
| Zaznane napake | 98,1 % | 462/471 | napačne trditve | 96,4 % – 99,0 % | – | – |
| Lažni alarmi | 8,5 % | 40/468 | pravilne trditve | 6,3 % – 11,4 % | 0 | – |
| Nepreverjene (in »v teku«) | 1,5 % | 14/939 | ocenjene trditve | 0,9 % – 2,5 % | – | – |
| Izjeme preverjevalnika | 0,0 % | 0/939 | ocenjene trditve | 0,0 % – 0,4 % | 0 | – |

## Napake in neuspehi
- Napačne s šibkim statusom, sympy (5): skoraj-002 (numericno), skoraj-006 (numericno), skoraj-008 (numericno), skoraj-010 (numericno), skoraj-026 (numericno)
- Napačne s šibkim statusom, skener-lokalno (4): periodicna-004 (delno), periodicna-006 (delno), periodicna-010 (delno), druge-017 (delno)
- Lažni alarmi, skener-lokalno (40): log-001 (napaka), log-003 (napaka), log-005 (napaka), log-007 (napaka), log-011 (napaka), log-013 (napaka), log-015 (napaka), log-017 (napaka), log-021 (napaka), log-023 (napaka), log-025 (napaka), log-027 (napaka), log-031 (napaka), log-033 (napaka), log-035 (napaka), log-037 (napaka), racun2-013 (napaka), racun2-027 (napaka), racun2-043 (napaka), racun2-059 (napaka), racun2-118 (napaka), racun2-120 (napaka), racun2-122 (napaka), racun2-124 (napaka), racun2-126 (napaka), racun2-128 (napaka), racun2-130 (napaka), racun2-132 (napaka), racun2-134 (napaka), racun2-136 (napaka), racun2-138 (napaka), racun2-140 (napaka), racun2-142 (napaka), racun2-144 (napaka), racun2-146 (napaka), racun2-148 (napaka), racun2-150 (napaka), racun2-152 (napaka), racun2-154 (napaka), racun2-156 (napaka)

## Omejitve
- Nabor je generiran iz konstrukcije (enačbe, odvodi, integrali, računi, enote …), ne iz pravih učenčevih nalog; rešitve so v obliki, kot jo vrne AI skenerja, ne kot bi jo zapisal učenec.
- Meja za napačno potrjene velja samo za vrste napak v naboru. Dokazi Lean (PV-06 in naprej) in pokritost trditev po delih aplikacije (PV-04) tu niso zajeti.

## Stroški
Klicev API: 0, cena: 0 $ (meritev ne kliče modela).
