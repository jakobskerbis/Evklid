---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na začetku 19. stoletja so astronomi izgubili komaj odkrito telo Ceres, ko je izginilo v soju Sonca. Carl Friedrich Gauss je iz peščice opazovanj izračunal njegov tir, pri tem pa iskal parametre, pri katerih je vsota kvadratov odstopanj od meritev najmanjša; Ceres so nato našli blizu napovedanega mesta. Iskal je minimum funkcije **več** spremenljivk, ne ene. Malo pred tem je Joseph-Louis Lagrange v mehaniki rešil sorodno nalogo: kako najti ekstrem, kadar spremenljivk ne smemo spreminjati prosto, ker jih veže pogoj. Isti račun danes rešuje izenačevalnik v glasbenem studiu, ki išče jakosti frekvenčnih pasov z najmanjšim odstopanjem od želenega zvoka.

Postopek za eno spremenljivko (odvod enak nič, nato drugi odvod) se prenese na funkcije $f(x, y)$ in $f(x_1, \dots, x_n)$:

- **stacionarne točke** poiščemo z ničelnim gradientom,
- naravo stacionarne točke določimo s **Hessejevo matriko** drugih odvodov,
- ekstreme pri dodatnem pogoju (**vezane ekstreme**) iščemo z **Lagrangeovo metodo**.

Potrebuješ parcialne odvode, reševanje sistemov enačb in determinante $2 \times 2$.

## Razlaga

Graf funkcije $z = f(x, y)$ je ploskev nad ravnino $xy$, podobna pokrajini z dolinami, vrhovi in prelazi. Tri oblike okoli točke, kjer so »tla vodoravna«, so:

| oblika | kako gre ploskev iz točke | nivojnice okoli točke | zgled v $(0, 0)$ |
|---|---|---|---|
| kotanja (minimum) | v vseh smereh navzgor | sklenjene, podobne elipsam | $x^2 + y^2$ |
| vrh (maksimum) | v vseh smereh navzdol | sklenjene, podobne elipsam | $-x^2 - y^2$ |
| prelaz (sedlo) | v nekaterih smereh gor, v drugih dol | hiperbole, skozi točko križ X | $x^2 - y^2$ |

Vodoravna tla opiše gradient, ukrivljenost okoli točke pa drugi odvodi; spodaj to zapišemo s simboli.

**1. Lokalni in globalni ekstremi.** Naj bo $f$ definirana na množici $D \subseteq \mathbb{R}^2$ in $T_0 = (x_0, y_0) \in D$. Funkcija $f$ ima v $T_0$ **lokalni minimum**, če obstaja okolica $U$ točke $T_0$, da je $f(x, y) \ge f(x_0, y_0)$ za vse $(x, y) \in U \cap D$; če za $(x, y) \neq T_0$ velja stroga neenakost, je minimum **strog**. Podobno definiramo **lokalni maksimum** z $\le$. **Globalni** (absolutni) minimum na množici $D$ je najmanjša vrednost $f$ na vsem $D$.

**2. Stacionarne točke.** **Izrek (potrebni pogoj).** Naj ima $f$ v notranji točki $T_0$ množice $D$ lokalni ekstrem in naj v $T_0$ obstajata oba parcialna odvoda. Potem je tam **gradient enak nič**:

$$\nabla f(x_0, y_0) = \big(f_x(x_0, y_0),\ f_y(x_0, y_0)\big) = (0, 0).$$

Razlog: če $y$ zamrznemo na $y_0$, ima funkcija ene spremenljivke $x \mapsto f(x, y_0)$ ekstrem v $x_0$, zato je njen odvod $f_x(x_0, y_0) = 0$. Enako velja za $y$. Točkam z ničelnim gradientom pravimo **stacionarne** (kritične) točke. Iščemo jih tako, da rešimo sistem

$$f_x(x, y) = 0, \qquad f_y(x, y) = 0.$$

Pogoj je **potreben, ne pa zadosten**: v stacionarni točki je lahko minimum, maksimum ali pa **sedlo**. Primer sedla je $f(x, y) = x^2 - y^2$ v $(0, 0)$: v smeri osi $x$ funkcija narašča, v smeri osi $y$ pada. Graf je videti kot konjsko sedlo ali gorski prelaz.

:::premisli
Ima funkcija $f(x, y) = xy$ v izhodišču ekstrem?
---
Nima, izhodišče je sedlo. Gradient $(y, x)$ je tam res nič, a na premici $y = x$ je $f = x^2 \ge 0$, na premici $y = -x$ pa $f = -x^2 \le 0$, zato $f$ blizu izhodišča zavzame oba predznaka.
:::

**3. Hessejeva matrika.** Drugi parcialni odvodi tvorijo **Hessejevo matriko**

$$H(x, y) = \begin{bmatrix} f_{xx} & f_{xy} \\ f_{yx} & f_{yy} \end{bmatrix}.$$

Če sta mešana odvoda zvezna v okolici točke, je po Schwarzovem izreku $f_{xy} = f_{yx}$, zato je $H$ simetrična. Njena determinanta je $\det H = f_{xx} f_{yy} - f_{xy}^2$.

**4. Zadostni pogoj (test drugih odvodov).** Naj ima $f$ zvezne druge parcialne odvode v okolici stacionarne točke $T_0$ in naj bo $A = f_{xx}(T_0)$, $B = f_{xy}(T_0)$, $C = f_{yy}(T_0)$ in $D = AC - B^2$.

| $D = \det H$ | $A = f_{xx}$ | narava točke |
|---|---|---|
| $D > 0$ | $A > 0$ | lokalni minimum |
| $D > 0$ | $A < 0$ | lokalni maksimum |
| $D < 0$ | poljuben | sedlo (ni ekstrema) |
| $D = 0$ | poljuben | test ne odloči |

Pri $D > 0$ sta $A$ in $C$ istega predznaka, zato lahko namesto $A$ pogledamo tudi $C$. Pri $D = 0$ moramo funkcijo raziskati drugače, na primer s pogledom vrednosti vzdolž premic skozi točko.

Ideja testa: blizu stacionarne točke je funkcija po Taylorjevi formuli približno kvadratna,
$$f(x_0 + h, y_0 + k) \approx f(x_0, y_0) + \tfrac{1}{2}\left(Ah^2 + 2Bhk + Ck^2\right).$$
Če je kvadratna forma za vse $(h, k) \neq (0, 0)$ pozitivna, je v točki minimum; če je negativna, maksimum; če zavzame oba predznaka, sedlo. Pri $A \neq 0$ jo dopolnimo do kvadrata:
$$Ah^2 + 2Bhk + Ck^2 = A\left(h + \tfrac{B}{A}k\right)^2 + \tfrac{AC - B^2}{A}\,k^2.$$
Pri $D > 0$ imata oba člena predznak števila $A$ in nista hkrati nič, zato je forma pri $A > 0$ pozitivna, pri $A < 0$ negativna. Pri $D < 0$ da $k = 0$, $h \neq 0$ predznak $A$, izbira $h = -\frac{B}{A}k$, $k \neq 0$ pa nasprotni predznak, zato je točka sedlo. (Pri $A = 0$ in $D < 0$ je $B \neq 0$ in forma $2Bhk + Ck^2$ prav tako zavzame oba predznaka.)

**5. Več spremenljivk.** Za $f(x_1, \dots, x_n)$ je stacionarna točka rešitev sistema $\frac{\partial f}{\partial x_i} = 0$, $i = 1, \dots, n$, Hessejeva matrika pa je $n \times n$ z elementi $\frac{\partial^2 f}{\partial x_i \partial x_j}$. Če je $H$ v stacionarni točki **pozitivno definitna** (vse lastne vrednosti pozitivne), je tam lokalni minimum; če je **negativno definitna**, maksimum; če ima lastne vrednosti obeh predznakov, sedlo. Pozitivno definitnost preverimo s **Sylvestrovim kriterijem**: vse vodilne glavne poddeterminante $\Delta_1 = f_{x_1x_1}$, $\Delta_2$, …, $\Delta_n = \det H$ so pozitivne. Za negativno definitnost morajo predznaki alternirati: $\Delta_1 < 0$, $\Delta_2 > 0$, $\Delta_3 < 0$, …

**6. Vezani ekstremi in Lagrangeova metoda.** Pogosto spremenljivke niso proste, ampak jih veže pogoj $g(x, y) = 0$: škatla mora imeti dano prostornino, vsota deležev mora biti $1$, točka mora ležati na krivulji. Iščemo ekstreme $f$ le med točkami, ki pogoju zadoščajo.

Če iz pogoja lahko izrazimo eno spremenljivko, jo vstavimo v $f$ in dobimo problem z manj spremenljivkami. Splošnejša je **Lagrangeova metoda**. Sestavimo **Lagrangeovo funkcijo**

$$L(x, y, \lambda) = f(x, y) - \lambda\, g(x, y)$$

in poiščemo njene stacionarne točke:

$$f_x = \lambda g_x, \qquad f_y = \lambda g_y, \qquad g(x, y) = 0.$$

Število $\lambda$ je **Lagrangeov multiplikator**. Geometrijski pomen: v točki vezanega ekstrema sta gradienta $\nabla f$ in $\nabla g$ **vzporedna**, $\nabla f = \lambda \nabla g$. Nivojnica funkcije $f$ se tam krivulje $g = 0$ le dotika. Če bi jo sekala, bi se lahko po krivulji premaknili do večje ali manjše vrednosti $f$.

:::premisli
Zakaj pri vezanem ekstremu ne zahtevamo $\nabla f = 0$?
---
Ker se smemo gibati le vzdolž krivulje $g = 0$. Dovolj je, da se $f$ v smeri tangente ne spreminja, torej da je $\nabla f$ pravokoten na tangento in s tem vzporeden $\nabla g$. Funkcija $f = x + y$ ima povsod $\nabla f = (1, 1) \neq 0$, na krožnici pa vseeno doseže največjo vrednost.
:::

**Izrek (Lagrange).** Naj bosta $f$ in $g$ zvezno odvedljivi v okolici točke $T_0$, $g(T_0) = 0$ in $\nabla g(T_0) \neq 0$. Če ima $f$ v $T_0$ lokalni ekstrem na množici $\{g = 0\}$, obstaja $\lambda \in \mathbb{R}$, da je $\nabla f(T_0) = \lambda \nabla g(T_0)$.

*Dokaz (skica).* Ker je $\nabla g(T_0) \neq 0$, je krivulja $g = 0$ blizu $T_0$ po izreku o implicitni funkciji gladka: ima parametrizacijo $r(t)$ z $r(0) = T_0$ in $r'(0) \neq 0$. Funkcija $\varphi(t) = f(r(t))$ ima ekstrem pri $t = 0$, zato je $\varphi'(0) = \nabla f(T_0) \cdot r'(0) = 0$. Iz $g(r(t)) = 0$ z odvajanjem dobimo še $\nabla g(T_0) \cdot r'(0) = 0$. V ravnini sta oba gradienta pravokotna na isti neničelni vektor $r'(0)$, zato sta vzporedna, in ker je $\nabla g(T_0) \neq 0$, je $\nabla f(T_0) = \lambda \nabla g(T_0)$.

Točke, kjer je $\nabla g = 0$, moramo zato pregledati posebej. Pri več spremenljivkah in več pogojih $g_1 = 0, \dots, g_m = 0$ uvedemo po en multiplikator za vsak pogoj: $\nabla f = \lambda_1 \nabla g_1 + \dots + \lambda_m \nabla g_m$.

**7. Globalni ekstremi na zaprti omejeni množici.** **Weierstrassov izrek:** naj bo $D \subset \mathbb{R}^n$ zaprta in omejena, $f$ pa zvezna na $D$; potem $f$ na $D$ zavzame največjo in najmanjšo vrednost. Iščemo ju takole: (1) stacionarne točke v notranjosti $D$, (2) vezane ekstreme na robu $D$ (z Lagrangeovo metodo ali parametrizacijo roba), (3) oglišča roba, če obstajajo. Med vsemi dobljenimi vrednostmi izberemo največjo in najmanjšo. Hessejeve matrike tu ne potrebujemo.

## Rešeni primeri

### Primer 1 (lažji)

Poišči stacionarne točke funkcije $f(x, y) = x^2 + y^2 - 4x + 6y + 1$ in določi njihovo naravo.

**Podatki:** $f(x, y) = x^2 + y^2 - 4x + 6y + 1$, definirana na $\mathbb{R}^2$
**Iščemo:** stacionarne točke, njihovo naravo in vrednost funkcije v njih

:::formula
Stacionarna točka: $f_x = 0$, $f_y = 0$. Test: $D = f_{xx} f_{yy} - f_{xy}^2$; $D > 0$ in $f_{xx} > 0$ pomeni lokalni minimum.
:::

**Rešitev:**

1. Parcialna odvoda: $f_x = 2x - 4$, $f_y = 2y + 6$.
2. Sistem $2x - 4 = 0$, $2y + 6 = 0$ ima rešitev $x = 2$, $y = -3$. Edina stacionarna točka je $T(2, -3)$.
3. Drugi odvodi: $f_{xx} = 2$, $f_{yy} = 2$, $f_{xy} = 0$, torej $D = 2 \cdot 2 - 0^2 = 4 > 0$ in $f_{xx} > 0$, zato je v $T$ lokalni minimum.
4. Vrednost: $f(2, -3) = 4 + 9 - 8 - 18 + 1 = -12$.
5. Preizkus z dopolnitvijo do kvadrata: $f = (x - 2)^2 + (y + 3)^2 - 12 \ge -12$. Minimum je celo globalni.
6. Odgovor: funkcija ima v točki $(2, -3)$ minimum z vrednostjo $-12$.

### Primer 2

Poišči in razvrsti stacionarne točke funkcije $f(x, y) = x^3 + y^3 - 3xy$.

**Podatki:** $f(x, y) = x^3 + y^3 - 3xy$, definirana na $\mathbb{R}^2$
**Iščemo:** vse stacionarne točke in njihovo naravo

:::formula
$\nabla f = 0$; $H = \begin{bmatrix} f_{xx} & f_{xy} \\ f_{xy} & f_{yy} \end{bmatrix}$, $D = \det H$. $D < 0$: sedlo; $D > 0$, $f_{xx} > 0$: minimum; $D > 0$, $f_{xx} < 0$: maksimum.
:::

**Rešitev:**

1. Parcialna odvoda: $f_x = 3x^2 - 3y$, $f_y = 3y^2 - 3x$.
2. Iz $f_x = 0$ sledi $y = x^2$. Vstavimo v $f_y = 0$: $x^4 - x = 0$, torej $x(x^3 - 1) = 0$, od koder $x = 0$ ali $x = 1$ (realne rešitve).
3. Stacionarni točki sta $T_1(0, 0)$ in $T_2(1, 1)$.
4. Drugi odvodi: $f_{xx} = 6x$, $f_{yy} = 6y$, $f_{xy} = -3$, zato je $D = 36xy - 9$.
5. V $T_1$: $D = -9 < 0$, torej je $T_1$ sedlo.
6. V $T_2$: $D = 36 - 9 = 27 > 0$ in $f_{xx} = 6 > 0$, torej je v $T_2$ lokalni minimum z vrednostjo $f(1, 1) = 1 + 1 - 3 = -1$.
7. Minimum ni globalen: $f(x, 0) = x^3$ gre za $x \to -\infty$ proti $-\infty$.
8. Odgovor: $(0, 0)$ je sedlo, v $(1, 1)$ ima funkcija lokalni minimum $-1$; globalnega ekstrema ni.

### Primer 3 (težji)

Izdelati želimo pravokotno škatlo brez pokrova s prostornino $32\,\mathrm{dm^3}$. Kakšne naj bodo mere, da porabimo čim manj materiala? Določi tudi Lagrangeov multiplikator in z njim oceni, za koliko se poveča najmanjša površina, če prostornino povečamo na $33\,\mathrm{dm^3}$.

**Podatki:** prostornina $V = xyz = 32\,\mathrm{dm^3}$, škatla brez pokrova (dno in štiri stranice), dolžina $x$, širina $y$, višina $z$, vse pozitivne
**Iščemo:** mere $x$, $y$, $z$, pri katerih je površina $S$ najmanjša, to površino, multiplikator $\lambda$ in spremembo $\Delta S$

:::formula
$S = xy + 2xz + 2yz$, pogoj $g = xyz - V = 0$. Lagrange: $\nabla S = \lambda \nabla g$, $g = 0$. Pomen multiplikatorja: $\frac{dS_{\min}}{dV} = \lambda$.
:::

**Rešitev:**

1. Površina: dno $xy$, sprednja in zadnja stranica $2xz$, levi in desni bok $2yz$, torej $S = xy + 2xz + 2yz$.
2. Gradienta: $\nabla S = (y + 2z,\ x + 2z,\ 2x + 2y)$, $\nabla g = (yz,\ xz,\ xy)$.
3. Lagrangeove enačbe: $y + 2z = \lambda yz$, $x + 2z = \lambda xz$, $2x + 2y = \lambda xy$.
4. Prvo enačbo pomnožimo z $x$, drugo z $y$: $xy + 2xz = \lambda xyz = xy + 2yz$, zato $2xz = 2yz$ in $x = y$.
5. Drugo enačbo pomnožimo z $y$, tretjo z $z$: $xy + 2yz = \lambda xyz = 2xz + 2yz$, zato $xy = 2xz$ in $y = 2z$. Torej $x = y = 2z$.
6. Vstavimo v pogoj: $2z \cdot 2z \cdot z = 4z^3 = 32$, $z^3 = 8$, $z = 2\,\mathrm{dm}$, $x = y = 4\,\mathrm{dm}$.
7. Površina: $S = 4 \cdot 4 + 2 \cdot 4 \cdot 2 + 2 \cdot 4 \cdot 2 = 16 + 16 + 16 = 48\,\mathrm{dm^2}$.
8. To je res minimum: ko gre katerakoli mera proti $0$ ali $\infty$, gre $S$ proti $\infty$, zato zvezna funkcija na tej ploskvi zavzame najmanjšo vrednost, edina kandidatka pa je najdena točka. Za primerjavo: kocka z robom $\sqrt[3]{32} \approx 3{,}17\,\mathrm{dm}$ bi porabila $5 \cdot 3{,}17^2 \approx 50{,}4\,\mathrm{dm^2}$.
9. Multiplikator iz prve enačbe: $4 + 2 \cdot 2 = \lambda \cdot 4 \cdot 2$, torej $\lambda = 1\,\mathrm{dm^{-1}}$.
10. Preverimo pomen: za poljuben $V$ je $x = y = 2z$ in $4z^3 = V$, torej $S_{\min} = 12z^2 = 12\left(\frac{V}{4}\right)^{2/3}$ in $\frac{dS_{\min}}{dV} = \frac{2}{z}$, kar je pri $z = 2\,\mathrm{dm}$ ravno $1\,\mathrm{dm^{-1}} = \lambda$.
11. Ocena: $\Delta S \approx \lambda\, \Delta V = 1\,\mathrm{dm^{-1}} \cdot 1\,\mathrm{dm^3} = 1\,\mathrm{dm^2}$. Natančno: $12 \cdot 8{,}25^{2/3} = 49{,}0\,\mathrm{dm^2}$, torej $\Delta S = 0{,}995\,\mathrm{dm^2}$.
12. Odgovor: škatla naj ima dno $4\,\mathrm{dm} \times 4\,\mathrm{dm}$ in višino $2\,\mathrm{dm}$; porabimo $48\,\mathrm{dm^2}$ materiala. Multiplikator je $\lambda = 1\,\mathrm{dm^{-1}}$, zato dodatni $\mathrm{dm^3}$ prostornine zahteva približno $1\,\mathrm{dm^2}$ materiala več.

### Primer 4 – zdaj ti

Tonska mojstrica v studiu nastavlja izenačevalnik: $x$ je ojačanje nizkih tonov, $y$ ojačanje visokih tonov (oboje v $\mathrm{dB}$). Odstopanje posnetka od želenega zvoka opisuje model $N(x, y) = 2x^2 + 2xy + y^2 - 4x - 6y + 20$. Pri katerih nastavitvah je odstopanje najmanjše in koliko je?

**Podatki:** $N(x, y) = 2x^2 + 2xy + y^2 - 4x - 6y + 20$, $x$ in $y$ v $\mathrm{dB}$
**Iščemo:** stacionarno točko, njeno naravo in vrednost $N$ v njej

:::formula
$N_x = 0$, $N_y = 0$; $D = N_{xx} N_{yy} - N_{xy}^2$, pri $D > 0$ in $N_{xx} > 0$ je minimum.
:::

**Rešitev:**

1. Parcialna odvoda: $N_x = 4x + 2y - 4$, $N_y = 2x + 2y - 6$.
2. Enačbi $N_x = 0$ in $N_y = 0$ odštejemo, da se $y$ izloči: $2x + 2 = 0$, torej $x = -1$ in iz $N_y = 0$ še $y = 4$.
3. Drugi odvodi: $N_{xx} = 4$, $N_{yy} = 2$, $N_{xy} = 2$.
4. Izračunaj $D$, določi naravo točke $(-1, 4)$ in vrednost $N$ v njej.

:::premisli
Je $(-1, 4)$ minimum, maksimum ali sedlo in kolikšno je tam odstopanje?
---
$D = 4 \cdot 2 - 2^2 = 4 > 0$ in $N_{xx} = 4 > 0$, zato je v $(-1, 4)$ minimum. Vrednost je $N(-1, 4) = 2 - 8 + 16 + 4 - 24 + 20 = 10$: nizke tone je treba za $1\,\mathrm{dB}$ znižati, visoke za $4\,\mathrm{dB}$ zvišati.
:::

## Pogoste napake

- **Vsaka stacionarna točka je ekstrem.** Ničelni gradient je le potreben pogoj. Pri $f = x^2 - y^2$ je $(0, 0)$ stacionarna, a je sedlo. Vedno preveri naravo točke.
- **Napačen izraz za determinanto.** Pravilno je $D = f_{xx} f_{yy} - f_{xy}^2$, ne $f_{xx} f_{yy} + f_{xy}^2$ in ne $f_{xx} f_{yy} - f_{xy}$.
- **Sklep pri $D = 0$.** Študent pri $D = 0$ zapiše »ni ekstrema«. Test tedaj ne odloči: $f = x^4 + y^4$ ima v izhodišču minimum, $f = x^4 - y^4$ sedlo, obe pa imata $D = 0$.
- **Izgubljene rešitve sistema.** Pri $x(x^3 - 1) = 0$ študent deli z $x$ in izgubi $x = 0$. Sistem rešuj z razstavljanjem, ne z deljenjem s spremenljivko.
- **Lokalni minimum razglašen za globalnega.** V Primeru 2 je lokalni minimum $-1$, funkcija pa zavzame poljubno majhne vrednosti. Za globalni ekstrem je potrebna dodatna utemeljitev.
- **Hessejev test pri vezanih ekstremih.** Hessejeva matrika funkcije $f$ v točki vezanega ekstrema ne pove narave, ker se smemo gibati le po krivulji pogoja. Uporabi obnašanje na robu, primerjavo vrednosti ali obrobljeno Hessejevo matriko.
- **Pozabljen pogoj v Lagrangeovem sistemu.** Enačbe $\nabla f = \lambda \nabla g$ same niso dovolj; brez $g = 0$ je neznank več kot enačb.

## Povzetek

- Stacionarna točka: $\nabla f = 0$. Ekstrem v notranji točki je vedno v stacionarni točki, obratno pa ne velja (sedlo).
- Hessejeva matrika $H = \begin{bmatrix} f_{xx} & f_{xy} \\ f_{xy} & f_{yy} \end{bmatrix}$, $D = f_{xx}f_{yy} - f_{xy}^2$.
- $D > 0$, $f_{xx} > 0$: minimum; $D > 0$, $f_{xx} < 0$: maksimum; $D < 0$: sedlo; $D = 0$: test ne odloči.
- Pri $n$ spremenljivkah: pozitivno (negativno) definitna $H$ pomeni minimum (maksimum); Sylvestrov kriterij.
- Vezani ekstremi: $L = f - \lambda g$, sistem $\nabla f = \lambda \nabla g$, $g = 0$; gradienta sta vzporedna.
- Globalni ekstremi na zaprti omejeni množici: notranje stacionarne točke, rob in oglišča, nato primerjava vrednosti.

## Za izpit

Znati moraš povedati:

- definicijo lokalnega (strogega) in globalnega ekstrema ter stacionarne točke;
- potrebni pogoj za lokalni ekstrem v notranji točki z dokazom in zakaj ni zadosten;
- test drugih odvodov z vsemi pogoji in utemeljitev z dopolnitvijo do kvadrata; Sylvestrov kriterij za $n$ spremenljivk;
- Lagrangeov izrek s pogojem $\nabla g \neq 0$, skico dokaza in geometrijski pomen;
- Weierstrassov izrek in postopek za globalne ekstreme na zaprti omejeni množici.

### Naloga 1

Poišči največjo in najmanjšo vrednost funkcije $f(x, y) = x^2 + 2y^2 - x$ na krogu $D = \{(x, y) : x^2 + y^2 \le 4\}$.

**Rešitev:**

1. $D$ je zaprt in omejen, $f$ zvezna, zato po Weierstrassovem izreku obe vrednosti obstajata.
2. Notranjost: $f_x = 2x - 1 = 0$, $f_y = 4y = 0$ da $T_1\left(\frac{1}{2}, 0\right)$, ki leži v $D$; $f(T_1) = \frac{1}{4} - \frac{1}{2} = -\frac{1}{4}$.
3. Rob $g = x^2 + y^2 - 4 = 0$, kjer je $\nabla g = (2x, 2y) \neq 0$: Lagrangeove enačbe $2x - 1 = 2\lambda x$, $4y = 2\lambda y$, $x^2 + y^2 = 4$.
4. Iz druge enačbe $y(4 - 2\lambda) = 0$, torej $y = 0$ ali $\lambda = 2$.
5. Pri $y = 0$ je $x = \pm 2$: $f(2, 0) = 4 - 2 = 2$ in $f(-2, 0) = 4 + 2 = 6$.
6. Pri $\lambda = 2$: $2x - 1 = 4x$, $x = -\frac{1}{2}$, $y^2 = 4 - \frac{1}{4} = \frac{15}{4}$, $y = \pm\frac{\sqrt{15}}{2}$; $f = \frac{1}{4} + 2 \cdot \frac{15}{4} + \frac{1}{2} = \frac{33}{4}$.
7. Primerjava kandidatov $-\frac{1}{4}$, $2$, $6$, $\frac{33}{4}$.
8. Odgovor: najmanjša vrednost je $-\frac{1}{4}$ v $\left(\frac{1}{2}, 0\right)$, največja $\frac{33}{4} = 8{,}25$ v točkah $\left(-\frac{1}{2}, \pm\frac{\sqrt{15}}{2}\right)$.

### Naloga 2

Natančno navedi zadostni pogoj za lokalni ekstrem funkcije dveh spremenljivk in ga utemelji. Nato poišči in razvrsti stacionarne točke funkcije $f(x, y) = x^4 + y^4 - 4xy$ in utemelji, ali so najdeni minimumi globalni.

**Rešitev:**

1. Izrek: naj ima $f$ zvezne druge parcialne odvode v okolici stacionarne točke $T_0$, $A = f_{xx}(T_0)$, $B = f_{xy}(T_0)$, $C = f_{yy}(T_0)$, $D = AC - B^2$. Pri $D > 0$, $A > 0$ je v $T_0$ strogi lokalni minimum, pri $D > 0$, $A < 0$ strogi lokalni maksimum, pri $D < 0$ sedlo; pri $D = 0$ test ne odloči.
2. Utemeljitev: po Taylorjevi formuli je $f(T_0 + (h, k)) - f(T_0) = \frac{1}{2}(Ah^2 + 2Bhk + Ck^2) + R$, ker je $\nabla f(T_0) = 0$; ostanek $R$ gre proti $0$ hitreje kot $h^2 + k^2$. Pri $A \neq 0$ je $Ah^2 + 2Bhk + Ck^2 = A\left(h + \frac{B}{A}k\right)^2 + \frac{D}{A}k^2$: pri $D > 0$ ima forma za $(h, k) \neq (0, 0)$ predznak $A$ in za majhne $(h, k)$ prevlada nad ostankom; pri $D < 0$ izbiri $k = 0$, $h \neq 0$ in $h = -\frac{B}{A}k$, $k \neq 0$ dasta nasprotna predznaka, zato je točka sedlo.
3. Odvoda: $f_x = 4x^3 - 4y$, $f_y = 4y^3 - 4x$. Iz $f_x = 0$ je $y = x^3$, vstavimo: $x^9 - x = x(x^8 - 1) = 0$, torej $x \in \{0, 1, -1\}$.
4. Stacionarne točke: $(0, 0)$, $(1, 1)$, $(-1, -1)$.
5. $f_{xx} = 12x^2$, $f_{yy} = 12y^2$, $f_{xy} = -4$, $D = 144x^2y^2 - 16$.
6. V $(0, 0)$: $D = -16 < 0$, sedlo. V $(1, 1)$ in $(-1, -1)$: $D = 128 > 0$, $f_{xx} = 12 > 0$, lokalni minimum z vrednostjo $1 + 1 - 4 = -2$.
7. Globalnost: ker je $4xy \le 2(x^2 + y^2)$, je $f \ge x^4 - 2x^2 + y^4 - 2y^2 = (x^2 - 1)^2 + (y^2 - 1)^2 - 2 \ge -2$.
8. Odgovor: $(0, 0)$ je sedlo, v $(1, 1)$ in $(-1, -1)$ ima $f$ minimum $-2$, ki je tudi globalni.

## Drugače: Na sliki

Graf $z = f(x, y)$ je kot **pokrajina**. Sedlo je prelaz: na grebenu med vrhovoma je najnižja točka, na poti iz doline v dolino pa najvišja. Na **zemljevidu z nivojnicami** so okoli minimuma in maksimuma sklenjene krivulje, podobne elipsam, okoli sedla pa hiperbolam; nivojnica skozi sedlo se seka v obliki črke X.

Narišimo še pot $g(x, y) = 0$. Najvišja točka na njej je tam, kjer se pot ene od nivojnic **le dotakne** in je ne seka: tam sta $\nabla f$ in $\nabla g$ pravokotna na pot, torej vzporedna, $\nabla f = \lambda \nabla g$.

## Drugače: Uporaba v stroki

**Umeritvena premica.** Skozi meritve $(x_i, y_i)$, npr. absorbance standardov z znano koncentracijo, iščemo premico $y = kx + n$ z najmanjšo vsoto kvadratov odstopanj $F(k, n) = \sum_i (y_i - kx_i - n)^2$. Pogoja $F_k = 0$, $F_n = 0$ sta linearni **normalni enačbi**. Hessejeva matrika $2\begin{bmatrix} \sum x_i^2 & \sum x_i \\ \sum x_i & m \end{bmatrix}$ ($m$ meritev) je pozitivno definitna, če niso vsi $x_i$ enaki: rešitev je minimum.

**Optimizacija procesa.** Pri metodologiji odzivnih ploskev izkoristku, izmerjenemu pri načrtovanih kombinacijah temperature in tlaka, prilagodimo kvadratni polinom. Njegova stacionarna točka je kandidat za optimum; Hessejeva matrika loči maksimum od sedla.

**Ploskev potencialne energije.** Energija molekule je funkcija koordinat jeder. Optimizacija geometrije išče točke z ničelnim gradientom: stabilna struktura ima pozitivno definitno Hessejevo matriko, prehodno stanje reakcije pa natanko eno negativno lastno vrednost (imaginarno frekvenco).

**Kemijsko ravnotežje.** Ravnotežna sestava pri danih $T$ in $p$ minimizira Gibbsovo prosto energijo pri vezeh ohranitve atomov; vsak element dobi svoj Lagrangeov multiplikator.

## Drugače: Korak za korakom s številkami

Določi ekstreme funkcije $f(x, y) = 2x^2 + y^2 - 2xy - 4x + 1$.

1. **Prvi odvodi:** $f_x = 4x - 2y - 4$, $f_y = 2y - 2x$.
2. **Sistem:** iz $f_y = 0$ sledi $y = x$; vstavimo v $f_x = 0$: $4x - 2x - 4 = 0$, $x = 2$, torej $y = 2$.
3. **Stacionarna točka:** $T(2, 2)$.
4. **Drugi odvodi:** $f_{xx} = 4$, $f_{yy} = 2$, $f_{xy} = -2$.
5. **Determinanta:** $D = 4 \cdot 2 - (-2)^2 = 8 - 4 = 4 > 0$, $f_{xx} = 4 > 0$, torej minimum.
6. **Vrednost:** $f(2, 2) = 8 + 4 - 8 - 8 + 1 = -3$.
7. **Preizkus:** $f(3, 2) = 18 + 4 - 12 - 12 + 1 = -1$ in $f(2, 3) = 8 + 9 - 12 - 8 + 1 = -2$ sta večji od $-3$.

## Drugače: Bolj natančno

**Potrebni pogoj.** Naj ima $f$ v notranji točki $a \in D \subseteq \mathbb{R}^n$ lokalni ekstrem in naj bo odvedljiva v $a$. Za vsak vektor $h$ ima funkcija $\varphi(t) = f(a + th)$ lokalni ekstrem v $t = 0$, zato je $\varphi'(0) = \nabla f(a) \cdot h = 0$. Ker to velja za vse $h$, je $\nabla f(a) = 0$.

**Zadostni pogoj.** Naj ima $f$ zvezne druge parcialne odvode v okolici stacionarne točke $a$. Po Taylorjevi formuli je
$$f(a + h) = f(a) + \tfrac{1}{2}\, h^{\mathsf T} H(a)\, h + o(\|h\|^2).$$
Če je $H(a)$ pozitivno definitna, je njena najmanjša lastna vrednost $m > 0$ in $h^{\mathsf T} H h \ge m\|h\|^2$. Za dovolj majhen $\|h\|$ je ostanek po absolutni vrednosti manjši od $\frac{m}{4}\|h\|^2$, zato je $f(a + h) - f(a) \ge \frac{m}{4}\|h\|^2 > 0$ za $h \neq 0$: v $a$ je strogi lokalni minimum. Če ima $H(a)$ lastni vrednosti obeh predznakov, vzdolž ustreznih lastnih vektorjev $f$ enkrat narašča, drugič pada, zato je $a$ sedlo.

**Ko $\nabla g = 0$.** Pogoj $\nabla g(a) \neq 0$ v Lagrangeovem izreku je bistven: pri $f = x$ in $g = y^2 - x^3$ je minimum v $(0, 0)$, kjer je $\nabla g = 0$; Lagrangeov sistem ga ne najde.

**Narava vezanega ekstrema.** Odloči jo predznak forme $h^{\mathsf T} H_L h$ ($H_L$ je Hessejeva matrika Lagrangeove funkcije po $x$ in $y$) na tangentnih vektorjih z $\nabla g \cdot h = 0$: test z **obrobljeno Hessejevo matriko**.

## Preveri se

? Katera je stacionarna točka funkcije $f(x, y) = x^2 + xy + y^2 - 3x$?
- $(1, 1)$
~ Ta točka zadošča le enačbi $f_x = 0$; preveri še $f_y = x + 2y$, ki tu ni nič.
+ $(2, -1)$
- $(-2, 1)$
~ Predznaka sta zamenjana; vstavi v $f_x = 2x + y - 3$ in dobiš $-6$, ne $0$.
- $\left(\frac{3}{2}, 0\right)$
~ Dobiš, če člen $xy$ pri odvajanju izpustiš; njegova odvoda po $x$ in po $y$ sta $y$ in $x$, ne $0$.
> $f_x = 2x + y - 3 = 0$ in $f_y = x + 2y = 0$. Iz druge $x = -2y$, vstavimo: $-4y + y = 3$, $y = -1$, $x = 2$.

? V stacionarni točki je $f_{xx} = 2$, $f_{yy} = -8$ in $f_{xy} = 1$. Kaj je ta točka?
- lokalni minimum
~ Pogledal si le $f_{xx} > 0$; predznak $f_{xx}$ odloča šele, ko je $D > 0$.
- lokalni maksimum
~ Pogledal si le $f_{yy} < 0$; ko sta $f_{xx}$ in $f_{yy}$ različnih predznakov, je $D$ negativen.
+ sedlo
- test ne odloči
~ To velja le pri $D = 0$, tu pa $D$ ni nič.
> $D = 2 \cdot (-8) - 1^2 = -17 < 0$, zato je točka sedlo.

? Funkcija ima v stacionarni točki $D = f_{xx} f_{yy} - f_{xy}^2 = 0$. Kaj lahko zanesljivo sklepamo?
- v točki ni ekstrema
~ Pri $D = 0$ ekstrem lahko obstaja: $x^4 + y^4$ ima v izhodišču minimum.
- v točki je sedlo
~ Sedlo zanesljivo napove le $D < 0$; pri $D = 0$ je lahko tudi ekstrem.
+ test drugih odvodov ne odloči, potrebna je dodatna raziskava
- v točki je minimum, če je $f_{xx} > 0$
~ To pravilo velja le pri $D > 0$; $x^2 + y^3$ ima v izhodišču $D = 0$ in $f_{xx} = 2$, minimuma pa ni.
> Pri $D = 0$ je lahko v točki minimum ($x^4 + y^4$), maksimum ($-x^4 - y^4$) ali sedlo ($x^4 - y^4$).

? Kolikšna je največja vrednost $f(x, y) = x + y$ pri pogoju $x^2 + y^2 = 2$?
- $\sqrt{2}$
~ To je polmer krožnice oziroma vrednost $f(\sqrt{2}, 0)$; v tej točki gradienta nista vzporedna.
+ $2$
- $4$
~ To je največja vrednost $(x + y)^2$, ne $x + y$; pozabil si koreniti.
- $1$
~ To je koordinata $x = 1$ točke maksimuma, ne vrednost $f(1, 1)$.
> Lagrange: $1 = 2\lambda x$, $1 = 2\lambda y$, torej $x = y$; iz $2x^2 = 2$ sledi $x = \pm 1$. V $(1, 1)$ je največja vrednost $2$, v $(-1, -1)$ najmanjša $-2$.

? Zakaj sta v točki vezanega ekstrema gradienta $\nabla f$ in $\nabla g$ vzporedna?
- Ker je v vsakem ekstremu $\nabla f = 0$.
~ To velja za proste ekstreme v notranjosti; pri vezanem je $\nabla f$ navadno različen od nič, npr. $(1, 1)$ pri $f = x + y$.
+ Ker bi sicer $\nabla f$ imel komponento vzdolž krivulje $g = 0$ in bi se po njej lahko premaknili do večje ali manjše vrednosti.
- Ker je Lagrangeov multiplikator vedno $\lambda = 1$.
~ Multiplikator je lahko poljubno število in ga dobimo šele iz sistema; vzporednost ne izhaja iz njegove vrednosti.
> Na krivulji se gibljemo le v smeri tangente, ki je pravokotna na $\nabla g$. Če $f$ v tej smeri ne sme ne rasti ne padati, je tudi $\nabla f$ pravokoten na tangento, torej $\nabla f = \lambda \nabla g$.

:::simboli
f | funkcija dveh ali več spremenljivk | |
x, y | neodvisni spremenljivki | | | pri škatli dolžina in širina
z | višina škatle (tretja spremenljivka) | |
x_0, y_0 | koordinati točke T₀ | |
T | stacionarna točka | | | tam je gradient enak nič
f_x | parcialni odvod funkcije f po x | |
f_y | parcialni odvod funkcije f po y | |
H | Hessejeva matrika | H = \begin{bmatrix} f_{xx} & f_{xy} \\ f_{xy} & f_{yy} \end{bmatrix} | | simetrična, ker je f_xy = f_yx
f_{xx} | drugi parcialni odvod po x | |
f_{yy} | drugi parcialni odvod po y | |
f_{xy}, f_{yx} | mešana druga parcialna odvoda | | | enaka po Schwarzovem izreku
h, k | prirastka spremenljivk x in y | | | v f(a + h) je h vektor prirastkov
A | vrednost f_xx v stacionarni točki | A = f_{xx}(T_0) |
B | vrednost f_xy v stacionarni točki | B = f_{xy}(T_0) |
C | vrednost f_yy v stacionarni točki | C = f_{yy}(T_0) |
D | determinanta Hessejeve matrike | D = f_{xx} f_{yy} - f_{xy}^2 | | D > 0 in A > 0: minimum; D < 0: sedlo; D je tudi množica, na kateri iščemo ekstreme
L | Lagrangeova funkcija | L(x, y, \lambda) = f(x, y) - \lambda\, g(x, y) |
\lambda | Lagrangeov multiplikator | |
g | funkcija vezi | | | pogoj g(x, y) = 0
g_x, g_y | parcialna odvoda funkcije vezi | |
a | notranja točka lokalnega ekstrema v ℝⁿ | |
o | mali o (Landauova oznaka) | | | o(‖h‖²) gre proti nič hitreje kot ‖h‖²
S | površina škatle brez pokrova | S = xy + 2xz + 2yz |
V | prostornina škatle | V = xyz | dm³ | Primer 3
\Delta S | sprememba najmanjše površine | \Delta S \approx \lambda\, \Delta V | dm²
d | oznaka diferenciala | | | dS/dV je odvod S po V
N | odstopanje posnetka od želenega zvoka | | | v primeru 4; x, y sta ojačanji v dB
:::
