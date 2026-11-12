---
stanje: osnutek
demo: linearna
avtor: AI
---

## Zakaj se tega učimo

Vremenska napoved obljublja cel dan zmernega dežja. Na balkon ali okensko polico postavi kozarec z ravnim dnom in navpičnimi stenami, zraven pa pokonci ravnilo. V kozarcu je od prejšnjega dne že $12\,\mathrm{mm}$ vode. Vsako uro izmeri, kako visoko sega voda.

Tak kozarec je preprost **dežemer**. Tudi meteorologi merijo padavine v milimetrih: $1\,\mathrm{mm}$ vode v dežemeru pomeni $1\,\mathrm{L}$ vode na vsak kvadratni meter tal.

Če dež pada enakomerno, se voda vsako uro dvigne za enako višino. Ali lahko iz nekaj meritev napoveš, koliko vode bo v kozarcu zvečer, ne da bi čakal? Lahko, z enim samim predpisom, ki mu rečemo linearna funkcija. S predpisom enake oblike opišeš, kako se zrak ohlaja, ko se vzpenjaš na hrib, ali kako se nalaga sneg med enakomernim sneženjem.

## Razlaga

**1. Meritve.** Recimo, da si v kozarcu izmeril tole ($x$ je čas v urah, $y$ višina vode v milimetrih):

| $x$ (h) | $y$ (mm) | v zadnji uri |
|---|---|---|
| $0$ | $12$ | – |
| $1$ | $16$ | $+4$ |
| $2$ | $20$ | $+4$ |
| $3$ | $24$ | $+4$ |

Vsaka ura prinese $4\,\mathrm{mm}$. Višina je torej $12\,\mathrm{mm}$, ki so bili v kozarcu že prej, in še $4\,\mathrm{mm}$ za vsako uro: $y = 4x + 12$.

*Hitro preveri:* koliko vode da predpis po $2$ urah? (Odgovor: $4 \cdot 2 + 12 = 20$, kot v tabeli.)

**2. Funkcija.** Ob vsakem času $x$ ima voda v kozarcu natanko eno višino $y$. Pravilu, ki vsakemu številu $x$ priredi natanko eno število $y$, rečemo **funkcija**. Število $x$ je **neodvisna spremenljivka**, ker jo izbiramo sami. Število $y$ je **odvisna spremenljivka**, ker je odvisno od $x$.

*Hitro preveri:* ali lahko ob istem času izmeriš dve različni višini vode? (Ne, zato je višina funkcija časa.)

**3. Predpis linearne funkcije.** Linearna funkcija ima predpis

$$y = kx + n,$$

kjer sta $k$ in $n$ dani realni števili. Pišemo tudi $f(x) = kx + n$. Pri dežemeru je $k = 4$ in $n = 12$. Če vse pare $(x, y)$ narišemo v koordinatni sistem, ležijo na **premici**. Od tod ime: *linearna* izhaja iz latinske besede za črto.

:::risba graf
opis: Graf višine vode v dežemeru. Vodoravna os je čas od 0 do 6 ur, navpična os višina vode od 0 do 40 mm. Točke (0, 12), (1, 16), (2, 20) in (3, 24) ležijo na premici y = 4x + 12, ki seka os y pri 12.
x: 0 .. 6 | 1 | čas x (h)
y: 0 .. 40 | 8 | višina y (mm)
f: 4*x + 12 | modra | 0 .. 6
točka: 0; 12 | (0, 12) | desno
točka: 1; 16
točka: 2; 20
točka: 3; 24 | (3, 24) | desno
podnapis: Vsaka ura dvigne vodo za 4 mm, zato točke ležijo na premici.
:::

*Hitro preveri:* koliko sta $k$ in $n$ pri $y = 5x - 2$? (Odgovor: $k = 5$, $n = -2$.)

:::premisli
Dež pada naprej enako močno. Koliko vode bo v kozarcu po $6$ urah? Napovej brez tabele.
---
$36\,\mathrm{mm}$: $y = 4 \cdot 6 + 12 = 36$. Ni ti treba čakati šest ur, predpis velja za vsak $x$, dokler dež pada enakomerno.
:::

**4. Začetna vrednost $n$.** Vstavimo $x = 0$: $y = k \cdot 0 + n = n$. Število $n$ je vrednost funkcije pri $x = 0$, zato mu rečemo **začetna vrednost**. Premica seka os $y$ v točki $(0, n)$. Pri dežemeru je to $12\,\mathrm{mm}$ vode, ki so bili v kozarcu pred prvo meritvijo.

Začetna vrednost je lahko tudi negativna. Pri $y = 2x - 5$ je $n = -5$, premica seka os $y$ v točki $(0, -5)$, pod osjo $x$.

*Hitro preveri:* kolikšna je začetna vrednost funkcije $y = -3x + 7$? (Odgovor: $7$.)

**5. Smerni koeficient $k$.** Število $k$ pove, **za koliko se spremeni $y$, ko se $x$ poveča za $1$**. Imenujemo ga **smerni koeficient**. Pri dežemeru je $k = 4$: vsaka ura doda $4\,\mathrm{mm}$.

- Če je $k > 0$, funkcija **narašča**: premica gre od leve proti desni navzgor.
- Če je $k < 0$, funkcija **pada**. Sneg, ki se tali za $2\,\mathrm{cm}$ na uro, ima $k = -2$.
- Če je $k = 0$, je $y = n$ pri vsakem $x$: funkcija je **konstantna**, premica je vodoravna. Tako je, ko dež poneha.

Večja kot je absolutna vrednost $|k|$, bolj strma je premica. Naliv z $10\,\mathrm{mm}$ na uro da bolj strmo premico kot pršenje z $1\,\mathrm{mm}$ na uro.

*Hitro preveri:* ali funkcija $y = -0{,}5x + 3$ narašča ali pada? (Odgovor: pada, ker je $k < 0$.)

**6. Smerni koeficient iz dveh točk.** Kaj, če meritve niso vsako uro? Za točki $A(x_1, y_1)$ in $B(x_2, y_2)$ na premici, kjer je $x_2 \ne x_1$, velja spodnja formula. Mali številki $1$ in $2$ (indeksa) le ločita prvo in drugo točko:

$$k = \frac{y_2 - y_1}{x_2 - x_1}.$$

Števec pove, za koliko se je spremenil $y$, imenovalec pa, za koliko se je spremenil $x$. Deljenje da spremembo na eno enoto $x$. Iz meritev $(1, 16)$ in $(3, 24)$ dobimo $k = \dfrac{24 - 16}{3 - 1} = \dfrac{8}{2} = 4$, enako kot prej.

*Hitro preveri:* kolikšen je $k$ premice skozi $(0, 12)$ in $(2, 20)$? (Odgovor: $\dfrac{8}{2} = 4$.)

**7. Poseben primer $n = 0$.** Takrat je $y = kx$. To je premo sorazmerje, ki ga že poznaš: premica gre skozi izhodišče $(0, 0)$.

:::premisli
Kozarec izprazniš in meriš znova, dež pa pada enako močno kot prej. Je nova premica bolj strma, manj strma ali enako strma kot stara, in kje leži? Zapiši še nov predpis.
---
Nov predpis je $y = 4x$. Dež je enak, zato ostane $k = 4$; na začetku ni vode, zato je $n = 0$. Premica ima enak naklon kot prej (je vzporedna), le za $12$ enot nižje, in gre skozi izhodišče.
:::

Kje premica seka os $x$, boš spoznal v lekciji Graf linearne funkcije.

## Rešeni primeri

### Primer 1: branje $k$ in $n$ ter računanje vrednosti

Dana je funkcija $y = 2x + 3$. Določi $k$ in $n$ ter izračunaj vrednosti funkcije pri $x = 0$, $x = 1$ in $x = 4$.

**Podatki:** predpis $y = 2x + 3$; vrednosti $x = 0$, $x = 1$, $x = 4$
**Iščemo:** $k$, $n$ in pripadajoče vrednosti $y$

:::formula
$y = kx + n$: $k$ je število ob $x$, $n$ je samostojno število.
:::

**Rešitev:**

1. Predpis primerjamo z $y = kx + n$. Število ob $x$ je $k = 2$, samostojno število je $n = 3$.
2. Pri $x = 0$: $y = 2 \cdot 0 + 3 = 3$. To je ravno $n$, kot mora biti.
3. Pri $x = 1$: $y = 2 \cdot 1 + 3 = 5$.
4. Pri $x = 4$: $y = 2 \cdot 4 + 3 = 8 + 3 = 11$.
5. Preizkus s $k$: ko se $x$ poveča z $0$ na $1$, se $y$ poveča s $3$ na $5$, torej za $2 = k$.
6. Odgovor: $k = 2$, $n = 3$; vrednosti so $3$, $5$ in $11$.

### Primer 2: temperatura na hribu

Na dnu doline termometer kaže $18\,^\circ\mathrm{C}$. Ko se vzpenjamo, se zrak ohlaja: z vsakim kilometrom višine je približno $6\,^\circ\mathrm{C}$ hladneje. Zapiši predpis za temperaturo $y$ v odvisnosti od višine $x$ (v km nad dnom doline). Kolikšna je temperatura na vrhu, ki je $2{,}5\,\mathrm{km}$ nad dnom doline?

**Podatki:** temperatura na dnu doline $18\,^\circ\mathrm{C}$; ohlajanje $6\,^\circ\mathrm{C}$ na vsak kilometer; višina vrha $x = 2{,}5\,\mathrm{km}$
**Iščemo:** predpis $y = kx + n$ in temperaturo $y$ na vrhu

:::formula
$y = kx + n$, kjer je $n$ vrednost pri $x = 0$, $k$ pa sprememba $y$ na $1\,\mathrm{km}$.
:::

**Rešitev:**

1. Pri $x = 0$ smo na dnu doline, zato je $n = 18$.
2. Na vsak kilometer je $6\,^\circ\mathrm{C}$ manj. Temperatura pada, zato je $k$ negativen: $k = -6$.
3. Predpis: $y = -6x + 18$.
4. Vrh: $y = -6 \cdot 2{,}5 + 18 = -15 + 18 = 3$.
5. Odgovor: na vrhu je približno $3\,^\circ\mathrm{C}$. Pravilo velja le povprečno, dejanska temperatura je odvisna še od vremena.

### Primer 3: koliko snega je bilo zjutraj

Meteorologi začnejo višino snega meriti ob 6.00, ko je na tleh že nekaj snega od noči. Sneži enakomerno. Ob 8.00 je snega $9\,\mathrm{cm}$, ob 11.00 pa $18\,\mathrm{cm}$. Zapiši predpis za višino snega in ugotovi, koliko snega je bilo ob 6.00.

**Podatki:** čas $x$ štejemo v urah od 6.00; ob 8.00 je $y = 9\,\mathrm{cm}$; ob 11.00 je $y = 18\,\mathrm{cm}$; sneži enakomerno
**Iščemo:** predpis $y = kx + n$ in začetno vrednost $n$ (sneg ob 6.00)

:::formula
$k = \dfrac{y_2 - y_1}{x_2 - x_1}$, nato v $y = kx + n$ vstavimo eno izmerjeno točko in izračunamo $n$.
:::

**Rešitev:**

1. Čas štejemo od 6.00, zato je 8.00 pri $x = 2$ in 11.00 pri $x = 5$. Imamo točki $(2, 9)$ in $(5, 18)$.
2. Smerni koeficient: $k = \dfrac{18 - 9}{5 - 2} = \dfrac{9}{3} = 3$. Vsako uro zapade $3\,\mathrm{cm}$ snega.
3. Predpis je $y = 3x + n$. Ostane še $n$: vstavi točko $(2, 9)$ in izračunaj sam.

:::premisli
Koliko je $n$ in kakšen je predpis? Preveri ga še s točko $(5, 18)$.
---
Iz enačbe $9 = 3 \cdot 2 + n$ dobimo $n = 9 - 6 = 3$. Predpis je $y = 3x + 3$: ob 6.00 so bili na tleh $3\,\mathrm{cm}$ snega. Preizkus: $3 \cdot 5 + 3 = 18$, se ujema.
:::

## Pogoste napake

- **Zamenjana $k$ in $n$.** Učenec pri $y = 5x + 1$ reče »$k = 1$, ker je zadnji«. Vrstni red členov ni pomemben: $k$ je število, ki stoji ob $x$, $n$ je samostojno število. Popravek: vstavi $x = 0$; kar ostane, je $n = 1$.
- **Izgubljen predznak.** Pri $y = 4 - 3x$ je $k = -3$, ne $3$, pri $y = 2x - 5$ pa $n = -5$. Predznak spada k številu za njim. Popravek: predpis najprej uredi v obliko $y = kx + n$, tu $y = -3x + 4$.
- **Nepopoln izračun $kx + n$.** Pri $y = -5x + 18$ in $x = 1{,}6$ nekdo izračuna samo $-5 \cdot 1{,}6 = -8$ (pozabi začetno vrednost) ali samo $18 - 5 = 13$ (vstavi $x = 1$ namesto $1{,}6$). Popravek: vedno izračunaj celoten $kx + n$: $-8 + 18 = 10$.
- **Razlika namesto smernega koeficienta.** Ko voda v posodi v $3$ minutah upade s $40\,\mathrm{cm}$ na $34\,\mathrm{cm}$, ni $k = -6$: $k$ je sprememba v *eni* minuti. Deliti moraš še s spremembo $x$: $k = \dfrac{-6}{3} = -2$. Napačen je tudi obrnjen kvocient $\dfrac{x_2 - x_1}{y_2 - y_1}$; razlika $y$ je vedno v števcu, v obeh razlikah pa odštevaš v istem vrstnem redu.
- **Mešanje naraščanja in strmine.** Predznak $k$ pove, ali funkcija narašča ali pada, $|k|$ pa, kako strma je premica. Premica s $k = -4$ je bolj strma od premice s $k = 2$, a pada.

## Povzetek

- Funkcija vsakemu $x$ priredi natanko en $y$; $x$ je neodvisna, $y$ odvisna spremenljivka.
- Linearna funkcija ima predpis $y = kx + n$, njen graf je premica.
- $k$ je smerni koeficient: pove, za koliko se spremeni $y$, ko se $x$ poveča za $1$. Pri $k > 0$ funkcija narašča, pri $k < 0$ pada, pri $k = 0$ je konstantna (vodoravna premica). Večji $|k|$ pomeni bolj strmo premico.
- $n$ je začetna vrednost: $y$ pri $x = 0$; premica seka os $y$ v točki $(0, n)$.
- Iz dveh točk: $k = \dfrac{y_2 - y_1}{x_2 - x_1}$, nato $n$ dobiš z vstavitvijo ene točke v predpis.
- Pri $n = 0$ je $y = kx$ premo sorazmerje, premica gre skozi izhodišče.

## Drugače: Na sliki

:::risba graf
opis: Premica y = kx + n s stopnico. V aplikaciji se k in n spreminjata z drsnikoma; izbrano je k = {k} in n = {n}. Iz točke (0, {n}) na osi y vodi črtkana stopnica 1 enoto v desno in {k} enot navpično do točke (1, {k+n}).
x: -6 .. 6
y: -6 .. 6
enako: da
drsnik: k | -3 .. 3 | 0,5 | 1 | smerni koeficient k
drsnik: n | -3 .. 3 | 1 | 2 | začetna vrednost n
f: k*x + n
črta: 0; n -> 1; n | črtkano
črta: 1; n -> 1; k + n | črtkano
točka: 0; n | (0, {n}) | levo
podnapis: Premica pri k = {k} in n = {n}
:::

- Premikaj samo drsnik za $n$: premica se pomika gor in dol, naklon pa ostane enak. Vedno seka os $y$ pri vrednosti $n$.
- Premikaj samo drsnik za $k$: premica se vrti okoli točke $(0, n)$. Pri $k = 0$ je vodoravna, pri negativnem $k$ pada.

Črtkana stopnica kaže pomen $k$: iz točke $(0, n)$ greš $1$ v desno in nato za $k$ navpično (pri negativnem $k$ navzdol). Pri $k = 2$ je to $1$ desno in $2$ gor. Pri $k = \dfrac{1}{2}$ je lažje narediti dvojno stopnico: $2$ desno in $1$ gor.

V simulaciji spodaj (»Graf funkcije y = kx + n«) nastavi $n = 0$ in spreminjaj samo $k$. Opazi, da gre premica ves čas skozi izhodišče: to je premo sorazmerje $y = kx$.

## Drugače: Bolj natančno

Zakaj je razmerje $\dfrac{y_2 - y_1}{x_2 - x_1}$ pri vsakem paru točk na premici enako? Naj bosta $(x_1, y_1)$ in $(x_2, y_2)$ točki na grafu funkcije $y = kx + n$. Potem velja

$$y_1 = kx_1 + n, \qquad y_2 = kx_2 + n.$$

Ko prvo enakost odštejemo od druge, se $n$ izniči:

$$y_2 - y_1 = kx_2 - kx_1 = k(x_2 - x_1).$$

Če delimo z $x_2 - x_1 \ne 0$, dobimo

$$\frac{y_2 - y_1}{x_2 - x_1} = k.$$

Razmerje je neodvisno od izbire točk in je enako $k$. Prav to pomeni enakomerno spreminjanje: ko se $x$ poveča za neko število, se $y$ spremeni za $k$-kratnik tega števila.

Pri resničnih količinah ima $k$ tudi enoto: enoto $y$ deljeno z enoto $x$. Pri dežemeru je $k = 4\,\mathrm{mm/h}$, pri ohlajanju zraka $k = -6\,^\circ\mathrm{C/km}$. Enota $n$ je enaka enoti $y$. Linearni predpis tu velja le v nekem obsegu: ko dež poneha, se voda v kozarcu ne dviga več, in ohlajanje za $6\,^\circ\mathrm{C}$ na kilometer je le povprečje.

## Preveri se

? Premica seka os $y$ v točki $(0, -4)$, vrednost $y$ pa se zmanjša za $3$, ko se $x$ poveča za $1$. Kateri je predpis?
- $y = -4x - 3$
~ Zamenjal si $k$ in $n$. Presečišče z osjo $y$ da $n = -4$, sprememba na eno enoto pa $k = -3$.
+ $y = -3x - 4$
- $y = 3x - 4$
~ »Zmanjša se« pomeni, da funkcija pada, zato je $k$ negativen.
- $y = -3x + 4$
~ Presečišče $(0, -4)$ leži pod osjo $x$, zato je $n = -4$, ne $4$.
> Začetna vrednost je $n = -4$, smerni koeficient $k = -3$, ker $y$ pada. Predpis je $y = -3x - 4$.

? Katera tabela pripada funkciji $y = 2x - 1$ (vrednosti pri $x = 0$, $1$, $2$)?
- $y$: $2$, $1$, $0$
~ To je $y = -x + 2$: zamenjal si $k$ in $n$. Pri $x = 0$ mora biti $y = n = -1$.
- $y$: $1$, $3$, $5$
~ To je $y = 2x + 1$: izgubil si predznak pri $n$.
- $y$: $0$, $2$, $4$
~ To je $y = 2x$: pozabil si odšteti začetno vrednost.
+ $y$: $-1$, $1$, $3$
> Pri $x = 0$ je $y = -1 = n$, nato se $y$ na vsakem koraku poveča za $2 = k$.

? Zakaj premica $y = kx + n$ vedno seka os $y$ ravno v točki $(0, n)$?
+ Ker imajo vse točke na osi $y$ koordinato $x = 0$; takrat je $kx = 0$ in ostane $y = n$.
- Ker je $n$ smerni koeficient premice.
~ Smerni koeficient je $k$. Število $n$ je začetna vrednost.
- Ker se $y$ poveča za $n$, ko se $x$ poveča za $1$.
~ To opisuje $k$, ne $n$. Število $n$ je vrednost $y$ pri $x = 0$.
> Na osi $y$ je $x = 0$. Vstavimo: $y = k \cdot 0 + n = n$, zato je presečišče $(0, n)$.

? Na dnu doline je $20\,^\circ\mathrm{C}$, temperatura pa pada za približno $6\,^\circ\mathrm{C}$ na vsak kilometer višine. Približno kolikšna je temperatura na vrhu, ki je $2{,}2\,\mathrm{km}$ nad dnom doline?
- približno $14\,^\circ\mathrm{C}$
~ Odštel si le $6\,^\circ\mathrm{C}$, kot da bi bil vrh $1\,\mathrm{km}$ visoko. Pomnožiti moraš s številom kilometrov.
- približno $33\,^\circ\mathrm{C}$
~ Temperatura z višino pada, zato je $k = -6$, ne $6$.
- približno $-13\,^\circ\mathrm{C}$
~ Pozabil si začetno vrednost $n = 20$. Izračunal si le $kx$.
+ približno $7\,^\circ\mathrm{C}$
> $y = -6x + 20$, pri $x = 2{,}2$ je $y = -13{,}2 + 20 = 6{,}8$, torej približno $7\,^\circ\mathrm{C}$.

? Ob 10.00 je na vrtu $30\,\mathrm{cm}$ snega, ob 14.00 le še $22\,\mathrm{cm}$. Sneg se tali enakomerno. Kolikšen je smerni koeficient, če $x$ merimo v urah?
- $2$
~ Sneg se tali, višina pada, zato je $k$ negativen.
- $-8$
~ To je sprememba v $4$ urah. Deliti moraš s spremembo časa.
- $-\dfrac{1}{2}$
~ To je obrnjen kvocient. V števcu je sprememba $y$, v imenovalcu sprememba $x$.
+ $-2$
> $k = \dfrac{22 - 30}{14 - 10} = \dfrac{-8}{4} = -2$. Sneg se vsako uro zniža za $2\,\mathrm{cm}$.

:::simboli
y | vrednost funkcije (odvisna spremenljivka) | y = kx + n | | pri dežemeru višina vode v mm
x | neodvisna spremenljivka | | | pri dežemeru čas v urah
k | smerni koeficient | k = \frac{y_2 - y_1}{x_2 - x_1} | | sprememba $y$, ko se $x$ poveča za 1
n | začetna vrednost | | | vrednost $y$ pri $x = 0$
x_1, x_2 | abscisi dveh točk na premici | | | $x_2 \ne x_1$
y_1, y_2 | ordinati dveh točk na premici | | |
:::
