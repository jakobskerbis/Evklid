---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nika za šolski projekt programira preprost sintetizator. Ve, da ima komorni ton a¹ frekvenco $440\,\mathrm{Hz}$, ton a² eno **oktavo** višje pa $880\,\mathrm{Hz}$. Med njima mora razporediti še $11$ tipk, tako da je od a¹ do a² $12$ enakih korakov. Takemu koraku glasbeniki rečejo **polton**.

Prva zamisel: razliko $880 - 440 = 440\,\mathrm{Hz}$ razdeli na $12$ enakih delov, vsak korak doda približno $36{,}67\,\mathrm{Hz}$. Ko zaigra lestvico, zveni razglašeno: spodnji koraki so preveliki, zgornji premajhni. Uho namreč ne sliši enakih *razlik* frekvenc, ampak enaka *razmerja*. Vsak polton mora frekvenco **pomnožiti** z istim faktorjem.

Katera funkcija ima to lastnost in kakšen je njen graf? To je **eksponentna funkcija**. Opisuje tudi pojemanje zvoka strune in rast bakterij.

## Razlaga

**1. En primer do konca.** Nikin sintetizator najprej uglasimo po oktavah. Vsaka oktava navzgor frekvenco podvoji, vsaka navzdol jo razpolovi. Z $x$ označimo, za koliko oktav je ton nad a¹ (pod a¹ je $x$ negativen). Frekvenca je potem $440 \cdot 2^x$ hercev:

| $x$ (oktave) | $2^x$ | frekvenca v Hz |
|---|---|---|
| $-2$ | $\frac{1}{4}$ | $110$ |
| $-1$ | $\frac{1}{2}$ | $220$ |
| $0$ | $1$ | $440$ |
| $\frac{1}{2}$ | $\sqrt{2} \approx 1{,}414$ | $\approx 622{,}25$ |
| $1$ | $2$ | $880$ |
| $2$ | $4$ | $1760$ |

Ton na sredini oktave, $6$ poltonov nad a¹, ima torej $440 \cdot \sqrt{2} \approx 622{,}25\,\mathrm{Hz}$ in ne $660\,\mathrm{Hz}$, kot bi dala Nikina prva zamisel. En polton je $\frac{1}{12}$ oktave, zato vsak polton frekvenco pomnoži z $2^{\frac{1}{12}} \approx 1{,}0595$.

:::premisli
Nika bi rada ton, ki je $10$ oktav pod a¹. Bo njegova frekvenca negativna, enaka $0$ ali pozitivna? Napovej, preden pogledaš.
---
Pozitivna: $440 \cdot 2^{-10} = \dfrac{440}{1024} \approx 0{,}43\,\mathrm{Hz}$. Vsaka oktava navzdol frekvenco le razpolovi, polovica pozitivnega števila pa je še vedno pozitivna. Do $0$ zato nikoli ne pridemo.
:::

**2. Od primera k splošnemu.** Faktor $440$ graf le raztegne v smeri osi $y$, kar poznaš iz transformacij grafov. Bistvo je v delu $2^x$: spremenljivka je v **eksponentu**, osnova $2$ pa je stalna. Pri $x^2$ je ravno obratno.

**3. Definicija.** Eksponentna funkcija je funkcija s predpisom

$$f(x) = a^x, \qquad a > 0,\ a \ne 1.$$

Število $a$ je **osnova**. Pogoj $a > 0$ potrebujemo, ker potence z negativno osnovo in racionalnim eksponentom niso definirane (spomni se protislovja: $\frac{1}{3} = \frac{2}{6}$, a $\sqrt[3]{-8} = -2$, medtem ko je $\sqrt[6]{(-8)^2} = 2$). Pri $a = 1$ bi bila funkcija konstantna, $1^x = 1$, zato tudi to osnovo izločimo.

**4. Tabela vrednosti.** Izračunajmo nekaj vrednosti funkcij $f(x) = 2^x$ in $g(x) = \left(\dfrac{1}{2}\right)^x$:

| $x$ | $2^x$ | $\left(\frac{1}{2}\right)^x$ |
|---|---|---|
| $-3$ | $\frac{1}{8}$ | $8$ |
| $-2$ | $\frac{1}{4}$ | $4$ |
| $-1$ | $\frac{1}{2}$ | $2$ |
| $0$ | $1$ | $1$ |
| $1$ | $2$ | $\frac{1}{2}$ |
| $2$ | $4$ | $\frac{1}{4}$ |
| $3$ | $8$ | $\frac{1}{8}$ |

Ob povečanju $x$ za $1$ se $2^x$ **podvoji**, $\left(\frac{1}{2}\right)^x$ pa **razpolovi**. Vrednosti so vedno pozitivne, tudi pri negativnih $x$: $2^{-3} = \dfrac{1}{8}$. Padajočo funkcijo slišiš, ko brenkneš struno: če se amplituda nihanja vsako sekundo razpolovi, jo opisuje osnova $\frac{1}{2}$.

**5. Lastnosti funkcije $f(x) = a^x$.**

| Lastnost | $a > 1$ | $0 < a < 1$ |
|---|---|---|
| definicijsko območje | $\mathbb{R}$ | $\mathbb{R}$ |
| zaloga vrednosti | $(0, \infty)$ | $(0, \infty)$ |
| monotonost | strogo naraščajoča | strogo padajoča |
| presečišče z osjo $y$ | $(0, 1)$ | $(0, 1)$ |
| ničle | nima | nima |
| vodoravna asimptota | $y = 0$, ko gre $x \to -\infty$ | $y = 0$, ko gre $x \to \infty$ |

Vsak graf gre skozi $(0, 1)$ in $(1, a)$, ker je $a^0 = 1$ in $a^1 = a$. Os $x$ je **vodoravna asimptota**: graf se ji poljubno približa, a je ne doseže.

**6. Vpliv osnove.** Pri $a > 1$ je graf za $x > 0$ tem strmejši, čim večja je osnova: $3^x$ raste hitreje kot $2^x$.

:::premisli
Kateri graf je višje pri $x = -1$: graf $y = 2^x$ ali graf $y = 3^x$? Zakaj?
---
Višje je $y = 2^x$, ker je $2^{-1} = \frac{1}{2}$ večje od $3^{-1} = \frac{1}{3}$. Negativni eksponent pomeni deljenje, večja osnova pa deli z večjim številom. Levo od osi $y$ je zato graf z večjo osnovo nižje in se tesneje prilega osi $x$.
:::

Pri $0 < a < 1$ velja zrcalno: za $x < 0$ je graf tem strmejši, čim bližje $0$ je osnova. V simulaciji spodaj (»Eksponentna funkcija«) nastavi premika $p = 0$ in $q = 0$ (njun pomen spoznaš v točki 9), nato počasi premikaj osnovo $a$ od $4$ proti $0{,}2$. Opazuj, da vsi grafi ostanejo pripeti v točki $(0, 1)$, pri $a = 1$ se graf zravna v premico $y = 1$, pod $1$ pa začne padati.

**7. Zrcaljenje.** Ker je $\left(\dfrac{1}{a}\right)^x = a^{-x}$, je graf funkcije $y = \left(\dfrac{1}{a}\right)^x$ zrcalna slika grafa $y = a^x$ čez os $y$. To kaže tabela v točki 4: vrednost $2^x$ pri $x = 3$ je enaka vrednosti $\left(\frac{1}{2}\right)^x$ pri $x = -3$.

**8. Število $e$.** Posebej pomembna osnova je **Eulerjevo število** $e \approx 2{,}718$. Funkcijo $f(x) = e^x$ imenujemo **naravna eksponentna funkcija**. Ker je $2 < e < 3$, leži njen graf med grafoma $2^x$ in $3^x$.

**9. Premiki grafa.** Iz grafa $y = a^x$ dobimo grafe sorodnih funkcij:

- $y = a^x + q$: graf premaknemo za $q$ v smeri osi $y$; asimptota postane $y = q$, zaloga vrednosti $(q, \infty)$.
- $y = a^{x - p}$: graf premaknemo za $p$ v smeri osi $x$ (pri $p > 0$ v desno); asimptota ostane $y = 0$.
- $y = -a^x$: graf prezrcalimo čez os $x$; zaloga vrednosti postane $(-\infty, 0)$.

**10. Primerjanje potenc.** Ker je funkcija pri $a > 1$ strogo naraščajoča, iz $x_1 < x_2$ sledi $a^{x_1} < a^{x_2}$. Pri $0 < a < 1$ je strogo padajoča, zato iz $x_1 < x_2$ sledi $a^{x_1} > a^{x_2}$. Potence z isto osnovo tako primerjamo brez računanja.

## Rešeni primeri

### Primer 1 (lažji)

Za funkcijo $f(x) = 3^x$ izračunaj $f(-2)$, $f(0)$, $f\!\left(\dfrac{1}{2}\right)$ in $f(2)$. Ali je funkcija naraščajoča ali padajoča? Kje seka os $y$?

**Podatki:** $f(x) = 3^x$, osnova $a = 3$, vrednosti $x = -2$, $x = 0$, $x = \dfrac{1}{2}$, $x = 2$
**Iščemo:** funkcijske vrednosti, monotonost in presečišče z osjo $y$

:::formula
$a^{-n} = \dfrac{1}{a^n}$, $\;a^0 = 1$, $\;a^{\frac{1}{2}} = \sqrt{a}$; pri $a > 1$ je $a^x$ naraščajoča.
:::

**Rešitev:**

1. $f(-2) = 3^{-2} = \dfrac{1}{3^2} = \dfrac{1}{9}$.
2. $f(0) = 3^0 = 1$.
3. $f\!\left(\dfrac{1}{2}\right) = 3^{\frac{1}{2}} = \sqrt{3} \approx 1{,}73$.
4. $f(2) = 3^2 = 9$.
5. Osnova $a = 3$ je večja od $1$, zato je funkcija strogo naraščajoča, kar kažejo tudi vrednosti: $\dfrac{1}{9} < 1 < 1{,}73 < 9$.
6. Odgovor: $f(-2) = \dfrac{1}{9}$, $f(0) = 1$, $f\!\left(\dfrac{1}{2}\right) = \sqrt{3} \approx 1{,}73$ in $f(2) = 9$. Funkcija je naraščajoča in seka os $y$ v točki $(0, 1)$.

### Primer 2 (srednji)

Brez računala ugotovi, katero število je večje: a) $2^{0{,}7}$ ali $2^{0{,}4}$; b) $0{,}3^{-1{,}2}$ ali $0{,}3^{-0{,}8}$; c) $5^{-0{,}1}$ ali $1$.

**Podatki:** pari števil $2^{0{,}7}$ in $2^{0{,}4}$; $0{,}3^{-1{,}2}$ in $0{,}3^{-0{,}8}$; $5^{-0{,}1}$ in $1$
**Iščemo:** večje število v vsakem paru

:::formula
Pri $a > 1$: $x_1 < x_2 \Rightarrow a^{x_1} < a^{x_2}$. Pri $0 < a < 1$: $x_1 < x_2 \Rightarrow a^{x_1} > a^{x_2}$. Velja $a^0 = 1$.
:::

**Rešitev:**

1. a) Osnova $2 > 1$, funkcija $2^x$ narašča. Ker je $0{,}4 < 0{,}7$, je $2^{0{,}4} < 2^{0{,}7}$.
2. b) Osnova $0{,}3$ je med $0$ in $1$, funkcija $0{,}3^x$ pada. Ker je $-1{,}2 < -0{,}8$, je $0{,}3^{-1{,}2} > 0{,}3^{-0{,}8}$.
3. c) Število $1$ zapišemo kot $5^0$. Osnova $5 > 1$, funkcija narašča, in ker je $-0{,}1 < 0$, je $5^{-0{,}1} < 5^0 = 1$.
4. Računalo potrdi: $2^{0{,}7} \approx 1{,}62 > 2^{0{,}4} \approx 1{,}32$, $0{,}3^{-1{,}2} \approx 4{,}24 > 0{,}3^{-0{,}8} \approx 2{,}62$, $5^{-0{,}1} \approx 0{,}85$.
5. Odgovor: večja so števila $2^{0{,}7}$, $0{,}3^{-1{,}2}$ in $1$.

### Primer 3 (težji): klaviatura

Elektronska klaviatura izračuna frekvenco tona, ki je $n$ poltonov nad tonom a¹, s predpisom $f(n) = 440 \cdot 2^{\frac{n}{12}}$ (v Hz); za tone pod a¹ je $n$ negativen. a) Ali frekvenca od tipke do tipke naraste za isto število hercev? b) Kolikšna je frekvenca tona c², ki je $3$ poltone nad a¹? c) Koliko poltonov pod a¹ leži ton s frekvenco $110\,\mathrm{Hz}$?

**Podatki:** $f(n) = 440 \cdot 2^{\frac{n}{12}}$ (v Hz); ton a¹: $n = 0$, $f(0) = 440\,\mathrm{Hz}$; ton c²: $n = 3$; iskani ton ima $110\,\mathrm{Hz}$
**Iščemo:** a) ali so razlike frekvenc sosednjih tipk enake, b) $f(3)$, c) $n$, pri katerem je $f(n) = 110\,\mathrm{Hz}$

:::formula
$440 \cdot 2^{\frac{n+1}{12}} = 440 \cdot 2^{\frac{n}{12}} \cdot 2^{\frac{1}{12}}$ (ena tipka višje); $\;12$ poltonov je ena oktava, ki frekvenco podvoji.
:::

**Rešitev:**

1. a) Ena tipka višje pomeni $n + 1$ namesto $n$. Po pravilu $a^{u+v} = a^u \cdot a^v$ se frekvenca **pomnoži** z $2^{\frac{1}{12}} \approx 1{,}0595$, ne poveča za stalno število hercev.
2. S številkami: $f(1) \approx 466{,}16\,\mathrm{Hz}$ je od $f(0) = 440\,\mathrm{Hz}$ večja za $26{,}16\,\mathrm{Hz}$, oktavo višje pa je $f(13) \approx 932{,}33\,\mathrm{Hz}$ od $f(12) = 880\,\mathrm{Hz}$ večja že za $52{,}33\,\mathrm{Hz}$.
3. Osnova $2^{\frac{1}{12}}$ je večja od $1$, zato je $f$ strogo naraščajoča: višja tipka da višji ton.
4. b) $f(3) = 440 \cdot 2^{\frac{3}{12}} = 440 \cdot 2^{\frac{1}{4}} = 440 \cdot \sqrt[4]{2}$, ker je $\frac{3}{12} = \frac{1}{4}$.
5. Z računalom: $440 \cdot 1{,}1892 \approx 523{,}25$, torej $f(3) \approx 523{,}25\,\mathrm{Hz}$.
6. c) Vprašanje je obratno: poznamo vrednost, iščemo $n$. Ker je $110 = \dfrac{440}{4} = \dfrac{440}{2 \cdot 2}$, moramo frekvenco dvakrat razpoloviti, torej se spustiti za dve oktavi: $n = -24$.
7. Preizkus: $f(-24) = 440 \cdot 2^{-2} = \dfrac{440}{4} = 110$. Ker je $f$ strogo naraščajoča, drugega takega $n$ ni.
8. Odgovor: frekvenca se od tipke do tipke množi z $2^{\frac{1}{12}} \approx 1{,}0595$, zato razlike niso enake. Ton c² ima približno $523{,}25\,\mathrm{Hz}$, ton s $110\,\mathrm{Hz}$ pa leži $24$ poltonov (dve oktavi) pod a¹.

### Primer 4 – zdaj ti

Dana je funkcija $g(x) = 2^{x+1} - 4$. Določi njeno definicijsko območje, zalogo vrednosti, asimptoto in presečišče z osjo $y$. Pokaži, da je $x = 1$ njena ničla, in pojasni, zakaj druge ničle nima. Za katere $x$ je funkcija negativna?

**Podatki:** $g(x) = 2^{x+1} - 4$, osnova $a = 2$, premik za $1$ v levo in za $4$ navzdol, kandidat za ničlo $x = 1$
**Iščemo:** $D_g$, $Z_g$, asimptoto, presečišče z osjo $y$, ničle in kje je $g(x) < 0$

:::formula
Graf $y = a^{x-p} + q$: graf $y = a^x$, premaknjen za $p$ po osi $x$ in za $q$ po osi $y$; asimptota $y = q$, zaloga vrednosti $(q, \infty)$.
:::

**Rešitev:**

1. Zapis $2^{x+1} = 2^{x-(-1)}$ pomeni premik grafa $y = 2^x$ za $1$ v **levo**, člen $-4$ pa premik za $4$ **navzdol**.
2. $D_g = \mathbb{R}$, ker potenco $2^{x+1}$ izračunamo za vsak $x$.
3. Ker je $2^{x+1} > 0$, je $g(x) > -4$. Zato je $Z_g = (-4, \infty)$, asimptota pa $y = -4$.
4. Presečišče z osjo $y$: $g(0) = 2^1 - 4 = -2$, torej točka $(0, -2)$.
5. Zdaj ti: izračunaj $g(1)$ in pojasni, zakaj druge ničle ni. Nato ugotovi, za katere $x$ je $g(x) < 0$.

:::premisli
Je $x = 1$ ničla funkcije $g$ in kje je $g$ negativna?
---
$g(1) = 2^2 - 4 = 0$, zato je $x = 1$ ničla. Osnova $2 > 1$, zato je $g$ strogo naraščajoča in vrednost $0$ doseže le enkrat: druge ničle ni. Levo od ničle so vrednosti manjše, $g(-1) = 2^0 - 4 = -3 < 0$, desno večje, $g(2) = 2^3 - 4 = 4 > 0$. Odgovor: edina ničla je $x = 1$, $g(x) < 0$ za $x \in (-\infty, 1)$.
:::

## Pogoste napake

- **Zamenjava $2^x$ z $x^2$ ali z enakomerno rastjo.** Pri $x = 3$ je $2^3 = 8$ in $3^2 = 9$, pri $x = 10$ pa $2^{10} = 1024$ in $10^2 = 100$. Spremenljivka je v eksponentu, ne v osnovi. Tudi Nikina prva zamisel je napaka te vrste: ob koraku $x$ za $1$ se ne prišteje stalno število, ampak se vrednost **pomnoži** z $a$.
- **Negativni eksponent da negativno vrednost.** $2^{-3} = -8$ ni res. Negativni eksponent pomeni obratno vrednost: $2^{-3} = \dfrac{1}{8}$. Vrednosti $a^x$ so **vedno pozitivne**, zato graf ne seka osi $x$.
- **Smer premika.** Graf $y = 2^{x-3}$ ni premaknjen v levo, ampak za $3$ v **desno**. Vrednost $1$ ima $2^{x-3}$ šele pri $x = 3$.
- **Napačna smer pri osnovi, manjši od $1$.** Pri $0 < a < 1$ funkcija pada, zato večji eksponent da manjšo vrednost: $0{,}5^3 = 0{,}125 < 0{,}5^2 = 0{,}25$. O smeri odloča le osnova, ne faktor pred potenco: $8 \cdot 0{,}5^t$ pada, čeprav je $8 > 1$.
- **$-2^x$ ni isto kot $(-2)^x$.** Zapis $-2^x$ pomeni $-\left(2^x\right)$, kar je zrcaljenje grafa čez os $x$. Zapis $(-2)^x$ pa ni eksponentna funkcija, ker osnova ni pozitivna.

## Povzetek

- Eksponentna funkcija: $f(x) = a^x$, $a > 0$, $a \ne 1$.
- $D_f = \mathbb{R}$, $Z_f = (0, \infty)$; ničel ni; graf gre skozi $(0, 1)$ in $(1, a)$.
- Ko se $x$ poveča za $1$, se vrednost pomnoži z $a$ (vsaka oktava podvoji frekvenco).
- $a > 1$: strogo naraščajoča; $0 < a < 1$: strogo padajoča.
- Vodoravna asimptota je os $x$ ($y = 0$).
- $\left(\frac{1}{a}\right)^x = a^{-x}$: graf je zrcalna slika grafa $a^x$ čez os $y$.
- $y = a^{x - p} + q$: premik za $p$ po osi $x$ in za $q$ po osi $y$; asimptota $y = q$.
- Naravna eksponentna funkcija: $e^x$, $e \approx 2{,}718$.

## Drugače: Z analogijo

Eksponentna rast je kot snežna kepa, ki se vali po bregu. Ob vsakem obratu nabere toliko snega, kolikor je sama velika, zato se vsakič podvoji. Velika kepa v enem obratu pridobi več snega, kot ga je imela nekaj obratov prej. Pri linearni rasti bi ob vsakem obratu dobila le enako pest snega.

Na grafu $y = 2^x$ je to letalo: z leve dolgo pelje po pisti tik ob osi $x$, okrog $x = 0$ se začne dvigovati, desno od $x = 2$ pa strmo vzleti.

Padajoči graf $y = \left(\frac{1}{2}\right)^x$ je kot torta, ki jo vedno znova razrežeš na pol. Kos je vsakič manjši, a polovica kosa je še vedno kos, zato do nič nikoli ne prideš. Zato se graf osi $x$ le približuje.

## Drugače: Bolj natančno

**Zakaj je funkcija $a^x$ pri $a > 1$ naraščajoča?** Naj bo $x_1 < x_2$. Potem je $x_2 - x_1 > 0$ in

$$a^{x_2} = a^{x_1} \cdot a^{x_2 - x_1}.$$

Za $a > 1$ in pozitiven eksponent je $a^{x_2 - x_1} > 1$ (za racionalni eksponent $\frac{m}{n} > 0$ je $\sqrt[n]{a^m} > 1$, ker je $a^m > 1$). Ker je $a^{x_1} > 0$, sledi $a^{x_2} > a^{x_1}$. Pri $0 < a < 1$ je $a^{x_2 - x_1} < 1$ in neenakost se obrne.

**Iracionalni eksponenti.** Potence smo doslej poznali le z racionalnimi eksponenti. Kaj pomeni $2^{\sqrt{2}}$? Eksponent $\sqrt{2} = 1{,}41421\ldots$ približujemo z $1{,}4$; $1{,}41$; $1{,}414$; … Potence $2^{1{,}4}$, $2^{1{,}41}$, $2^{1{,}414}$, … zaradi monotonosti naraščajo, so manjše od $2^{1{,}5}$ in se približujejo enemu samemu številu, $2^{\sqrt{2}} \approx 2{,}665$. Tako je $a^x$ definirana za vsak realen $x$, graf pa je sklenjena krivulja brez lukenj.

**Značilna lastnost.** Za eksponentno funkcijo velja $f(u + v) = f(u) \cdot f(v)$, ker je $a^{u+v} = a^u \cdot a^v$. Zaradi stroge monotonosti je funkcija tudi injektivna: različnim $x$ pripadata različni vrednosti. Na tem temelji reševanje eksponentnih enačb.

## Preveri se

? Trije predpisi opisujejo eksponentno funkcijo, eden ne. Kateri je izjema?
- $f(x) = 0{,}8^x$
~ Tudi osnova med $0$ in $1$ je dovoljena. Funkcija $0{,}8^x$ je eksponentna, le padajoča.
- $f(x) = e^x$
~ Osnova $e \approx 2{,}718$ ni celo število, a je pozitivna in različna od $1$, zato je $e^x$ eksponentna funkcija.
+ $f(x) = x^3$
- $f(x) = 3^x$
~ Pri $3^x$ je spremenljivka v eksponentu, osnova $3$ pa je stalna, zato je to eksponentna funkcija.
> Pri $x^3$ je spremenljivka v osnovi: to je potenčna funkcija. Ostale tri imajo stalno pozitivno osnovo, različno od $1$, spremenljivko pa v eksponentu.

? V kateri točki graf funkcije $f(x) = 2^{x-1} + 3$ seka os $y$?
- $(0;\, 2{,}5)$
~ Tu je $2^{-1}$ izračunano kot $-\frac{1}{2}$. Negativni eksponent pomeni obratno vrednost, ne negativnega števila: $2^{-1} = \frac{1}{2}$.
- $(0;\, 4)$
~ To bi veljalo za $2^x + 3$. Premik za $1$ v desno spremeni vrednost pri $x = 0$, ker je eksponent tam $0 - 1 = -1$.
+ $(0;\, 3{,}5)$
- $(0;\, 5)$
~ Tu je eksponent pri $x = 0$ vzet kot $+1$, kot da bi bil graf premaknjen v levo. Vstavi natančno: $0 - 1 = -1$.
> $f(0) = 2^{-1} + 3 = \frac{1}{2} + 3 = 3{,}5$, zato graf seka os $y$ v točki $(0;\, 3{,}5)$.

? Zakaj graf funkcije $y = a^x$ ($a > 0$, $a \ne 1$) nikoli ne seka osi $x$?
- Ker je funkcija naraščajoča.
~ Tudi padajoče funkcije, na primer $0{,}5^x$, ne sekajo osi $x$, naraščajoča premica $y = x$ pa jo seka. Monotonost ni razlog.
- Ker gre graf skozi točko $(0, 1)$.
~ Tudi parabola $y = 1 - x^2$ gre skozi $(0, 1)$, pa vseeno seka os $x$ pri $x = -1$ in $x = 1$.
+ Ker je potenca s pozitivno osnovo pozitivna pri vsakem eksponentu, zato vrednosti $0$ funkcija ne doseže.
- Ker funkcija pri negativnih $x$ ni definirana.
~ Definirana je za vsak realen $x$, na primer $2^{-3} = \frac{1}{8}$. Napaka izvira iz predstave, da negativni eksponent da negativno ali nedefinirano vrednost.
> Za $a > 0$ je $a^x > 0$ pri vsakem $x$, zato funkcija nima ničel. Os $x$ je le asimptota: graf se ji približuje, a je ne doseže.

? Rok določa lastnosti funkcije $f(x) = 3^{x-2} - 1$: (1) osnovni graf $y = 3^x$ ima asimptoto $y = 0$; (2) zapis $x - 2$ pomeni premik za $2$ v levo; (3) člen $-1$ premakne graf za $1$ navzdol, zato je asimptota $y = -1$; (4) zaloga vrednosti je $(-1, \infty)$. Kateri korak je napačen?
- korak (1)
~ Osnovni graf $3^x$ res ima asimptoto $y = 0$, ker je $3^x > 0$ za vsak $x$.
+ korak (2)
- korak (3)
~ Premik za $1$ navzdol res premakne tudi asimptoto, iz $y = 0$ v $y = -1$.
- korak (4)
~ Ker je $3^{x-2} > 0$, je $f(x) > -1$. Zaloga vrednosti $(-1, \infty)$ je pravilna.
> Pri $y = a^{x-p}$ se graf premakne za $p$ v **desno**: vrednost $1$, ki jo ima $3^x$ pri $x = 0$, ima $3^{x-2}$ šele pri $x = 2$.

? Brenkneš struno kitare. Amplitudo njenega nihanja opišemo z modelom $A(t) = 8 \cdot 0{,}5^t$ ($A$ v desetinkah milimetra, $t$ v sekundah). Katera trditev je pravilna?
- Po $8\,\mathrm{s}$ je amplituda $0$, ker vsako sekundo pade za $1$.
~ To je linearno razmišljanje. Amplituda se vsako sekundo **pomnoži** z $0{,}5$, ne zmanjša za stalno število.
- Funkcija je naraščajoča, ker je začetna vrednost $8$ večja od $1$.
~ O naraščanju odloča osnova, ne faktor pred potenco. Osnova $0{,}5$ je med $0$ in $1$, zato funkcija pada.
+ Po $3\,\mathrm{s}$ je amplituda $1$, natanko $0$ pa v modelu ne postane nikoli.
- Po $2\,\mathrm{s}$ je amplituda $4$.
~ Po eni sekundi je amplituda $8 \cdot 0{,}5 = 4$, po dveh pa se še enkrat razpolovi: $8 \cdot 0{,}5^2 = 2$.
> $A(3) = 8 \cdot 0{,}5^3 = 8 \cdot 0{,}125 = 1$. Ker je $0{,}5^t > 0$ za vsak $t$, je os $t$ asimptota: zvok v modelu pojema, a nikoli ne doseže $0$.

:::simboli
f | eksponentna funkcija; v primeru 3 frekvenca tona | f(x) = a^x | | v primeru 3 v Hz
x | neodvisna spremenljivka (eksponent) | | |
a | osnova | | | $a > 0$, $a \ne 1$
x_1, x_2 | dve vrednosti spremenljivke | | | $x_1 < x_2$
n | eksponent; v primeru 3 število poltonov nad a¹ | | |
y | vrednost funkcije | y = a^{x-p} + q | |
p | premik grafa v smeri osi $x$ | | | pri $p > 0$ v desno
q | premik grafa v smeri osi $y$ | | | asimptota postane $y = q$
u, v | eksponenta v pravilu za produkt potenc | | |
:::
