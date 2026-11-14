---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tu je trditev, ki na prvi pogled zveni napačno. Vzemi poljubno kvadratno matriko $A$. Iz nje izračunaj polinom $p_A(\lambda) = \det(\lambda I - A)$. Nato v ta polinom namesto števila $\lambda$ vstavi kar matriko $A$. Dobiš **ničelno matriko**. Vedno, za vsako matriko.

Druga presenetljivost: dve matriki imata lahko popolnoma enak tak polinom, pa se ena da diagonalizirati, druga pa ne. Polinom, ki pozna vse lastne vrednosti, torej ne pove vsega.

Obe dejstvi imata praktično posledico. Farmakologi opisujejo pot zdravila po telesu z matriko: koliko zdravila v eni uri ostane v krvi, koliko preide v tkivo in koliko ga ledvice izločijo. Količino čez $10$ ur dobiš z matriko $A^{10}$. Ta lekcija pokaže, zakaj za to ne potrebuješ desetih množenj matrik in kako iz enega polinoma razbereš, ali model lepo razpade na neodvisne »načine izločanja«.

## Razlaga

**Model: zdravilo v krvi in tkivu.** Zdravilo je v krvi ali v tkivu. V eni uri ostane v krvi polovica zdravila iz krvi, petina preide v tkivo, ostalo se izloči. Iz tkiva se desetina vrne v kri, $60\,\%$ ostane v tkivu, ostalo telo razgradi. Če je $x = (k, t)$ količina v krvi in tkivu, je količina čez eno uro $Ax$, kjer je

$$A = \begin{pmatrix} 0{,}5 & 0{,}1 \\ 0{,}2 & 0{,}6 \end{pmatrix}.$$

Lastne vrednosti že znaš iskati: rešiš $\det(\lambda I - A) = 0$.

$$\det\begin{pmatrix} \lambda - 0{,}5 & -0{,}1 \\ -0{,}2 & \lambda - 0{,}6 \end{pmatrix} = \lambda^2 - 1{,}1\lambda + 0{,}28.$$

Koeficient pri $\lambda$ je minus sled ($0{,}5 + 0{,}6 = 1{,}1$), prosti člen je determinanta ($0{,}30 - 0{,}02 = 0{,}28$). Ničli sta $0{,}7$ in $0{,}4$.

**Karakteristični polinom.** Za matriko $A$ velikosti $n \times n$ je
$$p_A(\lambda) = \det(\lambda I - A).$$
To je **moničen** polinom stopnje $n$: vodilni koeficient je $1$. Njegove ničle so natanko lastne vrednosti. Kolikokrat se ničla ponovi, je njena **algebraična večkratnost**. Nekateri učbeniki pišejo $\det(A - \lambda I)$; ta se razlikuje za faktor $(-1)^n$, ničle pa so iste.

**Vstavimo matriko.** Ali je $A^2 - 1{,}1A + 0{,}28I = 0$? To je isto vprašanje kot: ali je $A^2 = 1{,}1A - 0{,}28I$?

| | $A^2$ | $1{,}1A - 0{,}28I$ |
|---|---|---|
| 1. vrstica | $0{,}27 \quad 0{,}11$ | $0{,}27 \quad 0{,}11$ |
| 2. vrstica | $0{,}22 \quad 0{,}38$ | $0{,}22 \quad 0{,}38$ |

Stolpca tabele se ujemata, zato $p_A(A) = 0$. To ni naključje.

**Cayley-Hamiltonov izrek.** Za vsako kvadratno matriko $A$ velja $p_A(A) = 0$.

Posledica za model: $A^2 = 1{,}1A - 0{,}28I$. Vsako višjo potenco lahko tako znižaš, dokler ne ostane le kombinacija $A$ in $I$. Pri matriki $2 \times 2$ je tako vsaka potenca $A^k$ določena z le dvema številoma: koeficientoma pri $A$ in $I$.

:::premisli
Zakaj ne smeš sklepati $p_A(A) = \det(AI - A) = \det(0) = 0$?
---
Ker je $p_A(A)$ matrika, $\det(\ldots)$ pa število. Zamenjava $\lambda \to A$ znotraj determinante ni dovoljena: v $\lambda I - A$ stoji $\lambda$ kot skalar ob vsakem elementu. Sklep je pravilen, ta »dokaz« pa ne.
:::

**Minimalni polinom.** Če $p_A(A) = 0$, se morda da $A$ uničiti (dobiti ničelno matriko) že s polinomom nižje stopnje. **Minimalni polinom** $m_A$ je moničen polinom najmanjše stopnje, za katerega je $m_A(A) = 0$. Iz deljenja polinomov z ostankom sledi:

- $m_A$ deli vsak polinom $q$ z $q(A) = 0$, torej tudi $p_A$;
- $m_A$ in $p_A$ imata **iste ničle**, le večkratnosti v $m_A$ so lahko manjše.

Druga točka velja, ker iz $Av = \mu v$ sledi $m_A(A)v = m_A(\mu)v$; leva stran je $0$, $v \ne 0$, zato $m_A(\mu) = 0$.

Pri modelu zdravila je $p_A = (\lambda - 0{,}7)(\lambda - 0{,}4)$. Kandidati za $m_A$ so delitelji $p_A$ z obema ničlama; tak je le $p_A$ sam. Zato $m_A = p_A$.

**Diagonalizabilnost.** Kriterij, ki ga bomo uporabljali:

> $A$ je diagonalizabilna natanko tedaj, ko $m_A$ razpade na **različne** linearne faktorje (vsaka ničla je enostavna).

Model zdravila je diagonalizabilen. V bazi lastnih vektorjev razpade na dva neodvisna načina: eden upada s faktorjem $0{,}7$ na uro, drugi s faktorjem $0{,}4$. Dolgoročno prevlada počasnejši, $0{,}7^n$.

**Shema postopka** (od podatkov do sklepa):

```
A
→ p_A = det(λI − A)
→ razcep na linearne faktorje
→ kandidati za m_A
  (delitelji z vsemi ničlami)
→ najnižji kandidat q, q(A) = 0:
  to je m_A
→ same enostavne ničle?
  da: diagonalizabilna
  ne: ni diagonalizabilna
```

:::premisli
Matrika $3 \times 3$ ima $p_A = (\lambda - 1)(\lambda - 2)(\lambda - 5)$. Ali moraš sploh računati $m_A$, da veš, ali je diagonalizabilna?
---
Ne. Ničle $p_A$ so že različne, $m_A$ pa ima iste ničle in deli $p_A$, zato $m_A = p_A$ z enostavnimi ničlami. Matrika je diagonalizabilna. Računati moraš le, ko se kakšna ničla ponovi.
:::

## Rešeni primeri

### Primer 1: polinom in inverz brez Gaussa

Dana je matrika $M = \begin{pmatrix} 4 & 1 \\ 2 & 3 \end{pmatrix}$. Izračunaj $p_M$, preveri Cayley-Hamiltonov izrek in z njim izrazi $M^{-1}$.

**Podatki:** $M = \begin{pmatrix} 4 & 1 \\ 2 & 3 \end{pmatrix}$
**Iščemo:** $p_M(\lambda)$, preverbo $p_M(M) = 0$ in $M^{-1}$

:::formula
Za $2 \times 2$: $p_M(\lambda) = \lambda^2 - (\operatorname{sl} M)\lambda + \det M$; Cayley-Hamilton: $p_M(M) = 0$
:::

**Rešitev:**

1. Sled: $4 + 3 = 7$. Determinanta: $4 \cdot 3 - 1 \cdot 2 = 10$.
2. Zato $p_M(\lambda) = \lambda^2 - 7\lambda + 10 = (\lambda - 2)(\lambda - 5)$.
3. $M^2 = \begin{pmatrix} 18 & 7 \\ 14 & 11 \end{pmatrix}$ in $7M - 10I = \begin{pmatrix} 18 & 7 \\ 14 & 11 \end{pmatrix}$, torej $M^2 - 7M + 10I = 0$.
4. Preuredimo: $M(7I - M) = 10I$, ker je $M^2 - 7M = -10I$.
5. Zato $M^{-1} = \dfrac{1}{10}(7I - M) = \dfrac{1}{10}\begin{pmatrix} 3 & -1 \\ -2 & 4 \end{pmatrix}$.
6. Odgovor: $p_M = (\lambda - 2)(\lambda - 5)$, izrek velja, $M^{-1} = \frac{1}{10}\begin{pmatrix} 3 & -1 \\ -2 & 4 \end{pmatrix}$.

### Primer 2: isti $p$, različna usoda

Primerjaj matriki
$$B = \begin{pmatrix} 2 & 1 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 3 \end{pmatrix}, \quad C = \begin{pmatrix} 2 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 3 \end{pmatrix}.$$
Določi minimalna polinoma in ugotovi, katera je diagonalizabilna.

**Podatki:** matriki $B$ in $C$ zgoraj
**Iščemo:** $m_B$, $m_C$ in diagonalizabilnost

:::formula
$m$ deli $p$ in ima iste ničle; diagonalizabilna $\iff$ $m$ ima same enostavne ničle
:::

**Rešitev:**

1. Obe sta zgornje trikotni, zato $p_B = p_C = (\lambda - 2)^2(\lambda - 3)$.
2. Kandidata za minimalni polinom: $(\lambda - 2)(\lambda - 3)$ in $(\lambda - 2)^2(\lambda - 3)$.
3. Pri $C$: $(C - 2I)(C - 3I) = \operatorname{diag}(0,0,1)\cdot\operatorname{diag}(-1,-1,0) = 0$. Zato $m_C = (\lambda - 2)(\lambda - 3)$.
4. Pri $B$: prva vrstica $B - 2I$ je $(0, 1, 0)$, zato je prva vrstica produkta kar druga vrstica $B - 3I$, to je $(0, -1, 0)$. Element $(1,2)$ produkta je $-1 \ne 0$.
5. Nižji kandidat odpade, zato $m_B = (\lambda - 2)^2(\lambda - 3)$.
6. Odgovor: $C$ je diagonalizabilna (že je diagonalna), $B$ ni, ker ima $m_B$ dvojno ničlo $2$.

### Primer 3: zdravilo po treh urah

Bolnik dobi v žilo $100\,\mathrm{mg}$ zdravila, v tkivu ga sprva ni. Prehodna matrika na uro je $A = \begin{pmatrix} 0{,}5 & 0{,}1 \\ 0{,}2 & 0{,}6 \end{pmatrix}$ iz razlage. Brez računanja $A^3$ z množenjem matrik določi, koliko zdravila je v krvi in koliko v tkivu po $3$ urah.

**Podatki:** $x_0 = (100, 0)\,\mathrm{mg}$, $A$ zgoraj, $p_A = \lambda^2 - 1{,}1\lambda + 0{,}28$, čas $3\,\mathrm{h}$
**Iščemo:** $x_3 = A^3 x_0$

:::formula
Cayley-Hamilton: $A^2 = 1{,}1A - 0{,}28I$, zato $A^3 = A \cdot A^2$
:::

**Rešitev:**

1. $A^3 = 1{,}1A^2 - 0{,}28A$; vstavimo $A^2$: $A^3 = 1{,}1(1{,}1A - 0{,}28I) - 0{,}28A$.
2. Uredimo: $1{,}21 - 0{,}28 = 0{,}93$ in $1{,}1 \cdot 0{,}28 = 0{,}308$, torej $A^3 = 0{,}93A - 0{,}308I$.
3. $Ax_0 = (50, 20)$, ker je to $100$-kratnik prvega stolpca $A$.
4. $x_3 = 0{,}93 \cdot (50, 20) - 0{,}308 \cdot (100, 0) = (46{,}5 - 30{,}8;\ 18{,}6)$.
5. $46{,}5 - 30{,}8 = 15{,}7$.
6. Odgovor: po treh urah je v krvi $15{,}7\,\mathrm{mg}$, v tkivu $18{,}6\,\mathrm{mg}$ zdravila. Za $A^{10}$ bi ponavljal isti korak znižanja, množiti matrik ne bi bilo treba.

### Primer 4: zdaj ti

Je matrika $D = \begin{pmatrix} 1 & 1 \\ -1 & 3 \end{pmatrix}$ diagonalizabilna?

**Podatki:** $D = \begin{pmatrix} 1 & 1 \\ -1 & 3 \end{pmatrix}$
**Iščemo:** $m_D$ in odgovor o diagonalizabilnosti

:::formula
$p_D(\lambda) = \lambda^2 - (\operatorname{sl} D)\lambda + \det D$; preveri najnižjega kandidata za $m_D$
:::

**Rešitev:**

1. $\operatorname{sl} D = 4$, $\det D = 3 + 1 = 4$, zato $p_D = \lambda^2 - 4\lambda + 4 = (\lambda - 2)^2$.
2. Edina lastna vrednost je $2$. Kandidata: $\lambda - 2$ in $(\lambda - 2)^2$.
3. Preveri sam, ali je $D - 2I = 0$, in sklepaj.

:::premisli
Kaj je $m_D$ in ali je $D$ diagonalizabilna?
---
$D - 2I = \begin{pmatrix} -1 & 1 \\ -1 & 1 \end{pmatrix} \ne 0$, zato $m_D = (\lambda - 2)^2$. Ničla je dvojna, $D$ ni diagonalizabilna. (Edina diagonalizabilna matrika z edino lastno vrednostjo $2$ je $2I$.)
:::

## Pogoste napake

- **»Isti karakteristični polinom, isto obnašanje.«** Primer 2 pokaže, da $B$ in $C$ delita $p$, a je le $C$ diagonalizabilna. Polinom $p_A$ pove lastne vrednosti, ne pa, kako so lastni vektorji razporejeni. Odloča $m_A$.
- **»Ponovljena lastna vrednost pomeni, da matrika ni diagonalizabilna.«** Identiteta ima $p = (\lambda - 1)^n$ in je diagonalna. Ponovljena ničla v $p_A$ je le opozorilo, da je treba izračunati $m_A$.
- **»Dokaz« z $\det(AI - A) = 0$.** Mešaš število in matriko. Pravi dokaz je v razdelku »Bolj natančno«.
- **Minimalni polinom brez kakšne lastne vrednosti.** Nekdo za $B$ predlaga $m_B = (\lambda - 2)^2$, ker »$3$ je tako ali tako enostavna«. Vendar ima $m_A$ vedno vse ničle $p_A$; $(B - 2I)^2 \ne 0$, saj je element $(3,3)$ enak $1$.
- **Napačen predznak pri $2 \times 2$.** Prosti člen je $+\det A$, linearni člen je $-\operatorname{sl} A$. Kdor zamenja predznak, dobi napačne lastne vrednosti.

## Povzetek

- $p_A(\lambda) = \det(\lambda I - A)$ je moničen, stopnje $n$; ničle so lastne vrednosti. Za $2 \times 2$: $\lambda^2 - (\operatorname{sl} A)\lambda + \det A$.
- Cayley-Hamilton: $p_A(A) = 0$. Z njim znižaš potence ($A^k$ kot kombinacija $I, A, \ldots, A^{n-1}$) in izraziš $A^{-1}$, če $\det A \ne 0$.
- Minimalni polinom $m_A$: moničen, najmanjše stopnje, $m_A(A) = 0$. Deli $p_A$ in ima iste ničle.
- $A$ je diagonalizabilna natanko tedaj, ko ima $m_A$ same enostavne ničle (in razpade na linearne faktorje).
- Isti $p_A$ ne zagotavlja iste diagonalizabilnosti.

## Drugače: Z analogijo

Predstavljaj si, da $A - \mu I$ deluje kot »filter«, ki iz vektorja odstrani vse, kar pripada lastni vrednosti $\mu$.

Pri diagonalizabilni matriki je vsak vektor vsota lastnih vektorjev. Vsak filter $A - \mu I$ svoj sloj (komponento za $\mu$) odstrani v enem prehodu. Ko vsak filter uporabiš enkrat, ne ostane nič. Zato $m_A = (\lambda - \mu_1)\cdots(\lambda - \mu_k)$.

Pri matriki $B$ iz Primera 2 je drugače, podobno kot pri tableti z oblogo. Prvi prehod skozi $B - 2I$ pošlje $e_2$ v $e_1$: odstrani oblogo, jedro pa ostane. Šele drugi prehod pošlje $e_1$ v $0$. Zato potrebuješ $(\lambda - 2)^2$. Eksponent v $m_A$ pove, kako dolga je najdaljša taka »veriga plasti« za dano lastno vrednost.

Karakteristični polinom pa le prešteje plasti, ne pa, kako so zložene. Zato je pri $B$ in $C$ enak.

## Drugače: Bolj natančno

**Dokaz Cayley-Hamiltonovega izreka.** Naj bo $\operatorname{adj}(X)$ prirejenka, za katero velja $X \operatorname{adj}(X) = \det(X) I$. Za $X = \lambda I - A$ so elementi $\operatorname{adj}(\lambda I - A)$ polinomi stopnje največ $n - 1$, zato
$$\operatorname{adj}(\lambda I - A) = B_0 + B_1\lambda + \cdots + B_{n-1}\lambda^{n-1}$$
s konstantnimi matrikami $B_i$. Naj bo $p_A(\lambda) = \lambda^n + c_{n-1}\lambda^{n-1} + \cdots + c_0$. Iz $(\lambda I - A)\operatorname{adj}(\lambda I - A) = p_A(\lambda)I$ primerjamo koeficiente:
$$-AB_0 = c_0 I,\quad B_{k-1} - AB_k = c_k I,\quad B_{n-1} = I.$$
Enačbo pri $\lambda^k$ pomnožimo z leve z $A^k$ in vse seštejemo. Leva stran se teleskopsko odšteje v $0$, desna je $p_A(A)$.

**Minimalni polinom deli vsak anihilator.** Naj bo $q(A) = 0$. Delimo: $q = s\,m_A + r$, $\deg r < \deg m_A$. Tedaj $r(A) = q(A) - s(A)m_A(A) = 0$. Ker je $m_A$ najmanjše stopnje, je $r = 0$.

**Kriterij diagonalizabilnosti.** Če $m_A = (\lambda - \mu_1)\cdots(\lambda - \mu_k)$ z različnimi $\mu_i$, je po lemi o jedrih (za tuje si polinome) $V = \ker(A - \mu_1 I) \oplus \cdots \oplus \ker(A - \mu_k I)$, torej obstaja baza iz lastnih vektorjev. Obratno: če je $A = PDP^{-1}$, polinom $\prod(\lambda - \mu_i)$ po različnih diagonalnih elementih uniči $D$, torej tudi $A$; zato ga $m_A$ deli in ima same enostavne ničle.

Nad $\mathbb{R}$ mora $m_A$ še razpasti na linearne faktorje: rotacija za $90^\circ$ ima $m = \lambda^2 + 1$ in nad $\mathbb{R}$ ni diagonalizabilna, nad $\mathbb{C}$ pa je.

## Preveri se

? Zdravnica opiše presnovo z matriko $A$. Kolega pravi: »Minimalni polinom te matrike je $(\lambda - 0{,}7)(\lambda - 0{,}4)$.« Kaj s tem trdi?
- Da sta $0{,}7$ in $0{,}4$ edini števili na diagonali matrike $A$.
~ Diagonala ne določa lastnih vrednosti pri polni matriki. Minimalni polinom govori o tem, kateri polinom uniči $A$.
+ Da je to moničen polinom najmanjše stopnje, ki da $m(A) = 0$.
- Da je to polinom, katerega vrednost pri $\lambda = A$ je determinanta $A$.
~ Vstavljanje matrike da matriko, ne števila. Pri minimalnem polinomu je rezultat ničelna matrika.
> Minimalni polinom je moničen polinom najmanjše stopnje z $m_A(A) = 0$. Ker ima tu enostavne ničle, je model diagonalizabilen.

? V kakšnem vrstnem redu ugotoviš, ali je matrika z dvojno lastno vrednostjo diagonalizabilna?
- Najprej preveri, ali je $p_A(A) = 0$, nato izračunaj $p_A$.
~ $p_A(A) = 0$ velja vedno (Cayley-Hamilton), zato ta preverba nič ne pove.
+ Izračunaj $p_A$, razstavi ga, preveri najnižjega kandidata za $m_A$, sklepaj iz večkratnosti ničel $m_A$.
- Razstavi $p_A$ in iz dvojne ničle takoj sklepaj, da ni diagonalizabilna.
~ Dvojna ničla v $p_A$ ne zadošča: $\operatorname{diag}(2,2,3)$ ima dvojno ničlo in je diagonalna.
> Odločilen je $m_A$. Do njega prideš iz razcepa $p_A$ in preverbe kandidatov od najnižjega navzgor.

? Matrika $C = \operatorname{diag}(2, 2, 3)$ ima $m_C = (\lambda - 2)(\lambda - 3)$. Kaj se zgodi, če na mesto $(1,2)$ namesto $0$ zapišemo $1$?
- Nič: diagonala je ista, zato sta $p$ in $m$ ista.
~ $p$ res ostane isti, $m$ pa ne. Novi element poveže $e_2$ z $e_1$.
- Spremenita se lastni vrednosti.
~ Matrika ostane zgornje trikotna, lastne vrednosti so še vedno elementi diagonale.
+ $m$ postane $(\lambda - 2)^2(\lambda - 3)$ in matrika ni več diagonalizabilna.
> To je matrika $B$ iz Primera 2: $(B - 2I)(B - 3I) \ne 0$, zato je v $m_B$ ničla $2$ dvojna.

? Kolikšen je karakteristični polinom matrike $\begin{pmatrix} 1 & 2 \\ 3 & 0 \end{pmatrix}$?
- $\lambda^2 + \lambda - 6$
~ Linearni člen je minus sled. Sled je $1$, zato $-\lambda$.
+ $\lambda^2 - \lambda - 6$
- $\lambda^2 - \lambda + 6$
~ Prosti člen je $\det A = 0 - 6 = -6$; produkt izvendiagonalnih elementov se odšteje.
> Sled $1$, determinanta $1 \cdot 0 - 2 \cdot 3 = -6$, torej $p = \lambda^2 - \lambda - 6 = (\lambda - 3)(\lambda + 2)$.

? Matrika $A$ ima $p_A = \lambda^2 - 5\lambda + 6$. Kako se izraža $A^3$?
- $25A - 30I$
~ Pozabil si člen $-6A$ iz $A^3 = 5A^2 - 6A$.
- $125A - 216I$
~ Koeficientov ne kubiramo; potenco znižujemo korak za korakom z $A^2 = 5A - 6I$.
+ $19A - 30I$
> $A^3 = 5A^2 - 6A = 5(5A - 6I) - 6A = 19A - 30I$.

:::simboli
A | kvadratna matrika
\lambda | spremenljivka polinoma (lastna vrednost) | | | ničle karakterističnega polinoma so lastne vrednosti
p_A | karakteristični polinom matrike A | p_A(\lambda) = \det(\lambda I - A)
I | identična (enotska) matrika
n | velikost matrike (stopnja polinoma)
c_0, c_k | koeficienti karakterističnega polinoma | | | p_A(λ) = λⁿ + cₙ₋₁λⁿ⁻¹ + … + c₀
B, C | matriki iz primera
B_0, B_1, B_k, B_{k-1}, B_{n-1} | matrični koeficienti adjungiranke adj(λI − A) | | | v dokazu Cayley-Hamiltonovega izreka
M | matrika iz primera
p_M | karakteristični polinom matrike M
m | minimalni polinom | | | deli p in ima iste ničle
p | karakteristični polinom
D | matrika, katere diagonalizabilnost preverjamo
p_D | karakteristični polinom matrike D | p_D(\lambda) = \lambda^2 - (\operatorname{sl} D)\lambda + \det D
m_D | minimalni polinom matrike D
:::
