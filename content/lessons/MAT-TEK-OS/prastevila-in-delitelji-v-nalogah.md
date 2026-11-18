---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Na telefonu imaš aplikacijo, ki zapiska, ko nad tvojim krajem preleti satelit. Satelit A preleti vsakih $90$ minut, satelit B vsakih $120$ minut. Ob $20.00$ zapiskata oba hkrati. Kdaj bosta spet zapiskala skupaj?

To je naloga o **najmanjšem skupnem večkratniku**, ki ga poznaš iz šole. Na tekmovanju pa števila niso tako prijazna. Kdaj se spet poravnata planeta, ki obkrožita zvezdo v $84$ in $90$ dneh? Koliko deliteljev ima $360$? Katero je najmanjše število z natanko $12$ delitelji? Z naštevanjem bi porabil pol ure, z **razcepom na prafaktorje** pa dve minuti. Ta lekcija pokaže, kako.

## Razlaga

**Stara pot: naštevanje.** Pri satelitih zapišemo večkratnike obeh števil:

- $90$: $90, 180, 270, 360, \dots$
- $120$: $120, 240, 360, \dots$

Prvi skupni je $360$. Satelita bosta spet zapiskala skupaj čez $360$ minut, to je čez $6$ ur, ob $2.00$ ponoči. Za majhna števila je ta pot povsem dobra.

Pri planetih s $84$ in $90$ dnevi pa bi morali našteti $15$ večkratnikov števila $84$, preden bi prišli do skupnega. Pri štirimestnih številih naštevanje sploh ne pride v poštev. Potrebujemo pot, ki ne raste s številom.

**Nova pot: razcep.** **Praštevilo** je naravno število z natanko dvema deliteljema, z $1$ in s samim seboj: $2, 3, 5, 7, 11, 13, \dots$ Število $1$ ima samo en delitelj, zato **ni** praštevilo. Vsako naravno število, večje od $1$, lahko zapišemo kot produkt praštevil na en sam način (vrstni red ne šteje). Temu pravimo **razcep na prafaktorje**:

- $90 = 2 \cdot 45 = 2 \cdot 3 \cdot 15 = 2 \cdot 3^2 \cdot 5$
- $120 = 2 \cdot 60 = 2^2 \cdot 30 = 2^3 \cdot 3 \cdot 5$

V simulaciji spodaj, »Razcep na prafaktorje«, razcepi $360$ večkrat z gumbom »Razcepi drugače«. Drevo je vsakič drugačno, na koncu pa so vedno isti prafaktorji: $2^3 \cdot 3^2 \cdot 5$.

**Prva razlika: D in v brez naštevanja.** Z $D(a, b)$ označimo največji skupni delitelj, z $v(a, b)$ pa najmanjši skupni večkratnik števil $a$ in $b$. Razcepa obeh števil postavimo enega pod drugega. Za vsak prafaktor primerjamo potenci:

| | $2$ | $3$ | $5$ |
|---|---|---|---|
| $90$ | $2^1$ | $3^2$ | $5^1$ |
| $120$ | $2^3$ | $3^1$ | $5^1$ |
| $D$: manjša potenca | $2^1$ | $3^1$ | $5^1$ |
| $v$: večja potenca | $2^3$ | $3^2$ | $5^1$ |

Skupni delitelj lahko vsebuje le toliko dvojk, kolikor jih imata **obe** števili, zato vzamemo manjšo potenco: $D(90, 120) = 2 \cdot 3 \cdot 5 = 30$. Skupni večkratnik mora vsebovati dovolj dvojk za **vsako** od števil, zato vzamemo večjo: $v(90, 120) = 2^3 \cdot 3^2 \cdot 5 = 360$. Enak rezultat kot pri naštevanju, le da smo šli naravnost na cilj.

Iz tabele vidiš še nekaj: pri vsakem prafaktorju gre ena potenca v $D$, druga pa v $v$. Zato velja $D \cdot v = a \cdot b$. Res: $30 \cdot 360 = 10800$ in $90 \cdot 120 = 10800$. Če števili nimata skupnih prafaktorjev, jima pravimo **tuji** števili. Takrat je $D = 1$ in $v = a \cdot b$.

**Druga razlika: število deliteljev.** Stara pot je iskanje parov. Delitelji števila $36$ so v parih, ki dajo zmnožek $36$: $1 \cdot 36$, $2 \cdot 18$, $3 \cdot 12$, $4 \cdot 9$ in $6 \cdot 6$. Vsak par je pravokotnik iz $36$ kvadratkov. Deliteljev je $9$.

:::premisli
Zakaj ima $36$ liho število deliteljev, $35$ pa sodo? Napovej, preden nadaljuješ.
---
Delitelji gredo v pare, ki se zmnožijo v število. Pri $36$ je en par $6 \cdot 6$, ki da samo en delitelj, zato je deliteljev liho mnogo. Pri $35$ ($1 \cdot 35$, $5 \cdot 7$) so vsi pari iz dveh različnih števil. Liho število deliteljev imajo natanko popolni kvadrati.
:::

V simulaciji spodaj, »Delitelji kot pravokotniki«, nastavi število na $36$ in nato na $35$. Opazi, da se med pravokotniki pri $36$ pojavi kvadrat, pri $35$ pa ne.

Nova pot gre prek razcepa. Vzemimo $72 = 2^3 \cdot 3^2$. Vsak delitelj je oblike $2^i \cdot 3^j$, kjer je $i$ eno od števil $0, 1, 2, 3$ in $j$ eno od števil $0, 1, 2$. Razporedimo jih v tabelo:

| | $3^0$ | $3^1$ | $3^2$ |
|---|---|---|---|
| $2^0$ | $1$ | $3$ | $9$ |
| $2^1$ | $2$ | $6$ | $18$ |
| $2^2$ | $4$ | $12$ | $36$ |
| $2^3$ | $8$ | $24$ | $72$ |

Vrstic je $4$, ker ima dvojka eksponent $3$ in štejemo tudi eksponent $0$. Stolpcev je $3$. Deliteljev je $4 \cdot 3 = 12$. Splošno: če je $n = p^a \cdot q^b \cdot r^c$, ima $n$ natanko $(a + 1)(b + 1)(c + 1)$ deliteljev.

:::premisli
Katero število ima več deliteljev: $128 = 2^7$ ali $210 = 2 \cdot 3 \cdot 5 \cdot 7$? Napovej, nato preštej s formulo.
---
Več jih ima $210$. Število $128$ ima $7 + 1 = 8$ deliteljev, $210$ pa $2 \cdot 2 \cdot 2 \cdot 2 = 16$. Veliko različnih prafaktorjev prinese več deliteljev kot ena sama velika potenca.
:::

**Tretja razlika: ali je število praštevilo.** Stara pot bi bila deljenje z vsemi manjšimi števili. Delitelji pa so v parih in v vsakem paru je manjši delitelj največ $\sqrt{n}$. Zato zadošča preizkusiti praštevila do $\sqrt{n}$. Pri $91$ je $\sqrt{91} \approx 9{,}5$, preizkusimo $2$, $3$, $5$ in $7$. Ker je $91 = 7 \cdot 13$, $91$ ni praštevilo, čeprav je na prvi pogled videti kot praštevilo.

## Rešeni primeri

### Primer 1 (lažji): deli kroga na zvezdni karti

Astronomka izdeluje vrtljivo zvezdno karto. Rob karte, poln kot $360°$, želi razdeliti na enake dele, ki merijo cele stopinje. Tudi en sam del $360°$ šteje. Koliko možnosti ima?

**Podatki:** poln kot $360°$, deli so enaki in merijo cele stopinje
**Iščemo:** število možnih razdelitev, to je število deliteljev števila $360$

:::formula
Če je $n = p^a \cdot q^b \cdot r^c$, ima $n$ natanko $(a + 1)(b + 1)(c + 1)$ deliteljev.
:::

**Rešitev:**

1. Število delov mora deliti $360$, sicer del ne meri celih stopinj. Iščemo torej število deliteljev.
2. Razcep: $360 = 2^3 \cdot 3^2 \cdot 5$.
3. Za vsak prafaktor prištejemo $1$, ker je eksponent v delitelju lahko tudi $0$: $(3 + 1)(2 + 1)(1 + 1) = 24$.
4. Odgovor: astronomka ima $24$ možnosti, od enega dela s $360°$ do $360$ delov po $1°$.

### Primer 2: poravnava planetov

Okrog zvezde krožita dva planeta. Prvi naredi en obhod v $84$ dneh, drugi v $90$ dneh. Danes sta oba na isti premici z zvezdo, na isti strani. Čez koliko dni bosta prvič spet tako? Kolikšen je še $D(84, 90)$?

**Podatki:** obhodni čas prvega planeta $84$ dni, drugega $90$ dni, danes sta poravnana
**Iščemo:** $v(84, 90)$ v dneh in $D(84, 90)$

:::formula
$D$: vsak skupni prafaktor z manjšo potenco. $v$: vsak prafaktor z večjo potenco. Preizkus: $D \cdot v = a \cdot b$.
:::

**Rešitev:**

1. Razcepa: $84 = 2^2 \cdot 3 \cdot 7$ in $90 = 2 \cdot 3^2 \cdot 5$.
2. $D$ vzame le skupna prafaktorja $2$ in $3$ z manjšima potencama: $D = 2 \cdot 3 = 6$.
3. $v$ vzame vse prafaktorje z večjimi potencami: $v = 2^2 \cdot 3^2 \cdot 5 \cdot 7 = 1260$.
4. Preizkus: $6 \cdot 1260 = 7560$ in $84 \cdot 90 = 7560$. Ujema se.
5. Prvi planet do takrat naredi $1260 : 84 = 15$ obhodov, drugi $1260 : 90 = 14$.
6. Odgovor: planeta bosta spet poravnana čez $1260$ dni. Velja $D(84, 90) = 6$.

### Primer 3 (težji): posadka z dvanajstimi razporedi

Poveljnica vesoljske postaje želi posadko, ki jo lahko razdeli v enako velike ekipe na natanko $12$ načinov. Šteje tudi ena ekipa z vsemi in ekipe po eno osebo. Najmanj koliko ljudi mora imeti posadka?

**Podatki:** število ljudi ima natanko $12$ deliteljev, iščemo najmanjše tako število
**Iščemo:** najmanjše naravno število z natanko $12$ delitelji

:::formula
Število deliteljev je $(a + 1)(b + 1)(c + 1)\cdots$. Večje eksponente damo manjšim praštevilom.
:::

**Rešitev:**

1. Obrnemo formulo: $12$ zapišemo kot produkt faktorjev, večjih od $1$. Možnosti so $12$, $6 \cdot 2$, $4 \cdot 3$ in $3 \cdot 2 \cdot 2$.
2. Vsak faktor je eksponent plus $1$. Da bo število čim manjše, dobi največji eksponent najmanjše praštevilo $2$, naslednji $3$ in tako naprej.
3. $12$: eksponent $11$, število $2^{11} = 2048$.
4. $6 \cdot 2$: eksponenta $5$ in $1$, število $2^5 \cdot 3 = 96$.
5. $4 \cdot 3$: eksponenta $3$ in $2$, število $2^3 \cdot 3^2 = 72$.
6. $3 \cdot 2 \cdot 2$: eksponenti $2$, $1$, $1$, število $2^2 \cdot 3 \cdot 5 = 60$.
7. Najmanjše med njimi je $60$. Preizkus: $(2 + 1)(1 + 1)(1 + 1) = 12$.
8. Odgovor: posadka mora imeti najmanj $60$ ljudi.

### Primer 4 – zdaj ti

Za različni naravni števili $a$ in $b$ velja $D(a, b) = 12$ in $v(a, b) = 72$. Nobeno od njiju ni enako $12$ ali $72$. Kateri sta?

**Podatki:** $D(a, b) = 12$, $v(a, b) = 72$, $a \ne b$, $a$ in $b$ nista $12$ ali $72$
**Iščemo:** števili $a$ in $b$

:::formula
$D$ ima manjšo, $v$ večjo potenco vsakega prafaktorja. Pri vsakem prafaktorju ima eno število potenco iz $D$, drugo pa iz $v$.
:::

**Rešitev:**

1. Razcepa: $12 = 2^2 \cdot 3$ in $72 = 2^3 \cdot 3^2$.
2. Pri dvojki ima eno število $2^2$, drugo $2^3$. Pri trojki ima eno število $3^1$, drugo $3^2$.
3. Če ima isto število obe manjši potenci, dobimo par $12$ in $72$, ki ga naloga izključi. Sestavi drugi par sam.

:::premisli
Kateri sta števili $a$ in $b$?
---
Eno število dobi $2^2$ in $3^2$, drugo $2^3$ in $3^1$: to sta $36$ in $24$. Preizkus: $D(24, 36) = 12$, $v(24, 36) = 72$ in $24 \cdot 36 = 12 \cdot 72$.
:::

## Pogoste napake

- **Pozabljeni $+1$.** »$72 = 2^3 \cdot 3^2$, torej ima $3 \cdot 2 = 6$ deliteljev.« Eksponent v delitelju je lahko tudi $0$ (delitelj $1$ nima nobene dvojke), zato ima dvojka $4$ možnosti, ne $3$. Pravilno: $4 \cdot 3 = 12$.
- **Seštevanje namesto množenja.** »$(3 + 1) + (2 + 1) = 7$ deliteljev.« Vsako možnost za dvojko lahko združiš z vsako možnostjo za trojko, zato je to tabela s $4$ vrsticami in $3$ stolpci, ne vrsta s $7$ polji.
- **$1$ med praštevili.** Kdor šteje $1$ med praštevila, dobi razcep »$12 = 1 \cdot 2^2 \cdot 3$« in pri štetju deliteljev doda odvečen faktor. Število $1$ ima en sam delitelj, zato ni praštevilo in ga v razcep ne pišemo.
- **»$v$ je vedno produkt.«** »$v(84, 90) = 84 \cdot 90 = 7560$.« To je skupni večkratnik, a ne najmanjši. Produkt je enak $v$ le pri tujih številih. Sicer velja $v = \dfrac{a \cdot b}{D}$, pri nas $1260$.
- **Preizkus le z $2$, $3$ in $5$.** »$91$ ni sodo, vsota števk je $10$, ne konča se s $5$, torej je praštevilo.« Preizkusiti moraš vsa praštevila do $\sqrt{91}$, torej tudi $7$, in res je $91 = 7 \cdot 13$.

## Povzetek

- Praštevilo ima natanko dva delitelja. $1$ ni praštevilo. Vsako število, večje od $1$, ima en sam razcep na prafaktorje.
- $D$: skupni prafaktorji z manjšo potenco. $v$: vsi prafaktorji z večjo potenco. Velja $D \cdot v = a \cdot b$; za tuji števili je $D = 1$ in $v = a \cdot b$.
- Če je $n = p^a \cdot q^b \cdot r^c$, ima $n$ natanko $(a + 1)(b + 1)(c + 1)$ deliteljev.
- Delitelji so v parih z zmnožkom $n$; liho število deliteljev imajo le popolni kvadrati.
- Ali je $n$ praštevilo: preizkusi praštevila do $\sqrt{n}$.
- Najmanjše število z danim številom deliteljev: razstavi število deliteljev na faktorje, največji eksponent daj praštevilu $2$.

## Drugače: Na sliki

Razcep si predstavljaj kot vrečko kroglic, na vsaki kroglici je napisano eno praštevilo:

- $90$: kroglice $2$, $3$, $3$, $5$
- $120$: kroglice $2$, $2$, $2$, $3$, $5$

Nariši dva prekrivajoča se kroga. V presek daš kroglice, ki jih imata obe vrečki: $2$, $3$ in $5$. Levo ostane še $3$, desno $2$ in $2$.

- **Presek** je $D$: $2 \cdot 3 \cdot 5 = 30$.
- **Vse kroglice na sliki** (presek in oba ostanka) so $v$: $2 \cdot 3 \cdot 5 \cdot 3 \cdot 2 \cdot 2 = 360$.

Število deliteljev pa vidiš kot pravokotnike. Iz $n$ enakih kvadratkov sestavi vse pravokotnike, ki jih lahko (zasuk ne šteje). Vsak pravokotnik prinese dva delitelja, dolžino in širino. Le kvadrat prinese enega.

## Drugače: Iz vsakdanjega življenja

- **Avtobus in vlak.** Avtobus odpelje s postaje vsakih $12$ minut, vlak vsakih $18$ minut, ob $7.00$ odpeljeta skupaj. Spet skupaj odpeljeta čez $v(12, 18) = 36$ minut. Razcepa $2^2 \cdot 3$ in $2 \cdot 3^2$ povesta odgovor brez naštevanja.
- **Rezanje traku.** Imaš trak dolžine $90\,\text{cm}$ in trak dolžine $120\,\text{cm}$. Oba razrežeš na enako dolge kose brez ostanka. Najdaljši možni kos je dolg $D(90, 120) = 30\,\text{cm}$.
- **Fotografija razreda.** Učenci stojijo v pravokotniku. Če je v razredu $24$ učencev ($2^3 \cdot 3$, torej $4 \cdot 2 = 8$ deliteljev), je razporedov pravokotnika $4$: $1 \times 24$, $2 \times 12$, $3 \times 8$, $4 \times 6$. Pri $23$ učencih (praštevilo) ostane le ena dolga vrsta.

## Preveri se

? Iz $20$ enakih kvadratkov sestavljamo pravokotnike, zasuk ne šteje. Kateri seznam je popoln?
- $2 \times 10$, $4 \times 5$
~ Manjka pravokotnik $1 \times 20$. Tudi $1$ in $20$ sta delitelja števila $20$.
+ $1 \times 20$, $2 \times 10$, $4 \times 5$
- $1 \times 20$, $2 \times 10$
~ Manjka $4 \times 5$. Pri $20 = 2^2 \cdot 5$ je lahko eksponent dvojke tudi $2$, ne le $0$ ali $1$.
> Število $20 = 2^2 \cdot 5$ ima $3 \cdot 2 = 6$ deliteljev, ki tvorijo $3$ pare: $1 \cdot 20$, $2 \cdot 10$ in $4 \cdot 5$. Vsak par je en pravokotnik.

? Preverjaš, ali je $221$ praštevilo. Do katerega praštevila moraš preizkušati?
- Do $110$, ker je to približno polovica števila $221$.
~ Tako delaš preveč. Če bi imelo $221$ delitelj, večji od $\sqrt{221}$, bi bil njegov par manjši od $\sqrt{221}$ in bi ga že našel.
+ Do $13$, ker je $\sqrt{221}$ med $14$ in $15$.
- Samo do $5$, ker za $2$, $3$ in $5$ poznamo pravila.
~ Pravila deljivosti so priročna, a ne zadoščajo. Res je $221 = 13 \cdot 17$.
> Ker je $14^2 = 196$ in $15^2 = 225$, je $\sqrt{221}$ med $14$ in $15$. Preizkusiti moraš praštevila do $13$. Pri $13$ najdeš $221 = 13 \cdot 17$.

? Zakaj ima število $49$ liho število deliteljev?
- Ker je $49$ liho število.
~ Lihost števila ni pomembna: $15$ je liho, a ima $4$ delitelje ($1$, $3$, $5$, $15$).
- Ker je $7$ praštevilo.
~ Tudi $35 = 5 \cdot 7$ ima samo praštevilske faktorje, pa ima $4$ delitelje. Odloča to, ali je število kvadrat.
+ Ker je $49 = 7 \cdot 7$, par $7 \cdot 7$ pa prinese en sam delitelj.
> Delitelji so v parih z zmnožkom $49$: $1 \cdot 49$ in $7 \cdot 7$. Drugi par prinese le $7$, zato so delitelji $1$, $7$ in $49$. Liho število deliteljev imajo natanko popolni kvadrati.

? Število ima razcep $2^a \cdot 3$ in natanko $8$ deliteljev. Katero je?
- $48$
~ Pri $48 = 2^4 \cdot 3$ je deliteljev $(4 + 1)(1 + 1) = 10$. Pri dvojki si pozabil prišteti $1$.
- $96$
~ Tako dobiš, če eksponenta seštevaš: $(5 + 1) + (1 + 1) = 8$. Pravilno se množi, $96$ ima $12$ deliteljev.
+ $24$
> Velja $(a + 1)(1 + 1) = 8$, torej $a + 1 = 4$ in $a = 3$. Število je $2^3 \cdot 3 = 24$, delitelji so $1, 2, 3, 4, 6, 8, 12, 24$.

? V modelu vesoljske postaje se dotikata zobnika z $12$ in $18$ zobmi. Po koliko obratih manjšega zobnika se ista dva zoba prvič spet dotakneta?
- Po $2$ obratih
~ $2$ obrata naredi večji zobnik. Manjši se mora zavrteti večkrat.
+ Po $3$ obratih
- Po $6$ obratih
~ $6$ je $D(12, 18)$. Tu pa iščemo prvo skupno število zob, ki gre mimo, torej $v$.
- Po $18$ obratih
~ Za skupni večkratnik si vzel produkt $12 \cdot 18 = 216$. Števili nista tuji, zato je $v$ manjši.
> Mimo stičišča mora iti $v(12, 18) = 36$ zob. Manjši zobnik se zavrti $36 : 12 = 3$-krat, večji pa $36 : 18 = 2$-krat.

:::simboli
n | naravno število | n = p^a \cdot q^b \cdot r^c | |
p, q, r | različna praštevila (prafaktorji števila n) | | |
a, b, c | eksponenti prafaktorjev | | | pri D in v sta a, b dani naravni števili
D | največji skupni delitelj | | |
v | najmanjši skupni večkratnik | | | D · v = a · b
:::
