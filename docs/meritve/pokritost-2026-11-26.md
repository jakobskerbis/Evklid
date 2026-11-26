# Pokritost matematičnih trditev po delih aplikacije (2026-11-26)

## Povzetek
- Glavna številka: 25594 od 90115 trditev v vnaprej znani vsebini ima status, ki ga je dal program (28,4 %; cilj 100 %, višje je bolje). Štetje celote, ne vzorec, zato brez intervala.
- Pomeni: koliko formul z relacijo v lekcijah, rešenih primerih, polah in rešitvah generatorjev je preračunal ali preveril program; ostale so »Nepreverjeno« (simbolni koraki, besedne trditve).
- Ne pomeni: da so nepreverjene trditve napačne, niti da je »numerično« dokaz. Vsebina z oznako »preverjeno« ima lahko večino trditev brez statusa po trditvi; oznaka lekcije pove, da je račune pregledal program in model, ne da ima vsaka trditev status.

## Nabor
- Vir: vsa vsebina v repozitoriju na spodnjem commitu (content/lessons, content/exam-papers, server/practice/generators); generatorji: seme 1 na ravneh 1–3. Fakultetne zbirke v server/university-*.js niso zajete.
- Pričakovani izid: ni ga (popis ne meri pravilnosti, le ali ima trditev status). Uradnih virov: ne velja.

## Metoda
- Ukaz: `node scripts/popis-pokritosti.mjs --json docs/meritve/pokritost-2026-11-26.json --porocilo docs/meritve/pokritost-2026-11-26.md`
- Commit: `aec6f5d6d2aaf9beb12455ff588e109cea243c5a`; brez modela AI; Node v22.23.5, SymPy 1.14.0
- Trditev = formula $…$ ali $$…$$ z relacijo (=, ≈, <, >, ≤, ≥, ≠, ∈, ⇒ …); vrstica RACUN = ena trditev. Status: preračun server/lesson-math.js (numerično, delno, napaka) in za RACUN SymPy z načinom ali točna kemija (izračunano, numerično, napaka). Namerno napačne trditve (»Pogoste napake«, napačne možnosti, »mistake«) so izločene in naštete posebej.

## Izidi

| # | Mesto | Enota trditve | Trditev | S statusom | Izračunano | Numerično | Delno | Napaka | Nepreverjeno | Izločene (namerno napačne) | Obseg |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | AI-inštruktor, odgovori | trditev v odgovoru | ob uporabi | status po trditvi: le trditve iz bloka RACUN (SymPy), brez statusa za učenca | – | – | – | – | – | – | lastnik B |
| 2 | Sodba učenčevega koraka | korak učenca | ob uporabi | status po trditvi: da/ne, brez sedmih statusov | – | – | – | – | – | – | lastnik B |
| 3 | Shranjeni odgovori in kartice | kartica | ob uporabi | status po trditvi: da/ne | – | – | – | – | – | – | lastnik B |
| 4 | Znanstveni kalkulator | rezultat | ob uporabi | status po trditvi: ne | – | – | – | – | – | – | lastnik B |
| 5 | Grafični kalkulator, CAS | rezultat | ob uporabi | status po trditvi: ne (statusi niso prikazani) | – | – | – | – | – | – | lastnik B |
| 6 | Učbenik: razlaga in »Preveri se« | formula z relacijo | 22971 | 5074 (22,1 %) | 0 | 3329 | 1742 | 3 | 17897 | 2148 | 521 lekcij |
| 6 | Učbenik: bloki RACUN (strojni zapis) | vrstica RACUN | 5626 | 5623 (99,9 %) | 4367 | 1256 | 0 | 0 | 3 | 0 | 313 lekcij z RACUN |
| 7 | Rešeni primeri v lekcijah | formula z relacijo | 17325 | 4866 (28,1 %) | 0 | 2294 | 2572 | 0 | 12459 | 0 | 518 lekcij s primeri |
| 8 | Vadnica: generatorji (rešitve) | formula z relacijo v rešitvi | 3138 | 1247 (39,7 %) | 0 | 250 | 994 | 3 | 1891 | 0 | 618 generatorjev |
| 9 | Matura in NPZ: naše pole (rešitve) | formula z relacijo v rešitvi | 8062 | 2689 (33,4 %) | 0 | 1658 | 1031 | 0 | 5373 | 658 | 31 pol |
| 10 | Tekmovalne naloge (generatorji tek-*) | formula z relacijo v rešitvi | 549 | 301 (54,8 %) | 0 | 100 | 198 | 3 | 248 | 0 | 86 generatorjev |
| 11 | Priprava na test | naloga iz zapiskov | ob uporabi | status po trditvi: ne | – | – | – | – | – | – | lastnik A |
| 12 | Uvoženi zapiski in kartice | trditev zapiska | ob uporabi | status po trditvi: zapiski: trditve RACUN; vaja iz lista: ne | – | – | – | – | – | – | lastnik A |
| 13 | Skener | rešitev naloge | ob uporabi | status po trditvi: da: pet statusov (meritev PV-05 na naboru N-01) | – | – | – | – | – | – | lastnik A |
| 14 | Virtualni laboratorij | učenčev račun | ob uporabi | status po trditvi: ne (formule pokrivajo enotni testi) | – | – | – | – | – | – | lastnik A |
| 15 | Interaktivne simulacije | formula na zaslonu | ob uporabi | status po trditvi: ne (sim.test.js, ni popisa formul) | – | – | – | – | – | – | lastnik A |
| 16 | Formule v 3D svetu | formula | ob uporabi | status po trditvi: ne (ni popisa) | – | – | – | – | – | – | lastnik A |
| 17 | Fizikalni in kemijski izračuni | rezultat z enoto | ob uporabi | status po trditvi: enote in kemija v RACUN, sicer ne | – | – | – | – | – | – | lastnik skupno |
| 18 | Fakultetna matematika (lekcije UNI-*) | formula z relacijo | 32444 | 5794 (17,9 %) | 0 | 2519 | 3275 | 0 | 26650 | 783 | 245 lekcij |
| 19 | Ustno spraševanje, kvizi, dnevna uganka | odgovor | ob uporabi | status po trditvi: pravila po vrsti vprašanja, ne status | – | – | – | – | – | – | lastnik A |

## Napake in neuspehi
- Učbenik: razlaga in »Preveri se«: 3 trditev, kjer preračun ne izide (prvih 3: BIO-SS-4/geni-in-razvoj-cloveka: $2^{10} \approx 10^3$; BIO-SS-4/geni-in-razvoj-cloveka: $10^{12} = (10^3)^4 \approx 2^{40}$; MAT-OS-8/zapis-z-desetiskimi-potencami: $10^4 \cdot 10^1 = 10^5$)
- Vadnica: generatorji (rešitve): 3 trditev, kjer preračun ne izide (prvih 3: periodni-sistem r2: $N(\text{zunanjih } e^-) = \text{št. skupine} - 10 = 16 - 10 = 6$; periodni-sistem r3: $N(\text{zunanjih } e^-) = \text{št. skupine} - 10 = 16 - 10 = 6$; exi-mat-solids r3: $t = \dfrac{8}{10}\ \text{h} = \dfrac{8 \times 60}{10}\ \text{min} = 48\ \text{min}$)
- Tekmovalne naloge (generatorji tek-*): 3 trditev, kjer preračun ne izide (prvih 3: tek-simetrija-os r2: $12.00 - 7.05 = 4.55$; tek-fiz-elektrostatika r3: $C = 8{,}85 \cdot 10^{-12} \cdot \dfrac{332 \cdot 10^{-4}}{0{,}5 \cdot 10^{-3}} = 587{,}64$; tek-kem-termokemija r3: $Q = 1000 \cdot 4{,}18 \cdot 82 = 342{,}8$)

Ročni pregled vseh 9 (Claude, model AI, ne človeški strokovnjak; 26. 11. 2026): nobena ni napačen rezultat.
- Lažni alarm preračuna (server/lesson-math.js, profil B; zapisano v revizijski register): $10^4 \cdot 10^1 = 10^5$ (potenci razčleni napačno), $\text{št. skupine} - 10$ (besedilo v \text), pretvorba h → min, ura $12.00 - 7.05 = 4.55$ (ure in minute, ne decimalke), $2^{10} \approx 10^3$ in $(10^3)^4 \approx 2^{40}$ (ocena reda velikosti, »≈« preverjen strogo).
- Nenatančen zapis (naša generatorja, popravek v ločenem PR): tek-fiz-elektrostatika »$… = 587{,}64$ pF« in tek-kem-termokemija »$1000 \cdot 4{,}18 \cdot 82 = 342{,}8$ kJ«: rezultat je pravilen, a pretvorba enote (F → pF, J → kJ) je skrita, zato enačba med znakoma $ dobesedno ne drži.

## Omejitve
- Trditev je formula z relacijo: besedne trditve (»funkcija je naraščajoča«) in formule brez relacije niso šteti, zato je pravo število trditev večje.
- Ena formula z več relacijami je ena trditev; »delno« pomeni, da je program preračunal le del verige.
- »Numerično« iz lesson-math je preračun s plavajočo vejico z dopustom, ne dokaz; »napaka« je lahko tudi pretvorba ali zaokrožitev, ki je lesson-math ne prepozna (CI lekcij in pol take vrstice že pregleda).
- Mesta, kjer trditve nastanejo ob uporabi (inštruktor, kalkulatorji, skener …), nimajo štetja; skener meri PV-05 na naboru N-01.

## Stroški
Klicev API: 0, cena: 0 $.
