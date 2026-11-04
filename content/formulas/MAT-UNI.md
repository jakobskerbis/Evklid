## Odvodi

| | |
|---|---|
| Definicija | $f'(x) = \lim\limits_{h \to 0} \dfrac{f(x+h) - f(x)}{h}$ |
| Pravila | $(f g)' = f' g + f g'$, $\; \left(\dfrac{f}{g}\right)' = \dfrac{f' g - f g'}{g^2}$, $\; \big(f(g(x))\big)' = f'(g(x))\, g'(x)$ |
| Potence, eksponent, logaritem | $(x^a)' = a x^{a-1}$, $\; (e^x)' = e^x$, $\; (a^x)' = a^x \ln a$, $\; (\ln x)' = \dfrac{1}{x}$, $\; (\log_a x)' = \dfrac{1}{x \ln a}$ |
| Kotne funkcije | $(\sin x)' = \cos x$, $\; (\cos x)' = -\sin x$, $\; (\tan x)' = \dfrac{1}{\cos^2 x}$, $\; (\cot x)' = -\dfrac{1}{\sin^2 x}$ |
| Krožne funkcije | $(\arcsin x)' = \dfrac{1}{\sqrt{1-x^2}}$, $\; (\arccos x)' = -\dfrac{1}{\sqrt{1-x^2}}$, $\; (\arctan x)' = \dfrac{1}{1+x^2}$ |
| Hiperbolične funkcije | $(\sinh x)' = \cosh x$, $\; (\cosh x)' = \sinh x$, $\; \cosh^2 x - \sinh^2 x = 1$ |
| L'Hospitalovo pravilo | $\lim \dfrac{f}{g} = \lim \dfrac{f'}{g'}$ pri $\dfrac{0}{0}$ ali $\dfrac{\infty}{\infty}$ |
| Tangenta | $y = f(x_0) + f'(x_0)(x - x_0)$ |

:::simboli
f, g | odvedljivi funkciji (pri kompozitumu: $f$ zunanja, $g$ notranja) | | |
f', g' | odvoda funkcij $f$ in $g$ | f'(x) = \lim\limits_{h \to 0} \dfrac{f(x+h) - f(x)}{h} | |
x | neodvisna spremenljivka | | |
h | prirastek neodvisne spremenljivke | | | v diferenčnem količniku $h \to 0$
a | realni eksponent (pri $a^x$ in $\log_a x$: osnova) | | | kot osnova $a > 0$, $a \ne 1$
e | Eulerjevo število | | | $e \approx 2{,}71828$
x_0 | abscisa dotikališča | | |
y | ordinata točke na tangenti | | |
:::

## Pomembne limite

| | |
|---|---|
| Kotne | $\lim\limits_{x \to 0} \dfrac{\sin x}{x} = 1$, $\; \lim\limits_{x \to 0} \dfrac{1 - \cos x}{x^2} = \dfrac{1}{2}$ |
| Število $e$ | $\lim\limits_{n \to \infty} \left(1 + \dfrac{1}{n}\right)^n = e$, $\; \lim\limits_{x \to 0} \dfrac{e^x - 1}{x} = 1$, $\; \lim\limits_{x \to 0} \dfrac{\ln(1+x)}{x} = 1$ |
| Rast | $\lim\limits_{x \to \infty} \dfrac{x^a}{e^x} = 0$, $\; \lim\limits_{x \to \infty} \dfrac{\ln x}{x^a} = 0$ ($a > 0$) |

:::simboli
x | realna spremenljivka | | |
n | naravno število (indeks zaporedja) | | |
e | Eulerjevo število | e = \lim\limits_{n \to \infty} \left(1 + \dfrac{1}{n}\right)^n | | $e \approx 2{,}71828$
a | pozitivno realno število (eksponent) | | |
:::

## Integrali

| | |
|---|---|
| Osnovni | $\int x^a\,dx = \dfrac{x^{a+1}}{a+1} + C$ ($a \ne -1$), $\; \int \dfrac{dx}{x} = \ln\lvert x\rvert + C$, $\; \int e^x\,dx = e^x + C$ |
| Kotni | $\int \sin x\,dx = -\cos x + C$, $\; \int \cos x\,dx = \sin x + C$, $\; \int \dfrac{dx}{\cos^2 x} = \tan x + C$ |
| Racionalni | $\int \dfrac{dx}{1+x^2} = \arctan x + C$, $\; \int \dfrac{dx}{a^2 + x^2} = \dfrac{1}{a}\arctan\dfrac{x}{a} + C$, $\; \int \dfrac{dx}{\sqrt{1-x^2}} = \arcsin x + C$ |
| Per partes | $\int u\,dv = u v - \int v\,du$ |
| Uvedba nove spremenljivke | $\int f(g(x))\, g'(x)\,dx = \int f(t)\,dt$ ($t = g(x)$) |
| Newton–Leibniz | $\int_a^b f(x)\,dx = F(b) - F(a)$ ($F' = f$) |
| Ploščina, prostornina | $S = \int_a^b \lvert f(x) - g(x)\rvert\,dx$, $\; V = \pi \int_a^b f(x)^2\,dx$ (vrtenje okoli osi $x$) |
| Dolžina loka | $s = \int_a^b \sqrt{1 + f'(x)^2}\,dx$ |

:::simboli
x | integracijska spremenljivka | | |
a | realni parameter (pri določenem integralu: spodnja meja) | | | v $\int x^a\,dx$ je $a \ne -1$, v $\int \frac{dx}{a^2 + x^2}$ je $a \ne 0$
b | zgornja meja integracije | | |
d | oznaka diferenciala | | | v $dx$, $du$, $dv$, $dt$
C | integracijska konstanta | | | poljubno realno število
e | Eulerjevo število | | |
u, v | odvedljivi funkciji (pri integraciji po delih) | | | $du = u'\,dx$, $dv = v'\,dx$
f, g | funkciji (integrand; pri uvedbi nove spremenljivke $g$ notranja funkcija) | | |
f', g' | odvoda funkcij $f$ in $g$ | | |
t | nova integracijska spremenljivka | t = g(x) | |
F | primitivna funkcija funkcije $f$ | | | $F' = f$
S | ploščina območja med grafoma | | |
V | prostornina vrtenine | | |
s | dolžina loka grafa | | |
:::

## Vrste

| | |
|---|---|
| Geometrijska | $\sum\limits_{n=0}^{\infty} q^n = \dfrac{1}{1-q}$ ($\lvert q\rvert < 1$) |
| Taylorjeva | $f(x) = \sum\limits_{n=0}^{\infty} \dfrac{f^{(n)}(a)}{n!}(x-a)^n$ |
| Razvoji pri $0$ | $e^x = \sum \dfrac{x^n}{n!}$, $\; \sin x = x - \dfrac{x^3}{3!} + \dfrac{x^5}{5!} - \dots$, $\; \cos x = 1 - \dfrac{x^2}{2!} + \dfrac{x^4}{4!} - \dots$ |
| | $\ln(1+x) = x - \dfrac{x^2}{2} + \dfrac{x^3}{3} - \dots$ ($-1 < x \le 1$), $\; (1+x)^a = \sum \binom{a}{n} x^n$ ($\lvert x\rvert < 1$) |
| Konvergenca | kvocientni kriterij: $\lim \left\lvert \dfrac{a_{n+1}}{a_n} \right\rvert < 1$; korenski: $\lim \sqrt[n]{\lvert a_n\rvert} < 1$; $\sum \dfrac{1}{n^p}$ konvergira za $p > 1$ |

:::simboli
n | indeks seštevanja (celo število, $n \ge 0$) | | | v vrsti $\sum \frac{1}{n^p}$ je $n \ge 1$
q | količnik geometrijske vrste | | |
f | funkcija, ki je v okolici točke $a$ poljubnokrat odvedljiva | | | $f^{(n)}$ je njen $n$-ti odvod
x | realna spremenljivka | | |
a | središče razvoja (pri binomski vrsti: realni eksponent) | | |
e | Eulerjevo število | | |
a_n | splošni člen vrste | | |
a_{n+1} | naslednji člen vrste | | |
p | realni eksponent v vrsti $\sum \frac{1}{n^p}$ | | |
:::

## Funkcije več spremenljivk

| | |
|---|---|
| Gradient | $\nabla f = \left(\dfrac{\partial f}{\partial x}, \dfrac{\partial f}{\partial y}, \dfrac{\partial f}{\partial z}\right)$, smerni odvod $\dfrac{\partial f}{\partial \vec{e}} = \nabla f \cdot \vec{e}$ |
| Totalni diferencial | $df = \dfrac{\partial f}{\partial x}dx + \dfrac{\partial f}{\partial y}dy$ |
| Ekstremi | $\nabla f = 0$; $D = f_{xx} f_{yy} - f_{xy}^2$: $D > 0$ in $f_{xx} > 0$ minimum, $D > 0$ in $f_{xx} < 0$ maksimum, $D < 0$ sedlo |
| Vezani ekstremi | $\nabla f = \lambda \nabla g$ in $g = 0$ (Lagrange) |
| Dvojni, trojni integral | polarne koordinate: $dx\,dy = r\,dr\,d\varphi$; cilindrične $dV = r\,dr\,d\varphi\,dz$; sferne $dV = r^2 \sin\vartheta\,dr\,d\vartheta\,d\varphi$ |

:::simboli
f | funkcija več spremenljivk | | |
x, y, z | neodvisne spremenljivke (kartezične koordinate) | | |
\vec{e} | enotski vektor smeri | | | $\lvert \vec{e} \rvert = 1$
d | oznaka diferenciala | | | $df$ je totalni diferencial, $dV$ element prostornine
D | determinanta Hessejeve matrike | D = f_{xx} f_{yy} - f_{xy}^2 | | v stacionarni točki
f_{xx}, f_{yy} | druga parcialna odvoda po $x$ oziroma po $y$ | | |
f_{xy} | mešani drugi parcialni odvod | | |
\lambda | Lagrangeev multiplikator | | |
g | funkcija vezi | | | vez je $g = 0$
r | razdalja od osi $z$ (pri sfernih koordinatah: od izhodišča) | | | polarna oziroma cilindrična koordinata
\varphi | polarni kot (pri sfernih koordinatah: azimut) | | |
\vartheta | zenitni (polarni) kot, merjen od pozitivne osi $z$ | | | sferne koordinate
V | prostornina | | | $dV$ je element prostornine
:::

## Diferencialne enačbe

| | |
|---|---|
| Ločljive spremenljivke | $y' = f(x)\,g(y) \Rightarrow \int \dfrac{dy}{g(y)} = \int f(x)\,dx$ |
| Linearna 1. reda | $y' + p(x)\,y = q(x)$: $\; y = e^{-\int p\,dx}\left(\int q\,e^{\int p\,dx}\,dx + C\right)$ |
| Linearna 2. reda s konstantnimi koeficienti | $a y'' + b y' + c y = 0$, karakteristična enačba $a\lambda^2 + b\lambda + c = 0$ |
| Rešitve | $\lambda_1 \ne \lambda_2$ realni: $y = C_1 e^{\lambda_1 x} + C_2 e^{\lambda_2 x}$; dvojni $\lambda$: $y = (C_1 + C_2 x)e^{\lambda x}$; $\lambda = \alpha \pm i\beta$: $y = e^{\alpha x}(C_1 \cos\beta x + C_2 \sin\beta x)$ |

:::simboli
y | iskana funkcija spremenljivke $x$ | | |
y', y'' | prvi in drugi odvod iskane funkcije | | |
x | neodvisna spremenljivka | | |
f, g | dani funkciji (pri ločljivih spremenljivkah: $f$ od $x$, $g$ od $y$) | | |
p, q | dani zvezni funkciji spremenljivke $x$ | | | $p$ koeficient pri $y$, $q$ desna stran (motnja)
d | oznaka diferenciala | | |
e | Eulerjevo število | | |
C | integracijska konstanta | | |
C_1, C_2 | poljubni konstanti splošne rešitve | | | določimo ju iz začetnih ali robnih pogojev
a, b, c | konstantni realni koeficienti | | | $a \ne 0$
\lambda | neznanka karakteristične enačbe oziroma njena ničla (dvojna ali kompleksna $\alpha \pm i\beta$) | | |
\lambda_1, \lambda_2 | različni realni ničli karakteristične enačbe | | |
\alpha | realni del kompleksnih ničel $\lambda = \alpha \pm i\beta$ | | |
\beta | imaginarni del kompleksnih ničel ($\beta > 0$) | | |
i | imaginarna enota | i^2 = -1 | |
:::

## Linearna algebra

| | |
|---|---|
| Skalarni produkt | $\vec{a} \cdot \vec{b} = a_1 b_1 + a_2 b_2 + a_3 b_3 = \lvert\vec{a}\rvert\,\lvert\vec{b}\rvert \cos\varphi$ |
| Vektorski produkt | $\vec{a} \times \vec{b} = (a_2 b_3 - a_3 b_2,\ a_3 b_1 - a_1 b_3,\ a_1 b_2 - a_2 b_1)$, $\; \lvert\vec{a} \times \vec{b}\rvert = \lvert\vec{a}\rvert\,\lvert\vec{b}\rvert \sin\varphi$ |
| Mešani produkt | $(\vec{a}, \vec{b}, \vec{c}) = (\vec{a} \times \vec{b}) \cdot \vec{c}$ = prostornina paralelepipeda |
| Projekcija | $\operatorname{proj}_{\vec{b}} \vec{a} = \dfrac{\vec{a} \cdot \vec{b}}{\vec{b} \cdot \vec{b}}\,\vec{b}$ |
| Premica, ravnina | $\vec{r} = \vec{r}_0 + t\,\vec{s}$; $\; \vec{n} \cdot (\vec{r} - \vec{r}_0) = 0$, $\; a x + b y + c z = d$ |
| Razdalja točke od ravnine | $d = \dfrac{\lvert a x_0 + b y_0 + c z_0 - d\rvert}{\sqrt{a^2 + b^2 + c^2}}$ |
| Determinanta $2 \times 2$ | $\begin{vmatrix} a & b \\ c & d \end{vmatrix} = a d - b c$ |
| Inverz $2 \times 2$ | $A^{-1} = \dfrac{1}{a d - b c}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$ |
| Pravila | $(A B)^{-1} = B^{-1} A^{-1}$, $\; (A B)^T = B^T A^T$, $\; \det(A B) = \det A \det B$ |
| Lastne vrednosti | $A\vec{v} = \lambda\vec{v}$, $\; \det(A - \lambda I) = 0$, $\; \sum \lambda_i = \operatorname{sl} A$, $\; \prod \lambda_i = \det A$ |
| Cramerjevo pravilo | $x_i = \dfrac{\det A_i}{\det A}$ |
| Rang | $A\vec{x} = \vec{b}$ je rešljiv $\iff \operatorname{rang} A = \operatorname{rang}[A \mid \vec{b}]$ |

:::simboli
\vec{a}, \vec{c} | vektorja v prostoru | | |
\vec{b} | vektor v prostoru (pri sistemu $A\vec{x} = \vec{b}$: vektor desnih strani) | | |
a_1, a_2, a_3 | komponente vektorja $\vec{a}$ | | |
b_1, b_2, b_3 | komponente vektorja $\vec{b}$ | | |
\varphi | kot med vektorjema | | |
\vec{r} | krajevni vektor poljubne točke premice oziroma ravnine | | |
\vec{r}_0 | krajevni vektor dane točke | | |
t | realni parameter | | |
\vec{s} | smerni vektor premice | | |
\vec{n} | normalni vektor ravnine | | |
x, y, z | koordinate točke na ravnini | | |
x_0, y_0, z_0 | koordinate dane točke | | |
a, b, c | koeficienti v enačbi ravnine (v matriki $2 \times 2$: elementi) | | | $(a, b, c)$ je normalni vektor ravnine
d | razdalja točke od ravnine (v enačbi ravnine: prosti člen; v matriki: element) | | |
A, B | matriki (v Cramerjevem pravilu $A$ matrika sistema) | | | $A^{-1}$ obstaja natanko tedaj, ko je $\det A \ne 0$; to zahteva tudi Cramerjevo pravilo
A_i | matrika $A$, v kateri je $i$-ti stolpec zamenjan z $\vec{b}$ | | |
T | oznaka transponiranja | | | $A^T$ je transponirana matrika
I | enotska (identična) matrika | | |
\vec{v} | lastni vektor | | | $\vec{v} \ne \vec{0}$
\lambda | lastna vrednost matrike $A$ | | |
\lambda_i | $i$-ta lastna vrednost | | |
\vec{x} | vektor neznank | | |
x_i | $i$-ta neznanka sistema | | |
:::

## Kompleksna števila

| | |
|---|---|
| Zapis | $z = a + b i = r(\cos\varphi + i \sin\varphi) = r e^{i\varphi}$, $\; r = \sqrt{a^2 + b^2}$ |
| De Moivre | $z^n = r^n (\cos n\varphi + i \sin n\varphi)$ |
| Koreni | $\sqrt[n]{z} = \sqrt[n]{r}\left(\cos\dfrac{\varphi + 2k\pi}{n} + i \sin\dfrac{\varphi + 2k\pi}{n}\right)$ ($k = 0, \dots, n-1$) |
| Euler | $e^{i\varphi} = \cos\varphi + i \sin\varphi$ |

:::simboli
z | kompleksno število | | |
a | realni del | | | $a = \operatorname{Re} z$
b | imaginarni del | | | $b = \operatorname{Im} z$
i | imaginarna enota | i^2 = -1 | |
r | absolutna vrednost (modul) | r = \sqrt{a^2 + b^2} | |
\varphi | argument kompleksnega števila | | | kot med pozitivnim delom realne osi in krajevnim vektorjem števila
e | Eulerjevo število | | |
n | naravno število (eksponent potence oziroma stopnja korena) | | |
k | indeks korena | | | $k = 0, 1, \dots, n - 1$ da vseh $n$ različnih korenov
:::

## Verjetnost in statistika

| | |
|---|---|
| Kombinatorika | $P_n = n!$, $\; V_n^r = \dfrac{n!}{(n-r)!}$, $\; C_n^r = \binom{n}{r} = \dfrac{n!}{r!\,(n-r)!}$ |
| Pogojna verjetnost | $P(A \mid B) = \dfrac{P(A \cap B)}{P(B)}$, $\; P(A \cup B) = P(A) + P(B) - P(A \cap B)$ |
| Bayes | $P(H_i \mid A) = \dfrac{P(A \mid H_i)\,P(H_i)}{\sum_j P(A \mid H_j)\,P(H_j)}$ |
| Pričakovana vrednost, disperzija | $E(X) = \sum x_i p_i$, $\; D(X) = E(X^2) - E(X)^2$, $\; \sigma = \sqrt{D(X)}$ |
| Binomska $B(n, p)$ | $P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}$, $\; E = n p$, $\; D = n p (1-p)$ |
| Poissonova $\mathrm{Po}(\lambda)$ | $P(X = k) = \dfrac{\lambda^k e^{-\lambda}}{k!}$, $\; E = D = \lambda$ |
| Normalna $N(\mu, \sigma^2)$ | $f(x) = \dfrac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$, $\; Z = \dfrac{X - \mu}{\sigma}$ |
| Eksponentna | $f(x) = \lambda e^{-\lambda x}$ ($x \ge 0$), $\; E = \dfrac{1}{\lambda}$, $\; D = \dfrac{1}{\lambda^2}$ |
| Vzorec | $\bar{x} = \dfrac{1}{n}\sum x_i$, $\; s^2 = \dfrac{1}{n-1}\sum (x_i - \bar{x})^2$ |
| Interval zaupanja za $\mu$ | $\bar{x} \pm t_{n-1,\,\alpha/2}\,\dfrac{s}{\sqrt{n}}$ (pri znanem $\sigma$: $\bar{x} \pm z_{\alpha/2}\,\dfrac{\sigma}{\sqrt{n}}$; $z_{0{,}025} = 1{,}96$) |
| Linearna regresija | $y = k x + n$, $\; k = \dfrac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2}$, $\; n = \bar{y} - k \bar{x}$ |
| Korelacijski koeficient | $r = \dfrac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2 \sum (y_i - \bar{y})^2}}$ |

:::simboli
P_n | število permutacij $n$ elementov | | |
V_n | število variacij $r$-tega razreda iz $n$ elementov | | |
C_n | število kombinacij $r$-tega razreda iz $n$ elementov | | |
n | število elementov (pri binomski porazdelitvi število poskusov, pri vzorcu velikost vzorca; v regresiji: začetna vrednost premice) | | |
r | razred variacij in kombinacij (pri korelaciji: Pearsonov korelacijski koeficient) | | |
P | verjetnost | | | v pogojni verjetnosti mora biti $P(B) > 0$
A | dogodek | | |
B | dogodek (v $B(n, p)$: oznaka binomske porazdelitve) | | |
H_i, H_j | hipoteze (popoln sistem dogodkov) | | |
j | indeks seštevanja po hipotezah | | |
X | slučajna spremenljivka | | |
x_i | vrednosti slučajne spremenljivke (pri vzorcu in regresiji: izmerjene vrednosti) | | |
p_i | verjetnost vrednosti $x_i$ | p_i = P(X = x_i) | |
E | pričakovana vrednost | | |
D | disperzija (varianca) | | |
\sigma | standardni odklon | \sigma = \sqrt{D(X)} | |
p | verjetnost uspeha v posameznem poskusu | | |
k | število uspehov (vrednost slučajne spremenljivke; v regresiji: smerni koeficient premice) | | |
\lambda | parameter Poissonove oziroma eksponentne porazdelitve | | |
e | Eulerjevo število | | |
N | oznaka normalne porazdelitve | | |
\mu | pričakovana vrednost normalne porazdelitve | | |
f | gostota verjetnosti | | |
x | realna spremenljivka (v regresiji: neodvisna spremenljivka) | | |
Z | standardizirana slučajna spremenljivka | Z = \dfrac{X - \mu}{\sigma} | | porazdeljena po $N(0, 1)$
\bar{x} | vzorčno povprečje | | |
s | vzorčni standardni odklon | | | $s^2$ je vzorčna varianca
t_{n-1,\,\alpha/2} | kvantil Studentove porazdelitve z $n - 1$ prostostnimi stopnjami | | | $\alpha$ je stopnja tveganja, stopnja zaupanja intervala je $1 - \alpha$
z_{\alpha/2}, z_{0{,}025} | kvantil standardizirane normalne porazdelitve | | | $z_{0{,}025} = 1{,}96$ da 95-odstotni interval zaupanja
y | odvisna spremenljivka v regresiji | | |
y_i | izmerjene vrednosti odvisne spremenljivke | | |
\bar{y} | povprečje vrednosti $y_i$ | | |
:::
