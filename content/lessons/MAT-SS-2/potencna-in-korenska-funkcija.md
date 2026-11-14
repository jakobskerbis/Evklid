---
stanje: preverjeno
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

Enako ravnamo s potencami. Graf $y = a \cdot (x - p)^n + q$ dobiš iz grafa $x^n$ tako, da ga raztegneš s faktorjem $a$ v smeri osi $y$ (pri $a < 0$ še prezrcališ čez os $x$), nato pa premakneš za $p$ v desno in za $q$ navzgor. Točka $(0, 0)$ preide v $(p, q)$: pri lihem $n$ je to novo središče simetrije, pri $n = 2$ teme. Pri negativnem eksponentu se premakneta tudi asimptoti, njuni enačbi sta $x = p$ in $y = q$. Zato je $D = \mathbb{R} \setminus \{p\}$, vrednosti $q$ pa funkcija ne doseže (Primer 6).

**Potenčna odvisnost ali premo sorazmerje?** Količina $y$ je **potenčno odvisna** od količine $x$, kadar velja $y = c \cdot x^n$ s stalnima $c$ in $n$. Premo sorazmerje $y = c \cdot x$ je le poseben primer z $n = 1$, obratno sorazmerje $y = \dfrac{c}{x}$ pa primer z $n = -1$. Razlika se najlepše vidi, ko $x$ podvojimo:

$$c \cdot (2x)^n = 2^n \cdot c \cdot x^n$$

Pri premem sorazmerju se $y$ le podvoji, pri $V = a^3$ se poveča $8$-krat, pri $y = c \cdot x^{-2}$ pa pade na četrtino.

Iz tabele potenčno odvisnost prepoznaš po stalnem količniku. Pri premem sorazmerju je stalen količnik $\frac{y}{x}$, pri potenčni odvisnosti z eksponentom $n$ pa količnik $\frac{y}{x^n}$. Mizar izdela lesene kocke z robom $1$, $2$ in $3\,\mathrm{dm}$, ki tehtajo $0{,}6$; $4{,}8$ in $16{,}2\,\mathrm{kg}$. Količniki $\frac{m}{a}$ so $0{,}6$; $2{,}4$ in $5{,}4$, torej masa ni premo sorazmerna z robom. Količniki $\frac{m}{a^3}$ pa so vsi enaki $0{,}6$: masa je potenčno odvisna od roba, $m = 0{,}6 \cdot a^3$ (rob v dm, masa v kg).

Pozor: skozi $(0, 0)$ gre graf vsake potence $x^n$ z $n \ge 1$, a le pri $n = 1$ je to premica.

**Modeliranje in izbira modela.** Ko pojav opišemo s funkcijo, ga **modeliramo**. Potenčni model $y = c \cdot x^n$ postavimo in preverimo v treh korakih:

1. **Eksponent.** Dobimo ga iz razmisleka (ploščina raste s kvadratom dolžine, prostornina s tretjo potenco) ali iz podatkov: če se pri podvojenem $x$ vrednost $y$ pomnoži s $4$, je $2^n = 4$ in $n = 2$.
2. **Koeficient.** Iz enega para podatkov izračunamo $c = \dfrac{y}{x^n}$.
3. **Kritična presoja.** Model preverimo na *vseh* podatkih, ne le na tistih, iz katerih smo ga postavili. Premislimo, ali so napovedi smiselne: negativna dolžina ali masa pomeni, da model odpove. Zapišemo še, da velja le za razmere, v katerih smo merili.

Skozi dve točki gre premica, pa tudi parabola in še marsikatera krivulja, zato dve meritvi ne zadoščata za izbiro modela. Izberemo model, ki se ujema z vsemi podatki in ima smisel, kot v Primeru 5.

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

### Primer 5: zavorna pot – kateri model?

Inštruktor vožnje je na suhi cesti večkrat izmeril zavorno pot avtomobila (od začetka zaviranja do ustavitve). Poenostavljena (zaokrožena) povprečja pri hitrostih $30$, $60$, $90$ in $120\,\mathrm{km/h}$ so $4{,}5$; $18$; $40{,}5$ in $72\,\mathrm{m}$. Jan je iz prvih dveh meritev postavil linearni model. Je zavorna pot premo sorazmerna s hitrostjo? Preveri Janov model, postavi boljšega in z njim oceni zavorno pot pri $50\,\mathrm{km/h}$. Kdaj model velja?

**Podatki:** meritve $(v, s)$: $(30; 4{,}5)$; $(60; 18)$; $(90; 40{,}5)$; $(120; 72)$, $v$ v km/h, $s$ v m; ocena pri $v = 50\,\mathrm{km/h}$
**Iščemo:** premo sorazmerje ali ne, presojo linearnega modela, potenčni model $s = c \cdot v^n$, zavorno pot pri $50\,\mathrm{km/h}$

:::formula
Premo sorazmerje: stalen količnik $\dfrac{s}{v}$. Potenčni model $s = c \cdot v^n$: pri podvojeni hitrosti se pot pomnoži z $2^n$; $c = \dfrac{s}{v^n}$.
:::

**Rešitev:**

1. Količniki $\dfrac{s}{v}$ so $\dfrac{4{,}5}{30} = 0{,}15$; $\dfrac{18}{60} = 0{,}3$; $\dfrac{40{,}5}{90} = 0{,}45$ in $\dfrac{72}{120} = 0{,}6$. Niso stalni, zato zavorna pot ni premo sorazmerna s hitrostjo.
2. Janova premica skozi $(30; 4{,}5)$ in $(60; 18)$ ima smerni koeficient $k = \dfrac{18 - 4{,}5}{60 - 30} = 0{,}45$, njen predpis je $s = 0{,}45 \cdot v - 9$.
3. Preizkus pri $90\,\mathrm{km/h}$: $0{,}45 \cdot 90 - 9 = 31{,}5$, izmerili pa so $40{,}5\,\mathrm{m}$. Pri $10\,\mathrm{km/h}$ bi bila pot $0{,}45 \cdot 10 - 9 = -4{,}5$ metra, kar je nesmiselno. Linearni model zavrnemo.
4. Ko se hitrost podvoji (s $30$ na $60$ in s $60$ na $120\,\mathrm{km/h}$), se pot početveri: $4 \cdot 4{,}5 = 18$ in $4 \cdot 18 = 72$. Iz $2^n = 4$ sledi $n = 2$.
5. $c = \dfrac{4{,}5}{30^2} = \dfrac{4{,}5}{900} = 0{,}005$, model je $s = 0{,}005 \cdot v^2$.
6. Preizkus: $0{,}005 \cdot 90^2 = 40{,}5$ in $0{,}005 \cdot 120^2 = 72$. Model se ujema z vsemi meritvami, pri $v = 0$ pa smiselno da pot $0$.
7. Ocena: $0{,}005 \cdot 50^2 = 12{,}5$.
8. Odgovor: zavorna pot ni premo sorazmerna s hitrostjo, linearni model odpove. Model $s = 0{,}005 \cdot v^2$ da pri $50\,\mathrm{km/h}$ približno $12{,}5\,\mathrm{m}$. Velja le za ta avtomobil na suhi cesti med $30$ in $120\,\mathrm{km/h}$; na mokri cesti je $c$ večji, zunaj meritev pa je napoved le groba ocena.

:::risba graf
opis: Izmerjene zavorne poti so štiri točke: (30; 4,5), (60; 18), (90; 40,5) in (120; 72). Črtkana premica s = 0,45v − 9 gre skozi prvi dve točki, pri 90 km/h je le na 31,5 m, pod tretjo točko, pri hitrostih pod 20 km/h pa pade pod vodoravno os. Polna krivulja s = 0,005v² gre skozi vse štiri točke.
x: 0 .. 130 | 30 | v (km/h)
y: -10 .. 90 | 10 | s (m)
f: 0.45*x - 9 | oranžna črtkano | 0 .. 130
f: 0.005*x^2 | modra debelo | 0 .. 130
točka: 30; 4,5
točka: 60; 18
točka: 90; 40,5 | (90; 40,5) | levo
točka: 120; 72 | (120; 72) | levo
napis: 105; 30 | linearni model | sredina | oranžna
napis: 85; 65 | s = 0,005v^2 | sredina | modra
podnapis: Polna krivulja (potenčni model) gre skozi vse meritve, črtkana premica (linearni model) le skozi prvi dve.
:::

### Primer 6: graf premaknjene potence

Nariši graf funkcije $f(x) = \dfrac{2}{x - 1} - 1$ in ga analiziraj: definicijsko območje, asimptoti, zaloga vrednosti, presečišči z osema in monotonost.

**Podatki:** $f(x) = \dfrac{2}{x - 1} - 1$, torej $f(x) = 2 \cdot (x - 1)^{-1} - 1$
**Iščemo:** graf, $D_f$, asimptoti, $Z_f$, ničlo, presečišče z osjo $y$, intervale monotonosti

:::formula
Graf $y = a \cdot (x - p)^n + q$: graf $x^n$ raztegnemo s faktorjem $a$ v smeri osi $y$ ter premaknemo za $p$ v desno in za $q$ navzgor; pri negativnem $n$ imata asimptoti enačbi $x = p$ in $y = q$.
:::

**Rešitev:**

1. Osnovni graf je hiperbola $y = x^{-1}$ z vejama v 1. in 3. kvadrantu.
2. Faktor $2$ jo raztegne v smeri osi $y$: $(1, 1)$ preide v $(1, 2)$. Premik za $1$ v desno in za $1$ navzdol prestavi $(1, 2)$ v $(2, 1)$, središče $(0, 0)$ pa v $(1, -1)$.
3. Asimptoti imata enačbi $x = 1$ in $y = -1$. Zato je $D_f = \mathbb{R} \setminus \{1\}$. Ulomek $\frac{2}{x - 1}$ ni nikoli $0$, doseže pa vsa druga števila, zato je $Z_f = \mathbb{R} \setminus \{-1\}$.
4. Ničla je rešitev enačbe $\dfrac{2}{x - 1} = 1$: $x - 1 = 2$, torej $x = 3$.
5. Presečišče z osjo $y$: $f(0) = \dfrac{2}{-1} - 1 = -3$, točka $(0, -3)$.
6. Še nekaj točk: $f(-1) = -2$; $f(2) = 1$; $f(5) = -0{,}5$.
7. Funkcija $x^{-1}$ pada na $(-\infty, 0)$ in na $(0, \infty)$; razteg s pozitivnim faktorjem in premiki tega ne spremenijo. Zato $f$ pada na $(-\infty, 1)$ in na $(1, \infty)$, na vsem $D_f$ pa ne: $f(0) = -3 < f(2) = 1$.
8. Odgovor: hiperbola s središčem $(1, -1)$ in asimptotama $x = 1$, $y = -1$; $D_f = \mathbb{R} \setminus \{1\}$, $Z_f = \mathbb{R} \setminus \{-1\}$, ničla $x = 3$, presečišče z osjo $y$ je $(0, -3)$, funkcija pada na obeh intervalih.

:::risba graf
opis: Graf funkcije f(x) = 2/(x − 1) − 1 za x od −4 do 6. Črtkani premici sta asimptoti x = 1 in y = −1, sekata se v središču (1, −1). Leva veja leži levo spodaj od središča in gre skozi točki (−1, −2) in (0, −3). Desna veja leži desno zgoraj, gre skozi točki (2, 1) in (3, 0) in se na desni približuje asimptoti y = −1 od zgoraj.
x: -4 .. 6 | 1 | x
y: -6 .. 5 | 1 | y
f: 2/(x-1) - 1 | modra debelo | -4 .. 0,59
f: 2/(x-1) - 1 | modra debelo | 1,36 .. 6
črta: 1; -6 -> 1; 5 | oranžna črtkano
črta: -4; -1 -> 6; -1 | oranžna črtkano
točka: 1; -1 | (1, −1) | pod desno | oranžna
točka: -1; -2 | (−1, −2) | levo
točka: 0; -3 | (0, −3) | levo
točka: 2; 1 | (2, 1) | nad desno
točka: 3; 0 | (3, 0) | nad desno
podnapis: Hiperbola y = 2/(x − 1) − 1 s središčem (1, −1); črtkani premici sta asimptoti.
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
- $y = a \cdot (x - p)^n + q$: $(0, 0)$ preide v $(p, q)$; pri $n < 0$ imata asimptoti enačbi $x = p$ in $y = q$.
- $y = c \cdot x^n$: količnik $\frac{y}{x^n}$ je stalen, podvojeni $x$ pomnoži $y$ z $2^n$; premo sorazmerje ima $n = 1$. Model preveri na vseh podatkih.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Dana je funkcija $g(x) = (x - 1)^{-2} + 2$. Zapiši njeno definicijsko območje, zalogo vrednosti in enačbi obeh asimptot.

**Rešitev:**

1. $g(x) = \dfrac{1}{(x - 1)^2} + 2$; graf funkcije $g$ je graf funkcije $y = x^{-2}$, premaknjen za $1$ v desno in za $2$ navzgor.
2. Imenovalec je $0$ pri $x = 1$, zato je $D_g = \mathbb{R} \setminus \{1\}$.
3. Funkcija $y = x^{-2}$ ima zalogo vrednosti $(0, \infty)$; premik za $2$ navzgor da $Z_g = (2, \infty)$.
4. Asimptoti funkcije $y = x^{-2}$ sta $x = 0$ in $y = 0$; po premiku sta to premici $x = 1$ in $y = 2$.
5. Odgovor: $D_g = \mathbb{R} \setminus \{1\}$, $Z_g = (2, \infty)$, asimptoti sta $x = 1$ in $y = 2$.

**Točkovanje:** 1 točka za $D_g = \mathbb{R} \setminus \{1\}$, 1 točka za $Z_g = (2, \infty)$, 1 točka za obe asimptoti $x = 1$ in $y = 2$.

### Naloga 2: krajša strukturirana naloga, 7 točk, pola 2 (z računalom)

Dijaki so merili nihajni čas $T$ nihala v odvisnosti od dolžine vrvice $l$. Izmerjene čase so zaokrožili na desetinko sekunde:

| $l$ (m) | $0{,}25$ | $1{,}00$ | $2{,}25$ | $4{,}00$ |
|---|---|---|---|---|
| $T$ (s) | $1{,}0$ | $2{,}0$ | $3{,}0$ | $4{,}0$ |

a) Utemelji, da nihajni čas ni premo sorazmeren z dolžino vrvice. (2 točki)
b) Pokaži, da podatki ustrezajo modelu $T = c \cdot \sqrt{l}$, in določi konstanto $c$. (2 točki)
c) Po modelu izračunaj nihajni čas nihala z dolžino $1{,}5\,\mathrm{m}$. Rezultat zaokroži na stotinko sekunde. (1 točka)
d) Iz modela izrazi $l$ kot funkcijo $T$ in izračunaj dolžino nihala z nihajnim časom $1{,}5\,\mathrm{s}$. Rezultat zaokroži na centimeter. (2 točki)

**Rešitev:**

1. a) Pri premem sorazmerju bi bil količnik $\dfrac{T}{l}$ stalen. Iz tabele je $\dfrac{1{,}0}{0{,}25} = 4$; $\dfrac{2{,}0}{1{,}00} = 2$; $\dfrac{3{,}0}{2{,}25} \approx 1{,}33$ in $\dfrac{4{,}0}{4{,}00} = 1$.
2. a) Količnik ni stalen: ko se dolžina poveča s $1\,\mathrm{m}$ na $4\,\mathrm{m}$ (štirikrat), se nihajni čas le podvoji. Zato $T$ ni premo sorazmeren z $l$.
3. b) Korenimo dolžine: $\sqrt{0{,}25} = 0{,}5$; $\sqrt{1} = 1$; $\sqrt{2{,}25} = 1{,}5$; $\sqrt{4} = 2$. Količniki $\dfrac{T}{\sqrt{l}}$ so $\dfrac{1{,}0}{0{,}5} = \dfrac{2{,}0}{1} = \dfrac{3{,}0}{1{,}5} = \dfrac{4{,}0}{2} = 2$, torej stalni.
4. b) Podatki ustrezajo modelu $T = 2\sqrt{l}$, konstanta je $c = 2$ (za $l$ v metrih in $T$ v sekundah).
5. c) $T = 2\sqrt{1{,}5} \approx 2{,}4495$, torej približno $2{,}45\,\mathrm{s}$.
6. d) Iz $T = 2\sqrt{l}$ dobimo $\sqrt{l} = \dfrac{T}{2}$ in po kvadriranju $l = \dfrac{T^2}{4}$. Dolžina je potenčna funkcija nihajnega časa z eksponentom $2$, inverzna h korenski funkciji $T = 2\sqrt{l}$.
7. d) Za $T = 1{,}5\,\mathrm{s}$: $l = \dfrac{1{,}5^2}{4} = \dfrac{2{,}25}{4} = 0{,}5625\,\mathrm{m}$, torej približno $56\,\mathrm{cm}$.
8. Odgovor: količnik $\frac{T}{l}$ ni stalen; model je $T = 2\sqrt{l}$; nihalo z dolžino $1{,}5\,\mathrm{m}$ ima nihajni čas približno $2{,}45\,\mathrm{s}$; $l = \frac{T^2}{4}$, za $T = 1{,}5\,\mathrm{s}$ je $l \approx 56\,\mathrm{cm}$.

**Točkovanje:** a) 1 točka za izračunane količnike $\frac{T}{l}$ (ali primerjavo štirikratne dolžine z dvakratnim časom), 1 točka za sklep, da količnik ni stalen; b) 1 točka za stalni količnik $\frac{T}{\sqrt{l}}$, 1 točka za $c = 2$; c) 1 točka za $2{,}45\,\mathrm{s}$; d) 1 točka za $l = \frac{T^2}{4}$, 1 točka za $56\,\mathrm{cm}$.

### Ustno vprašanje 1

:::premisli
Opiši lastnosti potenčne funkcije $f(x) = x^{-n}$ z negativnim celim eksponentom, kjer je $n$ naravno število.
---
Funkcija je $f(x) = \frac{1}{x^n}$, zato je definirana za vse $x \ne 0$ in nikoli ne doseže vrednosti $0$. Njen graf je hiperbola z asimptotama $x = 0$ in $y = 0$. Pri sodem $n$ je funkcija soda, vse vrednosti so pozitivne in graf gre skozi točki $(-1, 1)$ in $(1, 1)$. Pri lihem $n$ je funkcija liha, $Z_f = \mathbb{R} \setminus \{0\}$, veji ležita v 1. in 3. kvadrantu in graf gre skozi točki $(-1, -1)$ in $(1, 1)$.
:::

### Ustno vprašanje 2

:::premisli
Pojasni, kdaj ima potenčna funkcija $f(x) = x^n$ z naravnim eksponentom $n \ge 2$ inverzno funkcijo in katera je ta funkcija.
---
Inverzna funkcija obstaja le za injektivno funkcijo, ki vsako vrednost doseže pri enem samem $x$. Pri lihem $n$ funkcija $x^n$ narašča na vsem $\mathbb{R}$, zato ima inverzno funkcijo $\sqrt[n]{x}$, definirano za vsa realna števila. Pri sodem $n$ je $(-x)^n = x^n$, zato funkcija ni injektivna. Zato jo zožimo na $[0, \infty)$ in njena inverzna funkcija je $\sqrt[n]{x}$ za $x \ge 0$. Graf korenske funkcije dobimo z zrcaljenjem grafa potence čez premico $y = x$.
:::

### Ustno vprašanje 3

:::premisli
Navedi primer potenčne odvisnosti iz vsakdanjega življenja in pojasni, po čem jo ločiš od premega sorazmerja.
---
Primer je prostornina kocke v odvisnosti od roba, $V = a^3$. Pri premem sorazmerju je količnik $\frac{y}{x}$ stalen, zato se pri dvakrat večjem $x$ tudi $y$ poveča dvakrat. Pri potenčni odvisnosti $y = c \cdot x^n$ je stalen količnik $\frac{y}{x^n}$, zato se pri dvakrat večjem $x$ vrednost $y$ poveča $2^n$-krat. Pri kocki dvakrat daljši rob da osemkrat večjo prostornino, zato prostornina ni premo sorazmerna z robom.
:::

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

? (brez računala) Med količinama velja potenčna odvisnost $y = c \cdot x^n$. Pri $x = 1$, $2$ in $4$ so vrednosti $y = 3$, $24$ in $192$. Vpiši eksponent $n$.
= 3
~ 8 | $8$ je faktor, s katerim se $y$ pomnoži, ko $x$ podvojiš. Ta faktor je $2^n$, eksponent pa je $n$.
~ 1 | Pri $n = 1$ bi bilo premo sorazmerje: $y$ bi se ob podvojitvi $x$ le podvojil, tu pa se poveča $8$-krat.
> Ko se $x$ podvoji, se $y$ poveča $8$-krat: $\frac{24}{3} = \frac{192}{24} = 8 = 2^3$. Zato je $n = 3$ in $c = 3$, odvisnost je $y = 3x^3$.

? (brez računala) Na sliki je graf funkcije $f(x) = (x - p)^3 + q$. Z grafa odčitaj središče simetrije, zapiši predpis in vpiši $f(4)$.
:::risba graf
opis: Naraščajoč graf funkcije f(x) = (x − p)³ + q v obliki kubične parabole za x od 0,3 do 3,7. Središče simetrije je označena točka (2, 1), v kateri je graf za trenutek vodoraven. Graf gre še skozi točki (1, 0) in (3, 2).
x: -2 .. 5 | 1 | x
y: -4 .. 6 | 1 | y
f: (x-2)^3 + 1 | modra debelo | 0,3 .. 3,7
točka: 2; 1
točka: 1; 0
točka: 3; 2
:::
= 9
~ 217 | Predznak: središče $(2, 1)$ pomeni premik za $2$ v desno, torej $p = 2$ in predpis $(x - 2)^3 + 1$, ne $(x + 2)^3 + 1$.
~ 29 | Zamenjana sta $p$ in $q$: $p$ je abscisa središča ($2$), $q$ njegova ordinata ($1$).
~ 7 | Premik za $1$ navzgor pomeni $+1$, ne $-1$.
> Središče je $(2, 1)$, zato je $p = 2$, $q = 1$ in $f(x) = (x - 2)^3 + 1$. Torej $f(4) = 2^3 + 1 = 9$.

? Model zavorne poti $s = 0{,}005 \cdot v^2$ so postavili iz meritev na suhi cesti med $30$ in $120\,\mathrm{km/h}$. Kateri sklep je upravičen?
+ Napoved pri $50\,\mathrm{km/h}$ na suhi cesti je smiselna, za zaledenelo cesto pa ne.
- Model velja za vsako cesto, ker se ujema z vsemi meritvami.
~ Meritve so le s suhe ceste. Na ledu je zavorna pot daljša, $c$ bi bil večji.
- Boljši bi bil linearni model, ker je preprostejši.
~ Premica se ne ujema z vsemi meritvami in pri majhnih hitrostih da negativno pot.
- Model je napačen, ker pri $v = 0$ da pot $0$.
~ Avto, ki stoji, nima zavorne poti, zato je to smiselno.
> Model velja za razmere, v katerih so merili: $50\,\mathrm{km/h}$ leži med meritvami, led pa je zunaj teh razmer.

:::simboli
x | neodvisna spremenljivka | |
n | eksponent | | | celo število
f | potenčna funkcija; v primeru 6 $f(x) = \dfrac{2}{x - 1} - 1$, v kvizu $f(x) = (x - p)^3 + q$ | f(x) = x^n |
y | vrednost funkcije | y = f(x) |
a | rob kocke (v primeru 4 dolžina plošče; pri transformacijah $y = a \cdot (x - p)^n + q$ faktor raztega) | a = \sqrt[3]{V} | m | zveza velja za kocko
a_1 | notranji rob prvega zabojnika (v primeru 4 prva dolžina plošče) | | m
a_2 | rob večjega zabojnika (v primeru 4 dvakrat daljša plošča) | | m
V | prostornina kocke | V = a^3 | m^3
V_1 | prostornina prvega zabojnika | | m^3
V_2 | dvakrat večja prostornina | V_2 = 2 V_1 | m^3
S | ploščina plošče | S = a \cdot b | m^2
b | širina plošče | b = S \cdot a^{-1} | m
g | premaknjena potenčna funkcija | g(x) = (x - 1)^{-2} + 2 |
T | nihajni čas nihala | T = c \cdot \sqrt{l} | s
l | dolžina vrvice nihala | l = \dfrac{T^2}{4} | m
c | stalni koeficient potenčne odvisnosti | c = \dfrac{y}{x^n} | | pri nihalu $c = 2$ za $l$ v m in $T$ v s, pri zavorni poti $c = 0{,}005$
m | masa lesene kocke | m = 0{,}6 \cdot a^3 | kg | rob $a$ v dm
v | hitrost avtomobila | | km/h
s | zavorna pot | s = 0{,}005 \cdot v^2 | m | na suhi cesti
k | smerni koeficient premice (linearni model) | | |
p | premik grafa v smeri osi $x$ | | | pri negativnem $n$ asimptota $x = p$
q | premik grafa v smeri osi $y$ | | | pri negativnem $n$ asimptota $y = q$
D_f, Z_f | definicijsko območje in zaloga vrednosti funkcije $f$ | | |
:::

<<RACUN
limita: (x-1)^(-2)+2 | x | oo | 2
limita: (x-1)^(-2)+2 | x | 1 | oo
vrednost: 3.0/2.25 | 1.33
vrednost: 3.0/sqrt(2.25) | 2
vrednost: 1.0/sqrt(0.25) | 2
vrednost: 2*sqrt(1.5) | 2.4495
resi: 2*sqrt(l)=1.5 | l | 0.5625
vrednost: 1.5^2/4 | 0.5625
vrednost: 0.6*3^3 | 16.2
vrednost: 16.2/3 | 5.4
vrednost: 4.5/30^2 | 0.005
vrednost: (18-4.5)/(60-30) | 0.45
vrednost: 0.45*90-9 | 31.5
vrednost: 0.45*10-9 | -4.5
vrednost: 0.005*90^2 | 40.5
vrednost: 0.005*120^2 | 72
vrednost: 0.005*50^2 | 12.5
resi: 2^n=4 | n | 2
resi: 2/(x-1)-1=0 | x | 3
vrednost: 2/(0-1)-1 | -3
vrednost: 2/(5-1)-1 | -0.5
limita: 2/(x-1)-1 | x | oo | -1
resi: 3*2^n=24 | n | 3
vrednost: (4-2)^3+1 | 9
>>
