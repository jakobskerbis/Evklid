# Neodvisni nabor inštruktorja (K-06, K-16)

Načrt dviga kakovosti po reviziji (j odobril 26. 11. 2026), poglavji 7 in 8: nabor z vnaprej določenimi
odgovori, ki jih ni napisal sistem, ki ga merimo. Merila: MAT 2.000 (K-06a), FIZ in KEM 1.000 (K-06b), BIO ≥ 500
(K-16); v vsakem ≥ 30 % nalog iz uradnih virov z uradnimi rešitvami; 20 % skrit kontrolni del; 0 referenčnih
odgovorov iz inštruktorja. Zelen test ni strokovna potrditev: pove le, da sestava ustreza pravilom spodaj.

## Viri

| vir | odgovor | v repozitoriju |
|---|---|---|
| Splošna matura RIC 2021–2026 (MAT OR in VR, FIZ, KEM, BIO) in NPZ MAT 6. in 9. razred 2022–2026 (pole in navodila za ocenjevanje z ric.si) | uradna navodila za ocenjevanje | samo šifrirano (© Državni izpitni center, vse pravice pridržane) |
| Generatorji nalog Vadnice (slovenske poti OŠ 6.–9., SŠ 1.–4., tekmovanja; brez EXB, IN, UNI) | izračuna koda generatorja | (generator, tema, raven, seme), odgovor in prstni odtis besedila; besedilo se ob zagonu ustvari znova |
| Napačne rešitve iz generatorjev (MAT 400, FIZ/KEM 200) | pravilen odgovor iz kode, vrsta napake iz generatorja | kot zgoraj, z učenčevim napačnim rezultatom |

Prepis uradnih nalog: Opus po pravilih v zasebni mapi projekta (`k06-nabor/OBLIKA-PREPISA.md`): vsaka podnaloga je
postavka z odgovorom, prepisanim iz navodil za ocenjevanje. Ena postavka ima lahko več delov odgovora (podvprašanja
brez lastne oznake) ali odgovor v besedilu (`tip: besedilo`), ki ga mora oceniti ocenjevalec. Postavka, za katero
navodila nimajo jasnega odgovora, ali pa je odgovor razbran iz risbe, izpeljan ali je sam risba (`odgovor_negotov`), ne
gre v nabor (prepisovalec ne rešuje sam). Naloge s sliko imajo besedilni opis slike in oznako `slika` (`ne`, `opisana`,
`nujna`); `sestava.json` jih šteje v `uradne_po_sliki`, poročilo meritve pa jih mora poročati posebej.

## Sestava (različica 1, 26. 11. 2026)

| nabor | postavk | uradnih (delež) | uradni viri | iz generatorjev | od tega napačne rešitve | skritih | tem |
|---|---|---|---|---|---|---|---|
| MAT (K-06a) | 2.000 | 652 (32,6 %) | matura OR 295 (2021–2026), VR 71 (2023–2026, samo del C); NPZ 6. r. 139, NPZ 9. r. 147 (2022–2026) | 1.348 | 400 | 408 | 208 |
| FIZ in KEM (K-06b) | 1.000 | 367 (36,7 %) | matura FIZ 2025 (2 roka), KEM 2024–2025 (3 roki) | 633 | 200 | 205 | 183 |
| BIO (K-16) | 500 | 201 (40,2 %) | matura BIO 2023 in 2025 | 299 | 0 | 103 | 93 |

Prepisanih je 34 izpitnih rokov (58 pol) in 1.369 postavk. 98 jih ni v naboru (odgovor razbran iz risbe ali izmerjen
na sliki, odgovor je risba, ali pa je opis slike izdal odgovor), 49 je ponovljenih delov B mature VR (enaki kot pri
OR istega roka), 2 sta ponovitvi iz drugega leta (RIC je nalogo ponovil): ostane 1.220. Podrobna sestava po ravni,
vrsti, viru in sliki je v `sestava.json`. Prepis je na vzorcu 83 postavk preveril drug model iste družine (Claude
Fable, prepisoval je Claude Opus; poročilo `docs/meritve/prepis-nabora-instruktorja-2026-11-26.md`): 0 napak v
besedilu, 2 napaki v odgovoru in 1 opis slike, ki je izdal odgovor. Popravljene so samo postavke iz vzorca; v
preostalem naboru je pričakovanih okoli 30 podobnih napak v odgovoru (glej poročilo).

## Skriti kontrolni del

V vsakem sloju (nabor × uradno ali generator) gre v skriti del toliko celih skupin, da je skritih vsaj 20 % postavk.
Skupina je uradna naloga z vsemi podnalogami ali cel generator, zato skrite naloge niso različice razvojnih. Vrstni
red skupin določi HMAC-SHA256 s podključem iz `NABOR_KLJUC`, semena nalog iz generatorjev pa drug podključ.
Skriti del se uporablja samo za poročila ob izdaji, nikoli za izboljšave poziva ali kode.

Kaj je res skrito:
- Uradne skrite naloge: brez ključa ni mogoče ugotoviti, katere so (javni so samo števci, ne id-ji razvojnih nalog).
- Naloge iz generatorjev: brez ključa ni mogoče ponoviti skritih nalog (seme), ugotoviti pa se da, kateri
  generatorji so skriti: v naboru so vsi primerni generatorji, javna koda in javni razvojni del pa pokažeta, kateri
  manjkajo. Skriti del iz generatorjev zato varuje pred prilagajanjem na konkretne naloge, ne na cel generator; glavna
  kontrola so skrite uradne naloge.
- Kdor ima ključ, lahko odšifrira tudi skriti del. Da ga ne uporablja za izboljšave, je dogovor, ne tehnična zapora.

## Datoteke (`test/fixtures/instruktor-nabor/`)

- `sestava.json`: objavljena sestava (po predmetu, viru, vrsti, ravni, število tem) in sha256 vseh treh delov.
- `razvoj-generatorji.json`: razvojni del iz generatorjev (javen), s prstnim odtisom besedila vsake naloge.
- `razvoj-uradno.enc`: razvojni del uradnih nalog, AES-256-GCM (`scripts/preizkus3-sifra.mjs`), ključ `NABOR_KLJUC`.
- `skrito.enc`: skriti kontrolni del (uradne in generatorske postavke), isti ključ.

Ključ `NABOR_KLJUC` (32 bajtov base64) je v zasebni mapi projekta, ne v repozitoriju. Za meritev v GitHub Actions ga
j doda kot skrivnost repozitorija (enako kot `PREIZKUS3_KLJUC`); do tedaj meritve tečejo lokalno.

## Gradnja in preverjanje

```
NABOR_KLJUC=… node scripts/nabor-instruktorja.mjs --uradno <mapa s prepisi> --izhod test/fixtures/instruktor-nabor
node --test test/nabor-instruktorja.test.js          # brez ključa: sestava, ponovljivost, glave šifer
NABOR_KLJUC=… node --test test/nabor-instruktorja.test.js   # še sha256 in uradni odgovori
NABOR_KLJUC=… node scripts/nabor-instruktorja.mjs --odsifriraj <vhod.enc> /tmp/<izhod>.json   # nikoli v repozitorij
```

Test brez ključa ponovi vse javne naloge iz generatorjev in primerja besedilo (prstni odtis) ter odgovor. Če kdo
spremeni generator tako, da isto seme da drugo nalogo, test pade. Popravek je ponovna gradnja, za katero sta potrebna
ključ in zasebni prepisi (mapa projekta `k06-nabor/`), zato jo naredi seja, ki ima dostop do mape projekta.

## Pravila za meritev inštruktorja (pred prvo meritvijo)

Meritev na tem naboru (ločen PR, plačljivi klici v mesečni meji 60 $) mora:
- naloge dati inštruktorju kot prosto besedilo, nikoli prek toka vaje v aplikaciji (tam bi lahko videl odgovor);
- konstante, ki so pri postavki samo v opombi (list konstant), dodati v besedilo naloge;
- vnaprej določiti točkovanje postavk z več deli odgovora (vse ali nič ali po delih) in ocenjevalca za odgovore v
  besedilu (če je model, to povedati); točke za risbo izpustiti in to navesti;
- ločeno poročati: po vrsti (`izbirna` s popravkom za ugibanje, `racun`, `izraz`, `opis`), po sliki (`ne`, `opisana`,
  `nujna`), po letu (starejše pole so verjetno v učnih podatkih modela) ter napačne rešitve (`napaka`: drugo opravilo,
  prepoznati napako) nikoli skupaj z reševanjem;
- ločiti matematično pravilnost od izpitne oblike (npr. zahtevan zapis na stotine): navodila RIC ocenjujejo obe;
- pred tem ločiti uradne oblike odgovora od oblik, ki jih je dodal prepisovalec, in pregledati vse opise slik
  (ali izdajo odgovor); obe vrsti napak sta se pokazali v vzorcu.

## Omejitve

- Naloge iz generatorjev je napisal isti razvojni proces kot Vadnico (avtor Claude); neodvisen je le odgovor (koda,
  ne inštruktor). Neodvisen preračun s SymPy je naloga PV-10. Del uradnih nalog je zato glavno merilo.
- Uradne naloge so iz mature (SŠ) in NPZ MAT (OŠ 6. in 9. razred); OŠ FIZ, KEM in BIO ter tekmovanja DMFA/ZOTKS pokrivajo
  samo generatorji.
- Prepis je naredil model; vzorec prepisov (83 postavk) je s polo primerjal drug model iste družine, ne človek.
  Človeški pregled vzorca je j premaknil na čas po prvem plačilu.
- Temo in raven uradnih postavk ter črke možnosti pri NPZ je določil prepisovalec; v `sestava.json` so pomešane z
  oznakami generatorjev.
- Napačne rešitve in njihove razlage (`napaka`) so iz generatorjev, torej od istega avtorja kot naloge.
