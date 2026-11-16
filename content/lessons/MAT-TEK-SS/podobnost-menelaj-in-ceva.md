---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Prvi prizor: Luka načrtuje kolesarski izlet med vasmi $A$, $B$ in $C$, ki jih povezujejo tri ravne ceste. Čez pokrajino vodi nova ravna avtocesta. Seka cesto $AB$, cesto $CA$ in še podaljšek ceste $BC$. Ta kos zemljevida je odrezan, Luka pa bi rad vedel, kje avtocesta prečka podaljšek.

Drugi prizor: iz vsake vasi vodi ravna gozdna pot do nasprotne ceste in vse tri poti se srečajo pri isti koči. Ema ve, kje dve poti zadeneta cesto. Kje se konča tretja?

Prizora sta videti različna: v prvem je ena premica, v drugem tri, ki se srečajo. A rešitev je v obeh enaka. Vsaka točka razdeli svojo stranico v nekem razmerju in zmnožek treh razmerij je $1$. Ker merilo zemljevida razmerij ne spremeni, vse izmeriš kar na papirju.

## Razlaga

**Zemljevid je podoben pokrajini.** Pri merilu $1 : 25\,000$ je vsaka razdalja v naravi $25\,000$-krat daljša kot na papirju, koti pa ostanejo enaki. Taka lika sta **podobna**, število $k = 25\,000$ je **koeficient podobnosti**. Razmerje dveh razdalj je na zemljevidu in v naravi enako. Ploščina pa se poveča za $k^2$, saj se raztegneta obe smeri.

Za razmerja na stranicah trikotnika potrebujemo dve orodji:

- **Vzporednica.** Premica, vzporedna stranici trikotnika, odreže manjši trikotnik, ki je podoben prvotnemu. Iz podobnosti dobimo enakost razmerij.
- **Skupna višina.** Trikotnika z isto višino imata ploščini v enakem razmerju kot osnovnici.

**Cevov izrek na sliki.** Na risbi spodaj so iz oglišč trikotnika $ABC$ potegnjene tri daljice do nasprotnih stranic: $AD$, $BE$ in $CF$. Daljici od oglišča do točke na nasprotni stranici rečemo **cevijana**. Te tri se sekajo v isti točki $P$; premicam skozi isto točko rečemo **sočasne** (tudi konkurentne).

:::risba skica
opis: Trikotnik ABC z oglišči A(0; 0), B(6; 0) in C(2; 5). Točka D je na BC, E na CA, F na AB. Daljice AD, BE in CF se sekajo v točki P(3; 2,5). BD : DC = 3 : 2, CE : EA = 1 : 3, AF : FB = 2 : 1.
območje: -1; -1 .. 7; 6
enota: 36
lik: 0; 0 -> 6; 0 -> 2; 5 | modra zaprto
črta: 0; 0 -> 3,6; 3 | oranžna
črta: 6; 0 -> 1,5; 3,75 | oranžna
črta: 2; 5 -> 4; 0 | oranžna
točka: 0; 0 | A | levo
točka: 6; 0 | B | desno
točka: 2; 5 | C | nad
točka: 3,6; 3 | D | desno
točka: 1,5; 3,75 | E | levo
točka: 4; 0 | F | pod
točka: 3; 2,5 | P | desno | zelena
:::

Vsaka od točk $D$, $E$, $F$ deli svojo stranico v nekem razmerju. Razmerja beremo z obhodom trikotnika v krogu: od oglišča do točke, od točke do naslednjega oglišča. Preden pogledaš tabelo, ugani, koliko bo njihov zmnožek.

| stranica | razmerje | vrednost |
|---|---|---|
| $BC$ | $\frac{BD}{DC}$ | $\frac{3}{2}$ |
| $CA$ | $\frac{CE}{EA}$ | $\frac{1}{3}$ |
| $AB$ | $\frac{AF}{FB}$ | $2$ |

Zmnožek je $\frac{3}{2} \cdot \frac{1}{3} \cdot 2 = 1$. **Cevov izrek** pove, da to velja vedno: cevijane $AD$, $BE$ in $CF$ so sočasne natanko tedaj, ko je

$$\frac{BD}{DC} \cdot \frac{CE}{EA} \cdot \frac{AF}{FB} = 1$$

Vrstni red si zapomniš z obhodom $B \to D \to C \to E \to A \to F \to B$.

*Dokaz s ploščinami.* Trikotnika $ABD$ in $ADC$ imata isto višino iz $A$, prav tako $PBD$ in $PDC$ iz $P$. Oba para imata zato razmerje ploščin $\frac{BD}{DC}$. Če od $ABD$ odštejemo $PBD$ in od $ADC$ odštejemo $PDC$, se razmerje ohrani, zato je $\frac{BD}{DC} = \frac{S_{ABP}}{S_{CAP}}$. Enako je $\frac{CE}{EA} = \frac{S_{BCP}}{S_{ABP}}$ in $\frac{AF}{FB} = \frac{S_{CAP}}{S_{BCP}}$. Ko vse zmnožimo, se ploščine pokrajšajo in ostane $1$. Velja tudi obrat: če je zmnožek $1$, premica $CP$ zadene $AB$ prav v $F$.

V simulaciji spodaj »Cevov izrek« premakni $D$ in $E$, nato pritisni »Naredi sočasne«. Opazuj, da je zmnožek takrat $1$. Ko so vse tri točke na razpoloviščih, je $P$ težišče.

:::premisli
$E$ ostane na mestu, $D$ pa premaknemo proti $C$. Kam se mora premakniti $F$, da cevijane ostanejo sočasne?
---
Proti $A$. Razmerje $\frac{BD}{DC}$ se poveča, zato se mora $\frac{AF}{FB}$ zmanjšati, da zmnožek ostane $1$.
:::

**Menelajev izrek na sliki.** Zdaj namesto treh cevijan vzemimo eno premico, ki seka vse tri nosilke stranic (**nosilka** je cela premica, na kateri leži stranica). Taki premici rečemo **transverzala**. Na risbi seka $AB$ v $F$, $CA$ v $E$ in podaljšek $BC$ čez $B$ v $D$.

:::risba skica
opis: Trikotnik ABC z oglišči A(0; 0), B(6; 0) in C(2; 4). Premica skozi D(8; −2), F(4,5; 0) in E(1; 2) seka stranico AB v F, stranico CA v razpolovišču E in podaljšek BC čez B v D. AF : FB = 3 : 1, CE : EA = 1 : 1, BD : DC = 1 : 3.
območje: -1; -3 .. 9; 5
enota: 30
lik: 0; 0 -> 6; 0 -> 2; 4 | modra zaprto
črta: 6; 0 -> 8; -2 | modra črtkano
črta: 0; 2,57 -> 9; -2,57 | oranžna
točka: 0; 0 | A | levo
točka: 6; 0 | B | nad desno
točka: 2; 4 | C | nad
točka: 1; 2 | E | levo
točka: 4,5; 0 | F | pod
točka: 8; -2 | D | pod
:::

Razmerja so $\frac{BD}{DC} = \frac{1}{3}$, $\frac{CE}{EA} = 1$ in $\frac{AF}{FB} = 3$, zmnožek je spet $1$. **Menelajev izrek**: točke $D$, $E$, $F$ na nosilkah $BC$, $CA$, $AB$ ležijo na isti premici (so **kolinearne**) natanko tedaj, ko je zmnožek istih treh razmerij $1$ in ko ena ali vse tri točke ležijo na podaljških stranic. Če dolžinam damo predznak glede na smer (usmerjene dolžine), se to zapiše kot zmnožek $-1$.

*Dokaz z vzporednico.* Skozi $C$ potegnimo vzporednico z $AB$, ki seka transverzalo v $G$. Trikotnika $DCG$ in $DBF$ sta podobna, zato $\frac{BD}{DC} = \frac{BF}{CG}$. Trikotnika $ECG$ in $EAF$ sta podobna, zato $\frac{CE}{EA} = \frac{CG}{AF}$. Zmnožimo: $\frac{BF}{CG} \cdot \frac{CG}{AF} \cdot \frac{AF}{FB} = 1$.

:::premisli
Zakaj transverzala nikoli ne seka vseh treh stranic v notranjosti?
---
Premica razdeli ravnino na dva dela. Stranico seka v notranjosti le, če sta njeni krajišči na različnih straneh. Tri oglišča se razdelijo $2 : 1$ ali $3 : 0$, zato premica seka v notranjosti dve stranici ali nobene.
:::

**Kdaj kaj.** Ceva odgovarja na vprašanje »ali se tri premice iz oglišč sekajo v eni točki«, Menelaj na »ali tri točke ležijo na premici«. Pri težjih nalogah izreka kombiniramo, pogosto na pomožnem trikotniku, ki ga sestavimo sami.

## Rešeni primeri

### Primer 1: koča na zemljevidu

Na zemljevidu v merilu $1 : 25\,000$ je cesta $BC$ dolga $6\,\mathrm{cm}$, pot iz $A$ jo zadene v $D$, $2{,}4\,\mathrm{cm}$ od $B$. Pot iz $B$ deli cesto $CA$ v razmerju $CE : EA = 1 : 2$. Cesta $AB$ je na zemljevidu dolga $10\,\mathrm{cm}$. Vse tri poti se srečajo pri koči. Kako daleč od vasi $A$ tretja pot zadene cesto $AB$?

**Podatki:** merilo $1 : 25\,000$, $BC = 6\,\mathrm{cm}$, $BD = 2{,}4\,\mathrm{cm}$, $DC = 3{,}6\,\mathrm{cm}$, $CE : EA = 1 : 2$, $AB = 10\,\mathrm{cm}$ (na zemljevidu)
**Iščemo:** razdaljo $AF$ v naravi

:::formula
Cevov izrek: $\frac{BD}{DC} \cdot \frac{CE}{EA} \cdot \frac{AF}{FB} = 1$, ker so poti sočasne
:::

**Rešitev:**

1. $\frac{BD}{DC} = \frac{2{,}4}{3{,}6} = \frac{2}{3}$.
2. Vstavimo: $\frac{2}{3} \cdot \frac{1}{2} \cdot \frac{AF}{FB} = 1$, torej $\frac{AF}{FB} = 3$.
3. $AF$ so trije deli od štirih: $AF = \frac{3}{4} \cdot 10 = 7{,}5\,\mathrm{cm}$.
4. V naravi: $7{,}5\,\mathrm{cm} \cdot 25\,000 = 187\,500\,\mathrm{cm} = 1{,}875\,\mathrm{km}$.
5. Odgovor: tretja pot zadene cesto $AB$ približno $1{,}9\,\mathrm{km}$ od vasi $A$.

### Primer 2: težiščnica in cevijana

V trikotniku $ABC$ je $D$ razpolovišče $BC$, točka $E$ na $CA$ pa deli stranico v razmerju $AE : EC = 2 : 3$. Daljica $BE$ seka težiščnico $AD$ v $P$. V kakšnem razmerju $P$ deli $AD$?

**Podatki:** $BD = DC$, $AE : EC = 2 : 3$, $P = AD \cap BE$
**Iščemo:** $AP : PD$

:::formula
Menelaj za trikotnik $ADC$ in premico $B$, $P$, $E$: $\frac{AP}{PD} \cdot \frac{DB}{BC} \cdot \frac{CE}{EA} = 1$
:::

**Rešitev:**

1. Premica $BE$ seka trikotnik $ADC$: stranico $AD$ v $P$, stranico $CA$ v $E$ in podaljšek $DC$ v $B$. To je transverzala.
2. Obhod $A \to P \to D \to B \to C \to E \to A$ da razmerja $\frac{AP}{PD}$, $\frac{DB}{BC}$ in $\frac{CE}{EA}$.
3. $\frac{DB}{BC} = \frac{1}{2}$, ker je $D$ razpolovišče, in $\frac{CE}{EA} = \frac{3}{2}$. Tu je $B$ točka na podaljšku stranice $DC$, zato sta $DB$ in $BC$ oba dela, ne del in celota.
4. $\frac{AP}{PD} \cdot \frac{1}{2} \cdot \frac{3}{2} = 1$, torej $\frac{AP}{PD} = \frac{4}{3}$.
5. Odgovor: $P$ deli težiščnico v razmerju $AP : PD = 4 : 3$.

### Primer 3: kje cesta prečka progo

Iz vasi $A$, $B$ in $C$ vodijo ravne ceste $AD$, $BE$ in $CF$ do nasprotnih stranic in se srečajo v razpotju. Ravna železniška proga $BC$ je dolga $16\,\mathrm{km}$, točka $D$ je $6\,\mathrm{km}$ od $B$. Ravna cesta skozi $E$ in $F$ seka podaljšek proge v točki $Q$. Kako daleč je $Q$ od $B$?

**Podatki:** $BC = 16\,\mathrm{km}$, $BD = 6\,\mathrm{km}$, $DC = 10\,\mathrm{km}$, $AD$, $BE$, $CF$ sočasne
**Iščemo:** razdaljo $QB$

:::formula
Ceva za $D$, $E$, $F$ in Menelaj za $Q$, $E$, $F$, oba s produktom razmerij enakim $1$
:::

**Rešitev:**

1. Ceva: $\frac{CE}{EA} \cdot \frac{AF}{FB} = \frac{DC}{BD} = \frac{10}{6} = \frac{5}{3}$.
2. Menelaj za trikotnik $ABC$ in transverzalo $Q$, $E$, $F$: $\frac{BQ}{QC} \cdot \frac{5}{3} = 1$, torej $\frac{BQ}{QC} = \frac{3}{5}$.
3. $E$ in $F$ ležita na stranicah, zato je $Q$ na podaljšku. Ker je $BQ < QC$, leži onkraj $B$.
4. Označimo $QB = q$. Enačba $\frac{q}{q + 16} = \frac{3}{5}$ da $5q = 3q + 48$, torej $q = 24$.
5. Odgovor: cesta prečka podaljšek proge $24\,\mathrm{km}$ od $B$.

Opazi: $\frac{BQ}{QC} = \frac{BD}{DC}$. Točka $Q$ deli $BC$ od zunaj v istem razmerju kot $D$ od znotraj. Če bi bil $D$ razpolovišče, bi bila $EF$ vzporedna z $BC$.

### Primer 4 – zdaj ti: obvoznica

Cesta $BC$ je dolga $6\,\mathrm{km}$. Ravna obvoznica seka cesto $AB$ v $F$, kjer je $AF : FB = 1 : 2$, cesto $CA$ v $E$, kjer je $CE : EA = 3 : 1$, in premico $BC$ v $D$. Kje leži $D$?

**Podatki:** $BC = 6\,\mathrm{km}$, $AF : FB = 1 : 2$, $CE : EA = 3 : 1$
**Iščemo:** lego točke $D$ in razdaljo $BD$

:::formula
Menelajev izrek: $\frac{BD}{DC} \cdot \frac{CE}{EA} \cdot \frac{AF}{FB} = 1$, ker so $D$, $E$, $F$ na premici
:::

**Rešitev:**

1. Vstavimo: $\frac{BD}{DC} \cdot 3 \cdot \frac{1}{2} = 1$.
2. Izrazi $\frac{BD}{DC}$, ugotovi, na kateri strani je $D$, in izračunaj $BD$ sam.

:::premisli
Kje je $D$ in kako daleč od $B$?
---
$\frac{BD}{DC} = \frac{2}{3}$. $E$ in $F$ sta na stranicah, zato je $D$ na podaljšku, in ker je $BD < DC$, onkraj $B$. Iz $\frac{x}{x + 6} = \frac{2}{3}$ sledi $x = 12$: $D$ je $12\,\mathrm{km}$ od $B$.
:::

## Pogoste napake

- **Razmerja niso v krogu.** Zapis $\frac{BD}{DC} \cdot \frac{EA}{CE} \cdot \frac{AF}{FB}$ se zdi enakovreden, saj so »vse tri stranice notri«. Toda en ulomek je obrnjen, zato zmnožek ni več $1$. Vedno obhodi trikotnik: oglišče, točka, oglišče, točka …
- **Del proti celoti.** Namesto $\frac{BD}{DC}$ dijak vzame $\frac{BD}{BC}$, ker je dolžina $BC$ podana. Izreka pa govorita o delih. V vsakem ulomku sta razdalji od iste točke do obeh krajišč njene stranice.
- **Zamenjava izrekov.** Ceva je za tri premice iz oglišč skozi isto točko, Menelaj za tri točke na eni premici. Pri Menelaju je vedno ena ali tri točke na podaljških. Kdor pri Menelaju postavi vse točke na stranice, dobi nemogočo sliko.
- **Ploščina z linearnim merilom.** Pri merilu $1 : 50\,000$ je $1\,\mathrm{cm}^2$ v naravi $0{,}25\,\mathrm{km}^2$, ne $0{,}5\,\mathrm{km}^2$. Ploščine podobnih likov so v razmerju $k^2$.

## Povzetek

- Podobni liki imajo enake kote in sorazmerne stranice s koeficientom $k$; ploščine so v razmerju $k^2$. Razmerja dolžin na zemljevidu so enaka kot v naravi.
- Orodji za razmerja: vzporednica (podobni trikotniki) in skupna višina (razmerje ploščin je razmerje osnovnic).
- Cevov izrek: $AD$, $BE$, $CF$ so sočasne natanko tedaj, ko je $\frac{BD}{DC} \cdot \frac{CE}{EA} \cdot \frac{AF}{FB} = 1$.
- Menelajev izrek: $D$, $E$, $F$ na nosilkah stranic so kolinearne natanko tedaj, ko je isti zmnožek $1$ in je ena ali so vse tri točke na podaljških.
- Ulomke piši z obhodom $B \to D \to C \to E \to A \to F \to B$; v vsakem sta razdalji od iste točke.
- Pri težjih nalogah izberi pomožni trikotnik in transverzalo ali kombiniraj Cevo in Menelaja.

## Drugače: Z analogijo

Predstavljaj si menjalnice na potovanju. Za $1$ evro dobiš $\frac{3}{2}$ enote valute X, za enoto X dobiš $\frac{1}{3}$ enote valute Y, za enoto Y pa $2$ evra. Če zamenjaš evro v krogu, se vrneš z $\frac{3}{2} \cdot \frac{1}{3} \cdot 2 = 1$ evrom: krog je »pošten«.

Cevov izrek je enak pogoj. Vsaka točka na stranici je menjalnica med dvema ogliščema, razmerje pa menjalni tečaj. Cevijane se srečajo v eni točki natanko tedaj, ko obhod okoli trikotnika ne prinese ne zaslužka ne izgube. Zato mora biti obhod v krogu: menjalnica ne deluje, če vmes zamenjaš smer.

## Drugače: Iz vsakdanjega življenja

Na trikotni pladenj v oglišča $A$, $B$ in $C$ postavimo uteži z masami $1\,\mathrm{kg}$, $2\,\mathrm{kg}$ in $3\,\mathrm{kg}$. Kje ga podpreš s prstom, da ostane v ravnovesju?

Uteži v $B$ in $C$ sami bi uravnovesila točka $D$ na $BC$, bližje težji uteži: $\frac{BD}{DC} = \frac{3}{2}$. Enako dobimo $\frac{CE}{EA} = \frac{1}{3}$ in $\frac{AF}{FB} = 2$. Ravnovesna točka vseh treh uteži leži na vseh treh daljicah $AD$, $BE$, $CF$, zato se te sekajo v eni točki. Zmnožek razmerij je $\frac{3}{2} \cdot \frac{1}{3} \cdot 2 = 1$, kot na prvi risbi. Tekmovalci tej metodi rečejo »masne točke«.

## Preveri se

? Na zemljevidu iz vsake od vasi $A$, $B$, $C$ vodi ravna cesta do nasprotne stranice trikotnika: $AD$, $BE$ in $CF$. Kaj pomeni, da so te ceste sočasne?
- Vse tri so enako dolge.
~ Dolžina cest pri sočasnosti ni pomembna; tudi neenako dolge ceste se lahko srečajo v eni točki.
+ Vse tri potekajo skozi isto točko.
- Vse tri delijo nasprotne stranice na polovice.
~ To so težiščnice, le en poseben primer sočasnih cevijan.
- Vse tri so med seboj vzporedne.
~ Vzporedne premice se ne sekajo, sočasne pa imajo skupno točko.
> Sočasne premice imajo skupno točko. Za cevijane to preverimo s Cevovim izrekom.

? Ceste $AD$, $BE$ in $CF$ se srečajo v eni točki. Z zemljevida odčitaj razdalje (v km) in izračunaj $AF$, če je $AB = 5\,\mathrm{km}$.
:::risba skica
opis: Trikotnik ABC z AB = 5 km. Točka D na BC je 2 km od B in 4 km od C. Točka E na CA je 3 km od C in 1 km od A. Cevijane AD, BE in CF se sekajo v isti točki; F leži na AB.
območje: -1; -1 .. 6; 5
enota: 40
lik: 0; 0 -> 5; 0 -> 0,5; 3,97 | modra zaprto
črta: 0; 0 -> 3,5; 1,32 | oranžna
črta: 5; 0 -> 0,13; 0,99 | oranžna
črta: 0,5; 3,97 -> 2; 0 | oranžna
točka: 0; 0 | A | levo
točka: 5; 0 | B | desno
točka: 0,5; 3,97 | C | nad
točka: 3,5; 1,32 | D | desno
točka: 0,13; 0,99 | E | levo
točka: 2; 0 | F | pod
napis: 4,4; 0,9 | 2 | desno
napis: 2,2; 2,8 | 4 | desno
napis: 0,1; 2,6 | 3 | levo
napis: 0; 0,5 | 1 | levo
:::
= 2 km | 0,01
~ 3 | Razmerje si obrnil: iz Ceve sledi $\frac{AF}{FB} = \frac{2}{3}$, ne $\frac{3}{2}$.
~ 4,29 | Ulomek za $CA$ si zapisal kot $\frac{EA}{CE}$. Obhod v krogu da $\frac{CE}{EA} = 3$.
~ 2,5 | Vzel si del proti celoti, $\frac{BD}{BC} = \frac{2}{6}$. V ulomku sta oba dela stranice: $\frac{BD}{DC} = \frac{2}{4}$.
> $\frac{BD}{DC} \cdot \frac{CE}{EA} \cdot \frac{AF}{FB} = \frac{1}{2} \cdot 3 \cdot \frac{AF}{FB} = 1$, torej $\frac{AF}{FB} = \frac{2}{3}$ in $AF = \frac{2}{5} \cdot 5 = 2\,\mathrm{km}$.

? Točke $D$, $E$ in $F$ ležijo v notranjosti stranic $BC$, $CA$ in $AB$, zmnožek $\frac{BD}{DC} \cdot \frac{CE}{EA} \cdot \frac{AF}{FB}$ pa je $1$. Kaj od tega zagotovo sledi?
- Točke $D$, $E$ in $F$ ležijo na isti premici.
~ To bi trdil Menelajev izrek, ki pa zahteva eno ali tri točke na podaljških. Premica ne more sekati vseh treh stranic v notranjosti.
+ Daljice $AD$, $BE$ in $CF$ gredo skozi isto točko.
- Točke $D$, $E$ in $F$ so razpolovišča stranic.
~ Razpolovišča res dajo zmnožek $1$, a tudi razmerja $\frac{3}{2}$, $\frac{1}{3}$ in $2$ ga dajo. Zmnožek ne določi posameznih razmerij.
> Vse tri točke so na stranicah, zato velja obrat Cevovega izreka: cevijane so sočasne. Enak zmnožek z eno ali tremi točkami na podaljških bi pomenil, da so točke kolinearne (Menelaj).

? Trikotno jezero ima na zemljevidu v merilu $1 : 50\,000$ ploščino $2\,\mathrm{cm}^2$. Kolikšna je njegova ploščina v naravi?
- $1\,\mathrm{km}^2$
~ Ploščino si pomnožil z linearnim merilom ($1\,\mathrm{cm}$ je $0{,}5\,\mathrm{km}$). Ploščina se poveča s kvadratom merila.
+ $0{,}5\,\mathrm{km}^2$
- $0{,}25\,\mathrm{km}^2$
~ To je ploščina enega kvadratnega centimetra; jezero ima na zemljevidu $2\,\mathrm{cm}^2$.
> $1\,\mathrm{cm}^2$ na zemljevidu je $(0{,}5\,\mathrm{km})^2 = 0{,}25\,\mathrm{km}^2$, zato $2\,\mathrm{cm}^2$ ustreza $0{,}5\,\mathrm{km}^2$.

? Razvrsti korake reševanja naloge z Menelajevim izrekom.
1. Poišči trikotnik in premico, ki seka nosilke vseh treh njegovih stranic.
2. Obhodi trikotnik: oglišče, točka na stranici, naslednje oglišče in tako naprej.
3. Zapiši zmnožek treh razmerij in ga izenači z $1$.
4. Vstavi znana razmerja in izrazi neznano razmerje.
5. Iz razmerja določi, na kateri strani je točka na podaljšku, in izračunaj razdaljo.
> Najprej izbereš trikotnik in transverzalo, šele nato zapišeš razmerja v krogu. Lego točke na podaljšku določiš na koncu iz dobljenega razmerja.

:::simboli
A, B, C | oglišča trikotnika (vasi) | | |
D, E, F | točke na nosilkah stranic $BC$, $CA$, $AB$ | | |
P | presečišče cevijan | | |
Q | presečišče ceste $EF$ s podaljškom $BC$ | | |
G | presečišče transverzale z vzporednico skozi $C$ | | | v dokazu Menelajevega izreka
S | ploščina trikotnika | | | $S_{ABP}$ je ploščina trikotnika $ABP$
q, x | iskana razdalja od $B$ do točke na podaljšku | | km |
k | koeficient podobnosti | | – | ploščine se spremenijo za $k^2$
:::

<<RACUN
vrednost: 2.4/3.6 | 2/3
resi: (2/3)*(1/2)*x = 1 | x | 3
vrednost: 3/4*10 | 7.5
enote: 7.5*25000*cm | 1.875*km
resi: x*(1/2)*(3/2) = 1 | x | 4/3
vrednost: 10/6 | 5/3
resi: x*(5/3) = 1 | x | 3/5
resi: q/(q + 16) = 3/5 | q | 24
resi: x*3*(1/2) = 1 | x | 2/3
resi: q/(q + 6) = 2/3 | q | 12
vrednost: 3/2*1/3*2 | 1
vrednost: 1/3*1*3 | 1
resi: (1/2)*3*x = 1 | x | 2/3
vrednost: 2/5*5 | 2
vrednost: 3/5*5 | 3
vrednost: 6/7*5 | 4.29
resi: (1/3)*3*x = 1 | x | 1
vrednost: 1/2*5 | 2.5
vrednost: 2*50000^2/10^10 | 0.5
vrednost: 0.5^2 | 0.25
>>
