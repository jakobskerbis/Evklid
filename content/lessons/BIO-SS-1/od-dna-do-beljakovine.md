---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Doma lahko v desetih minutah vidiš DNA s prostim očesom. Zmečkaj dve jagodi v vrečki. Dodaj pol kozarca vode z žličko soli in žličko detergenta za posodo ter vse precedi skozi kavni filter. Ob steni kozarca previdno nalij še enako količino zelo hladnega alkohola (špirit iz hladilnika). Na meji med plastema se v nekaj minutah naberejo bele, sluzaste niti. To je DNA milijonov jagodnih celic.

Ta bela sluz sama ne naredi ničesar. Je zapis, kot aplikacija, ki je v pomnilniku telefona shranjena kot zaporedje ničel in enic. Celica svoj zapis prebere in po njem sestavi beljakovine: encime, ki si jih že spoznal, hemoglobin, keratin v laseh. V nadaljevanju sledimo tej poti: od zaporedja »črk« v DNA do gotove beljakovine.

## Razlaga

**1. Nukleotid, ena črka zapisa.** DNA (deoksiribonukleinska kislina) je dolga veriga **nukleotidov**. Vsak nukleotid ima tri dele: sladkor **deoksiribozo**, **fosfatno skupino** in eno od štirih **dušikovih baz**: adenin (A), timin (T), gvanin (G) ali citozin (C). Sladkor in fosfat se izmenjujeta in tvorita ogrodje verige. Baze štrlijo vstran. Njihovo zaporedje je informacija.

*Hitri preizkus:* kateri del nukleotida nosi informacijo? (Baza.)

**2. Dvojna vijačnica.** Molekula DNA ima dve verigi, zviti v **dvojno vijačnico**, kot zasukana lestev. Prečke lestve so pari baz. Baze se parijo vedno enako: A z T in G s C. Takim parom rečemo **komplementarni pari**. Med A in T sta dve vodikovi vezi, med G in C tri. Zaradi pravila parjenja zaporedje ene verige natanko določa drugo. Iz tega sledi tudi, da je v DNA adenina toliko kot timina in gvanina toliko kot citozina.

*Hitri preizkus:* ena veriga se glasi AGGT. Kakšna je nasprotna? (TCCA.)

**3. RNA, delovna kopija.** RNA (ribonukleinska kislina) je druga vrsta nukleinske kisline. Od DNA se loči v treh lastnostih:

| Lastnost | DNA | RNA |
|---|---|---|
| sladkor | deoksiriboza | riboza |
| baze | A, T, G, C | A, **U**, G, C |
| verigi | dve | ena |

Namesto timina ima RNA **uracil** (U), ki se parja z A. Vrste RNA: **informacijska** (mRNA) nese prepis gena, **prenašalna** (tRNA) prinaša aminokisline, **ribosomska** (rRNA) gradi ribosome.

*Hitri preizkus:* s katero bazo se v RNA parja adenin? (Z uracilom.)

**4. Podvojevanje DNA.** Ob delitvi mora vsaka hčerinska celica dobiti celoten zapis. Zato se DNA pred delitvijo **podvoji**. Encim helikaza razpre dvojno vijačnico kot zadrgo. Ob vsaki stari verigi encim **DNA-polimeraza** po pravilu parjenja dodaja nove nukleotide. Nastaneta dve enaki molekuli. Vsaka ima eno staro in eno novo verigo, zato pravimo, da je podvojevanje **semikonzervativno** (napol ohranjevalno).

:::premisli
Raziskovalec bakterijam DNA označi tako, da obe verigi »svetita«. Nato se DNA v neoznačenem gojišču enkrat podvoji. Sošolec napove, da bo ena nova molekula svetila v celoti, druga pa sploh ne. Ima prav? Koliko molekul v resnici sveti in kako?
---
Obe, a vsaka le na pol: ima eno staro (svetlečo) in eno novo (temno) verigo. Stari verigi se nikoli ne združita nazaj.
:::

**5. Gen in genetski kod.** **Gen** je odsek DNA, ki nosi navodilo za eno beljakovino (ali za eno molekulo RNA). Beljakovine so zgrajene iz $20$ vrst aminokislin. Ena baza ne more določiti ene aminokisline, saj so baze le štiri. Dve bazi zapored dasta

$$4^2 = 16$$

kombinacij, kar je še vedno premalo. Tri baze dajo

$$4^3 = 64$$

kombinacij, kar je dovolj. Trojček baz na mRNA, ki določa eno aminokislino, je **kodon**. Pravilo, kateri kodon pomeni katero aminokislino, je **genetski kod**. Ker je kodonov več kot aminokislin, ima večina aminokislin več kodonov; kod je **izrojen**. Kodon AUG pomeni metionin in hkrati začetek (**start**). Kodoni UAA, UAG in UGA ne pomenijo nobene aminokisline, ampak konec (**stop**). Kod je skoraj enak pri bakterijah, rastlinah in ljudeh, zato pravimo, da je **univerzalen**.

*Hitri preizkus:* koliko baz mRNA določa zaporedje $10$ aminokislin? ($30$, brez stop kodona.)

:::premisli
Nekdo predlaga, da bi zadoščali kodoni iz dveh baz, če bi porabili čisto vse kombinacije. Koliko aminokislin bi ostalo brez kodona in kaj bi celica še pogrešala?
---
Dve bazi dasta le $16$ različnih kodonov, aminokislin pa je $20$. Vsaj štiri aminokisline ne bi imele svojega kodona, poleg tega ne bi ostal noben kodon za stop.
:::

**6. Prepis (transkripcija).** DNA ostane v jedru, beljakovine pa nastajajo v citoplazmi. Zato celica naredi delovno kopijo gena. Encim **RNA-polimeraza** na mestu gena razpre DNA in ob eni verigi, **matrični**, sestavi mRNA po pravilu parjenja: nasproti A postavi U, nasproti T postavi A, nasproti G postavi C, nasproti C postavi G. Pri evkariontih se mRNA še uredi: iz nje se izrežejo odseki, ki ne nosijo navodila (introni). Zrela mRNA skozi jedrne pore odpotuje v citoplazmo.

*Hitri preizkus:* matrična veriga je TAC. Kaj je na mRNA? (AUG.)

**7. Prevod (translacija).** V citoplazmi se na mRNA pripne **ribosom**. Bere jo kodon za kodonom, od start do stop kodona. Vsaka tRNA ima na enem koncu **antikodon**, tri baze, ki se parijo s kodonom, na drugem pa ustrezno aminokislino. Ribosom sosednji aminokislini poveže s **peptidno vezjo**. Ko pride do stop kodona, se veriga aminokislin sprosti in se zvije v beljakovino. Prevod porablja energijo iz ATP in njemu sorodne molekule GTP.

Preveri to v simulaciji »Prepis in prevod« spodaj: sproži prepis in opazuj, katera baza pride na mRNA nasproti adenina. Pri prevodu opazi: ko se ribosom premakne za tri baze, se veriga podaljša za eno aminokislino.

*Hitri preizkus:* kje v evkariontski celici poteka prevod? (V citoplazmi, na ribosomih.)

**8. Uravnavanje izražanja genov.** Vse celice tvojega telesa imajo enako DNA. Vendar jetrna celica izdeluje druge beljakovine kot mišična. Razlog je, da vsaka celica prepisuje le del svojih genov. Gen, ki se prepisuje, je **izražen** (»vklopljen«). Celica gene vklaplja in izklaplja predvsem pri prepisu: posebne beljakovine se vežejo na DNA pred genom in RNA-polimerazi prepis omogočijo ali preprečijo.

Primer je bakterija *E. coli*. Gen za encim, ki razgrajuje mlečni sladkor laktozo, prepisuje le, kadar je laktoza v okolju, in tako ne troši energije zaman. Tudi telefon ima nameščenih veliko aplikacij, odprte pa so le tiste, ki jih rabiš.

## Rešeni primeri

### Primer 1: deleži baz

Prenosni sekvenator, naprava velikosti telefona, izmeri, da je v vzorcu dvoverižne DNA $22\,\%$ adenina. Kolikšni so deleži timina, gvanina in citozina?

**Podatki:** delež adenina $A = 22\,\%$, DNA je dvoverižna
**Iščemo:** deleže $T$, $G$ in $C$

:::formula
Pravilo parjenja (enačbi za dvoverižno DNA): $A = T$ in $G = C$, skupaj $A + T + G + C = 100\,\%$.
:::

**Rešitev:**

1. Vsak A je v paru s T, zato je timina prav toliko: $T = 22\,\%$.
2. Na G in C skupaj ostane $100\,\% - 2 \cdot 22\,\% = 56\,\%$.
3. G in C sta v parih, zato si ostanek razdelita na pol: $G = C = 56\,\% / 2 = 28\,\%$.
4. Odgovor: v vzorcu je $22\,\%$ timina, $28\,\%$ gvanina in $28\,\%$ citozina.

### Primer 2: od gena do verige aminokislin

Odsek matrične verige DNA se glasi TAC CAA GTT ACT. Iz tabele genetskega koda potrebuješ: AUG = metionin, GUU = valin, CAA = glutamin, UGA = stop. Zapiši mRNA, antikodone tRNA in zaporedje aminokislin.

**Podatki:** matrična veriga TAC CAA GTT ACT; kodoni AUG, GUU, CAA, UGA iz tabele
**Iščemo:** mRNA, antikodone in aminokisline

:::formula
Prepis: nasproti A pride U, nasproti T pride A, nasproti G pride C, nasproti C pride G. Antikodon je komplementaren kodonu. Kodon prevedeš s tabelo.
:::

**Rešitev:**

1. Prepis, baza za bazo: TAC → AUG, CAA → GUU, GTT → CAA, ACT → UGA. mRNA: AUG GUU CAA UGA. Nasproti A vedno pišemo U, ker RNA nima timina.
2. Antikodoni so komplementarni kodonom: UAC, CAA, GUU. Za UGA tRNA ni, ker je stop kodon.
3. Prevod s tabelo: AUG = metionin (start), GUU = valin, CAA = glutamin, UGA = stop.
4. Odgovor: mRNA je AUG GUU CAA UGA, nastane veriga metionin–valin–glutamin.

### Primer 3: genom v pomnilniku telefona

Človeški genom (en komplet kromosomov) ima približno $3{,}2 \cdot 10^9$ baznih parov. Koliko prostora bi zasedel kot računalniška datoteka, če vsako bazo zapišemo z dvema bitoma ($00$ = A, $01$ = C, $10$ = G, $11$ = T)? Ali bi šel na telefon s pomnilnikom $128\,\text{GB}$?

**Podatki:** $n = 3{,}2 \cdot 10^9$ baznih parov, $2$ bita na bazo, $1\,\text{bajt} = 8\,\text{bitov}$, $1\,\text{GB} = 10^9\,\text{bajtov}$, pomnilnik $128\,\text{GB}$
**Iščemo:** velikost zapisa $z$ in koliko genomov gre na telefon

:::formula
$b = 2 \cdot n$ (biti), nato $z = \dfrac{b}{8}$ (bajti)
:::

**Rešitev:**

1. Shraniti moramo le eno verigo. Druga je s pravilom parjenja natanko določena, zato je odvečna.
2. Za vsako bazo potrebujemo $2$ bita, ker sta $2$ bita ravno $4$ kombinacije: $b = 2 \cdot 3{,}2 \cdot 10^9 = 6{,}4 \cdot 10^9$ bitov.
3. Pretvori v bajte in primerjaj s telefonom. Izračunaj sam, nato preveri.

:::premisli
Koliko bajtov je to in kolikokrat bi genom šel na telefon s $128\,\text{GB}$?
---
$z = 6{,}4 \cdot 10^9 / 8 = 8 \cdot 10^8$ bajtov, kar je $800\,\text{MB}$ ali $0{,}8\,\text{GB}$. Na telefon bi ga shranil $128 / 0{,}8 = 160$-krat. Celoten zapis za človeka je torej manjši od daljšega filma v visoki ločljivosti.
:::

## Pogoste napake

- **T v mRNA.** Pri prepisu nekateri nasproti A napišejo T. RNA nima timina, ima uracil. Nasproti A v DNA je na mRNA vedno U.
- **Ena baza, ena aminokislina.** Kdor tako misli, za $100$ aminokislin pričakuje $100$ baz. Aminokislino določa kodon iz treh baz, zato je baz trikrat toliko, in še stop kodon.
- **Prevod v jedru.** Ker je DNA v jedru, se zdi, da tam nastajajo tudi beljakovine. V jedru poteka le prepis. Prevod poteka na ribosomih v citoplazmi, kamor pride mRNA skozi jedrne pore.
- **Kodon in antikodon zamenjana.** Kodon je na mRNA, antikodon na tRNA. Sta komplementarna, zato je antikodon za kodon AUG UAC, ne AUG.
- **Različne celice, različni geni.** Mišična in jetrna celica nimata različne DNA. Imata iste gene, a izražata različne.

## Povzetek

- DNA je dvojna vijačnica iz nukleotidov (deoksiriboza, fosfat, baza A, T, G ali C); baze se parijo A–T in G–C.
- RNA je enoverižna, ima ribozo in uracil namesto timina; mRNA, tRNA in rRNA imajo različne vloge.
- Pred delitvijo celice se DNA podvoji semikonzervativno: vsaka nova molekula ima eno staro in eno novo verigo.
- Gen je odsek DNA z navodilom za beljakovino. Kodon so tri baze mRNA ($4^3 = 64$ kodonov za $20$ aminokislin); AUG je start, UAA, UAG, UGA so stop. Kod je izrojen in univerzalen.
- Prepis: v jedru RNA-polimeraza ob matrični verigi DNA sestavi mRNA. Prevod: v citoplazmi ribosom bere kodone, tRNA z antikodoni prinašajo aminokisline.
- Vse celice telesa imajo enako DNA, a vsaka izraža le del genov; izražanje se uravnava predvsem pri prepisu.

## Drugače: Na sliki

Pot informacije gre v eno smer: DNA → mRNA → beljakovina.

:::risba skica
opis: Celica z jedrom levo in citoplazmo desno. V jedru je DNA, puščica »prepis« vodi do mRNA. Puščica gre skozi jedrno poro v citoplazmo do ribosoma. Puščica »prevod« vodi od ribosoma do verige aminokislin.
območje: 0; 0 .. 10; 5
enota: 30
pravokotnik: 0,3; 0,5 .. 4,5; 4,5 | modra
napis: 2,4; 4,1 | jedro | sredina
napis: 1,3; 3 | DNA | sredina | debelo
puščica: 1,7; 3 -> 3,1; 3 | prepis | nad
napis: 3,6; 3 | mRNA | sredina | debelo
puščica: 3,6; 2,6 -> 5,6; 1,6 | skozi poro | pod
napis: 7,5; 4,1 | citoplazma | sredina
krog: 6,2; 1,6 | 0,5 | oranžna
napis: 6,2; 0,7 | ribosom | pod
puščica: 6,8; 1,6 -> 8,2; 2,8 | prevod | desno
napis: 8,7; 3,3 | beljakovina | sredina | debelo
:::

Jedro je knjižnica, iz katere knjig ne smeš odnesti. Prepis je fotokopija ene strani (gena), ki gre skozi poro ven. Ribosom jo bere po tri črke in za vsako trojko doda pravi gradnik.

## Drugače: Bolj natančno

Vsaka veriga DNA ima smer. Konca imenujemo $5'$ in $3'$ (po ogljikovih atomih deoksiriboze). Verigi v dvojni vijačnici sta **antiparalelni**: ena teče od $5'$ proti $3'$, druga obratno. Polimeraze dodajajo nukleotide le na konec $3'$, zato se pri podvojevanju ena nova veriga gradi neprekinjeno, druga v kratkih odsekih, ki jih poveže encim ligaza.

Evkariontski gen ima **eksone**, ki ostanejo v zreli mRNA, in **introne**, ki se izrežejo. Eno mRNA hkrati prevaja več ribosomov.

Prokarionti nimajo jedra, zato prepis in prevod potekata hkrati v citoplazmi. Gene iste presnovne poti imajo pogosto zaporedne, z enim stikalom pred njimi: **operon**, na primer laktozni operon pri *E. coli*.

## Preveri se

? Katera vrstica pravilno opisuje RNA?
- deoksiriboza; baze A, T, G, C; dve verigi
~ To je opis DNA. RNA ima ribozo, uracil in eno verigo.
+ riboza; baze A, U, G, C; ena veriga
- riboza; baze A, T, G, C; dve verigi
~ Riboza je pravilna, a RNA nima timina, ampak uracil, in je enoverižna.
- deoksiriboza; baze A, U, G, C; ena veriga
~ Uracil in ena veriga sta pravilna, sladkor pa ne: v RNA je riboza.
> RNA ima ribozo, uracil (U) namesto timina in je ena sama veriga.

? Beljakovina ima $300$ aminokislin. Koliko nukleotidov ima del mRNA od start kodona do vključno stop kodona?
- $300$
~ To velja, če ena baza določa eno aminokislino. Aminokislino določa kodon iz treh baz.
- $600$
~ To bi bilo pri kodonih iz dveh baz, ki dajo le $16$ kombinacij, premalo za $20$ aminokislin.
+ $903$
- $100$
~ Število aminokislin si delil s tri namesto množil. Vsaka aminokislina potrebuje tri baze.
> $300 \cdot 3 = 900$ nukleotidov za aminokisline (prva je metionin iz start kodona) in še $3$ za stop kodon, skupaj $903$.

? Zakaj mišična celica izdeluje drugačne beljakovine kot jetrna, čeprav sta iz istega človeka?
- Ker ima mišična celica druge gene kot jetrna.
~ Vse telesne celice imajo enako DNA. Razlika ni v genih, ampak v tem, kateri se prepisujejo.
+ Ker vsaka celica prepisuje le del genov; v vsaki so vklopljeni drugi.
- Ker se v mišični celici mRNA prevaja v jedru, v jetrni pa v citoplazmi.
~ Prevod poteka v obeh celicah na ribosomih v citoplazmi.
- Ker se genetski kod v različnih celicah bere drugače.
~ Kod je enak v vseh celicah telesa in skoraj enak pri vseh organizmih. Isti kodon v mišični in jetrni celici pomeni isto aminokislino.
> To je uravnavanje izražanja genov: celice imajo isto DNA, a vsaka izraža le gene, ki jih potrebuje.

? Antikodon na tRNA je UAC. Kakšen je ustrezni trojček na matrični verigi DNA?
- AUG
~ AUG je kodon na mRNA. DNA nima uracila.
- ATG
~ ATG je na nematrični verigi, ki je komplementarna matrični. Matrična je komplementarna mRNA.
+ TAC
- UAC
~ Zaporedje je pravo, vendar DNA nima uracila; namesto U je T.
> Antikodon UAC se parja s kodonom AUG. Kodon AUG nastane s prepisom matričnega trojčka TAC. Antikodon in matrična veriga se razlikujeta le v U in T.

? Bakterijam vstavijo človeški gen za inzulin in bakterije izdelujejo človeški inzulin. Kaj to pokaže?
+ Genetski kod je univerzalen: bakterija bere človeške kodone tako kot človeška celica.
- Bakterije imajo gen za inzulin že same od sebe.
~ Bakterije gena za človeški inzulin nimajo; zato so ga vstavili.
- Inzulin se v bakteriji podvoji kot DNA.
~ Podvaja se DNA, ne beljakovina. Inzulin nastane s prepisom in prevodom vstavljenega gena.
- Bakterije beljakovine izdelujejo v jedru, tako kot človek.
~ Bakterije jedra nimajo, prevod pa tudi pri človeku ne poteka v jedru, ampak v citoplazmi.
> Ker isti kodoni pri vseh organizmih pomenijo iste aminokisline, bakterija po človeškem genu sestavi enako beljakovino. Tako danes izdelujejo inzulin za zdravljenje sladkorne bolezni.

<<RACUN
vrednost: 100-2*22 | 56
vrednost: (100-2*22)/2 | 28
vrednost: 4^2 | 16
vrednost: 4^3 | 64
vrednost: 2*3.2*10^9 | 6.4*10^9
vrednost: 6.4*10^9/8 | 8*10^8
vrednost: 128/0.8 | 160
vrednost: 300*3+3 | 903
vrednost: 10*3 | 30
>>

:::simboli
A | delež adenina v DNA | A = T | \% | velja za dvoverižno DNA
T | delež timina v DNA | T = A | \% |
G | delež gvanina v DNA | G = C | \% |
C | delež citozina v DNA | C = G | \% |
n | število baznih parov genoma | | – |
b | število bitov zapisa | b = 2 \cdot n | bit | dva bita na bazo
z | velikost zapisa v bajtih | z = \dfrac{b}{8} | B | $1\,\text{B} = 8$ bitov
:::
