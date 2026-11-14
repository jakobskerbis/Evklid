---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Ana in Bojan primerjata aplikacije na prvem zaslonu telefona. Ana ima aplikacije za glasbo, vreme, zemljevid in igro, Bojan pa za vreme, igro in slovar. Razvrsti jih na tri kupčke: ki jih imata oba, ki jih ima samo Ana in ki jih ima samo Bojan.

Koliko različnih aplikacij imata skupaj? Ne $4 + 3 = 7$, ampak $5$, saj vreme in igro prešteješ le enkrat. Takim skupinam rečemo **množice**. Z njihovim jezikom brez ugibanja odgovoriš na vprašanja, kot so: Katere aplikacije imata oba? Koliko dijakov ne uporablja nobene od dveh aplikacij?

Jezik množic boš potreboval v skoraj vsaki temi, ki sledi. Rešitve enačb zapisujemo kot množice, števila razvrščamo v naravna, cela, racionalna in realna, v verjetnosti pa so dogodki podmnožice. Množice so sorodnice izjav iz logike, zato boš veliko že prepoznal.

## Razlaga

**1. Množica in elementi.** *Množica* je skupek različnih objektov, ki so natančno določeni: za vsak objekt moramo vedeti, ali v množici je ali ni. Objekte imenujemo **elementi** množice. Množice označimo z velikimi črkami ($A$, $B$, $C$, …), elemente pa običajno z malimi. Zapis $a \in A$ beremo »$a$ je element množice $A$«, zapis $a \notin A$ pa »$a$ ni element množice $A$«.

Množico zapišemo na dva načina:

- z naštevanjem: $A = \{1, 2, 3, 4, 5\}$,
- z lastnostjo: $A = \{x \mid x \text{ je naravno število in } x < 6\}$, kar beremo »množica vseh $x$, za katere velja …«.

Oba zapisa opisujeta isto množico. Vrstni red in ponavljanje elementov ne štejeta: $\{1, 2, 3\} = \{3, 2, 1\} = \{1, 1, 2, 3\}$.

**2. Posebne množice.**

- **Prazna množica** $\emptyset$ (tudi $\{\}$) nima nobenega elementa.
- **Moč množice** $|A|$ je število njenih elementov, na primer $|\{a, b, c\}| = 3$ in $|\emptyset| = 0$. Množica je *končna*, če ima končno mnogo elementov, sicer je *neskončna* (na primer množica vseh sodih števil).
- **Univerzalna množica** $\mathcal{U}$ vsebuje vse elemente, ki jih v dani nalogi sploh obravnavamo. Določena mora biti, preden računamo komplement.

**3. Podmnožica.** Množica $A$ je **podmnožica** množice $B$, zapisano $A \subseteq B$, če je vsak element množice $A$ tudi element množice $B$. Če je $A \subseteq B$ in $A \neq B$, je $A$ **prava podmnožica** in pišemo $A \subset B$. Nekateri učbeniki pišejo $\subset$ tudi za navadno podmnožico, zato preveri, kateri zapis uporablja tvoj. Dve množici sta enaki, če imata iste elemente: $A = B$ natanko tedaj, ko velja $A \subseteq B$ in $B \subseteq A$.

Vsaka množica je podmnožica same sebe ($A \subseteq A$), prazna množica pa je podmnožica vsake množice ($\emptyset \subseteq A$). Pazi na razliko: znak $\in$ povezuje *element* z množico, znak $\subseteq$ pa *množico* z množico. Zato je $2 \in \{1, 2, 3\}$, toda $\{2\} \subseteq \{1, 2, 3\}$.

(višja raven) Množica z $n$ elementi ima natanko $2^n$ podmnožic. Množica $\{a, b\}$ ima podmnožice $\emptyset$, $\{a\}$, $\{b\}$ in $\{a, b\}$, torej $2^2 = 4$.

:::premisli
Zakaj je prazna množica podmnožica vsake množice $A$? Pomagaj si z implikacijo »če $x \in \emptyset$, potem $x \in A$«.
---
Predpostavka $x \in \emptyset$ je za vsak $x$ nepravilna, implikacija z nepravilno predpostavko pa je pravilna. Noben element prazne množice torej ne leži zunaj $A$.
:::

**4. Vennov diagram.** Univerzalno množico narišemo kot pravokotnik, vsako množico pa kot krog ali elipso v njem. Elementi so pike znotraj likov. Dva kroga, ki se delno prekrivata, razdelita pravokotnik na štiri območja: le v $A$, v obeh, le v $B$ in v nobeni od njiju.

**5. Operacije z množicami.** Iz logike poznaš veznike $\wedge$ (in), $\vee$ (ali) in $\neg$ (ne). Operacije z množicami so zgrajene natanko iz njih. Element $x$ spada v novo množico, ko je pravilna izjava v tretjem stolpcu:

| Operacija | Zapis | Pogoj za $x$ | Kateri elementi? |
|---|---|---|---|
| **Unija** | $A \cup B$ | $x \in A \vee x \in B$ | v $A$ ali v $B$ (ali v obeh) |
| **Presek** | $A \cap B$ | $x \in A \wedge x \in B$ | v $A$ in hkrati v $B$ |
| **Razlika** | $A \setminus B$ | $x \in A \wedge x \notin B$ | v $A$, ne pa v $B$ |
| **Komplement** | $A^c$ | $x \in \mathcal{U} \wedge x \notin A$ | iz $\mathcal{U}$, niso v $A$ |

Pri Ani in Bojanu je presek $\{\text{vreme}, \text{igra}\}$, unija ima $5$ elementov, razlika »Ana brez Bojana« pa je $\{\text{glasba}, \text{zemljevid}\}$.

Kje se množice od logike razlikujejo? Prvič, veznik iz dveh izjav naredi izjavo, ki je pravilna (P) ali nepravilna (N). Operacija pa iz dveh množic naredi novo množico. Drugič, negacija ne potrebuje ničesar dodatnega, komplement pa je smiseln šele, ko poznamo $\mathcal{U}$. Tretjič, razlika nima lastnega veznika: je »in« z negacijo.

Komplement pišemo tudi $\overline{A}$ ali $A'$. Besedica »ali« pri uniji je vključujoča, kot v logiki: v uniji so tudi elementi, ki so v obeh množicah. Če je $A \cap B = \emptyset$, sta množici **disjunktni** (tuji): nimata skupnih elementov.

:::premisli
V logiki velja $\neg(A \wedge B) \equiv \neg A \vee \neg B$. Napovej, čemu je za množici enak komplement preseka $(A \cap B)^c$.
---
$(A \cap B)^c = A^c \cup B^c$. Element ni v obeh hkrati natanko tedaj, ko manjka vsaj v eni. Konjunkcija se spremeni v disjunkcijo, presek v unijo.
:::

**6. Pravila (višja raven).**

- Unija in presek sta zamenljiva: $A \cup B = B \cup A$ in $A \cap B = B \cap A$. Razlika pa ne: običajno je $A \setminus B \neq B \setminus A$.
- Razliko lahko zapišemo s komplementom: $A \setminus B = A \cap B^c$.
- Komplement komplementa je prvotna množica: $(A^c)^c = A$.
- Distributivnost: $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$ in $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$.
- De Morganovi pravili: $(A \cup B)^c = A^c \cap B^c$ in $(A \cap B)^c = A^c \cup B^c$. Komplement unije je presek komplementov, komplement preseka pa unija komplementov. To sta De Morganovi pravili iz logike, prepisani za množice.

**7. Štetje elementov.** Za končni množici velja

$$|A \cup B| = |A| + |B| - |A \cap B|.$$

Elemente preseka bi pri vsoti $|A| + |B|$ prešteli dvakrat, zato jih enkrat odštejemo. Če sta množici disjunktni, je $|A \cap B| = 0$ in se moči kar seštejeta. Pri treh množicah je najbolj zanesljivo, da Vennov diagram izpolnjuješ **od sredine navzven**: najprej območje, ki je v vseh treh množicah, nato območja, ki so v natanko dveh, in nazadnje območja, ki so v natanko eni.

## Rešeni primeri

### Primer 1 (lažji)

Dani sta množici $A = \{1, 2, 3, 4, 5, 6\}$ in $B = \{2, 4, 6, 8, 10\}$. Določi $A \cup B$, $A \cap B$, $A \setminus B$ in $B \setminus A$.

**Podatki:** $A = \{1, 2, 3, 4, 5, 6\}$, $B = \{2, 4, 6, 8, 10\}$
**Iščemo:** $A \cup B$, $A \cap B$, $A \setminus B$, $B \setminus A$

:::formula
- $A \cup B$: elementi, ki so v $A$ ali v $B$
- $A \cap B$: elementi, ki so v $A$ in v $B$
- $A \setminus B$: elementi, ki so v $A$, ne pa v $B$
- preverjanje: $|A \cup B| = |A| + |B| - |A \cap B|$
:::

**Rešitev:**

1. Unija: zberemo vse elemente iz obeh množic, vsakega le enkrat: $A \cup B = \{1, 2, 3, 4, 5, 6, 8, 10\}$.
2. Presek: poiščemo elemente, ki jih najdemo v obeh množicah. To so $2$, $4$ in $6$, torej $A \cap B = \{2, 4, 6\}$.
3. Razlika $A \setminus B$: iz $A$ odstranimo elemente, ki so tudi v $B$ (to so $2$, $4$, $6$). Ostane $A \setminus B = \{1, 3, 5\}$.
4. Razlika $B \setminus A$: iz $B$ odstranimo $2$, $4$, $6$. Ostane $B \setminus A = \{8, 10\}$.
5. Preverimo s formulo za moč unije: $|A| = 6$, $|B| = 5$, $|A \cap B| = 3$, zato je $|A \cup B| = 6 + 5 - 3 = 8$. V uniji smo res našteli $8$ elementov.
6. Odgovor: $A \cup B = \{1, 2, 3, 4, 5, 6, 8, 10\}$, $A \cap B = \{2, 4, 6\}$, $A \setminus B = \{1, 3, 5\}$, $B \setminus A = \{8, 10\}$.

### Primer 2 (srednji)

Univerzalna množica je $\mathcal{U} = \{1, 2, 3, \dots, 12\}$. Množica $A$ vsebuje vsa soda števila iz $\mathcal{U}$, množica $B$ pa vse večkratnike števila $3$ iz $\mathcal{U}$. Določi $A \cap B$, $A \cup B$, $(A \cup B)^c$ in $A^c \cap B^c$ ter primerjaj zadnji dve množici.

**Podatki:** $\mathcal{U} = \{1, 2, 3, \dots, 12\}$, $A$ = soda števila iz $\mathcal{U}$, $B$ = večkratniki števila $3$ iz $\mathcal{U}$
**Iščemo:** $A \cap B$, $A \cup B$, $(A \cup B)^c$, $A^c \cap B^c$ in primerjavo zadnjih dveh

:::formula
Komplement: $X^c = \{x \in \mathcal{U} \mid x \notin X\}$. Presek in unija kot običajno.
:::

**Rešitev:**

1. Množici naštejemo: $A = \{2, 4, 6, 8, 10, 12\}$ in $B = \{3, 6, 9, 12\}$.
2. Presek: v obeh sta $6$ in $12$, torej $A \cap B = \{6, 12\}$. To so števila, ki so deljiva z $2$ in s $3$, torej s $6$.
3. Unija: $A \cup B = \{2, 3, 4, 6, 8, 9, 10, 12\}$. Števili $6$ in $12$ zapišemo le enkrat.
4. Komplement unije: iz $\mathcal{U}$ izločimo vse elemente unije, ostanejo $(A \cup B)^c = \{1, 5, 7, 11\}$.
5. Komplementa posebej: $A^c = \{1, 3, 5, 7, 9, 11\}$ in $B^c = \{1, 2, 4, 5, 7, 8, 10, 11\}$. V obeh sta $1$, $5$, $7$ in $11$, torej $A^c \cap B^c = \{1, 5, 7, 11\}$.
6. Primerjava: množici $(A \cup B)^c$ in $A^c \cap B^c$ sta enaki. To je prvo De Morganovo pravilo.
7. Preverimo še s štetjem: $|A \cup B| = 6 + 4 - 2 = 8$, zato je $|(A \cup B)^c| = 12 - 8 = 4$. Res imamo štiri elemente.
8. Odgovor: $A \cap B = \{6, 12\}$, $A \cup B = \{2, 3, 4, 6, 8, 9, 10, 12\}$ in $(A \cup B)^c = A^c \cap B^c = \{1, 5, 7, 11\}$.

### Primer 3 (težji, zdaj ti)

V anketi je vsak dijak povedal, katere vrste aplikacij uporablja vsak dan: za klepet (množica $K$), za kratke videe (množica $V$) ali za glasbo (množica $G$). Vsak uporablja vsaj eno vrsto. Klepet uporablja $22$ dijakov, videe $18$ in glasbo $15$. Klepet in videe uporablja $9$ dijakov, klepet in glasbo $7$, videe in glasbo $6$ (všteti so tudi tisti, ki uporabljajo še tretjo vrsto). Vse tri vrste uporabljajo $3$ dijaki. Koliko dijakov je sodelovalo in koliko jih uporablja natanko eno vrsto?

**Podatki:** $|K| = 22$, $|V| = 18$, $|G| = 15$, $|K \cap V| = 9$, $|K \cap G| = 7$, $|V \cap G| = 6$, $|K \cap V \cap G| = 3$, vsak uporablja vsaj eno vrsto
**Iščemo:** število dijakov $|K \cup V \cup G|$ in število dijakov, ki uporabljajo natanko eno vrsto

:::formula
$|K \cup V \cup G| = |K| + |V| + |G| - |K \cap V| - |K \cap G| - |V \cap G| + |K \cap V \cap G|$. Zanesljiveje: Vennov diagram izpolnjujemo od sredine navzven.
:::

**Rešitev:**

1. Sredina: vse tri vrste uporabljajo $3$ dijaki.
2. Natanko dve vrsti: klepet in videe brez glasbe $9 - 3 = 6$, klepet in glasbo brez videov $7 - 3 = 4$, videe in glasbo brez klepeta $6 - 3 = 3$.
3. Natanko ena vrsta: od vseh v krogu odštejemo že vpisana območja z dvema ali tremi vrstami. Samo klepet $22 - (6 + 4 + 3) = 22 - 13 = 9$, samo videi $18 - (6 + 3 + 3) = 18 - 12 = 6$, samo glasba $15 - (4 + 3 + 3) = 15 - 10 = 5$.
4. Skupaj: $9 + 6 + 5 + 6 + 4 + 3 + 3 = 36$ dijakov.
5. Preverimo s formulo: $22 + 18 + 15 - 9 - 7 - 6 + 3 = 55 - 22 + 3 = 36$.
6. Zdaj ti: iz tretjega koraka izračunaj, koliko dijakov uporablja natanko eno vrsto aplikacij.

:::premisli
Koliko dijakov uporablja natanko eno vrsto aplikacij?
---
$9 + 6 + 5 = 20$. Sodelovalo je $36$ dijakov, natanko eno vrsto aplikacij jih uporablja $20$.
:::

## Pogoste napake

- **Zamenjava znakov $\in$ in $\subseteq$.** Zapišeš $\{2\} \in A$ ali $2 \subseteq A$. Razlog: $\in$ pove, da je nekaj *element* množice, $\subseteq$ pa, da je nekaj *množica znotraj* druge množice. Pravilno: za $A = \{1, 2, 3\}$ zapišemo $2 \in A$ in $\{2\} \subseteq A$. Pred zapisom se vprašaj, ali je levo od znaka element ali množica.
- **Dvojno štetje preseka.** Za moč unije vzameš $|A| + |B|$. Razlog: elementi preseka so v obeh množicah in jih tako prešteješ dvakrat. Pravilno: $|A \cup B| = |A| + |B| - |A \cap B|$. Pri $|A| = 20$, $|B| = 15$ in $|A \cap B| = 6$ je v uniji $29$ elementov, ne $35$.
- **Razlika naj bi bila zamenljiva.** Zapišeš $A \setminus B = B \setminus A$. Razlog: razlika odvzema elemente *prvi* množici, zato vrstni red šteje. Pravilno: za $A = \{1, 2, 3\}$ in $B = \{3, 4\}$ je $A \setminus B = \{1, 2\}$, $B \setminus A = \{4\}$.
- **Komplement brez univerzalne množice.** Računaš $A^c$, ne da bi vedel, v kateri množici $\mathcal{U}$ delaš. Razlog: komplement so elementi iz $\mathcal{U}$, ki niso v $A$, zato je odvisen od $\mathcal{U}$. Pravilno: najprej preberi ali določi $\mathcal{U}$, nato iz nje izloči elemente $A$. Za $A = \{2, 4\}$ je v $\mathcal{U} = \{1, 2, 3, 4\}$ komplement $\{1, 3\}$, v $\mathcal{U} = \{1, \dots, 6\}$ pa $\{1, 3, 5, 6\}$.
- **Prazna množica ni »nič«.** Zapišeš $\emptyset = \{0\}$ ali $|\emptyset| = 1$. Razlog: množica $\{0\}$ ima en element (število nič), prazna množica pa nobenega. Pravilno: $|\emptyset| = 0$, $|\{0\}| = 1$ in tudi $|\{\emptyset\}| = 1$.

## Povzetek

- Množico določajo njeni elementi; zapišemo jo z naštevanjem $\{\dots\}$ ali z lastnostjo $\{x \mid \dots\}$. Velja $a \in A$ ali $a \notin A$.
- $A \subseteq B$ pomeni, da je vsak element množice $A$ tudi v $B$. Vedno velja $A \subseteq A$ in $\emptyset \subseteq A$; množica z $n$ elementi ima $2^n$ podmnožic.
- Operacije: $A \cup B$ (v $A$ ali v $B$), $A \cap B$ (v $A$ in v $B$), $A \setminus B$ (v $A$, ne v $B$), $A^c$ (v $\mathcal{U}$, ne v $A$).
- Množici sta disjunktni, če je $A \cap B = \emptyset$. Razlika ni zamenljiva, unija in presek sta.
- (višja raven) De Morgan: $(A \cup B)^c = A^c \cap B^c$ in $(A \cap B)^c = A^c \cup B^c$.
- Moč unije: $|A \cup B| = |A| + |B| - |A \cap B|$.
- Pri treh množicah izpolnjuješ Vennov diagram od sredine navzven.

## Drugače: Na sliki

Predstavljaj si pravokotnik, ki pomeni $\mathcal{U}$, in v njem dva kroga, ki se delno prekrivata. Krog levo je množica $A$, krog desno množica $B$. Pravokotnik se razdeli na štiri območja:

| Območje na sliki | Kateri elementi so tam | Zapis |
|---|---|---|
| levi krog brez prekrivanja | v $A$, ne v $B$ | $A \setminus B$ |
| prekrivanje (leča v sredini) | v obeh | $A \cap B$ |
| desni krog brez prekrivanja | v $B$, ne v $A$ | $B \setminus A$ |
| pravokotnik zunaj obeh krogov | v nobeni | $(A \cup B)^c$ |

Vsaka operacija je pobarvanje nekaj teh območij. Unija pobarva oba kroga v celoti, to je tri območja. Presek pobarva samo lečo. Razlika $A \setminus B$ pobarva levi krog brez leče. Komplement $A^c$ pobarva vse, kar je zunaj levega kroga: desni krog brez leče in zunanje območje.

Zdaj lahko De Morganovo pravilo preprosto *vidiš*. Množica $(A \cup B)^c$ je zunanje območje. Množica $A^c \cap B^c$ je tisto, kar je hkrati zunaj levega in zunaj desnega kroga, torej spet zunanje območje. Če je $A \subseteq B$, leži krog $A$ cel znotraj kroga $B$. Disjunktni množici sta kroga, ki se ne prekrivata. Pri treh krogih nastane sedem območij znotraj krogov in osmo zunaj njih.

## Drugače: Iz vsakdanjega življenja

Pomisli na iskanje po spletu ali na filtre v spletni trgovini. Vsak filter določa množico izdelkov, vezniki pa so operacije z množicami:

- »kolo **in** rabljeno« je presek množic: izdelki, ki so kolesa in so rabljeni,
- »kolo **ali** skiro« je unija: izdelki, ki so kolesa ali skiroji,
- »kolo **ne** električno« je razlika: kolesa, od katerih odvzameš električna.

Nov filter, dodan z »in«, števila zadetkov nikoli ne poveča: presek je del vsake od množic, iz katerih nastane.

Galerija na telefonu deluje enako. »Videi s tega leta« so presek dveh množic, »fotografije brez lokacije« pa komplement v množici vseh fotografij.

## Preveri se

? Na Vennovem diagramu z dvema krogoma, $A$ levo in $B$ desno, je osenčen le del levega kroga, ki ne leži v desnem. Kateri zapis ustreza osenčenemu delu?
- $A \cap B$
~ Presek je samo prekrivanje obeh krogov, ta pa ni osenčen.
- $B \setminus A$
~ Razlika ni zamenljiva: $B \setminus A$ je del desnega kroga zunaj levega.
+ $A \setminus B$
- $B^c$
~ Komplement $B^c$ zajema tudi območje zunaj obeh krogov, ki ni osenčeno.
> Osenčeni so elementi, ki so v $A$, niso pa v $B$. To je razlika $A \setminus B = A \cap B^c$.

? V razredu je $30$ dijakov. Kolo ima $25$ dijakov, smuči $20$. Najmanj koliko dijakov ima oboje?
- $0$
~ Množici bi bili lahko disjunktni le, če bi bilo $25 + 20$ največ $30$. Ker je $45 > 30$, se morata prekrivati.
- $20$
~ To je največ, kolikor jih lahko ima oboje: tedaj ima vsak s smučmi tudi kolo.
+ $15$
- $45$
~ To je $|A| + |B|$, ki presek šteje dvakrat. V razredu sploh ni $45$ dijakov.
> Naj bo $A$ množica dijakov s kolesom, $B$ pa s smučmi. V uniji je največ $30$ dijakov, zato je $|A \cap B| = |A| + |B| - |A \cup B| \ge 25 + 20 - 30 = 15$.

? Zakaj v formuli $|A \cup B| = |A| + |B| - |A \cap B|$ odštejemo $|A \cap B|$?
- Ker je unija vedno manjša od vsote moči.
~ Pri disjunktnih množicah je unija enaka vsoti. Odšteti moramo natanko presek, ne poljubnega števila.
+ Ker vsota $|A| + |B|$ elemente preseka šteje dvakrat.
- Ker odštejemo elemente, ki niso v nobeni od množic.
~ Elementi zunaj obeh množic niso všteti ne v $|A|$ ne v $|B|$, zato jih ni treba odšteti.
- Ker je $A \cap B$ enako $A \setminus B$.
~ Presek in razlika sta različni množici: prvi so elementi v obeh, drugi elementi samo v $A$.
> Vsak element preseka je v $A$ in v $B$, zato ga vsota $|A| + |B|$ prešteje dvakrat. Enkrat ga odštejemo.

? Naj bo $A = \{1, 2, 3\}$. Za katero množico $B$ velja $A \cup B = \{1, 2, 3, 4, 5\}$ in $A \cap B = \{3\}$?
- $\{4, 5\}$
~ Potem bi bil presek $A \cap B = \emptyset$. Število $3$ mora biti tudi v $B$.
+ $\{3, 4, 5\}$
- $\{1, 2, 3, 4, 5\}$
~ Unija bi bila prava, presek pa bi bil cela množica $A = \{1, 2, 3\}$.
- $\{3\}$
~ Presek bi bil pravi, unija pa le $\{1, 2, 3\}$, brez $4$ in $5$.
> $B$ mora vsebovati $4$ in $5$ (zaradi unije) in $3$ (zaradi preseka), ne sme pa vsebovati $1$ in $2$. Torej $B = \{3, 4, 5\}$.

? Telefon ima v galeriji $120$ fotografij. Med priljubljene jih je označenih $45$, lokacijo jih ima $30$, oboje pa $12$. Koliko fotografij ni priljubljenih in nima lokacije?
- $45$
~ Izračunal si $120 - 45 - 30$ in fotografije z obema oznakama odštel dvakrat.
- $63$
~ To je število fotografij z vsaj eno oznako, torej unija. Vprašanje sprašuje po njenem komplementu.
+ $57$
- $75$
~ To so fotografije, ki niso priljubljene. Med njimi jih ima nekaj lokacijo.
> Unija: $45 + 30 - 12 = 63$. Komplement v $\mathcal{U}$ s $120$ fotografijami: $120 - 63 = 57$.

:::simboli
A, B | množici | | | moč množice je število njenih elementov
x | element množice | | |
X | poljubna množica | | |
c | oznaka komplementa (v $A^c$) | | | elementi univerzalne množice, ki niso v $A$
K | dijaki, ki uporabljajo aplikacije za klepet | | | Primer 3
V | dijaki, ki uporabljajo aplikacije za kratke videe | | | Primer 3
G | dijaki, ki uporabljajo aplikacije za glasbo | | | Primer 3
:::
