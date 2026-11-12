---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ornitologi pred zoro postavijo mikrofone na pet mest ob isti vasi: od pokošenega travnika do starega bukovega gozda. Na posnetkih jutranjega zbora ptic preštejejo, koliko različnih vrst poje.

Pričakovali bi, da bo najbogatejši »koncert« v najstarejšem, najbolj razvitem gozdu. Pa ni nujno tako: pogosto največ vrst zapoje v grmišču, kjer se mešajo grmi, mlada drevesa in jase. Še bolj nenavadno: posnetek z desetimi vrstami je lahko manj pester kot posnetek s petimi.

Kako travnik sam postane gozd in kako pestrost izmerimo? S tem znanjem naravovarstveniki presodijo, kateri travnik kositi in katere vrste so nenadomestljive.

## Razlaga

**1. Najprej razrešimo primer.** Pet posnetkov je kot pet fotografij istega kraja v različnih letih: vsako mesto so nehali kositi ob drugem času. Podatki so zaokroženi, za ponazoritev:

| Leta brez košnje | Kaj raste | Vrst ptic |
|---|---|---|
| 0 | trave in zelišča | 5 |
| 10 | visoke steblike, prvi grmi | 12 |
| 30 | grmišče, breze, bori | 20 |
| 80 | mlad mešan gozd | 18 |
| 200 | star bukov gozd | 15 |

:::risba stolpci
opis: Stolpčni prikaz števila vrst ptic na petih mestih: 0 let brez košnje 5 vrst, 10 let 12 vrst, 30 let 20 vrst, 80 let 18 vrst, 200 let 15 vrst. Največ vrst je pri 30 letih, v grmišču.
os: vrst ptic
korak: 5
stolpec: 0 let | 5
stolpec: 10 let | 12
stolpec: 30 let | 20
stolpec: 80 let | 18
stolpec: 200 let | 15
:::

Rastline se menjajo v stalnem zaporedju: trave, grmi, svetloljubna drevesa, na koncu bukev. Vsaka skupina spremeni razmere (senco, prst, vlago) tako, da ustrezajo naslednji.

Število vrst ptic najprej hitro naraste, ker grmi in drevesa dodajo nova nadstropja. Pozneje nekoliko pade, ker gosta senca bukev zatre podrast in z njo ptice grmovja in jas.

:::premisli
Na travniku poje 5 vrst, v grmišču 20. Zakaj novo »nadstropje« grmov ne prinese le več ptic istih vrst kot na travniku, ampak več različnih vrst? Pomisli na niše.
---
Grmi dodajo novo plast med tlemi in krošnjami: gnezdišča, zavetje pred plenilci, jagode in žuželke. Nova plast pomeni nove niše, zato lahko skupaj živi več vrst, ne da bi se izpodrivale.
:::

**2. Posplošitev: sukcesija.** Postopnemu, usmerjenemu spreminjanju združbe na istem mestu pravimo **sukcesija** (ekološko zaporedje). Vrste, ki prve naselijo prazen ali opuščen prostor, so **pionirske vrste**. Rastejo hitro, imajo veliko drobnih semen in prenesejo močno sonce.

- **Primarna sukcesija** se začne na podlagi brez prsti in brez življenja: gola skala po umiku ledenika, strjena lava, nov kamnolom. Prvi so lišaji in mahovi, ki počasi ustvarjajo prst.
- **Sekundarna sukcesija** se začne tam, kjer je prst ostala, združba pa je bila uničena ali spremenjena: opuščen travnik ali njiva, pogorišče, posek. Teče veliko hitreje, ker so v prsti že semena, korenine in razkrojevalci.

Med sukcesijo raste biomasa, prst postaja globlja. Na koncu nastane **klimaksna združba**: razmeroma stalna združba, ki ustreza podnebju in tlom kraja in se brez motenj ne spreminja več bistveno. Proizvajalci še vežejo veliko energije, a skoraj vso porabi dihanje združbe. V večjem delu Slovenije je klimaks bukov ali mešan gozd.

Klimaks ni nujno najbogatejši z vrstami, kot kaže razpredelnica. Je pa najbolj stabilen.

**3. Drugi primer: deset vrst ali pet?** Na dveh gozdnih posnetkih so našteli po 100 oglašanj (petja in klicev).

- Gozd A: 10 vrst; ščinkavec 91 oglašanj, vsaka od ostalih 9 vrst po 1.
- Gozd B: 5 vrst, vsaka po 20 oglašanj.

V gozdu A skoraj ves čas poje ščinkavec, v gozdu B se izmenjuje pet vrst. Pestrost torej ni le število vrst (**vrstna bogatost**), ampak tudi to, kako enakomerno so vrste zastopane (**izenačenost**).

Oboje združi **Simpsonov indeks pestrosti** $D$. Najprej za vsako vrsto izračunamo njen delež:

$$p_i = \frac{n_i}{N}$$

Tu je $n_i$ število oglašanj vrste $i$, $N$ pa število vseh oglašanj. Nato:

$$D = 1 - \left(p_1^2 + p_2^2 + \ldots + p_S^2\right)$$

$S$ je število vrst. $D$ pove, kolikšna je verjetnost, da dve naključno izbrani oglašanji pripadata različnima vrstama. Leži med 0 (ena sama vrsta) in skoraj 1 (veliko enako pogostih vrst).

Gozd A: deleži so $0{,}91$ in devetkrat $0{,}01$. Kvadrati: $0{,}91^2 = 0{,}8281$, devetkrat $0{,}01^2$ pa da $0{,}0009$; vsota je $0{,}829$. Torej $D_A = 1 - 0{,}829 = 0{,}171$. Gozd B: $D_B = 1 - 5 \cdot 0{,}2^2 = 0{,}8$. Gozd B je kljub manj vrstam veliko bolj pester.

:::premisli
V gozd B se priseli še šesta vrsta in vseh šest je enako pogostih. Bo $D$ večji ali manjši kot $0{,}8$? Napovej, nato preveri.
---
Večji. Vsaka vrsta ima zdaj delež $\frac{1}{6}$, zato $D = 1 - 6 \cdot \left(\frac{1}{6}\right)^2 = \frac{5}{6} \approx 0{,}83$. Več enako pogostih vrst pomeni večjo verjetnost, da sta dve naključni oglašanji različnih vrst.
:::

**4. Tri ravni biotske pestrosti.** **Biotska pestrost** (biodiverziteta) je raznolikost življenja. Opišemo jo na treh ravneh:

- **Genska pestrost** je raznolikost genov (alelov) znotraj vrste. Bukve niso genetsko enake; nekatere bolje prenesejo sušo, zato ob suhem poletju ali novi bolezni del populacije preživi. Majhne, osamljene populacije gensko pestrost izgubljajo.
- **Vrstna pestrost** je število vrst in njihova izenačenost na nekem območju. To smo merili zgoraj.
- **Ekosistemska pestrost** je raznolikost ekosistemov v pokrajini. Mozaik travnikov, mejic, gozdov in mokrišč gosti več vrst kot velika njiva, ker ima vsak ekosistem svoje vrste.

V simulacijah spodaj »Stopnje sukcesije« in »Ravni biotske pestrosti« razvrščaj primere. Opazi: razlike med osebki iste vrste (sorte, pasme) vedno spadajo h genski ravni.

**5. Ključne vrste.** Nekatere vrste imajo na ekosistem veliko večji vpliv, kot bi sklepali po njihovem številu. To so **ključne vrste**. Črna žolna je v gozdu redka, a vsako leto izdolbe nova dupla v debla. Stara dupla uporabljajo golob duplar, koconogi čuk, netopirji in polhi, ki jih sami ne znajo izdolbsti. Brez žolne ostanejo brez gnezdišč in iz gozda izgine več vrst hkrati. Podobno bober z jezovi ustvarja mokrišča za žabe, ribe in ptice.

## Rešeni primeri

### Primer 1 (lažji): deleži v grmišču

Na kratkem posnetku iz grmišča (30 let brez košnje) so našteli 40 oglašanj: črnoglavka 20, rjava penica 10, rumeni strnad 6, rjavi srakoper 4. Koliko vrst je na posnetku in kolikšen delež oglašanj pripada vsaki vrsti?

**Podatki:** $N = 40$ oglašanj; črnoglavka $n_1 = 20$, rjava penica $n_2 = 10$, rumeni strnad $n_3 = 6$, rjavi srakoper $n_4 = 4$
**Iščemo:** število vrst $S$ in deleže $p_1$ do $p_4$

:::formula
$p_i = \dfrac{n_i}{N}$
:::

**Rešitev:**

1. Vrst je toliko, kolikor je različnih imen: $S = 4$. To je vrstna bogatost.
2. $p_1 = \dfrac{20}{40} = 0{,}5$, ker črnoglavki pripada polovica oglašanj.
3. $p_2 = \dfrac{10}{40} = 0{,}25$; $p_3 = \dfrac{6}{40} = 0{,}15$; $p_4 = \dfrac{4}{40} = 0{,}1$.
4. Preverimo: $0{,}5 + 0{,}25 + 0{,}15 + 0{,}1 = 1$, ker smo zajeli vsa oglašanja.
5. Odgovor: na posnetku so 4 vrste. Črnoglavki pripada polovica oglašanj, rjavi penici četrtina, rumenemu strnadu $15\,\%$ in rjavemu srakoperju $10\,\%$.

### Primer 2: travnik ali grmišče?

Na pokošenem travniku so našteli 30 oglašanj: poljski škrjanec 24, prepelica 3, repaljščica 3. Izračunaj Simpsonov indeks za travnik in za grmišče iz primera 1. Katera stopnja sukcesije je bolj pestra?

**Podatki:** travnik: $N = 30$, oglašanj $24$; $3$; $3$. Grmišče: deleži $0{,}5$; $0{,}25$; $0{,}15$; $0{,}1$ (iz primera 1)
**Iščemo:** indeks za travnik $D_\mathrm{t}$ in za grmišče $D_\mathrm{g}$

:::formula
$p_i = \dfrac{n_i}{N}$, nato $D = 1 - \left(p_1^2 + p_2^2 + \ldots + p_S^2\right)$
:::

**Rešitev:**

1. Deleži na travniku: $\dfrac{24}{30} = 0{,}8$ in dvakrat $\dfrac{3}{30} = 0{,}1$.
2. Vsota kvadratov je $0{,}64 + 0{,}01 + 0{,}01 = 0{,}66$, zato $D_\mathrm{t} = 1 - 0{,}66 = 0{,}34$.
3. Grmišče: vsota kvadratov je $0{,}25 + 0{,}0625 + 0{,}0225 + 0{,}01 = 0{,}345$, zato $D_\mathrm{g} = 1 - 0{,}345 = 0{,}655$.
4. Zakaj razlika? Grmišče ima več vrst in bolj izenačene deleže, na travniku pa prevladuje škrjanec.
5. Odgovor: $D_\mathrm{t} = 0{,}34$ in $D_\mathrm{g} \approx 0{,}66$. Grmišče, vmesna stopnja sukcesije, je skoraj dvakrat bolj pestro.

### Primer 3 (težji): ko utihne črna žolna

V starem gozdu so našteli 40 oglašanj: ščinkavec 16, taščica 8, golob duplar 8, črna žolna 4, koconogi čuk 4. Golob duplar in koconogi čuk gnezdita skoraj samo v starih duplih črne žolne. Po poseku starih dreves žolna izgine, sčasoma pa tudi oba duplarja. Ščinkavcev in taščic je enako kot prej. Kolikšen je Simpsonov indeks pred posegom in po njem?

**Podatki:** pred posegom $N = 40$, oglašanj $16$; $8$; $8$; $4$; $4$. Po posegu ostaneta ščinkavec ($16$) in taščica ($8$)
**Iščemo:** $D_\mathrm{pred}$ in $D_\mathrm{po}$

:::formula
$p_i = \dfrac{n_i}{N}$ in $D = 1 - \left(p_1^2 + p_2^2 + \ldots + p_S^2\right)$, za vsak posnetek posebej
:::

**Rešitev:**

1. Deleži pred posegom: $0{,}4$; $0{,}2$; $0{,}2$; $0{,}1$; $0{,}1$.
2. $D_\mathrm{pred} = 1 - (0{,}16 + 0{,}04 + 0{,}04 + 0{,}01 + 0{,}01) = 0{,}74$.
3. Po posegu je vseh oglašanj manj: $N = 16 + 8 = 24$. Deleža sta $\dfrac{16}{24} = \dfrac{2}{3}$ in $\dfrac{8}{24} = \dfrac{1}{3}$.
4. Izračunaj $D_\mathrm{po}$ sam in ga primerjaj z $D_\mathrm{pred}$.

:::premisli
Koliko je $D_\mathrm{po}$ in kaj pove primerjava?
---
$D_\mathrm{po} = 1 - \left(\frac{4}{9} + \frac{1}{9}\right) = \frac{4}{9} \approx 0{,}44$. Pestrost pade z $0{,}74$ na $0{,}44$. Žolna je dala le $10\,\%$ oglašanj, a z njo izginejo 3 od 5 vrst. Zato je ključna vrsta.
:::

## Pogoste napake

- **»Klimaks ima največ vrst.«** Klimaks je najbolj stabilna stopnja, ne nujno najbogatejša; vrst je pogosto največ v vmesni stopnji. Popravek: klimaks pomeni ravnovesje s podnebjem in tlemi, ne vrha v številu vrst.
- **»Več vrst pomeni večjo pestrost.«** Gozd z 10 vrstami, kjer $91\,\%$ oglašanj pripada ščinkavcu, je manj pester ($D = 0{,}171$) kot gozd s 5 enako pogostimi vrstami ($D = 0{,}8$). Popravek: poleg števila vrst upoštevaj izenačenost.
- **»Ključna vrsta je najštevilčnejša.«** Najpogostejša vrsta je le prevladujoča. Ključna ima nesorazmerno velik vpliv: črna žolna je redka, a od njenih dupel je odvisnih več vrst. Popravek: vprašaj se, kaj bi se zgodilo z drugimi vrstami brez nje.
- **»Sekundarna sukcesija se začne na goli skali.«** Na goli skali brez prsti se začne primarna. Sekundarna se začne na ohranjeni prsti (opuščena njiva, pogorišče) in je hitrejša.
- **»Vsota deležev že pove pestrost.«** Deleži se vedno seštejejo v 1. Za $D$ jih kvadriraj, kvadrate seštej in vsoto odštej od 1.

## Povzetek

- Sukcesija je postopno, usmerjeno spreminjanje združbe na istem mestu: pionirske vrste, vmesne stopnje, klimaksna združba.
- Primarna sukcesija se začne brez prsti (gola skala, lava), sekundarna na ohranjeni prsti (opuščen travnik) in je hitrejša.
- Klimaks je stabilen in ustreza podnebju (v Sloveniji večinoma bukov gozd), ni pa nujno najbogatejši z vrstami.
- Biotska pestrost ima tri ravni: gensko (znotraj vrste), vrstno (število vrst in izenačenost) in ekosistemsko (raznolikost ekosistemov).
- Simpsonov indeks: $p_i = \dfrac{n_i}{N}$, $D = 1 - \left(p_1^2 + \ldots + p_S^2\right)$; med 0 in 1, večji pomeni bolj pestro.
- Ključna vrsta ima nesorazmerno velik vpliv na ekosistem (črna žolna, bober); z njo izgine več vrst hkrati.

## Drugače: Z analogijo

Ekosistem si predstavljaj kot glasbeno zasedbo, ki nastaja leta.

- **Sukcesija** je kot nastajanje orkestra v prazni dvorani. Najprej zaigrata bobnarja, ki ne potrebujeta ničesar (pionirji). Ko so tu odri in ozvočenje (prst, senca), se pridružijo pihala in godala. Na koncu ostane stalna zasedba (klimaks).
- **Vrstna pestrost** je število različnih glasbil in to, kako enakomerno igrajo. Deset glasbil, kjer skoraj ves čas igra samo boben, zveni bolj enolično kot pet, ki se izmenjujejo.
- **Genska pestrost** je kot sekcija violin različnih izdelovalcev: če vlaga razglasi ene, druge še igrajo.
- **Ekosistemska pestrost** so različne zasedbe v enem mestu: simfonični orkester, pihalna godba, zbor in jazzovski kvartet.
- **Ključna vrsta** je kot tonski mojster: skoraj ga ni videti, brez njega pa več glasbil ne pride do poslušalcev.

Meja analogije: glasbenike izbere dirigent, vrst nihče. Zaporedje nastane samo, ker vsaka stopnja spremeni razmere za naslednjo.

## Drugače: Bolj natančno

- **Proizvodnja in dihanje.** V mladih stopnjah biomasa združbe hitro raste. V klimaksu je bruto primarna proizvodnja skoraj enaka dihanju vseh organizmov skupaj (rastlin, živali, razkrojevalcev), zato biomasa ne raste več.
- **Zakaj vrh v sredini.** V vmesnih stopnjah sobivajo vrste odprtih površin in gozda; nobena še ne prevlada. Hipoteza srednje motnje pravi, da zmerne motnje (občasna košnja, vetrolom) ohranjajo mozaik stopenj in največ vrst. Izjeme so pragozdovi z veliko odmrlega lesa, zelo bogati z glivami, hrošči in duplarji.
- **Klimaks ni večen.** Požar, vetrolom ali žled vrnejo sukcesijo na začetek, zato je pokrajina mozaik stopenj.
- **Druge mere.** Ekologi uporabljajo tudi Shannonov indeks; oba rasteta s številom vrst in izenačenostjo. Danes programi iz zvočnih posnetkov samodejno prepoznavajo vrste ptic, žab in žuželk.

## Preveri se

? Na dnu opuščenega kamnoloma je gola skala. Prvi jo naselijo lišaji, ki počasi ustvarjajo prst. Kako imenujemo ta proces?
- sekundarna sukcesija
~ Sekundarna se začne na ohranjeni prsti (opuščen travnik, pogorišče). Na goli skali prsti ni.
+ primarna sukcesija
- klimaksna združba
~ Klimaks je končna, stabilna stopnja sukcesije, ne njen začetek z lišaji.
> Primarna sukcesija se začne na podlagi brez prsti in brez življenja. Lišaji in mahovi so pionirji, ki pripravijo prst za naslednje vrste.

? Travnik v slovenskem gričevju nehamo kositi. Kateri vrstni red stopenj je pravilen?
- bukov gozd → breze in bori → grmi → travnik
~ To je zaporedje nazaj. Sukcesija se začne pri travniku in konča pri klimaksu.
- travnik → bukov gozd → breze in bori → grmi
~ Bukev potrebuje senco in razvito prst, ki ju pripravijo prejšnje stopnje, zato ne pride takoj za travnikom.
+ travnik → visoke steblike in grmi → breze in bori → bukov gozd
- travnik → grmi → travnik → grmi, brez konca
~ Brez motenj sukcesija ne kroži, ampak teče v eno smer proti klimaksu. Na začetek jo vrne šele košnja ali drug poseg.
> Vsaka stopnja spremeni razmere za naslednjo. Svetloljubne breze in bori naredijo senco, v kateri vzklije bukev, klimaksna vrsta večjega dela Slovenije.

? Kaj se zgodi v gozdu, če iz njega izgine črna žolna, ki je sicer redka?
- Skoraj nič, ker je žoln malo in na gozd ne vplivajo.
~ Število osebkov ne pove vpliva. Ključna vrsta je lahko redka, pa so od nje odvisne druge vrste.
+ Postopno izginejo tudi vrste, ki gnezdijo v njenih starih duplih, npr. golob duplar in koconogi čuk.
- Pestrost naraste, ker je v gozdu manj tekmovanja.
~ Duplarji z žolno ne tekmujejo, ampak so odvisni od njenih dupel. Ko izginejo, je vrst manj in pestrost pade.
> Črna žolna je ključna vrsta: dolbe dupla, ki jih druge vrste same ne znajo narediti. Z njo izgine več vrst hkrati (primer 3).

? Na posnetku je 10 oglašanj: 6 ščinkavca, 3 taščice in 1 črnoglavke. Koliko je Simpsonov indeks $D$?
- $3$
~ To je število vrst (vrstna bogatost), ne indeks. $D$ upošteva tudi deleže in leži med 0 in 1.
- $0{,}46$
~ To je samo vsota kvadratov deležev. Indeks je 1 minus ta vsota.
+ $0{,}54$
- $1$
~ To je vsota deležev $0{,}6 + 0{,}3 + 0{,}1$, ki je vedno 1. Deleže je treba najprej kvadrirati.
> Deleži so $0{,}6$; $0{,}3$; $0{,}1$. Vsota kvadratov je $0{,}36 + 0{,}09 + 0{,}01 = 0{,}46$, zato $D = 1 - 0{,}46 = 0{,}54$.

? V gozdu A živijo 4 vrste z deleži $0{,}7$; $0{,}1$; $0{,}1$; $0{,}1$. V gozdu B živijo 3 enako pogoste vrste. Kateri gozd je po Simpsonovem indeksu bolj pester?
- Gozd A, ker ima več vrst.
~ Število vrst ni vse. V gozdu A prevladuje ena vrsta, zato je $D_A = 0{,}48$ manjši.
+ Gozd B, ker je $D_B \approx 0{,}67$ večji od $D_A = 0{,}48$.
- Oba enako, ker se deleži v obeh gozdovih seštejejo v 1.
~ Vsota deležev je vedno 1. Gozdova se razlikujeta v vsoti kvadratov deležev.
> $D_A = 1 - (0{,}49 + 0{,}01 + 0{,}01 + 0{,}01) = 0{,}48$ in $D_B = 1 - 3 \cdot \left(\frac{1}{3}\right)^2 \approx 0{,}67$. Izenačenost v gozdu B odtehta eno vrsto manj.

<<RACUN
vrednost: 1-(0.91^2+9*0.01^2) | 0.171
vrednost: 1-5*0.2^2 | 0.8
vrednost: 1-6*(1/6)^2 | 0.83
vrednost: 20/40 | 0.5
vrednost: 10/40 | 0.25
vrednost: 6/40 | 0.15
vrednost: 4/40 | 0.1
vrednost: 24/30 | 0.8
vrednost: 1-(0.8^2+2*0.1^2) | 0.34
vrednost: 1-(0.5^2+0.25^2+0.15^2+0.1^2) | 0.655
vrednost: 1-(0.4^2+2*0.2^2+2*0.1^2) | 0.74
vrednost: 1-((16/24)^2+(8/24)^2) | 0.44
vrednost: 1-(0.6^2+0.3^2+0.1^2) | 0.54
vrednost: 1-(0.7^2+3*0.1^2) | 0.48
vrednost: 1-3*(1/3)^2 | 0.67
>>

:::simboli
p_i | delež vrste $i$ | p_i = \dfrac{n_i}{N} | – | med 0 in 1
p_1, p_2, p_S | deleži posameznih vrst | | – |
n_i | število oglašanj vrste $i$ | | – |
N | število vseh oglašanj na posnetku | | – |
D | Simpsonov indeks pestrosti | D = 1 - \left(p_1^2 + p_2^2 + \ldots + p_S^2\right) | – | med 0 in 1; večji pomeni bolj pestro
S | število vrst (vrstna bogatost) | | – |
:::
