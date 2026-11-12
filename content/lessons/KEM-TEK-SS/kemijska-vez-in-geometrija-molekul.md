---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vremenska aplikacija na telefonu zjutraj kaže $8\,\mathrm{°C}$, relativno vlago $95\,\%$ in opozorilo za meglo. V istem zraku je približno $420\,\mathrm{ppm}$ ogljikovega dioksida. Molekula $\mathrm{CO_2}$ ($M = 44\,\mathrm{g/mol}$) je skoraj dvainpolkrat težja od molekule vode ($M = 18\,\mathrm{g/mol}$). Težje molekule navadno laže preidejo v tekočino ali trdnino. Pa vendar se vodna para pri $8\,\mathrm{°C}$ zbira v kapljice megle, ogljikov dioksid pa ostane plin vse do $-78\,\mathrm{°C}$, ko se pri normalnem tlaku spremeni v suhi led.

Obe molekuli imata tri atome in obe imata polarne vezi. Razlika se skriva v obliki: voda je upognjena, ogljikov dioksid raven. Iz oblike sledi, ali je molekula polarna, iz polarnosti pa, kako močno se molekule privlačijo. V tej temi boš iz formule napovedal obliko, kot med vezmi, polarnost in hibridizacijo, tudi za molekule, kot sta $\mathrm{SF_4}$ in $\mathrm{XeF_2}$, ki jih tekmovalne naloge rade postavijo pred te.

## Razlaga

**1. Lewisova struktura: staro in novo.** Lewisovo strukturo že znaš narisati: vezni pari med atomi, nevezni pari ob atomih, okoli vsakega atoma osem elektronov. Na tekmovalni ravni se slika v nekaj točkah razširi ($\mathrm{BF_3}$ ima okoli bora 6 elektronov, $\mathrm{SF_6}$ okoli žvepla 12):

| | Že znaš | Novo |
|---|---|---|
| oktet | vedno 8 | tudi 6, 10 ali 12 |
| struktura | ena | resonanca |
| izbira | po občutku | formalni naboj |

Postopek: seštej valenčne elektrone vseh atomov (anionu prištej, kationu odštej naboj). V sredino postavi najmanj elektronegativen atom, vodik nikoli. Dopolni oktete zunanjih atomov, ostanek daj osrednjemu. Če osrednjemu manjka do okteta, prestavi nevezni par zunanjega atoma v dvojno vez.

Včasih lahko dvojno vez narišeš na več enakovrednih mestih, na primer pri ozonu $\mathrm{O_3}$. Vse te strukture so **resonančne**: prava molekula je njihovo povprečje, obe vezi $\mathrm{O{-}O}$ sta enaki.

**Formalni naboj** $q_\mathrm{f}$ pove, koliko elektronov ima atom v strukturi manj ali več, kot bi jih imel sam:

$$q_\mathrm{f} = V - N - \frac{B}{2}$$

Tu je $V$ število valenčnih elektronov prostega atoma, $N$ število neveznih elektronov ob njem in $B$ število elektronov v njegovih vezeh. Najboljša je struktura z najmanjšimi formalnimi naboji, negativni pa naj bo na bolj elektronegativnem atomu.

**2. Od ploske risbe do prostora.** Lewisova struktura je kot zemljevid podzemne železnice: pove, kaj je s čim povezano, ne pa, kje kaj leži. Metan na papirju narišemo s koti $90°$, v resnici pa so koti $109{,}5°$. Prostorsko obliko napove model **VSEPR** (odboj elektronskih parov valenčne lupine). **Elektronska domena** je vsako območje elektronov okoli osrednjega atoma: enojna, dvojna ali trojna vez šteje kot ena domena, prav tako vsak nevezni par. Domene se odbijajo in se razporedijo čim dlje narazen.

Število neveznih parov $E$ na osrednjem atomu dobiš brez risanja:

$$E = \frac{V - \sum p - q}{2}$$

$V$ so valenčni elektroni osrednjega atoma, $p$ pove, koliko elektronov potrebuje vsak vezani atom do okteta ($1$ za $\mathrm{H}$ in halogene, $2$ za $\mathrm{O}$ in $\mathrm{S}$), $q$ je naboj delca s predznakom. Če je na osrednji atom vezanih $X$ atomov, je število domen

$$N_\mathrm{d} = X + E$$

Zadnji stolpec tabele, hibridizacijo, razložimo v 5. točki.

| $N_\mathrm{d}$ | razporeditev | kot | hibrid |
|---|---|---|---|
| 2 | linearna | $180°$ | $sp$ |
| 3 | trikotna | $120°$ | $sp^2$ |
| 4 | tetraedrska | $109{,}5°$ | $sp^3$ |
| 5 | bipiramida | $90°$, $120°$ | $sp^3d$ |
| 6 | oktaedrska | $90°$ | $sp^3d^2$ |

**3. Razporeditev domen ni oblika molekule.** Obliko poimenujemo le po atomih, nevezni pari so nevidni. Pri amonijaku tvorijo atomi trikotno piramido: dušik je na vrhu, trije vodiki v osnovni ploskvi. Metan, amonijak in voda imajo vsi po štiri domene, a različne oblike:

| Molekula | $X$ | $E$ | Oblika |
|---|---|---|---|
| $\mathrm{CH_4}$ | 4 | 0 | tetraeder, $109{,}5°$ |
| $\mathrm{NH_3}$ | 3 | 1 | piramida, $107°$ |
| $\mathrm{H_2O}$ | 2 | 2 | kotna, $104{,}5°$ |

Nevezni par drži le eno jedro, zato je širši od veznega in stisne vezi skupaj. Več neveznih parov pomeni manjši kot.

Trikotna bipiramida ima dve osni legi (zgoraj in spodaj) in tri ekvatorialne (v trikotniku okoli sredine). Pri petih domenah gredo nevezni pari v ekvatorialne lege, kjer imajo pod kotom $90°$ le dve sosednji domeni namesto treh.

:::premisli
$\mathrm{BCl_3}$ in $\mathrm{PCl_3}$ imata enako splošno formulo $\mathrm{AX_3}$. Napovej obliko obeh.
---
Bor: $E = \frac{3 - 3}{2} = 0$, tri domene, trikotna ravninska oblika s koti $120°$. Fosfor: $E = \frac{5 - 3}{2} = 1$, štiri domene, trikotna piramida. Enaka formula še ne pomeni enake oblike.
:::

**4. Polarnost vezi in polarnost molekule.** Polarnost vezi že poznaš: večja ko je razlika elektronegativnosti, bolj je skupni par pomaknjen k enemu atomu. Vez opišemo z dipolnim momentom $\mu_\mathrm{v}$ v enoti debye ($\mathrm{D}$). Novo je, da je dipolni moment *molekule* vektorska vsota dipolnih momentov vezi. Za kotno molekulo $\mathrm{AX_2}$ s kotom $\theta$ se vodoravni komponenti odštejeta, navpični pa seštejeta:

$$\mu = 2\,\mu_\mathrm{v}\cos\frac{\theta}{2}$$

Pri $\theta = 180°$ je $\cos 90° = 0$, zato je $\mathrm{CO_2}$ nepolaren, čeprav je vez $\mathrm{C{=}O}$ polarna ($\Delta\chi = 3{,}44 - 2{,}55 = 0{,}89$). Simetrične oblike z enakimi zunanjimi atomi (linearna, trikotna ravninska, tetraeder, kvadrat, oktaeder, bipiramida) so nepolarne.

:::premisli
$\mathrm{CCl_4}$ in $\mathrm{CHCl_3}$ sta oba tetraedra s polarnimi vezmi. Kateri je polaren in zakaj?
---
Pri $\mathrm{CCl_4}$ so štirje enaki dipoli razporejeni simetrično in se odštejejo. Pri $\mathrm{CHCl_3}$ je en klor zamenjan z vodikom, katerega vez s C je skoraj nepolarna. Simetrija se poruši, vsota dipolov ni več nič.
:::

**5. Hibridizacija.** Orbitale $s$ in $p$ poznaš iz prejšnje teme. Ogljik ima konfiguracijo $2s^2\,2p^2$, tri orbitale $p$ pa ležijo med seboj pod kotom $90°$. S takimi orbitalami bi ogljik tvoril vezi pod $90°$, ena bi bila drugačna od ostalih. Metan pa ima štiri enake vezi pod $109{,}5°$.

Rešitev je **hibridizacija**: ena orbitala $s$ in tri orbitale $p$ se zmešajo v štiri enake hibridne orbitale $sp^3$. Število hibridnih orbital je vedno enako številu domen $N_\mathrm{d}$.

Vez $\sigma$ leži na zveznici obeh jeder. Vez $\pi$ nastane, ko se nehibridizirani orbitali $p$ prekrijeta bočno, nad in pod to zveznico. Dvojna vez je zato ena vez $\sigma$ in ena $\pi$, trojna ena $\sigma$ in dve $\pi$. Zapisa $sp^3d$ in $sp^3d^2$ sta poenostavitev, ki jo tekmovanja še uporabljajo.

## Rešeni primeri

### Primer 1: ogljikov dioksid v ozračju

Za $\mathrm{CO_2}$ primerjaj strukturi $\mathrm{O{=}C{=}O}$ in $\mathrm{O{\equiv}C{-}O}$ s formalnimi naboji. Nato določi obliko in hibridizacijo ogljika.

**Podatki:** $\mathrm{CO_2}$; $V(\mathrm{C}) = 4$, $V(\mathrm{O}) = 6$; strukturi $\mathrm{O{=}C{=}O}$ in $\mathrm{O{\equiv}C{-}O}$
**Iščemo:** formalne naboje, boljšo strukturo, obliko, hibridizacijo C

:::formula
$q_\mathrm{f} = V - N - \dfrac{B}{2}$; $N_\mathrm{d} = X + E$
:::

**Rešitev:**

1. Valenčnih elektronov je $4 + 2 \cdot 6 = 16$; obe strukturi jih imata 16.
2. $\mathrm{O{=}C{=}O}$: vsak kisik ima 4 nevezne in 4 vezne elektrone, $q_\mathrm{f} = 6 - 4 - 2 = 0$. Ogljik: $q_\mathrm{f} = 4 - 0 - 4 = 0$.
3. $\mathrm{O{\equiv}C{-}O}$: kisik s trojno vezjo ima $q_\mathrm{f} = 6 - 2 - 3 = 1$, kisik z enojno $q_\mathrm{f} = 6 - 6 - 1 = -1$, ogljik $0$.
4. Prva struktura nima formalnih nabojev, zato je boljša.
5. Ogljik ima 2 vezana atoma in nič neveznih parov: $N_\mathrm{d} = 2 + 0 = 2$, ker dvojna vez šteje kot ena domena.
6. Odgovor: $\mathrm{O{=}C{=}O}$ z ničelnimi formalnimi naboji; molekula je linearna ($180°$), ogljik je hibridiziran $sp$.

### Primer 2: žveplov tetrafluorid

Določi obliko, hibridizacijo žvepla in polarnost molekule $\mathrm{SF_4}$.

**Podatki:** $\mathrm{SF_4}$; $V(\mathrm{S}) = 6$, $V(\mathrm{F}) = 7$; $X = 4$, $p = 1$ za vsak F, $q = 0$
**Iščemo:** $E$, $N_\mathrm{d}$, obliko, hibridizacijo, polarnost

:::formula
$E = \dfrac{V - \sum p - q}{2}$; $N_\mathrm{d} = X + E$
:::

**Rešitev:**

1. Vseh valenčnih elektronov je $6 + 4 \cdot 7 = 34$, kar bomo uporabili za kontrolo.
2. $E = \dfrac{6 - 4 - 0}{2} = 1$: žveplo ima en nevezni par.
3. $N_\mathrm{d} = 4 + 1 = 5$: domene tvorijo trikotno bipiramido, hibridizacija je $sp^3d$.
4. Nevezni par gre v ekvatorialno lego, ker ima tam le dve sosednji domeni pod $90°$. Atomi tvorijo **gugalnico**.
5. Kontrola: 4 vezi so 8 elektronov, vsak F ima 3 nevezne pare (24 elektronov), S ima 2: $8 + 24 + 2 = 34$.
6. Gugalnica ni simetrična, dipoli vezi $\mathrm{S{-}F}$ se ne odštejejo.
7. Odgovor: $\mathrm{SF_4}$ ima obliko gugalnice, žveplo je $sp^3d$, molekula je polarna.

### Primer 3: zakaj voda dela meglo

Dipolni moment vezi $\mathrm{O{-}H}$ je $1{,}51\,\mathrm{D}$, kot $\mathrm{H{-}O{-}H}$ pa $104{,}5°$. Izračunaj dipolni moment molekule vode. Kolikšen bi bil, če bi bila voda linearna, kot jo pogosto narišemo na papir?

**Podatki:** $\mu_\mathrm{v} = 1{,}51\,\mathrm{D}$, $\theta = 104{,}5°$
**Iščemo:** dipolni moment $\mu$ vode in $\mu$ pri $\theta = 180°$

:::formula
$\mu = 2\,\mu_\mathrm{v}\cos\dfrac{\theta}{2}$
:::

**Rešitev:**

1. Kisik ima 2 vezi in $E = \frac{6 - 2}{2} = 2$, zato 4 domene in kotno obliko. Kot $104{,}5°$ je manjši od $109{,}5°$ zaradi dveh neveznih parov.
2. Oba dipola vezi kažeta od vodika proti kisiku. Vodoravni komponenti se odštejeta, navpični se seštejeta.
3. Polovični kot: $\frac{\theta}{2} = 52{,}25°$.
4. Pri linearni molekuli bi bil $\frac{\theta}{2} = 90°$ in $\cos 90° = 0$, torej $\mu = 0$.
5. Zadnji korak je tvoj: vstavi polovični kot v formulo in razmisli, kaj rezultat pove o megli.

:::premisli
Koliko je $\mu = 2 \cdot 1{,}51\,\mathrm{D} \cdot \cos 52{,}25°$ in kaj to pomeni za meglo?
---
$\mu \approx 1{,}85\,\mathrm{D}$. Voda je močno polarna, njene molekule se med seboj privlačijo (in tvorijo vodikove vezi), zato para kondenzira že pri nekaj stopinjah nad ničlo. Linearna voda bi bila nepolarna, kot $\mathrm{CO_2}$.
:::

## Pogoste napake

- **Oblika z risbe na papirju.** $\mathrm{H{-}O{-}H}$ v vrstici ne pomeni linearne molekule. Kdor iz risbe sklepa na obliko, razglasi vodo za nepolarno. Obliko vedno izpelji iz $N_\mathrm{d}$.
- **Dvojna vez kot dve domeni.** Kdor v $\mathrm{CO_2}$ šteje štiri domene, dobi kot $109{,}5°$. Večkratna vez je ena domena, saj so vsi njeni elektroni med istima jedroma.
- **Polarne vezi pomenijo polarno molekulo.** $\mathrm{CO_2}$, $\mathrm{BF_3}$, $\mathrm{CCl_4}$ in $\mathrm{XeF_4}$ imajo polarne vezi, molekule pa so nepolarne, ker se dipoli odštejejo. Najprej določi obliko, šele nato polarnost.
- **Razporeditev domen namesto oblike.** Amonijak ima tetraedrsko razporeditev domen, oblika pa je trikotna piramida, ker nevezni par ni atom.
- **Nevezni par v osni legi.** Pri $N_\mathrm{d} = 5$ nevezni pari gredo v ekvatorialne lege. $\mathrm{ClF_3}$ je zato T-oblika, ne trikotna ravninska, $\mathrm{XeF_2}$ pa linearen.

## Povzetek

- Lewisova struktura: seštej valenčne elektrone, najmanj elektronegativen atom v sredino, izberi strukturo z najmanjšimi formalnimi naboji $q_\mathrm{f} = V - N - \frac{B}{2}$.
- VSEPR: nevezni pari $E = \frac{V - \sum p - q}{2}$, domene $N_\mathrm{d} = X + E$; večkratna vez je ena domena.
- $N_\mathrm{d} = 2, 3, 4, 5, 6$ da razporeditev linearno, trikotno, tetraedrsko, bipiramido, oktaeder in hibridizacijo $sp$, $sp^2$, $sp^3$, $sp^3d$, $sp^3d^2$.
- Oblika se imenuje po atomih; nevezni pari zmanjšajo kote in pri $N_\mathrm{d} = 5$ sedijo ekvatorialno.
- Dipolni moment molekule je vektorska vsota dipolov vezi; simetrične molekule so nepolarne kljub polarnim vezem.

## Drugače: Na sliki

:::risba skica
opis: Levo molekula vode: kisik O zgoraj, dva vodika H spodaj levo in desno, kot med vezema 104,5°. Vezi sta puščici od H proti O. Pod kisikom navpična puščica navzgor z napisom skupni μ = 1,85 D. Desno molekula CO₂: O, C, O v ravni vrsti, puščici gresta od C proti vsakemu O, v nasprotni smeri. Pod njo napis μ = 0.
območje: 0; 0 .. 13; 5
napis: 3; 3,6 | O | nad | debelo
napis: 1,42; 2,38 | H | levo | debelo
napis: 4,58; 2,38 | H | desno | debelo
puščica: 1,73; 2,62 -> 2,68; 3,36 | | | oranžna
puščica: 4,27; 2,62 -> 3,32; 3,36 | | | oranžna
puščica: 3; 1 -> 3; 2,4 | skupni μ = 1,85 D | pod | modra
napis: 7,5; 2,5 | O | levo | debelo
napis: 9,5; 2,5 | C | nad | debelo
napis: 11,5; 2,5 | O | desno | debelo
puščica: 9,3; 2,5 -> 7,7; 2,5 | | | oranžna
puščica: 9,7; 2,5 -> 11,3; 2,5 | | | oranžna
napis: 9,5; 1,2 | μ = 0 | pod
:::

Puščica pri vezi kaže proti bolj elektronegativnemu atomu. Pri vodi kažeta obe puščici nekoliko navzgor, zato se njuni navpični deli seštejejo v skupni dipol. Pri ogljikovem dioksidu kažeta puščici v nasprotni smeri in sta enako dolgi: vlečeta kot dve enako močni ekipi pri vlečenju vrvi, ki ostane na mestu.

## Drugače: Iz vsakdanjega življenja

Zaveži skupaj nekaj enako napihnjenih balonov. Dva se postavita v ravno črto, trije v trikotnik, štirje v tetraeder, pet v trikotno bipiramido, šest v oktaeder. Nihče jih ne ureja: vsak balon se odrine od drugih, dokler niso čim dlje narazen. Tako se obnašajo elektronske domene.

Zdaj enega od štirih balonov napihni bolj. Ostali trije se stisnejo skupaj. To je nevezni par pri amonijaku, ki vezi $\mathrm{N{-}H}$ stisne s $109{,}5°$ na $107°$.

Polarnost vode občutiš v mikrovalovni pečici. Električno polje se obrne nekaj milijardkrat na sekundo in polarne molekule vode se obračajo z njim, zato se hrana segreje. Nepolarne molekule, na primer v čistem olju, se ne obračajo in se same od sebe segrevajo veliko počasneje.

## Preveri se

? Na sliki je Lewisova struktura amonijaka, ki nastaja pri razkroju odmrlih rastlin v tleh. Kakšna je oblika molekule?
:::risba molekula
opis: Lewisova struktura amonijaka: dušik N v sredini, levo, desno in spodaj je nanj z enojno vezjo vezan vodik H. Nad dušikom je en nevezni elektronski par.
---
    ··
H – N – H
    |
    H
:::
- trikotna ravninska
~ Spregledal si nevezni par. Dušik ima 4 domene, ne 3, zato atomi ne ležijo v ravnini.
+ trikotna piramida
- tetraedrska
~ Tetraedrska je razporeditev domen. Oblika se imenuje po atomih, nevezni par ni atom.
- T-oblika
~ To bi prebral z risbe s pravimi koti. Risba na papirju ne kaže prostorskih kotov.
> $X = 3$, $E = \frac{5 - 3}{2} = 1$, $N_\mathrm{d} = 4$: domene so tetraedrske, atomi pa tvorijo trikotno piramido s kotom $107°$.

? Ozon v stratosferi nas varuje pred UV-svetlobo. V molekuli $\mathrm{O_3}$ ima osrednji kisik dva vezana atoma in en nevezni par. Oceni kot $\mathrm{O{-}O{-}O}$ v stopinjah.
= 117 | 4
~ 180 | Molekula bi bila linearna le brez neveznega para. Osrednji kisik ima tri domene.
~ 109,5 | To je kot pri štirih domenah. Vez z resonanco šteje kot ena domena, zato so domene tri.
~ 104,5 | To je kot pri vodi, ki ima dva nevezna para. Ozon ima na osrednjem atomu le enega.
> Tri domene dajo $120°$, nevezni par kot malo zmanjša. Izmerjen kot je $116{,}8°$.

? Zakaj je molekula $\mathrm{CO_2}$ nepolarna, čeprav je vez $\mathrm{C{=}O}$ polarna?
- Ker je razlika elektronegativnosti med C in O premajhna.
~ $\Delta\chi = 0{,}89$ je zadosti za izrazito polarno vez. Razlog je v obliki, ne v vezi.
+ Ker je molekula linearna in se enaka dipola vezi, ki kažeta v nasprotni smeri, odštejeta.
- Ker ogljik nima neveznih parov.
~ Tudi $\mathrm{CHCl_3}$ nima neveznih parov na ogljiku, pa je polaren. Šteje simetrija.
- Ker so dvojne vezi vedno nepolarne.
~ Polarnost vezi je odvisna od razlike elektronegativnosti, ne od tega, ali je vez enojna ali dvojna.
> $\mu = 2\,\mu_\mathrm{v}\cos 90° = 0$: linearna simetrična molekula je nepolarna.

? Nevtralna molekula $\mathrm{AF_4}$ ima obliko gugalnice. V kateri skupini periodnega sistema (1 do 18) je element A?
= 16
~ 14 | Element 14. skupine nima neveznega para, $\mathrm{AF_4}$ bi bil tetraeder.
~ 18 | Element 18. skupine bi imel dva nevezna para in kvadratno ravninsko obliko, kot $\mathrm{XeF_4}$.
~ 6 | Dobil si število valenčnih elektronov. V periodnem sistemu z 18 skupinami je to 16. skupina.
> Gugalnica pomeni $N_\mathrm{d} = 5$ in $E = 1$. Iz $1 = \frac{V - 4}{2}$ sledi $V = 6$, to je 16. skupina, na primer $\mathrm{SF_4}$.

? Ksenon je žlahtni plin, a s fluorom tvori $\mathrm{XeF_2}$. Kakšna je oblika molekule in ali je polarna?
- kotna in polarna, kot voda
~ Ksenon ima tri nevezne pare in pet domen, ne štiri. Nevezni pari zasedejo vse tri ekvatorialne lege.
- trikotna ravninska in nepolarna
~ Nevezni pari niso atomi, zato jih ne štejemo v obliko. Atomi so le trije.
+ linearna in nepolarna
- linearna in polarna
~ Oba dipola $\mathrm{Xe{-}F}$ sta enaka in kažeta v nasprotni smeri, zato se odštejeta.
> $E = \frac{8 - 2}{2} = 3$, $N_\mathrm{d} = 5$, hibridizacija $sp^3d$. Trije nevezni pari so ekvatorialno, fluora pa osno pod kotom $180°$.

<<RACUN
vrednost: 44/18 | 2.44
vrednost: 3.44-2.55 | 0.89
vrednost: (3-3)/2 | 0
vrednost: (5-3)/2 | 1
vrednost: 4+2*6 | 16
vrednost: 6-4-2 | 0
vrednost: 4-0-4 | 0
vrednost: 6-2-3 | 1
vrednost: 6-6-1 | -1
vrednost: 6+4*7 | 34
vrednost: (6-4-0)/2 | 1
vrednost: 8+24+2 | 34
vrednost: (6-2)/2 | 2
vrednost: 2*1.51*cos(52.25*pi/180) | 1.85
vrednost: (8-2)/2 | 3
vrednost: 2*1+4 | 6
>>

:::simboli
q_\mathrm{f} | formalni naboj | q_\mathrm{f} = V - N - \frac{B}{2} | – |
V | število valenčnih elektronov prostega atoma | | – |
N | število neveznih elektronov ob atomu | | – |
B | število elektronov v vezeh atoma | | – |
E | število neveznih parov na osrednjem atomu | E = \frac{V - \sum p - q}{2} | – |
p | elektroni, ki jih vezani atom potrebuje do okteta | | – | $1$ za H in halogene, $2$ za O in S
q | naboj delca s predznakom | | – | anion negativen
X | število atomov, vezanih na osrednji atom | | – |
N_\mathrm{d} | število elektronskih domen | N_\mathrm{d} = X + E | – | določa razporeditev in hibridizacijo
\mu | dipolni moment molekule | \mu = 2\,\mu_\mathrm{v}\cos\frac{\theta}{2} | D | debye
\mu_\mathrm{v} | dipolni moment vezi | | D |
\theta | kot med vezema | | ° |
\Delta\chi | razlika elektronegativnosti atomov v vezi | | – | večja razlika, bolj polarna vez
:::
