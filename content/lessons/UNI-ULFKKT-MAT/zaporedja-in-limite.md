---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Zaporedja srečamo povsod, kjer nekaj opazujemo v korakih: stanje na varčevalnem računu po letih, število bakterij po vsaki generaciji, količina zdravila v telesu po vsakem odmerku, približki rešitve enačbe, ki jih računalnik računa korak za korakom. Pogosto nas ne zanima toliko posamezen člen kot to, **kam se zaporedje ustali**: kolikšna bo ravnovesna količina zdravila, ali numerična metoda res pripelje do rešitve, kolikšna je meja rasti.

Limita zaporedja je najpreprostejša oblika limite. Na njej gradimo limite funkcij, zveznost, vrste in integral. Zaporedje $\left(1 + \frac{1}{n}\right)^n$ nas pripelje do števila $e$, osnove naravnega logaritma in eksponentne funkcije, ki opisuje rast, razpad in obrestovanje.

Pot bo takšna: najprej natančno povemo, kaj pomeni, da zaporedje **konvergira**, in se naučimo računati limite. Nato pokažemo, zakaj **monotona in omejena** zaporedja vedno konvergirajo, in s tem pridemo do **števila $e$**. Na koncu s **Cauchyjevimi zaporedji** dokažemo konvergenco, ne da bi limito sploh poznali.

## Razlaga

**1. Zaporedje.** **Zaporedje** realnih števil je funkcija $a\colon \mathbb{N} \to \mathbb{R}$; vrednosti $a_1, a_2, a_3, \dots$ so **členi**, $a_n$ je **splošni člen**. Zaporedje je podano s formulo za splošni člen (npr. $a_n = \frac{1}{n}$) ali **rekurzivno**, z začetnim členom in pravilom za naslednjega (npr. $a_1 = 1$, $a_{n+1} = 2a_n + 1$).

Iz srednje šole poznaš dva posebna primera. **Aritmetično zaporedje** ima stalno razliko $d$ med zaporednima členoma: $a_n = a_1 + (n - 1)d$. **Geometrijsko zaporedje** ima stalen kvocient $q$: $a_n = a_1 q^{n-1}$. Geometrijsko zaporedje opisuje vsako rast ali upadanje za stalen odstotek v enakih časovnih korakih, na primer razmnoževanje bakterij ali radioaktivni razpad, merjen v razpolovnih časih. Vsota prvih $n$ členov geometrijskega zaporedja je $S_n = a_1\frac{1 - q^n}{1 - q}$ za $q \neq 1$; ker gre $q^n \to 0$ za $|q| < 1$, gre $S_n \to \frac{a_1}{1 - q}$. Tako je na primer $1 + \frac{1}{2} + \frac{1}{4} + \dots = 2$.

**2. Omejenost in monotonost.** Zaporedje je

- **navzgor omejeno**, če obstaja $M$ z $a_n \le M$ za vse $n$; **navzdol omejeno**, če obstaja $m$ z $a_n \ge m$; **omejeno**, če je oboje,
- **naraščajoče**, če je $a_{n+1} \ge a_n$ za vse $n$, in **padajoče**, če je $a_{n+1} \le a_n$; **monotono**, če je eno ali drugo.

Monotonost preverimo z razliko $a_{n+1} - a_n$ (predznak) ali pri pozitivnih členih s kvocientom $\frac{a_{n+1}}{a_n}$ (večji ali manjši od $1$). Pri rekurzivnih zaporedjih pogosto uporabimo **matematično indukcijo**.

Število $s$ je **natančna zgornja meja** ali supremum zaporedja, $s = \sup a_n$, če je $s$ zgornja meja ($a_n \le s$ za vse $n$) in nobeno manjše število ni zgornja meja: za vsak $\varepsilon > 0$ obstaja $n$ z $a_n > s - \varepsilon$. Podobno je infimum $\inf a_n$ največja spodnja meja. **Aksiom o supremumu** (polnost $\mathbb{R}$): vsaka neprazna navzgor omejena podmnožica $\mathbb{R}$ ima supremum v $\mathbb{R}$.

**3. Limita zaporedja.** **Definicija.** Naj bo $(a_n)$ zaporedje realnih števil in $L \in \mathbb{R}$. Število $L$ je **limita** zaporedja $(a_n)$, če za vsak $\varepsilon > 0$ obstaja $N \in \mathbb{N}$, da je

$$|a_n - L| < \varepsilon \quad \text{za vse } n \ge N.$$

Ohlapno: od nekega indeksa naprej so vsi členi poljubno blizu $L$. Pišemo $\lim_{n \to \infty} a_n = L$ ali $a_n \to L$. Zaporedje z limito je **konvergentno**, sicer je **divergentno**. Interval $(L - \varepsilon, L + \varepsilon)$ je **$\varepsilon$-okolica** limite: zunaj nje je le končno mnogo členov.

Primeri divergence: $a_n = n$ gre čez vse meje (pišemo $a_n \to \infty$, a to ni konvergenca), $a_n = (-1)^n$ skače med $-1$ in $1$.

:::premisli
Zaporedje $a_n = \frac{(-1)^n}{n}$ menja predznak prav tako kot $(-1)^n$. Ali kljub temu konvergira, in če, h kateri limiti?
---
Konvergira k $0$. Členi skačejo z ene strani ničle na drugo, a je $|a_n - 0| = \frac{1}{n} < \varepsilon$ za vse $n > \frac{1}{\varepsilon}$. Menjavanje predznaka samo po sebi ne pomeni divergence; $(-1)^n$ divergira, ker se skoki ne manjšajo.
:::

**Izrek (enoličnost).** Konvergentno zaporedje ima natanko eno limito. *Dokaz.* Naj bo $a_n \to L_1$ in $a_n \to L_2$ z $L_1 \ne L_2$. Za $\varepsilon = \frac{|L_1 - L_2|}{2}$ obstajata $N_1$ in $N_2$ iz definicije; za $n \ge \max\{N_1, N_2\}$ je $|L_1 - L_2| \le |L_1 - a_n| + |a_n - L_2| < 2\varepsilon = |L_1 - L_2|$, protislovje. $\square$ Sprememba končno mnogo členov limite ne spremeni (le $N$ povečamo).

**4. Pravila za računanje.** **Izrek.** Naj bosta $(a_n)$ in $(b_n)$ konvergentni, $a_n \to A$ in $b_n \to B$. Potem je

$$a_n \pm b_n \to A \pm B, \quad a_n b_n \to AB, \quad \frac{a_n}{b_n} \to \frac{A}{B} \ \text{če je } B \neq 0.$$

(Pri $B \ne 0$ je $b_n \ne 0$ od nekega indeksa naprej.) *Dokaz za vsoto.* Za $\varepsilon > 0$ izberemo $N_1$ z $|a_n - A| < \frac{\varepsilon}{2}$ za $n \ge N_1$ in $N_2$ z $|b_n - B| < \frac{\varepsilon}{2}$ za $n \ge N_2$. Za $n \ge \max\{N_1, N_2\}$ je $|(a_n + b_n) - (A + B)| \le |a_n - A| + |b_n - B| < \varepsilon$. Pri produktu uporabimo $a_n b_n - AB = a_n(b_n - B) + B(a_n - A)$ in omejenost $(a_n)$ (točka 5). $\square$

Za racionalne izraze v $n$ delimo z najvišjo potenco $n$ v imenovalcu, ker gre $\frac{1}{n^k} \to 0$ za $k > 0$.

**Izrek o sendviču.** Naj velja $b_n \le a_n \le c_n$ za vse $n \ge n_0$ in $\lim b_n = \lim c_n = L$. Potem je $(a_n)$ konvergentno in $\lim a_n = L$. *Dokaz.* Za $\varepsilon > 0$ obstaja $N \ge n_0$, da je $b_n > L - \varepsilon$ in $c_n < L + \varepsilon$ za vse $n \ge N$. Tedaj je $L - \varepsilon < b_n \le a_n \le c_n < L + \varepsilon$, torej $|a_n - L| < \varepsilon$. $\square$

**Pomembne limite:**

- $q^n \to 0$ za $|q| < 1$; $q^n \to \infty$ za $q > 1$; za $q \le -1$ divergira,
- $\sqrt[n]{a} \to 1$ za $a > 0$ in $\sqrt[n]{n} \to 1$,
- $\frac{n^k}{a^n} \to 0$ za $a > 1$ (eksponentna funkcija raste hitreje od vsake potence),
- $\frac{a^n}{n!} \to 0$ (fakulteta raste hitreje od eksponentne).

*Dokaz za $q^n \to 0$ pri $0 < |q| < 1$.* Pišemo $\frac{1}{|q|} = 1 + h$ s $h > 0$. Po Bernoullijevi neenakosti, $(1 + h)^n \ge 1 + nh$ za $h > -1$ (dokaz z indukcijo), je $(1 + h)^n > nh$, zato $0 < |q^n - 0| = |q|^n < \frac{1}{nh}$, in po sendviču $q^n \to 0$. $\square$

**5. Konvergentna zaporedja so omejena.** **Izrek.** Vsako konvergentno zaporedje je omejeno. *Dokaz.* Naj bo $a_n \to L$. Za $\varepsilon = 1$ obstaja $N$, da je $|a_n - L| < 1$ za $n \ge N$, torej $|a_n| < |L| + 1$. Tedaj je $|a_n| \le M = \max\{|a_1|, \dots, |a_{N-1}|, |L| + 1\}$ za vse $n$. $\square$ Obratno ne velja: $(-1)^n$ je omejeno, a ne konvergira.

**6. Monotona in omejena zaporedja.** **Izrek.** Naj bo $(a_n)$ naraščajoče in navzgor omejeno. Potem je konvergentno in $\lim a_n = \sup a_n$. Enako je padajoče in navzdol omejeno zaporedje konvergentno z limito $\inf a_n$.

*Dokaz.* Množica členov je neprazna in navzgor omejena, zato $s = \sup a_n$ obstaja po aksiomu o supremumu. Naj bo $\varepsilon > 0$. Ker $s - \varepsilon$ ni zgornja meja, obstaja $N$ z $a_N > s - \varepsilon$. Za $n \ge N$ je zaradi naraščanja $s - \varepsilon < a_N \le a_n \le s$, torej $|a_n - s| < \varepsilon$. $\square$

Izrek je zelo uporaben pri rekurzivnih zaporedjih: najprej pokažemo, da limita obstaja (monotonost in omejenost), nato jo izračunamo iz enačbe, ki jo dobimo, ko v rekurzivni formuli vse člene nadomestimo z $L$.

**7. Število $e$.** Zaporedje $e_n = \left(1 + \frac{1}{n}\right)^n$ je naraščajoče in navzgor omejeno s $3$, zato konvergira. Njegova limita je **Eulerjevo število**

$$e = \lim_{n \to \infty}\left(1 + \frac{1}{n}\right)^n \approx 2{,}718\,28.$$

*Dokaz omejenosti in naraščanja.* Po binomskem izreku je

$$e_n = \sum_{k=0}^{n} \binom{n}{k}\frac{1}{n^k} = \sum_{k=0}^{n} \frac{1}{k!}\left(1 - \frac{1}{n}\right)\left(1 - \frac{2}{n}\right)\cdots\left(1 - \frac{k-1}{n}\right) \le \sum_{k=0}^{n} \frac{1}{k!}.$$

Ker je $k! \ge 2^{k-1}$, je to največ $1 + 1 + \frac{1}{2} + \frac{1}{4} + \dots < 3$. Pri večjem $n$ je vsak faktor $1 - \frac{j}{n}$ večji in pozitivnih členov vsote je več, zato je $e_{n+1} > e_n$. $\square$

Velja tudi $\lim_{n \to \infty}\left(1 + \frac{x}{n}\right)^n = e^x$ za vsak realni $x$. Pri izrazih oblike $1^\infty$ zato poskusimo dobiti obliko $\left(1 + \frac{1}{m}\right)^m$.

:::premisli
Za $|q| < 1$ gre $q^n \to 0$. Osnova izraza $\left(1 - \frac{1}{n}\right)^n$ je za vsak $n$ manjša od $1$. Ali gre tudi ta izraz proti $0$?
---
Ne, gre proti $e^{-1} \approx 0{,}368$ (zgornja formula pri $x = -1$); pri $n = 100$ je $0{,}99^{100} \approx 0{,}366$. Pravilo $q^n \to 0$ velja za *stalno* osnovo $q$. Tu se osnova z rastočim $n$ približuje $1$, zato gre za nedoločeno obliko $1^\infty$.
:::

**8. Podzaporedja in stekališča.** Naj bo $n_1 < n_2 < n_3 < \dots$ naraščajoče zaporedje naravnih števil. Zaporedje $(a_{n_k})_k$ je **podzaporedje** zaporedja $(a_n)$. **Trditev.** Če je $a_n \to L$, gre proti $L$ tudi vsako podzaporedje. *Dokaz.* Naj bo $\varepsilon > 0$ in $N$ kot v definiciji limite. Ker indeksi strogo naraščajo, je $n_k \ge k$, zato za $k \ge N$ velja $n_k \ge N$ in zato $|a_{n_k} - L| < \varepsilon$. $\square$ Število $s$ je **stekališče**, če je limita nekega podzaporedja. Zaporedje $(-1)^n$ ima stekališči $-1$ in $1$, zato po trditvi ne konvergira. **Bolzano-Weierstrassov izrek:** vsako omejeno zaporedje realnih števil ima vsaj eno konvergentno podzaporedje.

**9. Cauchyjeva zaporedja.** **Definicija.** Zaporedje $(a_n)$ je **Cauchyjevo**, če za vsak $\varepsilon > 0$ obstaja $N$, da je

$$|a_m - a_n| < \varepsilon \quad \text{za vse } m, n \ge N.$$

Členi so torej od nekega indeksa naprej poljubno blizu drug drugemu. **Cauchyjev kriterij.** Zaporedje realnih števil je konvergentno natanko tedaj, ko je Cauchyjevo. *Dokaz smeri »konvergentno ⇒ Cauchyjevo«.* Naj bo $a_n \to L$ in $\varepsilon > 0$. Za $\frac{\varepsilon}{2}$ obstaja $N$ z $|a_n - L| < \frac{\varepsilon}{2}$ za $n \ge N$; za $m, n \ge N$ je $|a_m - a_n| \le |a_m - L| + |L - a_n| < \varepsilon$. $\square$ Obratna smer potrebuje polnost $\mathbb{R}$ (glej Bolj natančno). Prednost kriterija: konvergenco lahko dokažemo, ne da bi poznali limito. V racionalnih številih to ne velja: približki $1$; $1{,}4$; $1{,}41$; $1{,}414$; ... za $\sqrt{2}$ so Cauchyjevo zaporedje racionalnih števil, njihova limita pa ni racionalna.

## Rešeni primeri

### Primer 1 (lažji)

Izračunaj $\displaystyle \lim_{n \to \infty} \frac{3n^2 - n + 2}{5n^2 + 4}$.

**Podatki:** $a_n = \dfrac{3n^2 - n + 2}{5n^2 + 4}$
**Iščemo:** $\lim_{n \to \infty} a_n$

:::formula
Števec in imenovalec delimo z najvišjo potenco v imenovalcu ($n^2$) in uporabimo $\frac{1}{n^k} \to 0$ za $k > 0$.
:::

**Rešitev:**

1. Delimo z $n^2$: $a_n = \dfrac{3 - \frac{1}{n} + \frac{2}{n^2}}{5 + \frac{4}{n^2}}$.
2. Ko $n \to \infty$, gredo $\frac{1}{n}$, $\frac{2}{n^2}$ in $\frac{4}{n^2}$ proti $0$.
3. Po pravilih za limite: $a_n \to \dfrac{3 - 0 + 0}{5 + 0} = \dfrac{3}{5}$.
4. Preizkus: za $n = 10^6$ je $a_n \approx 0{,}5999998$.
5. Odgovor: limita je $\frac{3}{5} = 0{,}6$.

### Primer 2

Dokaži po definiciji, da je $\displaystyle \lim_{n \to \infty} \frac{2n + 1}{n + 3} = 2$, in poišči najmanjši $N$, od katerega naprej je $|a_n - 2| < 0{,}01$.

**Podatki:** $a_n = \dfrac{2n + 1}{n + 3}$, domnevna limita $L = 2$, $\varepsilon = 0{,}01$
**Iščemo:** dokaz konvergence in najmanjši indeks $N$

:::formula
$a_n \to L \iff \forall \varepsilon > 0\ \exists N:\ n \ge N \Rightarrow |a_n - L| < \varepsilon$
:::

**Rešitev:**

1. Razlika: $a_n - 2 = \dfrac{2n + 1 - 2(n + 3)}{n + 3} = \dfrac{-5}{n + 3}$, torej $|a_n - 2| = \dfrac{5}{n + 3}$.
2. Splošno: $\frac{5}{n + 3} < \varepsilon \iff n > \frac{5}{\varepsilon} - 3$. Za vsak $\varepsilon > 0$ torej obstaja ustrezen $N$, zato je limita $2$.
3. Za $\varepsilon = 0{,}01$: $n > \frac{5}{0{,}01} - 3 = 500 - 3 = 497$.
4. Preizkus: za $n = 497$ je $|a_n - 2| = \frac{5}{500} = 0{,}01$, kar ni strogo manjše od $0{,}01$; za $n = 498$ je $\frac{5}{501} \approx 0{,}00998 < 0{,}01$. Ker $\frac{5}{n + 3}$ pada, velja neenakost tudi za vse večje $n$.
5. Odgovor: limita je $2$; od indeksa $N = 498$ naprej so vsi členi za manj kot $0{,}01$ oddaljeni od $2$.

### Primer 3 (težji)

Zaporedje je podano rekurzivno z $a_1 = c$ in $a_{n+1} = \sqrt{2 + a_n}$, kjer je $c \ge 0$ realen parameter. Za katere $c$ je zaporedje monotono naraščajoče in za katere padajoče? Dokaži, da za vsak $c \ge 0$ konvergira, in izračunaj limito. Zapiši prve člene za $c = 1$ in $c = 7$.

**Podatki:** $a_1 = c \ge 0$, $a_{n+1} = \sqrt{2 + a_n}$
**Iščemo:** monotonost v odvisnosti od $c$, dokaz konvergence in $L = \lim_{n \to \infty} a_n$

:::formula
Monotono in omejeno zaporedje konvergira. Limito dobimo iz enačbe $L = \sqrt{2 + L}$.
:::

**Rešitev:**

1. Vsi členi so nenegativni: $a_1 = c \ge 0$, in če je $a_n \ge 0$, je $a_{n+1} = \sqrt{2 + a_n} \ge \sqrt{2} > 0$. Zaporedje je torej dobro definirano.
2. Ključna enakost (racionalizacija): $a_{n+1} - 2 = \sqrt{2 + a_n} - 2 = \dfrac{a_n - 2}{\sqrt{2 + a_n} + 2}$. Imenovalec je pozitiven, zato imata $a_{n+1} - 2$ in $a_n - 2$ enak predznak. Z indukcijo: če je $c < 2$, je $a_n < 2$ za vse $n$; če je $c > 2$, je $a_n > 2$ za vse $n$; pri $c = 2$ je $a_n = 2$ za vse $n$.
3. Monotonost: $a_{n+1} > a_n \iff 2 + a_n > a_n^2 \iff (2 - a_n)(1 + a_n) > 0 \iff a_n < 2$, ker je $1 + a_n > 0$. Za $c < 2$ zaporedje torej narašča, za $c > 2$ pada.
4. Konvergenca: za $c < 2$ je naraščajoče in navzgor omejeno z $2$, za $c > 2$ padajoče in navzdol omejeno z $2$. V obeh primerih po izreku o monotonih zaporedjih konvergira k nekemu $L \ge 0$.
5. Rekurzivno formulo kvadriramo, $a_{n+1}^2 = 2 + a_n$, in po pravilih za limite preidemo k limiti (tudi $a_{n+1} \to L$): $L^2 = 2 + L$, torej $L^2 - L - 2 = 0$, $(L - 2)(L + 1) = 0$. Rešitev $L = -1$ odpade, ker je $L \ge 0$. Ostane $L = 2$.
6. Za $c = 1$: $a_2 = \sqrt{3} \approx 1{,}7321$, $a_3 = \sqrt{3{,}7321} \approx 1{,}9319$, $a_4 \approx 1{,}9829$, $a_5 \approx 1{,}9957$ (narašča). Za $c = 7$: $a_2 = \sqrt{9} = 3$, $a_3 = \sqrt{5} \approx 2{,}2361$, $a_4 \approx 2{,}0582$ (pada).
7. Odgovor: za $0 \le c < 2$ zaporedje narašča, za $c > 2$ pada, za $c = 2$ je konstantno; za vsak $c \ge 0$ konvergira k $L = 2$.

## Pogoste napake

- **Računanje limite, preden vemo, da obstaja.** Pri $a_1 = 1$, $a_{n+1} = 2a_n + 1$ enačba $L = 2L + 1$ da $L = -1$, a zaporedje $1, 3, 7, 15, \dots$ gre proti $\infty$. Najprej dokaži konvergenco.
- **$1^\infty = 1$.** $\left(1 + \frac{1}{n}\right)^n \to e \approx 2{,}718$, ne $1$. Osnova gre proti $1$, eksponent pa raste, in oba učinka sta pomembna.
- **Omejenost zadošča za konvergenco.** $(-1)^n$ je omejeno, a divergira. Potrebna je še monotonost (ali drug argument).
- **$N$, ki je odvisen od $n$.** V definiciji limite je $N$ lahko odvisen od $\varepsilon$, nikakor pa ne od $n$.
- **Deljenje z napačno potenco.** Pri $\frac{n^2 + 1}{2n^3 - n}$ delimo z $n^3$ (najvišja potenca v imenovalcu); limita je $0$, ne $\frac{1}{2}$.
- **$\sqrt[n]{n} \to \infty$.** Čeprav $n$ raste, koren $n$-te stopnje raste počasneje; limita je $1$.

## Povzetek

- $a_n \to L$: za vsak $\varepsilon > 0$ obstaja $N$, da je $|a_n - L| < \varepsilon$ za $n \ge N$.
- Konvergentno zaporedje je omejeno; limita je enolična.
- Pravila za vsoto, produkt in kvocient; deljenje z najvišjo potenco; sendvič.
- Pomembne limite: $q^n \to 0$ ($|q| < 1$), $\sqrt[n]{n} \to 1$, $\frac{n^k}{a^n} \to 0$ ($a > 1$).
- Monotono in omejeno zaporedje konvergira; limito rekurzivnega zaporedja dobimo iz $L = f(L)$.
- $e = \lim \left(1 + \frac{1}{n}\right)^n \approx 2{,}718$, $\left(1 + \frac{x}{n}\right)^n \to e^x$.
- Cauchyjevo zaporedje: členi so poljubno blizu drug drugemu; v $\mathbb{R}$ je to enakovredno konvergenci.

## Za izpit

Znati moraš povedati:

- definicijo limite zaporedja ($\varepsilon$–$N$) in dokaz enoličnosti limite;
- izrek, da je konvergentno zaporedje omejeno, z dokazom, in protiprimer za obrat;
- pravila za limito vsote, produkta in kvocienta (s pogojem $B \ne 0$) ter izrek o sendviču z dokazom;
- izrek o monotonem in omejenem zaporedju z dokazom (aksiom o supremumu) in postopek za rekurzivna zaporedja;
- definicijo števila $e$ in dokaz, da je $\left(1 + \frac{1}{n}\right)^n$ naraščajoče in omejeno s $3$;
- definicijo Cauchyjevega zaporedja, Cauchyjev kriterij in dokaz smeri »konvergentno ⇒ Cauchyjevo«.

### Naloga 1

Zaporedje je podano z $a_1 = c$ in $a_{n+1} = \dfrac{a_n^2 + 3}{4}$, kjer je $c \ge 0$. Za katere $c$ zaporedje konvergira in kolikšna je tedaj limita? Kaj se zgodi pri ostalih $c$?

**Rešitev:**

1. Možne limite: če $a_n \to L$, je $L = \frac{L^2 + 3}{4}$, torej $L^2 - 4L + 3 = 0$ in $L \in \{1, 3\}$.
2. Razlika zaporednih členov: $a_{n+1} - a_n = \dfrac{a_n^2 - 4a_n + 3}{4} = \dfrac{(a_n - 1)(a_n - 3)}{4}$.
3. Funkcija $f(x) = \frac{x^2 + 3}{4}$ na $[0, \infty)$ narašča, $f(1) = 1$ in $f(3) = 3$. Zato z indukcijo: iz $0 \le a_n < 1$ sledi $\frac{3}{4} \le a_{n+1} < 1$, iz $1 < a_n < 3$ sledi $1 < a_{n+1} < 3$, iz $a_n > 3$ sledi $a_{n+1} > 3$.
4. $0 \le c < 1$: vsi členi so v $[0, 1)$, razlika iz koraka 2 je pozitivna, zaporedje narašča in je omejeno z $1$. Konvergira k $L \le 1$, torej $L = 1$. Za $c = 0$: $0$; $0{,}75$; $0{,}890625$; $0{,}9483$ in tako naprej.
5. $1 < c < 3$: vsi členi so v $(1, 3)$, razlika je negativna, zaporedje pada in je navzdol omejeno z $1$. Konvergira k $L \le c < 3$, torej $L = 1$.
6. $c = 1$ ali $c = 3$: zaporedje je konstantno z limito $c$.
7. $c > 3$: vsi členi so večji od $3$, razlika je pozitivna, zaporedje narašča. Če bi konvergiralo, bi bila limita $L \ge c > 3$, kar ni ne $1$ ne $3$. Naraščajoče zaporedje, ki ne konvergira, ni navzgor omejeno, zato $a_n \to \infty$. Za $c = 4$: $4$; $4{,}75$; $6{,}390625$ in tako naprej.
8. Odgovor: zaporedje konvergira natanko za $0 \le c \le 3$; limita je $1$ za $0 \le c < 3$ in $3$ za $c = 3$. Za $c > 3$ divergira proti $\infty$.

### Naloga 2

Izračunaj limite: a) $\lim\limits_{n \to \infty}\left(\sqrt{n^2 + 3n} - n\right)$, b) $\lim\limits_{n \to \infty}\left(\dfrac{n + 3}{n - 1}\right)^{2n}$, c) $\lim\limits_{n \to \infty}\sqrt[n]{2^n + 3^n}$.

**Rešitev:**

1. a) Oblika $\infty - \infty$; pomnožimo z $\frac{\sqrt{n^2 + 3n} + n}{\sqrt{n^2 + 3n} + n}$: dobimo $\dfrac{3n}{\sqrt{n^2 + 3n} + n} = \dfrac{3}{\sqrt{1 + \frac{3}{n}} + 1} \to \dfrac{3}{2}$.
2. b) Oblika $1^\infty$: $\frac{n + 3}{n - 1} = 1 + \frac{4}{n - 1}$. Z $m = n - 1$ je izraz $\left(1 + \frac{4}{m}\right)^{2m + 2} = \left[\left(1 + \frac{4}{m}\right)^m\right]^2 \cdot \left(1 + \frac{4}{m}\right)^2$.
3. Prvi faktor gre proti $(e^4)^2 = e^8$, drugi proti $1$; po pravilu za produkt je limita $e^8 \approx 2981$.
4. c) Sendvič: $3^n \le 2^n + 3^n \le 2 \cdot 3^n$, zato $3 \le \sqrt[n]{2^n + 3^n} \le 3\sqrt[n]{2}$. Ker gre $\sqrt[n]{2} \to 1$, gresta obe meji proti $3$.
5. Odgovor: a) $\frac{3}{2}$, b) $e^8$, c) $3$.

### Naloga 3

Natančno navedi izrek o sendviču in ga dokaži. Nato dokaži: če je $(a_n)$ omejeno in $b_n \to 0$, je $a_n b_n \to 0$. Utemelji, ali lahko predpostavko o omejenosti izpustimo.

**Rešitev:**

1. Izrek: naj velja $b_n \le a_n \le c_n$ za vse $n \ge n_0$ in $\lim b_n = \lim c_n = L$. Potem je $(a_n)$ konvergentno in $\lim a_n = L$.
2. Dokaz: za $\varepsilon > 0$ obstajata $N_1$ z $b_n > L - \varepsilon$ za $n \ge N_1$ in $N_2$ s $c_n < L + \varepsilon$ za $n \ge N_2$. Za $n \ge \max\{n_0, N_1, N_2\}$ je $L - \varepsilon < b_n \le a_n \le c_n < L + \varepsilon$, torej $|a_n - L| < \varepsilon$.
3. Naj bo $|a_n| \le M$ za vse $n$. Tedaj je $0 \le |a_n b_n| \le M|b_n|$ in $M|b_n| \to 0$, zato po sendviču $|a_n b_n| \to 0$. Ker je $|a_n b_n - 0| = |a_n b_n|$, je po definiciji tudi $a_n b_n \to 0$.
4. Zgled: $\frac{\sin n}{n} \to 0$, saj je $|\sin n| \le 1$ in $\frac{1}{n} \to 0$.
5. Omejenosti ne smemo izpustiti: za $a_n = n$ in $b_n = \frac{1}{n} \to 0$ je $a_n b_n = 1 \to 1 \ne 0$.
6. Odgovor: trditev velja za omejeno $(a_n)$, brez omejenosti pa ne.

## Drugače: Na sliki

Člene zaporedja nariši kot točke $(n, a_n)$ v ravnini. Za $a_n = \frac{2n + 1}{n + 3}$ dobiš točke $(1;\ 0{,}75)$; $(2;\ 1)$; $(3;\ 1{,}17)$; $(10;\ 1{,}62)$, ki se od spodaj približujejo vodoravni premici $y = 2$. Okoli te premice nariši pas širine $2\varepsilon$. Definicija limite pravi: ne glede na to, kako ozek pas izbereš, od nekega $N$ naprej vse točke ležijo v pasu.

Drugi način je številska premica: člene označi na osi. Pri konvergentnem zaporedju se točke kopičijo ob $L$. Pri $(-1)^n$ pa skačejo med dvema točkama, $-1$ in $1$, in se ne zberejo pri nobeni.

Rekurzivno zaporedje $a_{n+1} = \sqrt{2 + a_n}$ si predstavljaj kot »pajkovo mrežo«: nariši $y = \sqrt{2 + x}$ in $y = x$. Od $a_1$ pojdi navpično do krivulje, nato vodoravno do premice, pa spet navpično. Stopnice se vzpenjajo proti presečišču $(2, 2)$.

## Drugače: Uporaba v stroki

**Večkratna ekstrakcija.** Snov iz $100\,\mathrm{mL}$ vodne raztopine ekstrahiramo s skupno $100\,\mathrm{mL}$ organskega topila, porazdelitveni koeficient je $D = 4$. Pri eni ekstrakciji ostane v vodi delež $\frac{1}{1 + 4} = 0{,}2$. Če topilo razdelimo na $n$ enakih obrokov, ostane $\left(1 + \frac{4}{n}\right)^{-n}$: pri $n = 3$ je to $\left(\frac{3}{7}\right)^3 \approx 0{,}0787$. Zaporedje pada proti $e^{-4} \approx 0{,}0183$: še tako drobno deljenje topila ne odstrani več kot približno $98\,\%$ snovi. Limita s številom $e$ tako pove, kdaj se dodatne ekstrakcije ne splačajo več.

**Iterativni izračun ravnotežja.** Koncentracijo $x = [\mathrm{H_3O^+}]$ v $0{,}10\,\mathrm{M}$ ocetni kislini ($K_a = 1{,}8 \cdot 10^{-5}$) laboratorijski programi računajo z iteracijo $x_{n+1} = \sqrt{K_a(c - x_n)}$ (preurejena zveza $K_a = \frac{x^2}{c - x}$), $x_0 = 0$: $x_1 \approx 1{,}342 \cdot 10^{-3}$, $x_2 \approx 1{,}333 \cdot 10^{-3}\,\mathrm{M}$, $\mathrm{pH} \approx 2{,}88$. Program limite ne pozna, zato ustavi računanje, ko je $|x_{n+1} - x_n|$ pod predpisano mejo: to je praktični približek Cauchyjevega pogoja (sama majhna razlika zaporednih členov konvergence še ne zagotavlja).

**Farmakokinetika.** Bolnik vsakih $12\,\mathrm{h}$ vzame $100\,\mathrm{mg}$ zdravila, med odmerkoma telo izloči polovico. Količina takoj po odmerku je $a_1 = 100\,\mathrm{mg}$, $a_{n+1} = 0{,}5 a_n + 100\,\mathrm{mg}$: $100$; $150$; $175$; $187{,}5$ ... Limita iz $L = 0{,}5L + 100$ je $L = 200\,\mathrm{mg}$, **stacionarno stanje**, po katerem farmakologi določijo odmerek.

## Drugače: Korak za korakom s številkami

Izračunajmo nekaj členov zaporedja $e_n = \left(1 + \frac{1}{n}\right)^n$.

1. $n = 1$: $(1 + 1)^1 = 2$.
2. $n = 2$: $1{,}5^2 = 2{,}25$.
3. $n = 5$: $1{,}2^5 = 2{,}48832$.
4. $n = 10$: $1{,}1^{10} \approx 2{,}59374$.
5. $n = 100$: $1{,}01^{100} \approx 2{,}70481$.
6. $n = 1000$: $1{,}001^{1000} \approx 2{,}71692$.
7. **Opažanje.** Členi naraščajo, vendar vse počasneje, in ostajajo pod $3$. Približujejo se $e \approx 2{,}71828$.
8. **Hitrost konvergence.** Pri $n = 1000$ je razlika do $e$ še približno $0{,}00136$. Za natančno računanje števila $e$ je zato veliko boljša vrsta $1 + 1 + \frac{1}{2!} + \frac{1}{3!} + \dots$, ki že po desetih členih da šest pravilnih decimalk (napaka je približno $3 \cdot 10^{-7}$).

## Drugače: Bolj natančno

**Bolzano-Weierstrassov izrek (skica dokaza).** Naj bodo vsi členi v $[m, M]$. Interval razpolovimo; vsaj ena polovica vsebuje neskončno mnogo členov, izberemo jo in v njej en člen z indeksom, večjim od prej izbranega. Postopek ponavljamo: dobimo gnezdene intervale z dolžinami $\frac{M - m}{2^k} \to 0$ in podzaporedje, katerega členi ležijo v teh intervalih. Leva krajišča tvorijo naraščajoče omejeno zaporedje, ki ima zato limito $L$ (polnost $\mathbb{R}$); desna krajišča se od levih razlikujejo za dolžino, ki gre proti $0$, zato gredo tudi ona proti $L$. Po sendviču gre proti $L$ izbrano podzaporedje.

**Cauchyjev kriterij, smer »Cauchyjevo ⇒ konvergentno«.** Cauchyjevo zaporedje je omejeno (za $\varepsilon = 1$ so vsi členi od $N$ naprej v $(a_N - 1, a_N + 1)$). Po Bolzano-Weierstrassovem izreku ima podzaporedje $a_{n_k} \to L$. Za $\varepsilon > 0$ izberemo $N$ iz Cauchyjevega pogoja za $\frac{\varepsilon}{2}$ in $k$ z $n_k \ge N$ in $|a_{n_k} - L| < \frac{\varepsilon}{2}$; za $n \ge N$ je $|a_n - L| \le |a_n - a_{n_k}| + |a_{n_k} - L| < \varepsilon$. Polnost realnih števil je pri tem bistvena.

## Preveri se

? Koliko je $\displaystyle \lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^{2n}$?
- $e$
~ Prezrl si eksponent $2n$: izraz je kvadrat zaporedja, ki gre proti $e$.
+ $e^2$
- $1$
~ Osnova gre proti $1$, eksponent pa raste čez vse meje; $1^\infty$ je nedoločen izraz, ne $1$.
> $\left(1 + \frac{1}{n}\right)^{2n} = \left[\left(1 + \frac{1}{n}\right)^n\right]^2 \to e^2$. Odgovor $1$ je napačna »rešitev« nedoločenega izraza $1^\infty$.

? Koliko je $\displaystyle \lim_{n \to \infty} \frac{n^2 + 1}{2n^3 - n}$?
+ $0$
- $\frac{1}{2}$
~ Primerjal si le koeficienta $1$ in $2$; to velja samo pri enakih stopnjah, tu pa ima imenovalec višjo stopnjo.
- $\infty$
~ Števec res raste čez vse meje, a imenovalec ($n^3$) raste hitreje, zato je ulomek vse manjši.
> Imenovalec ima višjo stopnjo; po deljenju z $n^3$ dobimo $\frac{1/n + 1/n^3}{2 - 1/n^2} \to \frac{0}{2} = 0$.

? Katera trditev drži za zaporedja realnih števil?
+ Vsako konvergentno zaporedje je omejeno.
- Vsako omejeno zaporedje je konvergentno.
~ Obrat izreka ne velja: $(-1)^n$ je omejeno, a skače med $-1$ in $1$.
- Vsako monotono zaporedje je konvergentno.
~ Monotonost sama ne zadošča, potrebna je še omejenost: $a_n = n$ narašča in gre proti $\infty$.
> Protiprimera za drugo in tretjo trditev sta $(-1)^n$ (omejeno, ne konvergira) in $a_n = n$ (monotono, ne konvergira).

? Zaporedje $a_1 = 2$, $a_{n+1} = 0{,}5\, a_n + 3$ je konvergentno. Kolikšna je njegova limita?
+ $6$
- $3$
~ To je le prišteti člen; v enačbi $L = 0{,}5L + 3$ moraš $L$ še izraziti.
- $1{,}5$
~ Iz $0{,}5L = 3$ si $3$ pomnožil z $0{,}5$, namesto da bi delil.
> Iz $L = 0{,}5L + 3$ sledi $0{,}5L = 3$, torej $L = 6$.

:::simboli
a_n | splošni (n-ti) člen zaporedja | | |
L | limita zaporedja | L = \lim_{n \to \infty} a_n | |
\varepsilon | poljubno majhno pozitivno število (polmer okolice) | | | ε > 0
n | indeks člena | | | naravno število
N | indeks, od katerega naprej so vsi členi blizu L | | | odvisen od ε
b_n | splošni člen drugega zaporedja | | |
A | limita zaporedja (aₙ) | A = \lim_{n \to \infty} a_n | |
B | limita zaporedja (bₙ) | B = \lim_{n \to \infty} b_n | | pri kvocientu B ≠ 0
e | Eulerjevo število | e = \lim_{n \to \infty}\left(1 + \frac{1}{n}\right)^n | | e ≈ 2,718 28
a_m | člen zaporedja z indeksom m | | |
m | drugi indeks (Cauchyjev pogoj) | | | m, n ≥ N
k | eksponent potence (tudi indeks vsote) | | | 1/nᵏ → 0 velja za k > 0
:::
