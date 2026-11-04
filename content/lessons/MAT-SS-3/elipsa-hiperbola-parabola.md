---
stanje: osnutek
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

Vsota je vedno $10$. To je dolžina daljše osi elipse, ki jo imenujemo **glavna os**. Njena polovica je **velika polos** $a$, tu $a = 5$. Krajša os je **stranska os**, njena polovica je **mala polos** $b$, tu $b = 3$. Krajišča obeh osi so **temena**.

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

| točka | $r_1$ | $r_2$ | $r_1 - r_2$ |
|---|---|---|---|
| $(4, 0)$ | $9$ | $1$ | $8$ |
| $(5;\; 2{,}25)$ | $10{,}25$ | $2{,}25$ | $8$ |
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

Žarki, vzporedni z osjo, se na paraboli odbijejo v gorišče. Zato je sprejemnik satelitske antene v gorišču, žarnica žarometa pa v gorišču pošilja vzporeden snop.

**4. Pregled na eni sliki.**

| krivulja in pravilo | enačba |
|---|---|
| elipsa: $r_1 + r_2 = 2a$ | $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$ |
| hiperbola: $\lvert r_1 - r_2\rvert = 2a$ | $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$ |
| parabola: do $F$ = do vodnice | $y^2 = 2px$ |

V simulaciji spodaj »Elipsa, hiperbola in parabola« izberi elipso in povleci točko $T$ po obrisu. Opazuj vsoto $r_1 + r_2$: ostane enaka. Nato nastavi $b = a$ in poglej, kaj postane elipsa.

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

## Pogoste napake

- **Imenovalec namesto polosi.** Pri $\frac{x^2}{25} + \frac{y^2}{9} = 1$ nekdo vzame $a = 25$. Pod $x^2$ je $a^2$, zato je $a = \sqrt{25} = 5$.
- **Zamenjana zveza za $e$.** Pri elipsi odštevaš ($e^2 = a^2 - b^2$, gorišči sta znotraj), pri hiperboli seštevaš ($e^2 = a^2 + b^2$, gorišči sta zunaj temen). Kdor zamenja, dobi gorišči elipse zunaj krivulje, kar ne more biti.
- **Obrnjen naklon asimptot.** Pri $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$ sta asimptoti $y = \pm \frac{b}{a} x$. Kdor napiše $\frac{a}{b}$, dobi premici, ki se ne ujemata z diagonalama pravokotnika $2a \times 2b$.
- **Gorišče parabole pri $p$.** Pri $y^2 = 2px$ je gorišče v $\left(\frac{p}{2}, 0\right)$, ne v $(p, 0)$. Pri $y^2 = 6x$ je $2p = 6$, $p = 3$, gorišče pri $1{,}5$.
- **Glavna os vedno na osi $x$.** Pri $\frac{x^2}{9} + \frac{y^2}{25} = 1$ je večji imenovalec pod $y^2$, zato sta gorišči na osi $y$.

## Povzetek

- Elipsa: vsota razdalj do gorišč je $2a$; enačba $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$; $e = \sqrt{a^2 - b^2}$, $\varepsilon = \frac{e}{a}$ med $0$ in $1$; pri $a = b$ krožnica.
- Hiperbola: absolutna razlika razdalj do gorišč je $2a$; enačba $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$; $e = \sqrt{a^2 + b^2}$; asimptoti $y = \pm \frac{b}{a} x$; dve veji.
- Parabola: točke so enako oddaljene od gorišča in vodnice; enačba $y^2 = 2px$, gorišče $\left(\frac{p}{2}, 0\right)$, vodnica $x = -\frac{p}{2}$.
- Polosi preberi kot korena imenovalcev; večji imenovalec pove, na kateri osi sta gorišči elipse.
- Graf $y = \frac{c}{x}$ je zasukana hiperbola, graf kvadratne funkcije je parabola.

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

Elipse najdeš v orbitah planetov (Sonce je v enem gorišču) in v ovalnih ogledalih. Parabole so v satelitskih antenah, avtomobilskih žarometih in pri metu žoge. Hiperbolo vidiš kot senco, ki jo svetilka z okroglim senčnikom vrže na steno nad seboj in pod seboj.

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

:::simboli
x, y | koordinati točke na krivulji | | | v Primerih 3 in 4 v cm
a | velika polos (elipsa) oz. realna polos (hiperbola) | | | $2a$ je vsota ali razlika razdalj do gorišč
b | mala polos (elipsa) oz. imaginarna polos (hiperbola) | | |
e | linearna ekscentričnost | | | razdalja gorišča od središča
\varepsilon | numerična ekscentričnost | \varepsilon = \frac{e}{a} | – | pri elipsi med $0$ in $1$
r_1, r_2 | razdalji točke do gorišč $F_1$ in $F_2$ | | |
p | parameter parabole | | | razdalja med goriščem in vodnico
F | gorišče parabole | | | $F\left(\frac{p}{2}, 0\right)$
F_1, F_2 | gorišči elipse oz. hiperbole | | | $(\pm e, 0)$
:::
