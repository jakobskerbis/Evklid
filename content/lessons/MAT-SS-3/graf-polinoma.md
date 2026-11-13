---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

**Uganka, preden začneš.** Oskrbnik planinske koče je zapisal, da je temperatura zraka med 18.00 in 4.00 približno sledila modelu

$$T(t) = -0{,}04\,(t - 2)(t - 7)^2,$$

kjer je $t$ čas v urah po 18.00, $T$ pa temperatura v $^\circ\mathrm{C}$. Model velja za $0 \le t \le 10$. Ob 18.00 je bilo $3{,}92\,^\circ\mathrm{C}$, ob 20.00 je temperatura padla na ledišče. Ob 1.00 ($t = 7$) je termometer spet pokazal natanko $0\,^\circ\mathrm{C}$.

Ali se je po 1.00 še kdaj otoplilo nad ledišče? Odloči se zdaj, še pred razlago. Lahko izračunaš nekaj vrednosti, a poskusi odgovor najti tudi brez tabele.

Nekaj izračunanih točk je lahko zavajajočih: med dvema točkama lahko graf naredi marsikaj. Iz *razcepa* polinoma pa graf skiciraš zanesljivo. Vidiš, kje seka os $x$, kje se je le dotakne in kam gre na obeh koncih. To znanje rabiš pri modelih v naravoslovju, pri polinomskih neenačbah in v naslednji lekciji pri racionalnih funkcijah.

## Razlaga

Graf bomo sestavili po kosih. Za vsakim kosom je kratek preizkus z odgovorom.

**1. Ničle preberemo iz razcepa.** Ničla polinoma $p$ je število $c$, za katero je $p(c) = 0$. Na grafu je to točka na osi $x$. Če je polinom zapisan kot produkt faktorjev, so ničle na dlani: produkt je $0$, ko je $0$ vsaj en faktor.

*Preizkus:* katere ničle ima $p(x) = 2(x + 1)(x - 4)$? *Odgovor:* $x = -1$ in $x = 4$.

Če polinom ni razcepljen, ga razcepiš z orodji iz lekcije o polinomih. Cele ničle iščeš med delitelji prostega člena, s Hornerjevim algoritmom pa odcepiš faktor $x - c$.

**2. Med sosednjima ničlama je predznak stalen.** Graf polinoma je neprekinjena krivulja, brez skokov in lukenj. Če hoče priti iz zgornje polovice ravnine v spodnjo, mora čez os $x$, torej skozi ničlo. Zato ima polinom na vsakem intervalu med sosednjima ničlama en sam predznak. Za vsak interval zadošča ena testna točka.

*Preizkus:* kakšen predznak ima $p(x) = 2(x + 1)(x - 4)$ med $-1$ in $4$? *Odgovor:* testna točka $x = 0$ da $2 \cdot 1 \cdot (-4) = -8$, torej negativen.

**3. Stopnja ničle.** Če se faktor $(x - c)$ v razcepu pojavi $k$-krat, torej kot $(x - c)^k$, je $c$ **ničla stopnje $k$** (pravimo tudi $k$-kratna ničla). Splošno zapišemo razcepljen polinom kot

$$p(x) = a\,(x - x_1)^{k_1}(x - x_2)^{k_2}\cdots$$

Tu je $x_1$ ničla stopnje $k_1$, $x_2$ ničla stopnje $k_2$ in tako naprej.

Stopnja ničle odloči, kaj graf naredi ob njej. Faktor $(x - 1)^2$ je kvadrat, zato je levo in desno od $1$ pozitiven. Ob ničli stopnje $2$ se predznak polinoma torej ne spremeni: graf se osi $x$ le dotakne in se obrne nazaj. Faktor $(x - 1)$ ali $(x - 1)^3$ pa je levo od $1$ negativen, desno pozitiven. Predznak se zamenja in graf os seka.

| stopnja ničle | graf ob ničli | predznak |
|---|---|---|
| liha ($1, 3, \dots$) | seka os $x$ | se zamenja |
| soda ($2, 4, \dots$) | se dotakne osi $x$ | ostane enak |

Pri stopnji $3$ ali več se graf ob ničli še splošči: dlje časa se drži tik ob osi.

:::premisli
Graf polinoma $q(x) = x^2(x - 3)$ je pri $x = 1$ pod osjo $x$. Je pri $x = -1$ nad osjo ali pod njo? Odgovori brez računanja.
---
Pod osjo. Med $-1$ in $1$ leži le ničla $0$, ta pa je stopnje $2$, zato se predznak ob njej ne zamenja. Račun potrdi: $q(-1) = 1 \cdot (-4) = -4$.
:::

**4. Stopnja polinoma iz razcepa.** Če vse oklepaje zmnožiš, dobiš vodilni člen $a\,x^{k_1 + k_2 + \dots}$. Stopnja polinoma je zato vsota stopenj vseh ničel (kadar je razcepljen na same linearne faktorje), vodilni koeficient pa je število $a$ pred oklepaji.

*Preizkus:* stopnja in vodilni koeficient polinoma $p(x) = -3x(x - 2)^2$? *Odgovor:* stopnja $1 + 2 = 3$, vodilni koeficient $-3$.

**5. Obnašanje v neskončnosti.** Daleč levo in daleč desno ni več ničel. Tema dvema koncema grafa rečemo **kraka**. Kam gresta? Primerjajmo $p(x) = x^3 - 10x^2 + 5$ z njegovim vodilnim členom $x^3$:

| $x$ | $p(x)$ | $x^3$ |
|---|---|---|
| $10$ | $5$ | $1000$ |
| $100$ | $900\,005$ | $1\,000\,000$ |
| $1000$ | $990\,000\,005$ | $1\,000\,000\,000$ |

Pri $x = 10$ sta vrednosti še zelo različni, pri $x = 1000$ se razlikujeta le še za odstotek. Vodilni člen raste hitreje od vseh drugih in jih prevlada. Za polinom stopnje $n$ z vodilnim koeficientom $a_n$ zato velja

$$p(x) \approx a_n x^n \quad \text{za zelo velike } |x|.$$

Kam gresta kraka grafa, določata le parnost stopnje $n$ in predznak $a_n$:

| | $a_n > 0$ | $a_n < 0$ |
|---|---|---|
| $n$ sod | levo $+\infty$, desno $+\infty$ | levo $-\infty$, desno $-\infty$ |
| $n$ lih | levo $-\infty$, desno $+\infty$ | levo $+\infty$, desno $-\infty$ |

»Desno $+\infty$« pomeni: ko gre $x \to +\infty$, gre $p(x) \to +\infty$, graf se dviga čez vse meje. Pri sodi stopnji sta kraka na isti strani osi $x$, pri lihi na nasprotnih. Predznak $a_n$ vedno pove, kam gre desni krak.

:::premisli
Kam kažeta kraka grafa $p(x) = 7 + 2x - x^4$? Napovej, nato preveri v tabeli.
---
Oba navzdol, levo in desno $-\infty$. Vodilni člen je $-x^4$: stopnja $4$ je soda, vodilni koeficient $-1$ negativen. Prosti člen $7$ na kraka ne vpliva, pa čeprav je zapisan prvi.
:::

**6. Presečišče z osjo $y$.** To je točka $(0, p(0))$, kjer je $p(0)$ prosti člen. Pri razcepljenem polinomu vstaviš $x = 0$ v vsak faktor.

**7. Skica v petih korakih.**

1. Ničle in njihove stopnje.
2. Kraka iz vodilnega člena.
3. Presečišče z osjo $y$.
4. Predznaki na intervalih: začni na desnem kraku in pojdi proti levi. Pri ničli lihe stopnje predznak zamenjaš, pri sodi ga obdržiš.
5. Točke poveži v gladko krivuljo.

V simulaciji spodaj, »Graf polinoma: ničle in njihova stopnja«, nastavi stopnjo ničle $x_2$ najprej na $2$, nato na $1$ in na $3$. Opazuj, kdaj graf os $x$ ob $x_2$ seka in kdaj se je le dotakne. Bodi pozoren še na levi krak: kaj se zgodi z njim, ko se skupna stopnja spremeni iz sode v liho?

**Rešitev uganke.** V modelu $T(t) = -0{,}04\,(t - 2)(t - 7)^2$ je $t = 7$ ničla stopnje $2$. Graf se osi le dotakne, predznak se ne zamenja. Med $t = 2$ in $t = 7$ je temperatura negativna, npr. $T(5) = -0{,}04 \cdot 3 \cdot 4 = -0{,}48$. Zato je negativna tudi po $t = 7$. Ob 1.00 se je zrak le ogrel do ledišča in se spet ohladil, nad ledišče se do 4.00 ni dvignil.

## Rešeni primeri

### Primer 1: skica iz razcepa

Skiciraj graf polinoma $p(x) = (x + 2)(x - 1)^2(x - 3)$.

**Podatki:** $p(x) = (x + 2)(x - 1)^2(x - 3)$
**Iščemo:** ničle in njihove stopnje, kraka, presečišče z osjo $y$, predznake, skico

:::formula
Faktor $(x - c)^k$ da ničlo $c$ stopnje $k$; kraka določa $a_n x^n$, kjer je $n = k_1 + k_2 + k_3$.
:::

**Rešitev:**

1. Ničle: $-2$ (stopnja $1$), $1$ (stopnja $2$), $3$ (stopnja $1$), ker vsak faktor da svojo ničlo.
2. Stopnja polinoma je $1 + 2 + 1 = 4$, vodilni koeficient $1$. Soda stopnja in pozitiven koeficient: oba kraka gresta v $+\infty$.
3. $p(0) = 2 \cdot 1 \cdot (-3) = -6$, graf seka os $y$ v točki $(0, -6)$.
4. Predznaki od desne proti levi: za $x > 3$ pozitiven (desni krak). Pri $3$ (liha) se zamenja: med $1$ in $3$ negativen. Pri $1$ (soda) ostane: med $-2$ in $1$ negativen. Pri $-2$ (liha) se zamenja: za $x < -2$ pozitiven.
5. Preizkus s testno točko: $p(2) = 4 \cdot 1 \cdot (-1) = -4 < 0$, kar se ujema s korakom 4.
6. Odgovor: graf pride z leve od zgoraj, pri $-2$ preseka os $x$, gre pod osjo skozi $(0, -6)$, pri $1$ se osi dotakne od spodaj in se vrne navzdol, pri $3$ os preseka in se dvigne proti $+\infty$.

### Primer 2: gladina presihajočega jezera

Cerkniško jezero presiha: gladina se hitro dviga in spušča. Odmik gladine od običajne višine (v cm) $d$ dni po začetku merjenja opisuje model $v(d) = d^3 - 9d^2 + 24d - 20$, ki velja za $0 \le d \le 7$. Kdaj je gladina nad običajno višino?

**Podatki:** $v(d) = d^3 - 9d^2 + 24d - 20$ (v cm), $d$ v dneh, $0 \le d \le 7$
**Iščemo:** dneve, ko je $v(d) > 0$

:::formula
Cele ničle so med delitelji prostega člena $-20$; Hornerjev algoritem odcepi faktor $d - c$, ko je $v(c) = 0$.
:::

**Rešitev:**

1. Kandidati za cele ničle: $\pm 1, \pm 2, \pm 4, \pm 5, \pm 10, \pm 20$. Velja $v(1) = 1 - 9 + 24 - 20 = -4$, $v(2) = 8 - 36 + 48 - 20 = 0$. Ničla je $2$.
2. Horner z $2$: koeficienti $1, -9, 24, -20$ dajo $1, -7, 10$ in ostanek $0$. Količnik je $d^2 - 7d + 10 = (d - 2)(d - 5)$.
3. Razcep: $v(d) = (d - 2)^2(d - 5)$. Ničla $2$ ima stopnjo $2$, ničla $5$ stopnjo $1$.
4. Predznaki: vodilni koeficient $1$ je pozitiven, zato je za $d > 5$ odmik pozitiven. Pri $5$ (liha) se predznak zamenja: med $2$ in $5$ negativen. Pri $2$ (soda) ostane: od $0$ do $2$ negativen.
5. Preizkus: $v(3) = 1 \cdot (-2) = -2$ in $v(0) = -20$, oba negativna.
6. Odgovor: gladina je nad običajno višino šele po petem dnevu, za $5 < d \le 7$. Drugi dan se je dvignila natanko do običajne višine in nato spet upadla.

### Primer 3: polinom iz opisa grafa

Poišči polinom najmanjše stopnje, katerega graf seka os $x$ pri $-1$ in pri $4$, se osi $x$ dotakne pri $2$ in gre skozi točko $(0, 8)$. Kam gresta njegova kraka?

**Podatki:** sečišči z osjo $x$: $-1$ in $4$; dotikališče: $2$; točka $(0, 8)$; stopnja najmanjša možna
**Iščemo:** polinom $p(x)$ in smer obeh krakov

:::formula
$p(x) = a\,(x + 1)(x - 2)^2(x - 4)$, število $a$ iz pogoja $p(0) = 8$
:::

**Rešitev:**

1. Sekanje pomeni liho stopnjo, najmanjša je $1$: faktorja $(x + 1)$ in $(x - 4)$. Dotik pomeni sodo stopnjo, najmanjša je $2$: faktor $(x - 2)^2$.
2. Polinom je $p(x) = a\,(x + 1)(x - 2)^2(x - 4)$ in ima stopnjo $4$.
3. Vstavimo točko: $p(0) = a \cdot 1 \cdot 4 \cdot (-4) = -16a$, to mora biti $8$.
4. Zdaj ti: izračunaj $a$ in določi smer krakov.

:::premisli
Koliko je $a$ in kam gresta kraka?
---
Iz $-16a = 8$ sledi $a = -0{,}5$. Stopnja $4$ je soda, vodilni koeficient $-0{,}5$ negativen, zato gresta oba kraka v $-\infty$. Polinom: $p(x) = -0{,}5\,(x + 1)(x - 2)^2(x - 4)$.
:::

## Pogoste napake

- **»Vsaka ničla je presečišče.«** Kdor tako misli, nariše pri $(x - 1)^2$ graf, ki gre čez os. Toda kvadrat je na obeh straneh pozitiven, zato se graf osi le dotakne. Popravek: pri vsaki ničli najprej poglej eksponent njenega faktorja.
- **»Predznaki se vedno izmenjujejo.«** Zaporedje $+, -, +, -$ velja le, če so vse ničle lihe stopnje. Pri $(x + 1)(x - 2)^2$ so predznaki od leve proti desni $-, +, +$. Popravek: pri vsaki ničli posebej odloči, ali predznak zamenjaš.
- **Kraka iz prostega člena ali iz prvega zapisanega člena.** Pri $p(x) = 5 + 3x^2 - 2x^3$ kdo zagleda pozitivno $5$ in reče, da gre desni krak navzgor. Odloča pa člen z najvišjo potenco, $-2x^3$: desno $-\infty$, levo $+\infty$.
- **Stopnja je enaka številu ničel.** Polinom $(x - 1)^2(x + 2)$ ima dve različni ničli, a stopnjo $3$. Popravek: seštej eksponente vseh faktorjev.
- **Model velja povsod.** Polinom iz primera 2 gre za velike $d$ v $+\infty$, jezero pa ne bo naraščalo v nedogled. Model opisuje le dneve, za katere je bil narejen.

## Povzetek

- V razcepu $p(x) = a\,(x - x_1)^{k_1}(x - x_2)^{k_2}\cdots$ je $k_1$ stopnja ničle $x_1$.
- Ničla lihe stopnje: graf seka os $x$, predznak se zamenja. Ničla sode stopnje: graf se osi dotakne, predznak ostane.
- Med sosednjima ničlama je predznak stalen; določiš ga z eno testno točko.
- Za velike $|x|$ je $p(x) \approx a_n x^n$. Sod $n$: kraka na isti strani; lih $n$: na nasprotnih. Predznak $a_n$ pove smer desnega kraka.
- Presečišče z osjo $y$ je $(0, p(0))$.

## Drugače: Na sliki

Os $x$ si predstavljaj kot gladino morja, graf pa kot pot delfina. Pri ničli lihe stopnje delfin preide gladino: iz vode skoči v zrak ali se iz zraka potopi. Pri ničli sode stopnje se gladine le dotakne s hrbtom in ostane na isti strani.

Za polinom iz primera 1 je vse to zbrano na sliki. Zgoraj je med ničlami zapisan predznak polinoma, spodaj pri vsaki ničli njena stopnja:

:::risba graf
opis: Graf polinoma p(x) = (x + 2)(x − 1)²(x − 3). Ničle so −2 (stopnja 1), 1 (stopnja 2) in 3 (stopnja 1). Levo od −2 je graf nad osjo x, med −2 in 1 pod njo, pri 1 se osi le dotakne, med 1 in 3 je spet pod njo, desno od 3 nad njo. Os y seka pri −6.
x: -3 .. 4
y: -20 .. 20 | 10
f: (x+2)*(x-1)^2*(x-3)
črta: -2; -20 -> -2; 20 | črtkano siva
črta: 1; -20 -> 1; 20 | črtkano siva
črta: 3; -20 -> 3; 20 | črtkano siva
točka: -2; 0
točka: 1; 0
točka: 3; 0
napis: -2,65; 12 | + | sredina | debelo
napis: -0,5; 12 | − | sredina | debelo
napis: 2; 12 | − | sredina | debelo
napis: 3,75; 12 | + | sredina | debelo
napis: -2; -17 | st. 1 | levo
napis: 1; -17 | st. 2 | desno
napis: 3; -17 | st. 1 | desno
:::

Pri ničli $1$ se predznak ne zamenja, ker je stopnja $2$ soda.

Obliko krakov si zapomniš s skico. Polinom sode stopnje s pozitivnim $a_n$ ima kraka kot črka U (oba gor), z negativnim kot obrnjen U. Polinom lihe stopnje s pozitivnim $a_n$ gre kot vzpenjajoča se pot od spodaj levo do zgoraj desno, z negativnim obratno.

## Drugače: Bolj natančno

**Zakaj prevlada vodilni člen.** Za $x \ne 0$ izpostavimo vodilni člen:

$$p(x) = a_n x^n \left(1 + \dfrac{a_{n-1}}{a_n x} + \dots + \dfrac{a_0}{a_n x^n}\right)$$

Vsak ulomek v oklepaju ima v imenovalcu potenco $x$, zato gre proti $0$, ko $|x|$ raste. Oklepaj gre proti $1$ in $p(x)$ se obnaša kot $a_n x^n$.

**Zakaj odloča parnost stopnje ničle.** Če je $c$ ničla stopnje $k$, je $p(x) = (x - c)^k s(x)$, kjer je $s(c) \ne 0$. Blizu $c$ polinom $s$ nima ničel, zato ima povsod tam isti predznak kot $s(c)$. Predznak $p$ se torej zamenja natanko takrat, ko se zamenja predznak $(x - c)^k$, to pa je pri lihem $k$.

**Faktorji brez ničel.** Faktor $x^2 + 1$ je vedno pozitiven, zato predznaka nikjer ne zamenja in grafa ne pripelje do osi. Polinom $(x - 2)(x^2 + 1)$ ima stopnjo $3$, a eno samo realno ničlo.

**Še dve dejstvi.** Polinom lihe stopnje ima vedno vsaj eno realno ničlo, saj sta kraka na nasprotnih straneh osi $x$. Graf polinoma stopnje $n$ ima največ $n - 1$ »obratov« (lokalnih ekstremov); to boš dokazal pri odvodih.

## Preveri se

? Katera trditev o ničli stopnje $2$ je pravilna?
- Graf tam seka os $x$, ker je to ničla.
~ Seka jo le pri ničli lihe stopnje. Faktor $(x - c)^2$ je na obeh straneh $c$ pozitiven.
+ Graf se tam dotakne osi $x$, predznak polinoma ostane enak.
- Polinom ima tam dve različni ničli, ki sta zelo blizu skupaj.
~ Ničla je ena sama; stopnja $2$ pove, da se faktor $(x - c)$ v razcepu ponovi dvakrat.
> Pri ničli sode stopnje se graf osi dotakne in obrne nazaj, predznak se ne zamenja.

? Koliko je $p(0)$ za $p(x) = -2(x - 1)^3(x + 4)^2$?
- $-32$
~ $(0 - 1)^3 = -1$, ne $1$: liha potenca negativnega števila je negativna.
+ $32$
- $8$
~ Izpustil si kvadrat: $(0 + 4)^2 = 16$, ne $4$.
- $-8$
~ Tu sta dve napaki hkrati: $(-1)^3$ si vzel kot $1$, $4^2$ pa kot $4$.
> $p(0) = -2 \cdot (-1)^3 \cdot 4^2 = -2 \cdot (-1) \cdot 16 = 32$.

? Jana je določila predznake polinoma $p(x) = (x + 1)(x - 2)^2$: za $x < -1$ negativen, med $-1$ in $2$ pozitiven, za $x > 2$ negativen. Kje se je zmotila?
- Za $x < -1$: tam je polinom pozitiven.
~ Testna točka $x = -2$ da $(-1) \cdot 16 = -16$, torej je Jana tu imela prav.
- Pri ničli $-1$: tam se predznak ne bi smel zamenjati.
~ Ničla $-1$ je stopnje $1$, liha, zato se predznak tam res zamenja.
+ Za $x > 2$: ničla $2$ je stopnje $2$, zato predznak ostane pozitiven.
> Jana je predznake le izmenjevala. Ničla $2$ je sode stopnje, graf se osi samo dotakne. Preizkus: $p(3) = 4 \cdot 1 = 4 > 0$.

? Primerjaj leva kraka grafov $p(x) = x^3 + 1000$ in $q(x) = -x^4 + x$. Kaj velja, ko gre $x \to -\infty$?
+ Oba gresta v $-\infty$.
- $p$ gre v $+\infty$ zaradi velikega prostega člena, $q$ v $-\infty$.
~ Prosti člen pri velikih $|x|$ ne odloča: že pri $x = -100$ je $x^3 = -1\,000\,000$.
- $p$ gre v $-\infty$, $q$ pa v $+\infty$, ker ima sodo stopnjo.
~ Soda stopnja pove le, da sta kraka na isti strani. Na kateri, določi predznak: $-x^4$ gre na obeh straneh v $-\infty$.
- Oba gresta v $+\infty$.
~ Pri $p$ je vodilni člen $x^3$ lihe stopnje, zato je levi krak na nasprotni strani od desnega, torej spodaj.
> Pri $p$ je vodilni člen $x^3$ (lih, pozitiven): levo $-\infty$. Pri $q$ je $-x^4$ (sod, negativen): oba kraka v $-\infty$.

? Temperaturo v $^\circ\mathrm{C}$ za $t$ ur po 18.00 opisuje model $T(t) = -0{,}1\,(t - 1)^2(t - 6)$, $0 \le t \le 7$. Kdaj je bila temperatura pod lediščem?
- Med $t = 1$ in $t = 6$.
~ Tako dobiš, če predznake le izmenjuješ. Ničla $1$ je sode stopnje, zato se predznak tam ne zamenja: $T(3) = 1{,}2\,^\circ\mathrm{C}$.
- Pred $t = 1$ in po $t = 6$.
~ Ob 18.00 je $T(0) = 0{,}6\,^\circ\mathrm{C}$, torej nad lediščem. Tudi tu je predznak pri sodi ničli napačno zamenjan.
- Le ob $t = 1$ in $t = 6$.
~ Takrat je temperatura natanko $0\,^\circ\mathrm{C}$. Pod lediščem pomeni $T < 0$.
+ Le po $t = 6$, torej po polnoči.
> Za $t > 6$ je $(t - 6) > 0$ in $(t - 1)^2 > 0$, pred njima pa $-0{,}1$, zato $T < 0$; npr. $T(7) = -3{,}6\,^\circ\mathrm{C}$. Pri sodi ničli $1$ se predznak ne zamenja, zato je pred $t = 6$ temperatura nad lediščem.

:::simboli
T | temperatura zraka | | ^\circ C | model iz uganke
t | čas po 18.00 | | h
p | polinom | |
x | neodvisna spremenljivka | |
a | koeficient pred oklepaji (vodilni koeficient) | |
x_1, x_2 | ničli polinoma | p(x_1) = 0 |
k_1, k_2, k_3 | stopnje ničel | | | eksponenti faktorjev v razcepu
n | stopnja polinoma | n = k_1 + k_2 + \dots |
a_n | vodilni koeficient | |
c | ničla polinoma | p(c) = 0 |
k | stopnja ničle $c$ | | | eksponent faktorja $(x - c)^k$
v | odmik gladine od običajne višine | | cm
d | čas od začetka merjenja | | dan
:::
