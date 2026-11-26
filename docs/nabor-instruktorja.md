# Neodvisni nabor inštruktorja (K-06, K-16)

Načrt dviga kakovosti po reviziji (j odobril 26. 11. 2026), poglavji 7 in 8: nabor z vnaprej določenimi
odgovori, ki jih ni napisal sistem, ki ga merimo. Merila: MAT 2.000 (K-06a), FIZ in KEM 1.000 (K-06b), BIO ≥ 500
(K-16); v vsakem ≥ 30 % nalog iz uradnih virov z uradnimi rešitvami; 20 % skrit kontrolni del; 0 referenčnih
odgovorov iz inštruktorja. Zelen test ni strokovna potrditev: pove le, da sestava ustreza pravilom spodaj.

## Viri

| vir | odgovor | v repozitoriju |
|---|---|---|
| Splošna matura RIC 2021–2026 (MAT OR in VR, FIZ, KEM, BIO; pole in navodila za ocenjevanje z ric.si) | uradna navodila za ocenjevanje | samo šifrirano (© Državni izpitni center, vse pravice pridržane) |
| Generatorji nalog Vadnice (slovenske poti OŠ 6.–9., SŠ 1.–4., tekmovanja; brez EXB, IN, UNI) | izračuna koda generatorja | (generator, tema, raven, seme) in odgovor; besedilo se ob zagonu ustvari znova |
| Napačne rešitve iz generatorjev (MAT 400, FIZ/KEM 200) | pravilen odgovor iz kode, vrsta napake iz generatorja | kot zgoraj, z učenčevim napačnim rezultatom |

Prepis uradnih nalog: Opus po pravilih v zasebni mapi projekta (`k06-nabor/OBLIKA-PREPISA.md`): vsaka podnaloga je
postavka z enim preverljivim odgovorom, prepisanim iz navodil za ocenjevanje. Postavka, za katero navodila nimajo
jasnega odgovora, ali pa je odgovor razbran iz risbe, izpeljan ali je sam risba (`odgovor_negotov`), ne gre v nabor
(prepisovalec ne rešuje sam). Naloge s sliko imajo besedilni opis slike in oznako
`slika: nujna`; poročilo meritve jih šteje posebej.

## Sestava (različica 1, 26. 11. 2026)

| nabor | postavk | uradnih (delež) | uradni viri | iz generatorjev | od tega napačne rešitve | skritih | tem |
|---|---|---|---|---|---|---|---|
| MAT (K-06a) | 2.000 | 652 (32,6 %) | matura OR 295, VR 71 (2021–2026); NPZ 6. r. 139, NPZ 9. r. 147 (2022–2026) | 1.348 | 400 | 402 | 208 |
| FIZ in KEM (K-06b) | 1.000 | 367 (36,7 %) | matura FIZ 2024–2025 (3 roki), KEM 2024–2025 (3 roki) | 633 | 200 | 205 | 183 |
| BIO (K-16) | 500 | 201 (40,2 %) | matura BIO 2023 in 2025 | 299 | 0 | 104 | 93 |

Prepisanih je 37 pol in 1.369 postavk; 98 jih ni v naboru (odgovor razbran iz risbe ali izmerjen na sliki, odgovor je
risba, ali pa je opis slike izdal odgovor), dodatno izpadejo ponovljeni deli B mature VR. Podrobna sestava po ravni,
vrsti in viru je v `sestava.json`. Prepis je na vzorcu 83 postavk neodvisno preveril drug model (poročilo
`docs/meritve/prepis-nabora-instruktorja-2026-11-26.md`): 0 napak v besedilu, 2 manjši napaki v odgovoru (popravljeni).

## Skriti kontrolni del

V vsakem sloju (nabor × uradno ali generator) gre v skriti del toliko celih skupin, da je skritih vsaj 20 % postavk.
Skupina je uradna naloga z vsemi podnalogami ali cel generator, zato skrite naloge niso različice razvojnih. Vrstni
red skupin določi HMAC-SHA256 s ključem `NABOR_KLJUC`; brez ključa ni mogoče ugotoviti, katere naloge so skrite.
Skriti del se uporablja samo za poročila ob izdaji, nikoli za izboljšave poziva ali kode.

## Datoteke (`test/fixtures/instruktor-nabor/`)

- `sestava.json`: objavljena sestava (po predmetu, viru, vrsti, ravni, število tem), sha256 vseh treh delov in
  id-ji razvojnih uradnih postavk (oznaka pole in naloge, brez besedila).
- `razvoj-generatorji.json`: razvojni del iz generatorjev (javen).
- `razvoj-uradno.enc`: razvojni del uradnih nalog, AES-256-GCM (`scripts/preizkus3-sifra.mjs`), ključ `NABOR_KLJUC`.
- `skrito.enc`: skriti kontrolni del (uradne in generatorske postavke), isti ključ.

Ključ `NABOR_KLJUC` (32 bajtov base64) je v zasebni mapi projekta, ne v repozitoriju. Za meritev v GitHub Actions ga
j doda kot skrivnost repozitorija (enako kot `PREIZKUS3_KLJUC`); do tedaj meritve tečejo lokalno.

## Gradnja in preverjanje

```
NABOR_KLJUC=… node scripts/nabor-instruktorja.mjs --uradno <mapa s prepisi> --izhod test/fixtures/instruktor-nabor
node --test test/nabor-instruktorja.test.js          # brez ključa: sestava, ponovljivost, glave šifer
NABOR_KLJUC=… node --test test/nabor-instruktorja.test.js   # še sha256 in uradni odgovori
```

## Omejitve

- Naloge iz generatorjev je napisal isti razvojni proces kot Vadnico (avtor Claude); neodvisen je le odgovor (koda,
  ne inštruktor). Neodvisen preračun s SymPy je naloga PV-10. Del uradnih nalog je zato glavno merilo.
- Uradne naloge so maturitetne (SŠ); OŠ pokrivajo samo generatorji, dokler ne dodamo NPZ in tekmovanj DMFA/ZOTKS.
- Prepis je naredil model; vzorec prepisov (vsaj 5 %) pred prvo meritvijo primerja s polo drug model, poročilo navede
  delež napak prepisa. Človeški pregled vzorca je j premaknil na čas po prvem plačilu.
