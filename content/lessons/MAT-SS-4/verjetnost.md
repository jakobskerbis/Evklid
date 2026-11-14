---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Za palačinke potrebuješ dve jajci. V škatli jih je $12$, a dve sta počeni, česar ne vidiš. Brez gledanja vzameš dve. Kolikšna je verjetnost, da sta obe celi? Mnogi rečejo $\frac{10}{12} \cdot \frac{10}{12} \approx 0{,}69$, a to ni čisto prav, ker prvo jajce ne gre nazaj v škatlo.

Klasično definicijo že znaš: če je vseh enako verjetnih izidov $n$, ugodnih za dogodek $A$ pa $m$, je
$$P(A) = \frac{m}{n}.$$
Ugodne in vse izide štejemo s kombinatoriko. Pri jajcih pa se zgodita *dve stvari zapored* in druga je odvisna od prve. Podobno razmišljajo zavarovalnice, zdravniki pri branju izvidov in tovarne pri nadzoru kakovosti. Za take naloge potrebuješ tri orodja: **verjetnost vsote dogodkov**, **verjetnost produkta dogodkov** in **pogojno verjetnost**.

## Razlaga

**1. Dogodki.** Poskus ima množico možnih izidov, imenujemo jo **vzorčni prostor**. **Dogodek** je skupina izidov (podmnožica). Pri metu kocke je dogodek $A$: »padlo je sodo število« $= \{2, 4, 6\}$. Dogodek z enim samim izidom, na primer »padla je šestica« $= \{6\}$, je **elementarni dogodek**.

- **Gotov dogodek** se zgodi vedno: $P = 1$.
- **Nemogoč dogodek** se ne zgodi nikoli: $P = 0$.
- Za vsak dogodek velja $0 \le P(A) \le 1$.
- **Nasprotni dogodek** $\overline{A}$ se zgodi, kadar se $A$ ne zgodi:
$$P(\overline{A}) = 1 - P(A).$$

Preveri: kaj je nasprotni dogodek dogodka »vsaj eno od dveh jajc je počeno«? (Obe jajci sta celi.)

V simulaciji spodaj (»Verjetnost in relativna frekvenca«) izberi met kocke in klikni »1000«. Opazuj, kako se delež šestic ustali blizu $\frac{1}{6} \approx 0{,}17$: verjetnost je delež, ki ga dobiš pri zelo veliko poskusih.

**2. Vsota in produkt dogodkov.**

- **Vsota** $A + B$: zgodi se $A$ ali $B$ (vsaj eden od njiju).
- **Produkt** $A \cdot B$: zgodita se $A$ in $B$ hkrati.

Dogodka sta **nezdružljiva**, če se ne moreta zgoditi hkrati, torej je $A \cdot B$ nemogoč dogodek. Pri metu kocke sta »padla je 1« in »padla je 2« nezdružljiva.

Preveri: ali sta »padlo je sodo« in »padla je 6« nezdružljiva? (Ne, šestica je soda, zato se lahko zgodita hkrati.)

**3. Verjetnost vsote.** Pri splošnih dogodkih velja
$$P(A + B) = P(A) + P(B) - P(A \cdot B).$$
Izide, ki so v obeh dogodkih, bi pri seštevanju šteli dvakrat, zato jih enkrat odštejemo. Če sta $A$ in $B$ nezdružljiva, je $P(A \cdot B) = 0$ in dobimo preprosto
$$P(A + B) = P(A) + P(B).$$

:::premisli
V kuhinji je verjetnost, da je v hladilniku mleko, $0{,}7$, da so jajca, pa $0{,}6$. Ali je verjetnost, da je vsaj eno od obojega, $1{,}3$? Zakaj ne?
---
Ne, verjetnost ne more biti večja od $1$. Dneve, ko sta v hladilniku oboje, smo šteli dvakrat. Odšteti moramo $P(A \cdot B)$; ta je vsaj $0{,}3$, saj mora biti vsota največ $1$.
:::

**4. Pogojna verjetnost (višja raven).** Verjetnost dogodka $A$ ob pogoju, da se je $B$ že zgodil (z $P(B) > 0$), je
$$P(A \mid B) = \frac{P(A \cdot B)}{P(B)}.$$
Pogoj $B$ »zoži svet« na izide, v katerih se je $B$ zgodil, in med njimi gledamo, kolikšen delež jih je ugodnih za $A$.

:::premisli
Prvo jajce iz škatle je bilo celo. Kolikšna je zdaj verjetnost, da je celo tudi drugo? Zakaj ni več $\frac{10}{12}$?
---
$\frac{9}{11}$. V škatli je ostalo $11$ jajc, celih je še $9$. Pogoj »prvo je bilo celo« je spremenil vsebino škatle.
:::

**5. Verjetnost produkta (višja raven).** Iz definicije pogojne verjetnosti sledi
$$P(A \cdot B) = P(B) \cdot P(A \mid B).$$
Verjetnost, da se zgodita oba dogodka, je verjetnost prvega, pomnožena z verjetnostjo drugega, ko je prvi že nastopil. To je pravilo za računanje po stopnjah (npr. dva izvlečka brez vračanja).

Zdaj lahko odgovorimo na vprašanje z jajci. Pomaga **verjetnostno drevo**: veje so izidi, na vejah so (pogojne) verjetnosti.

:::risba skica
opis: Verjetnostno drevo za dve jajci iz škatle z 12 jajci, od katerih sta 2 počeni. Prvo jajce: celo z verjetnostjo 10/12, počeno z 2/12. Po celem: drugo celo 9/11, počeno 2/11. Po počenem: drugo celo 10/11, počeno 1/11. Poti dajo 90/132, 20/132, 20/132 in 2/132.
območje: 0; 0 .. 10; 7
enota: 30
črta: 0,5; 3,5 -> 3,5; 5,5
črta: 0,5; 3,5 -> 3,5; 1,5
črta: 3,5; 5,5 -> 6,5; 6,5
črta: 3,5; 5,5 -> 6,5; 4,5
črta: 3,5; 1,5 -> 6,5; 2,5
črta: 3,5; 1,5 -> 6,5; 0,5
točka: 0,5; 3,5 | | levo
napis: 2; 4,8 | 10/12 | nad levo
napis: 2; 2,2 | 2/12 | pod levo
napis: 3,5; 5,5 | celo | nad
napis: 3,5; 1,5 | počeno | pod
napis: 5; 6,2 | 9/11 | nad
napis: 5; 4,8 | 2/11 | pod
napis: 5; 2,2 | 10/11 | nad
napis: 5; 0,8 | 1/11 | pod
napis: 6,6; 6,5 | celo: 90/132 | desno
napis: 6,6; 4,5 | počeno: 20/132 | desno
napis: 6,6; 2,5 | celo: 20/132 | desno
napis: 6,6; 0,5 | počeno: 2/132 | desno
:::

Na zgornji poti pomnožimo: $P = \frac{10}{12} \cdot \frac{9}{11} = \frac{90}{132} = \frac{15}{22} \approx 0{,}68$. Vsota vseh štirih poti je $1$, saj se gotovo zgodi ena od njih.

Preveri: kolikšna je verjetnost, da sta obe jajci počeni? ($\frac{2}{12} \cdot \frac{1}{11} = \frac{2}{132} = \frac{1}{66}$.)

**6. Neodvisna dogodka (višja raven).** Dogodka $A$ in $B$ sta **neodvisna**, če informacija o enem ne spremeni verjetnosti drugega, torej $P(A \mid B) = P(A)$. Takrat velja
$$P(A \cdot B) = P(A) \cdot P(B).$$
Primer: dva zaporedna meta kovanca. Pri vlečenju brez vračanja dogodka nista neodvisna.

Preveri: sta »prvo jajce je celo« in »drugo jajce je celo« neodvisna? (Ne: $\frac{9}{11} \ne \frac{10}{12}$.)

## Rešeni primeri

### Primer 1 (lažji): vsota dogodkov pri metu kocke

Vržemo pošteno kocko. Dogodek $A$: padlo je sodo število. Dogodek $B$: padlo je število, večje od $3$. Izračunaj $P(A + B)$.

**Podatki:** poštena kocka, $6$ enako verjetnih izidov; $A$: sodo število, $B$: število, večje od $3$
**Iščemo:** $P(A + B)$

:::formula
$P(A + B) = P(A) + P(B) - P(A \cdot B)$
:::

**Rešitev:**

1. Zapišemo izide: $A = \{2, 4, 6\}$, $B = \{4, 5, 6\}$. Vseh izidov je $6$.
2. $P(A) = \dfrac{3}{6} = \dfrac{1}{2}$ in $P(B) = \dfrac{3}{6} = \dfrac{1}{2}$.
3. Dogodka sta združljiva (izida $4$ in $6$ sta v obeh), zato potrebujemo presek: $A \cdot B = \{4, 6\}$, torej $P(A \cdot B) = \dfrac{2}{6} = \dfrac{1}{3}$.
4. Uporabimo formulo, ki odšteje dvakrat štete izide:
$$P(A + B) = \frac{1}{2} + \frac{1}{2} - \frac{1}{3} = \frac{2}{3}.$$
5. Preverimo z neposrednim štetjem: $A + B = \{2, 4, 5, 6\}$ ima $4$ izide, $\dfrac{4}{6} = \dfrac{2}{3}$. Ujemanje potrdi račun.
6. Odgovor: verjetnost, da pade sodo število ali število, večje od $3$, je $\frac{2}{3}$.

### Primer 2 (višja raven): produkt dogodkov brez vračanja

V košari je $5$ rdečih in $3$ zelena jabolka. Za zavitek brez gledanja vzameš dve. Kolikšna je verjetnost, da sta (a) obe rdeči, (b) različnih barv?

**Podatki:** $5$ rdečih in $3$ zelena jabolka, skupaj $8$; vzamemo $2$ brez vračanja
**Iščemo:** (a) $P(R_1 \cdot R_2)$, (b) verjetnost, da sta jabolki različnih barv

:::formula
$P(A \cdot B) = P(A) \cdot P(B \mid A)$; za nezdružljiva dogodka $P(A + B) = P(A) + P(B)$
:::

**Rešitev:**

**(a)**
1. Dogodek $R_1$: prvo je rdeče, $R_2$: drugo je rdeče. Iščemo $P(R_1 \cdot R_2) = P(R_1) \cdot P(R_2 \mid R_1)$.
2. $P(R_1) = \dfrac{5}{8}$, ker je $5$ rdečih od $8$.
3. Če je bilo prvo rdeče, so v košari še $7$ jabolk, od tega $4$ rdeča, zato $P(R_2 \mid R_1) = \dfrac{4}{7}$. Pogojna verjetnost je tu nujna, ker se vsebina košare po prvem jemanju spremeni.
4. $P = \dfrac{5}{8} \cdot \dfrac{4}{7} = \dfrac{20}{56} = \dfrac{5}{14}$.

**(b)**
1. Različni barvi pomenita »prvo rdeče in drugo zeleno« ali »prvo zeleno in drugo rdeče«. To sta nezdružljiva dogodka, zato verjetnosti seštejemo.
2. $P(R_1 Z_2) = \dfrac{5}{8} \cdot \dfrac{3}{7} = \dfrac{15}{56}$ in $P(Z_1 R_2) = \dfrac{3}{8} \cdot \dfrac{5}{7} = \dfrac{15}{56}$.
3. $P = \dfrac{15}{56} + \dfrac{15}{56} = \dfrac{30}{56} = \dfrac{15}{28}$.
4. Preverimo s kombinacijami: $\dfrac{\binom{5}{1}\binom{3}{1}}{\binom{8}{2}} = \dfrac{15}{28}$. Ujema se.

Odgovor: obe jabolki sta rdeči z verjetnostjo $\frac{5}{14}$, različnih barv pa z verjetnostjo $\frac{15}{28}$.

### Primer 3 (težji, višja raven): pogojna verjetnost pri kontroli kakovosti

Tovarna ima dva stroja. Stroj $A$ izdela $60\,\%$ vseh izdelkov, stroj $B$ pa $40\,\%$. Pri stroju $A$ je $2\,\%$ izdelkov pokvarjenih, pri stroju $B$ pa $5\,\%$. Naključno izberemo en izdelek in je pokvarjen. Kolikšna je verjetnost, da ga je izdelal stroj $A$?

**Podatki:** $P(A) = 0{,}6$, $P(B) = 0{,}4$, $P(N \mid A) = 0{,}02$, $P(N \mid B) = 0{,}05$
**Iščemo:** $P(A \mid N)$, verjetnost, da je pokvarjen izdelek s stroja $A$

:::formula
$P(A \mid N) = \dfrac{P(A \cdot N)}{P(N)}$, $P(A \cdot N) = P(A) \cdot P(N \mid A)$
:::

**Rešitev:**

1. Označimo: $A$ – izdelek je s stroja $A$, $B$ – s stroja $B$, $N$ – izdelek je pokvarjen. Podano: $P(A) = 0{,}6$, $P(B) = 0{,}4$, $P(N \mid A) = 0{,}02$, $P(N \mid B) = 0{,}05$.
2. Iščemo $P(A \mid N) = \dfrac{P(A \cdot N)}{P(N)}$.
3. Števec izračunamo s pravilom za produkt: $P(A \cdot N) = P(A) \cdot P(N \mid A) = 0{,}6 \cdot 0{,}02 = 0{,}012$.
4. Imenovalec: izdelek je pokvarjen, če je pokvarjen in s stroja $A$, ali pokvarjen in s stroja $B$. To sta nezdružljiva dogodka, zato seštejemo:
$$P(N) = 0{,}6 \cdot 0{,}02 + 0{,}4 \cdot 0{,}05 = 0{,}012 + 0{,}020 = 0{,}032.$$
5. Zdaj ti: deli števec z imenovalcem in odgovor zapiši v odstotkih. Je več ali manj kot polovica pokvarjenih izdelkov s stroja $A$?

:::premisli
Koliko je $P(A \mid N)$?
---
$P(A \mid N) = \dfrac{0{,}012}{0{,}032} = \dfrac{12}{32} = \dfrac{3}{8} = 0{,}375$, torej $37{,}5\,\%$. To je manj kot polovica: čeprav stroj $A$ izdela več izdelkov, ima manjšo stopnjo napak, zato je med pokvarjenimi redkeje.
:::

## Pogoste napake

- **Pozabljen presek pri vsoti.** »Mleko $0{,}7$, jajca $0{,}6$, vsaj eno $1{,}3$.« Izidi, kjer se zgodita oba dogodka, so šteti dvakrat. Pri združljivih dogodkih odštej $P(A \cdot B)$; verjetnost nad $1$ je vedno znak te napake.
- **Zamenjava $P(A \mid B)$ in $P(B \mid A)$ (višja raven).** »Stroj $A$ ima $2\,\%$ napak, torej je pokvarjen izdelek s stroja $A$ z verjetnostjo $0{,}02$.« To sta različni vprašanji z različnim pogojem. Popravek: najprej zapiši, kaj že veš (pogoj), in ta dogodek daj za navpičnico.
- **Množenje, kot da sta dogodka neodvisna (višja raven).** »Dve celi jajci: $\frac{10}{12} \cdot \frac{10}{12}$.« Brez vračanja se vsebina škatle po prvem jemanju spremeni. Popravek: drugi faktor je pogojna verjetnost $\frac{9}{11}$; $P(A) \cdot P(B)$ velja le za neodvisna dogodka.
- **Zamenjava »nezdružljiva« in »neodvisna« (višja raven).** »Ne moreta se zgoditi hkrati, torej se ne motita, torej sta neodvisna.« Ravno obratno: nezdružljiva dogodka (z verjetnostima nad $0$) sta močno odvisna, saj se drugi gotovo ne zgodi, če se zgodi prvi. Popravek: nezdružljivost preveri s $P(A \cdot B) = 0$, neodvisnost s $P(A \cdot B) = P(A) \cdot P(B)$.
- **Napačen imenovalec pri pogojni verjetnosti (višja raven).** Pri $P(A \mid B)$ učenec deli s številom vseh izidov. Pogoj pa zoži svet na $B$. Popravek: deli s $P(B)$ oziroma s številom izidov v $B$.

## Povzetek

- Dogodek je podmnožica izidov. Za nasprotni dogodek velja $P(\overline{A}) = 1 - P(A)$.
- Vsota $A + B$ pomeni »$A$ ali $B$«, produkt $A \cdot B$ pa »$A$ in $B$«.
- $P(A + B) = P(A) + P(B) - P(A \cdot B)$. Pri nezdružljivih dogodkih se zmanjša na $P(A) + P(B)$.
- Pogojna verjetnost (višja raven): $P(A \mid B) = \dfrac{P(A \cdot B)}{P(B)}$.
- Produkt (višja raven): $P(A \cdot B) = P(B) \cdot P(A \mid B)$. Pri neodvisnih dogodkih $P(A \cdot B) = P(A) \cdot P(B)$.
- (višja raven) Pri nalogah s koraki si pomagaj z drevesom: verjetnosti vzdolž poti množimo, verjetnosti različnih poti, ki vodijo do istega dogodka, seštevamo.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Hkrati vržemo dve pošteni kocki, rdečo in modro. Izračunaj verjetnost, da je vsota pik na obeh kockah enaka $8$.

**Rešitev:**

1. Izid zapišemo kot urejen par (pike na rdeči, pike na modri). Vseh enako verjetnih izidov je $6 \cdot 6 = 36$.
2. Ugodni izidi so $(2, 6)$, $(3, 5)$, $(4, 4)$, $(5, 3)$ in $(6, 2)$, torej $5$ izidov.
3. Po klasični definiciji je $P = \frac{5}{36}$.
4. Odgovor: verjetnost, da je vsota pik $8$, je $\frac{5}{36}$.

**Točkovanje:** 1 točka za število vseh izidov $36$, 1 točka za vseh $5$ ugodnih izidov, 1 točka za $\frac{5}{36}$.

### Naloga 2: krajša strukturirana naloga, 6 točk, pola 1 (brez računala)

V vrečki so $4$ rdeče, $3$ modre in $5$ zelenih kroglic. Na slepo hkrati izvlečemo $3$ kroglice.

a) Izračunaj verjetnost, da so vse tri izvlečene kroglice zelene. (2 točki)
b) Izračunaj verjetnost, da so vse tri izvlečene kroglice različnih barv. (2 točki)
c) Izračunaj verjetnost, da je med izvlečenimi kroglicami vsaj ena rdeča. (2 točki)

**Rešitev:**

1. a) Vseh enako verjetnih izborov $3$ kroglic izmed $12$ je $\binom{12}{3} = \frac{12 \cdot 11 \cdot 10}{3 \cdot 2 \cdot 1} = 220$.
2. a) Ugodnih izborov je $\binom{5}{3} = 10$, zato je $P = \frac{10}{220} = \frac{1}{22}$.
3. b) Izberemo po eno kroglico vsake barve: $4 \cdot 3 \cdot 5 = 60$ izborov, $P = \frac{60}{220} = \frac{3}{11}$.
4. c) Nasprotni dogodek je »nobena kroglica ni rdeča«, torej so vse tri izmed $8$ nerdečih: $\binom{8}{3} = 56$ izborov.
5. c) $P = 1 - \frac{56}{220} = 1 - \frac{14}{55} = \frac{41}{55}$.
6. Odgovor: a) $\frac{1}{22}$, b) $\frac{3}{11}$, c) $\frac{41}{55}$.

**Točkovanje:** a) 1 točka za število vseh izborov $\binom{12}{3} = 220$, 1 točka za $\frac{1}{22}$; b) 1 točka za $4 \cdot 3 \cdot 5 = 60$ ugodnih izborov, 1 točka za $\frac{3}{11}$; c) 1 točka za nasprotni dogodek in $\binom{8}{3} = 56$ (ali za vsoto primerov z $1$, $2$ in $3$ rdečimi kroglicami, $112 + 48 + 4 = 164$), 1 točka za $\frac{41}{55}$.

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

V razredu je $30$ dijakov. Šport jih trenira $18$, glasbilo jih igra $12$, $6$ dijakov pa trenira šport in igra glasbilo. Naključno izberemo enega dijaka. Dogodek $S$: izbrani dijak trenira šport. Dogodek $G$: izbrani dijak igra glasbilo.

a) Izračunaj $P(S + G)$ in z besedami opiši dogodek $S + G$. (2 točki)
b) Izračunaj verjetnost, da izbrani dijak ne trenira športa in ne igra glasbila. (1 točka)
c) Izbrani dijak igra glasbilo. Izračunaj verjetnost, da trenira tudi šport. (2 točki)
d) Ali sta dogodka $S$ in $G$ nezdružljiva? Ali sta neodvisna? Oba odgovora utemelji z računom. (3 točke)
e) Iz razreda naključno izberemo dva različna dijaka. Izračunaj verjetnost, da oba igrata glasbilo. (2 točki)

**Rešitev:**

1. a) $P(S) = \frac{18}{30} = \frac{3}{5}$, $P(G) = \frac{12}{30} = \frac{2}{5}$, $P(S \cdot G) = \frac{6}{30} = \frac{1}{5}$.
2. a) $P(S + G) = \frac{3}{5} + \frac{2}{5} - \frac{1}{5} = \frac{4}{5}$. Dogodek $S + G$: izbrani dijak trenira šport ali igra glasbilo (vsaj eno od obojega).
3. b) Iskani dogodek je nasprotni dogodek dogodka $S + G$, zato je $P = 1 - \frac{4}{5} = \frac{1}{5}$.
4. c) $P(S \mid G) = \frac{P(S \cdot G)}{P(G)} = \frac{1/5}{2/5} = \frac{1}{2}$ (med $12$ dijaki, ki igrajo glasbilo, jih $6$ trenira šport).
5. d) Dogodka nista nezdružljiva, ker je $P(S \cdot G) = \frac{1}{5} \ne 0$: $6$ dijakov trenira šport in igra glasbilo.
6. d) $P(S) \cdot P(G) = \frac{3}{5} \cdot \frac{2}{5} = \frac{6}{25}$, $P(S \cdot G) = \frac{1}{5} = \frac{5}{25}$. Ker je $P(S \cdot G) \ne P(S) \cdot P(G)$, dogodka nista neodvisna (to kaže tudi $P(S \mid G) = \frac{1}{2} \ne \frac{3}{5} = P(S)$).
7. e) Prvi izbrani igra glasbilo z verjetnostjo $\frac{12}{30}$, drugi ob tem pogoju z verjetnostjo $\frac{11}{29}$: $P = \frac{12}{30} \cdot \frac{11}{29} = \frac{132}{870} = \frac{22}{145}$.
8. Odgovor: a) $\frac{4}{5}$, b) $\frac{1}{5}$, c) $\frac{1}{2}$, d) dogodka nista nezdružljiva in nista neodvisna, e) $\frac{22}{145}$.

**Točkovanje:** a) 1 točka za formulo $P(S + G) = P(S) + P(G) - P(S \cdot G)$ s pravilnimi podatki, 1 točka za $\frac{4}{5}$ in opis dogodka; b) 1 točka za $\frac{1}{5}$ (nasprotni dogodek); c) 1 točka za pogojno verjetnost $\frac{P(S \cdot G)}{P(G)}$ ali zožitev na $12$ dijakov z glasbilom, 1 točka za $\frac{1}{2}$; d) 1 točka za utemeljitev, da dogodka nista nezdružljiva, 1 točka za primerjavo $P(S \cdot G)$ s $P(S) \cdot P(G)$, 1 točka za sklep, da nista neodvisna; e) 1 točka za zmnožek s pogojno verjetnostjo $\frac{12}{30} \cdot \frac{11}{29}$ ali za $\binom{12}{2} : \binom{30}{2}$, 1 točka za $\frac{22}{145}$.

### Ustno vprašanje 1

:::premisli
Pojasni pojme poskus, dogodek in vzorčni prostor ter zapiši klasično definicijo verjetnosti.
---
Poskus je dejanje, ki ga lahko ponavljamo pod enakimi pogoji in katerega izid je odvisen od naključja, na primer met kocke. Vzorčni prostor je množica vseh možnih izidov poskusa, pri metu kocke $\{1, 2, 3, 4, 5, 6\}$. Dogodek je podmnožica vzorčnega prostora, na primer »padlo je sodo število« $= \{2, 4, 6\}$. Če ima poskus $n$ enako verjetnih izidov in je za dogodek $A$ ugodnih $m$ izidov, je po klasični definiciji $P(A) = \frac{m}{n}$.
:::

### Ustno vprašanje 2

:::premisli
Zapiši formulo za verjetnost vsote dveh dogodkov, jo utemelji in povej, kdaj se poenostavi.
---
Za poljubna dogodka velja $P(A + B) = P(A) + P(B) - P(A \cdot B)$. Izide, ki so v obeh dogodkih, v vsoti $P(A) + P(B)$ štejemo dvakrat, zato verjetnost produkta $A \cdot B$ enkrat odštejemo. Pri klasični verjetnosti to sledi iz štetja $|A + B| = |A| + |B| - |A \cdot B|$, ki ga delimo s številom vseh izidov. Če sta dogodka nezdružljiva, je $P(A \cdot B) = 0$ in velja $P(A + B) = P(A) + P(B)$.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Pojasni razliko med nezdružljivima in neodvisnima dogodkoma ter navedi primer za vsako vrsto.
---
Dogodka sta nezdružljiva, če se ne moreta zgoditi hkrati, torej je $P(A \cdot B) = 0$. Dogodka sta neodvisna, če izid enega ne spremeni verjetnosti drugega, torej je $P(A \cdot B) = P(A) \cdot P(B)$. Pri enem metu kocke sta dogodka »pade $1$« in »pade $2$« nezdružljiva, pri dveh metih kovanca pa sta dogodka »v prvem metu pade grb« in »v drugem metu pade grb« neodvisna. Nezdružljiva dogodka, ki imata oba pozitivno verjetnost, nista neodvisna, saj se drugi gotovo ne zgodi, če se zgodi prvi.
:::

## Drugače: Na sliki

Predstavljaj si pravokotnik s ploščino $1$, ki predstavlja vse izide. Dogodek $A$ je lik v njem, njegova ploščina pa je $P(A)$. Dogodek $B$ je drug lik.

- Vsota $A + B$ je ploščina, ki jo pokrivata skupaj. Če se liki prekrivata, prekrito območje pri seštevanju ploščin štejemo dvakrat, zato ga enkrat odštejemo: to je $P(A \cdot B)$.
- Produkt $A \cdot B$ je ploščina prekritja.
- (višja raven) Pogojna verjetnost $P(A \mid B)$: ostanemo samo znotraj lika $B$ in vprašamo, kolikšen del lika $B$ prekriva tudi $A$. To je ploščina prekritja, deljena s ploščino $B$.

(višja raven) Pri računanju po stopnjah nariši **drevo**. Iz začetka potegni veje za možne izide prvega koraka in nanje napiši verjetnosti. Iz konca vsake veje potegni nove veje s pogojnimi verjetnostmi drugega koraka. Verjetnost cele poti dobiš tako, da verjetnosti na poti zmnožiš.

(višja raven) Predstavljaj si desko z vrstami žebljičkov (Galtonova deska), skozi katero padajo kroglice. Na vsakem žebljičku se kroglica odloči za levo ali desno. Vsak žebljiček je en dogodek v zaporedju, pot do posamezne košare pa je produkt takih dogodkov. Ker se kroglica na vsakem žebljičku odloča neodvisno, verjetnosti na poti množimo. Do iste košare vodi več različnih poti, njihove verjetnosti pa seštevamo (poti so med seboj nezdružljive). Pri treh vrstah in enaki verjetnosti levo/desno pridemo do skrajne košare le na eni poti: $\left(\dfrac{1}{2}\right)^3 = \dfrac{1}{8}$. V vsaki od dveh srednjih košar končamo po $3$ poteh, torej $\dfrac{3}{8}$. V simulaciji spodaj (»Verjetnost in relativna frekvenca«) lahko preveriš podobno: ko poskus ponoviš velikokrat, se relativna frekvenca približa izračunani verjetnosti.

## Drugače: Bolj natančno

**Zakaj velja formula za vsoto?** Naj bo vseh izidov $n$. Število izidov v $A + B$ dobimo po principu vključitve in izključitve:
$$|A + B| = |A| + |B| - |A \cdot B|,$$
ker izide v preseku štejemo v $|A|$ in v $|B|$, torej dvakrat. Če vse delimo z $n$, dobimo
$$P(A + B) = P(A) + P(B) - P(A \cdot B).$$

**Zakaj je pogojna verjetnost takšna (višja raven)?** Pri klasični verjetnosti ima $B$ $|B|$ izidov. Če vemo, da se je $B$ zgodil, je prostor izidov zožen na $B$, ugodni pa so izidi iz $A \cdot B$. Zato
$$P(A \mid B) = \frac{|A \cdot B|}{|B|} = \frac{|A \cdot B|/n}{|B|/n} = \frac{P(A \cdot B)}{P(B)}.$$

**Neodvisnost (višja raven).** Dogodka sta neodvisna natanko tedaj, ko je $P(A \mid B) = P(A)$, kar je po definiciji pogojne verjetnosti ekvivalentno $P(A \cdot B) = P(A) \cdot P(B)$. V Primeru 1 je $P(A \cdot B) = \dfrac{1}{3}$, medtem ko je $P(A) \cdot P(B) = \dfrac{1}{4}$. Ker se vrednosti razlikujeta, dogodka »sodo število« in »večje od $3$« nista neodvisna.

## Preveri se

? Za dogodka $A$ in $B$ velja $P(A) = 0{,}5$, $P(B) = 0{,}4$ in $P(A + B) = 0{,}6$. Kolikšna je $P(A \cdot B)$?
- $0{,}2$
~ To je $P(A) \cdot P(B)$, kar velja le za neodvisna dogodka. Tu ne veš, da sta neodvisna, zato uporabi formulo za vsoto.
- $0$
~ Nič bi bilo pri nezdružljivih dogodkih, a takrat bi bila $P(A + B) = 0{,}9$, ne $0{,}6$.
+ $0{,}3$
- $0{,}9$
~ To je $P(A) + P(B)$. Produkt $A \cdot B$ pomeni »oba hkrati« in ne more biti verjetnejši od $A$ samega.
> Iz $P(A + B) = P(A) + P(B) - P(A \cdot B)$ sledi $P(A \cdot B) = 0{,}5 + 0{,}4 - 0{,}6 = 0{,}3$.

? (višja raven) Za dogodka $A$ in $B$ velja $P(A) = 0{,}6$, $P(B) = 0{,}4$ in $P(A \cdot B) = 0{,}12$. Kolikšna je $P(A \mid B)$?
- $0{,}2$
~ To je $P(B \mid A) = \frac{0{,}12}{0{,}6}$: deljeno je z verjetnostjo napačnega dogodka. Pogoj je $B$, zato deli s $P(B)$.
+ $0{,}3$
- $0{,}048$
~ To je $0{,}12 \cdot 0{,}4$. Pogojno verjetnost dobiš z deljenjem s $P(B)$, ne z množenjem.
> $P(A \mid B) = \dfrac{P(A \cdot B)}{P(B)} = \dfrac{0{,}12}{0{,}4} = 0{,}3$.

? (višja raven) Kuharska knjiga ima $20$ receptov:

| | hiter | počasen |
|---|---|---|
| sladek | $6$ | $4$ |
| slan | $3$ | $7$ |

Naključno izbereš sladek recept. Kolikšna je verjetnost, da je hiter?
- $0{,}3$
~ To je $\frac{6}{20}$: deljeno je z vsemi recepti. Pogoj »sladek« zoži izbor na $10$ sladkih receptov.
- $\frac{2}{3}$
~ To je $\frac{6}{9}$, verjetnost, da je hiter recept sladek. Pogoj in dogodek sta zamenjana.
+ $0{,}6$
- $0{,}45$
~ To je $\frac{9}{20}$, delež vseh hitrih receptov. Podatek, da je recept sladek, je prezrt.
> Med $10$ sladkimi recepti je $6$ hitrih, zato $P(\text{hiter} \mid \text{sladek}) = \frac{6}{10} = 0{,}6$.

? (višja raven) Iz škatle z $12$ jajci, od katerih sta $2$ počeni, vzameš dve. Zakaj verjetnost, da sta obe celi, ni $\frac{10}{12} \cdot \frac{10}{12}$?
- ker bi morali verjetnosti sešteti, ne zmnožiti
~ Seštevamo pri »ali« (nezdružljivi izidi). Tu sta obe jajci celi hkrati, to je produkt dogodkov.
+ ker po prvem celem jajcu v škatli ostane $11$ jajc in le $9$ celih
- ker sta dogodka nezdružljiva
~ Obe jajci sta lahko celi hkrati, zato dogodka nista nezdružljiva. Težava je, da sta odvisna.
- ker je treba uporabiti kombinacije, množenje pa nikoli ne da pravega rezultata
~ Množenje da pravi rezultat, če je drugi faktor pogojna verjetnost: $\frac{10}{12} \cdot \frac{9}{11}$. Isto dobiš s kombinacijami.
> Prvo jemanje spremeni škatlo, zato je drugi faktor pogojna verjetnost $\frac{9}{11}$: $P = \frac{10}{12} \cdot \frac{9}{11} = \frac{15}{22}$.

? (višja raven) Kruh z marmelado pade z mize z namazom navzdol z verjetnostjo približno $0{,}6$, padci so neodvisni. Kruh ti pade trikrat. Približno kolikšna je verjetnost, da vsaj enkrat pristane z namazom navzdol?
- približno $1{,}8$
~ To je $3 \cdot 0{,}6$. Verjetnost ne more biti večja od $1$: dogodki niso nezdružljivi, zato jih ne smeš kar sešteti.
- približno $0{,}22$
~ To je $0{,}6^3$, verjetnost, da kruh *vsakič* pade z namazom navzdol, ne vsaj enkrat.
+ približno $0{,}94$
- približno $0{,}6$
~ To je verjetnost za en sam padec. Pri treh padcih ima »vsaj enkrat« več možnosti, zato je verjetnost večja.
> Nasprotni dogodek je »vsakič z namazom navzgor«: $0{,}4^3 = 0{,}064$. Zato je $P = 1 - 0{,}064 = 0{,}936 \approx 0{,}94$.

:::simboli
P | verjetnost dogodka | P(A) = \frac{m}{n} | | vedno med 0 in 1
A, B | dogodka | | | v primeru s stroji: izdelek je s stroja A oz. B
\overline{A} | nasprotni dogodek dogodka A | | | zgodi se, kadar se A ne zgodi
m | število izidov, ugodnih za dogodek A | | |
n | število vseh enako verjetnih izidov | | |
N | dogodek, da je izdelek pokvarjen | | |
:::

<<RACUN
vrednost: 5/(6*6) | 5/36
vrednost: factorial(12)/(factorial(3)*factorial(9)) | 220
vrednost: factorial(5)/(factorial(3)*factorial(2))/220 | 1/22
vrednost: 4*3*5/220 | 3/11
vrednost: factorial(8)/(factorial(3)*factorial(5)) | 56
vrednost: 1-56/220 | 41/55
vrednost: (4*28+6*8+4)/220 | 41/55
vrednost: 18/30+12/30-6/30 | 4/5
vrednost: 1-4/5 | 1/5
vrednost: (6/30)/(12/30) | 1/2
vrednost: (18/30)*(12/30) | 6/25
vrednost: 12/30*11/29 | 22/145
vrednost: (factorial(12)/(factorial(2)*factorial(10)))/(factorial(30)/(factorial(2)*factorial(28))) | 22/145
>>
