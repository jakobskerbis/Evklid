## Števila in deljivost

| | |
|---|---|
| Deljivost z $2$, $4$, $8$ | zadnja števka, zadnji dve oziroma zadnje tri števke so deljive z $2$, $4$ oziroma $8$ |
| Deljivost s $3$ in $9$ | vsota števk je deljiva s $3$ oziroma $9$; ostanek pri deljenju z $9$ je enak ostanku vsote števk |
| Deljivost z $11$ | izmenična vsota števk (prva minus druga plus tretja …) je deljiva z $11$ |
| Deljivost s sestavljenim številom | število je deljivo s produktom tujih števil, če je deljivo z vsakim faktorjem (npr. $36 = 4 \cdot 9$) |
| Zapis s števkami | $\overline{ab} = 10 a + b$, $\; \overline{abc} = 100 a + 10 b + c$, $\; \overline{ba} - \overline{ab} = 9 (b - a)$ |
| Število deliteljev | $n = p^a q^b r^c$ ima $(a + 1)(b + 1)(c + 1)$ deliteljev |
| Zadnje števke potenc | ponavljajo se v krogu; položaj v krogu je ostanek eksponenta pri deljenju z dolžino kroga |

:::simboli
a, b, c | števke (pri številu deliteljev: eksponenti prafaktorjev) | | |
n | naravno število | n = p^a q^b r^c | |
p, q, r | različna praštevila (prafaktorji števila $n$) | | |
:::

## Evklidov algoritem in diofantske enačbe

| | |
|---|---|
| $D$ in $v$ | $D(a, b) \cdot v(a, b) = a \cdot b$ |
| Evklidov algoritem | $a = q b + r$ ($0 \le r < b$), $\; D(a, b) = D(b, r)$ |
| Linearna kombinacija | če $d \mid a$ in $d \mid b$, potem $d \mid a x + b y$ |
| Bézoutova enakost | $a x + b y = D(a, b)$ ima celi rešitvi $x$, $y$ (Evklidov algoritem nazaj) |
| Linearna diofantska enačba | $a x + b y = c$ je rešljiva natanko tedaj, ko $D(a, b) \mid c$ |
| | vse rešitve: $x = x_0 + \dfrac{b}{d} t$, $\; y = y_0 - \dfrac{a}{d} t$, $\; d = D(a, b)$ |
| Razcep | $x y = c$ ali $(x - k)(y - k) = c$: preizkusi vse pare deliteljev števila $c$ |

:::simboli
a, b | naravni števili (v diofantski enačbi koeficienta) | | | pri Evklidovem algoritmu $a \ge b$
c | celo število na desni strani enačbe | | |
D | največji skupni delitelj | | | $D(a, b)$
v | najmanjši skupni večkratnik | | | $v(a, b)$
q | količnik pri deljenju $a$ z $b$ | | |
r | ostanek pri deljenju $a$ z $b$ | r = a - q b | |
d | skupni delitelj števil $a$ in $b$ (v rešitvah: $D(a, b)$) | | |
x, y | celoštevilski neznanki | | | $x_0$, $y_0$: ena rešitev
t | poljubno celo število | | |
k | celo število, ki ga dobimo z dopolnjevanjem do produkta | | |
:::

## Kongruence in praštevila

| | |
|---|---|
| Kongruenca | $a \equiv b \pmod{m} \iff m \mid a - b$ |
| Računanje po modulu | iz $a \equiv b$ in $c \equiv d \pmod{m}$ sledi $a + c \equiv b + d$, $\; a c \equiv b d$, $\; a^k \equiv b^k \pmod{m}$ |
| Kvadratni ostanki | po modulu $3$: $0$, $1$; po modulu $4$: $0$, $1$; po modulu $8$: $0$, $1$, $4$ (kvadrat lihega števila $\equiv 1$) |
| Kubi | po modulu $9$: $0$, $1$, $8$ |
| Mali Fermatov izrek | $a^{p-1} \equiv 1 \pmod{p}$, če $p \nmid a$; za vsak $a$ velja $a^p \equiv a \pmod{p}$ |
| Eulerjev izrek | $a^{\varphi(m)} \equiv 1 \pmod{m}$, če je $D(a, m) = 1$ |
| Eulerjeva funkcija | $\varphi(m) = m \left(1 - \dfrac{1}{p_1}\right) \cdots \left(1 - \dfrac{1}{p_r}\right)$, $\; \varphi(p^k) = p^k - p^{k-1}$ |
| Red | $a^k \equiv 1 \pmod{m} \iff \mathrm{ord}_m(a) \mid k$; $\; \mathrm{ord}_m(a) \mid \varphi(m)$ |
| Potence v krogu | če je $a^e \equiv 1 \pmod{m}$, je $a^{e k + s} \equiv a^s \pmod{m}$ |
| Legendrova formula | $v_p(n!) = \left\lfloor \dfrac{n}{p} \right\rfloor + \left\lfloor \dfrac{n}{p^2} \right\rfloor + \left\lfloor \dfrac{n}{p^3} \right\rfloor + \dots$ |
| Dvig eksponenta (LTE) | $v_p(a^n - b^n) = v_p(a - b) + v_p(n)$ za liho $p$, $p \mid a - b$, $p \nmid a b$ |
| | $v_2(a^n - b^n) = v_2(a - b) + v_2(a + b) + v_2(n) - 1$ za liha $a$, $b$ in sod $n$ |

:::simboli
a, b, c, d | cela števila | | |
m | modul (naravno število) | | | $m \ge 2$
k | eksponent (naravno število) | | | pri $\varphi(p^k)$ eksponent praštevila
p | praštevilo | | | $p_1, \dots, p_r$: različni prafaktorji števila $m$
r | število različnih prafaktorjev modula $m$ | | |
\varphi | Eulerjeva funkcija: koliko števil od $1$ do $m$ je tujih z $m$ | | |
D | največji skupni delitelj | | |
\mathrm{ord} | red števila $a$ po modulu $m$: najmanjši $k > 0$, za katerega je $a^k \equiv 1$ | | |
e | eksponent, pri katerem je $a^e \equiv 1$ | | |
s | ostanek eksponenta pri deljenju z $e$ | | |
n | naravno število | | |
v_p | eksponent praštevila $p$ v razcepu števila | | |
v_2 | eksponent dvojke v razcepu števila | | |
:::

## Neenakosti

| | |
|---|---|
| Kvadrat je nenegativen | $(a - b)^2 \ge 0$, torej $a^2 + b^2 \ge 2 a b$; $\; a^2 + b^2 + c^2 \ge a b + b c + c a$ |
| Sredine dveh števil | $K \ge A \ge G \ge H$ za $a, b > 0$, enakost natanko pri $a = b$ |
| | $K = \sqrt{\dfrac{a^2 + b^2}{2}}$, $\; A = \dfrac{a + b}{2}$, $\; G = \sqrt{a b}$, $\; H = \dfrac{2 a b}{a + b}$ |
| AM-GM | $\dfrac{a_1 + a_2 + \dots + a_n}{n} \ge \sqrt[n]{a_1 a_2 \cdots a_n}$ za $a_i > 0$; $\; u + w \ge 2 \sqrt{u w}$, $\; u + \dfrac{1}{u} \ge 2$ |
| Cauchy-Schwarz | $(a_1 b_1 + \dots + a_n b_n)^2 \le (a_1^2 + \dots + a_n^2)(b_1^2 + \dots + b_n^2)$, enakost pri $b_i = t a_i$ |
| Engelova oblika | $\dfrac{x_1^2}{y_1} + \dots + \dfrac{x_n^2}{y_n} \ge \dfrac{(x_1 + \dots + x_n)^2}{y_1 + \dots + y_n}$ za $y_i > 0$ |
| Čebiševa neenakost | $n (a_1 b_1 + \dots + a_n b_n) \ge (a_1 + \dots + a_n)(b_1 + \dots + b_n)$ za enako urejeni zaporedji |
| Neenakost urejanja | vsota $a_1 b_{i_1} + \dots + a_n b_{i_n}$ je največja pri enako, najmanjša pri nasprotno urejenih zaporedjih |
| Trikotniška neenakost | $\lvert x + y \rvert \le \lvert x \rvert + \lvert y \rvert$; v trikotniku $a + b > c$ |

:::simboli
a, b, c | realna števila (pri sredinah pozitivna; v trikotniku dolžine stranic) | | |
K | kvadratna sredina | K = \sqrt{\dfrac{a^2 + b^2}{2}} | |
A | aritmetična sredina | A = \dfrac{a + b}{2} | |
G | geometrijska sredina | G = \sqrt{a b} | |
H | harmonična sredina | H = \dfrac{2 a b}{a + b} | |
n | število členov | | |
a_i, b_i | členi zaporedij | | | $a_1, \dots, a_n$ in $b_1, \dots, b_n$
i | indeks člena | | | $i_1, \dots, i_n$: števila $1, \dots, n$ v poljubnem vrstnem redu
u, w | pozitivni števili | | |
t | sorazmernostni faktor | | |
x_i, y_i | realna števila (pri Engelovi obliki $y_i > 0$) | | |
x, y | realni števili | | |
:::

## Polinomi

| | |
|---|---|
| Vietovi formuli (2. stopnja) | $a x^2 + b x + c$: $\; x_1 + x_2 = -\dfrac{b}{a}$, $\; x_1 x_2 = \dfrac{c}{a}$ |
| | $x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2 x_1 x_2$ |
| Vietove formule (3. stopnja) | $a x^3 + b x^2 + c x + d$: $\; x_1 + x_2 + x_3 = -\dfrac{b}{a}$, $\; x_1 x_2 + x_2 x_3 + x_3 x_1 = \dfrac{c}{a}$, $\; x_1 x_2 x_3 = -\dfrac{d}{a}$ |
| Izrek o ostanku | $p(x) = (x - x_0)\, q(x) + p(x_0)$; $x_0$ je ničla natanko tedaj, ko $(x - x_0) \mid p(x)$ |
| Cele ničle | cela ničla polinoma s celimi koeficienti deli prosti člen |

:::simboli
a | vodilni koeficient polinoma | | | $a \ne 0$
b, c | koeficienta polinoma | | |
d | prosti člen polinoma 3. stopnje | | |
x | spremenljivka polinoma | | |
x_1, x_2, x_3 | ničle polinoma | | |
x_0 | število, ki ga vstavimo v polinom | | |
p | polinom | | |
q | količnik pri deljenju polinoma z $x - x_0$ | | |
:::

## Zaporedja in indukcija

| | |
|---|---|
| Vsote | $1 + 2 + \dots + n = \dfrac{n (n + 1)}{2}$, $\; 1^2 + 2^2 + \dots + n^2 = \dfrac{n (n + 1)(2 n + 1)}{6}$ |
| | $1 + 3 + \dots + (2 n - 1) = n^2$, $\; 1 + q + \dots + q^{n-1} = \dfrac{q^n - 1}{q - 1}$ ($q \ne 1$) |
| Rekurzija 1. reda | $a_{n+1} = q\, a_n + d$: ravnovesje $L = \dfrac{d}{1 - q}$, $\; a_n - L = q^n (a_0 - L)$ |
| Rekurzija 2. reda | $a_{n+2} = b\, a_{n+1} + c\, a_n$: $\; r^2 = b r + c$, $\; a_n = A r_1^{\,n} + B r_2^{\,n}$ ($r_1 \ne r_2$) |
| Indukcija | baza (velja za prvi $n$) in korak (iz $n$ sledi $n + 1$); krepka indukcija: iz vseh manjših sledi $n$ |

:::simboli
n | naravno število (indeks člena) | | |
q | faktor, s katerim se množi prejšnji člen (količnik geometrijskega zaporedja) | | | $q \ne 1$
a_n | $n$-ti člen zaporedja | | |
a_0 | začetni člen | | |
a_{n+1}, a_{n+2} | naslednji in nato še naslednji člen | | |
d | stalni dodatek v vsakem koraku | | |
L | ravnovesje (negibna točka) | L = \dfrac{d}{1 - q} | |
b, c | koeficienta rekurzije drugega reda | | |
r | ničla karakteristične enačbe | r^2 = b r + c | | $r_1$, $r_2$: obe ničli
A, B | konstanti, ki ju določita začetna člena | | |
:::

## Kombinatorika in grafi

| | |
|---|---|
| Pravili vsote in produkta | ločeni primeri: seštej; zaporedne neodvisne izbire: zmnoži |
| Permutacije | $n!$; s ponavljanjem $\dfrac{n!}{k_1!\, k_2! \cdots k_r!}$ |
| Variacije | $\dfrac{n!}{(n - k)!}$; s ponavljanjem $n^k$ |
| Kombinacije | $\dbinom{n}{k} = \dfrac{n!}{k!\,(n - k)!}$, $\; \dbinom{n}{k} = \dbinom{n}{n - k}$, $\; \dbinom{n}{k} = \dbinom{n - 1}{k - 1} + \dbinom{n - 1}{k}$ |
| Binomski izrek | $(x + y)^n = \sum_{k=0}^{n} \dbinom{n}{k} x^{n-k} y^k$, $\; \sum_{k=0}^{n} \dbinom{n}{k} = 2^n$ |
| Poti v mreži | $N = \dbinom{m + n}{n}$ (korakov $m$ desno in $n$ gor) |
| Pravokotniki v mreži | $N = \dbinom{a + 1}{2} \dbinom{b + 1}{2}$ v mreži $a \times b$ kvadratkov |
| Diagonale $n$-kotnika | $N = \dfrac{n (n - 3)}{2}$ |
| Zvezdice in pregrade | $N = \dbinom{n + k - 1}{k - 1}$ za $n$ enakih predmetov v $k$ predalov (predali so lahko prazni) |
| Vključitve in izključitve | $\lvert A \cup B \rvert = \lvert A \rvert + \lvert B \rvert - \lvert A \cap B \rvert$ |
| | $\lvert A \cup B \cup C \rvert = \lvert A \rvert + \lvert B \rvert + \lvert C \rvert - \lvert A \cap B \rvert - \lvert B \cap C \rvert - \lvert C \cap A \rvert + \lvert A \cap B \cap C \rvert$ |
| Dirichletovo načelo | $N$ predmetov v $k$ predalih: v nekem predalu je vsaj $\left\lceil \dfrac{N}{k} \right\rceil$ predmetov |
| Lema o rokovanju | $d(v_1) + d(v_2) + \dots + d(v_n) = 2 m$; število točk lihe stopnje je sodo |
| Ramseyjevo število | $R(3, 3) = 6$ |

:::simboli
n | število elementov (v mreži: število korakov navzgor; v grafu: število točk) | | | pri diagonalah število oglišč $n$-kotnika
k | število izbranih elementov (pri zvezdicah: število predalov) | | | pri Dirichletovem načelu število predalov
k_1, k_r | števila ponovitev posameznih elementov | | | $k_1 + k_2 + \dots + k_r = n$
r | število različnih vrst elementov | | |
x, y | člena binoma | | |
N | število možnosti (pri Dirichletovem načelu: število predmetov) | | |
m | število korakov v desno (v grafu: število povezav) | | |
a, b | število stolpcev in vrstic mreže | | |
A, B, C | končne množice | | | $\lvert A \rvert$: število elementov množice $A$
d | stopnja točke (število povezav iz nje) | | |
v_1, v_2, v_n | točke grafa | | |
R | Ramseyjevo število | | | med $6$ ljudmi so vedno $3$ znanci ali $3$ neznanci
:::

## Koti in liki

| | |
|---|---|
| Vsota kotov | trikotnik $180^\circ$; $n$-kotnik $(n - 2) \cdot 180^\circ$; zunanji koti $n$-kotnika skupaj $360^\circ$ |
| Pravilni $n$-kotnik | notranji kot $\alpha = \dfrac{(n - 2) \cdot 180^\circ}{n}$, zunanji kot $\alpha' = \dfrac{360^\circ}{n}$ |
| Zunanji kot trikotnika | je enak vsoti nesosednjih notranjih kotov |
| Pitagorov izrek | $a^2 + b^2 = c^2$; razdalja točk $d = \sqrt{\Delta x^2 + \Delta y^2}$ |
| Ploščina trikotnika | $P = \dfrac{a v_a}{2} = \dfrac{a b \sin \gamma}{2}$, $\; P = \sqrt{s (s - a)(s - b)(s - c)}$ |
| Paralelogram, trapez | $P = a v_a$, $\; P = \dfrac{(a + c) v}{2}$ |
| Podobni liki | razmerje dolžin $k$: razmerje ploščin $k^2$, razmerje prostornin $k^3$ |
| Simetrala kota | razdeli nasprotno stranico v razmerju priležnih stranic: $\dfrac{BD}{DC} = \dfrac{c}{b}$ |
| Simetrija | lik, ki ga vrtež za $\dfrac{360^\circ}{n}$ preslika vase, ima $n$-števno vrtilno simetrijo |
| Ure | urni kazalec $30^\circ$ na uro in $0{,}5^\circ$ na minuto, minutni $6^\circ$ na minuto |

:::simboli
n | število oglišč (stranic) večkotnika | | | pri simetriji: kolikokrat se lik v polnem obratu prekrije sam s sabo
\alpha | notranji kot (v trikotniku pri oglišču $A$) | | |
\alpha' | zunanji kot | | |
a, b | kateti (v splošnem trikotniku stranici $BC$ in $CA$; pri trapezu $a$ in $c$ osnovnici) | | |
c | hipotenuza (stranica $AB$) | | |
d | razdalja točk | | |
\Delta x, \Delta y | razliki koordinat točk | | |
P | ploščina | | |
v_a | višina na stranico $a$ | | |
v | višina trapeza | | |
\gamma | kot pri oglišču $C$ | | |
s | polovični obseg trikotnika | s = \dfrac{a + b + c}{2} | |
k | razmerje podobnosti | | |
B, C | oglišči trikotnika | | |
D | presečišče simetrale kota pri $A$ s stranico $BC$ | | |
:::

## Trikotnik in krožnica

| | |
|---|---|
| Značilne točke | $O$ središče očrtane, $S$ središče včrtane krožnice, $T$ težišče, $V$ višinska točka |
| Polmera | $r = \dfrac{P}{s}$, $\; R = \dfrac{a b c}{4 P}$; pravokotni trikotnik: $R = \dfrac{c}{2}$, $\; r = \dfrac{a + b - c}{2}$ |
| Sinusni izrek | $\dfrac{a}{\sin \alpha} = \dfrac{b}{\sin \beta} = \dfrac{c}{\sin \gamma} = 2 R$ |
| Težišče | $x_T = \dfrac{x_A + x_B + x_C}{3}$, $\; y_T = \dfrac{y_A + y_B + y_C}{3}$; težiščnico deli v razmerju $2 : 1$ |
| Eulerjeva premica | $O$, $T$, $V$ ležijo na premici, $\lvert VT \rvert = 2 \lvert TO \rvert$; $\; \lvert AV \rvert = 2 \lvert O M_a \rvert$ |
| Obodni in središčni kot | $\varphi = \dfrac{\omega}{2}$; obodni koti nad isto tetivo z iste strani so enaki |
| Talesov izrek | obodni kot nad premerom je pravi |
| Tetivni štirikotnik | $\alpha + \gamma = \beta + \delta = 180^\circ$ |
| Tangentni štirikotnik | $a + c = b + d$ |
| Potenca točke | $p = \lvert OP \rvert^2 - r^2$; zunaj krožnice $p = PA \cdot PB = PT^2$, znotraj $PA \cdot PB = -p$ |
| Radikalna os | točke z enako potenco na obe krožnici; tri radikalne osi treh krožnic, katerih središča niso na isti premici, se sekajo v eni točki |
| Cevov izrek | $AD$, $BE$, $CF$ skozi isto točko: $\dfrac{BD}{DC} \cdot \dfrac{CE}{EA} \cdot \dfrac{AF}{FB} = 1$ |
| Menelajev izrek | $D$, $E$, $F$ na isti premici: $\dfrac{BD}{DC} \cdot \dfrac{CE}{EA} \cdot \dfrac{AF}{FB} = 1$ |

:::simboli
O | središče očrtane krožnice (pri potenci: središče krožnice) | | |
S | središče včrtane krožnice | | |
T | težišče (pri potenci: dotikališče tangente iz $P$) | | |
V | višinska točka | | |
r | polmer včrtane krožnice (pri potenci: polmer krožnice) | r = \dfrac{P}{s} | |
R | polmer očrtane krožnice | R = \dfrac{a b c}{4 P} | |
P | ploščina trikotnika (pri potenci: točka, katere potenco računamo) | | |
s | polovični obseg | s = \dfrac{a + b + c}{2} | |
a, b, c | stranice $BC$, $CA$, $AB$ (v pravokotnem trikotniku $c$ hipotenuza; pri štirikotniku zaporedne stranice) | | |
d | četrta stranica štirikotnika | | |
\alpha, \beta, \gamma, \delta | notranji koti pri ogliščih $A$, $B$, $C$, $D$ | | |
A, B, C | oglišča trikotnika (pri potenci: $A$, $B$ presečišči sekante s krožnico) | | |
x_A, x_B, x_C | prve koordinate oglišč | | |
y_A, y_B, y_C | druge koordinate oglišč | | |
x_T, y_T | koordinati težišča | | |
M_a | razpolovišče stranice $BC$ | | |
\varphi | obodni kot | \varphi = \dfrac{\omega}{2} | |
\omega | središčni kot nad isto tetivo | | |
p | potenca točke $P$ | p = \lvert OP \rvert^2 - r^2 | | pozitivna zunaj, negativna znotraj krožnice
D, E, F | točke na nosilkah stranic $BC$, $CA$, $AB$ | | |
:::

## Besedilne naloge

| | |
|---|---|
| Skupno delo | $\dfrac{1}{t} = \dfrac{1}{t_1} + \dfrac{1}{t_2}$ |
| Srečanje, dohitevanje | $t = \dfrac{d}{v_1 + v_2}$, $\; t = \dfrac{d}{v_1 - v_2}$ |
| Povprečna hitrost | $\bar{v} = \dfrac{s_1 + s_2}{t_1 + t_2}$; pri enakih poteh $\bar{v} = \dfrac{2 v_1 v_2}{v_1 + v_2}$ |
| Mešanice | $\dfrac{w_1 m_1 + w_2 m_2}{m_1 + m_2} = w$ |
| Starosti | razlika starosti je stalna |
| Koledar | navadno leto $365 = 52 \cdot 7 + 1$ dni; prestopno, če je letnica deljiva s $4$, stoletja pa le, če so deljiva s $400$ |

:::simboli
t | čas skupnega dela (pri srečanju: čas do srečanja oziroma dohitenja) | | |
t_1, t_2 | čas, ki ga za delo porabi vsak sam (pri povprečni hitrosti: čas posameznega odseka) | | |
d | začetna razdalja med udeležencema | | |
v_1, v_2 | hitrosti udeležencev (pri povprečni hitrosti: hitrosti na odsekih) | | | pri dohitevanju $v_1 > v_2$
\bar{v} | povprečna hitrost | | |
s_1, s_2 | dolžini odsekov poti | | |
w_1, w_2 | deleža snovi v mešanicah, ki ju zmešamo | | |
m_1, m_2 | masi mešanic, ki ju zmešamo | | |
w | delež snovi v novi mešanici | | |
:::
