---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nika pri kartografskem projektu dobi cestno omrežje. Kraji so vozlišča, ceste povezave, vsak kraj je dosegljiv iz vsakega. Naročnik želi **drevo poti**: izbor cest, po katerem še vedno prideš iz vsakega kraja v vsak drug, krožnih poti pa ni.

Pri omrežju s $40$ kraji je naloga lahka. Dokler obstaja krog, z njega odstraniš eno cesto. Povezanost ostane, cest je vsakič manj, zato se postopek po končno mnogo korakih ustavi. To je skrita **indukcija** po številu cest.

Nato pride drugo naročilo: model neskončne mreže, kjer se ceste nadaljujejo brez konca. Odstranjevanje se nikoli ne ustavi. Ali drevo poti sploh obstaja? Odgovor da **Zornova lema**, ta pa stoji na **aksiomu izbire**. Da razumeš, zakaj indukcija in Zornova lema veljata, potrebuješ temelj, na katerem stoji vsa matematika: aksiome teorije množic **ZFC** (Zermelo, Fraenkel in angl. *choice*, izbira).

## Razlaga

**1. Števila kot stopnice.** Naravnih števil v teoriji množic ne privzamemo, ampak jih zgradimo iz prazne množice. Vsako število je množica vseh prejšnjih:

| $n$ | množica | elementi |
|---|---|---|
| $0$ | $\emptyset$ | nobenega |
| $1$ | $\{0\}$ | $0$ |
| $2$ | $\{0, 1\}$ | $0, 1$ |
| $3$ | $\{0, 1, 2\}$ | $0, 1, 2$ |

Predstavljaj si stopnice: vsaka nova stopnica nosi vse spodnje. Korak navzgor je **naslednik** $S(n) = n \cup \{n\}$. Število $n$ ima natanko $n$ elementov, urejenost $m < n$ pa je kar $m \in n$. Takim številom rečemo von Neumannova naravna števila.

**2. Pravila igre: aksiomi ZFC.** Da lahko tako gradimo, moramo vedeti, katere množice smemo tvoriti. To povedo aksiomi:

| aksiom | kaj zagotavlja |
|---|---|
| ekstenzionalnost | množici sta enaki, če imata iste elemente |
| prazna množica | obstaja $\emptyset$ |
| par | iz $a, b$ dobimo $\{a, b\}$ |
| unija | iz družine množic dobimo njeno unijo |
| potenčna množica | obstaja $\mathcal{P}(A)$ |
| separacija (shema) | $\{x \in A : \varphi(x)\}$ je množica |
| zamenjava (shema) | slika množice s predpisom je množica |
| neskončnost | obstaja množica, ki vsebuje $\emptyset$ in z vsakim $x$ tudi $S(x)$ |
| regularnost | vsaka neprazna $A$ ima $x \in A$ z $x \cap A = \emptyset$ |
| izbira (AC) | vsaka družina nepraznih množic ima izbirno funkcijo (iz vsake izbere en element) |

Separacija dovoli izbirati elemente le iz že obstoječe množice $A$. Zato »množica vseh množic« $V$ ne obstaja: iz nje bi separacija dala $R = \{x \in V : x \notin x\}$, za katero bi veljalo $R \in R$ natanko tedaj, ko $R \notin R$ (Russellov paradoks). Brez zadnje vrstice sistemu rečemo ZF.

**3. Od stopnic do $\omega$.** Množica je **induktivna**, če vsebuje $0$ in z vsakim $n$ tudi $S(n)$. Aksiom neskončnosti pove, da kakšna induktivna množica obstaja. Presek vseh njenih induktivnih podmnožic je najmanjša induktivna množica, označimo jo z $\omega$. To je množica naravnih števil, hkrati najmanjši neskončni ordinal.

**4. Peanova aritmetika.** Peano je naravna števila opisal s petimi lastnostmi:

1. $0$ je naravno število.
2. Vsako naravno število $n$ ima naslednika $S(n)$.
3. $0$ ni naslednik nobenega števila.
4. Iz $S(m) = S(n)$ sledi $m = n$.
5. **Indukcija:** če množica $A \subseteq \omega$ vsebuje $0$ in z vsakim $n$ tudi $S(n)$, je $A = \omega$.

V $\omega$ veljajo vse. Peti je skoraj zastonj: $A$ je induktivna, $\omega$ pa najmanjša induktivna, zato $\omega \subseteq A$. Seštevanje in množenje definiramo **rekurzivno**: $a + 0 = a$, $a + S(b) = S(a + b)$ ter $a \cdot 0 = 0$, $a \cdot S(b) = a \cdot b + a$.

**5. Matematična indukcija kot domine.** Domine stojijo v vrsti. Če pade prva (**baza**, $P(0)$) in vsaka podrta podre naslednjo (**korak**, $P(n) \Rightarrow P(n+1)$), padejo vse. Pomembno: korak mora delovati za *vsak* $n$, tudi za najmanjše. Ena trdna domina sredi vrste ustavi vse za njo.

Različice so enakovredne: **krepka indukcija** (pri koraku smeš uporabiti vse $P(0), \ldots, P(n)$) in **dobra urejenost** $\omega$ (vsaka neprazna podmnožica ima najmanjši element).

:::premisli
Zakaj za izbiro po enega elementa iz **končno** mnogo nepraznih množic ne potrebujemo aksioma izbire?
---
Z indukcijo po številu množic. Iz ene neprazne množice element izberemo že po logiki (»obstaja $x$, vzemimo ga«). Če znamo izbrati iz $n$ množic, dodamo še eno izbiro in jo s parom in unijo pridružimo funkciji. Za neskončno družino ta postopek ne konča, zato potrebujemo AC.
:::

**6. Aksiom izbire na zemljevidu.** Na zemljevidu je neskončno mnogo držav, vsaka ima neprazno množico mest. Hočemo **izbirno funkcijo**: vsaki državi priredi eno njeno mesto. Če imamo pravilo (»vzemi glavno mesto«), funkcijo zapišemo s separacijo. Pri družini vseh nepraznih podmnožic $\mathbb{R}$ pa takega pravila ne poznamo. AC pravi, da izbirna funkcija vseeno obstaja, čeprav je ne znamo zapisati.

**7. Zornova lema na Hassejevem diagramu.** Nariši delno urejeno množico $(P, \leq)$ kot Hassejev diagram: večji elementi so višje. **Veriga** je navpična pot, v kateri sta vsaka dva elementa primerljiva (eden leži pod drugim). **Zgornja meja** verige je element iz $P$, ki je nad vsemi njenimi členi. **Maksimalni element** je točka, nad katero ni ničesar; lahko jih je več, kot vrhov v gorovju.

> **Zornova lema.** Če je $(P, \leq)$ neprazna in ima v njej vsaka veriga zgornjo mejo v $P$, ima $P$ maksimalni element.

V ZF so enakovredne trditve: aksiom izbire, Zornova lema in Zermelov izrek (vsako množico lahko dobro uredimo).

:::premisli
Vzemi $(\omega, \leq)$ z običajno urejenostjo. Maksimalnega elementa nima. Kateri pogoj Zornove leme torej ni izpolnjen?
---
Veriga $\omega$ sama (vsa števila so primerljiva) nima zgornje meje v $\omega$: nad vsakim $n$ je še $n + 1$. Zorn tu ne trdi ničesar, saj predpostavka ne drži.
:::

## Rešeni primeri

### Primer 1: stopnica naprej

Zapiši von Neumannovo število $3$ samo z zavitimi oklepaji in $\emptyset$. Nato izračunaj $4 = S(3)$ in preštej njegove elemente.

**Podatki:** $0 = \emptyset$, $S(n) = n \cup \{n\}$
**Iščemo:** zapis $3$, zapis $4$ in $|4|$

:::formula
$S(n) = n \cup \{n\}$
:::

**Rešitev:**

1. $1 = S(0) = \emptyset \cup \{\emptyset\} = \{\emptyset\}$, ker je unija s prazno množico ne spremeni.
2. $2 = S(1) = \{\emptyset\} \cup \{\{\emptyset\}\} = \{\emptyset, \{\emptyset\}\}$.
3. $3 = S(2) = \{\emptyset, \{\emptyset\}, \{\emptyset, \{\emptyset\}\}\}$, torej $3 = \{0, 1, 2\}$.
4. $4 = 3 \cup \{3\} = \{0, 1, 2, 3\}$, ker naslednik doda prav prejšnje število.
5. Odgovor: $4$ ima $4$ elemente, tako kot ima vsako von Neumannovo število $n$ natanko $n$ elementov.

### Primer 2: vozovnice na progi

Regionalna železniška proga ima $n$ postaj v vrsti. Za vsak par različnih postaj prodajajo eno vozovnico (smer ni pomembna). Dokaži z indukcijo, da je vozovnic $\dfrac{n(n-1)}{2}$, in izračunaj število za $n = 8$.

**Podatki:** $n \geq 1$ postaj, ena vozovnica za vsak neurejen par različnih postaj, $n = 8$
**Iščemo:** dokaz formule in število vozovnic pri $8$ postajah

:::formula
$V(n) = \dfrac{n(n-1)}{2}$; korak: $V(n+1) = V(n) + n$
:::

**Rešitev:**

1. Baza $n = 1$: ena postaja nima para, vozovnic je $0$, formula da $\dfrac{1 \cdot 0}{2} = 0$.
2. Indukcijska predpostavka: za $n$ postaj je vozovnic $\dfrac{n(n-1)}{2}$.
3. Dodamo postajo $n + 1$ na konec proge. Nove so le vozovnice od nje do vsake od $n$ starih postaj, torej $n$ novih.
4. $V(n+1) = \dfrac{n(n-1)}{2} + n = \dfrac{n(n-1) + 2n}{2} = \dfrac{(n+1)n}{2}$, kar je formula za $n + 1$.
5. Po principu indukcije formula velja za vsak $n \geq 1$.
6. Za $n = 8$: $\dfrac{8 \cdot 7}{2} = 28$.
7. Odgovor: na progi z $8$ postajami je $28$ različnih vozovnic.

### Primer 3: drevo poti v neskončnem omrežju

Vrnimo se k Niki. Cestno omrežje je povezan graf $G = (V, E)$, lahko neskončen. Dokaži, da ima **vpeto drevo**: množico cest $T \subseteq E$ brez krogov, po kateri sta povezana vsaka dva kraja.

**Podatki:** povezan graf $G = (V, E)$, $V$ in $E$ sta lahko neskončni; krog je končen
**Iščemo:** obstoj vpetega drevesa $T$

:::formula
Zornova lema: neprazna $(P, \subseteq)$, v kateri ima vsaka veriga zgornjo mejo v $P$, ima maksimalni element.
:::

**Rešitev:**

1. Naj bo $P$ množica vseh $F \subseteq E$ brez krogov (»gozdov«), urejena z $\subseteq$. $P$ ni prazna, ker je $\emptyset \in P$.
2. Vzemi verigo $\mathcal{C} \subseteq P$ in njeno unijo $U = \bigcup \mathcal{C}$. Unija je naravni kandidat, ker vsebuje vse člene.
3. $U$ nima kroga: krog ima končno mnogo cest, vsaka leži v nekem členu verige, členi so primerljivi, zato vse ležijo v največjem od njih. Ta pa je brez krogov. Torej je $U \in P$ zgornja meja.
4. Po Zornovi lemi obstaja maksimalni gozd $T$.
5. Recimo, da $T$ ne poveže krajev $a$ in $b$. Na poti od $a$ do $b$ v $G$ je cesta $e$, ki povezuje dve različni komponenti $T$ (dela omrežja, ki ju ceste iz $T$ med sabo ne povežejo). Ker $e$ združi dve ločeni komponenti, gozd $T \cup \{e\}$ ostane brez kroga in je večji od $T$, kar je protislovje.
6. Odgovor: maksimalni gozd $T$ poveže vse kraje in nima krogov, torej je vpeto drevo. Za končne grafe zadošča indukcija, za poljubne neskončne potrebujemo Zorna.

### Primer 4: zdaj ti

Po Peanovih rekurzivnih pravilih izračunaj $2 + 2$. Uporabljaš samo definicijo seštevanja in $1 = S(0)$, $2 = S(1)$.

**Podatki:** $a + 0 = a$, $a + S(b) = S(a + b)$, $1 = S(0)$, $2 = S(1)$, $3 = S(2)$, $4 = S(3)$
**Iščemo:** $2 + 2$

:::formula
$a + S(b) = S(a + b)$
:::

**Rešitev:**

1. Drugi sumand zapišemo kot naslednika: $2 + 2 = 2 + S(1) = S(2 + 1)$.
2. Enako za $1$: $2 + 1 = 2 + S(0) = S(2 + 0)$.
3. Dokončaj sam in preveri:

:::premisli
Kaj dobiš, ko uporabiš še $a + 0 = a$ in definicije števil?
---
$2 + 0 = 2$, torej $2 + 1 = S(2) = 3$ in $2 + 2 = S(3) = 4$.
:::

## Pogoste napake

- **Korak, ki ne deluje pri majhnih $n$.** »Vsi avtobusi na postaji so iste barve«: iz skupine $n + 1$ vzamemo prvih $n$ in zadnjih $n$, ki se prekrivata. Pri $n = 1$ se skupini z enim avtobusom ne prekrivata, zato se veriga domin ustavi že pri drugi. Popravek: korak preveri za *vsak* $n$, posebej za najmanjšega.
- **Pozabljena baza.** Korak $P(n) \Rightarrow P(n+1)$ brez $P(0)$ ne dokaže ničesar: »$n = n + 1$« bi iz sebe izpeljal $n + 1 = n + 2$. Vedno najprej preveri začetni primer.
- **»Aksiom izbire rabimo za vsako izbiro.«** Za končno mnogo nepraznih množic izbirna funkcija obstaja že v ZF (indukcija). AC je potreben šele za neskončne družine brez pravila izbire.
- **Maksimalni = največji.** Zorn da element, nad katerim ni ničesar, ne elementa nad vsemi. V Hassejevem diagramu je lahko več vrhov. Največji obstaja le, če je maksimalni en sam in so vsi pod njim.
- **Zgornja meja zunaj $P$.** Pri Zornu ni dovolj, da ima veriga mejo »nekje«; ležati mora v $P$. Zato je v Primeru 3 ključni korak, da unija verige gozdov spet nima krogov.

## Povzetek

- Von Neumannova števila: $0 = \emptyset$, $S(n) = n \cup \{n\}$; število $n$ je množica $\{0, \ldots, n-1\}$.
- ZFC: ekstenzionalnost, prazna množica, par, unija, potenčna množica, separacija, zamenjava, neskončnost, regularnost in izbira.
- $\omega$ je najmanjša induktivna množica; v njej veljajo Peanovi aksiomi, indukcija sledi iz minimalnosti.
- Indukcija: baza in korak za vsak $n$. Enakovredni sta krepka indukcija in dobra urejenost $\omega$.
- Aksiom izbire: vsaka družina nepraznih množic ima izbirno funkcijo. Za končne družine ga ne potrebujemo.
- Zornova lema: neprazna delno urejena množica, v kateri ima vsaka veriga zgornjo mejo v $P$, ima maksimalni element. V ZF je enakovredna AC in Zermelovemu izreku.

## Za izpit

Znati moraš povedati:
- definicijo naslednika $S(n) = n \cup \{n\}$, induktivne množice in množice $\omega$ kot najmanjše induktivne množice;
- vseh deset aksiomov ZFC, pri vsakem, kaj zagotavlja, in zakaj separacija ne dovoli »množice vseh množic« (Russellov paradoks);
- Peanove aksiome, dokaz principa indukcije iz minimalnosti $\omega$ ter rekurzivni definiciji seštevanja in množenja;
- princip matematične indukcije z bazo in korakom ter enakovredni obliki: krepko indukcijo in dobro urejenost $\omega$;
- aksiom izbire z definicijo izbirne funkcije in utemeljitev, zakaj ga za končne družine ne potrebujemo;
- Zornovo lemo z vsemi predpostavkami (neprazna $P$, zgornja meja vsake verige v $P$), razliko med maksimalnim in največjim elementom ter enakovrednost z AC in Zermelovim izrekom v ZF.

### Naloga 1

Seštevanje in množenje na $\omega$ sta definirana rekurzivno: $a + 0 = a$, $a + S(b) = S(a + b)$ ter $a \cdot 0 = 0$, $a \cdot S(b) = a \cdot b + a$. Označimo $1 = S(0)$, $2 = S(1)$, $3 = S(2)$, $4 = S(3)$, $5 = S(4)$, $6 = S(5)$. (a) Samo po teh pravilih izračunaj $2 \cdot 3$. (b) Z indukcijo dokaži, da za vse $a, b \in \omega$ velja $0 + a = a$ in $S(a) + b = S(a + b)$. (c) Iz (b) izpelji, da je seštevanje komutativno: $a + b = b + a$.

**Rešitev:**

1. (a) Množenje razvijemo do baze: $2 \cdot 3 = 2 \cdot 2 + 2$, $2 \cdot 2 = 2 \cdot 1 + 2$, $2 \cdot 1 = 2 \cdot 0 + 2 = 0 + 2$.
2. $0 + 2 = S(0 + 1) = S(S(0 + 0)) = S(S(0)) = 2$, torej $2 \cdot 1 = 2$.
3. $2 \cdot 2 = 2 + 2 = S(2 + 1) = S(S(2 + 0)) = S(S(2)) = 4$.
4. $2 \cdot 3 = 4 + 2 = S(4 + 1) = S(S(4 + 0)) = S(S(4)) = 6$.
5. (b) Trditev $0 + a = a$ dokažemo z indukcijo po $a$. Baza: $0 + 0 = 0$ po pravilu $a + 0 = a$. Korak: če je $0 + a = a$, je $0 + S(a) = S(0 + a) = S(a)$.
6. Trditev $S(a) + b = S(a + b)$ dokažemo pri poljubnem, a izbranem $a$ z indukcijo po $b$. Baza: $S(a) + 0 = S(a) = S(a + 0)$.
7. Korak: če je $S(a) + b = S(a + b)$, je $S(a) + S(b) = S(S(a) + b) = S(S(a + b)) = S(a + S(b))$. Prvi in zadnji enačaj sta definicija seštevanja, srednji je indukcijska predpostavka.
8. (c) Pri izbranem $a$ naredimo indukcijo po $b$. Baza: $a + 0 = a = 0 + a$ po točki 5.
9. Korak: če je $a + b = b + a$, je $a + S(b) = S(a + b) = S(b + a) = S(b) + a$; zadnji enačaj je točka 7 z zamenjanima vlogama črk.
10. Odgovor: $2 \cdot 3 = 6$; po principu indukcije veljata obe pomožni trditvi in iz njiju $a + b = b + a$ za vse $a, b \in \omega$. Tri indukcije so potrebne, ker definicija seštevanja razvija le desni sumand.

### Naloga 2

Naj bosta $A$ in $B$ poljubni množici. Z Zornovo lemo dokaži, da obstaja injektivna preslikava $A \to B$ ali injektivna preslikava $B \to A$ (moči množic sta vedno primerljivi). Natančno povej, kje uporabiš vsako predpostavko leme.

**Rešitev:**

1. Naj bo $P$ množica vseh injektivnih preslikav $f\colon D_f \to B$, kjer je $D_f \subseteq A$. Vsaka taka $f$ je množica urejenih parov, $f \subseteq A \times B$, zato je $P$ množica po separaciji iz $\mathcal{P}(A \times B)$. Uredimo jo z $\subseteq$: $f \subseteq g$ pomeni, da $g$ razširja $f$.
2. $P$ ni prazna: prazna preslikava $\emptyset$ (z $D_\emptyset = \emptyset$) je injektivna, torej $\emptyset \in P$.
3. Naj bo $\mathcal{C} \subseteq P$ veriga in $U = \bigcup \mathcal{C}$. Pokažimo, da je $U$ preslikava: če sta $(x, y), (x, y') \in U$, ležita para v členih $f, g \in \mathcal{C}$. Ker sta primerljiva, sta oba para v večjem od njiju, ta pa je preslikava, zato $y = y'$.
4. $U$ je injektivna z enakim sklepom: para $(x, y), (x', y) \in U$ ležita v istem členu verige, ki je injektiven, zato $x = x'$. Torej je $U \in P$ in je zgornja meja verige $\mathcal{C}$.
5. Predpostavki Zornove leme sta izpolnjeni, zato ima $P$ maksimalni element $f$ z definicijskim območjem $D_f$ in zalogo vrednosti $Z_f = f(D_f)$.
6. Recimo, da je $D_f \neq A$ in $Z_f \neq B$. Izberemo $a \in A \setminus D_f$ in $b \in B \setminus Z_f$ (ena sama izbira, zanjo AC ni potreben). Tedaj je $f \cup \{(a, b)\}$ injektivna preslikava, ki je strogo večja od $f$. To je v protislovju z maksimalnostjo.
7. Torej je $D_f = A$ ali $Z_f = B$. V prvem primeru je $f\colon A \to B$ injektivna. V drugem je $f\colon D_f \to B$ bijekcija, zato je $f^{-1}\colon B \to D_f \subseteq A$ injektivna preslikava $B \to A$.
8. Odgovor: vedno obstaja injekcija $A \to B$ ali injekcija $B \to A$. Nepraznost $P$ smo uporabili v točki 2, zgornjo mejo verige v $P$ v točkah 3 in 4, maksimalnost pa v točki 6.

### Naloga 3

Natančno navedi aksiom regularnosti in z njim utemelji: (a) nobena množica ni element same sebe; (b) ne obstajata množici $x$ in $y$ z $x \in y$ in $y \in x$; (c) za vsako množico $n$ je $S(n) \neq n$. (d) Utemelji na dva načina, da »množica vseh množic« ne obstaja: z regularnostjo in s separacijo.

**Rešitev:**

1. Aksiom regularnosti: vsaka neprazna množica $A$ ima element $x \in A$, za katerega je $x \cap A = \emptyset$.
2. (a) Recimo, da je $x \in x$. Po aksiomu para obstaja $A = \{x\}$. Njen edini element je $x$, zanj pa je $x \in x \cap A$, torej $x \cap A \neq \emptyset$. To nasprotuje regularnosti, zato $x \notin x$.
3. (b) Recimo, da je $x \in y$ in $y \in x$. Vzemimo $A = \{x, y\}$. Tedaj je $y \in x \cap A$ in $x \in y \cap A$, zato noben element $A$ nima praznega preseka z $A$. Protislovje.
4. (c) Po definiciji je $n \in n \cup \{n\} = S(n)$. Če bi bilo $S(n) = n$, bi veljalo $n \in n$, kar nasprotuje točki (a).
5. (d) Z regularnostjo: če bi množica vseh množic $V$ obstajala, bi bila tudi sama množica, torej $V \in V$, kar nasprotuje točki (a).
6. S separacijo: iz $V$ bi dobili množico $R = \{x \in V : x \notin x\}$. Ker je $R \in V$, velja $R \in R$ natanko tedaj, ko $R \notin R$. To je protislovje (Russellov paradoks), zato $V$ ne obstaja.
7. Sklep: regularnost prepove krožne verige pripadnosti, zato nobena množica ni element same sebe in naslednik je vedno nova množica. Drugi dokaz v (d) regularnosti ne potrebuje; množice vseh množic ni že v sistemu brez nje.

## Drugače: Z analogijo

Indukcija je kot planinska koča s pravilom: »Kdor pride v kočo $n$, zna priti do koče $n + 1$.« Če znaš priti do prve koče, prideš do katere koli. Sama pot do koče $1000$ je končna, zato zadošča indukcija.

Zornova lema je kot vzpon po grebenu, ki se cepi. Vsaka veriga je ena smer vzpona. Pogoj leme pravi: na vsaki smeri, ki jo hodiš v nedogled, obstaja točka nad vsem, kar si prehodil. Lema iz tega sklepa, da obstaja vrh, nad katerim ni ničesar več. Ne pove, kje je, in ne trdi, da je en sam.

## Drugače: Uporaba v stroki

**Raziskovalna matematika.** Zornova lema je standardno orodje za obstojne izreke v algebri in analizi. Z enakim vzorcem kot v Primeru 3 (delni objekti, unija verige, maksimalni element) dokažemo, da ima vsak vektorski prostor bazo, da ima vsak netrivialen kolobar z enico maksimalni ideal, in Hahn-Banachov izrek o razširitvi funkcionala. Baza prostora $\mathbb{R}$ nad $\mathbb{Q}$ (Hamelova baza) obstaja, zapisati pa je ne zna nihče. Zato matematiki v člankih pogosto označijo, kateri izreki so odvisni od AC: brez njega obstajajo modeli ZF, v katerih kak vektorski prostor nima baze.

**Računalniško preverjanje dokazov in programov.** Dokazovalniki, kot so Lean, Rocq (prej Coq) in Isabelle, dokaz sprejmejo le, če vsak korak sledi iz izbranih aksiomov, in izpišejo, katere aksiome dokaz uporablja. V Leanu je aksiom izbire (`Classical.choice`) eden od treh osnovnih aksiomov, Zornova lema pa je v knjižnici Mathlib iz njega dokazan izrek. Indukcija je vsakdanje orodje pri preverjanju programske opreme: pravilnost zanke dokažemo z zančno invarianto (baza pred prvim obhodom, korak za en obhod), pravilnost rekurzivne funkcije pa s krepko indukcijo po velikosti vhoda.

## Drugače: Bolj natančno

**Indukcija v $\omega$.** Naj bo $A \subseteq \omega$ induktivna. Ker je $\omega$ presek vseh induktivnih podmnožic izbrane induktivne množice $I$ in je $A \subseteq I$ ena izmed njih, je $\omega \subseteq A$, torej $A = \omega$.

**Zorn $\Rightarrow$ AC.** Naj bo $\{A_i\}_{i \in J}$ družina nepraznih množic. $P$ naj bodo delne izbirne funkcije $f$ (definirane na delu $J$, $f(i) \in A_i$), urejene z razširitvijo ($f \subseteq g$). $\emptyset \in P$; unija verige je spet delna izbirna funkcija, zato zgornja meja. Maksimalna $f$ je definirana na vsem $J$: sicer bi pri manjkajočem $i$ dodali kak $a \in A_i$ in $f$ razširili. Obratno smer (AC $\Rightarrow$ Zorn) običajno dokažemo s transfinitno rekurzijo po ordinalih.

## Preveri se

? Kateri od naštetih **ni** aksiom ZFC?
- aksiom unije
~ Aksiom unije je v ZFC: iz družine množic tvori njeno unijo.
- aksiom neskončnosti
~ Ta je v ZFC in zagotovi obstoj induktivne množice, iz katere dobimo $\omega$.
+ hipoteza kontinuuma
- aksiom potenčne množice
~ Potenčna množica $\mathcal{P}(A)$ obstaja prav po tem aksiomu ZFC.
> Hipoteza kontinuuma ni aksiom ZFC. Dokazano je, da je od ZFC neodvisna: niti je ne moremo dokazati niti ovreči.

? Koliko elementov ima $\mathcal{P}(3)$, kjer je $3$ von Neumannovo število?
- $3$
~ To je število elementov množice $3 = \{0, 1, 2\}$, ne njene potenčne množice.
- $4$
~ To je $S(3) = \{0, 1, 2, 3\}$; naslednik doda en element, potenčna množica pa vzame vse podmnožice.
+ $8$
- $6$
~ To je $2 \cdot 3$. Število podmnožic $n$-elementne množice je $2^n$, ne $2n$.
> $3 = \{0, 1, 2\}$ ima $3$ elemente, zato ima $2^3 = 8$ podmnožic.

? Kaj se zgodi, če iz ZF odstranimo aksiom neskončnosti (ostali aksiomi ostanejo)?
- Ne moremo več tvoriti števila $5$.
~ Število $5$ zgradimo v končno mnogo korakih s parom in unijo; za to neskončnosti ne potrebujemo.
+ Ne moremo več dokazati, da obstaja množica vseh naravnih števil $\omega$.
- Indukcija ne velja več niti za končne množice.
~ Indukcija za vsako posamezno končno vrsto korakov ostane; izgubimo le množico, ki zbere vsa števila.
> Vsako posamezno število $n$ obstaja tudi brez tega aksioma, množica, ki vsebuje vse hkrati, pa ne. Aksiom neskončnosti zagotovi induktivno množico, iz nje pa $\omega$.

? »Dokaz«, da so vsi avtobusi na postaji iste barve: (1) baza: en avtobus je iste barve kot sam s sabo; (2) predpostavka: vsaka skupina $n$ avtobusov je enobarvna; (3) iz skupine $n + 1$ vzamemo prvih $n$ in zadnjih $n$, obe sta enobarvni; (4) ker se prekrivata, so vsi iste barve. Kateri korak je napačen?
- (1), ker baza mora biti $n = 0$.
~ Baza $n = 1$ je čisto dovoljena; začetek indukcije izberemo sami.
- (2), ker predpostavljamo, kar dokazujemo.
~ To ni krožno: trditev predpostavimo le za $n$, dokazujemo pa jo za $n + 1$. Tako deluje vsaka indukcija.
+ (4), ker se pri $n = 1$ skupini ne prekrivata.
- (3), ker skupine $n$ avtobusov ne moremo izbrati.
~ Iz $n + 1$ avtobusov lahko vedno vzamemo $n$ avtobusov; tu ni napake.
> Pri prehodu z $1$ na $2$ sta skupini »prvi« in »zadnji« avtobus brez skupnega člana, zato prekrivanje ne velja. Korak mora delovati za vsak $n$.

? Nik načrtuje pot skozi $12$ krajev in v vsakem izbere en hotel od več možnih. Ali za obstoj takega izbora potrebuje aksiom izbire?
- Da, ker izbira med hoteli nima nobenega pravila.
~ Pravila ne potrebujemo, ko je izbir končno mnogo: element iz vsake neprazne množice izberemo eno po eno.
+ Ne, za končno mnogo nepraznih množic izbirna funkcija obstaja že v ZF.
- Da, ker je v vsakem kraju več kot en hotel.
~ Število hotelov v posameznem kraju ni pomembno; pomembno je, da je krajev končno mnogo.
> Z indukcijo po številu množic: iz $12$ nepraznih množic izberemo po en element brez AC. Aksiom izbire potrebujemo šele za neskončne družine brez pravila izbire.

:::simboli
S | naslednik | S(n) = n \cup \{n\}
n | naravno število (kot množica)
V | število vozovnic na progi z n postajami | V(n) = \frac{n(n-1)}{2} | | »množica vseh množic« V ne obstaja
P | delno urejena množica v Zornovi lemi | | | P(n) je tudi trditev pri indukciji
a, b | naravni števili | | | pri aksiomu para poljubni množici
:::
