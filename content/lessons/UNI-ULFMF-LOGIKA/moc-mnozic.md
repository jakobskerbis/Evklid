---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V predavalnici sedi skupina študentov. Ali je stolov toliko kot študentov? Ni ti treba šteti. Prosi vse, naj sedejo. Če vsak sedi na svojem stolu in noben stol ni prazen, jih je enako.

Pri končnih množicah to deluje kot štetje. Pri neskončnih pa štetje odpove, sedenje na stolih pa ne. Tako lahko primerjamo $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$ in $\mathbb{R}$. Odgovor preseneti: naravnih števil je toliko kot ulomkov, realnih pa je bistveno več. Neskončnosti so torej različno velike.

To ni le zanimivost. Ločevanje števnih in neštevnih množic potrebuješ v analizi (zaporedja, vrste), verjetnosti (diskretne in zvezne porazdelitve) in računalništvu (vseh programov je števno mnogo, funkcij $\mathbb{N} \to \{0, 1\}$ pa neštevno, zato obstajajo neizračunljive funkcije).

## Razlaga

**1. Enako močni množici.** »Vsak študent na svojem stolu, noben stol prazen« je natanko **bijekcija** iz relacij in funkcij: funkcija, ki je injektivna (različna elementa preslika v različna) in surjektivna (zadene vsak element kodomene). Množici $A$ in $B$ sta **enako močni**, $A \sim B$ ali $|A| = |B|$, če obstaja kakšna bijekcija $f\colon A \to B$.

Pozor na besedo *kakšna*. Za $A \sim B$ zadošča ena sama bijekcija. Da nista enako močni, pa moraš pokazati, da **nobena** funkcija ni bijekcija.

**2. Končne množice.** Množica $A$ ima $n$ elementov, $|A| = n$, če je $A \sim \{1, 2, \dots, n\}$. Štetje »ena, dve, tri« je ravno taka bijekcija. Tu velja, kar poznaš: prava podmnožica ima manj elementov.

**3. Prvo presenečenje.** Naj bo $\mathbb{N} = \{1, 2, 3, \dots\}$ in $S = \{2, 4, 6, \dots\}$ množica sodih števil. Funkcija $f(n) = 2n$ je bijekcija $\mathbb{N} \to S$: iz $2n = 2m$ sledi $n = m$, in vsako sodo število $2k$ je $f(k)$. Torej $S \sim \mathbb{N}$, čeprav je $S$ prava podmnožica $\mathbb{N}$. Pri neskončnih množicah »del je manjši od celote« ne velja več.

:::premisli
Ali je $\mathbb{Z}$ enako močna z $\mathbb{N}$? Napovej, preden bereš naprej. Namig: števila bi moral postaviti v vrsto, v kateri pride vsako na vrsto.
---
Da. Vrsta $0, 1, -1, 2, -2, 3, -3, \dots$ zajame vsako celo število natanko enkrat. Vrsta $0, 1, 2, 3, \dots$, nato negativna, pa ne bi delovala: do negativnih ne bi nikoli prišli.
:::

**4. Števne množice.** Množica $A$ je **števno neskončna**, če je $A \sim \mathbb{N}$. Moč $\mathbb{N}$ označimo z $\aleph_0$ (alef nič). Množica je **števna**, če je končna ali števno neskončna. Enakovredno (za neprazno $A$): njene elemente lahko zapišemo v zaporedje $a_1, a_2, a_3, \dots$, v katerem se vsak pojavi; ponovitve so dovoljene. Če je $A$ neskončna, ponovitve izpustimo in bijekcija je kar $n \mapsto a_n$.

Za $\mathbb{Z}$ je zaporedje iz premisleka zapisano s formulo:

$$f(n) = \begin{cases} \dfrac{n}{2}, & n \text{ sod},\\[2mm] -\dfrac{n-1}{2}, & n \text{ lih}. \end{cases}$$

| $n$ lih | $f(n)$ | $n$ sod | $f(n)$ |
|---|---|---|---|
| $1$ | $0$ | $2$ | $1$ |
| $3$ | $-1$ | $4$ | $2$ |
| $5$ | $-2$ | $6$ | $3$ |
| $7$ | $-3$ | $8$ | $4$ |

**5. Pari in ulomki.** Tudi $\mathbb{N} \times \mathbb{N}$ je števna. Pare razporedi v neskončno tabelo: vrstica $m$, stolpec $n$. Nato hodi po diagonalah, kjer je $m + n$ stalen:

$$(1,1);\ (1,2), (2,1);\ (1,3), (2,2), (3,1);\ \dots$$

Na diagonali $m + n = s$ je $s - 1$ parov, zato vsak par pride na vrsto po končno mnogo korakih. Ulomek $\frac{m}{n}$ je določen s parom $(m, n)$, zato je pozitivnih racionalnih števil kvečjemu števno mnogo. Ponovitve, kot $\frac{1}{2} = \frac{2}{4}$, preprosto preskočimo. Z enakim trikom kot pri $\mathbb{Z}$ dodamo $0$ in negativne. Torej je $\mathbb{Q}$ števna, čeprav med vsakima dvema ulomkoma leži neskončno drugih.

Ključ: zaporedju ni treba slediti velikosti. Ulomke smemo našteti v »čudnem« vrstnem redu.

**6. Uporabna pravila.**

- Vsaka podmnožica števne množice je števna.
- Če sta $A$ in $B$ števni, sta števni tudi $A \cup B$ in $A \times B$. Tudi unija števno mnogo števnih množic je števna.
- Če je $A \subseteq B$ in $A$ neštevna, je neštevna tudi $B$.

**7. Neštevne množice.** Množica je **neštevna**, če ni števna. Cantor je dokazal, da je interval $(0, 1)$ neštevna množica. Dokaz je s protislovjem.

Recimo, da so vsa števila iz $(0, 1)$ v zaporedju $a_1, a_2, a_3, \dots$, zapisana z decimalkami. Sestavimo število $x = 0{,}x_1 x_2 x_3 \ldots$ po pravilu: $x_k = 4$, če je $k$-ta decimalka števila $a_k$ enaka $5$, sicer $x_k = 5$.

| $k$ | $a_k$ | $k$-ta decimalka $a_k$ | $x_k$ |
|---|---|---|---|
| $1$ | $0{,}\mathbf{3}141\ldots$ | $3$ | $5$ |
| $2$ | $0{,}2\mathbf{5}00\ldots$ | $5$ | $4$ |
| $3$ | $0{,}71\mathbf{4}2\ldots$ | $4$ | $5$ |
| $4$ | $0{,}123\mathbf{4}\ldots$ | $4$ | $5$ |

Dobimo $x = 0{,}5455\ldots$. Število $x$ se od $a_k$ razlikuje v $k$-ti decimalki, torej $x \neq a_k$ za vsak $k$. A $x \in (0, 1)$, zato ga seznam ne vsebuje. Protislovje: nobeno zaporedje ne zajame vseh števil iz $(0, 1)$. Števki $4$ in $5$ izberemo zato, da se izognemo dvojnim zapisom, kot je $0{,}0999\ldots = 0{,}1$.

Ker je $(0, 1) \subseteq \mathbb{R}$, je neštevna tudi $\mathbb{R}$. Moč $\mathbb{R}$ imenujemo **kontinuum** in jo označimo s $\mathfrak{c}$.

:::premisli
Zakaj istega diagonalnega argumenta ne moremo uporabiti za racionalna števila iz $(0, 1)$ in tako »dokazati«, da je $\mathbb{Q}$ neštevna?
---
Nič ne zagotavlja, da je sestavljeni $x$ periodičen, torej racionalen. Če seznam vsebuje vse ulomke iz $(0, 1)$, je $x$ pač iracionalen: seznamu ne manjka noben ulomek, le iracionalno število. Protislovja ni.
:::

**8. Primerjava moči.** Pišemo $|A| \le |B|$, če obstaja injekcija $A \to B$. Izrek Cantor–Schröder–Bernstein pravi: iz $|A| \le |B|$ in $|B| \le |A|$ sledi $|A| = |B|$. Bijekcije torej ni treba vedno sestaviti; zadostujeta dve injekciji.

## Rešeni primeri

### Primer 1 (lažji): večkratniki števila 3

Pokaži, da je množica $T = \{3, 6, 9, \dots\}$ števno neskončna. Katero naravno število se preslika v $51$?

**Podatki:** $T = \{3k ;\ k \in \mathbb{N}\}$, $\mathbb{N} = \{1, 2, 3, \dots\}$, ciljni element $51$
**Iščemo:** bijekcijo $f\colon \mathbb{N} \to T$ in $n$, za katerega je $f(n) = 51$

:::formula
$A$ je števno neskončna $\iff$ obstaja bijekcija $\mathbb{N} \to A$. Predlog: $f(n) = 3n$.
:::

**Rešitev:**

1. Injektivnost: iz $f(n) = f(m)$ sledi $3n = 3m$, torej $n = m$.
2. Surjektivnost: vsak element $T$ je oblike $3k$ s $k \in \mathbb{N}$ in $f(k) = 3k$.
3. Torej je $f$ bijekcija in $T \sim \mathbb{N}$.
4. Iz $3n = 51$ dobimo $n = 17$; preverimo: $3 \cdot 17 = 51$.
5. Odgovor: $T$ je števno neskončna, v $51$ se preslika $17$.

### Primer 2: dva intervala

Pokaži, da sta intervala $(0, 1)$ in $(2, 5)$ enako močna. Kam se preslika $0{,}2$ in katero število se preslika v $4{,}1$? Ali je $(2, 5)$ števna?

**Podatki:** intervala $(0, 1)$ in $(2, 5)$; točki $x = 0{,}2$ in $y = 4{,}1$; $(0, 1)$ je neštevna
**Iščemo:** bijekcijo $f\colon (0, 1) \to (2, 5)$, $f(0{,}2)$, $f^{-1}(4{,}1)$ in ali je $(2, 5)$ števna

:::formula
Linearna funkcija, ki krajišče $0$ pošlje v $2$ in $1$ v $5$: $f(x) = 3x + 2$, inverz $f^{-1}(y) = \dfrac{y - 2}{3}$.
:::

**Rešitev:**

1. Če je $0 < x < 1$, je $2 < 3x + 2 < 5$, torej $f$ res slika v $(2, 5)$.
2. Injektivnost: iz $3x + 2 = 3x' + 2$ sledi $x = x'$.
3. Surjektivnost: za $y \in (2, 5)$ je $x = \frac{y - 2}{3} \in (0, 1)$ in $f(x) = y$.
4. $f(0{,}2) = 3 \cdot 0{,}2 + 2 = 2{,}6$.
5. $f^{-1}(4{,}1) = \dfrac{4{,}1 - 2}{3} = 0{,}7$.
6. Ker je $(2, 5) \sim (0, 1)$ in je $(0, 1)$ neštevna, je neštevna tudi $(2, 5)$. Če bi bila $(2, 5)$ števna, bi kompozitum njenega naštetja z $f^{-1}$ naštel tudi $(0, 1)$.
7. Odgovor: intervala sta enako močna z bijekcijo $f(x) = 3x + 2$; $f(0{,}2) = 2{,}6$, v $4{,}1$ se preslika $0{,}7$; $(2, 5)$ je neštevna.

### Primer 3 (težji): diagonalno štetje parov

Pare iz $\mathbb{N} \times \mathbb{N}$ naštevamo po diagonalah $m + n = 2, 3, 4, \dots$, na vsaki diagonali po naraščajočem $m$. Na katerem mestu je par $(3, 4)$? Kateri par je na mestu $20$?

**Podatki:** vrstni red $(1,1);\ (1,2), (2,1);\ (1,3), (2,2), (3,1);\ \dots$; par $(3, 4)$; mesto $20$
**Iščemo:** mesto para $(3, 4)$ in par na mestu $20$

:::formula
Diagonala $s = m + n$ ima $s - 1$ parov. Pred njo je $1 + 2 + \dots + (s - 2) = \dfrac{(s-2)(s-1)}{2}$ parov, zato je mesto para
$$\pi(m, n) = \frac{(m+n-2)(m+n-1)}{2} + m.$$
:::

**Rešitev:**

1. Za $(3, 4)$ je $s = 7$. Pred diagonalo je $\frac{5 \cdot 6}{2} = 15$ parov.
2. Na diagonali je par tretji, ker je $m = 3$. Mesto: $15 + 3 = 18$.
3. Obratno vprašanje: koliko parov je pred diagonalo $s$? Za $s = 7$ je to $15$, za $s = 8$ pa $\frac{6 \cdot 7}{2} = 21$.
4. Ker je $15 < 20 \le 21$, je mesto $20$ na diagonali $s = 7$.
5. Na njej je par na mestu $20 - 15 = 5$, torej $m = 5$ in $n = 7 - 5 = 2$.
6. Preverimo s formulo: $\pi(5, 2) = 15 + 5 = 20$.
7. Odgovor: par $(3, 4)$ je na $18$. mestu, na $20$. mestu je par $(5, 2)$. Ker vsak par dobi natanko eno končno mesto in je vsako mesto zasedeno, je $\pi$ bijekcija in $\mathbb{N} \times \mathbb{N} \sim \mathbb{N}$.

### Primer 4: zdaj ti

Dokaži, da je množica iracionalnih števil $\mathbb{I} = \mathbb{R} \setminus \mathbb{Q}$ neštevna.

**Podatki:** $\mathbb{Q}$ je števna, $\mathbb{R}$ je neštevna, $\mathbb{R} = \mathbb{Q} \cup \mathbb{I}$
**Iščemo:** dokaz, da $\mathbb{I}$ ni števna

:::formula
Unija dveh števnih množic je števna. Dokaz s protislovjem: predpostavi nasprotno.
:::

**Rešitev:**

1. Predpostavimo nasprotno: $\mathbb{I}$ je števna.
2. Vemo, da je $\mathbb{Q}$ števna in da je $\mathbb{R} = \mathbb{Q} \cup \mathbb{I}$.
3. Dokončaj sam: kaj sledi za $\mathbb{R}$ in zakaj je to protislovje?

:::premisli
Kako se dokaz konča?
---
Kot unija dveh števnih množic bi bila $\mathbb{R}$ števna. To nasprotuje Cantorjevemu izreku, da je $\mathbb{R}$ neštevna. Torej je $\mathbb{I}$ neštevna: iracionalnih števil je »več« kot racionalnih.
:::

## Pogoste napake

- **»Neskončno je neskončno.«** Napačno sklepanje: vse neskončne množice so enako velike. Diagonalni argument pokaže, da $\mathbb{R}$ ni enako močna z $\mathbb{N}$. Popravek: pri neskončnih množicah vedno vprašaj, ali obstaja bijekcija z $\mathbb{N}$.
- **»Prava podmnožica ima manj elementov.«** Kdor tako sklepa, misli, da je sodih števil pol manj kot naravnih. To velja le za končne množice. Popravek: primerjaj z bijekcijo, ne z vsebovanostjo; $f(n) = 2n$ je bijekcija $\mathbb{N} \to S$.
- **»Ta funkcija ni bijekcija, torej množici nista enako močni.«** Funkcija $g(n) = n$ iz $\mathbb{N}$ v $\mathbb{Z}$ ni surjektivna, a $\mathbb{Z} \sim \mathbb{N}$. En neuspel poskus ne dokaže ničesar. Popravek: za $|A| \ne |B|$ moraš izključiti **vse** funkcije, kot pri diagonalnem argumentu.
- **»$\mathbb{Q}$ je gosta, zato ni števna.«** Med vsakima dvema ulomkoma je neskončno ulomkov in ni »naslednjega«. A zaporedju ni treba slediti velikosti. Popravek: naštej pare $(m, n)$ po diagonalah.
- **»Novo število $x$ dodam na seznam in je spet popoln.«** Diagonalni argument deluje za **vsak** seznam, tudi za popravljenega. Popravek: dokaz pokaže, da nobeno zaporedje ne zajame vseh števil, ne le eno konkretno.

## Povzetek

- $A \sim B$ (enako močni), če obstaja bijekcija $A \to B$. Za $A \not\sim B$ moraš izključiti vse funkcije.
- Števno neskončna: $A \sim \mathbb{N}$, moč $\aleph_0$; števna = končna ali števno neskončna = elemente lahko naštejemo v zaporedje.
- Števne so: množica sodih števil, $\mathbb{Z}$ ($0, 1, -1, 2, -2, \dots$), $\mathbb{N} \times \mathbb{N}$ (diagonale), $\mathbb{Q}$. Podmnožica, končna unija in produkt števnih množic so števni.
- Neštevne so: $(0, 1)$ (Cantorjev diagonalni argument), $\mathbb{R}$, vsak interval $(a, b)$, iracionalna števila; moč $\mathbb{R}$ je kontinuum $\mathfrak{c}$.
- Neskončna množica je lahko enako močna s svojo pravo podmnožico.
- $|A| \le |B|$ pomeni injekcijo $A \to B$; iz $|A| \le |B|$ in $|B| \le |A|$ sledi $|A| = |B|$.

## Drugače: Iz vsakdanjega življenja (Hilbertov hotel)

Hotel ima sobe $1, 2, 3, \dots$ in vse so zasedene. Pride nov gost. Receptor vsakega gosta preseli iz sobe $n$ v sobo $n + 1$. Soba $1$ je prosta, nihče ni ostal brez sobe. Torej $\mathbb{N} \sim \mathbb{N} \cup \{0\}$.

Pride avtobus z neskončno gosti $b_1, b_2, \dots$. Gost iz sobe $n$ se preseli v sobo $2n$, gost $b_k$ dobi sobo $2k - 1$. Spet so vsi nastanjeni. To je unija dveh števnih množic.

Pride pa avtobus, v katerem ima vsak potnik za ime neskončno zaporedje ničel in enic. Takih potnikov ne moreš nastaniti, tudi v prazen hotel ne. Če bi jih razporedil po sobah, bi diagonalni potnik (na $k$-tem mestu ravno obratno od gosta v sobi $k$) ostal na cesti. To je neštevna množica.

## Drugače: Korak za korakom s številkami

Kako pokažeš, da je množica $A$ števna:

1. Poskusi elemente postaviti v vrsto $a_1, a_2, a_3, \dots$, v kateri se vsak pojavi.
2. Če je $A$ »dvostranska« (kot $\mathbb{Z}$), izmenjuj strani: $0, 1, -1, 2, -2, \dots$
3. Če so elementi določeni z dvema naravnima številoma (pari, ulomki), hodi po diagonalah $m + n = 2, 3, 4, \dots$
4. Preveri na številkah: v vrsti za $\mathbb{Z}$ je $f(7) = -\frac{7 - 1}{2} = -3$, pri parih je $\pi(2, 3) = \frac{3 \cdot 4}{2} + 2 = 8$. Formulo vedno preveri na majhnem primeru, npr. $\pi(1, 1) = 1$.
5. Ali pa uporabi pravila: podmnožica, unija ali produkt števnih množic je števna.

Kako pokažeš, da je $A$ neštevna:

1. Najdi neštevno podmnožico (npr. interval) ali bijekcijo z $(0, 1)$.
2. Ali neposredno: vzemi poljuben seznam in sestavi element, ki ga ni na seznamu (diagonalni argument).

## Drugače: Bolj natančno

**Cantorjev izrek.** Za vsako množico $A$ velja $|A| < |\mathcal{P}(A)|$. Injekcija $a \mapsto \{a\}$ da $|A| \le |\mathcal{P}(A)|$. Recimo, da je $f\colon A \to \mathcal{P}(A)$ surjektivna. Naj bo $D = \{a \in A ;\ a \notin f(a)\}$. Ker je $f$ surjektivna, je $D = f(d)$ za neki $d$. Če je $d \in D$, potem po definiciji $D$ velja $d \notin f(d) = D$. Če je $d \notin D$, potem $d \in f(d) = D$. Oboje je protislovje, torej surjekcije ni.

Posledica: $\aleph_0 = |\mathbb{N}| < |\mathcal{P}(\mathbb{N})| < |\mathcal{P}(\mathcal{P}(\mathbb{N}))| < \dots$ Neskončnosti ni konca. Velja $|\mathcal{P}(\mathbb{N})| = \mathfrak{c}$: podmnožico $B \subseteq \mathbb{N}$ zapišemo kot zaporedje ničel in enic (na $n$-tem mestu $1$, če $n \in B$).

**Dedekindova neskončnost.** Množica je neskončna natanko tedaj, ko je enako močna s kakšno svojo pravo podmnožico (ob predpostavki izbirnega aksioma). Primer: $\mathbb{N} \sim \mathbb{N} \setminus \{1\}$ prek $n \mapsto n + 1$.

**Cantor–Schröder–Bernstein.** Iz injekcij $A \to B$ in $B \to A$ sledi bijekcija $A \to B$. Primer: $[0, 1) \sim (0, 1)$, ker $x \mapsto \frac{x + 1}{2}$ injektivno slika $[0, 1)$ v $(0, 1)$, identiteta pa $(0, 1)$ v $[0, 1)$.

**Hipoteza kontinuuma.** Ali obstaja množica $A$ z $\aleph_0 < |A| < \mathfrak{c}$? Gödel in Cohen sta pokazala, da tega v običajni teoriji množic (ZFC) ni mogoče ne dokazati ne ovreči.

## Preveri se

? Kdaj je množica $A$ števno neskončna?
- Kadar ima neskončno elementov.
~ Tudi $\mathbb{R}$ ima neskončno elementov, pa ni števna. Neskončnost še ne pomeni števnosti.
+ Kadar obstaja bijekcija $\mathbb{N} \to A$.
- Kadar obstaja injekcija $A \to \mathbb{R}$.
~ Injekcijo v $\mathbb{R}$ ima tudi $\mathbb{R}$ sama (identiteta). Primerjati moraš z $\mathbb{N}$.
> Števno neskončna pomeni enako močna z $\mathbb{N}$, torej $A \sim \mathbb{N}$. Elemente lahko naštejemo v zaporedje $a_1, a_2, \dots$

? Kaj velja za množico sodih naravnih števil $S$ in $\mathbb{N}$?
- $|S| < |\mathbb{N}|$, ker je $S$ prava podmnožica $\mathbb{N}$.
~ »Del je manjši od celote« velja le za končne množice. Pri neskončnih primerjamo z bijekcijo.
- $|S| = \frac{1}{2} |\mathbb{N}|$, ker je vsako drugo število sodo.
~ Polovica neskončne moči ni definirana. Gostota sodih števil ne pove ničesar o moči.
+ $|S| = |\mathbb{N}|$, ker je $f(n) = 2n$ bijekcija.
> $f(n) = 2n$ je injektivna in zadene vsako sodo število, zato $S \sim \mathbb{N}$.

? Zakaj je $\mathbb{Q}$ števna, čeprav med vsakima dvema ulomkoma leži neskončno drugih?
- Ni števna, ker za ulomek ne obstaja naslednji ulomek.
~ Zaporedju ni treba slediti velikosti. Ulomke lahko naštejemo v drugem vrstnem redu.
+ Ker jih lahko naštejemo po diagonalah tabele parov $(m, n)$, ne po velikosti.
- Ker je $\mathbb{Q}$ podmnožica $\mathbb{R}$.
~ Podmnožica neštevne množice je lahko neštevna (npr. interval). Iz $\mathbb{Q} \subseteq \mathbb{R}$ števnost ne sledi.
> Ulomek $\frac{m}{n}$ ustreza paru $(m, n)$, pari $\mathbb{N} \times \mathbb{N}$ pa so števni (diagonalno štetje). Gostota ni ovira.

? Pare iz $\mathbb{N} \times \mathbb{N}$ naštevamo po diagonalah $m + n = 2, 3, \dots$, na diagonali po naraščajočem $m$. Na katerem mestu je par $(2, 3)$?
- $5$
~ To je $m + n$, številka diagonale, ne mesto. Pred diagonalo $5$ je že $1 + 2 + 3 = 6$ parov.
- $6$
~ To je število parov pred diagonalo $m + n = 5$. Prišteti moraš še $m = 2$.
+ $8$
- $9$
~ Na diagonali si štel po $n$ namesto po $m$: par $(2, 3)$ je drugi, ne tretji.
> Pred diagonalo $s = 5$ je $\frac{3 \cdot 4}{2} = 6$ parov, na diagonali je $(2, 3)$ drugi: $6 + 2 = 8$.

? Katera funkcija je bijekcija iz $(0, 1)$ na $(-1, 3)$?
- $f(x) = 4x$
~ Ta slika na $(0, 4)$. Krajišči se morata preslikati v $-1$ in $3$.
- $f(x) = 3x - 1$
~ Ta slika na $(-1, 2)$, zato ni surjektivna. Dolžina ciljnega intervala je $4$, ne $3$.
+ $f(x) = 4x - 1$
> $f(0) = -1$ in $f(1) = 3$; linearna funkcija s pozitivnim naklonom je injektivna in zadene vsako točko vmes, zato je bijekcija $(0, 1) \to (-1, 3)$.

:::simboli
f | bijekcija | | | f⁻¹ njen inverz
A | množica
m, n | naravni števili | | | v tabeli parov m vrstica, n stolpec
\pi | zaporedna številka para (m, n) | \pi(m, n) = \frac{(m+n-2)(m+n-1)}{2} + m | | tu ne pomeni števila π
s | številka diagonale tabele parov | s = m + n | | diagonala ima s − 1 parov
x | točka intervala (0, 1)
y | točka intervala (2, 5) | | | v zgledu y = f(x) = 3x + 2
:::
