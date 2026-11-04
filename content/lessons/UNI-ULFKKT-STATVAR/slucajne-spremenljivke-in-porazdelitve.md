---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na petdnevnem terenskem delu moraš vsaj en deževen dan preizkusiti nov merilnik padavin. Napoved pravi, da je verjetnost dežja vsak dan naslednjega tedna $0{,}2$, dnevi pa so med seboj neodvisni. Kako zanesljivo ti bo uspelo: gotovo, z verjetnostjo okoli dve tretjini ali komaj vsak drugi teden? Preden bereš naprej, oceni sam.

Mamljiv račun $5 \cdot 0{,}2 = 1$ bi obljubljal gotovost, a je napačen. Verjetnost, da je dan suh, je $0{,}8$, da je suhih vseh pet, pa $0{,}8^5 \approx 0{,}328$. Vsaj en deževen dan bo torej z verjetnostjo $1 - 0{,}328 = 0{,}672$, ne z gotovostjo.

Iz klasične verjetnosti že znaš izračunati verjetnost enega dogodka. Pri vremenu, nesrečah ali okvarah pa nas zanima *število*: koliko deževnih dni, koliko udarov strele, koliko minut do naslednjega sunka vetra. Za taka vprašanja potrebujemo slučajne spremenljivke in nekaj tipičnih porazdelitev, ki se v naravi ponavljajo.

## Razlaga

**Od dogodka do števila.** V klasični verjetnosti vprašaš »Ali bo v ponedeljek deževalo?« in dobiš eno verjetnost. Zdaj vprašaš »Koliko dni v tednu bo deževalo?«. Odgovor je število, ki ga ne poznamo vnaprej. Takemu številu, ki je odvisno od izida poskusa, rečemo **slučajna spremenljivka** in jo označimo z veliko črko, npr. $X$.

**Definicija.** Naj bo $\Omega$ množica izidov poskusa z verjetnostjo $P$. **Slučajna spremenljivka** je funkcija $X\colon \Omega \to \mathbb{R}$, pri kateri je $\{X \le x\} = \{\omega \in \Omega : X(\omega) \le x\}$ dogodek za vsak $x \in \mathbb{R}$. Njena **porazdelitvena funkcija** je $F(x) = P(X \le x)$. Funkcija $F$ je nepadajoča, zvezna z desne, $\lim_{x \to -\infty} F(x) = 0$ in $\lim_{x \to \infty} F(x) = 1$. Za $a < b$ je $\{X \le b\}$ disjunktna unija dogodkov $\{X \le a\}$ in $\{a < X \le b\}$, zato $P(a < X \le b) = F(b) - F(a)$.

**Porazdelitev** pove, katere vrednosti $X$ zavzame in s kolikšnimi verjetnostmi. Vsota vseh teh verjetnosti je $1$.

**Diskretna proti zvezni.** Število deževnih dni zavzame le vrednosti $0, 1, 2, \ldots$ To je **diskretna** spremenljivka: vsaki vrednosti pripada verjetnost $P(X = k)$. Čas do naslednjega udara strele pa je lahko $3{,}2$ ali $3{,}21$ minute, torej katero koli realno število. To je **zvezna** spremenljivka. Pri njej $P(X = a) = 0$ za vsak posamezen $a$; smiselno je le vprašanje, ali $X$ pade na *interval*. Opišemo jo z **gostoto** $f(x)$: verjetnost intervala je ploščina pod grafom gostote nad tem intervalom.

Natančno: $X$ je **diskretna**, če zavzame le končno ali števno mnogo vrednosti $x_1, x_2, \ldots$; tedaj je $p_i = P(X = x_i) \ge 0$ in $\sum_i p_i = 1$. $X$ je **zvezna**, če obstaja funkcija $f \ge 0$ z $\int_{-\infty}^{\infty} f(x)\,dx = 1$, da je $F(x) = \int_{-\infty}^{x} f(t)\,dt$ za vsak $x$. Tedaj je $P(a < X \le b) = \int_a^b f(x)\,dx$, v vsaki točki, kjer je $f$ zvezna, pa velja $F'(x) = f(x)$.

**Trditev.** Če je $X$ zvezna, potem je $P(X = a) = 0$ za vsak $a \in \mathbb{R}$.

*Dokaz.* Za vsak $h > 0$ je $\{X = a\} \subseteq \{a - h < X \le a\}$, zato $0 \le P(X = a) \le F(a) - F(a - h)$. Funkcija $F$ je kot integral zvezna, zato gre desna stran proti $0$, ko gre $h \to 0$. $\square$

Posledica: pri zvezni spremenljivki je vseeno, ali pišemo $<$ ali $\le$.

| | diskretna | zvezna |
|---|---|---|
| vrednosti | $0, 1, 2, \ldots$ | interval realnih števil |
| opis | $P(X = k)$ | gostota $f(x)$ |
| verjetnost | vsota | ploščina pod $f$ |

:::premisli
Termometer, ki kaže na celo stopinjo, pokaže $28\,^\circ\mathrm{C}$. Kako je to mogoče, če je pri zvezni temperaturi $P(X = 28) = 0$? Katero verjetnost ta odčitek v resnici opisuje?
---
Pas nad eno samo točko je širok $0$, zato je ploščina pod gostoto nad njim $0$. Pozitivno verjetnost dobi le interval: odčitek »28« pomeni $27{,}5 \le X \le 28{,}5$.
:::

**Binomska porazdelitev: štejemo uspehe v $n$ poskusih.** Naj bo $n \in \mathbb{N}$ in $0 \le p \le 1$. Imamo $n$ neodvisnih ponovitev poskusa z dvema izidoma (**Bernoullijevo zaporedje**), vsaka »uspe« z isto verjetnostjo $p$ (npr. dan je nevihten). $X$ je število uspehov. En določen vrstni red s $k$ uspehi ima verjetnost $p^k(1-p)^{n-k}$, takih vrstnih redov pa je $\binom{n}{k}$. Zato
$$P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}, \quad k = 0, \ldots, n.$$
Pišemo $X \sim \mathrm{Bin}(n, p)$. Največja možna vrednost je $n$. Da je to res porazdelitev, pokaže binomski izrek: $\sum_{k=0}^{n} \binom{n}{k} p^k (1-p)^{n-k} = \big(p + (1-p)\big)^n = 1$.

**Poissonova porazdelitev: štejemo dogodke v času.** Udarov strele v eni uri nevihte ne moremo razdeliti na »poskuse«. Poznamo le povprečno število v intervalu, $\lambda$. V primerjavi z binomsko ni zgornje meje in ni števila poskusov. Poissonova je meja binomske, ko je poskusov zelo veliko, vsak pa ima zelo majhno verjetnost:
$$P(X = k) = \frac{\lambda^k}{k!}\, e^{-\lambda}, \quad k = 0, 1, 2, \ldots$$
Parameter mora biti $\lambda > 0$; pišemo $X \sim \mathrm{Po}(\lambda)$. Vsota je $1$ zaradi Taylorjeve vrste eksponentne funkcije: $\sum_{k=0}^{\infty} \frac{\lambda^k}{k!} e^{-\lambda} = e^{\lambda} e^{-\lambda} = 1$.

**Izrek (Poissonov).** Naj bo $X_n \sim \mathrm{Bin}(n, p_n)$ in naj gre $n p_n \to \lambda > 0$, ko $n \to \infty$. Potem za vsak fiksen $k = 0, 1, 2, \ldots$ velja $P(X_n = k) \to \frac{\lambda^k}{k!} e^{-\lambda}$. Dokaz je v razdelku »Bolj natančno«. V praksi binomsko nadomestimo s Poissonovo z $\lambda = np$, ko je $n$ velik in $p$ majhen (pogosto navajajo $n \ge 50$ in $p \le 0{,}1$).

**Enakomerna porazdelitev: nobena točka ni prednostna.** Če vemo le, da se bo ploha začela nekje med 14.00 in 15.00, in noben trenutek ni verjetnejši, je čas začetka enakomerno porazdeljen na $[a, b]$. Natančno: naj bo $a < b$; $X \sim U[a, b]$, če ima gostoto $f(x) = \frac{1}{b-a}$ za $a \le x \le b$ in $f(x) = 0$ sicer. Za $a \le c \le d \le b$ je zato $P(c \le X \le d) = \frac{d - c}{b - a}$, verjetnost je kar delež dolžine: verjetnost začetka med 14.40 in 14.55 je $\frac{15}{60} = 0{,}25$.

**Eksponentna porazdelitev: čakamo na naslednji dogodek.** Poissonova šteje, *koliko* udarov bo; eksponentna meri, *kdaj* bo naslednji. Če udari prihajajo s povprečjem $\lambda$ na časovno enoto, je čas čakanja $T$ eksponentno porazdeljen:
$$f(t) = \lambda e^{-\lambda t}, \qquad P(T > t) = e^{-\lambda t}, \quad t \ge 0.$$
Natančno: naj bo $\lambda > 0$; $T \sim \mathrm{Exp}(\lambda)$, če ima gostoto $f(t) = \lambda e^{-\lambda t}$ za $t \ge 0$ in $f(t) = 0$ za $t < 0$. Z integracijo dobimo $F(t) = \int_0^t \lambda e^{-\lambda s}\,ds = \big[-e^{-\lambda s}\big]_0^t = 1 - e^{-\lambda t}$, zato $P(T > t) = e^{-\lambda t}$. Ista formula sledi iz Poissonove: število udarov $X$ v času $t$ ima povprečje $\lambda t$, »čakamo dlje od $t$« pa pomeni »v času $t$ ni bilo nobenega udara«, $P(X = 0) = e^{-\lambda t}$.

:::premisli
Strele že $20$ minut ni bilo. Ali je zdaj verjetnost, da udari v naslednji minuti, večja kot na začetku?
---
Ne. Udari so neodvisni, zato preteklo čakanje nič ne »nabira«. Eksponentna porazdelitev je **brez spomina**: $P(T > s + t \mid T > s) = P(T > t)$.
:::

**Izrek (odsotnost spomina).** Če je $T \sim \mathrm{Exp}(\lambda)$, potem za vse $s, t \ge 0$ velja $P(T > s + t \mid T > s) = P(T > t)$.

*Dokaz.* Ker je $\{T > s + t\} \subseteq \{T > s\}$, je $P(T > s + t \mid T > s) = \frac{P(T > s + t)}{P(T > s)} = \frac{e^{-\lambda(s+t)}}{e^{-\lambda s}} = e^{-\lambda t} = P(T > t)$. $\square$

Med zveznimi porazdelitvami na $[0, \infty)$ je eksponentna edina s to lastnostjo.

**Normalna porazdelitev: vsota mnogih majhnih vplivov.** Najvišja dnevna temperatura v juliju je posledica sonca, vetra, vlage in še mnogo drugega. Take količine so pogosto približno normalno porazdeljene: gostota je zvonasta, simetrična okoli središča $\mu$, širino pa določa $\sigma$. Natančno: naj bo $\mu \in \mathbb{R}$ in $\sigma > 0$; $X \sim N(\mu, \sigma)$, če ima za vse $x \in \mathbb{R}$ gostoto
$$f(x) = \frac{1}{\sigma\sqrt{2\pi}}\, e^{-\frac{(x-\mu)^2}{2\sigma^2}}.$$
$N(0, 1)$ je **standardna normalna** porazdelitev, njena porazdelitvena funkcija $\Phi(z)$ je v tabeli.

**Izrek (standardizacija).** Če je $X \sim N(\mu, \sigma)$, potem je $Z = \frac{X - \mu}{\sigma} \sim N(0, 1)$, zato $P(X \le x) = \Phi\big(\frac{x - \mu}{\sigma}\big)$.

*Dokaz.* $P(Z \le z) = P(X \le \mu + \sigma z) = \int_{-\infty}^{\mu + \sigma z} \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}\,dx$. Z uvedbo nove spremenljivke $u = \frac{x - \mu}{\sigma}$, $dx = \sigma\,du$, meja $\mu + \sigma z$ preide v $z$ in integral v $\int_{-\infty}^{z} \frac{1}{\sqrt{2\pi}} e^{-u^2/2}\,du = \Phi(z)$. $\square$

Ker je standardna gostota soda, velja $\Phi(-z) = 1 - \Phi(z)$. Verjetnosti torej beremo iz tabele, potem ko vrednost **standardiziramo**: $z = \frac{x - \mu}{\sigma}$. Za grobo oceno: znotraj $\mu \pm \sigma$ leži približno $68\,\%$, znotraj $\mu \pm 2\sigma$ približno $95\,\%$ in znotraj $\mu \pm 3\sigma$ približno $99{,}7\,\%$ vrednosti.

## Rešeni primeri

### Primer 1: nevihtni dnevi

Verjetnost, da je julijski dan nevihten, je $0{,}3$, dnevi so neodvisni. Kolikšna je verjetnost, da sta v tednu natanko dva nevihtna dneva?

**Podatki:** $n = 7$ dni, $p = 0{,}3$, $k = 2$
**Iščemo:** $P(X = 2)$ za $X \sim \mathrm{Bin}(7; 0{,}3)$

:::formula
$P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}$
:::

**Rešitev:**

1. Fiksno število neodvisnih dni z isto verjetnostjo, zato binomska.
2. Izbira dveh dni izmed sedmih: $\binom{7}{2} = 21$.
3. Verjetnost enega vrstnega reda: $0{,}3^2 \cdot 0{,}7^5 = 0{,}09 \cdot 0{,}16807 \approx 0{,}01513$.
4. $P(X = 2) = 21 \cdot 0{,}01513 \approx 0{,}318$.
5. Odgovor: natanko dva nevihtna dneva bosta z verjetnostjo približno $0{,}32$.

### Primer 2: potresi na območju

Na nekem območju v povprečju zabeležijo $2$ močnejša potresa na leto, potresi so med seboj neodvisni. Kolikšna je verjetnost, da bosta v naslednjem letu vsaj dva?

**Podatki:** $\lambda = 2$ na leto, interval $1$ leto
**Iščemo:** $P(X \ge 2)$

:::formula
$P(X = k) = \dfrac{\lambda^k}{k!} e^{-\lambda}$, $\quad P(X \ge 2) = 1 - P(X = 0) - P(X = 1)$
:::

**Rešitev:**

1. Štejemo dogodke v času brez zgornje meje, zato Poissonova.
2. $P(X = 0) = e^{-2} \approx 0{,}1353$.
3. $P(X = 1) = 2 e^{-2} \approx 0{,}2707$.
4. Komplement, ker je »vsaj dva« neskončno mnogo vrednosti: $P(X \ge 2) \approx 1 - 0{,}1353 - 0{,}2707 = 0{,}594$.
5. Odgovor: vsaj dva potresa bosta z verjetnostjo približno $0{,}59$.

### Primer 3: čakanje na strelo

Med nevihto strele v okolici merilne postaje udarijo v povprečju $6$-krat na uro, neodvisno. (a) Kolikšna je verjetnost, da na naslednji udar čakamo več kot $15$ minut? (b) Kako dolgo mora meritev trajati, da bo vsaj en udar zabeležen z verjetnostjo $0{,}9$? (c) Meritev traja $30$ minut in v prvih $20$ minutah ni bilo nobenega udara. Kolikšna je verjetnost, da v preostalih $10$ minutah zabeležimo vsaj dva udara?

**Podatki:** $\lambda = 6\,\mathrm{h^{-1}}$, $t_a = 15\,\mathrm{min}$, iskana verjetnost $0{,}9$, $t_c = 10\,\mathrm{min}$ po $20$ minutah brez udara
**Iščemo:** $P(T > 15\,\mathrm{min})$, čas $t$, pri katerem je $P(T \le t) = 0{,}9$, in $P(X \ge 2)$ v zadnjih $10$ minutah

:::formula
$P(T > t) = e^{-\lambda t}$, $\quad P(T \le t) = 1 - e^{-\lambda t}$, $\quad P(X = k) = \dfrac{(\lambda t)^k}{k!} e^{-\lambda t}$
:::

**Rešitev:**

1. Enote izenačimo: $\lambda = \frac{6}{60\,\mathrm{min}} = 0{,}1\,\mathrm{min^{-1}}$.
2. (a) $\lambda t = 0{,}1 \cdot 15 = 1{,}5$, zato $P(T > 15) = e^{-1{,}5} \approx 0{,}223$.
3. (b) Zahtevamo $1 - e^{-0{,}1 t} = 0{,}9$, torej $e^{-0{,}1 t} = 0{,}1$.
4. Logaritmiramo: $0{,}1\, t = \ln 10 \approx 2{,}303$, zato $t \approx 23{,}0\,\mathrm{min}$.
5. (c) Udari so neodvisni in eksponentna porazdelitev je brez spomina, zato $20$ mirnih minut na nadaljevanje ne vpliva. Število udarov $X$ v $10$ minutah je Poissonovo s parametrom $\lambda t = 0{,}1 \cdot 10 = 1$.
6. $P(X = 0) = e^{-1} \approx 0{,}3679$ in $P(X = 1) = 1 \cdot e^{-1} \approx 0{,}3679$.
7. Komplement: $P(X \ge 2) = 1 - 2e^{-1} \approx 0{,}264$.
8. Odgovor: več kot $15$ minut čakamo z verjetnostjo približno $0{,}22$; meritev mora trajati vsaj približno $23$ minut; vsaj dva udara v zadnjih $10$ minutah zabeležimo z verjetnostjo približno $0{,}26$, ne glede na mirnih $20$ minut pred tem.

### Primer 4: zdaj ti

Najvišja julijska dnevna temperatura v nekem kraju je približno normalno porazdeljena s središčem $28\,^\circ\mathrm{C}$ in $\sigma = 3\,^\circ\mathrm{C}$. Kolikšna je verjetnost, da izbrani julijski dan preseže $34\,^\circ\mathrm{C}$? Iz tabele: $\Phi(2) = 0{,}9772$.

**Podatki:** $\mu = 28\,^\circ\mathrm{C}$, $\sigma = 3\,^\circ\mathrm{C}$, meja $x = 34\,^\circ\mathrm{C}$, $\Phi(2) = 0{,}9772$
**Iščemo:** $P(X > 34)$

:::formula
$z = \dfrac{x - \mu}{\sigma}$, $\quad P(X > x) = 1 - \Phi(z)$
:::

**Rešitev:**

1. Standardiziramo: $z = \frac{34 - 28}{3} = 2$.
2. Tabela da verjetnost *pod* mejo, nas zanima verjetnost *nad* njo.
3. Izračunaj sam, nato preveri:

:::premisli
Koliko je $1 - \Phi(2)$ in kaj pove?
---
$1 - 0{,}9772 = 0{,}0228$. Približno $2{,}3\,\%$ julijskih dni, torej v povprečju manj kot en dan na mesec, preseže $34\,^\circ\mathrm{C}$.
:::

## Pogoste napake

- **Seštevanje verjetnosti neodvisnih dni.** »Pet dni po $0{,}2$ je $1$« bi pomenilo, da se dogodki ne morejo zgoditi skupaj. Seštevamo le nezdružljive dogodke. Za »vsaj enkrat« vzemi komplement: $1 - (1-p)^n$.
- **Brez binomskega koeficienta.** Kdor za dva nevihtna dneva v tednu izračuna le $0{,}3^2 \cdot 0{,}7^5$, upošteva en sam vrstni red (npr. ponedeljek in torek). Dni lahko izberemo na $\binom{7}{2} = 21$ načinov.
- **Gostota ni verjetnost.** $f(28)$ ni $P(X = 28)$; ta je pri zvezni spremenljivki $0$. Gostota je lahko celo večja od $1$. Verjetnost je šele ploščina pod $f$ nad intervalom.
- **»Strela je že na vrsti.«** Dolgo čakanje ne poveča verjetnosti udara v naslednji minuti; eksponentna porazdelitev je brez spomina.
- **Mešanje enot ali $\sigma$.** Pri $\lambda$ na uro in $t$ v minutah najprej izenači enote. Pri normalni delimo s $\sigma$, ne s $\sigma^2$.

## Povzetek

- Slučajna spremenljivka je število, ki ga določi izid poskusa; porazdelitev pove, s kolikšnimi verjetnostmi zavzame vrednosti.
- Diskretna: $P(X = k)$, verjetnosti seštevamo. Zvezna: gostota $f$, verjetnost je ploščina pod njo; $P(X = a) = 0$.
- Binomska $\mathrm{Bin}(n, p)$: število uspehov v $n$ neodvisnih poskusih, $P(X=k) = \binom{n}{k}p^k(1-p)^{n-k}$.
- Poissonova s parametrom $\lambda$: število dogodkov v intervalu, $P(X=k) = \frac{\lambda^k}{k!}e^{-\lambda}$.
- Enakomerna na $[a,b]$: $f = \frac{1}{b-a}$, verjetnost je delež dolžine.
- Eksponentna: čas do naslednjega dogodka, $P(T > t) = e^{-\lambda t}$, brez spomina.
- Normalna $N(\mu, \sigma)$: zvonasta krivulja; standardiziraj $z = \frac{x-\mu}{\sigma}$ in beri $\Phi(z)$.

## Za izpit

Znati moraš povedati:

- definicijo slučajne spremenljivke in porazdelitvene funkcije $F$ z lastnostmi ter $P(a < X \le b) = F(b) - F(a)$;
- definicijo diskretne in zvezne spremenljivke ter dokaz, da je pri zvezni $P(X = a) = 0$;
- binomsko, Poissonovo, enakomerno, eksponentno in normalno porazdelitev s pogoji za parametre, pri binomski, Poissonovi in eksponentni pa še dokaz, da je skupna verjetnost $1$;
- Poissonov izrek s pogoji in dokazom (binomska gre proti Poissonovi);
- izpeljavo $P(T > t) = e^{-\lambda t}$ in dokaz, da je eksponentna porazdelitev brez spomina;
- izrek o standardizaciji z dokazom in zvezo $\Phi(-z) = 1 - \Phi(z)$.

### Naloga 1

Najvišja dnevna temperatura v proizvodni hali poleti je normalno porazdeljena z neznanima $\mu$ in $\sigma$. Iz dolgoletnih meritev vemo, da je $10\,\%$ dni nad $32\,^\circ\mathrm{C}$ in $5\,\%$ dni pod $20\,^\circ\mathrm{C}$. (a) Določi $\mu$ in $\sigma$. (b) Po notranjem pravilniku se ob dnevu nad $32\,^\circ\mathrm{C}$ skrajša delovni čas. Kolikšna je verjetnost, da bo v delovnem tednu s $5$ neodvisnimi dnevi delovni čas skrajšan vsaj dvakrat? Iz tabele: $\Phi(1{,}2816) = 0{,}90$, $\Phi(1{,}6449) = 0{,}95$.

**Rešitev:**

1. $P(X > 32) = 0{,}10$, zato $\Phi\big(\frac{32 - \mu}{\sigma}\big) = 0{,}90$ in $\frac{32 - \mu}{\sigma} = 1{,}2816$.
2. $P(X < 20) = 0{,}05$, zato $\Phi\big(\frac{20 - \mu}{\sigma}\big) = 0{,}05$. Ker je $\Phi(-1{,}6449) = 1 - 0{,}95 = 0{,}05$, je $\frac{20 - \mu}{\sigma} = -1{,}6449$.
3. Enačbi odštejemo: $32 - 20 = (1{,}2816 + 1{,}6449)\,\sigma$, zato $\sigma = 12/2{,}9265 \approx 4{,}10\,^\circ\mathrm{C}$.
4. $\mu = 32 - 1{,}2816 \cdot 4{,}100 \approx 26{,}7\,^\circ\mathrm{C}$.
5. (b) Število dni s skrajšanim delovnim časom $Y$ šteje uspehe v $5$ neodvisnih poskusih z isto verjetnostjo $0{,}10$, zato $Y \sim \mathrm{Bin}(5; 0{,}1)$.
6. $P(Y = 0) = 0{,}9^5 = 0{,}59049$, $P(Y = 1) = 5 \cdot 0{,}1 \cdot 0{,}9^4 = 0{,}32805$.
7. Komplement: $P(Y \ge 2) = 1 - 0{,}59049 - 0{,}32805 = 0{,}08146$.
8. Odgovor: $\mu \approx 26{,}7\,^\circ\mathrm{C}$, $\sigma \approx 4{,}1\,^\circ\mathrm{C}$; delovni čas bo vsaj dvakrat v tednu skrajšan z verjetnostjo približno $0{,}081$.

### Naloga 2

Natančno definiraj zvezno slučajno spremenljivko in eksponentno porazdelitev s parametrom $\lambda$. Dokaži, da je njena gostota res gostota, izpelji $P(T > t)$ in dokaži, da je eksponentna porazdelitev brez spomina. Utemelji, ali je brez spomina tudi enakomerna porazdelitev na $[0, 10]$.

**Rešitev:**

1. $X$ je zvezna, če obstaja $f \ge 0$ z $\int_{-\infty}^{\infty} f = 1$, da je $F(x) = P(X \le x) = \int_{-\infty}^{x} f(t)\,dt$ za vsak $x$.
2. Naj bo $\lambda > 0$. $T \sim \mathrm{Exp}(\lambda)$ ima gostoto $f(t) = \lambda e^{-\lambda t}$ za $t \ge 0$ in $f(t) = 0$ za $t < 0$.
3. Očitno je $f \ge 0$ in $\int_0^{\infty} \lambda e^{-\lambda t}\,dt = \big[-e^{-\lambda t}\big]_0^{\infty} = 0 - (-1) = 1$.
4. Za $t \ge 0$: $P(T > t) = \int_t^{\infty} \lambda e^{-\lambda s}\,ds = \big[-e^{-\lambda s}\big]_t^{\infty} = e^{-\lambda t}$.
5. Za $s, t \ge 0$ je $\{T > s + t\} \subseteq \{T > s\}$, zato $P(T > s + t \mid T > s) = \frac{e^{-\lambda(s+t)}}{e^{-\lambda s}} = e^{-\lambda t} = P(T > t)$.
6. Enakomerna na $[0, 10]$: $P(T > t) = \frac{10 - t}{10}$ za $0 \le t \le 10$. Protiprimer s $s = 5$, $t = 2$: $P(T > 7 \mid T > 5) = \frac{P(T > 7)}{P(T > 5)} = \frac{0{,}3}{0{,}5} = 0{,}6$, a $P(T > 2) = 0{,}8$.
7. Odgovor: eksponentna porazdelitev je brez spomina, enakomerna ni; pri njej dosedanje čakanje poveča verjetnost skorajšnjega dogodka, ker je čas omejen z $10$.

## Drugače: Na sliki

Nariši stolpčni diagram za $\mathrm{Bin}(7; 0{,}3)$:

| $k$ | $P(X = k)$ | stolpec |
|---|---|---|
| 0 | 0,082 | ▇▇ |
| 1 | 0,247 | ▇▇▇▇▇▇ |
| 2 | 0,318 | ▇▇▇▇▇▇▇▇ |
| 3 | 0,227 | ▇▇▇▇▇▇ |
| 4 | 0,097 | ▇▇ |
| 5–7 | 0,029 | ▇ |

Višine stolpcev se seštejejo v $1$. Pri zvezni porazdelitvi si predstavljaj, da stolpce zožiš in jih je neskončno: dobiš gladko krivuljo, gostoto. Eksponentna gostota pada od največje vrednosti pri $t = 0$ kot smučarska skakalnica; normalna je zvon s vrhom pri $\mu$; enakomerna je vodoraven pravokotnik nad $[a, b]$ z višino $\frac{1}{b-a}$, da je njegova ploščina $1$.

## Drugače: Uporaba v stroki

V varnostnem inženirstvu se vseh pet porazdelitev pojavlja vsak dan.

- **Zanesljivost opreme.** Detektor plina s stalno intenziteto odpovedi $\lambda = 2 \cdot 10^{-5}\,\mathrm{h^{-1}}$ ima eksponentno porazdeljen čas do odpovedi. Srednji čas do odpovedi je $1/\lambda = 50\,000\,\mathrm{h}$, vse leto ($8760\,\mathrm{h}$) pa brez odpovedi deluje z verjetnostjo $e^{-0{,}1752} \approx 0{,}84$. Stalna $\lambda$ velja le v srednjem delu »krivulje kopalne kadi«; pri obrabi model ni več brez spomina.
- **Statistika nezgod pri delu.** Število nezgod v obratu na leto pogosto modeliramo s Poissonovo. Pri povprečju $3$ na leto je $P(X \ge 7) \approx 0{,}034$, zato leto s sedmimi nezgodami ni le »smola«, ampak razlog za preiskavo.
- **Prevzemna kontrola.** Iz serije gasilnih aparatov ali varovalnih pasov vzamemo vzorec $n$ kosov in serijo zavrnemo, če je okvarjenih več kot $c$. Verjetnost sprejema serije je pri veliki seriji binomska vsota $\sum_{k=0}^{c} \binom{n}{k} p^k (1-p)^{n-k}$, kjer je $p$ delež okvarjenih.
- **Izpostavljenost snovem.** Koncentracije snovi v zraku na delovnem mestu so pogosto lognormalne (njihov logaritem je normalen); delež izmen nad mejno vrednostjo ocenimo s standardizacijo logaritma.
- **Enakomerna** opiše trenutek naključnega pregleda ali vzorčenja v izmeni.

Ko ne veš, katero porazdelitev uporabiti, najprej odgovori: ali štejem ali merim? Če štejem, ali imam fiksno število poskusov?

## Drugače: Bolj natančno

*Dokaz Poissonovega izreka.* Naj bo $\lambda_n = n p_n$, torej $\lambda_n \to \lambda$ in $p_n = \lambda_n / n \to 0$; za dovolj velike $n$ je $0 < p_n < 1$. Za fiksen $k$ in $n \ge k$ je
$$\binom{n}{k} p_n^k (1 - p_n)^{n-k} = \frac{\lambda_n^k}{k!} \cdot \frac{n(n-1)\cdots(n-k+1)}{n^k} \cdot (1 - p_n)^{n} \cdot (1 - p_n)^{-k}.$$
Ko gre $n \to \infty$, gre $\lambda_n^k \to \lambda^k$. Srednji ulomek je produkt $k$ faktorjev $1 - \frac{j}{n}$, $j = 0, \ldots, k-1$, ki gredo vsi proti $1$. Tudi $(1 - p_n)^{-k} \to 1$. Zadnji faktor zapišemo kot $(1 - p_n)^n = e^{n \ln(1 - p_n)} = e^{\lambda_n \ln(1 - p_n)/p_n}$; ker je $\lim_{u \to 0} \frac{\ln(1 - u)}{u} = -1$, gre proti $e^{-\lambda}$. Skupaj $P(X_n = k) \to \frac{\lambda^k}{k!} e^{-\lambda}$. $\square$ Najpogosteje vzamemo $p_n = \lambda / n$.

Brez spomina eksponentne: $P(T > s + t \mid T > s) = \frac{e^{-\lambda(s+t)}}{e^{-\lambda s}} = e^{-\lambda t}$.

## Preveri se

? Katera trditev o zvezni slučajni spremenljivki $X$ z gostoto $f$ je pravilna?
- $f(a)$ je verjetnost, da je $X = a$.
~ Gostota ni verjetnost; lahko je celo večja od $1$. Verjetnost je ploščina pod $f$.
+ $P(X = a) = 0$ za vsak posamezen $a$.
- Vsota vseh vrednosti $f(x)$ je $1$.
~ Vrednosti je neskončno mnogo in jih ne seštevamo; enaka $1$ je ploščina pod celotnim grafom.
> Nad eno točko je ploščina $0$, zato pozitivno verjetnost dobi le interval.

? Rešitev naloge: »Verjetnost toče je vsak dan $0{,}1$, dnevi so neodvisni. Verjetnost vsaj ene toče v $10$ dneh je $10 \cdot 0{,}1 = 1$.« Kje je napaka?
- Napake ni, saj je $10 \cdot 0{,}1 = 1$.
~ Račun je pravilen, sklep ne: toča bi bila gotova, kar je nesmiselno, saj je lahko vseh $10$ dni brez nje.
- Uporabiti bi morali Poissonovo z $\lambda = 0{,}1$.
~ $\lambda = 0{,}1$ velja za en dan, ne za deset; in imamo fiksno število dni, zato je naravna binomska.
+ Verjetnosti so seštete, čeprav dogodki niso nezdružljivi; pravilno je $1 - 0{,}9^{10} \approx 0{,}65$.
> Toča se lahko zgodi več dni, zato seštevanje šteje nekatere izide večkrat. Komplement: vseh $10$ dni brez toče je $0{,}9^{10}$.

? Na postaji A strela udari v povprečju $2$-krat na uro, na postaji B $4$-krat na uro. Primerjaj verjetnosti, da v naslednjih $30$ minutah ni nobenega udara.
- Na B je verjetnost natanko polovica tiste na A.
~ Linearno sklepanje. Verjetnost $e^{-\lambda t}$ ni sorazmerna z $\lambda$.
+ Na A je $e^{-1} \approx 0{,}37$, na B $e^{-2} \approx 0{,}14$, kar je kvadrat verjetnosti na A.
- Obe sta enaki, saj gre za isti časovni interval.
~ Interval je enak, pogostost udarov pa ne; pri pogostejših udarih je mirno pol ure manj verjetno.
> $P(T > t) = e^{-\lambda t}$: na A $\lambda t = 1$, na B $\lambda t = 2$, in $e^{-2} = (e^{-1})^2$.

? Ploha se začne ob naključnem trenutku med 14.00 in 16.00, enakomerno. Kolikšna je verjetnost, da se začne med 14.30 in 15.15?
- $0{,}75$
~ To je $\frac{45}{60}$: deliš z eno uro, interval pa traja dve uri.
+ $0{,}375$
- $0{,}5$
~ Ta verjetnost bi veljala za interval dolžine ene ure; tu je dolg $45$ minut.
> Pri enakomerni je verjetnost delež dolžine: $\frac{45\,\mathrm{min}}{120\,\mathrm{min}} = 0{,}375$.

? Meteorologinja modelira število dni z nevihto v $30$ junijskih dneh. Vsak dan je nevihten z verjetnostjo $0{,}25$, neodvisno od drugih. Katera porazdelitev je prava?
- Poissonova, ker štejemo dogodke.
~ Poissonova nima zgornje meje; tu je dni natanko $30$ in vsak ima isto verjetnost, kar je binomska.
- Eksponentna, ker gre za čas.
~ Eksponentna meri čas čakanja do dogodka, tu pa štejemo dni.
+ Binomska $\mathrm{Bin}(30; 0{,}25)$.
- Normalna, ker je vreme vsota mnogih vplivov.
~ Normalna je zvezna, število dni pa je celo število od $0$ do $30$.
> Fiksno število neodvisnih poskusov z isto verjetnostjo uspeha je natanko binomska shema.

:::simboli
P | verjetnost | | | število med 0 in 1
X | slučajna spremenljivka | | |
k | vrednost diskretne spremenljivke (število uspehov ali dogodkov) | | |
n | število neodvisnih poskusov | | |
p | verjetnost uspeha v enem poskusu | | |
\lambda | povprečno število dogodkov v intervalu | | | pri eksponentni porazdelitvi na časovno enoto
e | Eulerjevo število | | | e ≈ 2,718
f | gostota verjetnosti | | |
t | čas | | | t ≥ 0
T | čas čakanja do prvega dogodka | | | eksponentno porazdeljen
x | vrednost zvezne spremenljivke | | |
\mu | pričakovana vrednost (središče normalne porazdelitve) | | |
\sigma | standardni odklon (širina normalne porazdelitve) | | |
z | standardizirana vrednost | z = \dfrac{x - \mu}{\sigma} | |
\Phi | porazdelitvena funkcija standardne normalne porazdelitve | | | Φ(z) = P(Z ≤ z), iz tabele
:::
