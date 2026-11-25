---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Ana v trgovini s pohištvom izbira ogledalo za hodnik. Všeč ji je ovalno ogledalo, široko $120\,\mathrm{cm}$ in visoko $80\,\mathrm{cm}$, ki stane $149\,€$. Vrniti ga ne more, zato hoče pred nakupom obris narisati na steno in preveriti, ali se ujema s komodo. Prodajalec ji svetuje: »Vzemite dva žebljička in vrvico, pa boste narisali točno takšno elipso.« Kam naj Ana zabije žebljička in kako dolga naj bo vrvica?

Elipsa je ena od treh krivulj, ki jih skupno imenujemo **stožnice**. Ostali dve sta **hiperbola** in **parabola**. Srečaš jih tudi v trgovini z elektroniko: satelitska antena in žepna svetilka imata parabolično zrcalo. Vsaka od treh krivulj ima preprosto geometrijsko pravilo in iz njega kratko enačbo.

## Razlaga

**1. Elipsa z vrvico.** Predstavljaj si desko z dvema žebljičkoma $F_1$ in $F_2$. Na žebljička privežemo konca vrvice, svinčnik jo drži napeto in kroži okoli njiju. Vrvica se ne podaljša, zato je za vsako točko obrisa vsota razdalj do žebljičkov enaka. Žebljička sta **gorišči**, razdalji do njiju označimo z $r_1$ in $r_2$.

Za elipso s središčem v izhodišču in gorišči $F_1(-4, 0)$, $F_2(4, 0)$ izmerimo nekaj točk:

| točka | $r_1$ | $r_2$ | $r_1 + r_2$ |
|---|---|---|---|
| $(5, 0)$ | $9$ | $1$ | $10$ |
| $(0, 3)$ | $5$ | $5$ | $10$ |
| $(4;\; 1{,}8)$ | $8{,}2$ | $1{,}8$ | $10$ |
| $(-5, 0)$ | $1$ | $9$ | $10$ |

Vsota je vedno $10$. To je dolžina daljše osi elipse, ki jo imenujemo **velika os** (tudi glavna os). Njena polovica je **velika polos** $a$, tu $a = 5$. Krajša os je **mala os** (tudi stranska os), njena polovica je **mala polos** $b$, tu $b = 3$. Krajišča obeh osi so **temena**.

Zdaj poglej točko $(0, 3)$ na vrhu elipse. Od nje do gorišča je $a$, ker sta obe razdalji enaki in skupaj dasta $2a$. Razdaljo $e$ od središča do gorišča imenujemo **linearna ekscentričnost**. Točka $(0, 3)$, središče in gorišče tvorijo pravokotni trikotnik s katetama $b$ in $e$ ter hipotenuzo $a$. Po Pitagorovem izreku je $b^2 + e^2 = a^2$, torej je $e = \sqrt{a^2 - b^2}$.

Šele na koncu zapišemo pravilo s simboli. Elipsa je množica točk z $r_1 + r_2 = 2a$. Če ta pogoj zapišeš s koordinatami in dvakrat kvadriraš, dobiš enačbo elipse (preveri jo s temenom $(5, 0)$: $\frac{25}{25} + 0 = 1$):

$$\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$$

Kako sploščena je elipsa, pove **numerična ekscentričnost** $\varepsilon = \frac{e}{a}$, ki je pri elipsi med $0$ in $1$.

:::premisli
Ana žebljička približuje drug drugemu, vrvica ostane enako dolga. Kaj se dogaja z obrisom? Kaj nariše, ko žebljička stojita v isti točki?
---
Obris postaja vse bolj okrogel, $e$ in $\varepsilon$ se manjšata. Ko se žebljička združita, je $e = 0$ in $b = a$: nariše krožnico s polmerom $a$. Krožnica je posebna elipsa.
:::

**2. Hiperbola z razliko.** Spet imamo dve gorišči, a zdaj zahtevamo, da je stalna **razlika** razdalj. Za hiperbolo z gorišči $F_1(-5, 0)$ in $F_2(5, 0)$ in razliko $8$:

| točka | $r_1$ | $r_2$ | razlika |
|---|---|---|---|
| $(4, 0)$ | $9$ | $1$ | $8$ |
| $(5; 2{,}25)$ | $10{,}25$ | $2{,}25$ | $8$ |
| $(8, \sqrt{27})$ | $14$ | $6$ | $8$ |

Točke, ki so bližje $F_2$, tvorijo desno vejo. Na levi je zrcalna veja točk, bližjih $F_1$. Hiperbola ima torej **dve veji**. Razlika je $2a$, tu $a = 4$, temeni sta $(\pm 4, 0)$; $a$ je **realna polos**. Gorišči sta tokrat dlje od središča kot temeni, zato zveza obrne predznak: $e^2 = a^2 + b^2$, torej $e = \sqrt{a^2 + b^2}$. Število $b$ imenujemo **imaginarna polos**: ni razdalja do točke na krivulji, ampak ga določa ta zveza. Tu je $b = \sqrt{25 - 16} = 3$.

Veji se oddaljujeta in se vse bolj približujeta dvema premicama skozi središče, **asimptotama** $y = \pm \frac{b}{a} x$. Narišeš ju kot diagonali pravokotnika s stranicama $2a$ in $2b$ okoli središča. Enačba hiperbole je

$$\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$$

Graf funkcije $y = \frac{12}{x}$ iz racionalnih funkcij je tudi hiperbola, le zasukana: asimptoti sta koordinatni osi. Če imaš $12\,€$ in je cena kosa $x$ evrov, lahko kupiš $\frac{12}{x}$ kosov. Dražji kos, manj kosov.

:::premisli
Pojasni brez formul za $e$: zakaj je pri elipsi $e < a$, pri hiperboli pa $e > a$?
---
V trikotniku $F_1 T F_2$ je vsaka stranica krajša od vsote drugih dveh in daljša od njune razlike. Pri elipsi je zato $2a = r_1 + r_2 > 2e$. Pri hiperboli je $2a = |r_1 - r_2| < 2e$.
:::

**3. Parabola z vodnico.** Parabola ima eno gorišče $F$ in eno premico, **vodnico**. Njene točke so od gorišča in od vodnice enako oddaljene. Za gorišče $F(1, 0)$ in vodnico $x = -1$:

| točka | do $F$ | do vodnice |
|---|---|---|
| $(0, 0)$ | $1$ | $1$ |
| $(1, 2)$ | $2$ | $2$ |
| $(4, 4)$ | $5$ | $5$ |
| $(9, 6)$ | $10$ | $10$ |

Točka $(0, 0)$ je **teme**, točno na sredi med goriščem in vodnico. Razdaljo med goriščem in vodnico označimo s $p$. Gorišče je v točki $\left(\frac{p}{2}, 0\right)$, vodnica je premica $x = -\frac{p}{2}$. Enačba parabole z osjo na osi $x$ je

$$y^2 = 2px$$

V tabeli je $p = 2$, zato velja $y^2 = 4x$. Če parabolo zasučeš, da je os navpična, dobiš $x^2 = 2py$, torej znani graf kvadratne funkcije $y = \frac{x^2}{2p}$.

Parabola se lahko odpira v štiri smeri. Kvadrirana spremenljivka pove os: pri $y^2$ je os parabole os $x$, pri $x^2$ os $y$. Brez minusa pred $2p$ je parabola odprta v desno oziroma navzgor, minus obrne smer v levo oziroma navzdol. Število $p > 0$ je še vedno razdalja med goriščem in vodnico.

| enačba | gorišče | vodnica |
|---|---|---|
| $y^2 = 2px$ | $\left(\frac{p}{2}, 0\right)$ | $x = -\frac{p}{2}$ |
| $y^2 = -2px$ | $\left(-\frac{p}{2}, 0\right)$ | $x = \frac{p}{2}$ |
| $x^2 = 2py$ | $\left(0, \frac{p}{2}\right)$ | $y = -\frac{p}{2}$ |
| $x^2 = -2py$ | $\left(0, -\frac{p}{2}\right)$ | $y = \frac{p}{2}$ |

Graf $y = -\frac{x^2}{8}$ zapišemo kot $x^2 = -8y$: parabola je odprta navzdol, $2p = 8$, torej $p = 4$. Gorišče je $(0, -2)$, vodnica $y = 2$. Preizkus s točko $(4, -2)$: do gorišča je $4$, do vodnice $2 - (-2) = 4$.

Žarki, vzporedni z osjo, se na paraboli odbijejo v gorišče. Zato je sprejemnik satelitske antene v gorišču, žarnica žarometa pa v gorišču pošilja vzporeden snop.

**4. Pregled na eni sliki.**

- elipsa, $r_1 + r_2 = 2a$: $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$
- hiperbola, $\lvert r_1 - r_2\rvert = 2a$: $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$
- parabola, do $F$ = do vodnice: $y^2 = 2px$

V simulaciji spodaj »Elipsa, hiperbola in parabola« izberi elipso in povleci točko $T$ po obrisu. Opazuj vsoto $r_1 + r_2$: ostane enaka. Nato nastavi $b = a$ in poglej, kaj postane elipsa.

**5. Krivulje drugega reda.** V enačbah krožnice, elipse, hiperbole in parabole nastopata $x$ in $y$ največ na drugo potenco. Zato stožnicam rečemo tudi **krivulje drugega reda**. Njihov splošni algebrski zapis je enačba druge stopnje

$$Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0$$

kjer vsaj eno od števil $A$, $B$, $C$ ni $0$. Člen $Bxy$ nastopi le pri zasukanih oseh, na primer pri hiperboli $xy = 12$, ki je graf $y = \frac{12}{x}$. Pri elipsi in hiperboli člena $Dx$ in $Ey$ premakneta središče (naslednja lekcija). Pri $B = 0$ in središču oziroma temenu v izhodišču vrsto krivulje prebereš iz kvadratov:

- $x^2$ in $y^2$ z enakima predznakoma: elipsa (na primer $4x^2 + 9y^2 - 36 = 0$), pri $A = C$ krožnica;
- $x^2$ in $y^2$ z nasprotnima predznakoma: hiperbola (na primer $9x^2 - 16y^2 - 144 = 0$);
- en kvadrat in linearni člen druge spremenljivke: parabola (na primer $y^2 - 4x = 0$).

Krivulje ne da vsaka taka enačba: $x^2 + y^2 + 4 = 0$ nima nobene točke, $x^2 + y^2 = 0$ je le točka $(0, 0)$, $x^2 - y^2 = 0$ sta premici $y = \pm x$.

**6. Konstrukcija s šestilom (višja raven).** Točke stožnice dobiš iz definicije z ravnilom in šestilom.

- Elipsa (gorišči $F_1$, $F_2$, vsota $2a$): izberi polmer $r$ med $a - e$ in $a + e$. Loka okoli $F_1$ s polmerom $r$ in okoli $F_2$ s polmerom $2a - r$ se sekata v dveh točkah elipse.
- Hiperbola (razlika $2a$): izberi $r > e - a$. Loka okoli $F_2$ s polmerom $r$ in okoli $F_1$ s polmerom $r + 2a$ dasta dve točki desne veje. Z zamenjanima goriščema dobiš levo vejo.
- Parabola (gorišče $F$, vodnica): na strani gorišča nariši vzporednico vodnice na razdalji $r > \frac{p}{2}$. Lok okoli $F$ s polmerom $r$ jo seka v dveh točkah parabole.

Z več polmeri dobiš dovolj točk, ki jih povežeš z gladko krivuljo.

**7. Risanje z računalnikom (višja raven).** Brezplačna programa GeoGebra in Desmos narišeta stožnico kar iz enačbe.

- V vnosno vrstico vpiši enačbo, na primer »x^2/16 - y^2/9 = 1«. Strešica pomeni potenco, poševnica ulomek.
- Pri »x^2/a^2 + y^2/b^2 = 1« program ponudi drsnika za $a$ in $b$. Opazuj, kako se elipsa splošči ali pri $a = b$ postane krožnica.
- GeoGebra nariše stožnico tudi iz gorišč in polosi $a$ oziroma iz gorišča in vodnice $v$: »Elipsa(F_1, F_2, 5)«, »Hiperbola(F_1, F_2, 4)«, »Parabola(F, v)« (angleško Ellipse, Hyperbola, Parabola).
- Klik na presečišče dveh krivulj izpiše njegove koordinate.

Program je za preverjanje in raziskovanje; postopek moraš znati zapisati sam.

## Rešeni primeri

### Primer 1: elipsa iz enačbe

Za elipso $\frac{x^2}{25} + \frac{y^2}{9} = 1$ določi polosi, temena, gorišči in numerično ekscentričnost.

**Podatki:** enačba $\frac{x^2}{25} + \frac{y^2}{9} = 1$
**Iščemo:** $a$, $b$, temena, gorišči, $\varepsilon$

:::formula
$\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$, $e = \sqrt{a^2 - b^2}$, $\varepsilon = \frac{e}{a}$
:::

**Rešitev:**

1. Pod $x^2$ je $a^2 = 25$, zato $a = 5$. Pod $y^2$ je $b^2 = 9$, zato $b = 3$.
2. Večji imenovalec je pod $x^2$, zato glavna os leži na osi $x$. Temena so $(\pm 5, 0)$ in $(0, \pm 3)$.
3. Linearna ekscentričnost: $e = \sqrt{25 - 9} = 4$. Gorišči sta $F_1(-4, 0)$ in $F_2(4, 0)$.
4. Numerična ekscentričnost: $\varepsilon = \frac{4}{5} = 0{,}8$.
5. Odgovor: $a = 5$, $b = 3$, gorišči $(\pm 4, 0)$, $\varepsilon = 0{,}8$. To je elipsa iz tabele v razlagi.

### Primer 2: hiperbola in njeni asimptoti

Za hiperbolo $\frac{x^2}{16} - \frac{y^2}{9} = 1$ določi temeni, gorišči in asimptoti.

**Podatki:** enačba $\frac{x^2}{16} - \frac{y^2}{9} = 1$
**Iščemo:** temeni, gorišči, enačbi asimptot

:::formula
$\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$, $e = \sqrt{a^2 + b^2}$, asimptoti $y = \pm \frac{b}{a} x$
:::

**Rešitev:**

1. $a^2 = 16$ in $b^2 = 9$, torej $a = 4$, $b = 3$.
2. Pozitiven je člen z $x^2$, zato se veji odpirata levo in desno. Temeni sta $(\pm 4, 0)$.
3. Pri hiperboli seštevamo: $e = \sqrt{16 + 9} = 5$. Gorišči sta $(\pm 5, 0)$.
4. Asimptoti imata naklon $\pm \frac{b}{a} = \pm \frac{3}{4}$.
5. Odgovor: temeni $(\pm 4, 0)$, gorišči $(\pm 5, 0)$, asimptoti $y = \frac{3}{4} x$ in $y = -\frac{3}{4} x$.

### Primer 3 (težji): Anino ogledalo

Ogledalo iz uvoda je elipsa, široka $120\,\mathrm{cm}$ in visoka $80\,\mathrm{cm}$. Ana želi obris narisati na steno z vrvico in dvema žebljičkoma. Postavi koordinatni sistem s središčem v sredini ogledala, enote so centimetri. Zapiši enačbo elipse. Kako daleč narazen naj zabije žebljička in kako dolga naj bo vrvica med njima prek svinčnika?

**Podatki:** širina $120\,\mathrm{cm}$, višina $80\,\mathrm{cm}$, središče v izhodišču
**Iščemo:** enačbo elipse, razdaljo med goriščema $2e$, dolžino vrvice $2a$

:::formula
$a$ in $b$ sta polovici širine in višine; $e = \sqrt{a^2 - b^2}$; vsota razdalj do gorišč je $2a$.
:::

**Rešitev:**

1. Polosi: $a = \frac{120}{2} = 60$ in $b = \frac{80}{2} = 40$, v centimetrih.
2. Enačba: $\frac{x^2}{3600} + \frac{y^2}{1600} = 1$, ker je $60^2 = 3600$ in $40^2 = 1600$.
3. Linearna ekscentričnost: $e = \sqrt{3600 - 1600} = \sqrt{2000} \approx 44{,}7$, v centimetrih.
4. Žebljička sta na glavni osi, vsak $44{,}7\,\mathrm{cm}$ od središča. Razdalja med njima je $2e \approx 89{,}4\,\mathrm{cm}$.
5. Vsota razdalj od svinčnika do obeh žebljičkov je $2a = 120\,\mathrm{cm}$.
6. Odgovor: žebljička zabije $89{,}4\,\mathrm{cm}$ narazen, simetrično glede na sredino; vrvica od žebljička prek svinčnika do drugega žebljička je dolga $120\,\mathrm{cm}$, enako kot širina ogledala.

### Primer 4 – zdaj ti: satelitska antena

Marko je kupil satelitsko anteno s premerom $80\,\mathrm{cm}$ in globino $10\,\mathrm{cm}$. Njen prerez je parabola. Na kolikšni razdalji od temena mora biti sprejemnik?

**Podatki:** premer $80\,\mathrm{cm}$, globina $10\,\mathrm{cm}$
**Iščemo:** razdaljo gorišča od temena $\frac{p}{2}$

:::formula
$y^2 = 2px$, gorišče $F\left(\frac{p}{2}, 0\right)$
:::

**Rešitev:**

1. Teme postavimo v izhodišče, os antene na os $x$.
2. Rob antene je $10\,\mathrm{cm}$ globoko in $40\,\mathrm{cm}$ od osi (pol premera), zato točka $(10, 40)$ leži na paraboli.
3. Vstavimo v enačbo: $40^2 = 2p \cdot 10$, to je enačba $1600 = 20p$.
4. Izračunaj $p$ in nato $\frac{p}{2}$.

:::premisli
Kje je sprejemnik?
---
$p = \frac{1600}{20} = 80$, gorišče je pri $\frac{p}{2} = 40$. Sprejemnik mora biti $40\,\mathrm{cm}$ pred temenom, na osi antene.
:::

### Primer 5 (višja raven): hiperbola s šestilom

Hiperbolo z goriščema $F_1(-5, 0)$ in $F_2(5, 0)$ ter razliko razdalj $8$ konstruiraj po točkah. Za polmer vzemi $r = 6$. Izračunaj koordinati dobljenih točk in preveri, da ležita na hiperboli $\frac{x^2}{16} - \frac{y^2}{9} = 1$.

**Podatki:** $F_1(-5, 0)$, $F_2(5, 0)$, $2a = 8$, $r = 6$
**Iščemo:** polmera lokov in točki $T_1$, $T_2$

:::formula
$r_2 = r$, $r_1 = r + 2a$, pogoj $r > e - a$; krožnica s središčem $F_2$: $(x - 5)^2 + y^2 = r_2^2$
:::

**Rešitev:**

1. Pogoj: $e - a = 5 - 4 = 1$ in $6 > 1$, zato se loka sekata.
2. Okoli $F_2$ zarišemo lok s polmerom $6$, okoli $F_1$ lok s polmerom $6 + 8 = 14$. Za presečišči je $r_1 - r_2 = 14 - 6 = 8$, zato ležita na desni veji.
3. Račun: enačbi krožnic $(x - 5)^2 + y^2 = 36$ in $(x + 5)^2 + y^2 = 196$ odštejemo in dobimo $20x = 160$, torej $x = 8$.
4. Iz prve enačbe: $y^2 = 36 - 9 = 27$, zato $y = \pm\sqrt{27} \approx \pm 5{,}20$.
5. Preizkus: $\frac{64}{16} - \frac{27}{9} = 4 - 3 = 1$. Točki ležita na hiperboli.
6. Z računalnikom: v GeoGebro vpiši hiperbolo in obe krožnici. Klik na presečišče pokaže $(8;\; 5{,}2)$.

:::risba graf
opis: Hiperbola x²/16 − y²/9 = 1 z goriščema F₁(−5, 0) in F₂(5, 0). Okoli F₂ je zarisan oranžen lok s polmerom 6, okoli F₁ zelen lok s polmerom 14. Loka se sekata v točkah T₁(8; 5,20) in T₂(8; −5,20) na desni veji. Črtkani daljici povezujeta T₁ z goriščema, dolgi sta 14 in 6.
x: -6 .. 10 | 1 | x
y: -7 .. 7 | 1 | y
enako: da
f: 3/4*sqrt(x^2 - 16) | modra debelo | 4 .. 10
f: -3/4*sqrt(x^2 - 16) | modra debelo | 4 .. 10
f: 3/4*sqrt(x^2 - 16) | modra debelo | -6 .. -4
f: -3/4*sqrt(x^2 - 16) | modra debelo | -6 .. -4
f: sqrt(36 - (x - 5)^2) | oranžna | 6,5 .. 9,5
f: -sqrt(36 - (x - 5)^2) | oranžna | 6,5 .. 9,5
f: sqrt(196 - (x + 5)^2) | zelena | 7,5 .. 9
f: -sqrt(196 - (x + 5)^2) | zelena | 7,5 .. 9
črta: -5; 0 -> 8; 5,196 | siva črtkano
črta: 5; 0 -> 8; 5,196 | siva črtkano
napis: 1,5; 2,6 | 14 | nad
napis: 6,5; 2,6 | 6 | desno
točka: -5; 0 | F_1 | pod
točka: 5; 0 | F_2 | pod
točka: 8; 5,196 | T_1 | desno
točka: 8; -5,196 | T_2 | desno
:::

7. Odgovor: loka s polmeroma $6$ (okoli $F_2$) in $14$ (okoli $F_1$) dasta točki $T_1(8;\; 5{,}20)$ in $T_2(8;\; -5{,}20)$.

## Pogoste napake

- **Imenovalec namesto polosi.** Pri $\frac{x^2}{25} + \frac{y^2}{9} = 1$ nekdo vzame $a = 25$. Pod $x^2$ je $a^2$, zato je $a = \sqrt{25} = 5$.
- **Zamenjana zveza za $e$.** Pri elipsi odštevaš ($e^2 = a^2 - b^2$, gorišči sta znotraj), pri hiperboli seštevaš ($e^2 = a^2 + b^2$, gorišči sta zunaj temen). Kdor zamenja, dobi gorišči elipse zunaj krivulje, kar ne more biti.
- **Obrnjen naklon asimptot.** Pri $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$ sta asimptoti $y = \pm \frac{b}{a} x$. Kdor napiše $\frac{a}{b}$, dobi premici, ki se ne ujemata z diagonalama pravokotnika $2a \times 2b$.
- **Gorišče parabole pri $p$.** Pri $y^2 = 2px$ je gorišče v $\left(\frac{p}{2}, 0\right)$, ne v $(p, 0)$. Pri $y^2 = 6x$ je $2p = 6$, $p = 3$, gorišče pri $1{,}5$.
- **Glavna os vedno na osi $x$.** Pri $\frac{x^2}{9} + \frac{y^2}{25} = 1$ je večji imenovalec pod $y^2$, zato sta gorišči na osi $y$.

## Povzetek

**Elipsa:** vsota razdalj do gorišč je $2a$.

$$\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$$

- $e = \sqrt{a^2 - b^2}$; **numerična ekscentričnost** $\varepsilon = \frac{e}{a}$ je med $0$ in $1$.
- Pri $a = b$ je elipsa krožnica.

**Hiperbola:** absolutna razlika razdalj do gorišč je $2a$; ima dve veji.

$$\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$$

- $e = \sqrt{a^2 + b^2}$, asimptoti $y = \pm \frac{b}{a} x$.

**Parabola:** točke so enako oddaljene od gorišča in vodnice.

$$y^2 = 2px$$

- Gorišče $\left(\frac{p}{2}, 0\right)$, vodnica $x = -\frac{p}{2}$.
- Odprta v levo: $y^2 = -2px$; navzgor ali navzdol: $x^2 = \pm 2py$.

**Stožnice** so krivulje drugega reda:

$$Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0$$

- **Polosi** preberi kot korena imenovalcev; večji imenovalec pove, na kateri osi sta gorišči elipse.
- Graf $y = \frac{c}{x}$ je zasukana hiperbola, graf kvadratne funkcije je parabola.

**Risanje** (višja raven):

- Po točkah: loka iz gorišč s polmeroma $r$ in $2a - r$ (elipsa) ali $r$ in $r + 2a$ (hiperbola).
- GeoGebra in Desmos rišeta iz enačbe.

## Ponovitev

**Formule**
- $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$, $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$ (na pamet)
- Elipsa: $e^2 = a^2 - b^2$, $\varepsilon = \frac{e}{a}$ (priloga)
- Hiperbola: $e^2 = a^2 + b^2$, $\varepsilon = \frac{e}{a}$ (priloga)
- Asimptoti hiperbole: $y = \pm \frac{b}{a} x$ (na pamet)
- $y^2 = 2px$: gorišče $\left(\frac{p}{2}, 0\right)$, vodnica $x = -\frac{p}{2}$ (priloga)

**Postopek**
1. Polosi preberi kot korena imenovalcev.
2. Večji imenovalec elipse pove, na kateri osi sta gorišči.
3. Zapiši temena, na primer $(\pm a, 0)$ in $(0, \pm b)$.
4. Izračunaj $e$ in gorišči, nato $\varepsilon = \frac{e}{a}$.
5. Pri hiperboli vriši asimptoti, pri paraboli gorišče in vodnico.

**Pazi na**
- Pod $x^2$ je $a^2$: pri $25$ je $a = 5$, ne $25$.
- Elipsa odšteva ($e^2 = a^2 - b^2$), hiperbola sešteva ($e^2 = a^2 + b^2$).
- Gorišče parabole $y^2 = 2px$ je v $\left(\frac{p}{2}, 0\right)$, ne v $(p, 0)$.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Parabola s temenom v izhodišču in osjo na osi $x$ poteka skozi točko $A(2, -4)$. Zapišite njeno enačbo, koordinati gorišča in enačbo vodnice.

**Rešitev:**

1. Enačba ima obliko $y^2 = 2px$. Vstavimo točko $A$: $(-4)^2 = 2p \cdot 2$, torej $16 = 4p$ in $p = 4$.
2. Enačba parabole je $y^2 = 8x$.
3. Gorišče je $F\left(\frac{p}{2}, 0\right) = F(2, 0)$, vodnica je premica $x = -\frac{p}{2} = -2$.
4. Preizkus: točka $A$ je od gorišča oddaljena $4$, od vodnice pa $2 - (-2) = 4$.
5. Odgovor: parabola $y^2 = 8x$, gorišče $F(2, 0)$, vodnica $x = -2$.

**Točkovanje:** 1 točka za $p = 4$, 1 točka za enačbo $y^2 = 8x$, 1 točka za gorišče in vodnico.

### Naloga 2: krajša strukturirana naloga, 7 točk, pola 2 (z računalom)

Umetni satelit kroži okoli Zemlje po elipsi, središče Zemlje je v enem od njenih gorišč. Najmanjša oddaljenost satelita od središča Zemlje je $7000\,\mathrm{km}$, največja pa $13\,000\,\mathrm{km}$. Koordinatni sistem postavite tako, da je središče elipse v izhodišču, velika os na osi $x$ in središče Zemlje v gorišču $F_2$ na pozitivnem delu osi $x$. Enota je $1000\,\mathrm{km}$.

a) Izračunajte veliko polos $a$, linearno ekscentričnost $e$ in numerično ekscentričnost $\varepsilon$ tira. (3 točke)
b) Izračunajte malo polos $b$, zaokroženo na dve decimalni mesti, in zapišite enačbo tira. (2 točki)
c) Koliko je satelit oddaljen od središča Zemlje v trenutku, ko je zveznica med satelitom in središčem Zemlje pravokotna na veliko os? Rezultat zapišite v kilometrih. (2 točki)

**Rešitev:**

1. a) Najmanjša in največja oddaljenost od gorišča sta razdalji do temen na veliki osi: $a - e = 7$ in $a + e = 13$.
2. a) Seštejemo: $2a = 20$, torej $a = 10$ (to je $10\,000\,\mathrm{km}$), in $e = 13 - 10 = 3$ (to je $3000\,\mathrm{km}$).
3. a) Numerična ekscentričnost: $\varepsilon = \frac{e}{a} = \frac{3}{10} = 0{,}3$.
4. b) Iz $e^2 = a^2 - b^2$ sledi $b = \sqrt{a^2 - e^2} = \sqrt{100 - 9} = \sqrt{91} = 9{,}539\ldots \approx 9{,}54$, torej približno $9540\,\mathrm{km}$.
5. b) Enačba tira: $\frac{x^2}{100} + \frac{y^2}{91} = 1$.
6. c) Središče Zemlje je v $F_2(3, 0)$, zato ima satelit tedaj absciso $x = 3$. Vstavimo: $\frac{9}{100} + \frac{y^2}{91} = 1$, torej $y^2 = 91 \cdot 0{,}91 = 82{,}81$ in $|y| = 9{,}1$.
7. c) Preizkus z definicijo elipse: razdalja do $F_1(-3, 0)$ je $\sqrt{6^2 + 82{,}81} = \sqrt{118{,}81} = 10{,}9$, vsota razdalj je $10{,}9 + 9{,}1 = 20 = 2a$.
8. Odgovor: a) $a = 10\,000\,\mathrm{km}$, $e = 3000\,\mathrm{km}$, $\varepsilon = 0{,}3$; b) $b \approx 9{,}54$ (približno $9540\,\mathrm{km}$), enačba $\frac{x^2}{100} + \frac{y^2}{91} = 1$; c) satelit je od središča Zemlje oddaljen $9100\,\mathrm{km}$.

**Točkovanje:** a) 1 točka za zvezi $a - e = 7$ in $a + e = 13$ (ali utemeljitev, da je $2a = 7 + 13$), 1 točka za $a$ in $e$, 1 točka za $\varepsilon = 0{,}3$; b) 1 točka za $b = \sqrt{91}$, pravilno zaokroženo na dve decimalni mesti, 1 točka za enačbo tira; c) 1 točka za vstavitev $x = 3$ v enačbo tira, 1 točka za rezultat $9100\,\mathrm{km}$.

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Radijski svetilnik $A(-4, 0)$ stoji na obali, ki poteka po premici $x = -4$, svetilnik $B(4, 0)$ pa na otoku. Enota je kilometer. Ladja iz razlike časov prihoda signalov ugotovi, da je od svetilnika $A$ za $4\,\mathrm{km}$ bolj oddaljena kot od svetilnika $B$.

a) Utemeljite, da ladja leži na hiperboli z goriščema $A$ in $B$. Zapišite enačbo hiperbole in povejte, na kateri veji leži ladja. (3 točke)
b) Ladja pluje po premici $y = x + 2$. Izračunajte, kje je ladja, in utemeljite, zakaj ena od rešitev sistema ne ustreza. (4 točke)
c) Ribolov je dovoljen v območju točk, ki so bližje svetilniku $B$ kot obali. Zapišite enačbo meje tega območja in utemeljite, ali ladja sme loviti ribe. (3 točke)

**Rešitev:**

1. a) Za lego ladje $T$ velja $r_1 - r_2 = 4$, kjer je $r_1 = |TA|$ in $r_2 = |TB|$. Razlika razdalj do dveh stalnih točk je stalna, zato $T$ leži na hiperboli z goriščema $A$ in $B$.
2. a) Iz $2a = 4$ sledi $a = 2$. Gorišči sta $4$ od središča, zato $e = 4$ in $b^2 = e^2 - a^2 = 16 - 4 = 12$. Enačba je $\frac{x^2}{4} - \frac{y^2}{12} = 1$.
3. a) Ladja je bližje svetilniku $B$, zato leži na desni veji ($x \ge 2$).
4. b) Enačbo hiperbole pomnožimo z $12$ in vstavimo $y = x + 2$: $3x^2 - (x + 2)^2 = 12$, torej $2x^2 - 4x - 16 = 0$ oziroma $x^2 - 2x - 8 = 0$.
5. b) Razstavimo: $(x - 4)(x + 2) = 0$. Rešitvi sistema sta $(4, 6)$ in $(-2, 0)$.
6. b) Točka $(-2, 0)$ je teme leve veje: od $A$ je oddaljena $2$, od $B$ pa $6$, torej je bližje $A$. Enačba hiperbole opisuje obe veji ($|r_1 - r_2| = 4$), pogoju $r_1 - r_2 = 4$ pa ta točka ne ustreza.
7. b) Za točko $(4, 6)$: $r_1 = \sqrt{8^2 + 6^2} = 10$ in $r_2 = \sqrt{0^2 + 6^2} = 6$, razlika je $4$. Ladja je v točki $(4, 6)$.
8. c) Meja območja so točke, ki so enako oddaljene od $B$ in od obale: to je parabola z goriščem $B(4, 0)$ in vodnico $x = -4$. Razdalja med goriščem in vodnico je $p = 8$, teme je na sredini, v izhodišču. Enačba meje je $y^2 = 16x$.
9. c) Ladja je od svetilnika $B$ oddaljena $6\,\mathrm{km}$, od obale pa $4 - (-4) = 8\,\mathrm{km}$. Ker je $6 < 8$, je v območju ribolova (enakovredno: $6^2 = 36 < 16 \cdot 4 = 64$).
10. Odgovor: a) $\frac{x^2}{4} - \frac{y^2}{12} = 1$, desna veja; b) ladja je v točki $(4, 6)$; c) meja območja je parabola $y^2 = 16x$, ladja sme loviti ribe.

**Točkovanje:** a) 1 točka za utemeljitev z razliko razdalj, 1 točka za $a = 2$ in $b^2 = 12$ z enačbo hiperbole, 1 točka za desno vejo; b) 1 točka za kvadratno enačbo po vstavljanju, 1 točka za obe rešitvi sistema, 1 točka za utemeljitev, da točka $(-2, 0)$ ne ustreza, 1 točka za lego ladje $(4, 6)$; c) 1 točka za prepoznano parabolo z goriščem $B$ in vodnico $x = -4$, 1 točka za enačbo $y^2 = 16x$, 1 točka za utemeljen sklep.

### Ustno vprašanje 1

:::premisli
Definiraj hiperbolo kot množico točk ravnine ter zapiši njeno enačbo v središčni legi in enačbi asimptot.
---
Hiperbola je množica točk ravnine, za katere je absolutna vrednost razlike razdalj do dveh stalnih točk, gorišč $F_1$ in $F_2$, enaka $2a$. Pri tem je $2a$ pozitivno in manjše od razdalje med goriščema. Če gorišči ležita na osi $x$ simetrično glede na izhodišče, je enačba hiperbole $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$, kjer je $e$ razdalja gorišča od središča in velja $e^2 = a^2 + b^2$. Asimptoti sta premici $y = \pm\frac{b}{a}x$, ki se jima veji hiperbole vse bolj približujeta.
:::

### Ustno vprašanje 2

:::premisli
Utemelji zvezo med polosema $a$, $b$ in linearno ekscentričnostjo $e$ elipse ter pojasni, kdaj je elipsa krožnica.
---
Teme na mali osi je enako oddaljeno od obeh gorišč. Ker je vsota razdalj do gorišč enaka $2a$, je vsaka od teh razdalj enaka $a$. To teme, središče in gorišče tvorijo pravokotni trikotnik s katetama $b$ in $e$ ter hipotenuzo $a$, zato po Pitagorovem izreku velja $a^2 = b^2 + e^2$. Ko je $e = 0$, gorišči sovpadeta s središčem, velja $b = a$ in elipsa je krožnica s polmerom $a$.
:::

### Ustno vprašanje 3

:::premisli
Navedi primer uporabe parabole v tehniki in pojasni, katero lastnost parabole izkorišča.
---
Primer je satelitska antena, katere prerez je parabola. Žarki, ki so vzporedni z osjo parabole, se na paraboli odbijejo v gorišče. Zato je sprejemnik postavljen v gorišče, kjer se zbere ves signal. Isto lastnost v obratni smeri izkorišča žaromet: svetilo v gorišču pošilja vzporeden snop svetlobe.
:::

## Drugače: Z analogijo

Misli na denar. Imaš $10\,€$ za dve stvari, porabiti moraš vse. Več kot daš za eno, manj ostane za drugo, vsota je stalna. Elipsa je takšen proračun za razdalje: vsota $r_1 + r_2$ je vedno $2a$. Ko se svinčnik približa enemu žebljičku, se od drugega oddalji.

Hiperbola je kot razlika v ceni med dvema trgovinama: v trgovini A je izdelek vedno za $8\,€$ dražji kot v trgovini B, ne glede na to, koliko stane. Stalna je razlika $r_1 - r_2$, ne vsota.

Parabola je kot pošten delilec, ki stoji enako daleč od dveh strank. Ena stranka je točka (gorišče), druga je premica (vodnica). Vsaka točka parabole je enako oddaljena od obeh.

## Drugače: Iz vsakdanjega življenja

Prižgi žepno svetilko in jo usmeri v steno. Svetloba tvori stožec, osvetljena lisa pa je presek stožca s steno. Od tod ime stožnice.

- Svetilka pravokotno na steno: lisa je krog.
- Svetilko malo nagneš: lisa se raztegne v elipso.
- Nagneš jo tako, da je rob stožca vzporeden s steno: lisa je parabola, na eni strani odprta.
- Nagneš še bolj: lisa je ena veja hiperbole.

Elipse najdeš v orbitah planetov (Sonce je v enem gorišču) in v ovalnih ogledalih. Parabole so v satelitskih antenah, avtomobilskih žarometih in pri metu žoge. Hiperbolo vidiš kot rob svetlobe, ki jo svetilka z okroglim senčnikom vrže na steno nad seboj in pod seboj.

## Preveri se

? Katero krivuljo opisuje enačba $4x^2 + 9y^2 = 36$ in kolikšni sta njeni polosi?
- Elipsa z $a = 9$ in $b = 4$
~ $9$ in $4$ sta imenovalca $a^2$ in $b^2$. Polosi sta njuna korena.
- Hiperbola z $a = 3$ in $b = 2$
~ Člena sta prišteta, ne odšteta: stalna je vsota razdalj, zato je to elipsa.
+ Elipsa z $a = 3$ in $b = 2$
- Elipsa z $a = 2$ in $b = 3$
~ Po deljenju s $36$ je pod $x^2$ imenovalec $9$, ne $4$: $a = 3$ leži na osi $x$.
> Delimo s $36$: $\frac{x^2}{9} + \frac{y^2}{4} = 1$, torej elipsa z $a = \sqrt{9} = 3$ in $b = \sqrt{4} = 2$.

? Kje sta gorišči elipse $\frac{x^2}{169} + \frac{y^2}{25} = 1$?
- $(\pm 13{,}9;\; 0)$
~ To je $\sqrt{169 + 25}$, zveza za hiperbolo. Pri elipsi odštevaš.
+ $(\pm 12, 0)$
- $(\pm 144, 0)$
~ $144$ je $e^2$. Gorišče je pri $e$, koren še manjka.
- $(\pm 13, 0)$
~ $13$ je velika polos $a$, to sta temeni, ne gorišči.
> $e = \sqrt{169 - 25} = \sqrt{144} = 12$, gorišči sta $(\pm 12, 0)$.

? Velika polos elipse ostane enaka, mala polos $b$ pa raste proti $a$. Kaj se zgodi?
- Gorišči se oddaljujeta od središča.
~ $e = \sqrt{a^2 - b^2}$ se z večjim $b$ manjša, gorišči se približujeta.
+ $\varepsilon$ se manjša proti $0$, elipsa je vse bolj podobna krožnici.
- $\varepsilon$ raste proti $1$, elipsa je vse bolj sploščena.
~ Sploščena postane, ko se $b$ manjša. Večji $b$ jo naredi bolj okroglo.
> Večji $b$ pomeni manjši $e$, zato je $\varepsilon = \frac{e}{a}$ manjši. Pri $b = a$ je $\varepsilon = 0$ in elipsa je krožnica.

? Za hiperbolo $\frac{x^2}{9} - \frac{y^2}{16} = 1$ je Tina zapisala: (1) $a = 3$, $b = 4$; (2) $e = \sqrt{9 + 16} = 5$; (3) gorišči $(\pm 5, 0)$; (4) asimptoti $y = \pm \frac{3}{4} x$. Kateri korak je napačen?
- Korak 1
~ $a^2 = 9$ in $b^2 = 16$, polosi sta pravilno $3$ in $4$.
- Korak 2
~ Pri hiperboli seštevamo, $\sqrt{25} = 5$ je pravilno.
- Korak 3
~ Gorišči sta na osi $x$ pri $\pm e$, kar je pravilno.
+ Korak 4
> Naklon asimptot je $\frac{b}{a} = \frac{4}{3}$, ne $\frac{3}{4}$. Pravilno: $y = \pm \frac{4}{3} x$.

? Žepna svetilka iz trgovine ima zrcalo s prerezom $y^2 = 6x$ (v centimetrih). Kam mora proizvajalec postaviti žarnico, da svetilka sveti v vzporednem snopu?
- $3\,\mathrm{cm}$ od temena
~ $3$ je $p$. Gorišče je pri polovici, $\frac{p}{2}$.
- $6\,\mathrm{cm}$ od temena
~ $6$ je $2p$, koeficient v enačbi, ne lega gorišča.
+ $1{,}5\,\mathrm{cm}$ od temena, na osi zrcala
- V teme zrcala
~ Iz temena bi se žarki razpršili. Vzporeden snop dobiš le iz gorišča.
> Iz $2p = 6$ je $p = 3$, gorišče je pri $\frac{p}{2} = 1{,}5$, torej $1{,}5\,\mathrm{cm}$ od temena.

? Parabola ima enačbo $x^2 = -10y$. Vpiši ordinato njenega gorišča (brez računala).
= -2,5
~ 2,5 | Minus pred $2p$: parabola je odprta navzdol, gorišče je pod temenom.
~ -5 | To je $-p$. Gorišče je pri polovici, $-\frac{p}{2}$.
> $2p = 10$, $p = 5$. Parabola je odprta navzdol, zato je gorišče $\left(0, -\frac{p}{2}\right) = (0;\; -2{,}5)$, vodnica pa $y = 2{,}5$.

? Enačba $x^2 + Cy^2 - 16 = 0$ opisuje hiperbolo z imaginarno polosjo $b = 2$. Vpiši $C$.
= -4 | 0
~ 4 | Pri $C = 4$ imata kvadrata enaka predznaka: to je elipsa.
~ -0,25 | Obrnil si ulomek. Po deljenju s $16$ je pod $y^2$ imenovalec $-\frac{16}{C}$, ki mora biti $b^2 = 4$.
> Hiperbola: $\frac{x^2}{16} - \frac{y^2}{4} = 1$. Pomnožimo s $16$: $x^2 - 4y^2 - 16 = 0$, torej $C = -4$.

? (višja raven) Hiperbolo z razliko razdalj do gorišč $2a = 6$ konstruiraš s šestilom. Okoli gorišča $F_2$ zarišeš lok s polmerom $4$. Kolikšen polmer vzameš za lok okoli $F_1$, da dobiš točki desne veje?
= 10 | 0
~ 2 | Polmera morata imeti razliko $6$, ne vsote $6$.
~ 7 | Prištel si $a = 3$. Razlika razdalj je $2a = 6$.
> Za točke desne veje je $r_1 - r_2 = 2a$, zato $r_1 = 4 + 6 = 10$.

? (višja raven) V Desmos vpišeš $\frac{x^2}{9} - \frac{y^2}{b^2} = 1$ in premikaš drsnik za $b$. Pri katerem $b > 0$ sta asimptoti premici $y = x$ in $y = -x$?
= 3 | 0
~ 9 | $9$ je $a^2$. Naklon asimptot je $\frac{b}{a}$, ne $\frac{b^2}{a^2}$.
~ 1 | Naklon $1$ pomeni $\frac{b}{a} = 1$, torej $b = a$, ne $b = 1$.
> Naklon asimptot je $\frac{b}{a} = 1$, zato $b = a = 3$.

<<RACUN
resi: (-4)^2 = 2*p*2 | p | 4
vrednost: sqrt((2-2)^2 + (-4)^2) | 4
vrednost: (7 + 13)/2 | 10
vrednost: 13 - 10 | 3
vrednost: 3/10 | 0.3
vrednost: sqrt(100 - 9) | 9.54
vrednost: 91*(1 - 9/100) | 82.81
vrednost: sqrt(82.81) | 9.1
vrednost: sqrt(6^2 + 82.81) | 10.9
vrednost: 10.9 + 9.1 | 20
vrednost: 4^2 - 2^2 | 12
enako: 3*x^2 - (x+2)^2 - 12 | 2*(x^2 - 2*x - 8)
resi: x^2 - 2*x - 8 = 0 | x | -2, 4
vrednost: sqrt(8^2 + 6^2) - sqrt(0^2 + 6^2) | 4
vrednost: 4^2/4 - 6^2/12 | 1
enako: (x-4)^2 + y^2 - (x+4)^2 | y^2 - 16*x
vrednost: 16*4 | 64
vrednost: (-4)^2 + 8*(-2) | 0
vrednost: sqrt(4^2 + (-2+2)^2) | 4
vrednost: 2 - (-2) | 4
vrednost: -(10/2)/2 | -2.5
enako: 16*(x^2/16 - y^2/4 - 1) | x^2 - 4*y^2 - 16
vrednost: 4 + 6 | 10
enako: (x+5)^2 - (x-5)^2 | 20*x
resi: 20*x = 160 | x | 8
vrednost: 36 - (8-5)^2 | 27
vrednost: sqrt(27) | 5.20
vrednost: sqrt((8+5)^2 + 27) | 14
vrednost: 64/16 - 27/9 | 1
>>

:::simboli
x, y | koordinati točke na krivulji | | | v Primerih 3 in 4 v cm
a | velika polos (elipsa) oz. realna polos (hiperbola) | | | $2a$ je vsota ali razlika razdalj do gorišč
b | mala polos (elipsa) oz. imaginarna polos (hiperbola) | | |
e | linearna ekscentričnost | | | razdalja gorišča od središča
\varepsilon | numerična ekscentričnost | \varepsilon = \frac{e}{a} | – | pri elipsi med $0$ in $1$
r_1, r_2 | razdalji točke do gorišč $F_1$ in $F_2$ | | |
p | parameter parabole | | | razdalja med goriščem in vodnico
F | gorišče parabole | | | $F\left(\frac{p}{2}, 0\right)$; v splošni enačbi (blok 5) prosti člen
F_1, F_2 | gorišči elipse oz. hiperbole | | | $(\pm e, 0)$
A, B, C, D, E | koeficienti splošne enačbe druge stopnje | | | $Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0$; tu je $F$ prosti člen, ne gorišče; v Nalogah 1 in 3 sta $A$ in $B$ točki
r | polmer loka pri konstrukciji s šestilom | | | v Primeru 5 $r = 6$
:::
