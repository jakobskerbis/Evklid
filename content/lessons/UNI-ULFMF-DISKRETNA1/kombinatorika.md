---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V 18. stoletju je krožila glasbena igra s kockami, ki jo pripisujejo Mozartu. Valček ima $16$ taktov. Za vsak takt vržeš dve kocki in glede na vsoto izbereš eno izmed $11$ vnaprej napisanih različic. Skupaj je napisanih le $16 \cdot 11 = 176$ taktov.

Iz teh $176$ taktov nastane približno $4{,}6 \cdot 10^{16}$ različnih valčkov. Če bi vsakega zaigrali v $30$ sekundah, bi igrali okoli $4 \cdot 10^{10}$ let, kar je približno trikrat dlje od starosti vesolja. Zveni nemogoče, a je preprost račun.

Kombinatorika je veščina štetja brez naštevanja. V diskretni matematiki jo potrebuješ povsod: pri verjetnosti, pri štetju poti v grafih, pri analizi algoritmov in pri rekurzivnih enačbah.

## Razlaga

**1. Drevo izbir: pravilo produkta.** Bobnar izbira ritem (počasen, srednji, hiter) in nato zvok (boben, činela, kravji zvonec, ploskanje). Nariši drevo: iz korena gredo $3$ veje, iz vsake veje še $4$. Listov je $3 \cdot 4 = 12$. Enako kaže tabela s $3$ vrsticami in $4$ stolpci: vsaka celica je ena kombinacija.

Splošno: če ima prva izbira $m$ možnosti in druga, *ne glede na prvo*, $n$ možnosti, je vseh izidov $m \cdot n$. To je **pravilo produkta**. Pri valčku z igro s kockami je $16$ zaporednih izbir po $11$ možnosti, torej $11^{16}$ izidov.

**2. Mesta v vrsti: permutacije.** Na koncertu je pet skladb. Nariši pet praznih mest v programu:

$$\underline{\ 5\ }\ \underline{\ 4\ }\ \underline{\ 3\ }\ \underline{\ 2\ }\ \underline{\ 1\ }$$

Za prvo mesto imaš $5$ skladb, za drugo le še $4$, ker je ena že porabljena, in tako naprej. Vrstnih redov je $5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 120$. Razvrstitev vseh $n$ različnih predmetov je **permutacija**, njihovo število je $n! = n(n-1)\cdots 1$, z dogovorom $0! = 1$.

Če zapolnimo le prvih $k$ mest izmed $n$ predmetov, se produkt ustavi po $k$ faktorjih: $n(n-1)\cdots(n-k+1) = \frac{n!}{(n-k)!}$. Temu rečemo **variacija** (urejen izbor brez ponavljanja). Kadar se predmeti lahko ponavljajo, ima vsako mesto vseh $n$ možnosti in je izidov $n^k$.

**3. Akord: vrstni red ne šteje.** Iz sedmih tonov lestvice (C, D, E, F, G, A, H) zaigramo trizvok, tri tone hkrati. Če bi tone igrali zaporedno, bi bilo urejenih trojic $7 \cdot 6 \cdot 5 = 210$. Akord C–E–G pa zveni enako kot G–C–E. Razvrsti vseh $210$ trojic v vrstice tako, da so v isti vrstici trojice z istimi toni: vsaka vrstica ima $3! = 6$ trojic. Vrstic je $\frac{210}{6} = 35$.

Neurejen izbor $k$ predmetov izmed $n$ je **kombinacija**, njihovo število je **binomski koeficient**
$$\binom{n}{k} = \frac{n!}{k!\,(n-k)!}.$$

:::premisli
Ali je več trizvokov ali štirizvokov iz sedmih tonov? Napovej, nato preveri.
---
Enako, $35$. Izbrati $4$ tone, ki zazvenijo, je isto kot izbrati $3$ tone, ki ostanejo tiho: $\binom{7}{4} = \binom{7}{3}$. Splošno $\binom{n}{k} = \binom{n}{n-k}$.
:::

**4. Pascalov trikotnik in ritmi.** Takt ima $4$ dobe, na vsaki je udarec ali premor. Ritmov z natanko $k$ udarci je $\binom{4}{k}$: izberemo, na katerih dobah so udarci. Zapiši te številke za takte z $0, 1, 2, 3, 4$ dobami v trikotnik:

:::risba skica
opis: Pascalov trikotnik s petimi vrsticami. Vrstice od zgoraj navzdol: 1; 1, 1; 1, 2, 1; 1, 3, 3, 1; 1, 4, 6, 4, 1. Vsako število stoji pod sredino med dvema številoma nad njim in je njuna vsota.
območje: -5; -4,7 .. 5; 0,7
enota: 30
napis: 0; 0 | 1 | sredina
napis: -1; -1 | 1 | sredina
napis: 1; -1 | 1 | sredina
napis: -2; -2 | 1 | sredina
napis: 0; -2 | 2 | sredina
napis: 2; -2 | 1 | sredina
napis: -3; -3 | 1 | sredina
napis: -1; -3 | 3 | sredina
napis: 1; -3 | 3 | sredina
napis: 3; -3 | 1 | sredina
napis: -4; -4 | 1 | sredina
napis: -2; -4 | 4 | sredina
napis: 0; -4 | 6 | sredina
napis: 2; -4 | 4 | sredina
napis: 4; -4 | 1 | sredina
:::

Vsako število je vsota dveh nad njim. Razlog vidiš na ritmu: ritmi s $k$ udarci na $n$ dobah imajo na zadnji dobi bodisi udarec (preostalih $k-1$ udarcev je na $n-1$ dobah) bodisi premor (vseh $k$ je na $n-1$ dobah). Zato
$$\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}.$$
Vsota vrstice je $2^n$, saj je vseh ritmov na $n$ dobah $2^n$. Ista števila so koeficienti v **binomskem izreku**:
$$(a + b)^n = \sum_{k=0}^{n} \binom{n}{k} a^k b^{n-k}.$$
Pri razvijanju iz vsakega od $n$ oklepajev vzamemo $a$ ali $b$; člen $a^k b^{n-k}$ dobimo tolikokrat, kolikor je načinov izbrati $k$ oklepajev z $a$.

:::premisli
Napovej, ali je $\binom{8}{0} - \binom{8}{1} + \binom{8}{2} - \cdots + \binom{8}{8}$ pozitivno, negativno ali $0$. Napoved preveri z binomskim izrekom pri ustrezno izbranih $a$ in $b$.
---
$0$. Vzemi $a = -1$, $b = 1$: vsota je $(-1 + 1)^8 = 0^8 = 0$. Ritmov s sodim številom udarcev je torej toliko kot ritmov z lihim, po $128$.
:::

**5. Prekrivanje: vključitve in izključitve.** V glasbeni šoli je $18$ pianistov in $12$ kitaristov, $5$ jih igra oboje. V Vennovem diagramu se kroga pianistov in kitaristov prekrivata. Če sešteješ $18 + 12$, so tisti v preseku šteti dvakrat, zato jih enkrat odšteješ: $18 + 12 - 5 = 25$ učencev igra vsaj eno glasbilo. Za dve množici:
$$|A \cup B| = |A| + |B| - |A \cap B|.$$
Za tri množice odšteješ vse tri dvojne preseke, s tem pa trojni presek odšteješ preveč, zato ga prišteješ nazaj:
$$|A \cup B \cup C| = |A| + |B| + |C|$$
$$\qquad - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|.$$

## Rešeni primeri

### Primer 1: zvonjenje telefona

Melodija zvonjenja ima $5$ zaporednih tonov, izbranih iz $7$ tonov lestvice. (a) Koliko je melodij, če se toni lahko ponavljajo? (b) Koliko, če mora biti vsak ton drugačen?

**Podatki:** $n = 7$ tonov, dolžina $k = 5$; (a) s ponavljanjem, (b) brez ponavljanja
**Iščemo:** število melodij v obeh primerih

:::formula
(a) $n^k$, $\quad$ (b) $\dfrac{n!}{(n-k)!} = n(n-1)\cdots(n-k+1)$
:::

**Rešitev:**

1. Vrstni red tonov je pomemben, saj je melodija zaporedje.
2. (a) Vsako od $5$ mest ima $7$ možnosti: $7^5 = 16807$.
3. (b) Vsako naslednje mesto ima eno možnost manj: $7 \cdot 6 \cdot 5 \cdot 4 \cdot 3 = 2520$.
4. Odgovor: s ponavljanjem je $16\,807$ melodij, brez ponavljanja $2520$.

### Primer 2: kvartet iz zbora

Zbor ima $8$ sopranistk in $6$ altistk. Za kvartet izberemo $2$ sopranistki in $2$ altistki. Na koliko načinov?

**Podatki:** $8$ sopranistk, $6$ altistk; izberemo $2$ in $2$, vloge znotraj glasu niso določene
**Iščemo:** število kvartetov

:::formula
pravilo produkta in kombinacije: $\binom{8}{2} \cdot \binom{6}{2}$
:::

**Rešitev:**

1. Znotraj glasu vrstni red ne šteje, zato kombinacije.
2. Sopranistki: $\binom{8}{2} = \frac{8 \cdot 7}{2} = 28$.
3. Altistki: $\binom{6}{2} = \frac{6 \cdot 5}{2} = 15$.
4. Izbiri sta neodvisni, zato množimo: $28 \cdot 15 = 420$.
5. Odgovor: kvartet lahko sestavimo na $420$ načinov.

### Primer 3: melodija s tonoma C in G

Koliko melodij iz $5$ tonov (izbranih iz $7$ tonov lestvice, ponavljanje dovoljeno) vsebuje ton C vsaj enkrat *in* ton G vsaj enkrat?

**Podatki:** $7$ tonov, dolžina $5$, s ponavljanjem; pogoj: C in G vsaj enkrat
**Iščemo:** število takih melodij

:::formula
komplement in vključitve-izključitve: $|\overline{A} \cap \overline{B}| = N - |A| - |B| + |A \cap B|$
:::

**Rešitev:**

1. Neposredno štetje je zapleteno, zato štejemo slabe melodije. Naj bo $A$ množica melodij brez C, $B$ množica melodij brez G. Dobre melodije niso ne v $A$ ne v $B$, torej ležijo v $\overline{A} \cap \overline{B}$ (črta označuje komplement). Teh je $N - |A \cup B|$, unijo pa razpišemo z vključitvami in izključitvami.
2. Vseh melodij: $N = 7^5 = 16807$.
3. Brez C je na voljo $6$ tonov: $|A| = 6^5 = 7776$; enako $|B| = 7776$.
4. Brez C in brez G ostane $5$ tonov: $|A \cap B| = 5^5 = 3125$.
5. Dobre: $16807 - 7776 - 7776 + 3125 = 4380$.
6. Odgovor: C in G vsebuje $4380$ melodij.

### Primer 4: zdaj ti

Takt ima $8$ osmink, na vsaki je udarec ali premor. Koliko ritmov ima natanko $3$ udarce, če mora biti na prvi osminki udarec?

**Podatki:** $8$ osmink, natanko $3$ udarci, prva osminka je udarec
**Iščemo:** število ritmov

:::formula
$\binom{n}{k}$: izbira $k$ mest izmed $n$ prostih
:::

**Rešitev:**

1. Prvi udarec je že postavljen, prostih je preostalih $7$ osmink.
2. Na njih razporedimo še $2$ udarca, vrstni red udarcev ne šteje.
3. Izračunaj sam, nato preveri:

:::premisli
Koliko je ritmov?
---
$\binom{7}{2} = \frac{7 \cdot 6}{2} = 21$. Brez pogoja bi jih bilo $\binom{8}{3} = 56$.
:::

## Pogoste napake

- **Akord kot zaporedje.** Kdor za trizvoke iz $7$ tonov računa $7 \cdot 6 \cdot 5 = 210$, šteje vsak akord $3! = 6$-krat. Vprašaj se: ali dve razvrstitvi istih predmetov dasta različen izid? Če ne, deli s $k!$ oziroma uporabi $\binom{n}{k}$.
- **Seštevanje namesto množenja.** »$3$ ritmi in $4$ zvoki, torej $7$ možnosti« je napačno, ker izbiramo *oboje*. Seštevamo, ko izberemo *eno ali drugo* iz ločenih skupin; množimo zaporedne izbire.
- **Ponavljanje spregledano.** Pri melodiji s ponavljanjem ima vsako mesto vseh $7$ tonov ($7^5$), brez ponavljanja pa vsakič enega manj. Preberi, ali se predmet lahko izbere znova.
- **Presek šteti dvakrat.** $18 + 12 = 30$ glasbenikov je preveč, ker so tisti, ki igrajo oboje, šteti dvakrat. Pri treh množicah ne pozabi trojnega preseka nazaj prišteti.

## Povzetek

- Pravilo produkta: zaporedne neodvisne izbire z $m$ in $n$ možnostmi dajo $m \cdot n$ izidov.
- Permutacije $n$ predmetov: $n!$. Urejeni izbori $k$ izmed $n$ brez ponavljanja: $\frac{n!}{(n-k)!}$; s ponavljanjem: $n^k$.
- Kombinacije (vrstni red ne šteje): $\binom{n}{k} = \frac{n!}{k!(n-k)!}$; velja $\binom{n}{k} = \binom{n}{n-k}$.
- Pascalov trikotnik: $\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$, vsota vrstice je $2^n$; binomski izrek $(a+b)^n = \sum \binom{n}{k} a^k b^{n-k}$.
- Vključitve in izključitve: $|A \cup B| = |A| + |B| - |A \cap B|$; pri treh množicah še $+|A \cap B \cap C|$.
- Pogosto je lažje šteti komplement.

## Za izpit

Znati moraš povedati:

- pravilo produkta s pogojem (število možnosti druge izbire ni odvisno od prve) in kdaj namesto množenja seštevamo;
- definicije permutacije, variacije in kombinacije ter formule $n!$, $\frac{n!}{(n-k)!}$, $n^k$ in $\binom{n}{k} = \frac{n!}{k!\,(n-k)!}$ z izpeljavo (deljenje s $k!$);
- simetrijo $\binom{n}{k} = \binom{n}{n-k}$ in Pascalovo enakost $\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$ s kombinatoričnim dokazom;
- binomski izrek z dokazom ter posledici $\sum_k \binom{n}{k} = 2^n$ in $\sum_k (-1)^k \binom{n}{k} = 0$ za $n \ge 1$;
- načelo vključitev in izključitev za dve, tri in $n$ množic, dokaz s štetjem prispevkov in uporabo na komplementu.

### Naloga 1

Laboratorij označuje vzorce s kodami dolžine $6$ iz črk A, C, G, T; črke se lahko ponavljajo. (a) Koliko kod vsebuje vsako od štirih črk vsaj enkrat? (b) Koliko kod ima natanko dve črki A, ki nista sosednji? (c) Koliko kod vsebuje vse štiri črke in ima natanko dve črki A?

**Rešitev:**

1. (a) Štejemo komplement. Naj bo $A_i$ množica kod, v katerih manjka $i$-ta črka, $i = 1, \ldots, 4$. Iščemo $N - |A_1 \cup A_2 \cup A_3 \cup A_4|$, unijo pa razpišemo z vključitvami in izključitvami za štiri množice.
2. Vseh kod: $N = 4^6 = 4096$.
3. Če manjka $j$ izbranih črk, je kod $(4 - j)^6$, izbir manjkajočih črk pa $\binom{4}{j}$. Členi: $\binom{4}{1} \cdot 3^6 = 4 \cdot 729 = 2916$, $\binom{4}{2} \cdot 2^6 = 6 \cdot 64 = 384$, $\binom{4}{3} \cdot 1^6 = 4$, $\binom{4}{4} \cdot 0^6 = 0$.
4. Kod z vsemi štirimi črkami: $4096 - 2916 + 384 - 4 = 1560$.
5. (b) Najprej izberemo mesti za A. Vseh parov mest je $\binom{6}{2} = 15$, sosednjih parov je $5$, torej nesosednjih $15 - 5 = 10$.
6. Na preostalih $4$ mestih je katerakoli od črk C, G, T: $3^4 = 81$. Po pravilu produkta: $10 \cdot 81 = 810$.
7. (c) Mesti za A izberemo na $\binom{6}{2} = 15$ načinov. Na preostalih $4$ mestih morajo biti C, G in T vsaka vsaj enkrat. Vključitve in izključitve za tri množice: $3^4 - 3 \cdot 2^4 + 3 \cdot 1^4 = 81 - 48 + 3 = 36$.
8. Skupaj: $15 \cdot 36 = 540$.
9. Odgovor: (a) $1560$ kod, (b) $810$ kod, (c) $540$ kod.

### Naloga 2

Natančno navedi Pascalovo enakost in binomski izrek ter oba dokaži. Nato iz binomskega izreka izpelji, koliko podmnožic ima množica z $n$ elementi, in utemelji, ali ima za $n \ge 1$ enako mnogo podmnožic sode in lihe moči.

**Rešitev:**

1. Pascalova enakost: za cela $n \ge 1$ in $1 \le k \le n - 1$ velja $\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$.
2. Kombinatorični dokaz: leva stran šteje $k$-elementne podmnožice množice $\{1, \ldots, n\}$. Tistih, ki vsebujejo element $n$, je $\binom{n-1}{k-1}$ (preostalih $k - 1$ elementov izberemo izmed $n - 1$); tistih, ki ga ne vsebujejo, je $\binom{n-1}{k}$. Skupini sta ločeni in skupaj dasta vse, zato seštejemo.
3. Računski dokaz: $\frac{(n-1)!}{(k-1)!\,(n-k)!} + \frac{(n-1)!}{k!\,(n-k-1)!} = \frac{(n-1)!\,\big(k + (n - k)\big)}{k!\,(n-k)!} = \frac{n!}{k!\,(n-k)!}$.
4. Binomski izrek: za poljubni števili $a$, $b$ in celo $n \ge 0$ velja $(a + b)^n = \sum_{k=0}^{n} \binom{n}{k} a^k b^{n-k}$.
5. Dokaz: v produktu $(a + b)(a + b) \cdots (a + b)$ z $n$ oklepaji dobimo vsak člen tako, da iz vsakega oklepaja vzamemo $a$ ali $b$. Člen $a^k b^{n-k}$ nastane natanko takrat, ko $a$ vzamemo iz $k$ oklepajev; izbir teh oklepajev je $\binom{n}{k}$, kar je koeficient člena.
6. Število podmnožic: pri $a = b = 1$ je $\sum_{k=0}^{n} \binom{n}{k} = 2^n$. Ker je $\binom{n}{k}$ število podmnožic moči $k$, ima množica z $n$ elementi $2^n$ podmnožic.
7. Sode in lihe: pri $a = -1$, $b = 1$ je $\sum_{k=0}^{n} (-1)^k \binom{n}{k} = 0^n = 0$ za $n \ge 1$. Vsota koeficientov pri sodih $k$ je zato enaka vsoti pri lihih $k$.
8. Sklep: za $n \ge 1$ je podmnožic sode moči toliko kot podmnožic lihe moči, po $2^{n-1}$. Za $n = 0$ trditev ne velja: prazna množica ima eno samo podmnožico, ta je sode moči.

### Naloga 3

(a) Določi koeficient pri $x^5$ v razvoju $(2x - 3)^8$. (b) Koliko naravnih števil od $1$ do $2520$ ni deljivih z nobenim od števil $4$, $6$ in $10$?

**Rešitev:**

1. (a) Po binomskem izreku z $a = 2x$, $b = -3$, $n = 8$ je člen z $x^5$ enak $\binom{8}{5} (2x)^5 (-3)^3$.
2. $\binom{8}{5} = \binom{8}{3} = \frac{8 \cdot 7 \cdot 6}{6} = 56$, $2^5 = 32$, $(-3)^3 = -27$.
3. Koeficient: $56 \cdot 32 \cdot (-27) = -48384$.
4. (b) Naj bodo $A$, $B$, $C$ množice števil od $1$ do $2520$, deljivih s $4$, $6$ oziroma $10$. Število je v preseku natanko takrat, ko je deljivo z najmanjšim skupnim večkratnikom: $v(4, 6) = 12$, $v(4, 10) = 20$, $v(6, 10) = 30$, $v(4, 6, 10) = 60$. (Pogosta napaka je deliti s produkti $24$, $40$, $60$.)
5. Vsa ta števila delijo $2520$, zato: $|A| = \frac{2520}{4} = 630$, $|B| = \frac{2520}{6} = 420$, $|C| = \frac{2520}{10} = 252$.
6. Preseki: $|A \cap B| = \frac{2520}{12} = 210$, $|A \cap C| = \frac{2520}{20} = 126$, $|B \cap C| = \frac{2520}{30} = 84$, $|A \cap B \cap C| = \frac{2520}{60} = 42$.
7. Unija: $630 + 420 + 252 - 210 - 126 - 84 + 42 = 924$.
8. Komplement: $2520 - 924 = 1596$.
9. Odgovor: (a) koeficient je $-48\,384$; (b) z nobenim od števil $4$, $6$, $10$ ni deljivih $1596$ števil.

## Drugače: Z analogijo

Predstavljaj si mešalno mizo s $7$ drsniki.

- **Melodija** je, kot da drsnike pritiskaš enega za drugim; zapis časa šteje, zato je to urejen izbor.
- **Akord** je, kot da hkrati dvigneš tri drsnike in posnameš eno samo sliko mize. Na sliki ne vidiš, kateri je bil dvignjen prvi, zato šteješ le *katere*, ne *v katerem redu*: $\binom{7}{3}$.
- **Vključitve in izključitve** so kot dva mikrofona, ki oba ujameta isti glas. V posnetku ga slišiš dvakrat glasneje, zato ga moraš enkrat odšteti.

## Drugače: Uporaba v stroki

V kriptografiji z istimi formulami oceniš velikost prostora ključev. Geslo iz $8$ znakov nad abecedo z $62$ znaki (velike in male črke, števke) je urejen izbor s ponavljanjem: $62^8 \approx 2{,}2 \cdot 10^{14}$ možnosti. V teoriji kodiranja šteješ vzorce napak, kjer je pomembno le, *kateri* biti so napačni: v bloku s $23$ biti je $\binom{23}{3} = 1771$ vzorcev s tremi napakami. Vzorcev z največ tremi napakami je $1 + 23 + 253 + 1771 = 2048 = 2^{11}$, kar je natanko toliko, kolikor različnih sindromov ima binarna Golayeva koda z $11$ kontrolnimi biti; zato popravi vse take napake. Ključno vprašanje je vedno isto: ali je izid zaporedje ali množica?

## Drugače: Bolj natančno

**Formula vključitev in izključitev za $n$ množic:**
$$\Big|\bigcup_{i=1}^n A_i\Big| = \sum_{\emptyset \ne I \subseteq \{1,\ldots,n\}} (-1)^{|I|+1} \Big|\bigcap_{i \in I} A_i\Big|.$$
Dokaz s štetjem prispevkov: element, ki leži v natanko $m \ge 1$ množicah, se na desni pojavi v $\binom{m}{j}$ presekih velikosti $j$. Njegov prispevek je
$$\sum_{j=1}^{m} (-1)^{j+1}\binom{m}{j} = 1 - (1 - 1)^m = 1,$$
po binomskem izreku. Element zunaj vseh množic prispeva $0$. Torej desna stran vsak element unije šteje natanko enkrat.

## Preveri se

? Kitarist izbere $3$ strune izmed $6$, ki jih bo hkrati ubral. Kaj pomeni število $\binom{6}{3}$ v tem primeru?
- Število vrstnih redov, v katerih lahko ubere $3$ strune.
~ Pri vrstnem redu bi šteli $6 \cdot 5 \cdot 4 = 120$; strune so ubrane hkrati, zato red ne šteje.
+ Število različnih naborov treh strun, ne glede na vrstni red.
- Število načinov, da vsako od $3$ strun izbere izmed $6$, s ponavljanjem.
~ To bi bilo $6^3 = 216$; ista struna se v naboru ne more pojaviti dvakrat.
> $\binom{6}{3} = 20$ šteje neurejene izbore treh različnih strun.

? Uredi od najmanjšega do največjega: $5!$, $2^7$, $\binom{10}{5}$.
- $2^7 < 5! < \binom{10}{5}$
~ $2^7 = 128$ je večje od $5! = 120$, čeprav le malo; izračunaj obe števili, ne ocenjuj na oko.
+ $5! < 2^7 < \binom{10}{5}$
- $\binom{10}{5} < 5! < 2^7$
~ Binomski koeficient ni majhen zato, ker delimo: $\binom{10}{5} = 252$.
> $5! = 120$, $2^7 = 128$, $\binom{10}{5} = 252$.

? Kaj se zgodi s številom akordov iz $12$ tonov oktave, če namesto $3$ tonov izbiramo $9$ tonov?
- Poveča se trikrat, ker je tonov trikrat več.
~ Število izborov ni sorazmerno s $k$; pri $k$ blizu $n$ spet pada.
+ Ostane enako, $220$.
- Zmanjša se na $\frac{1}{3}$.
~ Več izbranih tonov ne pomeni manj akordov: vsak izbor $9$ tonov ustreza natanko enemu izboru $3$ izpuščenih, zato sta števili enaki.
> $\binom{12}{9} = \binom{12}{3} = 220$, ker izbrati $9$ zvenečih tonov pomeni izbrati $3$ tihe.

? Koliko vrstnih redov $6$ skladb na koncertu obstaja, če morata dve določeni skladbi (dvodelna suita) biti druga ob drugi, v poljubnem vrstnem redu?
- $720$
~ To je $6!$ brez pogoja; mnogo razporedov suito razbije.
- $120$
~ Suito si obravnaval kot en blok ($5!$), pozabil pa si, da sta njena dela lahko v dveh vrstnih redih.
+ $240$
- $30$
~ To je $6 \cdot 5$, število urejenih izborov dveh skladb, ne vrstnih redov celega programa.
> Suita je en blok: $5! = 120$ razporedov blokov, krat $2$ vrstna reda znotraj suite, skupaj $240$.

? V glasbenem društvu je $40$ članov. $22$ jih poje, $15$ igra violino, $9$ počne oboje. Koliko članov ne poje in ne igra violine?
- $3$
~ Tako dobiš, če od $40$ odšteješ $22 + 15 = 37$: tistih $9$, ki počnejo oboje, si štel dvakrat.
+ $12$
- $21$
~ To je $40 - 28 + 9$: presek si prištel še enkrat, čeprav je že upoštevan.
> $|A \cup B| = 22 + 15 - 9 = 28$, torej ne počne ničesar $40 - 28 = 12$ članov.

:::simboli
n | število vseh predmetov | | | tudi število oklepajev v (a + b)ⁿ
k | število izbranih predmetov | | | 0 ≤ k ≤ n
m | število možnosti prve izbire | | | v dokazu: v koliko množicah leži element
a, b | člena binoma
A, B, C | končne množice (dogodki, ki jih štejemo)
A_i | i-ta množica v načelu vključitev in izključitev
\overline{A}, \overline{B} | komplementa množic A in B | \lvert \overline{A} \cap \overline{B} \rvert = N - \lvert A \cup B \rvert
N | število vseh elementov (vseh možnosti)
I | neprazna podmnožica indeksov {1, …, n}
i, j | indeksa množic
:::
