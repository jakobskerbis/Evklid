---
stanje: osnutek
demo: graf
avtor: AI
---

## Zakaj se tega učimo

Šolska vremenska postaja je v jasnem poletnem dnevu izmerila temperaturo zraka:

| ura | temperatura |
|---|---|
| 8.00 | $11\,^\circ\text{C}$ |
| 12.00 | $19\,^\circ\text{C}$ |
| 16.00 | $19\,^\circ\text{C}$ |
| 20.00 | $11\,^\circ\text{C}$ |

Sošolec Jaka trdi: »Najvišja temperatura dneva je bila $19\,^\circ\text{C}$, ob 12.00 ali ob 16.00. Višje nismo izmerili.« Ima prav?

Če meritve vrišeš v koordinatni sistem, se točke prilegajo krivulji, ki se dviga, doseže vrh in se nato spet spušča. Taka krivulja je **parabola**, graf **kvadratne funkcije**. Njen vrh ali dno se imenuje **teme**. Ko ga boš znal poiskati, boš Jaki znal odgovoriti. Po paraboli poteka tudi skok delfina ali kobilice.

## Razlaga

**1. Definicija.** Kvadratna funkcija je funkcija s predpisom

$$f(x) = ax^2 + bx + c, \qquad a, b, c \in \mathbb{R},\ a \ne 0.$$

Število $a$ je **vodilni koeficient**, $b$ **linearni koeficient**, $c$ **prosti člen**. Pogoj $a \ne 0$ je nujen: pri $a = 0$ dobimo linearno funkcijo. Definicijsko območje je $\mathbb{R}$.

*Preveri:* ali je $f(x) = (x - 1)^2 - x^2$ kvadratna funkcija? (Ne: člen $x^2$ se odšteje, ostane $f(x) = -2x + 1$.)

**2. Osnovna parabola.** Najpreprostejša kvadratna funkcija je $f(x) = x^2$:

| $x$ | $x^2$ |
|---|---|
| $-3$ | $9$ |
| $-2$ | $4$ |
| $-1$ | $1$ |
| $0$ | $0$ |
| $1$ | $1$ |
| $2$ | $4$ |
| $3$ | $9$ |

Vrednosti pri $x$ in $-x$ so enake, zato je graf simetričen glede na os $y$ (taki funkciji pravimo soda). Teme je izhodišče $(0, 0)$, najnižja točka grafa.

*Preveri:* ali na grafu $y = x^2$ leži točka $(-5, 25)$ ali $(-5, -25)$? (Točka $(-5, 25)$, ker je $(-5)^2 = 25$.)

**3. Vpliv koeficienta $a$.**

- $a > 0$: parabola je odprta **navzgor**, teme je najnižja točka (minimum).
- $a < 0$: parabola je odprta **navzdol**, teme je najvišja točka (maksimum).
- $|a| > 1$: parabola je ožja od $y = x^2$; $|a| < 1$: parabola je širša.

V simulaciji spodaj (»Kvadratna funkcija v temenski obliki«) nastavi $p = 0$ in $q = 0$ (pomen $p$ in $q$ spoznaš v 4. in 5. točki), nato spremeni $a$ z $1$ na $-1$ in potem na $3$. Opazuj: pri $-1$ se parabola obrne navzdol, pri $3$ postane ožja, teme pa ostane v izhodišču.

*Preveri:* je $y = -0{,}5x^2$ ožja ali širša od $y = x^2$? (Širša, ker je $|a| = 0{,}5 < 1$; odprta je navzdol.)

**4. Tri oblike zapisa.**

| Oblika | Zapis | Kaj takoj preberemo |
|---|---|---|
| splošna | $f(x) = ax^2 + bx + c$ | presečišče z osjo $y$: $(0, c)$ |
| temenska | $f(x) = a(x - p)^2 + q$ | teme $T(p, q)$ |
| ničelna | $f(x) = a(x - x_1)(x - x_2)$ | ničli $x_1$ in $x_2$ |

V vseh treh oblikah je $a$ isto število. Ničelna oblika obstaja v realnih številih samo, če ima funkcija realne ničle.

*Preveri:* kaj takoj prebereš iz $f(x) = 3(x + 1)(x - 4)$? (Ničli $-1$ in $4$.)

**5. Teme.** Graf funkcije $f(x) = a(x - p)^2 + q$ dobimo tako, da parabolo $y = ax^2$ premaknemo za $p$ v smeri osi $x$ in za $q$ v smeri osi $y$. Teme je $T(p, q)$, **simetrijska os** je navpična premica $x = p$. Pazi na predznak: pri $(x - 2)^2$ je $p = 2$, pri $(x + 2)^2 = (x - (-2))^2$ pa $p = -2$.

Iz splošne oblike dobimo teme z obrazcema

$$p = -\frac{b}{2a}, \qquad q = f(p).$$

Drugo koordinato lahko izračunaš tudi kot $q = c - \dfrac{b^2}{4a}$, vendar je vstavljanje $p$ v predpis navadno varnejše.

Zaradi simetrije imata točki, enako oddaljeni od osi $x = p$, enako vrednost. Pri meritvah iz uvoda sta enaki vrednosti ob 12.00 in 16.00, zato je os na sredini, ob 14.00. Vrh je bil torej ob 14.00, in ker je to najvišja točka, je bilo takrat topleje kot $19\,^\circ\text{C}$. Jaka se moti; koliko je bilo, izračunaš v Primeru 3.

:::premisli
Parabolo $y = 2x^2$ premaknemo tako, da ima teme $T(-1, 4)$. Napovej brez računanja: ali nova parabola seka os $x$?
---
Ne seka. Ker je $a = 2 > 0$, je parabola odprta navzgor in teme je njena najnižja točka. Ta leži pri $y = 4$, nad osjo $x$, zato je ves graf nad osjo.
:::

*Preveri:* kje je teme $f(x) = x^2 - 4x + 1$? ($p = 2$, $q = f(2) = 4 - 8 + 1 = -3$, torej $T(2, -3)$.)

**6. Ničle.** Ničla je vrednost $x$, pri kateri je $f(x) = 0$; tam graf seka ali se dotika osi $x$. Zaenkrat ničle iščemo na dva načina:

- **iz temenske oblike**: rešimo $a(x - p)^2 + q = 0$, torej $(x - p)^2 = -\dfrac{q}{a}$, in korenimo (ne pozabi na $\pm$);
- **z razstavljanjem**, kot znaš iz 1. letnika: $x^2 - 5x + 6 = (x - 2)(x - 3)$, ničli sta $2$ in $3$.

Iz lege temena in smeri odprtosti vidiš, koliko realnih ničel je: če sta $a$ in $q$ različno predznačena, sta dve; če je $q = 0$, je ena (dvojna, teme leži na osi $x$); če sta $a$ in $q$ enako predznačena, realnih ničel ni.

:::premisli
Funkciji $f(x) = -2(x - 1)^2 + 8$ in $g(x) = 2(x - 1)^2 + 8$ imata isto teme. Napovej, kje graf $f$ seka os $x$, in pojasni, zakaj graf $g$ osi ne seka.
---
Obe imata teme $T(1, 8)$ nad osjo $x$. Parabola $f$ je odprta navzdol, njena kraka se spuščata in os $x$ presečeta dvakrat, pri $x = -1$ in $x = 3$. Parabola $g$ je odprta navzgor, teme je njena najnižja točka, zato je ves graf nad osjo.
:::

*Preveri:* kateri sta ničli $f(x) = (x - 1)^2 - 9$? (Iz $x - 1 = \pm 3$ sledi $x_1 = -2$ in $x_2 = 4$.)

**7. Lastnosti.** Za $a > 0$ funkcija pada na intervalu $(-\infty, p]$ in narašča na $[p, \infty)$, zaloga vrednosti je $[q, \infty)$. Za $a < 0$ je obratno: narašča na $(-\infty, p]$, pada na $[p, \infty)$, zaloga vrednosti je $(-\infty, q]$.

*Preveri:* kakšna je zaloga vrednosti $f(x) = -(x - 2)^2 + 9$? ($(-\infty, 9]$, ker je $a < 0$.)

## Rešeni primeri

### Primer 1 (lažji)

Dana je funkcija $f(x) = 2(x - 1)^2 - 8$. Zapiši teme, smer odprtosti, presečišče z osjo $y$, ničle in zalogo vrednosti.

**Podatki:** predpis v temenski obliki $f(x) = 2(x - 1)^2 - 8$, torej $a = 2$, $p = 1$, $q = -8$
**Iščemo:** teme $T$, smer odprtosti, presečišče z osjo $y$, ničli $x_1$, $x_2$, zalogo vrednosti $Z_f$

:::formula
Temenska oblika $f(x) = a(x - p)^2 + q$, teme $T(p, q)$; ničle iz $f(x) = 0$
:::

**Rešitev:**

1. Teme: $T(1, -8)$. Ker je $a = 2 > 0$, je parabola odprta navzgor in ožja od $y = x^2$.
2. Presečišče z osjo $y$: $f(0) = 2(0 - 1)^2 - 8 = 2 - 8 = -6$, torej točka $(0, -6)$.
3. Ničle: $2(x - 1)^2 - 8 = 0$, $(x - 1)^2 = 4$, $x - 1 = \pm 2$. Dobimo $x_1 = -1$ in $x_2 = 3$.
4. Preverjanje: $f(3) = 2 \cdot 4 - 8 = 0$ in $f(-1) = 2 \cdot 4 - 8 = 0$. Ničli sta simetrični glede na os $x = 1$.
5. Zaloga vrednosti: najmanjša vrednost je $q = -8$, zato $Z_f = [-8, \infty)$.
6. Odgovor: teme je $T(1, -8)$, parabola je odprta navzgor, os $y$ seka v $(0, -6)$, ničli sta $-1$ in $3$, zaloga vrednosti je $[-8, \infty)$.

### Primer 2 (srednji)

Funkcijo $f(x) = -x^2 + 4x + 5$ zapiši v temenski in ničelni obliki ter opiši njen graf.

**Podatki:** splošna oblika $f(x) = -x^2 + 4x + 5$, torej $a = -1$, $b = 4$, $c = 5$
**Iščemo:** temensko obliko, ničelno obliko, teme, ničle, intervala naraščanja in padanja, zalogo vrednosti

:::formula
$p = -\dfrac{b}{2a}$, $\; q = f(p)$, $\; f(x) = a(x - p)^2 + q = a(x - x_1)(x - x_2)$
:::

**Rešitev:**

1. Prva koordinata temena: $p = -\dfrac{4}{2 \cdot (-1)} = 2$.
2. Druga koordinata: $q = f(2) = -(2^2) + 4 \cdot 2 + 5 = -4 + 8 + 5 = 9$. Teme je $T(2, 9)$.
3. Temenska oblika: $f(x) = -(x - 2)^2 + 9$.
4. Ničle: $-(x - 2)^2 + 9 = 0$, $(x - 2)^2 = 9$, $x - 2 = \pm 3$, torej $x_1 = -1$, $x_2 = 5$.
5. Ničelna oblika: $f(x) = -(x + 1)(x - 5)$. Preverjanje: $-(x^2 - 4x - 5) = -x^2 + 4x + 5$.
6. Ker je $a = -1 < 0$, je parabola odprta navzdol, teme je najvišja točka. Os $y$ seka v $(0, 5)$; simetrična točka glede na os $x = 2$ je $(4, 5)$.
7. Odgovor: $f(x) = -(x - 2)^2 + 9 = -(x + 1)(x - 5)$. Funkcija narašča na $(-\infty, 2]$, pada na $[2, \infty)$, največja vrednost je $9$, zaloga vrednosti je $(-\infty, 9]$, ničli sta $-1$ in $5$.

### Primer 3 (težji): najtoplejša ura dneva

Temperaturo iz uvoda med 8.00 in 20.00 opišemo s kvadratno funkcijo $f(t)$, kjer je $t$ ura dneva in $f(t)$ temperatura v $^\circ\text{C}$. Izračunaj, kdaj in kolikšna je bila najvišja temperatura in kdaj je bilo $16\,^\circ\text{C}$.

**Podatki:** $f(8) = 11$, $f(12) = 19$, $f(16) = 19$, $f(20) = 11$ ($t$ v urah, $f(t)$ v $^\circ\text{C}$); iskana temperatura $16\,^\circ\text{C}$
**Iščemo:** teme $T(p, q)$, koeficient $a$ in čase, ko je $f(t) = 16$

:::formula
$f(t) = a(t - p)^2 + q$; enaki vrednosti $f(t_1) = f(t_2)$ ležita simetrično glede na os: $p = \dfrac{t_1 + t_2}{2}$
:::

**Rešitev:**

1. Ker je $f(12) = f(16)$, je simetrijska os na sredini: $p = \dfrac{12 + 16}{2} = 14$.
2. Torej $f(t) = a(t - 14)^2 + q$. Točka $(12, 19)$ da enačbo $4a + q = 19$, točka $(8, 11)$ pa enačbo $36a + q = 11$.
3. Drugo enačbo odštejemo od prve: $-32a = 8$, zato $a = -0{,}25$. Nato $q = 19 - 4 \cdot (-0{,}25) = 20$.
4. Model je $f(t) = -0{,}25(t - 14)^2 + 20$. Kontrola s četrto meritvijo: $f(20) = -0{,}25 \cdot 36 + 20 = 11$.
5. Temperatura $16\,^\circ\text{C}$: $-0{,}25(t - 14)^2 + 20 = 16$, torej $(t - 14)^2 = 16$ in $t - 14 = \pm 4$. Dobimo $t_1 = 10$ in $t_2 = 18$.
6. Odgovor: najtopleje je bilo ob 14.00, $20\,^\circ\text{C}$, zato Jaka nima prav; $16\,^\circ\text{C}$ je bilo ob 10.00 in ob 18.00.

### Primer 4 – zdaj ti

Parabola ima teme v točki $T(3, -2)$ in poteka skozi točko $A(1, 6)$. Zapiši predpis kvadratne funkcije v temenski, splošni in ničelni obliki.

**Podatki:** teme $T(3, -2)$, torej $p = 3$, $q = -2$; točka na grafu $A(1, 6)$, torej $f(1) = 6$
**Iščemo:** koeficient $a$ in predpis $f(x)$ v vseh treh oblikah

:::formula
$f(x) = a(x - p)^2 + q$; koordinate točke na grafu zadoščajo predpisu: $f(1) = 6$
:::

**Rešitev:**

1. Vstavimo teme: $f(x) = a(x - 3)^2 - 2$.
2. Vstavimo točko $A$: $6 = a(1 - 3)^2 - 2 = 4a - 2$, zato $4a = 8$ in $a = 2$.
3. Temenska oblika: $f(x) = 2(x - 3)^2 - 2$.
4. Splošna oblika: $2(x^2 - 6x + 9) - 2 = 2x^2 - 12x + 18 - 2 = 2x^2 - 12x + 16$.
5. Zdaj ti: iz temenske oblike poišči ničli in zapiši ničelno obliko.

:::premisli
Kateri sta ničli in kakšna je ničelna oblika?
---
Iz $2(x - 3)^2 = 2$ sledi $(x - 3)^2 = 1$ in $x - 3 = \pm 1$, torej $x_1 = 2$ in $x_2 = 4$. Ničelna oblika je $f(x) = 2(x - 2)(x - 4)$. Kontrola: $f(1) = 2 \cdot (-1) \cdot (-3) = 6$.
:::

## Pogoste napake

- **Napačen predznak v temenu.** Pri $f(x) = (x + 3)^2 - 1$ teme ni $(3, -1)$. Razlog: v temenski obliki je $x - p$, zato $x + 3 = x - (-3)$ in $p = -3$. Pravilno: $T(-3, -1)$. Preveri tako, da vstaviš $x = p$: oklepaj mora biti enak $0$.
- **Zamenjava $c$ in $q$.** Prosti člen $c$ je vrednost funkcije pri $x = 0$, ne pri temenu. Pri $f(x) = -x^2 + 4x + 5$ je $c = 5$, teme pa $(2, 9)$. Razlog za zmedo: pri $b = 0$ sta enaka. Pravilno: $q$ vedno izračunaj kot $f(p)$.
- **Pozabljen $\pm$ pri korenjenju.** Iz $(x - 1)^2 = 4$ nekateri dobijo le $x = 3$. Razlog: enačba $u^2 = 4$ ima rešitvi $u = 2$ in $u = -2$. Pravilno: $x - 1 = \pm 2$, torej $x = 3$ ali $x = -1$.
- **Napaka pri $p = -\dfrac{b}{2a}$.** Pri $f(x) = 2x^2 - 12x + 16$ je $b = -12$, zato $p = -\dfrac{-12}{4} = 3$, ne $-3$. Pravilno: $b$ vstavi z njegovim predznakom v oklepaju.
- **$-x^2$ in $(-x)^2$.** Pri $f(x) = -x^2 + 4x + 5$ je $f(-1) = -(-1)^2 - 4 + 5 = -1 - 4 + 5 = 0$, ne $1 - 4 + 5 = 2$. Razlog: najprej kvadriramo, nato upoštevamo minus pred členom.

## Povzetek

- Kvadratna funkcija: $f(x) = ax^2 + bx + c$, $a \ne 0$; graf je parabola.
- $a > 0$: odprta navzgor (minimum v temenu); $a < 0$: odprta navzdol (maksimum v temenu).
- Temenska oblika $f(x) = a(x - p)^2 + q$, teme $T(p, q)$, simetrijska os $x = p$.
- Iz splošne oblike: $p = -\dfrac{b}{2a}$, $q = f(p)$; presečišče z osjo $y$ je $(0, c)$.
- Ničelna oblika $f(x) = a(x - x_1)(x - x_2)$; ničle so rešitve enačbe $f(x) = 0$.
- Dve realni ničli, če sta $a$ in $q$ različnih predznakov; ena pri $q = 0$; nobene, če sta enakih predznakov.
- Zaloga vrednosti: $[q, \infty)$ za $a > 0$, $(-\infty, q]$ za $a < 0$.

## Drugače: Na sliki

Predstavljaj si parabolo $y = x^2$ kot črko U, narisano na prozorni foliji, ki leži na koordinatnem sistemu tako, da je njeno dno v izhodišču. Vsak parameter temenske oblike naredi s to folijo nekaj drugega:

- $q$ folijo **premakne gor ali dol**. Pri $q = 3$ se dno dvigne v točko $(0, 3)$.
- $p$ folijo **premakne levo ali desno**. Pri $(x - 2)^2$ gre dno v desno na $x = 2$, saj je oklepaj enak nič ravno pri $x = 2$.
- $a$ folijo **raztegne ali stisne** v navpični smeri. Pri $a = 2$ je vsaka točka dvakrat dlje od osi $x$, zato je krak strmejši in parabola videti ožja. Pri negativnem $a$ se U **prezrcali** čez os $x$ in postane obrnjen U.

Ničle so mesta, kjer krivulja preseka vodoravno os. Če je dno U nad osjo $x$ in je U odprt navzgor, krivulja osi nikoli ne doseže, zato realnih ničel ni. Če dno leži pod osjo, jo kraka presekata dvakrat, simetrično levo in desno od simetrijske osi. Če dno leži točno na osi, je ničla ena sama.

## Drugače: Korak za korakom s številkami

Postopek risanja grafa pokažimo na funkciji $f(x) = x^2 - 6x + 5$.

1. **Preberi koeficiente:** $a = 1$, $b = -6$, $c = 5$. Ker je $a > 0$, je parabola odprta navzgor.
2. **Teme:** $p = -\dfrac{-6}{2 \cdot 1} = 3$, $q = f(3) = 9 - 18 + 5 = -4$. Teme je $T(3, -4)$.
3. **Temenska oblika:** $f(x) = (x - 3)^2 - 4$.
4. **Ničle:** $(x - 3)^2 = 4$, $x - 3 = \pm 2$, torej $x_1 = 1$ in $x_2 = 5$. Ničelna oblika je $f(x) = (x - 1)(x - 5)$.
5. **Presečišče z osjo $y$:** $(0, 5)$. Zrcalna točka glede na os $x = 3$ je $(6, 5)$.
6. **Tabela za kontrolo:**

| $x$ | $f(x)$ |
|---|---|
| $0$ | $5$ |
| $1$ | $0$ |
| $2$ | $-3$ |
| $3$ | $-4$ |
| $4$ | $-3$ |
| $5$ | $0$ |
| $6$ | $5$ |

7. **Nariši:** označi točke, skozi njih nariši gladko krivuljo, simetrično glede na premico $x = 3$. Vrednosti v tabeli so simetrične okoli $x = 3$, kar je dobra kontrola, da si teme izračunal pravilno.

## Drugače: Bolj natančno

Temensko obliko dobimo iz splošne z **dopolnjevanjem do popolnega kvadrata**. Za $a \ne 0$ izpostavimo $a$ in prištejemo ter odštejemo kvadrat polovice koeficienta pri $x$:

$$ax^2 + bx + c = a\left(x^2 + \frac{b}{a}x\right) + c = a\left(x + \frac{b}{2a}\right)^2 - \frac{b^2}{4a} + c.$$

Od tod je $p = -\dfrac{b}{2a}$ in $q = c - \dfrac{b^2}{4a}$, kar se ujema s $q = f(p)$.

**Simetrija.** Za poljuben $d$ velja $f(p + d) = ad^2 + q = f(p - d)$. Točki, ki sta enako oddaljeni od $p$, imata torej enako vrednost; premica $x = p$ je simetrijska os.

**Ekstrem.** Ker je $(x - p)^2 \ge 0$ in je enak nič samo pri $x = p$, za $a > 0$ velja $f(x) \ge q$ z enakostjo samo v temenu, zato je $q$ najmanjša vrednost. Za $a < 0$ je $f(x) \le q$, $q$ je največja vrednost.

**Število ničel.** Iz $(x - p)^2 = -\dfrac{q}{a}$ sledi: desna stran je pozitivna natanko tedaj, ko sta $a$ in $q$ različno predznačena; takrat sta ničli $x_{1,2} = p \pm \sqrt{-\dfrac{q}{a}}$, simetrični glede na $p$. Zato je $p = \dfrac{x_1 + x_2}{2}$: prva koordinata temena je aritmetična sredina ničel.

## Preveri se

? Kje je teme parabole $f(x) = -3(x + 2)^2 + 5$?
- $T(2, 5)$
~ Predznak v oklepaju si prebral naravnost. Ker je $x + 2 = x - (-2)$, je $p = -2$.
+ $T(-2, 5)$
- $T(-2, -5)$
~ Minus pred $3$ obrne parabolo navzdol, teme pa ostane na višini $q = 5$.
- $T(5, -2)$
~ Koordinati sta zamenjani. Prva je iz oklepaja, druga je število za oklepajem.
> Ker je $x + 2 = x - (-2)$, je $p = -2$, in $q = 5$. Teme je $T(-2, 5)$.

? Katera trditev velja za $f(x) = -x^2 + 2x + 3$?
- Parabola je odprta navzgor.
~ Vodilni koeficient je $a = -1 < 0$, zato je parabola odprta navzdol.
- Teme je $T(1, 3)$.
~ $3$ je prosti člen $c$, ne $q$. Druga koordinata temena je $f(1) = 4$.
+ Največja vrednost funkcije je $4$.
- Os $y$ seka v točki $(0, -3)$.
~ Presečišče z osjo $y$ je $(0, c) = (0, 3)$; predznaka $c$ ne spreminjaj.
> $a = -1 < 0$, zato je parabola odprta navzdol. $p = -\dfrac{2}{-2} = 1$, $q = f(1) = -1 + 2 + 3 = 4$, os $y$ seka v $(0, 3)$.

? Ana je iskala ničle $f(x) = 2(x - 3)^2 - 18$ takole: $(x - 3)^2 = 9$, nato $x - 3 = 3$ in $x = 6$. Kje je napaka?
- Ničla je $x = 3$, ker je tam oklepaj enak $0$.
~ Pri $x = 3$ je $f(3) = -18$: to je teme, ne ničla.
+ Pozabila je na $\pm$: velja tudi $x - 3 = -3$, zato je druga ničla $x = 0$.
- Napake ni, kvadratna funkcija ima vedno natanko eno ničlo.
~ Ničli sta lahko dve, ena ali nobena. Tu je teme pod osjo, parabola pa odprta navzgor, zato sta dve.
> Iz $(x - 3)^2 = 9$ sledi $x - 3 = \pm 3$, torej $x_1 = 0$ in $x_2 = 6$. Kontrola: $f(0) = 2 \cdot 9 - 18 = 0$.

? Primerjaj grafa $f(x) = (x - 2)^2$ in $g(x) = x^2 - 2$. Kaj drži?
- Oba sta parabola $y = x^2$, premaknjena za $2$ v desno.
~ To velja le za $f$. Pri $g$ je $-2$ zunaj kvadrata, zato je premik za $2$ navzdol.
- $f$ je premaknjen za $2$ v levo, $g$ za $2$ navzdol.
~ Sprememba v oklepaju deluje obratno: $(x - 2)^2$ pomeni premik v desno.
+ $f$ ima teme $(2, 0)$ in eno ničlo, $g$ ima teme $(0, -2)$ in dve ničli.
> Pri $f$ je oklepaj enak $0$ pri $x = 2$, teme leži na osi $x$, ničla je ena (dvojna). Pri $g$ je teme pod osjo, parabola je odprta navzgor, ničli sta $\pm\sqrt{2}$.

? Delfin skoči iz vode. Višina njegovega trupa nad gladino je $h(x) = -0{,}5(x - 3)^2 + 2$ metrov, kjer je $x$ vodoravna razdalja v metrih. Kako dolg je skok od mesta, kjer delfin izskoči, do mesta, kjer se potopi?
- $3\,\text{m}$
~ $3$ je prva koordinata temena, kjer je delfin najvišje, ne dolžina skoka.
- $2\,\text{m}$
~ $2\,\text{m}$ je največja višina skoka ($q$), ne vodoravna razdalja.
+ $4\,\text{m}$
- $5\,\text{m}$
~ $5$ je le večja ničla. Dolžina skoka je razlika ničel.
> Iz $-0{,}5(x - 3)^2 + 2 = 0$ sledi $(x - 3)^2 = 4$, $x - 3 = \pm 2$, ničli sta $1$ in $5$. Skok je dolg $5 - 1 = 4\,\text{m}$.

:::simboli
f | kvadratna funkcija | f(x) = ax^2 + bx + c | |
x | neodvisna spremenljivka | | |
a | vodilni koeficient | | | $a \ne 0$; pri $a > 0$ je parabola odprta navzgor
b | linearni koeficient | | |
c | prosti člen | | | presečišče z osjo $y$ je $(0, c)$
p | abscisa temena | p = -\frac{b}{2a} | | simetrijska os je $x = p$
q | ordinata temena | q = f(p) | |
T | teme parabole | | |
x_1, x_2 | ničli funkcije | | |
t | ura dneva | | h
t_1, t_2 | uri z enako temperaturo | | h | $p = \frac{t_1 + t_2}{2}$
:::
