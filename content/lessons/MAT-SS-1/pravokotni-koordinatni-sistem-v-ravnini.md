---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi karirast zvezek in ravnilo. Blizu levega spodnjega kota nariši vodoravno in navpično os. Za eno enoto vzemi dva kvadratka, to je $1\,\text{cm}$. Označi točki $A(1, 1)$ in $B(5, 4)$ ter ju poveži. Preden izmeriš, ugani: kako dolga je daljica $AB$? Nato izmeri z ravnilom.

Če si risal natančno, si izmeril $5\,\text{cm}$. Zanimivo: točka $B$ je od $A$ oddaljena $4$ enote v desno in $3$ enote navzgor, razdalja pa je $5$. Te tri številke tesarji in zidarji poznajo že stoletja. Kot med letvama preverijo tako, da na eni odmerijo $3$, na drugi $4$ enote. Če je razdalja med oznakama $5$, je kot pravi.

Na načrtu hiše, terase ali omare so točke podane s koordinatami. Mojster mora iz njih izračunati dolžine, sredine in ploščine, ne da bi risal v naravni velikosti. Naučil se boš tri take izračune.

## Razlaga

Ravnino opremimo z dvema pravokotnima številskima premicama, ki se sekata v točki $O(0, 0)$, **izhodišču**. Vodoravna je **abscisna os** ($x$), navpična **ordinatna os** ($y$). Vsaka točka ima dve koordinati, $T(x, y)$: najprej povemo, koliko gremo vodoravno, nato koliko navpično. Prvi koordinati rečemo **abscisa**, drugi **ordinata**.

Osi razdelita ravnino na štiri **kvadrante**, oštevilčene v nasprotni smeri urinega kazalca: v I. sta obe koordinati pozitivni, v II. je $x < 0$ in $y > 0$, v III. sta obe negativni, v IV. je $x > 0$ in $y < 0$.

*Preveri:* v katerem kvadrantu leži $T(-2, 3)$? (V II.: levo od osi $y$, nad osjo $x$.)

**Razdalja ob osi.** Točki $A(-3, 2)$ in $B(4, 2)$ imata enako drugo koordinato, zato ležita na isti vodoravnici. Razdaljo preberemo kot na številski premici: od $-3$ do $4$ je $7$ enot. V splošnem je to $|x_B - x_A|$. Absolutna vrednost poskrbi, da je razdalja pozitivna ne glede na to, katero točko vzameš prvo.

*Preveri:* kako daleč sta $C(1, -5)$ in $D(1, 3)$? (Na isti navpičnici sta, razdalja je $|3 - (-5)| = 8$.)

**Razdalja v splošnem.** Pri $A(1, 1)$ in $B(5, 4)$ iz uvoda nariši pot iz $A$ najprej vodoravno do $(5, 1)$, nato navpično do $B$. Nastane pravokotni trikotnik:

```
            B(5,4)
           /|
       d  / |  3   (navpično: 4 − 1)
         /  |
   A(1,1)───┘ (5,1)
         4         (vodoravno: 5 − 1)
```

Kateti merita $|x_B - x_A| = 4$ in $|y_B - y_A| = 3$. Iskana razdalja $d$ je hipotenuza. Po Pitagorovem izreku je $d^2 = 4^2 + 3^2 = 25$, torej $d = 5$. Splošno velja

$$d(A, B) = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$$

:::premisli
Sošolec je računal $(x_A - x_B)$ in $(y_A - y_B)$, torej v obratnem vrstnem redu. Ali dobi drugačno razdaljo? Zakaj?
---
Ne. Razliki imata le nasprotna predznaka, na primer $1 - 5 = -4$ namesto $5 - 1 = 4$. Ker ju kvadriramo, je $(-4)^2 = 4^2 = 16$. Razdalja od $A$ do $B$ je enaka razdalji od $B$ do $A$.
:::

**Razpolovišče daljice.** Na številski premici je sredina med $2$ in $8$ število $5$, aritmetična sredina $\dfrac{2 + 8}{2}$. V ravnini naredimo isto za vsako koordinato posebej. Razpolovišče $S_{AB}$ daljice $AB$ je

$$S_{AB}\left(\frac{x_A + x_B}{2},\ \frac{y_A + y_B}{2}\right)$$

*Preveri:* kje je razpolovišče daljice z $A(2, 7)$ in $B(8, -1)$? (V točki $(5, 3)$, ker je $\dfrac{2 + 8}{2} = 5$ in $\dfrac{7 + (-1)}{2} = 3$.)

**Ploščina trikotnika.** Vzemi trikotnik z oglišči $A(1, 1)$, $B(6, 2)$ in $C(3, 5)$. Okrog njega nariši najmanjši pravokotnik s stranicami, vzporednimi osema. Sega od $x = 1$ do $x = 6$ in od $y = 1$ do $y = 5$, zato ima ploščino $5 \cdot 4 = 20$. Iz pravokotnika odrežemo tri pravokotne trikotnike ob robu. Pravi kot ima vsak v enem od oglišč pravokotnika, $(6, 1)$, $(6, 5)$ ali $(1, 5)$:

| odrezani trikotnik | kateti | ploščina |
|---|---|---|
| pod $AB$ | $5$ in $1$ | $2{,}5$ |
| desno od $BC$ | $3$ in $3$ | $4{,}5$ |
| levo od $CA$ | $2$ in $4$ | $4$ |

Ostane $20 - 2{,}5 - 4{,}5 - 4 = 9$. Ploščina trikotnika $ABC$ je $9$ kvadratnih enot.

Hitreje gre s formulo. Iz oglišča $A$ zapišemo premik do $B$ in premik do $C$. Premik pove, koliko gremo vodoravno in koliko navpično:

$$u_1 = x_B - x_A, \quad u_2 = y_B - y_A$$

$$v_1 = x_C - x_A, \quad v_2 = y_C - y_A$$

Ploščina trikotnika je potem

$$S = \frac{1}{2}\,\left|u_1 v_2 - u_2 v_1\right|$$

Za naš trikotnik je $u_1 = 5$, $u_2 = 1$, $v_1 = 2$, $v_2 = 4$, zato je $S = \dfrac{1}{2} \cdot |5 \cdot 4 - 1 \cdot 2| = \dfrac{1}{2} \cdot 18 = 9$. Isto kot z odrezovanjem.

:::premisli
Kaj se zgodi, če točko $C$ premikaš, dokler ne leži na premici skozi $A$ in $B$? Napovej, koliko pokaže formula.
---
Ploščina pade na $0$. Trikotnik se splošči v daljico. Formula da $0$ natanko tedaj, ko točke $A$, $B$, $C$ ležijo na isti premici (so **kolinearne**). Tako s formulo preverimo, ali so tri točke na premici.
:::

Napoved preizkusi v simulaciji »Razdalja, razpolovišče in ploščina trikotnika« spodaj: izberi »Ploščina trikotnika« in vleci točko $C$, dokler ploščina ne postane $0$. Kje je takrat $C$ glede na daljico $AB$?

## Rešeni primeri

### Primer 1: razdalja med stebroma

Na načrtu pergole je ena enota $1\,\text{m}$. Steber stoji v točki $A(-2, 1)$, drugi v točki $B(4, 9)$. Kako daleč sta stebra narazen?

**Podatki:** $A(-2, 1)$, $B(4, 9)$, $1$ enota $= 1\,\text{m}$
**Iščemo:** razdaljo $d(A, B)$ v metrih

:::formula
$d(A, B) = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$
:::

**Rešitev:**

1. Vodoravna razlika: $x_B - x_A = 4 - (-2) = 6$. Pazi na odštevanje negativnega števila.
2. Navpična razlika: $y_B - y_A = 9 - 1 = 8$.
3. Vstavimo v formulo:

$$d = \sqrt{36 + 64} = \sqrt{100} = 10$$

4. Odgovor: stebra sta $10\,\text{m}$ narazen.

### Primer 2: kam gre podpora

Tesar mora tram podpreti točno na sredini. Na načrtu, kjer je ena enota $1\,\text{dm}$, sta krajišči trama $A(-4, 3)$ in $B(6, -1)$. Kje je podpora in kako dolg je tram? Preveri, ali je podpora res enako daleč od obeh krajišč.

**Podatki:** $A(-4, 3)$, $B(6, -1)$, $1$ enota $= 1\,\text{dm}$
**Iščemo:** razpolovišče $S_{AB}$, dolžino $d(A, B)$ in razdalji $d(A, S_{AB})$, $d(S_{AB}, B)$

:::formula
$S_{AB}\left(\dfrac{x_A + x_B}{2}, \dfrac{y_A + y_B}{2}\right)$ in $d(A, B) = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$
:::

**Rešitev:**

1. Prva koordinata razpolovišča: $\dfrac{-4 + 6}{2} = \dfrac{2}{2} = 1$.
2. Druga koordinata: $\dfrac{3 + (-1)}{2} = \dfrac{2}{2} = 1$. Podpora je v točki $S_{AB}(1, 1)$.
3. Dolžina trama: razliki sta $6 - (-4) = 10$ in $-1 - 3 = -4$, zato

$$d(A, B) = \sqrt{100 + 16} = \sqrt{116} \approx 10{,}77$$

4. Preverimo sredino. Od $A$ do $S_{AB}$ sta razliki $5$ in $-2$, od $S_{AB}$ do $B$ pa $5$ in $-2$. Obe razdalji sta

$$d = \sqrt{25 + 4} = \sqrt{29} \approx 5{,}39$$

kar je polovica od $10{,}77$.
5. Odgovor: podpora je v točki $S_{AB}(1, 1)$, tram je dolg približno $10{,}8\,\text{dm}$, podpora pa je od vsakega krajišča oddaljena približno $5{,}4\,\text{dm}$.

### Primer 3: lazura za trikotno teraso

Lesena terasa ima obliko trikotnika. Na načrtu, kjer je ena enota $1\,\text{m}$, so oglišča $A(-2, -1)$, $B(4, 1)$ in $C(1, 5)$. En liter lazure zadošča za $6\,\text{m}^2$. Koliko litrov lazure potrebuješ za en premaz?

**Podatki:** $A(-2, -1)$, $B(4, 1)$, $C(1, 5)$, $1$ enota $= 1\,\text{m}$, poraba $1\,\text{L}$ na $6\,\text{m}^2$
**Iščemo:** ploščino $S$ terase in količino lazure $V$

:::formula
$S = \dfrac{1}{2}\,\left|u_1 v_2 - u_2 v_1\right|$, kjer sta $(u_1, u_2)$ premik od $A$ do $B$ in $(v_1, v_2)$ premik od $A$ do $C$; nato $V = \dfrac{S}{6\,\text{m}^2} \cdot 1\,\text{L}$
:::

**Rešitev:**

1. Premik od $A$ do $B$: $u_1 = 4 - (-2) = 6$, $u_2 = 1 - (-1) = 2$.
2. Premik od $A$ do $C$: $v_1 = 1 - (-2) = 3$, $v_2 = 5 - (-1) = 6$.
3. Vstavimo:

$$S = \frac{1}{2} \cdot |6 \cdot 6 - 2 \cdot 3| = \frac{1}{2} \cdot 30 = 15$$

Terasa meri $15\,\text{m}^2$.
4. Preverimo z odrezovanjem. Pravokotnik okrog terase meri $6 \cdot 6 = 36$, odrezani trikotniki pa $6$, $6$ in $9$. Ostane $36 - 6 - 6 - 9 = 15$, kar se ujema.
5. Lazura: vsak liter pokrije $6\,\text{m}^2$, zato potrebujemo $\dfrac{15}{6} = 2{,}5$ litra.
6. Odgovor: terasa ima ploščino $15\,\text{m}^2$, za en premaz potrebuješ $2{,}5\,\text{L}$ lazure.

### Primer 4: zdaj ti

Mizar je na načrtu označil eno krajišče letve v $A(-1, 2)$ in njeno sredino, kjer bo vijak, v $S_{AB}(3, 0)$. Drugo krajišče se je zbrisalo. Kje je točka $B$?

**Podatki:** $A(-1, 2)$, razpolovišče $S_{AB}(3, 0)$
**Iščemo:** krajišče $B(x_B, y_B)$

:::formula
$x_{S} = \dfrac{x_A + x_B}{2}$, zato $x_B = 2 x_{S} - x_A$; enako za $y$.
:::

**Rešitev:**

1. Znane vrednosti vstavimo v formulo za prvo koordinato razpolovišča: $3 = \dfrac{-1 + x_B}{2}$. Iz te enačbe izrazimo $x_B$.
2. Pomnožimo z $2$: $-1 + x_B = 6$, torej $x_B = 7$.
3. Na enak način izračunaj še $y_B$ iz enačbe $0 = \dfrac{2 + y_B}{2}$ in zapiši točko $B$.

:::premisli
Koliko je $y_B$? Preveri še, ali je razpolovišče novih krajišč res $(3, 0)$.
---
Iz $2 + y_B = 0$ dobimo $y_B = -2$, torej $B(7, -2)$. Preizkus: $\dfrac{-1 + 7}{2} = 3$ in $\dfrac{2 + (-2)}{2} = 0$. Drži.
:::

## Pogoste napake

Večina napak ni v formulah, ampak v predznakih in vrstnem redu.

- **Minus pred negativno koordinato.** Pri $A(-2, 1)$ in $B(4, 9)$ nekdo računa $4 - 2 = 2$. Pravilno je $4 - (-2) = 6$. Negativno koordinato vedno zapiši v oklepaj.
- **Razdalja kot vsota katet.** Kdor sešteje $|x_B - x_A| + |y_B - y_A|$, dobi pot »po kvadratkih«, ne zračne razdalje. Pri razlikah $4$ in $3$ bi dobil $7$ namesto $5$. Kateti sta pravokotni, zato velja Pitagorov izrek.
- **Razpolovišče kot polovica razlike.** $\dfrac{x_B - x_A}{2}$ je polovica dolžine v smeri $x$, ne koordinata sredine. Sredina je povprečje: krajišči **seštej** in deli z $2$.
- **Ploščina brez polovice ali z negativnim predznakom.** Izraz $u_1 v_2 - u_2 v_1$ je ploščina paralelograma s predznakom, zato je lahko negativen. Ploščina trikotnika je **polovica** njegove **absolutne vrednosti**.
- **Zamenjane koordinate.** $T(3, -2)$ pomeni najprej $3$ v smeri $x$, nato $-2$ v smeri $y$. Točka $(-2, 3)$ je povsem druga točka.

## Povzetek

- Točka v ravnini je $T(x, y)$: najprej abscisa, nato ordinata. Osi razdelita ravnino na štiri kvadrante.
- Razdalja: $d(A, B) = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$; to je Pitagorov izrek za kateti $|x_B - x_A|$ in $|y_B - y_A|$. Vrstni red točk ni pomemben.
- Razpolovišče: $S_{AB}\left(\dfrac{x_A + x_B}{2}, \dfrac{y_A + y_B}{2}\right)$, povprečje koordinat krajišč. Iz $A$ in $S_{AB}$ dobiš $B$ z $x_B = 2x_S - x_A$, $y_B = 2y_S - y_A$.
- Ploščina trikotnika: $u_1, u_2$ in $v_1, v_2$ sta premika od $A$ do $B$ in do $C$; $S = \frac{1}{2}|u_1 v_2 - u_2 v_1|$. Preizkus: očrtan pravokotnik minus trije robni trikotniki.
- Ploščina $0$ pomeni, da so točke kolinearne.
- Negativne koordinate piši v oklepaje.

## Drugače: Na sliki

Nariši na karirast papir točki $A$ in $B$ in iz $A$ pojdi po črtah zvezka: najprej vodoravno, nato navpično do $B$. Prešteti kvadratki dajo kateti, poševna črta $AB$ pa je hipotenuza. Razdalja je vedno krajša od poti po kvadratkih, razen če ležita točki na isti vodoravnici ali navpičnici.

Za razpolovišče si predstavljaj, da daljico $AB$ osvetliš od zgoraj. Njena senca na osi $x$ sega od $x_A$ do $x_B$, sredina sence pa je točno pod sredino daljice. Enako velja za senco na osi $y$. Zato sredino iščemo za vsako os posebej.

Pri ploščini si nariši pravokotnik okrog trikotnika, kot da bi trikotno ploščo izrezal iz pravokotne deske. Odpadki so trije pravokotni trikotniki ob robovih. Ploščina plošče je ploščina deske minus odpadki.

## Drugače: Bolj natančno

Formula za razdaljo je Pitagorov izrek, zapisan s koordinatami. Ker kvadriramo, predznak razlike ni pomemben, in zato $(x_B - x_A)^2 = |x_B - x_A|^2$. Poseben primer je razdalja točke $T(x, y)$ od izhodišča, $\sqrt{x^2 + y^2}$.

Da je $S_{AB}$ res sredina, dokažemo s premiki. Premik od $A$ do $S_{AB}$ je $\left(\dfrac{x_B - x_A}{2}, \dfrac{y_B - y_A}{2}\right)$, enak kot premik od $S_{AB}$ do $B$. Oba sta natanko polovica premika od $A$ do $B$, zato točka $S_{AB}$ leži na daljici in je od obeh krajišč enako oddaljena.

Pri ploščini je izraz $u_1 v_2 - u_2 v_1$ ploščina paralelograma, ki ga napenjata premika od $A$ do $B$ in od $A$ do $C$, opremljena s predznakom. Trikotnik je polovica tega paralelograma. Predznak pove smer obhoda: če si oglišča $A$, $B$, $C$ sledijo v nasprotni smeri urinega kazalca, je izraz pozitiven, v smeri urinega kazalca pa negativen. Zato vzamemo absolutno vrednost. Formula deluje ne glede na to, katero oglišče vzameš za izhodišče premikov.

## Preveri se

? Daljica ima krajišči $A(-2, 3)$ in $B(4, 3)$. Kateri opis slike ji ustreza?
- Navpična daljica dolžine $6$.
~ Enaki sta drugi koordinati, ne prvi. Točki sta na isti višini, zato je daljica vodoravna.
+ Vodoravna daljica dolžine $6$, nad osjo $x$.
- Vodoravna daljica dolžine $2$, nad osjo $x$.
~ To je $4 + (-2)$. Dolžina je razlika: $4 - (-2) = 6$.
- Vodoravna daljica dolžine $6$, pod osjo $x$.
~ Druga koordinata je $3 > 0$, zato je daljica nad osjo $x$.
> Obe točki imata $y = 3$, zato ležita na vodoravnici nad osjo $x$. Dolžina je $|4 - (-2)| = 6$.

? Oceni brez računala razdaljo med $O(0, 0)$ in $T(7, 7)$. Kateri približek je najboljši?
- $7$
~ To je samo ena kateta. Hipotenuza je daljša od vsake katete.
+ $10$
- $14$
~ To je vsota katet, pot po kvadratkih. Poševna pot je krajša.
- $49$
~ To je $7^2$, kvadrat ene razlike. Manjkata drugi kvadrat in koren.
> $d = \sqrt{49 + 49} = \sqrt{98} \approx 9{,}9$, kar je skoraj $10$. Ker je $\sqrt{100} = 10$, je razdalja malo manj kot $10$.

? Zakaj pri formuli za razdaljo ni pomembno, katero točko vzameš za prvo?
- Ker negativne koordinate pri razdalji ne štejejo.
~ Negativne koordinate štejejo: $4 - (-2) = 6$, ne $2$. Ignorirati jih je pogosta napaka.
+ Ker razliki kvadriramo, kvadrat pa je pri nasprotnih številih enak.
- Ker vedno odštejemo manjšo koordinato od večje.
~ Formula tega ne zahteva. Lahko dobiš negativno razliko, a jo kvadriranje naredi pozitivno.
> $(x_A - x_B)^2 = (x_B - x_A)^2$, ker se razlikujeta le v predznaku. Zato je $d(A, B) = d(B, A)$.

? Razpolovišče daljice $AB$ je $S_{AB}(1, -2)$, krajišče pa $A(-3, 4)$. Kje je krajišče $B$?
- $B(-1, 1)$
~ To je razpolovišče daljice $AS_{AB}$. Točka $S_{AB}$ je sredina, $B$ je še enkrat toliko naprej.
+ $B(5, -8)$
- $B(4, -6)$
~ To je le premik od $A$ do $S_{AB}$. Prišteti ga moraš točki $S_{AB}$, ne vzeti kot točko.
- $B(-1, 0)$
~ Računal si $2x_S + x_A$ in $2y_S + y_A$. Iz $x_A + x_B = 2x_S$ sledi $x_B = 2x_S - x_A$: točko $A$ odšteješ.
> $x_B = 2 \cdot 1 - (-3) = 5$ in $y_B = 2 \cdot (-2) - 4 = -8$. Preizkus: $\dfrac{-3 + 5}{2} = 1$ in $\dfrac{4 + (-8)}{2} = -2$.

? Mizar je zabil tri žeblje v točke $A(-1, -1)$, $B(1, 2)$ in $C(5, 8)$. Ali lahko napne ravno vrvico, ki gre skozi vse tri?
- Ne, ker je ploščina trikotnika $ABC$ enaka $9$.
~ To dobiš, če izračunaš samo $\frac{1}{2} u_1 v_2 = \frac{1}{2} \cdot 2 \cdot 9$ in pozabiš odšteti $u_2 v_1 = 3 \cdot 6$.
- Ne, ker sta razdalji $AB$ in $BC$ različni.
~ Točke na premici so lahko poljubno razmaknjene. Različne razdalje ne pomenijo, da niso na premici.
+ Da, ker je ploščina trikotnika $ABC$ enaka $0$.
- Da, ker so vse tri točke v I. kvadrantu.
~ Točka $A(-1, -1)$ je v III. kvadrantu. Kvadrant tudi sicer ne pove, ali so točke na premici.
> $u_1 = 2$, $u_2 = 3$, $v_1 = 6$, $v_2 = 9$; $S = \frac{1}{2}|2 \cdot 9 - 3 \cdot 6| = 0$. Točke so kolinearne, vrvica gre skozi vse tri.

:::simboli
A, B, C | točke (oglišča, krajišča) | | | 
T | poljubna točka | | | 
O | izhodišče | | | $O(0, 0)$
x, y | koordinati točke (abscisa, ordinata) | | | 
x_A, y_A | koordinati točke $A$ | | | 
x_B, y_B | koordinati točke $B$ | | | 
x_C, y_C | koordinati točke $C$ | | | 
d | razdalja med točkama | d(A, B) = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2} | | 
S_{AB} | razpolovišče daljice $AB$ | | | koordinate so povprečja koordinat krajišč
x_S | prva koordinata razpolovišča | x_S = \frac{x_A + x_B}{2} | | 
y_S | druga koordinata razpolovišča | y_S = \frac{y_A + y_B}{2} | | 
u_1, u_2 | premik od $A$ do $B$ | u_1 = x_B - x_A | | $u_2 = y_B - y_A$
v_1, v_2 | premik od $A$ do $C$ | v_1 = x_C - x_A | | $v_2 = y_C - y_A$
S | ploščina trikotnika | S = \frac{1}{2}\left\lvert u_1 v_2 - u_2 v_1 \right\rvert | | kvadratne enote; $0$ pri kolinearnih točkah
V | količina lazure | V = \frac{S}{6\,\text{m}^2} \cdot 1\,\text{L} | L | 
:::
