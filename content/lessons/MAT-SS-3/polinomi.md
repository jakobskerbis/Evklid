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

**Polinomska funkcija.** Funkcija, ki vsakemu realnemu številu $x$ priredi vrednost polinoma $p(x)$, je **polinomska funkcija**. Dve že dobro poznaš:

- **Linearna** $kx + n$ ($k \ne 0$): stopnja $1$, vodilni koeficient je smerni koeficient $k$, prosti člen je začetna vrednost $n$.
- **Kvadratna** $ax^2 + bx + c$ ($a \ne 0$): stopnja $2$, vodilni koeficient $a$, prosti člen $c$.

Konstantna funkcija $p(x) = a_0$ z $a_0 \ne 0$ je polinom stopnje $0$. Linearna in kvadratna funkcija sta torej posebna primera polinomske funkcije. Vse, kar velja za polinome, velja tudi zanju: polinom stopnje $1$ ima eno ničlo, polinom stopnje $2$ največ dve.

**Blok 2: vrednost in ničla.** Vrednost $p(a)$ dobiš, ko namesto $x$ vstaviš število $a$. Če je $p(a) = 0$, je $a$ **ničla** polinoma. Rešitve uganke so torej ničle polinoma $f$.

**Hitri test:** ali je $t = 4$ ničla $f$? *Odgovor: ne, $f(4) = 64 - 96 + 44 - 6 = 6$.*

**Blok 3: deljenje polinomov.** Polinome delimo podobno kot števila. Pri številih velja $157 = 12 \cdot 13 + 1$: deljenec je delitelj krat količnik plus ostanek, ostanek pa je manjši od delitelja. Pri polinomih »manjši« pomeni nižje stopnje:

$$p(x) = q(x)\,k(x) + r(x)$$

Tu je $p$ deljenec, $q$ delitelj, $k$ količnik in $r$ ostanek, ki ima nižjo stopnjo od $q$.

Razdelimo $(2x^3 - 3x^2 + 4x - 5) : (x - 2)$. V vsakem koraku delimo le vodilna člena, pomnožimo nazaj in odštejemo:

1. $2x^3 : x = 2x^2$. Pomnožimo z $x - 2$: $2x^3 - 4x^2$. Ostane $x^2 + 4x - 5$.
2. $x^2 : x = x$. Pomnožimo z $x - 2$: $x^2 - 2x$. Ostane $6x - 5$.
3. $6x : x = 6$. Pomnožimo z $x - 2$: $6x - 12$. Ostane $7$.

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

**Blok 5: Hornerjev algoritem.** Deljenje z $x - a$ gre krajše. V zgornjo vrstico napišemo le koeficiente (manjkajočo potenco nadomesti $0$). Prvi koeficient prepišemo v spodnjo vrstico. Nato ponavljamo: zadnje spodnje število pomnožimo z $a$, zmnožek zapišemo v srednjo vrstico pod naslednji koeficient in ju seštejemo. Za isti primer, $a = 2$:

| $2$ | $-3$ | $4$ | $-5$ |
|---|---|---|---|
| | $4$ | $2$ | $12$ |
| $2$ | $1$ | $6$ | $\mathbf{7}$ |

Spodnja vrstica so koeficienti količnika $2x^2 + x + 6$, zadnje število je ostanek $7$, torej tudi $p(2)$. En postopek da hkrati vrednost, ostanek in količnik.

:::premisli
Pri Hornerjevem algoritmu za deljenje z $x + 3$ moraš izbrati število $a$, s katerim množiš. Katero in zakaj?
---
Število $-3$, ker je $x + 3 = x - (-3)$. Algoritem vedno računa vrednost v točki $a$ iz zapisa $x - a$.
:::

**Blok 6: iskanje ničel.** Če ima polinom cele koeficiente, je vsaka cela ničla delitelj prostega člena. Zakaj? V $p(a) = 0$ so vsi členi razen $a_0$ deljivi z $a$, zato mora biti z $a$ deljiv tudi $a_0$. Pri uganki je prosti člen $-6$, zato so kandidati $\pm 1, \pm 2, \pm 3, \pm 6$. Ko najdemo $t = 1$, s Hornerjem dobimo količnik $t^2 - 5t + 6$, ta pa ima ničli $2$ in $3$:

$$f(t) = (t - 1)(t - 2)(t - 3).$$

Polinom stopnje $n$ ima največ $n$ ničel, zato četrtega trenutka ni. V simulaciji spodaj (»Polinom in njegove ničle«) postavi vodilni koeficient (drsnik a) na $1$ in ničle na $1$, $2$ in $3$, vse s stopnjo $1$ (stopnja ničle pove, kolikokrat se faktor $x - a$ ponovi). Opazi, da graf os $x$ seka natanko v teh točkah. Nato eni ničli nastavi stopnjo $0$: polinom izgubi faktor in eno presečišče.

**Hitri test:** kateri kandidati za cele ničle pridejo v poštev pri $x^3 + 2x - 5$? *Odgovor: $\pm 1$ in $\pm 5$.*

**Blok 7: osnovni izrek algebre.** Polinom $x^2 + 1$ nima nobene realne ničle. Med kompleksnimi števili pa ima dve: $i$ in $-i$, saj je $x^2 + 1 = (x - i)(x + i)$. To ni naključje.

**Osnovni izrek algebre:** vsak polinom stopnje $n \ge 1$ ima vsaj eno kompleksno ničlo. (Realna števila so tudi kompleksna.)

Izrek zagotovi le eno ničlo, a iz njega sledi veliko več:

1. **Razcep na linearne faktorje.** Ničla $z_1$ odcepi faktor $x - z_1$. Količnik ima stopnjo $n - 1$ in po izreku spet ničlo. Ko to ponovimo $n$-krat, dobimo $p(x) = a_n (x - z_1)(x - z_2)\cdots(x - z_n)$.
2. **Natanko $n$ ničel.** Polinom stopnje $n$ ima natanko $n$ kompleksnih ničel, če vsako štejemo tolikokrat, kolikor je njena stopnja. Polinom $(x - 2)^2(x + 1)$ ima ničle $2$, $2$ in $-1$.
3. **Konjugirani pari.** Če ima polinom realne koeficiente in je $z$ njegova ničla, je ničla tudi $\bar{z}$, in to z enako stopnjo. Konjugiranje namreč ohrani vsote in produkte, realnih koeficientov pa ne spremeni, zato je $p(\bar{z}) = \overline{p(z)} = \bar{0} = 0$.
4. **Realni razcep.** Za nerealno ničlo $z = u + wi$ ($w \ne 0$) je $(x - z)(x - \bar{z}) = x^2 - 2ux + u^2 + w^2$ kvadratni polinom z realnimi koeficienti in negativno diskriminanto. Zato vsak polinom z realnimi koeficienti razcepimo na faktorje z realnimi koeficienti: linearne in kvadratne brez realnih ničel.
5. **Liha stopnja.** Nerealne ničle pridejo v parih, zato jih je sodo mnogo. Polinom lihe stopnje z realnimi koeficienti ima torej vsaj eno realno ničlo.

Primer: $x^3 - 1 = (x - 1)(x^2 + x + 1)$. Kvadratni faktor ima diskriminanto $1 - 4 = -3$ in konjugirani ničli $-\frac{1}{2} \pm \frac{\sqrt{3}}{2}\,i$. Polinom ima tri kompleksne ničle, od tega eno realno.

**Hitri test:** polinom z realnimi koeficienti ima ničlo $3 - 2i$. Katera je zagotovo še njegova ničla? *Odgovor: $3 + 2i$.*

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

1. Vzamemo $a = -2$, v zgornjo vrstico napišemo koeficiente $2, 1, -8, 1$.
2. Prepišemo $2$, nato $2 \cdot (-2) + 1 = -3$.
3. Zadnja dva koraka naredi sam, nato preveri:

:::premisli
Kakšna sta količnik in ostanek?
---
$-3 \cdot (-2) - 8 = -2$ in $-2 \cdot (-2) + 1 = 5$. Količnik je $2x^2 - 3x - 2$, ostanek $5$. Preizkus: $p(-2) = -16 + 4 + 16 + 1 = 5$.
:::

### Primer 5: polinom iz kompleksne ničle

Sestavi polinom tretje stopnje z realnimi koeficienti in vodilnim koeficientom $1$, ki ima ničli $2$ in $1 + i$.

**Podatki:** stopnja $3$, realni koeficienti, $a_3 = 1$, ničli $2$ in $1 + i$
**Iščemo:** polinom $p(x)$ v razviti obliki

:::formula
$p(x) = (x - z_1)(x - z_2)(x - z_3)$; pri realnih koeficientih je z $z$ ničla tudi $\bar{z}$.
:::

**Rešitev:**

1. Koeficienti so realni, zato je ničla tudi $\overline{1 + i} = 1 - i$. Ničle so $2$, $1 + i$ in $1 - i$. Več jih ni, ker ima polinom stopnje $3$ natanko tri.
2. Konjugirana faktorja zmnožimo najprej, da $i$ izgine: $(x - 1 - i)(x - 1 + i) = (x - 1)^2 - i^2 = x^2 - 2x + 2$.
3. $p(x) = (x - 2)(x^2 - 2x + 2) = x^3 - 4x^2 + 6x - 4$.
4. Preizkus: $p(2) = 8 - 16 + 12 - 4 = 0$.
5. Odgovor: $p(x) = x^3 - 4x^2 + 6x - 4$.

## Pogoste napake

- **Manjkajoča potenca brez ničle.** Pri $2x^3 - 5x + 3$ nekdo v Hornerjevo shemo napiše le $2, -5, 3$ in računa, kot da gre za polinom druge stopnje. Vsaka potenca od najvišje do $x^0$ mora imeti svoje mesto, zato $2, 0, -5, 3$.
- **Napačen predznak števila $a$.** Pri deljenju z $x + 2$ se zdi naravno vzeti $2$. Algoritem pa računa v točki, kjer je delitelj enak $0$: $x + 2 = 0$ pri $x = -2$.
- **Odštevanje samo prvega člena.** Pri deljenju učenec odšteje $2x^3 - 4x^2$, a $-4x^2$ prišteje namesto odšteje in dobi $-7x^2$. Odštevaš cel oklepaj, zato se spremenijo vsi predznaki: $-3x^2 - (-4x^2) = x^2$.
- **Kandidati samo pozitivni.** Kdor preizkusi le $1, 3, 5, 15$, v Primeru 3 spregleda ničlo $-1$. Tam je za odgovor ne potrebujemo, pri polinomu z le negativnimi ničlami pa ne bi našel nobene. Kandidati so delitelji z obema predznakoma.
- **»Stopnja $3$ pomeni tri ničle.«** Stopnja pove, koliko ničel je **največ**. Polinom $x^3 + x$ ima eno samo realno ničlo, $0$.

## Povzetek

**Polinom** stopnje $n$ ($a_n \ne 0$):

$$p(x) = a_n x^n + \dots + a_1 x + a_0$$

- $a_n$ je **vodilni koeficient**, $a_0$ **prosti člen**.
- Linearna funkcija je polinomska funkcija stopnje $1$, kvadratna stopnje $2$.

**Deljenje:**

$$p(x) = q(x)\,k(x) + r(x)$$

- Stopnja ostanka je manjša od stopnje delitelja.
- Delimo vodilna člena, pomnožimo nazaj, odštejemo cel izraz.
- **Izrek o ostanku:** ostanek pri deljenju z $x - a$ je $p(a)$.
- Število $a$ je ničla natanko tedaj, ko $x - a$ deli $p$.
- **Hornerjev algoritem** da hkrati $p(a)$ in količnik; manjkajoče potence nadomesti $0$, pri $x + c$ vzemi $a = -c$.
- **Cele ničle** polinoma s celimi koeficienti so med delitelji prostega člena (oba predznaka).
- Polinom stopnje $n$ ima največ $n$ ničel.
- **Osnovni izrek algebre:** polinom stopnje $n \ge 1$ ima kompleksno ničlo, zato natanko $n$ kompleksnih ničel (štetih s stopnjo).
- Pri realnih koeficientih so nerealne ničle v konjugiranih parih, zato ima polinom lihe stopnje vsaj eno realno ničlo.

## Ponovitev

**Formule**
- $p(x) = q(x)\,k(x) + r(x)$, ostanek nižje stopnje (na pamet)
- ostanek pri deljenju z $x - a$ je $p(a)$ (na pamet)
- $p(a) = 0 \iff (x - a)$ deli $p(x)$ (na pamet)
- pri celih koeficientih so cele ničle delitelji prostega člena $a_0$, z obema predznakoma (na pamet)

**Postopek**
1. Zapiši koeficiente vseh potenc, manjkajoče z $0$.
2. Delitelje prostega člena preizkušaj s Hornerjem, dokler ne dobiš $p(a) = 0$.
3. Iz zadnje vrstice sheme preberi količnik $k(x)$.
4. Količnik razstavi naprej (pri stopnji $2$ s kvadratno enačbo).
5. Zapiši $p(x)$ kot produkt in naštej vse ničle.

**Pazi na**
- Manjkajoča potenca: v shemo napiši $0$ (pri $2x^3 - 5x + 3$ so to $2, 0, -5, 3$).
- Pri deljenju z $x + 2$ vzemi $a = -2$, ne $2$.
- Kandidati za ničle so delitelji z obema predznakoma, ne le pozitivni.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Določite realno število $m$ tako, da bo polinom $p(x) = x^3 + mx^2 - 4x + 12$ deljiv z $x - 2$. Nato zapišite količnik pri tem deljenju.

**Rešitev:**

1. Po izreku o ostanku je $p$ deljiv z $x - 2$ natanko tedaj, ko je $p(2) = 0$.
2. $p(2) = 8 + 4m - 8 + 12 = 4m + 12$. Iz $4m + 12 = 0$ sledi $m = -3$.
3. Hornerjev algoritem z $a = 2$ na koeficientih $1, -3, -4, 12$: $1$; $1 \cdot 2 - 3 = -1$; $-1 \cdot 2 - 4 = -6$; $-6 \cdot 2 + 12 = 0$.
4. Odgovor: $m = -3$, količnik je $k(x) = x^2 - x - 6$.

**Točkovanje:** 1 točka za pogoj $p(2) = 0$, 1 točka za $m = -3$, 1 točka za količnik $x^2 - x - 6$.

### Naloga 2: krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Dan je polinom $p(x) = 2x^3 - 3x^2 - 11x + 6$.

a) Pokažite, da je število $3$ ničla polinoma $p$. (1 točka)
b) Razcepite $p$ na linearne faktorje in zapišite vse njegove ničle. (3 točke)
c) Določite količnik in ostanek pri deljenju polinoma $p$ s polinomom $x^2 - 1$. (3 točke)

**Rešitev:**

1. a) $p(3) = 54 - 27 - 33 + 6 = 0$, zato je $3$ ničla.
2. b) Hornerjev algoritem z $a = 3$ na koeficientih $2, -3, -11, 6$: $2$; $2 \cdot 3 - 3 = 3$; $3 \cdot 3 - 11 = -2$; $-2 \cdot 3 + 6 = 0$. Količnik je $2x^2 + 3x - 2$.
3. b) Ničle količnika: $x = \dfrac{-3 \pm \sqrt{9 + 16}}{4} = \dfrac{-3 \pm 5}{4}$, torej $x = \dfrac{1}{2}$ ali $x = -2$. Zato je $2x^2 + 3x - 2 = (2x - 1)(x + 2)$.
4. b) $p(x) = (x - 3)(2x - 1)(x + 2)$; ničle so $3$, $\dfrac{1}{2}$ in $-2$.
5. c) $2x^3 : x^2 = 2x$; $2x(x^2 - 1) = 2x^3 - 2x$; ostane $-3x^2 - 9x + 6$.
6. c) $-3x^2 : x^2 = -3$; $-3(x^2 - 1) = -3x^2 + 3$; ostane $-9x + 3$, ki je prve stopnje, zato končamo.
7. c) Preizkus pri $x = 1$, kjer je $x^2 - 1 = 0$: $p(1) = 2 - 3 - 11 + 6 = -6$ in ostanek $-9 + 3 = -6$. Ujema se.
8. Odgovor: $p(x) = (x - 3)(2x - 1)(x + 2)$ z ničlami $3$, $\frac{1}{2}$ in $-2$; pri deljenju z $x^2 - 1$ je količnik $2x - 3$, ostanek $-9x + 3$.

**Točkovanje:** a) 1 točka za $p(3) = 0$; b) 1 točka za količnik $2x^2 + 3x - 2$, 1 točka za ničli $\frac{1}{2}$ in $-2$, 1 točka za razcep na linearne faktorje; c) 1 točka za pravilen prvi korak deljenja, 1 točka za količnik $2x - 3$, 1 točka za ostanek $-9x + 3$.

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Iz pravokotnega kosa kartona z merama $16\,\mathrm{cm}$ in $10\,\mathrm{cm}$ v vseh štirih vogalih izrežemo enake kvadrate s stranico $x$ (v centimetrih) in robove zapognemo navzgor. Nastane odprta škatla.

a) Zapišite prostornino škatle $V(x)$ kot polinom v razviti obliki in določite, za katere $x$ ima naloga smisel. (3 točke)
b) Določite vse $x$, pri katerih ima škatla prostornino $144\,\mathrm{cm^3}$. (5 točk)
c) Z razcepom iz b) zapišite $V(x) - 144$ kot produkt linearnih faktorjev in utemeljite, da nobena takšna škatla nima prostornine, večje od $144\,\mathrm{cm^3}$. (2 točki)

**Rešitev:**

1. a) Dno škatle meri $(16 - 2x)$ krat $(10 - 2x)$, višina je $x$. Zato $V(x) = x(16 - 2x)(10 - 2x)$.
2. a) $(16 - 2x)(10 - 2x) = 160 - 52x + 4x^2$, torej $V(x) = 4x^3 - 52x^2 + 160x$.
3. a) Vse tri mere morajo biti pozitivne: $x > 0$ in $10 - 2x > 0$ (takrat je tudi $16 - 2x > 0$). Naloga ima smisel za $0 < x < 5$.
4. b) $4x^3 - 52x^2 + 160x = 144$; delimo s $4$ in prenesemo: $x^3 - 13x^2 + 40x - 36 = 0$.
5. b) Cele ničle iščemo med delitelji $36$. $x = 1$: $1 - 13 + 40 - 36 = -8$; $x = 2$: $8 - 52 + 80 - 36 = 0$. Ničla je $2$.
6. b) Horner z $a = 2$ na $1, -13, 40, -36$: $1$; $-11$; $18$; $0$. Količnik $x^2 - 11x + 18 = (x - 2)(x - 9)$.
7. b) $x^3 - 13x^2 + 40x - 36 = (x - 2)^2(x - 9)$, ničli sta $2$ (dvojna) in $9$. Ker $9$ ni med $0$ in $5$, ostane $x = 2$.
8. c) Iz korakov 4–7: $V(x) - 144 = 4(x^3 - 13x^2 + 40x - 36) = 4(x - 2)^2(x - 9)$.
9. c) Za $0 < x < 5$ je $(x - 2)^2 \ge 0$ in $x - 9 < 0$, zato je $V(x) - 144 \le 0$, enakost pa velja le pri $x = 2$. Torej je $V(x) \le 144$.
10. Odgovor: $V(x) = 4x^3 - 52x^2 + 160x$ za $0 < x < 5$; prostornina je $144\,\mathrm{cm^3}$ le pri $x = 2\,\mathrm{cm}$, in to je največja možna prostornina.

**Točkovanje:** a) 1 točka za $V(x) = x(16 - 2x)(10 - 2x)$, 1 točka za razvito obliko, 1 točka za $0 < x < 5$; b) 1 točka za enačbo $x^3 - 13x^2 + 40x - 36 = 0$, 1 točka za najdeno ničlo $2$, 1 točka za količnik $x^2 - 11x + 18$, 1 točka za ničli $2$ in $9$, 1 točka za izločitev $x = 9$ in odgovor $x = 2$; c) 1 točka za razcep $V(x) - 144 = 4(x - 2)^2(x - 9)$, 1 točka za utemeljitev s predznakoma faktorjev.

### Ustno vprašanje 1

:::premisli
Kaj pove izrek o deljenju polinomov in kaj iz njega sledi pri deljenju polinoma z linearnim polinomom $x - a$?
---
Za polinoma $p$ in $q \ne 0$ obstajata natanko en količnik $k$ in natanko en ostanek $r$, da velja $p = q k + r$, pri čemer je $r = 0$ ali pa ima $r$ nižjo stopnjo kot $q$. Pri deljenju z $x - a$ je ostanek zato konstanta. Ko v $p(x) = (x - a)\,k(x) + r$ vstavimo $x = a$, dobimo $r = p(a)$. Od tod sledi, da je $a$ ničla polinoma $p$ natanko tedaj, ko je $p$ deljiv z $x - a$.
:::

### Ustno vprašanje 2

:::premisli
Dokaži, da je vsaka cela ničla polinoma s celimi koeficienti delitelj njegovega prostega člena.
---
Naj bo celo število $a$ ničla polinoma $p(x) = a_n x^n + \dots + a_1 x + a_0$ s celimi koeficienti, torej $a_n a^n + \dots + a_1 a + a_0 = 0$. Od tod je $a_0 = -a\,(a_n a^{n-1} + \dots + a_1)$. Izraz v oklepaju je celo število, ker so koeficienti in $a$ cela števila. Zato je $a_0$ večkratnik števila $a$, torej je $a$ delitelj prostega člena.
:::

### Ustno vprašanje 3

:::premisli
Navedi primer polinoma tretje stopnje z eno samo realno ničlo in pojasni, zakaj ima polinom stopnje $n$ največ $n$ ničel.
---
Primer je $p(x) = x^3 + x = x(x^2 + 1)$: faktor $x^2 + 1$ je vedno pozitiven, zato je edina realna ničla $0$. Vsaka ničla $a$ odcepi linearni faktor $x - a$, saj je polinom po izreku o ostanku deljiv z $x - a$, količnik $k$ pa ima stopnjo za $1$ nižjo. Vsaka druga ničla $b \ne a$ je ničla količnika, saj iz $(b - a)\,k(b) = 0$ in $b - a \ne 0$ sledi $k(b) = 0$. Ker stopnja pri vsakem odcepu pade za $1$ in polinom stopnje $0$ nima ničel, ima polinom stopnje $n$ največ $n$ različnih ničel.
:::

## Drugače: Na sliki

Nariši graf $f(t) = (t - 1)(t - 2)(t - 3)$ in zraven tabelo predznakov (v srednjem stolpcu so po vrsti predznaki faktorjev $t - 1$, $t - 2$ in $t - 3$):

| interval | predznaki | $f(t)$ |
|---|---|---|
| $t < 1$ | $-\ -\ -$ | $-$ |
| $1 < t < 2$ | $+\ -\ -$ | $+$ |
| $2 < t < 3$ | $+\ +\ -$ | $-$ |
| $t > 3$ | $+\ +\ +$ | $+$ |

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
- Množiti bi morala z $a = -2$.
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

? (brez računala) Kolikšna je stopnja polinomske funkcije $p(x) = (2x - 1)^2 - 4x^2$?
= 1 | 0
~ 2 | Kvadrat binoma da $4x^2 - 4x + 1$, člen $4x^2$ pa se odšteje. Ostane $-4x + 1$.
~ 4 | Stopnje se pri kvadriranju ne seštevajo tako: $(2x - 1)^2$ je stopnje $2$, ne $4$.
> $p(x) = 4x^2 - 4x + 1 - 4x^2 = -4x + 1$. To je linearna funkcija, torej polinomska funkcija stopnje $1$.

? Polinom četrte stopnje z realnimi koeficienti ima ničli $1 + 2i$ in $-3i$. Koliko realnih ničel ima?
= 0 | 0
~ 2 | Pozabil si na konjugirani števili: ničli sta tudi $1 - 2i$ in $3i$. To so že štiri ničle.
~ 1 | Polinom četrte stopnje ima natanko štiri kompleksne ničle, štete s stopnjo; vse štiri so že znane.
> Pri realnih koeficientih sta ničli tudi $1 - 2i$ in $3i$. Polinom stopnje $4$ ima natanko štiri ničle, zato realnih ni.

<<RACUN
resi: 4*m+12=0 | m | -3
vrednost: 2^3-3*2^2-4*2+12 | 0
enako: (x^3-3*x^2-4*x+12)/(x-2) | x^2-x-6
vrednost: 2*3^3-3*3^2-11*3+6 | 0
enako: (2*x^3-3*x^2-11*x+6)/(x-3) | 2*x^2+3*x-2
enako: 2*x^3-3*x^2-11*x+6 | (x-3)*(2*x-1)*(x+2)
resi: 2*x^3-3*x^2-11*x+6=0 | x | -2, 1/2, 3
enako: 2*x^3-3*x^2-11*x+6 | (x^2-1)*(2*x-3)-9*x+3
enako: x*(16-2*x)*(10-2*x) | 4*x^3-52*x^2+160*x
enako: (x^3-13*x^2+40*x-36)/(x-2) | x^2-11*x+18
enako: x^3-13*x^2+40*x-36 | (x-2)^2*(x-9)
resi: 4*x^3-52*x^2+160*x=144 | x | 2, 9
enako: 4*x^3-52*x^2+160*x-144 | 4*(x-2)^2*(x-9)
enako: (x-1-I)*(x-1+I) | x^2-2*x+2
enako: (x-2)*(x^2-2*x+2) | x^3-4*x^2+6*x-4
vrednost: 2^3-4*2^2+6*2-4 | 0
enako: x^3-1 | (x-1)*(x^2+x+1)
enako: (2*x-1)^2-4*x^2 | -4*x+1
>>

:::simboli
p | polinom (deljenec) | p(x) = a_n x^n + \dots + a_0 |
x | spremenljivka | |
a_n | vodilni koeficient | | | ni enak $0$
a_{n-1}, a_1 | koeficienti | |
a_0 | prosti člen | |
n | stopnja polinoma | | | največji eksponent; pri linearni funkciji $kx + n$ začetna vrednost
q | delitelj | |
k | količnik | | | pri linearni funkciji $kx + n$ smerni koeficient
r | ostanek | r = p(a) | | pri deljenju z $x - a$
a | število, v katerem računamo vrednost | | | iz delitelja $x - a$; pri kvadratni funkciji $ax^2 + bx + c$ vodilni koeficient
b | linearni koeficient kvadratne funkcije $ax^2 + bx + c$ | |
c | prosti člen kvadratne funkcije $ax^2 + bx + c$ | | | v delitelju $x + c$ je $a = -c$
z | kompleksna ničla polinoma | | | $z = u + wi$
\bar{z} | konjugirano število ničle $z$ | | | $u - wi$
z_1, z_2, z_3 | ničle polinoma | | | štete s stopnjo
f | odmik teleskopa od tarče | | ^\circ
t | čas | | min
h | odmik sonde od tirnice | | m
:::
