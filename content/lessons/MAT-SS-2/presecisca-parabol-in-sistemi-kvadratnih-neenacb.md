---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Lara trenira golf na igrišču, ki se dviga v hrib. S kratkim udarcem pošlje žogico navkreber. Trener ji pove, da žogica leti po paraboli $y = -0{,}1x^2 + 2x$, pobočje pa se dviga po premici $y = 0{,}5x$. Pri tem je $x$ vodoravna razdalja od mesta udarca, $y$ pa višina nad njim, oboje v metrih.

Lara mora vedeti, kje bo žogico iskala. Nad igriščem je napeta še jeklenica žičnice, zato jo skrbi tudi, ali jo bo žogica zadela. Obe vprašanji sta v resnici eno: **kje se srečata dva grafa?** Enako vprašanje rešuješ, ko primerjaš dva meta, dve ceni ali dve poti. Ko boš znal poiskati presečišča, boš znal tudi povedati, kje je ena krivulja nad drugo.

## Razlaga

**1. Mamljiva bližnjica.** Lara najprej pomisli: »Žogica pristane, ko je njena višina nič.« Reši enačbo $-0{,}1x^2 + 2x = 0$, razstavi jo v $x(-0{,}1x + 2) = 0$ in dobi $x = 0$ ali $x = 20$. Sklep: žogica pristane $20\,\mathrm{m}$ daleč.

Sklep je napačen. Ničle parabole povedo, kje graf seka os $x$. To bi bila tla le na ravnem igrišču. Tu so tla pobočje: pri $x = 20$ je pobočje visoko že $0{,}5 \cdot 20 = 10\,\mathrm{m}$. Točka $(20, 0)$ leži globoko v hribu.

:::risba graf
opis: Modra parabola je pot žogice y = −0,1x² + 2x, zelena debela premica je pobočje y = 0,5x. Parabola in premica se sekata v izhodišču in v točki (15; 7,5), kjer žogica pristane. Parabola seka os x pri x = 20; tam je pobočje visoko 10 m, kar kaže črtkana navpična daljica od (20, 0) do (20, 10).
x: 0 .. 22 | 2 | x (m)
y: 0 .. 12 | 2 | y (m)
f: -0.1*x^2+2*x | modra | 0 .. 20
f: 0.5*x | zelena debelo | 0 .. 22
črta: 20; 0 -> 20; 10 | siva črtkano
točka: 15; 7,5 | pristanek (15; 7,5) | nad | modra
točka: 20; 0 | ničla (20, 0) | levo | siva
napis: 20; 10 | 10 m | levo | siva
podnapis: Žogica pristane na pobočju, ne v ničli parabole.
:::

**2. Popravek: izenačimo višini.** Žogica pristane tam, kjer je pri istem $x$ enako visoko kot pobočje. Točki, ki leži na obeh grafih, rečemo **presečišče**. Njeni koordinati izpolnita obe enačbi hkrati, zato izenačimo desni strani: enačba $-0{,}1x^2 + 2x = 0{,}5x$. Vse prenesemo na levo, dobimo $-0{,}1x^2 + 1{,}5x = 0$ oziroma $x(-0{,}1x + 1{,}5) = 0$. Rešitvi sta $x = 0$ (mesto udarca) in $x = 15$.

Ordinato izračunamo iz enačbe premice, ker je preprostejša: $0{,}5 \cdot 15 = 7{,}5$. Žogica pristane v točki $(15; 7{,}5)$, torej $15\,\mathrm{m}$ vodoravno in $7{,}5\,\mathrm{m}$ višje od mesta udarca.

**3. Parabola in poljubna premica.** Parabolo $y = ax^2 + bx + c$ in premico $y = kx + n$ presekamo enako. Izenačimo desni strani in vse prenesemo na levo:

$$ax^2 + (b - k)x + (c - n) = 0$$

To je kvadratna enačba. Število njenih rešitev pove njena diskriminanta

$$D = (b - k)^2 - 4a(c - n)$$

| $D$ | presečišča | premica je |
|---|---|---|
| $D > 0$ | dve | sekanta |
| $D = 0$ | eno (dotikališče) | tangenta |
| $D < 0$ | nobenega | mimobežnica |

Pri Lari je $a = -0{,}1$, $b - k = 1{,}5$ in $c - n = 0$, zato je $D = 1{,}5^2 - 0 = 2{,}25 > 0$, zato je pobočje sekanta parabole. Za vsako absciso izračunamo še ordinato, ker je presečišče točka, ne število.

:::premisli
Laro zanima premica $y = 0{,}5x + n$, ki jo dvigujemo (večamo $n$). Kaj se dogaja s presečiščema in z diskriminanto? Napovej.
---
Presečišči se bližata druga drugi. Diskriminanta se manjša: pri Lari je $a = -0{,}1$ in $c = 0$, zato je $D = 2{,}25 - 0{,}4n$. Pri $D = 0$ se presečišči zlijeta v dotikališče (tangenta). Ko premico dvignemo še više, je $D < 0$ in skupnih točk ni več (mimobežnica).
:::

**4. Dve paraboli.** Postopek se ne spremeni. Za paraboli $f(x) = x^2 - 2x - 3$ in $g(x) = -x^2 + 4x + 5$ izenačimo $f(x) = g(x)$ in vse prenesemo na levo: enačba $2x^2 - 6x - 8 = 0$, deljeno z $2$ enačba $x^2 - 3x - 4 = 0$. Razcep $(x - 4)(x + 1) = 0$ da $x = 4$ ali $x = -1$. Ordinati: $f(4) = 5$ in $f(-1) = 0$. Paraboli se sekata v točkah $(-1, 0)$ in $(4, 5)$.

:::risba graf
opis: Modra parabola y = f(x) = x² − 2x − 3 je odprta navzgor, teme ima v (1, −4), ničli pri −1 in 3. Oranžna parabola y = g(x) = −x² + 4x + 5 je odprta navzdol, teme ima v (2, 9), ničli pri −1 in 5. Paraboli se sekata v točkah (−1, 0) in (4, 5).
x: -3 .. 6 | 1 | x
y: -6 .. 10 | 2 | y
f: x^2-2*x-3 | modra | -2,7 .. 4,7
f: -x^2+4*x+5 | oranžna | -1,8 .. 5,8
točka: -1; 0 | (−1, 0) | levo
točka: 4; 5 | (4, 5) | desno
napis: 1; -4 | y = f(x) | pod | modra
napis: 2; 9 | y = g(x) | pod | oranžna
:::

Dve paraboli imata lahko dve, eno ali nobene skupne točke; odloča spet diskriminanta enačbe $f(x) - g(x) = 0$.

:::premisli
Kaj se zgodi, če imata paraboli enak vodilni koeficient, na primer $y = x^2 + 1$ in $y = x^2 - 2x + 5$? Ali sta »vzporedni«?
---
Nista. Pri izenačevanju se člen $x^2$ odšteje in ostane linearna enačba $2x = 4$. Paraboli se sekata v natanko eni točki, $(2, 5)$. Brez presečišča bi bili le, če bi se odštel tudi člen z $x$.
:::

**5. Sistem kvadratnih neenačb (višja raven).** **Sistem neenačb** sestavljajo neenačbe, ki morajo veljati hkrati. Rešitev sistema so števila, ki izpolnijo *vse* neenačbe, torej **presek** rešitev posameznih neenačb. Mamljivo je rešitvi združiti; to bi bila unija in bi dala preveč števil.

Vzemimo sistem $x^2 - 2x - 3 \le 0$ in $-x^2 + 4x + 5 > 0$. To sta neenačbi $f(x) \le 0$ in $g(x) > 0$ za paraboli z zgornje slike. Rešitvi beremo z grafa:

- graf $f$ (modri) je pod osjo $x$ ali na njej med ničlama: $x \in [-1, 3]$;
- graf $g$ (oranžni) je nad osjo $x$ med ničlama, ki ju ne vključimo: $x \in (-1, 5)$.

| $x$ | $f \le 0$ | $g > 0$ | oba |
|---|---|---|---|
| $< -1$ | ne | ne | ne |
| $-1$ | da | ne | ne |
| $(-1, 3]$ | da | da | da |
| $(3, 5)$ | ne | da | ne |
| $\ge 5$ | ne | ne | ne |

Rešitev sistema je presek $(-1, 3]$. Število $-1$ izpade, ker je $g(-1) = 0$, druga neenačba pa je stroga.

:::risba premica
opis: Številska premica od −2 do 6. Pobarvan je interval od −1 do 3. Pri −1 je prazen krožec (ni vključen), pri 3 poln krožec (vključen).
od: -2
do: 6
interval: -1 .. 3 | rešitev sistema | modra
točka: -1 | −1 | prazna
točka: 3 | 3
:::

## Rešeni primeri

### Primer 1 (lažji): parabola in premica

Poišči presečišča parabole $y = x^2 - 4x + 5$ in premice $y = x + 1$.

**Podatki:** parabola $y = x^2 - 4x + 5$, premica $y = x + 1$
**Iščemo:** število presečišč in njihove koordinate

:::formula
Izenačimo desni strani; za enačbo $ax^2 + (b - k)x + (c - n) = 0$ je $D = (b - k)^2 - 4a(c - n)$.
:::

**Rešitev:**

1. Izenačimo desni strani, ker imata presečišči enak $y$: enačba $x^2 - 4x + 5 = x + 1$.
2. Prenesemo na levo: enačba $x^2 - 5x + 4 = 0$.
3. Diskriminanta: $D = 25 - 16 = 9 > 0$, zato sta presečišči dve.
4. Razcep $(x - 1)(x - 4) = 0$ da $x = 1$ in $x = 4$.
5. Ordinati iz premice: $1 + 1 = 2$ in $4 + 1 = 5$. Preverba na paraboli: $1 - 4 + 5 = 2$ in $16 - 16 + 5 = 5$.
6. Odgovor: premica je sekanta in seka parabolo v točkah $(1, 2)$ in $(4, 5)$.

### Primer 2: dve paraboli

Poišči presečišča parabol $f(x) = x^2 + 2x - 1$ in $g(x) = -x^2 + 3$.

**Podatki:** $f(x) = x^2 + 2x - 1$, $g(x) = -x^2 + 3$
**Iščemo:** presečišča obeh parabol

:::formula
$f(x) = g(x)$, nato vse na eno stran in rešimo kvadratno enačbo.
:::

**Rešitev:**

1. Izenačimo: enačba $x^2 + 2x - 1 = -x^2 + 3$.
2. Prenesemo na levo: enačba $2x^2 + 2x - 4 = 0$. Delimo z $2$, da so koeficienti manjši: enačba $x^2 + x - 2 = 0$.
3. Razcep $(x + 2)(x - 1) = 0$ da $x = -2$ in $x = 1$.
4. Ordinati iz preprostejše funkcije $g$: $g(-2) = -4 + 3 = -1$ in $g(1) = -1 + 3 = 2$. Preverba: $f(-2) = 4 - 4 - 1 = -1$ in $f(1) = 1 + 2 - 1 = 2$.
5. Odgovor: paraboli se sekata v točkah $(-2, -1)$ in $(1, 2)$.

### Primer 3 (težji): ali žogica zadene jeklenico?

Laro iz uvoda skrbi jeklenica žičnice, ki nad igriščem poteka po premici $y = 0{,}5x + 6$. Žogica leti po paraboli $y = -0{,}1x^2 + 2x$. a) Ali žogica zadene jeklenico? b) Na kateri višini $n$ bi jeklenica $y = 0{,}5x + n$ morala biti, da bi se je žogica ravno dotaknila? Kje bi se je dotaknila?

**Podatki:** parabola $y = -0{,}1x^2 + 2x$, jeklenica $y = 0{,}5x + 6$, premaknjena jeklenica $y = 0{,}5x + n$ (enote v metrih)
**Iščemo:** a) ali sta skupni točki; b) $n$, pri katerem je premica tangenta, in dotikališče

:::formula
$D < 0$: premica je mimobežnica; $D = 0$: premica je tangenta.
:::

**Rešitev:**

1. Izenačimo: enačba $-0{,}1x^2 + 2x = 0{,}5x + 6$. Prenesemo na levo in pomnožimo z $-10$, da se znebimo decimalk: enačba $x^2 - 15x + 60 = 0$.
2. Diskriminanta: $D = 225 - 240 = -15 < 0$. Jeklenica je mimobežnica, žogica je ne zadene.
3. Za premico $y = 0{,}5x + n$ enako dobimo enačbo $x^2 - 15x + 10n = 0$ z diskriminanto $D = 225 - 40n$.
4. Dotik pomeni $D = 0$: iz $225 - 40n = 0$ sledi $n = 5{,}625$. Preverba: $225 - 40 \cdot 5{,}625 = 0$.
5. Pri $D = 0$ je dvojna rešitev $x = -\dfrac{b}{2a} = \dfrac{15}{2} = 7{,}5$. Ordinata: $0{,}5 \cdot 7{,}5 + 5{,}625 = 9{,}375$. Na paraboli: $-0{,}1 \cdot 7{,}5^2 + 2 \cdot 7{,}5 = 9{,}375$, ustreza.
6. Razlaga: prava jeklenica je višje za $6 - 5{,}625 = 0{,}375\,\mathrm{m}$.
7. Odgovor: žogica jeklenice ne zadene. Ravno bi se je dotaknila, če bi bila jeklenica $y = 0{,}5x + 5{,}625$, v točki $(7{,}5; 9{,}375)$. Žogica gre torej pod jeklenico z rezervo $37{,}5\,\mathrm{cm}$.

### Primer 4 (višja raven): sistem – zdaj ti

Reši sistem neenačb $x^2 - x - 6 < 0$ in $x^2 - 4x \ge 0$.

**Podatki:** neenačbi $x^2 - x - 6 < 0$ in $x^2 - 4x \ge 0$, ki veljata hkrati
**Iščemo:** množico vseh $x$, ki izpolnijo obe neenačbi

:::formula
Za $a > 0$ in ničli $x_1 < x_2$ je $ax^2 + bx + c < 0$ za $x \in (x_1, x_2)$, pozitiven pa je levo od $x_1$ in desno od $x_2$.
:::

**Rešitev:**

1. Prva neenačba: razcep $(x - 3)(x + 2) < 0$. Parabola je odprta navzgor, pod osjo je med ničlama: $x \in (-2, 3)$.
2. Druga neenačba: razcep $x(x - 4) \ge 0$. Parabola je nad osjo ali na njej zunaj ničel: $x \in (-\infty, 0] \cup [4, \infty)$.
3. Zdaj ti: obe množici nariši na številsko premico in poišči njun presek. Ali je $0$ vključena? Ali je $-2$?

:::premisli
Kakšna je rešitev sistema?
---
$x \in (-2, 0]$. Del $[4, \infty)$ ne seka intervala $(-2, 3)$. Število $0$ je vključeno, ker velja $0 - 0 - 6 < 0$ in $0 \ge 0$. Število $-2$ ni, ker je tam prva stran enaka $0$, prva neenačba pa je stroga. Preizkus pri $x = -1$: $1 + 1 - 6 = -4 < 0$ in $1 + 4 = 5 \ge 0$.
:::

## Pogoste napake

- **Ničle namesto presečišča.** Kot Lara rešiš $f(x) = 0$ in dobiš točko $(20, 0)$ v hribu. Ničle so presečišča z osjo $x$, torej s premico $y = 0$. Za drugo premico ali parabolo izenači $f(x) = g(x)$.
- **Diskriminanta same parabole.** Učenec izračuna $b^2 - 4ac$ parabole in iz nje sklepa o presečiščih s premico. Ta diskriminanta govori samo o osi $x$. Najprej vse prenesi na eno stran, nato izračunaj $D = (b - k)^2 - 4a(c - n)$.
- **Samo abscisa.** »Presečišče je $x = 4$.« Presečišče je točka. Izračunaj še ordinato, najlaže iz enačbe premice, in jo preveri na paraboli.
- **Paraboli z enakim $a$ »sta vzporedni«.** Če se člen $x^2$ odšteje, ostane linearna enačba. Paraboli se tedaj sekata v natanko eni točki, razen če se odšteje tudi člen z $x$.
- (višja raven) **Unija namesto preseka ali napačna stran ničel.** Rešitev sistema je presek, ne unija. Pri $a > 0$ velja $ax^2 + bx + c \ge 0$ *zunaj* ničel: neenačba $x(x - 4) \ge 0$ ima rešitev $(-\infty, 0] \cup [4, \infty)$, ne $[0, 4]$.

## Povzetek

- Presečišče grafov je točka, ki leži na obeh; abscise dobiš iz enačbe $f(x) = g(x)$, ordinato iz preprostejše funkcije.
- Parabola $y = ax^2 + bx + c$ in premica $y = kx + n$: enačba $ax^2 + (b - k)x + (c - n) = 0$, $D = (b - k)^2 - 4a(c - n)$.
- $D > 0$: sekanta (dve presečišči); $D = 0$: tangenta (dotikališče); $D < 0$: mimobežnica (ni presečišč).
- Dve paraboli presekaš enako; pri enakem vodilnem koeficientu dobiš linearno enačbo in največ eno presečišče.
- Ničle parabole so le presečišča z osjo $x$.
- (višja raven) Sistem kvadratnih neenačb: reši vsako neenačbo posebej (skica parabole), rešitve nariši na isto številsko premico in vzemi presek. Krajišča vključi samo, če ju vključita obe neenačbi.

## Drugače: Kot zgodba

Lara se naslednji dan pogovarja z vzdrževalcem žičnice. »Kaj, če jeklenico spustimo?« vpraša. Skupaj si zamislita premico $y = 0{,}5x + n$ in jo počasi spuščata.

Pri $n = 6$ žogica leti pod jeklenico in je ne zadene: enačba $x^2 - 15x + 60 = 0$ nima realne rešitve, $D = -15$. Ko spustita jeklenico na $n = 5{,}625$, se je žogica ravno dotakne v točki $(7{,}5; 9{,}375)$: $D = 0$. Pri $n = 5$ pa jo žogica sreča dvakrat: enačba $x^2 - 15x + 50 = 0$ ima $D = 25$ in rešitvi $x = 5$ ter $x = 10$. Žogica jo prvič doseže v točki $(5; 7{,}5)$ in drugič v točki $(10, 10)$.

Zgodba ima tri konce, kot jih ima diskriminanta: mimobežnica, tangenta, sekanta. Vzdrževalec je zadovoljen, da jeklenica ostane na $n = 6$.

## Drugače: Korak za korakom s številkami

Presečišča parabole $y = x^2 - 2x + 3$ in premice $y = 2x$:

1. Izenačimo: enačba $x^2 - 2x + 3 = 2x$.
2. Vse na levo: enačba $x^2 - 4x + 3 = 0$.
3. Diskriminanta: $D = 16 - 12 = 4 > 0$, dve presečišči.
4. Razcep $(x - 1)(x - 3) = 0$: $x = 1$ ali $x = 3$.
5. Ordinati iz premice: $2 \cdot 1 = 2$ in $2 \cdot 3 = 6$. Točki sta $(1, 2)$ in $(3, 6)$.

**Sistem po korakih (višja raven).** Sistem $x^2 - 9 \le 0$ in $x^2 + x - 2 > 0$:

1. Prva: $(x - 3)(x + 3) \le 0$, rešitev med ničlama z vključenima krajiščema: $[-3, 3]$.
2. Druga: $(x + 2)(x - 1) > 0$, rešitev zunaj ničel brez krajišč: $(-\infty, -2) \cup (1, \infty)$.
3. Presek: števila, ki so v obeh množicah.

:::risba premica
opis: Številska premica od −4 do 4. Pobarvana sta dva dela: od −3 do −2 in od 1 do 3. Pri −3 in 3 sta polna krožca (vključeni), pri −2 in 1 prazna krožca (nista vključeni).
od: -4
do: 4
interval: -3 .. -2 | del 1 | modra
interval: 1 .. 3 | del 2 | modra
točka: -3 | −3
točka: -2 | −2 | prazna
točka: 1 | 1 | prazna
točka: 3 | 3
:::

4. Rešitev: $x \in [-3, -2) \cup (1, 3]$.

## Preveri se

? Katera premica se po legi glede na parabolo $y = x^2$ ne ujema z ostalimi tremi?
- $y = 2x - 1$
~ Enačba $x^2 - 2x + 1 = 0$ ima $D = 0$: premica je tangenta, tako kot še dve drugi.
- $y = -4x - 4$
~ Negativen smerni koeficient ni pomemben. Enačba $x^2 + 4x + 4 = 0$ ima $D = 0$, zato je tudi ta premica tangenta.
- $y = 6x - 9$
~ Strmina ne odloča. Enačba $x^2 - 6x + 9 = 0$ ima $D = 0$, premica je tangenta.
+ $y = x + 2$
> Enačba $x^2 - x - 2 = 0$ ima $D = 9 > 0$, zato je $y = x + 2$ sekanta (presečišči $(-1, 1)$ in $(2, 4)$). Ostale tri so tangente.

? (brez računala) Parabola $y = x^2 - 3x + 1$ in premica $y = 2x - 3$ se sekata v dveh točkah. Vpiši ordinato tiste, ki ima večjo absciso.
= 5
~ 4 | To je abscisa $x = 4$. Presečišče je točka: ordinato dobiš z vstavljanjem v enačbo premice, $2 \cdot 4 - 3 = 5$.
~ -1 | To je ordinata presečišča z manjšo absciso, $x = 1$.
> Enačba $x^2 - 5x + 4 = 0$ ima rešitvi $1$ in $4$. Pri $x = 4$ je $y = 2 \cdot 4 - 3 = 5$; preverba na paraboli: $16 - 12 + 1 = 5$.

? Na sliki sta parabola $y = x^2$ in premica $y = 2x + n$. Ko premico spuščamo (manjšamo $n$), se njeni presečišči s parabolo bližata. Pri katerem $n$ se zlijeta v eno točko?
:::risba graf
opis: Modra parabola y = x² in oranžna premica y = 2x + n. V aplikaciji n spreminjaš z drsnikom; izbrano je n = {n}. Pri začetni vrednosti n = 2 premica seka parabolo v dveh točkah.
x: -3 .. 4 | 1 | x
y: -4 .. 10 | 2 | y
drsnik: n | -3 .. 3 | 0,5 | 2 | odsek n
f: x^2 | modra
f: 2*x + n | oranžna
podnapis: Parabola y = x² in premica y = 2x + n pri n = {n}
:::
= -1
~ 1 | Pri prenašanju si zamenjal predznak. Enačba je $x^2 - 2x - n = 0$, zato je $D = 4 + 4n$.
~ 0 | Pri $n = 0$ ima premica s parabolo še dve skupni točki, $(0, 0)$ in $(2, 4)$.
> Enačba $x^2 = 2x + n$ oziroma $x^2 - 2x - n = 0$ ima $D = 4 + 4n$. Presečišči se zlijeta pri $D = 0$, torej $n = -1$; tedaj je premica tangenta z dotikališčem $(1, 1)$.

? (višja raven) Miha rešuje sistem $x^2 - 4 < 0$ in $x^2 - 3x \ge 0$. Korak 1: prva neenačba ima rešitev $(-2, 2)$. Korak 2: druga neenačba ima rešitev $[0, 3]$. Korak 3: presek je $[0, 2)$. Kateri korak je napačen?
- Korak 1
~ Korak 1 je pravilen: parabola $y = x^2 - 4$ je pod osjo med ničlama $-2$ in $2$, krajišči pa izpadeta, ker je neenačba stroga.
+ Korak 2
- Korak 3
~ Presek množic iz korakov 1 in 2 je res $[0, 2)$. Napaka je prej, zato je tudi ta rezultat napačen.
- Noben, rešitev je pravilna.
~ Preizkus z $x = 1$: $1 - 3 = -2$, kar ni $\ge 0$. Število $1$ torej ni rešitev, čeprav je v $[0, 2)$.
> Parabola $y = x^2 - 3x$ je odprta navzgor, zato je $x(x - 3) \ge 0$ zunaj ničel: $(-\infty, 0] \cup [3, \infty)$. Pravilni presek z $(-2, 2)$ je $(-2, 0]$.

? Razvrsti korake pri iskanju presečišč parabole in premice.
1. Izenačiš desni strani enačb parabole in premice.
2. Vse člene preneseš na eno stran, da je na drugi $0$.
3. Iz diskriminante ugotoviš, koliko presečišč je.
4. Rešiš kvadratno enačbo in dobiš abscise.
5. Abscise vstaviš v enačbo premice in dobiš ordinate.
> Diskriminanto lahko izračunaš šele, ko je enačba v obliki $ax^2 + bx + c = 0$. Ordinato dobiš na koncu, ko poznaš absciso.

:::simboli
a, b, c | koeficienti parabole $y = ax^2 + bx + c$ | | | $a \ne 0$
k | smerni koeficient premice | | |
n | začetna vrednost premice (odsek na osi $y$) | | |
D | diskriminanta enačbe za presečišča | D = (b - k)^2 - 4a(c - n) | | določa število presečišč
x | abscisa (pri Lari vodoravna razdalja) | | |
y | ordinata (pri Lari višina) | | |
f, g | funkciji, katerih grafa sekamo | | |
x_1, x_2 | ničli kvadratnega tričlena | | | $x_1 < x_2$
:::

<<RACUN
resi: -0.1*x^2+2*x=0 | x | 0, 20
resi: -0.1*x^2+2*x=0.5*x | x | 0, 15
vrednost: 0.5*15 | 7.5
resi: x^2-2*x-3=-x^2+4*x+5 | x | -1, 4
resi: x^2+1=x^2-2*x+5 | x | 2
neenacba: x^2-2*x-3<=0 | x | [-1, 3]
neenacba: -x^2+4*x+5>0 | x | (-1, 5)
resi: x^2-4*x+5=x+1 | x | 1, 4
resi: x^2+2*x-1=-x^2+3 | x | -2, 1
resi: -0.1*x^2+2*x=0.5*x+6 | x | none
resi: 225-40*n=0 | n | 5.625
vrednost: -0.1*7.5^2+2*7.5 | 9.375
neenacba: x^2-x-6<0 | x | (-2, 3)
neenacba: x^2-4*x>=0 | x | (-oo, 0] U [4, oo)
resi: x^2-15*x+50=0 | x | 5, 10
neenacba: x^2+x-2>0 | x | (-oo, -2) U (1, oo)
resi: x^2-3*x+1=2*x-3 | x | 1, 4
resi: 4+4*n=0 | n | -1
neenacba: x^2-3*x>=0 | x | (-oo, 0] U [3, oo)
>>
