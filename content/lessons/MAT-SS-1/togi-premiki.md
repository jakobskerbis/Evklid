---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Grški matematik Evklid je v *Elementih* dokazal, da sta trikotnika z enakima stranicama in enakim vmesnim kotom skladna. Pri tem je uporabil preprosto zamisel: en trikotnik je v mislih dvignil, prenesel in položil na drugega. Če se pokrijeta, sta skladna.

Poznejši matematiki so vprašali: kaj natanko pomeni »prenesti lik, ne da bi se spremenil«? V 19. stoletju je Felix Klein predlagal novo gledanje: geometrija preučuje lastnosti, ki se pri določenih premikih ravnine ne spremenijo. Premikom, ki ohranijo velikost in obliko, rečemo **togi premiki**.

Ko se lik v računalniški igri premakne ali zavrti, program izračuna nove koordinate njegovih oglišč. Igralec biljarda pa z zrcaljenjem poišče točko na robu mize, od katere se krogla odbije v cilj.

## Razlaga

**1. Mamljiva ideja.** Iz papirja izreži raznostranični trikotnik in ga obriši na list. Poleg obriši še trikotnik, ki ga dobiš, ko papir obrneš na drugo stran. Mamljivo je misliti: »Skladna trikotnika lahko vedno pokrijem tako, da enega le potiskam in vrtim po mizi.« Poskusi. Ne gre! Drugi obris pokriješ šele, ko papirnati trikotnik spet obrneš. Skladna lika se torej lahko razlikujeta še po nečem. Temu rečemo orientacija in do nje pridemo v točki 7.

**2. Togi premik.** Preslikava ravnine vsaki točki $T$ priredi točko $T'$, njeno **sliko**. Preslikava je **togi premik**, če ohranja razdalje: za poljubni točki $A$ in $B$ velja $|A'B'| = |AB|$. Ker se dolžine ne spremenijo, se ne spremenijo niti koti. Slika lika je zato lik, ki je z njim skladen.

**3. Vzporedni premik.** Določa ga **usmerjena daljica** $\overrightarrow{PQ}$ (pravimo ji tudi vektor). Vsaka točka se premakne v smeri od $P$ proti $Q$, in sicer za dolžino $|PQ|$. Vse daljice $TT'$ so zato vzporedne, enako dolge in enako usmerjene. V koordinatnem sistemu je to premik za $p$ v smeri osi $x$ in za $q$ v smeri osi $y$:

$$T(x, y) \mapsto T'(x + p, y + q)$$

:::premisli
Ali vzporedni premik za usmerjeno daljico, ki ni ničelna, pusti kakšno točko na mestu? Zakaj?
---
Nobene. Vsaka točka se premakne za isto dolžino $|PQ| > 0$, zato nobena ne ostane, kjer je bila. Pri vrtežu in zrcaljenju je drugače: tam negibne točke obstajajo.
:::

**4. Zrcaljenje čez premico (osna simetrija).** Določa ga premica $s$, **os**. Slika $T'$ leži na drugi strani osi, enako daleč od nje. Natančneje: os $s$ je simetrala daljice $TT'$. Točke na osi ostanejo na mestu. Čez koordinatni osi zrcalimo takole:

- čez os $x$: $(x, y) \mapsto (x, -y)$,
- čez os $y$: $(x, y) \mapsto (-x, y)$.

**5. Zrcaljenje čez točko (središčna simetrija).** Določa ga točka $S$, **središče**. Točka $S$ je razpolovišče daljice $TT'$. Čez izhodišče $O$ se spremenita predznaka obeh koordinat: $(x, y) \mapsto (-x, -y)$. Čez točko $S(x_S, y_S)$ greš od $T$ do $S$ in še enkrat enako daleč naprej, zato $x' = x_S + (x_S - x)$:

$$x' = 2x_S - x \qquad y' = 2y_S - y$$

:::risba graf
opis: Trikotnik ABC z oglišči A(2, 1), B(5, 1) in C(2, 3) je v prvem kvadrantu. Njegova slika pri zrcaljenju čez os y je črtkani trikotnik A'B'C' z oglišči A'(−2, 1), B'(−5, 1), C'(−2, 3). Slika pri zrcaljenju čez izhodišče O je trikotnik A''B''C'' z oglišči A''(−2, −1), B''(−5, −1), C''(−2, −3). Črtkana daljica CC' je vodoravna, os y jo razpolavlja. Črtkana daljica AA'' gre skozi O, ki je njeno razpolovišče.
x: -6 .. 6 | 1 | x
y: -4 .. 4 | 1 | y
enako: da
lik: 2; 1 -> 5; 1 -> 2; 3 | modra
lik: -2; 1 -> -5; 1 -> -2; 3 | oranžna črtkano
lik: -2; -1 -> -5; -1 -> -2; -3 | zelena
črta: 2; 3 -> -2; 3 | siva črtkano
črta: 2; 1 -> -2; -1 | siva črtkano
točka: 0; 0 | O | pod desno
točka: 2; 1 | A | pod desno
točka: 5; 1 | B | pod
točka: 2; 3 | C | nad
točka: -2; 1 | A' | pod levo
točka: -5; 1 | B' | pod
točka: -2; 3 | C' | nad
točka: -2; -1 | A'' | nad desno
točka: -5; -1 | B'' | nad
točka: -2; -3 | C'' | pod
podnapis: Zrcaljenje čez os y (črtkano) in zrcaljenje čez izhodišče O
:::

:::premisli
Sošolec trdi: »Zrcaljenje čez izhodišče je isto kot zrcaljenje čez os $x$, saj gre oboje skozi $O$.« Napovej sliko točke $T(2, 1)$ pri obeh in presodi.
---
Čez $O$ dobiš $(-2, -1)$, čez os $x$ pa $(2, -1)$. Sliki sta različni, torej premika nista enaka. Razlikujeta se tudi po orientaciji: zrcaljenje čez os jo obrne, zrcaljenje čez $O$ ne (točka 7).
:::

**6. Vrtež.** Določajo ga središče $S$, kot $\varphi$ in smer. **Pozitivna smer** je nasprotna gibanju urinega kazalca, **negativna** je v smeri urinega kazalca. Slika $T'$ je enako daleč od $S$ kot $T$, kot $TST'$ pa meri $\varphi$. Središče ostane na mestu. Vrtež za $90^\circ$ okoli izhodišča v pozitivni smeri:

$$T(x, y) \mapsto T'(-y, x)$$

Preizkus: $T(3, 1)$ iz prvega kvadranta preide v $T'(-1, 3)$ v drugem kvadrantu, torej res nasproti urinemu kazalcu. Dvakrat zapored ta vrtež da $(-x, -y)$: zrcaljenje čez točko je vrtež za $180^\circ$.

**7. Orientacija.** Obhodi oglišča trikotnika v vrstnem redu $A \to B \to C$. Če pri tem greš nasproti urinemu kazalcu, ima trikotnik **pozitivno orientacijo**, sicer **negativno**. Na risbi ima $ABC$ pozitivno orientacijo, $A'B'C'$ negativno, $A''B''C''$ spet pozitivno.

Potiskanje po mizi je vzporedni premik, vrtenje je vrtež. Oba orientacijo **ohranita**. Obračanje papirja je zrcaljenje čez premico, ki orientacijo **obrne**.

| Premik | Določa ga | Primer | Orientacija |
|---|---|---|---|
| vzporedni premik | $\overrightarrow{PQ}$ ali $(p, q)$ | $(x + p, y + q)$ | ohrani |
| zrcaljenje čez premico | os $s$ | os $x$: $(x, -y)$ | obrne |
| zrcaljenje čez točko | središče $S$ | $O$: $(-x, -y)$ | ohrani |
| vrtež | $S$, $\varphi$, smer | $90^\circ$: $(-y, x)$ | ohrani |

**8. Skladnost.** Lika sta skladna, če enega s togim premikom (ali z več zaporednimi) preslikamo na drugega. Izreki SSS, SKS, KSK in SsK povedo, kdaj tak premik obstaja. Skladna trikotnika z enako orientacijo preslikaš z vzporednim premikom ali vrtežem. Pri nasprotni orientaciji potrebuješ tudi zrcaljenje čez premico.

V simulaciji spodaj (»Zrcaljenje čez premico in točko, orientacija«) izberi »Navpična os« in povleci točko $A$ na os. Opazi, da $A'$ tedaj sovpade z $A$. Nato preklopi na »Središčna« in primerjaj, v katero smer se obhodita $ABC$ in $A'B'C'$.

## Rešeni primeri

### Primer 1 (lažji): premik figure v igri

V igri na mreži stoji trikotna ladjica z oglišči $A(-4, 1)$, $B(-1, 1)$ in $C(-3, 3)$. Igralec da ukaz »6 polj desno in 2 polji dol«. Kje so oglišča po premiku? Ali je stranica $AB$ ostala enako dolga?

**Podatki:** $A(-4, 1)$, $B(-1, 1)$, $C(-3, 3)$, premik za $p = 6$, $q = -2$
**Iščemo:** oglišča $A'$, $B'$, $C'$ in dolžino $|A'B'|$

:::formula
$T(x, y) \mapsto T'(x + p, y + q)$
:::

**Rešitev:**

1. Abscisi prištejemo $6$, ordinati $-2$, ker gre desno in dol: $x_{A'} = -4 + 6 = 2$, $y_{A'} = 1 + (-2) = -1$, torej $A'(2, -1)$.
2. Enako za $B$: $-1 + 6 = 5$ in $1 - 2 = -1$, torej $B'(5, -1)$.
3. Za $C$: $-3 + 6 = 3$ in $3 - 2 = 1$, torej $C'(3, 1)$.
4. Stranici sta vodoravni, zato dolžino preberemo iz abscis: $|AB| = -1 - (-4) = 3$ in $|A'B'| = 5 - 2 = 3$.
5. Odgovor: ladjica ima oglišča $A'(2, -1)$, $B'(5, -1)$, $C'(3, 1)$. Stranica je še vedno dolga $3$ enote, kot mora biti pri togem premiku.

### Primer 2: vrtež ploščice

V sestavljanki se trikotna ploščica $A(1, 1)$, $B(4, 1)$, $C(4, 3)$ ob pritisku na tipko zavrti okoli izhodišča za $90^\circ$ v pozitivni smeri. Določi oglišča zavrtene ploščice in preveri, ali je orientacija ostala enaka.

**Podatki:** $A(1, 1)$, $B(4, 1)$, $C(4, 3)$, središče $O(0, 0)$, $\varphi = 90^\circ$, pozitivna smer
**Iščemo:** $A'$, $B'$, $C'$ in orientacijo trikotnika $A'B'C'$

:::formula
$T(x, y) \mapsto T'(-y, x)$
:::

**Rešitev:**

1. Nova abscisa je nasprotna vrednost stare ordinate, nova ordinata je stara abscisa: $A(1, 1) \mapsto A'(-1, 1)$.
2. $B(4, 1) \mapsto B'(-1, 4)$ in $C(4, 3) \mapsto C'(-3, 4)$.
3. Preizkus pravega kota: pri $B$ je stranica $AB$ vodoravna in $BC$ navpična. Pri $B'$ je $A'B'$ navpična in $B'C'$ vodoravna, zato je kot še vedno pravi.
4. Orientacija: pri $ABC$ gremo desno, nato gor, torej nasproti urinemu kazalcu. Pri $A'B'C'$ gremo gor, nato levo, spet nasproti urinemu kazalcu.
5. Odgovor: $A'(-1, 1)$, $B'(-1, 4)$, $C'(-3, 4)$. Orientacija je ostala pozitivna, kot pri vsakem vrtežu.

:::risba graf
opis: Trikotnik ABC z oglišči A(1, 1), B(4, 1), C(4, 3) in njegova slika A'B'C' z oglišči A'(−1, 1), B'(−1, 4), C'(−3, 4) po vrtežu za 90 stopinj okoli izhodišča O. Črtkani daljici OB in OB' sta enako dolgi in oklepata pravi kot.
x: -4 .. 5 | 1 | x
y: -1 .. 5 | 1 | y
enako: da
lik: 1; 1 -> 4; 1 -> 4; 3 | modra
lik: -1; 1 -> -1; 4 -> -3; 4 | oranžna črtkano
črta: 0; 0 -> 4; 1 | siva črtkano
črta: 0; 0 -> -1; 4 | siva črtkano
pravikot: 0; 0 | 4; 1 | -1; 4
točka: 1; 1 | A | nad
točka: 4; 1 | B | pod
točka: 4; 3 | C | nad
točka: -1; 1 | A' | pod levo
točka: -1; 4 | B' | nad desno
točka: -3; 4 | C' | nad levo
točka: 0; 0 | O | pod levo
:::

### Primer 3 (težji): odboj pri biljardu

Spodnji rob biljardne mize leži na osi $x$, enota je $1\,\mathrm{dm}$. Bela krogla je v $A(2, 3)$, rdeča v $B(8, 1)$. Igralec hoče, da se bela krogla odbije od spodnjega roba in zadene rdečo. Pri odboju je vpadni kot enak odbojnemu. V kateri točki $R$ mora krogla zadeti rob in kolikšno pot opravi do rdeče krogle?

**Podatki:** $A(2, 3)$, $B(8, 1)$, rob je os $x$, enota $1\,\mathrm{dm}$, vpadni kot je enak odbojnemu
**Iščemo:** točko $R(x_R, 0)$ in dolžino poti $|AR| + |RB|$

:::formula
Zrcaljenje čez os $x$: $B(x_B, y_B) \mapsto B'(x_B, -y_B)$; točka $R$ leži na daljici $AB'$.
:::

**Rešitev:**

1. Zrcalimo rdečo kroglo čez rob: $B'(8, -1)$. Zrcaljenje ohranja razdalje, zato je $|RB'| = |RB|$ za vsako točko $R$ na robu.
2. Zrcaljenje ohranja tudi kote: kot med $RB'$ in robom je enak odbojnemu, torej tudi vpadnemu. Enaka kota na nasprotnih straneh roba sta sovršna, zato $A$, $R$ in $B'$ ležijo na eni premici.
3. Od $A$ do $B'$ se $x$ poveča za $6$, $y$ pa zmanjša za $4$. Do roba se $y$ zmanjša za $3$, kar so tri četrtine celotnega spusta. Zato se $x$ poveča za $\frac{3}{4} \cdot 6 = 4{,}5$ in $x_R = 2 + 4{,}5 = 6{,}5$.
4. Pot: $|AR| + |RB| = |AR| + |RB'| = |AB'|$. Po Pitagorovem izreku s katetama $6$ in $4$ je $|AB'| = \sqrt{6^2 + 4^2} = \sqrt{52} \approx 7{,}21$.
5. Odgovor: krogla mora zadeti rob v točki $R(6{,}5; 0)$, do rdeče krogle opravi približno $7{,}2\,\mathrm{dm}$ poti.

:::risba skica
opis: Biljardna miza od x = 0 do x = 10 in od y = 0 do y = 4. Bela krogla A(2, 3) in rdeča krogla B(8, 1). Pot gre od A do točke R(6,5; 0) na spodnjem robu in od tam do B. Pod robom je zrcalna slika B'(8, −1); črtkano nadaljevanje poti od R gre naravnost do B', zato A, R in B' ležijo na eni premici.
območje: -0,5; -2 .. 10,5; 4,5
enota: 28
mreža: da
pravokotnik: 0; 0 .. 10; 4 | siva
črta: 2; 3 -> 6,5; 0 -> 8; 1 | modra debelo
črta: 6,5; 0 -> 8; -1 | modra črtkano
črta: 8; 1 -> 8; -1 | siva črtkano
točka: 2; 3 | A | nad
točka: 8; 1 | B | nad desno
točka: 8; -1 | B' | desno
točka: 6,5; 0 | R | pod levo
napis: 0,2; -0,6 | spodnji rob (os x) | desno | siva
:::

### Primer 4: zdaj ti

Na zemljevidu igre je zaklad v točki $Z(3, -5)$. Uganka pravi: »Zrcali ga čez os $y$, nato še čez os $x$.« Kje je zaklad? S katerim enim togim premikom bi ga dobil naravnost?

**Podatki:** $Z(3, -5)$, najprej zrcaljenje čez os $y$, nato čez os $x$
**Iščemo:** končno lego $Z_2$ in en premik, ki $Z$ preslika v $Z_2$

:::formula
Čez os $y$: $(x, y) \mapsto (-x, y)$; čez os $x$: $(x, y) \mapsto (x, -y)$
:::

**Rešitev:**

1. Čez os $y$ se spremeni predznak abscise: $Z_1(-3, -5)$.
2. Čez os $x$ se spremeni predznak ordinate točke $Z_1$.
3. Izračunaj sam in primerjaj $Z_2$ z $Z$, nato preveri:

:::premisli
Kje je $Z_2$ in kateri en premik da isto?
---
$Z_2(-3, 5)$. V primerjavi z $Z(3, -5)$ sta obe koordinati nasprotni: $(x, y) \mapsto (-x, -y)$. To je zrcaljenje čez izhodišče (vrtež za $180^\circ$). Ujema se tudi z orientacijo: dvakrat obrnjena je spet ohranjena.
:::

## Pogoste napake

- **Zrcaljenje čez točko zamenjaš z zrcaljenjem čez premico.** Učenec $T(2, 1)$ zrcali čez $O$ in dobi $(2, -1)$. To je zrcaljenje čez os $x$. Čez točko se spremenita *obe* koordinati: $(-2, -1)$.
- **Napačna smer vrteža.** Pravilo $(x, y) \mapsto (y, -x)$ zavrti za $90^\circ$ v smeri urinega kazalca, to je v negativni smeri. Pozitivna smer je nasprotna: $(x, y) \mapsto (-y, x)$. Preveri na točki $(1, 0)$, ki mora iti v $(0, 1)$.
- **»Središčna simetrija obrne orientacijo, saj je zrcaljenje.«** Zrcaljenje čez točko je vrtež za $180^\circ$, zato orientacijo ohrani. Obrne jo le zrcaljenje čez premico.
- **Predznak pri zrcaljenju čez točko $S \ne O$.** Negativni $y$ vstavi v $y' = 2y_S - y$ z oklepajem, sicer dobiš napačen predznak.
- **»Po dveh zrcaljenjih je orientacija obrnjena.«** Vsako zrcaljenje čez premico jo obrne enkrat, dvakrat obrnjena pa je spet prvotna.

## Povzetek

- Togi premik ohranja razdalje in kote; slika lika je z njim skladen lik.
- Vzporedni premik za $(p, q)$: $(x, y) \mapsto (x + p, y + q)$; nobena točka ne ostane na mestu.
- Zrcaljenje čez premico: os je simetrala daljice $TT'$. Čez os $x$: $(x, -y)$, čez os $y$: $(-x, y)$.
- Zrcaljenje čez točko $S$: $S$ je razpolovišče $TT'$; čez $O$: $(-x, -y)$; to je vrtež za $180^\circ$.
- Vrtež okoli $S$ za kot $\varphi$; pozitivna smer je nasprotna urinemu kazalcu. Za $90^\circ$ okoli $O$: $(x, y) \mapsto (-y, x)$.
- Zrcaljenje čez premico obrne orientacijo trikotnika; premik, vrtež in zrcaljenje čez točko jo ohranijo.
- Lika sta skladna, če enega s togimi premiki preslikamo na drugega.

## Drugače: Kot zgodba

Tjaša je po zimskem treningu tekla domov čez zasneženo igrišče. Zjutraj je opazila svoje sledi: levi odtis, desni, levi, desni.

Vsi levi odtisi so si enaki. Vsak naslednji je le *premaknjen* naprej, zato bi lahko enega potisnila na drugega. Levi in desni odtis sta skladna, saj sta čevlja enako velika. Pa vendar levega odtisa ne more prekriti z desnim, če ga samo potiska in vrti po snegu. Levi čevelj ne gre na desno nogo, pa naj ga obrača kakor koli.

Desni odtis je levi, zrcaljen čez črto, po kateri je tekla, in še pomaknjen naprej. Zrcaljenje obrne orientacijo, premik in vrtež pa je ne moreta.

## Drugače: Korak za korakom s številkami

Vzemi točko $T(3, 1)$ in jo preslikaj na več načinov:

| Premik | Pravilo | Slika $T(3, 1)$ |
|---|---|---|
| premik za $(-4, 2)$ | $(x - 4, y + 2)$ | $(-1, 3)$ |
| zrcaljenje čez os $x$ | $(x, -y)$ | $(3, -1)$ |
| zrcaljenje čez os $y$ | $(-x, y)$ | $(-3, 1)$ |
| zrcaljenje čez $O$ | $(-x, -y)$ | $(-3, -1)$ |
| vrtež za $90^\circ$ okoli $O$ | $(-y, x)$ | $(-1, 3)$ |
| zrcaljenje čez $S(1, 2)$ | $(2 - x, 4 - y)$ | $(-1, 3)$ |

1. Opazi: trije različni premiki pošljejo $T$ v isto točko $(-1, 3)$. Ena točka in njena slika premika ne določita.
2. Zato vzemi še točko $U(5, 1)$. Pri premiku za $(-4, 2)$ je $U' = (1, 3)$, pri vrtežu $U' = (-1, 5)$, pri zrcaljenju čez $S$ pa $U' = (-3, 3)$. Zdaj so slike različne.
3. Preveri ohranitev razdalje: $|TU| = 5 - 3 = 2$. Pri vrtežu je $|T'U'| = 5 - 3 = 2$, pri premiku $1 - (-1) = 2$, pri zrcaljenju čez $S$ pa $-1 - (-3) = 2$.

## Preveri se

? Trikotniki 1, 2 in 3 so slike trikotnika $ABC$ pri treh togih premikih. Katerega ne dobiš s potiskanjem in vrtenjem?
:::risba graf
opis: Trikotnik ABC z oglišči A(1, 2), B(4, 2), C(1, 4). Trikotnik 1 ima oglišča A₁(−2, 1), B₁(−2, 4), C₁(−4, 1). Trikotnik 2 ima oglišča A₂(1, −2), B₂(4, −2), C₂(1, −4). Trikotnik 3 ima oglišča A₃(−1, −2), B₃(−4, −2), C₃(−1, −4).
x: -5 .. 5 | 1 | x
y: -5 .. 5 | 1 | y
enako: da
lik: 1; 2 -> 4; 2 -> 1; 4 | modra
lik: -2; 1 -> -2; 4 -> -4; 1 | siva
lik: 1; -2 -> 4; -2 -> 1; -4 | siva
lik: -1; -2 -> -4; -2 -> -1; -4 | siva
točka: 1; 2 | A | pod
točka: 4; 2 | B | pod
točka: 1; 4 | C | nad
točka: -2; 1 | A_1 | pod desno
točka: -2; 4 | B_1 | nad
točka: -4; 1 | C_1 | pod
točka: 1; -2 | A_2 | nad
točka: 4; -2 | B_2 | nad
točka: 1; -4 | C_2 | pod
točka: -1; -2 | A_3 | nad
točka: -4; -2 | B_3 | nad
točka: -1; -4 | C_3 | pod
:::
- Trikotnik 1, ker je zavrten in zato ni skladen z $ABC$.
~ Vrtež je togi premik: stranice in koti ostanejo enaki. Obhod $A_1 \to B_1 \to C_1$ gre nasproti urinemu kazalcu, kot pri $ABC$.
+ Trikotnik 2, ker ima obrnjeno orientacijo.
- Trikotnik 3, ker je zrcaljenje čez točko obrnilo orientacijo.
~ Zrcaljenje čez točko je vrtež za $180^\circ$ in orientacijo ohrani. Obhod $A_3 \to B_3 \to C_3$ gre nasproti urinemu kazalcu.
- Nobeden, saj so vsi trije skladni z $ABC$.
~ Res so vsi skladni, a se razlikujejo po orientaciji: eden je edini, ki ga s potiskanjem in vrtenjem ne dobiš.
> Obhod $A_2 \to B_2 \to C_2$ gre v smeri urinega kazalca, pri $ABC$, trikotniku 1 in trikotniku 3 pa nasproti. Trikotnik 2 je zrcalna slika čez os $x$.

? Trikotnik zrcalimo čez premico $p$, nato dobljeno sliko še čez premico $q$. Kaj velja za orientacijo končne slike in zakaj?
- Obrnjena je, ker smo trikotnik zrcalili.
~ Pozabil si šteti: zrcalili smo dvakrat in vsako zrcaljenje orientacijo obrne.
+ Enaka je kot pri prvotnem trikotniku, ker jo je vsako zrcaljenje obrnilo enkrat.
- Ne da se povedati, dokler ne poznamo lege premic $p$ in $q$.
~ Lega premic vpliva na to, kje je slika, ne pa na orientacijo: dve obrnitvi vedno dasta prvotno.
- Obrnjena je, ker sta $p$ in $q$ različni premici.
~ Različnost premic ni pomembna. Šteje samo, kolikokrat orientacijo obrnemo.
> Vsako zrcaljenje čez premico orientacijo obrne, dvakrat obrnjena je spet prvotna. Končno sliko bi zato dobil tudi s premikom ali vrtežem.

? (brez računala) Točko $T(-3, 4)$ zavrtimo okoli izhodišča za $90^\circ$ v pozitivni smeri. Kolikšna je abscisa slike $T'$?
= -4
~ 4 | To je vrtež v smeri urinega kazalca: $(y, -x) = (4, 3)$. Pozitivna smer je nasprotna.
~ 3 | To je zrcaljenje čez izhodišče $(3, -4)$, vrtež za $180^\circ$, ne za $90^\circ$.
~ -3 | Abscisa se pri vrtežu ne ohrani: nova abscisa je nasprotna vrednost stare ordinate.
> $(x, y) \mapsto (-y, x)$ da $T'(-4, -3)$. Iz drugega kvadranta smo se pomaknili v tretjega, torej nasproti urinemu kazalcu.

? Nina zrcali točko $A(3, -2)$ čez točko $S(1, 1)$. Zapisala je:
| Korak | Ninin zapis |
|---|---|
| 1 | $S$ je razpolovišče daljice $AA'$. |
| 2 | $x' = 2 \cdot 1 - 3 = -1$ |
| 3 | $y' = 2 \cdot 1 - 2 = 0$ |
| 4 | $A'(-1, 0)$ |
Poišči napačni korak, ga popravi in vpiši le pravilno ordinato $y'$.
= 4
~ 0 | To je Ninin rezultat. V 3. koraku je izgubila oklepaj: odšteti mora $-2$, ne $2$.
~ -4 | Odšteto je v napačnem vrstnem redu: $y - 2y_S = -2 - 2 = -4$. Prav je $y' = 2y_S - y = 2 \cdot 1 - (-2) = 4$.
~ 2 | To je le nasprotna ordinata, kot pri zrcaljenju čez os $x$. Središče ni $O$, zato velja $y' = 2y_S - y$.
> Napaka je v 3. koraku: $y' = 2y_S - y = 2 \cdot 1 - (-2) = 4$. Pravilna slika je $A'(-1, 4)$.

? Razvrsti korake, s katerimi z ravnilom, kotomerom in šestilom zavrtiš točko $T$ okoli središča $S$ za kot $\varphi$ v pozitivni smeri.
1. Nariši poltrak iz $S$ skozi $T$.
2. V $S$ ob poltraku $ST$ nanesi kot $\varphi$ v smeri, nasprotni urinemu kazalcu.
3. Z zabodenim šestilom v $S$ prenesi razdaljo $|ST|$ na drugi krak kota.
4. Presečišče loka in kraka označi s $T'$.
> Najprej potrebuješ poltrak $ST$, ob njem nato kot. Na drugi krak preneseš razdaljo, ker vrtež ohranja oddaljenost od središča.

<<RACUN
vrednost: -4+6 | 2
vrednost: 1+(-2) | -1
vrednost: -1+6 | 5
vrednost: -3+6 | 3
vrednost: 3-2 | 1
vrednost: -1-(-4) | 3
vrednost: 3/4*6 | 4.5
vrednost: 2+4.5 | 6.5
vrednost: sqrt(6^2+4^2) | 7.21
vrednost: 2*1-3 | -1
vrednost: 2*1-(-2) | 4
vrednost: 2*2-1 | 3
vrednost: -1-(-3) | 2
>>

:::simboli
T | točka (original) | | 
T' | slika točke $T$ | | 
x, y | koordinati točke $T$ | | 
x', y' | koordinati slike $T'$ | | 
p | premik v smeri osi $x$ | | 
q | premik v smeri osi $y$ | | 
x_S, y_S | koordinati središča $S$ | | 
B' | slika točke $B$ (v primeru 3 rdeča krogla, zrcaljena čez rob) | | 
x_B, y_B | koordinati točke $B$ | | 
A, B | točki, oglišči trikotnika (v primeru 3 bela in rdeča krogla) | | 
R | točka odboja na robu mize | | 
\varphi | kot vrteža | | 
:::
