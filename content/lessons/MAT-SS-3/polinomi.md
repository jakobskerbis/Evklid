---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Uganka za začetek. Vesoljski teleskop se med manevrom obrača. Odmik od tarče (v stopinjah) opisuje izraz

$$f(t) = t^3 - 6t^2 + 11t - 6,$$

kjer je $t$ čas v minutah. Kdaj je teleskop natančno usmerjen v tarčo, torej kdaj je $f(t) = 0$? Preden bereš naprej, vstavi nekaj celih števil: $0$, $1$, $2$, $3$, $4$.

Če si vztrajal, si našel tri trenutke: $t = 1$, $t = 2$ in $t = 3$. Ostajata dve vprašanji. Ali obstaja še četrti? In kako bi rešitve našel, če ugibanje ne bi uspelo že pri malih številih? Odgovor ponujajo **polinomi**: znamo jih deliti, hitro izračunati njihove vrednosti in iz ene najdene ničle dobiti ostale.

## Razlaga

Snov gradimo po blokih. Vsak blok se konča s kratkim preizkusom.

**Blok 1: polinom.** Izraz $f(t)$ iz uganke je **polinom**: vsota členov oblike število krat potenca spremenljivke z eksponentom $0, 1, 2, \dots$. Splošno ga zapišemo

$$p(x) = a_n x^n + a_{n-1}x^{n-1} + \dots + a_1 x + a_0, \quad a_n \ne 0.$$

Števila $a_n, \dots, a_0$ so **koeficienti**. Največji eksponent $n$ je **stopnja**, $a_n$ je **vodilni koeficient**, $a_0$ pa **prosti člen** (člen brez $x$).

**Hitri test:** kakšne so stopnja, vodilni koeficient in prosti člen polinoma $p(x) = 4 - 2x^3 + x$? *Odgovor: stopnja $3$, vodilni koeficient $-2$, prosti člen $4$; vrstni red zapisa ne šteje.*

**Blok 2: vrednost in ničla.** Vrednost $p(a)$ dobiš, ko namesto $x$ vstaviš število $a$. Če je $p(a) = 0$, je $a$ **ničla** polinoma. Rešitve uganke so torej ničle polinoma $f$.

**Hitri test:** ali je $t = 4$ ničla $f$? *Odgovor: ne, $f(4) = 64 - 96 + 44 - 6 = 6$.*

**Blok 3: deljenje polinomov.** Polinome delimo podobno kot števila. Pri številih velja $157 = 12 \cdot 13 + 1$: deljenec je delitelj krat količnik plus ostanek, ostanek pa je manjši od delitelja. Pri polinomih »manjši« pomeni nižje stopnje:

$$p(x) = q(x)\,k(x) + r(x)$$

Tu je $p$ deljenec, $q$ delitelj, $k$ količnik in $r$ ostanek, ki ima nižjo stopnjo od $q$.

Razdelimo $(2x^3 - 3x^2 + 4x - 5) : (x - 2)$. V vsakem koraku delimo le vodilna člena, pomnožimo nazaj in odštejemo:

| korak | vodilna člena | pomnožimo z $x - 2$ | ostane |
|---|---|---|---|
| 1 | $2x^3 : x = 2x^2$ | $2x^3 - 4x^2$ | $x^2 + 4x - 5$ |
| 2 | $x^2 : x = x$ | $x^2 - 2x$ | $6x - 5$ |
| 3 | $6x : x = 6$ | $6x - 12$ | $7$ |

Količnik je $k(x) = 2x^2 + x + 6$, ostanek $r = 7$. Ustavimo se, ko ima to, kar ostane, nižjo stopnjo od delitelja.

:::premisli
Izračunaj $p(2)$ za $p(x) = 2x^3 - 3x^2 + 4x - 5$. Kaj opaziš, ko rezultat primerjaš z ostankom?
---
$p(2) = 16 - 12 + 8 - 5 = 7$, kar je točno ostanek. To ni slučaj: v zapisu $p(x) = (x - 2)\,k(x) + 7$ pri $x = 2$ prvi člen izgine.
:::

**Blok 4: izrek o ostanku.** Premislek posplošimo. Pri deljenju z $x - a$ je ostanek število in velja

$$p(x) = (x - a)\,k(x) + r, \qquad r = p(a).$$

Od tod sledi najpomembnejša posledica: **$a$ je ničla polinoma natanko tedaj, ko je $p$ deljiv z $x - a$.** Vsaka najdena ničla torej odcepi faktor $x - a$ in polinom zniža za eno stopnjo.

**Hitri test:** kolikšen je ostanek pri deljenju $x^2 + 1$ z $x - 3$? *Odgovor: $3^2 + 1 = 10$, deliti ni treba.*

**Blok 5: Hornerjev algoritem.** Deljenje z $x - a$ gre krajše. Napišemo le koeficiente (manjkajočo potenco nadomesti $0$), levo pa $a$. Prvi koeficient prepišemo v spodnjo vrstico. Nato ponavljamo: zadnje spodnje število pomnožimo z $a$, zmnožek zapišemo v srednjo vrstico pod naslednji koeficient in ju seštejemo. Za isti primer, $a = 2$:

```
     |  2   -3    4   -5
  2  |       4    2   12
     |  2    1    6 |  7
```

Spodnja vrstica so koeficienti količnika $2x^2 + x + 6$, zadnje število je ostanek $7$, torej tudi $p(2)$. En postopek da hkrati vrednost, ostanek in količnik.

:::premisli
Pri Hornerjevem algoritmu za deljenje z $x + 3$ moraš na levo napisati neko število. Katero in zakaj?
---
Število $-3$, ker je $x + 3 = x - (-3)$. Algoritem vedno računa vrednost v točki $a$ iz zapisa $x - a$.
:::

**Blok 6: iskanje ničel.** Če ima polinom cele koeficiente, je vsaka cela ničla delitelj prostega člena. Zakaj? V $p(a) = 0$ so vsi členi razen $a_0$ deljivi z $a$, zato mora biti z $a$ deljiv tudi $a_0$. Pri uganki je prosti člen $-6$, zato so kandidati $\pm 1, \pm 2, \pm 3, \pm 6$. Ko najdemo $t = 1$, s Hornerjem dobimo količnik $t^2 - 5t + 6$, ta pa ima ničli $2$ in $3$:

$$f(t) = (t - 1)(t - 2)(t - 3).$$

Polinom stopnje $n$ ima največ $n$ ničel, zato četrtega trenutka ni. V simulaciji spodaj (»Polinom in njegove ničle«) postavi vodilni koeficient (drsnik a) na $1$ in ničle na $1$, $2$ in $3$, vse s stopnjo $1$ (stopnja ničle pove, kolikokrat se faktor $x - a$ ponovi). Opazi, da graf os $x$ seka natanko v teh točkah. Nato eni ničli nastavi stopnjo $0$: polinom izgubi faktor in eno presečišče.

**Hitri test:** kateri kandidati za cele ničle pridejo v poštev pri $x^3 + 2x - 5$? *Odgovor: $\pm 1$ in $\pm 5$.*

## Rešeni primeri

### Primer 1 (lažji): ali je število ničla?

S Hornerjevim algoritmom preveri, ali je $x = 3$ ničla polinoma $p(x) = x^3 - 2x^2 - 5x + 6$, in zapiši količnik pri deljenju z $x - 3$.

**Podatki:** $p(x) = x^3 - 2x^2 - 5x + 6$, $a = 3$
**Iščemo:** $p(3)$ in količnik $k(x)$

:::formula
Hornerjev algoritem: prepiši prvi koeficient, nato »pomnoži z $a$, prištej naslednjega«; zadnje število je $p(a)$.
:::

**Rešitev:**

1. Koeficienti: $1, -2, -5, 6$; nobena potenca ne manjka, ničel ni treba dodajati.
2. Prepišemo $1$. Naprej: $1 \cdot 3 - 2 = 1$, nato $1 \cdot 3 - 5 = -2$, nato $-2 \cdot 3 + 6 = 0$.
3. Zadnje število je $0$, torej $p(3) = 0$.
4. Odgovor: $x = 3$ je ničla, količnik je $k(x) = x^2 + x - 2$, zato $p(x) = (x - 3)(x^2 + x - 2)$.

### Primer 2: deljenje s polinomom druge stopnje

Deli $(x^4 - 3x^3 + x - 5) : (x^2 + 1)$.

**Podatki:** deljenec $p(x) = x^4 - 3x^3 + x - 5$, delitelj $q(x) = x^2 + 1$
**Iščemo:** količnik $k(x)$ in ostanek $r(x)$

:::formula
$p(x) = q(x)\,k(x) + r(x)$, stopnja $r$ manjša od $2$
:::

**Rešitev:**

1. Delitelj ni oblike $x - a$, zato Hornerja ne moremo uporabiti in delimo »peš«. Deljenec dopolnimo z manjkajočim členom: $x^4 - 3x^3 + 0x^2 + x - 5$. Tako se pri odštevanju stolpci ne zamaknejo.
2. $x^4 : x^2 = x^2$; $x^2(x^2 + 1) = x^4 + x^2$; ostane $-3x^3 - x^2 + x - 5$.
3. $-3x^3 : x^2 = -3x$; $-3x(x^2 + 1) = -3x^3 - 3x$; ostane $-x^2 + 4x - 5$.
4. $-x^2 : x^2 = -1$; $-1 \cdot (x^2 + 1) = -x^2 - 1$; ostane $4x - 4$. Ta je prve stopnje, zato končamo.
5. Preizkus pri $x = 2$: $p(2) = -11$, desna stran $5 \cdot (-3) + 4 = -11$. Ujema se.
6. Odgovor: $k(x) = x^2 - 3x - 1$, $r(x) = 4x - 4$.

### Primer 3 (težji): sonda na tirnici

Med popravkom tirnice opisuje odmik vesoljske sonde od načrtovane tirnice (v metrih) polinom $h(t) = t^3 - 7t^2 + 7t + 15$, kjer je $t$ čas v minutah od začetka popravka, $0 \le t \le 6$. Kdaj je sonda točno na tirnici?

**Podatki:** $h(t) = t^3 - 7t^2 + 7t + 15$, $0 \le t \le 6$ (min)
**Iščemo:** čase $t$, pri katerih je $h(t) = 0$

:::formula
Cele ničle so med delitelji prostega člena; ko najdeš ničlo $a$, s Hornerjem dobiš $h(t) = (t - a)\,k(t)$.
:::

**Rešitev:**

1. Kandidati so delitelji $15$: $\pm 1, \pm 3, \pm 5, \pm 15$.
2. $h(1) = 1 - 7 + 7 + 15 = 16$, ni ničla. $h(-1) = -1 - 7 - 7 + 15 = 0$, je ničla.
3. Horner z $a = -1$: $1$; $1 \cdot (-1) - 7 = -8$; $-8 \cdot (-1) + 7 = 15$; $15 \cdot (-1) + 15 = 0$. Količnik je $t^2 - 8t + 15$.
4. Kvadratni del razstavimo: $t^2 - 8t + 15 = (t - 3)(t - 5)$, ker $3 \cdot 5 = 15$ in $3 + 5 = 8$.
5. Torej $h(t) = (t + 1)(t - 3)(t - 5)$, ničle so $-1$, $3$ in $5$.
6. Ničla $t = -1$ je pred začetkom popravka, zato je za nalogo nesmiselna.
7. Odgovor: sonda je na tirnici $3$ minute in $5$ minut po začetku popravka.

### Primer 4 – zdaj ti

Določi količnik in ostanek pri deljenju $p(x) = 2x^3 + x^2 - 8x + 1$ z $x + 2$.

**Podatki:** $p(x) = 2x^3 + x^2 - 8x + 1$, delitelj $x + 2$
**Iščemo:** količnik $k(x)$ in ostanek $r$

:::formula
$x + 2 = x - (-2)$, zato Horner z $a = -2$; ostanek $r = p(-2)$.
:::

**Rešitev:**

1. Na levo napišemo $-2$, zgoraj koeficiente $2, 1, -8, 1$.
2. Prepišemo $2$, nato $2 \cdot (-2) + 1 = -3$.
3. Zadnja dva koraka naredi sam, nato preveri:

:::premisli
Kakšna sta količnik in ostanek?
---
$-3 \cdot (-2) - 8 = -2$ in $-2 \cdot (-2) + 1 = 5$. Količnik je $2x^2 - 3x - 2$, ostanek $5$. Preizkus: $p(-2) = -16 + 4 + 16 + 1 = 5$.
:::

## Pogoste napake

- **Manjkajoča potenca brez ničle.** Pri $2x^3 - 5x + 3$ nekdo v Hornerjevo shemo napiše le $2, -5, 3$ in računa, kot da gre za polinom druge stopnje. Vsaka potenca od najvišje do $x^0$ mora imeti svoje mesto, zato $2, 0, -5, 3$.
- **Napačen predznak števila $a$.** Pri deljenju z $x + 2$ se zdi naravno vzeti $2$. Algoritem pa računa v točki, kjer je delitelj enak $0$: $x + 2 = 0$ pri $x = -2$.
- **Odštevanje samo prvega člena.** Pri deljenju učenec odšteje $2x^3 - 4x^2$, a $-4x^2$ prišteje namesto odšteje in dobi $-7x^2$. Odštevaš cel oklepaj, zato se spremenijo vsi predznaki: $-3x^2 - (-4x^2) = x^2$.
- **Kandidati samo pozitivni.** Kdor preizkusi le $1, 3, 5, 15$, v Primeru 3 spregleda ničlo $-1$. Tam je za odgovor ne potrebujemo, pri polinomu z le negativnimi ničlami pa ne bi našel nobene. Kandidati so delitelji z obema predznakoma.
- **»Stopnja $3$ pomeni tri ničle.«** Stopnja pove, koliko ničel je **največ**. Polinom $x^3 + x$ ima eno samo realno ničlo, $0$.

## Povzetek

- Polinom: $p(x) = a_n x^n + \dots + a_1 x + a_0$, $a_n \ne 0$; $n$ je stopnja, $a_n$ vodilni koeficient, $a_0$ prosti člen.
- Deljenje: $p(x) = q(x)\,k(x) + r(x)$, stopnja ostanka je manjša od stopnje delitelja. Delimo vodilna člena, pomnožimo nazaj, odštejemo cel izraz.
- Izrek o ostanku: ostanek pri deljenju z $x - a$ je $p(a)$. Število $a$ je ničla natanko tedaj, ko $x - a$ deli $p$.
- Hornerjev algoritem da hkrati $p(a)$ in količnik; manjkajoče potence nadomesti $0$, pri $x + c$ vzemi $a = -c$.
- Cele ničle polinoma s celimi koeficienti so med delitelji prostega člena (oba predznaka). Polinom stopnje $n$ ima največ $n$ ničel.

## Drugače: Na sliki

Nariši graf $f(t) = (t - 1)(t - 2)(t - 3)$ in zraven tabelo predznakov:

| interval | $t - 1$ | $t - 2$ | $t - 3$ |
|---|---|---|---|
| $t < 1$ | $-$ | $-$ | $-$ |
| $1 < t < 2$ | $+$ | $-$ | $-$ |
| $2 < t < 3$ | $+$ | $+$ | $-$ |
| $t > 3$ | $+$ | $+$ | $+$ |

Produkt je zaporedoma negativen, pozitiven, negativen in pozitiven. Graf torej prihaja od spodaj, pri $1$ preseka os $t$ navzgor, pri $2$ navzdol in pri $3$ spet navzgor. Vsak faktor $t - a$ je na sliki eno presečišče z osjo pri $t = a$. Ko s Hornerjem odcepiš faktor, z grafa »odstraniš« eno presečišče, preostale ničle pa ostanejo na istih mestih.

## Drugače: Bolj natančno

**Izrek o deljenju.** Za polinoma $p$ in $q \ne 0$ obstajata natanko en količnik $k$ in natanko en ostanek $r$, da velja $p = q k + r$ in je $r = 0$ ali pa je stopnja $r$ manjša od stopnje $q$.

**Dokaz izreka o ostanku.** Pri $q(x) = x - a$ je stopnja ostanka manjša od $1$, zato je $r$ konstanta. Vstavimo $x = a$: $p(a) = (a - a)\,k(a) + r = r$.

**Največ $n$ ničel.** Vsaka ničla odcepi en linearni faktor in zniža stopnjo za $1$. Po $n$ korakih ostane konstanta $a_n \ne 0$, ki nima ničel. Ničla se lahko ponovi, npr. pri $(x - 2)^2(x + 1)$ je $2$ **dvojna** ničla; tam se graf osi le dotakne.

**Racionalne ničle.** Če ima polinom s celimi koeficienti ničlo $\frac{m}{s}$ (okrajšan ulomek), potem $m$ deli $a_0$ in $s$ deli $a_n$. Pri $a_n = 1$ so zato vse racionalne ničle cela števila.

## Preveri se

? Kaj velja za polinom $p(x) = 3x^4 - x + 7$?
- Stopnja je $3$, ker ima polinom tri člene.
~ Stopnja je največji eksponent, ne število členov.
- Vodilni koeficient je $7$, ker stoji na koncu.
~ $7$ je prosti člen. Vodilni koeficient pripada najvišji potenci.
+ Stopnja je $4$, prosti člen je $7$.
> Najvišja potenca je $x^4$ s koeficientom $3$; člen brez $x$ je $7$.

? Kolikšen je ostanek pri deljenju $x^3 - 2x + 4$ z $x - 3$?
- $-17$
~ To je $p(-3)$. Pri deljenju z $x - 3$ vstaviš $3$, ne $-3$.
- $7$
~ Tako dobiš, če v Hornerju izpustiš $0$ za manjkajoči $x^2$ in računaš z $1, -2, 4$.
+ $25$
> Izrek o ostanku: $p(3) = 27 - 6 + 4 = 25$.

? Ana deli $2x^3 - 5x + 3$ z $x - 2$. V Hornerjevo shemo napiše koeficiente $2, -5, 3$ in dobi ostanek $1$. Kje je napaka?
- Na levo bi morala napisati $-2$.
~ Pri $x - 2$ je $a = 2$; minus bi potrebovala pri $x + 2$.
+ Za manjkajoči člen $x^2$ bi morala vpisati koeficient $0$.
- Koeficiente bi morala pisati od najnižje potence navzgor.
~ Hornerjeva shema začne pri najvišji potenci; vrstni red je bil pravilen.
- Napake ni, ostanek je res $1$.
~ Preizkus pove drugače: $p(2) = 16 - 10 + 3 = 9$.
> S koeficienti $2, 0, -5, 3$: $2$; $4$; $3$; $9$. Ostanek je $9$.

? Primerjaj ostanka pri deljenju $p(x) = x^3 - x$ z $x - 2$ in z $x + 2$.
- Oba sta $6$.
~ Lihe potence spremenijo predznak: $(-2)^3 = -8$, zato $p(-2) \ne p(2)$.
- Prvi je $-6$, drugi $6$.
~ Zamenjal si predznaka $a$: pri $x - 2$ vstaviš $2$, pri $x + 2$ pa $-2$.
+ Prvi je $6$, drugi $-6$.
> $p(2) = 8 - 2 = 6$ in $p(-2) = -8 + 2 = -6$.

? Odmik sonde od tirnice opisuje $h(t) = t^3 - 2t^2 - 9t + 18$ ($t$ v minutah, $t \ge 0$). Velja $h(t) = (t - 2)(t - 3)(t + 3)$. Kdaj je sonda na tirnici?
- Pri $t = 2$, $t = 3$ in $t = -3$ minute.
~ Ničla $-3$ je pravilna za polinom, a negativni čas je pred začetkom in ni smiseln.
- Samo pri $t = 2$ minuti.
~ Po prvi ničli se iskanje ne konča; količnik $t^2 - 9$ da še $t = 3$.
- Pri $t = 18$ minutah.
~ $18$ je prosti člen, ne ničla: $h(18) \ne 0$.
+ Pri $t = 2$ in $t = 3$ minutah.
> Ničle so $2$, $3$ in $-3$; v poštev prideta le nenegativni.

:::simboli
p | polinom (deljenec) | p(x) = a_n x^n + \dots + a_0 |
x | spremenljivka | |
a_n | vodilni koeficient | | | ni enak $0$
a_{n-1}, a_1 | koeficienti | |
a_0 | prosti člen | |
n | stopnja polinoma | | | največji eksponent
q | delitelj | |
k | količnik | |
r | ostanek | r = p(a) | | pri deljenju z $x - a$
a | število, v katerem računamo vrednost | | | iz delitelja $x - a$
f | odmik teleskopa od tarče | | ^\circ
t | čas | | min
h | odmik sonde od tirnice | | m
:::
