---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nekatere količine so povsem določene z enim številom: masa, temperatura, množina snovi. To so **skalarji**. Pri drugih pa je pomembna tudi smer: sila, hitrost, električno polje, premik atoma v molekuli, dipolni moment. To so **vektorji**. V gimnaziji smo vektorje seštevali in jih razstavljali na komponente v ravnini; na fakulteti z njimi računamo v prostoru in jih med seboj množimo na tri načine.

- **Skalarni produkt** meri, koliko vektorja kažeta v isto smer. Z njim izračunamo kot med vezema v molekuli, delo sile ali projekcijo.
- **Vektorski produkt** da vektor, pravokoten na oba. Z njim izračunamo ploščino, navor, Lorentzovo silo in normalo ravnine.
- **Mešani produkt** da prostornino paralelepipeda; z njim preverimo, ali so trije vektorji v isti ravnini, in izračunamo prostornino osnovne celice kristala.

S temi orodji opišemo tudi **premice** in **ravnine** v prostoru, kar je osnova analitične geometrije, računalniške grafike in kristalografije.

## Razlaga

**1. Vektorji v koordinatah.** V pravokotnem koordinatnem sistemu z enotskimi vektorji $\vec{i}$, $\vec{j}$, $\vec{k}$ zapišemo $\vec{a} = a_1\vec{i} + a_2\vec{j} + a_3\vec{k} = (a_1, a_2, a_3)$. Vektor od točke $A$ do točke $B$ je $\overrightarrow{AB} = (b_1 - a_1, b_2 - a_2, b_3 - a_3)$ (»konec minus začetek«). Seštevamo in množimo s skalarjem po komponentah. **Dolžina** (norma) je

$$|\vec{a}| = \sqrt{a_1^2 + a_2^2 + a_3^2}.$$

Vektor dolžine $1$ je **enotski**; iz neničelnega vektorja ga dobimo kot $\vec{a}/|\vec{a}|$.

**2. Skalarni produkt.** *Definicija.* Naj bosta $\vec{a}$ in $\vec{b}$ neničelna vektorja in $\varphi \in [0, \pi]$ kot med njima. **Skalarni produkt** je število $\vec{a} \cdot \vec{b} = |\vec{a}|\,|\vec{b}| \cos\varphi$; če je kateri od vektorjev ničeln, je $\vec{a} \cdot \vec{b} = 0$.

*Izrek.* V pravokotnem koordinatnem sistemu velja

$$\vec{a} \cdot \vec{b} = |\vec{a}|\,|\vec{b}| \cos\varphi = a_1b_1 + a_2b_2 + a_3b_3.$$

*Dokaz.* Za neničelna vektorja zapišemo kosinusni izrek v (morda izrojenem) trikotniku s stranicami $\vec{a}$, $\vec{b}$ in $\vec{a} - \vec{b}$: $|\vec{a} - \vec{b}|^2 = |\vec{a}|^2 + |\vec{b}|^2 - 2|\vec{a}||\vec{b}|\cos\varphi$. V koordinatah je leva stran $\sum (a_i - b_i)^2 = |\vec{a}|^2 + |\vec{b}|^2 - 2\sum a_ib_i$. Primerjava da $\sum a_ib_i = |\vec{a}||\vec{b}|\cos\varphi$. Če je kateri vektor ničeln, sta obe strani $0$.

Rezultat je **število**. Lastnosti: $\vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}$, $\vec{a} \cdot (\vec{b} + \vec{c}) = \vec{a} \cdot \vec{b} + \vec{a} \cdot \vec{c}$, $(\lambda\vec{a}) \cdot \vec{b} = \lambda(\vec{a} \cdot \vec{b})$, $\vec{a} \cdot \vec{a} = |\vec{a}|^2$ (vse sledijo iz koordinatnega zapisa). Ker je $|\cos\varphi| \le 1$, velja **Cauchy-Schwarzeva neenakost** $|\vec{a} \cdot \vec{b}| \le |\vec{a}|\,|\vec{b}|$.

*Izrek (pravokotnost).* Naj bosta $\vec{a}$ in $\vec{b}$ neničelna. Potem sta **pravokotna** natanko tedaj, ko je $\vec{a} \cdot \vec{b} = 0$. *Dokaz:* ker je $|\vec{a}||\vec{b}| \neq 0$, je $\vec{a} \cdot \vec{b} = 0$ natanko tedaj, ko je $\cos\varphi = 0$, torej $\varphi = \frac{\pi}{2}$. Kot med vektorjema:

$$\cos\varphi = \frac{\vec{a} \cdot \vec{b}}{|\vec{a}|\,|\vec{b}|}.$$

Predznak pove, ali je kot oster ($\vec{a} \cdot \vec{b} > 0$) ali top ($< 0$). **Pravokotna projekcija** vektorja $\vec{a}$ na smer $\vec{b}$ je $\dfrac{\vec{a} \cdot \vec{b}}{|\vec{b}|^2}\,\vec{b}$.

:::premisli
Ali obstajata vektorja z $|\vec{a}| = 1$, $|\vec{b}| = 2$ in $\vec{a} \cdot \vec{b} = 5$?
---
Ne. Po Cauchy-Schwarzevi neenakosti je $|\vec{a} \cdot \vec{b}| \le 1 \cdot 2 = 2$; največjo vrednost $2$ dosežeta vzporedna vektorja z enako smerjo ($\cos\varphi = 1$).
:::

**3. Vektorski produkt.** *Definicija.* Naj bosta $\vec{a}$ in $\vec{b}$ neničelna in nevzporedna vektorja. Vektorski produkt $\vec{a} \times \vec{b}$ je **vektor**, ki je:

- pravokoten na $\vec{a}$ in na $\vec{b}$,
- dolg $|\vec{a} \times \vec{b}| = |\vec{a}|\,|\vec{b}| \sin\varphi$, kar je ploščina paralelograma, napetega na $\vec{a}$ in $\vec{b}$,
- usmerjen po pravilu desne roke ($\vec{a}$, $\vec{b}$, $\vec{a} \times \vec{b}$ tvorijo desnosučno trojico).

Če sta vektorja vzporedna ali je kateri ničeln, je $\vec{a} \times \vec{b} = \vec{0}$. V koordinatah ga izračunamo s simbolično determinanto:

$$\vec{a} \times \vec{b} = \begin{vmatrix} \vec{i} & \vec{j} & \vec{k} \\ a_1 & a_2 & a_3 \\ b_1 & b_2 & b_3 \end{vmatrix} = (a_2b_3 - a_3b_2,\ a_3b_1 - a_1b_3,\ a_1b_2 - a_2b_1).$$

*Utemeljitev formule.* Vektor na desni je pravokoten na $\vec{a}$: $\vec{a} \cdot (\vec{a} \times \vec{b}) = a_1(a_2b_3 - a_3b_2) + a_2(a_3b_1 - a_1b_3) + a_3(a_1b_2 - a_2b_1) = 0$, ker se členi paroma odštejejo; enako za $\vec{b}$. Dolžino da **Lagrangeova identiteta** $|\vec{a} \times \vec{b}|^2 = |\vec{a}|^2|\vec{b}|^2 - (\vec{a} \cdot \vec{b})^2 = |\vec{a}|^2|\vec{b}|^2\sin^2\varphi$ (preveriš jo z razpisom komponent). Smer se ujema s pravilom desne roke, saj formula da npr. $\vec{i} \times \vec{j} = \vec{k}$; da to velja za vse pare, tu ne dokazujemo.

Lastnosti: $\vec{b} \times \vec{a} = -\vec{a} \times \vec{b}$ (**antikomutativnost**), $\vec{a} \times \vec{a} = \vec{0}$, distributivnost velja, asociativnost pa **ne**.

*Izrek (vzporednost).* Naj bosta $\vec{a}$ in $\vec{b}$ neničelna. Potem sta vzporedna natanko tedaj, ko je $\vec{a} \times \vec{b} = \vec{0}$. *Dokaz:* $|\vec{a} \times \vec{b}| = |\vec{a}||\vec{b}|\sin\varphi = 0$ natanko tedaj, ko je $\sin\varphi = 0$, torej $\varphi = 0$ ali $\varphi = \pi$.

Trikotnik je polovica paralelograma, zato je ploščina trikotnika $ABC$ enaka $\frac{1}{2}|\overrightarrow{AB} \times \overrightarrow{AC}|$.

**4. Mešani produkt.**

$$(\vec{a}, \vec{b}, \vec{c}) = (\vec{a} \times \vec{b}) \cdot \vec{c} = \begin{vmatrix} a_1 & a_2 & a_3 \\ b_1 & b_2 & b_3 \\ c_1 & c_2 & c_3 \end{vmatrix}.$$

Enakost z determinanto dobimo z razvojem determinante po tretji vrstici: $c_1(a_2b_3 - a_3b_2) - c_2(a_1b_3 - a_3b_1) + c_3(a_1b_2 - a_2b_1) = (\vec{a} \times \vec{b}) \cdot \vec{c}$.

*Izrek.* $|(\vec{a}, \vec{b}, \vec{c})|$ je prostornina paralelepipeda, napetega na $\vec{a}$, $\vec{b}$, $\vec{c}$; prostornina tetraedra s temi robovi je $\frac{1}{6}$ tega. *Dokaz:* osnovna ploskev je paralelogram s ploščino $|\vec{a} \times \vec{b}|$, višina pa je dolžina projekcije $\vec{c}$ na normalo $\vec{a} \times \vec{b}$, torej $v = |\vec{c}|\,|\cos\psi|$, kjer je $\psi$ kot med $\vec{c}$ in $\vec{a} \times \vec{b}$. Zato je $V = |\vec{a} \times \vec{b}|\,|\vec{c}|\,|\cos\psi| = |(\vec{a} \times \vec{b}) \cdot \vec{c}|$.

Predznak je pozitiven, če je trojica desnosučna. Vektorji so **koplanarni** (ležijo v isti ravnini, so linearno odvisni) natanko tedaj, ko je $(\vec{a}, \vec{b}, \vec{c}) = 0$, ker je natanko takrat paralelepiped izrojen in ima prostornino $0$. Ciklična zamenjava vrstnega reda ne spremeni vrednosti: $(\vec{a}, \vec{b}, \vec{c}) = (\vec{b}, \vec{c}, \vec{a})$.

:::premisli
Kaj se zgodi z mešanim produktom, če zamenjaš le $\vec{a}$ in $\vec{b}$? Kaj s prostornino paralelepipeda?
---
$(\vec{b}, \vec{a}, \vec{c}) = (\vec{b} \times \vec{a}) \cdot \vec{c} = -(\vec{a} \times \vec{b}) \cdot \vec{c}$: mešani produkt spremeni predznak (trojica postane levosučna). Prostornina je njegova absolutna vrednost, zato ostane enaka.
:::

**5. Premica v prostoru.** Premico določata točka $T_0$ s krajevnim vektorjem $\vec{r}_0$ in **smerni vektor** $\vec{s}$:

$$\vec{r} = \vec{r}_0 + t\,\vec{s}, \quad t \in \mathbb{R}, \qquad \text{oziroma} \qquad \frac{x - x_0}{s_1} = \frac{y - y_0}{s_2} = \frac{z - z_0}{s_3}.$$

Prvi zapis je **parametrični** (vektorski), drugi **kanonični**. Premica skozi točki $A$ in $B$ ima smerni vektor $\overrightarrow{AB}$.

**6. Ravnina.** Ravnino določata točka $T_0$ in **normala** $\vec{n} = (a, b, c)$, pravokotna na ravnino. Za vsako točko $T$ ravnine je $\vec{n} \cdot (\vec{r} - \vec{r}_0) = 0$, kar da

$$ax + by + cz = d, \qquad d = \vec{n} \cdot \vec{r}_0.$$

Koeficienti pred $x$, $y$, $z$ so torej komponente normale. Ravnina skozi tri nekolinearne točke $A$, $B$, $C$ ima normalo $\vec{n} = \overrightarrow{AB} \times \overrightarrow{AC}$. **Razdalja** točke $T_1$ do ravnine $\Sigma\colon ax + by + cz = d$ je

$$d(T_1, \Sigma) = \frac{|ax_1 + by_1 + cz_1 - d|}{\sqrt{a^2 + b^2 + c^2}}.$$

*Izpeljava:* naj bo $T_0$ poljubna točka ravnine. Razdalja je dolžina projekcije vektorja $\overrightarrow{T_0T_1}$ na normalo, torej $\frac{|\vec{n} \cdot (\vec{r}_1 - \vec{r}_0)|}{|\vec{n}|}$; ker je $\vec{n} \cdot \vec{r}_0 = d$, je števec enak $|ax_1 + by_1 + cz_1 - d|$.

Kot med dvema ravninama je kot med normalama; kot $\alpha$ med premico in ravnino izračunamo iz $\sin\alpha = \dfrac{|\vec{s} \cdot \vec{n}|}{|\vec{s}|\,|\vec{n}|}$.

**7. Medsebojna lega premic in razdalja točke do premice.** Premici s smernima vektorjema $\vec{s}_1$ in $\vec{s}_2$ skozi točki $T_1$ in $T_2$ sta lahko:

- **vzporedni** (ali sovpadata), če je $\vec{s}_1 \times \vec{s}_2 = \vec{0}$,
- **sekajoči se**, če nista vzporedni in je mešani produkt $(\vec{s}_1, \vec{s}_2, \overrightarrow{T_1T_2}) = 0$ (vsi trije vektorji ležijo v isti ravnini, zato tudi obe premici; dve nevzporedni premici v isti ravnini pa se sekata),
- **mimobežni**, če nista vzporedni in je $(\vec{s}_1, \vec{s}_2, \overrightarrow{T_1T_2}) \neq 0$; take premice v ravnini ne obstajajo, v prostoru pa so pogoste (npr. dva nevzporedna robova kocke, ki se ne stikata).

Razdalja točke $T$ do premice skozi $T_0$ s smerjo $\vec{s}$ je višina paralelograma, napetega na $\vec{s}$ in $\overrightarrow{T_0T}$, torej ploščina, deljena z osnovnico $|\vec{s}|$:

$$d = \frac{|\vec{s} \times \overrightarrow{T_0T}|}{|\vec{s}|}.$$

Razdalja med mimobežnicama pa je višina paralelepipeda (prostornina, deljena s ploščino osnovne ploskve): $d = \dfrac{|(\vec{s}_1, \vec{s}_2, \overrightarrow{T_1T_2})|}{|\vec{s}_1 \times \vec{s}_2|}$. Vse tri produkte torej uporabljamo skupaj: skalarni za kote, vektorski za ploščine in normale, mešani za prostornine in koplanarnost.

## Rešeni primeri

### Primer 1 (lažji)

Dana sta vektorja $\vec{a} = (1, 2, 2)$ in $\vec{b} = (3, 0, 4)$. Izračunaj njuni dolžini, skalarni produkt in kot med njima.

**Podatki:** $\vec{a} = (1, 2, 2)$, $\vec{b} = (3, 0, 4)$
**Iščemo:** $|\vec{a}|$, $|\vec{b}|$, $\vec{a} \cdot \vec{b}$ in kot $\varphi$

:::formula
$|\vec{a}| = \sqrt{a_1^2 + a_2^2 + a_3^2}$, $\vec{a} \cdot \vec{b} = a_1b_1 + a_2b_2 + a_3b_3$, $\cos\varphi = \dfrac{\vec{a} \cdot \vec{b}}{|\vec{a}|\,|\vec{b}|}$
:::

**Rešitev:**

1. $|\vec{a}| = \sqrt{1 + 4 + 4} = \sqrt{9} = 3$, $|\vec{b}| = \sqrt{9 + 0 + 16} = 5$.
2. $\vec{a} \cdot \vec{b} = 1 \cdot 3 + 2 \cdot 0 + 2 \cdot 4 = 11$.
3. $\cos\varphi = \dfrac{11}{3 \cdot 5} = \dfrac{11}{15} \approx 0{,}733$.
4. $\varphi = \arccos 0{,}733 \approx 42{,}8^\circ$ (v radianih $\approx 0{,}748$).
5. Odgovor: $|\vec{a}| = 3$, $|\vec{b}| = 5$, $\vec{a} \cdot \vec{b} = 11$, vektorja oklepata kot približno $42{,}8^\circ$.

### Primer 2

Točke $A(1, 0, 0)$, $B(0, 2, 0)$ in $C(0, 0, 3)$ določajo trikotnik. Izračunaj njegovo ploščino in zapiši enačbo ravnine, v kateri leži.

**Podatki:** $A(1, 0, 0)$, $B(0, 2, 0)$, $C(0, 0, 3)$
**Iščemo:** ploščino $S$ trikotnika $ABC$ in enačbo ravnine $ABC$

:::formula
$S = \frac{1}{2}\,|\overrightarrow{AB} \times \overrightarrow{AC}|$, $\vec{n} = \overrightarrow{AB} \times \overrightarrow{AC}$, ravnina $\vec{n} \cdot (\vec{r} - \vec{r}_A) = 0$
:::

**Rešitev:**

1. $\overrightarrow{AB} = (0 - 1, 2 - 0, 0 - 0) = (-1, 2, 0)$, $\overrightarrow{AC} = (-1, 0, 3)$.
2. $\overrightarrow{AB} \times \overrightarrow{AC} = (2 \cdot 3 - 0 \cdot 0,\ 0 \cdot (-1) - (-1) \cdot 3,\ (-1) \cdot 0 - 2 \cdot (-1)) = (6, 3, 2)$.
3. Preizkus pravokotnosti: $(6, 3, 2) \cdot (-1, 2, 0) = -6 + 6 + 0 = 0$ in $(6, 3, 2) \cdot (-1, 0, 3) = -6 + 0 + 6 = 0$.
4. $|(6, 3, 2)| = \sqrt{36 + 9 + 4} = \sqrt{49} = 7$, zato $S = \frac{7}{2} = 3{,}5$.
5. Ravnina: $6x + 3y + 2z = d$, z vstavljeno točko $A$ dobimo $d = 6$. Preizkus: $B$ da $3 \cdot 2 = 6$, $C$ da $2 \cdot 3 = 6$.
6. Odgovor: ploščina trikotnika je $3{,}5$ (kvadratnih enot), ravnina ima enačbo $6x + 3y + 2z = 6$.

### Primer 3 (težji)

Dane so točke $A(1, 1, 0)$, $B(3, 1, 1)$, $C(1, 4, 1)$ in $D(2, 2, 5)$. Izračunaj prostornino tetraedra $ABCD$ in višino iz oglišča $D$ na ploskev $ABC$. Zapiši še enačbo premice skozi $D$, ki je pravokotna na ravnino $ABC$. Nato poišči vse točke $E$ na osi $z$, za katere ima tetraeder $ABCE$ enako prostornino kot tetraeder $ABCD$.

**Podatki:** $A(1, 1, 0)$, $B(3, 1, 1)$, $C(1, 4, 1)$, $D(2, 2, 5)$, $E(0, 0, z)$
**Iščemo:** prostornino $V$, višino $v$, premico skozi $D$, pravokotno na $ABC$, in koordinato $z$ točke $E$

:::formula
$V = \frac{1}{6}\,|(\overrightarrow{AB}, \overrightarrow{AC}, \overrightarrow{AD})|$, $\vec{n} = \overrightarrow{AB} \times \overrightarrow{AC}$, $v = \dfrac{|\vec{n} \cdot \overrightarrow{AD}|}{|\vec{n}|}$, premica $\vec{r} = \vec{r}_D + t\,\vec{n}$, $d(T_1, \Sigma) = \dfrac{|ax_1 + by_1 + cz_1 - d|}{\sqrt{a^2 + b^2 + c^2}}$
:::

**Rešitev:**

1. $\overrightarrow{AB} = (2, 0, 1)$, $\overrightarrow{AC} = (0, 3, 1)$, $\overrightarrow{AD} = (1, 1, 5)$.
2. Mešani produkt: $\begin{vmatrix} 2 & 0 & 1 \\ 0 & 3 & 1 \\ 1 & 1 & 5 \end{vmatrix} = 2(15 - 1) - 0 + 1(0 - 3) = 28 - 3 = 25$.
3. $V = \frac{25}{6} \approx 4{,}17$.
4. Normala: $\vec{n} = \overrightarrow{AB} \times \overrightarrow{AC} = (0 \cdot 1 - 1 \cdot 3,\ 1 \cdot 0 - 2 \cdot 1,\ 2 \cdot 3 - 0 \cdot 0) = (-3, -2, 6)$, $|\vec{n}| = \sqrt{9 + 4 + 36} = 7$.
5. Višina: $v = \dfrac{|\vec{n} \cdot \overrightarrow{AD}|}{|\vec{n}|} = \dfrac{|-3 - 2 + 30|}{7} = \dfrac{25}{7} \approx 3{,}57$.
6. Preizkus: ploščina osnovne ploskve je $\frac{1}{2} \cdot 7 = 3{,}5$ in $V = \frac{1}{3} \cdot 3{,}5 \cdot \frac{25}{7} = \frac{25}{6}$.
7. Premica skozi $D$ s smerjo normale: $\vec{r} = (2, 2, 5) + t(-3, -2, 6)$, oziroma $\dfrac{x - 2}{-3} = \dfrac{y - 2}{-2} = \dfrac{z - 5}{6}$.
8. Ravnina $ABC$: $-3x - 2y + 6z = d$; točka $A$ da $d = -3 - 2 + 0 = -5$, torej $-3x - 2y + 6z = -5$ (preizkus: $B$ da $-9 - 2 + 6 = -5$).
9. Tetraedra $ABCD$ in $ABCE$ imata skupno osnovno ploskev $ABC$, zato imata enako prostornino natanko tedaj, ko je $E$ enako oddaljena od ravnine $ABC$ kot $D$: $d(E, ABC) = \frac{25}{7}$.
10. Za $E(0, 0, z)$ je $d(E, ABC) = \dfrac{|6z + 5|}{7}$. Iz $|6z + 5| = 25$ sledi $6z + 5 = 25$ ali $6z + 5 = -25$, torej $z = \frac{10}{3}$ ali $z = -5$.
11. Preizkus z mešanim produktom za $E(0, 0, -5)$: $\overrightarrow{AE} = (-1, -1, -5)$, $(\overrightarrow{AB}, \overrightarrow{AC}, \overrightarrow{AE}) = \vec{n} \cdot \overrightarrow{AE} = 3 + 2 - 30 = -25$, zato je prostornina $\frac{25}{6}$. Točki ležita na nasprotnih straneh ravnine (predznak $-25$ proti $+25$).
12. Odgovor: tetraeder ima prostornino $\frac{25}{6} \approx 4{,}17$, višina iz $D$ je $\frac{25}{7} \approx 3{,}57$, pravokotnica skozi $D$ je $\vec{r} = (2, 2, 5) + t(-3, -2, 6)$, enako prostornino pa dasta točki $E(0, 0, \frac{10}{3})$ in $E(0, 0, -5)$.

## Pogoste napake

- **Skalarni produkt kot vektor.** Študent zapiše $\vec{a} \cdot \vec{b} = (a_1b_1, a_2b_2, a_3b_3)$. Pravilno: komponentne produkte seštejemo; rezultat je število.
- **Vrstni red pri vektorskem produktu.** $\vec{b} \times \vec{a} = -\vec{a} \times \vec{b}$. Pri ploščini to ni pomembno, pri smeri navora ali normale pa je.
- **Predznak srednje komponente.** Pri razvoju simbolične determinante se pozabi minus pri $\vec{j}$. Vedno preveri, da je rezultat pravokoten na oba vektorja (skalarni produkt mora biti $0$).
- **Pozabljena $\frac{1}{2}$ ali $\frac{1}{6}$.** $|\vec{a} \times \vec{b}|$ je ploščina paralelograma (trikotnik je polovica), mešani produkt pa prostornina paralelepipeda (tetraeder je šestina).
- **Normala namesto smernega vektorja.** V enačbi ravnine $ax + by + cz = d$ je $(a, b, c)$ pravokoten na ravnino, ne leži v njej.
- **Kot med premico in ravnino s kosinusom.** Ker je $\vec{n}$ pravokoten na ravnino, uporabimo $\sin\alpha$, ne $\cos\alpha$.
- **Absolutna vrednost.** Prostornina in razdalja sta nenegativni; negativni mešani produkt pomeni le levosučno trojico.

## Povzetek

- $\vec{a} \cdot \vec{b} = a_1b_1 + a_2b_2 + a_3b_3 = |\vec{a}||\vec{b}|\cos\varphi$; pravokotnost $\iff \vec{a} \cdot \vec{b} = 0$.
- $\vec{a} \times \vec{b}$ je pravokoten na oba, dolg kot ploščina paralelograma, $\vec{b} \times \vec{a} = -\vec{a} \times \vec{b}$; vzporednost $\iff \vec{a} \times \vec{b} = \vec{0}$.
- $(\vec{a}, \vec{b}, \vec{c}) = (\vec{a} \times \vec{b}) \cdot \vec{c}$ je determinanta komponent; absolutna vrednost je prostornina paralelepipeda; koplanarnost $\iff (\vec{a}, \vec{b}, \vec{c}) = 0$.
- Premica: $\vec{r} = \vec{r}_0 + t\vec{s}$. Ravnina: $ax + by + cz = d$ z normalo $(a, b, c)$.
- Razdalja točke do ravnine: $\frac{|ax_1 + by_1 + cz_1 - d|}{\sqrt{a^2 + b^2 + c^2}}$.

## Za izpit

Znati moraš povedati:

- definicije skalarnega, vektorskega in mešanega produkta (geometrijsko in v koordinatah) z njihovimi lastnostmi;
- izrek o koordinatnem zapisu skalarnega produkta z dokazom prek kosinusnega izreka in Cauchy-Schwarzevo neenakost;
- pogoje za pravokotnost, vzporednost in koplanarnost (vse z neničelnimi vektorji) z utemeljitvijo;
- zakaj je $|(\vec{a}, \vec{b}, \vec{c})|$ prostornina paralelepipeda in izpeljavo razdalje točke do ravnine, do premice in med mimobežnicama;
- kriterije za medsebojno lego dveh premic v prostoru.

### Naloga 1

Dani sta premici $p\colon \vec{r} = (1, 0, 0) + t(2, -1, 0)$ in $q\colon \vec{r} = (3, \lambda, 2) + u(0, 1, -1)$, kjer je $\lambda$ realen parameter. (a) Za katero vrednost $\lambda$ se premici sekata? Poišči presečišče. (b) Za $\lambda = 0$ pokaži, da sta premici mimobežni, izračunaj njuno razdaljo in poišči točki $P \in p$ in $Q \in q$, v katerih ju seka skupna pravokotnica.

**Rešitev:**

1. Smerna vektorja $\vec{s}_1 = (2, -1, 0)$, $\vec{s}_2 = (0, 1, -1)$: $\vec{s}_1 \times \vec{s}_2 = ((-1)(-1) - 0 \cdot 1,\ 0 \cdot 0 - 2 \cdot (-1),\ 2 \cdot 1 - (-1) \cdot 0) = (1, 2, 2) \neq \vec{0}$, zato premici nista vzporedni za noben $\lambda$; $|\vec{s}_1 \times \vec{s}_2| = 3$.
2. $T_1 = (1, 0, 0)$, $T_2 = (3, \lambda, 2)$, $\overrightarrow{T_1T_2} = (2, \lambda, 2)$.
3. Mešani produkt: $(\vec{s}_1, \vec{s}_2, \overrightarrow{T_1T_2}) = (1, 2, 2) \cdot (2, \lambda, 2) = 2 + 2\lambda + 4 = 2\lambda + 6$.
4. (a) Premici se sekata natanko tedaj, ko je $2\lambda + 6 = 0$, torej pri $\lambda = -3$. Vse točke $q$ imajo $x = 3$, zato iz $1 + 2t = 3$ dobimo $t = 1$ in točko $(3, -1, 0)$ na $p$; na $q$ jo dobimo pri $u = 2$ (iz $2 - u = 0$): $(3, -3 + 2, 2 - 2) = (3, -1, 0)$.
5. (b) Pri $\lambda = 0$ je mešani produkt $6 \neq 0$, zato sta premici mimobežni; razdalja je $d = \frac{|6|}{3} = 2$.
6. Splošni točki: $P = (1 + 2t, -t, 0)$, $Q = (3, u, 2 - u)$, $\overrightarrow{PQ} = (2 - 2t,\ u + t,\ 2 - u)$. Skupna pravokotnica je pravokotna na obe premici: $\overrightarrow{PQ} \cdot \vec{s}_1 = 4 - 5t - u = 0$ in $\overrightarrow{PQ} \cdot \vec{s}_2 = 2u + t - 2 = 0$.
7. Iz prve enačbe $u = 4 - 5t$, vstavimo v drugo: $8 - 10t + t - 2 = 0$, torej $t = \frac{2}{3}$ in $u = \frac{2}{3}$.
8. $P = (\frac{7}{3}, -\frac{2}{3}, 0)$, $Q = (3, \frac{2}{3}, \frac{4}{3})$, $\overrightarrow{PQ} = (\frac{2}{3}, \frac{4}{3}, \frac{4}{3}) = \frac{2}{3}(1, 2, 2)$ z dolžino $\frac{2}{3} \cdot 3 = 2$, kar potrdi razdaljo iz 5. koraka.
9. Odgovor: premici se sekata pri $\lambda = -3$ v točki $(3, -1, 0)$; pri $\lambda = 0$ sta mimobežni z razdaljo $2$, skupna pravokotnica ju seka v $P(\frac{7}{3}, -\frac{2}{3}, 0)$ in $Q(3, \frac{2}{3}, \frac{4}{3})$.

### Naloga 2

Natančno navedi definicijo skalarnega produkta in dokaži, da v pravokotnem koordinatnem sistemu velja $\vec{a} \cdot \vec{b} = a_1b_1 + a_2b_2 + a_3b_3$. Nato samo s pravili računanja (brez kota) dokaži Cauchy-Schwarzevo neenakost $|\vec{a} \cdot \vec{b}| \le |\vec{a}|\,|\vec{b}|$ in povej, kdaj velja enakost.

**Rešitev:**

1. Definicija: za neničelna $\vec{a}$, $\vec{b}$ s kotom $\varphi \in [0, \pi]$ je $\vec{a} \cdot \vec{b} = |\vec{a}||\vec{b}|\cos\varphi$, sicer $0$.
2. Kosinusni izrek v trikotniku s stranicami $\vec{a}$, $\vec{b}$, $\vec{a} - \vec{b}$: $|\vec{a} - \vec{b}|^2 = |\vec{a}|^2 + |\vec{b}|^2 - 2|\vec{a}||\vec{b}|\cos\varphi$.
3. V koordinatah: $|\vec{a} - \vec{b}|^2 = \sum (a_i - b_i)^2 = \sum a_i^2 + \sum b_i^2 - 2\sum a_ib_i$. Primerjava z 2. korakom da $|\vec{a}||\vec{b}|\cos\varphi = \sum a_ib_i$.
4. Cauchy-Schwarz: za $\vec{b} = \vec{0}$ sta obe strani $0$. Naj bo $\vec{b} \neq \vec{0}$; za vsak realen $\lambda$ je $0 \le |\vec{a} - \lambda\vec{b}|^2 = |\vec{a}|^2 - 2\lambda\,\vec{a} \cdot \vec{b} + \lambda^2|\vec{b}|^2$.
5. Izberemo $\lambda = \dfrac{\vec{a} \cdot \vec{b}}{|\vec{b}|^2}$ in dobimo $0 \le |\vec{a}|^2 - \dfrac{(\vec{a} \cdot \vec{b})^2}{|\vec{b}|^2}$, torej $(\vec{a} \cdot \vec{b})^2 \le |\vec{a}|^2|\vec{b}|^2$ in po korenjenju neenakost.
6. Enakost velja natanko tedaj, ko je $|\vec{a} - \lambda\vec{b}| = 0$, torej $\vec{a} = \lambda\vec{b}$: vektorja sta vzporedna (ali je kateri ničeln). Dokaz ne uporablja kota, zato velja tudi v $\mathbb{R}^n$.

### Naloga 3

Utemelji, ali velja: če je $\vec{a} \neq \vec{0}$ in $\vec{a} \times \vec{b} = \vec{a} \times \vec{c}$, potem je $\vec{b} = \vec{c}$. Ali sklep velja, če poleg tega vemo še $\vec{a} \cdot \vec{b} = \vec{a} \cdot \vec{c}$?

**Rešitev:**

1. Prvi sklep ne velja. Protiprimer: $\vec{a} = (1, 0, 0)$, $\vec{c} = (0, 1, 0)$, $\vec{b} = \vec{c} + \vec{a} = (1, 1, 0)$. Tedaj $\vec{a} \times \vec{b} = \vec{a} \times \vec{c} + \vec{a} \times \vec{a} = \vec{a} \times \vec{c} = (0, 0, 1)$, a $\vec{b} \neq \vec{c}$.
2. Z obema pogojema: iz distributivnosti je $\vec{a} \times (\vec{b} - \vec{c}) = \vec{0}$, zato je $\vec{b} - \vec{c}$ ničeln ali vzporeden z $\vec{a}$: $\vec{b} - \vec{c} = \mu\vec{a}$ za neki $\mu \in \mathbb{R}$.
3. Iz drugega pogoja je $\vec{a} \cdot (\vec{b} - \vec{c}) = 0$, torej $\mu\,|\vec{a}|^2 = 0$.
4. Ker je $\vec{a} \neq \vec{0}$, je $|\vec{a}|^2 > 0$ in $\mu = 0$.
5. Odgovor: sam vektorski produkt ne zadošča (krajšati z $\vec{a}$ ne smemo), oba pogoja skupaj pa dasta $\vec{b} = \vec{c}$.

## Drugače: Na sliki

Predstavljaj si dva vektorja, ki izhajata iz iste točke:

```
            a x b  (kaže iz ravnine, pravilo desne roke)
              ^
              |
              |      b
              |     /
              |    /  ploščina = |a x b|
              |   /___________
              |  /           /
              | /  phi      /
              O-----------> a
```

- **Skalarni produkt** je dolžina sence vektorja $\vec{a}$ na smeri $\vec{b}$, pomnožena z $|\vec{b}|$. Če svetimo pravokotno na $\vec{b}$ in sence ni, sta vektorja pravokotna.
- **Vektorski produkt** je puščica, pravokotna na »list«, na katerem ležita $\vec{a}$ in $\vec{b}$; njena dolžina je ploščina paralelograma. Prste desne roke ukrivi od $\vec{a}$ proti $\vec{b}$, palec kaže smer $\vec{a} \times \vec{b}$.
- **Mešani produkt**: na paralelogram postavimo še tretji vektor $\vec{c}$. Nastane »poševna škatla«; njena prostornina je ploščina osnovne ploskve krat višina, višina pa je projekcija $\vec{c}$ na normalo $\vec{a} \times \vec{b}$.

## Drugače: Uporaba v stroki

**Geometrija molekul.** Postavimo ogljik v izhodišče, dva vodikova atoma metana pa v smeri $(1, 1, 1)$ in $(1, -1, -1)$ (oglišča kocke, ki tvorijo tetraeder). Skalarni produkt je $1 - 1 - 1 = -1$, dolžini sta $\sqrt{3}$, zato $\cos\varphi = -\frac{1}{3}$ in $\varphi \approx 109{,}5^\circ$: tetraedrski kot pri $sp^3$-hibridiziranem ogljiku. Programi za modeliranje molekul iz kartezičnih koordinat atomov na enak način računajo vezne kote, z vektorskim in mešanim produktom pa torzijske (dihedralne) kote.

**Dipolni moment.** Dipolni moment molekule je vektorska vsota dipolnih momentov vezi. V vodi imata vezna dipola O–H velikost približno $1{,}5\,\mathrm{D}$ in oklepata $104{,}5^\circ$; vsota leži na simetrali kota in je velika $2 \cdot 1{,}5 \cdot \cos 52{,}25^\circ \approx 1{,}84\,\mathrm{D}$, kar se ujema z izmerjeno vrednostjo $1{,}85\,\mathrm{D}$. Pri linearni molekuli $\mathrm{CO_2}$ sta vezna dipola nasprotna in se izničita, zato molekula ni polarna, čeprav sta vezi polarni.

**Gostota kristala.** Osnovno celico napenjajo vektorji mreže $\vec{a}$, $\vec{b}$, $\vec{c}$, njena prostornina je $|(\vec{a}, \vec{b}, \vec{c})|$ (za monoklinsko celico to da $abc\sin\beta$). Za kubični $\mathrm{NaCl}$ z robom $564\,\mathrm{pm}$ in $4$ formulskimi enotami v celici je $V = (5{,}64 \cdot 10^{-8}\,\mathrm{cm})^3 \approx 1{,}794 \cdot 10^{-22}\,\mathrm{cm^3}$ in $\rho = \frac{4 \cdot 58{,}44\,\mathrm{g/mol}}{N_\mathrm{A} V} \approx 2{,}16\,\mathrm{g/cm^3}$, v skladu z izmerjeno gostoto.

**Rentgenska difrakcija.** V kubični mreži z robom $a$ ima družina mrežnih ravnin z Millerjevimi indeksi $(hkl)$ normalo $(h, k, l)$; ravnina, najbližja izhodišču, je $hx + ky + lz = a$. Po formuli za razdaljo točke do ravnine je razmik ravnin $d_{hkl} = \frac{a}{\sqrt{h^2 + k^2 + l^2}}$. Za ravnine $(200)$ v $\mathrm{NaCl}$ je $d = 282\,\mathrm{pm}$; z Braggovim zakonom $2d\sin\theta = \lambda$ in bakrovim sevanjem $\lambda = 154\,\mathrm{pm}$ dobimo $\sin\theta \approx 0{,}273$, torej uklonski vrh pri $2\theta \approx 31{,}7^\circ$, kjer ga difraktometer res izmeri.

## Drugače: Korak za korakom s številkami

Poišči presečišče premice $\vec{r} = (1, 1, 1) + t(1, -1, 2)$ z ravnino $2x + y - z = 5$ in kot med njima.

1. **Točka na premici:** $x = 1 + t$, $y = 1 - t$, $z = 1 + 2t$.
2. **Vstavimo v ravnino:** $2(1 + t) + (1 - t) - (1 + 2t) = 5$.
3. **Poenostavimo:** $2 + 2t + 1 - t - 1 - 2t = 2 - t = 5$, torej $t = -3$.
4. **Presečišče:** $x = -2$, $y = 4$, $z = -5$. Preizkus: $2 \cdot (-2) + 4 - (-5) = 5$.
5. **Smerni vektor in normala:** $\vec{s} = (1, -1, 2)$, $\vec{n} = (2, 1, -1)$.
6. **Skalarni produkt:** $\vec{s} \cdot \vec{n} = 2 - 1 - 2 = -1$; dolžini $|\vec{s}| = |\vec{n}| = \sqrt{6}$.
7. **Kot:** $\sin\alpha = \dfrac{|-1|}{\sqrt{6} \cdot \sqrt{6}} = \dfrac{1}{6}$, zato $\alpha \approx 9{,}6^\circ$.

Premica torej prebode ravnino v točki $(-2, 4, -5)$ pod kotom približno $9{,}6^\circ$, skoraj vzporedno z njo.

## Drugače: Bolj natančno

**Cauchy-Schwarzeva neenakost.** $|\vec{a} \cdot \vec{b}| \le |\vec{a}|\,|\vec{b}|$, z enakostjo natanko za vzporedna vektorja. Za neničelna vektorja je zato kvocient $\frac{\vec{a} \cdot \vec{b}}{|\vec{a}||\vec{b}|}$ vedno v $[-1, 1]$ in kot je dobro definiran tudi v $\mathbb{R}^n$, kjer si ga ne moremo predstavljati.

**Lagrangeova identiteta.** $|\vec{a} \times \vec{b}|^2 = |\vec{a}|^2|\vec{b}|^2 - (\vec{a} \cdot \vec{b})^2$. Ker je desna stran enaka $|\vec{a}|^2|\vec{b}|^2(1 - \cos^2\varphi)$, sledi $|\vec{a} \times \vec{b}| = |\vec{a}||\vec{b}|\sin\varphi$. Identiteto preveriš z razpisom komponent.

**Dvojni vektorski produkt.** $\vec{a} \times (\vec{b} \times \vec{c}) = \vec{b}(\vec{a} \cdot \vec{c}) - \vec{c}(\vec{a} \cdot \vec{b})$. Iz nje vidimo, da vektorski produkt ni asociativen: za $\vec{i}$, $\vec{i}$, $\vec{j}$ je $(\vec{i} \times \vec{i}) \times \vec{j} = \vec{0}$, $\vec{i} \times (\vec{i} \times \vec{j}) = \vec{i} \times \vec{k} = -\vec{j}$.

**Formula za razdaljo.** Naj bo $T_0$ poljubna točka ravnine. Razdalja točke $T_1$ do ravnine je absolutna vrednost projekcije vektorja $\overrightarrow{T_0T_1}$ na enotsko normalo: $\frac{|\vec{n} \cdot (\vec{r}_1 - \vec{r}_0)|}{|\vec{n}|} = \frac{|ax_1 + by_1 + cz_1 - d|}{|\vec{n}|}$, ker je $\vec{n} \cdot \vec{r}_0 = d$.

## Preveri se

? Kolikšen je kot med vektorjema $\vec{a} = (1, 2, 3)$ in $\vec{b} = (2, -1, 0)$?
- $0^\circ$
- $45^\circ$
+ $90^\circ$
> $\vec{a} \cdot \vec{b} = 2 - 2 + 0 = 0$, zato je $\cos\varphi = 0$ in vektorja sta pravokotna.

? Kolikšna je ploščina paralelograma, napetega na vektorja $(2, 0, 0)$ in $(0, 3, 0)$?
- $5$
+ $6$
- $3$
> Vektorski produkt je $(0, 0, 6)$, njegova dolžina $6$ je ploščina paralelograma. Odgovor $3$ je ploščina trikotnika.

? Mešani produkt vektorjev $\vec{a}$, $\vec{b}$, $\vec{c}$ je enak $0$. Kaj to pomeni?
- Vektorji so paroma pravokotni.
+ Vektorji ležijo v isti ravnini.
- Vsi trije vektorji so ničelni.
> Prostornina paralelepipeda je nič, ker se »škatla« splošči: vektorji so koplanarni (linearno odvisni).

? Kateri vektor je normala ravnine $2x - y + 3z = 7$?
- $(2, -1, 7)$
- $(7, 2, -1)$
+ $(2, -1, 3)$
> Koeficienti pred $x$, $y$ in $z$ so komponente normale; desna stran $7$ le premakne ravnino.

:::simboli
\vec{a} | vektor a | | | |a| je njegova dolžina
a_1, a_2, a_3 | komponente vektorja a | | |
\vec{b} | vektor b | | |
b_1, b_2, b_3 | komponente vektorja b | | |
\vec{c} | vektor c (tretji vektor mešanega produkta) | | |
c_1, c_2, c_3 | komponente vektorja c | | |
\varphi | kot med vektorjema | \cos\varphi = \dfrac{\vec{a} \cdot \vec{b}}{\lvert\vec{a}\rvert\,\lvert\vec{b}\rvert} | | φ ∈ [0, π]
\vec{i}, \vec{j}, \vec{k} | enotski vektorji v smereh osi x, y, z | | |
\vec{r} | krajevni vektor poljubne točke premice ali ravnine | \vec{r} = \vec{r}_0 + t\,\vec{s} | |
\vec{r}_0 | krajevni vektor dane točke T₀ | | |
t | parameter premice | | | t ∈ ℝ
\vec{s} | smerni vektor premice | | |
x, y, z | koordinate točke na premici ali ravnini | | |
x_0, y_0, z_0 | koordinate točke T₀ | | |
s_1, s_2, s_3 | komponente smernega vektorja s | | |
a, b, c | komponente normale ravnine | | | n = (a, b, c)
d | prosti člen v enačbi ravnine | d = \vec{n} \cdot \vec{r}_0 | | d(T₁, Σ) in d pri premici pomenita razdaljo
\vec{n} | normala ravnine | \vec{n} = \overrightarrow{AB} \times \overrightarrow{AC} | | pravokotna na ravnino
T_1 | točka, katere razdaljo do ravnine iščemo | | |
\Sigma | ravnina | | | podana z enačbo ax + by + cz = d
x_1, y_1, z_1 | koordinate točke T₁ | | |
T_0 | dana točka na premici ali ravnini | | |
T | poljubna točka (na ravnini ali zunaj premice) | | |
S | ploščina trikotnika ABC | S = \frac{1}{2}\,\lvert\overrightarrow{AB} \times \overrightarrow{AC}\rvert | |
A, B, C, D | oglišča trikotnika ABC oziroma tetraedra ABCD | | |
\vec{r}_A | krajevni vektor točke A | | |
V | prostornina tetraedra ABCD | V = \frac{1}{6}\,\lvert(\overrightarrow{AB}, \overrightarrow{AC}, \overrightarrow{AD})\rvert | |
v | višina tetraedra iz oglišča D | v = \dfrac{\lvert\vec{n} \cdot \overrightarrow{AD}\rvert}{\lvert\vec{n}\rvert} | |
\vec{r}_D | krajevni vektor točke D | | |
\psi | kot med vektorjem c in normalo a × b | | |
E | točka na osi z v Primeru 3 | | |
\lambda | realno število (skalar, parameter premice q v Nalogi 1) | | | v Braggovem zakonu valovna dolžina
\mu | realno število v Nalogi 3 | | |
P, Q | nožišči skupne pravokotnice mimobežnic | | |
u | parameter premice q | | |
:::
