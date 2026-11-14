---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Arhitektka riše tloris novega nakupovalnega središča. Izhodišče postavi v vogal stavbe, enota je meter. Sredi atrija bo eliptičen vodnjak s središčem v točki $(12, 8)$, z daljšo polosjo $6\,\mathrm{m}$ v smeri osi $x$ in krajšo $4\,\mathrm{m}$. Enačba $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$ tu ne pomaga, ker središče ni v izhodišču. Poleg tega želi trgovec ob vodnjaku ravno vrsto stojnic, ki se roba vodnjaka le dotakne.

Obe vprašanji sta stari. Apolonij iz Perge je stožnice in njihove tangente raziskoval geometrijsko, s premicami in krogi. Descartes je krivulje prevedel v enačbe. Normalo in z njo tangento je iskal tako, da je zahteval **dvojno** presečišče, torej dvojno rešitev enačbe. Ta zamisel živi naprej v pogoju, da je diskriminanta enaka nič, $D = 0$.

## Razlaga

Pri krožnici smo središče pisali $S(p, q)$. Ker $p$ pri paraboli pomeni parameter, bomo odslej središče elipse in hiperbole ter teme parabole pisali $S(x_0, y_0)$.

**1. Premik na sliki.** Črtkana elipsa na sliki ima središče v izhodišču, polos $3$ vzdolž osi $x$ in polos $2$ vzdolž osi $y$. Polna elipsa je ista elipsa, premaknjena za $2$ v desno in $3$ navzdol.

:::risba graf
opis: Dve enaki elipsi s polosema 3 (vodoravno) in 2 (navpično). Siva črtkana ima središče v izhodišču. Modra polna je premaknjena za 2 v desno in 3 navzdol; njeno središče je S(2, −3), temena pa (−1, −3), (5, −3), (2, −1) in (2, −5). Puščica kaže od izhodišča do točke S.
x: -4 .. 6 | 1 | x
y: -6 .. 3 | 1 | y
enako: da
f: 2*sqrt(1 - x^2/9) | siva črtkano | -3 .. 3
f: -2*sqrt(1 - x^2/9) | siva črtkano | -3 .. 3
f: -3 + 2*sqrt(1 - (x - 2)^2/9) | modra debelo | -1 .. 5
f: -3 - 2*sqrt(1 - (x - 2)^2/9) | modra debelo | -1 .. 5
puščica: 0; 0 -> 2; -3
točka: 2; -3 | S | desno
točka: 5; -3
točka: -1; -3
točka: 2; -1
točka: 2; -5
:::

Vsaka točka se premakne za isti vektor. Tabela pokaže temena in središče:

| črtkana elipsa | polna elipsa |
|---|---|
| $(3, 0)$ | $(5, -3)$ |
| $(-3, 0)$ | $(-1, -3)$ |
| $(0, 2)$ | $(2, -1)$ |
| $(0, -2)$ | $(2, -5)$ |
| središče $(0, 0)$ | središče $(2, -3)$ |

Zdaj pot nazaj: točka $(x, y)$ leži na polni elipsi, če točka $(x - 2, y + 3)$, torej $2$ v levo in $3$ navzgor, leži na črtkani. Zato v enačbo črtkane namesto $x$ vstavimo $x - 2$ in namesto $y$ vstavimo $y + 3$: dobimo $\frac{(x - 2)^2}{9} + \frac{(y + 3)^2}{4} = 1$. Splošno ima elipsa s središčem $S(x_0, y_0)$ enačbo

$$\frac{(x - x_0)^2}{a^2} + \frac{(y - y_0)^2}{b^2} = 1$$

Kot pri krožnici je v oklepaju minus koordinata središča. Oblika, polosi in ekscentričnost $e = \sqrt{a^2 - b^2}$ ostanejo enake; premakneta se le središče in gorišči. Za $a > b$ sta gorišči $F_{1,2}(x_0 \pm e, y_0)$. Krožnica je poseben primer z $a = b = r$.

:::premisli
Napovej, kje je središče elipse $\frac{(x + 1)^2}{4} + \frac{(y - 5)^2}{25} = 1$ in na kateri premici ležita njeni gorišči.
---
Središče je $S(-1, 5)$, ker $x + 1 = x - (-1)$. Večji imenovalec $25$ stoji pod $y$, zato je daljša os navpična. Gorišči ležita na premici $x = -1$, oddaljeni $\sqrt{25 - 4} = \sqrt{21}$ od središča.
:::

**2. Iz krožnice z raztegom (višja raven).** Na sliki je črtkana krožnica $x^2 + y^2 = 25$. Vsako njeno točko približamo osi $x$: koordinato $y$ pomnožimo s $\frac35$, koordinata $x$ ostane. Nastane polna elipsa.

:::risba graf
opis: Siva črtkana krožnica s središčem v izhodišču in polmerom 5. Modra polna elipsa s polosema 5 (vodoravno) in 3 (navpično). Puščice kažejo, kam se točke krožnice premaknejo: iz (0, 5) v (0, 3), iz (3, 4) v (3; 2,4) in iz (−4, 3) v (−4; 1,8).
x: -6 .. 6 | 1 | x
y: -6 .. 6 | 1 | y
enako: da
krog: 0; 0 | 5 | siva črtkano
f: 3*sqrt(1 - x^2/25) | modra debelo | -5 .. 5
f: -3*sqrt(1 - x^2/25) | modra debelo | -5 .. 5
puščica: 0; 5 -> 0; 3
puščica: 3; 4 -> 3; 2,4
puščica: -4; 3 -> -4; 1,8
:::

| točka na krožnici | točka po raztegu s faktorjem $\frac35$ |
|---|---|
| $(0, 5)$ | $(0, 3)$ |
| $(3, 4)$ | $(3; 2{,}4)$ |
| $(4, 3)$ | $(4; 1{,}8)$ |
| $(5, 0)$ | $(5, 0)$ |

Zdaj še simboli. Točka $(x, y)$ na elipsi je nastala iz točke $\left(x, \frac53 y\right)$ na krožnici, saj nazaj množimo z obratnim faktorjem $\frac53$. Ta zadošča enačbi krožnice: $x^2 + \left(\frac53 y\right)^2 = 25$. Delimo s $25$ in dobimo $\frac{x^2}{25} + \frac{y^2}{9} = 1$. Splošno: krožnica $x^2 + y^2 = a^2$, raztegnjena vzdolž osi $y$ s faktorjem $\frac{b}{a}$, je elipsa s polosema $a$ in $b$. Faktor manjši od $1$ krožnico stisne, večji jo raztegne. Pri krožnici s središčem $S(x_0, y_0)$ raztegujemo glede na premico $y = y_0$ in dobimo premaknjeno elipso.

**3. Hiperbola v premaknjeni legi (višja raven).** Premik deluje enako:

$$\frac{(x - x_0)^2}{a^2} - \frac{(y - y_0)^2}{b^2} = 1$$

Asimptoti gresta skozi središče: $y - y_0 = \pm\frac{b}{a}(x - x_0)$. Gorišči sta $(x_0 \pm e, y_0)$ z $e = \sqrt{a^2 + b^2}$.

Primer: v enačbi $9x^2 - 16y^2 - 36x - 32y - 124 = 0$ združimo člene in dopolnimo do popolnih kvadratov. Iz $9(x^2 - 4x) - 16(y^2 + 2y) = 124$ dobimo $9(x - 2)^2 - 36 - 16(y + 1)^2 + 16 = 124$ oziroma $9(x - 2)^2 - 16(y + 1)^2 = 144$. Po deljenju s $144$ je to $\frac{(x - 2)^2}{16} - \frac{(y + 1)^2}{9} = 1$: središče $S(2, -1)$, $a = 4$, $b = 3$, $e = 5$.

:::risba graf
opis: Hiperbola s središčem S(2, −1), temenoma (−2, −1) in (6, −1) ter goriščema F₁(−3, −1) in F₂(7, −1). Sivi črtkani premici skozi S sta asimptoti s smernima koeficientoma 3/4 in −3/4. Veji se odpirata levo in desno.
x: -6 .. 10 | 2 | x
y: -8 .. 6 | 2 | y
enako: da
f: -1 + 3/4*(x - 2) | siva črtkano
f: -1 - 3/4*(x - 2) | siva črtkano
f: -1 + 3/4*sqrt((x - 2)^2 - 16) | modra debelo | 6 .. 10
f: -1 - 3/4*sqrt((x - 2)^2 - 16) | modra debelo | 6 .. 10
f: -1 + 3/4*sqrt((x - 2)^2 - 16) | modra debelo | -6 .. -2
f: -1 - 3/4*sqrt((x - 2)^2 - 16) | modra debelo | -6 .. -2
točka: 2; -1 | S | pod
točka: -3; -1 | F_1 | pod
točka: 7; -1 | F_2 | pod
:::

**4. Parabola v premaknjeni legi (višja raven).** Parabola s temenom $T(x_0, y_0)$ in osjo, vzporedno z osjo $x$, ima enačbo

$$(y - y_0)^2 = 2p(x - x_0)$$

Gorišče je $F\left(x_0 + \frac{p}{2}, y_0\right)$, vodnica $x = x_0 - \frac{p}{2}$. Če zamenjaš vlogi $x$ in $y$, dobiš parabolo $(x - x_0)^2 = 2p(y - y_0)$, ki se odpira navzgor. To je graf kvadratne funkcije: iz $y = x^2 - 4x + 7$ dobiš $(x - 2)^2 = y - 3$, teme $(2, 3)$.

Katero stožnico skriva splošna enačba, pove že pogled na kvadrate:

| kvadrata v enačbi | stožnica |
|---|---|
| $x^2$ in $y^2$, enaka koeficienta | krožnica |
| $x^2$ in $y^2$, enaka predznaka | elipsa |
| $x^2$ in $y^2$, nasprotna predznaka | hiperbola (višja raven) |
| samo eden od $x^2$, $y^2$ | parabola (višja raven) |

Po dopolnjevanju mora biti pri elipsi desna stran pozitivna, sicer krivulje ni, tako kot pri krožnici.

**5. Tangenta v točki stožnice (višja raven).** Za točko $T_1(x_1, y_1)$, ki **leži** na stožnici, je pravilo kratko: v vsakem kvadratu en faktor zamenjaj s koordinato točke. Pri elipsi je enačba tangente

$$\frac{(x_1 - x_0)(x - x_0)}{a^2} + \frac{(y_1 - y_0)(y - y_0)}{b^2} = 1$$

pri hiperboli je med ulomkoma minus. Pri paraboli $(y - y_0)^2 = 2p(x - x_0)$ člen $2p(x - x_0)$ razdelimo na polovici, $p(x - x_0) + p(x_1 - x_0)$, zato je enačba tangente

$$(y_1 - y_0)(y - y_0) = p\big((x - x_0) + (x_1 - x_0)\big)$$

Pri stožnici s središčem oziroma temenom v izhodišču se pravilo skrči: tangenta elipse je $\frac{x_1 x}{a^2} + \frac{y_1 y}{b^2} = 1$, hiperbole $\frac{x_1 x}{a^2} - \frac{y_1 y}{b^2} = 1$, parabole $y^2 = 2px$ pa $y_1 y = p(x + x_1)$.

**6. Tangenta z diskriminanto (višja raven).** Kadar poznaš smer tangente ali točko zunaj stožnice, uporabi isti postopek kot pri krožnici. Premico $y = kx + n$ vstaviš v enačbo stožnice in dobiš kvadratno enačbo za $x$. Diskriminanta pove lego: $D > 0$ sekanta, $D = 0$ tangenta, $D < 0$ mimobežnica. Za stožnice s središčem oziroma temenom v izhodišču ta račun vedno da pogoj tangentnosti: pri elipsi $a^2k^2 + b^2 = n^2$, pri hiperboli $a^2k^2 - b^2 = n^2$, pri paraboli $y^2 = 2px$ pogoj $p = 2kn$.

:::premisli
Premica, vzporedna asimptoti hiperbole, seka hiperbolo v natanko eni točki. Zakaj kljub temu ni tangenta?
---
Ko jo vstaviš, se člena z $x^2$ odštejeta in ostane linearna enačba. Diskriminante sploh ni, ena rešitev pomeni presečišče, ne dotika: premica gre z ene strani veje na drugo. Tangenta je le premica, pri kateri ima kvadratna enačba dvojno rešitev.
:::

## Rešeni primeri

### Primer 1 (lažji): elipsa iz splošne oblike

Določi središče, polosi in gorišči krivulje $4x^2 + 9y^2 - 16x + 54y + 61 = 0$.

**Podatki:** enačba $4x^2 + 9y^2 - 16x + 54y + 61 = 0$
**Iščemo:** središče $S$, polosi $a$ in $b$, gorišči $F_1$ in $F_2$

:::formula
$x^2 - 4x = (x - 2)^2 - 4$; $\frac{(x - x_0)^2}{a^2} + \frac{(y - y_0)^2}{b^2} = 1$; $e = \sqrt{a^2 - b^2}$
:::

**Rešitev:**

1. Člene z isto spremenljivko združimo in izpostavimo koeficienta: $4(x^2 - 4x) + 9(y^2 + 6y) = -61$.
2. Dopolnimo do popolnih kvadratov. Dodano odštejemo, pomnoženo s koeficientom pred oklepajem: $4(x - 2)^2 - 16 + 9(y + 3)^2 - 81 = -61$.
3. Konstante prenesemo na desno: $-61 + 16 + 81 = 36$, torej $4(x - 2)^2 + 9(y + 3)^2 = 36$.
4. Delimo s $36$, da je na desni $1$: $\frac{(x - 2)^2}{9} + \frac{(y + 3)^2}{4} = 1$.
5. Središče je $S(2, -3)$, $a = 3$, $b = 2$. Ekscentričnost $e = \sqrt{9 - 4} = \sqrt5 \approx 2{,}24$.
6. Odgovor: to je polna elipsa s prve slike. Središče $S(2, -3)$, polosi $3$ in $2$, gorišči $F_{1,2}(2 \pm \sqrt5, -3)$.

### Primer 2 (višja raven): parabola in tangenta v njeni točki

Krivulja ima enačbo $y^2 - 4y - 8x + 28 = 0$. Določi teme, gorišče in vodnico. Zapiši še tangento v točki krivulje z ordinato $6$.

**Podatki:** $y^2 - 4y - 8x + 28 = 0$, točka $T_1$ na krivulji z $y_1 = 6$
**Iščemo:** teme $T$, gorišče $F$, vodnico, tangento v $T_1$

:::formula
$(y - y_0)^2 = 2p(x - x_0)$, $F\left(x_0 + \frac{p}{2}, y_0\right)$, vodnica $x = x_0 - \frac{p}{2}$; tangenta $(y_1 - y_0)(y - y_0) = p\big((x - x_0) + (x_1 - x_0)\big)$
:::

**Rešitev:**

1. Kvadrat je samo pri $y$, zato gre za parabolo. Dopolnimo: $y^2 - 4y = (y - 2)^2 - 4$, torej $(y - 2)^2 = 8x - 24 = 8(x - 3)$.
2. Teme je $T(3, 2)$, $2p = 8$, zato $p = 4$. Gorišče $F(5, 2)$, vodnica $x = 1$.
3. Točka $T_1$: iz $(6 - 2)^2 = 8(x_1 - 3)$ sledi $16 = 8(x_1 - 3)$ in $x_1 = 5$. Torej $T_1(5, 6)$.
4. Tangenta: $(6 - 2)(y - 2) = 4\big((x - 3) + (5 - 3)\big)$, torej $4(y - 2) = 4(x - 1)$ in $y = x + 1$.
5. Preizkus z diskriminanto: vstavimo $y = x + 1$ in dobimo $(x - 1)^2 = 8(x - 3)$ oziroma $x^2 - 10x + 25 = 0$. Diskriminanta je $100 - 100 = 0$, dvojna rešitev $x = 5$.

:::risba graf
opis: Parabola s temenom T(3, 2), ki se odpira v desno; gorišče je F(5, 2), vodnica je siva črtkana navpična premica x = 1. Oranžna premica y = x + 1 se parabole dotakne v točki T₁(5, 6).
x: -1 .. 9 | 1 | x
y: -5 .. 9 | 1 | y
enako: da
f: 2 + sqrt(8*(x - 3)) | modra debelo | 3 .. 9
f: 2 - sqrt(8*(x - 3)) | modra debelo | 3 .. 9
f: x + 1 | oranžna | -1 .. 8
črta: 1; -5 -> 1; 9 | siva črtkano
točka: 3; 2 | T | levo
točka: 5; 2 | F | pod
točka: 5; 6 | T_1 | levo
:::

6. Odgovor: teme $T(3, 2)$, gorišče $F(5, 2)$, vodnica $x = 1$, tangenta v $T_1(5, 6)$ je $y = x + 1$.

### Primer 3 (težji, višja raven): stojnice ob vodnjaku

Vodnjak iz uvoda ima enačbo $\frac{(x - 12)^2}{36} + \frac{(y - 8)^2}{16} = 1$ (enota je meter). Trgovec želi vrsto stojnic ob ravni poti $y = \frac12 x + n$, ki se roba vodnjaka dotakne na južni strani (pod vodnjakom). Določi $n$ in točko dotika.

**Podatki:** središče $S(12, 8)$, $a = 6\,\mathrm{m}$, $b = 4\,\mathrm{m}$, smerni koeficient poti $k = \frac12$, pot pod vodnjakom
**Iščemo:** $n$ in dotikališče

:::formula
$\frac{(x - 12)^2}{36} + \frac{(y - 8)^2}{16} = 1$, $y = \frac12 x + n$; tangenta, ko je $D = 0$
:::

**Rešitev:**

1. Račun poenostavimo s premikom: $u = x - 12$, $v = y - 8$. Elipsa dobi središče v izhodišču, $\frac{u^2}{36} + \frac{v^2}{16} = 1$. Premica postane $v = \frac12 u + m$ z $m = n - 2$, saj je $y - 8 = \frac12(u + 12) + n - 8$.
2. Vstavimo $v$ v elipso in pomnožimo s $144$: $4u^2 + 9\left(\frac12 u + m\right)^2 = 144$. Po množenju s $4$ in urejanju: $25u^2 + 36mu + 36m^2 - 576 = 0$.
3. Diskriminanta: $D = (36m)^2 - 4 \cdot 25 \cdot (36m^2 - 576) = 57600 - 2304m^2$. Iz $D = 0$ sledi $m^2 = 25$, torej $m = 5$ ali $m = -5$.
4. Pot pod vodnjakom ima manjši odsek: $m = -5$, zato je $n = m + 2 = -3$. (Pri $m = 5$ bi bila pot nad vodnjakom.)
5. Dvojna rešitev: $u = \frac{-36m}{2 \cdot 25} = \frac{180}{50} = 3{,}6$ in $v = \frac12 \cdot 3{,}6 - 5 = -3{,}2$. Nazaj: $x = 15{,}6$, $y = 4{,}8$.
6. Odgovor: pot ima enačbo $y = \frac12 x - 3$ in se vodnjaka dotakne v točki $(15{,}6; 4{,}8)$.

### Primer 4 – zdaj ti (višja raven): tangenta na elipso

Točka $T_1(3{,}8; -1{,}4)$ leži na elipsi iz Primera 1, $\frac{(x - 2)^2}{9} + \frac{(y + 3)^2}{4} = 1$. Zapiši enačbo tangente v $T_1$.

**Podatki:** elipsa s $S(2, -3)$, $a = 3$, $b = 2$; točka $T_1(3{,}8; -1{,}4)$
**Iščemo:** enačbo tangente v $T_1$

:::formula
$\frac{(x_1 - x_0)(x - x_0)}{a^2} + \frac{(y_1 - y_0)(y - y_0)}{b^2} = 1$
:::

**Rešitev:**

1. Preizkus, da $T_1$ leži na elipsi: $\frac{1{,}8^2}{9} + \frac{1{,}6^2}{4} = 0{,}36 + 0{,}64 = 1$.
2. Vstavimo: $x_1 - x_0 = 1{,}8$ in $y_1 - y_0 = 1{,}6$, torej $\frac{1{,}8(x - 2)}{9} + \frac{1{,}6(y + 3)}{4} = 1$ oziroma $0{,}2(x - 2) + 0{,}4(y + 3) = 1$.
3. Odpravi oklepaje in decimalna števila, nato preveri:

:::premisli
Kakšna je urejena enačba tangente?
---
$0{,}2x - 0{,}4 + 0{,}4y + 1{,}2 = 1$, torej $0{,}2x + 0{,}4y = 0{,}2$ in po množenju s $5$: $x + 2y = 1$. Preizkus: $3{,}8 + 2 \cdot (-1{,}4) = 1$, točka $T_1$ leži na tangenti.
:::

## Pogoste napake

- **Napačen predznak središča.** Kdor v $(x + 2)^2$ prebere $x_0 = 2$, nariše elipso na napačni strani. Zapiši $x + 2 = x - (-2)$: središče ima $x_0 = -2$.
- **Pozabljen koeficient pri dopolnjevanju.** Zapis $4(y^2 + 2y) = 4(y + 1)^2 - 1$ je napačen, ker $4(y + 1)^2$ doda $4 \cdot 1 = 4$. Odšteti moraš $4$.
- **Polosi pred deljenjem.** Iz $4(x - 2)^2 + 9(y + 3)^2 = 36$ ne moreš prebrati $a = 2$ in $b = 3$. Najprej deli, da je na desni $1$; šele imenovalca $9$ in $4$ dasta $a = 3$, $b = 2$.
- **Gorišča brez premika.** Gorišči premaknjene elipse nista $(\pm e, 0)$, ampak $(x_0 \pm e, y_0)$. Premakne se vsa slika, tudi gorišča.
- (višja raven) **Pravilo s koordinatami točke za točko zunaj stožnice.** Enačba tangente $\frac{x_1 x}{a^2} + \frac{y_1 y}{b^2} = 1$ velja le za točko na stožnici. Za točko zunaj daje premico, ki ni tangenta. Tam postavi premico skozi točko in zahtevaj $D = 0$.

## Povzetek

- Elipsa s središčem $S(x_0, y_0)$: $\frac{(x - x_0)^2}{a^2} + \frac{(y - y_0)^2}{b^2} = 1$; gorišči $(x_0 \pm e, y_0)$, $e = \sqrt{a^2 - b^2}$. Krožnica je primer $a = b = r$.
- Splošno obliko prevedeš z dopolnjevanjem do popolnega kvadrata; dodano odšteješ, pomnoženo s koeficientom; nato deliš, da je desno $1$.
- (višja raven) Elipsa nastane iz krožnice $x^2 + y^2 = a^2$ z raztegom vzdolž osi $y$ s faktorjem $\frac{b}{a}$.
- (višja raven) Hiperbola: $\frac{(x - x_0)^2}{a^2} - \frac{(y - y_0)^2}{b^2} = 1$, asimptoti $y - y_0 = \pm\frac{b}{a}(x - x_0)$, $e = \sqrt{a^2 + b^2}$.
- (višja raven) Parabola: $(y - y_0)^2 = 2p(x - x_0)$, gorišče $\left(x_0 + \frac{p}{2}, y_0\right)$, vodnica $x = x_0 - \frac{p}{2}$.
- (višja raven) Tangenta v točki stožnice: en faktor vsakega kvadrata zamenjaš s koordinato točke. Tangenta z dano smerjo ali skozi zunanjo točko: vstaviš $y = kx + n$ in zahtevaš $D = 0$.

## Drugače: Z analogijo

Premik stožnice je kot premik police v trgovini. Polica ostane enaka, le njen položaj merimo od drugega mesta. Kupec meri razdaljo od vrat, prodajalec od blagajne. Če je blagajna $x_0$ metrov od vrat, je polica, ki je $x$ metrov od vrat, od blagajne oddaljena $x - x_0$. Tako je tudi v enačbi: $x - x_0$ je razdalja, izmerjena od novega središča. Zato je v oklepaju minus.

(višja raven) Raztezanje je kot slika na raztegljivi majici. Krog na majici postane elipsa, ko majico potegneš navzgor; vodoravne mere ostanejo, navpične se pomnožijo z istim faktorjem.

(višja raven) Tangenta pa je kot ravnilo, ki ga položiš ob rob krožnika. Če ga potisneš malo naprej, seka rob dvakrat; malo nazaj, ga sploh ne doseže. Vmes je ena sama lega, ko se roba dotakne. Pri enačbah sta to dve rešitvi, nobena in vmes dvojna rešitev z $D = 0$.

## Drugače: Iz vsakdanjega življenja

Na načrtu nakupovalnega središča ima vse svoje mesto: vodnjak, police, stojnice. Izhodišče je v vogalu stavbe, zato skoraj nobena okrogla ali eliptična oblika nima središča v izhodišču. Prav zato v načrtih srečaš premaknjene enačbe: za eliptično mizo v kavarni, za okroglo vrtljivo stojalo ali za lok vhoda.

(višja raven) Parabolična satelitska antena na strehi trgovine ima prerez $(y - y_0)^2 = 2p(x - x_0)$: teme je na nosilcu, ne v izhodišču načrta, sprejemnik pa mora biti v gorišču $\left(x_0 + \frac{p}{2}, y_0\right)$. Kadar želi trgovec ravno vrsto stojnic ob okroglem ali eliptičnem robu, išče tangento.

## Preveri se

? Katera od enačb ne predstavlja ne elipse ne krožnice?
- $\frac{(x - 1)^2}{4} + \frac{(y + 2)^2}{9} = 1$
~ Oba kvadrata imata plus, desno je $1$: elipsa s središčem $(1, -2)$.
- $x^2 + 4y^2 - 2x = 3$
~ Po dopolnjevanju je $(x - 1)^2 + 4y^2 = 4$: kvadrata z enakim predznakom, torej elipsa.
+ $4x^2 - y^2 + 8x = 0$
- $x^2 + y^2 + 6y = 0$
~ To je $x^2 + (y + 3)^2 = 9$: krožnica, poseben primer elipse.
> Iz $4x^2 - y^2 + 8x = 0$ dobiš $4(x + 1)^2 - y^2 = 4$ oziroma $(x + 1)^2 - \frac{y^2}{4} = 1$. Kvadrata imata nasprotna predznaka, zato je to hiperbola.

? Z grafa odčitaj polosi elipse na sliki. Elipso premaknemo za $3$ enote v levo in $2$ enoti navzgor. Vpiši absciso desnega gorišča premaknjene elipse (brez računala).
:::risba graf
opis: Elipsa s središčem v izhodišču. Seka os x v točkah (−5, 0) in (5, 0), os y pa v točkah (0, −3) in (0, 3).
x: -6 .. 6 | 1 | x
y: -4 .. 4 | 1 | y
enako: da
f: 3*sqrt(1 - x^2/25) | modra debelo | -5 .. 5
f: -3*sqrt(1 - x^2/25) | modra debelo | -5 .. 5
točka: 5; 0
točka: 0; 3
:::
= 1 | 0,01
~ 4 | To je abscisa gorišča pred premikom, $e = \sqrt{25 - 9} = 4$. Premik v levo jo zmanjša za $3$.
~ 7 | Premaknil si v desno. Premik v levo pomeni $x_0 = -3$.
~ 2,83 | To je $\sqrt{34} - 3$. Pri elipsi je $e = \sqrt{a^2 - b^2}$, ne $\sqrt{a^2 + b^2}$.
> Z grafa: $a = 5$, $b = 3$, $e = \sqrt{25 - 9} = 4$. Desno gorišče je bilo $(4, 0)$, po premiku je $(-3 + 4, 2) = (1, 2)$.

? Enačbo $x^2 + 4y^2 - 6x + 8y + 9 = 0$ z dopolnjevanjem do popolnih kvadratov zapiši v obliki $(x - 3)^2 + 4(y + 1)^2 = c$. Vpiši $c$.
= 4
~ 1 | Pri $4(y^2 + 2y)$ si odštel le $1$. Ker $4(y + 1)^2 = 4y^2 + 8y + 4$, moraš odšteti $4$.
~ -22 | Pri prenosu na desno si obdržal predznaka: $-9$ in $-4$ na levi postaneta $+9$ in $+4$ na desni.
> $(x^2 - 6x) + 4(y^2 + 2y) = -9$, nato $(x - 3)^2 - 9 + 4(y + 1)^2 - 4 = -9$, torej $c = -9 + 9 + 4 = 4$. Po deljenju s $4$: $\frac{(x - 3)^2}{4} + (y + 1)^2 = 1$, elipsa s središčem $(3, -1)$.

? (višja raven) Premica $y = x + n$ je tangenta parabole $(y - 1)^2 = 4(x + 2)$. Vpiši $n$.
= 4
~ 3 | Premica skozi teme $(-2, 1)$ ni tangenta: parabolo seka še v eni točki.
~ -4 | Pri diskriminanti si zamenjal predznak. Iz $-16n + 64 = 0$ sledi $n = 4$.
> Vstaviš $y = x + n$: $x^2 + (2n - 6)x + (n - 1)^2 - 8 = 0$. $D = (2n - 6)^2 - 4\big((n - 1)^2 - 8\big) = -16n + 64 = 0$, torej $n = 4$. Dotikališče je $(-1, 3)$.

? (višja raven) Razvrsti korake za iskanje tangente na stožnico z danim smernim koeficientom $k$.
1. Zapiši premico $y = kx + n$ z neznanim $n$.
2. Vstavi $y$ v enačbo stožnice.
3. Uredi v kvadratno enačbo za $x$.
4. Postavi $D = 0$ in izračunaj $n$.
5. Iz dvojne rešitve izračunaj dotikališče.
> Tangenta ima s stožnico eno samo skupno točko, zato mora imeti kvadratna enačba dvojno rešitev, torej $D = 0$. Šele ko poznaš $n$, izračunaš dotikališče.

<<RACUN
enako: 4*(x-2)^2 + 9*(y+3)^2 - 36 | 4*x^2 + 9*y^2 - 16*x + 54*y + 61
vrednost: -61 + 16 + 81 | 36
vrednost: sqrt(9-4) | sqrt(5)
enako: 9*(x-2)^2 - 16*(y+1)^2 - 144 | 9*x^2 - 16*y^2 - 36*x - 32*y - 124
vrednost: sqrt(16+9) | 5
enako: (y-2)^2 - 8*(x-3) | y^2 - 4*y - 8*x + 28
resi: (6-2)^2 = 8*(x-3) | x | 5
enako: (x+1-2)^2 - 8*(x-3) | (x-5)^2
enako: 4*(4*u^2 + 9*(u/2+m)^2 - 144) | 25*u^2 + 36*m*u + 36*m^2 - 576
enako: (36*m)^2 - 4*25*(36*m^2 - 576) | 57600 - 2304*m^2
resi: 57600 - 2304*m^2 = 0 | m | -5, 5
vrednost: 3.6^2/36 + 3.2^2/16 | 1
vrednost: 1.8^2/9 + 1.6^2/4 | 1
enako: 5*(0.2*(x-2) + 0.4*(y+3) - 1) | x + 2*y - 1
enako: 4*(x+1)^2 - 4 - y^2 | 4*x^2 - y^2 + 8*x
enako: (x-3)^2 + 4*(y+1)^2 - 4 | x^2 + 4*y^2 - 6*x + 8*y + 9
resi: (2*n-6)^2 - 4*((n-1)^2 - 8) = 0 | n | 4
vrednost: -3 + sqrt(25-9) | 1
>>

:::simboli
x, y | koordinati točke na krivulji | |
x_0, y_0 | koordinati središča (pri paraboli temena) | |
a | polos v smeri osi $x$ | |
b | polos v smeri osi $y$ | |
e | linearna ekscentričnost, razdalja gorišča od središča | e = \sqrt{a^2 - b^2} | | pri hiperboli $e = \sqrt{a^2 + b^2}$
p | parameter parabole | |
x_1, y_1 | koordinati dotikališča $T_1$ | |
k | smerni koeficient premice | |
n | začetna vrednost (odsek) premice | |
D | diskriminanta kvadratne enačbe | |
u, v | koordinati, merjeni od središča vodnjaka | u = x - 12 |
m | odsek premice v premaknjenih koordinatah | m = n - 2 |
r | polmer krožnice | |
F, F_1, F_2 | gorišče; gorišči | |
S | središče | |
T, T_1 | teme parabole; dotikališče | |
:::
