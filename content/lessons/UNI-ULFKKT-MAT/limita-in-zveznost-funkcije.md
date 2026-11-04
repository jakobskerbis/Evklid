---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Limita je temeljni pojem analize. Z njo definiramo odvod (hitrost spremembe), določeni integral (ploščino, delo, količino snovi) in vsoto neskončne vrste. Brez limite ne moremo natančno povedati, kaj pomeni »hitrost v trenutku« ali »koncentracija, ko gre čas proti neskončnosti«.

Pogosto nas zanima, kaj se dogaja s funkcijo, ko se $x$ približuje točki, v kateri funkcija sploh ni definirana. Izraz $\frac{\sin x}{x}$ pri $x = 0$ nima vrednosti, a se pri majhnih $x$ vrednosti približujejo $1$. Prav to opiše limita.

**Zveznost** pa opisuje funkcije, ki nimajo »skokov«: majhna sprememba vhoda povzroči majhno spremembo izhoda. Večina fizikalnih in kemijskih količin se spreminja zvezno, zato za zvezne funkcije veljajo močni izreki: na zaprtem intervalu dosežejo najmanjšo in največjo vrednost in vsako vmesno vrednost. Na tem temeljijo numerične metode za reševanje enačb.

Cilji so trije:

- računati limite funkcij in razreševati **nedoločene izraze**,
- prepoznati **zvezne** funkcije in vrste nezveznosti,
- uporabljati lastnosti zveznih funkcij na **zaprtem intervalu**.

## Razlaga

**1. Limita funkcije (intuitivno).** Zapis

$$\lim_{x \to a} f(x) = L$$

pomeni: ko se $x$ poljubno približa $a$ (a $x \neq a$), se $f(x)$ poljubno približa $L$. Vrednost $f(a)$ pri tem ni pomembna; funkcija v $a$ sploh ni nujno definirana. Natančno:

**Definicija (ε-δ).** Naj bo $f$ definirana na neki okolici točke $a$, razen morda v $a$. Število $L$ je **limita** funkcije $f$ v točki $a$, če za vsak $\varepsilon > 0$ obstaja $\delta > 0$, da za vse $x$ z $0 < |x - a| < \delta$ velja $|f(x) - L| < \varepsilon$.

Za vsako (še tako ozko) toleranco $\varepsilon$ okoli $L$ torej obstaja okolica točke $a$, na kateri so vse vrednosti funkcije znotraj tolerance. *Primer.* Pokažimo $\lim_{x \to 2}(3x - 1) = 5$. Velja $|(3x - 1) - 5| = 3|x - 2|$. Za dani $\varepsilon$ izberemo $\delta = \frac{\varepsilon}{3}$; iz $0 < |x - 2| < \delta$ sledi $|(3x - 1) - 5| < 3\delta = \varepsilon$.

**Leva in desna limita.** $\lim_{x \to a^-} f(x) = L$ pomeni isto, le da gledamo samo $x$ z $a - \delta < x < a$ (približevanje z leve); pri desni limiti $\lim_{x \to a^+} f(x)$ pa $x$ z $a < x < a + \delta$. Limita obstaja natanko tedaj, ko obstajata obe enostranski limiti in sta enaki. Primer: za $f(x) = \frac{|x|}{x}$ je leva limita v $0$ enaka $-1$, desna $1$, zato limita ne obstaja.

**Limite v neskončnosti** in **neskončne limite**: $\lim_{x \to \infty} f(x) = L$, če za vsak $\varepsilon > 0$ obstaja $M$, da za vse $x > M$ velja $|f(x) - L| < \varepsilon$; $\lim_{x \to a} f(x) = \infty$, če za vsak $M$ obstaja $\delta > 0$, da za $0 < |x - a| < \delta$ velja $f(x) > M$. Tako je $\lim_{x \to \infty} \frac{1}{x} = 0$ (vzamemo $M = \frac{1}{\varepsilon}$), $\lim_{x \to 0^+} \frac{1}{x} = \infty$ pa pomeni, da vrednosti rastejo čez vse meje. Premica $y = L$ je **vodoravna asimptota**, če je $\lim_{x \to \pm\infty} f(x) = L$, premica $x = a$ pa **navpična asimptota**, če je vsaj ena enostranska limita v $a$ neskončna.

**2. Pravila za računanje.** Če obstajata $\lim_{x \to a} f(x) = A$ in $\lim_{x \to a} g(x) = B$, velja:

- $\lim (f \pm g) = A \pm B$, $\lim (f \cdot g) = A \cdot B$,
- $\lim \frac{f}{g} = \frac{A}{B}$, če je $B \neq 0$,
- $\lim h(f(x)) = h(A)$, če je $h$ zvezna v $A$.

*Dokaz za vsoto.* Za dani $\varepsilon > 0$ obstajata $\delta_1$ in $\delta_2$, da je $|f(x) - A| < \frac{\varepsilon}{2}$ za $0 < |x - a| < \delta_1$ in $|g(x) - B| < \frac{\varepsilon}{2}$ za $0 < |x - a| < \delta_2$. Za $\delta = \min(\delta_1, \delta_2)$ po trikotniški neenakosti velja $|f(x) + g(x) - (A + B)| \le |f(x) - A| + |g(x) - B| < \varepsilon$. $\square$

Za polinome, racionalne, eksponentne, logaritemske in krožne funkcije je limita v točki iz definicijskega območja kar vrednost funkcije, ker so te funkcije zvezne (točka 4): $\lim_{x \to 2} (x^2 + 1) = 5$.

**3. Nedoločeni izrazi.** Težave nastanejo, ko pravila dajo enega od izrazov

$$\frac{0}{0},\quad \frac{\infty}{\infty},\quad \infty - \infty,\quad 0 \cdot \infty,\quad 1^\infty,\quad 0^0,\quad \infty^0.$$

:::premisli
Izraza $\frac{x}{x}$ in $\frac{x^2}{x}$ sta pri $x \to 0$ oba oblike $\frac{0}{0}$. Proti čemu gre vsak od njiju?
---
Prvi je za $x \neq 0$ enak $1$, drugi enak $x$, zato gresta proti $1$ in $0$. Ista »oblika« $\frac{0}{0}$ da različna rezultata.
:::

Ti izrazi niso števila: rezultat je odvisen od tega, kako hitro gresta posamezna dela proti svojim limitam. Izraz moramo najprej preoblikovati. Najpogostejši prijemi:

- **Razstavljanje in krajšanje** (pri $\frac{0}{0}$ za racionalne funkcije): skupni faktor $(x - a)$ okrajšamo.
- **Racionalizacija** (pri korenih): pomnožimo s konjugiranim izrazom, npr. $\sqrt{u} - \sqrt{v} = \frac{u - v}{\sqrt{u} + \sqrt{v}}$.
- **Deljenje z najvišjo potenco** (pri $\frac{\infty}{\infty}$ in $x \to \infty$): za racionalno funkcijo je limita kvocient vodilnih koeficientov, če sta stopnji enaki, $0$, če ima imenovalec višjo stopnjo, in $\pm\infty$, če ima višjo stopnjo števec.
- **Znane limite:**

$$\lim_{x \to 0} \frac{\sin x}{x} = 1, \quad \lim_{x \to 0} \frac{e^x - 1}{x} = 1,$$

$$\lim_{x \to 0} \frac{\ln(1 + x)}{x} = 1, \quad \lim_{x \to \infty}\left(1 + \frac{1}{x}\right)^x = e.$$

Pri $1^\infty$, $0^0$ in $\infty^0$ zapišemo $f^g = e^{g \ln f}$ in izračunamo limito eksponenta. Kasneje bomo spoznali še L'Hospitalovo pravilo, ki uporablja odvode.

**Izrek o sendviču.** Naj za vse $x$ iz neke okolice točke $a$, razen morda za $x = a$, velja $g(x) \le f(x) \le h(x)$ in naj bo $\lim_{x \to a} g(x) = \lim_{x \to a} h(x) = L$. Tedaj je tudi $\lim_{x \to a} f(x) = L$.

*Dokaz.* Za dani $\varepsilon > 0$ je pri dovolj majhnem $|x - a| > 0$ hkrati $L - \varepsilon < g(x)$ in $h(x) < L + \varepsilon$, torej $L - \varepsilon < f(x) < L + \varepsilon$. $\square$

Tako dokažemo $\lim_{x \to 0} x \sin \frac{1}{x} = 0$, saj je $-|x| \le x \sin\frac{1}{x} \le |x|$.

**Dokaz znane limite $\lim_{x \to 0} \frac{\sin x}{x} = 1$.** Za $0 < x < \frac{\pi}{2}$ primerjamo ploščine v enotskem krogu: trikotnik pod lokom, krožni izsek in večji trikotnik ob tangenti dajo $\frac{\sin x}{2} \le \frac{x}{2} \le \frac{\tan x}{2}$. Delimo s $\frac{\sin x}{2} > 0$ in obrnemo: $\cos x \le \frac{\sin x}{x} \le 1$. Ker je kosinus zvezen, gre $\cos x \to 1$, in izrek o sendviču da limito $1$. Funkcija $\frac{\sin x}{x}$ je soda, zato enako velja za $x \to 0^-$. $\square$

**4. Zveznost.** Funkcija $f$ je **zvezna v točki** $a \in D_f$, če je

$$\lim_{x \to a} f(x) = f(a).$$

V tem so skriti trije pogoji: $f(a)$ obstaja, limita obstaja in obe sta enaki. Z $\varepsilon$ in $\delta$: $f$ je zvezna v $a$, če za vsak $\varepsilon > 0$ obstaja $\delta > 0$, da za vse $x \in D_f$ z $|x - a| < \delta$ velja $|f(x) - f(a)| < \varepsilon$ (tu je dovoljen tudi $x = a$, $L$ pa je $f(a)$). Funkcija je zvezna na intervalu, če je zvezna v vsaki njegovi točki (v krajiščih zaprtega intervala enostransko). Vse elementarne funkcije so zvezne na svojem definicijskem območju. Če sta $f$ in $g$ zvezni v $a$, so v $a$ zvezne $f \pm g$, $f \cdot g$ in $\frac{f}{g}$ (slednja, če je $g(a) \neq 0$); če je $f$ zvezna v $a$ in $h$ zvezna v $f(a)$, je kompozitum $h \circ f$ zvezen v $a$.

**Vrste nezveznosti** v točki $a$:

- **odpravljiva nezveznost:** limita obstaja, a je različna od $f(a)$ ali $f(a)$ ni definirana; funkcijo popravimo tako, da za $f(a)$ vzamemo limito (primer: $\frac{\sin x}{x}$ v $0$),
- **skok:** obe enostranski limiti obstajata, a sta različni (primer: $\frac{|x|}{x}$ v $0$),
- **pol** ali druga neskončna nezveznost: vsaj ena enostranska limita je neskončna (primer: $\frac{1}{x}$ v $0$).

**5. Zvezne funkcije na zaprtem intervalu.** Naj bo $f$ zvezna na zaprtem omejenem intervalu $[a, b]$. Tedaj velja:

- **Omejenost:** obstaja $M$, da je $|f(x)| \le M$ za vse $x \in [a, b]$.
- **Weierstrassov izrek:** obstajata $x_m, x_M \in [a, b]$, da je $f(x_m) \le f(x) \le f(x_M)$ za vse $x \in [a, b]$; $f$ torej doseže najmanjšo in največjo vrednost.
- **Bolzanov izrek:** če je $f(a) \cdot f(b) < 0$, obstaja $c \in (a, b)$ z $f(c) = 0$.
- **Izrek o vmesni vrednosti:** za vsak $d$ med $f(a)$ in $f(b)$ obstaja $c \in [a, b]$ z $f(c) = d$.

*Dokaz izreka o vmesni vrednosti iz Bolzanovega.* Če je $d = f(a)$ ali $d = f(b)$, je trditev očitna. Sicer je $g(x) = f(x) - d$ zvezna na $[a, b]$ in $g(a) \cdot g(b) < 0$, ker $d$ leži strogo med $f(a)$ in $f(b)$. Po Bolzanovem izreku obstaja $c$ z $g(c) = 0$, torej $f(c) = d$. $\square$ Skupaj z Weierstrassovim izrekom (izrek o vmesni vrednosti uporabimo na intervalu med $x_m$ in $x_M$) sledi: zaloga vrednosti zvezne funkcije na $[a, b]$ je zaprt interval $[f(x_m), f(x_M)]$.

:::premisli
Temperatura v reaktorju je ob 8.00 $20\,^\circ\mathrm{C}$, ob 9.00 pa $80\,^\circ\mathrm{C}$. Je bila vmes kdaj natanko $50\,^\circ\mathrm{C}$? Kaj moraš privzeti?
---
Da, po izreku o vmesni vrednosti, če je temperatura zvezna funkcija časa (to fizikalno drži). Izrek pa ne pove, kdaj, niti da se je to zgodilo le enkrat.
:::

Vsi pogoji so nujni. Funkcija $\frac{1}{x}$ je na $(0, 1]$ zvezna, a ni omejena (interval ni zaprt). Funkcija $f(x) = x$ na $(0, 1)$ ne doseže ne najmanjše ne največje vrednosti. Funkcija s skokom lahko preskoči ničlo.

**Bisekcija.** Bolzanov izrek da preprosto numerično metodo: interval z ničlo razpolovimo, izračunamo vrednost v sredini in obdržimo polovico, na kateri funkcija menja predznak. Po $n$ korakih je ničla določena na $\frac{b - a}{2^n}$ natančno.

## Rešeni primeri

### Primer 1 (lažji)

Izračunaj $\displaystyle \lim_{x \to 3} \frac{x^2 - 9}{x^2 - x - 6}$.

**Podatki:** $f(x) = \dfrac{x^2 - 9}{x^2 - x - 6}$, $x \to 3$
**Iščemo:** limito $\lim_{x \to 3} f(x)$

:::formula
Pri $\frac{0}{0}$ za racionalno funkcijo števec in imenovalec razstavimo in okrajšamo skupni faktor $(x - a)$. Nato vstavimo $x = a$.
:::

**Rešitev:**

1. Vstavimo $x = 3$: števec $9 - 9 = 0$, imenovalec $9 - 3 - 6 = 0$. Dobimo nedoločeni izraz $\frac{0}{0}$.
2. Razstavimo: $x^2 - 9 = (x - 3)(x + 3)$ in $x^2 - x - 6 = (x - 3)(x + 2)$.
3. Za $x \neq 3$ okrajšamo: $f(x) = \dfrac{x + 3}{x + 2}$.
4. Ta funkcija je zvezna v $3$, zato je limita $\dfrac{3 + 3}{3 + 2} = \dfrac{6}{5} = 1{,}2$.
5. Odgovor: limita je enaka $\frac{6}{5} = 1{,}2$. Funkcija ima v $x = 3$ odpravljivo nezveznost.

### Primer 2

Dana je funkcija
$f(x) = \dfrac{e^{2x} - 1}{x}$ za $x < 0$ in $f(x) = x^2 + a$ za $x \ge 0$.
Določi parameter $a$, da bo $f$ zvezna na vsem $\mathbb{R}$.

**Podatki:** $f(x) = \dfrac{e^{2x} - 1}{x}$ za $x < 0$, $f(x) = x^2 + a$ za $x \ge 0$
**Iščemo:** vrednost parametra $a$

:::formula
$f$ je zvezna v $0$, če je $\lim_{x \to 0^-} f(x) = \lim_{x \to 0^+} f(x) = f(0)$. Znana limita: $\lim_{u \to 0} \dfrac{e^u - 1}{u} = 1$.
:::

**Rešitev:**

1. Za $x < 0$ in za $x > 0$ je $f$ elementarna funkcija, ki je tam definirana, zato je tam zvezna. Preveriti moramo le točko $0$.
2. Leva limita: $\dfrac{e^{2x} - 1}{x} = 2 \cdot \dfrac{e^{2x} - 1}{2x}$. Z $u = 2x \to 0$ dobimo $\lim_{x \to 0^-} f(x) = 2 \cdot 1 = 2$.
3. Desna limita in vrednost: $\lim_{x \to 0^+} (x^2 + a) = a = f(0)$.
4. Pogoj za zveznost: $a = 2$.
5. Odgovor: za $a = 2$ je funkcija zvezna na vsem $\mathbb{R}$; za vsak drug $a$ ima v $0$ skok.

### Primer 3 (težji)

Pokaži, da ima enačba $x^3 + x - 1 = 0$ rešitev na intervalu $[0, 1]$, in jo z bisekcijo v treh korakih zameji na interval dolžine $0{,}125$. Ali je rešitev ena sama? Koliko korakov bisekcije, začetih na $[0, 1]$, je potrebnih, da je ničla zamejena na interval dolžine največ $10^{-3}$?

**Podatki:** $f(x) = x^3 + x - 1$, interval $[0, 1]$, število korakov bisekcije $3$, končna dolžina intervala $0{,}125$, zahtevana natančnost $10^{-3}$
**Iščemo:** dokaz obstoja ničle, interval dolžine $0{,}125$, ki jo vsebuje, ali je ničla enolična, in najmanjše število korakov $n$ za dolžino $\le 10^{-3}$

:::formula
Bolzanov izrek: $f$ zvezna na $[a, b]$ in $f(a) f(b) < 0 \Rightarrow$ obstaja $c \in (a, b)$ z $f(c) = 0$. Bisekcija: $m = \frac{a + b}{2}$, obdržimo polovico, kjer $f$ menja predznak; po $n$ korakih je dolžina intervala $\frac{b - a}{2^n}$.
:::

**Rešitev:**

1. $f$ je polinom, torej zvezna. $f(0) = -1 < 0$ in $f(1) = 1 + 1 - 1 = 1 > 0$. Po Bolzanovem izreku obstaja ničla v $(0, 1)$.
2. Prvi korak: $m = 0{,}5$, $f(0{,}5) = 0{,}125 + 0{,}5 - 1 = -0{,}375 < 0$. Ničla je v $(0{,}5;\ 1)$.
3. Drugi korak: $m = 0{,}75$, $f(0{,}75) = 0{,}421875 + 0{,}75 - 1 = 0{,}171875 > 0$. Ničla je v $(0{,}5;\ 0{,}75)$.
4. Tretji korak: $m = 0{,}625$, $f(0{,}625) = 0{,}244140625 + 0{,}625 - 1 \approx -0{,}1309 < 0$. Ničla je v $(0{,}625;\ 0{,}75)$, ki ima dolžino $0{,}125$.
5. Enoličnost: iz $x_1 < x_2$ sledi $x_1^3 < x_2^3$ in zato $f(x_1) < f(x_2)$; $f$ je strogo naraščajoča na vsem $\mathbb{R}$ in ima največ eno ničlo.
6. Število korakov: zahtevamo $\frac{1 - 0}{2^n} \le 10^{-3}$, torej $2^n \ge 1000$ oziroma $n \ge \log_2 1000 \approx 9{,}97$. Ker je $2^9 = 512 < 1000 \le 1024 = 2^{10}$, je najmanjši $n = 10$.
7. Odgovor: enačba ima natanko eno realno rešitev, ki leži na intervalu $(0{,}625;\ 0{,}75)$ (natančneje $x \approx 0{,}682$); za natančnost $10^{-3}$ je potrebnih $10$ korakov bisekcije.

## Pogoste napake

- **Vstavljanje v nedoločeni izraz.** Študent pri $\frac{0}{0}$ napiše, da je limita $0$ ali $1$. Izraz $\frac{0}{0}$ ni število; najprej ga preoblikuj.
- **$\infty - \infty = 0$ in $1^\infty = 1$.** Oba izraza sta nedoločena. Na primer $\lim_{x \to \infty} (1 + \frac{1}{x})^x = e$, ne $1$.
- **Zamenjava $\frac{\sin x}{x}$ za $x \to \infty$.** Znana limita $1$ velja za $x \to 0$. Za $x \to \infty$ je $\lim \frac{\sin x}{x} = 0$ (izrek o sendviču).
- **Spregledana enostranska limita.** Pri funkcijah s $|x|$, korenom ali s predpisom po kosih vedno preveri levo in desno limito posebej.
- **»Zvezna« pomeni »definirana«.** Funkcija $\frac{1}{x}$ je zvezna na svojem definicijskem območju $\mathbb{R} \setminus \{0\}$, a je na $[-1, 1]$ ne moremo obravnavati kot zvezne, saj v $0$ ni definirana. Bolzanovega izreka zato ne smemo uporabiti: $\frac{1}{x}$ menja predznak, a ničle nima.
- **Pozabljeni pogoji izrekov.** Weierstrassov in Bolzanov izrek potrebujeta zaprt interval in zveznost na vsem intervalu.

## Povzetek

- $\lim_{x \to a} f(x) = L$: ko gre $x \to a$ ($x \neq a$), gre $f(x) \to L$. Limita obstaja, če sta leva in desna limita enaki.
- Pravila za vsoto, produkt in kvocient veljajo, če ne nastane nedoločeni izraz ($\frac{0}{0}$, $\frac{\infty}{\infty}$, $\infty - \infty$, $0 \cdot \infty$, $1^\infty$, $0^0$, $\infty^0$).
- Prijemi: krajšanje, racionalizacija, deljenje z najvišjo potenco, znane limite ($\frac{\sin x}{x}$, $\frac{e^x - 1}{x}$, $(1 + \frac{1}{x})^x$), sendvič.
- $f$ je zvezna v $a$, če je $\lim_{x \to a} f(x) = f(a)$. Elementarne funkcije so zvezne na svojem $D_f$.
- Nezveznosti: odpravljiva, skok, pol.
- Zvezna funkcija na $[a, b]$ je omejena, doseže min in max ter vse vmesne vrednosti (Bolzano: ničla ob menjavi predznaka).

## Za izpit

Znati moraš povedati:

- definicijo limite z $\varepsilon$ in $\delta$, enostranskih limit ter limite v neskončnosti in neskončne limite;
- definicijo zveznosti v točki (vsi trije pogoji) in vrste nezveznosti;
- izrek o sendviču s pogoji z dokazom in dokaz $\lim_{x \to 0} \frac{\sin x}{x} = 1$;
- Weierstrassov izrek, Bolzanov izrek in izrek o vmesni vrednosti z vsemi pogoji, protiprimere, ko pogoj ni izpolnjen, ter dokaz izreka o vmesni vrednosti iz Bolzanovega;
- dokaz limite po definiciji: za dani $\varepsilon$ poiskati $\delta$.

### Naloga 1

Dana je funkcija $f(x) = \dfrac{1 - \cos 2x}{x^2}$ za $x < 0$, $f(0) = a$ in $f(x) = \dfrac{\sqrt{x + 4} - 2}{bx}$ za $x > 0$, kjer je $b \neq 0$. Določi parametra $a$ in $b$, da bo $f$ zvezna na vsem $\mathbb{R}$. Za te vrednosti izračunaj $\lim_{x \to -\infty} f(x)$ in $\lim_{x \to \infty} f(x)$ ter povej, kaj to pomeni za asimptote grafa.

**Rešitev:**

1. Za $x < 0$ in za $x > 0$ je $f$ kvocient zveznih funkcij z neničelnim imenovalcem, zato je tam zvezna. Preveriti moramo le $0$: potrebno je $\lim_{x \to 0^-} f(x) = \lim_{x \to 0^+} f(x) = f(0) = a$.
2. Leva limita je oblike $\frac{0}{0}$. Ker je $1 - \cos 2x = 2\sin^2 x$, je $f(x) = 2\left(\frac{\sin x}{x}\right)^2 \to 2 \cdot 1^2 = 2$ (znana limita in zveznost kvadrata).
3. Desna limita je oblike $\frac{0}{0}$. Racionaliziramo: $\dfrac{\sqrt{x + 4} - 2}{bx} = \dfrac{(x + 4) - 4}{bx\left(\sqrt{x + 4} + 2\right)} = \dfrac{1}{b\left(\sqrt{x + 4} + 2\right)} \to \dfrac{1}{4b}$.
4. Pogoja za zveznost: $a = 2$ in $\frac{1}{4b} = 2$, torej $b = \frac{1}{8}$.
5. $x \to \infty$: $f(x) = \dfrac{8}{\sqrt{x + 4} + 2} \to 0$, ker imenovalec raste čez vse meje.
6. $x \to -\infty$: ker je $0 \le 1 - \cos 2x \le 2$, je $0 \le f(x) \le \frac{2}{x^2}$; ker gre $\frac{2}{x^2} \to 0$, po izreku o sendviču $f(x) \to 0$.
7. Preizkus blizu $0$: $f(-0{,}01) \approx 1{,}99993$ in $f(0{,}01) = \frac{8}{\sqrt{4{,}01} + 2} \approx 1{,}99875$; obe vrednosti sta blizu $2$.
8. Odgovor: $a = 2$ in $b = \frac{1}{8}$; tedaj sta obe limiti v neskončnosti enaki $0$, zato je $y = 0$ vodoravna asimptota na obeh straneh, navpične asimptote pa graf nima, ker je $f$ zvezna na vsem $\mathbb{R}$.

### Naloga 2

Natančno navedi Bolzanov izrek. Utemelji, ali ostane resničen, če zveznost na $[a, b]$ nadomestimo z zveznostjo na odprtem intervalu $(a, b)$. Nato dokaži, da ima vsak polinom lihe stopnje z realnimi koeficienti vsaj eno realno ničlo.

**Rešitev:**

1. Bolzanov izrek: naj bo $f$ zvezna na zaprtem intervalu $[a, b]$ in $f(a) \cdot f(b) < 0$. Tedaj obstaja $c \in (a, b)$ z $f(c) = 0$.
2. Ne ostane. Naj bo $f(0) = -1$ in $f(x) = 1$ za $0 < x \le 1$. Funkcija je na $(0, 1)$ konstantna, torej zvezna, in $f(0) \cdot f(1) = -1 < 0$, ničle pa nima. Pokvari jo skok v krajišču $0$.
3. Naj bo $p(x) = a_n x^n + \dots + a_1 x + a_0$, $n$ lih in $a_n \neq 0$; brez škode $a_n > 0$ (sicer obravnavamo $-p$, ki ima iste ničle).
4. Za $x \neq 0$ je $p(x) = a_n x^n \left(1 + \frac{a_{n-1}}{a_n x} + \dots + \frac{a_0}{a_n x^n}\right)$, oklepaj pa gre proti $1$, ko gre $x \to \pm\infty$.
5. Ker je $n$ lih, gre $x^n \to \infty$ za $x \to \infty$ in $x^n \to -\infty$ za $x \to -\infty$. Za dovolj velik $M > 0$ je oklepaj pri $\pm M$ pozitiven, zato je $p(M) > 0$ in $p(-M) < 0$.
6. Polinom je zvezen na $[-M, M]$ in $p(-M) \cdot p(M) < 0$, zato po Bolzanovem izreku obstaja $c \in (-M, M)$ s $p(c) = 0$.
7. Odgovor: izrek brez zveznosti v krajiščih ne velja; polinom lihe stopnje ima vsaj eno realno ničlo (za sode stopnje to ne velja, npr. $x^2 + 1$).

### Naloga 3

Po definiciji z $\varepsilon$ in $\delta$ dokaži, da je $\lim_{x \to 3} x^2 = 9$, in za $\varepsilon = 0{,}1$ navedi ustrezen $\delta$.

**Rešitev:**

1. Ocenjujemo $|x^2 - 9| = |x - 3| \cdot |x + 3|$.
2. Najprej se omejimo na $\delta \le 1$: iz $|x - 3| < 1$ sledi $2 < x < 4$ in zato $|x + 3| < 7$.
3. Tedaj je $|x^2 - 9| < 7|x - 3|$. Za dani $\varepsilon > 0$ izberemo $\delta = \min\left(1, \frac{\varepsilon}{7}\right)$.
4. Če je $0 < |x - 3| < \delta$, velja $|x^2 - 9| < 7\delta \le \varepsilon$. S tem je limita dokazana. $\square$
5. Za $\varepsilon = 0{,}1$: $\delta = \min\left(1, \frac{0{,}1}{7}\right) = \frac{1}{70} \approx 0{,}0143$.
6. Preizkus na robu: za $x = 3 + \frac{1}{70}$ je $x^2 - 9 = \frac{6}{70} + \frac{1}{4900} \approx 0{,}0859 < 0{,}1$ ✓.
7. Odgovor: $\delta = \min\left(1, \frac{\varepsilon}{7}\right)$ ustreza vsakemu $\varepsilon > 0$; za $\varepsilon = 0{,}1$ zadošča $\delta = \frac{1}{70}$.

## Drugače: Na sliki

Nariši graf $f(x) = \frac{x^2 - 9}{x^2 - x - 6}$ iz Primera 1. Po krajšanju je to $\frac{x + 3}{x + 2}$, hiperbola z navpično asimptoto $x = -2$ in vodoravno $y = 1$. V točki $(3;\ 1{,}2)$ pa je **luknja**: prazen krožec, ker prvotna funkcija tam ni definirana. Limita gleda, kam »kaže« krivulja ob luknji, zato je $1{,}2$.

Pri **skoku** se graf pretrga: leva veja se konča na eni višini, desna se začne na drugi. Pri **polu** gre graf ob navpični asimptoti proti $+\infty$ ali $-\infty$.

Bolzanov izrek si predstavljaj kot reko: če je ena točka pod gladino ($f(a) < 0$), druga nad njo ($f(b) > 0$), moraš z neprekinjeno potjo vmes vsaj enkrat prečkati gladino $y = 0$.

## Drugače: Uporaba v stroki

**Farmakokinetika.** Pri infuziji s stalno hitrostjo je koncentracija zdravila v plazmi $c(t) = c_\infty (1 - e^{-kt})$. Ker je $\lim_{t \to \infty} e^{-kt} = 0$, je $\lim_{t \to \infty} c(t) = c_\infty$: **stacionarna koncentracija**, ki je infuzija nikoli povsem ne doseže. Po štirih razpolovnih časih je dosežen delež $1 - 2^{-4} \approx 94\,\%$, po petih približno $97\,\%$; zato v klinični praksi velja pravilo »stacionarno stanje po 4–5 razpolovnih časih«.

**Encimska kinetika.** Hitrost reakcije je $v(S) = \frac{v_{\max} S}{K_M + S}$ in $\lim_{S \to \infty} v = v_{\max}$. Te limite v laboratoriju ne izmerimo neposredno, ker bi potrebovali neskončno koncentracijo substrata. Zato meritve prikažemo kot $\frac{1}{v} = \frac{K_M}{v_{\max}}\cdot\frac{1}{S} + \frac{1}{v_{\max}}$ (Lineweaver-Burk): ko gre $\frac{1}{S} \to 0$, premica seka navpično os pri $\frac{1}{v_{\max}}$.

**Fazni prehodi.** Gostota vode pri tlaku $1\,\mathrm{atm}$ ima pri $100\,^\circ\mathrm{C}$ skok: tekočina ima okoli $958\,\mathrm{kg/m^3}$, para okoli $0{,}6\,\mathrm{kg/m^3}$. Tudi entalpija ima tam skok (izparilna toplota), ki ga v kalorimetriji izmerimo kot vrh toplotnega toka.

**Numerični reševalniki.** Pri računanju pH raztopine šibke kisline iščemo ničlo zvezne funkcije bilance nabojev v odvisnosti od $[\mathrm{H_3O^+}]$. Ko ima funkcija v krajiščih intervala različna predznaka, Bolzanov izrek zagotavlja rešitev, bisekcija (ali Brentova metoda, ki jo uporablja kot varovalo) pa jo zanesljivo najde.

## Drugače: Korak za korakom s številkami

Izračunajmo $\lim_{x \to \infty} \left(\sqrt{x^2 + 4x} - x\right)$.

1. **Vrsta izraza.** Za velike $x$ gresta oba člena proti $\infty$: nedoločeni izraz $\infty - \infty$.
2. **Številčni občutek.** Za $x = 100$: $\sqrt{10\,400} - 100 \approx 101{,}980 - 100 = 1{,}980$. Za $x = 10\,000$: $\sqrt{100\,040\,000} - 10\,000 \approx 1{,}9998$. Slutimo limito $2$.
3. **Racionalizacija.** Pomnožimo in delimo s $\sqrt{x^2 + 4x} + x$:
$$\sqrt{x^2 + 4x} - x = \frac{(x^2 + 4x) - x^2}{\sqrt{x^2 + 4x} + x} = \frac{4x}{\sqrt{x^2 + 4x} + x}.$$
4. **Deljenje z $x$** (za $x > 0$ je $\sqrt{x^2} = x$): $\dfrac{4}{\sqrt{1 + \frac{4}{x}} + 1}$.
5. **Limita.** $\frac{4}{x} \to 0$, zato izraz gre proti $\frac{4}{\sqrt{1} + 1} = \frac{4}{2} = 2$.
6. **Preizkus.** Rezultat se ujema s številčno oceno iz koraka 2.

## Drugače: Bolj natančno

**Definicija limite (ε-δ).** Naj bo $f$ definirana na okolici točke $a$, razen morda v $a$. Pravimo, da je $\lim_{x \to a} f(x) = L$, če

$$\forall \varepsilon > 0 \ \exists \delta > 0 : \ 0 < |x - a| < \delta \Rightarrow |f(x) - L| < \varepsilon.$$

Pogoj $0 < |x - a|$ izloči točko $a$ samo: limita ne vidi vrednosti $f(a)$. Negacija definicije pove, kdaj $L$ **ni** limita: obstaja $\varepsilon > 0$, da v vsaki okolici $a$ najdemo $x \neq a$ z $|f(x) - L| \ge \varepsilon$.

**Heinejeva definicija.** Ekvivalentno: $\lim_{x \to a} f(x) = L$ natanko tedaj, ko za vsako zaporedje $x_n \to a$, $x_n \neq a$, velja $f(x_n) \to L$. S tem pokažemo, da limita ne obstaja: za $f(x) = \sin\frac{1}{x}$ dobimo z zaporedjema $x_n = \frac{1}{n\pi}$ in $y_n = \frac{1}{\pi/2 + 2n\pi}$ limiti $0$ in $1$.

**Ideja dokaza Bolzanovega izreka.** Bisekcija da zaporedje vloženih intervalov $[a_n, b_n]$ z dolžinami $\frac{b - a}{2^n}$, na katerih $f$ menja predznak. Po aksiomu polnosti realnih števil imata zaporedji $(a_n)$ in $(b_n)$ skupno limito $c$. Zaradi zveznosti je $f(c) = \lim f(a_n) \le 0$ in $f(c) = \lim f(b_n) \ge 0$, torej $f(c) = 0$.

## Preveri se

? Koliko je $\displaystyle \lim_{x \to 0} \frac{\sin 5x}{x}$?
- $1$
+ $5$
- $0$
~ $\sin 5x \to 0$, a tudi imenovalec gre proti $0$: to je nedoločeni izraz $\frac{0}{0}$.
> $\frac{\sin 5x}{x} = 5 \cdot \frac{\sin 5x}{5x} \to 5 \cdot 1 = 5$.

? Koliko je $\displaystyle \lim_{x \to \infty} \frac{3x^2 - x}{2x^2 + 7}$?
+ $\frac{3}{2}$
- $0$
~ Limita $0$ bi bila, če bi imel imenovalec višjo stopnjo.
- $\infty$
~ Števec res raste čez vse meje, a imenovalec enako hitro.
> Stopnji števca in imenovalca sta enaki, zato je limita kvocient vodilnih koeficientov $\frac{3}{2}$.

? Kateri izraz **ni** nedoločen?
- $\frac{0}{0}$
- $1^\infty$
+ $\infty + \infty$
> Vsota dveh količin, ki rasteta čez vse meje, prav tako raste čez vse meje: $\infty + \infty = \infty$. Izraza $\frac{0}{0}$ in $1^\infty$ sta nedoločena.

? Funkcija $f(x) = \frac{x^2 - 1}{x - 1}$ v $x = 1$ ni definirana. Kakšno vrednost moramo predpisati $f(1)$, da bo $f$ zvezna?
- $0$
- $1$
+ $2$
> Za $x \neq 1$ je $f(x) = x + 1$, zato je $\lim_{x \to 1} f(x) = 2$. Nezveznost je odpravljiva.

:::simboli
f | funkcija | |
x | neodvisna spremenljivka | |
a | točka, ki se ji x približuje | | | pri intervalu [a, b] levo krajišče
L | limita funkcije v točki a | \lim_{x \to a} f(x) = L |
e | Eulerjevo število | | | e ≈ 2,718
\varepsilon | dovoljeno odstopanje od limite L | | | poljubno majhno pozitivno število
\delta | polmer okolice točke a | | | odvisen od izbranega ε
u | pomožna spremenljivka | | | u → 0
b | desno krajišče intervala [a, b] | |
c | ničla funkcije na intervalu (a, b) | | | obstaja po Bolzanovem izreku
m | razpolovišče intervala | m = \frac{a + b}{2} | | metoda bisekcije
n | število korakov bisekcije | \frac{b - a}{2^n} | | v nalogi 2 stopnja polinoma
M | meja | | | pri limiti v neskončnosti: x > M
:::
