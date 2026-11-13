---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Travnik ima obliko kvadrata s stranico $52\,\mathrm{m}$. Sredi njega je kvadraten ribnik s stranico $48\,\mathrm{m}$. Okrog ribnika želiš posejati travo, vreča semena zadošča za $50\,\mathrm{m}^2$. Koliko vreč kupiš?

Prva pot zahteva dva velika kvadrata: $52^2 = 2704$ in $48^2 = 2304$, razlika je $400\,\mathrm{m}^2$. Druga gre na pamet: $52^2 - 48^2 = (52 - 48)(52 + 48) = 4 \cdot 100 = 400$. Kupiš $8$ vreč.

Druga pot je hitrejša, ker smo razliko zapisali kot **produkt**. Temu rečemo **razstavljanje**. Produkt je enak $0$ samo takrat, ko je vsaj en faktor enak $0$, zato iz razcepa takoj vidiš, kdaj je izraz nič. Razstavljanje boš potreboval tudi za krajšanje ulomljenih izrazov v naslednji temi.

## Razlaga

**1. Kaj pomeni razstaviti.** Pri algebrskih izrazih si odpiral oklepaje in iz produkta dobil vsoto. Razstavljanje je ista enakost, prebrana v nasprotno smer. Podobno je razcepu števila na prafaktorje:

| | Množenje | Razstavljanje |
|---|---|---|
| smer | produkt → vsota | vsota → produkt |
| pri številih | $7 \cdot 13 = 91$ | $91 = 7 \cdot 13$ |
| pri izrazih | $3x(x + 2) = 3x^2 + 6x$ | $3x^2 + 6x = 3x(x + 2)$ |
| postopek | vedno isti (vsak člen z vsakim) | iščemo vzorec, več poti |

Razlika je v zadnji vrstici: množiti znaš vedno, pri razstavljanju pa moraš prepoznati, kateri vzorec izraz skriva. Razstaviti izraz pomeni zapisati ga kot produkt faktorjev. Razcep je **popoln**, ko nobenega faktorja ni več mogoče razstaviti naprej. Pravilnost vedno preveriš s preizkusom: faktorje zmnožiš in moraš dobiti prvotni izraz.

**2. Izpostavljanje skupnega faktorja.** Distributivnostni zakon $ab + ac = a(b + c)$ preberemo v obratni smeri. Postopek:

1. Poišči največji skupni delitelj vseh koeficientov.
2. Vsako spremenljivko, ki nastopa v vseh členih, vzemi z najmanjšim eksponentom.
3. Produkt teh dveh delov je skupni faktor. Vsak člen deli z njim in dobljene količnike napiši v oklepaj.

Primer: v $12x^3y - 18x^2y^2$ je največji skupni delitelj koeficientov $6$, spremenljivka $x$ ima najmanjši eksponent $2$, spremenljivka $y$ pa $1$. Skupni faktor je $6x^2y$ in velja $12x^3y - 18x^2y^2 = 6x^2y(2x - 3y)$. Če je skupni faktor tudi cel oklepaj, ga izpostaviš prav tako: $a(x+1) + b(x+1) = (a+b)(x+1)$.

:::premisli
Kaj bi se zgodilo z drugim členom, če bi iz $12x^3y - 18x^2y^2$ izpostavili $x^3$, ki ga ima prvi člen?
---
Drugi člen ima le $x^2$. Če bi ga delili z $x^3$, ne bi dobili mnogočlenika, ampak ulomek. Skupni faktor mora deliti vse člene, zato vzamemo najmanjši eksponent.
:::

**Izpostavljanje po skupinah.** Pri štirih členih jih združimo v dva para, ki imata vsak svoj skupni faktor, in upamo, da se v oklepajih pokaže enak izraz:

$$ax + ay + bx + by = a(x+y) + b(x+y) = (a+b)(x+y).$$

Če izpostavimo negativen faktor, se vsem členom v oklepaju spremeni predznak: $-a - b = -(a+b)$ in $b - a = -(a - b)$.

**3. Obrazci za razstavljanje.** Znane obrazce iz algebrskih izrazov preberi od desne proti levi:

| Kakšen je izraz | Obrazec | Primer |
|---|---|---|
| dva člena, med njima minus, oba kvadrata | $a^2 - b^2 = (a-b)(a+b)$ | $9x^2 - 16 = (3x-4)(3x+4)$ |
| trije členi, kvadrat vsote | $a^2 + 2ab + b^2 = (a+b)^2$ | $x^2 + 10x + 25 = (x+5)^2$ |
| trije členi, kvadrat razlike | $a^2 - 2ab + b^2 = (a-b)^2$ | $4x^2 - 12x + 9 = (2x-3)^2$ |

Pri razliki kvadratov je pomembno, da prepoznaš kvadrata: $9x^2 = (3x)^2$ in $16 = 4^2$. Vsote kvadratov $x^2 + b^2$ (z znakom plus, $b \neq 0$) ni mogoče razstaviti v produkt $(x + m)(x + n)$ z realnima številoma $m$ in $n$.

**4. Vietovo pravilo.** Poglej, kaj dobiš, ko zmnožiš dva dvočlenika:

$$(x+a)(x+b) = x^2 + (a+b)\,x + a\cdot b.$$

Če je torej dan **tričlenik** (trinom) $x^2 + px + q$ s koeficientom $p$ pri $x$ in **prostim členom** $q$, iščemo števili $a$ in $b$, za kateri velja

$$a + b = p \qquad \text{in} \qquad a \cdot b = q,$$

in potem je $x^2 + px + q = (x+a)(x+b)$. Najprej zapiši vse pare celih faktorjev števila $q$, nato med njimi poišči par z vsoto $p$. Predznaka ti pomagata zožiti iskanje:

| Predznak $q$ | Predznak $p$ | Predznaka iskanih števil |
|---|---|---|
| $q > 0$ | $p > 0$ | obe števili sta pozitivni |
| $q > 0$ | $p < 0$ | obe števili sta negativni |
| $q < 0$ | poljuben | števili imata različna predznaka; če je $p \neq 0$, ima večje po absolutni vrednosti enak predznak kot $p$ |

Primer: $x^2 + 7x + 12$. Iščemo števili z vsoto $7$ in produktom $12$. Pari faktorjev števila $12$ so $1\cdot12$, $2\cdot6$, $3\cdot4$. Vsoto $7$ ima par $3$ in $4$, zato je $x^2 + 7x + 12 = (x+3)(x+4)$. Če takega para ni, tričlenika s celimi števili ne moremo razstaviti.

V simulaciji spodaj (Razstavljanje tričlenika) nastavi drsnika na $3$ in $4$: ploščice $x^2$, $7$ palic $x$ in $12$ enic se zložijo v pravokotnik s stranicama $x + 3$ in $x + 4$. Nato nastavi oba drsnika na $3$ in opazuj, da pravokotnik postane kvadrat $(x + 3)^2$.

:::premisli
Za $x^2 + 7x + 12$ sta števili $3$ in $4$. Napovej, kakšna predznaka imata števili za $x^2 - 7x + 12$, in to utemelji s produktom in vsoto, ne s tabelo.
---
Obe sta negativni. Produkt $12$ je pozitiven, zato imata števili enak predznak. Vsota $-7$ je negativna, zato sta obe negativni: $-3$ in $-4$, torej $x^2 - 7x + 12 = (x-3)(x-4)$.
:::

Če pred $x^2$ stoji koeficient, ki ni $1$, najprej poskusi izpostaviti skupni faktor: $2x^2 - 10x + 12 = 2(x^2 - 5x + 6) = 2(x-2)(x-3)$.

**5. Vrstni red korakov.** Pri vsaki nalogi ravnaj takole:

1. Izpostavi skupni faktor, če obstaja.
2. Preštej člene v oklepaju. Dva člena: poskusi razliko kvadratov. Trije: popolni kvadrat ali Vietovo pravilo. Štirje: združi po skupinah.
3. Vsak nastali faktor preglej, ali ga je mogoče razstaviti naprej.
4. Naredi preizkus z množenjem.

## Rešeni primeri

### Primer 1 (lažji)

Razstavi izraz $12a^2b - 18ab^2 + 6ab$.

**Podatki:** izraz $12a^2b - 18ab^2 + 6ab$ s tremi členi
**Iščemo:** popoln razcep izraza v produkt

:::formula
$ab + ac + ad = a(b + c + d)$
:::

**Rešitev:**

1. Koeficienti so $12$, $18$ in $6$. Njihov največji skupni delitelj je $6$.
2. Spremenljivka $a$ nastopa z eksponenti $2$, $1$, $1$ (najmanjši je $1$), spremenljivka $b$ z eksponenti $1$, $2$, $1$ (najmanjši je $1$). Skupni faktor je $6ab$.
3. Delimo posamezne člene: $12a^2b : 6ab = 2a$, $18ab^2 : 6ab = 3b$, $6ab : 6ab = 1$.
4. Zapišemo: $12a^2b - 18ab^2 + 6ab = 6ab(2a - 3b + 1)$.
5. Preizkus: $6ab \cdot 2a = 12a^2b$, $6ab \cdot 3b = 18ab^2$, $6ab \cdot 1 = 6ab$. Ujema se.
6. Odgovor: $12a^2b - 18ab^2 + 6ab = 6ab(2a - 3b + 1)$.

### Primer 2 (srednji)

Pravokotna gozdna jasa ima ploščino $(x^2 - 5x - 14)\,\mathrm{m}^2$, kjer je $x > 7$. Stranici sta dvočlenika oblike $x + a$ in $x + b$ s celima $a$ in $b$. Poišči ju in izračunaj, koliko merita pri $x = 17$.

**Podatki:** ploščina $(x^2 - 5x - 14)\,\mathrm{m}^2$, torej $p = -5$ in $q = -14$; $x > 7$; nato $x = 17$
**Iščemo:** stranici $x + a$ in $x + b$ ter njuni dolžini pri $x = 17$

:::formula
Vietovo pravilo: $x^2 + px + q = (x+a)(x+b)$, če je $a + b = p$ in $a \cdot b = q$.
:::

**Rešitev:**

1. Iščemo števili z vsoto $-5$ in produktom $-14$.
2. Produkt je negativen, zato imata števili različna predznaka. Vsota je negativna, zato ima večje po absolutni vrednosti predznak minus.
3. Pari faktorjev števila $14$ so $1 \cdot 14$ in $2 \cdot 7$. Pri paru $1$ in $-14$ je vsota $-13$, pri paru $2$ in $-7$ pa $2 + (-7) = -5$. Drugi par ustreza.
4. Zapišemo $a = 2$ in $b = -7$: $x^2 - 5x - 14 = (x+2)(x-7)$.
5. Preizkus: $(x+2)(x-7) = x^2 - 7x + 2x - 14 = x^2 - 5x - 14$. Ujema se.
6. Pri $x = 17$: $x + 2 = 19$ in $x - 7 = 10$. Pogoj $x > 7$ poskrbi, da je tudi $x - 7$ pozitivna dolžina.
7. Preverba: $19 \cdot 10 = 190$ in $17^2 - 5 \cdot 17 - 14 = 190$.
8. Odgovor: stranici jase sta $(x + 2)\,\mathrm{m}$ in $(x - 7)\,\mathrm{m}$, pri $x = 17$ merita $19\,\mathrm{m}$ in $10\,\mathrm{m}$.

### Primer 3 (težji)

Razstavi do konca izraz $2x^3 + 4x^2 - 18x - 36$.

**Podatki:** izraz $2x^3 + 4x^2 - 18x - 36$ s štirimi členi
**Iščemo:** popoln razcep izraza v produkt

:::formula
$ab + ac = a(b + c)$, $\quad ax + ay + bx + by = (a+b)(x+y)$, $\quad a^2 - b^2 = (a-b)(a+b)$
:::

**Rešitev:**

1. Vsi koeficienti so deljivi z $2$, zato izpostavimo $2$: $2x^3 + 4x^2 - 18x - 36 = 2(x^3 + 2x^2 - 9x - 18)$.
2. V oklepaju so štirje členi. Združimo prva dva in zadnja dva: $x^2(x+2) - 9(x+2)$.
3. Izpostavimo skupni faktor $(x+2)$: $(x+2)(x^2 - 9)$.
4. Drugi faktor je razlika kvadratov, $x^2 - 9 = (x-3)(x+3)$.
5. Skupaj: $2(x+2)(x-3)(x+3)$.
6. Preizkus: $(x-3)(x+3) = x^2 - 9$, nato $(x+2)(x^2-9) = x^3 + 2x^2 - 9x - 18$, in po množenju z $2$ dobimo $2x^3 + 4x^2 - 18x - 36$. Preverimo še pri $x = 1$: prvotni izraz je $2 + 4 - 18 - 36 = -48$, razcep pa $2 \cdot 3 \cdot (-2) \cdot 4 = -48$.
7. Odgovor: $2x^3 + 4x^2 - 18x - 36 = 2(x+2)(x-3)(x+3)$.

### Primer 4 – zdaj ti

Kvadratno polje sončnic ima stranico $(x + 3)\,\mathrm{m}$, kjer je $x > 3$. Kmet ga zmanjša na kvadrat s stranico $(x - 3)\,\mathrm{m}$. Za koliko kvadratnih metrov se zmanjša ploščina? Izraz razstavi in poenostavi.

**Podatki:** prvotna stranica $(x + 3)\,\mathrm{m}$, nova stranica $(x - 3)\,\mathrm{m}$, $x > 3$
**Iščemo:** razliko ploščin $(x + 3)^2 - (x - 3)^2$ v čim krajši obliki

:::formula
$a^2 - b^2 = (a - b)(a + b)$, kjer sta $a = x + 3$ in $b = x - 3$
:::

**Rešitev:**

1. Razlika ploščin je razlika kvadratov, zato oklepajev ni treba kvadrirati.
2. Zapišemo: $(x + 3)^2 - (x - 3)^2 = \big[(x + 3) - (x - 3)\big]\big[(x + 3) + (x - 3)\big]$.
3. Poenostavi oba oklepaja sam in ju zmnoži, nato preveri:

:::premisli
Koliko je razlika ploščin? Preveri pri $x = 10$.
---
Prvi oklepaj je $x + 3 - x + 3 = 6$, drugi $2x$, zato je razlika $6 \cdot 2x = 12x\,\mathrm{m}^2$. Pri $x = 10$: $13^2 - 7^2 = 169 - 49 = 120$ in $12 \cdot 10 = 120$.
:::

## Pogoste napake

- **Pozabljena enica pri izpostavljanju.** Zapišeš $4x^2 + 4x = 4x \cdot x$. Razlog: ko je cel člen enak skupnemu faktorju, ne ostane nič, ampak $1$. Pravilno: $4x^2 + 4x = 4x(x + 1)$. Preizkus: $4x(x+1) = 4x^2 + 4x$.
- **Razcep ni popoln.** Zapišeš $6x^2 - 9x = 3(2x^2 - 3x)$ ali se ustaviš pri $x^4 - 16 = (x^2-4)(x^2+4)$. Razlog: nisi izpostavil največjega skupnega faktorja (tudi spremenljivke) oziroma nisi pogledal, ali se kak faktor da razstaviti naprej. Pravilno: $6x^2 - 9x = 3x(2x - 3)$ in $x^4 - 16 = (x-2)(x+2)(x^2+4)$.
- **Napačen predznak pri izpostavljanju minusa.** Zapišeš $-x^2 + 4x = -x(x + 4)$. Razlog: ko izpostaviš $-x$, se predznaka obeh členov v oklepaju obrneta. Pravilno: $-x^2 + 4x = -x(x - 4)$. Preizkus: $-x \cdot x = -x^2$ in $-x \cdot (-4) = 4x$.
- **Mešanje obrazcev.** Zapišeš $x^2 + 9 = (x+3)^2$ ali $x^2 - 9 = (x-3)^2$. Razlog: $(x+3)^2 = x^2 + 6x + 9$ ima srednji člen, razlika kvadratov ga nima, $x^2 + 9$ pa ni mogoče razstaviti. Pravilno: $x^2 - 9 = (x-3)(x+3)$, izraz $x^2 + 9$ ostane nerazstavljen.
- **Vietovo pravilo z napačnimi predznaki.** Za $x^2 - 5x + 6$ zapišeš $(x+2)(x+3)$, ker je $2 \cdot 3 = 6$. Razlog: preveril si le produkt, ne pa vsote; $2 + 3 = 5$, ne $-5$. Pravilno: iščeš števili z vsoto $-5$ in produktom $6$, to sta $-2$ in $-3$, zato je $x^2 - 5x + 6 = (x-2)(x-3)$.

## Povzetek

- Razstaviti pomeni zapisati vsoto kot produkt. Preizkus je množenje faktorjev nazaj.
- Izpostavljanje: $ab + ac = a(b+c)$. Vzemi največji skupni delitelj koeficientov in vsako spremenljivko z najmanjšim eksponentom. Pazi na člen, ki postane $1$.
- Po skupinah: $ax + ay + bx + by = (a+b)(x+y)$.
- Razlika kvadratov: $a^2 - b^2 = (a-b)(a+b)$. Vsote $x^2 + b^2$ ($b \neq 0$) z realnimi števili ne razstaviš.
- Popolni kvadrat: $a^2 \pm 2ab + b^2 = (a \pm b)^2$.
- Vietovo pravilo: $x^2 + px + q = (x+a)(x+b)$, kjer je $a + b = p$ in $a \cdot b = q$.
- Vrstni red: skupni faktor, nato obrazec glede na število členov, nato preglej vse faktorje in na koncu preizkus.

## Drugače: Na sliki

Izraze si predstavljaj kot ploščine pravokotnikov.

**Izpostavljanje.** Pravokotnik z višino $a$ in širino $b + c$ sestavljata dva pravokotnika, ki imata višino $a$ ter širini $b$ in $c$. Njuni ploščini sta $ab$ in $ac$. Cela ploščina je $a(b+c)$ in tudi $ab + ac$. Razstavljanje pomeni, da dva pravokotnika s skupno stranico $a$ prilepiš skupaj.

**Razlika kvadratov.** Iz kvadrata s stranico $a$ izreži kvadrat s stranico $b$ v spodnjem desnem kotu. Ostane lik v obliki črke L s ploščino $a^2 - b^2$. Razreži ga na zgornji trak (višina $a-b$, širina $a$) in spodnji levi kos (višina $b$, širina $a-b$). Drugi kos zasukaj in ga prilepi desno k prvemu. Nastane pravokotnik z višino $a-b$ in širino $a+b$, torej $a^2 - b^2 = (a-b)(a+b)$.

**Vietovo pravilo.** Pravokotnik s stranicama $x+3$ in $x+4$ razdelimo na štiri dele:

| | $x$ | $4$ |
|---|---|---|
| $x$ | $x^2$ | $4x$ |
| $3$ | $3x$ | $12$ |

Vsota ploščin je $x^2 + 4x + 3x + 12 = x^2 + 7x + 12$. Srednji člen je nastal iz $4x + 3x$, torej je $7 = 3 + 4$, zadnji člen pa iz $3 \cdot 4 = 12$.

## Drugače: Iz vsakdanjega življenja

**Nakup.** Kupiš $12$ zvezkov po $z$ evrov in $12$ svinčnikov po $s$ evrov. Plačilo je $12z + 12s$. Lažje je najprej izračunati ceno enega kompleta in jo pomnožiti: $12(z + s)$. To je izpostavljanje skupnega faktorja v praksi. Pri številkah: $37 \cdot 8 + 37 \cdot 2 = 37 \cdot 10 = 370$.

**Računanje na pamet.** Razliko kvadratov uporabiš za hitre račune: $98 \cdot 102 = (100-2)(100+2) = 100^2 - 2^2 = 10\,000 - 4 = 9\,996$. Prav tako $47 \cdot 53 = (50-3)(50+3) = 50^2 - 3^2 = 2\,491$.

**Dimenzije.** Pravokotna terasa ima ploščino $x^2 + 7x + 12$ kvadratnih metrov. Pri risanju načrta mora delavec vedeti, koliko merita stranici. Razcep $(x+3)(x+4)$ pove, da sta stranici dolgi $x+3$ in $x+4$ metra. Za $x = 2$ je to pravokotnik $5\,\text{m} \times 6\,\text{m}$ s ploščino $30\,\text{m}^2$, kar se ujema z $4 + 14 + 12 = 30$.

## Drugače: Korak za korakom s številkami

**Naloga A:** razstavi $4x^3 - 36x$.

| Korak | Kaj naredimo | Rezultat |
|---|---|---|
| 1 | Izpostavimo $4x$ (koeficienta sta $4$ in $36$, $D(4, 36) = 4$; $x$ z najmanjšim eksponentom $1$) | $4x(x^2 - 9)$ |
| 2 | Drugi faktor je razlika kvadratov $x^2 - 3^2$ | $4x(x-3)(x+3)$ |
| 3 | Preizkus pri $x = 2$: prvotni izraz $4 \cdot 8 - 72 = -40$, razcep $4 \cdot 2 \cdot (-1) \cdot 5 = -40$ | enako |

Preizkus pri $x = 3$ je še zanimivejši: prvotni izraz je $4 \cdot 27 - 108 = 0$, v razcepu pa je faktor $x - 3 = 0$, zato je produkt $0$.

**Naloga B:** razstavi $x^2 + 2x - 24$. Iščemo števili z vsoto $2$ in produktom $-24$. Ker je vsota pozitivna, ima večje število predznak plus:

| Par (produkt $-24$) | Vsota |
|---|---|
| $-1$ in $24$ | $23$ |
| $-2$ in $12$ | $10$ |
| $-3$ in $8$ | $5$ |
| $-4$ in $6$ | $2$ |

Vsoto $2$ ima zadnji par, zato je $x^2 + 2x - 24 = (x-4)(x+6)$. Preizkus pri $x = 1$: prvotni izraz je $1 + 2 - 24 = -21$, razcep pa $(-3) \cdot 7 = -21$.

## Drugače: Bolj natančno

**Zakaj Vietovo pravilo deluje.** Iz $(x+a)(x+b) = x^2 + bx + ax + ab = x^2 + (a+b)x + ab$ vidiš, da je koeficient pri $x$ vsota števil $a$ in $b$, prosti člen pa njun produkt. Primerjava s $x^2 + px + q$ da natanko pogoja $a + b = p$ in $a \cdot b = q$.

**Zakaj vsote kvadratov ni mogoče razstaviti.** Denimo, da bi veljalo $x^2 + 1 = (x+a)(x+b)$ za vse $x$. Pri $x = -a$ bi bila desna stran enaka $0$, leva pa $a^2 + 1 \ge 1$. To je protislovje. Enako velja za $x^2 + c$ pri vsakem $c > 0$.

**Odvisnost od množice števil.** Izraz $x^2 - 2$ ni razstavljiv s celimi števili, z realnimi števili pa je $x^2 - 2 = (x - \sqrt{2})(x + \sqrt{2})$. V tej temi razstavljamo s celimi števili, razlika kvadratov pa deluje, kadar sta oba člena kvadrata.

**Tričleniki, pri katerih koeficient pred $x^2$ ni $1$.** Za $2x^2 + 7x + 3$ poišči števili z vsoto $7$ in produktom $2 \cdot 3 = 6$. To sta $1$ in $6$. Srednji člen razbijemo: $2x^2 + x + 6x + 3 = x(2x+1) + 3(2x+1) = (2x+1)(x+3)$. Preizkus: $(2x+1)(x+3) = 2x^2 + 6x + x + 3 = 2x^2 + 7x + 3$.

## Preveri se

? Katera razdelitev pravokotnika ustreza tričleniku $x^2 + 7x + 10$?
- Stranici $x + 3$ in $x + 4$, deli $x^2$, $3x$, $4x$, $12$
~ Vsota $3 + 4 = 7$ je prava, produkt pa je $12$, ne $10$. Preveriti moraš oba pogoja.
+ Stranici $x + 2$ in $x + 5$, deli $x^2$, $2x$, $5x$, $10$
- Stranici $x + 1$ in $x + 10$, deli $x^2$, $x$, $10x$, $10$
~ Produkt $1 \cdot 10 = 10$ je pravi, vsota pa je $11$. Srednji del bi bil $11x$.
> Iščemo števili z vsoto $7$ in produktom $10$: to sta $2$ in $5$. Deli $2x + 5x = 7x$ dajo srednji člen, del $2 \cdot 5 = 10$ prosti člen.

? Brez kalkulatorja: koliko je $x^2 + 4x + 4$ pri $x = 98$?
- $9\,608$
~ To je $98^2 + 2^2$. Izraz je $(x + 2)^2$, ta pa ni enak $x^2 + 4$, ker ima še srednji člen $4x$.
- $9\,600$
~ To je $(98 - 2)(98 + 2)$, razlika kvadratov. Tu sta oba predznaka plus, zato je to kvadrat vsote.
- $9\,604$
~ To je samo $98^2$. Pozabil si člena $4x + 4$.
+ $10\,000$
> $x^2 + 4x + 4 = (x + 2)^2$, pri $x = 98$ je to $100^2 = 10\,000$.

? Zakaj izraza $x^2 + 9$ ne moremo razstaviti v $(x + a)(x + b)$ z realnima $a$ in $b$?
- Ker $9$ ni kvadrat.
~ $9 = 3^2$ je kvadrat. Ovira je znak plus med členoma, ne število $9$.
- Ker nima skupnega faktorja.
~ Tudi $x^2 - 9$ nima skupnega faktorja, pa ga razstavimo v $(x - 3)(x + 3)$.
+ Ker bi potrebovali $a + b = 0$ in $a \cdot b = 9$, takih realnih števil pa ni.
- Lahko ga: $x^2 + 9 = (x + 3)^2$.
~ $(x + 3)^2 = x^2 + 6x + 9$ ima srednji člen $6x$, ki ga v $x^2 + 9$ ni.
> Člena s $x$ ni, zato je $p = 0$. Iz $a + b = 0$ sledi $b = -a$ in $a \cdot b = -a^2 \le 0$, kar ne more biti $9$.

? Razcep je $(x - 3)(x + 5)$. Kateri tričlenik smo razstavili?
- $x^2 - 2x - 15$
~ Vsota je $-3 + 5 = 2$, ne $-2$. Predznaka sta zamenjana.
+ $x^2 + 2x - 15$
- $x^2 + 2x + 15$
~ Produkt $(-3) \cdot 5$ je negativen, zato je prosti člen $-15$.
- $x^2 + 8x - 15$
~ Sešteti moraš števili s predznakoma, $-3 + 5 = 2$, ne $3 + 5$.
> $(x - 3)(x + 5) = x^2 + 5x - 3x - 15 = x^2 + 2x - 15$.

? Pravokotna njiva ima ploščino $(x^2 - x - 12)\,\mathrm{m}^2$, ena stranica meri $(x + 3)\,\mathrm{m}$. Koliko meri druga?
- $(x + 4)\,\mathrm{m}$
~ Preveril si le $3 \cdot 4 = 12$ brez predznaka. $(x + 3)(x + 4) = x^2 + 7x + 12$.
- $(x - 2)\,\mathrm{m}$
~ Iskal si le vsoto, in to s $p = 1$ namesto $-1$: $3 + (-2) = 1$. Produkt pa je $3 \cdot (-2) = -6$, ne $-12$: $(x + 3)(x - 2) = x^2 + x - 6$.
+ $(x - 4)\,\mathrm{m}$
> Iščemo $b$ z $3 + b = -1$ in $3 \cdot b = -12$, torej $b = -4$. Preizkus: $(x + 3)(x - 4) = x^2 - x - 12$.

:::simboli
x, y | spremenljivki | | |
a, b | števili z vsoto $p$ in zmnožkom $q$ (Vietovo pravilo) | | | v $ab + ac$ je $a$ skupni faktor, v $a^2 - b^2$ osnovi, v primeru 1 spremenljivki
c, d | členi v oklepaju po izpostavljanju | | | v $x^2 + c$ je $c$ pozitivno število
p | koeficient pri $x$ v tričleniku | p = a + b | |
q | prosti člen tričlenika | q = a \cdot b | |
:::
