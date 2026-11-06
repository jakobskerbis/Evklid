---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tesar na gradbišču meri dolžino trama. Sodelavec Matic mu reče: »Ne meri petkrat. Vsaka meritev prinese svojo napako, napake se seštejejo in povprečje petih meritev je slabše od ene same.«

Ima Matic prav? Ob koncu lekcije boš znal to presoditi s številkami. Enako vprašanje si postavi vsak analizni kemik: titracijo ali tehtanje ponovi trikrat ali petkrat, nato pa mora povedati, kaj je rezultat, kako zanesljiv je in koliko števk sme zapisati. Brez tega je število na poročilu samo ugibanje z decimalkami.

## Razlaga

**Pet meritev istega trama.** Tesar je z merskim trakom (razdelki po $1\,\mathrm{mm}$) izmeril spodnje dolžine. Zadnja dva stolpca vsebujeta odmike od povprečja $\bar x = 2002\,\mathrm{mm}$, ki ga izračunamo takoj pod tabelo.

| Meritev $i$ | $x_i$ [mm] | odmik $x_i - \bar x$ [mm] | kvadrat odmika [mm²] |
|---|---|---|---|
| 1 | 2003 | $+1$ | 1 |
| 2 | 2001 | $-1$ | 1 |
| 3 | 2004 | $+2$ | 4 |
| 4 | 2000 | $-2$ | 4 |
| 5 | 2002 | $0$ | 0 |

**Definicija.** Naj bodo $x_1, x_2, \dots, x_n$ rezultati $n$ ponovljenih meritev iste količine pod enakimi pogoji. Njihova **aritmetična sredina** ali povprečje je vsota meritev, deljena s številom meritev $n$:

$$\bar x = \frac{1}{n}\sum_{i=1}^{n} x_i = \frac{10\,010\,\mathrm{mm}}{5} = 2002\,\mathrm{mm}$$

Poglej stolpec z odmiki. Odmiki so pozitivni in negativni, njihova vsota je točno $0$. To velja vedno: $\sum (x_i - \bar x) = \sum x_i - n\bar x = n\bar x - n\bar x = 0$. Zato povprečni odmik ne pove ničesar o raztrosu.

**Trditev.** Povprečje je najboljša ocena prave vrednosti v tem smislu, da je vsota kvadratov odmikov $\sum (x_i - a)^2$ najmanjša natanko pri $a = \bar x$. *Dokaz:* $\sum (x_i - a)^2 = \sum \big((x_i - \bar x) + (\bar x - a)\big)^2 = \sum (x_i - \bar x)^2 + 2(\bar x - a)\sum (x_i - \bar x) + n(\bar x - a)^2$. Srednji člen je $0$, zadnji je $\ge 0$ in enak $0$ le pri $a = \bar x$.

Za raztros odmike kvadriramo. Kvadrat odmika je vedno pozitiven, zato se ne izniči. **Definicija:** za $n \ge 2$ meritev je **standardni odklon** vzorca $s$, merilo za raztros posameznih meritev okoli povprečja,

$$s = \sqrt{\frac{\sum (x_i - \bar x)^2}{n-1}}$$

Za tram: vsota kvadratov je $10\,\mathrm{mm^2}$, torej $s = \sqrt{10/4}\,\mathrm{mm} \approx 1{,}58\,\mathrm{mm}$.

Zakaj $n-1$ in ne $n$? Odmike smo računali od $\bar x$, ki smo ga izračunali iz istih podatkov. Ko poznaš štiri odmike, je peti določen (vsota mora biti $0$). Neodvisnih podatkov o raztrosu je samo $n-1$. Temu številu rečemo **prostostne stopnje**.

Včasih podamo raztros v odstotkih povprečja. To je **relativni standardni odklon**, $\mathrm{RSD} = \dfrac{s}{\bar x}\cdot 100\,\%$. Za tram je približno $0{,}08\,\%$.

:::premisli
Tesar doda šesto meritev, ki je točno $2002\,\mathrm{mm}$, enaka povprečju. Se bo $s$ povečal, zmanjšal ali ostal enak? Napovej, preden računaš.
---
Zmanjša se. Vsota kvadratov ostane $10\,\mathrm{mm^2}$, delimo pa s $5$ namesto s $4$: $s = \sqrt{2}\,\mathrm{mm} \approx 1{,}41\,\mathrm{mm}$. Meritev blizu povprečja kaže, da je raztros manjši, kot smo mislili.
:::

**Kaj se zgodi, ko meritev dodajamo.** Recimo, da tesar meri enako skrbno in dobi vedno $s \approx 1{,}58\,\mathrm{mm}$, enkrat s 3, enkrat s 5, enkrat z 10 meritvami. Poleg $s$ izračunamo še polovično širino **intervala zaupanja**, v katerem s 95-% zaupanjem leži prava dolžina. Kako ga izračunamo in kaj je faktor $t$, pove izrek spodaj; zdaj samo glej zadnji stolpec.

| $n$ | $s$ [mm] | faktor $t$ (95 %) | polovična širina [mm] |
|---|---|---|---|
| 3 | 1,58 | 4,303 | 3,9 |
| 5 | 1,58 | 2,776 | 2,0 |
| 10 | 1,58 | 2,262 | 1,1 |

Opazi dvoje. Standardni odklon se z več meritvami ne spremeni: to je lastnost metode in skrbnosti, ne števila meritev. Interval pa se hitro oži. Matic se torej moti. Napake posameznih meritev se pri povprečju ne seštevajo, ampak se delno izničijo.

**Izrek (standardni odklon povprečja).** Če so meritve $x_1, \dots, x_n$ med seboj neodvisne in ima vsaka standardni odklon $\sigma$, potem ima povprečje standardni odklon $\sigma_{\bar x} = \sigma/\sqrt n$. *Dokaz:* **varianca** je kvadrat standardnega odklona; variance neodvisnih količin se seštevajo, zato je varianca vsote $\sum x_i$ enaka $n\sigma^2$. Deljenje s konstanto $n$ deli varianco z $n^2$: varianca $\bar x$ je $n\sigma^2/n^2 = \sigma^2/n$, koren da $\sigma/\sqrt n$.

**Izrek: interval zaupanja.** Naj bodo meritve neodvisne in normalno porazdeljene okoli prave vrednosti $\mu$ (brez sistematske napake), $\bar x$ in $s$ pa izračunana iz istih $n$ meritev. Potem $\mu$ z izbrano verjetnostjo $P$ (navadno 95 %) leži v intervalu

$$\mu = \bar x \pm \frac{t \cdot s}{\sqrt{n}}$$

Količnik $s/\sqrt n$ je ocena **standardnega odklona povprečja**. Faktor $t$ je **Studentov faktor**: ker $\sigma$ ne poznamo in ga nadomestimo s $s$, količina $(\bar x - \mu)\sqrt n/s$ ni normalno porazdeljena, ampak po Studentu z $n-1$ prostostnimi stopnjami. Odčitamo ga iz tabele za $n-1$ prostostnih stopenj in izbrano verjetnost. Za 95 %: $t = 4{,}303$ ($n=3$), $3{,}182$ ($n=4$), $2{,}776$ ($n=5$), $2{,}571$ ($n=6$), $2{,}447$ ($n=7$), $2{,}262$ ($n=10$). Pri zelo velikem $n$ se $t$ približa $1{,}96$.

Interval zajame le naključne napake; sistematske (npr. napačno umerjena bireta) ne zmanjša nobeno število ponovitev. Raztros $s$ opisuje **natančnost** (preciznost), odmik povprečja od prave vrednosti pa **pravilnost**.

**Primerjava z referenčno vrednostjo (t-test).** Če je prava vrednost $\mu_0$ znana (certificirani referenčni material), izračunamo $t_\mathrm{izr} = |\bar x - \mu_0|\sqrt n/s$. Če je $t_\mathrm{izr} > t$ iz tabele, je razlika statistično značilna in metoda ima sistematsko napako. To je isto kot vprašanje, ali $\mu_0$ leži zunaj intervala zaupanja, saj je $|\bar x - \mu_0| > ts/\sqrt n$ natanko tedaj, ko je $t_\mathrm{izr} > t$.

:::premisli
Med $n = 3$ in $n = 10$ se $\sqrt n$ poveča manj kot dvakrat, interval pa se zoži več kot trikrat. Zakaj?
---
Ker se zmanjša tudi $t$. Pri malo meritvah je sama ocena $s$ negotova, zato tabela da velik faktor $t$ (previdnost). Z več meritvami $s$ poznamo bolje in $t$ pade s $4{,}303$ na $2{,}262$. Oba učinka skupaj zožita interval.
:::

**Značilne števke.** Kalkulator za tram izpiše $\bar x = 2002$ in $s = 1{,}5811388\ldots$ Vseh teh števk ne smemo zapisati. **Značilne števke** so vse zanesljive števke in prva negotova.

- Ničle na začetku (vodilne ničle) niso značilne: $0{,}0450$ ima tri značilne števke ($4$, $5$ in zadnjo ničlo).
- Ničle na koncu za decimalno vejico so značilne: $25{,}00\,\mathrm{mL}$ pomeni, da smo brali na stotinko.
- Pri seštevanju in odštevanju ima rezultat toliko decimalnih mest kot podatek z najmanj decimalnimi mesti.
- Pri množenju in deljenju ima rezultat toliko značilnih števk kot podatek z najmanj značilnimi števkami.
- Negotovost zaokrožimo na eno (največ dve) značilni števki, povprečje pa na isto decimalno mesto kot negotovost.

Vmesnih rezultatov ne zaokrožujemo; zaokrožimo šele končni rezultat. Za tram pri $n = 5$: $\mu = (2002 \pm 2)\,\mathrm{mm}$.

## Rešeni primeri

### Primer 1: vlaga v mivki

Laboratorij betonarne štirikrat določi masni delež vode v mivki za beton: $5{,}2\,\%$; $5{,}5\,\%$; $5{,}3\,\%$ in $5{,}4\,\%$. Izračunaj povprečje in standardni odklon.

**Podatki:** $x_1 = 5{,}2\,\%$, $x_2 = 5{,}5\,\%$, $x_3 = 5{,}3\,\%$, $x_4 = 5{,}4\,\%$, $n = 4$
**Iščemo:** povprečje $\bar x$ in standardni odklon $s$

:::formula
$\bar x = \dfrac{\sum x_i}{n}$, $\quad s = \sqrt{\dfrac{\sum (x_i - \bar x)^2}{n-1}}$
:::

**Rešitev:**

1. Vsota meritev: $5{,}2 + 5{,}5 + 5{,}3 + 5{,}4 = 21{,}4$, zato $\bar x = 21{,}4 / 4 = 5{,}35\,\%$.
2. Odmiki od povprečja so $-0{,}15$; $+0{,}15$; $-0{,}05$ in $+0{,}05$ (vsota je $0$, kar je dobra kontrola).
3. Kvadrati odmikov: $0{,}0225 + 0{,}0225 + 0{,}0025 + 0{,}0025 = 0{,}05$.
4. Delimo s prostostnimi stopnjami $n - 1 = 3$ in korenimo: $s = \sqrt{0{,}05/3} \approx 0{,}129\,\%$.
5. Odgovor: povprečni delež vode je $5{,}35\,\%$, standardni odklon pa približno $0{,}13\,\%$.

### Primer 2: CaO v cementu z intervalom zaupanja

Petkrat določimo masni delež CaO v cementu: $63{,}2\,\%$; $63{,}5\,\%$; $63{,}1\,\%$; $63{,}4\,\%$ in $63{,}3\,\%$. Podaj rezultat s 95-% intervalom zaupanja in pravilnim številom značilnih števk.

**Podatki:** pet meritev ($n = 5$) zgoraj, verjetnost $95\,\%$, $t = 2{,}776$ za $4$ prostostne stopnje
**Iščemo:** interval zaupanja za pravo vrednost $\mu$

:::formula
$\mu = \bar x \pm \dfrac{t \cdot s}{\sqrt{n}}$
:::

**Rešitev:**

1. Povprečje: $\bar x = 316{,}5\,\% / 5 = 63{,}3\,\%$.
2. Odmiki so $-0{,}1$; $+0{,}2$; $-0{,}2$; $+0{,}1$ in $0$. Vsota kvadratov je $0{,}10$.
3. $s = \sqrt{0{,}10/4} \approx 0{,}158\,\%$ (ne zaokrožujemo še, ker računamo naprej).
4. Polovična širina: $\dfrac{2{,}776 \cdot 0{,}158}{\sqrt 5} \approx 0{,}196\,\%$.
5. Negotovost zaokrožimo na eno značilno števko, $0{,}2\,\%$; povprečje ima že eno decimalko, kar se ujema.
6. Odgovor: masni delež CaO je $(63{,}3 \pm 0{,}2)\,\%$ pri 95-% zaupanju.

### Primer 3 (izpitna raven): preverjanje metode na referenčnem materialu

Laboratorij uvaja novo metodo za določanje bakra v zemlji in jo preizkusi na certificiranem referenčnem materialu z vrednostjo $\mu_0 = 49{,}5\,\mathrm{mg/kg}$. Pet določitev da $51{,}8$; $49{,}9$; $52{,}6$; $50{,}7$ in $51{,}5\,\mathrm{mg/kg}$. Podaj rezultat s 95-% intervalom zaupanja, presodi, ali ima metoda sistematsko napako, in izračunaj, najmanj koliko ponovitev bi potrebovali za polovično širino intervala največ $1{,}0\,\mathrm{mg/kg}$ (privzemi, da se $s$ ne spremeni).

**Podatki:** pet meritev zgoraj ($n = 5$), $\mu_0 = 49{,}5\,\mathrm{mg/kg}$, $P = 95\,\%$; $t = 2{,}776$ ($n=5$), $2{,}571$ ($n=6$), $2{,}447$ ($n=7$); polovična širina $\le 1{,}0\,\mathrm{mg/kg}$
**Iščemo:** interval zaupanja, odločitev o sistematski napaki, najmanjši $n$

:::formula
$\mu = \bar x \pm \dfrac{t \cdot s}{\sqrt{n}}$, $\quad t_\mathrm{izr} = \dfrac{|\bar x - \mu_0|\sqrt n}{s}$
:::

**Rešitev:**

1. Povprečje: $\bar x = 256{,}5\,\mathrm{mg/kg} / 5 = 51{,}3\,\mathrm{mg/kg}$.
2. Odmiki so $+0{,}5$; $-1{,}4$; $+1{,}3$; $-0{,}6$ in $+0{,}2$ (vsota $0$). Vsota kvadratov je $0{,}25 + 1{,}96 + 1{,}69 + 0{,}36 + 0{,}04 = 4{,}30$.
3. $s = \sqrt{4{,}30/4} \approx 1{,}037\,\mathrm{mg/kg}$, $\mathrm{RSD} \approx 2{,}0\,\%$.
4. Polovična širina: $\dfrac{2{,}776 \cdot 1{,}037}{\sqrt 5} \approx 1{,}29\,\mathrm{mg/kg}$, zaokroženo $1{,}3$. Rezultat je $(51{,}3 \pm 1{,}3)\,\mathrm{mg/kg}$, interval sega od $50{,}0$ do $52{,}6\,\mathrm{mg/kg}$.
5. Certificirana vrednost $49{,}5$ leži zunaj intervala. Enako pove t-test: $t_\mathrm{izr} = \dfrac{1{,}8 \cdot \sqrt 5}{1{,}037} \approx 3{,}88 > 2{,}776$. Razlika je značilna: metoda daje sistematsko previsoke rezultate, za okoli $1{,}8\,\mathrm{mg/kg}$ ($3{,}6\,\%$).
6. Ožji interval: pri $n = 6$ je polovična širina $\dfrac{2{,}571 \cdot 1{,}037}{\sqrt 6} \approx 1{,}09\,\mathrm{mg/kg}$, še preveč; pri $n = 7$ je $\dfrac{2{,}447 \cdot 1{,}037}{\sqrt 7} \approx 0{,}96\,\mathrm{mg/kg}$, kar ustreza.
7. Odgovor: baker v referenčnem materialu je $(51{,}3 \pm 1{,}3)\,\mathrm{mg/kg}$; metoda ima sistematsko napako, za polovično širino do $1{,}0\,\mathrm{mg/kg}$ pa potrebujemo najmanj $7$ ponovitev. Več ponovitev zoži interval, sistematske napake pa ne odpravi; najprej moramo najti njen vzrok.

### Primer 4: zdaj ti

Opeka ima maso $3{,}482\,\mathrm{kg}$ in mere $0{,}250\,\mathrm{m} \times 0{,}120\,\mathrm{m} \times 0{,}065\,\mathrm{m}$. Izračunaj njeno gostoto s pravilnim številom značilnih števk.

**Podatki:** $m = 3{,}482\,\mathrm{kg}$, $a = 0{,}250\,\mathrm{m}$, $b = 0{,}120\,\mathrm{m}$, $c = 0{,}065\,\mathrm{m}$
**Iščemo:** gostoto $\rho$

:::formula
$\rho = \dfrac{m}{a \cdot b \cdot c}$
:::

**Rešitev:**

1. Prostornina: $V = 0{,}250 \cdot 0{,}120 \cdot 0{,}065\,\mathrm{m^3} = 0{,}00195\,\mathrm{m^3}$ (vmesno ne zaokrožujemo).
2. Preštej značilne števke: $3{,}482$ ima štiri, $0{,}250$ in $0{,}120$ po tri, $0{,}065$ pa le dve.
3. Izračunaj $\rho$ in ga zaokroži sam, nato preveri:

:::premisli
Kolikšna je gostota opeke, zapisana s pravilnim številom značilnih števk?
---
$\rho = 3{,}482\,\mathrm{kg} / 0{,}00195\,\mathrm{m^3} \approx 1786\,\mathrm{kg/m^3}$. Najmanj značilnih števk (dve) ima $0{,}065\,\mathrm{m}$, zato zapišemo $\rho \approx 1{,}8 \cdot 10^3\,\mathrm{kg/m^3}$.
:::

## Pogoste napake

- **»Več meritev pomeni več napak.«** Napake posameznih meritev se pri povprečju delno izničijo. Raztros posamezne meritve ($s$) ostane enak, negotovost povprečja ($s/\sqrt n$) pa pada. Popravek: ločuj $s$ od intervala zaupanja.
- **»Z več meritvami se zmanjša $s$.«** Obratna napaka. Standardni odklon opisuje metodo in ga s ponavljanjem le natančneje ocenimo. Ožji postane interval zaupanja.
- **Deljenje z $n$ namesto z $n-1$.** Tako dobiš premajhen $s$ in preveč optimističen rezultat. Pri malo meritvah je razlika velika. Popravek: pri vzorcu meritev vedno $n-1$.
- **Pozabljen $\sqrt n$ ali $t$.** Kdor zapiše $\bar x \pm s$, poda raztros meritev, ne intervala zaupanja. Kdor vzame $1{,}96$ pri treh meritvah, dobi več kot dvakrat preozek interval. Popravek: $t$ iz tabele za $n - 1$ prostostnih stopenj.
- **Vse števke s kalkulatorja.** Zapis $(20{,}4625 \pm 0{,}0796)\,\mathrm{mL}$ trdi, da poznamo desettisočinke, čeprav je negotova že stotinka. Popravek: negotovost na eno značilno števko, povprečje na isto decimalno mesto.

## Povzetek

- Povprečje $\bar x = \sum x_i / n$ je najboljša ocena prave vrednosti.
- Standardni odklon $s = \sqrt{\sum (x_i - \bar x)^2 / (n-1)}$ meri raztros posameznih meritev; $\mathrm{RSD} = s/\bar x \cdot 100\,\%$.
- Interval zaupanja: $\mu = \bar x \pm t s / \sqrt n$, $t$ iz tabele za $n-1$ prostostnih stopenj (95 %: $n=3$: $4{,}303$; $n=5$: $2{,}776$).
- Več meritev ne zmanjša $s$, zoži pa interval zaupanja.
- Značilne števke: vodilne ničle ne štejejo; pri $\pm$ decimalna mesta, pri $\cdot$ in $:$ značilne števke; negotovost na 1 števko, povprečje na isto mesto; zaokrožuj šele na koncu.
- t-test: $t_\mathrm{izr} = |\bar x - \mu_0|\sqrt n/s > t$ pomeni značilno razliko od referenčne vrednosti (sistematska napaka).

## Za izpit

Znati moraš povedati:

- natančne definicije aritmetične sredine, standardnega odklona vzorca, relativnega standardnega odklona in prostostnih stopenj;
- dokaz, da je $\sum (x_i - \bar x) = 0$ in da je $\sum (x_i - a)^2$ najmanjša pri $a = \bar x$;
- izrek o standardnem odklonu povprečja $\sigma/\sqrt n$ s pogojem neodvisnosti in njegov dokaz;
- interval zaupanja z vsemi pogoji (neodvisne, normalno porazdeljene meritve brez sistematske napake), zakaj $t$ in ne $1{,}96$, in zvezo s t-testom;
- pravila za značilne števke in zapis rezultata z negotovostjo.

### Naloga 1

Ocetno kislino v kisu preverjaš s titracijo; po specifikaciji proizvajalca je njena masna koncentracija $\gamma_0 = 90{,}5\,\mathrm{g/L}$. $25{,}00\,\mathrm{mL}$ kisa razredčiš v merilni bučki na $250{,}0\,\mathrm{mL}$, nato štirikrat odpipetiraš po $25{,}00\,\mathrm{mL}$ razredčene raztopine in titriraš z NaOH s $c = 0{,}1000\,\mathrm{mol/L}$. Porabe so $37{,}42$; $37{,}55$; $37{,}48$ in $37{,}39\,\mathrm{mL}$. $M(\mathrm{CH_3COOH}) = 60{,}05\,\mathrm{g/mol}$, $t = 3{,}182$ za $3$ prostostne stopnje (95 %). (a) Podaj masno koncentracijo ocetne kisline v kisu s 95-% intervalom zaupanja. (b) Ali se rezultat značilno razlikuje od specifikacije? (c) Kolikšno najmanjšo razliko od specifikacije bi s štirimi titracijami pri tej natančnosti še zaznal?

**Rešitev:**

1. Reakcija $\mathrm{CH_3COOH + NaOH \to CH_3COONa + H_2O}$ poteče v razmerju $1 : 1$, zato je v alikvotu $n = c\,V$.
2. Alikvot $25{,}00\,\mathrm{mL}$ desetkrat razredčenega kisa vsebuje kislino iz $2{,}500\,\mathrm{mL}$ kisa. Zato je $\gamma = \dfrac{0{,}1000 \cdot V \cdot 10^{-3} \cdot 60{,}05}{2{,}500 \cdot 10^{-3}}\,\mathrm{g/L} = 2{,}402\,\mathrm{g\,L^{-1}\,mL^{-1}} \cdot V$.
3. Povprečna poraba: $\bar V = 149{,}84\,\mathrm{mL}/4 = 37{,}46\,\mathrm{mL}$. Odmiki: $-0{,}04$; $+0{,}09$; $+0{,}02$; $-0{,}07$. Vsota kvadratov $0{,}0150\,\mathrm{mL^2}$, $s_V = \sqrt{0{,}0150/3} \approx 0{,}0707\,\mathrm{mL}$.
4. Ker je $\gamma$ sorazmerna z $V$, se s istim faktorjem pomnožita povprečje in standardni odklon: $\bar\gamma = 2{,}402 \cdot 37{,}46 \approx 89{,}98\,\mathrm{g/L}$, $s_\gamma = 2{,}402 \cdot 0{,}0707 \approx 0{,}170\,\mathrm{g/L}$.
5. Polovična širina: $\dfrac{3{,}182 \cdot 0{,}170}{\sqrt 4} \approx 0{,}27\,\mathrm{g/L}$, zaokroženo $0{,}3$; rezultat (a) je $\gamma = (90{,}0 \pm 0{,}3)\,\mathrm{g/L}$.
6. (b) $t_\mathrm{izr} = \dfrac{|89{,}98 - 90{,}5| \cdot \sqrt 4}{0{,}170} \approx 6{,}1 > 3{,}182$, zato je razlika značilna; kis vsebuje manj kisline, kot navaja specifikacija.
7. (c) Najmanjša zaznavna razlika je ravno polovična širina intervala, $ts/\sqrt n \approx 0{,}27\,\mathrm{g/L}$.
8. Odgovor: $\gamma = (90{,}0 \pm 0{,}3)\,\mathrm{g/L}$; od specifikacije $90{,}5\,\mathrm{g/L}$ se značilno razlikuje; zaznamo razlike, večje od okoli $0{,}3\,\mathrm{g/L}$.

### Naloga 2

Naj bodo $x_1, \dots, x_n$ neodvisne meritve iste količine, vsaka s standardnim odklonom $\sigma$. (a) Dokaži, da je standardni odklon povprečja $\sigma/\sqrt n$. (b) Natančno navedi pogoje, pod katerimi leži prava vrednost s 95-% verjetnostjo v intervalu $\bar x \pm ts/\sqrt n$, in pojasni, zakaj vzamemo $t$ in ne $1{,}96$. (c) Utemelji, ali se interval pri enakem $s$ zoži na polovico, če namesto $4$ meritev ($t = 3{,}182$) opravimo $16$ ($t = 2{,}131$).

**Rešitev:**

1. Za neodvisne količine je varianca vsote enaka vsoti varianc, zato ima $\sum x_i$ varianco $n\sigma^2$.
2. Za konstanto $k$ ima $kX$ varianco $k^2$-krat večjo. S $k = 1/n$ dobimo varianco povprečja $n\sigma^2/n^2 = \sigma^2/n$, torej $\sigma_{\bar x} = \sigma/\sqrt n$.
3. Pogoji: meritve so neodvisne, normalno porazdeljene okoli prave vrednosti $\mu$ (ni sistematske napake), $\bar x$ in $s$ sta izračunana iz istih $n$ meritev.
4. $\sigma$ ne poznamo in ga nadomestimo z oceno $s$, ki je pri malo meritvah sama negotova. Količina $(\bar x - \mu)\sqrt n/s$ zato sledi Studentovi porazdelitvi z $n-1$ prostostnimi stopnjami, ki ima širše repe od normalne; $t > 1{,}96$ in se $1{,}96$ približa šele pri velikem $n$.
5. Razmerje polovičnih širin: $\dfrac{2{,}131/\sqrt{16}}{3{,}182/\sqrt 4} = \dfrac{0{,}533}{1{,}591} \approx 0{,}335$.
6. Odgovor: $\sigma_{\bar x} = \sigma/\sqrt n$; interval se ne zoži le na polovico (to bi dal sam $\sqrt n$), ampak na približno tretjino, ker se zmanjša tudi $t$.

## Drugače: Korak za korakom s številkami

Postopek za vsak niz ponovljenih meritev, na primeru treh debelin keramične ploščice $8{,}1$; $8{,}3$ in $8{,}2\,\mathrm{mm}$:

1. Seštej in deli: $\bar x = 24{,}6 / 3 = 8{,}2\,\mathrm{mm}$.
2. Odmiki: $-0{,}1$; $+0{,}1$; $0$. Kontrola: vsota je $0$.
3. Kvadrati: $0{,}01 + 0{,}01 + 0 = 0{,}02$.
4. Deli z $n - 1 = 2$ in koreni: $s = \sqrt{0{,}01} = 0{,}1\,\mathrm{mm}$.
5. Iz tabele: $t = 4{,}303$ za $2$ prostostni stopnji.
6. Polovična širina: $4{,}303 \cdot 0{,}1 / \sqrt 3 \approx 0{,}25\,\mathrm{mm}$.
7. Zaokroži: $0{,}2\,\mathrm{mm}$ (ena značilna števka); povprečje na desetinko.
8. Zapiši: debelina je $(8{,}2 \pm 0{,}2)\,\mathrm{mm}$ pri 95-% zaupanju.

## Drugače: Kot zgodba

Trije zidarji gradijo isti zid in vsak po svoje meri višino vrste opek.

Prvi izmeri enkrat in reče: »Točno $75\,\mathrm{mm}$.« Nihče ne ve, ali je imel srečo ali ne, ker o raztrosu ne pove ničesar.

Drugi izmeri petkrat, dobi $74$, $76$, $75$, $73$ in $77\,\mathrm{mm}$ in se ustraši: »Vsakič drugače, nekaj je narobe.« Ni narobe. Tak je raztros njegovega merjenja, okoli $1{,}6\,\mathrm{mm}$. Povprečje $75\,\mathrm{mm}$ je zanesljivejše od vsake posamezne meritve.

Tretji meri desetkrat. Njegove meritve se raztresejo enako kot pri drugem, saj ima isti meter in iste roke. Ko pa izračuna interval zaupanja, je ta skoraj za polovico ožji. Šef zato zaupa tretjemu: ne zato, ker meri bolje, ampak ker ve, koliko svojemu povprečju lahko verjame.

Pri poročilu vsi trije zapišejo le toliko števk, kolikor jih znajo upravičiti. Kdor napiše $75{,}2834\,\mathrm{mm}$, pove le, kako dolg je zaslon kalkulatorja.

## Drugače: Uporaba v stroki

**Validacija metode.** Pred uvedbo nove metode laboratorij izmeri ponovljivost (RSD zaporednih določitev istega vzorca) in pravilnost s t-testom na certificiranem referenčnem materialu, kot v Primeru 3.

**Poročilo o analizi.** Akreditirani laboratoriji (SIST EN ISO/IEC 17025) rezultat podajo z merilno negotovostjo, npr. $(12{,}4 \pm 0{,}3)\,\mathrm{mg/L}$. Ali voda presega mejno vrednost, presodimo glede na ta interval, ne glede na golo povprečje.

**Kontrolne karte.** V proizvodnji cementa ali zdravil vsak dan analizirajo kontrolni vzorec in rezultat vpišejo v Shewhartovo karto z opozorilnima mejama $\bar x \pm 2s$ in ukrepnima $\bar x \pm 3s$. Točka zunaj ukrepne meje pomeni, da se je postopek spremenil.

## Preveri se

? Katera trditev o standardnem odklonu $s$ niza meritev je pravilna?
- Z večanjem števila meritev $s$ vedno pada proti nič.
~ Pada interval zaupanja (zaradi $\sqrt n$ in manjšega $t$), $s$ pa opisuje raztros metode in ostane približno enak.
+ $s$ opisuje raztros posameznih meritev okoli povprečja in je lastnost metode.
- $s$ je povprečje odmikov od aritmetične sredine.
~ Povprečje odmikov je vedno $0$, ker se pozitivni in negativni izničijo; zato odmike kvadriramo.
> Standardni odklon meri, kako daleč so posamezne meritve od povprečja. Z več meritvami ga ocenimo natančneje, ne pa zmanjšamo.

? Trikrat izmeriš maso vzorca: $10{,}1\,\mathrm{g}$; $10{,}3\,\mathrm{g}$; $10{,}2\,\mathrm{g}$. Kolikšen je standardni odklon $s$?
- $0{,}08\,\mathrm{g}$
~ Tako dobiš, če vsoto kvadratov deliš z $n = 3$ namesto z $n - 1 = 2$.
+ $0{,}1\,\mathrm{g}$
- $0{,}2\,\mathrm{g}$
~ To je razpon (največja minus najmanjša meritev), ne standardni odklon.
- $0{,}06\,\mathrm{g}$
~ To je $s/\sqrt n$, standardni odklon povprečja, ne posameznih meritev.
> $\bar x = 10{,}2\,\mathrm{g}$, vsota kvadratov odmikov je $0{,}02\,\mathrm{g^2}$, $s = \sqrt{0{,}02/2}\,\mathrm{g} = 0{,}1\,\mathrm{g}$.

? Sošolka je za štiri titracije dobila $\bar x = 20{,}4625\,\mathrm{mL}$ in $s = 0{,}05\,\mathrm{mL}$ ter zapisala: $\mu = (20{,}4625 \pm 0{,}0796)\,\mathrm{mL}$, s $t = 3{,}182$. Kje je napaka?
- Uporabiti bi morala $t = 1{,}96$.
~ $1{,}96$ velja šele za zelo veliko meritev. Pri štirih meritvah je pravilen $t = 3{,}182$ za $3$ prostostne stopnje.
- Deliti bi morala z $n$, ne s $\sqrt n$.
~ Standardni odklon povprečja je $s/\sqrt n$; deljenje z $n$ bi dalo preozek interval.
+ Račun je pravilen, zapisala pa je preveč števk: pravilno je $(20{,}46 \pm 0{,}08)\,\mathrm{mL}$.
> $3{,}182 \cdot 0{,}05 / \sqrt 4 \approx 0{,}0796\,\mathrm{mL}$, kar zaokrožimo na eno značilno števko, $0{,}08\,\mathrm{mL}$. Povprečje zaokrožimo na isto decimalno mesto: $20{,}46\,\mathrm{mL}$.

? Dva zidarja merita z enakim $s = 2\,\mathrm{mm}$. Prvi izmeri $4$-krat ($t = 3{,}182$), drugi $16$-krat ($t = 2{,}131$). Kako se primerjata njuna 95-% intervala zaupanja?
- Enaka sta, ker imata enak $s$.
~ Enak $s$ pomeni enak raztros meritev; interval je odvisen še od $n$ in $t$.
- Drugi ima natanko dvakrat ožji interval, ker je $\sqrt{16/4} = 2$.
~ Pozabil si, da se zmanjša tudi faktor $t$, zato je razlika večja od dvakratne.
+ Drugi ima približno trikrat ožji interval.
> Prvi: $3{,}182 \cdot 2 / 2 \approx 3{,}2\,\mathrm{mm}$; drugi: $2{,}131 \cdot 2 / 4 \approx 1{,}1\,\mathrm{mm}$. Oži se zaradi $\sqrt n$ in zaradi manjšega $t$.

? Mizar sešteje dolžini dveh letev: $1{,}25\,\mathrm{m}$ (izmerjeno na centimeter) in $0{,}3\,\mathrm{m}$ (ocenjeno na decimeter). Kako zapiše skupno dolžino?
- $1{,}55\,\mathrm{m}$
~ Pri seštevanju šteje najmanjše število decimalnih mest; druga letev je znana le na desetinko metra.
+ $1{,}6\,\mathrm{m}$
- $2\,\mathrm{m}$
~ To je zaokroženo pregrobo; desetinke metra poznamo.
- $1{,}550\,\mathrm{m}$
~ Dodana ničla bi pomenila, da poznamo milimetre, česar ne vemo.
> $1{,}25 + 0{,}3 = 1{,}55$, rezultat zaokrožimo na eno decimalno mesto (kot $0{,}3$): $1{,}6\,\mathrm{m}$.

:::simboli
x | izmerjena vrednost | | mm
\bar{x} | povprečje meritev (aritmetična sredina) | \bar x = \dfrac{\sum x_i}{n} | mm
x_i | i-ta meritev | | mm
i | zaporedna številka meritve | | – | od 1 do n
n | število meritev | | –
s | standardni odklon vzorca | s = \sqrt{\dfrac{\sum (x_i - \bar x)^2}{n-1}} | mm | raztros meritev okoli povprečja
\mu | prava vrednost | \mu = \bar x \pm \dfrac{t \cdot s}{\sqrt{n}} | mm | interval zaupanja, navadno 95 %
t | Studentov faktor | | – | odvisen od n in izbrane verjetnosti
\rho | gostota opeke | \rho = \dfrac{m}{a \cdot b \cdot c} | kg/m^3
m | masa opeke | | kg
a | dolžina opeke | | m
b | širina opeke | | m
c | višina opeke | | m
:::
