---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Lena se s pohodniškim zemljevidom odpravi na dolgo pot in se vse bolj utruja: $t$ ur po odhodu ($t \ge 1$) hodi s hitrostjo $\dfrac{1}{t^2}$ km/h. Na zemljevidu bi rada označila mejo, čez katero nikoli ne pride, če taka meja sploh obstaja. Pot od $t = 1$ do $t = b$ je ploščina pod krivuljo $y = \dfrac{1}{t^2}$, Lena pa hodi brez konca, zato potrebuje ploščino lika vse do neskončnosti. Lik je neskončno dolg; ali ima lahko končno ploščino?

Določeni integral $\int_a^b f(x)\,dx$ poznaš le za omejen interval $[a, b]$ in omejeno funkcijo. Za Lenin lik, delo, s katerim telo odnesemo »v neskončnost« iz gravitacijskega polja, verjetnost, da žarnica deluje več kot $t$ ur, Laplaceovo transformacijo in funkcijo gama potrebujemo **posplošene integrale**. Pri vsakem se vprašamo, ali ima končno vrednost, in če jo ima, kolikšna je.

## Razlaga

### Najprej slika: dva neskončno dolga lika

Nariši krivulji $y = \frac{1}{x^2}$ (Lenina hitrost) in $y = \frac1x$ za $x \ge 1$. Obe se začneta v točki $(1, 1)$, padata proti $0$ in se proti desni lepita na os $x$. Lik pod vsako je neskončno dolg. Na os $x$ postavi zastavico pri $b$ in izmeri ploščino do nje. Ker je $\int_1^b \frac{dx}{x^2} = 1 - \frac1b$ in $\int_1^b \frac{dx}{x} = \ln b$, dobimo za vse bolj oddaljene zastavice:

| $b$ | $\int_1^b \frac{dx}{x^2}$ | $\int_1^b \frac{dx}{x}$ |
|---|---|---|
| $10$ | $0{,}9$ | $\approx 2{,}303$ |
| $100$ | $0{,}99$ | $\approx 4{,}605$ |
| $1000$ | $0{,}999$ | $\approx 6{,}908$ |

Prvi stolpec se približuje $1$, drugi raste čez vse meje, čeprav počasi. Lik pod $\frac{1}{x^2}$ se proti desni tanjša tako hitro, da ima končno ploščino $1$: Lena nikoli ne prehodi več kot $1$ km. Lik pod $\frac1x$ se tanjša prepočasi.

### Definicija: zastavico pošljemo v neskončnost

Riemannov integral na $[1, \infty)$ ni definiran, ker neomejenega intervala ne moremo razdeliti na končno mnogo omejenih kosov. Zato integriramo do končne meje $b$ in nato pošljemo $b$ proti neskončnosti:

$$\int_a^\infty f(x)\,dx = \lim_{b \to \infty} \int_a^b f(x)\,dx .$$

Tu je $f$ integrabilna na vsakem intervalu $[a, b]$. Če limita obstaja in je končna, posplošeni integral **konvergira**. Sicer (limita je $\pm\infty$ ali ne obstaja) integral **divergira**.

:::premisli
Funkciji $\frac1x$ in $\frac1{x^2}$ obe gresta proti $0$. Ali je torej pogoj $\lim_{x\to\infty} f(x) = 0$ dovolj, da $\int_1^\infty f(x)\,dx$ konvergira?
---
Ne. Primer $\frac1x$ kaže, da funkcija lahko gre proti $0$, integral pa vseeno divergira. Pomembno je, **kako hitro** gre proti $0$.
:::

### Pravilo za potence

Za $p \neq 1$ je $\int_1^b x^{-p}\,dx = \dfrac{b^{1-p} - 1}{1-p}$. Člen $b^{1-p}$ gre proti $0$, če je $p > 1$, in proti $\infty$, če je $p < 1$. Za $p = 1$ dobimo $\ln b \to \infty$. Torej:

$$\int_1^\infty \frac{dx}{x^p} \ \text{konvergira} \iff p > 1 .$$

### Neskončno visok lik

Nariši še $y = \frac{1}{\sqrt x}$ na $(0, 1]$. Krivulja je zvezna, a ob osi $y$ se dvigne čez vse meje: lik je tokrat neskončno visok, ne dolg. Točki, kjer funkcija ni omejena (tu $x = 0$), rečemo **singularnost**. Ideja je enaka kot pri zastavici: od singularnosti se odmaknemo za $\varepsilon > 0$ in pošljemo $\varepsilon \to 0^+$:

$$\int_a^b f(x)\,dx = \lim_{\varepsilon \to 0^+} \int_{a+\varepsilon}^b f(x)\,dx ,$$

če je singularnost v $a$. Podobno storimo, če je v $b$.

Pri potencah se pravilo obrne. Ker je $\int_\varepsilon^1 x^{-p}\,dx = \dfrac{1 - \varepsilon^{1-p}}{1-p}$ za $p \neq 1$, velja:

$$\int_0^1 \frac{dx}{x^p} \ \text{konvergira} \iff p < 1 .$$

Pri $\infty$ mora funkcija padati dovolj hitro (velik $p$), pri $0$ pa ne sme rasti prehitro (majhen $p$). Obe pravili v eni tabeli:

| $p$ | $\int_1^\infty \frac{dx}{x^p}$ | $\int_0^1 \frac{dx}{x^p}$ |
|---|---|---|
| $p < 1$ | divergira | konvergira |
| $p = 1$ | divergira | divergira |
| $p > 1$ | konvergira | divergira |

V nobeni vrstici ne konvergirata oba, zato integral $\int_0^\infty \frac{dx}{x^p}$ divergira za vsak $p$.

:::premisli
Singularnost je lahko tudi **v notranjosti** intervala, npr. $\int_{-1}^1 \frac{dx}{x^2}$. Kako bi tak integral definiral in ali konvergira?
---
Razdelimo ga v točki singularnosti: $\int_{-1}^0 + \int_0^1$. Integral konvergira le, če konvergirata **oba** dela posebej. Tu je $p = 2 \geq 1$, zato že $\int_0^1 \frac{dx}{x^2}$ divergira in celoten integral divergira.
:::

### Obe meji neskončni

Integral $\int_{-\infty}^{\infty} f(x)\,dx$ razdelimo v poljubni točki $c$ na $\int_{-\infty}^c + \int_c^\infty$. Konvergira, če konvergirata oba dela, in to **neodvisno**: meji gresta proti $-\infty$ in $\infty$ vsaka po svoje, ne skupaj.

### Primerjalni kriterij

Kadar primitivne funkcije ne znamo zapisati, pomaga primerjava. Na sliki: če krivulja $f$ povsod leži pod krivuljo $g$, je tudi lik pod $f$ vsebovan v liku pod $g$. Simbolno: če je $0 \leq f(x) \leq g(x)$ za vse $x \geq a$, velja:

- če $\int_a^\infty g$ konvergira, konvergira tudi $\int_a^\infty f$;
- če $\int_a^\infty f$ divergira, divergira tudi $\int_a^\infty g$.

Funkcija pod konvergentno je »še manjša«, zato ima tudi končno ploščino. Za primerjavo najpogosteje vzamemo potenco $\frac{1}{x^p}$ ali eksponentno funkcijo $e^{-x}$. Enako velja za singularnosti na končnem intervalu.

## Rešeni primeri

### Primer 1 (lažji): neomejen interval

Kje na zemljevidu je Lenina meja iz uvoda? Izračunaj $\int_1^\infty \dfrac{dx}{x^2}$, če konvergira.

**Podatki:** funkcija $f(x) = \dfrac{1}{x^2}$, interval $[1, \infty)$
**Iščemo:** vrednost integrala ali ugotovitev, da divergira

:::formula
$\displaystyle \int_a^\infty f(x)\,dx = \lim_{b \to \infty} \int_a^b f(x)\,dx$
:::

**Rešitev:**

1. Primitivna funkcija: $\int x^{-2}\,dx = -\dfrac{1}{x} + C$.
2. Integral do končne meje: $\int_1^b \dfrac{dx}{x^2} = \left[-\dfrac1x\right]_1^b = 1 - \dfrac1b$.
3. Limita: $\lim_{b\to\infty}\left(1 - \dfrac1b\right) = 1$, ker gre $\dfrac1b \to 0$.
4. Odgovor: integral konvergira in je enak $1$. Lena po prvi uri prehodi manj kot $1$ km, mejo torej označi $1$ km naprej od tam, kjer je bila ob $t = 1$.

### Primer 2: neomejena funkcija

Izračunaj $\int_0^4 \dfrac{dx}{\sqrt x}$, če konvergira.

**Podatki:** funkcija $f(x) = \dfrac{1}{\sqrt x}$, interval $(0, 4]$, singularnost v $x = 0$
**Iščemo:** vrednost integrala ali ugotovitev, da divergira

:::formula
$\displaystyle \int_0^b f(x)\,dx = \lim_{\varepsilon \to 0^+} \int_\varepsilon^b f(x)\,dx$
:::

**Rešitev:**

1. Funkcija ni omejena pri $x \to 0^+$, zato se od $0$ odmaknemo za $\varepsilon$.
2. Primitivna funkcija: $\int x^{-1/2}\,dx = 2\sqrt x + C$.
3. $\int_\varepsilon^4 \dfrac{dx}{\sqrt x} = 2\sqrt 4 - 2\sqrt\varepsilon = 4 - 2\sqrt\varepsilon$.
4. Limita: $\lim_{\varepsilon\to 0^+}(4 - 2\sqrt\varepsilon) = 4$.
5. Odgovor: integral konvergira in je enak $4$. Ujema se s pravilom: $p = \frac12 < 1$.

### Primer 3 (težji): obe meji neskončni

Izračunaj ploščino lika med krivuljo $y = \dfrac{1}{1+x^2}$ in osjo $x$ na celi realni osi.

**Podatki:** funkcija $f(x) = \dfrac{1}{1+x^2} > 0$, interval $(-\infty, \infty)$
**Iščemo:** ploščino $S = \int_{-\infty}^{\infty} f(x)\,dx$

:::formula
$\displaystyle \int_{-\infty}^{\infty} f\,dx = \lim_{a\to-\infty}\int_a^0 f\,dx + \lim_{b\to\infty}\int_0^b f\,dx$, $\quad \int \frac{dx}{1+x^2} = \operatorname{arctg} x + C$
:::

**Rešitev:**

1. Integral razdelimo v $c = 0$, ker obe meji ne smeta iti v neskončnost skupaj.
2. Desni del: $\int_0^b \dfrac{dx}{1+x^2} = \operatorname{arctg} b \to \dfrac{\pi}{2}$, ko $b \to \infty$.
3. Levi del: $\int_a^0 \dfrac{dx}{1+x^2} = -\operatorname{arctg} a \to \dfrac{\pi}{2}$, ko $a \to -\infty$.
4. Oba dela konvergirata, zato konvergira tudi celoten integral: $S = \dfrac\pi2 + \dfrac\pi2 = \pi$.
5. Odgovor: neskončno dolg lik ima ploščino $\pi \approx 3{,}14$.

### Primer 4: zdaj ti (primerjava)

Ali $\int_1^\infty e^{-x^2}\,dx$ konvergira? Primitivne funkcije za $e^{-x^2}$ ne znamo zapisati z elementarnimi funkcijami. Oceni integral navzgor.

**Podatki:** funkcija $f(x) = e^{-x^2} > 0$, interval $[1, \infty)$
**Iščemo:** ali integral konvergira in zgornjo mejo zanj

:::formula
Primerjalni kriterij: $0 \leq f \leq g$ in $\int_a^\infty g$ konvergira $\Rightarrow$ $\int_a^\infty f$ konvergira in $\int_a^\infty f \leq \int_a^\infty g$
:::

**Rešitev:**

1. Za $x \geq 1$ je $x^2 \geq x$, zato $-x^2 \leq -x$.
2. Eksponentna funkcija narašča, torej $0 < e^{-x^2} \leq e^{-x}$ za $x \geq 1$.
3. Izračunaj $\int_1^\infty e^{-x}\,dx$ in zaključi.

:::premisli
Koliko je $\int_1^\infty e^{-x}\,dx$ in kaj to pove o $\int_1^\infty e^{-x^2}\,dx$?
---
$\int_1^b e^{-x}\,dx = e^{-1} - e^{-b} \to e^{-1} = \frac1e \approx 0{,}368$. Integral $\int_1^\infty e^{-x}$ konvergira, zato po primerjalnem kriteriju konvergira tudi $\int_1^\infty e^{-x^2}\,dx$ in je največ $\frac1e \approx 0{,}368$. (Natančna vrednost je približno $0{,}139$.)
:::

## Pogoste napake

- **Singularnost v notranjosti spregledaš.** Napačno: $\int_{-1}^1 \frac{dx}{x^2} = \left[-\frac1x\right]_{-1}^1 = -2$. Negativna ploščina pozitivne funkcije je že znak, da je nekaj narobe. Newton-Leibnizova formula velja le, če je funkcija na celem intervalu zvezna. Pravilno: razdeli v $0$; $\int_0^1 \frac{dx}{x^2}$ divergira, zato divergira ves integral.
- **Simetrična limita.** Napačno: $\int_{-\infty}^\infty x\,dx = \lim_{a\to\infty}\int_{-a}^a x\,dx = 0$. Meji morata iti v neskončnost neodvisno. Pravilno: $\int_0^\infty x\,dx$ divergira, zato divergira ves integral.
- **»Funkcija gre proti 0, torej integral konvergira.«** Pogoj ni zadosten: $\frac1x \to 0$, a $\int_1^\infty \frac{dx}{x}$ divergira. Pravilno: primerjaj s $\frac1{x^p}$ in preveri, ali je $p > 1$.
- **Zamenjaš smer pravila za potence.** Pri $\infty$ konvergira za $p > 1$, pri $0$ pa za $p < 1$. Kdor si zapomni samo »$p > 1$«, napačno sklepa, da $\int_0^1 \frac{dx}{\sqrt x}$ divergira. Pravilno: pri $0$ želimo, da funkcija ne raste prehitro, torej majhen $p$.
- **»Neomejena funkcija ali neskončen interval pomeni divergenco.«** Primera 1 in 2 kažeta, da ima tak lik lahko končno ploščino. Vedno izračunaj limito ali uporabi primerjavo.

## Povzetek

- Posplošeni integral je limita določenih integralov: $\int_a^\infty f = \lim_{b\to\infty}\int_a^b f$; pri singularnosti v $a$: $\int_a^b f = \lim_{\varepsilon\to0^+}\int_{a+\varepsilon}^b f$.
- Konvergira, če je limita končna; sicer divergira.
- $\int_1^\infty \frac{dx}{x^p}$ konvergira natanko za $p > 1$; $\int_0^1 \frac{dx}{x^p}$ natanko za $p < 1$.
- Singularnost v notranjosti ali dve neskončni meji: integral razdelimo; konvergira le, če konvergira vsak del posebej (meji neodvisno).
- Primerjalni kriterij za $0 \leq f \leq g$: iz konvergence $\int g$ sledi konvergenca $\int f$, iz divergence $\int f$ divergenca $\int g$.
- Pogoj $f(x) \to 0$ ni dovolj za konvergenco.

## Drugače: Na sliki

Nariši $y = \frac1x$ in $y = \frac1{x^2}$ za $x \geq 1$. Obe krivulji se začneta v točki $(1, 1)$ in se proti desni lepita na os $x$.

Lik razreži na pasove širine $1$: od $1$ do $2$, od $2$ do $3$ in tako naprej. Pri $\frac1{x^2}$ ima $n$-ti pas ploščino približno $\frac1{n^2}$, pri $\frac1x$ pa približno $\frac1n$. Ploščina lika je vsota ploščin pasov. Vsota $1 + \frac14 + \frac19 + \dots$ ostane končna, vsota $1 + \frac12 + \frac13 + \dots$ pa raste čez vse meje. Pasovi pod $\frac1x$ se tanjšajo, a prepočasi.

Singularnost v $0$ si predstavljaj enako, le zasukano: lik pod $\frac1{\sqrt x}$ je neskončno visok, a tako ozek, da je ploščina končna. Če zamenjaš vlogi osi $x$ in $y$, postane krivulja $y = \frac{1}{\sqrt x}$ krivulja $x = \frac1{y^2}$, neskončno visok lik pa neskončno dolg lik pod $\frac1{y^2}$.

## Drugače: Korak za korakom s številkami

Postopek za vsak posplošeni integral:

1. **Poišči vse »težave«:** neskončni meji in točke, kjer funkcija ni omejena (ničle imenovalca, $\ln$ pri $0$ ...).
2. **Razdeli** integral tako, da ima vsak del natanko eno težavo, in to na robu.
3. Za vsak del: zamenjaj težavno mejo s črko ($b$ ali $a + \varepsilon$).
4. Izračunaj navadni določeni integral, npr. $\int_1^b \frac{dx}{x^3} = \frac12 - \frac{1}{2b^2}$.
5. **Limita:** $b \to \infty$ da $\frac12$. Če je limita končna, del konvergira.
6. Če kateri del divergira, divergira ves integral. Sicer seštej vrednosti.
7. Če primitivne funkcije ni, preskoči korake 3–5 in primerjaj s $\frac{1}{x^p}$ ali $e^{-x}$.

## Drugače: Bolj natančno

**Izrek (primerjalni kriterij).** Naj bosta $f$ in $g$ integrabilni na vsakem $[a, b]$ in $0 \leq f \leq g$ na $[a, \infty)$. Če $\int_a^\infty g$ konvergira, konvergira tudi $\int_a^\infty f$.

*Dokaz.* Funkcija $F(b) = \int_a^b f(x)\,dx$ je naraščajoča, ker je $f \geq 0$. Navzgor je omejena: $F(b) \leq \int_a^b g \leq \int_a^\infty g$. Naraščajoča navzgor omejena funkcija ima končno limito, ko $b \to \infty$ (limita je supremum vrednosti). $\square$

**Limitna oblika.** Če sta $f, g > 0$ in $\lim_{x\to\infty} \frac{f(x)}{g(x)} = L \in (0, \infty)$, integrala $\int_a^\infty f$ in $\int_a^\infty g$ hkrati konvergirata ali hkrati divergirata. Primer: $\frac{1}{x^2 + \sqrt x}$ se pri velikih $x$ obnaša kot $\frac1{x^2}$, zato integral od $1$ do $\infty$ konvergira.

**Absolutna konvergenca.** Integral $\int_a^\infty f$ **absolutno konvergira**, če konvergira $\int_a^\infty |f|$. Iz absolutne konvergence sledi konvergenca (dokaz s Cauchyjevim pogojem: $\left|\int_b^{b'} f\right| \leq \int_b^{b'} |f|$). Obrat ne velja: $\int_1^\infty \frac{\sin x}{x}\,dx$ konvergira (per partes), $\int_1^\infty \frac{|\sin x|}{x}\,dx$ pa divergira. Takemu integralu rečemo **pogojno konvergenten**.

**Cauchyjeva glavna vrednost.** Simetrična limita $\lim_{a\to\infty}\int_{-a}^a f$ se imenuje glavna vrednost in se označi $\mathrm{v.p.}\int_{-\infty}^\infty f$. Lahko obstaja, ko integral divergira (npr. za $f(x) = x$ je enaka $0$). Je drug pojem in ga ne smemo enačiti s posplošenim integralom.

## Preveri se

? Za katere $p$ konvergira $\int_1^\infty \dfrac{dx}{x^p}$?
- za $p \geq 1$
~ Pri $p = 1$ je $\int_1^b \frac{dx}{x} = \ln b \to \infty$, zato meja $p = 1$ ne spada zraven.
- za $p < 1$
~ To je pogoj za singularnost v $0$, $\int_0^1 \frac{dx}{x^p}$. Pri $\infty$ mora funkcija padati hitro, torej velik $p$.
+ za $p > 1$
- za vsak $p > 0$, ker gre $\frac1{x^p} \to 0$
~ Da gre funkcija proti $0$, ni dovolj; $\frac1x$ gre proti $0$, integral pa divergira.
> $\int_1^b x^{-p}\,dx = \frac{b^{1-p} - 1}{1-p}$ ima končno limito natanko tedaj, ko $b^{1-p} \to 0$, torej $p > 1$; pri $p = 1$ dobimo $\ln b \to \infty$.

? Zvezna pozitivna funkcija $f$ izpolnjuje $\lim_{x\to\infty} f(x) = 0$. Kaj lahko rečemo o $\int_1^\infty f(x)\,dx$?
- Gotovo konvergira.
~ Protiprimer je $f(x) = \frac1x$: gre proti $0$, integral pa divergira.
- Gotovo divergira.
~ Protiprimer je $f(x) = \frac1{x^2}$: integral je enak $1$.
+ Iz tega podatka ne moremo sklepati; odvisno je od tega, kako hitro gre $f$ proti $0$.
> Primerjaj $\frac1x$ (divergira) in $\frac1{x^2}$ (konvergira). Obe gresta proti $0$, a z različno hitrostjo.

? Koliko je $\int_{-1}^{1} \dfrac{dx}{x^2}$?
- $-2$
~ To dobiš z $\left[-\frac1x\right]_{-1}^1$ in spregledaš singularnost v $0$. Pozitivna funkcija ne more imeti negativnega integrala.
- $0$
~ Funkcija je soda in pozitivna, zato se ploščini levo in desno ne odštejeta, ampak seštejeta.
+ Integral divergira.
- $2$
~ To je Newton-Leibnizova formula čez singularnost, ki tu ne velja, še z napako v predznaku.
> Razdelimo v $0$: $\int_0^1 \frac{dx}{x^2}$ divergira ($p = 2 \geq 1$), zato divergira ves integral.

? Koliko je $\int_0^\infty e^{-2x}\,dx$?
- Divergira, ker je interval neskončen.
~ Neskončen interval še ne pomeni divergence. Treba je izračunati limito.
- $2$
~ Primitivna funkcija za $e^{-2x}$ je $-\frac12 e^{-2x}$; faktor $2$ se deli, ne množi.
+ $\dfrac12$
- $1$
~ To bi bil rezultat za $e^{-x}$. Pri $e^{-2x}$ pazi na faktor iz notranjega odvoda.
> $\int_0^b e^{-2x}\,dx = \frac12 - \frac12 e^{-2b} \to \frac12$, ko $b \to \infty$.

? Koliko je $\int_0^8 \dfrac{dx}{\sqrt[3]{x}}$?
- Divergira, ker funkcija pri $0$ ni omejena.
~ Neomejena funkcija ima lahko končen integral. Tu je $p = \frac13 < 1$, zato konvergira.
- $3$
~ Pri vstavljanju je $8^{2/3} = 4$, ne $8^{1/3} = 2$.
+ $6$
- $12$
~ Primitivna funkcija za $x^{-1/3}$ je $\frac32 x^{2/3}$, ne $3x^{2/3}$.
> $\int_\varepsilon^8 x^{-1/3}\,dx = \frac32\left(8^{2/3} - \varepsilon^{2/3}\right) \to \frac32 \cdot 4 = 6$, ko $\varepsilon \to 0^+$.

:::simboli
f | integrand (funkcija, ki jo integriramo) | | | integrabilna na vsakem [a, b]
x | integracijska spremenljivka
d | oznaka diferenciala (dx) v integralu
a | spodnja meja integracije
b | zgornja meja integracije | | | pošljemo jo proti ∞ ali proti singularnosti
p | eksponent v potenci 1/xᵖ | | | na [1, ∞) konvergira za p > 1, na (0, 1] za p < 1
\varepsilon | odmik od singularnosti | | | ε → 0⁺
C | integracijska konstanta
g | primerjalna funkcija | | | 0 ≤ f(x) ≤ g(x)
:::
