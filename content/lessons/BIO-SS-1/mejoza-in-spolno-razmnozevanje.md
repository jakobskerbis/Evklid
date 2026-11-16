---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Štirimestna koda PIN na telefonu ima $10^4 = 10\,000$ možnosti, šestmestna pa že milijon. Narava ima podobno »kodo«: vsaka semenčica dobi svojo izbiro kromosomov. Koliko različnih izbir lahko naredi en moški? Manj, kot je šestmestnih kod PIN? Več, kot je ljudi v Sloveniji? Ali celo več, kot je zvezd v naši galaksiji?

Odgovor skriva delitev, s katero nastanejo spolne celice. Imenuje se **mejoza**. Brez nje bi imel vsak rod dvakrat več kromosomov kot prejšnji, bratje in sestre pa ne bi bili tako različni. Pomembna je tudi za vesoljske polete: japonski raziskovalci so posušene semenčice miši skoraj šest let hranili na Mednarodni vesoljski postaji in iz njih na Zemlji vzgojili zdrave mladiče.

## Razlaga

**1. Prvo opažanje: kaj, če bi se število ne razpolovilo?** Telesna celica človeka ima $46$ kromosomov. Recimo, da bi jih imeli tudi semenčica in jajčna celica. Ob oploditvi se njuni jedri združita, zato bi imel otrok $46 + 46 = 92$ kromosomov, vnuk $92 + 92 = 184$, pravnuk še dvakrat več. Vzorec je jasen: število bi se z vsakim rodom podvojilo.

Ker se ne, mora imeti spolna celica **polovico** kromosomov. Telesna celica ima kromosome v parih (homologna kromosoma, enega od mame in enega od očeta). Taki celici rečemo **diploidna** in zapišemo $2n = 46$. Spolna celica ima iz vsakega para le en kromosom: je **haploidna**, $n = 23$. Delitev, ki iz diploidne celice naredi haploidne, je **mejoza**.

**2. Drugo opažanje: koliko različnih spolnih celic?** Iz vsakega para gre v spolno celico en kromosom, materin ali očetov, in to naključno. Preštejmo nekaj primerov. Materine kromosome označimo z velikimi črkami, očetove z malimi.

| Pari v celici | Možne spolne celice | Število |
|---|---|---|
| 1 (Aa) | A, a | $2$ |
| 2 (Aa, Bb) | AB, Ab, aB, ab | $4$ |
| 3 (Aa, Bb, Cc) | ABC, ABc, AbC, Abc, aBC, aBc, abC, abc | $8$ |

Vsak nov par število podvoji. Pravilo: pri $n$ parih je možnih

$$K = 2^n$$

različnih kombinacij kromosomov. Temu pravimo **neodvisna razporeditev** homolognih kromosomov.

:::premisli
Človek ima $23$ parov. Najprej brez računanja oceni: je kombinacij več ali manj kot šestmestnih kod PIN? Namig: $2^{10}$ je približno tisoč. Nato izračunaj.
---
Ocena: $2^{20}$ je približno milijon, trije dodatni pari ga še osemkrat povečajo. $2^{23} = 8\,388\,608$, torej več kot $8$ milijonov. To je osemkrat več od milijona šestmestnih kod PIN in štirikrat več, kot ima Slovenija prebivalcev.
:::

**3. Potek mejoze.** Pred mejozo se v fazi S DNA podvoji, kot pred mitozo. Vsak kromosom ima nato dve sestrski kromatidi. Sledita dve delitvi, med njima se DNA ne podvoji več.

**Mejoza I** loči homologna kromosoma.

- Profaza I: homologna kromosoma se tesno zložita drug ob drugega. Na tem mestu lahko pride do **prekrižanja**: kromatidi različnih kromosomov para (nesestrski kromatidi) se prelomita na istem mestu in izmenjata odlomljena dela. Kromosom ima potem del materinih in del očetovih alelov.
- Metafaza I: pari se postavijo v sredino celice. Kako je obrnjen posamezen par, je naključno: od tod neodvisna razporeditev iz točke 2.
- Anafaza I: homologna kromosoma potujeta k nasprotnima poloma. Sestrski kromatidi ostaneta skupaj.
- Telofaza I: nastaneta dve celici s po $23$ kromosomi, vsak ima še dve kromatidi.

**Mejoza II** poteka kot mitoza: sestrski kromatidi gresta narazen. Iz dveh celic nastanejo štiri haploidne celice, vsak kromosom ima eno kromatido.

V simulaciji spodaj »3D: Mejoza s prekrižanjem« ustavi animacijo v profazi I in poišči mesto, kjer kromatidi izmenjata del. Opazuj, da so po mejozi II vse štiri celice drugačne.

**4. Primerjava z mitozo.**

| Lastnost | Mitoza | Mejoza |
|---|---|---|
| delitev jedra | ena | dve |
| nastane | 2 celici | 4 celice |
| kromosomov | $2n$, kot prej | $n$, polovica |
| DNA hčerinskih celic | enaka materinski | vse različne |
| prekrižanje | ne | da, v profazi I |
| namen | rast, obnova tkiv | spolne celice |

**5. Oploditev.** Pri moškem iz ene celice z mejozo nastanejo štiri semenčice (spermiji). Semenčica je majhna in gibljiva. Pri ženski nastane iz ene celice ena velika jajčna celica z zalogo hrane, preostanek gre v majhna polarna telesca, ki propadejo. Ob **oploditvi** se haploidni jedri združita: $n + n = 2n$. Nastane **zigota** s $46$ kromosomi, iz nje se z mitozami razvije novo telo.

Vsak starš da eno od več kot $8$ milijonov kombinacij, zato je kombinacij za zigoto

$$2^{23} \cdot 2^{23} = 2^{46}$$

$2^{46} \approx 7{,}0 \cdot 10^{13}$. V naši galaksiji je po ocenah $100$ do $400$ milijard zvezd, kombinacij je torej vsaj stokrat več. Prekrižanje število še močno poveča.

:::premisli
Brat in sestra imata iste starše, pa sta si lahko precej različna. Zakaj? Kdo je izjema?
---
Vsak je nastal iz druge semenčice in druge jajčne celice. Te imajo zaradi neodvisne razporeditve in prekrižanja različne kombinacije alelov, katera semenčica oplodi jajčno celico, pa je naključno. Izjema so enojajčni dvojčki: nastanejo iz ene zigote, ki se razdeli na dva zarodka, zato imajo enako DNA.
:::

**6. Kloniranje.** Pri **nespolnem razmnoževanju** ni mejoze ne oploditve. Potomci nastanejo z mitozami in imajo enako DNA kot starš. Takim osebkom pravimo **kloni**. Kloni so jagode iz vrež (pritlik), rastline iz potaknjencev, bakterije po delitvi in enojajčni dvojčki.

Klon lahko naredimo tudi umetno. Leta 1996 so iz celice vimena ovce vzeli jedro in ga vstavili v jajčno celico druge ovce, ki so ji odstranili njeno jedro. Celica se je začela deliti kot zigota, zarodek je donosila tretja ovca. Rodila se je ovca **Dolly** z enako jedrno DNA kot ovca, ki je dala celico vimena.

## Rešeni primeri

### Primer 1: vinske mušice v orbiti

Na vesoljski postaji so gojili vinske mušice, da bi videli, kako breztežnost vpliva na razvoj. Njihove telesne celice imajo $2n = 8$ kromosomov. Koliko kromosomov ima njihova jajčna celica, koliko zigota in koliko različnih kombinacij kromosomov lahko ima jajčna celica (brez prekrižanja)?

**Podatki:** $2n = 8$ kromosomov v telesni celici
**Iščemo:** število kromosomov v jajčni celici in v zigoti, število kombinacij $K$

:::formula
Spolna celica dobi en kromosom iz vsakega para, zigota $n + n$. Kombinacij je
$$K = 2^n$$
:::

**Rešitev:**

1. $8$ kromosomov je $\dfrac{8}{2} = 4$ parov, zato ima jajčna celica $n = 4$ kromosome.
2. Zigota dobi $4$ od mame in $4$ od očeta: $4 + 4 = 8$, kot telesna celica.
3. Kombinacij je $K = 2^4 = 16$, ker se pri vsakem od $4$ parov odloča med dvema kromosomoma.
4. Odgovor: jajčna celica ima $4$ kromosome, zigota $8$, jajčnih celic z različnimi kombinacijami pa je lahko $16$.

### Primer 2: kromosomi in DNA skozi mejozo

Celica v jajčniku je v fazi G1. Ima $46$ kromosomov in približno $6\,\mathrm{pg}$ DNA ($1\,\mathrm{pg} = 10^{-12}\,\mathrm{g}$). Koliko kromosomov, koliko kromatid in koliko DNA ima celica po fazi S, po mejozi I in po mejozi II?

**Podatki:** $46$ kromosomov z eno kromatido, $6\,\mathrm{pg}$ DNA v fazi G1
**Iščemo:** kromosome, kromatide in DNA na treh stopnjah

:::formula
V fazi S se DNA podvoji, število kromosomov ostane. Mejoza I loči homologna kromosoma (kromosomov pol manj), mejoza II sestrski kromatidi (kromatid pol manj). Vsaka delitev količino DNA v celici razpolovi.
:::

**Rešitev:**

1. Po fazi S: kromosomov je še vedno $46$, vsak ima dve kromatidi, torej $2 \cdot 46 = 92$ kromatid. DNA je $2 \cdot 6 = 12\,\mathrm{pg}$.
2. Po mejozi I: vsaka celica dobi en kromosom iz para, $\dfrac{46}{2} = 23$ kromosomov, a vsak ima še dve kromatidi, torej $46$ kromatid. DNA je $\dfrac{12}{2} = 6\,\mathrm{pg}$.
3. Po mejozi II: kromatidi se ločita, celica ima $23$ kromosomov in $23$ kromatid. DNA je $\dfrac{6}{2} = 3\,\mathrm{pg}$.
4. Odgovor: po fazi S $46$ kromosomov, $92$ kromatid, $12\,\mathrm{pg}$; po mejozi I $23$, $46$, $6\,\mathrm{pg}$; po mejozi II $23$, $23$, $3\,\mathrm{pg}$. Jajčna celica ima pol manj DNA kot telesna celica v G1.

### Primer 3: riž na kitajski postaji

Na kitajski vesoljski postaji so riž vzgojili od semena do novega semena. Genetik izračuna, da lahko rastlina riža naredi $4096$ različnih kombinacij kromosomov v pelodnih zrnih (brez prekrižanja). Koliko kromosomov ima riž v telesnih celicah?

**Podatki:** $K = 4096$ kombinacij
**Iščemo:** število kromosomov $2n$ v telesni celici

:::formula
$$K = 2^n$$
Telesna celica ima $2n$ kromosomov.
:::

**Rešitev:**

1. Iščemo $n$, za katerega je $2^n = 4096$. Podvajamo: $2$, $4$, $8$, … in preverimo $2^{12} = 4096$. Torej je $n = 12$ parov.
2. Telesna celica ima vsak par v celoti: $2 \cdot 12 = 24$ kromosomov.
3. Odgovor: riž ima v telesnih celicah $24$ kromosomov, v pelodnih zrnih $12$.

### Primer 4: zdaj ti

Vrnimo se k vinski mušici ($2n = 8$). Koliko različnih kombinacij kromosomov ima lahko zigota enega para staršev, brez prekrižanja?

**Podatki:** $2n = 8$, torej $n = 4$; vsak starš da eno spolno celico
**Iščemo:** število kombinacij $Z$ v zigoti

:::formula
$$K = 2^n$$
$$Z = K \cdot K$$
:::

**Rešitev:**

1. Vsak starš naredi $K = 2^4 = 16$ različnih spolnih celic.
2. Vsaka semenčica se lahko sreča s katero koli jajčno celico. Izračunaj $Z$ sam, nato preveri:

:::premisli
Koliko je $Z$?
---
$Z = 16 \cdot 16 = 256$ kombinacij (to je $2^8$). Že pri štirih parih kromosomov je potomcev z različnimi kombinacijami veliko.
:::

## Pogoste napake

- **»Mejoza je dvakrat ponovljena mitoza.«** Pred mejozo se DNA podvoji le enkrat. V mejozi I gresta narazen homologna kromosoma, ne kromatidi, zato se število kromosomov razpolovi. Kot mitoza je le mejoza II.
- **»Haploidna celica ima $23$ parov kromosomov.«** Ne, ima $23$ posameznih kromosomov, iz vsakega para enega. Parov ima $23$ diploidna celica.
- **»Po mejozi I ima celica $46$ kromosomov, ker jih toliko vidim.«** Šteješ kromatide. Kromosomov je toliko, kolikor je centromer (zožitev, ki drži sestrski kromatidi skupaj): $23$, vsak z dvema kromatidama.
- **»Prekrižanje poteka med sestrskima kromatidama.«** Sestrski kromatidi sta enaki, izmenjava ne bi ničesar spremenila. Prekrižanje poteka med nesestrskima kromatidama homolognih kromosomov.
- **»Klon je popolnoma enak darovalcu.«** Enaka je jedrna DNA, fenotip pa je odvisen tudi od okolja. Prva klonirana mačka je imela drugačen vzorec kožuha kot mačka, iz katere so jo klonirali.

## Povzetek

- Telesne celice so diploidne ($2n$, pri človeku $46$), spolne celice haploidne ($n = 23$). Mejoza število kromosomov razpolovi.
- Pred mejozo se DNA podvoji enkrat, sledita dve delitvi. Mejoza I loči homologna kromosoma, mejoza II sestrski kromatidi. Nastanejo štiri genetsko različne haploidne celice.
- Prekrižanje v profazi I: nesestrski kromatidi homolognih kromosomov izmenjata dele.
- Neodvisna razporeditev da $2^n$ kombinacij (pri človeku $2^{23}$, več kot $8$ milijonov).
- Oploditev: $n + n = 2n$, nastane zigota. Raznolikost potomcev izvira iz neodvisne razporeditve, prekrižanja in naključne oploditve.
- Mitoza: ena delitev, dve enaki diploidni celici. Mejoza: dve delitvi, štiri različne haploidne celice.
- Kloni nastanejo nespolno in imajo enako DNA; umetno kloniranje s prenosom jedra (ovca Dolly).

## Drugače: Korak za korakom s številkami

Sledimo eni celici v modu.

1. Faza G1: $46$ kromosomov, vsak z eno kromatido.
2. Faza S: DNA se podvoji. Še vedno $46$ kromosomov, a $92$ kromatid.
3. Profaza I: $23$ parov se zloži skupaj, ponekod se zgodi prekrižanje.
4. Konec mejoze I: $2$ celici, v vsaki $23$ kromosomov s po dvema kromatidama ($46$ kromatid).
5. Konec mejoze II: $4$ celice, v vsaki $23$ kromosomov z eno kromatido.
6. Iz vsake celice zraste semenčica: $4$ semenčice iz ene celice.
7. Oploditev: $23$ iz semenčice in $23$ iz jajčne celice da zigoto s $46$ kromosomi.

Preizkus smiselnosti: na koncu je število kromosomov spet $46$, kot na začetku. Če ti pri štetju pride $92$ ali $11{,}5$, si zamešal kromosome in kromatide.

## Drugače: Kot zgodba

V tvojem očetu živita dva 7. kromosoma. Enega je dobil od svoje mame, tvoje babice, drugega od svojega očeta, tvojega dedka. Vse življenje sta bila v vsaki celici skupaj, a se nista nikoli srečala.

Ko se v modu celica pripravi na mejozo, se oba podvojita in se v profazi I prvič tesno objameta. Ob objemu si izmenjata nekaj kosov: babičin odnese nekaj dedkovih alelov, dedkov nekaj babičinih.

V anafazi I ju vreteno potegne narazen, vsakega k svojemu polu. Ali gre babičin levo ali desno, odloči naključje, enako kot pri ostalih $22$ parih. V mejozi II se razdelita še njuni kromatidi. V vsaki od štirih semenčic je tako drugačna mešanica babice in dedka.

Ena od teh semenčic je pred leti dosegla jajčno celico tvoje mame. Zato nosiš ti 7. kromosom, ki ga ni imel nihče pred teboj.

## Preveri se

? Katera vrstica pravilno opisuje človeško jajčno celico?
- diploidna, $46$ kromosomov
~ $46$ kromosomov ima telesna celica. Jajčna celica nastane z mejozo, ki število razpolovi.
- haploidna, $23$ parov kromosomov
~ $23$ parov je $46$ kromosomov. Haploidna celica ima iz vsakega para le en kromosom.
+ haploidna, $23$ kromosomov
- diploidna, $23$ kromosomov
~ Celica s $23$ kromosomi ima iz vsakega para le enega, zato je haploidna, ne diploidna.
> Jajčna celica je haploidna: $n = 23$ kromosomov, iz vsakega homolognega para enega.

? Zakaj se število kromosomov iz roda v rod ne podvaja?
- Ker se pri oploditvi polovica kromosomov uniči.
~ Pri oploditvi se nič ne uniči: združita se jedri in se kromosomi seštejejo.
+ Ker mejoza naredi haploidne spolne celice, ob oploditvi pa $n + n = 2n$.
- Ker mitoza razpolovi število kromosomov.
~ Mitoza ohrani število kromosomov. Razpolovi ga mejoza.
> Spolne celice imajo $23$ kromosomov, skupaj spet $46$. Brez mejoze bi bilo v naslednjem rodu $92$.

? Celica ima $23$ kromosomov, vsak iz dveh sestrskih kromatid. Kje v razvoju spolnih celic je?
- Pravkar je nastala z mitozo.
~ Po mitozi ima človeška celica $46$ kromosomov.
+ Po mejozi I, pred mejozo II.
- Je zigota.
~ Zigota nastane iz dveh haploidnih celic in ima $46$ kromosomov.
- Je zrela semenčica.
~ Zrela semenčica je že po mejozi II, zato ima vsak kromosom le eno kromatido.
> Mejoza I razpolovi število kromosomov, kromatidi pa se ločita šele v mejozi II.

? Mačka ima $2n = 38$. Približno koliko različnih kombinacij kromosomov je možnih v njenih jajčnih celicah, brez prekrižanja?
- približno $20$
~ $19$ je število parov, ne število kombinacij. Vsak par kombinacije podvoji.
+ približno pol milijona
- približno $275$ milijard
~ To je $2^{38}$. V eksponent pride število parov $n = 19$, ne $2n$.
- približno $360$
~ $19^2 = 361$. Pravilo je $2^n$, ne $n^2$.
> $K = 2^{19} = 524\,288$, kar je približno pol milijona.

? Na prihodnji bazi na Marsu bi krompir gojili iz gomoljev, ne iz semen. Zakaj bi ena nova glivična bolezen lahko uničila ves pridelek?
- Ker na Marsu ni mejoze.
~ Mejoza ni odvisna od planeta. Pri gojenju iz gomoljev je preprosto ni.
- Ker so gomolji haploidni in zato šibkejši.
~ Gomolj nastane z mitozami in ima enako število kromosomov kot rastlina.
+ Ker so rastline iz gomoljev kloni z enakimi geni, zato je lahko vsaka enako občutljiva.
- Ker se pri gojenju iz gomoljev v vsaki rastlini zgodi prekrižanje.
~ Prekrižanje je del mejoze. Gomolji nastanejo nespolno, brez nje.
> Gomolji nastanejo nespolno z mitozami, zato so vse rastline kloni. Pri rastlinah iz semen bi mejoza in oploditev dali raznolike potomce, nekateri bi bili morda odporni.

<<RACUN
vrednost: 10^4 | 10000
vrednost: 46+46 | 92
vrednost: 92+92 | 184
vrednost: 2^23 | 8388608
vrednost: 2^23*2^23 | 2^46
vrednost: 2^46 | 70368744177664
vrednost: 8/2 | 4
vrednost: 2^4 | 16
vrednost: 2*46 | 92
vrednost: 2*6 | 12
vrednost: 46/2 | 23
vrednost: 12/2 | 6
vrednost: 6/2 | 3
resi: 2^n=4096 | n | 12
vrednost: 2*12 | 24
vrednost: 16*16 | 256
vrednost: 2^19 | 524288
>>

:::simboli
K | število kombinacij kromosomov v spolni celici | K = 2^n | – | brez prekrižanja
n | število kromosomov v haploidni celici (parov v diploidni) | | – | pri človeku $n = 23$
Z | število kombinacij kromosomov v zigoti | Z = K \cdot K | – | ena spolna celica od vsakega starša
:::
