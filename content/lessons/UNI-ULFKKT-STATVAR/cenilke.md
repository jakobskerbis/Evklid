---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Med drugo svetovno vojno so zavezniki želeli vedeti, koliko tankov mesečno izdela nemška industrija. Obveščevalna poročila so navajala zelo visoke številke. Statistiki so imeli drug vir: zaporedne serijske številke na delih zajetih tankov. Iz nekaj takih številk so ocenili celotno proizvodnjo. Ko so po vojni pregledali tovarniške dokumente, so bile statistične ocene precej bližje resnici kot obveščevalne.

Isto uganko poznaš iz igre. Na klubski tomboli so listki oštevilčeni od $1$ do $N$, a $N$ ne poznaš. Izvlečejo štiri listke: $17$, $52$, $38$, $61$. Koliko je vseh listkov? Ko odgovarjaš, uporabiš **cenilko**: pravilo, ki iz vzorca izračuna oceno neznanega parametra.

V varnostni statistiki je naloga ista. Iz števila nezgod, okvar ali izpadov v nekaj mesecih ocenimo pogostost, na kateri temelji ocena tveganja. Cenilko sestavimo z metodo največjega verjetja, ki jo je v začetku 20. stoletja razvil R. A. Fisher. Ali cenilka sistematično greši v eno smer, pove njena (ne)pristranskost.

## Razlaga

**Skušnjava.** Pri tomboli se ponuja odgovor: »Največja številka, ki sem jo videl, je $61$, torej je listkov $61$.« Zveni razumno, saj vsaj $61$ listkov mora biti.

:::premisli
Žrebanje si zamisli ponovljeno velikokrat. Ali ocena »$N \approx$ največja številka« kdaj **preceni** $N$? Kako pogosto ga zadene natanko? V katero smer torej greši v povprečju?
---
Večja od $N$ ne more biti nikoli, enaka $N$ pa le, če slučajno izvlečemo prav zadnji listek. Največja številka je torej vedno $\le N$ in pogosto manjša. Ocena zato v povprečju **podceni** $N$; greši sistematično v eno smer.
:::

**Cenilka in ocena.** **Enostavni slučajni vzorec** velikosti $n$ so neodvisne slučajne spremenljivke $X_1, \dots, X_n$, porazdeljene enako kot opazovana spremenljivka $X$. (Pri tomboli brez vračanja niso neodvisne, a je zaradi simetrije vsaka $X_i$ enakomerno porazdeljena na $\{1, \dots, N\}$.) **Cenilka** parametra $\theta$ je funkcija vzorca $\hat{\theta} = T(X_1, \dots, X_n)$, ki ne vsebuje neznanih parametrov. Zato je tudi sama slučajna spremenljivka: pri vsakem novem vzorcu da drugo vrednost. **Ocena** je ena konkretna vrednost, na primer $61$.

**Pristranskost** cenilke je razlika med njeno pričakovano vrednostjo in pravim parametrom:

$$b(\hat{\theta}) = E(\hat{\theta}) - \theta$$

Cenilka je **nepristranska**, če je $E(\hat{\theta}) = \theta$ za vsako možno vrednost $\theta$. To ne pomeni, da zadene pri tvojem vzorcu. Pomeni, da bi se njene ocene pri mnogo ponovitvah v povprečju ujele s $\theta$.

**Izrek (vzorčno povprečje).** Naj bodo $X_1, \dots, X_n$ neodvisne z $E(X_i) = \mu$ in $D(X_i) = \sigma^2$. Potem za vzorčno povprečje $\bar X = \frac{1}{n}\sum X_i$ velja $E(\bar X) = \mu$ in $D(\bar X) = \frac{\sigma^2}{n}$.

*Dokaz.* Pričakovana vrednost je linearna: $E(\bar X) = \frac{1}{n}\sum E(X_i) = \frac{1}{n} \cdot n\mu = \mu$. Disperzija neodvisnih spremenljivk je aditivna in $D(aY) = a^2 D(Y)$, zato $D(\bar X) = \frac{1}{n^2} \cdot n\sigma^2 = \frac{\sigma^2}{n}$. $\square$

Za $E(\bar X) = \mu$ zadošča linearnost; neodvisnost je potrebna šele za disperzijo.

Za tombolo velja (preverba na majhnem primeru je v »Korak za korakom«, izpeljava v »Bolj natančno«): če izvlečemo $k$ listkov brez vračanja in je $M$ največja številka, je

$$E(M) = \frac{k(N+1)}{k+1} < N.$$

Popravljena cenilka $\hat N = M \cdot \dfrac{k+1}{k} - 1$ je nepristranska: ko vstavimo $E(M)$, dobimo $(N+1) - 1 = N$.

**Druga skušnjava: »najverjetnejši parameter«.** Kako sploh pridemo do cenilke? Ideja je izbrati vrednost parametra, pri kateri bi bili **naši podatki** najbolj verjetni. Košarkar zadene $8$ od $10$ prostih metov. Verjetnost tega izida pri deležu zadetkov $p$ je $\binom{10}{8}p^8(1-p)^2$:

| $p$ | verjetnost izida »8 od 10« |
|---|---|
| $0{,}5$ | $0{,}044$ |
| $0{,}6$ | $0{,}121$ |
| $0{,}7$ | $0{,}234$ |
| $0{,}8$ | $0{,}302$ |
| $0{,}9$ | $0{,}194$ |

Največja je pri $p = 0{,}8$. Tabela pa **ne** pove, da je $p = 0{,}8$ »najverjetnejši«. Podatki so fiksni, spreminjamo $p$; vrednosti v stolpcu se ne seštejejo v $1$.

**Funkcija verjetja.** Za neodvisne podatke $x_1, \dots, x_n$ z gostoto ali verjetnostno funkcijo $f(x;\theta)$ je

$$L(\theta) = \prod_{i=1}^{n} f(x_i;\theta).$$

**Cenilka največjega verjetja** (MLE, angl. *maximum likelihood estimator*) je $\hat{\theta}$, pri kateri je $L$ največja. Ker je logaritem naraščajoč, je laže maksimizirati $\ell(\theta) = \ln L(\theta)$: produkt postane vsota. Recept:

1. zapiši $L(\theta)$ in $\ell(\theta)$,
2. reši $\ell'(\theta) = 0$,
3. preveri, da gre za maksimum, in poglej tudi robove dovoljenih $\theta$.

**Invariantnost.** Če je $\hat\theta$ MLE za $\theta$ in je $g$ bijektivna, je $g(\hat\theta)$ MLE za $g(\theta)$: verjetje, zapisano s parametrom $g(\theta)$, zavzame iste vrednosti, zato je največje pri $g(\hat\theta)$.

**MLE ni nujno nepristranska.** Za normalno porazdelitev je $\ell(\mu, \sigma^2) = -\frac{n}{2}\ln(2\pi\sigma^2) - \frac{1}{2\sigma^2}\sum (x_i - \mu)^2$. Enačba $\frac{\partial \ell}{\partial \mu} = \frac{1}{\sigma^2}\sum (x_i - \mu) = 0$ da $\hat\mu = \bar x$. Enačba $\frac{\partial \ell}{\partial \sigma^2} = -\frac{n}{2\sigma^2} + \frac{1}{2\sigma^4}\sum (x_i - \mu)^2 = 0$ pri $\mu = \bar x$ da $\sigma^2 = \frac{1}{n}\sum (x_i - \bar x)^2$. Metoda torej da $\hat{\mu} = \bar X$ in

$$\hat{\sigma}^2 = \frac1n \sum_{i=1}^{n} (X_i - \bar X)^2.$$

$\bar X$ je nepristranska, $\hat{\sigma}^2$ pa ne: $E(\hat{\sigma}^2) = \dfrac{n-1}{n}\sigma^2$. Nepristranska je **vzorčna disperzija** z delitvijo z $n-1$:

$$s^2 = \frac{1}{n-1}\sum_{i=1}^{n}(X_i - \bar X)^2.$$

**Izrek.** Naj bodo $X_1, \dots, X_n$ ($n \ge 2$) neodvisne z $E(X_i) = \mu$ in $D(X_i) = \sigma^2$. Potem je $E(s^2) = \sigma^2$ in $E(\hat\sigma^2) = \frac{n-1}{n}\sigma^2$. Normalnost ni potrebna.

*Dokaz.* Velja identiteta $\sum (X_i - \bar X)^2 = \sum (X_i - \mu)^2 - n(\bar X - \mu)^2$ (izpeljava v »Bolj natančno«). Prvi člen ima pričakovano vrednost $n\sigma^2$, drugi $n\,D(\bar X) = \sigma^2$. Skupaj je $E\big[\sum (X_i - \bar X)^2\big] = (n-1)\sigma^2$; deljeno z $n - 1$ da $\sigma^2$, deljeno z $n$ pa $\frac{n-1}{n}\sigma^2$. $\square$

:::premisli
Zakaj deljenje z $n$ disperzijo v povprečju podceni? Namig: od katere točke so podatki v povprečju najmanj oddaljeni?
---
Vsota $\sum (x_i - c)^2$ je najmanjša prav pri $c = \bar x$. Ker $\mu$ ne poznamo, merimo odmike od $\bar x$, ki je podatkom bližje kot pravi $\mu$. Odmiki so zato premajhni, vsota tudi. Delitev z $n-1$ to natanko popravi.
:::

Pristranskost $\hat{\sigma}^2$ je $-\sigma^2/n$ in gre proti $0$, ko $n$ raste. Cenilka je **asimptotično nepristranska**, če gre njena pristranskost proti $0$, ko $n \to \infty$. Pri velikih vzorcih je razlika med $n$ in $n-1$ zanemarljiva, pri petih meritvah pa ne.

**Srednja kvadratna napaka.** Nepristranskost ne pove, kako daleč ocene padajo od $\theta$. To meri $\mathrm{MSE}(\hat\theta) = E\big[(\hat\theta - \theta)^2\big]$ in velja $\mathrm{MSE}(\hat\theta) = D(\hat\theta) + b(\hat\theta)^2$. *Dokaz:* $\hat\theta - \theta = \big(\hat\theta - E(\hat\theta)\big) + b$; po kvadriranju in pričakovani vrednosti je mešani člen $2b\,E\big(\hat\theta - E(\hat\theta)\big) = 0$. Pri nepristranski cenilki je MSE kar disperzija. Od dveh nepristranskih cenilk je boljša tista z manjšo disperzijo.

Cenilka $\hat\theta_n$ je **dosledna**, če za vsak $\varepsilon > 0$ gre $P(|\hat\theta_n - \theta| \ge \varepsilon)$ proti $0$, ko $n \to \infty$. Zadošča, da gre $\mathrm{MSE}(\hat\theta_n)$ proti $0$, saj po neenakosti Markova, uporabljeni na $(\hat\theta_n - \theta)^2$, velja $P(|\hat\theta_n - \theta| \ge \varepsilon) \le \frac{\mathrm{MSE}(\hat\theta_n)}{\varepsilon^2}$. Zato je $\bar X$ dosledna cenilka za $\mu$: $\mathrm{MSE} = \frac{\sigma^2}{n} \to 0$.

## Rešeni primeri

### Primer 1 (lažji): prosti meti

Košarkarka zadene $34$ od $40$ prostih metov. Meti so neodvisni, vsak z enako verjetnostjo zadetka $p$. Poišči MLE za $p$ in povej, ali je nepristranska.

**Podatki:** $n = 40$ metov, $k = 34$ zadetkov, neodvisni poskusi z verjetnostjo $p$
**Iščemo:** $\hat p$ in $E(\hat p)$

:::formula
$\ell(p) = k \ln p + (n-k)\ln(1-p)$
:::

**Rešitev:**

1. Verjetje (brez konstante $\binom{n}{k}$, ki ne premakne maksimuma): $L(p) = p^{k}(1-p)^{n-k}$.
2. Odvod: $\ell'(p) = \dfrac{k}{p} - \dfrac{n-k}{1-p} = 0$.
3. Pomnožimo s $p(1-p)$: $k(1-p) = (n-k)p$, torej $\hat p = \dfrac{k}{n}$.
4. $\hat p = \dfrac{34}{40} = 0{,}85$.
5. Število zadetkov $K$ je binomsko, $E(K) = np$, zato $E(\hat p) = \dfrac{np}{n} = p$: cenilka je nepristranska.
6. Odgovor: $\hat p = 0{,}85$; cenilka $K/n$ je nepristranska.

### Primer 2: goli na tekmo

Ekipa je na desetih tekmah dosegla $2, 0, 3, 1, 1, 4, 2, 0, 1, 2$ gola. Število golov na tekmo modeliramo s Poissonovo porazdelitvijo s parametrom $\lambda$. Poišči MLE za $\lambda$ in z njim oceni verjetnost, da ekipa na tekmi ne zadene.

**Podatki:** $n = 10$, $\sum x_i = 16$, $X_i \sim \mathrm{Poisson}(\lambda)$, neodvisni
**Iščemo:** $\hat\lambda$ in oceno $P(X = 0)$

:::formula
$\ell(\lambda) = -n\lambda + \Big(\sum x_i\Big)\ln\lambda - \sum \ln(x_i!)$
:::

**Rešitev:**

1. $f(x;\lambda) = e^{-\lambda}\lambda^x / x!$, zato po logaritmiranju produkta dobimo $\ell(\lambda)$ zgoraj.
2. $\ell'(\lambda) = -n + \dfrac{\sum x_i}{\lambda} = 0$ da $\hat\lambda = \dfrac{\sum x_i}{n} = \bar x$.
3. $\ell''(\lambda) = -\sum x_i / \lambda^2 < 0$, torej je to maksimum.
4. $\hat\lambda = \dfrac{16}{10} = 1{,}6$ gola na tekmo.
5. $P(X=0) = e^{-\lambda}$. Po invariantnosti dobimo MLE za $e^{-\lambda}$ tako, da vstavimo $\hat\lambda$: $e^{-1{,}6} \approx 0{,}202$.
6. Ker je $E(\bar X) = \lambda$, je $\hat\lambda$ nepristranska.
7. Odgovor: $\hat\lambda = 1{,}6$; ekipa ostane brez gola na približno $20\,\%$ tekem.

### Primer 3 (težji): tombola

Listki so oštevilčeni od $1$ do $N$. Brez vračanja izvlečemo $k = 4$ listke: $17$, $52$, $38$, $61$. Poišči MLE za $N$ in nepristransko oceno iz največje številke. Sošolka predlaga še cenilko $\tilde N = 2\bar X - 1$. Dokaži, da je tudi ta nepristranska, izračunaj oceno in odloči, kateri cenilki bolj zaupaš. Znani sta disperziji $D(\hat N) = \frac{(N-k)(N+1)}{k(k+2)}$ in $D(\tilde N) = \frac{(N-k)(N+1)}{3k}$.

**Podatki:** $k = 4$, izvlečeno $17, 52, 38, 61$, največja številka $m = 61$, vsaka četverica je enako verjetna; disperziji obeh cenilk zgoraj
**Iščemo:** $\hat N_\mathrm{ML}$, nepristransko $\hat N$, oceno $\tilde N$ in primerjavo cenilk

:::formula
$L(N) = \dfrac{1}{\binom{N}{k}}$ za $N \ge m$, sicer $0$; $\quad \hat N = m \cdot \dfrac{k+1}{k} - 1$; $\quad \mathrm{MSE} = D + b^2$
:::

**Rešitev:**

1. Pri $N < 61$ listka $61$ ne bi mogli izvleči, zato $L(N) = 0$.
2. Za $N \ge 61$ je $L(N) = 1/\binom{N}{4}$; ko $N$ raste, $\binom{N}{4}$ raste, $L$ pada.
3. Odvoda ne izenačimo z $0$: maksimum je na robu, pri najmanjšem dovoljenem $N$. Torej $\hat N_\mathrm{ML} = 61$.
4. Iz razlage vemo, da je $E(M) < N$, zato ta cenilka podcenjuje.
5. Popravek: $\hat N = 61 \cdot \dfrac{5}{4} - 1 = 75{,}25$.
6. Druga cenilka: vsaka $X_i$ je enakomerno porazdeljena na $\{1, \dots, N\}$, zato $E(X_i) = \frac{N+1}{2}$ in po linearnosti $E(\bar X) = \frac{N+1}{2}$. Sledi $E(\tilde N) = 2 \cdot \frac{N+1}{2} - 1 = N$: tudi $\tilde N$ je nepristranska. Neodvisnosti za to ne potrebujemo.
7. Ocena: $\bar x = \frac{168}{4} = 42$, $\tilde N = 2 \cdot 42 - 1 = 83$.
8. Obe cenilki sta nepristranski, zato je MSE kar disperzija. Razmerje $\frac{D(\hat N)}{D(\tilde N)} = \frac{3}{k+2} = \frac{1}{2}$ je manjše od $1$ za vsak $k > 1$.
9. Pri $N \approx 75$: $D(\hat N) \approx \frac{71 \cdot 76}{24} \approx 225$, standardni odklon okoli $15$; $D(\tilde N) \approx \frac{71 \cdot 76}{12} \approx 450$, odklon okoli $21$.
10. Odgovor: MLE da $61$ (podcenjuje), nepristranska ocena iz največje številke je približno $75$ listkov, $\tilde N$ da $83$. Bolj zaupamo $\hat N$, ker ima pri isti (ničelni) pristranskosti pol manjšo disperzijo.

### Primer 4 – zdaj ti

Sprinter je v štirih tekih na $100\,\mathrm{m}$ dosegel $11{,}2$; $11{,}5$; $11{,}0$ in $11{,}3\,\mathrm{s}$. Čase modeliramo z normalno porazdelitvijo. Izračunaj $\hat{\sigma}^2$ (MLE) in nepristransko $s^2$.

**Podatki:** $n = 4$, časi $11{,}2$; $11{,}5$; $11{,}0$; $11{,}3\,\mathrm{s}$
**Iščemo:** $\hat{\sigma}^2$ in $s^2$

:::formula
$\hat{\sigma}^2 = \dfrac{1}{n}\sum (x_i - \bar x)^2$, $\quad s^2 = \dfrac{1}{n-1}\sum (x_i - \bar x)^2$
:::

**Rešitev:**

1. $\bar x = \dfrac{45}{4} = 11{,}25\,\mathrm{s}$.
2. Kvadrati odmikov: $0{,}0025$; $0{,}0625$; $0{,}0625$; $0{,}0025$; vsota $0{,}13\,\mathrm{s^2}$.
3. Zdaj deli sam, nato preveri:

:::premisli
Katera od obeh ocen je večja in za koliko? Izračunaj $\hat{\sigma}^2$ in $s^2$.
---
$\hat{\sigma}^2 = 0{,}13/4 = 0{,}0325\,\mathrm{s^2}$, $s^2 = 0{,}13/3 \approx 0{,}0433\,\mathrm{s^2}$. Pri $n = 4$ je razlika kar tretjina.
:::

## Pogoste napake

- **Verjetje je verjetnost parametra.** »$L(0{,}8) = 0{,}30$, torej je $p = 0{,}8$ s $30\,\%$ verjetnostjo.« Napačno: $L$ je verjetnost **podatkov** pri danem $p$; po $p$ se ne sešteje v $1$. Prav: MLE je vrednost, pri kateri so podatki najbolj verjetni.
- **Nepristranska pomeni točna.** »Moja ocena je nepristranska, torej je prava vrednost.« Napačno: nepristranskost je lastnost povprečja čez vse možne vzorce. Prav: posamezna ocena lahko zgreši; o natančnosti govori disperzija cenilke.
- **MLE je vedno nepristranska.** Protiprimera sta $\hat{\sigma}^2$ z delitvijo z $n$ in največja številka pri tomboli. Prav: pristranskost vedno preveri z $E(\hat{\theta})$.
- **Vedno iščem ničlo odvoda.** Pri tomboli $L(N)$ pada, odvod nima ničle. Prav: maksimum je lahko na robu dovoljenih vrednosti; preveri robove.

## Povzetek

- Cenilka $\hat{\theta} = T(X_1,\dots,X_n)$ je slučajna spremenljivka; ocena je njena vrednost pri danem vzorcu.
- Pristranskost $b = E(\hat{\theta}) - \theta$; nepristranska, če $E(\hat{\theta}) = \theta$ za vsak $\theta$.
- MLE: maksimiziraj $L(\theta) = \prod f(x_i;\theta)$ oziroma $\ell = \ln L$; reši $\ell' = 0$ in preveri robove.
- Bernoulli: $\hat p = k/n$; Poisson: $\hat\lambda = \bar x$; normalna: $\hat{\mu} = \bar x$, $\hat{\sigma}^2 = \frac1n\sum(x_i-\bar x)^2$.
- $\hat{\sigma}^2$ je pristranska ($E = \frac{n-1}{n}\sigma^2$); nepristranska je $s^2$ z $n-1$.
- Tombola: MLE $= M$ podcenjuje; nepristranska je $M\frac{k+1}{k} - 1$.

## Za izpit

Znati moraš povedati:

- natančne definicije enostavnega slučajnega vzorca, cenilke, pristranskosti, nepristranske, asimptotično nepristranske in dosledne cenilke ter srednje kvadratne napake;
- funkcijo verjetja in cenilko največjega verjetja, recept z robovi in lastnost invariantnosti;
- izreka $E(\bar X) = \mu$, $D(\bar X) = \frac{\sigma^2}{n}$ in $E(s^2) = \sigma^2$ s pogoji in dokazi;
- izpeljavo MLE za Bernoullijevo, Poissonovo in normalno porazdelitev;
- razcep $\mathrm{MSE} = D + b^2$ z dokazom in zakaj MLE ni nujno nepristranska.

### Naloga 1

Življenjske dobe petih senzorjev plina so $120$, $340$, $80$, $210$ in $250\,\mathrm{h}$. Modeliramo jih z eksponentno porazdelitvijo z gostoto $f(x;\lambda) = \lambda e^{-\lambda x}$ za $x \ge 0$. (a) Poišči MLE za $\lambda$ in preveri, da gre za maksimum. (b) Oceni verjetnost, da senzor deluje več kot $100\,\mathrm{h}$. (c) Za $S = X_1 + \dots + X_n$ ($n \ge 2$) velja $E(1/S) = \frac{\lambda}{n-1}$. Ali je $\hat\lambda$ nepristranska? Poišči nepristransko cenilko oblike $c/S$ in izračunaj oceno.

**Rešitev:**

1. (a) $L(\lambda) = \prod \lambda e^{-\lambda x_i} = \lambda^n e^{-\lambda \sum x_i}$, zato $\ell(\lambda) = n\ln\lambda - \lambda\sum x_i$.
2. $\ell'(\lambda) = \frac{n}{\lambda} - \sum x_i$; ničla odvoda je $\hat\lambda = \frac{n}{\sum x_i} = \frac{1}{\bar x}$.
3. $\ell''(\lambda) = -\frac{n}{\lambda^2} < 0$, zato je edina kritična točka na $\lambda > 0$ maksimum.
4. $\sum x_i = 1000\,\mathrm{h}$, $\hat\lambda = \frac{5}{1000} = 0{,}005\,\mathrm{h^{-1}}$.
5. (b) $P(X > 100) = e^{-100\lambda}$; funkcija $\lambda \mapsto e^{-100\lambda}$ je bijektivna, zato je po invariantnosti MLE enaka $e^{-0{,}5} \approx 0{,}607$.
6. (c) $\hat\lambda = n/S$, zato $E(\hat\lambda) = n\,E(1/S) = \frac{n}{n-1}\lambda > \lambda$: cenilka je pristranska (precenjuje), pristranskost je $\frac{\lambda}{n-1}$ in gre proti $0$, torej je asimptotično nepristranska.
7. Iz $E(c/S) = \frac{c\lambda}{n-1} = \lambda$ za vsak $\lambda$ sledi $c = n - 1$; nepristranska je $\tilde\lambda = \frac{n-1}{S}$.
8. Ocena: $\tilde\lambda = \frac{4}{1000} = 0{,}004\,\mathrm{h^{-1}}$.
9. Odgovor: $\hat\lambda = 0{,}005\,\mathrm{h^{-1}}$ (pristranska), ocenjena verjetnost delovanja nad $100\,\mathrm{h}$ je okoli $61\,\%$, nepristranska ocena pa je $0{,}004\,\mathrm{h^{-1}}$.

### Naloga 2

Naj bodo $X_1, \dots, X_n$ ($n \ge 2$) neodvisne z $E(X_i) = \mu$ in $D(X_i) = \sigma^2 > 0$. (a) Natančno navedi in dokaži izrek o nepristranskosti $s^2$. (b) Utemelji, ali je $s$ nepristranska cenilka za $\sigma$. (c) Za normalni vzorec velja $D(s^2) = \frac{2\sigma^4}{n-1}$. Izračunaj MSE cenilk $s^2$ in $\hat\sigma^2$ ter utemelji, ali je nepristranska cenilka vedno boljša.

**Rešitev:**

1. (a) Izrek: pri danih pogojih je $E(s^2) = \sigma^2$. Identiteta: $X_i - \bar X = (X_i - \mu) - (\bar X - \mu)$; kvadriramo in seštejemo, mešani člen je $-2(\bar X - \mu)\sum (X_i - \mu) = -2n(\bar X - \mu)^2$, zato $\sum (X_i - \bar X)^2 = \sum (X_i - \mu)^2 - n(\bar X - \mu)^2$.
2. $E\big[\sum (X_i - \mu)^2\big] = n\sigma^2$ in $E\big[n(\bar X - \mu)^2\big] = n\,D(\bar X) = \sigma^2$, zato $E\big[\sum (X_i - \bar X)^2\big] = (n-1)\sigma^2$ in $E(s^2) = \sigma^2$.
3. (b) Za vsako slučajno spremenljivko velja $D(s) = E(s^2) - E(s)^2 \ge 0$, zato $E(s)^2 = \sigma^2 - D(s)$.
4. Pri $\sigma^2 > 0$ $s$ ni konstanta (pri normalnem vzorcu zavzame različne vrednosti), zato je $D(s) > 0$ in $E(s) < \sigma$. Cenilka $s$ je pristranska: v povprečju podcenjuje $\sigma$.
5. (c) $s^2$ je nepristranska, zato $\mathrm{MSE}(s^2) = D(s^2) = \frac{2\sigma^4}{n-1}$.
6. $\hat\sigma^2 = \frac{n-1}{n}s^2$, zato $D(\hat\sigma^2) = \frac{(n-1)^2}{n^2} \cdot \frac{2\sigma^4}{n-1} = \frac{2(n-1)\sigma^4}{n^2}$; pristranskost je $-\frac{\sigma^2}{n}$.
7. $\mathrm{MSE}(\hat\sigma^2) = \frac{2(n-1)\sigma^4}{n^2} + \frac{\sigma^4}{n^2} = \frac{(2n-1)\sigma^4}{n^2}$.
8. Primerjava: $\frac{2n-1}{n^2} < \frac{2}{n-1}$ je isto kot $(2n-1)(n-1) < 2n^2$, to je $2n^2 - 3n + 1 < 2n^2$ oziroma $3n > 1$, kar velja za vsak $n$. Pri $n = 4$: $\mathrm{MSE}(s^2) \approx 0{,}667\,\sigma^4$, $\mathrm{MSE}(\hat\sigma^2) = 0{,}4375\,\sigma^4$.
9. Odgovor: $s^2$ je nepristranska, $s$ pa ne ($E(s) < \sigma$). Pristranska $\hat\sigma^2$ ima pri normalnem vzorcu za vsak $n$ manjšo srednjo kvadratno napako, zato nepristranska cenilka ni vedno boljša.

## Drugače: Kot zgodba

Ana in Bor ugibata, koliko listkov je v bobnu tombole. Vsak večer izvlečejo štiri, vsak večer bobna ne poznata. Ana vedno reče največjo številko, ki jo vidi. Bor vzame največjo, ji prišteje njeno četrtino in odšteje ena.

Po mesecu pogledata zapisnik. Anine ocene niso bile nikoli previsoke, skoraj vedno pa prenizke. Borove so bile včasih previsoke, včasih prenizke, v povprečju pa so se ujele s pravim številom. Ana je ravnala po verjetju: njena številka je bila vsak večer tista, pri kateri je bil izvlečeni izid najbolj verjeten. Bor je ravnal nepristransko. Nobeden ni zadel vsak večer. Razlika je bila v tem, ali je napaka imela smer.

## Drugače: Korak za korakom s številkami

Vzemimo majhen boben: $N = 5$ listkov, izvlečemo $k = 2$. Možnih parov je $\binom{5}{2} = 10$, vsi enako verjetni.

| največja $M$ | št. parov | $\hat N = 1{,}5M - 1$ |
|---|---|---|
| $2$ | $1$ | $2$ |
| $3$ | $2$ | $3{,}5$ |
| $4$ | $3$ | $5$ |
| $5$ | $4$ | $6{,}5$ |

1. $E(M) = \dfrac{2 \cdot 1 + 3 \cdot 2 + 4 \cdot 3 + 5 \cdot 4}{10} = 4$, manj kot $N = 5$.
2. Preveri s formulo: $\dfrac{k(N+1)}{k+1} = \dfrac{2 \cdot 6}{3} = 4$.
3. Popravljena: $E(\hat N) = \dfrac{2 \cdot 1 + 3{,}5 \cdot 2 + 5 \cdot 3 + 6{,}5 \cdot 4}{10} = 5$. Natanko $N$.

## Drugače: Bolj natančno

Identiteta iz dokaza izreka o $s^2$: zapišemo $X_i - \bar X = (X_i - \mu) - (\bar X - \mu)$ in kvadriramo. Ker je $\sum (X_i - \mu) = n(\bar X - \mu)$, je vsota mešanih členov $-2n(\bar X - \mu)^2$, vsota zadnjih pa $n(\bar X - \mu)^2$:

$$\sum (X_i - \bar X)^2 = \sum (X_i - \mu)^2 - n(\bar X - \mu)^2.$$

Isti razcep za poljuben $c$ namesto $\mu$ pove, da je $\sum (x_i - c)^2$ najmanjša pri $c = \bar x$. Zato je vsota kvadratov odmikov od $\bar X$ manjša kot od $\mu$ in delitev z $n$ podceni. Število $n - 1$ je število prostostnih stopenj: odmiki $X_i - \bar X$ se seštejejo v $0$, zato je prostih le $n - 1$.

Za tombolo: $P(M \le j) = \binom{j}{k}/\binom{N}{k}$, torej $P(M = j) = \binom{j-1}{k-1}/\binom{N}{k}$. Z identiteto $\sum_{j=k}^{N} j\binom{j-1}{k-1} = k\binom{N+1}{k+1}$ dobimo $E(M) = \frac{k(N+1)}{k+1}$.

## Preveri se

? Tri od spodnjih trditev opisujejo nepristransko cenilko $\hat{\theta}$. Katera ne sodi zraven?
- Njena pričakovana vrednost je $\theta$ za vsako vrednost $\theta$.
~ To je sama definicija nepristranskosti, zato sodi zraven.
- Njena pristranskost $E(\hat{\theta}) - \theta$ je enaka $0$.
~ To je ista definicija, zapisana z razliko; sodi zraven.
+ Pri vsakem vzorcu da natanko vrednost $\theta$.
- Pri mnogo ponovitvah se njene ocene v povprečju ujamejo s $\theta$.
~ To je pomen pričakovane vrednosti z besedami; sodi zraven.
> Nepristranskost govori o povprečju čez vzorce. Posamezna ocena se od $\theta$ skoraj vedno razlikuje.

? Strelec na tekmi zadene $18$ od $24$ strelov. Kolikšna je MLE za verjetnost zadetka $p$?
- $0{,}25$
~ To je delež zgrešenih strelov, $6/24$. Verjetje za $p$ ima $p^{18}$, zato šteje zadetke.
+ $0{,}75$
- $1{,}33$
~ To je $24/18$, obrnjen ulomek; verjetnost ne more biti večja od $1$.
- $0{,}5$
~ $0{,}5$ je »pošten« kovanec, a podatkov ne upošteva. MLE izbere $p$, pri katerem so podatki najbolj verjetni.
> $\hat p = k/n = 18/24 = 0{,}75$.

? Kaj se zgodi s pristranskostjo cenilke $\hat{\sigma}^2 = \frac1n\sum(X_i - \bar X)^2$, ko velikost vzorca $n$ raste?
- Raste, ker seštejemo več kvadratov.
~ Več kvadratov delimo tudi z večjim $n$; pristranskost je $-\sigma^2/n$.
- Ostane enaka, ker je cenilka pristranska ne glede na $n$.
~ Res je pristranska za vsak končen $n$, a velikost pristranskosti se manjša.
+ Gre proti $0$: cenilka je asimptotično nepristranska.
> $E(\hat{\sigma}^2) - \sigma^2 = -\sigma^2/n \to 0$, ko $n \to \infty$.

? Izpeljava MLE za Poissonov $\lambda$ iz $n$ podatkov. Korak 1: $L(\lambda) = \prod e^{-\lambda}\lambda^{x_i}/x_i!$. Korak 2: $\ell(\lambda) = -\lambda + (\sum x_i)\ln\lambda - \sum\ln(x_i!)$. Korak 3: $\ell'(\lambda) = -1 + \sum x_i/\lambda$. Korak 4: $\hat\lambda = \sum x_i$. V katerem koraku je nastala napaka?
- Korak 1
~ Korak 1 je pravilen: neodvisni podatki, zato se verjetnosti zmnožijo.
+ Korak 2
- Korak 3
~ Korak 3 je pravilen odvod koraka 2; napaka je prišla prej.
- Korak 4
~ Korak 4 sledi iz koraka 3. Napačen je, a le posledica prejšnje napake.
> V koraku 2 manjka $n$: $\prod e^{-\lambda} = e^{-n\lambda}$, zato $\ell = -n\lambda + \dots$ in $\hat\lambda = \bar x$.

? V obratu pol leta ni bilo nobene nezgode. Za mesečno število nezgod velja Poissonov model. Kaj je pravilno?
- Tveganje je nič, ker je $\hat\lambda = 0$ nepristranska ocena.
~ Nepristranska ne pomeni točna. Ocena $0$ je ena vrednost slučajne spremenljivke.
+ $\hat\lambda = 0$ je MLE in nepristranska ocena, a pravi $\lambda$ je lahko večji od $0$.
- MLE ne obstaja, ker odvod $\ell'(\lambda)$ nima ničle.
~ Maksimum je na robu, pri $\lambda = 0$. Ničla odvoda ni nujna.
> Pri $\sum x_i = 0$ je $L(\lambda) = e^{-6\lambda}$, največja pri $\lambda = 0$. Majhen $\lambda$ hitro da pol leta brez nezgod, zato ocena ne dokazuje, da tveganja ni.

:::simboli
\theta | neznani parameter porazdelitve | | |
\hat{\theta} | cenilka parametra θ | | | funkcija vzorca, zato slučajna spremenljivka
b | pristranskost cenilke | b(\hat{\theta}) = E(\hat{\theta}) - \theta | | nepristranska, če je b = 0
E | pričakovana vrednost | | |
D | disperzija (varianca) | | |
M | največja izvlečena številka (slučajna spremenljivka) | | |
k | število izvlečenih listkov | | | pri binomskem zgledu število zadetkov
N | število vseh listkov (neznani parameter) | | |
\hat N | nepristranska cenilka za N | \hat N = m \cdot \dfrac{k+1}{k} - 1 | |
m | izmerjena največja številka | | | N ≥ m
L | funkcija verjetja | L(\theta) = \prod_{i=1}^{n} f(x_i;\theta) | | cenilka največjega verjetja je θ̂, pri kateri je L največja
i | indeks podatka | | |
n | velikost vzorca | | |
f | gostota ali verjetnostna funkcija | | |
x_i | izmerjeni podatki | | |
X_i | podatki kot slučajne spremenljivke | | | neodvisne, E(Xᵢ) = μ, D(Xᵢ) = σ²
\bar X | vzorčno povprečje (slučajna spremenljivka) | \bar X = \frac{1}{n}\sum X_i | | nepristranska cenilka za μ
\bar x | povprečje izmerjenih podatkov | \bar x = \frac{1}{n}\sum x_i | |
\sigma | standardni odklon porazdelitve | | |
\hat{\sigma} | cenilka standardnega odklona po metodi največjega verjetja | \hat{\sigma}^2 = \frac1n \sum_{i=1}^{n} (X_i - \bar X)^2 | | σ̂² je pristranska: E(σ̂²) = (n − 1)σ²/n
s | vzorčni standardni odklon | s^2 = \frac{1}{n-1}\sum_{i=1}^{n}(X_i - \bar X)^2 | | s² je nepristranska cenilka za σ²
\mu | pričakovana vrednost porazdelitve | | |
p | delež zadetkov (verjetnost uspeha) | | |
\lambda | parameter Poissonove porazdelitve | | | povprečno število dogodkov
:::
