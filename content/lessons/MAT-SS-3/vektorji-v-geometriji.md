---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Dve sliki z zemljevida. Pohodnik hodi ob ravnem kanalu. Gre lahko naprej ali nazaj, hitro ali počasi, a vedno ostane na isti premici. Do koče, ki stoji sto metrov stran od kanala, ne pride.

Taksist v mestu z mrežo ulic ima tudi le dve smeri: proti vzhodu in proti severu. Pa vseeno pripelje do vsakega naslova: »štiri bloke vzhodno, tri bloke severno«.

Situaciji sta videti povsem različni. V obeh pa se skriva isto vprašanje: koliko res različnih smeri imaš na voljo. Ena smer da premico, dve različni smeri dasta celo ravnino. Z isto mislijo boš ugotovil, ali trije kraji ležijo na isti ravni cesti, kje je težišče treh vasi in v kakšnem razmerju se sekata daljici v paralelogramu. Brez enega samega kota ali dolžine.

## Razlaga

Vse naslednje ideje najprej pokažemo na mreži, simbole zapišemo na koncu.

**1. Linearna kombinacija.** Na mreži narišemo vektorja $\vec a = (2, 1)$ in $\vec b = (1, 2)$ z začetkom v izhodišču $O$. Do točke $P(5, 4)$ prideš z dvema korakoma $\vec a$ in enim korakom $\vec b$:

:::risba skica
opis: Mreža s kvadratki. Iz izhodišča O kažeta vektor a = (2, 1) in vektor b = (1, 2). Pot do točke P(5, 4): dvakrat korak a, do točk (2, 1) in (4, 2), nato korak b do (5, 4). Črtkana daljica povezuje O in P.
območje: -1; -1 .. 7; 5
enota: 36
mreža: da
puščica: 0; 0 -> 1; 2 | b | levo | oranžna
puščica: 0; 0 -> 2; 1 | a | pod | modra
puščica: 2; 1 -> 4; 2 | a | pod | modra
puščica: 4; 2 -> 5; 4 | b | desno | oranžna
črta: 0; 0 -> 5; 4 | črtkano siva
točka: 0; 0 | O | levo
točka: 5; 4 | P | levo
:::

Zapišemo $\overrightarrow{OP} = 2\vec a + 1\vec b$. Vsoto večkratnikov vektorjev imenujemo **linearna kombinacija**:

$$\vec v = \alpha\,\vec a + \beta\,\vec b$$

Števili $\alpha$ in $\beta$ sta **koeficienta**. Smeta biti negativna ali decimalna: negativni koeficient pomeni korak nazaj.

V simulaciji spodaj (»Linearna kombinacija vektorjev«) izberi par »a (2, 0), b (4, 0): vzporedna« in preklapljaj med $\vec a + \vec b$ in $\vec a - \vec b$. Opazi, da rezultat vedno ostane na osi $x$. Pri paru »a (3, 1), b (1, 3)« pa vsota skoči s premice, na kateri leži $\vec a$.

**2. Kolinearnost.** Vektorja sta **kolinearna**, če ju lahko s premikom postavimo na isto premico. Takrat je eden večkratnik drugega:

$$\vec b = k\,\vec a$$

Po komponentah to pomeni, da sta razmerji istoležnih komponent enaki. Vektorja $(2, 1)$ in $(6, 3)$ sta kolinearna, saj je $k = 3$. Vektorja $(2, 1)$ in $(1, 2)$ nista. Ničelni vektor $\vec 0$ je kolinearen z vsakim vektorjem.

Za točke potrebujemo vektor med njima. **Krajevni vektor** $\vec r_A = \overrightarrow{OA}$ kaže iz izhodišča v točko $A$; njegove komponente so koordinate točke. Vektor od $A$ do $B$ je razlika:

$$\overrightarrow{AB} = \vec r_B - \vec r_A$$

Točke $A$, $B$ in $C$ ležijo na isti premici natanko tedaj, ko sta $\overrightarrow{AB}$ in $\overrightarrow{AC}$ kolinearna.

:::premisli
Vektorja $\overrightarrow{AB}$ in $\overrightarrow{CD}$ sta kolinearna. Ali morajo vse štiri točke ležati na isti premici?
---
Ne. Premici $AB$ in $CD$ sta lahko le vzporedni, kot nasprotni stranici pravokotnika. Na eni premici so točke šele, ko imata premici skupno točko. Zato pri točkah vedno vzamemo vektorja s skupnim začetkom $A$.
:::

**3. Koplanarnost.** Na mizo položi tri svinčnike. Kakorkoli jih obračaš, ostanejo v ravnini mize. Svinčnik, ki ga postaviš pokonci, iz nje štrli. Trije vektorji so **koplanarni**, če jih lahko s premikom postavimo v isto ravnino.

Dva nekolinearna vektorja $\vec a$ in $\vec b$ določata ravnino. Vektor $\vec c$ leži v njej natanko tedaj, ko je njuna linearna kombinacija:

$$\vec c = \alpha\,\vec a + \beta\,\vec b$$

V ravnini so vsi vektorji koplanarni, zato ima vprašanje smisel šele v prostoru.

**4. Linearna neodvisnost (višja raven).** Vektorja $\vec a$ in $\vec b$ sta **linearno neodvisna**, če velja:

$$\alpha\,\vec a + \beta\,\vec b = \vec 0 \;\Rightarrow\; \alpha = \beta = 0$$

Ničelni vektor dobiš samo tako, da oba vzameš nič krat. Sicer sta **linearno odvisna**. Primer: $2 \cdot (2, 1) + 1 \cdot (-4, -2) = (0, 0)$, zato sta $(2, 1)$ in $(-4, -2)$ odvisna.

Dva vektorja sta odvisna natanko tedaj, ko sta kolinearna. Trije so odvisni natanko tedaj, ko so koplanarni:

| Število vektorjev | v ravnini | v prostoru |
|---|---|---|
| dva | neodvisna, če nista kolinearna | neodvisna, če nista kolinearna |
| trije | vedno odvisni | neodvisni, če niso koplanarni |
| štirje | vedno odvisni | vedno odvisni |

Ključna posledica: če sta $\vec a$ in $\vec b$ neodvisna in je $\alpha\vec a + \beta\vec b = \gamma\vec a + \delta\vec b$, potem je $\alpha = \gamma$ in $\beta = \delta$. Odštejemo namreč desno stran in dobimo $(\alpha - \gamma)\vec a + (\beta - \delta)\vec b = \vec 0$, kar je pri neodvisnih vektorjih mogoče le z ničelnima koeficientoma. Zapis z neodvisnima vektorjema je en sam, zato smemo **primerjati koeficiente**.

:::premisli
Naj bo $\vec b = 2\vec a$. Zapiši vektor $5\vec a$ na dva različna načina v obliki $\alpha\vec a + \beta\vec b$. Kaj bi dala primerjava koeficientov?
---
Ker se isti vektor zapiše na več načinov. Pri $\vec b = 2\vec a$ sta $3\vec a + 1\vec b$ in $5\vec a + 0\vec b$ oba enaka $5\vec a$, koeficienti pa so različni. Primerjava bi dala nesmisel $3 = 5$.
:::

**5. Delilno razmerje (višja raven).** Točka $D$ na daljici $AB$ jo deli v razmerju $m : n$, če je $AD : DB = m : n$. Od $A$ do $D$ je torej $\frac{m}{m + n}$ poti, $\overrightarrow{AD} = \frac{m}{m+n}\overrightarrow{AB}$. Prištejemo $\vec r_A$, dobimo $\vec r_D = \vec r_A + \frac{m}{m+n}(\vec r_B - \vec r_A)$, in uredimo:

$$\vec r_D = \frac{n\,\vec r_A + m\,\vec r_B}{m + n}$$

Pazi na vrstni red: če je $D$ bližje $A$, ima $\vec r_A$ večjo utež, torej večji koeficient v števcu. Razpolovišče $S$ dobiš pri $m = n$:

$$\vec r_S = \frac{\vec r_A + \vec r_B}{2}$$

**6. Težišče trikotnika (višja raven).** Težiščnica povezuje oglišče z razpoloviščem nasprotne stranice. Vse tri se sekajo v težišču $T$. Ta deli vsako težiščnico v razmerju $2 : 1$, daljši del je ob oglišču. Na težiščnici $CS$, kjer je $S$ razpolovišče $AB$, je $CT : TS = 2 : 1$. Delilno razmerje da $\vec r_T = \frac{\vec r_C + 2\vec r_S}{3}$; vstavimo $2\vec r_S = \vec r_A + \vec r_B$:

$$\vec r_T = \frac{\vec r_A + \vec r_B + \vec r_C}{3}$$

Koordinate težišča so povprečja koordinat oglišč.

**7. Diagonali paralelograma (višja raven).** V paralelogramu $ABCD$ vzemimo $\vec a = \overrightarrow{AB}$ in $\vec b = \overrightarrow{AD}$. Nista kolinearna, torej sta neodvisna. Presečišče diagonal $S$ dosežemo po dveh poteh.

Po diagonali $AC$: $\overrightarrow{AS} = s(\vec a + \vec b)$. Prek $B$ in po diagonali $BD$: $\overrightarrow{AS} = \vec a + t(\vec b - \vec a) = (1 - t)\vec a + t\,\vec b$. Primerjamo koeficiente: $s = 1 - t$ in $s = t$, zato $s = t = \frac{1}{2}$. Diagonali se razpolavljata. Isti vzorec reši vsako nalogo »v kakšnem razmerju se sekata«.

## Rešeni primeri

### Primer 1 (lažji): ali so kraji na isti cesti

Na zemljevidu s kilometrsko mrežo so kraji $A(1, 2)$, $B(4, 4)$, $C(10, 8)$ in $D(7, 7)$. Ravna cesta vodi iz $A$ skozi $B$. Ali pelje tudi skozi $C$? Skozi $D$?

**Podatki:** $A(1, 2)$, $B(4, 4)$, $C(10, 8)$, $D(7, 7)$; enota $1\,\mathrm{km}$
**Iščemo:** ali $C$ oziroma $D$ leži na premici $AB$

:::formula
Točke $A$, $B$, $C$ so kolinearne, če je $\overrightarrow{AC} = k\,\overrightarrow{AB}$; pri tem je $\overrightarrow{AB} = \vec r_B - \vec r_A$.
:::

**Rešitev:**

1. Smer ceste: $\overrightarrow{AB} = (4 - 1, 4 - 2) = (3, 2)$.
2. $\overrightarrow{AC} = (10 - 1, 8 - 2) = (9, 6)$. Obe komponenti sta trikrat večji, $(9, 6) = 3 \cdot (3, 2)$, torej $k = 3$.
3. $\overrightarrow{AD} = (7 - 1, 7 - 2) = (6, 5)$. Prva komponenta da $k = \frac{6}{3} = 2$, druga $k = \frac{5}{2} = 2{,}5$. Enega samega $k$ ni, vektorja nista kolinearna.
4. Odgovor: cesta pelje skozi $C$ (trikrat dlje od $A$ kot $B$), skozi $D$ pa ne.

### Primer 2 (višja raven): težišče treh vasi

Vasi $A(1, 1)$, $B(7, 4)$ in $C(4, 7)$ (koordinate v km) bodo gasilski dom zgradile v težišču trikotnika $ABC$. Na ravni cesti od $A$ do $B$ bo črpališče $D$, tretjino poti od $A$. Kje sta dom in črpališče? Preveri še, da težišče deli težiščnico iz $C$ v razmerju $2 : 1$.

**Podatki:** $A(1, 1)$, $B(7, 4)$, $C(4, 7)$; $AD : DB = 1 : 2$
**Iščemo:** težišče $T$, točko $D$ in razmerje $CT : TS$, kjer je $S$ razpolovišče $AB$

:::formula
$\vec r_T = \dfrac{\vec r_A + \vec r_B + \vec r_C}{3}$ in $\vec r_D = \dfrac{n\,\vec r_A + m\,\vec r_B}{m + n}$
:::

**Rešitev:**

1. Težišče: $x_T = \frac{1 + 7 + 4}{3} = 4$ in $y_T = \frac{1 + 4 + 7}{3} = 4$, torej $T(4, 4)$.
2. Črpališče: $m = 1$, $n = 2$, zato $\vec r_D = \frac{2\vec r_A + \vec r_B}{3}$. Točka $A$ dobi utež $2$, ker je $D$ bližje njej. $x_D = \frac{2 + 7}{3} = 3$ in $y_D = \frac{2 + 4}{3} = 2$, torej $D(3, 2)$.
3. Razpolovišče: $x_S = \frac{1 + 7}{2} = 4$ in $y_S = \frac{1 + 4}{2} = 2{,}5$, torej $S(4; 2{,}5)$.
4. $\overrightarrow{CT} = (0, -3)$ in $\overrightarrow{TS} = (0; -1{,}5)$. Velja $\overrightarrow{CT} = 2\,\overrightarrow{TS}$, torej $CT : TS = 2 : 1$.
5. Odgovor: gasilski dom bo v $T(4, 4)$, črpališče v $D(3, 2)$. Težišče res deli težiščnico v razmerju $2 : 1$.

:::risba skica
opis: Trikotnik z oglišči A(1, 1), B(7, 4) in C(4, 7). Črtkana težiščnica iz C gre navpično navzdol do razpolovišča S(4; 2,5) stranice AB. Na njej leži težišče T(4, 4). Na stranici AB leži črpališče D(3, 2).
območje: 0; 0 .. 8; 8
enota: 36
mreža: da
lik: 1; 1 -> 7; 4 -> 4; 7 | modra
črta: 4; 7 -> 4; 2,5 | črtkano oranžna
točka: 1; 1 | A | levo
točka: 7; 4 | B | desno
točka: 4; 7 | C | nad
točka: 4; 2,5 | S | pod
točka: 4; 4 | T | desno | oranžna
točka: 3; 2 | D | pod
:::

### Primer 3 (težji, višja raven): v kakšnem razmerju se sekata

V paralelogramu $ABCD$ leži točka $E$ na stranici $BC$ tako, da je $BE : EC = 1 : 2$. Daljica $AE$ seka diagonalo $BD$ v točki $P$. V kakšnem razmerju $P$ deli diagonalo $BD$ in v kakšnem daljico $AE$?

:::risba skica
opis: Paralelogram ABCD, narisan na primer z oglišči A(0, 0), B(6, 0), C(9, 3) in D(3, 3). Točka E leži na stranici BC, tretjino poti od B. Daljica AE seka diagonalo BD v točki P.
območje: -1; -1 .. 10; 4
enota: 27
lik: 0; 0 -> 6; 0 -> 9; 3 -> 3; 3 | modra
črta: 6; 0 -> 3; 3 | siva
črta: 0; 0 -> 7; 1 | oranžna
točka: 0; 0 | A | levo
točka: 6; 0 | B | pod
točka: 9; 3 | C | desno
točka: 3; 3 | D | nad
točka: 7; 1 | E | desno
točka: 5,25; 0,75 | P | pod
:::

**Podatki:** paralelogram $ABCD$; $E$ na $BC$, $BE : EC = 1 : 2$; $P$ je presečišče $AE$ in $BD$
**Iščemo:** razmerji $BP : PD$ in $AP : PE$

:::formula
$\overrightarrow{AP}$ zapišemo na dva načina, $\overrightarrow{AP} = s\,\overrightarrow{AE}$ in $\overrightarrow{AP} = \overrightarrow{AB} + t\,\overrightarrow{BD}$, nato primerjamo koeficiente pri neodvisnih $\vec a = \overrightarrow{AB}$ in $\vec b = \overrightarrow{AD}$.
:::

**Rešitev:**

1. Bazna vektorja $\vec a = \overrightarrow{AB}$ in $\vec b = \overrightarrow{AD}$ nista kolinearna, torej sta neodvisna.
2. Nasprotni stranici paralelograma sta enaka vektorja, $\overrightarrow{BC} = \vec b$. Zato je $\overrightarrow{AE} = \overrightarrow{AB} + \frac{1}{3}\overrightarrow{BC} = \vec a + \frac{1}{3}\vec b$.
3. Prva pot, $P$ leži na $AE$: $\overrightarrow{AP} = s\,\overrightarrow{AE} = s\,\vec a + \frac{s}{3}\vec b$.
4. Druga pot, $P$ leži na $BD$: $\overrightarrow{BD} = \vec b - \vec a$, zato $\overrightarrow{AP} = \vec a + t(\vec b - \vec a) = (1 - t)\vec a + t\,\vec b$.
5. Primerjamo koeficiente: $s = 1 - t$ in $\frac{s}{3} = t$. Vstavimo drugo v prvo: $s = 1 - \frac{s}{3}$, torej $\frac{4s}{3} = 1$ in $s = \frac{3}{4}$, $t = \frac{1}{4}$.
6. $t = \frac{1}{4}$ pomeni, da je $BP$ četrtina diagonale $BD$: $BP : PD = 1 : 3$. Iz $s = \frac{3}{4}$ sledi $AP : PE = 3 : 1$.
7. Odgovor: $P$ deli diagonalo $BD$ v razmerju $1 : 3$, daljico $AE$ pa v razmerju $3 : 1$.

### Primer 4 – zdaj ti: let drona

Dron za snemanje planinske poti opravi tri premike (v stotinah metrov): $\vec a = (1, 2, 0)$, $\vec b = (0, 1, 3)$ in $\vec c = (2, 7, 9)$. Ali ležijo vsi trije premiki v isti ravnini?

**Podatki:** $\vec a = (1, 2, 0)$, $\vec b = (0, 1, 3)$, $\vec c = (2, 7, 9)$
**Iščemo:** ali so $\vec a$, $\vec b$, $\vec c$ koplanarni

:::formula
$\vec c = \alpha\,\vec a + \beta\,\vec b$, zapisano po komponentah
:::

**Rešitev:**

1. Po komponentah: $2 = 1 \cdot \alpha + 0 \cdot \beta$, $7 = 2\alpha + \beta$ in $9 = 0 \cdot \alpha + 3\beta$.
2. Iz prve enačbe $\alpha = 2$, iz druge $\beta = 7 - 2 \cdot 2 = 3$.
3. Preveri sam tretjo enačbo in odloči.

:::premisli
Ali tretja enačba drži in kaj to pomeni za let drona?
---
Drži: $3\beta = 3 \cdot 3 = 9$. Torej je $\vec c = 2\vec a + 3\vec b$ in vsi trije premiki ležijo v isti ravnini (so koplanarni). Če tretja enačba ne bi držala, bi $\vec c$ štrlel iz ravnine $\vec a$, $\vec b$.

(višja raven) Trije koplanarni vektorji so linearno odvisni: $2\vec a + 3\vec b - \vec c = \vec 0$.
:::

## Pogoste napake

- **Kolinearna vektorja, torej točke na eni premici.** Iz $\overrightarrow{AB} = k\,\overrightarrow{CD}$ sklepaš, da so $A$, $B$, $C$, $D$ na isti premici. Premici sta lahko le vzporedni. Pri točkah vzemi vektorja s skupnim začetkom: $\overrightarrow{AB}$ in $\overrightarrow{AC}$.
- **Dva vektorja vedno napenjata ravnino.** To velja le, če nista kolinearna. Pri $\vec b = 2\vec a$ so vse kombinacije $\alpha\vec a + \beta\vec b = (\alpha + 2\beta)\vec a$ na eni premici. Najprej preveri, ali je en vektor večkratnik drugega.
- (višja raven) **Neodvisna pomeni pravokotna.** Vektorja $(1, 0)$ in $(1, 1)$ oklepata $45^\circ$, pa sta neodvisna. Za neodvisnost zadošča, da nista kolinearna. Pravokotnost preveriš s skalarnim produktom, neodvisnost s tem, ali je eden večkratnik drugega.
- (višja raven) **Zamenjani uteži pri delilnem razmerju.** Kdor pri $AD : DB = 1 : 2$ računa $\frac{1 \cdot \vec r_A + 2\,\vec r_B}{3}$, dobi v Primeru 2 točko $(5, 3)$, ki je bližje $B$. Pravilno: bližja točka ima večjo utež, $\frac{2\vec r_A + \vec r_B}{3}$.
- (višja raven) **Težišče kot razpolovišče.** Vsoto koordinat treh oglišč deliš z $2$ namesto s $3$. Deliš s številom točk, ki jih povprečiš.

## Povzetek

- Linearna kombinacija: $\vec v = \alpha\vec a + \beta\vec b$. Krajevni vektor $\vec r_A = \overrightarrow{OA}$, $\overrightarrow{AB} = \vec r_B - \vec r_A$.
- Kolinearna vektorja: $\vec b = k\vec a$ (enaka razmerja komponent). Točke $A$, $B$, $C$ so na premici, ko je $\overrightarrow{AC} = k\,\overrightarrow{AB}$.
- Koplanarni vektorji: $\vec c = \alpha\vec a + \beta\vec b$; pomembno le v prostoru.
- (višja raven) Linearno neodvisni: $\alpha\vec a + \beta\vec b = \vec 0$ le pri $\alpha = \beta = 0$. Dva sta odvisna, ko sta kolinearna, trije, ko so koplanarni. Pri neodvisnih smemo primerjati koeficiente.
- (višja raven) Delilno razmerje $AD : DB = m : n$: $\vec r_D = \frac{n\vec r_A + m\vec r_B}{m + n}$; razpolovišče $\frac{\vec r_A + \vec r_B}{2}$; težišče $\frac{\vec r_A + \vec r_B + \vec r_C}{3}$, deli težiščnico $2 : 1$.
- (višja raven) Naloga »v kakšnem razmerju se sekata«: izberi neodvisna bazna vektorja, isti vektor zapiši na dva načina, primerjaj koeficiente. Diagonali paralelograma se razpolavljata.

## Drugače: Z analogijo

Linearna kombinacija je kot mešanje soka. Vektorja sta sestavini, koeficienta sta količini. Iz jabolčnega in pomarančnega soka zmešaš veliko okusov. Dve steklenici istega jabolčnega soka, ena dvakrat večja, pa novega okusa ne dasta: to sta kolinearna vektorja. Malinov sirup, ki ga iz prvih dveh sokov ne zmešaš, je tretji vektor zunaj ravnine. Odpre novo smer.

(višja raven) Delilno razmerje je gugalnica. Če na desni sedi dvakrat težji otrok, mora biti opora dvakrat bližje njemu. Točka $D$ z $AD : DB = m : n$ je opora, pri kateri sta v ravnovesju utež $n$ v $A$ in utež $m$ v $B$. Zato v formuli $\vec r_A$ dobi $n$. Težišče je opora za tri enake uteži v ogliščih: kartonski trikotnik obstane na konici svinčnika natanko v $T$.

## Drugače: Iz vsakdanjega življenja

Dostavni dron mora najti balkon v petem nadstropju. Na zemljevidu mu zadoščata dve števili, vzhod in sever. Za balkon potrebuje tretjo smer, navzgor. Dron z le dvema vodoravnima motorjema bi lahko dosegel vsako točko na tleh, a nobenega balkona. Dve nekolinearni smeri napenjata ravnino, prostor potrebuje tri.

(višja raven) Trije prijatelji iz različnih krajev se dogovarjajo, kje se dobijo. Če povprečijo vzhodne in severne koordinate svojih domov, dobijo težišče trikotnika. Za vožnjo to ni nujno najkrajša pot za vse, je pa preprosta in pravična izbira »na sredini«.

## Preveri se

? (višja raven) Kartograf ima na zemljevidu smeri $\vec a$ (proti vzhodu) in $\vec b$ (proti severovzhodu). Kaj pomeni, da sta linearno neodvisna?
- Sta pravokotna.
~ Vzhod in severovzhod oklepata $45^\circ$, pa sta neodvisna. Za neodvisnost zadošča, da nista kolinearna.
+ Iz $\alpha\vec a + \beta\vec b = \vec 0$ sledi $\alpha = \beta = 0$, nobeden ni večkratnik drugega.
- Imata različni dolžini.
~ Dolžina ne odloča: $(1, 0)$ in $(3, 0)$ imata različni dolžini, pa sta kolinearna in zato odvisna.
> Neodvisna vektorja dasta ničelni vektor le z ničelnima koeficientoma. Pri dveh vektorjih to pomeni: nista kolinearna.

? (višja raven) Razvrsti korake pri nalogi »V kakšnem razmerju se sekata daljici?«
1. Izberi dva nekolinearna bazna vektorja, na primer dve stranici.
2. Vse potrebne vektorje izrazi z baznima vektorjema.
3. Iskani vektor zapiši na dva načina, z neznankama $s$ in $t$.
4. Primerjaj koeficiente pri istih baznih vektorjih.
5. Reši sistem in iz $s$ in $t$ zapiši razmerji.
> Primerjava koeficientov je dovoljena šele, ko imaš neodvisna bazna vektorja. Zato je izbira baze prvi korak.

? Na mreži sta narisana vektorja $\vec a$ in $\vec b$. Kaj dobiš, če za vsa števila $\alpha$ in $\beta$ narišeš $\alpha\vec a + \beta\vec b$ z začetkom v $O$?
:::risba skica
opis: Mreža s kvadratki. Vektor a kaže iz izhodišča O(0, 0) v točko (2, 1). Vektor b kaže iz točke (1, 3) v točko (5, 5).
območje: -1; -1 .. 6; 6
enota: 40
mreža: da
puščica: 0; 0 -> 2; 1 | a | pod | modra
puščica: 1; 3 -> 5; 5 | b | nad | oranžna
točka: 0; 0 | O | levo
:::
- Vse točke ravnine.
~ To velja le za nekolinearna vektorja. Z mreže preberi $\vec b = (4, 2) = 2\vec a$: kombinacija je spet večkratnik $\vec a$.
+ Samo točke na premici skozi $O$ v smeri $\vec a$.
- Samo točke v paralelogramu, ki ga napenjata $\vec a$ in $\vec b$.
~ Koeficienta sta lahko poljubno velika in negativna, zato se ne omejiš na paralelogram. Poleg tega sta vektorja kolinearna.
> $\vec b = (4, 2) = 2\vec a$, zato je $\alpha\vec a + \beta\vec b = (\alpha + 2\beta)\vec a$. Vsi konci ležijo na eni premici.

? (višja raven) (brez računala) Trikotnik ima oglišča $A(2, -1)$, $B(5, 3)$ in $C(-1, 7)$. Koliko je druga koordinata ($y$) njegovega težišča?
= 3
~ 4,5 | Delil si z $2$ kot pri razpolovišču. Pri težišču povprečiš tri oglišča, zato deliš s $3$.
~ 9 | To je le vsota $-1 + 3 + 7$. Deliti jo moraš s $3$.
> $y_T = \frac{-1 + 3 + 7}{3} = 3$. Prva koordinata je $x_T = \frac{2 + 5 - 1}{3} = 2$.

? Ladja pluje v smeri $\vec a = (2, -3)$. Druga ladja pluje vzporedno z njo v smeri $\vec b = (p, 6)$. Koliko je $p$?
= -4
~ 4 | Spregledal si predznak. Iz $6 = -3k$ je $k = -2$, druga ladja pluje v nasprotno smer.
~ -1 | Razmerje si pri eni komponenti obrnil: $\frac{p}{2} = \frac{-3}{6}$. Pravilno je $\frac{p}{2} = \frac{6}{-3}$.
> Vzporedna smer pomeni $\vec b = k\vec a$. Iz druge komponente $6 = -3k$ dobiš $k = -2$, zato $p = 2 \cdot (-2) = -4$.

<<RACUN
vrednost: 9/3 | 3
vrednost: 6/2 | 3
vrednost: 6/3 | 2
vrednost: 5/2 | 2.5
vrednost: (1+7+4)/3 | 4
vrednost: (1+4+7)/3 | 4
vrednost: (2*1+7)/3 | 3
vrednost: (2*1+4)/3 | 2
vrednost: (1+4)/2 | 2.5
vrednost: (1*1+2*7)/3 | 5
resi: s=1-t, s/3=t | s, t | s=3/4, t=1/4
resi: 7=2*2+b | b | 3
vrednost: 3*3 | 9
vrednost: (-1+3+7)/3 | 3
vrednost: (2+5-1)/3 | 2
resi: 6=-3*k | k | -2
vrednost: 2*(-2) | -4
>>

:::simboli
\vec v | linearna kombinacija vektorjev | \vec v = \alpha\vec a + \beta\vec b |
\vec a, \vec b | vektorja (v nalogah z liki bazna vektorja) | |
\vec c | tretji vektor | \vec c = \alpha\vec a + \beta\vec b | | koplanaren z $\vec a$ in $\vec b$
\alpha, \beta | koeficienta linearne kombinacije | | | realni števili
k | koeficient kolinearnosti (večkratnik) | \vec b = k\vec a |
\vec r_A, \vec r_B, \vec r_C | krajevni vektorji točk $A$, $B$, $C$ | \vec r_A = \overrightarrow{OA} |
\vec r_D | krajevni vektor delilne točke $D$ | \vec r_D = \frac{n\vec r_A + m\vec r_B}{m + n} |
m, n | števili delilnega razmerja $AD : DB = m : n$ | |
\vec r_S | krajevni vektor razpolovišča $S$ | \vec r_S = \frac{\vec r_A + \vec r_B}{2} |
\vec r_T | krajevni vektor težišča $T$ | \vec r_T = \frac{\vec r_A + \vec r_B + \vec r_C}{3} |
A, B, C | točke (kraji, oglišča) | |
D | delilna točka na daljici $AB$ (v paralelogramu oglišče) | |
E | točka na stranici $BC$ | |
P | presečišče daljic $AE$ in $BD$ | |
s, t | neznana deleža na daljicah $AE$ in $BD$ | | | v Primeru 3 $s = \frac{3}{4}$, $t = \frac{1}{4}$
:::
