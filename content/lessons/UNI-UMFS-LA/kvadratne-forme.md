---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Lagrange in Laplace sta v 18. stoletju računala, ali se bodo tiri planetov zaradi medsebojnega privlaka počasi, a neomejeno spreminjali. Odgovor je bil odvisen od tega, ali so vse ničle neke enačbe realne. Za posebne primere sta to pokazala, splošen dokaz pa je leta $1829$ objavil Cauchy: enačba je karakteristični polinom **simetrične** matrike, in ta ima vedno realne lastne vrednosti. Isti izrek danes uporablja meteorolog, ko išče smer, v kateri veter najbolj niha, inženir, ko išče glavne napetosti v nosilcu, in vsak, ki želi vedeti, ali ima funkcija minimum. Vsem je skupen izraz oblike $ax^2 + bxy + cy^2$: **kvadratna forma**.

## Razlaga

### Slike najprej: nivojnice treh izrazov

Narišimo krivulje, na katerih ima izraz vrednost $1$:

| Izraz | Krivulja $= 1$ |
|---|---|
| $x^2 + 4y^2$ | elipsa vzdolž osi |
| $5x^2 + 4xy + 2y^2$ | zasukana elipsa |
| $x^2 - y^2$ | hiperbola |

Prvi izraz je za vsako točko razen izhodišča pozitiven; elipsa ima polosi $1$ in $\tfrac{1}{2}$ vzdolž koordinatnih osi. Drugi je tudi pozitiven, a mešani člen $4xy$ elipso zasuka; osi elipse niso več osi koordinatnega sistema. Tretji je v smeri $x$ pozitiven, v smeri $y$ negativen; nivojnica ni sklenjena. Cilj lekcije: iz koeficientov razbrati, kam kažejo osi in ali je slika elipsa ali hiperbola, brez risanja.

### Matrika kvadratne forme

**Definicija.** **Kvadratna forma** v $n$ spremenljivkah je funkcija $q(x) = x^T A x = \sum_{i,j} a_{ij} x_i x_j$, kjer je $x$ stolpec spremenljivk in $A$ **simetrična** matrika ($A^T = A$). Vsak člen je stopnje $2$.

Iz izraza dobimo matriko tako, da na diagonalo napišemo koeficiente pri kvadratih, koeficient mešanega člena pa **razpolovimo** med obe simetrični mesti. Za $q = 5x^2 + 4xy + 2y^2$:

$$A = \begin{bmatrix} 5 & 2 \\ 2 & 2 \end{bmatrix}.$$

Zakaj razpolovimo? Produkt $x^T A x$ vsebuje $a_{12}xy + a_{21}yx = 2a_{12}xy$, zato mora biti $2a_{12} = 4$. Simetrično matriko izberemo zato, ker je enolična in ker zanjo velja spodnji izrek.

### Spektralni izrek

**Izrek (spektralni izrek za simetrične matrike).** Naj bo $A$ realna simetrična matrika reda $n$. Potem:

1. so vse lastne vrednosti $A$ realne;
2. so lastni vektorji za različne lastne vrednosti pravokotni;
3. obstaja ortonormirana baza iz lastnih vektorjev, torej ortogonalna matrika $Q$ ($Q^T Q = I$), da je $Q^T A Q = D$ diagonalna z lastnimi vrednostmi na diagonali.

*Dokaz točke 2.* Naj bo $Av = \lambda v$ in $Aw = \mu w$, $\lambda \ne \mu$. Potem je $\lambda\, v^T w = (Av)^T w = v^T A^T w = v^T A w = \mu\, v^T w$. Torej $(\lambda - \mu) v^T w = 0$ in zato $v^T w = 0$.

*Dokaz točke 1.* Naj bo $Av = \lambda v$ z morda kompleksnim $\lambda$ in $v \ne 0$; $\bar v$ je konjugirani vektor. Ker je $A$ realna in simetrična, je $\bar v^T A v$ realno število (enako svojemu konjugiranemu). Hkrati je $\bar v^T A v = \lambda\, \bar v^T v$, kjer je $\bar v^T v = \sum |v_i|^2 > 0$ realno. Zato je tudi $\lambda$ realna. Točke 3 tu ne dokazujemo; dokaz gre z indukcijo po $n$.

:::premisli
Matrika $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$ zasuka ravnino za $90^\circ$. Ali ima realne lastne vrednosti? Kaj to pove o pogoju simetričnosti v izreku?
---
Nima: noben neničelni vektor po zasuku za $90^\circ$ ne kaže v isto ali nasprotno smer; karakteristični polinom $\lambda^2 + 1$ nima realnih ničel. Matrika ni simetrična. Brez simetričnosti izrek ne velja.
:::

### Glavne osi

**Izrek (o glavnih oseh).** Naj bo $q(x) = x^T A x$ in $Q^T A Q = D$ kot v spektralnem izreku. Z novimi koordinatami $x = Qu$ (zasuk, morda z zrcaljenjem) se forma glasi

$$q = \lambda_1 u_1^2 + \lambda_2 u_2^2 + \dots + \lambda_n u_n^2,$$

brez mešanih členov. *Izpeljava:* $q = (Qu)^T A (Qu) = u^T (Q^T A Q) u = u^T D u$. Osi novih koordinat so smeri lastnih vektorjev, to so **glavne osi**.

Za $5x^2 + 4xy + 2y^2$ ima $A$ lastni vrednosti $6$ in $1$ z lastnima vektorjema $(2, 1)/\sqrt{5}$ in $(1, -2)/\sqrt{5}$. Torej $q = 6u_1^2 + u_2^2$ v novih koordinatah. Nivojnica $q = 1$ je elipsa s polosjo $1/\sqrt{6}$ v smeri $(2, 1)$ in polosjo $1$ v smeri $(1, -2)$. Večja lastna vrednost pomeni hitrejšo rast forme in **krajšo** polos.

**Izrek (ekstremi na enotski krožnici).** Za enotski vektor $e$ ($e^T e = 1$) je $\lambda_{min} \le q(e) \le \lambda_{max}$. Največjo vrednost doseže v smeri lastnega vektorja za $\lambda_{max}$, najmanjšo v smeri lastnega vektorja za $\lambda_{min}$. *Dokaz:* v glavnih oseh je $q = \sum \lambda_i u_i^2$ z $\sum u_i^2 = 1$ (zasuk ohrani dolžino), torej je $q$ tehtano povprečje lastnih vrednosti.

### Definitnost

**Definicija.** Forma $q$ (in matrika $A$) je

- **pozitivno definitna**, če je $q(x) > 0$ za vsak $x \ne 0$;
- **pozitivno semidefinitna**, če je $q(x) \ge 0$ za vsak $x$;
- **negativno (semi)definitna**, če to velja za $-q$;
- **nedefinitna**, če zavzame pozitivne in negativne vrednosti.

Iz glavnih osi takoj sledi: $q$ je pozitivno definitna natanko tedaj, ko so **vse lastne vrednosti pozitivne**; nedefinitna, ko so med njimi pozitivne in negativne. V ravnini da pozitivno definitna forma elipso, nedefinitna hiperbolo; v prostoru elipsoid ali hiperboloid.

**Izrek (Sylvestrov kriterij).** Simetrična matrika $A$ je pozitivno definitna natanko tedaj, ko so vse **vodilne glavne poddeterminante** pozitivne: $\Delta_1 = a_{11} > 0$, $\Delta_2 = \det\begin{bmatrix} a_{11} & a_{12} \\ a_{12} & a_{22} \end{bmatrix} > 0$, …, $\Delta_n = \det A > 0$. Negativno definitna je, ko predznaki izmenično začnejo z minusom: $\Delta_1 < 0$, $\Delta_2 > 0$, $\Delta_3 < 0$, …

*Dokaz za $n = 2$.* Naj bo $q = ax^2 + 2bxy + cy^2$. Za $a \ne 0$ dopolnimo do popolnega kvadrata: $q = a\left(x + \tfrac{b}{a}y\right)^2 + \tfrac{ac - b^2}{a}y^2$. (⇐) Naj bosta $a > 0$ in $ac - b^2 > 0$. Oba člena sta nenegativna, vsota je nič le pri $y = 0$ in $x + \tfrac{b}{a}y = 0$, torej pri $x = y = 0$; forma je pozitivno definitna. (⇒) Če je $a \le 0$, je $q(1, 0) = a \le 0$. Če je $a > 0$ in $ac - b^2 \le 0$, vstavimo neničelni vektor $(-b, a)$: $q(-b, a) = ab^2 - 2ab^2 + ca^2 = a(ac - b^2) \le 0$. V obeh primerih forma ni pozitivno definitna, zato pozitivna definitnost zahteva $\Delta_1 = a > 0$ in $\Delta_2 = ac - b^2 > 0$.

:::premisli
Matrika ima $\Delta_1 = 2$ in $\Delta_2 = -3$. Je forma pozitivno definitna, negativno definitna ali nedefinitna? Kaj pove $\Delta_2 < 0$ o predznakih lastnih vrednosti?
---
Nedefinitna. $\Delta_2 = \det A = \lambda_1\lambda_2 < 0$, zato sta lastni vrednosti nasprotnih predznakov in nivojnica je hiperbola. Pogoj za negativno definitnost ($\Delta_1 < 0$, $\Delta_2 > 0$) tudi ni izpolnjen.
:::

## Rešeni primeri

### Primer 1 (lažji)

Zapiši matriko forme $q(x, y) = 3x^2 - 2xy + 3y^2$, ugotovi njeno definitnost s Sylvestrovim kriterijem in z lastnimi vrednostmi.

**Podatki:** $q = 3x^2 - 2xy + 3y^2$
**Iščemo:** simetrično matriko $A$, definitnost

:::formula
$a_{12} = a_{21} = \tfrac{1}{2} \cdot$ (koeficient pri $xy$); $\Delta_1 = a_{11}$, $\Delta_2 = \det A$; $\det(A - \lambda I) = 0$
:::

**Rešitev:**

1. Mešani koeficient $-2$ razpolovimo: $A = \begin{bmatrix} 3 & -1 \\ -1 & 3 \end{bmatrix}$.
2. Sylvester: $\Delta_1 = 3 > 0$; $\Delta_2 = 3 \cdot 3 - (-1) \cdot (-1) = 8 > 0$. Forma je pozitivno definitna.
3. Preizkus z lastnimi vrednostmi: $(3 - \lambda)^2 - 1 = 0$ (enačba), torej $\lambda_1 = 2$, $\lambda_2 = 4$; obe pozitivni.
4. Odgovor: $A = \begin{bmatrix} 3 & -1 \\ -1 & 3 \end{bmatrix}$, forma je pozitivno definitna; nivojnice so elipse.

### Primer 2

Merilna postaja na obali je eno leto merila vzhodno ($u$) in severno ($v$) komponento vetra. Kovariančna matrika odstopanj od povprečja je $C = \begin{bmatrix} 9 & 4 \\ 4 & 3 \end{bmatrix}\,\mathrm{m^2/s^2}$. Varianca komponente vetra v smeri enotskega vektorja $e$ je kvadratna forma $e^T C e$. V kateri smeri veter najbolj niha, kolikšna je tam standardna deviacija in kolikšna v pravokotni smeri?

**Podatki:** $C = \begin{bmatrix} 9 & 4 \\ 4 & 3 \end{bmatrix}\,\mathrm{m^2/s^2}$, varianca v smeri $e$ je $e^T C e$, $e^T e = 1$
**Iščemo:** smer največje variance, standardni deviaciji vzdolž glavnih osi

:::formula
$\det(C - \lambda I) = 0$; največja vrednost $e^T C e$ je $\lambda_{max}$; $\sigma = \sqrt{\lambda}$
:::

**Rešitev:**

1. Karakteristični polinom: $\lambda^2 - 12\lambda + 11 = 0$ (enačba), ker je sled $12$ in determinanta $27 - 16 = 11$.
2. Lastni vrednosti: $\lambda_{1,2} = 6 \pm 5$, torej $\lambda_1 = 11\,\mathrm{m^2/s^2}$ in $\lambda_2 = 1\,\mathrm{m^2/s^2}$.
3. Lastni vektor za $11$: iz $(9 - 11)u + 4v = 0$ sledi $v = u/2$, smer $(2, 1)/\sqrt{5}$.
4. Kot glede na vzhod: $\arctan(1/2) \approx 26{,}6^\circ$ proti severu. Za $1$ je smer $(1, -2)/\sqrt{5}$, pravokotna.
5. Po izreku o ekstremih je največja varianca $11\,\mathrm{m^2/s^2}$, standardna deviacija $\sqrt{11} \approx 3{,}3\,\mathrm{m/s}$; v pravokotni smeri $1{,}0\,\mathrm{m/s}$.
6. Odgovor: veter najbolj niha v smeri vzhod-severovzhod (okoli $27^\circ$ severno od vzhoda) s standardno deviacijo okoli $3{,}3\,\mathrm{m/s}$, pravokotno nanjo le $1{,}0\,\mathrm{m/s}$. Glavna os variabilnosti je pogosto vzporedna z obalo ali z dolino.

### Primer 3 (težji)

Dana je forma $q = 2x^2 + 2y^2 + 2z^2 + 2xy + 2yz + 2xz$. a) Ugotovi njeno definitnost. b) Poišči ortogonalno matriko $Q$, ki formo pretvori v glavne osi, in zapiši formo v novih koordinatah. c) Kakšna ploskev je $q = 4$ in kolikšne so njene polosi?

**Podatki:** $q = 2x^2 + 2y^2 + 2z^2 + 2xy + 2yz + 2xz$, ploskev $q = 4$
**Iščemo:** definitnost, $Q$ in $q(u)$, vrsto ploskve in polosi

:::formula
$A$ simetrična; $Q^T A Q = D$; polos v smeri $\lambda_i$ je $\sqrt{c/\lambda_i}$ za ploskev $q = c$
:::

**Rešitev:**

1. Matrika: $A = \begin{bmatrix} 2 & 1 & 1 \\ 1 & 2 & 1 \\ 1 & 1 & 2 \end{bmatrix}$ (mešani koeficienti $2$ razpolovljeni).
2. a) Sylvester: $\Delta_1 = 2$, $\Delta_2 = 4 - 1 = 3$, $\Delta_3 = \det A = 2(4 - 1) - 1(2 - 1) + 1(1 - 2) = 4$; vse pozitivne, forma je pozitivno definitna.
3. b) $A = I + J$, kjer ima $J$ same enice. Vektor $(1, 1, 1)$ da $A(1, 1, 1)^T = (4, 4, 4)^T$, torej $\lambda_1 = 4$.
4. Vsak vektor z vsoto komponent $0$ da $J v = 0$, zato $Av = v$: $\lambda_2 = \lambda_3 = 1$. Preizkus: $4 \cdot 1 \cdot 1 = 4 = \det A$.
5. Lastni prostor za $1$ je ravnina $x + y + z = 0$; v njej izberemo pravokotna vektorja $(1, -1, 0)$ in $(1, 1, -2)$ (skalarni produkt $1 - 1 + 0 = 0$).
6. Normiramo: $Q = \begin{bmatrix} 1/\sqrt{3} & 1/\sqrt{2} & 1/\sqrt{6} \\ 1/\sqrt{3} & -1/\sqrt{2} & 1/\sqrt{6} \\ 1/\sqrt{3} & 0 & -2/\sqrt{6} \end{bmatrix}$; v novih koordinatah $q = 4u_1^2 + u_2^2 + u_3^2$.
7. c) $q = 4$: $u_1^2 + u_2^2/4 + u_3^2/4 = 1$, elipsoid s polosjo $\sqrt{4/4} = 1$ v smeri $(1, 1, 1)$ in polosema $\sqrt{4/1} = 2$ v ravnini $x + y + z = 0$.
8. Odgovor: forma je pozitivno definitna; v glavnih oseh $q = 4u_1^2 + u_2^2 + u_3^2$. Ploskev $q = 4$ je **rotacijski** elipsoid z osjo $(1, 1, 1)$, polosjo $1$ vzdolž osi in polosema $2$ pravokotno nanjo. Ker je $\lambda = 1$ dvojna, lahko $u_2$ in $u_3$ zavrtimo okoli osi poljubno.

### Primer 4 – zdaj ti

Kakšna krivulja je $5x^2 + 4xy + 2y^2 = 6$? Določi glavne osi in polosi.

**Podatki:** $5x^2 + 4xy + 2y^2 = 6$
**Iščemo:** vrsto krivulje, smeri glavnih osi, polosi

:::formula
$q = \lambda_1 u_1^2 + \lambda_2 u_2^2$ v glavnih oseh; polos $\sqrt{c/\lambda_i}$
:::

**Rešitev:**

1. $A = \begin{bmatrix} 5 & 2 \\ 2 & 2 \end{bmatrix}$, sled $7$, determinanta $6$: $\lambda^2 - 7\lambda + 6 = 0$ (enačba), $\lambda_1 = 6$, $\lambda_2 = 1$.
2. Lastna vektorja: $(2, 1)/\sqrt{5}$ za $6$ in $(1, -2)/\sqrt{5}$ za $1$.
3. Zapiši enačbo v novih koordinatah in preberi polosi.

:::premisli
Kakšna je krivulja in kolikšni sta polosi?
---
$6u_1^2 + u_2^2 = 6$, torej $u_1^2 + u_2^2/6 = 1$: elipsa s polosjo $1$ v smeri $(2, 1)$ in polosjo $\sqrt{6} \approx 2{,}45$ v smeri $(1, -2)$. Daljša polos je v smeri manjše lastne vrednosti.
:::

## Pogoste napake

- **Mešani koeficient ni razpolovljen.** Za $4xy$ napišejo $4$ na obe mesti in dobijo $8xy$. Preizkus: zmnoži $x^T A x$ nazaj.
- **Pozitivni diagonalni elementi = pozitivna definitnost.** Pri $x^2 + 4xy + y^2$ sta oba diagonalna elementa $1$, a $q(1, -1) = -2$. Potreben je še $\Delta_2 > 0$.
- **Negativna definitnost z vsemi $\Delta_k < 0$.** Pravilno je izmenjevanje predznakov, $\Delta_1 < 0$, $\Delta_2 > 0$, … Determinanta $2 \times 2$ matrike $-A$ je enaka determinanti $A$.
- **Daljša polos pri večji lastni vrednosti.** Pri $\lambda u^2 = c$ je $u = \sqrt{c/\lambda}$; večji $\lambda$ da krajšo polos.
- **Lastni vektorji za dvojno lastno vrednost niso ortogonalizirani.** Izrek zagotovi pravokotnost le za različne lastne vrednosti; znotraj lastnega prostora pravokotne vektorje izberemo sami (Gram-Schmidt).

## Povzetek

- Kvadratna forma $q = x^T A x$ s simetrično $A$; mešani koeficient razpolovimo.
- Spektralni izrek: simetrična realna matrika ima realne lastne vrednosti in ortonormirano bazo lastnih vektorjev, $Q^T A Q = D$.
- Glavne osi: z $x = Qu$ je $q = \sum \lambda_i u_i^2$; polosi ploskve $q = c$ so $\sqrt{c/\lambda_i}$.
- Na enotski sferi je $\lambda_{min} \le q \le \lambda_{max}$, ekstrema v lastnih smereh.
- Definitnost iz predznakov lastnih vrednosti ali po Sylvestru; pozitivno definitna da elipso ali elipsoid, nedefinitna hiperbolo ali hiperboloid.

## Za izpit

Znati moraš povedati:

- definicijo kvadratne forme in njene simetrične matrike;
- spektralni izrek s pogojem simetričnosti ter dokaza realnosti lastnih vrednosti in pravokotnosti lastnih vektorjev;
- izrek o glavnih oseh z izpeljavo $q = u^T D u$;
- definicije definitnosti in zvezo s predznaki lastnih vrednosti;
- Sylvestrov kriterij in njegov dokaz za $n = 2$.

### Naloga 1

Dana je forma $q = x^2 + 2y^2 + az^2 + 2xy + 2yz$, $a \in \mathbb{R}$. a) Za katere $a$ je pozitivno definitna? b) Za mejno vrednost $a$ poišči neničeln vektor $v$ z $q(v) = 0$ in utemelji, da je forma tedaj pozitivno semidefinitna. c) Kakšna je forma za $a = 0$?

**Rešitev:**

1. $A = \begin{bmatrix} 1 & 1 & 0 \\ 1 & 2 & 1 \\ 0 & 1 & a \end{bmatrix}$.
2. $\Delta_1 = 1$; $\Delta_2 = 2 - 1 = 1$; $\Delta_3 = 1(2a - 1) - 1(a - 0) = a - 1$.
3. a) Po Sylvestru je forma pozitivno definitna natanko za $a > 1$.
4. b) Pri $a = 1$ je $\det A = 0$, zato je $0$ lastna vrednost. Rešimo $Av = 0$: $x + y = 0$, $y + z = 0$ da $v = (1, -1, 1)$; preizkus druge vrstice $1 - 2 + 1 = 0$.
5. Dopolnimo do kvadratov pri $a = 1$: $q = (x + y)^2 + (y + z)^2 \ge 0$, enako nič natanko za $x = -y = z$. Forma je pozitivno semidefinitna, ne definitna.
6. c) Pri $a = 0$: $q = (x + y)^2 + (y + z)^2 - z^2$; za $v = (1, -1, 1)$ je $q(v) = -1 < 0$, za $(1, 0, 0)$ pa $q = 1 > 0$. Forma je nedefinitna (tudi $\det A = -1 < 0$ ob $\Delta_1, \Delta_2 > 0$).
7. Odgovor: a) $a > 1$; b) $v = (1, -1, 1)$, $q = (x + y)^2 + (y + z)^2$; c) nedefinitna.

### Naloga 2

Natančno navedi spektralni izrek za realne simetrične matrike. Dokaži, da so lastne vrednosti realne in da so lastni vektorji za različne lastne vrednosti pravokotni. Nato dokaži: simetrična $A$ je pozitivno definitna natanko tedaj, ko so vse njene lastne vrednosti pozitivne.

**Rešitev:**

1. Izrek: realna simetrična matrika reda $n$ ima realne lastne vrednosti, in obstaja ortogonalna $Q$, da je $Q^T A Q$ diagonalna; stolpci $Q$ so ortonormirani lastni vektorji.
2. Realnost: za $Av = \lambda v$, $v \ne 0$, je $\bar v^T A v$ realno, ker je $\overline{\bar v^T A v} = v^T A \bar v = (v^T A \bar v)^T = \bar v^T A^T v = \bar v^T A v$. Iz $\bar v^T A v = \lambda\, \bar v^T v$ in $\bar v^T v > 0$ sledi $\lambda \in \mathbb{R}$.
3. Pravokotnost: $\lambda\, v^T w = (Av)^T w = v^T A w = \mu\, v^T w$, zato $(\lambda - \mu) v^T w = 0$; pri $\lambda \ne \mu$ je $v^T w = 0$.
4. Definitnost (⇒): če je $A$ pozitivno definitna in $Av = \lambda v$, $v \ne 0$, je $0 < v^T A v = \lambda\, v^T v$, zato $\lambda > 0$.
5. Definitnost (⇐): z $x = Qu$ je $q = \sum \lambda_i u_i^2$. Za $x \ne 0$ je tudi $u = Q^T x \ne 0$, zato je vsaj en $u_i \ne 0$ in vsota pozitivnih členov je pozitivna.
6. Odgovor: dokazano; ključna sta simetričnost ($A^T = A$ v obeh dokazih) in ortogonalnost $Q$, ki ohrani neničelnost vektorja.

## Drugače: Z analogijo

Kvadratna forma je kot **pokrajina** nad ravnino $(x, y)$, kjer je višina $q(x, y)$.

- **Pozitivno definitna** forma je skleda: od dna v izhodišču gre v vse smeri navzgor. Plastnice na zemljevidu so elipse, gostejše v smeri strmejšega pobočja (večja lastna vrednost).
- **Nedefinitna** forma je sedlo gorskega prelaza: proti vrhovoma navzgor, proti dolinama navzdol. Plastnice so hiperbole.
- **Semidefinitna** forma je žleb: v eni smeri se ne dvigne nikoli (lastna vrednost $0$), v drugi da parabolo.

Glavne osi so smeri, v katerih bi planinec šel najstrmeje in najpoložneje navzgor; v njih se pobočje ne »zvija« v stran.

## Drugače: Uporaba v stroki

**Glavne napetosti.** Napetostno stanje v točki nosilca opisuje simetričen napetostni tenzor $3 \times 3$. Njegove lastne vrednosti so glavne napetosti, lastni vektorji pa normale ravnin, v katerih ni strižnih napetosti; po njih se krhka gradiva lomijo.

**Vztrajnostni tenzor.** Kinetična energija vrtenja togega telesa je kvadratna forma kotne hitrosti. Glavne vztrajnostne osi so lastni vektorji; okoli njih se telo vrti brez opletanja, kar je ključno pri uravnoteženju gredi in koles.

**Togostna matrika.** V metodi končnih elementov je energija deformacije $\tfrac{1}{2}x^T K x$. Pozitivna definitnost $K$ pomeni, da je konstrukcija dobro podprta; semidefinitna $K$ izda, da se lahko premakne kot togo telo (manjka podpora).

**Okolje.** Elipsa variabilnosti vetra (Primer 2) določa, kam se najpogosteje širi onesnaženje iz dimnika; enako analizo uporabljajo za morske tokove in razpršenost delcev.

## Preveri se

? Katera forma **ni** pozitivno definitna?
- $x^2 + y^2$
~ Vsota kvadratov je pozitivna za vsako točko razen izhodišča.
- $2x^2 + 2xy + y^2$
~ $\Delta_1 = 2 > 0$ in $\Delta_2 = 2 - 1 = 1 > 0$: pozitivno definitna.
+ $x^2 + 4xy + y^2$
- $3x^2 + y^2$
~ Oba koeficienta sta pozitivna in mešanega člena ni: pozitivno definitna.
> Za $x^2 + 4xy + y^2$ je $\Delta_2 = 1 - 4 = -3 < 0$, npr. $q(1, -1) = -2$.

? Katera simetrična matrika pripada formi $4x^2 + 6xy - y^2$?
- $\begin{bmatrix} 4 & 6 \\ 6 & -1 \end{bmatrix}$
~ Mešani koeficient ni razpolovljen: ta matrika da $12xy$.
+ $\begin{bmatrix} 4 & 3 \\ 3 & -1 \end{bmatrix}$
- $\begin{bmatrix} 4 & 3 \\ 3 & 1 \end{bmatrix}$
~ Izgubljen je predznak pri $y^2$: koeficient je $-1$.
> Na diagonali sta koeficienta pri kvadratih, $6$ razdelimo na $3 + 3$.

? Vse lastne vrednosti simetrične matrike $A$ ($2 \times 2$) so pozitivne. Kaj sledi za krivuljo $x^T A x = 1$?
+ Je elipsa z osmi v smereh lastnih vektorjev.
- Je hiperbola.
~ Hiperbola nastane, ko sta lastni vrednosti nasprotnih predznakov.
- Je par vzporednih premic.
~ Par premic nastane, ko je ena lastna vrednost $0$ (semidefinitna forma); tu sta obe pozitivni, zato je krivulja sklenjena.
> V glavnih oseh $\lambda_1 u_1^2 + \lambda_2 u_2^2 = 1$ z $\lambda_i > 0$, torej elipsa s polosema $1/\sqrt{\lambda_i}$.

? Študent preverja, ali je $A = \begin{bmatrix} -2 & 1 \\ 1 & -3 \end{bmatrix}$ negativno definitna. Kateri korak je napačen? (1) $\Delta_1 = -2 < 0$. (2) $\Delta_2 = 6 - 1 = 5$. (3) Za negativno definitnost potrebujemo $\Delta_2 < 0$, zato $A$ ni negativno definitna.
- korak (1)
~ $\Delta_1 = a_{11} = -2$ je pravilno izračunan.
- korak (2)
~ $(-2)(-3) - 1 \cdot 1 = 5$ je pravilno.
+ korak (3)
> Pri negativni definitnosti se predznaki izmenjujejo: $\Delta_1 < 0$, $\Delta_2 > 0$. Matrika je negativno definitna (lastni vrednosti sta $\tfrac{-5 \pm \sqrt{5}}{2}$, obe negativni).

? Kovariančna matrika vetra ima lastni vrednosti $11\,\mathrm{m^2/s^2}$ in $1\,\mathrm{m^2/s^2}$. Kolikšna je standardna deviacija hitrosti vetra v smeri največje variabilnosti?
- $11\,\mathrm{m/s}$
~ Lastna vrednost je varianca v $\mathrm{m^2/s^2}$; standardna deviacija je njen koren.
+ $3{,}3\,\mathrm{m/s}$
- $6\,\mathrm{m/s}$
~ $6$ je povprečje lastnih vrednosti; v smeri največje variabilnosti velja $\lambda_{max}$.
> $\sigma = \sqrt{\lambda_{max}} = \sqrt{11} \approx 3{,}3\,\mathrm{m/s}$.

:::simboli
q | kvadratna forma | q = x^TAx | | vrednost v točki x
A | simetrična matrika forme | | | $a_{12}$ je polovica mešanega koeficienta
x, y, z | spremenljivke forme | | | koordinate točke
T | oznaka transponiranja | | | $x^T$ je vrstica, $A^T = A$
x | vektor spremenljivk | x = Qu | | stare koordinate
u | vektor koordinat v glavnih oseh | u = Q^Tx | | u_1, u_2, … so nove koordinate
Q | ortogonalna matrika lastnih vektorjev | | | stolpci so ortonormirani lastni vektorji
D | diagonalna matrika lastnih vrednosti | D = Q^TAQ |
\lambda | lastna vrednost | | | koeficient v glavnih oseh
\lambda_{max}, \lambda_{min} | največja in najmanjša lastna vrednost | | | meji $q(e)$ na enotski sferi
e | enotski vektor smeri | | | $e^Te = 1$
\Delta_1, \Delta_2, \Delta_3 | vodilne glavne poddeterminante | | | Sylvestrov kriterij
I | enotska matrika | |
C | kovariančna matrika vetra | | m^2/s^2
\sigma | standardna deviacija | \sigma = \sqrt{\lambda} | m/s
c | vrednost nivojnice ali ploskve | |
J | matrika samih enic | |
v, w | lastna vektorja | |
\mu | druga lastna vrednost | |
a | parameter forme | |
:::
