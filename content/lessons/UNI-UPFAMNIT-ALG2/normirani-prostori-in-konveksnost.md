---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Vzemi karirast papir in označi točko v sredini. To je vozilo na Marsu, ki se zaradi navigacije premika le v smeri sever–jug ali vzhod–zahod. Pobarvaj vsa križišča črt, do katerih pride v največ $4$ korakih. Nato z vrvico dolžine $4$ kvadratkov in svinčnikom nariši krog okrog iste točke.

Dobiš dve različni »okroglini«: krog in kvadrat, postavljen na oglišče. Obe lepo opišeta »razdaljo $4$«, le da je merjena na dva načina. Linearna algebra pozna še več takih meril. Imenujemo jih **norme**.

Norme rabijo povsod, kjer je treba oceniti velikost napake: ali bo popravek usmeritve teleskopa napako zmanjšal ali povečal, kako daleč je sonda od načrtovane poti, ali zasuk satelita ohrani razdalje med deli konstrukcije. Ob tem se pojavi še ena lastnost: krog in kvadrat sta **konveksna**. To ni naključje.

## Razlaga

Gradimo po korakih. Za vsakim je kratko vprašanje za preverbo.

**1. Kaj je norma.** Norma na realnem vektorskem prostoru $V$ je preslikava $x \mapsto \|x\|$ v $[0, \infty)$, ki za vse $x, y \in V$ in $\alpha \in \mathbb{R}$ zadošča:

- $\|x\| = 0$ natanko tedaj, ko $x = 0$ (pozitivnost),
- $\|\alpha x\| = |\alpha|\,\|x\|$ (homogenost),
- $\|x + y\| \le \|x\| + \|y\|$ (trikotniška neenakost).

Par $(V, \|\cdot\|)$ je **normiran prostor**. Razdalja med $x$ in $y$ je $\|x - y\|$.

*Preverba:* je $\|x\| = x_1^2 + x_2^2$ norma na $\mathbb{R}^2$? (Ne: $\|2x\| = 4\|x\|$, homogenost odpove.)

**2. Tri norme na $\mathbb{R}^n$.** Za $x = (x_1, \ldots, x_n)$:

$$\|x\|_1 = \sum |x_i|, \qquad \|x\|_2 = \sqrt{\textstyle\sum x_i^2}, \qquad \|x\|_\infty = \max |x_i|.$$

Norma $\|\cdot\|_1$ je »pot vozila po mreži«, $\|\cdot\|_2$ je običajna dolžina, $\|\cdot\|_\infty$ pa najdaljša posamezna koordinata. Norma $\|\cdot\|_2$ izvira iz skalarnega produkta, $\|x\|_2 = \sqrt{\langle x, x\rangle}$. Za vsak $x$ velja $\|x\|_\infty \le \|x\|_2 \le \|x\|_1$.

*Preverba:* norme vektorja $(1, -2)$? ($3$, $\sqrt{5}$, $2$.)

**3. Enotske krogle.** Množica $\{x : \|x\| \le 1\}$ je **enotska krogla** norme. V $\mathbb{R}^2$:

| norma | enotska krogla | oglišča |
|---|---|---|
| $\lVert\cdot\rVert_1$ | kvadrat, postavljen na oglišče (romb) | $(\pm 1, 0)$, $(0, \pm 1)$ |
| $\lVert\cdot\rVert_2$ | krog s polmerom $1$ | jih ni |
| $\lVert\cdot\rVert_\infty$ | kvadrat s stranicami, vzporednimi osema | $(\pm 1, \pm 1)$ |

Romb je včrtan krogu, krog je včrtan kvadratu. To je slika neenakosti iz koraka 2. V $\mathbb{R}^3$ so to oktaeder, krogla in kocka.

*Preverba:* ali točka $(0{,}6;\ 0{,}6)$ leži v enotski krogli norme $\|\cdot\|_1$? (Ne, $0{,}6 + 0{,}6 = 1{,}2 > 1$.)

**4. Konveksne množice.** Množica $K \subseteq V$ je **konveksna**, če za vsaka $x, y \in K$ cela daljica med njima leži v $K$:
$$tx + (1 - t)y \in K \quad \text{za vse } t \in [0, 1].$$

Enotska krogla vsake norme je konveksna. Če $\|x\|, \|y\| \le 1$, potem
$$\|tx + (1-t)y\| \le t\|x\| + (1-t)\|y\| \le 1.$$
Uporabili smo trikotniško neenakost in homogenost. Presek konveksnih množic je spet konveksen; unija pa v splošnem ni.

:::premisli
Množica $\{(x, y) : \sqrt{|x|} + \sqrt{|y|} \le 1\}$ je »zvezda« s stranicami, ukrivljenimi navznoter proti središču. Ali je izraz $\big(\sqrt{|x|} + \sqrt{|y|}\big)^2$ lahko norma?
---
Ne. Točki $(1, 0)$ in $(0, 1)$ ležita v množici, razpolovišče $(0{,}5;\ 0{,}5)$ pa ne: $2\sqrt{0{,}5} \approx 1{,}41 > 1$. Množica ni konveksna, enotska krogla norme pa vedno je. Izraz krši trikotniško neenakost.
:::

*Preverba:* je konveksna unija dveh disjunktnih krogov? (Ne, daljica med njima gre ven.)

**5. Norma matrike.** Matrika $A$ preslika vektorje; zanima nas, kolikokrat največ podaljša vektor. **Inducirana norma** je
$$\|A\| = \max_{x \ne 0} \frac{\|Ax\|}{\|x\|}.$$
Zato vedno $\|Ax\| \le \|A\|\,\|x\|$. Za tri norme iz koraka 2 se izračuna:

- $\|A\|_1$ = največja vsota absolutnih vrednosti v **stolpcu**,
- $\|A\|_\infty$ = največja vsota absolutnih vrednosti v **vrstici**,
- $\|A\|_2 = \sqrt{\lambda_{\max}(A^{\mathsf T}A)}$.

Pri $\|A\|_2$ pomaga spektralni izrek: $A^{\mathsf T}A$ je simetrična in pozitivno semidefinitna, zato ima nenegativne lastne vrednosti. Včasih se uporablja še Frobeniusova norma $\|A\|_F = \sqrt{\sum a_{ij}^2}$, ki pa ni inducirana.

*Preverba:* $\|I\|$ za katerokoli inducirano normo? ($1$, saj $\|Ix\| = \|x\|$.)

**6. Izometrije.** Preslikava $f$ je **izometrija**, če ohranja razdalje: $\|f(x) - f(y)\| = \|x - y\|$. Delamo z normo $\|\cdot\|_2$.

Linearna preslikava $x \mapsto Qx$ je izometrija natanko tedaj, ko je $Q$ ortogonalna, $Q^{\mathsf T}Q = I$. Potem $\det Q = \pm 1$. Vsaka izometrija prostora $\mathbb{R}^n$ je oblike $f(x) = Qx + b$: ortogonalni del in premik.

- V $\mathbb{R}^2$: $\det Q = 1$ je **rotacija** za kot $\varphi$, $\det Q = -1$ je **zrcaljenje** čez premico skozi izhodišče.
- V $\mathbb{R}^3$: $\det Q = 1$ je **rotacija okrog osi**, $\det Q = -1$ je rotacija, sestavljena z zrcaljenjem čez ravnino, pravokotno na os.

Os rotacije je premica v smeri lastnega vektorja za lastno vrednost $1$. Kot $\varphi$ dobiš iz sledi: $\operatorname{sl} Q = 1 + 2\cos\varphi$.

:::premisli
Zakaj ima vsaka rotacija prostora $\mathbb{R}^3$ (ortogonalna, $\det Q = 1$) os?
---
Karakteristični polinom ima stopnjo $3$, zato ima realno ničlo. Lastne vrednosti ortogonalne matrike imajo absolutno vrednost $1$; nerealne nastopajo v konjugiranem paru s produktom $1$. Produkt vseh je $\det Q = 1$, zato je realna lastna vrednost $1$ (ali pa so vse tri realne in je vsaj ena enaka $1$). Njen lastni vektor je os.
:::

*Preverba:* ali je premik $x \mapsto x + b$, $b \ne 0$, linearna izometrija? (Izometrija da, linearna ne: izhodišča ne ohrani.)

## Rešeni primeri

### Primer 1: odmik sonde v treh normah

Sonda je od načrtovane točke srečanja s postajo odmaknjena za vektor $d = (3, -4, 12)\,\mathrm{km}$. Izračunaj $\|d\|_1$, $\|d\|_2$ in $\|d\|_\infty$ ter povej, kaj pomeni vsaka.

**Podatki:** $d = (3, -4, 12)\,\mathrm{km}$
**Iščemo:** $\|d\|_1$, $\|d\|_2$, $\|d\|_\infty$

:::formula
$\|d\|_1 = \sum |d_i|$, $\quad \|d\|_2 = \sqrt{\sum d_i^2}$, $\quad \|d\|_\infty = \max |d_i|$
:::

**Rešitev:**

1. $\|d\|_1 = 3 + 4 + 12 = 19\,\mathrm{km}$: toliko bi sonda preletela s popravki po eni osi naenkrat.
2. $\|d\|_2 = \sqrt{9 + 16 + 144} = \sqrt{169} = 13\,\mathrm{km}$: dolžina ravne poti.
3. $\|d\|_\infty = 12\,\mathrm{km}$: največji odmik v eni sami smeri.
4. Preverba: $12 \le 13 \le 19$, kot zahteva neenakost med normami.
5. Odgovor: norme so $19\,\mathrm{km}$, $13\,\mathrm{km}$ in $12\,\mathrm{km}$.

### Primer 2: koliko popravek poveča napako

Sistem za vodenje teleskopa popravi napako usmeritve $e$ (v kotnih sekundah) z matriko $A = \begin{pmatrix} 3 & 0 \\ 4 & 5 \end{pmatrix}$. Napaka je omejena z $\|e\|_2 \le 0{,}1$. Izračunaj $\|A\|_1$, $\|A\|_\infty$, $\|A\|_2$ in oceni največji $\|Ae\|_2$.

**Podatki:** $A = \begin{pmatrix} 3 & 0 \\ 4 & 5 \end{pmatrix}$, $\|e\|_2 \le 0{,}1$
**Iščemo:** $\|A\|_1$, $\|A\|_\infty$, $\|A\|_2$ in mejo za $\|Ae\|_2$

:::formula
$\|A\|_2 = \sqrt{\lambda_{\max}(A^{\mathsf T}A)}$, $\quad \|Ae\|_2 \le \|A\|_2\,\|e\|_2$
:::

**Rešitev:**

1. Vsote po stolpcih: $3 + 4 = 7$ in $0 + 5 = 5$, zato $\|A\|_1 = 7$.
2. Vsote po vrsticah: $3$ in $4 + 5 = 9$, zato $\|A\|_\infty = 9$.
3. $A^{\mathsf T}A = \begin{pmatrix} 25 & 20 \\ 20 & 25 \end{pmatrix}$; lastni vrednosti sta $25 \pm 20$, torej $45$ in $5$.
4. $\|A\|_2 = \sqrt{45} \approx 6{,}71$. Doseže se pri $x = (1, 1)$: $Ax = (3, 9)$, $\dfrac{\|Ax\|_2}{\|x\|_2} = \dfrac{\sqrt{90}}{\sqrt{2}} = \sqrt{45}$.
5. Meja: $\|Ae\|_2 \le 6{,}71 \cdot 0{,}1 \approx 0{,}67$ kotne sekunde.
6. Odgovor: $\|A\|_1 = 7$, $\|A\|_\infty = 9$, $\|A\|_2 \approx 6{,}71$; popravek lahko napako poveča do približno $0{,}67''$.

### Primer 3: kako se je zasukal satelit

Po manevru je lega satelita opisana z matriko
$$Q = \frac{1}{3}\begin{pmatrix} 2 & -1 & 2 \\ 2 & 2 & -1 \\ -1 & 2 & 2 \end{pmatrix}.$$
Pokaži, da je to rotacija, ter določi os in kot zasuka.

**Podatki:** matrika $Q$ zgoraj
**Iščemo:** ali je $Q$ rotacija, os $v$ in kot $\varphi$

:::formula
$Q^{\mathsf T}Q = I$ in $\det Q = 1$; os: $Qv = v$; kot: $\operatorname{sl} Q = 1 + 2\cos\varphi$
:::

**Rešitev:**

1. Stolpci $\tfrac13(2, 2, -1)$, $\tfrac13(-1, 2, 2)$, $\tfrac13(2, -1, 2)$ imajo dolžino $\tfrac13\sqrt{9} = 1$.
2. Paroma so pravokotni, npr. $(2, 2, -1) \cdot (-1, 2, 2) = -2 + 4 - 2 = 0$. Torej $Q^{\mathsf T}Q = I$.
3. $\det Q = \tfrac{1}{27} \cdot 27 = 1$, zato je to rotacija, ne zrcaljenje.
4. Os: vsota vsake vrstice je $\tfrac13 \cdot 3 = 1$, zato $Q(1, 1, 1) = (1, 1, 1)$. Os je premica v smeri $(1, 1, 1)$.
5. Kot: $\operatorname{sl} Q = \tfrac{6}{3} = 2$, zato $1 + 2\cos\varphi = 2$ in $\cos\varphi = \tfrac12$, $\varphi = 60^\circ$.
6. Odgovor: satelit se je zasukal za $60^\circ$ okrog osi v smeri $(1, 1, 1)$; razdalje med deli konstrukcije so ostale enake.

### Primer 4: zdaj ti

Območje med dvema krožnima tirnicama okrog planeta (v ravnini tirnic, v enotah polmera planeta) je
$$P = \{(x, y) : 1 \le x^2 + y^2 \le 4\}.$$
Ali je $P$ konveksna množica?

**Podatki:** $P = \{(x, y) : 1 \le x^2 + y^2 \le 4\}$
**Iščemo:** ali je $P$ konveksna

:::formula
$K$ je konveksna, če $tx + (1-t)y \in K$ za vse $x, y \in K$, $t \in [0, 1]$
:::

**Rešitev:**

1. Za protiprimer zadošča en par točk in en $t$. Vzemi točki $(2, 0)$ in $(-2, 0)$; obe ležita v $P$, ker je pri obeh $x^2 + y^2 = 4$.
2. Vzemi $t = \tfrac12$, izračunaj razpolovišče in preveri, ali leži v $P$.

:::premisli
Kje je razpolovišče in kaj sklepaš?
---
Razpolovišče je $(0, 0)$, kjer je $x^2 + y^2 = 0 < 1$, torej $(0, 0) \notin P$. Množica $P$ ni konveksna: daljica med nasprotnima točkama gre skozi planet.
:::

## Pogoste napake

- **»$\|A\|_2$ je največja lastna vrednost $A$.«** Za simetrične matrike je $\|A\|_2$ res največja absolutna vrednost lastne vrednosti, v splošnem pa ne. Za $A = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}$ sta obe lastni vrednosti $1$, a $\|A\|_2 = \tfrac{1 + \sqrt5}{2} \approx 1{,}618$. Prava pot je prek $A^{\mathsf T}A$.
- **Zamenjava stolpcev in vrstic.** $\|A\|_1$ je največja vsota po stolpcih, $\|A\|_\infty$ po vrsticah. Pomnilo: indeks $1$ stoji pokonci kot stolpec.
- **»$\det Q = \pm 1$, torej je izometrija.«** Matrika $\operatorname{diag}(2, \tfrac12)$ ima determinanto $1$, a vektor $(1, 0)$ podaljša na dolžino $2$. Odloča pogoj $Q^{\mathsf T}Q = I$.
- **»Vsaka izometrija je linearna.«** Premik $x \mapsto x + b$ ohranja razdalje, izhodišča pa ne. Splošna izometrija je $Qx + b$.
- **»Unija konveksnih je konveksna.«** Dva ločena kroga sta vsak zase konveksna, unija pa ne. Konveksnost se ohrani pri preseku.

## Povzetek

- Norma: pozitivnost, homogenost, trikotniška neenakost. Na $\mathbb{R}^n$: $\|x\|_1 = \sum|x_i|$, $\|x\|_2 = \sqrt{\sum x_i^2}$, $\|x\|_\infty = \max|x_i|$; velja $\|x\|_\infty \le \|x\|_2 \le \|x\|_1$.
- Enotske krogle v $\mathbb{R}^2$: romb, krog, kvadrat. Vsaka enotska krogla je konveksna.
- Konveksna množica vsebuje daljico med poljubnima svojima točkama; preseki konveksnih so konveksni.
- Inducirana norma matrike: $\|A\| = \max \|Ax\|/\|x\|$; $\|A\|_1$ po stolpcih, $\|A\|_\infty$ po vrsticah, $\|A\|_2 = \sqrt{\lambda_{\max}(A^{\mathsf T}A)}$.
- Izometrije $\mathbb{R}^n$: $x \mapsto Qx + b$, $Q^{\mathsf T}Q = I$. V $\mathbb{R}^2$ rotacije in zrcaljenja; v $\mathbb{R}^3$ rotacije okrog osi ($\det = 1$, os je lastni vektor za $1$, $\operatorname{sl} Q = 1 + 2\cos\varphi$) in rotacije z zrcaljenjem ($\det = -1$).

## Za izpit

Znati moraš povedati:
- definicijo norme (tri aksiome) in norme $\|\cdot\|_1$, $\|\cdot\|_2$, $\|\cdot\|_\infty$ na $\mathbb{R}^n$ z neenakostjo $\|x\|_\infty \le \|x\|_2 \le \|x\|_1$;
- definicijo konveksne množice in dokaz, da je enotska krogla vsake norme konveksna;
- definicijo inducirane norme matrike, formule za $\|A\|_1$, $\|A\|_\infty$, $\|A\|_2$ in izpeljavo $\|A\|_2 = \sqrt{\lambda_{\max}(A^{\mathsf T}A)}$ s spektralnim izrekom;
- definicijo izometrije, izrek $f(x) = Qx + b$ s $Q^{\mathsf T}Q = I$ ter razvrstitev v $\mathbb{R}^2$ in $\mathbb{R}^3$ po $\det Q$;
- kako določiš os in kot rotacije v $\mathbb{R}^3$ ter zakaj os vedno obstaja;
- paralelogramsko pravilo in ekvivalentnost norm v končnorazsežnem prostoru.

### Naloga 1

Zasuk satelita opiše matrika
$$Q = \frac{1}{7}\begin{pmatrix} 3 & 2 & 6 \\ 6 & -3 & -2 \\ 2 & 6 & -3 \end{pmatrix}.$$
(a) Pokaži, da je $Q$ rotacija, ter določi os in kot zasuka. (b) Izračunaj $\|Q\|_1$, $\|Q\|_2$ in $\|Q\|_\infty$. (c) Antena je pred zasukom v točki $x = (7, 0, 0)\,\mathrm{m}$. Izračunaj $Qx$ ter primerjaj $\|x\|_2$ z $\|Qx\|_2$ in $\|x\|_1$ z $\|Qx\|_1$. Kaj sklepaš?

**Rešitev:**

1. Naj bo $M = 7Q$. Kvadrati dolžin stolpcev $M$: $9 + 36 + 4 = 49$, $4 + 9 + 36 = 49$, $36 + 4 + 9 = 49$. Stolpci $Q$ imajo torej dolžino $\tfrac17\sqrt{49} = 1$.
2. Skalarni produkti stolpcev $M$: $6 - 18 + 12 = 0$, $18 - 12 - 6 = 0$, $12 + 6 - 18 = 0$. Zato $Q^{\mathsf T}Q = I$.
3. $\det M = 3(9 + 12) - 2(-18 + 4) + 6(36 + 6) = 63 + 28 + 252 = 343$, zato $\det Q = \tfrac{343}{7^3} = 1$. $Q$ je rotacija.
4. Os: rešimo $(M - 7I)v = 0$, to je $-4v_1 + 2v_2 + 6v_3 = 0$, $6v_1 - 10v_2 - 2v_3 = 0$, $2v_1 + 6v_2 - 10v_3 = 0$. Eliminacija da $v_1 = 2v_3$ in $v_2 = v_3$, torej $v = (2, 1, 1)$.
5. Kot: $\operatorname{sl} Q = \tfrac{3 - 3 - 3}{7} = -\tfrac37$, zato $1 + 2\cos\varphi = -\tfrac37$ in $\cos\varphi = -\tfrac57$, $\varphi \approx 135{,}6^\circ$.
6. Vsota absolutnih vrednosti v vsakem stolpcu in v vsaki vrstici $M$ je $11$ (npr. $3 + 6 + 2$ in $3 + 2 + 6$), zato $\|Q\|_1 = \|Q\|_\infty = \tfrac{11}{7} \approx 1{,}57$.
7. $Q^{\mathsf T}Q = I$ ima edino lastno vrednost $1$, zato $\|Q\|_2 = \sqrt{1} = 1$.
8. $Qx$ je $7$-kratnik prvega stolpca $Q$: $Qx = (3, 6, 2)\,\mathrm{m}$.
9. $\|x\|_2 = 7\,\mathrm{m}$ in $\|Qx\|_2 = \sqrt{9 + 36 + 4} = 7\,\mathrm{m}$; $\|x\|_1 = 7\,\mathrm{m}$, $\|Qx\|_1 = 3 + 6 + 2 = 11\,\mathrm{m}$.
10. Odgovor: $Q$ je rotacija za približno $135{,}6^\circ$ okrog osi v smeri $(2, 1, 1)$; $\|Q\|_1 = \|Q\|_\infty = \tfrac{11}{7}$, $\|Q\|_2 = 1$. Rotacija ohranja normo $\|\cdot\|_2$, norme $\|\cdot\|_1$ pa ne: pri $x = (7, 0, 0)$ jo poveča s $7$ na $11\,\mathrm{m}$, kar je natanko meja $\|Q\|_1\|x\|_1 = \tfrac{11}{7} \cdot 7$. Ali je preslikava izometrija, je torej odvisno od izbrane norme.

### Naloga 2

Natančno navedi definicijo inducirane norme matrike. Dokaži, da za vsako inducirano normo velja $\|AB\| \le \|A\|\,\|B\|$ in da je $|\lambda| \le \|A\|$ za vsako realno lastno vrednost $\lambda$ matrike $A$. Utemelji, ali je Frobeniusova norma inducirana, če je $n \ge 2$.

**Rešitev:**

1. Definicija: za normo $\|\cdot\|$ na $\mathbb{R}^n$ je $\|A\| = \max\limits_{x \ne 0} \dfrac{\|Ax\|}{\|x\|}$. Od tod $\|Ax\| \le \|A\|\,\|x\|$ za vsak $x$ (pri $x = 0$ velja enakost).
2. Produkt: za vsak $x$ dvakrat uporabimo to neenakost: $\|ABx\| = \|A(Bx)\| \le \|A\|\,\|Bx\| \le \|A\|\,\|B\|\,\|x\|$.
3. Za $x \ne 0$ delimo z $\|x\|$: $\dfrac{\|ABx\|}{\|x\|} \le \|A\|\,\|B\|$. Meja velja za vse $x \ne 0$, torej tudi za maksimum: $\|AB\| \le \|A\|\,\|B\|$.
4. Lastna vrednost: naj bo $Av = \lambda v$, $v \ne 0$. Po homogenosti je $\|Av\| = \|\lambda v\| = |\lambda|\,\|v\|$.
5. Zato $\dfrac{\|Av\|}{\|v\|} = |\lambda|$. Maksimum po vseh $x \ne 0$ je vsaj tolikšen, torej $\|A\| \ge |\lambda|$.
6. Enakost ne velja vedno: $A = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}$ ima edino lastno vrednost $1$, a $\|A\|_2 = \tfrac{1 + \sqrt5}{2} \approx 1{,}618$.
7. Frobeniusova norma: za vsako inducirano normo je $\|I\| = \max \tfrac{\|x\|}{\|x\|} = 1$. Toda $\|I\|_F = \sqrt{n}$, ker ima $I$ natanko $n$ enic.
8. Odgovor: obe neenakosti sledita iz $\|Ax\| \le \|A\|\,\|x\|$ in homogenosti. Za $n \ge 2$ je $\|I\|_F = \sqrt{n} > 1$, zato Frobeniusova norma ni inducirana z nobeno vektorsko normo.

### Naloga 3

Na $\mathbb{R}^2$ je dan izraz $N(x) = 2|x_1| + 3|x_2|$. (a) Dokaži, da je $N$ norma. (b) Opiši njeno enotsko kroglo. (c) Določi največji $c$ in najmanjši $C$, za katera velja $c\,\|x\|_2 \le N(x) \le C\,\|x\|_2$ za vse $x \in \mathbb{R}^2$. (d) Utemelji, ali $N$ izvira iz skalarnega produkta.

**Rešitev:**

1. Pozitivnost: $N(x) \ge 0$ in $N(x) = 0$ natanko tedaj, ko $|x_1| = |x_2| = 0$, torej $x = 0$.
2. Homogenost: $N(\alpha x) = 2|\alpha x_1| + 3|\alpha x_2| = |\alpha|\,N(x)$.
3. Trikotniška neenakost: iz $|x_i + y_i| \le |x_i| + |y_i|$ sledi $N(x + y) \le 2|x_1| + 2|y_1| + 3|x_2| + 3|y_2| = N(x) + N(y)$. $N$ je norma.
4. Enotska krogla $2|x_1| + 3|x_2| \le 1$ je romb z oglišči $(\pm\tfrac12, 0)$ in $(0, \pm\tfrac13)$; kot krogla norme je konveksna.
5. Zgornja meja: po Cauchy-Schwarzovi neenakosti za vektorja $(2, 3)$ in $(|x_1|, |x_2|)$ je $N(x) \le \sqrt{4 + 9}\,\|x\|_2 = \sqrt{13}\,\|x\|_2$. Enakost pri $x = (2, 3)$: $N(x) = 4 + 9 = 13 = \sqrt{13} \cdot \sqrt{13}$. Zato $C = \sqrt{13} \approx 3{,}61$.
6. Spodnja meja: $N(x) \ge 2|x_1| + 2|x_2| = 2\|x\|_1 \ge 2\|x\|_2$. Enakost pri $x = (1, 0)$: $N(x) = 2 = 2\|x\|_2$. Zato $c = 2$.
7. Paralelogramsko pravilo za $x = (1, 0)$, $y = (0, 1)$: $N(x + y) = N(x - y) = 5$, leva stran je $25 + 25 = 50$; desna je $2 \cdot 2^2 + 2 \cdot 3^2 = 26$.
8. Odgovor: $N$ je norma z enotsko kroglo v obliki romba z oglišči $(\pm\tfrac12, 0)$, $(0, \pm\tfrac13)$; velja $2\|x\|_2 \le N(x) \le \sqrt{13}\,\|x\|_2$ in mej ni mogoče izboljšati. Ker $50 \ne 26$, $N$ ne izvira iz skalarnega produkta.

## Drugače: Na sliki

Nariši vse tri enotske krogle v isti koordinatni sistem:

:::risba skica
opis: Tri enotske krogle v isti ravnini s središčem v izhodišču. Zunanji kvadrat z oglišči (1, 1), (−1, 1), (−1, −1) in (1, −1) je krogla norme neskončno. Vanj je včrtan krog s polmerom 1, krogla norme 2. V krog je včrtan romb z oglišči (1, 0), (0, 1), (−1, 0) in (0, −1), krogla norme 1. Krog se dotika kvadrata v ogliščih romba.
območje: -1,6; -2,3 .. 1,6; 1,6
enota: 90
črta: -1,5; 0 -> 1,5; 0 | siva puščica
črta: 0; -1,3 -> 0; 1,5 | siva puščica
lik: 1; 1 -> -1; 1 -> -1; -1 -> 1; -1 | modra
krog: 0; 0 | 1 | zelena
lik: 1; 0 -> 0; 1 -> -1; 0 -> 0; -1 | oranžna črtkano
točka: 1; 0 | (1, 0) | pod desno
točka: 0; 1 | (0, 1) | nad desno
točka: -1; 0 | (−1, 0) | pod levo
točka: 0; -1 | (0, −1) | pod desno
točka: 1; 1 | (1, 1) | nad desno
napis: -1,2; -1,6 | kvadrat: norma ∞ | desno | modra
napis: -1,2; -1,9 | krog: norma 2 | desno | zelena
napis: -1,2; -2,2 | črtkani romb: norma 1 | desno | oranžna
podnapis: Romb je včrtan krogu, krog je včrtan kvadratu.
:::

- Zunanji kvadrat z oglišči v $(\pm 1, \pm 1)$ je krogla $\|x\|_\infty \le 1$.
- Črtkani romb z oglišči v $(\pm 1, 0)$ in $(0, \pm 1)$ je krogla $\|x\|_1 \le 1$.
- Krog $\|x\|_2 \le 1$ poteka skozi štiri oglišča romba in leži med rombom in kvadratom.

Nobena krogla nima vdolbine; daljica med dvema njenima točkama nikoli ne gre ven. To je konveksnost.

Norma matrike na sliki: $A$ preslika enotski krog v elipso. Pri $A = \begin{pmatrix} 3 & 0 \\ 4 & 5 \end{pmatrix}$ ima elipsa polosi $\sqrt{45}$ in $\sqrt5$, ker sta to korena lastnih vrednosti $A^{\mathsf T}A$. Daljša polos je $\|A\|_2$. Izometrija pa krog preslika spet v krog z istim polmerom; rotacija ga le zavrti, zrcaljenje obrne smer obhoda.

## Drugače: Bolj natančno

**Trikotniška neenakost za $\|\cdot\|_2$.** Iz Cauchy-Schwarzove neenakosti $|\langle x, y\rangle| \le \|x\|\,\|y\|$:
$$\|x + y\|^2 = \|x\|^2 + 2\langle x, y\rangle + \|y\|^2 \le (\|x\| + \|y\|)^2.$$

**Katere norme izvirajo iz skalarnega produkta.** Natanko tiste, ki zadoščajo paralelogramskemu pravilu $\|x + y\|^2 + \|x - y\|^2 = 2\|x\|^2 + 2\|y\|^2$. Za $\|\cdot\|_1$ in $x = (1, 0)$, $y = (0, 1)$ je leva stran $8$, desna $4$; zato $\|\cdot\|_1$ ni porojena s skalarnim produktom.

**Ekvivalentnost norm.** V končnorazsežnem prostoru za poljubni normi obstajata $c, C > 0$, da $c\|x\| \le \|x\|' \le C\|x\|$. Na $\mathbb{R}^n$ na primer $\|x\|_2 \le \|x\|_1 \le \sqrt{n}\,\|x\|_2$. Konvergenca torej ni odvisna od izbire norme.

**Formula za $\|A\|_2$.** $\|Ax\|_2^2 = \langle A^{\mathsf T}Ax, x\rangle$. Po spektralnem izreku ima $A^{\mathsf T}A$ ortonormirano bazo lastnih vektorjev z lastnimi vrednostmi $\mu_i \ge 0$. Za $x = \sum c_i u_i$ je $\langle A^{\mathsf T}Ax, x\rangle = \sum \mu_i c_i^2 \le \mu_{\max}\|x\|^2$, enakost pri lastnem vektorju za $\mu_{\max}$.

**Izometrije.** Naj bo $f$ izometrija z $f(0) = 0$. Iz $\|f(x)\| = \|x\|$ in $\|f(x) - f(y)\| = \|x - y\|$ s polarizacijo sledi $\langle f(x), f(y)\rangle = \langle x, y\rangle$. Slike ortonormirane baze so ortonormirane; razvoj $f(x)$ po njih pokaže, da je $f$ linearna z ortogonalno matriko. Za splošno $f$ vzamemo $b = f(0)$ in obravnavamo $x \mapsto f(x) - b$.

## Preveri se

? Katera slika ustreza enotski krogli $\{x \in \mathbb{R}^2 : \|x\|_\infty \le 1\}$?
- Krog s polmerom $1$.
~ Krog je enotska krogla norme $\|\cdot\|_2$, ne $\|\cdot\|_\infty$.
- Kvadrat z oglišči v $(\pm 1, 0)$ in $(0, \pm 1)$.
~ To je romb norme $\|\cdot\|_1$: tam je vsota absolutnih vrednosti največ $1$.
+ Kvadrat z oglišči v $(\pm 1, \pm 1)$.
> $\max(|x_1|, |x_2|) \le 1$ pomeni $-1 \le x_1 \le 1$ in $-1 \le x_2 \le 1$: kvadrat s stranicami, vzporednimi osema.

? Oceni $\|(10;\ 0{,}1;\ 0{,}2)\|_2$.
- Približno $10{,}3$.
~ To je $\|\cdot\|_1$: koordinate si seštel. Pri $\|\cdot\|_2$ seštevaš kvadrate, majhni kvadrati skoraj nič ne prispevajo.
+ Približno $10{,}0$.
- Približno $3{,}4$.
~ To je povprečje koordinat, ne norma. Norma je vsaj tolikšna kot največja koordinata.
> $\sqrt{100 + 0{,}01 + 0{,}04} = \sqrt{100{,}05} \approx 10{,}0025$. Majhne koordinate dolžino komaj spremenijo.

? Zakaj je enotska krogla vsake norme konveksna?
- Ker je vedno okrogla.
~ Krogla norme $\|\cdot\|_1$ je romb, $\|\cdot\|_\infty$ kvadrat; nista okrogli, a sta konveksni.
+ Ker iz trikotniške neenakosti in homogenosti sledi $\|tx + (1-t)y\| \le t\|x\| + (1-t)\|y\| \le 1$.
- Ker je omejena množica.
~ Omejenost ne zadošča: kolobar $1 \le \|x\|_2 \le 2$ je omejen, a ni konveksen.
> Konveksnost krogle je neposredna posledica aksiomov norme, zato se izrazi, ki dajo nekonveksno »kroglo«, ne morejo biti norme.

? Kolikšna je $\|A\|_1$ za $A = \begin{pmatrix} 1 & -5 \\ 3 & 2 \end{pmatrix}$?
- $6$
~ To je $\|A\|_\infty$: seštel si po vrsticah ($1 + 5 = 6$). Pri $\|A\|_1$ seštevaš po stolpcih.
- $4$
~ Pozabil si absolutne vrednosti: drugi stolpec da $|-5| + |2| = 7$, ne $-3$.
+ $7$
> Vsoti absolutnih vrednosti po stolpcih sta $1 + 3 = 4$ in $5 + 2 = 7$, zato $\|A\|_1 = 7$.

? Sonda posname sliko, ki jo programska oprema transformira z matriko $\begin{pmatrix} 0{,}6 & 0{,}8 \\ 0{,}8 & -0{,}6 \end{pmatrix}$. Kaj se zgodi s sliko?
- Zavrti se za približno $53^\circ$.
~ Stolpca sta res ortonormirana, a $\det = -0{,}36 - 0{,}64 = -1$. Rotacija ima determinanto $1$.
+ Prezrcali se čez premico skozi izhodišče; razdalje se ohranijo.
- Raztegne se, ker so elementi različni od $0$ in $1$.
~ Ohranitev dolžin ni odvisna od posameznih elementov, temveč od $Q^{\mathsf T}Q = I$, kar tu velja.
> $Q^{\mathsf T}Q = I$, torej izometrija, in $\det Q = -1$, torej zrcaljenje. Premica zrcaljenja ima smer lastnega vektorja $(2, 1)$ za lastno vrednost $1$.

:::simboli
x, y | vektorja normiranega prostora
x_i | komponente vektorja x
t | parameter na daljici med x in y | | | t ∈ [0, 1]
K | konveksna množica | | | vsebuje daljico med poljubnima točkama
P | množica, katere konveksnost preverjamo
A | matrika (linearna preslikava) | | | ‖Ax‖ ≤ ‖A‖ ‖x‖
Q | ortogonalna matrika | Q^{\mathsf T}Q = I | | det Q = ±1
T | transponiranje (oznaka Aᵀ)
I | identična (enotska) matrika
\lambda_{\max} | največja lastna vrednost matrike AᵀA
d | vektor odmika sonde od točke srečanja | | km
d_i | komponente vektorja odmika | | km
e | napaka usmeritve teleskopa | | ″ | v kotnih sekundah
v | os rotacije (vektor s Qv = v)
\varphi | kot rotacije
:::
