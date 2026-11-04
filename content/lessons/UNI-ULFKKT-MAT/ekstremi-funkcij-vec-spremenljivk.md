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

Najprej slika. Graf funkcije $z = f(x, y)$ je ploskev nad ravnino $xy$, podobna pokrajini. Tri oblike okoli točke, kjer so »tla vodoravna«, so:

| oblika | kako gre ploskev iz točke | nivojnice okoli točke | zgled v $(0, 0)$ |
|---|---|---|---|
| kotanja (minimum) | v vseh smereh navzgor | sklenjene, podobne elipsam | $x^2 + y^2$ |
| vrh (maksimum) | v vseh smereh navzdol | sklenjene, podobne elipsam | $-x^2 - y^2$ |
| prelaz (sedlo) | v nekaterih smereh gor, v drugih dol | hiperbole, skozi točko križ X | $x^2 - y^2$ |

Vodoravna tla opiše gradient, ukrivljenost okoli točke pa drugi odvodi; spodaj to zapišemo s simboli.

**1. Lokalni in globalni ekstremi.** Funkcija $f$ ima v točki $T_0 = (x_0, y_0)$ **lokalni minimum**, če je $f(x, y) \ge f(x_0, y_0)$ za vse točke $(x, y)$ v neki okolici $T_0$. Podobno definiramo **lokalni maksimum** z $\le$. **Globalni** (absolutni) minimum na množici $D$ je najmanjša vrednost $f$ na vsem $D$.

**2. Stacionarne točke.** Če ima odvedljiva funkcija v notranji točki $T_0$ lokalni ekstrem, je tam **gradient enak nič**:

$$\nabla f(x_0, y_0) = \big(f_x(x_0, y_0),\ f_y(x_0, y_0)\big) = (0, 0).$$

Razlog: če $y$ zamrznemo na $y_0$, ima funkcija ene spremenljivke $x \mapsto f(x, y_0)$ ekstrem v $x_0$, zato je njen odvod $f_x(x_0, y_0) = 0$. Enako velja za $y$. Točkam z ničelnim gradientom pravimo **stacionarne** (kritične) točke. Iščemo jih tako, da rešimo sistem

$$f_x(x, y) = 0, \qquad f_y(x, y) = 0.$$

Pogoj je **potreben, ne pa zadosten**: v stacionarni točki je lahko minimum, maksimum ali pa **sedlo**. Primer sedla je $f(x, y) = x^2 - y^2$ v $(0, 0)$: v smeri osi $x$ funkcija narašča, v smeri osi $y$ pada. Graf je videti kot konjsko sedlo ali gorski prelaz.

:::premisli
Ima funkcija $f(x, y) = xy$ v izhodišču ekstrem?
---
Nima, izhodišče je sedlo. Gradient $(y, x)$ je tam res nič, a na premici $y = x$ je $f = x^2 \ge 0$, na premici $y = -x$ pa $f = -x^2 \le 0$, zato $f$ blizu izhodišča zavzame obe predznaki.
:::

**3. Hessejeva matrika.** Drugi parcialni odvodi tvorijo **Hessejevo matriko**

$$H(x, y) = \begin{bmatrix} f_{xx} & f_{xy} \\ f_{yx} & f_{yy} \end{bmatrix}.$$

Za funkcije z zveznimi drugimi odvodi je po Schwarzovem izreku $f_{xy} = f_{yx}$, zato je $H$ simetrična. Njena determinanta je $\det H = f_{xx} f_{yy} - f_{xy}^2$.

**4. Zadostni pogoj (test drugih odvodov).** Naj bo $T_0$ stacionarna točka, $A = f_{xx}(T_0)$, $B = f_{xy}(T_0)$, $C = f_{yy}(T_0)$ in $D = AC - B^2$.

| $D = \det H$ | $A = f_{xx}$ | narava točke |
|---|---|---|
| $D > 0$ | $A > 0$ | lokalni minimum |
| $D > 0$ | $A < 0$ | lokalni maksimum |
| $D < 0$ | poljuben | sedlo (ni ekstrema) |
| $D = 0$ | poljuben | test ne odloči |

Pri $D > 0$ sta $A$ in $C$ istega predznaka, zato lahko namesto $A$ pogledamo tudi $C$. Pri $D = 0$ moramo funkcijo raziskati drugače, na primer s pogledom vrednosti vzdolž premic skozi točko.

Ideja testa: blizu stacionarne točke je funkcija po Taylorjevi formuli približno kvadratna,
$$f(x_0 + h, y_0 + k) \approx f(x_0, y_0) + \tfrac{1}{2}\left(Ah^2 + 2Bhk + Ck^2\right).$$
Če je kvadratna forma za vse $(h, k) \neq (0, 0)$ pozitivna, je v točki minimum; če je negativna, maksimum; če zavzame obe predznaki, sedlo.

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

Metoda velja v točkah, kjer je $\nabla g \neq 0$. Pri več spremenljivkah in več pogojih $g_1 = 0, \dots, g_m = 0$ uvedemo po en multiplikator za vsak pogoj: $\nabla f = \lambda_1 \nabla g_1 + \dots + \lambda_m \nabla g_m$.

**7. Globalni ekstremi na zaprti omejeni množici.** Zvezna funkcija na zaprti in omejeni množici $D$ zavzame največjo in najmanjšo vrednost. Iščemo ju takole: (1) stacionarne točke v notranjosti $D$, (2) vezane ekstreme na robu $D$ (z Lagrangeovo metodo ali parametrizacijo roba), (3) oglišča roba, če obstajajo. Med vsemi dobljenimi vrednostmi izberemo največjo in najmanjšo. Hessejeve matrike tu ne potrebujemo.

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

Izdelati želimo pravokotno škatlo brez pokrova s prostornino $32\,\mathrm{dm^3}$. Kakšne naj bodo mere, da porabimo čim manj materiala?

**Podatki:** prostornina $V = xyz = 32\,\mathrm{dm^3}$, škatla brez pokrova (dno in štiri stranice), dolžina $x$, širina $y$, višina $z$, vse pozitivne
**Iščemo:** mere $x$, $y$, $z$, pri katerih je površina $S$ najmanjša, in to površino

:::formula
$S = xy + 2xz + 2yz$, pogoj $g = xyz - 32 = 0$. Lagrange: $\nabla S = \lambda \nabla g$, $g = 0$.
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
9. Odgovor: škatla naj ima dno $4\,\mathrm{dm} \times 4\,\mathrm{dm}$ in višino $2\,\mathrm{dm}$; porabimo $48\,\mathrm{dm^2}$ materiala.

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
Kaj dobiš?
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

## Drugače: Na sliki

Graf funkcije $z = f(x, y)$ si predstavljaj kot **pokrajino**. Minimum je dno kotanje, maksimum vrh hriba, sedlo pa prelaz med dvema vrhovoma: če hodiš po grebenu od enega vrha do drugega, je prelaz tvoja najnižja točka, če pa greš čez prelaz iz ene doline v drugo, je tvoja najvišja točka. V vseh treh primerih so tla v točki vodoravna, zato je gradient nič.

Na **zemljevidu z nivojnicami** (plastnicami) so okoli minimuma in maksimuma sklenjene krivulje, podobne elipsam. Okoli sedla so nivojnice podobne hiperbolam, nivojnica skozi samo sedlo pa se v njem seka v obliki črke X.

Pri vezanem ekstremu na zemljevid narišemo še pot $g(x, y) = 0$. Hodimo po poti in iščemo najvišjo točko na njej. Ta je tam, kjer se pot nivojnice **le dotakne**: tam je smer poti pravokotna na gradient $\nabla f$, ki kaže navkreber. Ker je tudi $\nabla g$ pravokoten na pot, sta oba gradienta vzporedna. To je slika enačbe $\nabla f = \lambda \nabla g$.

## Drugače: Iz vsakdanjega življenja

**Metoda najmanjših kvadratov.** Skozi meritve $(x_i, y_i)$ iščemo premico $y = kx + n$, ki se jim najbolje prilega. Minimiziramo vsoto kvadratov odstopanj $F(k, n) = \sum_i (y_i - kx_i - n)^2$. Pogoj $F_k = 0$, $F_n = 0$ da dve linearni enačbi (normalni enačbi) za $k$ in $n$. Hessejeva matrika je pozitivno definitna, če niso vsi $x_i$ enaki, zato je rešitev res minimum. Na tem temelji linearna regresija in vsaka umeritvena premica v laboratoriju.

**Kemijsko inženirstvo.** Izkoristek procesa je funkcija temperature, tlaka in razmerja reaktantov. Inženir poišče stacionarno točko izmerjene ali modelirane ploskve odziva; sedlo v takšnem modelu pove, da je treba eno spremenljivko povečati, drugo pa zmanjšati.

**Molekulska geometrija.** Energija molekule je funkcija koordinat jeder. Stabilne strukture so lokalni minimumi te energijske ploskve, prehodno stanje kemijske reakcije pa je **sedlo**: v smeri reakcijske koordinate je maksimum, v vseh drugih smereh minimum.

**Ekonomija in ekologija.** Kmet razdeli omejeno površino med dve kulturi tako, da je pridelek največji. Omejitev površine je pogoj $g = 0$, multiplikator $\lambda$ pa pove, za koliko bi se povečal največji pridelek, če bi imeli na voljo eno enoto površine več.

## Drugače: Korak za korakom s številkami

Določi ekstreme funkcije $f(x, y) = 2x^2 + y^2 - 2xy - 4x + 1$.

1. **Prvi odvodi:** $f_x = 4x - 2y - 4$, $f_y = 2y - 2x$.
2. **Sistem:** iz $f_y = 0$ sledi $y = x$; vstavimo v $f_x = 0$: $4x - 2x - 4 = 0$, $x = 2$, torej $y = 2$.
3. **Stacionarna točka:** $T(2, 2)$.
4. **Drugi odvodi:** $f_{xx} = 4$, $f_{yy} = 2$, $f_{xy} = -2$.
5. **Determinanta:** $D = 4 \cdot 2 - (-2)^2 = 8 - 4 = 4 > 0$, $f_{xx} = 4 > 0$, torej minimum.
6. **Vrednost:** $f(2, 2) = 8 + 4 - 8 - 8 + 1 = -3$.
7. **Preizkus:** $f(3, 2) = 18 + 4 - 12 - 12 + 1 = -1$ in $f(2, 3) = 8 + 9 - 12 - 8 + 1 = -2$ sta večji od $-3$, kot pri minimumu pričakujemo.

## Drugače: Bolj natančno

**Potrebni pogoj.** Naj ima $f$ v notranji točki $a \in D \subseteq \mathbb{R}^n$ lokalni ekstrem in naj bo odvedljiva v $a$. Za vsak vektor $h$ ima funkcija $\varphi(t) = f(a + th)$ lokalni ekstrem v $t = 0$, zato je $\varphi'(0) = \nabla f(a) \cdot h = 0$. Ker to velja za vse $h$, je $\nabla f(a) = 0$.

**Zadostni pogoj.** Naj ima $f$ zvezne druge parcialne odvode v okolici stacionarne točke $a$. Po Taylorjevi formuli je
$$f(a + h) = f(a) + \tfrac{1}{2}\, h^{\mathsf T} H(a)\, h + o(\|h\|^2).$$
Če je $H(a)$ pozitivno definitna, je njena najmanjša lastna vrednost $m > 0$ in $h^{\mathsf T} H h \ge m\|h\|^2$. Za dovolj majhen $\|h\|$ je ostanek po absolutni vrednosti manjši od $\frac{m}{4}\|h\|^2$, zato je $f(a + h) - f(a) \ge \frac{m}{4}\|h\|^2 > 0$ za $h \neq 0$: v $a$ je strogi lokalni minimum. Če ima $H(a)$ lastni vrednosti obeh predznakov, vzdolž ustreznih lastnih vektorjev $f$ enkrat narašča, drugič pada, zato je $a$ sedlo.

Za $n = 2$ je simetrična matrika $\begin{bmatrix} A & B \\ B & C \end{bmatrix}$ pozitivno definitna natanko tedaj, ko je $A > 0$ in $AC - B^2 > 0$. To sledi iz dopolnitve do kvadrata: $Ah^2 + 2Bhk + Ck^2 = A\left(h + \frac{B}{A}k\right)^2 + \frac{AC - B^2}{A}k^2$.

**Lagrangeov izrek.** Naj bosta $f$ in $g$ zvezno odvedljivi, $a$ naj bo lokalni ekstrem $f$ na množici $\{g = 0\}$ in naj bo $\nabla g(a) \neq 0$. Tedaj obstaja $\lambda \in \mathbb{R}$, da je $\nabla f(a) = \lambda\, \nabla g(a)$. Dokaz uporabi izrek o implicitni funkciji: blizu $a$ je množica $\{g = 0\}$ graf gladke funkcije, zato je $\nabla f(a)$ pravokoten na vsak tangentni vektor, tangentni prostor pa je ravno ortogonalni komplement $\nabla g(a)$. Pogoj $\nabla g(a) \neq 0$ je bistven: pri $f = x$ in $g = y^2 - x^3$ je minimum v $(0, 0)$, kjer je $\nabla g = 0$, Lagrangeov sistem pa te točke ne najde.

**Narava vezanega ekstrema.** Odloči jo **obrobljena Hessejeva matrika** oziroma predznak forme $h^{\mathsf T} H_L h$ (kjer je $H_L$ Hessejeva matrika Lagrangeove funkcije po $x$ in $y$), omejene na tangentne vektorje $h$, za katere je $\nabla g \cdot h = 0$.

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
D | determinanta Hessejeve matrike | D = f_{xx} f_{yy} - f_{xy}^2 | | D > 0 in A > 0: minimum; D < 0: sedlo
L | Lagrangeova funkcija | L(x, y, \lambda) = f(x, y) - \lambda\, g(x, y) |
\lambda | Lagrangeov multiplikator | |
g | funkcija vezi | | | pogoj g(x, y) = 0
g_x, g_y | parcialna odvoda funkcije vezi | |
a | notranja točka lokalnega ekstrema v ℝⁿ | |
o | mali o (Landauova oznaka) | | | o(‖h‖²) gre proti nič hitreje kot ‖h‖²
S | površina škatle brez pokrova | S = xy + 2xz + 2yz |
N | odstopanje posnetka od želenega zvoka | | | v primeru 4; x, y sta ojačanji v dB
:::
