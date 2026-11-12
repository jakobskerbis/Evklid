---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vremenska postaja v Julijskih Alpah je junija (30 dni) zabeležila 12 deževnih dni in 15 dni z močnim vetrom. Pet dni je bilo hkrati deževnih in vetrovnih. Sošolec Tine hitro izračuna: »Mirnih suhih dni je bilo $30 - 12 - 15 = 3$.«

Račun je videti čist, pa je napačen. Na koncu razlage boš znal pokazati, katere dni je Tine odštel dvakrat, in dobil pravi odgovor.

Tekmovalne naloge iz kombinatorike redko dovolijo, da vse možnosti našteješ. Rezultati so preveliki. Zato uporabljamo tri orodja:

- **bijekcijo**: namesto težke množice preštejemo lažjo, ki ima enako elementov;
- **dvojno štetje**: isto količino preštejemo na dva načina in rezultata izenačimo;
- **vključitve in izključitve**: popravimo štetje, v katerem smo kaj šteli večkrat.

## Razlaga

**1. Štetje brez štetja.** Na strehi vasi gnezdijo štorklje. Vsaka stoji na svojem gnezdu in nobeno gnezdo ni prazno. Ne da bi štorklje šteli, vemo: štorkelj je toliko kot gnezd.

To je ideja **bijekcije**. Bijekcija med množicama $A$ in $B$ je pravilo, ki vsakemu elementu $A$ priredi natanko en element $B$, in to tako, da vsak element $B$ dobi natanko enega iz $A$. Z $|A|$ označimo **moč** množice, torej število njenih elementov. Če med končnima množicama obstaja bijekcija, je $|A| = |B|$.

Prvi zgled: podmnožice množice $\{1, 2, \dots, n\}$. Vsaki podmnožici priredimo niz ničel in enic dolžine $n$: na $i$-tem mestu je $1$, če je $i$ v podmnožici. Podmnožici $\{2, 3\}$ v $\{1, 2, 3, 4\}$ ustreza niz $0110$. Vsak niz da natanko eno podmnožico, zato je podmnožic toliko kot nizov, torej $2^n$.

*Hiter preizkus:* koliko podmnožic ima množica $\{1, 2, 3, 4, 5\}$? Odgovor: $2^5 = 32$, z vključeno prazno množico in celo množico.

**2. Poti po mreži.** Mravlja gre od mravljišča $A$ v točki $(0; 0)$ do grma $B$ v točki $(5; 3)$. Vsak korak naredi po stezici za eno enoto proti vzhodu (V) ali proti severu (S).

:::risba skica
opis: Mreža 5 krat 3 enote. Mravljišče A je v točki (0; 0), grm B v točki (5; 3). Odebeljena pot gre 2 enoti vzhod, 1 sever, 2 vzhod, 2 sever in 1 vzhod, kar je niz VVSVVSSV.
območje: -0,8; -0,8 .. 5,8; 3,8
enota: 45
mreža: da
črta: 0; 0 -> 2; 0 -> 2; 1 -> 4; 1 -> 4; 3 -> 5; 3 | oranžna debelo
točka: 0; 0 | A | pod levo
točka: 5; 3 | B | nad desno
podnapis: Pot VVSVVSSV
:::

Pot zapišemo z nizom osmih črk: petimi V in tremi S. Vsaka pot da natanko en tak niz in vsak niz natanko eno pot. Niz pa je določen, ko izberemo, katera $3$ od $8$ mest dobijo črko S. Poti je torej $\binom{8}{3} = 56$. Splošno vodi od $(0; 0)$ do $(m; n)$

$$N = \binom{m+n}{n}$$

poti. V simulaciji spodaj »Poti po mreži in binomski koeficienti« vsako vozlišče kaže, koliko poti vodi do njega. Klikni vozlišče, da ga zapreš, in opazuj, kako se zmanjšajo števila v vseh vozliščih desno in nad njim.

:::premisli
Zakaj je poti od $(0; 0)$ do $(5; 3)$ prav toliko kot poti od $(0; 0)$ do $(3; 5)$? Odgovori brez računanja.
---
Zamenjaj v vsakem nizu črki V in S. To je bijekcija med obema vrstama poti (zrcaljenje mreže čez simetralo prvega kvadranta). Zato je $\binom{8}{3} = \binom{8}{5}$.
:::

**3. Enaki predmeti v predalih.** Veverica skrije $5$ enakih lešnikov v $3$ duplje. Duplja je lahko tudi prazna. Razporeditev zapišemo z nizom pik (lešniki) in dveh pregrad, ki ločita duplje. Niz $\bullet\bullet|\,|\bullet\bullet\bullet$ pomeni $2$, $0$ in $3$ lešnike.

Vsaka razporeditev da natanko en niz s $5$ pikami in $2$ pregradama. Izbrati moramo le mesti pregrad med $7$ znaki: $\binom{7}{2} = 21$. Splošno $k$ predalov loči $k - 1$ pregrad, znakov je torej $n + k - 1$. Zato se $n$ enakih predmetov razporedi v $k$ predalov na

$$R = \binom{n+k-1}{k-1}$$

načinov. Tej bijekciji pravimo **zvezdice in pregrade**.

*Hiter preizkus:* na koliko načinov skrije $4$ lešnike v $2$ duplji? Odgovor: $\binom{5}{1} = 5$, to so $4+0$, $3+1$, $2+2$, $1+3$ in $0+4$.

**4. Dvojno štetje.** Na travniku rastejo cvetlice $8$ vrst. Vsaka čebela iz panja obišče natanko $3$ vrste, vsako vrsto pa obišče natanko $6$ čebel. Koliko je čebel?

Narišimo v mislih tabelo: vrstica za vsako čebelo, stolpec za vsako vrsto, v celici $1$, če je čebela vrsto obiskala. Enice seštejemo po vrsticah: vsaka čebela prispeva $3$, skupaj je to $3$-krat toliko, kot je čebel. Seštejemo po stolpcih: $8 \cdot 6 = 48$. Vsota je ista, torej je čebel $48 : 3 = 16$.

Najpogostejša uporaba: v omrežju koč in stez je vsota števil stez iz posameznih koč enaka dvakratnemu številu stez, ker ima vsaka steza dva konca. Številu stez iz koče pravimo **stopnja** koče.

*Hiter preizkus:* ali lahko iz vsake od $7$ planinskih koč vodijo natanko $3$ steze? Odgovor: ne. Vsota $7 \cdot 3 = 21$ je liha, mora pa biti dvakratnik števila stez.

**5. Vključitve in izključitve.** Vrnimo se k Tinetu. Naj bo $D$ množica deževnih dni, $V$ pa množica vetrovnih. Dan, ki je hkrati deževen in vetroven, leži v **preseku** $D \cap V$. Tine ga je odštel dvakrat: enkrat med $12$ in še enkrat med $15$. Zato ga moramo enkrat prišteti nazaj:

$$|D \cup V| = |D| + |V| - |D \cap V|$$

Unija $D \cup V$ so dnevi z dežjem ali vetrom: $12 + 15 - 5 = 22$. Mirnih suhih dni je bilo $30 - 22 = 8$, ne $3$.

Pri treh množicah prištejemo posamezne, odštejemo vse pare in prištejemo presek vseh treh. Krajše:

$$|A \cup B \cup C| = S_1 - S_2 + S_3$$

Pri tem je $S_1 = |A| + |B| + |C|$, $S_2$ vsota moči treh presekov parov, $S_3 = |A \cap B \cap C|$. V simulaciji spodaj »Vključitve in izključitve« izberi dve lastnosti in preveri, da je moč unije res vsota moči obeh množic, zmanjšana za moč preseka.

:::premisli
Dan je bil deževen, vetroven in meglen hkrati. Kolikokrat ga štejejo $S_1$, $S_2$ in $S_3$? Zakaj ima $S_3$ znak plus?
---
$S_1$ ga šteje $3$-krat, $S_2$ prav tako $3$-krat (v vseh treh parih), $S_3$ enkrat. Skupaj $3 - 3 + 1 = 1$. Brez $+S_3$ ga sploh ne bi šteli.
:::

## Rešeni primeri

### Primer 1 (lažji): mravlja mimo cveta

Mravlja gre po mreži od $A(0; 0)$ do $B(5; 3)$, vsak korak proti vzhodu ali severu. Na poti mora obiskati cvet v vozlišču $C(2; 1)$. Koliko je takih poti?

**Podatki:** začetek $A(0; 0)$, cilj $B(5; 3)$, obvezno vozlišče $C(2; 1)$, koraki za $1$ proti vzhodu ali severu
**Iščemo:** število poti $N$ skozi $C$

:::formula
$N = \binom{3}{1} \cdot \binom{5}{2}$ (pot $A \to C$ in pot $C \to B$ izbiramo neodvisno)
:::

**Rešitev:**

1. Od $A$ do $C$: $2$ koraka V in $1$ korak S, izberemo mesto za S: $\binom{3}{1} = 3$.
2. Od $C$ do $B$: $3$ koraki V in $2$ koraka S: $\binom{5}{2} = 10$.
3. Vsak del prve poti lahko združimo z vsakim delom druge: $N = 3 \cdot 10 = 30$.
4. Odgovor: skozi cvet vodi $30$ od skupno $56$ poti.

### Primer 2: dežurstva na taboru

Na planinskem taboru je $15$ otrok. Vsak dan dežurajo natanko trije. Ob koncu tabora ugotovijo, da je bil vsak par otrok skupaj na dežurstvu natanko enkrat. Koliko dni je trajal tabor in kolikokrat je dežural vsak otrok?

**Podatki:** $15$ otrok, $3$ dežurni na dan, vsak par natanko enkrat skupaj
**Iščemo:** število dni $d$ in število dežurstev $r$ enega otroka

:::formula
Dvojno štetje parov: $d \cdot \binom{3}{2} = \binom{15}{2}$, za enega otroka $2r = 14$
:::

**Rešitev:**

1. Štejemo pare otrok, ki so skupaj dežurali. Po dnevih: vsak dan da $\binom{3}{2} = 3$ pare, skupaj $3d$.
2. Po parih: vsak par je dežuren natanko enkrat, parov je $\binom{15}{2} = 105$.
3. Izenačimo: $3d = 105$, zato $d = 35$.
4. Izberimo enega otroka. Z vsakim od ostalih $14$ je dežuren enkrat, na vsakem dežurstvu pa je z $2$ otrokoma. Zato $2r = 14$ in $r = 7$.
5. Preizkus z drugim dvojnim štetjem: dežurnih mest je $35 \cdot 3 = 105$, pa tudi $15 \cdot 7 = 105$.
6. Odgovor: tabor je trajal $35$ dni, vsak otrok je dežural $7$-krat.

### Primer 3 (težji): ptičje hišice

Ornitologinja obesi $10$ enakih ptičjih hišic na $4$ drevesa ob jasi, na vsako drevo vsaj eno. Pomembno je le, koliko hišic visi na katerem drevesu. Na koliko načinov lahko to naredi?

**Podatki:** $10$ enakih hišic, $4$ različna drevesa, na vsakem drevesu vsaj $1$ hišica
**Iščemo:** število razporeditev $R$

:::formula
Zvezdice in pregrade: $R = \binom{n+k-1}{k-1}$ za $n$ enakih predmetov v $k$ predalov brez omejitve
:::

**Rešitev:**

1. Pogoj »vsaj ena« najprej izpolnimo: na vsako drevo obesimo po eno hišico. Ostane $10 - 4 = 6$ hišic.
2. Razporeditve z vsaj eno hišico na drevesu so v bijekciji z razporeditvami preostalih $6$ hišic brez omejitve: vsakemu drevesu le dodamo ali odvzamemo tisto prvo hišico.
3. Za $6$ hišic in $4$ drevesa: $n = 6$, $k = 4$, $R = \binom{9}{3} = 84$.
4. Odgovor: razporeditev je $84$.

### Primer 4 – zdaj ti: drevesa z omejeno nosilnostjo

Ornitologinja ima $10$ enakih hišic in $3$ drevesa. Na drevo lahko obesi največ $4$ hišice. Na koliko načinov jih razporedi, če obesi vse?

**Podatki:** $10$ enakih hišic, $3$ drevesa, na vsakem drevesu od $0$ do $4$ hišic
**Iščemo:** število razporeditev $R$

:::formula
Vključitve in izključitve: $R = U - S_1 + S_2 - S_3$, kjer je $U$ število vseh razporeditev, $S_1$, $S_2$ in $S_3$ pa vsote moči množic s preveč hišicami
:::

**Rešitev:**

1. Brez omejitve: $U = \binom{12}{2} = 66$.
2. Naj bo $A_i$ množica razporeditev, kjer ima drevo $i$ vsaj $5$ hišic. Nanj vnaprej obesimo $5$, ostalih $5$ razporedimo prosto: $|A_i| = \binom{7}{2} = 21$. Torej $S_1 = 3 \cdot 21 = 63$.
3. Dve drevesi z vsaj $5$ hišicami porabita vseh $10$: $|A_i \cap A_j| = \binom{2}{2} = 1$, zato $S_2 = 3$. Vsa tri drevesa hkrati ne gredo ($15 > 10$), $S_3 = 0$.
4. Izračunaj $R$ sam, nato preveri:

:::premisli
Koliko je $R = 66 - 63 + 3 - 0$? Preveri z naštevanjem.
---
$R = 6$. Naštevanje: možni sta le trojici $4, 4, 2$ in $4, 3, 3$, vsaka v $3$ vrstnih redih, skupaj $6$.
:::

## Pogoste napake

- **Presek odštet dvakrat.** Tako je računal Tine: $30 - 12 - 15$. Dnevi z dežjem in vetrom so bili odšteti dvakrat. Popravek: $30 - (12 + 15 - 5) = 8$.
- **Pozabljen presek vseh treh.** Kdor pri treh množicah naredi le $S_1 - S_2$, elementa iz vseh treh množic ne šteje nikoli. Vedno preveri, kolikokrat šteješ element iz $r$ množic: skupaj mora biti $1$.
- **Preslikava, ki ni bijekcija.** Pare otrok v Primeru 2 bi lahko šteli kot $15 \cdot 14 = 210$. To so urejeni pari (Ana–Bor in Bor–Ana), torej vsak neurejeni par dvakrat, in dobiš $70$ dni. Preden izenačiš, preveri, da vsak element ustreza natanko enemu.
- **Zvezdice in pregrade za različne predmete.** Formula $\binom{n+k-1}{k-1}$ velja le za enake predmete. Pri $10$ različno pobarvanih hišicah vsaka sama izbere drevo, zato je razporeditev $4^{10}$.
- **Steza z enim koncem.** Pri dvojnem štetju v omrežju stez vsota stopenj ni število stez, ampak dvakratnik. Zato nikoli ne more biti liha.

## Povzetek

- Bijekcija med končnima množicama pomeni $|A| = |B|$: težko množico preštej prek lažje.
- Poti po mreži od $(0; 0)$ do $(m; n)$ s koraki vzhod in sever: $\binom{m+n}{n}$.
- Zvezdice in pregrade: $n$ enakih predmetov v $k$ predalov na $\binom{n+k-1}{k-1}$ načinov; pogoj »vsaj $1$« odpravi vnaprejšnja razdelitev.
- Dvojno štetje: isto količino (pare, enice v tabeli) preštej po vrsticah in po stolpcih. Vsota stopenj je dvakratnik števila povezav.
- Vključitve in izključitve: $|A \cup B| = |A| + |B| - |A \cap B|$; pri treh množicah $S_1 - S_2 + S_3$.
- Zgornjo mejo v razdelitvah obravnavaj z izključitvami množic »preveč v predalu $i$«.

## Drugače: Na sliki

Vennov diagram za tri lastnosti dni: dež ($A$), veter ($B$), megla ($C$). Krogi razdelijo ravnino na področja glede na to, v koliko množicah dan leži.

:::risba skica
opis: Trije prekrivajoči se krogi A (dež), B (veter) in C (megla). Srednje področje, kjer se prekrivajo vsi trije, je označeno s 3, področja, kjer se prekrivata dva, z 2, deli le v enem krogu z 1.
območje: 0; 0 .. 8; 6,4
enota: 36
krog: 3; 3,8 | 1,9 | modra
krog: 5; 3,8 | 1,9 | oranžna črtkano
krog: 4; 2,2 | 1,9 | zelena
napis: 1,9; 5,9 | A | sredina | debelo
napis: 6,1; 5,9 | B | sredina | debelo
napis: 4; 0,1 | C | sredina | debelo
napis: 2,4; 4,2 | 1 | sredina
napis: 5,6; 4,2 | 1 | sredina
napis: 4; 1,3 | 1 | sredina
napis: 4; 4,4 | 2 | sredina
napis: 3,1; 2,5 | 2 | sredina
napis: 4,9; 2,5 | 2 | sredina
napis: 4; 3,2 | 3 | sredina
:::

Števila povedo, v koliko krogih leži področje. Za vsako vrsto področja preštejmo, kolikokrat ga upošteva formula:

| Področje | $S_1$ | $S_2$ | $S_3$ |
|---|---|---|---|
| v $1$ krogu | $1$ | $0$ | $0$ |
| v $2$ krogih | $2$ | $1$ | $0$ |
| v $3$ krogih | $3$ | $3$ | $1$ |

V vsaki vrstici je $S_1 - S_2 + S_3 = 1$: vsak dan v uniji je štet natanko enkrat.

## Drugače: Bolj natančno

**Bijekcija** je preslikava $f\colon A \to B$, ki je **injektivna** (različna elementa gresta v različni sliki) in **surjektivna** (vsak element $B$ je slika nekega elementa). Za štetje je dovolj tudi manj: injektivna preslikava iz $A$ v $B$ dokaže $|A| \le |B|$. Tako na tekmovanjih dokazujemo neenakosti med števili načinov.

**Splošno načelo vključitev in izključitev** za množice $A_1, \dots, A_k$:

$$|A_1 \cup \dots \cup A_k| = S_1 - S_2 + S_3 - \dots$$

Tu je $S_j$ vsota moči vseh presekov po $j$ množic. Element, ki leži v natanko $r \ge 1$ množicah, formula šteje tolikokrat:

$$\binom{r}{1} - \binom{r}{2} + \dots \pm \binom{r}{r} = 1 - (1 - 1)^r = 1$$

Uporabili smo binomski izrek za $(1 - 1)^r$. Prav to je pokazala tabela v razdelku »Na sliki« za $r = 1, 2, 3$.

Zgled: števil od $1$ do $1000$, ki niso deljiva z $2$, $3$ ali $5$. Vsa deljiva z vsaj enim so unija treh množic: $S_1 = 500 + 333 + 200 = 1033$, $S_2 = 166 + 100 + 66 = 332$, $S_3 = 33$. Unija ima $1033 - 332 + 33 = 734$ števil, ostane jih $1000 - 734 = 266$.

## Preveri se

? Katera trditev je pravilna?
- Vsaka množica z $n$ elementi ima $n^2$ podmnožic.
~ Podmnožice ustrezajo nizom ničel in enic dolžine $n$, teh je $2^n$, ne $n^2$.
+ V omrežju koč in stez je vsota števil stez iz posameznih koč enaka dvakratnemu številu stez.
- Za poljubni množici velja $|A \cup B| = |A| + |B|$.
~ To velja le, ko je presek prazen. Sicer elemente preseka šteješ dvakrat.
> Vsaka steza ima dva konca, zato jo vsota po kočah šteje dvakrat. To je dvojno štetje.

? Primerjaj: $P$ je število poti po mreži od $(0; 0)$ do $(6; 2)$ s koraki proti vzhodu in severu, $Q$ pa število dvoelementnih podmnožic množice z $8$ elementi. Kaj velja?
- $P > Q$
~ Pot ima $8$ korakov, med njimi izberemo $2$ koraka proti severu. To je isto kot izbrati $2$ elementa od $8$.
+ $P = Q$
- $P = 2Q$
~ Vrstni red izbranih mest v nizu ni pomemben, zato poti ne štejemo dvakrat.
> Pot določa, katera $2$ od $8$ korakov gresta proti severu: to je bijekcija s podmnožicami. $P = Q = \binom{8}{2} = 28$.

? Dijak je rešil nalogo »Koliko števil od $1$ do $60$ je deljivih z $2$ ali s $3$?« takole: »Z $2$ je deljivih $30$ števil, s $3$ pa $20$. Skupaj jih je $30 + 20 = 50$.« Kje je napaka?
- Števil, deljivih s $3$, je $19$, ne $20$.
~ Tudi $60$ je deljivo s $3$, zato jih je res $60 : 3 = 20$.
+ Števila, deljiva s $6$, je štel dvakrat; pravilno je $30 + 20 - 10 = 40$.
- Namesto seštevanja bi moral množiti: $30 \cdot 20$.
~ Produkt šteje pare števil, ne števil. Pri »ali« seštevamo in popravimo presek.
> Števila, deljiva z $2$ in s $3$, so deljiva s $6$; takih je $10$ in vsa so v obeh skupinah.

? Mravlja gre po mreži na sliki od $A$ do $B$, vsak korak proti vzhodu ali severu. Vozlišče $J$ je jezero, ki se mu mora izogniti. Koliko poti ji ostane?
:::risba skica
opis: Mreža 4 krat 3 enote. A je v točki (0; 0), B v točki (4; 3). Jezero J je v vozlišču (2; 1).
območje: -0,8; -0,8 .. 4,8; 3,8
enota: 50
mreža: da
točka: 0; 0 | A | pod levo
točka: 4; 3 | B | nad desno
krog: 2; 1 | 0,3 | modra polno
napis: 2,4; 0,6 | J | desno | debelo
:::
= 17
~ 35 | To so vse poti od $A$ do $B$. Odšteti moraš še tiste, ki gredo skozi jezero.
~ 18 | To so poti skozi jezero. Iskane so tiste, ki ga obidejo.
~ 53 | Poti skozi jezero si prištel, moral bi jih odšteti.
> Vseh poti je $\binom{7}{3} = 35$. Skozi $J$: $\binom{3}{1} \cdot \binom{4}{2} = 3 \cdot 6 = 18$. Ostane $35 - 18 = 17$.

? Vremenska postaja je v $30$ dneh zabeležila: dež $13$ dni, veter $11$, meglo $8$; dež in veter $5$ dni, dež in meglo $3$, veter in meglo $2$, vse tri $1$ dan. Koliko dni ni bilo ničesar od tega?
= 7
~ 8 | Pozabil si prišteti dan z vsemi tremi pojavi ($+S_3$).
~ 9 | Dan z vsemi tremi pojavi si odštel, moral bi ga prišteti.
~ -2 | Odštel si le posamezne pojave; dneve v presekih si s tem odštel večkrat.
> Unija: $13 + 11 + 8 - 5 - 3 - 2 + 1 = 23$. Brez pojavov: $30 - 23 = 7$ dni.

<<RACUN
vrednost: 2^5 | 32
vrednost: factorial(8)/(factorial(3)*factorial(5)) | 56
vrednost: factorial(7)/(factorial(2)*factorial(5)) | 21
vrednost: 8*6/3 | 16
vrednost: 30-(12+15-5) | 8
vrednost: factorial(3)/(factorial(1)*factorial(2))*factorial(5)/(factorial(2)*factorial(3)) | 30
vrednost: (factorial(15)/(factorial(2)*factorial(13)))/(factorial(3)/(factorial(2)*factorial(1))) | 35
vrednost: 14/2 | 7
vrednost: factorial(9)/(factorial(3)*factorial(6)) | 84
vrednost: factorial(12)/(factorial(2)*factorial(10))-3*factorial(7)/(factorial(2)*factorial(5))+3*factorial(2)/(factorial(2)*factorial(0)) | 6
vrednost: 1000-(500+333+200)+(166+100+66)-33 | 266
vrednost: factorial(8)/(factorial(2)*factorial(6)) | 28
vrednost: 30+20-10 | 40
vrednost: factorial(7)/(factorial(3)*factorial(4))-factorial(3)/(factorial(1)*factorial(2))*factorial(4)/(factorial(2)*factorial(2)) | 17
vrednost: 30-(13+11+8-5-3-2+1) | 7
>>

:::simboli
N | število poti | N = \binom{m+n}{n} | | v Primeru 1 število poti skozi $C$
m | število korakov proti vzhodu | | |
n | število korakov proti severu; število enakih predmetov; število elementov množice | | | pomen je odvisen od formule
k | število predalov (dupelj, dreves) | | | v splošnem načelu vključitev in izključitev število množic
R | število razporeditev | R = \binom{n+k-1}{k-1} | | enaki predmeti, predali so lahko prazni
d | število dni tabora | d \cdot \binom{3}{2} = \binom{15}{2} | |
r | število dežurstev enega otroka; število množic, v katerih leži element | | |
D | množica deževnih dni | | |
V | množica vetrovnih dni | | |
A, B, C | množice (lastnosti) | | | pri poteh po mreži so to točke: začetek $A$, cilj $B$, cvet $C$
A_i | razporeditve s preveč hišicami na drevesu $i$ | | |
S_1 | vsota moči posameznih množic | S_1 = \lvert A \rvert + \lvert B \rvert + \lvert C \rvert | |
S_2 | vsota moči presekov parov | | |
S_3 | moč preseka vseh treh množic | S_3 = \lvert A \cap B \cap C \rvert | |
U | število vseh razporeditev brez omejitve | | |
:::
