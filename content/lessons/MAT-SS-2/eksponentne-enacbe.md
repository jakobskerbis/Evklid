---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Šahovnica ima $64$ polj. Arabski zgodovinar Ibn Halikan je v 13. stoletju zapisal staro zgodbo o izumitelju šaha. Za nagrado si je izprosil eno žitno zrno na prvem polju, dve na drugem, štiri na tretjem in na vsakem naslednjem polju dvakrat toliko kot na prejšnjem. Vladar je prošnjo sprva imel za skromno, njegovi računarji pa so ugotovili, da toliko žita ni v vsem kraljestvu.

Na $n$-tem polju leži $2^{n-1}$ zrn. Računarje je zanimalo tudi obratno: na katerem polju jih je že $1024$? Tu je neznanka $n$ v **eksponentu**. Podobno vprašanje si zastavi organizator turnirja na izpadanje: koliko krogov potrebuje za $256$ igralcev, če se v vsakem krogu število igralcev razpolovi? Takim enačbam rečemo **eksponentne enačbe**. Rešili jih bomo z **enačenjem osnov** in z **uvedbo nove spremenljivke**.

## Razlaga

**1. Najprej šahovnica.** Na katerem polju leži $1024$ zrn? Rešujemo enačbo $2^{n-1} = 1024$. Desno stran zapišemo kot potenco števila $2$: $2^1 = 2$, $2^2 = 4$, $2^3 = 8$, … in $2^{10} = 1024$. Enačba se glasi $2^{n-1} = 2^{10}$. Ker sta osnovi enaki, morata biti enaka tudi eksponenta: $n - 1 = 10$, torej $n = 11$. Preizkus: $2^{11-1} = 2^{10} = 1024$. Na enajstem polju leži $1024$ zrn.

**2. Kaj je eksponentna enačba.** Eksponentna enačba je enačba, v kateri je neznanka v eksponentu potence. Primeri: $2^x = 32$, $\;3^{2x-1} = \dfrac{1}{27}$, $\;4^x - 3 \cdot 2^x - 4 = 0$. Enačba $x^2 = 9$ ni eksponentna, ker je neznanka v osnovi.

**3. Ključna lastnost.** Naj bo $a > 0$ in $a \ne 1$. Eksponentna funkcija $f(x) = a^x$ je za $a > 1$ naraščajoča, za $0 < a < 1$ pa padajoča. Zato vsako svojo vrednost zavzame **natanko enkrat**. Iz tega sledi pravilo, na katerem temelji vse reševanje:

$$a^{u} = a^{v} \iff u = v \qquad (a > 0,\ a \ne 1).$$

Če sta obe strani enačbe potenci **z isto osnovo**, smemo izenačiti eksponenta. Pogoj $a \ne 1$ je pomemben: $1^5 = 1^7$, pa vendar $5 \ne 7$.

**4. Kdaj enačba nima rešitve.** Za $a > 0$ je potenca $a^x$ vedno pozitivna. Enačbe $2^x = -4$ ali $3^x = 0$ zato nimajo realne rešitve. To preveriš takoj, preden začneš računati.

:::premisli
Obe strani enačbe $2^x = 2^{x+1}$ imata osnovo $2$. Koliko rešitev ima enačba? Odloči se, preden kaj zapišeš.
---
Nobene. Z enačenjem eksponentov dobimo enačbo $x = x + 1$, ki ne velja za noben $x$. Drugače: $2^{x+1} = 2 \cdot 2^x$, iz enačbe $2^x = 2 \cdot 2^x$ pa bi sledilo $2^x = 0$, kar je nemogoče.
:::

**5. Enačenje osnov.** Obe strani zapišemo kot potenci iste osnove in izenačimo eksponenta. Pomagata ti tabela pogostih potenc in pravila za potence:

| Osnova | Potence |
|---|---|
| $2$ | $4 = 2^2$, $8 = 2^3$, $16 = 2^4$, $32 = 2^5$, $64 = 2^6$, $128 = 2^7$, $256 = 2^8$ |
| $3$ | $9 = 3^2$, $27 = 3^3$, $81 = 3^4$, $243 = 3^5$ |
| $5$ | $25 = 5^2$, $125 = 5^3$, $625 = 5^4$ |
| vsaka $a$ | $1 = a^0$, $\;\dfrac{1}{a^n} = a^{-n}$, $\;\sqrt[n]{a^m} = a^{\frac{m}{n}}$ |

Primer: $8^{x} = 4^{x+1}$. Ker je $8 = 2^3$ in $4 = 2^2$, dobimo $2^{3x} = 2^{2x+2}$, torej $3x = 2x + 2$ in $x = 2$.

**6. Izpostavljanje skupnega faktorja.** Če v enačbi nastopa **vsota ali razlika** potenc z isto osnovo, na primer $3^{x+1} - 3^{x-1} = 72$, osnov še ne moremo izenačiti. Vse člene zapišemo s potenco $3^x$: $3^{x+1} = 3 \cdot 3^x$ in $3^{x-1} = \dfrac{1}{3} \cdot 3^x$. Nato izpostavimo $3^x$:

$$3^x \left(3 - \frac{1}{3}\right) = 72 \;\Rightarrow\; 3^x \cdot \frac{8}{3} = 72$$

$$3^x = 72 \cdot \frac{3}{8} = 27 = 3^3 \;\Rightarrow\; x = 3.$$

**7. Uvedba nove spremenljivke.** Kadar v enačbi nastopata $a^x$ in $a^{2x}$, ji pogosto lahko damo obliko kvadratne enačbe. Upoštevamo $a^{2x} = \left(a^x\right)^2$ in vpeljemo $t = a^x$. Ker je $a^x > 0$, mora biti tudi $t > 0$. Postopek:

1. Vse potence zapiši z $a^x$ (na primer $4^x = \left(2^x\right)^2$, $2^{x+1} = 2 \cdot 2^x$).
2. Vpelji $t = a^x$ z zahtevo $t > 0$.
3. Reši kvadratno enačbo za $t$.
4. **Zavrzi** rešitve $t \le 0$.
5. Za vsako sprejeto $t$ reši enačbo $a^x = t$ z enačenjem osnov.

:::premisli
Sošolec pri $t = 2^x$ zavrže tudi rešitev $t = \frac{1}{2}$: »Potenca $2^x$ je vendar vsaj $1$.« Ima prav? In zakaj negativno rešitev res zavržemo?
---
Ker je $2^x$ vedno pozitivno, enačba $2^x = t$ s $t \le 0$ nima rešitve. Vsako pozitivno število pa je vrednost potence: enačba $2^x = \frac{1}{2}$ ima rešitev $x = -1$. Majhen pozitiven $t$ pomeni le negativen $x$.
:::

**8. Enaki eksponenti, različni osnovi.** Če je $a^{u} = b^{u}$ za različni pozitivni osnovi $a$ in $b$, delimo z $b^u$ in dobimo $\left(\dfrac{a}{b}\right)^u = 1 = \left(\dfrac{a}{b}\right)^0$, zato je $u = 0$. Tako je rešitev enačbe $2^{x-3} = 5^{x-3}$ število $x = 3$.

**9. Preizkus.** Rešitev vedno vstavi v prvotno enačbo. Preizkus pri eksponentnih enačbah je navadno hiter, ker so potence majhna cela števila ali preprosti ulomki.

**10. Grafični pogled.** Rešitev enačbe $f(x) = g(x)$ je abscisa presečišča grafov funkcij $f$ in $g$. Rešitve enačbe $2^x = 8$ so torej abscise presečišč krivulje $y = 2^x$ in vodoravne premice $y = 8$; presečišče je pri $x = 3$. V simulaciji spodaj (»Eksponentna enačba grafično«) nastavi $a = 2$ in premikaj desno stran $b$ od $10$ proti $0{,}2$. Opazuj, kako presečišče drsi po krivulji navzdol in v levo: pri $b = 1$ je pri $x = 0$, pod $1$ pa je $x$ negativen. Premica $y = b$ krivuljo seka natanko enkrat. Če bi jo spustil do osi $x$ ali pod njo, presečišča ne bi bilo več.

Kaj pa enačba $2^x = 5$? Števila $5$ ne znamo zapisati kot potenco števila $2$ s preprostim eksponentom. Rešitev vseeno obstaja, graf jo pokaže blizu $x \approx 2{,}3$. Natančno jo bomo zapisali šele v naslednji lekciji.

**11. Grafično reševanje eksponentne neenačbe (višja raven).** Neenačba ima namesto enačaja znak $<$, $>$, $\le$ ali $\ge$. Neenačbo $f(x) < g(x)$ rešimo grafično tako, da poiščemo vse $x$, pri katerih leži graf funkcije $f$ **pod** grafom funkcije $g$ (pri $f(x) > g(x)$ iščemo, kje leži **nad** njim). Postopek:

1. Neenačbo zapiši v obliki $f(x) < g(x)$ (ali z drugim znakom neenakosti), kjer znaš narisati graf vsake strani (eksponentna funkcija, premica …).
2. Oba grafa nariši v isti koordinatni sistem.
3. Poišči presečišča grafov in njihove abscise **preveri z računom**: vstavi jih v obe strani. Odčitek z grafa je le približek.
4. Odčitaj intervale, na katerih je graf $f$ pod grafom $g$ (pri $>$ in $\ge$ nad njim). Pri znaku $\le$ ali $\ge$ abscise presečišč vključi, pri $<$ ali $>$ ne.

Najpreprostejši primer je $2^x < 8$. Naraščajoča krivulja $y = 2^x$ je pod premico $y = 8$ levo od presečišča $(3, 8)$, zato velja za $x < 3$. Padajoča krivulja $y = \left(\frac{1}{2}\right)^x$ pa je pod premico $y = 8$ desno od presečišča $(-3, 8)$, zato neenačbo $\left(\frac{1}{2}\right)^x < 8$ rešijo vsi $x > -3$. Smer odčitka je torej odvisna od tega, ali krivulja narašča ali pada.

Grafična metoda je najbolj uporabna, kadar je na drugi strani neenačbe premica, na primer $2^x \le x + 1$. Take neenačbe računsko ne znamo rešiti, z grafom pa jih rešimo v nekaj korakih (Primer 5).

## Rešeni primeri

### Primer 1 (lažji)

Reši enačbi: a) $3^{2x-1} = \dfrac{1}{27}$, b) $4^{x} = 8\sqrt{2}$.

**Podatki:** enačba a) $3^{2x-1} = \dfrac{1}{27}$, enačba b) $4^{x} = 8\sqrt{2}$
**Iščemo:** rešitev $x$ vsake enačbe

:::formula
$a^{u} = a^{v} \iff u = v$ (za $a > 0$, $a \ne 1$); $\;\dfrac{1}{a^n} = a^{-n}$, $\;\sqrt{a} = a^{\frac{1}{2}}$, $\;(a^m)^n = a^{mn}$
:::

**Rešitev:**

1. a) Desno stran zapišemo s potenco števila $3$: $\dfrac{1}{27} = \dfrac{1}{3^3} = 3^{-3}$.
2. Dobimo $3^{2x-1} = 3^{-3}$, zato je $2x - 1 = -3$, $2x = -2$ in $x = -1$.
3. Preizkus: $3^{2 \cdot (-1) - 1} = 3^{-3} = \dfrac{1}{27}$. Ujema se.
4. b) Obe strani zapišemo s potenco števila $2$: $4^x = \left(2^2\right)^x = 2^{2x}$ in $8\sqrt{2} = 2^3 \cdot 2^{\frac{1}{2}} = 2^{\frac{7}{2}}$.
5. Iz $2^{2x} = 2^{\frac{7}{2}}$ sledi $2x = \dfrac{7}{2}$ in $x = \dfrac{7}{4}$.
6. Preizkus: $4^{\frac{7}{4}} = 2^{\frac{7}{2}} \approx 11{,}31$ in $8\sqrt{2} \approx 8 \cdot 1{,}414 \approx 11{,}31$. Ujema se.
7. Odgovor: rešitev enačbe a) je $x = -1$, rešitev enačbe b) je $x = \dfrac{7}{4}$.

### Primer 2 (srednji)

Reši enačbo $2^{x+2} + 2^{x-1} = 36$.

**Podatki:** enačba $2^{x+2} + 2^{x-1} = 36$
**Iščemo:** rešitev $x$

:::formula
$a^{x+n} = a^n \cdot a^x$; izpostavimo skupni faktor $a^x$, nato $a^{u} = a^{v} \iff u = v$
:::

**Rešitev:**

1. Člene zapišemo s potenco $2^x$: $2^{x+2} = 4 \cdot 2^x$ in $2^{x-1} = \dfrac{1}{2} \cdot 2^x$.
2. Izpostavimo $2^x$: $2^x \left(4 + \dfrac{1}{2}\right) = 36$, torej $2^x \cdot \dfrac{9}{2} = 36$.
3. Delimo z $\dfrac{9}{2}$: $2^x = 36 \cdot \dfrac{2}{9} = 8$.
4. Ker je $8 = 2^3$, je $x = 3$.
5. Preizkus: $2^{5} + 2^{2} = 32 + 4 = 36$. Ujema se.
6. Odgovor: rešitev enačbe je $x = 3$.

### Primer 3 (težji)

Reši enačbo $9^{x} - 2 \cdot 3^{x+1} - 27 = 0$.

**Podatki:** enačba $9^{x} - 2 \cdot 3^{x+1} - 27 = 0$
**Iščemo:** vse realne rešitve $x$

:::formula
$9^x = \left(3^x\right)^2$, $\;3^{x+1} = 3 \cdot 3^x$; nova spremenljivka $t = 3^x$, $t > 0$; $\;t_{1,2} = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
:::

**Rešitev:**

1. Vse potence zapišemo s $3^x$: $9^x = \left(3^2\right)^x = \left(3^x\right)^2$ in $2 \cdot 3^{x+1} = 2 \cdot 3 \cdot 3^x = 6 \cdot 3^x$.
2. Enačba se glasi $\left(3^x\right)^2 - 6 \cdot 3^x - 27 = 0$.
3. Vpeljemo $t = 3^x$, kjer je $t > 0$: $\;t^2 - 6t - 27 = 0$.
4. Rešimo kvadratno enačbo. Diskriminanta je $D = 36 + 108 = 144$, zato je $t_{1,2} = \dfrac{6 \pm 12}{2}$, torej $t_1 = 9$ in $t_2 = -3$. (Tudi razcep $(t - 9)(t + 3) = 0$ da isto.)
5. Rešitev $t_2 = -3$ zavržemo, ker $3^x$ ne more biti negativno.
6. Iz $3^x = 9 = 3^2$ dobimo $x = 2$.
7. Preizkus: $9^2 - 2 \cdot 3^3 - 27 = 81 - 54 - 27 = 0$. Ujema se.
8. Odgovor: enačba ima eno rešitev, $x = 2$.

### Primer 4 – zdaj ti

Turnir v namiznem tenisu poteka na izpadanje: v vsakem krogu igralci igrajo v parih, poraženci izpadejo. Na začetku je $256$ igralcev, po $n$ krogih jih ostane $N(n) = 256 \cdot \left(\frac{1}{2}\right)^n$. Po koliko krogih ostaneta le še finalista? Koliko krogov ima turnir skupaj s finalom?

**Podatki:** $256$ igralcev na začetku; $N(n) = 256 \cdot \left(\frac{1}{2}\right)^n$; finalista: $N(n) = 2$
**Iščemo:** število krogov $n$ do finala in skupno število krogov

:::formula
$\left(\frac{1}{2}\right)^n = \dfrac{1}{2^n}$; $\;a^{u} = a^{v} \iff u = v$ (za $a > 0$, $a \ne 1$)
:::

**Rešitev:**

1. Iščemo krog, po katerem ostaneta $2$ igralca, zato postavimo enačbo $256 \cdot \left(\frac{1}{2}\right)^n = 2$.
2. Delimo z $256$: $\left(\frac{1}{2}\right)^n = \frac{2}{256} = \frac{1}{128}$.
3. Zdaj ti: zapiši $\frac{1}{128}$ kot potenco z osnovo $\frac{1}{2}$, izenači eksponenta in ugotovi, koliko krogov ima turnir.

:::premisli
Po koliko krogih ostaneta finalista in koliko krogov ima turnir?
---
Ker je $128 = 2^7$, je $\frac{1}{128} = \left(\frac{1}{2}\right)^7$ in $n = 7$. Preizkus: $256 \cdot \frac{1}{128} = 2$. Po $7$ krogih ostaneta finalista. Finale je še en krog, zato ima turnir $8$ krogov; po njem ostane $256 \cdot \left(\frac{1}{2}\right)^8 = 1$ zmagovalec.
:::

### Primer 5 (višja raven): neenačbi, rešeni z grafom

Grafično reši neenačbi a) $2^x < 6 - x$ in b) $2^x \le x + 1$.

**Podatki:** neenačba a) $2^x < 6 - x$, neenačba b) $2^x \le x + 1$
**Iščemo:** vse $x$, ki rešijo neenačbo a), in vse, ki rešijo neenačbo b)

:::formula
Neenačbo $f(x) < g(x)$ rešijo abscise točk, v katerih je graf $f$ pod grafom $g$. Abscise presečišč preverimo z računom.
:::

**Rešitev:**

1. Narišemo krivuljo $y = 2^x$ skozi točke $(-1; 0{,}5)$; $(0, 1)$; $(1, 2)$; $(2, 4)$ in $(3, 8)$ ter premici $y = 6 - x$ in $y = x + 1$.
2. a) Krivulja seka premico $y = 6 - x$ v točki $(2, 4)$. Preizkus: $2^2 = 4$ in $6 - 2 = 4$. Krivulja narašča, premica pada, zato drugega presečišča ni.
3. a) Levo od $x = 2$ je krivulja pod premico (pri $x = 0$ je $1 < 6$), desno nad njo. Znak $<$ je strog, zato $x = 2$ ni rešitev: rešitev je $x \in (-\infty, 2)$.
4. b) Krivulja seka premico $y = x + 1$ v točkah $(0, 1)$ in $(1, 2)$. Preizkus: $2^0 = 1 = 0 + 1$ in $2^1 = 2 = 1 + 1$. Krivulja $y = 2^x$ je vse strmejša in se ukrivlja navzgor, zato jo premica seka največ v dveh točkah: tretjega presečišča ni.
5. b) Med presečiščema je krivulja pod premico: pri $x = \frac{1}{2}$ je $2^{\frac{1}{2}} \approx 1{,}41 < 1{,}5$. Levo od $0$ in desno od $1$ je nad njo, na primer $2^{-1} = 0{,}5 > 0$ in $2^3 = 8 > 4$.
6. b) Znak $\le$ dovoli tudi enakost, zato abscisi presečišč vključimo: rešitev je $x \in [0, 1]$.
7. Odgovor: neenačbo a) rešijo vsi $x \in (-\infty, 2)$, neenačbo b) vsi $x \in [0, 1]$.

:::risba graf
opis: Krivulja y = 2ˣ (modra, polna) ter premici y = 6 − x (oranžna, padajoča) in y = x + 1 (zelena, črtkana, naraščajoča) za x od −2 do 4. Krivulja seka padajočo premico v točki (2, 4); levo od te točke je pod premico. Premico y = x + 1 seka v točkah (0, 1) in (1, 2); med njima je krivulja malo pod premico, levo in desno od njiju nad njo.
x: -2 .. 4 | 1 | x
y: -1 .. 9 | 1 | y
f: 2^x | modra debelo | -2 .. 3
f: 6 - x | oranžna | -2 .. 4
f: x + 1 | zelena črtkano | -2 .. 4
točka: 2; 4 | (2, 4) | desno
točka: 0; 1 | (0, 1) | nad levo
točka: 1; 2 | (1, 2) | pod desno
napis: 2,3; 8,3 | y = 2^x | levo | modra
napis: -1; 8,3 | y = 6 − x | sredina | oranžna
napis: 3,4; 5,8 | y = x + 1 | sredina | zelena
podnapis: a) krivulja je pod padajočo premico za x < 2; b) pod premico y = x + 1 je za x med 0 in 1.
:::

## Pogoste napake

- **Izenačevanje eksponentov pri različnih osnovah.** Iz $2^x = 4^{x-1}$ nekateri sklepajo $x = x - 1$ in zaključijo, da rešitve ni. Eksponenta smeš izenačiti le, ko sta osnovi enaki. Pravilno: $4^{x-1} = 2^{2x-2}$, zato je $x = 2x - 2$ in $x = 2$ (preizkus: $2^2 = 4 = 4^1$).
- **Napačno »razbijanje« potence.** $2^{x+3} = 2^x + 2^3$ ni res, saj vsota v eksponentu pomeni **produkt** potenc: $2^{x+3} = 2^3 \cdot 2^x = 8 \cdot 2^x$. Podobno $2^x + 2^x$ ni $4^x$, ampak $2 \cdot 2^x = 2^{x+1}$.
- **Koeficient vpleten v osnovo.** $2 \cdot 3^x$ ni enako $6^x$, ker se potencira le osnova $3$, faktor $2$ pa ne. Preizkus z $x = 2$: $2 \cdot 9 = 18$, $6^2 = 36$. Koeficient pusti pred potenco in ga po potrebi izpostavi ali z njim deli.
- **Sprejeta negativna vrednost nove spremenljivke.** Pri uvedbi $t = a^x$ dobiš iz kvadratne enačbe včasih $t < 0$. Enačba $3^x = -3$ nima rešitve, ker je $3^x$ vedno pozitivno. Ob uvedbi nove spremenljivke vedno zapiši pogoj $t > 0$ in neustrezne vrednosti zavrzi.
- **Napačen predznak pri obratni vrednosti.** $\dfrac{1}{8} = 2^{3}$ ali $\dfrac{1}{8} = 2^{\frac{1}{3}}$ je napačno. Obratna vrednost pomeni negativni eksponent: $\dfrac{1}{8} = 2^{-3}$, koren pa ulomek v eksponentu: $\sqrt[3]{2} = 2^{\frac{1}{3}}$. Podobno je število korakov eksponent, ne faktor: iz enačbe $\left(\frac{1}{2}\right)^n = \frac{1}{8}$ sledi $n = 3$, ne $n = 8$.

## Povzetek

- Eksponentna enačba ima neznanko v eksponentu.
- Za $a > 0$, $a \ne 1$ velja $a^{u} = a^{v} \iff u = v$ (enačenje osnov).
- Ker je $a^x > 0$, enačbe $a^x = c$ s $c \le 0$ nimajo rešitve.
- Pomagaj si s $\dfrac{1}{a^n} = a^{-n}$, $\sqrt[n]{a^m} = a^{\frac{m}{n}}$, $(a^m)^n = a^{mn}$, $a^{x+n} = a^n \cdot a^x$.
- Pri vsoti potenc z isto osnovo izpostavi skupni faktor $a^x$.
- Če nastopata $a^{2x}$ in $a^x$, vpelji $t = a^x$ s pogojem $t > 0$ in reši kvadratno enačbo.
- Iz $a^u = b^u$ za različni pozitivni osnovi sledi $u = 0$.
- Vsako rešitev preveri s preizkusom v prvotni enačbi.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Reši enačbo $\sqrt{27^{x}} = \dfrac{9^{x+1}}{3}$.

**Rešitev:**

1. Levo stran zapišemo s potenco števila $3$: $\sqrt{27^x} = \left(3^{3x}\right)^{\frac{1}{2}} = 3^{\frac{3x}{2}}$.
2. Desno stran zapišemo s potenco števila $3$: $\dfrac{9^{x+1}}{3} = \dfrac{3^{2x+2}}{3^1} = 3^{2x+1}$.
3. Izenačimo eksponenta: $\dfrac{3x}{2} = 2x + 1$, torej $3x = 4x + 2$ in $x = -2$.
4. Preizkus: $\sqrt{27^{-2}} = \sqrt{\dfrac{1}{729}} = \dfrac{1}{27}$ in $\dfrac{9^{-1}}{3} = \dfrac{1}{27}$.
5. Odgovor: $x = -2$.

**Točkovanje:** 1 točka za zapis leve strani kot $3^{\frac{3x}{2}}$; 1 točka za zapis desne strani kot $3^{2x+1}$; 1 točka za rešitev $x = -2$.

### Naloga 2: krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Dana je funkcija $f(x) = 4^x - 6 \cdot 2^x + 8$.

a) Izračunaj presečišče grafa funkcije $f$ z osjo $y$. (1 točka)
b) Izračunaj ničli funkcije $f$. (3 točke)
c) Reši enačbo $f(x) = 24$. (3 točke)

**Rešitev:**

1. a) $f(0) = 4^0 - 6 \cdot 2^0 + 8 = 1 - 6 + 8 = 3$, presečišče je točka $(0, 3)$.
2. b) Ker je $4^x = \left(2^x\right)^2$, vpeljemo $t = 2^x$ s pogojem $t > 0$. Enačba $f(x) = 0$ se glasi $t^2 - 6t + 8 = 0$.
3. b) Razcep $(t - 2)(t - 4) = 0$ da $t_1 = 2$ in $t_2 = 4$; obe vrednosti sta pozitivni.
4. b) Iz $2^x = 2$ sledi $x_1 = 1$, iz $2^x = 4 = 2^2$ pa $x_2 = 2$.
5. c) Enačba $f(x) = 24$ se s $t = 2^x$ glasi $t^2 - 6t + 8 = 24$, torej $t^2 - 6t - 16 = 0$.
6. c) Razcep $(t - 8)(t + 2) = 0$ da $t_1 = 8$ in $t_2 = -2$. Vrednost $t_2 = -2$ zavržemo, ker je $2^x > 0$.
7. c) Iz $2^x = 8 = 2^3$ sledi $x = 3$. Preizkus: $f(3) = 64 - 48 + 8 = 24$.
8. Odgovor: a) $(0, 3)$; b) ničli sta $x_1 = 1$ in $x_2 = 2$; c) $x = 3$.

**Točkovanje:** a) 1 točka za točko $(0, 3)$; b) 1 točka za kvadratno enačbo $t^2 - 6t + 8 = 0$; 1 točka za $t_1 = 2$ in $t_2 = 4$; 1 točka za ničli $x_1 = 1$ in $x_2 = 2$; c) 1 točka za enačbo $t^2 - 6t - 16 = 0$; 1 točka za zavrnjeno vrednost $t = -2$ z utemeljitvijo; 1 točka za $x = 3$.

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

V laboratoriju gojijo dve kulturi bakterij. Po $x$ urah je v prvi kulturi $A(x) = 200 \cdot 2^x$ bakterij, v drugi pa $B(x) = 25 \cdot 4^x$ bakterij.

a) Koliko bakterij je v vsaki kulturi na začetku? (1 točka)
b) Po koliko urah je v obeh kulturah enako število bakterij? Koliko jih je takrat v vsaki? (3 točke)
c) Po koliko urah je v obeh kulturah skupaj $9600$ bakterij? (3 točke)
d) Za $x$ od $0$ do $4$ skiciraj grafa funkcij $A$ in $B$ v istem koordinatnem sistemu. Z grafa razberi, kdaj je v drugi kulturi več bakterij kot v prvi, in odgovor utemelji z računom. (3 točke)

**Rešitev:**

1. a) $A(0) = 200$ in $B(0) = 25$: na začetku je v prvi kulturi $200$, v drugi $25$ bakterij.
2. b) Enačbo $200 \cdot 2^x = 25 \cdot 4^x$ delimo s $25 \cdot 2^x$ (ki ni $0$) in dobimo $8 = \dfrac{4^x}{2^x} = 2^x$.
3. b) Iz $2^x = 2^3$ sledi $x = 3$. Takrat je $A(3) = 200 \cdot 8 = 1600$ in $B(3) = 25 \cdot 64 = 1600$.
4. c) Enačba $200 \cdot 2^x + 25 \cdot 4^x = 9600$; delimo s $25$ in vpeljemo $t = 2^x$, $t > 0$: $t^2 + 8t - 384 = 0$.
5. c) Diskriminanta je $D = 64 + 1536 = 1600$, zato je $t_{1,2} = \dfrac{-8 \pm 40}{2}$, torej $t_1 = 16$ in $t_2 = -24$. Vrednost $t_2 = -24$ zavržemo, ker je $2^x > 0$.
6. c) Iz $2^x = 16 = 2^4$ sledi $x = 4$. Preizkus: $A(4) + B(4) = 3200 + 6400 = 9600$.
7. d) Točke grafa $A$: $(0, 200)$, $(1, 400)$, $(2, 800)$, $(3, 1600)$, $(4, 3200)$; točke grafa $B$: $(0, 25)$, $(1, 100)$, $(2, 400)$, $(3, 1600)$, $(4, 6400)$. Grafa se sekata v točki $(3, 1600)$, desno od nje leži graf $B$ nad grafom $A$.
8. d) Račun: neenačbo $25 \cdot 4^x > 200 \cdot 2^x$ delimo s pozitivnim številom $25 \cdot 2^x$ in dobimo $2^x > 8 = 2^3$. Ker je $2^x$ strogo naraščajoča, to velja natanko za $x > 3$.
9. Odgovor: a) $200$ in $25$ bakterij; b) po $3$ urah, takrat jih je v vsaki $1600$; c) po $4$ urah; d) v drugi kulturi je več bakterij za $x > 3$, torej po treh urah.

**Točkovanje:** a) 1 točka za $200$ in $25$; b) 1 točka za poenostavitev na $2^x = 8$; 1 točka za $x = 3$; 1 točka za $1600$ bakterij; c) 1 točka za kvadratno enačbo $t^2 + 8t - 384 = 0$ (ali enakovredno); 1 točka za $t = 16$ z zavrnjeno vrednostjo $t = -24$; 1 točka za $x = 4$; d) 1 točka za oba grafa s presečiščem $(3, 1600)$; 1 točka za prevedbo na $2^x > 8$; 1 točka za odgovor $x > 3$ z utemeljitvijo z naraščanjem funkcije $2^x$.

### Ustno vprašanje 1

:::premisli
Utemelji, zakaj iz enakosti $a^u = a^v$ sledi $u = v$, in povej, kateri pogoji za osnovo $a$ so pri tem potrebni.
---
Osnova mora biti pozitivna in različna od $1$, torej $a > 0$ in $a \ne 1$. Pri takih osnovah je funkcija $a^x$ strogo monotona: za $a > 1$ narašča, za $0 < a < 1$ pada. Strogo monotona funkcija nobene vrednosti ne zavzame dvakrat, zato iz $a^u = a^v$ sledi $u = v$. Pri $a = 1$ sklep ne velja, ker je $1^u = 1$ za vsak eksponent $u$.
:::

### Ustno vprašanje 2

:::premisli
Opiši reševanje eksponentne enačbe z uvedbo nove spremenljivke in pojasni, katere rešitve pri tem zavržemo.
---
Novo spremenljivko uvedemo, kadar v enačbi nastopata $a^{2x}$ in $a^x$, saj je $a^{2x} = \left(a^x\right)^2$. Vpeljemo $t = a^x$ in dobimo kvadratno enačbo za $t$, ki jo rešimo. Ker je $a^x > 0$ za vsak $x$, zavržemo vse rešitve $t \le 0$. Za vsako pozitivno rešitev nato rešimo enačbo $a^x = t$ in rešitve preverimo v prvotni enačbi.
:::

### Ustno vprašanje 3

:::premisli
Navedi primer eksponentne enačbe, ki nima realne rešitve, in pojasni, zakaj je nima.
---
Primer je enačba $3^x = -9$. Potenca s pozitivno osnovo je pozitivna pri vsakem realnem eksponentu. Zato $3^x$ ne more biti enako negativnemu številu in enačba nima rešitve. Enako velja za vsako enačbo $a^x = c$, kjer je $a > 0$ in $c \le 0$.
:::

## Drugače: Na sliki

Predstavljaj si graf funkcije $y = 2^x$ in nekaj njegovih točk:

| $x$ | $2^x$ |
|---|---|
| $-2$ | $\frac{1}{4}$ |
| $-1$ | $\frac{1}{2}$ |
| $0$ | $1$ |
| $1$ | $2$ |
| $2$ | $4$ |
| $3$ | $8$ |
| $4$ | $16$ |

Reševati enačbo $2^x = 8$ pomeni na grafu poiskati točko, ki ima **višino** $8$, in prebrati njeno **absciso**. Nariši vodoravno premico $y = 8$: krivuljo seka natanko v eni točki, $(3, 8)$, zato je $x = 3$. Ker krivulja ves čas raste, presečišče ne more biti več kot eno; ker krivulja leži nad osjo $x$, premica $y = -4$ krivulje sploh ne seka, zato enačba $2^x = -4$ nima rešitve.

Pri uvedbi nove spremenljivke si lahko predstavljaš dva koraka: najprej poiščeš višine $t$, ki rešijo kvadratno enačbo, nato pa za vsako pozitivno višino narišeš vodoravno premico in prebereš absciso presečišča. Negativne višine na grafu sploh ne obstajajo. V interaktivni simulaciji spodaj premikaj vodoravno premico in opazuj, kje seka krivuljo.

## Drugače: Z analogijo

Cen v evrih in dolarjih ne primerjaš neposredno. Najprej obe pretvoriš v isto valuto, nato primerjaš le še številki. Pri enačbi $8^x = 4^{x+1}$ je »valuta« osnova: obe strani pretvoriš v osnovo $2$, dobiš $2^{3x} = 2^{2x+2}$ in nato primerjaš le eksponenta.

Uvedba nove spremenljivke je kot dres pred tekmo. Potenca $2^x$ za nekaj časa obleče dres z napisom $t$, enačba je videti kot znana kvadratna in jo rešiš. Po tekmi dres sleče: vrneš se k enačbi $2^x = t$. Kdor pozabi na ta korak, je rešil le pol naloge. Dres $t$ pa smejo nositi le pozitivna števila.

## Drugače: Korak za korakom s številkami

**Reši $5^{2x} - 30 \cdot 5^{x} + 125 = 0$.**

1. Opazimo, da je $5^{2x} = \left(5^x\right)^2$. V enačbi nastopata le $\left(5^x\right)^2$ in $5^x$, kar je znak za novo spremenljivko.
2. Vpeljemo $t = 5^x$, $t > 0$. Enačba postane $t^2 - 30t + 125 = 0$.
3. Diskriminanta: $D = (-30)^2 - 4 \cdot 1 \cdot 125 = 900 - 500 = 400$, $\sqrt{D} = 20$.
4. Rešitvi: $t_1 = \dfrac{30 + 20}{2} = 25$ in $t_2 = \dfrac{30 - 20}{2} = 5$. Obe sta pozitivni, zato obe obdržimo.
5. Vrnemo se k $x$: iz $5^x = 25 = 5^2$ dobimo $x_1 = 2$, iz $5^x = 5 = 5^1$ dobimo $x_2 = 1$.
6. Preizkus za $x = 2$: $625 - 30 \cdot 25 + 125 = 625 - 750 + 125 = 0$.
7. Preizkus za $x = 1$: $25 - 30 \cdot 5 + 125 = 25 - 150 + 125 = 0$.
8. Rešitvi enačbe sta $x_1 = 2$ in $x_2 = 1$.

Opazi, da je kvadratna enačba za $t$ le vmesni korak. Dokler ne izračunaš $x$, naloga ni končana.

## Drugače: Bolj natančno

**Zakaj smemo izenačiti eksponenta.** Naj bo $a > 1$ in $u < v$. Potem je $v - u > 0$ in $a^{v-u} > 1$, ker je potenca števila, večjega od $1$, s pozitivnim eksponentom večja od $1$. Zato je $a^v = a^u \cdot a^{v-u} > a^u$. Različna eksponenta torej dasta različni potenci. Za $0 < a < 1$ je sklep enak, le neenakost se obrne. Iz $a^u = a^v$ zato sledi $u = v$. Ta lastnost se imenuje **injektivnost** eksponentne funkcije. Za $a = 1$ odpove, ker je $1^x = 1$ za vsak $x$.

**Obstoj rešitve.** Zaloga vrednosti funkcije $a^x$ ($a > 0$, $a \ne 1$) je interval $(0, \infty)$. Zato ima enačba $a^x = c$ za vsak $c > 0$ natanko eno rešitev, za $c \le 0$ pa nobene. Z enačenjem osnov jo najdemo le, če je $c$ »lepa« potenca števila $a$; za ostale pozitivne $c$ rešitev obstaja, a jo zapišemo z novim pojmom, ki ga spoznaš v naslednji lekciji.

**Enačbe z $a^x$ in $a^{-x}$.** Enačbo $2^x + 2^{-x} = \dfrac{5}{2}$ rešimo z $t = 2^x$: $t + \dfrac{1}{t} = \dfrac{5}{2}$. Pomnožimo z $2t$ (smemo, ker je $t > 0$): $2t^2 - 5t + 2 = 0$, torej $t = 2$ ali $t = \dfrac{1}{2}$ in $x = 1$ ali $x = -1$.

## Preveri se

? (brez računala) Reši enačbo $5^{x} = \dfrac{1}{25}$. Vpiši $x$.
= -2 | 0,01
~ 2 | Ker je $25 = 5^2$, je $\frac{1}{25}$ obratna vrednost, zato potrebuje negativni eksponent: $\frac{1}{25} = 5^{-2}$.
~ 0,5 | Ulomek v eksponentu pomeni koren: $5^{\frac{1}{2}} = \sqrt{5}$, ne $\frac{1}{25}$.
~ -0,5 | Tu sta zamešana koren in obratna vrednost: $5^{-\frac{1}{2}} = \frac{1}{\sqrt{5}}$, ne $\frac{1}{25}$.
> $\dfrac{1}{25} = \dfrac{1}{5^2} = 5^{-2}$, zato je $x = -2$. Obratna vrednost pomeni negativni eksponent.

? Kateri prvi korak pri reševanju enačbe $2^{x+2} + 2^x = 40$ je pravilen?
- $2^{2x+2} = 40$
~ Pri vsoti potenc se eksponenta ne seštejeta; to velja le za produkt potenc. Pri vsoti izpostavi skupni faktor $2^x$.
- $2 \cdot 2^x + 4 = 40$
~ Tu je $2^{x+2}$ napačno razbit na $2^x + 2^2$. Vsota v eksponentu pomeni produkt: $2^{x+2} = 2^2 \cdot 2^x$.
- $3 \cdot 2^x = 40$
~ Tu je $2^{x+2}$ zapisan kot $2 \cdot 2^x$, kot da bi bil $+2$ v eksponentu faktor $2$. Pravilno je $2^{x+2} = 2^2 \cdot 2^x = 4 \cdot 2^x$.
+ $5 \cdot 2^x = 40$
> $2^{x+2} = 4 \cdot 2^x$, zato je $2^x(4 + 1) = 5 \cdot 2^x = 40$. Sledi $2^x = 8 = 2^3$ in $x = 3$; preizkus: $32 + 8 = 40$.

? Pri reševanju enačbe $4^x - 2^x - 12 = 0$ z novo spremenljivko $t = 2^x$ dobimo $t = 4$ ali $t = -3$. Zakaj vrednost $t = -3$ zavržemo?
- Ker kvadratna enačba v takih nalogah vedno da eno uporabno in eno neuporabno rešitev.
~ Ni res: pri enačbi $5^{2x} - 30 \cdot 5^x + 125 = 0$ sta obe rešitvi za $t$ pozitivni in obe dasta $x$. Odloča pogoj $t > 0$.
- Ker bi iz nje dobili negativen $x$, negativni $x$ pa niso dovoljeni.
~ Negativni $x$ so dovoljeni, na primer $2^{-1} = \frac{1}{2}$. Težava je negativni $t$, ne negativni $x$.
+ Ker je $2^x > 0$ za vsak realen $x$, zato enačba $2^x = -3$ nima rešitve.
- Ker je $-3$ manjše od $1$.
~ Pozitivni $t$ pod $1$ so ustrezni: enačba $2^x = \frac{1}{2}$ ima rešitev $x = -1$. Meja je $0$, ne $1$.
> Nova spremenljivka $t = 2^x$ zavzame le pozitivne vrednosti. Ostane enačba $2^x = 4$, torej $x = 2$.

? Maja rešuje enačbo $4^x - 3 \cdot 2^x - 4 = 0$: (1) s $t = 2^x$ dobi enačbo $t^2 - 3t - 4 = 0$; (2) njeni rešitvi sta $t = 4$ in $t = -1$; (3) iz enačbe $2^x = 4$ dobi $x = 2$, iz enačbe $2^x = -1$ pa $x = -1$; (4) zapiše rešitvi $x = 2$ in $x = -1$. Kateri korak je prvi napačen?
- korak (1)
~ Ker je $4^x = \left(2^x\right)^2$, je kvadratna enačba $t^2 - 3t - 4 = 0$ pravilna.
- korak (2)
~ Razcep $(t - 4)(t + 1) = 0$ res da $t = 4$ in $t = -1$. Kvadratna enačba je rešena pravilno, le $t = -1$ ni uporaben.
+ korak (3)
- korak (4)
~ Tudi ta korak je napačen, a le kot posledica koraka (3). Prva napaka je v koraku (3).
> Enačba $2^x = -1$ nima rešitve, ker je $2^x > 0$. Vrednost $t = -1$ je treba zavreči, ne pa iz nje izpeljati $x = -1$. Edina rešitev je $x = 2$; preizkus: $16 - 12 - 4 = 0$.

? (brez računala) Žogo spustimo z višine $4\,\mathrm{m}$. Po vsakem odboju se dvigne do polovice prejšnje višine, zato po $n$ odbojih doseže $4 \cdot \left(\frac{1}{2}\right)^n$ metrov. Po katerem odboju se dvigne le še do $0{,}5\,\mathrm{m}$? Vpiši število odbojev $n$.
= 3
~ 8 | Število $8$ je razmerje $4 : 0{,}5$, ne število razpolovitev. Iz enačbe $\left(\frac{1}{2}\right)^n = \frac{1}{8}$ sledi $n = 3$, ker je $8 = 2^3$.
~ 7 | To bi veljalo, če bi žoga ob vsakem odboju izgubila stalnih $0{,}5\,\mathrm{m}$. Višina se razpolavlja, ne zmanjšuje za stalno razliko.
~ 4 | Števila $4$; $2$; $1$; $0{,}5$ so štiri, a prvo je začetna višina, ne odboj. Razpolovitve so le tri.
> Enačba $4 \cdot \left(\frac{1}{2}\right)^n = 0{,}5$ da $\left(\frac{1}{2}\right)^n = \frac{1}{8} = \left(\frac{1}{2}\right)^3$, zato je $n = 3$.

? (višja raven) Na sliki sta grafa funkcij $y = \left(\frac{1}{2}\right)^x$ in $y = x + 3$. Katera množica je rešitev neenačbe $\left(\frac{1}{2}\right)^x \le x + 3$?
:::risba graf
opis: Padajoča krivulja y = (1/2)ˣ in naraščajoča premica y = x + 3 za x od −3 do 3. Sekata se v točki (−1, 2). Levo od te točke je krivulja nad premico, desno pod njo.
x: -3 .. 3 | 1 | x
y: -1 .. 8 | 1 | y
f: 0.5^x | modra debelo
f: x + 3 | oranžna
točka: -1; 2 | (−1, 2) | levo
:::
+ $[-1, \infty)$
- $(-\infty, -1]$
~ Tam je krivulja **nad** premico; to bi bila rešitev neenačbe z znakom $\ge$.
- $(-1, \infty)$
~ Znak $\le$ dovoli enakost, zato abscisa presečišča $-1$ sodi zraven.
- $[2, \infty)$
~ $2$ je ordinata presečišča. Rešitev beremo na osi $x$, abscisa presečišča je $-1$.
> Preizkus presečišča: $\left(\frac{1}{2}\right)^{-1} = 2$ in $-1 + 3 = 2$. Desno od $x = -1$ je padajoča krivulja pod naraščajočo premico, zato je rešitev $x \in [-1, \infty)$.

:::simboli
a | osnova potence | | | $a > 0$, $a \ne 1$; v obrazcu za $t_{1,2}$ vodilni koeficient
u, v | eksponenta na obeh straneh enačbe | | |
x | neznanka | | |
m, n | eksponenta v pravilih za potence | | | v uvodu in primeru 4: številka polja oz. število krogov
N | število igralcev po $n$ krogih | N(n) = 256 \cdot \left(\frac{1}{2}\right)^n | |
t | nova neznanka | t = a^x | | $t > 0$, ker je $a^x > 0$
t_{1,2} | rešitvi kvadratne enačbe za $t$ | t_{1,2} = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} | | negativno rešitev zavržemo
b | linearni koeficient kvadratne enačbe za $t$ | | | v točki 8 druga osnova potence, v grafičnem pogledu desna stran $y = b$
c | prosti člen kvadratne enačbe za $t$ | | | v enačbi $a^x = c$ desna stran
D | diskriminanta kvadratne enačbe za $t$ | D = b^2 - 4ac | |
f | funkcija (Za maturo, naloga 2) | f(x) = 4^x - 6 \cdot 2^x + 8 | | v točkah 10 in 11 leva stran enačbe oziroma neenačbe
g | desna stran enačbe oziroma neenačbe (točki 10 in 11) | | |
A, B | število bakterij v prvi in drugi kulturi po $x$ urah (Za maturo, naloga 3) | A(x) = 200 \cdot 2^x | | $B(x) = 25 \cdot 4^x$
:::

<<RACUN
resi: sqrt(27^x)=9^(x+1)/3 | x | -2
resi: 3*x/2=2*x+1 | x | -2
vrednost: 9^(-1)/3 | 1/27
vrednost: 4^0-6*2^0+8 | 3
resi: t^2-6*t+8=0 | t | 2, 4
resi: 4^x-6*2^x+8=0 | x | 1, 2
resi: t^2-6*t-16=0 | t | -2, 8
resi: 4^x-6*2^x+8=24 | x | 3
vrednost: 4^3-6*2^3+8 | 24
resi: 200*2^x=25*4^x | x | 3
vrednost: 200*2^3 | 1600
vrednost: 25*4^3 | 1600
resi: t^2+8*t-384=0 | t | -24, 16
resi: 200*2^x+25*4^x=9600 | x | 4
vrednost: 200*2^4+25*4^4 | 9600
neenacba: 25*4^x>200*2^x | x | (3, oo)
neenacba: 2^x<8 | x | (-oo, 3)
vrednost: (1/2)^(-3) | 8
vrednost: 2^2 | 4
vrednost: 6-2 | 4
resi: 2^x=4 | x | 2
vrednost: 2^0 | 1
vrednost: 2^1 | 2
vrednost: 2^(1/2) | 1.41
vrednost: 2^(-1) | 0.5
vrednost: 2^3 | 8
vrednost: (1/2)^(-1) | 2
vrednost: -1+3 | 2
>>
