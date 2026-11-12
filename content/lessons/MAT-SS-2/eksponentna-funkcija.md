---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nika za šolski projekt programira preprost sintetizator. Ve, da ima komorni ton a¹ frekvenco $440\,\mathrm{Hz}$, ton a² eno **oktavo** višje pa $880\,\mathrm{Hz}$. Med njima mora razporediti še $11$ tipk, tako da je od a¹ do a² $12$ enakih korakov. Takemu koraku glasbeniki rečejo **polton**.

Prva zamisel: razliko $880 - 440 = 440\,\mathrm{Hz}$ razdeli na $12$ enakih delov, vsak korak doda približno $36{,}67\,\mathrm{Hz}$. Ko zaigra lestvico, zveni razglašeno: spodnji koraki so preveliki, zgornji premajhni. Uho namreč ne sliši enakih *razlik* frekvenc, ampak enaka *razmerja*. Vsak polton mora frekvenco **pomnožiti** z istim faktorjem.

Katera funkcija ima to lastnost in kakšen je njen graf? To je **eksponentna funkcija**.

## Razlaga

**1. En primer do konca.** Nikin sintetizator najprej uglasimo po oktavah. Vsaka oktava navzgor frekvenco podvoji, vsaka navzdol jo razpolovi. Z $x$ označimo, za koliko oktav je ton nad a¹ (pod a¹ je $x$ negativen). Frekvenca je potem $440 \cdot 2^x$ hercev:

| $x$ (oktave) | $2^x$ | frekvenca v Hz |
|---|---|---|
| $-2$ | $\frac{1}{4}$ | $110$ |
| $-1$ | $\frac{1}{2}$ | $220$ |
| $0$ | $1$ | $440$ |
| $\frac{1}{2}$ | $\sqrt{2} \approx 1{,}4142$ | $\approx 622{,}25$ |
| $1$ | $2$ | $880$ |
| $2$ | $4$ | $1760$ |

Ton na sredini oktave, $6$ poltonov nad a¹, ima torej $440 \cdot \sqrt{2} \approx 622{,}25\,\mathrm{Hz}$ in ne $660\,\mathrm{Hz}$, kot bi dala Nikina prva zamisel. En polton je $\frac{1}{12}$ oktave, zato vsak polton frekvenco pomnoži z $2^{\frac{1}{12}} \approx 1{,}0595$.

:::risba graf
opis: Frekvenca tona v hercih glede na število poltonov n nad tonom a¹, za n od 0 do 12. Črtkana ravna črta je Nikina prva zamisel z enakimi razlikami, polna ukrivljena črta je pravilna uglasitev 440 krat 2 na n dvanajstin. Obe se začneta v točki (0, 440) in končata v točki (12, 880). Pri n = 6 je ravna črta pri 660 Hz, krivulja pa nižje, pri približno 622 Hz.
x: 0 .. 12 | 2 | n (poltoni)
y: 300 .. 900 | 100 | Hz
f: 440 + 440*x/12 | siva črtkano | 0 .. 12
f: 440*2^(x/12) | modra debelo | 0 .. 12
točka: 6; 660 | 660 | nad levo | siva
točka: 6; 622,25 | 622 | pod desno | modra
točka: 0; 440 | a¹ | pod desno
točka: 12; 880 | a² | nad
podnapis: Črtkana ravna črta: enake razlike (660 Hz pri n = 6). Polna krivulja: enaka razmerja (622 Hz).
:::

Črti na sliki se ujemata le na robovih, pri a¹ in a². Vmes leži krivulja pod ravno črto. Na sredini oktave da Nikina zamisel $660\,\mathrm{Hz}$, kar je skoraj natanko ton e² ($659{,}26\,\mathrm{Hz}$), ki je $7$ poltonov nad a¹. Zgrešila je za cel polton, zato je lestvica zvenela razglašeno.

:::premisli
Nika bi rada ton, ki je $10$ oktav pod a¹. Bo njegova frekvenca negativna, enaka $0$ ali pozitivna? Napovej, preden pogledaš.
---
Pozitivna: $440 \cdot 2^{-10} = \dfrac{440}{1024} \approx 0{,}43\,\mathrm{Hz}$. Vsaka oktava navzdol frekvenco le razpolovi, polovica pozitivnega števila pa je še vedno pozitivna. Do $0$ zato nikoli ne pridemo.
:::

**2. Od primera k splošnemu.** Faktor $440$ graf le raztegne v smeri osi $y$, kar poznaš iz transformacij grafov. Bistvo je v delu $2^x$: spremenljivka je v **eksponentu**, osnova $2$ pa je stalna. Pri $x^2$ je ravno obratno.

**3. Definicija.** Eksponentna funkcija je funkcija s predpisom

$$f(x) = a^x, \qquad a > 0,\ a \ne 1.$$

Število $a$ je **osnova**. Pogoj $a > 0$ potrebujemo, ker potenc z negativno osnovo ne moremo določiti za vse racionalne eksponente. Že $(-2)^{\frac{1}{2}} = \sqrt{-2}$ ni realno število, graf bi imel luknje. Tudi $a = 0$ odpade: $0^x$ je za $x > 0$ enako $0$, za $x \le 0$ pa ni določeno. Pri $a = 1$ bi bila funkcija konstantna, $1^x = 1$, zato tudi to osnovo izločimo.

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

:::risba graf
opis: Grafa funkcij y = 2ˣ (polna črta) in y = (1/2)ˣ (črtkana črta) za x od −3 do 3. Graf 2ˣ narašča skozi točke (−1, ½), (0, 1), (1, 2) in (3, 8). Graf (1/2)ˣ pada skozi točke (−3, 8), (−1, 2) in (0, 1). Grafa se sekata v točki (0, 1) in sta zrcalni sliki drug drugega čez os y. Oba se osi x približujeta, a je ne dosežeta.
x: -3 .. 3 | 1 | x
y: 0 .. 8 | 1 | y
f: 2^x | modra debelo
f: 0.5^x | oranžna črtkano
točka: 0; 1
točka: 1; 2 | (1, 2) | desno | modra
točka: 3; 8 | (3, 8) | levo | modra
točka: -1; 2 | (−1, 2) | levo | oranžna
točka: -3; 8 | (−3, 8) | desno | oranžna
podnapis: Polna črta: y = 2ˣ. Črtkana črta: y = (1/2)ˣ. Sekata se v točki (0, 1).
:::

Ob povečanju $x$ za $1$ se $2^x$ **podvoji**, $\left(\frac{1}{2}\right)^x$ pa **razpolovi**. Vrednosti so vedno pozitivne, tudi pri negativnih $x$: $2^{-3} = \dfrac{1}{8}$. Padajočo funkcijo slišiš, ko brenkneš struno: če se amplituda nihanja vsako sekundo razpolovi, jo opisuje osnova $\frac{1}{2}$.

**5. Lastnosti funkcije $f(x) = a^x$.**

| Lastnost | $a > 1$ | $0 < a < 1$ |
|---|---|---|
| definicijsko območje | $\mathbb{R}$ | $\mathbb{R}$ |
| zaloga vrednosti | $(0, \infty)$ | $(0, \infty)$ |
| monotonost | strogo naraščajoča | strogo padajoča |
| presečišče z osjo $y$ | $(0, 1)$ | $(0, 1)$ |
| ničle | nima | nima |
| omejenost | navzdol da (z $0$), navzgor ne | navzdol da (z $0$), navzgor ne |
| injektivnost | je injektivna | je injektivna |
| vodoravna asimptota | $y = 0$, na levi | $y = 0$, na desni |

Vsak graf gre skozi $(0, 1)$ in $(1, a)$, ker je $a^0 = 1$ in $a^1 = a$. Os $x$ je **vodoravna asimptota**: graf se ji poljubno približa, a je ne doseže. Pri $a > 1$ se to zgodi na levi, pri zelo negativnih $x$, pri $0 < a < 1$ pa na desni. Kaj pomeni $2^{\sqrt{2}}$, pove razdelek »Bolj natančno«.

Bistvena lastnost sledi iz pravila za množenje potenc: $a^{x+1} = a^x \cdot a$. Korak za $1$ v desno vrednost vedno **pomnoži** z $a$, pri linearni funkciji pa se ji prišteje $k$. Enaki koraki $x$ dajo torej enaka razmerja, ne enakih razlik, kot je pri poltonih slišala Nika.

**6. Vpliv osnove.** Pri $a > 1$ je graf za $x > 0$ tem strmejši, čim večja je osnova: pri $x = 2$ je $2^2 = 4$, $3^2 = 9$ in $4^2 = 16$.

:::premisli
Kateri graf je višje pri $x = -1$: graf $y = 2^x$ ali graf $y = 3^x$? Zakaj?
---
Višje je $y = 2^x$, ker je $2^{-1} = \frac{1}{2}$ večje od $3^{-1} = \frac{1}{3}$. Negativni eksponent pomeni deljenje, večja osnova pa deli z večjim številom. Levo od osi $y$ je zato graf z večjo osnovo nižje in se tesneje prilega osi $x$.
:::

Pri $0 < a < 1$ velja zrcalno: za $x < 0$ je graf tem strmejši, čim bližje $0$ je osnova.

:::risba graf
opis: Graf funkcije y = aˣ za x od −3 do 3. V aplikaciji se osnova a spreminja z drsnikom od 0,2 do 4; izbrano je a = {a}. Graf gre skozi točki (0; 1) in (1; {a}). Črtkana stopnica gre od točke (0; 1) za 1 v desno in nato navpično do grafa, na višino {a}.
x: -3 .. 3 | 1 | x
y: 0 .. 8 | 1 | y
drsnik: a | 0,2 .. 4 | 0,1 | 2 | osnova a
f: a^x | modra debelo
črta: 0; 1 -> 1; 1 -> 1; a | oranžna črtkano
točka: 0; 1
točka: 1; a | | | oranžna
napis: 0,8; 7,3 | a = {a}
podnapis: y = aˣ pri a = {a}; graf gre skozi (0; 1) in (1; {a})
:::

Slika kaže graf pri $a = 2$: stopnica od $(0, 1)$ za $1$ v desno pripelje na višino $a$. Napovej, kaj se zgodi z levo polovico grafa, ko $a$ pade pod $1$. Nato v aplikaciji počasi premikaj drsnik od $4$ proti $0{,}2$. Pri $a = 4$ graf zapusti sliko že pri $x = 1{,}5$, pri $a = 2$ šele pri $x = 3$. Točka $(0, 1)$ miruje pri vsaki osnovi. Pri $a = 1$ se graf zravna v premico $y = 1$, zato te osnove ne štejemo. Pod $1$ graf pada, pri $a = 0{,}5$ pa je natanko zrcalna slika grafa pri $a = 2$.

**7. Zrcaljenje.** Ker je $\left(\dfrac{1}{a}\right)^x = a^{-x}$, je graf funkcije $y = \left(\dfrac{1}{a}\right)^x$ zrcalna slika grafa $y = a^x$ čez os $y$. To kažeta tabela in slika v točki 4: vrednost $2^x$ pri $x = 3$ je enaka vrednosti $\left(\frac{1}{2}\right)^x$ pri $x = -3$.

**8. Število $e$.** Posebej pomembna osnova je **Eulerjevo število** $e \approx 2{,}718$. Funkcijo $f(x) = e^x$ imenujemo **naravna eksponentna funkcija**. Ker je $2 < e < 3$, leži njen graf med grafoma $2^x$ in $3^x$. Posebna je zato, ker je njen graf v točki $(0, 1)$ strm natanko toliko kot premica $y = x + 1$. Z njo računajo v naravoslovju, računala pa imajo zanjo tipko $e^x$.

**9. Premiki grafa.** Iz grafa $y = a^x$ dobimo grafe sorodnih funkcij:

- $y = a^x + q$: graf premaknemo za $q$ v smeri osi $y$; asimptota postane $y = q$, zaloga vrednosti $(q, \infty)$.
- $y = a^{x - p}$: graf premaknemo za $p$ v smeri osi $x$ (pri $p > 0$ v desno); asimptota ostane $y = 0$.
- $y = -a^x$: graf prezrcalimo čez os $x$; zaloga vrednosti postane $(-\infty, 0)$.
- $y = c \cdot a^x$, $c > 0$: graf raztegnemo v smeri osi $y$; os $y$ seka v $(0, c)$, asimptota ostane $y = 0$. Primer je $440 \cdot 2^x$ iz točke 1.

:::risba graf
opis: Graf funkcije y = 2 na (x − p), plus q, ob njem s črtkano krivuljo osnovni graf y = 2ˣ. V aplikaciji se premika p in q spreminjata z drsnikoma od −3 do 3; izbrano je p = {p} in q = {q}. Vodoravna črtkana premica z napisom je asimptota y = {q}. Točka (0, 1) osnovnega grafa se premakne v točko ({p}, {1+q}).
x: -5 .. 5 | 1 | x
y: -4 .. 8 | 1 | y
drsnik: p | -3 .. 3 | 1 | 2 | premik p v smeri osi x
drsnik: q | -3 .. 3 | 1 | -2 | premik q v smeri osi y
f: 2^x | siva črtkano
f: 2^(x-p) + q | modra debelo
črta: -5; q -> 5; q | oranžna črtkano
napis: 4; q-0,5 | y = {q} | sredina | oranžna
točka: 0; 1 | | | siva
točka: p; 1+q | | | modra
podnapis: p = {p}, q = {q}: točka (0, 1) se premakne v ({p}, {1+q}), vodoravna črtkana premica z napisom je asimptota y = {q}. Črtkana krivulja: y = 2ˣ, polna: premaknjeni graf.
:::

Slika kaže $y = 2^{x-2} - 2$: točka $(0, 1)$ osnovnega grafa se preseli v $(2, -1)$, asimptota pa z osi $x$ na premico $y = -2$. Ker je asimptota zdaj pod osjo $x$, graf seka os $x$: ničla je pri $x = 3$, saj je $2^{1} - 2 = 0$. V aplikaciji najprej premikaj samo $p$ in opazi, da graf drsi levo in desno, asimptota pa miruje. Nato premikaj samo $q$: asimptota se dviga in spušča skupaj z grafom. Pri $q \ge 0$ ničla izgine, ker je ves graf nad osjo $x$.

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

Brez računala ugotovi, katero število je večje: a) $2^{0{,}7}$ ali $2^{0{,}4}$; b) $0{,}3^{-1{,}2}$ ali $0{,}3^{-0{,}8}$; c) $\left(\dfrac{1}{2}\right)^{-0{,}3}$ ali $2^{0{,}2}$.

**Podatki:** pari števil $2^{0{,}7}$ in $2^{0{,}4}$; $0{,}3^{-1{,}2}$ in $0{,}3^{-0{,}8}$; $\left(\frac{1}{2}\right)^{-0{,}3}$ in $2^{0{,}2}$
**Iščemo:** večje število v vsakem paru

:::formula
Pri $a > 1$: $x_1 < x_2 \Rightarrow a^{x_1} < a^{x_2}$. Pri $0 < a < 1$: $x_1 < x_2 \Rightarrow a^{x_1} > a^{x_2}$. Velja $\left(\dfrac{1}{a}\right)^x = a^{-x}$.
:::

**Rešitev:**

1. a) Osnova $2 > 1$, funkcija $2^x$ narašča. Ker je $0{,}4 < 0{,}7$, je $2^{0{,}4} < 2^{0{,}7}$.
2. b) Osnova $0{,}3$ je med $0$ in $1$, funkcija $0{,}3^x$ pada. Ker je $-1{,}2 < -0{,}8$, je $0{,}3^{-1{,}2} > 0{,}3^{-0{,}8}$.
3. c) Osnovi sta različni, zato prvo število najprej zapišemo z osnovo $2$: $\left(\frac{1}{2}\right)^{-0{,}3} = 2^{0{,}3}$ (točka 7). Funkcija $2^x$ narašča in $0{,}2 < 0{,}3$, zato je $2^{0{,}2} < 2^{0{,}3}$.
4. Računalo potrdi: $2^{0{,}7} \approx 1{,}62 > 2^{0{,}4} \approx 1{,}32$; $0{,}3^{-1{,}2} \approx 4{,}24 > 0{,}3^{-0{,}8} \approx 2{,}62$; $2^{0{,}3} \approx 1{,}23 > 2^{0{,}2} \approx 1{,}15$.
5. Odgovor: večja so števila $2^{0{,}7}$, $0{,}3^{-1{,}2}$ in $\left(\frac{1}{2}\right)^{-0{,}3}$.

### Primer 3 (težji): prečke na kitari

Struna klasične kitare je dolga $650\,\mathrm{mm}$. Frekvenca strune je obratno sorazmerna z dolžino dela, ki niha: polton višje pomeni frekvenco krat $2^{\frac{1}{12}}$, torej dolžino krat $2^{-\frac{1}{12}}$. Ko struno pritisneš ob $n$-to prečko, niha zato le še del dolžine $L(n) = 650 \cdot 2^{-\frac{n}{12}}$ (v mm), ton pa je za $n$ poltonov višji. a) Ali $L$ narašča ali pada in s katerim faktorjem se spremeni od prečke do prečke? b) Kako daleč od sedla (zgornjega konca strune pri glavi kitare) je $5.$ prečka? c) Pri kateri prečki niha natanko polovica strune? d) Zakaj so prečke proti trupu kitare vse bolj skupaj?

**Podatki:** $L(n) = 650 \cdot 2^{-\frac{n}{12}}$ (v mm); cela struna $L(0) = 650\,\mathrm{mm}$; prečka $n = 5$; polovica strune $325\,\mathrm{mm}$
**Iščemo:** a) monotonost in faktor, b) razdaljo $650 - L(5)$, c) $n$, pri katerem je $L(n) = 325\,\mathrm{mm}$, d) razlago razmikov med prečkami

:::formula
$2^{-\frac{n}{12}} = \left(2^{-\frac{1}{12}}\right)^n$ (potenca potence); $2^{-1} = \dfrac{1}{2}$.
:::

**Rešitev:**

1. a) Predpis zapišemo z eno samo osnovo: $2^{-\frac{n}{12}} = \left(2^{-\frac{1}{12}}\right)^n$, osnova je $2^{-\frac{1}{12}} \approx 0{,}9439$.
2. Osnova je med $0$ in $1$, zato $L$ strogo pada. Vsaka prečka nihajoči del **pomnoži** z $0{,}9439$, torej ga skrajša za približno $5{,}6\,\%$.
3. b) $L(5) = 650 \cdot 2^{-\frac{5}{12}}$. Z računalom: $650 \cdot 0{,}74915 \approx 486{,}95$, torej niha še $486{,}95\,\mathrm{mm}$ strune.
4. Prečka je od sedla oddaljena za preostanek: $650 - 486{,}95 = 163{,}05\,\mathrm{mm}$.
5. c) Vprašanje je obratno: poznamo vrednost, iščemo $n$. Ker je $325 = 650 \cdot \dfrac{1}{2} = 650 \cdot 2^{-1}$, mora biti eksponent $-\dfrac{n}{12}$ enak $-1$, torej $n = 12$. Ker $L$ strogo pada, drugega takega $n$ ni.
6. d) Vsak razmik je približno $5{,}6\,\%$ dolžine, ki še niha. Ta dolžina pada, zato padajo tudi razmiki: prvi meri $650 - 613{,}52 = 36{,}48\,\mathrm{mm}$, razmik med $11.$ in $12.$ prečko pa le še $344{,}33 - 325 = 19{,}33\,\mathrm{mm}$.
7. Odgovor: $L$ pada, od prečke do prečke se pomnoži z $2^{-\frac{1}{12}} \approx 0{,}9439$. Peta prečka je približno $163\,\mathrm{mm}$ od sedla, polovica strune niha pri $12.$ prečki (ton je oktavo višji). Razmiki med prečkami se manjšajo, ker je vsak približno $5{,}6\,\%$ dolžine, ki še niha (od $36{,}48\,\mathrm{mm}$ do $19{,}33\,\mathrm{mm}$).

### Primer 4 – zdaj ti

Dana je funkcija $g(x) = 2^{x+1} - 4$. Določi njeno definicijsko območje, zalogo vrednosti, asimptoto in presečišče z osjo $y$. Pokaži, da je $x = 1$ njena ničla, in pojasni, zakaj druge ničle nima. Za katere $x$ je funkcija negativna?

**Podatki:** $g(x) = 2^{x+1} - 4$, osnova $a = 2$, kandidat za ničlo $x = 1$
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

Najprej odgovori in sam nariši graf funkcije $g$. Šele nato ga primerjaj s sliko: asimptota $y = -4$, točki $(0, -2)$ in $(1, 0)$.

:::risba graf
opis: Graf funkcije g(x) = 2 na (x + 1), minus 4, za x od −5 do 3. Vodoravna črtkana črta je asimptota y = −4; graf se ji z leve približuje od zgoraj. Graf narašča, seka os y v točki (0, −2) in os x v točki (1, 0). Levo od x = 1 je pod osjo x, desno nad njo.
x: -5 .. 3 | 1 | x
y: -6 .. 5 | 1 | y
f: 2^(x+1) - 4 | modra debelo
črta: -5; -4 -> 3; -4 | oranžna črtkano
napis: -3; -4,5 | asimptota y = −4 | sredina | oranžna
točka: 0; -2 | (0, −2) | desno
točka: 1; 0 | (1, 0) | pod desno
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
- $y = c \cdot a^x$, $c > 0$: razteg v smeri osi $y$; graf gre skozi $(0, c)$.
- Naravna eksponentna funkcija: $e^x$, $e \approx 2{,}718$.

## Drugače: Z analogijo

Eksponentna rast je kot prepogibanje lista papirja. List je debel $0{,}1\,\mathrm{mm}$, vsak pregib debelino podvoji. Po $n$ pregibih je sveženj debel $0{,}1 \cdot 2^n$ milimetrov. Če bi list lahko prepognil $10$-krat, bi bil debel že $0{,}1 \cdot 1024 = 102{,}4\,\mathrm{mm}$, več kot $10\,\mathrm{cm}$. Pri linearni rasti bi vsak pregib dodal le $0{,}1\,\mathrm{mm}$ in sveženj bi meril komaj $1{,}1\,\mathrm{mm}$.

Padajoči graf $y = \left(\frac{1}{2}\right)^x$ je kot torta, ki jo vedno znova razrežeš na pol. Kos je vsakič manjši, a polovica kosa je še vedno kos, zato do nič nikoli ne prideš. Zato se graf osi $x$ le približuje.

## Drugače: Bolj natančno

**Zakaj je funkcija $a^x$ pri $a > 1$ naraščajoča?** Naj bo $x_1 < x_2$. Potem je $x_2 - x_1 > 0$ in

$$a^{x_2} = a^{x_1} \cdot a^{x_2 - x_1}.$$

Za $a > 1$ in pozitiven eksponent je $a^{x_2 - x_1} > 1$ (za racionalni eksponent $\frac{m}{n} > 0$ je $\sqrt[n]{a^m} > 1$, ker je $a^m > 1$). Ker je $a^{x_1} > 0$, sledi $a^{x_2} > a^{x_1}$. Pri $0 < a < 1$ je $a^{x_2 - x_1} < 1$ in neenakost se obrne.

**Iracionalni eksponenti.** Potence smo doslej poznali le z racionalnimi eksponenti. Kaj pomeni $2^{\sqrt{2}}$? Eksponent $\sqrt{2} = 1{,}41421\ldots$ približujemo z $1{,}4$; $1{,}41$; $1{,}414$; … Potence $2^{1{,}4}$, $2^{1{,}41}$, $2^{1{,}414}$, … zaradi monotonosti naraščajo, so manjše od $2^{1{,}5}$ in se približujejo enemu samemu številu, $2^{\sqrt{2}} \approx 2{,}665$. Tako je $a^x$ definirana za vsak realen $x$, graf pa je neprekinjena krivulja brez lukenj.

**Značilna lastnost.** Za eksponentno funkcijo velja $f(u + v) = f(u) \cdot f(v)$, ker je $a^{u+v} = a^u \cdot a^v$. Zaradi stroge monotonosti je funkcija tudi injektivna: različnim $x$ pripadata različni vrednosti. Na tem temelji reševanje eksponentnih enačb.

## Preveri se

? Tri od teh števil so večja od $1$, eno ni. Katero je izjema? Računala ne potrebuješ.
+ $0{,}4^{0{,}3}$
- $0{,}5^{-2}$
~ Osnova je manjša od $1$, a eksponent je negativen: $0{,}5^{-2} = 2^2 = 4$. Padajoča funkcija ima levo od $0$ vrednosti nad $1$.
- $3^{0{,}2}$
~ Eksponent je majhen, a pozitiven. Funkcija $3^x$ narašča, zato je $3^{0{,}2}$ večje od $3^0 = 1$.
- $0{,}7^{-0{,}5}$
~ Negativni eksponent ne pomeni majhne vrednosti. Funkcija $0{,}7^x$ pada, zato je pri negativnem eksponentu vrednost večja od $0{,}7^0 = 1$.
> Funkcija $0{,}4^x$ pada in eksponent $0{,}3$ je pozitiven, zato je $0{,}4^{0{,}3}$ manjše od $0{,}4^0 = 1$. Vsako število primerjaš z $a^0 = 1$ in upoštevaš, ali funkcija narašča ali pada.

? Graf funkcije $f(x) = 2^{x-p} + q$ ima asimptoto $y = -3$ in gre skozi točko $(1, -2)$. Koliko sta $p$ in $q$?
- $p = -1$ in $q = -3$
~ Smer premika je obrnjena. Pri $p = -1$ dobimo $2^{1+1} - 3 = 1$, graf torej ne gre skozi $(1, -2)$.
- $p = 1$ in $q = 3$
~ Asimptota je premica $y = q$, zato mora biti $q = -3$. Pri $q = 3$ bi bil ves graf nad premico $y = 3$.
- $p = 0$ in $q = -3$
~ Asimptota je prava, točka pa ni preverjena: brez premika po osi $x$ dobimo pri $x = 1$ vrednost $2^1 - 3 = -1$.
+ $p = 1$ in $q = -3$
> Asimptota $y = q$ da $q = -3$. Točka $(0, 1)$ osnovnega grafa se premakne v $(p, 1 + q) = (p, -2)$, zato je $p = 1$. Preizkus: $2^{1-1} - 3 = -2$.

? Zakaj graf funkcije $y = a^x$ ($a > 0$, $a \ne 1$) nikoli ne seka osi $x$?
- Ker je funkcija naraščajoča.
~ Tudi padajoče funkcije, na primer $0{,}5^x$, ne sekajo osi $x$, naraščajoča premica $y = x$ pa jo seka. Monotonost ni razlog.
+ Ker je potenca s pozitivno osnovo pozitivna pri vsakem eksponentu, zato vrednosti $0$ funkcija ne doseže.
- Ker gre graf skozi točko $(0, 1)$.
~ Tudi parabola $y = 1 - x^2$ gre skozi $(0, 1)$, pa vseeno seka os $x$ pri $x = -1$ in $x = 1$.
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
f | eksponentna funkcija | f(x) = a^x | |
g | druga funkcija: v točki 4 $g(x) = \left(\frac{1}{2}\right)^x$, v primeru 4 $g(x) = 2^{x+1} - 4$ | | |
x | neodvisna spremenljivka (eksponent) | | |
a | osnova | | | $a > 0$, $a \ne 1$
e | Eulerjevo število, osnova naravne eksponentne funkcije | | | $e \approx 2{,}718$
x_1, x_2 | dve vrednosti spremenljivke | | | $x_1 < x_2$
n | števec korakov: poltoni (razlaga 1), prečka (primer 3), pregibi (analogija) | | | v primeru 1 in v korenu naravno število
m | celo število v števcu racionalnega eksponenta $\frac{m}{n}$ | | |
L | dolžina nihajočega dela strune | L(n) = 650 \cdot 2^{-\frac{n}{12}} | mm |
y | vrednost funkcije | y = a^{x-p} + q | |
p | premik grafa v smeri osi $x$ | | | pri $p > 0$ v desno
q | premik grafa v smeri osi $y$ | | | asimptota postane $y = q$
c | faktor raztega v smeri osi $y$ | y = c \cdot a^x | | graf gre skozi $(0, c)$
u, v | eksponenta v pravilu za produkt potenc | | |
D_f, D_g | definicijsko območje funkcije $f$ oziroma $g$ | | | pri $a^x$ je $\mathbb{R}$
Z_f, Z_g | zaloga vrednosti funkcije $f$ oziroma $g$ | | | pri $a^x$ je $(0, \infty)$
A | amplituda nihanja strune | A(t) = 8 \cdot 0{,}5^t | | v desetinkah milimetra; $8$ pomeni $0{,}8\,\mathrm{mm}$
k | smerni koeficient linearne funkcije (stalni prirastek) | | |
t | čas | | s |
:::
