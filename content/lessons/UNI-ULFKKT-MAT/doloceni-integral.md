---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Med poletno nevihto postavi na vrt valjast kozarec in vsakih deset minut z ravnilom izmeri višino vode v njem. Vremenska postaja ob tem poroča **jakost padavin** v milimetrih na uro, ki se med nevihto ves čas spreminja. Iz višine vode dobiš jakost z odvodom. Obratno pa jakost v vsakem kratkem koraku pomnožiš s trajanjem koraka in prispevke sešteješ: limita takih vsot je **določeni integral**, ki vrne višino vode v kozarcu. Na grafu jakosti je to **ploščina** pod krivuljo; iz iste zamisli dobimo prevoženo pot iz hitrosti, delo iz sile, ploščine likov, prostornine vrtenin in **povprečne vrednosti**.

Zamisel je stara več kot dva tisoč let: Arhimed je ploščino odseka parabole izračunal tako, da ga je napolnil z vse manjšimi trikotniki. Natančno definicijo z vsotami pravokotnikov je v 19. stoletju podal Bernhard Riemann, zato govorimo o Riemannovem integralu. Bistveno odkritje Newtona in Leibniza pa je bilo, da integrala ni treba računati kot limito vsot, ker ga dobimo iz primitivne funkcije.

Predpostavljamo, da že znaš poiskati nedoločeni integral (primitivno funkcijo) osnovnih funkcij.

## Razlaga

Določeni integral najlaže razumeš, če ga postaviš ob dve stvari, ki ju že poznaš:

| | odvod | nedoločeni integral | določeni integral |
|---|---|---|---|
| vprašanje | kako hitro se količina spreminja? | katera funkcija ima dani odvod? | koliko se je nabralo od $a$ do $b$? |
| rezultat | funkcija $f'$ | družina funkcij $F + C$ | eno število |
| na grafu | naklon tangente | — | ploščina s predznakom |

Zadnji stolpec gradimo iz vsot, povezavo s srednjim, z nedoločenim integralom, pa da Newton-Leibnizova formula (točka 6).

**1. Riemannova vsota.** Naj bo $f$ omejena funkcija na $[a, b]$. Interval razdelimo s točkami $a = x_0 < x_1 < \dots < x_n = b$ na $n$ podintervalov dolžin $\Delta x_i = x_i - x_{i-1}$. V vsakem podintervalu izberemo točko $\xi_i \in [x_{i-1}, x_i]$ in sestavimo **Riemannovo vsoto**

$$R = \sum_{i=1}^{n} f(\xi_i)\, \Delta x_i.$$

Vsak člen je ploščina pravokotnika z višino $f(\xi_i)$ in širino $\Delta x_i$. Vsota je približek ploščine pod grafom.

:::premisli
Funkcija $f$ na $[a, b]$ narašča in za $\xi_i$ vedno vzameš levo krajišče podintervala. Je Riemannova vsota večja ali manjša od prave ploščine?
---
Manjša. Naraščajoča funkcija ima na vsakem podintervalu najmanjšo vrednost v levem krajišču, zato vsak pravokotnik leži pod grafom.
:::

**2. Določeni integral.** Naj bo $f$ omejena na $[a, b]$. Funkcija $f$ je **integrabilna** na $[a, b]$, če obstaja število $I$ z lastnostjo: za vsak $\varepsilon > 0$ obstaja $\delta > 0$, da je $|R - I| < \varepsilon$ za vsako delitev z $\max \Delta x_i < \delta$ in vsako izbiro točk $\xi_i$. Število $I$ je **določeni integral** funkcije $f$ na $[a, b]$:

$$\int_a^b f(x)\, dx = \lim_{\max \Delta x_i \to 0} \sum_{i=1}^{n} f(\xi_i)\, \Delta x_i.$$

Število $a$ je spodnja, $b$ zgornja meja, $f$ je integrand.

**Izrek (zadostni pogoji za integrabilnost).** Če je $f$ zvezna na zaprtem intervalu $[a, b]$, je na njem integrabilna. Integrabilni sta tudi vsaka omejena funkcija s končno mnogo točkami nezveznosti in vsaka monotona funkcija na $[a, b]$. Omejenost sama ni dovolj (Dirichletova funkcija v razdelku Bolj natančno).

**Geometrijski pomen.** Integral je **ploščina s predznakom**: deli pod osjo $x$ štejejo negativno. Zato je $\int_0^{2\pi} \sin x\, dx = 0$, čeprav lik med grafom in osjo ni prazen.

**3. Lastnosti.** Za integrabilni $f$ in $g$ ter konstanti $\alpha$, $\beta$ velja:

- **linearnost:** $\int_a^b (\alpha f + \beta g)\, dx = \alpha \int_a^b f\, dx + \beta \int_a^b g\, dx$,
- **aditivnost:** $\int_a^b f\, dx = \int_a^c f\, dx + \int_c^b f\, dx$,
- **dogovor:** $\int_a^a f\, dx = 0$ in $\int_b^a f\, dx = -\int_a^b f\, dx$,
- **monotonost:** če je $f \le g$ na $[a, b]$, je $\int_a^b f\, dx \le \int_a^b g\, dx$,
- **ocena:** če je $m \le f(x) \le M$ na $[a, b]$, je $m(b - a) \le \int_a^b f\, dx \le M(b - a)$ (monotonost, uporabljena na konstantah $m$ in $M$),
- **absolutna vrednost:** $\left|\int_a^b f\, dx\right| \le \int_a^b |f|\, dx$ (iz $-|f| \le f \le |f|$).

**Simetrija.** Naj bo $f$ integrabilna na $[-a, a]$. Če je $f$ liha, je $\int_{-a}^{a} f(x)\, dx = 0$, ker se ploščini levo in desno od osi $y$ izničita (s substitucijo $x = -t$ je $\int_{-a}^0 f\,dx = \int_0^a f(-t)\,dt = -\int_0^a f\,dt$). Če je $f$ soda, je $\int_{-a}^{a} f(x)\, dx = 2\int_0^a f(x)\, dx$. To pogosto prihrani računanje: $\int_{-2}^{2} x^5 \cos x\, dx = 0$ brez iskanja primitivne funkcije.

Ocena je uporabna, kadar integrala ne znamo izračunati natančno. Na primer za $f(x) = e^{-x^2}$ na $[0, 1]$ je $e^{-1} \le f(x) \le 1$, zato je $0{,}367 < \int_0^1 e^{-x^2}\, dx \le 1$. Ta integral se pojavlja pri normalni porazdelitvi v statistiki in ga ne moremo izraziti z elementarnimi funkcijami.

**4. Izrek o povprečni vrednosti.** Če je $f$ zvezna na $[a, b]$, obstaja $\xi \in [a, b]$, da je

$$\int_a^b f(x)\, dx = f(\xi)(b - a).$$

Število $\bar f = \dfrac{1}{b - a} \displaystyle\int_a^b f(x)\, dx$ je **povprečna vrednost** funkcije na $[a, b]$. Pravokotnik z višino $\bar f$ ima enako ploščino kot lik pod grafom.

*Dokaz.* Zvezna funkcija na $[a, b]$ zavzame najmanjšo vrednost $m$ in največjo $M$. Po oceni je $m \le \bar f \le M$, po izreku o vmesnih vrednostih pa obstaja $\xi \in [a, b]$ s $f(\xi) = \bar f$. Brez zveznosti izrek ne velja: za $f = 0$ na $[0, 1)$ in $f = 1$ na $[1, 2]$ je $\bar f = \frac{1}{2}$, vrednosti $\frac12$ pa $f$ ne zavzame.

**5. Osnovni izrek analize.** Naj bo $f$ zvezna na $[a, b]$. Funkcija

$$F(x) = \int_a^x f(t)\, dt$$

je odvedljiva na $[a, b]$ (v krajiščih enostransko) in velja $F'(x) = f(x)$. Integral s spremenljivo zgornjo mejo je torej primitivna funkcija integranda. Odvajanje in integriranje sta nasprotni operaciji.

*Dokaz.* Za $h \neq 0$ je po aditivnosti in izreku o povprečni vrednosti
$$\frac{F(x + h) - F(x)}{h} = \frac{1}{h} \int_x^{x+h} f(t)\, dt = f(\xi_h)$$
za neki $\xi_h$ med $x$ in $x + h$. Ko gre $h \to 0$, gre $\xi_h \to x$, zaradi zveznosti pa $f(\xi_h) \to f(x)$.

Če je zgornja meja odvedljiva funkcija $u(x)$, po verižnem pravilu velja $\frac{d}{dx}\int_a^{u(x)} f(t)\,dt = f(u(x))\,u'(x)$.

:::premisli
Koliko je $F(a)$? Pojasni s ploščino, ne z odvodom: zakaj $F$ narašča, kadar je $f > 0$?
---
$F(a) = \int_a^a f(t)\, dt = 0$. Ko zgornjo mejo premakneš v desno, dodaš pozitivno ploščino, zato $F$ narašča; enako pove $F' = f > 0$.
:::

**6. Newton-Leibnizova formula.** Če je $F$ katerakoli primitivna funkcija zvezne funkcije $f$ na $[a, b]$ (torej $F' = f$), je

$$\int_a^b f(x)\, dx = F(b) - F(a) = \Big[F(x)\Big]_a^b.$$

*Dokaz.* Funkcija $\Phi(x) = \int_a^x f(t)\,dt$ je po osnovnem izreku primitivna funkcija $f$. Ker je $(F - \Phi)' = 0$, je $F - \Phi$ na intervalu konstanta (posledica Lagrangeovega izreka), zato je $F(b) - F(a) = \Phi(b) - \Phi(a) = \int_a^b f(t)\,dt - 0$.

Postopek: (1) poiščemo nedoločeni integral, (2) vstavimo zgornjo mejo, (3) odštejemo vrednost pri spodnji meji. Konstanta $C$ se pri tem odšteje, zato je ne pišemo. Če $f$ na $[a, b]$ ni omejena, formule ne smemo uporabiti.

**Substitucija v določenem integralu.** Naj bo $g$ zvezno odvedljiva na $[a, b]$ in $f$ zvezna na $g([a, b])$. Če uvedemo $t = g(x)$, spremenimo tudi meje: $\int_a^b f(g(x)) g'(x)\, dx = \int_{g(a)}^{g(b)} f(t)\, dt$. (Če je $F' = f$, je $(F \circ g)' = f(g)\,g'$, zato sta obe strani enaki $F(g(b)) - F(g(a))$.) Tako se ni treba vračati k stari spremenljivki. Primer: pri $\int_0^1 2x e^{x^2}\, dx$ uvedemo $t = x^2$, $dt = 2x\, dx$; meji postaneta $t = 0$ in $t = 1$, zato je integral $\int_0^1 e^t\, dt = e - 1 \approx 1{,}718$.

Za zvezno odvedljivi $u$ in $v$ velja tudi **integracija po delih** z mejami: $\int_a^b u v'\, dx = \Big[uv\Big]_a^b - \int_a^b u' v\, dx$.

**7. Ploščina.** Ploščina lika med grafom $f$ in osjo $x$ na $[a, b]$ je $\int_a^b |f(x)|\, dx$; interval razdelimo pri ničlah in dele pod osjo vzamemo z obrnjenim predznakom. Ploščina lika med grafoma $f \ge g$ na $[a, b]$ je

$$S = \int_a^b \big(f(x) - g(x)\big)\, dx.$$

Meji sta pogosto presečišči grafov, ki ju dobimo iz enačbe $f(x) = g(x)$. Če se grafa vmes sekata, interval razdelimo in na vsakem delu odštejemo spodnji graf od zgornjega; v splošnem je $S = \int_a^b |f(x) - g(x)|\, dx$. Za ploščino lika med sinusoido in osjo $x$ na $[0, 2\pi]$ tako dobimo $\int_0^{\pi} \sin x\, dx - \int_{\pi}^{2\pi} \sin x\, dx = 2 + 2 = 4$.

**8. Prostornina vrtenine.** Ko lik pod grafom $f \ge 0$ na $[a, b]$ zavrtimo okoli osi $x$, nastane vrtenina. Prerez pri $x$ je krog s polmerom $f(x)$ in ploščino $\pi f(x)^2$. Seštejemo tanke rezine:

$$V = \pi \int_a^b f(x)^2\, dx.$$

**9. Druge uporabe.** Pot iz hitrosti $s = \int_{t_1}^{t_2} v(t)\, dt$, delo spremenljive sile $W = \int_{x_1}^{x_2} F(x)\, dx$, sprememba količine iz hitrosti spreminjanja $\Delta Q = \int Q'(t)\, dt$, dolžina krivulje $\ell = \int_a^b \sqrt{1 + f'(x)^2}\, dx$.

## Rešeni primeri

### Primer 1 (lažji)

Izračunaj $\displaystyle \int_1^3 (3x^2 - 2x)\, dx$.

**Podatki:** integrand $f(x) = 3x^2 - 2x$, spodnja meja $a = 1$, zgornja meja $b = 3$
**Iščemo:** vrednost določenega integrala

:::formula
Newton-Leibnizova formula: $\int_a^b f(x)\, dx = F(b) - F(a)$, kjer je $F' = f$. Za potence: $\int x^n\, dx = \frac{x^{n+1}}{n + 1}$.
:::

**Rešitev:**

1. Primitivna funkcija: $F(x) = 3 \cdot \frac{x^3}{3} - 2 \cdot \frac{x^2}{2} = x^3 - x^2$.
2. Preizkus z odvodom: $F'(x) = 3x^2 - 2x = f(x)$.
3. Vstavimo zgornjo in spodnjo mejo: $F(3) = 27 - 9 = 18$ in $F(1) = 1 - 1 = 0$.
4. $\int_1^3 (3x^2 - 2x)\, dx = 18 - 0 = 18$.
5. Odgovor: integral je enak $18$. Ker je $f > 0$ na $[1, 3]$, je to tudi ploščina lika pod grafom.

### Primer 2

Izračunaj ploščino lika, ki ga omejujeta parabola $y = 4 - x^2$ in premica $y = x + 2$.

**Podatki:** $f(x) = 4 - x^2$, $g(x) = x + 2$
**Iščemo:** ploščino $S$ lika med grafoma

:::formula
$S = \int_a^b \big(f(x) - g(x)\big)\, dx$, kjer je $f \ge g$ na $[a, b]$, meji $a$ in $b$ pa sta rešitvi enačbe $f(x) = g(x)$.
:::

**Rešitev:**

1. Presečišči: $4 - x^2 = x + 2 \iff x^2 + x - 2 = 0 \iff (x + 2)(x - 1) = 0$, torej $a = -2$, $b = 1$.
2. Kateri graf je zgoraj: pri $x = 0$ je $f(0) = 4 > g(0) = 2$, zato je parabola nad premico.
3. Razlika (zgornji graf minus spodnji, da je integrand nenegativen): $f(x) - g(x) = 2 - x - x^2$.
4. Primitivna funkcija: $F(x) = 2x - \frac{x^2}{2} - \frac{x^3}{3}$.
5. $F(1) = 2 - \frac{1}{2} - \frac{1}{3} = \frac{7}{6}$ in $F(-2) = -4 - 2 + \frac{8}{3} = -\frac{10}{3}$.
6. $S = \frac{7}{6} + \frac{10}{3} = \frac{7}{6} + \frac{20}{6} = \frac{27}{6} = \frac{9}{2}$.
7. Odgovor: ploščina lika je $\frac{9}{2} = 4{,}5$ kvadratne enote.

### Primer 3 (težji)

Lik med grafom $f(x) = \sqrt{x}$, osjo $x$ in premico $x = 4$ zavrtimo okoli osi $x$. Dolžine so v decimetrih. Nastalo posodo postavimo pokonci, s temenom navzdol, tako da je $x$ višina nad dnom. Izračunaj prostornino posode v litrih in povprečno ploščino prečnega prereza. Do katere višine sega voda, ko je posoda polna do polovice prostornine? Kako hitro se dviga gladina pri višini $2\,\mathrm{dm}$, če doteka $0{,}5\,\mathrm{L/s}$?

**Podatki:** $f(x) = \sqrt{x}$, interval $[0, 4]$, enota dolžine $1\,\mathrm{dm}$, $1\,\mathrm{dm^3} = 1\,\mathrm{L}$, dotok $\frac{dV}{dt} = 0{,}5\,\mathrm{L/s}$
**Iščemo:** prostornino $V$, povprečno ploščino prereza $\bar A$, višino $h_{1/2}$ pri polovični prostornini in hitrost dviganja gladine $\frac{dh}{dt}$ pri $h = 2\,\mathrm{dm}$

:::formula
$V = \pi \int_a^b f(x)^2\, dx$; povprečna vrednost $\bar A = \dfrac{1}{b - a} \displaystyle\int_a^b A(x)\, dx$, kjer je $A(x) = \pi f(x)^2$. Osnovni izrek: $\frac{d}{dh}\int_0^h A(x)\,dx = A(h)$.
:::

**Rešitev:**

1. Kvadrat funkcije potrebujemo, ker je prerez krog s polmerom $f(x)$: $f(x)^2 = (\sqrt{x})^2 = x$.
2. $V = \pi \int_0^4 x\, dx = \pi \Big[\frac{x^2}{2}\Big]_0^4 = \pi \cdot \frac{16}{2} = 8\pi$.
3. Številsko: $8\pi \approx 25{,}13$, torej $V \approx 25{,}1\,\mathrm{dm^3} = 25{,}1\,\mathrm{L}$.
4. Prerez pri $x$ je krog s ploščino $A(x) = \pi x$ (v $\mathrm{dm^2}$).
5. Povprečna ploščina: $\bar A = \frac{1}{4 - 0} \cdot 8\pi = 2\pi \approx 6{,}28\,\mathrm{dm^2}$. Valj z višino $4\,\mathrm{dm}$ in tako osnovno ploskvijo ima isto prostornino.
6. Prostornina vode do višine $h$ je integral s spremenljivo zgornjo mejo: $V(h) = \pi \int_0^h x\, dx = \frac{\pi h^2}{2}$.
7. Polovica prostornine: $\frac{\pi h^2}{2} = 4\pi$, torej $h^2 = 8$ in $h_{1/2} = 2\sqrt{2} \approx 2{,}83\,\mathrm{dm}$. Gladina je pri polovični prostornini nad polovico višine, ker je posoda zgoraj širša.
8. Hitrost gladine: po osnovnem izreku je $\frac{dV}{dh} = A(h) = \pi h$, po verižnem pravilu pa $\frac{dV}{dt} = \pi h \frac{dh}{dt}$.
9. Pri $h = 2\,\mathrm{dm}$: $\frac{dh}{dt} = \frac{0{,}5\,\mathrm{dm^3/s}}{2\pi\,\mathrm{dm^2}} = 0{,}0796\,\mathrm{dm/s} \approx 0{,}80\,\mathrm{cm/s}$.
10. Odgovor: posoda ima prostornino $8\pi\,\mathrm{dm^3} \approx 25{,}1\,\mathrm{L}$; povprečna ploščina prereza je $2\pi\,\mathrm{dm^2} \approx 6{,}28\,\mathrm{dm^2}$; polovica prostornine sega do višine $2{,}83\,\mathrm{dm}$, pri višini $2\,\mathrm{dm}$ pa se gladina dviga s hitrostjo približno $0{,}80\,\mathrm{cm/s}$.

### Primer 4 – zdaj ti

Poletna nevihta traja $2$ uri. Jakost padavin na vremenski postaji opisuje model $i(t) = 6t - 3t^2$ (v $\mathrm{mm/h}$, čas $t$ v urah). Koliko milimetrov dežja pade in kolikšna je povprečna jakost padavin med nevihto?

**Podatki:** $i(t) = 6t - 3t^2$ v $\mathrm{mm/h}$, $t$ v urah, interval $[0, 2]\,\mathrm{h}$
**Iščemo:** višino padavin $h$ in povprečno jakost $\bar i$

:::formula
$h = \int_0^2 i(t)\, dt$ (Newton-Leibniz: $F(b) - F(a)$); $\bar i = \dfrac{1}{b - a} \displaystyle\int_a^b i(t)\, dt$.
:::

**Rešitev:**

1. Primitivna funkcija: $F(t) = 6 \cdot \frac{t^2}{2} - 3 \cdot \frac{t^3}{3} = 3t^2 - t^3$; preizkus z odvodom da $6t - 3t^2$.
2. Vstavi meji $0$ in $2$, nato rezultat deli z dolžino intervala.

:::premisli
Koliko dežja pade in kolikšna je povprečna jakost?
---
$h = F(2) - F(0) = 12 - 8 - 0 = 4\,\mathrm{mm}$, kar so $4$ litri vode na kvadratni meter. Povprečna jakost je $\bar i = \frac{4\,\mathrm{mm}}{2\,\mathrm{h}} = 2\,\mathrm{mm/h}$, manj od največje $i(1) = 3\,\mathrm{mm/h}$.
:::

## Pogoste napake

- **Ploščina kot integral brez absolutne vrednosti.** $\int_0^{2\pi} \sin x\, dx = 0$, ploščina lika pa je $4$. Pri računanju ploščine razdeli interval pri ničlah funkcije.
- **Napačen vrstni red pri odštevanju.** Newton-Leibnizova formula je $F(b) - F(a)$: zgornja meja minus spodnja. Pri ploščini med grafoma odštej spodnji graf od zgornjega.
- **Pozabljene meje pri substituciji.** Ko uvedeš $t = g(x)$, spremeni meje v $g(a)$ in $g(b)$ ali pa se vrni k $x$ pred vstavljanjem. Mešanje obojega da napačen rezultat.
- **Kvadrat pri vrtenini.** Formula je $\pi \int f^2\, dx$, ne $\pi \int f\, dx$ ali $\left(\int f\, dx\right)^2$.
- **Integral čez pol.** $\int_{-1}^{1} \frac{1}{x^2}\, dx$ ni enak $\Big[-\frac{1}{x}\Big]_{-1}^{1} = -2$. Integrand v $0$ ni omejen, zato Newton-Leibnizove formule ne smemo uporabiti; ta posplošeni integral divergira.
- **Integral, zamenjan s ploščino pod osjo.** Če je $f < 0$ na vsem intervalu, je integral negativen; ploščina je njegova absolutna vrednost. Negativna ploščina kot končni odgovor je vedno znak napake.
- **Napačen faktor pri povprečju.** Povprečna vrednost je integral, deljen z dolžino intervala $b - a$, ne s številom točk.

## Povzetek

- Določeni integral je limita Riemannovih vsot $\sum f(\xi_i) \Delta x_i$; geometrijsko je ploščina s predznakom.
- Lastnosti: linearnost, aditivnost, monotonost, $\int_b^a = -\int_a^b$.
- Osnovni izrek analize: $\frac{d}{dx} \int_a^x f(t)\, dt = f(x)$ za zvezni $f$.
- Newton-Leibniz: $\int_a^b f(x)\, dx = F(b) - F(a)$, $F' = f$.
- Ploščina med grafoma: $\int_a^b (f - g)\, dx$, $f \ge g$; meje so presečišča.
- Vrtenina okoli osi $x$: $V = \pi \int_a^b f(x)^2\, dx$.
- Povprečna vrednost: $\bar f = \frac{1}{b - a} \int_a^b f(x)\, dx$.

## Za izpit

Znati moraš povedati:

- definicijo Riemannove vsote, integrabilnosti in določenega integrala ter zadostne pogoje za integrabilnost;
- lastnosti integrala (linearnost, aditivnost, monotonost, ocena) in kako ocena sledi iz monotonosti;
- izrek o povprečni vrednosti z vsemi pogoji in dokazom;
- osnovni izrek analize in Newton-Leibnizovo formulo z dokazoma;
- substitucijo v določenem integralu ter izpeljavo formul za ploščino med grafoma in prostornino vrtenine.

### Naloga 1

Parabola $y = 2x - x^2$ in os $x$ omejujeta lik. (a) Za katero vrednost parametra $k$ premica $y = kx$ razdeli lik na dva dela z enako ploščino? (b) Izračunaj prostornino vrtenine, ki nastane, ko ves lik zavrtimo okoli osi $x$.

**Rešitev:**

1. Ničli parabole sta $x = 0$ in $x = 2$, na $[0, 2]$ je $2x - x^2 \ge 0$. Ploščina lika: $S = \int_0^2 (2x - x^2)\, dx = \Big[x^2 - \frac{x^3}{3}\Big]_0^2 = 4 - \frac{8}{3} = \frac{4}{3}$.
2. Premica skozi izhodišče seka parabolo še pri $kx = 2x - x^2$, torej $x = 2 - k$; da je presečišče v $(0, 2)$, mora biti $0 < k < 2$.
3. Na $[0, 2 - k]$ je parabola nad premico. Ploščina vmes: $\int_0^{2-k} \big((2 - k)x - x^2\big)\, dx = \frac{(2 - k)^3}{2} - \frac{(2 - k)^3}{3} = \frac{(2 - k)^3}{6}$.
4. Pogoj za polovico: $\frac{(2 - k)^3}{6} = \frac{2}{3}$, torej $(2 - k)^3 = 4$ in $k = 2 - \sqrt[3]{4} \approx 2 - 1{,}587 = 0{,}413$.
5. Prostornina: $V = \pi \int_0^2 (2x - x^2)^2\, dx = \pi \int_0^2 (4x^2 - 4x^3 + x^4)\, dx$.
6. $V = \pi\Big[\frac{4x^3}{3} - x^4 + \frac{x^5}{5}\Big]_0^2 = \pi\left(\frac{32}{3} - 16 + \frac{32}{5}\right) = \frac{16\pi}{15} \approx 3{,}35$.
7. Odgovor: (a) $k = 2 - \sqrt[3]{4} \approx 0{,}413$; (b) $V = \frac{16\pi}{15} \approx 3{,}35$ kubične enote.

### Naloga 2

Natančno navedi osnovni izrek analize in ga dokaži. Nato za $G(x) = \int_0^{x^2} e^{-t^2}\, dt$ izračunaj $G'(x)$ in $\lim_{x \to 0} \frac{G(x)}{x^2}$.

**Rešitev:**

1. Izrek: naj bo $f$ zvezna na $[a, b]$; potem je $F(x) = \int_a^x f(t)\, dt$ odvedljiva na $[a, b]$ in $F'(x) = f(x)$.
2. Dokaz: $\frac{F(x + h) - F(x)}{h} = \frac{1}{h}\int_x^{x+h} f(t)\, dt = f(\xi_h)$ za neki $\xi_h$ med $x$ in $x + h$ (izrek o povprečni vrednosti); ko gre $h \to 0$, gre $\xi_h \to x$ in zaradi zveznosti $f(\xi_h) \to f(x)$.
3. Funkcija $e^{-t^2}$ je zvezna, zato je $\Phi(u) = \int_0^u e^{-t^2}\, dt$ odvedljiva s $\Phi'(u) = e^{-u^2}$, in $G(x) = \Phi(x^2)$.
4. Verižno pravilo: $G'(x) = \Phi'(x^2) \cdot 2x = 2x\, e^{-x^4}$.
5. Limita je oblike $\frac{0}{0}$, ker je $G(0) = 0$. Po L'Hospitalovem pravilu: $\lim_{x \to 0} \frac{G(x)}{x^2} = \lim_{x \to 0} \frac{2x\, e^{-x^4}}{2x} = \lim_{x \to 0} e^{-x^4} = 1$.
6. Odgovor: $G'(x) = 2x\, e^{-x^4}$, limita je $1$.

### Naloga 3

Utemelji, ali velja: če je $f$ zvezna in nenegativna na $[a, b]$ in je $\int_a^b f(x)\, dx = 0$, je $f(x) = 0$ za vse $x \in [a, b]$. Ali trditev velja tudi brez predpostavke o zveznosti oziroma o nenegativnosti?

**Rešitev:**

1. Trditev velja; dokažemo jo s protislovjem. Recimo, da je $f(c) > 0$ za neki $c \in [a, b]$.
2. Zaradi zveznosti obstaja interval $J \subseteq [a, b]$ z dolžino $\delta > 0$, ki vsebuje $c$ in na katerem je $f(x) > \frac{f(c)}{2}$.
3. Ker je $f \ge 0$, po aditivnosti in oceni velja $\int_a^b f\, dx \ge \int_J f\, dx \ge \frac{f(c)}{2}\,\delta > 0$, kar nasprotuje predpostavki.
4. Brez zveznosti ne velja: $f(x) = 0$ za $x \neq 1$ in $f(1) = 1$ na $[0, 2]$ je nenegativna in integrabilna z integralom $0$ (točka $1$ leži v največ dveh podintervalih, zato je vsaka Riemannova vsota med $0$ in $2\max \Delta x_i$, kar gre proti $0$).
5. Brez nenegativnosti ne velja: $f(x) = \sin x$ je zvezna na $[0, 2\pi]$, $\int_0^{2\pi} \sin x\, dx = 0$, a $f \not\equiv 0$.
6. Odgovor: za zvezne nenegativne funkcije trditev velja, brez katerekoli od obeh predpostavk pa ne.

## Drugače: Na sliki

Nariši graf $y = x^2$ na $[0, 1]$ in pod njim štiri enako široke pravokotnike s širino $0{,}25$. Če višino vzameš v **desnem** krajišču vsakega podintervala, pravokotniki segajo čez graf; njihova vsota je **zgornja ocena**. Če višino vzameš v **levem** krajišču, so pravokotniki pod grafom; dobiš **spodnjo oceno**. Prava ploščina je vmes.

Ko podintervale ožimo, se »stopnice« vse bolj prilegajo krivulji in razlika med zgornjo in spodnjo oceno izgine. Ta skupna limita je integral.

Pri ploščini med grafoma si predstavljaj tanke navpične trakove: vsak ima višino $f(x) - g(x)$ (od spodnje do zgornje krivulje) in širino $dx$. Pri vrtenini pa je vsak trak zavrten v tanek kovanec s polmerom $f(x)$ in debelino $dx$; njegova prostornina je $\pi f(x)^2\, dx$.

## Drugače: Uporaba v stroki

**Farmakokinetika.** Ploščina pod krivuljo koncentracije zdravila v plazmi, $\mathrm{AUC} = \int c(t)\, dt$, meri skupno izpostavljenost zdravilu. V preprostem modelu $c(t) = 6t - t^2$ (v $\mathrm{mg/L}$, $t$ v urah, $0 \le t \le 6\,\mathrm{h}$) je

$$\mathrm{AUC} = \int_0^6 (6t - t^2)\, dt = \Big[3t^2 - \frac{t^3}{3}\Big]_0^6 = 108 - 72 = 36\,\mathrm{mg\,h/L}, \qquad \bar c = \frac{36}{6} = 6\,\mathrm{mg/L},$$

največja koncentracija pa je $c(3) = 9\,\mathrm{mg/L}$. Razmerje AUC po zaužitju in po intravenski injekciji istega odmerka je **biološka uporabnost** zdravila.

**Kromatografija.** Detektor beleži signal v odvisnosti od časa. Ploščina vrha, $\int_{t_1}^{t_2} s(t)\, dt$, je sorazmerna z množino snovi; programska oprema jo izračuna numerično (trapezna metoda) in iz umeritvene premice določi koncentracijo.

**Delo plina.** Pri izotermni razširitvi idealnega plina je $p = \frac{nRT}{V}$ in $W = \int_{V_1}^{V_2} p\, dV = nRT \ln\frac{V_2}{V_1}$. Za $n = 1\,\mathrm{mol}$, $T = 300\,\mathrm{K}$ in podvojitev prostornine je $W = 8{,}314\,\mathrm{J/(mol\,K)} \cdot 1\,\mathrm{mol} \cdot 300\,\mathrm{K} \cdot \ln 2 \approx 1729\,\mathrm{J}$.

**Masna bilanca toka.** Če merimo pretok $Q(t)$ in koncentracijo $\gamma(t)$ v odtoku, je iztekla prostornina $\int_{t_1}^{t_2} Q\, dt$, masa onesnažila pa $\int_{t_1}^{t_2} \gamma(t)\,Q(t)\, dt$. Tako čistilne naprave računajo dnevne obremenitve, hidrologi pa količino vode ob poplavi.

## Drugače: Korak za korakom s številkami

Približno izračunajmo $\int_0^1 x^2\, dx$ z Riemannovimi vsotami za $n = 4$ in primerjajmo z natančno vrednostjo.

1. **Delitev.** $\Delta x = \frac{1 - 0}{4} = 0{,}25$; delilne točke so $0$; $0{,}25$; $0{,}5$; $0{,}75$; $1$.
2. **Leva vsota** (višina v levem krajišču): $0{,}25 \cdot (0^2 + 0{,}25^2 + 0{,}5^2 + 0{,}75^2) = 0{,}25 \cdot 0{,}875 = 0{,}21875$.
3. **Desna vsota:** $0{,}25 \cdot (0{,}25^2 + 0{,}5^2 + 0{,}75^2 + 1^2) = 0{,}25 \cdot 1{,}875 = 0{,}46875$.
4. **Vsota s sredinami** ($0{,}125$; $0{,}375$; $0{,}625$; $0{,}875$): $0{,}25 \cdot (0{,}015625 + 0{,}140625 + 0{,}390625 + 0{,}765625) = 0{,}25 \cdot 1{,}3125 = 0{,}328125$.
5. **Natančno** po Newton-Leibnizu: $\Big[\frac{x^3}{3}\Big]_0^1 = \frac{1}{3} \approx 0{,}33333$.
6. **Primerjava.** Leva vsota je prenizka, desna previsoka (funkcija narašča). Vsota s sredinami se razlikuje le za približno $0{,}0052$. Pri večjem $n$ se vse tri približajo $\frac{1}{3}$.

## Drugače: Bolj natančno

**Darbouxove vsote.** Za delitev $P$ naj bo $m_i = \inf_{[x_{i-1}, x_i]} f$ in $M_i = \sup_{[x_{i-1}, x_i]} f$. **Spodnja** in **zgornja** vsota sta $s(P) = \sum m_i \Delta x_i$ in $S(P) = \sum M_i \Delta x_i$. Funkcija je integrabilna natanko tedaj, ko za vsak $\varepsilon > 0$ obstaja delitev $P$ s $S(P) - s(P) < \varepsilon$. Tedaj je integral skupna vrednost $\sup_P s(P) = \inf_P S(P)$.

Za zvezno funkcijo na $[a, b]$ to sledi iz **enakomerne zveznosti**: za $\varepsilon > 0$ obstaja $\delta$, da je $|f(x) - f(y)| < \frac{\varepsilon}{b - a}$, kadar je $|x - y| < \delta$. Za delitev s podintervali, krajšimi od $\delta$, je $M_i - m_i < \frac{\varepsilon}{b - a}$ in zato $S(P) - s(P) < \varepsilon$.

**Neintegrabilna funkcija.** Omejenost ni dovolj za integrabilnost. Dirichletova funkcija $D(x)$ ima vrednost $1$ za racionalne in $0$ za iracionalne $x$. V vsakem podintervalu so tako racionalna kot iracionalna števila, zato je za vsako delitev $[0, 1]$ spodnja vsota $0$, zgornja pa $1$. Vsote se ne približajo, zato $D$ ni integrabilna v Riemannovem smislu. (V Lebesgueovi teoriji integrala, ki jo spoznajo študenti matematike v višjih letnikih, je njen integral $0$.)

**Posplošeni integral.** Če je meja neskončna ali integrand ni omejen, integral definiramo z limito, npr. $\int_1^\infty \frac{dx}{x^2} = \lim_{b \to \infty} \Big[-\frac{1}{x}\Big]_1^b = 1$. Integral $\int_1^\infty \frac{dx}{x}$ pa divergira, ker gre $\ln b \to \infty$.

## Preveri se

? Koliko je $\displaystyle \int_0^{\pi} \sin x\, dx$?
- $0$
~ To velja na $[0, 2\pi]$; na $[0, \pi]$ je sinus ves nad osjo, zato se nič ne izniči.
- $1$
~ Vstavil si le zgornjo mejo, $-\cos\pi = 1$, in pozabil odšteti $F(0) = -\cos 0 = -1$.
+ $2$
> $\Big[-\cos x\Big]_0^{\pi} = -\cos\pi + \cos 0 = 1 + 1 = 2$.

? Koliko je $\displaystyle \frac{d}{dx} \int_0^x e^{t^2}\, dt$?
+ $e^{x^2}$
- $2x e^{x^2}$
~ To je odvod funkcije $e^{x^2}$ po verižnem pravilu; odvajaš pa integral, ki vrne kar integrand pri zgornji meji.
- $e^{x^2} - 1$
~ Tako bi bilo, če bi bila $e^{t^2}$ primitivna funkcija integranda; ni, njen odvod je $2t e^{t^2}$.
> Po osnovnem izreku analize je odvod integrala s spremenljivo zgornjo mejo enak integrandu pri tej meji.

? Kolikšna je povprečna vrednost funkcije $f(x) = x^2$ na intervalu $[0, 3]$?
+ $3$
- $9$
~ To je integral; za povprečno vrednost ga moraš deliti še z dolžino intervala $3$.
- $4{,}5$
~ To je povprečje vrednosti v krajiščih $\frac{0 + 9}{2}$; za ukrivljen graf to ni povprečna vrednost funkcije.
> $\int_0^3 x^2\, dx = \frac{27}{3} = 9$, deljeno z dolžino intervala $3$ da $3$.

? Kolikšna je ploščina lika med grafom $y = x^3$ in osjo $x$ na intervalu $[-1, 1]$?
- $0$
~ To je integral s predznakom; pri ploščini del pod osjo šteje pozitivno.
+ $\frac{1}{2}$
- $\frac{1}{4}$
~ To je ploščina le na $[0, 1]$; enako velik del na $[-1, 0]$ si izpustil.
> $\int_{-1}^{1} x^3\, dx = 0$, ker se dela s predznakoma izničita. Ploščina je $2 \int_0^1 x^3\, dx = 2 \cdot \frac{1}{4} = \frac{1}{2}$.

? Katera vrstica »integriramo po času → dobimo« je pravilna?
- pospešek → prevožena pot
~ Integral pospeška da spremembo hitrosti; za pot moraš integrirati hitrost.
+ jakost padavin v $\mathrm{mm/h}$ → višina padavin v $\mathrm{mm}$
- prevožena pot → hitrost
~ Hitrost je odvod poti, integral gre v obratno smer; enota bi bila $\mathrm{m \cdot s}$, ne $\mathrm{m/s}$.
> Določeni integral hitrosti spreminjanja da nabrano količino; enote se ujemajo: $\mathrm{mm/h} \cdot \mathrm{h} = \mathrm{mm}$.

:::simboli
f | integrirana funkcija (integrand) | |
x | spremenljivka integracije | |
a | spodnja meja integracije | |
b | zgornja meja integracije | |
d | oznaka diferenciala | | | dx pove, po kateri spremenljivki integriramo
R | Riemannova vsota | R = \sum_{i=1}^{n} f(\xi_i)\, \Delta x_i |
n | število podintervalov | | | v ∫xⁿ dx eksponent potence, n ≠ −1
i | zaporedna številka podintervala | | | i = 1, …, n
\xi_i | izbrana točka v i-tem podintervalu | |
\Delta x_i | dolžina i-tega podintervala | \Delta x_i = x_i - x_{i-1} |
\Delta x | dolžina podintervala pri enakomerni delitvi | \Delta x = \frac{b - a}{n} |
\xi | točka iz izreka o povprečni vrednosti | | | ξ leži na [a, b]
F | primitivna funkcija funkcije f | F' = f |
F' | odvod primitivne funkcije | F' = f |
t | spremenljivka pod integralom | | | v primeru z zdravilom čas v urah
h | prirastek spremenljivke x; v primeru 3 višina gladine, v primeru 4 višina padavin | | | h ≠ 0, nato h → 0
i | jakost padavin | | mm/h | v primeru 4
\bar i | povprečna jakost padavin | \bar i = \frac{1}{b - a} \int_a^b i(t)\, dt | mm/h |
\xi_h | točka med x in x + h | |
S | ploščina lika med grafoma | S = \int_a^b \big(f(x) - g(x)\big)\, dx | | velja, če je f ≥ g na [a, b]
g | spodnja funkcija (spodnji graf) | |
V | prostornina vrtenine | V = \pi \int_a^b f(x)^2\, dx |
A | ploščina prereza vrtenine | A(x) = \pi f(x)^2 |
\bar A | povprečna ploščina prereza | \bar A = \frac{1}{b - a} \int_a^b A(x)\, dx |
k | smerni koeficient premice y = kx | | | Naloga 1
G | integral z zgornjo mejo x² | G(x) = \int_0^{x^2} e^{-t^2}\, dt | | Naloga 2
\Phi | integral s spremenljivo zgornjo mejo | \Phi(x) = \int_a^x f(t)\, dt | | primitivna funkcija f
Q | prostorninski pretok | | m³/s
\bar c | povprečna koncentracija zdravila v krvi | \bar c = \frac{1}{b - a} \int_a^b c(t)\, dt | mg/L | v zgledu na intervalu od 0 do 6 h
:::
