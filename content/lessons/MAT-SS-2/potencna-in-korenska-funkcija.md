---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi škatlo enakih kock (sladkorne kocke, lesene kocke ali kocke za gradnjo) in zlagaj iz njih večje kocke. Za kocko z robom $2$ kocki jih porabiš $8$, za rob $3$ že $27$, za rob $4$ kar $64$. V primerjavi z eno samo kocko se je rob le početveril, kock pa je $64$-krat več.

Obrni vprašanje: imaš $50$ kock. Kako veliko polno kocko zgradiš? Odgovor ni $50 : 3$, ampak največje celo število, katerega tretja potenca ne preseže $50$: to je $3$, ker je $4^3 = 64$ že preveč. Prva naloga je **potenčna funkcija** $V = a^3$, druga pa njena obratna, **korenska funkcija** $a = \sqrt[3]{V}$. Obe uporabljajo mizarji, zidarji in polagalci ploščic: ko povečajo načrt, morajo vedeti, kako hitro rasteta ploščina in prostornina.

## Razlaga

**Potenčna funkcija** je funkcija s predpisom $f(x) = x^n$, kjer je eksponent $n$ celo število. Pri $n = 1$ dobimo premico $y = x$, pri $n = 0$ konstanto $1$ (za $x \ne 0$). Zanimivi so ostali eksponenti.

**Najprej opazuj.** Izračunaj nekaj vrednosti za tri zaporedne eksponente:

| $x$ | $x^2$ | $x^3$ | $x^4$ |
|---|---|---|---|
| $-2$ | $4$ | $-8$ | $16$ |
| $-1$ | $1$ | $-1$ | $1$ |
| $0$ | $0$ | $0$ | $0$ |
| $1$ | $1$ | $1$ | $1$ |
| $2$ | $4$ | $8$ | $16$ |

Stolpca $x^2$ in $x^4$ sta simetrična: $x$ in $-x$ dasta isto vrednost. Stolpec $x^3$ pa pri $-x$ zamenja predznak.

**Pravilo za sode eksponente.** Pri sodem $n \ge 2$ je $(-x)^n = x^n$, zato je funkcija **soda**: graf je simetričen glede na os $y$. Vrednosti niso nikoli negativne, $Z_f = [0, \infty)$. Graf gre skozi točke $(-1, 1)$, $(0, 0)$ in $(1, 1)$. Na $(-\infty, 0]$ pada, na $[0, \infty)$ narašča. Oblika spominja na parabolo $y = x^2$.

**Pravilo za lihe eksponente.** Pri lihem $n \ge 3$ je $(-x)^n = -x^n$, funkcija je **liha**: graf je simetričen glede na izhodišče. Funkcija povsod narašča in doseže vsa realna števila, $Z_f = \mathbb{R}$. Graf gre skozi $(-1, -1)$, $(0, 0)$ in $(1, 1)$.

:::premisli
Katera vrednost je večja: $0{,}5^2$ ali $0{,}5^4$? In $3^2$ ali $3^4$? Napovej, kaj to pomeni za graf $x^4$ v primerjavi z grafom $x^2$.
---
$0{,}5^2 = 0{,}25$ je večje od $0{,}5^4 = 0{,}0625$, pri $3$ pa je obratno ($9 < 81$). Med $-1$ in $1$ je graf $x^4$ bolj sploščen ob osi $x$, zunaj tega intervala pa strmejši. Grafa se sekata v $(-1, 1)$, $(0, 0)$ in $(1, 1)$.
:::

V simulaciji spodaj »Potenčne funkcije s celim eksponentom« zamenjaj eksponent z $2$ na $4$, nato s $3$ na $5$. Opazuj, kako se graf okoli izhodišča bolj splošči, zunaj intervala $[-1, 1]$ pa se dviga bolj strmo. Na koncu nastavi $n = -2$ in poišči asimptoti.

**Negativni eksponent.** Za $n > 0$ je

$$x^{-n} = \frac{1}{x^n}$$

Deliti z $0$ ne smemo, zato je $D_f = \mathbb{R} \setminus \{0\}$. Ko je $x$ blizu $0$, je $x^n$ po absolutni vrednosti zelo majhen, ulomek pa zelo velik: graf se ob osi $y$ dviga (pri lihem $n$ levo od nje spušča) čez vse meje. Ko se $x$ oddaljuje od $0$, gre vrednost proti $0$. Graf je **hiperbola** z dvema vejama. Premici, ki se jima veji poljubno približata, sta **asimptoti**: tukaj os $x$ ($y = 0$) in os $y$ ($x = 0$).

Tudi tu odloča parnost eksponenta:

- $x^{-2}$, $x^{-4}$, … so sode funkcije; obe veji ležita nad osjo $x$ in gresta skozi $(-1, 1)$ in $(1, 1)$.
- $x^{-1}$, $x^{-3}$, … so lihe funkcije; veji ležita v 1. in 3. kvadrantu in gresta skozi $(1, 1)$ in $(-1, -1)$.

**Korenska funkcija kot inverzna.** Inverzna funkcija obstaja le za **injektivno** funkcijo: tako, ki vsako svojo vrednost doseže pri enem samem $x$. Funkcija $x^3$ je injektivna na vsem $\mathbb{R}$, zato ima inverzno $\sqrt[3]{x}$, definirano za vsa realna števila: $\sqrt[3]{-8} = -2$, ker je $(-2)^3 = -8$.

:::premisli
Funkcija $f(x) = x^2$ da vrednost $9$. Kateri $x$ naj vrne njena inverzna funkcija? Kaj moramo storiti, da inverzno funkcijo sploh dobimo?
---
Tega ne more odločiti, ker $x^2$ ni injektivna: $f(-3) = f(3) = 9$, zato iz vrednosti $9$ ne vemo, ali je bil $x$ enak $3$ ali $-3$. Definicijsko območje zato zožimo na $[0, \infty)$. Tam $x^2$ narašča, inverzna funkcija je $\sqrt{x}$.
:::

Splošno: za lihi $n$ je inverzna funkcija od $x^n$ koren $\sqrt[n]{x}$ z $D = \mathbb{R}$. Za sodi $n$ vzamemo $x^n$ le na $[0, \infty)$; njen inverz $\sqrt[n]{x}$ ima $D = [0, \infty)$. Velja $\sqrt[n]{x} = x^{1/n}$ za $x \ge 0$.

**Slika v besedah.** Graf korena dobiš, ko graf potence zrcališ čez premico $y = x$: točka $(2, 8)$ na grafu $x^3$ preide v $(8, 2)$ na grafu $\sqrt[3]{x}$. Ker se $x$ in $y$ zamenjata, se zamenja tudi strmina: parabola je ob izhodišču položna, zato je $\sqrt{x}$ tam strm, nato pa vedno bolj položen.

V simulaciji spodaj »Korenska funkcija kot inverzna funkcija« nastavi $n = 3$ in opazuj, kako sta grafa potence in korena zrcalna čez premico $y = x$. Nato nastavi $n = 2$: levo od osi $y$ koren izgine.

Ker je $\sqrt{x}$ inverz le desne polovice parabole, velja $\sqrt{x^2} = |x|$, ne $x$.

**Transformacije.** Potence in korene premikamo in raztegujemo kot druge grafe. Graf $\sqrt{x - 2} + 1$ je graf $\sqrt{x}$, premaknjen za $2$ v desno in za $1$ navzgor; začne se v točki $(2, 1)$.

## Rešeni primeri

### Primer 1: lastnosti iz eksponenta

Za funkcijo $f(x) = x^{-3}$ določi definicijsko območje, zalogo vrednosti in sodost oziroma lihost. Izračunaj $f(2)$ in $f\left(-\tfrac{1}{2}\right)$.

**Podatki:** $f(x) = x^{-3}$, $x_1 = 2$, $x_2 = -\tfrac{1}{2}$
**Iščemo:** $D_f$, $Z_f$, simetrijo, $f(2)$, $f\left(-\tfrac{1}{2}\right)$

:::formula
$x^{-n} = \dfrac{1}{x^n}$; liha funkcija: $f(-x) = -f(x)$
:::

**Rešitev:**

1. $f(x) = \dfrac{1}{x^3}$, z $0$ ne smemo deliti, zato $D_f = \mathbb{R} \setminus \{0\}$.
2. Ulomek $\dfrac{1}{x^3}$ ni nikoli $0$, doseže pa vsa druga števila, zato $Z_f = \mathbb{R} \setminus \{0\}$.
3. $(-x)^3 = -x^3$, torej $f(-x) = -f(x)$: funkcija je liha, eksponent $-3$ je lih.
4. $f(2) = \dfrac{1}{2^3} = \dfrac{1}{8} = 0{,}125$.
5. $f\left(-\tfrac{1}{2}\right) = \dfrac{1}{\left(-\tfrac{1}{2}\right)^3} = \dfrac{1}{-\tfrac{1}{8}} = -8$; deljenje z ulomkom je množenje z obratno vrednostjo.
6. Odgovor: $D_f = Z_f = \mathbb{R} \setminus \{0\}$, funkcija je liha, $f(2) = 0{,}125$ in $f\left(-\tfrac{1}{2}\right) = -8$.

### Primer 2: inverzna funkcija s tretjim korenom

Poišči inverzno funkcijo k $f(x) = x^3 - 2$ in izračunaj $f^{-1}(6)$ ter $f^{-1}(-6)$.

**Podatki:** $f(x) = x^3 - 2$, $D_f = \mathbb{R}$
**Iščemo:** predpis $f^{-1}(x)$, vrednosti $f^{-1}(6)$ in $f^{-1}(-6)$

:::formula
Iz $y = f(x)$ izrazimo $x$, nato zamenjamo oznaki; inverz od $x^3$ je $\sqrt[3]{x}$.
:::

**Rešitev:**

1. Graf $f$ je graf $x^3$, premaknjen za $2$ navzdol; $f$ ostane injektivna, zato inverz obstaja.
2. $y = x^3 - 2$, prištejemo $2$: $x^3 = y + 2$.
3. Tretji koren obeh strani: $x = \sqrt[3]{y + 2}$, kar velja tudi za negativne $y + 2$.
4. Zamenjamo oznaki: $f^{-1}(x) = \sqrt[3]{x + 2}$, $D_{f^{-1}} = \mathbb{R}$.
5. $f^{-1}(6) = \sqrt[3]{8} = 2$; preizkus: $2^3 - 2 = 6$.
6. $f^{-1}(-6) = \sqrt[3]{-4} \approx -1{,}59$.
7. Odgovor: $f^{-1}(x) = \sqrt[3]{x + 2}$, $f^{-1}(6) = 2$ in $f^{-1}(-6) \approx -1{,}59$.

### Primer 3: zabojnik za pesek

Zidar zbije iz desk zabojnik v obliki kocke s prostornino $0{,}5\,\mathrm{m^3}$. Kako dolg mora biti notranji rob? Kolikokrat daljši rob potrebuje, če želi zabojnik z dvakrat večjo prostornino?

**Podatki:** $V_1 = 0{,}5\,\mathrm{m^3}$, $V_2 = 2 V_1 = 1\,\mathrm{m^3}$
**Iščemo:** rob $a_1$ in razmerje $\dfrac{a_2}{a_1}$

:::formula
$V = a^3$, zato $a = \sqrt[3]{V}$
:::

**Rešitev:**

1. Rob je inverzna funkcija prostornine: $a_1 = \sqrt[3]{0{,}5}\,\mathrm{m} \approx 0{,}794\,\mathrm{m}$.
2. Preizkus: $0{,}794^3 \approx 0{,}5$, kar se ujema.
3. Za $V_2 = 1\,\mathrm{m^3}$ je $a_2 = \sqrt[3]{1}\,\mathrm{m} = 1\,\mathrm{m}$.
4. Razmerje: $\dfrac{a_2}{a_1} = \dfrac{1}{0{,}794} \approx 1{,}26$, kar je $\sqrt[3]{2}$, ker se je prostornina podvojila.
5. Odgovor: notranji rob je približno $79\,\mathrm{cm}$. Za dvakrat večjo prostornino je rob le približno $1{,}26$-krat daljši, ne dvakrat.

### Primer 4: zdaj ti

Mizar mora izrezati pravokotno ploščo s ploščino $1{,}2\,\mathrm{m^2}$. Širina $b$ je odvisna od dolžine $a$. Kolikšna je širina pri dolžini $0{,}8\,\mathrm{m}$ in kolikšna pri $1{,}6\,\mathrm{m}$?

**Podatki:** $S = 1{,}2\,\mathrm{m^2}$, $a_1 = 0{,}8\,\mathrm{m}$, $a_2 = 1{,}6\,\mathrm{m}$
**Iščemo:** širini $b_1$ in $b_2$

:::formula
$S = a \cdot b$, zato $b = S \cdot a^{-1}$
:::

**Rešitev:**

1. Širina je potenčna funkcija dolžine z eksponentom $-1$, raztegnjena s faktorjem $1{,}2$; graf je veja hiperbole.
2. $b_1 = \dfrac{1{,}2\,\mathrm{m^2}}{0{,}8\,\mathrm{m}}$; izračunaj sam.
3. Pri $a_2$ je dolžina dvakrat večja. Napovej $b_2$, nato preveri:

:::premisli
Kolikšni sta $b_1$ in $b_2$?
---
$b_1 = 1{,}5\,\mathrm{m}$. Pri dvakrat daljši plošči je širina dvakrat manjša: $b_2 = 0{,}75\,\mathrm{m}$ (preizkus: $1{,}6 \cdot 0{,}75 = 1{,}2$).
:::

## Pogoste napake

- **»$x^{-2}$ je negativno.«** Učenec bere minus v eksponentu kot minus pred številom: $2^{-2} = -4$. Negativni eksponent pomeni obratno vrednost: $2^{-2} = \frac{1}{4}$. Graf $x^{-2}$ leži v celoti nad osjo $x$.
- **»Vsi grafi gredo skozi $(-1, 1)$.«** To velja le za sode eksponente. Pri lihem $n$ je $(-1)^n = -1$, graf gre skozi $(-1, -1)$. Pred risanjem preveri parnost eksponenta.
- **»$\sqrt{x^2} = x$« (napačno).** Za $x = -3$ dobimo $\sqrt{9} = 3$, ne $-3$. Koren je inverz le desne polovice parabole, zato $\sqrt{x^2} = |x|$.
- **»$\sqrt[3]{-8}$ ne obstaja.«** Prepoved negativnih števil velja za korene sode stopnje. Liha potenca je injektivna na vsem $\mathbb{R}$, zato $\sqrt[3]{-8} = -2$.
- **»Dvakrat večji rob, dvakrat več lesa.«** Prostornina raste s tretjo potenco: dvakrat daljši rob da $2^3 = 8$-krat večjo prostornino. Obratno pri podvojeni prostornini rob zraste le za faktor $\sqrt[3]{2} \approx 1{,}26$.

## Povzetek

- Potenčna funkcija: $f(x) = x^n$, $n \in \mathbb{Z}$.
- Sodi $n \ge 2$: soda funkcija, $Z_f = [0, \infty)$, graf skozi $(-1, 1)$ in $(1, 1)$. Lihi $n \ge 3$: liha, narašča, $Z_f = \mathbb{R}$, graf skozi $(-1, -1)$ in $(1, 1)$.
- Večji eksponent: na $(-1, 1)$ bolj sploščen graf, zunaj strmejši.
- Negativni eksponent: $x^{-n} = \frac{1}{x^n}$, $D_f = \mathbb{R} \setminus \{0\}$, hiperbola z asimptotama $x = 0$ in $y = 0$.
- $\sqrt[n]{x}$ je inverz od $x^n$; lihi $n$: $D = \mathbb{R}$; sodi $n$: le za $x \ge 0$, potenco zožimo na $[0, \infty)$. Graf zrcalimo čez $y = x$.
- $\sqrt{x^2} = |x|$; pri modeliranju: $V = a^3$ ima inverz $a = \sqrt[3]{V}$.

## Drugače: Korak za korakom s številkami

Graf korena lahko narišeš iz tabele potence, ne da bi karkoli korenil.

1. Zapiši tabelo za $y = x^3$:

| $x$ | $x^3$ |
|---|---|
| $-2$ | $-8$ |
| $-1$ | $-1$ |
| $0$ | $0$ |
| $1$ | $1$ |
| $2$ | $8$ |

2. Zamenjaj stolpca. Dobiš točke grafa $y = \sqrt[3]{x}$: $(-8, -2)$, $(-1, -1)$, $(0, 0)$, $(1, 1)$, $(8, 2)$.
3. Vriši jih in poveži. Med $-1$ in $1$ je graf strm, dlje od izhodišča pa zelo položen: da $y$ naraste z $1$ na $2$, mora $x$ zrasti z $1$ na $8$.
4. Za $\sqrt{x}$ vzameš le vrstice z $x \ge 0$ iz tabele $x^2$: $(0, 0)$, $(1, 1)$, $(4, 2)$, $(9, 3)$.

## Drugače: Kot zgodba

Polagalka ploščic Maja dobi naročilo za kvadratno teraso. Naročnik vpraša: »Če stranico podaljšamo z $2$ na $4$ metre, potrebujem dvakrat več ploščic?« Maja nariše kvadrat in ga razdeli na četrtine: štirikrat več. Ploščina je $a^2$, soda potenca; dolžina stranice ni nikoli negativna, zato šteje le desna polovica parabole.

Naslednji teden naročnik kupi $20\,\mathrm{m^2}$ ploščic po akciji in vpraša, kako veliko teraso bo s tem pokril. Maja zdaj računa nazaj, s korenom: $\sqrt{20} \approx 4{,}5$, torej stranico približno $4{,}5\,\mathrm{m}$. Potenca ji pove, koliko materiala potrebuje za dano mero, koren pa, kakšno mero dobi iz danega materiala. To sta inverzni funkciji.

## Preveri se

? Katera funkcija ima tabelo vrednosti $x$: $-2, -1, 1, 2$ in $y$: $\frac{1}{4}, 1, 1, \frac{1}{4}$?
- $f(x) = x^2$
~ $x^2$ je res soda, vendar da pri $x = 2$ vrednost $4$, ne $\frac{1}{4}$.
- $f(x) = x^{-1}$
~ $x^{-1}$ je liha: pri $x = -1$ da $-1$, v tabeli pa je $1$.
+ $f(x) = x^{-2}$
- $f(x) = -x^2$
~ Minus pred potenco da negativne vrednosti; tabela ima same pozitivne.
> $x^{-2} = \frac{1}{x^2}$ je soda: $f(\pm 1) = 1$ in $f(\pm 2) = \frac{1}{4}$.

? Približno koliko je $\sqrt[3]{30}$?
- $10$
~ Tretji koren ni deljenje s $3$: $10^3 = 1000$, kar je veliko preveč.
- $5{,}5$
~ To je približno kvadratni koren: $5{,}5^2 \approx 30$, a $5{,}5^3 \approx 166$.
+ $3{,}1$
- $2{,}5$
~ $2{,}5^3 \approx 15{,}6$, kar je polovica od $30$; ker je $30$ blizu $27$, je koren blizu $3$.
> $3^3 = 27$ in $4^3 = 64$, $30$ je malo nad $27$, zato je $\sqrt[3]{30}$ malo nad $3$ (približno $3{,}11$).

? Zakaj ima $x^3$ inverzno funkcijo na vsem $\mathbb{R}$, $x^2$ pa ne?
+ Ker je $x^3$ injektivna, $x^2$ pa ne: $(-2)^2 = 2^2$.
- Ker iz negativnih števil ne moremo koreniti.
~ To velja le za sode korene in zadeva definicijsko območje inverza, ne obstoja inverza. Odloča injektivnost.
- Ker je graf $x^3$ strmejši od grafa $x^2$.
~ Strmost ni pomembna. Inverz obstaja, kadar vsaka vrednost pripada le enemu $x$.
> Vodoravna premica $y = 4$ seka parabolo dvakrat, graf $x^3$ pa vsaka vodoravna premica le enkrat.

? Graf $f(x) = x^n$ s celim $n$ gre skozi točko $\left(2, \frac{1}{8}\right)$. Koliko je $n$?
- $3$
~ $2^3 = 8$, ne $\frac{1}{8}$; pozabil si, da ulomek pomeni obratno vrednost.
- $-8$
~ Eksponent ni vrednost funkcije: $2^{-8} = \frac{1}{256}$.
+ $-3$
- $-4$
~ $2^{-4} = \frac{1}{16}$; ulomek $\frac{1}{8}$ ustreza $2^3$ v imenovalcu.
> $2^{-3} = \frac{1}{2^3} = \frac{1}{8}$.

? Mizar izdela leseno kocko, nato še eno s trikrat daljšim robom. Kolikokrat več lesa porabi za drugo kocko?
- $3$-krat
~ Rob se poveča trikrat, prostornina pa raste s tretjo potenco roba.
- $9$-krat
~ $3^2 = 9$ je razmerje ploščin ene ploskve, ne prostornin.
+ $27$-krat
> $V = a^3$, zato $(3a)^3 = 27a^3$.

:::simboli
x | neodvisna spremenljivka | |
n | eksponent | | | celo število
f | potenčna funkcija | f(x) = x^n |
y | vrednost funkcije | y = f(x) |
a | rob kocke (v primeru 4 dolžina plošče) | a = \sqrt[3]{V} | m | zveza velja za kocko
a_1 | notranji rob prvega zabojnika (v primeru 4 prva dolžina plošče) | | m
a_2 | rob večjega zabojnika (v primeru 4 dvakrat daljša plošča) | | m
V | prostornina kocke | V = a^3 | m^3
V_1 | prostornina prvega zabojnika | | m^3
V_2 | dvakrat večja prostornina | V_2 = 2 V_1 | m^3
S | ploščina plošče | S = a \cdot b | m^2
b | širina plošče | b = S \cdot a^{-1} | m
:::
