---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

»Bzzzz.« Močan veter zapiha, ko se sprehajaš ob pašniku, in napeta žica ograje začne brneti. Sošolec Matic pove svojo razlago: »Žica lahko niha s katerokoli frekvenco, odvisno od vetra. Valovi po njej samo bežijo proti drogovom in se tam izgubijo.«

Obe trditvi sta napačni. Valovi se na drogovih odbijejo in vrnejo. Odbiti in vpadni val skupaj tvorita **stoječe valovanje**, ki je mogoče le pri čisto določenih frekvencah. Veter iz njih samo izbere eno. Po istem pravilu brnijo daljnovodi, pojejo strune kitare in se ziblje voda v dolgem jezeru. Na koncu lekcije boš Matica lahko popravil s števili.

## Razlaga

Valovanje že poznaš: $c = \lambda\nu$, interferenca, prečni in vzdolžni valovi. Zdaj ga pošljemo do konca vrvi.

**1. Odboj na koncu vrvi.** Pošljimo po vrvi en sam hrib. Ko pride do konca, se odbije. Kako, je odvisno od krajišča:

- **vpeto krajišče** (vrv privezana na steno): hrib se vrne kot **dolina**. Vrv vleče steno navzgor, stena pa po 3. Newtonovem zakonu vrv navzdol. Pravimo, da se faza obrne.
- **prosto krajišče** (vrv konča z obročkom, ki drsi po palici): hrib se vrne kot **hrib**. Nič ga ne zadržuje, zato se dvigne še više, nato pa ga vrv potegne nazaj navzdol in pošlje nazaj hrib, brez obrata.

:::risba skica
opis: Zgoraj vpeto krajišče: hrib potuje proti steni na desni, po odboju se vrača proti levi kot dolina. Spodaj prosto krajišče, vrv konča z obročkom na navpični palici: hrib se vrača proti levi kot hrib.
območje: 0; 0 .. 10; 7
enota: 30
napis: 0; 6,8 | vpeto krajišče | desno
pravokotnik: 9; 3,8 .. 9,5; 6,2 | siva polno
črta: 0; 5 -> 1,5; 5 -> 2,5; 6 -> 3,5; 5 -> 5,5; 5 -> 6,5; 4 -> 7,5; 5 -> 9; 5 | modra
puščica: 1,5; 6,3 -> 3,5; 6,3 | prej | nad
puščica: 7,5; 3,6 -> 5,5; 3,6 | potem | pod
napis: 0; 0,3 | prosto krajišče | desno
črta: 9,2; 0,3 -> 9,2; 2,9 | siva debelo
krog: 9,2; 1,5 | 0,2 | modra
črta: 0; 1,5 -> 1,5; 1,5 -> 2,5; 2,5 -> 3,5; 1,5 -> 5,5; 1,5 -> 6,5; 2,5 -> 7,5; 1,5 -> 9; 1,5 | modra
puščica: 1,5; 2,8 -> 3,5; 2,8 | prej | nad
puščica: 7,5; 2,8 -> 5,5; 2,8 | potem | nad
podnapis: Na vpetem krajišču se hrib vrne kot dolina, na prostem kot hrib.
:::

**Preizkus:** valovi na jezeru udarjajo ob navpičen skalnat breg. Ali je to bolj podobno vpetemu ali prostemu krajišču? *(Prostemu: gladina ob steni se lahko prosto dviga in spušča, zato se hrib vrne kot hrib.)*

**2. Zaporedne slike potujočega vala.** Fotografija vala je »posnetek« oblike v enem trenutku. Kam se v tem trenutku giblje posamezen delec, iz ene slike ne vidiš. Pomagaš si z drugo sliko malo kasneje: celotno obliko premakneš v smeri širjenja za $\Delta x = c\,\Delta t$ in pogledaš, ali je delec na istem mestu zdaj višje ali nižje.

Pravilo, ki iz tega sledi: **delec pred vrhom** (na strani, kamor val potuje) se dviga, delec za vrhom se spušča, delec na vrhu ali v dolini za hip miruje.

**Preizkus:** val potuje v levo, delec je desno od vrha. Ali se dviga ali spušča? *(Spušča: vrh je že šel mimo njega.)*

**3. Stoječe valovanje.** Po vrvi naj ves čas potuje val proti vpetemu koncu, odbiti val pa nazaj. Imata enako frekvenco in amplitudo, potujeta pa v nasprotnih smereh. Kot pri interferenci se odmika seštejeta. Nastane oblika, ki ne potuje nikamor:

- **vozli**: točke, ki sploh ne nihajo; sosednja vozla sta narazen $\frac{\lambda}{2}$;
- **hrbti**: točke na sredi med vozloma, ki nihajo z največjo amplitudo;
- vsi delci med dvema vozloma nihajo hkrati v isto smer, v sosednjem odseku v nasprotno;
- energija ne teče vzdolž vrvi, ampak ostaja ujeta med vozli.

Zaporedne slike stoječega valovanja kažejo, da se oblika le »napihuje« in »sploščuje«:

:::risba graf
opis: Zaporedne slike stoječega valovanja na 2 m dolgi struni z valovno dolžino 2 m. Pri t = 0 ima struna hrib na 0,5 m in dolino na 1,5 m. Po osmini nihajnega časa sta odmika manjša, po četrtini je struna ravna, po polovici je oblika obrnjena. Vozli so pri 0 m, 1 m in 2 m.
x: 0 .. 2 | 0,5 | x [m]
y: -1,3 .. 1,3 | 0,5 | y
f: sin(pi*x) | modra
f: 0,71*sin(pi*x) | siva črtkano
f: -0,71*sin(pi*x) | siva črtkano
f: -sin(pi*x) | oranžna
točka: 0; 0 | V | nad
točka: 1; 0 | V | nad desno
točka: 2; 0 | V | nad levo
napis: 0,5; 1,15 | t = 0 | sredina
napis: 1,5; 1,15 | t = t_0/2 | sredina
podnapis: Polna modra: t = 0; črtkani: t = t₀/8 in 3t₀/8; polna oranžna: t = t₀/2. Pri t = t₀/4 je struna ravna.
:::

V času $\frac{t_0}{4}$ gre struna iz največjega odklona v ravno lego, v času $\frac{t_0}{2}$ pa v obrnjeno obliko. Vozli so ves čas na istem mestu.

**Preizkus:** valovna dolžina je $60\,\mathrm{cm}$. Kako daleč sta sosednja vozla? *($30\,\mathrm{cm}$.)*

:::premisli
Zakaj je na vpetem krajišču vedno vozel, na prostem pa hrbet?
---
Vpeto krajišče se ne more premakniti, zato tam ni nihanja: vozel. Na prostem krajišču se vpadni in odbiti val srečata brez obrata faze, njuna odmika se seštejeta v največji odmik: hrbet.
:::

**4. Lastna nihanja strune.** Struna je vpeta na obeh koncih, zato morata biti na obeh koncih vozla. To gre le, če je na dolžino strune $L$ celo število polovic valovne dolžine:

$$L = n\,\frac{\lambda}{2}$$

Iz $\nu = \frac{c}{\lambda}$ dobimo frekvence, s katerimi struna lahko stoječe niha, **lastne frekvence**:

$$\nu_n = \frac{n\,c}{2L}$$

| $n$ | $\lambda_n$ | $\nu_n$ | vozli |
|---|---|---|---|
| 1 | $2L$ | $\nu_1$ | 2 |
| 2 | $L$ | $2\nu_1$ | 3 |
| 3 | $\frac{2L}{3}$ | $3\nu_1$ | 4 |

Pri $n = 1$ je **osnovno lastno nihanje** (en hrbet), višja (pravimo jim **višji harmoniki**) so večkratniki $\nu_1$. V vozle so šteta tudi krajišča. Struna je torej nihalo z mnogo lastnimi frekvencami. Če jo vzbujamo s katero od njih, nastopi resonanca, kot pri dušenem in vsiljenem nihanju. V simulaciji spodaj (»Stoječe valovanje na struni«) premakni drsnik *harmonik n* z 1 na 3 in opazuj: vsakič pride en vozel več, frekvenca pa naraste za $\nu_1$.

**Preizkus:** struno skrajšaš na polovico, hitrost valovanja ostane enaka. Kaj se zgodi z $\nu_1$? *(Podvoji se.)*

**5. Hitrost in napetost strune.** Hitrost valovanja na struni je odvisna od sile $F$, s katero je napeta, in od mase na enoto dolžine $\mu = \frac{m}{l}$:

$$c = \sqrt{\frac{F}{\mu}}$$

Na maturitetnem listu s formulami je ista enačba zapisana z maso $m$ kosa strune z dolžino $l$:

$$c = \sqrt{\frac{F\,l}{m}}$$

Bolj napeta struna hitreje vrača delce nazaj, zato je $c$ večja. Težja struna se odziva počasneje. Zato kitarist ton zviša tako, da struno bolj napne, debele strune pa dajo nizke tone.

:::premisli
Kolikokrat moraš povečati silo v struni, da se osnovna frekvenca podvoji?
---
Štirikrat. $\nu_1 = \frac{c}{2L}$ je sorazmerna s $c$, ta pa s $\sqrt{F}$. Za dvakrat večjo $c$ potrebuješ $2^2 = 4$-krat večjo silo.
:::

**Preizkus:** sila v struni se poveča za $21\,\%$. Za koliko se zviša ton? *(Za $10\,\%$, ker je $\sqrt{1{,}21} = 1{,}1$.)*

**6. Lom valovanja.** Ko val preide v območje z drugačno hitrostjo, se mu spremeni smer. Kote merimo od **vpadne pravokotnice** na mejo; $\alpha$ je vpadni, $\beta$ lomni kot:

$$\frac{\sin \alpha}{\sin \beta} = \frac{c_1}{c_2}$$

Na morju so valovi v plitvini počasnejši, zato se zasučejo proti pravokotnici in pridejo do plaže skoraj vzporedno z obalo. Pri zvoku se dogaja podobno: ob mirnem večeru je zrak pri tleh hladnejši kot višje. V hladnem zraku je zvok počasnejši, zato se ukrivi nazaj proti tlom in se sliši daleč.

## Rešeni primeri

### Primer 1: račka na valovih

Valovi na jezeru potujejo v desno s hitrostjo $2{,}5\,\mathrm{m/s}$. Slika kaže gladino v nekem trenutku (polna črta). Kam se ta trenutek giblje račka v točki A, kam boja B in kam list C? Kakšen je odmik vsake od njih čez četrtino nihajnega časa?

:::risba graf
opis: Posnetek vala na jezeru: valovna dolžina 4 m, amplituda 0,3 m, val potuje v desno. Vrha sta pri 1 m in 5 m, dolini pri 3 m in 7 m. Točka A je pri 2 m na gladini, B pri 5 m na vrhu, C pri 4 m na gladini. Črtkano je oblika četrt nihajnega časa kasneje, premaknjena za 1 m v desno.
x: 0 .. 8 | 1 | x [m]
y: -0,4 .. 0,5 | 0,2 | y [m]
f: 0,3*sin(pi*x/2) | modra
f: 0,3*sin(pi*(x-1)/2) | oranžna črtkano
točka: 2; 0 | A | pod levo
točka: 5; 0,3 | B | nad
točka: 4; 0 | C | pod
puščica: 6; 0,45 -> 7,5; 0,45 | c | nad
:::

**Podatki:** $c = 2{,}5\,\mathrm{m/s}$, z grafa $\lambda = 4{,}0\,\mathrm{m}$ in amplituda $0{,}3\,\mathrm{m}$, val potuje v desno
**Iščemo:** smer hitrosti A, B in C ter njihove odmike po $\frac{t_0}{4}$

:::formula
$t_0 = \frac{\lambda}{c}$, premik oblike $\Delta x = c\,\Delta t$
:::

**Rešitev:**

1. Nihajni čas: $t_0 = \frac{4{,}0\,\mathrm{m}}{2{,}5\,\mathrm{m/s}} = 1{,}6\,\mathrm{s}$, četrtina je $0{,}4\,\mathrm{s}$.
2. V tem času se oblika premakne za $\Delta x = 2{,}5\,\mathrm{m/s} \cdot 0{,}4\,\mathrm{s} = 1{,}0\,\mathrm{m}$, to je $\frac{\lambda}{4}$ (črtkana črta).
3. Vrh pri $1\,\mathrm{m}$ je levo od A, torej je A pred vrhom in se dviga; na črtkani črti je pri $x = 2\,\mathrm{m}$ vrh, odmik $+0{,}3\,\mathrm{m}$.
4. B je na vrhu, zato ta hip miruje; čez $0{,}4\,\mathrm{s}$ je na ravnovesni legi in se spušča.
5. Vrh pri $5\,\mathrm{m}$ je desno od C, torej je C za vrhom in se spušča; čez $0{,}4\,\mathrm{s}$ je v dolini, odmik $-0{,}3\,\mathrm{m}$.
6. Odgovor: A se dviga, B miruje, C se spušča; po $0{,}4\,\mathrm{s}$ so odmiki $+0{,}3\,\mathrm{m}$; $0$ in $-0{,}3\,\mathrm{m}$.

### Primer 2: jeklenica vremenskega stolpa

Stolp vremenske postaje drži napeta jeklenica, dolga $12\,\mathrm{m}$, z maso $2{,}4\,\mathrm{kg}$ in silo $2000\,\mathrm{N}$. Veter jo vzbudi v tretje lastno nihanje ($n = 3$). Kolikšna je hitrost valovanja, osnovna frekvenca in frekvenca tega nihanja? Kje so vozli in v kolikšnem času gre jeklenica iz največjega odklona v ravno lego?

**Podatki:** $l = L = 12\,\mathrm{m}$, $m = 2{,}4\,\mathrm{kg}$, $F = 2000\,\mathrm{N}$, $n = 3$
**Iščemo:** $c$, $\nu_1$, $\nu_3$, lego vozlov, čas $\frac{t_0}{4}$

:::formula
$c = \sqrt{\frac{F\,l}{m}}$, $\nu_n = \frac{n\,c}{2L}$
:::

**Rešitev:**

1. Hitrost; masa in dolžina sta za isti kos, zato smemo vstaviti celo jeklenico:

   $$c = \sqrt{\frac{2000\,\mathrm{N} \cdot 12\,\mathrm{m}}{2{,}4\,\mathrm{kg}}}$$

   torej $c = \sqrt{10\,000}\,\mathrm{m/s} = 100\,\mathrm{m/s}$.
2. Osnovna frekvenca: $\nu_1 = \frac{100\,\mathrm{m/s}}{2 \cdot 12\,\mathrm{m}} \approx 4{,}17\,\mathrm{Hz}$.
3. Tretje lastno nihanje: $\nu_3 = 3\nu_1 = 12{,}5\,\mathrm{Hz}$.
4. Valovna dolžina: $\lambda_3 = \frac{2 \cdot 12\,\mathrm{m}}{3} = 8\,\mathrm{m}$, vozli so narazen $4\,\mathrm{m}$: pri $0$; $4$; $8$ in $12\,\mathrm{m}$. Hrbti so pri $2$; $6$ in $10\,\mathrm{m}$.
5. Nihajni čas $t_0 = \frac{1}{12{,}5\,\mathrm{Hz}} = 0{,}08\,\mathrm{s}$; četrtina je $0{,}02\,\mathrm{s}$.
6. Odgovor: $c = 100\,\mathrm{m/s}$, $\nu_1 \approx 4{,}2\,\mathrm{Hz}$, $\nu_3 = 12{,}5\,\mathrm{Hz}$; štirje vozli, iz skrajne v ravno lego v $0{,}02\,\mathrm{s}$.

### Primer 3: žica v vetru

Žica med drogovoma je dolga $30\,\mathrm{m}$ in ima maso $1{,}2\,\mathrm{kg}$ na meter. V močnem vetru na njej opazimo stoječe valovanje s tremi hrbti, ki niha s frekvenco $2{,}0\,\mathrm{Hz}$. S kolikšno silo je žica napeta?

**Podatki:** $L = 30\,\mathrm{m}$, $\mu = 1{,}2\,\mathrm{kg/m}$, trije hrbti, $\nu = 2{,}0\,\mathrm{Hz}$
**Iščemo:** silo $F$

:::formula
$L = n\,\frac{\lambda}{2}$, $c = \lambda\nu$, $c = \sqrt{\frac{F}{\mu}}$
:::

**Rešitev:**

1. Trije hrbti pomenijo $n = 3$ (med štirimi vozli so tri polovice valovne dolžine).
2. $\lambda = \frac{2L}{n} = \frac{2 \cdot 30\,\mathrm{m}}{3} = 20\,\mathrm{m}$.
3. $c = \lambda\nu$, torej $c = 20\,\mathrm{m} \cdot 2{,}0\,\mathrm{Hz} = 40\,\mathrm{m/s}$.
4. Iz enačbe za hitrost na struni izrazi silo in izračunaj sam, nato preveri:

:::premisli
Kolikšna je sila v žici?
---
Kvadriramo: $F = \mu c^2$. Vstavimo: $F = 1{,}2\,\mathrm{kg/m} \cdot (40\,\mathrm{m/s})^2$, torej $F = 1920\,\mathrm{N} \approx 1{,}9\,\mathrm{kN}$.
:::

## Pogoste napake

- **»Na vpetem koncu se val odbije enak, kot je prišel.«** Tako je le na prostem koncu. Stena vrv potegne nasprotno, zato se hrib vrne kot dolina.
- **»Razdalja med sosednjima vozloma je $\lambda$.«** V eni valovni dolžini sta dva odseka, ki nihata nasprotno. Vozla sta narazen $\frac{\lambda}{2}$, zato je $L = n\frac{\lambda}{2}$, ne $L = n\lambda$.
- **»Delec na vrhu ima največjo hitrost in se giblje v smeri vala.«** Delec na vrhu za hip miruje. Delci se gibljejo le gor in dol; smer dobiš s premikom slike v smeri širjenja.
- **»Dvakratna sila da dvakrat višji ton.«** Frekvenca gre s $\sqrt{F}$. Dvakratna sila zviša ton le za faktor $\sqrt{2} \approx 1{,}41$.
- **Grami in napačna dolžina v $c = \sqrt{F\,l/m}$.** Masa mora biti v kilogramih in pripadati istemu kosu strune, kot je dolžina $l$. Masa v gramih da $\sqrt{1000} \approx 32$-krat premajhno hitrost.

## Povzetek

- **Odboj**: na vpetem krajišču se hrib vrne kot dolina, na prostem kot hrib.
- **Smer gibanja delca** v potujočem valu: sliko premakneš v smeri širjenja; delec pred vrhom se dviga, za vrhom spušča.
- **Stoječe valovanje** nastane iz dveh enakih valov, ki potujeta nasproti. **Vozli** ne nihajo, **hrbti** nihajo najmočneje; sosednja vozla sta narazen $\frac{\lambda}{2}$.
- **Lastna nihanja strune**, vpete na obeh koncih:
$$\nu_n = \frac{n\,c}{2L}$$
- **Hitrost na struni**:
$$c = \sqrt{\frac{F\,l}{m}} = \sqrt{\frac{F}{\mu}}$$
- **Lom**: $\frac{\sin\alpha}{\sin\beta} = \frac{c_1}{c_2}$; valovi v plitvini se zasučejo proti obali.

## Drugače: Na sliki

Struna z $n = 3$ je kot tri gugalnice v vrsti, ki se gugajo izmenično: srednja gre dol, ko gresta zunanji gor. Mesta, kjer se odseki stikajo, so vozli in se ne premaknejo.

:::risba graf
opis: Struna dolžine 3 m v tretjem lastnem nihanju. Ovojnica ima tri hrbte pri 0,5 m, 1,5 m in 2,5 m ter štiri vozle pri 0, 1, 2 in 3 m. Polna črta kaže trenutno obliko: zunanja odseka zgoraj, srednji spodaj.
x: 0 .. 3 | 0,5 | x [m]
y: -1,3 .. 1,3 | 0,5 | y
f: sin(pi*x) | siva črtkano
f: -sin(pi*x) | siva črtkano
f: 0,8*sin(pi*x) | modra
točka: 0; 0 | V | nad desno
točka: 1; 0 | V | nad
točka: 2; 0 | V | nad
točka: 3; 0 | V | nad levo
napis: 1,5; 1,15 | H | sredina
:::

Črtkani ovojnici sta »meja«, do katere pride vsak delec. Razdalja od osi do ovojnice je amplituda delca: v vozlih nič, v hrbtih največ.

## Drugače: Bolj natančno

Zakaj so dovoljene le nekatere frekvence? Val gre od enega konca do drugega in nazaj, pot $2L$, in se dvakrat odbije z obratom faze, kar se izniči. Če se po tej poti ujame sam s seboj, torej če je $2L = n\lambda$, se odboji seštevajo in nihanje se okrepi. Pri drugih frekvencah se odboji med seboj izničijo. Pogoj $2L = n\lambda$ je isti kot $L = n\frac{\lambda}{2}$.

Če je en konec prost (cev, odprta na enem koncu, ali obroček na palici), je tam hrbet, na vpetem koncu pa vozel. Takrat gre na dolžino liho število četrtin valovne dolžine, $L = (2n-1)\frac{\lambda}{4}$, in manjkajo sode harmonske frekvence. To boš srečal pri zvoku.

## Preveri se

? Katera trditev o stoječem valovanju na struni je pravilna?
- Energija potuje od enega konca strune do drugega.
~ V stoječem valovanju energija ostaja ujeta med vozli. Vsak od obeh sestavnih valov jo sicer prenaša, a v nasprotni smeri, zato se prenosa izničita.
+ Sosednja vozla sta narazen pol valovne dolžine.
- Vsi delci strune nihajo z enako amplitudo.
~ Tako je pri potujočem valu. V stoječem je amplituda v vozlih nič, v hrbtih največja.
> Med vozloma je odsek, ki niha v eni smeri, sosednji v nasprotni; dva odseka skupaj sta $\lambda$.

? Struna je dolga $0{,}80\,\mathrm{m}$, hitrost valovanja na njej je $320\,\mathrm{m/s}$. Kolikšna je frekvenca drugega lastnega nihanja ($n = 2$)?
= 400 Hz | 1
~ 200 | To je osnovna frekvenca $\nu_1$. Drugo lastno nihanje ima $\nu_2 = 2\nu_1$.
~ 800 | Vzel si $\lambda = \frac{L}{2}$. Pri $n = 2$ je $\lambda = L = 0{,}80\,\mathrm{m}$.
> $\nu_2 = \frac{2 \cdot 320\,\mathrm{m/s}}{2 \cdot 0{,}80\,\mathrm{m}} = 400\,\mathrm{Hz}$.

? Ana je računala hitrost valovanja na struni s silo $50\,\mathrm{N}$, dolžino $0{,}5\,\mathrm{m}$ in maso $2\,\mathrm{g}$: $c = \sqrt{\frac{F\,l}{m}} = \sqrt{\frac{50 \cdot 0{,}5}{2}} \approx 3{,}5\,\mathrm{m/s}$. Kje je napaka?
- Formula je napačna, pravilno je $c = \sqrt{\frac{F\,m}{l}}$.
~ Formula je prava: večja masa na dolžino pomeni počasnejši val, zato je $m$ v imenovalcu.
+ Maso je vstavila v gramih; v kilogramih je $0{,}002\,\mathrm{kg}$ in $c \approx 112\,\mathrm{m/s}$.
- Napake ni, $3{,}5\,\mathrm{m/s}$ je običajna hitrost na struni.
~ Na napetih strunah so hitrosti od več deset do več sto metrov na sekundo. $3{,}5\,\mathrm{m/s}$ je hitrost hoje.
> $c = \sqrt{\frac{50\,\mathrm{N} \cdot 0{,}5\,\mathrm{m}}{0{,}002\,\mathrm{kg}}} = \sqrt{12\,500}\,\mathrm{m/s} \approx 112\,\mathrm{m/s}$.

? Struni A in B sta enako dolgi in nihata z isto frekvenco, kot kaže slika. Kako se primerjata hitrosti valovanja na njiju?
:::risba graf
opis: Dve enako dolgi struni v stoječem valovanju. Struna A zgoraj ima dva hrbta in tri vozle, struna B spodaj tri hrbte in štiri vozle.
x: 0 .. 3 | 0,5 | x
y: -2,6 .. 2,8 | 1 | y
oznake: ne
f: 1,4 + 0,8*sin(2*pi*x/3) | modra
f: 1,4 - 0,8*sin(2*pi*x/3) | modra črtkano
f: -1,4 + 0,8*sin(pi*x) | oranžna
f: -1,4 - 0,8*sin(pi*x) | oranžna črtkano
napis: 0; 2,5 | A | desno
napis: 0; -0,3 | B | desno
:::
- Hitrosti sta enaki, ker je frekvenca enaka.
~ Frekvenca je enaka, valovna dolžina pa ne. Hitrost je $c = \lambda\nu$.
- Na B je hitrost $1{,}5$-krat večja, ker ima več hrbtov.
~ Več hrbtov pri isti dolžini pomeni krajšo valovno dolžino, torej manjšo hitrost.
+ Na A je hitrost $1{,}5$-krat večja.
> A: $\lambda_A = L$; B: $\lambda_B = \frac{2L}{3}$. Pri istem $\nu$ je $\frac{c_A}{c_B} = \frac{\lambda_A}{\lambda_B} = 1{,}5$.

? Morski valovi v globoki vodi potujejo s hitrostjo $6{,}0\,\mathrm{m/s}$ in vpadajo pod kotom $40^\circ$ glede na pravokotnico na rob plitvine. V plitvini je hitrost $3{,}0\,\mathrm{m/s}$. Kolikšen je lomni kot v stopinjah?
= 18,7 ° | 0,3
~ 20 | Delil si kot namesto sinusa. Lomni zakon velja za $\sin\alpha$ in $\sin\beta$.
~ 80 | Kot si pomnožil z obrnjenim razmerjem hitrosti. Val v počasnejši vodi se zasuče *proti* pravokotnici, zato se kot zmanjša.
> $\sin\beta = \sin 40^\circ \cdot \frac{3{,}0}{6{,}0} \approx 0{,}321$, $\beta \approx 18{,}7^\circ$. Valovi se obrnejo proti obali.

:::simboli
\lambda | valovna dolžina | \lambda = \frac{c}{\nu} | m
\lambda_n | valovna dolžina $n$-tega lastnega nihanja | \lambda_n = \frac{2L}{n} | m
\nu | frekvenca | | Hz
\nu_n | $n$-ta lastna frekvenca strune | \nu_n = \frac{n\,c}{2L} | Hz
\nu_1 | osnovna frekvenca | \nu_1 = \frac{c}{2L} | Hz
n | zaporedno število lastnega nihanja (število hrbtov) | | – | $1, 2, 3, \dots$
c | hitrost valovanja | c = \sqrt{\frac{F}{\mu}} | m/s
L | dolžina strune med vpetima koncema | | m
F | sila, s katero je struna napeta | F = \mu c^2 | N
\mu | masa na enoto dolžine | \mu = \frac{m}{l} | kg/m
m | masa kosa strune | | kg
l | dolžina kosa strune z maso $m$ | | m
t_0 | nihajni čas | t_0 = \frac{1}{\nu} | s
\Delta x | premik oblike vala | \Delta x = c\,\Delta t | m
\Delta t | čas med slikama | | s
\alpha | vpadni kot | | ° | merjen od vpadne pravokotnice
\beta | lomni kot | | ° | merjen od vpadne pravokotnice
c_1 | hitrost v prvem sredstvu | | m/s
c_2 | hitrost v drugem sredstvu | | m/s
:::

<<RACUN
vrednost: 4.0/2.5 | 1.6
vrednost: 2.5*0.4 | 1
vrednost: sqrt(2000*12/2.4) | 100
vrednost: 100/(2*12) | 4.17
vrednost: 3*100/(2*12) | 12.5
vrednost: 2*12/3 | 8
vrednost: 1/12.5/4 | 0.02
vrednost: 2*30/3 | 20
vrednost: 20*2.0 | 40
vrednost: 1.2*40^2 | 1920
vrednost: 2*320/(2*0.80) | 400
vrednost: sqrt(50*0.5/0.002) | 111.8
vrednost: asin(sin(40*pi/180)*3/6)*180/pi | 18.75
vrednost: sqrt(1.21) | 1.1
>>
