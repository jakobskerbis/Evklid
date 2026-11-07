---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ko je Maxwell zapisal enačbe elektromagnetnega polja, jih je bilo v komponentah dvajset, polnih istih kombinacij parcialnih odvodov. Ponavljale so se tri: sprememba skalarne količine po prostoru, »izviranje« polja iz točke in njegovo »vrtinčenje«. Maxwell je za zadnji dve uvedel imeni *convergence* in *curl*. Hamilton je pred tem predlagal znak $\nabla$, Gibbs in Heaviside pa sta v osemdesetih letih 19. stoletja iz tega naredila vektorsko analizo, kot jo uporabljamo danes. Dvajset enačb se je skrčilo na štiri.

Iste tri operacije potrebuje inženir materialov in konstrukcij. Kam teče toplota v vroči jekleni plošči? Ali se košček nosilca pri obremenitvi raztegne ali le zasuka? Odgovore dajo **gradient**, **divergenca** in **rotor**. Potrebuješ parcialne odvode, verižno pravilo, skalarni in vektorski produkt ter determinante $3 \times 3$.

## Razlaga

**1. Primer: vroča plošča.** Temperatura tanke plošče je $T(x, y) = 100 - x^2 - 2y^2$ (v $^\circ\mathrm{C}$, koordinate v metrih). V točki $(1, 1)$ stoji senzor. V kateri smeri temperatura najhitreje raste in kako hitro se spreminja, če senzor premaknemo v smeri vektorja $(3, 4)$?

Parcialna odvoda sta $T_x = -2x$, $T_y = -4y$; v točki $(1, 1)$ dobimo vektor $(-2, -4)$. Smer $(3, 4)$ normiramo v $\vec e = \left(\frac35, \frac45\right)$ in vzamemo skalarni produkt: $(-2) \cdot \frac35 + (-4) \cdot \frac45 = -4{,}4\,\mathrm{^\circ C/m}$. Temperatura v tej smeri pada. Najhitreje raste v smeri $(-2, -4)$, proti središču plošče, s hitrostjo $\sqrt{4 + 16} = 4{,}47\,\mathrm{^\circ C/m}$. Vektor parcialnih odvodov je gradient; zdaj ga posplošimo.

**2. Polja.** **Skalarno polje** je funkcija $f\colon D \to \mathbb R$, $D \subseteq \mathbb R^3$ (temperatura, tlak, gostota). **Vektorsko polje** je preslikava $\vec F\colon D \to \mathbb R^3$, $\vec F = (P, Q, R)$ (hitrost tekočine, sila, pomik točk telesa). Polje je razreda $C^k$, če imajo vse komponente zvezne parcialne odvode do reda $k$.

Operator **nabla** je simbolni vektor

$$\nabla = \left(\frac{\partial}{\partial x}, \frac{\partial}{\partial y}, \frac{\partial}{\partial z}\right).$$

Z njim »množimo« na tri načine: s skalarjem, skalarno in vektorsko.

**3. Gradient.**

**Definicija.** Za diferenciabilno skalarno polje $f$ je **gradient**

$$\nabla f = \left(f_x, f_y, f_z\right).$$

**Smerni odvod** v smeri enotskega vektorja $\vec e$ je $D_{\vec e}f(\vec r_0) = \lim_{t \to 0} \frac{f(\vec r_0 + t\vec e) - f(\vec r_0)}{t}$, če limita obstaja.

**Izrek.** Če je $f$ diferenciabilna v $\vec r_0$ in $|\vec e| = 1$, je $D_{\vec e}f(\vec r_0) = \nabla f(\vec r_0) \cdot \vec e$.

**Dokaz.** Naj bo $g(t) = f(\vec r_0 + t\vec e)$. Po verižnem pravilu je $g'(0) = f_x e_1 + f_y e_2 + f_z e_3 = \nabla f \cdot \vec e$, smerni odvod pa je po definiciji ravno $g'(0)$. $\square$

**Posledici.**

- Ker je $\nabla f \cdot \vec e = |\nabla f|\cos\varphi$, je smerni odvod največji v smeri gradienta in tam enak $|\nabla f|$; v nasprotni smeri je najmanjši, $-|\nabla f|$.
- Gradient je pravokoten na nivojsko ploskev $f = c$. Če krivulja $\vec r(t)$ leži na ploskvi, je $f(\vec r(t)) = c$; odvod da $\nabla f \cdot \vec r\,' = 0$, torej je gradient pravokoten na vsako tangento.

:::premisli
Na zemljevidu z izohipsami so te na nekem mestu zelo zgoščene. Kaj to pove o gradientu višine in kako je usmerjen glede na izohipse?
---
Gradient je tam po velikosti velik (višina se na kratki razdalji močno spremeni) in kaže pravokotno na izohipse, navzgor po pobočju.
:::

**4. Divergenca.**

**Definicija.** Za $\vec F = (P, Q, R)$ razreda $C^1$ je **divergenca** skalarno polje

$$\operatorname{div} \vec F = \nabla \cdot \vec F = P_x + Q_y + R_z.$$

Pomen: $\operatorname{div}\vec F$ v točki meri, koliko polja na enoto prostornine **izvira** iz majhne okolice točke (pozitivna: izvir, negativna: ponor). Natančno to pove Gaussov izrek pri ploskovnih integralih. Polje z $\operatorname{div}\vec F = 0$ je **brezizvirno** (solenoidalno).

**5. Rotor.**

**Definicija.** Za $\vec F = (P, Q, R)$ razreda $C^1$ je **rotor** vektorsko polje

$$\operatorname{rot}\vec F = \nabla \times \vec F = \begin{vmatrix} \vec i & \vec j & \vec k \\ \partial_x & \partial_y & \partial_z \\ P & Q & R \end{vmatrix},$$

po komponentah $\operatorname{rot}\vec F = \left(R_y - Q_z,\; P_z - R_x,\; Q_x - P_y\right)$.

Pomen: rotor meri vrtinčenje. Pri togem vrtenju s kotno hitrostjo $\vec\omega$ je hitrost $\vec v = \vec\omega \times \vec r$ in $\operatorname{rot}\vec v = 2\vec\omega$. Polje z $\operatorname{rot}\vec F = \vec 0$ je **brezvrtinčno**.

Na ravnini $\vec F = (P, Q, 0)$ s $P$, $Q$ neodvisnima od $z$ ostane le tretja komponenta $Q_x - P_y$.

**6. Identitete.**

**Izrek.** Za $f$ in $\vec F$ razreda $C^2$ na odprti množici velja

$$\operatorname{rot}(\nabla f) = \vec 0, \qquad \operatorname{div}(\operatorname{rot}\vec F) = 0.$$

**Dokaz.** Prva komponenta $\operatorname{rot}(\nabla f)$ je $f_{zy} - f_{yz} = 0$ po Schwarzovem izreku (mešana odvoda sta enaka pri $C^2$); drugi dve enako. Za drugo identiteto: $\operatorname{div}(\operatorname{rot}\vec F) = (R_y - Q_z)_x + (P_z - R_x)_y + (Q_x - P_y)_z$; členi se paroma odštejejo, na primer $R_{yx} - R_{xy} = 0$. $\square$

Polje $\vec F$ je **potencialno**, če obstaja $\varphi$ z $\nabla\varphi = \vec F$; $\varphi$ je **potencial**. Po izreku ima potencialno polje rotor nič. Velja tudi obrat, če je območje dovolj lepo:

**Izrek.** Če je $\vec F$ razreda $C^1$ na $\mathbb R^3$ (ali na kvadru, krogli) in $\operatorname{rot}\vec F = \vec 0$, je $\vec F$ potencialno. (Dokaz s krivuljnim integralom sledi v naslednji temi.)

Še dve pravili: $\operatorname{div}(f\vec F) = \nabla f \cdot \vec F + f\operatorname{div}\vec F$ in **Laplaceov operator** $\Delta f = \operatorname{div}(\nabla f) = f_{xx} + f_{yy} + f_{zz}$.

:::premisli
Polje $\vec F = (-y, x, 0)$ opisuje vrtenje okoli osi $z$. Napovej, ali je njegova divergenca pozitivna, negativna ali nič, in ali bi lahko bilo gradient kake funkcije.
---
Divergenca je $0 + 0 + 0 = 0$: tok kroži, nikjer ne izvira. Rotor je $(0, 0, 2) \ne \vec 0$, zato polje ni gradient (gradient ima rotor nič).
:::

## Rešeni primeri

### Primer 1 (lažji)

Za $f(x, y, z) = x^2y + yz^3$ določi smerni odvod v točki $T(1, 2, 1)$ v smeri vektorja $\vec a = (2, -1, 2)$ in največjo hitrost naraščanja $f$ v tej točki.

**Podatki:** $f = x^2y + yz^3$, točka $(1, 2, 1)$, smer $\vec a = (2, -1, 2)$
**Iščemo:** $D_{\vec e}f$ in $|\nabla f|$ v točki $T$

:::formula
$D_{\vec e}f = \nabla f \cdot \vec e$, $\vec e = \frac{\vec a}{|\vec a|}$; največja hitrost je $|\nabla f|$
:::

**Rešitev:**

1. Gradient: $\nabla f = (2xy,\; x^2 + z^3,\; 3yz^2)$.
2. V točki $T$: $\nabla f = (4, 2, 6)$.
3. $|\vec a| = \sqrt{4 + 1 + 4} = 3$, zato $\vec e = \frac13(2, -1, 2)$; smer mora biti enotska.
4. $D_{\vec e}f = \frac{8 - 2 + 12}{3} = 6$.
5. $|\nabla f| = \sqrt{16 + 4 + 36} = \sqrt{56} = 7{,}48$.
6. Odgovor: smerni odvod je $6$, največja hitrost naraščanja $\sqrt{56} \approx 7{,}48$ v smeri $(4, 2, 6)$.

### Primer 2

Kos jeklenega bloka se pod obremenitvijo deformira s poljem pomikov $\vec u = 10^{-3}(2x + y,\; -x + 0{,}5y,\; 0)$ (pomik in koordinate v metrih). Določi relativno spremembo prostornine, spremembo prostornine dela s prostornino $V = 1\,\mathrm{L}$ in kot zasuka koščkov materiala.

**Podatki:** $\vec u = 10^{-3}(2x + y,\; -x + 0{,}5y,\; 0)$, $V = 1\,\mathrm{L}$
**Iščemo:** $\operatorname{div}\vec u$, $\Delta V$ in kot zasuka $\theta$

:::formula
Pri majhnih deformacijah je relativna sprememba prostornine $\frac{\Delta V}{V} = \operatorname{div}\vec u$, zasuk pa $\vec\theta = \frac12\operatorname{rot}\vec u$.
:::

**Rešitev:**

1. Divergenca: $\operatorname{div}\vec u = 10^{-3}(2 + 0{,}5 + 0) = 2{,}5 \cdot 10^{-3}$.
2. Sprememba prostornine: $\Delta V = 2{,}5 \cdot 10^{-3} \cdot 1000\,\mathrm{mL} = 2{,}5\,\mathrm{mL}$; material se razširi.
3. Rotor: ostane le $z$-komponenta, $Q_x - P_y = 10^{-3}(-1 - 1) = -2 \cdot 10^{-3}$.
4. Zasuk: $\theta_z = \frac12 \cdot (-2 \cdot 10^{-3}) = -10^{-3}\,\mathrm{rad}$; negativni predznak pomeni zasuk v smeri urinega kazalca (gledano z vrha osi $z$).
5. Odgovor: prostornina se poveča za $0{,}25\,\%$ ($2{,}5\,\mathrm{mL}$ na liter), koščki materiala se zasukajo za $10^{-3}\,\mathrm{rad} \approx 0{,}057^\circ$ v smeri urinega kazalca.

### Primer 3 (težji)

Dano je polje $\vec F = (2xy + z^3,\; x^2 + 2yz,\; axz^2 + y^2)$. Določi $a$, da bo $\vec F$ potencialno, poišči potencial $\varphi$ z $\varphi(0, 0, 0) = 0$ in izračunaj $\operatorname{div}\vec F$ v točki $(1, -1, 2)$.

**Podatki:** $\vec F = (2xy + z^3,\; x^2 + 2yz,\; axz^2 + y^2)$, $\varphi(0, 0, 0) = 0$, točka $(1, -1, 2)$
**Iščemo:** $a$, $\varphi$ in $\operatorname{div}\vec F(1, -1, 2)$

:::formula
$\operatorname{rot}\vec F = (R_y - Q_z,\; P_z - R_x,\; Q_x - P_y)$; na $\mathbb R^3$: $\operatorname{rot}\vec F = \vec 0 \Rightarrow \vec F = \nabla\varphi$; $\operatorname{div}\vec F = P_x + Q_y + R_z$
:::

**Rešitev:**

1. Komponente rotorja: $R_y - Q_z = 2y - 2y = 0$; $P_z - R_x = 3z^2 - az^2$; $Q_x - P_y = 2x - 2x = 0$.
2. Rotor je nič natanko pri $a = 3$. Polje je razreda $C^1$ na vsem $\mathbb R^3$, zato je po izreku tedaj potencialno.
3. Iz $\varphi_x = 2xy + z^3$ z integracijo po $x$: $\varphi = x^2y + xz^3 + g(y, z)$.
4. Iz $\varphi_y = x^2 + g_y = x^2 + 2yz$ sledi $g_y = 2yz$, torej $g = y^2z + h(z)$.
5. Iz $\varphi_z = 3xz^2 + y^2 + h'(z) = 3xz^2 + y^2$ sledi $h' = 0$, $h = C$; pogoj v izhodišču da $C = 0$.
6. Potencial: $\varphi = x^2y + xz^3 + y^2z$. Preizkus: $\nabla\varphi = (2xy + z^3,\; x^2 + 2yz,\; 3xz^2 + y^2) = \vec F$.
7. Divergenca: $\operatorname{div}\vec F = 2y + 2z + 6xz$; v točki $(1, -1, 2)$: $-2 + 4 + 12 = 14$.
8. Odgovor: $a = 3$, $\varphi = x^2y + xz^3 + y^2z$, $\operatorname{div}\vec F(1, -1, 2) = 14$. (Vrednost $\varphi(1, -1, 2) = 9$ bo v naslednji temi delo polja od izhodišča do te točke, neodvisno od poti.)

### Primer 4 – zdaj ti

Pri vrtenju gredi s kotno hitrostjo $\omega$ okoli osi $z$ je hitrost točk $\vec v = (-\omega y,\; \omega x,\; 0)$. Izračunaj $\operatorname{div}\vec v$ in $\operatorname{rot}\vec v$.

**Podatki:** $\vec v = (-\omega y,\; \omega x,\; 0)$, $\omega$ konstanta
**Iščemo:** $\operatorname{div}\vec v$, $\operatorname{rot}\vec v$

:::formula
$\operatorname{div}\vec v = P_x + Q_y + R_z$; $\operatorname{rot}\vec v = (R_y - Q_z,\; P_z - R_x,\; Q_x - P_y)$
:::

**Rešitev:**

1. $P = -\omega y$, $Q = \omega x$, $R = 0$; $P_x = 0$, $Q_y = 0$, $R_z = 0$.
2. Seštej za divergenco in izračunaj tretjo komponento rotorja $Q_x - P_y$. Kaj pove rezultat o zvezi $\operatorname{rot}\vec v = 2\vec\omega$?

:::premisli
Kolikšna sta divergenca in rotor?
---
$\operatorname{div}\vec v = 0$ (togo vrtenje ne stiska materiala) in $\operatorname{rot}\vec v = (0, 0, \omega + \omega) = (0, 0, 2\omega)$, kar je res $2\vec\omega$ z $\vec\omega = (0, 0, \omega)$.
:::

## Pogoste napake

- **Gradient vektorskega polja ali divergenca skalarja.** Gradient deluje na skalarno polje in da vektor; divergenca na vektorsko polje in da skalar; rotor na vektorsko in da vektor. Izraz $\operatorname{div} f$ za skalar $f$ nima pomena.
- **Smer, ki ni enotska.** Pri $\vec a = (2, -1, 2)$ je $\nabla f \cdot \vec a = 18$, smerni odvod pa $6$. Smer vedno najprej deli z dolžino.
- **Predznaki v rotorju.** Druga komponenta je $P_z - R_x$, ne $R_x - P_z$. Varno: razvij determinanto po prvi vrstici z znaki $+, -, +$ ali uporabi ciklični vzorec $x \to y \to z$.
- **»Rotor je nič, torej ni nič vrtenja nikjer.«** Rotor je lastnost točke. Polje $\left(\frac{-y}{x^2 + y^2}, \frac{x}{x^2 + y^2}, 0\right)$ ima zunaj osi $z$ rotor nič, a kroži okoli osi; potencialno na tem območju ni (glej »Bolj natančno«).
- **Potencial brez preverjanja rotorja.** Integracija po $x$, $y$, $z$ »uspe« navidezno tudi pri nepotencialnem polju, če pozabiš preveriti, da se $g_y$ ujema. Najprej izračunaj $\operatorname{rot}\vec F$.

## Povzetek

- $\nabla = (\partial_x, \partial_y, \partial_z)$; $\nabla f$ (skalar → vektor), $\nabla \cdot \vec F$ (vektor → skalar), $\nabla \times \vec F$ (vektor → vektor).
- $D_{\vec e}f = \nabla f \cdot \vec e$; gradient kaže v smer najhitrejšega naraščanja in je pravokoten na nivojske ploskve.
- $\operatorname{div}\vec F = P_x + Q_y + R_z$ meri izviranje; $\operatorname{rot}\vec F = (R_y - Q_z, P_z - R_x, Q_x - P_y)$ meri vrtinčenje, pri togem vrtenju $2\vec\omega$.
- Za $C^2$: $\operatorname{rot}\nabla f = \vec 0$, $\operatorname{div}\operatorname{rot}\vec F = 0$; na $\mathbb R^3$ je $\operatorname{rot}\vec F = \vec 0$ ekvivalentno obstoju potenciala.
- Materiali: $\operatorname{div}\vec u$ je relativna sprememba prostornine, $\frac12\operatorname{rot}\vec u$ zasuk; toplotni tok $\vec q = -\lambda\nabla T$.

## Za izpit

Znati moraš povedati:

- definicije gradienta, smernega odvoda, divergence in rotorja (s komponentami),
- izrek $D_{\vec e}f = \nabla f \cdot \vec e$ z dokazom in obe posledici (največja rast, pravokotnost na nivojske ploskve),
- identiteti $\operatorname{rot}\nabla f = \vec 0$ in $\operatorname{div}\operatorname{rot}\vec F = 0$ s pogojem $C^2$ in dokazom,
- definicijo potencialnega polja in postopek iskanja potenciala,
- fizikalni pomen divergence in rotorja.

### Naloga 1

Naj bo $\vec r = (x, y, z)$ in $r = |\vec r|$. Za $r \ne 0$ dokaži $\nabla r = \frac{\vec r}{r}$ in $\nabla\frac1r = -\frac{\vec r}{r^3}$. Nato pokaži, da ima polje $\vec E = \frac{\vec r}{r^3}$ (električno polje točkastega naboja) za $r \ne 0$ divergenco in rotor nič. V točki $(1, 2, 2)$ izračunaj $\vec E$ in $|\vec E|$.

**Rešitev:**

1. $r_x = \frac{2x}{2\sqrt{x^2 + y^2 + z^2}} = \frac xr$, enako $r_y = \frac yr$, $r_z = \frac zr$; torej $\nabla r = \frac{\vec r}{r}$.
2. Verižno pravilo: $\nabla\frac1r = -\frac{1}{r^2}\nabla r = -\frac{\vec r}{r^3}$.
3. Rotor: $\vec E = -\nabla\frac1r$ je gradient funkcije razreda $C^2$ na $\mathbb R^3 \setminus \{0\}$, zato $\operatorname{rot}\vec E = \vec 0$.
4. Divergenca: $\frac{\partial}{\partial x}\frac{x}{r^3} = \frac{1}{r^3} - \frac{3x \cdot r_x}{r^4} = \frac{1}{r^3} - \frac{3x^2}{r^5}$; enako za $y$, $z$.
5. Vsota: $\frac{3}{r^3} - \frac{3(x^2 + y^2 + z^2)}{r^5} = \frac{3}{r^3} - \frac{3}{r^3} = 0$.
6. V točki $(1, 2, 2)$ je $r = 3$, $\vec E = \frac{1}{27}(1, 2, 2)$, $|\vec E| = \frac{3}{27} = \frac19$.
7. Odgovor: zunaj izhodišča je polje brezizvirno in brezvrtinčno; ves »izvir« je skrit v izhodišču, kjer polje ni definirano. V $(1, 2, 2)$ je $|\vec E| = \frac19$.

### Naloga 2

Temperatura v prerezu jeklene stene je $T(x, y) = 20 + 1000\,(3x^2y - y^3)$ (v $^\circ\mathrm{C}$, koordinate v metrih), toplotna prevodnost $\lambda = 50\,\mathrm{W/(m\,K)}$. V točki $(0{,}1; 0{,}2)$ določi gostoto toplotnega toka $\vec q = -\lambda\nabla T$, njeno velikost in smer, v kateri se temperatura ne spreminja. Utemelji, ali so v steni toplotni izviri.

**Rešitev:**

1. Gradient: $\nabla T = 1000\,(6xy,\; 3x^2 - 3y^2)$.
2. V točki: $\nabla T = 1000\,(0{,}12;\; -0{,}09) = (120, -90)\,\mathrm{K/m}$, $|\nabla T| = 150\,\mathrm{K/m}$.
3. Tok: $\vec q = -50 \cdot (120, -90) = (-6000, 4500)\,\mathrm{W/m^2}$, $|\vec q| = 7500\,\mathrm{W/m^2}$; teče proti nižji temperaturi.
4. Smer brez spremembe je pravokotna na gradient: $\vec e = (0{,}6;\; 0{,}8)$, saj je $120 \cdot 0{,}6 - 90 \cdot 0{,}8 = 0$.
5. Izviri: $\operatorname{div}\vec q = -\lambda\Delta T$ in $\Delta T = 1000\,(6y - 6y) = 0$.
6. Odgovor: $\vec q = (-6000, 4500)\,\mathrm{W/m^2}$, $|\vec q| = 7{,}5\,\mathrm{kW/m^2}$; temperatura se ne spreminja v smeri $(0{,}6;\; 0{,}8)$; ker je $\operatorname{div}\vec q = 0$, v steni ni izvirov toplote (stacionarno prevajanje).

### Naloga 3

Natančno navedi in dokaži izrek o identitetah $\operatorname{rot}(\nabla f) = \vec 0$ in $\operatorname{div}(\operatorname{rot}\vec F) = 0$. Nato utemelji, ali obstaja vektorsko polje $\vec G$ razreda $C^2$ z $\operatorname{rot}\vec G = (x, y, z)$.

**Rešitev:**

1. Izrek: če sta $f$ in $\vec F$ razreda $C^2$ na odprti množici $D \subseteq \mathbb R^3$, je na $D$ $\operatorname{rot}(\nabla f) = \vec 0$ in $\operatorname{div}(\operatorname{rot}\vec F) = 0$.
2. Dokaz prve: komponente so $f_{zy} - f_{yz}$, $f_{xz} - f_{zx}$, $f_{yx} - f_{xy}$; vse so nič po Schwarzovem izreku, ki zahteva zvezne mešane odvode ($C^2$).
3. Dokaz druge: $(R_y - Q_z)_x + (P_z - R_x)_y + (Q_x - P_y)_z = (R_{yx} - R_{xy}) + (P_{zy} - P_{yz}) + (Q_{xz} - Q_{zx}) = 0$, spet po Schwarzu.
4. Če bi bil $\operatorname{rot}\vec G = (x, y, z)$, bi po drugi identiteti veljalo $\operatorname{div}(x, y, z) = 0$.
5. Toda $\operatorname{div}(x, y, z) = 1 + 1 + 1 = 3 \ne 0$.
6. Odgovor: takega polja $\vec G$ ni. Rotor je vedno brezizvirno polje.

## Drugače: Z analogijo

Predstavljaj si pokrajino in reko.

- **Gradient** je puščica, ki jo narišeš na pobočje: kaže navkreber, kamor je pot najstrmejša, in je dolga toliko, kolikor je pobočje strmo. Žoga se skotali v nasprotni smeri.
- **Divergenca** je izvir ali ponikalnica v reki. Če okoli točke narišeš majhen krog in več vode odteče iz njega, kot priteče, je divergenca pozitivna.
- **Rotor** je majhno mlinsko kolo, potopljeno v reko. Če ga voda zavrti, ima tok tam rotor; os vrtenja kaže smer rotorja, hitrost vrtenja njegovo velikost. Tudi v ravnem toku je rotor, če ob bregu voda teče počasneje kot na sredini: kolo se zavrti.

## Drugače: Uporaba v stroki

- **Prevajanje toplote.** Fourierov zakon $\vec q = -\lambda\nabla T$ in ohranitev energije dasta enačbo $\rho c\,T_t = \lambda\Delta T$. Inženir iz gradienta presodi, kje bo v zvaru ali turbinski lopatici največji toplotni tok.
- **Deformacije.** Pri majhnih pomikih $\vec u$ je $\operatorname{div}\vec u$ prostorninska deformacija, $\frac12\operatorname{rot}\vec u$ zasuk brez spremembe oblike. Programi za metodo končnih elementov ločijo prav ta dela.
- **Ravnotežje napetosti.** V notranjosti nosilca velja $\operatorname{div}\boldsymbol\sigma + \vec f = \vec 0$ (divergenca tenzorja napetosti po vrsticah): sile se v vsakem koščku izravnajo.
- **Konzervativne sile.** Sila teže in sila vzmeti sta gradienta potencialne energije; zato je delo neodvisno od poti, kar izrabljajo energijske metode statike.

## Drugače: Bolj natančno

**Območje je pomembno.** Polje $\vec F = \left(\frac{-y}{x^2 + y^2}, \frac{x}{x^2 + y^2}, 0\right)$ na $D = \mathbb R^3 \setminus \{\text{os } z\}$ ima $\operatorname{rot}\vec F = \vec 0$, a ni potencialno: krivuljni integral po krožnici okoli osi $z$ je $2\pi$, za gradient pa bi bil $0$. Izrek »rot $= 0$ ⇒ potencial« velja na **enostavno povezanih** območjih (vsako zanko lahko zvezno skrčimo v točko); $D$ zaradi osi to ni.

**Helmholtzov razcep.** Dovolj lepo polje, ki dovolj hitro pojema v neskončnosti, je vsota brezvrtinčnega in brezizvirnega dela, $\vec F = \nabla\varphi + \operatorname{rot}\vec A$. Prvi del določa divergenca, drugega rotor.

**Neodvisnost od koordinat.** Gradient, divergenca in rotor so definirani brez koordinat (gradient prek smernega odvoda, divergenca kot meja pretoka skozi majhno ploskev na enoto prostornine). Zato ostanejo enaki pri vrtenju koordinatnega sistema, v krivočrtnih koordinatah pa dobijo drugačne obrazce; v valjnih koordinatah je na primer $\nabla f = \left(f_\rho,\; \frac1\rho f_\phi,\; f_z\right)$.

## Preveri se

? Kateri izraz **ne** sodi med ostale (ostali so smiselni)?
- $\nabla f$ za skalarno polje $f$
~ Gradient skalarnega polja je vektorsko polje; izraz je smiseln.
- $\operatorname{div}\vec F$ za vektorsko polje $\vec F$
~ Divergenca vektorskega polja je skalarno polje; izraz je smiseln.
+ $\operatorname{rot} f$ za skalarno polje $f$
- $\operatorname{rot}\vec F$ za vektorsko polje $\vec F$
~ Rotor vektorskega polja je vektorsko polje; izraz je smiseln.
> Rotor je vektorski produkt $\nabla \times \vec F$ in zahteva vektorsko polje; za skalar ni definiran.

? Kolikšna je divergenca polja $\vec F = (x^2,\; xy,\; 3z)$ v točki $(1, 2, 0)$?
- $7$
~ Pri $Q = xy$ je $Q_y = x = 1$, ne $y = 2$.
+ $6$
- $3$
~ $R = 3z$ je treba najprej odvajati ($R_z = 3$), šele nato vstaviti $z = 0$.
- $(2, 1, 3)$
~ Divergenca je skalar, ne vektor parcialnih odvodov.
> $P_x = 2x = 2$, $Q_y = x = 1$, $R_z = 3$; vsota je $6$.

? Za gladko funkcijo $f$ je $\operatorname{rot}(\nabla f) = \vec 0$. Zakaj?
- Ker je gradient vedno konstanten vektor.
~ Gradient se od točke do točke spreminja, na primer $\nabla(x^2) = (2x, 0, 0)$.
+ Ker so mešani parcialni odvodi razreda $C^2$ enaki (Schwarzov izrek).
- Ker je divergenca gradienta nič.
~ $\operatorname{div}\nabla f = \Delta f$ v splošnem ni nič, na primer $\Delta(x^2) = 2$.
> Komponente rotorja gradienta so razlike $f_{zy} - f_{yz}$ ipd., ki so po Schwarzovem izreku nič.

? Študent računa smerni odvod $f = xy$ v $(2, 3)$ v smeri $\vec a = (3, 4)$: (1) $\nabla f = (y, x) = (3, 2)$; (2) $\nabla f \cdot \vec a = 9 + 8 = 17$; (3) odgovor: smerni odvod je $17$. Kateri korak je napačen?
- korak (1)
~ $f_x = y = 3$, $f_y = x = 2$; korak je pravilen.
- korak (2)
~ Skalarni produkt je izračunan pravilno, $3 \cdot 3 + 2 \cdot 4 = 17$.
+ korak (3)
- noben korak
~ Smer ni enotska, $|\vec a| = 5$, zato $17$ ni smerni odvod.
> Deliti je treba z $|\vec a| = 5$: smerni odvod je $\frac{17}{5} = 3{,}4$.

? Pri preizkusu gumijaste tesnilke izmerijo polje pomikov z $\operatorname{div}\vec u = 0$ povsod. Kaj to pomeni za material?
- Tesnilka se ne deformira.
~ Pomiki niso nujno nič; spremeni se lahko oblika, na primer strig ali zasuk.
+ Prostornina koščkov ostaja enaka, material se obnaša nestisljivo.
- Koščki se ne zasukajo.
~ Zasuk opisuje $\frac12\operatorname{rot}\vec u$, ne divergenca.
> $\operatorname{div}\vec u$ je relativna sprememba prostornine; guma je skoraj nestisljiva, zato je to dober model.

:::simboli
f | skalarno polje | |
\vec F | vektorsko polje | \vec F = (P, Q, R) |
P, Q, R | komponente vektorskega polja | |
\vec e | enotski vektor smeri | | – | dolžina 1; dobimo ga z deljenjem $\vec a$ z dolžino
\vec a | dani (neenotski) vektor smeri | |
D_{\vec e} | smerni odvod v smeri $\vec e$ | |
\vec r | krajevni vektor | \vec r = (x, y, z) | m
r | razdalja od izhodišča | r = \sqrt{x^2 + y^2 + z^2} | m
x, y, z | koordinate | | m
T | temperatura | | °C
\vec q | gostota toplotnega toka | \vec q = -\lambda \nabla T | W/m^2
\lambda | toplotna prevodnost | | W/(m\,K)
\vec u | polje pomikov | | m
V | prostornina | | L
\Delta V | sprememba prostornine | \Delta V = V \operatorname{div}\vec u | mL
\theta, \vec\theta | zasuk koščka materiala | \vec\theta = \frac12 \operatorname{rot}\vec u | rad
\vec v | hitrost točk | \vec v = \vec\omega \times \vec r | m/s
\omega, \vec\omega | kotna hitrost | | s^{-1}
\varphi | potencial | \nabla\varphi = \vec F |
a | parameter v polju | |
\vec E | električno polje točkastega naboja | \vec E = \frac{\vec r}{r^3} |
\vec i, \vec j, \vec k | enotski vektorji koordinatnih osi | |
:::
