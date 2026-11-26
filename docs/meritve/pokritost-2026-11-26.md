# Pokritost matematičnih trditev po delih aplikacije (2026-11-26)

## Povzetek
- Glavna številka: 11.615 trditev od 85.362 v vsebini, ki jo učenec vidi (13,6 %), je program v celoti preračunal (izračunano ali numerično). Delno (le del verige): 10.221 (12,0 %). Brez statusa (»Nepreverjeno«): 63.517 (74,4 %). Cilj: višje je bolje. Štetje celote, ne vzorec, zato brez intervala.
- Strojni bloki RACUN, ločeno: 5.623 trditev od 5.626 (99,9 %) v celoti preveri SymPy ali kemijski preizkus. Ponovijo rezultate vidne vsebine, zato niso v glavni številki.
- Pomeni: koliko formul z relacijo v lekcijah, rešenih primerih, polah in rešitvah generatorjev dobi status, ko obstoječe preverjevalnike (lesson-math, preizkus identitet, SymPy) uporabimo na vsaki formuli posebej. Zaznanih napak: 9.
- Ne pomeni: da so formule brez statusa napačne, niti da je »numerično« dokaz. Tudi ne, da vse te statuse danes izračuna CI ali vidi učenec: stolpec »Preverjanje danes« pove, kaj se preračuna ob vsaki spremembi (koraki rešitev generatorjev in računi v »Preveri se« se ne). Oznaka lekcije »Strojno preverjeno« pomeni, da program preračuna vsaj en račun brez napake, ne da ima vsaka trditev status.

## Nabor
- Vir: vsa vsebina v repozitoriju na spodnjem commitu (content/lessons, content/exam-papers, server/practice/generators); generatorji: seme 1 na ravneh 1–3. Fakultetne zbirke v server/university-*.js niso zajete.
- Pričakovani izid: ni ga (popis ne meri pravilnosti, le ali ima trditev status). Uradnih virov: ne velja. Predloga docs/meritve/README.md je za vzorce; tu sta »Sestava« in »Skriti kontrolni del« brez pomena (štetje celote), stolpca n in interval pa nadomesti štetje.

## Metoda
- Ukaz: `node scripts/popis-pokritosti.mjs --strogo --dodatek docs/meritve/pokritost-2026-11-26-pregled.md --json docs/meritve/pokritost-2026-11-26.json --porocilo docs/meritve/pokritost-2026-11-26.md`
- Commit: `9b064b711e03da08c698f5edc0e4479935d1d1f0` (veja PR; vsebina je enaka kot na `main` po združitvi); skripta ne kliče modela AI; Node v22.23.5, SymPy 1.14.0
- Trditev = formula $…$ ali $$…$$ z relacijo (=, ≈, <, >, ≤, ≥, ≠, ∈, ⇒ …); vrstica RACUN = ena trditev. Status: preračun server/lesson-math.js (numerično, delno, napaka); simbolna enakost, ki jo potrdi preizkus z naključnimi števili server/lesson-identity.js, je numerično (neujemanje brez okolice lekcije ne šteje kot napaka, ker je lahko enačba); RACUN: SymPy z načinom (izračunano ali numerično), uravnotežena enačba izračunano, molska masa z dopustom numerično.
- Izločeno in našteto posebej: namerno napačne (»Pogoste napake« v celoti, napačne možnosti v »Preveri se« in njihova pojasnila ~, »mistake« in napačne izbire na polah) in vprašanja (? v »Preveri se«: podatek naloge, ne trditev).

## Izidi

| # | Mesto | Enota trditve | Trditev | V celoti | Delno | Napaka | Nepreverjeno | Izračunano / numerično | Izločene: namerno napačne / vprašanja | Preverjanje danes | Obseg |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | AI-inštruktor, odgovori | trditev v odgovoru | ob uporabi | – | – | – | – | – | – | program preračuna številske korake in končne vrednosti (live-check.js) ter trditve RACUN (SymPy); učenec ne vidi statusa po trditvi | lastnik B |
| 2 | Sodba učenčevega koraka | korak učenca | ob uporabi | – | – | – | – | – | – | program presodi pravilno ali napačno, brez sedmih statusov | lastnik B |
| 3 | Shranjeni odgovori in kartice | kartica | ob uporabi | – | – | – | – | – | – | pravilno ali napačno, brez sedmih statusov | lastnik B |
| 4 | Znanstveni kalkulator | rezultat | ob uporabi | – | – | – | – | – | – | rezultat, ki ne prestane številske preizkušnje, se ne pokaže; statusa ni | lastnik B |
| 5 | Grafični kalkulator, CAS | rezultat | ob uporabi | – | – | – | – | – | – | CAS rezultat preizkusi s števili in neprestanega ne pokaže (casUnverified); statusa ni | lastnik B |
| 6 | Učbenik: razlaga | formula z relacijo | 19.468 | 3.145 (16,2 %) | 1.039 | 0 | 15.284 (78,5 %) | 0 / 3.145 | 1.776 / 0 | da: check-lesson.js preračuna račune in identitete | 521 lekcij |
| 6 | Učbenik: »Preveri se« (pravilni odgovor, pojasnilo) | formula z relacijo | 3.640 | 924 (25,4 %) | 829 | 3 | 1.884 (51,8 %) | 0 / 924 | 2.124 / 1.144 | delno: check-lesson.js preizkusi identitete v vrsticah + in >, računov ne preračuna | 515 lekcij s »Preveri se« |
| 6 | Učbenik: bloki RACUN (strojni zapis, učenec jih ne vidi) | vrstica RACUN | 5.626 | 5.623 (99,9 %) | 0 | 0 | 3 (0,1 %) | 4.324 / 1.299 | 0 / 0 | da: check-lesson.js (SymPy) | 313 lekcij z RACUN |
| 7 | Rešeni primeri v lekcijah | formula z relacijo | 17.325 | 2.569 (14,8 %) | 2.616 | 0 | 12.140 (70,1 %) | 0 / 2.569 | 0 / 0 | da: check-lesson.js (računi; od identitet le rešitve) | 518 lekcij s primeri |
| 8 | Vadnica: generatorji (rešitve) | formula z relacijo v rešitvi | 3.138 | 277 (8,8 %) | 1.005 | 3 | 1.853 (59,1 %) | 0 / 277 | 0 / 0 | ne: preveri-generatorje.js preveri odgovor naloge, korakov rešitve ne | 618 generatorjev |
| 9 | Matura in NPZ: naše pole (rešitve) | formula z relacijo v rešitvi | 8.798 | 1.899 (21,6 %) | 1.127 | 0 | 5.772 (65,6 %) | 0 / 1.899 | 640 / 0 | da: test pol (our-papers.js) preračuna odgovor, točkovnik, »mistake« in poti rešitve | 31 pol |
| 10 | Tekmovalne naloge (generatorji tek-*) | formula z relacijo v rešitvi | 549 | 103 (18,8 %) | 198 | 3 | 245 (44,6 %) | 0 / 103 | 0 / 0 | ne: kot generatorji | 86 generatorjev |
| 11 | Priprava na test | naloga iz zapiskov | ob uporabi | – | – | – | – | – | – | naloga, v kateri koda najde računsko napako, se izloči (codeCheck); statusa ni | lastnik A |
| 12 | Uvoženi zapiski in kartice | trditev zapiska | ob uporabi | – | – | – | – | – | – | zapiski: trditve RACUN; vaja iz lista: ne | lastnik A |
| 13 | Skener | rešitev naloge | ob uporabi | – | – | – | – | – | – | da: pet statusov (meritev PV-05 na naboru N-01) | lastnik A |
| 14 | Virtualni laboratorij | učenčev račun | ob uporabi | – | – | – | – | – | – | pravilno ali napačno z dopustom (preveriRacun), brez sedmih statusov | lastnik A |
| 15 | Interaktivne simulacije | formula na zaslonu | ob uporabi | – | – | – | – | – | – | ne (sim.test.js preizkusi fiziko, formul na zaslonu ne popiše) | lastnik A |
| 16 | Formule v 3D svetu | formula | ob uporabi | – | – | – | – | – | – | ne (ni popisa) | lastnik A |
| 17 | Fizikalni in kemijski izračuni | rezultat z enoto | ob uporabi | – | – | – | – | – | – | enote in kemija v RACUN, sicer ne | lastnik skupno |
| 18 | Fakultetna matematika (lekcije UNI-*) | formula z relacijo | 32.444 | 2.698 (8,3 %) | 3.407 | 0 | 26.339 (81,2 %) | 0 / 2.698 | 1.364 / 547 | kot učbenik; zbirke server/university-*.js niso zajete | 245 lekcij |
| 19 | Ustno spraševanje, kvizi, dnevna uganka | odgovor | ob uporabi | – | – | – | – | – | – | pravila po vrsti vprašanja, ne status | lastnik A |

## Napake in neuspehi
- Učbenik: »Preveri se« (pravilni odgovor, pojasnilo): 3 trditve, kjer preračun ne izide (BIO-SS-4/geni-in-razvoj-cloveka: $2^{10} \approx 10^3$; BIO-SS-4/geni-in-razvoj-cloveka: $10^{12} = (10^3)^4 \approx 2^{40}$; MAT-OS-8/zapis-z-desetiskimi-potencami: $10^4 \cdot 10^1 = 10^5$)
- Vadnica: generatorji (rešitve): 3 trditve, kjer preračun ne izide (periodni-sistem r2: $N(\text{zunanjih } e^-) = \text{št. skupine} - 10 = 16 - 10 = 6$; periodni-sistem r3: $N(\text{zunanjih } e^-) = \text{št. skupine} - 10 = 16 - 10 = 6$; exi-mat-solids r3: $t = \dfrac{8}{10}\ \text{h} = \dfrac{8 \times 60}{10}\ \text{min} = 48\ \text{min}$)
- Tekmovalne naloge (generatorji tek-*): 3 trditve, kjer preračun ne izide (tek-simetrija-os r2: $12.00 - 7.05 = 4.55$; tek-fiz-elektrostatika r3: $C = 8{,}85 \cdot 10^{-12} \cdot \dfrac{332 \cdot 10^{-4}}{0{,}5 \cdot 10^{-3}} = 587{,}64$; tek-kem-termokemija r3: $Q = 1000 \cdot 4{,}18 \cdot 82 = 342{,}8$)

## Pregled zaznanih napak

Vseh 9 je 26. 11. 2026 pregledal model AI Claude, ne človek; dva ločena agenta AI (prav tako modela) sta izid
ponovila. Nobena ni napačen rezultat:
- Napačen preračun v `server/lesson-math.js` (datoteka profila B, AUDIT-087 v revizijskem registru):
  $10^4 \cdot 10^1 = 10^5$ (potenco pred `\cdot` prebere kot $10^{40}$) in $\text{št. skupine} - 10$ (`\text{…}`
  vzame kot enoto).
- Zapis, ki ga preračun ne pozna (ni v registru): pretvorba h → min v isti verigi (exi-mat-solids) in ocena reda
  velikosti z ≈ ($2^{10} \approx 10^3$, $(10^3)^4 \approx 2^{40}$), ki jo lesson-math preverja strogo.
- Nenatančen zapis v naši vsebini (rezultat pravilen, enačba med znakoma $ dobesedno ne drži; popravek v ločenem PR):
  tek-simetrija-os piše uro kot račun z decimalkami ($12.00 - 7.05 = 4.55$), tek-fiz-elektrostatika in
  tek-kem-termokemija skrijeta pretvorbo enote (F → pF, J → kJ).

## Omejitve
- Trditev je formula z relacijo: besedne trditve (»funkcija je naraščajoča«) in formule brez relacije niso štete, zato je pravo število trditev večje.
- Ena formula z več relacijami je ena trditev; »delno« pomeni, da je program preračunal le del verige.
- Popis uporabi preverjevalnike na vsaki formuli posebej, tudi tam, kjer jih CI ne (generatorji, računi v »Preveri se«); brez okolice lekcije preizkus identitet le potrjuje, zato je del simbolnih trditev, ki jih CI lekcij preizkusi, tu »Nepreverjeno«.
- »Numerično« je preračun s plavajočo vejico ali preizkus z naključnimi števili, ne dokaz; »napaka« je lahko tudi pretvorba enote, zapis ure ali ocena reda velikosti, ki je lesson-math ne prepozna (glej pregled zgoraj).
- Izločene skupine niso vse napačne: »Pogoste napake« vsebujejo tudi pravilne različice, pojasnila ~ tudi pravilne račune.
- Bloki RACUN ponovijo rezultate vidne vsebine (content/lessons/README.md), zato so ločeni od glavne številke.
- Fakultetne zbirke v server/university-*.js (del mesta 18) niso zajete.
- Mesta, kjer trditve nastanejo ob uporabi (inštruktor, kalkulatorji, skener …), nimajo štetja; skener meri PV-05 na naboru N-01.

## Stroški
Klicev API: 0, cena: 0 $.
