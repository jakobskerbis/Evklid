---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poskus za kuhinjsko mizo. Razvaljaj testo za piškote, s kozarcem s premerom $8\,\mathrm{cm}$ vanj odtisni krog in z nožem rahlo zareži dve pravokotni črti skozi njegovo središče, poševno glede na rob mize. Nato testo z valjarjem nekajkrat povaljaj samo v smeri od sebe.

Kaj izmeriš? Krog postane elipsa. Na primer: v smeri valjanja meri $12\,\mathrm{cm}$, prečno še vedno približno $8\,\mathrm{cm}$. Zarezani črti nista več pravokotni. Osi elipse pa sta pravokotni: ena kaže v smeri valjanja, druga prečno nanjo. Vzdolž teh dveh smeri se je testo samo raztegnilo (faktor $1{,}5$ in $1$), nič se ni zasukalo.

Zdaj testo samo zavrti na mizi ali ga obrni na drugo stran. Krog ostane krog s premerom $8\,\mathrm{cm}$, zarezi ostaneta pravokotni.

Prva preslikava (*sebiadjungirana*) samo razteguje v nekaj pravokotnih smereh. Druga (*ortogonalna*) ohranja dolžine in kote. Srečal ju boš v fiziki, statistiki in numeriki. **Spektralni izrek** pove, da je vsaka sebiadjungirana preslikava v resnici tako preprosta kot valjanje testa: v pravi pravokotni bazi je diagonalna. S tem znaš narisati vsako krivuljo oblike $ax^2+bxy+cy^2=d$ in hitro ugotoviti, ali je izraz vedno pozitiven.

## Razlaga

**1. Skalarni produkt in adjungiranka.** Delamo v končnorazsežnem realnem prostoru s skalarnim produktom, najpogosteje v $\mathbb{R}^n$ z $\langle x, y\rangle = x^T y$. Za linearno preslikavo $A$ je **adjungirana preslikava** $A^*$ tista, ki jo lahko »prestaviš« na drugo stran skalarnega produkta:

$$\langle Ax, y\rangle = \langle x, A^*y\rangle \quad \text{za vse } x, y.$$

V ortonormirani bazi je matrika adjungiranke kar transponirana matrika: $A^* = A^T$. Na kompleksnem prostoru je to $\overline{A}^{\,T}$ (transponiraj in konjugiraj).

*Preveri:* kaj je adjungiranka matrike $\begin{pmatrix}1&2\\0&3\end{pmatrix}$ v standardni bazi? (Odgovor: $\begin{pmatrix}1&0\\2&3\end{pmatrix}$.)

**2. Ortogonalne preslikave.** Preslikava $Q$ je **ortogonalna**, če ohranja skalarni produkt: $\langle Qx, Qy\rangle = \langle x, y\rangle$. Ker sta dolžina in kot izražena s skalarnim produktom, $Q$ ohranja dolžine in kote, tako kot vrtenje ali obračanje testa. Pogoj v matrični obliki:

$$Q^T Q = I, \quad \text{torej } Q^{-1} = Q^T.$$

To pomeni, da stolpci $Q$ tvorijo **ortonormirano bazo**: vsak ima dolžino $1$, vsaka dva sta pravokotna. Iz $\det(Q^T Q) = 1$ sledi $\det Q = \pm 1$: $+1$ pri vrtenju, $-1$ pri zrcaljenju. Kompleksni analog so **unitarne** preslikave, $\overline{U}^{\,T} U = I$.

*Preveri:* je matrika $\begin{pmatrix}0&1\\1&0\end{pmatrix}$ ortogonalna in kaj naredi? (Odgovor: da; zrcali čez premico $y = x$, determinanta je $-1$.)

:::premisli
Matrika $\begin{pmatrix}1&-1\\1&1\end{pmatrix}$ ima pravokotna stolpca. Ali je ortogonalna? Napovej, kaj naredi s krogom.
---
Ni. Stolpca sta pravokotna, a vsak ima dolžino $\sqrt{2}$. Preslikava krog zavrti za $45^\circ$ in ga poveča za faktor $\sqrt{2}$, zato dolžin ne ohranja. Ortogonalna bi bila šele $\tfrac{1}{\sqrt 2}\begin{pmatrix}1&-1\\1&1\end{pmatrix}$.
:::

**3. Sebiadjungirane preslikave.** Preslikava $A$ je **sebiadjungirana**, če je $A^* = A$, torej $\langle Ax, y\rangle = \langle x, Ay\rangle$. V ortonormirani bazi to pomeni, da je matrika **simetrična**: $A^T = A$. Na kompleksnem prostoru so to **hermitske** matrike.

*Preveri:* je $\begin{pmatrix}2&1\\1&2\end{pmatrix}$ sebiadjungirana? (Odgovor: da, simetrična je.)

**4. Dve lastnosti, ki ju ima vsaka sebiadjungirana preslikava.** Prvič: vse lastne vrednosti so **realne**, tudi če dovolimo kompleksne (dokaz je v »Drugače: Bolj natančno«). Drugič: lastna vektorja za **različni** lastni vrednosti sta **pravokotna**. Dokaz druge je kratek. Naj bo $Ax = \lambda x$ in $Ay = \mu y$, $\lambda \ne \mu$:

$$\lambda\langle x, y\rangle = \langle Ax, y\rangle = \langle x, Ay\rangle = \mu\langle x, y\rangle.$$

Torej je $(\lambda - \mu)\langle x, y\rangle = 0$ in zato $\langle x, y\rangle = 0$.

Za matriko $A = \begin{pmatrix}2&1\\1&2\end{pmatrix}$ to vidiš v tabeli:

| vektor $x$ | $Ax$ | ali je $Ax$ vzporeden z $x$? | faktor |
|---|---|---|---|
| $(1, 1)$ | $(3, 3)$ | da | $3$ |
| $(1, -1)$ | $(1, -1)$ | da | $1$ |
| $(1, 0)$ | $(2, 1)$ | ne, smer se spremeni | – |

Smeri $(1,1)$ in $(1,-1)$ sta pravokotni, tako kot osi elipse na testu.

*Preveri:* ali ima simetrična realna matrika lahko lastno vrednost $i$? (Odgovor: ne, vse njene lastne vrednosti so realne.)

**5. Spektralni izrek.** Za vsako sebiadjungirano preslikavo $A$ na končnorazsežnem prostoru s skalarnim produktom obstaja **ortonormirana baza iz lastnih vektorjev**. Matrično: obstajata ortogonalna $Q$ in diagonalna $D$, da je

$$A = Q D Q^T.$$

V stolpcih $Q$ so ortonormirani lastni vektorji, na diagonali $D$ pripadajoče lastne vrednosti. Od desne proti levi: $Q^T$ zasuka, $D$ raztegne vzdolž osi, $Q$ zasuka nazaj. Obrat velja tudi: če je $A = QDQ^T$, je $A^T = QD^TQ^T = A$. Realna matrika je torej ortogonalno diagonalizabilna natanko tedaj, ko je simetrična. Kompleksna verzija: hermitska matrika je $UDU^*$ z unitarno $U$ in realno $D$.

Ista formula v obliki vsote projekcij, kjer so $q_1, \dots, q_n$ stolpci $Q$: $A = \lambda_1 q_1 q_1^T + \dots + \lambda_n q_n q_n^T$.

*Preveri:* koliko je $Q^{-1}$ v spektralnem razcepu? (Odgovor: $Q^T$, ker je $Q$ ortogonalna.)

**6. Kvadratne forme.** **Kvadratna forma** na $\mathbb{R}^n$ je polinom, v katerem je vsak člen stopnje $2$, na primer $q(x, y) = 5x^2 + 4xy + 2y^2$. Vsako lahko zapišeš kot $q(x) = x^T A x$ s **simetrično** $A$: na diagonalo daš koeficienta pri $x^2$ in $y^2$, mešani koeficient pa **razpoloviš** med oba izvendiagonalna mesta:

$$5x^2 + 4xy + 2y^2 = \begin{pmatrix}x & y\end{pmatrix}\begin{pmatrix}5&2\\2&2\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}.$$

S spektralnim izrekom uvedemo nove koordinate $u = Q^T x$. Ker je $Q$ ortogonalna, je to le zasuk (ali zrcaljenje) koordinatnega sistema. Iz $x = Qu$ dobiš $x^TAx = u^TQ^TAQu = u^TDu$, in ker je $D$ diagonalna, mešani členi izginejo:

$$q = \lambda_1 u_1^2 + \lambda_2 u_2^2 + \dots + \lambda_n u_n^2.$$

Smeri lastnih vektorjev so **glavne osi** forme. Krivulja $q = c$ z $c > 0$ in $\lambda_1, \lambda_2 > 0$ je elipsa s polosema $\sqrt{c/\lambda_1}$ in $\sqrt{c/\lambda_2}$.

:::premisli
Lastni vrednosti forme sta $6$ in $1$. Vzdolž katere lastne smeri je elipsa $q = 6$ daljša? Zakaj?
---
Vzdolž lastne smeri za $\lambda = 1$. Polos je $\sqrt{c/\lambda}$, zato manjša lastna vrednost pomeni daljšo polos: forma tam »raste počasneje«, do vrednosti $6$ moraš priti dlje od središča.
:::

*Preveri:* katera simetrična matrika pripada formi $x^2 + 6xy + y^2$? (Odgovor: $\begin{pmatrix}1&3\\3&1\end{pmatrix}$.)

**7. Definitnost.** Forma je **pozitivno definitna**, če je $q(x) > 0$ za vsak $x \neq 0$. Iz $q = \sum \lambda_i u_i^2$ se to prebere takoj: natanko tedaj, ko so **vse lastne vrednosti pozitivne**. Če so nekatere pozitivne in nekatere negativne, je forma **nedefinitna** (krivulja $q = 1$ v ravnini je hiperbola). Pri $2 \times 2$ si pomagaš s sledjo in determinanto: $\lambda_1 + \lambda_2 = \operatorname{sl} A$ in $\lambda_1 \lambda_2 = \det A$. Pozitivna determinanta pomeni, da imata lastni vrednosti enak predznak, pozitivna sled pa, da sta obe pozitivni. Zato je forma pozitivno definitna natanko pri $\det A > 0$ in $\operatorname{sl} A > 0$.

*Preveri:* je $\begin{pmatrix}5&2\\2&2\end{pmatrix}$ pozitivno definitna? (Odgovor: da, determinanta $6$ in sled $7$ sta pozitivni.)

## Rešeni primeri

### Primer 1 (lažji): vrtljivi pladenj

Na vrtljivem pladnju za začimbe stoji kozarček s soljo v točki $(5, 0)$, merjeno v centimetrih od osi vrtenja. Pladenj zavrtimo; to opiše matrika $Q = \tfrac15\begin{pmatrix}3&-4\\4&3\end{pmatrix}$. Ali je $Q$ ortogonalna? Kam pride kozarček in ali je še enako daleč od osi?

**Podatki:** $Q = \tfrac15\begin{pmatrix}3&-4\\4&3\end{pmatrix}$, začetna lega $x = (5, 0)\,\mathrm{cm}$
**Iščemo:** ali velja $Q^TQ = I$, novo lego $Qx$ in njeno razdaljo od osi

:::formula
$Q^TQ = I$; razdalja $\|x\| = \sqrt{x_1^2 + x_2^2}$
:::

**Rešitev:**

1. Prvi stolpec $\tfrac15(3, 4)$ ima dolžino $\tfrac15\sqrt{9 + 16} = 1$, drugi $\tfrac15(-4, 3)$ prav tako. Skalarni produkt stolpcev je $\tfrac{1}{25}(-12 + 12) = 0$. Torej $Q^TQ = I$.
2. $\det Q = \tfrac{1}{25}(9 + 16) = 1$, zato gre za vrtenje, ne zrcaljenje.
3. $Qx = \tfrac15(3 \cdot 5,\ 4 \cdot 5) = (3, 4)$.
4. Razdalja: $\sqrt{3^2 + 4^2} = 5$, enako kot prej, ker ortogonalna preslikava ohranja dolžine.
5. Odgovor: $Q$ je ortogonalna (vrtenje za približno $53{,}1^\circ$, saj je $\cos\varphi = 0{,}6$); kozarček pride v točko $(3, 4)\,\mathrm{cm}$ in je še vedno $5\,\mathrm{cm}$ od osi.

### Primer 2: valjanje po diagonali

Pek valja testo poševno; deformacijo opiše $A = \begin{pmatrix}2&1\\1&2\end{pmatrix}$. Poišči spektralni razcep $A = QDQ^T$ in povej, v katerih smereh se testo samo raztegne.

**Podatki:** $A = \begin{pmatrix}2&1\\1&2\end{pmatrix}$ (simetrična)
**Iščemo:** lastne vrednosti, ortonormirane lastne vektorje, $Q$ in $D$

:::formula
$\det(A - \lambda I) = 0$, nato $A = QDQ^T$ z ortonormiranimi lastnimi vektorji v stolpcih $Q$
:::

**Rešitev:**

1. Sled je $4$, determinanta $2 \cdot 2 - 1 \cdot 1 = 3$, zato je karakteristični polinom $\lambda^2 - 4\lambda + 3 = (\lambda - 3)(\lambda - 1)$.
2. Lastni vrednosti: $\lambda_1 = 3$, $\lambda_2 = 1$.
3. Za $\lambda_1 = 3$: $A - 3I = \begin{pmatrix}-1&1\\1&-1\end{pmatrix}$, lastni vektor $(1, 1)$. Za $\lambda_2 = 1$: $A - I = \begin{pmatrix}1&1\\1&1\end{pmatrix}$, lastni vektor $(1, -1)$. Pravokotna sta, kot obljublja izrek.
4. Normiramo (dolžina obeh je $\sqrt 2$) in ju zložimo v stolpce:

$$Q = \tfrac{1}{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}, \quad D = \begin{pmatrix}3&0\\0&1\end{pmatrix}.$$

5. Preizkus z vsoto projekcij: $3 \cdot \tfrac12\begin{pmatrix}1&1\\1&1\end{pmatrix} + 1 \cdot \tfrac12\begin{pmatrix}1&-1\\-1&1\end{pmatrix} = \begin{pmatrix}2&1\\1&2\end{pmatrix}$.
6. Odgovor: v smeri $(1,1)$ se testo raztegne za faktor $3$, v pravokotni smeri $(1,-1)$ ostane enako dolgo.

### Primer 3 (težji): oval pekača

Rob ovalnega pekača ima v koordinatah na pultu (v decimetrih) enačbo $5x^2 + 4xy + 2y^2 = 6$. Kolikšna sta najdaljši in najkrajši premer pekača in v kateri smeri leži najdaljši?

**Podatki:** rob: $5x^2 + 4xy + 2y^2 = 6$, enota $\mathrm{dm}$
**Iščemo:** glavne osi, najdaljši in najkrajši premer

:::formula
$q = x^TAx$, $A = \begin{pmatrix}5&2\\2&2\end{pmatrix}$; v glavnih oseh $\lambda_1u_1^2 + \lambda_2u_2^2 = c$, polos $\sqrt{c/\lambda}$
:::

**Rešitev:**

1. Mešani koeficient $4$ razpolovimo: $A = \begin{pmatrix}5&2\\2&2\end{pmatrix}$.
2. Sled $7$, determinanta $5 \cdot 2 - 2 \cdot 2 = 6$, torej $\lambda^2 - 7\lambda + 6 = 0$ in $\lambda_1 = 6$, $\lambda_2 = 1$.
3. Lastna vektorja: $A(2, 1) = (12, 6)$, torej $(2,1)$ za $\lambda = 6$; $A(1, -2) = (1, -2)$, torej $(1,-2)$ za $\lambda = 1$. Pravokotna sta.
4. V glavnih oseh je rob $6u_1^2 + u_2^2 = 6$, oziroma $u_1^2 + \tfrac{u_2^2}{6} = 1$: elipsa.
5. Polosi: $\sqrt{6/6} = 1$ in $\sqrt{6/1} = \sqrt6 \approx 2{,}45$.
6. Premer je dvojna polos. Odgovor: najkrajši premer je $2\,\mathrm{dm}$ (v smeri $(2,1)$), najdaljši $2\sqrt6\,\mathrm{dm} \approx 4{,}9\,\mathrm{dm}$ v smeri $(1,-2)$.

### Primer 4 – zdaj ti

Ali je forma $q(x, y) = x^2 + 6xy + y^2$ pozitivno definitna? Kakšna je krivulja $q = 1$?

**Podatki:** $q(x,y) = x^2 + 6xy + y^2$
**Iščemo:** predznaka lastnih vrednosti in vrsto krivulje $q = 1$

:::formula
$\lambda_1 + \lambda_2 = \operatorname{sl}A$, $\lambda_1\lambda_2 = \det A$
:::

**Rešitev:**

1. Matrika forme: $A = \begin{pmatrix}1&3\\3&1\end{pmatrix}$ (mešani koeficient $6$ razpolovimo).
2. Sled je $2$, determinanta $1 \cdot 1 - 3 \cdot 3 = -8$.
3. Karakteristični polinom: $\lambda^2 - 2\lambda - 8$. Poišči ničli in odloči sam.

:::premisli
Kateri sta lastni vrednosti in kaj to pove o formi in krivulji?
---
$\lambda^2 - 2\lambda - 8 = (\lambda - 4)(\lambda + 2)$, torej $\lambda_1 = 4$, $\lambda_2 = -2$. Ena je pozitivna, druga negativna, zato je forma nedefinitna (na primer $q(1,-1) = -4$). V glavnih oseh je $4u_1^2 - 2u_2^2 = 1$: hiperbola. Že negativna determinanta pove, da sta predznaka različna.
:::

## Pogoste napake

- **»Pravokotni stolpci že pomenijo ortogonalno matriko.«** Pozabiš na dolžine. Matrika $\begin{pmatrix}1&-1\\1&1\end{pmatrix}$ ima pravokotna stolpca, a vsako dolžino poveča za $\sqrt2$. Popravek: stolpci morajo biti *ortonormirani*, preveri $Q^TQ = I$.
- **»Spektralni izrek velja za vsako diagonalizabilno matriko.«** Matrika $\begin{pmatrix}1&1\\0&2\end{pmatrix}$ je diagonalizabilna, a lastna vektorja $(1,0)$ in $(1,1)$ nista pravokotna. Pravokotnost dokažemo z $\langle Ax, y\rangle = \langle x, Ay\rangle$, kar velja samo za simetrične. Popravek: ortonormirana lastna baza obstaja natanko pri simetričnih matrikah (realno); v kompleksnem natanko pri normalnih, med katerimi so hermitske.
- **Cel mešani koeficient na obe mesti.** Za $5x^2 + 4xy + 2y^2$ napišeš $\begin{pmatrix}5&4\\4&2\end{pmatrix}$, kar da $5x^2 + 8xy + 2y^2$. Popravek: koeficient pri $xy$ razdeli na pol, ker se v $x^TAx$ pojavi dvakrat.
- **Definitnost iz predznakov elementov.** »Vsi elementi $\begin{pmatrix}1&3\\3&1\end{pmatrix}$ so pozitivni, torej je pozitivno definitna.« A $q(1,-1) = -4$. Popravek: odločajo lastne vrednosti (pri $2\times2$: $\det > 0$ in sled $> 0$), ne posamezni elementi.
- **»Ortogonalna pomeni vrtenje.«** Tudi zrcaljenje ohranja dolžine in kote, njegova determinanta je $-1$. Popravek: ortogonalna je vsaka $Q$ s $Q^TQ = I$; vrtenje so tiste z $\det Q = 1$.

## Povzetek

- Adjungiranka: $\langle Ax, y\rangle = \langle x, A^*y\rangle$; v ortonormirani bazi $A^* = A^T$ (kompleksno $\overline{A}^{\,T}$).
- Ortogonalna $Q$: $Q^TQ = I$, ohranja dolžine in kote, stolpci so ortonormirani, $\det Q = \pm1$.
- Sebiadjungirana $A$: $A^* = A$ (simetrična oz. hermitska); lastne vrednosti so realne, lastni vektorji za različne lastne vrednosti so pravokotni.
- Spektralni izrek: $A = QDQ^T$ z ortogonalno $Q$ iz lastnih vektorjev in realno diagonalno $D$.
- Kvadratna forma $q = x^TAx$ (mešani koeficient razpolovi); v glavnih oseh $q = \sum \lambda_i u_i^2$, polosi elipse $q = c$ sta $\sqrt{c/\lambda_i}$.
- Pozitivno definitna natanko tedaj, ko so vse lastne vrednosti pozitivne.

## Za izpit

Znati moraš povedati:

- definicijo adjungirane, sebiadjungirane in ortogonalne preslikave ter njihove matrike v ortonormirani bazi ($A^T$, $A^T = A$, $Q^TQ = I$),
- lastnosti ortogonalnih matrik: ohranjanje dolžin in kotov, ortonormirani stolpci, $\det Q = \pm 1$,
- dokaz, da so lastne vrednosti sebiadjungirane preslikave realne in lastni vektorji za različne lastne vrednosti pravokotni,
- spektralni izrek ($A = QDQ^T$) z dokazom z indukcijo in obrat (ortogonalno diagonalizabilna realna matrika je simetrična),
- zapis kvadratne forme s simetrično matriko, prehod na glavne osi in polosi elipse $q = c$,
- definicijo pozitivne definitnosti in kriterij z lastnimi vrednostmi (pri $2 \times 2$ z determinanto in sledjo).

### Naloga 1

Dana je kvadratna forma $q(x, y, z) = x^2 + 2y^2 + 3z^2 - 4xy - 4yz$ na $\mathbb{R}^3$. (a) Zapiši njeno simetrično matriko $A$ in poišči ortogonalno $Q$ ter diagonalno $D$, da je $A = QDQ^T$. (b) Zapiši formo v glavnih oseh in določi njeno definitnost. (c) Kolikšna sta največja in najmanjša vrednost $q$ na enotski sferi $x^2 + y^2 + z^2 = 1$ in kje sta doseženi?

**Rešitev:**

1. Mešana koeficienta razpolovimo: pri $xy$ je $-4$, pri $yz$ je $-4$, pri $xz$ je $0$. Torej $A = \begin{pmatrix}1&-2&0\\-2&2&-2\\0&-2&3\end{pmatrix}$.
2. Karakteristični polinom z razvojem po prvi vrstici: $\det(A - \lambda I) = (1 - \lambda)\bigl[(2 - \lambda)(3 - \lambda) - 4\bigr] + 2\bigl[-2(3 - \lambda)\bigr] = (1 - \lambda)(\lambda^2 - 5\lambda + 2) - 4(3 - \lambda)$.
3. Uredimo: $-\lambda^3 + 6\lambda^2 - 3\lambda - 10$. Ničlo $\lambda = -1$ uganemo ($1 + 6 + 3 - 10 = 0$) in delimo: $-(\lambda + 1)(\lambda^2 - 7\lambda + 10) = -(\lambda + 1)(\lambda - 2)(\lambda - 5)$.
4. Lastne vrednosti: $\lambda_1 = -1$, $\lambda_2 = 2$, $\lambda_3 = 5$. Preizkus: vsota $6$ je enaka sledi $1 + 2 + 3$.
5. $\lambda_1 = -1$: sistem $(A + I)v = 0$ da $2v_1 - 2v_2 = 0$ in $-2v_2 + 4v_3 = 0$, torej $v = (2, 2, 1)$. Preizkus: $A(2, 2, 1) = (-2, -2, -1)$.
6. $\lambda_2 = 2$: sistem $(A - 2I)v = 0$ da $-v_1 - 2v_2 = 0$ in $-2v_2 + v_3 = 0$, torej $v = (2, -1, -2)$. Preizkus: $A(2, -1, -2) = (4, -2, -4)$.
7. $\lambda_3 = 5$: sistem $(A - 5I)v = 0$ da $-4v_1 - 2v_2 = 0$ in $-2v_2 - 2v_3 = 0$, torej $v = (1, -2, 2)$. Preizkus: $A(1, -2, 2) = (5, -10, 10)$.
8. Vektorji so paroma pravokotni: $4 - 2 - 2 = 0$, $2 - 4 + 2 = 0$, $2 + 2 - 4 = 0$. Vsak ima dolžino $\sqrt{4 + 4 + 1} = 3$, zato jih delimo s $3$:

$$Q = \tfrac13\begin{pmatrix}2&2&1\\2&-1&-2\\1&-2&2\end{pmatrix}, \quad D = \begin{pmatrix}-1&0&0\\0&2&0\\0&0&5\end{pmatrix}.$$

9. (b) V koordinatah $u = Q^Tx$ je $q = -u_1^2 + 2u_2^2 + 5u_3^2$. Lastne vrednosti imajo različne predznake, zato je forma nedefinitna; na primer $q(2, 2, 1) = 4 + 8 + 3 - 16 - 8 = -9 < 0$ in $q(0, 0, 1) = 3 > 0$.
10. (c) Ker je $Q$ ortogonalna, je $u_1^2 + u_2^2 + u_3^2 = x^2 + y^2 + z^2 = 1$. Zato je $q = -u_1^2 + 2u_2^2 + 5u_3^2 \leq 5(u_1^2 + u_2^2 + u_3^2) = 5$, enakost velja pri $u = (0, 0, \pm 1)$. Enako je $q \geq -(u_1^2 + u_2^2 + u_3^2) = -1$, enakost pri $u = (\pm 1, 0, 0)$.
11. Odgovor: $A = QDQ^T$ s $Q$ in $D$ iz koraka 8; $q = -u_1^2 + 2u_2^2 + 5u_3^2$ je nedefinitna; na enotski sferi je največja vrednost $5$ v točkah $\pm\tfrac13(1, -2, 2)$, najmanjša $-1$ v točkah $\pm\tfrac13(2, 2, 1)$.

### Naloga 2

Natančno navedi definicijo sebiadjungirane in ortogonalne preslikave ter spektralni izrek. Dokaži: (a) vse lastne vrednosti realne simetrične matrike so realne; (b) lastna vektorja za različni lastni vrednosti sta pravokotna; (c) realna lastna vrednost ortogonalne matrike je $1$ ali $-1$. (d) Utemelji, ali je produkt dveh simetričnih matrik vedno simetričen.

**Rešitev:**

1. Definiciji: $A$ je sebiadjungirana, če je $\langle Ax, y\rangle = \langle x, Ay\rangle$ za vse $x, y$ (v ortonormirani bazi $A^T = A$). $Q$ je ortogonalna, če je $\langle Qx, Qy\rangle = \langle x, y\rangle$ za vse $x, y$ (matrično $Q^TQ = I$).
2. Spektralni izrek: za vsako sebiadjungirano preslikavo $A$ na končnorazsežnem realnem prostoru s skalarnim produktom obstaja ortonormirana baza iz lastnih vektorjev; matrično $A = QDQ^T$ z ortogonalno $Q$ in realno diagonalno $D$.
3. (a) Naj bo $Az = \lambda z$ s kompleksnima $\lambda$ in $z \neq 0$. Ker je $A$ realna in simetrična, je $\overline{z}^{\,T}Az = \overline{(Az)}^{\,T}z$. Leva stran je $\lambda\,\overline{z}^{\,T}z$, desna $\overline{\lambda}\,\overline{z}^{\,T}z$.
4. Ker je $\overline{z}^{\,T}z = \|z\|^2 > 0$, sledi $\lambda = \overline{\lambda}$, torej $\lambda \in \mathbb{R}$.
5. (b) Naj bo $Ax = \lambda x$, $Ay = \mu y$, $\lambda \neq \mu$. Potem $\lambda\langle x, y\rangle = \langle Ax, y\rangle = \langle x, Ay\rangle = \mu\langle x, y\rangle$, torej $(\lambda - \mu)\langle x, y\rangle = 0$ in $\langle x, y\rangle = 0$.
6. (c) Naj bo $Qx = \lambda x$, $x \neq 0$, $\lambda \in \mathbb{R}$. Ortogonalna preslikava ohranja dolžine: $\|x\|^2 = \langle Qx, Qx\rangle = \lambda^2\|x\|^2$. Ker je $\|x\| \neq 0$, je $\lambda^2 = 1$ in $\lambda = \pm 1$.
7. (d) Ne. Za simetrični $A$ in $B$ je $(AB)^T = B^TA^T = BA$, zato je $AB$ simetrična natanko tedaj, ko $A$ in $B$ komutirata.
8. Protiprimer: $A = \begin{pmatrix}1&0\\0&2\end{pmatrix}$, $B = \begin{pmatrix}0&1\\1&0\end{pmatrix}$. Tedaj je $AB = \begin{pmatrix}0&1\\2&0\end{pmatrix}$, kar ni simetrična matrika.
9. Odgovor: (a) in (b) sledita iz $\langle Ax, y\rangle = \langle x, Ay\rangle$, (c) iz ohranjanja dolžin; produkt simetričnih matrik je simetričen natanko tedaj, ko matriki komutirata.

### Naloga 3

Za realen parameter $a$ je dana forma $q_a(x, y, z) = x^2 + y^2 + z^2 + 2a(xy + xz + yz)$. (a) Poišči lastne vrednosti njene matrike in ortogonalno bazo iz lastnih vektorjev. (b) Za katere $a$ je forma pozitivno definitna? (c) Pri $a = -\tfrac12$ poišči vse vektorje, za katere je $q_a = 0$.

**Rešitev:**

1. Matrika forme (mešane koeficiente $2a$ razpolovimo): $A = \begin{pmatrix}1&a&a\\a&1&a\\a&a&1\end{pmatrix}$.
2. Vsota vsake vrstice je $1 + 2a$, zato je $A(1, 1, 1) = (1 + 2a)(1, 1, 1)$: lastna vrednost $\lambda_1 = 1 + 2a$.
3. $A(1, -1, 0) = (1 - a,\ a - 1,\ 0) = (1 - a)(1, -1, 0)$: lastna vrednost $\lambda_2 = 1 - a$.
4. $A(1, 1, -2) = (1 + a - 2a,\ a + 1 - 2a,\ 2a - 2) = (1 - a)(1, 1, -2)$: spet $1 - a$, torej je ta lastna vrednost dvojna. Preizkus s sledjo: $(1 + 2a) + 2(1 - a) = 3$.
5. Vektorji $(1, 1, 1)$, $(1, -1, 0)$, $(1, 1, -2)$ so paroma pravokotni: $1 - 1 + 0 = 0$, $1 + 1 - 2 = 0$, $1 - 1 + 0 = 0$. Po normiranju (dolžine $\sqrt3$, $\sqrt2$, $\sqrt6$) so stolpci ortogonalne $Q$. Pri $a = 0$ je $A = I$ in je vsak vektor lasten.
6. (b) V glavnih oseh: $q_a = (1 + 2a)u_1^2 + (1 - a)(u_2^2 + u_3^2)$. Forma je pozitivno definitna natanko tedaj, ko je $1 + 2a > 0$ in $1 - a > 0$, torej za $-\tfrac12 < a < 1$.
7. (c) Pri $a = -\tfrac12$ je $\lambda_1 = 0$ in $\lambda_2 = \lambda_3 = \tfrac32$, zato $q_a = \tfrac32(u_2^2 + u_3^2)$. To je nič natanko pri $u_2 = u_3 = 0$, torej za vektorje v smeri prve glavne osi.
8. Odgovor: lastne vrednosti so $1 + 2a$ (lastni vektor $(1, 1, 1)$) in dvojna $1 - a$ (lastna vektorja $(1, -1, 0)$ in $(1, 1, -2)$); forma je pozitivno definitna za $-\tfrac12 < a < 1$; pri $a = -\tfrac12$ je $q_a = 0$ natanko za vektorje $t(1, 1, 1)$, $t \in \mathbb{R}$.

## Drugače: Na sliki

Predstavljaj si enotski krog, narisan na prozorno folijo, in matriko $A = \begin{pmatrix}2&1\\1&2\end{pmatrix}$. Za $Q$ vzemi vrtenje $\tfrac{1}{\sqrt2}\begin{pmatrix}1&-1\\1&1\end{pmatrix}$. (V Primeru 2 ima drugi stolpec nasprotni predznak, zato je tam $Q$ zrcaljenje; oba razcepa sta pravilna, ker je tudi $-q$ enotski lastni vektor.)

- Folijo najprej zavrti za $-45^\circ$ (to je $Q^T$): diagonala $(1,1)$ zdaj leži na osi $x$.
- Nato jo raztegni: v smeri osi $x$ za $3$, v smeri osi $y$ za $1$ (to je $D$). Krog postane ležeča elipsa s polosema $3$ in $1$.
- Na koncu jo zavrti nazaj za $+45^\circ$ (to je $Q$). Elipsa zdaj leži poševno, daljša os v smeri $(1,1)$.

Rezultat je natanko slika kroga pri $A$. Ortogonalna preslikava ne spremeni oblike, samo lego. Vso »spremembo oblike« nosi diagonalna $D$.

Za pozitivno definitno kvadratno formo velja ista slika obrnjeno: nivojnice $q = c$ so elipse z osmi v lastnih smereh, ožje v smeri večje lastne vrednosti.

## Drugače: Bolj natančno

**Izrek (spektralni, realni).** Naj bo $V$ končnorazsežen realen prostor s skalarnim produktom in $A\colon V \to V$ sebiadjungirana. Potem ima $V$ ortonormirano bazo iz lastnih vektorjev $A$.

*Dokaz z indukcijo po $n = \dim V$.* Za $n = 1$ ni kaj dokazovati.

1. *Obstoj realne lastne vrednosti.* Matriko $A$ v ortonormirani bazi obravnavaj kot kompleksno. Ima kompleksno lastno vrednost $\lambda$ z lastnim vektorjem $z \neq 0$. Ker je $A$ realna simetrična, je $\lambda\, \overline{z}^{\,T}z = \overline{z}^{\,T}Az = \overline{(Az)}^{\,T}z = \overline{\lambda}\,\overline{z}^{\,T}z$, in ker je $\overline{z}^{\,T}z = \|z\|^2 > 0$, je $\lambda = \overline\lambda \in \mathbb{R}$. Realna matrika $A - \lambda I$ je singularna, zato obstaja realen lastni vektor; normiraj ga v $q_1$.
2. *Invariantnost ortogonalnega komplementa.* Naj bo $W = q_1^\perp$. Za $w \in W$ je $\langle Aw, q_1\rangle = \langle w, Aq_1\rangle = \lambda\langle w, q_1\rangle = 0$, torej $Aw \in W$.
3. *Indukcija.* Zožitev $A|_W$ je spet sebiadjungirana na $W$ z $\dim W = n - 1$, zato ima $W$ ortonormirano lastno bazo $q_2, \dots, q_n$. Skupaj s $q_1$ dobimo ortonormirano lastno bazo $V$. $\blacksquare$

**Kompleksna verzija.** Za hermitsko $A$ na unitarnem prostoru dokaz poteka enako. Velja še več: ortonormirano lastno bazo ima natanko vsaka *normalna* preslikava, $AA^* = A^*A$ (sem spadajo tudi unitarne). Normalna preslikava je sebiadjungirana natanko tedaj, ko so vse njene lastne vrednosti realne, in unitarna natanko tedaj, ko imajo vse absolutno vrednost $1$.

**Sylvestrov zakon vztrajnosti.** Pri vsakem obrnljivem prehodu na vsoto kvadratov $\sum d_i v_i^2$ je število pozitivnih, negativnih in ničelnih $d_i$ enako (*signatura*).

**Sylvestrov kriterij.** Simetrična $A$ je pozitivno definitna natanko tedaj, ko so vsi vodilni glavni minorji (determinante zgornjih levih $k \times k$ podmatrik) pozitivni.

## Preveri se

? Na testo odtisneš krog in ga deformiraš s simetrično matriko z lastnima vrednostma $3$ in $1$. Kateri opis slike ustreza?
- Krog s polmerom $3$.
~ Krog bi dobil le, če bi bili obe lastni vrednosti enaki. Tu se ena smer raztegne bolj.
+ Elipsa s polosema v razmerju $3 : 1$, osi sta pravokotni in ležita v lastnih smereh.
- Elipsa, katere osi nista pravokotni, ker se lastni smeri sekata poševno.
~ Pri simetrični matriki sta lastni smeri za različni lastni vrednosti vedno pravokotni. Poševni lastni smeri ima lahko le nesimetrična matrika.
- Enak krog, le zavrten.
~ To naredi ortogonalna preslikava. Simetrična z lastnima vrednostma $3$ in $1$ dolžine spremeni.
> Spektralni izrek: $A = QDQ^T$. Zasuk, raztezek za $3$ in $1$ vzdolž pravokotnih osi, zasuk nazaj. Krog postane elipsa s pravokotnima osema.

? Oceni brez računanja: kolikšna je približno večja izmed lastnih vrednosti matrike $\begin{pmatrix}4&0{,}1\\0{,}1&1\end{pmatrix}$?
- Približno $4{,}1$.
~ Izvendiagonalnega elementa ne prištejemo kar diagonali. Popravek je približno $\dfrac{0{,}1^2}{4 - 1}$, torej zelo majhen.
+ Približno $4$.
- Približno $5$.
~ $5$ je sled, torej vsota obeh lastnih vrednosti, ne večja od njiju.
- Približno $0{,}1$.
~ $0{,}1$ je izvendiagonalni element, ne lastna vrednost. Ko so izvendiagonalni elementi skoraj nič, sta lastni vrednosti blizu diagonalnih elementov.
> Matrika je skoraj diagonalna, zato sta lastni vrednosti blizu $4$ in $1$. Natančno: $\lambda \approx 4{,}0033$.

? Zakaj sta lastna vektorja simetrične matrike za različni lastni vrednosti pravokotna?
- Ker ima vsaka matrika pravokotne lastne vektorje.
~ Ne drži: $\begin{pmatrix}1&1\\0&2\end{pmatrix}$ ima lastna vektorja $(1,0)$ in $(1,1)$, ki nista pravokotna.
- Ker so lastne vrednosti simetrične matrike realne.
~ Realnost je resnična, a ločena lastnost; iz nje pravokotnost ne sledi. Potrebna je simetrija $\langle Ax,y\rangle = \langle x,Ay\rangle$.
+ Ker je $\lambda\langle x,y\rangle = \langle Ax,y\rangle = \langle x,Ay\rangle = \mu\langle x,y\rangle$, zato pri $\lambda \neq \mu$ velja $\langle x,y\rangle = 0$.
- Ker je determinanta simetrične matrike enaka $1$.
~ To ni res (npr. $\det\begin{pmatrix}2&1\\1&2\end{pmatrix} = 3$); determinanta $\pm1$ je lastnost ortogonalnih matrik.
> Ključ je, da simetrično matriko lahko prestaviš na drugo stran skalarnega produkta. Od tod $(\lambda - \mu)\langle x, y\rangle = 0$.

? Simetrična matrika ima lastni vrednosti $2$ in $0$ z lastnima vektorjema $(1,1)$ in $(1,-1)$. Katera matrika je to?
- $\begin{pmatrix}2&0\\0&0\end{pmatrix}$
~ To je diagonalna $D$, ne $A$. Ta matrika ima lastna vektorja $(1,0)$ in $(0,1)$.
- $\begin{pmatrix}2&2\\2&2\end{pmatrix}$
~ Uporabil si $vv^T$ brez normiranja. Vektor $(1,1)$ ima dolžino $\sqrt2$, zato je projekcija $\tfrac12\begin{pmatrix}1&1\\1&1\end{pmatrix}$.
+ $\begin{pmatrix}1&1\\1&1\end{pmatrix}$
- $\begin{pmatrix}1&-1\\-1&1\end{pmatrix}$
~ Ta matrika vektor $(1,1)$ pošlje v $0$, torej sta lastni smeri zamenjani.
> $A = 2 \cdot \tfrac12\begin{pmatrix}1&1\\1&1\end{pmatrix} + 0 \cdot \tfrac12\begin{pmatrix}1&-1\\-1&1\end{pmatrix} = \begin{pmatrix}1&1\\1&1\end{pmatrix}$. Preizkus: $A(1,1) = (2,2)$.

? Za katere realne $a$ je forma $x^2 + 2axy + 4y^2$ pozitivno definitna?
- Za vse $a > 0$.
~ Predznak mešanega koeficienta ne odloča: že pri $a = 3$ je $q(1,-1) = 1 - 6 + 4 = -1$.
- Za $|a| < 1$.
~ Na izvendiagonalno mesto si dal cel koeficient $2a$ namesto polovice $a$, zato si dobil $\det = 4 - 4a^2$.
+ Za $|a| < 2$.
- Za vse $a$, ker sta $1$ in $4$ pozitivna.
~ Pozitivna diagonala ne zadošča; odločata predznaka lastnih vrednosti, pri velikem $|a|$ je ena negativna.
> Matrika je $\begin{pmatrix}1&a\\a&4\end{pmatrix}$, sled $5 > 0$, $\det = 4 - a^2$. Obe lastni vrednosti sta pozitivni natanko pri $4 - a^2 > 0$, torej $|a| < 2$.

:::simboli
A | linearna preslikava (simetrična matrika) | | | sebiadjungirana, če A* = A; tedaj A = QDQᵀ
x, y | vektorja v ℝⁿ | | | v kvadratni formi koordinati točke
x_1, x_2 | komponenti vektorja x
Q | ortogonalna matrika | Q^T Q = I | | v stolpcih ortonormirani lastni vektorji
T | transponiranje (oznaka Qᵀ)
I | identična (enotska) matrika
\lambda, \mu | lastni vrednosti preslikave A | \det(A - \lambda I) = 0 | | λ₁, …, λₙ na diagonali D
D | diagonalna matrika lastnih vrednosti
q | kvadratna forma | q = x^TAx
q_1, q_n | ortonormirani lastni vektorji (stolpci Q)
u_1, u_2, u_n | koordinate v glavnih oseh (lastni bazi)
c | vrednost kvadratne forme na krivulji q = c | | | v ax² + bxy + cy² pa koeficient
:::
