---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec Matic trdi: »Bisekcija je za v muzej. Newtonova metoda vedno najde rešitev v treh korakih, ne glede na to, kje začneš.« Ima prav? Odgovor dobiš na primeru iz delavnice.

Klepar ima kvadratno pločevino s stranico $30\,\mathrm{cm}$. V vsakem vogalu izreže kvadratek s stranico $x$ in zapogne robove navzgor. Nastane odprta škatla z dnom $(30-2x) \times (30-2x)$ in višino $x$. Naročnik želi prostornino $1\,\mathrm{L} = 1000\,\mathrm{cm^3}$, zato mora veljati

$$V(x) = x(30-2x)^2 = 1000$$

To je enačba tretje stopnje. Pri linearni enačbi neznanko preprosto izraziš, tu pa to ne gre: formula za enačbo tretje stopnje sicer obstaja, a je zelo nerodna. Pri enačbah, kot je $x = \cos x$, sploh ni formule za rešitev. Take enačbe rešujemo **numerično**: s postopkom, ki približek korak za korakom izboljšuje, dokler ni dovolj natančen. Na koncu boš znal Maticu pokazati, kje se moti.

## Razlaga

**Enačba kot ničla.** Vse člene prenesemo na eno stran in dobimo obliko

$$f(x) = 0$$

Za škatlo je $f(x) = x(30-2x)^2 - 1000$. Število $r$, za katero je $f(r) = 0$, je **ničla** (koren) funkcije $f$.

**Bisekcija: opazuj dolžine.** Keramičar želi kvadratno ploščico s ploščino $2\,\mathrm{dm^2}$, torej rešuje $x^2 - 2 = 0$. Velja $f(1) = -1 < 0$ in $f(2) = 2 > 0$. Zvezna funkcija, ki zamenja predznak, mora vmes preseči nič, zato je ničla v $[1;\ 2]$. Vzamemo sredino $1{,}5$: $f(1{,}5) = 0{,}25 > 0$. Predznak se zdaj zamenja med $1$ in $1{,}5$, zato obdržimo levo polovico. Nadaljujemo:

| korak | interval | sredina | predznak $f$ |
|---|---|---|---|
| 1 | $[1;\ 2]$ | $1{,}5$ | $+$ |
| 2 | $[1;\ 1{,}5]$ | $1{,}25$ | $-$ |
| 3 | $[1{,}25;\ 1{,}5]$ | $1{,}375$ | $-$ |
| 4 | $[1{,}375;\ 1{,}5]$ | $1{,}4375$ | $+$ |

Dolžine intervalov si sledijo $1$; $0{,}5$; $0{,}25$; $0{,}125$, po četrtem koraku pa $0{,}0625$. Vsaka je polovica prejšnje.

Sklep »zvezna funkcija, ki zamenja predznak, ima vmes ničlo« je izrek, ki ga bisekcija potrebuje na vsakem koraku.

**Izrek (Bolzano).** Naj bo $f$ zvezna na zaprtem intervalu $[a;\ b]$ in naj velja $f(a)\,f(b) < 0$. Potem obstaja $r \in (a;\ b)$, da je $f(r) = 0$.

Brez zveznosti sklep ne velja: funkcija $1/x$ (v $0$ dodefinirana z vrednostjo $1$) na $[-1;\ 1]$ zamenja predznak, a ničle nima, ker v $0$ ni zvezna. Brez menjave predznaka izrek ne pove ničesar: $x^2 + 1$ na $[-1;\ 1]$ ničle nima.

Ta postopek se imenuje **bisekcija** (razpolavljanje intervala). Pravilo:

1. izberi $[a;\ b]$, kjer imata $f(a)$ in $f(b)$ različna predznaka;
2. izračunaj sredino $c$;
3. če imata $f(a)$ in $f(c)$ različna predznaka, je novi interval $[a;\ c]$, sicer $[c;\ b]$;
4. ponavljaj, dokler interval ni dovolj kratek.

$$c = \frac{a+b}{2}$$

Po $n$ korakih ima interval dolžino

$$L_n = \frac{b-a}{2^n}$$

Ničla ostane ves čas ujeta v intervalu. Zato bisekcija pri zvezni funkciji **vedno** konvergira, le hitra ni. Natančno:

**Izrek (konvergenca bisekcije).** Naj bo $f$ zvezna na $[a;\ b]$ in $f(a)\,f(b) < 0$. Označimo z $[a_n;\ b_n]$ interval po $n$ korakih ($a_0 = a$, $b_0 = b$) in s $c_n$ njegovo sredino. Potem $c_n$ konvergira k ničli $r$ funkcije $f$ in velja $|c_n - r| \le \frac{b-a}{2^{n+1}}$.

*Dokaz.* Če je kdaj $f(c) = 0$, smo ničlo že našli. Sicer ima po pravilu 3 $f$ v krajiščih vsakega $[a_n;\ b_n]$ različna predznaka, dolžina pa je $L_n$. Zaporedje $a_n$ narašča, $b_n$ pada, obe sta omejeni, zato konvergirata; ker gre $b_n - a_n$ proti $0$, imata isto limito $r$ in velja $a_n \le r \le b_n$. Iz $f(a_n)\,f(b_n) < 0$ in zveznosti sledi $f(r)^2 \le 0$, torej je $r$ ničla. Sredina $c_n$ in $r$ ležita v istem intervalu dolžine $L_n$, zato je razdalja med njima največ $\frac{L_n}{2}$. $\square$

**Število korakov.** Pogoj $L_n < \varepsilon$ je isto kot $2^n > \frac{b-a}{\varepsilon}$, torej $n > \log_2 \frac{b-a}{\varepsilon}$. Število korakov je znano vnaprej in ni odvisno od $f$.

:::premisli
Koliko korakov bisekcije na $[1;\ 2]$ potrebuješ, da bo interval krajši od $0{,}001$? Najprej oceni.
---
$10$ korakov. Ker je $2^{10} = 1024$, je $L_{10} = \frac{1}{1024} \approx 0{,}00098$. Po $9$ korakih je $L_9 = \frac{1}{512} \approx 0{,}002$, kar še ni dovolj. Grobo: vsakih $10$ korakov prinese približno $3$ decimalke.
:::

**Newtonova metoda: opazuj napake.** Namesto lovljenja v interval vzamemo en približek $x_n$ in krivuljo tam nadomestimo s tangento. Predstavljaj si sliko: krivulja seka os $x$ v točki $r$. V točki $(x_n, f(x_n))$ se je dotika premica z naklonom $f'(x_n)$. Ta premica doseže os $x$ v točki $x_{n+1}$, ki je navadno bliže $r$ kot $x_n$. Tangenta je $y = f(x_n) + f'(x_n)(x - x_n)$; ko vstavimo $y = 0$, sledi

$$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$$

Za ploščico je $f'(x) = 2x$, zato se predpis poenostavi v $x_{n+1} = \frac{1}{2}\left(x_n + \frac{2}{x_n}\right)$. Začnemo pri $x_0 = 1$. **Napaka** je razdalja do prave ničle $r = \sqrt{2} = 1{,}41421356\ldots$:

$$e_n = |x_n - r|$$

| $n$ | $x_n$ | $e_n$ |
|---|---|---|
| 0 | $1$ | $0{,}41$ |
| 1 | $1{,}5$ | $0{,}086$ |
| 2 | $1{,}41667$ | $0{,}0025$ |
| 3 | $1{,}4142157$ | $2{,}1 \cdot 10^{-6}$ |
| 4 | $1{,}41421356237$ | $1{,}6 \cdot 10^{-12}$ |

Poglej eksponente napak: približno $10^{-1}$, $10^{-3}$, $10^{-6}$, $10^{-12}$. Eksponent se vsakič podvoji, torej se podvoji tudi število pravilnih decimalk. Napaka je približno sorazmerna s **kvadratom** prejšnje: $0{,}0025^2 \approx 6 \cdot 10^{-6}$, kar je istega reda kot $2{,}1 \cdot 10^{-6}$.

**Konvergenca.** Postopek **konvergira**, če gre $e_n$ proti nič. Kako hitro, pove **red konvergence**: zaporedje $x_n \to r$ konvergira z redom $p \ge 1$, če obstaja konstanta $C > 0$ (pri $p = 1$ še $C < 1$), da gre $\frac{e_{n+1}}{e_n^p}$ proti $C$, ko $n \to \infty$. Dva najpomembnejša primera:

- linearna konvergenca: $e_{n+1} \approx q\, e_n$ z $0 < q < 1$; pri bisekciji se meja napake vsak korak razpolovi, torej $q = \frac{1}{2}$;
- kvadratična konvergenca: $e_{n+1} \approx C\, e_n^2$; to ima Newtonova metoda blizu ničle, če je $f'(r) \ne 0$.

$$e_{n+1} \approx q\, e_n$$

$$e_{n+1} \approx C\, e_n^2$$

Konstanta je $C = \left|\frac{f''(r)}{2 f'(r)}\right|$; za ploščico $C = \frac{1}{2\sqrt{2}} \approx 0{,}35$. Od kod pride, pove izrek.

**Izrek (lokalna kvadratična konvergenca Newtonove metode).** Naj bo $f$ dvakrat zvezno odvedljiva v okolici ničle $r$ in naj bo $f'(r) \ne 0$. Potem obstaja $\delta > 0$, da za vsak začetni približek z $|x_0 - r| < \delta$ Newtonovo zaporedje konvergira k $r$ in gre $\frac{e_{n+1}}{e_n^2}$ proti $C$.

*Dokaz.* Taylorjeva formula okoli $x_n$, izračunana v $r$, da $0 = f(r) = f(x_n) + f'(x_n)(r - x_n) + \frac{1}{2}f''(\xi_n)(r - x_n)^2$, kjer je $\xi_n$ med $x_n$ in $r$. Delimo z $f'(x_n)$ in upoštevamo predpis za $x_{n+1}$:

$$x_{n+1} - r = \frac{f''(\xi_n)}{2 f'(x_n)}(x_n - r)^2$$

Ker sta $f'$ in $f''$ zvezni in $f'(r) \ne 0$, obstaja interval $I = [r - \delta;\ r + \delta]$, na katerem je $|f'| \ge m_1 > 0$ in $|f''| \le M_2$. Za $x_n \in I$ je zato $e_{n+1} \le K e_n^2$ s $K = \frac{M_2}{2 m_1}$. Če $\delta$ izberemo tako, da je $K\delta < 1$, je $e_{n+1} \le K\delta \cdot e_n < e_n$: naslednji približek ostane v $I$ in napake padajo vsaj geometrijsko proti $0$. Ko gresta $x_n$ in $\xi_n$ proti $r$, gre ulomek pred kvadratom proti $\frac{f''(r)}{2 f'(r)}$. $\square$

Pogoj $f'(r) \ne 0$ pomeni, da je ničla enostavna. Pri večkratni ničli Newton konvergira le linearno (Naloga 2 v razdelku Za izpit), pri slabem $x_0$ pa izrek ne obljubi ničesar.

:::premisli
Kaj se zgodi s tangento in z $x_{n+1}$, ko je $f'(x_n) = 0$? In ko je $f'(x_n)$ le zelo majhen?
---
Tangenta je vodoravna in osi $x$ sploh ne seka; v predpisu bi delili z nič. Že kadar je $f'(x_n)$ le majhen, je tangenta skoraj vodoravna in $x_{n+1}$ odleti daleč stran.
:::

**Kdaj nehamo.** Natančnost označimo z $\varepsilon$. Pri bisekciji se ustavimo, ko je $L_n < \varepsilon$. Pri Newtonovi metodi, ko je $|x_{n+1} - x_n| < \varepsilon$ in je $|f(x_{n+1})|$ majhen. Za vsak primer določimo tudi največje število korakov, da se program ne vrti v nedogled.

| | bisekcija | Newton |
|---|---|---|
| potrebuje | $a$, $b$ z različnima predznakoma | $x_0$ in $f'$ |
| konvergenca | vedno, linearna | blizu ničle, kvadratična |
| tveganje | počasnost | odbeg, deljenje z $0$ |

## Rešeni primeri

### Primer 1: bisekcija za kockast opaž (lažji)

Tesar zbija kockast opaž za betonski podstavek s prostornino $20\,\mathrm{dm^3}$. Stranica $x$ reši enačbo $x^3 - 20 = 0$. Naredi $4$ korake bisekcije na intervalu $[2;\ 3]$.

**Podatki:** $f(x) = x^3 - 20$, $a = 2\,\mathrm{dm}$, $b = 3\,\mathrm{dm}$, število korakov $n = 4$
**Iščemo:** interval, ki po $4$ korakih vsebuje stranico $x$, in njegovo dolžino

:::formula
$c = \dfrac{a+b}{2}$; obdrži polovico, na kateri $f$ zamenja predznak; $L_n = \dfrac{b-a}{2^n}$
:::

**Rešitev:**

1. Začetek: $f(2) = -12 < 0$ in $f(3) = 7 > 0$, zato je ničla v $[2;\ 3]$.
2. $c = 2{,}5$: $2{,}5^3 = 15{,}625$, zato $f(2{,}5) = -4{,}375 < 0$. Predznak se zamenja desno, novi interval je $[2{,}5;\ 3]$.
3. $c = 2{,}75$: $2{,}75^3 = 20{,}796875$, $f > 0$. Novi interval je $[2{,}5;\ 2{,}75]$.
4. $c = 2{,}625$: $2{,}625^3 = 18{,}087890625$, $f < 0$. Novi interval je $[2{,}625;\ 2{,}75]$.
5. $c = 2{,}6875$: $2{,}6875^3 \approx 19{,}41$, $f < 0$. Novi interval je $[2{,}6875;\ 2{,}75]$.
6. Dolžina: $L_4 = \frac{1}{16} = 0{,}0625\,\mathrm{dm}$, kar se ujema s štirimi razpolovitvami.
7. Odgovor: stranica opaža je med $2{,}6875\,\mathrm{dm}$ in $2{,}75\,\mathrm{dm}$. Sredina $2{,}71875\,\mathrm{dm}$ se od prave vrednosti razlikuje za največ $0{,}03125\,\mathrm{dm}$, torej za približno $3\,\mathrm{mm}$.

### Primer 2: Newtonova metoda za kleparjevo škatlo

Za škatlo iz uvoda rešujemo $x(30-2x)^2 - 1000 = 0$ ($x$ v cm). Klepar pričakuje plitvo škatlo, zato začne pri $x_0 = 1\,\mathrm{cm}$. Računaj, dokler se zaporedna približka ne razlikujeta za manj kot $0{,}001\,\mathrm{cm}$.

**Podatki:** $f(x) = x(30-2x)^2 - 1000$, $x_0 = 1\,\mathrm{cm}$, $\varepsilon = 0{,}001\,\mathrm{cm}$
**Iščemo:** višino škatle $x$

:::formula
$x_{n+1} = x_n - \dfrac{f(x_n)}{f'(x_n)}$, kjer je po pravilu za odvod produkta $f'(x) = (30-2x)^2 - 4x(30-2x) = (30-2x)(30-6x)$
:::

**Rešitev:**

1. $f(1) = 1 \cdot 28^2 - 1000 = -216$ in $f'(1) = 28 \cdot 24 = 672$.
2. $x_1 = 1 - \frac{-216}{672} \approx 1{,}3214$. Približek se je premaknil desno, ker je $f$ tam negativna in narašča.
3. $f(x_1) \approx -11{,}03$ in $f'(x_1) \approx 603{,}8$, zato $x_2 \approx 1{,}3214 + 0{,}0183 = 1{,}3397$. Razlika $|x_2 - x_1| \approx 0{,}018$ je še prevelika.
4. $f(x_2) \approx -0{,}035$, zato $x_3 \approx 1{,}339746$. Razlika $|x_3 - x_2| \approx 0{,}00006 < 0{,}001$, ustavimo se.
5. Preizkus: dno ima stranico $30 - 2 \cdot 1{,}34 = 27{,}32\,\mathrm{cm}$, prostornina je $1{,}34 \cdot 27{,}32^2 \approx 1000{,}2\,\mathrm{cm^3}$.
6. Odgovor: kvadratke s stranico približno $1{,}34\,\mathrm{cm}$ izrežemo za plitvo škatlo. Enačba ima še rešitev $x = 10\,\mathrm{cm}$ (visoka ozka škatla, $10 \cdot 10^2 = 1000$); Newton jo najde, če začneš blizu nje.

### Primer 3: Matic začne na sredini (težji)

Matic reši isto enačbo in vzame $x_0 = 5\,\mathrm{cm}$, »ker je to sredina med $0$ in $10$«. Nato poskusi še z $x_0 = 6\,\mathrm{cm}$. Kaj se zgodi? Koliko korakov bi na intervalu $[0;\ 5]$ potrebovala sama bisekcija za natančnost $0{,}01\,\mathrm{cm}$? Mojster predlaga kombinacijo: tri korake bisekcije na $[0;\ 5]$, nato Newtonovo metodo iz sredine dobljenega intervala, dokler se zaporedna približka ne razlikujeta za manj kot $0{,}001\,\mathrm{cm}$. Koliko Newtonovih korakov je potrebnih in kako velika je končna napaka?

**Podatki:** $f(x) = x(30-2x)^2 - 1000$, $f'(x) = (30-2x)(30-6x)$, začetka $x_0 = 5\,\mathrm{cm}$ in $x_0 = 6\,\mathrm{cm}$, interval $[0;\ 5]$, $\varepsilon = 0{,}01\,\mathrm{cm}$; kombinacija: $3$ koraki bisekcije, nato Newton do $|x_{n+1} - x_n| < 0{,}001\,\mathrm{cm}$; $C \approx 0{,}173$ za ničlo $r \approx 1{,}34\,\mathrm{cm}$
**Iščemo:** obnašanje Newtonove metode, število korakov bisekcije $n$ in rezultat kombinirane metode

:::formula
$x_{n+1} = x_n - \dfrac{f(x_n)}{f'(x_n)}$, $\quad L_n = \dfrac{b-a}{2^n} < \varepsilon$, $\quad e_{n+1} \approx C\, e_n^2$
:::

**Rešitev:**

1. Pri $x_0 = 5$: $f'(5) = 20 \cdot 0 = 0$. Delimo z nič, metoda se ustavi takoj. Tu ima škatla največjo prostornino ($2000\,\mathrm{cm^3}$), zato je tangenta vodoravna.
2. Pri $x_0 = 6$: $f(6) = 6 \cdot 18^2 - 1000 = 944$ in $f'(6) = 18 \cdot (-6) = -108$. Dobimo $x_1 = 6 + \frac{944}{108} \approx 14{,}74$, kar je skoraj na robu pločevine. Naslednji korak da $x_2 \approx -18{,}1$: približki skočijo daleč stran od obeh rešitev in se šele po še sedmih korakih vrnejo k $r \approx 1{,}34$, čeprav je bila bliže ničla $10$.
3. Bisekcija: $f(0) = -1000 < 0$ in $f(5) = 1000 > 0$, zato je ničla v $[0;\ 5]$.
4. Potrebujemo $\frac{5}{2^n} < 0{,}01$, torej $2^n > 500$. Ker je $2^8 = 256$ in $2^9 = 512$, je najmanjši $n = 9$, z dolžino $L_9 \approx 0{,}0098\,\mathrm{cm}$.
5. Kombinacija, bisekcija: $f(2{,}5) = 562{,}5 > 0$, zato $[0;\ 2{,}5]$; $f(1{,}25) \approx -54{,}69 < 0$, zato $[1{,}25;\ 2{,}5]$; $f(1{,}875) \approx 292{,}0 > 0$, zato $[1{,}25;\ 1{,}875]$ s sredino $x_0 = 1{,}5625$.
6. Na tem intervalu sta oba faktorja $30 - 2x$ in $30 - 6x$ pozitivna (ker je $x < 5$), zato je $f' > 0$ in tangenta ni nikjer vodoravna. Prvi korak: $f(1{,}5625) \approx 128{,}54$, $f'(1{,}5625) \approx 554{,}30$, $x_1 \approx 1{,}5625 - 0{,}2319 = 1{,}3306$.
7. $f(x_1) \approx -5{,}495$, $f'(x_1) \approx 601{,}9$, $x_2 \approx 1{,}33973$. Razlika $|x_2 - x_1| \approx 0{,}0091$ je še prevelika.
8. $f(x_2) \approx -0{,}0087$, $f'(x_2) \approx 600{,}0$, $x_3 \approx 1{,}339746$. Razlika $\approx 0{,}0000144 < 0{,}001$, ustavimo se po $3$ Newtonovih korakih.
9. Napaka: $x_3$ je mnogo bliže ničli kot $x_2$, zato je $e_2 \approx |x_3 - x_2| \approx 1{,}44 \cdot 10^{-5}$. Po kvadratični oceni je $e_3 \approx C e_2^2 \approx 0{,}173 \cdot (1{,}44 \cdot 10^{-5})^2 \approx 3{,}6 \cdot 10^{-11}\,\mathrm{cm}$.
10. Odgovor: Matic se moti dvakrat. Newtonova metoda je odvisna od začetka: iz $x_0 = 5$ deli z nič, iz $x_0 = 6$ odskoči daleč stran in se vrne šele po mnogih korakih. Sama bisekcija potrebuje $9$ korakov za $0{,}01\,\mathrm{cm}$. Kombinacija s $3$ koraki bisekcije in $3$ Newtonovimi da $x \approx 1{,}339746\,\mathrm{cm}$ z napako reda $10^{-11}\,\mathrm{cm}$. Bisekcija poskrbi za zanesljiv začetek, Newton za natančnost.

### Primer 4 – zdaj ti

Vrni se k opažu iz primera 1 in reši $x^3 - 20 = 0$ z Newtonovo metodo iz $x_0 = 3\,\mathrm{dm}$. Naredi dva koraka.

**Podatki:** $f(x) = x^3 - 20$, $x_0 = 3\,\mathrm{dm}$, dva koraka
**Iščemo:** približek $x_2$

:::formula
$x_{n+1} = x_n - \dfrac{f(x_n)}{f'(x_n)}$ z $f'(x) = 3x^2$
:::

**Rešitev:**

1. $f(3) = 27 - 20 = 7$ in $f'(3) = 3 \cdot 9 = 27$.
2. $x_1 = 3 - \frac{7}{27} \approx 2{,}7407$.
3. Izračunaj $f(x_1)$, $f'(x_1)$ in $x_2$ sam, nato preveri:

:::premisli
Koliko je $x_2$?
---
$f(x_1) \approx 0{,}5875$, $f'(x_1) \approx 22{,}535$, zato $x_2 = x_1 - \frac{f(x_1)}{f'(x_1)} \approx 2{,}7147\,\mathrm{dm}$. Prava vrednost je $2{,}7144\,\mathrm{dm}$: po dveh korakih Newtona je napaka $0{,}0003\,\mathrm{dm}$, po štirih korakih bisekcije pa je bila meja napake $0{,}03\,\mathrm{dm}$.
:::

## Pogoste napake

- **Napačen predznak v Newtonovem predpisu.** Kdo zapiše $x_{n+1} = x_n + \frac{f(x_n)}{f'(x_n)}$, ker si zapomni »popravek«, ne pa njegove smeri. Približki se tako oddaljujejo od ničle. Pravilno: odštej količnik; preizkus je, da se mora $|f|$ v naslednjem koraku zmanjšati.
- **Bisekcija obdrži napačno polovico.** Študent vidi $f(a) < 0$ in $f(c) < 0$ ter obdrži $[a;\ c]$, »ker sta oba negativna«. Ničla pa je tam, kjer se predznak **zamenja**, torej v $[c;\ b]$. Primerjaj predznaka krajišč, ne vrednosti s sredino.
- **»Enak predznak v krajiščih pomeni, da ničle ni.«** Za $x^2 - 2$ na $[-2;\ 2]$ je $f(-2) = f(2) = 2$, ničli pa sta dve. Enak predznak pomeni le, da bisekcije na tem intervalu ne moreš začeti. Interval razdeli ali si nariši graf.
- **»Newton vedno konvergira k najbližji ničli.«** Iz $x_0 = 6$ so približki odskočili do $-18$ in končali pri bolj oddaljeni ničli $1{,}34$, iz $x_0 = 5$ smo delili z nič. Kvadratična hitrost velja le dovolj blizu ničle; daleč od nje lahko metoda skače ali se oddalji.
- **Napačen odvod.** Pri $x(30-2x)^2$ kdo zapiše $f'(x) = 2(30-2x)$ in pozabi pravilo za produkt. Metoda potem konvergira počasi ali nikamor. Odvod preveri z numerično oceno $\frac{f(x+h) - f(x)}{h}$ za majhen $h$.

## Povzetek

- Nelinearno enačbo zapišemo kot $f(x) = 0$ in iščemo ničlo $r$.
- Bisekcija: začni z $[a;\ b]$, kjer $f$ zamenja predznak, in ga razpolavljaj; $L_n = \frac{b-a}{2^n}$. Konvergira vedno (za zvezno $f$), linearno s $q = \frac{1}{2}$.
- Newtonova metoda: $x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$. Blizu ničle konvergira kvadratično ($e_{n+1} \approx C\,e_n^2$, število pravilnih decimalk se podvoji).
- Newton lahko odpove: $f'(x_n) = 0$ ali slab začetek. Varna strategija: bisekcija za začetek, Newton za natančnost.
- Ustavitev: $L_n < \varepsilon$ oziroma $|x_{n+1} - x_n| < \varepsilon$, plus omejitev števila korakov.

## Za izpit

Znati moraš povedati:

- Bolzanov izrek s pogoji (zvezna $f$ na $[a;\ b]$, $f(a)\,f(b) < 0$) in zakaj sta pogoja nujna;
- izrek o konvergenci bisekcije z dokazom (ugnezdeni intervali), oceno $|c_n - r| \le \frac{b-a}{2^{n+1}}$ in število korakov $n > \log_2 \frac{b-a}{\varepsilon}$;
- izpeljavo Newtonove metode iz enačbe tangente;
- definicijo reda konvergence $p$ in konstante $C$;
- izrek o lokalni kvadratični konvergenci Newtonove metode s pogoji ($f$ dvakrat zvezno odvedljiva, $f'(r) \ne 0$, $x_0$ dovolj blizu $r$) in dokaz s Taylorjevo formulo;
- kdaj Newtonova metoda odpove ali se upočasni: $f'(x_n) = 0$, slab začetni približek, večkratna ničla.

### Naloga 1

Dana je enačba $x^3 - 2x - 5 = 0$. (a) Pokaži, da ima na $[2;\ 3]$ natanko eno rešitev $r$. (b) Koliko korakov bisekcije na $[2;\ 3]$ zagotovi, da se sredina zadnjega intervala od $r$ razlikuje za manj kot $10^{-6}$? (c) Naredi tri korake Newtonove metode iz $x_0 = 2$. (d) Z oceno $e_{n+1} \le K e_n^2$, kjer je $K = \frac{M_2}{2 m_1}$, $M_2$ največja vrednost $|f''|$ in $m_1$ najmanjša vrednost $|f'|$ na $[2;\ 3]$, pokaži, da je napaka $x_3$ zagotovo manjša od $10^{-8}$.

**Rešitev:**

1. (a) $f(x) = x^3 - 2x - 5$ je zvezna, $f(2) = -1 < 0$ in $f(3) = 16 > 0$, zato ima po Bolzanovem izreku ničlo v $(2;\ 3)$.
2. $f'(x) = 3x^2 - 2 \ge 3 \cdot 4 - 2 = 10 > 0$ na $[2;\ 3]$, zato je $f$ tam strogo naraščajoča in ničla je ena sama.
3. (b) Po izreku o bisekciji je $|c_n - r| \le \frac{1}{2^{n+1}}$. Potrebujemo $2^{n+1} > 10^6$. Ker je $2^{19} = 524288$ in $2^{20} = 1048576$, je $n + 1 = 20$, torej zadošča $19$ korakov.
4. (c) Predpis: $x_{n+1} = x_n - \frac{x_n^3 - 2x_n - 5}{3x_n^2 - 2}$. Iz $x_0 = 2$: $f(2) = -1$, $f'(2) = 10$, $x_1 = 2 + 0{,}1 = 2{,}1$.
5. $f(2{,}1) = 9{,}261 - 4{,}2 - 5 = 0{,}061$, $f'(2{,}1) = 11{,}23$, $x_2 \approx 2{,}1 - 0{,}005432 = 2{,}094568$.
6. $f(x_2) \approx 1{,}857 \cdot 10^{-4}$, $f'(x_2) \approx 11{,}1616$, $x_3 \approx 2{,}094568 - 0{,}0000166 \approx 2{,}0945515$.
7. (d) $f''(x) = 6x$, zato je $M_2 = 18$; $f'$ na $[2;\ 3]$ narašča, zato $m_1 = f'(2) = 10$ in $K = \frac{18}{20} = 0{,}9$. Vsi približki ležijo v $[2;\ 3]$, zato ocena velja na vsakem koraku.
8. Ker je $f(2) < 0 < f(2{,}1)$, je $r \in (2;\ 2{,}1)$ in $e_0 < 0{,}1$. Sledi $e_1 \le 0{,}9 \cdot 0{,}1^2 = 0{,}009$, $e_2 \le 0{,}9 \cdot 0{,}009^2 \approx 7{,}29 \cdot 10^{-5}$ in $e_3 \le 0{,}9 \cdot (7{,}29 \cdot 10^{-5})^2 \approx 4{,}8 \cdot 10^{-9} < 10^{-8}$.
9. Odgovor: rešitev na $[2;\ 3]$ je natanko ena. Bisekcija potrebuje $19$ korakov, Newton pa po treh korakih da $x_3 \approx 2{,}0945515$ z zagotovljeno napako pod $10^{-8}$ (dejanska napaka je okoli $1{,}6 \cdot 10^{-10}$).

### Naloga 2

Natančno navedi izrek o lokalni kvadratični konvergenci Newtonove metode in ga dokaži. Nato utemelji, ali Newtonova metoda za $f(x) = (x - 1)^2$ iz $x_0 = 2$ konvergira kvadratično.

**Rešitev:**

1. Izrek: naj bo $f$ dvakrat zvezno odvedljiva v okolici ničle $r$ in $f'(r) \ne 0$. Potem obstaja $\delta > 0$, da za vsak $x_0$ z $|x_0 - r| < \delta$ Newtonovo zaporedje konvergira k $r$ in gre $\frac{e_{n+1}}{e_n^2}$ proti $\left|\frac{f''(r)}{2 f'(r)}\right|$.
2. Taylorjeva formula okoli $x_n$, izračunana v $r$: $0 = f(x_n) + f'(x_n)(r - x_n) + \frac{1}{2} f''(\xi_n)(r - x_n)^2$ z $\xi_n$ med $x_n$ in $r$.
3. Deljenje z $f'(x_n)$ in predpis za $x_{n+1}$ dasta $x_{n+1} - r = \frac{f''(\xi_n)}{2 f'(x_n)}(x_n - r)^2$.
4. Zaradi zveznosti in $f'(r) \ne 0$ je na $I = [r - \delta;\ r + \delta]$ $|f'| \ge m_1 > 0$ in $|f''| \le M_2$, zato je $e_{n+1} \le K e_n^2$ s $K = \frac{M_2}{2 m_1}$. Izberemo $\delta$ s $K\delta < 1$; tedaj je $e_{n+1} \le K\delta \cdot e_n$, približki ostanejo v $I$ in $e_n \le (K\delta)^n e_0 \to 0$.
5. Ko $x_n \to r$, gre tudi $\xi_n \to r$, zato gre $\frac{e_{n+1}}{e_n^2}$ proti $\left|\frac{f''(r)}{2 f'(r)}\right|$.
6. Za $f(x) = (x - 1)^2$ je $r = 1$ in $f'(1) = 0$, zato pogoj izreka ni izpolnjen. Predpis: $x_{n+1} = x_n - \frac{(x_n - 1)^2}{2(x_n - 1)}$, torej za odmik velja enačba $x_{n+1} - 1 = \frac{1}{2}(x_n - 1)$.
7. Iz $x_0 = 2$ dobimo $x_1 = 1{,}5$, $x_2 = 1{,}25$, $x_3 = 1{,}125$, v splošnem $e_n = \frac{1}{2^n}$. Zato je $\frac{e_{n+1}}{e_n} = \frac{1}{2}$, $\frac{e_{n+1}}{e_n^2} = 2^{n-1}$ pa raste čez vse meje.
8. Odgovor: metoda konvergira, a le linearno s $q = \frac{1}{2}$, enako hitro kot bisekcija. Kvadratične konvergence ni, ker je $r = 1$ dvojna ničla ($f'(r) = 0$).

## Drugače: Korak za korakom s številkami

Visoko škatlo ($x = 10\,\mathrm{cm}$) poiščemo z Newtonovo metodo iz $x_0 = 9$. Vsak korak je ista trojica računov: $f(x_n)$, $f'(x_n)$, nato novi približek.

| $n$ | $x_n$ | $f(x_n)$ | $f'(x_n)$ |
|---|---|---|---|
| 0 | $9$ | $296$ | $-288$ |
| 1 | $10{,}0278$ | $-8{,}33$ | $-300{,}0$ |
| 2 | $9{,}9999994$ | $0{,}00017$ | $-300{,}0$ |
| 3 | $10{,}0000000$ | $0$ | $-300$ |

1. $f(9) = 9 \cdot 12^2 - 1000 = 296$, $f'(9) = 12 \cdot (-24) = -288$.
2. $x_1 = 9 - \frac{296}{-288} \approx 10{,}0278$; napaka $0{,}028$.
3. $x_2 = x_1 - \frac{f(x_1)}{f'(x_1)} \approx 9{,}9999994$; napaka $6 \cdot 10^{-7}$.
4. Napake $1$; $0{,}028$; $0{,}0000006$: eksponent se še več kot podvoji. Tu je $f''(10) = 0$, zato je $C = 0$ in napaka pade celo hitreje kot kvadratno. Pri ploščici ($C \approx 0{,}35$) smo videli čisto kvadratično konvergenco.

V preglednici to narediš s tremi stolpci: $x_n$, $f(x_n)$ in $f'(x_n)$; v naslednji vrstici je $x_{n+1}$ formula, ki bere celice iz prejšnje vrstice. Formulo samo kopiraš navzdol.

## Drugače: Kot zgodba

V delavnici delata Bara in Nik. Oba morata najti, kje natančno izrezati vogale.

Bara je previdna. Ve, da je pri $0\,\mathrm{cm}$ škatla premajhna, pri $5\,\mathrm{cm}$ pa prevelika. Zato poskusi na sredini, pri $2{,}5\,\mathrm{cm}$. Prevelika. Zdaj ve, da je prava mera med $0$ in $2{,}5$. Spet poskusi na sredini. Vsak poskus ji prepolovi negotovost; po devetih ima mero na desetinko milimetra natančno.

Nik je hiter. Pri $1\,\mathrm{cm}$ izmeri, koliko prostornine manjka in kako hitro se prostornina spreminja, ko premakne rez. Iz tega oceni popravek in v dveh potezah pride na $1{,}3397\,\mathrm{cm}$. Ko pa naslednjič začne pri $5\,\mathrm{cm}$, kjer se prostornina sploh ne spreminja, ne ve, v katero smer naj gre. Pri $6\,\mathrm{cm}$ pa skoči čez rob pločevine.

Mojster jima svetuje: »Bara naj najprej zoži območje, Nik naj potem dokonča.« Tako delajo tudi računalniški programi za reševanje enačb.

## Preveri se

? Kaj zagotovo velja za bisekcijo pri zvezni funkciji?
- Za vsak korak potrebuje odvod funkcije.
~ Odvod potrebuje Newtonova metoda. Bisekcija primerja le predznake vrednosti $f$.
+ Vsak korak razpolovi interval, v katerem je ničla.
- Konvergira kvadratično, zato podvoji število decimalk na korak.
~ To velja za Newtonovo metodo blizu ničle. Bisekcija konvergira linearno, meja napake se razpolovi.
- Deluje tudi, če imata $f(a)$ in $f(b)$ enak predznak.
~ Brez menjave predznaka ne vemo, da je ničla v intervalu, zato bisekcije ne moremo začeti.
> Bisekcija ohrani ničlo ujeto: po $n$ korakih je interval dolg $\frac{b-a}{2^n}$.

? Za $f(x) = x^2 - 5$ naredi en korak Newtonove metode iz $x_0 = 2$. Koliko je $x_1$?
- $1{,}75$
~ Prišteti in odšteti si zamenjal: $2 + \frac{-1}{4}$. Pravilno je $x_1 = x_0 - \frac{f(x_0)}{f'(x_0)}$.
+ $2{,}25$
- $2{,}5$
~ Vzel si $f'(x) = x$ namesto $2x$, zato je popravek dvakrat prevelik.
> $f(2) = -1$, $f'(2) = 4$, $x_1 = 2 - \frac{-1}{4} = 2{,}25$. Prava ničla je $\sqrt{5} \approx 2{,}236$.

? Poišči napako. »Rešujem $x^3 - 20 = 0$ na $[2;\ 3]$. $f(2) = -12$, $f(2{,}5) = -4{,}375$. Ker sta obe vrednosti negativni, je ničla v $[2;\ 2{,}5]$.«
- Napačno je izračunana vrednost $f(2{,}5)$.
~ $2{,}5^3 = 15{,}625$, zato je $f(2{,}5) = -4{,}375$ pravilno.
- Napake ni, interval $[2;\ 2{,}5]$ je pravi.
~ Na $[2;\ 2{,}5]$ je $f$ povsod negativna, ničle tam ni.
+ Obdržati bi moral $[2{,}5;\ 3]$, ker se predznak zamenja med $2{,}5$ in $3$.
> Ničla je tam, kjer $f$ zamenja predznak: $f(2{,}5) < 0$ in $f(3) = 7 > 0$.

? Od intervala dolžine $1$ želiš natančnost $10^{-6}$. Kako se primerjata metodi, če Newton začne blizu ničle?
- Obe potrebujeta približno $6$ korakov, ker želimo $6$ decimalk.
~ To bi veljalo za metodo, ki vsak korak doda eno decimalko. Bisekcija doda le $\log_{10} 2 \approx 0{,}3$ decimalke na korak.
+ Bisekcija okoli $20$ korakov, Newton okoli $4$.
- Bisekcija okoli $4$ korake, Newton okoli $20$.
~ Hitrosti si zamenjal. Bisekcija razpolavlja ($2^{20} \approx 10^6$), Newton podvaja število decimalk.
> $2^{20} = 1048576 > 10^6$, zato bisekcija potrebuje $20$ korakov; Newton podvaja decimalke ($1 \to 2 \to 4 \to 8$) in natančnost doseže v nekaj korakih.

? Inženir računa poves jeklene vrvi na gradbišču. Newtonova metoda iz njegovega $x_0$ skoči daleč stran, ker je $f'(x_0)$ skoraj nič. Kaj je najbolj smiselno?
- Naredi še več Newtonovih korakov iz istega $x_0$, saj Newton vedno konvergira.
~ Newton ne konvergira vedno; iz slabega začetka lahko približki bežijo v nedogled.
- Vzame $x_0$ točno tam, kjer je $f'(x_0) = 0$, ker je tam funkcija najbolj ravna.
~ Tam je tangenta vodoravna in v predpisu bi delil z nič.
+ Poišče interval z menjavo predznaka, naredi nekaj korakov bisekcije in iz dobljene sredine nadaljuje z Newtonom.
> Bisekcija zanesljivo pripelje blizu ničle, kjer Newton potem konvergira kvadratično.

:::simboli
f | funkcija, katere ničlo iščemo | | | enačbo zapišemo kot $f(x) = 0$
x | neznanka (pri škatli stranica izrezanega kvadratka) | | cm
V | prostornina škatle | V(x) = x(30-2x)^2 | cm^3
a | levo krajišče intervala | | | $f(a)$ in $f(b)$ različnih predznakov
b | desno krajišče intervala | | |
c | sredina intervala | c = \frac{a+b}{2} | |
L_n | dolžina intervala po $n$ korakih bisekcije | L_n = \frac{b-a}{2^n} | |
n | številka koraka | | – |
x_n | približek po $n$ korakih | | |
x_{n+1} | naslednji približek | x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)} | |
f' | odvod funkcije (naklon tangente) | | |
r | ničla funkcije | f(r) = 0 | |
e_n | napaka približka | e_n = \lvert x_n - r \rvert | |
e_{n+1} | napaka naslednjega približka | | |
q | faktor linearne konvergence | | – | pri bisekciji $q = \frac{1}{2}$
C | konstanta kvadratične konvergence | C = \left\lvert\frac{f''(r)}{2 f'(r)}\right\rvert | |
\varepsilon | zahtevana natančnost | | |
\xi_n | točka med $x_n$ in $r$ iz Taylorjeve formule | | |
:::
