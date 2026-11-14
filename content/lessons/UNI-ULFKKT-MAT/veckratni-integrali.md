---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Z določenim integralom $\int_a^b f(x)\,dx$ smo seštevali količine, porazdeljene vzdolž daljice: ploščino pod krivuljo, pot iz hitrosti, delo spremenljive sile. Veliko količin pa je porazdeljenih po **ploskvi** ali po **prostoru**: masa kovinske plošče s spremenljivo debelino, naboj v oblaku, množina snovi v reaktorju, kjer koncentracija ni povsod enaka, prostornina rezervoarja z ukrivljenim dnom. Za take vsote potrebujemo **dvojni** in **trojni integral**.

Glavna ideja je preprosta: večkratni integral izračunamo kot **zaporedje navadnih integralov**, najprej po eni spremenljivki, nato po drugi. Pri okroglih območjih (disk, valj, krogla) je računanje mnogo lažje v **polarnih**, **cilindričnih** ali **sfernih koordinatah**. Pri zamenjavi koordinat se ploščinski oziroma prostorninski element spremeni za faktor, ki ga da **Jacobijeva determinanta**.

Potrebuješ določeni integral, metode integriranja, parcialne odvode in determinante.

## Razlaga

**1. Dvojni integral na pravokotniku.** Naj bo $f$ zvezna funkcija na pravokotniku $P = [a, b] \times [c, d]$. Pravokotnik razdelimo na majhne pravokotnike s ploščinami $\Delta A_{ij}$, v vsakem izberemo točko $(x_i^*, y_j^*)$ in sestavimo **Riemannovo vsoto** $\sum_{i,j} f(x_i^*, y_j^*)\, \Delta A_{ij}$. Če imajo te vsote, ko gre največji premer delilnih pravokotnikov proti nič, limito, ki je neodvisna od izbire delitve in točk, je $f$ na $P$ **integrabilna**, limita pa je **dvojni integral**

$$\iint_P f(x, y)\, dA.$$

Vsaka zvezna funkcija na $P$ je integrabilna. Če je $f \ge 0$, je to prostornina telesa pod grafom $z = f(x, y)$ nad $P$. Če je $f$ gostota (na primer v $\mathrm{kg/m^2}$), je integral masa.

**Lastnosti.** Integral je linearen, aditiven glede na območje ($\iint_{D_1 \cup D_2} = \iint_{D_1} + \iint_{D_2}$, če se $D_1$ in $D_2$ prekrivata le v množici ploščine $0$) in monoton (iz $f \le g$ sledi $\iint_D f\, dA \le \iint_D g\, dA$). **Izrek o povprečni vrednosti:** naj bo $D$ zaprto, omejeno in povezano območje in $f$ zvezna na $D$. Potem obstaja točka $(\xi, \eta) \in D$, da je $\iint_D f\, dA = f(\xi, \eta)\, S(D)$, kjer je $S(D) = \iint_D 1\, dA$ ploščina $D$. *Dokaz:* z $m \le f \le M$ (najmanjša in največja vrednost na $D$) da monotonost $m\, S(D) \le \iint_D f\, dA \le M\, S(D)$; število $\frac{1}{S(D)}\iint_D f\, dA$ leži med $m$ in $M$, zato ga zvezna $f$ na povezanem $D$ zavzame. $\square$

**2. Fubinijev izrek.** Naj bo $f$ zvezna na pravokotniku $P = [a, b] \times [c, d]$. Potem lahko dvojni integral izračunamo kot **dvakratni** integral, v poljubnem vrstnem redu:

$$\iint_P f\, dA = \int_a^b \left(\int_c^d f(x, y)\, dy\right) dx = \int_c^d \left(\int_a^b f(x, y)\, dx\right) dy.$$

Pri notranjem integralu je druga spremenljivka **konstanta**. Če je $f(x, y) = g(x)h(y)$, integral razpade na produkt $\int_a^b g\, dx \cdot \int_c^d h\, dy$.

**3. Splošna območja.** Območje je **tipa I** (navpično preprosto), če ga lahko zapišemo kot
$$D = \{(x, y) : a \le x \le b,\ \varphi_1(x) \le y \le \varphi_2(x)\},$$
kjer sta $\varphi_1 \le \varphi_2$ zvezni na $[a, b]$. Za zvezno $f$ na $D$ je tedaj
$$\iint_D f\, dA = \int_a^b \int_{\varphi_1(x)}^{\varphi_2(x)} f(x, y)\, dy\, dx.$$
Meje notranjega integrala so funkcije zunanje spremenljivke, meje zunanjega integrala pa so vedno **konstante**. Območje **tipa II** je $\{c \le y \le d,\ \psi_1(y) \le x \le \psi_2(y)\}$ in pri njem najprej integriramo po $x$.

**Zamenjava vrstnega reda.** Isto območje lahko pogosto zapišemo na oba načina. Postopek: (1) nariši območje, (2) odčitaj najmanjšo in največjo vrednost nove zunanje spremenljivke, (3) za fiksno vrednost zunanje spremenljivke odčitaj, od katere do katere krivulje sega notranja. Zamenjava je koristna, kadar notranji integral v enem vrstnem redu ni elementaren (na primer $\int e^{x^2}\, dx$), v drugem pa je.

**Uporabe dvojnega integrala:** ploščina $S(D) = \iint_D 1\, dA$, masa plošče $m = \iint_D \sigma(x, y)\, dA$, povprečna vrednost $\bar f = \frac{1}{S(D)}\iint_D f\, dA$, težišče $x_T = \frac{1}{m}\iint_D x\,\sigma\, dA$, $y_T = \frac{1}{m}\iint_D y\,\sigma\, dA$.

**4. Trojni integral.** Analogno definiramo za funkcijo treh spremenljivk na telesu $T \subset \mathbb{R}^3$:
$$\iiint_T f(x, y, z)\, dV.$$
Če je telo podano z $(x, y) \in D$ in $g_1(x, y) \le z \le g_2(x, y)$, je
$$\iiint_T f\, dV = \iint_D \left(\int_{g_1(x,y)}^{g_2(x,y)} f\, dz\right) dA.$$
Prostornina telesa je $V = \iiint_T 1\, dV$, masa $m = \iiint_T \rho\, dV$, množina snovi pri koncentraciji $c(x, y, z)$ pa $n = \iiint_T c\, dV$.

**5. Zamenjava spremenljivk in Jacobijeva determinanta.** Naj preslikava $x = x(u, v)$, $y = y(u, v)$ zvezno odvedljivo preslika območje $D'$ v ravnini $(u, v)$ na $D$ in naj bo $f$ zvezna na $D$. **Jacobijeva determinanta** preslikave je

$$J = \frac{\partial(x, y)}{\partial(u, v)} = \begin{vmatrix} \dfrac{\partial x}{\partial u} & \dfrac{\partial x}{\partial v} \\[2mm] \dfrac{\partial y}{\partial u} & \dfrac{\partial y}{\partial v} \end{vmatrix}.$$

Če je preslikava bijektivna in $J \neq 0$ (oboje razen morda na množici ploščine $0$), velja

$$\iint_D f(x, y)\, dx\, dy = \iint_{D'} f\big(x(u, v), y(u, v)\big)\, |J|\, du\, dv.$$

Absolutna vrednost $|J|$ pove, kolikokrat preslikava poveča ploščino majhnega pravokotnika $du \times dv$. V treh razsežnostih je $J$ determinanta $3 \times 3$ in $dV = |J|\, du\, dv\, dw$.

**6. Polarne koordinate.** $x = r\cos\varphi$, $y = r\sin\varphi$, $r \ge 0$, $\varphi \in [0, 2\pi)$. Jacobijeva determinanta:
$$J = \begin{vmatrix} \cos\varphi & -r\sin\varphi \\ \sin\varphi & r\cos\varphi \end{vmatrix} = r\cos^2\varphi + r\sin^2\varphi = r,$$
torej $dA = r\, dr\, d\varphi$. Polarne koordinate uporabimo, kadar je območje disk, kolobar ali krožni izsek, ali kadar integrand vsebuje $x^2 + y^2 = r^2$.

**7. Cilindrične koordinate.** $x = r\cos\varphi$, $y = r\sin\varphi$, $z = z$; $dV = r\, dr\, d\varphi\, dz$. Primerne so za valje, stožce in rotacijske ploskve okoli osi $z$. Primer: prostornina telesa pod paraboloidom $z = 4 - x^2 - y^2$ nad ravnino $z = 0$. Paraboloid seka ravnino pri $r = 2$, zato
$$V = \int_0^{2\pi}\int_0^2 (4 - r^2)\, r\, dr\, d\varphi = 2\pi \left[2r^2 - \tfrac{r^4}{4}\right]_0^2 = 2\pi(8 - 4) = 8\pi \approx 25{,}1.$$

**8. Sferne koordinate.** $x = r\sin\vartheta\cos\varphi$, $y = r\sin\vartheta\sin\varphi$, $z = r\cos\vartheta$, kjer je $r \ge 0$ oddaljenost od izhodišča, $\vartheta \in [0, \pi]$ kot od pozitivne osi $z$ in $\varphi \in [0, 2\pi)$ kot v ravnini $xy$. Jacobijeva determinanta je $r^2 \sin\vartheta$:
$$J = \begin{vmatrix} \sin\vartheta\cos\varphi & r\cos\vartheta\cos\varphi & -r\sin\vartheta\sin\varphi \\ \sin\vartheta\sin\varphi & r\cos\vartheta\sin\varphi & r\sin\vartheta\cos\varphi \\ \cos\vartheta & -r\sin\vartheta & 0 \end{vmatrix}.$$
*Izpeljava:* razvoj po tretji vrstici da $\cos\vartheta \cdot r^2\sin\vartheta\cos\vartheta(\cos^2\varphi + \sin^2\varphi) + r\sin\vartheta \cdot r\sin^2\vartheta(\cos^2\varphi + \sin^2\varphi) = r^2\sin\vartheta(\cos^2\vartheta + \sin^2\vartheta) = r^2\sin\vartheta$. Ker je $\vartheta \in [0, \pi]$, je $J \ge 0$ in
$$dV = r^2 \sin\vartheta\, dr\, d\vartheta\, d\varphi.$$
Primerne so za krogle, krogelne lupine in funkcije, ki so odvisne le od $r$. Za prostornino krogle polmera $R$ dobimo $\int_0^{2\pi}\int_0^\pi\int_0^R r^2\sin\vartheta\, dr\, d\vartheta\, d\varphi = 2\pi \cdot 2 \cdot \frac{R^3}{3} = \frac{4}{3}\pi R^3$. Če je integrand odvisen le od $r$, integracija po kotih da $4\pi$ in $dV$ nadomestimo z $4\pi r^2\, dr$ (prostornina tanke krogelne lupine).

Opomba: v nekaterih učbenikih je $\vartheta$ kot od ravnine $xy$ (geografska širina); tedaj je $z = r\sin\vartheta$ in $dV = r^2\cos\vartheta\, dr\, d\vartheta\, d\varphi$. Vedno preveri, kateri dogovor velja.

## Rešeni primeri

### Primer 1 (lažji)

Izračunaj $\displaystyle \iint_P (x + 2y)\, dA$, kjer je $P = [0, 2] \times [0, 1]$.

**Podatki:** integrand $f(x, y) = x + 2y$, pravokotnik $0 \le x \le 2$, $0 \le y \le 1$
**Iščemo:** vrednost dvojnega integrala

:::formula
Fubini: $\iint_P f\, dA = \int_a^b \left(\int_c^d f(x, y)\, dy\right) dx$
:::

**Rešitev:**

1. Notranji integral po $y$ (pri tem je $x$ konstanta): $\int_0^1 (x + 2y)\, dy = \left[xy + y^2\right]_0^1 = x + 1$.
2. Zunanji integral po $x$: $\int_0^2 (x + 1)\, dx = \left[\frac{x^2}{2} + x\right]_0^2 = 2 + 2 = 4$.
3. Preizkus v drugem vrstnem redu: $\int_0^2 (x + 2y)\, dx = 2 + 4y$, nato $\int_0^1 (2 + 4y)\, dy = 2 + 2 = 4$.
4. Preizkus s povprečjem: ploščina $P$ je $2$, povprečna vrednost $x + 2y$ v središču $(1;\ 0{,}5)$ je $2$ (za linearno funkcijo je povprečje enako vrednosti v središču), $2 \cdot 2 = 4$.
5. Odgovor: $\iint_P (x + 2y)\, dA = 4$.

### Primer 2

Izračunaj $\displaystyle \iint_D xy\, dA$, kjer je $D$ območje med premico $y = x$ in parabolo $y = x^2$. Rezultat preveri z obrnjenim vrstnim redom integriranja.

**Podatki:** integrand $f(x, y) = xy$; meji območja $y = x$ in $y = x^2$
**Iščemo:** vrednost dvojnega integrala

:::formula
Tip I: $\iint_D f\, dA = \int_a^b \int_{\varphi_1(x)}^{\varphi_2(x)} f\, dy\, dx$; tip II: $\int_c^d \int_{\psi_1(y)}^{\psi_2(y)} f\, dx\, dy$
:::

**Rešitev:**

1. Presečišča: $x = x^2$ da $x = 0$ in $x = 1$. Za $0 < x < 1$ je $x^2 < x$, zato parabola leži pod premico: $D = \{0 \le x \le 1,\ x^2 \le y \le x\}$.
2. Notranji integral: $\int_{x^2}^{x} xy\, dy = x \cdot \left[\frac{y^2}{2}\right]_{x^2}^{x} = \frac{x}{2}(x^2 - x^4) = \frac{x^3 - x^5}{2}$.
3. Zunanji integral: $\int_0^1 \frac{x^3 - x^5}{2}\, dx = \frac{1}{2}\left(\frac{1}{4} - \frac{1}{6}\right) = \frac{1}{2} \cdot \frac{1}{12} = \frac{1}{24}$.
4. Obrnjen vrstni red: za $0 \le y \le 1$ sega $x$ od premice $x = y$ do parabole $x = \sqrt{y}$, torej $D = \{0 \le y \le 1,\ y \le x \le \sqrt y\}$.
5. $\int_y^{\sqrt y} xy\, dx = y\left[\frac{x^2}{2}\right]_y^{\sqrt y} = \frac{y}{2}(y - y^2)$ in $\int_0^1 \frac{y^2 - y^3}{2}\, dy = \frac{1}{2}\left(\frac{1}{3} - \frac{1}{4}\right) = \frac{1}{24}$.
6. Odgovor: $\iint_D xy\, dA = \frac{1}{24} \approx 0{,}0417$; oba vrstna reda dasta isti rezultat.

### Primer 3 (težji)

Krogla s polmerom $R = 0{,}10\,\mathrm{m}$ ima gostoto, ki od središča navzven linearno pada: $\rho(r) = \rho_0\left(1 - \frac{r}{R}\right)$, kjer je $\rho_0 = 3000\,\mathrm{kg/m^3}$. Izračunaj maso krogle in njeno povprečno gostoto. Kroglo nato prerežemo z ravnino skozi središče ($z = 0$). Kje leži težišče zgornje polkrogle?

**Podatki:** $R = 0{,}10\,\mathrm{m}$, $\rho(r) = \rho_0\left(1 - \frac{r}{R}\right)$, $\rho_0 = 3000\,\mathrm{kg/m^3}$, polkrogla $z \ge 0$
**Iščemo:** maso $m$, povprečno gostoto $\bar\rho$ in koordinato težišča $z_T$ polkrogle

:::formula
$m = \iiint_T \rho\, dV$, sferne koordinate $dV = r^2\sin\vartheta\, dr\, d\vartheta\, d\varphi$; $\bar\rho = \frac{m}{V}$, $V = \frac{4}{3}\pi R^3$; $z_T = \frac{1}{m_{1/2}}\iiint_{T_{1/2}} z\,\rho\, dV$
:::

**Rešitev:**

1. Gostota je odvisna le od $r$, zato uporabimo sferne koordinate z mejami $0 \le r \le R$, $0 \le \vartheta \le \pi$, $0 \le \varphi \le 2\pi$.
2. $m = \int_0^{2\pi}\int_0^{\pi}\int_0^R \rho_0\left(1 - \frac{r}{R}\right) r^2 \sin\vartheta\, dr\, d\vartheta\, d\varphi$.
3. Kotna integrala: $\int_0^{2\pi} d\varphi = 2\pi$, $\int_0^\pi \sin\vartheta\, d\vartheta = \left[-\cos\vartheta\right]_0^\pi = 2$; skupaj $4\pi$.
4. Radialni integral: $\int_0^R \left(r^2 - \frac{r^3}{R}\right) dr = \frac{R^3}{3} - \frac{R^3}{4} = \frac{R^3}{12}$.
5. $m = 4\pi\rho_0 \cdot \frac{R^3}{12} = \frac{\pi\rho_0 R^3}{3}$.
6. Številke: $m = \frac{\pi \cdot 3000\,\mathrm{kg/m^3} \cdot (0{,}10\,\mathrm{m})^3}{3} = \pi \cdot 1{,}0\,\mathrm{kg} = 3{,}14\,\mathrm{kg}$.
7. Prostornina $V = \frac{4}{3}\pi (0{,}10\,\mathrm{m})^3 = 4{,}19 \cdot 10^{-3}\,\mathrm{m^3}$, povprečna gostota $\bar\rho = \frac{m}{V} = \frac{\pi\rho_0 R^3/3}{4\pi R^3/3} = \frac{\rho_0}{4} = 750\,\mathrm{kg/m^3}$.
8. Preizkus smisla: povprečna gostota je med $0$ (na površju) in $\rho_0$ (v središču), bližje $0$, ker je večina prostornine krogle blizu površja.
9. Polkrogla: $\vartheta$ teče le od $0$ do $\frac{\pi}{2}$, $\int_0^{\pi/2}\sin\vartheta\, d\vartheta = 1$, zato je $m_{1/2} = \frac{m}{2} = \frac{\pi\rho_0 R^3}{6} = 1{,}57\,\mathrm{kg}$. Zaradi simetrije okoli osi $z$ je $x_T = y_T = 0$.
10. Statični moment: $z = r\cos\vartheta$, torej $\iiint z\rho\, dV = \rho_0\int_0^{2\pi} d\varphi \int_0^{\pi/2}\cos\vartheta\sin\vartheta\, d\vartheta \int_0^R \left(r^3 - \frac{r^4}{R}\right) dr = \rho_0 \cdot 2\pi \cdot \frac{1}{2} \cdot \frac{R^4}{20} = \frac{\pi\rho_0 R^4}{20}$, ker je $\frac{R^4}{4} - \frac{R^4}{5} = \frac{R^4}{20}$.
11. $z_T = \frac{\pi\rho_0 R^4/20}{\pi\rho_0 R^3/6} = \frac{6R}{20} = 0{,}3R = 0{,}030\,\mathrm{m}$.
12. Preizkus smisla: homogena polkrogla ima težišče pri $\frac{3R}{8} = 0{,}375R$; naša je gostejša pri središču, zato je težišče nižje.
13. Odgovor: masa krogle je $3{,}14\,\mathrm{kg}$, povprečna gostota $750\,\mathrm{kg/m^3}$; težišče zgornje polkrogle (masa $1{,}57\,\mathrm{kg}$) leži na osi $z$, $3{,}0\,\mathrm{cm}$ nad središčem.

## Pogoste napake

- **Pozabljena Jacobijeva determinanta.** V polarnih koordinatah je $dA = r\, dr\, d\varphi$, ne $dr\, d\varphi$. Brez faktorja $r$ dobimo za ploščino kroga s polmerom $R$ napačno vrednost $2\pi R$ namesto $\pi R^2$.
- **Spremenljivke v mejah zunanjega integrala.** Meje zunanjega integrala morajo biti konstante. Če je rezultat dvojnega integrala po celem računu še odvisen od $x$ ali $y$, je meja napačno postavljena.
- **Napačne meje pri zamenjavi vrstnega reda.** Študent le zamenja $dx$ in $dy$, meje pa pusti. Območje je treba vedno narisati in meje odčitati na novo.
- **Napačna lega krivulj.** V Primeru 2 je na $(0, 1)$ parabola pod premico; z obrnjenima mejama dobimo $-\frac{1}{24}$. Pri ploščini ali masi negativen rezultat pomeni napako.
- **Mešanje dogovorov za sferne koordinate.** Če je $\vartheta$ kot od osi $z$, je element $r^2\sin\vartheta$ in $\vartheta \in [0, \pi]$. Z mejo $\vartheta \in [0, 2\pi]$ bi vsako točko zajeli dvakrat, a ker je $\sin\vartheta$ na $[\pi, 2\pi]$ negativen, se prispevka odštejeta: prostornina krogle bi prišla $0$.
- **Jacobijeva determinanta brez absolutne vrednosti.** Pri preslikavah, ki obrnejo orientacijo, je $J < 0$; v integral vstavimo $|J|$.

## Povzetek

- Dvojni integral $\iint_D f\, dA$: limita Riemannovih vsot; prostornina pod grafom, masa, povprečje, težišče.
- Fubini: računamo dvakratni integral; notranja spremenljivka ima meje, odvisne od zunanje, zunanja pa konstantne meje.
- Trojni integral $\iiint_T f\, dV$: prostornina, masa, množina snovi.
- Zamenjava spremenljivk: $dx\, dy = |J|\, du\, dv$, $J = \frac{\partial(x, y)}{\partial(u, v)}$.
- Polarne: $dA = r\, dr\, d\varphi$; cilindrične: $dV = r\, dr\, d\varphi\, dz$; sferne: $dV = r^2\sin\vartheta\, dr\, d\vartheta\, d\varphi$.

## Za izpit

Znati moraš povedati:

- definicijo dvojnega integrala z Riemannovimi vsotami in kdaj je funkcija integrabilna (zvezna na $P$ vedno je),
- Fubinijev izrek s pogoji, za pravokotnik in za območji tipa I in II,
- izrek o povprečni vrednosti s pogoji in dokazom,
- izrek o zamenjavi spremenljivk (bijektivna, zvezno odvedljiva preslikava, $J \neq 0$) in zakaj nastopa $|J|$,
- izpeljavo Jacobijeve determinante za polarne ($r$) in sferne ($r^2\sin\vartheta$) koordinate.

### Naloga 1

a) Izračunaj $\displaystyle \int_0^1 \int_y^1 e^{x^2}\, dx\, dy$.
b) Izračunaj prostornino telesa, ki ga omejujeta paraboloid $z = x^2 + y^2$ in ravnina $z = 2y$.

**Rešitev:**

1. a) Notranjega integrala $\int e^{x^2}\, dx$ ne znamo izraziti z elementarnimi funkcijami, zato zamenjamo vrstni red. Območje je $\{0 \le y \le 1,\ y \le x \le 1\}$, to je trikotnik z oglišči $(0, 0)$, $(1, 0)$, $(1, 1)$; zapisan kot tip I: $\{0 \le x \le 1,\ 0 \le y \le x\}$.
2. $\int_0^1 \int_0^x e^{x^2}\, dy\, dx = \int_0^1 x e^{x^2}\, dx = \left[\frac{e^{x^2}}{2}\right]_0^1 = \frac{e - 1}{2} \approx 0{,}859$.
3. b) Presek ploskev: $x^2 + y^2 = 2y$, torej $x^2 + (y - 1)^2 = 1$. Projekcija telesa na ravnino $xy$ je krog $D$ s središčem $(0, 1)$ in polmerom $1$; v njem je $2y \ge x^2 + y^2$, ravnina je zgoraj.
4. $V = \iint_D \left(2y - x^2 - y^2\right) dA = \iint_D \left(1 - x^2 - (y - 1)^2\right) dA$.
5. Zamenjava $x = r\cos\varphi$, $y = 1 + r\sin\varphi$ (premik in polarne koordinate), $|J| = r$, meje $0 \le r \le 1$, $0 \le \varphi \le 2\pi$; integrand postane $1 - r^2$.
6. $V = \int_0^{2\pi}\int_0^1 (1 - r^2)\, r\, dr\, d\varphi = 2\pi\left(\frac{1}{2} - \frac{1}{4}\right) = \frac{\pi}{2} \approx 1{,}571$.
7. Odgovor: a) $\frac{e - 1}{2} \approx 0{,}859$; b) $V = \frac{\pi}{2} \approx 1{,}571$ (prostorninskih enot).

### Naloga 2

Natančno navedi izrek o zamenjavi spremenljivk v dvojnem integralu in izpelji ploščinski element v polarnih koordinatah. Nato utemelji, ali je $\displaystyle \iint_K \left(x^3 y^2 + \sin x\right) dA = 0$, kjer je $K$ krog $x^2 + y^2 \le 1$.

**Rešitev:**

1. Izrek: naj $\Phi\colon (u, v) \mapsto \big(x(u, v), y(u, v)\big)$ zvezno odvedljivo preslika $D'$ na $D$ in naj bo bijektivna ter $J = \frac{\partial(x, y)}{\partial(u, v)} \neq 0$ (oboje razen morda na množici ploščine $0$); $f$ naj bo zvezna na $D$. Potem je $\iint_D f\, dx\, dy = \iint_{D'} f\big(x(u, v), y(u, v)\big)\, |J|\, du\, dv$.
2. Polarne koordinate: $\frac{\partial x}{\partial r} = \cos\varphi$, $\frac{\partial x}{\partial \varphi} = -r\sin\varphi$, $\frac{\partial y}{\partial r} = \sin\varphi$, $\frac{\partial y}{\partial \varphi} = r\cos\varphi$; $J = r\cos^2\varphi + r\sin^2\varphi = r \ge 0$, zato $dA = r\, dr\, d\varphi$. Pri $r = 0$ preslikava ni bijektivna in $J = 0$, a to je ena točka, ploščine $0$.
3. Simetrija: zamenjava $x = -u$, $y = v$ preslika $K$ samo nase in ima $J = \begin{vmatrix} -1 & 0 \\ 0 & 1 \end{vmatrix} = -1$, torej $|J| = 1$.
4. Za $f(x, y) = x^3y^2 + \sin x$ velja $f(-u, v) = -u^3v^2 - \sin u = -f(u, v)$ (funkcija je liha v $x$).
5. Po izreku je $I = \iint_K f(-u, v)\, du\, dv = -I$, zato $2I = 0$.
6. Odgovor: da, integral je enak $0$, ker je območje simetrično glede na os $y$, integrand pa lih v $x$.

## Drugače: Na sliki

**Stolpci nad ploščicami.** Območje $D$ v ravnini $xy$ si predstavljaj kot tla, prekrita z drobnimi ploščicami. Nad vsako ploščico postavimo stolpec z višino $f(x, y)$. Vsota prostornin vseh stolpcev je približek dvojnega integrala, pri vedno drobnejših ploščicah pa točna prostornina telesa pod grafom.

**Rezine.** Fubinijev izrek je slika rezanja kruha. Pri fiksnem $x$ notranji integral $\int f(x, y)\, dy$ da ploščino rezine telesa (prečni prerez). Zunanji integral nato sešteje ploščine vseh rezin: $V = \int_a^b S(x)\, dx$. Če režemo v drugi smeri, dobimo isto prostornino.

**Polarna mreža.** V polarnih koordinatah ploščice niso pravokotniki, ampak deli kolobarjev: široki $dr$ in dolgi $r\, d\varphi$ (lok pri polmeru $r$). Ploščina take ploščice je $r\, dr\, d\varphi$; daleč od središča so ploščice pri istem $d\varphi$ večje. To je pomen faktorja $r$.

**Sferna celica.** Pri sfernih koordinatah je celica približno kvader z robovi $dr$, $r\, d\vartheta$ (lok po poldnevniku) in $r\sin\vartheta\, d\varphi$ (lok po vzporedniku, katerega polmer je $r\sin\vartheta$). Produkt da $r^2\sin\vartheta\, dr\, d\vartheta\, d\varphi$.

## Drugače: Uporaba v stroki

**Množina snovi v reaktorju.** V valjastem reaktorju s polmerom $R$ in višino $h$ je koncentracija na sredini večja kot ob steni, na primer $c(r) = c_0\left(1 - \frac{r^2}{2R^2}\right)$. Množina snovi je $n = \int_0^h\int_0^{2\pi}\int_0^R c(r)\, r\, dr\, d\varphi\, dz = 2\pi h c_0\left(\frac{R^2}{2} - \frac{R^2}{8}\right) = \frac{3}{4}\pi R^2 h c_0$, torej $\frac{3}{4}$ vrednosti, ki bi jo dala konstantna koncentracija $c_0$.

**Pretok v cevi.** Pri laminarnem toku je hitrost v cevi parabolična, $v(r) = v_{\max}\left(1 - \frac{r^2}{R^2}\right)$. Prostorninski pretok je $\Phi_V = \int_0^{2\pi}\int_0^R v(r)\, r\, dr\, d\varphi = \frac{\pi R^2 v_{\max}}{2}$: povprečna hitrost je polovica največje. Iz izmerjenega pretoka v cevovodu tako izračunamo največjo hitrost in strižno obremenitev ob steni.

**Katalizatorska zrna.** V poroznem kroglastem zrnu katalizatorja reaktant difundira od površja navznoter in se sproti porablja, zato je koncentracija v notranjosti manjša. Povprečno hitrost reakcije v zrnu dobimo kot trojni integral v sfernih koordinatah, $\frac{1}{V}\int_0^R r_A(c(r))\, 4\pi r^2\, dr$, kjer je $r_A$ hitrost reakcije na enoto prostornine (ne polmer); njeno razmerje s hitrostjo pri površinski koncentraciji je faktor izkoristka zrna, s katerim inženir izbere velikost zrn.

**Mešala in vrtenje.** Vztrajnostni moment mešala okoli osi $z$ je $\iiint_T (x^2 + y^2)\rho\, dV$; od njega je odvisen zagonski navor motorja.

## Drugače: Korak za korakom s številkami

Izračunaj $\displaystyle \iint_D e^{-(x^2 + y^2)}\, dA$, kjer je $D$ krog $x^2 + y^2 \le 4$.

1. **Izbira koordinat:** območje je krog, integrand je odvisen le od $x^2 + y^2 = r^2$, zato polarne koordinate.
2. **Meje:** $0 \le r \le 2$, $0 \le \varphi \le 2\pi$.
3. **Integral:** $\int_0^{2\pi}\int_0^2 e^{-r^2}\, r\, dr\, d\varphi$. Faktor $r$ iz Jacobijeve determinante je ravno tisti, ki omogoči integracijo.
4. **Substitucija** $t = r^2$, $dt = 2r\, dr$: $\int_0^2 e^{-r^2} r\, dr = \frac{1}{2}\int_0^4 e^{-t}\, dt = \frac{1}{2}(1 - e^{-4})$.
5. **Kotni del:** $\int_0^{2\pi} d\varphi = 2\pi$.
6. **Rezultat:** $2\pi \cdot \frac{1}{2}(1 - e^{-4}) = \pi(1 - e^{-4}) = \pi \cdot 0{,}98168 = 3{,}084$.
7. **Preizkus smisla:** integrand je največ $1$, ploščina kroga je $4\pi \approx 12{,}6$; ker integrand hitro pada, je rezultat precej manjši od tega in blizu limite $\pi$ za celo ravnino.

V kartezičnih koordinatah tega integrala ne bi znali izračunati, saj $\int e^{-x^2}\, dx$ ni elementarna funkcija.

## Drugače: Bolj natančno

**Definicija in obstoj.** Naj bo $f$ omejena na pravokotniku $P$. Za delitev $\mathcal D$ na pravokotnike $P_{ij}$ definiramo spodnjo in zgornjo Darbouxjevo vsoto $s(\mathcal D) = \sum m_{ij}\, |P_{ij}|$ in $S(\mathcal D) = \sum M_{ij}\, |P_{ij}|$, kjer sta $m_{ij}$ in $M_{ij}$ infimum in supremum $f$ na $P_{ij}$. Funkcija je integrabilna, če je $\sup_{\mathcal D} s = \inf_{\mathcal D} S$. Vsaka zvezna funkcija na $P$ je integrabilna, saj je na kompaktni množici enakomerno zvezna: za vsak $\varepsilon > 0$ obstaja $\delta > 0$, da je pri delitvi s premeri pod $\delta$ razlika $M_{ij} - m_{ij} < \varepsilon$ in zato $S - s < \varepsilon\, |P|$. Na splošnem omejenem območju $D$ integral definiramo tako, da $f$ izven $D$ nadaljujemo z $0$; to je dobro definirano, če ima rob $D$ ploščino $0$ (na primer, če je sestavljen iz grafov zveznih funkcij).

**Fubinijev izrek.** Če je $f$ zvezna na $P = [a, b] \times [c, d]$, je funkcija $F(x) = \int_c^d f(x, y)\, dy$ zvezna in $\iint_P f\, dA = \int_a^b F(x)\, dx$. Za nezvezne funkcije zahtevamo absolutno integrabilnost; brez nje sta lahko dvakratna integrala v različnih vrstnih redih različna.

**Formula za zamenjavo spremenljivk.** Naj bo $\Phi\colon D' \to D$ difeomorfizem (bijektiven, zvezno odvedljiv, z zvezno odvedljivim inverzom). Linearna preslikava z matriko $A$ preslika pravokotnik ploščine $|Q|$ v paralelogram ploščine $|\det A|\,|Q|$. Ker je $\Phi$ lokalno približno linearna, $\Phi(u + h) \approx \Phi(u) + D\Phi(u)\,h$, se ploščina majhnega pravokotnika okoli $u$ pomnoži s približno $|\det D\Phi(u)| = |J(u)|$. Seštevanje po delitvi in limitni prehod dasta formulo $\iint_D f = \iint_{D'} (f \circ \Phi)\, |J|$. Polarne koordinate niso bijektivne pri $r = 0$, a je ta množica ploščine nič in na integral ne vpliva.

**Gaussov integral.** Na celi ravnini dobimo z izračunom iz razdelka Korak za korakom (polmer $R$ namesto $2$) v limiti $R \to \infty$ vrednost $\iint_{\mathbb R^2} e^{-(x^2 + y^2)}\, dA = \pi$. Po Fubiniju je to $\left(\int_{-\infty}^\infty e^{-x^2}\, dx\right)^2$, zato
$$\int_{-\infty}^{\infty} e^{-x^2}\, dx = \sqrt{\pi}.$$
Iz tega sledi normirna konstanta $\frac{1}{\sigma\sqrt{2\pi}}$ normalne porazdelitve.

## Preveri se

? Koliko je $\displaystyle \int_0^1 \int_0^2 xy\, dy\, dx$?
+ $1$
- $2$
- $\frac{1}{2}$
- $4$
> Integrand je produkt, zato $\int_0^1 x\, dx \cdot \int_0^2 y\, dy = \frac{1}{2} \cdot 2 = 1$.

? Kakšen je ploščinski element v polarnih koordinatah?
- $dr\, d\varphi$
+ $r\, dr\, d\varphi$
- $r^2\, dr\, d\varphi$
- $r\sin\varphi\, dr\, d\varphi$
> Jacobijeva determinanta polarnih koordinat je $\cos\varphi \cdot r\cos\varphi - (-r\sin\varphi)\sin\varphi = r$.

? Koliko je $\displaystyle \iint_D 1\, dA$, kjer je $D$ krog $x^2 + y^2 \le 9$, izračunan v polarnih koordinatah?
- $3\pi$
- $6\pi$
+ $9\pi$
- $18\pi$
> $\int_0^{2\pi}\int_0^3 r\, dr\, d\varphi = 2\pi \cdot \frac{9}{2} = 9\pi$, kar je ploščina kroga s polmerom $3$. Rezultat $6\pi$ dobimo, če pozabimo na faktor $r$.

? Kakšen je prostorninski element v sfernih koordinatah, če je $\vartheta$ kot od pozitivne osi $z$?
- $r\, dr\, d\vartheta\, d\varphi$
- $r^2\, dr\, d\vartheta\, d\varphi$
+ $r^2\sin\vartheta\, dr\, d\vartheta\, d\varphi$
- $r\sin\vartheta\, dr\, d\vartheta\, d\varphi$
> Celica ima robove $dr$, $r\, d\vartheta$ in $r\sin\vartheta\, d\varphi$, njihov produkt je $r^2\sin\vartheta\, dr\, d\vartheta\, d\varphi$.

:::simboli
P | pravokotnik [a, b] × [c, d] (območje integracije) | | |
f | funkcija, ki jo integriramo | | | pri f ≥ 0 integral da prostornino pod grafom
x, y | spremenljivki integracije (koordinati v ravnini) | | |
d | zgornja meja za y na pravokotniku | | | v dx, dy, dA tudi oznaka diferenciala
A | ploščina (dA je element ploščine) | | | v polarnih koordinatah dA = r dr dφ
a, b | meji za x | | | a ≤ x ≤ b
c | spodnja meja za y na pravokotniku | | |
D | območje integracije v ravnini | | |
\varphi_1 | spodnja meja za y (funkcija x) | | | območje tipa I
\varphi_2 | zgornja meja za y (funkcija x) | | | območje tipa I
T | telo v prostoru (območje trojnega integrala) | | |
z | tretja koordinata (višina) | | |
V | prostornina telesa (dV je element prostornine) | V = \iiint_T 1\, dV | |
g_1 | spodnja meja za z | | |
g_2 | zgornja meja za z | | |
J | Jacobijeva determinanta | J = \frac{\partial(x, y)}{\partial(u, v)} | | |J| pove povečanje ploščine; polarno J = r
u, v | novi spremenljivki pri zamenjavi | | | x = x(u, v), y = y(u, v)
m | masa telesa | m = \iiint_T \rho\, dV | kg
\varphi | polarni kot v ravnini xy | | | φ ∈ [0, 2π)
r | oddaljenost od izhodišča (polarna oz. sferna koordinata) | | | r ≥ 0
\vartheta | kot od pozitivne osi z (sferna koordinata) | | | ϑ ∈ [0, π]
e | Eulerjevo število | | | e ≈ 2,718
\psi_1 | spodnja meja za x (funkcija y) | | | območje tipa II
\psi_2 | zgornja meja za x (funkcija y) | | | območje tipa II
\rho | gostota | | kg/m^3 | v zgledu ρ(r) = ρ₀(1 − r/R)
R | polmer krogle | | m
:::
