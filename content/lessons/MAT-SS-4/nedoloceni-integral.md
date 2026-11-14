---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Dva prizora z istega koncerta.

Tonski mojster na začetku skladbe naredi »fade-in«: glasnost dviga enakomerno, za $8\,\mathrm{dB}$ na sekundo. Kolikšna je glasnost po $5$ sekundah? Ve, kako hitro se spreminja, ne pa, koliko je. Če je začel pri $-40\,\mathrm{dB}$, je po $5$ sekundah pri $0\,\mathrm{dB}$. Če je začel kje drugje, je rezultat drugačen.

Bobnar v drugi skladbi pospešuje. Njegov tempo je $60 + 12t$ udarcev na minuto, kjer je $t$ čas v minutah. Koliko udarcev odigra v prvih dveh minutah? Tempo ni stalen, zato preprosto množenje ne pomaga.

Prizora sta si na videz tuja: enkrat glasnost, drugič udarci. Skrivata pa isto vprašanje. Poznamo **hitrost spreminjanja** neke količine in iščemo **količino samo**. To je odvajanje v obratni smeri, ki mu rečemo integriranje. Z njim iz hitrosti dobimo pot, iz porabe dobimo zalogo, iz tempa število udarcev.

## Razlaga

**Nazaj od odvoda.** Pri vsaki vrstici spodaj je znan odvod, iščemo funkcijo, ki ima ta odvod. Ugibamo, nato preverimo z odvajanjem:

| znan odvod $f(x)$ | funkcija $F(x)$ | preverba $F'(x)$ |
|---|---|---|
| $8$ | $8x$ | $8$ ✓ |
| $2x$ | $x^2$ | $2x$ ✓ |
| $3x^2$ | $x^3$ | $3x^2$ ✓ |
| $\cos x$ | $\sin x$ | $\cos x$ ✓ |

Vendar $x^2 + 5$ in $x^2 - 3$ imata tudi odvod $2x$, saj se konstanta pri odvajanju izgubi. Odgovor torej ni ena funkcija, ampak cela **družina**.

**Premaknjene parabole.** Nariši parabole $y = x^2$, $y = x^2 + 1$, $y = x^2 + 2$ in $y = x^2 - 1$. Vse so enake oblike, le premaknjene gor ali dol. Pri $x = 1$ nariši tangento na vsako od njih: vse so vzporedne, vse imajo smerni koeficient $2$. Graf se premakne, naklon ostane.

Družino lahko premikaš sam: simulacija »Nedoločeni integral: družina funkcij« spodaj ima drsnik za konstanto $C$ (od $-3$ do $3$). Graf $F(x) + C$ se premakne gor ali dol, kratke črtice, ki kažejo naklon, pa ostanejo enake.

:::premisli
Konstanto $C$ povečaš z $0$ na $3$. Za koliko se premakne tangenta pri $x = 1$ in ali se kaj nagne? Napovej, nato v simulaciji preveri premik grafa in naklon črtic.
---
Premakne se za $3$ navzgor, a ostane vzporedna prejšnji. Odvod konstante je $0$, zato $C$ ne vpliva na naklon, le na višino grafa.
:::

**Simboli.** Funkcija $F$ je **primitivna funkcija** funkcije $f$, če je $F'(x) = f(x)$. Družino vseh primitivnih funkcij imenujemo **nedoločeni integral** in pišemo

$$\int f(x)\,dx = F(x) + C$$

Funkcija $f$ pod znakom $\int$ je **integrand**, $dx$ pove, po kateri spremenljivki integriramo, $C$ je poljubno realno število, **integracijska konstanta**. Rezultat vedno preveriš tako, da ga odvajaš.

Bobnar iz uvoda: število udarcev $N(t)$ ima odvod $60 + 12t$, zato je $N(t) = 60t + 6t^2 + C$ (preverba: odvod $6t^2$ je $12t$). Ob začetku ni odigral še nič, $N(0) = 0$, zato $C = 0$. Po dveh minutah: $N(2) = 120 + 24 = 144$ udarcev.

**Osnovni integrali.** Vsako pravilo za odvod, prebrano nazaj, da pravilo za integral:

| $f(x)$ | $\int f(x)\,dx$ | opomba |
|---|---|---|
| $x^n$ | $\dfrac{x^{n+1}}{n+1} + C$ | $n \ne -1$ |
| $\dfrac{1}{x}$ | $\ln\lvert x\rvert + C$ | $x \ne 0$ |
| $e^x$ | $e^x + C$ | |
| $\cos x$ | $\sin x + C$ | |
| $\sin x$ | $-\cos x + C$ | pazi na minus |

Za potence lahko zapišemo tudi formulo:

$$\int x^n\,dx = \frac{x^{n+1}}{n+1} + C$$

Za $x > 0$ je $\ln\lvert x\rvert = \ln x$. Absolutna vrednost poskrbi še za $x < 0$: tam je po verižnem pravilu $\bigl(\ln(-x)\bigr)' = \frac{1}{-x} \cdot (-1) = \frac{1}{x}$.

Konstantni faktor nesemo pred integral, vsoto integriramo člen za členom:

$$\int \bigl(a f(x) + b g(x)\bigr)\,dx = a \int f(x)\,dx + b \int g(x)\,dx$$

:::premisli
Zakaj pravilo za potence ne velja za $n = -1$?
---
Ker bi v imenovalcu dobili $n + 1 = 0$. Funkcija $x^{-1} = \frac{1}{x}$ ima zato svoje pravilo: integral je $\ln\lvert x\rvert + C$.
:::

**Uvedba nove spremenljivke (višja raven).** Odvajaj $(x^2 + 1)^4$ po verižnem pravilu: dobiš $4(x^2 + 1)^3 \cdot 2x$. Odvod notranje funkcije, $2x$, je »padel ven« kot faktor. Ko v integrandu vidiš notranjo funkcijo in zraven njen odvod, je to sled verižnega pravila. Postopek:

1. Notranjo funkcijo poimenuješ z novo spremenljivko: $u = g(x)$.
2. Odvajaš: $du = g'(x)\,dx$, in v integralu zamenjaš ves $x$ in $dx$.
3. Integriraš po $u$.
4. Vrneš se k $x$: namesto $u$ vstaviš $g(x)$.

$$\int f\bigl(g(x)\bigr)\,g'(x)\,dx = \int f(u)\,du$$

Najpogostejši primer je linearna notranja funkcija. Pri $u = kx$ je $du = k\,dx$, zato na primer $\int \cos(kx)\,dx = \dfrac{\sin(kx)}{k} + C$. Preverba: odvod $\sin(kx)$ je $k\cos(kx)$, deljenje s $k$ ta faktor odstrani.

## Rešeni primeri

### Primer 1 (lažji): polinom

Izračunaj $\int (6x^2 - 4x + 5)\,dx$.

**Podatki:** integrand $f(x) = 6x^2 - 4x + 5$
**Iščemo:** $\int f(x)\,dx$

:::formula
$\int x^n\,dx = \dfrac{x^{n+1}}{n+1} + C$, vsoto integriramo člen za členom
:::

**Rešitev:**

1. Prvi člen: $6 \cdot \dfrac{x^3}{3} = 2x^3$, ker se eksponent poveča za $1$ in delimo z novim eksponentom.
2. Drugi člen: $-4 \cdot \dfrac{x^2}{2} = -2x^2$.
3. Tretji člen: $5 = 5x^0$, integral je $5x$.
4. Konstanto $C$ zapišemo enkrat, za vse člene skupaj.
5. Preverba: $(2x^3 - 2x^2 + 5x)' = 6x^2 - 4x + 5$ ✓.
6. Odgovor: $\int (6x^2 - 4x + 5)\,dx = 2x^3 - 2x^2 + 5x + C$.

### Primer 2: koren, sinus in eksponentna funkcija

Izračunaj $\int \bigl(4\sqrt{x} - 3\sin x + 2e^x\bigr)\,dx$ za $x > 0$.

**Podatki:** integrand $4\sqrt{x} - 3\sin x + 2e^x$, $x > 0$
**Iščemo:** nedoločeni integral

:::formula
$\int x^n\,dx = \dfrac{x^{n+1}}{n+1} + C$, $\int \sin x\,dx = -\cos x + C$, $\int e^x\,dx = e^x + C$
:::

**Rešitev:**

1. Koren zapišemo kot potenco: $\sqrt{x} = x^{1/2}$, da lahko uporabimo pravilo za potence.
2. $4 \int x^{1/2}\,dx = 4 \cdot \dfrac{x^{3/2}}{3/2} = \dfrac{8}{3}\,x^{3/2} = \dfrac{8}{3}\,x\sqrt{x}$.
3. $-3 \int \sin x\,dx = -3 \cdot (-\cos x) = 3\cos x$; minusa se pokrajšata.
4. $2 \int e^x\,dx = 2e^x$.
5. Preverba: $\left(\dfrac{8}{3}x^{3/2}\right)' = \dfrac{8}{3} \cdot \dfrac{3}{2}\,x^{1/2} = 4\sqrt{x}$ ✓, $(3\cos x)' = -3\sin x$ ✓.
6. Odgovor: integral je $\dfrac{8}{3}\,x\sqrt{x} + 3\cos x + 2e^x + C$.

### Primer 3 (težji, višja raven): nihanje kitarske strune

Na počasnem posnetku se sredina kitarske strune giblje s hitrostjo $v(t) = 6\cos(3t)$, kjer je $v$ v $\mathrm{mm/s}$ in $t$ v sekundah. Ob $t = 0$ je struna v ravnovesni legi, odmik je $y(0) = 0$. Zapiši odmik $y(t)$ in izračunaj odmik ob $t = \dfrac{\pi}{6}\,\mathrm{s}$.

**Podatki:** $v(t) = 6\cos(3t)\,\mathrm{mm/s}$, $y(0) = 0\,\mathrm{mm}$, $t_1 = \dfrac{\pi}{6}\,\mathrm{s}$
**Iščemo:** odmik $y(t)$ in $y(t_1)$

:::formula
$y(t) = \int v(t)\,dt$, z novo spremenljivko $u = 3t$, $du = 3\,dt$
:::

**Rešitev:**

1. Hitrost je odvod odmika, zato je odmik integral hitrosti: $y(t) = \int 6\cos(3t)\,dt$.
2. Notranja funkcija je $3t$: uvedemo $u = 3t$, $du = 3\,dt$, torej $dt = \dfrac{du}{3}$.
3. $\int 6\cos u \cdot \dfrac{du}{3} = 2\int \cos u\,du = 2\sin u + C$.
4. Vrnemo se k $t$: $y(t) = 2\sin(3t) + C$.
5. Začetni pogoj določi $C$: $y(0) = 2\sin 0 + C = C = 0$.
6. Ob $t_1$: $y\!\left(\dfrac{\pi}{6}\right) = 2\sin\dfrac{\pi}{2} = 2$.
7. Odgovor: odmik je $y(t) = 2\sin(3t)\,\mathrm{mm}$; ob $t = \dfrac{\pi}{6}\,\mathrm{s}$ je struna $2\,\mathrm{mm}$ od ravnovesne lege, kar je njen največji odmik.

### Primer 4 (višja raven): zdaj ti

Izračunaj $\int 3x^2\,(x^3 - 2)^4\,dx$.

**Podatki:** integrand $3x^2\,(x^3 - 2)^4$
**Iščemo:** nedoločeni integral

:::formula
$u = x^3 - 2$, $du = 3x^2\,dx$
:::

**Rešitev:**

1. Notranja funkcija je $x^3 - 2$, njen odvod $3x^2$ je že zraven kot faktor.
2. Uvedemo $u = x^3 - 2$, $du = 3x^2\,dx$; integral postane $\int u^4\,du$.
3. Integriraj po $u$ in se vrni k $x$:

:::premisli
Kaj dobiš? Preveri z odvajanjem.
---
$\int u^4\,du = \dfrac{u^5}{5} + C$, torej $\dfrac{(x^3 - 2)^5}{5} + C$. Preverba: odvod je $\dfrac{5(x^3 - 2)^4 \cdot 3x^2}{5} = 3x^2(x^3 - 2)^4$ ✓.
:::

## Pogoste napake

- **Pozabljeni $C$.** Zapis $\int 2x\,dx = x^2$ izpusti vse premaknjene parabole. Nedoločeni integral je družina, zato vedno dodaj $+ C$. Konkretno vrednost $C$ določi šele dodaten podatek, kot je $y(0) = 0$.
- **Odvajanje namesto integriranja.** Kdor pri $\int x^3\,dx$ napiše $3x^2$, je eksponent zmanjšal. Pri integriranju se eksponent *poveča* za $1$, nato deliš z novim eksponentom: $\dfrac{x^4}{4}$.
- **Minus pri sinusu.** $\int \sin x\,dx = \cos x$ je narobe, ker je $(\cos x)' = -\sin x$. Pravilno: $-\cos x + C$. Preverba z odvajanjem to napako takoj ujame.
- **Pozabljeni faktor pri notranji funkciji (višja raven).** $\int \cos(3x)\,dx = \sin(3x) + C$ ne drži: odvod desne strani je $3\cos(3x)$. Ker je $dx = \dfrac{du}{3}$, je pravilno $\dfrac{\sin(3x)}{3} + C$.
- **Integral produkta po faktorjih (višja raven).** $\int 2x\,(x^2 + 1)^3\,dx$ ni $x^2 \cdot \dfrac{(x^2 + 1)^4}{4}$. Za produkt ni pravila »integriraj vsak faktor posebej«; tu pomaga nova spremenljivka $u = x^2 + 1$, rezultat je $\dfrac{(x^2 + 1)^4}{4} + C$.

## Povzetek

- $\int f(x)\,dx = F(x) + C$ pomeni $F'(x) = f(x)$; integriranje je odvajanje v obratni smeri.
- Rezultat je družina funkcij, ki se razlikujejo za konstanto $C$; grafi so navpično premaknjeni, nakloni pri isti abscisi enaki.
- Osnovni integrali: $\int x^n\,dx = \frac{x^{n+1}}{n+1} + C$ ($n \ne -1$), $\int \frac{1}{x}\,dx = \ln\lvert x\rvert + C$, $\int e^x\,dx = e^x + C$, $\int \cos x\,dx = \sin x + C$, $\int \sin x\,dx = -\cos x + C$.
- Konstanto nesemo pred integral, vsoto integriramo po členih; za produkt takega pravila ni.
- Nova spremenljivka (višja raven): $u = g(x)$, $du = g'(x)\,dx$, integriraj po $u$, vrni se k $x$. Pri $u = kx$ deliš s $k$.
- Vedno preveri z odvajanjem.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Izračunaj $\int \left(\dfrac{3}{x^2} - \dfrac{2}{x} + 4\cos x\right) dx$ za $x \ne 0$.

**Rešitev:**

1. Prvi člen zapišemo kot potenco, $\dfrac{3}{x^2} = 3x^{-2}$, zato je $\int 3x^{-2}\,dx = 3 \cdot \dfrac{x^{-1}}{-1} = -\dfrac{3}{x}$.
2. Drugi člen: $\int \dfrac{2}{x}\,dx = 2\ln\lvert x\rvert$; tretji člen: $\int 4\cos x\,dx = 4\sin x$.
3. Preverba: $\left(-\dfrac{3}{x} - 2\ln\lvert x\rvert + 4\sin x\right)' = \dfrac{3}{x^2} - \dfrac{2}{x} + 4\cos x$.
4. Odgovor: $\int \left(\dfrac{3}{x^2} - \dfrac{2}{x} + 4\cos x\right) dx = -\dfrac{3}{x} - 2\ln\lvert x\rvert + 4\sin x + C$.

**Točkovanje:** 1 točka za $-\dfrac{3}{x}$ (zapis s potenco $x^{-2}$ in pravilo za potence), 1 točka za $-2\ln\lvert x\rvert$, 1 točka za $4\sin x$ in integracijsko konstanto $C$.

### Naloga 2: krajša strukturirana naloga, 6 točk, pola 1 (brez računala)

Za funkcijo $f$ velja $f'(x) = 3x^2 - 6x$, njen graf pa poteka skozi točko $T(1, 2)$.

a) Zapiši predpis funkcije $f$. (2 točki)

b) Izračunaj ničle funkcije $f$. (2 točki)

c) Izračunaj koordinate lokalnih ekstremov funkcije $f$ in za vsakega utemelji, ali je lokalni maksimum ali lokalni minimum. (2 točki)

**Rešitev:**

1. a) Funkcija $f$ je primitivna funkcija za $f'$: $f(x) = \int (3x^2 - 6x)\,dx = x^3 - 3x^2 + C$.
2. a) Iz $f(1) = 2$ sledi $1 - 3 + C = 2$, torej $C = 4$ in $f(x) = x^3 - 3x^2 + 4$.
3. b) Ena ničla je $x = -1$, ker je $f(-1) = -1 - 3 + 4 = 0$. Z deljenjem z $(x + 1)$ dobimo $f(x) = (x + 1)(x^2 - 4x + 4) = (x + 1)(x - 2)^2$.
4. b) Ničli sta $x_1 = -1$ (enostavna) in $x_2 = 2$ (dvojna).
5. c) Stacionarni točki: $f'(x) = 3x^2 - 6x = 3x(x - 2) = 0$, torej $x = 0$ in $x = 2$; $f(0) = 4$ in $f(2) = 8 - 12 + 4 = 0$.
6. c) Odvod $f'$ pri $x = 0$ spremeni predznak s $+$ na $-$, pri $x = 2$ pa z $-$ na $+$. Zato ima $f$ v točki $(0, 4)$ lokalni maksimum, v točki $(2, 0)$ pa lokalni minimum; tam se graf dotakne osi $x$, kar se ujema z dvojno ničlo.
7. Odgovor: a) $f(x) = x^3 - 3x^2 + 4$; b) $x_1 = -1$, $x_2 = 2$ (dvojna ničla); c) lokalni maksimum v točki $(0, 4)$, lokalni minimum v točki $(2, 0)$.

**Točkovanje:** a) 1 točka za $x^3 - 3x^2 + C$, 1 točka za $C = 4$ iz pogoja $f(1) = 2$; b) 1 točka za razcep (ali uganjeno ničlo in deljenje polinoma), 1 točka za obe ničli; c) 1 točka za stacionarni točki $x = 0$ in $x = 2$ z vrednostma $f(0) = 4$ in $f(2) = 0$, 1 točka za utemeljeno vrsto ekstremov (maksimum v $(0, 4)$, minimum v $(2, 0)$).

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Dana je funkcija $f(x) = x\sqrt{x^2 + 9}$.

a) Z uvedbo nove spremenljivke izračunaj $\int f(x)\,dx$. (3 točke)

b) Poišči tisto primitivno funkcijo $F$ funkcije $f$, za katero je $F(0) = 0$, in izračunaj $F(4)$. (3 točke)

c) Izračunaj $\int \sin^2 x\,\cos x\,dx$. (2 točki)

d) Izračunaj $\int \dfrac{2x + 3}{x^2 + 3x + 5}\,dx$ in utemelji, zakaj v rezultatu absolutna vrednost ni potrebna. (2 točki)

**Rešitev:**

1. a) Notranja funkcija je $x^2 + 9$, njen odvod $2x$ je do faktorja $2$ že v integrandu. Uvedemo $u = x^2 + 9$, $du = 2x\,dx$, torej $x\,dx = \dfrac{du}{2}$.
2. a) $\int \sqrt{u} \cdot \dfrac{du}{2} = \dfrac{1}{2} \cdot \dfrac{u^{3/2}}{3/2} = \dfrac{1}{3}\,u^{3/2}$, zato je $\int f(x)\,dx = \dfrac{1}{3}\,(x^2 + 9)\sqrt{x^2 + 9} + C$.
3. b) $F(0) = \dfrac{1}{3} \cdot 9 \cdot 3 + C = 9 + C$; iz $F(0) = 0$ sledi $C = -9$.
4. b) $F(4) = \dfrac{1}{3} \cdot 25 \cdot 5 - 9 = \dfrac{125}{3} - \dfrac{27}{3} = \dfrac{98}{3}$.
5. c) Uvedemo $u = \sin x$, $du = \cos x\,dx$: $\int u^2\,du = \dfrac{u^3}{3} + C = \dfrac{\sin^3 x}{3} + C$.
6. d) Števec je odvod imenovalca: $u = x^2 + 3x + 5$, $du = (2x + 3)\,dx$, zato je integral enak $\int \dfrac{du}{u} = \ln\lvert u\rvert + C$.
7. d) Diskriminanta imenovalca je $D = 9 - 20 = -11 < 0$, vodilni koeficient pa je pozitiven, zato je $x^2 + 3x + 5 > 0$ za vsak $x$ in absolutna vrednost ne spremeni ničesar.
8. Odgovor: a) $\dfrac{1}{3}\,(x^2 + 9)\sqrt{x^2 + 9} + C$; b) $F(x) = \dfrac{1}{3}\,(x^2 + 9)\sqrt{x^2 + 9} - 9$ in $F(4) = \dfrac{98}{3}$; c) $\dfrac{\sin^3 x}{3} + C$; d) $\ln(x^2 + 3x + 5) + C$.

**Točkovanje:** a) 1 točka za $u = x^2 + 9$ in $x\,dx = \dfrac{du}{2}$, 1 točka za $\dfrac{1}{3}\,u^{3/2}$, 1 točka za rezultat, izražen z $x$, s konstanto $C$; b) 1 točka za $F(0) = 9 + C$, 1 točka za $C = -9$, 1 točka za $F(4) = \dfrac{98}{3}$; c) 1 točka za $u = \sin x$ in $du = \cos x\,dx$, 1 točka za rezultat; d) 1 točka za $\ln(x^2 + 3x + 5) + C$ (prizna se tudi zapis z absolutno vrednostjo), 1 točka za utemeljitev, da je imenovalec povsod pozitiven (negativna diskriminanta in pozitivni vodilni koeficient).

### Ustno vprašanje 1

:::premisli
Kaj je primitivna funkcija dane funkcije $f$ in kaj je nedoločeni integral funkcije $f$?
---
Funkcija $F$ je primitivna funkcija funkcije $f$ na intervalu, če za vsak $x$ s tega intervala velja $F'(x) = f(x)$. Če je $F$ primitivna funkcija za $f$, je primitivna funkcija tudi $F + C$ za vsako realno število $C$, ker je odvod konstante enak $0$. Dve primitivni funkciji iste funkcije se na intervalu razlikujeta le za konstanto. Množico vseh primitivnih funkcij imenujemo nedoločeni integral in pišemo $\int f(x)\,dx = F(x) + C$.
:::

### Ustno vprašanje 2

:::premisli
Utemelji, zakaj smemo pri nedoločenem integralu konstantni faktor nesti pred integral in vsoto integrirati člen za členom.
---
Obe lastnosti utemeljimo z odvajanjem, ker je primitivna funkcija določena s svojim odvodom. Če je $F' = f$ in $H' = h$, je po pravilih za odvajanje $(aF + bH)' = af + bh$. Zato je $aF + bH$ primitivna funkcija funkcije $af + bh$, torej velja $\int (af + bh)\,dx = a\int f\,dx + b\int h\,dx$.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Pojasni, kako integriramo z uvedbo nove spremenljivke, in postopek pokaži na integralu $\int 2x\cos(x^2)\,dx$.
---
Metoda je obrat verižnega pravila in je uporabna, kadar je v integrandu sestavljena funkcija $f\bigl(g(x)\bigr)$ in zraven odvod notranje funkcije $g'(x)$. Notranjo funkcijo označimo z $u = g(x)$, izrazimo $du = g'(x)\,dx$ in integral zapišemo samo s spremenljivko $u$. Integriramo po $u$ in nato namesto $u$ vstavimo $g(x)$. Pri $\int 2x\cos(x^2)\,dx$ vzamemo $u = x^2$, $du = 2x\,dx$ in dobimo $\int \cos u\,du = \sin(x^2) + C$.
:::

## Drugače: Z analogijo

Pomisli na melodijo. Zapišeš lahko samo **korake**: »dva poltona gor, en polton dol, štiri gor«. To je kot odvod: pove, kako se višina tona spreminja.

Ali lahko iz korakov zaigraš melodijo? Lahko, a šele ko izbereš **prvi ton**. Začneš pri C, dobiš eno različico, začneš pri D, dobiš isto melodijo, le transponirano. Vse transpozicije zvenijo enako, ker imajo enake korake.

- Koraki melodije: integrand $f(x)$.
- Melodija, zaigrana od nekega tona: $F(x)$.
- Izbira prvega tona: konstanta $C$.
- Vse transpozicije skupaj: nedoločeni integral $F(x) + C$.

Pevka, ki zapoje »od tega tona«, je dodatni podatek, ki določi $C$, tako kot $y(0) = 0$ pri struni.

## Drugače: Iz vsakdanjega življenja

Aplikacija na telefonu pravi: »Baterija se prazni za $8\,\%$ na uro.« Koliko je bo ostalo čez $3$ ure?

To se ne da povedati, dokler ne pogledaš, koliko je je zdaj. Hitrost praznjenja je odvod stanja baterije. Iz nje dobiš le *spremembo*, $3 \cdot 8\,\% = 24\,\%$ manj. Stanje samo je »začetno stanje $- \,24\,\%$«. Začetno stanje je konstanta $C$.

Enako pri kilometrskem števcu: hitrost avtomobila pove, koliko kilometrov dodaš, ne pa, koliko jih števec že kaže. Integral hitrosti da prevoženo pot natančno, začetno stanje števca pa ostane neznana konstanta.

## Preveri se

? Program za miksanje iz hitrosti spreminjanja glasnosti $L'(t)$ izračuna $\int L'(t)\,dt = L(t) + C$. Kaj v tem primeru predstavlja konstanta $C$?
- Hitrost, s katero se glasnost spreminja.
~ Hitrost spreminjanja je $L'(t)$, integrand. $C$ se doda šele rezultatu.
+ Glasnost ob začetku, ki je iz hitrosti spreminjanja ne moremo razbrati.
- Napako zaokroževanja, ki jo smemo izpustiti.
~ $C$ ni napaka: brez nje manjkajo vse možne začetne glasnosti. Brez začetnega podatka je ne smemo izpustiti.
> Hitrost pove le, kako se glasnost spreminja; od kod začne, določi konstanta $C$ (pri fade-inu iz uvoda $-40\,\mathrm{dB}$).

? (višja raven) V katerem vrstnem redu izvedeš uvedbo nove spremenljivke? (A: izbereš $u = g(x)$; B: $dx$ izraziš z $du$; C: integriraš po $u$; D: namesto $u$ vstaviš $g(x)$.)
- A, C, B, D
~ Integrirati po $u$ še ne moreš, dokler v integralu stoji $dx$. Najprej zamenjaj $x$ in $dx$.
+ A, B, C, D
- A, B, D, C
~ Če se vrneš k $x$ pred integriranjem, imaš spet prvotni integral in nisi nič pridobil.
> Najprej novo spremenljivko in $du = g'(x)\,dx$, nato integral po $u$, na koncu nazaj k $x$.

? (višja raven) Kaj se zgodi z rezultatom $\int \cos(kx)\,dx$, če $k$ podvojiš, z $2$ na $4$?
- Faktor pred sinusom se podvoji, z $2$ na $4$.
~ Tako bi bilo pri odvajanju: $\bigl(\sin(kx)\bigr)' = k\cos(kx)$. Pri integriranju s $k$ deliš.
- Rezultat ostane $\sin(kx) + C$, spremeni se le $k$ v sinusu.
~ Tu je pozabljen $du = k\,dx$. Odvod $\sin(4x)$ je $4\cos(4x)$, ne $\cos(4x)$.
+ Faktor pred sinusom se razpolovi, z $\frac{1}{2}$ na $\frac{1}{4}$.
> $\int \cos(kx)\,dx = \dfrac{\sin(kx)}{k} + C$: večji $k$ pomeni manjši faktor $\dfrac{1}{k}$.

? Koliko je $\int \left(x^2 + \dfrac{1}{x}\right) dx$ za $x \ne 0$?
- $2x - \dfrac{1}{x^2} + C$
~ To je odvod integranda, ne integral. Pri integriranju se eksponent poveča.
- $x^3 + \ln\lvert x\rvert + C$
~ Pri $x^2$ manjka deljenje z novim eksponentom $3$; preverba da $3x^2$ namesto $x^2$.
+ $\dfrac{x^3}{3} + \ln\lvert x\rvert + C$
> $\int x^2\,dx = \dfrac{x^3}{3}$ in $\int \dfrac{1}{x}\,dx = \ln\lvert x\rvert$; konstanto dodamo enkrat.

? Bobnar začne s tempom $80$ udarcev na minuto in pospešuje, tempo je $80 + 20t$ ($t$ v minutah). Koliko udarcev odigra v prvih $3$ minutah?
- $140$
~ To je tempo ob $t = 3$, torej hitrost, ne število udarcev.
- $420$
~ To dobiš, če ves čas računaš s končnim tempom ($140 \cdot 3$) ali pri $20t$ pozabiš deliti z $2$. Tempo je na začetku manjši.
+ $330$
> $N(t) = 80t + 10t^2 + C$, $N(0) = 0$ da $C = 0$; $N(3) = 240 + 90 = 330$.

<<RACUN
integral: 3/x^2-2/x+4*cos(x) | x | -3/x-2*ln(x)+4*sin(x)
odvod: -3/x-2*ln(x)+4*sin(x) | x | 3/x^2-2/x+4*cos(x)
integral: 3*x^2-6*x | x | x^3-3*x^2
resi: 1-3+C=2 | C | 4
enako: x^3-3*x^2+4 | (x+1)*(x-2)^2
resi: x^3-3*x^2+4=0 | x | -1, 2
resi: 3*x^2-6*x=0 | x | 0, 2
vrednost: 0^3-3*0^2+4 | 4
vrednost: 2^3-3*2^2+4 | 0
integral: x*sqrt(x^2+9) | x | (x^2+9)*sqrt(x^2+9)/3
vrednost: (0^2+9)*sqrt(0^2+9)/3 | 9
vrednost: (4^2+9)*sqrt(4^2+9)/3-9 | 98/3
integral: sin(x)^2*cos(x) | x | sin(x)^3/3
integral: (2*x+3)/(x^2+3*x+5) | x | ln(x^2+3*x+5)
vrednost: 3^2-4*5 | -11
integral: 2*x*cos(x^2) | x | sin(x^2)
>>

:::simboli
f | integrand (znan odvod) | f(x) = F'(x) |
F | primitivna funkcija; nedoločeni integral je družina F + C | F'(x) = f(x) |
C | integracijska konstanta | | | poljubno realno število
x | spremenljivka, po kateri integriramo | |
n | eksponent potence | | | $n \ne -1$
g | notranja funkcija | |
u | nova spremenljivka | u = g(x) |
k | koeficient notranje funkcije $kx$ | |
a | konstantni faktor pred prvim členom | |
b | konstantni faktor pred drugim členom | |
v | hitrost sredine strune | v(t) = 6\cos(3t) | mm/s
y | odmik strune od ravnovesne lege | y(t) = \int v(t)\,dt | mm
t | čas | | s | pri bobnarju v minutah
d | oznaka diferenciala v $dx$, $du$, $dt$ | | | pove, po kateri spremenljivki integriramo
e | Eulerjevo število | e \approx 2{,}718 | | osnova naravnega logaritma
:::
