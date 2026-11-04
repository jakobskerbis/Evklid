---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ko je Willard Libby sredi 20. stoletja razvijal radiokarbonsko datiranje, je imel eno samo meritev: koliko $^{14}\mathrm{C}$ je še ostalo v vzorcu lesa ali kosti. Ključ je bil zakon, da vsak trenutek razpade enak delež preostalih jeder, torej je **hitrost spreminjanja** sorazmerna s številom jeder. Zakon, ki povezuje neznano funkcijo in njen odvod, je **diferencialna enačba**; njena rešitev ni število, ampak **funkcija** časa. Metodo je preveril na vzorcih znane starosti, med drugim na lesu iz egipčanskih grobnic. Enako obliko imajo zakoni, ki jih srečaš na dolgi vožnji: kofein iz kave na počivališču se iz krvi izloča po kinetiki prvega reda, hladilna tekočina parkiranega avta pa se ohlaja proti temperaturi zraka. Ko rešitev poznaš, napoveš prihodnost sistema ali izračunaš, kdaj bo dosežena želena vrednost.

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

**Rešitev** na intervalu $I$ je odvedljiva funkcija $y$, za katero velja $y'(x) = f(x, y(x))$ za vse $x \in I$. Primer: $y = Ce^{2x}$ je rešitev enačbe $y' = 2y$ za vsak $C \in \mathbb{R}$, saj je $y' = 2Ce^{2x} = 2y$. Družini rešitev s poljubno konstanto pravimo **splošna rešitev**. Vsako rešitev preverimo tako, da jo vstavimo v enačbo.

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

Enak rezultat da **variacija konstante**: v homogeni rešitvi $y = C e^{-P}$ konstanto nadomestimo s funkcijo $C(x)$, vstavimo v enačbo in dobimo $C'(x) = q\, e^{P}$.

Zgradba rešitve je pomembna: **splošna rešitev nehomogene enačbe = splošna rešitev homogene + ena partikularna rešitev nehomogene**, $y = y_h + y_p$.

**5. Modeli rasti in razpada.** Najpreprostejši model pravi, da je hitrost spreminjanja količine sorazmerna s količino:

$$\frac{dN}{dt} = kN \quad\Rightarrow\quad N(t) = N_0\, e^{kt}.$$

- Za $k > 0$ je to **eksponentna rast** (bakterije v ugodnem okolju, obrestovanje). **Podvojitveni čas** je $t_2 = \dfrac{\ln 2}{k}$.
- Za $k < 0$ pišemo $k = -\lambda$ in dobimo **eksponentni razpad** (radioaktivni razpad, kinetika prvega reda, izločanje zdravila iz krvi). **Razpolovni čas** je $t_{1/2} = \dfrac{\ln 2}{\lambda}$ in ni odvisen od začetne količine.

Pri kemijski kinetiki prvega reda pišemo $\dfrac{dc}{dt} = -kc$ in $c(t) = c_0 e^{-kt}$, kjer je $k$ **konstanta hitrosti** z enoto $\mathrm{s^{-1}}$ ali $\mathrm{min^{-1}}$.

Bolj realističen model rasti je **logistična enačba**

$$\frac{dN}{dt} = rN\left(1 - \frac{N}{K}\right),$$

kjer je $K$ **nosilnost okolja**. Je ločljiva; rešitev je $N(t) = \dfrac{K}{1 + \left(\frac{K}{N_0} - 1\right)e^{-rt}}$. Na začetku raste skoraj eksponentno, nato se približuje $K$.

**Newtonov zakon ohlajanja** $\dfrac{dT}{dt} = -k(T - T_\mathrm{o})$, kjer je $T_\mathrm{o}$ temperatura okolice, je linearen. Rešitev je $T(t) = T_\mathrm{o} + (T_0 - T_\mathrm{o})e^{-kt}$: razlika do okolice razpada eksponentno. Linearne so tudi **enačbe mešanja** (koliko soli je v posodi, v katero priteka raztopina) in enačba za tok v vezju z uporom in tuljavo.

**6. Obstoj in enoličnost rešitve.** Ali ima začetni problem sploh rešitev in ali je ena sama? Odgovor da izrek o obstoju in enoličnosti (Picardov izrek):

> Če sta $f$ in $\dfrac{\partial f}{\partial y}$ zvezni na nekem pravokotniku okoli točke $(x_0, y_0)$, ima začetni problem $y' = f(x, y)$, $y(x_0) = y_0$ na nekem intervalu okoli $x_0$ natanko eno rešitev.

Izrek zagotavlja rešitev le **lokalno**, na nekem intervalu okoli $x_0$. Rešitev lahko »pobegne v neskončnost« v končnem času. Za linearno enačbo z zveznima $p$ in $q$ na intervalu $I$ pa rešitev obstaja in je enolična na **celem** $I$. Ko pogoji izreka niso izpolnjeni, ima lahko začetni problem več rešitev (zgled je v razdelku Bolj natančno).

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
6. Preizkus: $40\,\mathrm{min}$ je malo več od enega razpolovnega časa, zato mora biti koncentracija malo manj od polovice $0{,}40\,\mathrm{mol/L}$; $0{,}294\,\mathrm{mol/L}$ se s tem ujema.
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

V posodi je $100\,\mathrm{L}$ vode, v kateri je raztopljenih $5\,\mathrm{kg}$ soli. V posodo priteka slanica z masno koncentracijo $0{,}2\,\mathrm{kg/L}$ s pretokom $4\,\mathrm{L/min}$, dobro premešana raztopina pa odteka s pretokom $2\,\mathrm{L/min}$. Koliko soli je v posodi po $25\,\mathrm{min}$ in kolikšna je takrat masna koncentracija?

**Podatki:** $V_0 = 100\,\mathrm{L}$, $m_0 = 5\,\mathrm{kg}$, koncentracija dotoka $\gamma_\mathrm{d} = 0{,}2\,\mathrm{kg/L}$, dotok $4\,\mathrm{L/min}$, odtok $2\,\mathrm{L/min}$, $t = 25\,\mathrm{min}$
**Iščemo:** maso soli $m(25\,\mathrm{min})$ in masno koncentracijo $\gamma(25\,\mathrm{min})$

:::formula
Bilanca: $\frac{dm}{dt} = (\text{dotok soli}) - (\text{odtok soli})$. Linearna enačba $m' + p(t)\, m = q(t)$ z integrirajočim množiteljem $\mu = e^{\int p\, dt}$: $(\mu m)' = \mu q$.
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
9. Preizkus smisla: koncentracija je narasla od $0{,}05\,\mathrm{kg/L}$ proti $0{,}2\,\mathrm{kg/L}$ (koncentraciji dotoka), a je še ni dosegla.
10. Odgovor: po $25\,\mathrm{min}$ je v posodi $20\,\mathrm{kg}$ soli, masna koncentracija je $0{,}133\,\mathrm{kg/L}$.

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

## Drugače: Na sliki

Enačba $y' = f(x, y)$ vsaki točki ravnine pripiše **naklon**. Če v mnogo točkah narišemo kratke daljice s tem naklonom, dobimo **smerno polje**. Rešitve so krivulje, ki se v vsaki točki dotikajo daljic.

Pri $y' = -y$ so daljice nad osjo $x$ nagnjene navzdol, pod njo navzgor, na osi $x$ pa vodoravne. Vse rešitve $y = Ce^{-x}$ se zato približujejo osi $x$, ki je sama rešitev ($C = 0$). Začetni pogoj izbere eno krivuljo: tisto, ki gre skozi dano točko.

Ker se po Picardovem izreku rešitvi ne moreta sekati (v presečišču bi imel začetni problem dve rešitvi), krivulje rešitev **lepo prekrijejo** ravnino, kot plasti v zloženem papirju. Pri logistični enačbi vidimo dve vodoravni rešitvi, $N = 0$ in $N = K$; krivulje med njima naraščajo in se od spodaj približujejo premici $N = K$; tiste, ki začnejo pod $K/2$, imajo obliko črke S.

## Drugače: Iz vsakdanjega življenja

**Bakterije.** Kultura bakterij ima podvojitveni čas $20\,\mathrm{min}$. Konstanta rasti je $k = \frac{\ln 2}{20\,\mathrm{min}} = 0{,}0347\,\mathrm{min^{-1}}$. Iz $500$ bakterij jih v dveh urah (šest podvojitev) nastane $500 \cdot 2^6 = 32\,000$. Ko zmanjka hranil, rast upočasni, kar bolje opiše logistični model.

**Zdravila.** Koncentracija zdravila v krvni plazmi po injekciji pogosto pada po kinetiki prvega reda. Iz razpolovnega časa zdravnik določi, kako pogosto je treba odmerek ponoviti.

**Radiokarbonsko datiranje.** Izotop $^{14}\mathrm{C}$ ima razpolovni čas približno $5730$ let. Iz razmerja med ostankom $^{14}\mathrm{C}$ in začetno vrednostjo izračunamo starost organskih ostankov: $t = \frac{t_{1/2}}{\ln 2} \ln\frac{N_0}{N}$.

**Gozdarstvo in ribištvo.** Logistični model opisuje rast populacije v omejenem okolju. Največja hitrost rasti je pri $N = \frac{K}{2}$, kar se uporablja pri načrtovanju trajnostnega izlova ali sečnje.

**Električni krog.** Pri polnjenju kondenzatorja v vezju z uporom velja $RC\,\frac{dU}{dt} + U = U_0$, kar je linearna enačba z rešitvijo $U(t) = U_0\left(1 - e^{-t/(RC)}\right)$. Produkt $RC$ je časovna konstanta.

## Drugače: Korak za korakom s številkami

Čaj s temperaturo $90\,^\circ\mathrm{C}$ postavimo v sobo s $20\,^\circ\mathrm{C}$. Po $5\,\mathrm{min}$ ima $70\,^\circ\mathrm{C}$. Kdaj bo imel $40\,^\circ\mathrm{C}$?

1. **Model:** $\frac{dT}{dt} = -k(T - 20)$. Rešitev: $T(t) = 20 + 70\, e^{-kt}$ (začetna razlika do okolice je $90 - 20 = 70$).
2. **Konstanta iz meritve:** $70 = 20 + 70e^{-5k}$, torej $e^{-5k} = \frac{50}{70} = \frac{5}{7}$.
3. **Logaritmiramo:** $k = \frac{1}{5}\ln\frac{7}{5} = \frac{0{,}3365}{5} = 0{,}0673\,\mathrm{min^{-1}}$.
4. **Pogoj za $40\,^\circ\mathrm{C}$:** $40 = 20 + 70e^{-kt}$, torej $e^{-kt} = \frac{20}{70} = \frac{2}{7}$.
5. **Čas:** $t = \frac{\ln 3{,}5}{k} = \frac{1{,}2528}{0{,}0673}\,\mathrm{min} = 18{,}6\,\mathrm{min}$.
6. **Preizkus smisla:** v prvih petih minutah se je razlika do okolice zmanjšala s $70$ na $50$ stopinj, kasneje se čaj ohlaja počasneje. Pri $t = 10\,\mathrm{min}$ je $T = 20 + 70 \cdot \left(\frac{5}{7}\right)^2 = 55{,}7\,^\circ\mathrm{C}$, kar je smiselno med $70$ in $40$.

## Drugače: Bolj natančno

**Utemeljitev ločitve spremenljivk.** Naj bo $y$ rešitev enačbe $y' = f(x)g(y)$ z $g(y(x)) \neq 0$. Naj bo $G$ primitivna funkcija $\frac{1}{g}$ in $F$ primitivna funkcija $f$. Po verižnem pravilu je $\frac{d}{dx} G(y(x)) = \frac{y'(x)}{g(y(x))} = f(x)$, torej $G(y(x)) = F(x) + C$. Zapis $\frac{dy}{g(y)} = f(x)\,dx$ je le priročna okrajšava tega računa.

**Linearna enačba ima vse rešitve oblike $y_h + y_p$.** Če sta $y_1$ in $y_2$ rešitvi enačbe $y' + py = q$, je razlika $u = y_1 - y_2$ rešitev homogene enačbe $u' + pu = 0$. Ta pa je (iz $(ue^{P})' = 0$ in izreka, da ima funkcija z ničelnim odvodom na intervalu konstantno vrednost) oblike $u = Ce^{-P}$.

**Picardov izrek natančneje.** Naj bo $f$ zvezna na pravokotniku $R = [x_0 - a, x_0 + a] \times [y_0 - b, y_0 + b]$ in naj zadošča **Lipschitzovemu pogoju** po $y$: obstaja $L$, da je $|f(x, y_1) - f(x, y_2)| \le L\,|y_1 - y_2|$ za vse točke iz $R$. (Zadošča, da je $\partial f/\partial y$ zvezna na $R$; tedaj je $L = \max|\partial f/\partial y|$ po Lagrangeovem izreku.) Naj bo $M = \max_R |f|$ in $h = \min(a, b/M)$. Tedaj ima začetni problem natanko eno rešitev na $[x_0 - h, x_0 + h]$.

*Ideja dokaza.* Začetni problem je enakovreden integralski enačbi $y(x) = y_0 + \int_{x_0}^x f(t, y(t))\, dt$. Zaporedje **Picardovih približkov** $y_0(x) = y_0$, $y_{n+1}(x) = y_0 + \int_{x_0}^x f(t, y_n(t))\, dt$ ostane v $R$ in zaradi Lipschitzovega pogoja velja ocena $|y_{n+1} - y_n| \le \frac{M L^n |x - x_0|^{n+1}}{(n+1)!}$. Vrsta $\sum (y_{n+1} - y_n)$ zato enakomerno konvergira k zvezni funkciji, ki reši integralsko enačbo. Enoličnost sledi iz Gronwallove neenakosti. Pri $y' = y$, $y(0) = 1$ dajo Picardovi približki ravno delne vsote vrste $1 + x + \frac{x^2}{2!} + \dots$ za $e^x$.

**Kdaj enoličnost odpove.** Začetni problem $y' = 3y^{2/3}$, $y(0) = 0$ ima rešitvi $y \equiv 0$ in $y = x^3$ (pa še neskončno »zlepljenih«). Funkcija $f(y) = 3y^{2/3}$ je zvezna, njen odvod $2y^{-1/3}$ pa pri $y = 0$ ne obstaja, zato Lipschitzov pogoj ni izpolnjen.

**Globalni obstoj.** Pri Primeru 2 je $f = 2x(1 + y^2)$ gladka na vsej ravnini, pa rešitev vseeno obstaja le na omejenem intervalu, ker $f$ raste kvadratno v $y$. Če $f$ raste največ linearno v $y$ (na primer pri linearnih enačbah), rešitev obstaja na celem intervalu, kjer so koeficienti zvezni.

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
r | stopnja rasti v logističnem modelu | |
K | nosilnost okolja | | | drugje tudi poljubna konstanta v rešitvi
c | množinska koncentracija reaktanta | c(t) = c_0 e^{-kt} | mol/L | kinetika prvega reda
c_0 | začetna koncentracija | | mol/L
t_{1/2} | razpolovni čas | t_{1/2} = \frac{\ln 2}{k} | | ni odvisen od začetne količine
T | temperatura telesa | T(t) = T_\mathrm{o} + (T_0 - T_\mathrm{o})e^{-kt} | °C | T₀ je začetna temperatura
T' | hitrost spreminjanja temperature | | °C/min | Newtonov zakon ohlajanja
T_\mathrm{o} | temperatura okolice | | °C
m | masa soli v posodi | | kg
m' | hitrost spreminjanja mase soli | | kg/min | dotok soli minus odtok soli
:::
