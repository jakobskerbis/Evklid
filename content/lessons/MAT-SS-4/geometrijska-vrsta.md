---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Grški filozof Zenon iz Eleje je v 5. stoletju pr. n. št. zastavil uganko o tekmi. Hitronogi Ahil teče za želvo, ki ima nekaj prednosti. Ko Ahil pride do mesta, kjer je želva začela, se je želva že premaknila naprej. Ko Ahil pride do tja, je želva spet za košček dlje. In tako brez konca.

Zenon je sklepal takole: Ahil mora preteči neskončno mnogo odsekov, zato želve ne ujame nikoli. Vsak, ki je kdaj tekel na atletski stezi, ve, da to ni res. Toda kje je napaka v sklepanju? O tem so razpravljali še stoletja.

Napako razkrije **geometrijska vrsta**: vsota neskončno mnogo členov je lahko končno število. Podobno vsoto je Arhimed uporabil, ko je izračunal ploščino paraboličnega odseka. Ti pa boš z njo izračunal pot odbijajoče se žoge, zapisal periodično decimalno število z ulomkom in se pripravil na obrestni račun.

## Razlaga

**Najprej en primer do konca.** Recimo, da Ahil teče s hitrostjo $10\,\mathrm{m/s}$, želva pa s hitrostjo $1\,\mathrm{m/s}$ (za želvo zelo velikodušno). Želva ima $100\,\mathrm{m}$ prednosti. Medtem ko Ahil preteče $100\,\mathrm{m}$, želva prehodi $10\,\mathrm{m}$. Ko Ahil preteče še teh $10\,\mathrm{m}$, je želva $1\,\mathrm{m}$ naprej.

Vsak naslednji odsek je desetina prejšnjega. Ahilovi odseki so torej geometrijsko zaporedje s prvim členom $a_1 = 100\,\mathrm{m}$ in količnikom $q = \frac{1}{10}$. Seštevajmo jih enega za drugim:

| odsekov $n$ | dodani odsek [m] | skupna pot $S_n$ [m] |
|---|---|---|
| 1 | 100 | 100 |
| 2 | 10 | 110 |
| 3 | 1 | 111 |
| 4 | 0,1 | 111,1 |
| 5 | 0,01 | 111,11 |

Skupna pot raste, a vsakič za manj.

:::premisli
Ali skupna pot kdaj preseže $112\,\mathrm{m}$, če seštejemo dovolj veliko odsekov? Napovej, nato utemelji.
---
Ne. Vsak nov odsek doda le enico na naslednjem decimalnem mestu: $111{,}1$; $111{,}11$; $111{,}111$ … Vse te vsote so manjše od $111{,}\overline{1}$, to pa je manj kot $112$.
:::

Preverimo še z gibanjem. Po času $t$ (v sekundah) je Ahil pretekel $10t$ metrov, želva pa je od Ahilovega starta oddaljena $100 + t$ metrov. Ahil jo ujame, ko je $10t = 100 + t$, torej pri $t = \frac{100}{9}\,\mathrm{s} \approx 11{,}1\,\mathrm{s}$. Takrat je pretekel $\frac{1000}{9}\,\mathrm{m} = 111{,}\overline{1}\,\mathrm{m}$. Neskončno mnogo odsekov, a končna pot in končen čas. Zenon je zmotno mislil, da neskončno mnogo členov nujno da neskončno vsoto.

**Imena.** Izraz z neskončno mnogo členi

$$a_1 + a_1 q + a_1 q^2 + a_1 q^3 + \dots$$

imenujemo **geometrijska vrsta**. Vsoto prvih $n$ členov $S_n$ imenujemo **$n$-ta delna vsota**. Delne vsote $S_1, S_2, S_3, \dots$ same tvorijo novo zaporedje, pri Ahilu $100, 110, 111, \dots$

Če ima zaporedje delnih vsot limito $S$, rečemo, da vrsta **konvergira** in da je $S$ njena **vsota**. Če limite ni, vrsta **divergira** in vsote nima.

**Od primera k formuli.** Za delno vsoto geometrijskega zaporedja že imaš formulo $S_n = a_1 \cdot \frac{q^n - 1}{q - 1}$. Pri $|q| < 1$ sta števec in imenovalec negativna, zato oba pomnožimo z $-1$:

$$S_n = a_1 \cdot \frac{1 - q^n}{1 - q}$$

Pri Ahilu je $q^n = 0{,}1;\ 0{,}01;\ 0{,}001; \dots$ Potence gredo proti $0$. Zato gre $1 - q^n$ proti $1$, delne vsote pa proti $\frac{100}{1 - 0{,}1} = \frac{1000}{9}$. Prav toliko kot pri računu z gibanjem.

Isto velja za vsak $q$ med $-1$ in $1$: vsako množenje s takim $q$ potenco po absolutni vrednosti zmanjša, zato $q^n \to 0$. Tako dobimo vsoto geometrijske vrste:

$$S = \frac{a_1}{1 - q}, \qquad |q| < 1$$

**Kdaj vrsta divergira.** Pri $|q| \ge 1$ (in $a_1 \ne 0$) vsote ni:

- $q = 1$: $5 + 5 + 5 + \dots$ ima $S_n = 5n$, kar raste čez vse meje.
- $q > 1$: pri $1 + 2 + 4 + 8 + \dots$ delne vsote rastejo še hitreje.
- $q = -1$: pri $1 - 1 + 1 - 1 + \dots$ delne vsote skačejo $1, 0, 1, 0, \dots$ in se ne ustalijo.
- $q < -1$: členi so po absolutni vrednosti vse večji, delne vsote skačejo vse dlje gor in dol.

Vrsta torej konvergira natanko tedaj, ko je $|q| < 1$.

:::premisli
Zakaj pri $|q| \ge 1$ vrsta ne konvergira niti takrat, ko členi menjajo predznak in se deloma »izničijo«? Namig: poglej, za koliko se razlikujeta dve zaporedni delni vsoti.
---
Zaporedni delni vsoti se razlikujeta za cel člen: $S_n - S_{n-1} = a_n$. Pri $|q| \ge 1$ je vsak člen po absolutni vrednosti vsaj $|a_1|$. Zaporedje, ki ves čas skače za vsaj tolikšen korak, se ne more ustaliti pri nobeni limiti.
:::

V simulaciji spodaj »Geometrijska vrsta« nastavi $a_1 = 1$ in najprej $q = 0{,}5$, nato $q = -0{,}5$ in na koncu $q = 1{,}1$. Opazuj delne vsote. Pri $q = 0{,}5$ se od spodaj bližajo vsoti $2$. Pri $q = -0{,}5$ skačejo nad in pod vsoto $\frac{2}{3}$, a vedno bliže. Pri $q = 1{,}1$ rastejo brez meje.

## Rešeni primeri

### Primer 1 (lažji): vsota vrste

Izračunaj vsoto vrste $6 + 2 + \frac{2}{3} + \frac{2}{9} + \dots$

**Podatki:** $a_1 = 6$, $a_2 = 2$, $a_3 = \frac{2}{3}$, $a_4 = \frac{2}{9}$; vrsta se nadaljuje v neskončnost
**Iščemo:** ali vrsta konvergira in njeno vsoto $S$

:::formula
$q = \dfrac{a_2}{a_1}$; za $|q| < 1$: $S = \dfrac{a_1}{1 - q}$
:::

**Rešitev:**

1. Količnik: $q = \dfrac{2}{6} = \dfrac{1}{3}$. Enak količnik dobimo tudi iz $a_3 : a_2$ in $a_4 : a_3$, zato je vrsta res geometrijska.
2. Ker je $|q| = \frac{1}{3} < 1$, vrsta konvergira.
3. $S = \dfrac{6}{1 - \frac{1}{3}} = \dfrac{6}{\frac{2}{3}} = 9$.
4. Odgovor: vrsta konvergira, njena vsota je $9$.

### Primer 2: negativen količnik

Ali vrsti $12 - 6 + 3 - \frac{3}{2} + \dots$ in $12 - 18 + 27 - \dots$ konvergirata? Vsoti tiste, ki konvergira, izračunaj.

**Podatki:** prva vrsta: $a_1 = 12$, $a_2 = -6$, $a_3 = 3$, $a_4 = -\frac{3}{2}$; druga vrsta: $b_1 = 12$, $b_2 = -18$, $b_3 = 27$
**Iščemo:** ali vrsti konvergirata; vsoto $S$ konvergentne vrste

:::formula
vrsta konvergira natanko tedaj, ko je $|q| < 1$; takrat je $S = \dfrac{a_1}{1 - q}$
:::

**Rešitev:**

1. Prva vrsta: $q = \dfrac{-6}{12} = -\dfrac{1}{2}$. Ker je $|q| = \frac{1}{2} < 1$, vrsta konvergira.
2. $S = \dfrac{12}{1 - \left(-\frac{1}{2}\right)} = \dfrac{12}{\frac{3}{2}} = 8$. Pazi na predznak: $1 - \left(-\frac{1}{2}\right) = \frac{3}{2}$.
3. Smiselnost: delne vsote so $12; 6; 9; 7{,}5; \dots$ Skačejo okoli $8$ in se mu bližajo.
4. Druga vrsta: $q = \dfrac{-18}{12} = -\dfrac{3}{2}$. Ker je $|q| = \frac{3}{2} > 1$, vrsta divergira. Formula bi dala $\frac{12}{5/2} = 4{,}8$, a te številke ne smemo zapisati kot vsote: delne vsote $12, -6, 21, \dots$ skačejo vse dlje.
5. Odgovor: prva vrsta konvergira in ima vsoto $8$; druga divergira in vsote nima.

### Primer 3 (težji): odbijajoča se žoga

Košarkarsko žogo spustimo z višine $2\,\mathrm{m}$. Po vsakem odboju se dvigne do $60\,\%$ višine, s katere je padla. Kolikšno pot opravi žoga, preden obmiruje? Privzemi, da se odbija neskončnokrat.

**Podatki:** začetna višina $h_0 = 2\,\mathrm{m}$; vsak dvig je $60\,\%$ prejšnje višine, torej $q = 0{,}6$
**Iščemo:** celotno pot $s$

:::formula
$s = h_0 + 2\,(h_1 + h_2 + h_3 + \dots)$, kjer je $h_1 + h_2 + \dots = \dfrac{h_1}{1 - q}$
:::

**Rešitev:**

1. Prvi padec je dolg $h_0 = 2\,\mathrm{m}$. Ta odsek žoga opravi le enkrat, navzdol.
2. Vsako naslednjo višino žoga prepotuje dvakrat: gor in nato dol. Višine dvigov so $h_1 = 0{,}6 \cdot 2\,\mathrm{m} = 1{,}2\,\mathrm{m}$, $h_2 = 0{,}6 \cdot 1{,}2\,\mathrm{m} = 0{,}72\,\mathrm{m}$ … To je geometrijska vrsta s $q = 0{,}6$.
3. Ker je $|q| < 1$, ima vsoto: $h_1 + h_2 + \dots = \dfrac{1{,}2\,\mathrm{m}}{1 - 0{,}6} = \dfrac{1{,}2\,\mathrm{m}}{0{,}4} = 3\,\mathrm{m}$.
4. Celotna pot: $s = 2\,\mathrm{m} + 2 \cdot 3\,\mathrm{m} = 8\,\mathrm{m}$.
5. Odgovor: žoga opravi $8\,\mathrm{m}$. Prava žoga obmiruje po končno mnogo odbojih, a zadnji odboji so drobni, zato je $8\,\mathrm{m}$ zelo dober približek.

### Primer 4 – zdaj ti: periodično decimalno število

Zapiši $0{,}\overline{36}$ z okrajšanim ulomkom.

**Podatki:** $0{,}\overline{36} = 0{,}363636\ldots$
**Iščemo:** ulomek, ki je enak $0{,}\overline{36}$

:::formula
$0{,}\overline{36} = 0{,}36 + 0{,}0036 + 0{,}000036 + \dots$ in $S = \dfrac{a_1}{1 - q}$
:::

**Rešitev:**

1. Prvi člen je $a_1 = 0{,}36$. Vsak naslednji je $100$-krat manjši, zato je $q = 0{,}01$.
2. Ker je $|q| < 1$, vrsta konvergira.
3. Vstavi v formulo, izračunaj in ulomek okrajšaj. Nato preveri:

:::premisli
Koliko je $S = \dfrac{0{,}36}{1 - 0{,}01}$?
---
$S = \dfrac{0{,}36}{0{,}99} = \dfrac{36}{99} = \dfrac{4}{11}$. Preizkus: $4 : 11 = 0{,}3636\ldots$
:::

## Pogoste napake

- **Formula brez preverjanja količnika.** »$1 + 2 + 4 + \dots = \frac{1}{1-2} = -1$.« Vsota pozitivnih števil ne more biti negativna. Formula $S = \frac{a_1}{1-q}$ velja le pri $|q| < 1$. Zato najprej preveri $|q|$, šele nato računaj.
- **»Neskončno členov, neskončna vsota.«** To je Zenonova napaka. Če je $|q| < 1$, se členi manjšajo tako hitro, da so delne vsote omejene. Vrsta $\frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \dots$ ima vsoto $1$.
- **Predznak pri negativnem količniku.** Pri $q = -\frac{1}{2}$ je $1 - q = \frac{3}{2}$, ne $\frac{1}{2}$. Kdor to zamenja, dobi v primeru 2 vsoto $24$ namesto $8$. Negativen $q$ vstavi v oklepaju.
- **Obrnjen količnik.** $q = \frac{a_1}{a_2}$ namesto $\frac{a_2}{a_1}$. Pri vrsti $6 + 2 + \dots$ bi dobil $q = 3$ in zmotno sklepal, da vrsta divergira. Količnik je vedno »naslednji deljeno s prejšnjim«.
- **Pozabljen dvojni odsek.** Pri žogi nekateri seštejejo $2 + 1{,}2 + 0{,}72 + \dots = \frac{2}{1 - 0{,}6} = 5\,\mathrm{m}$. Vsako višino po odboju žoga prepotuje dvakrat, zato je pravilno $8\,\mathrm{m}$. Najprej nariši pot, nato zapiši vrsto.

## Povzetek

- Geometrijska vrsta: $a_1 + a_1 q + a_1 q^2 + \dots$ (neskončno mnogo členov).
- $n$-ta delna vsota: $S_n = a_1 \cdot \dfrac{1 - q^n}{1 - q}$; vrsta konvergira, če ima zaporedje $S_n$ limito.
- Konvergira natanko tedaj, ko je $|q| < 1$; takrat je vsota $S = \dfrac{a_1}{1 - q}$.
- Pri $|q| \ge 1$ (in $a_1 \ne 0$) vrsta divergira in vsote nima; formule ne smemo uporabiti.
- Negativen $q$: delne vsote skačejo okoli vsote. Pri $1 - q$ pazi na predznak.
- Uporaba: Zenonov paradoks, pot odbijajoče se žoge, periodična decimalna števila kot ulomki.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Periodično decimalno število $1{,}2\overline{7}$ zapiši z vsoto geometrijske vrste in ga nato zapiši z okrajšanim ulomkom.

**Rešitev:**

1. $1{,}2\overline{7} = 1{,}2 + 0{,}07 + 0{,}007 + 0{,}0007 + \ldots$ Od drugega člena naprej je to geometrijska vrsta s prvim členom $0{,}07$ in količnikom $q = 0{,}1$.
2. Ker je $|q| < 1$, vrsta konvergira, njena vsota je $\dfrac{0{,}07}{1 - 0{,}1} = \dfrac{0{,}07}{0{,}9} = \dfrac{7}{90}$.
3. Seštejemo: $1{,}2 + \dfrac{7}{90} = \dfrac{108}{90} + \dfrac{7}{90} = \dfrac{115}{90} = \dfrac{23}{18}$.
4. Odgovor: $1{,}2\overline{7} = \dfrac{23}{18}$.

**Točkovanje:** 1 točka za zapis z geometrijsko vrsto (prvi člen in količnik), 1 točka za vsoto vrste $\dfrac{7}{90}$, 1 točka za okrajšan ulomek $\dfrac{23}{18}$.

### Naloga 2: krajša strukturirana naloga, 8 točk, pola 1 (brez računala)

Dana je vrsta $3 + 3(x - 2) + 3(x - 2)^2 + 3(x - 2)^3 + \ldots$, kjer je $x$ realno število.

a) Za katera realna števila $x$ vrsta konvergira? (2 točki)
b) Izračunaj vsoto vrste pri $x = \dfrac{3}{2}$. (2 točki)
c) Za kateri $x$ je vsota vrste enaka $4$? (2 točki)
d) Ali obstaja tak $x$, da je vsota vrste enaka $1$? Utemelji. (2 točki)

**Rešitev:**

1. a) Za $x \ne 2$ je to geometrijska vrsta s prvim členom $a_1 = 3$ in količnikom $q = x - 2$. Konvergira natanko tedaj, ko je $|x - 2| < 1$, torej $-1 < x - 2 < 1$.
2. a) Pri $x = 2$ je vrsta $3 + 0 + 0 + \ldots$: vse delne vsote so enake $3$, zato vrsta konvergira in ima vsoto $3$.
3. a) Vrsta konvergira za $1 < x < 3$, to je za $x \in (1, 3)$, vključno z $x = 2$.
4. b) Pri $x = \dfrac{3}{2}$ je $q = -\dfrac{1}{2}$ in $|q| < 1$, zato je $S = \dfrac{3}{1 - \left(-\frac{1}{2}\right)} = \dfrac{3}{\frac{3}{2}} = 2$.
5. c) Za $x \in (1, 3)$ je vsota $S = \dfrac{3}{1 - (x - 2)} = \dfrac{3}{3 - x}$ (tudi pri $x = 2$, kjer je $S = 3$). Iz enačbe $\dfrac{3}{3 - x} = 4$ sledi $3 - x = \dfrac{3}{4}$ in $x = \dfrac{9}{4}$.
6. c) Preverimo pogoj konvergence: $\dfrac{9}{4}$ leži na intervalu $(1, 3)$, količnik je $q = \dfrac{1}{4}$, vsota pa $\dfrac{3}{3/4} = 4$.
7. d) Enačba $\dfrac{3}{3 - x} = 1$ ima edino rešitev $x = 0$. Ta ne leži na intervalu $(1, 3)$: pri $x = 0$ je $q = -2$, vrsta divergira in vsote nima.
8. Odgovor: a) vrsta konvergira za $1 < x < 3$; b) vsota je $2$; c) $x = \dfrac{9}{4}$; d) ne, takega $x$ ni.

**Točkovanje:** a) 1 točka za količnik $q = x - 2$ in pogoj $|q| < 1$, 1 točka za interval $(1, 3)$ (interval brez $x = 2$ te točke ne dobi, ker vrsta pri $x = 2$ konvergira z vsoto $3$); b) 1 točka za količnik $q = -\dfrac{1}{2}$, 1 točka za vsoto $2$; c) 1 točka za enačbo $\dfrac{3}{3 - x} = 4$, 1 točka za $x = \dfrac{9}{4}$; d) 1 točka za rešitev enačbe $x = 0$, 1 točka za utemeljitev, da pri $x = 0$ vrsta divergira (enakovredno: za $1 < x < 3$ je $3 - x < 2$, zato je vsota $\dfrac{3}{3 - x}$ večja od $\dfrac{3}{2}$ in ne more biti $1$).

### Ustno vprašanje 1

:::premisli
Kako se vrsta razlikuje od zaporedja in kdaj pravimo, da vrsta konvergira?
---
Zaporedje je urejen seznam členov $a_1, a_2, a_3, \ldots$, vrsta pa je izraz $a_1 + a_2 + a_3 + \ldots$, v katerem te člene seštevamo v neskončnost. Vsoti prvih $n$ členov $S_n = a_1 + a_2 + \ldots + a_n$ rečemo $n$-ta delna vsota. Vrsta konvergira, če ima zaporedje delnih vsot $(S_n)$ limito $S$, ki ji rečemo vsota vrste. Če te limite ni, vrsta divergira in vsote nima.
:::

### Ustno vprašanje 2

:::premisli
Izpelji formulo za vsoto geometrijske vrste in navedi pogoj, pri katerem velja.
---
Za $q \ne 1$ je $n$-ta delna vsota geometrijske vrste $S_n = a_1 \cdot \dfrac{1 - q^n}{1 - q}$. Če je $|q| < 1$, gre $q^n$ proti $0$, ko gre $n$ proti neskončnosti. Zato delne vsote konvergirajo k vsoti $S = \dfrac{a_1}{1 - q}$. Formula velja le pri $|q| < 1$, pri $|q| \ge 1$ in $a_1 \ne 0$ pa vrsta divergira.
:::

### Ustno vprašanje 3

:::premisli
Navedi primer divergentne geometrijske vrste z negativnim količnikom in pojasni, zakaj nima vsote.
---
Primer je vrsta $1 - 2 + 4 - 8 + \ldots$ s količnikom $q = -2$. Njene delne vsote so $1, -1, 3, -5, \ldots$ in skačejo vse dlje gor in dol. Zaporedje delnih vsot zato nima limite in vrsta divergira. Formula $\dfrac{a_1}{1 - q}$ bi dala $\dfrac{1}{3}$, vendar je ne smemo uporabiti, ker je $|q| > 1$.
:::

## Drugače: Z analogijo

Imaš tablico čokolade. Poješ polovico. Od ostanka poješ spet polovico, nato polovico novega ostanka in tako naprej.

Po prvem koraku si pojedel $\frac{1}{2}$, po drugem $\frac{3}{4}$, po tretjem $\frac{7}{8}$ tablice. Na krožniku vsakič ostane polovica tega, kar je bilo prej. Ostanek se krči proti nič, zato se pojedeni del bliža celi tablici. Več kot ena tablica ne more biti, ker jemlješ vedno le iz iste.

To je vrsta $\frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \dots$ s $q = \frac{1}{2}$. Formula pove isto: $\frac{1/2}{1 - 1/2} = 1$.

Kaj pa $q \ge 1$? To je, kot da bi ti vsak dan nekdo prinesel novo tablico, enako veliko ali še večjo. Tvoja pojedena količina bi rasla brez meje. Vrsta konvergira le, če se košček, ki ga dodaš, sorazmerno krči.

## Drugače: Bolj natančno

**Delna vsota.** Naj bo $S_n = a_1 + a_1 q + \dots + a_1 q^{n-1}$. Pomnožimo s $q$: $q S_n = a_1 q + \dots + a_1 q^n$. Razlika: $S_n - q S_n = a_1 - a_1 q^n$. Za $q \ne 1$ sledi $S_n = a_1 \cdot \frac{1 - q^n}{1 - q}$.

**Zakaj $q^n \to 0$ pri $|q| < 1$.** Zaporedje $x_n = |q|^n$ je padajoče ($x_{n+1} = |q|\,x_n \le x_n$) in navzdol omejeno z $0$. Monotono in omejeno zaporedje je konvergentno, recimo z limito $L$. Iz $x_{n+1} = |q|\,x_n$ v limiti dobimo $L = |q|\,L$. Ker je $|q| \ne 1$, je $L = 0$. Torej $S_n \to \frac{a_1}{1-q}$.

**Divergenca pri $|q| \ge 1$.** Če bi $S_n \to S$, bi tudi $S_{n-1} \to S$, zato bi šli členi $a_n = S_n - S_{n-1}$ proti $0$. Pri $|q| \ge 1$ in $a_1 \ne 0$ pa je $|a_n| = |a_1|\,|q|^{n-1} \ge |a_1| > 0$. Protislovje.

**Koliko členov je dovolj.** Napaka delne vsote je $S - S_n = \frac{a_1 q^n}{1 - q}$. Pri Ahilu po petih odsekih: $\frac{100 \cdot 0{,}1^5}{0{,}9} \approx 0{,}0011\,\mathrm{m}$, kar je približno milimeter.

**Trivialni primer.** Če je $a_1 = 0$, so vsi členi $0$ in vsota je $0$ za vsak $q$. Zato pri pogoju za divergenco vedno dodamo $a_1 \ne 0$.

## Preveri se

? Katera vrsta je izjema, ker edina **nima** vsote?
- $9 + 3 + 1 + \dots$
~ Tu je $q = \frac{1}{3}$, torej $|q| < 1$. Vrsta konvergira, vsota je $\frac{9}{1 - 1/3} = 13{,}5$.
- $10 - 5 + 2{,}5 - \dots$
~ Menjajoči predznaki ne pomenijo divergence. $q = -\frac{1}{2}$, $|q| < 1$, vsota je $\frac{20}{3}$.
+ $1 - 1 + 1 - 1 + \dots$
- $0{,}5 + 0{,}05 + 0{,}005 + \dots$
~ Tu je $q = 0{,}1$; vrsta konvergira k $\frac{0{,}5}{0{,}9} = \frac{5}{9}$.
> Pri $1 - 1 + 1 - \dots$ je $q = -1$, torej $|q| = 1$. Delne vsote $1, 0, 1, 0, \dots$ se ne ustalijo, zato vrsta divergira.

? Zakaj ima geometrijska vrsta z $|q| < 1$ končno vsoto?
- Ker ima končno mnogo členov.
~ Vrsta ima neskončno mnogo členov. Končna je vsota, ne število členov.
+ Ker gre $q^n$ proti $0$, zato se delne vsote bližajo številu $\frac{a_1}{1 - q}$.
- Ker so vsi njeni členi pozitivni.
~ Pozitivni členi ne zadoščajo ($1 + 1 + 1 + \dots$ divergira), konvergira pa tudi vrsta z negativnim $q$.
- Ker je prvi člen dovolj majhen.
~ Prvi člen vpliva le na velikost vsote. O konvergenci odloča količnik $q$.
> V $S_n = a_1 \cdot \frac{1 - q^n}{1 - q}$ gre pri $|q| < 1$ potenca $q^n$ proti $0$, zato gre $S_n$ proti $\frac{a_1}{1 - q}$.

? Koliko je vsota vrste $20 + 15 + 11{,}25 + \dots$?
- $46{,}25$
~ To je le vsota treh napisanih členov. Vrsta se nadaljuje v neskončnost.
- približno $11{,}43$
~ To je $\frac{20}{1 + 0{,}75}$. V imenovalcu je $1 - q$, ne $1 + q$.
+ $80$
- Vsote ni, ker so vsi členi pozitivni in jih je neskončno.
~ To je Zenonova napaka. Pri $|q| < 1$ so delne vsote omejene in vrsta konvergira.
> $q = \frac{15}{20} = 0{,}75$, $S = \frac{20}{1 - 0{,}75} = \frac{20}{0{,}25} = 80$.

? Rok je izračunal vsoto vrste $3 + 6 + 12 + \dots$ takole: (1) $q = \frac{6}{3} = 2$; (2) $S = \frac{a_1}{1 - q}$; (3) $S = \frac{3}{1 - 2} = -3$. Kateri korak je napačen?
- Korak (1).
~ Količnik je pravilen: $\frac{6}{3} = \frac{12}{6} = 2$.
+ Korak (2): formula velja le pri $|q| < 1$, tu je $q = 2$ in vrsta divergira.
- Korak (3).
~ Račun $\frac{3}{-1} = -3$ je pravilen. Napaka je prej: formule tu sploh ne smemo uporabiti.
- Noben, vsota je res $-3$.
~ Vsota pozitivnih števil ne more biti negativna. Delne vsote $3, 9, 21, \dots$ rastejo brez meje.
> Pri $q = 2$ je $|q| > 1$, zato vrsta divergira. Formula $S = \frac{a_1}{1-q}$ tu ne velja.

? Teniško žogico spustimo z višine $1\,\mathrm{m}$. Po vsakem odboju se dvigne do polovice prejšnje višine. Kolikšno pot opravi, preden obmiruje?
- $2\,\mathrm{m}$
~ To je $\frac{1}{1 - 0{,}5}$. Pozabil si, da vsako višino po odboju žogica prepotuje dvakrat, gor in dol.
+ $3\,\mathrm{m}$
- $4\,\mathrm{m}$
~ Tu je tudi prvi padec štet dvakrat. Prvih $1\,\mathrm{m}$ žogica opravi le navzdol.
- Neskončno, ker se odbija neskončnokrat.
~ Neskončno mnogo odbojev še ne pomeni neskončne poti. Višine tvorijo vrsto s $q = 0{,}5$, ki konvergira.
> Prvi padec $1\,\mathrm{m}$, dvigi $0{,}5 + 0{,}25 + \dots = \frac{0{,}5}{1 - 0{,}5} = 1\,\mathrm{m}$, ki jih žogica prepotuje dvakrat: $s = 1\,\mathrm{m} + 2 \cdot 1\,\mathrm{m} = 3\,\mathrm{m}$.

<<RACUN
vrednost: 0.07/(1-0.1) | 7/90
vrednost: 6/5+7/90 | 23/18
vrednost: 115/90 | 23/18
neenacba: abs(x-2)<1 | x | (1, 3)
vrednost: 3/(1-(-1/2)) | 2
vrednost: 3/(3-2) | 3
enako: 3/(1-(x-2)) | 3/(3-x)
resi: 3/(3-x)=4 | x | 9/4
vrednost: 3/(1-1/4) | 4
resi: 3/(3-x)=1 | x | 0
vrednost: 1-2+4-8 | -5
vrednost: 1/(1-(-2)) | 1/3
>>

:::simboli
a_1 | prvi člen vrste | |
a_2, a_3, a_4 | drugi, tretji, četrti člen vrste | a_{n+1} = a_n \cdot q |
q | količnik | q = \dfrac{a_{n+1}}{a_n} | | vrsta konvergira natanko pri $|q| < 1$
n | število seštetih členov | |
S_n | $n$-ta delna vsota | S_n = a_1 \cdot \dfrac{1 - q^n}{1 - q} |
S | vsota vrste | S = \dfrac{a_1}{1 - q} | | limita delnih vsot $S_n$
h_0 | začetna višina žoge | | m
h_1, h_2, h_3 | višine zaporednih dvigov žoge | h_{k+1} = q \cdot h_k | m
s | celotna pot žoge | s = h_0 + 2\,(h_1 + h_2 + \dots) | m
:::
