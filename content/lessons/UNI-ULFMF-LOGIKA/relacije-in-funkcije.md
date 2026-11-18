---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Študente letnika razvrstiš po rojstnem mesecu. Vsak študent pride v natanko eno skupino in dva študenta sta v isti skupini natanko tedaj, ko sta »rojena v istem mesecu«. Taka povezava med pari študentov je **relacija**. Lastnosti, zaradi katerih razvrščanje deluje, bomo natančno zapisali.

Druga relacija, »število $a$ deli število $b$«, pa elementov ne razvršča, ampak jih *ureja*, a ne vseh: $4$ in $6$ nista primerljiva. In predpis »študentu priredi vpisno številko« je **funkcija**, ki dvema študentoma nikoli ne da iste številke. Ta lekcija pove, kdaj je relacija ekvivalenca, kdaj urejenost in kdaj je funkcija injektivna ali surjektivna. Vse to potrebuješ za primerjanje velikosti množic.

## Razlaga

**1. Relacija.** Iz prejšnje lekcije poznaš kartezični produkt. **Relacija** na množici $A$ je poljubna podmnožica $R \subseteq A \times A$. Namesto $(a, b) \in R$ pišemo $a \,R\, b$ in beremo »$a$ je v relaciji z $b$«. Primer: na $A = \{1, 2, 3\}$ je relacija »$<$« množica $\{(1, 2), (1, 3), (2, 3)\}$.

Relacijo na majhni množici nariši s puščicami: elemente napiši kot točke, za vsak par $(a, b) \in R$ nariši puščico od $a$ do $b$. Par $(a, a)$ je zanka na točki $a$.

**2. Štiri lastnosti.** Relacija $R$ na $A$ je:

| lastnost | pogoj | na puščičnem diagramu |
|---|---|---|
| refleksivna | $\forall a:\ a \,R\, a$ | zanka na *vsaki* točki |
| simetrična | $a \,R\, b \Rightarrow b \,R\, a$ | vsaka puščica ima nasprotno |
| antisimetrična | $a \,R\, b \wedge b \,R\, a \Rightarrow a = b$ | med različnima točkama nikoli obe smeri |
| tranzitivna | $a \,R\, b \wedge b \,R\, c \Rightarrow a \,R\, c$ | vsaka pot dveh puščic ima bližnjico |

Pogoji v zadnjih treh vrsticah veljajo za vse $a, b, c \in A$. Pri tranzitivnosti niso nujno različni: iz $a \,R\, b$ in $b \,R\, a$ sledi $a \,R\, a$.

**3. Ekvivalenčna relacija.** Relacija, ki je refleksivna, simetrična in tranzitivna, je **ekvivalenčna relacija** (ekvivalenca). Običajno jo označimo z $\sim$. Primeri: »rojen v istem mesecu«, »ima isti ostanek pri deljenju s $3$«, enakost $=$.

**Ekvivalenčni razred** elementa $a$ je množica vseh elementov, ki so z njim v relaciji: $[a] = \{x \in A ;\ x \sim a\}$. Pri »rojen v istem mesecu« je razred študenta njegova mesečna skupina. Razredi so neprazni, se ne prekrivajo in skupaj pokrijejo $A$. Taki razdelitvi množice na kose rečemo **razbitje** ali **particija**. **Faktorska množica** $A/{\sim}$ je množica vseh razredov.

:::premisli
Zakaj se dva različna ekvivalenčna razreda ne moreta delno prekrivati? Namig: kaj bi veljalo za element $c$, ki bi bil v $[a]$ in v $[b]$?
---
Iz $c \sim a$ in $c \sim b$ po simetriji dobimo $a \sim c$ in $c \sim b$, po tranzitivnosti $a \sim b$. Potem je vsak element, ki je v relaciji z $a$, v relaciji tudi z $b$ in obratno, torej $[a] = [b]$. Razreda sta enaka ali disjunktna.
:::

**4. Urejenost.** Relacija, ki je refleksivna, antisimetrična in tranzitivna, je **delna urejenost**. Običajno jo označimo z $\preceq$. Primera: $\le$ na $\mathbb{R}$ in $\subseteq$ na $\mathcal{P}(A)$. Če sta poleg tega poljubna dva elementa **primerljiva** ($a \preceq b$ ali $b \preceq a$), je urejenost **linearna**. Relacija $\le$ na $\mathbb{R}$ je linearna. Relacija »deli« na $\{1, 2, 3, 4, 6, 12\}$ je delna, ni pa linearna: $4 \nmid 6$ in $6 \nmid 4$.

**5. Funkcija.** **Funkcija** $f: A \to B$ je relacija med $A$ in $B$, torej $f \subseteq A \times B$, pri kateri ima vsak $a \in A$ *natanko en* $b \in B$ s $(a, b) \in f$. Ta $b$ označimo s $f(a)$. Množica $A$ je **domena**, $B$ **kodomena**, $f(A) = \{f(a) ;\ a \in A\}$ je **zaloga vrednosti** (slika). Na puščičnem diagramu iz vsake točke v $A$ izhaja natanko ena puščica.

Funkcija $f$ je:

- **injektivna**, če različna elementa dobita različni sliki: $f(a_1) = f(a_2) \Rightarrow a_1 = a_2$. V vsako točko $B$ pride *največ ena* puščica.
- **surjektivna**, če je vsak element kodomene slika česa: $\forall b \in B\ \exists a \in A:\ f(a) = b$, torej $f(A) = B$. V vsako točko $B$ pride *vsaj ena* puščica.
- **bijektivna**, če je oboje. V vsako točko $B$ pride *natanko ena* puščica. Bijekcija ima **inverz** $f^{-1}: B \to A$.

:::premisli
Funkcija $f(x) = x^2$ ni surjektivna kot $f: \mathbb{R} \to \mathbb{R}$. Ali lahko z isto formulo, a drugo domeno in kodomeno, dobiš bijekcijo?
---
Da: $f: [0, \infty) \to [0, \infty)$. Kodomena brez negativnih števil popravi surjektivnost, domena brez negativnih števil pa injektivnost (prej je bilo $f(-2) = f(2)$). Lastnosti so odvisne od domene in kodomene, ne le od formule.
:::

## Rešeni primeri

### Primer 1 (lažji): je relacija ekvivalenca?

Na $A = \{1, 2, 3\}$ je dana relacija $R = \{(1, 1), (2, 2), (3, 3), (1, 2), (2, 1)\}$. Ali je ekvivalenčna? Če je, zapiši razrede.

**Podatki:** $A = \{1, 2, 3\}$, $R = \{(1, 1), (2, 2), (3, 3), (1, 2), (2, 1)\}$
**Iščemo:** ali je $R$ ekvivalenčna relacija in njene razrede

:::formula
Ekvivalenca: refleksivna, simetrična, tranzitivna; $[a] = \{x \in A ;\ x \,R\, a\}$
:::

**Rešitev:**

1. Refleksivnost: $(1, 1)$, $(2, 2)$, $(3, 3)$ so v $R$, torej ima vsak element zanko.
2. Simetričnost: edini par različnih elementov je $(1, 2)$, njegov obrat $(2, 1)$ je tudi v $R$.
3. Tranzitivnost: verige z različnimi elementi so $1 \,R\, 2 \,R\, 1$ in $2 \,R\, 1 \,R\, 2$; zahtevata $(1, 1)$ in $(2, 2)$, ki sta v $R$. Verige z zanko, npr. $1 \,R\, 1 \,R\, 2$, dajo par, ki je že v $R$.
4. Razredi: $[1] = \{1, 2\} = [2]$ in $[3] = \{3\}$. Skupaj pokrijeta $A$ in se ne prekrivata.
5. Odgovor: $R$ je ekvivalenčna relacija; $A/R = \{\{1, 2\}, \{3\}\}$.

### Primer 2: injektivnost in surjektivnost

Ali je $f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = 2x + 1$, injektivna? Ali je surjektivna?

**Podatki:** $f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = 2x + 1$
**Iščemo:** ali je $f$ injektivna in ali je surjektivna

:::formula
Injektivna: $f(x_1) = f(x_2) \Rightarrow x_1 = x_2$; surjektivna: $\forall y \in \mathbb{Z}\ \exists x \in \mathbb{Z}:\ f(x) = y$
:::

**Rešitev:**

1. Injektivnost: naj bo $f(x_1) = f(x_2)$, torej $2x_1 + 1 = 2x_2 + 1$.
2. Odštejemo $1$ in delimo z $2$: $x_1 = x_2$. Pogoj velja za vse $x_1, x_2$, zato je $f$ injektivna.
3. Surjektivnost: za dani $y$ rešimo $2x + 1 = y$ in dobimo $x = \dfrac{y - 1}{2}$.
4. To je celo število le pri lihem $y$. Za $y = 0$ bi bil $x = -\dfrac{1}{2} \notin \mathbb{Z}$, zato $0$ ni slika nobenega celega števila.
5. Odgovor: $f$ je injektivna, ni pa surjektivna; njena zaloga vrednosti so liha cela števila. Kot $f: \mathbb{R} \to \mathbb{R}$ bi bila ista formula bijekcija.

### Primer 3 (težji): ostanki pri deljenju s 3

Na $\mathbb{Z}$ definiramo $x \sim y \iff 3 \mid (x - y)$. Dokaži, da je $\sim$ ekvivalenčna relacija, opiši razrede in ugotovi, ali sta $14$ in $-7$ v istem razredu.

**Podatki:** množica $\mathbb{Z}$, $x \sim y \iff 3 \mid (x - y)$, števili $14$ in $-7$
**Iščemo:** dokaz, da je $\sim$ ekvivalenca, razrede in ali je $14 \sim -7$

:::formula
$3 \mid m \iff \exists k \in \mathbb{Z}:\ m = 3k$; vsak $x \in \mathbb{Z}$ zapišemo kot $x = 3q + r$, $r \in \{0, 1, 2\}$
:::

**Rešitev:**

1. Refleksivnost: $x - x = 0 = 3 \cdot 0$, torej $x \sim x$.
2. Simetričnost: iz $x - y = 3k$ sledi $y - x = 3 \cdot (-k)$, torej $y \sim x$.
3. Tranzitivnost: iz $x - y = 3k$ in $y - z = 3l$ s seštevanjem dobimo $x - z = 3(k + l)$, torej $x \sim z$.
4. Razredi: $x \sim y$ natanko tedaj, ko imata $x$ in $y$ isti ostanek $r$. Razredi so trije: $[0] = \{\dots, -3, 0, 3, \dots\}$, $[1] = \{\dots, -2, 1, 4, \dots\}$, $[2] = \{\dots, -1, 2, 5, \dots\}$.
5. Ostanka: $14 = 3 \cdot 4 + 2$ in $-7 = 3 \cdot (-3) + 2$. Obe imata ostanek $2$. Kontrola: $14 - (-7) = 21 = 3 \cdot 7$.
6. Odgovor: $\sim$ je ekvivalenca s tremi razredi $[0]$, $[1]$, $[2]$; $14$ in $-7$ sta oba v razredu $[2]$.

### Primer 4: zdaj ti

Naj bo $A = \{1, 2, 3\}$ in $B = \{a, b\}$. Koliko je vseh funkcij $f: A \to B$? Koliko jih je injektivnih in koliko surjektivnih?

**Podatki:** $A = \{1, 2, 3\}$, $|A| = 3$, $B = \{a, b\}$, $|B| = 2$
**Iščemo:** število vseh, injektivnih in surjektivnih funkcij $A \to B$

:::formula
Vseh funkcij je $|B|^{|A|}$; surjektivne so vse razen tistih, ki zgrešijo kak element $B$
:::

**Rešitev:**

1. Vse funkcije: vsak od treh elementov $A$ izbere eno od dveh slik, zato jih je $2^3 = 8$.
2. Injektivnih ni: trije elementi gredo v dva, zato dva dobita isto sliko.
3. Surjektivne: od vseh odštej tiste, ki ne zadenejo obeh elementov $B$. Dokončaj sam:

:::premisli
Koliko funkcij $A \to B$ ni surjektivnih in koliko je surjektivnih?
---
Nesurjektivni sta le konstantni funkciji (vse v $a$ ali vse v $b$), torej $2$. Surjektivnih je $8 - 2 = 6$.
:::

## Pogoste napake

- **»Antisimetrična pomeni, da ni simetrična.«** Napačno: enakost $=$ je simetrična in antisimetrična hkrati, relacija $\{(1, 2), (2, 1), (2, 3)\}$ pa ni ne eno ne drugo. Popravek: antisimetričnost prepoveduje le *obe* puščici med *različnima* točkama.
- **Refleksivnost iz ene zanke.** »$(1, 1) \in R$, torej je $R$ refleksivna.« Napačno: pogoj je $\forall a$, zanko mora imeti *vsak* element $A$. Popravek: preveri vse diagonalne pare.
- **Tranzitivnost le za različne elemente.** Relacija $\{(1, 2), (2, 1)\}$ na $\{1, 2\}$ se zdi tranzitivna, ker »ni treh različnih elementov«. Napačno: iz $1 \,R\, 2$ in $2 \,R\, 1$ sledi zahteva $1 \,R\, 1$, ki je ni. Popravek: preveri vse verige, tudi tiste, ki se vrnejo.
- **Injektivnost v napačni smeri.** »$x_1 = x_2 \Rightarrow f(x_1) = f(x_2)$, torej je $f$ injektivna.« Napačno: to velja za *vsako* funkcijo. Popravek: dokazujemo obrat, $f(x_1) = f(x_2) \Rightarrow x_1 = x_2$, ali obrat po kontrapoziciji, $x_1 \neq x_2 \Rightarrow f(x_1) \neq f(x_2)$.
- **Surjektivnost »po formuli«.** »$f(x) = x^2$ ni surjektivna« brez navedbe kodomene. Napačno: kot $\mathbb{R} \to [0, \infty)$ je surjektivna. Popravek: vedno preveri, ali je vsak element *dane* kodomene zadet.

## Povzetek

- Relacija na $A$ je $R \subseteq A \times A$; lastnosti: refleksivna, simetrična, antisimetrična, tranzitivna.
- Ekvivalenca = refleksivna + simetrična + tranzitivna. Razredi $[a] = \{x ;\ x \sim a\}$ so enaki ali disjunktni in tvorijo razbitje $A$; $A/{\sim}$ je množica razredov.
- Delna urejenost = refleksivna + antisimetrična + tranzitivna; linearna, če sta vsaka dva elementa primerljiva ($\le$ je linearna, »deli« in $\subseteq$ nista).
- Funkcija $f: A \to B$: vsak $a$ ima natanko eno sliko.
- Injektivna: $f(a_1) = f(a_2) \Rightarrow a_1 = a_2$. Surjektivna: $f(A) = B$. Bijektivna: oboje, ima inverz.
- Lastnosti funkcije so odvisne od domene in kodomene, ne le od formule.

## Za izpit

Znati moraš povedati:
- definicije refleksivnosti, simetričnosti, antisimetričnosti in tranzitivnosti s kvantifikatorji ter za vsako primer relacije, ki lastnosti nima;
- definicijo ekvivalenčne relacije, ekvivalenčnega razreda in faktorske množice ter dokaz, da sta dva razreda enaka ali disjunktna;
- definicijo delne in linearne urejenosti ter primer delne urejenosti, ki ni linearna;
- definicijo funkcije kot relacije ter razliko med kodomeno in zalogo vrednosti;
- definicije injektivnosti, surjektivnosti in bijektivnosti ter kako vsako dokažeš ali ovržeš;
- zakaj so lastnosti funkcije odvisne od domene in kodomene, ne le od formule.

### Naloga 1

Na $\mathbb{Z}$ definiramo $x \sim y \iff 5 \mid (x^2 - y^2)$. (a) Dokaži, da je $\sim$ ekvivalenčna relacija. (b) Določi vse ekvivalenčne razrede. (c) Ali sta $13$ in $-8$ v istem razredu? (d) Ali je $\sim$ ista relacija kot »$x$ in $y$ imata isti ostanek pri deljenju s $5$«?

**Rešitev:**

1. Refleksivnost: $x^2 - x^2 = 0 = 5 \cdot 0$, torej $x \sim x$.
2. Simetričnost: iz $x^2 - y^2 = 5k$ sledi $y^2 - x^2 = 5 \cdot (-k)$, torej $y \sim x$.
3. Tranzitivnost: iz $x^2 - y^2 = 5k$ in $y^2 - z^2 = 5l$ s seštevanjem dobimo $x^2 - z^2 = 5(k + l)$, torej $x \sim z$. Relacija je ekvivalenčna.
4. Zapišemo $x = 5q + r$, $r \in \{0, 1, 2, 3, 4\}$. Potem je $x^2 = 5(5q^2 + 2qr) + r^2$, zato ima $x^2$ pri deljenju s $5$ isti ostanek kot $r^2$.
5. Ostanki kvadratov: $0^2 = 0$, $1^2 = 1$, $2^2 = 4$, $3^2 = 9 = 5 + 4$, $4^2 = 16 = 15 + 1$. Za $r = 0, 1, 2, 3, 4$ so ostanki $0, 1, 4, 4, 1$.
6. Velja $x \sim y$ natanko tedaj, ko imata $x^2$ in $y^2$ isti ostanek. Razredi so zato trije: $[0]$ so števila z ostankom $0$, $[1]$ števila z ostankom $1$ ali $4$, $[2]$ števila z ostankom $2$ ali $3$.
7. Preverimo: $13 = 5 \cdot 2 + 3$ in $-8 = 5 \cdot (-2) + 2$. Ostanka $3$ in $2$ sta v istem razredu. Kontrola: $13^2 - (-8)^2 = 169 - 64 = 105 = 5 \cdot 21$.
8. Relaciji nista isti: $2 \sim 3$, ker je $2^2 - 3^2 = -5$, a $2$ in $3$ nimata istega ostanka. Relacija »isti ostanek« ima $5$ razredov, $\sim$ pa $3$.
9. Odgovor: $\sim$ je ekvivalenca s tremi razredi $[0]$, $[1]$, $[2]$; $13$ in $-8$ sta oba v $[2]$; relacija ni ista kot »isti ostanek pri deljenju s $5$«.

### Naloga 2

Naj bo $A = \{1, 2, 3, 4\}$ in $B = \{a, b, c\}$. (a) Koliko je vseh funkcij $A \to B$, koliko je injektivnih in koliko surjektivnih? (b) Odgovori na ista vprašanja za funkcije $B \to A$.

**Rešitev:**

1. Vseh funkcij $A \to B$: vsak od štirih elementov izbere eno od treh slik, zato jih je $3^4 = 81$.
2. Injektivnih $A \to B$ ni: štirje elementi gredo v tri, zato dva dobita isto sliko.
3. Surjektivne $A \to B$: od vseh odštejemo tiste, ki zgrešijo kak element $B$. Funkcij, ki zgrešijo izbrani element, je $2^4 = 16$, izbrani element pa je lahko vsak od treh.
4. Funkcije, ki zgrešijo dva elementa, so konstantne in smo jih odšteli dvakrat. Take so $3$, zato jih enkrat prištejemo nazaj.
5. Surjektivnih je $81 - 3 \cdot 16 + 3 = 36$.
6. Vseh funkcij $B \to A$ je $4^3 = 64$.
7. Injektivne $B \to A$: $a$ ima $4$ možne slike, $b$ še $3$, $c$ še $2$, torej $4 \cdot 3 \cdot 2 = 24$.
8. Surjektivnih $B \to A$ ni: trije elementi imajo največ tri različne slike, $A$ pa ima štiri elemente.
9. Odgovor: $A \to B$: $81$ vseh, $0$ injektivnih, $36$ surjektivnih. $B \to A$: $64$ vseh, $24$ injektivnih, $0$ surjektivnih.

### Naloga 3

Natančno navedi definiciji injektivne in surjektivne funkcije. Naj bosta $f: A \to B$ in $g: B \to C$ funkciji, $g \circ f: A \to C$ pa njun kompozitum, $(g \circ f)(a) = g(f(a))$. Dokaži: če je $g \circ f$ injektiven, je $f$ injektivna. Utemelji, ali mora biti tedaj injektivna tudi $g$.

**Rešitev:**

1. Funkcija $f: A \to B$ je injektivna, če za vse $a_1, a_2 \in A$ velja $f(a_1) = f(a_2) \Rightarrow a_1 = a_2$.
2. Funkcija $f: A \to B$ je surjektivna, če velja $\forall b \in B\ \exists a \in A:\ f(a) = b$, torej $f(A) = B$.
3. Dokaz: naj bo $g \circ f$ injektiven in $f(a_1) = f(a_2)$. Na obeh straneh uporabimo $g$: $g(f(a_1)) = g(f(a_2))$.
4. To pomeni $(g \circ f)(a_1) = (g \circ f)(a_2)$. Ker je $g \circ f$ injektiven, sledi $a_1 = a_2$. Torej je $f$ injektivna.
5. Funkcija $g$ ni nujno injektivna. Protiprimer: $A = \{1\}$, $B = \{a, b\}$, $C = \{1\}$, $f(1) = a$, $g(a) = g(b) = 1$.
6. Kompozitum $g \circ f: \{1\} \to \{1\}$ je identiteta, torej injektiven. Funkcija $g$ pa ni injektivna, ker je $g(a) = g(b)$ in $a \neq b$.
7. Sklep: iz injektivnosti $g \circ f$ sledi injektivnost $f$, ne pa $g$. Funkcija $g$ mora biti injektivna le na zalogi vrednosti $f(A)$; element $B$ zunaj nje sme zlepiti s katerimkoli drugim.

## Drugače: Na sliki

Relacijo na $\{1, 2, 3\}$ zapiši kot tabelo $3 \times 3$: vrstica je $a$, stolpec $b$, v celico napiši »da«, če je $a \,R\, b$. Za relacijo iz primera 1:

| | $1$ | $2$ | $3$ |
|---|---|---|---|
| $1$ | da | da | ne |
| $2$ | da | da | ne |
| $3$ | ne | ne | da |

- **Refleksivna:** na diagonali so sami »da«.
- **Simetrična:** tabela je zrcalna čez diagonalo.
- **Antisimetrična:** zunaj diagonale nikoli »da« na obeh zrcalnih mestih.
- **Ekvivalenca:** po primernem preštevilčenju elementov so »da« zbrani v kvadratnih blokih na diagonali. Vsak blok je en razred, tu $\{1, 2\}$ in $\{3\}$.

Funkcijo nariši kot dva stolpca točk s puščicami iz levega v desnega. Štej puščice, ki *pridejo* v vsako desno točko: največ ena pomeni injektivno, vsaj ena surjektivno, natanko ena bijektivno.

## Drugače: Uporaba v stroki

- **Ekvivalenca:** z njo matematik gradi nove objekte. Racionalna števila so razredi parov celih števil $(a, b)$, $b \neq 0$, pri $(a, b) \sim (c, d) \iff ad = bc$, zato sta $\frac{1}{2}$ in $\frac{3}{6}$ isto število. V algebri in kriptografiji računamo z razredi ostankov $\mathbb{Z}_n$.
- **Delna urejenost:** v računalništvu so odvisnosti med opravili ali programskimi paketi delna urejenost. Algoritem topološkega urejanja jo razširi v linearno, torej v vrstni red izvajanja. Takih vrstnih redov je navadno več.
- **Injektivnost:** šifrirna funkcija mora biti injektivna, sicer dveh sporočil z isto šifro ne bi mogel razločiti. Zgoščevalna funkcija, ki poljubno dolga sporočila slika v $256$ bitov, ne more biti injektivna; zahtevamo le, da je trk težko najti.
- **Surjektivnost:** v linearni algebri je sistem $A\vec{x} = \vec{b}$ rešljiv za vsak $\vec{b}$ natanko tedaj, ko je preslikava $\vec{x} \mapsto A\vec{x}$ surjektivna. Rešitev je enolična natanko tedaj, ko je preslikava injektivna.

## Drugače: Bolj natančno

**Razbitje in ekvivalenca sta isto.** Vsaka ekvivalenca določa razbitje na razrede (glej premislek v razlagi). Obratno: če je $\{A_i\}$ razbitje $A$, je $x \sim y \iff \exists i:\ x, y \in A_i$ ekvivalenca, katere razredi so ravno $A_i$. Na množici s $3$ elementi je zato ekvivalenc toliko kot razbitij, to je $5$.

**Inverz in bijektivnost.** Funkcija $f: A \to B$ ima inverz $g: B \to A$ z $g \circ f = \mathrm{id}_A$ in $f \circ g = \mathrm{id}_B$ natanko tedaj, ko je bijektivna. Iz $g \circ f = \mathrm{id}_A$ sledi injektivnost: $f(a_1) = f(a_2) \Rightarrow a_1 = g(f(a_1)) = g(f(a_2)) = a_2$. Iz $f \circ g = \mathrm{id}_B$ sledi surjektivnost: $b = f(g(b))$.

**Kompozitum.** Kompozitum injektivnih funkcij je injektiven, kompozitum surjektivnih je surjektiven. Če je $g \circ f$ injektiven, je $f$ injektivna; če je $g \circ f$ surjektiven, je $g$ surjektivna.

**Štetje.** Relacij na $n$-elementni množici je $2^{n^2}$, ker je to število podmnožic $A \times A$; pri $n = 3$ jih je $2^9 = 512$. Funkcij $A \to B$ je $|B|^{|A|}$. Bijekcij med dvema $3$-elementnima množicama je $3 \cdot 2 \cdot 1 = 6$.

## Preveri se

? Katere tri lastnosti določajo ekvivalenčno relacijo?
- refleksivnost, antisimetričnost, tranzitivnost
~ To so lastnosti delne urejenosti. Ekvivalenca mora biti simetrična, sicer »biti v isti skupini« ne bi veljalo v obe smeri.
+ refleksivnost, simetričnost, tranzitivnost
- simetričnost, antisimetričnost, tranzitivnost
~ Simetrična in antisimetrična hkrati je le relacija, ki vsebuje samo pare $(a, a)$. Manjka refleksivnost.
> Ekvivalenca je refleksivna, simetrična in tranzitivna; delna urejenost ima namesto simetričnosti antisimetričnost.

? Relacija na $\{1, 2, 3\}$ je $R = \{(1, 1), (1, 2), (2, 1)\}$. Katera trditev je resnična?
- $R$ je refleksivna, ker vsebuje $(1, 1)$.
~ Refleksivnost zahteva zanko na vsakem elementu; $(2, 2)$ in $(3, 3)$ manjkata.
- $R$ je tranzitivna, ker nima verige treh različnih elementov.
~ Veriga $2 \,R\, 1 \,R\, 2$ zahteva $(2, 2) \in R$, kar ne drži. Tranzitivnost velja tudi za verige, ki se vrnejo.
+ $R$ je simetrična, ni pa refleksivna.
- $R$ je antisimetrična, ker ni refleksivna.
~ Antisimetričnost nima zveze z refleksivnostjo. Tu je ni, ker sta v $R$ oba para $(1, 2)$ in $(2, 1)$.
> Obrat vsakega para je v $R$, zato je simetrična. Ni pa refleksivna, ker manjkata $(2, 2)$ in $(3, 3)$.

? Kaj moraš dokazati, ko dokazuješ injektivnost funkcije $f$?
- $x_1 = x_2 \Rightarrow f(x_1) = f(x_2)$
~ To velja za vsako funkcijo, saj ima vsak $x$ eno sliko. Dokazati je treba obrat.
+ $f(x_1) = f(x_2) \Rightarrow x_1 = x_2$
- Za vsak $y$ obstaja $x$ s $f(x) = y$.
~ To je surjektivnost: vsak element kodomene je zadet. Injektivnost govori o tem, da ni zadet dvakrat.
> Injektivnost: enaki sliki pomenita enaka originala; enakovredno $x_1 \neq x_2 \Rightarrow f(x_1) \neq f(x_2)$.

? Katera funkcija je bijektivna?
- $f: \mathbb{R} \to \mathbb{R}$, $f(x) = x^2$
~ Ni injektivna, ker $f(-1) = f(1)$, in ni surjektivna, ker $-1$ ni slika.
- $f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = 2x$
~ Je injektivna, a liha števila niso slika: $2x = 1$ nima celoštevilske rešitve.
+ $f: \mathbb{R} \to \mathbb{R}$, $f(x) = 3x - 5$
> Enačba $3x - 5 = y$ ima za vsak $y \in \mathbb{R}$ natanko eno rešitev $x = \dfrac{y + 5}{3}$, zato je $f$ injektivna in surjektivna.

? Relacija »$a$ deli $b$« na $\{1, 2, 3, 4, 6, 12\}$ je
- ekvivalenčna relacija.
~ Ni simetrična: $2$ deli $4$, $4$ pa ne deli $2$.
+ delna urejenost, ki ni linearna.
- linearna urejenost.
~ Števili $4$ in $6$ nista primerljivi: nobeno ne deli drugega.
> Relacija je refleksivna ($a \mid a$), antisimetrična (iz $a \mid b$ in $b \mid a$ pri naravnih številih sledi $a = b$) in tranzitivna, ni pa linearna, ker $4 \nmid 6$ in $6 \nmid 4$.

:::simboli
A | množica (domena) | | | relacija na A je R ⊆ A × A
B | kodomena funkcije
R | relacija
a | element množice A (predstavnik razreda [a])
x | element množice
f | funkcija (preslikava)
x_1, x_2 | elementa domene funkcije f
y | element kodomene
m, k | celi števili | | | 3 deli m natanko tedaj, ko je m = 3k
q | količnik pri deljenju s 3 (v nalogi 1 za izpit s 5)
r | ostanek pri deljenju s 3 (v nalogi 1 za izpit s 5) | r = x - 3q | | r ∈ {0, 1, 2}; pri deljenju s 5 je r = x − 5q, r ∈ {0, 1, 2, 3, 4}
:::
