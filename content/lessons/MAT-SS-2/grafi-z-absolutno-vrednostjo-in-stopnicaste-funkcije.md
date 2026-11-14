---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Dve kuhinjski uganki. Poskusi ju rešiti, preden bereš naprej.

**Uganka 1.** Iz testa oblikuješ štručke po $300\,\mathrm{g}$. Kar ostane, shraniš za naslednjo peko. Koliko štručk dobiš iz $899\,\mathrm{g}$ testa? In koliko iz $900\,\mathrm{g}$? En gram več, cela štručka več. Ali bi bil graf števila štručk v odvisnosti od mase testa premica?

(višja raven) **Uganka 2.** V ozki kuhinji vse stoji ob enem pultu. Hladilnik je $2\,\mathrm{m}$ levo od korita, štedilnik $1\,\mathrm{m}$ desno od njega. Kam postaviš desko za rezanje, da bo vsota razdalj od deske do hladilnika in od deske do štedilnika čim manjša? Je najboljše mesto eno samo?

Prva uganka pelje do **stopničastih funkcij**, po katerih se računajo tudi parkirnine in poštnine. Druga pelje do funkcij z več absolutnimi vrednostmi.

## Razlaga

**1. Staro in novo: premica proti stopnicam.** Cena moke je premo sorazmerna z maso. Dvakrat več moke stane dvakrat več, graf je neprekinjena premica. Število štručk se obnaša drugače. Dolgo ostaja enako, nato naenkrat poskoči za $1$:

| masa testa $m$ | število štručk $n$ |
|---|---|
| $0 \le m < 300\,\mathrm{g}$ | $0$ |
| $300\,\mathrm{g} \le m < 600\,\mathrm{g}$ | $1$ |
| $600\,\mathrm{g} \le m < 900\,\mathrm{g}$ | $2$ |
| $900\,\mathrm{g} \le m < 1200\,\mathrm{g}$ | $3$ |

Funkcija, ki je na zaporednih intervalih stalna, med njimi pa skoči, je **stopničasta funkcija**. Graf so vodoravne daljice, stopnice.

**2. Polna pika ali prazen krožec.** Iz natanko $300\,\mathrm{g}$ testa dobiš eno štručko. Točka $(300, 1)$ je na grafu, zato jo narišemo s **polno piko**. Spodnja stopnica ($n = 0$) seže do $300$, a točka $(300, 0)$ ni na grafu. Tak konec označimo s **praznim krožcem**: stopnica gre do tja, točke same pa ne vsebuje.

:::risba graf
opis: Graf števila štručk n v odvisnosti od mase testa m od 0 do 1200 g. Štiri vodoravne stopnice: n = 0 za m od 0 do 300 g, n = 1 od 300 do 600 g, n = 2 od 600 do 900 g, n = 3 od 900 do 1200 g. Na levem koncu vsake stopnice je polna pika, na desnem prazen krožec.
x: 0 .. 12 | 3 | m (g)
y: -0,5 .. 4 | 1 | n
oznake: ne
oznakax: 3 | 300
oznakax: 6 | 600
oznakax: 9 | 900
oznakax: 12 | 1200
oznakay: 1 | 1
oznakay: 2 | 2
oznakay: 3 | 3
črta: 0; 0 -> 3; 0 | modra debelo
črta: 3; 1 -> 6; 1 | modra debelo
črta: 6; 2 -> 9; 2 | modra debelo
črta: 9; 3 -> 12; 3 | modra debelo
krog: 3; 0 | 0,19 | modra ozadje
krog: 6; 1 | 0,19 | modra ozadje
krog: 9; 2 | 0,19 | modra ozadje
točka: 0; 0
točka: 3; 1
točka: 6; 2
točka: 9; 3
podnapis: Število štručk po 300 g iz m gramov testa
:::

:::premisli
Zakaj pri $m = 600\,\mathrm{g}$ ne smeta biti polni obe piki, na stopnici $n = 1$ in na stopnici $n = 2$?
---
Potem bi masa $600\,\mathrm{g}$ imela dve vrednosti, $1$ in $2$. Funkcija pa vsakemu $m$ priredi natanko eno vrednost. Iz $600\,\mathrm{g}$ dobiš točno $2$ štručki, zato je polna pika na zgornji stopnici, na spodnji pa prazen krožec.
:::

**3. Celi del števila.** Štručk je toliko, kolikokrat gre $300$ cel v $m$. Za to imamo posebno funkcijo. **Celi del** števila $x$, zapišemo $\lfloor x \rfloor$, je največje celo število, ki ni večje od $x$. Primeri: $\lfloor 2{,}7 \rfloor = 2$, $\lfloor 5 \rfloor = 5$, $\lfloor -2{,}7 \rfloor = -3$. Pri negativnem številu ne smeš le odrezati decimalk: $-2$ je večje od $-2{,}7$, zato ne pride v poštev. Za štručke torej velja

$$n = \left\lfloor \frac{m}{300} \right\rfloor$$

in iz $899\,\mathrm{g}$ dobiš $\lfloor 2{,}99\ldots \rfloor = 2$ štručki, iz $900\,\mathrm{g}$ pa $3$.

Graf $y = \lfloor x \rfloor$ ima stopnice široke in visoke $1$. Primerjaj ga s premico $y = x$:

:::risba graf
opis: Graf funkcije celi del za x od −2 do 3 in črtkana premica y = x. Stopnice so široke 1 in visoke 1: y = −2 za x od −2 do −1, y = −1 od −1 do 0, y = 0 od 0 do 1, y = 1 od 1 do 2, y = 2 od 2 do 3. Polna pika je na levem koncu stopnice, prazen krožec na desnem. Stopnice ležijo pod premico y = x in se je dotaknejo v celih številih.
x: -2,5 .. 3,5 | 1
y: -2,5 .. 3,5 | 1
enako: da
f: x | siva črtkano
črta: -2; -2 -> -1; -2 | modra debelo
črta: -1; -1 -> 0; -1 | modra debelo
črta: 0; 0 -> 1; 0 | modra debelo
črta: 1; 1 -> 2; 1 | modra debelo
črta: 2; 2 -> 3; 2 | modra debelo
krog: -1; -2 | 0,1 | modra ozadje
krog: 0; -1 | 0,1 | modra ozadje
krog: 1; 0 | 0,1 | modra ozadje
krog: 2; 1 | 0,1 | modra ozadje
krog: 3; 2 | 0,1 | modra ozadje
točka: -2; -2
točka: -1; -1
točka: 0; 0
točka: 1; 1
točka: 2; 2
napis: 2,6; 3,2 | y = x | levo | siva
podnapis: Celi del: polna pika levo, prazen krožec desno
:::

Premica raste enakomerno, celi del skače. Polne pike ležijo na premici, vse ostalo pod njo, a za manj kot $1$: $\lfloor x \rfloor \le x < \lfloor x \rfloor + 1$.

**4. Tarife: polna pika na desni.** Parkirnina »za vsako začeto uro« ali poštnina »do $50\,\mathrm{g}$« delujeta obratno kot celi del. Pri natanko $1$ uri plačaš eno uro, pri $1$ uri in $1$ sekundi že dve. Polna pika je zato na desnem krajišču stopnice. Vrednost prebereš tako, da nad $x$ poiščeš stopnico in odčitaš njeno višino.

**5. Absolutna vrednost po primerih (višja raven).** Graf $y = a|x - p| + q$ že znaš: to je premaknjen in raztegnjen »V«. Funkcija $f(x) = |x - 1| + |x + 2|$ pa je vsota dveh absolutnih vrednosti in ni premik grafa $y = |x|$. Narišemo jo po primerih. Izhodišče je definicija:

$$|a| = a, \quad \text{če je } a \ge 0$$

$$|a| = -a, \quad \text{če je } a < 0$$

Izraz $|x - 1|$ spremeni obliko pri $x = 1$, kjer je $x - 1 = 0$. Izraz $|x + 2|$ jo spremeni pri $x = -2$. Ti dve točki razdelita realno os na tri intervale. Na vsakem odstranimo absolutni vrednosti:

| $x$ | $\lvert x - 1 \rvert$ | $\lvert x + 2 \rvert$ | $f(x)$ |
|---|---|---|---|
| $x < -2$ | $1 - x$ | $-x - 2$ | $-2x - 1$ |
| $-2 \le x < 1$ | $1 - x$ | $x + 2$ | $3$ |
| $x \ge 1$ | $x - 1$ | $x + 2$ | $2x + 1$ |

Graf ni »V«, ampak korito z ravnim dnom:

:::risba graf
opis: Graf funkcije f, vsote absolutnih vrednosti od x − 1 in od x + 2, za x od −4 do 3. Levo pada (y = −2x − 1), med −2 in 1 je vodoraven na višini 3, desno narašča (y = 2x + 1). Točki (−2, 3) in (1, 3) sta označeni. Črtkano sta narisana oba sestavna grafa v obliki črke V z temenoma v (1, 0) in (−2, 0).
x: -4 .. 3 | 1
y: 0 .. 8 | 1
f: abs(x-1) | siva črtkano
f: abs(x+2) | siva črtkano
f: abs(x-1)+abs(x+2) | modra
točka: -2; 3 | (−2, 3) | nad levo
točka: 1; 3 | (1, 3) | nad desno
podnapis: Vsota dveh »V« (črtkano) je korito (polno)
:::

To je odgovor na drugo uganko. Pult je številska premica: kuhinjsko korito je pri $0$, hladilnik je pri $-2$, štedilnik pri $1$. Razdalji od deske pri $x$ sta $|x - 1|$ in $|x + 2|$. Vsota je najmanjša, $3\,\mathrm{m}$, kjerkoli med hladilnikom in štedilnikom: najboljših mest je neskončno mnogo.

**6. $|f(x)|$ ali $f(|x|)$ (višja raven).** Zapisa sta si podobna, pomenita pa nekaj povsem drugega.

- $y = |f(x)|$: absolutno vrednost vzamemo na koncu, od **vrednosti**. Kar je nad osjo $x$, ostane. Kar je pod njo, prezrcalimo čez os $x$ navzgor.
- $y = f(|x|)$: absolutno vrednost vzamemo od **spremenljivke**. Za $x \ge 0$ je $f(|x|) = f(x)$, desna polovica ostane. Za $x < 0$ je $f(|x|) = f(-x)$, zato je leva polovica zrcalna slika desne čez os $y$.

Za $f(x) = x - 2$ dobimo $|x - 2|$ s temenom v $(2, 0)$ in $|x| - 2$ s temenom v $(0, -2)$:

:::risba graf
opis: Črtkano premica y = x − 2. Polno graf y = absolutna vrednost od x − 2: del premice pod osjo x je prezrcaljen navzgor, teme je v točki (2, 0).
x: -3 .. 5 | 1
y: -3 .. 5 | 1
višina: 170
f: x-2 | siva črtkano
f: abs(x-2) | modra
točka: 2; 0 | teme (2, 0) | pod desno
podnapis: y = |f(x)|: zrcaljenje čez os x
:::

:::risba graf
opis: Črtkano premica y = x − 2. Polno graf y = absolutna vrednost od x, minus 2: desna polovica premice ostane, leva je njena zrcalna slika čez os y, teme je v točki (0, −2).
x: -3 .. 5 | 1
y: -3 .. 5 | 1
višina: 170
f: x-2 | siva črtkano
f: abs(x)-2 | oranžna
točka: 0; -2 | teme (0, −2) | desno
podnapis: y = f(|x|): leva polovica je zrcalo desne
:::

:::premisli
Napovej: kako je videti graf $y = f(|x|)$ za $f(x) = x^2 - 4$? Se kaj spremeni?
---
Nič se ne spremeni. Funkcija $x^2 - 4$ je soda, ker je $(-x)^2 = x^2$. Njena leva polovica je že zrcalna slika desne, zato zrcaljenje desne polovice da isti graf. Funkcija $|x^2 - 4|$ pa je drugačna, glej Primer 2.
:::

**7. Enačbe in neenačbe z grafa (višja raven).** Enačbo $f(x) = c$ rešiš tako, da narišeš vodoravno premico $y = c$. Abscise presečišč z grafom so rešitve, število presečišč je število rešitev. Neenačbo $f(x) \le c$ rešijo tisti $x$, pri katerih graf leži pod premico ali na njej. Natančno mejo izračunaš iz predpisa tistega dela, na katerem je presečišče. Enačba $|x - 1| + |x + 2| = 2$ na primer nima rešitve, saj je premica $y = 2$ pod dnom korita.

## Rešeni primeri

### Primer 1 (lažji): parkirišče

Na parkirišču stane prva ura $1\,\text{€}$, vsaka nadaljnja začeta ura pa $1{,}50\,\text{€}$. Parkiraš lahko največ $4$ ure. Nariši graf cene $C$ v odvisnosti od časa $t$. Koliko plačaš za $2{,}5$ ure? Kako dolgo lahko največ parkiraš za $4\,\text{€}$?

**Podatki:** prva ura $1\,\text{€}$, vsaka nadaljnja začeta ura $1{,}50\,\text{€}$; $0 < t \le 4\,\mathrm{h}$
**Iščemo:** graf $C(t)$, ceno $C(2{,}5)$, najdaljši čas za $4\,\text{€}$

:::formula
Pri »vsaki začeti uri« je cena stalna na intervalih $(0, 1]$, $(1, 2]$, $(2, 3]$ in $(3, 4]$. Desno krajišče pripada stopnici (polna pika), levo ne (prazen krožec).
:::

**Rešitev:**

1. Za $0 < t \le 1$ plačaš $1\,\text{€}$. Pri natanko $1$ uri druga ura še ni začeta.
2. Za $1 < t \le 2$: $1 + 1{,}5 = 2{,}5$, torej $2{,}50\,\text{€}$.
3. Za $2 < t \le 3$: $1 + 2 \cdot 1{,}5 = 4$, torej $4\,\text{€}$. Za $3 < t \le 4$: $1 + 3 \cdot 1{,}5 = 5{,}5$, torej $5{,}50\,\text{€}$.
4. Narišemo štiri stopnice, polna pika je na desnem koncu vsake:

:::risba graf
opis: Graf parkirnine C v evrih v odvisnosti od časa t v urah. Stopnice: 1 € za t od 0 do 1; 2,50 € od 1 do 2; 4 € od 2 do 3; 5,50 € od 3 do 4. Na levem koncu vsake stopnice je prazen krožec, na desnem polna pika.
x: -0,5 .. 4,5 | 1 | t (h)
y: 0 .. 6 | 1 | C (€)
črta: 0; 1 -> 1; 1 | modra debelo
črta: 1; 2,5 -> 2; 2,5 | modra debelo
črta: 2; 4 -> 3; 4 | modra debelo
črta: 3; 5,5 -> 4; 5,5 | modra debelo
krog: 0; 1 | 0,08 | modra ozadje
krog: 1; 2,5 | 0,08 | modra ozadje
krog: 2; 4 | 0,08 | modra ozadje
krog: 3; 5,5 | 0,08 | modra ozadje
točka: 1; 1
točka: 2; 2,5
točka: 3; 4
točka: 4; 5,5
podnapis: Parkirnina: polna pika na desnem koncu stopnice
:::

5. Čas $2{,}5$ ure leži na intervalu $(2, 3]$, zato je $C(2{,}5) = 4\,\text{€}$.
6. Višino $4\,\text{€}$ ima stopnica nad $(2, 3]$. Njen desni konec, $t = 3$, je polna pika, zato $3$ ure še stanejo $4\,\text{€}$.

Odgovor: za $2{,}5$ ure plačaš $4\,\text{€}$, za $4\,\text{€}$ pa lahko parkiraš največ $3$ ure.

### Primer 2 (višja raven): graf $|x^2 - 4|$

Zapiši predpis funkcije $f(x) = |x^2 - 4|$ brez absolutne vrednosti, po primerih. Nariši njen graf in odčitaj ničle, $f(0)$, $f(1)$ in $f(3)$.

**Podatki:** $f(x) = |x^2 - 4|$, $D_f = \mathbb{R}$
**Iščemo:** predpis po primerih, graf, ničle in vrednosti $f(0)$, $f(1)$, $f(3)$

:::formula
$|a| = a$, če je $a \ge 0$, in $|a| = -a$, če je $a < 0$. Tu je $a = x^2 - 4$.
:::

**Rešitev:**

1. Kje je $x^2 - 4$ negativen? Graf $y = x^2 - 4$ je parabola $y = x^2$, premaknjena za $4$ navzdol. Os $x$ seka, kjer je $x^2 = 4$: pri $x = -2$ in $x = 2$. Vmes je pod osjo.
2. Za $x \le -2$ ali $x \ge 2$ je $x^2 - 4 \ge 0$, zato $f(x) = x^2 - 4$.
3. Za $-2 < x < 2$ je $x^2 - 4 < 0$, zato $f(x) = -(x^2 - 4) = 4 - x^2$. Ta del parabole se prezrcali čez os $x$.
4. Graf:

:::risba graf
opis: Črtkano parabola y = x² − 4 s temenom v (0, −4). Polno graf y = absolutna vrednost od x² − 4: zunaj intervala od −2 do 2 sovpada s parabolo, med −2 in 2 je del parabole prezrcaljen navzgor in ima vrh v (0, 4). Ničli sta −2 in 2.
x: -3 .. 3 | 1
y: -4 .. 5 | 1
f: x^2-4 | siva črtkano
f: abs(x^2-4) | modra
točka: -2; 0 | −2 | pod levo
točka: 2; 0 | 2 | pod desno
točka: 0; 4 | (0, 4) | nad desno
podnapis: Del parabole pod osjo x se prepogne navzgor
:::

5. Vrednosti: $f(0) = 4 - 0 = 4$, $f(1) = 4 - 1 = 3$ (srednji del), $f(3) = 9 - 4 = 5$ (zunanji del).

Odgovor: $f(x) = x^2 - 4$ za $|x| \ge 2$ (to je $x \le -2$ ali $x \ge 2$), $f(x) = 4 - x^2$ za $|x| < 2$. Ničli: $-2$ in $2$; $f(0) = 4$, $f(1) = 3$, $f(3) = 5$.

### Primer 3 (težji, višja raven): kje je lahko deska

Vrnimo se v kuhinjo iz druge uganke. Hladilnik je pri $-2$, štedilnik pri $1$ (v metrih, kuhinjsko korito je pri $0$). Kuhar želi, da vsota razdalj od deske do hladilnika in do štedilnika ni večja od $5\,\mathrm{m}$. Kje vse je lahko deska?

**Podatki:** hladilnik pri $x = -2$, štedilnik pri $x = 1$, vsota razdalj največ $5\,\mathrm{m}$
**Iščemo:** vse lege $x$ deske

:::formula
Razdalja med točkama $x$ in $a$ na premici je $|x - a|$. Rešujemo neenačbo $|x - 1| + |x + 2| \le 5$.
:::

**Rešitev:**

1. Razdalja do štedilnika je $|x - 1|$, do hladilnika $|x - (-2)| = |x + 2|$. To je funkcija $f$ iz razlage (točka 5).
2. Na dnu korita, za $-2 \le x < 1$, je $f(x) = 3 \le 5$. Vse te lege ustrezajo.
3. Levo velja $f(x) = -2x - 1$. Meja: $-2x - 1 = 5$, torej $x = -3$.
4. Desno velja $f(x) = 2x + 1$. Meja: $2x + 1 = 5$, torej $x = 2$.
5. Preizkus: $f(-3) = |-3 - 1| + |-3 + 2| = 4 + 1 = 5$ in $f(2) = 1 + 4 = 5$.
6. Na grafu leži korito pod premico $y = 5$ ali na njej od $-3$ do $2$:

:::risba graf
opis: Graf funkcije f, vsote absolutnih vrednosti od x − 1 in od x + 2, in črtkana premica y = 5. Premica seka graf v točkah (−3, 5) in (2, 5). Na osi x je poudarjen interval od −3 do 2, kjer graf leži pod premico ali na njej.
x: -4 .. 3 | 1
y: 0 .. 8 | 1
f: abs(x-1)+abs(x+2) | modra
f: 5 | oranžna črtkano
črta: -3; 0 -> 2; 0 | zelena debelo
točka: -3; 5 | (−3, 5) | nad
točka: 2; 5 | (2, 5) | nad
podnapis: Rešitev neenačbe je interval [−3, 2]
:::

Odgovor: $x \in [-3, 2]$. Deska je lahko kjerkoli od $1\,\mathrm{m}$ levo od hladilnika do $1\,\mathrm{m}$ desno od štedilnika.

### Primer 4 (višja raven) – zdaj ti

Reši enačbo $|x^2 - 4| = 3$. Pomagaj si z grafom iz Primera 2.

**Podatki:** enačba $|x^2 - 4| = 3$, graf $y = |x^2 - 4|$ iz Primera 2
**Iščemo:** vse rešitve $x$

:::formula
$|a| = 3$ natanko tedaj, ko je $a = 3$ ali $a = -3$.
:::

**Rešitev:**

1. Premica $y = 3$ je nižja od vrha $(0, 4)$, zato seka graf v štirih točkah: dve sta na zunanjih krakih, dve na prepognjenem delu. Enačba ima $4$ rešitve.
2. Zunanja kraka: reši $x^2 - 4 = 3$.
3. Prepognjeni del: reši $4 - x^2 = 3$.

:::premisli
Kateri sta rešitvi iz 2. koraka in kateri iz 3. koraka?
---
Iz $x^2 - 4 = 3$ sledi $x^2 = 7$, torej $x = -\sqrt{7}$ ali $x = \sqrt{7}$ ($\sqrt{7} \approx 2{,}65$). Iz $4 - x^2 = 3$ sledi $x^2 = 1$, torej $x = -1$ ali $x = 1$. Vse štiri rešitve: $-\sqrt{7}$, $-1$, $1$, $\sqrt{7}$. Preizkus z grafa: $f(1) = 3$, kot smo izračunali v Primeru 2.
:::

## Pogoste napake

- **Polni piki na obeh koncih skoka.** Učenec nariše stopnice z dvema polnima pikama. Tako bi mejni $x$ dobil dve vrednosti, to pa ni funkcija. Polna je natanko ena pika. Katera, pove besedilo: »vsaka začeta ura« desno, celi del levo.
- **Celi del kot odrezane decimalke.** »$\lfloor -2{,}3 \rfloor = -2$, ker odrežem $0{,}3$.« Za pozitivna števila to deluje, za negativna ne: $-2$ je večje od $-2{,}3$. Celi del je največje celo število, ki ni večje od $x$, zato $\lfloor -2{,}3 \rfloor = -3$.
- (višja raven) **Združevanje absolutnih vrednosti.** »$|x - 1| + |x + 2| = |2x + 1|$.« Pri $x = 0$ je leva stran $3$, desna $1$. Vsoto absolutnih vrednosti razstaviš po primerih, ne zložiš v eno absolutno vrednost.
- (višja raven) **Pozabljen oklepaj pri predznaku.** Za $x < 1$ učenec zapiše $|x - 1| = -x - 1$. Pravilno je $-(x - 1) = -x + 1$: minus spremeni predznak **obema** členoma. Hiter preizkus: vsota absolutnih vrednosti nikoli ni negativna.
- (višja raven) **Zamenjava $|f(x)|$ in $f(|x|)$.** Učenec pri $y = |x| - 2$ prezrcali del pod osjo $x$ navzgor, kot pri $|x - 2|$. Pri $f(|x|)$ pa se desna polovica prezrcali čez os $y$; graf je lahko tudi pod osjo $x$.

## Povzetek

- Stopničasta funkcija je stalna na zaporednih intervalih in med njimi skoči. Graf so vodoravne stopnice.
- Polna pika: točka je na grafu. Prazen krožec: ni na grafu. Na vsakem skoku je polna natanko ena pika.
- Celi del $\lfloor x \rfloor$ je največje celo število, ki ni večje od $x$: $\lfloor -2{,}7 \rfloor = -3$. Polna pika je levo.
- Tarife »vsaka začeta ura« ali »do $50\,\mathrm{g}$«: polna pika je desno.
- (višja raven) Funkcijo z več absolutnimi vrednostmi narišeš po primerih: ničle izrazov v $|\ldots|$ razdelijo os, na vsakem intervalu absolutno vrednost odstraniš po definiciji.
- (višja raven) $|x - 1| + |x + 2|$: korito z dnom $3$ na $[-2, 1]$.
- (višja raven) $y = |f(x)|$: del pod osjo $x$ prezrcališ navzgor. $y = f(|x|)$: desno polovico prezrcališ na levo.
- (višja raven) Enačbo ali neenačbo z $|\ldots|$ rešiš z vodoravno premico $y = c$; natančne meje izračunaš iz predpisa ustreznega dela.

## Drugače: Na sliki

**Navpična premica.** Navpično ravnilo premikaj čez graf stopničaste funkcije. Grafa se vedno dotakne natanko enkrat, tudi na skoku: tam zadene eno polno piko, prazen krožec ne šteje.

(višja raven) **Razdalje na premici.** Narišimo kuhinjo s pultom kot številsko premico:

:::risba premica
opis: Številska premica od −4 do 3. Hladilnik H je pri −2, štedilnik Š pri 1, deska D pri 2. Daljica od −2 do 1 je dolga 3.
od: -4
do: 3
točka: -2 | H
točka: 1 | Š
točka: 2 | D | oranžna
interval: -2 .. 1 | 3 m
:::

Če je deska med H in Š, razdalji do njiju skupaj pokrijeta natanko daljico HŠ, torej $3\,\mathrm{m}$. Če je zunaj, na primer pri $2$, pot do H prečka vso daljico in še $1\,\mathrm{m}$, pot do Š pa je spet $1\,\mathrm{m}$: skupaj $3 + 2 \cdot 1 = 5$. Zato je dno grafa-korita ravno, na višini $3$, kolikor meri daljica HŠ.

(višja raven) **Prepogib in ogledalo.** Graf $y = f(x)$ nariši na prosojni papir. Za $|f(x)|$ ga prepogni ob osi $x$ tako, da gre navzgor samo del pod osjo. Za $f(|x|)$ levo polovico odreži in na os $y$ postavi ogledalo.

## Drugače: Iz vsakdanjega življenja

Moko kupuješ v kilogramskih vrečkah. Za recept z $2{,}2\,\mathrm{kg}$ moke potrebuješ $3$ vrečke, za $2\,\mathrm{kg}$ samo $2$. Stopnice so kot pri parkirnini, polna pika je desno. Celi del pa šteje polne pladnje: če gre na pladenj $12$ piškotov, so iz $35$ piškotov $\lfloor 35/12 \rfloor = 2$ polna pladnja.

(višja raven) Pečica je nastavljena na $180\,{}^\circ\mathrm{C}$. Termostat poseže (vklopi ali izklopi grelec) šele, ko je odstopanje $|T - 180|$ večje od $5\,{}^\circ\mathrm{C}$. Graf odstopanja je »V« s temenom pri $180$. Termostat miruje, dokler je $|T - 180| \le 5$, torej od $175$ do $185\,{}^\circ\mathrm{C}$.

## Preveri se

? Na grafu stopničaste funkcije je pri $x = 4$ skok: na eni stopnici je polna pika, na drugi prazen krožec. Katera trditev je pravilna?
- $f(4)$ je višina stopnice s praznim krožcem.
~ Prazen krožec pomeni ravno nasprotno: točka ni na grafu.
+ $f(4)$ je višina stopnice s polno piko.
- $f(4)$ ima dve vrednosti, za vsako stopnico eno.
~ Funkcija vsakemu $x$ priredi natanko eno vrednost. Zato je na skoku polna samo ena pika.
- $f(4)$ ni določena, ker graf tam skoči.
~ Skok ni luknja: polna pika pri $x = 4$ je točka grafa, zato je $f(4)$ določena.
> Polna pika pove, da točka leži na grafu, prazen krožec, da ne. Vrednost $f(4)$ je višina stopnice s polno piko.

? Dostavna služba zaračuna paket po izmišljenem ceniku na sliki. Z grafa odčitaj, koliko skupaj plačaš za dva paketa z masama $2\,\mathrm{kg}$ in $5{,}2\,\mathrm{kg}$.
:::risba graf
opis: Graf cene paketa v evrih v odvisnosti od mase m v kilogramih. Stopnice: 3 € za maso od 0 do 2 kg, 4 € od 2 do 5 kg, 6 € od 5 do 10 kg. Na levem koncu vsake stopnice je prazen krožec, na desnem polna pika.
x: -0,5 .. 10,5 | 1 | m (kg)
y: 0 .. 7 | 1 | cena (€)
črta: 0; 3 -> 2; 3 | modra debelo
črta: 2; 4 -> 5; 4 | modra debelo
črta: 5; 6 -> 10; 6 | modra debelo
krog: 0; 3 | 0,17 | modra ozadje
krog: 2; 4 | 0,17 | modra ozadje
krog: 5; 6 | 0,17 | modra ozadje
točka: 2; 3
točka: 5; 4
točka: 10; 6
:::
= 9 €
~ 10 | Paket z maso $2\,\mathrm{kg}$ si prebral na višji stopnici. Pri $m = 2$ je tam prazen krožec, polna pika je na stopnici $3\,\text{€}$.
~ 7 | Paket z maso $5{,}2\,\mathrm{kg}$ si prebral na stopnici $4\,\text{€}$. Ta se konča pri $5\,\mathrm{kg}$; $5{,}2\,\mathrm{kg}$ je že na stopnici $6\,\text{€}$.
~ 8 | Oba paketa si prebral na stopnici $4\,\text{€}$. Pri $2\,\mathrm{kg}$ je polna pika spodaj ($3\,\text{€}$), $5{,}2\,\mathrm{kg}$ pa je nad $5\,\mathrm{kg}$ ($6\,\text{€}$).
> Pri $m = 2$ je polna pika na stopnici $3\,\text{€}$. Masa $5{,}2\,\mathrm{kg}$ leži nad stopnico $6\,\text{€}$. Skupaj $3 + 6 = 9\,\text{€}$.

? (višja raven) Nejc je zapisal funkcijo $f(x) = |x - 3| + |x|$ po primerih. V katerem koraku se je zmotil?

1. Izraza v absolutnih vrednostih imata ničli $0$ in $3$, zato ločimo tri primere.
2. Za $x < 0$: $f(x) = (-x - 3) + (-x) = -2x - 3$.
3. Za $0 \le x < 3$: $f(x) = (-x + 3) + x = 3$.
4. Za $x \ge 3$: $f(x) = (x - 3) + x = 2x - 3$.
- V 1. koraku.
~ Ničli sta res $0$ in $3$ in res razdelita os na tri intervale.
+ V 2. koraku.
- V 3. koraku.
~ Za $0 \le x < 3$ je $|x - 3| = -x + 3$ in $|x| = x$, vsota je res $3$.
- V 4. koraku.
~ Za $x \ge 3$ sta oba izraza nenegativna, $2x - 3$ je pravilno.
> Za $x < 0$ je $|x - 3| = -(x - 3) = -x + 3$, zato $f(x) = -2x + 3$. Nejčev predpis da pri $x = -1$ negativno vrednost $-1$, prava je $5$.

? (višja raven) Naj bo $f(x) = 2x - 4$. Primerjaj funkciji $g(x) = |f(x)|$ in $h(x) = f(|x|)$. Katera trditev je pravilna?
- Grafa $g$ in $h$ se ujemata za vsak $x$.
~ Ujemata se le za $x \ge 2$. Pri $x = 0$ je $g(0) = 4$, $h(0) = -4$.
- Oba grafa ležita nad osjo $x$ ali na njej.
~ To velja le za $g$. Pri $h$ ostane desna polovica premice, tudi del pod osjo: $h(0) = -4$.
+ $g$ ima najmanjšo vrednost $0$ pri $x = 2$, $h$ pa najmanjšo vrednost $-4$ pri $x = 0$.
- $h$ ima najmanjšo vrednost $0$ pri $x = 2$, $g$ pa $-4$ pri $x = 0$.
~ Zamenjal si $|f(x)|$ in $f(|x|)$. Absolutna vrednost na koncu ($g$) da samo nenegativne vrednosti.
> $g(x) = |2x - 4|$ je »V« s temenom $(2, 0)$. $h(x) = 2|x| - 4$ je »V« s temenom $(0, -4)$, saj je za $x \ge 0$ to premica $2x - 4$, leva polovica pa njena zrcalna slika čez os $y$.

? (brez računala) Izračunaj $\lfloor -3{,}7 \rfloor + \lfloor 3{,}7 \rfloor$.
= -1
~ 0 | Odrezal si decimalke ($-3 + 3$) ali zaokrožil na najbližje celo število ($-4 + 4$). Celi del vedno zaokroži navzdol: $\lfloor -3{,}7 \rfloor = -4$, ker je $-3$ večje od $-3{,}7$.
~ 1 | Obe števili si zaokrožil navzgor ($-3 + 4$). Celi del zaokroži navzdol: $\lfloor -3{,}7 \rfloor = -4$, $\lfloor 3{,}7 \rfloor = 3$.
> $\lfloor -3{,}7 \rfloor = -4$ in $\lfloor 3{,}7 \rfloor = 3$, vsota je $-1$.

<<RACUN
vrednost: floor(899/300) | 2
vrednost: floor(900/300) | 3
vrednost: floor(-2.7) | -3
vrednost: 1+3*1.5 | 5.5
enako: -(x-1)-(x+2) | -2*x-1
enako: -(x-1)+(x+2) | 3
enako: (x-1)+(x+2) | 2*x+1
vrednost: abs(0-1)+abs(0+2) | 3
resi: x^2-4=0 | x | -2, 2
vrednost: abs(3^2-4) | 5
vrednost: abs(1^2-4) | 3
resi: -2*x-1=5 | x | -3
resi: 2*x+1=5 | x | 2
neenacba: abs(x-1)+abs(x+2)<=5 | x | [-3, 2]
resi: abs(x^2-4)=3 | x | -sqrt(7), -1, 1, sqrt(7)
vrednost: floor(-3.7)+floor(3.7) | -1
>>

:::simboli
m | masa testa | | g
n | število štručk | n = \left\lfloor \frac{m}{300} \right\rfloor | –
x | neodvisna spremenljivka (v kuhinji lega na pultu) | |
a | poljubno realno število pod absolutno vrednostjo | |
f | funkcija | |
C | cena parkiranja | | €
t | čas parkiranja | | h
:::
