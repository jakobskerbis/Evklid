---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V roki držiš utež z maso $5\,\mathrm{kg}$, podlaht je vodoravna. Teža uteži je približno $49\,\mathrm{N}$. Meritve z elektromiografijo in modeli mišic pa pokažejo, da dvoglava nadlaktna mišica (biceps) pri tem vleče s silo okoli $400\,\mathrm{N}$ – osemkrat več, kot je teža uteži. Če bi o sili razmišljal le kot o »potegu, ki mora uravnotežiti drug poteg«, bi pričakoval približno $49\,\mathrm{N}$. Meritve tega ne potrdijo.

Razlaga je v tem, **kje** sila prijemlje. Kita bicepsa je pripeta na podlaket le okoli $4\,\mathrm{cm}$ od komolca, utež pa je od komolca oddaljena okoli $33\,\mathrm{cm}$. Za zasuk okoli komolca ne šteje sama sila, ampak sila, pomnožena z razdaljo od osi: $F_b \cdot 0{,}04\,\mathrm{m}$ mora biti enako $49\,\mathrm{N} \cdot 0{,}33\,\mathrm{m}$, od tod $F_b \approx 405\,\mathrm{N}$. Ta zmnožek je **moment sile**. Isto orodje določa silo v vijaku, ki drži konzolo, preobremenitev žerjava, sile v podporah nosilca in silo, s katero ortodontska žica premika zob. Vsa statika, od ravnotežja nosilcev do paličij, stoji na dveh pojmih te lekcije: na sili kot vektorju z nosilko in na momentu.

## Razlaga

### Staro orodje: sila kot vektor

Iz srednje šole poznaš silo kot vektor: ima velikost, smer in usmerjenost. V ravnini jo zapišemo s komponentama, $\vec{F} = (F_x, F_y)$, kjer je pri kotu $\alpha$ glede na os $x$

$$F_x = F\cos\alpha, \qquad F_y = F\sin\alpha.$$

**Definicija.** Sile, katerih nosilke se sekajo v isti točki, so **sočasne** (konkurentne). Njihova **rezultanta** je vektorska vsota

$$\vec{F}_R = \sum_i \vec{F}_i, \qquad F_{Rx} = \sum_i F_{ix}, \quad F_{Ry} = \sum_i F_{iy}.$$

Velikost je $F_R = \sqrt{F_{Rx}^2 + F_{Ry}^2}$, smer pa določa $\tan\alpha_R = F_{Ry}/F_{Rx}$ (kvadrant izberemo po predznakih komponent). Za delec, kjer so vse sile sočasne, je to vse, kar potrebujemo: delec miruje natanko tedaj, ko je $\vec{F}_R = 0$.

### Kaj je pri togem telesu drugače

Pri togem telesu (telesu, pri katerem se razdalje med točkami ne spreminjajo) staro orodje ni dovolj. Primerjaj:

| | delec | togo telo |
|---|---|---|
| kje prijemlje sila | vse v isti točki | vsaka sila v svoji točki |
| kaj sila povzroči | premik | premik in zasuk |
| kdaj sta sili enakovredni | enak vektor | enak vektor **in** ista nosilka |
| pogoj mirovanja | $\sum\vec{F} = 0$ | $\sum\vec{F} = 0$ in $\sum\vec{M} = 0$ |

**Nosilka** sile je premica skozi prijemališče v smeri sile. Na togem telesu lahko silo premikamo vzdolž nosilke, ne da bi se učinek spremenil (**izrek o premikanju sile po nosilki**): ali vrv vleče voziček od spredaj ali ga drog z isto silo potiska od zadaj, je za togo telo vseeno. Sila na togem telesu je zato **drsni vektor**. Če pa jo premaknemo vzporedno na drugo nosilko, se spremeni njen vrtilni učinek. Ta učinek meri moment.

### Moment sile glede na točko

**Definicija.** Moment sile $\vec{F}$, ki prijemlje v točki $A$, glede na točko $O$ je

$$\vec{M}_O = \vec{r} \times \vec{F},$$

kjer je $\vec{r} = \overrightarrow{OA}$. Velikost je

$$M_O = rF\sin\varphi = F\,d,$$

$\varphi$ je kot med $\vec{r}$ in $\vec{F}$, $d = r\sin\varphi$ pa je **ročica**: pravokotna razdalja od $O$ do nosilke sile. Enota je $\mathrm{N\,m}$ (v gradbeništvu pogosto $\mathrm{kN\,m}$). Vektor $\vec{M}_O$ je pravokoten na ravnino, ki jo določata $\vec{r}$ in $\vec{F}$; smer da pravilo desne roke.

Iz definicije sledijo tri lastnosti, ki jih pri računanju stalno uporabljamo:

1. Moment je odvisen od izbire točke $O$. Ista sila ima glede na različne točke različne momente.
2. Sila, katere nosilka gre skozi $O$, ima glede na $O$ moment nič ($d = 0$).
3. Moment se ne spremeni, če silo premaknemo po nosilki: ročica ostane enaka. To je algebrska oblika izreka o premikanju po nosilki.

**V ravnini** so vsi momenti pravokotni na ravnino, zato jih obravnavamo kot števila s predznakom. Dogovor v tej lekciji: moment je **pozitiven, kadar sila vrti v nasprotni smeri urnega kazalca**. Iz vektorskega produkta s $\vec{r} = (x, y)$ in $\vec{F} = (F_x, F_y)$ dobimo

$$M_O = xF_y - yF_x.$$

**Varignonov izrek.** Moment rezultante sočasnih sil glede na katero koli točko je enak vsoti momentov posameznih sil glede na isto točko.

**Dokaz.** Naj sile $\vec{F}_1, \dots, \vec{F}_n$ prijemljejo v isti točki s krajevnim vektorjem $\vec{r}$. Vektorski produkt je distributiven, zato je $\vec{r}\times\vec{F}_1 + \dots + \vec{r}\times\vec{F}_n = \vec{r}\times(\vec{F}_1 + \dots + \vec{F}_n) = \vec{r}\times\vec{F}_R$. $\square$

Najpogostejša uporaba: silo razstavimo na komponenti $F_x$ in $F_y$ in seštejemo njuna momenta. To je točno formula $M_O = xF_y - yF_x$: komponenta $F_y$ ima ročico $x$, komponenta $F_x$ ročico $y$ in vrti v drugo smer. Ročice poševne sile tako ni treba risati.

**Moment glede na os.** Pri prostorskih nalogah potrebujemo še moment glede na os skozi $O$ s smernim enotskim vektorjem $\vec{e}$:

$$M_e = \vec{e}\cdot\left(\vec{r}\times\vec{F}\right).$$

To je komponenta $\vec{M}_O$ v smeri osi. Sila, vzporedna z osjo ali s nosilko, ki os seka, ima glede na os moment nič.

:::premisli
Vijačni ključ zasučeš enkrat s silo pravokotno na ročaj, drugič z enako veliko silo pod kotom $30^\circ$ glede na ročaj, obakrat na koncu ročaja. Za koliko se moment razlikuje, in zakaj sila v smeri ročaja sploh ne zasuče matice?
---
Pri kotu $30^\circ$ je ročica $r\sin 30^\circ = r/2$, zato je moment polovico manjši. Sila v smeri ročaja ima nosilko skozi os vijaka ($\varphi = 0$, $d = 0$), zato je njen moment nič: matico le potiska vstran.
:::

### Dvojica sil

Kaj pa se zgodi, če sta dve sili nasprotno enaki, vendar ne na isti nosilki? Vektorska vsota je nič, telo se torej ne premika. Pa vendar se vrti: tako zasučemo volan z obema rokama ali ključ za kolesne vijake v obliki križa.

**Definicija.** **Dvojica sil** sta dve vzporedni, nasprotno enaki sili $\vec{F}$ in $-\vec{F}$ z različnima nosilkama. Razdalja $d$ med nosilkama je ročica dvojice.

**Izrek.** Rezultanta dvojice je nič, njen moment pa je enak glede na vsako točko:

$$\vec{M} = \vec{r}_{BA}\times\vec{F}, \qquad M = F\,d,$$

kjer sila $\vec{F}$ prijemlje v $A$, sila $-\vec{F}$ v $B$ in je $\vec{r}_{BA} = \overrightarrow{BA}$.

**Dokaz.** Za poljubno točko $O$ je vsota momentov $\vec{r}_A\times\vec{F} + \vec{r}_B\times(-\vec{F}) = (\vec{r}_A - \vec{r}_B)\times\vec{F} = \overrightarrow{BA}\times\vec{F}$. Rezultat ne vsebuje $O$, torej je moment neodvisen od izbire točke. $\square$

Posledice: dvojico opiše samo njen moment (velikost, ravnina, smer vrtenja), zato je **prosti vektor** – lahko jo premaknemo kamor koli v ravnini. Dve dvojici z enakim momentom sta enakovredni, tudi če imata različni sili in ročici: dvojica $10\,\mathrm{N}$ na ročici $0{,}2\,\mathrm{m}$ učinkuje kot $4\,\mathrm{N}$ na ročici $0{,}5\,\mathrm{m}$. Dvojice ne moremo uravnotežiti z eno samo silo, le z drugo dvojico.

Na skicah dvojico rišemo kot zaokroženo puščico z oznako $M$; v ravnini jo seštevamo kot število s predznakom.

### Premik sile in redukcija sistema sil

Zdaj lahko povežemo silo in dvojico.

**Izrek o vzporednem premiku sile.** Sila $\vec{F}$ s prijemališčem v $A$ je enakovredna enaki sili $\vec{F}$ v točki $O$ in dvojici z momentom $\vec{M} = \overrightarrow{OA}\times\vec{F}$.

**Dokaz.** V točki $O$ dodamo sili $\vec{F}$ in $-\vec{F}$; skupaj sta nič, zato se učinek ne spremeni. Prvotna sila v $A$ in $-\vec{F}$ v $O$ tvorita dvojico z momentom $\overrightarrow{OA}\times\vec{F}$. Ostane $\vec{F}$ v $O$ in ta dvojica. $\square$

Če to naredimo z vsako silo sistema, dobimo **redukcijo sistema sil na točko $O$**: poljuben sistem sil in dvojic je enakovreden eni sili in eni dvojici v $O$,

$$\vec{F}_R = \sum_i\vec{F}_i, \qquad \vec{M}_{RO} = \sum_i\vec{r}_i\times\vec{F}_i + \sum_j\vec{M}_j.$$

$\vec{F}_R$ ni odvisna od izbire $O$, $\vec{M}_{RO}$ pa je: pri prehodu na točko $P$ velja $\vec{M}_{RP} = \vec{M}_{RO} + \overrightarrow{PO}\times\vec{F}_R$.

**Ravninski sistem.** Za sile v ravnini $xy$ je $M_{RO} = \sum(x_iF_{iy} - y_iF_{ix}) + \sum M_j$. Možni so trije izidi:

| $F_R$ | $M_{RO}$ | sistem je enakovreden |
|---|---|---|
| $0$ | $0$ | ničelnemu sistemu (ravnotežje) |
| $0$ | $\neq 0$ | eni dvojici |
| $\neq 0$ | poljuben | eni sili (rezultanti) na nosilki $xF_{Ry} - yF_{Rx} = M_{RO}$ |

V tretjem primeru rezultanto premaknemo tako, da njen moment glede na $O$ nadomesti dvojico: točke $(x, y)$ na nosilki zadoščajo enačbi v tabeli. Ročica rezultante glede na $O$ je $d_R = |M_{RO}|/F_R$.

**Porazdeljena obtežba.** Lastna teža plošče, sneg ali tlak zemljine niso točkovne sile, ampak obtežba $q(x)$ v $\mathrm{kN/m}$ vzdolž nosilca. Njena rezultanta je ploščina pod diagramom, prijemlje pa v težišču te ploščine:

$$F_q = \int_a^b q(x)\,\mathrm{d}x, \qquad x_q = \frac{1}{F_q}\int_a^b x\,q(x)\,\mathrm{d}x.$$

Za enakomerno obtežbo $q$ na dolžini $l$ je $F_q = ql$ na sredini odseka, za trikotno (od $0$ do $q_0$) je $F_q = \tfrac12 q_0l$ na tretjini dolžine od večje ordinate.

:::premisli
Na togo ploščo deluje sila $8\,\mathrm{kN}$ in dvojica $-12\,\mathrm{kN\,m}$. Ali obstaja ena sama sila, ki ploščo obremeni enako? Kaj pa, če bi sile sploh ne bilo, le dvojica?
---
Prvi primer: da. Ista sila $8\,\mathrm{kN}$, premaknjena vzporedno za $d = 12/8 = 1{,}5\,\mathrm{m}$ na tisto stran, da njen moment glede na prvotno prijemališče znaša $-12\,\mathrm{kN\,m}$ (vrti v smeri urnega kazalca). Drugi primer: ne. Dvojica ima rezultanto nič, ena sila pa ima rezultanto različno od nič; dvojico nadomesti le druga dvojica.
:::

## Rešeni primeri

### Primer 1 (lažji)

Pri vaji za kolenske iztegovalke ima pacient na gležnju utež s težo $30\,\mathrm{N}$, ki je od kolenskega sklepa oddaljena $0{,}40\,\mathrm{m}$. Kolikšen je moment teže uteži glede na koleno, ko je goleň vodoravna, ko je $30^\circ$ pod vodoravnico in ko visi navpično?

**Podatki:** $F = 30\,\mathrm{N}$ (navpično navzdol), $r = 0{,}40\,\mathrm{m}$, kot golenice glede na vodoravnico $\beta = 0^\circ$, $30^\circ$, $90^\circ$
**Iščemo:** moment $M$ glede na koleno v vseh treh legah

:::formula
$M = F\,d$, ročica $d = r\cos\beta$ (vodoravna razdalja od kolena do navpične nosilke teže)
:::

**Rešitev:**

1. Sila je navpična, zato je ročica vodoravna razdalja od kolena do uteži, ne razdalja vzdolž golenice.
2. Vodoravna goleň: $d = 0{,}40\,\mathrm{m}$, $M = 30 \cdot 0{,}40\,\mathrm{N\,m} = 12\,\mathrm{N\,m}$.
3. Pri $30^\circ$: $d = 0{,}40\,\mathrm{m}\cdot\cos 30^\circ \approx 0{,}346\,\mathrm{m}$, $M \approx 30\,\mathrm{N}\cdot 0{,}346\,\mathrm{m} \approx 10{,}4\,\mathrm{N\,m}$.
4. Navpična goleň: nosilka teže gre skozi koleno, $d = 0$, zato $M = 0$.
5. Smer: utež vleče goleň navzdol, torej proti iztegu; mišica mora dati nasprotno enak moment.
6. Odgovor: moment je $12\,\mathrm{N\,m}$ pri vodoravni goleni, približno $10{,}4\,\mathrm{N\,m}$ pri $30^\circ$ in nič pri navpični. Sila je ves čas enaka, moment pa se spreminja z ročico – zato je vaja najtežja pri iztegnjeni nogi.

### Primer 2

Na pločevinasto vozliščno ploščo delujejo tri sile s skupnim prijemališčem: $F_1 = 400\,\mathrm{N}$ v smeri osi $x$, $F_2 = 300\,\mathrm{N}$ pod kotom $60^\circ$ in $F_3 = 250\,\mathrm{N}$ pod kotom $210^\circ$ (koti so merjeni od pozitivne osi $x$ v nasprotni smeri urnega kazalca). Določi velikost in smer rezultante.

**Podatki:** $F_1 = 400\,\mathrm{N}$, $\alpha_1 = 0^\circ$; $F_2 = 300\,\mathrm{N}$, $\alpha_2 = 60^\circ$; $F_3 = 250\,\mathrm{N}$, $\alpha_3 = 210^\circ$; sile so sočasne
**Iščemo:** $F_R$ in kot $\alpha_R$

:::formula
$F_{Rx} = \sum F_i\cos\alpha_i$, $F_{Ry} = \sum F_i\sin\alpha_i$, $F_R = \sqrt{F_{Rx}^2 + F_{Ry}^2}$, $\tan\alpha_R = F_{Ry}/F_{Rx}$
:::

**Rešitev:**

1. Komponente sestavimo v tabelo, ker se tako najlažje izognemo napaki v predznaku:

| sila | $F_x$ / N | $F_y$ / N |
|---|---|---|
| $F_1$ | $400{,}0$ | $0$ |
| $F_2$ | $150{,}0$ | $259{,}8$ |
| $F_3$ | $-216{,}5$ | $-125{,}0$ |
| vsota | $333{,}5$ | $134{,}8$ |

2. Pri $F_3$ sta obe komponenti negativni, ker je $210^\circ$ v tretjem kvadrantu: $\cos 210^\circ \approx -0{,}866$, $\sin 210^\circ = -0{,}5$.
3. Velikost: $F_R = \sqrt{333{,}5^2 + 134{,}8^2}\,\mathrm{N} \approx 359{,}7\,\mathrm{N}$.
4. Smer: obe komponenti sta pozitivni, rezultanta je v prvem kvadrantu; $\alpha_R = \arctan(134{,}8/333{,}5) \approx 22{,}0^\circ$.
5. Odgovor: rezultanta ima velikost približno $360\,\mathrm{N}$ in z osjo $x$ oklepa kot približno $22^\circ$. Ker so sile sočasne, prijemlje v isti točki in ni nobene dvojice.

### Primer 3 (težji)

Vodoravni nosilec $AB$ dolžine $6{,}0\,\mathrm{m}$ leži na osi $x$, točka $A$ je v izhodišču. Obremenjen je s točkovno silo $10\,\mathrm{kN}$ navpično navzdol pri $x = 2{,}0\,\mathrm{m}$, z enakomerno obtežbo $q = 4{,}0\,\mathrm{kN/m}$ navzdol na odseku od $x = 3{,}0\,\mathrm{m}$ do $x = 6{,}0\,\mathrm{m}$, s silo $5{,}0\,\mathrm{kN}$ v točki $B$, ki kaže navzdol in v levo pod kotom $30^\circ$ pod vodoravnico, in z dvojico $6{,}0\,\mathrm{kN\,m}$ v nasprotni smeri urnega kazalca. Reduciraj sistem na točko $A$, nato pa ga nadomesti z eno silo in določi, kje njena nosilka seka os nosilca.

**Podatki:** $l = 6{,}0\,\mathrm{m}$; $F_1 = 10\,\mathrm{kN}$ pri $x_1 = 2{,}0\,\mathrm{m}$ (navzdol); $q = 4{,}0\,\mathrm{kN/m}$ na $[3{,}0; 6{,}0]\,\mathrm{m}$; $F_3 = 5{,}0\,\mathrm{kN}$ v $B$ ($x = 6{,}0\,\mathrm{m}$), $30^\circ$ pod vodoravnico, v levo; $M = +6{,}0\,\mathrm{kN\,m}$
**Iščemo:** $F_{Rx}$, $F_{Ry}$, $M_{RA}$, velikost in smer rezultante, presečišče $x_R$ nosilke z osjo nosilca

:::formula
$F_q = q\,l_q$ v sredini odseka; $F_{Rx} = \sum F_{ix}$, $F_{Ry} = \sum F_{iy}$; $M_{RA} = \sum(x_iF_{iy} - y_iF_{ix}) + \sum M_j$; nosilka: $x_R F_{Ry} = M_{RA}$ pri $y = 0$
:::

**Rešitev:**

1. Porazdeljeno obtežbo nadomestimo z rezultanto: $F_q = 4{,}0 \cdot 3{,}0\,\mathrm{kN} = 12\,\mathrm{kN}$ navzdol pri $x_q = 4{,}5\,\mathrm{m}$ (sredina odseka).
2. Sila v $B$ po komponentah: $F_{3x} = -5{,}0\cos 30^\circ\,\mathrm{kN} \approx -4{,}33\,\mathrm{kN}$, $F_{3y} = -5{,}0\sin 30^\circ\,\mathrm{kN} = -2{,}5\,\mathrm{kN}$.
3. Rezultanta: $F_{Rx} \approx -4{,}33\,\mathrm{kN}$, $F_{Ry} = -10 - 12 - 2{,}5 = -24{,}5\,\mathrm{kN}$.
4. Momenti glede na $A$ (vsa prijemališča imajo $y = 0$, zato vodoravne komponente nimajo momenta, Varignonov izrek): $M_{RA} = 2{,}0 \cdot (-10) + 4{,}5 \cdot (-12) + 6{,}0 \cdot (-2{,}5) + 6{,}0 = -83\,\mathrm{kN\,m}$.
5. Redukcija na $A$: sila $(-4{,}33; -24{,}5)\,\mathrm{kN}$ in dvojica $-83\,\mathrm{kN\,m}$ (v smeri urnega kazalca).
6. Velikost rezultante: $F_R = \sqrt{4{,}33^2 + 24{,}5^2}\,\mathrm{kN} \approx 24{,}9\,\mathrm{kN}$; s vodoravnico oklepa kot $\arctan(24{,}5/4{,}33) \approx 80{,}0^\circ$ in kaže navzdol in v levo.
7. Ker $F_R \neq 0$, sistem nadomesti ena sila. Njena nosilka seka os nosilca v točki $(x_R, 0)$, za katero mora biti moment rezultante glede na $A$ enak $M_{RA}$: $x_R F_{Ry} = M_{RA}$, torej $x_R = -83/(-24{,}5)\,\mathrm{m} \approx 3{,}39\,\mathrm{m}$.
8. Preizkus smisla: večina obtežbe je desno od sredine nosilca ($12\,\mathrm{kN}$ pri $4{,}5\,\mathrm{m}$), dvojica v nasprotni smeri urnega kazalca pa rezultanto premakne nekoliko proti $A$. Vrednost med $2$ in $4{,}5\,\mathrm{m}$ je smiselna.
9. Odgovor: sistem je enakovreden sili približno $24{,}9\,\mathrm{kN}$, ki kaže navzdol in v levo pod kotom $80^\circ$ glede na vodoravnico; njena nosilka seka os nosilca $3{,}39\,\mathrm{m}$ od $A$. Redukcija na $A$ da isto silo in dvojico $-83\,\mathrm{kN\,m}$.

### Primer 4 – zdaj ti

Ortodont pritrdi na zob nosilec (bracket) in nanj deluje z vodoravno silo $1{,}2\,\mathrm{N}$. Zob se okoli točke, ki ji pravimo središče upora, zasuka, ker je nosilec $9{,}0\,\mathrm{mm}$ nad to točko. Da bi se zob premikal vzporedno (brez nagibanja), mora žica na nosilec dodati dvojico, ki moment sile ravno izniči. Dvojico dajeta dve nasprotni sili na razdalji $4{,}0\,\mathrm{mm}$. Kolikšna mora biti vsaka od njiju?

**Podatki:** $F = 1{,}2\,\mathrm{N}$, ročica sile glede na središče upora $d = 9{,}0\,\mathrm{mm}$, ročica dvojice $d_D = 4{,}0\,\mathrm{mm}$
**Iščemo:** sili dvojice $F_D$

:::formula
$M_F = F\,d$; dvojica: $M_D = F_D\,d_D$; brez nagibanja: $M_D = -M_F$
:::

**Rešitev:**

1. Moment sile glede na središče upora: $M_F = 1{,}2 \cdot 9{,}0\,\mathrm{N\,mm} = 10{,}8\,\mathrm{N\,mm}$. Ta moment zob nagiba.
2. Moment dvojice je neodvisen od točke, zato ga lahko neposredno primerjamo z $M_F$: potrebujemo dvojico z $|M_D| = 10{,}8\,\mathrm{N\,mm}$ v nasprotni smeri.
3. Zdaj ti: izračunaj $F_D$ in premisli, ali dvojica spremeni silo, ki zob premika vstran.

:::premisli
Kolikšna je $F_D$ in kaj ostane od obremenitve zoba?
---
$F_D = M_D/d_D = 10{,}8\,\mathrm{N\,mm}/4{,}0\,\mathrm{mm} = 2{,}7\,\mathrm{N}$. Dvojica ima rezultanto nič, zato ostane le sila $1{,}2\,\mathrm{N}$, zdaj brez momenta glede na središče upora: zob se premakne vzporedno. Ortodonti to opišejo z razmerjem moment/sila $10{,}8/1{,}2 = 9{,}0\,\mathrm{mm}$.
:::

## Pogoste napake

- **Razdalja do prijemališča namesto ročice.** Pri poševni sili je $r$ razdalja do prijemališča, ročica pa $d = r\sin\varphi$. Popravek: nariši nosilko in pravokotnico nanjo ali uporabi $M = xF_y - yF_x$, kjer ročice sploh ne rišeš.
- **»Rezultanta je nič, torej telo miruje.«** Pri dvojici je $\vec{F}_R = 0$, pa se telo vrti. Pri togem telesu je treba preveriti tudi momente.
- **Moment dvojice glede na »pravo« točko.** Študent išče, okoli katere točke naj računa moment dvojice. Moment dvojice je glede na vse točke enak $F\,d$; moment posamezne sile pa ni.
- **Napačen predznak pri komponenti $F_x$.** V $M_O = xF_y - yF_x$ ima člen $yF_x$ minus: vodoravna sila v smeri $+x$ nad točko $O$ vrti v smeri urnega kazalca. Popravek: pri vsakem členu na skici preveri smer vrtenja.
- **Porazdeljena obtežba na napačnem mestu.** Rezultanta trikotne obtežbe ni na sredini, ampak v težišču trikotnika, na tretjini od večje ordinate. Enakomerno obtežbo $q$ moraš pred računom momenta pomnožiti z dolžino odseka.

## Povzetek

- Sila na togem telesu je drsni vektor: premik po nosilki učinka ne spremeni, vzporedni premik pa ga.
- Rezultanta: $\vec{F}_R = \sum\vec{F}_i$, po komponentah $F_{Rx} = \sum F_{ix}$, $F_{Ry} = \sum F_{iy}$.
- Moment glede na točko: $\vec{M}_O = \vec{r}\times\vec{F}$, $M_O = F\,d$; v ravnini $M_O = xF_y - yF_x$, pozitivno v nasprotni smeri urnega kazalca.
- Varignonov izrek: moment rezultante je vsota momentov komponent.
- Dvojica: rezultanta nič, moment $F\,d$ enak glede na vsako točko (prosti vektor).
- Vzporedni premik sile da silo in dvojico $\overrightarrow{OA}\times\vec{F}$; vsak sistem se reducira na $\vec{F}_R$ in $\vec{M}_{RO}$.
- Porazdeljena obtežba: rezultanta je ploščina diagrama, v težišču ploščine.

## Za izpit

Znati moraš povedati:

- definicijo momenta sile glede na točko in glede na os ter pomen ročice in nosilke;
- Varignonov izrek z dokazom;
- definicijo dvojice in dokaz, da je njen moment neodvisen od izbire točke;
- izrek o vzporednem premiku sile z dokazom in postopek redukcije sistema sil na točko;
- kdaj je ravninski sistem enakovreden ničelnemu sistemu, dvojici ali eni sili, in kako določiš nosilko rezultante;
- rezultanto in prijemališče porazdeljene obtežbe (enakomerne in trikotne).

### Naloga 1

Navpični drog je vpet v točki $O$ v izhodišču koordinatnega sistema, os $z$ kaže navzgor. Z vrha droga $A(0; 0; 7)\,\mathrm{m}$ je napeta jeklena vrv do sidra $B(4; -4; 0)\,\mathrm{m}$, sila v vrvi je $18\,\mathrm{kN}$. Določi vektor sile vrvi na drog, moment te sile glede na $O$, pravokotno razdaljo od $O$ do nosilke vrvi in moment glede na os skozi $O$ v smeri točke $C(3; 4; 0)\,\mathrm{m}$.

**Rešitev:**

1. Smer vrvi od $A$ proti $B$: $\overrightarrow{AB} = (4; -4; -7)\,\mathrm{m}$, dolžina $\sqrt{16 + 16 + 49}\,\mathrm{m} = 9\,\mathrm{m}$.
2. Sila vrvi na drog kaže od $A$ proti sidru: $\vec{F} = 18\,\mathrm{kN}\cdot\tfrac{1}{9}(4; -4; -7) = (8; -8; -14)\,\mathrm{kN}$.
3. Moment glede na $O$ z $\vec{r} = \overrightarrow{OA} = (0; 0; 7)\,\mathrm{m}$: $\vec{M}_O = \vec{r}\times\vec{F} = (0\cdot(-14) - 7\cdot(-8);\ 7\cdot 8 - 0\cdot(-14);\ 0\cdot(-8) - 0\cdot 8)\,\mathrm{kN\,m} = (56; 56; 0)\,\mathrm{kN\,m}$.
4. Velikost: $M_O = \sqrt{56^2 + 56^2}\,\mathrm{kN\,m} \approx 79{,}2\,\mathrm{kN\,m}$. Komponenta $z$ je nič, ker nosilka seka os droga (v $A$).
5. Razdalja do nosilke: $d = M_O/F \approx 79{,}2/18\,\mathrm{m} \approx 4{,}40\,\mathrm{m}$.
6. Os $OC$: enotski vektor $\vec{e} = (3; 4; 0)/5 = (0{,}6; 0{,}8; 0)$; $M_e = \vec{e}\cdot\vec{M}_O = 0{,}6 \cdot 56 + 0{,}8 \cdot 56 = 78{,}4\,\mathrm{kN\,m}$.
7. Odgovor: $\vec{F} = (8; -8; -14)\,\mathrm{kN}$, $\vec{M}_O = (56; 56; 0)\,\mathrm{kN\,m}$ z velikostjo $79{,}2\,\mathrm{kN\,m}$, nosilka je $4{,}40\,\mathrm{m}$ od $O$, moment glede na os $OC$ pa je $78{,}4\,\mathrm{kN\,m}$.

### Naloga 2

Natančno definiraj dvojico sil in dokaži, da je njen moment neodvisen od izbire točke. Nato dokaži izrek o vzporednem premiku sile in utemelji, ali je mogoče sistem »sila $\vec{F} \neq 0$ in dvojica $M$« v ravnini vedno nadomestiti z eno samo silo. Kje leži njena nosilka?

**Rešitev:**

1. Definicija: dvojica sta sili $\vec{F}$ v $A$ in $-\vec{F}$ v $B$ z vzporednima, različnima nosilkama; rezultanta je $\vec{F} + (-\vec{F}) = 0$.
2. Za poljubno točko $O$: $\vec{r}_A\times\vec{F} - \vec{r}_B\times\vec{F} = (\vec{r}_A - \vec{r}_B)\times\vec{F} = \overrightarrow{BA}\times\vec{F}$; izraz ne vsebuje $O$, velikost je $F\,d$.
3. Vzporedni premik: v $O$ dodamo $\vec{F}$ in $-\vec{F}$ (vsota nič). Sila v $A$ in $-\vec{F}$ v $O$ sta dvojica z momentom $\overrightarrow{OA}\times\vec{F}$, ostane sila $\vec{F}$ v $O$.
4. Obratno: sila $\vec{F}$ v $O$ in dvojica $M$ v ravnini. Premaknemo $\vec{F}$ vzporedno v točko $P$, za katero je $\overrightarrow{OP}\times\vec{F} = M\vec{k}$ ($\vec{k}$ je enotski vektor, pravokoten na ravnino); tedaj sta dvojici iz koraka 3 in $M$ nasprotno enaki in se izničita.
5. Taka točka obstaja vedno, kadar je $F \neq 0$: vzamemo $P$ na pravokotnici na $\vec{F}$ skozi $O$ na razdalji $d = |M|/F$, na tisto stran, da je predznak momenta pravilen.
6. Nosilka je vzporedna s $\vec{F}$, od $O$ oddaljena $|M|/F$; v koordinatah je to premica $xF_y - yF_x = M$. Če je $F = 0$, ena sila ne zadošča: sistem je dvojica.

### Naloga 3

Pravokotna plošča ima oglišča $O(0; 0)$, $A(4; 0)$, $B(4; 3)$ in $C(0; 3)$, enote so metri. V $A$ deluje sila $6\,\mathrm{kN}$ v smeri $+y$, v $B$ sila $8\,\mathrm{kN}$ v smeri $-x$, v $C$ sila $\vec{F}_C = (3; -4)\,\mathrm{kN}$, poleg tega pa še dvojica $10\,\mathrm{kN\,m}$ v smeri urnega kazalca. Reduciraj sistem na $O$, določi velikost rezultante in zapiši enačbo njene nosilke. Kje seka nosilka osi $x$ in $y$?

**Rešitev:**

1. Rezultanta: $F_{Rx} = -8 + 3 = -5\,\mathrm{kN}$, $F_{Ry} = 6 - 4 = 2\,\mathrm{kN}$; $F_R = \sqrt{5^2 + 2^2}\,\mathrm{kN} \approx 5{,}39\,\mathrm{kN}$.
2. Momenti glede na $O$ po $M = xF_y - yF_x$: sila v $A$: $4 \cdot 6 = 24\,\mathrm{kN\,m}$; sila v $B$: $4 \cdot 0 - 3 \cdot (-8) = 24\,\mathrm{kN\,m}$; sila v $C$: $0 \cdot (-4) - 3 \cdot 3 = -9\,\mathrm{kN\,m}$; dvojica $-10\,\mathrm{kN\,m}$.
3. Skupaj: $M_{RO} = 24 + 24 - 9 - 10 = 29\,\mathrm{kN\,m}$.
4. Nosilka: $xF_{Ry} - yF_{Rx} = M_{RO}$, torej $2x + 5y = 29$ (v metrih).
5. Presečišča: pri $y = 0$ je $x = 14{,}5\,\mathrm{m}$, pri $x = 0$ je $y = 5{,}8\,\mathrm{m}$. Nosilka teče zunaj plošče, kar je dovoljeno: rezultanta je računski nadomestek, ne sila, ki bi morala prijemati na plošči.
6. Razdalja nosilke od $O$: $d = M_{RO}/F_R \approx 29/5{,}39\,\mathrm{m} \approx 5{,}39\,\mathrm{m}$.
7. Odgovor: redukcija na $O$ da silo $(-5; 2)\,\mathrm{kN}$ in dvojico $29\,\mathrm{kN\,m}$; rezultanta $5{,}39\,\mathrm{kN}$ leži na premici $2x + 5y = 29$, ki seka os $x$ pri $14{,}5\,\mathrm{m}$ in os $y$ pri $5{,}8\,\mathrm{m}$.

## Drugače: Na sliki

Nosilec iz Primera 3, gledan od strani (puščice navzdol so sile, $q$ je enakomerna obtežba):

```
          10 kN        q = 4 kN/m
            |      | | | | | | | |
            v      v v v v v v v v   5 kN
  A=========*======*=============B  /
  0        2,0    3,0           6,0 v (30° pod vodoravnico, v levo)
   (+6 kN m, v nasprotni smeri urnega kazalca)
```

Isti sistem po redukciji na $A$: ena sila $24{,}9\,\mathrm{kN}$ v točki $A$ in dvojica $-83\,\mathrm{kN\,m}$. Po premiku rezultante ostane ena sama puščica, ki seka os pri $3{,}39\,\mathrm{m}$, dvojice ni več:

```
                 24,9 kN (80° pod vodoravnico)
                     \
                      v
  A==================*===========B
  0                 3,39        6,0
```

Vse tri skice opisujejo **isto obremenitev togega telesa**. Za notranje sile v nosilcu (kasneje: upogibni momenti) pa niso enake – redukcija velja le za učinek na telo kot celoto.

## Drugače: Uporaba v stroki

**Biomehanika in fizioterapija.** Sklepi so osi, mišice in teža pa sile z majhnimi ali velikimi ročicami. Ker so mišične ročice kratke (biceps okoli $4\,\mathrm{cm}$, kolenske iztegovalke prek pogačice okoli $5\,\mathrm{cm}$), so sile v kitah in sklepih večkratnik teže bremena. Zato fizioterapevt pri rehabilitaciji spreminja ročico (lega uteži, kot sklepa), ne le maso uteži, ergonomska navodila pa zahtevajo, da breme dvignemo blizu telesa: ista masa pri pol manjši ročici pomeni pol manjši moment v ledvenem delu hrbtenice.

**Ortodontija.** Zob se pod točkovno silo nagne, ker sila nima nosilke skozi središče upora. Z dvojico, ki jo da upognjena ali zasukana žica, ortodont nadzira razmerje moment/sila in s tem, ali se zob nagne, premakne vzporedno ali zasuka koren.

**Gradbišče.** Avtodvigalo ima omejevalnik bremenskega momenta: dovoljeno breme ni podano s silo, ampak z momentom glede na točko prevrnitve, zato je pri bolj iztegnjeni roki manjše. Momentni ključ za vijake jeklenih spojev zagotovi predpisani moment privijanja v $\mathrm{N\,m}$, iz katerega izhaja sila prednapetja vijaka. Projektant obtežbe po standardih za vplive na konstrukcije (lastna teža, sneg, veter) najprej zapiše kot porazdeljene obtežbe in jih za ravnotežne račune nadomesti z rezultantami.

## Preveri se

? Na isti točki konzole delujejo štiri enako velike sile v različnih smereh. Katera vrstica tabele ima glede na vpetje $O$ največji moment? Prijemališče je $1{,}0\,\mathrm{m}$ desno od $O$ na isti višini.

| sila | smer |
|---|---|
| a | navpično navzdol |
| b | $45^\circ$ navzdol |
| c | vodoravno proti $O$ |

- b, ker poševna sila deluje »v dveh smereh hkrati«.
~ Poševno silo lahko razstaviš, a le navpična komponenta ima ročico; ta je manjša od cele sile, zato je moment manjši.
+ a
- c, ker sila potiska naravnost proti vpetju.
~ Nosilka vodoravne sile gre skozi $O$, zato je ročica nič in moment nič.
> Moment je $F\,d$. Pri a je ročica cel $1{,}0\,\mathrm{m}$, pri b le $1{,}0 \cdot \sin 45^\circ \approx 0{,}71\,\mathrm{m}$, pri c je nosilka skozi $O$ in moment nič.

? Približno oceni: moški drži $10\,\mathrm{kg}$ v roki z vodoravno podlahtjo ($0{,}35\,\mathrm{m}$ od komolca), biceps je pripet $4\,\mathrm{cm}$ od komolca. Kolikšna je približno sila bicepsa (težo podlahti zanemari)?
- okoli $100\,\mathrm{N}$
~ To je samo teža bremena. Pri togem telesu se izenačijo momenti, ne sile, in ročica mišice je mnogo krajša.
- okoli $34\,\mathrm{N}$
~ To je moment teže v $\mathrm{N\,m}$, ne sila. Moment moraš deliti še z ročico mišice, $0{,}04\,\mathrm{m}$.
+ okoli $900\,\mathrm{N}$
> Moment teže je približno $98\,\mathrm{N}\cdot 0{,}35\,\mathrm{m} \approx 34\,\mathrm{N\,m}$; deljeno z ročico $0{,}04\,\mathrm{m}$ da približno $860\,\mathrm{N}$, torej reda velikosti $900\,\mathrm{N}$.

? Zakaj je moment dvojice glede na vse točke enak, moment ene same sile pa ne?
- Ker sta sili dvojice vzporedni, vzporedne sile pa nimajo momenta.
~ Vsaka sila dvojice ima svoj moment, ki je odvisen od točke. Neodvisna od točke je šele vsota.
+ Ker se pri vsoti $\vec{r}_A\times\vec{F} - \vec{r}_B\times\vec{F}$ položaj točke odšteje in ostane le $\overrightarrow{BA}\times\vec{F}$.
- Ker je rezultanta dvojice nič, zato je tudi moment nič glede na vse točke.
~ Rezultanta je res nič, moment pa ni: znaša $F\,d$. Prav zato dvojica telo vrti, ne pa premika.
> Če točko premaknemo, se momenta obeh sil spremenita za nasprotno enaka zneska, ker sta sili nasprotno enaki. Ostane $\overrightarrow{BA}\times\vec{F}$ z velikostjo $F\,d$.

? Momentni ključ je nastavljen na $60\,\mathrm{N\,m}$. Na kolikšni razdalji od osi vijaka moraš pravokotno pritisniti s silo $150\,\mathrm{N}$, da ključ »klikne«?
- $9{,}0\,\mathrm{m}$
~ Silo in moment si pomnožil. Ročica je kvocient momenta in sile.
+ $0{,}40\,\mathrm{m}$
- $2{,}5\,\mathrm{m}$
~ Silo si delil z momentom ($150/60$). Iz $M = F\,d$ je $d = M/F$.
> Iz $M = F\,d$ je $d = 60\,\mathrm{N\,m}/150\,\mathrm{N} = 0{,}40\,\mathrm{m}$.

? Na streho skladišča piha veter, ki ga projektant opiše kot enakomerno obtežbo $1{,}5\,\mathrm{kN/m}$ vzdolž $8{,}0\,\mathrm{m}$ dolgega strešnega nosilca. Kako ga nadomesti z eno silo za račun ravnotežja?
- $1{,}5\,\mathrm{kN}$ na sredini nosilca
~ Obtežba v $\mathrm{kN/m}$ je sila na meter; rezultanto dobiš šele z množenjem z dolžino.
- $12\,\mathrm{kN}$ na koncu nosilca, kjer je največja nevarnost
~ Rezultanta enakomerne obtežbe ne leži na koncu, ampak v težišču diagrama, torej na sredini.
+ $12\,\mathrm{kN}$ na sredini nosilca, pravokotno na streho
> Rezultanta je ploščina diagrama, $1{,}5 \cdot 8{,}0 = 12\,\mathrm{kN}$, in prijemlje v težišču pravokotnika, na sredini dolžine. Smer je smer obtežbe.

:::simboli
\vec{F} | vektor sile | | N
F | velikost sile | | N
F_x, F_y | komponenti sile | F_x = F\cos\alpha | N
\alpha | kot sile glede na os $x$ | | °
\vec{F}_i | i-ta sila sistema | | N
\vec{F}_R | rezultanta | \vec{F}_R = \sum_i \vec{F}_i | N | neodvisna od izbire točke
F_R | velikost rezultante | F_R = \sqrt{F_{Rx}^2 + F_{Ry}^2} | N
F_{Rx}, F_{Ry} | komponenti rezultante | F_{Rx} = \sum_i F_{ix} | N
F_{ix}, F_{iy} | komponenti i-te sile | | N
F_i | velikost i-te sile | | N
\alpha_i | kot i-te sile glede na os $x$ | | °
\alpha_R | kot rezultante glede na os $x$ | | °
\vec{M}_O | moment sile glede na točko O | \vec{M}_O = \vec{r} \times \vec{F} | N\,m
M_O | moment glede na točko O (v ravnini s predznakom) | M_O = xF_y - yF_x | N\,m | pozitiven v nasprotni smeri urnega kazalca
\vec{r} | krajevni vektor prijemališča glede na O | | m
r | razdalja od O do prijemališča | | m
\varphi | kot med $\vec{r}$ in $\vec{F}$ | | °
d | ročica | d = r\sin\varphi | m | pravokotna razdalja do nosilke
x, y | koordinati prijemališča sile | | m
x_i, y_i | koordinati prijemališča i-te sile | | m
M_e | moment glede na os | M_e = \vec{e}\cdot(\vec{r}\times\vec{F}) | N\,m
\vec{e} | enotski vektor osi | | –
\vec{M} | moment dvojice | \vec{M} = \vec{r}_{BA}\times\vec{F} | N\,m | prosti vektor
M | moment dvojice (v ravnini s predznakom) | M = F\,d | N\,m
\vec{r}_{BA} | vektor od B do A | | m
\vec{M}_{RO} | rezultirajoči moment redukcije na O | | N\,m
M_{RO} | rezultirajoči moment glede na O | | N\,m
M_{RA} | rezultirajoči moment glede na A | | N\,m
\vec{M}_j, M_j | j-ta dvojica sistema | | N\,m
\vec{M}_{RP} | rezultirajoči moment glede na P | \vec{M}_{RP} = \vec{M}_{RO} + \overrightarrow{PO}\times\vec{F}_R | N\,m
d_R | ročica rezultante glede na O | d_R = \frac{M_{RO}}{F_R} | m | vzemi absolutno vrednost
q | porazdeljena obtežba | | kN/m
q_0 | največja ordinata trikotne obtežbe | | kN/m
F_q | rezultanta porazdeljene obtežbe | F_q = \int_a^b q(x)\,\mathrm{d}x | kN
x_q | lega rezultante obtežbe | | m | težišče ploščine diagrama
a, b | meji odseka z obtežbo | | m
l | dolžina (nosilca ali odseka) | | m
l_q | dolžina odseka z obtežbo | | m
x_R | presečišče nosilke rezultante z osjo nosilca | x_R = \frac{M_{RA}}{F_{Ry}} | m
F_b | sila bicepsa | | N
i | zaporedna številka sile | | –
j | zaporedna številka dvojice | | –
\beta | kot golenice glede na vodoravnico | | °
M_F | moment sile na zob | M_F = F\,d | N\,mm
M_D | moment dvojice žice | M_D = F_D\,d_D | N\,mm
F_D | sila dvojice | | N
d_D | ročica dvojice | | mm
:::
