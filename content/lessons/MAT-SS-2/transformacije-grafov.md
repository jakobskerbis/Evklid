---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na kuhinjsko tehtnico postavi prazno skledo in je ne tariraj (ne ponastavi tehtnice na nič). Recimo, da pokaže $250\,\mathrm{g}$. Nato vanjo stresaj zvrhane žlice sladkorja in po vsaki zapiši maso. Če ena žlica tehta približno $15\,\mathrm{g}$, dobiš $250$, $265$, $280$, $295$ … Zdaj ponovi s tariro: tehtnica s skledo pokaže $0$, nato $15$, $30$, $45$ …

Nariši obe vrsti točk v isti graf. Ležita na dveh vzporednih premicah, ena je natanko $250$ enot višje od druge. Sprememba v poskusu (skleda brez tarire) je graf le **premaknila**, oblike ni spremenila. Ko bi namesto žlice uporabil čajno žličko, bi bila premica bolj položna. Graf bi se **skrčil**.

Tako delujejo tudi grafi funkcij. Če poznaš nekaj osnovnih grafov, na primer $x^2$, $|x|$ in $\sqrt{x}$, lahko z nekaj premiki, zrcaljenji in raztegi narišeš na stotine drugih, ne da bi računal tabelo za vsakega posebej.

## Razlaga

Začni s tabelo. Osnovna funkcija je $f(x) = x^2$. Zraven sta dve spremenjeni funkciji: prištevanje zunaj in odštevanje znotraj oklepaja.

| $x$ | $x^2$ | $x^2 + 2$ | $(x - 2)^2$ |
|---|---|---|---|
| $-1$ | $1$ | $3$ | $9$ |
| $0$ | $0$ | $2$ | $4$ |
| $1$ | $1$ | $3$ | $1$ |
| $2$ | $4$ | $6$ | $0$ |
| $3$ | $9$ | $11$ | $1$ |

V tretjem stolpcu je vsaka vrednost za $2$ večja. Graf se dvigne za $2$, teme parabole gre iz $(0, 0)$ v $(0, 2)$. V četrtem stolpcu so ista števila $0, 1, 4$ kot pri $x^2$, le dve vrstici niže: najmanjša vrednost $0$ je zdaj pri $x = 2$. Teme se je premaknilo v **desno** za $2$, čeprav smo $2$ odšteli.

**Vzporedni premik.** Iz vzorca dobimo pravili:

- $g(x) = f(x) + q$ premakne graf za $q$ navzgor (pri $q < 0$ navzdol);
- $g(x) = f(x - p)$ premakne graf za $p$ v desno (pri $p < 0$ v levo).

Zakaj v desno? Funkcija $g$ pri $x$ izračuna to, kar je $f$ izračunala pri $x - p$, torej $p$ enot bolj levo. Vsaka vrednost grafa $f$ se zato pri $g$ pojavi $p$ enot bolj desno.

:::premisli
Kam se premakne teme parabole $y = (x + 3)^2 - 1$? Napovej, nato preveri z eno vrednostjo.
---
V $(-3, -1)$. Ker je $x + 3 = x - (-3)$, je $p = -3$, premik za $3$ v levo, nato $1$ navzdol. Preizkus: pri $x = -3$ je $0^2 - 1 = -1$.
:::

**Zrcaljenje čez os $x$.** Pri $g(x) = -f(x)$ vsaka vrednost spremeni predznak. Točka $(x, y)$ preide v $(x, -y)$, parabola $x^2$ se obrne navzdol.

**Zrcaljenje čez os $y$.** Pri $g(x) = f(-x)$ ima $g$ pri $x$ tisto, kar je $f$ imela pri $-x$. Točka $(x, y)$ preide v $(-x, y)$. Graf $\sqrt{x}$ leži desno od osi $y$, graf $\sqrt{-x}$ pa levo, saj je definiran za $x \le 0$.

**Raztezanje v smeri osi $y$.** Pri $g(x) = a \cdot f(x)$ z $a > 0$ se vsaka vrednost pomnoži z $a$: točka $(x, y)$ preide v $(x, ay)$. Pri $a > 1$ se graf raztegne stran od osi $x$ in postane strmejši; pri $0 < a < 1$ se skrči proti osi $x$. Pri negativnem $a$ se poleg raztega še zrcali čez os $x$.

**Raztezanje v smeri osi $x$.** Pri $g(x) = f(kx)$ s $k > 0$ se graf v vodoravni smeri skrči s faktorjem $k$ (pri $0 < k < 1$ se v resnici raztegne). Točka $(x, y)$ preide v $\left(\frac{x}{k}, y\right)$. Tudi tu sprememba znotraj oklepaja deluje »obratno«: $k = 2$ graf stisne na polovico širine. Preizkus: $x^2$ doseže $4$ pri $x = 2$, $(2x)^2$ pa že pri $x = 1$.

**Več korakov hkrati.** Splošni predpis

$$g(x) = a \cdot f(x - p) + q$$

beri od znotraj navzven: premik za $p$ vodoravno, razteg in morebitno zrcaljenje z $a$, na koncu premik za $q$ navpično. Točka $(x, y)$ grafa $f$ preide v $(x + p,\ ay + q)$.

:::premisli
Graf $f(x) = |x|$ zrcališ čez os $y$. Kaj se zgodi in zakaj? Kaj pa, če čez os $y$ zrcališ $x^3$?
---
Graf $|x|$ se ne spremeni, ker je $|x|$ soda funkcija: $|-x| = |x|$, graf je že simetričen glede na os $y$. Pri $x^3$ dobiš $(-x)^3 = -x^3$: ker je $x^3$ liha, zrcaljenje čez os $y$ da isti graf kot zrcaljenje čez os $x$.
:::

V simulaciji spodaj, »Premik, zrcaljenje in raztezanje grafa«, izberi $f(x) = \sqrt{x}$ ter nastavi $p = 2$ in $q = -1$. Opazuj, kam se pomakne začetna točka grafa. Nato preklopi $b = -1$ (zrcaljenje čez os $y$) najprej pri $\sqrt{x}$ in potem pri $x^2$ ter primerjaj.

## Rešeni primeri

### Primer 1 (lažji): parabola s premikom

Nariši graf $g(x) = (x - 3)^2 + 1$ iz grafa $f(x) = x^2$. Kje je teme?

**Podatki:** $f(x) = x^2$, $g(x) = (x - 3)^2 + 1$
**Iščemo:** teme in nekaj točk grafa $g$

:::formula
$g(x) = f(x - p) + q$: premik za $p$ v desno in $q$ navzgor; $(x, y) \mapsto (x + p,\ y + q)$
:::

**Rešitev:**

1. Primerjamo z $f(x - p) + q$: $p = 3$, $q = 1$.
2. Teme $(0, 0)$ preide v $(0 + 3,\ 0 + 1) = (3, 1)$.
3. Točki $(1, 1)$ in $(-1, 1)$ grafa $f$ preideta v $(4, 2)$ in $(2, 2)$. Preizkus: $g(4) = 1^2 + 1 = 2$.
4. Točka $(2, 4)$ preide v $(5, 5)$; $g(5) = 2^2 + 1 = 5$.
5. Odgovor: graf $g$ je parabola $x^2$, premaknjena za $3$ v desno in $1$ navzgor, s temenom v $(3, 1)$.

### Primer 2: razteg in zrcaljenje

Opiši, kako iz grafa $f(x) = |x|$ dobiš graf $g(x) = -2|x| + 4$. Določi vrh, ničle in zalogo vrednosti.

**Podatki:** $f(x) = |x|$, $g(x) = -2|x| + 4$
**Iščemo:** zaporedje preslikav, vrh, ničle, $Z_g$

:::formula
$g(x) = a \cdot f(x) + q$ z $a = -2$, $q = 4$; $(x, y) \mapsto (x,\ ay + q)$
:::

**Rešitev:**

1. Faktor $2$ raztegne graf v smeri osi $y$: krak skozi $(1, 1)$ gre zdaj skozi $(1, 2)$, graf je strmejši.
2. Minus zrcali graf čez os $x$: »V« se obrne v »Λ«, točka $(1, 2)$ preide v $(1, -2)$.
3. Prištevanje $4$ dvigne vse za $4$: vrh $(0, 0)$ gre v $(0, 4)$, točka $(1, -2)$ v $(1, 2)$. Preizkus: $g(1) = -2 + 4 = 2$.
4. Ničle iz $-2|x| + 4 = 0$: $|x| = 2$, torej $x = -2$ ali $x = 2$.
5. Vrh je najvišja točka, zato $Z_g = (-\infty, 4]$.
6. Odgovor: graf $|x|$ raztegnemo s faktorjem $2$, zrcalimo čez os $x$ in premaknemo za $4$ navzgor. Vrh je $(0, 4)$, ničli $\pm 2$, zaloga vrednosti $(-\infty, 4]$.

### Primer 3 (težji): testo, ki čaka v hladilniku

V preprostem modelu se testo v toplem prostoru dvigne za $v(t) = 2\sqrt{t}$ centimetrov, kjer je $t$ čas v urah. Mojca zamesi testo visoko $4\,\mathrm{cm}$ in ga najprej za $1\,\mathrm{h}$ postavi v hladilnik, kjer ne vzhaja. Nato ga prestavi na toplo. Zapiši višino testa $h(t)$, merjeno od trenutka, ko ga je zamesila. Kdaj bo testo visoko $8\,\mathrm{cm}$?

**Podatki:** $v(t) = 2\sqrt{t}$ (cm, $t$ v h), začetna višina $4\,\mathrm{cm}$, zamik $1\,\mathrm{h}$, končna višina $8\,\mathrm{cm}$
**Iščemo:** predpis $h(t)$ in čas $t$, ko je $h(t) = 8$

:::formula
Zamik za $p$ v času: $v(t - p)$; dvig za $q$: $v(t - p) + q$
:::

**Rešitev:**

1. Vzhajanje se začne $1\,\mathrm{h}$ kasneje, zato graf $v$ premaknemo za $1$ v desno: $v(t - 1) = 2\sqrt{t - 1}$.
2. Testo ni začelo pri $0$, ampak pri $4\,\mathrm{cm}$, zato graf dvignemo za $4$: $h(t) = 2\sqrt{t - 1} + 4$ za $t \ge 1$.
3. Preizkus: $h(1) = 0 + 4 = 4$, kar je višina ob prestavitvi na toplo.
4. Enačba $2\sqrt{t - 1} + 4 = 8$ da $\sqrt{t - 1} = 2$, torej $t - 1 = 4$ in $t = 5$.
5. Odgovor: $h(t) = 2\sqrt{t - 1} + 4$; testo bo visoko $8\,\mathrm{cm}$ po $5$ urah od mešenja.

### Primer 4: zdaj ti

Parabola nastane iz grafa $f(x) = x^2$ z raztegom in premikom. Teme ima v $(-2, -3)$ in gre skozi točko $(0, 5)$. Zapiši njen predpis.

**Podatki:** $f(x) = x^2$, teme $(-2, -3)$, točka $(0, 5)$
**Iščemo:** predpis $g(x) = a(x - p)^2 + q$

:::formula
$g(x) = a(x - p)^2 + q$, teme je v $(p, q)$
:::

**Rešitev:**

1. Iz temena: $p = -2$, $q = -3$, zato $g(x) = a(x + 2)^2 - 3$.
2. Vstavimo točko $(0, 5)$: $5 = a \cdot 2^2 - 3$, torej $5 = 4a - 3$.
3. Izračunaj $a$ sam in zapiši predpis:

:::premisli
Koliko je $a$ in kako se glasi $g(x)$?
---
$4a = 8$, torej $a = 2$ in $g(x) = 2(x + 2)^2 - 3$. Preizkus: $g(0) = 2 \cdot 4 - 3 = 5$.
:::

## Pogoste napake

- **Minus v oklepaju pomeni levo.** Učenec vidi $(x - 2)^2$ in premakne graf v levo. Narobe: vrednost, ki jo je $f$ imela pri $0$, ima $g$ šele pri $x = 2$. Premik je v desno. Preveri tako, da poiščeš $x$, pri katerem je oklepaj enak $0$.
- **$f(x) + 2$ in $f(x + 2)$ sta isto.** Prvo dvigne graf za $2$, drugo ga premakne za $2$ v levo. Pri $x^2$: $x^2 + 2$ ima teme $(0, 2)$, $(x + 2)^2$ pa $(-2, 0)$.
- **Zamenjani osi pri zrcaljenju.** $-f(x)$ zrcali čez os $x$ (spremenijo se vrednosti), $f(-x)$ čez os $y$ (spremenijo se vhodi). Minus zunaj deluje na $y$, minus znotraj na $x$.
- **»Faktor $2$ naredi parabolo širšo.«** $2x^2$ ima pri $x = 1$ vrednost $2$, ne $1$: graf je višji in zato videti ožji. Širšo parabolo da faktor med $0$ in $1$, na primer $\frac{1}{2}x^2$.
- **Napačen vrstni red.** $2(x^2 + 1) = 2x^2 + 2$ ni isto kot $2x^2 + 1$. Razteg deluje na vse, kar je bilo prej; premik za $q$ pride na koncu.

## Povzetek

- $f(x) + q$: premik za $q$ navzgor ($q < 0$: navzdol).
- $f(x - p)$: premik za $p$ v desno ($p < 0$: v levo); sprememba v oklepaju deluje »obratno«.
- $-f(x)$: zrcaljenje čez os $x$; $f(-x)$: zrcaljenje čez os $y$ (soda funkcija se ne spremeni).
- $a \cdot f(x)$ z $a > 0$: razteg v smeri osi $y$ ($a > 1$ strmejši, $0 < a < 1$ položnejši).
- $f(kx)$ s $k > 0$: skrčitev v smeri osi $x$ s faktorjem $k$.
- $a \cdot f(x - p) + q$: točka $(x, y)$ preide v $(x + p,\ ay + q)$; teme $x^2$ gre v $(p, q)$.

## Drugače: Korak za korakom s številkami

Za $g(x) = 3\sqrt{x + 1} - 2$ sledi eni točki skozi vse korake.

1. Na grafu $f(x) = \sqrt{x}$ izberi lahke točke: $(0, 0)$, $(1, 1)$, $(4, 2)$.
2. Oklepaj $x + 1 = x - (-1)$ da $p = -1$: vsak $x$ zmanjšaj za $1$. Točke so $(-1, 0)$, $(0, 1)$, $(3, 2)$.
3. Faktor $3$ pomnoži vrednosti: $(-1, 0)$, $(0, 3)$, $(3, 6)$.
4. Na koncu odštej $2$ od vrednosti: $(-1, -2)$, $(0, 1)$, $(3, 4)$.
5. Preizkus pri $x = 3$: $g(3) = 3\sqrt{4} - 2 = 6 - 2 = 4$. Ujema se.
6. Graf začne v $(-1, -2)$, to je premaknjena začetna točka korena.

## Drugače: Kot zgodba

Parabola $x^2$ je kulisa na odru, ki jo trije odrski delavci premikajo, ne da bi jo izdelali znova. Prvi jo porine za $p$ v desno. Kar je prej stalo pri $0$, zdaj stoji pri $p$, zato mora biti oklepaj enak $0$ pri $x = p$: napiše $x - p$. Drugi jo z vrvmi raztegne navzgor, da je dvakrat višja: pred vse napiše $2$. Če jo obrne na glavo, doda še minus. Tretji z dvigalom dvigne pod odra za $q$ in na konec doda $+\,q$.

Ko na koncu pogledaš predpis $2(x - p)^2 + q$, iz njega razbereš vso zgodbo: kdo je kuliso porinil, kdo raztegnil in kdo dvignil. Kulisa je ves čas ista parabola, le premaknjena in raztegnjena.

## Preveri se

? Graf funkcije $f$ preslikamo v graf $g(x) = -f(x)$. Kateri opis ustreza?
- Zrcalna slika grafa $f$ čez os $y$.
~ Čez os $y$ zrcali $f(-x)$, kjer je minus pri vhodu. Tu je minus zunaj, pri vrednosti.
+ Zrcalna slika grafa $f$ čez os $x$.
- Zrcalna slika grafa $f$ čez premico $y = x$.
~ Čez $y = x$ dobiš graf inverzne funkcije, ne $-f(x)$.
> Vsaka točka $(x, y)$ preide v $(x, -y)$: vrednosti spremenijo predznak, kar je zrcaljenje čez os $x$.

? Oceni $g(2)$ za $g(x) = 2\sqrt{x + 1}$.
- približno $1{,}7$
~ To je $\sqrt{3}$. Pozabil si na razteg s faktorjem $2$.
- približno $2$
~ To je $2\sqrt{2 - 1}$: oklepaj si prebral kot premik v desno. Vstavi $x = 2$ v $x + 1$.
+ približno $3{,}5$
> $g(2) = 2\sqrt{3}$; $\sqrt{3} \approx 1{,}73$, dvakrat toliko je približno $3{,}46$.

? Zakaj graf $g(x) = f(x - 3)$ leži $3$ enote desno od grafa $f$?
- Ker se $3$ odšteje od vrednosti funkcije.
~ Odštevanje od vrednosti bi bilo $f(x) - 3$ in bi graf spustilo navzdol.
+ Ker $g$ pri $x$ zavzame vrednost, ki jo je $f$ imela pri $x - 3$, torej $3$ enote bolj levo.
- Ker vsak minus zrcali graf čez os $y$.
~ Zrcali le minus pred celim $x$, kot v $f(-x)$. Tu se od $x$ odšteva število.
> Vsaka vrednost grafa $f$ se pri $g$ pojavi $3$ enote kasneje, zato je cel graf premaknjen v desno.

? Graf funkcije $|x|$ premaknemo za $2$ v levo in za $1$ navzdol. Kateri predpis dobimo?
- $|x - 2| - 1$
~ $x - 2$ premakne v desno. Za levo potrebuješ $x + 2$.
+ $|x + 2| - 1$
- $|x - 1| + 2$
~ Zamenjal si vodoravni in navpični premik. Vodoravni je v oklepaju, navpični zunaj.
> Premik v levo za $2$: $x \to x + 2$; premik navzdol za $1$: na koncu $-1$. Vrh je v $(-2, -1)$.

? Graf $T(t)$ kaže, kako se segreva zrak v učilnici, ko hišnik ob času $t = 0$ vklopi ogrevanje. Jutri ga bo vklopil $5$ minut kasneje, vse drugo bo enako. Kateri predpis opisuje jutrišnjo temperaturo, merjeno od istega trenutka?
- $T(t + 5)$
~ Plus v oklepaju premakne graf v levo, segrevanje bi se začelo prej.
- $T(t) - 5$
~ To bi pomenilo zrak, ki je ves čas za $5$ stopinj hladnejši, ne zamika v času.
+ $T(t - 5)$
> Jutri ima zrak ob času $t$ tisto temperaturo, kot jo je danes imel ob $t - 5$. Graf se premakne za $5$ minut v desno.

:::simboli
f | osnovna funkcija | |
g | preslikana (transformirana) funkcija | g(x) = a \cdot f(x - p) + q |
x | neodvisna spremenljivka | |
y | vrednost osnovne funkcije | y = f(x) |
a | faktor raztega v smeri osi $y$ | | | pri $a < 0$ še zrcaljenje čez os $x$
p | vodoravni premik | | | $p > 0$ v desno
q | navpični premik | | | $q > 0$ navzgor
v | dvig testa v toplem | v(t) = 2\sqrt{t} | cm
t | čas od mešenja testa | | h
h | višina testa | h(t) = 2\sqrt{t - 1} + 4 | cm
k | faktor skrčitve v smeri osi $x$ | | | $k > 0$
:::
