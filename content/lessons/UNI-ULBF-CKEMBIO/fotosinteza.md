---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na poskusnem polju sta drug ob drugem posejana pšenica in koruza. V hladni pomladi raste pšenica bolje. V vročem, suhem juliju pa koruza na enaki površini veže precej več ogljika, čeprav obe rastlini uporabljata isti encim za vezavo $\mathrm{CO_2}$ in enake svetlobne reakcije. Agronom, ki načrtuje kolobar, in biotehnolog, ki želi v riž vgraditi lastnosti koruze, morata vedeti, zakaj.

Odgovor je v kemiji. Encim RuBisCO, ki veže $\mathrm{CO_2}$, se »zmoti« in včasih veže kisik; v vročini pogosteje. Koruza ima dodaten mehanizem, ki okoli RuBisCO zgosti $\mathrm{CO_2}$, a za to porabi več ATP. Lekcija pokaže, od kod pridejo ATP in NADPH, kako jih porabi Calvinov cikel in kdaj se rastlini C4 dodatni strošek splača.

## Razlaga

### Slika 1: kloroplast

Kloroplast si predstavljaj kot podolgovato kapsulo z dvojno ovojnico. Notranjost je gosta raztopina encimov, **stroma**. V njej so naloženi sploščeni membranski mešički, **tilakoidi**; kupček tilakoidov je **granum**. Prostor znotraj tilakoida je **lumen**.

- V **membrani tilakoidov** potekajo **svetlobne reakcije**: absorpcija svetlobe, prenos elektronov, nastanek ATP in NADPH.
- V **stromi** poteka **Calvinov cikel**, ki z ATP in NADPH reducira $\mathrm{CO_2}$ v sladkor.

Celotna enačba, ki jo poznaš iz srednje šole, skriva dve ločeni stopnji:

$$6\,\mathrm{CO_2} + 12\,\mathrm{H_2O} \rightarrow \mathrm{C_6H_{12}O_6} + 6\,\mathrm{O_2} + 6\,\mathrm{H_2O}$$

Na levi je $12$ molekul vode, ker ves kisik $\mathrm{O_2}$ izvira iz vode (dokazano z izotopom $^{18}\mathrm O$), ne iz $\mathrm{CO_2}$. Standardna sprememba Gibbsove energije je okoli $+2870\,\mathrm{kJ}$ na mol glukoze, torej okoli $478\,\mathrm{kJ}$ na mol vezanega $\mathrm{CO_2}$.

### Slika 2: pigmenti in svetloba

**Klorofil a** in **klorofil b** močno absorbirata modro (okoli $430\,\mathrm{nm}$) in rdečo svetlobo (okoli $660\,\mathrm{nm}$), zeleno pa odbijata. **Karotenoidi** absorbirajo modro in zeleno ter ščitijo pred presežno svetlobo. Pigmenti so vgrajeni v proteinske komplekse: **antene** zbirajo svetlobo in energijo prenesejo v **reakcijski center**, kjer par molekul klorofila a odda elektron.

Energija enega fotona je

$$E = \frac{h c}{\lambda}$$

Pri $680\,\mathrm{nm}$ je to okoli $176\,\mathrm{kJ}$ na mol fotonov. Modri foton ima več energije, a presežek se v anteni izgubi kot toplota: vsak absorbiran foton v reakcijskem centru deluje kot »rdeč«.

### Slika 3: Z-shema

Prenos elektronov narišemo kot črko Z, postavljeno na bok. Navpično je energija elektrona (bolj zgoraj je močnejši reducent), vodoravno zaporedje prenašalcev:

```
 P680*            P700*
  ^  \             ^  \
  |   PQ           |   Fd
  |    \           |    \
  |    b6f         |   NADPH
  |      \         |
  |       PC ----> P700
 P680
  ^
 H2O
```

Navpični puščici sta vzbujanji s svetlobo.

1. **Fotosistem II** (reakcijski center **P680**): foton vzbudi P680, ta odda elektron. Nastali $\mathrm{P680^+}$ je najmočnejši znani biološki oksidant in z **manganovim kompleksom** odvzame elektrone vodi: $2\,\mathrm{H_2O} \rightarrow \mathrm{O_2} + 4\,\mathrm{H^+} + 4\,e^-$. Protoni ostanejo v lumnu.
2. Elektron gre na **plastokinon** (PQ), ki se v membrani giblje in prenese elektrone ter protone na **citokrom $b_6f$**. Ta s ciklom Q prečrpa v lumen $2$ protona na vsak elektron.
3. **Plastocianin** (PC), majhen protein z bakrom v lumnu, prenese elektron do **fotosistema I** (**P700**).
4. Drugi foton vzbudi P700. Elektron prek **feredoksina** (Fd) in encima feredoksin-NADP$^+$-reduktaze reducira $\mathrm{NADP^+}$ v **NADPH** na strani strome.

Za vsak elektron od vode do NADPH sta potrebna **dva fotona**, po en na fotosistem.

**ATP sintaza.** Lumen se napolni s protoni (pH okoli $5$, stroma okoli $8$). Protoni tečejo nazaj v stromo skozi ATP sintazo in ta tvori ATP iz ADP in fosfata (**fotofosforilacija**, kemiosmotski mehanizem). V kloroplastih ima vrtljivi obroč sintaze $14$ podenot, en obrat da $3$ ATP, torej potrebuje okoli $14/3 \approx 4{,}67$ protona na ATP.

**Ciklični tok elektronov.** Feredoksin lahko elektron vrne na citokrom $b_6f$ namesto na $\mathrm{NADP^+}$. Tedaj nastane le gradient protonov in s tem ATP, NADPH pa ne. Rastlina tako uravnava razmerje ATP proti NADPH.

:::premisli
Herbicid DCMU (diuron) zapre vezavno mesto za plastokinon v fotosistemu II. Kaj se zgodi s sproščanjem kisika in s tvorbo NADPH?
---
Oboje se ustavi. Elektroni iz P680 ne morejo naprej, zato se P680 ne reducira nazaj in voda se ne oksidira: kisika ni. Fotosistem I ne dobi elektronov, zato ni NADPH. Ciklični tok okoli fotosistema I lahko še nekaj časa tvori ATP.
:::

### Slika 4: Calvinov cikel

Cikel si predstavljaj kot krožno tekočo progo s tremi postajami. Na vsak obrat vstopi ena molekula $\mathrm{CO_2}$.

1. **Karboksilacija.** Encim **RuBisCO** (ribuloza-1,5-bisfosfat-karboksilaza/oksigenaza) veže $\mathrm{CO_2}$ na ribulozo-1,5-bisfosfat (RuBP, $5$ C). Nastali nestabilni $6$-C produkt razpade v dve molekuli **3-fosfoglicerata** ($3$ C). Rastline s tem prvim produktom imenujemo **rastline C3**.
2. **Redukcija.** 3-fosfoglicerat se z ATP fosforilira v 1,3-bisfosfoglicerat, NADPH ga reducira v **gliceraldehid-3-fosfat** (G3P, triozafosfat). Na en $\mathrm{CO_2}$: $2$ ATP in $2$ NADPH.
3. **Regeneracija.** Iz petih triozafosfatov se v vrsti reakcij obnovijo tri molekule RuBP, za kar je potreben še $1$ ATP na $\mathrm{CO_2}$.

Bilanca: $3$ ATP in $2$ NADPH na vezan $\mathrm{CO_2}$. Iz treh obratov ostane en triozafosfat, ki gre v sintezo saharoze (citosol) ali škroba (stroma).

### Slika 5: fotorespiracija in rastline C4

RuBisCO je počasen (nekaj reakcij na sekundo) in ne loči dobro $\mathrm{CO_2}$ od $\mathrm{O_2}$. Ob **oksigenaciji** veže kisik: nastane en 3-fosfoglicerat in en **2-fosfoglikolat**, ki ga mora celica predelati v kloroplastu, peroksisomu in mitohondriju. Pri tem se sprosti pol molekule $\mathrm{CO_2}$ na oksigenacijo in porabita se ATP in redukcijski ekvivalenti. To je **fotorespiracija**. Razmerje oksigenacij proti karboksilacijam $\varphi$ raste s temperaturo (topnost $\mathrm{CO_2}$ pada hitreje od topnosti $\mathrm{O_2}$) in ko so listne reže zaprte.

**Rastline C4** (koruza, sladkorni trs, proso) prostorsko ločita vezavo:

- v **mezofilnih celicah** encim **PEP-karboksilaza**, ki nima afinitete do kisika, veže $\mathrm{HCO_3^-}$ na fosfoenolpiruvat; nastane oksaloacetat ($4$ C), nato malat;
- malat potuje v **celice žilnega ovoja** (venčasta ali Kranzova zgradba lista), kjer se dekarboksilira; tam je $\mathrm{CO_2}$ okoli desetkrat bolj zgoščen in RuBisCO skoraj ne oksigenira;
- piruvat se vrne v mezofil, kjer ga encim piruvat-fosfat-dikinaza z ATP spremeni nazaj v PEP. Ta korak porabi $2$ ekvivalenta ATP (ATP $\rightarrow$ AMP).

Rastlina C4 torej porabi $5$ ATP in $2$ NADPH na vezan $\mathrm{CO_2}$, a skoraj nima fotorespiracije. **Rastline CAM** (ananas, kaktusi) ločijo isti korak časovno: $\mathrm{CO_2}$ vežejo ponoči, ko so reže odprte, podnevi pa ga sproščajo za Calvinov cikel.

:::premisli
Zakaj ima rastlina C4 prednost v vročem in suhem, a ne v hladnem in vlažnem podnebju?
---
V vročini je $\varphi$ velik, zato rastlina C3 izgubi veliko energije s fotorespiracijo; mehanizem C4 to prepreči in se splača kljub dvema dodatnima ATP. Pri nizki temperaturi je fotorespiracije malo, dodatni ATP rastline C4 pa ostane strošek.
:::

## Rešeni primeri

### Primer 1 (lažji): energija fotonov

Izračunaj energijo enega fotona in enega mola fotonov pri valovnih dolžinah reakcijskih centrov $680\,\mathrm{nm}$ in $700\,\mathrm{nm}$.

**Podatki:** $\lambda_1 = 680\,\mathrm{nm}$, $\lambda_2 = 700\,\mathrm{nm}$, $h = 6{,}626 \cdot 10^{-34}\,\mathrm{J\,s}$, $c = 2{,}998 \cdot 10^{8}\,\mathrm{m/s}$, $N_\mathrm{A} = 6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}$
**Iščemo:** $E$ na foton in $E_\mathrm{m}$ na mol fotonov

:::formula
$E = \dfrac{h c}{\lambda}$, $E_\mathrm{m} = N_\mathrm{A} E$
:::

**Rešitev:**

1. Pri $680\,\mathrm{nm}$: $E = \dfrac{6{,}626 \cdot 10^{-34} \cdot 2{,}998 \cdot 10^{8}}{680 \cdot 10^{-9}} \approx 2{,}92 \cdot 10^{-19}\,\mathrm J$.
2. Na mol: $E_\mathrm{m} \approx 2{,}921 \cdot 10^{-19} \cdot 6{,}022 \cdot 10^{23} \approx 1{,}76 \cdot 10^{5}\,\mathrm{J/mol} = 176\,\mathrm{kJ/mol}$.
3. Pri $700\,\mathrm{nm}$: $E \approx 2{,}84 \cdot 10^{-19}\,\mathrm J$, $E_\mathrm{m} \approx 171\,\mathrm{kJ/mol}$.
4. Odgovor: foton pri $680\,\mathrm{nm}$ nosi $2{,}92 \cdot 10^{-19}\,\mathrm J$ ($176\,\mathrm{kJ/mol}$), pri $700\,\mathrm{nm}$ $2{,}84 \cdot 10^{-19}\,\mathrm J$ ($171\,\mathrm{kJ/mol}$). Daljša valovna dolžina pomeni manj energije, zato je P700 vzbujen z nekoliko šibkejšimi fotoni.

### Primer 2: bilanca za eno molekulo glukoze

Koliko ATP, NADPH, fotonov in molekul vode se porabi ter koliko $\mathrm{O_2}$ nastane, ko rastlina C3 brez fotorespiracije sintetizira eno molekulo glukoze? Za zdaj upoštevaj samo linearni tok elektronov.

**Podatki:** Calvinov cikel $3$ ATP in $2$ NADPH na $\mathrm{CO_2}$; $2$ elektrona na NADPH; $2$ fotona na elektron; $4$ elektrone iz $2\,\mathrm{H_2O}$ na $\mathrm{O_2}$; glukoza ima $6$ C
**Iščemo:** število ATP, NADPH, fotonov, $\mathrm{O_2}$ in oksidiranih molekul vode

:::formula
na $\mathrm{CO_2}$: $3$ ATP, $2$ NADPH, $4\,e^-$, $8$ fotonov; $2\,\mathrm{H_2O} \rightarrow \mathrm{O_2} + 4\,\mathrm{H^+} + 4\,e^-$
:::

**Rešitev:**

1. Glukoza potrebuje $6$ obratov cikla: $6 \cdot 3 = 18$ ATP in $6 \cdot 2 = 12$ NADPH.
2. Elektroni: $12$ NADPH $\cdot\, 2 = 24$ elektronov.
3. Fotoni: $24 \cdot 2 = 48$ fotonov.
4. Voda: $24$ elektronov iz $12$ molekul vode, nastane $24 / 4 = 6$ molekul $\mathrm{O_2}$, kar se ujema s celotno enačbo.
5. Odgovor: $18$ ATP, $12$ NADPH, najmanj $48$ fotonov, $12$ molekul vode oksidiranih in $6$ molekul $\mathrm{O_2}$. Ali linearni tok res da $18$ ATP, preverimo v naslednjem primeru.

### Primer 3 (težji): razmerje ATP proti NADPH in izkoristek

Linearni tok elektronov prečrpa v lumen $3$ protone na elektron ($1$ iz vode, $2$ v citokromu $b_6f$). ATP sintaza potrebuje $14/3$ protona na ATP. Ciklični tok prečrpa $2$ protona na elektron in porabi $1$ foton na elektron. (a) Koliko ATP nastane z linearnim tokom na vezan $\mathrm{CO_2}$? (b) Koliko elektronov mora iti po cikličnem toku, da je ATP dovolj? (c) Koliko fotonov potrebuje rastlina C3 na $\mathrm{CO_2}$ in kolikšen je izkoristek pretvorbe energije fotonov pri $680\,\mathrm{nm}$ v energijo vezanega ogljika?

**Podatki:** $3$ H$^+$ na elektron (linearno), $2$ H$^+$ na elektron (ciklično), $14/3$ H$^+$ na ATP, potreba $3$ ATP in $2$ NADPH na $\mathrm{CO_2}$, $1$ foton na ciklični elektron, $E_\mathrm{m} = 175{,}9\,\mathrm{kJ/mol}$, $\Delta G = 478\,\mathrm{kJ}$ na mol $\mathrm{CO_2}$
**Iščemo:** ATP iz linearnega toka, ciklične elektrone, število fotonov, izkoristek $\eta$

:::formula
$n_\mathrm{ATP} = \dfrac{n_\mathrm{H}}{14/3}$, $\eta = \dfrac{\Delta G}{n_\mathrm{f}\, E_\mathrm{m}}$
:::

**Rešitev:**

1. Za $2$ NADPH so potrebni $4$ elektroni po linearnem toku, ti prečrpajo $4 \cdot 3 = 12$ protonov.
2. (a) $n_\mathrm{ATP} = \dfrac{12}{14/3} = \dfrac{18}{7} \approx 2{,}57$ ATP. To je manj od potrebnih $3$.
3. (b) Primanjkljaj: $3 - \dfrac{18}{7} = \dfrac{3}{7} \approx 0{,}43$ ATP, za kar je potrebnih $\dfrac{3}{7} \cdot \dfrac{14}{3} = 2$ protona. Ciklični tok da $2$ protona na elektron, torej je potreben $1$ ciklični elektron.
4. (c) Fotoni: linearni tok $4 \cdot 2 = 8$, ciklični $1$, skupaj $9$ fotonov na $\mathrm{CO_2}$.
5. Izkoristek: $\eta = \dfrac{478}{9 \cdot 175{,}9} \approx 0{,}302$.
6. Odgovor: linearni tok da le okoli $2{,}57$ ATP na $\mathrm{CO_2}$, zato mora en elektron na $\mathrm{CO_2}$ iti po cikličnem toku; rastlina potrebuje okoli $9$ fotonov na $\mathrm{CO_2}$ in pretvori okoli $30\,\%$ energije rdeče svetlobe v kemijsko energijo. Na polju je izkoristek glede na vso sončno svetlobo le okoli $1$ do $2\,\%$, ker se večina spektra ne absorbira, del se odbije in rastlina porabi energijo za dihanje.

### Primer 4 – zdaj ti: fotobioreaktor z algami

V cevnem fotobioreaktorju gojijo zeleno algo za pridobivanje beljakovin. Izmerjena hitrost sproščanja kisika je $2{,}4\,\mathrm{mmol}$ na liter in uro. Predpostavi, da se na vsak $\mathrm{O_2}$ veže en $\mathrm{CO_2}$ in da alge ne fotorespirirajo. Koliko $\mathrm{CO_2}$ se veže in koliko glukoze (kot ekvivalent biomase) nastane na liter in uro? Koliko fotonov rdeče svetlobe potrebujejo najmanj?

**Podatki:** hitrost $\mathrm{O_2}$ $2{,}4\,\mathrm{mmol/(L\,h)}$, razmerje $\mathrm{O_2} : \mathrm{CO_2} = 1 : 1$, $M(\mathrm{C_6H_{12}O_6}) = 180\,\mathrm{g/mol}$, $9$ fotonov na $\mathrm{CO_2}$
**Iščemo:** hitrost vezave $\mathrm{CO_2}$, nastanek glukoze, potrebne fotone

:::formula
glukoza $= \dfrac{n(\mathrm{CO_2})}{6}$, $m = n M$, fotoni $= 9\,n(\mathrm{CO_2})$
:::

**Rešitev:**

1. Vezan $\mathrm{CO_2}$: $2{,}4\,\mathrm{mmol/(L\,h)}$.
2. Glukoza: $\dfrac{2{,}4}{6} = 0{,}4\,\mathrm{mmol/(L\,h)}$, to je $0{,}4 \cdot 180 = 72\,\mathrm{mg/(L\,h)}$.
3. Izračunaj še najmanjšo potrebno količino fotonov in pomisli, zakaj je reaktor iz tankih cevi.

:::premisli
Koliko fotonov in zakaj tanke cevi?
---
$9 \cdot 2{,}4 = 21{,}6\,\mathrm{mmol}$ fotonov na liter in uro. Svetloba v gosti kulturi hitro oslabi, zato so cevi tanke (nekaj centimetrov): vse celice morajo dobiti dovolj svetlobe, sicer temne celice samo dihajo in porabljajo nastali sladkor.
:::

## Pogoste napake

- **»Kisik izvira iz $\mathrm{CO_2}$.«** Ves $\mathrm{O_2}$ nastane pri oksidaciji vode v fotosistemu II; ogljik in kisik iz $\mathrm{CO_2}$ ostaneta v sladkorju (in vodi na desni strani enačbe).
- **»Calvinov cikel je temotna reakcija in teče ponoči.«** Cikel potrebuje sproti nastajajoča ATP in NADPH, poleg tega svetloba aktivira več njegovih encimov (prek tioredoksina in pH strome). Ponoči se ustavi.
- **»En elektron, en foton.«** Pri linearnem toku sta potrebna dva fotona na elektron, po en v vsakem fotosistemu.
- **»Rastline C4 ne uporabljajo RuBisCO.«** Uporabljajo ga v celicah žilnega ovoja; PEP-karboksilaza le predhodno veže in zgosti $\mathrm{CO_2}$.
- **»Linearni tok da ravno dovolj ATP.«** Da okoli $2{,}57$ ATP na $2$ NADPH, Calvinov cikel pa potrebuje $3$; razliko pokrije ciklični tok.

## Povzetek

- Svetlobne reakcije v membrani tilakoidov: PSII (P680) oksidira vodo in sprošča $\mathrm{O_2}$, PQ, citokrom $b_6f$, PC, PSI (P700), Fd, NADPH; dva fotona na elektron.
- Gradient protonov (lumen kisel) poganja ATP sintazo, okoli $14/3$ H$^+$ na ATP; ciklični tok okoli PSI da le ATP.
- Calvinov cikel v stromi: karboksilacija z RuBisCO, redukcija v G3P, regeneracija RuBP; $3$ ATP in $2$ NADPH na $\mathrm{CO_2}$.
- Fotorespiracija: oksigenacija RuBP, izguba $\mathrm{CO_2}$ in energije, narašča s temperaturo.
- C4: PEP-karboksilaza v mezofilu, dekarboksilacija v žilnem ovoju, $5$ ATP in $2$ NADPH na $\mathrm{CO_2}$, skoraj brez fotorespiracije; CAM loči korake časovno.
- Najmanj okoli $9$ fotonov na $\mathrm{CO_2}$ pri C3, izkoristek pri rdeči svetlobi okoli $30\,\%$.

## Za izpit

Znati moraš povedati:

- zaporedje prenašalcev v Z-shemi, kje nastajajo $\mathrm{O_2}$, protoni in NADPH ter kje je lumen kisel;
- kemiosmotsko tvorbo ATP in vlogo cikličnega toka elektronov;
- tri faze Calvinovega cikla z encimom RuBisCO, produkti in bilanco ATP in NADPH;
- kaj je fotorespiracija, zakaj narašča s temperaturo in zakaj je potratna;
- mehanizem C4 (encimi, celice, strošek) in razliko do CAM;
- izračun energije fotona in števila fotonov na vezan $\mathrm{CO_2}$.

### Naloga 1

Za rastlino C3 vzemi, da na vsako karboksilacijo pride $\varphi$ oksigenacij, da vsaka oksigenacija porabi toliko ATP in NADPH kot karboksilacija in da sprosti $0{,}5$ molekule $\mathrm{CO_2}$. Brez fotorespiracije potrebuje $9$ fotonov na $\mathrm{CO_2}$. Rastlina C4 nima fotorespiracije, a porabi $5$ ATP in $2$ NADPH na $\mathrm{CO_2}$; protonska bilanca je kot v Primeru 3. (a) Koliko fotonov potrebuje rastlina C4 na $\mathrm{CO_2}$? (b) Koliko fotonov potrebuje rastlina C3 na neto vezan $\mathrm{CO_2}$ pri $\varphi = 0{,}15$ (hladno) in $\varphi = 0{,}4$ (vroče)? (c) Pri katerem $\varphi$ sta obe vrsti enako učinkoviti?

**Rešitev:**

1. (a) Linearni tok za $2$ NADPH: $8$ fotonov in $\dfrac{18}{7}$ ATP. Primanjkljaj ATP: $5 - \dfrac{18}{7} = \dfrac{17}{7} \approx 2{,}43$.
2. Protoni za primanjkljaj: $\dfrac{17}{7} \cdot \dfrac{14}{3} = \dfrac{34}{3} \approx 11{,}33$; ciklični elektroni: $\dfrac{34}{3} / 2 = \dfrac{17}{3} \approx 5{,}67$, toliko fotonov.
3. Rastlina C4: $8 + \dfrac{17}{3} = \dfrac{41}{3} \approx 13{,}67$ fotona na $\mathrm{CO_2}$.
4. (b) Rastlina C3: za $1 + \varphi$ reakcij RuBisCO porabi $9\,(1 + \varphi)$ fotonov, neto pa veže $1 - \dfrac{\varphi}{2}$ molekule $\mathrm{CO_2}$. Fotoni na neto $\mathrm{CO_2}$: $n = \dfrac{9\,(1 + \varphi)}{1 - \varphi/2}$.
5. Pri $\varphi = 0{,}15$: $n = \dfrac{9 \cdot 1{,}15}{0{,}925} \approx 11{,}19$, manj kot C4.
6. Pri $\varphi = 0{,}4$: $n = \dfrac{9 \cdot 1{,}4}{0{,}8} = 15{,}75$, več kot C4.
7. (c) Enačba $\dfrac{9\,(1 + \varphi)}{1 - \varphi/2} = \dfrac{41}{3}$ da $9 + 9\varphi = \dfrac{41}{3} - \dfrac{41}{6}\varphi$, torej $\varphi \left(9 + \dfrac{41}{6}\right) = \dfrac{14}{3}$ in $\varphi = \dfrac{28}{95} \approx 0{,}295$.
8. Odgovor: rastlina C4 potrebuje okoli $13{,}7$ fotona na $\mathrm{CO_2}$; rastlina C3 okoli $11{,}2$ v hladnem in $15{,}75$ v vročem; meja je pri $\varphi \approx 0{,}29$, kar okvirno ustreza temperaturam lista okoli $25$ do $30\,^\circ\mathrm C$. Zato je pšenica uspešnejša v hladni pomladi, koruza v vročem poletju.

### Naloga 2

Natančno opiši pot elektrona od vode do NADPH in pojasni, kako nastane gradient protonov. Utemelji, zakaj rastlina potrebuje ciklični tok elektronov, in pojasni, kaj se zgodi z razmerjem ATP proti NADPH, če se ustavi poraba NADPH.

**Rešitev:**

1. Foton vzbudi P680 v fotosistemu II; elektron gre na feofitin in plastokinona $\mathrm{Q_A}$ in $\mathrm{Q_B}$. $\mathrm{P680^+}$ dobi elektron iz tirozina, ta iz manganovega kompleksa, ki po štirih korakih oksidira dve molekuli vode v $\mathrm{O_2}$ in sprosti $4$ H$^+$ v lumen.
2. Reduciran plastokinol prenese elektrone na citokrom $b_6f$, protone pa sprosti v lumen; cikel Q skupaj prečrpa $2$ H$^+$ na elektron. Plastocianin prenese elektron na $\mathrm{P700^+}$.
3. Foton vzbudi P700; elektron gre prek železo-žveplovih centrov na feredoksin in prek reduktaze na $\mathrm{NADP^+}$; ta porabi proton iz strome, kar gradient še poveča.
4. Gradient: lumen dobi protone iz vode in iz cikla Q, stroma jih izgubi; razlika pH okoli $3$ enote. Protoni se vračajo skozi ATP sintazo.
5. Ciklični tok: linearni tok da $18/7$ ATP na $2$ NADPH, Calvinov cikel pa potrebuje $3$ ATP. Elektroni s feredoksina se vrnejo na citokrom $b_6f$; nastanejo le dodatni protoni in ATP.
6. Če se poraba NADPH ustavi (npr. zaprte reže, ni $\mathrm{CO_2}$), se $\mathrm{NADP^+}$ porabi, feredoksin ostane reduciran in elektroni se kopičijo. Rastlina preklopi na ciklični tok in sprošča presežno energijo kot toploto (nefotokemijsko dušenje), sicer nastajajo reaktivne kisikove zvrsti, ki poškodujejo fotosistem II.

## Drugače: Z analogijo

Svetlobne reakcije so kot hidroelektrarna z dvema črpalkama. Voda (elektroni) se s prvo črpalko (PSII) dvigne na hrib, steče po strugi skozi turbino (citokrom $b_6f$), ki ob tem dviga vodo v zbiralnik (protoni v lumen), nato jo druga črpalka (PSI) dvigne še višje, od koder steče v rezervoar NADPH. Zbiralnik z vodo, ki teče nazaj skozi drugo turbino, je ATP sintaza. Ciklični tok je obvod nazaj pred turbino: ni novega NADPH, je pa več protonov in ATP.

Calvinov cikel je tekoči trak v tovarni, ki vsakič naloži en ogljikov atom. Trak se ne sme prazniti, zato je pet od šestih izdelkov vrnjenih na začetek kot nov trak (regeneracija RuBP). RuBisCO je počasen delavec, ki občasno zgrabi napačen del (kisik); C4 pred njim postavi delavca, ki mu podaja le pravi del, a za plačilo dveh ATP.

## Drugače: Uporaba v stroki

- **Kmetijstvo in žlahtnjenje.** Izbira med pšenico (C3) in koruzo ali sirkom (C4) glede na podnebje; raziskovalni projekti poskušajo v riž vnesti venčasto zgradbo lista in encime C4.
- **Herbicidi.** Diuron in atrazin zaprejo mesto $\mathrm{Q_B}$ v fotosistemu II; parakvat prestreže elektrone s fotosistema I in tvori reaktivne kisikove zvrsti. Odpornost plevelov je pogosto točkovna mutacija proteina D1.
- **Merjenje fluorescence klorofila.** Prenosni fluorimetri v nekaj sekundah ocenijo največji izkoristek fotosistema II ($F_\mathrm{v}/F_\mathrm{m}$, pri zdravem listu okoli $0{,}8$). Tako se odkrije stres zaradi suše, mraza ali onesnaženja, preden je viden.
- **Biotehnologija alg.** Fotobioreaktorji za pridobivanje beljakovin, pigmentov (astaksantin, karotenoidi) in maščob; zgradba reaktorja (tanke cevi, plošče) je prilagojena prodiranju svetlobe in dovajanju $\mathrm{CO_2}$.

## Drugače: Bolj natančno

**Redoks potenciali.** Z-shema je narisana v merilu redoks potencialov: par $\mathrm{O_2/H_2O}$ ima okoli $+0{,}82\,\mathrm V$, $\mathrm{NADP^+/NADPH}$ okoli $-0{,}32\,\mathrm V$. Razlika $1{,}14\,\mathrm V$ za dva elektrona pomeni $\Delta G = -n F \Delta E$, okoli $220\,\mathrm{kJ}$ na mol NADPH. Na mol elektronov je to okoli $110\,\mathrm{kJ}$, foton pri $680\,\mathrm{nm}$ pa prinese $176\,\mathrm{kJ/mol}$. Termodinamično bi en foton zadoščal, a ločitev nabojev mora biti hitra in nepovratna, kar porabi velik del energije. En reakcijski center ne more ustvariti hkrati tako močnega oksidanta, kot je $\mathrm{P680^+}$, in tako močnega reducenta, kot je vzbujeni P700. Zato sta dva.

**Uravnavanje Calvinovega cikla.** Na svetlobi se poveča pH strome (okoli $8$) in koncentracija $\mathrm{Mg^{2+}}$, kar aktivira RuBisCO. Tioredoksin, ki ga reducira feredoksin, aktivira več encimov cikla (npr. fosforibulokinazo). Cikel zato teče le, ko svetlobne reakcije dovajajo ATP in NADPH.

## Preveri se

? Kateri od teh prenašalcev ne spada v Z-shemo linearnega toka elektronov?
- plastocianin
~ Plastocianin prenaša elektrone od citokroma $b_6f$ do PSI.
- feredoksin
~ Feredoksin sprejme elektron s PSI in ga odda reduktazi.
+ citokrom c oksidaza
- plastokinon
~ Plastokinon prenaša elektrone od PSII do citokroma $b_6f$.
> Citokrom c oksidaza je zadnji kompleks dihalne verige v mitohondriju, ne del fotosinteze.

? Koliko fotonov potrebuje rastlina C3 brez fotorespiracije najmanj za sintezo ene molekule glukoze, če šteješ tudi ciklični tok ($9$ fotonov na $\mathrm{CO_2}$)?
- $9$
~ To je število za en $\mathrm{CO_2}$; glukoza ima $6$ ogljikovih atomov.
- $48$
~ To velja le za linearni tok, ki ne da dovolj ATP.
+ $54$
- $24$
~ $24$ je število elektronov, ne fotonov.
> $6 \cdot 9 = 54$ fotonov.

? V vročem in suhem dnevu rastlina zapre listne reže. Kaj je neposredna posledica pri rastlini C3?
- Fotorespiracija se zmanjša, ker je manj kisika.
~ Kisik nastaja v listu pri fotosintezi; z zaprtimi režami se nabira, $\mathrm{CO_2}$ pa porablja.
+ Razmerje $\mathrm{CO_2}$ proti $\mathrm{O_2}$ v listu pade, zato fotorespiracija naraste.
- Calvinov cikel se pospeši, ker je več ATP.
~ Brez $\mathrm{CO_2}$ se cikel upočasni; ATP se kopiči, a ne pomaga.
- Fotosistem II začne vezati $\mathrm{CO_2}$.
~ Fotosistem II oksidira vodo; $\mathrm{CO_2}$ veže le RuBisCO (pri C4 tudi PEP-karboksilaza).
> Zaprte reže preprečijo dotok $\mathrm{CO_2}$, kisik iz fotosinteze ostane v listu, RuBisCO pogosteje oksigenira.

? Študent je izračunal ATP na $\mathrm{CO_2}$ iz linearnega toka: (1) $2$ NADPH potrebujeta $4$ elektrone; (2) vsak elektron prečrpa $3$ protone, skupaj $12$; (3) ATP sintaza potrebuje $3$ protone na ATP; (4) nastanejo $4$ ATP, več kot dovolj. Kateri korak je napačen?
- korak 1
~ Vsak NADPH potrebuje $2$ elektrona: pravilno.
- korak 2
~ $1$ proton iz vode in $2$ iz cikla Q: pravilno.
+ korak 3
- korak 4
~ Korak 4 je le posledica napake pred njim.
> Obroč ATP sintaze v kloroplastu ima $14$ podenot, zato je potrebnih $14/3 \approx 4{,}67$ protona na ATP in nastane le okoli $2{,}57$ ATP.

? Fotobioreaktor z algami osvetljujejo z rdečimi LED ($680\,\mathrm{nm}$), ki oddajo $1{,}0\,\mathrm{mol}$ fotonov na uro, kultura jih absorbira $60\,\%$. Koliko $\mathrm{CO_2}$ največ veže v eni uri pri $9$ fotonih na $\mathrm{CO_2}$?
- okoli $0{,}11\,\mathrm{mol}$
~ Upoštevati moraš, da kultura absorbira le $60\,\%$ fotonov.
+ okoli $0{,}067\,\mathrm{mol}$
- okoli $0{,}6\,\mathrm{mol}$
~ To je število absorbiranih fotonov, ne molekul $\mathrm{CO_2}$; deliti moraš z $9$.
- okoli $5{,}4\,\mathrm{mol}$
~ S številom fotonov na $\mathrm{CO_2}$ deliš, ne množiš.
> $1{,}0 \cdot 0{,}6 / 9 \approx 0{,}067\,\mathrm{mol}$ $\mathrm{CO_2}$ na uro.

:::simboli
E | energija fotona | E = \frac{h c}{\lambda} | J
E_\mathrm{m} | energija mola fotonov | E_\mathrm{m} = N_\mathrm{A} E | kJ/mol
h | Planckova konstanta | | J\,s
c | hitrost svetlobe | | m/s
\lambda | valovna dolžina | | nm
\lambda_1, \lambda_2 | valovni dolžini reakcijskih centrov | | nm
N_\mathrm{A} | Avogadrova konstanta | | mol^{-1}
n_\mathrm{ATP} | število ATP | n_\mathrm{ATP} = \frac{n_\mathrm{H}}{14/3} | –
n_\mathrm{H} | število prečrpanih protonov | | –
n_\mathrm{f} | število fotonov na $\mathrm{CO_2}$ | | –
\eta | izkoristek pretvorbe energije | \eta = \frac{\Delta G}{n_\mathrm{f} E_\mathrm{m}} | –
\Delta G | sprememba Gibbsove energije na mol $\mathrm{CO_2}$ | | kJ/mol | okoli 478
\varphi | razmerje oksigenacij proti karboksilacijam | | –
n | število molekul ali fotonov | | mol
m | masa | m = n M | g
M | molska masa | | g/mol
e | elektron | | | v zapisu $e^-$
:::
