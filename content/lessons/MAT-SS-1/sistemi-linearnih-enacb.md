---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Poišči zunanji termometer z dvema lestvicama, v stopinjah Celzija in v stopinjah Fahrenheita (takih je na balkonih veliko), ali preberi vremensko napoved v obeh enotah. Zapiši si nekaj parov: $0\,°\text{C}$ je $32\,°\text{F}$, $10\,°\text{C}$ je $50\,°\text{F}$, $20\,°\text{C}$ je $68\,°\text{F}$. Število v °F je tu vedno večje. Ali obstaja temperatura, pri kateri kažeta obe lestvici **isto število**?

Iz parov opaziš vzorec: vsakih $10\,°\text{C}$ prinese $18\,°\text{F}$ več, torej vsaka stopinja Celzija $1{,}8\,°\text{F}$, začne pa se pri $32\,°\text{F}$. Zato je $y = 1{,}8x + 32$, kjer je $x$ temperatura v °C in $y$ v °F. Iščemo par, za katerega velja še $y = x$. Dve enačbi, ki morata veljati **hkrati**, sestavljata **sistem dveh linearnih enačb z dvema neznankama**. Sistemi se pojavijo povsod, kjer iščeš dve količini iz dveh podatkov: pri mešanicah, cenah, hitrostih, pri presečišču dveh premic in pozneje v fiziki in kemiji.

## Razlaga

**1. Iskanje para, ki ustreza obema enačbama.** Vzemimo enačbi $x + y = 6$ in $y = 2x$. Vsaka ima veliko rešitev, zato za nekaj vrednosti $x$ izračunajmo $y$ iz vsake posebej:

| $x$ | $y$ iz $x + y = 6$ | $y$ iz $y = 2x$ |
|---|---|---|
| $0$ | $6$ | $0$ |
| $1$ | $5$ | $2$ |
| $2$ | $4$ | $4$ |
| $3$ | $3$ | $6$ |

V stolpcu za $x + y = 6$ vrednost $y$ pada, v stolpcu za $y = 2x$ raste. Le pri $x = 2$ se ujemata: par $(2, 4)$ ustreza obema enačbama. Takemu paru rečemo **rešitev sistema**. Splošna oblika sistema je

$$\begin{cases} a_1x + b_1y = c_1 \\ a_2x + b_2y = c_2 \end{cases}$$

kjer so $a_1, b_1, c_1, a_2, b_2, c_2$ znana števila. **Rešitev sistema** je urejen par števil $(x, y)$, ki hkrati ustreza prvi in drugi enačbi. Ena sama enačba ima neskončno mnogo rešitev, sistem pa običajno natanko eno.

**2. Grafična metoda.** Pari iz vsakega stolpca ležijo na premici, saj je vsaka linearna enačba z dvema neznankama (če $a$ in $b$ nista oba $0$) enačba premice. Skupni par je točka, ki leži na obeh premicah. Zato:

- iz vsake enačbe izrazimo $y$ (če ni že tako), npr. $x + y = 6$ postane $y = 6 - x$,
- narišemo obe premici (dovolj sta po dve točki, za natančnost vzamemo tri),
- rešitev sistema so koordinate **presečišča** premic, ker je presečišče edina točka, ki leži na obeh premicah.

Grafična metoda je nazorna, a ni vedno natančna: če je presečišče pri necelih številih, ga iz risbe le ocenimo. Zato vedno naredimo **preizkus** z vstavljanjem v obe enačbi.

**3. Zamenjalna metoda.** V tabeli smo $y$ iz druge enačbe pravzaprav že poznali: $y = 2x$. Če ta izraz **zamenjamo** namesto $y$ v prvi enačbi, dobimo $x + 2x = 6$, torej $3x = 6$ in $x = 2$, nato $y = 2 \cdot 2 = 4$. Brez tabele in brez risbe. Postopek:

1. Iz ene enačbe izrazimo eno neznanko (najraje tisto s koeficientom $1$ ali $-1$, da ni deljenja).
2. Dobljeni izraz vstavimo v *drugo* enačbo. Nastane enačba z eno neznanko.
3. Rešimo jo.
4. Rešitev vstavimo v izraženo neznanko in izračunamo še drugo.
5. Preizkus v obeh prvotnih enačbah.

:::premisli
Pri kateri temperaturi kažeta obe lestvici iz uvoda isto število? Napovej, ali je to nad ali pod lediščem, nato reši sistem $y = 1{,}8x + 32$, $y = x$ z zamenjavo.
---
Pod lediščem. Vstavimo $y = x$ v prvo enačbo: $x = 1{,}8x + 32$, torej $-0{,}8x = 32$ in $x = -40$. Pri $-40\,°\text{C}$ termometer kaže tudi $-40\,°\text{F}$. Tako mrzlo je npr. pozimi v Sibiriji.
:::

**4. Metoda nasprotnih koeficientov.** Seštej levi in desni strani enačb $x + y = 9$ in $x - y = 3$: dobiš $2x = 12$. Neznanka $y$ je izginila, ker sta $+y$ in $-y$ skupaj $0$. Iz $x = 6$ sledi še $y = 3$.

Pri $3x + y = 7$ in $x + y = 3$ pa vsota $4x + 2y = 10$ ne pomaga. Drugo enačbo zato najprej pomnožimo z $-1$: $-x - y = -3$. Zdaj imamo $+y$ in $-y$, vsota da $2x = 4$, torej $x = 2$ in $y = 1$. Vzorec: neznanka izpade, ko ima v obeh enačbah **nasprotna koeficienta**. Postopek:

1. Enačbi uredimo v obliko $ax + by = c$.
2. Eno ali obe enačbi pomnožimo s takim številom, različnim od $0$ (vsak člen, tudi desno stran!), da bosta imeli pri isti neznanki **nasprotna koeficienta**, npr. $+6x$ in $-6x$.
3. Enačbi seštejemo. Ta neznanka izpade.
4. Rešimo enačbo z eno neznanko.
5. Dobljeno vrednost vstavimo v katero koli od prvotnih enačb in izračunamo drugo neznanko.
6. Preizkus.

:::premisli
Zakaj smemo enačbi sploh sešteti? Ali se s tem rešitev sistema ne spremeni?
---
Ne spremeni se. Za rešitev $(x, y)$ sta obe enačbi resnični enakosti števil. Če enakim številom prištejemo enaki števili, dobimo spet enakost. Zato rešitev sistema ustreza tudi vsoti enačb.
:::

Metodi zamenjave in nasprotnih koeficientov sta enakovredni: obe dasta isto rešitev. Zamenjava je praktična, kadar je v kateri enačbi neznanka že sama (npr. $y = 2x - 1$), nasprotni koeficienti pa, kadar sta enačbi v obliki $ax + by = c$.

**5. Koliko rešitev ima sistem?** V simulaciji spodaj »Sistem dveh enačb grafično« sta premici $y = k_1x + n_1$ in $y = k_2x + n_2$. Nastavi $k_1 = k_2$, nato spreminjaj $n_2$. Preden premakneš drsnik, napovej: koliko skupnih točk imata premici pri $n_1 \ne n_2$ in koliko pri $n_1 = n_2$? Premici v ravnini imata natanko eno od treh leg, zato so možni trije primeri:

| Lega premic | Število rešitev | Kako se pokaže pri računanju |
|---|---|---|
| sekata se | natanko ena | dobimo konkretno vrednost za $x$ in za $y$ |
| vzporedni sta | nobene | pride protislovje, npr. $0 = 5$ |
| sovpadata | neskončno mnogo | pride enakost, ki vedno velja, npr. $0 = 0$ |

Primer vzporednih premic: $x + y = 3$ in $2x + 2y = 8$. Če prvo pomnožimo z $-2$ in seštejemo, dobimo $0 = 2$, kar je nemogoče, zato rešitve ni. Primer sovpadanja: $x + y = 3$ in $2x + 2y = 6$. Druga enačba je le dvakratnik prve, zato dobimo $0 = 0$ in vsak par $(x, 3 - x)$ je rešitev.

**6. Ekvivalentna preoblikovanja.** Rešitve sistema ne spremenimo, če eno enačbo pomnožimo s številom, različnim od $0$, ali če eno enačbo nadomestimo z vsoto obeh enačb (drugo pa obdržimo). Na tem temelji metoda nasprotnih koeficientov.

## Rešeni primeri

### Primer 1 (lažji)

Grafično reši sistem enačb $y = x + 1$ in $x + y = 5$.

**Podatki:** prva enačba $y = x + 1$, druga enačba $x + y = 5$

**Iščemo:** par $(x, y)$, ki ustreza obema enačbama (presečišče premic)

:::formula
Rešitev sistema so koordinate presečišča premic, ki ju določata enačbi.
:::

**Rešitev:**

1. Iz druge enačbe izrazimo $y$: $y = 5 - x$.
2. Tabela točk za prvo premico $y = x + 1$: pri $x = 0$ je $y = 1$, pri $x = 2$ je $y = 3$, pri $x = 3$ je $y = 4$.
3. Tabela točk za drugo premico $y = 5 - x$: pri $x = 0$ je $y = 5$, pri $x = 2$ je $y = 3$, pri $x = 5$ je $y = 0$.
4. Obe premici narišemo. Prva narašča, druga pada, zato se sekata. Skupna točka obeh tabel in presečišče na risbi je $(2, 3)$: pri $x = 2$ je $x + 1 = 3$ in $5 - x = 3$.
5. Preizkus: $y = x + 1$ da $3 = 2 + 1$, kar velja. $x + y = 5$ da $2 + 3 = 5$, kar velja.
6. Odgovor: rešitev sistema je $x = 2$, $y = 3$, torej par $(2, 3)$.

### Primer 2 (srednji)

Z zamenjalno metodo reši sistem $2x + y = 11$ in $3x - 2y = 6$.

**Podatki:** prva enačba $2x + y = 11$, druga enačba $3x - 2y = 6$

**Iščemo:** števili $x$ in $y$, ki ustrezata obema enačbama

:::formula
Iz ene enačbe izrazimo neznanko (npr. $y = 11 - 2x$) in jo vstavimo v drugo enačbo.
:::

**Rešitev:**

1. Iz prve enačbe izrazimo $y$: $y = 11 - 2x$.
2. Vstavimo v drugo enačbo: $3x - 2(11 - 2x) = 6$.
3. Odpremo oklepaj: $3x - 22 + 4x = 6$, torej $7x - 22 = 6$.
4. $7x = 28$, od tod $x = 4$.
5. Vstavimo v izraz za $y$: $y = 11 - 2 \cdot 4 = 11 - 8 = 3$.
6. Preizkus: $2 \cdot 4 + 3 = 11$ velja, $3 \cdot 4 - 2 \cdot 3 = 12 - 6 = 6$ velja.
7. Odgovor: $x = 4$, $y = 3$.

### Primer 3 (težji)

Naravovarstvenik na travniku ob reki prešteje štorklje in srne. Skupaj imajo $14$ glav in $44$ nog. Koliko je štorkelj in koliko srn?

**Podatki:** število glav $14$, število nog $44$; štorklja ima $2$ nogi, srna $4$

**Iščemo:** število štorkelj $x$ in število srn $y$

:::formula
Sistem: $x + y = 14$ (glave) in $2x + 4y = 44$ (noge). Prvo enačbo pomnožimo z $-2$, da dobimo nasprotna koeficienta pri $x$.
:::

**Rešitev:**

1. Vsaka žival ima eno glavo, zato $x + y = 14$. Štorklje prinesejo $2x$ nog, srne $4y$, zato $2x + 4y = 44$.
2. Prvo enačbo pomnožimo z $-2$ (vse člene): $-2x - 2y = -28$.
3. Enačbi seštejemo, $x$ izpade: $2y = 16$, torej $y = 8$.
4. Zdaj ti: izračunaj še $x$ in naredi preizkus z nogami.

:::premisli
Koliko je štorkelj? Ali se noge res ujemajo?
---
Iz $x + 8 = 14$ sledi $x = 6$. Preizkus: $2 \cdot 6 + 4 \cdot 8 = 12 + 32 = 44$ nog, kar velja. Odgovor: na travniku je $6$ štorkelj in $8$ srn.
:::

## Pogoste napake

- **Pomnožiš le del enačbe.** Če enačbo $5x - 4y = -3$ pomnožiš z $2$ in zapišeš $10x - 4y = -3$, si pomnožil samo prvi člen. Razlog: pozabil si, da množimo *obe strani* enačbe, torej vsak člen. Pravilno: $10x - 8y = -6$.
- **Napačen predznak pri odštevanju enačb.** Pri odštevanju $(6x + 4y) - (5x - 4y)$ pogosto zapišeš $x + 0y$, pravilno pa je $x + 8y$, ker odštevaš tudi negativni člen. Razlog: minus pred oklepajem spremeni predznak vsakemu členu. Zato raje množi z negativnim številom in enačbi **seštej**.
- **Vstaviš v isto enačbo, iz katere si izrazil neznanko.** Če iz $y = 2x - 1$ vstaviš nazaj v isto enačbo, dobiš $0 = 0$ in nič ne izveš. Razlog: izraz že vsebuje vso informacijo prve enačbe. Pravilno: izraženo neznanko vstavi v *drugo* enačbo.
- **Izračunaš samo eno neznanko.** Rešitev sistema je par $(x, y)$. Ko dobiš $x$, moraš izračunati še $y$ in na koncu preveriti, ali par ustreza *obema* enačbama. Preizkus samo v eni enačbi ne zadošča.
- **Iz risbe odčitaš le približno.** Pri grafični metodi lahko točko $(2{,}1; 2{,}9)$ zamenjaš z $(2, 3)$. Razlog: premici ne narišemo popolnoma natančno. Zato odčitano rešitev vedno vstavi v obe enačbi.

## Povzetek

- Sistem dveh linearnih enačb: $\begin{cases} a_1x + b_1y = c_1 \\ a_2x + b_2y = c_2 \end{cases}$. Rešitev je par $(x, y)$, ki ustreza obema enačbama.
- Grafično: vsaka enačba je premica, rešitev je presečišče. Vedno naredi preizkus.
- Zamenjava: izrazi eno neznanko, vstavi v drugo enačbo, reši, izračunaj še drugo neznanko.
- Nasprotni koeficienti: pomnoži (vse člene), da dobiš $+k$ in $-k$ pri isti neznanki, seštej, reši, vstavi nazaj.
- Premici se sekata (ena rešitev), sta vzporedni (nobene rešitve, npr. $0 = 2$) ali sovpadata (neskončno rešitev, $0 = 0$).
- Preizkus: rešitev vstavi v obe prvotni enačbi.

## Ponovitev

**Formule**
- $\begin{cases} a_1x + b_1y = c_1 \\ a_2x + b_2y = c_2 \end{cases}$, rešitev je par $(x, y)$ (na pamet)
- zamenjava: izrazi $y = \ldots$ in vstavi v drugo enačbo (na pamet)
- nasprotna koeficienta $k$ in $-k$: enačbi seštej (na pamet)
- $0 = 2$: ni rešitve, premici sta vzporedni (na pamet)
- $0 = 0$: neskončno rešitev, premici sovpadata (na pamet)

**Postopek**
1. Izberi metodo: zamenjava ali nasprotni koeficienti.
2. Pomnoži enačbo (vse člene), da dobiš $k$ in $-k$.
3. Enačbi seštej in reši enačbo z eno neznanko.
4. Vstavi nazaj in izračunaj še drugo neznanko.
5. Naredi preizkus v obeh prvotnih enačbah.

**Pazi na**
- Pomnoži vsak člen: $5x - 4y = -3$ krat $2$ je $10x - 8y = -6$.
- Odštevanje spremeni znak vsem členom: raje množi z negativnim številom in seštej.
- Izraženo neznanko vstavi v drugo enačbo, ne v isto.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Reši sistem enačb $4x - 3y = 5$ in $2x + 5y = 9$.

**Rešitev:**

1. Drugo enačbo pomnožimo z $-2$: $-4x - 10y = -18$.
2. Seštejemo jo s prvo enačbo, $x$ izpade: $-13y = -13$, torej $y = 1$.
3. Vstavimo v prvo enačbo: $4x - 3 = 5$, torej $4x = 8$ in $x = 2$.
4. Preizkus: $4 \cdot 2 - 3 \cdot 1 = 5$ in $2 \cdot 2 + 5 \cdot 1 = 9$.
5. Odgovor: $(x, y) = (2, 1)$.

**Točkovanje:** 1 točka za enačbo z eno neznanko ($-13y = -13$ ali enakovredno), 1 točka za $y = 1$, 1 točka za $x = 2$.

### Naloga 2: krajša strukturirana naloga, 6 točk, pola 2 (z računalom)

Na šolski prireditvi so prodali $236$ vstopnic. Vstopnica za dijake je stala $3{,}50\,\text{€}$, za odrasle pa $6{,}80\,\text{€}$. Skupaj so iztržili $1103{,}20\,\text{€}$.

a) Z $x$ označi število prodanih vstopnic za dijake, z $y$ pa za odrasle. Zapiši sistem enačb, ki opisuje podatke. (2 točki)
b) Reši sistem in zapiši, koliko vstopnic posamezne vrste so prodali. (2 točki)
c) Kolikšen delež iztržka so prinesle vstopnice za odrasle? Rezultat zapiši v odstotkih, zaokroženo na eno decimalko. (2 točki)

**Rešitev:**

1. a) Število vstopnic: $x + y = 236$.
2. a) Iztržek: $3{,}5x + 6{,}8y = 1103{,}2$.
3. b) Iz prve enačbe $x = 236 - y$, vstavimo v drugo: $3{,}5(236 - y) + 6{,}8y = 1103{,}2$, torej $826 + 3{,}3y = 1103{,}2$.
4. b) $3{,}3y = 277{,}2$, zato $y = 84$ in $x = 236 - 84 = 152$.
5. b) Preizkus: $3{,}5 \cdot 152 + 6{,}8 \cdot 84 = 532 + 571{,}2 = 1103{,}2$.
6. c) Vstopnice za odrasle so prinesle $6{,}8 \cdot 84 = 571{,}20\,\text{€}$.
7. c) Delež: $\dfrac{571{,}2}{1103{,}2} \approx 0{,}51777$, torej približno $51{,}8\,\%$.
8. Odgovor: prodali so $152$ vstopnic za dijake in $84$ vstopnic za odrasle; vstopnice za odrasle so prinesle približno $51{,}8\,\%$ iztržka.

**Točkovanje:** a) 1 točka za enačbo za število vstopnic, 1 točka za enačbo za iztržek; b) 1 točka za enačbo z eno neznanko (ali enakovreden korak eliminacije), 1 točka za $x = 152$ in $y = 84$; c) 1 točka za $571{,}20\,\text{€}$; 1 točka za $51{,}8\,\%$.

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Dan je sistem enačb s parametroma $m$ in $p$:

$$\begin{cases} 2x - y = 3 \\ mx + 2y = p \end{cases}$$

a) Reši sistem za $m = 3$ in $p = 1$. (2 točki)
b) Pokaži, da iz sistema sledi enačba $(m + 4)x = p + 6$, in ugotovi, za katere vrednosti $m$ ima sistem natanko eno rešitev. (3 točke)
c) Naj bo $m = -4$. Za katero vrednost $p$ ima sistem neskončno mnogo rešitev? Zapiši vse rešitve v tem primeru. Koliko rešitev ima sistem pri drugih vrednostih $p$? (3 točke)
d) V isti koordinatni sistem nariši premici, ki ju določata enačbi sistema pri $m = -4$ in $p = 2$. Z risbo pojasni, koliko rešitev ima sistem. (2 točki)

**Rešitev:**

1. a) Pri $m = 3$ in $p = 1$ je druga enačba $3x + 2y = 1$. Iz prve enačbe izrazimo $y = 2x - 3$ in vstavimo: $3x + 4x - 6 = 1$, torej $7x = 7$ in $x = 1$.
2. a) $y = 2 \cdot 1 - 3 = -1$. Preizkus: $3 \cdot 1 + 2 \cdot (-1) = 1$. Rešitev je $(1, -1)$.
3. b) Prvo enačbo pomnožimo z $2$: $4x - 2y = 6$. Prištejemo jo drugi enačbi, $y$ izpade: $(m + 4)x = p + 6$.
4. b) Če je $m + 4 \ne 0$, je $x = \dfrac{p + 6}{m + 4}$ natanko določen, iz prve enačbe pa še $y = 2x - 3$. Sistem ima natanko eno rešitev za vsak $m \ne -4$ (pri poljubnem $p$).
5. b) Geometrijsko: prva premica ima smerni koeficient $2$, druga $-\dfrac{m}{2}$; ta sta različna natanko pri $m \ne -4$, takrat se premici sekata.
6. c) Pri $m = -4$ dobimo $0 \cdot x = p + 6$. Ta enačba velja za vsak $x$ natanko tedaj, ko je $p = -6$.
7. c) Pri $p = -6$ je druga enačba $-4x + 2y = -6$, kar je $-2$-kratnik prve; enačbi opisujeta isto premico. Rešitve so vsi pari $(t, 2t - 3)$, kjer je $t$ poljubno realno število.
8. c) Pri $m = -4$ in $p \ne -6$ dobimo protislovje $0 = p + 6 \ne 0$, zato sistem nima rešitve.
9. d) Premici sta $y = 2x - 3$ (skozi točki $(0, -3)$ in $(2, 1)$) in iz $-4x + 2y = 2$ premica $y = 2x + 1$ (skozi točki $(0, 1)$ in $(1, 3)$).
10. d) Obe imata smerni koeficient $2$, os $y$ pa sekata v različnih točkah, zato sta vzporedni in različni. Skupne točke nimata, sistem nima rešitve.
11. Odgovor: a) $(1, -1)$; b) natanko ena rešitev za $m \ne -4$; c) pri $p = -6$ neskončno rešitev $(t, 2t - 3)$, $t \in \mathbb{R}$, pri $p \ne -6$ nobene; d) vzporedni premici, sistem nima rešitve.

**Točkovanje:** a) 1 točka za $x = 1$, 1 točka za $y = -1$; b) 1 točka za izpeljavo enačbe $(m + 4)x = p + 6$, 1 točka za utemeljitev, da je pri $m + 4 \ne 0$ rešitev ena, 1 točka za odgovor $m \ne -4$; c) 1 točka za $p = -6$, 1 točka za zapis rešitev $(t, 2t - 3)$, 1 točka za ugotovitev, da pri $p \ne -6$ rešitve ni; d) 1 točka za pravilno narisani premici, 1 točka za sklep, da sta premici vzporedni in sistem nima rešitve.

### Ustno vprašanje 1

:::premisli
Koliko rešitev ima lahko sistem dveh linearnih enačb z dvema neznankama? Pojasni z lego premic.
---
Vsaka linearna enačba z dvema neznankama, pri kateri koeficienta pri neznankah nista oba enaka $0$, določa premico v ravnini, rešitev sistema pa je skupna točka obeh premic. Če se premici sekata, ima sistem natanko eno rešitev, to je presečišče. Če sta premici vzporedni in različni, sistem nima rešitve, pri računanju pa dobimo protislovje, na primer $0 = 2$. Če premici sovpadata, ima sistem neskončno mnogo rešitev, pri računanju pa dobimo enakost $0 = 0$.
:::

### Ustno vprašanje 2

:::premisli
Utemelji, zakaj se množica rešitev sistema ne spremeni, če eno enačbo nadomestimo z vsoto obeh enačb.
---
Drugo enačbo nadomestimo z vsoto obeh, prvo pa obdržimo. Naj par $(x, y)$ ustreza obema prvotnima enačbama, za ta par sta obe enačbi resnični enakosti števil. Če enakostima seštejemo leve in desne strani, dobimo spet enakost, zato par ustreza tudi vsoti enačb in je rešitev novega sistema. Obratno: če par ustreza prvi enačbi in vsoti, ustreza tudi razliki vsote in prve enačbe, to pa je druga enačba. Stari in novi sistem imata zato isto množico rešitev; na tem temelji metoda nasprotnih koeficientov.
:::

### Ustno vprašanje 3

:::premisli
Opiši zamenjalno metodo za reševanje sistema dveh linearnih enačb in povej, kdaj je primerna.
---
Iz ene enačbe izrazimo eno neznanko, najraje tisto s koeficientom $1$ ali $-1$. Dobljeni izraz vstavimo v drugo enačbo, da dobimo enačbo z eno neznanko, in jo rešimo. Dobljeno vrednost vstavimo v izraženo neznanko in izračunamo še drugo neznanko. Na koncu naredimo preizkus v obeh prvotnih enačbah. Metoda je primerna predvsem takrat, ko je v kateri od enačb neznanka že izražena ali ima koeficient $1$ ali $-1$.
:::

## Drugače: Kot zgodba

Po dolgem pohodu na Veliko planino se Tina ustavi v koči. Za mizo ob oknu je naročila dva kroasana in eno kavo za $5\,\text{€}$, prijatelj pa en kroasan in dve kavi za $5{,}50\,\text{€}$. Računa ne vidita podrobno, Tino pa zanima, koliko stane kroasan in koliko kava.

Tina razmišlja brez črk. »Če bi prijatelj naročil dvakrat toliko, bi imel dva kroasana in štiri kave za $11\,\text{€}$.« To primerja s svojim naročilom: dva kroasana in ena kava za $5\,\text{€}$. Kroasanov je enako, kav pa je pri podvojenem naročilu tri več. Naročili se razlikujeta za $11 - 5 = 6\,\text{€}$, torej tri kave stanejo $6\,\text{€}$ in ena kava $2\,\text{€}$. Njena dva kroasana potem staneta $5 - 2 = 3\,\text{€}$, en kroasan $1{,}50\,\text{€}$.

Točno to počneš z metodo nasprotnih koeficientov: naročilo »povečaš« (pomnožiš enačbo) in dve naročili primerjaš, da ti ena količina izpade. Preizkus pri prijatelju: $1{,}50 + 2 \cdot 2 = 5{,}50$ velja.

## Drugače: Korak za korakom s številkami

Reši sistem $3x + 2y = 7$ in $5x - 4y = -3$ z nasprotnimi koeficienti.

1. Izberemo, da bo izpadel $y$: koeficienta sta $2$ in $-4$. Prvo enačbo pomnožimo z $2$.
2. $2 \cdot (3x + 2y) = 2 \cdot 7$, torej $6x + 4y = 14$. Druge enačbe ne spreminjamo: $5x - 4y = -3$.
3. Pri $y$ imamo zdaj $+4y$ in $-4y$. Enačbi seštejemo: $6x + 5x = 11x$, $4y - 4y = 0$, $14 + (-3) = 11$.
4. Dobimo $11x = 11$, torej $x = 1$.
5. Vstavimo v prvo prvotno enačbo: $3 \cdot 1 + 2y = 7$, torej $2y = 4$ in $y = 2$.
6. Preizkus v prvi enačbi: $3 + 4 = 7$ velja. V drugi: $5 \cdot 1 - 4 \cdot 2 = 5 - 8 = -3$ velja.
7. Odgovor: $(x, y) = (1, 2)$.

Če bi izbral, da izpade $x$, bi imel več dela (prvo enačbo bi moral pomnožiti s $5$, drugo z $-3$). Zato si vedno ogledaj koeficiente in izberi neznanko, pri kateri je množenje najkrajše.

## Preveri se

? Kakšna slika ustreza sistemu, ki nima nobene rešitve?
- Premici se sekata v eni točki.
~ Presečišče je skupna točka, torej rešitev. Tak sistem ima natanko eno rešitev.
+ Premici sta vzporedni in različni.
- Premici sovpadata.
~ Pri sovpadanju je vsaka točka premice skupna, zato je rešitev neskončno mnogo.
> Rešitev je točka na obeh premicah. Vzporedni različni premici nimata skupne točke, pri računanju pa dobiš protislovje, npr. $0 = 2$.

? Premici $y = 2x$ in $y = -x + 10$ narišemo. Približno kje je presečišče?
- blizu $(7, 3)$
~ Koordinati sta zamenjani. Prva premica ima $y$ dvakrat večji od $x$.
- blizu $(10, 0)$
~ To je ničla druge premice. Prva premica pri $x = 10$ ni na višini $0$, ampak $20$.
+ blizu $(3, 7)$
> Iz $2x = -x + 10$ sledi $x = \dfrac{10}{3} \approx 3{,}3$ in $y \approx 6{,}7$. Presečišče je pri necelih številih, zato ga iz risbe le ocenimo.

? Zakaj enačbi pri metodi nasprotnih koeficientov seštejemo šele, ko imata pri isti neznanki nasprotna koeficienta?
- Ker sicer vsota enačb ni več pravilna enačba.
~ Vsota dveh enačb je vedno pravilna, a v njej ostaneta obe neznanki.
+ Ker se takrat ta neznanka pri seštevanju izniči in ostane enačba z eno neznanko.
- Ker morata imeti obe enačbi enake vse koeficiente.
~ Enaki koeficienti niso potrebni. Pomembno je le, da sta pri eni neznanki nasprotna, npr. $+3y$ in $-3y$.
> Pri $+3y$ in $-3y$ je vsota $0 \cdot y$, zato ostane le druga neznanka. Takšno enačbo že znaš rešiti.

? (brez računala) Par $(2, -1)$ je rešitev sistema $x + y = 1$ in $3x + by = 8$. Kolikšen je $b$?
= -2 | 0,01
~ 2 | Namesto $y = -1$ si vstavil $y = 1$: $6 + b = 8$. Pazi na predznak.
~ -14 | Število $6$ si prenesel na drugo stran brez spremembe predznaka: $-b = 8 + 6$.
> Vstavimo $x = 2$ in $y = -1$: $3 \cdot 2 + b \cdot (-1) = 8$, torej $6 - b = 8$ in $b = -2$. Prva enačba je izpolnjena: $2 + (-1) = 1$.

? (brez računala) V dveh deževnih dneh je padlo skupaj $30\,\text{mm}$ padavin, drugi dan $8\,\text{mm}$ več kot prvi. Koliko je padlo prvi dan?
= 11 mm | 0,01
~ 19 | To je količina drugega dne. Vprašanje sprašuje po prvem.
~ 22 | Od $30$ si odštel $8$ in dobil $2x = 22$, nato pa pozabil deliti z $2$.
~ 15 | Vsoto si razdelil na pol, kot da bi oba dneva padlo enako.
> Sistem $x + y = 30$ in $y - x = 8$. Seštejemo: $2y = 38$, $y = 19$, nato $x = 30 - 19 = 11$. Preizkus: $19 - 11 = 8$ velja.

:::simboli
x, y | neznanki (v primeru 3 število štorkelj in srn) | | |
a_1, b_1, a_2, b_2 | koeficienti pri neznankah | | |
c_1, c_2 | desni strani enačb | | |
a, b | koeficienta pri $x$ in $y$ v obliki $ax + by = c$ | | |
c | desna stran v obliki $ax + by = c$ | | |
k_1, k_2 | smerna koeficienta premic v simulaciji | | |
n_1, n_2 | začetni vrednosti premic v simulaciji | | |
m, p | parametra v sistemu (realni števili) | | |
t | poljubno realno število v zapisu neskončno mnogo rešitev | | |
:::

<<RACUN
resi: 4*x-3*y=5, 2*x+5*y=9 | x, y | x=2, y=1
resi: x+y=236, 3.5*x+6.8*y=1103.2 | x, y | x=152, y=84
vrednost: 3.5*236 | 826
vrednost: 6.8*84 | 571.2
vrednost: 571.2/1103.2*100 | 51.78
resi: 2*x-y=3, 3*x+2*y=1 | x, y | x=1, y=-1
enako: 2*(2*x-y)+(m*x+2*y) | (m+4)*x
resi: -m/2=2 | m | -4
enako: 2*t-(2*t-3) | 3
enako: -4*t+2*(2*t-3) | -6
resi: 2*x-y=3, -4*x+2*y=2 | x, y | none
resi: -4*x+2*y=2 | y | 2*x+1
>>
