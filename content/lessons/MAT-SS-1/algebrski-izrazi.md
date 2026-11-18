---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Doma poišči kvadraten pekač in mu z ravnilom izmeri stranico. Recimo, da meri $20\,\text{cm}$. Za dno potrebuješ $20 \cdot 20 = 400\,\text{cm}^2$ peki papirja. Zdaj si zamisli večji pekač, ki ima stranico daljšo za $5\,\text{cm}$. Koliko papirja potrebuješ zanj?

Marsikdo hitro reče $400 + 5^2 = 425\,\text{cm}^2$. Izmeri ali izračunaj: $25 \cdot 25 = 625\,\text{cm}^2$. Manjka kar $200\,\text{cm}^2$. Položi mali list papirja v kot velikega pekača in odgovor vidiš: ob dveh robovih ostaneta prosta trakova, vsak meri $20\,\text{cm} \times 5\,\text{cm}$.

S črkami tak premislek naredimo za vse pekače naenkrat. Črke potenciramo in množimo po istih pravilih kot števila, zato ti pri tem pomaga znanje o potencah. Pravila za množenje izrazov boš potreboval pri razstavljanju, pri ulomljenih izrazih in pri reševanju enačb.

## Razlaga

**1. Algebrski izraz in njegova vrednost.** Algebrski izraz je izraz iz števil in črk (**spremenljivk**), povezanih z računskimi operacijami. Njegovo **vrednost** dobimo, če namesto črk vstavimo števila. Vzemimo izraz $3x^2 - 5x + 2$. Pri $x = 2$ je njegova vrednost $3 \cdot 4 - 10 + 2 = 4$. Pri $x = -1$ je $3 \cdot (-1)^2 - 5 \cdot (-1) + 2 = 3 + 5 + 2 = 10$. Negativno število pri vstavljanju vedno zapiši v oklepaju. Izraz nima enačaja in ničesar ne trdi; šele enačba, na primer $3x^2 - 5x + 2 = 4$, je trditev, v kateri je črka neznanka (izraz in enačbo podrobneje primerjamo pri linearnih enačbah).

**2. Enočlenik.** Enočlenik je zmnožek števila in potenc spremenljivk, na primer $-4a^2b^3$. Število $-4$ je **koeficient**, **stopnja** enočlenika pa je vsota eksponentov: $2 + 3 = 5$. Enočlenika sta **podobna**, če imata enak **spremenljivi del** (vse, kar ostane, ko odmisliš koeficient): $5ab$ in $-2ab$ sta podobna, $5ab$ in $5a^2b$ pa nista.

- Podobne enočlenike seštejemo tako, da seštejemo koeficiente, spremenljivi del pa ostane: $5ab - 2ab = 3ab$. Nepodobnih enočlenikov ne moremo združiti.
- Enočlenike pomnožimo tako, da zmnožimo koeficiente in potence iste spremenljivke po pravilu $a^m \cdot a^n = a^{m+n}$: $(-3a^2b) \cdot (4ab^3) = -12a^3b^4$.

**3. Mnogočlenik.** Vsota enočlenikov je **mnogočlenik**. Mnogočlenik z dvema členoma je dvočlenik (na primer $a + b$), s tremi pa tričlenik (na primer $2x^3 - 5x + 7$). Stopnja mnogočlenika je največja stopnja njegovih členov, pri $2x^3 - 5x + 7$ torej $3$. Člene običajno uredimo po padajočih potencah.

Pri seštevanju in odštevanju mnogočlenikov odpremo oklepaje in združimo podobne člene. Pazi na pravilo: **minus pred oklepajem spremeni predznak vsakemu členu v oklepaju**.

$$(3x^2 - 2x + 1) - (x^2 + 4x - 5) = 3x^2 - 2x + 1 - x^2 - 4x + 5 = 2x^2 - 6x + 6$$

**4. Množenje enočlenika z mnogočlenikom.** Uporabimo razčlenjevalni zakon (distributivnost) $a(b + c) = ab + ac$: z enočlenikom pomnožimo vsak člen v oklepaju.

$$-2x(3x^2 - x + 4) = -6x^3 + 2x^2 - 8x$$

**5. Množenje mnogočlenikov.** Vsak člen prvega mnogočlenika pomnožimo z vsakim členom drugega, nato združimo podobne člene:

$$(a + b)(c + d) = ac + ad + bc + bd.$$

Na primer $(2x + 3)(x - 5) = 2x^2 - 10x + 3x - 15 = 2x^2 - 7x - 15$. Če ima prvi mnogočlenik $m$ členov, drugi pa $n$, je pred združevanjem $m \cdot n$ členov; pri dveh dvočlenikih so torej štirje.

**6. Kvadrat dvočlenika.** Vrnimo se k pekaču. Primerjajmo kvadrat vsote z vsoto kvadratov pri nekaj parih števil:

| $a + b$ | $(a + b)^2$ | $a^2 + b^2$ |
|---|---|---|
| $3 + 2$ | $25$ | $13$ |
| $5 + 1$ | $36$ | $26$ |
| $4 + 3$ | $49$ | $25$ |
| $20 + 5$ | $625$ | $425$ |

Razlike med drugim in tretjim stolpcem so po vrsti $12$, $10$, $24$ in $200$. Niso naključne. Pri $3 + 2$ je $12 = 2 \cdot 3 \cdot 2$, pri $5 + 1$ je $10 = 2 \cdot 5 \cdot 1$. Preveri, da enak vzorec velja tudi v drugih dveh vrsticah.

:::premisli
Kateri vzorec vidiš v razlikah? Po njem napovej razliko $(10 + 3)^2 - (10^2 + 3^2)$, preden računaš. Nato preveri.
---
Po vzorcu je $2 \cdot 10 \cdot 3 = 60$. Preverba: $169 - 109 = 60$.
:::

Razlika je torej vedno $2ab$. Zakaj ravno $2ab$? Kvadrat s stranico $a + b$ (dno pekača) razrežemo z enim vodoravnim in enim navpičnim rezom:

| | $a$ | $b$ |
|---|---|---|
| $a$ | $a^2$ | $ab$ |
| $b$ | $ab$ | $b^2$ |

Dobimo dva kvadrata, $a^2$ in $b^2$, ter dva pravokotnika $ab$.

Isto da račun: $(a + b)^2 = (a + b)(a + b) = a^2 + ab + ba + b^2$. Ker je $ba = ab$, velja pravilo za **kvadrat dvočlenika**:

$$(a + b)^2 = a^2 + 2ab + b^2$$

$$(a - b)^2 = a^2 - 2ab + b^2$$

Z besedami: kvadrat prvega člena, dvakratni zmnožek obeh členov in kvadrat drugega člena. Pri razliki je minus le pri srednjem členu, saj je $(-b)^2 = b^2$. Primera: $(x + 4)^2 = x^2 + 8x + 16$ in $(3x - 2)^2 = (3x)^2 - 2 \cdot 3x \cdot 2 + 2^2 = 9x^2 - 12x + 4$.

**7. Zmnožek vsote in razlike.** Pri $(a + b)(a - b) = a^2 - ab + ab - b^2$ se srednja člena uničita:

$$(a + b)(a - b) = a^2 - b^2.$$

Rezultat je razlika kvadratov. Primer: $(2x + 5)(2x - 5) = 4x^2 - 25$.

**8. Kub dvočlenika.** Iz kock sladkorja sestavi veliko kocko z robom $3$ kocke. Potrebuješ $3^3 = 27$ kock, ne pa $2^3 + 1^3 = 9$. Rob razdeli na $2 + 1$ in razstavi kocko: dobiš kocko $2 \cdot 2 \cdot 2 = 8$, tri plošče $2 \cdot 2 \cdot 1$ (skupaj $12$), tri palčke $2 \cdot 1 \cdot 1$ (skupaj $6$) in eno samo kocko. Res je $8 + 12 + 6 + 1 = 27$.

Enako da račun. Kub izpeljemo iz kvadrata: $(a + b)^3 = (a + b)^2(a + b) = (a^2 + 2ab + b^2)(a + b)$. Pomnožimo vsak člen z vsakim: $a^3 + a^2b + 2a^2b + 2ab^2 + ab^2 + b^3$. Podobne člene združimo:

$$(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$$

$$(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$$

Koeficienti so $1, 3, 3, 1$. Potence prvega člena od leve proti desni padajo, potence drugega naraščajo. Pri razliki se predznaki izmenjujejo: $+, -, +, -$. Primera: $(x + 2)^3 = x^3 + 6x^2 + 12x + 8$ in $(x - 2)^3 = x^3 - 6x^2 + 12x - 8$.

:::premisli
Kocko z robom $4 = 3 + 1$ razstaviš na enak način. Koliko kock sladkorja je v treh ploščah in koliko v treh palčkah?
---
Plošče so $3 \cdot 3 \cdot 1$, skupaj $3 \cdot 9 = 27$ kock. Palčke so $3 \cdot 1 \cdot 1$, skupaj $9$ kock. Z veliko kocko $27$ in eno samo kocko je to $27 + 27 + 9 + 1 = 64 = 4^3$.
:::

**9. Pregled.**

| Izraz | Rezultat |
|---|---|
| $(a + b)^2$ | $a^2 + 2ab + b^2$ |
| $(a - b)^2$ | $a^2 - 2ab + b^2$ |
| $(a + b)(a - b)$ | $a^2 - b^2$ |

Po vrsti so to kvadrat vsote, kvadrat razlike ter zmnožek vsote in razlike. Kub vsote in kub razlike:

$$(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$$

$$(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$$

Črki $a$ in $b$ lahko nadomestimo s poljubnima izrazoma, tudi z enočlenikoma: pri $(2x - 5)^2$ je $a = 2x$ in $b = 5$.

**10. Preizkus.** Razvit izraz preveriš tako, da vstaviš isto majhno število v izvirni in v razviti izraz. Če se vrednosti ne ujemata, si se zmotil. Ne izberi ničle, ker pri njej večina členov izgine in napaka ostane skrita.

## Rešeni primeri

### Primer 1 (lažji)

Poenostavi izraz $(2x^2 - 3x + 5) - (x^2 + 4x - 7)$ in izračunaj njegovo vrednost za $x = 2$.

**Podatki:** izraz $(2x^2 - 3x + 5) - (x^2 + 4x - 7)$, vrednost spremenljivke $x = 2$
**Iščemo:** poenostavljen izraz in njegovo vrednost pri $x = 2$

:::formula
Minus pred oklepajem spremeni predznak vsakemu členu v njem: $-(p + q - r) = -p - q + r$. Podobne člene združimo: $m x^k + n x^k = (m + n) x^k$.
:::

**Rešitev:**

1. Odpremo drugi oklepaj in spremenimo predznake: $2x^2 - 3x + 5 - x^2 - 4x + 7$.
2. Združimo člene z $x^2$: $2x^2 - x^2 = x^2$. Združimo člene z $x$: $-3x - 4x = -7x$. Združimo števila: $5 + 7 = 12$.
3. Poenostavljen izraz je $x^2 - 7x + 12$.
4. Vrednost pri $x = 2$: $2^2 - 7 \cdot 2 + 12 = 4 - 14 + 12 = 2$.
5. Preizkus z izvirnim izrazom: $(2 \cdot 4 - 6 + 5) - (4 + 8 - 7) = 7 - 5 = 2$. Rezultata se ujemata.
6. Odgovor: izraz je enak $x^2 - 7x + 12$, njegova vrednost pri $x = 2$ je $2$.

### Primer 2 (srednji)

Zmnoži in poenostavi izraz $(3x - 2)(2x + 5) - (x - 4)(x + 4)$.

**Podatki:** izraz $(3x - 2)(2x + 5) - (x - 4)(x + 4)$
**Iščemo:** poenostavljen izraz brez oklepajev

:::formula
$(a + b)(c + d) = ac + ad + bc + bd$ in $(a + b)(a - b) = a^2 - b^2$
:::

**Rešitev:**

1. Prvi zmnožek (vsak člen z vsakim): $(3x - 2)(2x + 5) = 6x^2 + 15x - 4x - 10 = 6x^2 + 11x - 10$.
2. Drugi zmnožek je zmnožek vsote in razlike: $(x - 4)(x + 4) = x^2 - 16$.
3. Drugi rezultat damo v oklepaj, ker pred njim stoji minus: $(6x^2 + 11x - 10) - (x^2 - 16) = 6x^2 + 11x - 10 - x^2 + 16$.
4. Združimo podobne člene: $6x^2 - x^2 = 5x^2$, člen $11x$ ostane, $-10 + 16 = 6$. Rezultat: $5x^2 + 11x + 6$.
5. Preizkus pri $x = 1$: izvirni izraz je $(1) \cdot (7) - (-3) \cdot (5) = 7 + 15 = 22$, rezultat pa $5 + 11 + 6 = 22$.
6. Odgovor: izraz je enak $5x^2 + 11x + 6$.

### Primer 3 (težji, zdaj ti)

Kocka sira ima rob $x$ centimetrov. Kuhar z vseh šestih ploskev odreže skorjo, debelo $1\,\text{cm}$. Zapiši prostornino odrezane skorje kot mnogočlenik. Nato jo izračunaj za $x = 10$.

**Podatki:** rob kocke $x$ (v cm), debelina skorje $1\,\text{cm}$ na vsaki ploskvi, za račun $x = 10$
**Iščemo:** prostornino skorje $V$ kot mnogočlenik in njeno vrednost pri $x = 10$

:::formula
Prostornina kocke z robom $a$ je $a^3$. Kub razlike: $(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$
:::

**Rešitev:**

1. Sredica je kocka. Njen rob je krajši za $1\,\text{cm}$ na vsaki strani, torej meri $x - 2$.
2. Skorja je cela kocka brez sredice: $V = x^3 - (x - 2)^3$.
3. Razvijemo kub razlike z $a = x$ in $b = 2$: $(x - 2)^3 = x^3 - 6x^2 + 12x - 8$.
4. Odštejemo. Minus pred oklepajem obrne vse predznake: $V = x^3 - x^3 + 6x^2 - 12x + 8 = 6x^2 - 12x + 8$.
5. Zdaj ti: izračunaj $V$ pri $x = 10$ in rezultat preveri z razliko $10^3 - 8^3$.

:::premisli
Koliko kubičnih centimetrov sira odreže kuhar pri $x = 10$?
---
$6 \cdot 100 - 12 \cdot 10 + 8 = 600 - 120 + 8 = 488$. Preizkus: $1000 - 512 = 488$. Kuhar odreže $488\,\text{cm}^3$ skorje, skoraj polovico kocke.
:::

## Pogoste napake

- **»$(a + b)^2 = a^2 + b^2$« in »$(a + b)^3 = a^3 + b^3$«.** Razlog: kvadrat pomeni množenje oklepaja s samim seboj, pri čemer nastaneta še mešana člena. Preizkus: $(2 + 3)^2 = 25$, vendar $2^2 + 3^2 = 13$. Pravilno: $(a + b)^2 = a^2 + 2ab + b^2$ in $(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$.
- **Napačen predznak pri kvadratu razlike: »$(x - 3)^2 = x^2 - 9$« ali »$x^2 - 6x - 9$«.** Razlog: minus je le pri srednjem členu, saj je $(-3)^2 = +9$. Izraz $x^2 - 9$ je rezultat zmnožka $(x - 3)(x + 3)$, kar je drug primer. Pravilno: $(x - 3)^2 = x^2 - 6x + 9$.
- **Minus pred oklepajem: »$5x - (2x - 3) = 3x - 3$«.** Razlog: minus spremeni predznak vsakemu členu v oklepaju, torej tudi zadnjemu. Pravilno: $5x - (2x - 3) = 5x - 2x + 3 = 3x + 3$.
- **Člena nista pomnožena vsak z vsakim: »$(x + 2)(x + 3) = x^2 + 6$«.** Razlog: pomnožila sta se le prva in zadnja člena. Pravilno: pomnožimo vse štiri pare, $(x + 2)(x + 3) = x^2 + 3x + 2x + 6 = x^2 + 5x + 6$. Namig: pred združevanjem preštej člene, pri dveh dvočlenikih morajo biti štirje.
- **Mešanje vsote in zmnožka enočlenikov: »$3x + 2x^2 = 5x^3$« ali »$3x \cdot 2x = 6x$«.** Razlog: seštevamo samo podobne člene, pri množenju pa se eksponenti iste spremenljivke seštejejo ($x \cdot x = x^2$). Pravilno: $3x + 2x^2$ ni mogoče poenostaviti, $3x + 2x = 5x$ in $3x \cdot 2x = 6x^2$.

## Povzetek

- Algebrski izraz sestavljajo števila, spremenljivke in računske operacije. Vrednost izraza dobiš z vstavljanjem števil, negativna števila v oklepaju.
- Seštevamo samo podobne člene (enak spremenljivi del): koeficienti se seštejejo. Pri množenju se koeficienti zmnožijo, eksponenti iste spremenljivke pa seštejejo.
- Minus pred oklepajem spremeni predznak vsem členom v oklepaju.
- Mnogočlenike množimo tako, da vsak člen pomnožimo z vsakim: $(a + b)(c + d) = ac + ad + bc + bd$.
- Kvadrat dvočlenika: $(a \pm b)^2 = a^2 \pm 2ab + b^2$. Zmnožek vsote in razlike: $(a + b)(a - b) = a^2 - b^2$.
- Kub dvočlenika: $(a \pm b)^3 = a^3 \pm 3a^2b + 3ab^2 \pm b^3$, koeficienti so $1, 3, 3, 1$.
- Razvit izraz preveri tako, da v oba izraza vstaviš isto majhno število, ki ni $0$.

## Ponovitev

**Formule**
- $(a + b)(c + d) = ac + ad + bc + bd$ (na pamet)
- $(a \pm b)^2 = a^2 \pm 2ab + b^2$ (na pamet)
- $(a + b)(a - b) = a^2 - b^2$ (na pamet)
- $(a \pm b)^3 = a^3 \pm 3a^2b + 3ab^2 \pm b^3$ (na pamet)

**Postopek**
1. Razvij kvadrate in kube dvočlenikov po formulah.
2. Odpravi oklepaje: vsak člen z vsakim, minus pred oklepajem obrne vse predznake.
3. Združi podobne člene (enak spremenljivi del).
4. Preveri: v začetni in končni izraz vstavi isto majhno število, ki ni $0$.

**Pazi na**
- $(a + b)^2 \ne a^2 + b^2$: ne pozabi mešanega člena $2ab$.
- Pri $(x - 3)^2$ je minus le pri srednjem členu: $x^2 - 6x + 9$.
- Seštevaš samo podobne člene: $3x + 2x^2$ ostane tak, $3x \cdot 2x = 6x^2$.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Poenostavite izraz $(x + 2)^3 - x(x + 3)^2$.

**Rešitev:**

1. Kub vsote: $(x + 2)^3 = x^3 + 3 \cdot x^2 \cdot 2 + 3 \cdot x \cdot 2^2 + 2^3 = x^3 + 6x^2 + 12x + 8$.
2. Kvadrat vsote in množenje z $x$: $x(x + 3)^2 = x(x^2 + 6x + 9) = x^3 + 6x^2 + 9x$.
3. Odštejemo, minus spremeni predznak vsem členom: $x^3 + 6x^2 + 12x + 8 - x^3 - 6x^2 - 9x = 3x + 8$.
4. Preizkus pri $x = 1$: izvirni izraz je $3^3 - 1 \cdot 4^2 = 27 - 16 = 11$, rezultat pa $3 + 8 = 11$.
5. Odgovor: $(x + 2)^3 - x(x + 3)^2 = 3x + 8$.

**Točkovanje:** 1 točka za razvoj $(x + 2)^3 = x^3 + 6x^2 + 12x + 8$, 1 točka za $x(x + 3)^2 = x^3 + 6x^2 + 9x$, 1 točka za rezultat $3x + 8$.

### Naloga 2: krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Kvader ima robove dolge $x$, $x + 2$ in $x - 2$ centimetrov, pri čemer je $x > 2$.

a) Prostornino kvadra zapišite kot mnogočlenik. (2 točki)
b) Površino kvadra zapišite kot mnogočlenik. (2 točki)
c) Kocka ima rob $x + 1$ centimetrov. Kot mnogočlenik zapišite, za koliko je prostornina kocke večja od prostornine kvadra, in rezultat preverite pri $x = 5$. (3 točke)

**Rešitev:**

1. a) Zmnožek vsote in razlike: $(x + 2)(x - 2) = x^2 - 4$.
2. a) Prostornina kvadra: $x(x + 2)(x - 2) = x(x^2 - 4) = (x^3 - 4x)\,\text{cm}^3$.
3. b) Ploščine treh različnih ploskev: $x(x + 2) = x^2 + 2x$, $x(x - 2) = x^2 - 2x$ in $(x + 2)(x - 2) = x^2 - 4$.
4. b) Površina: $2\big[(x^2 + 2x) + (x^2 - 2x) + (x^2 - 4)\big] = 2(3x^2 - 4) = (6x^2 - 8)\,\text{cm}^2$.
5. c) Kub vsote: $(x + 1)^3 = x^3 + 3x^2 + 3x + 1$.
6. c) Razlika prostornin: $(x^3 + 3x^2 + 3x + 1) - (x^3 - 4x) = x^3 + 3x^2 + 3x + 1 - x^3 + 4x = 3x^2 + 7x + 1$.
7. c) Preizkus pri $x = 5$: kocka ima rob $6$, kvader robove $5$, $7$ in $3$, zato je razlika $216 - 105 = 111$. Mnogočlenik da $3 \cdot 25 + 7 \cdot 5 + 1 = 111$.
8. Odgovor: prostornina kvadra je $(x^3 - 4x)\,\text{cm}^3$, površina $(6x^2 - 8)\,\text{cm}^2$, prostornina kocke je večja za $(3x^2 + 7x + 1)\,\text{cm}^3$, pri $x = 5$ za $111\,\text{cm}^3$.

**Točkovanje:** a) 1 točka za $(x + 2)(x - 2) = x^2 - 4$, 1 točka za $x^3 - 4x$; b) 1 točka za ploščine treh ploskev, 1 točka za površino $6x^2 - 8$; c) 1 točka za razvoj $(x + 1)^3$, 1 točka za $3x^2 + 7x + 1$ (s pravilnimi predznaki po odpravi oklepaja), 1 točka za preizkus pri $x = 5$ ($111$).

### Ustno vprašanje 1

:::premisli
Navedi primer, ki pokaže, da kvadrat vsote ni enak vsoti kvadratov, in pojasni, kateri člen manjka.
---
Na primer $(2 + 3)^2 = 25$, vsota kvadratov pa je $2^2 + 3^2 = 13$. Pravilno je $(a + b)^2 = (a + b)(a + b) = a^2 + 2ab + b^2$, manjka torej dvakratni zmnožek obeh členov $2ab$. Geometrijsko kvadrat s stranico $a + b$ razpade na kvadrata s ploščinama $a^2$ in $b^2$ ter na dva pravokotnika s ploščino $ab$.
:::

### Ustno vprašanje 2

:::premisli
Izpelji pravilo za kub dvočlenika $(a + b)^3$ in iz njega zapiši še pravilo za $(a - b)^3$.
---
Kub zapišemo kot $(a + b)^3 = (a + b)^2(a + b) = (a^2 + 2ab + b^2)(a + b)$. Ko pomnožimo vsak člen z vsakim, dobimo $a^3 + a^2b + 2a^2b + 2ab^2 + ab^2 + b^3$. Po združevanju podobnih členov je $(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$. Če namesto $b$ vstavimo $-b$, dobimo $(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$, saj imajo lihe potence števila $-b$ negativen predznak.
:::

### Ustno vprašanje 3

:::premisli
Pojasni razliko med algebrskim izrazom in enačbo ter med spremenljivko in neznanko.
---
Algebrski izraz je zapis iz števil, spremenljivk in računskih operacij brez enačaja, ki ga lahko poenostavimo ali izračunamo njegovo vrednost. Enačba je trditev, da sta dva izraza enaka, zato je pri danih vrednostih črk resnična ali neresnična. Spremenljivka je črka, ki lahko zavzame poljubno vrednost iz dane množice, izraz pa ima pri vsaki vrednosti svojo vrednost. Neznanka je črka v enačbi, katere vrednost iščemo: iščemo števila, pri katerih je enačba resnična, in ta števila so rešitve enačbe.
:::

## Drugače: Korak za korakom s številkami

Razvijmo $(2x - 5)^2$ po korakih in rezultat preverimo.

1. Prepoznam kvadrat razlike $(a - b)^2$ in določim člena: $a = 2x$, $b = 5$.
2. Kvadriram prvi člen: $(2x)^2 = 4x^2$.
3. Dvakratni zmnožek obeh členov, predznak minus: $-2 \cdot 2x \cdot 5 = -20x$.
4. Kvadriram drugi člen (predznak je vedno plus): $5^2 = 25$.
5. Sestavim vse tri člene: $4x^2 - 20x + 25$.
6. Preizkus pri $x = 3$: $(6 - 5)^2 = 1$ in $36 - 60 + 25 = 1$.

Pri kubu je postopek podoben. Za $(x - 1)^3$ je $a = x$ in $b = 1$. Zapišemo koeficiente $1, 3, 3, 1$ in predznake $+, -, +, -$. Potence prvega člena so $x^3, x^2, x, 1$, potence drugega pa $1$ povsod, saj je $1^k = 1$. Dobimo $x^3 - 3x^2 + 3x - 1$. Preizkus pri $x = 2$: leva stran je $(2 - 1)^3 = 1$, desna pa $8 - 12 + 6 - 1 = 1$.

## Drugače: Kot zgodba

Pek Marko peče pogačo v kvadratnem pekaču s stranico $30\,\text{cm}$. Za praznik ga prosijo za večjo, s stranico $40\,\text{cm}$. »Pekač je daljši za $10\,\text{cm}$, torej dodam malo testa,« si misli. Vajenka ga ustavi in na mizo položi stari pekač v kot novega.

Ob desnem robu ostane prazen trak $30\,\text{cm} \times 10\,\text{cm}$. Enak trak ostane ob spodnjem robu. V kotu med njima je še kvadratek $10\,\text{cm} \times 10\,\text{cm}$. Marko sešteje: $900 + 300 + 300 + 100 = 1600$. Dno se ni povečalo za $100\,\text{cm}^2$, ampak za $700\,\text{cm}^2$.

Vajenka zapiše še s črkami. Stari pekač ima stranico $a$, podaljšek je $b$. Novo dno je $a^2$ (staro dno), $2ab$ (oba trakova) in $b^2$ (kotiček). Trakova sta tista, ki ju Marko skoraj pozabi. Prav tako ju pozabi, kdor napačno napiše $(a + b)^2 = a^2 + b^2$.

## Preveri se

? Kvadraten kos torte s stranico $x + 3$ razrežemo z enim vodoravnim in enim navpičnim rezom na štiri dele. Katere ploščine imajo deli?
- $x^2$ in $9$
~ Zdi se, da je $(x + 3)^2 = x^2 + 9$, a ob dveh robovih ostaneta še dva pravokotnika.
+ $x^2$, $3x$, $3x$ in $9$
- $x^2$, $3x$ in $9$
~ Pravokotnika sta dva, eden ob desnem in eden ob spodnjem robu, zato je srednji člen $2 \cdot 3x = 6x$.
- $x^2$, $6$, $6$ in $9$
~ Pravokotnik ima stranici $x$ in $3$, zato je njegova ploščina $3x$, ne $2 \cdot 3$.
> Deli so kvadrat $x \cdot x$, dva pravokotnika $x \cdot 3$ in kvadratek $3 \cdot 3$. Skupaj $(x + 3)^2 = x^2 + 6x + 9$.

? (brez računala) Izračunaj $98^2$ s pomočjo $(100 - 2)^2$.
= 9604 | 0
~ 9996 | To je $100^2 - 2^2$, kot da bi bil kvadrat razlike enak razliki kvadratov. Manjka člen $-2 \cdot 100 \cdot 2$.
~ 10004 | To je $100^2 + 2^2$. Ker je $98 < 100$, mora biti $98^2$ manj kot $10\,000$.
~ 9600 | Pravilno si odštel $400$, pozabil pa si prišteti kvadrat drugega člena $2^2 = 4$.
> $(100 - 2)^2 = 10\,000 - 400 + 4 = 9604$. Ocena: $98^2$ je malo pod $10\,000$, za približno $2 \cdot 100 \cdot 2 = 400$.

? Zakaj je zadnji člen v razvoju $(x - 4)^2$ pozitiven?
- Ker pri kvadratu vse člene pišemo s plusom.
~ Potem bi bil tudi srednji člen pozitiven in bi dobil $(x + 4)^2$. Srednji člen $-8x$ je negativen.
+ Ker je $(-4)^2 = (-4) \cdot (-4) = 16$.
- Ni pozitiven, pravilno je $x^2 - 8x - 16$.
~ Minus je le pri srednjem členu. Kvadrat negativnega števila je pozitiven.
- Ker je $(x - 4)^2$ zmnožek vsote in razlike.
~ Zmnožek vsote in razlike je $(x - 4)(x + 4) = x^2 - 16$, tam je zadnji člen negativen.
> Zadnji člen je kvadrat drugega člena $-4$. Zmnožek dveh negativnih števil je pozitiven, zato $(x - 4)^2 = x^2 - 8x + 16$.

? Kvadrat katerega dvočlenika je $9x^2 - 12x + 4$?
- $(9x - 2)^2$
~ Prvi člen v oklepaju je tisti, ki da na kvadrat $9x^2$, torej $3x$. Iz $(9x)^2$ dobiš $81x^2$.
- $(3x + 2)^2$
~ Pri plusu bi bil srednji člen $+12x$. Negativni srednji člen pomeni kvadrat razlike.
+ $(3x - 2)^2$
- $(3x - 4)^2$
~ Zadnji člen $4$ je kvadrat drugega člena, zato je drugi člen $2$. Iz $(3x - 4)^2$ dobiš $9x^2 - 24x + 16$.
> $(3x - 2)^2 = 9x^2 - 2 \cdot 3x \cdot 2 + 4 = 9x^2 - 12x + 4$. Preveri še srednji člen, ne le prvega in zadnjega.

? Kocka iz kock sladkorja ima rob $n$ kock. Koliko kock moraš dodati, da dobiš kocko z robom $n + 1$?
- $1$
~ To bi veljalo, če bi bilo $(n + 1)^3 = n^3 + 1$. Kub vsote ima še dva srednja člena.
- $n^3 + 3n^2 + 3n + 1$
~ To je cela nova kocka $(n + 1)^3$. Vprašanje sprašuje, koliko kock dodaš k obstoječim.
+ $3n^2 + 3n + 1$
- $3n^2 + 1$
~ Dodal si tri plošče, pozabil pa tri palčke. Člen $3ab^2$ da pri $b = 1$ še $3n$.
> Dodati moraš $(n + 1)^3 - n^3 = 3n^2 + 3n + 1$: tri plošče $n \cdot n$, tri palčke dolžine $n$ in eno kocko v kotu. Pri $n = 2$ je to $12 + 6 + 1 = 19$, res $27 - 8 = 19$.

? (brez računala) Izračunaj $103 \cdot 97$ s pomočjo zmnožka vsote in razlike $(100 + 3)(100 - 3)$.
= 9991 | 0
~ 10009 | To je $100^2 + 3^2$. Pri zmnožku vsote in razlike se srednja člena uničita, kvadrata pa se odštejeta: $a^2 - b^2$.
~ 9997 | Odštel si $3$ namesto $3^2 = 9$. Drugi člen moraš kvadrirati.
> $(100 + 3)(100 - 3) = 100^2 - 3^2 = 10\,000 - 9 = 9991$.

<<RACUN
enako: (2*x^2-3*x+5)-(x^2+4*x-7) | x^2-7*x+12
vrednost: 2^2-7*2+12 | 2
enako: (3*x-2)*(2*x+5)-(x-4)*(x+4) | 5*x^2+11*x+6
enako: x^3-(x-2)^3 | 6*x^2-12*x+8
vrednost: 6*10^2-12*10+8 | 488
enako: (x+2)^3 | x^3+6*x^2+12*x+8
enako: x*(x+3)^2 | x^3+6*x^2+9*x
enako: (x+2)^3-x*(x+3)^2 | 3*x+8
vrednost: 3^3-1*4^2 | 11
enako: x*(x+2)*(x-2) | x^3-4*x
enako: 2*(x*(x+2)+x*(x-2)+(x+2)*(x-2)) | 6*x^2-8
enako: (x+1)^3-(x^3-4*x) | 3*x^2+7*x+1
vrednost: 6^3-5*7*3 | 111
vrednost: 3*5^2+7*5+1 | 111
vrednost: 98^2 | 9604
vrednost: 103*97 | 9991
>>

:::simboli
x | spremenljivka | | | v enačbi (1. točka razlage) neznanka
a, b, c, d | členi v obrazcih (števila ali izrazi) | | | v Primeru 3 je $a$ tudi rob kocke
p, q, r | členi izraza v oklepaju | | | pravilo za minus pred oklepajem
V | prostornina skorje (Primer 3) | V = x^3 - (x - 2)^3 | cm^3 | $x$ je rob kocke sira v cm
m, n | koeficienta podobnih enočlenikov | | | drugje tudi eksponenta, število členov ali rob kocke iz kock sladkorja
k | eksponent spremenljivke | | | podobni enočleniki imajo enak eksponent
:::
