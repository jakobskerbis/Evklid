---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Matrika $A$ velikosti $n \times n$ predstavlja linearno preslikavo: vektor $\vec{x}$ preslika v $A\vec{x}$. Navadno se pri tem vektorju spremenita dolžina in smer. Obstajajo pa posebne smeri, v katerih matrika vektor le raztegne ali skrči (morda obrne), ne zasuka pa ga. Take vektorje imenujemo **lastni vektorji**, faktor raztega pa **lastna vrednost**.

Ko poznamo lastne vektorje in lastne vrednosti, postane zapleten problem preprost: v bazi iz lastnih vektorjev je matrika **diagonalna**, z diagonalno matriko pa računamo skoraj tako lahko kot s števili. Zato se lastne vrednosti pojavijo povsod:

- v **kemiji**: energije molekulskih orbital (Hücklova metoda) in nihajne frekvence molekul so lastne vrednosti matrik,
- v **biologiji**: dolgoročna rast populacije je največja lastna vrednost Lesliejeve matrike, ravnotežje Markovske verige je lastni vektor za lastno vrednost $1$,
- v **tehniki**: lastne frekvence nihanja zgradb in strojev, glavne napetosti v nosilcu,
- v **statistiki**: metoda glavnih komponent iz lastnih vektorjev kovariančne matrike,
- pri **sistemih diferencialnih enačb** $\dot{\vec{x}} = A\vec{x}$, ki opisujejo kemijsko kinetiko in farmakokinetiko.

Predznanje: matrike, množenje matrik, determinante in reševanje homogenih sistemov linearnih enačb.

## Razlaga

**1. Definicija.** Naj bo $A$ kvadratna matrika reda $n$. Število $\lambda$ je **lastna vrednost** matrike $A$, če obstaja **neničelni** vektor $\vec{v}$, za katerega je

$$A\vec{v} = \lambda\vec{v}.$$

Vektor $\vec{v}$ je **lastni vektor** za lastno vrednost $\lambda$. Ničelni vektor po dogovoru ni lastni vektor (zanj enakost velja pri vsakem $\lambda$). Če je $\vec{v}$ lastni vektor, je lastni vektor tudi vsak njegov neničelni večkratnik $c\vec{v}$; lastni vektor je torej določen le do faktorja natančno, pomembna je **smer**.

**2. Karakteristični polinom.**

**Izrek.** Naj bo $A$ kvadratna matrika reda $n$. Število $\lambda$ je lastna vrednost matrike $A$ natanko tedaj, ko je $\det(A - \lambda I) = 0$.

*Dokaz.* Enakost $A\vec{v} = \lambda\vec{v}$ prepišemo v homogeni sistem

$$(A - \lambda I)\vec{v} = \vec{0},$$

kjer je $I$ enotska matrika. Homogeni sistem ima neničelno rešitev natanko tedaj, ko je matrika sistema singularna, torej ko je njena determinanta nič. Zato je $\lambda$ lastna vrednost natanko tedaj, ko

$$p_A(\lambda) = \det(A - \lambda I) = 0. \qquad \square$$

Funkcija $p_A(\lambda)$ je polinom stopnje $n$ v $\lambda$, imenujemo ga **karakteristični polinom**, enačbo $p_A(\lambda) = 0$ pa **karakteristična enačba**. (Nekateri učbeniki pišejo $\det(\lambda I - A)$; ta se razlikuje le za faktor $(-1)^n$, ničle so iste.) Matrika reda $n$ ima zato največ $n$ različnih lastnih vrednosti; nad kompleksnimi števili ima, šteto z večkratnostmi, točno $n$ lastnih vrednosti.

**3. Matrike $2 \times 2$.** Za $A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$ je

$$p_A(\lambda) = \begin{vmatrix} a - \lambda & b \\ c & d - \lambda \end{vmatrix} = \lambda^2 - (a + d)\lambda + (ad - bc) = \lambda^2 - \operatorname{sl}(A)\,\lambda + \det A,$$

kjer je $\operatorname{sl}(A) = a + d$ **sled** matrike (vsota diagonalnih elementov). Če sta $\lambda_1, \lambda_2$ ničli (lahko enaki ali kompleksni), je $p_A(\lambda) = (\lambda - \lambda_1)(\lambda - \lambda_2) = \lambda^2 - (\lambda_1 + \lambda_2)\lambda + \lambda_1\lambda_2$; primerjava koeficientov (Vietovi formuli) da $\lambda_1 + \lambda_2 = \operatorname{sl}(A)$ in $\lambda_1\lambda_2 = \det A$. Splošno velja za matrike reda $n$: vsota lastnih vrednosti (šteto z algebraičnimi večkratnostmi) je enaka sledi, produkt pa determinanti. To je dober preizkus računa.

:::premisli
Kateri sta lastni vrednosti matrike $\begin{pmatrix} 1 & 2 \\ 2 & 4 \end{pmatrix}$, ne da bi reševal karakteristično enačbo?
---
Determinanta je $4 - 4 = 0$, zato je ena lastna vrednost $0$. Sled je $5$, zato je druga $5 - 0 = 5$.
:::

**4. Postopek.**

1. Izračunaj karakteristični polinom $\det(A - \lambda I)$.
2. Poišči njegove ničle $\lambda_1, \lambda_2, \dots$
3. Za vsako $\lambda_k$ reši homogeni sistem $(A - \lambda_kI)\vec{v} = \vec{0}$, na primer z Gaussovo eliminacijo. Ker je matrika singularna, ima sistem neskončno rešitev; zapiši jih s parametri.
4. Preveri: $A\vec{v} = \lambda\vec{v}$.

Vse rešitve sistema v koraku 3 (skupaj z ničelnim vektorjem) tvorijo **lastni podprostor** $E_\lambda = \ker(A - \lambda I)$, jedro matrike $A - \lambda I$.

**5. Večkratnosti.** Naj bo $\lambda$ lastna vrednost matrike $A$. **Algebraična večkratnost** lastne vrednosti je njena večkratnost kot ničle karakterističnega polinoma. **Geometrična večkratnost** je razsežnost lastnega podprostora, torej največje število linearno neodvisnih lastnih vektorjev zanjo. Vedno velja

$$1 \le \text{geometrična večkratnost} \le \text{algebraična večkratnost}.$$

**6. Posebni primeri.** Pri **trikotni** (in diagonalni) matriki so lastne vrednosti kar diagonalni elementi, ker je determinanta trikotne matrike produkt diagonale. Matrika je **obrnljiva** natanko tedaj, ko $0$ ni njena lastna vrednost, ker je $\det A = p_A(0)$. Če je $A\vec{v} = \lambda\vec{v}$, je $A^k\vec{v} = \lambda^k\vec{v}$ za vsak naravni $k$: res je $A^2\vec{v} = A(\lambda\vec{v}) = \lambda A\vec{v} = \lambda^2\vec{v}$, naprej z indukcijo. Za obrnljivo matriko enakost $A\vec{v} = \lambda\vec{v}$ pomnožimo z $A^{-1}$ in dobimo $\vec{v} = \lambda A^{-1}\vec{v}$, torej $A^{-1}\vec{v} = \lambda^{-1}\vec{v}$ (tu je $\lambda \neq 0$). Realna matrika ima lahko kompleksne lastne vrednosti: matrika zasuka ravnine za kot $\varphi$ (ki ni večkratnik $\pi$) nima realnega lastnega vektorja, njeni lastni vrednosti sta $\cos\varphi \pm i\sin\varphi$.

**7. Diagonalizacija.** Matrika $A$ reda $n$ je **diagonalizabilna**, če obstajata obrnljiva matrika $P$ in diagonalna matrika $D$, da je

$$A = PDP^{-1} \quad\text{oziroma}\quad P^{-1}AP = D.$$

**Izrek.** Matrika $A$ reda $n$ je diagonalizabilna natanko tedaj, ko ima $n$ linearno neodvisnih lastnih vektorjev. Tedaj so stolpci matrike $P$ lastni vektorji $\vec{v}_1, \dots, \vec{v}_n$, na diagonali matrike $D$ pa so pripadajoče lastne vrednosti **v istem vrstnem redu**:

$$P = \begin{pmatrix} \vec{v}_1 & \vec{v}_2 & \cdots & \vec{v}_n \end{pmatrix}, \qquad D = \begin{pmatrix} \lambda_1 & & \\ & \ddots & \\ & & \lambda_n \end{pmatrix}.$$

*Dokaz.* Enakost $A = PDP^{-1}$ je enakovredna $AP = PD$. Njen $j$-ti stolpec na levi je $A\vec{v}_j$, na desni pa $\lambda_j\vec{v}_j$, zato $AP = PD$ pomeni natanko $A\vec{v}_j = \lambda_j\vec{v}_j$ za vse $j$. Matrika $P$ je obrnljiva natanko tedaj, ko so njeni stolpci linearno neodvisni. $\square$

Zadostni pogoji za diagonalizabilnost:

- matrika ima $n$ **različnih** lastnih vrednosti (lastni vektorji za različne lastne vrednosti so linearno neodvisni),
- matrika je realna in **simetrična** ($A^T = A$): tedaj so vse lastne vrednosti realne, lastni vektorji za različne lastne vrednosti pa pravokotni; obstajata ortogonalna matrika $Q$ ($Q^TQ = I$) in diagonalna $D$, da je $A = QDQ^T$ (**spektralni izrek**).

**Izrek.** Naj bodo $\vec{v}_1, \dots, \vec{v}_k$ lastni vektorji matrike $A$ za paroma različne lastne vrednosti $\lambda_1, \dots, \lambda_k$. Tedaj so linearno neodvisni.

*Dokaz* z indukcijo po $k$. Za $k = 1$ je trditev očitna, ker je $\vec{v}_1 \ne \vec{0}$. Naj velja za $k - 1$ vektorjev in naj bo $c_1\vec{v}_1 + \dots + c_k\vec{v}_k = \vec{0}$. Enakost pomnožimo z $A$ in posebej z $\lambda_k$ ter ju odštejemo: $c_1(\lambda_1 - \lambda_k)\vec{v}_1 + \dots + c_{k-1}(\lambda_{k-1} - \lambda_k)\vec{v}_{k-1} = \vec{0}$. Po indukcijski predpostavki so vsi koeficienti nič, ker pa je $\lambda_i \ne \lambda_k$, je $c_1 = \dots = c_{k-1} = 0$. Ostane $c_k\vec{v}_k = \vec{0}$, torej $c_k = 0$. $\square$

**Pravokotnost pri simetrični matriki.** Naj bo $A^T = A$, $A\vec{u} = \lambda\vec{u}$, $A\vec{w} = \mu\vec{w}$ in $\lambda \ne \mu$. Ker je $(A\vec{u}) \cdot \vec{w} = (A\vec{u})^T\vec{w} = \vec{u}^TA^T\vec{w} = \vec{u} \cdot (A\vec{w})$, velja $\lambda\,\vec{u} \cdot \vec{w} = \mu\,\vec{u} \cdot \vec{w}$, torej $(\lambda - \mu)\,\vec{u} \cdot \vec{w} = 0$ in $\vec{u} \cdot \vec{w} = 0$. $\square$

Kadar je pri neki lastni vrednosti geometrična večkratnost manjša od algebraične, matrika **ni** diagonalizabilna. Primer: $\begin{pmatrix} 2 & 1 \\ 0 & 2 \end{pmatrix}$ ima dvojno lastno vrednost $2$, lastni podprostor pa je le premica s smernim vektorjem $(1, 0)$.

:::premisli
Tudi $\begin{pmatrix} 2 & 0 \\ 0 & 2 \end{pmatrix}$ ima dvojno lastno vrednost $2$. Je diagonalizabilna?
---
Je, saj je že diagonalna. Tu je $A - 2I$ ničelna matrika, zato je vsak neničelni vektor lastni in $\dim E_2 = 2$: geometrična večkratnost je enaka algebraični. Odloča razsežnost $E_\lambda$, ne večkratnost ničle.
:::

**8. Zakaj je diagonalizacija uporabna.** Potence: $A^k = PD^kP^{-1}$, kjer je $D^k$ diagonalna z elementi $\lambda_i^k$. Podobno za sistem diferencialnih enačb $\dot{\vec{x}} = A\vec{x}$: v novih spremenljivkah $\vec{y} = P^{-1}\vec{x}$ se sistem razpade na neodvisne enačbe $\dot{y}_i = \lambda_iy_i$ z rešitvami $y_i = y_i(0)e^{\lambda_it}$. Lastne vrednosti torej povedo, kako hitro posamezne »komponente« rastejo ali pojemajo.

## Rešeni primeri

### Primer 1 (lažji)

Poišči lastne vrednosti in lastne vektorje matrike $A = \begin{pmatrix} 4 & 1 \\ 2 & 3 \end{pmatrix}$.

**Podatki:** $A = \begin{pmatrix} 4 & 1 \\ 2 & 3 \end{pmatrix}$, matrika reda $2$
**Iščemo:** lastni vrednosti $\lambda_1$, $\lambda_2$ in pripadajoča lastna vektorja

:::formula
$\det(A - \lambda I) = \lambda^2 - \operatorname{sl}(A)\,\lambda + \det A = 0$, nato $(A - \lambda I)\vec{v} = \vec{0}$
:::

**Rešitev:**

1. $\operatorname{sl}(A) = 4 + 3 = 7$, $\det A = 4 \cdot 3 - 1 \cdot 2 = 10$, zato $p_A(\lambda) = \lambda^2 - 7\lambda + 10 = (\lambda - 5)(\lambda - 2)$.
2. Lastni vrednosti: $\lambda_1 = 5$, $\lambda_2 = 2$. Preizkus: $5 + 2 = 7 = \operatorname{sl}(A)$, $5 \cdot 2 = 10 = \det A$ ✓.
3. Za $\lambda_1 = 5$: $A - 5I = \begin{pmatrix} -1 & 1 \\ 2 & -2 \end{pmatrix}$. Enačba $-v_1 + v_2 = 0$ da $v_2 = v_1$, torej $\vec{v}_1 = (1, 1)$.
4. Za $\lambda_2 = 2$: $A - 2I = \begin{pmatrix} 2 & 1 \\ 2 & 1 \end{pmatrix}$. Enačba $2v_1 + v_2 = 0$ da $v_2 = -2v_1$, torej $\vec{v}_2 = (1, -2)$.
5. Preizkus: $A(1, 1)^T = (5, 5)^T = 5\,(1, 1)^T$ in $A(1, -2)^T = (2, -4)^T = 2\,(1, -2)^T$ ✓.
6. Odgovor: lastni vrednosti sta $5$ in $2$; lastni vektorji za $5$ so neničelni večkratniki vektorja $(1, 1)$, za $2$ pa neničelni večkratniki vektorja $(1, -2)$.

### Primer 2

Molekula se lahko nahaja v dveh oblikah, $\mathrm{A}$ in $\mathrm{B}$. V vsakem časovnem koraku $10\,\%$ molekul oblike $\mathrm{A}$ preide v $\mathrm{B}$, $20\,\%$ molekul oblike $\mathrm{B}$ pa v $\mathrm{A}$. Deleže $\vec{x}_k = (a_k, b_k)$ po $k$ korakih opisuje $\vec{x}_{k+1} = M\vec{x}_k$. Diagonaliziraj matriko $M$, izračunaj deleža po $10$ korakih, če je na začetku vse v obliki $\mathrm{A}$, in poišči ravnotežno stanje.

**Podatki:** prehod $\mathrm{A} \to \mathrm{B}$: $10\,\%$ na korak, prehod $\mathrm{B} \to \mathrm{A}$: $20\,\%$ na korak, $M = \begin{pmatrix} 0{,}9 & 0{,}2 \\ 0{,}1 & 0{,}8 \end{pmatrix}$, $\vec{x}_0 = (1, 0)$, $k = 10$
**Iščemo:** $P$ in $D$, da je $M = PDP^{-1}$, vektor $\vec{x}_{10}$ in ravnotežno stanje $\vec{x}_\infty$

:::formula
$M = PDP^{-1}$, $\vec{x}_k = M^k\vec{x}_0 = PD^kP^{-1}\vec{x}_0 = c_1\lambda_1^k\vec{v}_1 + c_2\lambda_2^k\vec{v}_2$
:::

**Rešitev:**

1. $\operatorname{sl}(M) = 1{,}7$, $\det M = 0{,}72 - 0{,}02 = 0{,}70$, zato $p_M(\lambda) = \lambda^2 - 1{,}7\lambda + 0{,}7 = (\lambda - 1)(\lambda - 0{,}7)$.
2. Za $\lambda_1 = 1$: $M - I = \begin{pmatrix} -0{,}1 & 0{,}2 \\ 0{,}1 & -0{,}2 \end{pmatrix}$, od tod $v_1 = 2v_2$ in $\vec{v}_1 = (2, 1)$. Za $\lambda_2 = 0{,}7$: $M - 0{,}7I = \begin{pmatrix} 0{,}2 & 0{,}2 \\ 0{,}1 & 0{,}1 \end{pmatrix}$, od tod $\vec{v}_2 = (1, -1)$.
3. $P = \begin{pmatrix} 2 & 1 \\ 1 & -1 \end{pmatrix}$, $D = \begin{pmatrix} 1 & 0 \\ 0 & 0{,}7 \end{pmatrix}$.
4. Začetni vektor v bazi lastnih vektorjev: $c_1(2, 1) + c_2(1, -1) = (1, 0)$ da $c_1 = c_2 = 1/3$.
5. $\vec{x}_{10} = \tfrac{1}{3}(2, 1) + \tfrac{1}{3}\,0{,}7^{10}\,(1, -1)$. Ker je $0{,}7^{10} \approx 0{,}0282$, je $\vec{x}_{10} \approx (0{,}676;\,0{,}324)$.
6. Ko $k \to \infty$, gre $0{,}7^k \to 0$, zato $\vec{x}_\infty = (2/3, 1/3)$; to je lastni vektor za $\lambda = 1$, normiran tako, da je vsota deležev $1$.
7. Odgovor: $M = PDP^{-1}$ s $P = \begin{pmatrix} 2 & 1 \\ 1 & -1 \end{pmatrix}$ in $D = \operatorname{diag}(1;\,0{,}7)$; po $10$ korakih je v obliki $\mathrm{A}$ okoli $67{,}6\,\%$, v obliki $\mathrm{B}$ okoli $32{,}4\,\%$ molekul; v ravnotežju sta deleža $2/3$ in $1/3$.

### Primer 3 (težji)

Poišči karakteristični polinom, lastne vrednosti in lastne podprostore matrike $A = \begin{pmatrix} 3 & 1 & 1 \\ 1 & 3 & 1 \\ 1 & 1 & 3 \end{pmatrix}$. Ali je matrika diagonalizabilna? Če je, zapiši $P$ in $D$, nato izračunaj $A^n$ za vsak naravni $n$ in $A^{-1}$.

**Podatki:** $A = \begin{pmatrix} 3 & 1 & 1 \\ 1 & 3 & 1 \\ 1 & 1 & 3 \end{pmatrix}$, simetrična matrika reda $3$
**Iščemo:** $p_A(\lambda)$, lastne vrednosti z večkratnostmi, lastne podprostore, matriki $P$ in $D$, $A^n$ in $A^{-1}$

:::formula
$p_A(\lambda) = \det(A - \lambda I)$; diagonalizabilna $\iff$ za vsako $\lambda$ je $\dim E_\lambda$ enaka algebraični večkratnosti. Na lastnem vektorju za $\lambda$ deluje $A^n$ kot množenje z $\lambda^n$.
:::

**Rešitev:**

1. Označimo $\mu = 3 - \lambda$. Tedaj $\det(A - \lambda I) = \begin{vmatrix} \mu & 1 & 1 \\ 1 & \mu & 1 \\ 1 & 1 & \mu \end{vmatrix} = \mu^3 - 3\mu + 2 = (\mu - 1)^2(\mu + 2)$ (po Sarrusovem pravilu: $\mu^3 + 1 + 1 - \mu - \mu - \mu$).
2. Nazaj v $\lambda$: $\mu - 1 = 2 - \lambda$ in $\mu + 2 = 5 - \lambda$, torej $p_A(\lambda) = (2 - \lambda)^2(5 - \lambda) = -\lambda^3 + 9\lambda^2 - 24\lambda + 20$.
3. Lastni vrednosti: $\lambda_1 = 5$ (enkratna), $\lambda_2 = 2$ (dvojna). Preizkus: $5 + 2 + 2 = 9 = \operatorname{sl}(A)$, $5 \cdot 2 \cdot 2 = 20 = \det A$ ✓.
4. Za $\lambda = 5$: $A - 5I = \begin{pmatrix} -2 & 1 & 1 \\ 1 & -2 & 1 \\ 1 & 1 & -2 \end{pmatrix}$. Vsota vrstic je nič, z eliminacijo dobimo $x = y = z$, torej $E_5 = \operatorname{Lin}\{(1, 1, 1)\}$.
5. Za $\lambda = 2$: $A - 2I$ ima vse elemente enake $1$, zato je sistem ena sama enačba $x + y + z = 0$. Rešitve imajo dva parametra: $E_2 = \operatorname{Lin}\{(1, -1, 0), (1, 0, -1)\}$, $\dim E_2 = 2$.
6. Geometrični večkratnosti sta enaki algebraičnima ($1$ in $2$), skupaj imamo tri linearno neodvisne lastne vektorje, zato je $A$ diagonalizabilna (kar smo pričakovali, ker je simetrična).
7. Za potence zapišemo $A = 2I + J$, kjer ima $J$ vse elemente enake $1$. Velja $J(1, 1, 1)^T = 3\,(1, 1, 1)^T$ in $J\vec{w} = \vec{0}$ za vsak $\vec{w} \in E_2$, ker je vsota komponent takega $\vec{w}$ enaka $0$.
8. Iščemo $A^n$ v obliki $2^nI + \gamma J$. Na $E_2$ ta matrika deluje kot množenje z $2^n$ pri vsakem $\gamma$, na $(1, 1, 1)$ pa kot množenje z $2^n + 3\gamma$, kar mora biti $5^n$. Torej $\gamma = \frac{5^n - 2^n}{3}$. Matriki, ki se ujemata na bazi iz lastnih vektorjev, sta enaki, zato $A^n = 2^nI + \frac{5^n - 2^n}{3}J$.
9. Preizkus pri $n = 2$: formula da $A^2 = 4I + 7J$, torej diagonalne elemente $11$ in ostale $7$. Neposredno: $3 \cdot 3 + 1 \cdot 1 + 1 \cdot 1 = 11$ in $3 \cdot 1 + 1 \cdot 3 + 1 \cdot 1 = 7$ ✓.
10. Ker $0$ ni lastna vrednost, je $A$ obrnljiva; $A^{-1}$ ima iste lastne vektorje z lastnima vrednostma $\frac{1}{5}$ in $\frac{1}{2}$, zato isti razmislek velja za $n = -1$: $A^{-1} = \frac{1}{2}I + \frac{1}{3}\left(\frac{1}{5} - \frac{1}{2}\right)J = \frac{1}{2}I - \frac{1}{10}J$. Preizkus z $J^2 = 3J$: $(2I + J)\left(\frac{1}{2}I - \frac{1}{10}J\right) = I - \frac{1}{5}J + \frac{1}{2}J - \frac{3}{10}J = I$ ✓.
11. Odgovor: $p_A(\lambda) = -(\lambda - 5)(\lambda - 2)^2$, $A = PDP^{-1}$ s $P = \begin{pmatrix} 1 & 1 & 1 \\ 1 & -1 & 0 \\ 1 & 0 & -1 \end{pmatrix}$ in $D = \operatorname{diag}(5, 2, 2)$. Lastna vektorja za $2$ sta pravokotna na $(1, 1, 1)$, kot zagotavlja spektralni izrek. Velja $A^n = 2^nI + \frac{5^n - 2^n}{3}J$ in $A^{-1} = \frac{1}{2}I - \frac{1}{10}J$: diagonalni elementi inverza so $\frac{2}{5}$, ostali $-\frac{1}{10}$.

## Pogoste napake

- **Ničelni vektor kot lastni vektor.** Sistem $(A - \lambda I)\vec{v} = \vec{0}$ ima vedno rešitev $\vec{0}$; ta ni lastni vektor. Če pri lastni vrednosti dobiš le ničelno rešitev, si se zmotil v $\lambda$ ali v računu.
- **Lastne vrednosti iz diagonale netrikotne matrike.** Diagonalni elementi so lastne vrednosti le pri trikotni ali diagonalni matriki. Pri $\begin{pmatrix} 4 & 1 \\ 2 & 3 \end{pmatrix}$ sta lastni vrednosti $5$ in $2$, ne $4$ in $3$.
- **$\lambda$ odšteta povsod.** V $A - \lambda I$ odštejemo $\lambda$ samo na diagonali, ne od vseh elementov.
- **Napačen vrstni red v $P$ in $D$.** $i$-ti stolpec matrike $P$ mora biti lastni vektor za $i$-ti diagonalni element matrike $D$.
- **Vsaka matrika je diagonalizabilna.** Ni. Pri večkratni lastni vrednosti preveri razsežnost lastnega podprostora.
- **Lastne vrednosti vsote in produkta.** Lastne vrednosti $A + B$ v splošnem niso vsote lastnih vrednosti matrik $A$ in $B$; to velja le v posebnih primerih (npr. $A + cI$ ima lastne vrednosti $\lambda + c$).

## Povzetek

- $A\vec{v} = \lambda\vec{v}$, $\vec{v} \ne \vec{0}$; lastne vrednosti so ničle karakterističnega polinoma $p_A(\lambda) = \det(A - \lambda I)$.
- Lastni vektorji za $\lambda$: neničelne rešitve $(A - \lambda I)\vec{v} = \vec{0}$; lastni podprostor $E_\lambda$.
- Vsota lastnih vrednosti je sled, produkt je determinanta; trikotna matrika ima lastne vrednosti na diagonali.
- Diagonalizacija $A = PDP^{-1}$: stolpci $P$ so lastni vektorji, $D$ ima lastne vrednosti na diagonali; mogoča natanko pri $n$ linearno neodvisnih lastnih vektorjih.
- Različne lastne vrednosti ali simetrična matrika zagotavljajo diagonalizabilnost; simetrična: $A = QDQ^T$ z ortogonalno $Q$.
- Uporaba: $A^k = PD^kP^{-1}$, sistemi $\dot{\vec{x}} = A\vec{x}$, ravnotežja Markovskih verig.

## Za izpit

Znati moraš povedati:

- definicijo lastne vrednosti, lastnega vektorja (neničelnega) in lastnega podprostora $E_\lambda = \ker(A - \lambda I)$;
- izrek: $\lambda$ je lastna vrednost natanko tedaj, ko je $\det(A - \lambda I) = 0$, z dokazom;
- definiciji algebraične in geometrične večkratnosti ter neenakost med njima;
- izrek o linearni neodvisnosti lastnih vektorjev za različne lastne vrednosti z dokazom;
- definicijo diagonalizabilnosti in izrek, da je $A$ diagonalizabilna natanko tedaj, ko ima $n$ linearno neodvisnih lastnih vektorjev (dokaz z $AP = PD$);
- spektralni izrek za realne simetrične matrike in dokaz pravokotnosti lastnih vektorjev.

### Naloga 1

Za katere vrednosti realnega parametra $a$ je matrika $A = \begin{pmatrix} 1 & a & 1 \\ 0 & 2 & 1 \\ 0 & 0 & 1 \end{pmatrix}$ diagonalizabilna? Za te vrednosti zapiši obrnljivo matriko $P$ in diagonalno matriko $D$, da je $A = PDP^{-1}$. Za $a = 1$ izračunaj še $A^n$ za vsak naravni $n$.

**Rešitev:**

1. Matrika je zgornje trikotna, zato je $p_A(\lambda) = (1 - \lambda)^2(2 - \lambda)$: lastna vrednost $1$ je dvojna, $2$ enojna (za vsak $a$).
2. Pri enojni lastni vrednosti je geometrična večkratnost vedno $1$, zato odloča le $\lambda = 1$: potrebujemo $\dim E_1 = 2$.
3. $A - I = \begin{pmatrix} 0 & a & 1 \\ 0 & 1 & 1 \\ 0 & 0 & 0 \end{pmatrix}$. Vrstici $(0, a, 1)$ in $(0, 1, 1)$ sta linearno odvisni natanko tedaj, ko je $a = 1$.
4. Za $a \neq 1$ je rang $A - I$ enak $2$, torej $\dim E_1 = 3 - 2 = 1 < 2$: matrika ni diagonalizabilna.
5. Za $a = 1$ je rang $1$ in sistem je ena enačba $y + z = 0$, $x$ je prost: $E_1 = \operatorname{Lin}\{(1, 0, 0), (0, 1, -1)\}$, $\dim E_1 = 2$.
6. $E_2$ pri $a = 1$: $A - 2I = \begin{pmatrix} -1 & 1 & 1 \\ 0 & 0 & 1 \\ 0 & 0 & -1 \end{pmatrix}$ da $z = 0$ in $y = x$, torej $E_2 = \operatorname{Lin}\{(1, 1, 0)\}$.
7. $P = \begin{pmatrix} 1 & 0 & 1 \\ 0 & 1 & 1 \\ 0 & -1 & 0 \end{pmatrix}$, $D = \operatorname{diag}(1, 1, 2)$. Preizkus: $\det P = 1 \neq 0$, $A(0, 1, -1)^T = (0, 1, -1)^T$ in $A(1, 1, 0)^T = (2, 2, 0)^T$ ✓.
8. Potenca pri $a = 1$: naj bo $B = A - I = \begin{pmatrix} 0 & 1 & 1 \\ 0 & 1 & 1 \\ 0 & 0 & 0 \end{pmatrix}$. Na $E_1$ deluje $B$ kot množenje z $0$, na $(1, 1, 0)$ pa kot množenje z $1$. Matrika $I + \gamma B$ zato deluje na $E_1$ kot množenje z $1 = 1^n$, na $(1, 1, 0)$ pa kot množenje z $1 + \gamma$, kar mora biti $2^n$. Torej $\gamma = 2^n - 1$, in ker se matriki ujemata na bazi iz lastnih vektorjev, je $A^n = I + (2^n - 1)B = \begin{pmatrix} 1 & 2^n - 1 & 2^n - 1 \\ 0 & 2^n & 2^n - 1 \\ 0 & 0 & 1 \end{pmatrix}$.
9. Preizkus pri $n = 2$: $A^2 = \begin{pmatrix} 1 & 3 & 3 \\ 0 & 4 & 3 \\ 0 & 0 & 1 \end{pmatrix}$, neposredno na primer element $(1, 2)$: $1 \cdot 1 + 1 \cdot 2 + 1 \cdot 0 = 3$ ✓.
10. Odgovor: matrika je diagonalizabilna natanko za $a = 1$; tedaj je $A = PDP^{-1}$ z zgornjima $P$ in $D$ ter $A^n = I + (2^n - 1)(A - I)$.

### Naloga 2

Naj bo $A$ kvadratna matrika reda $n$. Dokaži, da imata $A$ in $A^T$ enak karakteristični polinom, in utemelji, ali imata tudi enake lastne vektorje. Nato za obrnljivo $A$ dokaži: $\vec{v}$ je lastni vektor matrike $A$ za $\lambda$ natanko tedaj, ko je lastni vektor matrike $A^{-1}$ za $\frac{1}{\lambda}$.

**Rešitev:**

1. Ker je $\det M^T = \det M$ in $(A - \lambda I)^T = A^T - \lambda I$, je $p_{A^T}(\lambda) = \det\big((A - \lambda I)^T\big) = \det(A - \lambda I) = p_A(\lambda)$. Lastne vrednosti z algebraičnimi večkratnostmi so torej enake.
2. Lastni vektorji pa so lahko različni. Za $A = \begin{pmatrix} 1 & 1 \\ 0 & 2 \end{pmatrix}$ in $\lambda = 1$ da $A - I$ enačbo $y = 0$, lastni vektor je $(1, 0)$. Za $A^T = \begin{pmatrix} 1 & 0 \\ 1 & 2 \end{pmatrix}$ da $A^T - I$ enačbo $x + y = 0$, lastni vektor je $(1, -1)$; $(1, 0)$ to ni, saj je $A^T(1, 0)^T = (1, 1)^T$.
3. Naj bo $A$ obrnljiva. Ker je $p_A(0) = \det A \neq 0$, nobena lastna vrednost ni $0$, zato $\frac{1}{\lambda}$ obstaja.
4. Iz $A\vec{v} = \lambda\vec{v}$ z množenjem z $A^{-1}$ sledi $\vec{v} = \lambda A^{-1}\vec{v}$, torej $A^{-1}\vec{v} = \frac{1}{\lambda}\vec{v}$, $\vec{v} \neq \vec{0}$.
5. Obratno uporabimo isti sklep za $A^{-1}$, katere inverz je $A$, in lastno vrednost $\frac{1}{\lambda}$: dobimo $A\vec{v} = \lambda\vec{v}$.
6. Odgovor: $A$ in $A^T$ imata enak karakteristični polinom in enake lastne vrednosti, ne pa nujno enakih lastnih vektorjev; $A$ in $A^{-1}$ imata iste lastne vektorje z recipročnimi lastnimi vrednostmi.

## Drugače: Na sliki

Preslikava z matriko $A = \begin{pmatrix} 4 & 1 \\ 2 & 3 \end{pmatrix}$ iz Primera 1 enotsko krožnico preslika v elipso. Večina vektorjev se pri tem zasuka. Dve smeri ostaneta nespremenjeni:

```
              y
              |      A·(1,1) = (5,5): ista smer, 5-krat daljši
              |    ↗
              |  ↗ (1,1)
   -----------+------------- x
              |\
              | \ (1,-2)
              |  \
              |   ↘ A·(1,-2) = (2,-4): ista smer, 2-krat daljši
```

Premica skozi $(1, 1)$ se preslika sama vase in se raztegne s faktorjem $5$, premica skozi $(1, -2)$ s faktorjem $2$. V koordinatnem sistemu, katerega osi kažeta v teh dveh smereh, je preslikava le razteg vzdolž osi, to pa je ravno diagonalna matrika $D = \operatorname{diag}(5, 2)$.

Pri negativni lastni vrednosti bi se vektor na svoji premici obrnil, pri lastni vrednosti $0$ pa bi se cela premica stisnila v izhodišče.

## Drugače: Uporaba v stroki

**Kvantna kemija.** Po Hücklovi metodi so energije orbital $\pi$ v etenu lastne vrednosti matrike $\begin{pmatrix} \alpha & \beta \\ \beta & \alpha \end{pmatrix}$, kjer je $\alpha$ energija orbitale $p$ na ogljiku in $\beta < 0$ integral interakcije med sosednjima atomoma. Karakteristična enačba $(\alpha - E)^2 - \beta^2 = 0$ da $E = \alpha \pm \beta$: lastni vektor $(1, 1)$ je vezna orbitala z nižjo energijo $\alpha + \beta$, $(1, -1)$ pa protivezna. Programi za kvantno kemijo rešujejo enak problem lastnih vrednosti z matrikami reda več tisoč.

**Relaksacijska kinetika.** Za ravnotežje $\mathrm{A} \rightleftharpoons \mathrm{B}$ s konstantama $k_1$ (naprej) in $k_2$ (nazaj) koncentracije zadoščajo $\dot{\vec{x}} = K\vec{x}$ s $K = \begin{pmatrix} -k_1 & k_2 \\ k_1 & -k_2 \end{pmatrix}$. Sled je $-(k_1 + k_2)$, determinanta $0$, zato sta lastni vrednosti $0$ in $-(k_1 + k_2)$. Lastni vektor za $0$, $(k_2, k_1)$, je ravnotežna sestava, druga lastna vrednost pa določa relaksacijski čas $\tau = \frac{1}{k_1 + k_2}$. Pri temperaturnem skoku izmerimo $\tau$, iz ravnotežne konstante $K_c = \frac{k_1}{k_2}$ pa nato obe konstanti hitrosti.

**Kemometrija.** Kovariančna matrika spektrov (npr. bližnjih infrardečih pri stotinah valovnih dolžin) je simetrična. Njeni ortogonalni lastni vektorji so **glavne komponente**, delež variance, ki ga pojasni $i$-ta komponenta, pa je $\frac{\lambda_i}{\operatorname{sl}(C)}$. Pogosto dve ali tri komponente ločijo vzorce po izvoru ali kakovosti.

**Infrardeča spektroskopija.** Kvadrati nihajnih krožnih frekvenc molekule $\mathrm{CO_2}$ so lastne vrednosti matrike, ki povezuje sile med atomi z odmiki, lastni vektorji pa **normalni načini nihanja**: simetrično in asimetrično raztezanje ter upogibanje. Pas v IR spektru da le način, pri katerem se spreminja dipolni moment, zato simetrično raztezanje v IR ne vidimo.

## Drugače: Korak za korakom s številkami

Izračunaj $A^5$ za $A = \begin{pmatrix} 4 & 1 \\ 2 & 3 \end{pmatrix}$ z diagonalizacijo.

1. **Iz Primera 1:** $P = \begin{pmatrix} 1 & 1 \\ 1 & -2 \end{pmatrix}$, $D = \begin{pmatrix} 5 & 0 \\ 0 & 2 \end{pmatrix}$.
2. **Inverz:** $\det P = -2 - 1 = -3$, $P^{-1} = \dfrac{1}{-3}\begin{pmatrix} -2 & -1 \\ -1 & 1 \end{pmatrix} = \dfrac{1}{3}\begin{pmatrix} 2 & 1 \\ 1 & -1 \end{pmatrix}$.
3. **Potenca diagonalne matrike:** $D^5 = \begin{pmatrix} 5^5 & 0 \\ 0 & 2^5 \end{pmatrix} = \begin{pmatrix} 3125 & 0 \\ 0 & 32 \end{pmatrix}$.
4. **Produkt $PD^5$:** $\begin{pmatrix} 3125 & 32 \\ 3125 & -64 \end{pmatrix}$.
5. **Pomnoži s $P^{-1}$:** $A^5 = \dfrac{1}{3}\begin{pmatrix} 3125 & 32 \\ 3125 & -64 \end{pmatrix}\begin{pmatrix} 2 & 1 \\ 1 & -1 \end{pmatrix} = \dfrac{1}{3}\begin{pmatrix} 6282 & 3093 \\ 6186 & 3189 \end{pmatrix} = \begin{pmatrix} 2094 & 1031 \\ 2062 & 1063 \end{pmatrix}$.
6. **Preizkus:** sled $A^5$ je $2094 + 1063 = 3157 = 5^5 + 2^5$ ✓, determinanta je $2094 \cdot 1063 - 1031 \cdot 2062 = 10^5 = (\det A)^5$ ✓.

Namesto štirih množenj matrik $2 \times 2$ smo potenco izračunali na številih $5$ in $2$; pri $A^{100}$ je prihranek še večji.

## Drugače: Bolj natančno

**Vsota geometričnih večkratnosti.** Ker so lastni vektorji za različne lastne vrednosti linearno neodvisni, lahko baze vseh lastnih podprostorov združimo v linearno neodvisno množico. (Če je linearna kombinacija združenih baz enaka $\vec{0}$, je to vsota vektorjev iz različnih lastnih podprostorov; po izreku so vsi ti vektorji ničelni, zato so ničelni vsi koeficienti.) Zato je $A$ diagonalizabilna natanko tedaj, ko je vsota geometričnih večkratnosti enaka $n$ (v $\mathbb{R}^n$ ali $\mathbb{C}^n$).

**Podobne matrike.** Matriki $A$ in $B = S^{-1}AS$ imata isti karakteristični polinom: $\det(S^{-1}AS - \lambda I) = \det(S^{-1}(A - \lambda I)S) = \det(A - \lambda I)$. Zato sta sled in determinanta neodvisni od izbire baze. Ker je $p_A(\lambda) = (\lambda_1 - \lambda)\cdots(\lambda_n - \lambda)$, primerjava koeficientov pri $\lambda^{n-1}$ in prostega člena da $\sum\lambda_i = \operatorname{sl}(A)$ in $\prod\lambda_i = \det A$.

**Simetrične matrike.** Naj bo $A^T = A$ realna in $A\vec{v} = \lambda\vec{v}$ s kompleksnim $\vec{v} \ne \vec{0}$. Tedaj je $\bar{\vec{v}}^TA\vec{v} = \lambda\,\bar{\vec{v}}^T\vec{v}$, levo stran pa lahko zapišemo tudi kot $\overline{(A\vec{v})}^T\vec{v} = \bar{\lambda}\,\bar{\vec{v}}^T\vec{v}$. Ker je $\bar{\vec{v}}^T\vec{v} = \sum|v_i|^2 > 0$, je $\lambda = \bar{\lambda}$, torej realna. Pravokotnost za različne lastne vrednosti smo dokazali v razlagi; znotraj večkratnega lastnega podprostora pa ortogonalno bazo dobimo z Gram-Schmidtovim postopkom.

## Preveri se

? Kateri sta lastni vrednosti matrike $\begin{pmatrix} 3 & 5 \\ 0 & -1 \end{pmatrix}$?
+ $3$ in $-1$
- $3$ in $5$
~ $5$ leži izven diagonale; lastne vrednosti trikotne matrike so diagonalni elementi.
- $2$ in $-3$
~ To sta sled in determinanta, ne lastni vrednosti.
> Matrika je zgornje trikotna, zato sta lastni vrednosti diagonalna elementa. $2$ in $-3$ sta sled in determinanta.

? Matrika $2 \times 2$ ima sled $6$ in determinanto $8$. Kateri sta njeni lastni vrednosti?
- $1$ in $8$
~ Produkt je res $8$, vsota pa $9$, ne $6$.
+ $2$ in $4$
- $3$ in $3$
~ Vsota je $6$, produkt pa $9$, ne $8$.
> $\lambda^2 - 6\lambda + 8 = (\lambda - 2)(\lambda - 4)$. Preizkus: $2 + 4 = 6$, $2 \cdot 4 = 8$.

? Katera trditev o kvadratni matriki reda $n$ je vedno pravilna?
- Vsaka matrika z realnimi elementi ima $n$ realnih lastnih vrednosti.
+ Matrika z $n$ različnimi lastnimi vrednostmi je diagonalizabilna.
- Matrika z dvojno lastno vrednostjo ni diagonalizabilna.
> Lastni vektorji za različne lastne vrednosti so linearno neodvisni, zato tvorijo bazo. Matrika zasuka nima realnih lastnih vrednosti, matrika $I$ pa ima dvojno lastno vrednost $1$ in je diagonalna.

? Za vektor $\vec{v}$ velja $A\vec{v} = 3\vec{v}$. Čemu je enako $A^2\vec{v}$?
- $6\vec{v}$
~ Lastna vrednost se pri potenci množi sama s sabo, ne podvoji: $3 \cdot 3$.
- $3\vec{v}$
+ $9\vec{v}$
> $A^2\vec{v} = A(3\vec{v}) = 3A\vec{v} = 9\vec{v}$.

:::simboli
A | kvadratna matrika reda n | |
\vec{v} | lastni vektor matrike A | | | neničelni vektor z A v = λ v
\lambda | lastna vrednost matrike A | | | ničla karakterističnega polinoma
I | enotska matrika | |
p_A | karakteristični polinom matrike A | p_A(\lambda) = \det(A - \lambda I) |
a, b, c, d | elementi matrike A reda 2 | | | c je drugje tudi poljuben neničelni faktor
P | matrika z lastnimi vektorji v stolpcih | P = \begin{pmatrix} \vec{v}_1 & \vec{v}_2 & \cdots & \vec{v}_n \end{pmatrix} | | obrnljiva
D | diagonalna matrika lastnih vrednosti | D = P^{-1}AP | | vrstni red kot stolpci v P
\vec{v}_1, \vec{v}_2, \vec{v}_n | lastni vektorji matrike | |
\lambda_1, \lambda_2, \lambda_n | lastne vrednosti matrike | | | v istem vrstnem redu kot lastni vektorji
M | prehodna matrika (deleži iz koraka v korak) | \vec{x}_{k+1} = M\vec{x}_k | | diagonalizacija: M = PDP⁻¹
\vec{x}_k | vektor deležev po k korakih | \vec{x}_k = M^k\vec{x}_0 |
\vec{x}_0 | začetni vektor deležev | |
k | število korakov | |
c_1, c_2 | koeficienta razvoja x₀ po lastnih vektorjih | |
E_\lambda | lastni podprostor za lastno vrednost λ | E_\lambda = \ker(A - \lambda I) |
n | red matrike | | | v primeru 3 tudi eksponent potence A^n
J | matrika reda 3 s samimi enicami | | | J² = 3J (primer 3)
Q | ortogonalna matrika lastnih vektorjev | A = QDQ^T | | Q^T Q = I
:::
