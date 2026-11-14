---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Klimatologinja dela preprost model: presežek ogljika v ozračju se vsako leto poveča za izpuste, ocean in rastlinje pa vsako leto vsrkata stalen delež presežka. Koliko bo presežka čez $20$ let? Vrtnar pa tlakuje ozko pot dolžine $n$ s ploščami dolžine $1$ in $2$. Na koliko načinov lahko to naredi?

V obeh primerih ne poznamo neposredne formule, poznamo pa **pravilo, kako iz prejšnjih členov dobimo naslednjega**. Presežek letos je odvisen od lanskega, število tlakovanj poti dolžine $n$ od števila za $n - 1$ in $n - 2$. Taki zvezi pravimo rekurzivna enačba. Ko jo znaš rešiti, dobiš eksplicitno formulo, s katero izračunaš stoti člen brez sto korakov in vidiš, kako hitro zaporedje raste. Rekurzije so povsod, kjer se sistem spreminja v korakih: v štetju, v analizi algoritmov, v modelih populacij in v digitalnih filtrih.

## Razlaga

### 1. Poskus z enim samim $r^n$

Pri tlakovanju naj bo $t_n$ število načinov za pot dolžine $n$. Zadnja plošča je dolžine $1$ (pred njo je pot dolžine $n - 1$) ali dolžine $2$ (pred njo pot dolžine $n - 2$), zato je $t_n = t_{n-1} + t_{n-2}$, $t_1 = 1$, $t_2 = 2$. Zaporedje je $1, 2, 3, 5, 8, 13, \ldots$

Ker zaporedje raste približno geometrijsko, je mamljivo poskusiti z $t_n = r^n$ in poiskati »pravi« $r$. Vstavimo: $r^n = r^{n-1} + r^{n-2}$, po deljenju z $r^{n-2}$ dobimo $r^2 = r + 1$ in $r = \frac{1 \pm \sqrt5}{2}$. Toda nobeno od zaporedij $r^n$ ne da $t_1 = 1$ in $t_2 = 2$ hkrati, z dodatnim faktorjem $c\,r^n$ pa lahko izpolnimo le en začetni pogoj.

Napaka je v predpostavki, da je rešitev **eno samo** geometrijsko zaporedje. Rešitve linearne rekurzije se dajo **seštevati**: vsota rešitev je spet rešitev. Pravilna rešitev je kombinacija obeh, $t_n = C_1 r_1^n + C_2 r_2^n$, in dve konstanti ravno zadoščata za dva začetna pogoja. To zdaj natančno utemeljimo.

### 2. Definicije in enoličnost

**Definicija.** **Rekurzivna enačba reda $k$** za zaporedje $(a_n)$ izraža $a_n$ s $k$ prejšnjimi členi: $a_n = F(n, a_{n-1}, \ldots, a_{n-k})$ za vse $n \ge k$. Je **linearna s konstantnimi koeficienti**, če je

$$a_n = c_1a_{n-1} + c_2a_{n-2} + \cdots + c_ka_{n-k} + f(n),$$

s števili $c_1, \ldots, c_k$, $c_k \ne 0$. Če je $f(n) = 0$ za vse $n$, je **homogena**, sicer **nehomogena**.

**Izrek (enoličnost).** Rekurzivna enačba reda $k$ in začetne vrednosti $a_0, \ldots, a_{k-1}$ natanko določajo zaporedje.

**Dokaz.** Z indukcijo: prvih $k$ členov je danih; če so določeni členi do $a_{n-1}$, je $a_n = F(n, a_{n-1}, \ldots, a_{n-k})$ določen. Zato sta zaporedji, ki se ujemata v prvih $k$ členih in zadoščata isti rekurziji, enaki.

**Izrek (prostor rešitev).** Rešitve homogene linearne rekurzije reda $k$ tvorijo vektorski prostor dimenzije $k$.

**Dokaz.** Če sta $(a_n)$ in $(b_n)$ rešitvi, je zaradi linearnosti tudi $(\lambda a_n + \mu b_n)$ rešitev. Preslikava, ki rešitvi priredi njenih prvih $k$ členov, je linearna. Je surjektivna na $\mathbb{R}^k$, ker vsake začetne vrednosti rekurzija nadaljuje v rešitev, in po izreku o enoličnosti injektivna; torej je izomorfizem in dimenzija je $k$.

### 3. Homogene rekurzije: karakteristični polinom

**Definicija.** **Karakteristični polinom** rekurzije $a_n = c_1a_{n-1} + \cdots + c_ka_{n-k}$ je

$$p(r) = r^k - c_1r^{k-1} - \cdots - c_k.$$

**Lema.** Za $r \ne 0$ je $a_n = r^n$ rešitev natanko tedaj, ko je $p(r) = 0$.

**Dokaz.** Vstavimo in delimo z $r^{n-k} \ne 0$: $r^k = c_1r^{k-1} + \cdots + c_k$, kar je $p(r) = 0$.

**Izrek (različni koreni).** Če ima $p$ različne korene $r_1, \ldots, r_k$, je vsaka rešitev oblike

$$a_n = C_1r_1^n + C_2r_2^n + \cdots + C_kr_k^n.$$

**Dokaz.** Po lemi in linearnosti so to rešitve. Konstante za dane $a_0, \ldots, a_{k-1}$ določa sistem z Vandermondovo matriko $(r_i^j)$, ki je za različne $r_i$ obrnljiva; zato vsako začetno stanje dosežemo, po enoličnosti pa drugih rešitev ni.

**Izrek (večkratni koren).** Če je $r$ koren $p$ s kratnostjo $m$, so $r^n, nr^n, \ldots, n^{m-1}r^n$ rešitve; skupaj s prispevki ostalih korenov dajo vse rešitve.

**Dokaz za $m = 2$.** Naj bo $q(x) = x^{n-k}p(x) = x^n - c_1x^{n-1} - \cdots - c_kx^{n-k}$. Ker je $r$ dvojni koren $p$, je tudi koren $q$ in $q'$, zato $rq'(r) = 0$. To je $nr^n - c_1(n-1)r^{n-1} - \cdots - c_k(n-k)r^{n-k} = 0$, kar pove ravno, da $a_n = nr^n$ zadošča rekurziji.

Kompleksna korena $\rho e^{\pm i\vartheta}$ realne rekurzije dasta realni rešitvi $\rho^n\cos n\vartheta$ in $\rho^n\sin n\vartheta$ (nihanje).

:::premisli
Rekurzija ima karakteristični polinom $(r - 2)^2(r + 1)$. Kakšna je oblika splošne rešitve in kateri del za velike $n$ prevlada?
---
$a_n = (C_1 + C_2n)2^n + C_3(-1)^n$. Za velike $n$ prevlada $C_2n2^n$ (če $C_2 \ne 0$), ker raste hitreje od $2^n$, člen $(-1)^n$ pa ostane omejen.
:::

### 4. Nehomogene rekurzije

**Izrek.** Splošna rešitev nehomogene linearne rekurzije je $a_n = a_n^{(h)} + a_n^{(p)}$, kjer je $a_n^{(h)}$ splošna rešitev pripadajoče homogene, $a_n^{(p)}$ pa ena (partikularna) rešitev nehomogene.

**Dokaz.** Razlika dveh rešitev nehomogene enačbe zadošča homogeni, ker se $f(n)$ odšteje.

**Nastavek** za $a_n^{(p)}$, kadar je $f(n) = P(n)s^n$ s polinomom $P$ stopnje $d$: $a_n^{(p)} = n^mQ(n)s^n$, kjer je $Q$ polinom stopnje $d$ z neznanimi koeficienti, $m$ pa kratnost števila $s$ kot korena $p$ ($m = 0$, če $s$ ni koren). Faktor $n^m$ je potreben, ker je brez njega nastavek že rešitev homogene enačbe in ga nehomogena enačba ne more določiti (resonanca).

Pri $f(n) = $ konst. je $s = 1$. Za rekurzijo prvega reda $a_{n+1} = qa_n + b$ s $q \ne 1$ je partikularna rešitev stalnica $a^* = b/(1 - q)$ (**negibna točka**), zato $a_n = a^* + (a_0 - a^*)q^n$.

### 5. Rodovne funkcije

**Definicija.** **Rodovna funkcija** zaporedja $(a_n)_{n \ge 0}$ je formalna potenčna vrsta

$$A(x) = \sum_{n \ge 0} a_nx^n.$$

Z vrstami računamo kot s polinomi (seštevanje, množenje, deljenje z vrsto s prostim členom $\ne 0$); konvergenca nas ne skrbi. Osnovni razvoji:

$$\frac{1}{1 - rx} = \sum_{n \ge 0} r^nx^n,$$

$$\frac{1}{(1 - x)^2} = \sum_{n \ge 0} (n + 1)x^n.$$

Prvi sledi iz $(1 - rx)\sum r^nx^n = 1$, drugi z odvajanjem $\sum x^n = \frac{1}{1-x}$. Množenje z $x$ zamakne zaporedje: $xA(x) = \sum a_{n-1}x^n$.

**Postopek.** (1) Rekurzijo pomnoži z $x^n$ in seštej po vseh $n$, za katere velja. (2) Vsoto izrazi z $A(x)$ in začetnimi členi. (3) Izrazi $A(x)$ kot racionalno funkcijo. (4) Razstavi na parcialne ulomke. (5) Odčitaj koeficient pri $x^n$.

Rodovne funkcije so tudi orodje za štetje: koeficient pri $x^n$ v $(1 + x + x^2 + \cdots)(1 + x^2 + x^4 + \cdots)$ je število načinov, kako zapišemo $n$ kot vsoto enic in dvojk brez upoštevanja vrstnega reda.

:::premisli
Kaj je rodovna funkcija zaporedja $a_n = 3^n$ in kaj zaporedja $b_n = n + 1$? Zakaj imenovalec $(1 - x)^2$ ustreza dvojnemu korenu $1$?
---
$A(x) = \frac{1}{1 - 3x}$ in $B(x) = \frac{1}{(1-x)^2}$. Zaporedje $b_n = (1 + n)\cdot 1^n$ je rešitev rekurzije z dvojnim korenom $1$ ($b_n = 2b_{n-1} - b_{n-2}$), njen karakteristični polinom $(r - 1)^2$ pa se v imenovalcu pojavi kot $(1 - x)^2$: korenu $r$ ustreza faktor $1 - rx$.
:::

## Rešeni primeri

### Primer 1 (lažji)

V modelu ogljika je presežek $a_n$ (v gigatonah ogljika nad predindustrijsko vrednostjo) v letu $n$ podan z $a_{n+1} = 0{,}98\,a_n + 10$: vsako leto ocean in rastlinje vsrkata $2\,\%$ presežka, izpusti dodajo $10$ gigaton. Začetni presežek je $a_0 = 250$. Poišči eksplicitno formulo, presežek po $20$ letih in leto, ko presežek prvič preseže $400$.

**Podatki:** $a_{n+1} = 0{,}98\,a_n + 10$, $a_0 = 250$; meja $400$
**Iščemo:** $a_n$, $a_{20}$, najmanjši $n$ z $a_n > 400$

:::formula
$a^* = \dfrac{b}{1 - q}$, $a_n = a^* + (a_0 - a^*)q^n$
:::

**Rešitev:**

1. Negibna točka: $a^* = 10/(1 - 0{,}98) = 10/0{,}02 = 500$. Pri tem presežku je vsrkanje ($2\,\%$ od $500$) ravno enako izpustom.
2. Homogeni del je $Cq^n$ s $q = 0{,}98$; iz $a_0 = 250$ sledi $C = 250 - 500 = -250$. Torej $a_n = 500 - 250 \cdot 0{,}98^n$.
3. Po $20$ letih: $0{,}98^{20} \approx 0{,}668$, zato $a_{20} \approx 500 - 250 \cdot 0{,}668 \approx 333$.
4. $a_n > 400$ pomeni $0{,}98^n < 0{,}4$, torej $n > \ln 0{,}4/\ln 0{,}98 \approx 45{,}4$. Preizkus: $a_{45} \approx 399{,}3$, $a_{46} \approx 401{,}3$.
5. Odgovor: $a_n = 500 - 250 \cdot 0{,}98^n$; po $20$ letih je presežek okoli $333$ gigaton, mejo $400$ preseže v letu $46$. Presežek se približuje $500$, ne raste neomejeno, dokler so izpusti stalni.

### Primer 2

Poišči eksplicitno formulo za število tlakovanj $t_n$ poti dolžine $n$ s ploščami dolžine $1$ in $2$ iz uvoda in preveri, da je $t_{10} = 89$.

**Podatki:** $t_n = t_{n-1} + t_{n-2}$ za $n \ge 2$, $t_0 = 1$ (prazna pot), $t_1 = 1$
**Iščemo:** eksplicitno formulo $t_n$, preizkus za $n = 10$

:::formula
$p(r) = r^2 - r - 1$, $t_n = C_1r_1^n + C_2r_2^n$
:::

**Rešitev:**

1. Začetna vrednost $t_0 = 1$ se ujema z rekurzijo: $t_2 = t_1 + t_0 = 2$. ✓
2. Korena: $r_{1,2} = \dfrac{1 \pm \sqrt5}{2}$, torej $\varphi \approx 1{,}618$ in $\psi \approx -0{,}618$; sta različna.
3. Pogoja: $C_1 + C_2 = 1$ in $C_1\varphi + C_2\psi = 1$. Iz prve $C_2 = 1 - C_1$, vstavimo: $C_1(\varphi - \psi) = 1 - \psi$, $\varphi - \psi = \sqrt5$, $1 - \psi = \varphi$, zato $C_1 = \varphi/\sqrt5$ in $C_2 = -\psi/\sqrt5$.
4. Formula: $t_n = \dfrac{\varphi^{n+1} - \psi^{n+1}}{\sqrt5}$ (to je Binetova formula, $t_n = F_{n+1}$).
5. Preizkus z rekurzijo: $1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89$ za $n = 0, \ldots, 10$. Iz formule: $\varphi^{11}/\sqrt5 \approx 88{,}998$, $|\psi^{11}/\sqrt5| < 0{,}003$, razlika $(\varphi^{11} - \psi^{11})/\sqrt5$ je natanko $89$. ✓
6. Odgovor: $t_n = (\varphi^{n+1} - \psi^{n+1})/\sqrt5$; ker je $|\psi| < 1$, je $t_n$ kar $\varphi^{n+1}/\sqrt5$, zaokroženo na celo število. Število tlakovanj raste kot $1{,}618^n$.

### Primer 3 (težji)

Reši rekurzijo $a_n = 5a_{n-1} - 6a_{n-2} + 2^n$ za $n \ge 2$ z $a_0 = 0$, $a_1 = 1$. Rezultat preveri za $n = 2$ in $n = 3$.

**Podatki:** $a_n = 5a_{n-1} - 6a_{n-2} + 2^n$, $a_0 = 0$, $a_1 = 1$
**Iščemo:** eksplicitno formulo $a_n$

:::formula
$a_n = a_n^{(h)} + a_n^{(p)}$; $p(r) = r^2 - 5r + 6$; pri $f(n) = 2^n$ in enojnem korenu $2$: $a_n^{(p)} = Cn2^n$
:::

**Rešitev:**

1. Homogeni del: $r^2 - 5r + 6 = (r - 2)(r - 3)$, zato $a_n^{(h)} = \alpha 2^n + \beta 3^n$.
2. Desna stran $2^n$ ima $s = 2$, ki je enojni koren. Nastavek $C2^n$ bi bil rešitev homogene enačbe, zato vzamemo $a_n^{(p)} = Cn2^n$.
3. Vstavimo in delimo z $2^{n-2}$: $4Cn = 10C(n-1) - 6C(n-2) + 4$, torej $4Cn = 4Cn + 2C + 4$, od koder $C = -2$.
4. Splošna rešitev: $a_n = \alpha 2^n + \beta 3^n - 2n2^n = \alpha 2^n + \beta 3^n - n2^{n+1}$.
5. Začetna pogoja: $a_0 = \alpha + \beta = 0$; $a_1 = 2\alpha + 3\beta - 4 = 1$, torej $2\alpha + 3\beta = 5$. Iz prve $\alpha = -\beta$, zato $\beta = 5$, $\alpha = -5$.
6. Formula: $a_n = 5 \cdot 3^n - 5 \cdot 2^n - n2^{n+1}$.
7. Preizkus: iz rekurzije $a_2 = 5 \cdot 1 - 0 + 4 = 9$, $a_3 = 5 \cdot 9 - 6 \cdot 1 + 8 = 47$; iz formule $a_2 = 45 - 20 - 16 = 9$ in $a_3 = 135 - 40 - 48 = 47$. ✓
8. Odgovor: $a_n = 5 \cdot 3^n - 5 \cdot 2^n - n2^{n+1}$; za velike $n$ prevlada $5 \cdot 3^n$.

### Primer 4 – zdaj ti

Hanojski stolp z $n$ ploščicami potrebuje najmanj $h_n$ premikov, kjer je $h_0 = 0$ in $h_n = 2h_{n-1} + 1$. Reši rekurzijo z rodovno funkcijo.

**Podatki:** $h_0 = 0$, $h_n = 2h_{n-1} + 1$ za $n \ge 1$
**Iščemo:** $H(x) = \sum h_nx^n$ in $h_n$

:::formula
$\sum_{n \ge 1} x^n = \dfrac{x}{1 - x}$, $\dfrac{1}{1 - rx} = \sum r^nx^n$
:::

**Rešitev:**

1. Pomnožimo rekurzijo z $x^n$ in seštejemo za $n \ge 1$: $\sum_{n \ge 1} h_nx^n = 2x\sum_{n \ge 1} h_{n-1}x^{n-1} + \sum_{n \ge 1} x^n$.
2. Leva stran je $H(x) - h_0 = H(x)$, prva vsota na desni $2xH(x)$, druga $\frac{x}{1-x}$. Zato $H(x)(1 - 2x) = \frac{x}{1-x}$ in $H(x) = \dfrac{x}{(1 - x)(1 - 2x)}$.
3. Zdaj ti: razstavi $H(x)$ na parcialne ulomke in odčitaj $h_n$; preveri $h_3$.

:::premisli
Kolikšen je $h_n$?
---
$\dfrac{x}{(1-x)(1-2x)} = \dfrac{1}{1-2x} - \dfrac{1}{1-x}$ (preizkus: $\frac{(1-x) - (1-2x)}{(1-x)(1-2x)} = \frac{x}{(1-x)(1-2x)}$). Koeficient pri $x^n$ je $h_n = 2^n - 1$. Za $n = 3$: $7$ premikov, kar se ujema z $0, 1, 3, 7$ iz rekurzije.
:::

## Pogoste napake

- **Ena geometrijska rešitev.** Pri rekurziji reda $k$ potrebuješ $k$ neodvisnih rešitev in $k$ konstant; z eno $Cr^n$ ne izpolniš dveh začetnih pogojev.
- **Pri dvojnem korenu dvakrat $r^n$.** $C_1r^n + C_2r^n$ je le ena rešitev s konstanto $C_1 + C_2$. Druga neodvisna rešitev je $nr^n$.
- **Nastavek brez faktorja $n$ pri resonanci.** Če je $s$ v $f(n) = s^n$ koren karakterističnega polinoma, nastavek $Cs^n$ da $0 = s^n$ in protislovje. Pomnoži z $n^m$.
- **Konstante iz splošne rešitve homogene enačbe.** Začetne pogoje vstavi šele v skupno rešitev $a_n^{(h)} + a_n^{(p)}$, sicer konstante pridejo napačne.
- **Indeksi pri rodovni funkciji.** Če rekurzija velja od $n = 2$ naprej, seštevaj od $n = 2$ in odštej začetne člene ($A(x) - a_0 - a_1x$); sicer se začetni pogoji izgubijo.

## Povzetek

- Linearna rekurzija s konstantnimi koeficienti reda $k$: $a_n = c_1a_{n-1} + \cdots + c_ka_{n-k} + f(n)$; $k$ začetnih vrednosti določi zaporedje.
- Homogena: korenom karakterističnega polinoma $p(r) = r^k - c_1r^{k-1} - \cdots - c_k$ ustrezajo rešitve $r^n$; koren kratnosti $m$ da $r^n, nr^n, \ldots, n^{m-1}r^n$.
- Nehomogena: $a_n = a_n^{(h)} + a_n^{(p)}$; nastavek $n^mQ(n)s^n$ za $f(n) = P(n)s^n$.
- Prvi red: $a_{n+1} = qa_n + b$ ima negibno točko $b/(1 - q)$ in $a_n = a^* + (a_0 - a^*)q^n$.
- Rodovna funkcija $A(x) = \sum a_nx^n$: rekurzija → racionalna funkcija → parcialni ulomki → koeficienti; korenu $r$ ustreza faktor $1 - rx$.

## Za izpit

Znati moraš povedati:

- definicijo linearne rekurzivne enačbe reda $k$ s konstantnimi koeficienti (homogene, nehomogene) in izrek o enoličnosti z dokazom;
- da rešitve homogene rekurzije tvorijo vektorski prostor dimenzije $k$;
- izrek o splošni rešitvi pri različnih korenih in dokaz, da je pri dvojnem korenu $nr^n$ rešitev;
- strukturo rešitve nehomogene rekurzije in nastavek z resonanco;
- definicijo rodovne funkcije, razvoja $\frac{1}{1 - rx}$ in $\frac{1}{(1-x)^2}$ ter postopek reševanja rekurzije z njo.

### Naloga 1

Vremenski zapis za zaporedje $n$ dni ima vsak dan eno od treh oznak: sončno, oblačno ali deževno. V modelu suše dva deževna dneva nikoli ne sledita drug drugemu. Naj bo $w_n$ število dopustnih zapisov za $n$ dni ($w_0 = 1$). (a) Izpelji rekurzijo za $w_n$ in izračunaj $w_1$, $w_2$. (b) Reši rekurzijo. (c) Zapiši rodovno funkcijo $W(x)$. (d) Kolikšen delež vseh zapisov za $10$ dni je dopusten?

**Rešitev:**

1. (a) Glej zadnji dan. Če je suh (sončen ali oblačen, $2$ možnosti), je pred njim katerikoli dopusten zapis za $n - 1$ dni. Če je deževen, mora biti dan pred njim suh ($2$ možnosti), pred tem pa katerikoli zapis za $n - 2$ dni. Zato $w_n = 2w_{n-1} + 2w_{n-2}$ za $n \ge 2$.
2. $w_1 = 3$ (vse tri oznake), $w_2 = 2 \cdot 3 + 2 \cdot 1 = 8$; preizkus: od $9$ parov je prepovedan le »deževno, deževno«. ✓
3. (b) $p(r) = r^2 - 2r - 2$, korena $r_{1,2} = 1 \pm \sqrt3$. $w_n = \alpha(1 + \sqrt3)^n + \beta(1 - \sqrt3)^n$.
4. Iz $w_0 = 1$: $\alpha + \beta = 1$. Iz $w_1 = 3$: $(\alpha + \beta) + \sqrt3(\alpha - \beta) = 3$, torej $\alpha - \beta = 2/\sqrt3$. Sledi $\alpha = \dfrac{3 + 2\sqrt3}{6} \approx 1{,}077$, $\beta = \dfrac{3 - 2\sqrt3}{6} \approx -0{,}077$.
5. (c) Iz $W(x) - 2xW(x) - 2x^2W(x) = w_0 + (w_1 - 2w_0)x = 1 + x$ dobimo $W(x) = \dfrac{1 + x}{1 - 2x - 2x^2}$; imenovalec je $(1 - r_1x)(1 - r_2x)$.
6. (d) Z rekurzijo: $1, 3, 8, 22, 60, 164$, nato $448, 1224, 3344, 9136, 24\,960$, torej $w_{10} = 24\,960$ (formula da isto). Vseh zapisov je $3^{10} = 59\,049$, delež $24\,960/59\,049 \approx 0{,}423$.
7. Odgovor: $w_n = 2w_{n-1} + 2w_{n-2}$, $w_n = \frac{3 + 2\sqrt3}{6}(1 + \sqrt3)^n + \frac{3 - 2\sqrt3}{6}(1 - \sqrt3)^n$, $W(x) = \frac{1 + x}{1 - 2x - 2x^2}$; dopustnih je okoli $42\,\%$ zapisov za $10$ dni. Delež pada proti $0$, ker je $1 + \sqrt3 \approx 2{,}73 < 3$.

### Naloga 2

Natančno navedi izrek o splošni rešitvi homogene linearne rekurzije reda $k$, katere karakteristični polinom ima $k$ različnih korenov, in ga dokaži. Nato dokaži, da je pri dvojnem korenu $r$ zaporedje $nr^n$ rešitev, in utemelji, ali sta $r^n$ in $nr^n$ linearno neodvisni rešitvi.

**Rešitev:**

1. Izrek: če ima $p(r) = r^k - c_1r^{k-1} - \cdots - c_k$ različne korene $r_1, \ldots, r_k$, je vsaka rešitev $a_n = c_1a_{n-1} + \cdots + c_ka_{n-k}$ oblike $\sum C_ir_i^n$ z enolično določenimi konstantami.
2. Vsak $r_i^n$ je rešitev (vstavimo, delimo z $r_i^{n-k}$, dobimo $p(r_i) = 0$); po linearnosti je rešitev tudi vsaka kombinacija.
3. Za dane $a_0, \ldots, a_{k-1}$ rešimo sistem $\sum_i C_ir_i^j = a_j$, $j = 0, \ldots, k-1$. Njegova matrika je Vandermondova z determinanto $\prod_{i<l}(r_l - r_i) \ne 0$, zato ima natanko eno rešitev. Po izreku o enoličnosti je dobljena kombinacija prav iskano zaporedje; drugih rešitev ni.
4. Dvojni koren: z $q(x) = x^{n-k}p(x)$ velja $q(r) = q'(r) = 0$. Iz $rq'(r) = 0$ sledi $nr^n = \sum_{j=1}^{k} c_j(n - j)r^{n-j}$, kar je rekurzija za $a_n = nr^n$.
5. Neodvisnost: iz $\lambda r^n + \mu nr^n = 0$ za vse $n$ sledi pri $n = 0$ $\lambda = 0$ in pri $n = 1$ $\mu r = 0$; ker je $r \ne 0$ ($c_k \ne 0$), je $\mu = 0$. Rešitvi sta neodvisni.

### Naloga 3

Naj bo $b_n$ število načinov, kako plačaš $n$ evrov s kovanci za $1$ in $2$ evra, če vrstni red kovancev ni pomemben. Zapiši rodovno funkcijo zaporedja $(b_n)$, jo razstavi na parcialne ulomke in pokaži, da je $b_n = \lfloor n/2 \rfloor + 1$.

**Rešitev:**

1. Število dvojk $j$ in enic $n - 2j$ natanko določa plačilo. Rodovna funkcija: $B(x) = (1 + x + x^2 + \cdots)(1 + x^2 + x^4 + \cdots) = \dfrac{1}{(1 - x)(1 - x^2)} = \dfrac{1}{(1 - x)^2(1 + x)}$.
2. Nastavek: $\dfrac{1}{(1-x)^2(1+x)} = \dfrac{K}{1 - x} + \dfrac{L}{(1 - x)^2} + \dfrac{M}{1 + x}$, torej $1 = K(1 - x)(1 + x) + L(1 + x) + M(1 - x)^2$.
3. Pri $x = 1$: $1 = 2L$, $L = \tfrac12$. Pri $x = -1$: $1 = 4M$, $M = \tfrac14$. Pri $x = 0$: $1 = K + \tfrac12 + \tfrac14$, $K = \tfrac14$.
4. Koeficient pri $x^n$: $b_n = \tfrac14 + \tfrac12(n + 1) + \tfrac14(-1)^n = \dfrac{2n + 3 + (-1)^n}{4}$.
5. Za sod $n$: $b_n = \dfrac{2n + 4}{4} = \dfrac{n}{2} + 1$. Za lih $n$: $b_n = \dfrac{2n + 2}{4} = \dfrac{n + 1}{2} = \left\lfloor \dfrac n2 \right\rfloor + 1$. ✓
6. Odgovor: $B(x) = \frac{1}{(1-x)^2(1+x)}$ in $b_n = \lfloor n/2 \rfloor + 1$; na primer $5$ evrov plačaš na $3$ načine ($5 \times 1$, $2 + 3 \times 1$, $2 \cdot 2 + 1$).

## Drugače: Na sliki

Tlakovanje poti dolžine $4$; vsako tlakovanje se konča s ploščo $1$ ali $2$:

```
 konec z [1]:      konec z [2]:
 [1][1][1] [1]     [1][1] [ 2 ]
 [ 2 ][1]  [1]     [ 2 ]  [ 2 ]
 [1][ 2 ]  [1]
 3 = t_3           2 = t_2
```

Skupaj $t_4 = 3 + 2 = 5$. Leva skupina so vsa tlakovanja dolžine $3$ z dodano ploščo $1$, desna vsa tlakovanja dolžine $2$ z dodano ploščo $2$; nobeno tlakovanje ni šteto dvakrat.

Model ogljika iz Primera 1 kot pot proti negibni točki:

```
 a_n
 500 - - - - - - - - - - - -
 400            ___...--
 333      __..--
 250 __.--
     0     20    46     n
```

Razlika do $500$ se vsako leto pomnoži z $0{,}98$, zato se presežek negibni točki približuje vse počasneje.

## Drugače: Uporaba v stroki

**Analiza algoritmov.** Čas rekurzivnih programov opišejo rekurzije: naiven izračun Fibonaccijevih števil potrebuje $T(n) = T(n-1) + T(n-2) + 1$ korakov, kar raste kot $\varphi^n$; zato programerji uporabijo zanko ali pomnjenje. Hanojski stolp potrebuje $2^n - 1$ premikov.

**Digitalni filtri.** Filter z enačbo $y_n = 0{,}9\,y_{n-1} + 0{,}1\,x_n$ gladi meritve (na primer temperature s postaje): izhod je rekurzija prvega reda. Pogoj za stabilnost filtra je, da so vsi koreni karakterističnega polinoma po absolutni vrednosti manjši od $1$.

**Populacijski in podnebni modeli.** Modeli populacij po starostnih razredih (Lesliejeve matrike) za ribe ali gozdove so sistemi linearnih rekurzij; prevladujoči koren pove dolgoročno rast ali upad populacije. Preprosti modeli ogljičnega kroga z več zalogovniki (ozračje, površinski in globoki ocean) so prav tako linearne rekurzije z več časovnimi konstantami.

**Finance.** Odplačilo posojila s stalnim obrokom je rekurzija $d_{n+1} = (1 + i)d_n - R$; negibna točka in eksplicitna formula dasta obrok, ki dolg odplača v danem številu let.

## Drugače: Korak za korakom s številkami

Reši $a_n = 4a_{n-1} - 4a_{n-2}$, $a_0 = 1$, $a_1 = 6$.

1. **Karakteristični polinom:** $r^2 - 4r + 4 = (r - 2)^2$, dvojni koren $2$.
2. **Splošna rešitev:** $a_n = (C_1 + C_2n)2^n$.
3. **$n = 0$:** $C_1 = 1$.
4. **$n = 1$:** $(1 + C_2) \cdot 2 = 6$, torej $C_2 = 2$.
5. **Rešitev:** $a_n = (1 + 2n)2^n$.
6. **Preizkus:** $a_2 = 4 \cdot 6 - 4 \cdot 1 = 20$ in $(1 + 4) \cdot 4 = 20$; $a_3 = 4 \cdot 20 - 4 \cdot 6 = 56$ in $(1 + 6) \cdot 8 = 56$. ✓

## Drugače: Bolj natančno

**Matrična oblika.** Rekurzijo reda $k$ zapišemo kot $\vec{u}_{n+1} = M\vec{u}_n$ z $\vec{u}_n = (a_{n+k-1}, \ldots, a_n)$ in spremljevalno matriko $M$, katere karakteristični polinom je ravno $p$. Rešitev je $\vec{u}_n = M^n\vec{u}_0$; lastne vrednosti $M$ so koreni $p$, večkratni koreni pa ustrezajo Jordanovim blokom (od tod faktorji $n^j$).

**Kompleksni koreni.** Rekurzija $a_n = a_{n-1} - a_{n-2}$ ima korena $e^{\pm i\pi/3}$, zato so rešitve periodične s periodo $6$: na primer $1, 1, 0, -1, -1, 0, 1, \ldots$

**Formalne vrste.** Rodovna funkcija je element kolobarja formalnih potenčnih vrst $\mathbb{R}[[x]]$; vrsta je obrnljiva natanko tedaj, ko ima prost člen različen od nič. Zato je deljenje z $1 - 2x - 2x^2$ v Nalogi 1 dovoljeno ne glede na konvergenco.

## Preveri se

? Programer zapiše: »Število klicev funkcije zadošča $k_n = k_{n-1} + k_{n-2} + 1$.« Kaj je ta rekurzija?
- Homogena linearna rekurzija drugega reda.
~ Člen $+1$ ni odvisen od prejšnjih členov, zato rekurzija ni homogena.
+ Nehomogena linearna rekurzija drugega reda s konstantnimi koeficienti.
- Nelinearna rekurzija, ker ima prost člen.
~ Prost člen linearnosti ne pokvari; nelinearna bi bila, če bi nastopal na primer $k_{n-1}^2$ ali $k_{n-1}k_{n-2}$.
> Koeficienta pri $k_{n-1}$ in $k_{n-2}$ sta stalna, člen $f(n) = 1$ pa je od nič različen: nehomogena linearna rekurzija reda $2$.

? Razvrsti rešitve od najpočasneje do najhitreje rastoče za velike $n$: (A) $2^n$; (B) $n2^n$; (C) $\varphi^n$ z $\varphi \approx 1{,}618$; (D) $3^n$.
- A, C, B, D
~ $\varphi^n$ raste počasneje od $2^n$, ker je $\varphi < 2$.
+ C, A, B, D
- C, A, D, B
~ $n2^n/3^n = n(2/3)^n \to 0$, zato $3^n$ prehiti $n2^n$.
> Najprej odloča osnova: $\varphi < 2 < 3$. Faktor $n$ pri isti osnovi pospeši rast, a ne dovolj, da bi prehitel večjo osnovo.

? Kaj se zgodi z rešitvijo rekurzije $a_n = 5a_{n-1} - 6a_{n-2}$, če spremenimo začetni vrednosti?
+ Spremenita se le konstanti v $\alpha 2^n + \beta 3^n$; oblika ostane enaka.
- Spremenijo se koreni karakterističnega polinoma.
~ Karakteristični polinom je odvisen le od koeficientov rekurzije, ne od začetnih vrednosti.
- Rešitev morda ne obstaja več.
~ Po izreku o enoličnosti za vsaki začetni vrednosti obstaja natanko ena rešitev.
> Začetni vrednosti določita le $\alpha$ in $\beta$; korena $2$ in $3$ sta lastnost rekurzije. Pri posebnih začetnih vrednostih je lahko $\beta = 0$ in zaporedje raste le kot $2^n$.

? Zaporedje zadošča $a_n = a_{n-1} + 2a_{n-2}$ z $a_0 = 1$ in $a_1 = 1$. Koliko je $a_5$?
- $11$
~ To je $a_4$: $1, 1, 3, 5, 11$. Šteti začni pri $a_0$.
+ $21$
- $43$
~ To je $a_6$; zaporedje je $1, 1, 3, 5, 11, 21, 43$.
> $a_2 = 1 + 2 = 3$, $a_3 = 3 + 2 = 5$, $a_4 = 5 + 6 = 11$, $a_5 = 11 + 10 = 21$.

? Kolikšen je koeficient pri $x^4$ v razvoju $\dfrac{1}{(1 - x)^2}$?
- $4$
~ Koeficient pri $x^n$ je $n + 1$, ne $n$: pri $x^0$ je že $1$.
- $1$
~ $1$ so koeficienti razvoja $\frac{1}{1-x}$; kvadrat imenovalca da naraščajoče koeficiente.
+ $5$
> $\frac{1}{(1-x)^2} = \sum (n + 1)x^n = 1 + 2x + 3x^2 + 4x^3 + 5x^4 + \cdots$, zato je koeficient $5$.

:::simboli
a | zaporedje $(a_n)$ | | | $a^*$ je negibna točka $b/(1-q)$
a_n | $n$-ti člen zaporedja | | | v Primeru 1 presežek ogljika v Gt
a_{n-1}, a_{n-2}, a_{n-k} | prejšnji členi zaporedja | | |
a_0, a_1 | začetni vrednosti | | |
n | indeks člena (korak, leto) | | |
q | koeficient rekurzije prvega reda | | – | delež, ki ostane
b | prost člen rekurzije prvega reda | | | izpusti na leto
c_1, c_2, c_k | koeficienti rekurzije | | |
k | red rekurzije | | |
f | nehomogeni del (desna stran) $f(n)$ | | | $a_n^{(h)}$ homogeni, $a_n^{(p)}$ partikularni del rešitve
p | karakteristični polinom $p(r)$ | | | $p(r) = r^k - c_1r^{k-1} - \cdots - c_k$
r, r_1, r_2 | koreni karakterističnega polinoma | | |
C, C_1, C_2 | konstante splošne rešitve | | |
\alpha, \beta | konstanti splošne rešitve | | | v Primeru 3 pri $2^n$ in $3^n$
t_n | število tlakovanj poti dolžine $n$ | t_n = t_{n-1} + t_{n-2} | |
\varphi | zlato razmerje | \varphi = \frac{1 + \sqrt5}{2} | | približno 1,618
\psi | drugi koren | \psi = \frac{1 - \sqrt5}{2} | | približno −0,618
h_n | najmanjše število premikov hanojskega stolpa | h_n = 2h_{n-1} + 1 | |
A | rodovna funkcija $A(x)$ zaporedja $(a_n)$ | | | $A(x) = \sum a_nx^n$
H | rodovna funkcija $H(x)$ zaporedja $(h_n)$ | | |
x | formalna spremenljivka | | |
s | osnova v nehomogenem delu $P(n)s^n$ | | |
m | kratnost korena | | |
:::
