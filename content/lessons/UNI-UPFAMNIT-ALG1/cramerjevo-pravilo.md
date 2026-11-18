---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Dve skupini obiščeta planetarij. Prva kupi $3$ študentske in $2$ navadni vstopnici ter plača $27$ €. Druga kupi $1$ študentsko in $4$ navadne vstopnice ter plača $34$ €. Koliko stane posamezna vstopnica?

To je sistem dveh linearnih enačb. Z Gaussovo eliminacijo bi ga rešil v nekaj vrsticah. A kaj, če bi blagajnik vsak dan dobil nove zneske in bi rad formulo, v katero samo vstavi številke? Taka formula obstaja. Rešitev zapiše kot **količnik dveh determinant**: študentska vstopnica stane $\dfrac{40}{10} = 4$ €, navadna $\dfrac{75}{10} = 7{,}5$ €. Od kod $40$, $75$ in $10$, pove **Cramerjevo pravilo**.

Pravilo je uporabno takrat, ko je sistem majhen, ko vsebuje parametre ali ko potrebuješ le eno neznanko. Je tudi most med tremi stvarmi, ki jih že poznaš: sistemi, determinante in inverzna matrika.

## Razlaga

**1. Staro in novo drug ob drugem.** Sistem $n$ enačb z $n$ neznankami zapišemo matrično kot $A\vec{x} = \vec{b}$. Tu je $A$ kvadratna matrika koeficientov, $\vec{x}$ stolpec neznank in $\vec{b}$ stolpec desnih strani. Do zdaj poznaš dve poti do rešitve.

| | Gaussova eliminacija | inverzna matrika | Cramerjevo pravilo |
|---|---|---|---|
| kaj dobiš | števila, po korakih | $\vec{x} = A^{-1}\vec{b}$ | vsak $x_i$ posebej, s formulo |
| za katere $A$ | poljubne, tudi nekvadratne | kvadratne, $\det A \neq 0$ | kvadratne, $\det A \neq 0$ |
| ko je $\det A = 0$ | pove, ali rešitev ni ali jih je neskončno | ne deluje | ne pove ničesar |

Cramerjevo pravilo je torej sorodnik inverzne matrike: enak pogoj, a brez računanja celotne $A^{-1}$.

**2. Kaj se zgodi pri eliminaciji.** Vzemimo splošen sistem $2 \times 2$:

$$a_{11}x_1 + a_{12}x_2 = b_1, \qquad a_{21}x_1 + a_{22}x_2 = b_2.$$

Prvo enačbo pomnožimo z $a_{22}$, drugo z $a_{12}$ in ju odštejemo. Neznanka $x_2$ izgine:

$$(a_{11}a_{22} - a_{12}a_{21})\,x_1 = b_1 a_{22} - a_{12} b_2.$$

Na levi stoji $\det A$. Na desni stoji determinanta matrike, ki jo dobiš iz $A$, ko **prvi stolpec zamenjaš s stolpcem $\vec{b}$**:

$$b_1 a_{22} - a_{12} b_2 = \begin{vmatrix} b_1 & a_{12} \\ b_2 & a_{22} \end{vmatrix}.$$

Če na enak način izločiš $x_1$, dobiš $\det A \cdot x_2$ na levi in na desni determinanto z zamenjanim **drugim** stolpcem. Razlika med eliminacijo in Cramerjem je samo v zapisu: eliminacija izvaja korake, Cramer prebere njihov rezultat.

**3. Pravilo.** Z $A_i$ označimo matriko $A$, v kateri $i$-ti stolpec zamenjamo z $\vec{b}$. Če je $A$ kvadratna in $\det A \neq 0$, ima sistem natanko eno rešitev in velja

$$x_i = \frac{\det A_i}{\det A}, \qquad i = 1, \ldots, n.$$

Pri planetariju je $\det A = 3 \cdot 4 - 2 \cdot 1 = 10$, $\det A_1 = 27 \cdot 4 - 2 \cdot 34 = 40$ in $\det A_2 = 3 \cdot 34 - 27 \cdot 1 = 75$.

:::premisli
Sistem $3 \times 3$ ima $\det A = 5$, desna stran pa je $\vec{b} = \vec{0}$ (homogen sistem). Napovej rešitev, ne da bi kaj računal.
---
Vsaka $A_i$ ima stolpec samih ničel, zato je $\det A_i = 0$. Sledi $x_1 = x_2 = x_3 = 0$: ker je $\det A \neq 0$, ima homogen sistem le trivialno rešitev.
:::

**4. Matrični pogled.** Produkt $A\vec{x}$ je linearna kombinacija stolpcev $\vec{a}_1, \ldots, \vec{a}_n$ matrike $A$:

$$\vec{b} = x_1\vec{a}_1 + x_2\vec{a}_2 + \cdots + x_n\vec{a}_n.$$

Reševanje sistema torej pomeni: s katerimi utežmi sestavimo $\vec{b}$ iz stolpcev $A$? Pogoj $\det A \neq 0$ pomeni, da so stolpci linearno neodvisni (rang $A$ je $n$). Takrat je zapis $\vec{b}$ z njimi en sam. Ko $\vec{b}$ vstavimo na mesto $\vec{a}_i$, determinanta »izmeri« ravno utež $x_i$. Natančen dokaz je v razdelku »Bolj natančno«.

**5. Ko je $\det A = 0$.** Formula bi zahtevala deljenje z nič, zato pravilo ne velja. Sistem tedaj bodisi nima rešitve bodisi jih ima neskončno. Katero od obojega, ugotoviš z Gaussovo eliminacijo ali s primerjavo rangov $A$ in razširjene matrike $[A \mid \vec{b}]$.

**6. Cena.** Za sistem $n \times n$ potrebuješ $n + 1$ determinant reda $n$. Za $n = 2$ ali $n = 3$ je to hitro. Za velike sisteme je eliminacija veliko cenejša, zato računalniki Cramerja ne uporabljajo.

:::premisli
Vse enačbe sistema $3 \times 3$ pomnožimo z $2$, torej $A$ zamenjamo z $2A$ in $\vec{b}$ z $2\vec{b}$. Kaj se zgodi z $\det A$, z $\det A_i$ in z rešitvijo?
---
Obe determinanti se pomnožita z $2^3 = 8$, saj se vsaka od treh vrstic pomnoži z $2$. Količnik ostane enak, zato je rešitev ista. Tako mora biti, saj pomnožene enačbe opisujejo isti sistem.
:::

## Rešeni primeri

### Primer 1 (lažji): sistem dveh enačb

Reši sistem $3x - 2y = 4$, $x + 4y = 13$.

**Podatki:** $A = \begin{pmatrix} 3 & -2 \\ 1 & 4 \end{pmatrix}$, $\vec{b} = \begin{pmatrix} 4 \\ 13 \end{pmatrix}$
**Iščemo:** $x$ in $y$

:::formula
$x = \dfrac{\det A_1}{\det A}$, $y = \dfrac{\det A_2}{\det A}$
:::

**Rešitev:**

1. $\det A = 3 \cdot 4 - (-2) \cdot 1 = 14$. Ni nič, zato pravilo smemo uporabiti.
2. Prvi stolpec zamenjamo z $\vec{b}$: $\det A_1 = 4 \cdot 4 - (-2) \cdot 13 = 42$.
3. Drugi stolpec zamenjamo z $\vec{b}$: $\det A_2 = 3 \cdot 13 - 4 \cdot 1 = 35$.
4. $x = \dfrac{42}{14} = 3$ in $y = \dfrac{35}{14} = 2{,}5$.
5. Preizkus v drugi enačbi: $3 + 4 \cdot 2{,}5 = 13$. Drži.
6. Odgovor: rešitev je $x = 3$, $y = 2{,}5$.

### Primer 2: trije tipi satelitov

Raketa ponese majhne satelite treh velikosti z zaokroženimi masami $x$, $y$ in $z$ (v kg). Pri prvem izstrelku so naložili $2$ majhna, $1$ srednjega in $1$ velikega, skupaj $8\,\mathrm{kg}$. Pri drugem $1$ majhnega, $3$ srednje in $2$ velika, skupaj $15\,\mathrm{kg}$. Pri tretjem $3$ majhne, $1$ srednjega in $2$ velika, skupaj $13\,\mathrm{kg}$. Kolikšne so mase?

**Podatki:** $2x + y + z = 8$, $x + 3y + 2z = 15$, $3x + y + 2z = 13$ (desne strani v kg)
**Iščemo:** mase $x$, $y$, $z$

:::formula
$x = \dfrac{\det A_1}{\det A}$, $y = \dfrac{\det A_2}{\det A}$, $z = \dfrac{\det A_3}{\det A}$, determinante $3 \times 3$ razvijemo po prvi vrstici
:::

**Rešitev:**

1. $\det A = \begin{vmatrix} 2 & 1 & 1 \\ 1 & 3 & 2 \\ 3 & 1 & 2 \end{vmatrix} = 2 \cdot 4 - 1 \cdot (-4) + 1 \cdot (-8) = 4$. Je različna od nič, zato je rešitev ena sama.
2. $\det A_1 = \begin{vmatrix} 8 & 1 & 1 \\ 15 & 3 & 2 \\ 13 & 1 & 2 \end{vmatrix} = 8 \cdot 4 - 1 \cdot 4 + 1 \cdot (-24) = 4$.
3. $\det A_2 = \begin{vmatrix} 2 & 8 & 1 \\ 1 & 15 & 2 \\ 3 & 13 & 2 \end{vmatrix} = 2 \cdot 4 - 8 \cdot (-4) + 1 \cdot (-32) = 8$.
4. $\det A_3 = \begin{vmatrix} 2 & 1 & 8 \\ 1 & 3 & 15 \\ 3 & 1 & 13 \end{vmatrix} = 2 \cdot 24 - 1 \cdot (-32) + 8 \cdot (-8) = 16$.
5. $x = \dfrac{4}{4} = 1$, $y = \dfrac{8}{4} = 2$, $z = \dfrac{16}{4} = 4$.
6. Preizkus v tretji enačbi: $3 \cdot 1 + 2 + 2 \cdot 4 = 13$. Drži.
7. Odgovor: majhen satelit ima maso $1\,\mathrm{kg}$, srednji $2\,\mathrm{kg}$, velik $4\,\mathrm{kg}$.

### Primer 3 (težji): sistem s parametrom

Za katere realne $a$ ima sistem $ax + y = 1$, $x + ay = 2$ natanko eno rešitev? Zapiši jo in jo izračunaj za $a = 3$.

**Podatki:** $A = \begin{pmatrix} a & 1 \\ 1 & a \end{pmatrix}$, $\vec{b} = \begin{pmatrix} 1 \\ 2 \end{pmatrix}$, parameter $a \in \mathbb{R}$
**Iščemo:** pogoj za $a$, nato $x(a)$, $y(a)$ in vrednosti pri $a = 3$

:::formula
Natanko ena rešitev $\iff \det A \neq 0$; tedaj $x = \dfrac{\det A_1}{\det A}$, $y = \dfrac{\det A_2}{\det A}$
:::

**Rešitev:**

1. $\det A = a^2 - 1$. Ta je nič pri $a = 1$ in $a = -1$, zato zahtevamo $a \neq \pm 1$.
2. $\det A_1 = \begin{vmatrix} 1 & 1 \\ 2 & a \end{vmatrix} = a - 2$ in $\det A_2 = \begin{vmatrix} a & 1 \\ 1 & 2 \end{vmatrix} = 2a - 1$.
3. Za $a \neq \pm 1$: $x = \dfrac{a - 2}{a^2 - 1}$, $y = \dfrac{2a - 1}{a^2 - 1}$. Formula velja za vse take $a$ hkrati; eliminacija bi zahtevala delo s parametrom v vsakem koraku.
4. Pri $a = 3$: $\det A = 8$, $x = \dfrac{1}{8} = 0{,}125$, $y = \dfrac{5}{8} = 0{,}625$.
5. Pri $a = 1$ dobimo $x + y = 1$ in $x + y = 2$, kar je protislovje. Pri $a = -1$ dobimo $-x + y = 1$ in $x - y = 2$, spet protislovje. Tu Cramer ne pomaga, preveriti smo morali posebej.
6. Odgovor: rešitev je ena sama natanko za $a \neq \pm 1$; pri $a = 3$ je $x = 0{,}125$, $y = 0{,}625$. Pri $a = \pm 1$ rešitve ni.

### Primer 4 – zdaj ti: tir asteroida

Na treh posnetkih neba ob časih $t = -1$, $t = 1$ in $t = 2$ (v urah) leži asteroid na višini $y = 4$, $y = 2$ in $y = 7$ (v ločnih minutah). Njegovo pot na posnetkih opišemo s parabolo $y = pt^2 + qt + r$. Kolikšen je koeficient $p$? Drugih dveh ne potrebuješ.

**Podatki:** točke $(-1, 4)$, $(1, 2)$, $(2, 7)$; sistem $p - q + r = 4$, $p + q + r = 2$, $4p + 2q + r = 7$
**Iščemo:** koeficient $p$

:::formula
$p = \dfrac{\det A_1}{\det A}$
:::

**Rešitev:**

1. Vsaka točka da eno enačbo, zato je $A = \begin{pmatrix} 1 & -1 & 1 \\ 1 & 1 & 1 \\ 4 & 2 & 1 \end{pmatrix}$ in $\vec{b} = \begin{pmatrix} 4 \\ 2 \\ 7 \end{pmatrix}$.
2. $\det A = 1 \cdot (-1) - (-1) \cdot (-3) + 1 \cdot (-2) = -6$. Ni nič, parabola je ena sama.
3. Za $p$ potrebuješ samo še $\det A_1$: prvi stolpec zamenjaj z $\vec{b}$ in izračunaj sam.

:::premisli
Koliko sta $\det A_1$ in $p$?
---
$\det A_1 = \begin{vmatrix} 4 & -1 & 1 \\ 2 & 1 & 1 \\ 7 & 2 & 1 \end{vmatrix} = 4 \cdot (-1) + 1 \cdot (-5) + 1 \cdot (-3) = -12$, zato je $p = \dfrac{-12}{-6} = 2$. To je prednost Cramerja: eno neznanko dobiš z dvema determinantama.
:::

## Pogoste napake

- **Zamenjana vrstica namesto stolpca.** Kdor $\vec{b}$ vpiše v vrstico, računa determinanto brez pomena. Stolpec $i$ pripada neznanki $x_i$, zato se menja stolpec.
- **Obrnjen ulomek.** Zapis $x_i = \dfrac{\det A}{\det A_i}$ je napačen. V imenovalcu je vedno ista $\det A$, ki je skupna vsem neznankam.
- **»$\det A = 0$, torej ni rešitve.«** Ničelna determinanta pove le, da rešitev ni ena sama. Lahko je ni, lahko jih je neskončno. Odloči eliminacija ali primerjava rangov.
- **»Vse determinante so $0$, torej je rešitev neskončno.«** Tudi to ne drži: sistem $x + y + z = 1$, $x + y + z = 2$, $x + y + z = 3$ ima $\det A = 0$ in vse $\det A_i = 0$, rešitve pa nima.
- **Pravilo za nekvadraten sistem.** Pri treh enačbah z dvema neznankama $\det A$ ne obstaja. Ene enačbe ne smeš kar izpustiti; uporabi eliminacijo.

## Povzetek

- Sistem zapišemo kot $A\vec{x} = \vec{b}$; to pomeni, da je $\vec{b}$ linearna kombinacija stolpcev $A$ z utežmi $x_i$.
- $A_i$ je $A$ z $i$-tim stolpcem, zamenjanim z $\vec{b}$.
- Cramerjevo pravilo: če je $A$ kvadratna in $\det A \neq 0$, je rešitev ena sama in $x_i = \dfrac{\det A_i}{\det A}$.
- Pri $\det A = 0$ pravilo ne pove ničesar; rešitve ni ali jih je neskončno.
- Primerno je za majhne sisteme, sisteme s parametri in za izračun ene same neznanke.

## Za izpit

Znati moraš povedati:
- definicijo matrike $A_i$ in Cramerjevo pravilo z obema pogojema: $A$ je kvadratna in $\det A \neq 0$;
- dokaz pravila iz linearnosti determinante v stolpcu in iz dejstva, da ima matrika z enakima stolpcema determinanto $0$;
- izpeljavo za sistem $2 \times 2$ z eliminacijo ene neznanke;
- kaj pravilo pove pri $\det A = 0$ (ničesar) in kako tedaj odločiš, ali rešitve ni ali jih je neskončno;
- zvezo z inverzom: $A^{-1} = \dfrac{1}{\det A}\operatorname{adj} A$ in zakaj je Cramerjevo pravilo zapis $\vec{x} = A^{-1}\vec{b}$ po komponentah;
- zakaj pravilo ni primerno za velike sisteme ($n + 1$ determinant reda $n$).

### Naloga 1

Dan je sistem s parametrom $a \in \mathbb{R}$:

$$ax + y + z = 1, \qquad x + ay + z = -2, \qquad x + y + az = a.$$

(a) Za katere $a$ ima sistem natanko eno rešitev? Zapiši jo s Cramerjevim pravilom in okrajšaj. (b) Razišči preostale vrednosti $a$. (c) Izračunaj rešitev pri $a = 2$.

**Rešitev:**

1. $A = \begin{pmatrix} a & 1 & 1 \\ 1 & a & 1 \\ 1 & 1 & a \end{pmatrix}$. Razvoj po prvi vrstici: $\det A = a(a^2 - 1) - (a - 1) + (1 - a) = a^3 - 3a + 2$.
2. Ničla je $a = 1$; deljenje z $a - 1$ da $a^2 + a - 2 = (a - 1)(a + 2)$. Torej $\det A = (a - 1)^2(a + 2)$ in rešitev je ena sama natanko za $a \neq 1$ in $a \neq -2$.
3. $\det A_1 = \begin{vmatrix} 1 & 1 & 1 \\ -2 & a & 1 \\ a & 1 & a \end{vmatrix} = (a^2 - 1) - (-2a - a) + (-2 - a^2) = 3a - 3 = 3(a - 1)$.
4. $\det A_2 = \begin{vmatrix} a & 1 & 1 \\ 1 & -2 & 1 \\ 1 & a & a \end{vmatrix} = a(-2a - a) - (a - 1) + (a + 2) = 3 - 3a^2 = -3(a - 1)(a + 1)$.
5. $\det A_3 = \begin{vmatrix} a & 1 & 1 \\ 1 & a & -2 \\ 1 & 1 & a \end{vmatrix} = a(a^2 + 2) - (a + 2) + (1 - a) = a^3 - 1 = (a - 1)(a^2 + a + 1)$.
6. Za $a \notin \{1, -2\}$ okrajšamo faktor $a - 1$: $x = \dfrac{3}{(a - 1)(a + 2)}$, $y = \dfrac{-3(a + 1)}{(a - 1)(a + 2)}$, $z = \dfrac{a^2 + a + 1}{(a - 1)(a + 2)}$.
7. (b) Pri $a = 1$ se prvi dve enačbi glasita $x + y + z = 1$ in $x + y + z = -2$. To je protislovje, rešitve ni. Pri tem so $\det A = \det A_1 = \det A_2 = \det A_3 = 0$; same ničle torej ne pomenijo neskončno rešitev.
8. Pri $a = -2$ seštejemo vse tri enačbe: na levi dobimo $0$, na desni $1 - 2 - 2 = -3$. Protislovje, rešitve ni.
9. (c) Pri $a = 2$: $(a - 1)(a + 2) = 4$, zato $x = \dfrac{3}{4}$, $y = \dfrac{-9}{4}$, $z = \dfrac{7}{4}$.
10. Preizkus v prvi enačbi: $2 \cdot \dfrac{3}{4} - \dfrac{9}{4} + \dfrac{7}{4} = \dfrac{4}{4} = 1$. Drži.
11. Odgovor: natanko ena rešitev za $a \notin \{1, -2\}$ (formule v koraku 6); pri $a = 1$ in $a = -2$ rešitve ni; pri $a = 2$ je $(x, y, z) = \left(\frac{3}{4}, -\frac{9}{4}, \frac{7}{4}\right)$.

### Naloga 2

Natančno navedi Cramerjevo pravilo in ga dokaži. Nato utemelji: če je $\det A = 0$ in je vsaj ena od determinant $\det A_i$ različna od $0$, sistem $A\vec{x} = \vec{b}$ nima rešitve. Ali velja tudi obrat?

**Rešitev:**

1. Izrek: naj bo $A \in \mathbb{R}^{n \times n}$, $\det A \neq 0$, $\vec{b} \in \mathbb{R}^n$ in $A_i$ matrika $A$ z $i$-tim stolpcem, zamenjanim z $\vec{b}$. Potem ima $A\vec{x} = \vec{b}$ natanko eno rešitev in $x_i = \dfrac{\det A_i}{\det A}$ za $i = 1, \ldots, n$.
2. Obstoj in enoličnost: ker je $\det A \neq 0$, je $A$ obrnljiva. Iz $A\vec{x} = \vec{b}$ sledi $\vec{x} = A^{-1}\vec{b}$, ta vektor pa sistem res reši.
3. Ključna enakost: naj bo $\vec{x}$ katerakoli rešitev, torej $\vec{b} = \sum_j x_j\vec{a}_j$. To vstavimo v $i$-ti stolpec $A_i$ in uporabimo linearnost determinante v tem stolpcu: $\det A_i = \sum_j x_j \det(\vec{a}_1, \ldots, \vec{a}_j, \ldots, \vec{a}_n)$, kjer $\vec{a}_j$ stoji na $i$-tem mestu.
4. Za $j \neq i$ ima matrika dva enaka stolpca, zato je njena determinanta $0$. Ostane člen $j = i$: $\det A_i = x_i \det A$. Delimo z $\det A \neq 0$ in dobimo pravilo.
5. Drugi del: v koraku 3 in 4 obrnljivosti nismo uporabili. Enakost $\det A_i = x_i \det A$ velja za vsako rešitev vsakega kvadratnega sistema.
6. Če je $\det A = 0$ in bi rešitev obstajala, bi bilo $\det A_i = x_i \cdot 0 = 0$ za vse $i$. Če je torej neka $\det A_i \neq 0$, rešitve ni.
7. Obrat ne velja: sistem $x + y + z = 1$, $x + y + z = 2$, $x + y + z = 3$ nima rešitve, čeprav so $\det A$ in vse $\det A_i$ enake $0$ (vsaka ima dva enaka stolpca).

### Naloga 3

Dana je matrika $A = \begin{pmatrix} 2 & 1 & 1 \\ 1 & 1 & 2 \\ 3 & 2 & 2 \end{pmatrix}$. (a) S Cramerjevim pravilom izračunaj tretji stolpec matrike $A^{-1}$. (b) Utemelji, ali je rešitev sistema $A\vec{x} = \vec{b}$ celoštevilska za vsak celoštevilski $\vec{b}$.

**Rešitev:**

1. Razvoj po prvi vrstici: $\det A = 2 \cdot (2 - 4) - 1 \cdot (2 - 6) + 1 \cdot (2 - 3) = -4 + 4 - 1 = -1$. Matrika je obrnljiva.
2. Iz $AA^{-1} = I$ sledi, da je tretji stolpec $A^{-1}$ rešitev sistema $A\vec{x} = \vec{e}_3$, kjer je $\vec{e}_3 = (0, 0, 1)^T$.
3. $\det A_1 = \begin{vmatrix} 0 & 1 & 1 \\ 0 & 1 & 2 \\ 1 & 2 & 2 \end{vmatrix}$. Razvoj po prvem stolpcu: $1 \cdot (1 \cdot 2 - 1 \cdot 1) = 1$.
4. $\det A_2 = \begin{vmatrix} 2 & 0 & 1 \\ 1 & 0 & 2 \\ 3 & 1 & 2 \end{vmatrix}$. Razvoj po drugem stolpcu, edini neničelni element je na mestu $(3, 2)$ s predznakom $-$: $-(2 \cdot 2 - 1 \cdot 1) = -3$.
5. $\det A_3 = \begin{vmatrix} 2 & 1 & 0 \\ 1 & 1 & 0 \\ 3 & 2 & 1 \end{vmatrix}$. Razvoj po tretjem stolpcu: $1 \cdot (2 \cdot 1 - 1 \cdot 1) = 1$.
6. $x_1 = \dfrac{1}{-1} = -1$, $x_2 = \dfrac{-3}{-1} = 3$, $x_3 = \dfrac{1}{-1} = -1$. Tretji stolpec $A^{-1}$ je $(-1, 3, -1)^T$.
7. Preizkus s tretjo vrstico $A$: $3 \cdot (-1) + 2 \cdot 3 + 2 \cdot (-1) = 1$. Drži. S prvo vrstico: $2 \cdot (-1) + 3 - 1 = 0$. Drži.
8. (b) Da. Elementi $A$ in $\vec{b}$ so cela števila, determinanta pa je vsota produktov elementov, zato je vsaka $\det A_i$ celo število. Ker je $\det A = -1$, je $x_i = \dfrac{\det A_i}{-1} = -\det A_i$ celo število.
9. Odgovor: tretji stolpec $A^{-1}$ je $(-1, 3, -1)^T$; rešitev je celoštevilska za vsak celoštevilski $\vec{b}$, ker je $\det A = -1$.

## Drugače: Na sliki

V ravnini sta stolpca $\vec{a}_1$ in $\vec{a}_2$ dve puščici iz izhodišča. Absolutna vrednost $\det A$ je ploščina paralelograma, ki ga napenjata.

Zdaj puščico $\vec{a}_1$ zamenjaj z $\vec{b} = x_1\vec{a}_1 + x_2\vec{a}_2$. Nastane paralelogram z ogliščem v konici $\vec{b}$ in stranico $\vec{a}_2$. Del $x_2\vec{a}_2$ pomakne konico vzporedno s stranico $\vec{a}_2$. Tak strižni premik ohrani osnovnico in višino, zato ploščine ne spremeni. Ostane le del $x_1\vec{a}_1$, ki višino raztegne za faktor $x_1$.

Zato je ploščina novega paralelograma $x_1$-krat ploščina starega: $\det A_1 = x_1 \det A$. Če sta $\vec{a}_1$ in $\vec{a}_2$ vzporedna, je stari paralelogram sploščen v daljico s ploščino $0$. Iz razmerja tedaj ne preberemo ničesar.

## Drugače: Uporaba v stroki

V računalniški grafiki sledilnik žarkov za vsak žarek preveri, ali zadene trikotnik. To je sistem $3 \times 3$ za razdaljo vzdolž žarka in dve težiščni koordinati točke v trikotniku. Program ga reši s Cramerjevim pravilom, ker je sistem majhen, formula pa zaprta in brez vejitev. V ravnini je videti takole: trikotnik ima oglišče v izhodišču, stranici iz njega sta $\vec{a}_1 = (4, 1)$ in $\vec{a}_2 = (1, 3)$, točka je pri $\vec{b} = (2, 2)$. Potem je $\det A = 11$, $\det A_1 = 4$ in $\det A_2 = 6$, torej sta uteži $\frac{4}{11}$ in $\frac{6}{11}$. Obe sta pozitivni in njuna vsota $\frac{10}{11}$ je manjša od $1$, zato točka leži v trikotniku. Skoraj ničelna $\det A$ programu pove, da je žarek vzporeden z ravnino trikotnika.

V matematiki sami je pravilo predvsem orodje za dokaze in formule. Pri linearnih diferencialnih enačbah z njim rešiš sistem za neznane funkcije v metodi variacije konstant; $\det A$ je tam determinanta Wronskega. Ker je rešitev količnik dveh determinant, takoj vidiš, kako je odvisna od podatkov: je zvezna in odvedljiva funkcija koeficientov povsod, kjer je $\det A \neq 0$. Za numerično reševanje velikih sistemov pa stroka pravila ne uporablja; tam delo opravi eliminacija (razcep LU).

## Drugače: Bolj natančno

**Izrek.** Naj bo $A \in \mathbb{R}^{n \times n}$, $\det A \neq 0$ in $\vec{b} \in \mathbb{R}^n$. Potem ima $A\vec{x} = \vec{b}$ enolično rešitev in $x_i = \dfrac{\det A_i}{\det A}$.

**Dokaz.** Ker je $\det A \neq 0$, je $A$ obrnljiva in $\vec{x} = A^{-1}\vec{b}$ je edina rešitev. Velja $\vec{b} = \sum_j x_j \vec{a}_j$. Determinanta je linearna v vsakem stolpcu, zato

$$\det A_i = \det(\vec{a}_1, \ldots, \textstyle\sum_j x_j\vec{a}_j, \ldots, \vec{a}_n)$$

$$= \sum_j x_j \det(\vec{a}_1, \ldots, \vec{a}_j, \ldots, \vec{a}_n),$$

kjer je $\vec{a}_j$ na $i$-tem mestu. Za $j \neq i$ ima matrika dva enaka stolpca in determinanto $0$. Ostane člen $j = i$, torej $\det A_i = x_i \det A$. $\blacksquare$

**Povezava z inverzom.** Velja $A^{-1} = \dfrac{1}{\det A}\operatorname{adj} A$, kjer je $\operatorname{adj} A$ prirejenka (transponirana matrika kofaktorjev $C_{ji}$). Razvoj $\det A_i$ po $i$-tem stolpcu da $\det A_i = \sum_j b_j C_{ji}$, kar je ravno $i$-ta komponenta $\operatorname{adj}A \, \vec{b}$. Cramerjevo pravilo je torej formula $\vec{x} = A^{-1}\vec{b}$, zapisana po komponentah.

## Preveri se

? Sistem je $2x - y = 5$, $x + 3y = 4$. Katera matrika je $A_2$, ki jo potrebuješ za $y$?
- $\begin{pmatrix} 2 & -1 \\ 5 & 4 \end{pmatrix}$
~ Tu je $\vec{b}$ vpisan v drugo vrstico. Zamenjati moraš drugi stolpec, ker ta pripada neznanki $y$.
- $\begin{pmatrix} 5 & -1 \\ 4 & 3 \end{pmatrix}$
~ To je $A_1$: zamenjan je prvi stolpec, ki pripada $x$.
+ $\begin{pmatrix} 2 & 5 \\ 1 & 4 \end{pmatrix}$
> Prvi stolpec ostane $(2, 1)$, drugi stolpec $(-1, 3)$ nadomesti $\vec{b} = (5, 4)$.

? Pri sistemu $3 \times 3$ je $\det A = 7$ in $\det A_2 = 20{,}9$. Približno koliko je $x_2$?
- približno $0{,}33$
~ To je $\dfrac{\det A}{\det A_2}$, obrnjen ulomek. V imenovalcu je $\det A$.
+ približno $3$
- približno $146$
~ To je produkt $7 \cdot 20{,}9$. Determinanti delimo, ne množimo.
- približno $28$
~ To je vsota. Pravilo je količnik $\dfrac{\det A_2}{\det A}$.
> $x_2 = \dfrac{20{,}9}{7} \approx 2{,}99$, torej približno $3$.

? Zakaj Cramerjevo pravilo zahteva $\det A \neq 0$?
- Ker sistem pri $\det A = 0$ nikoli nima rešitve.
~ Sistem ima lahko tudi neskončno rešitev, na primer $x + y = 1$, $2x + 2y = 2$.
+ Ker so pri $\det A = 0$ stolpci linearno odvisni, rešitev ni enolična ali je ni, enakost $\det A_i = x_i \det A$ pa $x_i$ ne določi.
- Ker so pri $\det A = 0$ vse $\det A_i$ tudi enake $0$.
~ Ne nujno: pri $x + y = 1$, $x + y = 2$ je $\det A = 0$, $\det A_1 = 1 \cdot 1 - 1 \cdot 2 = -1$.
> Iz $\det A_i = x_i \det A$ pri $\det A = 0$ dobimo le $\det A_i = 0$ ali protislovje, vrednosti $x_i$ pa ne.

? Pri sistemu $2 \times 2$ je $\det A = 4$, rešitev pa $x = 3$, $y = -1$. Koliko sta $\det A_1$ in $\det A_2$?
- $\det A_1 = 0{,}75$, $\det A_2 = -0{,}25$
~ Tu si rešitev delil z $\det A$. Iz $x = \dfrac{\det A_1}{\det A}$ sledi $\det A_1 = x \det A$.
+ $\det A_1 = 12$, $\det A_2 = -4$
- $\det A_1 = 7$, $\det A_2 = 3$
~ To je $\det A + x$ in $\det A + y$. Zveza je množenje: $\det A_i = x_i \det A$.
> $\det A_1 = 3 \cdot 4 = 12$ in $\det A_2 = (-1) \cdot 4 = -4$.

? Za katere $k$ sistem $kx + 2y = 1$, $2x + ky = 3$ **nima** natanko ene rešitve?
- samo za $k = 2$
~ Enačba $k^2 - 4 = 0$ ima dve rešitvi. Pozabil si na $k = -2$.
- za $k = 0$
~ Pri $k = 0$ je $\det A = 0 - 4 = -4 \neq 0$, zato je rešitev ena sama.
+ za $k = 2$ in $k = -2$
- za $k = 4$
~ To je število $4$ iz $\det A = k^2 - 4$, ne njegova ničla. Pri $k = 4$ je $\det A = 12$.
> $\det A = k^2 - 4 = 0$ pri $k = \pm 2$. Za vse druge $k$ Cramer da eno samo rešitev.

:::simboli
a_{11}, a_{12}, a_{21}, a_{22} | koeficienti sistema (elementi matrike A)
x | neznanka sistema | | | x₁, …, xₙ v splošnem zapisu
x_i | i-ta neznanka | x_i = \frac{\det A_i}{\det A} | | det A ≠ 0
y, z | neznanki sistema
b | desna stran enačbe | | | b₁, b₂ desni strani obeh enačb
\vec{b} | stolpec desnih strani | \vec{b} = x_1\vec{a}_1 + x_2\vec{a}_2 + \cdots + x_n\vec{a}_n
A | kvadratna matrika koeficientov sistema
A_i, A_1, A_2, A_3 | matrika A z i-tim stolpcem, zamenjanim z desnimi stranmi
\vec{a}_1, \vec{a}_2, \vec{a}_n, \vec{a}_j | stolpci matrike A
i, j | indeksa stolpcev (neznank)
n | število enačb in neznank
a | realni parameter sistema
p | koeficient pri t² v enačbi parabole | | | y = pt² + qt + r
:::
