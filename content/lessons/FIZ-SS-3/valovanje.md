---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na začetku 19. stoletja je angleški zdravnik Thomas Young raziskoval, kako oko izostri sliko. Ob tem se je vprašal, kaj sploh je svetloba. Večina učenjakov tistega časa je menila, da je svetloba curek drobnih delcev. Young je trdil, da je valovanje.

Za dokaz je uporabil pojav, ki ga pozna vsak, ki je v mirno vodo vrgel dva kamna. Kjer se srečata vrhova dveh valov, voda poskoči višje. Kjer se vrh sreča z dolino, voda skoraj miruje. Delci tega ne zmorejo: dva curka kamenčkov se nikoli ne »izničita«. Če svetloba počne isto kot voda, mora biti val.

Iste količine, s katerimi je Young opisal valove, danes uporablja vsak ultrazvočni aparat v bolnišnici. Sonda pošlje v telo valovanje, ki ga ne slišimo, in iz odmevov sestavi sliko srca, ledvic ali ploda. Kako drobne podrobnosti aparat vidi in kam usmeri snop, določajo valovna dolžina, frekvenca, hitrost in seštevanje valov.

## Razlaga

**1. Najprej en primer do konca.** Postavimo se v vlogo Younga s plitvo kadjo vode. Palica udarja po gladini 4-krat na sekundo. Od nje potujejo vrhovi, sosednja dva sta vedno $5\,\mathrm{cm}$ narazen. Kako hitro potujejo?

Med dvema udarcema mine četrt sekunde, $0{,}25\,\mathrm{s}$. V tem času se prejšnji vrh odmakne ravno toliko, da je za njim prostor za novega, torej $5\,\mathrm{cm}$. Hitrost vrhov je zato $\dfrac{5\,\mathrm{cm}}{0{,}25\,\mathrm{s}} = 20\,\mathrm{cm/s}$.

**2. Kaj sploh potuje.** Listek na vodi se ob valu dviga in spušča, a ne odplava. Vsak delec vode niha okoli svoje ravnovesne lege, podobno kot utež na vzmeti. Naprej potuje le motnja, z njo pa energija. Motnji, ki se tako širi po snovi, rečemo **valovanje**. Snov, po kateri se širi, je **sredstvo**.

Če delci nihajo pravokotno na smer širjenja, je valovanje **prečno** (napeta vrv, približno tudi gladina vode). Če nihajo v smeri širjenja, je **vzdolžno**: nastajajo **zgoščine**, kjer so delci stisnjeni skupaj, in **razredčine**, kjer so bolj narazen. Tak je zvok, pa tudi ultrazvok v telesu.

V simulaciji spodaj, »Prečno in vzdolžno valovanje«, preklopi med prečnim in vzdolžnim valovanjem in sledi rdečemu delcu. Opazi, da ostaja na svojem mestu, medtem ko vrhovi oziroma zgoščine bežijo mimo njega.

**3. Imena za to, kar smo merili.**

- **Valovna dolžina** $\lambda$ je razdalja med sosednjima vrhovoma. Enako dobro je razdalja med katerima koli sosednjima delcema, ki sta v istem stanju nihanja: imata enak odmik in se gibljeta v isto smer. V kadi je $\lambda = 5\,\mathrm{cm}$.
- **Frekvenca** $\nu$ pove, kolikokrat na sekundo zaniha vsak delec. Enaka je frekvenci izvira, v kadi $4\,\mathrm{Hz}$.
- **Nihajni čas** $t_0 = \dfrac{1}{\nu}$ je čas enega nihaja, v kadi $0{,}25\,\mathrm{s}$.
- **Amplituda** je največji odmik delca iz ravnovesne lege.

:::risba graf
opis: Posnetek vala na vodi v enem trenutku. Vodoravna os je razdalja od palice v centimetrih od 0 do 12, navpična os odmik gladine v milimetrih od −3 do 3. Krivulja je sinusna z amplitudo 2 mm. Vrhova sta pri 1,25 cm in 6,25 cm; puščica med njima označuje valovno dolžino λ = 5 cm. Navpična puščica pri 11,25 cm označuje amplitudo 2 mm.
x: 0 .. 12 | 1 | x [cm]
y: -3 .. 3 | 1 | odmik [mm]
f: 2*sin(2*pi*x/5) | modra
puščica: 1,25; 2,6 -> 6,25; 2,6 | λ = 5 cm | nad | oranžna
puščica: 11,25; 0 -> 11,25; 2 | amplituda | levo | oranžna
podnapis: Val na vodi v enem trenutku: λ med sosednjima vrhovoma, amplituda od ravnovesne lege do vrha
:::

**4. Od primera k pravilu.** V kadi smo valovno dolžino delili z nihajnim časom. Tako je pri vsakem valu: v enem nihajnem času se val premakne natanko za eno valovno dolžino. Za **hitrost valovanja** $c$ velja:

$$c = \frac{\lambda}{t_0}$$

Ker je $\dfrac{1}{t_0}$ frekvenca, lahko pišemo tudi:

$$c = \lambda \nu$$

Preizkus na kadi: $5\,\mathrm{cm} \cdot 4\,\mathrm{Hz} = 20\,\mathrm{cm/s}$, enako kot zgoraj.

:::premisli
Palica začne udarjati 8-krat na sekundo, voda v kadi ostane enaka. Napovej hitrost vrhov in njihov razmik.
---
Hitrost ostane $20\,\mathrm{cm/s}$, ker jo določa voda, ne palica. Razmik se prepolovi: $\lambda = \dfrac{20\,\mathrm{cm/s}}{8\,\mathrm{Hz}} = 2{,}5\,\mathrm{cm}$.
:::

**5. Kdo kaj določa.** Frekvenco določa izvir: palica, roka, sonda. Hitrost določa sredstvo: globina vode, napetost vrvi, vrsta tkiva. Valovna dolžina se jima prilagodi, $\lambda = \dfrac{c}{\nu}$.

Ko val preide v drugo sredstvo, frekvenca ostane enaka: delci na meji pripadajo obema sredstvoma, zato druga stran niha v istem taktu kot prva. Spremenita se hitrost in valovna dolžina. Ultrazvok se v mehkem tkivu širi s hitrostjo okoli $1540\,\mathrm{m/s}$, v kosti precej hitreje.

**6. Ko se srečata dva vala.** V točki, kamor prideta dva vala hkrati, se odmika seštejeta. Pojavu rečemo **interferenca**. Pri dveh enakih valovih da vrh na vrhu dvakrat višji vrh, to je **ojačitev**. Vrh na dolini da odmik nič, to je **oslabitev**.

Pri dveh izvirih, ki nihata v enakem taktu, o izidu v neki točki odloči **razlika poti** $\Delta s$: za koliko je točka bolj oddaljena od enega izvira kot od drugega.

:::risba graf
opis: Dva enaka vala in njuna vsota. Vodoravna os je lega v valovnih dolžinah od 0 do 2, navpična os odmik od −2,5 do 2,5. Prvi val je modra polna krivulja z amplitudo 1. Drugi val je oranžna črtkana krivulja, zamaknjena za d valovnih dolžin. Vsota je zelena debela krivulja. V aplikaciji zamik spreminjaš z drsnikom; izbrano je d = {d}. Pri d = 0 se tanki krivulji prekrivata in vsota ima amplitudo 2.
x: 0 .. 2 | 0,5 | lega [λ]
y: -2,5 .. 2,5 | 1 | odmik
drsnik: d | 0 .. 1 | 0,05 | 0 | zamik drugega vala v valovnih dolžinah
f: sin(2*pi*x) | modra
f: sin(2*pi*(x - d)) | oranžna črtkano
f: sin(2*pi*x) + sin(2*pi*(x - d)) | zelena debelo
podnapis: Prvi val (polna), drugi val (črtkana) in vsota (debela) pri zamiku d = {d} valovne dolžine
:::

Premakni drsnik na $0{,}5$: tanki krivulji sta si nasprotni, debela je ravna črta. Pri $1$ sta spet enaki. Razlika poti deluje kot ta zamik: val iz bolj oddaljenega izvira pride v točko za $\Delta s$ pozneje. Pravilo:

| Razlika poti $\Delta s$ | Srečata se | Izid |
|---|---|---|
| $0$, $\lambda$, $2\lambda$, … | vrh in vrh | ojačitev |
| $\frac{1}{2}\lambda$, $\frac{3}{2}\lambda$, … | vrh in dolina | oslabitev |

:::premisli
Kjer je oslabitev, voda miruje in energije tam ni. Zakaj interferenca vseeno ne krši ohranitve energije?
---
Energija se le prerazporedi. Kjer je ojačitev, je amplituda dvakratna, energija pa štirikratna, ker je sorazmerna s kvadratom amplitude (kot pri nihalu, $W = \frac{1}{2} k x_0^2$). Kar manjka v mirnih točkah, je odveč v ojačenih.
:::

Ultrazvočna sonda ima v vrsti veliko drobnih oddajnikov. Aparat jih sproži z majhnimi zamiki, da se valovi ojačijo v izbrani točki v telesu, drugod pa oslabijo. Tako usmeri snop, ne da bi premaknil sondo.

## Rešeni primeri

### Primer 1: ultrazvok pri pregledu trebuha

Sonda za pregled trebuha oddaja ultrazvok s frekvenco $3\,\mathrm{MHz}$. V mehkem tkivu se širi s hitrostjo $1540\,\mathrm{m/s}$. Kolikšna je valovna dolžina?

**Podatki:** $\nu = 3\,\mathrm{MHz}$, $c = 1540\,\mathrm{m/s}$
**Iščemo:** valovno dolžino $\lambda$

:::formula
$\lambda = \dfrac{c}{\nu}$
:::

**Rešitev:**

1. Predpono pretvorimo, ker mega pomeni milijon: $3\,\mathrm{MHz} = 3 \cdot 10^{6}\,\mathrm{Hz}$.
2. $\lambda = \dfrac{1540\,\mathrm{m/s}}{3 \cdot 10^{6}\,\mathrm{Hz}} \approx 5{,}1 \cdot 10^{-4}\,\mathrm{m}$.
3. V milimetrih, ki si jih lažje predstavljamo: $\lambda \approx 0{,}51\,\mathrm{mm}$.
4. Odgovor: valovna dolžina je okoli pol milimetra. Podrobnosti, manjše od približno ene valovne dolžine, aparat težko loči, zato za drobne strukture uporabijo višjo frekvenco.

### Primer 2: terapevtska vrv

Pri vajah za ramena pacient maha z dolgo debelo vrvjo, ki je na drugem koncu pritrjena na steno. V času $6\,\mathrm{s}$ naredi $12$ zamahov. Vrhovi na vrvi so $1{,}5\,\mathrm{m}$ narazen, vrv je od roke do stene dolga $9\,\mathrm{m}$. Kako hitro potujejo valovi in koliko časa potuje vrh do stene?

**Podatki:** $12$ zamahov v času $t = 6\,\mathrm{s}$, $\lambda = 1{,}5\,\mathrm{m}$, $l = 9\,\mathrm{m}$
**Iščemo:** hitrost $c$ in čas $t_1$ do stene

:::formula
$\nu = \dfrac{\text{število nihajev}}{t}$, $c = \lambda \nu$, $t_1 = \dfrac{l}{c}$
:::

**Rešitev:**

1. Vsak zamah je en nihaj roke, zato $\nu = \dfrac{12}{6\,\mathrm{s}} = 2\,\mathrm{Hz}$.
2. $c = 1{,}5\,\mathrm{m} \cdot 2\,\mathrm{Hz} = 3\,\mathrm{m/s}$.
3. Vrh potuje enakomerno, zato $t_1 = \dfrac{9\,\mathrm{m}}{3\,\mathrm{m/s}} = 3\,\mathrm{s}$.
4. Odgovor: valovi potujejo s hitrostjo $3\,\mathrm{m/s}$, vrh pride do stene v $3\,\mathrm{s}$.

### Primer 3: mirna točka pred sondo

Dva oddajnika v sondi, A in B, nihata v enakem taktu s frekvenco $2\,\mathrm{MHz}$. Ultrazvok se po tkivu širi s hitrostjo $1540\,\mathrm{m/s}$. Točka T je od oddajnika A oddaljena $30{,}000\,\mathrm{mm}$, od oddajnika B pa $31{,}155\,\mathrm{mm}$. Se valova v točki T ojačita ali oslabita?

**Podatki:** $\nu = 2\,\mathrm{MHz}$, $c = 1540\,\mathrm{m/s}$, $s_1 = 30{,}000\,\mathrm{mm}$, $s_2 = 31{,}155\,\mathrm{mm}$
**Iščemo:** ali je v T ojačitev ali oslabitev

:::formula
$\lambda = \dfrac{c}{\nu}$, $\Delta s = s_2 - s_1$

Ojačitev, če je $\Delta s = N\lambda$; oslabitev, če je $\Delta s = \left(N + \tfrac{1}{2}\right)\lambda$ ($N = 0, 1, 2, \ldots$).
:::

**Rešitev:**

1. Najprej valovna dolžina, ker razliko poti merimo z njo: $\lambda = \dfrac{1540\,\mathrm{m/s}}{2 \cdot 10^{6}\,\mathrm{Hz}} = 7{,}7 \cdot 10^{-4}\,\mathrm{m} = 0{,}77\,\mathrm{mm}$.
2. Razlika poti: $\Delta s = 31{,}155\,\mathrm{mm} - 30{,}000\,\mathrm{mm} = 1{,}155\,\mathrm{mm}$.
3. Koliko valovnih dolžin je to: $\dfrac{1{,}155\,\mathrm{mm}}{0{,}77\,\mathrm{mm}} = 1{,}5$.
4. Val iz B zaostaja za eno celo valovno dolžino in še pol. Cela valovna dolžina ne spremeni ničesar, polovica pa vrh zamenja z dolino: v T pride iz B dolina ravno takrat, ko iz A pride vrh.
5. Odgovor: v točki T se valova oslabita, tkivo tam skoraj ne niha.

### Primer 4: zdaj ti

Vsak utrip srca pošlje po aorti tlačni sunek, **pulzni val**. Hitrost pulznega vala v aorti je približno $5\,\mathrm{m/s}$, srce utripne $75$-krat na minuto. Kolikšna je razdalja med dvema zaporednima sunkoma?

**Podatki:** $75$ utripov v $60\,\mathrm{s}$, $c = 5\,\mathrm{m/s}$
**Iščemo:** razdaljo med sunkoma, to je valovno dolžino $\lambda$

:::formula
$\nu = \dfrac{\text{število utripov}}{t}$, $\lambda = \dfrac{c}{\nu}$
:::

**Rešitev:**

1. Frekvenca: $\nu = \dfrac{75}{60\,\mathrm{s}} = 1{,}25\,\mathrm{Hz}$.
2. Neznanka je valovna dolžina, zato vzamemo $\lambda = \dfrac{c}{\nu}$.
3. Izračunaj sam in razmisli, kaj rezultat pove v primerjavi z velikostjo telesa.

:::premisli
Koliko je $\lambda$? Je v aorti hkrati več sunkov ali manj kot eden?
---
$\lambda = \dfrac{5\,\mathrm{m/s}}{1{,}25\,\mathrm{Hz}} = 4\,\mathrm{m}$. To je več kot dvakrat višina človeka, zato je v aorti hkrati le del enega sunka: sunek pride do stopal, preden srce znova utripne.
:::

## Pogoste napake

- **»Višja frekvenca, hitrejši val.«** Učenec misli, da hitrejše mahanje pospeši valove. Hitrost določa sredstvo, ne izvir. Pri višji frekvenci se skrajša valovna dolžina, $\lambda = \dfrac{c}{\nu}$, hitrost pa ostane.
- **»Val nese vodo s seboj.«** Ker vrhovi potujejo, se zdi, da potuje tudi voda. Delci le nihajo na mestu; val prenaša energijo, ne snovi.
- **Valovna dolžina od vrha do doline.** To je le pol valovne dolžine. Meri od vrha do sosednjega vrha.
- **»Ob prehodu v kost se spremeni frekvenca.«** Frekvenco določa izvir in se na meji ne spremeni. Spremenita se hitrost in z njo valovna dolžina.
- **»Dva vala sta vedno močnejša od enega.«** Velja le, kjer se srečata vrh in vrh. Kjer pride vrh na dolino, je odmik manjši ali celo nič.

## Povzetek

- Valovanje je motnja, ki se širi po sredstvu; delci nihajo na mestu, prenaša se energija. Prečno: nihanje pravokotno na smer širjenja; vzdolžno: v smeri širjenja.
- Valovna dolžina $\lambda$ je razdalja med sosednjima vrhovoma, frekvenca $\nu$ je frekvenca izvira, $t_0 = \dfrac{1}{\nu}$.
- Hitrost valovanja: $c = \dfrac{\lambda}{t_0} = \lambda \nu$. Hitrost določa sredstvo, frekvenco izvir; ob prehodu v drugo sredstvo se $\nu$ ne spremeni.
- Interferenca: odmika dveh valov se seštejeta. Razlika poti $N\lambda$ da ojačitev, $\left(N + \frac{1}{2}\right)\lambda$ oslabitev.
- Medicina: ultrazvok ($1540\,\mathrm{m/s}$ v tkivu, nekaj MHz, $\lambda$ pod milimetrom), usmerjanje snopa z interferenco, pulzni val v aorti.

## Drugače: Z analogijo

Spomni se **mehiškega vala** na stadionu. Vsak gledalec le vstane in sede na svojem sedežu: to je nihanje delca. Okoli stadiona pa potuje val: to je motnja. Gledalci ne tečejo okoli igrišča, tako kot voda ne potuje z valom.

- **Frekvenca** je, kolikokrat na sekundo vsak gledalec vstane.
- **Valovna dolžina** je razdalja med dvema valovoma, če ju navijači sprožijo enega za drugim.
- **Hitrost** je odvisna od tega, kako hitro ljudje odreagirajo na soseda. To je lastnost »sredstva«, ne tistega, ki je val sprožil.

Zvezo $c = \lambda \nu$ si predstavljaj z vlakom. Če mimo tebe vsako sekundo pripeljeta dva vagona, dolga po $20\,\mathrm{m}$, vlak pelje s hitrostjo $40\,\mathrm{m/s}$. Vagon je valovna dolžina, število vagonov na sekundo je frekvenca.

Analogija ima mejo pri interferenci. Če se dva mehiška vala srečata, gledalec ne more vstati »dvakrat višje«. Voda pa to zmore, zato se vala na vodi res seštejeta.

## Drugače: Bolj natančno

Delec na razdalji $x$ od izvira ponavlja nihanje izvira, le z zamudo $\dfrac{x}{c}$. Če izvir niha kot $y = y_0 \sin(\omega t)$, kjer je $\omega = 2\pi\nu$, je odmik delca na mestu $x$:

$$y = y_0 \sin\left(\omega t - \frac{2\pi x}{\lambda}\right)$$

Delca, ki sta narazen za $\lambda$, imata v oklepaju razliko $2\pi$, zato nihata povsem enako. To je natančna definicija valovne dolžine.

Zakaj hitrost določa sredstvo? Na napeti vrvi velja $c = \sqrt{\dfrac{F}{\mu}}$, kjer je $F$ sila, s katero je vrv napeta, in $\mu$ masa enega metra vrvi. Bolj napeta vrv hitreje vrne delce nazaj, težja jih vrača počasneje. Enak vzorec smo videli pri nihalu na vzmeti.

Pri interferenci sta pravili z razliko poti točni le za izvira, ki nihata v enakem taktu. Če imata vala različni amplitudi, oslabitev ni popolna: ostane razlika amplitud. In ker interferenca zahteva stalen zamik med valovi, jo za svetlobo opazimo le, če oba vala izvirata iz istega izvira, kot je to naredil Young: svetlobo enega izvira je spustil skozi dve tesni reži.

## Preveri se

? Tri razdalje so enake valovni dolžini, ena ni. Katera je izjema?
- razdalja med sosednjima vrhovoma
~ To je prav definicija valovne dolžine.
+ razdalja med vrhom in sosednjo dolino
- pot, ki jo val opravi v enem nihajnem času
~ V času $t_0$ se val premakne natanko za $\lambda$, zato je tudi to valovna dolžina.
- razdalja med sosednjima dolinama
~ Med dolinama je enako daleč kot med vrhovoma, zato je tudi to valovna dolžina.
> Od vrha do sosednje doline je le pol valovne dolžine.

? Sonda za pregled ščitnice oddaja ultrazvok s frekvenco $4\,\mathrm{MHz}$, hitrost v tkivu je $1540\,\mathrm{m/s}$. Kolikšna je valovna dolžina?
+ $0{,}385\,\mathrm{mm}$
- $385\,\mathrm{m}$
~ Tako dobiš, če pozabiš predpono mega in deliš s $4$ namesto s $4 \cdot 10^{6}$.
- $6{,}2 \cdot 10^{9}\,\mathrm{m}$
~ Hitrost si pomnožil s frekvenco. Valovna dolžina je količnik: $\lambda = \dfrac{c}{\nu}$.
> $\lambda = \dfrac{1540\,\mathrm{m/s}}{4 \cdot 10^{6}\,\mathrm{Hz}} = 3{,}85 \cdot 10^{-4}\,\mathrm{m} = 0{,}385\,\mathrm{mm}$.

? Pacient z isto terapevtsko vrvjo začne mahati dvakrat pogosteje. Kaj se zgodi z valovi na vrvi?
- Hitrost se podvoji, valovna dolžina ostane enaka.
~ Hitrost določa vrv (napetost in masa), ne roka. Hitrejše mahanje vrvi ne spremeni.
+ Hitrost ostane enaka, valovna dolžina se razpolovi.
- Hitrost ostane enaka, valovna dolžina se podvoji.
~ Pri isti hitrosti in večji frekvenci je $\lambda = \dfrac{c}{\nu}$ manjša, ne večja.
> Frekvenca se podvoji, hitrost ostane, zato je $\lambda = \dfrac{c}{\nu}$ pol manjša.

? Učenec razmišlja o ultrazvoku $2\,\mathrm{MHz}$, ki iz tkiva ($1540\,\mathrm{m/s}$) preide v kost ($4000\,\mathrm{m/s}$): (1) frekvenca v kosti ostane $2\,\mathrm{MHz}$; (2) hitrost v kosti je večja; (3) ker je hitrost večja, se valovna dolžina skrajša. Kateri korak je napačen?
- korak (1)
~ Frekvenco določa izvir; delci na meji nihajo skupaj, zato se frekvenca ne spremeni.
- korak (2)
~ Hitrost je podana v nalogi: $4000\,\mathrm{m/s}$ je več kot $1540\,\mathrm{m/s}$.
+ korak (3)
> Pri isti frekvenci je $\lambda = \dfrac{c}{\nu}$ sorazmerna s hitrostjo, zato se podaljša: iz $0{,}77\,\mathrm{mm}$ na $2\,\mathrm{mm}$.

? Slušalke z dušenjem hrupa imajo mikrofon, ki zazna brnenje letala, in zvočnik, ki odda svoj val. Kakšen val mora oddati, da v ušesu brnenje skoraj izgine?
- enak val, v istem taktu kot brnenje
~ Vrh bi se srečal z vrhom, to je ojačitev: brnenje bi bilo še močnejše.
- val z dvakrat višjo frekvenco
~ Valova z različnima frekvencama se ne moreta stalno izničevati, saj se zamik med njima ves čas spreminja.
+ val z enako frekvenco in amplitudo, zamaknjen za pol valovne dolžine
> Ko pride dolina na vrh, se odmika odštejeta: to je oslabitev. Enaka amplituda da skoraj popolno tišino.

:::simboli
c | hitrost valovanja | c = \lambda \nu | m/s | določa jo sredstvo
\lambda | valovna dolžina | \lambda = \dfrac{c}{\nu} | m | razdalja med sosednjima vrhovoma
\nu | frekvenca | \nu = \dfrac{1}{t_0} | Hz | določa jo izvir
t_0 | nihajni čas | t_0 = \dfrac{1}{\nu} | s
\Delta s | razlika poti | \Delta s = s_2 - s_1 | m
s_1 | razdalja točke od oddajnika A | | m
s_2 | razdalja točke od oddajnika B | | m
N | celo število | | – | $N = 0, 1, 2, \ldots$
t | čas, v katerem štejemo nihaje | | s
t_1 | čas, da vrh pride do stene | t_1 = \dfrac{l}{c} | s
l | dolžina vrvi | | m
y | odmik delca | | m
y_0 | amplituda | | m
\omega | krožna frekvenca | \omega = 2\pi\nu | s^{-1}
x | razdalja od izvira | | m
F | sila, s katero je vrv napeta | | N
\mu | masa enega metra vrvi | | kg/m
:::
