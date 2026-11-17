---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

V 17. stoletju je francoski filozof in matematik René Descartes (po latinsko Cartesius) iskal način, kako bi geometrijo povezal z računanjem. Njegova zamisel je bila preprosta in je spremenila matematiko: lego točke opišemo z **dvema številoma**, ki imata vsako svojo vlogo. Prvo pove, koliko gremo v desno, drugo, koliko gremo navzgor.

Isto zamisel uporabljaš, ko na turističnem zemljevidu mesta iščeš grad v kvadratu »C4«. Stolpec C in vrstica 4 skupaj določita en sam kvadrat. Precej pozneje, ko so matematiki postavili teorijo množic, so iz tega nastali pojmi **urejeni par** in **kartezični produkt** množic, ime pa so dobili po Descartesu. Z njimi opišemo vse kvadrate zemljevida, vse povezave med kraji, vse točke pravokotnika na načrtu. Ob tem spoznaš še **potenčno množico**: množico vseh možnih izbir iz dane množice, na primer vseh načrtov, katere kraje obiskati.

## Razlaga

**1. Zamikavna napačna misel: par je kar množica dveh elementov.** Avtobusna vozovnica velja za vožnjo Ljubljana–Koper. Če bi jo zapisali kot množico $\{\text{Ljubljana}, \text{Koper}\}$, bi bila enaka množici $\{\text{Koper}, \text{Ljubljana}\}$, saj pri množici vrstni red ne šteje. Vozovnica v obratno smer pa je druga vozovnica. Za take primere množica ni pravo orodje.

Popravek je **urejeni par** $(a, b)$. Element $a$ je **prva komponenta**, $b$ **druga komponenta**. Vozovnica Ljubljana–Koper je par $(\text{Ljubljana}, \text{Koper})$. Dva urejena para sta enaka le, če se ujemata v obeh komponentah:

$$(a, b) = (c, d) \iff a = c \wedge b = d$$

Zato je $(a, b) \neq (b, a)$, kadar je $a \neq b$. Na primer $(2, 5) \neq (5, 2)$, čeprav je $\{2, 5\} = \{5, 2\}$. Komponenti sta lahko tudi enaki: par $(3, 3)$ ima smisel, množica $\{3, 3\}$ pa je le $\{3\}$.

**2. Kartezični produkt.** Zemljevid ima stolpce $S = \{a, b, c, d\}$ in vrstice $V = \{1, 2, 3\}$. Vsak kvadrat je urejeni par (stolpec, vrstica), na primer $(c, 2)$. Množica vseh kvadratov je kartezični produkt $S \times V$. V splošnem je **kartezični produkt** množic $A$ in $B$ množica vseh urejenih parov, ki imajo prvo komponento iz $A$ in drugo iz $B$:

$$A \times B = \{(a, b) \mid a \in A \wedge b \in B\}$$

Beremo »$A$ krat $B$«. Za $A = \{1, 2\}$ in $B = \{x, y, z\}$ je $A \times B = \{(1, x), (1, y), (1, z), (2, x), (2, y), (2, z)\}$.

**3. Druga zamikavna misel: $A \times B = B \times A$, saj je množenje zamenljivo.** Ni res. V $S \times V$ je par $(c, 2)$, v $V \times S$ pa par $(2, c)$, ki je drugačen. Kartezični produkt v splošnem **ni zamenljiv**: $A \times B \neq B \times A$.

:::premisli
Pri katerih množicah $A$ in $B$ pa vendarle velja $A \times B = B \times A$? Napovej, preden pogledaš.
---
Če je $A = B$ (tedaj zamenjava ničesar ne spremeni) ali če je vsaj ena od množic prazna (tedaj sta oba produkta $\emptyset$). V vseh drugih primerih obstajata $a \in A$ in $b \in B$, pri katerih par $(a, b)$ ni v $B \times A$.
:::

**4. Moč kartezičnega produkta.** Moč množice smo zapisovali z $|A|$; v maturitetnem katalogu in nekaterih učbenikih piše $m(A)$, pomen je isti. Elemente produkta lahko uredimo v tabelo: vsak element iz $A$ dobi svojo vrstico, vsak element iz $B$ svoj stolpec. Vsako polje tabele je en par. Pri $|A| = 2$ in $|B| = 3$ je polj $2 \cdot 3 = 6$. Za končni množici velja

$$|A \times B| = |A| \cdot |B|$$

Zemljevid s štirimi stolpci in tremi vrsticami ima $4 \cdot 3 = 12$ kvadratov. Moči se torej **množita**, ne seštevata. Od tod tudi ime produkt.

:::premisli
Koliko elementov ima $A \times \emptyset$, če ima $A$ pet elementov? Zakaj?
---
Nič: $A \times \emptyset = \emptyset$. Za par potrebuješ drugo komponento iz prazne množice, takega elementa pa ni. Formula se ujema: $5 \cdot 0 = 0$.
:::

**5. Graf kartezičnega produkta.** Če sta $A$ in $B$ množici števil, je vsak par $(x, y) \in A \times B$ točka v koordinatnem sistemu. **Graf** produkta je množica teh točk. Za $A = \{1, 2, 3\}$ in $B = \{1, 2\}$ dobimo $3 \cdot 2 = 6$ točk v dveh vrstah:

:::risba graf
opis: Graf kartezičnega produkta množic A = {1, 2, 3} in B = {1, 2}. Šest točk: (1, 1), (2, 1), (3, 1) v spodnji vrsti in (1, 2), (2, 2), (3, 2) v zgornji vrsti.
x: 0 .. 4 | 1 | x
y: 0 .. 3 | 1 | y
enako: da
točka: 1; 1 | | | modra
točka: 2; 1 | | | modra
točka: 3; 1 | | | modra
točka: 1; 2 | | | modra
točka: 2; 2 | | | modra
točka: 3; 2 | (3, 2) | desno | modra
:::

Prve komponente beremo na osi $x$, druge na osi $y$. Pri množicah naravnih števil so točke vedno v presečiščih mreže. Graf $\mathbb{N} \times \mathbb{N}$ so vsa taka presečišča z obema koordinatama vsaj $1$; teh je neskončno mnogo.

Če sta množici **intervala**, se točke zlijejo v lik. Zapis $[1, 3]$ pomeni vsa realna števila $x$ z $1 \le x \le 3$, vključno z mejama (več o tem v lekciji o intervalih). Produkt $[1, 3] \times [0, 2]$ so vse točke $(x, y)$ z $1 \le x \le 3$ in $0 \le y \le 2$, torej pravokotnik skupaj z robom:

:::risba graf
opis: Graf kartezičnega produkta intervalov [1, 3] in [0, 2]: osenčen pravokotnik z oglišči (1, 0), (3, 0), (3, 2) in (1, 2), rob je narisan s polno črto, ker spada zraven.
x: 0 .. 4 | 1 | x
y: 0 .. 3 | 1 | y
enako: da
pravokotnik: 1; 0 .. 3; 2 | modra
točka: 1; 0 | (1, 0) | pod
točka: 3; 2 | (3, 2) | nad desno
:::

Mešan primer: $\{1, 2, 3\} \times [0, 2]$ so tri navpične daljice, pri $x = 1$, $x = 2$ in $x = 3$, vsaka od $y = 0$ do $y = 2$.

**6. Potenčna množica.** Na izletu lahko obiščeš kraje iz $A = \{\text{Piran}, \text{Bled}\}$. Možni načrti so: nobenega kraja, samo Piran, samo Bled, oba. Vsak načrt je podmnožica množice $A$. **Potenčna množica** $\mathcal{P}(A)$ je množica vseh podmnožic množice $A$:

$$\mathcal{P}(A) = \{X \mid X \subseteq A\}$$

Za $A = \{1, 2\}$ je $\mathcal{P}(A) = \{\emptyset, \{1\}, \{2\}, \{1, 2\}\}$. Elementi potenčne množice so **množice**. Zato je $\{1\} \in \mathcal{P}(A)$, število $1$ pa ni element $\mathcal{P}(A)$. Vedno sta v $\mathcal{P}(A)$ prazna množica in cela množica $A$. Podmnožice najlažje naštevaš po velikosti: najprej tista z $0$ elementi, nato z $1$, z $2$ in tako naprej.

**7. Moč potenčne množice (višja raven).** Ko sestavljaš podmnožico, se pri vsakem elementu odločiš: vzamem ali ne vzamem. Pri $n$ elementih je to $n$ zaporednih odločitev z dvema možnostma, torej

$$|\mathcal{P}(A)| = 2^n, \text{ če je } |A| = n$$

Pri $A = \{1, 2\}$ je to $2^2 = 4$, kar se ujema s seznamom zgoraj. Isti razlog si srečal pri pravilnostni tabeli: $n$ izjav da $2^n$ vrstic.

## Rešeni primeri

### Primer 1 (lažji): izbira izleta

Družina izbira kraj $K = \{\text{Piran}, \text{Bled}, \text{Ptuj}\}$ in prevoz $V = \{\text{vlak}, \text{avtobus}\}$. Zapiši vse možne izbire (kraj, prevoz). Koliko jih je? Ali je $(\text{vlak}, \text{Bled})$ ena od njih?

**Podatki:** $K = \{\text{Piran}, \text{Bled}, \text{Ptuj}\}$, $|K| = 3$; $V = \{\text{vlak}, \text{avtobus}\}$, $|V| = 2$
**Iščemo:** $K \times V$, $|K \times V|$ in ali je $(\text{vlak}, \text{Bled}) \in K \times V$

:::formula
$K \times V = \{(k, v) \mid k \in K \wedge v \in V\}$ in $|K \times V| = |K| \cdot |V|$
:::

**Rešitev:**

1. Vsak kraj združimo z vsakim prevozom, kraj je prvi: $(\text{Piran}, \text{vlak})$, $(\text{Piran}, \text{avtobus})$, $(\text{Bled}, \text{vlak})$, $(\text{Bled}, \text{avtobus})$, $(\text{Ptuj}, \text{vlak})$, $(\text{Ptuj}, \text{avtobus})$.
2. Preštejemo in preverimo s formulo: $|K \times V| = 3 \cdot 2 = 6$.
3. Par $(\text{vlak}, \text{Bled})$ ima prvo komponento iz $V$, ne iz $K$, zato ni v $K \times V$ (je v $V \times K$).
4. Odgovor: možnih izbir je $6$; par $(\text{vlak}, \text{Bled})$ ni element $K \times V$, pravilen zapis te izbire je $(\text{Bled}, \text{vlak})$.

### Primer 2: dva grafa

Dani sta $A = \{1, 2, 3\}$ in $B = \{0, 2\}$. Nariši grafa $A \times B$ in $B \times A$ v istem koordinatnem sistemu. Katere točke imata skupne?

**Podatki:** $A = \{1, 2, 3\}$, $B = \{0, 2\}$
**Iščemo:** grafa $A \times B$ in $B \times A$ ter njune skupne točke

:::formula
$(x, y) \in A \times B \iff x \in A \wedge y \in B$
:::

**Rešitev:**

1. $A \times B = \{(1, 0), (2, 0), (3, 0), (1, 2), (2, 2), (3, 2)\}$: prva koordinata iz $A$, druga iz $B$.
2. $B \times A = \{(0, 1), (0, 2), (0, 3), (2, 1), (2, 2), (2, 3)\}$: zdaj je prva iz $B$.
3. Narišemo oboje (polne pike so $A \times B$, krožci $B \times A$):

:::risba graf
opis: Graf A × B kot šest polnih pik: (1, 0), (2, 0), (3, 0), (1, 2), (2, 2), (3, 2). Graf B × A kot šest krožcev: (0, 1), (0, 2), (0, 3), (2, 1), (2, 2), (2, 3). Črtkana premica y = x. Edina točka, ki je hkrati pika in krožec, je (2, 2).
x: -1 .. 4 | 1 | x
y: -1 .. 4 | 1 | y
enako: da
črta: -1; -1 -> 4; 4 | siva črtkano
točka: 1; 0 | | | modra
točka: 2; 0 | | | modra
točka: 3; 0 | | | modra
točka: 1; 2 | | | modra
točka: 2; 2 | (2, 2) | desno | modra
točka: 3; 2 | | | modra
krog: 0; 1 | 0,2 | oranžna
krog: 0; 2 | 0,2 | oranžna
krog: 0; 3 | 0,2 | oranžna
krog: 2; 1 | 0,2 | oranžna
krog: 2; 2 | 0,2 | oranžna
krog: 2; 3 | 0,2 | oranžna
:::

4. Grafa sta zrcalna glede na premico $y = x$, ker zamenjava komponent zamenja koordinati. Skupna točka mora imeti obe koordinati hkrati v $A$ in v $B$; tak element je le $2$, zato je skupna samo točka $(2, 2)$.
5. Odgovor: grafa sta različna, zato $A \times B \neq B \times A$; skupna točka je samo $(2, 2)$.

### Primer 3 (težji): rezervat na zemljevidu

Na pohodniškem zemljevidu so koordinate v kilometrih. Gozdni rezervat je množica $R = [2, 5] \times [1, 3]$. Nariši $R$. Ali v rezervatu ležita koča $K(4, 2)$ in izvir $I(2, 4)$? Kolikšna je ploščina rezervata? Ali je $[1, 3] \times [2, 5]$ isti rezervat?

**Podatki:** $R = [2, 5] \times [1, 3]$ (v km), $K(4, 2)$, $I(2, 4)$
**Iščemo:** sliko $R$, ali sta $K$ in $I$ v $R$, ploščino rezervata, primerjavo z $[1, 3] \times [2, 5]$

:::formula
$(x, y) \in [2, 5] \times [1, 3] \iff 2 \le x \le 5 \wedge 1 \le y \le 3$; ploščina pravokotnika je širina krat višina
:::

**Rešitev:**

1. Graf je pravokotnik z oglišči $(2, 1)$, $(5, 1)$, $(5, 3)$ in $(2, 3)$, rob spada zraven:

:::risba graf
opis: Zemljevid s koordinatami v kilometrih. Osenčen pravokotnik R od x = 2 do x = 5 in od y = 1 do y = 3. Točka K(4, 2) je znotraj pravokotnika, točka I(2, 4) je nad njim.
x: 0 .. 6 | 1 | x [km]
y: 0 .. 5 | 1 | y [km]
enako: da
pravokotnik: 2; 1 .. 5; 3 | zelena
napis: 3,5; 1,5 | R | sredina | zelena debelo
točka: 4; 2 | K(4, 2) | desno | modra
točka: 2; 4 | I(2, 4) | desno | rdeča
:::

2. Koča: $2 \le 4 \le 5$ in $1 \le 2 \le 3$; obe neenakosti držita, zato $K \in R$.
3. Izvir: $2 \le 2 \le 5$ drži, a $4 > 3$, zato $I \notin R$. Ena koordinata zunaj je dovolj.
4. Stranici merita $5 - 2 = 3$ km in $3 - 1 = 2$ km, zato je ploščina $3 \cdot 2 = 6\,\text{km}^2$.
5. Množica $[1, 3] \times [2, 5]$ je pravokotnik, širok $2$ km in visok $3$ km, ki leži drugje. Ima enako ploščino, a je drug rezervat: zdaj je $[1, 3]$ na osi $x$ in $[2, 5]$ na osi $y$.
6. Odgovor: koča je v rezervatu, izvir ne; ploščina je $6\,\text{km}^2$; $[1, 3] \times [2, 5]$ ni isti rezervat.

### Primer 4 – zdaj ti: načrti potovanja

Na počitnicah lahko obiščeš kraje iz $A = \{\text{Piran}, \text{Bled}, \text{Ptuj}\}$; obiščeš lahko tudi nobenega ali vse. Vsak načrt je podmnožica $A$. Zapiši $\mathcal{P}(A)$.

**Podatki:** $A = \{\text{Piran}, \text{Bled}, \text{Ptuj}\}$, $|A| = 3$
**Iščemo:** potenčno množico $\mathcal{P}(A)$

:::formula
$\mathcal{P}(A) = \{X \mid X \subseteq A\}$; naštevaj po velikosti podmnožic
:::

**Rešitev:**

1. Brez kraja: $\emptyset$.
2. En kraj: $\{\text{Piran}\}$, $\{\text{Bled}\}$, $\{\text{Ptuj}\}$.
3. Dopiši podmnožice z dvema krajema in s tremi, nato vse preštej.

:::premisli
Katere podmnožice manjkajo in koliko elementov ima $\mathcal{P}(A)$?
---
Dva kraja: $\{\text{Piran}, \text{Bled}\}$, $\{\text{Piran}, \text{Ptuj}\}$, $\{\text{Bled}, \text{Ptuj}\}$. Trije: $\{\text{Piran}, \text{Bled}, \text{Ptuj}\}$. Skupaj $1 + 3 + 3 + 1 = 8$ načrtov.

(višja raven) Preizkus: $2^3 = 8$.
:::

## Pogoste napake

- **Vrstni red v paru »ni pomemben«.** Dijak zapiše $(\text{vlak}, \text{Bled}) \in K \times V$, ker sta oba podatka res na voljo. Par pa ni množica: prva komponenta mora biti iz prve množice. Pravilno: $(\text{Bled}, \text{vlak})$. Iz istega razloga je $A \times B \neq B \times A$, kadar $A \neq B$ in nobena ni prazna.
- **Moči se seštejejo.** Iz navade z unijo dijak izračuna $|A \times B| = |A| + |B|$. Vsak element iz $A$ pa tvori par z **vsakim** elementom iz $B$, zato je parov $|A| \cdot |B|$. Pri $3$ krajih in $2$ prevozih je izbir $6$, ne $5$.
- **Elementi potenčne množice kot števila.** Zapis $\mathcal{P}(\{1, 2\}) = \{1, 2, \{1, 2\}\}$ je napačen. Elementi $\mathcal{P}(A)$ so podmnožice: $\{1\}$ in $\{2\}$, ne $1$ in $2$. Pogosto manjka še $\emptyset$, ki je podmnožica vsake množice.
- **Pravokotnik namesto točk (ali obratno).** Za $\{1, 2, 3\} \times \{1, 2\}$ dijak nariše cel pravokotnik. Končni množici dasta le posamezne točke; lik nastane šele pri intervalih.
- (višja raven) **$|\mathcal{P}(A)| = 2n$ namesto $2^n$.** Ko množici dodaš en element, se število podmnožic ne poveča za $2$, ampak **podvoji**: vsaka stara podmnožica je še vedno tu, vsaka pa dobi še različico z novim elementom.

## Povzetek

- Urejeni par $(a, b)$: $(a, b) = (c, d) \iff a = c \wedge b = d$; pri $a \neq b$ je $(a, b) \neq (b, a)$.
- $A \times B = \{(a, b) \mid a \in A \wedge b \in B\}$; v splošnem $A \times B \neq B \times A$.
- Moč: $|A \times B| = |A| \cdot |B|$ (katalog piše $m(A \times B) = m(A) \cdot m(B)$).
- Graf: končni množici dasta posamezne točke, intervala pravokotnik, npr. $[1, 3] \times [0, 2]$.
- Potenčna množica $\mathcal{P}(A)$ je množica vseh podmnožic $A$; vedno vsebuje $\emptyset$ in $A$; njeni elementi so množice.
- (višja raven) Če ima $A$ $n$ elementov, je $|\mathcal{P}(A)| = 2^n$.

## Ponovitev

**Formule**
- $(a, b) = (c, d) \iff a = c \wedge b = d$ (na pamet)
- $A \times B = \{(a, b) \mid a \in A \wedge b \in B\}$ (na pamet)
- $|A \times B| = |A| \cdot |B|$ (na pamet)
- $\mathcal{P}(A)$: vse podmnožice $A$, tudi $\emptyset$ in $A$ (na pamet)
- Višja raven: $|A| = n \Rightarrow |\mathcal{P}(A)| = 2^n$ (na pamet)

**Postopek**
1. Pare tvori po vrsti: prva komponenta iz $A$, druga iz $B$.
2. Vsak element iz $A$ združi z vsakim iz $B$; preštej $|A| \cdot |B|$.
3. Graf: končni množici dasta točke, intervala pravokotnik.
4. Za $\mathcal{P}(A)$ naštej podmnožice po velikosti, od $\emptyset$ do $A$.

**Pazi na**
- Vrstni red v paru je pomemben: v splošnem $A \times B \ne B \times A$.
- Moči se zmnožijo, ne seštejejo: $3 \cdot 2 = 6$ parov.
- Elementi $\mathcal{P}(A)$ so množice: $\{1\}$, ne $1$; ne pozabi $\emptyset$.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Dani sta množici $A = \{-1, 0, 2\}$ in $B = \{1, 3\}$. Z naštevanjem elementov zapišite kartezični produkt $A \times B$ in narišite njegov graf.

**Rešitev:**

1. Vsak element iz $A$ združimo z vsakim elementom iz $B$, prva komponenta je iz $A$: $A \times B = \{(-1, 1), (-1, 3), (0, 1), (0, 3), (2, 1), (2, 3)\}$.
2. Preizkus: $|A \times B| = 3 \cdot 2 = 6$ parov.
3. Graf je šest točk v dveh vrstah, pri $y = 1$ in pri $y = 3$:

:::risba graf
opis: Graf kartezičnega produkta množic A = {−1, 0, 2} in B = {1, 3}. Šest točk: (−1, 1), (0, 1), (2, 1) v spodnji vrsti in (−1, 3), (0, 3), (2, 3) v zgornji vrsti.
x: -2 .. 3 | 1 | x
y: 0 .. 4 | 1 | y
enako: da
točka: -1; 1 | | | modra
točka: 0; 1 | | | modra
točka: 2; 1 | | | modra
točka: -1; 3 | (−1, 3) | levo | modra
točka: 0; 3 | | | modra
točka: 2; 3 | (2, 3) | desno | modra
:::

4. Odgovor: $A \times B = \{(-1, 1), (-1, 3), (0, 1), (0, 3), (2, 1), (2, 3)\}$; graf je šest posameznih točk.

**Točkovanje:** 1 točka za pare s prvo komponento iz $A$ in drugo iz $B$, 1 točka za vseh šest parov, 1 točka za graf s šestimi točkami (brez odvečnih točk ali daljic).

### Naloga 2: krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Dana sta intervala $A = [-1, 2]$ in $B = [1, 3]$.

a) Ugotovite, ali točki $T(0, 2)$ in $L(2, 0)$ ležita na grafu kartezičnega produkta $A \times B$. Odgovor utemeljite. (2 točki)
b) V istem koordinatnem sistemu narišite grafa $A \times B$ in $B \times A$. (2 točki)
c) Presek grafov iz b) zapišite kot kartezični produkt dveh intervalov in izračunajte njegovo ploščino. (2 točki)
d) Utemeljite, da je $A \times B \neq B \times A$. (1 točka)

**Rešitev:**

1. a) Za $T(0, 2)$ velja $0 \in [-1, 2]$ in $2 \in [1, 3]$, zato $T \in A \times B$.
2. a) Za $L(2, 0)$ velja $2 \in [-1, 2]$, toda $0 \notin [1, 3]$, zato $L \notin A \times B$.
3. b) $A \times B$ je pravokotnik z $-1 \le x \le 2$ in $1 \le y \le 3$, $B \times A$ pa pravokotnik z $1 \le x \le 3$ in $-1 \le y \le 2$. Oba vključujeta rob:

:::risba graf
opis: Dva pravokotnika v istem koordinatnem sistemu. Modri pravokotnik A × B ima oglišča (−1, 1), (2, 1), (2, 3) in (−1, 3). Oranžni pravokotnik B × A ima oglišča (1, −1), (3, −1), (3, 2) in (1, 2). Prekrivata se v kvadratu z oglišči (1, 1), (2, 1), (2, 2) in (1, 2).
x: -2 .. 4 | 1 | x
y: -2 .. 4 | 1 | y
enako: da
pravokotnik: -1; 1 .. 2; 3 | modra
pravokotnik: 1; -1 .. 3; 2 | oranžna
napis: -0,5; 2,5 | A × B | sredina | modra debelo
napis: 2,5; -0,5 | B × A | sredina | oranžna debelo
:::

4. c) Točka $(x, y)$ leži na obeh grafih, ko je $x \in A \cap B$ in $y \in B \cap A$. Ker je $A \cap B = [1, 2]$, je presek grafov $[1, 2] \times [1, 2]$.
5. c) To je kvadrat s stranico $2 - 1 = 1$, njegova ploščina je $1 \cdot 1 = 1$ kvadratna enota.
6. d) Točka $L(2, 0)$ leži na grafu $B \times A$, ker je $2 \in B$ in $0 \in A$, po a) pa ne leži na grafu $A \times B$. Množici imata torej različne elemente.
7. Odgovor: $T \in A \times B$, $L \notin A \times B$; presek grafov je $[1, 2] \times [1, 2]$ s ploščino $1$; ker je $(2, 0) \in B \times A$ in $(2, 0) \notin A \times B$, je $A \times B \neq B \times A$.

**Točkovanje:** a) 1 točka za $T \in A \times B$ z utemeljitvijo, 1 točka za $L \notin A \times B$ z utemeljitvijo; b) 1 točka za pravokotnik $A \times B$, 1 točka za pravokotnik $B \times A$; c) 1 točka za $[1, 2] \times [1, 2]$, 1 točka za ploščino $1$; d) 1 točka za točko, ki leži na enem grafu, na drugem pa ne.

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Dani sta množici $A = \{1, 2, 3\}$ in $B = \{0, 5\}$.

a) Zapišite potenčno množico $\mathcal{P}(B)$. (2 točki)
b) Koliko elementov imata množici $\mathcal{P}(A)$ in $A \times \mathcal{P}(B)$? (2 točki)
c) Za vsako od izjav $\{5\} \in \mathcal{P}(B)$, $5 \in \mathcal{P}(B)$ in $(\{0\}, 2) \in A \times \mathcal{P}(B)$ ugotovite, ali je pravilna, in odgovor utemeljite. (3 točke)
d) Množici $A$ dodamo nekaj novih elementov. Potenčna množica tako dobljene množice ima $128$ elementov. Koliko elementov smo dodali? Koliko podmnožic nove množice ne vsebuje števila $1$? (3 točke)

**Rešitev:**

1. a) Podmnožice naštejemo po velikosti: $\emptyset$; $\{0\}$, $\{5\}$; $\{0, 5\}$. Torej je $\mathcal{P}(B) = \{\emptyset, \{0\}, \{5\}, \{0, 5\}\}$.
2. b) Ker je $|A| = 3$, je $|\mathcal{P}(A)| = 2^3 = 8$.
3. b) Ker je $|\mathcal{P}(B)| = 4$, je $|A \times \mathcal{P}(B)| = |A| \cdot |\mathcal{P}(B)| = 3 \cdot 4 = 12$.
4. c) $\{5\} \subseteq B$, zato je $\{5\} \in \mathcal{P}(B)$: izjava je pravilna.
5. c) Elementi $\mathcal{P}(B)$ so podmnožice množice $B$. Število $5$ je element množice $B$, ni pa njena podmnožica, zato je izjava $5 \in \mathcal{P}(B)$ nepravilna.
6. c) Prva komponenta para v $A \times \mathcal{P}(B)$ mora biti iz $A$, a $\{0\} \notin A$. Izjava je nepravilna; pravilno bi bilo $(2, \{0\}) \in A \times \mathcal{P}(B)$.
7. d) Če ima nova množica $n$ elementov, velja $2^n = 128 = 2^7$, zato je $n = 7$. Dodali smo $7 - 3 = 4$ elemente.
8. d) Podmnožice nove množice, ki ne vsebujejo števila $1$, so natanko podmnožice množice preostalih $6$ elementov. Teh je $2^6 = 64$.
9. Odgovor: $\mathcal{P}(B) = \{\emptyset, \{0\}, \{5\}, \{0, 5\}\}$; $|\mathcal{P}(A)| = 8$, $|A \times \mathcal{P}(B)| = 12$; prva izjava je pravilna, drugi dve nepravilni; dodali smo $4$ elemente, $64$ podmnožic ne vsebuje števila $1$.

**Točkovanje:** a) 1 točka za $\emptyset$ in $\{0, 5\}$, 1 točka za $\{0\}$ in $\{5\}$, zapisani kot množici; b) 1 točka za $8$, 1 točka za $12$; c) po 1 točka za vsako pravilno odločitev z utemeljitvijo; d) 1 točka za $n = 7$, 1 točka za $4$ dodane elemente, 1 točka za $64$.

### Ustno vprašanje 1

:::premisli
Kaj je kartezični produkt dveh množic in koliko elementov ima, če sta množici končni?
---
Kartezični produkt $A \times B$ je množica vseh urejenih parov $(a, b)$, pri katerih je $a \in A$ in $b \in B$. Urejena para sta enaka le, če se ujemata v obeh komponentah, zato je vrstni red komponent pomemben. Za končni množici velja $|A \times B| = |A| \cdot |B|$, ker vsak element iz $A$ tvori par z vsakim elementom iz $B$.
:::

### Ustno vprašanje 2

:::premisli
Navedi primer množic $A$ in $B$, za kateri je $A \times B \neq B \times A$, in pojasni, kdaj sta produkta enaka.
---
Za $A = \{1\}$ in $B = \{2\}$ je $A \times B = \{(1, 2)\}$ in $B \times A = \{(2, 1)\}$. Para $(1, 2)$ in $(2, 1)$ sta različna, ker se razlikujeta v prvi komponenti. Produkta $A \times B$ in $B \times A$ sta enaka le, če je $A = B$ ali če je vsaj ena od množic prazna. Graf produkta $B \times A$ je zrcalna slika grafa $A \times B$ čez premico $y = x$.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Koliko podmnožic ima množica z $n$ elementi? Odgovor utemelji.
---
Množica z $n$ elementi ima $2^n$ podmnožic, torej je $|\mathcal{P}(A)| = 2^n$. Ko sestavljamo podmnožico, se za vsak element posebej odločimo, ali ga vzamemo ali ne. To je $n$ zaporednih odločitev z dvema možnostma, zato je vseh izbir $2 \cdot 2 \cdots 2 = 2^n$. Med njimi sta tudi prazna množica, ko ne vzamemo nobenega elementa, in cela množica, ko vzamemo vse.
:::

## Drugače: Kot zgodba

Ana načrtuje poletno potovanje. Na mizi ima zemljevid, razdeljen na kvadrate: stolpci so označeni s črkami $a$ do $f$, vrstice s številkami od $1$ do $5$. Kamp, ki ga išče, je v kvadratu $(d, 4)$. Brat Jan ga išče v $(4, d)$ in ga seveda ne najde, ker na zemljevidu stolpca »4« sploh ni. Ana mu razloži: najprej črka, potem številka, sicer govoriš o drugem paru ali o ničemer.

Jan prešteje kvadrate: $6$ stolpcev, v vsakem $5$ kvadratov, torej $6 \cdot 5 = 30$. To je moč kartezičnega produkta množice stolpcev in množice vrstic.

Zvečer se pogovarjata, katere znamenitosti bi obiskala: grad, jamo, slap. Jan našteje: samo grad, samo jamo, samo slap, grad in jamo, grad in slap, jamo in slap, vse tri. Ana doda: »Pa možnost, da ne obiščeva ničesar in ves dan plavava.« Tako sta zapisala vseh $8$ elementov potenčne množice.

(višja raven) Ko pa se spomnita še na muzej, Ana ugotovi, da načrtov ni $8 + 1$, ampak $16$: vsak stari načrt lahko izvedeta z muzejem ali brez njega.

## Drugače: Korak za korakom s številkami

Naloga: $A = \{1, 2, 3\}$, $B = \{4, 5\}$.

1. **Tabela parov.** Vrstice so elementi $A$, stolpci elementi $B$:

| | $4$ | $5$ |
|---|---|---|
| $1$ | $(1, 4)$ | $(1, 5)$ |
| $2$ | $(2, 4)$ | $(2, 5)$ |
| $3$ | $(3, 4)$ | $(3, 5)$ |

2. **Moč.** Tri vrstice po dve polji: $|A \times B| = 3 \cdot 2 = 6$.
3. **Obratni produkt.** $B \times A$ ima tudi $6$ elementov, a $(1, 4) \notin B \times A$, ker $1 \notin B$.
4. **Potenčna množica od $B$.** Po velikosti: $\emptyset$; $\{4\}$, $\{5\}$; $\{4, 5\}$. Torej $\mathcal{P}(B) = \{\emptyset, \{4\}, \{5\}, \{4, 5\}\}$.
5. **Potenčna množica od $A$.** $\emptyset$; $\{1\}$, $\{2\}$, $\{3\}$; $\{1, 2\}$, $\{1, 3\}$, $\{2, 3\}$; $\{1, 2, 3\}$, skupaj $1 + 3 + 3 + 1 = 8$.
6. (višja raven) **Preizkus z močjo.** $|\mathcal{P}(B)| = 2^2 = 4$ in $|\mathcal{P}(A)| = 2^3 = 8$.

## Preveri se

? Na sliki je sedem točk. Šest jih sestavlja graf $A \times B$ za $A = \{1, 2, 3\}$ in $B = \{1, 2\}$. Katera točka ne sodi zraven?
:::risba graf
opis: Sedem točk v koordinatnem sistemu: (1, 1), (2, 1), (3, 1), (1, 2), (2, 2), (3, 2) in (2, 3).
x: 0 .. 4 | 1 | x
y: 0 .. 4 | 1 | y
enako: da
točka: 1; 1 | | | modra
točka: 2; 1 | | | modra
točka: 3; 1 | | | modra
točka: 1; 2 | | | modra
točka: 2; 2 | | | modra
točka: 3; 2 | | | modra
točka: 2; 3 | | | modra
:::
- $(1, 1)$
~ Ta točka sodi zraven: $1 \in A$ in $1 \in B$. Enaki komponenti sta v paru dovoljeni.
- $(3, 2)$
~ Ta sodi zraven: $3 \in A$, $2 \in B$. Morda si pomislil, da $3$ »ni v obeh«, a prva komponenta mora biti le v $A$.
+ $(2, 3)$
- $(2, 1)$
~ Ta sodi zraven: $2 \in A$ in $1 \in B$.
> Druga koordinata mora biti iz $B = \{1, 2\}$, točka $(2, 3)$ pa ima drugo koordinato $3 \notin B$. Par $(2, 3)$ bi bil v $B \times A$, ne v $A \times B$.

? Velja $|A| = 5$ in $|B| = 4$. Množici $A$ dodamo en nov element, $B$ ostane enaka. Za koliko elementov se poveča $A \times B$?
= 4 | 0
~ 1 | Tako bi bilo, če bi se moči seštevale. Nov element tvori par z vsakim od $4$ elementov množice $B$.
~ 24 | To je nova moč $6 \cdot 4$, vprašanje pa sprašuje, za koliko se je povečala.
> Prej $5 \cdot 4 = 20$, potem $6 \cdot 4 = 24$; razlika je $4$, po en nov par za vsak element iz $B$.

? Nika je zapisala potenčno množico množice $\{a, b\}$. V katerem koraku je napaka?
1) podmnožica z $0$ elementi: $\emptyset$; 2) podmnožici z $1$ elementom: $\{a\}$, $\{b\}$; 3) podmnožica z $2$ elementoma: $\{a, b\}$; 4) torej $\mathcal{P}(\{a, b\}) = \{a, b, \{a, b\}\}$.
- V 1. koraku, ker $\emptyset$ ni podmnožica.
~ Prazna množica je podmnožica vsake množice, zato je 1. korak pravilen.
- V 2. koraku, ker bi morala pisati $a$ in $b$ brez zavitih oklepajev.
~ Podmnožica je množica, zato so oklepaji prav. Ravno to je Nika v 4. koraku pozabila.
- V 3. koraku, ker $\{a, b\}$ ni prava podmnožica.
~ Potenčna množica vsebuje vse podmnožice, tudi celo množico.
+ V 4. koraku.
> Pravilno je $\mathcal{P}(\{a, b\}) = \{\emptyset, \{a\}, \{b\}, \{a, b\}\}$. V 4. koraku je Nika izpustila $\emptyset$ in namesto množic $\{a\}$, $\{b\}$ zapisala elementa $a$, $b$.

? (brez računala) Kartezični produkt $A \times B$ ima $42$ elementov, množica $A$ pa $6$. Koliko elementov ima $B$?
= 7 | 0
~ 36 | Odštel si $42 - 6$, kot da bi se moči seštevale. Velja $|A| \cdot |B| = 42$.
~ 252 | Pomnožil si $42 \cdot 6$. Iz $6 \cdot |B| = 42$ moraš deliti.
> $6 \cdot |B| = 42$, zato $|B| = 42 : 6 = 7$.

? Razvrsti korake, s katerimi sistematično zapišeš $\mathcal{P}(\{p, q, r\})$.
1. Zapiši prazno množico $\emptyset$.
2. Zapiši vse podmnožice z enim elementom.
3. Zapiši vse podmnožice z dvema elementoma.
4. Zapiši celo množico $\{p, q, r\}$.
5. Preštej: $1 + 3 + 3 + 1 = 8$ podmnožic.
> Naštevanje po velikosti zagotovi, da nobene podmnožice ne izpustiš in nobene ne zapišeš dvakrat.

<<RACUN
vrednost: 3*2 | 6
vrednost: 4*3 | 12
vrednost: 2^2 | 4
vrednost: 2^3 | 8
vrednost: 1+3+3+1 | 8
vrednost: (5-2)*(3-1) | 6
vrednost: 6*5 | 30
vrednost: 6*4-5*4 | 4
vrednost: 42/6 | 7
vrednost: 5*0 | 0
vrednost: (2-1)*(2-1) | 1
vrednost: 3*4 | 12
resi: 2^n=128 | n | 7
vrednost: 7-3 | 4
vrednost: 2^6 | 64
>>

:::simboli
A, B | množici | | | $A \times B$ je njun kartezični produkt
a, b | elementa (komponenti para) | | | $a \in A$, $b \in B$
c, d | komponenti drugega para | | |
X | podmnožica množice $A$ | X \subseteq A | | element potenčne množice $\mathcal{P}(A)$
n | število elementov množice $A$ | | | moč množice $A$
K | množica krajev (Primer 1) ali koča, točka na zemljevidu (Primer 3) | | |
R | gozdni rezervat (Primer 3) | R = [2, 5] \times [1, 3] | |
I | izvir, točka na zemljevidu (Primer 3) | | |
T, L | točki v koordinatnem sistemu | | | Za maturo, Naloga 2
S | množica stolpcev zemljevida | | | v razlagi (točka 2)
V | množica prevozov (Primer 1) ali vrstic zemljevida (razlaga) | | |
k, v | kraj in prevoz | | | $k \in K$, $v \in V$
x, y | koordinati točke | | | v Primeru 3 v kilometrih
:::
