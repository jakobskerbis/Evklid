---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na dan izstrelitve sonde je Zemlja od Sonca oddaljena približno $150$ milijonov km, Mars pa $228$ milijonov km. Aplikacija na telefonu trdi, da je razdalja med planetoma tisti dan $400$ milijonov km. Ali je to sploh mogoče? In $50$ milijonov km?

Odgovor dobiš brez astronomskih tabel. Sonce, Zemlja in Mars so oglišča trikotnika, ki je lahko tudi sploščen v daljico. Razdalja Zemlja–Mars zato ne more biti večja od $150 + 228 = 378$ milijonov km in ne manjša od $228 - 150 = 78$ milijonov km. Obe trditvi aplikacije sta napačni.

Ta preprosta misel, **trikotniška neenakost**, je skupaj z zrcaljenjem glavno orodje za tekmovalne naloge tipa »poišči najkrajšo pot« ali »dokaži, da je ta dolžina vsaj …«. Pri takih nalogah ne računamo odvodov, ampak pot preoblikujemo, dokler ni ravna.

## Razlaga

**1. Poskus z roverjem.** Rover na Marsu stoji v bazi $A$, ki je $3$ km od ravnega roba ledene plošče. Pristajalni modul $B$ je $5$ km od roba na isti strani, vodoravno pa $8$ km naprej. Rover mora najprej na rob po vzorec ledu (točka $P$), nato do modula. Postavimo rob na os $x$: $A(0; 3)$, $B(8; 5)$, $P(x; 0)$. Preizkusimo nekaj točk $P$ (dolžine v km, zaokrožene):

| $x$ | do roba | do modula | skupaj |
|---|---|---|---|
| $2$ | $3{,}61$ | $7{,}81$ | $11{,}42$ |
| $3$ | $4{,}24$ | $7{,}07$ | $11{,}31$ |
| $4$ | $5{,}00$ | $6{,}40$ | $11{,}40$ |
| $5$ | $5{,}83$ | $5{,}83$ | $11{,}66$ |

Med preizkušenimi je najkrajša pot pri $x = 3$. Opazi še nekaj: tam oba odseka oklepata z robom kot $45^\circ$. Pot se od roba »odbije« kot biljardna krogla.

:::premisli
Kje bi bila najboljša točka $P$, če bi bil $A$ od roba oddaljen $5$ km, $B$ pa $3$ km (vodoravno spet $8$ km)? Napovej brez računanja.
---
Pri $x = 5$. Naloga je zrcalna slika prvotne (zamenjamo vlogi $A$ in $B$), zato je $P$ tokrat $3$ km od nožišča točke $B$. Točka $P$ je vedno bližje nožišču tiste točke, ki je bližje robu: vodoravnih $8$ km se razdeli v razmerju oddaljenosti od roba, tukaj $5 : 3$.
:::

**2. Pravilo: trikotniška neenakost.** Za poljubne točke $X$, $Y$, $Z$ velja

$$|XZ| \le |XY| + |YZ|$$

Enakost velja natanko tedaj, ko $Y$ leži na daljici $XZ$. Ovinek čez $Y$ se nikoli ne splača. Iz tega sledi, da je vsaka lomljena črta med dvema točkama vsaj tako dolga kot daljica med njima. Za stranice trikotnika $a$, $b$, $c$ to pomeni

$$|b - c| < a < b + c$$

Da so tri števila stranice trikotnika, zadošča preveriti, da je največje manjše od vsote drugih dveh.

**3. Zrcaljenje čez premico.** Zakaj je zmagala točka $x = 3$? Zrcalimo $A$ čez rob in dobimo $A'(0; -3)$. Za vsako točko $P$ na robu je $|AP| = |A'P|$, saj je rob simetrala daljice $AA'$. Zato

$$|AP| + |PB| = |A'P| + |PB| \ge |A'B|$$

Desna stran je ena sama daljica: $|A'B| = \sqrt{8^2 + 8^2} = \sqrt{128} \approx 11{,}31$ km. Enakost velja, ko $P$ leži na daljici $A'B$. Premica $A'B$ je $y = x - 3$, rob seka pri $x = 3$. Ker zrcaljenje ohranja kote, sta kota z robom pri najkrajši poti enaka: to je **odbojni zakon**.

Taki nalogi rečemo **Heronova naloga**. Strategija se glasi: **pot, ki se lomi na premici, zrcali tako, da postane ravna.** V simulaciji spodaj (Najkrajša pot z zrcaljenjem) je premica reka. Izklopi »pokaži zrcaljenje« in povleci točko $P$ na reki do najkrajše poti, nato zrcaljenje spet vklopi. Simulacija zrcali $B$ namesto $A$, kar je enakovredno: pot je najkrajša ravno takrat, ko $A$, $P$ in zrcalna slika $B'$ ležijo na premici.

:::premisli
Kaj se spremeni, če sta $A$ in $B$ na nasprotnih straneh premice? Ali je zrcaljenje še potrebno?
---
Ni. Daljica $AB$ že seka premico, zato je najboljša točka $P$ kar njuno presečišče in najkrajša pot je $|AB|$. Zrcalimo le, kadar sta točki na isti strani, da pot »prestavimo« na drugo stran.
:::

**4. Zrcaljenje čez točko.** Težiščnica $t_a$ iz oglišča $A$ gre do razpolovišča $M_a$ stranice $BC$. Zrcalimo $A$ čez $M_a$ v točko $D$. Diagonali $AD$ in $BC$ štirikotnika $ABDC$ se razpolavljata v $M_a$, zato je $ABDC$ paralelogram in $|BD| = |AC| = b$ in $|AD| = 2t_a$. Trikotniška neenakost v trikotniku $ABD$ da

$$2\,t_a < b + c$$

Pri $b = 5$ in $c = 7$ je torej težiščnica krajša od $6$. Podvojitev težiščnice je stalni trik: neznano dolžino postavi v trikotnik z znanimi stranicami.

**5. Razgrnitev.** Na površju telesa (kvadra, valja, stožca) mejne ploskve razgrnemo v ravnino. Vsako prepogibanje čez rob je zrcaljenje, zato po razgrnitvi spet iščemo ravno daljico. Pri tem moramo preizkusiti vse smiselne razgrnitve.

**6. Ekstrem iz neenakosti.** Ko dokažemo »dolžina $\ge$ število« in pokažemo primer, kjer velja enakost, smo našli najmanjšo vrednost. Isto velja za največjo. Druga simulacija spodaj (Neenakosti med sredinami) kaže, kako iz polkroga sledi $\frac{a + b}{2} \ge \sqrt{ab}$. Premer polkroga razdelimo na dela $a$ in $b$; pravokotnica na premer v delilni točki meri do loka $\sqrt{ab}$ in je polovica tetive. Polmer $\frac{a + b}{2}$ je vedno vsaj tako dolg kot polovica tetive.

## Rešeni primeri

### Primer 1 (lažji): kabli med radijskimi teleskopi

Štirje radijski teleskopi stojijo v ogliščih konveksnega štirikotnika $A(0; 0)$, $B(7; 0)$, $C(8; 6)$ in $D(1; 8)$ (v km). Kam postaviti računalniški center $P$, da bo skupna dolžina ravnih kablov do vseh štirih teleskopov najmanjša, in koliko meri?

**Podatki:** $A(0; 0)$, $B(7; 0)$, $C(8; 6)$, $D(1; 8)$, enota km, štirikotnik je konveksen
**Iščemo:** lego $P$ in najmanjšo vsoto $|PA| + |PB| + |PC| + |PD|$

:::formula
Trikotniška neenakost za vsak par nasprotnih oglišč: $|PA| + |PC| \ge |AC|$ in $|PB| + |PD| \ge |BD|$
:::

**Rešitev:**

1. Kable združimo v pare do nasprotnih oglišč. Za vsako točko $P$ je $|PA| + |PC| \ge |AC|$, ker je ovinek čez $P$ vsaj tako dolg kot daljica.
2. Diagonali: $|AC| = \sqrt{8^2 + 6^2} = 10$ km in $|BD| = \sqrt{6^2 + 8^2} = 10$ km.
3. Torej je vsota za vsak $P$ vsaj $10 + 10 = 20$ km.
4. Enakost velja v obeh neenakostih hkrati, ko $P$ leži na obeh diagonalah, torej v presečišču diagonal. Ker je štirikotnik konveksen, se diagonali sekata. Ležita na premicah $3x - 4y = 0$ in $4x + 3y = 28$, ki se sekata v $P(4{,}48; 3{,}36)$.
5. Za primerjavo: center v $A$ bi zahteval $0 + 7 + 10 + \sqrt{65} \approx 25{,}06$ km kabla.
6. Odgovor: center postavimo v presečišče diagonal, skupna dolžina kablov je $20$ km.

### Primer 2: trikotnik z najmanjšim obsegom v kotu

Točka $P$ leži v notranjosti kota z vrhom $O$ in velikostjo $30^\circ$, $|OP| = 10$. Na krakih izberemo točki $X$ in $Y$. Kolikšen je najmanjši možni obseg trikotnika $PXY$?

**Podatki:** kot $30^\circ$ z vrhom $O$, $|OP| = 10$, $X$ in $Y$ na različnih krakih
**Iščemo:** najmanjši obseg $|PX| + |XY| + |YP|$

:::formula
Zrcaljenje čez oba kraka: $|PX| = |P_1X|$ in $|PY| = |P_2Y|$, zato obseg $\ge |P_1P_2|$
:::

**Rešitev:**

1. Zrcalimo $P$ čez prvi krak v $P_1$ in čez drugi krak v $P_2$. Za vsak $X$ na prvem kraku je $|PX| = |P_1X|$, za vsak $Y$ na drugem $|PY| = |P_2Y|$.
2. Obseg je zato dolžina lomljenke $P_1XYP_2$, ki je vsaj $|P_1P_2|$.
3. Zrcaljenje ohranja razdaljo od $O$: $|OP_1| = |OP_2| = 10$. Kot $\angle P_1OP_2$ je dvakratnik kota med krakoma, ker vsako zrcaljenje podvoji kot med $OP$ in krakom: $2 \cdot 30^\circ = 60^\circ$.
4. Trikotnik $OP_1P_2$ je enakokrak s kotom $60^\circ$ med krakoma, torej enakostraničen: $|P_1P_2| = 10$.
5. Daljica $P_1P_2$ seka oba kraka, ker je $60^\circ < 180^\circ$; tam izberemo $X$ in $Y$ in dosežemo enakost.
6. Odgovor: najmanjši obseg je $10$, ne glede na to, kje v kotu leži $P$, dokler je $|OP| = 10$.

### Primer 3 (težji): robot na modulu postaje

Popravljalni robot leze po zunanjosti modula vesoljske postaje v obliki kvadra z robovi $6\,\mathrm{m}$, $4\,\mathrm{m}$ in $2\,\mathrm{m}$. Iz enega oglišča mora do nasprotnega oglišča (konca prostorske diagonale). Kako dolga je najkrajša pot po površju?

**Podatki:** robovi kvadra $6\,\mathrm{m}$, $4\,\mathrm{m}$, $2\,\mathrm{m}$; začetek in cilj sta nasprotni oglišči
**Iščemo:** najkrajšo pot $d$ po površju

:::formula
Pot prečka en rob dolžine $k$; razgrnjeni ploskvi tvorita pravokotnik $k \times (m + n)$, zato $d = \sqrt{k^2 + (m + n)^2}$.
:::

**Rešitev:**

1. Najkrajša pot gre čez dve sosednji ploskvi in prečka en rob. Ploskvi razgrnemo v ravnino; nastane pravokotnik, pot je njegova diagonala.

:::risba skica
opis: Razgrnitev dveh ploskev kvadra ob robu dolžine 6. Spodaj je ploskev 6 krat 4, nad njo ploskev 6 krat 2. Skupaj tvorita kvadrat 6 krat 6, robotova pot je diagonala od spodnjega levega do zgornjega desnega oglišča.
območje: -1; -1 .. 8; 7
enota: 30
pravokotnik: 0; 0 .. 6; 4 | modra
pravokotnik: 0; 4 .. 6; 6 | modra
črta: 0; 0 -> 6; 6 | oranžna debelo
napis: 3; 0 | 6 | pod
napis: 6; 2 | 4 | desno
napis: 6; 5 | 2 | desno
podnapis: Razgrnitev ob robu 6 m
:::

2. Pot prečka rob $6\,\mathrm{m}$: $d_1 = \sqrt{6^2 + (4 + 2)^2} = \sqrt{72} \approx 8{,}49\,\mathrm{m}$.
3. Pot prečka rob $4\,\mathrm{m}$: $d_2 = \sqrt{4^2 + (6 + 2)^2} = \sqrt{80} \approx 8{,}94\,\mathrm{m}$.
4. Ostane še pot čez rob $2\,\mathrm{m}$. Izračunaj $d_3$ in izberi najkrajšo pot.

:::premisli
Koliko je $d_3$ in katera pot je najkrajša?
---
$d_3 = \sqrt{2^2 + (6 + 4)^2} = \sqrt{104} \approx 10{,}20\,\mathrm{m}$. Najkrajša je $d_1 \approx 8{,}49\,\mathrm{m}$: pot naj prečka najdaljši rob.
:::

## Pogoste napake

- **Najbližja točka na premici.** »Rover naj gre na rob naravnost, po pravokotnici.« Prvi odsek je res najkrajši, drugi pa postane predolg. Šteje vsota, zato zrcali in poveži $A'$ z $B$.
- **Sredina med nožiščema.** Točka na pol poti je pravilna le, če sta $A$ in $B$ enako daleč od premice. Sicer je $P$ bližje tisti točki, ki je bližje premici.
- **Zrcaljenje brez potrebe.** Če sta točki na nasprotnih straneh premice, zrcaljenje da napačen odgovor. Najkrajša pot je kar daljica $AB$.
- **Pozabljena spodnja meja.** Iz trikotniške neenakosti ne sledi le $c \le a + b$, ampak tudi $c \ge |a - b|$. Trojica $4$, $9$, $13$ ni trikotnik, ker je $4 = 13 - 9$: pri enakosti so točke na premici.
- **Ena razgrnitev ali pot skozi notranjost.** Pri kvadru preveri vse tri razgrnitve. Prostorska diagonala je krajša, a gre skozi notranjost, kjer robot ne more.

## Povzetek

- Trikotniška neenakost: $|XZ| \le |XY| + |YZ|$, enakost natanko takrat, ko je $Y$ na daljici $XZ$; za stranice $|b - c| < a < b + c$.
- Lomljenka je vsaj tako dolga kot daljica med krajiščema; vsoto razdalj omejimo tako, da pot naredimo ravno.
- Heronova naloga: točko zrcali čez premico; najkrajša pot gre skozi presečišče $A'B$ s premico, kota z njo sta enaka.
- Dve premici: zrcali dvakrat; v kotu $\theta$ je kot med zrcalnima slikama $2\theta$.
- Zrcaljenje čez točko (podvojitev težiščnice) da $2t_a < b + c$; razgrnitev telesa prevede pot po površju v ravninsko.
- Ekstrem: neenakost plus primer, kjer velja enakost.

## Drugače: Korak za korakom s številkami

Naloga: $A(2; 4)$, $B(10; 2)$, premica je os $x$. Poišči najkrajšo pot $A \to P \to B$ s $P$ na osi $x$.

1. Točki sta na isti strani osi, zato zrcalimo: $A'(2; -4)$.
2. Dolžina: $|A'B| = \sqrt{8^2 + 6^2} = 10$.
3. Od $A'$ do $B$ se $y$ poveča za $6$, do osi $x$ pa za $4$, torej za $\frac{4}{6} = \frac{2}{3}$ poti. Prva koordinata $P$: $2 + \frac{2}{3} \cdot 8 = \frac{22}{3} \approx 7{,}33$.
4. Preizkus: $|AP| = \sqrt{\left(\frac{16}{3}\right)^2 + 4^2} = \frac{20}{3}$ in $|PB| = \sqrt{\left(\frac{8}{3}\right)^2 + 2^2} = \frac{10}{3}$, vsota je $10$.
5. Odgovor: $P\left(\frac{22}{3}; 0\right)$, najkrajša pot meri $10$.

## Drugače: Kot zgodba

Heron iz Aleksandrije je opazoval žarke, ki se odbijajo od zrcala. Svetloba iz plamena se je odbila od bronaste plošče in zadela oko. Heron se je vprašal: zakaj ravno v tisti točki zrcala? Narisal je več možnih poti in vse izmeril. Najkrajša je bila tista, pri kateri je žarek prišel in odšel pod enakim kotom.

Potem je naredil trik, ki ga uporabljamo še danes. Pogledal je v zrcalo in zagledal plamen »za« ploščo. Pot do zrcalne slike je ravna in enako dolga kot pot z odbojem. Ravna črta je najkrajša, zato je odboj pod enakim kotom tudi najkrajši.

Stoletja pozneje so astronomi gradili teleskope z zrcali in natanko izračunali, kam se odbije svetloba zvezde. Vsakič, ko narišeš $A'$ in potegneš ravno črto do $B$, ponoviš Heronov pogled v zrcalo.

## Preveri se

? Katera trojica števil so lahko dolžine stranic trikotnika?
- $4$, $9$, $13$
~ Tu je $4 + 9 = 13$: točke ležijo na premici, trikotnik je sploščen. Neenakost mora biti stroga.
- $3$, $4$, $8$
~ Najdaljša stranica je daljša od vsote drugih dveh: $3 + 4 = 7 < 8$.
+ $5$, $9$, $13$
- $2$, $2$, $5$
~ Preveriti je treba najdaljšo stranico: $2 + 2 = 4 < 5$.
> Največja stranica $13$ je manjša od $5 + 9 = 14$, zato trikotnik obstaja.

? Točki $A$ in $B$ sta na isti strani premice. Zakaj pri iskanju najkrajše poti $A \to P \to B$ s $P$ na premici zrcalimo $A$ čez premico?
- Ker je zrcalna slika $A'$ bližje točki $B$.
~ Bližina ni bistvo. Pomembno je, da se dolžina prvega odseka pri zrcaljenju ne spremeni.
+ Ker je za vsak $P$ na premici $|AP| = |A'P|$, pot $A' \to P \to B$ pa je najkrajša, ko je ravna.
- Ker mora $P$ ležati na simetrali daljice $AB$.
~ Simetrala $AB$ ni povezana z nalogo; $P$ leži na daljici $A'B$.
- Ker je najkrajša pot vedno pravokotna na premico.
~ Pravokotnica do premice skrajša le prvi odsek, vsota pa ni najmanjša.
> Zrcaljenje ohrani dolžino prvega odseka in naredi iz lomljenke pot med $A'$ in $B$, ki je najkrajša, ko je ravna.

? Laserski žarek iz točke $A$ se odbije od ravnega zrcala (os $x$) in zadene detektor $B$. Svetloba ubere najkrajšo pot. Odčitaj koordinate s slike: v kateri točki se žarek odbije?
:::risba skica
opis: Os x je zrcalo. Nad njim sta točki A(1; 3) in B(7; 1). Na zrcalu so označene točke P₁(1; 0), P₂(4; 0), P₃(5,5; 0) in P₄(7; 0).
območje: -0,5; -1 .. 8; 4
enota: 36
mreža: da
črta: -0,5; 0 -> 8; 0 | siva debelo
točka: 1; 3 | A | nad
točka: 7; 1 | B | nad
točka: 1; 0 | P_1 | pod
točka: 4; 0 | P_2 | pod
točka: 5,5; 0 | P_3 | pod
točka: 7; 0 | P_4 | pod
:::
- $P_1$
~ To je točka naravnost pod $A$. Prvi odsek je najkrajši, a drugi predolg.
- $P_2$
~ Sredina bi bila prava le, če bi bila $A$ in $B$ enako daleč od zrcala.
+ $P_3$
- $P_4$
~ Tu je najkrajši drugi odsek, vsota pa ne.
> $A'(1; -3)$; od $A'$ do $B$ se $y$ poveča za $4$, do zrcala za $3$, torej $x = 1 + \frac{3}{4} \cdot 6 = 5{,}5$.

? Zemlja je od Sonca oddaljena $150$ milijonov km, Luna od Zemlje $384\,000$ km. Oceni najmanjšo možno razdaljo med Luno in Soncem v milijonih km (na eno decimalko).
= 149,6 | 0,05
~ 150,4 | To je največja možna razdalja (vsota). Najmanjša je razlika, ko je Luna med Zemljo in Soncem.
~ 150,0 | Luna ni zanemarljiva: $0{,}384$ milijona km se pozna na prvi decimalki.
> Po trikotniški neenakosti je razdalja vsaj $150 - 0{,}384 = 149{,}616 \approx 149{,}6$ milijona km; enakost velja, ko so telesa na premici, kot pri Sončevem mrku.

? Najkrajša pot od $A$ do ravnega roba in nato do $B$ meri $13$ km. Točka $A$ je $2$ km od roba, $B$ pa $3$ km, obe na isti strani. Kako daleč sta narazen nožišči točk $A$ in $B$ na robu?
= 12 km | 0,01
~ 12,96 | Oddaljenosti si odštel ($3 - 2 = 1$), kot da bi $13$ km merila daljica $AB$. Pri zrcaljenju se oddaljenosti seštejeta: $2 + 3 = 5$.
~ 8 | Dolžin ne smeš kar odšteti; uporabi Pitagorov izrek v trikotniku z $A'$ in $B$.
> Po zrcaljenju je najkrajša pot $|A'B|$ hipotenuza trikotnika s katetama $2 + 3 = 5$ km in iskano razdaljo nožišč, ta je $\sqrt{13^2 - 5^2} = 12$ km.

<<RACUN
vrednost: 150+228 | 378
vrednost: 228-150 | 78
vrednost: sqrt(2^2+3^2)+sqrt(6^2+5^2) | 11.42
vrednost: sqrt(3^2+3^2)+sqrt(5^2+5^2) | 11.31
vrednost: 5+sqrt(4^2+5^2) | 11.40
vrednost: 2*sqrt(5^2+3^2) | 11.66
vrednost: sqrt(8^2+8^2) | 11.31
vrednost: sqrt(8^2+6^2) | 10
resi: 3*x-4*y=0, 4*x+3*y=28 | x, y | x=4.48, y=3.36
vrednost: 7+10+sqrt(65) | 25.06
vrednost: 2*10*sin(30°) | 10
vrednost: sqrt(6^2+(4+2)^2) | 8.49
vrednost: sqrt(4^2+(6+2)^2) | 8.94
vrednost: sqrt(2^2+(6+4)^2) | 10.20
vrednost: 2+2/3*8 | 22/3
vrednost: sqrt((16/3)^2+4^2) | 20/3
vrednost: sqrt((8/3)^2+2^2) | 10/3
vrednost: 1+3/4*6 | 5.5
vrednost: 150-0.384 | 149.616
vrednost: sqrt(13^2-5^2) | 12
>>

:::simboli
X, Y, Z | poljubne točke | | |
a, b, c | dolžine stranic trikotnika | | |
A | začetna točka poti (v razlagi baza); v Primeru 1 oglišče štirikotnika | | |
B | končna točka poti (v razlagi modul); v Primeru 1 oglišče štirikotnika | | |
P | točka, ki jo iščemo ali premikamo; v razlagi točka na premici, kjer se pot lomi | | |
A' | zrcalna slika točke $A$ čez premico | | |
t_a | dolžina težiščnice iz oglišča $A$ | | |
M_a | razpolovišče stranice $BC$ | | |
O | vrh kota (Primer 2) | | |
P_1, P_2 | zrcalni sliki točke $P$ čez kraka kota | | |
\theta | kot med premicama, čez kateri zrcalimo | | ^\circ |
C, D | oglišči štirikotnika (teleskopa) | | |
d | dolžina poti po površju kvadra čez rob $k$ | d = \sqrt{k^2 + (m + n)^2} | m |
k | rob, ki ga pot prečka | | m |
m, n | ostala robova kvadra | | m |
:::
