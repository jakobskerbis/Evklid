---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Vzemi list papirja, debel približno $0{,}1\,\text{mm}$, in ga prepogni na pol. Kup je zdaj debel $0{,}2\,\text{mm}$. Še en pregib: $0{,}4\,\text{mm}$. Vsak pregib debelino podvoji.

**Uganka, preden bereš naprej:** recimo, da bi lahko papir pregibal poljubno mnogokrat. Kolikokrat bi ga moral prepogniti, da bi kup segel do Lune, približno $384\,400\,\text{km}$ daleč? Zapiši svojo oceno. Sto pregibov? Tisoč? Milijon?

Večina ugiba veliko preveč. Dovolj je $42$ pregibov! Po $41$ pregibih bi bil kup visok približno $220\,000\,\text{km}$, po $42$ pa približno $440\,000\,\text{km}$, kar je že dlje od Lune. V resnici papirja ne moreš prepogniti več kot nekajkrat, račun pa vseeno drži.

Število plasti po $42$ pregibih je produkt dvainštiridesetih dvojk. Takega produkta nihče ne piše na dolgo. Zanj imamo kratek zapis, **potenco**. Astronomi jo potrebujejo ves čas, saj so razdalje in števila zvezd v vesolju ogromni.

## Razlaga

**1. Staro in novo drugo ob drugem.** Množenje že poznaš kot kratek zapis za seštevanje enakih seštevancev: $4 + 4 + 4 = 3 \cdot 4$. Potenca naredi isto z množenjem enakih faktorjev: $4 \cdot 4 \cdot 4 = 4^3$. Razlike so pomembnejše od podobnosti:

| | množenje | potenca |
|---|---|---|
| skrajša | seštevanje enakih števil | množenje enakih števil |
| primer | $4 + 4 + 4 = 12$ | $4 \cdot 4 \cdot 4 = 64$ |
| število $3$ pove | koliko je seštevancev | koliko je faktorjev |
| zamenjava števil | $3 \cdot 4 = 4 \cdot 3$ | $4^3 \ne 3^4$ |

Zadnja vrstica je presenečenje: $4^3 = 64$, $3^4 = 81$. Pri potenci vloge števil ne smeš zamenjati.

**2. Imena.** Produkt $n$ enakih faktorjev $a$ zapišemo kot potenco:

$$a^n = \underbrace{a \cdot a \cdot \ldots \cdot a}_{n \text{ faktorjev}}$$

- $a$ je **osnova**, število, ki ga množimo samo s seboj;
- $n$ je **eksponent**, naravno število, ki pove, koliko faktorjev je v produktu;
- $a^n$ je **potenca**; število, ki ga dobimo, je **vrednost potence**.

$5^3$ beremo »pet na tretjo«: $5^3 = 5 \cdot 5 \cdot 5 = 125$. Pri eksponentu $2$ rečemo »na kvadrat«, pri $3$ »na kub«. Potenca z eksponentom $1$ je kar osnova: $a^1 = a$.

Glavna razlika od množenja: eksponent ni faktor. $2^4$ ni $2 \cdot 4 = 8$, ampak $2 \cdot 2 \cdot 2 \cdot 2 = 16$.

:::premisli
Kaj je večje: $2^5$ ali $5^2$? Najprej napovej, nato izračunaj.
---
$2^5 = 2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 = 32$ in $5^2 = 5 \cdot 5 = 25$, zato je $2^5$ večje. Pri množenju je vseeno, kako števili obrneš ($2 \cdot 5 = 5 \cdot 2$), pri potenci pa zamenjava osnove in eksponenta da drugo število.
:::

V simulaciji spodaj (Potence) postavi osnovo na $2$ in premikaj eksponent od $1$ do $6$. Opazi: vsak naslednji stolpec je **dvakrat** višji, ne za $2$ višji. Večkratniki števila $2$ rastejo s prištevanjem ($2, 4, 6, 8$), potence števila $2$ pa z množenjem ($2, 4, 8, 16$). Nato nastavi osnovo $-2$ in poglej, kdaj je vrednost negativna.

**3. Negativna osnova.** Pravilo za predznak pri množenju že znaš: dva negativna faktorja dasta pozitiven produkt. Pri potenci z negativno osnovo zato štejemo faktorje:

- $(-2)^3 = (-2) \cdot (-2) \cdot (-2) = -8$: lih eksponent, vrednost je negativna;
- $(-2)^4 = (-2) \cdot (-2) \cdot (-2) \cdot (-2) = 16$: sod eksponent, vrednost je pozitivna.

Negativno osnovo vedno pišemo v oklepaju. Zapis $-2^4$ pomeni $-(2^4) = -16$: minus tu ni del osnove, ampak predznak pred celo potenco.

**4. Množenje potenc z enako osnovo.** Razpiši $2^3 \cdot 2^2$:

$$2^3 \cdot 2^2 = (2 \cdot 2 \cdot 2) \cdot (2 \cdot 2) = 2^5$$

Faktorje smo le postavili v isto vrsto, zato je teh $3 + 2 = 5$. Velja v splošnem:

$$a^m \cdot a^n = a^{m+n}$$

Osnovo prepišemo, eksponenta seštejemo. Primer: $3^2 \cdot 3^4 = 3^6 = 729$. Opazi kontrast: pri potencah se množenje spremeni v seštevanje eksponentov, torej v računsko operacijo »stopnjo nižje«.

:::premisli
Zakaj bi bilo $2^3 \cdot 2^4 = 2^{12}$ napačno? Razmisli, koliko faktorjev $2$ je v produktu.
---
V $2^3$ so trije faktorji $2$, v $2^4$ štirje. V produktu stojijo drug ob drugem, zato jih je $3 + 4 = 7$: $2^3 \cdot 2^4 = 2^7 = 128$. Eksponent $12$ bi štel faktorje, ki jih ni. Števila faktorjev se seštevajo, ne množijo.
:::

**5. Deljenje potenc z enako osnovo.** Razpiši $5^5 : 5^2$ kot ulomek:

$$\frac{5 \cdot 5 \cdot 5 \cdot 5 \cdot 5}{5 \cdot 5} = 5 \cdot 5 \cdot 5 = 5^3$$

Dva faktorja v imenovalcu smo pokrajšali z dvema v števcu, ostali so $5 - 2 = 3$ faktorji. Za $m > n$ in $a \ne 0$ velja:

$$a^m : a^n = a^{m-n}$$

Osnovo prepišemo, eksponenta odštejemo. Primer: $5^7 : 5^3 = 5^4 = 625$. Spet kontrast: deljenje potenc postane odštevanje eksponentov. Pogoj $a \ne 0$ je potreben, ker z $0$ ne delimo.

**6. Kje pravili ne veljata.** Obe pravili veljata samo, ko sta osnovi **enaki**. Izraza $2^3 \cdot 3^4$ ne moremo zapisati kot eno potenco. Pravili veljata tudi le za množenje in deljenje, ne za seštevanje: $2^3 + 2^2 = 8 + 4 = 12$, $2^5$ pa je $32$.

## Rešeni primeri

### Primer 1: zapis in vrednost potence

a) Zapiši $7 \cdot 7 \cdot 7 \cdot 7$ kot potenco.
b) Izračunaj vrednost potence $3^4$.
c) Izračunaj $(-2)^5$.

**Podatki:** produkt $7 \cdot 7 \cdot 7 \cdot 7$, potenci $3^4$ in $(-2)^5$
**Iščemo:** zapis produkta kot potence ter vrednosti obeh potenc

:::formula
$a^n = a \cdot a \cdot \ldots \cdot a$ ($n$ faktorjev); pri negativni osnovi lih eksponent da negativno vrednost.
:::

**Rešitev:**

1. a) Faktor $7$ se pojavi štirikrat, zato je osnova $7$ in eksponent $4$: $7^4$.
2. b) Razpišemo $3^4 = 3 \cdot 3 \cdot 3 \cdot 3$ in množimo po korakih, da se ne zmotimo: $3 \cdot 3 = 9$, $9 \cdot 3 = 27$, $27 \cdot 3 = 81$.
3. c) Osnova je negativna, eksponent $5$ pa lih, zato bo vrednost negativna. Absolutna vrednost je $2^5 = 32$.
4. Odgovor: $7 \cdot 7 \cdot 7 \cdot 7 = 7^4$, $3^4 = 81$ in $(-2)^5 = -32$.

### Primer 2: pravili za množenje in deljenje

Zapiši kot eno potenco in izračunaj vrednost:

a) $2^3 \cdot 2^4$
b) $5^6 : 5^4$
c) $a^5 \cdot a^2$ (samo zapis kot ena potenca)

**Podatki:** izrazi $2^3 \cdot 2^4$, $5^6 : 5^4$ in $a^5 \cdot a^2$
**Iščemo:** vsak izraz kot eno potenco, pri a) in b) še vrednost

:::formula
$a^m \cdot a^n = a^{m+n}$ in $a^m : a^n = a^{m-n}$ (enaka osnova, $m > n$)
:::

**Rešitev:**

1. a) Osnovi sta enaki, zato eksponenta seštejemo: $2^3 \cdot 2^4 = 2^{3+4} = 2^7 = 128$.
2. Preizkus: $2^3 = 8$, $2^4 = 16$ in $8 \cdot 16 = 128$. ✓
3. b) Osnovi sta enaki, zato eksponenta odštejemo: $5^6 : 5^4 = 5^{6-4} = 5^2 = 25$.
4. Preizkus: $5^6 = 15\,625$, $5^4 = 625$ in $15\,625 : 625 = 25$. ✓
5. c) Osnova je pri obeh $a$, zato $a^5 \cdot a^2 = a^{5+2} = a^7$.
6. Odgovor: $2^7 = 128$, $5^2 = 25$ in $a^7$.

### Primer 3: podatki iz vesoljske sonde

Vesoljska sonda je posnela $2^5$ fotografij planeta. Vsaka fotografija zasede $2^{20}$ bajtov. Sonda pošilja podatke proti Zemlji s hitrostjo $2^{15}$ bajtov na sekundo. Koliko bajtov mora poslati in koliko časa traja prenos?

**Podatki:** število fotografij $2^5$, velikost ene fotografije $2^{20}$ bajtov, hitrost prenosa $2^{15}$ bajtov na sekundo
**Iščemo:** vse poslane bajte in čas prenosa

:::formula
$a^m \cdot a^n = a^{m+n}$ za vse bajte, nato $a^m : a^n = a^{m-n}$ za čas
:::

**Rešitev:**

1. Vse bajte dobimo, ko število fotografij pomnožimo z velikostjo ene. Osnova je pri obeh $2$, zato eksponenta seštejemo: $2^5 \cdot 2^{20} = 2^{25}$ bajtov.
2. Čas dobimo, ko vse bajte delimo s številom bajtov, ki jih sonda pošlje v eni sekundi: $2^{25} : 2^{15} = 2^{10}$ sekund.
3. Vrednost: $2^{10} = 1024\,\text{s}$.
4. Ker je $17 \cdot 60 = 1020$, je to $17\,\text{min}$ in $4\,\text{s}$.
5. Odgovor: sonda pošlje $2^{25}$ bajtov (to je $33\,554\,432$ bajtov), prenos traja $1024\,\text{s}$, približno $17$ minut. S pravili za potence nam teh velikih števil ni bilo treba množiti.

### Primer 4: zdaj ti

List papirja, debel $0{,}1\,\text{mm}$, prepogneš $10$-krat. Vsak pregib podvoji število plasti. Kako debel je kup?

**Podatki:** debelina lista $0{,}1\,\text{mm}$, število pregibov $10$, vsak pregib podvoji število plasti
**Iščemo:** debelino kupa po $10$ pregibih

:::formula
Po $n$ pregibih je $2^n$ plasti; debelina kupa je $0{,}1\,\text{mm} \cdot 2^n$.
:::

**Rešitev:**

1. Po $1$ pregibu sta $2$ plasti, po $2$ pregibih $2 \cdot 2 = 2^2 = 4$, po $3$ pregibih $2^3 = 8$. Po $n$ pregibih je plasti $2^n$.
2. Po $10$ pregibih je plasti $2^{10}$. Račun si olajšaš s pravilom za množenje: $2^{10} = 2^5 \cdot 2^5$.
3. Izračunaj število plasti in debelino sam, nato preveri:

:::premisli
Napovej najprej: bo kup po $10$ pregibih tanjši ali debelejši od $1\,\text{cm}$? Nato izračunaj število plasti in debelino kupa.
---
$2^5 = 32$, zato je $2^{10} = 32 \cdot 32 = 1024$ plasti. Debelina: $1024 \cdot 0{,}1\,\text{mm} = 102{,}4\,\text{mm}$, približno $10\,\text{cm}$, torej precej debelejši od $1\,\text{cm}$. Iz tankega lista po samo desetih pregibih nastane kup, debel kot dlan.
:::

## Pogoste napake

- **Eksponent kot faktor.** Učenec računa $2^4 = 2 \cdot 4 = 8$, kot da bi šlo za množenje. Eksponent pa pove, koliko je faktorjev: $2^4 = 2 \cdot 2 \cdot 2 \cdot 2 = 16$. Če nisi prepričan, potenco razpiši.
- **Eksponente množiš ali deliš.** Učenec piše $a^3 \cdot a^2 = a^6$ ali $a^6 : a^2 = a^3$. Ko produkt razpišeš, vidiš $3 + 2 = 5$ faktorjev, pri deljenju pa se pokrajšata $2$ od $6$ faktorjev in ostanejo $4$. Pravilno: $a^5$ in $a^4$.
- **Množiš tudi osnovi.** Učenec piše $2^3 \cdot 2^4 = 4^7$, ker »množi vse, kar vidi«. Osnova pove, kateri faktor se ponavlja, in ta ostane $2$: $2^7$.
- **Pravilo za različne osnove ali za vsoto.** Učenec piše $2^3 \cdot 3^2 = 6^5$ ali $2^3 + 2^2 = 2^5$. Pravili veljata samo za množenje in deljenje potenc z enako osnovo. Take izraze izračunaš po vrsti: $8 \cdot 9 = 72$ in $8 + 4 = 12$.
- **Minus brez oklepaja.** Učenec misli, da je $-3^2 = 9$. Brez oklepaja potenciramo samo $3$, minus ostane pred rezultatom: $-3^2 = -9$, $(-3)^2 = 9$.

## Povzetek

- Potenca $a^n$ je produkt $n$ enakih faktorjev $a$; $a$ je osnova, $n$ eksponent. $a^1 = a$.
- Eksponent ni faktor: $2^4 = 16$, ne $8$. Osnove in eksponenta ne smemo zamenjati: $4^3 \ne 3^4$.
- Negativna osnova: sod eksponent da pozitivno vrednost, lih negativno. Negativno osnovo pišemo v oklepaju; $-2^4 = -16$, $(-2)^4 = 16$.
- Množenje potenc z enako osnovo: $a^m \cdot a^n = a^{m+n}$.
- Deljenje potenc z enako osnovo: $a^m : a^n = a^{m-n}$ (za $m > n$, $a \ne 0$).
- Pravili ne veljata za različne osnove in ne za seštevanje potenc.

## Drugače: Na sliki

Eksponenta $2$ in $3$ imata geometrijski pomen.

- $5^2$: kvadrat s stranico $5$ ima $5$ vrstic po $5$ ploščic, skupaj $25$ ploščic. Zato pravimo »na kvadrat«.
- $3^3$: kocka z robom $3$ ima $3$ plasti, v vsaki je $3 \cdot 3 = 9$ kockic, skupaj $27$ kockic. Zato pravimo »na kub«.

Tudi pravilo za množenje lahko »vidiš«. Faktorje nariši kot kroglice na vrvici:

$$\underbrace{2 \cdot 2 \cdot 2}_{3} \cdot \underbrace{2 \cdot 2}_{2} = \underbrace{2 \cdot 2 \cdot 2 \cdot 2 \cdot 2}_{5}$$

Dve vrvici zvežeš v eno. Kroglic je $3 + 2 = 5$, zato je eksponent vsota. Pri deljenju z ene vrvice kroglice snameš: od petih jih vzameš dve in ostanejo tri.

## Drugače: Iz vsakdanjega življenja

**Verižno sporočilo.** Prejmeš sporočilo in ga posreduješ trem prijateljem. Vsak od njih ga pošlje trem novim osebam in tako naprej.

- V 1. krogu ga prejmejo $3$ osebe: $3^1 = 3$.
- V 2. krogu ga prejme $3 \cdot 3 = 3^2 = 9$ oseb.
- V 3. krogu ga prejme $3^3 = 27$ oseb.
- V 4. krogu ga prejme $3^4 = 81$ oseb.

Število narašča zelo hitro, ker se v vsakem krogu pomnoži s $3$. Prav tako hitro se širijo govorice in se razmnožujejo bakterije.

**Deljenje.** V 5. krogu sporočilo prejme $3^5 = 243$ oseb, v 3. krogu $3^3 = 27$ oseb. Peti krog je večji za faktor $3^5 : 3^3 = 3^2 = 9$. Res: $243 : 27 = 9$. Med 3. in 5. krogom sta minila dva kroga, zato se je število dvakrat pomnožilo s $3$.

## Preveri se

? Katera trditev o potenci $5^3$ je pravilna?
- $5^3$ pomeni $5 \cdot 3$.
~ Eksponent ni faktor. Pove, kolikokrat zapišemo osnovo kot faktor.
- Osnova je $3$, eksponent je $5$.
~ Osnova je spodaj, eksponent zgoraj desno. Tu je osnova $5$.
+ Osnova je $5$, eksponent je $3$, potenca pomeni $5 \cdot 5 \cdot 5$.
- $5^3$ je enako $3^5$.
~ Pri potenci osnove in eksponenta ne smemo zamenjati: $5^3 = 125$, $3^5 = 243$.
> $5^3 = 5 \cdot 5 \cdot 5 = 125$: osnova $5$ se kot faktor pojavi trikrat.

? Koliko je $2^3 \cdot 2^2$?
- $12$
~ To je $8 + 4$. Potenci množimo, ne seštevamo: $8 \cdot 4 = 32$.
- $64$
~ To je $2^6$: eksponenta si zmnožil. Pri množenju ju seštejemo.
+ $32$
- $1024$
~ To je $4^5$: zmnožil si tudi osnovi. Osnova ostane $2$.
> $2^3 \cdot 2^2 = 2^{3+2} = 2^5 = 32$. Preizkus: $8 \cdot 4 = 32$.

? Tim je računal: $3^8 : 3^2 = 3^4 = 81$. Kje je napaka?
- Napaka je v zadnjem koraku, $3^4$ ni $81$.
~ $3^4 = 3 \cdot 3 \cdot 3 \cdot 3 = 81$ je pravilno. Napaka je prej.
- Deliti bi moral tudi osnovi, $3 : 3 = 1$.
~ Osnova se pri deljenju potenc ne spremeni, ostane $3$.
+ Eksponenta je delil, moral bi ju odšteti: $3^8 : 3^2 = 3^6 = 729$.
- Napake ni.
~ Razpiši: od osmih faktorjev $3$ se pokrajšata dva, ostane jih šest, ne štirje.
> $3^8 : 3^2 = 3^{8-2} = 3^6 = 729$. Eksponenta pri deljenju odštejemo.

? Primerjaj $-2^4$ in $(-2)^4$. Kaj velja?
- Obe sta enaki $16$.
~ Brez oklepaja minus ni del osnove: $-2^4 = -(2 \cdot 2 \cdot 2 \cdot 2) = -16$.
- Obe sta enaki $-16$.
~ V $(-2)^4$ so štirje negativni faktorji; sodo mnogo negativnih faktorjev da pozitiven produkt, $16$.
+ $-2^4 = -16$ in $(-2)^4 = 16$, zato je $-2^4 < (-2)^4$.
> Pri $(-2)^4$ je osnova $-2$ in eksponent sod, vrednost je $16$. Pri $-2^4$ potenciramo samo $2$ in rezultatu dodamo minus: $-16$.

? Astronomi so posnetek neba razdelili na $4^3$ enakih polj. V vsakem polju je približno $4^2$ zvezd. Koliko zvezd je približno na posnetku?
- $80$
~ To je $64 + 16$. Število zvezd dobiš z množenjem: polja krat zvezde v polju.
- $4096$
~ To je $4^6$: eksponenta si zmnožil, namesto da bi ju seštel.
- $16^5$
~ Zmnožil si tudi osnovi. Osnova ostane $4$.
+ $1024$
> $4^3 \cdot 4^2 = 4^{3+2} = 4^5 = 1024$. Preizkus: $64 \cdot 16 = 1024$.

:::simboli
a | osnova potence | | | število, ki ga množimo samo s seboj
m, n | eksponent | | | naravno število; pove število faktorjev, pri deljenju $m > n$
:::
