---
stanje: osnutek
demo: ph
avtor: AI
---

## Zakaj se tega učimo

Leta 1909 je danski kemik Søren Sørensen delal v laboratoriju pivovarne Carlsberg v Københavnu. Preučeval je encime, snovi, ki v živih bitjih in pri varjenju piva pospešujejo reakcije. Opazil je, da encim dobro deluje le pri določeni kislosti raztopine.

Kislost je moral zapisovati natančno. Tedaj so jo izražali z drobnimi števili, kot je $0{,}0000001$, ki so nerodna za branje in primerjanje. Sørensen je zato uvedel kratko število: **pH**. Namesto dolgega decimalnega števila je zapisal kar $7$, ker enica v $0{,}0000001$ stoji na sedmem mestu za vejico.

Danes pH srečaš povsod. Na etiketi ustekleničene vode, ki jo kupiš na potovanju, je pogosto napisan pH. Kmetijski strokovnjaki rišejo zemljevide kislosti tal, da vedo, kje bo kakšna rastlina uspevala.

## Razlaga

**1. Mamljiva, a napačna predstava.** Ker pH zapišemo s številom, se zdi, da deluje kot ocena ali temperatura: »Večje število pomeni več kisline, pH $4$ je dvakrat bolj kisel od pH $2$.« Obe misli sta napačni. Popravimo ju po vrsti.

**2. Prvi popravek: smer lestvice.** pH je število, ki pove, kako kisla ali bazična je vodna raztopina. Navadno ima vrednosti od $0$ do $14$:

- $\mathrm{pH} < 7$: raztopina je **kisla**,
- $\mathrm{pH} = 7$: raztopina je **nevtralna** (npr. čista voda),
- $\mathrm{pH} > 7$: raztopina je **bazična** (alkalna).

Manjši ko je pH, bolj je raztopina kisla. Večji ko je pH, bolj je bazična.

:::premisli
Sošolec pravi: »$0$ točk pomeni nič točk, torej raztopina s $\mathrm{pH} = 0$ ne vsebuje nič kisline.« Ima prav? Zakaj?
---
Ravno nasprotno: $\mathrm{pH} = 0$ je zelo kisla raztopina. Število $0$ ne pomeni »nič«, ampak skrajni levi konec lestvice, kjer je kislost največja.
:::

**3. Drugi popravek: vsak korak je desetkrat.** Kislost je odvisna od tega, koliko **oksonijevih ionov** $\mathrm{H_3O^+}$ je v enaki prostornini raztopine. To so ioni, ki v vodi nastanejo iz kislin (poenostavljeno jih zapišemo tudi kot vodikove ione $\mathrm{H^+}$). Več jih je, nižji je pH.

Lestvica je **logaritemska**: ko se pH zmanjša za $1$, je oksonijevih ionov desetkrat več. Podobno je z bankovci za $1$ €, $10$ € in $100$ €: vsak naslednji je vreden desetkrat več, ne le za eno enoto več.

| pH | Vrsta | Oksonijevih ionov v primerjavi s pH 7 |
|---|---|---|
| $7$ | nevtralno | $1$-krat |
| $6$ | rahlo kislo | $10$-krat več |
| $5$ | kislo | $100$-krat več |
| $4$ | kislo | $1000$-krat več |
| $3$ | močno kislo | $10\,000$-krat več |

Raztopina s $\mathrm{pH} = 3$ je torej desetkrat bolj kisla kot raztopina s $\mathrm{pH} = 4$ in stokrat bolj kisla kot raztopina s $\mathrm{pH} = 5$. Na bazični strani velja enako v nasprotno smer: vsak korak navzgor pomeni desetkrat manj oksonijevih ionov.

V simulaciji spodaj (»pH lestvica«) nastavi drsnik na $3$, nato na $5$. Opazuj zapis $[\mathrm{H_3O^+}]$ v izpisu pod gumbi: eksponent se spremeni z $-3$ na $-5$. Ker je $10^{-3} = 0{,}001$ in $10^{-5} = 0{,}00001$, to pomeni stokrat manj ionov.

**4. Kako merimo pH.**

- **Univerzalni indikatorski papirček**: pomočimo ga v raztopino, se obarva, barvo primerjamo z barvno skalo na embalaži. Rdeča in oranžna pomenita kislo, zelena nevtralno, modra in vijolična bazično. Dobimo približno vrednost, na celo enoto natančno ali slabše.
- **Sok rdečega zelja**: domač indikator. V kislem je rdeč do roza, v nevtralnem vijoličen, v bazičnem moder, zelen in pri zelo bazičnem rumen.
- **pH-meter**: elektronska naprava z elektrodo, ki pH izmeri in prikaže številčno, na desetinko ali bolj natančno. Pred meritvijo ga umerimo z raztopinami z znanim pH.
- **Posamezni indikatorji** (npr. lakmus, fenolftalein) ne pokažejo vrednosti pH, ampak le območje. Lakmus je v kisli raztopini rdeč, v bazični moder. Fenolftalein je v kisli in nevtralni raztopini brezbarven, v bazični pa rožnato vijoličen.

**5. Primeri iz vsakdana (približne vrednosti).**

| Snov | Približni pH |
|---|---|
| želodčni sok | okoli $1{,}5$–$3$ |
| limonin sok | okoli $2$ |
| kis | okoli $3$ |
| kava | okoli $5$ |
| čista voda | $7$ |
| kri | okoli $7{,}4$ |
| milo | okoli $9$–$10$ |
| belilo (varikina) | okoli $12$–$13$ |

Vrednosti so orientacijske, saj se razlikujejo glede na izdelek in koncentracijo.

**6. Pomen pH.** Veliko procesov deluje le v ozkem območju pH, tako kot Sørensenovi encimi. Kri ima pH med približno $7{,}35$ in $7{,}45$; že majhen odmik je nevaren. Koža je rahlo kisla, zato so izdelki za nego pogosto prilagojeni temu. V bazenu vzdržujejo pH malo nad $7$, da voda ne draži oči. Ribe v preveč kisli vodi ne preživijo.

Tudi tla imajo svoj pH. Na zemljevidu kislosti tal so tla na apnencu, ki ga je v Sloveniji veliko, pogosto nevtralna do rahlo bazična. Na drugih kamninah in na šotnih tleh so pogosto kisla. Borovnice uspevajo v kislih tleh, okoli $\mathrm{pH} = 5$.

:::premisli
Limonin sok s $\mathrm{pH} = 2$ močno razredčiš z vodo. Napovej: ali se pH zviša ali zniža? Ali lahko z dodajanjem vode preseže $7$?
---
pH se zviša, ker je oksonijevih ionov v enaki prostornini manj. Približuje se $7$, a $7$ ne preseže: z dodajanjem vode iz kisle raztopine ne nastane bazična.
:::

**7. Previdnost.** Zelo kisle (pH blizu $0$) in zelo bazične (pH blizu $14$) raztopine so jedke. Z njimi delamo le z zaščitnimi očali in rokavicami.

## Rešeni primeri

### Primer 1 (lažji): vzorci z izleta

Na šolskem izletu izmeriš pH treh vzorcev: voda iz izvira ima $\mathrm{pH} = 7{,}8$, mineralna voda z mehurčki $\mathrm{pH} = 5{,}5$, pomarančni sok pa $\mathrm{pH} = 3{,}5$. Razvrsti jih od najbolj kislega do najbolj bazičnega in za vsakega povej, ali je kisel, nevtralen ali bazičen.

**Podatki:** izvir $\mathrm{pH} = 7{,}8$, mineralna voda $\mathrm{pH} = 5{,}5$, pomarančni sok $\mathrm{pH} = 3{,}5$
**Iščemo:** vrstni red po kislosti in vrsto vsakega vzorca

:::formula
$\mathrm{pH} < 7$: kislo; $\mathrm{pH} = 7$: nevtralno; $\mathrm{pH} > 7$: bazično. Manjši pH pomeni bolj kislo.
:::

**Rešitev:**

1. Vrednosti uredimo od najmanjše do največje, ker manjši pH pomeni bolj kislo: $3{,}5 < 5{,}5 < 7{,}8$.
2. Pomarančni sok: $3{,}5 < 7$, zato je **kisel**.
3. Mineralna voda: $5{,}5 < 7$, zato je **rahlo kisla**. Kisla je zaradi raztopljenega ogljikovega dioksida, ki daje mehurčke.
4. Voda iz izvira: $7{,}8 > 7$, zato je **rahlo bazična**.
5. Odgovor: od najbolj kislega do najbolj bazičnega so pomarančni sok, mineralna voda in voda iz izvira.

### Primer 2: dve njivi na zemljevidu tal

Na zemljevidu kislosti tal sta označeni dve njivi. Prva ima $\mathrm{pH} = 5$, druga $\mathrm{pH} = 7$. Na kateri so tla bolj kisla in kolikokrat več oksonijevih ionov je v njeni talni raztopini?

**Podatki:** $\mathrm{pH_1} = 5$, $\mathrm{pH_2} = 7$
**Iščemo:** katera tla so bolj kisla in kolikokrat več oksonijevih ionov imajo

:::formula
Nižji pH pomeni bolj kislo. Vsaka enota pH pomeni $10$-krat več oksonijevih ionov.
:::

**Rešitev:**

1. Nižji pH ima prva njiva, zato so tam tla bolj kisla.
2. Razlika pH je $7 - 5 = 2$ enoti.
3. Vsaka enota pomeni faktor $10$, zato je razlika $10 \cdot 10 = 100$.
4. Opozorilo: ne »dvakrat«, čeprav je razlika le $2$. Lestvica je logaritemska.
5. Odgovor: tla na prvi njivi so bolj kisla; oksonijevih ionov je v njih stokrat več kot na drugi.

### Primer 3 (težji): jezero po kislem dežju

Jezero ima $\mathrm{pH} = 6$. Po obdobju kislega dežja je v njegovi vodi desetkrat več oksonijevih ionov. Kolikšen je nov pH? Kolikšen bi bil, če bi bilo ionov stokrat več kot na začetku?

**Podatki:** začetni $\mathrm{pH} = 6$; oksonijevih ionov $10$-krat več; druga možnost $100$-krat več
**Iščemo:** nov pH v obeh primerih

:::formula
$10$-krat več oksonijevih ionov $\rightarrow$ pH se zniža za $1$. $100$-krat več $\rightarrow$ pH se zniža za $2$.
:::

**Rešitev:**

1. Več oksonijevih ionov pomeni bolj kislo, zato se pH zniža.
2. Desetkrat več ionov je en korak lestvice: $6 - 1 = 5$. Jezero ima zdaj $\mathrm{pH} = 5$, kar mnogim vrstam rib že škodi.
3. Stokrat več ionov: koliko korakov je to in kolikšen je pH? Izračunaj sam, nato preveri.

:::premisli
Kolikšen je pH jezera, če je oksonijevih ionov stokrat več kot pri $\mathrm{pH} = 6$?
---
$100 = 10 \cdot 10$, to sta dva koraka. Nov pH je $6 - 2 = 4$.
:::

## Pogoste napake

- **Večje število, več kisline.** Napačno sklepanje: »pH $10$ je večji od pH $3$, torej bolj kisel.« Lestvica teče obratno. Popravek: manjši pH pomeni bolj kislo, večji pH bolj bazično.
- **Linearno razmišljanje.** Napačno: »pH $2$ in pH $4$ se razlikujeta za $2$, torej je razlika dvakratna.« Vsaka enota pomeni faktor $10$. Popravek: dve enoti sta $10 \cdot 10 = 100$-krat.
- **pH 0 pomeni »nič kisline«.** Ničla na lestvici ni prazna posoda, ampak skrajno kislo. Nevtralna je vrednost $7$.
- **Z dovolj vode kislina postane bazična.** Razredčenje pH le približa $7$. Popravek: iz kisle raztopine bazično dobiš šele z dodatkom baze.
- **Papirček je natančen kot pH-meter.** Barvo primerjaš s skalo, zato dobiš le približno vrednost. Za desetinke potrebuješ pH-meter.

## Povzetek

- pH pove, kako kisla ali bazična je vodna raztopina; navadno ima vrednosti od $0$ do $14$. Uvedel ga je Søren Sørensen leta 1909.
- $\mathrm{pH} < 7$ kislo, $\mathrm{pH} = 7$ nevtralno, $\mathrm{pH} > 7$ bazično. Nižji pH pomeni bolj kislo.
- Sprememba pH za $1$ pomeni desetkratno spremembo števila oksonijevih ionov $\mathrm{H_3O^+}$ v enaki prostornini; za $2$ stokratno.
- pH merimo z univerzalnim indikatorskim papirčkom ali sokom rdečega zelja (približno) ali s pH-metrom (natančneje).
- Razredčenje z vodo pH le približa $7$.
- Pomen: kri okoli $7{,}4$, rahlo kisla koža, bazeni, ribe v jezerih, rastline v tleh. Zelo kisle in zelo bazične raztopine so jedke.

## Drugače: Kot zgodba

V tridesetih letih 20. stoletja so pridelovalci limon v Kaliforniji morali hitro preverjati kislost limoninega soka. Barvni indikatorji jim niso zadoščali, ker je bilo v soku težko zanesljivo prebrati barvo. Kemik Arnold Beckman jim je zato izdelal elektronsko napravo, ki je kislost pokazala s kazalcem na skali.

Iz te naprave se je razvil današnji pH-meter. Zgodba pokaže dve poti merjenja, ki ju uporabljaš tudi ti. Barva indikatorja je hitra in poceni, a približna. Elektronska meritev da natančno število, a jo moraš prej umeriti.

Sørensen je torej dal kislosti število, Beckman pa napravo, ki to število izmeri.

## Drugače: Korak za korakom s številkami

Naloga: določi, kakšna je raztopina, in primerjaj dve raztopini.

| Raztopina | pH | Primerjava s $7$ | Vrsta |
|---|---|---|---|
| X | $1$ | $1 < 7$ | zelo kisla |
| Y | $6$ | $6 < 7$ | rahlo kisla |
| Z | $7$ | $7 = 7$ | nevtralna |
| W | $13$ | $13 > 7$ | zelo bazična |

Primerjava X in Y:

1. Razlika: $6 - 1 = 5$ enot pH.
2. Vsaka enota pomeni faktor $10$, torej $10 \cdot 10 \cdot 10 \cdot 10 \cdot 10 = 100\,000$.
3. Raztopina X ima $100\,000$-krat več oksonijevih ionov kot Y.

Ta primerjava pokaže, zakaj je raztopina s $\mathrm{pH} = 1$ toliko nevarnejša od raztopine s $\mathrm{pH} = 6$, čeprav se števili zdita blizu.

## Drugače: Bolj natančno

pH je definiran z množinsko koncentracijo oksonijevih ionov:

$$\mathrm{pH} = -\log\, c(\mathrm{H_3O^+})$$

kjer je $c(\mathrm{H_3O^+})$ izražena v $\mathrm{mol/L}$. Za čisto vodo pri $25\,^\circ\mathrm{C}$ je $c(\mathrm{H_3O^+}) = 10^{-7}\,\mathrm{mol/L}$, zato je $\mathrm{pH} = 7$.

Če je $c(\mathrm{H_3O^+}) = 10^{-3}\,\mathrm{mol/L}$, je $\mathrm{pH} = 3$. Če pa je $c(\mathrm{H_3O^+}) = 10^{-5}\,\mathrm{mol/L}$, je $\mathrm{pH} = 5$. Razmerje koncentracij je $\dfrac{10^{-3}}{10^{-5}} = 100$, kar potrdi stokratno razliko.

Opomba: v 8. razredu logaritma formalno ne računamo; pomembna je ideja, da en korak na lestvici pomeni desetkratno spremembo koncentracije. Vrednost $\mathrm{pH} = 7$ za nevtralno raztopino velja pri $25\,^\circ\mathrm{C}$.

## Preveri se

? Katera vrednost ne sodi k ostalim trem?
- $\mathrm{pH} = 2$
~ $2$ je res najbolj kisla vrednost, a je še vedno kisla, tako kot $4{,}5$ in $6$.
- $\mathrm{pH} = 6$
~ $6$ je blizu $7$, a je še pod $7$, torej kisla kot ostali dve.
+ $\mathrm{pH} = 8$
- $\mathrm{pH} = 4{,}5$
~ Necela vrednost je čisto običajna. $4{,}5 < 7$, torej je kisla.
> Vrednosti $2$, $4{,}5$ in $6$ so pod $7$, torej kisle. Le $8$ je nad $7$, zato je bazična.

? Raztopina A ima $\mathrm{pH} = 2$, raztopina B pa $\mathrm{pH} = 5$. Kolikokrat več oksonijevih ionov je v A kot v enaki prostornini B?
- $3$-krat
~ To je razlika števil. Vsaka enota pH je faktor $10$, ne $1$.
- $30$-krat
~ Tu je faktor $10$ pomnožen s $3$. Trije koraki so $10 \cdot 10 \cdot 10$.
+ $1000$-krat
> Razlika je $5 - 2 = 3$ enote, zato $10 \cdot 10 \cdot 10 = 1000$-krat več oksonijevih ionov v A.

? Kis s $\mathrm{pH} = 3$ močno razredčimo z vodo. Kaj se zgodi s pH?
- Zniža se, ker smo dodali tekočino.
~ Z vodo je oksonijevih ionov v enaki prostornini manj, zato je raztopina manj kisla in pH višji.
+ Zviša se proti $7$, a ostane pod $7$.
- Zviša se nad $7$, raztopina postane bazična.
~ Voda je nevtralna. Brez dodane baze pH ne preseže $7$.
> Razredčena kislina je manj kisla, zato pH raste. Približuje se pH vode, $7$, a ga ne preseže.

? Učenec primerja raztopini s $\mathrm{pH} = 4$ in $\mathrm{pH} = 6$. (1) Razlika je $6 - 4 = 2$. (2) Večji pH pomeni bolj kislo, zato je bolj kisla raztopina s pH $6$. (3) Dve enoti pomenita $10 \cdot 10 = 100$-krat. Kateri korak je napačen?
- korak (1)
~ Razlika je pravilno izračunana: $6 - 4 = 2$.
+ korak (2)
- korak (3)
~ Dve enoti sta res faktor $100$. Napaka je v smeri lestvice.
- noben
~ Eden od korakov obrne smer lestvice.
> Manjši pH pomeni bolj kislo, zato je stokrat bolj kisla raztopina s $\mathrm{pH} = 4$.

? Na potovanju kupiš ustekleničeno vodo. Na etiketi piše $\mathrm{pH} = 7{,}8$. Kaj to pomeni?
- Voda je močno bazična in jedka.
~ Jedke so raztopine blizu $14$. $7{,}8$ je le malo nad nevtralno vrednostjo.
- Voda je kisla, ker je pH pod $14$.
~ Meja med kislim in bazičnim je $7$, ne $14$.
+ Voda je rahlo bazična in primerna za pitje.
> $7{,}8 > 7$, zato je voda rahlo bazična. Tako vrednost ima veliko izvirske vode; pitna voda ima običajno pH med približno $6{,}5$ in $9{,}5$.

:::simboli
\mathrm{pH} | pH vrednost (merilo kislosti raztopine) | \mathrm{pH} = -\log\, c(\mathrm{H_3O^+}) | – | pod 7 kislo, 7 nevtralno, nad 7 bazično
c | množinska koncentracija oksonijevih ionov | | mol/L | $c(\mathrm{H_3O^+})$; v čisti vodi $10^{-7}$ mol/L
:::
