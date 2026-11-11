---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Linearne enačbe že znaš reševati: iz $2x + 3 = 11$ dobiš $x = 4$. Pri enačbi je rešitev ena sama številka. V življenju pa pogosto ne iščemo točno določene vrednosti, ampak **vse vrednosti, ki ustrezajo pogoju**. Na primer: »Koliko zvezkov lahko kupim s 10 evri, če stane en zvezek $1{,}50\,€$?« Odgovor ni ena številka, ampak vse številke do neke meje.

Neenačbe uporabljamo pri proračunu, pri omejitvah (največja nosilnost, najmanjša ocena za pozitivno), pri primerjavi cenikov. Pri reševanju uporabljamo podobne postopke kot pri enačbah, le da moramo paziti na eno pomembno pravilo, ki ga boš spoznal spodaj.

## Razlaga

**1. Kaj je neenačba.** Neenačba je zapis, v katerem sta dva izraza povezana z enim od znakov:

- $<$ (manjše), $>$ (večje),
- $\le$ (manjše ali enako), $\ge$ (večje ali enako).

Linearna neenačba z eno neznanko je na primer $2x + 3 < 11$.

**2. Rešitev neenačbe.** Rešitev je vsako število, ki ob vstavitvi v neenačbo da resničen izrek. Pri $x < 4$ so rešitve $3$; $0$; $-5$; $3{,}9$ … in jih je neskončno mnogo. Število $4$ ni rešitev, ker $4 < 4$ ne drži.

**3. Ekvivalentne preoblikovanja.** Rešitve se ne spremenijo, če:

- na obeh straneh **prištejemo ali odštejemo** isto število ali izraz,
- obe strani **pomnožimo ali delimo z istim pozitivnim številom**.

**4. Ključno pravilo.** Če obe strani pomnožimo ali delimo z **negativnim številom**, se **znak neenačbe obrne**:

$$-2x < 6 \quad\Rightarrow\quad x > -3$$

Zakaj? Vzemi pravilno neenakost $2 < 5$. Če jo pomnožimo z $-1$, dobimo $-2$ in $-5$. Na številski premici je $-2$ desno od $-5$, torej $-2 > -5$. Vrstni red se je zamenjal, zato se zamenja tudi znak.

**5. Zapis rešitve na številski premici.**

- Ob **strogi** neenakosti ($<$, $>$) je krajišče **prazen krogec** $\circ$ (število ni rešitev).
- Ob **nestrogi** neenakosti ($\le$, $\ge$) je krajišče **poln krogec** $\bullet$ (število je rešitev).
- Obarvamo del premice, kjer ležijo rešitve: pri $x > a$ proti desni, pri $x < a$ proti levi.

**6. Zapis z intervalom.**

| Neenačba | Interval | Krogec |
|---|---|---|
| $x > 2$ | $(2, \infty)$ | prazen |
| $x \ge 2$ | $[2, \infty)$ | poln |
| $x < 2$ | $(-\infty, 2)$ | prazen |
| $x \le 2$ | $(-\infty, 2]$ | poln |

Okrogli oklepaj pomeni, da krajišče ni vključeno, oglati, da je. Pri $\infty$ je vedno okrogli oklepaj.

**7. Postopek reševanja.**

1. Odpravi oklepaje in ulomke.
2. Člene z neznanko zbereš na eno stran, ostale na drugo.
3. Delimo s koeficientom pred $x$. Če je negativen, obrni znak.
4. Zapiši rešitev kot neenačbo, na premici in z intervalom.

## Rešeni primeri

### Primer 1 (lažji)

Reši neenačbo $x + 5 > 9$.

1. Odštejemo $5$ na obeh straneh, da ostane $x$ sam: $x + 5 - 5 > 9 - 5$.
2. Dobimo $x > 4$.
3. **Na premici:** prazen krogec pri $4$, obarvano na desno.
4. **Interval:** $(4, \infty)$.
5. Preizkus: $x = 5$ da $5 + 5 = 10 > 9$ drži. Pri $x = 4$ dobimo $9 > 9$, kar ne drži, zato je krogec prazen.

### Primer 2

Reši neenačbo $3x - 7 \le 8$.

1. Prištejemo $7$: $3x \le 15$. (Zakaj? Da se znebimo $-7$ ob členu z $x$.)
2. Delimo s $3$. Ker je $3$ pozitivno, se znak ne obrne: $x \le 5$.
3. **Na premici:** poln krogec pri $5$, obarvano na levo.
4. **Interval:** $(-\infty, 5]$.
5. Preizkus: $x = 5$ da $3 \cdot 5 - 7 = 8 \le 8$, drži. Pri $x = 0$ dobimo $-7 \le 8$, drži. Pri $x = 6$ dobimo $11 \le 8$, ne drži.

### Primer 3 (težji)

Reši neenačbo $5 - 2x < 3x + 15$.

1. Zberemo člene z $x$ na desno (da bo koeficient pozitiven): odštejemo $5$ in prištejemo $2x$ na obeh straneh:
   $5 - 2x + 2x - 5 < 3x + 15 + 2x - 5$, torej $0 < 5x + 10$.
2. Odštejemo $10$: $-10 < 5x$.
3. Delimo s $5$ (pozitivno, znak ostane): $-2 < x$, kar zapišemo kot $x > -2$.
4. **Na premici:** prazen krogec pri $-2$, obarvano na desno.
5. **Interval:** $(-2, \infty)$.
6. Preizkus: $x = 0$ da $5 < 15$, drži. Pri $x = -3$ dobimo levo $5 + 6 = 11$ in desno $-9 + 15 = 6$, $11 < 6$ ne drži. Pri $x = -2$ je levo $9$, desno $9$, $9 < 9$ ne drži, zato je krogec prazen.

*Namig:* isto neenačbo bi lahko rešil tudi tako, da $x$ zbereš na levo. Dobiš $-5x < 10$ in pri deljenju z $-5$ obrneš znak: $x > -2$. Rezultat je enak.

## Pogoste napake

- **Pozabljen obrat znaka** pri deljenju ali množenju z negativnim številom. Iz $-3x > 12$ je pravilno $x < -4$, ne $x > -4$.
- **Obrat znaka pri odštevanju.** Znak se obrne samo pri množenju ali deljenju z negativnim številom, ne pri prištevanju ali odštevanju.
- **Napačen krogec.** Pri $<$ in $>$ je krogec prazen, pri $\le$ in $\ge$ poln.
- **Napačna smer obarvanja.** Pri $x > a$ so rešitve desno od $a$, pri $x < a$ levo. Preveri z enim številom.
- **Neenačba brez preizkusa.** Vedno vstavi eno število iz rešitve in eno zunaj nje.
- **Zamenjava strani brez obrata.** Če zapišeš $-2 < x$ kot $x < -2$, si naredil napako. Pravilno je $x > -2$.

## Povzetek

- Neenačba ima običajno neskončno mnogo rešitev.
- Prištevanje in odštevanje ne spremenita smeri znaka.
- Množenje ali deljenje z **negativnim** številom **obrne** znak.
- Strogi znaki ($<$, $>$): prazen krogec in okrogli oklepaj. Nestrogi ($\le$, $\ge$): poln krogec in oglati oklepaj.
- Rešitev zapišemo kot neenačbo, na številski premici in z intervalom.
- Rešitev vedno preizkusimo z vstavitvijo.

## Drugače: Na sliki

Predstavljaj si številsko premico kot cesto. Pri $x > 4$ stojiš pri številki $4$ in rečeš: »Rešitve so vsa mesta desno od mene.« Če krogec ni poln, sam ne spadaš zraven. Če je poln ($x \ge 4$), spadaš zraven.

Zdaj pomisli na obrat znaka. Na premici imamo $2$ in $5$, pri čemer je $2$ levo od $5$. Če vsako število zrcalimo čez ničlo (pomnožimo z $-1$), pridemo na $-2$ in $-5$. Zrcaljenje zamenja levo in desno, zato je zdaj $-5$ levo od $-2$. Prvotni vrstni red se je obrnil, zato se mora obrniti tudi znak neenačbe.

## Drugače: Iz vsakdanjega življenja

Imaš $10\,€$ in kupuješ zvezke po $1{,}50\,€$. Koliko zvezkov lahko kupiš?

Zapišemo: $1{,}5x \le 10$. Delimo z $1{,}5$: $x \le 6{,}\overline{6}$. Ker zvezke štejemo v celih številih, lahko kupiš $0, 1, 2, \ldots, 6$ zvezkov. Sedem zvezkov bi stalo $10{,}50\,€$, kar presega tvoj denar.

Drug primer: za pozitivno oceno potrebuješ vsaj $50$ točk od $100$. Če si v prvem delu dobil $28$ točk, koliko jih moraš v drugem? Velja $28 + x \ge 50$, torej $x \ge 22$.

Opazi, da rešitev včasih omejimo še z zahtevo iz življenja (cela števila, nenegativnost).

## Drugače: Korak za korakom s številkami

Reši $-4x + 6 \ge 18$.

| Korak | Zapis | Kaj smo naredili |
|---|---|---|
| 1 | $-4x + 6 \ge 18$ | začetna neenačba |
| 2 | $-4x \ge 12$ | odštejemo $6$ |
| 3 | $x \le -3$ | delimo z $-4$, znak se obrne |
| 4 | $x \in (-\infty, -3]$ | zapis z intervalom |

Preizkus s tremi števili:

| $x$ | $-4x + 6$ | $\ge 18$? |
|---|---|---|
| $-5$ | $26$ | da |
| $-3$ | $18$ | da |
| $0$ | $6$ | ne |

Števili $-5$ in $-3$ sta v rešitvi $x \le -3$, število $0$ pa ne. Vse se ujema.

## Drugače: Bolj natančno

Zakaj se pri množenju z negativnim številom znak obrne? Neenakost $a < b$ pomeni, da je $b - a > 0$ (razlika je pozitivna). Naj bo $c < 0$. Potem je

$$bc - ac = (b - a)\cdot c.$$

Produkt pozitivnega števila $(b-a)$ in negativnega števila $c$ je negativen, torej $bc - ac < 0$, to je $bc < ac$. Iz $a < b$ torej sledi $ac > bc$. Znak se je obrnil.

Pri prištevanju je drugače: $(b + c) - (a + c) = b - a > 0$, zato ostane $a + c < b + c$.

Množico rešitev $x > a$ v zapisu množic pišemo $\{x \in \mathbb{R} \mid x > a\}$, kar preberemo »množica vseh realnih števil $x$, za katera velja $x > a$«.

## Preveri se

? Katera je rešitev neenačbe $-3x < 12$?
- $x < -4$
+ $x > -4$
- $x > 4$
- $x < 4$
> Delimo z $-3$ in ker je to negativno število, obrnemo znak: $x > -4$. Odgovor $x < -4$ pozabi obrat znaka.

? Kako zapišemo rešitev neenačbe $2x - 1 \le 7$ z intervalom?
- $(-\infty, 4)$
- $[4, \infty)$
+ $(-\infty, 4]$
> Iz $2x \le 8$ sledi $x \le 4$. Rešitve ležijo levo od $4$, število $4$ je vključeno, zato oglati oklepaj ob $4$.

? Pri katerem zapisu rešitve je na številski premici ob številu $3$ prazen krogec, obarvano pa je na desno?
- $x \ge 3$
- $x < 3$
+ $x > 3$
> Prazen krogec pomeni strogo neenakost, obarvanje na desno pa pomeni večje vrednosti. Zato je rešitev $x > 3$.

:::simboli
x | neznanka | | |
a, b | števili z a < b | | | a je tudi meja rešitev pri x > a
c | negativno število, s katerim množimo | | | c < 0 obrne znak neenakosti
:::
