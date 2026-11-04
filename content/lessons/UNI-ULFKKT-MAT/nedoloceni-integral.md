---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pri odvajanju iz funkcije dobimo njeno hitrost spreminjanja. V naravoslovju pa zelo pogosto poznamo ravno hitrost, iščemo pa količino samo: iz hitrosti reakcije iščemo koncentracijo, iz pospeška hitrost in lego, iz hitrosti rasti populacije njeno velikost. Obratna operacija odvajanju je **integriranje**.

**Nedoločeni integral** je družina vseh funkcij, katerih odvod je dana funkcija. Potrebujemo ga za računanje določenih integralov (ploščin, prostornin, dela), predvsem pa za reševanje **diferencialnih enačb**, s katerimi opisujemo kinetiko, rast, ohlajanje, nihanje in električne kroge.

Odvajanje je »mehanično«: za vsako elementarno funkcijo imamo pravila, ki vedno pripeljejo do rezultata. Integriranje je zahtevnejše. Za vsoto imamo pravilo, za produkt, kvocient in kompozitum pa ne. Zato se naučimo nekaj **metod**, s katerimi zahtevnejše integrale prevedemo na tabelne:

- **uvedbo nove spremenljivke** (substitucijo),
- **integracijo po delih** (per partes),
- **razcep racionalnih funkcij na parcialne ulomke**.

## Razlaga

**1. Primitivna funkcija.** Funkcija $F$ je **primitivna funkcija** funkcije $f$ na intervalu $I$, če je $F'(x) = f(x)$ za vse $x \in I$. Primer: $F(x) = x^3$ je primitivna funkcija $f(x) = 3x^2$. Tudi $x^3 + 5$ in $x^3 - \pi$ sta, ker se konstanta pri odvajanju izgubi.

**Izrek.** Naj bosta $F$ in $G$ primitivni funkciji iste funkcije $f$ na **intervalu** $I$. Potem obstaja konstanta $C$, da je $G(x) = F(x) + C$ za vse $x \in I$.

*Dokaz.* Za $H = G - F$ je $H' = f - f = 0$ na $I$. Za poljubna $x_1 < x_2$ iz $I$ po Lagrangeovem izreku obstaja $\xi \in (x_1, x_2)$ z $H(x_2) - H(x_1) = H'(\xi)(x_2 - x_1) = 0$, torej je $H$ konstantna. $\square$

Pogoj »interval« je bistven: na $\mathbb R \setminus \{0\}$ je konstanta lahko na vsakem delu drugačna. Vsaka **zvezna** funkcija na intervalu ima primitivno funkcijo (osnovni izrek analize), ni pa nujno elementarna. **Nedoločeni integral** je množica vseh primitivnih funkcij:

$$\int f(x)\, dx = F(x) + C, \qquad C \in \mathbb{R}.$$

Konstanta $C$ je **integracijska konstanta**. Vsak rezultat lahko preverimo z odvajanjem.

**2. Tabela osnovnih integralov.**

| $f(x)$ | $\int f(x)\, dx$ |
|---|---|
| $x^n$, $n \neq -1$ | $\frac{x^{n+1}}{n + 1} + C$ |
| $\frac{1}{x}$ | $\ln|x| + C$ |
| $e^x$ | $e^x + C$ |
| $a^x$ | $\frac{a^x}{\ln a} + C$ |
| $\sin x$ | $-\cos x + C$ |
| $\cos x$ | $\sin x + C$ |
| $\frac{1}{\cos^2 x}$ | $\tan x + C$ |
| $\frac{1}{1 + x^2}$ | $\arctan x + C$ |
| $\frac{1}{\sqrt{1 - x^2}}$ | $\arcsin x + C$ |

**Linearnost:** $\int (\alpha f + \beta g)\, dx = \alpha \int f\, dx + \beta \int g\, dx$, ker je $(\alpha F + \beta G)' = \alpha f + \beta g$. Polinome zato integriramo člen za členom.

**Linearni argument.** Če je $\int f(x)\, dx = F(x) + C$, je $\int f(ax + b)\, dx = \frac{1}{a} F(ax + b) + C$ za $a \neq 0$. Na primer $\int e^{3x}\, dx = \frac{1}{3} e^{3x} + C$ in $\int \cos(2x + 1)\, dx = \frac{1}{2}\sin(2x + 1) + C$.

**3. Uvedba nove spremenljivke (substitucija).**

**Izrek.** Naj bo $g$ zvezno odvedljiva na intervalu $I$, $f$ zvezna na intervalu, ki vsebuje $g(I)$, in $F$ primitivna funkcija $f$. Potem je

$$\int f(g(x))\, g'(x)\, dx = F(g(x)) + C, \quad \text{kratko} \quad \int f(g(x))\, g'(x)\, dx = \int f(t)\, dt, \qquad t = g(x),\ dt = g'(x)\, dx.$$

*Dokaz:* po verižnem pravilu je $\big(F(g(x))\big)' = F'(g(x))\, g'(x) = f(g(x))\, g'(x)$.

Postopek: (1) v integrandu poiščemo notranjo funkcijo $g(x)$, katere odvod (do konstante natančno) je tudi v integrandu, (2) vpeljemo $t = g(x)$ in izrazimo $dx$ ali $g'(x)\, dx$ z $dt$, (3) integriramo v spremenljivki $t$, (4) vrnemo $t = g(x)$.

Pomemben poseben primer je **logaritemski integral**:

$$\int \frac{g'(x)}{g(x)}\, dx = \ln|g(x)| + C,$$

ki velja na intervalu, kjer je $g(x) \neq 0$: s $t = g(x)$ dobimo $\int \frac{dt}{t} = \ln|t| + C$.

Na primer $\int \tan x\, dx = \int \frac{\sin x}{\cos x}\, dx = -\ln|\cos x| + C$, ker je števec $\sin x = -(\cos x)'$.

:::premisli
Ali s substitucijo $t = x^2$ izračunaš $\int e^{x^2}\, dx$? Kaj pa $\int x\, e^{x^2}\, dx$?
---
Prvega ne: $dt = 2x\, dx$, faktorja $x$ pa v integrandu ni. Pri drugem je $x\, dx = \frac12\, dt$, zato $\int x\, e^{x^2}\, dx = \frac12 e^{x^2} + C$.
:::

**4. Integracija po delih.**

**Izrek.** Naj bosta $u$ in $v$ zvezno odvedljivi na intervalu $I$. Potem je

$$\int u\, v'\, dx = uv - \int u'\, v\, dx, \qquad \text{kratko} \qquad \int u\, dv = uv - \int v\, du.$$

*Izpeljava:* $(uv)' = u'v + uv'$, torej je $uv$ primitivna funkcija $u'v + uv'$, $\int (u'v + uv')\, dx = uv + C$. Zaradi linearnosti je $\int uv'\, dx = uv - \int u'v\, dx$.

Integrand razdelimo na dva dela: $u$, ki ga odvajamo, in $dv$, ki ga integriramo. Izbira je dobra, če je novi integral $\int v\, du$ preprostejši od prvotnega. Praktično pravilo: za $u$ izberemo funkcijo, ki se z odvajanjem poenostavi. Prednost imajo logaritmi in ciklometrične (arkus) funkcije, kot je $\arctan x$, nato polinomi; za $dv$ pa raje vzamemo eksponentno ali krožno funkcijo.

Tipični primeri: $\int x e^x\, dx$ ($u = x$), $\int x \sin x\, dx$ ($u = x$), $\int \ln x\, dx$ ($u = \ln x$, $dv = dx$), $\int \arctan x\, dx$ ($u = \arctan x$). Včasih postopek ponovimo, pri $\int e^x \sin x\, dx$ pa po dveh korakih dobimo enačbo za iskani integral.

Poglejmo ta »krožni« primer. Označimo $I = \int e^x \sin x\, dx$. Prvič vzamemo $u = \sin x$, $dv = e^x\, dx$ in dobimo $I = e^x \sin x - \int e^x \cos x\, dx$. Drugič vzamemo $u = \cos x$, $dv = e^x\, dx$: $\int e^x \cos x\, dx = e^x \cos x + \int e^x \sin x\, dx = e^x\cos x + I$. Skupaj je $I = e^x \sin x - e^x \cos x - I$, od koder $I = \frac{e^x}{2}(\sin x - \cos x) + C$. Pomembno je, da v obeh korakih za $dv$ izberemo isto vrsto funkcije (tu eksponentno), sicer se vrnemo na začetek.

Pri $\int \ln x\, dx$ je drugi faktor skrit: pišemo $\ln x \cdot 1$, vzamemo $u = \ln x$, $dv = dx$ in dobimo $x\ln x - \int x \cdot \frac{1}{x}\, dx = x\ln x - x + C$.

**5. Racionalne funkcije.** Integral $\int \frac{p(x)}{q(x)}\, dx$, kjer sta $p$ in $q$ polinoma, rešujemo v treh korakih.

1. **Deljenje.** Če je stopnja $p$ večja ali enaka stopnji $q$, polinoma delimo: $\frac{p}{q} = s(x) + \frac{r(x)}{q(x)}$, kjer ima ostanek $r$ nižjo stopnjo od $q$. Polinom $s$ integriramo člen za členom.
2. **Razcep imenovalca** na linearne faktorje $(x - a)$ in nerazcepne kvadratne faktorje $x^2 + px + q$ (z negativno diskriminanto).
3. **Parcialni ulomki.** Vsakemu faktorju $(x - a)^k$ pripadajo členi $\frac{A_1}{x - a} + \dots + \frac{A_k}{(x - a)^k}$, nerazcepnemu kvadratnemu faktorju pa člen $\frac{Bx + C}{x^2 + px + q}$ (faktorju $(x^2 + px + q)^m$ pa členi $\frac{B_1x + C_1}{x^2 + px + q} + \dots + \frac{B_mx + C_m}{(x^2 + px + q)^m}$). Neznane koeficiente določimo tako, da pomnožimo z imenovalcem in primerjamo koeficiente ali vstavimo primerne vrednosti $x$.

**Izrek (razcep na parcialne ulomke).** Naj bosta $r$ in $q$ realna polinoma in $\deg r < \deg q$. Potem lahko $\frac{r}{q}$ zapišemo kot vsoto parcialnih ulomkov zgornje oblike, ki pripadajo faktorjem razcepa $q$, in to na en sam način. Ker se vsak realni polinom razcepi na linearne in nerazcepne kvadratne faktorje, ima vsaka racionalna funkcija elementarno primitivno funkcijo.

Posamezni členi se integrirajo takole:

$$\int \frac{dx}{x - a} = \ln|x - a| + C, \qquad \int \frac{dx}{(x - a)^k} = \frac{-1}{(k - 1)(x - a)^{k-1}} + C \ (k \ge 2),$$

$$\int \frac{dx}{x^2 + a^2} = \frac{1}{a} \arctan\frac{x}{a} + C \quad (a > 0).$$

*Izpeljava zadnjega:* z $x = at$, $dx = a\, dt$ je $\int \frac{a\, dt}{a^2(t^2 + 1)} = \frac1a \arctan t + C$.

:::premisli
Zapiši nastavek za razcep $\frac{x + 5}{(x - 1)^2(x^2 + 4)}$. Koliko neznanih koeficientov ima?
---
$\frac{A}{x - 1} + \frac{B}{(x - 1)^2} + \frac{Cx + D}{x^2 + 4}$, torej štiri, kolikor je stopnja imenovalca.
:::

Pri splošnem kvadratnem imenovalcu dopolnimo do popolnega kvadrata, števec pa razdelimo na del, ki je odvod imenovalca (da logaritem), in konstanto (da arkus tangens).

Primer s kvadratnim imenovalcem: $\int \frac{dx}{x^2 + 2x + 5}$. Diskriminanta je $4 - 20 < 0$, zato imenovalca ne razstavimo. Dopolnimo do kvadrata: $x^2 + 2x + 5 = (x + 1)^2 + 4$. S substitucijo $t = x + 1$ dobimo $\int \frac{dt}{t^2 + 2^2} = \frac{1}{2}\arctan\frac{x + 1}{2} + C$.

**6. Kako izberemo metodo.** Pri novem integralu si zastavimo nekaj vprašanj po vrsti.

1. Ali je integral tabelni ali vsota tabelnih (morda po preoblikovanju, npr. razširitvi oklepaja ali deljenju)? Tedaj integriramo člen za členom.
2. Ali je v integrandu kompozitum, katerega notranja funkcija ima odvod (do konstante) tudi v integrandu? Tedaj uporabimo substitucijo.
3. Ali je integrand produkt dveh različnih vrst funkcij, na primer polinoma in eksponentne, krožne ali logaritemske funkcije? Tedaj poskusimo integracijo po delih.
4. Ali je integrand kvocient polinomov? Tedaj delimo in razcepimo na parcialne ulomke.

**Krožne funkcije s potencami.** Pri $\int \sin^2 x\, dx$ uporabimo formulo za polovični kot $\sin^2 x = \frac{1 - \cos 2x}{2}$ in dobimo $\frac{x}{2} - \frac{\sin 2x}{4} + C$. Pri $\int \sin^3 x\, dx$ pa en faktor $\sin x$ prihranimo za diferencial: $\sin^3 x = (1 - \cos^2 x)\sin x$ in vpeljemo $t = \cos x$.

Integriranje je spretnost, ki se je naučimo z vajo. Isti integral lahko pogosto rešimo na več načinov; rezultati se tedaj lahko razlikujejo za konstanto, a so vsi pravilni.

## Rešeni primeri

### Primer 1 (lažji)

Izračunaj $\displaystyle \int x (x^2 + 1)^5\, dx$.

**Podatki:** integrand $f(x) = x(x^2 + 1)^5$
**Iščemo:** nedoločeni integral $\int f(x)\, dx$

:::formula
Substitucija: $t = g(x)$, $dt = g'(x)\, dx$, $\int f(g(x))\, g'(x)\, dx = \int f(t)\, dt$. Potenca: $\int t^n\, dt = \frac{t^{n+1}}{n+1} + C$.
:::

**Rešitev:**

1. Notranja funkcija je $t = x^2 + 1$; njen odvod $2x$ je do faktorja $2$ v integrandu.
2. $dt = 2x\, dx$, zato je $x\, dx = \frac{1}{2}\, dt$.
3. $\int x(x^2 + 1)^5\, dx = \int t^5 \cdot \frac{1}{2}\, dt = \frac{1}{2} \cdot \frac{t^6}{6} + C = \frac{t^6}{12} + C$.
4. Vrnemo spremenljivko: $\frac{(x^2 + 1)^6}{12} + C$.
5. Preizkus: $\left(\frac{(x^2 + 1)^6}{12}\right)' = \frac{6(x^2 + 1)^5 \cdot 2x}{12} = x(x^2 + 1)^5$.
6. Odgovor: $\int x(x^2 + 1)^5\, dx = \frac{(x^2 + 1)^6}{12} + C$.

### Primer 2

Izračunaj $\displaystyle \int x \ln x\, dx$ za $x > 0$.

**Podatki:** integrand $f(x) = x \ln x$, $x > 0$
**Iščemo:** nedoločeni integral $\int x \ln x\, dx$

:::formula
Integracija po delih: $\int u\, dv = uv - \int v\, du$. Za $u$ izberemo logaritem, ker se z odvajanjem poenostavi.
:::

**Rešitev:**

1. Izberemo $u = \ln x$ in $dv = x\, dx$.
2. Tedaj $du = \frac{1}{x}\, dx$ in $v = \frac{x^2}{2}$.
3. $\int x \ln x\, dx = \frac{x^2}{2}\ln x - \int \frac{x^2}{2} \cdot \frac{1}{x}\, dx = \frac{x^2}{2}\ln x - \frac{1}{2}\int x\, dx$.
4. $\frac{1}{2}\int x\, dx = \frac{x^2}{4}$, torej je rezultat $\frac{x^2}{2}\ln x - \frac{x^2}{4} + C$.
5. Preizkus: $\left(\frac{x^2}{2}\ln x - \frac{x^2}{4}\right)' = x \ln x + \frac{x^2}{2} \cdot \frac{1}{x} - \frac{x}{2} = x \ln x$.
6. Odgovor: $\int x \ln x\, dx = \frac{x^2}{2}\ln x - \frac{x^2}{4} + C = \frac{x^2}{4}(2\ln x - 1) + C$.

### Primer 3 (težji)

Izračunaj $\displaystyle \int \frac{2x^2 + 4x + 2}{(x - 1)(x^2 + 2x + 5)}\, dx$.

**Podatki:** racionalna funkcija s števcem $r(x) = 2x^2 + 4x + 2$ in imenovalcem $q(x) = (x - 1)(x^2 + 2x + 5)$
**Iščemo:** nedoločeni integral

:::formula
$\frac{r(x)}{(x - a)(x^2 + px + q)} = \frac{A}{x - a} + \frac{Bx + C}{x^2 + px + q}$; $\int \frac{g'}{g}\, dx = \ln|g| + C$, $\int \frac{dt}{t^2 + a^2} = \frac1a \arctan\frac ta + C$.
:::

**Rešitev:**

1. Stopnja števca ($2$) je manjša od stopnje imenovalca ($3$), deljenje ni potrebno. Faktor $x^2 + 2x + 5$ ima diskriminanto $4 - 20 = -16 < 0$, je nerazcepen.
2. Nastavek: $2x^2 + 4x + 2 = A(x^2 + 2x + 5) + (Bx + C)(x - 1)$.
3. Za $x = 1$: $8 = 8A$, $A = 1$.
4. Primerjamo koeficiente: pri $x^2$: $A + B = 2$, torej $B = 1$; prosti člen: $5A - C = 2$, torej $C = 3$. Preizkus pri $x$: $2A - B + C = 2 - 1 + 3 = 4$.
5. Prvi člen: $\int \frac{dx}{x - 1} = \ln|x - 1|$.
6. Drugi člen razdelimo na odvod imenovalca in konstanto: $x + 3 = \frac12(2x + 2) + 2$, zato $\int \frac{x + 3}{x^2 + 2x + 5}\, dx = \frac12\ln(x^2 + 2x + 5) + 2\int \frac{dx}{(x + 1)^2 + 4}$.
7. S $t = x + 1$: $2\int \frac{dt}{t^2 + 2^2} = 2 \cdot \frac12 \arctan\frac t2 = \arctan\frac{x + 1}{2}$.
8. Odgovor: $\int \frac{2x^2 + 4x + 2}{(x - 1)(x^2 + 2x + 5)}\, dx = \ln|x - 1| + \frac12\ln(x^2 + 2x + 5) + \arctan\frac{x + 1}{2} + C$ (absolutna vrednost pri drugem logaritmu ni potrebna, ker je $x^2 + 2x + 5 > 0$).

## Pogoste napake

- **Pozabljena konstanta $C$.** Nedoločeni integral je družina funkcij. Pri reševanju diferencialnih enačb $C$ določimo iz začetnega pogoja, zato je ne smemo izpustiti.
- **$\int \frac{1}{x}\, dx = \frac{x^0}{0}$.** Pravilo za potence ne velja za $n = -1$. Pravilno: $\ln|x| + C$, z absolutno vrednostjo, ker je $\frac{1}{x}$ definirana tudi za $x < 0$.
- **Integral produkta kot produkt integralov.** $\int x e^x\, dx \neq \frac{x^2}{2} e^x$. Za produkte uporabi integracijo po delih ali substitucijo.
- **Substitucija brez $dx$.** Študent zamenja $x^2 + 1$ s $t$, a pozabi pretvoriti $dx$ v $dt$. Vsaka substitucija mora spremeniti tudi diferencial.
- **Neustrezen $u$ pri integraciji po delih.** Pri $\int x e^x\, dx$ izbira $u = e^x$, $dv = x\, dx$ vodi do $\int \frac{x^2}{2} e^x\, dx$, ki je težji od prvotnega. Izberi $u = x$.
- **Parcialni ulomki brez deljenja.** Če stopnja števca ni manjša od stopnje imenovalca, najprej deli polinoma.
- **$\int \frac{1}{x^2 + 1}\, dx = \ln(x^2 + 1)$.** Logaritem dobimo le, če je števec odvod imenovalca, tu $2x$. Pravilno: $\arctan x + C$.

## Povzetek

- $F$ je primitivna funkcija $f$, če je $F' = f$; $\int f(x)\, dx = F(x) + C$. Rezultat vedno preveri z odvajanjem.
- Tabelni integrali: $x^n$, $\frac{1}{x}$, $e^x$, $\sin x$, $\cos x$, $\frac{1}{1 + x^2}$, $\frac{1}{\sqrt{1 - x^2}}$.
- Substitucija: $t = g(x)$, $dt = g'(x)\, dx$; posebej $\int \frac{g'}{g}\, dx = \ln|g| + C$.
- Po delih: $\int u\, dv = uv - \int v\, du$; $u$ naj se z odvajanjem poenostavi.
- Racionalne funkcije: deljenje, razcep imenovalca, parcialni ulomki; členi dajo $\ln|x - a|$, potence $(x - a)^{-k}$ in $\arctan$.

## Za izpit

Znati moraš povedati:

- definicijo primitivne funkcije in nedoločenega integrala ter izrek, da se primitivni funkciji na intervalu razlikujeta za konstanto, z dokazom (Lagrangeov izrek) in protiprimerom zunaj intervala,
- izrek o substituciji s pogoji in dokaz z verižnim pravilom,
- formulo za integracijo po delih s pogoji in njeno izpeljavo iz odvoda produkta,
- izrek o razcepu na parcialne ulomke in izpeljavo integralov $\int \frac{dx}{(x - a)^k}$ in $\int \frac{dx}{x^2 + a^2}$,
- da ima vsaka zvezna funkcija na intervalu primitivno funkcijo, ki pa ni nujno elementarna ($\int e^{-x^2}\, dx$).

### Naloga 1

Poišči tisto primitivno funkcijo $F$ funkcije $f(x) = \dfrac{2x^3 + 2x^2 + x + 1}{x^2(x^2 + 1)}$ na intervalu $(0, \infty)$, za katero je $F(1) = 0$.

**Rešitev:**

1. Stopnja števca ($3$) je manjša od stopnje imenovalca ($4$). Faktor $x$ je dvojen, $x^2 + 1$ je nerazcepen.
2. Nastavek: $\frac{2x^3 + 2x^2 + x + 1}{x^2(x^2 + 1)} = \frac Ax + \frac{B}{x^2} + \frac{Cx + D}{x^2 + 1}$, torej $2x^3 + 2x^2 + x + 1 = Ax(x^2 + 1) + B(x^2 + 1) + (Cx + D)x^2$.
3. Primerjamo koeficiente: $x^3$: $A + C = 2$; $x^2$: $B + D = 2$; $x$: $A = 1$; prosti člen: $B = 1$. Torej $A = B = C = D = 1$.
4. Integriramo člen za členom: $\int \frac{dx}{x} = \ln x$ (na $(0, \infty)$), $\int \frac{dx}{x^2} = -\frac1x$, $\int \frac{x\, dx}{x^2 + 1} = \frac12\ln(x^2 + 1)$, $\int \frac{dx}{x^2 + 1} = \arctan x$.
5. $F(x) = \ln x - \frac1x + \frac12\ln(x^2 + 1) + \arctan x + C$.
6. Pogoj: $F(1) = 0 - 1 + \frac12\ln 2 + \frac\pi4 + C = 0$, torej $C = 1 - \frac12\ln 2 - \frac\pi4 \approx -0{,}132$.
7. Odgovor: $F(x) = \ln x - \frac1x + \frac12\ln(x^2 + 1) + \arctan x + 1 - \frac12\ln 2 - \frac\pi4$. Ker je $(0, \infty)$ interval, je ta $F$ po izreku o konstanti ena sama.

### Naloga 2

Natančno navedi in dokaži izrek o razliki dveh primitivnih funkcij iste funkcije. Nato utemelji, ali sta $F(x) = \arctan x$ in $G(x) = -\arctan\frac1x$ primitivni funkciji iste funkcije na $\mathbb R \setminus \{0\}$ in ali je $G - F$ tam konstantna.

**Rešitev:**

1. Izrek: če sta $F$, $G$ primitivni funkciji $f$ na intervalu $I$, obstaja $C$, da je $G = F + C$ na $I$.
2. Dokaz: $H = G - F$ ima $H' = 0$; po Lagrangeovem izreku je $H(x_2) - H(x_1) = H'(\xi)(x_2 - x_1) = 0$ za vse $x_1 < x_2$ iz $I$.
3. $F'(x) = \frac{1}{1 + x^2}$. Po verižnem pravilu $G'(x) = -\frac{1}{1 + 1/x^2} \cdot \left(-\frac{1}{x^2}\right) = \frac{1}{x^2 + 1}$. Obe sta primitivni funkciji $\frac{1}{1 + x^2}$ na $\mathbb R \setminus \{0\}$.
4. Pri $x = 1$: $G - F = -\frac\pi4 - \frac\pi4 = -\frac\pi2$. Pri $x = -1$: $G - F = \frac\pi4 + \frac\pi4 = \frac\pi2$.
5. Razlika torej ni konstantna. To ni v nasprotju z izrekom, ker $\mathbb R \setminus \{0\}$ ni interval; na $(0, \infty)$ je $G - F = -\frac\pi2$, na $(-\infty, 0)$ pa $\frac\pi2$.
6. Odgovor: da, obe sta primitivni funkciji iste funkcije, a $G - F$ je konstantna le na vsakem od intervalov $(-\infty, 0)$ in $(0, \infty)$ posebej.

### Naloga 3

Izpelji formulo za integracijo po delih (s pogoji) in z njo rekurzivno formulo za $I_n = \int x^n e^x\, dx$, $n \in \mathbb N$. Izračunaj $I_3$.

**Rešitev:**

1. Za zvezno odvedljivi $u$, $v$ na intervalu je $(uv)' = u'v + uv'$, zato $\int uv'\, dx = uv - \int u'v\, dx$.
2. Za $I_n$ vzamemo $u = x^n$, $v' = e^x$: $u' = nx^{n-1}$, $v = e^x$.
3. Rekurzija: $I_n = x^ne^x - n I_{n-1}$, z začetkom $I_0 = e^x + C$.
4. $I_1 = xe^x - e^x = (x - 1)e^x$.
5. $I_2 = x^2e^x - 2(x - 1)e^x = (x^2 - 2x + 2)e^x$.
6. $I_3 = x^3e^x - 3(x^2 - 2x + 2)e^x = (x^3 - 3x^2 + 6x - 6)e^x + C$.
7. Preizkus: $\big((x^3 - 3x^2 + 6x - 6)e^x\big)' = (3x^2 - 6x + 6 + x^3 - 3x^2 + 6x - 6)e^x = x^3e^x$.

## Drugače: Na sliki

Nariši grafe funkcij $F(x) = x^2 + C$ za $C = -2, -1, 0, 1, 2$. Dobiš pet enakih parabol, premaknjenih navzgor ali navzdol. Pri vsakem $x$ imajo vse **enak naklon tangente** $2x$. Nedoločeni integral $\int 2x\, dx$ je cela ta družina vzporednih krivulj.

Če je dan še **začetni pogoj**, na primer da krivulja gre skozi točko $(1, 3)$, izmed vseh parabol izberemo eno: $1 + C = 3$, $C = 2$, torej $F(x) = x^2 + 2$.

Na grafu $f$ pa pomeni vrednost $F(b) - F(a)$ (za $f \ge 0$) ploščino pod grafom od $a$ do $b$. Konstanta $C$ se pri tej razliki odšteje, zato je za ploščino vseeno, katero primitivno funkcijo izberemo.

## Drugače: Uporaba v stroki

**Kinetika prvega reda.** Hitrost razpada snovi je sorazmerna s koncentracijo: $\frac{dc}{dt} = -kc$. Ločimo spremenljivki in integriramo: $\int \frac{dc}{c} = -\int k\, dt$, torej $\ln c = -kt + C$. Iz začetnega pogoja $c(0) = c_0$ dobimo $c(t) = c_0 e^{-kt}$ in razpolovni čas $t_{1/2} = \frac{\ln 2}{k}$. Uporabili smo logaritemski integral.

**Kinetika drugega reda z dvema reaktantoma.** Pri reakciji $\mathrm{A} + \mathrm{B} \to$ produkti z začetnima koncentracijama $a \neq b$ in pretvorbo $x$ velja $\frac{dx}{dt} = k(a - x)(b - x)$. S parcialnimi ulomki $\frac{1}{(a - x)(b - x)} = \frac{1}{b - a}\left(\frac{1}{a - x} - \frac{1}{b - x}\right)$ in pogojem $x(0) = 0$ dobimo integrirani zakon $kt = \frac{1}{b - a}\ln\frac{a(b - x)}{b(a - x)}$, iz katerega v laboratoriju z linearno regresijo določimo $k$.

**Clausius-Clapeyronova enačba.** Za parni tlak velja $\frac{dp}{dT} = \frac{\Delta H_{\mathrm{izp}}\, p}{RT^2}$. Ločimo spremenljivki in privzamemo, da $\Delta H_{\mathrm{izp}}$ ni odvisna od $T$: $\int \frac{dp}{p} = \frac{\Delta H_{\mathrm{izp}}}{R}\int \frac{dT}{T^2}$, torej $\ln p = -\frac{\Delta H_{\mathrm{izp}}}{RT} + C$. Graf $\ln p$ proti $\frac1T$ je premica z naklonom $-\frac{\Delta H_{\mathrm{izp}}}{R}$; tako iz meritev parnega tlaka določimo izparilno entalpijo.

**Rast v bioreaktorju.** Rast mikroorganizmov z omejenim substratom opišemo z logistično enačbo $\frac{dN}{dt} = rN\left(1 - \frac{N}{K}\right)$; integral $\int \frac{K\, dN}{N(K - N)}$ razcepimo na $\frac{1}{N} + \frac{1}{K - N}$.

## Drugače: Korak za korakom s številkami

Izračunajmo $\displaystyle \int \frac{x^3 + 2x}{x^2 - 1}\, dx$.

1. **Stopnji.** Števec ima stopnjo $3$, imenovalec $2$, zato najprej delimo.
2. **Deljenje.** $x^3 + 2x = x(x^2 - 1) + 3x$, torej $\frac{x^3 + 2x}{x^2 - 1} = x + \frac{3x}{x^2 - 1}$.
3. **Razcep imenovalca.** $x^2 - 1 = (x - 1)(x + 1)$.
4. **Parcialni ulomki.** $3x = A(x + 1) + B(x - 1)$. Za $x = 1$: $3 = 2A$, $A = \frac{3}{2}$. Za $x = -1$: $-3 = -2B$, $B = \frac{3}{2}$.
5. **Integriranje.** $\int x\, dx + \frac{3}{2}\int \frac{dx}{x - 1} + \frac{3}{2}\int \frac{dx}{x + 1} = \frac{x^2}{2} + \frac{3}{2}\ln|x - 1| + \frac{3}{2}\ln|x + 1| + C$.
6. **Krajši zapis.** $\frac{3}{2}\left(\ln|x - 1| + \ln|x + 1|\right) = \frac{3}{2}\ln|x^2 - 1|$. Enak rezultat dobimo hitreje z logaritemskim integralom, saj je $3x = \frac{3}{2}(x^2 - 1)'$.
7. **Preizkus.** $\left(\frac{x^2}{2} + \frac{3}{2}\ln|x^2 - 1|\right)' = x + \frac{3}{2}\cdot\frac{2x}{x^2 - 1} = x + \frac{3x}{x^2 - 1}$, kar je integrand iz koraka 2.

## Drugače: Bolj natančno

**Trditev.** Če je $F' = G'$ na intervalu $I$, je $G - F$ konstantna na $I$.

*Dokaz.* Naj bo $H = G - F$, torej $H' = 0$ na $I$. Za poljubna $x_1 < x_2$ iz $I$ po Lagrangeovem izreku obstaja $\xi \in (x_1, x_2)$ z $H(x_2) - H(x_1) = H'(\xi)(x_2 - x_1) = 0$. Torej je $H(x_1) = H(x_2)$. $\square$

Pogoj, da je $I$ **interval**, je bistven. Funkciji $\ln|x|$ in $\ln|x| + \operatorname{sgn}(x)$ imata obe odvod $\frac{1}{x}$ na $\mathbb{R} \setminus \{0\}$, a njuna razlika ni konstantna. Na vsakem delu definicijskega območja je lahko konstanta drugačna.

**Utemeljitev substitucije.** Naj bo $F' = f$. Po verižnem pravilu je $\frac{d}{dx} F(g(x)) = f(g(x))\, g'(x)$, torej je $F(g(x))$ primitivna funkcija integranda na levi. Zapis $dt = g'(x)\, dx$ je priročen pripomoček, ki ga utemeljuje prav to verižno pravilo.

**Obstoj primitivne funkcije.** Po osnovnem izreku analize ima vsaka zvezna funkcija na intervalu primitivno funkcijo, na primer $F(x) = \int_a^x f(t)\, dt$. Ta primitivna funkcija pa ni nujno elementarna. Integrali $\int e^{-x^2}\, dx$, $\int \frac{\sin x}{x}\, dx$ in $\int \frac{dx}{\ln x}$ se ne dajo izraziti z elementarnimi funkcijami (Liouvillov izrek). Zanje uporabljamo vrste ali numerične metode.

**Izrek o razcepu.** Vsako pravo racionalno funkcijo z realnimi koeficienti lahko zapišemo kot vsoto parcialnih ulomkov zgoraj opisane oblike, in to na en sam način. Izrek sledi iz osnovnega izreka algebre, po katerem se vsak realni polinom razcepi na linearne in nerazcepne kvadratne faktorje. Zato je vsaka racionalna funkcija elementarno integrabilna.

## Preveri se

? Koliko je $\displaystyle \int \cos(3x)\, dx$?
+ $\frac{1}{3}\sin(3x) + C$
- $3\sin(3x) + C$
- $-\frac{1}{3}\sin(3x) + C$
> Pri linearnem argumentu delimo s koeficientom: $\left(\frac{1}{3}\sin 3x\right)' = \cos 3x$.

? Koliko je $\displaystyle \int \frac{2x}{x^2 + 5}\, dx$?
+ $\ln(x^2 + 5) + C$
- $2\ln(x^2 + 5) + C$
~ Faktor $2$ v števcu je že del odvoda imenovalca, zato se ne pojavi še enkrat.
- $\frac{1}{x^2 + 5} + C$
~ Odvod te funkcije je $-\frac{2x}{(x^2 + 5)^2}$, ne integrand.
> Števec je odvod imenovalca, zato je integral $\ln|x^2 + 5| + C$; absolutno vrednost lahko izpustimo, ker je $x^2 + 5 > 0$.

? Koliko je $\displaystyle \int x e^x\, dx$?
- $x e^x + C$
+ $(x - 1)e^x + C$
- $(x + 1)e^x + C$
> Po delih z $u = x$, $dv = e^x\, dx$: $x e^x - \int e^x\, dx = x e^x - e^x + C$. Preizkus: $((x - 1)e^x)' = e^x + (x - 1)e^x = x e^x$.

? Koliko je $\displaystyle \int \frac{dx}{x(x + 1)}$?
+ $\ln|x| - \ln|x + 1| + C$
- $\ln|x(x + 1)| + C$
- $\ln|x| \cdot \ln|x + 1| + C$
> Parcialni ulomki: $\frac{1}{x(x + 1)} = \frac{1}{x} - \frac{1}{x + 1}$. Vsak člen da en logaritem.

:::simboli
f | funkcija pod integralom (integrand) | | | F'(x) = f(x)
x | neodvisna spremenljivka (integracijska spremenljivka) | | |
d | oznaka diferenciala (dx, dt, du, dv) | | | pove, po kateri spremenljivki integriramo
F | primitivna funkcija | F'(x) = f(x) | |
C | integracijska konstanta | | | poljubno realno število
g | notranja funkcija pri substituciji | | | njen odvod g' mora biti v integrandu
t | nova spremenljivka pri substituciji | t = g(x) | | dt = g′(x) dx
g' | odvod notranje funkcije g | | |
u | faktor, ki ga odvajamo (integracija po delih) | | | du = u′ dx
v | funkcija, ki jo dobimo z integriranjem dv | v = \int dv | |
a | realna konstanta (ničla imenovalca x − a) | | | v aˣ osnova potence, a > 0
b | druga ničla imenovalca (x − b) | | | v f(ax + b) prosti člen
k | stopnja (večkratnost) faktorja (x − a)ᵏ | | | naravno število, k ≥ 2
n | eksponent potence | | | n ≠ −1
p | polinom v števcu racionalne funkcije | | | v x² + px + q koeficient
r | ostanek pri deljenju polinomov (števec prave racionalne funkcije) | | |
q | polinom v imenovalcu racionalne funkcije | | | v x² + px + q prosti člen
D | koeficient parcialnega ulomka | |
I_n | integral ∫ xⁿ eˣ dx | I_n = x^n e^x - n I_{n-1} |
A, B | koeficienta parcialnih ulomkov | | | dobimo ju s primerjavo števcev
:::
