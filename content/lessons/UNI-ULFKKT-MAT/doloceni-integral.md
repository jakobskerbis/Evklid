---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Med poletno nevihto postavi na vrt valjast kozarec in vsakih deset minut z ravnilom izmeri višino vode v njem. Vremenska postaja ob tem poroča **jakost padavin** v milimetrih na uro, ki se med nevihto ves čas spreminja. Iz višine vode dobiš jakost z odvodom. Obratno pa jakost v vsakem kratkem koraku pomnožiš s trajanjem koraka in prispevke sešteješ: limita takih vsot je **določeni integral**, ki vrne višino vode v kozarcu. Na grafu jakosti je to **ploščina** pod krivuljo; iz iste zamisli dobimo prevoženo pot iz hitrosti, delo iz sile, ploščine likov, prostornine vrtenin in **povprečne vrednosti**.

Zamisel je stara več kot dva tisoč let: Arhimed je ploščino odseka parabole izračunal tako, da ga je napolnil z vse manjšimi trikotniki. Natančno definicijo z vsotami pravokotnikov je v 19. stoletju podal Bernhard Riemann, zato govorimo o Riemannovem integralu. Bistveno odkritje Newtona in Leibniza pa je bilo, da integral ni treba računati kot limito vsot, ker ga dobimo iz primitivne funkcije.

Predpostavljamo, da že znaš poiskati nedoločeni integral (primitivno funkcijo) osnovnih funkcij.

## Razlaga

Določeni integral najlaže razumeš, če ga postaviš ob dve stvari, ki ju že poznaš:

| | odvod | nedoločeni integral | določeni integral |
|---|---|---|---|
| vprašanje | kako hitro se količina spreminja? | katera funkcija ima dani odvod? | koliko se je nabralo od $a$ do $b$? |
| rezultat | funkcija $f'$ | družina funkcij $F + C$ | eno število |
| na grafu | naklon tangente | — | ploščina s predznakom |

Zadnji stolpec gradimo iz vsot, povezavo z drugim pa da Newton-Leibnizova formula (točka 6).

**1. Riemannova vsota.** Naj bo $f$ omejena funkcija na $[a, b]$. Interval razdelimo s točkami $a = x_0 < x_1 < \dots < x_n = b$ na $n$ podintervalov dolžin $\Delta x_i = x_i - x_{i-1}$. V vsakem podintervalu izberemo točko $\xi_i \in [x_{i-1}, x_i]$ in sestavimo **Riemannovo vsoto**

$$R = \sum_{i=1}^{n} f(\xi_i)\, \Delta x_i.$$

Vsak člen je ploščina pravokotnika z višino $f(\xi_i)$ in širino $\Delta x_i$. Vsota je približek ploščine pod grafom.

:::premisli
Funkcija $f$ na $[a, b]$ narašča in za $\xi_i$ vedno vzameš levo krajišče podintervala. Je Riemannova vsota večja ali manjša od prave ploščine?
---
Manjša. Naraščajoča funkcija ima na vsakem podintervalu najmanjšo vrednost v levem krajišču, zato vsak pravokotnik leži pod grafom.
:::

**2. Določeni integral.** Če se Riemannove vsote, ko gre največja dolžina podintervalov proti $0$, približujejo istemu številu ne glede na izbiro delitev in točk $\xi_i$, to število imenujemo **določeni integral** funkcije $f$ na $[a, b]$ in pišemo

$$\int_a^b f(x)\, dx = \lim_{\max \Delta x_i \to 0} \sum_{i=1}^{n} f(\xi_i)\, \Delta x_i.$$

Funkcija je tedaj **integrabilna** na $[a, b]$. Število $a$ je spodnja, $b$ zgornja meja, $f$ je integrand. Vsaka zvezna funkcija na zaprtem intervalu je integrabilna; prav tako omejena funkcija s končno mnogo skoki.

**Geometrijski pomen.** Integral je **ploščina s predznakom**: deli pod osjo $x$ štejejo negativno. Zato je $\int_0^{2\pi} \sin x\, dx = 0$, čeprav lik med grafom in osjo ni prazen.

**3. Lastnosti.** Za integrabilni $f$ in $g$ ter konstanti $\alpha$, $\beta$ velja:

- **linearnost:** $\int_a^b (\alpha f + \beta g)\, dx = \alpha \int_a^b f\, dx + \beta \int_a^b g\, dx$,
- **aditivnost:** $\int_a^b f\, dx = \int_a^c f\, dx + \int_c^b f\, dx$,
- **dogovor:** $\int_a^a f\, dx = 0$ in $\int_b^a f\, dx = -\int_a^b f\, dx$,
- **monotonost:** če je $f \le g$ na $[a, b]$, je $\int_a^b f\, dx \le \int_a^b g\, dx$,
- **ocena:** če je $m \le f(x) \le M$, je $m(b - a) \le \int_a^b f\, dx \le M(b - a)$.

**Simetrija.** Če je $f$ liha, je $\int_{-a}^{a} f(x)\, dx = 0$, ker se ploščini levo in desno od osi $y$ izničita. Če je $f$ soda, je $\int_{-a}^{a} f(x)\, dx = 2\int_0^a f(x)\, dx$. To pogosto prihrani računanje: $\int_{-2}^{2} x^5 \cos x\, dx = 0$ brez iskanja primitivne funkcije.

Ocena je uporabna, kadar integrala ne znamo izračunati natančno. Na primer za $f(x) = e^{-x^2}$ na $[0, 1]$ je $e^{-1} \le f(x) \le 1$, zato je $0{,}367 < \int_0^1 e^{-x^2}\, dx \le 1$. Ta integral se pojavlja pri normalni porazdelitvi v statistiki in ga ne moremo izraziti z elementarnimi funkcijami.

**4. Izrek o povprečni vrednosti.** Če je $f$ zvezna na $[a, b]$, obstaja $\xi \in [a, b]$, da je

$$\int_a^b f(x)\, dx = f(\xi)(b - a).$$

Število $\bar f = \dfrac{1}{b - a} \displaystyle\int_a^b f(x)\, dx$ je **povprečna vrednost** funkcije na $[a, b]$. Pravokotnik z višino $\bar f$ ima enako ploščino kot lik pod grafom.

**5. Osnovni izrek analize.** Naj bo $f$ zvezna na $[a, b]$. Funkcija

$$F(x) = \int_a^x f(t)\, dt$$

je odvedljiva in velja $F'(x) = f(x)$. Integral s spremenljivo zgornjo mejo je torej primitivna funkcija integranda. Odvajanje in integriranje sta nasprotni operaciji.

:::premisli
Koliko je $F(a)$ in zakaj $F$ narašča, kadar je $f > 0$?
---
$F(a) = \int_a^a f(t)\, dt = 0$. Ko zgornjo mejo premakneš v desno, dodaš pozitivno ploščino, zato $F$ narašča; enako pove $F' = f > 0$.
:::

**6. Newton-Leibnizova formula.** Če je $F$ katerakoli primitivna funkcija zvezne funkcije $f$ na $[a, b]$ (torej $F' = f$), je

$$\int_a^b f(x)\, dx = F(b) - F(a) = \Big[F(x)\Big]_a^b.$$

Postopek: (1) poiščemo nedoločeni integral, (2) vstavimo zgornjo mejo, (3) odštejemo vrednost pri spodnji meji. Konstanta $C$ se pri tem odšteje, zato je ne pišemo.

**Substitucija v določenem integralu.** Če uvedemo $t = g(x)$, spremenimo tudi meje: $\int_a^b f(g(x)) g'(x)\, dx = \int_{g(a)}^{g(b)} f(t)\, dt$. Tako se ni treba vračati k stari spremenljivki. Primer: pri $\int_0^1 2x e^{x^2}\, dx$ uvedemo $t = x^2$, $dt = 2x\, dx$; meji postaneta $t = 0$ in $t = 1$, zato je integral $\int_0^1 e^t\, dt = e - 1 \approx 1{,}718$.

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

Lik med grafom $f(x) = \sqrt{x}$, osjo $x$ in premico $x = 4$ zavrtimo okoli osi $x$. Dolžine so v decimetrih. Izračunaj prostornino nastale posode v litrih. Izračunaj tudi povprečno ploščino prečnega prereza.

**Podatki:** $f(x) = \sqrt{x}$, interval $[0, 4]$, enota dolžine $1\,\mathrm{dm}$, $1\,\mathrm{dm^3} = 1\,\mathrm{L}$
**Iščemo:** prostornino $V$ vrtenine in povprečno ploščino prereza $\bar A$

:::formula
$V = \pi \int_a^b f(x)^2\, dx$; povprečna vrednost $\bar A = \dfrac{1}{b - a} \displaystyle\int_a^b A(x)\, dx$, kjer je $A(x) = \pi f(x)^2$.
:::

**Rešitev:**

1. Kvadrat funkcije potrebujemo, ker je prerez krog s polmerom $f(x)$: $f(x)^2 = (\sqrt{x})^2 = x$.
2. $V = \pi \int_0^4 x\, dx = \pi \Big[\frac{x^2}{2}\Big]_0^4 = \pi \cdot \frac{16}{2} = 8\pi$.
3. Številsko: $8\pi \approx 25{,}13$, torej $V \approx 25{,}1\,\mathrm{dm^3} = 25{,}1\,\mathrm{L}$.
4. Prerez pri $x$ je krog s ploščino $A(x) = \pi x$ (v $\mathrm{dm^2}$).
5. Povprečna ploščina: $\bar A = \frac{1}{4 - 0} \cdot 8\pi = 2\pi \approx 6{,}28\,\mathrm{dm^2}$. Valj z višino $4\,\mathrm{dm}$ in tako osnovno ploskvijo ima isto prostornino.
6. Odgovor: posoda ima prostornino $8\pi\,\mathrm{dm^3} \approx 25{,}1\,\mathrm{L}$; povprečna ploščina prereza je $2\pi\,\mathrm{dm^2} \approx 6{,}28\,\mathrm{dm^2}$.

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
$h = F(2) - F(0) = 12 - 8 - 0 = 4\,\mathrm{mm}$, kar je $4$ litre vode na kvadratni meter. Povprečna jakost je $\bar i = \frac{4\,\mathrm{mm}}{2\,\mathrm{h}} = 2\,\mathrm{mm/h}$, manj od največje $i(1) = 3\,\mathrm{mm/h}$.
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

## Drugače: Na sliki

Nariši graf $y = x^2$ na $[0, 1]$ in pod njim štiri enako široke pravokotnike s širino $0{,}25$. Če višino vzameš v **desnem** krajišču vsakega podintervala, pravokotniki segajo čez graf; njihova vsota je **zgornja ocena**. Če višino vzameš v **levem** krajišču, so pravokotniki pod grafom; dobiš **spodnjo oceno**. Prava ploščina je vmes.

Ko podintervale ožamo, se »stopnice« vse bolj prilegajo krivulji in razlika med zgornjo in spodnjo oceno izgine. Ta skupna limita je integral.

Pri ploščini med grafoma si predstavljaj tanke navpične trakove: vsak ima višino $f(x) - g(x)$ (od spodnje do zgornje krivulje) in širino $dx$. Pri vrtenini pa je vsak trak zavrten v tanek kovanec s polmerom $f(x)$ in debelino $dx$; njegova prostornina je $\pi f(x)^2\, dx$.

## Drugače: Iz vsakdanjega življenja

**Povprečna koncentracija zdravila.** Koncentracija zdravila v krvi po zaužitju je v preprostem modelu $c(t) = 6t - t^2$ (v $\mathrm{mg/L}$, čas v urah) za $0 \le t \le 6\,\mathrm{h}$. Povprečna koncentracija v tem času je

$$\bar c = \frac{1}{6} \int_0^6 (6t - t^2)\, dt = \frac{1}{6}\Big[3t^2 - \frac{t^3}{3}\Big]_0^6 = \frac{1}{6}(108 - 72) = 6\,\mathrm{mg/L}.$$

Največja koncentracija je $c(3) = 9\,\mathrm{mg/L}$. V farmakologiji se integral koncentracije po času imenuje **AUC** (ploščina pod krivuljo) in meri skupno izpostavljenost zdravilu.

**Delo plina.** Pri izotermni razširitvi idealnega plina je tlak $p = \frac{nRT}{V}$, delo plina pa $W = \int_{V_1}^{V_2} p\, dV = nRT \ln\frac{V_2}{V_1}$. Za $n = 1\,\mathrm{mol}$, $T = 300\,\mathrm{K}$ in podvojitev prostornine je $W = 8{,}314\,\mathrm{J/(mol\,K)} \cdot 1\,\mathrm{mol} \cdot 300\,\mathrm{K} \cdot \ln 2 \approx 1729\,\mathrm{J}$.

**Zavorna pot.** Avto zavira tako, da se mu hitrost enakomerno zmanjšuje po zakonu $v(t) = 20\,\mathrm{m/s} - 4\,\mathrm{m/s^2} \cdot t$. Ustavi se, ko je $v = 0$, torej pri $t = 5\,\mathrm{s}$. Zavorna pot je $\int_0^5 (20 - 4t)\, dt = \Big[20t - 2t^2\Big]_0^5 = 100 - 50 = 50\,\mathrm{m}$. Na grafu hitrosti je to ploščina trikotnika s katetama $5\,\mathrm{s}$ in $20\,\mathrm{m/s}$.

**Pretok reke.** Če merimo pretok $Q(t)$ v $\mathrm{m^3/s}$, je prostornina vode, ki je pretekla v času od $t_1$ do $t_2$, enaka $\int_{t_1}^{t_2} Q(t)\, dt$. Hidrologi tako računajo količino vode ob poplavah.

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

**Dokaz osnovnega izreka analize.** Naj bo $F(x) = \int_a^x f(t)\, dt$. Za $h \neq 0$ je

$$\frac{F(x + h) - F(x)}{h} = \frac{1}{h} \int_x^{x+h} f(t)\, dt = f(\xi_h)$$

za neki $\xi_h$ med $x$ in $x + h$ (izrek o povprečni vrednosti). Ko gre $h \to 0$, gre $\xi_h \to x$, zaradi zveznosti pa $f(\xi_h) \to f(x)$. Torej je $F'(x) = f(x)$.

**Dokaz Newton-Leibnizove formule.** Če je $G$ poljubna primitivna funkcija, je $(G - F)' = 0$, zato je $G - F$ konstanta (posledica Lagrangeovega izreka). Torej $G(b) - G(a) = F(b) - F(a) = \int_a^b f(t)\, dt - 0$.

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
h | prirastek spremenljivke x; v primeru 4 višina padavin | | | h ≠ 0, nato h → 0
i | jakost padavin | | mm/h | v primeru 4
\bar i | povprečna jakost padavin | \bar i = \frac{1}{b - a} \int_a^b i(t)\, dt | mm/h |
\xi_h | točka med x in x + h | |
S | ploščina lika med grafoma | S = \int_a^b \big(f(x) - g(x)\big)\, dx | | velja, če je f ≥ g na [a, b]
g | spodnja funkcija (spodnji graf) | |
V | prostornina vrtenine | V = \pi \int_a^b f(x)^2\, dx |
A | ploščina prereza vrtenine | A(x) = \pi f(x)^2 |
\bar A | povprečna ploščina prereza | \bar A = \frac{1}{b - a} \int_a^b A(x)\, dx |
\bar c | povprečna koncentracija zdravila v krvi | \bar c = \frac{1}{b - a} \int_a^b c(t)\, dt | mg/L | v zgledu na intervalu od 0 do 6 h
:::
