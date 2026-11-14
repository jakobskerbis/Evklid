---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

*(višja raven) Enačbe, neenačbe in sisteme s parametrom matura preverja samo na višji ravni.*

Konec 16. stoletja je francoski pravnik in kraljev svetovalec François Viète predlagal nekaj, kar se danes zdi samoumevno. S črkami naj ne označujemo le neznank, ampak tudi znana števila. Neznanke je pisal s samoglasniki, dane količine s soglasniki. Pred tem so matematiki reševali vsako nalogo z njenimi števili posebej. Z Vièteovim zapisom pa je ena rešitev veljala za celo družino nalog.

Takim črkam za »znano, a še ne izbrano« število danes rečemo **parametri**. Srečaš jih tudi pri zdravniku. Odmerek zdravila je odvisen od mase telesa, hitrost izločanja pa od ledvic in jeter. Formula mora veljati za vsakega bolnika. Pri neenačbi s parametrom se skriva past: od vrednosti parametra je lahko odvisno celo to, ali se znak neenačbe obrne.

## Razlaga

Začnimo z enim bolnikom in konkretnimi števili, šele nato preidimo na splošno.

**1. En bolnik do konca.** Bolnik ima ob začetku v krvi $20\,\text{mg}$ zdravila. Infuzija zdravilo dovaja, telo ga izloča; v preprostem modelu se količina vsako uro spremeni za $a\,\text{mg}$. Zdravilo deluje, dokler ga je v krvi vsaj $12\,\text{mg}$. Po $t$ urah mora torej veljati

$$20 + a t \ge 12$$

Recimo, da se količina vsako uro zmanjša za $2\,\text{mg}$, torej $a = -2$. Dobimo $-2t \ge -8$. Delimo z negativnim številom $-2$, zato se znak obrne: $t \le 4$. Zdravilo deluje $4$ ure.

Pri $a = 3$ (dovajanje prevlada) je $3t \ge -8$, torej $t \ge -\dfrac{8}{3}$. To velja za vsak $t \ge 0$: zdravilo deluje ves čas. Pri $a = 0$ dobimo $0 \cdot t \ge -8$, kar prav tako velja vedno.

Ista neenačba je dala tri različne vrste odgovorov. Odločil je predznak števila $a$.

**2. Splošno: neenačba $ax > b$.** Črka $a$ je zdaj parameter. Deliti smemo le z $a \neq 0$, pri negativnem $a$ pa se znak obrne:

| pogoj | rešitev neenačbe $ax > b$ |
|---|---|
| $a > 0$ | $x > \frac{b}{a}$ |
| $a < 0$ | $x < \frac{b}{a}$ (znak obrnjen) |
| $a = 0$, $b < 0$ | vsak $x \in \mathbb{R}$ |
| $a = 0$, $b \ge 0$ | ni rešitve |

Zadnji vrstici sledita iz neenačbe $0 > b$, v kateri $x$ sploh ne nastopa: ali velja za vse $x$ ali za nobenega. Pri nestrogi neenačbi $ax \ge b$ in $a = 0$ preveriš $0 \ge b$, zato pri $b = 0$ rešitev tvorijo vsa realna števila.

Pogosto parameter ni sam, ampak v izrazu. Pri $(m-1)x > 3$ je koeficient $m - 1$: pozitiven za $m > 1$, negativen za $m < 1$, enak $0$ pri $m = 1$.

:::premisli
Ana je zapisala: »Rešitev $(m-1)x > 3$ je $x > \dfrac{3}{m-1}$ za vse $m \neq 1$.« Preizkusi njen odgovor pri $m = 0$ z $x = 0$. Kaj opaziš?
---
Pri $m = 0$ je neenačba $-x > 3$, za $x = 0$ dobimo $0 > 3$, kar ne velja. Po Aninem zapisu pa bi bil $x = 0$ rešitev, saj je $0 > -3$. Za $m < 1$ je koeficient negativen in znak se obrne: $x < \dfrac{3}{m-1}$.
:::

**3. Ponovitev: enačba s parametrom.** Iz linearnih enačb že veš, da ima $ax = b$ pri $a \neq 0$ eno rešitev $x = \dfrac{b}{a}$, pri $a = 0$ in $b \neq 0$ nobene, pri $a = 0$ in $b = 0$ pa je rešitev vsako realno število. Pri enačbi se znak ne obrača, primer $a = 0$ pa je enako pomemben.

Primer: $(m^2 - 4)x = m - 2$. Koeficient razstavimo: $(m-2)(m+2)x = m - 2$.

- Za $m \neq 2$ in $m \neq -2$: $x = \dfrac{m-2}{(m-2)(m+2)} = \dfrac{1}{m+2}$.
- Za $m = 2$: $0 \cdot x = 0$, rešitev je vsako realno število.
- Za $m = -2$: $0 \cdot x = -4$, rešitve ni.

**4. Sistem s parametrom.** Vzemimo sistem

$$\begin{cases} y = mx + 1 \\ y = (m^2 - 2)x + m - 1 \end{cases}$$

Najprej konkretno, $m = 1$: $y = x + 1$ in $y = -x$. Izenačimo: $x + 1 = -x$, torej $x = -\dfrac{1}{2}$ in $y = \dfrac{1}{2}$.

Zdaj splošno. Izenačimo desni strani: $mx + 1 = (m^2 - 2)x + m - 1$. Člene z $x$ zberemo na levi: $(m - m^2 + 2)x = m - 2$. Koeficient razstavimo, $m - m^2 + 2 = -(m-2)(m+1)$, in dobimo $-(m-2)(m+1)x = m - 2$. To je enačba s parametrom iz prejšnjega razdelka.

- Za $m \neq 2$ in $m \neq -1$: $x = -\dfrac{1}{m+1}$ in $y = mx + 1 = \dfrac{1}{m+1}$. Ena rešitev.
- Za $m = 2$: $0 \cdot x = 0$. Obe enačbi sta $y = 2x + 1$: neskončno rešitev.
- Za $m = -1$: $0 \cdot x = -3$. Premici $y = -x + 1$ in $y = -x - 2$ sta vzporedni: rešitve ni.

Preizkus pri $m = 1$: formula da $x = -\dfrac{1}{2}$ in $y = \dfrac{1}{2}$, enako kot zgoraj. Tak preizkus s konkretno vrednostjo parametra hitro ujame napako v predznaku.

Na sliki sta obe premici. V aplikaciji parameter $m$ spreminjaš z drsnikom:

:::risba graf
opis: Premici sistema: modra y = mx + 1 in oranžna črtkana y = (m² − 2)x + m − 1. V aplikaciji se parameter m spreminja z drsnikom od −3 do 3; izbrano je m = {m}. Pri m = 1 se premici sekata v točki (−0,5; 0,5), pri m = 2 se prekrivata, pri m = −1 sta vzporedni.
x: -4 .. 4 | 1 | x
y: -4 .. 4 | 1 | y
enako: da
drsnik: m | -3 .. 3 | 1 | 1 | parameter m
f: m*x + 1 | modra
f: (m*m - 2)*x + m - 1 | oranžna črtkano
podnapis: Premici sistema pri m = {m}
:::

Število rešitev sistema in lega premic se ujemata:

| rešitve | premici | koeficient pri $x$ |
|---|---|---|
| ena | se sekata | $\neq 0$ |
| nobene | vzporedni, različni | $0$, desno $\neq 0$ |
| neskončno | sovpadata | $0$, desno $0$ |

:::premisli
Pri katerih dveh vrednostih $m$ imata premici sistema enak smerni koeficient? Napovej, kaj se zgodi z rešitvijo pri vsaki.
---
Smerna koeficienta sta $m$ in $m^2 - 2$; enaka sta, ko je $m^2 - m - 2 = 0$, torej pri $m = 2$ in $m = -1$. Pri $m = 2$ sta tudi začetni vrednosti enaki ($1$ in $1$), premici sovpadata in rešitev je neskončno. Pri $m = -1$ sta začetni vrednosti $1$ in $-2$, premici sta vzporedni in rešitve ni.
:::

V simulaciji spodaj (»Sistem dveh enačb grafično«) nastavi dve premici z enakim naklonom. Opazi, da presečišče izgine, razen če se premici povsem prekrijeta.

## Rešeni primeri

### Primer 1: neenačba s parametrom

Reši neenačbo $mx - 1 > 2x + 3$ za vse vrednosti parametra $m$.

**Podatki:** neenačba $mx - 1 > 2x + 3$, parameter $m \in \mathbb{R}$
**Iščemo:** rešitev $x$ za vsako vrednost $m$

:::formula
$ax > b$: za $a > 0$ je $x > \dfrac{b}{a}$, za $a < 0$ je $x < \dfrac{b}{a}$, za $a = 0$ preveri $0 > b$
:::

**Rešitev:**

1. Člene z $x$ zberemo na levi: $mx - 2x > 3 + 1$, torej $(m - 2)x > 4$.
2. Za $m > 2$ je koeficient pozitiven: $x > \dfrac{4}{m-2}$.
3. Za $m < 2$ je negativen, znak se obrne: $x < \dfrac{4}{m-2}$.
4. Za $m = 2$: $0 \cdot x > 4$, kar ne velja za noben $x$.
5. Preizkus pri $m = 0$: $-2x > 4$ da $x < -2$, formula da $\dfrac{4}{0 - 2} = -2$.
6. Odgovor: za $m > 2$ je $x \in \left(\dfrac{4}{m-2}, \infty\right)$, za $m < 2$ je $x \in \left(-\infty, \dfrac{4}{m-2}\right)$, za $m = 2$ rešitve ni.

### Primer 2: ko rešitev postane vsa realna števila

Reši neenačbo $ax + 3 \le x + a + 2$ za vse vrednosti parametra $a$.

**Podatki:** neenačba $ax + 3 \le x + a + 2$, parameter $a \in \mathbb{R}$
**Iščemo:** rešitev $x$ za vsako vrednost $a$

:::formula
$ax \le b$: deli s pozitivnim koeficientom, pri negativnem obrni znak, primer $0$ reši posebej
:::

**Rešitev:**

1. Uredimo: $ax - x \le a + 2 - 3$, torej $(a - 1)x \le a - 1$.
2. Za $a > 1$ delimo s pozitivnim $a - 1$: $x \le 1$.
3. Za $a < 1$ delimo z negativnim $a - 1$ in znak obrnemo: $x \ge 1$.
4. Za $a = 1$: $0 \cdot x \le 0$, kar velja za vsak $x$ (neenačba je nestroga).
5. Odgovor: za $a > 1$ je $x \in (-\infty, 1]$, za $a < 1$ je $x \in [1, \infty)$, za $a = 1$ je rešitev vsako realno število.

Primerjaj z enačbo $(a-1)x = a - 1$: tam je za vse $a \neq 1$ rešitev ista, $x = 1$. Pri neenačbi pa predznak $a - 1$ odloči, na katero stran od $1$ ležijo rešitve.

### Primer 3: sistem v splošni obliki

Za katere vrednosti parametra $m$ ima sistem $x + my = 2$, $mx + 4y = 4$ eno rešitev, za katere nobene in za katere neskončno? Kadar je rešitev ena, jo izrazi z $m$.

**Podatki:** $x + my = 2$, $mx + 4y = 4$, parameter $m \in \mathbb{R}$
**Iščemo:** število rešitev glede na $m$ in rešitev $(x, y)$, ko je ena

:::formula
zamenjava: iz prve enačbe $x = 2 - my$, vstavi v drugo; dobiš enačbo $Ay = B$ s parametrom
:::

**Rešitev:**

1. Iz prve enačbe: $x = 2 - my$.
2. Vstavimo v drugo: $m(2 - my) + 4y = 4$, torej $(4 - m^2)y = 4 - 2m$.
3. Razstavimo: $(2 - m)(2 + m)y = 2(2 - m)$.
4. Za $m \neq \pm 2$: $y = \dfrac{2}{m+2}$ in $x = 2 - \dfrac{2m}{m+2} = \dfrac{4}{m+2}$.
5. Za $m = 2$: $0 \cdot y = 0$. Druga enačba $2x + 4y = 4$ je dvakratnik prve: premici sovpadata, rešitev je neskončno.
6. Za $m = -2$: $0 \cdot y = 8$. Enačbi sta $x - 2y = 2$ in $x - 2y = -2$: vzporedni premici, rešitve ni.
7. Preizkus pri $m = 0$: sistem $x = 2$, $4y = 4$ ima rešitev $(2, 1)$, formula da $\left(\dfrac{4}{2}, \dfrac{2}{2}\right) = (2, 1)$.
8. Odgovor: za $m \neq \pm 2$ je ena rešitev $\left(\dfrac{4}{m+2}, \dfrac{2}{m+2}\right)$; za $m = 2$ jih je neskončno, za $m = -2$ ni nobene.

### Primer 4: zdaj ti

Bolnik ima v krvi $30\,\text{mg}$ zdravila. Vsako uro se količina spremeni za $a\,\text{mg}$. Nad $45\,\text{mg}$ bi zdravilo škodilo. Koliko časa je bolnik varen, odvisno od $a$? Koliko ur je to pri $a = 5$?

**Podatki:** začetna količina $30\,\text{mg}$, sprememba $a\,\text{mg}$ na uro, meja $45\,\text{mg}$, $t \ge 0$
**Iščemo:** čas $t$, ko je količina največ $45\,\text{mg}$, glede na $a$; vrednost pri $a = 5$

:::formula
$30 + a t \le 45$
:::

**Rešitev:**

1. Uredimo: $a t \le 15$.
2. Pri $a \le 0$ je $a t \le 0 < 15$ za vsak $t \ge 0$: bolnik je ves čas varen.
3. Obravnavaj še $a > 0$ in vstavi $a = 5$.

:::premisli
Kaj dobiš za $a > 0$ in koliko ur je to pri $a = 5$?
---
Za $a > 0$ delimo s pozitivnim številom in znak ostane: $t \le \dfrac{15}{a}$. Pri $a = 5$ je $t \le \dfrac{15}{5} = 3$: bolnik je varen $3$ ure.
:::

## Pogoste napake

- **»Delim z $m - 2$ in je.«** Znak ostane le pri pozitivnem deljitelju. Kdor za vse $m$ zapiše $x > \dfrac{4}{m-2}$, ima za $m < 2$ ravno nasprotne rešitve. Popravek: posebej obravnavaj pozitiven in negativen koeficient.
- **Pozabljen primer, ko je koeficient $0$.** Z izrazom s parametrom ne smeš deliti, dokler ne izločiš vrednosti, pri katerih je enak $0$. Popravek: najprej poišči te vrednosti in jih reši neposredno.
- **»$0 \cdot x > b$ nima nikoli rešitve.«** Napačno: pri $b < 0$ neenačba $0 > b$ velja za vsak $x$. Pazi še na strogost: $0 > 0$ ne velja, $0 \ge 0$ velja.
- **»$0 = 0$ pomeni $x = 0$.«** Pri sistemu ali enačbi enakost $0 = 0$ pove, da zadošča vsak $x$ (premici sovpadata), ne da je $x = 0$. $0 = 8$ pa pomeni, da rešitve ni.
- **Krajšanje brez pogoja.** Kdor v $(2 - m)(2 + m)y = 2(2 - m)$ kar krajša $2 - m$, izgubi primer $m = 2$ z neskončno rešitvami.

## Povzetek

- Parameter je črka za dano, a poljubno število. Rešitev zapišemo po primerih glede na vrednost parametra.
- Neenačba $ax > b$: za $a > 0$ je $x > \frac{b}{a}$, za $a < 0$ je $x < \frac{b}{a}$ (deljenje z negativnim številom obrne znak), za $a = 0$ preverimo $0 > b$ (velja za vse $x$ ali za nobenega).
- Enačba $ax = b$: za $a \neq 0$ ena rešitev, za $a = 0$ in $b \neq 0$ nobene, za $a = 0$ in $b = 0$ vsa realna števila.
- Sistem dveh linearnih enačb s parametrom prevedemo na enačbo $Ax = B$ s parametrom: ena rešitev (premici se sekata), nobene (vzporedni), neskončno (sovpadata).
- Rezultat preverimo z vstavitvijo ene konkretne vrednosti parametra.

## Drugače: Z analogijo

**Podzemna garaža.** Nadstropje $3$ je višje od nadstropja $1$. Pod zemljo pa je $-3$ globlje od $-1$. Množenje z negativnim številom »prezrcali« števila čez $0$ in vrstni red se obrne. Zato se pri deljenju z negativnim parametrom obrne znak neenačbe. Pri parametru ne vemo vnaprej, ali smo nad zemljo ali pod njo, zato pogledamo oba primera.

**Dve planinski poti.** Dve ravni poti se lahko križata v eni točki, tečeta vzporedno in se nikoli ne srečata ali pa sta ena in ista pot. Parameter je kot vremenska ujma, ki eno pot premakne ali zasuče. Za večino vrednosti se poti še vedno križata. Le pri posebnih vrednostih postaneta vzporedni ali se prekrijeta.

## Drugače: Bolj natančno

Premici $a_1 x + b_1 y = c_1$ in $a_2 x + b_2 y = c_2$ sta vzporedni ali sovpadata natanko takrat, ko velja

$$a_1 b_2 = a_2 b_1$$

Pri $b_1 \neq 0$ in $b_2 \neq 0$ je to isto kot $-\dfrac{a_1}{b_1} = -\dfrac{a_2}{b_2}$, torej enaka smerna koeficienta; pogoj pa zajame tudi navpične premice. V Primeru 3 je $a_1 = 1$, $b_1 = m$, $a_2 = m$, $b_2 = 4$, pogoj $4 = m^2$ pa da ravno $m = \pm 2$. Ali sta premici vzporedni ali isti, nato pove še prosti člen. Številu $a_1 b_2 - a_2 b_1$ boš kasneje rekel determinanta sistema.

Pri neenačbi je razlog za obrat znaka tale: če je $a < 0$ in $ax > b$, potem pomnožimo z negativnim številom $\dfrac{1}{a}$, to pa obrne vrstni red vseh števil na številski premici.

## Preveri se

? Tri od teh neenačb imajo isto množico rešitev. Katera je izjema?
- $-2x > 6$
~ Deliš z $-2$ in obrneš znak: $x < -3$, enako kot pri ostalih dveh.
- $3x < -9$
~ Deliš s pozitivnim $3$, znak ostane: $x < -3$.
+ $-2x < 6$
- $-\dfrac{x}{3} > 1$
~ Pomnožiš z $-3$ in obrneš znak: $x < -3$.
> Prve tri imajo rešitev $x < -3$. Pri $-2x < 6$ deljenje z $-2$ obrne znak in da $x > -3$.

? Na sliki sta premici sistema $y = mx + 1$ in $y = -2x + 3$ pri $m = 0$. Parameter $m$ spreminja le naklon modre premice. Za kateri $m$ sistem nima rešitve?
:::risba graf
opis: Modra vodoravna premica y = 1 (sistem pri m = 0) in oranžna črtkana padajoča premica y = −2x + 3. Sekata se v točki (1, 1).
x: -2 .. 4 | 1 | x
y: -2 .. 4 | 1 | y
enako: da
f: 0*x + 1 | modra
f: -2*x + 3 | oranžna črtkano | -0,5 .. 2,5
točka: 1; 1 | (1, 1) | nad
:::
= -2
~ 0,5 | To je pogoj za pravokotnost ($k_1 k_2 = -1$). Rešitve ni, ko sta premici vzporedni: $k_1 = k_2$.
~ 2 | Smerni koeficient oranžne premice je $-2$, ne $2$.
~ 0 | Pri $m = 0$ (na sliki) se premici sekata v $(1, 1)$, rešitev je ena.
> Vzporedni sta pri $m = -2$; začetni vrednosti $1$ in $3$ sta različni, zato se premici ne sekata in rešitve ni.

? Jure je rešil neenačbo $mx + 3 < 3x + m$ za vse $m$:
**A** $mx - 3x < m - 3$
**B** $(m - 3)x < m - 3$
**C** za $m \neq 3$ delimo z $m - 3$ in dobimo $x < 1$
**D** za $m = 3$ dobimo $0 < 0$, kar ne velja, zato rešitve ni
Kateri korak je napačen?
- Korak A
~ Člena $3x$ in $3$ sta pravilno prenesena z nasprotnim predznakom.
- Korak B
~ Izpostavljanje $x$ je pravilno: $mx - 3x = (m-3)x$.
+ Korak C
- Korak D
~ $0 < 0$ res ne velja (neenačba je stroga), zato rešitve ni. Korak je pravilen.
> Za $m < 3$ je $m - 3$ negativen, zato se znak obrne: $x > 1$. Pravilno: za $m > 3$ je $x < 1$, za $m < 3$ je $x > 1$.

? (brez računala) Za katero vrednost parametra $m$ sistem $2x + my = 1$, $4x + 6y = 5$ nima rešitve?
= 3
~ -3 | Predznak: smerna koeficienta sta $-\dfrac{2}{m}$ in $-\dfrac{2}{3}$, enaka sta pri $m = 3$.
~ -1,33 | To je pogoj za pravokotnost. Rešitve ni pri vzporednih premicah.
~ 1,33 | Razmerje je obrnjeno. Pogoj je $2 \cdot 6 = 4 \cdot m$.
> $2 \cdot 6 = 4m$ da $m = 3$. Tedaj je prva enačba $2x + 3y = 1$, druga pa $2x + 3y = \dfrac{5}{2}$: vzporedni premici, rešitve ni.

? Razvrsti korake reševanja neenačbe s parametrom.
1. Člene z $x$ zberi na levi, ostale na desni.
2. Izpostavi $x$, da dobiš obliko $ax > b$.
3. Poišči vrednosti parametra, pri katerih je $a = 0$.
4. Obravnavaj $a > 0$ (znak ostane), $a < 0$ (znak se obrne) in $a = 0$ posebej.
5. Zapiši rešitev za vsak primer posebej in jo preveri s konkretno vrednostjo.
> Najprej neenačbo uredimo, nato ugotovimo, kdaj je koeficient $0$, šele potem delimo, ločeno po predznaku.

<<RACUN
neenacba: 20-2*t>=12 | t | (-oo, 4]
neenacba: 3*t>=-8 | t | [-8/3, oo)
resi: (1^2-4)*x=1-2 | x | 1/3
enako: (m-2)/((m-2)*(m+2)) | 1/(m+2)
resi: y=x+1, y=-x | x, y | x=-1/2, y=1/2
enako: m-m^2+2 | -(m-2)*(m+1)
enako: m*(-1/(m+1))+1 | 1/(m+1)
resi: y=3*x+1, y=7*x+2 | x, y | x=-1/4, y=1/4
neenacba: 2*x>4 | x | (2, oo)
neenacba: -2*x>4 | x | (-oo, -2)
neenacba: 2*x<=2 | x | (-oo, 1]
neenacba: -x<=-1 | x | [1, oo)
enako: (2-m)*(2+m) | 4-m^2
enako: 2-2*m/(m+2) | 4/(m+2)
resi: x+3*y=2, 3*x+4*y=4 | x, y | x=4/5, y=2/5
resi: x=2, 4*y=4 | x, y | x=2, y=1
resi: x-2*y=2, -2*x+4*y=4 | x, y | none
neenacba: 30+5*t<=45 | t | (-oo, 3]
resi: -2*x+1=-2*x+3 | x | none
resi: 2*x+3*y=1, 4*x+6*y=5 | x, y | none
neenacba: -2*x<6 | x | (-3, oo)
neenacba: -x/3>1 | x | (-oo, -3)
>>

:::simboli
a | koeficient pri $x$ (odvisen od parametra) | | | 
b | desna stran neenačbe | | | 
x | neznanka | | | 
t | čas od začetka opazovanja | | h | 
y | druga neznanka sistema | | | 
m | parameter | | | dano, a poljubno realno število
A, B | koeficient in desna stran enačbe za $y$ | | | v Primeru 3: $A = 4 - m^2$, $B = 4 - 2m$
a_1, b_1, c_1 | koeficienta in prosti člen prve enačbe | | | 
a_2, b_2, c_2 | koeficienta in prosti člen druge enačbe | | | 
:::
