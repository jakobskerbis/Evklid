---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Katera števila delijo hkrati $12$ in $18$? Napišeš delitelje števila $12$: $1, 2, 3, 4, 6, 12$. Nato delitelje števila $18$: $1, 2, 3, 6, 9, 18$. Skupni delitelji so tisti, ki so na obeh seznamih: $1, 2, 3, 6$.

Pravkar si naredil operacijo z **množicami**: iz dveh zbirk si izbral elemente, ki so v obeh. Množice so jezik, v katerem je zapisana skoraj vsa matematika: definicijsko območje funkcije, rešitve enačbe, dogodki v verjetnosti, relacije in funkcije v naslednji lekciji. Operacije z množicami so pri tem le prevod veznikov iz izjavnega računa: »in« postane presek, »ali« postane unija, »ne« postane komplement.

## Razlaga

**1. Množica in element.** **Množica** je zbirka objektov, ki jim rečemo **elementi**. Zapis $x \in A$ beremo »$x$ je element $A$«, zapis $x \notin A$ pa »$x$ ni element $A$«. Množico podamo z naštevanjem, $A = \{1, 2, 3\}$, ali z lastnostjo, $A = \{x \in \mathbb{N} ;\ x < 4\}$. Pri množici je pomembno le, kateri elementi so v njej. Vrstni red in ponavljanje nista pomembna: $\{1, 2, 3\} = \{3, 1, 2, 2\}$.

**Prazna množica** $\emptyset$ nima nobenega elementa. Število elementov končne množice $A$ označimo z $|A|$.

**2. Podmnožica.** Množica $A$ je **podmnožica** množice $B$, $A \subseteq B$, če je vsak element $A$ tudi element $B$:

$$A \subseteq B \iff \forall x\,(x \in A \Rightarrow x \in B)$$

Primer: $\{2, 6\} \subseteq \{1, 2, 3, 6\}$. Vsaka množica je podmnožica same sebe, $A \subseteq A$. Prazna množica je podmnožica vsake množice: implikacija $x \in \emptyset \Rightarrow x \in B$ ima vedno neresnično predpostavko, zato je vedno resnična.

Dve množici sta **enaki**, če imata iste elemente. To pomeni $A \subseteq B$ in $B \subseteq A$. Tako enakost množic tudi dokazujemo: v dveh smereh.

:::premisli
Ali velja $\{1\} \in \{1, 2\}$? Ali velja $\{1\} \subseteq \{1, 2\}$?
---
Prvo ne velja, drugo velja. Elementa množice $\{1, 2\}$ sta števili $1$ in $2$; množica $\{1\}$ ni med njima. Je pa vsak element množice $\{1\}$ (torej število $1$) tudi v $\{1, 2\}$, zato je $\{1\}$ podmnožica.
:::

**3. Unija, presek, razlika, komplement.** Vsaka operacija je en veznik:

| operacija | zapis | $x$ je v rezultatu, če | veznik |
|---|---|---|---|
| unija | $A \cup B$ | $x \in A \vee x \in B$ | ali |
| presek | $A \cap B$ | $x \in A \wedge x \in B$ | in |
| razlika | $A \setminus B$ | $x \in A \wedge x \notin B$ | in ne |
| komplement | $A^c$ | $x \in U \wedge x \notin A$ | ne |

Komplement je smiseln le glede na izbrano **univerzalno množico** $U$, v kateri živijo vsi elementi, o katerih govorimo. Množicama z $A \cap B = \emptyset$ rečemo **disjunktni**.

**Vennov diagram** v besedah: nariši pravokotnik $U$, v njem dva kroga $A$ in $B$, ki se delno prekrivata. Lečasti del, kjer se kroga prekrivata, je $A \cap B$. Oba kroga skupaj sta $A \cup B$. Del kroga $A$ zunaj kroga $B$ je $A \setminus B$. Vse v pravokotniku zunaj kroga $A$ je $A^c$.

Ker so operacije vezniki, iz izjavnega računa dobimo zakone za množice brez novega dela. De Morganova zakona se prevedeta v $(A \cup B)^c = A^c \cap B^c$ in $(A \cap B)^c = A^c \cup B^c$. Veljata tudi distributivnosti $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$ in $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$.

**4. Potenčna množica.** **Potenčna množica** $\mathcal{P}(A)$ je množica *vseh* podmnožic množice $A$. Njeni elementi so množice. Za $A = \{1, 2\}$:

$$\mathcal{P}(A) = \{\emptyset, \{1\}, \{2\}, \{1, 2\}\}$$

Zakaj jih je ravno $4$? Ko sestavljaš podmnožico, se za vsak element posebej odločiš: vzamem ali ne vzamem. To je kot vrstica resničnostne tabele: $n$ elementov pomeni $n$ neodvisnih odločitev z dvema možnostma, torej $|\mathcal{P}(A)| = 2^n$, če je $|A| = n$.

:::premisli
Koliko elementov ima $\mathcal{P}(\emptyset)$? Napovej, preden pogledaš.
---
En element: $\mathcal{P}(\emptyset) = \{\emptyset\}$. Prazna množica ima natanko eno podmnožico, samo sebe. To se ujema s formulo $2^0 = 1$. Množica $\{\emptyset\}$ ni prazna, ker ima en element.
:::

**5. Kartezični produkt.** **Urejeni par** $(a, b)$ ima prvo in drugo komponento. Pri njem je vrstni red pomemben: $(1, 2) \neq (2, 1)$, čeprav je $\{1, 2\} = \{2, 1\}$. **Kartezični produkt** množic $A$ in $B$ je množica vseh urejenih parov s prvo komponento iz $A$ in drugo iz $B$:

$$A \times B = \{(a, b) ;\ a \in A,\ b \in B\}$$

Predstavljaj si ga kot tabelo: vrstice so elementi $A$, stolpci elementi $B$, vsaka celica je en par. Zato je $|A \times B| = |A| \cdot |B|$. Ravnina $\mathbb{R} \times \mathbb{R} = \mathbb{R}^2$ je kartezični produkt: točka je par koordinat $(x, y)$.

## Rešeni primeri

### Primer 1 (lažji): delitelji

Naj bo $A$ množica naravnih deliteljev števila $12$ in $B$ množica naravnih deliteljev števila $18$. Določi $A \cup B$, $A \cap B$, $A \setminus B$ in $B \setminus A$.

**Podatki:** $A = \{1, 2, 3, 4, 6, 12\}$, $B = \{1, 2, 3, 6, 9, 18\}$
**Iščemo:** $A \cup B$, $A \cap B$, $A \setminus B$, $B \setminus A$

:::formula
$x \in A \cap B \iff x \in A \wedge x \in B$, $\quad x \in A \cup B \iff x \in A \vee x \in B$, $\quad x \in A \setminus B \iff x \in A \wedge x \notin B$
:::

**Rešitev:**

1. Presek: elementi, ki so na obeh seznamih: $A \cap B = \{1, 2, 3, 6\}$. To so skupni delitelji.
2. Razlika $A \setminus B$: iz $A$ odstranimo elemente preseka: $A \setminus B = \{4, 12\}$.
3. Razlika $B \setminus A$: iz $B$ odstranimo elemente preseka: $B \setminus A = \{9, 18\}$.
4. Unija: vse, kar je vsaj v eni množici, vsak element zapišemo enkrat: $A \cup B = \{1, 2, 3, 4, 6, 9, 12, 18\}$.
5. Kontrola s štetjem: presek smo pri $|A| + |B|$ šteli dvakrat, zato $|A \cup B| = 6 + 6 - 4 = 8$. Ujema se.
6. Odgovor: $A \cap B = \{1, 2, 3, 6\}$, $A \cup B = \{1, 2, 3, 4, 6, 9, 12, 18\}$, $A \setminus B = \{4, 12\}$, $B \setminus A = \{9, 18\}$.

### Primer 2: potenčna množica

Naj bo $A = \{a, b, c\}$. Zapiši $\mathcal{P}(A)$. Koliko podmnožic množice $A$ vsebuje element $a$?

**Podatki:** $A = \{a, b, c\}$, $|A| = 3$
**Iščemo:** $\mathcal{P}(A)$ in število podmnožic, ki vsebujejo $a$

:::formula
$|\mathcal{P}(A)| = 2^{|A|}$
:::

**Rešitev:**

1. Pričakujemo $2^3 = 8$ podmnožic, ker se za vsakega od treh elementov odločimo, ali ga vzamemo.
2. Naštejemo po velikosti, da nobene ne izpustimo. Velikost $0$: $\emptyset$. Velikost $1$: $\{a\}, \{b\}, \{c\}$. Velikost $2$: $\{a, b\}, \{a, c\}, \{b, c\}$. Velikost $3$: $\{a, b, c\}$.
3. Skupaj $1 + 3 + 3 + 1 = 8$, kar se ujema s korakom 1.
4. Podmnožice z $a$: odločitev za $a$ je že sprejeta, ostaneta dve prosti odločitvi (za $b$ in $c$), torej $2^2 = 4$. Res: $\{a\}, \{a, b\}, \{a, c\}, \{a, b, c\}$.
5. Odgovor: $\mathcal{P}(A) = \{\emptyset, \{a\}, \{b\}, \{c\}, \{a, b\}, \{a, c\}, \{b, c\}, \{a, b, c\}\}$; element $a$ vsebujejo $4$ podmnožice, polovica vseh.

### Primer 3 (težji): dokaz zakona

Dokaži, da za poljubne množice velja $A \setminus (B \cup C) = (A \setminus B) \cap (A \setminus C)$.

**Podatki:** $A$, $B$, $C$ so poljubne množice
**Iščemo:** dokaz enakosti $A \setminus (B \cup C) = (A \setminus B) \cap (A \setminus C)$

:::formula
$X = Y \iff \forall x\,(x \in X \Leftrightarrow x \in Y)$; De Morgan: $\neg(p \vee q) \sim \neg p \wedge \neg q$
:::

**Rešitev:**

1. Vzamemo poljuben $x$. Pokazati moramo, da je izjava $x \in A \setminus (B \cup C)$ enakovredna izjavi $x \in (A \setminus B) \cap (A \setminus C)$.
2. Po definiciji razlike in unije: $x \in A \setminus (B \cup C) \iff x \in A \wedge \neg(x \in B \vee x \in C)$.
3. De Morganov zakon za izjave da: $\iff x \in A \wedge x \notin B \wedge x \notin C$.
4. Ker je $p \sim p \wedge p$, lahko $x \in A$ zapišemo dvakrat in pregrupiramo: $\iff (x \in A \wedge x \notin B) \wedge (x \in A \wedge x \notin C)$.
5. To je po definiciji razlike in preseka $x \in (A \setminus B) \cap (A \setminus C)$.
6. Odgovor: za vsak $x$ sta pripadnosti enakovredni, zato sta množici enaki. Zakon je De Morganov zakon, prenesen v množice.

### Primer 4: zdaj ti

Naj bo $A = \{0, 1\}$ in $B = \{x, y, z\}$. Zapiši $A \times B$. Koliko elementov ima $\mathcal{P}(A \times B)$?

**Podatki:** $A = \{0, 1\}$, $|A| = 2$, $B = \{x, y, z\}$, $|B| = 3$
**Iščemo:** $A \times B$ in $|\mathcal{P}(A \times B)|$

:::formula
$|A \times B| = |A| \cdot |B|$, $\quad |\mathcal{P}(M)| = 2^{|M|}$
:::

**Rešitev:**

1. Prva komponenta je iz $A$, druga iz $B$: $A \times B = \{(0, x), (0, y), (0, z), (1, x), (1, y), (1, z)\}$.
2. Preštej pare in uporabi formulo za potenčno množico:

:::premisli
Koliko je $|A \times B|$ in koliko $|\mathcal{P}(A \times B)|$?
---
$|A \times B| = 2 \cdot 3 = 6$, zato je $|\mathcal{P}(A \times B)| = 2^6 = 64$.
:::

## Pogoste napake

- **Zamenjava $\in$ in $\subseteq$.** »$\{1\} \in \{1, 2\}$, ker je $1$ notri.« Napačno: $\in$ sprašuje, ali je objekt *eden od elementov*, $\subseteq$ pa, ali so *vsi elementi* leve množice v desni. Popravek: najprej naštej elemente desne množice in poglej, ali je leva stran točno eden od njih.
- **$\emptyset$ in $\{\emptyset\}$ sta isto.** Napačno: $\emptyset$ nima elementov, $\{\emptyset\}$ ima enega (prazno množico). Popravek: oklepaj $\{\ \}$ je škatla; prazna škatla in škatla, v kateri je prazna škatla, nista isto.
- **$|\mathcal{P}(A)| = 2n$ ali pozabljeni robni podmnožici.** Kdor šteje »po dva za vsak element«, dobi $2n$; kdor izpusti $\emptyset$ in $A$, dobi $2^n - 2$. Napačno, ker se odločitve množijo, ne seštevajo, in ker sta $\emptyset$ ter $A$ tudi podmnožici. Popravek: $|\mathcal{P}(A)| = 2^n$; pri $n = 3$ je to $8$, ne $6$.
- **$A \times B = B \times A$.** Napačno: $(1, x) \in A \times B$, ni pa v $B \times A$, ker so tam prve komponente iz $B$. Popravek: enako je le število elementov, $|A| \cdot |B|$; množici sta različni, razen če je $A = B$ ali je ena prazna.
- **$|A \cup B| = |A| + |B|$.** Napačno, kadar množici nista disjunktni: skupni elementi se štejejo dvakrat. Popravek: $|A \cup B| = |A| + |B| - |A \cap B|$.

## Povzetek

- $x \in A$: $x$ je element $A$. $A \subseteq B$: vsak element $A$ je v $B$. $A = B \iff A \subseteq B \wedge B \subseteq A$.
- Unija = ali, presek = in, razlika $A \setminus B$ = v $A$ in ne v $B$, komplement $A^c$ = ne (glede na $U$). Zakoni izjavnega računa (De Morgan, distributivnost) veljajo tudi za množice.
- $\emptyset \subseteq A$ za vsako $A$; $\emptyset \neq \{\emptyset\}$.
- Potenčna množica $\mathcal{P}(A)$ = množica vseh podmnožic; $|\mathcal{P}(A)| = 2^{|A|}$.
- Urejeni par: $(a, b) \neq (b, a)$ za $a \neq b$. $A \times B = \{(a, b) ;\ a \in A,\ b \in B\}$, $|A \times B| = |A| \cdot |B|$.
- Enakost množic dokažemo za poljuben element: $x \in X \Leftrightarrow x \in Y$.

## Za izpit

Znati moraš povedati:
- definicijo podmnožice s kvantifikatorjem, zakaj je $\emptyset \subseteq A$ za vsako množico $A$ in kako dokažemo enakost množic (v dveh smereh ali z enakovrednostjo pripadnosti);
- definicije unije, preseka, razlike in komplementa z vezniki ter vlogo univerzalne množice $U$;
- De Morganova zakona in distributivnost za množice, z dokazom za poljuben element;
- definicijo potenčne množice in dokaz, da je $|\mathcal{P}(A)| = 2^n$ za $|A| = n$ (z odločitvami ali z indukcijo);
- definicijo urejenega para in kartezičnega produkta, $|A \times B| = |A| \cdot |B|$ in zakaj v splošnem $A \times B \neq B \times A$;
- formulo $|A \cup B| = |A| + |B| - |A \cap B|$ in zakaj presek odštejemo.

### Naloga 1

Naj bo $U = \{1, 2, \dots, 60\}$, $A$ množica števil iz $U$, deljivih s $4$, $B$ množica števil iz $U$, deljivih s $6$, in $C$ množica števil iz $U$, deljivih z $10$. (a) Zapiši $A \cap B$ in določi $|A \cup B|$. (b) Določi $|(A \cup B) \setminus C|$. (c) Koliko števil iz $U$ ni v nobeni od množic $A$, $B$, $C$? (d) Določi $|\mathcal{P}(A \cap B)|$, število podmnožic množice $A \cap B$, ki vsebujejo število $60$, in $|(A \setminus B) \times (B \setminus A)|$.

**Rešitev:**

1. Moči: $|A| = \frac{60}{4} = 15$, $|B| = \frac{60}{6} = 10$, $|C| = \frac{60}{10} = 6$.
2. (a) Število je deljivo s $4$ in s $6$ natanko tedaj, ko je deljivo z njunim najmanjšim skupnim večkratnikom $12$: $A \cap B = \{12, 24, 36, 48, 60\}$, $|A \cap B| = 5$.
3. $|A \cup B| = |A| + |B| - |A \cap B| = 15 + 10 - 5 = 20$.
4. (b) Elementi $C$ so $10, 20, 30, 40, 50, 60$. V $A \cup B$ so tisti, ki so deljivi s $4$ ali s $6$: $(A \cup B) \cap C = \{20, 30, 40, 60\}$.
5. Iz $A \cup B$ odstranimo te štiri elemente: $|(A \cup B) \setminus C| = 20 - 4 = 16$.
6. (c) Formulo za unijo uporabimo za množici $A \cup B$ in $C$: $|A \cup B \cup C| = |A \cup B| + |C| - |(A \cup B) \cap C| = 20 + 6 - 4 = 22$.
7. Po De Morganu je $A^c \cap B^c \cap C^c = (A \cup B \cup C)^c$, zato je iskanih števil $60 - 22 = 38$.
8. (d) $|\mathcal{P}(A \cap B)| = 2^5 = 32$. Pri podmnožicah s številom $60$ je ena odločitev že sprejeta, ostanejo štiri: $2^4 = 16$.
9. $|A \setminus B| = 15 - 5 = 10$ in $|B \setminus A| = 10 - 5 = 5$, zato je $|(A \setminus B) \times (B \setminus A)| = 10 \cdot 5 = 50$.
10. Odgovor: $A \cap B = \{12, 24, 36, 48, 60\}$, $|A \cup B| = 20$; $|(A \cup B) \setminus C| = 16$; v nobeni množici ni $38$ števil; $|\mathcal{P}(A \cap B)| = 32$, število $60$ vsebuje $16$ podmnožic, kartezični produkt ima $50$ parov.

### Naloga 2

(a) Dokaži, da za poljubni množici velja $\mathcal{P}(A \cap B) = \mathcal{P}(A) \cap \mathcal{P}(B)$. (b) Utemelji, ali za poljubni množici velja $\mathcal{P}(A \cup B) = \mathcal{P}(A) \cup \mathcal{P}(B)$.

**Rešitev:**

1. (a) Elementi potenčne množice so množice. Vzamemo poljubno množico $X$ in pokažemo $X \in \mathcal{P}(A \cap B) \iff X \in \mathcal{P}(A) \cap \mathcal{P}(B)$.
2. Po definiciji potenčne množice in podmnožice: $X \in \mathcal{P}(A \cap B) \iff X \subseteq A \cap B \iff \forall x\,(x \in X \Rightarrow (x \in A \wedge x \in B))$.
3. Ker je $p \Rightarrow (q \wedge r) \sim (p \Rightarrow q) \wedge (p \Rightarrow r)$, je to enakovredno $\forall x\,(x \in X \Rightarrow x \in A) \wedge \forall x\,(x \in X \Rightarrow x \in B)$.
4. To pomeni $X \subseteq A \wedge X \subseteq B$, torej $X \in \mathcal{P}(A) \wedge X \in \mathcal{P}(B)$, kar je $X \in \mathcal{P}(A) \cap \mathcal{P}(B)$. Enakost je dokazana.
5. (b) Enakost v splošnem ne velja. Protiprimer: $A = \{1\}$, $B = \{2\}$. Tedaj je $\mathcal{P}(A) \cup \mathcal{P}(B) = \{\emptyset, \{1\}, \{2\}\}$, $\mathcal{P}(A \cup B) = \{\emptyset, \{1\}, \{2\}, \{1, 2\}\}$. Množica $\{1, 2\}$ je podmnožica unije, ni pa podmnožica ne $A$ ne $B$.
6. Velja pa vsebovanost $\mathcal{P}(A) \cup \mathcal{P}(B) \subseteq \mathcal{P}(A \cup B)$: če je $X \subseteq A$ ali $X \subseteq B$, je vsak element $X$ v $A \cup B$, torej $X \subseteq A \cup B$.
7. Odgovor: $\mathcal{P}(A \cap B) = \mathcal{P}(A) \cap \mathcal{P}(B)$ velja vedno; za unijo velja le $\mathcal{P}(A) \cup \mathcal{P}(B) \subseteq \mathcal{P}(A \cup B)$, enakost pa ne, na primer pri $A = \{1\}$, $B = \{2\}$ ($3$ elementi proti $4$).

### Naloga 3

Natančno navedi definicijo kartezičnega produkta. (a) Dokaži $A \times (B \cup C) = (A \times B) \cup (A \times C)$. (b) Utemelji, za katere množice $A$ in $B$ velja $A \times B = B \times A$.

**Rešitev:**

1. Definicija: $A \times B = \{(a, b) ;\ a \in A,\ b \in B\}$, torej $(a, b) \in A \times B \iff a \in A \wedge b \in B$. Za urejena para velja $(a, b) = (c, d) \iff a = c \wedge b = d$.
2. (a) Vzamemo poljuben par $(x, y)$. Po definiciji: $(x, y) \in A \times (B \cup C) \iff x \in A \wedge (y \in B \vee y \in C)$.
3. Distributivnost $p \wedge (q \vee r) \sim (p \wedge q) \vee (p \wedge r)$ da: $\iff (x \in A \wedge y \in B) \vee (x \in A \wedge y \in C)$.
4. To je $(x, y) \in A \times B \vee (x, y) \in A \times C$, torej $(x, y) \in (A \times B) \cup (A \times C)$. Enakost je dokazana.
5. (b) Če je $A = B$, sta produkta očitno enaka. Če je $A = \emptyset$ ali $B = \emptyset$, ni nobenega para in sta oba produkta prazna, torej enaka.
6. Naj bosta $A$ in $B$ neprazni in $A \times B = B \times A$. Izberemo neki $b \in B$. Za poljuben $a \in A$ je $(a, b) \in A \times B = B \times A$, zato je $a \in B$. Torej $A \subseteq B$.
7. Enako z izbranim $a \in A$ za poljuben $b \in B$ dobimo $b \in A$, torej $B \subseteq A$. Sledi $A = B$.
8. Odgovor: $A \times B = B \times A$ velja natanko tedaj, ko je $A = B$ ali je vsaj ena od množic prazna.

## Drugače: Na sliki

Vennov diagram za dve množici razdeli pravokotnik $U$ na štiri področja:

| področje | $x \in A$ | $x \in B$ | ime |
|---|---|---|---|
| samo levi krog | da | ne | $A \setminus B$ |
| leča v sredini | da | da | $A \cap B$ |
| samo desni krog | ne | da | $B \setminus A$ |
| zunaj krogov | ne | ne | $(A \cup B)^c$ |

To je resničnostna tabela za izjavi $x \in A$ in $x \in B$, le da vrstice narišeš kot področja. Vsaka operacija je izbor področij: unija so prve tri vrstice, presek druga. Zakon velja, če obe strani izbereta ista področja.

Kartezični produkt nariši kot mrežo: na vodoravno os nanesi elemente $A$, na navpično elemente $B$. Vsaka točka mreže je en par. Pri $|A| = 2$ in $|B| = 3$ dobiš $2$ stolpca po $3$ točke, torej $6$ točk.

## Drugače: Uporaba v stroki

- **Množica** je v podatkovni zbirki stolpec brez podvajanj: poizvedba `SELECT DISTINCT` iz seznama strank naredi množico. Programski jeziki imajo množico kot podatkovni tip, v katerem se element, dodan dvakrat, shrani enkrat.
- **Presek, unija in razlika** so poizvedbe `INTERSECT`, `UNION` in `EXCEPT`. Aktuar v zavarovalnici z $12\,000$ strankami našteje $7400$ avtomobilskih in $5100$ stanovanjskih zavarovanj, od tega ima $2300$ strank obe. Vsaj eno zavarovanje ima $7400 + 5100 - 2300 = 10\,200$ strank, nobenega pa $12\,000 - 10\,200 = 1800$.
- **Potenčna množica** je v verjetnosti množica dogodkov: dogodek je podmnožica množice izidov, zato ima met kocke $2^6 = 64$ dogodkov. Statistik, ki izbira med $10$ napovednimi spremenljivkami, ima $2^{10} = 1024$ možnih modelov, tudi model brez spremenljivk ($\emptyset$) in model z vsemi.
- **Kartezični produkt** je množica izidov sestavljenega poskusa: met dveh kock ima $6 \cdot 6 = 36$ izidov in izid $(2, 5)$ ni isti kot $(5, 2)$. V zbirki je to `CROSS JOIN`: tabeli z $2000$ in $500$ vrsticami dasta $2000 \cdot 500 = 1\,000\,000$ vrstic.

## Drugače: Bolj natančno

**Zakaj $|\mathcal{P}(A)| = 2^n$, z indukcijo.** Za $n = 0$ je $\mathcal{P}(\emptyset) = \{\emptyset\}$, torej $1 = 2^0$ element. Naj trditev velja za množice z $n$ elementi in naj bo $A' = A \cup \{a\}$, $a \notin A$. Vsaka podmnožica $A'$ je bodisi podmnožica $A$ bodisi podmnožica $A$ z dodanim $a$. Obeh vrst je $2^n$ in se ne prekrivata, zato je podmnožic $A'$ skupaj $2 \cdot 2^n = 2^{n+1}$.

**Urejeni par kot množica.** Par lahko definiramo samo z množicami: $(a, b) = \{\{a\}, \{a, b\}\}$ (Kuratowski). Iz te definicije sledi bistvena lastnost: $(a, b) = (c, d) \iff a = c \wedge b = d$.

**Russellov paradoks.** Množice ne smemo podati s poljubno lastnostjo. Če bi obstajala $R = \{x ;\ x \notin x\}$, bi veljalo $R \in R \iff R \notin R$, kar je protislovje. Zato aksiomi teorije množic dovolijo le $\{x \in A ;\ \varphi(x)\}$: izbor elementov iz že znane množice $A$.

## Preveri se

? Katera trditev je resnična za $A = \{1, 2, 3\}$?
- $\{2\} \in A$
~ Elementi $A$ so števila $1, 2, 3$, množica $\{2\}$ ni med njimi. Veljata pa $2 \in A$ in $\{2\} \subseteq A$.
+ $\emptyset \subseteq A$
- $\emptyset \in A$
~ Prazna množica je *podmnožica* vsake množice, ni pa element $A$, ker med naštetimi elementi ni.
> Implikacija $x \in \emptyset \Rightarrow x \in A$ ima vedno neresnično predpostavko, zato je resnična za vsak $x$; torej $\emptyset \subseteq A$.

? Koliko elementov ima $\mathcal{P}(A)$, če ima $A$ štiri elemente?
- $8$
~ To je $2 \cdot 4$. Odločitve »vzamem / ne vzamem« se za vsak element množijo, ne seštevajo.
- $14$
~ To je $2^4 - 2$: izpustil si $\emptyset$ in $A$, ki sta tudi podmnožici.
+ $16$
> $|\mathcal{P}(A)| = 2^4 = 16$: za vsakega od štirih elementov se neodvisno odločiš, ali je v podmnožici.

? Kateri izraz opisuje osenčeno področje, kjer je $x$ v $A$ ali v $B$, ni pa v obeh?
- $A \cup B$
~ Unija vsebuje tudi lečo $A \cap B$, kjer je $x$ v obeh.
+ $(A \cup B) \setminus (A \cap B)$
- $A^c \cap B^c$
~ To je področje zunaj obeh krogov: po De Morganu je $A^c \cap B^c = (A \cup B)^c$.
> Iz unije odstranimo lečo, kjer je $x$ v obeh. Ostaneta $A \setminus B$ in $B \setminus A$.

? Naj bo $A = \{1, 2, 3\}$ in $B = \{k, l, m, s\}$. Katera trditev je resnična?
- $A \times B = B \times A$
~ Par $(1, k)$ je v $A \times B$, ni pa v $B \times A$, kjer je prva komponenta iz $B$. Enaka je le moč.
- $|A \times B| = 7$
~ To je $|A| + |B|$. Parov je toliko kot celic tabele s $3$ vrsticami in $4$ stolpci, torej produkt.
+ $|A \times B| = 12$
> Vsakega od $3$ elementov $A$ združimo z vsakim od $4$ elementov $B$: $3 \cdot 4 = 12$ parov.

? V letniku je $30$ študentov. Analizo obiskuje $18$, algebro $12$, oba predmeta pa $5$. Koliko študentov ne obiskuje nobenega od teh predmetov?
- $0$
~ Vsota $18 + 12 = 30$ šteje $5$ študentov, ki obiskujejo oba predmeta, dvakrat.
+ $5$
- $10$
~ Tako dobiš, če od $30$ odšteješ le študente z enim predmetom ($13 + 7$) in pozabiš na $5$ študentov, ki obiskujejo oba.
> $|A \cup B| = 18 + 12 - 5 = 25$, zato nobenega predmeta ne obiskuje $30 - 25 = 5$ študentov.

:::simboli
A, B | množici
X, Y | množici, katerih enakost dokazujemo
M | končna množica | | | če ima n elementov, ima potenčna množica 2ⁿ elementov
x | element množice
a, b | komponenti urejenega para | | | a ∈ A, b ∈ B
p, q | izjavi
:::
