---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V gimnaziji si sisteme dveh ali treh linearnih enačb reševal z vstavljanjem ali z nasprotnimi koeficienti. Ko je neznank deset, sto ali milijon (kar je v kemijskem inženirstvu, statiki konstrukcij, populacijski biologiji ali obdelavi slik povsem običajno), takšno pisanje ni več pregledno. **Matrika** je pravokotna razpredelnica števil, s katero zapišemo veliko podatkov naenkrat in z njimi računamo po jasnih pravilih.

Z matrikami opišemo:

- sistem linearnih enačb kot eno samo enačbo $A\vec{x} = \vec{b}$,
- linearne preslikave (vrtenje, zrcaljenje, raztezanje v ravnini in prostoru),
- prehode med stanji (npr. kako se populacija živali po starostnih razredih spremeni v enem letu),
- stehiometrijske koeficiente reakcij, tokove v električnih vezjih, sile v paličju.

**Determinanta** je eno samo število, ki ga priredimo kvadratni matriki. Pove, ali je matrika obrnljiva (ali ima sistem $A\vec{x} = \vec{b}$ natanko eno rešitev), in geometrijsko, kolikokrat preslikava poveča ploščino ali prostornino.

Naučil se boš seštevati in množiti matrike, poiskati inverzno matriko, izračunati determinanto in uporabljati njene lastnosti.

## Razlaga

**1. Matrika.** Matrika velikosti $m \times n$ ima $m$ vrstic in $n$ stolpcev:

$$A = \begin{bmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{bmatrix} = [a_{ij}].$$

Element $a_{ij}$ stoji v $i$-ti vrstici in $j$-tem stolpcu (najprej vrstica, nato stolpec). Če je $m = n$, je matrika **kvadratna**. Posebne matrike: **ničelna** $0$ (vsi elementi so $0$), **enotska** $I$ (enice na glavni diagonali, drugod ničle), **diagonalna**, **zgornje trikotna** (pod diagonalo same ničle). **Transponirana** matrika $A^T$ nastane, ko vrstice zapišemo kot stolpce: $(A^T)_{ij} = a_{ji}$.

**2. Seštevanje in množenje s skalarjem.** Seštevamo samo matriki enake velikosti, in to po elementih: $(A + B)_{ij} = a_{ij} + b_{ij}$. Pri množenju s številom $\lambda$ pomnožimo vsak element: $(\lambda A)_{ij} = \lambda a_{ij}$. Ti operaciji se obnašata kot pri številih (komutativnost, asociativnost, distributivnost).

**3. Množenje matrik.** Produkt $AB$ obstaja samo, če ima $A$ toliko stolpcev, kot ima $B$ vrstic. Če je $A$ velikosti $m \times n$ in $B$ velikosti $n \times p$, je $AB$ velikosti $m \times p$:

$$(AB)_{ij} = \sum_{k=1}^{n} a_{ik} b_{kj} = a_{i1}b_{1j} + a_{i2}b_{2j} + \dots + a_{in}b_{nj}.$$

Element na mestu $(i, j)$ je torej »skalarni produkt« $i$-te vrstice matrike $A$ in $j$-tega stolpca matrike $B$. Pomembno:

- Množenje **ni komutativno**: v splošnem je $AB \neq BA$ (pogosto eden od produktov sploh ne obstaja).
- Velja asociativnost $(AB)C = A(BC)$ in distributivnost $A(B + C) = AB + AC$.
- $AI = IA = A$, enotska matrika je »enica«.
- Iz $AB = 0$ **ne** sledi $A = 0$ ali $B = 0$.
- $(AB)^T = B^T A^T$ (vrstni red se obrne). *Dokaz:* $\big((AB)^T\big)_{ij} = (AB)_{ji} = \sum_k a_{jk}b_{ki} = \sum_k (B^T)_{ik}(A^T)_{kj} = (B^TA^T)_{ij}$.

:::premisli
Ali za kvadratni matriki velja $(A + B)^2 = A^2 + 2AB + B^2$?
---
V splošnem ne. Z distributivnostjo je $(A + B)^2 = A^2 + AB + BA + B^2$, kar je enako $A^2 + 2AB + B^2$ le, če je $AB = BA$.
:::

**4. Determinanta matrike $2 \times 2$ in $3 \times 3$.** Za $2 \times 2$:

$$\det A = \begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc.$$

Za $3 \times 3$ uporabimo **razvoj po vrstici** (Laplaceov razvoj). Po prvi vrstici:

$$\det A = a_{11} \begin{vmatrix} a_{22} & a_{23} \\ a_{32} & a_{33} \end{vmatrix} - a_{12} \begin{vmatrix} a_{21} & a_{23} \\ a_{31} & a_{33} \end{vmatrix} + a_{13} \begin{vmatrix} a_{21} & a_{22} \\ a_{31} & a_{32} \end{vmatrix}.$$

**Poddeterminanta** (minor) $M_{ij}$ je determinanta matrike reda $n - 1$, ki ostane, ko prečrtamo $i$-to vrstico in $j$-ti stolpec, **kofaktor** (algebrski komplement) pa je $C_{ij} = (-1)^{i+j} M_{ij}$.

**Izrek (Laplaceov razvoj).** Naj bo $A$ kvadratna matrika reda $n \ge 2$. Potem za vsako vrstico $i$ velja $\det A = \sum_{j=1}^n a_{ij} C_{ij}$ in za vsak stolpec $j$ velja $\det A = \sum_{i=1}^n a_{ij} C_{ij}$. Če pa vrstico $i$ pomnožimo s kofaktorji **druge** vrstice $k \neq i$, je $\sum_j a_{ij}C_{kj} = 0$ (to je razvoj matrike z dvema enakima vrsticama). Predznaki tvorijo šahovnico $\begin{smallmatrix} + & - & + \\ - & + & - \\ + & - & + \end{smallmatrix}$. Razvijamo lahko po katerikoli vrstici ali stolpcu; najbolje po tisti z največ ničlami. Za $3 \times 3$ lahko uporabiš tudi Sarrusovo pravilo (desno od matrike prepišeš prva dva stolpca, tri produkte po diagonalah navzdol prišteješ, tri navzgor odšteješ), ki pa za večje matrike **ne** velja.

**5. Lastnosti determinante** ($A$, $B$ kvadratni matriki reda $n$):

- $\det A^T = \det A$, zato vse, kar velja za vrstice, velja tudi za stolpce.
- Če zamenjamo dve vrstici, determinanta spremeni predznak.
- Če eno vrstico pomnožimo z $\lambda$, se determinanta pomnoži z $\lambda$. Zato je $\det(\lambda A) = \lambda^n \det A$.
- Če neki vrstici prištejemo večkratnik druge vrstice, se determinanta **ne** spremeni. *Utemeljitev:* determinanta je linearna v vsaki vrstici (to se vidi iz Laplaceovega razvoja po tej vrstici), zato se razcepi na $\det A + \lambda \det A'$, kjer ima $A'$ dve enaki vrstici in je $\det A' = 0$.
- Če ima matrika ničelno vrstico ali dve enaki (sorazmerni) vrstici, je $\det A = 0$. *Utemeljitev:* zamenjava enakih vrstic matrike ne spremeni, determinanta pa spremeni predznak, torej $\det A = -\det A$ in $\det A = 0$.
- Determinanta trikotne matrike je produkt diagonalnih elementov.
- $\det(AB) = \det A \cdot \det B$ (a v splošnem $\det(A + B) \neq \det A + \det B$).

Te lastnosti omogočajo hitro računanje: z vrstičnimi operacijami matriko prevedemo na trikotno obliko in zmnožimo diagonalo. Primer: v matriki $\begin{bmatrix} 1 & 2 & 1 \\ 2 & 5 & 3 \\ 1 & 4 & 6 \end{bmatrix}$ od druge vrstice odštejemo dvakratnik prve, od tretje pa prvo vrstico, in dobimo $\begin{bmatrix} 1 & 2 & 1 \\ 0 & 1 & 1 \\ 0 & 2 & 5 \end{bmatrix}$. Nato od tretje vrstice odštejemo dvakratnik druge: $\begin{bmatrix} 1 & 2 & 1 \\ 0 & 1 & 1 \\ 0 & 0 & 3 \end{bmatrix}$. Nobena od teh operacij ne spremeni determinante, zato je $\det = 1 \cdot 1 \cdot 3 = 3$. Pri ročnem računanju se splača oba načina kombinirati: najprej z vrstičnimi operacijami pridelamo ničle v enem stolpcu, nato razvijemo po tem stolpcu.

:::premisli
Matrika reda $3$ ima vrstice $(1, 2, 3)$, $(4, 5, 6)$ in $(7, 8, 9)$. Koliko je njena determinanta, če ne razvijaš?
---
$0$. Odštejemo: tretja minus druga je $(3, 3, 3)$, druga minus prva prav tako $(3, 3, 3)$. Ti operaciji determinante ne spremenita, nova matrika pa ima dve enaki vrstici.
:::

**6. Inverzna matrika.** Kvadratna matrika $A$ reda $n$ je **obrnljiva** (nesingularna), če obstaja matrika $X$ reda $n$, da je $AX = XA = I$. Takšna $X$ je ena sama: če sta $X$ in $Y$ inverza, je $X = XI = X(AY) = (XA)Y = Y$. Označimo jo z $A^{-1}$.

**Izrek (obrnljivost).** Naj bo $A$ kvadratna matrika reda $n$. Potem je

$$A \text{ obrnljiva} \iff \det A \neq 0,$$

in tedaj je $A^{-1} = \dfrac{1}{\det A}\operatorname{adj} A$, kjer je **prirejenka** $\operatorname{adj} A = [C_{ij}]^T$ transponirana matrika kofaktorjev.

*Dokaz.* ($\Rightarrow$) $1 = \det I = \det(AA^{-1}) = \det A \cdot \det A^{-1}$, zato $\det A \neq 0$ in $\det A^{-1} = 1/\det A$. ($\Leftarrow$) Po Laplaceovem izreku je $(A\operatorname{adj} A)_{ik} = \sum_j a_{ij}C_{kj}$ enako $\det A$ za $i = k$ in $0$ za $i \neq k$, torej $A\operatorname{adj} A = (\det A)I$; enako $\operatorname{adj} A \cdot A = (\det A)I$. Delimo z $\det A \neq 0$. $\square$

Za $2 \times 2$: $\begin{bmatrix} a & b \\ c & d \end{bmatrix}^{-1} = \dfrac{1}{ad - bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$ (zamenjaj diagonalna elementa, drugima spremeni predznak, deli z determinanto).

Prirejenka deluje za vsak red, a zahteva $n^2$ poddeterminant. Za večje matrike je hitrejša **Gauss-Jordanova metoda**: matriko $[A \mid I]$ z vrstičnimi operacijami preoblikujemo v $[I \mid A^{-1}]$. Pravila za obrnljivi $A$, $B$ istega reda: $(AB)^{-1} = B^{-1}A^{-1}$ (*dokaz:* $(AB)(B^{-1}A^{-1}) = AIA^{-1} = I$ in enako z druge strani), $(A^T)^{-1} = (A^{-1})^T$, $\det A^{-1} = 1/\det A$.

**Izrek (sistemi).** Naj bo $A$ kvadratna. Če je $\det A \neq 0$, ima sistem $A\vec{x} = \vec{b}$ za vsak $\vec{b}$ natanko eno rešitev $\vec{x} = A^{-1}\vec{b}$; po **Cramerjevem pravilu** je $x_j = \det A_j/\det A$, kjer $A_j$ dobimo, ko $j$-ti stolpec zamenjamo z $\vec{b}$. Homogeni sistem $A\vec{x} = \vec{0}$ ima netrivialno rešitev natanko tedaj, ko je $\det A = 0$.

## Rešeni primeri

### Primer 1 (lažji)

Dani sta matriki $A = \begin{bmatrix} 2 & 1 \\ 3 & -1 \end{bmatrix}$ in $B = \begin{bmatrix} 1 & 4 \\ 0 & 2 \end{bmatrix}$. Izračunaj $A + B$, $3A$, $AB$ in $BA$. Ali je $AB = BA$?

**Podatki:** $A = \begin{bmatrix} 2 & 1 \\ 3 & -1 \end{bmatrix}$, $B = \begin{bmatrix} 1 & 4 \\ 0 & 2 \end{bmatrix}$, skalar $3$
**Iščemo:** $A + B$, $3A$, $AB$, $BA$ in primerjavo $AB$ z $BA$

:::formula
$(A + B)_{ij} = a_{ij} + b_{ij}$, $(\lambda A)_{ij} = \lambda a_{ij}$, $(AB)_{ij} = \sum_k a_{ik} b_{kj}$ (vrstica krat stolpec)
:::

**Rešitev:**

1. $A + B = \begin{bmatrix} 2 + 1 & 1 + 4 \\ 3 + 0 & -1 + 2 \end{bmatrix} = \begin{bmatrix} 3 & 5 \\ 3 & 1 \end{bmatrix}$.
2. $3A = \begin{bmatrix} 6 & 3 \\ 9 & -3 \end{bmatrix}$.
3. $AB$: prva vrstica $A$ krat prvi stolpec $B$: $2 \cdot 1 + 1 \cdot 0 = 2$; krat drugi stolpec: $2 \cdot 4 + 1 \cdot 2 = 10$. Druga vrstica: $3 \cdot 1 + (-1) \cdot 0 = 3$ in $3 \cdot 4 + (-1) \cdot 2 = 10$. Torej $AB = \begin{bmatrix} 2 & 10 \\ 3 & 10 \end{bmatrix}$.
4. $BA$: $1 \cdot 2 + 4 \cdot 3 = 14$, $1 \cdot 1 + 4 \cdot (-1) = -3$, $0 \cdot 2 + 2 \cdot 3 = 6$, $0 \cdot 1 + 2 \cdot (-1) = -2$. Torej $BA = \begin{bmatrix} 14 & -3 \\ 6 & -2 \end{bmatrix}$.
5. Preizkus z determinanto: $\det A = -2 - 3 = -5$, $\det B = 2$, $\det(AB) = 20 - 30 = -10 = (-5) \cdot 2$. Tudi $\det(BA) = -28 + 18 = -10$.
6. Odgovor: $A + B = \begin{bmatrix} 3 & 5 \\ 3 & 1 \end{bmatrix}$, $3A = \begin{bmatrix} 6 & 3 \\ 9 & -3 \end{bmatrix}$, $AB = \begin{bmatrix} 2 & 10 \\ 3 & 10 \end{bmatrix}$, $BA = \begin{bmatrix} 14 & -3 \\ 6 & -2 \end{bmatrix}$; ker se produkta razlikujeta, je $AB \neq BA$.

### Primer 2

Poišči inverzno matriko matrike $A = \begin{bmatrix} 4 & 7 \\ 2 & 6 \end{bmatrix}$ in z njo reši sistem $4x + 7y = 1$, $2x + 6y = 2$.

**Podatki:** $A = \begin{bmatrix} 4 & 7 \\ 2 & 6 \end{bmatrix}$, desna stran $\vec{b} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}$
**Iščemo:** $A^{-1}$ in rešitev $\vec{x} = (x, y)$

:::formula
$\begin{bmatrix} a & b \\ c & d \end{bmatrix}^{-1} = \dfrac{1}{ad - bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$, $\vec{x} = A^{-1}\vec{b}$
:::

**Rešitev:**

1. $\det A = 4 \cdot 6 - 7 \cdot 2 = 24 - 14 = 10 \neq 0$, zato je $A$ obrnljiva.
2. $A^{-1} = \dfrac{1}{10} \begin{bmatrix} 6 & -7 \\ -2 & 4 \end{bmatrix} = \begin{bmatrix} 0{,}6 & -0{,}7 \\ -0{,}2 & 0{,}4 \end{bmatrix}$.
3. Preizkus: $AA^{-1}$ ima elemente $4 \cdot 0{,}6 + 7 \cdot (-0{,}2) = 1$, $4 \cdot (-0{,}7) + 7 \cdot 0{,}4 = 0$, $2 \cdot 0{,}6 + 6 \cdot (-0{,}2) = 0$, $2 \cdot (-0{,}7) + 6 \cdot 0{,}4 = 1$, torej $AA^{-1} = I$.
4. $\vec{x} = A^{-1}\vec{b}$: $x = 0{,}6 \cdot 1 - 0{,}7 \cdot 2 = -0{,}8$, $y = -0{,}2 \cdot 1 + 0{,}4 \cdot 2 = 0{,}6$.
5. Preizkus v enačbah: $4 \cdot (-0{,}8) + 7 \cdot 0{,}6 = -3{,}2 + 4{,}2 = 1$ in $2 \cdot (-0{,}8) + 6 \cdot 0{,}6 = -1{,}6 + 3{,}6 = 2$.
6. Odgovor: $A^{-1} = \begin{bmatrix} 0{,}6 & -0{,}7 \\ -0{,}2 & 0{,}4 \end{bmatrix}$, rešitev sistema je $x = -0{,}8$, $y = 0{,}6$.

### Primer 3 (težji)

Dana je matrika $A = \begin{bmatrix} 1 & 2 & 3 \\ 0 & 1 & 4 \\ 5 & 6 & a \end{bmatrix}$ s parametrom $a \in \mathbb R$. Za katere $a$ je $A$ obrnljiva? Za $a = 0$ poišči $A^{-1}$ s prirejenko ter določi $\det(2A)$ in $\det A^{-1}$. Utemelji še, da je $\det(2A^TA^{-1}) = 8$ za vsak dopusten $a$.

**Podatki:** $A = \begin{bmatrix} 1 & 2 & 3 \\ 0 & 1 & 4 \\ 5 & 6 & a \end{bmatrix}$ (red $n = 3$), faktor $2$
**Iščemo:** pogoj za obrnljivost, $A^{-1}$ pri $a = 0$, $\det(2A)$, $\det A^{-1}$, $\det(2A^TA^{-1})$

:::formula
$\det A = \sum_j a_{1j} C_{1j}$, $C_{ij} = (-1)^{i+j} M_{ij}$, $A^{-1} = \dfrac{1}{\det A}[C_{ij}]^T$, $\det(\lambda A) = \lambda^n \det A$, $\det A^{-1} = \dfrac{1}{\det A}$
:::

**Rešitev:**

1. Razvoj po prvi vrstici: $\det A = 1 \cdot (1 \cdot a - 4 \cdot 6) - 2 \cdot (0 \cdot a - 4 \cdot 5) + 3 \cdot (0 \cdot 6 - 1 \cdot 5) = a - 24 + 40 - 15 = a + 1$.
2. Po izreku o obrnljivosti je $A$ obrnljiva natanko tedaj, ko $a + 1 \neq 0$, torej za $a \neq -1$. Pri $a = 0$ je $\det A = 1$.
3. Kofaktorji prve vrstice ($a = 0$): $C_{11} = -24$, $C_{12} = -(0 - 20) = 20$, $C_{13} = 0 - 5 = -5$.
4. Druga vrstica: $C_{21} = -(2 \cdot 0 - 3 \cdot 6) = 18$, $C_{22} = 1 \cdot 0 - 3 \cdot 5 = -15$, $C_{23} = -(1 \cdot 6 - 2 \cdot 5) = 4$.
5. Tretja vrstica: $C_{31} = 2 \cdot 4 - 3 \cdot 1 = 5$, $C_{32} = -(1 \cdot 4 - 3 \cdot 0) = -4$, $C_{33} = 1 \cdot 1 - 2 \cdot 0 = 1$.
6. Prirejenka je transponirana matrika kofaktorjev; ker je $\det A = 1$: $A^{-1} = \begin{bmatrix} -24 & 18 & 5 \\ 20 & -15 & -4 \\ -5 & 4 & 1 \end{bmatrix}$.
7. Preizkus (prva vrstica $A$ krat stolpci $A^{-1}$): $-24 + 40 - 15 = 1$, $18 - 30 + 12 = 0$, $5 - 8 + 3 = 0$. Enako za ostali vrstici, zato $AA^{-1} = I$.
8. $\det(2A) = 2^3 \cdot 1 = 8$, ker se z $2$ pomnoži vsaka od treh vrstic; $\det A^{-1} = 1/1 = 1$.
9. Za vsak $a \neq -1$: $\det(2A^TA^{-1}) = 2^3 \det A^T \det A^{-1} = 8 \cdot (a + 1) \cdot \frac{1}{a + 1} = 8$ (multiplikativnost in $\det A^T = \det A$).
10. Odgovor: $A$ je obrnljiva za $a \neq -1$; pri $a = 0$ je $A^{-1} = \begin{bmatrix} -24 & 18 & 5 \\ 20 & -15 & -4 \\ -5 & 4 & 1 \end{bmatrix}$, $\det(2A) = 8$ in $\det A^{-1} = 1$; $\det(2A^TA^{-1}) = 8$ ne glede na $a$.

## Pogoste napake

- **Množenje po elementih.** Študent zmnoži istoležne elemente, kot pri seštevanju. Pravilno: element produkta je vsota produktov vrstice prve in stolpca druge matrike.
- **Zamenjan vrstni red.** Iz $AX = B$ sklepa $X = BA^{-1}$. Ker množenje ni komutativno, je pravilno $X = A^{-1}B$ (z leve pomnožimo z $A^{-1}$).
- **Neobstoječ produkt.** Matriki $2 \times 3$ in $2 \times 3$ ne moremo zmnožiti; notranji dimenziji se morata ujemati.
- **$\det(\lambda A) = \lambda \det A$.** Pravilno je $\lambda^n \det A$, ker se z $\lambda$ pomnoži vsaka od $n$ vrstic.
- **Pozabljen predznak kofaktorja** ali pozabljeno transponiranje pri prirejenki. Preveri: $AA^{-1}$ mora dati $I$.
- **Sarrusovo pravilo za $4 \times 4$.** Velja samo za $3 \times 3$; za večje matrike razvijaj ali prevedi na trikotno obliko.
- **Deljenje z matriko.** Zapis $B/A$ ne obstaja; govorimo o množenju z inverzno matriko, in to le, če je $\det A \neq 0$.

## Povzetek

- Matrika $m \times n$ ima $m$ vrstic in $n$ stolpcev; $a_{ij}$ je v $i$-ti vrstici in $j$-tem stolpcu.
- Seštevamo po elementih (enake velikosti); $(AB)_{ij} = \sum_k a_{ik}b_{kj}$ obstaja, ko je $(m \times n)(n \times p)$; $AB \neq BA$ v splošnem.
- $\det \begin{bmatrix} a & b \\ c & d \end{bmatrix} = ad - bc$; večje determinante razvijemo po vrstici ali stolpcu s kofaktorji $C_{ij} = (-1)^{i+j}M_{ij}$.
- Lastnosti: $\det A^T = \det A$, zamenjava vrstic spremeni predznak, prištevanje večkratnika vrstice ne spremeni determinante, $\det(AB) = \det A \det B$, $\det(\lambda A) = \lambda^n \det A$.
- $A$ je obrnljiva natanko tedaj, ko je $\det A \neq 0$; $A^{-1} = \frac{1}{\det A}\operatorname{adj} A$ ali Gauss-Jordan $[A \mid I] \to [I \mid A^{-1}]$.
- $(AB)^{-1} = B^{-1}A^{-1}$, $\det A^{-1} = 1/\det A$, rešitev $A\vec{x} = \vec{b}$ je $\vec{x} = A^{-1}\vec{b}$.

## Za izpit

Znati moraš povedati:

- definicijo produkta matrik s pogojem za obstoj in dokaz $(AB)^T = B^TA^T$,
- definicijo minorja in kofaktorja ter Laplaceov razvoj po vrstici in stolpcu,
- lastnosti determinante pri vrstičnih operacijah z utemeljitvijo, $\det(AB) = \det A\det B$ in $\det(\lambda A) = \lambda^n\det A$,
- definicijo obrnljive matrike, enoličnost inverza in izrek »$A$ obrnljiva $\iff \det A \neq 0$« z dokazom (prirejenka),
- dokaz $(AB)^{-1} = B^{-1}A^{-1}$, Cramerjevo pravilo in pogoj za netrivialno rešitev $A\vec{x} = \vec{0}$.

### Naloga 1

Dani sta $A = \begin{bmatrix} 3 & 1 & 0 \\ 1 & 2 & 1 \\ 0 & 1 & 3 \end{bmatrix}$ in $B = \begin{bmatrix} 2 & 0 \\ 1 & 1 \\ 3 & -1 \end{bmatrix}$. Reši matrično enačbo $AX = 2X + B$.

**Rešitev:**

1. Preoblikujemo: $AX - 2X = B$, $(A - 2I)X = B$. Pozor: $AX - 2X = (A - 2I)X$, ne $(A - 2)X$, ker matriki ne moremo odšteti števila.
2. $A - 2I = \begin{bmatrix} 1 & 1 & 0 \\ 1 & 0 & 1 \\ 0 & 1 & 1 \end{bmatrix}$, razvoj po prvi vrstici: $\det = 1 \cdot (0 - 1) - 1 \cdot (1 - 0) + 0 = -2 \neq 0$, zato je obrnljiva.
3. Kofaktorji: $C_{11} = -1$, $C_{12} = -1$, $C_{13} = 1$, $C_{21} = -1$, $C_{22} = 1$, $C_{23} = -1$, $C_{31} = 1$, $C_{32} = -1$, $C_{33} = -1$.
4. $(A - 2I)^{-1} = \dfrac{1}{-2}\begin{bmatrix} -1 & -1 & 1 \\ -1 & 1 & -1 \\ 1 & -1 & -1 \end{bmatrix} = \dfrac12\begin{bmatrix} 1 & 1 & -1 \\ 1 & -1 & 1 \\ -1 & 1 & 1 \end{bmatrix}$.
5. Z leve pomnožimo z inverzom: $X = (A - 2I)^{-1}B = \dfrac12\begin{bmatrix} 2 + 1 - 3 & 0 + 1 + 1 \\ 2 - 1 + 3 & 0 - 1 - 1 \\ -2 + 1 + 3 & 0 + 1 - 1 \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ 2 & -1 \\ 1 & 0 \end{bmatrix}$.
6. Preizkus: $(A - 2I)X$ ima vrstice $(2, 0)$, $(1, 1)$, $(3, -1)$, kar je $B$.
7. Odgovor: $X = \begin{bmatrix} 0 & 1 \\ 2 & -1 \\ 1 & 0 \end{bmatrix}$. Zapis $X = B(A - 2I)^{-1}$ bi bil napačen (in produkt $3 \times 2$ krat $3 \times 3$ sploh ne obstaja).

### Naloga 2

Za katere $a \in \mathbb R$ ima homogeni sistem $A\vec{x} = \vec{0}$ z $A = \begin{bmatrix} a & 1 & 1 & 1 \\ 1 & a & 1 & 1 \\ 1 & 1 & a & 1 \\ 1 & 1 & 1 & a \end{bmatrix}$ netrivialno rešitev? Za $a = -3$ jih poišči vse.

**Rešitev:**

1. Prvi vrstici prištejemo ostale tri (determinanta se ne spremeni): prva vrstica je $(a + 3, a + 3, a + 3, a + 3)$.
2. Iz nje izpostavimo $a + 3$: $\det A = (a + 3)\det\begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & a & 1 & 1 \\ 1 & 1 & a & 1 \\ 1 & 1 & 1 & a \end{bmatrix}$.
3. Od 2., 3. in 4. vrstice odštejemo prvo: dobimo zgornjo trikotno matriko z diagonalo $1, a - 1, a - 1, a - 1$, torej $\det A = (a + 3)(a - 1)^3$.
4. Netrivialna rešitev obstaja natanko tedaj, ko je $\det A = 0$, torej za $a = -3$ ali $a = 1$.
5. Pri $a = -3$ naj bo $s = x_1 + x_2 + x_3 + x_4$. Enačba $i$ se glasi $(a - 1)x_i + s = 0$, torej $-4x_i + s = 0$ in $x_i = \frac s4$ za vse $i$.
6. Vse komponente so enake, $x_1 = x_2 = x_3 = x_4 = t$; preizkus: $-3t + t + t + t = 0$.
7. Odgovor: $a \in \{-3, 1\}$; pri $a = -3$ so rešitve $\vec{x} = t(1, 1, 1, 1)$, $t \in \mathbb R$ (pri $a = 1$ vsi $\vec{x}$ z $x_1 + x_2 + x_3 + x_4 = 0$).

### Naloga 3

Naj bo $A$ kvadratna matrika reda $n$. Natančno navedi in dokaži izrek o obrnljivosti. Nato utemelji, ali obstaja realna matrika $A$ reda $3$, za katero je $A^2 = -I$.

**Rešitev:**

1. Izrek: $A$ je obrnljiva natanko tedaj, ko je $\det A \neq 0$; tedaj je $A^{-1} = \frac{1}{\det A}\operatorname{adj} A$.
2. ($\Rightarrow$) Iz $AA^{-1} = I$ in multiplikativnosti: $\det A \cdot \det A^{-1} = 1$, zato $\det A \neq 0$.
3. ($\Leftarrow$) Laplaceov razvoj da $A\operatorname{adj} A = \operatorname{adj} A \cdot A = (\det A)I$ (po diagonali razvoj, zunaj nje razvoj matrike z dvema enakima vrsticama). Delimo z $\det A$.
4. Recimo, da je $A^2 = -I$ za realno $A$ reda $3$. Potem $(\det A)^2 = \det(A^2) = \det(-I) = (-1)^3 = -1$.
5. Kvadrat realnega števila ni negativen, zato je to protislovje.
6. Odgovor: takšna matrika ne obstaja. Pri redu $2$ pa obstaja, na primer $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$ (vrtenje za $90°$), saj je $\det(-I) = (-1)^2 = 1$.

## Drugače: Na sliki

Stolpca matrike $A = \begin{bmatrix} 3 & 1 \\ 0 & 2 \end{bmatrix}$ sta vektorja $(3, 0)$ in $(1, 2)$. Preslikava $\vec{x} \mapsto A\vec{x}$ pošlje enotski kvadrat (oglišča $(0,0)$, $(1,0)$, $(1,1)$, $(0,1)$) v paralelogram, ki ga razpenjata stolpca:

```
  y
  2 |    *-----------*         (1,2)       (4,2)
    |   /           /
  1 |  /           /
    | /           /
  0 *-----------*----- x       (0,0)       (3,0)
    0   1   2   3   4
```

Ploščina paralelograma je osnovnica krat višina $= 3 \cdot 2 = 6$, kar je ravno $\det A = 3 \cdot 2 - 1 \cdot 0 = 6$. Absolutna vrednost determinante torej pove, **kolikokrat preslikava poveča ploščino** (v prostoru prostornino). Negativen predznak pomeni, da preslikava obrne orientacijo (kot zrcaljenje). Če je $\det A = 0$, se kvadrat sesede v daljico ali točko: preslikava izgubi dimenzijo in je ni mogoče obrniti, zato $A^{-1}$ ne obstaja.

## Drugače: Uporaba v stroki

**Spektrofotometrija zmesi.** Absorbanca zmesi dveh snovi pri valovni dolžini $\lambda_k$ je po Beer-Lambertovem zakonu $A_k = (\varepsilon_{k1}c_1 + \varepsilon_{k2}c_2)\,l$. Meritev pri dveh valovnih dolžinah da sistem $2 \times 2$. Pri $\varepsilon = \begin{bmatrix} 2000 & 500 \\ 300 & 1500 \end{bmatrix}\,\mathrm{L\,mol^{-1}\,cm^{-1}}$, $l = 1\,\mathrm{cm}$ in absorbancah $0{,}30$ in $0{,}33$ je $\det \varepsilon = 2{,}85 \cdot 10^6$ in po Cramerjevem pravilu $c_1 = \frac{0{,}30 \cdot 1500 - 500 \cdot 0{,}33}{2{,}85 \cdot 10^6} = 1{,}0 \cdot 10^{-4}\,\mathrm{mol/L}$, $c_2 = \frac{2000 \cdot 0{,}33 - 300 \cdot 0{,}30}{2{,}85 \cdot 10^6} = 2{,}0 \cdot 10^{-4}\,\mathrm{mol/L}$. Valovni dolžini izberemo tako, da je determinanta daleč od $0$; pri skoraj enakih spektrih je sistem slabo pogojen in majhna napaka absorbance močno spremeni koncentraciji.

**Stehiometrija in snovne bilance.** Urejanje enačbe reakcije je homogeni sistem: vsak element da eno enačbo za stehiometrijske koeficiente, netrivialna rešitev obstaja, ker je neznank več kot neodvisnih enačb. Snovne bilance procesa z več tokovi in komponentami (destilacija, recikel v reaktor) vodijo do $A\vec{x} = \vec{b}$; $\det A = 0$ pomeni, da so bilance odvisne in manjka meritev.

**Kristalografija.** Osnovno celico kristala razpenjajo vektorji $\vec a$, $\vec b$, $\vec c$; njena prostornina je absolutna vrednost determinante matrike, katere vrstice so njihove komponente. Iz nje in mase celice računamo gostoto kristala.

**Populacijska biologija.** V Lesliejevem modelu je populacija po starostnih razredih čez eno leto $\vec{x}_{t+1} = L\vec{x}_t$, čez deset let $L^{10}\vec{x}_t$.

## Drugače: Korak za korakom s številkami

Izračunajmo produkt $C = \begin{bmatrix} 1 & 0 & 2 \\ -1 & 3 & 1 \end{bmatrix}$ in $D = \begin{bmatrix} 3 & 1 \\ 2 & 1 \\ 1 & 0 \end{bmatrix}$ ter determinanto rezultata.

1. **Velikosti:** $C$ je $2 \times 3$, $D$ je $3 \times 2$. Notranji dimenziji ($3$ in $3$) se ujemata, rezultat bo $2 \times 2$.
2. **Element $(1,1)$:** prva vrstica $C$ $(1, 0, 2)$ in prvi stolpec $D$ $(3, 2, 1)$: $1 \cdot 3 + 0 \cdot 2 + 2 \cdot 1 = 5$.
3. **Element $(1,2)$:** $(1, 0, 2)$ in $(1, 1, 0)$: $1 + 0 + 0 = 1$.
4. **Element $(2,1)$:** $(-1, 3, 1)$ in $(3, 2, 1)$: $-3 + 6 + 1 = 4$.
5. **Element $(2,2)$:** $(-1, 3, 1)$ in $(1, 1, 0)$: $-1 + 3 + 0 = 2$.
6. **Rezultat:** $CD = \begin{bmatrix} 5 & 1 \\ 4 & 2 \end{bmatrix}$.
7. **Determinanta:** $\det(CD) = 5 \cdot 2 - 1 \cdot 4 = 6$. Ker je različna od $0$, je $CD$ obrnljiva: $(CD)^{-1} = \frac{1}{6}\begin{bmatrix} 2 & -1 \\ -4 & 5 \end{bmatrix}$.

Opomba: $DC$ je matrika $3 \times 3$, torej druge velikosti. Pravila $\det(CD) = \det C \cdot \det D$ tu ne moremo uporabiti, ker $C$ in $D$ nista kvadratni.

## Drugače: Bolj natančno

**Definicija determinante.** Za kvadratno matriko reda $n$ je

$$\det A = \sum_{\sigma \in S_n} \operatorname{sgn}(\sigma)\, a_{1\sigma(1)} a_{2\sigma(2)} \cdots a_{n\sigma(n)},$$

kjer vsota teče po vseh $n!$ permutacijah $\sigma$ množice $\{1, \dots, n\}$, $\operatorname{sgn}(\sigma) = \pm 1$ pa je predznak permutacije (sodo ali liho število transpozicij). Za $n = 2$ dobimo $a_{11}a_{22} - a_{12}a_{21}$. Determinanta je edina funkcija, ki je linearna v vsaki vrstici, alternirajoča (zamenjava dveh vrstic spremeni predznak) in ima $\det I = 1$. Iz teh treh lastnosti sledijo vse ostale, tudi Laplaceov razvoj.

**Zakaj $(AB)^{-1} = B^{-1}A^{-1}$.** Izračunamo $(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = AIA^{-1} = AA^{-1} = I$ in podobno $(B^{-1}A^{-1})(AB) = I$. Ker je inverz enoličen (če sta $X$ in $Y$ inverza, je $X = XI = X(AY) = (XA)Y = Y$), je to inverz.

**Zakaj obrnljivost pomeni $\det A \neq 0$.** Če $A^{-1}$ obstaja, je $1 = \det I = \det(AA^{-1}) = \det A \cdot \det A^{-1}$, zato $\det A \neq 0$. Obratno: iz Laplaceovega razvoja sledi $A \operatorname{adj} A = (\det A) I$, ker je vsota $\sum_j a_{ij}C_{kj}$ za $i \ne k$ determinanta matrike z dvema enakima vrsticama in je enaka $0$. Če je $\det A \neq 0$, delimo in dobimo $A^{-1} = \frac{1}{\det A}\operatorname{adj} A$.

**Cramerjevo pravilo.** Če je $\det A \neq 0$, je rešitev sistema $A\vec{x} = \vec{b}$ enaka $x_j = \det A_j / \det A$, kjer $A_j$ dobimo, ko $j$-ti stolpec matrike $A$ zamenjamo z $\vec{b}$. Pravilo je teoretično pomembno, za računanje velikih sistemov pa je Gaussova eliminacija mnogo hitrejša: razvoj po definiciji zahteva približno $n!$ produktov, eliminacija pa približno $n^3$ operacij.

## Preveri se

? Koliko je $\det \begin{bmatrix} 3 & 2 \\ 1 & 4 \end{bmatrix}$?
- $14$
+ $10$
- $5$
> $3 \cdot 4 - 2 \cdot 1 = 12 - 2 = 10$. Odgovor $14$ dobiš, če produkta sešteješ namesto odšteješ.

? Matrika $A$ je velikosti $2 \times 3$, matrika $B$ pa $3 \times 4$. Kakšne velikosti je $AB$?
+ $2 \times 4$
- $3 \times 3$
- produkt ne obstaja
> Notranji dimenziji ($3$ in $3$) se ujemata, zunanji dimenziji $2$ in $4$ pa dasta velikost produkta.

? Za matriko $A$ reda $3$ velja $\det A = 5$. Koliko je $\det(2A)$?
- $10$
~ Tako bi bilo, če bi z $2$ pomnožili le eno vrstico.
- $30$
~ Faktor $2$ ne množimo s številom vrstic, ampak ga potenciramo: $2^3$.
+ $40$
> Vsako od treh vrstic pomnožimo z $2$, zato $\det(2A) = 2^3 \cdot 5 = 40$.

? Katera od matrik **ni** obrnljiva?
- $\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$
+ $\begin{bmatrix} 2 & 4 \\ 1 & 2 \end{bmatrix}$
- $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$
> Determinanta je $2 \cdot 2 - 4 \cdot 1 = 0$; vrstici sta sorazmerni. Ostali imata determinanti $3$ in $-1$.

:::simboli
A, B | matriki | |
a_{ij} | element matrike A v i-ti vrstici in j-tem stolpcu | |
b_{ij} | element matrike B v i-ti vrstici in j-tem stolpcu | |
i | indeks vrstice | |
j | indeks stolpca | |
k | indeks seštevanja pri množenju matrik | | | teče od 1 do n
n | število stolpcev (red kvadratne matrike) | |
a | element matrike A | | | brez indeksov: element matrike reda 2
b | element matrike B | | | brez indeksov: element matrike reda 2
c, d | elementa matrike reda 2 | |
\lambda | število, s katerim množimo matriko | |
\vec{x} | vektor neznank sistema | \vec{x} = A^{-1}\vec{b} |
\vec{b} | vektor desnih strani sistema | |
C_{ij} | kofaktor (algebrski komplement) elementa a_ij | C_{ij} = (-1)^{i+j} M_{ij} |
C_{1j} | kofaktor elementa a_1j v prvi vrstici | C_{1j} = (-1)^{1+j} M_{1j} | | razvoj determinante po prvi vrstici
M_{ij} | poddeterminanta brez i-te vrstice in j-tega stolpca | |
\sigma | permutacija množice {1, …, n} | | | sgn(σ) = ±1 je predznak permutacije
S_n | množica vseh permutacij n elementov | | | ima n! elementov
T | oznaka za transponiranje | | | A^T: vrstice zapišemo kot stolpce
:::
