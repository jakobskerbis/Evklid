---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Iz plastelina naredi kroglico in vanjo zapiči štiri zobotrebce, kot kažejo oglišča tetraedra. Na konce natakni štiri kroglice različnih barv, nato zgradi še model, ki je zrcalna slika prvega. Obračaj ju, kolikor hočeš: vseh barv nikoli ne spraviš na ista mesta. Na drugem modelu zamenjaj dve barvi in modela se nenadoma prekrijeta.

Tvoj model je ogljik s štirimi različnimi skupinami. Takšen ogljik je v mnogih molekulah. Karvon ima eno samo formulo $\mathrm{C_{10}H_{14}O}$ in enako vezane atome, a ena oblika diši po meti, njena zrcalna slika po kumini: nosni receptorji so iz kiralnih proteinov in ju ločijo, kot rokavica loči levo roko od desne. Pri zdravilih je razlika lahko usodna: ena oblika zdravi, zrcalna je neučinkovita ali škodljiva.

## Razlaga

### Blok 1: vrste izomerov

Izomeri imajo enako molekulsko formulo. **Konstitucijski izomeri** imajo atome povezane v drugačnem vrstnem redu (butan-1-ol in butan-2-ol). **Stereoizomeri** imajo enako povezane atome, razlikujejo pa se v razporeditvi v prostoru. Vsak par stereoizomerov je bodisi par **enantiomerov** (zrcalni sliki, ki se ne prekrijeta) bodisi par **diastereomerov** (vsi drugi pari).

*Preveri:* sta butan-1-ol in butan-2-ol stereoizomera? (Ne, skupina $-\mathrm{OH}$ je vezana na drug ogljik, zato sta konstitucijska izomera.)

### Blok 2: kiralnost

Predmet je **kiralen**, če ga ne moremo prekriti z njegovo zrcalno sliko (roka, vijak). **Akiralen** predmet se s svojo zrcalno sliko prekrije (žlica, kozarec). Akiralna molekula ima navadno **zrcalno ravnino**, ki jo deli na dve zrcalni polovici. Natančen kriterij: molekula je kiralna natanko tedaj, ko nima nobene zrcalno-rotacijske osi $S_n$; najpogostejši sta $S_1$ (zrcalna ravnina) in $S_2$ (središče simetrije).

*Preveri:* je mizarsko kladivo kiralno? (Ne, zrcalna ravnina gre skozi ročaj in glavo.)

### Blok 3: stereocenter

Iz prejšnjih poglavij veš, da ima ogljik $sp^3$ štiri vezi v tetraedru. Če so na tak ogljik vezane **štiri različne skupine**, je ogljik **stereocenter** (kiralni center). Molekula z natanko enim stereocentrom je kiralna: simetrijska operacija bi morala stereocenter in vse štiri različne skupine pustiti na mestu, kar zmore le identiteta, ne $S_n$.

Primer: v butan-2-olu $\mathrm{CH_3CH(OH)CH_2CH_3}$ ima C2 skupine $-\mathrm{H}$, $-\mathrm{OH}$, $-\mathrm{CH_3}$ in $-\mathrm{CH_2CH_3}$. Vse štiri so različne, zato je C2 stereocenter. V propan-2-olu sta na C2 dve skupini $-\mathrm{CH_3}$, zato C2 ni stereocenter in molekula je akiralna.

*Preveri:* je C2 v butan-1-olu stereocenter? (Ne, nosi dva vodika.)

### Blok 4: enantiomera

Dve molekuli, ki sta zrcalni sliki in se ne prekrijeta, sta **enantiomera**. Imata enako tališče, vrelišče, topnost in gostoto. Razlikujeta se v dveh stvareh:

- vrtita ravnino **linearno polarizirane svetlobe** za enak kot v nasprotni smeri; to je **optična aktivnost**;
- drugače reagirata z drugimi kiralnimi molekulami (encimi, receptorji).

**Trditev.** V akiralnem okolju imata enantiomera enake vse skalarne fizikalne lastnosti. *Utemeljitev:* zrcaljenje ohrani vse razdalje in kote, zato imata enantiomera enako energijo in enake interakcije z akiralnimi molekulami. S kiralnim partnerjem (R') pa tvorita para (R)·(R') in (S)·(R'), ki nista zrcalni sliki (zrcalna slika para (R)·(R') je (S)·(S')), temveč diastereomera z različno energijo.

Zmes enakih količin obeh enantiomerov je **racemat**. Je optično neaktivna, ker se vrtenji izničita.

*Preveri:* se enantiomera razlikujeta po vrelišču? (Ne, vrelišče je enako.)

### Blok 5: specifična rotacija

Kot zasuka $\alpha$ merimo s polarimetrom. Odvisen je od dolžine kivete $l$ (v dm) in masne koncentracije $c$ (v g/mL). Lastnost snovi je **specifična rotacija**:

$$[\alpha] = \frac{\alpha}{l \cdot c}$$

Podatek velja pri določeni valovni dolžini (navadno natrijeva črta D, $589\,\mathrm{nm}$) in temperaturi, zato pišemo $[\alpha]_\mathrm{D}^{20}$. Predznak $(+)$ pomeni vrtenje v desno, $(-)$ v levo. Ta predznak se meri, ne razbere se iz formule.

**Enantiomerni presežek** zmesi z množinama $n_S \ge n_R$ je $\mathrm{ee} = (n_S - n_R)/(n_S + n_R)$. Naj v vzorcu ni drugih optično aktivnih snovi in naj se rotaciji enantiomerov seštevata. Ker imata enantiomera enako molsko maso, so masni deleži enaki množinskim, in $[\alpha] = x_S[\alpha]_{\text{čist}} - x_R[\alpha]_{\text{čist}} = \mathrm{ee} \cdot [\alpha]_{\text{čist}}$. Iz $x_S + x_R = 1$ in $x_S - x_R = \mathrm{ee}$ sledi $x_S = (1 + \mathrm{ee})/2$.

*Preveri:* kaj se zgodi z $\alpha$, če isto raztopino natočiš v dvakrat daljšo kiveto? (Kot se podvoji, $[\alpha]$ ostane enaka.)

### Blok 6: pravila CIP za prioriteto

Da konfiguracijo poimenujemo, skupinam na stereocentru najprej določimo prioriteto (pravila Cahna, Ingolda in Preloga):

1. Primerjamo atome, ki so **neposredno** vezani na stereocenter. Višje vrstno število pomeni višjo prioriteto: $\mathrm{Br} > \mathrm{Cl} > \mathrm{O} > \mathrm{N} > \mathrm{C} > \mathrm{H}$.
2. Če sta atoma enaka, primerjamo **trojici atomov**, vezanih nanju, urejeni od najvišjega. Odločilna je prva razlika. $-\mathrm{CH_2OH}$ ima trojico (O, H, H), $-\mathrm{CH(CH_3)_2}$ pa (C, C, H). Ker je O $>$ C, zmaga $-\mathrm{CH_2OH}$, čeprav je manjša skupina.
3. Dvojna vez šteje, kot da je atom podvojen: $-\mathrm{CH{=}O}$ šteje kot (O, O, H).

*Preveri:* kaj ima višjo prioriteto, $-\mathrm{OH}$ ali $-\mathrm{CH_2Br}$? ($-\mathrm{OH}$: odloči neposredno vezani atom, O $>$ C; brom za ogljikom ne pride v poštev.)

### Blok 7: konfiguracija R ali S

Molekulo zavrtimo tako, da skupina z najnižjo prioriteto (4) kaže **stran od nas**. Nato sledimo skupinam $1 \to 2 \to 3$:

- v smeri urinega kazalca: **R** (lat. *rectus*, desno);
- v nasprotni smeri: **S** (lat. *sinister*, levo).

Na risbi s klini pomeni poln klin vez proti nam, črtkana vez pa vez stran od nas. Če je skupina 4 na črtkani vezi, smer odčitaš kar z risbe. Če je na klinu, odčitaš in rezultat **obrneš**.

**Trditev.** Zamenjava katerih koli dveh skupin na stereocentru obrne konfiguracijo. *Dokaz:* ravnina skozi stereocenter in drugi dve skupini razpolavlja kot med zamenjanima vezema. Zrcaljenje čeznjo pusti drugi dve skupini na mestu in zamenja mesti prvih dveh. Zamenjava je torej zrcaljenje in da enantiomer.

:::premisli
Na modelu (R)-spojine najprej zamenjaš skupini 1 in 2, nato še skupini 3 in 4. Kakšno konfiguracijo imaš po prvi in kakšno po drugi zamenjavi? Kaj velja za katero koli sodo število zamenjav?
---
Ena zamenjava da (S), torej enantiomer. Druga zamenjava vrne (R). Vsaka zamenjava dveh skupin obrne smer $1 \to 2 \to 3$, zato sodo število zamenjav konfiguracijo ohrani.
:::

### Blok 8: diastereomeri

Če ima molekula več stereocentrov, lahko nastanejo stereoizomeri, ki **niso** zrcalne slike. To so **diastereomeri**. Imajo različne fizikalne lastnosti: tališče, topnost, $R_f$ pri kromatografiji.

Pri $n$ stereocentrih je stereoizomerov največ $2^n$, ker ima vsak center neodvisno dve konfiguraciji. Za dva stereocentra (npr. v 2-bromo-3-klorobutanu) so štiri kombinacije:

| | (2R,3R) | (2S,3S) | (2R,3S) |
|---|---|---|---|
| (2R,3R) | ista | enantiomer | diastereomer |
| (2S,3S) | enantiomer | ista | diastereomer |
| (2S,3R) | diastereomer | diastereomer | enantiomer |

Pravilo: če se obrnejo **vsi** stereocentri, dobiš enantiomer. Če se obrne le **del** njih, dobiš diastereomer.

:::premisli
Destilacija in kristalizacija ločujeta snovi po vrelišču in topnosti. Ali z njima ločiš zmes enantiomerov? Kaj pa zmes diastereomerov? Kako bi si pri enantiomerih pomagal s čistim kiralnim reagentom?
---
Enantiomerov ne ločiš, ker imata enako vrelišče in topnost. Diastereomere ločiš, ker imajo različne fizikalne lastnosti. Zato enantiomere s kiralnim reagentom pretvorimo v diastereomere.
:::

### Blok 9: spojine mezo

Kadar sta oba konca molekule enaka, ima ena od kombinacij notranjo zrcalno ravnino. Taka **spojina mezo** je akiralen stereoizomer z vsaj dvema stereocentroma, ki ima kiralne diastereomere; je optično neaktivna. Zato je stereoizomerov manj kot $2^n$: pri sodem $n$ in enakih koncih jih je $2^{n-1} + 2^{n/2-1}$.

*Preveri:* ima 2,3-dibromobutan obliko mezo? (Da, konca molekule sta enaka.)

### Blok 10: cis in trans

Okoli dvojne vezi ni prostega vrtenja (poglavje o vezeh). Zato sta *cis*- in *trans*-but-2-en dva stereoizomera, ki nista zrcalni sliki. Tudi to sta diastereomera: imata različno vrelišče.

## Rešeni primeri

### Primer 1 (lažji): iskanje stereocentrov

Katere od spojin 2-klorobutan, propan-2-ol in 3-metilheksan imajo stereocenter? Koliko stereoizomerov ima vsaka?

**Podatki:** 2-klorobutan $\mathrm{CH_3CHClCH_2CH_3}$, propan-2-ol $\mathrm{(CH_3)_2CHOH}$, 3-metilheksan $\mathrm{CH_3CH_2CH(CH_3)CH_2CH_2CH_3}$
**Iščemo:** stereocentre in število stereoizomerov

:::formula
Stereocenter: ogljik $sp^3$ s štirimi različnimi skupinami. Število stereoizomerov $\le 2^n$.
:::

**Rešitev:**

1. 2-klorobutan, C2: $-\mathrm{H}$, $-\mathrm{Cl}$, $-\mathrm{CH_3}$, $-\mathrm{CH_2CH_3}$. Štiri različne, torej stereocenter; $n = 1$, stereoizomera sta $2^1 = 2$.
2. Propan-2-ol, C2: $-\mathrm{H}$, $-\mathrm{OH}$ in dve $-\mathrm{CH_3}$. Dve skupini sta enaki, torej ni stereocentra in molekula je akiralna.
3. 3-metilheksan, C3: $-\mathrm{H}$, metil, etil, propil. Ogljikovodik, a vse štiri skupine so različne, zato je C3 stereocenter; stereoizomera sta $2$.
4. Odgovor: 2-klorobutan in 3-metilheksan imata po en stereocenter in obstajata kot dva enantiomera; propan-2-ol je akiralen.

### Primer 2: določanje konfiguracije

Na risbi butan-2-ola je C2 na sredini. Skupina $-\mathrm{OH}$ je zgoraj, $-\mathrm{CH_2CH_3}$ spodaj desno, $-\mathrm{CH_3}$ spodaj levo na polnem klinu, $-\mathrm{H}$ pa na črtkani vezi. Ali je to (R)- ali (S)-butan-2-ol?

**Podatki:** stereocenter C2; $-\mathrm{OH}$ zgoraj, $-\mathrm{CH_2CH_3}$ spodaj desno, $-\mathrm{CH_3}$ spodaj levo (klin), $-\mathrm{H}$ črtkano (stran od nas)
**Iščemo:** konfiguracijo R ali S

:::formula
Pravila CIP za prioriteto; skupina 4 stran od opazovalca; $1 \to 2 \to 3$ v smeri urinega kazalca je R, v nasprotni S.
:::

**Rešitev:**

1. Neposredno vezani atomi: O, C, C, H. Zato je $-\mathrm{OH}$ prva, $-\mathrm{H}$ četrta.
2. Med $-\mathrm{CH_2CH_3}$ (C, H, H) in $-\mathrm{CH_3}$ (H, H, H) odloči prvi atom v trojici: C $>$ H. Etil je druga, metil tretja skupina.
3. $-\mathrm{H}$ je na črtkani vezi, kaže stran od nas, zato smer beremo kar z risbe.
4. Od zgoraj ($-\mathrm{OH}$) do spodaj desno (etil) do spodaj levo (metil): to je smer urinega kazalca.
5. Odgovor: na risbi je (R)-butan-2-ol.

### Primer 3 (težji): vinska kislina in spojina mezo

Louis Pasteur je leta 1848 pod povečevalnim steklom s pinceto ročno razvrstil kristale soli racemne vinske kisline: eni so bili zrcalna slika drugih. Tako je prvič ločil enantiomera. Vinska kislina je 2,3-dihidroksibutandiojska kislina, $\mathrm{HOOC{-}CH(OH){-}CH(OH){-}COOH}$. Koliko stereoizomerov ima? Kateri je enantiomer in kateri diastereomer (2R,3R)-vinske kisline? Vzorec sintezne vinske kisline vsebuje (2R,3R)-, (2S,3S)- in mezo obliko; masni delež oblike mezo je $20\,\%$. $1{,}50\,\mathrm{g}$ vzorca raztopimo v vodi do $10{,}0\,\mathrm{mL}$ in v kiveti dolžine $2{,}00\,\mathrm{dm}$ izmerimo $\alpha = +2{,}16^\circ$. Čista (2R,3R)-vinska kislina ima pri enakih pogojih $[\alpha] = +12{,}0^\circ$. Izračunaj masne deleže vseh treh oblik in $\mathrm{ee}$.

**Podatki:** $\mathrm{HOOC{-}CH(OH){-}CH(OH){-}COOH}$; stereocentra C2 in C3; konca molekule sta enaka; $w_{\text{mezo}} = 20\,\%$, $m = 1{,}50\,\mathrm{g}$, $V = 10{,}0\,\mathrm{mL}$, $l = 2{,}00\,\mathrm{dm}$, $\alpha = +2{,}16^\circ$, $[\alpha]_{RR} = +12{,}0^\circ$
**Iščemo:** število stereoizomerov, enantiomer in diastereomer oblike (2R,3R); $w_{RR}$, $w_{SS}$, $\mathrm{ee}$

:::formula
Največ $2^n$ stereoizomerov; mezo oblika (notranja zrcalna ravnina) zmanjša število. Obrat vseh centrov da enantiomer, obrat dela diastereomer. $[\alpha] = \dfrac{\alpha}{l \cdot c}$, $\mathrm{ee} = \dfrac{w_{RR} - w_{SS}}{w_{RR} + w_{SS}}$
:::

**Rešitev:**

1. C2 in C3 imata vsak $-\mathrm{H}$, $-\mathrm{OH}$, $-\mathrm{COOH}$ in preostanek molekule, torej $n = 2$.
2. Največje število kombinacij: $2^2 = 4$, torej (R,R), (S,S), (R,S), (S,R).
3. Ker sta konca enaka, ima (2R,3S) zrcalno ravnino med C2 in C3. Njena zrcalna slika (2S,3R) je ista molekula, zato je to ena sama oblika mezo.
4. Število različnih stereoizomerov: $4 - 1 = 3$.
5. Enantiomer (2R,3R) dobimo z obratom obeh centrov: (2S,3S). Diastereomer dobimo z obratom enega: oblika mezo.
6. Koncentracija vzorca: $c = 1{,}50\,\mathrm{g}/10{,}0\,\mathrm{mL} = 0{,}150\,\mathrm{g/mL}$, zato $[\alpha] = \dfrac{2{,}16^\circ}{2{,}00 \cdot 0{,}150} = +7{,}20^\circ$.
7. Oblika mezo ne vrti, enantiomera prispevata nasprotno: $[\alpha] = (w_{RR} - w_{SS}) \cdot 12{,}0^\circ$, torej $w_{RR} - w_{SS} = 7{,}20/12{,}0 = 0{,}600$.
8. Obe kiralni obliki skupaj: $w_{RR} + w_{SS} = 1 - 0{,}20 = 0{,}80$. Seštejemo in delimo z 2: $w_{RR} = (0{,}80 + 0{,}600)/2 = 0{,}70$, $w_{SS} = 0{,}10$.
9. Enantiomerni presežek se nanaša le na enantiomera: $\mathrm{ee} = 0{,}600/0{,}80 = 0{,}75$, torej $75\,\%$ (ne $60\,\%$, ker oblika mezo vzorec le razredči).
10. Odgovor: vinska kislina ima tri stereoizomere. Enantiomer (2R,3R) je (2S,3S), diastereomer pa mezo-vinska kislina, ki je akiralna. Vzorec vsebuje $70\,\%$ (2R,3R), $10\,\%$ (2S,3S) in $20\,\%$ oblike mezo; $\mathrm{ee} = 75\,\%$.

### Primer 4: zdaj ti

Raztopina vzorca kiralne spojine s koncentracijo $0{,}100\,\text{g/mL}$ v kiveti dolžine $1{,}00\,\text{dm}$ zasuka ravnino polarizirane svetlobe za $+2{,}40^\circ$. Čisti (S)-enantiomer ima $[\alpha] = +30{,}0^\circ$. Kolikšna je specifična rotacija vzorca, kolikšen je enantiomerni presežek $\mathrm{ee}$ in kakšna je sestava zmesi?

**Podatki:** $\alpha = +2{,}40^\circ$, $l = 1{,}00\,\text{dm}$, $c = 0{,}100\,\text{g/mL}$, čisti (S): $[\alpha]_{\text{čist}} = +30{,}0^\circ$
**Iščemo:** $[\alpha]$ vzorca, $\mathrm{ee}$ in deleža (S) in (R)

:::formula
$[\alpha] = \dfrac{\alpha}{l \cdot c}$, $\quad \mathrm{ee} = \dfrac{[\alpha]}{[\alpha]_{\text{čist}}} \cdot 100\,\%$, $\quad x_S = \dfrac{100\,\% + \mathrm{ee}}{2}$
:::

**Rešitev:**

1. Specifična rotacija: $[\alpha] = \dfrac{2{,}40^\circ}{1{,}00 \cdot 0{,}100} = +24{,}0^\circ$.
2. Vzorec vrti manj kot čisti (S), torej je delno racemiziran; preostanek (R) izniči del vrtenja.
3. Izračunaj $\mathrm{ee}$ in sestavo sam.

:::premisli
Koliko sta $\mathrm{ee}$ in deleža (S) in (R)?
---
$\mathrm{ee} = \dfrac{24{,}0}{30{,}0} \cdot 100\,\% = 80\,\%$. Delež (S) je $\dfrac{100 + 80}{2} = 90\,\%$, delež (R) je $10\,\%$. Preveri: $90 - 10 = 80$.
:::

## Pogoste napake

- **Predznak vrtenja = R ali S.** »(R) pomeni $(+)$, torej desno.« Napačno: R/S je dogovor o risanju, $(+)/(-)$ pa meritev. (R)-glicerinaldehid je $(+)$, (R)-mlečna kislina pa $(-)$. Predznak vedno izmeriš.
- **Pozabljen obrat, ko je H spredaj.** Smer prebereš z risbe, čeprav je skupina 4 na klinu. Dobiš ravno nasprotno konfiguracijo. Preveri, kam kaže skupina 4; če kaže proti tebi, rezultat obrni.
- **Prioriteta po velikosti skupine.** »Propil je večji od $-\mathrm{CH_2OH}$, zato ima višjo prioriteto.« Pravila CIP ne gledajo mase cele skupine, ampak prvo razliko po atomih: (O, H, H) premaga (C, H, H).
- **Vsak stereocenter pomeni kiralno molekulo.** Spojina mezo ima dva stereocentra, a je akiralna zaradi notranje zrcalne ravnine. Zato $2^n$ velja le kot zgornja meja.
- **Vsaka dva stereoizomera sta enantiomera.** (2R,3R) in (2R,3S) nista zrcalni sliki, saj se je obrnil le en center. Sta diastereomera in imata različne fizikalne lastnosti.

## Povzetek

- Stereoizomeri: enaka povezanost atomov, različna razporeditev v prostoru; delimo jih na enantiomere in diastereomere.
- Kiralna molekula se ne prekrije s svojo zrcalno sliko; stereocenter je ogljik $sp^3$ s štirimi različnimi skupinami.
- Enantiomera imata enake fizikalne lastnosti, a nasprotno optično rotacijo; racemat je zmes $1 : 1$ in je optično neaktiven; $[\alpha] = \alpha / (l \cdot c)$.
- Pravila CIP: višje vrstno število neposredno vezanega atoma; ob izenačenju prva razlika v trojicah; dvojna vez podvoji atom.
- Skupina 4 stran od opazovalca, $1 \to 2 \to 3$ v smeri urinega kazalca je R, v nasprotni S; če je skupina 4 proti nam, obrni.
- Obrat vseh stereocentrov da enantiomer, obrat dela diastereomer; diastereomeri imajo različne fizikalne lastnosti.
- Največ $2^n$ stereoizomerov; spojine mezo so akiralne in število zmanjšajo. *Cis/trans* izomeri alkenov so diastereomeri.
- Predznak $(+)/(-)$ ni povezan z oznako R/S.

## Za izpit

Znati moraš povedati:

- natančne definicije: konstitucijski izomeri, stereoizomeri, enantiomeri, diastereomeri, kiralnost (s kriterijem osi $S_n$), stereocenter, spojina mezo, racemat;
- specifično rotacijo s pogoji (valovna dolžina, temperatura, enote $l$ in $c$) ter izpeljavo $\mathrm{ee} = [\alpha]/[\alpha]_{\text{čist}}$ in $x_S = (1 + \mathrm{ee})/2$ z njunima predpostavkama;
- dokaz, da zamenjava dveh skupin obrne konfiguracijo, in utemeljitev, zakaj se enantiomera razlikujeta le v kiralnem okolju;
- pravila CIP in postopek za R/S, tudi ko skupina 4 kaže proti opazovalcu;
- zgornjo mejo $2^n$ in kako oblike mezo zmanjšajo število stereoizomerov.

### Naloga 1

Racemno kislino ($10{,}0\,\mathrm{g}$) ločimo s čistim kiralnim aminom: diastereomerni soli imata različno topnost, iz kristalov po nakisanju dobimo $3{,}80\,\mathrm{g}$ kisline, ostanek ostane v matičnici. Raztopina kristalne kisline s $c = 0{,}0500\,\mathrm{g/mL}$ v kiveti $1{,}00\,\mathrm{dm}$ zasuka za $\alpha = -1{,}53^\circ$. Čisti (S)-enantiomer ima $[\alpha] = -34{,}0^\circ$. Izgub ni. Izračunaj (a) $\mathrm{ee}$ in maso (S) v kristalni kislini, (b) izkoristek (S) glede na največji mogoči, (c) $\mathrm{ee}$ kisline v matičnici in kot $\alpha$, ki ga izmerimo za njeno raztopino pri enakih $c$ in $l$.

**Rešitev:**

1. Specifična rotacija kristalne kisline: $[\alpha] = \dfrac{-1{,}53^\circ}{1{,}00 \cdot 0{,}0500} = -30{,}6^\circ$.
2. $\mathrm{ee} = 30{,}6/34{,}0 = 0{,}90$, torej $90\,\%$ (S); $x_S = (1 + 0{,}90)/2 = 0{,}95$.
3. Masa (S): $0{,}95 \cdot 3{,}80 = 3{,}61\,\mathrm{g}$, masa (R): $3{,}80 - 3{,}61 = 0{,}19\,\mathrm{g}$.
4. (b) Racemat vsebuje $5{,}00\,\mathrm{g}$ (S), zato je izkoristek $3{,}61/5{,}00 = 0{,}722$, torej $72{,}2\,\%$.
5. (c) Masna bilanca za matičnico: (S) $5{,}00 - 3{,}61 = 1{,}39\,\mathrm{g}$, (R) $5{,}00 - 0{,}19 = 4{,}81\,\mathrm{g}$, skupaj $6{,}20\,\mathrm{g}$.
6. $\mathrm{ee} = (4{,}81 - 1{,}39)/6{,}20 = 0{,}552$, torej $55{,}2\,\%$ v korist (R).
7. (R) ima $[\alpha] = +34{,}0^\circ$ (enantiomer, nasprotni predznak), zato $[\alpha] = 0{,}552 \cdot 34{,}0 = +18{,}8^\circ$ in $\alpha = 18{,}8 \cdot 1{,}00 \cdot 0{,}0500 = +0{,}94^\circ$.
8. Odgovor: kristalna kislina ima $\mathrm{ee} = 90\,\%$ in vsebuje $3{,}61\,\mathrm{g}$ (S), kar je $72{,}2\,\%$ največjega izkoristka; matičnica ima $\mathrm{ee} = 55{,}2\,\%$ (R) in zasuka za $+0{,}94^\circ$.

### Naloga 2

Natančno navedi definicijo kiralne molekule in dokaži, da zamenjava dveh skupin na stereocentru da enantiomer. Nato utemelji, ali sta pravilni trditvi: (i) vsaka molekula s stereocentrom je kiralna; (ii) vsaka kiralna molekula ima stereocenter.

**Rešitev:**

1. Molekula je kiralna, če je ne moremo prekriti z njeno zrcalno sliko; ekvivalentno, če nima nobene zrcalno-rotacijske osi $S_n$ (zrcalne ravnine, središča simetrije, …).
2. Naj ima stereocenter skupine $a$, $b$, $c$, $d$ v ogliščih tetraedra. Ravnina skozi ogljik, $c$ in $d$ vsebuje rob $cd$ in razpolavlja rob $ab$, zato je simetrijska ravnina tetraedra.
3. Zrcaljenje čez to ravnino pusti $c$ in $d$ na mestu ter zamenja mesti $a$ in $b$. Zamenjava $a \leftrightarrow b$ je torej zrcaljenje, kar da zrcalno sliko; ker so skupine različne, se ta ne prekrije z izvirnikom, zato je enantiomer.
4. (i) Ne velja. Mezo-vinska kislina ima dva stereocentra, a zrcalno ravnino med C2 in C3, zato je akiralna. Velja le za molekule z natanko enim stereocentrom.
5. (ii) Ne velja. Alen $\mathrm{CH_3CH{=}C{=}CHCH_3}$ nima stereocentra, a nima nobene osi $S_n$ (ne zrcalne ravnine ne središča simetrije), ker ležita para substituentov v pravokotnih ravninah; je kiralen (os kiralnosti). Enako atropizomerni bifenili.
6. Odgovor: kiralnost določa simetrija, ne stereocenter; obe trditvi sta napačni.

## Drugače: Na sliki

Stereocenter je **volan**: steber je vez do skupine 4 in kaže stran od tebe, na obroču so skupine 1, 2, 3. Obrat $1 \to 2 \to 3$ v desno je R, v levo S. Če steber kaže proti tebi, rezultat obrneš.

## Drugače: Uporaba v stroki

- **Analitika.** Enantiomera na navadni koloni HPLC izstopita skupaj. Kiralna stacionarna faza z vsakim tvori diastereomerni kompleks z drugačno energijo in ju loči; tako merijo $\mathrm{ee}$ učinkovin.
- **Farmacija.** Pri ibuprofenu je aktiven (S), (R) pa se v telesu deloma pretvori v (S). Talidomid v telesu racemizira, zato čisti enantiomer ne bi preprečil škode.
- **Sinteza.** Asimetrična kataliza s kiralnimi kompleksi (Knowles, Noyori, Nobelova nagrada 2001) da en enantiomer brez ločevanja; tako so prvič industrijsko izdelali L-DOPA.

## Drugače: Bolj natančno

**Fischerjeva projekcija.** Navpične vezi kažejo stran od opazovalca, vodoravne proti njemu. Če je H na vodoravni vezi, smer $1 \to 2 \to 3$ obrnemo. Oznaka D/L pri sladkorjih in aminokislinah ni enaka R/S.

## Preveri se

? Kaj je stereocenter?
- Ogljik, na katerega so vezani štirje enaki atomi.
~ Štiri enake skupine dajo simetričen ogljik, ki ni stereocenter.
+ Ogljik $sp^3$, na katerega so vezane štiri različne skupine.
- Ogljik z dvojno vezjo.
~ Ogljik $sp^2$ ima le tri skupine v ravnini in ni stereocenter; dvojna vez daje *cis/trans* izomerijo, ne stereocentra.
> Štiri različne skupine na tetraedričnem ogljiku dajo dve razporeditvi, ki sta zrcalni sliki in se ne prekrijeta.

? Spojina ima dva stereocentra, pa je optično neaktivna, čeprav je čista. Kako je to mogoče?
- Ker je racemat.
~ Racemat je zmes dveh spojin, tu pa je vzorec čista spojina.
+ Ker je spojina mezo z notranjo zrcalno ravnino.
- Ker se vrtenji dveh stereocentrov v isti molekuli vedno izničita.
~ To velja le za obliko mezo. (2R,3R)-vinska kislina ima dva stereocentra in je optično aktivna.
> Spojina mezo ima stereocentre, a je zaradi zrcalne ravnine akiralna in enaka svoji zrcalni sliki.

? (R)-spojina vrti ravnino polarizirane svetlobe za $+15^\circ$. Kaj velja za njen (S)-enantiomer pri enakih pogojih?
- Vrti za $+15^\circ$, ker ima enake fizikalne lastnosti.
~ Enantiomera imata res enaka tališče in vrelišče, a nasprotno optično rotacijo.
+ Vrti za $-15^\circ$.
- O predznaku ne moremo reči ničesar.
~ Za samo spojino ne moremo napovedati predznaka iz R/S, za enantiomer pa vemo, da je kot enak in nasproten.
> Enantiomera vrtita za enak kot v nasprotni smeri. Iz oznake R/S same pa predznaka ne moremo napovedati.

? Katera skupina ima po pravilih CIP najvišjo prioriteto?
- $-\mathrm{CH_2CH_2CH_2CH_3}$
~ Najdaljša skupina ne zmaga samodejno: njena trojica je (C, H, H).
- $-\mathrm{CH(CH_3)_2}$
~ Trojica (C, C, H) premaga (C, H, H), a O v (O, H, H) je višji od C.
+ $-\mathrm{CH_2OH}$
> Vse tri skupine imajo na stereocentru C. Odloči prva razlika v trojicah: (O, H, H) $>$ (C, C, H) $>$ (C, H, H), ker je O $>$ C.

? Koliko stereoizomerov ima 2-bromo-3-klorobutan, $\mathrm{CH_3CHBrCHClCH_3}$?
- $2$
~ To bi veljalo za en stereocenter. Tu sta stereocentra C2 in C3.
- $3$
~ Oblika mezo je možna le, če sta konca enaka; tu sta Br in Cl različna, zato je ni.
+ $4$
> Dva stereocentra in brez simetrije: $2^2 = 4$, to sta dva para enantiomerov.

:::simboli
\alpha | izmerjeni kot zasuka ravnine polarizirane svetlobe | | ° | + desno, − levo; [α] = α/(l c) je specifična rotacija
l | dolžina kivete | | dm |
c | masna koncentracija | | g/mL |
w_{RR}, w_{SS} | masna deleža (2R,3R)- in (2S,3S)-oblike | | – | v Primeru 3
s, p | orbitali s in p (v oznaki hibridizacije sp³) | | |
n | število stereocentrov | | – | stereoizomerov je največ 2ⁿ
\mathrm{ee} | enantiomerni presežek | \mathrm{ee} = \dfrac{[\alpha]}{[\alpha]_{\text{čist}}} \cdot 100\,\% | \% |
x_S | delež enantiomera (S) | x_S = \dfrac{100\,\% + \mathrm{ee}}{2} | \% | če prevladuje (S)
:::
