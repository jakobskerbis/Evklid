---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ko je Willard Libby sredi 20. stoletja razvijal radiokarbonsko datiranje, je imel eno samo meritev: koliko $^{14}\mathrm{C}$ je še ostalo v vzorcu lesa ali kosti. Ključ je bil zakon, da vsak trenutek razpade enak delež preostalih jeder, torej je **hitrost spreminjanja** sorazmerna s številom jeder. Metodo je preveril na vzorcih znane starosti, med drugim na lesu iz egipčanskih grobnic. Zakon, ki povezuje neznano funkcijo in njen odvod, je **diferencialna enačba**; njena rešitev ni število, ampak **funkcija** časa. Enako obliko imajo zakoni, ki jih srečaš na dolgi vožnji: kofein iz kave na počivališču se iz krvi izloča po kinetiki prvega reda, hladilna tekočina parkiranega avta pa se ohlaja proti temperaturi zraka. Ko rešitev poznaš, napoveš prihodnost sistema ali izračunaš, kdaj bo dosežena želena vrednost.

Obravnavamo dve najpomembnejši vrsti enačb prvega reda:

- **ločljive** (separabilne) enačbe $y' = f(x)\,g(y)$,
- **linearne** enačbe $y' + p(x)\,y = q(x)$,

ter **začetni problem**, pri katerem iz družine rešitev izberemo tisto, ki ustreza začetnemu stanju. Spoznamo tudi osnovne **modele rasti in razpada** in izrek, ki pove, kdaj rešitev sploh obstaja in je ena sama. Potrebuješ odvod, nedoločeni integral in lastnosti eksponentne ter logaritemske funkcije.

## Razlaga

### Najprej slika: zemljevid smerokazov

Predstavljaj si zemljevid, na katerem v vsaki točki stoji smerokaz, ki pove, kako strmo naprej. Enačba $y' = 2y$ je natanko tak zemljevid: v točki na višini $y$ kaže naklon $2y$, ne glede na $x$.

| višina $y$ | naklon $2y$ | smer poti |
|---|---|---|
| $-1$ | $-2$ | strmo navzdol |
| $0$ | $0$ | vodoravno |
| $1$ | $2$ | navzgor |
| $2$ | $4$ | še strmeje navzgor |

**Rešitev** je pot, ki v vsaki točki sledi smerokazu, **začetni pogoj** pa je izhodišče poti. Iz vsakega izhodišča vodi ena pot, vse skupaj pa tvorijo družino krivulj.

:::premisli
Na tem zemljevidu začneš v točki $(0, 1)$. Napovej: ali pot postaja strmejša ali položnejša? Kaj pa, če začneš v $(0, 0)$?
---
Strmejša: višje ko si, večji je naklon, zato se vzpon pospešuje (eksponentna rast, pot je $y = e^{2x}$). Iz $(0, 0)$ ostaneš na osi $x$, ker je tam naklon povsod $0$: to je konstantna rešitev $y = 0$.
:::

### Simboli in postopki

**1. Kaj je diferencialna enačba.** **Navadna diferencialna enačba** je enačba, ki povezuje neodvisno spremenljivko $x$, neznano funkcijo $y = y(x)$ in njene odvode. **Red** enačbe je red najvišjega odvoda, ki v njej nastopa. Enačba prvega reda ima obliko $F(x, y, y') = 0$, najpogosteje pa jo zapišemo razrešeno na odvod:

$$y' = f(x, y).$$

Naj bo $f$ definirana na množici $D \subseteq \mathbb{R}^2$. **Rešitev** na odprtem intervalu $I$ je odvedljiva funkcija $y\colon I \to \mathbb{R}$, za katero je $(x, y(x)) \in D$ in $y'(x) = f(x, y(x))$ za vse $x \in I$. Primer: $y = Ce^{2x}$ je rešitev enačbe $y' = 2y$ za vsak $C \in \mathbb{R}$, saj je $y' = 2Ce^{2x} = 2y$. Družini rešitev s poljubno konstanto pravimo **splošna rešitev**. Vsako rešitev preverimo tako, da jo vstavimo v enačbo.

**2. Začetni problem.** Splošna rešitev enačbe prvega reda vsebuje eno konstanto. Da jo določimo, potrebujemo en podatek, **začetni pogoj** $y(x_0) = y_0$. Enačba skupaj z začetnim pogojem je **začetni problem** (Cauchyjeva naloga):

$$y' = f(x, y), \qquad y(x_0) = y_0.$$

Za $y' = 2y$, $y(0) = 3$ dobimo $3 = Ce^0$, torej $C = 3$ in $y = 3e^{2x}$. Rešitev začetnega problema imenujemo **partikularna rešitev**.

**3. Ločljive enačbe.** Enačba je **ločljiva**, če lahko desno stran zapišemo kot produkt funkcije samo $x$ in funkcije samo $y$:

$$\frac{dy}{dx} = f(x)\, g(y).$$

Postopek **ločitve spremenljivk**:

1. Poiščemo **konstantne rešitve**: če je $g(y_0) = 0$, je $y \equiv y_0$ rešitev (odvod konstante je $0$).
2. Za $g(y) \neq 0$ ločimo spremenljivke: $\dfrac{dy}{g(y)} = f(x)\, dx$.
3. Integriramo obe strani: $\displaystyle \int \frac{dy}{g(y)} = \int f(x)\, dx + C$. Konstanto pišemo le na eni strani.
4. Če gre, izrazimo $y$; sicer ostane rešitev v **implicitni** obliki.
5. Konstanto določimo iz začetnega pogoja.

**Izrek (ločitev spremenljivk).** Naj bo $f$ zvezna na intervalu $I$, $g$ zvezna na intervalu $J$ in $g(y) \neq 0$ za vse $y \in J$; $F$ naj bo primitivna funkcija $f$, $G$ pa primitivna funkcija $\frac{1}{g}$. Potem je odvedljiva funkcija $y\colon I \to J$ rešitev enačbe $y' = f(x)g(y)$ natanko tedaj, ko je $G(y(x)) = F(x) + C$ za neko konstanto $C$.

*Dokaz.* Po verižnem pravilu je $\frac{d}{dx}G(y(x)) = \frac{y'(x)}{g(y(x))}$. To je enako $f(x)$ natanko tedaj, ko je $y' = f(x)g(y)$, funkciji z enakim odvodom na intervalu pa se razlikujeta za konstanto. Zapis $\frac{dy}{g(y)} = f(x)\,dx$ je le okrajšava tega računa.

:::premisli
Zakaj moramo konstantne rešitve poiskati že na začetku, preden ločimo spremenljivke?
---
Ker v koraku 2 delimo z $g(y)$, kar pri $g(y) = 0$ ni dovoljeno. Rešitve $y \equiv y_0$ z $g(y_0) = 0$ ločitev spremenljivk zato sama ne najde; na zemljevidu so to vodoravne poti.
:::

Primer: $y' = xy$. Konstantna rešitev je $y = 0$. Za $y \neq 0$: $\int \frac{dy}{y} = \int x\, dx$, torej $\ln|y| = \frac{x^2}{2} + C$ in $|y| = e^C e^{x^2/2}$. Ker je $\pm e^C$ poljubno neničelno število, pišemo $y = Ke^{x^2/2}$; vrednost $K = 0$ zajame še konstantno rešitev.

**4. Linearne enačbe prvega reda.** Enačba je **linearna**, če neznana funkcija in njen odvod nastopata le v prvi potenci in se ne množita med seboj:

$$y' + p(x)\, y = q(x).$$

Če je $q \equiv 0$, je enačba **homogena** in ločljiva: $y_h = Ce^{-P(x)}$, kjer je $P$ primitivna funkcija $p$. Za nehomogeno enačbo uporabimo **integrirajoči množitelj** $\mu(x) = e^{P(x)}$. Ker je $\mu' = p\mu$, je po pravilu za odvod produkta

$$(\mu y)' = \mu y' + p\mu y = \mu q.$$

Leva stran je odvod produkta, zato integriramo:

$$y(x) = e^{-P(x)}\left(\int q(x)\, e^{P(x)}\, dx + C\right).$$

Enak rezultat da **variacija konstante**: v homogeni rešitvi $y = C e^{-P}$ konstanto nadomestimo s funkcijo $C(x)$. Iz $y = C(x)e^{-P}$ sledi $y' = C'e^{-P} - pCe^{-P}$, torej $y' + py = C'e^{-P}$. Enačba zahteva $C'e^{-P} = q$, zato je $C'(x) = q\, e^{P}$ in $C(x) = \int q\,e^{P}\,dx + C$.

**Izrek (zgradba rešitve).** Naj bosta $p$ in $q$ zvezni na intervalu $I$ in naj bo $y_p$ ena rešitev enačbe $y' + py = q$ na $I$. Potem je vsaka rešitev na $I$ oblike $y = y_p + Ce^{-P}$: **splošna rešitev nehomogene enačbe = splošna rešitev homogene + ena partikularna rešitev nehomogene**, $y = y_h + y_p$. Za $y_p$ je dobra katerakoli rešitev, ne nujno tista z danim začetnim pogojem. Za vsak $x_0 \in I$ in $y_0 \in \mathbb{R}$ ima začetni problem natanko eno rešitev, in to na celem $I$.

*Dokaz.* Če je $y$ rešitev, je $u = y - y_p$ rešitev homogene enačbe $u' + pu = 0$. Tedaj je $(ue^{P})' = (u' + pu)e^{P} = 0$, zato je $ue^{P}$ na intervalu konstanta in $u = Ce^{-P}$. Ker je $e^{-P(x_0)} \neq 0$, začetni pogoj določi $C$ enolično.

**5. Modeli rasti in razpada.** Najpreprostejši model pravi, da je hitrost spreminjanja količine sorazmerna s količino:

$$\frac{dN}{dt} = kN \quad\Rightarrow\quad N(t) = N_0\, e^{kt}.$$

- Za $k > 0$ je to **eksponentna rast** (bakterije v ugodnem okolju, obrestovanje). **Podvojitveni čas** je $t_2 = \dfrac{\ln 2}{k}$.
- Za $k < 0$ pišemo $k = -\lambda$ in dobimo **eksponentni razpad** (radioaktivni razpad, kinetika prvega reda, izločanje zdravila iz krvi). **Razpolovni čas** je $t_{1/2} = \dfrac{\ln 2}{\lambda}$ in ni odvisen od začetne količine: iz $\frac{N_0}{2} = N_0e^{-\lambda t}$ sledi $e^{\lambda t} = 2$.

Pri kemijski kinetiki prvega reda pišemo $\dfrac{dc}{dt} = -kc$ in $c(t) = c_0 e^{-kt}$, kjer je $k$ **konstanta hitrosti** z enoto $\mathrm{s^{-1}}$ ali $\mathrm{min^{-1}}$.

Bolj realističen model rasti je **logistična enačba**

$$\frac{dN}{dt} = rN\left(1 - \frac{N}{K}\right),$$

kjer je $K$ **nosilnost okolja**. Je ločljiva s konstantnima rešitvama $N = 0$ in $N = K$. Za $0 < N < K$ ločimo spremenljivki in uporabimo razcep $\frac{K}{N(K - N)} = \frac{1}{N} + \frac{1}{K - N}$:

$$\int \frac{K\,dN}{N(K - N)} = \ln\frac{N}{K - N} = rt + C \quad\Rightarrow\quad \frac{N}{K - N} = \frac{N_0}{K - N_0}\,e^{rt} \quad\Rightarrow\quad N(t) = \frac{K}{1 + \left(\frac{K}{N_0} - 1\right)e^{-rt}}.$$

Na začetku raste skoraj eksponentno, nato se približuje $K$. Hitrost $rN\left(1 - \frac{N}{K}\right)$ je kvadratna funkcija $N$ z ničlama $0$ in $K$, zato je največja, $\frac{rK}{4}$, pri $N = \frac{K}{2}$.

**Newtonov zakon ohlajanja** $\dfrac{dT}{dt} = -k(T - T_\mathrm{o})$, kjer je $T_\mathrm{o}$ temperatura okolice, je linearen. Rešitev je $T(t) = T_\mathrm{o} + (T_0 - T_\mathrm{o})e^{-kt}$: razlika do okolice razpada eksponentno. Linearne so tudi **enačbe mešanja** (koliko soli je v posodi, v katero priteka raztopina) in enačba za tok v vezju z uporom in tuljavo.

**6. Obstoj in enoličnost rešitve.** Ali ima začetni problem sploh rešitev in ali je ena sama? Odgovor da izrek o obstoju in enoličnosti (Picardov izrek):

> Naj bosta $f$ in $\dfrac{\partial f}{\partial y}$ zvezni na pravokotniku $R = [x_0 - a, x_0 + a] \times [y_0 - b, y_0 + b]$, $a, b > 0$. Potem obstaja $h > 0$, da ima začetni problem $y' = f(x, y)$, $y(x_0) = y_0$ na intervalu $[x_0 - h, x_0 + h]$ natanko eno rešitev.

Izrek zagotavlja rešitev le **lokalno**, na nekem intervalu okoli $x_0$. Rešitev lahko »pobegne v neskončnost« v končnem času, kot bomo videli v Primeru 2. Za linearno enačbo z zveznima $p$ in $q$ na intervalu $I$ pa rešitev obstaja in je enolična na **celem** $I$. Pogoji so zadostni, ne potrebni. Ko niso izpolnjeni, ima lahko začetni problem več rešitev: $y' = 3y^{2/3}$, $y(0) = 0$ rešita $y \equiv 0$ in $y = x^3$, ker je $f = 3y^{2/3}$ sicer zvezna, $\frac{\partial f}{\partial y} = 2y^{-1/3}$ pa pri $y = 0$ ne obstaja.

## Rešeni primeri

### Primer 1 (lažji)

Snov A razpada po kinetiki prvega reda s konstanto hitrosti $k = 0{,}0250\,\mathrm{min^{-1}}$. Začetna množinska koncentracija je $c_0 = 0{,}80\,\mathrm{mol/L}$. Kolikšna je koncentracija po $40\,\mathrm{min}$ in kolikšen je razpolovni čas?

**Podatki:** $\dfrac{dc}{dt} = -kc$, $k = 0{,}0250\,\mathrm{min^{-1}}$, $c_0 = 0{,}80\,\mathrm{mol/L}$, $t = 40\,\mathrm{min}$
**Iščemo:** koncentracijo $c(40\,\mathrm{min})$ in razpolovni čas $t_{1/2}$

:::formula
Ločitev spremenljivk: $\int \frac{dc}{c} = -\int k\, dt$, rešitev $c(t) = c_0 e^{-kt}$. Razpolovni čas: $t_{1/2} = \frac{\ln 2}{k}$.
:::

**Rešitev:**

1. Ločimo spremenljivki: $\frac{dc}{c} = -k\, dt$, integriramo: $\ln c = -kt + C$ (koncentracija je pozitivna).
2. Iz $c(0) = c_0$ sledi $C = \ln c_0$, torej $c(t) = c_0 e^{-kt}$.
3. Eksponent: $kt = 0{,}0250\,\mathrm{min^{-1}} \cdot 40\,\mathrm{min} = 1{,}00$ (brez enote, kot mora biti).
4. $c(40\,\mathrm{min}) = 0{,}80\,\mathrm{mol/L} \cdot e^{-1} = 0{,}80 \cdot 0{,}3679\,\mathrm{mol/L} = 0{,}294\,\mathrm{mol/L}$.
5. Razpolovni čas: $t_{1/2} = \frac{\ln 2}{0{,}0250\,\mathrm{min^{-1}}} = \frac{0{,}6931}{0{,}0250}\,\mathrm{min} = 27{,}7\,\mathrm{min}$.
6. Preizkus: $40\,\mathrm{min}$ je med enim in dvema razpolovnima časoma, zato mora biti koncentracija med $0{,}40\,\mathrm{mol/L}$ in $0{,}20\,\mathrm{mol/L}$; $0{,}294\,\mathrm{mol/L}$ se s tem ujema.
7. Odgovor: po $40\,\mathrm{min}$ je koncentracija $0{,}294\,\mathrm{mol/L}$, razpolovni čas pa je $27{,}7\,\mathrm{min}$.

### Primer 2

Reši začetni problem $y' = 2x\,(1 + y^2)$, $y(0) = 1$, in določi največji interval okoli $0$, na katerem rešitev obstaja.

**Podatki:** enačba $y' = 2x(1 + y^2)$, začetni pogoj $y(0) = 1$
**Iščemo:** rešitev $y(x)$ in največji interval obstoja

:::formula
Ločljiva enačba: $\int \frac{dy}{g(y)} = \int f(x)\, dx + C$. Tabelni integral: $\int \frac{dy}{1 + y^2} = \arctan y + C$.
:::

**Rešitev:**

1. Desna stran je produkt $f(x) = 2x$ in $g(y) = 1 + y^2$. Ker je $1 + y^2 > 0$, konstantnih rešitev ni.
2. Ločimo spremenljivki: $\frac{dy}{1 + y^2} = 2x\, dx$.
3. Integriramo (levo tabelni integral, desno $\int 2x\,dx = x^2$): $\arctan y = x^2 + C$.
4. Začetni pogoj: $\arctan 1 = 0 + C$, torej $C = \frac{\pi}{4}$.
5. Izrazimo $y$: $y = \tan\left(x^2 + \frac{\pi}{4}\right)$. To je dovoljeno, dokler je $x^2 + \frac{\pi}{4} < \frac{\pi}{2}$ (zaloga vrednosti arkus tangensa je $(-\frac{\pi}{2}, \frac{\pi}{2})$).
6. Pogoj $x^2 < \frac{\pi}{4}$ da $|x| < \frac{\sqrt{\pi}}{2} \approx 0{,}886$.
7. Preizkus: $y' = \frac{2x}{\cos^2(x^2 + \pi/4)} = 2x\left(1 + \tan^2(x^2 + \tfrac{\pi}{4})\right) = 2x(1 + y^2)$, $y(0) = \tan\frac{\pi}{4} = 1$.
8. Odgovor: $y = \tan\left(x^2 + \frac{\pi}{4}\right)$ na intervalu $\left(-\frac{\sqrt{\pi}}{2}, \frac{\sqrt{\pi}}{2}\right)$; na robu intervala rešitev narašča čez vse meje.

### Primer 3 (težji)

V posodi je $100\,\mathrm{L}$ vode, v kateri je raztopljenih $5\,\mathrm{kg}$ soli. V posodo priteka slanica z masno koncentracijo $0{,}2\,\mathrm{kg/L}$ s pretokom $4\,\mathrm{L/min}$, dobro premešana raztopina pa odteka s pretokom $2\,\mathrm{L/min}$. Posoda drži $200\,\mathrm{L}$. Koliko soli je v posodi po $25\,\mathrm{min}$ in kolikšna je takrat masna koncentracija? Kdaj koncentracija doseže $0{,}1\,\mathrm{kg/L}$ in ali se to zgodi, preden posoda začne prelivati?

**Podatki:** $V_0 = 100\,\mathrm{L}$, $m_0 = 5\,\mathrm{kg}$, koncentracija dotoka $\gamma_\mathrm{d} = 0{,}2\,\mathrm{kg/L}$, dotok $4\,\mathrm{L/min}$, odtok $2\,\mathrm{L/min}$, $t = 25\,\mathrm{min}$, prostornina posode $200\,\mathrm{L}$
**Iščemo:** maso soli $m(25\,\mathrm{min})$, masno koncentracijo $\gamma(25\,\mathrm{min})$ in čas $t^*$, ko je $\gamma = 0{,}1\,\mathrm{kg/L}$

:::formula
Bilanca: $\frac{dm}{dt} = (\text{dotok soli}) - (\text{odtok soli})$. Linearna enačba $m' + p(t)\, m = q(t)$ z integrirajočim množiteljem $\mu = e^{\int p\, dt}$: $(\mu m)' = \mu q$. Koncentracija $\gamma = \frac{m}{V}$.
:::

**Rešitev:**

1. Prostornina: $V(t) = 100 + (4 - 2)t = 100 + 2t$ (v litrih, $t$ v minutah).
2. Dotok soli: $0{,}2\,\mathrm{kg/L} \cdot 4\,\mathrm{L/min} = 0{,}8\,\mathrm{kg/min}$. Odtok soli: koncentracija v posodi krat pretok, $\frac{m}{100 + 2t} \cdot 2 = \frac{m}{50 + t}$.
3. Enačba: $m' = 0{,}8 - \frac{m}{50 + t}$, torej $m' + \frac{1}{50 + t}\, m = 0{,}8$. Je linearna s $p(t) = \frac{1}{50 + t}$.
4. Integrirajoči množitelj (ker je $\int \frac{dt}{50 + t} = \ln(50 + t)$): $\mu = e^{\ln(50 + t)} = 50 + t$.
5. $\big((50 + t)\, m\big)' = 0{,}8\,(50 + t)$, integriramo: $(50 + t)\, m = 0{,}4\,(50 + t)^2 + C$.
6. Začetni pogoj $m(0) = 5$: $50 \cdot 5 = 0{,}4 \cdot 2500 + C$, $250 = 1000 + C$, $C = -750$.
7. Rešitev: $m(t) = 0{,}4\,(50 + t) - \frac{750}{50 + t}$.
8. Pri $t = 25$: $m = 0{,}4 \cdot 75 - \frac{750}{75} = 30 - 10 = 20\,\mathrm{kg}$. Prostornina je $V = 150\,\mathrm{L}$, koncentracija $\gamma = \frac{20\,\mathrm{kg}}{150\,\mathrm{L}} = 0{,}133\,\mathrm{kg/L}$.
9. Koncentracija kot funkcija časa (delimo z $V = 2(50 + t)$): $\gamma(t) = \frac{m(t)}{V(t)} = 0{,}2 - \frac{375}{(50 + t)^2}$ v $\mathrm{kg/L}$. Preizkus: $\gamma(0) = 0{,}2 - 0{,}15 = 0{,}05$ in $\gamma(25) = 0{,}2 - 0{,}0667 = 0{,}133$.
10. Pogoj $\gamma = 0{,}1$: $\frac{375}{(50 + t)^2} = 0{,}1$; $(50 + t)^2 = 3750$; $50 + t = 61{,}24$ (negativni koren odpade, ker je $50 + t > 0$), torej $t^* = 11{,}2\,\mathrm{min}$.
11. Posoda je polna, ko je $100 + 2t = 200$, torej pri $t = 50\,\mathrm{min}$. Model velja do tedaj, zato sta $t = 25\,\mathrm{min}$ in $t^* = 11{,}2\,\mathrm{min}$ v njegovem območju.
12. Preizkus smisla: $\gamma$ narašča od $0{,}05\,\mathrm{kg/L}$ proti $0{,}2\,\mathrm{kg/L}$ (koncentraciji dotoka), a je ne doseže.
13. Odgovor: po $25\,\mathrm{min}$ je v posodi $20\,\mathrm{kg}$ soli, masna koncentracija je $0{,}133\,\mathrm{kg/L}$; koncentracija $0{,}1\,\mathrm{kg/L}$ je dosežena po $11{,}2\,\mathrm{min}$, dolgo preden posoda pri $50\,\mathrm{min}$ začne prelivati.

### Primer 4 – zdaj ti

Po nočni vožnji parkiraš avto ob cesti. Hladilna tekočina v motorju ima $90\,^\circ\mathrm{C}$, zrak $10\,^\circ\mathrm{C}$. Tekočina se ohlaja po Newtonovem zakonu s konstanto $k = 0{,}05\,\mathrm{min^{-1}}$. Kolikšna je njena temperatura po $20\,\mathrm{min}$?

**Podatki:** $\dfrac{dT}{dt} = -k(T - T_\mathrm{o})$, $T_0 = 90\,^\circ\mathrm{C}$, $T_\mathrm{o} = 10\,^\circ\mathrm{C}$, $k = 0{,}05\,\mathrm{min^{-1}}$, $t = 20\,\mathrm{min}$
**Iščemo:** temperaturo $T(20\,\mathrm{min})$

:::formula
Linearna enačba $T' + kT = kT_\mathrm{o}$ z integrirajočim množiteljem $\mu = e^{kt}$: $(\mu T)' = \mu\, k T_\mathrm{o}$.
:::

**Rešitev:**

1. Enačbo zapišemo v obliki $T' + kT = kT_\mathrm{o}$; je linearna s konstantnima $p = k$ in $q = kT_\mathrm{o}$.
2. Množitelj $\mu = e^{kt}$, ker je $\int k\, dt = kt$; tedaj je $(e^{kt}T)' = kT_\mathrm{o}\, e^{kt}$.
3. Integriramo: $e^{kt}T = T_\mathrm{o}\, e^{kt} + C$, torej $T(t) = T_\mathrm{o} + Ce^{-kt}$.
4. Konstanto $C$ iz začetnega pogoja in temperaturo po $20\,\mathrm{min}$ izračunaj sam, nato preveri:

:::premisli
Koliko je $C$ in koliko je $T(20\,\mathrm{min})$?
---
Iz $T(0) = 90$ dobimo $90 = 10 + C$, torej $C = 80$. Eksponent je $kt = 0{,}05 \cdot 20 = 1$, zato $T(20) = 10 + 80\,e^{-1} = 10 + 29{,}4 = 39{,}4\,^\circ\mathrm{C}$. Razlika do zraka je padla z $80$ na približno $29$ stopinj, kar je dobra tretjina, kot pri $e^{-1} \approx 0{,}37$.
:::

## Pogoste napake

- **Pozabljena konstanta ali konstanta na napačnem mestu.** Študent integrira $\ln|y| = \frac{x^2}{2}$ in šele nato doda $C$ k $y$: $y = e^{x^2/2} + C$. To ni rešitev. Konstanto dodamo takoj po integriranju, $\ln|y| = \frac{x^2}{2} + C$, in jo pri izražanju nosimo s seboj: $y = Ke^{x^2/2}$.
- **Izgubljene konstantne rešitve.** Pri deljenju z $g(y)$ izgubimo rešitve, za katere je $g(y) = 0$. Pri $y' = y(1 - y)$ sta $y = 0$ in $y = 1$ rešitvi, ki ju ločitev spremenljivk sama ne pokaže.
- **Ločevanje neločljive enačbe.** Enačba $y' = x + y$ ni ločljiva, ker $x + y$ ni produkt funkcije $x$ in funkcije $y$. Je pa linearna: $y' - y = x$.
- **Napačen predznak v integrirajočem množitelju.** Množitelj je $e^{\int p\, dx}$, kjer je enačba zapisana v obliki $y' + p y = q$. Pri $y' - 3y = 1$ je $p = -3$ in $\mu = e^{-3x}$, ne $e^{3x}$.
- **Pozabljena enota v eksponentu.** Eksponent $kt$ mora biti brezdimenzijski. Če je $k$ v $\mathrm{min^{-1}}$, mora biti $t$ v minutah.
- **Začetni pogoj vstavljen v splošno rešitev homogenega dela.** Pri nehomogeni enačbi konstanto določimo šele v celotni rešitvi $y_h + y_p$.

## Povzetek

- Diferencialna enačba prvega reda $y' = f(x, y)$; rešitev je funkcija, splošna rešitev vsebuje eno konstanto, ki jo določi začetni pogoj $y(x_0) = y_0$.
- **Ločljiva** enačba $y' = f(x)g(y)$: konstantne rešitve iz $g(y) = 0$, sicer $\int \frac{dy}{g(y)} = \int f(x)\, dx + C$.
- **Linearna** enačba $y' + py = q$: množitelj $\mu = e^{\int p\, dx}$, $(\mu y)' = \mu q$; zgradba $y = y_h + y_p$.
- Rast in razpad: $N' = kN$, $N = N_0 e^{kt}$; $t_{1/2} = \frac{\ln 2}{\lambda}$, $t_2 = \frac{\ln 2}{k}$. Logistični model, Newtonov zakon ohlajanja, enačbe mešanja.
- Picardov izrek: če sta $f$ in $\partial f/\partial y$ zvezni, ima začetni problem lokalno natanko eno rešitev.

## Za izpit

Znati moraš povedati:

- definicijo diferencialne enačbe prvega reda, njene rešitve na intervalu in začetnega problema;
- izrek o ločitvi spremenljivk z dokazom po verižnem pravilu in zakaj konstantne rešitve iščemo posebej;
- izpeljavo splošne rešitve linearne enačbe z integrirajočim množiteljem ali variacijo konstante ter izrek $y = y_h + y_p$ z dokazom;
- Picardov izrek z vsemi pogoji in protiprimer $y' = 3y^{2/3}$, $y(0) = 0$;
- izpeljavo razpolovnega časa in rešitve logistične enačbe.

### Naloga 1

Biomasa kvasovk v šaržnem bioreaktorju raste po logističnem modelu $\frac{dX}{dt} = rX\left(1 - \frac{X}{K}\right)$. Na začetku je $X_0 = 1{,}0\,\mathrm{g/L}$, nosilnost je $K = 9{,}0\,\mathrm{g/L}$, po $2{,}0\,\mathrm{h}$ pa izmerijo $3{,}0\,\mathrm{g/L}$. Določi $r$, čas, ko biomasa doseže $90\,\%$ nosilnosti, ter trenutek in velikost največje hitrosti rasti.

**Rešitev:**

1. Rešitev logistične enačbe: $X(t) = \frac{K}{1 + (K/X_0 - 1)e^{-rt}} = \frac{9{,}0}{1 + 8e^{-rt}}$, ker je $\frac{K}{X_0} - 1 = 8$.
2. Iz $X(2) = 3{,}0$: $1 + 8e^{-2r} = 3$, $e^{-2r} = \frac{1}{4}$, torej $r = \frac{\ln 4}{2} = \ln 2 = 0{,}693\,\mathrm{h^{-1}}$.
3. $90\,\%$ nosilnosti je $8{,}1\,\mathrm{g/L}$: $1 + 8e^{-rt} = \frac{9{,}0}{8{,}1} = \frac{10}{9}$, zato $e^{-rt} = \frac{1}{72}$.
4. $t = \frac{\ln 72}{\ln 2} = \frac{4{,}277}{0{,}693}\,\mathrm{h} = 6{,}17\,\mathrm{h}$.
5. Hitrost $rX(1 - X/K)$ je največja pri $X = \frac{K}{2} = 4{,}5\,\mathrm{g/L}$ (teme parabole z ničlama $0$ in $K$).
6. Trenutek: $1 + 8e^{-rt} = 2$, $e^{-rt} = \frac{1}{8}$, $t = \frac{\ln 8}{\ln 2} = 3{,}0\,\mathrm{h}$.
7. Največja hitrost: $\frac{rK}{4} = \frac{0{,}693 \cdot 9{,}0}{4} = 1{,}56\,\mathrm{g/(L\,h)}$.
8. Odgovor: $r = \ln 2 = 0{,}693\,\mathrm{h^{-1}}$; $90\,\%$ nosilnosti je doseženih po $6{,}17\,\mathrm{h}$; najhitreje raste po $3{,}0\,\mathrm{h}$, s hitrostjo $1{,}56\,\mathrm{g/(L\,h)}$.

### Naloga 2

Natančno navedi izrek o obstoju in enoličnosti rešitve začetnega problema. Utemelji, ali ga lahko uporabiš za začetna problema (a) $y' = 3y^{2/3}$, $y(0) = 0$ in (b) $y' = 3y^{2/3}$, $y(1) = 1$. Pri (a) pokaži dve različni rešitvi, pri (b) poišči rešitev.

**Rešitev:**

1. Izrek: naj bosta $f$ in $\frac{\partial f}{\partial y}$ zvezni na pravokotniku $R = [x_0 - a, x_0 + a] \times [y_0 - b, y_0 + b]$; potem obstaja $h > 0$, da ima začetni problem na $[x_0 - h, x_0 + h]$ natanko eno rešitev.
2. Tu je $f(x, y) = 3\sqrt[3]{y^2}$ zvezna na vsej ravnini, $\frac{\partial f}{\partial y} = 2y^{-1/3}$ pa obstaja le za $y \neq 0$.
3. (a) Vsak pravokotnik okoli $(0, 0)$ vsebuje točke z $y = 0$, kjer $\frac{\partial f}{\partial y}$ ne obstaja, zato pogoji izreka niso izpolnjeni in izrek o enoličnosti nič ne pove.
4. Rešitvi: $y \equiv 0$, ker je $y' = 0 = 3 \cdot 0^{2/3}$, in $y = x^3$, ker je $y' = 3x^2 = 3(x^3)^{2/3}$; obe zadoščata $y(0) = 0$.
5. (b) Na pravokotniku $[0{,}5;\ 1{,}5] \times [0{,}5;\ 1{,}5]$ je $y > 0$, zato sta $f$ in $2y^{-1/3}$ zvezni: izrek velja.
6. Ločimo spremenljivki: $\int \frac{dy}{3y^{2/3}} = \int dx$, $y^{1/3} = x + C$; iz $y(1) = 1$ je $C = 0$.
7. Odgovor: pri (a) pogoj izreka ni izpolnjen in problem ima vsaj dve rešitvi; pri (b) je blizu $x = 1$ edina rešitev $y = x^3$.

## Drugače: Na sliki

Enačba $y' = f(x, y)$ vsaki točki pripiše **naklon**; kratke daljice s temi nakloni tvorijo **smerno polje**, rešitve pa so krivulje, ki se jih povsod dotikajo. Pri $y' = -y$ so daljice nad osjo $x$ nagnjene navzdol, pod njo navzgor, zato se vse rešitve $y = Ce^{-x}$ približujejo osi $x$, ki je sama rešitev ($C = 0$); začetni pogoj izbere krivuljo skozi dano točko.

Kjer velja Picardov izrek, se rešitvi ne moreta sekati (v presečišču bi imel začetni problem dve rešitvi). Pri logistični enačbi ležijo med vodoravnima rešitvama $N = 0$ in $N = K$ naraščajoče krivulje; tiste, ki začnejo pod $K/2$, imajo obliko črke S.

## Drugače: Uporaba v stroki

**Določanje reda reakcije.** Koncentracijo reaktanta spremljaš spektrofotometrično. Ker je $\ln c = \ln c_0 - kt$, točke $(t, \ln c)$ pri reakciji prvega reda ležijo na premici z naklonom $-k$; z linearno regresijo dobiš $k$ in $t_{1/2}$. Ukrivljen graf pomeni drug red.

**Izpiranje pretočnega reaktorja.** V idealno premešan reaktor s prostornino $V$ priteka čisto topilo s pretokom $Q$. Bilanca $V\frac{dc}{dt} = -Qc$ da $c = c_0e^{-t/\tau}$ s časom zadrževanja $\tau = \frac{V}{Q}$. Pri $V = 2{,}0\,\mathrm{m^3}$ in $Q = 0{,}10\,\mathrm{m^3/min}$ je $\tau = 20\,\mathrm{min}$; po $60\,\mathrm{min}$ ostane $e^{-3} \approx 5\,\%$ začetne koncentracije.

## Drugače: Korak za korakom s številkami

Vzorec s $90\,^\circ\mathrm{C}$ postavimo v prostor s $20\,^\circ\mathrm{C}$; po $5\,\mathrm{min}$ ima $70\,^\circ\mathrm{C}$. Kdaj bo imel $40\,^\circ\mathrm{C}$?

1. **Model:** $\frac{dT}{dt} = -k(T - 20)$, torej $T(t) = 20 + 70\, e^{-kt}$.
2. **Konstanta:** $70 = 20 + 70e^{-5k}$, $e^{-5k} = \frac{5}{7}$, $k = \frac{1}{5}\ln\frac{7}{5} = \frac{0{,}3365}{5} = 0{,}0673\,\mathrm{min^{-1}}$.
3. **Pogoj:** $40 = 20 + 70e^{-kt}$, $e^{-kt} = \frac{2}{7}$, $t = \frac{\ln 3{,}5}{k} = \frac{1{,}2528}{0{,}0673}\,\mathrm{min} = 18{,}6\,\mathrm{min}$.
4. **Preizkus:** pri $t = 10\,\mathrm{min}$ je $T = 20 + 70 \cdot \left(\frac{5}{7}\right)^2 = 55{,}7\,^\circ\mathrm{C}$, med $70$ in $40$.

## Drugače: Bolj natančno

**Picardov izrek natančneje.** Naj bo $f$ zvezna na pravokotniku $R = [x_0 - a, x_0 + a] \times [y_0 - b, y_0 + b]$ in naj zadošča **Lipschitzovemu pogoju** po $y$: obstaja $L$, da je $|f(x, y_1) - f(x, y_2)| \le L\,|y_1 - y_2|$ za vse točke iz $R$. (Zadošča, da je $\partial f/\partial y$ zvezna na $R$; tedaj je $L = \max|\partial f/\partial y|$ po Lagrangeovem izreku.) Naj bo $M = \max_R |f|$ in $h = \min(a, b/M)$. Tedaj ima začetni problem natanko eno rešitev na $[x_0 - h, x_0 + h]$.

*Ideja dokaza.* Začetni problem je enakovreden integralski enačbi $y(x) = y_0 + \int_{x_0}^x f(t, y(t))\, dt$. Zaporedje **Picardovih približkov** $y_0(x) = y_0$, $y_{n+1}(x) = y_0 + \int_{x_0}^x f(t, y_n(t))\, dt$ ostane v $R$ in zaradi Lipschitzovega pogoja velja ocena $|y_{n+1} - y_n| \le \frac{M L^n |x - x_0|^{n+1}}{(n+1)!}$. Vrsta $\sum (y_{n+1} - y_n)$ zato enakomerno konvergira k zvezni funkciji, ki reši integralsko enačbo. Enoličnost sledi iz Gronwallove neenakosti. Pri $y' = y$, $y(0) = 1$ dajo Picardovi približki ravno delne vsote vrste $1 + x + \frac{x^2}{2!} + \dots$ za $e^x$.

**Globalni obstoj.** V Primeru 2 je $f = 2x(1 + y^2)$ gladka na vsej ravnini, rešitev pa obstaja le na omejenem intervalu, ker $f$ raste kvadratno v $y$. Če $f$ raste največ linearno v $y$, rešitev obstaja na celem intervalu zveznosti koeficientov.

## Preveri se

? Katera funkcija je rešitev začetnega problema $y' = 3y$, $y(0) = 2$?
- $y = 3e^{2x}$
~ Vlogi sta zamenjani: $3$ iz enačbe sodi v eksponent, začetna vrednost $2$ pa pred eksponentno funkcijo.
+ $y = 2e^{3x}$
- $y = e^{3x} + 1$
~ Konstanta je prišteta namesto pomnožena; začetni pogoj velja, enačba pa ne, saj je $y' = 3e^{3x} \neq 3y$.
- $y = 2e^{x/3}$
~ Koeficient je v eksponentu delil namesto množil; odvod je $\frac{2}{3}e^{x/3}$, ne $3y$.
> Splošna rešitev je $y = Ce^{3x}$, iz $y(0) = C = 2$ dobimo $y = 2e^{3x}$. Funkcija $e^{3x} + 1$ sicer zadošča začetnemu pogoju, a ni rešitev enačbe: $y' = 3e^{3x} \neq 3y$.

? Snov razpada po kinetiki prvega reda s konstanto hitrosti $k = 0{,}10\,\mathrm{s^{-1}}$. Kolikšen je razpolovni čas?
- $5{,}0\,\mathrm{s}$
~ To je $\frac{1}{2k}$: »polovica« je pomotoma šla v števec namesto $\ln 2$.
+ $6{,}9\,\mathrm{s}$
- $10\,\mathrm{s}$
~ To je $\frac{1}{k}$, čas, v katerem količina pade na $e^{-1} \approx 37\,\%$, ne na polovico.
- $0{,}069\,\mathrm{s}$
~ Tu je $\ln 2$ pomnožen s $k$ namesto deljen; enota bi bila $\mathrm{s^{-1}}$, ne $\mathrm{s}$.
> $t_{1/2} = \frac{\ln 2}{k} = \frac{0{,}693}{0{,}10\,\mathrm{s^{-1}}} = 6{,}9\,\mathrm{s}$. Razpolovni čas ni odvisen od začetne koncentracije.

? Kateri integrirajoči množitelj uporabimo za enačbo $y' + \frac{2}{x}\, y = x$ pri $x > 0$?
- $e^{2x}$
~ Integrirati je treba ves koeficient $p(x) = \frac{2}{x}$, ne le števila $2$.
- $\frac{1}{x^2}$
~ Napačen predznak: $e^{-2\ln x}$ bi veljal za $y' - \frac{2}{x}y = x$.
+ $x^2$
- $2\ln x$
~ To je šele $P(x) = \int p\, dx$; množitelj je $e^{P(x)}$.
> $\mu = e^{\int \frac{2}{x}\, dx} = e^{2\ln x} = x^2$. Tedaj je $(x^2 y)' = x^3$.

? Katera od naslednjih enačb je linearna, ni pa ločljiva?
- $y' = xy$
~ Je linearna, a tudi ločljiva: desna stran je produkt $f(x) = x$ in $g(y) = y$.
+ $y' = x + y$
- $y' = y^2$
~ Je ločljiva ($f = 1$, $g = y^2$), a ni linearna, ker $y$ nastopa v drugi potenci.
- $y' = y\,(1 - y)$
~ Je ločljiva (logistična oblika), a ni linearna zaradi člena $-y^2$.
> $y' = x + y$ zapišemo kot $y' - y = x$, kar je linearna enačba; desne strani ne moremo zapisati kot produkt funkcije $x$ in funkcije $y$. Enačba $y' = xy$ je linearna in ločljiva, ostali dve sta ločljivi, a nelinearni.

? Kaj velja za razpolovni čas snovi, ki razpada po kinetiki prvega reda?
+ Enak je ne glede na začetno količino snovi.
- Daljši je, če je snovi na začetku več.
~ Več snovi tudi hitreje razpada (hitrost je sorazmerna s količino), zato se polovica porabi v enakem času.
- Vsak naslednji razpolovni čas je krajši od prejšnjega.
~ Tako bi bilo, če bi razpadala stalna množina na minuto; pri prvem redu razpade stalni delež, zato so vsi razpolovni časi enaki.
- Enak je $\frac{1}{k}$.
~ $\frac{1}{k}$ je čas padca na $e^{-1}$; razpolovni čas je $\frac{\ln 2}{k}$.
> Iz $c(t) = c_0 e^{-kt}$ in $c = \frac{c_0}{2}$ sledi $t_{1/2} = \frac{\ln 2}{k}$, kjer $c_0$ ne nastopa. Na tem temelji radiokarbonsko datiranje: $^{14}\mathrm{C}$ ima vedno enak razpolovni čas, ne glede na velikost vzorca.

:::simboli
y | iskana funkcija (rešitev enačbe) | |
y' | odvod iskane funkcije | |
x | neodvisna spremenljivka | |
f | desna stran enačbe y' = f(x, y) | | | pri ločljivi enačbi faktor, odvisen le od x
g | faktor, odvisen le od y | | | ločljiva enačba y' = f(x) g(y)
x_0 | začetna vrednost neodvisne spremenljivke | | | začetni pogoj y(x₀) = y₀
y_0 | vrednost rešitve pri x₀ | |
d | oznaka diferenciala | | | dy/dx je odvod y po x
p | koeficient pri y v linearni enačbi | |
q | desna stran linearne enačbe | | | pri q ≡ 0 je enačba homogena
P | primitivna funkcija koeficienta p | P(x) = \int p(x)\, dx |
\mu | integrirajoči množitelj | \mu = e^{P(x)} |
e | Eulerjevo število | | | e ≈ 2,718
C | integracijska konstanta | | | določimo jo iz začetnega pogoja
N | velikost populacije | | | eksponentna rast: $N(t) = N_0 e^{kt}$
N_0 | začetna velikost populacije | |
t | čas | |
k | konstanta rasti oziroma hitrosti | | | k > 0 rast, k < 0 upadanje; v kinetiki s⁻¹
\lambda | razpadna konstanta | \lambda = -k | | pri razpadu ($k < 0$); $t_{1/2} = \ln 2/\lambda$
r | stopnja rasti v logističnem modelu | |
K | nosilnost okolja | | | drugje tudi poljubna konstanta v rešitvi
c | množinska koncentracija reaktanta | c(t) = c_0 e^{-kt} | mol/L | kinetika prvega reda
c_0 | začetna koncentracija | | mol/L
t_{1/2} | razpolovni čas | t_{1/2} = \frac{\ln 2}{k} | | ni odvisen od začetne količine
T | temperatura telesa | T(t) = T_\mathrm{o} + (T_0 - T_\mathrm{o})e^{-kt} | °C | T₀ je začetna temperatura
T' | hitrost spreminjanja temperature | | °C/min | Newtonov zakon ohlajanja
T_\mathrm{o} | temperatura okolice | | °C
m | masa soli v posodi | | kg
V | prostornina raztopine v posodi | V(t) = 100 + 2t | L | v Uporabi v stroki prostornina reaktorja
\gamma | masna koncentracija soli | \gamma = \frac{m}{V} | kg/L | γ_d je koncentracija dotoka
X | masna koncentracija biomase | | g/L | Naloga 1, logistični model
Q | prostorninski pretok | | m³/min
\tau | čas zadrževanja | \tau = \frac{V}{Q} | min
m' | hitrost spreminjanja mase soli | | kg/min | dotok soli minus odtok soli
:::
