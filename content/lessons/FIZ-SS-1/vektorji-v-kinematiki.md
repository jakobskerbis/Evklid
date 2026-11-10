---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na rob mize položi dva kovanca, enega tik ob drugem. Z ravnilom, ki ga držiš vodoravno, udari tako, da prvi kovanec odleti naravnost naprej, drugi pa le zdrsne čez rob in pade navpično. Poslušaj tla. Slišiš dva udarca ali enega?

Večina pričakuje, da bo hitri kovanec letel dlje časa. V resnici zaslišiš en sam »klik«. Še bolje je, če met posnameš s telefonom v počasnem posnetku in ga pregledaš sličico za sličico: kovanca padata vštric, čeprav eden leti daleč stran.

Pri vsakem gibanju v ravnini boš potreboval dve ideji. Prva: hitrost ima smer, zato hitrosti ne seštevamo vedno kot navadna števila. Druga, ki jo pokaže poskus s kovancema: vodoravno in navpično gibanje potekata neodvisno drug od drugega. S tem izračunaš, kam bo odneslo dron v vetru, kam pade telefon, ki zdrsne z mize, in kako hitro prileti na tla.

## Razlaga

**Staro: hitrosti v isti premici.** Dron leti s hitrostjo $8\,\text{m/s}$ glede na zrak. Če veter piha s hitrostjo $3\,\text{m/s}$ v smeri leta, je hitrost drona glede na tla $8 + 3 = 11\,\text{m/s}$. Če piha naravnost proti njemu, je $8 - 3 = 5\,\text{m/s}$. To je račun iz premega gibanja: hitrosti v isti premici seštevamo ali odštevamo.

**Novo: veter s strani.** Zdaj naj veter piha pravokotno na smer leta. Dron se zdaj ne giblje niti z $11$ niti s $5\,\text{m/s}$, pa tudi ne naravnost naprej, ampak poševno. V eni sekundi preleti $8\,\text{m}$ naprej in hkrati ga veter odnese $3\,\text{m}$ vstran. Narišimo to:

:::risba skica
opis: Sestavljanje premikov drona v eni sekundi. Navpična puščica 8 m je let naprej, z njenega konca gre vodoravna puščica 3 m, premik zaradi vetra. Poševna puščica od začetka do konca je dejanska pot. Puščice tvorijo pravokotni trikotnik.
območje: -3; -0,8 .. 6; 9
enota: 30
puščica: 0; 0 -> 0; 8 | 8 m | levo | modra
puščica: 0; 8 -> 3; 8 | 3 m | nad | modra
puščica: 0; 0 -> 3; 8 | dejanska pot | desno | oranžna
točka: 0; 0
:::

Navpična puščica je let drona. Na njen konec smo narisali vodoravno puščico, premik zaradi vetra. Poševna puščica od začetka do konca je dejanski premik. Trije premiki sestavljajo pravokotni trikotnik. Za poševno stranico velja Pitagorov izrek:

$$v = \sqrt{v_1^2 + v_2^2} = \sqrt{8^2 + 3^2}\,\text{m/s} \approx 8{,}5\,\text{m/s}$$

**Vektor.** Količina, ki ima poleg velikosti tudi smer, je **vektor**. Hitrost je vektor; rišemo jo s puščico, katere dolžina pove velikost. Dve hitrosti **sestavimo** tako, da drugo puščico narišemo z začetkom na koncu prve. Puščica od začetka prve do konca druge je **rezultanta**, skupna hitrost. Hitrosti, iz katerih je sestavljena, so njene **komponente**.

Tabela postavi staro in novo drugo ob drugo:

| smer obeh hitrosti | slika | velikost rezultante |
|---|---|---|
| isti smeri | $\to\to$ | $v_1 + v_2$ |
| nasprotni smeri | $\to\leftarrow$ | $\lvert v_1 - v_2 \rvert$ |
| pravokotni smeri | $\uparrow\to$ | $\sqrt{v_1^2 + v_2^2}$ |

Pri pravokotnih hitrostih je rezultanta vedno večja od vsake komponente, a manjša od njune vsote.

:::premisli
Cilj je $400\,\text{m}$ severno. Dron ves čas kaže proti severu in leti z $8\,\text{m/s}$, veter piha proti vzhodu. Napovej: bo $400\,\text{m}$ proti severu preletel prej, pozneje ali enako hitro kot v brezvetrju?
---
Enako hitro, po $50\,\text{s}$. Veter je pravokoten na sever, zato ne spremeni severne komponente hitrosti, ta ostane $8\,\text{m/s}$. Dron pa ne pristane na cilju, ampak vzhodno od njega.
:::

**Vodoravni met: dve znani gibanji hkrati.** Telo vržemo vodoravno s hitrostjo $v_0$, na primer telefon, ki zdrsne z roba mize. Njegovo gibanje spet razstavimo na dve komponenti in vsako primerjamo z gibanjem, ki ga že poznaš:

- **Vodoravno** ni nobenega pospeška (zračni upor zanemarimo). To je premo enakomerno gibanje: $v_x = v_0$ in $x = v_0 t$.
- **Navpično** telo pospešuje navzdol z $g$, začetna navpična hitrost pa je $0$. To je natanko prosti pad: $v_y = g t$ in $y = \dfrac{g t^2}{2}$, kjer je $y$ padec pod začetno višino.

Edina razlika od prostega pada je vodoravni premik. Zato kovanca padeta hkrati: navpično gibanje obeh je enako.

Tabela kaže lego telesa, vrženega vodoravno z $v_0 = 2\,\text{m/s}$, vsako desetinko sekunde:

| $t$ [s] | $x$ [m] | $y$ [m] | $v_y$ [m/s] |
|---|---|---|---|
| $0$ | $0$ | $0$ | $0$ |
| $0{,}1$ | $0{,}2$ | $0{,}05$ | $0{,}98$ |
| $0{,}2$ | $0{,}4$ | $0{,}20$ | $1{,}96$ |
| $0{,}3$ | $0{,}6$ | $0{,}44$ | $2{,}94$ |
| $0{,}4$ | $0{,}8$ | $0{,}78$ | $3{,}92$ |

Stolpec $x$ raste enakomerno, za $0{,}2\,\text{m}$ vsakič. Stolpec $y$ raste vedno hitreje, kot pri prostem padu. Če lege narišemo, dobimo krivuljo, ki se vse bolj sklanja navzdol: **parabolo**.

:::premisli
Telefon zdrsne z iste mize z dvakrat večjo hitrostjo. Kaj se zgodi s časom padanja in z razdaljo od mize, kjer pristane?
---
Čas ostane enak, ker je odvisen le od višine mize ($y = \dfrac{g t^2}{2}$ ne vsebuje $v_0$). Razdalja $x = v_0 t$ se podvoji, ker je čas enak in hitrost dvakrat večja.
:::

**Hitrost ob padcu.** Med letom sta komponenti hitrosti pravokotni: $v_x = v_0$ ostaja enaka, $v_y = g t$ raste. Velikost hitrosti dobimo z istim Pitagorovim izrekom kot pri dronu:

$$v = \sqrt{v_x^2 + v_y^2}$$

V simulaciji spodaj »Poševni met: komponente hitrosti« nastavi kot na najmanjšo vrednost (met je skoraj vodoraven) in začetno višino na $20\,\text{m}$. Med letom opazuj puščici komponent: vodoravna ostane enako dolga, navpična se enakomerno daljša.

## Rešeni primeri

### Primer 1: dron v bočnem vetru

Dron za snemanje leti s hitrostjo $6\,\text{m/s}$ proti severu glede na zrak. Veter piha s hitrostjo $2{,}5\,\text{m/s}$ proti vzhodu. Kolikšna je hitrost drona glede na tla?

**Podatki:** $v_1 = 6\,\text{m/s}$ (proti severu), $v_2 = 2{,}5\,\text{m/s}$ (proti vzhodu)
**Iščemo:** velikost rezultante $v$

:::formula
Hitrosti sta pravokotni: $v = \sqrt{v_1^2 + v_2^2}$
:::

**Rešitev:**

1. Smeri sta pravokotni, zato hitrosti ne seštejemo, ampak uporabimo Pitagorov izrek.
2. $v_1^2 + v_2^2 = 36 + 6{,}25 = 42{,}25$ (v $\text{m}^2/\text{s}^2$).
3. $v = \sqrt{42{,}25}\,\text{m/s} = 6{,}5\,\text{m/s}$.
4. Odgovor: dron se glede na tla giblje s hitrostjo $6{,}5\,\text{m/s}$, poševno: večinoma proti severu in nekoliko proti vzhodu.

### Primer 2: telefon zdrsne z mize

Telefon zdrsne z roba mize, visoke $0{,}80\,\text{m}$, s hitrostjo $1{,}5\,\text{m/s}$. Koliko časa pada in kako daleč od roba mize pristane?

**Podatki:** $h = 0{,}80\,\text{m}$, $v_0 = 1{,}5\,\text{m/s}$, $g = 9{,}81\,\text{m/s}^2$
**Iščemo:** čas padanja $t$ in vodoravno razdaljo $x$

:::formula
Navpično: $h = \dfrac{g t^2}{2}$, torej $t = \sqrt{\dfrac{2h}{g}}$. Vodoravno: $x = v_0 t$
:::

**Rešitev:**

1. Čas določa le navpično gibanje, ki je enako prostemu padu.
2. $t = \sqrt{\dfrac{2 \cdot 0{,}80\,\text{m}}{9{,}81\,\text{m/s}^2}} \approx 0{,}40\,\text{s}$.
3. Ves ta čas se telefon giblje vodoravno s stalno hitrostjo: $x = 1{,}5\,\text{m/s} \cdot 0{,}40\,\text{s} \approx 0{,}61\,\text{m}$ (z nezaokroženim časom $0{,}404\,\text{s}$).
4. Odgovor: telefon pada približno $0{,}40\,\text{s}$ in pristane približno $0{,}61\,\text{m}$ od roba mize.

### Primer 3: analiza posnetka

Učenec s telefonom posname žogico, ki se skotali s police. Iz posnetka razbere, da je polica visoka $1{,}25\,\text{m}$ in da žogica pristane $0{,}90\,\text{m}$ od roba police. S kolikšno hitrostjo se je skotalila s police in s kolikšno hitrostjo prileti na tla?

**Podatki:** $h = 1{,}25\,\text{m}$, $x = 0{,}90\,\text{m}$, $g = 9{,}81\,\text{m/s}^2$
**Iščemo:** začetno hitrost $v_0$ in hitrost ob padcu $v$

:::formula
$t = \sqrt{\dfrac{2h}{g}}$, $v_0 = \dfrac{x}{t}$, $v_y = g t$, $v = \sqrt{v_0^2 + v_y^2}$
:::

**Rešitev:**

1. Najprej čas iz višine, ker ga $v_0$ ne spremeni: $t = \sqrt{\dfrac{2 \cdot 1{,}25\,\text{m}}{9{,}81\,\text{m/s}^2}} \approx 0{,}505\,\text{s}$.
2. Vodoravno je gibanje enakomerno, zato $v_0 = \dfrac{0{,}90\,\text{m}}{0{,}505\,\text{s}} \approx 1{,}78\,\text{m/s}$.
3. Navpična komponenta ob padcu: $v_y = 9{,}81\,\text{m/s}^2 \cdot 0{,}505\,\text{s} \approx 4{,}95\,\text{m/s}$.
4. Komponenti sta pravokotni: $v = \sqrt{(1{,}78\,\text{m/s})^2 + (4{,}95\,\text{m/s})^2} \approx 5{,}3\,\text{m/s}$.
5. Odgovor: žogica se je skotalila s hitrostjo približno $1{,}8\,\text{m/s}$, na tla pa prileti s hitrostjo približno $5{,}3\,\text{m/s}$, večinoma navzdol.

### Primer 4: zdaj ti

Čoln na daljinsko upravljanje pluje s hitrostjo $4\,\text{m/s}$ glede na vodo, ves čas usmerjen pravokotno čez reko. Reka je široka $24\,\text{m}$ in teče s hitrostjo $3\,\text{m/s}$. Koliko časa potrebuje čoln čez reko, za koliko ga tok odnese navzdol in kolikšna je njegova hitrost glede na breg?

**Podatki:** $v_1 = 4\,\text{m/s}$ (čez reko), $v_2 = 3\,\text{m/s}$ (tok reke), $d = 24\,\text{m}$
**Iščemo:** čas $t$, zanos $s$ in hitrost $v$ glede na breg

:::formula
$t = \dfrac{d}{v_1}$, $s = v_2 t$, $v = \sqrt{v_1^2 + v_2^2}$
:::

**Rešitev:**

1. Čas prečkanja določa samo komponenta čez reko, tok nanjo ne vpliva: $t = \dfrac{24\,\text{m}}{4\,\text{m/s}} = 6\,\text{s}$.
2. Ves ta čas tok nosi čoln vzdolž reke s hitrostjo $3\,\text{m/s}$.
3. Izračunaj zanos in hitrost glede na breg sam, nato preveri:

:::premisli
Za koliko tok odnese čoln in kolikšna je njegova hitrost glede na breg?
---
Zanos: $s = 3\,\text{m/s} \cdot 6\,\text{s} = 18\,\text{m}$ navzdol po reki. Hitrost: $v = \sqrt{16 + 9}\,\text{m/s} = 5\,\text{m/s}$.
:::

## Pogoste napake

- **Hitrosti v različnih smereh seštevamo kot števila.** Dron z $8\,\text{m/s}$ v bočnem vetru s $6\,\text{m/s}$ nima hitrosti $14\,\text{m/s}$. Seštevanje velja le za isto smer. Pri pravokotnih hitrostih uporabi Pitagorov izrek: $\sqrt{64 + 36} = 10\,\text{m/s}$.
- **»Hitreje vrženo telo dlje pada.«** Občutek pravi, da hitri kovanec »lebdi« dlje. Čas padanja pa je odvisen le od višine, ker je navpično gibanje pri vodoravnem metu enako prostemu padu. Večja $v_0$ poveča samo domet.
- **»Vodoravna hitrost med letom pojema.«** Brez zračnega upora nobena sila ne zavira vodoravnega gibanja, zato $v_x = v_0$ ostane enaka do tal. Spreminja se le $v_y$.
- **Hitrost ob padcu je samo $g t$ (ali samo $v_0$).** Telo ima ob padcu obe komponenti hkrati. Velikost hitrosti je $\sqrt{v_0^2 + (g t)^2}$, torej večja od vsake posebej.
- **Mešanje smeri v enačbah.** Kdo zapiše $x = \dfrac{g t^2}{2}$ ali $y = v_0 t$. Vsaka komponenta ima svojo enačbo: vodoravno brez pospeška, navpično s pospeškom $g$.

## Povzetek

- Hitrost je vektor: ima velikost in smer, rišemo jo s puščico.
- Hitrosti v isti smeri seštejemo, v nasprotnih odštejemo, pri pravokotnih uporabimo Pitagorov izrek: $v = \sqrt{v_1^2 + v_2^2}$.
- Pravokotni komponenti gibanja sta neodvisni: ena ne spremeni časa ali hitrosti v drugi smeri.
- Vodoravni met: vodoravno $v_x = v_0$, $x = v_0 t$; navpično kot prosti pad, $v_y = g t$, $y = \dfrac{g t^2}{2}$.
- Čas padanja je $t = \sqrt{\dfrac{2h}{g}}$ in ni odvisen od $v_0$; domet je $x = v_0 t$.
- Hitrost ob padcu: $v = \sqrt{v_0^2 + (g t)^2}$; tir je parabola.

## Drugače: Na sliki

Predstavljaj si stroboskopsko sliko vodoravnega meta: telo fotografiramo vsako desetinko sekunde in vse lege narišemo na isto sliko. Ob njej narišemo še senci: eno na tleh, drugo na steni.

- **Senca na tleh** (vodoravna komponenta): pike so enako razmaknjene, vsakič za $0{,}2\,\text{m}$ pri $v_0 = 2\,\text{m/s}$. Senca se giblje enakomerno.
- **Senca na steni** (navpična komponenta): razmiki med pikami rastejo v razmerju $1 : 3 : 5 : 7$, natanko kot pri prostem padu.
- **Pike same** ležijo na paraboli. Če ob pikah narišemo še telo, ki prosto pade z iste višine, sta ob vsakem blisku na isti višini.

Vodoravni met je torej le sestavljanje dveh senc, ki jih že poznaš.

## Drugače: Iz vsakdanjega življenja

Na vlaku, ki enakomerno vozi, vrži ključe navpično navzgor. Padejo ti nazaj v roko, ne nekaj metrov za tabo. Ključi imajo poleg navpične še vodoravno hitrost vlaka in jo ohranijo ves čas leta, tako kot ti.

Opazovalec na peronu vidi isti met drugače: ključi letijo po loku. Za njega je to sestavljeno gibanje, vodoravno enakomerno in navpično pospešeno. Tudi letalo v bočnem vetru in plavalec, ki ga reka odnaša, sta primera sestavljanja hitrosti: hitrost glede na tla je rezultanta lastne hitrosti in hitrosti zraka ali vode.

## Preveri se

? Telo vržemo vodoravno s hitrostjo $3\,\text{m/s}$. Katera vrstica pravilno kaže komponenti hitrosti ob časih $0$, $1$ in $2\,\text{s}$?
- $v_x$: $3$; $2$; $1\,\text{m/s}$ in $v_y$: $0$; $9{,}8$; $19{,}6\,\text{m/s}$
~ Vodoravna hitrost ne pojema: brez zračnega upora vodoravno ni nobenega pospeška.
+ $v_x$: $3$; $3$; $3\,\text{m/s}$ in $v_y$: $0$; $9{,}8$; $19{,}6\,\text{m/s}$
- $v_x$: $3$; $3$; $3\,\text{m/s}$ in $v_y$: $0$; $4{,}9$; $19{,}6\,\text{m/s}$
~ $4{,}9$ in $19{,}6$ sta padca v metrih ($\dfrac{g t^2}{2}$), ne hitrosti. Hitrost $v_y = g t$ raste enakomerno.
> Vodoravno je gibanje enakomerno ($v_x = 3\,\text{m/s}$), navpično kot prosti pad ($v_y = g t$: $0$; $9{,}8$; $19{,}6\,\text{m/s}$).

? Zakaj kovanca, od katerih eden pade navpično z mize, drugi pa odleti vodoravno, prileteta na tla hkrati?
- Ker sta enako težka.
~ Masa tu ni odločilna: tudi kovanca različnih mas bi padla hkrati, saj vsa telesa padajo z enakim pospeškom $g$.
+ Ker imata oba na začetku navpično hitrost $0$ in navpično pospešujeta z enakim $g$.
- Ker se vodoravni kovanec giblje hitreje in s tem nadomesti daljšo pot.
~ Vodoravna hitrost ne vpliva na navpično gibanje. Komponenti sta neodvisni.
> Navpično gibanje obeh je prosti pad z iste višine, zato je čas padanja enak. Vodoravna hitrost vpliva le na to, kje kovanec pristane.

? Telefon pade z mize, visoke $0{,}8\,\text{m}$. Približno koliko časa pada?
- približno $0{,}08\,\text{s}$
~ To je $\dfrac{h}{g}$. Pri padu se višina veča s kvadratom časa, zato potrebuješ $t = \sqrt{\dfrac{2h}{g}}$.
- približno $0{,}16\,\text{s}$
~ To je $\dfrac{2h}{g}$, torej $t^2$. Na koncu manjka še koren.
+ približno $0{,}4\,\text{s}$
- približno $1\,\text{s}$
~ V eni sekundi telo prosto pade skoraj $5\,\text{m}$, kar je daleč več od višine mize.
> $t = \sqrt{\dfrac{2 \cdot 0{,}8\,\text{m}}{9{,}81\,\text{m/s}^2}} \approx 0{,}4\,\text{s}$. Pri vsakdanjih višinah miz so časi padanja pod pol sekunde.

? Telefon zdrsne z mize in pristane $0{,}5\,\text{m}$ od roba po $0{,}4\,\text{s}$. S kolikšno hitrostjo je zdrsnil z mize?
- $0{,}2\,\text{m/s}$
~ To je $x \cdot t$. Hitrost je pot, deljena s časom: $v_0 = \dfrac{x}{t}$.
+ $1{,}25\,\text{m/s}$
- $4{,}1\,\text{m/s}$
~ To je velikost hitrosti ob padcu, ki vsebuje tudi navpično komponento. Začetna hitrost je samo vodoravna.
> Vodoravno je gibanje enakomerno: $v_0 = \dfrac{0{,}5\,\text{m}}{0{,}4\,\text{s}} = 1{,}25\,\text{m/s}$.

? Trajekt pluje s hitrostjo $5\,\text{m/s}$. Potnik hodi pravokotno čez krov s hitrostjo $1{,}2\,\text{m/s}$. Kolikšna je hitrost potnika glede na obalo?
- $6{,}2\,\text{m/s}$
~ Hitrosti seštejemo le, če kažeta v isto smer. Tu sta pravokotni.
- $3{,}8\,\text{m/s}$
~ Odštevamo le nasprotni hitrosti. Pravokotni hitrosti dasta rezultanto, večjo od vsake posebej.
+ približno $5{,}1\,\text{m/s}$
> $v = \sqrt{(5\,\text{m/s})^2 + (1{,}2\,\text{m/s})^2} = \sqrt{26{,}44}\,\text{m/s} \approx 5{,}1\,\text{m/s}$.

:::simboli
v | velikost rezultantne hitrosti | v = \sqrt{v_x^2 + v_y^2} | m/s | za pravokotni hitrosti
v_1 | hitrost drona glede na zrak (čolna glede na vodo) | | m/s
v_2 | hitrost vetra (toka reke) | | m/s
v_x | vodoravna komponenta hitrosti | | m/s | pri vodoravnem metu ves čas v₀
v_y | navpična komponenta hitrosti | v_y = g t | m/s
v_0 | začetna (vodoravna) hitrost | v_0 = \dfrac{x}{t} | m/s
h | višina, s katere telo pade | h = \dfrac{g t^2}{2} | m
g | težni pospešek | | m/s^2 | približno 9,81 m/s²
t | čas | t = \sqrt{\dfrac{2h}{g}} | s
x | vodoravna razdalja (domet) | x = v_0 t | m
d | širina reke | | m
s | zanos čolna ob toku | s = v_2 t | m
:::
