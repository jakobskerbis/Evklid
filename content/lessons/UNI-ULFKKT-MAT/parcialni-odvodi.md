---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Večina količin v naravi je odvisna od več spremenljivk hkrati. Tlak idealnega plina je odvisen od temperature in prostornine, $p = nRT/V$. Hitrost kemijske reakcije je odvisna od koncentracij več snovi in od temperature. Temperatura v kosu kovine je odvisna od lege $(x, y, z)$ in časa. Pridelek je odvisen od količine vode in gnojila.

Pri funkciji ene spremenljivke odvod pove, kako hitro se funkcija spreminja. Pri funkciji več spremenljivk pa se lahko vprašamo: kako hitro se spreminja, če spremenimo **samo eno** spremenljivko, druge pa držimo pri miru? Odgovor je **parcialni odvod**. Iz parcialnih odvodov sestavimo še:

- **totalni diferencial**, s katerim ocenimo spremembo funkcije, ko se spremenijo vse spremenljivke hkrati, in izračunamo, kako se napake meritev prenesejo v rezultat,
- **gradient**, vektor, ki kaže smer najhitrejšega naraščanja (npr. smer, v kateri se snov najhitreje segreva ali v katero difundira),
- **verižno pravilo**, ko so spremenljivke same odvisne od drugih spremenljivk, na primer od časa.

Parcialni odvodi so jezik termodinamike, fizikalne kemije, transportnih pojavov in optimizacije.

## Razlaga

**1. Funkcije dveh spremenljivk.** Funkcija $f\colon D \to \mathbb{R}$, $D \subseteq \mathbb{R}^2$, vsaki točki $(x, y)$ iz definicijskega območja priredi število $z = f(x, y)$. Njen **graf** je ploskev v prostoru. **Nivojnica** za vrednost $c$ je krivulja $f(x, y) = c$ v ravnini $xy$: izobare na vremenski karti in plastnice na zemljevidu so nivojnice.

**2. Parcialni odvod.** **Definicija.** Naj bo $f$ definirana na okolici točke $(a, b)$. Parcialni odvod funkcije $f$ po $x$ v točki $(a, b)$ je

$$\frac{\partial f}{\partial x}(a, b) = f_x(a, b) = \lim_{h \to 0}\frac{f(a + h, b) - f(a, b)}{h},$$

če ta limita obstaja in je končna. Spremenljivko $y$ smo držali pri vrednosti $b$, torej smo odvajali funkcijo ene spremenljivke $x \mapsto f(x, b)$. Podobno je $f_y(a, b) = \lim_{h \to 0}\frac{f(a, b + h) - f(a, b)}{h}$.

**Praktično pravilo:** pri $\partial f/\partial x$ obravnavamo vse druge spremenljivke kot **konstante** in odvajamo po $x$ z vsemi znanimi pravili (za vsoto, produkt, kvocient, verižno pravilo). Primer: za $f(x, y) = x^2\sin y$ je $f_x = 2x\sin y$ in $f_y = x^2\cos y$.

**Geometrijski pomen:** $f_x(a, b)$ je naklon krivulje, ki jo na grafu izreže ravnina $y = b$, v točki nad $(a, b)$. Pri funkciji več spremenljivk $f(x_1, \dots, x_n)$ je parcialnih odvodov $n$.

:::premisli
Za $f(x, y) = x^y$ ($x > 0$): katero pravilo iz tabele odvodov uporabiš za $f_x$ in katero za $f_y$?
---
Pri $f_x$ je $y$ konstanten eksponent, zato velja pravilo za potenco: $f_x = y\,x^{y-1}$. Pri $f_y$ je osnova $x$ konstantna, zato velja pravilo za eksponentno funkcijo: $f_y = x^y \ln x$.
:::

**3. Višji odvodi.** Parcialne odvode lahko spet parcialno odvajamo: $f_{xx} = \frac{\partial^2f}{\partial x^2}$, $f_{yy}$, ter **mešana** odvoda $f_{xy} = \frac{\partial}{\partial y}\frac{\partial f}{\partial x}$ in $f_{yx}$. **Schwarzev izrek.** Naj bo $f$ definirana na okolici točke $(a, b)$, naj na tej okolici obstajata mešana odvoda $f_{xy}$ in $f_{yx}$ in naj bosta v $(a, b)$ zvezna. Potem je $f_{xy}(a, b) = f_{yx}(a, b)$. V termodinamiki iz tega sledijo Maxwellove relacije.

*Zamisel dokaza.* Opazujemo drugo diferenco $\Delta = f(a + h, b + k) - f(a + h, b) - f(a, b + k) + f(a, b)$. Za $\varphi(x) = f(x, b + k) - f(x, b)$ je $\Delta = \varphi(a + h) - \varphi(a)$; dvakratna uporaba Lagrangeevega izreka da $\Delta = hk\, f_{xy}(\xi_1, \eta_1)$ za neko točko $(\xi_1, \eta_1)$ v pravokotniku med $(a, b)$ in $(a + h, b + k)$. Enako s $\psi(y) = f(a + h, y) - f(a, y)$ dobimo $\Delta = hk\, f_{yx}(\xi_2, \eta_2)$. Delimo s $hk$ in pošljemo $(h, k) \to (0, 0)$; zaradi zveznosti obeh odvodov v $(a, b)$ sledi enakost.

**4. Diferenciabilnost in tangentna ravnina.** Pri eni spremenljivki obstoj odvoda pomeni, da graf lahko lokalno nadomestimo s tangento. Pri dveh spremenljivkah obstoj obeh parcialnih odvodov tega **ne** zagotavlja, ker gledamo le dve smeri. **Definicija.** Naj bo $f$ definirana na okolici točke $(a, b)$. Funkcija $f$ je **diferenciabilna** v $(a, b)$, če obstajata realni števili $A$ in $B$, da je

$$f(a + h, b + k) = f(a, b) + A\,h + B\,k + E(h, k), \qquad \lim_{(h, k) \to (0, 0)}\frac{E(h, k)}{\sqrt{h^2 + k^2}} = 0,$$

ostanek torej gre proti $0$ hitreje kot razdalja $\sqrt{h^2 + k^2}$ (pišemo $E = o(\sqrt{h^2 + k^2})$).

**Izrek.** Če je $f$ diferenciabilna v $(a, b)$, je tam zvezna, obstajata oba parcialna odvoda in $A = f_x(a, b)$, $B = f_y(a, b)$.

*Dokaz.* Ko gre $(h, k) \to (0, 0)$, gredo $Ah$, $Bk$ in $E(h, k)$ proti $0$, zato $f(a + h, b + k) \to f(a, b)$. Pri $k = 0$ je $\frac{f(a + h, b) - f(a, b)}{h} = A + \frac{E(h, 0)}{h} \to A$, torej $f_x(a, b) = A$; enako pri $h = 0$ dobimo $f_y(a, b) = B$. $\square$

Obrat ne velja: obstoj obeh parcialnih odvodov ne zagotavlja niti zveznosti (protiprimer je v »Bolj natančno«). **Zadosten pogoj (izrek):** če parcialna odvoda $f_x$ in $f_y$ obstajata na okolici točke $(a, b)$ in sta v $(a, b)$ zvezna, je $f$ v $(a, b)$ diferenciabilna. Pri funkcijah, sestavljenih iz elementarnih, je to skoraj vedno izpolnjeno.

Graf diferenciabilne funkcije ima v točki $(a, b, f(a, b))$ **tangentno ravnino**

$$z = f(a, b) + f_x(a, b)(x - a) + f_y(a, b)(y - b).$$

**5. Totalni diferencial.** Linearni del spremembe imenujemo **totalni diferencial**:

$$\mathrm{d}f = \frac{\partial f}{\partial x}\,\mathrm{d}x + \frac{\partial f}{\partial y}\,\mathrm{d}y.$$

Za majhne spremembe $\Delta x$, $\Delta y$ je $\Delta f \approx f_x\,\Delta x + f_y\,\Delta y$. Ocena **največje absolutne napake** rezultata iz napak meritev $\Delta x$, $\Delta y$ je

$$\Delta f \le |f_x|\,\Delta x + |f_y|\,\Delta y.$$

Za produkte in kvociente potenc, $f = Cx^my^n$, iz tega sledi pravilo za relativne napake: $\frac{\Delta f}{|f|} \le |m|\frac{\Delta x}{|x|} + |n|\frac{\Delta y}{|y|}$.

**6. Gradient in smerni odvod.** **Gradient** funkcije $f$ je vektor parcialnih odvodov:

$$\nabla f = \operatorname{grad} f = \left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}\right).$$

**Smerni odvod** v smeri **enotskega** vektorja $\vec{u} = (u_1, u_2)$ je definiran kot

$$\frac{\partial f}{\partial\vec{u}}(a, b) = \lim_{t \to 0}\frac{f(a + tu_1, b + tu_2) - f(a, b)}{t}.$$

**Izrek.** Če je $f$ diferenciabilna v $(a, b)$, je

$$\frac{\partial f}{\partial\vec{u}} = \nabla f \cdot \vec{u} = |\nabla f|\cos\varphi,$$

kjer je $\varphi$ kot med $\nabla f$ in $\vec{u}$. *Dokaz:* v definiciji diferenciabilnosti vzamemo $h = tu_1$, $k = tu_2$; ker je $\sqrt{h^2 + k^2} = |t|$, je $\frac{f(a + tu_1, b + tu_2) - f(a, b)}{t} = f_xu_1 + f_yu_2 + \frac{E}{t} \to \nabla f \cdot \vec{u}$. Od tod sledijo tri pomembne lastnosti:

- gradient kaže v smer **najhitrejšega naraščanja** funkcije, hitrost naraščanja v tej smeri je $|\nabla f|$;
- v smeri $-\nabla f$ funkcija najhitreje pada (na tem temelji gradientni spust pri optimizaciji);
- gradient je **pravokoten na nivojnico** skozi dano točko, ker je v smeri nivojnice sprememba nič.

Prvi dve lastnosti sledita iz $-1 \le \cos\varphi \le 1$: največja vrednost $|\nabla f|$ pri $\varphi = 0$, najmanjša $-|\nabla f|$ pri $\varphi = \pi$ (za $\nabla f \neq \vec{0}$). Tretjo dokažemo z verižnim pravilom (razdelek 7): če je $(x(t), y(t))$ odvedljiva parametrizacija nivojnice, je $f(x(t), y(t)) = c$, odvajanje da $\nabla f \cdot (\dot{x}, \dot{y}) = 0$, torej je gradient pravokoten na tangentni vektor nivojnice.

:::premisli
Diferenciabilna funkcija ima v neki točki smerni odvod $5$ v smeri $(1, 0)$ in $12$ v smeri $(0, 1)$. Kolikšna je največja hitrost naraščanja v tej točki?
---
Smerna odvoda v smereh osi sta kar $f_x = 5$ in $f_y = 12$, torej $\nabla f = (5, 12)$. Največja hitrost naraščanja je $|\nabla f| = \sqrt{25 + 144} = 13$, v smeri $(5, 12)/13$.
:::

**7. Verižno pravilo.** **Izrek.** Naj bosta $x = x(t)$ in $y = y(t)$ odvedljivi v $t$ in naj bo $f$ diferenciabilna v točki $(x(t), y(t))$. Tedaj je $z(t) = f(x(t), y(t))$ odvedljiva v $t$ in

$$\frac{\mathrm{d}z}{\mathrm{d}t} = \frac{\partial f}{\partial x}\frac{\mathrm{d}x}{\mathrm{d}t} + \frac{\partial f}{\partial y}\frac{\mathrm{d}y}{\mathrm{d}t} = \nabla f \cdot (\dot{x}, \dot{y}).$$

*Zamisel dokaza:* v definicijo diferenciabilnosti vstavimo $h = x(t + \Delta t) - x(t)$, $k = y(t + \Delta t) - y(t)$, delimo z $\Delta t$ in pošljemo $\Delta t \to 0$ (podrobno v »Bolj natančno«).

Če sta $x = x(u, v)$ in $y = y(u, v)$ funkciji dveh spremenljivk, velja za vsako spremenljivko posebej

$$\frac{\partial z}{\partial u} = \frac{\partial f}{\partial x}\frac{\partial x}{\partial u} + \frac{\partial f}{\partial y}\frac{\partial y}{\partial u}, \qquad \frac{\partial z}{\partial v} = \frac{\partial f}{\partial x}\frac{\partial x}{\partial v} + \frac{\partial f}{\partial y}\frac{\partial y}{\partial v}.$$

Pravilo si zapomniš tako: za vsako »pot« od $z$ do končne spremenljivke zmnožiš odvode po poti in vse poti sešteješ.

**8. Implicitno odvajanje.** **Izrek o implicitni funkciji.** Naj bodo $F$, $F_x$ in $F_y$ zvezne na okolici točke $(x_0, y_0)$, naj bo $F(x_0, y_0) = 0$ in $F_y(x_0, y_0) \ne 0$. Potem na neki okolici $x_0$ obstaja natanko ena zvezno odvedljiva funkcija $y = y(x)$ z $y(x_0) = y_0$ in $F(x, y(x)) = 0$, in velja

$$y' = -\frac{F_x}{F_y}.$$

*Izpeljava formule:* verižno pravilo za $F(x, y(x)) = 0$ da $F_x \cdot 1 + F_y\,y' = 0$; ker je $F_y \ne 0$, smemo deliti.

## Rešeni primeri

### Primer 1 (lažji)

Za funkcijo $f(x, y) = x^2y^3 - 4xy + 5$ izračunaj oba parcialna odvoda prvega reda in vse parcialne odvode drugega reda v točki $(1, -1)$. Zapiši enačbo tangentne ravnine na graf v tej točki in z njo oceni $f(1{,}1;\,-0{,}9)$.

**Podatki:** $f(x, y) = x^2y^3 - 4xy + 5$, točka $(a, b) = (1, -1)$, ocena v točki $(1{,}1;\,-0{,}9)$
**Iščemo:** $f_x$, $f_y$, $f_{xx}$, $f_{yy}$, $f_{xy}$, $f_{yx}$ v $(1, -1)$, tangentno ravnino, približek za $f(1{,}1;\,-0{,}9)$

:::formula
Pri $\partial/\partial x$ je $y$ konstanta in obratno. Tangentna ravnina: $z = f(a, b) + f_x(a, b)(x - a) + f_y(a, b)(y - b)$.
:::

**Rešitev:**

1. $f_x = 2xy^3 - 4y$, $f_y = 3x^2y^2 - 4x$.
2. V točki $(1, -1)$: $f_x = 2 \cdot 1 \cdot (-1) - 4 \cdot (-1) = 2$, $f_y = 3 \cdot 1 \cdot 1 - 4 = -1$.
3. Drugi odvodi: $f_{xx} = 2y^3 = -2$, $f_{yy} = 6x^2y = -6$, $f_{xy} = \frac{\partial}{\partial y}(2xy^3 - 4y) = 6xy^2 - 4 = 2$, $f_{yx} = \frac{\partial}{\partial x}(3x^2y^2 - 4x) = 6xy^2 - 4 = 2$. Mešana odvoda sta enaka, kot pravi Schwarzev izrek.
4. $f(1, -1) = 1 \cdot (-1) - 4 \cdot (-1) + 5 = 8$. Tangentna ravnina: $z = 8 + 2(x - 1) - (y + 1)$, torej $z = 2x - y + 5$.
5. Ocena: $f(1{,}1;\,-0{,}9) \approx 2 \cdot 1{,}1 + 0{,}9 + 5 = 8{,}1$. Natančna vrednost je $8{,}078$, napaka približka je okoli $0{,}02$.
6. Odgovor: v točki $(1, -1)$ je $f_x = 2$, $f_y = -1$, $f_{xx} = -2$, $f_{yy} = -6$, $f_{xy} = f_{yx} = 2$; tangentna ravnina je $z = 2x - y + 5$, ocena je $f(1{,}1;\,-0{,}9) \approx 8{,}1$.

### Primer 2

Temperatura na tanki kovinski plošči je $T(x, y) = 100 - x^2 - 2y^2$ (v $^\circ\mathrm{C}$, koordinati v centimetrih). Mravlja je v točki $(1, 2)$. V kateri smeri naj se premakne, da se bo najhitreje segrevala, in kako hitro se temperatura spreminja v tej smeri? Kolikšna je sprememba temperature na centimeter, če gre v smeri vektorja $(3, 4)$? V kateri smeri se temperatura ne spreminja?

**Podatki:** $T(x, y) = 100 - x^2 - 2y^2$ ($^\circ\mathrm{C}$, $x$ in $y$ v $\mathrm{cm}$), točka $(1, 2)$, smer $(3, 4)$
**Iščemo:** smer najhitrejšega naraščanja in $|\nabla T|$, smerni odvod v smeri $(3, 4)$, smer nivojnice

:::formula
$\nabla T = (T_x, T_y)$, $\dfrac{\partial T}{\partial\vec{u}} = \nabla T \cdot \vec{u}$ z $|\vec{u}| = 1$; nivojnica je pravokotna na $\nabla T$
:::

**Rešitev:**

1. $T_x = -2x$, $T_y = -4y$, zato $\nabla T(1, 2) = (-2, -8)$, v $^\circ\mathrm{C/cm}$.
2. Smer najhitrejšega segrevanja je $\nabla T$, enotski vektor $(-2, -8)/\sqrt{68} \approx (-0{,}24;\,-0{,}97)$: mravlja naj gre proti izhodišču, predvsem v smeri $-y$.
3. Hitrost spreminjanja v tej smeri: $|\nabla T| = \sqrt{4 + 64} = \sqrt{68} \approx 8{,}25\,^\circ\mathrm{C/cm}$.
4. Smer $(3, 4)$ ima dolžino $5$, enotski vektor $\vec{u} = (0{,}6;\,0{,}8)$. Smerni odvod: $\nabla T \cdot \vec{u} = -2 \cdot 0{,}6 - 8 \cdot 0{,}8 = -7{,}6\,^\circ\mathrm{C/cm}$.
5. Temperatura se ne spreminja v smeri, pravokotni na gradient, na primer $(8, -2)$ oziroma $(4, -1)$: $(-2) \cdot 4 + (-8) \cdot (-1) = 0$ ✓.
6. Odgovor: najhitreje se segreva v smeri $(-2, -8)$, s hitrostjo okoli $8{,}2\,^\circ\mathrm{C}$ na centimeter; v smeri $(3, 4)$ se ohlaja za $7{,}6\,^\circ\mathrm{C}$ na centimeter; vzdolž smeri $(4, -1)$ (tangenta na nivojnico) se temperatura v prvem približku ne spreminja.

### Primer 3 (težji)

V posodi je $1{,}00\,\mathrm{mol}$ idealnega plina. Plin segrevamo tako, da temperatura narašča s hitrostjo $2{,}0\,\mathrm{K/s}$, hkrati pa se prostornina povečuje s hitrostjo $1{,}0 \cdot 10^{-4}\,\mathrm{m^3/s}$. V trenutku, ko je temperatura $300\,\mathrm{K}$ in prostornina $0{,}0250\,\mathrm{m^3}$, izračunaj tlak, oba parcialna odvoda tlaka in hitrost spreminjanja tlaka. S kolikšno hitrostjo bi se morala v tem trenutku povečevati prostornina, da bi tlak (pri enakem segrevanju) ostal stalen? Plinska konstanta je $8{,}314\,\mathrm{J/(mol\,K)}$.

**Podatki:** $n = 1{,}00\,\mathrm{mol}$, $\dot{T} = 2{,}0\,\mathrm{K/s}$, $\dot{V} = 1{,}0 \cdot 10^{-4}\,\mathrm{m^3/s}$, $T = 300\,\mathrm{K}$, $V = 0{,}0250\,\mathrm{m^3}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$, $p = nRT/V$
**Iščemo:** $p$, $\partial p/\partial T$, $\partial p/\partial V$, $\mathrm{d}p/\mathrm{d}t$, hitrost $\dot{V}^*$, pri kateri je $\mathrm{d}p/\mathrm{d}t = 0$

:::formula
$\dfrac{\mathrm{d}p}{\mathrm{d}t} = \dfrac{\partial p}{\partial T}\dfrac{\mathrm{d}T}{\mathrm{d}t} + \dfrac{\partial p}{\partial V}\dfrac{\mathrm{d}V}{\mathrm{d}t}$, $\dfrac{\partial p}{\partial T} = \dfrac{nR}{V}$, $\dfrac{\partial p}{\partial V} = -\dfrac{nRT}{V^2}$
:::

**Rešitev:**

1. Tlak: $p = 1{,}00 \cdot 8{,}314 \cdot 300/0{,}0250\,\mathrm{Pa} \approx 9{,}98 \cdot 10^4\,\mathrm{Pa}$.
2. $\partial p/\partial T = nR/V = 8{,}314/0{,}0250\,\mathrm{Pa/K} \approx 333\,\mathrm{Pa/K}$: za koliko se tlak poveča na kelvin pri stalni prostornini.
3. $\partial p/\partial V = -nRT/V^2 = -8{,}314 \cdot 300/0{,}0250^2\,\mathrm{Pa/m^3} \approx -3{,}99 \cdot 10^6\,\mathrm{Pa/m^3}$: pri stalni temperaturi tlak z večanjem prostornine pada.
4. Verižno pravilo: $\dot{p} = 332{,}6 \cdot 2{,}0 + (-3{,}99 \cdot 10^6) \cdot 1{,}0 \cdot 10^{-4}\,\mathrm{Pa/s} \approx 665 - 399\,\mathrm{Pa/s} = 266\,\mathrm{Pa/s}$.
5. Preizkus z logaritemskim odvodom: $\dot{p}/p = \dot{T}/T - \dot{V}/V = 2{,}0/300 - 10^{-4}/0{,}0250 = 0{,}00667 - 0{,}00400 = 0{,}00267\,\mathrm{s^{-1}}$, in $0{,}00267 \cdot 9{,}98 \cdot 10^4 \approx 266\,\mathrm{Pa/s}$ ✓.
6. Obratno vprašanje: postavimo $\dot{p} = \frac{\partial p}{\partial T}\dot{T} + \frac{\partial p}{\partial V}\dot{V}^* = 0$ in izrazimo $\dot{V}^* = -\frac{\partial p/\partial T}{\partial p/\partial V}\,\dot{T} = \frac{nR/V}{nRT/V^2}\,\dot{T} = \frac{V}{T}\,\dot{T}$.
7. Številsko: $\dot{V}^* = \frac{0{,}0250}{300} \cdot 2{,}0\,\mathrm{m^3/s} \approx 1{,}67 \cdot 10^{-4}\,\mathrm{m^3/s}$. Enako da logaritemski odvod: $\frac{\dot{T}}{T} - \frac{\dot{V}^*}{V} = 0$.
8. Odgovor: tlak je okoli $99{,}8\,\mathrm{kPa}$, $\partial p/\partial T \approx 333\,\mathrm{Pa/K}$, $\partial p/\partial V \approx -3{,}99 \cdot 10^6\,\mathrm{Pa/m^3}$; tlak v tem trenutku narašča s hitrostjo okoli $266\,\mathrm{Pa/s}$, ker segrevanje prevlada nad širjenjem. Tlak bi ostal stalen, če bi se prostornina povečevala s hitrostjo okoli $1{,}67 \cdot 10^{-4}\,\mathrm{m^3/s}$.

## Pogoste napake

- **Druga spremenljivka ni konstanta.** Pri $\partial(x^2y^3)/\partial x$ je $y^3$ konstanten faktor: rezultat je $2xy^3$, ne $2xy^3 + 3x^2y^2$. Vsota obeh delov je (pomnožena z $\mathrm{d}x$ in $\mathrm{d}y$) šele totalni diferencial.
- **Smerni odvod z neenotskim vektorjem.** Vektor smeri moraš najprej normirati. Z vektorjem $(3, 4)$ namesto $(0{,}6;\,0{,}8)$ bi v Primeru 2 dobil $-38$ namesto $-7{,}6$.
- **Gradient kot število.** Gradient je **vektor**; njegova dolžina je največja hitrost naraščanja, smer pa smer tega naraščanja.
- **Obstoj parcialnih odvodov pomeni diferenciabilnost.** Ne: funkcija ima lahko oba parcialna odvoda in ni niti zvezna (glej »Bolj natančno«).
- **Pozabljeni člen v verižnem pravilu.** Če je $z = f(x, y)$ in sta obe spremenljivki odvisni od $t$, sta v $\mathrm{d}z/\mathrm{d}t$ **dva** člena, po eden za vsako pot.
- **Napake se odštevajo.** Pri oceni največje napake seštevamo absolutne vrednosti prispevkov, ker se napake lahko seštejejo v najslabšo smer.

## Povzetek

- Parcialni odvod $\partial f/\partial x$: odvajamo po $x$, druge spremenljivke so konstante; geometrijsko naklon grafa v smeri osi $x$.
- Schwarz: pri zveznih mešanih odvodih je $f_{xy} = f_{yx}$.
- Diferenciabilnost: $f(a + h, b + k) = f(a, b) + f_xh + f_yk + o(\sqrt{h^2 + k^2})$; zadostuje, da sta parcialna odvoda zvezna. Tangentna ravnina $z = f + f_x(x - a) + f_y(y - b)$.
- Totalni diferencial $\mathrm{d}f = f_x\,\mathrm{d}x + f_y\,\mathrm{d}y$; največja napaka $\Delta f \le |f_x|\Delta x + |f_y|\Delta y$.
- Gradient $\nabla f = (f_x, f_y)$: smer najhitrejšega naraščanja, pravokoten na nivojnice; smerni odvod $\nabla f \cdot \vec{u}$, $|\vec{u}| = 1$.
- Verižno pravilo: $\dfrac{\mathrm{d}z}{\mathrm{d}t} = f_x\dot{x} + f_y\dot{y}$; implicitno $y' = -F_x/F_y$.

## Za izpit

Znati moraš povedati:

- definicijo parcialnega odvoda, diferenciabilnosti in smernega odvoda (z limitami);
- izrek: diferenciabilna funkcija je zvezna in $A = f_x$, $B = f_y$, z dokazom; protiprimer, da obstoj parcialnih odvodov ne zadošča;
- zadosten pogoj za diferenciabilnost in Schwarzev izrek z vsemi pogoji;
- dokaz $\frac{\partial f}{\partial\vec{u}} = \nabla f \cdot \vec{u}$ ter zakaj gradient kaže v smer najhitrejšega naraščanja in je pravokoten na nivojnico;
- verižno pravilo, izrek o implicitni funkciji s pogoji in izpeljavo $y' = -F_x/F_y$;
- totalni diferencial in oceno največje napake.

### Naloga 1

Dana je funkcija $f(x, y) = x^2y - y^3 + axy$, kjer je $a$ realen parameter. Določi $a$ tako, da bo smerni odvod funkcije $f$ v točki $(1, 1)$ v smeri vektorja $(3, 4)$ enak $1$. Za ta $a$ zapiši enačbo tangentne ravnine na graf v točki nad $(1, 1)$, poišči smer najhitrejšega padanja funkcije v $(1, 1)$ in hitrost padanja ter zapiši enačbo tangente na nivojnico $f(x, y) = 1$ v točki $(1, 1)$.

**Rešitev:**

1. $f_x = 2xy + ay$, $f_y = x^2 - 3y^2 + ax$; v $(1, 1)$ je $f_x = 2 + a$, $f_y = a - 2$.
2. $f$ je polinom, zato ima zvezne parcialne odvode in je diferenciabilna; smemo uporabiti $\frac{\partial f}{\partial\vec{u}} = \nabla f \cdot \vec{u}$ z enotskim $\vec{u} = \frac{(3, 4)}{5} = (0{,}6;\ 0{,}8)$.
3. $\nabla f \cdot \vec{u} = 0{,}6(2 + a) + 0{,}8(a - 2) = 1{,}4a - 0{,}4$. Iz $1{,}4a - 0{,}4 = 1$ sledi $a = 1$.
4. Za $a = 1$: $f(1, 1) = 1 - 1 + 1 = 1$, $\nabla f(1, 1) = (3, -1)$. Tangentna ravnina: $z = 1 + 3(x - 1) - (y - 1)$, torej $z = 3x - y - 1$.
5. Najhitreje pada v smeri $-\nabla f = (-3, 1)$, enotsko $\frac{(-3, 1)}{\sqrt{10}}$, s hitrostjo $|\nabla f| = \sqrt{10} \approx 3{,}16$ na enoto dolžine.
6. Nivojnica: $F(x, y) = f(x, y) - 1 = 0$ z $F(1, 1) = 0$ in $F_y(1, 1) = -1 \neq 0$, zato je blizu $x = 1$ podana z odvedljivo funkcijo $y(x)$ in $y'(1) = -\frac{F_x}{F_y} = -\frac{3}{-1} = 3$.
7. Tangenta na nivojnico: $y = 1 + 3(x - 1) = 3x - 2$. Preizkus: smerni vektor $(1, 3)$ je pravokoten na gradient, $(1, 3) \cdot (3, -1) = 0$ ✓.
8. Odgovor: $a = 1$; tangentna ravnina $z = 3x - y - 1$; najhitreje pada v smeri $(-3, 1)$ s hitrostjo $\sqrt{10} \approx 3{,}16$; tangenta na nivojnico je $y = 3x - 2$.

### Naloga 2

Natančno definiraj diferenciabilnost funkcije dveh spremenljivk v točki in dokaži, da je diferenciabilna funkcija v tej točki zvezna. Za funkcijo $g(x, y) = \dfrac{x^2y}{x^4 + y^2}$ za $(x, y) \neq (0, 0)$ in $g(0, 0) = 0$ utemelji, ali ima v izhodišču oba parcialna odvoda in ali je tam diferenciabilna.

**Rešitev:**

1. Definicija: $g$ je diferenciabilna v $(a, b)$, če obstajata $A, B \in \mathbb{R}$, da je $g(a + h, b + k) = g(a, b) + Ah + Bk + E(h, k)$ in $\frac{E(h, k)}{\sqrt{h^2 + k^2}} \to 0$, ko $(h, k) \to (0, 0)$.
2. Zveznost: ker $\frac{E}{\sqrt{h^2 + k^2}} \to 0$ in $\sqrt{h^2 + k^2} \to 0$, gre $E \to 0$; tudi $Ah + Bk \to 0$, zato $g(a + h, b + k) \to g(a, b)$.
3. Parcialna odvoda: $g(h, 0) = 0$ in $g(0, k) = 0$ za $h, k \neq 0$, zato sta $g_x(0, 0) = \lim_{h \to 0}\frac{0 - 0}{h} = 0$ in $g_y(0, 0) = 0$. Oba obstajata.
4. Zveznost v izhodišču: vzdolž parabole $y = x^2$, $x \neq 0$, je $g(x, x^2) = \frac{x^4}{x^4 + x^4} = \frac{1}{2}$, kar ne gre proti $g(0, 0) = 0$. Funkcija v $(0, 0)$ ni zvezna.
5. Po dokazanem izreku bi bila diferenciabilna funkcija zvezna, zato $g$ v $(0, 0)$ ni diferenciabilna. Posledično $g_x$ in $g_y$ v izhodišču ne moreta biti zvezna (sicer bi zadosten pogoj dal diferenciabilnost).
6. Odgovor: $g_x(0, 0) = g_y(0, 0) = 0$ obstajata, $g$ pa v izhodišču ni niti zvezna niti diferenciabilna.

## Drugače: Na sliki

Nivojnice funkcije $T(x, y) = 100 - x^2 - 2y^2$ iz Primera 2 so elipse okoli izhodišča (vrh »hriba« je v $(0, 0)$, kjer je $T = 100$):

```
                y
                |
         .-----------.        T = 91 (skozi točko (1, 2))
       /    .-----.    \
      |    (  100  )    |  --- x
       \    '-----'    /
         '-----------'
                |
```

V točki $(1, 2)$ gradient $(-2, -8)$ kaže pravokotno na elipso navznoter, proti vrhu. Dolžina gradienta je velika tam, kjer so nivojnice gosto skupaj (strm breg), in majhna, kjer so redke (položen teren).

Parcialni odvod $f_x(a, b)$ si predstavljaj tako: graf prerežeš z navpično ravnino $y = b$, dobiš krivuljo in odčitaš njen naklon. Za $f_y$ prerežeš z ravnino $x = a$. Tangentna ravnina vsebuje obe tangenti teh dveh krivulj.

## Drugače: Uporaba v stroki

**Termodinamika.** Fizikalni kemiki pišejo parcialne odvode z oznako, katera spremenljivka je konstantna, na primer $\left(\frac{\partial p}{\partial T}\right)_V$. Toplotna kapaciteta pri stalni prostornini je $C_V = \left(\frac{\partial U}{\partial T}\right)_V$, termični razteznostni koeficient je $\beta = \frac{1}{V}\left(\frac{\partial V}{\partial T}\right)_p$. Iz Schwarzevega izreka za mešane odvode termodinamičnih potencialov sledijo Maxwellove relacije, na primer $\left(\frac{\partial S}{\partial V}\right)_T = \left(\frac{\partial p}{\partial T}\right)_V$ iz proste energije $A(T, V)$; z njimi spremembo entropije, ki je ne moremo meriti neposredno, izračunamo iz izmerjenih $p$, $V$ in $T$.

**Difuzija in prenos toplote.** V transportnih pojavih je gostota difuzijskega toka $\vec{j} = -D\,\nabla c$ (Fickov zakon), gostota toplotnega toka pa $-\lambda\,\nabla T$ (Fourierjev zakon). Pri načrtovanju membran, katalizatorskih zrn ali izolacije reaktorja računamo prav gradiente koncentracije in temperature.

**Prenos napak v laboratoriju.** Gostoto kroglice izračunamo iz mase in premera, $\rho = 6m/(\pi d^3)$. Po pravilu za relativne napake je $\frac{\Delta\rho}{\rho} \le \frac{\Delta m}{m} + 3\frac{\Delta d}{d}$. Napaka premera šteje trikrat, zato je pomembneje natančno izmeriti premer kot maso.

**Prilagajanje modelov meritvam.** Kinetične parametre (na primer $k$ in $c_0$ v $c = c_0e^{-kt}$) določimo z metodo najmanjših kvadratov: minimiziramo vsoto kvadratov odstopanj $S(c_0, k)$. Programi pri tem računajo parcialne odvode $\frac{\partial S}{\partial c_0}$ in $\frac{\partial S}{\partial k}$: gradientni spust se premika v smeri $-\nabla S$, Gauss-Newtonova in Levenberg-Marquardtova metoda pa uporabita še parcialne odvode modela po parametrih (Jacobijevo matriko).

## Drugače: Korak za korakom s številkami

Valj ima izmerjen polmer $r = (2{,}00 \pm 0{,}02)\,\mathrm{cm}$ in višino $h = (10{,}0 \pm 0{,}1)\,\mathrm{cm}$. Kolikšna je njegova prostornina in s kolikšno največjo napako jo poznamo?

1. **Funkcija:** $V(r, h) = \pi r^2h$, $V = \pi \cdot 4{,}00 \cdot 10{,}0\,\mathrm{cm^3} \approx 125{,}7\,\mathrm{cm^3}$.
2. **Parcialna odvoda:** $\partial V/\partial r = 2\pi rh = 2\pi \cdot 2{,}00 \cdot 10{,}0\,\mathrm{cm^2} \approx 125{,}7\,\mathrm{cm^2}$, $\partial V/\partial h = \pi r^2 \approx 12{,}57\,\mathrm{cm^2}$.
3. **Prispevka napak:** zaradi polmera $125{,}7 \cdot 0{,}02 \approx 2{,}51\,\mathrm{cm^3}$, zaradi višine $12{,}57 \cdot 0{,}1 \approx 1{,}26\,\mathrm{cm^3}$.
4. **Največja napaka:** $\Delta V \approx 2{,}51 + 1{,}26 = 3{,}77\,\mathrm{cm^3}$, kar je $3{,}0\,\%$ prostornine.
5. **Preizkus z relativnimi napakami:** $\frac{\Delta V}{V} = 2\frac{\Delta r}{r} + \frac{\Delta h}{h} = 2 \cdot 1\,\% + 1\,\% = 3\,\%$ ✓.
6. **Rezultat:** $V = (126 \pm 4)\,\mathrm{cm^3}$. Natančna vrednost pri $r = 2{,}02\,\mathrm{cm}$ in $h = 10{,}1\,\mathrm{cm}$ je $129{,}5\,\mathrm{cm^3}$, kar se z oceno $125{,}7 + 3{,}8$ dobro ujema.

## Drugače: Bolj natančno

**Parcialni odvodi brez diferenciabilnosti.** Naj bo $f(x, y) = \dfrac{xy}{x^2 + y^2}$ za $(x, y) \ne (0, 0)$ in $f(0, 0) = 0$. Na obeh oseh je $f = 0$, zato je $f_x(0, 0) = \lim_{h \to 0}\frac{f(h, 0) - f(0, 0)}{h} = 0$ in prav tako $f_y(0, 0) = 0$. Vzdolž premice $y = x$ pa je $f(x, x) = 1/2$ za vsak $x \ne 0$, zato $f$ v izhodišču ni niti zvezna in ne more biti diferenciabilna.

**Zadosten pogoj za diferenciabilnost.** Naj bosta $f_x$ in $f_y$ zvezna v okolici $(a, b)$. Spremembo razdelimo na dva koraka:

$$f(a + h, b + k) - f(a, b) = [f(a + h, b + k) - f(a, b + k)] + [f(a, b + k) - f(a, b)].$$

Po Lagrangeevem izreku je prvi oklepaj $f_x(a + \theta_1h, b + k)\,h$, drugi $f_y(a, b + \theta_2k)\,k$ za neka $\theta_1, \theta_2 \in (0, 1)$. Zaradi zveznosti je $f_x(a + \theta_1h, b + k) = f_x(a, b) + \varepsilon_1$ in $f_y(a, b + \theta_2k) = f_y(a, b) + \varepsilon_2$, kjer $\varepsilon_1, \varepsilon_2 \to 0$, ko $(h, k) \to (0, 0)$. Ostanek $\varepsilon_1h + \varepsilon_2k$ po absolutni vrednosti ni večji od $(|\varepsilon_1| + |\varepsilon_2|)\sqrt{h^2 + k^2}$, torej je $o(\sqrt{h^2 + k^2})$. $\blacksquare$

**Diferenciabilnost z $\varepsilon$-$\delta$.** Natančno: $f$ je diferenciabilna v $(a, b)$, če obstajata števili $A$, $B$, da za vsak $\varepsilon > 0$ obstaja $\delta > 0$, tako da za $0 < \sqrt{h^2 + k^2} < \delta$ velja $|f(a + h, b + k) - f(a, b) - Ah - Bk| < \varepsilon\sqrt{h^2 + k^2}$. Z izbiro $k = 0$ sledi $A = f_x(a, b)$, z izbiro $h = 0$ pa $B = f_y(a, b)$.

**Dokaz verižnega pravila.** Naj bo $f$ diferenciabilna v $(x(t), y(t))$. Za prirastek $\Delta t$ označimo $h = x(t + \Delta t) - x(t)$, $k = y(t + \Delta t) - y(t)$. Iz definicije diferenciabilnosti je $\frac{z(t + \Delta t) - z(t)}{\Delta t} = f_x\frac{h}{\Delta t} + f_y\frac{k}{\Delta t} + \frac{o(\sqrt{h^2 + k^2})}{\Delta t}$. Ko $\Delta t \to 0$, gre $h/\Delta t \to \dot{x}$, $k/\Delta t \to \dot{y}$, zadnji člen pa proti $0$, ker je $\sqrt{h^2 + k^2}/|\Delta t|$ omejen.

**Zakaj gradient kaže navzgor.** Po Cauchy-Schwarzevi neenakosti je $|\nabla f \cdot \vec{u}| \le |\nabla f|\,|\vec{u}| = |\nabla f|$, enakost pa velja natanko pri $\vec{u}$, vzporednem z $\nabla f$. Največja vrednost smernega odvoda je torej $|\nabla f|$ in jo dosežemo pri $\vec{u} = \nabla f/|\nabla f|$.

## Preveri se

? Kolikšen je parcialni odvod $\partial f/\partial x$ funkcije $f(x, y) = x^2y$?
- $x^2$
~ To je odvod po $y$.
+ $2xy$
- $2xy + x^2$
~ Člen $x^2$ je odvod po $y$; pri $\partial/\partial x$ ga ni.
> Pri odvajanju po $x$ je $y$ konstanta: $\partial(x^2y)/\partial x = 2x \cdot y$. $x^2$ je odvod po $y$.

? Kolikšen je gradient funkcije $f(x, y) = x^2 + 3xy$ v točki $(1, 2)$?
- $(2, 3)$
~ V $f_x$ manjka člen $3y = 6$.
+ $(8, 3)$
- $(8, 6)$
~ $f_y = 3x$; vstaviti moraš $x = 1$, ne $y = 2$.
> $f_x = 2x + 3y = 2 + 6 = 8$, $f_y = 3x = 3$.

? Gradient funkcije v neki točki ima dolžino $5$. Kolikšna je največja možna vrednost smernega odvoda v tej točki?
- $1$
~ $1$ je dolžina enotskega vektorja smeri, ne smernega odvoda.
- $25$
~ To je $|\nabla f|^2$; smerni odvod je $|\nabla f|\cos\varphi \le 5$.
+ $5$
> Smerni odvod je $|\nabla f|\cos\varphi$; največji je v smeri gradienta, ko je $\cos\varphi = 1$.

? Naj bo $z = x^2 + y^2$, kjer je $x = \cos t$ in $y = \sin t$. Kolikšen je $\mathrm{d}z/\mathrm{d}t$?
+ $0$
- $2$
~ $z = \cos^2 t + \sin^2 t = 1$ je konstanta.
- $4\sin t\cos t$
~ Prezrt je predznak: $\dot{x} = -\sin t$, zato se člena odštejeta.
> $\dot{z} = 2x\dot{x} + 2y\dot{y} = -2\cos t\sin t + 2\sin t\cos t = 0$. Točka se giblje po krožnici, ki je nivojnica funkcije $z$.

:::simboli
f | funkcija dveh spremenljivk | | | z = f(x, y)
x, y | neodvisni spremenljivki (koordinati točke) | | | pri implicitnem odvajanju je y = y(x)
a, b | koordinati točke (a, b), v kateri odvajamo | | |
f_x | parcialni odvod funkcije f po x | f_x = \frac{\partial f}{\partial x} | | y držimo konstanten
f_y | parcialni odvod funkcije f po y | f_y = \frac{\partial f}{\partial y} | | x držimo konstanten
h, k | prirastka spremenljivk x in y | | |
o | ostanek, ki gre proti 0 hitreje od argumenta (mali o) | | |
A, B | koeficienta linearnega dela v definiciji diferenciabilnosti | A = f_x(a, b),\ B = f_y(a, b) | |
E | ostanek linearnega približka | | | E/√(h² + k²) → 0
z | vrednost funkcije (višina nad ravnino xy) | z = f(x, y) | |
\Delta f | največja absolutna napaka rezultata | \Delta f \le \lvert f_x\rvert\,\Delta x + \lvert f_y\rvert\,\Delta y | |
\Delta x | absolutna napaka meritve x | | |
\Delta y | absolutna napaka meritve y | | |
\vec{u} | enotski vektor smeri | | | |u| = 1
\varphi | kot med gradientom in smerjo vektorja u | | |
t | parameter, od katerega sta odvisna x in y | | | pogosto čas
\dot{x} | odvod x po t | \dot{x} = \frac{\mathrm{d}x}{\mathrm{d}t} | |
\dot{y} | odvod y po t | \dot{y} = \frac{\mathrm{d}y}{\mathrm{d}t} | |
u, v | spremenljivki, od katerih sta odvisna x in y | | | x = x(u, v), y = y(u, v)
F_x | parcialni odvod funkcije F po x | F_x = \frac{\partial F}{\partial x} | | krivulja je F(x, y) = 0
F_y | parcialni odvod funkcije F po y | F_y = \frac{\partial F}{\partial y} | | pogoj: F_y ≠ 0
y' | odvod implicitno podane funkcije y(x) | y' = -\frac{F_x}{F_y} | |
T | temperatura na plošči | | °C | v zgledu T(x, y) = 100 − x² − 2y²; pri plinu v K
T_x | parcialni odvod temperature po x | T_x = \frac{\partial T}{\partial x} | °C/cm
T_y | parcialni odvod temperature po y | T_y = \frac{\partial T}{\partial y} | °C/cm
p | tlak idealnega plina | p = \frac{nRT}{V} | Pa
V | prostornina plina | | m^3
n | množina plina | | mol | tudi število spremenljivk funkcije
R | splošna plinska konstanta | | J/(mol K) | 8,314 J/(mol K)
:::
