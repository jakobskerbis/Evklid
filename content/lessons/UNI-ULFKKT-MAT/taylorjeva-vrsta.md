---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Silicijeva dioda v prevodni smeri prepušča tok $I = I_\mathrm{S}\,\mathrm{e}^{U/U_T}$, kjer je $U_T = 25{,}85\,\mathrm{mV}$ termična napetost pri sobni temperaturi. V delovni točki teče tok $I_0 = 1\,\mathrm{mA}$. Napetost povečamo za $\Delta U$ in izmerimo nov tok:

| $\Delta U$ | izmerjeni $I$ | tangenta |
|---|---|---|
| $5\,\mathrm{mV}$ | $1{,}213\,\mathrm{mA}$ | $1{,}193\,\mathrm{mA}$ |
| $10\,\mathrm{mV}$ | $1{,}472\,\mathrm{mA}$ | $1{,}387\,\mathrm{mA}$ |
| $20\,\mathrm{mV}$ | $2{,}168\,\mathrm{mA}$ | $1{,}774\,\mathrm{mA}$ |

Zadnji stolpec je napoved **linearnega modela** (tangente), ki ga elektrotehniki uporabljajo za »majhne signale«. Pri $5\,\mathrm{mV}$ je odlična, pri $20\,\mathrm{mV}$ pa zgreši za skoraj $20\,\%$. Taylorjev polinom višje stopnje iz lekcije o uporabi odvoda pomaga, vendar se postavita dve vprašanji, na kateri polinom sam ne odgovori:

- ali z dodajanjem členov napako res lahko poljubno zmanjšamo in
- za katere $\Delta U$ to velja, ali le za majhne ali za vse?

Odgovor je **Taylorjeva vrsta**: neskončen polinom, ki je pri lepih funkcijah enak funkciji sami. Z njo računalniki računajo $\mathrm{e}^x$, $\sin x$ in $\ln x$, fiziki in kemiki pa iz nje dobijo približke z zanesljivo oceno napake. Spoznal boš:

- kdaj Taylorjeva vrsta funkcije res konvergira k funkciji (ostanek $R_n \to 0$),
- razvoje $\mathrm{e}^x$, $\sin x$, $\cos x$, $\ln(1 + x)$ in binomsko vrsto $(1 + x)^\alpha$ z območji konvergence,
- kako nove razvoje dobiš iz znanih brez odvajanja,
- kako oceniš napako, ko vrsto odrežeš.

## Razlaga

Gradili bomo po kosih. Za vsakim kosom je kratko vprašanje za preizkus; odgovor je v oklepaju.

**1. Od polinoma do vrste.** Iz lekcije o uporabi odvoda poznaš Taylorjev polinom $T_n$ in Taylorjevo formulo $f(x) = T_n(x) + R_n(x)$ z Lagrangeovim ostankom $R_n(x) = \frac{f^{(n+1)}(\xi)}{(n+1)!}(x - a)^{n+1}$, $\xi$ med $a$ in $x$. Če ima $f$ odvode vseh redov, lahko $n$ večamo brez konca.

**Definicija.** Naj ima $f$ v točki $a$ odvode vseh redov. **Taylorjeva vrsta** funkcije $f$ okoli $a$ je potenčna vrsta

$$T(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x - a)^n.$$

Pri $a = 0$ ji pravimo **Maclaurinova vrsta**. Delne vsote Taylorjeve vrste so ravno Taylorjevi polinomi $T_n$.

*Preizkus:* kakšna je Taylorjeva vrsta funkcije $f(x) = x^3$ okoli $a = 1$? (Ker je $f(1) = 1$, $f'(1) = 3$, $f''(1) = 6$, $f'''(1) = 6$ in višji odvodi nič, je vrsta končna: $1 + 3(x - 1) + 3(x - 1)^2 + (x - 1)^3$.)

**2. Kdaj je vrsta enaka funkciji.** Taylorjeva vrsta je potenčna vrsta, zato ima konvergenčni polmer. A tudi tam, kjer konvergira, še ni nujno enaka $f$. To odloči ostanek.

**Izrek.** Naj ima $f$ odvode vseh redov na intervalu $I$, ki vsebuje $a$, in naj bo $x \in I$. Taylorjeva vrsta v točki $x$ konvergira k $f(x)$ natanko tedaj, ko je $\lim_{n \to \infty} R_n(x) = 0$.

**Dokaz.** Po Taylorjevi formuli je $T_n(x) = f(x) - R_n(x)$. Delne vsote $T_n(x)$ zato konvergirajo proti $f(x)$ natanko tedaj, ko gre $R_n(x)$ proti $0$. $\square$

Za uporabo potrebujemo zadostni pogoj, ki ga preverimo brez $\xi$.

**Izrek (omejeni odvodi).** Če obstaja konstanta $M$, da je $|f^{(n)}(t)| \le M$ za vse $n$ in vse $t \in I$, potem je $f$ na $I$ enaka svoji Taylorjevi vrsti okoli $a$.

**Dokaz.** Iz Lagrangeove oblike je $|R_n(x)| \le \frac{M\,|x - a|^{n+1}}{(n+1)!}$. Pokažimo, da za vsak $r \ge 0$ velja $\frac{r^n}{n!} \to 0$. Za $n \ge N > 2r$ je $\frac{r^{n+1}}{(n+1)!} = \frac{r^n}{n!} \cdot \frac{r}{n+1} \le \frac12 \cdot \frac{r^n}{n!}$, zato se člen od $N$ naprej pri vsakem koraku vsaj razpolovi in gre proti $0$. Z $r = |x - a|$ dobimo $R_n(x) \to 0$. $\square$

Pogoj o omejenosti odvodov ni odveč. Funkcija $f(x) = \mathrm{e}^{-1/x^2}$ (in $f(0) = 0$) ima v $0$ vse odvode enake $0$, zato je njena Maclaurinova vrsta enaka $0$ za vsak $x$, funkcija pa je za $x \ne 0$ pozitivna. Vrsta konvergira povsod, a k napačni funkciji. Dokaz je v Nalogi 3 razdelka Za izpit.

:::premisli
Odvodi funkcije $\sin x$ so $\pm\sin x$ in $\pm\cos x$. Zakaj iz tega takoj sledi, da je $\sin x$ enak svoji Maclaurinovi vrsti za **vsak** realni $x$, ne le za majhne?
---
Vsi odvodi so po absolutni vrednosti največ $1$ na vsej realni osi, zato lahko vzamemo $M = 1$ in poljubno velik interval $I$. Ocena $|R_n(x)| \le \frac{|x|^{n+1}}{(n+1)!}$ gre proti $0$ za vsak $x$, ker fakulteta raste hitreje od vsake potence.
:::

**3. Eksponentna funkcija.** Za $f(x) = \mathrm{e}^x$ je $f^{(n)}(x) = \mathrm{e}^x$ in $f^{(n)}(0) = 1$. Na intervalu $[-r, r]$ so vsi odvodi omejeni z $M = \mathrm{e}^r$, zato po izreku iz točke 2 velja za **vsak** realni $x$:

$$\mathrm{e}^x = \sum_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \dots$$

Zdaj razumemo tabelo z diodo: $I = I_0\,\mathrm{e}^{x}$ z $x = \Delta U / U_T$. Pri $\Delta U = 20\,\mathrm{mV}$ je $x \approx 0{,}774$; tangenta upošteva le $1 + x$, prvi izpuščeni člen $\frac{x^2}{2} \approx 0{,}30$ pa sploh ni majhen. Z vsakim novim členom se napoved približa meritvi: $1{,}774$; $2{,}073$; $2{,}150$ in naprej proti $2{,}168\,\mathrm{mA}$.

*Preizkus:* kolikšna je vsota $\sum_{n=0}^{\infty} \frac{2^n}{n!}$? (To je vrsta za $\mathrm{e}^x$ pri $x = 2$, torej $\mathrm{e}^2 \approx 7{,}389$.)

**4. Sinus in kosinus.** Odvodi sinusa se ponavljajo s periodo $4$: $\sin$, $\cos$, $-\sin$, $-\cos$. V $0$ dajo zaporedje $0, 1, 0, -1, 0, 1, \dots$ Ker so vsi odvodi omejeni z $1$, za vsak realni $x$ velja:

$$\sin x = \sum_{k=0}^{\infty} \frac{(-1)^k x^{2k+1}}{(2k+1)!} = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \dots$$

$$\cos x = \sum_{k=0}^{\infty} \frac{(-1)^k x^{2k}}{(2k)!} = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \dots$$

Sinus je lih in ima le lihe potence, kosinus je sod in ima le sode. Členoma odvajana vrsta za $\sin x$ je natanko vrsta za $\cos x$, kot mora biti.

*Preizkus:* koliko je $\sin 1$ po prvih dveh členih? ($1 - \frac16 \approx 0{,}8333$; prava vrednost je $0{,}8415$, tretji člen $\frac{1}{120}$ popravi skoraj vso razliko.)

**5. Enoličnost razvoja.** Vrste ni treba vedno računati z odvodi.

**Izrek (enoličnost).** Če je $f(x) = \sum_{n=0}^{\infty} c_n (x - a)^n$ za vse $x$ z $|x - a| < R$, kjer je $R > 0$, potem je $c_n = \frac{f^{(n)}(a)}{n!}$ za vsak $n$. Vsaka potenčna vrsta, ki predstavlja $f$ okoli $a$, je torej njena Taylorjeva vrsta.

**Dokaz.** Znotraj konvergenčnega intervala smemo potenčno vrsto členoma odvajati. Po $k$-kratnem odvajanju je $f^{(k)}(x) = \sum_{n \ge k} n(n-1)\cdots(n-k+1)\,c_n (x - a)^{n-k}$. Pri $x = a$ ostane samo člen $n = k$, zato je $f^{(k)}(a) = k!\,c_k$. $\square$

Posledica je zelo praktična: smemo **vstavljati, množiti, odvajati in integrirati** znane vrste in vedno dobimo pravo Taylorjevo vrsto. Primer: iz vrste za $\mathrm{e}^u$ z $u = -x^2$ dobimo

$$\mathrm{e}^{-x^2} = 1 - x^2 + \frac{x^4}{2!} - \frac{x^6}{3!} + \dots$$

za vsak $x$, ne da bi odvajali. Iz koeficientov pa lahko obratno preberemo odvode: pri $x^6$ je koeficient $-\frac16$, zato je šesti odvod $\mathrm{e}^{-x^2}$ v $0$ enak $6! \cdot \left(-\frac16\right) = -120$.

*Preizkus:* kakšen je razvoj $\frac{1}{1 + x}$? (Geometrijska vrsta s količnikom $-x$: $1 - x + x^2 - x^3 + \dots$ za $|x| < 1$.)

**6. Logaritem.** Za $|t| < 1$ je $\frac{1}{1 + t} = \sum_{n=0}^{\infty} (-1)^n t^n$. Integriramo od $0$ do $x$ členoma (to smemo znotraj konvergenčnega intervala):

$$\ln(1 + x) = \sum_{n=1}^{\infty} \frac{(-1)^{n+1} x^n}{n} = x - \frac{x^2}{2} + \frac{x^3}{3} - \dots$$

Konvergenčni polmer je $R = 1$. V robni točki $x = -1$ dobimo $-\sum \frac1n$, ki divergira. V $x = 1$ vrsta po Leibnizu konvergira, a ali k $\ln 2$? To dokažemo neposredno. Iz vsote geometrijske vrste je

$$\frac{1}{1 + t} = \sum_{n=0}^{N} (-t)^n + \frac{(-t)^{N+1}}{1 + t}.$$

Integral zadnjega člena od $0$ do $1$ je po absolutni vrednosti največ $\int_0^1 t^{N+1}\,\mathrm{d}t = \frac{1}{N+2} \to 0$. Torej velja razvoj na intervalu $(-1, 1]$ in

$$\ln 2 = 1 - \frac12 + \frac13 - \frac14 + \dots$$

*Preizkus:* koliko je $\ln 1{,}1$ po dveh členih? ($0{,}1 - 0{,}005 = 0{,}095$; prava vrednost je $0{,}09531$.)

**7. Binomska vrsta.** Za realni $\alpha$ in naravni $n$ definiramo **posplošeni binomski koeficient**

$$\binom{\alpha}{n} = \frac{\alpha(\alpha - 1)\cdots(\alpha - n + 1)}{n!}, \qquad \binom{\alpha}{0} = 1.$$

**Izrek (binomska vrsta).** Za vsak realni $\alpha$ in $|x| < 1$ velja

$$(1 + x)^\alpha = \sum_{n=0}^{\infty} \binom{\alpha}{n} x^n = 1 + \alpha x + \frac{\alpha(\alpha - 1)}{2!}x^2 + \dots$$

Koeficienti so Taylorjevi, saj je $n$-ti odvod $(1 + x)^\alpha$ v $0$ enak $\alpha(\alpha - 1)\cdots(\alpha - n + 1)$. Če je $\alpha$ naravno število, so koeficienti od $n = \alpha + 1$ naprej enaki $0$ in dobimo znano binomsko formulo, ki velja za vse $x$. Sicer je $\left|\binom{\alpha}{n} \big/ \binom{\alpha}{n+1}\right| = \left|\frac{n+1}{\alpha - n}\right| \to 1$, torej je $R = 1$. Dokaz, da vrsta res konvergira k $(1 + x)^\alpha$, je v razdelku Bolj natančno. Najpogostejša primera:

$$\sqrt{1 + x} = 1 + \frac{x}{2} - \frac{x^2}{8} + \frac{x^3}{16} - \dots$$

$$\frac{1}{\sqrt{1 - x}} = 1 + \frac{x}{2} + \frac{3x^2}{8} + \frac{5x^3}{16} + \dots$$

*Preizkus:* kateri koeficient pri $x^2$ ima $(1 + x)^{1/2}$? ($\frac{\frac12 \cdot \left(-\frac12\right)}{2} = -\frac18$.)

**8. Ocena napake.** Ko vrsto odrežemo pri $T_n$, imamo dve orodji.

- **Lagrangeova ocena:** če je $|f^{(n+1)}| \le M$ med $a$ in $x$, je $|f(x) - T_n(x)| \le \frac{M\,|x - a|^{n+1}}{(n+1)!}$. Deluje vedno, ko znamo omejiti odvod.
- **Leibnizova ocena:** če je vrsta pri danem $x$ alternirajoča in absolutne vrednosti členov padajo proti $0$, je napaka največ absolutna vrednost **prvega izpuščenega člena**. Velja za $\sin x$, $\cos x$, $\mathrm{e}^{-x}$ pri $x > 0$ in $\ln(1 + x)$ pri $0 < x \le 1$ (pri $\sin x$, $\cos x$ in $\mathrm{e}^{-x}$ šele od člena naprej, ko začnejo absolutne vrednosti padati).

Kadar vrsta ni alternirajoča in odvodov ne znamo omejiti, ostanek omejimo z geometrijsko vrsto (Primer 3).

:::premisli
Za $\ln 2$ imamo vrsto $1 - \frac12 + \frac13 - \dots$. Približno koliko členov potrebuješ za napako pod $10^{-4}$? Kaj to pove o praktični uporabnosti te vrste?
---
Po Leibnizu je napaka največ prvi izpuščeni člen $\frac{1}{n+1}$, zato potrebujemo $n + 1 > 10\,000$, torej okoli $10\,000$ členov. Vrsta konvergira, a obupno počasi, ker je $x = 1$ na robu konvergenčnega intervala. V praksi izberemo točko daleč od roba (Primer 3).
:::

## Rešeni primeri

### Primer 1 (lažji)

Kondenzator se prazni prek upora: $U(t) = U_0\,\mathrm{e}^{-t/\tau}$ z $U_0 = 12\,\mathrm{V}$. Iz Maclaurinove vrste eksponentne funkcije izračunaj napetost ob času $t = 0{,}2\,\tau$ s prvimi tremi členi in oceni napako.

**Podatki:** $U_0 = 12\,\mathrm{V}$, $t = 0{,}2\,\tau$, upoštevamo prve tri člene vrste
**Iščemo:** približek $U$ in zgornjo mejo napake

:::formula
$\mathrm{e}^{x} = 1 + x + \dfrac{x^2}{2!} + \dfrac{x^3}{3!} + \dots$ za vsak $x$; pri alternirajoči vrsti s padajočimi členi je napaka največ prvi izpuščeni člen.
:::

**Rešitev:**

1. Vstavimo $x = -t/\tau = -0{,}2$: $\mathrm{e}^{-0{,}2} = 1 - 0{,}2 + \frac{0{,}04}{2} - \frac{0{,}008}{6} + \dots$
2. Prvi trije členi: $1 - 0{,}2 + 0{,}02 = 0{,}82$.
3. Napetost: $U \approx 12\,\mathrm{V} \cdot 0{,}82 = 9{,}84\,\mathrm{V}$.
4. Vrsta je alternirajoča in členi $1$; $0{,}2$; $0{,}02$; $0{,}00133$ padajo proti $0$, zato je napaka faktorja največ prvi izpuščeni člen $\frac{0{,}008}{6} \approx 0{,}00133$.
5. Napaka napetosti je torej največ $12\,\mathrm{V} \cdot 0{,}00133 = 0{,}016\,\mathrm{V}$, in ker je izpuščeni člen negativen, je približek prevelik.
6. Preizkus s kalkulatorjem: $12 \cdot \mathrm{e}^{-0{,}2} \approx 9{,}825\,\mathrm{V}$; razlika $0{,}015\,\mathrm{V}$ je res pod mejo.
7. Odgovor: $U \approx 9{,}84\,\mathrm{V}$, približek je za največ $0{,}016\,\mathrm{V}$ prevelik.

### Primer 2

Kinetična energija telesa z maso $m$ in hitrostjo $v$ je v teoriji relativnosti $E_\mathrm{k} = mc^2\left(\frac{1}{\sqrt{1 - \beta^2}} - 1\right)$ z $\beta = v/c$. Razvij $E_\mathrm{k}$ po potencah $\beta^2$ do drugega člena, pokaži, da je prvi člen klasična energija $\frac12 mv^2$, in izračunaj relativni popravek pri $v = 0{,}1\,c$.

**Podatki:** $E_\mathrm{k} = mc^2\big((1 - \beta^2)^{-1/2} - 1\big)$, $\beta = v/c$, $v = 0{,}1\,c$
**Iščemo:** prva dva člena razvoja, relativni popravek glede na $\frac12 mv^2$

:::formula
Binomska vrsta: $(1 + x)^\alpha = 1 + \alpha x + \dfrac{\alpha(\alpha - 1)}{2!}x^2 + \dots$ za $|x| < 1$.
:::

**Rešitev:**

1. Vstavimo $\alpha = -\frac12$ in $x = -\beta^2$; ker je $\beta < 1$, je $|x| < 1$ in razvoj velja.
2. Koeficienti: $\alpha = -\frac12$, $\frac{\alpha(\alpha - 1)}{2} = \frac{\left(-\frac12\right)\left(-\frac32\right)}{2} = \frac38$.
3. Zato je $(1 - \beta^2)^{-1/2} = 1 + \frac12\beta^2 + \frac38\beta^4 + \dots$
4. Odštejemo $1$ in pomnožimo z $mc^2$: $E_\mathrm{k} = \frac12 mc^2\beta^2 + \frac38 mc^2\beta^4 + \dots = \frac12 mv^2 + \frac38 \frac{mv^4}{c^2} + \dots$
5. Prvi člen je klasična kinetična energija. Relativni popravek je razmerje drugega in prvega člena: $\frac{3/8\,\beta^4}{1/2\,\beta^2} = \frac34\beta^2$.
6. Pri $\beta = 0{,}1$: $\frac34 \cdot 0{,}01 = 0{,}0075$.
7. Preizkus: natančno je $\frac{1}{\sqrt{0{,}99}} - 1 \approx 0{,}0050378$, približek $0{,}005 + 0{,}0000375 = 0{,}0050375$ se ujema na šest decimalk; razliko $3 \cdot 10^{-7}$ pojasni naslednji člen $\frac{5}{16}\beta^6$.
8. Odgovor: $E_\mathrm{k} = \frac12 mv^2 + \frac38\frac{mv^4}{c^2} + \dots$; pri $v = 0{,}1\,c$ je relativistični popravek $0{,}75\,\%$ klasične energije.

### Primer 3 (težji)

(a) Razvij $f(x) = \ln\dfrac{1 + x}{1 - x}$ v Maclaurinovo vrsto in določi njeno konvergenčno območje. (b) Z vrsto izračunaj $\ln 2$ z napako, manjšo od $10^{-4}$, in napako utemelji.

**Podatki:** $f(x) = \ln(1 + x) - \ln(1 - x)$, zahtevana napaka $< 10^{-4}$
**Iščemo:** vrsto, območje konvergence, potrebno število členov in približek $\ln 2$

:::formula
$\ln(1 + x) = \sum_{n=1}^{\infty} \dfrac{(-1)^{n+1}x^n}{n}$ za $-1 < x \le 1$; geometrijska vrsta $\sum_{j=0}^{\infty} q^j = \dfrac{1}{1 - q}$ za $|q| < 1$.
:::

**Rešitev:**

1. Iz razvoja z $x \to -x$: $\ln(1 - x) = -x - \frac{x^2}{2} - \frac{x^3}{3} - \dots$ za $-1 \le x < 1$.
2. Odštejemo: sodi členi se uničijo, lihi podvojijo: $f(x) = 2\left(x + \frac{x^3}{3} + \frac{x^5}{5} + \dots\right) = \sum_{k=0}^{\infty} \frac{2x^{2k+1}}{2k+1}$.
3. Oba razvoja veljata hkrati za $|x| < 1$. Pri $x = \pm1$ je vrsta $\pm 2\sum \frac{1}{2k+1}$, ki divergira (primerjava s harmonično vrsto). Območje je $(-1, 1)$.
4. (b) Iščemo $x$ z $\frac{1 + x}{1 - x} = 2$: $1 + x = 2 - 2x$, torej $x = \frac13$, kar je daleč od roba.
5. Ostanek po členih $k = 0, \dots, m - 1$ ni alternirajoč, zato ga omejimo z geometrijsko vrsto. Ker je $2k + 1 \ge 2m + 1$ za $k \ge m$:
$$|R| = \sum_{k=m}^{\infty} \frac{2x^{2k+1}}{2k+1} \le \frac{2x^{2m+1}}{2m+1}\sum_{j=0}^{\infty} x^{2j} = \frac{2x^{2m+1}}{(2m+1)(1 - x^2)}.$$
6. Pri $x = \frac13$ je $1 - x^2 = \frac89$. Za $m = 3$ je meja $\frac{2 \cdot 3^{-7}}{7 \cdot 8/9} \approx 1{,}5 \cdot 10^{-4}$, premalo; za $m = 4$ je $\frac{2 \cdot 3^{-9}}{9 \cdot 8/9} = \frac{2}{8 \cdot 19\,683} \approx 1{,}27 \cdot 10^{-5}$, dovolj.
7. Seštejemo štiri člene: $\frac23 \approx 0{,}6666667$, $\frac{2}{81} \approx 0{,}0246914$, $\frac{2}{1215} \approx 0{,}0016461$, $\frac{2}{15\,309} \approx 0{,}0001306$.
8. Vsota: $0{,}6666667 + 0{,}0246914 + 0{,}0016461 + 0{,}0001306 = 0{,}6931348$.
9. Ker so vsi izpuščeni členi pozitivni, je prava vrednost med $0{,}6931348$ in $0{,}6931348 + 0{,}0000127$. Preizkus: $\ln 2 \approx 0{,}6931472$.
10. Odgovor: $f(x) = 2\sum_{k=0}^{\infty} \frac{x^{2k+1}}{2k+1}$ na $(-1, 1)$; štirje členi pri $x = \frac13$ dajo $\ln 2 \approx 0{,}69313$ z napako pod $1{,}3 \cdot 10^{-5}$. Vrsta iz točke 6 Razlage bi za isto natančnost potrebovala okoli $10\,000$ členov.

### Primer 4 – zdaj ti

Izračunaj $\displaystyle\lim_{x \to 0} \frac{\sin x - x\cos x}{x^3}$ z vrstama za sinus in kosinus.

**Podatki:** števec $\sin x - x\cos x$, imenovalec $x^3$, $x \to 0$
**Iščemo:** limito

:::formula
$\sin x = x - \dfrac{x^3}{6} + \dots$, $\quad \cos x = 1 - \dfrac{x^2}{2} + \dots$
:::

**Rešitev:**

1. $x\cos x = x - \frac{x^3}{2} + \frac{x^5}{24} - \dots$
2. Števec: $\sin x - x\cos x = \left(x - \frac{x^3}{6}\right) - \left(x - \frac{x^3}{2}\right) + (\text{členi s } x^5 \text{ in višji})$.
3. Dokončaj sam: poenostavi števec, deli z $x^3$ in pošlji $x \to 0$.

:::premisli
Koliko je limita?
---
Števec je $\left(-\frac16 + \frac12\right)x^3 + \dots = \frac13 x^3 + \dots$, po deljenju z $x^3$ ostane $\frac13$ plus členi, ki gredo z $x$ proti $0$. Limita je $\frac13$. Z L'Hospitalovim pravilom bi potreboval trikratno odvajanje.
:::

## Pogoste napake

- **»Vrsta konvergira, torej je enaka funkciji.«** Konvergenca vrste in enakost s funkcijo sta dve različni stvari. Pri $\mathrm{e}^{-1/x^2}$ Maclaurinova vrsta konvergira povsod k $0$, funkcija pa ni $0$. Enakost dokažeš z $R_n \to 0$ ali z enoličnostjo, ko vrsto sestaviš iz znanih razvojev.
- **Razvoj uporabljen zunaj konvergenčnega območja.** $\ln 3 = \ln(1 + 2)$ ni $2 - \frac42 + \frac83 - \dots$: členi $\frac{2^n}{n}$ rastejo in vrsta divergira, čeprav $\ln 3$ obstaja. Za $\ln(1 + x)$ in binomsko vrsto velja $R = 1$; preoblikuj nalogo (npr. $\ln 3 = \ln\frac{1 + 1/2}{1 - 1/2}$).
- **Pozabljena fakulteta pri branju odvodov.** Iz koeficienta $c_n$ je odvod $f^{(n)}(a) = n!\,c_n$, ne $c_n$. Pri $\mathrm{e}^{-x^2}$ je koeficient pri $x^6$ enak $-\frac16$, šesti odvod pa $-120$.
- **Napačna substitucija.** Pri $\mathrm{e}^{-x^2}$ vstaviš $u = -x^2$ v **vsak** člen: $\frac{u^2}{2!} = \frac{x^4}{2}$, ne $\frac{-x^4}{2}$ in ne $\frac{x^2}{2}$. Predznak je $(-1)^n$, potenca $x^{2n}$.
- **Leibnizova ocena, kjer ne velja.** Napaka »prvi izpuščeni člen« velja le za alternirajočo vrsto s padajočimi členi. Pri $\mathrm{e}^{x}$ za $x > 0$ ali pri vrsti iz Primera 3 so vsi členi pozitivni in je prava napaka večja od prvega izpuščenega člena; uporabi Lagrangeovo oceno ali primerjavo z geometrijsko vrsto.

## Povzetek

- Taylorjeva vrsta $\sum \frac{f^{(n)}(a)}{n!}(x - a)^n$ je enaka $f(x)$ natanko tedaj, ko $R_n(x) \to 0$; zadostuje $|f^{(n)}| \le M$ za vse $n$ (ker $\frac{r^n}{n!} \to 0$).
- Za vse $x \in \mathbb{R}$: $\mathrm{e}^x = \sum \frac{x^n}{n!}$, $\sin x = \sum \frac{(-1)^k x^{2k+1}}{(2k+1)!}$, $\cos x = \sum \frac{(-1)^k x^{2k}}{(2k)!}$.
- $\ln(1 + x) = \sum_{n \ge 1} \frac{(-1)^{n+1}x^n}{n}$ na $(-1, 1]$; binomska vrsta $(1 + x)^\alpha = \sum \binom{\alpha}{n}x^n$ za $|x| < 1$.
- Enoličnost: vsaka potenčna vrsta, ki predstavlja $f$, je njena Taylorjeva vrsta; nove razvoje dobimo z vstavljanjem, odvajanjem, integriranjem; $f^{(n)}(a) = n!\,c_n$.
- Napaka: Lagrange $\frac{M|x - a|^{n+1}}{(n+1)!}$; pri alternirajoči vrsti s padajočimi členi prvi izpuščeni člen; sicer primerjava z geometrijsko vrsto.
- Vrsta konvergira hitro daleč od roba konvergenčnega intervala, ob robu počasi.

## Za izpit

Znati moraš povedati:

- definicijo Taylorjeve in Maclaurinove vrste ter Taylorjevo formulo z Lagrangeovim ostankom;
- izrek »vrsta je enaka $f$ natanko tedaj, ko $R_n \to 0$« in zadostni pogoj z omejenimi odvodi z dokazom (vključno z $\frac{r^n}{n!} \to 0$);
- razvoje $\mathrm{e}^x$, $\sin x$, $\cos x$, $\ln(1 + x)$, $(1 + x)^\alpha$ z območji konvergence in izpeljavo za $\ln(1 + x)$;
- izrek o enoličnosti potenčnega razvoja z dokazom in protiprimer $\mathrm{e}^{-1/x^2}$;
- obe oceni napake (Lagrangeovo in Leibnizovo) s pogoji.

### Naloga 1

Dana je $g(x) = \dfrac{\ln(1 + x)}{x}$ za $x \ne 0$ in $g(0) = 1$. (a) Razvij $g$ v Maclaurinovo vrsto in določi konvergenčni polmer. (b) Izračunaj $g^{(6)}(0)$. (c) Izračunaj $\displaystyle\int_0^{1/2} g(x)\,\mathrm{d}x$ z napako, manjšo od $10^{-4}$, in napako utemelji.

**Rešitev:**

1. (a) Za $0 < |x| < 1$ delimo vrsto za $\ln(1 + x)$ z $x$: $g(x) = 1 - \frac{x}{2} + \frac{x^2}{3} - \dots = \sum_{n=0}^{\infty} \frac{(-1)^n x^n}{n+1}$. Pri $x = 0$ je vsota $1 = g(0)$, zato razvoj velja na vsem $(-1, 1)$.
2. Polmer: $\left|\frac{c_n}{c_{n+1}}\right| = \frac{n+2}{n+1} \to 1$, torej $R = 1$.
3. (b) Po enoličnosti je $g^{(6)}(0) = 6!\,c_6 = 720 \cdot \frac17 = \frac{720}{7} \approx 102{,}86$ (predznak $(-1)^6 = 1$).
4. (c) Interval $[0, \frac12]$ leži znotraj $(-1, 1)$, zato smemo integrirati členoma: $\int_0^{1/2} g = \sum_{n=0}^{\infty} \frac{(-1)^n (1/2)^{n+1}}{(n+1)^2} = \sum_{k=1}^{\infty} \frac{(-1)^{k+1}}{k^2\,2^k}$.
5. Vrsta je alternirajoča, absolutne vrednosti $b_k = \frac{1}{k^2 2^k}$ padajo proti $0$, zato je napaka največ prvi izpuščeni člen.
6. $b_7 = \frac{1}{49 \cdot 128} \approx 1{,}59 \cdot 10^{-4}$ je še prevelik, $b_8 = \frac{1}{64 \cdot 256} \approx 6{,}1 \cdot 10^{-5} < 10^{-4}$. Seštejemo člene $k = 1, \dots, 7$.
7. Členi: $0{,}5$; $-0{,}0625$; $0{,}0138889$; $-0{,}0039063$; $0{,}00125$; $-0{,}000434$; $0{,}0001594$.
8. Vsota: $0{,}5 - 0{,}0625 + 0{,}0138889 - 0{,}0039063 + 0{,}00125 - 0{,}000434 + 0{,}0001594 = 0{,}448458$.
9. Odgovor: $g(x) = \sum_{n \ge 0} \frac{(-1)^n x^n}{n+1}$, $R = 1$; $g^{(6)}(0) = \frac{720}{7}$; integral je približno $0{,}44846$ z napako pod $6{,}1 \cdot 10^{-5}$ (prava vrednost $0{,}448414$).

Opomba k (b): napaka »$g^{(6)}(0) = -\frac{720}{7}$« nastane, če zamešaš indeks: koeficient pri $x^6$ je $\frac{(-1)^6}{7}$, ne $\frac{(-1)^7}{7}$.

### Naloga 2

Natančno navedi Taylorjevo formulo z Lagrangeovim ostankom. Dokaži, da Maclaurinova vrsta funkcije $\mathrm{e}^x$ konvergira k $\mathrm{e}^x$ za vsak realni $x$. Koliko členov potrebuješ, da izračunaš $\mathrm{e}$ z napako pod $10^{-6}$?

**Rešitev:**

1. Izrek: naj ima $f$ na intervalu, ki vsebuje $a$ in $x$, odvode do reda $n + 1$. Potem je $f(x) = T_n(x) + R_n(x)$ z $R_n(x) = \frac{f^{(n+1)}(\xi)}{(n+1)!}(x - a)^{n+1}$ za neki $\xi$ med $a$ in $x$.
2. Za $f = \exp$, $a = 0$ in izbrani $x$ je $f^{(n+1)}(\xi) = \mathrm{e}^\xi \le \mathrm{e}^{|x|}$, ker je $|\xi| \le |x|$.
3. Zato je $|R_n(x)| \le \mathrm{e}^{|x|}\,\frac{|x|^{n+1}}{(n+1)!}$.
4. Za $r = |x|$ in $n \ge N > 2r$ je $\frac{r^{n+1}}{(n+1)!} \le \frac12 \cdot \frac{r^n}{n!}$, zato je $\frac{r^{N+j}}{(N+j)!} \le 2^{-j}\frac{r^N}{N!} \to 0$ za $j \to \infty$.
5. Torej $R_n(x) \to 0$ in po izreku iz točke 2 Razlage vrsta konvergira k $\mathrm{e}^x$.
6. Pri $x = 1$ je $|R_n(1)| \le \frac{\mathrm{e}}{(n+1)!} < \frac{3}{(n+1)!}$. Zahtevamo $(n+1)! > 3\,000\,000$.
7. $9! = 362\,880$ je premalo, $10! = 3\,628\,800$ zadošča, torej $n + 1 = 10$ in $n = 9$.
8. Odgovor: seštejemo člene od $\frac{1}{0!}$ do $\frac{1}{9!}$ (deset členov); vsota $2{,}7182815$ se od $\mathrm{e} \approx 2{,}7182818$ razlikuje za $3 \cdot 10^{-7}$.

### Naloga 3

Utemelji, ali velja: (a) Če ima $f$ na $\mathbb{R}$ odvode vseh redov, je na neki okolici točke $0$ enaka svoji Maclaurinovi vrsti. (b) Če potenčna vrsta $\sum c_n x^n$ na $(-1, 1)$ konvergira k $f(x)$, je $c_n = \frac{f^{(n)}(0)}{n!}$.

**Rešitev:**

1. (a) Ne velja. Protiprimer: $f(x) = \mathrm{e}^{-1/x^2}$ za $x \ne 0$ in $f(0) = 0$.
2. Za $x \ne 0$ je z indukcijo vsak odvod oblike $f^{(n)}(x) = P_n\!\left(\frac1x\right)\mathrm{e}^{-1/x^2}$, kjer je $P_n$ polinom: odvod produkta polinoma v $\frac1x$ in $\mathrm{e}^{-1/x^2}$ je spet takšen produkt.
3. Z $u = \frac1x$ je $\lim_{x \to 0} \left(\frac1x\right)^k \mathrm{e}^{-1/x^2} = \lim_{|u| \to \infty} u^k \mathrm{e}^{-u^2} = 0$ za vsak $k$, ker eksponent prevlada nad potenco.
4. V $0$ po definiciji: $f'(0) = \lim_{h \to 0} \frac{f(h) - 0}{h} = \lim \frac1h \mathrm{e}^{-1/h^2} = 0$; enako z indukcijo $f^{(n+1)}(0) = \lim \frac{f^{(n)}(h)}{h} = 0$.
5. Vsi koeficienti Maclaurinove vrste so $0$, vrsta je enaka $0$, funkcija pa je za vsak $x \ne 0$ pozitivna. Na nobeni okolici $0$ se ne ujemata.
6. (b) Velja: to je izrek o enoličnosti. Znotraj konvergenčnega intervala smemo vrsto $n$-krat odvajati členoma; pri $x = 0$ ostane le $n!\,c_n$, torej $f^{(n)}(0) = n!\,c_n$.
7. Odgovor: (a) ne velja, odvodi vseh redov ne zadoščajo, potreben je pogoj $R_n \to 0$; (b) velja.

## Drugače: Na sliki

Nariši graf $y = \sin x$ in ob njem Taylorjeve polinome $T_1 = x$, $T_3 = x - \frac{x^3}{6}$ in $T_5$. Če za »se drži« vzamemo napako pod $0{,}05$, se premica $T_1$ sinusa drži do $|x| \approx 0{,}7$, $T_3$ do $|x| \approx 1{,}45$ (nato pade proti $-\infty$), $T_5$ do $|x| \approx 2{,}2$. Vsak naslednji polinom »oprime« sinus na daljšem kosu, ker vrsta konvergira za vsak $x$.

Pri $\ln(1 + x)$ je slika drugačna: polinomi se funkcije oprijemajo le na $(-1, 1]$. Zunaj tega intervala se z vsakim novim členom oddaljujejo vse bolj in bolj divje nihajo.

Konvergenčna območja na številski osi (`=` konvergira, `-` divergira):

```
e^x, sin x, cos x:
====================  vsi x

ln(1+x):
-------(====]-------
      -1    1

(1+x)^a, a ni naravno:
-------(====)-------
      -1    1
```

Na robu binomske vrste je odvisno od $\alpha$: pri $\alpha > 0$ konvergira v obeh robnih točkah.

## Drugače: Uporaba v stroki

**Model diode za majhne signale.** Iz $I = I_0\,\mathrm{e}^{\Delta U/U_T}$ dobimo $I \approx I_0\left(1 + \frac{\Delta U}{U_T}\right)$: dioda se pri majhnem $\Delta U$ obnaša kot upor $r_\mathrm{d} = \frac{U_T}{I_0}$, pri $I_0 = 1\,\mathrm{mA}$ okoli $26\,\Omega$. Naslednji člen $\frac12\left(\frac{\Delta U}{U_T}\right)^2$ pove, koliko dioda **popači** sinusni signal: kvadrat sinusa vsebuje dvojno frekvenco. Zato inženirji vhodno napetost ojačevalnikov omejijo na nekaj milivoltov.

**Kako kalkulator računa $\mathrm{e}^x$.** Knjižnice ne seštevajo vrste pri velikem $x$. Najprej zapišejo $x = k\ln 2 + r$ z $|r| \le \frac{\ln 2}{2} \approx 0{,}35$, nato $\mathrm{e}^x = 2^k\,\mathrm{e}^r$. Ker je $r$ majhen, za dvojno natančnost ($10^{-16}$) zadošča polinom stopnje okoli $12$. Podobno funkcija `log1p(x)` v programskih jezikih za majhne $x$ računa $\ln(1 + x)$ prek vrste, ker bi pri $x = 10^{-12}$ že seštevek $1 + x$ v računalniku izgubil večino zanesljivih števk $x$.

**Fizikalna kemija in energetika.** Pri polnjenju kondenzatorja $U = U_0\left(1 - \mathrm{e}^{-t/\tau}\right)$ za $t \ll \tau$ razvoj da $U \approx U_0\,\frac{t}{\tau}$: na začetku napetost raste linearno, kot pri polnjenju s stalnim tokom. Pri Arrheniusovi enačbi za konstanto hitrosti $k = A\,\mathrm{e}^{-E_\mathrm{a}/(RT)}$ razvoj $\frac{1}{T + \Delta T} \approx \frac1T - \frac{\Delta T}{T^2}$ pokaže, da se $k$ pri majhnem segretju poveča za faktor $\mathrm{e}^{E_\mathrm{a}\Delta T/(RT^2)}$. Binomska vrsta da relativistične popravke (Primer 2) in približek $\sqrt{1 + x} \approx 1 + \frac{x}{2}$, ki ga uporabljamo pri vsaki oceni »majhnega popravka«.

## Drugače: Bolj natančno

**Binomska vrsta res konvergira k $(1 + x)^\alpha$.** Naj bo $S(x) = \sum_{n=0}^{\infty} \binom{\alpha}{n}x^n$ za $|x| < 1$. Iz $(n + 1)\binom{\alpha}{n+1} = (\alpha - n)\binom{\alpha}{n}$ s členoma odvajanjem dobimo $(1 + x)S'(x) = \alpha S(x)$. Za $h(x) = S(x)(1 + x)^{-\alpha}$ je zato $h'(x) = (1 + x)^{-\alpha - 1}\big((1 + x)S' - \alpha S\big) = 0$, torej je $h$ konstantna, $h(0) = S(0) = 1$, in $S(x) = (1 + x)^\alpha$. Ostanka sploh ne potrebujemo.

**Analitične funkcije.** Funkcija je **analitična** v $a$, če je na neki okolici $a$ enaka svoji Taylorjevi vrsti. Polinomi, $\mathrm{e}^x$, $\sin x$, $\cos x$, $\ln x$ (za $x > 0$) in racionalne funkcije zunaj ničel imenovalca so analitične. Funkcija $\mathrm{e}^{-1/x^2}$ je gladka, ni pa analitična v $0$.

**Zakaj ima $\frac{1}{1 + x^2}$ polmer $1$.** Funkcija je na vsej realni osi lepa, pa vendar njena vrsta $1 - x^2 + x^4 - \dots$ konvergira le za $|x| < 1$. Razlog je v kompleksni ravnini: imenovalec je $0$ pri $x = \pm\mathrm{i}$, ki sta od $0$ oddaljena za $1$. V kompleksni analizi velja, da je konvergenčni polmer razdalja od središča do najbližje točke, kjer funkcija ni analitična. Isto pojasni $R = 1$ pri $\ln(1 + x)$ (točka $-1$).

**Ostanek v integralski obliki.** Z večkratno integracijo po delih iz $f(x) = f(a) + \int_a^x f'(t)\,\mathrm{d}t$ dobimo

$$R_n(x) = \frac{1}{n!}\int_a^x (x - t)^n f^{(n+1)}(t)\,\mathrm{d}t.$$

Ta oblika ne potrebuje neznane točke $\xi$ in iz nje po izreku o povprečni vrednosti dobimo Lagrangeovo obliko.

## Preveri se

? Katera vrsta je Maclaurinova vrsta funkcije $\mathrm{e}^{-x^2}$?
+ $1 - x^2 + \dfrac{x^4}{2!} - \dfrac{x^6}{3!} + \dots$
- $1 - \dfrac{x^2}{2!} + \dfrac{x^4}{4!} - \dots$
~ To je vrsta za $\cos x$: imenovalci so $(2k)!$, pri $\mathrm{e}^{-x^2}$ pa $k!$, ker vstaviš $u = -x^2$ v $\frac{u^k}{k!}$.
- $1 - x^2 + x^4 - x^6 + \dots$
~ To je geometrijska vrsta za $\frac{1}{1 + x^2}$; manjkajo fakultete iz vrste za $\mathrm{e}^u$.
> V $\mathrm{e}^u = \sum \frac{u^k}{k!}$ vstavimo $u = -x^2$: člen je $\frac{(-1)^k x^{2k}}{k!}$. Po enoličnosti je to prava Maclaurinova vrsta.

? Oceni napako približka $\sqrt{1{,}02} \approx 1{,}01$.
+ okoli $5 \cdot 10^{-5}$
- okoli $1 \cdot 10^{-2}$
~ To je velikost člena $\frac{x}{2}$, ki smo ga že upoštevali; napaka je prvi izpuščeni člen $\frac{x^2}{8}$.
- okoli $2 \cdot 10^{-4}$
~ To je $x^2/2$, kot pri vrsti za $\mathrm{e}^x$; binomski koeficient pri $x^2$ za $\alpha = \frac12$ je $-\frac18$.
> $\sqrt{1 + x} = 1 + \frac{x}{2} - \frac{x^2}{8} + \dots$; pri $x = 0{,}02$ je izpuščeni člen $\frac{0{,}0004}{8} = 5 \cdot 10^{-5}$. Res je $\sqrt{1{,}02} \approx 1{,}009950$.

? Zakaj vrsta $2 - \frac{2^2}{2} + \frac{2^3}{3} - \dots$ ne da $\ln 3$, čeprav je to vrsta za $\ln(1 + x)$ pri $x = 2$?
- Ker je vrsta alternirajoča in zato konvergira k drugi vrednosti.
~ Alternirajoča vrsta konvergira le, če členi padajo proti $0$; tu členi $\frac{2^n}{n}$ rastejo.
+ Ker je $x = 2$ zunaj konvergenčnega intervala $(-1, 1]$ in vrsta divergira.
- Ker $\ln 3$ ni mogoče zapisati z nobeno vrsto.
~ Lahko: $\ln 3 = \ln\frac{1 + 1/2}{1 - 1/2} = 2\left(\frac12 + \frac{1}{24} + \dots\right)$, kot v Primeru 3.
> Razvoj velja le za $-1 < x \le 1$. Pri $x = 2$ členi $\frac{2^n}{n}$ ne gredo proti $0$, zato vrsta po potrebnem pogoju divergira. Obstoj funkcijske vrednosti ne zagotavlja konvergence vrste.

? Taylorjeva vrsta neke funkcije okoli $0$ je $1 + 2x + 2x^2 + \frac43 x^3 + \dots = \sum \frac{(2x)^n}{n!}$. Katera funkcija je to?
- $(1 + x)^2$
~ $(1 + x)^2 = 1 + 2x + x^2$ je polinom, pri $x^2$ ima koeficient $1$, ne $2$.
+ $\mathrm{e}^{2x}$
- $\dfrac{1}{1 - 2x}$
~ Ta funkcija ima vrsto $\sum (2x)^n$ brez fakultet: $1 + 2x + 4x^2 + \dots$
> $\sum \frac{u^n}{n!} = \mathrm{e}^u$ z $u = 2x$. Po enoličnosti je to edina funkcija s to vrsto (na območju konvergence, ki je vsa realna os).

? Koliko je $f^{(6)}(0)$ za $f(x) = \sin(x^2)$?
- $-\dfrac16$
~ To je koeficient pri $x^6$; odvod je $6!$-krat večji: $f^{(6)}(0) = 6!\,c_6$.
- $0$
~ $\sin(x^2)$ je soda funkcija, zato so ničelni lihi odvodi; šesti odvod je sod.
+ $-120$
> $\sin(x^2) = x^2 - \frac{x^6}{6} + \dots$, zato je $c_6 = -\frac16$ in $f^{(6)}(0) = 720 \cdot \left(-\frac16\right) = -120$.

:::simboli
f | funkcija, ki jo razvijamo | | |
T | Taylorjeva vrsta funkcije | | |
T_n | Taylorjev polinom stopnje $n$ | | | delna vsota Taylorjeve vrste
R_n | ostanek Taylorjeve formule | R_n = f - T_n | | vrsta je enaka $f$, ko $R_n \to 0$
a | središče razvoja | | | pri $a = 0$ Maclaurinova vrsta
x | spremenljivka | | |
n, k, j | indeksi seštevanja | | |
N | indeks, od katerega se členi razpolavljajo | | |
\xi | vmesna točka med $a$ in $x$ | | |
t | integracijska spremenljivka (v Primeru 1 čas) | | |
M | meja za absolutne vrednosti odvodov | | |
r | razdalja $|x - a|$ | | |
c_n | koeficient potenčne vrste | c_n = \frac{f^{(n)}(a)}{n!} | |
\alpha | eksponent binomske vrste | | | realno število
q | količnik geometrijske vrste | | |
R | konvergenčni polmer; tudi ostanek v Primeru 3 | | |
S | vsota binomske vrste | | |
h | pomožna funkcija $S(x)(1 + x)^{-\alpha}$ | | |
g | funkcija $\ln(1 + x)/x$ | | |
U | napetost na kondenzatorju | U = U_0\,\mathrm{e}^{-t/\tau} | V
U_0 | začetna napetost | | V
\tau | časovna konstanta | | s
U_T | termična napetost | | V | pri sobni temperaturi $25{,}85\,\mathrm{mV}$
I | tok skozi diodo | I = I_\mathrm{S}\,\mathrm{e}^{U/U_T} | A
I_0 | tok v delovni točki | | A
I_\mathrm{S} | nasičeni zaporni tok | | A
\Delta U | sprememba napetosti | | V
E_\mathrm{k} | kinetična energija | | J
m | masa telesa (v Primeru 3 število upoštevanih členov) | | kg | v Primeru 3 brez enote
v | hitrost | | m/s
c | hitrost svetlobe | | m/s
\beta | razmerje hitrosti | \beta = \frac{v}{c} | –
:::
