---
stanje: preverjeno
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

**3. Kalkulator in arkus funkcije.** Kot, ki ga ponudi kalkulator (tipka $\sin^{-1}$), imenujemo **arkus sinus**: $\arcsin a$ je tisti kot med $-90^\circ$ in $90^\circ$, katerega sinus je $a$. Temu kotu rečemo **osnovna rešitev** $x_1$. Podobno je $\arccos a$ tisti kot med $0^\circ$ in $180^\circ$, katerega kosinus je $a$. Pri obeh funkcijah mora veljati $-1 \le a \le 1$. $\arctan a$ pa je tisti kot med $-90^\circ$ in $90^\circ$ (brez krajišč), katerega tangens je $a$; tu je $a$ lahko katerokoli realno število. Funkcijam $\arcsin$, $\arccos$ in $\arctan$ rečemo **krožne funkcije**.

*Vrednosti brez kalkulatorja.* Pri znanih vrednostih ($0$, $\frac{1}{2}$, $\frac{\sqrt{2}}{2}$, $\frac{\sqrt{3}}{2}$, $1$, pri tangensu še $\frac{\sqrt{3}}{3}$ in $\sqrt{3}$) poiščeš kot v tabeli kotnih funkcij. Nato preveriš, ali leži v pravem intervalu. Tako je $\arcsin\frac{\sqrt{3}}{2} = 60^\circ$, $\arccos 0 = 90^\circ$ in $\arctan 1 = 45^\circ$.

*Negativna števila.* Tu se funkcije razlikujejo. Arkus sinus in arkus tangens vrneta negativen kot v IV. kvadrantu: $\arcsin\left(-\frac{1}{2}\right) = -30^\circ$, $\arctan(-1) = -45^\circ$. Velja $\arcsin(-a) = -\arcsin a$ in $\arctan(-a) = -\arctan a$. Arkus kosinus pa nikoli ne vrne negativnega kota. Točka z negativno koordinato $x$ in kotom med $0^\circ$ in $180^\circ$ leži v II. kvadrantu, zato je $\arccos(-a) = 180^\circ - \arccos a$. Na primer $\arccos\left(-\frac{1}{2}\right) = 180^\circ - 60^\circ = 120^\circ$.

*Radiani in kalkulator.* V radianih je $\arcsin\frac{1}{2} = \frac{\pi}{6}$ in $\arccos\left(-\frac{1}{2}\right) = \frac{2\pi}{3}$. Kalkulator v načinu DEG vrne stopinje, v načinu RAD radiane: $\arccos 0{,}3 \approx 72{,}54^\circ \approx 1{,}266$.

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

**6. Vsota v produkt in polovični koti (višja raven).** Če enačba vsebuje vsoto ali razliko dveh sinusov (ali kosinusov) z različnima argumentoma, jo s formulo »vsota v produkt« razstavimo, na primer

$$\sin\alpha + \sin\beta = 2\sin\frac{\alpha + \beta}{2}\cos\frac{\alpha - \beta}{2}$$

Produkt je $0$, ko je vsaj en faktor $0$, zato dobimo dve enostavni enačbi (Primer 6).

Kadar nastopata kota $x$ in $\frac{x}{2}$, vse zapišemo s polovičnim kotom. V enačbi $1 + \cos x = \cos\frac{x}{2}$ po formuli polovičnega kota zamenjamo $1 + \cos x = 2\cos^2\frac{x}{2}$, prenesemo na levo in izpostavimo: $\cos\frac{x}{2}\left(2\cos\frac{x}{2} - 1\right) = 0$.

Iz $\cos\frac{x}{2} = 0$ sledi $\frac{x}{2} = 90^\circ + k \cdot 180^\circ$, torej $x = 180^\circ + k \cdot 360^\circ$. Iz $\cos\frac{x}{2} = \frac{1}{2}$ sledi $\frac{x}{2} = \pm 60^\circ + k \cdot 360^\circ$, torej $x = \pm 120^\circ + k \cdot 720^\circ$. Pozor: ko pomnožimo z $2$, se podvoji tudi korak.

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
2. Vse prenesemo na levo in izpostavimo: $\cos x\,(2\sin x - 1) = 0$. S $\cos x$ ne delimo, ker bi izgubili rešitve, pri katerih je $\cos x = 0$.
3. Dobimo dve enostavni enačbi: $\cos x = 0$ ali $\sin x = \frac{1}{2}$. Reši ju sam, nato preveri:

:::premisli
Katere so vse rešitve na $[0^\circ, 360^\circ)$?
---
$\cos x = 0$: $x = 90^\circ$ in $x = 270^\circ$. $\sin x = \frac{1}{2}$: $x = 30^\circ$ in $x = 150^\circ$. Skupaj štiri rešitve: $30^\circ$, $90^\circ$, $150^\circ$, $270^\circ$.
:::

### Primer 5: vrednosti krožnih funkcij

Brez kalkulatorja izračunaj $\arcsin\left(-\dfrac{\sqrt{3}}{2}\right)$, $\arccos\left(-\dfrac{\sqrt{2}}{2}\right)$ in $\arctan\left(-\dfrac{\sqrt{3}}{3}\right)$ v stopinjah in radianih. S kalkulatorjem nato izračunaj še $\arccos(-0{,}3)$ na stotinko stopinje.

**Podatki:** vrednosti $-\frac{\sqrt{3}}{2}$, $-\frac{\sqrt{2}}{2}$, $-\frac{\sqrt{3}}{3}$ in $-0{,}3$
**Iščemo:** kote v stopinjah in radianih

:::formula
$\arcsin$ in $\arctan$: kot med $-90^\circ$ in $90^\circ$; $\arccos$: kot med $0^\circ$ in $180^\circ$; $\arccos(-a) = 180^\circ - \arccos a$
:::

**Rešitev:**

1. $\sin 60^\circ = \frac{\sqrt{3}}{2}$, zato je $\arcsin\left(-\frac{\sqrt{3}}{2}\right) = -60^\circ = -\frac{\pi}{3}$. Kot leži med $-90^\circ$ in $90^\circ$.
2. $\cos 45^\circ = \frac{\sqrt{2}}{2}$. Za negativno vrednost vzamemo kot v II. kvadrantu: $\arccos\left(-\frac{\sqrt{2}}{2}\right) = 180^\circ - 45^\circ = 135^\circ = \frac{3\pi}{4}$. Kot $-45^\circ$ bi bil napačen, ker ni med $0^\circ$ in $180^\circ$.
3. $\tan 30^\circ = \frac{\sqrt{3}}{3}$, zato je $\arctan\left(-\frac{\sqrt{3}}{3}\right) = -30^\circ = -\frac{\pi}{6}$.
4. Kalkulator v načinu DEG: $\arccos(-0{,}3) \approx 107{,}46^\circ$. Preverba z zvezo: $180^\circ - \arccos 0{,}3 \approx 180^\circ - 72{,}54^\circ = 107{,}46^\circ$. ✓
5. Odgovor: $-60^\circ = -\frac{\pi}{3}$, $135^\circ = \frac{3\pi}{4}$, $-30^\circ = -\frac{\pi}{6}$ in $\arccos(-0{,}3) \approx 107{,}46^\circ$.

### Primer 6 (višja raven): vsota sinusov

Reši enačbo $\sin 3x + \sin x = \cos x$ na $[0^\circ, 360^\circ)$.

**Podatki:** $\sin 3x + \sin x = \cos x$, interval $[0^\circ, 360^\circ)$
**Iščemo:** vse rešitve na intervalu

:::formula
$\sin\alpha + \sin\beta = 2\sin\dfrac{\alpha + \beta}{2}\cos\dfrac{\alpha - \beta}{2}$; produkt je $0$, ko je vsaj en faktor $0$.
:::

**Rešitev:**

1. Levo stran zapišemo kot produkt. Ker je $\frac{3x + x}{2} = 2x$ in $\frac{3x - x}{2} = x$, velja $\sin 3x + \sin x = 2\sin 2x\cos x$.
2. Enačba je zdaj $2\sin 2x\cos x = \cos x$. Vse prenesemo na levo in izpostavimo: $\cos x\,(2\sin 2x - 1) = 0$. S $\cos x$ ne delimo.
3. $\cos x = 0$: $x = 90^\circ$ ali $x = 270^\circ$.
4. $\sin 2x = \frac{1}{2}$: $2x = 30^\circ + k \cdot 360^\circ$ ali $2x = 150^\circ + k \cdot 360^\circ$, torej $x = 15^\circ + k \cdot 180^\circ$ ali $x = 75^\circ + k \cdot 180^\circ$. Na intervalu so to $15^\circ$, $75^\circ$, $195^\circ$ in $255^\circ$.
5. Odgovor: enačba ima na intervalu šest rešitev: $15^\circ$, $75^\circ$, $90^\circ$, $195^\circ$, $255^\circ$ in $270^\circ$.

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
- Krožne funkcije: $\arcsin a$ in $\arctan a$ sta kota med $-90^\circ$ in $90^\circ$, $\arccos a$ je kot med $0^\circ$ in $180^\circ$. Velja $\arcsin(-a) = -\arcsin a$, $\arctan(-a) = -\arctan a$, $\arccos(-a) = 180^\circ - \arccos a$.
- V radianih $360^\circ \to 2\pi$, $180^\circ \to \pi$. Pri $\sin(bx) = a$ najprej reši za $bx$, nato deli z $b$.
- Kotnih funkcij ne krajšaj, ampak izpostavi.
- (višja raven) Vsoto sinusov ali kosinusov spremeni v produkt in vsak faktor izenači z $0$. Pri kotih $x$ in $\frac{x}{2}$ vse zapiši s polovičnim kotom ($1 + \cos x = 2\cos^2\frac{x}{2}$).

## Ponovitev

**Formule**
- $\sin x = a$: $x = x_1 + k \cdot 360^\circ$ (na pamet)
- ali $x = 180^\circ - x_1 + k \cdot 360^\circ$ (na pamet)
- $\cos x = a$: $x = \pm x_1 + k \cdot 360^\circ$ (na pamet)
- $\tan x = a$: $x = x_1 + k \cdot 180^\circ$ (na pamet)
- $|a| > 1$: $\sin x = a$ in $\cos x = a$ nimata rešitev (na pamet)
- (višja raven) $\sin\alpha + \sin\beta = 2\sin\frac{\alpha + \beta}{2}\cos\frac{\alpha - \beta}{2}$ (priloga, višja raven)

**Postopek**
1. Enačbo preoblikuj v obliko $\sin x = a$, $\cos x = a$ ali $\tan x = a$; skupni faktor izpostavi.
2. Preveri, ali je $|a| \le 1$ (pri sinusu in kosinusu).
3. S kalkulatorjem izračunaj osnovno rešitev $x_1$ ($\arcsin a$, $\arccos a$ ali $\arctan a$).
4. Dopiši drugo družino in periodo, $k \in \mathbb{Z}$.
5. Pri $\sin(bx) = a$ reši za $bx$, nato deli z $b$; izberi rešitve na danem intervalu.

**Pazi na**
- Dopiši drugo rešitev: $180^\circ - x_1$ pri sinusu, $-x_1$ pri kosinusu.
- Perioda je $360^\circ$ pri sinusu in kosinusu, $180^\circ$ le pri tangensu.
- Ne deli s $\cos x$ ali $\sin x$: izpostavi, sicer izgubiš rešitve.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Rešite enačbo $2\cos\left(x - \dfrac{\pi}{6}\right) = 1$ na intervalu $[0, 2\pi)$.

**Rešitev:**

1. Osamimo kosinus: $\cos\left(x - \frac{\pi}{6}\right) = \frac{1}{2}$. Ker je $\cos\frac{\pi}{3} = \frac{1}{2}$, velja $x - \frac{\pi}{6} = \pm\frac{\pi}{3} + 2k\pi$, $k \in \mathbb{Z}$.
2. Prištejemo $\frac{\pi}{6}$: $x = \frac{\pi}{6} + \frac{\pi}{3} + 2k\pi = \frac{\pi}{2} + 2k\pi$ ali $x = \frac{\pi}{6} - \frac{\pi}{3} + 2k\pi = -\frac{\pi}{6} + 2k\pi$.
3. Na intervalu $[0, 2\pi)$: iz prve družine $k = 0$ da $\frac{\pi}{2}$, iz druge $k = 1$ da $-\frac{\pi}{6} + 2\pi = \frac{11\pi}{6}$.
4. Odgovor: rešitvi sta $x = \dfrac{\pi}{2}$ in $x = \dfrac{11\pi}{6}$.

**Točkovanje:** 1 točka za $x - \frac{\pi}{6} = \pm\frac{\pi}{3} + 2k\pi$, 1 točka za splošno rešitev za $x$, 1 točka za obe rešitvi na intervalu.

### Naloga 2: krajša strukturirana naloga, 6 točk, pola 2 (z računalom)

Sedež panoramskega kolesa je na višini $h = 20 - 18\cos x$ metrov nad tlemi, kjer je $x$ kot, za katerega se je kolo zavrtelo, odkar je bil sedež najnižje. Kolo se vrti enakomerno in naredi en obrat v $12$ minutah.

a) Na kateri višini je sedež, ko se kolo zavrti za $135^\circ$? Rezultat zaokrožite na centimeter. (1 točka)
b) Pri katerih kotih $x$ v prvem obratu, $0^\circ \le x < 360^\circ$, je sedež na višini $26\,\mathrm{m}$? Kota zaokrožite na stotinko stopinje. (3 točke)
c) Koliko časa v enem obratu je sedež više od $26\,\mathrm{m}$? Rezultat zaokrožite na sekundo. (2 točki)

**Rešitev:**

1. a) $h = 20 - 18\cos 135^\circ = 20 + 9\sqrt{2} \approx 32{,}7279\,\mathrm{m} \approx 32{,}73\,\mathrm{m}$.
2. b) Iz $20 - 18\cos x = 26$ sledi $-18\cos x = 6$, torej $\cos x = -\frac{1}{3}$.
3. b) Osnovna rešitev: $x_1 = \arccos\left(-\frac{1}{3}\right) \approx 109{,}4712^\circ$. Splošna rešitev: $x = \pm 109{,}4712^\circ + k \cdot 360^\circ$.
4. b) V prvem obratu: $x \approx 109{,}47^\circ$ in $x \approx -109{,}4712^\circ + 360^\circ = 250{,}5288^\circ \approx 250{,}53^\circ$.
5. c) Sedež je više od $26\,\mathrm{m}$, ko je $\cos x < -\frac{1}{3}$, torej med obema kotoma iz b) (okoli najvišje lege pri $180^\circ$). To je lok $250{,}5288^\circ - 109{,}4712^\circ = 141{,}0576^\circ$.
6. c) En obrat ($360^\circ$) traja $720\,\mathrm{s}$, torej $2\,\mathrm{s}$ za vsako stopinjo: $t = 141{,}0576 \cdot 2\,\mathrm{s} \approx 282{,}12\,\mathrm{s}$.
7. Odgovor: a) približno $32{,}73\,\mathrm{m}$; b) $x \approx 109{,}47^\circ$ in $x \approx 250{,}53^\circ$; c) približno $282\,\mathrm{s}$ ($4$ minute in $42$ sekund).

**Točkovanje:** a) 1 točka za $32{,}73\,\mathrm{m}$; b) 1 točka za $\cos x = -\frac{1}{3}$; 1 točka za $109{,}47^\circ$; 1 točka za drugo rešitev $250{,}53^\circ$; c) 1 točka za lok med rešitvama ($141{,}06^\circ$) ali delež obrata; 1 točka za čas $282\,\mathrm{s}$.

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

a) Z adicijskima izrekoma pokažite, da za vsak $x$ velja $\cos 3x + \cos x = 2\cos 2x\cos x$. (2 točki)
b) Rešite enačbo $\cos 3x + \cos x = \cos 2x$ na intervalu $[0^\circ, 360^\circ)$. (3 točke)
c) Zvezo iz a) uporabite za kot $\dfrac{x}{2}$ in z zapisom s polovičnim kotom rešite enačbo $\cos\dfrac{3x}{2} + \cos\dfrac{x}{2} = 1 + \cos x$ na intervalu $[0^\circ, 720^\circ)$. (5 točk)

**Rešitev:**

1. a) Zapišemo $3x = 2x + x$ in $x = 2x - x$. Po adicijskem izreku je $\cos(2x + x) = \cos 2x\cos x - \sin 2x\sin x$ in $\cos(2x - x) = \cos 2x\cos x + \sin 2x\sin x$.
2. a) Seštejemo: člena s sinusi se odštejeta, zato $\cos 3x + \cos x = 2\cos 2x\cos x$. (Enako da formula $\cos\alpha + \cos\beta = 2\cos\frac{\alpha + \beta}{2}\cos\frac{\alpha - \beta}{2}$.)
3. b) Po a) je enačba $2\cos 2x\cos x = \cos 2x$. Vse prenesemo na levo in izpostavimo (s $\cos 2x$ ne delimo): $\cos 2x\,(2\cos x - 1) = 0$.
4. b) $\cos 2x = 0$: $2x = 90^\circ + k \cdot 180^\circ$, torej $x = 45^\circ + k \cdot 90^\circ$. Na intervalu: $45^\circ$, $135^\circ$, $225^\circ$, $315^\circ$.
5. b) $\cos x = \frac{1}{2}$: $x = \pm 60^\circ + k \cdot 360^\circ$. Na intervalu: $60^\circ$ in $300^\circ$.
6. c) Zvezo iz a) zapišemo za kot $\frac{x}{2}$ (takrat je $2 \cdot \frac{x}{2} = x$ in $3 \cdot \frac{x}{2} = \frac{3x}{2}$): leva stran je $\cos\frac{3x}{2} + \cos\frac{x}{2} = 2\cos x\cos\frac{x}{2}$.
7. c) Desno stran zapišemo s polovičnim kotom: $\cos x = \cos^2\frac{x}{2} - \sin^2\frac{x}{2} = 2\cos^2\frac{x}{2} - 1$, zato $1 + \cos x = 2\cos^2\frac{x}{2}$. Enačba je $2\cos x\cos\frac{x}{2} = 2\cos^2\frac{x}{2}$; prenesemo na levo in izpostavimo: $2\cos\frac{x}{2}\left(\cos x - \cos\frac{x}{2}\right) = 0$.
8. c) $\cos\frac{x}{2} = 0$: $\frac{x}{2} = 90^\circ + k \cdot 180^\circ$, torej $x = 180^\circ + k \cdot 360^\circ$. Na intervalu: $180^\circ$ in $540^\circ$.
9. c) Enačba $\cos x = \cos\frac{x}{2}$: s $\cos x = 2\cos^2\frac{x}{2} - 1$ in $z = \cos\frac{x}{2}$ dobimo $2z^2 - z - 1 = (2z + 1)(z - 1) = 0$, torej $z = 1$ ali $z = -\frac{1}{2}$.
10. c) $\cos\frac{x}{2} = 1$: $\frac{x}{2} = k \cdot 360^\circ$, torej $x = k \cdot 720^\circ$; na intervalu je to $0^\circ$. $\cos\frac{x}{2} = -\frac{1}{2}$: $\frac{x}{2} = \pm 120^\circ + k \cdot 360^\circ$, torej $x = \pm 240^\circ + k \cdot 720^\circ$; na intervalu sta to $240^\circ$ in $-240^\circ + 720^\circ = 480^\circ$.
11. Odgovor: b) $x \in \{45^\circ, 60^\circ, 135^\circ, 225^\circ, 300^\circ, 315^\circ\}$; c) $x \in \{0^\circ, 180^\circ, 240^\circ, 480^\circ, 540^\circ\}$.

**Točkovanje:** a) 1 točka za zapis obeh adicijskih izrekov, 1 točka za sklep; b) 1 točka za izpostavljeni zapis $\cos 2x\,(2\cos x - 1) = 0$, 1 točka za $45^\circ$, $135^\circ$, $225^\circ$ in $315^\circ$, 1 točka za $60^\circ$ in $300^\circ$; c) 1 točka za levo stran $2\cos x\cos\frac{x}{2}$, 1 točka za $1 + \cos x = 2\cos^2\frac{x}{2}$ in izpostavljeni zapis, 1 točka za $180^\circ$ in $540^\circ$, 1 točka za $\cos\frac{x}{2} = 1$ ali $\cos\frac{x}{2} = -\frac{1}{2}$, 1 točka za $0^\circ$, $240^\circ$ in $480^\circ$.

### Ustno vprašanje 1

:::premisli
Zapiši splošno rešitev enačbe $\sin x = a$ in pojasni, za katere vrednosti $a$ ima enačba rešitve.
---
Enačba $\sin x = a$ ima rešitve natanko tedaj, ko je $-1 \le a \le 1$, saj je $\sin x$ koordinata $y$ točke na enotski krožnici. Če je $x_1 = \arcsin a$, so vse rešitve $x = x_1 + k \cdot 360^\circ$ ali $x = 180^\circ - x_1 + k \cdot 360^\circ$, kjer je $k$ poljubno celo število. Družini sta dve, ker vodoravna premica $y = a$ seka enotsko krožnico v dveh točkah, ki sta zrcalni glede na os $y$. Korak $360^\circ$ je perioda sinusa.
:::

### Ustno vprašanje 2

:::premisli
Navedi primer trigonometrijske enačbe, pri kateri z deljenjem s kotno funkcijo izgubimo rešitve, in pojasni, kako jo rešimo pravilno.
---
Primer je enačba $\sin 2x = \sin x$, ki jo zapišemo kot $2\sin x\cos x = \sin x$. Če jo delimo s $\sin x$, izgubimo vse rešitve, pri katerih je $\sin x = 0$, torej $x = k \cdot 180^\circ$. Pravilno je vse prenesti na eno stran in izpostaviti: $\sin x\,(2\cos x - 1) = 0$. Produkt je enak $0$, ko je vsaj en faktor enak $0$, zato rešimo $\sin x = 0$ in $\cos x = \frac{1}{2}$ ter rešitve obeh enačb združimo.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Izpelji zvezo $1 + \cos x = 2\cos^2\frac{x}{2}$ in pojasni, kdaj jo uporabimo pri reševanju trigonometrijskih enačb.
---
Kot $x$ zapišemo kot dvojni kot $2 \cdot \frac{x}{2}$ in uporabimo formulo za kosinus dvojnega kota: $\cos x = \cos^2\frac{x}{2} - \sin^2\frac{x}{2}$. Ker je $\sin^2\frac{x}{2} = 1 - \cos^2\frac{x}{2}$, velja $\cos x = 2\cos^2\frac{x}{2} - 1$ oziroma $1 + \cos x = 2\cos^2\frac{x}{2}$. Zvezo uporabimo, ko v enačbi nastopata kota $x$ in $\frac{x}{2}$, da vse zapišemo s funkcijo polovičnega kota. Ko rešitve za $\frac{x}{2}$ pomnožimo z $2$, se podvoji tudi korak periode.
:::

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

? (brez računala) Izračunaj $\arccos\left(-\dfrac{\sqrt{3}}{2}\right)$. Rezultat vpiši v stopinjah.
= 150 | 0
~ -30 | Arkus kosinus nikoli ne vrne negativnega kota. Vrne kot med $0^\circ$ in $180^\circ$.
~ 30 | Kosinus kota $30^\circ$ je pozitiven, $\frac{\sqrt{3}}{2}$. Za negativno vrednost potrebuješ kot v II. kvadrantu.
~ 210 | Tudi $\cos 210^\circ = -\frac{\sqrt{3}}{2}$, a $210^\circ$ ni med $0^\circ$ in $180^\circ$.
> $\cos 30^\circ = \frac{\sqrt{3}}{2}$, zato je $\arccos\left(-\frac{\sqrt{3}}{2}\right) = 180^\circ - 30^\circ = 150^\circ$.

? (brez računala) Kolikšna je najmanjša pozitivna rešitev enačbe $\tan x = -1$? Vpiši jo v stopinjah.
= 135 | 0
~ -45 | To je osnovna rešitev $\arctan(-1)$, ki ni pozitivna. Prištej periodo tangensa $180^\circ$.
~ 315 | Tudi $315^\circ$ je rešitev, a ni najmanjša: tangens ima periodo $180^\circ$, zato je rešitev že $-45^\circ + 180^\circ$.
~ 45 | Pri $45^\circ$ je tangens $1$, ne $-1$. Negativen je v II. in IV. kvadrantu.
> $\arctan(-1) = -45^\circ$, splošna rešitev je $x = -45^\circ + k \cdot 180^\circ$. Najmanjša pozitivna je pri $k = 1$: $x = 135^\circ$.

<<RACUN
vrednost: asin(sqrt(3)/2)*180/pi | 60
vrednost: acos(0)*180/pi | 90
vrednost: atan(1)*180/pi | 45
vrednost: asin(-1/2)*180/pi | -30
vrednost: atan(-1)*180/pi | -45
vrednost: acos(-1/2)*180/pi | 120
vrednost: acos(-1/2) | 2*pi/3
vrednost: acos(0.3)*180/pi | 72.54
vrednost: acos(0.3) | 1.266
vrednost: asin(-sqrt(3)/2) | -pi/3
vrednost: acos(-sqrt(2)/2) | 3*pi/4
vrednost: atan(-sqrt(3)/3) | -pi/6
vrednost: acos(-0.3)*180/pi | 107.46
vrednost: acos(-sqrt(3)/2)*180/pi | 150
enako: sin(3*x)+sin(x) | 2*sin(2*x)*cos(x)
resi: sin(3*x)+sin(x)=cos(x) | x | pi/2+k*pi, pi/12+k*pi, 5*pi/12+k*pi
enako: 1+cos(x) | 2*cos(x/2)^2
resi: 1+cos(x)=cos(x/2) | x | pi+2*k*pi, 2*pi/3+4*k*pi, -2*pi/3+4*k*pi
resi: 2*cos(x-pi/6)=1 | x | pi/2+2*k*pi, -pi/6+2*k*pi
vrednost: 20-18*cos(135°) | 32.73
resi: 20-18*cos(x)=26 | x | acos(-1/3)+2*k*pi, -acos(-1/3)+2*k*pi
vrednost: acos(-1/3)*180/pi | 109.47
vrednost: 360-acos(-1/3)*180/pi | 250.53
vrednost: 360-2*acos(-1/3)*180/pi | 141.06
vrednost: 2*(360-2*acos(-1/3)*180/pi) | 282.12
enako: cos(3*x)+cos(x) | 2*cos(2*x)*cos(x)
resi: cos(3*x)+cos(x)=cos(2*x) | x | pi/4+k*pi, 3*pi/4+k*pi, pi/3+2*k*pi, -pi/3+2*k*pi
enako: cos(3*x/2)+cos(x/2) | 2*cos(x)*cos(x/2)
enako: 1+cos(x) | 2*cos(x/2)^2
resi: 2*z^2-z-1=0 | z | 1, -1/2
resi: cos(3*x/2)+cos(x/2)=1+cos(x) | x | 4*k*pi, pi+2*k*pi, 4*pi/3+4*k*pi, -4*pi/3+4*k*pi
>>

:::simboli
x | kot zasuka (neznanka) | |
a | desna stran enačbe (dana vrednost); število, katerega arkus računamo | |
x_1 | osnovna rešitev | x_1 = \arcsin a | | pri kosinusu $\arccos a$, pri tangensu $\arctan a$
k | poljubno celo število | | – | $k \in \mathbb{Z}$
u | napetost v vtičnici | u = 325\,\text{V} \cdot \sin(100\pi t) | V
t | čas | | s
y | nova neznanka (celoten argument sinusa) | y = 100\pi t | rad
\alpha, \beta | kota v formuli vsota v produkt | |
:::
