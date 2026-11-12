---
stanje: osnutek
demo: vieta
avtor: AI
---

## Zakaj se tega učimo

Jan si v sobi ureja domači studio. Zvok se mu odbija od gole stene, zato bo nanjo obesil pravokotno akustično ploščo. Za okvir ima letev, dolgo točno $3\,\mathrm{m}$, in kos absorpcijske pene s ploščino $0{,}5\,\mathrm{m^2}$. Porabiti hoče oboje brez ostanka. Kako dolgi naj bosta stranici?

Jan ne pozna stranic, pozna pa njuno vsoto, $1{,}5\,\mathrm{m}$ (polovica obsega), in njun produkt, $0{,}5\,\mathrm{m^2}$. Natanko to sta podatka, ki ju o ničlah kvadratnega polinoma povedo njegovi koeficienti. François Viète je to zvezo med ničlami in koeficienti opisal že v 16. stoletju. Na tekmovanjih je eno najpogostejših orodij: ničel pogosto sploh ne izračunaš, ker zadoščajo njihove vsote in produkti.

## Razlaga

**1. Ničle na grafu.** **Ničla** polinoma $p$ je število $x_0$, pri katerem je $p(x_0) = 0$; tam graf seka os $x$. Spodaj je graf polinoma, ki smo ga sestavili iz treh ničel: $p(x) = (x - 1)(x - 2)(x - 3)$.

:::risba graf
opis: Graf kubičnega polinoma p(x) = (x − 1)(x − 2)(x − 3). Graf seka os x v točkah 1, 2 in 3. Med 1 in 2 je nad osjo, med 2 in 3 pod njo.
x: -1 .. 4 | 1 | x
y: -4 .. 5 | 1 | y
f: (x-1)*(x-2)*(x-3) | modra | 0,3 .. 3,8
točka: 1; 0 | x₁ = 1 | levo
točka: 2; 0 | x₂ = 2 | nad
točka: 3; 0 | x₃ = 3 | desno
:::

Ko oklepaje zmnožiš, dobiš $p(x) = x^3 - 6x^2 + 11x - 6$. Primerjaj ničle s koeficienti:

| | vsota ničel | produkti po dveh | produkt ničel |
|---|---|---|---|
| iz ničel $1, 2, 3$ | $6$ | $2 + 3 + 6 = 11$ | $6$ |
| koeficient v $p(x)$ | $-6$ | $11$ | $-6$ |

Vsak koeficient je ena od teh vsot, predznaki pa se izmenjujejo: minus, plus, minus.

:::premisli
Polinom $(x - 1)(x - 2)(x - 3)(x - 4)$ ima vodilni koeficient $1$. Napovej njegov prosti člen, ne da bi množil oklepaje.
---
$+24$. Prosti člen je produkt vseh $(-x_i)$, torej $(-1)(-2)(-3)(-4) = 24$. Pri sodem številu ničel se minusi pokrajšajo.
:::

**2. Deljenje z $x - x_0$.** Vsak polinom $p$ lahko delimo z $x - x_0$ tako kot števila: dobimo količnik $q$ in ostanek $r$.

$$p(x) = (x - x_0)\,q(x) + r$$

Delitelj ima stopnjo $1$, zato je ostanek samo število. Če vstaviš $x = x_0$, oklepaj izgine in ostane $r = p(x_0)$. To je **izrek o ostanku**. Iz njega sledi **faktorski izrek**: $x_0$ je ničla natanko tedaj, ko $x - x_0$ deli $p(x)$.

Deliš najhitreje s **Hornerjevim algoritmom**. V prvo vrstico prepišeš koeficiente. Vodilni koeficient spustiš v zadnjo vrstico, ga pomnožiš z $x_0$ in rezultat zapišeš pod naslednji koeficient. Stolpec sešteješ, vsoto zapišeš v zadnjo vrstico in ponoviš. Za $x^3 - 6x^2 + 11x - 6$ in $x_0 = 1$:

| $1$ | $-6$ | $11$ | $-6$ |
|---|---|---|---|
| | $1$ | $-5$ | $6$ |
| $1$ | $-5$ | $6$ | $0$ |

Zadnja vrstica brez zadnjega števila so koeficienti količnika $x^2 - 5x + 6$; zadnje število je ostanek $0$, torej je $1$ res ničla.

Pri delitelju višje stopnje je ostanek polinom, njegova stopnja pa je nižja od stopnje delitelja. Tipična tekmovalna naloga: polinom da pri deljenju z $x - 1$ ostanek $3$, pri deljenju z $x - 2$ pa ostanek $5$. Kolikšen je ostanek pri deljenju z $(x - 1)(x - 2)$? Delitelj je kvadraten, zato je ostanek oblike $ux + v$. Ko vstaviš $x = 1$ in $x = 2$, delitelj izgine in po izreku o ostanku dobiš $u + v = 3$ in $2u + v = 5$. Torej je $u = 2$, $v = 1$, ostanek pa $2x + 1$.

Kje iskati ničle? Če ima polinom cele koeficiente in celo ničlo $x_0$, potem $x_0$ deli prosti člen. Kandidatov je zato le končno mnogo.

:::premisli
Zakaj mora cela ničla deliti prosti člen? Namig: v enačbi $p(x_0) = 0$ prenesi prosti člen na drugo stran.
---
Vsi členi razen prostega vsebujejo faktor $x_0$. Ko prosti člen preneseš na drugo stran, je na eni strani $x_0$ krat celo število, na drugi prosti člen z nasprotnim predznakom. Zato $x_0$ deli prosti člen.
:::

**3. Vietove formule.** Za kvadratni polinom z ničlama $x_1$ in $x_2$ je $(x - x_1)(x - x_2) = x^2 - (x_1 + x_2)x + x_1 x_2$. Če je vodilni koeficient $a$, polinom $ax^2 + bx + c$ najprej delimo z $a$. Za ničli enačbe $ax^2 + bx + c = 0$ velja:

$$x_1 + x_2 = -\frac{b}{a}$$

$$x_1 x_2 = \frac{c}{a}$$

Jan zdaj reši svojo uganko. Vsota stranic je $1{,}5$, produkt $0{,}5$, zato sta stranici ničli polinoma $x^2 - 1{,}5x + 0{,}5 = (x - 1)(x - 0{,}5)$, torej $1\,\mathrm{m}$ in $0{,}5\,\mathrm{m}$.

Za kubični polinom $ax^3 + bx^2 + cx + d$ z ničlami $x_1, x_2, x_3$ enako razmišljanje da:

$$x_1 + x_2 + x_3 = -\frac{b}{a}$$

$$x_1 x_2 + x_2 x_3 + x_3 x_1 = \frac{c}{a}$$

$$x_1 x_2 x_3 = -\frac{d}{a}$$

Izrazi na levi se ne spremenijo, če ničle premešaš. Imenujemo jih **elementarne simetrične funkcije** ničel in jih označimo z $e_1$, $e_2$, $e_3$.

V simulaciji spodaj »Ničle in koeficienti: Vietove formule« povleci ničli kvadratnega polinoma na $-2$ in $2$. Opazi, da linearni člen izgine, ker je vsota ničel $0$. Nato eno ničlo premakni čez izhodišče: prosti člen postane pozitiven, ker sta ničli zdaj istega predznaka.

**4. Simetrični izrazi.** Izraz v ničlah je **simetričen**, če se ne spremeni, ko ničle med seboj zamenjaš. Osnovni izrek pravi: vsak simetričen polinom v ničlah lahko zapišemo z $e_1, e_2, \dots$, torej s koeficienti. Najpogosteje potrebuješ:

$$x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1 x_2$$

$$\frac{1}{x_1} + \frac{1}{x_2} = \frac{x_1 + x_2}{x_1 x_2}$$

$$x_1^2 + x_2^2 + x_3^2 = (x_1 + x_2 + x_3)^2 - 2(x_1 x_2 + x_2 x_3 + x_3 x_1)$$

Višje potence dobiš z rekurzijo. Ničla zadošča $x_i^2 = e_1 x_i - e_2$. Pomnoži to z $x_i^{n-2}$ in seštej za obe ničli: za $s_n = x_1^n + x_2^n$ velja $s_n = e_1 s_{n-1} - e_2 s_{n-2}$. Za $x^2 - x - 1$ je $e_1 = 1$, $e_2 = -1$ in $s_n = s_{n-1} + s_{n-2}$. Od $s_0 = 1 + 1 = 2$ in $s_1 = e_1 = 1$ dobiš $2, 1, 3, 4, 7, 11$, torej $x_1^5 + x_2^5 = 11$, ne da bi računal s $\sqrt{5}$.

## Rešeni primeri

### Primer 1 (lažji): brez reševanja enačbe

Ničli enačbe $x^2 - 7x + 3 = 0$ sta $x_1$ in $x_2$. Izračunaj $x_1^2 + x_2^2$ in $\frac{1}{x_1} + \frac{1}{x_2}$, ne da bi ničli izračunal.

**Podatki:** $a = 1$, $b = -7$, $c = 3$
**Iščemo:** $x_1^2 + x_2^2$ in $\frac{1}{x_1} + \frac{1}{x_2}$

:::formula
$x_1 + x_2 = -\dfrac{b}{a}$, $x_1 x_2 = \dfrac{c}{a}$; $x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1 x_2$
:::

**Rešitev:**

1. Vieta: $x_1 + x_2 = 7$ in $x_1 x_2 = 3$.
2. Vsota kvadratov: $7^2 - 2 \cdot 3 = 43$. Kvadrat vsote vsebuje še dvojni produkt, ki ga odštejemo.
3. Vsota obratnih vrednosti: $\frac{x_1 + x_2}{x_1 x_2} = \frac{7}{3}$, ker ulomka spravimo na skupni imenovalec.
4. Odgovor: $x_1^2 + x_2^2 = 43$ in $\frac{1}{x_1} + \frac{1}{x_2} = \frac{7}{3}$.

### Primer 2: vse ničle kubičnega polinoma

Poišči vse ničle polinoma $p(x) = x^3 - 4x^2 + x + 6$.

**Podatki:** $p(x) = x^3 - 4x^2 + x + 6$, celi koeficienti, prosti člen $6$
**Iščemo:** vse ničle $p$

:::formula
Cela ničla deli prosti člen; $p(x) = (x - x_0)\,q(x) + p(x_0)$ (Horner)
:::

**Rešitev:**

1. Kandidati so delitelji števila $6$: $\pm 1$, $\pm 2$, $\pm 3$, $\pm 6$.
2. Poskusimo $x_0 = 2$: $p(2) = 8 - 16 + 2 + 6 = 0$, torej je $2$ ničla.
3. Horner z $x_0 = 2$:

| $1$ | $-4$ | $1$ | $6$ |
|---|---|---|---|
| | $2$ | $-4$ | $-6$ |
| $1$ | $-2$ | $-3$ | $0$ |

4. Količnik je $q(x) = x^2 - 2x - 3$. Iščemo števili z vsoto $2$ in produktom $-3$: to sta $3$ in $-1$, torej $q(x) = (x - 3)(x + 1)$.
5. Preizkus z Vieto: vsota $-1 + 2 + 3 = 4$ se ujema z $-(-4)$, produkt $(-1) \cdot 2 \cdot 3 = -6$ z $-6$.
6. Odgovor: ničle so $-1$, $2$ in $3$.

### Primer 3 (težji): durov trozvok

Maja programira sintetizator. Frekvence treh tonov durovega trozvoka v čisti uglasitvi so v razmerju $4 : 5 : 6$. V njenem programu so frekvence, izražene v enotah po $100\,\mathrm{Hz}$, ničle polinoma $x^3 - 15x^2 + mx - n$. Določi $m$, $n$ in frekvence tonov.

**Podatki:** ničle v razmerju $4 : 5 : 6$; polinom $x^3 - 15x^2 + mx - n$; enota $100\,\mathrm{Hz}$
**Iščemo:** koeficienta $m$, $n$ in tri frekvence

:::formula
$x_1 + x_2 + x_3 = -\dfrac{b}{a}$, $x_1 x_2 + x_2 x_3 + x_3 x_1 = \dfrac{c}{a}$, $x_1 x_2 x_3 = -\dfrac{d}{a}$
:::

**Rešitev:**

1. Zaradi razmerja zapišemo ničle kot $4t$, $5t$ in $6t$ za neko pozitivno število $t$.
2. Vsota: $4t + 5t + 6t = 15t$, Vieta pa da $15$. Torej je $t = 1$, ničle so $4$, $5$, $6$.
3. Produkti po dveh: $m = 4 \cdot 5 + 5 \cdot 6 + 6 \cdot 4 = 74$.
4. Produkt ničel je $-\frac{d}{a} = n$, ker je $d = -n$. Torej $n = 4 \cdot 5 \cdot 6 = 120$.
5. Frekvence: $4 \cdot 100\,\mathrm{Hz} = 400\,\mathrm{Hz}$, $500\,\mathrm{Hz}$ in $600\,\mathrm{Hz}$.
6. Odgovor: $m = 74$, $n = 120$; toni imajo $400\,\mathrm{Hz}$, $500\,\mathrm{Hz}$ in $600\,\mathrm{Hz}$.

### Primer 4: zdaj ti

Ničle polinoma $x^3 - 2x^2 - 3x + 1$ so $x_1$, $x_2$, $x_3$. Izračunaj $x_1^2 + x_2^2 + x_3^2$ in $\frac{1}{x_1} + \frac{1}{x_2} + \frac{1}{x_3}$. Ničle niso cela števila, zato jih ne računaj.

**Podatki:** $a = 1$, $b = -2$, $c = -3$, $d = 1$
**Iščemo:** vsoto kvadratov ničel in vsoto njihovih obratnih vrednosti

:::formula
$x_1^2 + x_2^2 + x_3^2 = e_1^2 - 2e_2$; $\dfrac{1}{x_1} + \dfrac{1}{x_2} + \dfrac{1}{x_3} = \dfrac{e_2}{e_3}$
:::

**Rešitev:**

1. Vieta: $e_1 = 2$, $e_2 = -3$, $e_3 = -1$.
2. Vsota kvadratov: $2^2 - 2 \cdot (-3) = 10$.
3. Za vsoto obratnih vrednosti spravi ulomke na skupni imenovalec $x_1 x_2 x_3$ in izračunaj sam.

:::premisli
Koliko je $\frac{1}{x_1} + \frac{1}{x_2} + \frac{1}{x_3}$?
---
Skupni imenovalec je $e_3$, števec je $x_2 x_3 + x_1 x_3 + x_1 x_2 = e_2$. Torej $\frac{e_2}{e_3} = \frac{-3}{-1} = 3$.
:::

## Pogoste napake

- **Napačen predznak vsote.** Kdor iz $x^2 - 7x + 3$ prebere $x_1 + x_2 = -7$, je pozabil minus v $-\frac{b}{a}$. Pravilno: $x_1 + x_2 = 7$. Pomagaj si z $(x - x_1)(x - x_2)$: pri $x$ stoji *minus* vsota.
- **Pozabljen vodilni koeficient.** Pri $2x^2 - 6x + 4$ je produkt ničel $\frac{4}{2} = 2$, ne $4$. Vietove formule veljajo v tej obliki šele, ko polinom deliš z $a$.
- **Kvadrat vsote namesto vsote kvadratov.** $x_1^2 + x_2^2$ ni $(x_1 + x_2)^2$. Manjka $-2x_1 x_2$; brez tega je rezultat napačen za dvojni produkt.
- **Napačen $x_0$ pri izreku o ostanku.** Pri deljenju z $x + 1$ je $x_0 = -1$, ker je $x + 1 = x - (-1)$. Vstaviti moraš $-1$, ne $1$.
- **Števili z dano vsoto in produktom vedno obstajata.** Realni števili z vsoto $2$ in produktom $5$ ne obstajata: enačba $x^2 - 2x + 5 = 0$ ima diskriminanto $4 - 20 = -16 < 0$. Vietove formule veljajo, realnost ničel pa preveri z diskriminanto.

## Povzetek

- $x_0$ je ničla polinoma $p$, ko je $p(x_0) = 0$; to je natanko tedaj, ko $x - x_0$ deli $p(x)$.
- Izrek o ostanku: ostanek pri deljenju z $x - x_0$ je $p(x_0)$. Deliš s Hornerjevim algoritmom.
- Cela ničla polinoma s celimi koeficienti deli prosti člen.
- Vieta za $ax^2 + bx + c$: $x_1 + x_2 = -\frac{b}{a}$, $x_1 x_2 = \frac{c}{a}$. Za kubični: $e_1 = -\frac{b}{a}$, $e_2 = \frac{c}{a}$, $e_3 = -\frac{d}{a}$.
- Simetrične izraze zapiši z $e_1, e_2, e_3$: $x_1^2 + x_2^2 = e_1^2 - 2e_2$, $\frac{1}{x_1} + \frac{1}{x_2} = \frac{e_1}{e_2}$.
- Potenčne vsote dobiš z rekurzijo $s_n = e_1 s_{n-1} - e_2 s_{n-2}$.

## Drugače: Z analogijo

Predstavljaj si seznam predvajanja s tremi skladbami. Ko vklopiš naključni vrstni red, se skladbe premešajo, skupno trajanje pa ostane enako. Skupno trajanje je **simetrična funkcija**: ne ve, katera skladba je prva. Tako se tudi polinom $(x - x_1)(x - x_2)(x - x_3)$ ne spremeni, če ničle premešaš, zato so njegovi koeficienti simetrični v ničlah.

Koeficienti so kot povzetek na koncu seznama: skupno trajanje, »vsota parov« in »produkt«. Iz povzetka ne razbereš vrstnega reda skladb, izračunaš pa lahko vse, kar od vrstnega reda ni odvisno, na primer vsoto kvadratov trajanj.

## Drugače: Iz vsakdanjega življenja

Vrtičkar ima $20\,\mathrm{m}$ mreže za ograjo pravokotne grede in želi ploščino $21\,\mathrm{m^2}$. Stranici imata vsoto $10\,\mathrm{m}$ in produkt $21\,\mathrm{m^2}$, zato sta ničli $x^2 - 10x + 21 = 0$: $3\,\mathrm{m}$ in $7\,\mathrm{m}$. Isti trik uporabiš pri domači nalogi: ko rešiš $x^2 - 5x + 6 = 0$ in dobiš $2$ in $3$, v sekundi preveriš, da je vsota $5$ in produkt $6$.

## Preveri se

? Ničli enačbe $x^2 - 5x + 2 = 0$ sta $x_1$ in $x_2$. Koliko je $x_1^2 + x_2^2$?
= 21
~ 25 | To je $(x_1 + x_2)^2$. Odšteti moraš še $2x_1 x_2 = 4$.
~ 29 | Dvojni produkt si prištel. Pravilno: $(x_1 + x_2)^2 - 2x_1 x_2$.
~ 23 | Odštel si samo $x_1 x_2 = 2$, ne dvojnega produkta $4$.
> $x_1 + x_2 = 5$, $x_1 x_2 = 2$, zato $x_1^2 + x_2^2 = 25 - 4 = 21$.

? Kateri izraz **ni** simetričen v ničlah $x_1$ in $x_2$?
- $x_1^2 + x_2^2$
~ Če ničli zamenjaš, dobiš $x_2^2 + x_1^2$, kar je isto. Izraz je simetričen.
- $x_1 x_2 + 3$
~ Produkt se pri zamenjavi ne spremeni, prištevanje števila tudi ne. Izraz je simetričen.
+ $x_1 - x_2$
- $\frac{1}{x_1} + \frac{1}{x_2}$
~ Seštevanje je zamenljivo, zato zamenjava ničel izraza ne spremeni. Izraz je simetričen in enak $\frac{e_1}{e_2}$.
> Zamenjava da $x_2 - x_1 = -(x_1 - x_2)$, torej se izraz spremeni. Simetričen je šele njegov kvadrat $(x_1 - x_2)^2 = e_1^2 - 4e_2$.

? Z grafa polinoma $x^2 + bx + c$ odčitaj ničli A in B. Graf nato premakneš za $1$ v desno, tako da se obe ničli povečata za $1$. Kaj se zgodi s koeficientoma $b$ in $c$?
:::risba graf
opis: Parabola, ki seka os x v točkah A = −1 in B = 3, teme ima v točki (1, −4).
x: -3 .. 5 | 1 | x
y: -5 .. 6 | 1 | y
f: x*x - 2*x - 3 | modra | -2 .. 4
točka: -1; 0 | A | levo
točka: 3; 0 | B | desno
:::
- Ostaneta $b = -2$ in $c = -3$, ker premik ne spremeni oblike grafa.
~ Oblika parabole ostane, ničle pa se premaknejo, zato se spremenita vsota in produkt ničel, torej tudi $b$ in $c$.
+ Postaneta $b = -4$ in $c = 0$, ker je nova vsota ničel $4$ in nov produkt $0$.
- Postaneta $b = -1$ in $c = -2$, ker se vsak koeficient poveča za $1$.
~ Premik ničel ne poveča koeficientov za $1$. Izračunaj nove ničle $0$ in $4$ ter uporabi Vieto.
- Postaneta $b = 4$ in $c = 0$, ker je nova vsota ničel $4$.
~ Vsota ničel je $-b$, ne $b$. Pri vsoti $4$ je $b = -4$.
> Ničli se premakneta z $-1$ in $3$ na $0$ in $4$. Nova vsota je $4 = -b$, nov produkt $0 = c$, polinom je $x^2 - 4x$.

? Sošolec je računal ostanek pri deljenju $p(x) = x^3 + 2x - 5$ z $x + 1$. V katerem koraku se je zmotil?
1) Po izreku o ostanku je ostanek pri deljenju z $x - x_0$ enak $p(x_0)$.
2) Delitelj $x + 1$ ima obliko $x - x_0$ z $x_0 = 1$.
3) Izračunamo $p(1) = 1 + 2 - 5 = -2$.
4) Ostanek je $-2$.
- Korak 1)
~ Izrek o ostanku je zapisan pravilno; težava je v tem, kako je uporabljen.
+ Korak 2)
- Korak 3)
~ Vrednost $p(1)$ je izračunana pravilno, le da $1$ ni pravo število za vstavljanje.
- Korak 4)
~ Sklep le prepiše vrednost iz koraka 3; napaka je nastala že prej, pri določitvi $x_0$.
> $x + 1 = x - (-1)$, torej $x_0 = -1$. Pravilni ostanek je $p(-1) = -1 - 2 - 5 = -8$.

? Kubični polinom ima cele koeficiente in vsaj eno celo ničlo. Razvrsti korake, s katerimi poiščeš vse njegove ničle.
1. Izpiši delitelje prostega člena kot kandidate za cele ničle.
2. Vstavljaj kandidate, dokler ne najdeš ničle $x_0$.
3. S Hornerjevim algoritmom deli polinom z $x - x_0$.
4. Poišči ničli kvadratnega količnika.
5. Zapiši vse ničle in jih preizkusi z Vietovimi formulami.
> Kandidati zožijo iskanje, ena ničla zniža stopnjo, kvadratni količnik rešiš, Vieta pa hitro preveri rezultat.

<<RACUN
resi: x^2-1.5*x+0.5=0 | x | 0.5, 1
enako: (x-1)*(x-2)*(x-3) | x^3-6*x^2+11*x-6
enako: (x-1)*(x^2-5*x+6) | x^3-6*x^2+11*x-6
vrednost: (-1)*(-2)*(-3)*(-4) | 24
vrednost: 7^2-2*3 | 43
vrednost: 7/3 | 7/3
resi: x^3-4*x^2+x+6=0 | x | -1, 2, 3
enako: (x-2)*(x^2-2*x-3) | x^3-4*x^2+x+6
enako: (x-4)*(x-5)*(x-6) | x^3-15*x^2+74*x-120
vrednost: 2^2-2*(-3) | 10
vrednost: (-3)/(-1) | 3
vrednost: 5^2-2*2 | 21
vrednost: (-1)^3+2*(-1)-5 | -8
enako: (x-0)*(x-4) | x^2-4*x
vrednost: ((1+sqrt(5))/2)^5+((1-sqrt(5))/2)^5 | 11
resi: x^2-10*x+21=0 | x | 3, 7
resi: 15*t=15 | t | 1
vrednost: 4*5*6 | 120
vrednost: 2*1+1 | 3
vrednost: 2*2+1 | 5
resi: (5-v)/2=3-v | v | 1
vrednost: 2^2-4*5 | -16
vrednost: 1^3+2*1-5 | -2
>>

:::simboli
p | polinom | |
q | količnik pri deljenju z $x - x_0$ | |
r | ostanek pri deljenju z $x - x_0$ | r = p(x_0) |
x | spremenljivka polinoma | |
x_0 | število v delitelju $x - x_0$ | | | ničla, če je $p(x_0) = 0$
x_1, x_2, x_3 | ničle polinoma | |
a | vodilni koeficient | | | $a \ne 0$
b, c, d | koeficienti polinoma $ax^3 + bx^2 + cx + d$ | |
e_1 | vsota ničel | e_1 = x_1 + x_2 + x_3 | | pri kvadratnem polinomu $x_1 + x_2$
e_2 | vsota produktov ničel po dveh | e_2 = x_1 x_2 + x_2 x_3 + x_3 x_1 | | pri kvadratnem polinomu $x_1 x_2$
e_3 | produkt ničel | e_3 = x_1 x_2 x_3 |
s_n | vsota $n$-tih potenc ničel | s_n = x_1^n + x_2^n |
:::
