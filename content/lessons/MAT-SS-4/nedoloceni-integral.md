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

**Uvedba nove spremenljivke.** Odvajaj $(x^2 + 1)^4$ po verižnem pravilu: dobiš $4(x^2 + 1)^3 \cdot 2x$. Odvod notranje funkcije, $2x$, je »padel ven« kot faktor. Ko v integrandu vidiš notranjo funkcijo in zraven njen odvod, je to sled verižnega pravila. Postopek:

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

### Primer 3 (težji): nihanje kitarske strune

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

### Primer 4: zdaj ti

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
- **Pozabljeni faktor pri notranji funkciji.** $\int \cos(3x)\,dx = \sin(3x) + C$ ne drži: odvod desne strani je $3\cos(3x)$. Ker je $dx = \dfrac{du}{3}$, je pravilno $\dfrac{\sin(3x)}{3} + C$.
- **Integral produkta po faktorjih.** $\int 2x\,(x^2 + 1)^3\,dx$ ni $x^2 \cdot \dfrac{(x^2 + 1)^4}{4}$. Za produkt ni pravila »integriraj vsak faktor posebej«; tu pomaga nova spremenljivka $u = x^2 + 1$, rezultat je $\dfrac{(x^2 + 1)^4}{4} + C$.

## Povzetek

- $\int f(x)\,dx = F(x) + C$ pomeni $F'(x) = f(x)$; integriranje je odvajanje v obratni smeri.
- Rezultat je družina funkcij, ki se razlikujejo za konstanto $C$; grafi so navpično premaknjeni, nakloni pri isti abscisi enaki.
- Osnovni integrali: $\int x^n\,dx = \frac{x^{n+1}}{n+1} + C$ ($n \ne -1$), $\int \frac{1}{x}\,dx = \ln\lvert x\rvert + C$, $\int e^x\,dx = e^x + C$, $\int \cos x\,dx = \sin x + C$, $\int \sin x\,dx = -\cos x + C$.
- Konstanto nesemo pred integral, vsoto integriramo po členih; za produkt takega pravila ni.
- Nova spremenljivka: $u = g(x)$, $du = g'(x)\,dx$, integriraj po $u$, vrni se k $x$. Pri $u = kx$ deliš s $k$.
- Vedno preveri z odvajanjem.

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

? V katerem vrstnem redu izvedeš uvedbo nove spremenljivke? (A: izbereš $u = g(x)$; B: $dx$ izraziš z $du$; C: integriraš po $u$; D: namesto $u$ vstaviš $g(x)$.)
- A, C, B, D
~ Integrirati po $u$ še ne moreš, dokler v integralu stoji $dx$. Najprej zamenjaj $x$ in $dx$.
+ A, B, C, D
- A, B, D, C
~ Če se vrneš k $x$ pred integriranjem, imaš spet prvotni integral in nisi nič pridobil.
> Najprej novo spremenljivko in $du = g'(x)\,dx$, nato integral po $u$, na koncu nazaj k $x$.

? Kaj se zgodi z rezultatom $\int \cos(kx)\,dx$, če $k$ podvojiš, z $2$ na $4$?
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
