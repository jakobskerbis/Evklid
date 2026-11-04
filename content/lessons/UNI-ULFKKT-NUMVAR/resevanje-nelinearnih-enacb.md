---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec Matic trdi: »Bisekcija je za v muzej. Newtonova metoda vedno najde rešitev v treh korakih, ne glede na to, kje začneš.« Ima prav? Odgovor dobiš na primeru iz delavnice.

Klepar ima kvadratno pločevino s stranico $30\,\mathrm{cm}$. V vsakem vogalu izreže kvadratek s stranico $x$ in zapogne robove navzgor. Nastane odprta škatla z dnom $(30-2x) \times (30-2x)$ in višino $x$. Naročnik želi prostornino $1\,\mathrm{L} = 1000\,\mathrm{cm^3}$, zato mora veljati

$$V(x) = x(30-2x)^2 = 1000$$

To je enačba tretje stopnje. Pri linearni enačbi neznanko preprosto izraziš, tu pa to ne gre. Pri enačbah, kot je $x = \cos x$, sploh ni formule za rešitev. Take enačbe rešujemo **numerično**: s postopkom, ki približek korak za korakom izboljšuje, dokler ni dovolj natančen. Na koncu boš znal Maticu pokazati, kje se moti.

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

Dolžine intervalov si sledijo $1$, $0{,}5$, $0{,}25$, $0{,}125$, po četrtem koraku pa $0{,}0625$. Vsaka je polovica prejšnje.

Ta postopek se imenuje **bisekcija** (razpolavljanje intervala). Pravilo:

1. izberi $[a;\ b]$, kjer imata $f(a)$ in $f(b)$ različna predznaka;
2. izračunaj sredino $c$;
3. če imata $f(a)$ in $f(c)$ različna predznaka, je novi interval $[a;\ c]$, sicer $[c;\ b]$;
4. ponavljaj, dokler interval ni dovolj kratek.

$$c = \frac{a+b}{2}$$

Po $n$ korakih ima interval dolžino

$$L_n = \frac{b-a}{2^n}$$

Ničla ostane ves čas ujeta v intervalu. Zato bisekcija pri zvezni funkciji **vedno** konvergira, le hitra ni.

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

**Konvergenca.** Postopek **konvergira**, če gre $e_n$ proti nič. Kako hitro, pove **red konvergence**:

- linearna konvergenca: $e_{n+1} \approx q\, e_n$ z $0 < q < 1$; pri bisekciji se meja napake vsak korak razpolovi, torej $q = \frac{1}{2}$;
- kvadratična konvergenca: $e_{n+1} \approx C\, e_n^2$; to ima Newtonova metoda blizu ničle, če je $f'(r) \ne 0$.

$$e_{n+1} \approx q\, e_n$$

$$e_{n+1} \approx C\, e_n^2$$

Konstanta je $C = \left|\frac{f''(r)}{2 f'(r)}\right|$; za ploščico $C = \frac{1}{2\sqrt{2}} \approx 0{,}35$.

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

Matic reši isto enačbo in vzame $x_0 = 5\,\mathrm{cm}$, »ker je to sredina med $0$ in $10$«. Nato poskusi še z $x_0 = 6\,\mathrm{cm}$. Kaj se zgodi? Koliko korakov bi na intervalu $[0;\ 5]$ potrebovala bisekcija za natančnost $0{,}01\,\mathrm{cm}$?

**Podatki:** $f(x) = x(30-2x)^2 - 1000$, $f'(x) = (30-2x)(30-6x)$, začetka $x_0 = 5\,\mathrm{cm}$ in $x_0 = 6\,\mathrm{cm}$, interval $[0;\ 5]$, $\varepsilon = 0{,}01\,\mathrm{cm}$
**Iščemo:** obnašanje Newtonove metode in število korakov bisekcije $n$

:::formula
$x_{n+1} = x_n - \dfrac{f(x_n)}{f'(x_n)}$ in $L_n = \dfrac{b-a}{2^n} < \varepsilon$
:::

**Rešitev:**

1. Pri $x_0 = 5$: $f'(5) = 20 \cdot 0 = 0$. Delimo z nič, metoda se ustavi takoj. Tu ima škatla največjo prostornino ($2000\,\mathrm{cm^3}$), zato je tangenta vodoravna.
2. Pri $x_0 = 6$: $f(6) = 6 \cdot 18^2 - 1000 = 944$ in $f'(6) = 18 \cdot (-6) = -108$. Dobimo $x_1 = 6 + \frac{944}{108} \approx 14{,}74$, kar je skoraj na robu pločevine. Naslednji korak da $x_2 \approx -18{,}1$, in približki bežijo stran od obeh rešitev.
3. Bisekcija: $f(0) = -1000 < 0$ in $f(5) = 1000 > 0$, zato je ničla v $[0;\ 5]$.
4. Potrebujemo $\frac{5}{2^n} < 0{,}01$, torej $2^n > 500$. Ker je $2^8 = 256$ in $2^9 = 512$, je najmanjši $n = 9$, z dolžino $L_9 \approx 0{,}0098\,\mathrm{cm}$.
5. Primerjava: Newton iz dobrega začetka $x_0 = 1$ je enako natančnost dosegel v $2$ korakih.
6. Odgovor: Matic se moti dvakrat. Newtonova metoda ni vedno uspešna, saj je odvisna od začetka. Bisekcija potrebuje $9$ korakov, a uspe zagotovo. Dobra praksa je, da z nekaj koraki bisekcije najdeš dober $x_0$, nato pa preklopiš na Newtona.

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
- **Bisekcija obdrži napačno polovico.** Učenec vidi $f(a) < 0$ in $f(c) < 0$ ter obdrži $[a;\ c]$, »ker sta oba negativna«. Ničla pa je tam, kjer se predznak **zamenja**, torej v $[c;\ b]$. Primerjaj predznaka krajišč, ne vrednosti s sredino.
- **»Enak predznak v krajiščih pomeni, da ničle ni.«** Za $x^2 - 2$ na $[-2;\ 2]$ je $f(-2) = f(2) = 2$, ničli pa sta dve. Enak predznak pomeni le, da bisekcije na tem intervalu ne moreš začeti. Interval razdeli ali si nariši graf.
- **»Newton vedno konvergira k najbližji ničli.«** Iz $x_0 = 6$ je škatla odbežala, iz $x_0 = 5$ smo delili z nič. Kvadratična hitrost velja le dovolj blizu ničle; daleč od nje lahko metoda skače ali se oddalji.
- **Napačen odvod.** Pri $x(30-2x)^2$ kdo zapiše $f'(x) = 2(30-2x)$ in pozabi pravilo za produkt. Metoda potem konvergira počasi ali nikamor. Odvod preveri z numerično oceno $\frac{f(x+h) - f(x)}{h}$ za majhen $h$.

## Povzetek

- Nelinearno enačbo zapišemo kot $f(x) = 0$ in iščemo ničlo $r$.
- Bisekcija: začni z $[a;\ b]$, kjer $f$ zamenja predznak, in ga razpolavljaj; $L_n = \frac{b-a}{2^n}$. Konvergira vedno (za zvezno $f$), linearno s $q = \frac{1}{2}$.
- Newtonova metoda: $x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$. Blizu ničle konvergira kvadratično ($e_{n+1} \approx C\,e_n^2$, število pravilnih decimalk se podvoji).
- Newton lahko odpove: $f'(x_n) = 0$ ali slab začetek. Varna strategija: bisekcija za začetek, Newton za natančnost.
- Ustavitev: $L_n < \varepsilon$ oziroma $|x_{n+1} - x_n| < \varepsilon$, plus omejitev števila korakov.

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
4. Napake $1$, $0{,}028$, $0{,}0000006$: eksponent se še več kot podvoji. Tu je $f''(10) = 0$, zato je $C = 0$ in napaka pade celo hitreje kot kvadratno. Pri ploščici ($C \approx 0{,}35$) smo videli čisto kvadratično konvergenco.

V preglednici to narediš s tremi stolpci: $x_n$, $f(x_n)$ in $f'(x_n)$; v naslednji vrstici je $x_{n+1}$ formula, ki bere celice iz prejšnje vrstice. Formulo samo kopiraš navzdol.

## Drugače: Kot zgodba

V delavnici delata Bara in Nik. Oba morata najti, kje natančno izrezati vogale.

Bara je previdna. Ve, da je pri $0\,\mathrm{cm}$ škatla premajhna, pri $5\,\mathrm{cm}$ pa prevelika. Zato poskusi na sredini, pri $2{,}5\,\mathrm{cm}$. Prevelika. Zdaj ve, da je prava mera med $0$ in $2{,}5$. Spet poskusi na sredini. Vsak poskus ji prepolovi negotovost. Po devetih poskusih ima mero na desetinko milimetra natančno. Nikoli se ni zmotila, le malo je trajalo.

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
:::
