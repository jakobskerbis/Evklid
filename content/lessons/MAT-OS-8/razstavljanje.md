---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi list karo papirja in škarje. Izreži pravokotnik, ki je visok $3$ kvadratke in širok $5$, nato še enega, visokega $3$ in širokega $7$. Prvi ima $3 \cdot 5 = 15$ kvadratkov, drugi $3 \cdot 7 = 21$, skupaj $36$.

Zdaj ju položi tesno enega ob drugega, tako da se stikata z enako visoko stranico. Dobiš **en** pravokotnik, visok $3$ in širok $5 + 7 = 12$. Kvadratkov je spet $3 \cdot 12 = 36$. Isti papir smo torej opisali na dva načina:

$$3 \cdot 5 + 3 \cdot 7 = 3 \cdot (5 + 7)$$

Na levi je **vsota** dveh ploščin, na desni **produkt** dveh stranic. Tako razmišlja tudi keramičar, ki polaga ploščice na dva dela stene z isto višino: namesto dveh računov naredi enega.

Iz ure o množenju izrazov znaš pot od produkta k vsoti: $3(2x + 5) = 6x + 15$. Danes gremo v obratni smeri. Iz $6x + 15$ bomo spet naredili $3(2x + 5)$. Temu pravimo **razstavljanje**. Potreboval ga boš pri enačbah, pri krajšanju ulomkov z izrazi in pri računanju na pamet: $37 \cdot 15 + 37 \cdot 85 = 37 \cdot 100 = 3700$.

## Razlaga

**1. Vsota ali produkt?** Števila ali izraze, ki jih med seboj množimo, imenujemo **faktorji**. Rezultat množenja je **produkt**. V zapisu $3 \cdot (2x + 5)$ sta faktorja $3$ in $(2x + 5)$. **Razstaviti izraz** pomeni zapisati ga kot produkt faktorjev.

*Hitra preizkušnja:* je $2x + 6$ razstavljen? (Ne, to je vsota.) Je $2(x + 3)$? (Da, to je produkt.)

**2. Pravilo.** Kadar imajo vsi členi vsote isti faktor, ga zapišemo pred oklepaj:

$$ab + ac = a(b + c)$$

Faktorju $a$ pravimo **skupni faktor**, postopku pa **izpostavljanje skupnega faktorja**. To je pravilo o razdeljevanju, prebrano od desne proti levi.

*Hitra preizkušnja:* $5 \cdot 4 + 5 \cdot 6 = 5 \cdot (\ldots)$. (V oklepaj gre $4 + 6 = 10$.)

**3. Števila pred črkami.** Pri koeficientih poiščemo **največji skupni delitelj** (NSD). Za $12$ in $18$ je to $6$, saj $6$ deli oba, večje število pa ne.

*Hitra preizkušnja:* koliko je $\text{NSD}(8, 12)$? (To je $4$.)

**4. Spremenljivke.** Izpostavimo samo spremenljivko, ki je v **vseh** členih, in sicer z **najmanjšim** eksponentom. Za $12x^3$ in $18x^2$ to pokaže tabela:

| | $12x^3$ | $18x^2$ | skupni faktor |
|---|---|---|---|
| koeficient | $12$ | $18$ | $\text{NSD} = 6$ |
| eksponent pri $x$ | $3$ | $2$ | najmanjši: $x^2$ |

Skupni faktor je $6x^2$. Zakaj najmanjši eksponent? Ker $x^3 = x \cdot x \cdot x$ in $x^2 = x \cdot x$ imata skupna le dva faktorja $x$.

*Hitra preizkušnja:* kaj je skupni faktor izrazov $x^2$ in $5x$? (To je $x$.)

**5. Postopek.**

1. Poišči največji skupni faktor vseh členov.
2. Zapiši ga pred oklepaj.
3. V oklepaj zapiši, s čim moraš pomnožiti skupni faktor, da dobiš posamezni člen.
4. Preveri: pomnoži oklepaj nazaj. Dobiti moraš začetni izraz.

:::premisli
Razstavi $4x + 4 = 4(x + \ldots)$. Kaj gre na pike in zakaj tam ne sme ostati nič?
---
Na pike gre $1$, ker je $4 \cdot 1 = 4$. Če bi napisal $4(x + 0)$ ali samo $4x$, bi po množenju dobil $4x$ in drugi člen bi izginil.
:::

V simulaciji spodaj, »Razstavljanje z algebrskimi ploščicami«, nastavi $p = 3$ in glej samo zgornjo vrsto ploščic. Kvadrat $x^2$ in tri palice $x$ so vsi visoki $x$. Opazi, da skupaj tvorijo pravokotnik s stranicama $x$ in $x + 3$: $x^2 + 3x = x(x + 3)$. Skupna višina je skupni faktor. Celoten pravokotnik z enicami boš razstavljal v srednji šoli.

**6. Negativni skupni faktor.** Kadar je prvi člen negativen, običajno izpostavimo negativen faktor. Takrat se v oklepaju obrnejo predznaki vseh členov:

$$-4x^2 - 10x = -2x(2x + 5)$$

Preverimo: $-2x \cdot 2x = -4x^2$ in $-2x \cdot 5 = -10x$.

:::premisli
Napovej: kaj ostane v oklepaju, če iz $-6x + 9$ izpostavimo $-3$?
---
$-6x + 9 = -3(2x - 3)$. Prvi člen je bil negativen in v oklepaju postane pozitiven; drugi je bil pozitiven in postane negativen, ker je $-3 \cdot (-3) = 9$.
:::

## Rešeni primeri

### Primer 1: dva člena

Razstavi izraz $6x + 9$.

**Podatki:** izraz $6x + 9$
**Iščemo:** zapis izraza kot produkt

:::formula
$ab + ac = a(b + c)$
:::

**Rešitev:**

1. Največji skupni delitelj koeficientov: $\text{NSD}(6, 9) = 3$. Člen $9$ nima $x$, zato $x$ ne izpostavimo.
2. Skupni faktor je $3$; zapišemo ga pred oklepaj.
3. V oklepaj gre $2x$, ker je $3 \cdot 2x = 6x$, in $3$, ker je $3 \cdot 3 = 9$.
4. Preverimo: $3 \cdot 2x + 3 \cdot 3 = 6x + 9$.
5. Odgovor: $6x + 9 = 3(2x + 3)$.

### Primer 2: trije členi in dve spremenljivki

Razstavi izraz $12x^2y - 18xy^2 + 6xy$.

**Podatki:** izraz $12x^2y - 18xy^2 + 6xy$
**Iščemo:** največji skupni faktor in zapis izraza kot produkt

:::formula
$ab + ac + ad = a(b + c + d)$
:::

**Rešitev:**

1. Koeficienti: $\text{NSD}(12, 18, 6) = 6$.
2. Spremenljivka $x$ je v vseh členih z eksponenti $2$, $1$, $1$. Najmanjši je $1$, zato izpostavimo $x$.
3. Spremenljivka $y$ ima eksponente $1$, $2$, $1$, zato izpostavimo $y$. Skupni faktor je $6xy$.
4. V oklepaj zapišemo, s čim pomnožimo $6xy$:
   - $6xy \cdot 2x = 12x^2y$, torej $2x$;
   - $6xy \cdot 3y = 18xy^2$, torej $3y$, predznak minus ostane;
   - $6xy \cdot 1 = 6xy$, torej $1$. Enice ne smemo izpustiti.
5. Preverimo: $6xy(2x - 3y + 1) = 12x^2y - 18xy^2 + 6xy$.
6. Odgovor: $12x^2y - 18xy^2 + 6xy = 6xy(2x - 3y + 1)$.

### Primer 3: terasa

Pravokotna terasa ima ploščino $S = 8x^2 + 12x$ (v $\text{m}^2$). Polagalec ploščic ve, da je ena stranica dolga $4x$ metrov. Kako dolga je druga stranica? Preveri rezultat za $x = 5$.

**Podatki:** $S = 8x^2 + 12x$ ($\text{m}^2$), prva stranica $4x$ (m), za preverjanje $x = 5$
**Iščemo:** drugo stranico terase

:::formula
$S = \text{stranica} \cdot \text{stranica}$; ker je $8x^2 + 12x = 4x(\ldots)$, je druga stranica izraz v oklepaju.
:::

**Rešitev:**

1. Ploščina pravokotnika je produkt stranic, zato moramo $8x^2 + 12x$ zapisati kot $4x \cdot (\ldots)$. To je razstavljanje.
2. $4x$ je res skupni faktor: $\text{NSD}(8, 12) = 4$, najmanjši eksponent pri $x$ je $1$.
3. $4x \cdot 2x = 8x^2$ in $4x \cdot 3 = 12x$, zato je $S = 4x(2x + 3)$.
4. Preverimo s številom $x = 5$: $8 \cdot 25 + 12 \cdot 5 = 200 + 60 = 260$ in $4 \cdot 5 \cdot 13 = 260$. Obe obliki dasta isto ploščino, $260\,\text{m}^2$.
5. Odgovor: druga stranica je dolga $(2x + 3)$ metrov; pri $x = 5$ je terasa velika $20\,\text{m} \times 13\,\text{m}$.

### Primer 4: zdaj ti

Razstavi $-6x^2 - 15x$ tako, da izpostaviš negativen faktor.

**Podatki:** izraz $-6x^2 - 15x$, prvi člen je negativen
**Iščemo:** zapis izraza kot produkt z negativnim skupnim faktorjem

:::formula
$-ab - ac = -a(b + c)$
:::

**Rešitev:**

1. $\text{NSD}(6, 15) = 3$, spremenljivka $x$ je v obeh členih z najmanjšim eksponentom $1$.
2. Ker je prvi člen negativen, izpostavimo $-3x$.
3. Zdaj ti: poišči, s čim moraš pomnožiti $-3x$, da dobiš $-6x^2$ in $-15x$. Nato rezultat preveri z množenjem.

:::premisli
Kaj dobiš?
---
$-6x^2 - 15x = -3x(2x + 5)$. Preverimo: $-3x \cdot 2x = -6x^2$ in $-3x \cdot 5 = -15x$. Oba predznaka v oklepaju sta plus, ker je minus že pred oklepajem.
:::

## Pogoste napake

- **Pozabljena enica.** »$3x + 3 = 3x$« ali »$3(x)$«: učenec misli, da člen, enak skupnemu faktorju, izgine. Ne izgine, ker je $3 = 3 \cdot 1$. Pravilno: $3x + 3 = 3(x + 1)$.
- **Skupni faktor le pri enem členu.** »$5x + 20 = 5(x) + 20$« ali pri ploščini »$5x + 4$« namesto $5(x + 4)$. Faktor pred oklepajem množi **vse** člene v oklepaju. Pravilno: $5x + 20 = 5(x + 4)$.
- **Nepopolno izpostavljanje.** $12x + 18 = 2(6x + 9)$ je pravilna enakost, a $6x$ in $9$ imata še skupni faktor $3$. Izpostavi **največji** skupni faktor: $12x + 18 = 6(2x + 3)$.
- **Napačni predznaki pri negativnem faktorju.** »$-2x - 6 = -2(x - 3)$«: po množenju bi dobil $-2x + 6$. Minus krat minus je plus, zato pravilno: $-2x - 6 = -2(x + 3)$.
- **Spremenljivka, ki ni v vseh členih.** Pri $3x^2 + 5y$ ni skupne spremenljivke, NSD koeficientov pa je $1$. Tak izraz se z izpostavljanjem ne da razstaviti. Pomaga preverjanje: oklepaj vedno pomnoži nazaj.

## Povzetek

- Razstaviti izraz pomeni zapisati vsoto kot produkt faktorjev.
- Izpostavljanje skupnega faktorja je obrnjeno pravilo o razdeljevanju: $ab + ac = a(b + c)$.
- Skupni faktor sestavljata NSD koeficientov in vsaka spremenljivka, ki je v vseh členih, z najmanjšim eksponentom.
- V oklepaj zapišemo, s čim pomnožimo skupni faktor, da dobimo posamezni člen. Kadar je člen enak faktorju, ostane $1$.
- Pri negativnem skupnem faktorju se predznaki v oklepaju obrnejo.
- Na sliki: dva pravokotnika z enako stranico zložimo v enega; skupna stranica je skupni faktor.
- Vedno preveri z množenjem oklepaja.

## Drugače: Na sliki

Pravokotnik z višino $4x$ razdelimo navpično na dva dela:

:::risba skica
opis: Pravokotnik z višino 4x je navpično razdeljen na dva dela. Levi del je širok 2x in ima ploščino 8x², desni je širok 3 in ima ploščino 12x.
območje: 0; 0 .. 10; 5,2
pravokotnik: 1,4; 0,4 .. 6,4; 4,4
pravokotnik: 6,4; 0,4 .. 9,4; 4,4 | oranžna
napis: 3,9; 4,4 | 2x | nad
napis: 7,9; 4,4 | 3 | nad
napis: 1,4; 2,4 | 4x | levo
napis: 3,9; 2,4 | 8x^2 | sredina | debelo
napis: 7,9; 2,4 | 12x | sredina | debelo
:::

Levi del je širok $2x$ in ima ploščino $4x \cdot 2x = 8x^2$. Desni del je širok $3$ in ima ploščino $4x \cdot 3 = 12x$. Skupaj je to $8x^2 + 12x$.

Isti lik pa je tudi **en** velik pravokotnik z višino $4x$ in širino $2x + 3$. Njegova ploščina je $4x(2x + 3)$.

Izpostavljanje skupnega faktorja torej pomeni, da dva pravokotnika z enako višino zložiš v enega. Skupni faktor je stranica, ki jo imata oba enako dolgo, kot pri karo papirju na začetku.

## Drugače: Bolj natančno

Pravilo o razdeljevanju velja za poljubna števila ali izraze: $a(b + c) = ab + ac$. Enakost beremo v obe smeri. Od leve proti desni odpravljamo oklepaj, od desne proti levi izpostavljamo skupni faktor.

**Zakaj prav največji skupni faktor?** Iz $12x + 18$ lahko izpostavimo tudi $2$:

$$12x + 18 = 2(6x + 9)$$

Toda $6x + 9 = 3(2x + 3)$, torej:

$$12x + 18 = 2 \cdot 3 \cdot (2x + 3) = 6(2x + 3)$$

Če izpostavimo manjši faktor, v oklepaju ostane še en skupni faktor in razstavljanje ni končano. Šele ko izpostavimo NSD, členi v oklepaju nimajo več skupnega delitelja, večjega od $1$.

**Zakaj najmanjši eksponent?** Člen $x^3$ vsebuje tri faktorje $x$, člen $x^2$ pa dva. Vsem členom sta skupna le dva faktorja $x$, torej $x^2$. Večje potence ne moremo izpostaviti, ker je ni v vsakem členu.

## Preveri se

? Pravokotnik je sestavljen iz dveh delov z enako višino $5$: prvi je širok $x$, drugi $4$. Kateri produkt opisuje ploščino celega lika?
- $5x + 4$
~ Faktor $5$ si pomnožil samo s prvo širino. Višina $5$ velja za oba dela, zato $5 \cdot 4 = 20$.
+ $5(x + 4)$
- $5 \cdot x \cdot 4$
~ Širini ležita druga ob drugi, zato ju seštejemo, ne zmnožimo.
> Oba dela imata višino $5$, skupna širina je $x + 4$, zato je ploščina $5(x + 4) = 5x + 20$.

? Oceni brez natančnega računanja: koliko je približno $49 \cdot 13 + 49 \cdot 7$?
- približno $70$
~ To je vsota $49 + 13 + 7$. Med členi je množenje, ne seštevanje.
+ približno $1000$
- približno $4500$
~ To je $49 \cdot 13 \cdot 7$. Po izpostavljanju števili $13$ in $7$ v oklepaju seštejemo, ne zmnožimo.
> Izpostavimo $49$: $49 \cdot (13 + 7) = 49 \cdot 20 = 980$, kar je približno $1000$.

? Zakaj zapis $12x + 18 = 2(6x + 9)$ še ni končano razstavljanje?
- Ker enakost ni pravilna.
~ Enakost je pravilna: $2 \cdot 6x + 2 \cdot 9 = 12x + 18$. Težava je drugje.
+ Ker imata $6x$ in $9$ še skupni faktor $3$.
- Ker moramo vedno izpostaviti tudi $x$.
~ Spremenljivko izpostavimo le, če je v vseh členih; člen $18$ nima $x$.
> Izpostaviti moramo največji skupni faktor $6$: $12x + 18 = 6(2x + 3)$.

? Razstavljen izraz je $-3x(2x - 5)$. Kateri izraz so razstavili?
- $-6x^2 - 15x$
~ Pozabil si, da je minus krat minus plus: $-3x \cdot (-5) = +15x$.
+ $-6x^2 + 15x$
- $-6x + 15$
~ Pomnožil si samo s $-3$ in pozabil faktor $x$. Pravilno je $-3x \cdot 2x = -6x^2$.
> $-3x \cdot 2x = -6x^2$ in $-3x \cdot (-5) = 15x$, torej $-6x^2 + 15x$.

? Pravokotna stena v kopalnici ima ploščino $6x^2 + 9x$ (v $\text{dm}^2$), njena višina je $3x$ decimetrov. Kako dolga je stena?
- $2x + 9$
~ S $3x$ si delil le prvi člen. Faktor pred oklepajem množi vse člene, zato $3x \cdot 3 = 9x$.
- $2x^2 + 3x$
~ Izpostavil si le število $3$, ne pa tudi $x$. Skupni faktor je $3x$.
+ $2x + 3$
> $6x^2 + 9x = 3x(2x + 3)$, ker je $3x \cdot 2x = 6x^2$ in $3x \cdot 3 = 9x$. Stena je dolga $(2x + 3)$ dm.

:::simboli
a | skupni faktor | | | izpostavimo ga pred oklepaj
b, c, d | preostali faktorji členov | | | ostanejo v oklepaju
x | spremenljivka | |
S | ploščina pravokotnika | | m^2 | produkt obeh stranic
:::
