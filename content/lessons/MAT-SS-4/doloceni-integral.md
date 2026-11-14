---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Trener atletike ima posnetek štarta: radar vsako stotinko sekunde izmeri hitrost šprinterja. Poti ne meri nihče. Pa vendar trener na centimeter natančno izračuna, koliko metrov je tekač pretekel v prvih štirih sekundah.

Skrivnost je v grafu hitrosti. Prepotovana pot je **ploščina lika pod grafom**. Ta lik ima ukrivljen rob, zato ga ne razrežeš na pravokotnike in trikotnike. Presenečenje pride šele zdaj: ploščino boš izračunal z nedoločenim integralom, torej z odvajanjem nazaj. Orodje, ki je nastalo za naklone tangent, meri ploščine. Zveni narobe, a prav to je ena najmočnejših zvez v matematiki.

Z isto idejo izračunaš tudi prostornino žoge za ragbi, stožca ali pokala, ki nastane z vrtenjem krivulje okoli osi.

## Razlaga

**1. Pot je ploščina.** Kolesar vozi $10$ sekund s stalno hitrostjo $6\,\mathrm{m/s}$. Na grafu $v(t)$ je to vodoravna daljica na višini $6$. Lik pod njo je pravokotnik s stranicama $10\,\mathrm{s}$ in $6\,\mathrm{m/s}$, njegova ploščina pa je $60\,\mathrm{m}$, ravno prevožena pot. Če hitrost enakomerno narašča, je lik trikotnik. Ko pa se graf ukrivi, potrebujemo nov način.

**2. Pravokotniki pod krivuljo.** Vzemimo najpreprostejšo krivuljo, $f(x) = x^2$ med $x = 0$ in $x = 1$. Predstavljaj si sliko: enotski kvadrat, v njem parabola, ki gre iz levega spodnjega v desni zgornji kot. Lik pod parabolo je tanek »rog« ob desnem robu.

Interval razdelimo na $n$ enako širokih delov, vsak je širok $\Delta x = \frac{1}{n}$. Nad vsakim delom narišemo pravokotnik. Parabola na $[0, 1]$ narašča. Če zato višino vzamemo na levem robu dela, so vsi pravokotniki pod krivuljo: njihova skupna ploščina je **spodnja vsota**. Če jo vzamemo na desnem robu, segajo čez krivuljo: to je **zgornja vsota**. Prava ploščina je vedno nekje vmes.

| $n$ | spodnja vsota | zgornja vsota | razlika |
|---|---|---|---|
| $4$ | $0{,}21875$ | $0{,}46875$ | $0{,}25$ |
| $10$ | $0{,}285$ | $0{,}385$ | $0{,}1$ |
| $100$ | $0{,}32835$ | $0{,}33835$ | $0{,}01$ |

Obe vsoti se stiskata k istemu številu, $\frac{1}{3}$. Lik pod parabolo zavzema natanko tretjino kvadrata. To je odkril že Arhimed, skoraj dva tisoč let pred iznajdbo odvoda.

:::premisli
Razlika med zgornjo in spodnjo vsoto je bila $0{,}25$; $0{,}1$ in $0{,}01$. Kolikšna bo pri $n = 1000$? Zakaj se tako lepo zmanjšuje?
---
$0{,}001$. Zgornja vsota ima iste pravokotnike kot spodnja, le premaknjene za en del v desno: izgubi prvega (višina $f(0) = 0$) in dobi novega na koncu (višina $f(1) = 1$, širina $\frac{1}{n}$). Razlika je torej $\frac{1}{n}$.
:::

V simulaciji spodaj (»Ploščina pod grafom in Riemannove vsote«) izberi funkcijo $x^2$ in počasi povečuj število pravokotnikov. Opazuj napako: pri vsakem pravilu (višina na levem robu, na desnem robu ali na sredini dela) se manjša, pri sredini pa najhitreje.

**3. Določeni integral.** Število, h kateremu se stiskajo vsote pravokotnikov, imenujemo **določeni integral** funkcije $f$ od $a$ do $b$ in ga zapišemo $\int_a^b f(x)\,dx$. Številu $a$ rečemo **spodnja meja**, številu $b$ **zgornja meja**, funkciji $f$ pa **integrand**. Znak $\int$ je raztegnjena črka S (vsota), $f(x)\,dx$ pa spominja na ploščino enega tankega pravokotnika z višino $f(x)$ in širino $dx$. Za razliko od nedoločenega integrala rezultat ni družina funkcij, ampak **eno število**.

**4. Zakaj pomaga odvajanje nazaj.** Naj bo $A(x)$ ploščina pod grafom od $a$ do $x$. Ko se $x$ premakne za majhen $h$ v desno, se ploščini doda tanek trak s širino $h$ in višino približno $f(x)$. Zato je $A(x + h) - A(x) \approx f(x) \cdot h$ in v limiti $A'(x) = f(x)$. Ploščina je torej primitivna funkcija integranda. Vsaka druga primitivna funkcija $F$ se od $A$ razlikuje le za konstanto, zato je $F(b) - F(a) = A(b) - A(a)$. Ker je $A(a) = 0$, za vsako primitivno funkcijo $F$ velja **Newton-Leibnizova formula**:

$$\int_a^b f(x)\,dx = F(b) - F(a)$$

Razliko krajše pišemo $F(x)\Big|_a^b$. Konstanta $C$ se pri odštevanju izniči, zato je ne pišemo. Preizkus: za $f(x) = x^2$ je $F(x) = \frac{x^3}{3}$ in $F(1) - F(0) = \frac{1}{3}$, natanko kot v tabeli.

**5. Predznak.** Kjer je graf pod osjo $x$, so »višine« pravokotnikov negativne, zato je tam integral negativen. Integral šteje ploščino nad osjo s plusom, pod osjo z minusom. Kadar iščeš **ploščino**, interval razdeli v ničlah funkcije in seštej absolutne vrednosti delnih integralov.

:::premisli
Napovej, koliko je $\int_{-1}^{1} x^3\,dx$, preden kaj računaš. Kolikšna pa je ploščina lika med grafom $y = x^3$ in osjo $x$ na tem intervalu?
---
Integral je $0$: graf je simetričen glede na izhodišče, del pod osjo je enako velik kot del nad njo. Ploščina pa je $2 \cdot \int_0^1 x^3\,dx = 2 \cdot \frac{1}{4} = \frac{1}{2}$.
:::

**6. Lastnosti določenega integrala.** Vse sledijo iz Newton-Leibnizove formule. Naj bo $F$ primitivna funkcija za $f$.

- **Enaki meji.** $\int_a^a f(x)\,dx = F(a) - F(a) = 0$: lik brez širine nima ploščine.
- **Zamenjava mej.** $\int_b^a f(x)\,dx = F(a) - F(b) = -\int_a^b f(x)\,dx$: ko meji zamenjaš, integral spremeni predznak.
- **Aditivnost glede na interval.** $\int_a^b f(x)\,dx + \int_b^c f(x)\,dx = \int_a^c f(x)\,dx$, saj je $\bigl(F(b) - F(a)\bigr) + \bigl(F(c) - F(b)\bigr) = F(c) - F(a)$. Lik z navpično črto pri $x = b$ razrežemo na dva dela, ploščini pa seštejemo. Zaradi zamenjave mej pravilo velja tudi, če $b$ ne leži med $a$ in $c$.
- **Linearnost.** Integral vsote je vsota integralov, $\int_a^b \bigl(f(x) + g(x)\bigr)\,dx = \int_a^b f(x)\,dx + \int_a^b g(x)\,dx$, konstantni faktor pa izpostavimo: $\int_a^b k\,f(x)\,dx = k\int_a^b f(x)\,dx$. Ti pravili že poznaš pri nedoločenem integralu.

Aditivnost smo že uporabili: v bloku 5 smo interval za ploščino razdelili v ničli. Številski zgled: če je $\int_0^2 f(x)\,dx = 3$ in $\int_0^5 f(x)\,dx = 7$, je $\int_2^5 f(x)\,dx = 7 - 3 = 4$ in $\int_5^2 f(x)\,dx = -4$.

**7. Ploščina med krivuljama.** Če je na intervalu $[a, b]$ graf $g$ ves čas nad grafom $f$, je ploščina vmes $\int_a^b \bigl(g(x) - f(x)\bigr)\,dx$: zgornja minus spodnja. Tanek trak pri $x$ je namreč visok $g(x) - f(x)$, ne glede na to, kje leži os $x$.

**8. Prostornina vrtenine (višja raven).** Graf $f$ zavrtimo okoli osi $x$. Nastane **vrtenina**, telo kot vaza ali žoga. Predstavljaj si, da jo narežeš kot salamo na tanke rezine. Vsaka rezina je skoraj valj s polmerom $f(x)$ in debelino $dx$, njena prostornina je $\pi f(x)^2\,dx$. Seštejemo vse rezine:

$$V = \pi \int_a^b f(x)^2\,dx$$

Kvadrat je tu zato, ker je osnovna ploskev rezine krog s ploščino $\pi r^2$.

## Rešeni primeri

### Primer 1 (lažji): štart šprinterja

Hitrost šprinterja v prvih štirih sekundah opisuje $v(t) = 4t - 0{,}5t^2$ (čas v sekundah, hitrost v $\mathrm{m/s}$). Koliko metrov preteče v tem času?

**Podatki:** $v(t) = 4t - 0{,}5t^2$ v $\mathrm{m/s}$, od $t = 0\,\mathrm{s}$ do $t = 4\,\mathrm{s}$
**Iščemo:** pot $s$

:::formula
$s = \int_0^4 v(t)\,dt = F(4) - F(0)$, kjer je $F' = v$
:::

**Rešitev:**

1. Primitivna funkcija po členih: $F(t) = 2t^2 - \frac{t^3}{6}$. Preizkus z odvajanjem: $F'(t) = 4t - 0{,}5t^2$.
2. Zgornja meja: $F(4) = 32 - \frac{64}{6} = \frac{64}{3} \approx 21{,}33$.
3. Spodnja meja: $F(0) = 0$.
4. $s = F(4) - F(0) \approx 21{,}3\,\mathrm{m}$.
5. Odgovor: šprinter v prvih štirih sekundah preteče približno $21{,}3\,\mathrm{m}$ in pri tem doseže hitrost $v(4) = 8\,\mathrm{m/s}$.

### Primer 2: ploščina, ko graf prečka os

Izračunaj ploščino lika med grafom $f(x) = x^2 - 2x - 3$ in osjo $x$ na intervalu $[0, 4]$.

**Podatki:** $f(x) = x^2 - 2x - 3$, $a = 0$, $b = 4$
**Iščemo:** ploščino $p$

:::formula
Interval razdeli v ničli, nato $p = \left|\int_0^3 f(x)\,dx\right| + \left|\int_3^4 f(x)\,dx\right|$
:::

**Rešitev:**

1. Ničle: $x^2 - 2x - 3 = (x - 3)(x + 1)$, na intervalu leži ničla $x = 3$. Na $[0, 3]$ je graf pod osjo, na $[3, 4]$ nad njo.
2. Primitivna funkcija: $F(x) = \frac{x^3}{3} - x^2 - 3x$, zato je $F(0) = 0$, $F(3) = -9$ in $F(4) = -\frac{20}{3}$.
3. Prvi del: $\int_0^3 f(x)\,dx = -9 - 0 = -9$, ploščina $9$.
4. Drugi del: $\int_3^4 f(x)\,dx = -\frac{20}{3} + 9 = \frac{7}{3}$.
5. Seštejemo: $p = 9 + \frac{7}{3} = \frac{34}{3} \approx 11{,}33$.
6. Odgovor: ploščina je $\frac{34}{3}$. Integral čez cel interval bi dal le $-\frac{20}{3}$, ker se dela odštejeta.

### Primer 3: lastnosti integrala

Funkcija $f$ je zvezna na $[0, 6]$. Znano je $\int_0^6 f(x)\,dx = 10$ in $\int_2^6 f(x)\,dx = 4$. Izračunaj a) $\int_0^2 f(x)\,dx$ in b) $\int_6^0 \bigl(3f(x) - 2\bigr)\,dx$. c) Z aditivnostjo izračunaj še $\int_{-1}^{2} |x|\,dx$.

**Podatki:** $\int_0^6 f(x)\,dx = 10$, $\int_2^6 f(x)\,dx = 4$; pri c) funkcija $|x|$ na $[-1, 2]$
**Iščemo:** a) $\int_0^2 f(x)\,dx$, b) $\int_6^0 \bigl(3f(x) - 2\bigr)\,dx$, c) $\int_{-1}^{2} |x|\,dx$

:::formula
$\int_a^b f\,dx + \int_b^c f\,dx = \int_a^c f\,dx$, $\quad \int_b^a f\,dx = -\int_a^b f\,dx$, $\quad \int_a^b k\,dx = k\,(b - a)$
:::

**Rešitev:**

1. a) Aditivnost: $\int_0^2 f\,dx + \int_2^6 f\,dx = \int_0^6 f\,dx$, zato je $\int_0^2 f(x)\,dx = 10 - 4 = 6$.
2. b) Najprej računamo z mejama v običajnem vrstnem redu. Linearnost: $\int_0^6 \bigl(3f(x) - 2\bigr)\,dx = 3 \cdot 10 - \int_0^6 2\,dx$.
3. b) $\int_0^6 2\,dx$ je ploščina pravokotnika s stranicama $6$ in $2$, torej $12$. Zato je $\int_0^6 \bigl(3f(x) - 2\bigr)\,dx = 30 - 12 = 18$.
4. b) Zamenjava mej spremeni predznak: $\int_6^0 \bigl(3f(x) - 2\bigr)\,dx = -18$.
5. c) Za $x < 0$ je $|x| = -x$, za $x \ge 0$ je $|x| = x$. Interval razdelimo pri $0$: $\int_{-1}^{2} |x|\,dx = \int_{-1}^{0} (-x)\,dx + \int_0^2 x\,dx$.
6. c) $\int_{-1}^{0} (-x)\,dx = -\frac{x^2}{2}\Big|_{-1}^{0} = 0 + \frac{1}{2} = \frac{1}{2}$ in $\int_0^2 x\,dx = \frac{x^2}{2}\Big|_0^2 = 2$.
7. c) Seštejemo: $\frac{1}{2} + 2 = \frac{5}{2}$. Preizkus z liki: pod grafom sta trikotnika s ploščinama $\frac{1 \cdot 1}{2}$ in $\frac{2 \cdot 2}{2}$.
8. Odgovor: a) $6$; b) $-18$; c) $\frac{5}{2}$.

### Primer 4 (težji, višja raven): prostornina žoge za ragbi

Žoga za ragbi je dolga $30\,\mathrm{cm}$, na sredini ima premer $18\,\mathrm{cm}$. Njen obris opišemo s parabolo $f(x) = 9 - \frac{x^2}{25}$ za $-15 \le x \le 15$ (vse v centimetrih). Koliko litrov zraka je v žogi?

**Podatki:** $f(x) = 9 - \frac{x^2}{25}$ v $\mathrm{cm}$, $a = -15\,\mathrm{cm}$, $b = 15\,\mathrm{cm}$, dolžina $30\,\mathrm{cm}$, premer $18\,\mathrm{cm}$
**Iščemo:** prostornino $V$ v litrih

:::formula
$V = \pi \int_{-15}^{15} f(x)^2\,dx$
:::

**Rešitev:**

1. Preverimo obris: $f(0) = 9$ (polmer na sredini) in $f(15) = 0$ (konica žoge).
2. Kvadriramo: $f(x)^2 = 81 - \frac{18x^2}{25} + \frac{x^4}{625}$.
3. Obris je simetričen, zato $V = 2\pi \int_0^{15} f(x)^2\,dx$: računamo samo polovico.
4. Primitivna funkcija: $G(x) = 81x - \frac{6x^3}{25} + \frac{x^5}{3125}$, $G(0) = 0$.
5. $G(15) = 1215 - 810 + 243 = 648$.
6. $V = 2\pi \cdot 648 = 1296\pi \approx 4071{,}5\,\mathrm{cm^3}$.
7. Ker je $1\,\mathrm{L} = 1000\,\mathrm{cm^3}$, je $V \approx 4{,}07\,\mathrm{L}$.
8. Odgovor: v žogi je približno $4{,}1$ litra zraka.

### Primer 5 (višja raven): zdaj ti

Na treningu imajo plastične stožce, visoke $30\,\mathrm{cm}$, s polmerom osnovne ploskve $10\,\mathrm{cm}$. Da jih veter ne odnese, jih napolnijo s peskom. Koliko peska gre v en stožec?

**Podatki:** višina $h = 30\,\mathrm{cm}$, polmer $r = 10\,\mathrm{cm}$
**Iščemo:** prostornino $V$

:::formula
$V = \pi \int_0^{30} f(x)^2\,dx$
:::

**Rešitev:**

1. Stožec položimo na bok, vrh v izhodišče, os stožca na os $x$. Plašč nastane z vrtenjem daljice od $(0, 0)$ do $(30, 10)$, torej $f(x) = \frac{x}{3}$.
2. Kvadrat integranda: $f(x)^2 = \frac{x^2}{9}$, zato $V = \pi \int_0^{30} \frac{x^2}{9}\,dx$.
3. Poišči primitivno funkcijo, vstavi meji in rezultat pretvori v litre.

:::premisli
Koliko je $V$?
---
$\int_0^{30} \frac{x^2}{9}\,dx = \frac{x^3}{27}\Big|_0^{30} = \frac{27000}{27} = 1000$, torej $V = 1000\pi \approx 3142\,\mathrm{cm^3} \approx 3{,}1\,\mathrm{L}$. Enako da formula za stožec $\frac{\pi r^2 h}{3}$.
:::

## Pogoste napake

- **Integral je kar ploščina.** »Izračunal sem $\int_0^4 f(x)\,dx$, to je ploščina.« Če graf prečka os, se deli pod osjo odštejejo (v Primeru 2 bi dobil $-\frac{20}{3}$ namesto $\frac{34}{3}$). Najprej poišči ničle, integriraj po delih in seštej absolutne vrednosti.
- **Meji v napačnem vrstnem redu.** $F(a) - F(b)$ da nasprotno predznačen rezultat. Vedno je »zgornja minus spodnja«: $F(b) - F(a)$.
- **$F(0)$ je vedno $0$.** Pri potencah drži, pri drugih funkcijah ne: za $F(x) = -\cos x$ je $F(0) = -1$, za $F(x) = e^x$ je $F(0) = 1$. Spodnjo mejo vedno izračunaj.
- **Prostornina brez kvadrata (višja raven).** Kdor piše $V = \pi \int_a^b f(x)\,dx$, rezini pripiše ploskev $\pi r$ namesto ploščine kroga $\pi r^2$. Rezina je valj s ploščino osnovne ploskve $\pi f(x)^2$, zato pride $f$ pod integral na kvadrat. Pomaga preizkus s stožcem: formula mora dati $\frac{\pi r^2 h}{3}$.
- **Pri ploščini med krivuljama spodnja minus zgornja.** Rezultat je negativen. Odštevaj vedno graf, ki je višje, minus graf, ki je nižje.

## Povzetek

- Določeni integral $\int_a^b f(x)\,dx$ je limita vsot ploščin pravokotnikov pod grafom; rezultat je število.
- Newton-Leibnizova formula: $\int_a^b f(x)\,dx = F(b) - F(a)$, kjer je $F$ katera koli primitivna funkcija; $C$ se izniči.
- Integral šteje dele nad osjo s plusom, pod osjo z minusom. Za ploščino razdeli interval v ničlah in seštej absolutne vrednosti.
- Lastnosti: $\int_a^a f\,dx = 0$, $\int_b^a f\,dx = -\int_a^b f\,dx$, $\int_a^b f\,dx + \int_b^c f\,dx = \int_a^c f\,dx$; integral vsote je vsota integralov, konstantni faktor izpostavimo.
- Ploščina med krivuljama: $\int_a^b (g - f)\,dx$, kjer je $g$ zgoraj.
- (višja raven) Prostornina vrtenine okoli osi $x$: $V = \pi \int_a^b f(x)^2\,dx$.
- Pot je integral hitrosti po času: $s = \int_{t_1}^{t_2} v(t)\,dt$.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Izračunaj $\int_0^{\pi/2} (3\sin x + 2\cos x)\,dx$.

**Rešitev:**

1. Primitivna funkcija: $F(x) = -3\cos x + 2\sin x$, ker je $(-3\cos x + 2\sin x)' = 3\sin x + 2\cos x$.
2. Zgornja meja: $F\!\left(\frac{\pi}{2}\right) = -3 \cdot 0 + 2 \cdot 1 = 2$. Spodnja meja: $F(0) = -3 \cdot 1 + 2 \cdot 0 = -3$.
3. $\int_0^{\pi/2} (3\sin x + 2\cos x)\,dx = F\!\left(\frac{\pi}{2}\right) - F(0) = 2 - (-3) = 5$.
4. Odgovor: integral je enak $5$.

**Točkovanje:** 1 točka za primitivno funkcijo $-3\cos x + 2\sin x$, 1 točka za vrednosti $F\!\left(\frac{\pi}{2}\right) = 2$ in $F(0) = -3$, 1 točka za rezultat $5$.

### Naloga 2: krajša strukturirana naloga, 8 točk, pola 1 (brez računala)

Dani sta funkciji $g(x) = 4 - x^2$ in $f(x) = x + 2$.

a) Izračunaj koordinate presečišč grafov funkcij $f$ in $g$. (2 točki)

b) Izračunaj ploščino lika, ki ga omejujeta grafa funkcij $f$ in $g$. (3 točke)

c) Izračunaj ploščino lika, ki ga omejujeta graf funkcije $g$ in os $x$. Kolikšen delež te ploščine zavzema lik iz b)? (3 točke)

**Rešitev:**

1. a) Enačbo $4 - x^2 = x + 2$ preuredimo v $x^2 + x - 2 = 0$, torej $(x + 2)(x - 1) = 0$ in $x_1 = -2$, $x_2 = 1$.
2. a) $f(-2) = 0$ in $f(1) = 3$, zato sta presečišči $P_1(-2, 0)$ in $P_2(1, 3)$.
3. b) Na $[-2, 1]$ je parabola nad premico (na primer $g(0) = 4 > f(0) = 2$), zato je ploščina $p = \int_{-2}^{1} \bigl(g(x) - f(x)\bigr)\,dx = \int_{-2}^{1} (2 - x - x^2)\,dx$.
4. b) Primitivna funkcija je $H(x) = 2x - \frac{x^2}{2} - \frac{x^3}{3}$, zato je $H(1) = 2 - \frac{1}{2} - \frac{1}{3} = \frac{7}{6}$ in $H(-2) = -4 - 2 + \frac{8}{3} = -\frac{10}{3}$.
5. b) $p = H(1) - H(-2) = \frac{7}{6} + \frac{20}{6} = \frac{27}{6} = \frac{9}{2}$.
6. c) Ničli funkcije $g$ sta $-2$ in $2$, med njima je graf nad osjo $x$: $p_1 = \int_{-2}^{2} (4 - x^2)\,dx = \left(4x - \frac{x^3}{3}\right)\Big|_{-2}^{2} = \frac{16}{3} - \left(-\frac{16}{3}\right) = \frac{32}{3}$.
7. c) Premica je na $[-2, 1]$ nad osjo $x$, zato lik iz b) leži v tem liku. Delež: $\dfrac{p}{p_1} = \dfrac{9}{2} \cdot \dfrac{3}{32} = \dfrac{27}{64}$.
8. Odgovor: a) $P_1(-2, 0)$ in $P_2(1, 3)$; b) $p = \frac{9}{2}$; c) ploščina je $\frac{32}{3}$, lik iz b) zavzema $\frac{27}{64}$ te ploščine (približno $42\,\%$).

**Točkovanje:** a) 1 točka za abscisi $-2$ in $1$, 1 točka za obe presečišči; b) 1 točka za integral razlike (zgornja minus spodnja) z mejama $-2$ in $1$, 1 točka za primitivno funkcijo, 1 točka za $p = \frac{9}{2}$; c) 1 točka za meji $-2$ in $2$, 1 točka za $\frac{32}{3}$, 1 točka za delež $\frac{27}{64}$.

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 2 (z računalom)

Notranjost posode ima obliko vrtenine, ki nastane, ko graf funkcije $f(x) = \frac{12}{\sqrt{x}}$ na intervalu $[4, 16]$ zavrtimo okoli osi $x$. Enota na obeh oseh je $1\,\mathrm{cm}$.

a) Izračunaj polmera obeh krožnih robov posode in njeno višino. (1 točka)

b) Izračunaj prostornino posode. Rezultat zaokroži na cele kubične centimetre. (4 točke)

c) Določi število $c$, za katero ima del posode med $x = 4$ in $x = c$ natanko polovico celotne prostornine. (3 točke)

d) Izračunaj ploščino osnega preseka posode, to je lika med grafoma funkcij $f$ in $-f$ na intervalu $[4, 16]$. (2 točki)

**Rešitev:**

1. a) $f(4) = \frac{12}{2} = 6$ in $f(16) = \frac{12}{4} = 3$, zato sta polmera $6\,\mathrm{cm}$ in $3\,\mathrm{cm}$; višina je $16 - 4 = 12$, torej $12\,\mathrm{cm}$.
2. b) $V = \pi \int_4^{16} f(x)^2\,dx = \pi \int_4^{16} \frac{144}{x}\,dx$.
3. b) Na intervalu $[4, 16]$ je $x > 0$, zato je primitivna funkcija za $\frac{144}{x}$ kar $144\ln x$ (brez absolutne vrednosti).
4. b) $V = 144\pi(\ln 16 - \ln 4) = 144\pi\ln 4 \approx 627{,}14\,\mathrm{cm^3}$.
5. c) Prostornina dela med $x = 4$ in $x = c$ je $\pi \int_4^{c} \frac{144}{x}\,dx = 144\pi\ln\frac{c}{4}$ in mora biti enaka $\frac{V}{2} = 72\pi\ln 4$.
6. c) Sledi $\ln\frac{c}{4} = \frac{1}{2}\ln 4 = \ln 2$, torej $\frac{c}{4} = 2$ in $c = 8$.
7. d) Ploščina preseka: $p = \int_4^{16} \bigl(f(x) - (-f(x))\bigr)\,dx = 2\int_4^{16} 12x^{-1/2}\,dx = 48\sqrt{x}\,\Big|_4^{16} = 48(4 - 2) = 96$.
8. Odgovor: a) polmera $6\,\mathrm{cm}$ in $3\,\mathrm{cm}$, višina $12\,\mathrm{cm}$; b) $V \approx 627\,\mathrm{cm^3}$; c) $c = 8$; d) $p = 96\,\mathrm{cm^2}$.

**Točkovanje:** a) 1 točka za oba polmera in višino; b) 1 točka za formulo $V = \pi \int_4^{16} f(x)^2\,dx$ z $f(x)^2 = \frac{144}{x}$, 1 točka za primitivno funkcijo $144\ln x$, 1 točka za $144\pi\ln 4$, 1 točka za $V \approx 627\,\mathrm{cm^3}$; c) 1 točka za enačbo $144\pi\ln\frac{c}{4} = 72\pi\ln 4$, 1 točka za $\ln\frac{c}{4} = \ln 2$, 1 točka za $c = 8$; d) 1 točka za $2\int_4^{16} \frac{12}{\sqrt{x}}\,dx$, 1 točka za $96\,\mathrm{cm^2}$.

### Ustno vprašanje 1

:::premisli
Kako določeni integral definiramo s spodnjimi in zgornjimi vsotami in kakšen je njegov geometrijski pomen?
---
Interval $[a, b]$ razdelimo na majhne podintervale in nad vsakim narišemo pravokotnik z višino najmanjše oziroma največje vrednosti zvezne funkcije $f$ na tem podintervalu. Vsota ploščin teh pravokotnikov je spodnja oziroma zgornja vsota. Ko podintervale drobimo, se obe vsoti približujeta istemu številu, ki ga imenujemo določeni integral $\int_a^b f(x)\,dx$. Če je $f$ na $[a, b]$ nenegativna, je določeni integral ploščina lika med grafom in osjo $x$. Dele grafa pod osjo $x$ integral šteje negativno.
:::

### Ustno vprašanje 2

:::premisli
Zapiši Newton-Leibnizovo formulo, pojasni, zakaj velja, in zakaj v njej ne potrebujemo integracijske konstante.
---
Če je $F$ katera koli primitivna funkcija zvezne funkcije $f$ na intervalu $[a, b]$, velja $\int_a^b f(x)\,dx = F(b) - F(a)$. Naj bo $A(x)$ ploščina pod grafom od $a$ do $x$; ko se $x$ poveča za majhen $h$, se ploščina poveča približno za $f(x) \cdot h$, zato je $A'(x) = f(x)$. Funkcija $A$ je torej primitivna funkcija za $f$ in se od $F$ razlikuje le za konstanto: $A(x) = F(x) + C$. Iz $A(a) = 0$ sledi $C = -F(a)$, zato je $\int_a^b f(x)\,dx = A(b) = F(b) - F(a)$. Če namesto $F$ vzamemo drugo primitivno funkcijo $F + C$, se v razliki $\bigl(F(b) + C\bigr) - \bigl(F(a) + C\bigr)$ konstanta odšteje, zato je ne pišemo.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Izpelji formulo za prostornino vrtenine, ki nastane, ko graf funkcije $f$ na intervalu $[a, b]$ zavrtimo okoli osi $x$.
---
Vrtenino z ravninami, pravokotnimi na os $x$, razrežemo na tanke rezine debeline $dx$. Rezina pri $x$ je približno valj s polmerom $\lvert f(x)\rvert$, zato je njena prostornina $\pi f(x)^2\,dx$. Prostornina vrtenine je vsota prostornin vseh rezin, v limiti pa določeni integral $V = \pi \int_a^b f(x)^2\,dx$.
:::

## Drugače: Z analogijo

Predstavljaj si števec kilometrov v avtu in merilnik hitrosti. Merilnik hitrosti kaže $f$, števec pa $F$: števec se spreminja tako hitro, kot kaže merilnik, zato je $F' = f$.

Koliko si prevozil med dvema trenutkoma? Ne seštevaš hitrosti, ampak pogledaš števec na koncu in na začetku ter odšteješ: $F(b) - F(a)$. Pri tem je vseeno, ali je števec na začetku kazal $0$ ali $85\,000\,\mathrm{km}$. Ta začetna vrednost je konstanta $C$, ki se pri odštevanju izgubi.

(višja raven) Prostornina vrtenine pa je kot kup kovancev različnih velikosti, naložen v stolpec. Vsak kovanec je tanek valj; prostornino stolpca dobiš, ko sešteješ ploščine vseh krogov, pomnožene z debelino kovanca.

## Drugače: Iz vsakdanjega življenja

Športna ura z GPS-om vsako sekundo zabeleži tvojo hitrost. Pot izračuna tako, da vsako hitrost pomnoži z eno sekundo in vse produkte sešteje. To je vsota pravokotnikov širine $1\,\mathrm{s}$ iz razlage. Pri teku je natančnost dovolj dobra, ker se hitrost v eni sekundi skoraj ne spremeni.

Podobno računa aplikacija za kolesarjenje porabljeno energijo: moč v vatih krat čas, seštevano vsako sekundo. Energija je ploščina pod grafom moči.

(višja raven) Tudi pri vrtenini ni treba daleč: kozarec, vaza ali pokal za zmagovalca turnirja nastanejo na stružnici, ki obris vrti okoli osi. Količino vode, ki gre v pokal, izračunaš z $V = \pi \int_a^b f(x)^2\,dx$, kjer je $f$ notranji obris.

## Preveri se

? Trener ima graf hitrosti kolesarja $v(t)$ v $\mathrm{m/s}$ za prvo minuto dirke. Kaj pove število $\int_0^{60} v(t)\,dt$?
- Povprečno hitrost kolesarja v prvi minuti.
~ Povprečna hitrost je ta integral, deljen s $60\,\mathrm{s}$. Integral sam ima enoto $\mathrm{m/s} \cdot \mathrm{s} = \mathrm{m}$.
+ Pot, ki jo kolesar prevozi v prvi minuti.
- Pospešek kolesarja ob koncu prve minute.
~ Pospešek je odvod hitrosti, ne integral. Integriranje gre v nasprotno smer: od hitrosti k poti.
- Največjo hitrost, ki jo kolesar doseže.
~ Največjo hitrost bi poiskal z odvodom ($v' = 0$). Integral sešteva vse hitrosti, pomnožene s časom.
> Integral hitrosti po času je ploščina pod grafom $v(t)$, enota je $\mathrm{m/s} \cdot \mathrm{s} = \mathrm{m}$: to je prevožena pot.

? Razvrsti integrale $I_1 = \int_0^1 x\,dx$, $I_2 = \int_0^1 x^2\,dx$ in $I_3 = \int_0^1 x^3\,dx$ od najmanjšega do največjega.
- $I_1 < I_2 < I_3$
~ Višja potenca ni večja: za $0 < x < 1$ je $x^3 < x^2 < x$, ker množenje s številom, manjšim od $1$, zmanjšuje.
+ $I_3 < I_2 < I_1$
- Vsi trije so enaki, ker imajo enake meje.
~ Enake meje pomenijo enako širok lik, višine grafov pa so različne.
> Na $(0, 1)$ leži graf $x^3$ pod grafom $x^2$, ta pa pod grafom $x$. Res: $I_3 = \frac{1}{4}$, $I_2 = \frac{1}{3}$, $I_1 = \frac{1}{2}$.

? (višja raven) Kaj se zgodi s prostornino vrtenine, če vse vrednosti funkcije $f$ podvojiš (obris je dvakrat dlje od osi), meji pa ostaneta enaki?
- Podvoji se.
~ Tako bi bilo pri ploščini pod grafom. Pri vrtenini je pod integralom $f^2$, ne $f$.
+ Poveča se štirikrat.
- Poveča se osemkrat.
~ Osemkrat bi se povečala, če bi podvojil tudi dolžino telesa (vse tri mere). Tu se dolžina ne spremeni.
> $V = \pi \int_a^b \bigl(2f(x)\bigr)^2\,dx = 4\pi \int_a^b f(x)^2\,dx$: vsaka rezina ima dvakrat večji polmer, zato štirikrat večjo ploskev.

? Koliko je $\int_1^3 2x\,dx$?
- $-8$
~ Odšteval si v napačnem vrstnem redu, $F(1) - F(3)$. Pravilno je zgornja minus spodnja.
- $9$
~ To je le $F(3)$. Odšteti moraš še vrednost pri spodnji meji, $F(1) = 1$.
+ $8$
- $4$
~ To je pravokotnik z višino $f(1) = 2$ in širino $2$. Funkcija pa na intervalu raste, zato je lik večji.
> $F(x) = x^2$, zato $\int_1^3 2x\,dx = 9 - 1 = 8$.

? Kolikšna je ploščina lika med grafom $f(x) = x^2 - 1$ in osjo $x$ na intervalu $[0, 2]$?
- $\frac{2}{3}$
~ To je $\int_0^2 f(x)\,dx$. Ker je graf na $[0, 1]$ pod osjo, se ta del odšteje od dela nad osjo.
- $\frac{4}{3}$
~ To je samo del nad osjo, na $[1, 2]$. Pozabil si lik pod osjo na $[0, 1]$.
+ $2$
- $-\frac{2}{3}$
~ To je samo integral na $[0, 1]$, ki je negativen. Ploščina ne more biti negativna.
> Ničla je $x = 1$. $\int_0^1 (x^2 - 1)\,dx = -\frac{2}{3}$, $\int_1^2 (x^2 - 1)\,dx = \frac{4}{3}$. Ploščina je $\frac{2}{3} + \frac{4}{3} = 2$.

? Znano je $\int_0^4 f(x)\,dx = 10$ in $\int_0^1 f(x)\,dx = 3$. Koliko je $\int_4^1 f(x)\,dx$?
= -7
~ 7 | To je $\int_1^4 f(x)\,dx$. Meji sta zamenjani, zato se spremeni predznak.
~ 13 | Integralov ne seštej: iz $\int_0^1 f\,dx + \int_1^4 f\,dx = \int_0^4 f\,dx$ sledi $\int_1^4 f\,dx = 10 - 3$.
~ -13 | Integralov ne seštej: najprej odštej $10 - 3$, nato zamenjaj predznak.
> Aditivnost: $\int_1^4 f(x)\,dx = 10 - 3 = 7$. Zamenjava mej: $\int_4^1 f(x)\,dx = -7$.

<<RACUN
integral: 3*sin(x)+2*cos(x) | x | 0 | pi/2 | 5
resi: 4-x^2=x+2 | x | -2, 1
integral: (4-x^2)-(x+2) | x | -2 | 1 | 9/2
vrednost: 2-1/2-1/3 | 7/6
vrednost: -4-2+8/3 | -10/3
integral: 4-x^2 | x | -2 | 2 | 32/3
vrednost: (9/2)/(32/3) | 27/64
integral: pi*(12/sqrt(x))^2 | x | 4 | 16 | 144*pi*ln(4)
vrednost: 144*pi*ln(4) | 627.14
resi: 144*pi*ln(c/4)=72*pi*ln(4) | c | 8
integral: 2*12/sqrt(x) | x | 4 | 16 | 96
vrednost: 10-4 | 6
vrednost: -(3*10-2*6) | -18
integral: -x | x | -1 | 0 | 1/2
integral: x | x | 0 | 2 | 2
vrednost: 1/2+2 | 5/2
vrednost: -(10-3) | -7
>>

:::simboli
f | integrand (funkcija pod integralom) | | | višina grafa nad točko $x$
x | neodvisna spremenljivka | | |
a | spodnja meja integrala | | |
b | zgornja meja integrala | | |
F | primitivna funkcija integranda | F' = f | |
V | prostornina vrtenine | V = \pi \int_a^b f(x)^2\,dx | cm^3 |
\pi | število pi | | – | razmerje med obsegom in premerom kroga
s | pot | s = \int v(t)\,dt | m |
v | hitrost | | m/s |
t | čas | | s |
G | primitivna funkcija za $f(x)^2$ | G' = f^2 | |
p | ploščina lika | | |
g | funkcija z zgornjim grafom pri ploščini med krivuljama | | | pri linearnosti druga funkcija pod integralom
c | tretja meja pri aditivnosti | | | v Nalogi 3 za maturo iskana zgornja meja dela posode
k | konstanta (konstantni faktor ali konstantni integrand) | | |
A | ploščina pod grafom od $a$ do $x$ | A' = f | |
d | oznaka v $dx$ (spremenljivka integracije $x$) | | | $dx$ je širina tankega pravokotnika
:::
