---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Dietetičarka sestavlja bolniku jedilnik: vsaka porcija živila prinese določeno količino beljakovin, maščob in ogljikovih hidratov. Dvojna porcija prinese dvakrat toliko, dve živili skupaj pa vsoto svojih prispevkov. Radiolog na zaslonu zavrti rentgensko sliko okoli središča za $90^\circ$: dve puščici, narisani na sliko, lahko sešteje pred vrtenjem ali po njem in dobi isto, enako velja za raztegnitev puščice za faktor $2$. Krožnik in rentgenska slika nimata nič skupnega, obe preslikavi pa ohranjata seštevanje in množenje s skalarjem; takim pravimo **linearne**. Enako se obnašata odvajanje polinomov, $(p + q)' = p' + q'$ in $(\lambda p)' = \lambda p'$, ter množenje z matriko, $A(\mathbf{x} + \mathbf{y}) = A\mathbf{x} + A\mathbf{y}$. Vsako linearno preslikavo zapišemo z **matriko preslikave**, zato se računanje z njimi prevede na računanje z matrikami. Spoznaš še **jedro** in **sliko** preslikave ter kako se matrika spremeni, ko **zamenjamo bazo**.

## Razlaga

### Najprej slika: kaj se zgodi z mrežo

Nariši kvadratno mrežo z izhodiščem in opazuj, kaj preslikava naredi z njo:

| Preslikava | Kaj se zgodi z izhodiščem in mrežo | Linearna? |
|---|---|---|
| vrtenje ravnine okoli izhodišča | izhodišče ostane, mreža se zavrti | da |
| pravokotna projekcija na ravnino skozi izhodišče | izhodišče ostane, prostor se sploči na ravnino | da |
| množenje z matriko $\mathbf{x} \mapsto A\mathbf{x}$ | izhodišče ostane, kvadratki postanejo paralelogrami | da |
| premik $\mathbf{x} \mapsto \mathbf{x} + \mathbf{b}$, $\mathbf{b} \neq \mathbf{0}$ | izhodišče se premakne v $\mathbf{b}$ | ne |
| $(x, y) \mapsto (x^2, y)$ | premica $y = x$ se ukrivi v parabolo $x = y^2$ | ne |

Linearno je tudi odvajanje $D\colon \mathbb{R}_n[x] \to \mathbb{R}_{n-1}[x]$, čeprav ga ne narišemo kot mrežo.

### Nato simboli: definicija

Naj bosta $U$ in $V$ vektorska prostora. Preslikava $L\colon U \to V$ je **linearna**, če za vse $u, v \in U$ in $\lambda \in \mathbb{R}$ velja

$$L(u + v) = L(u) + L(v), \qquad L(\lambda u) = \lambda L(u).$$

Takoj sledi $L(\mathbf{0}) = L(0 \cdot \mathbf{0}) = 0 \cdot L(\mathbf{0}) = \mathbf{0}$. Linearna preslikava vedno slika ničelni vektor v ničelnega, zato premik iz tabele odpade že na prvem preizkusu.

:::premisli
Funkciji $f(x) = 2x + 1$ v srednji šoli rečemo »linearna funkcija«. Ali je linearna preslikava $\mathbb{R} \to \mathbb{R}$ v smislu zgornje definicije? Napovej, nato preveri z $L(\mathbf{0})$.
---
Ni. Velja $f(0) = 1 \neq 0$, linearna preslikava pa mora $0$ slikati v $0$. Tudi $f(1 + 1) = 5$, $f(1) + f(1) = 6$. Linearne preslikave $\mathbb{R} \to \mathbb{R}$ so natanko $x \mapsto kx$. Funkcija $2x + 1$ je *afina*: linearna preslikava, ki ji sledi premik.
:::

### Preslikavo določijo slike baznih vektorjev

Na mreži je dovolj vedeti, kam gresta puščici $e_1 = (1, 0)$ in $e_2 = (0, 1)$; vse ostalo sledi. Splošno: naj bo $u_1, \ldots, u_n$ baza prostora $U$. Vsak $u$ zapišemo kot $u = \alpha_1 u_1 + \ldots + \alpha_n u_n$. Zaradi linearnosti je

$$L(u) = \alpha_1 L(u_1) + \ldots + \alpha_n L(u_n).$$

Ko poznaš $L(u_1), \ldots, L(u_n)$, poznaš $L$ povsod. Za opis preslikave zadošča končno mnogo podatkov.

### Matrika preslikave

Začni pri sliki: vrtenje ravnine za $90^\circ$ v pozitivni smeri pošlje puščico $e_1 = (1, 0)$ v $(0, 1)$, puščico $e_2 = (0, 1)$ pa v $(-1, 0)$. Ti sliki zložimo v stolpca:

$$A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}.$$

Splošno izberemo bazo $B = \{u_1, \ldots, u_n\}$ prostora $U$ in bazo $C = \{v_1, \ldots, v_m\}$ prostora $V$. **Matrika** $A$ preslikave $L$ glede na $B$ in $C$ ima v $j$-tem **stolpcu** koordinate vektorja $L(u_j)$ v bazi $C$. Matrika je velikosti $m \times n$ in velja

$$[L(u)]_C = A\,[u]_B.$$

### Jedro in slika

Na mreži: če se paralelogram sploči, se vsaj ena cela premica vektorjev zlije v izhodišče. **Jedro** preslikave je $\ker L = \{u \in U : L(u) = \mathbf{0}\}$, vse kar se »zbriše«. **Slika** je $\operatorname{im} L = \{L(u) : u \in U\}$, vse kar preslikava doseže. Jedro je podprostor v $U$, slika pa podprostor v $V$.

Za $L(\mathbf{x}) = A\mathbf{x}$ je jedro množica rešitev homogenega sistema $A\mathbf{x} = \mathbf{0}$. Slika je ogrinjača stolpcev matrike $A$, ker je $A\mathbf{x} = x_1 \mathbf{a}_1 + \ldots + x_n \mathbf{a}_n$.

Jedro meri, koliko informacije se izgubi. Velja: $L$ je **injektivna** natanko tedaj, ko je $\ker L = \{\mathbf{0}\}$. Iz $L(u) = L(v)$ namreč sledi $L(u - v) = \mathbf{0}$.

### Dimenzijska formula

Najprej tabela štirih preslikav $\mathbb{R}^3 \to \mathbb{R}^3$:

| Preslikava $\mathbb{R}^3 \to \mathbb{R}^3$ | $\ker L$ | $\operatorname{im} L$ | $\dim$ jedra $+$ slike |
|---|---|---|---|
| vrtenje okoli osi $z$ | $\{\mathbf{0}\}$ | $\mathbb{R}^3$ | $0 + 3$ |
| projekcija na ravnino $xy$ | os $z$ | ravnina $xy$ | $1 + 2$ |
| projekcija na os $x$ | ravnina $yz$ | os $x$ | $2 + 1$ |
| ničelna preslikava | $\mathbb{R}^3$ | $\{\mathbf{0}\}$ | $3 + 0$ |

Kar jedro »vzame«, slika »izgubi«. Vsota je vedno $3$. S simboli: za $L\colon U \to V$ s končnorazsežnim $U$ velja

$$\dim \ker L + \dim \operatorname{im} L = \dim U.$$

Število $\dim \operatorname{im} L$ je **rang** preslikave in je enak rangu njene matrike.

:::premisli
Ali obstaja injektivna linearna preslikava $\mathbb{R}^3 \to \mathbb{R}^2$? Zakaj?
---
Ne obstaja. Slika leži v $\mathbb{R}^2$, zato je $\dim \operatorname{im} L \le 2$. Iz formule sledi $\dim \ker L = 3 - \dim \operatorname{im} L \ge 1$. Jedro torej vsebuje neničelni vektor in $L$ ni injektivna. Iz prostora večje dimenzije v manjšega se vedno nekaj zbriše.
:::

### Prehod med bazami

Nova baza je kot nova, zasukana mreža na istem papirju. Isti vektor ima v različnih bazah različne koordinate. Naj bo $B = \{e_1, e_2\}$ standardna baza ravnine in $B' = \{b_1, b_2\}$ nova baza z $b_1 = (1, 1)$, $b_2 = (1, -1)$. **Prehodna matrika** $P$ ima v stolpcih nove bazne vektorje, zapisane v stari bazi:

$$P = \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}, \qquad [u]_B = P\,[u]_{B'}.$$

Vektor z novima koordinatama $(3, 1)$ je $3b_1 + 1b_2 = (4, 2)$. Res: $P \cdot (3, 1) = (3 + 1,\ 3 - 1) = (4, 2)$. V obratno smer računamo s $P^{-1}$: $[u]_{B'} = P^{-1}[u]_B$.

Če ima $L\colon U \to U$ v bazi $B$ matriko $A$, ima v bazi $B'$ matriko

$$A' = P^{-1} A P.$$

Beri od desne proti levi: $P$ pretvori nove koordinate v stare, $A$ preslika, $P^{-1}$ pretvori rezultat nazaj v nove koordinate. Pri $L\colon U \to V$ zamenjamo bazi na obeh straneh: s prehodnima matrikama $P$ v $U$ in $Q$ v $V$ je nova matrika $Q^{-1} A P$.

## Rešeni primeri

### Primer 1 (lažji): matrika preslikave

Monitor ob bolniški postelji iz treh zaporednih odčitkov izračuna razliki sosednjih odčitkov. To je preslikava $L\colon \mathbb{R}^3 \to \mathbb{R}^2$, $L(x, y, z) = (x - y,\ y - z)$. Zapiši njeno matriko v standardnih bazah in izračunaj $L(2, 5, 1)$.

**Podatki:** $L(x, y, z) = (x - y,\ y - z)$, standardni bazi $e_1, e_2, e_3$ v $\mathbb{R}^3$ in $\mathbb{R}^2$, vektor $(2, 5, 1)$
**Iščemo:** matriko $A$ in $L(2, 5, 1)$

:::formula
$j$-ti stolpec matrike $= L(e_j)$; $\;L(\mathbf{x}) = A\mathbf{x}$
:::

**Rešitev:**

1. $L(e_1) = L(1, 0, 0) = (1, 0)$, $L(e_2) = L(0, 1, 0) = (-1, 1)$, $L(e_3) = L(0, 0, 1) = (0, -1)$.
2. Sliki zložimo v stolpce: $A = \begin{bmatrix} 1 & -1 & 0 \\ 0 & 1 & -1 \end{bmatrix}$, velikost $2 \times 3$, ker gre $\mathbb{R}^3 \to \mathbb{R}^2$.
3. $A \cdot (2, 5, 1) = (1 \cdot 2 - 1 \cdot 5 + 0 \cdot 1,\ 0 \cdot 2 + 1 \cdot 5 - 1 \cdot 1) = (-3, 4)$.
4. Preizkus neposredno po predpisu: $L(2, 5, 1) = (2 - 5,\ 5 - 1) = (-3, 4)$, se ujema.
5. Odgovor: $A = \begin{bmatrix} 1 & -1 & 0 \\ 0 & 1 & -1 \end{bmatrix}$ in $L(2, 5, 1) = (-3, 4)$.

### Primer 2: jedro in slika

Za $L(\mathbf{x}) = A\mathbf{x}$ z $A = \begin{bmatrix} 1 & 2 & 1 \\ 2 & 4 & 3 \\ 1 & 2 & 2 \end{bmatrix}$ poišči bazi jedra in slike ter preveri dimenzijsko formulo.

**Podatki:** $A$ kot zgoraj, $L\colon \mathbb{R}^3 \to \mathbb{R}^3$
**Iščemo:** bazo $\ker L$, bazo $\operatorname{im} L$, njuni dimenziji

:::formula
$\ker L$ = rešitve $A\mathbf{x} = \mathbf{0}$; $\operatorname{im} L$ = ogrinjača stolpcev $A$; $\dim \ker L + \dim \operatorname{im} L = 3$
:::

**Rešitev:**

1. Gaussova eliminacija: $V_2 - 2V_1 = (0, 0, 1)$, $V_3 - V_1 = (0, 0, 1)$, nato $V_3 - V_2 = (0, 0, 0)$.
2. Stopničasta oblika: $\begin{bmatrix} 1 & 2 & 1 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{bmatrix}$. Vodilna elementa sta v 1. in 3. stolpcu, prosta spremenljivka je $x_2$.
3. Jedro: iz druge vrstice $x_3 = 0$, iz prve $x_1 = -2x_2$. Torej $\mathbf{x} = x_2(-2, 1, 0)$.
4. Preizkus: $A \cdot (-2, 1, 0) = (-2 + 2,\ -4 + 4,\ -2 + 2) = (0, 0, 0)$.
5. Slika: vzamemo **prvotna** stolpca na mestih vodilnih elementov, $(1, 2, 1)$ in $(1, 3, 2)$. Drugi stolpec je dvakratnik prvega, zato je odveč.
6. Odgovor: $\ker L = \mathcal{L}\{(-2, 1, 0)\}$ z dimenzijo $1$, $\operatorname{im} L = \mathcal{L}\{(1, 2, 1), (1, 3, 2)\}$ z dimenzijo $2$. Res $1 + 2 = 3$.

### Primer 3 (težji): odvajanje kot linearna preslikava

Odvajanje $D\colon \mathbb{R}_2[x] \to \mathbb{R}_2[x]$, $D(p) = p'$, je linearno. Zapiši njegovo matriko v bazi $B = \{1, x, x^2\}$, z njo izračunaj odvod polinoma $3 - x + 4x^2$ ter določi jedro in sliko.

**Podatki:** $D(p) = p'$ na $\mathbb{R}_2[x]$, baza $B = \{1, x, x^2\}$, polinom $p = 3 - x + 4x^2$
**Iščemo:** matriko $A$, $D(p)$, $\ker D$, $\operatorname{im} D$

:::formula
$j$-ti stolpec $= [D(u_j)]_B$; $\;[D(p)]_B = A\,[p]_B$
:::

**Rešitev:**

1. Slike baznih vektorjev: $D(1) = 0$, $D(x) = 1$, $D(x^2) = 2x$.
2. Njihove koordinate v $B$ so $(0, 0, 0)$, $(1, 0, 0)$, $(0, 2, 0)$. To so stolpci: $A = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 2 \\ 0 & 0 & 0 \end{bmatrix}$.
3. $[p]_B = (3, -1, 4)$, zato $A[p]_B = (-1,\ 2 \cdot 4,\ 0) = (-1, 8, 0)$, kar je polinom $-1 + 8x$.
4. Preizkus z odvajanjem: $(3 - x + 4x^2)' = -1 + 8x$.
5. Jedro: $p' = 0$ natanko za konstante, $\ker D = \mathcal{L}\{1\}$, dimenzija $1$.
6. Slika: odvod polinoma stopnje $\le 2$ ima stopnjo $\le 1$ in vsak tak polinom je odvod nekega, zato $\operatorname{im} D = \mathbb{R}_1[x] = \mathcal{L}\{1, x\}$, dimenzija $2$.
7. Odgovor: matrika je $A$ iz 2. koraka, $D(p) = -1 + 8x$, jedro so konstante, slika $\mathbb{R}_1[x]$. Velja $1 + 2 = 3 = \dim \mathbb{R}_2[x]$.

### Primer 4: zdaj ti (prehod med bazami)

Preslikava $L\colon \mathbb{R}^2 \to \mathbb{R}^2$ ima v standardni bazi matriko $A = \begin{bmatrix} 3 & 1 \\ 0 & 2 \end{bmatrix}$. Izračunaj koordinate vektorja $(5, -2)$ v bazi $B' = \{b_1, b_2\}$, $b_1 = (1, 0)$, $b_2 = (1, -1)$, in matriko $A'$ preslikave $L$ v bazi $B'$.

**Podatki:** $A = \begin{bmatrix} 3 & 1 \\ 0 & 2 \end{bmatrix}$, $b_1 = (1, 0)$, $b_2 = (1, -1)$, vektor $(5, -2)$
**Iščemo:** $[(5, -2)]_{B'}$ in $A'$

:::formula
$P$ ima v stolpcih $b_1, b_2$; $\;[u]_{B'} = P^{-1}[u]_B$; $\;A' = P^{-1} A P$
:::

**Rešitev:**

1. $P = \begin{bmatrix} 1 & 1 \\ 0 & -1 \end{bmatrix}$. Izračunamo $P \cdot P = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$, zato je $P^{-1} = P$.
2. Koordinate: $P^{-1} \cdot (5, -2) = (5 - 2,\ 2) = (3, 2)$. Preizkus: $3b_1 + 2b_2 = (3 + 2,\ 0 - 2) = (5, -2)$.
3. $AP = \begin{bmatrix} 3 & 1 \\ 0 & 2 \end{bmatrix}\begin{bmatrix} 1 & 1 \\ 0 & -1 \end{bmatrix} = \begin{bmatrix} 3 & 2 \\ 0 & -2 \end{bmatrix}$.
4. Izračunaj še $A' = P^{-1}(AP)$ sam, nato preveri:

:::premisli
Koliko je $A'$ in kaj pove o vektorjih $b_1$ in $b_2$?
---
$A' = \begin{bmatrix} 1 & 1 \\ 0 & -1 \end{bmatrix}\begin{bmatrix} 3 & 2 \\ 0 & -2 \end{bmatrix} = \begin{bmatrix} 3 & 0 \\ 0 & 2 \end{bmatrix}$. Matrika je diagonalna: $L(b_1) = 3b_1$ in $L(b_2) = 2b_2$. Preslikava v tej bazi le raztegne vsako smer posebej. Takšne baze boš iskal v lekciji o lastnih vektorjih.
:::

## Pogoste napake

- **Slike baznih vektorjev v vrstice.** Študent zapiše $L(e_j)$ kot $j$-to vrstico in dobi transponirano matriko. Napaka se pokaže pri $\mathbb{R}^3 \to \mathbb{R}^2$, kjer matrika $3 \times 2$ sploh ne pomnoži vektorja iz $\mathbb{R}^3$. Popravek: slike gredo v **stolpce**, matrika je velikosti $\dim V \times \dim U$.
- **»Linearna« funkcija $2x + 1$.** Ime iz srednje šole zavede. Ker $f(0) \neq 0$, ni linearna preslikava. Popravek: najprej preveri $L(\mathbf{0}) = \mathbf{0}$; premiki in prosti členi niso linearni.
- **Slika iz stolpcev stopničaste oblike.** Vrstične operacije spremenijo stolpce. V primeru 2 je 1. stolpec stopničaste oblike $(1, 0, 0)$, ki sploh ni v sliki (slika je ravnina $x - y + z = 0$). Popravek: stopničasta oblika pove, *katere* stolpce vzeti, vzameš pa stolpce **prvotne** matrike.
- **Napačna smer prehodne matrike.** Študent pomnoži stare koordinate s $P$ in misli, da dobi nove. $P$ pretvarja **iz novih v stare**. Popravek: $[u]_{B'} = P^{-1}[u]_B$ in $A' = P^{-1}AP$, ne $PAP^{-1}$.
- **Jedro v napačnem prostoru.** Jedro je podprostor **domene** $U$, slika podprostor **kodomene** $V$. Pri $\mathbb{R}^3 \to \mathbb{R}^2$ imajo vektorji jedra $3$ komponente, vektorji slike pa $2$.

## Povzetek

- $L\colon U \to V$ je linearna, če ohranja vsoto in množenje s skalarjem; vedno velja $L(\mathbf{0}) = \mathbf{0}$.
- Matrika preslikave ima v $j$-tem stolpcu koordinate $L(u_j)$ v bazi $C$ prostora $V$; velja $[L(u)]_C = A[u]_B$.
- Jedro $\ker L$ (rešitve $A\mathbf{x} = \mathbf{0}$) je podprostor domene, slika $\operatorname{im} L$ (ogrinjača stolpcev) podprostor kodomene. $L$ je injektivna $\iff \ker L = \{\mathbf{0}\}$.
- Dimenzijska formula: $\dim \ker L + \dim \operatorname{im} L = \dim U$.
- Prehodna matrika $P$ ima v stolpcih novo bazo v starih koordinatah: $[u]_B = P[u]_{B'}$, nova matrika preslikave je $A' = P^{-1}AP$.

## Drugače: Na sliki

Nariši na papir kvadratno mrežo in v izhodišču puščici $e_1$ (desno) in $e_2$ (gor).

- Linearna preslikava mrežo **preoblikuje**, a ohrani tri stvari: izhodišče ostane na mestu, premice ostanejo premice, vzporedne črte ostanejo vzporedne in enako razmaknjene.
- Kam gresta $e_1$ in $e_2$, določi vse. Kvadratki postanejo paralelogrami s stranicama $L(e_1)$ in $L(e_2)$. Ti dve puščici sta stolpca matrike.
- Če se paralelogram sploči v daljico, je slika le premica. Cela premica vektorjev se takrat zlije v $\mathbf{0}$: to je jedro.

Zamenjava baze je kot nova, poševna mreža na istem papirju. Točka ostane na istem mestu, spremenijo se le »številke ulic«, po katerih jo poiščeš.

## Drugače: Korak za korakom s številkami

Recept za jedro in sliko matrike $A$ velikosti $m \times n$:

1. Z Gaussovo eliminacijo preoblikuj $A$ v stopničasto obliko.
2. Označi stolpce z vodilnimi elementi. Njihovo število $r$ je rang.
3. **Slika:** iz *prvotne* matrike vzemi označene stolpce. To je baza slike, $\dim \operatorname{im} = r$.
4. **Jedro:** neoznačeni stolpci dajo proste spremenljivke. Vsaki po vrsti daj vrednost $1$, ostalim prostim $0$, in izračunaj vodilne. Dobljeni vektorji so baza jedra, $\dim \ker = n - r$.
5. Preveri: $r + (n - r) = n$ in $A$ krat vsak vektor jedra je $\mathbf{0}$.

Recept za zamenjavo baze:

1. Nove bazne vektorje zapiši v stolpce: dobiš $P$.
2. Izračunaj $P^{-1}$ (pri $2 \times 2$: zamenjaj diagonalna, spremeni predznak izvendiagonalnima, deli z $\det P$).
3. Izračunaj $A' = P^{-1}(AP)$.
4. Preizkus: $j$-ti stolpec $A'$ so koordinate $L(b_j)$ v novi bazi.

## Drugače: Bolj natančno

**Izrek o dimenziji jedra in slike.** Naj bo $\dim U = n$ in $L\colon U \to V$ linearna. Izberemo bazo $w_1, \ldots, w_k$ jedra in jo dopolnimo do baze $w_1, \ldots, w_k, u_{k+1}, \ldots, u_n$ prostora $U$. Trdimo, da je $L(u_{k+1}), \ldots, L(u_n)$ baza slike.

*Napenjanje.* Za $u = \sum \alpha_i w_i + \sum \beta_j u_j$ je $L(u) = \sum \beta_j L(u_j)$, ker je $L(w_i) = \mathbf{0}$.

*Neodvisnost.* Iz $\sum \beta_j L(u_j) = \mathbf{0}$ sledi $L\big(\sum \beta_j u_j\big) = \mathbf{0}$, torej $\sum \beta_j u_j \in \ker L$ in je enak $\sum \gamma_i w_i$. Ker so vsi $w_i$ in $u_j$ skupaj baza, so vsi $\beta_j = 0$.

Torej $\dim \operatorname{im} L = n - k$. Posledica za $L\colon U \to U$: $L$ je injektivna $\iff$ surjektivna $\iff$ obrnljiva. Pri kvadratni matriki je to isto kot $\det A \neq 0$.

**Kompozitum.** Če imata $L$ in $K$ matriki $A$ in $B$ v ustreznih bazah, ima $K \circ L$ matriko $BA$. Zato je množenje matrik definirano tako, kot je.

**Izpeljava $A' = P^{-1}AP$.** Iz $[u]_B = P[u]_{B'}$ in $[L(u)]_B = A[u]_B$ dobimo $[L(u)]_{B'} = P^{-1}[L(u)]_B = P^{-1}AP\,[u]_{B'}$. Matriki $A$ in $A'$ sta **podobni**. Podobne matrike imajo enako determinanto in rang, saj opisujeta isto preslikavo.

## Preveri se

? Kaj je jedro linearne preslikave $L\colon U \to V$?
- Množica vseh vektorjev $L(u)$ za $u \in U$.
~ To je slika preslikave. Jedro so vektorji, ki se preslikajo v $\mathbf{0}$.
+ Množica vseh $u \in U$, za katere je $L(u) = \mathbf{0}$.
- Množica vseh $v \in V$, ki niso v sliki.
~ Ta množica ni niti podprostor (ne vsebuje $\mathbf{0}$). Jedro leži v domeni $U$.
> Jedro je podprostor domene; $L$ je injektivna natanko tedaj, ko je jedro $\{\mathbf{0}\}$.

? Ali je $f\colon \mathbb{R} \to \mathbb{R}$, $f(x) = 2x + 1$, linearna preslikava?
- Da, ker je njen graf premica.
~ Graf je premica, a ne gre skozi izhodišče. Linearna preslikava mora $0$ slikati v $0$.
- Da, ker je polinom prve stopnje.
~ Ime »linearna funkcija« iz srednje šole se ne ujema s pojmom linearne preslikave. Prosti člen $1$ pokvari linearnost.
+ Ne, ker je $f(0) = 1 \neq 0$.
> Linearne preslikave $\mathbb{R} \to \mathbb{R}$ so le $x \mapsto kx$. Na primer $f(1 + 1) = 5$, $f(1) + f(1) = 6$.

? Linearna preslikava $L\colon \mathbb{R}^4 \to \mathbb{R}^3$ je surjektivna. Kolikšna je $\dim \ker L$?
- $0$
~ Surjektivnost ne pomeni injektivnosti. Iz $\mathbb{R}^4$ v $\mathbb{R}^3$ se nekaj vedno zbriše.
+ $1$
- $3$
~ $3$ je dimenzija slike. Dimenzija jedra je razlika $\dim U - \dim \operatorname{im} L$.
- $7$
~ Dimenziji ne seštevamo. Formula je $\dim \ker L + \dim \operatorname{im} L = \dim U$.
> Surjektivna pomeni $\operatorname{im} L = \mathbb{R}^3$, torej $\dim \ker L = 4 - 3 = 1$.

? Kakšna je matrika preslikave $L(x, y) = (x + y,\ 2y)$ v standardni bazi?
- $\begin{bmatrix} 1 & 0 \\ 1 & 2 \end{bmatrix}$
~ To je transponirana matrika: slike $L(e_1) = (1, 0)$ in $L(e_2) = (1, 2)$ si zapisal v vrstice namesto v stolpce.
+ $\begin{bmatrix} 1 & 1 \\ 0 & 2 \end{bmatrix}$
- $\begin{bmatrix} 1 & 1 \\ 2 & 0 \end{bmatrix}$
~ Koeficient $2$ stoji pri $y$, zato je v drugem stolpcu. Preveri $L(0, 1) = (1, 2)$.
> $L(e_1) = (1, 0)$ je prvi stolpec, $L(e_2) = (1, 2)$ drugi stolpec.

? Baza ravnine je $b_1 = (1, 1)$, $b_2 = (1, -1)$. Katere so koordinate vektorja $(6, 2)$ v tej bazi?
- $(8, 4)$
~ To je $P \cdot (6, 2)$. Matrika $P$ pretvarja iz novih koordinat v stare; za nove potrebuješ $P^{-1}$.
- $(6, 2)$
~ To so koordinate v standardni bazi. V novi bazi so drugačne, ker sta bazna vektorja drugačna.
+ $(4, 2)$
- $(2, 4)$
~ Zamenjal si vrstni red: prva koordinata spada k $b_1$. Preveri: $2b_1 + 4b_2 = (6, -2)$.
> Rešimo $a(1, 1) + b(1, -1) = (6, 2)$: $a + b = 6$, $a - b = 2$, torej $a = 4$, $b = 2$. Preizkus: $4b_1 + 2b_2 = (6, 2)$.

:::simboli
L | linearna preslikava | L(u + v) = L(u) + L(v) | | L: U → V
u, v | vektorja prostora U
\lambda | skalar (realno število)
\alpha | koordinata vektorja u v bazi B | u = \alpha_1 u_1 + \ldots + \alpha_n u_n | | α₁, …, αₙ
u_1, u_n, u_j | bazni vektorji prostora U
U | vektorski prostor (domena preslikave L)
B | baza prostora U | B = \{u_1, \ldots, u_n\} | | pri menjavi baze stara (standardna) baza
C | baza prostora V | C = \{v_1, \ldots, v_m\}
A | matrika preslikave L glede na bazi B in C | [L(u)]_C = A\,[u]_B
P | prehodna matrika iz baze B' v bazo B | [u]_B = P\,[u]_{B'} | | v stolpcih novi bazni vektorji, zapisani v stari bazi
B' | nova baza | B' = \{b_1, b_2\}
A' | matrika preslikave v novi bazi B' | A' = P^{-1} A P
b_1, b_2 | vektorja nove baze B'
j | indeks stolpca matrike
e_j | j-ti vektor standardne baze
D | odvajanje polinomov | D(p) = p'
p | polinom stopnje največ 2
:::
