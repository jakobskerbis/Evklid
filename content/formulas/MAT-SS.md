## Algebra

| | |
|---|---|
| Potence | $a^{-n} = \dfrac{1}{a^n}$, $\; a^0 = 1$, $\; a^{\frac{m}{n}} = \sqrt[n]{a^m}$ |
| Koreni | $\sqrt[n]{a b} = \sqrt[n]{a}\,\sqrt[n]{b}$, $\; \sqrt[n]{\dfrac{a}{b}} = \dfrac{\sqrt[n]{a}}{\sqrt[n]{b}}$, $\; \sqrt[n]{\sqrt[m]{a}} = \sqrt[n m]{a}$ |
| Kvadrat in kub | $(a \pm b)^2 = a^2 \pm 2 a b + b^2$, $\; (a \pm b)^3 = a^3 \pm 3 a^2 b + 3 a b^2 \pm b^3$ |
| Razstavljanje | $a^2 - b^2 = (a - b)(a + b)$, $\; a^3 \pm b^3 = (a \pm b)(a^2 \mp a b + b^2)$ |
| Absolutna vrednost | $\lvert x \rvert < a \iff -a < x < a$; $\; \lvert x \rvert > a \iff x < -a$ ali $x > a$ |
| Realna števila in intervali | $[a, b] = \{x \in \mathbb{R};\ a \le x \le b\}$, $\; (a, b) = \{x \in \mathbb{R};\ a < x < b\}$ |
| | $[a, b) = \{x \in \mathbb{R};\ a \le x < b\}$, $\; (a, b] = \{x \in \mathbb{R};\ a < x \le b\}$, $\; [a, \infty) = \{x \in \mathbb{R};\ x \ge a\}$ |
| Potenčna in korenska funkcija | $f(x) = x^n$: pri sodem $n$ je $f$ soda, $Z_f = [0, \infty)$; pri lihem $n$ je $f$ liha, $Z_f = \mathbb{R}$ |
| | $f(x) = x^{-n}$: $D_f = \mathbb{R} \setminus \{0\}$; pri sodem $n$ je $Z_f = (0, \infty)$, pri lihem $Z_f = \mathbb{R} \setminus \{0\}$ |
| | $f(x) = \sqrt[n]{x}$: pri sodem $n$ je $D_f = [0, \infty)$, pri lihem $D_f = \mathbb{R}$ |
| Kompleksna števila | $z = a + b i$, $\; i^2 = -1$, $\; \bar{z} = a - b i$, $\; \lvert z \rvert = \sqrt{a^2 + b^2}$, $\; z \bar{z} = \lvert z \rvert^2$ |

:::simboli
a, b | poljubni realni števili (pri intervalu: krajišči, pri $z = a + b i$: realni in imaginarni del) | | | pri intervalu $a < b$; pri $a^{-n}$ in $a^0$ je $a \ne 0$, pri $a^{\frac{m}{n}}$ je $a > 0$, v imenovalcu $b \ne 0$, pod korenom sode stopnje $a, b \ge 0$; pri absolutni vrednosti $a > 0$
n, m | naravni števili (korenski eksponent in eksponent) | | | pri potenčni in korenski funkciji je $n$ eksponent oziroma stopnja korena; v $a^{\frac{m}{n}}$ je $m$ eksponent, $n \ge 2$ pa stopnja korena; v $\sqrt[n]{\sqrt[m]{a}}$ sta oba stopnji korena; pri $a^{-n}$ je $n$ poljubno naravno število
x | poljubno realno število (neznanka v neenačbi, pri funkciji neodvisna spremenljivka) | | |
f | funkcija | | |
D_f | definicijsko območje funkcije $f$ | | |
Z_f | zaloga vrednosti funkcije $f$ | | |
z | kompleksno število | z = a + b i | |
\bar{z} | konjugirano kompleksno število | \bar{z} = a - b i | |
i | imaginarna enota | i^2 = -1 | |
:::

## Množice

| | |
|---|---|
| Množice, operacije | $A \cup B = \{x;\ x \in A \lor x \in B\}$, $\; A \cap B = \{x;\ x \in A \land x \in B\}$ |
| | $A - B = \{x;\ x \in A \land x \notin B\}$, $\; A' = \{x \in U;\ x \notin A\}$ |
| Moč množice | $m(A \cup B) = m(A) + m(B) - m(A \cap B)$, $\; m(A') = m(U) - m(A)$ |

:::simboli
A, B | množici | | |
x | element množice | | |
U | univerzalna množica | | | vse obravnavane množice so njene podmnožice
A' | komplement množice $A$ | A' = U - A | |
m | moč množice (število elementov) | | | za končne množice
:::

## Kvadratna funkcija in enačba

| | |
|---|---|
| Splošna oblika | $f(x) = a x^2 + b x + c$, $\; D = b^2 - 4 a c$ |
| Rešitvi enačbe | $x_{1,2} = \dfrac{-b \pm \sqrt{D}}{2 a}$ ($D > 0$ dve, $D = 0$ ena, $D < 0$ ni realnih) |
| Teme | $T(p, q)$ |
| | $p = -\dfrac{b}{2 a}$ |
| | $q = -\dfrac{D}{4 a}$ |
| Temenska oblika | $f(x) = a (x - p)^2 + q$ |
| Ničelna oblika | $f(x) = a (x - x_1)(x - x_2)$ |
| Vietovi formuli | $x_1 + x_2 = -\dfrac{b}{a}$, $\; x_1 x_2 = \dfrac{c}{a}$ |

:::simboli
f | kvadratna funkcija | f(x) = a x^2 + b x + c | |
x | neodvisna spremenljivka | | |
a | vodilni koeficient | | | $a \ne 0$; pri $a > 0$ je parabola odprta navzgor, pri $a < 0$ navzdol
b | linearni koeficient | | |
c | prosti člen | | | $f(0) = c$: presečišče grafa z osjo $y$
D | diskriminanta | D = b^2 - 4 a c | | od njenega predznaka je odvisno število realnih ničel
x_{1,2}, x_1, x_2 | ničli kvadratne funkcije (rešitvi kvadratne enačbe) | x_{1,2} = \dfrac{-b \pm \sqrt{D}}{2 a} | |
T | teme parabole | T(p, q) | |
p | abscisa temena | p = -\dfrac{b}{2 a} | | os simetrije parabole je premica $x = p$
q | ordinata temena | q = -\dfrac{D}{4 a} | | ekstremna (najmanjša ali največja) vrednost funkcije
:::

## Eksponentna funkcija in logaritmi

| | |
|---|---|
| Definicija | $\log_a x = y \iff a^y = x$ ($a > 0$, $a \ne 1$, $x > 0$) |
| Pravila | $\log_a (x y) = \log_a x + \log_a y$, $\; \log_a \dfrac{x}{y} = \log_a x - \log_a y$, $\; \log_a x^n = n \log_a x$ |
| Prehod na drugo osnovo | $\log_a x = \dfrac{\log_b x}{\log_b a}$ |
| Posebni vrednosti | $\log_a 1 = 0$, $\; \log_a a = 1$, $\; \log x = \log_{10} x$, $\; \ln x = \log_e x$ |

:::simboli
a | osnova logaritma (in potence) | | | $a > 0$, $a \ne 1$
x | logaritmand (pozitivno realno število) | | | $x > 0$
y | vrednost logaritma (eksponent, na katerega potenciramo osnovo) | y = \log_a x | | v pravilih za produkt in količnik: drugi logaritmand, $y > 0$
n | poljubno realno število (eksponent) | | |
b | nova osnova logaritma | | | $b > 0$, $b \ne 1$
e | Eulerjevo število | | | $e \approx 2{,}71828$; osnova naravnega logaritma $\ln$
:::

## Kotne funkcije

| | |
|---|---|
| Pravokotni trikotnik | $\sin \alpha = \dfrac{a}{c}$, $\; \cos \alpha = \dfrac{b}{c}$, $\; \tan \alpha = \dfrac{a}{b}$ |
| Zveze | $\sin^2 x + \cos^2 x = 1$, $\; \tan x = \dfrac{\sin x}{\cos x}$, $\; 1 + \tan^2 x = \dfrac{1}{\cos^2 x}$ |
| Radiani | $x\,[\text{rad}] = \dfrac{\pi}{180^\circ} \cdot \alpha\,[^\circ]$, $\; 180^\circ = \pi$ |
| Periodičnost | $\sin (x + 2 k \pi) = \sin x$, $\; \cos (x + 2 k \pi) = \cos x$, $\; \tan (x + k \pi) = \tan x$, $\; \cot (x + k \pi) = \cot x$ |
| Sinusna krivulja | $f(x) = A \sin \omega (x - \varphi)$, $\; T = \dfrac{2 \pi}{\omega}$, ničle $x = \varphi + \dfrac{k \pi}{\omega}$ |
| Krožne funkcije | $y = \arcsin x \iff x = \sin y$ in $-\dfrac{\pi}{2} \le y \le \dfrac{\pi}{2}$, $\; D_f = [-1, 1]$, $\; Z_f = \left[-\dfrac{\pi}{2}, \dfrac{\pi}{2}\right]$ |
| | $y = \arccos x$: $D_f = [-1, 1]$, $Z_f = [0, \pi]$; $\; y = \arctan x$: $D_f = \mathbb{R}$, $Z_f = \left(-\dfrac{\pi}{2}, \dfrac{\pi}{2}\right)$; $\; y = \operatorname{arccot} x$: $D_f = \mathbb{R}$, $Z_f = (0, \pi)$ |
| Adicijski izreki | $\sin (x \pm y) = \sin x \cos y \pm \cos x \sin y$, $\; \cos (x \pm y) = \cos x \cos y \mp \sin x \sin y$ |
| | $\tan (x \pm y) = \dfrac{\tan x \pm \tan y}{1 \mp \tan x \tan y}$ |
| Dvojni kot | $\sin 2x = 2 \sin x \cos x$, $\; \cos 2x = \cos^2 x - \sin^2 x$ |
| Sinusni izrek | $\dfrac{a}{\sin \alpha} = \dfrac{b}{\sin \beta} = \dfrac{c}{\sin \gamma} = 2 R$ |
| Kosinusni izrek | $c^2 = a^2 + b^2 - 2 a b \cos \gamma$ |
| Ploščina trikotnika | $S = \dfrac{a b \sin \gamma}{2}$, $\; S = \sqrt{s (s - a)(s - b)(s - c)}$, $\; s = \dfrac{a + b + c}{2}$ |
| Polmera | $R = \dfrac{a b c}{4 S}$ (očrtana krožnica), $\; r = \dfrac{S}{s}$ (včrtana krožnica) |

| $x$ | $0$ | $\frac{\pi}{6}$ | $\frac{\pi}{4}$ | $\frac{\pi}{3}$ | $\frac{\pi}{2}$ |
|---|---|---|---|---|---|
| $\sin x$ | $0$ | $\frac{1}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{\sqrt{3}}{2}$ | $1$ |
| $\cos x$ | $1$ | $\frac{\sqrt{3}}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{1}{2}$ | $0$ |
| $\tan x$ | $0$ | $\frac{\sqrt{3}}{3}$ | $1$ | $\sqrt{3}$ | ni def. |

:::simboli
\alpha | kot pri oglišču $A$ (nasproti stranice $a$) | | | v pravokotnem trikotniku ostri kot; pri pretvorbi v radiane velikost kota v stopinjah
\beta, \gamma | kota pri ogliščih $B$ in $C$ | | | $\beta$ leži nasproti stranice $b$, $\gamma$ nasproti stranice $c$
a, b | stranici trikotnika (v pravokotnem trikotniku kateti) | | |
c | stranica trikotnika (v pravokotnem trikotniku hipotenuza) | | |
x, y | poljubna kota (realni števili v radianih) | | | pri pretvorbi je $x$ velikost kota v radianih; pri $\tan x$ mora biti $\cos x \ne 0$; pri krožnih funkcijah je $x$ vrednost kotne funkcije, $y$ pa kot
k | poljubno celo število | | |
f | sinusna funkcija | | |
A | amplituda (največji odmik od osi $x$ je $\lvert A \rvert$) | | | $A \ne 0$
\omega | krožna frekvenca | \omega = \dfrac{2 \pi}{T} | | $\omega > 0$
\varphi | premik grafa vzdolž osi $x$ (pri $\varphi > 0$ v desno) | | |
T | osnovna perioda | T = \dfrac{2 \pi}{\omega} | |
D_f | definicijsko območje krožne funkcije | | |
Z_f | zaloga vrednosti krožne funkcije | | |
R | polmer trikotniku očrtane krožnice | R = \dfrac{a b c}{4 S} | |
r | polmer trikotniku včrtane krožnice | r = \dfrac{S}{s} | |
S | ploščina trikotnika | | |
s | polovični obseg trikotnika | s = \dfrac{a + b + c}{2} | | nastopa v Heronovi formuli
:::

## Vektorji in analitična geometrija

| | |
|---|---|
| Dolžina vektorja | $\lvert \vec{a} \rvert = \sqrt{a_1^2 + a_2^2 + a_3^2}$ |
| Skalarni produkt | $\vec{a} \cdot \vec{b} = \lvert \vec{a} \rvert \lvert \vec{b} \rvert \cos \varphi = a_1 b_1 + a_2 b_2 + a_3 b_3$ |
| Razdalja točk | $d(A, B) = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$ |
| Razpolovišče | $S\left(\dfrac{x_1 + x_2}{2}, \dfrac{y_1 + y_2}{2}\right)$ |
| Premica | $y = k x + n$, $\; k = \tan \varphi = \dfrac{y_2 - y_1}{x_2 - x_1}$, $\; y - y_1 = k (x - x_1)$ |
| Kot med premicama | $\tan \varphi = \left\lvert \dfrac{k_2 - k_1}{1 + k_1 k_2} \right\rvert$; vzporedni $k_1 = k_2$, pravokotni $k_1 k_2 = -1$ |
| Razdalja točke od premice | $d = \dfrac{\lvert a x_0 + b y_0 + c \rvert}{\sqrt{a^2 + b^2}}$ za $a x + b y + c = 0$ |
| Ploščina trikotnika | $S = \dfrac{1}{2} \lvert (x_2 - x_1)(y_3 - y_1) - (x_3 - x_1)(y_2 - y_1) \rvert$ |
| Krožnica | $(x - p)^2 + (y - q)^2 = r^2$ |
| Elipsa | $\dfrac{x^2}{a^2} + \dfrac{y^2}{b^2} = 1$, $\; e^2 = a^2 - b^2$ ($a > b$) |
| Hiperbola | $\dfrac{x^2}{a^2} - \dfrac{y^2}{b^2} = 1$, $\; e^2 = a^2 + b^2$, asimptoti $y = \pm \dfrac{b}{a} x$ |
| Parabola | $y^2 = 2 p x$, gorišče $G\left(\dfrac{p}{2}, 0\right)$, vodnica $x = -\dfrac{p}{2}$ |

:::simboli
\vec{a}, \vec{b} | vektorja | | |
a_1, a_2, a_3 | komponente vektorja $\vec{a}$ | | |
b_1, b_2, b_3 | komponente vektorja $\vec{b}$ | | |
\varphi | kot med vektorjema (pri premici: naklonski kot; pri dveh premicah: kot med njima) | | |
d | razdalja (med točkama oziroma točke od premice) | | |
A, B | točki (krajišči daljice) | | |
x, y | koordinati poljubne točke na premici ali krivulji | | |
x_1, y_1 | koordinati prve točke (oglišča $A$) | | |
x_2, y_2 | koordinati druge točke (oglišča $B$) | | |
x_3, y_3 | koordinati tretjega oglišča trikotnika | | |
x_0, y_0 | koordinati dane točke | | | točke, katere razdaljo od premice računamo
S | razpolovišče daljice $AB$ (pri trikotniku: ploščina) | | |
k | smerni koeficient premice | k = \tan \varphi | |
k_1, k_2 | smerna koeficienta premic | | |
n | začetna vrednost (odsek na osi $y$) | | |
a | koeficient pri $x$ v enačbi premice (pri elipsi in hiperboli: velika oziroma realna polos) | | | v enačbi premice $a$ in $b$ nista hkrati 0
b | koeficient pri $y$ v enačbi premice (pri elipsi in hiperboli: mala oziroma imaginarna polos) | | |
c | prosti člen v implicitni enačbi premice | | | $a x + b y + c = 0$
p, q | koordinati središča krožnice (pri paraboli: $p$ parameter parabole) | | |
r | polmer krožnice | | |
e | linearna ekscentričnost | | | razdalja gorišča od središča elipse oziroma hiperbole
G | gorišče parabole | G\left(\dfrac{p}{2}, 0\right) | |
:::

## Zaporedja in obresti

| | |
|---|---|
| Aritmetično zaporedje | $a_n = a_1 + (n - 1) d$, $\; s_n = \dfrac{n}{2} (2 a_1 + (n - 1) d) = \dfrac{n (a_1 + a_n)}{2}$ |
| Geometrijsko zaporedje | $a_n = a_1 q^{n - 1}$, $\; s_n = a_1 \dfrac{q^n - 1}{q - 1}$ ($q \ne 1$) |
| Geometrijska vrsta | $s = \dfrac{a_1}{1 - q}$ za $\lvert q \rvert < 1$ |
| Navadno obrestovanje | $o = \dfrac{G_0 \cdot p \cdot n}{100}$ |
| Obrestno obrestovanje | $G_n = G_0 \cdot r^n$, $\; r = 1 + \dfrac{p}{100}$ |

:::simboli
a_1 | prvi člen zaporedja | | |
a_n | splošni ($n$-ti) člen zaporedja | | |
n | zaporedna številka člena (število členov; pri obrestih število let) | | |
d | diferenca aritmetičnega zaporedja | d = a_{n+1} - a_n | |
q | količnik geometrijskega zaporedja | q = \dfrac{a_{n+1}}{a_n} | | $q \ne 0$; pri $s_n$ je $q \ne 1$, pri geometrijski vrsti $\lvert q \rvert < 1$
s_n | vsota prvih $n$ členov | | |
s | vsota geometrijske vrste | | |
o | obresti | | |
G_0 | začetna glavnica | | |
G_n | glavnica po $n$ letih | | |
p | letna obrestna mera | | \% |
r | obrestovalni faktor | r = 1 + \dfrac{p}{100} | |
:::

## Kombinatorika, verjetnost, statistika

| | |
|---|---|
| Permutacije | $P_n = n!$; s ponavljanjem $P_n^{k_1, k_2, \dots} = \dfrac{n!}{k_1!\, k_2! \cdots}$ |
| Variacije | $V_n^r = \dfrac{n!}{(n - r)!}$; s ponavljanjem $n^r$ |
| Kombinacije | $C_n^r = \dbinom{n}{r} = \dfrac{n!}{r!\,(n - r)!}$ |
| Binomski izrek | $(a + b)^n = \sum_{k=0}^{n} \dbinom{n}{k} a^{n-k} b^k$ |
| Verjetnost | $P(A) = \dfrac{m}{n}$, $\; P(A') = 1 - P(A)$, $\; P(A \cup B) = P(A) + P(B) - P(A \cap B)$ |
| Pogojna, neodvisni | $P(A \mid B) = \dfrac{P(A \cap B)}{P(B)}$; neodvisna: $P(A \cap B) = P(A) P(B)$ |
| Bernoullijevo zaporedje | $P_n(k) = \dbinom{n}{k} p^k (1 - p)^{n - k}$ |
| Povprečje, odklon | $\bar{x} = \dfrac{1}{N} \sum x_i$, $\; \sigma = \sqrt{\dfrac{1}{N} \sum (x_i - \bar{x})^2}$ |

:::simboli
P_n | število permutacij $n$ elementov (pri Bernoullijevem zaporedju: $P_n(k)$ verjetnost $k$ uspehov v $n$ poskusih) | | |
n | število elementov (pri verjetnosti število vseh izidov, pri Bernoullijevem zaporedju število poskusov, pri binomskem izreku eksponent) | | |
k_1, k_2 | števila ponovitev posameznih elementov | | |
V_n | število variacij $r$-tega razreda iz $n$ elementov | | | vrstni red izbranih elementov je pomemben
C_n | število kombinacij $r$-tega razreda iz $n$ elementov | | | vrstni red izbranih elementov ni pomemben
r | razred (število izbranih elementov) | | |
a, b | poljubni števili (člena binoma) | | |
k | indeks seštevanja v binomskem razvoju, eksponent pri $b$ (pri Bernoullijevem zaporedju: število uspehov) | | |
P | verjetnost | | | pri pogojni verjetnosti mora biti $P(B) > 0$
A, B | dogodka | | |
A' | nasprotni dogodek dogodka $A$ | | |
m | število ugodnih izidov | | |
p | verjetnost uspeha v posameznem poskusu | | |
\bar{x} | aritmetična sredina | | |
N | število podatkov | | |
x_i | posamezni podatki | | |
\sigma | standardni odklon | | |
:::

## Odvod in integral

| | |
|---|---|
| Limita funkcije | $\lim\limits_{x \to a} f(x) = b$: za vsak $\varepsilon > 0$ obstaja tak $\delta > 0$, da je $\lvert f(x) - b \rvert < \varepsilon$ za vsak $x \in D_f$, za katerega je $0 < \lvert x - a \rvert < \delta$ |
| Definicija odvoda | $f'(x) = \lim\limits_{\Delta x \to 0} \dfrac{f(x + \Delta x) - f(x)}{\Delta x}$ |
| Odvodi | $(x^n)' = n x^{n-1}$, $(\sin x)' = \cos x$, $(\cos x)' = -\sin x$, $(\tan x)' = \dfrac{1}{\cos^2 x}$ |
| | $(e^x)' = e^x$, $(a^x)' = a^x \ln a$, $(\ln x)' = \dfrac{1}{x}$, $(\log_a x)' = \dfrac{1}{x \ln a}$ |
| Pravila | $(u v)' = u' v + u v'$, $\; \left(\dfrac{u}{v}\right)' = \dfrac{u' v - u v'}{v^2}$, $\; (f(g(x)))' = f'(g(x))\, g'(x)$ |
| Tangenta | $y - y_0 = f'(x_0)(x - x_0)$ |
| Ekstrem | $f'(x_0) = 0$ in $f''(x_0) < 0$: maksimum; $f'(x_0) = 0$ in $f''(x_0) > 0$: minimum |
| Diferencial | $d f = f'(x)\,d x$, $\; d x = \Delta x$; $\; \Delta f = f(x + \Delta x) - f(x) \approx d f$ za majhen $\lvert \Delta x \rvert$ |
| Integrali | $\int x^n\,dx = \dfrac{x^{n+1}}{n + 1} + C$ ($n \ne -1$), $\int \dfrac{dx}{x} = \ln \lvert x \rvert + C$ |
| | $\int e^x\,dx = e^x + C$, $\int \sin x\,dx = -\cos x + C$, $\int \cos x\,dx = \sin x + C$ |
| Newton–Leibniz | $\int_a^b f(x)\,dx = F(b) - F(a)$ |
| Trapezna metoda | $\int_a^b f(x)\,dx \approx \dfrac{h}{2} \big(f(a) + 2 f(a + h) + 2 f(a + 2 h) + \dots + 2 f(b - h) + f(b)\big)$, $\; h = \dfrac{b - a}{n}$ |
| Ploščina, vrtenina | $S = \int_a^b \lvert f(x) - g(x) \rvert\,dx$, $\; V = \pi \int_a^b f(x)^2\,dx$ |

:::simboli
x | neodvisna spremenljivka | | | pri $\ln x$ in $\log_a x$ je $x > 0$
n | poljubno realno število (eksponent; pri trapezni metodi število podintervalov, naravno število) | | | pri integralu $n \ne -1$
e | Eulerjevo število | | | $e \approx 2{,}71828$
a | osnova potence in logaritma (pri določenem integralu: spodnja meja; pri limiti: točka, ki se ji $x$ približuje) | | | kot osnova $a > 0$, $a \ne 1$
b | zgornja meja določenega integrala (pri limiti: limita funkcije) | | |
u, v | funkciji spremenljivke $x$ | | | v odvodu količnika $v \ne 0$
u', v' | odvoda funkcij $u$ in $v$ | | |
f, g | funkciji (pri sestavljeni funkciji: $f$ zunanja, $g$ notranja) | | |
f', g' | odvoda funkcij $f$ in $g$ | | |
f'' | drugi odvod funkcije $f$ | | |
x_0 | abscisa dotikališča (pri ekstremu: stacionarna točka) | | |
y_0 | ordinata dotikališča | y_0 = f(x_0) | |
y | ordinata točke na tangenti | | |
d | oznaka diferenciala | | | $dx$ pove, po kateri spremenljivki integriramo; pri diferencialu $d x = \Delta x$, $d f = f'(x)\,d x$
\varepsilon | dovoljeni odmik vrednosti od limite | | | poljubno majhno pozitivno število
\delta | polmer okolice točke $a$, v kateri se vrednosti funkcije od $b$ razlikujejo za manj kot $\varepsilon$ | | | odvisen od $\varepsilon$
D_f | definicijsko območje funkcije $f$ | | |
\Delta x | sprememba neodvisne spremenljivke | | |
\Delta f | sprememba vrednosti funkcije | \Delta f = f(x + \Delta x) - f(x) | |
h | dolžina podintervala (širina trapeza) | h = \dfrac{b - a}{n} | |
C | integracijska konstanta (poljubno realno število) | | |
F | primitivna funkcija funkcije $f$ | | | $F' = f$
S | ploščina lika med grafoma | | |
V | prostornina vrtenine | | | vrtenje okoli osi $x$
:::

## Telesa

| Telo | Površina | Prostornina |
|---|---|---|
| Prizma | $P = 2 O + S_{pl}$ | $V = O v$ |
| Piramida | $P = O + S_{pl}$ | $V = \dfrac{O v}{3}$ |
| Prisekana piramida | $P = O_1 + O_2 + S_{pl}$ | $V = \dfrac{v}{3} \left(O_1 + \sqrt{O_1 O_2} + O_2\right)$ |
| Valj | $P = 2 \pi r (r + v)$ | $V = \pi r^2 v$ |
| Stožec | $P = \pi r (r + s)$ | $V = \dfrac{\pi r^2 v}{3}$ |
| Krogla | $P = 4 \pi r^2$ | $V = \dfrac{4 \pi r^3}{3}$ |

| | |
|---|---|
| Konstanti | $\pi \approx 3{,}14159$, $\; e \approx 2{,}71828$ |

:::simboli
P | površina telesa | | |
O | ploščina osnovne ploskve | | |
O_1, O_2 | ploščini spodnje in zgornje osnovne ploskve prisekane piramide | | |
S_{pl} | ploščina plašča | | |
V | prostornina telesa | | |
v | višina telesa | | |
r | polmer (osnovne ploskve oziroma krogle) | | |
s | stranica stožca | s^2 = r^2 + v^2 | |
e | Eulerjevo število | | | osnova naravnega logaritma
:::
