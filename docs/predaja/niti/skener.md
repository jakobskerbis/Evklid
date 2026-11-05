# Predaja: skener pred pilotom (4. 11. 2026, nit cmsg_011HYzNBAS5HRU1H7PcSE7Jt6JFybRhmUNnSJ1ZbhNAjKz)

Narejeno (cap 60 $, »porabi še 3 %«):
1. PR #429 (ZDRUŽEN 4. 11. ~18.00 UTC) opozorilo v kameri (ostrina/svetloba/odsev/nagib), public/scan/kakovost.js, prag umerjen na 32 slabih fotkah. Pregleda 2+3 opravljena.
2. Branje 32 slabih fotk (Sonnet 5.5 + READ_PROMPT, sodnik Opus na polni ločljivosti): 6 OK, 22 delno, 1 napačno, 3 neberljive. Poročilo /mnt/project-files/evklid/skeniranje-test/rezultati-2026-11-04.md, tabela ocena-branja-slabe-fotke-1.md.
3. 20 jailbreakov (Haiku 5.5 s pravim sistemskim pozivom kot navodilom): 0 uspešnih. jailbreak/ v isti mapi.

Odprto za po 11. 11.:
- READ_PROMPT (server/scan.js): vse naloge na strani; podatki naloge (točke, pol, asimptota, ničla) v ločeno polje; prvotna naloga, ne vmesni korak; zapis za C/V/binomski simbol/!, množice, intervale, dvojne neenačbe. AI sprememba = 2 Opus pregleda. Preizkus: ista 32 slika, isti postopek (orodja v scratchpadu se izgubijo; postopek je opisan v rezultati-…md).
- Prag LIMITS.blur preveriti na pravem telefonu (video mehkejši od fotografije).
- Ščit inštruktorja: pri [SYSTEM UPDATE] + običajni nalogi zavrne tudi nalogo (bi jo moral rešiti); SŠ dijaku 2+2 »na prstih«. Sprememba poziva = kartica j.
- Pravi API test jailbreakov in branja (ta nit ni imela API ključa).
- Fotografije so zasebne (j-jeva roka, soba): nikoli v repozitorij.

## Nadaljevanje 4. 11. 18.05–18.27 UTC (j »Kaj zdaj« → preostanek 3 %)
- PR #430 ZDRUŽEN: READ_PROMPT bere vse naloge, prvotno nalogo, polje »given« (podatki naloge), nCr/nPr/!, točna osnova log (log_10); podatki pod nalogo in k AI rešitvi; odgovor AI po eno dejstvo v vrstici; »Vprašaj Evklida« formula v $…$; »Nariši graf« deli pri \iff in ne riše samega x > 0 ob krivulji.
- Ponovno branje 32 fotk: podatki in več nalog zdaj pravilno; ostane: enačbe podnalog na 16, 20 (po spremembi pregleda še ni ponovno preverjeno), 25 c).
- Skupna ocena stroška niti ≈ 55 $ (cap 60 $). STOP do 11. 11.

## Ponovni preizkus na main po #430 (4. 11. ~22.00 UTC, optimizator, brez sprememb kode)
Isti postopek (Sonnet 5.5 + READ_PROMPT z main, sodnik Opus proti tabeli resnice).
- PRED: OK 6 · delno 22 · napačno 1 · neberljivo 3
- PO:   OK 16 · delno 13 · napačno 0 · neberljivo 3
Ostane: (1) enačba za delom s parametri še manjka na 13, 16, 20, 21, 30; (2) podatki izpuščeni ali napačno prebrani na 10–12 (c=0), 13 (A(2,13) → A(3,13)), 15 (√(x−b) → √(x+b)).
Tabela: /mnt/project-files/evklid/skeniranje-test/ocena-branja-po-430.md, branja: branja-po-430.jsonl. Strošek ≈ 4 $.
