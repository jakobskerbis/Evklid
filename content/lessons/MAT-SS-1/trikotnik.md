---
stanje: preverjeno
demo: trikotnik
avtor: AI
---

## Zakaj se tega učimo

Telefon pokaže, da si od oddajnika A oddaljen $3\,\text{km}$, od oddajnika B pa $5\,\text{km}$. Na zemljevidu sta oddajnika $9\,\text{km}$ narazen. Je to sploh mogoče? Ravna pot od A do B ne more biti daljša od poti prek tebe, ki meri $3 + 5 = 8\,\text{km}$, zato ena od meritev ne drži. Ti in oba oddajnika ste oglišča trikotnika, za trikotnik pa velja pravilo, ki ga ne smeš kršiti.

Še dve vprašanji iz tehnike. Kam postaviti nov oddajnik, da bo enako daleč od treh vasi? In kdaj sta dve trikotni stojali za telefon iz tovarne res enaki, ne da bi izmerili vse stranice in vse kote? Odgovore dajo **trikotniška neenakost**, **skladnost** in **značilne točke trikotnika**.

## Razlaga

**1. Oznake.** Oglišča trikotnika označimo z $A$, $B$, $C$, stranice z $a$, $b$, $c$ in notranje kote z $\alpha$, $\beta$, $\gamma$. Stranica $a$ leži nasproti oglišča $A$ in kota $\alpha$, podobno $b$ in $c$. Obseg je $o = a + b + c$, polobseg pa $s = \dfrac{a+b+c}{2}$.

**2. Koti v trikotniku.** Vsota notranjih kotov je vedno $180^\circ$:

$$\alpha + \beta + \gamma = 180^\circ$$

Razlog: skozi oglišče $C$ potegnemo vzporednico stranici $c$. Pri $C$ nastaneta ob kotu $\gamma$ še dva kota. Kot izmenična kota ob vzporednicah sta enaka kotoma $\alpha$ in $\beta$. Vsi trije skupaj tvorijo iztegnjeni kot $180^\circ$.

**Zunanji kot** pri oglišču je sokot notranjega kota, na primer $\gamma' = 180^\circ - \gamma$. Velja: **zunanji kot je enak vsoti obeh nenaležnih notranjih kotov** (kotov pri drugih dveh ogliščih), torej $\gamma' = \alpha + \beta$. Razlog: $\gamma'$ in $\alpha + \beta$ sta oba enaka $180^\circ - \gamma$.

**3. Stranice in koti.** Nasproti večje stranice leži večji kot: $a > b \Leftrightarrow \alpha > \beta$. V enakokrakem trikotniku sta kota ob osnovnici enaka, v enakostraničnem je vsak kot $60^\circ$.

V pravokotnem trikotniku sta kateti $a$, $b$ in hipotenuza $c$ (nasproti pravega kota), veljata pa Pitagorov izrek $a^2 + b^2 = c^2$ in Talesov izrek: kot v polkrogu je pravi in obratno, oglišče pravega kota leži na krožnici, ki ima hipotenuzo za premer.

**4. Trikotniška neenakost.** Trikotnik s stranicami $a$, $b$, $c$ obstaja natanko tedaj, ko je vsaka stranica manjša od vsote drugih dveh:

$$a < b + c, \qquad b < a + c, \qquad c < a + b$$

Če poznamo dve stranici $a$ in $b$, za tretjo velja $|a - b| < c < a + b$. Razlog: najkrajša pot med dvema točkama je ravna daljica, zato je stranica $c$ krajša od poti prek tretjega oglišča. Če je $c = a + b$, ležijo vse tri točke na isti premici in trikotnika ni. Pri oddajnikih iz uvoda je $9 > 3 + 5$, zato meritve ne morejo biti hkrati pravilne.

**5. Skladnost.** Pri daljicah je skladnost preprosta: dve daljici sta skladni, če sta enako dolgi, dva kota, če sta enako velika. Trikotnik pa ima šest podatkov, tri stranice in tri kote. Trikotnika sta **skladna** ($\triangle ABC \cong \triangle A_1B_1C_1$), če se ujemata v vseh stranicah in vseh kotih, torej ju lahko s premikom, vrtenjem in morda zrcaljenjem prekrijemo. Za dokaz ni treba preveriti vseh šestih podatkov. Dovolj je eden od izrekov:

| Izrek | Ujemanje v | Opomba |
|---|---|---|
| SSS | vseh treh stranicah | |
| SKS | dveh stranicah in kotu med njima | kot mora biti med stranicama |
| KSK | stranici in obeh kotih ob njej | |
| SsK | dveh stranicah in kotu nasproti **daljše** od njiju | kot nasproti krajše stranice ne zadošča |

Pri ujemanju moramo paziti, katera oglišča si ustrezajo. Skladnost zapišemo tako, da ustrezni oglišči stojita na istem mestu: $\triangle ABC \cong \triangle FDE$ pomeni $A \leftrightarrow F$, $B \leftrightarrow D$, $C \leftrightarrow E$.

:::premisli
Dva trikotnika imata enake vse tri kote: $50^\circ$, $60^\circ$ in $70^\circ$. Napovej: sta zato skladna?
---
Ne nujno. Trije koti ne povedo ničesar o velikosti: posnetek trikotnika na zaslonu telefona, ki ga povečaš z dvema prstoma, ima enake kote, stranice pa daljše. Zato med izreki ni »KKK«; vsak izrek vsebuje vsaj eno stranico.
:::

**6. Značilne točke trikotnika.** Simetralo daljice že poznaš: vse njene točke so enako oddaljene od obeh krajišč. Novo je, da gredo vse tri simetrale stranic trikotnika skozi eno točko. Skupno točko imajo tudi simetrale kotov (premice, ki kot razpolovijo), težiščnice in višine.

Simetrala stranice in višina sta obe pravokotni na stranico, a simetrala gre skozi sredino stranice, višina pa skozi nasprotno oglišče. Težiščnica in višina obe izhajata iz oglišča, a težiščnica gre do sredine nasprotne stranice, višina pa nanjo pade pod pravim kotom.

| Daljica oziroma premica | Presečišče | Lastnost presečišča |
|---|---|---|
| simetrale stranic | središče $O$ očrtane krožnice | enako oddaljeno od vseh treh oglišč, razdalja je polmer $R$ |
| simetrale kotov | središče $I$ včrtane krožnice | enako oddaljeno od vseh treh stranic, razdalja je polmer $r$ |
| težiščnice (oglišče do sredine nasprotne stranice) | težišče $T$ | deli vsako težiščnico v razmerju $2:1$ od oglišča |
| nosilke višin (pravokotnic iz oglišča na nosilko nasprotne stranice) | višinska točka $V$ | |

To, da se tri premice iste vrste vedno sekajo v eni točki, ni samoumevno (dokaz za simetrale stranic je v »Bolj natančno«). V simulaciji spodaj »Značilne točke trikotnika« vleci eno oglišče, dokler kot pri njem ne postane top, in opazuj, katere točke zapustijo trikotnik.

:::premisli
V simulaciji vlečeš oglišče $C$ od ostrega kota proti topemu. Napovej: kje je središče očrtane krožnice ravno takrat, ko je kot pri $C$ pravi?
---
Na sredini hipotenuze. Po Talesovem izreku leži oglišče pravega kota na krožnici, ki ima hipotenuzo za premer, in to je očrtana krožnica. Hipotenuza je premer, njena sredina je središče.
:::

Lega se spreminja z obliko trikotnika:

- Težišče $T$ in središče $I$ sta vedno znotraj trikotnika.
- Pri ostrokotnem trikotniku sta $O$ in $V$ znotraj, pri pravokotnem je $O$ na sredini hipotenuze, $V$ pa v oglišču pravega kota, pri topokotnem sta oba zunaj.

**7. Ploščina in včrtana krožnica.** Ploščina trikotnika je $S = \dfrac{a \cdot v_a}{2}$. Središče $I$ včrtane krožnice je od vseh stranic oddaljeno za $r$, zato trikotnik, ko $I$ povežemo z oglišči, razpade na tri manjše trikotnike z višinami $r$ in osnovnicami $a$, $b$, $c$:

$$S = \frac{a r}{2} + \frac{b r}{2} + \frac{c r}{2} = r \cdot s$$

Od tod $r = \dfrac{S}{s}$.

**8. Večkotniki.** Lik, ki ga omejuje sklenjena lomljena črta iz $n$ daljic ($n \ge 3$), ki sama sebe ne seka, je **$n$-kotnik**. Ima $n$ oglišč, $n$ stranic in $n$ notranjih kotov $\alpha_1, \alpha_2, \ldots, \alpha_n$. Daljica med dvema nesosednjima ogliščema je **diagonala**. Obravnavamo konveksne večkotnike: vsak notranji kot je manjši od $180^\circ$.

*Vsota notranjih kotov.* Iz enega oglišča potegnemo vse diagonale. Razrežejo $n$-kotnik na $n - 2$ trikotnikov, petkotnik na primer na tri:

:::risba skica
opis: Pravilni petkotnik ABCDE. Iz oglišča A gresta diagonali AC in AD, ki ga razdelita na tri trikotnike, označene z 1, 2 in 3.
območje: -2,5; -2,2 .. 2,5; 2,5
enota: 50
lik: -1,18; -1,62 -> 1,18; -1,62 -> 1,9; 0,62 -> 0; 2 -> -1,9; 0,62 | modra
črta: -1,18; -1,62 -> 1,9; 0,62 | oranžna črtkano
črta: -1,18; -1,62 -> 0; 2 | oranžna črtkano
točka: -1,18; -1,62 | A | pod levo
točka: 1,18; -1,62 | B | pod desno
točka: 1,9; 0,62 | C | desno
točka: 0; 2 | D | nad
točka: -1,9; 0,62 | E | levo
napis: 0,63; -0,87 | 1 | sredina | oranžna debelo
napis: 0,24; 0,33 | 2 | sredina | oranžna debelo
napis: -1,03; 0,33 | 3 | sredina | oranžna debelo
:::

Koti teh trikotnikov skupaj sestavijo natanko notranje kote večkotnika, zato je

$$\alpha_1 + \alpha_2 + \ldots + \alpha_n = (n - 2) \cdot 180^\circ$$

Štirikotnik ima vsoto $360^\circ$, petkotnik $3 \cdot 180^\circ = 540^\circ$, šestkotnik $720^\circ$.

*Zunanji koti.* Pri vsakem oglišču sta notranji in zunanji kot sokota, vseh $n$ parov skupaj meri $n \cdot 180^\circ$. Odštejemo vsoto notranjih: $n \cdot 180^\circ - (n - 2) \cdot 180^\circ = 360^\circ$. **Vsota zunanjih kotov je vedno $360^\circ$**, ne glede na $n$: ko obhodiš večkotnik, se zasukaš za en cel obrat.

*Diagonale.* Iz vsakega oglišča gre $n - 3$ diagonal (ne do sebe in ne do obeh sosedov). Pri $n$ ogliščih je to $n(n - 3)$, a vsako diagonalo smo šteli dvakrat, enkrat z vsakega krajišča:

$$d_n = \frac{n(n - 3)}{2}$$

Petkotnik ima $5$ diagonal, šestkotnik $\dfrac{6 \cdot 3}{2} = 9$.

*Pravilni večkotnik* ima vse stranice enako dolge in vse notranje kote enake. Pravilni trikotnik je enakostranični, pravilni štirikotnik kvadrat. Ker so koti enaki, meri notranji kot $\varphi = \dfrac{(n - 2) \cdot 180^\circ}{n}$, zunanji pa $\varphi' = \dfrac{360^\circ}{n}$. Pri pravilnem šestkotniku je $\varphi' = 60^\circ$ in $\varphi = 120^\circ$.

## Rešeni primeri

### Primer 1 (lažji)

V trikotniku $ABC$ je kot $\alpha = 48^\circ$ in kot $\beta = 75^\circ$. Izračunaj kot $\gamma$ in zunanji kot pri oglišču $C$.

**Podatki:** $\alpha = 48^\circ$, $\beta = 75^\circ$
**Iščemo:** notranji kot $\gamma$ in zunanji kot $\gamma'$ pri $C$

:::formula
$\alpha + \beta + \gamma = 180^\circ$, zunanji kot $\gamma' = 180^\circ - \gamma = \alpha + \beta$
:::

**Rešitev:**

1. Notranji kot: $\gamma = 180^\circ - 48^\circ - 75^\circ = 57^\circ$.
2. Zunanji kot: $\gamma' = 180^\circ - 57^\circ = 123^\circ$.
3. Preverimo z drugim izrazom: $\alpha + \beta = 48^\circ + 75^\circ = 123^\circ$, kar se ujema.
4. Odgovor: $\gamma = 57^\circ$, zunanji kot pri $C$ je $123^\circ$.

### Primer 2 (srednji)

Dve trikotni stranici stojal za telefon sta izdelani v različnih tovarnah. Trikotnik $ABC$ ima stranici $a = 5\,\text{cm}$ in $b = 7\,\text{cm}$ ter kot $\gamma = 50^\circ$ med njima. Trikotnik $DEF$ ima stranici $d = 7\,\text{cm}$ in $f = 5\,\text{cm}$ ter kot $\varepsilon = 50^\circ$ med njima. V trikotniku $ABC$ je $\beta \approx 85^\circ$ (zaokroženo na stopinjo). Ali sta trikotnika skladna? Če sta, zapiši, katera oglišča si ustrezajo, in izračunaj kote $\delta$, $\varphi$ ter $\alpha$.

**Podatki:** $ABC$: $a = 5\,\text{cm}$, $b = 7\,\text{cm}$, $\gamma = 50^\circ$, $\beta \approx 85^\circ$; $DEF$: $d = 7\,\text{cm}$, $f = 5\,\text{cm}$, $\varepsilon = 50^\circ$
**Iščemo:** ali je $\triangle ABC \cong \triangle DEF$, ujemajoča se oglišča, kote $\delta$, $\varphi$, $\alpha$

:::formula
Izrek SKS: trikotnika sta skladna, če se ujemata v dveh stranicah in kotu med njima. Vsota kotov: $\alpha + \beta + \gamma = 180^\circ$.
:::

**Rešitev:**

1. Kot $\gamma$ leži med stranicama $a$ in $b$ (to sta stranici, ki se stikata v $C$). Kot $\varepsilon$ leži med stranicama $d$ in $f$ (stikata se v $E$).
2. Stranici se ujemata: $a = 5\,\text{cm} = f$ in $b = 7\,\text{cm} = d$, kota med njima pa sta enaka: $\gamma = 50^\circ = \varepsilon$. Po izreku SKS sta trikotnika skladna.
3. Ujemanje oglišč: $A \leftrightarrow F$ (nasproti obeh je stranica $5\,\text{cm}$), $B \leftrightarrow D$ (nasproti obeh $7\,\text{cm}$), $C \leftrightarrow E$. Zapišemo $\triangle ABC \cong \triangle FDE$.
4. Ujemajoči se koti so enaki: $\delta = \beta \approx 85^\circ$.
5. V trikotniku $ABC$: $\alpha \approx 180^\circ - 50^\circ - 85^\circ = 45^\circ$, zato je $\varphi = \alpha \approx 45^\circ$. Smiselno: nasproti krajše stranice $a$ leži manjši kot.
6. Odgovor: trikotnika (in s tem stranici stojal) sta skladna po izreku SKS, $\delta \approx 85^\circ$, $\varphi \approx 45^\circ$, $\alpha \approx 45^\circ$.

### Primer 3 (težji)

Stranska ploskev stojala za tablico je pravokotni trikotnik s katetama $a = 6\,\text{cm}$ in $b = 8\,\text{cm}$. Izračunaj hipotenuzo $c$, polmer $R$ očrtane krožnice, polmer $r$ včrtane krožnice in razdaljo težišča $T$ od oglišča $C$ s pravim kotom.

**Podatki:** pravokotni trikotnik, $a = 6\,\text{cm}$, $b = 8\,\text{cm}$, pravi kot pri $C$
**Iščemo:** hipotenuzo $c$, polmera $R$ in $r$, razdaljo $|TC|$

:::formula
$c^2 = a^2 + b^2$, $\;R = \dfrac{c}{2}$ (Talesov izrek), $\;S = \dfrac{a b}{2}$, $\;S = r \cdot s$, $\;|TC| = \dfrac{2}{3}\, t_c$
:::

**Rešitev:**

1. Hipotenuza: $c = \sqrt{6^2 + 8^2} = \sqrt{100} = 10\,\text{cm}$.
2. Po Talesovem izreku leži $C$ na krožnici s premerom $AB$, zato je središče $O$ očrtane krožnice na sredini hipotenuze: $R = \dfrac{c}{2} = 5\,\text{cm}$.
3. Ploščina: $S = \dfrac{6 \cdot 8}{2} = 24\,\text{cm}^2$, polobseg $s = \dfrac{6 + 8 + 10}{2} = 12\,\text{cm}$.
4. Polmer včrtane krožnice: $r = \dfrac{S}{s} = \dfrac{24}{12} = 2\,\text{cm}$.
5. Težiščnica $t_c$ iz oglišča $C$ vodi do sredine hipotenuze, torej do središča $O$, zato je $t_c = R = 5\,\text{cm}$.
6. Težišče deli težiščnico v razmerju $2:1$ od oglišča: $|TC| = \dfrac{2}{3} \cdot 5\,\text{cm} = \dfrac{10}{3}\,\text{cm} \approx 3{,}33\,\text{cm}$.
7. Odgovor: $c = 10\,\text{cm}$, $R = 5\,\text{cm}$, $r = 2\,\text{cm}$, $|TC| = \dfrac{10}{3}\,\text{cm} \approx 3{,}33\,\text{cm}$.

### Primer 4 – zdaj ti

Telefon je od oddajnika A oddaljen $4\,\text{km}$, od oddajnika B pa $7\,\text{km}$. Telefon in oddajnika ne ležijo na isti premici. Med katerima mejama je razdalja $c$ med oddajnikoma?

**Podatki:** $a = 4\,\text{km}$, $b = 7\,\text{km}$, točke niso na isti premici
**Iščemo:** meje za razdaljo $c$

:::formula
$|a - b| < c < a + b$
:::

**Rešitev:**

1. Telefon in oddajnika so oglišča trikotnika, zato zanj velja trikotniška neenakost.
2. Spodnja meja je razlika znanih stranic, zgornja meja njuna vsota.
3. Izračunaj obe meji in zapiši odgovor.

:::premisli
Kateri sta meji?
---
$7 - 4 = 3$ in $7 + 4 = 11$, zato je $3\,\text{km} < c < 11\,\text{km}$. Razdalja $9\,\text{km}$ je torej mogoča, $12\,\text{km}$ pa ne.
:::

### Primer 5: okno v obliki pravilnega večkotnika

Okno v stolpu ima obliko pravilnega večkotnika. Mizar je izmeril, da vsak njegov notranji kot meri $140^\circ$. Koliko oglišč in koliko diagonal ima okno? Kolikšna je vsota njegovih notranjih kotov?

**Podatki:** pravilni večkotnik, notranji kot $\varphi = 140^\circ$
**Iščemo:** število oglišč $n$, število diagonal $d_n$, vsoto notranjih kotov

:::formula
Zunanji kot $\varphi' = 180^\circ - \varphi = \dfrac{360^\circ}{n}$; $\;d_n = \dfrac{n(n - 3)}{2}$; vsota notranjih kotov je $(n - 2) \cdot 180^\circ$.
:::

**Rešitev:**

1. Zunanji kot je sokot notranjega: $\varphi' = 180^\circ - 140^\circ = 40^\circ$.
2. Vsi zunanji koti so enaki in skupaj merijo $360^\circ$, zato je $n = \dfrac{360^\circ}{40^\circ} = 9$. Okno je devetkotnik.
3. Diagonale: $d_9 = \dfrac{9 \cdot 6}{2} = 27$.
4. Vsota notranjih kotov: $(9 - 2) \cdot 180^\circ = 7 \cdot 180^\circ = 1260^\circ$.
5. Preizkus: devet kotov po $140^\circ$ da $9 \cdot 140^\circ = 1260^\circ$, kar se ujema.
6. Odgovor: okno je pravilni devetkotnik s $27$ diagonalami, vsota notranjih kotov je $1260^\circ$.

## Pogoste napake

- **Kot, ki ni med stranicama, pri SKS.** Trikotnika se ujemata v dveh stranicah in nekem kotu, zato »sta skladna«. Razlog napake: kot nasproti ene od stranic ne določa trikotnika enolično. Pravilno: pri SKS mora biti kot natanko med znanima stranicama. Če kot leži nasproti ene od njiju, uporabi SsK in preveri, da leži nasproti **daljše** od obeh stranic.
- **Preverjanje neenakosti le za eno stranico.** Za trojico $4$, $5$, $10$ nekdo preveri samo $5 < 4 + 10$ in sklene, da trikotnik obstaja. Razlog: trikotniška neenakost mora veljati za vse tri stranice hkrati. Pravilno: primerjaj **najdaljšo** stranico z vsoto drugih dveh. Če je ta vsota večja, so izpolnjeni vsi pogoji. Enakost ne zadošča: pri $3$, $4$, $7$ je $3 + 4 = 7$ in točke ležijo na premici.
- **Zamenjava značilnih premic.** Višina je pravokotna na nasprotno stranico, težiščnica pa gre do njene sredine. Razlog: obe potegnemo iz oglišča in sta pogosto podobni. Pravilno: pri težiščnici pomeni »sredina«, pri višini »pravi kot«. Sovpadata le v enakokrakem trikotniku za osnovnico. Podobno se zamenjata simetrali: točka, enako oddaljena od treh **oglišč**, je na simetralah stranic, točka, enako oddaljena od treh **stranic**, pa na simetralah kotov.
- **Težišče deli težiščnico v razmerju $1:1$ ali je bliže oglišču.** Razlog: iz besede »sredina« prenesemo vtis, da je težišče »na polovici«, ali pa razmerje $2:1$ beremo od stranice. Pravilno: od oglišča do $T$ je dve tretjini težiščnice, od $T$ do sredine stranice pa ena tretjina.
- **Višinska točka vedno znotraj trikotnika.** Razlog: tako je pri ostrokotnih trikotnikih, ki jih največ rišemo. Pravilno: pri topokotnem trikotniku se nosilke višin sekajo zunaj trikotnika, pri pravokotnem je $V$ v oglišču pravega kota.

## Povzetek

- Vsota notranjih kotov: $\alpha + \beta + \gamma = 180^\circ$; zunanji kot je enak vsoti nenaležnih notranjih.
- Trikotniška neenakost: $|a - b| < c < a + b$ (za vse tri stranice).
- Skladnost: SSS, SKS, KSK, SsK (kot nasproti daljše stranice).
- Simetrale stranic dajo središče očrtane krožnice, simetrale kotov središče včrtane krožnice.
- Težiščnice se sekajo v težišču, ki deli težiščnico $2:1$ od oglišča; višine se sekajo v višinski točki.
- Včrtana krožnica: $r = \dfrac{S}{s}$; v pravokotnem trikotniku je $R = \dfrac{c}{2}$.
- Pitagorov izrek v pravokotnem trikotniku: $a^2 + b^2 = c^2$.
- $n$-kotnik: vsota notranjih kotov $(n - 2) \cdot 180^\circ$, vsota zunanjih $360^\circ$, diagonal $\frac{n(n - 3)}{2}$; pravilni $n$-kotnik ima zunanji kot $\frac{360^\circ}{n}$.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Zunanji kot pri oglišču $C$ trikotnika $ABC$ meri $126^\circ$. Notranji kot $\alpha$ je za $18^\circ$ večji od notranjega kota $\beta$. Izračunaj vse tri notranje kote trikotnika in utemelji, katera stranica trikotnika je najdaljša.

**Rešitev:**

1. Notranji kot pri $C$ je sokot zunanjega: $\gamma = 180^\circ - 126^\circ = 54^\circ$.
2. Zunanji kot je enak vsoti nenaležnih notranjih kotov: $\alpha + \beta = 126^\circ$. Ker je $\alpha - \beta = 18^\circ$, sledi $2\alpha = 126^\circ + 18^\circ = 144^\circ$, zato $\alpha = 72^\circ$ in $\beta = 126^\circ - 72^\circ = 54^\circ$.
3. Preverimo: $72^\circ + 54^\circ + 54^\circ = 180^\circ$.
4. Nasproti največjega kota leži najdaljša stranica. Največji kot je $\alpha = 72^\circ$, zato je najdaljša stranica $a$. Ker je $\beta = \gamma$, je $b = c$: trikotnik je enakokrak z osnovnico $a$.
5. Odgovor: $\alpha = 72^\circ$, $\beta = 54^\circ$, $\gamma = 54^\circ$; najdaljša je stranica $a$, ker leži nasproti največjega kota.

**Točkovanje:** 1 točka za $\gamma = 54^\circ$ in zvezo $\alpha + \beta = 126^\circ$, 1 točka za $\alpha = 72^\circ$ in $\beta = 54^\circ$, 1 točka za najdaljšo stranico $a$ z utemeljitvijo (nasproti večjega kota leži večja stranica).

### Naloga 2: krajša strukturirana naloga, 8 točk, pola 2 (z računalom)

Enakokraki trikotnik $ABC$ ima osnovnico $c = |AB| = 10\,\text{cm}$ in kraka $a = b = 7\,\text{cm}$. Točka $D$ je razpolovišče osnovnice $AB$.

a) Izračunaj višino $v_c$ in ploščino trikotnika. Rezultata zaokroži na stotinko. (2 točki)
b) Utemelji, ali je kot $\gamma$ pri vrhu $C$ oster, pravi ali top, in ugotovi, ali središče $O$ očrtane krožnice leži znotraj trikotnika. (2 točki)
c) Izračunaj polmer $r$ včrtane krožnice. Rezultat zaokroži na stotinko centimetra. (2 točki)
d) Izračunaj razdaljo težišča $T$ od vrha $C$. Rezultat zaokroži na stotinko centimetra. (2 točki)

**Rešitev:**

1. a) V enakokrakem trikotniku pade višina iz vrha $C$ v razpolovišče $D$ osnovnice. Trikotnik $ADC$ je pravokoten s pravim kotom pri $D$, s hipotenuzo $b = 7\,\text{cm}$ in kateto $|AD| = 5\,\text{cm}$.
2. a) $v_c = |DC| = \sqrt{7^2 - 5^2}\,\text{cm} = \sqrt{24}\,\text{cm} \approx 4{,}899\,\text{cm} \approx 4{,}90\,\text{cm}$.
3. a) $S = \dfrac{c \cdot v_c}{2} = \dfrac{10 \cdot \sqrt{24}}{2}\,\text{cm}^2 = 5\sqrt{24}\,\text{cm}^2 \approx 24{,}495\,\text{cm}^2 \approx 24{,}49\,\text{cm}^2$.
4. b) V pravokotnem trikotniku $ADC$ je $|AD| = 5\,\text{cm} > |DC| \approx 4{,}90\,\text{cm}$. Nasproti večje stranice leži večji kot, zato je $\angle ACD > \angle CAD$. Kota skupaj merita $90^\circ$, zato je $\angle ACD > 45^\circ$.
5. b) Trikotnika $ADC$ in $BDC$ sta skladna (SSS), zato višina razpolovi kot pri vrhu in je $\gamma = 2 \cdot \angle ACD > 90^\circ$: kot $\gamma$ je top. (Enako sledi iz Talesovega izreka: $C$ leži znotraj krožnice s premerom $AB$, ker je $|DC| < 5\,\text{cm}$.)
6. b) Trikotnik je topokoten, zato središče $O$ očrtane krožnice leži zunaj trikotnika (onkraj osnovnice $AB$).
7. c) Polobseg: $s = \dfrac{10 + 7 + 7}{2}\,\text{cm} = 12\,\text{cm}$.
8. c) $r = \dfrac{S}{s} = \dfrac{5\sqrt{24}}{12}\,\text{cm} \approx 2{,}041\,\text{cm} \approx 2{,}04\,\text{cm}$.
9. d) Težiščnica $t_c$ gre od $C$ do razpolovišča $D$, torej sovpada z višino: $t_c = v_c = \sqrt{24}\,\text{cm}$.
10. d) Težišče deli težiščnico v razmerju $2:1$ od oglišča: $|TC| = \dfrac{2}{3}\sqrt{24}\,\text{cm} \approx 3{,}266\,\text{cm} \approx 3{,}27\,\text{cm}$.
11. Odgovor: a) $v_c \approx 4{,}90\,\text{cm}$, $S \approx 24{,}49\,\text{cm}^2$; b) kot $\gamma$ je top, $O$ leži zunaj trikotnika; c) $r \approx 2{,}04\,\text{cm}$; d) $|TC| \approx 3{,}27\,\text{cm}$.

**Točkovanje:** a) 1 točka za $v_c \approx 4{,}90\,\text{cm}$ in 1 točka za $S \approx 24{,}49\,\text{cm}^2$; b) 1 točka za utemeljitev, da je $\gamma$ top (primerjava $|AD| > |DC|$, Talesov izrek ali enakovredno), 1 točka za sklep, da $O$ leži zunaj trikotnika; c) 1 točka za $s = 12\,\text{cm}$, 1 točka za $r \approx 2{,}04\,\text{cm}$; d) 1 točka za $t_c = v_c$, 1 točka za $|TC| \approx 3{,}27\,\text{cm}$.

### Ustno vprašanje 1

:::premisli
Dokaži, da je vsota notranjih kotov trikotnika $180^\circ$, in izpelji, koliko meri zunanji kot trikotnika.
---
Skozi oglišče $C$ potegnemo vzporednico stranici $AB$. Ob kotu $\gamma$ nastaneta pri $C$ še dva kota, ki sta kot izmenična kota ob vzporednicah enaka kotoma $\alpha$ in $\beta$. Ti trije koti skupaj tvorijo iztegnjeni kot, zato je $\alpha + \beta + \gamma = 180^\circ$. Zunanji kot pri $C$ je sokot notranjega kota, $\gamma' = 180^\circ - \gamma$. Iz vsote kotov sledi $\gamma' = \alpha + \beta$, torej je zunanji kot enak vsoti nenaležnih notranjih kotov.
:::

### Ustno vprašanje 2

:::premisli
Naštej izreke o skladnosti trikotnikov in pojasni, kakšen pogoj velja pri izreku SsK.
---
Trikotnika sta skladna, če se ujemata v vseh treh stranicah (SSS) ali v dveh stranicah in kotu med njima (SKS). Skladna sta tudi, če se ujemata v stranici in obeh kotih ob njej (KSK) ali v dveh stranicah in kotu nasproti daljše od njiju (SsK). Pri izreku SsK mora kot ležati nasproti daljše stranice. Če leži nasproti krajše, lahko krožnica s središčem v tistem krajišču daljše stranice, ki ni vrh kota, in s polmerom krajše stranice seka drugi krak kota v dveh točkah, zato z istimi podatki dobimo dva neskladna trikotnika.
:::

### Ustno vprašanje 3

:::premisli
Pojasni, zakaj se simetrale vseh treh stranic trikotnika sekajo v eni točki, in povej, kaj je ta točka.
---
Točke simetrale daljice so natanko tiste, ki so enako oddaljene od njenih krajišč. Presečišče $O$ simetral stranic $AB$ in $BC$ zato zadošča $|OA| = |OB|$ in $|OB| = |OC|$. Sledi $|OA| = |OC|$, zato $O$ leži tudi na simetrali stranice $AC$. Točka $O$ je enako oddaljena od vseh treh oglišč, zato je središče trikotniku očrtane krožnice. Pri ostrokotnem trikotniku leži znotraj trikotnika, pri pravokotnem na sredini hipotenuze, pri topokotnem zunaj.
:::

## Drugače: Na sliki

V simulaciji spodaj »Trikotnik: stranice in koti« vleci oglišče $C$ proti daljici $AB$. Kot $\gamma$ raste proti $180^\circ$, kota $\alpha$ in $\beta$ padata proti $0^\circ$, vsota pa ves čas kaže $180^\circ$. Hkrati vidiš trikotniško neenakost: ko je $C$ skoraj na daljici, je $a + b$ le malo večje od $c$.

V simulaciji »Značilne točke trikotnika« spreminjaj obliko trikotnika in primerjaj s tabelo.

| Vrsta trikotnika | $O$ (očrtana) | $V$ (višinska točka) |
|---|---|---|
| ostrokotni | znotraj | znotraj |
| pravokotni | sredina hipotenuze | oglišče pravega kota |
| topokotni | zunaj | zunaj |

## Drugače: Iz vsakdanjega življenja

**Težišče.** Trikotnik iz kartona uravnovesiš na konici svinčnika natanko v težišču. Najdeš ga tako, da trikotnik prepogneš, da dobiš sredine stranic, in potegneš težiščnice.

**Središče očrtane krožnice.** Oddajnik za tri vasi, ki naj bo od vseh enako daleč, postaviš v presečišče simetral dveh povezav med vasmi. Če je trikotnik vasi topokoten, je to mesto zunaj trikotnika.

**Središče včrtane krožnice.** Na trikotnem trgu med tremi cestami je to mesto, ki je od vseh treh robov enako daleč. Največji okrogel vodnjak, ki ga lahko postaviš na trg, ima polmer $r$.

**Togost.** Okvir kolesa in ogrodje strehe sta iz trikotnikov: po izreku SSS tri palice določajo eno samo obliko, štirikotnik iz palic pa se zvije.

## Drugače: Bolj natančno

**Zakaj se simetrale stranic sekajo v eni točki?** Točke simetrale daljice $AB$ so natanko tiste, ki so enako oddaljene od $A$ in $B$. Presečišče simetral stranic $AB$ in $BC$ je zato točka $O$ z $|OA| = |OB|$ in $|OB| = |OC|$, torej tudi $|OA| = |OC|$. Točka $O$ leži zato tudi na simetrali stranice $AC$. Enako dokažemo za simetrale kotov, kjer so točke simetrale kota natanko tiste, ki so enako oddaljene od obeh krakov.

## Preveri se

? Katera trojica dolžin (v $\text{cm}$) je lahko stranice trikotnika?
- $4$, $5$, $10$
~ Preveril si le $4 + 10 > 5$. Najdaljša stranica $10$ je daljša od $4 + 5 = 9$.
- $3$, $4$, $7$
~ Velja $3 + 4 = 7$: točke ležijo na isti premici. Vsota mora biti strogo večja.
+ $5$, $6$, $10$
> Najdaljša stranica je $10$, vsota drugih dveh je $11 > 10$, zato trikotnik obstaja.

? Težiščnica trikotnika je dolga $8\,\text{cm}$. Približno kako daleč od oglišča je težišče?
- $4\,\text{cm}$
~ Težišče ni na polovici težiščnice; razmerje je $2:1$, ne $1:1$.
- približno $2{,}7\,\text{cm}$
~ To je ena tretjina, razdalja od težišča do sredine stranice. Razmerje $2:1$ velja od oglišča.
+ približno $5{,}3\,\text{cm}$
> Od oglišča do težišča sta dve tretjini težiščnice: $\dfrac{2}{3} \cdot 8 \approx 5{,}3\,\text{cm}$.

? Zakaj dve stranici in kot nasproti **krajše** od njiju ne zadoščajo za skladnost?
- Ker trije podatki nikoli ne zadoščajo.
~ Trije podatki zadoščajo, če so pravi: SSS, SKS, KSK.
+ Ker lahko z istimi podatki narišemo dva različna trikotnika.
- Ker bi bila vsota kotov večja od $180^\circ$.
~ Vsota kotov je v vsakem narisanem trikotniku $180^\circ$; težava je v tem, da trikotnik ni določen enolično.
> Krog s polmerom krajše stranice lahko seka krak kota v dveh točkah, zato dobimo dva neskladna trikotnika. Pri kotu nasproti daljše stranice je presečišče eno samo (SsK).

? Višinska točka trikotnika leži zunaj trikotnika. Kakšen je trikotnik?
- ostrokoten
~ Pri ostrokotnem trikotniku je višinska točka vedno znotraj.
- pravokoten
~ Pri pravokotnem trikotniku je višinska točka v oglišču pravega kota, torej na trikotniku.
+ topokoten
> Le pri topokotnem trikotniku se nosilke višin sekajo zunaj trikotnika.

? Brezžični usmerjevalnik želimo postaviti tako, da bo enako daleč od treh računalnikov v pisarni. Kje je to mesto?
- v težišču trikotnika z oglišči v računalnikih
~ Težišče je presečišče težiščnic; v splošnem ni enako oddaljeno od oglišč.
- v presečišču simetral kotov
~ Ta točka je enako oddaljena od treh **stranic**, ne od treh oglišč.
+ v presečišču simetral stranic
> Točke simetrale stranice so enako oddaljene od njenih krajišč, zato je presečišče simetral (središče očrtane krožnice) enako oddaljeno od vseh treh računalnikov.

? (brez računala) Koliko diagonal ima osemkotnik?
= 20
~ 40 | To je $8 \cdot 5$: vsako diagonalo si štel dvakrat, enkrat z vsakega krajišča. Deli še z $2$.
~ 28 | To so vse daljice med oglišči, $\frac{8 \cdot 7}{2}$. Mednje spada tudi $8$ stranic, ki niso diagonale.
~ 5 | Toliko diagonal gre iz enega oglišča ($8 - 3$). Oglišč pa je $8$.
> Iz vsakega oglišča gre $8 - 3 = 5$ diagonal, vseh skupaj je $d_8 = \dfrac{8 \cdot 5}{2} = 20$.

:::simboli
\alpha, \beta, \gamma | notranji koti trikotnika | | |
\gamma' | zunanji kot pri oglišču C | \gamma' = 180^\circ - \gamma = \alpha + \beta | |
a, b, c | stranice trikotnika | | | v pravokotnem trikotniku je $c$ hipotenuza
S | ploščina trikotnika | S = r \cdot s | |
r | polmer včrtane krožnice | r = \frac{S}{s} | |
s | polobseg | s = \frac{a + b + c}{2} | |
R | polmer očrtane krožnice | | | v pravokotnem trikotniku $R = \frac{c}{2}$
O | središče očrtane krožnice | | | presečišče simetral stranic
I | središče včrtane krožnice | | | presečišče simetral kotov
V | višinska točka | | | presečišče nosilk višin
T | težišče | | | deli težiščnico v razmerju $2:1$ od oglišča
C | oglišče trikotnika | | | v Primeru 3 oglišče s pravim kotom
t_c | težiščnica iz oglišča C | | |
v_c | višina na stranico c | S = \frac{c \cdot v_c}{2} | |
n | število oglišč (in stranic) večkotnika | | |
\alpha_1, \alpha_2, \alpha_n | notranji koti $n$-kotnika | | | vsota $(n - 2) \cdot 180^\circ$
d_n | število diagonal $n$-kotnika | d_n = \frac{n(n - 3)}{2} | |
\varphi | notranji kot pravilnega $n$-kotnika | \varphi = \frac{(n - 2) \cdot 180^\circ}{n} | | v Primeru 2 kot pri oglišču $F$ trikotnika $DEF$
\varphi' | zunanji kot pravilnega $n$-kotnika | \varphi' = \frac{360^\circ}{n} | |
:::

<<RACUN
vrednost: 180-126 | 54
vrednost: (126+18)/2 | 72
vrednost: (126-18)/2 | 54
vrednost: 72+54+54 | 180
vrednost: sqrt(7^2-5^2) | 4.90
vrednost: 10*sqrt(24)/2 | 24.49
vrednost: (10+7+7)/2 | 12
vrednost: 5*sqrt(24)/12 | 2.04
vrednost: 2*sqrt(24)/3 | 3.27
vrednost: 180-140 | 40
vrednost: 360/40 | 9
vrednost: 9*(9-3)/2 | 27
vrednost: (9-2)*180 | 1260
vrednost: 9*140 | 1260
vrednost: 8*(8-3)/2 | 20
vrednost: 6*(6-3)/2 | 9
vrednost: (6-2)*180/6 | 120
>>
