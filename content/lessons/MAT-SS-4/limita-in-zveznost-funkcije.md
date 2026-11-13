---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Na koncertu so ob odru pogosto visoki, ozki stolpi zvočnikov. Tak stolpec seva zvok predvsem naravnost naprej, ob straneh je tišje. Akustiki opišejo, kako močan je zvok v neki smeri v primerjavi z zvokom naravnost naprej, s funkcijo

$$f(x) = \frac{\sin x}{x}$$

Tu je $x$ število, ki je odvisno od kota (v radianih); smer naravnost naprej je $x = 0$. Vrednost $1$ pomeni »enako močno kot naravnost naprej«.

In zdaj paradoks. Naravnost pred zvočnikom je zvok najmočnejši, to slišiš z lastnimi ušesi. Ko pa v formulo vstaviš $x = 0$, dobiš $\dfrac{\sin 0}{0} = \dfrac{0}{0}$, kalkulator pa izpiše napako. Formula torej odpove ravno v smeri, ki nas najbolj zanima.

Kako lahko ugotovimo vrednost tam, kjer je ne moremo izračunati? Odgovor je **limita funkcije**. Z njo boš v naslednjih lekcijah zgradil odvod, poiskal asimptote grafov in razumel, zakaj nekatere funkcije rišemo »brez dviga svinčnika«.

## Razlaga

**1. En primer do konca.** Formula pri $x = 0$ ne deluje, pri $x$ blizu $0$ pa deluje brez težav. Izračunajmo jo vedno bliže ničle, z obeh strani. Ker je $\sin(-x) = -\sin x$, je $f(-x) = f(x)$, zato sta stolpca enaka.

| $x$ | $f(x)$ | $f(-x)$ |
|---|---|---|
| $0{,}5$ | $0{,}958851$ | $0{,}958851$ |
| $0{,}1$ | $0{,}998334$ | $0{,}998334$ |
| $0{,}01$ | $0{,}999983$ | $0{,}999983$ |
| $0{,}001$ | $0{,}9999998$ | $0{,}9999998$ |

Vrednosti se z obeh strani vedno bolj bližajo številu $1$. Bližje ko je $x$ ničli, manjša je razlika do $1$. Zapišemo:

$$\lim_{x \to 0} \frac{\sin x}{x} = 1$$

Beri: »limita $\dfrac{\sin x}{x}$, ko gre $x$ proti $0$, je $1$«. Paradoks je razrešen: naravnost naprej je zvok polno močan, vrednost $1$. Formula je odpovedala le v eni sami točki, okolica pa nam je povedala, kaj tam je.

**2. Kaj je limita v splošnem.** Število $L$ je **limita funkcije** $f$ v točki $a$, če se vrednosti $f(x)$ poljubno približajo $L$, ko se $x$ dovolj približa $a$, pri tem pa je $x \ne a$. Pišemo $\lim\limits_{x \to a} f(x) = L$.

Z zaporedji, ki jih že poznaš: vzemi katerokoli zaporedje $x_n$, ki ima limito $a$ in nobenega člena enakega $a$. Potem ima zaporedje $f(x_n)$ limito $L$. Naša tabela je pokazala eno tako zaporedje: $0{,}1$; $0{,}01$; $0{,}001$ …

Bodi pozoren na pogoj $x \ne a$ v definiciji. Kaj pomeni za točko $a$ samo?

:::premisli
Funkciji $\dfrac{\sin x}{x}$ dodamo pravilo $f(0) = 5$. Sošolec reče: »Zdaj je limita pri $x \to 0$ enaka $5$, saj je tam vrednost $5$.« Ima prav?
---
Ne, limita ostane $1$. Limita opazuje le vrednosti pri $x \ne 0$, te pa se niso spremenile. Spremenila se je samo vrednost v eni točki. Limita torej ne gleda vrednosti $f(a)$: ta lahko obstaja ali pa ne, lahko je tudi čisto drugačna.
:::

**3. Leva in desna limita.** Včasih se vrednosti z leve bližajo enemu številu, z desne pa drugemu. Primer:

$$g(x) = \begin{cases} x, & x < 1 \\ x + 1, & x \ge 1 \end{cases}$$

Ko gre $x$ proti $1$ z leve ($x < 1$), se $g(x)$ bliža $1$. Pišemo $\lim\limits_{x \to 1^-} g(x) = 1$ (**leva limita**). Z desne se bliža $2$: $\lim\limits_{x \to 1^+} g(x) = 2$ (**desna limita**). Limita obstaja natanko tedaj, ko obstajata leva in desna limita in sta enaki. Pri $g$ v točki $1$ torej limite ni.

**4. Pravila za računanje.** Naj bo $\lim\limits_{x \to a} f(x) = A$ in $\lim\limits_{x \to a} g(x) = B$. Potem je limita vsote $A + B$, razlike $A - B$, produkta $A \cdot B$ in količnika $\dfrac{A}{B}$, če je $B \ne 0$. Pravila so enaka kot pri limitah zaporedij.

Iz tega sledi: pri polinomu limito dobiš kar z vstavljanjem. Na primer $\lim\limits_{x \to 2} (x^3 - 4x + 1) = 8 - 8 + 1 = 1$.

**5. Nedoločeni izraz $\frac{0}{0}$.** Če vstavljanje da $\dfrac{0}{0}$, to ni število in ni odgovor. Je **nedoločeni izraz**: znak, da moramo izraz najprej preoblikovati. Najpogostejši poti:

- števec in imenovalec razstavimo in okrajšamo skupni faktor $(x - a)$; to smemo, ker je $x \ne a$;
- pri korenih ulomek razširimo, na primer s $\sqrt{x} + 2$, da v števcu dobimo razliko kvadratov.

Šele nato vstavimo $x = a$.

**6. Limita v neskončnosti in neskončna limita.** Tako kot pri zaporedju $\frac{1}{n}$ je $\lim\limits_{x \to \infty} \dfrac{1}{x} = 0$. Pri ulomku polinomov števec in imenovalec delimo z najvišjo potenco $x$ v imenovalcu; vsi členi oblike $\dfrac{c}{x^n}$ gredo proti $0$.

Zvok spet pomaga. Jakost zvoka točkastega vira z močjo $P$ na razdalji $r$ je

$$I = \frac{P}{4\pi r^2}$$

Ko gre $r \to \infty$, gre $I \to 0$: daleč od odra glasbe skoraj ne slišiš. Ko gre $r \to 0$, $I$ raste čez vse meje. Pišemo $\lim\limits_{r \to 0} I = \infty$, kar pomeni, da končne limite ni. Na grafu je tam navpična asimptota, točki pa rečemo **pol**. (Model tik ob viru seveda ne velja več, saj zvočnik ni točka.)

:::premisli
Razdaljo do zvočnika podvojiš. Kolikokrat se spremeni jakost $I$? Napovej, nato preveri s formulo.
---
Jakost se zmanjša na četrtino. Razdalja je v imenovalcu na kvadrat: $(2r)^2 = 4r^2$, zato je nova jakost $\dfrac{P}{4\pi \cdot 4r^2} = \dfrac{I}{4}$.
:::

**7. Zveznost.** Funkcija $f$ je **zvezna** v točki $a$, če hkrati velja:

1. $f(a)$ obstaja,
2. $\lim\limits_{x \to a} f(x)$ obstaja,
3. $\lim\limits_{x \to a} f(x) = f(a)$.

Na sliki: graf okoli te točke narišeš, ne da bi dvignil svinčnik. Če en pogoj odpove, je v $a$ **nezveznost**. Tri vrste že poznaš:

- **luknja**: limita obstaja, $f(a)$ pa ne (ali je drugačna), kot $\dfrac{\sin x}{x}$ pri $0$; luknjo »zakrpamo« z dodatkom $f(0) = 1$;
- **skok**: leva in desna limita sta različni, kot pri $g$ v točki $1$;
- **pol**: vrednosti rastejo čez vse meje, kot $I$ pri $r = 0$.

Polinomi, racionalne funkcije, koreni, $\sin x$, $\cos x$, eksponentna in logaritemska funkcija so zvezne povsod, kjer so definirane. Zato je pri njih limita v točki definicijskega območja kar vrednost funkcije.

V simulaciji spodaj (»Limita in zveznost funkcije«) izberi funkcijo s skokom in zmanjšaj $h$ na $0{,}001$. Opazuj, ali se vrednost tik levo in tik desno od $x = 1$ ujemata. Nato isto naredi pri luknji.

## Rešeni primeri

### Primer 1: krajšanje pri $\frac{0}{0}$

Izračunaj $\lim\limits_{x \to 3} \dfrac{x^2 - 9}{x - 3}$.

**Podatki:** funkcija $f(x) = \dfrac{x^2 - 9}{x - 3}$, točka $a = 3$
**Iščemo:** $\lim\limits_{x \to 3} f(x)$

:::formula
Pri $\frac{0}{0}$ razstavimo in okrajšamo: $x^2 - 9 = (x - 3)(x + 3)$, nato vstavimo.
:::

**Rešitev:**

1. Vstavimo $x = 3$: števec je $9 - 9 = 0$, imenovalec $3 - 3 = 0$. Dobimo $\frac{0}{0}$, zato moramo preoblikovati.
2. Razstavimo števec kot razliko kvadratov: $\dfrac{(x - 3)(x + 3)}{x - 3}$.
3. Okrajšamo $(x - 3)$; to smemo, ker je pri limiti $x \ne 3$. Ostane $x + 3$.
4. Vstavimo: $3 + 3 = 6$.
5. Odgovor: limita je $6$, čeprav funkcija pri $x = 3$ ni definirana.

### Primer 2: limita v neskončnosti

Izračunaj $\lim\limits_{x \to \infty} \dfrac{3x^2 - 5x}{6x^2 + 1}$.

**Podatki:** funkcija $f(x) = \dfrac{3x^2 - 5x}{6x^2 + 1}$, $x \to \infty$
**Iščemo:** $\lim\limits_{x \to \infty} f(x)$

:::formula
Števec in imenovalec delimo z $x^2$ in upoštevamo $\lim\limits_{x \to \infty} \dfrac{c}{x^n} = 0$ za $n > 0$.
:::

**Rešitev:**

1. Vstavljanje velikih $x$ da »$\frac{\infty}{\infty}$«, kar je tudi nedoločeni izraz.
2. Delimo z $x^2$, najvišjo potenco v imenovalcu: $\dfrac{3 - \frac{5}{x}}{6 + \frac{1}{x^2}}$.
3. Ko gre $x \to \infty$, gresta $\frac{5}{x}$ in $\frac{1}{x^2}$ proti $0$.
4. Ostane $\dfrac{3}{6} = 0{,}5$.
5. Odgovor: limita je $0{,}5$. Graf ima vodoravno asimptoto $y = 0{,}5$.

### Primer 3 (višja raven): ovojnica glasnosti brez poka

V programu za urejanje zvoka producent sestavi ovojnico glasnosti tona (relativna glasnost $v$ v odvisnosti od časa $t$ v sekundah):

$$v(t) = \begin{cases} \dfrac{t^2 + t - 6}{t - 2}, & 0 \le t < 2 \\[2mm] k \cdot t - 3, & t \ge 2 \end{cases}$$

Če ima ovojnica skok, zvočnik ob tem trenutku »poči«. Za katero vrednost parametra $k$ je $v$ pri $t = 2$ zvezna?

**Podatki:** $v(t) = \dfrac{t^2 + t - 6}{t - 2}$ za $0 \le t < 2$, $v(t) = k \cdot t - 3$ za $t \ge 2$, točka $t = 2\,\mathrm{s}$
**Iščemo:** parameter $k$, pri katerem je $v$ zvezna pri $t = 2$

:::formula
Zveznost pri $t = 2$: $\lim\limits_{t \to 2^-} v(t) = \lim\limits_{t \to 2^+} v(t) = v(2)$
:::

**Rešitev:**

1. Leva limita: vstavljanje da $\frac{0}{0}$, zato razstavimo $t^2 + t - 6 = (t - 2)(t + 3)$.
2. Okrajšamo $(t - 2)$, ostane $t + 3$, zato je $\lim\limits_{t \to 2^-} v(t) = 2 + 3 = 5$.
3. Desni del je polinom, torej zvezen: desna limita je enaka $v(2) = 2k - 3$.
4. Brez skoka morata biti enaki: $2k - 3 = 5$, od tod $2k = 8$ in $k = 4$.
5. Preizkus: $4 \cdot 2 - 3 = 5$, kar se ujema z levo limito.
6. Odgovor: pri $k = 4$ ovojnica nima skoka in zvočnik ne poči.

### Primer 4: zdaj ti

Izračunaj $\lim\limits_{x \to 4} \dfrac{\sqrt{x} - 2}{x - 4}$.

**Podatki:** funkcija $f(x) = \dfrac{\sqrt{x} - 2}{x - 4}$, točka $a = 4$
**Iščemo:** $\lim\limits_{x \to 4} f(x)$

:::formula
Ulomek razširimo s $\sqrt{x} + 2$: $(\sqrt{x} - 2)(\sqrt{x} + 2) = x - 4$.
:::

**Rešitev:**

1. Vstavimo $x = 4$: $\sqrt{4} - 2 = 0$ in $4 - 4 = 0$. Spet $\frac{0}{0}$.
2. Razširimo s $\sqrt{x} + 2$. Števec postane $x - 4$, ulomek pa $\dfrac{x - 4}{(x - 4)(\sqrt{x} + 2)}$.
3. Okrajšaj in vstavi sam, nato preveri:

:::premisli
Koliko je limita?
---
Po krajšanju ostane $\dfrac{1}{\sqrt{x} + 2}$. Pri $x = 4$: $\dfrac{1}{2 + 2} = \dfrac{1}{4} = 0{,}25$.
:::

## Pogoste napake

- **»$\frac{0}{0}$ je $0$« (ali $1$).** Vstavljanje v Primeru 1 da $\frac{0}{0}$, limita pa je $6$. Tak izraz je nedoločen: ne pove rezultata, ampak da je treba izraz preoblikovati.
- **»Funkcija tam ni definirana, torej limite ni.«** Limita opazuje bližino točke, ne točke same. $\dfrac{\sin x}{x}$ pri $0$ ni definirana, limita pa je $1$.
- **»Limita je kar $f(a)$.«** To velja le pri zveznih funkcijah. Pri $g$ s skokom je $g(1) = 2$, leva limita pa $1$. Najprej preveri, ali je funkcija v točki zvezna.
- **Krajšanje členov namesto faktorjev.** »$\dfrac{x^2 - 9}{x - 3} = \dfrac{x^2}{x} - \dfrac{9}{3} = x - 3$« je napačno, ker ulomka ne smemo deliti po členih imenovalca. Krajšamo le faktorje: najprej razstavi.
- **»$\frac{\infty}{\infty}$ je $1$.«** Pri $\dfrac{3x^2 - 5x}{6x^2 + 1}$ oba dela rasteta, a imenovalec je pri velikih $x$ približno dvakrat večji od števca, zato je limita $0{,}5$. Deli z najvišjo potenco.

## Povzetek

- $\lim\limits_{x \to a} f(x) = L$: ko se $x$ ($x \ne a$) približuje $a$, se $f(x)$ približuje $L$; vrednost $f(a)$ ne vpliva.
- Limita obstaja, ko sta leva in desna limita enaki.
- Pravila: limita vsote, razlike, produkta in količnika (imenovalec $\ne 0$) je vsota, razlika, produkt in količnik limit.
- $\frac{0}{0}$ in $\frac{\infty}{\infty}$ sta nedoločena izraza: razstavi in okrajšaj, razširi pri korenih, deli z najvišjo potenco.
- $\lim\limits_{x \to 0} \dfrac{\sin x}{x} = 1$, $\lim\limits_{x \to \infty} \dfrac{1}{x} = 0$.
- $f$ je zvezna v $a$, če $f(a)$ obstaja in je enaka limiti. Nezveznosti: luknja, skok, pol.
- Elementarne funkcije so zvezne na definicijskem območju: tam je limita kar vrednost.

## Drugače: Z analogijo

Predstavljaj si posnetek violine, na katerem je za delček sekunde praska: en sam vzorec zvoka manjka. Program za urejanje zvoka ga zlahka nadomesti. Pogleda vzorce tik pred prasko in tik za njo in če se oboji bližajo isti vrednosti, vstavi to vrednost. Natanko to je limita: vrednost, ki jo določa okolica, tudi ko točka sama manjka. Taka praska je **luknja**, ki jo zakrpamo.

Drugače je, ko glasbenik med tonom nenadoma preskoči na drug ton. Vzorci levo se bližajo eni vrednosti, desno drugi. Nobena »popravljena« vrednost ne naredi prehoda gladkega. To je **skok**: leva in desna limita se razlikujeta.

Tretja možnost je mikrofon, ki ga približaš zvočniku, da začne piskati čedalje glasneje, brez meje. To je kot **pol**: vrednosti rastejo čez vse meje in nobeno število ne zakrpa luknje.

## Drugače: Bolj natančno

»Poljubno blizu« in »dovolj blizu« lahko zapišemo s številoma $\varepsilon$ in $\delta$. $\lim\limits_{x \to a} f(x) = L$ pomeni: za vsak $\varepsilon > 0$ obstaja $\delta > 0$, da iz $0 < |x - a| < \delta$ sledi $|f(x) - L| < \varepsilon$.

Z besedami: ne glede na to, kako ozek pas $\varepsilon$ okoli $L$ zahtevaš, najdeš tako ozek pas $\delta$ okoli $a$, da so tam (razen morda pri $a$) vse vrednosti funkcije v tvojem pasu.

Primer: $\lim\limits_{x \to 3} (2x + 1) = 7$. Velja $|2x + 1 - 7| = 2\,|x - 3|$. Če izberemo $\delta = \dfrac{\varepsilon}{2}$, iz $|x - 3| < \delta$ sledi $|2x + 1 - 7| < 2 \cdot \dfrac{\varepsilon}{2} = \varepsilon$.

Zakaj je $\lim\limits_{x \to 0} \dfrac{\sin x}{x} = 1$ res, ne le v tabeli? Na enotski krožnici za $0 < x < \frac{\pi}{2}$ primerjamo ploščine dveh trikotnikov in izseka: $\sin x < x < \tan x$. Delimo s $\sin x$ in vzamemo obratne vrednosti: $\cos x < \dfrac{\sin x}{x} < 1$. Ker gre $\cos x \to 1$, je ulomek »stisnjen« med dve funkciji z limito $1$, zato ima tudi sam limito $1$ (izrek o sendviču).

## Preveri se

? Producent preverja ovojnico glasnosti $v(t)$ v trenutku $t = 2$. Kdaj je $v$ pri $t = 2$ zvezna?
- Ko je $v(2)$ definirana.
~ Definirana vrednost ni dovolj: funkcija s skokom ima $v(2)$, pa vseeno poči.
- Ko obstaja leva limita pri $t = 2$.
~ Desna limita je lahko drugačna; potem limite ni in je skok.
+ Ko $v(2)$ obstaja in je $\lim\limits_{t \to 2} v(t) = v(2)$.
- Ko je $v(2) = 0$.
~ Vrednost $0$ nima nobene zveze z zveznostjo; pomembno je ujemanje limite in vrednosti.
> Zveznost zahteva vse troje: vrednost obstaja, limita obstaja, obe sta enaki.

? Razvrsti limite od najmanjše do največje: $A = \lim\limits_{x \to \infty} \dfrac{2x + 1}{x - 3}$, $B = \lim\limits_{x \to 0} \dfrac{\sin x}{x}$, $C = \lim\limits_{x \to 2} \dfrac{x^2 - 4}{x - 2}$.
- $C < B < A$
~ Tako dobiš, če $C$ izračunaš kot $\frac{0}{0} = 0$. Po razstavljanju je $C = 2 + 2 = 4$.
- $A = B < C$
~ Tako dobiš, če vzameš $\frac{\infty}{\infty} = 1$. Po deljenju z $x$ je $A = 2$.
+ $B < A < C$
> $B = 1$, $A = \dfrac{2}{1} = 2$ (deljenje z $x$), $C = 4$ (razstavljanje $(x - 2)(x + 2)$).

? Kaj se zgodi z vrednostmi $f(x) = \dfrac{1}{(x - 1)^2}$, ko se $x$ z obeh strani približuje $1$?
- Približujejo se $0$.
~ Proti $0$ gre imenovalec, ne ulomek. Deljenje z vedno manjšim pozitivnim številom da vedno večje število.
- Z leve gredo proti $-\infty$, z desne proti $+\infty$.
~ To velja za $\dfrac{1}{x - 1}$. Kvadrat je vedno pozitiven, zato je $f(x) > 0$ na obeh straneh.
+ Rastejo čez vse meje; pri $x = 1$ je pol.
- Nič ne moremo reči, ker $f(1)$ ne obstaja.
~ Limita gleda vrednosti v bližini točke, te pa obstajajo.
> Imenovalec je pozitiven in gre proti $0$, zato $f(x)$ raste čez vse meje: $\lim\limits_{x \to 1} f(x) = \infty$, navpična asimptota $x = 1$.

? Koliko je $\lim\limits_{x \to -2} \dfrac{x^2 + 5x + 6}{x + 2}$?
- $0$
~ Vstavljanje da $\frac{0}{0}$, kar ni $0$, ampak nedoločeni izraz.
- Limita ne obstaja, ker je imenovalec pri $x = -2$ enak $0$.
~ Limita ne gleda točke $-2$ same, ampak njeno bližino. Izraz najprej razstavi.
+ $1$
> $x^2 + 5x + 6 = (x + 2)(x + 3)$; po krajšanju ostane $x + 3$, pri $x = -2$ je to $1$.

? Po vklopu ojačevalnika se relativna glasnost v dvorani spreminja po formuli $v(t) = \dfrac{12t^2 + 5}{4t^2 + 5}$. Kateri vrednosti se glasnost približuje, ko $t \to \infty$?
- $1$
~ To je $\frac{\infty}{\infty} = 1$, kar ne velja. (Vrednost $1$ ima glasnost ob vklopu, pri $t = 0$.)
- $\infty$
~ Števec res raste čez vse meje, a tudi imenovalec; oba rasteta s $t^2$, zato je ulomek omejen.
+ $3$
- $12$
~ Upoštevati moraš tudi vodilni koeficient imenovalca, $4$.
> Delimo z $t^2$: $\dfrac{12 + \frac{5}{t^2}}{4 + \frac{5}{t^2}} \to \dfrac{12}{4} = 3$.

:::simboli
f | funkcija |  |  | v uvodu relativna moč zvoka v smeri $x$: $f(x) = \dfrac{\sin x}{x}$
x | neodvisna spremenljivka (pri zvočniku odvisna od kota) |  |  | pri $\sin x$ v radianih
a | točka, h kateri se približuje $x$ |  |  |
L | limita funkcije |  |  |
g | funkcija s skokom pri $x = 1$ |  |  |
I | jakost zvoka | I = \dfrac{P}{4\pi r^2} | W/m^2 |
P | moč zvočnega vira |  | W |
r | razdalja od vira |  | m |
v | relativna glasnost (ovojnica) |  | – |
t | čas |  | s |
k | parameter ovojnice |  | s^{-1} |
c | konstanta v števcu |  |  |
n | naravno število: indeks člena zaporedja ali eksponent |  |  |
\pi | število pi |  |  | $\pi \approx 3{,}14$
:::
