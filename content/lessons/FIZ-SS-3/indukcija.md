---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nekdo, ki slabo sliši, ima lahko polžev vsadek. Za ušesom nosi majhno okroglo tuljavo, druga tuljava je pod kožo. Med njima ni žice, pa vendar notranji del dobi energijo in signal skozi kožo.

Električna zobna ščetka se polni na podstavku. Na ročaju ni nobenega kovinskega stika, zato jo lahko pereš pod vodo.

Na videz sta to dve različni napravi. V obeh pa se dogaja isto: tok v eni tuljavi se ves čas spreminja, zato se v drugi tuljavi pojavi napetost. Temu pojavu rečemo **elektromagnetna indukcija**. Na njej delujejo generatorji v elektrarnah, transformatorji v polnilnikih in tudi magnetna stimulacija možganov v bolnišnici.

## Razlaga

**1. Mamljiva ideja.** Iz prejšnjih lekcij veš, da tok ustvari magnetno polje. Zdi se logično, da velja tudi obratno: močan magnet v tuljavi bi moral pognati tok. Večina učencev napove, da bo tok tem večji, čim močnejši je magnet.

Preverimo. Tuljavo povežemo z občutljivim merilnikom toka, ki ima ničlo na sredini. Kazalec se odkloni levo ali desno, odvisno od smeri toka.

| Kaj naredimo z magnetom | Kazalec |
|---|---|
| miruje v tuljavi | ostane na $0$ |
| hitro ga potisnemo noter | močno desno |
| počasi ga potisnemo noter | malo desno |
| hitro ga izvlečemo | močno levo |

Mirujoč magnet ne požene toka, pa naj bo še tako močan. Tok steče le, ko se magnet giblje. Smer toka je odvisna od tega, ali magnet vstopa ali izstopa.

:::premisli
Magnet in tuljavo držiš skupaj in ju z enako hitrostjo neseš po sobi. Kaj kaže merilnik?
---
Nič. Magnet se glede na tuljavo ne premika, zato se polje v tuljavi ne spreminja. Šteje le sprememba polja skozi tuljavo, ne gibanje samo.
:::

**2. Kaj se res spreminja.** Ko se magnet bliža, skozi ovoje tuljave poteka vse več silnic. Količino polja, ki prebada eno zanko, opišemo z **magnetnim pretokom** $\Phi$. Če je polje pravokotno na ploskev zanke s ploščino $S$, je

$$\Phi = B S$$

Enota je $\mathrm{T\,m^2} = \mathrm{V\,s}$, imenujemo jo **weber** ($\mathrm{Wb}$). Pretok si predstavljaj kot število silnic, ki gredo skozi zanko.

**3. Inducirana napetost.** Napetost, ki se pojavi v tuljavi zaradi spremembe pretoka, je **inducirana napetost** $U_i$. Odvisna je od tega, kako hitro se pretok spreminja, in od števila ovojev $N$:

$$U_i = N \frac{\Delta \Phi}{\Delta t}$$

To je **indukcijski zakon**. Velik pretok sam ne pomeni ničesar. Šteje sprememba pretoka $\Delta \Phi$ v času $\Delta t$. Vsak ovoj prispeva enako napetost, zato se pri $N$ ovojih napetost poveča $N$-krat.

Od kod napetost? V žici so prosti elektroni. Če se žica giblje skozi polje, nanje deluje magnetna sila, ki jih potiska vzdolž žice. Tako se na koncih žice nabere naboj in nastane napetost. Če se giblje magnet in žica miruje, elektrone poganja električno polje, ki ga ustvari spreminjajoče se magnetno polje. Učinek je enak.

V simulaciji spodaj, »Elektromagnetna indukcija«, potiskaj magnet v tuljavo najprej počasi, nato hitro. Opazuj, kako visok je vrh na grafu $U(t)$ in kakšen predznak ima napetost pri izvleku.

**4. Lenzovo pravilo.** Druga pogosta zmota je, da inducirani tok vedno nasprotuje magnetu. V resnici nasprotuje **spremembi**.

Inducirani tok ustvari svoje magnetno polje. To polje je vedno usmerjeno tako, da zmanjšuje spremembo pretoka, ki ga je povzročila. To je **Lenzovo pravilo**.

Ko severni pol magneta potiskaš v tuljavo, pretok raste. Konec tuljave, obrnjen proti magnetu, postane severni pol in magnet odbija. Ko magnet vlečeš ven, pretok pada. Tisti konec tuljave postane južni pol in magnet privlači. V obeh primerih moraš delati proti sili.

:::premisli
Zakaj ne more biti obratno? Kaj bi se zgodilo, če bi tuljava magnet, ki ga potiskaš noter, privlačila?
---
Magnet bi se sam pospeševal v tuljavo, tok bi bil vse večji in privlak še močnejši. Dobili bi električno energijo in kinetično energijo iz nič. Lenzovo pravilo je posledica ohranitve energije: električna energija induciranega toka pride iz dela, ki ga opraviš ti.
:::

**5. Transformator.** Dve tuljavi navijemo na skupno železno jedro. Na prvo, **primarno** tuljavo z $N_1$ ovoji, priključimo izmenično napetost $U_1$. Taka je napetost v vtičnici: ves čas se spreminja in menja smer. Izmenični tok v njej ustvarja v jedru pretok, ki se ves čas spreminja. Železo vodi ta pretok tudi skozi drugo, **sekundarno** tuljavo z $N_2$ ovoji.

:::risba skica
opis: Transformator. Siv pravokoten železni okvir z luknjo na sredini. Na levi stranici je primarna tuljava s šestimi ovoji, na desni sekundarna tuljava s tremi ovoji.
območje: 0; 0 .. 10; 6
enota: 30
pravokotnik: 1; 1 .. 9; 5 | siva | debelo
pravokotnik: 3; 2 .. 7; 4 | siva | debelo
črta: 0,5; 1,5 -> 3,5; 1,5 | modra | debelo
črta: 0,5; 2 -> 3,5; 2 | modra | debelo
črta: 0,5; 2,5 -> 3,5; 2,5 | modra | debelo
črta: 0,5; 3 -> 3,5; 3 | modra | debelo
črta: 0,5; 3,5 -> 3,5; 3,5 | modra | debelo
črta: 0,5; 4 -> 3,5; 4 | modra | debelo
črta: 6,5; 2 -> 9,5; 2 | oranžna | debelo
črta: 6,5; 3 -> 9,5; 3 | oranžna | debelo
črta: 6,5; 4 -> 9,5; 4 | oranžna | debelo
napis: 2; 5,5 | primarna, N_1 | sredina
napis: 8; 5,5 | sekundarna, N_2 | sredina
napis: 5; 0,5 | železno jedro | sredina
:::

Skozi vsak ovoj obeh tuljav gre ista sprememba pretoka, zato ima vsak ovoj enako inducirano napetost. Napetosti sta v razmerju števil ovojev:

$$\frac{U_2}{U_1} = \frac{N_2}{N_1}$$

Več ovojev na sekundarni strani pomeni višjo napetost, manj ovojev nižjo. Energije transformator ne ustvari. Če ga štejemo za idealnega (brez izgub), je moč na obeh straneh enaka:

$$U_1 I_1 = U_2 I_2$$

Kjer je napetost višja, je tok manjši. Pri enosmerni napetosti transformator ne deluje, ker se pretok ne spreminja.

## Rešeni primeri

### Primer 1: magnet v tuljavi

Tuljava ima $500$ ovojev s ploščino preseka $4\,\mathrm{cm^2}$. Magnet potisnemo vanjo v $0{,}2\,\mathrm{s}$. Gostota polja v tuljavi pri tem naraste od $0$ do $0{,}6\,\mathrm{T}$. Kolikšna je povprečna inducirana napetost?

**Podatki:** $N = 500$, $S = 4\,\mathrm{cm^2}$, $\Delta B = 0{,}6\,\mathrm{T}$, $\Delta t = 0{,}2\,\mathrm{s}$
**Iščemo:** inducirano napetost $U_i$

:::formula
$\Delta \Phi = S\,\Delta B$, nato $U_i = N \dfrac{\Delta \Phi}{\Delta t}$
:::

**Rešitev:**

1. Ploščino pretvorimo v kvadratne metre, ker je tesla definirana z metri: $4\,\mathrm{cm^2} = 4\cdot10^{-4}\,\mathrm{m^2}$.
2. Sprememba pretoka skozi en ovoj: $\Delta \Phi = 4\cdot10^{-4}\,\mathrm{m^2} \cdot 0{,}6\,\mathrm{T} = 2{,}4\cdot10^{-4}\,\mathrm{V\,s}$.
3. Napetost: $U_i = 500 \cdot \dfrac{2{,}4\cdot10^{-4}\,\mathrm{V\,s}}{0{,}2\,\mathrm{s}} = 0{,}6\,\mathrm{V}$.
4. Odgovor: v tuljavi se inducira povprečna napetost $0{,}6\,\mathrm{V}$.

### Primer 2: magnetna stimulacija možganov

Pri transkranialni magnetni stimulaciji zdravnik položi tuljavo na glavo bolnika. Kratek sunek toka v tuljavi v $0{,}1\,\mathrm{ms}$ poveča gostoto polja v možganih od $0$ do $1\,\mathrm{T}$. Predstavljaj si krožno zanko možganskega tkiva s polmerom $2\,\mathrm{cm}$, pravokotno na polje. Kolikšna napetost se inducira v zanki? Kako teče inducirani tok glede na tok v tuljavi?

**Podatki:** $\Delta B = 1\,\mathrm{T}$, $\Delta t = 0{,}1\,\mathrm{ms}$, $r = 2\,\mathrm{cm}$, $N = 1$
**Iščemo:** inducirano napetost $U_i$ in smer induciranega toka

:::formula
$S = \pi r^2$, $\Delta \Phi = S\,\Delta B$, $U_i = N \dfrac{\Delta \Phi}{\Delta t}$; smer po Lenzovem pravilu
:::

**Rešitev:**

1. Ploščina zanke: $S = \pi \cdot (0{,}02\,\mathrm{m})^2 = 1{,}26\cdot10^{-3}\,\mathrm{m^2}$.
2. Sprememba pretoka: $\Delta \Phi = 1{,}26\cdot10^{-3}\,\mathrm{m^2} \cdot 1\,\mathrm{T} = 1{,}26\cdot10^{-3}\,\mathrm{V\,s}$.
3. Čas v sekundah: $0{,}1\,\mathrm{ms} = 10^{-4}\,\mathrm{s}$. Zelo kratek čas je razlog za veliko napetost.
4. Napetost: $U_i = \dfrac{1{,}26\cdot10^{-3}\,\mathrm{V\,s}}{10^{-4}\,\mathrm{s}} = 12{,}6\,\mathrm{V}$.
5. Smer: pretok narašča, zato polje induciranega toka kaže nasprotno od polja tuljave. Tok v tkivu teče v nasprotno smer kot tok v tuljavi.
6. Odgovor: v zanki se inducira okoli $12{,}6\,\mathrm{V}$, tok v tkivu teče nasprotno toku v tuljavi. Tak tok lahko vzburi živčne celice, zato se bolniku na primer trzne prst.

### Primer 3: transformator za rentgen pri zobozdravniku

Rentgenska cev pri zobozdravniku potrebuje napetost $69\,\mathrm{kV}$ in tok $7\,\mathrm{mA}$. Visoko napetost dobi iz transformatorja, ki je priključen na omrežje z napetostjo $230\,\mathrm{V}$. Primarna tuljava ima $200$ ovojev. Koliko ovojev mora imeti sekundarna tuljava? Kolikšen tok teče skozi primarno tuljavo, če transformator nima izgub?

**Podatki:** $U_1 = 230\,\mathrm{V}$, $N_1 = 200$, $U_2 = 69\,\mathrm{kV}$, $I_2 = 7\,\mathrm{mA}$
**Iščemo:** število ovojev $N_2$ in tok $I_1$

:::formula
$N_2 = N_1 \dfrac{U_2}{U_1}$, nato $P = U_2 I_2$ in $I_1 = \dfrac{P}{U_1}$
:::

**Rešitev:**

1. Pretvorimo enote: $U_2 = 69\,000\,\mathrm{V}$, $I_2 = 0{,}007\,\mathrm{A}$.
2. Napetost mora narasti $300$-krat, zato mora biti toliko več tudi ovojev: $N_2 = 200 \cdot \dfrac{69\,000\,\mathrm{V}}{230\,\mathrm{V}} = 60\,000$.
3. Moč na sekundarni strani: $P = 69\,000\,\mathrm{V} \cdot 0{,}007\,\mathrm{A} = 483\,\mathrm{W}$.
4. Pri idealnem transformatorju je moč na primarni strani enaka. Izračunaj sam tok $I_1$, nato preveri:

:::premisli
Kolikšen je tok $I_1$ v primarni tuljavi? Je večji ali manjši od $I_2$?
---
$I_1 = \dfrac{483\,\mathrm{W}}{230\,\mathrm{V}} = 2{,}1\,\mathrm{A}$. Je $300$-krat večji od $I_2$: napetost na primarni strani je $300$-krat nižja, moč pa enaka.
:::

## Pogoste napake

- **»Močan magnet požene tok.«** Mirujoč magnet v tuljavi ne inducira ničesar, tudi če je zelo močan. Napetost je sorazmerna s hitrostjo spremembe pretoka $\dfrac{\Delta \Phi}{\Delta t}$, ne s pretokom $\Phi$.
- **»Daljši čas, več napetosti.«** Če magnet potiskaš počasi, je sprememba enaka, a porazdeljena na daljši čas. Napetost je manjša, saj je $\Delta t$ v imenovalcu.
- **»Inducirani tok vedno nasprotuje magnetu.«** Nasprotuje spremembi pretoka. Ko magnet vlečeš ven, ga tuljava privlači, ker poskuša pretok ohraniti.
- **»Transformator dela tudi na baterijo.«** Enosmerni tok ustvari stalen pretok, zato se v sekundarni tuljavi napetost pojavi le ob vklopu in izklopu. Transformator potrebuje izmenično napetost.
- **»Transformator poveča moč.«** Višja napetost na sekundarni strani pomeni manjši tok. Pri idealnem transformatorju velja $U_1 I_1 = U_2 I_2$, energije ne pridobimo.

## Povzetek

- Magnetni pretok skozi zanko: $\Phi = B S$ (polje pravokotno na ploskev); enota $\mathrm{Wb} = \mathrm{V\,s}$.
- Indukcijski zakon: $U_i = N \dfrac{\Delta \Phi}{\Delta t}$. Napetost nastane le, ko se pretok spreminja; hitrejša sprememba in več ovojev pomenita večjo napetost.
- Lenzovo pravilo: polje induciranega toka nasprotuje spremembi pretoka, ki ga je povzročila. Je posledica ohranitve energije.
- Transformator: $\dfrac{U_2}{U_1} = \dfrac{N_2}{N_1}$; idealni ima $U_1 I_1 = U_2 I_2$. Deluje le z izmenično napetostjo.
- Primeri iz medicine: polžev vsadek in polnjenje vsadkov skozi kožo, magnetna stimulacija možganov, transformator rentgenskega aparata.

## Drugače: Kot zgodba

Michael Faraday je vedel, da tok ustvari magnetno polje. Leta 1831 je hotel pokazati še obratno: da magnetno polje ustvari tok.

Na železen obroč je navil dve ločeni tuljavi. Prvo je povezal z baterijo, drugo z merilnikom toka. Pričakoval je, da bo v drugi tuljavi tekel stalen tok, dokler bo prva priključena na baterijo.

Kazalec pa je obmiroval. Samo v trenutku, ko je baterijo priklopil, je kratko trznil. Ko jo je odklopil, je trznil še enkrat, a v nasprotno smer.

Faraday je razumel, kaj vidi. Tok ne nastane zaradi polja, ampak zaradi **spremembe** polja. Ob vklopu je pretok narasel, ob izklopu padel, vmes je bil stalen.

Njegov obroč z dvema tuljavama je bil pravzaprav prvi transformator. Če bi namesto baterije priključil izmenično napetost, bi se pretok spreminjal ves čas in kazalec bi nihal sem in tja brez prestanka.

## Drugače: Korak za korakom s številkami

Merilna tuljava ima $N = 100$ ovojev s ploščino $S = 0{,}01\,\mathrm{m^2}$. Polje skozi njo se spreminja v treh časovnih intervalih po $0{,}1\,\mathrm{s}$.

| Interval | $\Delta B$ | $\Delta \Phi$ | $U_i$ |
|---|---|---|---|
| 1. polje raste | $+0{,}2\,\mathrm{T}$ | $+0{,}002\,\mathrm{V\,s}$ | $2\,\mathrm{V}$ |
| 2. polje stalno | $0$ | $0$ | $0$ |
| 3. polje pada | $-0{,}2\,\mathrm{T}$ | $-0{,}002\,\mathrm{V\,s}$ | $2\,\mathrm{V}$, obratno |

Postopek za vsak interval:

1. Sprememba gostote: končna minus začetna vrednost.
2. Sprememba pretoka: $\Delta \Phi = S\,\Delta B$, npr. $0{,}01 \cdot 0{,}2 = 0{,}002$.
3. Napetost: $U_i = N \dfrac{\Delta \Phi}{\Delta t}$, npr. $100 \cdot \dfrac{0{,}002}{0{,}1} = 2$.
4. Predznak spremembe pove smer toka: ko polje pada, teče tok v nasprotno smer kot pri naraščanju.

V drugem intervalu je polje največje, napetosti pa ni. Tudi tu šteje le sprememba.

## Preveri se

? Pacient ima na prstu kovinski prstan. Med slikanjem z magnetno resonanco se polje naprave hitro spreminja in v prstanu steče tok. Kaj o tem toku pove Lenzovo pravilo?
- Teče vedno tako, da je njegovo polje nasprotno polju naprave.
~ Nasprotuje spremembi, ne polju samemu. Ko polje naprave pada, ima polje induciranega toka isto smer kot polje naprave.
+ Njegovo magnetno polje nasprotuje spremembi pretoka skozi prstan.
- Teče, dokler je polje naprave močno, ne glede na to, ali se spreminja.
~ Pri stalnem polju ni spremembe pretoka in toka ni, tudi če je polje zelo močno.
> Lenzovo pravilo: inducirani tok ustvari polje, ki zmanjšuje spremembo pretoka, ki ga je povzročila. Zato mora pacient prstan pred slikanjem sneti.

? Isti magnet uporabimo v štirih poskusih. A: magnet miruje v tuljavi s $500$ ovoji. B: v $0{,}5\,\mathrm{s}$ ga potisnemo v tuljavo s $500$ ovoji. C: v $0{,}1\,\mathrm{s}$ ga potisnemo v tuljavo s $500$ ovoji. D: v $0{,}1\,\mathrm{s}$ ga potisnemo v tuljavo s $1000$ ovoji. Razvrsti po inducirani napetosti od najmanjše do največje.
- B, C, D, A
~ Mirujoč magnet ne spremeni pretoka, zato je napetost v A enaka nič, torej najmanjša.
- A, C, B, D
~ Daljši čas ne prinese več napetosti. Pri B je sprememba enaka kot pri C, a počasnejša, zato je napetost manjša.
+ A, B, C, D
> $U_i = N \dfrac{\Delta \Phi}{\Delta t}$: A nima spremembe ($0$), B ima večji $\Delta t$ kot C, D ima dvakrat več ovojev kot C.

? Primarno tuljavo transformatorja priključimo na baterijo z napetostjo $12\,\mathrm{V}$. Kaj se zgodi na sekundarni strani, ko je baterija že nekaj časa priključena?
- Dobimo napetost $12\,\mathrm{V} \cdot \dfrac{N_2}{N_1}$, kot pri izmenični napetosti.
~ Razmerje velja le, če se pretok ves čas spreminja. Enosmerni tok da stalen pretok.
+ Napetosti ni; pojavi se le kratko ob vklopu in izklopu.
- Dobimo enosmerno napetost, ki pa je nekoliko manjša zaradi izgub.
~ Izgube niso razlog. Brez spremembe pretoka se ne inducira nič, ne glede na izgube.
> Indukcija potrebuje spremembo pretoka. Stalen tok v primarni tuljavi da stalen pretok, zato je $U_2 = 0$.

? Tuljava ima $1000$ ovojev. Pretok skozi en ovoj se v $0{,}05\,\mathrm{s}$ spremeni za $2\cdot10^{-4}\,\mathrm{V\,s}$. Kolikšna je inducirana napetost?
- $0{,}004\,\mathrm{V}$
~ To je napetost enega samega ovoja. Pomnožiti moraš še s številom ovojev $N$.
- $0{,}01\,\mathrm{V}$
~ Čas si pomnožil namesto delil. Šteje hitrost spremembe, $\Delta t$ je v imenovalcu.
+ $4\,\mathrm{V}$
> $U_i = N \dfrac{\Delta \Phi}{\Delta t} = 1000 \cdot \dfrac{2\cdot10^{-4}\,\mathrm{V\,s}}{0{,}05\,\mathrm{s}} = 4\,\mathrm{V}$.

? Polnilnik električne zobne ščetke ima transformator s $2300$ ovoji na primarni in $60$ ovoji na sekundarni strani. Priključen je na $230\,\mathrm{V}$. Kolikšna je napetost na sekundarni strani?
- $8817\,\mathrm{V}$
~ Razmerje si obrnil. Na strani z manj ovoji je napetost nižja: $U_2 = U_1 \dfrac{N_2}{N_1}$.
- $60\,\mathrm{V}$
~ Število ovojev ni napetost. Šteje razmerje ovojev, pomnoženo z vhodno napetostjo.
+ $6\,\mathrm{V}$
> $U_2 = 230\,\mathrm{V} \cdot \dfrac{60}{2300} = 6\,\mathrm{V}$.

:::simboli
\Phi | magnetni pretok | \Phi = B S | V\,s | enota weber, Wb
B | gostota magnetnega polja | | T
S | ploščina zanke (ovoja) | S = \pi r^2 | m^2 | za krožno zanko
r | polmer zanke | | m
U_i | inducirana napetost | U_i = N \frac{\Delta \Phi}{\Delta t} | V
N | število ovojev | | –
\Delta \Phi | sprememba pretoka skozi en ovoj | \Delta \Phi = S\,\Delta B | V\,s
\Delta B | sprememba gostote polja | | T
\Delta t | čas spremembe | | s
U_1 | napetost na primarni tuljavi | | V
U_2 | napetost na sekundarni tuljavi | U_2 = U_1 \frac{N_2}{N_1} | V
N_1 | število ovojev primarne tuljave | | –
N_2 | število ovojev sekundarne tuljave | N_2 = N_1 \frac{U_2}{U_1} | –
I_1 | tok v primarni tuljavi | I_1 = \frac{P}{U_1} | A
I_2 | tok v sekundarni tuljavi | | A
P | moč transformatorja | P = U_2 I_2 | W | enaka na obeh straneh
:::
