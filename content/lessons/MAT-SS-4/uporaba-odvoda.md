---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pek prodaja rogljičke po $1\,€$ in jih vsak dan proda $300$. Ugotovil je, da ga vsakih $10$ centov podražitve stane $20$ kupcev. Po $1{,}50\,€$ bi jih torej prodal le še $200$.

Presenečenje: pri obeh cenah zasluži natanko enako, $300\,€$ na dan. Petdeset odstotkov dražje, isti denar. Še bolj čudno je, da obstaja cena *med* njima, pri kateri zasluži več kot pri obeh.

Kje je ta cena in kako jo najdemo brez ugibanja? Odgovor da odvod. Iz njega razberemo, kje funkcija narašča, kje pada in kje doseže vrh. Enako trgovci iščejo najboljšo ceno, proizvajalci najcenejšo embalažo, inženirji najmanjšo porabo.

## Razlaga

**Tabela namesto formule.** Naj bo $x$ cena rogljička v evrih. Vsak evro podražitve odžene $200$ kupcev ($20$ na vsakih $10$ centov), zato je prodanih $300 - 200(x - 1) = 500 - 200x$ kosov. Prihodek je cena krat število kosov:

| cena $x$ [€] | prodanih kosov | prihodek [€] |
|---|---|---|
| $1{,}00$ | $300$ | $300{,}00$ |
| $1{,}10$ | $280$ | $308{,}00$ |
| $1{,}20$ | $260$ | $312{,}00$ |
| $1{,}25$ | $250$ | $312{,}50$ |
| $1{,}30$ | $240$ | $312{,}00$ |
| $1{,}40$ | $220$ | $308{,}00$ |
| $1{,}50$ | $200$ | $300{,}00$ |

Prihodek najprej raste, potem pada. Vrh je pri $1{,}25\,€$. Okoli vrha se številke skoraj ne spreminjajo: pri $1{,}20\,€$ in $1{,}30\,€$ je prihodek enak.

**Slika grafa.** Nariši točke iz tabele. Dobiš lok, ki se dviga, se na vrhu za trenutek izravna in se spusti. Na levem pobočju bi tangenta kazala navzgor, na desnem navzdol. Kaj pa na samem vrhu?

:::premisli
Kolikšen je smerni koeficient tangente na vrhu loka? Zakaj ravno toliko?
---
Enak je $0$. Levo od vrha so smerni koeficienti pozitivni, desno negativni. Ko se predznak zamenja, gre koeficient skozi $0$, tangenta je vodoravna.
:::

**Tangenta.** Iz lekcije o odvodu veš, da je $f'(a)$ smerni koeficient tangente na graf v točki $\bigl(a, f(a)\bigr)$. Premica skozi to točko s tem naklonom ima enačbo

$$y = f(a) + f'(a)\,(x - a)$$

Za rogljičke je prihodek $R(x) = 500x - 200x^2$ in $R'(x) = 500 - 400x$. Pri ceni $1\,€$ je $R'(1) = 100$. Tangenta tam je $y = 300 + 100(x - 1)$ oziroma $y = 100x + 200$. Število $100$ pove: pri majhni podražitvi prihodek raste približno za $100\,€$ na vsak evro podražitve, torej približno $1\,€$ na vsak cent.

**Naraščanje in padanje.** Predznak odvoda pove smer grafa:

- $f'(x) > 0$ na intervalu: funkcija tam **narašča**,
- $f'(x) < 0$ na intervalu: funkcija tam **pada**.

Za rogljičke narišemo številsko premico za ceno in nad njo predznake $R'$:

:::risba premica
opis: Številska premica za ceno x od 1,00 do 1,50 €. Od 1,00 do 1,25 je R′(x) > 0 in prihodek narašča, pri 1,25 je R′(x) = 0 in vrh, od 1,25 do 1,50 je R′(x) < 0 in prihodek pada.
od: 1
do: 1,5
korak: 0,05
oznake: 0,25
oznaka: 1 | 1,00
oznaka: 1,5 | 1,50
interval: 1 .. 1,25 | R′ > 0 | zelena
interval: 1,25 .. 1,5 | R′ < 0 | rdeča
točka: 1,25 | vrh | oranžna
podnapis: Cena x v evrih. Levo od 1,25 prihodek R narašča, desno pada; pri 1,25 je R′(x) = 0 in vrh.
:::

**Ekstremi.** Točko, v kateri je $f'(a) = 0$, imenujemo **stacionarna točka**. Če odvod v njej spremeni predznak iz $+$ v $-$, ima funkcija tam **lokalni maksimum**; če iz $-$ v $+$, **lokalni minimum**. Skupno ime je **ekstrem**. Lokalni pomeni »največji (oziroma najmanjši) v okolici«, ne nujno največji ali najmanjši sploh.

V simulaciji spodaj, »Odvod, naraščanje in ekstremi«, vleci točko po grafu od leve proti desni. Opazuj, kje je tangenta vodoravna in kakšen predznak ima odvod tik pred to točko in tik za njo.

:::premisli
Funkcija $f(x) = x^3$ ima $f'(0) = 0$. Ali ima pri $x = 0$ ekstrem? Napovej, preden računaš.
---
Nima. $f'(x) = 3x^2$ je levo in desno od $0$ pozitiven, predznak se ne zamenja. Funkcija ves čas narašča, v točki $0$ se le za trenutek izravna (»terasa«).
:::

**Ekstremalni problem.** Pri besedilni nalogi najprej sestaviš funkcijo ene spremenljivke, ki jo hočeš povečati ali zmanjšati. Nato določiš, katere vrednosti spremenljivke so smiselne (cena ne more biti negativna, kosov ne more biti manj kot nič). Na koncu poiščeš stacionarne točke, preveriš predznak odvoda in primerjaš še vrednosti na robovih intervala.

## Rešeni primeri

### Primer 1 (lažji): tangenta

Zapiši enačbo tangente na graf funkcije $f(x) = x^3 - 3x$ v točki z absciso $a = 2$.

**Podatki:** $f(x) = x^3 - 3x$, $a = 2$
**Iščemo:** enačbo tangente $y = kx + n$

:::formula
$y = f(a) + f'(a)\,(x - a)$
:::

**Rešitev:**

1. Ordinata dotikališča: $f(2) = 8 - 6 = 2$, točka je $(2, 2)$.
2. Odvajamo: $f'(x) = 3x^2 - 3$, šele nato vstavimo $2$.
3. Smerni koeficient: $f'(2) = 12 - 3 = 9$.
4. Vstavimo: $y = 2 + 9(x - 2) = 9x - 16$.
5. Odgovor: tangenta ima enačbo $y = 9x - 16$.

### Primer 2: kje narašča in kje so ekstremi

Za $f(x) = x^3 - 3x^2 - 9x + 2$ določi, kje narašča in kje pada, ter izračunaj lokalne ekstreme.

**Podatki:** $f(x) = x^3 - 3x^2 - 9x + 2$, definirana za vsa realna števila
**Iščemo:** intervale naraščanja in padanja, lokalne ekstreme

:::formula
$f'(x) > 0$: narašča, $f'(x) < 0$: pada; ekstrem, kjer $f'$ zamenja predznak
:::

**Rešitev:**

1. Odvod: $f'(x) = 3x^2 - 6x - 9 = 3(x + 1)(x - 3)$.
2. Stacionarni točki sta $x_1 = -1$ in $x_2 = 3$, ker je tam en od faktorjev enak $0$.
3. Predznak preverimo s po eno testno točko na vsakem intervalu:

| interval | testna točka | $f'$ | $f$ |
|---|---|---|---|
| $(-\infty, -1)$ | $-2$ | $15 > 0$ | narašča |
| $(-1, 3)$ | $0$ | $-9 < 0$ | pada |
| $(3, \infty)$ | $4$ | $15 > 0$ | narašča |

4. Pri $-1$ se predznak zamenja iz $+$ v $-$: lokalni maksimum $f(-1) = -1 - 3 + 9 + 2 = 7$.
5. Pri $3$ se zamenja iz $-$ v $+$: lokalni minimum $f(3) = 27 - 27 - 27 + 2 = -25$.
6. Odgovor: $f$ narašča na $(-\infty, -1)$ in $(3, \infty)$, pada na $(-1, 3)$; lokalni maksimum je $T_1(-1, 7)$, lokalni minimum $T_2(3, -25)$.

### Primer 3 (težji): najboljša cena v spletni trgovini

Spletna trgovina kupi slušalke po $20\,€$. Če jih prodaja po ceni $c$ evrov, jih na teden proda $600 - 10c$ kosov. Pri kateri ceni je tedenski dobiček največji in koliko znaša?

**Podatki:** nabavna cena $20\,€$/kos, prodaja $600 - 10c$ kosov na teden pri ceni $c$ [€]
**Iščemo:** ceno $c$ z največjim dobičkom $D$ in ta dobiček

:::formula
$D(c) = (c - 20)(600 - 10c)$, nato $D'(c) = 0$
:::

**Rešitev:**

1. Dobiček na kos je $c - 20$, zato je $D(c) = (c - 20)(600 - 10c) = -10c^2 + 800c - 12000$.
2. Smiselne cene: $c \ge 20$ (sicer izguba na kos) in $600 - 10c \ge 0$, torej $c \le 60$.
3. Odvod: $D'(c) = -20c + 800$; $D'(c) = 0$ pri $c = 40$.
4. Predznak: $D'(30) = 200 > 0$, $D'(50) = -200 < 0$, zato je pri $40$ maksimum.
5. Na robovih je $D(20) = 0$ in $D(60) = 0$, kar je manj.
6. Pri $c = 40$ proda $600 - 400 = 200$ kosov, $D(40) = 20 \cdot 200 = 4000$.
7. Odgovor: največji dobiček, $4000\,€$ na teden, doseže pri ceni $40\,€$.

### Primer 4: zdaj ti

Trgovina potrebuje odprte škatle. Iz kvadratnega kartona s stranico $30\,\mathrm{cm}$ v vsakem kotu izreže kvadrat s stranico $x$ in zapogne robove. Pri katerem $x$ ima škatla največjo prostornino?

**Podatki:** stranica kartona $30\,\mathrm{cm}$, izrezani kvadrati s stranico $x$ [cm]
**Iščemo:** $x$ z največjo prostornino $V$ in to prostornino

:::formula
$V(x) = x\,(30 - 2x)^2$, $\ 0 < x < 15$
:::

**Rešitev:**

1. Dno je kvadrat s stranico $30 - 2x$, višina je $x$, zato $V(x) = x(30 - 2x)^2$.
2. Po pravilu za produkt: $V'(x) = (30 - 2x)^2 + x \cdot 2(30 - 2x) \cdot (-2)$, kjer je $(-2)$ odvod notranje funkcije po verižnem pravilu.
   Torej $V'(x) = (30 - 2x)^2 - 4x(30 - 2x)$; izpostavimo $(30 - 2x)$ in dobimo $V'(x) = (30 - 2x)(30 - 6x)$.
3. Znotraj intervala je $V'(x) = 0$ le pri $x = 5$; $x = 15$ je rob, kjer škatle ni.
4. Preveri predznak in izračunaj prostornino sam:

:::premisli
Ali je pri $x = 5$ res maksimum in kolikšna je prostornina?
---
Za $x = 4$ sta oba faktorja pozitivna, $V' > 0$; za $x = 6$ je $30 - 6x < 0$, $V' < 0$. Predznak gre iz $+$ v $-$, torej maksimum. $V(5) = 5 \cdot 20^2 = 2000\,\mathrm{cm^3}$, to sta $2$ litra.
:::

## Pogoste napake

- **»Odvod je nič, torej je ekstrem.«** Pri $f(x) = x^3$ je $f'(0) = 0$, ekstrema pa ni, ker odvod ne zamenja predznaka. Vedno preveri predznak levo in desno od stacionarne točke.
- **Funkcija namesto števila v tangenti.** Kdor zapiše $y = f(a) + f'(x)(x - a)$, dobi krivuljo, ne premice. Smerni koeficient je *število* $f'(a)$: najprej odvajaj, nato vstavi $a$.
- **Pozitivna funkcija = naraščajoča funkcija.** Prihodek je pri $1{,}40\,€$ pozitiven, pa vseeno pada. O naraščanju odloča predznak $f'$, ne predznak $f$.
- **Abscisa namesto vrednosti.** »Največji dobiček je $40$« zamenja ceno z dobičkom. Ko najdeš ceno $c = 40$, jo vstavi v *funkcijo* $D$, ne v $D'$, ki tam da $0$.
- **Pozabljeni robovi.** Pri ekstremalnem problemu je spremenljivka omejena (cena med $20\,€$ in $60\,€$). Največja vrednost je lahko tudi na robu intervala, zato ga izračunaj in primerjaj.

## Povzetek

- Tangenta v $\bigl(a, f(a)\bigr)$: $y = f(a) + f'(a)(x - a)$; smerni koeficient je $f'(a)$.
- $f' > 0$ na intervalu: $f$ narašča; $f' < 0$: $f$ pada.
- Stacionarna točka: $f'(a) = 0$. Ekstrem je tam le, če $f'$ zamenja predznak ($+ \to -$ maksimum, $- \to +$ minimum).
- Vrednost ekstrema dobiš z vstavljanjem v $f$.
- Ekstremalni problem: sestavi funkcijo ene spremenljivke, določi smiselni interval, reši $f' = 0$, preveri predznak in robove, odgovori v stavku z enotami.

## Drugače: Z analogijo

Predstavljaj si pohodnika v megli na grebenu. Vrha ne vidi, čuti pa naklon poti pod nogami. To je odvod.

- Pot gre navzgor: odvod je pozitiven, pohodnik se še vzpenja.
- Pot gre navzdol: odvod je negativen, vrh je že za njim.
- Pot je za trenutek ravna: odvod je $0$. To je lahko vrh, dno kotanje ali le ravna polica sredi vzpona, za katero se pot spet dviga. Kaj od tega je, pove šele naslednji korak: ali gre potem navzdol ali navzgor.

Tangenta je palica, ki jo pohodnik v vsaki točki položi na tla: kaže smer poti prav tam.

## Drugače: Iz vsakdanjega življenja

Pomisli na temperaturo v poletnem dnevu. Zjutraj se ogreva, popoldne ohlaja.

- Hitrost ogrevanja (stopinje na uro) je odvod temperature. Dopoldne je pozitivna, zvečer negativna.
- Najtopleje ni takrat, ko se najhitreje ogreva, ampak takrat, ko se ogrevanje *ustavi*: odvod je $0$ in se obrne v negativnega. Zato je najtopleje šele okoli treh popoldne, ne opoldne.
- Vremenar, ki ob enajstih reče »segreva se za $2\,°\mathrm{C}$ na uro«, pove smerni koeficient tangente na graf temperature ob enajstih.

Enako je pri ceni rogljičkov: prihodek je največji tam, kjer podražitev neha prinašati dodatni denar.

## Preveri se

? Trgovec izračuna, da je odvod prihodka pri ceni $3\,€$ enak $R'(3) = -40$. Kaj to pomeni?
- Prihodek pri ceni $3\,€$ je negativen.
~ Negativen je odvod, ne prihodek. Predznak $R'$ pove smer spreminjanja, ne vrednosti.
- Pri ceni $3\,€$ je prihodek največji.
~ Pri vrhu bi bil odvod $0$, ne $-40$.
+ Pri rahli podražitvi bi se prihodek zmanjšal; cena je že desno od vrha.
> $R'(3) < 0$ pomeni, da $R$ pri $3\,€$ pada: vsaka majhna podražitev zmanjša prihodek, smiselno bi bilo ceno znižati.

? Na graf $f(x) = x^2$ položimo tangente v točkah z abscisami $-1$, $0$ in $2$. Razvrsti jih po smernem koeficientu od najmanjšega do največjega.
- $0$, $-1$, $2$
~ Tako razvrstiš vrednosti $f(x)$ ($0$, $1$, $4$). Naklon tangente pa je $f'(x) = 2x$.
+ $-1$, $0$, $2$
- $2$, $0$, $-1$
~ To je obraten vrstni red. Pri $-1$ graf pada, zato je tam koeficient negativen in najmanjši.
> $f'(x) = 2x$ da koeficiente $-2$, $0$ in $4$.

? Prihodek od rogljičkov je največji pri $1{,}25\,€$, kjer je $R'(1{,}25) = 0$. Kaj se zgodi s prihodkom, če pek ceno zviša na $1{,}40\,€$?
- Zraste, ker je vsak rogljiček dražji.
~ Dražji kos ne pomeni več denarja, ker kupcev zmanjka hitreje. Desno od vrha $R$ pada.
- Ostane enak, ker je odvod v vrhu $0$.
~ Odvod $0$ velja le v točki vrha, ne na intervalu. Za $x > 1{,}25$ je $R'(x) < 0$.
+ Pade, s $312{,}50\,€$ na $308\,€$.
> Desno od maksimuma je $R' < 0$, prihodek pada: $R(1{,}40) = 1{,}40 \cdot 220 = 308\,€$.

? Katera je enačba tangente na graf $f(x) = x^2 - 2x$ v točki z absciso $3$?
- $y = 3x - 6$
~ Za smerni koeficient je vzeta vrednost $f(3) = 3$ namesto $f'(3)$.
+ $y = 4x - 9$
- $y = 4x + 3$
~ Za začetno vrednost $n$ je vzet $f(3)$, premik $(x - 3)$ pa izpuščen.
> $f(3) = 3$, $f'(x) = 2x - 2$, $f'(3) = 4$; $y = 3 + 4(x - 3) = 4x - 9$.

? Dnevni dobiček delavnice je $D(x) = -2x^2 + 120x - 1000$ evrov, kjer je $x$ število izdelkov. Kolikšen je največji dobiček?
- $30\,€$
~ $30$ je število izdelkov, pri katerem je dobiček največji, ne dobiček.
- $0\,€$
~ To je $D'(30)$. Vrednost dobička dobiš, ko $30$ vstaviš v $D$, ne v $D'$.
+ $800\,€$
> $D'(x) = -4x + 120 = 0$ da $x = 30$; $D(30) = -1800 + 3600 - 1000 = 800$, predznak $D'$ gre iz $+$ v $-$.

:::simboli
f | funkcija | |
f' | odvod funkcije | |
a | abscisa dotikališča | |
x | neodvisna spremenljivka; cena; stranica izrezanega kvadrata | | | pomen je odvisen od primera
y | ordinata točke na tangenti | |
R | prihodek | R(x) = 500x - 200x^2 | €
c | prodajna cena slušalk | | €
D | dobiček (v primeru 3 tedenski) | D(c) = (c - 20)(600 - 10c) | €
D' | odvod dobička | D'(c) = -20c + 800 |
V | prostornina škatle | V(x) = x\,(30 - 2x)^2 | cm^3
:::
