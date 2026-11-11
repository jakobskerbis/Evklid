---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Telefon je vpet v držalo, ki ga motorček enakomerno vrti v navpični ravnini: en obrat v $60\,\text{s}$, torej $6^\circ$ na sekundo. Na začetku telefon leži vodoravno. Pospeškomer v telefonu meri, kolikšen del teže deluje vzdolž zaslona. Ta delež je ravno $\sin x$, kjer je $x$ kot zasuka.

Ob katerih sekundah v prvih dveh minutah pokaže telefon vrednost $0{,}5$?

Kalkulator (tipka $\sin^{-1}$) za $\sin x = 0{,}5$ ponudi en sam kot, $30^\circ$, torej $5\,\text{s}$. Telefon pa se vrti naprej in vrednost $0{,}5$ pokaže večkrat. Enačbi, v kateri je neznanka kot znotraj kotne funkcije, rečemo **trigonometrijska enačba**. Ker se kotne funkcije ponavljajo, ima takšna enačba navadno neskončno mnogo rešitev. Vse pa lahko zajameš v en kratek zapis. Enako nalogo rešujejo aplikacije, ki merijo nagib, in elektrotehniki pri izmenični napetosti v vtičnici.

## Razlaga

**1. Dve točki na krožnici.** Na enotski krožnici je $\sin x$ koordinata $y$ točke. Enačba $\sin x = 0{,}5$ torej sprašuje, kje vodoravna premica $y = 0{,}5$ seka krožnico. Seka jo v **dveh** točkah: pri $30^\circ$ in pri $180^\circ - 30^\circ = 150^\circ$. Točki sta zrcalni glede na os $y$.

**2. Vzorec v rešitvah.** Telefon se vrti naprej in obe točki obišče znova vsakih $360^\circ$. Tudi vrtenje nazaj (negativni koti) da rešitve. Uredimo jih po družinah:

| prva družina | druga družina |
|---|---|
| $30^\circ$ | $150^\circ$ |
| $390^\circ$ | $510^\circ$ |
| $750^\circ$ | $870^\circ$ |
| $-330^\circ$ | $-210^\circ$ |

V vsakem stolpcu se koti razlikujejo za večkratnik $360^\circ$. Vse rešitve zato zapišemo z dvema izrazoma:

$$x = 30^\circ + k \cdot 360^\circ \quad \text{ali} \quad x = 150^\circ + k \cdot 360^\circ$$

Tu je $k$ poljubno **celo število** ($k \in \mathbb{Z}$: $\ldots, -2, -1, 0, 1, 2, \ldots$). Takemu zapisu rečemo **splošna rešitev** enačbe.

:::premisli
Napovej, ob katerih sekundah v prvih $120\,\text{s}$ telefon iz uvoda pokaže $0{,}5$. Telefon se zavrti za $6^\circ$ na sekundo.
---
Ob $5\,\text{s}$, $25\,\text{s}$, $65\,\text{s}$ in $85\,\text{s}$. To so koti $30^\circ$, $150^\circ$, $390^\circ$ in $510^\circ$, deljeni s $6^\circ$ na sekundo.
:::

**3. Kalkulator in arkus funkcije.** Kot, ki ga ponudi kalkulator (tipka $\sin^{-1}$), imenujemo **arkus sinus**: $\arcsin a$ je tisti kot med $-90^\circ$ in $90^\circ$, katerega sinus je $a$. Temu kotu rečemo **osnovna rešitev** $x_1$. Podobno je $\arccos a$ kot med $0^\circ$ in $180^\circ$, $\arctan a$ pa kot med $-90^\circ$ in $90^\circ$.

**4. Pravila za vse tri funkcije.** Vzorec iz tabele velja splošno.

Za $\sin x = a$, $-1 \le a \le 1$, $x_1 = \arcsin a$:

$$x = x_1 + k \cdot 360^\circ \quad \text{ali} \quad x = 180^\circ - x_1 + k \cdot 360^\circ$$

Pri kosinusu je $\cos x$ koordinata $x$ točke, zato krožnico sekamo z navpično premico $x = a$. Točki sta zrcalni glede na os $x$, zato se razlikujeta le v predznaku kota. Za $\cos x = a$, $-1 \le a \le 1$, $x_1 = \arccos a$:

$$x = \pm x_1 + k \cdot 360^\circ$$

Pri tangensu je $\tan x = \frac{\sin x}{\cos x}$ naklon poltraka od izhodišča do točke. Premica skozi izhodišče z naklonom $a$ zato seka krožnico v dveh nasprotnih točkah, ki sta za $180^\circ$ narazen. Za $\tan x = a$ (vsak $a$), $x_1 = \arctan a$:

$$x = x_1 + k \cdot 180^\circ$$

Če je $a > 1$ ali $a < -1$, enačbi $\sin x = a$ in $\cos x = a$ **nimata rešitev**, saj premica krožnice ne seka.

**5. Radiani.** Isti zapis velja z radiani: $360^\circ$ zamenja $2\pi$, $180^\circ$ pa $\pi$. Za $\sin x = 0{,}5$ dobiš $x = \frac{\pi}{6} + 2k\pi$ ali $x = \frac{5\pi}{6} + 2k\pi$. V enem zapisu ne mešaj stopinj in radianov.

V simulaciji spodaj (»Trigonometrijska enačba sin x = a«) izberi $\sin x = a$ in z drsnikom »desna stran a« nastavi $0{,}5$. Opazuj dve točki na krožnici in dve presečišči na grafu v enem obratu. Nato drsnik premakni na $1$ in še naprej do $1{,}2$. Kaj se zgodi s številom rešitev?

:::premisli
Koliko rešitev ima $\sin x = 1$ na intervalu $[0^\circ, 360^\circ)$? Zakaj se obe družini tu združita v eno?
---
Samo eno, $x = 90^\circ$. Premica $y = 1$ se krožnice le dotakne. Druga družina da $180^\circ - 90^\circ = 90^\circ$, isti kot kot prva.
:::

## Rešeni primeri

### Primer 1 (lažji): kosinus

Reši enačbo $\cos x = -\dfrac{1}{2}$. Zapiši splošno rešitev in vse rešitve na $[0^\circ, 360^\circ)$.

**Podatki:** $\cos x = -\dfrac{1}{2}$, interval $[0^\circ, 360^\circ)$
**Iščemo:** splošno rešitev in rešitve na intervalu

:::formula
$\cos x = a \ \Rightarrow\ x = \pm x_1 + k \cdot 360^\circ$, $\ x_1 = \arccos a$
:::

**Rešitev:**

1. Osnovna rešitev: $\cos 60^\circ = \frac{1}{2}$, kosinus je negativen v drugem kvadrantu, zato $x_1 = 180^\circ - 60^\circ = 120^\circ$.
2. Splošna rešitev: $x = \pm 120^\circ + k \cdot 360^\circ$, $k \in \mathbb{Z}$.
3. Na intervalu: pri $+120^\circ$ vzamemo $k = 0$ in dobimo $120^\circ$. Pri $-120^\circ$ vzamemo $k = 1$ in dobimo $-120^\circ + 360^\circ = 240^\circ$.
4. Odgovor: $x = \pm 120^\circ + k \cdot 360^\circ$; na $[0^\circ, 360^\circ)$ sta rešitvi $120^\circ$ in $240^\circ$.

### Primer 2: negativna osnovna rešitev

Reši enačbo $3\sin x + 1 = 0$ na $[0^\circ, 360^\circ)$. Kote zaokroži na stotinko stopinje.

**Podatki:** $3\sin x + 1 = 0$, interval $[0^\circ, 360^\circ)$
**Iščemo:** vse rešitve na intervalu

:::formula
$\sin x = a \ \Rightarrow\ x = x_1 + k \cdot 360^\circ$ ali $x = 180^\circ - x_1 + k \cdot 360^\circ$
:::

**Rešitev:**

1. Najprej osamimo sinus: $3\sin x = -1$, torej $\sin x = -\dfrac{1}{3}$.
2. Kalkulator: $x_1 = \arcsin\left(-\frac{1}{3}\right) \approx -19{,}47^\circ$. Kot je negativen, kar je pri $\arcsin$ negativnega števila pričakovano.
3. Prva družina: $-19{,}47^\circ + 360^\circ = 340{,}53^\circ$.
4. Druga družina: $180^\circ - (-19{,}47^\circ) = 199{,}47^\circ$. Pazi na oklepaj: minus in minus dasta plus.
5. Preverba: obe rešitvi ležita v III. ali IV. kvadrantu, kjer je sinus negativen. ✓
6. Odgovor: rešitvi na intervalu sta $x \approx 199{,}47^\circ$ in $x \approx 340{,}53^\circ$.

### Primer 3 (težji): napetost za polnilnik

Polnilnik telefona je priključen v vtičnico z napetostjo $u = 325\,\text{V} \cdot \sin(100\pi t)$, kjer je $t$ čas v sekundah in je kot v radianih. Ena perioda traja $0{,}02\,\text{s}$. Ob katerih časih v prvi periodi je napetost $162{,}5\,\text{V}$?

**Podatki:** $u = 325\,\text{V} \cdot \sin(100\pi t)$; $u = 162{,}5\,\text{V}$; $0 \le t < 0{,}02\,\text{s}$
**Iščemo:** čase $t$

:::formula
$\sin y = a \ \Rightarrow\ y = x_1 + 2k\pi$ ali $y = \pi - x_1 + 2k\pi$, z novo neznanko $y = 100\pi t$
:::

**Rešitev:**

1. Delimo z amplitudo: $\sin(100\pi t) = \dfrac{162{,}5}{325} = 0{,}5$.
2. Celoten argument označimo z $y = 100\pi t$ in rešimo $\sin y = 0{,}5$: $y = \dfrac{\pi}{6} + 2k\pi$ ali $y = \dfrac{5\pi}{6} + 2k\pi$.
3. Iz $y$ izračunamo $t$, tako da delimo s $100\pi$: $t = \dfrac{1}{600} + \dfrac{k}{50}$ ali $t = \dfrac{1}{120} + \dfrac{k}{50}$ (v sekundah).
4. V prvi periodi je $k = 0$, saj že $k = 1$ prišteje celo periodo $\frac{1}{50}\,\text{s} = 0{,}02\,\text{s}$.
5. $t_1 = \dfrac{1}{600}\,\text{s} \approx 0{,}00167\,\text{s}$ in $t_2 = \dfrac{1}{120}\,\text{s} \approx 0{,}00833\,\text{s}$.
6. Odgovor: napetost je $162{,}5\,\text{V}$ ob približno $1{,}67\,\text{ms}$ in $8{,}33\,\text{ms}$ po začetku periode.

### Primer 4 – zdaj ti: enačba z dvojnim kotom

Reši enačbo $\sin 2x = \cos x$ na $[0^\circ, 360^\circ)$.

**Podatki:** $\sin 2x = \cos x$, interval $[0^\circ, 360^\circ)$
**Iščemo:** vse rešitve na intervalu

:::formula
$\sin 2x = 2\sin x\cos x$; produkt je $0$, ko je vsaj en faktor $0$.
:::

**Rešitev:**

1. Dvojni kot razpišemo: $2\sin x\cos x = \cos x$.
2. Vse prenesemo na levo in izpostavimo: $\cos x\,(2\sin x - 1) = 0$. Z $\cos x$ ne delimo, ker bi izgubili rešitve, pri katerih je $\cos x = 0$.
3. Dobimo dve enostavni enačbi: $\cos x = 0$ ali $\sin x = \frac{1}{2}$. Reši ju sam, nato preveri:

:::premisli
Katere so vse rešitve na $[0^\circ, 360^\circ)$?
---
$\cos x = 0$: $x = 90^\circ$ in $x = 270^\circ$. $\sin x = \frac{1}{2}$: $x = 30^\circ$ in $x = 150^\circ$. Skupaj štiri rešitve: $30^\circ$, $90^\circ$, $150^\circ$, $270^\circ$.
:::

## Pogoste napake

- **Ena sama rešitev s kalkulatorja.** Kalkulator vrne le osnovno rešitev. Na krožnici sta pri sinusu in kosinusu navadno dve točki. Vedno dopiši drugo družino: $180^\circ - x_1$ pri sinusu, $-x_1$ pri kosinusu.
- **Napačna perioda.** Kdor si zapomni »tangens ima $180^\circ$«, včasih piše $k \cdot 180^\circ$ tudi pri sinusu. Tako dobi kote, kjer ima sinus nasprotni predznak. Pri sinusu in kosinusu je korak $360^\circ$, pri tangensu $180^\circ$.
- **Minus pri negativni osnovni rešitvi.** Iz $x_1 = -19{,}47^\circ$ nekateri zapišejo $180^\circ - 19{,}47^\circ = 160{,}53^\circ$. Pravilno je $180^\circ - (-19{,}47^\circ) = 199{,}47^\circ$. Preveri predznak: $\sin 160{,}53^\circ$ je pozitiven, iskali pa smo negativnega.
- **Deljenje s kotno funkcijo.** Če enačbo $2\sin x\cos x = \cos x$ deliš s $\cos x$, izgubiš rešitvi $90^\circ$ in $270^\circ$. Namesto deljenja izpostavi.
- **Rešitev, ki ne obstaja.** Pri $\sin x = 1{,}2$ kalkulator javi napako. To ni napaka kalkulatorja: sinus nikoli ne preseže $1$, zato enačba nima rešitev.

## Povzetek

- Trigonometrijska enačba ima navadno neskončno mnogo rešitev; zapišemo jih s splošno rešitvijo, $k \in \mathbb{Z}$.
- $\sin x = a$: $x = x_1 + k \cdot 360^\circ$ ali $x = 180^\circ - x_1 + k \cdot 360^\circ$, $x_1 = \arcsin a$.
- $\cos x = a$: $x = \pm x_1 + k \cdot 360^\circ$, $x_1 = \arccos a$.
- $\tan x = a$: $x = x_1 + k \cdot 180^\circ$, $x_1 = \arctan a$.
- Za $|a| > 1$ enačbi s sinusom in kosinusom nimata rešitev.
- V radianih $360^\circ \to 2\pi$, $180^\circ \to \pi$. Pri $\sin(bx) = a$ najprej reši za $bx$, nato deli z $b$.
- Kotnih funkcij ne krajšaj, ampak izpostavi.

## Drugače: Korak za korakom s številkami

Recept na enačbi $\sin x = 0{,}8$:

1. **Osami funkcijo.** Že je: $\sin x = 0{,}8$.
2. **Preveri, ali rešitev obstaja.** $0{,}8$ je med $-1$ in $1$, zato da.
3. **Osnovna rešitev.** $x_1 = \arcsin 0{,}8 \approx 53{,}13^\circ$.
4. **Druga točka na krožnici.** $180^\circ - 53{,}13^\circ = 126{,}87^\circ$.
5. **Dodaj periodo.** $x = 53{,}13^\circ + k \cdot 360^\circ$ ali $x = 126{,}87^\circ + k \cdot 360^\circ$.
6. **Preveri.** Kalkulator: $\sin 126{,}87^\circ \approx 0{,}8$. ✓
7. **Izberi rešitve na intervalu**, če ga naloga zahteva: na $[0^\circ, 720^\circ)$ so to $53{,}13^\circ$; $126{,}87^\circ$; $413{,}13^\circ$ in $486{,}87^\circ$.

## Drugače: Kot zgodba

Maja programira aplikacijo za vrtljivo držalo telefona. Telefon naj zavibrira vsakič, ko senzor pokaže $\sin x = 0{,}5$. V prvi različici kode napiše `if (kot == asin(0.5))`. Telefon zavibrira enkrat, pri $30^\circ$, in potem nikoli več.

Prvi popravek: od kota odšteje vse cele obrate (vzame ostanek pri deljenju s $360^\circ$), da se po vsakem obratu začne znova. Zdaj telefon zavibrira enkrat na obrat. Maja pa opazi, da graf senzorja v vsakem obratu prečka $0{,}5$ dvakrat: enkrat na poti navzgor, enkrat na poti navzdol.

Drugi popravek: doda še kot $180^\circ - 30^\circ = 150^\circ$. Zdaj telefon zavibrira pri $30^\circ$, $150^\circ$, $390^\circ$, $510^\circ$ … Maja je s tem v kodo zapisala splošno rešitev: dve družini, vsaka s korakom $360^\circ$.

## Preveri se

? Kateri seznam pravilno našteje vse rešitve enačbe $\sin x = \frac{\sqrt{2}}{2}$ na $[0^\circ, 720^\circ)$?
- $45^\circ$, $225^\circ$, $405^\circ$, $585^\circ$
~ To je korak $180^\circ$, kot pri tangensu. Pri $225^\circ$ je sinus negativen.
+ $45^\circ$, $135^\circ$, $405^\circ$, $495^\circ$
- $45^\circ$, $315^\circ$, $405^\circ$, $675^\circ$
~ To je pravilo $\pm x_1$, ki velja za kosinus. Pri $315^\circ$ je sinus negativen.
- $45^\circ$, $405^\circ$
~ To je le osnovna rešitev s periodo. Manjka druga družina $180^\circ - 45^\circ = 135^\circ$.
> Družini sta $45^\circ + k \cdot 360^\circ$ in $135^\circ + k \cdot 360^\circ$; na intervalu sta $k = 0$ in $k = 1$.

? Brez kalkulatorja oceni najmanjšo pozitivno rešitev enačbe $\cos x = 0{,}1$.
- približno $6^\circ$
~ To bi veljalo za $\sin x = 0{,}1$. Kosinus je blizu $0$ pri kotih blizu $90^\circ$, ne $0^\circ$.
+ približno $84^\circ$
- približno $96^\circ$
~ Pri $96^\circ$ je kot v drugem kvadrantu, kjer je kosinus negativen.
> Kosinus je pri $90^\circ$ enak $0$, malo pred tem pa malo pozitiven. Natančno $\arccos 0{,}1 \approx 84{,}26^\circ$.

? Zakaj pri $\tan x = 3$ zadostuje ena družina s korakom $180^\circ$, pri $\sin x = 0{,}3$ pa potrebujemo dve družini s korakom $360^\circ$?
- Ker je tangens vedno pozitiven.
~ Tangens je v II. in IV. kvadrantu negativen. Razlog je v periodi.
+ Ker sta točki, kjer ima tangens enako vrednost, nasprotni in za $180^\circ$ narazen, pri sinusu pa točki nista nasprotni.
- Ker ima enačba s tangensom manj rešitev.
~ Na $[0^\circ, 360^\circ)$ imata obe enačbi po dve rešitvi. Razlikujeta se le v zapisu.
> Premica skozi izhodišče seka krožnico v dveh nasprotnih točkah, $x_1$ in $x_1 + 180^\circ$. Tangens ima periodo $180^\circ$, zato ena družina zajame obe.

? Katera enačba ima splošno rešitev $x = \pm 60^\circ + k \cdot 360^\circ$?
+ $\cos x = \frac{1}{2}$
- $\sin x = \frac{\sqrt{3}}{2}$
~ Sinus ima rešitvi $60^\circ$ in $120^\circ$, ne $-60^\circ$; pri $-60^\circ$ je sinus negativen.
- $\cos x = -\frac{1}{2}$
~ Ta ima osnovno rešitev $120^\circ$, torej $x = \pm 120^\circ + k \cdot 360^\circ$.
- $\tan x = \sqrt{3}$
~ Tangens da $60^\circ + k \cdot 180^\circ$, torej $60^\circ$ in $240^\circ$, ne $-60^\circ$.
> Zapis $\pm x_1$ je značilen za kosinus. $\cos 60^\circ = \cos(-60^\circ) = \frac{1}{2}$.

? Telefon v držalu naredi en obrat v $12\,\text{s}$ ($30^\circ$ na sekundo) in začne pri $x = 0^\circ$. Senzor kaže $\sin x$. Ob katerih sekundah v prvih $24\,\text{s}$ pokaže $-0{,}5$?
+ $7\,\text{s}$, $11\,\text{s}$, $19\,\text{s}$, $23\,\text{s}$
- $1\,\text{s}$, $5\,\text{s}$, $13\,\text{s}$, $17\,\text{s}$
~ To so časi za $+0{,}5$. Pri negativni vrednosti je telefon v III. in IV. kvadrantu.
- $11\,\text{s}$, $23\,\text{s}$
~ To je le družina iz kalkulatorja ($-30^\circ + k \cdot 360^\circ$). Manjka druga, $210^\circ + k \cdot 360^\circ$.
- $7\,\text{s}$, $11\,\text{s}$
~ To sta le časa v prvem obratu. V $24\,\text{s}$ naredi telefon dva obrata.
> $\sin x = -0{,}5$ da $x = 210^\circ$, $330^\circ$, $570^\circ$, $690^\circ$. Deljeno s $30^\circ$ na sekundo: $7$, $11$, $19$ in $23\,\text{s}$.

:::simboli
x | kot zasuka (neznanka) | |
a | desna stran enačbe (dana vrednost) | |
x_1 | osnovna rešitev | x_1 = \arcsin a | | pri kosinusu $\arccos a$, pri tangensu $\arctan a$
k | poljubno celo število | | – | $k \in \mathbb{Z}$
u | napetost v vtičnici | u = 325\,\text{V} \cdot \sin(100\pi t) | V
t | čas | | s
y | nova neznanka (celoten argument sinusa) | y = 100\pi t | rad
:::
