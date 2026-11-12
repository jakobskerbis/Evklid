---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi igračo na baterije, na primer majhen model marsovskega roverja, in ob njej na tla položi tračni meter. Ko rover že enakomerno pelje ob metru, prijatelj zažene štoparico. Ob $2\,\text{s}$ in ob $6\,\text{s}$ zapišeta, pri kateri oznaki je rover: $50\,\text{cm}$ in $110\,\text{cm}$.

Samo dve meritvi. Pa vendar lahko z njima odgovoriš na vprašanja, ki jih nista izmerila. Kje je bil rover, ko se je štoparica zagnala? Kje bo po $10$ sekundah? Ali ga bo drug rover kdaj dohitel? Dovolj je, da iz dveh točk dobiš **enačbo premice** in znaš prepoznati **vzporedni premici**.

Enako sklepamo pri pravem roverju na Marsu. Če vozi enakomerno, iz dveh sporočil o njegovi legi izračunamo, kje bo čez nekaj minut.

## Razlaga

**1. Vzorec v meritvah.** Prijatelj je meril še ob $4\,\text{s}$ in ob $8\,\text{s}$. Čas označimo z $x$, lego roverja ob metru pa z $y$.

| čas $x$ (s) | lega $y$ (cm) |
|---|---|
| $2$ | $50$ |
| $4$ | $80$ |
| $6$ | $110$ |
| $8$ | $140$ |

V vsakih $2$ sekundah se lega poveča za $30\,\text{cm}$, torej v vsaki sekundi za $15\,\text{cm}$. Izberi katerikoli dve vrstici in deli spremembo lege s spremembo časa:

- od $2\,\text{s}$ do $6\,\text{s}$: $\dfrac{110 - 50}{6 - 2} = \dfrac{60}{4} = 15$,
- od $4\,\text{s}$ do $8\,\text{s}$: $\dfrac{140 - 80}{8 - 4} = \dfrac{60}{4} = 15$,
- od $2\,\text{s}$ do $8\,\text{s}$: $\dfrac{140 - 50}{8 - 2} = \dfrac{90}{6} = 15$.

Vsakič dobiš $15$. To je že znani **smerni koeficient** $k$: pove, za koliko se $y$ spremeni, ko se $x$ poveča za $1$.

**2. Pravilo za smerni koeficient.** Naj točki $A(x_1, y_1)$ in $B(x_2, y_2)$ ležita na isti premici in naj bo $x_1 \ne x_2$. Potem je

$$k = \frac{y_2 - y_1}{x_2 - x_1}$$

Števec pove, za koliko se premaknemo gor (ali dol), imenovalec, za koliko v desno.

:::premisli
Ali dobiš drug $k$, če za prvo točko vzameš $(6, 110)$, za drugo pa $(2, 50)$? Napovej, nato izračunaj.
---
Ne. $\dfrac{50 - 110}{2 - 6} = \dfrac{-60}{-4} = 15$. Obe razliki zamenjata predznak, količnik ostane enak. Paziti moraš le, da v števcu in v imenovalcu odštevaš v **istem** vrstnem redu.
:::

Če je $x_1 = x_2$, bi delili z $0$. Taka premica je navpična, zapišemo jo kot $x = x_1$. Ni graf linearne funkcije in nima smernega koeficienta.

**3. Začetna vrednost $n$.** Kje je bil rover ob $0\,\text{s}$? Od $2\,\text{s}$ gremo $2$ sekundi nazaj, torej $50 - 2 \cdot 15 = 20$. Isto dobiš, če v $y = kx + n$ vstaviš $k = 15$ in točko $(2, 50)$: $50 = 15 \cdot 2 + n$, torej $n = 20$. Enačba je $y = 15x + 20$. Preizkus s točko $(8, 140)$: $15 \cdot 8 + 20 = 140$. Število $n$ je torej vrednost $y$ pri $x = 0$, zato mu pravimo začetna vrednost.

**4. Postopek za enačbo premice skozi dve točki.**

1. Izračunaj $k = \dfrac{y_2 - y_1}{x_2 - x_1}$.
2. Vstavi $k$ in koordinati prve točke v $y = kx + n$ ter izračunaj $n$.
3. Zapiši $y = kx + n$.
4. Preveri z drugo točko.

**5. Vzporedni premici.** Na tla postavimo še dva roverja. Rover B pelje enako hitro kot A, a je ob $0\,\text{s}$ pri oznaki $50\,\text{cm}$: $y = 15x + 50$. Rover C je ob $0\,\text{s}$ pri oznaki $0$, pelje pa hitreje: $y = 20x$.

:::risba graf
opis: Graf lege treh roverjev. Vodoravna os je čas od 0 do 10 sekund, navpična lega od 0 do 200 centimetrov. Premica A gre skozi (0; 20) in (8; 140). Premica B je vzporedna premici A, 30 cm višje, in gre skozi (0; 50). Premica C je bolj strma, gre skozi izhodišče in seka premico A v točki (4; 80).
x: 0 .. 10 | 1 | x (s)
y: 0 .. 200 | 20 | y (cm)
f: 15*x + 20 | modra
f: 15*x + 50 | oranžna črtkano
f: 20*x | zelena
točka: 4; 80 | (4; 80) | desno
napis: 8; 140 | A | pod desno
napis: 2; 80 | B | nad levo
napis: 9; 180 | C | desno
podnapis: A in B imata enak k = 15 in sta vzporedni; C ima k = 20 in seka A.
:::

Rover B je pri vsakem $x$ za $15x + 50 - (15x + 20) = 30$ centimetrov pred A. Razlika se ne spreminja, zato se nikoli ne srečata: premici sta **vzporedni**. Rover C pa vsako sekundo pridobi $5\,\text{cm}$. Dohiti A, ko je $20x = 15x + 20$, torej pri $x = 4$, pri oznaki $80\,\text{cm}$.

Pravilo: premici $y = k_1 x + n_1$ in $y = k_2 x + n_2$ sta vzporedni natanko tedaj, ko imata enak smerni koeficient:

$$k_1 = k_2$$

Če je pri tem $n_1 \ne n_2$, sta premici različni in nimata nobene skupne točke. Če je še $n_1 = n_2$, je to ena in ista premica (premici sovpadata); tudi sovpadajoči premici štejemo za vzporedni. Premici z različnima smernima koeficientoma se sekata v natanko eni točki.

:::premisli
Rover D pelje s hitrostjo $15\,\text{cm/s}$ in je ob $0\,\text{s}$ pri oznaki $0\,\text{cm}$. Ali bo kdaj srečal rover A? Če ne, za koliko centimetrov bo ves čas zadaj?
---
Ne bo ga. Premica D je $y = 15x$: ima enak $k$ kot A, a drug $n$. Premici sta vzporedni, D je ves čas $20\,\text{cm}$ za A.
:::

**6. Premica skozi točko, vzporedna dani premici.** Smerni koeficient prepišeš z dane premice, $n$ pa izračunaš tako, da v $y = kx + n$ vstaviš dano točko.

V simulaciji spodaj »Premica skozi dve točki« povleci točki $A$ in $B$ tako, da je $B$ za $2$ desno in za $4$ višje od $A$. Nato obe točki premakni, a ohrani ta premik med njima: $k = 2$ se ne spremeni. Izberi še »Vzporednica« in opazuj, da ima premica skozi $C$ vedno enak $k$ kot premica $AB$.

## Rešeni primeri

### Primer 1 (lažji): vzporednost

Katera od premic $y = 3x - 2$, $y = -3x + 1$, $y = 3x + 4$ je vzporedna premici $y = 3x + 1$?

**Podatki:** dana premica $y = 3x + 1$; premice $y = 3x - 2$, $y = -3x + 1$ in $y = 3x + 4$
**Iščemo:** premice, vzporedne dani premici

:::formula
Premici sta vzporedni, kadar imata enak smerni koeficient: $k_1 = k_2$.
:::

**Rešitev:**

1. Vzporednost določa samo smerni koeficient. Dana premica ima $k = 3$.
2. Premica $y = 3x - 2$ ima $k = 3$, zato je vzporedna.
3. Premica $y = -3x + 1$ ima $k = -3$. To ni enako $3$, zato ni vzporedna. Ker ima enak $n$, dano premico seka na osi $y$, v točki $(0, 1)$.
4. Premica $y = 3x + 4$ ima $k = 3$, zato je vzporedna.
5. Odgovor: dani premici sta vzporedni premici $y = 3x - 2$ in $y = 3x + 4$.

### Primer 2: premica skozi dve točki

Poišči enačbo premice skozi točki $A(-2, 5)$ in $B(4, -1)$.

**Podatki:** $A(-2, 5)$, $B(4, -1)$
**Iščemo:** enačbo premice $y = kx + n$

:::formula
$k = \dfrac{y_2 - y_1}{x_2 - x_1}$, nato $n$ iz $y_1 = k x_1 + n$
:::

**Rešitev:**

1. Smerni koeficient: $k = \dfrac{-1 - 5}{4 - (-2)} = \dfrac{-6}{6} = -1$. Pazi na odštevanje negativnega števila: $4 - (-2) = 6$.
2. Začetna vrednost: vstavimo $A(-2, 5)$, ker je to prva točka: $5 = (-1) \cdot (-2) + n$, torej $5 = 2 + n$ in $n = 3$.
3. Enačba: $y = -x + 3$.
4. Preizkus s točko $B$: $-4 + 3 = -1$ ✓.
5. Odgovor: premica skozi $A$ in $B$ ima enačbo $y = -x + 3$.

### Primer 3 (težji): rover na Marsu

Rover stoji nekaj metrov od pristajalnega modula. Ob času $t = 0$ spelje in se enakomerno oddaljuje od modula. Po $2$ minutah je $7\,\text{m}$ od modula, po $6$ minutah pa $15\,\text{m}$. Koliko metrov od modula je stal? Čez koliko minut bo $25\,\text{m}$ od modula?

**Podatki:** $t_1 = 2\,\text{min}$, $d_1 = 7\,\text{m}$; $t_2 = 6\,\text{min}$, $d_2 = 15\,\text{m}$; gibanje je enakomerno; ciljna razdalja $25\,\text{m}$
**Iščemo:** razdaljo $n$ ob $t = 0$ in čas $t$, ko je $d = 25\,\text{m}$

:::formula
$k = \dfrac{d_2 - d_1}{t_2 - t_1}$ in $d = kt + n$
:::

**Rešitev:**

1. Čas je neodvisna količina, razdalja odvisna. Meritvi sta točki $(2, 7)$ in $(6, 15)$.
2. $k = \dfrac{15 - 7}{6 - 2} = \dfrac{8}{4} = 2$. Ker je vožnja enakomerna, se rover vsako minuto oddalji za enakih $2\,\text{m}$.
3. Vstavimo prvo točko: $7 = 2 \cdot 2 + n$, torej $n = 3$. Ob $t = 0$ je bil rover $3\,\text{m}$ od modula.
4. Enačba je $d = 2t + 3$. Preizkus: $2 \cdot 6 + 3 = 15$ ✓.
5. Zdaj je znan $d = 25$, iščemo $t$: $25 = 2t + 3$, torej $2t = 22$ in $t = 11$.
6. Odgovor: rover je stal $3\,\text{m}$ od modula; $25\,\text{m}$ daleč bo po $11$ minutah.

### Primer 4 – zdaj ti

Poišči enačbo premice $q$, ki je vzporedna premici $p\colon y = -x + 3$ iz primera 2 in poteka skozi točko $C(1, 4)$.

**Podatki:** $p\colon y = -x + 3$, $C(1, 4)$
**Iščemo:** enačbo premice $q$

:::formula
Vzporednica ima enak smerni koeficient kot $p$; $n$ dobimo iz $y = kx + n$ z vstavljeno točko $C$.
:::

**Rešitev:**

1. Premica $q$ je vzporedna premici $p$, zato ima $k = -1$.
2. Vstavi $k = -1$ in $C(1, 4)$ v $y = kx + n$, izračunaj $n$ in zapiši enačbo. Nato preveri.

:::premisli
Kolikšen je $n$ in kakšna je enačba premice $q$?
---
$4 = -1 \cdot 1 + n$, torej $n = 5$ in $q\colon y = -x + 5$. Preizkus: $-1 + 5 = 4$ ✓. Smerna koeficienta sta enaka, $n$ pa različna, zato $q$ in $p$ nista ista premica.
:::

## Pogoste napake

- **Obrnjen ulomek.** Kdor računa $\dfrac{x_2 - x_1}{y_2 - y_1}$, dobi pri $(3, 10)$ in $(7, 22)$ namesto $k = 3$ število $\dfrac{1}{3}$. Spremembo $y$ (gor) vedno pišeš v števec, spremembo $x$ (desno) v imenovalec.
- **Mešan vrstni red.** V števcu $y_2 - y_1$, v imenovalcu pa $x_1 - x_2$: dobiš nasprotni predznak. Obe razliki začni pri isti točki.
- **Pozabljeno deljenje.** Razlika $y$ sama ni smerni koeficient: pove, za koliko se $y$ spremeni na celi poti v desno, ne na korak $1$. Deliti moraš z razliko $x$.
- **$n$ je kar koordinata $y$ točke.** Pri točki $(1, 5)$ to ni res: $n$ je vrednost $y$ pri $x = 0$. Velja le, če točka leži na osi $y$, na primer $(0, 4)$. Sicer $n$ izračunaj z vstavitvijo.
- **Vzporedni = enak $n$.** Vzporedni premici imata enak $k$. Pri enakem $n$ in različnem $k$ se premici sekata na osi $y$.

## Povzetek

- Premica: $y = kx + n$, kjer je $k$ smerni koeficient, $n$ pa začetna vrednost.
- Skozi točki $A(x_1, y_1)$ in $B(x_2, y_2)$ z $x_1 \ne x_2$ je $k = \dfrac{y_2 - y_1}{x_2 - x_1}$; pri $x_1 = x_2$ je premica navpična, $x = x_1$.
- $n$ dobiš tako, da v $y = kx + n$ vstaviš koordinati ene točke. Rezultat preveri z drugo točko.
- Premici sta vzporedni natanko tedaj, ko imata enak smerni koeficient: $k_1 = k_2$. Pri različnih $n$ nimata skupne točke, pri enakih sovpadata.
- Vzporednica skozi dano točko: $k$ prepišeš, $n$ izračunaš iz točke.

## Drugače: Korak za korakom s številkami

Poišči enačbo premice skozi $A(2, 1)$ in $B(6, 9)$.

| Korak | Kaj naredimo | Račun |
|---|---|---|
| 1 | Razlika $y$ | $9 - 1 = 8$ |
| 2 | Razlika $x$ | $6 - 2 = 4$ |
| 3 | Smerni koeficient | $k = 8 : 4 = 2$ |
| 4 | Vstavimo $A$ in $k$ | $1 = 2 \cdot 2 + n$ |
| 5 | Izračunamo $n$ | $1 = 4 + n$, torej $n = -3$ |
| 6 | Enačba | $y = 2x - 3$ |
| 7 | Preverimo $B$ | $2 \cdot 6 - 3 = 9$ ✓ |

Vzporedna premica skozi $C(0, 4)$ ima $k = 2$ in ker je $C$ na osi $y$, je $n = 4$. Torej $y = 2x + 4$.

## Drugače: Kot zgodba

V nadzornem centru vesoljske agencije Ana in Bor spremljata dve sondi, ki letita stran od Zemlje. V tej zgodbi obe letita enakomerno. Za sondo A že imata enačbo $d = 40t + 10$, kjer je $d$ razdalja v tisočih kilometrov, $t$ pa čas v urah. Za sondo B imata samo dve meritvi: po $1$ uri je $70$ tisoč km daleč, po $3$ urah $150$ tisoč km.

»B je zdaj dlje, a jo bo A dohitela,« ugiba Ana. Bor računa. Smerni koeficient za B je $\dfrac{150 - 70}{3 - 1} = \dfrac{80}{2} = 40$, enako kot pri A. Iz $70 = 40 \cdot 1 + n$ dobi $n = 30$, torej $d = 40t + 30$.

»Ne bo je,« reče Bor. »Obe se vsako uro oddaljita za $40$ tisoč km. Premici imata enak $k$, zato sta vzporedni. B je ves čas $20$ tisoč km pred A.« Ana obe premici nariše na mrežo in res dobi dve vzporedni črti, ki se nikjer ne srečata.

## Drugače: Bolj natančno

**Zakaj formula za $k$ drži?** Naj bosta točki $A(x_1, y_1)$ in $B(x_2, y_2)$ na premici $y = kx + n$. Potem velja
$$y_1 = kx_1 + n \quad \text{in} \quad y_2 = kx_2 + n.$$
Od druge enačbe odštejemo prvo:
$$y_2 - y_1 = k(x_2 - x_1).$$
Če je $x_2 \ne x_1$, delimo z $x_2 - x_1$ in dobimo
$$k = \frac{y_2 - y_1}{x_2 - x_1}.$$

**Zakaj sta premici z enakim $k$ in različnima $n$ vzporedni?** Skupne točke bi imeli pri tistem $x$, kjer sta vrednosti enaki: $kx + n_1 = kx + n_2$. Odštejemo $kx$ in dobimo $n_1 = n_2$. To je protislovje, če je $n_1 \ne n_2$, zato skupne točke ni. Če pa je $n_1 = n_2$, sta premici ena in ista.

## Preveri se

? Katera tabela točk pripada premici, ki je vzporedna premici $y = 2x + 1$ in ni ista premica?
- $(0, 1)$, $(1, 4)$, $(2, 7)$
~ Vrednost $y$ se tu poveča za $3$ na korak, torej je $k = 3$. Enak začetek $n = 1$ ni dovolj za vzporednost.
+ $(0, 4)$, $(1, 6)$, $(2, 8)$
- $(0, 4)$, $(1, 5)$, $(2, 6)$
~ Tu se $y$ poveča le za $1$ na korak, torej $k = 1$. Točke ležijo na premici, a ta ni vzporedna.
> Pri $(0, 4)$, $(1, 6)$, $(2, 8)$ se $y$ na vsak korak v desno poveča za $2$, torej $k = 2$ kot pri dani premici, $n = 4 \ne 1$. Premica je $y = 2x + 4$.

? Rover je po $3$ minutah $10\,\text{m}$ od modula, po $7$ minutah $22\,\text{m}$. Vozi enakomerno. Približno kako daleč bo po $20$ minutah?
- približno $16\,\text{m}$
~ To dobiš z obrnjenim ulomkom $\dfrac{7 - 3}{22 - 10} = \dfrac{1}{3}$. Sprememba $y$ (razdalje) gre v števec.
+ približno $60\,\text{m}$
- približno $210\,\text{m}$
~ Tu je za $k$ vzeta kar razlika $22 - 10 = 12$, brez deljenja s $7 - 3 = 4$.
> $k = \dfrac{22 - 10}{7 - 3} = 3$, iz $10 = 3 \cdot 3 + n$ je $n = 1$. Po $20$ minutah: $3 \cdot 20 + 1 = 61$, torej približno $60\,\text{m}$.

? Zakaj premici $y = 2x + 3$ in $y = 2x - 1$ nimata nobene skupne točke?
- Ker imata različna $n$.
~ Različna $n$ nista dovolj: $y = x + 3$ in $y = 2x - 1$ imata različna $n$, pa se sekata v točki $(4, 7)$.
- Ker ena leži nad osjo $x$, druga pod njo.
~ Obe premici prečkata os $x$ in imata točke nad njo in pod njo. Lega glede na os ne odloča.
+ Ker se pri vsakem $x$ njuni vrednosti razlikujeta za isto število $4$.
> Pri vsakem $x$ je $(2x + 3) - (2x - 1) = 4$. Razlika ni nikoli $0$, zato skupne točke ni. To velja, ker imata enak $k = 2$.

? Premica skozi točki $(1, 2)$ in $(3, a)$ je vzporedna premici $y = 3x$. Koliko je $a$?
- $5$
~ Smerni koeficient $3$ pove spremembo na korak $1$ v desno. Od $x = 1$ do $x = 3$ sta dva koraka, zato se druga koordinata poveča za $6$, ne za $3$.
- $9$
~ To je točka na premici $y = 3x$. Iskana premica ima enak $k$, a mora iti skozi $(1, 2)$, zato je $n = -1$.
+ $8$
> Vzporedna premica ima $k = 3$, zato velja $\dfrac{a - 2}{3 - 1} = 3$. Torej $a - 2 = 6$ in $a = 8$. Premica je $y = 3x - 1$.

? Sonda A se oddaljuje od Zemlje po pravilu $d = 30t + 5$ ($d$ v tisočih km, $t$ v urah). Sonda B leti enako hitro in je po $2$ urah $80$ tisoč km daleč. Katera enačba velja za B?
- $d = 30t + 80$
~ Za $n$ je vzeta kar razdalja $80$. Ta velja pri $t = 2$, ne pri $t = 0$.
- $d = 40t$
~ To je premo sorazmerje $\dfrac{80}{2} = 40$, kot da bi sonda začela na Zemlji. Enaka hitrost pa pomeni $k = 30$.
+ $d = 30t + 20$
> Enaka hitrost pomeni enak $k = 30$. Iz $80 = 30 \cdot 2 + n$ dobimo $n = 20$. Premici sta vzporedni: B je ves čas $15$ tisoč km pred A.

:::simboli
y | odvisna spremenljivka (ordinata točke) | y = kx + n | |
x | neodvisna spremenljivka (abscisa točke) | | |
k | smerni koeficient premice | k = \frac{y_2 - y_1}{x_2 - x_1} | | pove, za koliko se $y$ spremeni na korak $1$ v desno
n | začetna vrednost (odsek na osi y) | | | vrednost $y$ pri $x = 0$
k_1, k_2 | smerna koeficienta dveh premic | | | enaka pri vzporednih premicah
n_1, n_2 | začetni vrednosti dveh premic | | |
x_1, x_2 | abscisi dveh točk na premici | | | $x_1 \ne x_2$
y_1, y_2 | ordinati dveh točk na premici | | |
d | razdalja (roverja od modula ali sonde od Zemlje) | d = kt + n | | v primeru 3 v m, pri sondah v tisočih km
t | čas od začetka gibanja | | | v primeru 3 v min, pri sondah v h
d_1, d_2 | razdalji pri prvi in drugi meritvi | | m
t_1, t_2 | časa prve in druge meritve | | min
p | dana premica iz primera 2 | y = -x + 3 | |
C | dana točka, skozi katero gre vzporednica | | | $C(1, 4)$
:::
