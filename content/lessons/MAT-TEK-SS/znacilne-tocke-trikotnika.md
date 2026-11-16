---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Trgovska veriga ima v mestu tri trgovine. Novo skladišče želi postaviti tako, da bo dostavni kombi do vsake trgovine vozil enako daleč, saj vsak prevožen kilometer stane enako. Na drugem koncu mesta prodajalec kokic išče prostor za stojnico na trikotnem trgu, ki ga obdajajo tri ulice. Rad bi stal enako blizu vseh treh pločnikov, da ga kupci iz vsake ulice vidijo enako dobro.

Nalogi sta videti različni: prvič merimo razdaljo do treh točk, drugič do treh premic. Skrivata pa isto idejo. Vse točke, ki so enako oddaljene od dveh stvari, ležijo na premici. Dva pogoja določita presečišče dveh premic, tretji pogoj pa je potem izpolnjen sam od sebe. Zato se tri premice sekajo v eni točki, čeprav bi tri naključne premice skoraj vedno omejile majhen trikotnik.

Takim točkam rečemo **značilne točke trikotnika**. Na tekmovanjih so v ozadju skoraj vsake naloge iz geometrije trikotnika. Kdor pozna njihove lege in razmerja, pogosto reši nalogo v dveh vrsticah namesto na dveh straneh.

## Razlaga

**1. En primer do konca.** Trgovine postavimo v koordinatni sistem z enoto en kilometer: $A(0; 0)$, $B(8; 0)$ in $C(2; 6)$.

*Skladišče.* Iščemo točko $O(x; y)$. Točke, enako oddaljene od $A$ in $B$, ležijo na **simetrali stranice** $AB$. To je premica skozi razpolovišče $AB$, pravokotna na $AB$, tukaj $x = 4$. Pogoj $|OA| = |OC|$ zapišemo s kvadrati razdalj: $x^2 + y^2 = (x - 2)^2 + (y - 6)^2$. Po krajšanju ostane enačba $x + 3y = 10$. Pri $x = 4$ dobimo $y = 2$. Skladišče stoji v $O(4; 2)$, do vsake trgovine je $\sqrt{4^2 + 2^2} = \sqrt{20} \approx 4{,}47$ km.

:::premisli
Točko $O$ sta določila le pogoja $|OA| = |OB|$ in $|OA| = |OC|$. Zakaj nam ni treba posebej preverjati, ali $O$ leži tudi na simetrali stranice $BC$?
---
Iz obeh pogojev sledi $|OB| = |OA| = |OC|$, torej $|OB| = |OC|$. To pa natanko pomeni, da $O$ leži na simetrali $BC$. Tretja premica gre skozi presečišče prvih dveh sama od sebe.
:::

*Težišče.* **Težiščnica** je daljica od oglišča do razpolovišča nasprotne stranice. Njihovo presečišče, **težišče** $T$, ima za koordinati povprečji koordinat oglišč: $T\left(\frac{10}{3}; 2\right)$, saj je $\frac{0 + 8 + 2}{3} = \frac{10}{3}$ in $\frac{0 + 0 + 6}{3} = 2$.

*Višinska točka.* **Višina** iz oglišča je pravokotnica na nasprotno stranico. Višina iz $C$ je navpična premica $x = 2$. Stranica $BC$ ima smer $(-6; 6)$, pravokotna nanjo je smer $(1; 1)$, zato je višina iz $A$ premica $y = x$. Sekata se v **višinski točki** (ortocentru) $V(2; 2)$.

Zdaj pa presenečenje: vse tri točke imajo drugo koordinato $2$, torej ležijo na isti premici. Še več, $|VT| = \frac{10}{3} - 2 = \frac{4}{3}$ in $|TO| = 4 - \frac{10}{3} = \frac{2}{3}$, zato je $T$ med $V$ in $O$ ter $|VT| = 2\,|TO|$.

:::risba skica
opis: Trikotnik A(0; 0), B(8; 0), C(2; 6) z očrtano krožnico s središčem O(4; 2). Črtkano so narisane tri višine, ki se sekajo v V(2; 2). Težišče T je pri x = 10/3. Točke V, T in O ležijo na vodoravni premici y = 2, ki je Eulerjeva premica.
območje: -1; -3 .. 9; 7
enota: 30
krog: 4; 2 | 4,47 | siva
lik: 0; 0 -> 8; 0 -> 2; 6 | modra
črta: 2; 6 -> 2; 0 | oranžna črtkano
črta: 0; 0 -> 4; 4 | oranžna črtkano
črta: 8; 0 -> 0,8; 2,4 | oranžna črtkano
črta: -0,5; 2 -> 8,5; 2 | zelena debelo
pravikot: 2; 0 | 2; 6 | 8; 0
točka: 0; 0 | A | levo
točka: 8; 0 | B | desno
točka: 2; 6 | C | nad
točka: 2; 2 | V | nad levo
točka: 3,33; 2 | T | pod
točka: 4; 2 | O | nad desno
podnapis: Višine (črtkano) in Eulerjeva premica y = 2 (debelo)
:::

**2. Posplošitev, korak za korakom.** Ali je to naključje izbranih števil? Ne. Vsako opažanje iz primera velja v vsakem trikotniku.

- **Simetrale stranic.** Razmislek iz prvega »Premisli« velja za vsak trikotnik: simetrale se sekajo v točki $O$, ki je enako oddaljena od vseh oglišč. Krožnica s središčem $O$ skozi oglišča je **očrtana krožnica**, njen polmer je $R$:

$$|OA| = |OB| = |OC| = R$$

- **Simetrale kotov.** Točka na simetrali kota je enako oddaljena od obeh krakov. Enak razmislek kot zgoraj da presečišče $S$, enako oddaljeno od vseh stranic: to je središče **včrtane krožnice** s polmerom $r$. Trikotnik razrežemo na trikotnike $SBC$, $SCA$ in $SAB$, ki imajo vsi višino $r$. Seštejemo ploščine in dobimo zvezo s **polobsegom** $s$:

$$P = r \cdot s, \quad s = \frac{a + b + c}{2}$$

- **Težiščnice.** Naj bodo $M_a$, $M_b$ in $M_c$ razpolovišča stranic $BC$, $CA$ in $AB$, točka $T$ pa presečišče težiščnic $AM_a$ in $BM_b$. Srednjica $M_aM_b$ je vzporedna z $AB$ in pol krajša. Trikotnika $TAB$ in $TM_aM_b$ sta zato podobna v razmerju $2 : 1$, torej $|AT| = 2\,|TM_a|$. Enak razmislek za $AM_a$ in $CM_c$ da presečišče, ki prav tako deli $AM_a$ v razmerju $2 : 1$, torej je to ista točka $T$. V koordinatah:

$$T = \left(\frac{x_A + x_B + x_C}{3};\ \frac{y_A + y_B + y_C}{3}\right)$$

- **Višine.** Skozi vsako oglišče narišemo vzporednico z nasprotno stranico. Nastane dvakrat večji trikotnik, v katerem je vsako oglišče $ABC$ razpolovišče stranice (to dajo paralelogrami). Višine trikotnika $ABC$ so torej simetrale stranic večjega trikotnika, te pa se sekajo v eni točki.

- **Eulerjeva premica.** Ker $T$ deli vsako težiščnico v razmerju $2 : 1$, **središčni razteg** s središčem $T$ in koeficientom $-\frac{1}{2}$ preslika $A$ v $M_a$, $B$ v $M_b$ in $C$ v $M_c$: vsako točko $X$ pošlje na drugo stran $T$, na pol manjšo razdaljo od $T$. Razteg ohranja smeri premic. Višina skozi $A$ (pravokotna na $BC$) se preslika v premico skozi $M_a$, pravokotno na $BC$, to je simetrala stranice $BC$. Vse višine gredo v simetrale, zato gre $V$ v $O$. Točke $V$, $T$ in $O$ ležijo na **Eulerjevi premici**, $T$ je med njima in velja

$$|VT| = 2\,|TO|$$

Isti razteg preslika daljico $AV$ v daljico $M_aO$, ki je pol krajša. To je zelo uporabno orodje:

$$|AV| = 2\,|OM_a|$$

:::premisli
V enakokrakem trikotniku je $|CA| = |CB|$. Napovej, kje leži Eulerjeva premica in ali je na njej tudi središče včrtane krožnice $S$.
---
Na simetrijski osi skozi $C$. Os je hkrati simetrala stranice $AB$, višina, težiščnica in simetrala kota pri $C$, zato so na njej $O$, $V$, $T$ in tudi $S$. V raznostraničnem trikotniku $S$ na Eulerjevi premici ne leži.
:::

**3. Kje ležijo točke.** Lega je odvisna od največjega kota:

| Točka | ostrokotni | pravokotni | topokotni |
|---|---|---|---|
| $O$ | znotraj | razpolovišče hipotenuze | zunaj |
| $V$ | znotraj | oglišče pravega kota | zunaj |
| $T$, $S$ | znotraj | znotraj | znotraj |

Pri pravokotnem trikotniku je to Talesov izrek: hipotenuza je premer očrtane krožnice. V simulaciji spodaj (Značilne točke trikotnika) vklopi vse štiri točke in povleci oglišče $C$, da bo kot pri njem top. Opazuj, kateri točki zapustita trikotnik in da $O$, $T$ in $V$ ostanejo na eni premici.

## Rešeni primeri

### Primer 1 (lažji): parcela trgovskega centra

Trgovski center stoji na parceli v obliki pravokotnega trikotnika s katetama $60\,\mathrm{m}$ in $80\,\mathrm{m}$ ter hipotenuzo $100\,\mathrm{m}$. Na parceli želijo čim večjo okroglo tlakovano ploščad, ki ne sega čez rob; tlakovanje stane $30$ € za $\mathrm{m}^2$. Reklamni stolp pa naj bo enako oddaljen od vseh treh vogalov. Kolikšen je polmer ploščadi, koliko stane tlakovanje in kako daleč je stolp od vogalov?

**Podatki:** $a = 60\,\mathrm{m}$, $b = 80\,\mathrm{m}$, $c = 100\,\mathrm{m}$, $\gamma = 90^\circ$, cena $30$ €/$\mathrm{m}^2$
**Iščemo:** polmer ploščadi $r$, ceno tlakovanja, razdaljo $R$ od stolpa do vogalov

:::formula
$r = \dfrac{P}{s}$, kjer je $P = \dfrac{a \cdot b}{2}$ in $s = \dfrac{a + b + c}{2}$; pri pravokotnem trikotniku $R = \dfrac{c}{2}$
:::

**Rešitev:**

1. Največji krog v trikotniku je včrtani krog: dotika se vseh treh stranic, zato ga ni mogoče povečati.
2. Ploščina parcele: $P = \frac{60 \cdot 80}{2} = 2400\,\mathrm{m}^2$, ker sta kateti druga drugi višina.
3. Polobseg: $s = \frac{60 + 80 + 100}{2} = 120\,\mathrm{m}$.
4. Polmer: $r = \frac{2400}{120} = 20\,\mathrm{m}$.
5. Ploščina ploščadi je $\pi \cdot 20^2 \approx 1256{,}64\,\mathrm{m}^2$, tlakovanje stane $1256{,}64 \cdot 30 \approx 37\,699$ €.
6. Po Talesovem izreku je $O$ razpolovišče hipotenuze, zato $R = \frac{100}{2} = 50\,\mathrm{m}$.
7. Odgovor: ploščad ima polmer $20\,\mathrm{m}$, tlakovanje stane približno $37\,700$ €, stolp je od vsakega vogala oddaljen $50\,\mathrm{m}$.

### Primer 2: višinska točka brez sekanja višin

Trikotnik ima oglišča $A(0; 0)$, $B(10; 0)$ in $C(4; 8)$. Določi višinsko točko $V$ s pomočjo Eulerjeve premice in rezultat preveri z eno višino.

**Podatki:** $A(0; 0)$, $B(10; 0)$, $C(4; 8)$
**Iščemo:** koordinati višinske točke $V$

:::formula
Iz $|VT| = 2\,|TO|$ in lege $T$ med $V$ in $O$ sledi $T - V = 2(O - T)$, torej $V = 3T - 2O$ (po koordinatah).
:::

**Rešitev:**

1. Težišče: $x_T = \frac{0 + 10 + 4}{3} = \frac{14}{3}$, $y_T = \frac{0 + 0 + 8}{3} = \frac{8}{3}$.
2. Simetrala $AB$ je $x = 5$. Pogoj $|OA| = |OC|$ da $x^2 + y^2 = (x - 4)^2 + (y - 8)^2$, po krajšanju $x + 2y = 10$. Pri $x = 5$ je $y = 2{,}5$, torej $O(5; 2{,}5)$.
3. Po Eulerjevi premici: $x_V = 3 \cdot \frac{14}{3} - 2 \cdot 5 = 4$ in $y_V = 3 \cdot \frac{8}{3} - 2 \cdot 2{,}5 = 3$.
4. Preizkus: višina iz $C$ je navpična premica $x = 4$, ker $AB$ leži na osi $x$; $V$ je na njej. Vektor $\overrightarrow{AV} = (4; 3)$ je pravokoten na $\overrightarrow{BC} = (-6; 8)$, saj je $4 \cdot (-6) + 3 \cdot 8 = 0$.
5. Odgovor: višinska točka je $V(4; 3)$.

### Primer 3 (težji): razdalja od oglišča do višinske točke

Ostrokotni trikotnik $ABC$ ima polmer očrtane krožnice $5$, stranica $BC$ pa meri $8$. Koliko je višinska točka $V$ oddaljena od oglišča $A$? Pokaži tudi, da odgovor ni odvisen od tega, kje na krožnici leži $A$.

**Podatki:** $R = 5$, $a = |BC| = 8$, trikotnik je ostrokoten
**Iščemo:** razdaljo $|AV|$ in utemeljitev, da ni odvisna od lege $A$

:::formula
$|AV| = 2\,|OM_a|$, razdaljo $|OM_a|$ pa dobimo s Pitagorovim izrekom v trikotniku $OM_aB$.
:::

**Rešitev:**

1. Razpolovišče $M_a$ stranice $BC$: $|BM_a| = \frac{8}{2} = 4$.
2. Točka $O$ leži na simetrali $BC$, zato je $OM_a \perp BC$. V pravokotnem trikotniku $OM_aB$ je hipotenuza $|OB| = R$: $|OM_a| = \sqrt{5^2 - 4^2} = 3$.
3. Iz Eulerjevega raztega: $|AV| = 2 \cdot 3 = 6$.
4. Neodvisnost od $A$: točki $O$ in $M_a$ sta določeni že s krožnico in tetivo $BC$, oglišča $A$ v računu sploh nismo uporabili. Ko se $A$ premika po krožnici, se premika tudi $V$, razdalja pa ostaja enaka: vsi ostrokotni trikotniki s to očrtano krožnico in to stranico $BC$ imajo $|AV| = 6$.
5. Odgovor: višinska točka je od oglišča $A$ oddaljena $6$ enot.

### Primer 4 – zdaj ti

Ostrokotni trikotnik ima polmer očrtane krožnice $13$, stranica $BC$ meri $24$. Izračunaj $|AV|$.

**Podatki:** $R = 13$, $a = |BC| = 24$, trikotnik je ostrokoten
**Iščemo:** razdaljo $|AV|$

:::formula
$|OM_a| = \sqrt{R^2 - \left(\dfrac{a}{2}\right)^2}$, nato $|AV| = 2\,|OM_a|$
:::

**Rešitev:**

1. Polovica stranice: $|BM_a| = \frac{24}{2} = 12$.
2. Izračunaj $|OM_a|$ in nato $|AV|$, potem preveri:

:::premisli
Koliko sta $|OM_a|$ in $|AV|$?
---
$|OM_a| = \sqrt{13^2 - 12^2} = \sqrt{25} = 5$ in $|AV| = 2 \cdot 5 = 10$.
:::

## Pogoste napake

- **Simetrale stranic namesto simetral kotov.** »Središče včrtane krožnice dobim iz simetral stranic.« Simetrale stranic dajo točko, enako oddaljeno od *oglišč* ($O$). Enaka oddaljenost od *stranic* zahteva simetrale kotov ($S$).
- **Težišče na sredini težiščnice.** Težišče ni razpolovišče težiščnice. Deli jo v razmerju $2 : 1$, daljši del je ob oglišču. Enako na Eulerjevi premici: $T$ je dvakrat dlje od $V$ kot od $O$, ne obratno.
- **»Višine se vedno sekajo v trikotniku.«** V topokotnem trikotniku se sekajo le nosilke višin, in sicer zunaj, onkraj topega kota. Zato pri risanju vedno podaljšaj višine v premice.
- **Vse štiri točke na Eulerjevi premici.** Na njej ležijo $O$, $T$ in $V$. Središče včrtane krožnice $S$ leži na njej le v enakokrakem trikotniku.
- **Obseg namesto polobsega.** Zveza je $P = r \cdot s$ s polobsegom $s$. Kdor vstavi cel obseg, dobi polovico pravega polmera.

## Povzetek

- Simetrale stranic se sekajo v $O$, središču očrtane krožnice ($|OA| = |OB| = |OC| = R$); simetrale kotov v $S$, središču včrtane krožnice, $P = r \cdot s$.
- Težiščnice se sekajo v težišču $T$, ki vsako deli v razmerju $2 : 1$ od oglišča; koordinate $T$ so povprečja koordinat oglišč.
- Nosilke višin se sekajo v višinski točki $V$; pri topokotnem trikotniku sta $V$ in $O$ zunaj.
- Dokazna ideja: tretja premica gre skozi presečišče prvih dveh, ker iz dveh enakosti sledi tretja; višine so simetrale stranic dvakrat večjega trikotnika.
- Eulerjeva premica: $V$, $T$, $O$ so kolinearne, $|VT| = 2\,|TO|$, $V = 3T - 2O$; poleg tega $|AV| = 2\,|OM_a|$ (razteg s središčem $T$ in koeficientom $-\frac{1}{2}$).

## Drugače: Z analogijo

Predstavljaj si, da kupci vedno gredo v najbližjo izmed treh trgovin. Simetrala stranice $AB$ je potem **meja** med »območjem« trgovine $A$ in trgovine $B$: kupcu na njej je vseeno, kam gre. Tri trgovine imajo tri meje. Kjer se srečata dve meji, je kupcu vseeno med vsemi tremi, zato gre skozi isto točko tudi tretja meja. To je točka $O$.

Težišče si predstavljaj kot ravnovesno točko: iz kartona izreži trikotnik in ga postavi na konico svinčnika. Ravnovesje najdeš natanko v $T$, kot pri povprečju cen v košarici, kjer vsaka cena šteje enako.

Eulerjev razteg je kot fotokopiranje s pomanjšavo $50\,\%$ in obratom za $180^\circ$ okoli $T$. Kopija trikotnika je trikotnik razpolovišč, kopija višin so simetrale stranic, kopija točke $V$ je točka $O$. Ker kopija leži na nasprotni strani $T$ in je pol manjša, dobimo $|VT| = 2\,|TO|$.

## Drugače: Bolj natančno

**Vektorski dokaz.** Izhodišče postavimo v $O$ in oglišča zapišemo kot vektorje $\vec{a}$, $\vec{b}$, $\vec{c}$ z $|\vec{a}| = |\vec{b}| = |\vec{c}| = R$. Naj bo $\vec{v} = \vec{a} + \vec{b} + \vec{c}$. Potem $(\vec{v} - \vec{a}) \cdot (\vec{b} - \vec{c}) = (\vec{b} + \vec{c}) \cdot (\vec{b} - \vec{c}) = R^2 - R^2 = 0$. Točka $\vec{v}$ torej leži na višini iz $A$ in prav tako na drugih dveh: to je $V$. Ker je $\vec{t} = \frac{\vec{a} + \vec{b} + \vec{c}}{3}$, velja $\vec{v} = 3\vec{t}$, kar je natanko Eulerjeva premica z razmerjem $2 : 1$.

**Dodatna dejstva za tekmovanja.**

- Zrcalna slika $V$ čez stranico $BC$ leži na očrtani krožnici; v ostrokotnem trikotniku je $\angle BVC = 180^\circ - \alpha$.
- Razpolovišče daljice $VO$ je središče krožnice devetih točk s polmerom $\frac{R}{2}$: skoznjo gredo razpolovišča stranic, nožišča višin in razpolovišča daljic $AV$, $BV$, $CV$.
- Eulerjeva formula $|OS|^2 = R^2 - 2Rr$ da neenakost $R \ge 2r$, enakost velja le v enakostraničnem trikotniku, kjer vse značilne točke sovpadejo.
- Iz sinusnega izreka in $P = \frac{1}{2} b c \sin\alpha$ sledi $R = \frac{abc}{4P}$.

## Preveri se

? Prodajalec bi rad na trikotnem trgu med tremi ulicami postavil stojnico, ki je enako oddaljena od vseh treh ulic. Katero točko trikotnika išče?
- Središče očrtane krožnice $O$
~ Točka $O$ je enako oddaljena od oglišč (vogalov trga), ne od stranic (ulic).
+ Središče včrtane krožnice $S$
- Težišče $T$
~ Težišče je ravnovesna točka; od stranic je enako oddaljeno le v enakostraničnem trikotniku.
- Višinska točka $V$
~ Višinska točka je lahko celo zunaj trga, enake oddaljenosti od stranic pa v splošnem nima.
> Točka na simetrali kota je enako oddaljena od obeh krakov, zato je presečišče simetral kotov $S$ enako oddaljeno od vseh treh stranic.

? Trikotnik je ostrokoten. Oglišče $C$ premikamo proti stranici $AB$, dokler kot $\gamma$ ne postane top. Kaj se zgodi z višinsko točko $V$?
- Ostane v trikotniku, saj je presečišče višin.
~ Pri topem kotu se sekajo le nosilke višin, in to zunaj trikotnika.
- Pride na stranico $AB$.
~ Na stranici $AB$ bi bila $V$ le v oglišču $A$ ali $B$, torej pri pravem kotu tam, ne pri $C$.
+ Pri $\gamma = 90^\circ$ je v oglišču $C$, nato gre iz trikotnika onkraj $C$.
- Ne premakne se, saj se stranica $AB$ ne premika.
~ $V$ je odvisna od vseh treh višin, višini iz $A$ in $B$ pa se s $C$ zasukata.
> Pri pravem kotu pri $C$ sta kateti višini, zato $V = C$. Ko kot postane top, se nosilke višin sekajo zunaj, onkraj oglišča $C$.

? Razvrsti korake dokaza, da se nosilke višin trikotnika $ABC$ sekajo v eni točki.
1. Skozi vsako oglišče nariši vzporednico z nasprotno stranico.
2. Vzporednice omejujejo večji trikotnik $A_1B_1C_1$.
3. Iz paralelogramov sledi, da je $A$ razpolovišče $B_1C_1$ (in podobno $B$ in $C$).
4. Višina iz $A$ je pravokotna na $B_1C_1$, zato je simetrala stranice $B_1C_1$.
5. Simetrale stranic trikotnika $A_1B_1C_1$ se sekajo v eni točki, torej tudi višine $ABC$.
> Višine trikotnika $ABC$ so simetrale stranic dvakrat večjega trikotnika, za simetrale pa sočasnost že vemo.

? Na sliki je Eulerjeva premica nekega trikotnika kot številska premica. Višinska točka $V$ je pri $1$, težišče $T$ pri $4$. Pri katerem številu leži središče očrtane krožnice $O$?
:::risba premica
opis: Številska premica od 0 do 10. Višinska točka V je označena pri 1, težišče T pri 4.
od: 0
do: 10
točka: 1 | V
točka: 4 | T
:::
= 5,5 | 0,01
~ 7 | Težišče ni razpolovišče daljice $VO$: $|VT| = 2\,|TO|$, ne $|VT| = |TO|$.
~ 10 | Razmerje si obrnil. $T$ je bližje $O$: $|TO|$ je polovica $|VT|$, ne dvakratnik.
> $|VT| = 3$, zato $|TO| = \frac{3}{2}$ in $O$ leži pri $4 + 1{,}5 = 5{,}5$.

? Trikotna parcela ima stranice $13\,\mathrm{m}$, $14\,\mathrm{m}$ in $15\,\mathrm{m}$, višina na stranico $14\,\mathrm{m}$ meri $12\,\mathrm{m}$. Kolikšen je polmer največje okrogle mize, ki jo lahko položimo na parcelo?
= 4 m | 0,01
~ 2 | Delil si s celim obsegom $42\,\mathrm{m}$. V $P = r \cdot s$ je $s$ polobseg.
~ 8 | Ploščino si podvojil. $P = \frac{14 \cdot 12}{2} = 84\,\mathrm{m}^2$, nato $r = \frac{84}{21}$.
> Največji krog je včrtani: $P = \frac{14 \cdot 12}{2} = 84\,\mathrm{m}^2$, $s = 21\,\mathrm{m}$, $r = \frac{84}{21} = 4\,\mathrm{m}$.

<<RACUN
vrednost: sqrt(4^2+2^2) | 4.47
vrednost: (0+8+2)/3 | 10/3
vrednost: 10/3-2 | 4/3
vrednost: 4-10/3 | 2/3
resi: x+3*y=10, x=4 | x, y | x=4, y=2
vrednost: 60*80/2 | 2400
vrednost: 2400/120 | 20
vrednost: pi*20^2*30 | 37699.11
resi: x+2*y=10, x=5 | x, y | x=5, y=2.5
vrednost: 3*14/3-2*5 | 4
vrednost: 3*8/3-2*2.5 | 3
vrednost: 4*(-6)+3*8 | 0
vrednost: sqrt(5^2-4^2) | 3
vrednost: 2*sqrt(13^2-12^2) | 10
vrednost: 4+3/2 | 5.5
vrednost: (14*12/2)/21 | 4
>>

:::simboli
O | središče očrtane krožnice | | | presečišče simetral stranic
R | polmer očrtane krožnice | | | razdalja od $O$ do oglišč
A, B, C | oglišča trikotnika | | |
S | središče včrtane krožnice | | | presečišče simetral kotov
r | polmer včrtane krožnice | r = \frac{P}{s} | |
P | ploščina trikotnika | P = r \cdot s | |
s | polobseg | s = \frac{a + b + c}{2} | |
a, b, c | dolžine stranic $BC$, $CA$, $AB$ | | |
T | težišče | | | deli težiščnico v razmerju $2 : 1$
x_A, x_B, x_C | prve koordinate oglišč | | |
y_A, y_B, y_C | druge koordinate oglišč | | |
V | višinska točka (ortocenter) | | | presečišče nosilk višin
M_a, M_b, M_c | razpolovišča stranic $BC$, $CA$, $AB$ | | |
\alpha | notranji kot pri oglišču $A$ | | ^\circ |
\gamma | notranji kot pri oglišču $C$ | | ^\circ |
:::
