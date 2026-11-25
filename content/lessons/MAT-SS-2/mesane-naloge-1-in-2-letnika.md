---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Na začetku 17. stoletja je škotski matematik John Napier objavil tabele logaritmov. Potrebovali so jih astronomi in pomorščaki. Njihovi računi so bili polni množenj dolgih števil, logaritem pa je množenje spremenil v seštevanje. Johannes Kepler je nove tabele kmalu uporabil pri računanju tirov planetov.

Danes isto orodje uporablja farmacevt. Zdravilo se v krvi razgrajuje: v vsakih $6$ urah se količina zdravila razpolovi. Takoj po odmerku je koncentracija $80\,\mathrm{mg/L}$, zdravilo pa učinkuje le nad $10\,\mathrm{mg/L}$. Čez koliko ur mora bolnik dobiti naslednji odmerek?

V tem vprašanju se srečajo tri poglavja: **eksponentna funkcija** (model razgradnje), **eksponentna enačba** (kdaj doseže mejo) in **neenačba** (kdaj je pod mejo). Tako so sestavljene tudi maturitetne naloge. Nikjer ne piše »uporabi logaritem«; orodje moraš prepoznati sam.

## Razlaga

**Najprej rešimo primer iz farmacije.** Zapišimo, kaj se dogaja vsakih $6$ ur:

| čas $t$ [h] | $c$ [mg/L] |
|---|---|
| $0$ | $80$ |
| $6$ | $40$ |
| $12$ | $20$ |
| $18$ | $10$ |
| $24$ | $5$ |

V vsakem koraku se koncentracija pomnoži z $\frac{1}{2}$. Po $t$ urah je takih korakov $\frac{t}{6}$, zato je

$$c(t) = 80 \cdot \left(\frac{1}{2}\right)^{t/6}$$

To je **eksponentna funkcija**: spremenljivka $t$ je v eksponentu. Na grafu pada vse počasneje, a nikoli do nič.

:::risba graf
opis: Graf koncentracije zdravila c v odvisnosti od časa t od 0 do 24 ur. Krivulja začne pri 80 in se vsakih 6 ur razpolovi: točke (6; 40), (12; 20), (18; 10). Vodoravna črtkana premica pri c = 10 je meja učinkovanja; krivulja jo seka pri t = 18.
x: 0 .. 24 | 6 | t [h]
y: 0 .. 90 | 10 | c [mg/L]
f: 80*0,5^(x/6) | modra | 0 .. 24
črta: 0; 10 -> 24; 10 | oranžna črtkano
točka: 6; 40 | (6; 40) | desno
točka: 12; 20 | (12; 20) | nad
točka: 18; 10 | (18; 10) | nad
:::

Vprašanje »kdaj pade na $10$« zdaj prevedemo v enačbo: $80 \cdot \left(\frac{1}{2}\right)^{t/6} = 10$. Delimo z $80$ in dobimo $\left(\frac{1}{2}\right)^{t/6} = \frac{1}{8} = \left(\frac{1}{2}\right)^{3}$. Osnovi sta enaki, zato sta enaka tudi eksponenta: $\frac{t}{6} = 3$ in $t = 18\,\mathrm{h}$. Ker funkcija pada, je koncentracija za $t > 18$ pod mejo. Naslednji odmerek torej pride po $18$ urah.

:::premisli
Kaj bi se spremenilo, če bi bila meja učinkovanja $12\,\mathrm{mg/L}$ namesto $10\,\mathrm{mg/L}$? Bi enačbo še rešil brez računala?
---
Ne. Enačba bi bila $\left(\frac{1}{2}\right)^{t/6} = \frac{12}{80} = 0{,}15$, števila $0{,}15$ pa ne znamo zapisati kot potenco števila $\frac{1}{2}$. Tu nastopi logaritem: $\frac{t}{6} = \log_{1/2} 0{,}15$, torej $t \approx 16{,}4\,\mathrm{h}$. Prav take enačbe rešujemo z logaritmi.
:::

**Od primera do postopka.** Kaj smo naredili? Vsak korak se ponovi pri vsaki mešani nalogi:

1. **Prepoznaj orodje iz besed.** »Razpolovi se vsakih $6$ ur« pomeni eksponentno funkcijo. »Kdaj pade na« pomeni enačbo.
2. **Razstavi verigo.** Najprej model, nato enačba, na koncu odgovor na vprašanje. Vsak člen je ena majhna naloga.
3. **Zapisuj vmesne rezultate.** Funkcijo $c(t)$ smo zapisali, preden smo jo postavili v enačbo. Če se zmotiš kasneje, točke za model že imaš.
4. **Preveri smisel in pogoje.** Čas mora biti pozitiven. Pri logaritmu mora biti izraz pod njim pozitiven, pri sodem korenu nenegativen. Rešitev, ki pogoja ne izpolni, zavržeš.

Najtežji je prvi korak. Pomaga ti ta preglednica za snov 1. in 2. letnika.

| v besedilu | orodje: zapis |
|---|---|
| razpolovi se | eksp. funkcija: $c_0 q^t$ |
| kdaj doseže | logaritem: $\log_q b$ |
| presečišče | enačba: $f = g$ |
| nad mejo | neenačba: $f > M$ |
| največ | teme: $-\frac{b}{2a}$ |
| najmanj | teme: $-\frac{b}{2a}$ |
| koren | potenca: $a^{m/n}$ |
| senca, merilo | podobnost: $a' = ka$ |
| naklon, kot | tangens: $\tan \alpha$ |

:::premisli
Naloga pravi: »Graf funkcije $f(x) = \log_2 (x + 1)$ seka premico $y = 3$.« Kateri dve orodji iz preglednice potrebuješ in zakaj na koncu ne smeš pozabiti pogoja?
---
Orodji sta enačba (»seka« pomeni presečišče) in logaritem. Presečišče grafov je enačba $\log_2 (x + 1) = 3$; logaritem odpraviš po definiciji, $x + 1 = 2^3 = 8$, torej $x = 7$. Pogoj $x + 1 > 0$ tu velja, a pri enačbah, kjer združiš dva logaritma, lahko dobiš rešitev, ki pogoja ne izpolni.
:::

V simulaciji spodaj (Zbirka simulacij za maturo) odpri Eksponentna funkcija in nastavi osnovo med $0$ in $1$. Opazi, da graf pada, a ostane nad osjo $x$; zato enačba $q^t = b$ z negativnim $b$ nima rešitve.

## Rešeni primeri

### Primer 1 (lažji): koren v logaritmu

Izračunaj brez računala $\log_2 \dfrac{8\sqrt{2}}{\sqrt[3]{4}}$. (koreni + potence + logaritem)

**Podatki:** izraz $\log_2 \dfrac{8\sqrt{2}}{\sqrt[3]{4}}$, brez računala
**Iščemo:** vrednost izraza

:::formula
$\sqrt[n]{a^m} = a^{m/n}$, $\;\dfrac{a^r \cdot a^s}{a^u} = a^{r + s - u}$, $\;\log_2 2^r = r$
:::

**Rešitev:**

1. Vsa števila zapišemo kot potence števila $2$, ker je osnova logaritma $2$: $8 = 2^3$, $\sqrt{2} = 2^{1/2}$, $\sqrt[3]{4} = 2^{2/3}$.
2. Pri množenju potenc z isto osnovo eksponente seštejemo, pri deljenju odštejemo: $3 + \frac{1}{2} - \frac{2}{3} = \frac{17}{6}$.
3. Ulomek je torej $2^{17/6}$, logaritem pa vrne eksponent.
4. Odgovor: $\log_2 \dfrac{8\sqrt{2}}{\sqrt[3]{4}} = \dfrac{17}{6}$.

### Primer 2: eksponentna enačba, ki je skrita kvadratna

Reši enačbo $4^x - 3 \cdot 2^{x+1} + 8 = 0$. (eksponentne enačbe + kvadratna enačba)

**Podatki:** enačba $4^x - 3 \cdot 2^{x+1} + 8 = 0$
**Iščemo:** vse realne rešitve $x$

:::formula
$4^x = \left(2^x\right)^2$, $\;2^{x+1} = 2 \cdot 2^x$, nova neznanka $s = 2^x > 0$
:::

**Rešitev:**

1. Vse potence izrazimo z $2^x$: $\left(2^x\right)^2 - 6 \cdot 2^x + 8 = 0$.
2. Uvedemo $s = 2^x$ in dobimo kvadratno enačbo $s^2 - 6s + 8 = 0$, ki se razstavi v $(s - 2)(s - 4) = 0$.
3. Rešitvi sta $s_1 = 2$ in $s_2 = 4$; obe sta pozitivni, zato obe ustrezata pogoju $2^x > 0$.
4. Vrnemo se k $x$: iz $2^x = 2$ sledi $x = 1$, iz $2^x = 4$ sledi $x = 2$.
5. Preizkus: $4 - 12 + 8 = 0$ in $16 - 24 + 8 = 0$.
6. Odgovor: rešitvi enačbe sta $x = 1$ in $x = 2$.

### Primer 3 (težji): kako hitro telo izloča zdravilo

Bolnik dobi zdravilo v enkratnem odmerku. Telo vsako uro izloči enak odstotek zdravila, ki je še v krvi. Po $8$ urah ostane v krvi še četrtina začetne količine. Koliko odstotkov zdravila telo izloči v eni uri? Po koliko urah ostane le še $10\,\%$ začetne količine? Odstotek zaokroži na eno decimalko, čas na desetinko ure. (eksponentna funkcija + koreni + logaritem)

**Podatki:** delež po $8$ urah $\frac{1}{4}$; vsako uro se količina pomnoži z istim $q$
**Iščemo:** odstotek, ki ga telo izloči v eni uri; čas $t$, ko ostane $10\,\%$

:::formula
$z(t) = z_0 \cdot q^t$, enačba $q^8 = \dfrac{1}{4}$, nato $q^t = 0{,}1$
:::

**Rešitev:**

1. Model: po vsaki uri ostane delež $q$, po $8$ urah $q^8$. Zato velja enačba $q^8 = \frac{1}{4}$.
2. Ker je $q > 0$, je $q = \sqrt[8]{\frac{1}{4}} = \sqrt[8]{2^{-2}} = 2^{-1/4} \approx 0{,}8409$. Vsako uro torej ostane $84{,}09\,\%$ zdravila.
3. Izločeni del: $100\,\% - 84{,}09\,\% = 15{,}91\,\% \approx 15{,}9\,\%$.
4. Drugo vprašanje vodi do enačbe $q^t = 0{,}1$. Neznanka je v eksponentu, zato obe strani logaritmiramo. Iz $t \cdot \log q = \log 0{,}1$ sledi $t = \dfrac{\log 0{,}1}{\log q}$.
5. Z nezaokroženim $q$ dobimo $t \approx 13{,}3\,\mathrm{h}$. Smisel: $10\,\%$ je manj kot četrtina, zato mora biti čas daljši od $8$ ur.
6. Odgovor: telo v eni uri izloči približno $15{,}9\,\%$ zdravila; $10\,\%$ ga ostane po približno $13{,}3$ urah.

### Primer 4 – zdaj ti: logaritemska enačba s pogojem

Reši enačbo $\log_2 x + \log_2 (x - 2) = 3$. (logaritemske enačbe + kvadratna enačba)

**Podatki:** enačba $\log_2 x + \log_2 (x - 2) = 3$
**Iščemo:** rešitve $x$, ki izpolnijo pogoje

:::formula
$\log_a A + \log_a B = \log_a (A \cdot B)$; $\;\log_a C = c \Rightarrow C = a^c$
:::

**Rešitev:**

1. Pogoja: $x > 0$ in $x - 2 > 0$, skupaj $x > 2$.
2. Logaritma združimo: $\log_2 \big(x(x - 2)\big) = 3$.
3. Po definiciji logaritma dobimo enačbo $x(x - 2) = 8$ oziroma $x^2 - 2x - 8 = 0$.
4. Kvadratno enačbo reši sam in preveri, katera rešitev izpolni pogoj iz 1. koraka.

:::premisli
Katere so rešitve enačbe?
---
$x^2 - 2x - 8 = (x - 4)(x + 2) = 0$ da $x = 4$ ali $x = -2$. Pogoju $x > 2$ ustreza le $x = 4$. Preizkus: $\log_2 4 + \log_2 2 = 2 + 1 = 3$.
:::

## Pogoste napake

- **»Logaritem vsote je vsota logaritmov.«** $\log_2 (4 + 4) = 3$, $\log_2 4 + \log_2 4 = 4$. Pravilo velja za produkt: $\log_a (AB) = \log_a A + \log_a B$. Vsote pod logaritmom ne razbiješ.
- **Pozabljeni pogoji.** Ko dva logaritma združiš v enega, se definicijsko območje razširi. Zato lahko dobiš tujo rešitev, kot $x = -2$ v Primeru 4. Pogoje zapiši na začetku in jih na koncu preveri.
- **Napačen faktor pri odstotkih.** »Vsako uro izloči $20\,\%$« ne pomeni $q = 0{,}2$, ampak $q = 0{,}8$: ostane $80\,\%$. S $q = 0{,}2$ bi po eni uri ostala petina.
- **Koren vsote.** $\sqrt{a^2 + b^2}$ ni $a + b$. Koren in potenca se lepo razumeta z množenjem in deljenjem, ne s seštevanjem.
- **Prezgodnje zaokroževanje.** Če v Primeru 3 vzameš $q \approx 0{,}84$, dobiš $t \approx 13{,}2\,\mathrm{h}$ namesto $13{,}3\,\mathrm{h}$. Vmesne rezultate hrani v računalu, zaokroži šele odgovor.

## Povzetek

- **Mešana naloga** je veriga orodij iz več poglavij; vsak člen reši posebej.

**Štirje koraki:**

1. Prepoznaj orodje iz besed.
2. Razstavi verigo.
3. Zapisuj vmesne rezultate.
4. Preveri smisel in pogoje.

- **Razpolovitev** ali stalni odstotek: eksponentna funkcija $c_0 \cdot q^t$.
- Odstotek upadanja $p$ da faktor $q = 1 - \frac{p}{100}$.
- »Kdaj« vodi do enačbe $q^t = b$ in logaritma.

**Korene** zapiši kot potence z ulomljenim eksponentom:

$$\sqrt[n]{a^m} = a^{m/n}$$

- Enačbo z $a^{2x}$ in $a^x$ prevedeš na kvadratno z novo neznanko $s = a^x > 0$.
- Pri logaritemskih enačbah zapiši pogoje na začetku in z njimi izloči tuje rešitve.

## Ponovitev

**Formule**
- upadanje za $p\,\%$ na enoto časa: $c_0 \cdot q^t$, $\;q = 1 - \frac{p}{100}$ (na pamet)
- $q^t = b \Rightarrow t \cdot \log q = \log b$ (na pamet)
- $\sqrt[n]{a^m} = a^{m/n}$ (na pamet)
- $\log_a (AB) = \log_a A + \log_a B$ (na pamet)
- $a^{2x}$ in $a^x$: nova neznanka $s = a^x > 0$ (na pamet)

**Postopek**
1. Iz besed prepoznaj orodje: odstotek, logaritem, teme, enačba.
2. Nalogo razstavi na verigo manjših korakov.
3. Pri logaritmih na začetku zapiši pogoje.
4. Vmesne rezultate zapisuj in jih hrani v računalu.
5. Preveri smisel odgovora in pogoje.

**Pazi na**
- Vsote pod logaritmom ne razbiješ; pravilo velja za produkt.
- Ko združiš logaritme, preveri pogoje, sicer ostane tuja rešitev.
- »Izloči $20\,\%$« pomeni $q = 0{,}8$, ne $0{,}2$.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Dana je funkcija $f(x) = \log_3 (x + 1) - 2$. Zapišite enačbo navpične asimptote, izračunajte ničlo in presečišče grafa z osjo $y$. (logaritemska funkcija + transformacije grafov + logaritemska enačba)

**Rešitev:**

1. Graf funkcije $\log_3 x$ je premaknjen za $1$ v levo in za $2$ navzdol, zato je asimptota $x = -1$.
2. Ničla: $\log_3 (x + 1) = 2$ da $x + 1 = 3^2 = 9$, torej $x = 8$; pogoj $x > -1$ velja.
3. Presečišče z osjo $y$: $f(0) = \log_3 1 - 2 = -2$, točka $(0, -2)$.
4. Odgovor: asimptota $x = -1$, ničla $x = 8$, presečišče z osjo $y$ je $(0, -2)$.

**Točkovanje:** 1 točka za asimptoto $x = -1$, 1 točka za ničlo $8$, 1 točka za presečišče $(0, -2)$.

### Naloga 2: krajša strukturirana naloga, 6 točk, pola 2 (z računalom)

Klančina pred zdravstvenim domom premaga višinsko razliko $0{,}45\,\mathrm{m}$ na vodoravni razdalji $6\,\mathrm{m}$. (kotne funkcije + Pitagorov izrek + podobnost)

a) Izračunajte naklonski kot klančine v stopinjah, na dve decimalki. (2 točki)

b) Izračunajte dolžino klančine, na centimeter natančno. (2 točki)

c) Na vodoravni razdalji $2\,\mathrm{m}$ od spodnjega konca je pod klančino navpičen podporni steber. Kako visok je? (2 točki)

**Rešitev:**

1. a) Višina in vodoravna razdalja sta kateti, zato $\tan \alpha = \frac{0{,}45}{6} = 0{,}075$ in $\alpha \approx 4{,}29^\circ$.
2. b) Klančina je hipotenuza: $d = \sqrt{6^2 + 0{,}45^2} = \sqrt{36{,}2025} \approx 6{,}02\,\mathrm{m}$.
3. c) Steber, klančina in tla tvorijo trikotnik, podoben celemu (skupen kot $\alpha$, oba pravokotna). Koeficient podobnosti je $\frac{2}{6} = \frac{1}{3}$, zato je steber visok $\frac{0{,}45}{3} = 0{,}15\,\mathrm{m}$.
4. Odgovor: naklonski kot je $4{,}29^\circ$, klančina je dolga $6{,}02\,\mathrm{m}$, steber je visok $0{,}15\,\mathrm{m}$.

**Točkovanje:** a) 1 točka za $\tan \alpha = 0{,}075$ in 1 točka za $4{,}29^\circ$; b) 1 točka za Pitagorov izrek z danimi podatki in 1 točka za $6{,}02\,\mathrm{m}$; c) 1 točka za sorazmerje ali $\tan \alpha \cdot 2$ in 1 točka za $0{,}15\,\mathrm{m}$.

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Dana je funkcija $f(x) = -x^2 + 2x + 8$ in funkcija $h(x) = \log_2 f(x)$. (kvadratna funkcija + kvadratna neenačba + logaritemska funkcija + logaritemska enačba)

a) Izračunajte ničli in teme funkcije $f$. (2 točki)

b) Rešite neenačbo $f(x) \ge 0$. (2 točki)

c) Zapišite definicijsko območje funkcije $h$. (1 točka)

d) Rešite enačbo $h(x) = 3$. (3 točke)

e) Utemeljite, da ima $h$ največjo vrednost, in jo izračunajte. (2 točki)

**Rešitev:**

1. a) $-x^2 + 2x + 8 = -(x - 4)(x + 2)$, ničli sta $x_1 = -2$ in $x_2 = 4$. Abscisa temena je $p = -\frac{2}{2 \cdot (-1)} = 1$, $q = f(1) = 9$, teme $T(1, 9)$.
2. b) Parabola je obrnjena navzdol, nad osjo $x$ je med ničlama: $x \in [-2, 4]$.
3. c) Pod logaritmom mora biti strogo pozitivno število, zato $D_h = (-2, 4)$.
4. d) $\log_2 f(x) = 3$ da $f(x) = 8$, torej $-x^2 + 2x = 0$ oziroma $x(2 - x) = 0$.
5. d) Rešitvi $x = 0$ in $x = 2$ ležita v $D_h$, zato obe veljata.
6. e) Funkcija $\log_2$ strogo narašča, zato je $h$ največja tam, kjer je $f$ največja, v temenu pri $x = 1$.
7. e) $h(1) = \log_2 9 = 2 \log_2 3$.
8. Odgovor: ničli $-2$ in $4$, teme $T(1, 9)$; $f(x) \ge 0$ za $x \in [-2, 4]$; $D_h = (-2, 4)$; rešitvi $0$ in $2$; največja vrednost $h$ je $2\log_2 3$ pri $x = 1$.

**Točkovanje:** a) 1 točka za ničli, 1 točka za teme; b) 1 točka za ugotovitev, da je $f$ nenegativna med ničlama, 1 točka za interval $[-2, 4]$; c) 1 točka za odprti interval $(-2, 4)$; d) 1 točka za $f(x) = 8$, 1 točka za rešitvi $0$ in $2$, 1 točka za preverbo pogoja; e) 1 točka za utemeljitev z naraščanjem logaritma, 1 točka za $\log_2 9$.

### Ustno vprašanje 1

:::premisli
Definiraj logaritem in naštej pravila za logaritem produkta, količnika in potence. Zakaj pri logaritemskih enačbah preverjamo pogoje?
---
$\log_a x = y$ natanko tedaj, ko je $a^y = x$, pri čemer je $a > 0$, $a \ne 1$ in $x > 0$. Pravila: $\log_a (xy) = \log_a x + \log_a y$, $\log_a \frac{x}{y} = \log_a x - \log_a y$, $\log_a x^r = r \log_a x$. Ko enačbo preoblikujemo s temi pravili, se lahko definicijsko območje razširi, na primer $\log_2 x + \log_2 (x - 2)$ zahteva $x > 2$, $\log_2 \big(x(x - 2)\big)$ pa le $x(x - 2) > 0$. Zato rešitve preverimo v začetnih pogojih.
:::

### Ustno vprašanje 2

:::premisli
Opiši eksponentno funkcijo $f(x) = a^x$: definicijsko območje, zalogo vrednosti, naraščanje in asimptoto. Kako je povezana z logaritemsko funkcijo?
---
Za $a > 0$, $a \ne 1$ je $D_f = \mathbb{R}$ in $Z_f = (0, \infty)$. Za $a > 1$ strogo narašča, za $0 < a < 1$ strogo pada. Graf gre skozi $(0, 1)$, os $x$ je vodoravna asimptota. Kot preslikava iz $\mathbb{R}$ na $(0, \infty)$ je bijektivna, njena inverzna funkcija je $\log_a x$; grafa sta simetrična glede na premico $y = x$.
:::

### Ustno vprašanje 3

:::premisli
Zakaj je vrednost $\sin \alpha$ v pravokotnem trikotniku odvisna le od kota $\alpha$, ne od velikosti trikotnika?
---
Vsi pravokotni trikotniki z ostrim kotom $\alpha$ se ujemajo v dveh kotih, zato so po izreku KK podobni. V podobnih trikotnikih so razmerja ustreznih stranic enaka, torej je tudi razmerje $\frac{a}{c} = \sin \alpha$ v vseh enako.
:::

## Drugače: Z analogijo

Mešana naloga je kot obisk pri zdravniku. Bolnik pove simptome (besedilo naloge). Zdravnik prepozna bolezen (orodje): »razpolovi se« je kot vročina pri gripi, znak, ki skoraj vedno kaže v isto smer. Nato predpiše zdravljenje po korakih (veriga računov) in na koncu naredi kontrolni pregled (preizkus in pogoji).

Dober zdravnik ne začne zdraviti, preden postavi diagnozo. Tudi ti ne začni računati, preden veš, katero orodje naloga kliče. In kot zdravnik zapiše izvid, zapiši vmesni rezultat: kdor bere za tabo, vidi, kje si bil.

## Drugače: Bolj natančno

Zakaj sploh nastanejo tuje rešitve? Ker nekateri koraki niso **ekvivalentni**: nova enačba ima lahko več rešitev kot stara.

- **Združevanje logaritmov.** Enačba $\log_2 x + \log_2 (x - 2) = 3$ je definirana za $x > 2$. Enačba $\log_2 \big(x(x - 2)\big) = 3$ je definirana že za $x(x - 2) > 0$, torej tudi za $x < 0$. Zato se pojavi $x = -2$.
- **Kvadriranje (višja raven).** Iz $\sqrt{x + 2} = x$ s kvadriranjem dobiš $x + 2 = x^2$, ki ima rešitvi $2$ in $-1$. Toda $\sqrt{1} = 1 \ne -1$, zato $-1$ ni rešitev.
- **Nova neznanka.** Pri $s = 2^x$ je $s > 0$. Če bi kvadratna enačba dala negativen $s$, ga zavržeš, ker $2^x$ ni nikoli negativen.

Ekvivalentni so koraki, ki jih lahko obrneš: prištevanje istega izraza, množenje z neničelnim številom, logaritmiranje obeh pozitivnih strani. Pri vseh drugih korakih rešitev preveri.

## Preveri se

? Kateri izraz se razlikuje od ostalih treh?
- $\log_2 (4 + 4)$
~ $\log_2 (4 + 4) = \log_2 8 = 3$, tako kot ostala dva. Vsote pod logaritmom ne razbiješ na vsoto logaritmov.
+ $\log_2 4 + \log_2 4$
- $\sqrt[3]{27}$
~ $\sqrt[3]{27} = 3$, ker je $3^3 = 27$. Enak je ostalima dvema.
- $9^{\frac{1}{2}}$
~ Ulomljeni eksponent $\frac{1}{2}$ pomeni kvadratni koren: $9^{\frac{1}{2}} = 3$.
> $\log_2 4 + \log_2 4 = 2 + 2 = 4$, ostali trije izrazi so enaki $3$. Kdor misli, da je $\log_2 (4 + 4)$ enako $\log_2 4 + \log_2 4$, se tu ujame: pravilo velja za produkt, ne za vsoto.

? Reši enačbo $2^{x + 1} = \sqrt{32}$ (brez računala).
= 1,5 | 0,01
~ 2,5 | To je vrednost $x + 1$. Na koncu odštej še $1$.
~ 4 | Koren si izpustil: $\sqrt{32} = 2^{5/2}$, ne $2^5$.
> $\sqrt{32} = 2^{5/2}$, zato $x + 1 = \frac{5}{2}$ in $x = \frac{3}{2} = 1{,}5$.

? Graf kaže koncentracijo zdravila v krvi po enem odmerku; zdravilo učinkuje nad $10\,\mathrm{mg/L}$. Zdravnik začetni odmerek podvoji. Za koliko ur se podaljša čas, ko zdravilo učinkuje?
:::risba graf
opis: Graf koncentracije zdravila c v odvisnosti od časa t od 0 do 24 ur. Krivulja začne pri 80 mg/L, pri t = 6 je 40, pri t = 12 je 20, pri t = 18 je 10. Črtkana vodoravna premica pri c = 10 je meja učinkovanja.
x: 0 .. 24 | 6 | t [h]
y: 0 .. 90 | 10 | c [mg/L]
f: 80*0,5^(x/6) | modra | 0 .. 24
črta: 0; 10 -> 24; 10 | oranžna črtkano
točka: 6; 40 | (6; 40) | desno
točka: 12; 20 | (12; 20) | nad
:::
= 6 h | 0
~ 18 | Toliko časa zdravilo učinkuje pri prvotnem odmerku, a podvojen odmerek časa ne podvoji. Iz $160$ pride do $80$ po enem razpolovnem času, od tam naprej je vse enako kot prej.
~ 24 | To je ves čas učinkovanja pri dvojnem odmerku. Vprašanje je, za koliko se čas podaljša: $24 - 18$.
~ 36 | Podvojen odmerek ne podvoji časa. Iz $160$ pride do $80$ po enem razpolovnem času, od tam naprej je vse enako kot prej.
> Z grafa: koncentracija se razpolovi v $6$ urah. Dvojni odmerek $160\,\mathrm{mg/L}$ pade na $80\,\mathrm{mg/L}$ v $6$ urah, nato poteka enako kot prej. Iz $160 \cdot \left(\frac{1}{2}\right)^{t/6} = 10$ dobiš $t = 24\,\mathrm{h}$ namesto $18\,\mathrm{h}$.

? Dijak rešuje $\log_2 (x + 3) + \log_2 (x - 3) = 4$. Kateri korak je napačen?
- 1. Pogoj: $x > 3$.
~ Pogoj je pravilen: oba izraza pod logaritmom morata biti pozitivna, $x - 3 > 0$ zahteva $x > 3$.
- 2. $\log_2 \big((x + 3)(x - 3)\big) = 4$
~ Vsota logaritmov z isto osnovo je logaritem produkta, ta korak je pravilen.
+ 3. $x^2 - 9 = 8$
- 4. Rešitvi sta $x = \pm\sqrt{17}$, velja le $\sqrt{17}$.
~ Ta korak pravilno sledi iz 3. koraka in pravilno uporabi pogoj. Napaka je prej.
> Po definiciji logaritma je $(x + 3)(x - 3) = 2^4 = 16$, ne $8$ (to bi bilo $2^3$ ali $2 \cdot 4$). Pravilno: $x^2 = 25$, $x = 5$; $x = -5$ ne izpolni pogoja.

? Razvrsti korake reševanja mešane naloge, kot si jih spoznal v tej lekciji.
1. Iz besed prepoznaj orodje (»razpolovi se« pomeni eksponentno funkcijo).
2. Zapiši model ali enačbo in pogoje.
3. Reši člen za členom in zapiši vmesne rezultate.
4. Preveri rešitve v pogojih in smisel rezultata.
5. Zapiši odgovor v stavku z enoto.
> Najprej diagnoza (orodje), nato zapis s pogoji, račun po korakih, preverba in odgovor. Pogoje zapišeš pred računom, preveriš pa jih na koncu.

:::simboli
c | koncentracija zdravila v krvi | c(t) = 80 \cdot \left(\frac{1}{2}\right)^{t/6} | mg/L
t | čas po odmerku | | h
c_0 | začetna koncentracija | | mg/L
q | faktor v eni časovni enoti | q = 1 - \frac{p}{100} | – | pri razpolovitvi $q = \frac{1}{2}$; v Nalogi 3 je $q$ ordinata temena
p | odstotek, ki izgine v eni enoti; abscisa temena parabole | | | pri temenu $p = -\frac{b}{2a}$
b | dana vrednost na desni strani enačbe; koeficient pri $x$ | | | v $-\frac{b}{2a}$
M | meja (na primer učinkovanja) | | |
f, g, h | funkcije | | |
d | dolžina klančine | | m |
x | neznanka, spremenljivka | | |
a | osnova potence ali koeficient pri $x^2$ | | |
n, m | stopnja korena, eksponent | | | v $\sqrt[n]{a^m}$
r, s, u | eksponenti | | | v Primeru 2 je $s = 2^x$
k | koeficient podobnosti | k = \frac{a'}{a} | – |
a' | stranica slike | | |
\alpha | ostri kot, naklonski kot | | ° |
A, B, C | izrazi pod logaritmom | | |
z_0, z | začetna in trenutna količina zdravila | z(t) = z_0 \cdot q^t | mg |
:::

<<RACUN
vrednost: 80*(1/2)^(18/6) | 10
resi: 80*(1/2)^(t/6)=10 | t | 18
resi: 80*(1/2)^(t/6)=12 | t | 16.4
vrednost: log(8*sqrt(2)/4^(1/3), 2) | 17/6
vrednost: 3+1/2-2/3 | 17/6
resi: t^2-6*t+8=0 | t | 2, 4
resi: 4^x-3*2^(x+1)+8=0 | x | 1, 2
vrednost: (1/4)^(1/8) | 0.8409
vrednost: 100-100*(1/4)^(1/8) | 15.9
vrednost: log(0.1)/log((1/4)^(1/8)) | 13.3
vrednost: log(0.1)/log(0.84) | 13.2
resi: x^2-2*x-8=0 | x | -2, 4
resi: log(x, 2)+log(x-2, 2)=3 | x | 4
resi: log(x+1, 2)=3 | x | 7
resi: 2^(x+1)=sqrt(32) | x | 3/2
resi: 160*(1/2)^(t/6)=10 | t | 24
resi: log(x+3, 2)+log(x-3, 2)=4 | x | 5
resi: log(x+1, 3)-2=0 | x | 8
vrednost: log(1, 3)-2 | -2
vrednost: atan(0.45/6)*180/pi | 4.29
vrednost: sqrt(6^2+0.45^2) | 6.02
vrednost: 0.45*2/6 | 0.15
resi: -x^2+2*x+8=0 | x | -2, 4
neenacba: -x^2+2*x+8>=0 | x | [-2, 4]
resi: log(-x^2+2*x+8, 2)=3 | x | 0, 2
vrednost: -1+2+8 | 9
resi: sqrt(x+2)=x | x | 2
>>
