---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

*(višja raven) Gaussovo metodo in sisteme linearnih neenačb matura preverja samo na višji ravni.*

Prvi prizor: po košarkarski tekmi trenerka prebere statistiko. Ekipa je zadela $30$ košev in dosegla $58$ točk. Košev za dve točki je bilo dvakrat toliko kot prostih metov. Koliko je bilo trojk?

Drugi prizor: ista trenerka sestavlja tedenski načrt. Skupaj ima največ $10$ ur. Teka mora biti več kot vaj za moč, moči pa vsaj $2$ uri. Koliko ur česa lahko načrtuje?

Na videz gre za dve različni vprašanji. V resnici imata isto jedro: **več pogojev mora veljati hkrati**. Pri tekmi so pogoji enačbe in odgovor je en sam. Pri načrtu so pogoji neenačbe in odgovorov je cel kos ravnine. Obe orodji spoznaš tu.

## Razlaga

**1. En sistem do konca.** Naj bo $x$ število trojk, $y$ število košev za dve točki in $z$ število prostih metov. Iz statistike zapišemo:

$$\begin{cases} x + y + z = 30 & (1)\\ 3x + 2y + z = 58 & (2)\\ y - 2z = 0 & (3) \end{cases}$$

Neznanke odstranjujemo eno za drugo.

- Iz (2) odstranimo $x$: od nje odštejemo trikratnik (1). Dobimo $-y - 2z = -32$, po množenju z $-1$ pa $y + 2z = 32$. To je nova (2).
- Enačba (3) $x$ že nima. Odstranimo še $y$: od (3) odštejemo novo (2). Dobimo $-4z = -32$.

Sistem ima zdaj **trikotno obliko**: zadnja enačba ima eno neznanko, predzadnja dve, prva tri. V shemi koeficientov se pod diagonalo pokažejo same ničle:

| $x$ | $y$ | $z$ | desna stran |
|---|---|---|---|
| $1$ | $1$ | $1$ | $30$ |
| $0$ | $1$ | $2$ | $32$ |
| $0$ | $0$ | $-4$ | $-32$ |

Zdaj gremo od spodaj navzgor (**vstavljanje nazaj**): $z = 8$, nato $y = 32 - 2 \cdot 8 = 16$, nato $x = 30 - 16 - 8 = 6$. Preizkus v prvotnih enačbah: $6 + 16 + 8 = 30$, $3 \cdot 6 + 2 \cdot 16 + 8 = 58$, $16 - 2 \cdot 8 = 0$. Ekipa je zadela $6$ trojk.

**2. Gaussova eliminacijska metoda.** Kar smo naredili, posplošimo na vsak sistem treh linearnih enačb s tremi neznankami:

1. Na prvo mesto postavi enačbo, v kateri je $x$ (najlažje s koeficientom $1$ ali $-1$).
2. S prvo enačbo odstrani $x$ iz druge in tretje.
3. Z novo drugo enačbo odstrani $y$ iz tretje.
4. Iz zadnje enačbe izračunaj $z$, nato vstavljaj navzgor.
5. Naredi preizkus v **prvotnih** enačbah.

Dovoljeni koraki so: zamenjava vrstnega reda enačb, množenje cele enačbe s številom, različnim od $0$, in prištevanje večkratnika ene enačbe drugi. To so **ekvivalentne preoblike**: množica rešitev ostane enaka.

:::premisli
Recimo, da ti pri tretjem koraku izgineta $y$ in $z$ hkrati in ostane $0 = 7$. Kaj to pove o sistemu?
---
Sistem nima rešitve. Nobena trojka $(x, y, z)$ ne naredi $0$ enako $7$, ekvivalentne preoblike pa rešitev ne izgubljajo. Isto si videl pri dveh vzporednih premicah ($0 = 2$).
:::

**3. Ko izgine zadnja neznanka.** Vzemimo sistem

$$\begin{cases} x + y + z = 3\\ x + 2y + 3z = 5\\ 2x + 3y + 4z = 9 \end{cases}$$

Iz druge odštejemo prvo, iz tretje dvakratnik prve: dobimo $y + 2z = 2$ in $y + 2z = 3$. Razlika teh dveh je $0 = 1$, kar ne velja. **Sistem nima rešitve.**

Če bi bila na desni strani tretje enačbe namesto $9$ število $8$, bi dobili $y + 2z = 2$ dvakrat in na koncu $0 = 0$. Ta vrstica vedno velja, torej ne določa ničesar. **Rešitev je neskončno.** Eno neznanko izberemo prosto, $z = t$, in izrazimo ostali: $y = 2 - 2t$, $x = 3 - y - z = 1 + t$. Za $t = 0$ dobimo $(1, 2, 0)$, za $t = 1$ pa $(2, 0, 1)$; obe trojki prestaneta preizkus.

**4. Sistem neenačb z eno neznanko.** Vsako neenačbo rešimo posebej. Rešitev sistema so števila, ki ustrezajo **vsem** neenačbam, torej **presek** intervalov. Za $x \ge -1$ in $x < 3$ je to $[-1, 3)$:

:::risba premica
opis: Številska premica od −3 do 5. Debelo je označen interval od −1 do 3. Pri −1 je polna pika (−1 je rešitev), pri 3 prazna pika (3 ni rešitev).
od: -3
do: 5
interval: -1 .. 3 | presek
točka: -1 | | modra
točka: 3 | | prazna
:::

Če se intervala ne prekrivata, sistem nima rešitve.

**5. Neenačba z dvema neznankama.** Premica $y = 2$ razdeli ravnino na dva dela. Točke z $y > 2$ so nad njo, točke z $y < 2$ pod njo. Vsak del imenujemo **polravnina**, premica je njen **rob**. Splošno: rešitev neenačbe $ax + by < c$ je polravnina, ki jo omejuje premica $ax + by = c$.

Katero polravnino vzamemo, odloči **testna točka**, ki ni na premici, najraje $(0, 0)$. Če ustreza neenačbi, je rešitev polravnina s to točko, sicer druga. Rob rišemo **polno**, če velja $\le$ ali $\ge$ (točke na robu so rešitve), in **črtkano** pri $<$ ali $>$ (niso rešitve).

:::premisli
Ali točka $(0, 0)$ leži v polravnini $2x + 3y > 6$? Kaj iz tega sklepaš o rešitvi?
---
Ne leži: $0 > 6$ ne velja. Rešitev je polravnina, ki izhodišča ne vsebuje, torej tista nad premico $2x + 3y = 6$. Rob je črtkan, ker je neenačba stroga.
:::

**6. Sistem neenačb z dvema neznankama.** Vsaka neenačba da polravnino. Rešitev sistema je njihov **presek**: območje, ki je pobarvano pri vseh hkrati. Pogosto je to trikotnik ali drug večkotnik. Na koncu izberemo točko v notranjosti in jo vstavimo v vse neenačbe; to je preizkus.

## Rešeni primeri

### Primer 1 (lažji): sistem neenačb z eno neznanko

Reši sistem neenačb $3x - 2 \le 10$ in $5 - 2x < 9$ ter rešitev nariši na številski premici.

**Podatki:** neenačbi $3x - 2 \le 10$ in $5 - 2x < 9$
**Iščemo:** množico vseh $x$, ki ustrezajo obema

:::formula
Rešitev sistema je presek rešitev posameznih neenačb. Pri deljenju z negativnim številom se znak obrne.
:::

**Rešitev:**

1. Prva: $3x \le 12$, torej $x \le 4$ (delimo s pozitivnim $3$, znak ostane).
2. Druga: $-2x < 4$. Delimo z $-2$, zato se znak obrne: $x > -2$.
3. Presek: števila, večja od $-2$ in hkrati največ $4$.

:::risba premica
opis: Številska premica od −4 do 6. Debelo je označen interval od −2 do 4. Pri −2 je prazna pika, pri 4 polna pika.
od: -4
do: 6
interval: -2 .. 4 | rešitev
točka: -2 | | prazna
točka: 4 | | modra
:::

4. Preizkus s $x = 0$: $-2 \le 10$ in $5 < 9$, obe veljata.
5. Odgovor: rešitev je interval $(-2, 4]$.

### Primer 2: Gaussova metoda

Reši sistem z Gaussovo metodo in naredi preizkus.

$$\begin{cases} x + y + z = 6 & (1)\\ 2x - y + z = 3 & (2)\\ x + 2y - z = 2 & (3) \end{cases}$$

**Podatki:** tri linearne enačbe z neznankami $x$, $y$, $z$
**Iščemo:** trojko $(x, y, z)$

:::formula
Odstrani $x$ iz (2) in (3), nato $y$ iz tretje; vstavljaj nazaj od $z$ proti $x$.
:::

**Rešitev:**

1. (2) $- 2 \cdot$ (1): $-3y - z = -9$. Prva enačba ima pri $x$ koeficient $1$, zato je odštevanje preprosto.
2. (3) $-$ (1): $y - 2z = -4$.
3. Novi enačbi zamenjamo, da je pri $y$ koeficient $1$: $y - 2z = -4$ in $-3y - z = -9$.
4. Drugi prištejemo trikratnik prve: $-7z = -21$, torej $z = 3$.
5. Nazaj: $y = -4 + 2 \cdot 3 = 2$, $x = 6 - 2 - 3 = 1$.
6. Preizkus: $1 + 2 + 3 = 6$, $2 \cdot 1 - 2 + 3 = 3$, $1 + 2 \cdot 2 - 3 = 2$.
7. Odgovor: rešitev je $(x, y, z) = (1, 2, 3)$.

### Primer 3 (težji): trenerkin načrt

Trenerka načrtuje $x$ ur teka in $y$ ur vaj za moč na teden. Skupaj ima največ $10$ ur, teka mora biti več kot moči, moči pa vsaj $2$ uri. Nariši območje vseh možnih načrtov. Ali ustreza načrt s $4$ urami teka in $4$ urami moči? Koliko največ celih ur moči lahko načrtuje?

**Podatki:** $x + y \le 10$, $y < x$, $y \ge 2$
**Iščemo:** območje rešitev, preverbo točke $(4, 4)$ in največji celi $y$

:::formula
Vsaka neenačba je polravnina; rob polno pri $\le$, $\ge$ in črtkano pri $<$, $>$. Rešitev je presek.
:::

**Rešitev:**

1. Robovi: $y = 2$ (polno), $y = x$ (črtkano), $x + y = 10$ (polno).
2. Testne točke: $(0, 0)$ da $0 \le 10$, torej območje pod premico $x + y = 10$. Za $y < x$ vzamemo $(1, 0)$: $0 < 1$, torej pod premico $y = x$. Pri $y \ge 2$ je območje nad premico.
3. Oglišča: $y = 2$ in $x + y = 10$ se sekata v $(8, 2)$; $y = x$ in $x + y = 10$ v $(5, 5)$; $y = 2$ in $y = x$ v $(2, 2)$. Oglišči na črtkanem robu nista rešitvi.

:::risba graf
opis: Koordinatni sistem, x so ure teka od 0 do 10, y ure moči od 0 do 8. Polna premica y = 2, polna premica x + y = 10 in črtkana premica y = x. Območje rešitev je trikotnik z oglišči (2, 2), (8, 2) in (5, 5); njegova stranica na premici y = x je črtkana. Točka T(5, 3) leži v trikotniku, točka (4, 4) leži na črtkanem robu.
x: 0 .. 10 | 1 | x
y: 0 .. 8 | 1 | y
enako: da
f: 2 | modra
f: 10 - x | oranžna | 2 .. 10
f: x | rdeča črtkano | 0 .. 2
f: x | rdeča črtkano | 5 .. 8
lik: 2; 2 -> 8; 2 -> 5; 5 | zelena črtkano
črta: 2; 2 -> 8; 2 | modra
črta: 8; 2 -> 5; 5 | oranžna
točka: 5; 3 | T(5, 3) | desno
točka: 4; 4 | (4, 4) | levo
napis: 9; 1,5 | y = 2 | sredina | modra
napis: 3; 7,6 | x + y = 10 | desno | oranžna
napis: 7,2; 7,6 | y = x | levo | rdeča
:::

4. Preizkus s $T(5, 3)$: $5 + 3 = 8 \le 10$, $3 < 5$, $3 \ge 2$. Vse velja, območje je pravo.
5. Načrt $(4, 4)$: $4 < 4$ ne velja, točka je na črtkanem robu. Ne ustreza.
6. Največji $y$: pri $y = 5$ bi moralo veljati $x > 5$ in $x \le 5$, kar ni mogoče. Pri $y = 4$ ustrezata $x = 5$ in $x = 6$.
7. Odgovor: območje je trikotnik na risbi brez črtkane stranice; načrt $(4, 4)$ ne ustreza; največ so $4$ ure moči (na primer s $5$ ali $6$ urami teka).

### Primer 4 – zdaj ti

Reši sistem $x - y + z = 1$, $2x + y - z = 5$, $4x - y + z = 7$.

**Podatki:** tri linearne enačbe z neznankami $x$, $y$, $z$
**Iščemo:** vse rešitve

:::formula
Gaussova metoda; vrstica $0 = 0$ pomeni neskončno rešitev, vrstica $0 = c$ s $c \neq 0$ nobene.
:::

**Rešitev:**

1. Druga minus dvakratnik prve: $3y - 3z = 3$, torej $y - z = 1$.
2. Tretja minus štirikratnik prve: $3y - 3z = 3$, torej spet $y - z = 1$.
3. Novi tretji odštej novo drugo, razloži dobljeno vrstico in zapiši rešitev:

:::premisli
Kaj dobiš in kakšna je rešitev?
---
Dobiš $0 = 0$, zato je rešitev neskončno. Izberemo $z = t$: $y = 1 + t$ in $x = 1 + y - z = 2$. Rešitve so $(2, 1 + t, t)$ za vsak realni $t$; na primer $(2, 1, 0)$ in $(2, 2, 1)$. Preizkus z $(2, 1, 0)$: $2 - 1 + 0 = 1$, $4 + 1 - 0 = 5$, $8 - 1 + 0 = 7$.
:::

## Pogoste napake

- **Desna stran ostane pozabljena.** Pri (2) $- 3 \cdot$ (1) nekdo pomnoži s $3$ le levo stran. Enačba je celota: trikratnik prve je $3x + 3y + 3z = 90$, odštejemo vse, tudi $90$.
- **Izločanje z napačno enačbo.** Ko je $x$ že odstranjen iz druge in tretje, nekdo $y$ iz tretje odstrani s pomočjo prve enačbe. Tako se $x$ vrne. Za drugi krog uporabi novo drugo enačbo, ki $x$ nima.
- **»$0 = 0$ pomeni, da je rešitev $0$.«** Vrstica $0 = 0$ ne pove ničesar o neznankah; pomeni neskončno rešitev. Rešitve ni pri $0 = c$, kjer je $c \neq 0$.
- **Unija namesto preseka.** Pri $x > -2$ in $x \le 4$ ni rešitev »vsa števila«. Sistem zahteva oba pogoja hkrati, zato vzamemo presek $(-2, 4]$.
- **Polravnina na pamet, rob na pamet.** Pri $2x - y > 4$ znak $>$ ne pomeni »nad premico« (izrazi $y$ in znak se obrne). Vedno uporabi testno točko. Rob pri $<$ in $>$ je črtkan, ker njegove točke niso rešitve.

## Povzetek

- Gaussova metoda: z ekvivalentnimi preoblikami spravi sistem v trikotno obliko (odstrani $x$ iz 2. in 3. enačbe, nato $y$ iz 3.), nato vstavljaj nazaj od $z$ do $x$ in naredi preizkus.
- Vrstica $0 = c$ ($c \neq 0$): sistem nima rešitve. Vrstica $0 = 0$: neskončno rešitev, eno neznanko izberemo kot parameter $t$.
- Sistem neenačb z eno neznanko: reši vsako, rešitev je presek intervalov (številska premica).
- Neenačba z dvema neznankama: polravnina z robom $ax + by = c$; stran izbereš s testno točko; rob polno pri $\le$, $\ge$, črtkano pri $<$, $>$.
- Sistem neenačb z dvema neznankama: presek polravnin; preizkus s točko v notranjosti.

## Drugače: Z analogijo

Gaussova metoda je kot spust po stopnicah in vzpon nazaj. Navzdol na vsaki stopnici pustiš eno neznanko: prva enačba ima tri, druga dve, tretja eno. Na dnu je račun čisto preprost. Nato greš navzgor in na vsako stopnico prineseš, kar že veš.

Sistem neenačb je kot več zaporednih sit na vhodu v dvorano. Prvo sito prepusti le tiste z vstopnico, drugo le tiste z ustreznim letom rojstva, tretje le člane kluba. V dvorani so samo tisti, ki so prešli **vsa** sita. To je presek.

## Drugače: Bolj natančno

Zakaj Gaussova metoda ne izgubi ali doda rešitev? Če trojka ustreza enačbama (1) in (2), ustreza tudi (2) $- k \cdot$ (1). Obratno: iz (1) in nove (2) dobimo nazaj staro (2) $=$ nova (2) $+ k \cdot$ (1). Stari in novi sistem imata zato isto množico rešitev.

Geometrijsko vsaka linearna enačba s tremi neznankami opisuje ravnino v prostoru. Rešitev sistema je skupna točka treh ravnin. Ravnine se lahko sekajo v eni točki (ena rešitev), nimajo skupne točke (vrstica $0 = c$) ali imajo skupno premico (vrstica $0 = 0$, rešitve z enim parametrom).

Testna točka deluje, ker ima izraz $ax + by - c$ na vsej polravnini isti predznak. Če bi ga zamenjal, bi moral vmes doseči $0$, to pa se zgodi le na premici.

## Preveri se

? Kateri sistem je že v trikotni obliki?
- $x + y + z = 4$, $2x + y = 3$, $x - z = 1$
~ Vsaka enačba ima še $x$, zato zadnja ne vsebuje ene same neznanke.
+ $x + y + z = 4$, $y - z = 1$, $2z = 6$
- $x = 1$, $x + y = 3$, $x + y + z = 6$
~ Tudi ta sistem se hitro reši, a je oblika obrnjena: Gaussova metoda konča s tem, da ima zadnja enačba samo $z$.
- $x + y = 4$, $y + z = 1$, $x + z = 6$
~ Vsaka enačba ima dve neznanki, nobena pa ne same $z$; to še ni trikotna oblika.
> V trikotni obliki ima zadnja enačba eno neznanko, predzadnja dve, prva tri. Iz $2z = 6$ takoj sledi $z = 3$.

? Razvrsti korake Gaussove metode.
1. Na prvo mesto postavi enačbo z $x$, najraje s koeficientom $1$.
2. S prvo enačbo odstrani $x$ iz druge in tretje.
3. Z novo drugo enačbo odstrani $y$ iz tretje.
4. Iz zadnje enačbe izračunaj $z$ in vstavljaj navzgor.
5. Naredi preizkus v prvotnih enačbah.
> Najprej trikotna oblika, nato vstavljanje nazaj od $z$ do $x$ in na koncu preizkus.

? Na risbi je območje rešitev sistema $y \ge 1$, $y < x$, $x \le 5$. Kaj se zgodi, če neenačbo $y < x$ zamenjamo z $y \le x$?
:::risba graf
opis: Koordinatni sistem od 0 do 6 na obeh oseh. Polna premica y = 1, polna navpična premica x = 5 in črtkana premica y = x. Območje rešitev je trikotnik z oglišči (1, 1), (5, 1) in (5, 5); stranica na premici y = x je črtkana. Točka (3, 3) leži na črtkani stranici.
x: 0 .. 6 | 1 | x
y: 0 .. 6 | 1 | y
enako: da
f: 1 | modra
črta: 5; 0 -> 5; 6 | oranžna
f: x | rdeča črtkano | 0 .. 1
f: x | rdeča črtkano | 5 .. 6
lik: 1; 1 -> 5; 1 -> 5; 5 | zelena črtkano
črta: 1; 1 -> 5; 1 | modra
črta: 5; 1 -> 5; 5 | oranžna
točka: 3; 3 | (3, 3) | levo
napis: 5,5; 1,5 | y = 1 | sredina | modra
napis: 5; 0,5 | x = 5 | levo | oranžna
napis: 2; 3,5 | y = x | levo | rdeča
:::
- Območje se preseli na drugo stran premice $y = x$.
~ Stran določa smer neenačbe (»manjše«), ta pa ostane ista; enačaj vpliva le na rob. Testna točka $(3, 1)$ ustreza obema.
+ Trikotnik ostane isti, črtkana stranica postane polna in točke na njej, npr. $(3, 3)$, postanejo rešitve.
- Nič se ne spremeni, ker robne točke niso pomembne.
~ Pomembne so: pri $\le$ je točka $(3, 3)$ rešitev, pri $<$ ni.
- Rešitev postane cela polravnina $y \le x$.
~ Ostala dva pogoja še vedno veljata; rešitev je presek vseh treh.
> Pri $\le$ so točke na premici $y = x$ rešitve, zato rob rišemo polno. Stran polravnine ostane enaka.

? (brez računala) Reši sistem $x + y + z = 4$, $x + 2y + 3z = 9$, $x - y + 2z = 4$. Koliko je $z$?
= 2
~ 3,6 | Pri drugi minus prva si odštel le levi strani; desno je $9 - 4 = 5$.
~ 2,8 | Pri tretji minus prva si pozabil odšteti desni strani; desno je $4 - 4 = 0$.
~ 1 | To je $x$ (ali $y$). Vprašanje sprašuje po $z$.
> Druga minus prva: $y + 2z = 5$. Tretja minus prva: $-2y + z = 0$. Novi tretji prištejemo dvakratnik nove druge: $5z = 10$, $z = 2$; nato $y = 1$, $x = 1$.

? Koliko celih števil reši sistem $2x + 1 > -5$ in $4 - x \ge 1$?
= 6
~ 7 | Šteješ tudi $-3$, a pri $x > -3$ ta ni rešitev.
~ 5 | Izpustil si $3$, a pri $x \le 3$ ta je rešitev.
> $2x > -6$ da $x > -3$; $-x \ge -3$ da $x \le 3$ (znak se obrne). Presek je $(-3, 3]$: cela števila $-2, -1, 0, 1, 2, 3$, torej $6$.

:::simboli
x | prva neznanka (pri tekmi število trojk, v načrtu ure teka) | |
y | druga neznanka (pri tekmi koši za dve točki, v načrtu ure moči) | |
z | tretja neznanka (pri tekmi prosti meti) | |
t | parameter (prosto izbrano realno število) | | | pri neskončno mnogo rešitvah
a, b | koeficienta pri $x$ in $y$ v neenačbi | |
c | desna stran neenačbe | |
:::

<<RACUN
resi: x+y+z=30, 3*x+2*y+z=58, y-2*z=0 | x, y, z | x=6, y=16, z=8
resi: x+y+z=3, x+2*y+3*z=5, 2*x+3*y+4*z=9 | x, y, z | none
enako: 2*(1+t)+3*(2-2*t)+4*t | 8
neenacba: 3*x-2<=10 | x | (-oo, 4]
neenacba: 5-2*x<9 | x | (-2, oo)
resi: x+y+z=6, 2*x-y+z=3, x+2*y-z=2 | x, y, z | x=1, y=2, z=3
resi: y=2, x+y=10 | x, y | x=8, y=2
resi: y=x, x+y=10 | x, y | x=5, y=5
enako: 2-(1+t)+t | 1
enako: 2*2+(1+t)-t | 5
enako: 4*2-(1+t)+t | 7
resi: x+y+z=4, x+2*y+3*z=9, x-y+2*z=4 | x, y, z | x=1, y=1, z=2
neenacba: 2*x+1>-5 | x | (-3, oo)
neenacba: 4-x>=1 | x | (-oo, 3]
>>
