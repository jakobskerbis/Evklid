---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec na vajah trdi, da je pri ekvivalenčni relaciji refleksivnost odveč, ker sledi iz drugih dveh lastnosti. Njegov »dokaz«: »Vzemimo $a$. Če je $a \sim b$, je po simetričnosti $b \sim a$. Po tranzitivnosti iz $a \sim b$ in $b \sim a$ sledi $a \sim a$.« Zveni prepričljivo. Do konca razlage boš našel mesto, kjer se zatakne, in protiprimer.

Ekvivalenčne relacije so matematični zapis besede »enako glede na nekaj«. Ulomka $\frac{1}{2}$ in $\frac{2}{4}$ sta različna zapisa istega števila. Števili $3$ in $10$ sta enaki po ostanku pri deljenju s $7$. Dva bolnika imata isto krvno skupino. Kadar razlike, ki nas ne zanimajo, »pozabimo«, iz množice nastane nova, manjša množica: tako so zgrajena racionalna števila, ostanki $\mathbb Z_n$, ploskve v topologiji in stanja minimalnega avtomata.

## Razlaga

### Od urejenosti k ekvivalenci

Delno urejenost že poznaš: relacija na $A$ je refleksivna, **antisimetrična** in tranzitivna, na primer $\le$ ali $\subseteq$. Urejenost elemente *razvršča* od manjših k večjim. Ekvivalenca ima namesto antisimetričnosti nasprotno lastnost, simetričnost, in elemente *razvrsti v skupine*, znotraj katerih so vsi enakovredni.

**Definicija.** Relacija $\sim\ \subseteq A \times A$ je **ekvivalenčna relacija** (ekvivalenca), če je

- refleksivna: $a \sim a$ za vsak $a \in A$;
- simetrična: iz $a \sim b$ sledi $b \sim a$;
- tranzitivna: iz $a \sim b$ in $b \sim c$ sledi $a \sim c$.

Edina relacija, ki je hkrati ekvivalenca in delna urejenost, je enakost: simetričnost in antisimetričnost skupaj dopuščata $a \sim b$ le za $a = b$.

### Razredi in faktorska množica

**Definicija.** **Ekvivalenčni razred** elementa $a$ je $[a] = \{x \in A ;\ x \sim a\}$. Element $a$ je **predstavnik** razreda. Množica vseh razredov je **faktorska množica** $A/{\sim}$. Preslikava $\pi \colon A \to A/{\sim}$, $\pi(a) = [a]$, je **kanonična projekcija**; je surjektivna.

Pazi na tip: razred je *podmnožica* $A$, faktorska množica pa je množica podmnožic, ne podmnožica $A$.

**Izrek 1 (lastnosti razredov).** Za ekvivalenco $\sim$ na $A$ in $a, b \in A$ velja:

1. $a \in [a]$, zato noben razred ni prazen;
2. $a \sim b \iff [a] = [b]$;
3. razreda $[a]$ in $[b]$ sta enaka ali disjunktna.

**Dokaz.** (1) sledi iz refleksivnosti. (2) Naj bo $a \sim b$ in $x \in [a]$, torej $x \sim a$. Po tranzitivnosti $x \sim b$, zato $x \in [b]$; obratna vsebovanost sledi enako s simetričnostjo. Če pa je $[a] = [b]$, je $a \in [a] = [b]$, torej $a \sim b$. (3) Če obstaja $c \in [a] \cap [b]$, je $c \sim a$ in $c \sim b$. Po simetričnosti in tranzitivnosti $a \sim b$, po (2) pa $[a] = [b]$.

:::premisli
V dokazu točke (2) smo uporabili simetričnost. Kje točno? Kaj bi šlo narobe pri relaciji, ki je le refleksivna in tranzitivna, na primer pri $\le$?
---
Za vsebovanost $[b] \subseteq [a]$: iz $x \sim b$ in $a \sim b$ potrebujemo $b \sim a$, da dobimo $x \sim a$. Pri $\le$ je »razred« $\{x ;\ x \le a\}$, in za $a < b$ sta ta »razreda« različna, a se prekrivata. Brez simetričnosti razredi niso disjunktni.
:::

### Razbitja

**Definicija.** **Razbitje** (particija) množice $A$ je družina $\mathcal R$ podmnožic $A$, za katero velja: vsaka $R \in \mathcal R$ je neprazna, različne so paroma disjunktne, njihova unija je $A$.

Primer za $A = \{1, \dots, 6\}$ in razbitje $\{\{1, 2, 3\}, \{4\}, \{5, 6\}\}$:

```
+-------+-----+-----+
| 1 2 3 |  4  | 5 6 |
+-------+-----+-----+
```

**Izrek 2 (ekvivalence in razbitja).** Za vsako ekvivalenco $\sim$ na $A$ je $A/{\sim}$ razbitje $A$. Obratno: za vsako razbitje $\mathcal R$ je relacija $a \sim_{\mathcal R} b \iff$ »$a$ in $b$ ležita v istem kosu« ekvivalenca, in njeni razredi so ravno kosi $\mathcal R$. Prireditvi sta druga drugi inverzni, zato je med ekvivalencami na $A$ in razbitji $A$ bijekcija.

**Dokaz.** Prvi del je Izrek 1: razredi so neprazni, enaki ali disjunktni, in vsak $a$ leži v $[a]$, zato je unija $A$. Za drugi del: vsak $a$ leži v natanko enem kosu, zato je $\sim_{\mathcal R}$ refleksivna; simetričnost je očitna; če sta $a, b$ v kosu $R$ in $b, c$ v kosu $R'$, je $b \in R \cap R'$, torej $R = R'$ in $a, c$ sta v istem kosu. Razred $[a]$ je ravno kos, ki vsebuje $a$. Če začnemo z ekvivalenco, naredimo razbitje in iz njega relacijo, dobimo »ležita v istem razredu«, kar je po Izreku 1 ravno $a \sim b$.

Zdaj sošolčev »dokaz«. Napaka je v prvem stavku »če je $a \sim b$«: nihče ne zagotovi, da tak $b$ obstaja. Na $A = \{1, 2\}$ je $R = \{(1, 1)\}$ simetrična in tranzitivna, a ni refleksivna, ker $(2, 2) \notin R$. Element $2$ ni v relaciji z ničemer in bi ostal brez razreda.

### Jedro preslikave

**Definicija.** Za preslikavo $f \colon A \to B$ je **jedro** relacija $a \sim_f b \iff f(a) = f(b)$.

Jedro je vedno ekvivalenca, ker je enakost v $B$ ekvivalenca. Velja tudi obratno: vsaka ekvivalenca je jedro kanonične projekcije $\pi$, saj $\pi(a) = \pi(b) \iff [a] = [b] \iff a \sim b$.

**Izrek 3.** Za $f \colon A \to B$ je $\bar f \colon A/{\sim_f} \to f(A)$, $\bar f([a]) = f(a)$, dobro definirana bijekcija.

**Dokaz.** Dobro definirana: če $[a] = [a']$, je $f(a) = f(a')$. Injektivna: $\bar f([a]) = \bar f([b])$ pomeni $f(a) = f(b)$, torej $[a] = [b]$. Surjektivna na $f(A)$ po definiciji.

**Dobra definiranost.** Ko na $A/{\sim}$ definiramo funkcijo ali operacijo s formulo na predstavnikih, moramo pokazati, da rezultat ni odvisen od izbire predstavnika. Seštevanje v $\mathbb Z_n$, $[x] + [y] = [x + y]$, je dobro definirano: iz $n \mid x - x'$ in $n \mid y - y'$ sledi $n \mid (x + y) - (x' + y')$. Predpis $[x]_6 \mapsto [x]_4$ iz $\mathbb Z_6$ v $\mathbb Z_4$ pa ni: $[0]_6 = [6]_6$, a $[0]_4 \neq [6]_4 = [2]_4$.

:::premisli
Ali je predpis $[x]_6 \mapsto [x]_3$ iz $\mathbb Z_6$ v $\mathbb Z_3$ dobro definiran? Zakaj se obnaša drugače kot $[x]_6 \mapsto [x]_4$?
---
Je. Če $6 \mid x - x'$, potem tudi $3 \mid x - x'$, ker $3 \mid 6$. Pri $4$ to ne velja, ker $4 \nmid 6$. Splošno je $[x]_m \mapsto [x]_k$ dobro definiran natanko tedaj, ko $k \mid m$.
:::

## Rešeni primeri

### Primer 1 (lažji)

Na $A = \{1, 2, \dots, 12\}$ je $x \sim y$, če imata $x$ in $y$ enako število pozitivnih deliteljev. Utemelji, da je to ekvivalenca, in zapiši faktorsko množico.

**Podatki:** $A = \{1, \dots, 12\}$, $x \sim y \iff d(x) = d(y)$, kjer je $d(x)$ število pozitivnih deliteljev
**Iščemo:** utemeljitev in $A/{\sim}$

:::formula
jedro preslikave $f$: $x \sim_f y \iff f(x) = f(y)$ je vedno ekvivalenca
:::

**Rešitev:**

1. Relacija je jedro preslikave $d \colon A \to \mathbb N$, zato je ekvivalenca; lastnosti ni treba preverjati posebej.
2. Vrednosti: $d(1) = 1$; praštevila $2, 3, 5, 7, 11$ imajo $d = 2$; $d(4) = d(9) = 3$; $d(6) = d(8) = d(10) = 4$; $d(12) = 6$.
3. Razredi so množice z isto vrednostjo $d$: $\{1\}$, $\{2, 3, 5, 7, 11\}$, $\{4, 9\}$, $\{6, 8, 10\}$, $\{12\}$.
4. Kontrola razbitja: $1 + 5 + 2 + 3 + 1 = 12$ elementov, vsak natanko enkrat.
5. Odgovor: $A/{\sim}$ ima $5$ razredov, po Izreku 3 toliko, kolikor je različnih vrednosti $d$ na $A$.

### Primer 2: krvne skupine

Na množici bolnikov v bolnišnici sta dani relaciji. $x \approx y$: $x$ in $y$ imata isto krvno skupino po sistemih AB0 in Rh. $x \to y$: bolnik $y$ lahko prejme eritrocite darovalca $x$ (antigeni $\mathrm A$, $\mathrm B$, $\mathrm D$ na eritrocitih $x$ so podmnožica antigenov $y$). Katera relacija je ekvivalenca? Koliko razredov ima največ? Kakšna je druga relacija?

**Podatki:** sistem AB0 (skupine $\mathrm A$, $\mathrm B$, $\mathrm{AB}$, $0$), sistem Rh (pozitivno ali negativno), $x \to y \iff$ antigeni $x$ $\subseteq$ antigeni $y$
**Iščemo:** lastnosti relacij $\approx$ in $\to$, največje število razredov

:::formula
ekvivalenca: refleksivna, simetrična, tranzitivna; delna urejenost: refleksivna, antisimetrična, tranzitivna
:::

**Rešitev:**

1. $\approx$ je jedro preslikave »bolnik $\mapsto$ krvna skupina«, zato je ekvivalenca.
2. Skupin je $4 \cdot 2 = 8$, zato ima $\approx$ največ $8$ razredov (manj, če kakšne skupine med bolniki ni).
3. $\to$ je refleksivna ($S \subseteq S$) in tranzitivna (vsebovanost je tranzitivna).
4. Ni simetrična: darovalec $0$ Rh$-$ nima antigenov, zato lahko daruje bolniku $\mathrm A$ Rh$+$, obratno pa ne.
5. Ni tudi antisimetrična: dva *različna* bolnika z isto skupino sta drug z drugim v relaciji v obe smeri. Refleksivni in tranzitivni relaciji rečemo **predurejenost** (kvaziurejenost).
6. Povezava: $x \to y$ in $y \to x$ hkrati velja natanko tedaj, ko $x \approx y$. Ko bolnike »združimo« po $\approx$, postane $\to$ na $8$ skupinah prava delna urejenost, vsebovanost množic antigenov.
7. Odgovor: $\approx$ je ekvivalenca z največ $8$ razredi; $\to$ je predurejenost, ki na faktorski množici postane delna urejenost.

### Primer 3 (težji): racionalna števila kot razredi

Na $A = \mathbb Z \times (\mathbb Z \setminus \{0\})$ definiramo $(a, b) \sim (c, d) \iff ad = bc$. Dokaži, da je $\sim$ ekvivalenca, opiši razred $[(1, 2)]$ in dokaži, da je seštevanje $[(a, b)] + [(c, d)] = [(ad + bc, bd)]$ dobro definirano.

**Podatki:** $A = \mathbb Z \times (\mathbb Z \setminus \{0\})$, $(a, b) \sim (c, d) \iff ad = bc$; predpis za seštevanje
**Iščemo:** dokaz ekvivalence, razred $[(1, 2)]$, dokaz dobre definiranosti

:::formula
dobra definiranost: iz $(a, b) \sim (a', b')$ sledi $(ad + bc, bd) \sim (a'd + b'c, b'd)$ (drugi argument enako)
:::

**Rešitev:**

1. Refleksivnost: $ab = ba$. Simetričnost: iz $ad = bc$ sledi $cb = da$.
2. Tranzitivnost: naj bo $ad = bc$ in $cf = de$. Prvo enačbo pomnožimo s $f$, drugo z $b$: $adf = bcf = bde$. Torej $d(af - be) = 0$.
3. Ker je $d \neq 0$ in $\mathbb Z$ nima deliteljev niča, je $af = be$, torej $(a, b) \sim (e, f)$. Tu potrebujemo, da imenovalci niso nič.
4. Razred: $(x, y) \sim (1, 2) \iff 2x = y$, torej $[(1, 2)] = \{(k, 2k) ;\ k \in \mathbb Z \setminus \{0\}\}$: vsi zapisi ulomka $\frac{1}{2}$.
5. Dobra definiranost: naj bo $ab' = a'b$. Primerjamo $(ad + bc)\,b'd$ in $(a'd + b'c)\,bd$.
6. Levo: $ab'd^2 + bb'cd$. Desno: $a'bd^2 + bb'cd$. Ker je $ab' = a'b$, sta enaka. Spremembo predstavnika drugega argumenta obravnavamo simetrično.
7. Odgovor: $\sim$ je ekvivalenca, razredi so racionalna števila, $[(1, 2)]$ so vsi pari $(k, 2k)$, seštevanje je dobro definirano. Tako $\mathbb Q$ zgradimo iz $\mathbb Z$.

### Primer 4 – zdaj ti

Koliko je vseh ekvivalenčnih relacij na $A = \{1, 2, 3, 4\}$?

**Podatki:** $\lvert A \rvert = 4$
**Iščemo:** število ekvivalenc na $A$

:::formula
ekvivalence na $A$ $\leftrightarrow$ razbitja $A$ (Izrek 2); prešteješ razbitja po številu kosov
:::

**Rešitev:**

1. Po Izreku 2 štejemo razbitja.
2. En kos: $1$ razbitje. Štirje kosi (vsak element sam): $1$.
3. Trije kosi: en par in dva samca; par izberemo na $\binom{4}{2} = 6$ načinov.
4. Dva kosa: tip $3 + 1$ ($4$ načini) ali tip $2 + 2$ ($3$ načini).
5. Seštej sam.

:::premisli
Koliko je vseh razbitij in s tem ekvivalenc?
---
Dva kosa: $4 + 3 = 7$. Skupaj $1 + 7 + 6 + 1 = 15$. To je Bellovo število $B_4 = 15$.
:::

## Pogoste napake

- **»Refleksivnost sledi iz simetričnosti in tranzitivnosti.«** Napaka je v predpostavki, da ima vsak $a$ kakšnega »partnerja« $b$. Protiprimer: $\{(1, 1)\}$ na $\{1, 2\}$.
- **Faktorska množica kot podmnožica $A$.** Elementi $A/{\sim}$ so razredi, torej podmnožice $A$. $\mathbb Z_3$ ni $\{0, 1, 2\} \subseteq \mathbb Z$, ampak $\{[0], [1], [2]\}$.
- **Funkcija na razredih brez preverjanja predstavnikov.** Predpis $[x]_6 \mapsto [x]_4$ je videti nedolžen, a ni funkcija. Vedno pokaži, da izid ni odvisen od izbire predstavnika.
- **Unija ekvivalenc je ekvivalenca.** Presek ekvivalenc je ekvivalenca, unija pa v splošnem ni tranzitivna: na $\{1, 2, 3\}$ sta $\{1, 2\} \mid \{3\}$ in $\{1\} \mid \{2, 3\}$ ekvivalenci, v uniji sta $1 \sim 2$ in $2 \sim 3$, a $1 \not\sim 3$.
- **Simetričnost zamenjana z antisimetričnostjo.** »Antisimetrična« ne pomeni »ni simetrična«. Enakost je oboje, predurejenost iz Primera 2 ni nobeno.

## Povzetek

- Ekvivalenca je refleksivna, simetrična in tranzitivna relacija; od delne urejenosti se loči po simetričnosti namesto antisimetričnosti.
- Razred $[a] = \{x ;\ x \sim a\}$; razredi so neprazni, enaki ali disjunktni; $a \sim b \iff [a] = [b]$.
- Faktorska množica $A/{\sim}$ je množica razredov; $\pi(a) = [a]$ je surjekcija.
- Ekvivalence na $A$ so v bijekciji z razbitji $A$.
- Jedro preslikave $f(a) = f(b)$ je ekvivalenca; $A/{\sim_f}$ je v bijekciji z $f(A)$.
- Funkcija ali operacija na razredih mora biti dobro definirana (neodvisna od predstavnika).
- Število ekvivalenc na $n$-elementni množici je Bellovo število: $1, 1, 2, 5, 15, 52, 203, \dots$

## Za izpit

Znati moraš povedati:

- definicije ekvivalence, razreda, faktorske množice in razbitja;
- izrek o lastnostih razredov z dokazom;
- izrek o bijekciji med ekvivalencami in razbitji z dokazom obeh smeri;
- jedro preslikave in bijekcijo $A/{\sim_f} \to f(A)$;
- kaj pomeni dobra definiranost in kako jo dokažeš (seštevanje v $\mathbb Z_n$ in v $\mathbb Q$);
- protiprimer, ki pokaže, da refleksivnost ne sledi iz drugih dveh lastnosti.

### Naloga 1

Naj bo $A = \{1, 2, 3, 4, 5\}$. (a) Izpelji rekurzijo $B_{n+1} = \sum_{k=0}^{n} \binom{n}{k} B_k$ za Bellova števila in z njo izračunaj število vseh ekvivalenc na $A$. (b) Koliko ekvivalenc na $A$ ima natanko $2$ razreda? (c) Pri koliko ekvivalencah sta $1$ in $2$ v istem razredu, pri koliko pa ne?

**Rešitev:**

1. (a) Opazujmo razred elementa $n + 1$ v razbitju množice $\{1, \dots, n + 1\}$. Poleg $n + 1$ vsebuje še $j$ od ostalih $n$ elementov, ki jih izberemo na $\binom{n}{j}$ načinov. Preostalih $k = n - j$ elementov razbijemo poljubno, na $B_k$ načinov.
2. Ker je $\binom{n}{j} = \binom{n}{k}$, sledi $B_{n+1} = \sum_{k=0}^{n} \binom{n}{k} B_k$, z $B_0 = 1$ (prazno razbitje).
3. Iz $B_0 = 1$: $B_1 = 1$, $B_2 = 1 + 1 = 2$, $B_3 = 1 + 2 \cdot 1 + 2 = 5$, $B_4 = 1 + 3 + 3 \cdot 2 + 5 = 15$.
4. $B_5 = 1 \cdot 1 + 4 \cdot 1 + 6 \cdot 2 + 4 \cdot 5 + 1 \cdot 15 = 52$. Na $A$ je $52$ ekvivalenc.
5. (b) Razbitje na dva kosa je določeno s kosom, ki vsebuje $1$. Ta kos je $\{1\} \cup T$ za $T \subseteq \{2, 3, 4, 5\}$, pri čemer $T$ ne sme biti cela množica (drugi kos bi bil prazen). Možnosti: $2^4 - 1 = 15$.
6. (c) Če sta $1$ in $2$ v istem razredu, ju lahko »zlepimo« v en element. Ekvivalence take vrste so v bijekciji z razbitji $4$-elementne množice $\{\{1, 2\}, 3, 4, 5\}$: $B_4 = 15$.
7. Ostale: $52 - 15 = 37$.
8. Odgovor: (a) $52$; (b) $15$; (c) $15$ z $1 \sim 2$ in $37$ z $1 \not\sim 2$.

### Naloga 2

Natančno navedi in dokaži izrek o povezavi med ekvivalenčnimi relacijami na $A$ in razbitji $A$. Utemelji, zakaj sta prireditvi druga drugi inverzni.

**Rešitev:**

1. Izrek: preslikava $\sim\ \mapsto A/{\sim}$ je bijekcija iz množice ekvivalenc na $A$ v množico razbitij $A$; inverz priredi razbitju $\mathcal R$ relacijo »v istem kosu«.
2. $A/{\sim}$ je razbitje: razredi so neprazni ($a \in [a]$), pokrijejo $A$ in so po Izreku 1 enaki ali disjunktni.
3. Za razbitje $\mathcal R$ je $\sim_{\mathcal R}$ ekvivalenca: refleksivna, ker vsak element leži v nekem kosu; simetrična po definiciji; tranzitivna, ker kosa, ki imata skupen element, sovpadata.
4. Razredi $\sim_{\mathcal R}$ so kosi: razred $[a]$ je ravno kos, ki vsebuje $a$. Torej $A/{\sim_{\mathcal R}} = \mathcal R$.
5. Obratno: relacija »v istem razredu $\sim$« je po Izreku 1, točka (2), enaka $\sim$.
6. Kompozitum v obeh vrstnih redih je identiteta, zato sta prireditvi bijekciji in druga drugi inverzni.

## Drugače: Na sliki

Nariši relacijo kot usmerjen graf: puščica od $a$ do $b$, kadar $a \sim b$.

- Refleksivnost: pri vsakem vozlišču je zanka.
- Simetričnost: puščice so vedno v parih, zato jih lahko narišeš kot neusmerjene povezave.
- Tranzitivnost: kjer sta $a$ in $b$ povezana po kakšni poti, sta povezana tudi neposredno.

Graf ekvivalence je zato disjunktna unija **polnih grafov**, vsak s svojimi zankami: en poln graf za vsak razred. Če v matriki relacije vrstice in stolpce uredimo po razredih, dobimo **bločno diagonalno** matriko iz samih enic v kvadratnih blokih.

Delna urejenost je na sliki čisto drugačna: Hassejev diagram brez ciklov, v katerem puščice kažejo »navzgor«.

## Drugače: Uporaba v stroki

- **Podvojeni zapisi.** V bolnišničnem informacijskem sistemu ima isti bolnik lahko več zapisov. Algoritem najde pare zapisov, ki so zagotovo isti bolnik. Iskane skupine so razredi *najmanjše* ekvivalence, ki vsebuje te pare. Računamo jih s strukturo **disjunktnih množic** (union–find):

```python
def najdi(stars, x):
    while stars[x] != x:
        stars[x] = stars[stars[x]]  # skrajšanje poti
        x = stars[x]
    return x

def zdruzi(stars, a, b):
    stars[najdi(stars, a)] = najdi(stars, b)

zapisi = ["A1", "A2", "B1", "C1", "C2", "C3"]
isti = [("A1", "A2"), ("C1", "C2"), ("C2", "C3")]
stars = {z: z for z in zapisi}
for a, b in isti:
    zdruzi(stars, a, b)
razredi = {}
for z in zapisi:
    razredi.setdefault(najdi(stars, z), []).append(z)
print(list(razredi.values()))
```

  Program izpiše `[['A1', 'A2'], ['B1'], ['C1', 'C2', 'C3']]`. Par $(\mathrm{C1}, \mathrm{C3})$ ni bil podan, a ga tranzitivnost doda.
- **Kruskalov algoritem** za najmanjše vpeto drevo uporablja isto strukturo: povezavo doda le, če krajišči še nista v istem razredu.
- **Aritmetika po modulu.** Kriptografija (RSA, eliptične krivulje) in zgoščevalne tabele računajo v $\mathbb Z_n$, torej z razredi.
- **Minimizacija avtomatov.** Stanji sta ekvivalentni, če iz njiju vse besede vodijo do enakega odgovora. Minimalni avtomat ima za stanja razrede te ekvivalence.

## Drugače: Bolj natančno

**Ekvivalenčna ovojnica.** Presek poljubne družine ekvivalenc na $A$ je ekvivalenca. Zato za vsako relacijo $R \subseteq A \times A$ obstaja najmanjša ekvivalenca, ki jo vsebuje: presek vseh ekvivalenc, ki vsebujejo $R$. Konstruktivno: vzamemo $R$, dodamo diagonalo in obrnjene pare, nato tranzitivno ovojnico. Velja $a \sim b$ natanko tedaj, ko $a = b$ ali obstaja zaporedje $a = x_0, x_1, \dots, x_k = b$, v katerem je vsak sosednji par v $R$ ali v $R^{-1}$. To je točno to, kar izračuna union–find.

**Mreža ekvivalenc.** Ekvivalence na $A$, urejene z vsebovanostjo (pravimo, da je finejša ekvivalenca manjša), tvorijo mrežo. Spodnja meja dveh ekvivalenc je njun presek, zgornja meja pa ekvivalenčna ovojnica unije, ne unija sama. Najmanjši element je enakost (vsak element sam v razredu), največji je $A \times A$ (en sam razred).

## Preveri se

? Naj bo $\sim$ ekvivalenca na $A$. Kaj velja?
+ Dva razreda sta bodisi enaka bodisi disjunktna.
- Razred je lahko prazen, če element ni v relaciji z nobenim drugim.
~ Vsak element je v relaciji s sabo (refleksivnost), zato $a \in [a]$ in noben razred ni prazen.
- Faktorska množica $A/{\sim}$ je podmnožica $A$.
~ Elementi $A/{\sim}$ so razredi, torej podmnožice $A$, ne elementi $A$.
- Unija dveh ekvivalenc na $A$ je vedno ekvivalenca.
~ Unija je refleksivna in simetrična, tranzitivnost pa se lahko izgubi.
> To je Izrek 1: skupen element bi po simetričnosti in tranzitivnosti dal $a \sim b$ in s tem $[a] = [b]$.

? Koliko ekvivalenčnih relacij je na množici $\{1, 2, 3\}$?
- $3$
~ Prešteta so le razbitja z enim parom; manjkata še razbitji z enim kosom in s tremi kosi.
+ $5$
- $8$
~ To je število podmnožic. Ekvivalence ustrezajo razbitjem, ne podmnožicam.
- $6$
~ To je število permutacij $3!$, ki z razbitji niso povezane.
> Razbitja: $\{123\}$, $\{12, 3\}$, $\{13, 2\}$, $\{23, 1\}$, $\{1, 2, 3\}$; Bellovo število $B_3 = 5$.

? Študentka piše: »Preslikava $f \colon \mathbb Z_6 \to \mathbb Z_4$, $f([x]_6) = [x]_4$, je dobro definirana, ker ima vsako celo število $x$ natanko en ostanek pri deljenju s $4$.« Kje je napaka?
- Nikjer, utemeljitev je pravilna.
~ Utemeljitev pokaže le, da je $[x]_4$ določen za vsak $x$, ne pa, da je enak za vse predstavnike istega razreda $[x]_6$.
+ Preveriti bi morala, da isti razred $[x]_6$ z različnima predstavnikoma da isti $[x]_4$; to ne drži, ker $[0]_6 = [6]_6$, a $[0]_4 \neq [2]_4$.
- Napaka je, da $\mathbb Z_4$ ni faktorska množica.
~ $\mathbb Z_4 = \mathbb Z/{\sim}$ za $x \sim y \iff 4 \mid x - y$, torej je faktorska množica.
- Napaka je le v zapisu: pisati bi morala $f(x)$ namesto $f([x]_6)$.
~ Zapis je pravilen; problem je vsebinski, ker izid ni neodvisen od predstavnika.
> Dobra definiranost pomeni neodvisnost od predstavnika. Ker $4 \nmid 6$, predpis ni funkcija.

? Katera relacija na množici $A$ z vsaj dvema elementoma je hkrati ekvivalenca in delna urejenost?
- relacija $\le$ na $\mathbb R$
~ $\le$ ni simetrična: $1 \le 2$, a $2 \not\le 1$.
- vsebovanost $\subseteq$
~ $\subseteq$ ni simetrična, zato ni ekvivalenca.
+ samo enakost (diagonala $\{(a, a) ;\ a \in A\}$)
- nobena
~ Enakost ima vse štiri lastnosti, zato taka relacija obstaja.
> Simetričnost in antisimetričnost skupaj dovolita $a \sim b$ le za $a = b$, refleksivnost pa zahteva vse pare $(a, a)$.

? Lekarnar razvrsti zdravila po učinkovini (ista kemična snov, na primer originalno zdravilo in njegove generične različice). Kaj je ekvivalenčni razred danega zdravila?
- samo to zdravilo, ker ima vsako svoje ime
~ Ime ni merilo razvrščanja; zdravila z različnimi imeni in isto učinkovino so v istem razredu.
+ množica vseh zdravil z isto učinkovino
- to ni ekvivalenca, ker se zdravila razlikujejo v pomožnih snoveh
~ Pomožne snovi niso del merila; relacija je jedro preslikave »zdravilo $\mapsto$ učinkovina«.
- vsa zdravila v lekarni
~ To bi bil razred le, če bi imela vsa zdravila isto učinkovino.
> Relacija je jedro preslikave v učinkovino, razredi so skupine zamenljivih zdravil.

:::simboli
A | osnovna množica | | |
a, b, c, x, y | elementi množice $A$ | | |
\pi | kanonična projekcija | \pi(a) = [a] | | surjektivna
f | preslikava | | | jedro: $f(a) = f(b)$
\bar f | inducirana preslikava | | | bijekcija na $f(A)$
n, k | naravni števili | | |
R | relacija ali kos razbitja | | |
d | število pozitivnih deliteljev | | | $d(12) = 6$
:::
