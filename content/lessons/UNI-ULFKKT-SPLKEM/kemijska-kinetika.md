---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sredi 19. stoletja je Ludwig Wilhelmy s polarimetrom opazoval, kako se raztopina saharoze v kislini počasi spreminja v zmes glukoze in fruktoze. Kot zasuka polarizirane svetlobe je lahko meril vsakih nekaj minut, ne da bi raztopino motil. Ugotovil je, da je hitrost v vsakem trenutku sorazmerna s količino saharoze, ki je še ostala; to je bil prvi zakon hitrosti, zapisan z enačbo. Nekaj desetletij pozneje je Svante Arrhenius iskal odgovor na drugo vprašanje: zakaj se ista reakcija ob segrevanju za nekaj stopinj pospeši za večkratnik, čeprav se molekule zaletavajo le malo pogosteje?

Obe vprašanji sta danes vsakdan materialoznanstvenika. Proizvajalec lepila ali plastične cevi ne more dvajset let čakati, da vidi, kdaj material razpade. Vzorce zato stara pri $70$ in $90\,^\circ\mathrm{C}$, iz hitrosti razgradnje pa z Arrheniusovo enačbo napove življenjsko dobo pri sobni temperaturi. Tak izračun boš v Primeru 3 naredil sam.

## Razlaga

### 1. Kaj pokaže krivulja koncentracije

Začnimo s sliko, simboli pridejo na koncu. Pri razpadu dušikovega pentoksida, $2\,\mathrm{N_2O_5} \to 4\,\mathrm{NO_2} + \mathrm{O_2}$, pri stalni temperaturi izmerimo:

| $t$ / min | $[\mathrm{N_2O_5}]$ / (mol/L) |
|---|---|
| $0$ | $0{,}0200$ |
| $23$ | $0{,}0100$ |
| $46$ | $0{,}0050$ |
| $69$ | $0{,}0025$ |

Na grafu koncentracije v odvisnosti od časa je to padajoča krivulja, ki je na začetku strma in se nato položi. Iz tabele vidiš dve stvari. Prvič, hitrost ni stalna: v prvih $23$ minutah izgine $0{,}0100\,\mathrm{mol/L}$, v naslednjih le $0{,}0050$. Drugič, koncentracija se razpolovi vedno v enakem času, $23$ minut, ne glede na to, kje začnemo. Obe opazki bomo zapisali natančno.

### 2. Hitrost reakcije

**Definicija.** Za reakcijo $a\mathrm{A} + b\mathrm{B} \to c\mathrm{C} + d\mathrm{D}$ v zaprti posodi s stalno prostornino je **hitrost reakcije**

$$v = -\frac{1}{a}\frac{\mathrm{d}[\mathrm{A}]}{\mathrm{d}t} = \frac{1}{c}\frac{\mathrm{d}[\mathrm{C}]}{\mathrm{d}t}.$$

Deljenje s stehiometrijskim koeficientom zagotovi, da ima reakcija eno hitrost, ne glede na to, katero snov spremljamo. Enota je $\mathrm{mol\,L^{-1}\,s^{-1}}$. **Povprečna hitrost** v intervalu je naklon sekante na krivulji $[\mathrm{A}](t)$ (deljen z $-a$), **trenutna hitrost** pa naklon tangente.

### 3. Zakon hitrosti in red reakcije

**Definicija.** **Zakon hitrosti** je eksperimentalno določena zveza med hitrostjo in koncentracijami, pogosto oblike

$$v = k[\mathrm{A}]^m[\mathrm{B}]^n.$$

Eksponent $m$ je **red glede na A**, $n$ red glede na B, $m + n$ pa **skupni red**. Konstanta $k$ je **konstanta hitrosti**; odvisna je od temperature in katalizatorja, ne pa od koncentracij. Njena enota je odvisna od reda: za 1. red $\mathrm{s^{-1}}$, za 2. red $\mathrm{L\,mol^{-1}\,s^{-1}}$.

Red je lastnost **mehanizma**, ne zapisa enačbe: v splošnem $m \ne a$. Pri razpadu $\mathrm{N_2O_5}$ je koeficient $2$, red pa $1$. Red določimo z meritvami, na primer z **metodo začetnih hitrosti**: spremenimo začetno koncentracijo ene snovi in opazujemo, kolikokrat se spremeni začetna hitrost. Če se ob podvojitvi $[\mathrm{A}]$ hitrost početveri, je $2^m = 4$ in $m = 2$.

:::premisli
Ob podvojitvi koncentracije snovi A se začetna hitrost ne spremeni. Kaj sklepaš o redu glede na A in kaj to pove o vlogi A v najpočasnejšem koraku mehanizma?
---
$2^m = 1$, torej $m = 0$: hitrost od $[\mathrm{A}]$ ni odvisna. A ne nastopa v koraku, ki določa hitrost; porablja se šele v hitrem koraku za njim (ali pa je površina katalizatorja zasičena z A).
:::

### 4. Integrirani zakoni in razpolovni čas

Iz zakona hitrosti z integracijo dobimo, kako se koncentracija spreminja s časom. Spodaj je reakcija $\mathrm{A} \to$ produkti z $v = k[\mathrm{A}]^m$.

**Izpeljava za 1. red.** $-\dfrac{\mathrm{d}[\mathrm{A}]}{\mathrm{d}t} = k[\mathrm{A}]$. Ločimo spremenljivki in integriramo od $0$ do $t$: $\int \dfrac{\mathrm{d}[\mathrm{A}]}{[\mathrm{A}]} = -k\int\mathrm{d}t$, torej $\ln\dfrac{[\mathrm{A}]}{[\mathrm{A}]_0} = -kt$ in

$$[\mathrm{A}] = [\mathrm{A}]_0\,e^{-kt}.$$

**Razpolovni čas** $t_{1/2}$ je čas, v katerem koncentracija pade na polovico. Pri 1. redu iz $\tfrac12 = e^{-kt_{1/2}}$ sledi

$$t_{1/2} = \frac{\ln 2}{k},$$

kar je neodvisno od začetne koncentracije, točno kot pri $\mathrm{N_2O_5}$ v tabeli ($k = \ln 2/23\,\mathrm{min} \approx 0{,}030\,\mathrm{min^{-1}}$).

Pregled treh redov, ki jih srečaš najpogosteje (linearni graf pove red):

- **0. red:** $[\mathrm{A}] = [\mathrm{A}]_0 - kt$; premica $[\mathrm{A}]$ proti $t$; $t_{1/2} = [\mathrm{A}]_0/(2k)$.
- **1. red:** $\ln[\mathrm{A}] = \ln[\mathrm{A}]_0 - kt$; premica $\ln[\mathrm{A}]$ proti $t$; $t_{1/2} = \ln 2/k$.
- **2. red:** $1/[\mathrm{A}] = 1/[\mathrm{A}]_0 + kt$; premica $1/[\mathrm{A}]$ proti $t$; $t_{1/2} = 1/(k[\mathrm{A}]_0)$.

Pri 2. redu je naslednji razpolovni čas dvakrat daljši od prejšnjega, ker se je $[\mathrm{A}]_0$ za naslednji interval razpolovila.

### 5. Mehanizem v enem odstavku

Enačba reakcije pove le izhodne snovi in produkte. **Mehanizem** je zaporedje **elementarnih reakcij**, ki potečejo v enem trku ali razpadu. Za elementarno reakcijo (in le zanjo) je red enak **molekularnosti**: enomolekulska ($\mathrm{A} \to$) je 1. reda, dvomolekulska ($\mathrm{A} + \mathrm{B} \to$) 2. reda. Če je en korak mnogo počasnejši od ostalih, je to **korak, ki določa hitrost**; zakon hitrosti skupne reakcije je tedaj njegov zakon.

### 6. Temperatura in aktivacijska energija

Predstavljaj si energijski diagram: na vodoravni osi potek reakcije, na navpični energija. Izhodne snovi so v dolini, produkti v drugi dolini, vmes je hrib. Vrh hriba je **prehodno stanje** (aktivirani kompleks), višina hriba nad izhodnimi snovmi pa **aktivacijska energija** $E_a$. Razlika med dolinama je reakcijska entalpija $\Delta H$; ta na hitrost ne vpliva.

Po **teoriji trkov** reagirajo le molekule, ki trčijo s primerno usmeritvijo in z energijo vsaj $E_a$. Delež trkov z dovolj energije je sorazmeren z $e^{-E_a/RT}$. Pri $E_a = 50\,\mathrm{kJ/mol}$ je ta delež pri $25\,^\circ\mathrm{C}$ okoli $1{,}7 \cdot 10^{-9}$, pri $35\,^\circ\mathrm{C}$ pa $3{,}3 \cdot 10^{-9}$: dvakrat več, čeprav je trkov le okoli $2\,\%$ več. To je Arrheniusov odgovor.

**Arrheniusova enačba.**

$$k = A\,e^{-E_a/(RT)},$$

kjer je $A$ predeksponentni (frekvenčni) faktor, $R = 8{,}314\,\mathrm{J\,mol^{-1}\,K^{-1}}$ in $T$ absolutna temperatura. Logaritem da premico $\ln k = \ln A - \dfrac{E_a}{R}\cdot\dfrac{1}{T}$ z naklonom $-E_a/R$. Za dve temperaturi:

$$\ln\frac{k_2}{k_1} = \frac{E_a}{R}\left(\frac{1}{T_1} - \frac{1}{T_2}\right).$$

### 7. Kataliza

**Definicija.** **Katalizator** je snov, ki poveča hitrost reakcije, sama pa po reakciji ostane kemijsko nespremenjena. Reakciji odpre drugo pot (drug mehanizem) z nižjo aktivacijsko energijo.

**Izrek.** Katalizator ne spremeni ne $\Delta H$ ne $\Delta G$ reakcije in zato ne ravnotežne konstante $K$; enako pospeši reakcijo v obe smeri, zato se ravnotežje le hitreje vzpostavi.

**Utemeljitev.** $\Delta G^\circ = -RT\ln K$ je razlika med stanji izhodnih snovi in produktov, ki ju katalizator ne spremeni. Ker je $K = k_{\to}/k_{\leftarrow}$ in se obe poti spustita skozi isto nižje prehodno stanje, se obe konstanti povečata za enak faktor.

**Homogena kataliza:** katalizator je v isti fazi kot reaktanti. Primer: jodidni ioni pri razpadu vodikovega peroksida v vodi, kisline pri estrenju.

**Heterogena kataliza:** katalizator je v drugi fazi, navadno trdna snov s plinskimi ali tekočimi reaktanti. Reakcija poteka na površini v korakih: adsorpcija, reakcija adsorbiranih delcev, desorpcija produktov. Primeri: platina, paladij in rodij v avtomobilskem katalizatorju, železo pri sintezi amoniaka, $\mathrm{MnO_2}$ pri razpadu $\mathrm{H_2O_2}$. Pomembna je velika površina (porozni nosilci, nanodelci) in čista površina: svinec ali žveplo katalizator **zastrupita**, ker zasedeta aktivna mesta.

:::premisli
Avtomobilski katalizator v prvih minutah po hladnem zagonu skoraj ne deluje. Zakaj, če katalizator vendar zniža aktivacijsko energijo?
---
Znižana aktivacijska energija je še vedno večja od nič; konstanta hitrosti na površini je še vedno odvisna od temperature po Arrheniusovi enačbi. Pri nizki temperaturi je reakcija na površini prepočasna in plini pridejo skozi skoraj nespremenjeni. Katalizator začne učinkovito delovati šele pri nekaj sto stopinjah.
:::

## Rešeni primeri

### Primer 1 (lažji)

Pri razpadu $2\,\mathrm{N_2O_5} \to 4\,\mathrm{NO_2} + \mathrm{O_2}$ pade koncentracija $\mathrm{N_2O_5}$ v $100\,\mathrm{s}$ z $0{,}0200$ na $0{,}0169\,\mathrm{mol/L}$. Kolikšna je povprečna hitrost reakcije v tem intervalu in s kolikšno povprečno hitrostjo nastajata $\mathrm{NO_2}$ in $\mathrm{O_2}$?

**Podatki:** $[\mathrm{N_2O_5}]_0 = 0{,}0200\,\mathrm{mol/L}$, $[\mathrm{N_2O_5}] = 0{,}0169\,\mathrm{mol/L}$, $\Delta t = 100\,\mathrm{s}$, koeficienti $2$; $4$; $1$
**Iščemo:** $v$, hitrost nastajanja $\mathrm{NO_2}$ in $\mathrm{O_2}$

:::formula
$v = -\dfrac{1}{2}\dfrac{\Delta[\mathrm{N_2O_5}]}{\Delta t} = \dfrac{1}{4}\dfrac{\Delta[\mathrm{NO_2}]}{\Delta t} = \dfrac{\Delta[\mathrm{O_2}]}{\Delta t}$
:::

**Rešitev:**

1. Sprememba koncentracije: $\Delta[\mathrm{N_2O_5}] = 0{,}0169 - 0{,}0200 = -0{,}0031\,\mathrm{mol/L}$.
2. Hitrost reakcije delimo s koeficientom $2$, da je neodvisna od izbrane snovi: $v = 0{,}0031/(2 \cdot 100)\,\mathrm{mol\,L^{-1}\,s^{-1}} = 1{,}55 \cdot 10^{-5}\,\mathrm{mol\,L^{-1}\,s^{-1}}$.
3. $\mathrm{NO_2}$ ima koeficient $4$: nastaja s $4v = 6{,}2 \cdot 10^{-5}\,\mathrm{mol\,L^{-1}\,s^{-1}}$.
4. $\mathrm{O_2}$ ima koeficient $1$: nastaja z $v = 1{,}55 \cdot 10^{-5}\,\mathrm{mol\,L^{-1}\,s^{-1}}$.
5. Odgovor: povprečna hitrost reakcije je $1{,}55 \cdot 10^{-5}\,\mathrm{mol\,L^{-1}\,s^{-1}}$; $\mathrm{NO_2}$ nastaja štirikrat, $\mathrm{O_2}$ enako hitro.

### Primer 2

Za reakcijo $\mathrm{A} + \mathrm{B} \to \mathrm{P}$ so izmerili začetne hitrosti (koncentracije v $\mathrm{mol/L}$, hitrosti v $\mathrm{mol\,L^{-1}\,s^{-1}}$):

| $[\mathrm{A}]_0$ | $[\mathrm{B}]_0$ | $v_0$ |
|---|---|---|
| $0{,}10$ | $0{,}10$ | $2{,}0 \cdot 10^{-4}$ |
| $0{,}20$ | $0{,}10$ | $8{,}0 \cdot 10^{-4}$ |
| $0{,}10$ | $0{,}20$ | $4{,}0 \cdot 10^{-4}$ |

Določi zakon hitrosti, konstanto hitrosti z enoto in začetno hitrost pri $[\mathrm{A}]_0 = 0{,}15\,\mathrm{mol/L}$ in $[\mathrm{B}]_0 = 0{,}25\,\mathrm{mol/L}$.

**Podatki:** tri meritve v tabeli; nova začetna koncentracija $[\mathrm{A}]_0 = 0{,}15\,\mathrm{mol/L}$, $[\mathrm{B}]_0 = 0{,}25\,\mathrm{mol/L}$
**Iščemo:** $m$, $n$, $k$, novo $v_0$

:::formula
$v_0 = k[\mathrm{A}]_0^m[\mathrm{B}]_0^n$; iz razmerja dveh meritev, kjer se spremeni le ena koncentracija: $\dfrac{v_2}{v_1} = 2^m$
:::

**Rešitev:**

1. Meritvi 1 in 2: $[\mathrm{B}]$ je enaka, $[\mathrm{A}]$ se podvoji, hitrost se početveri: $2^m = 4$, $m = 2$.
2. Meritvi 1 in 3: $[\mathrm{A}]$ je enaka, $[\mathrm{B}]$ se podvoji, hitrost se podvoji: $n = 1$. Skupni red je $3$.
3. Iz meritve 1: $k = \dfrac{2{,}0 \cdot 10^{-4}}{0{,}10^2 \cdot 0{,}10}\,\mathrm{L^2\,mol^{-2}\,s^{-1}} = 0{,}20\,\mathrm{L^2\,mol^{-2}\,s^{-1}}$. Enota sledi iz $\mathrm{mol\,L^{-1}\,s^{-1}} = [k]\,(\mathrm{mol/L})^3$.
4. Nova hitrost: $v_0 = 0{,}20 \cdot 0{,}15^2 \cdot 0{,}25\,\mathrm{mol\,L^{-1}\,s^{-1}} \approx 1{,}1 \cdot 10^{-3}\,\mathrm{mol\,L^{-1}\,s^{-1}}$.
5. Odgovor: $v = k[\mathrm{A}]^2[\mathrm{B}]$ s $k = 0{,}20\,\mathrm{L^2\,mol^{-2}\,s^{-1}}$; pri novih koncentracijah je začetna hitrost okoli $1{,}1 \cdot 10^{-3}\,\mathrm{mol\,L^{-1}\,s^{-1}}$.

### Primer 3 (težji)

Lepilo za nosilne konstrukcije se razgrajuje po kinetiki 1. reda. Pri pospešenem staranju je razpolovni čas razgradnje pri $70\,^\circ\mathrm{C}$ $2000\,\mathrm{h}$, pri $90\,^\circ\mathrm{C}$ pa $400\,\mathrm{h}$. Izračunaj aktivacijsko energijo in predeksponentni faktor ter napovej, koliko časa pri $25\,^\circ\mathrm{C}$ traja, da se razgradi $10\,\%$ lepila (to je dogovorjena meja uporabnosti).

**Podatki:** 1. red; $T_1 = 343{,}15\,\mathrm{K}$, $t_{1/2,1} = 2000\,\mathrm{h}$; $T_2 = 363{,}15\,\mathrm{K}$, $t_{1/2,2} = 400\,\mathrm{h}$; $T_0 = 298{,}15\,\mathrm{K}$; meja: ostane $90\,\%$; $R = 8{,}314\,\mathrm{J\,mol^{-1}\,K^{-1}}$
**Iščemo:** $E_a$, $A$, čas $t_{10}$ pri $25\,^\circ\mathrm{C}$

:::formula
$k = \dfrac{\ln 2}{t_{1/2}}$; $\ln\dfrac{k_2}{k_1} = \dfrac{E_a}{R}\left(\dfrac{1}{T_1} - \dfrac{1}{T_2}\right)$; $t_{10} = \dfrac{-\ln 0{,}90}{k_0}$
:::

**Rešitev:**

1. Konstanti hitrosti: $k_1 = 0{,}6931/2000\,\mathrm{h^{-1}} \approx 3{,}47 \cdot 10^{-4}\,\mathrm{h^{-1}}$, $k_2 = 0{,}6931/400\,\mathrm{h^{-1}} \approx 1{,}73 \cdot 10^{-3}\,\mathrm{h^{-1}}$; razmerje $k_2/k_1 = 5$.
2. Razlika recipročnih temperatur: $1/343{,}15 - 1/363{,}15 \approx 1{,}605 \cdot 10^{-4}\,\mathrm{K^{-1}}$.
3. Aktivacijska energija: $E_a = \dfrac{8{,}314 \cdot \ln 5}{1{,}605 \cdot 10^{-4}}\,\mathrm{J/mol} \approx 8{,}34 \cdot 10^4\,\mathrm{J/mol} = 83{,}4\,\mathrm{kJ/mol}$.
4. Predeksponentni faktor iz $k_1$: $A = k_1\,e^{E_a/(RT_1)} \approx 3{,}47 \cdot 10^{-4} \cdot e^{29{,}22}\,\mathrm{h^{-1}} \approx 1{,}7 \cdot 10^9\,\mathrm{h^{-1}}$.
5. Konstanta pri $25\,^\circ\mathrm{C}$ z dvotočkovno obliko od $T_1$: $1/298{,}15 - 1/343{,}15 \approx 4{,}398 \cdot 10^{-4}\,\mathrm{K^{-1}}$, eksponent $\dfrac{83\,373}{8{,}314} \cdot 4{,}398 \cdot 10^{-4} \approx 4{,}41$, zato $k_0 = k_1/e^{4{,}41} \approx 3{,}47 \cdot 10^{-4}/82{,}3\,\mathrm{h^{-1}} \approx 4{,}21 \cdot 10^{-6}\,\mathrm{h^{-1}}$.
6. Razgradnja $10\,\%$ pomeni $[\mathrm{A}]/[\mathrm{A}]_0 = 0{,}90$: $t_{10} = \dfrac{-\ln 0{,}90}{k_0} = \dfrac{0{,}1054}{4{,}21 \cdot 10^{-6}}\,\mathrm{h} \approx 2{,}50 \cdot 10^4\,\mathrm{h}$.
7. V letih: $2{,}50 \cdot 10^4/8760 \approx 2{,}9$ leta.
8. Odgovor: $E_a \approx 83{,}4\,\mathrm{kJ/mol}$, $A \approx 1{,}7 \cdot 10^9\,\mathrm{h^{-1}}$; pri $25\,^\circ\mathrm{C}$ se $10\,\%$ lepila razgradi v okoli $2{,}5 \cdot 10^4\,\mathrm{h}$, torej v slabih treh letih. Napoved velja le, če se mehanizem razgradnje med $25$ in $90\,^\circ\mathrm{C}$ ne spremeni.

### Primer 4 – zdaj ti

Razpad $\mathrm{N_2O_5}$ v raztopini je 1. reda s $k = 5{,}0 \cdot 10^{-4}\,\mathrm{s^{-1}}$. Začetna koncentracija je $0{,}050\,\mathrm{mol/L}$. Kolikšen je razpolovni čas in kolikšna je koncentracija po $30$ minutah?

**Podatki:** 1. red, $k = 5{,}0 \cdot 10^{-4}\,\mathrm{s^{-1}}$, $[\mathrm{A}]_0 = 0{,}050\,\mathrm{mol/L}$, $t = 30\,\mathrm{min}$
**Iščemo:** $t_{1/2}$, $[\mathrm{A}]$ po $30\,\mathrm{min}$

:::formula
$t_{1/2} = \dfrac{\ln 2}{k}$, $[\mathrm{A}] = [\mathrm{A}]_0\,e^{-kt}$
:::

**Rešitev:**

1. $t_{1/2} = 0{,}6931/(5{,}0 \cdot 10^{-4})\,\mathrm{s} \approx 1386\,\mathrm{s} \approx 23\,\mathrm{min}$.
2. Čas pretvori v sekunde, ker je $k$ v $\mathrm{s^{-1}}$: $t = 1800\,\mathrm{s}$, $kt = 0{,}90$.
3. Zdaj ti: izračunaj preostalo koncentracijo in preveri, ali je rezultat smiseln glede na razpolovni čas.

:::premisli
Kolikšna je $[\mathrm{A}]$ po $30$ minutah?
---
$[\mathrm{A}] = 0{,}050 \cdot e^{-0{,}90}\,\mathrm{mol/L} \approx 0{,}050 \cdot 0{,}407\,\mathrm{mol/L} \approx 0{,}020\,\mathrm{mol/L}$. Smiselno: $30$ minut je nekaj več kot en razpolovni čas, zato ostane nekaj manj kot polovica.
:::

## Pogoste napake

- **Red iz stehiometrijskih koeficientov.** »Reakcija je $2\,\mathrm{N_2O_5} \to \ldots$, torej 2. reda.« Red je eksperimentalen in odraža mehanizem; enak koeficientu je le pri elementarni reakciji.
- **Razpolovni čas je pri vseh reakcijah stalen.** Stalen je le pri 1. redu. Pri 2. redu se z vsakim razpolovom podaljša, pri 0. redu skrajša.
- **Temperatura v °C v Arrheniusovi enačbi.** Vstavi absolutno temperaturo v kelvinih; z °C dobiš napačen in pri $0\,^\circ\mathrm{C}$ celo nesmiseln rezultat.
- **Katalizator premakne ravnotežje.** Katalizator ne spremeni $K$; ravnotežje se le hitreje vzpostavi. Izkoristek pri sintezi amoniaka povečajo tlak in temperatura, katalizator pa skrajša čas.
- **Večja $\Delta H$ pomeni počasnejšo reakcijo.** Hitrost določa višina hriba $E_a$, ne razlika med dolinama. Zelo eksotermna reakcija je lahko zelo počasna (gorenje lesa pri sobni temperaturi).

## Povzetek

- Hitrost reakcije: $v = -\frac{1}{a}\frac{\mathrm{d}[\mathrm{A}]}{\mathrm{d}t}$; enota $\mathrm{mol\,L^{-1}\,s^{-1}}$.
- Zakon hitrosti $v = k[\mathrm{A}]^m[\mathrm{B}]^n$; red je eksperimentalen (metoda začetnih hitrosti, linearni grafi).
- 1. red: $[\mathrm{A}] = [\mathrm{A}]_0e^{-kt}$, $t_{1/2} = \ln 2/k$ (neodvisen od $[\mathrm{A}]_0$); 2. red: $1/[\mathrm{A}] = 1/[\mathrm{A}]_0 + kt$, $t_{1/2} = 1/(k[\mathrm{A}]_0)$; 0. red: $t_{1/2} = [\mathrm{A}]_0/(2k)$.
- Arrhenius: $k = Ae^{-E_a/(RT)}$; $\ln(k_2/k_1) = \frac{E_a}{R}(1/T_1 - 1/T_2)$; $T$ v kelvinih.
- Katalizator odpre pot z nižjo $E_a$, ne spremeni $\Delta H$ in $K$; homogena in heterogena kataliza (adsorpcija, reakcija, desorpcija; zastrupitev).

## Za izpit

Znati moraš povedati:

- definicije hitrosti reakcije, zakona hitrosti, reda, konstante hitrosti z enotami in razpolovnega časa;
- izpeljavo integriranega zakona 1. reda in razpolovnega časa ter integrirana zakona 0. in 2. reda;
- razliko med redom in molekularnostjo ter pojem koraka, ki določa hitrost;
- Arrheniusovo enačbo, pomen $E_a$ in $A$ ter dvotočkovno obliko;
- kaj katalizator spremeni in česa ne, z utemeljitvijo, ter razliko med homogeno in heterogeno katalizo.

### Naloga 1

Pri razpadu $2\,\mathrm{NO_2} \to 2\,\mathrm{NO} + \mathrm{O_2}$ pri $600\,\mathrm{K}$ so izmerili $[\mathrm{NO_2}]$: $t = 0$: $0{,}0100\,\mathrm{mol/L}$; $50\,\mathrm{s}$: $0{,}00787$; $100\,\mathrm{s}$: $0{,}00649$; $200\,\mathrm{s}$: $0{,}00481\,\mathrm{mol/L}$. (a) Ugotovi, ali je reakcija 1. ali 2. reda, in določi $k$ z enoto. (b) Izračunaj razpolovni čas pri tej začetni koncentraciji. (c) Katalizator zniža aktivacijsko energijo za $20\,\mathrm{kJ/mol}$ (predeksponentni faktor ostane enak). Kolikokrat se pri $600\,\mathrm{K}$ poveča hitrost in koliko časa s katalizatorjem traja, da koncentracija pade z $0{,}0100$ na $0{,}00481\,\mathrm{mol/L}$?

**Rešitev:**

1. Preizkus 1. reda: $\ln[\mathrm{NO_2}]$ je $-4{,}605$; $-4{,}844$; $-5{,}037$; $-5{,}338$. Nakloni po intervalih: $-0{,}239/50 \approx -0{,}0048$; $-0{,}193/50 \approx -0{,}0039$; $-0{,}301/100 \approx -0{,}0030\,\mathrm{s^{-1}}$. Ni premica, zato reakcija ni 1. reda.
2. Preizkus 2. reda: $1/[\mathrm{NO_2}]$ je $100$; $127$; $154$; $208\,\mathrm{L/mol}$. Prirastki na $50\,\mathrm{s}$: $27$, $27$, $27$ (zadnji interval $54$ na $100\,\mathrm{s}$). Premica, torej 2. red.
3. (a) $k$ je naklon: $k = (208 - 100)/200\,\mathrm{L\,mol^{-1}\,s^{-1}} = 0{,}54\,\mathrm{L\,mol^{-1}\,s^{-1}}$.
4. (b) $t_{1/2} = \dfrac{1}{k[\mathrm{NO_2}]_0} = \dfrac{1}{0{,}54 \cdot 0{,}0100}\,\mathrm{s} \approx 185\,\mathrm{s}$.
5. (c) Pri enakem $A$ je razmerje konstant $\dfrac{k_{kat}}{k} = e^{\Delta E_a/(RT)} = e^{20\,000/(8{,}314 \cdot 600)} = e^{4{,}01} \approx 55$.
6. Isti padec koncentracije pri 2. redu zahteva $\Delta(1/[\mathrm{NO_2}]) = 108\,\mathrm{L/mol}$; čas je obratno sorazmeren s $k$: $200\,\mathrm{s}/55 \approx 3{,}6\,\mathrm{s}$.
7. Odgovor: reakcija je 2. reda, $k = 0{,}54\,\mathrm{L\,mol^{-1}\,s^{-1}}$, $t_{1/2} \approx 185\,\mathrm{s}$; katalizator jo pospeši okoli $55$-krat, padec na $0{,}00481\,\mathrm{mol/L}$ traja le okoli $3{,}6\,\mathrm{s}$.

### Naloga 2

Izpelji integrirani zakon hitrosti za reakcijo 2. reda $\mathrm{A} \to$ produkti in iz njega razpolovni čas. Utemelji, zakaj je razpolovni čas pri 1. redu neodvisen od začetne koncentracije, pri 2. pa ne. Nato natančno utemelji, zakaj katalizator ne spremeni ravnotežne konstante.

**Rešitev:**

1. $-\dfrac{\mathrm{d}[\mathrm{A}]}{\mathrm{d}t} = k[\mathrm{A}]^2$. Ločimo spremenljivki: $-\dfrac{\mathrm{d}[\mathrm{A}]}{[\mathrm{A}]^2} = k\,\mathrm{d}t$.
2. Integriramo od $0$ do $t$: $\dfrac{1}{[\mathrm{A}]} - \dfrac{1}{[\mathrm{A}]_0} = kt$.
3. Pri $t = t_{1/2}$ je $[\mathrm{A}] = [\mathrm{A}]_0/2$: $\dfrac{2}{[\mathrm{A}]_0} - \dfrac{1}{[\mathrm{A}]_0} = kt_{1/2}$, torej $t_{1/2} = \dfrac{1}{k[\mathrm{A}]_0}$.
4. Pri 1. redu je relativna hitrost $-\frac{1}{[\mathrm{A}]}\frac{\mathrm{d}[\mathrm{A}]}{\mathrm{d}t} = k$ stalna: v vsakem enakem intervalu izgine enak delež. Pri 2. redu je relativna hitrost $k[\mathrm{A}]$ in z manjšanjem koncentracije pada, zato razpolov traja vse dlje.
5. Katalizator: ravnotežna konstanta je določena z $\Delta G^\circ = -RT\ln K$, ki je razlika prostih entalpij produktov in izhodnih snovi; katalizator ne spremeni nobenega od teh stanj. Kinetično: v ravnotežju je $k_{\to}[\ldots] = k_{\leftarrow}[\ldots]$, $K = k_{\to}/k_{\leftarrow}$; nova pot ima isto prehodno stanje za obe smeri, zato se $E_a$ v obe smeri zniža za enak $\Delta E_a$ in obe konstanti se povečata za isti faktor $e^{\Delta E_a/(RT)}$, razmerje ostane enako.

### Naloga 3

Predlagani mehanizem razpada $\mathrm{H_2O_2}$ z jodidom je: (1) $\mathrm{H_2O_2} + \mathrm{I^-} \to \mathrm{H_2O} + \mathrm{IO^-}$ (počasi); (2) $\mathrm{H_2O_2} + \mathrm{IO^-} \to \mathrm{H_2O} + \mathrm{O_2} + \mathrm{I^-}$ (hitro). (a) Zapiši skupno reakcijo, določi katalizator in vmesni produkt ter molekularnost korakov. (b) Zapiši zakon hitrosti, ki ga napove mehanizem. (c) V poskusu je $k_1 = 0{,}0115\,\mathrm{L\,mol^{-1}\,s^{-1}}$, $[\mathrm{I^-}] = 0{,}10\,\mathrm{mol/L}$ in se med reakcijo ne spreminja. Pokaži, da je reakcija tedaj navidezno 1. reda, in izračunaj razpolovni čas $\mathrm{H_2O_2}$.

**Rešitev:**

1. (a) Seštevek: $2\,\mathrm{H_2O_2} \to 2\,\mathrm{H_2O} + \mathrm{O_2}$. $\mathrm{I^-}$ se v koraku 1 porabi in v koraku 2 vrne: katalizator (homogen). $\mathrm{IO^-}$ nastane in se porabi: vmesni produkt. Oba koraka sta dvomolekulska.
2. (b) Počasni korak določa hitrost, za elementarni korak je red enak molekularnosti: $v = k_1[\mathrm{H_2O_2}][\mathrm{I^-}]$, 1. red glede na vsako snov, skupno 2. red.
3. (c) Ker je $[\mathrm{I^-}]$ stalna, je $v = k'[\mathrm{H_2O_2}]$ z $k' = k_1[\mathrm{I^-}] = 0{,}0115 \cdot 0{,}10\,\mathrm{s^{-1}} = 1{,}15 \cdot 10^{-3}\,\mathrm{s^{-1}}$: navidezno 1. red.
4. $t_{1/2} = \ln 2/k' = 0{,}6931/(1{,}15 \cdot 10^{-3})\,\mathrm{s} \approx 603\,\mathrm{s} \approx 10\,\mathrm{min}$.
5. Odgovor: jodid je katalizator, $\mathrm{IO^-}$ vmesni produkt; $v = k_1[\mathrm{H_2O_2}][\mathrm{I^-}]$; pri stalnem jodidu je reakcija navidezno 1. reda z razpolovnim časom okoli $10\,\mathrm{min}$. Podvojitev jodida bi ga razpolovila.

## Drugače: Na sliki

Energijski diagram iste reakcije brez katalizatorja in z njim:

```
 E
 |       ___        brez kat.
 |      /   \
 |     / ___ \      s kat.
 |    / /   \ \
 |___/_/     \_\
 |  izh.       \
 |  snovi       \____
 |             produkti
 +-------------------> potek
```

Višji hrib je pot brez katalizatorja, nižji pot s katalizatorjem. Obe poti se začneta in končata v istih dolinah: $\Delta H$ je enaka, razlika je le v višini hriba $E_a$.

## Drugače: Z analogijo

**Hrib med dolinama.** Kroglice (molekule) se v dolini naključno premetavajo; čez prelaz pride le tista, ki jo trk dovolj močno sune. Višji prelaz pomeni, da se to zgodi redko; segrevanje pomeni močnejše in pogostejše sunke, zato se delež uspešnih kroglic poveča mnogo bolj kot število sunkov. Katalizator je predor skozi hrib: dolini ostaneta na isti višini, prehod je le nižji.

**Pokovka in 1. red.** V loncu vsako zrno poči neodvisno od drugih, z enako verjetnostjo v vsaki sekundi. Zato poči vsako sekundo enak **delež** še celih zrn, kar je ravno 1. red; razpolovni čas je čas, v katerem poči polovica preostalih zrn, ne glede na to, koliko jih je bilo.

**Plesišče in 2. red.** Če mora za »reakcijo« plesalec najti partnerja, je srečanj sorazmerno s kvadratom števila samskih plesalcev. Ko jih ostane polovica, se srečujejo štirikrat redkeje, zato se vsak naslednji razpolov vleče dlje.

## Drugače: Uporaba v stroki

**Pospešeno staranje materialov.** Proizvajalci polimerov, lepil, kablov in zdravil vzorce hranijo pri povišani temperaturi in z Arrheniusovo enačbo napovejo življenjsko dobo pri uporabi, kot v Primeru 3. Pri zdravilih iz tega sledi rok uporabnosti. Pogoj je, da se mehanizem razgradnje v temperaturnem območju ne spremeni.

**Avtomobilski katalizator.** Tristezni katalizator iz Pt, Pd in Rh na keramičnem satovju z veliko površino oksidira $\mathrm{CO}$ in ogljikovodike ter reducira $\mathrm{NO_x}$. Zato je bencin brez svinca nujen: svinec katalizator zastrupi.

**Strjevanje cementa in epoksidov.** Hidratacija cementa in zamreževanje epoksidnih smol sta kemijski reakciji, katerih hitrost raste s temperaturo. Gradbeniki pozimi beton ogrevajo ali dodajajo pospeševalce, poleti pa ga hladijo, da se ne strdi prehitro in ne razpoka.

**Sinteza amoniaka.** Železov katalizator s promotorji omogoči, da reakcija $\mathrm{N_2} + 3\,\mathrm{H_2} \to 2\,\mathrm{NH_3}$ v industriji poteka dovolj hitro pri okoli $400$ do $500\,^\circ\mathrm{C}$. Brez katalizatorja bi pri tej temperaturi ravnotežje dosegli šele po zelo dolgem času.

## Drugače: Bolj natančno

**Teorija prehodnega stanja.** Eyringova enačba $k = \dfrac{k_\mathrm{B}T}{h}e^{-\Delta G^\ddagger/(RT)}$ predeksponentni faktor razloži z entropijo aktivacije: urejeno prehodno stanje (dve molekuli se morata natančno usmeriti) zmanjša $A$. Arrheniusova enačba je dober približek, kadar je $\Delta H^\ddagger$ veliko večja od $RT$.

**Približek stacionarnega stanja.** Pri mehanizmih brez enega izrazito počasnega koraka predpostavimo, da je koncentracija vmesnega produkta po kratkem začetku stalna, $\mathrm{d}[\mathrm{I}]/\mathrm{d}t \approx 0$. Iz tega dobimo zakone hitrosti, kot je Michaelis-Mentenova enačba pri encimih.

## Preveri se

? Katera sprememba NE spremeni konstante hitrosti $k$ dane reakcije?
- Dvig temperature za $10\,^\circ\mathrm{C}$.
~ Po Arrheniusovi enačbi je $k$ močno odvisna od temperature.
- Dodatek katalizatorja.
~ Katalizator odpre pot z nižjo $E_a$ in s tem poveča $k$.
+ Podvojitev začetne koncentracije reaktanta.
- Zamenjava homogenega katalizatorja s heterogenim.
~ Drug katalizator pomeni drug mehanizem in drugo $E_a$, torej drugo $k$.
> Konstanta hitrosti je odvisna od temperature in mehanizma (katalizatorja), ne od koncentracij. Večja koncentracija poveča hitrost $v$, $k$ pa ostane enaka.

? Reakcija 1. reda ima razpolovni čas $12\,\mathrm{min}$. Začetna koncentracija je $0{,}80\,\mathrm{mol/L}$. Kolikšna je koncentracija po $36\,\mathrm{min}$?
- $0{,}27\,\mathrm{mol/L}$
~ Koncentracijo si delil s $3$ (številom razpolovnih časov), namesto da bi jo trikrat razpolovil.
+ $0{,}10\,\mathrm{mol/L}$
- $0{,}20\,\mathrm{mol/L}$
~ To je koncentracija po dveh razpolovnih časih ($24\,\mathrm{min}$).
> $36\,\mathrm{min}$ so trije razpolovni časi: $0{,}80 \to 0{,}40 \to 0{,}20 \to 0{,}10\,\mathrm{mol/L}$; skupno $0{,}80/2^3$.

? Zakaj se hitrost mnogih reakcij ob dvigu temperature z $25$ na $35\,^\circ\mathrm{C}$ približno podvoji?
- Ker se število trkov med molekulami podvoji.
~ Število trkov se zaradi večje hitrosti molekul poveča le za okoli $2\,\%$.
+ Ker se delež trkov z energijo vsaj $E_a$ (sorazmeren z $e^{-E_a/RT}$) pri $E_a \approx 50\,\mathrm{kJ/mol}$ približno podvoji.
- Ker se aktivacijska energija s temperaturo zmanjša.
~ $E_a$ je lastnost mehanizma in je v ozkem temperaturnem območju stalna; spremeni se delež molekul, ki jo presežejo.
> Pri $E_a = 50\,\mathrm{kJ/mol}$ je $e^{-E_a/RT}$ pri $308\,\mathrm{K}$ okoli $1{,}9$-krat večji kot pri $298\,\mathrm{K}$, kar skoraj v celoti razloži pospešitev.

? Študent določa red reakcije $2\,\mathrm{NO} + \mathrm{O_2} \to 2\,\mathrm{NO_2}$: »1. Koeficient pri NO je $2$. 2. Torej je reakcija 2. reda glede na NO. 3. Koeficient pri $\mathrm{O_2}$ je $1$, torej 1. red. 4. Zakon hitrosti: $v = k[\mathrm{NO}]^2[\mathrm{O_2}]$.« Kateri korak je napačen kot sklepanje?
- Korak 1.
~ Koeficient je res $2$; napaka je v sklepu, ki ga študent iz tega naredi.
+ Korak 2: red se ne določi iz koeficientov, ampak iz meritev.
- Korak 4.
~ Korak 4 je le posledica prejšnjih; končni zakon se tu po naključju ujema z meritvami, a sklepanje ni veljavno.
> Red je eksperimentalna lastnost. Pri tej reakciji meritve res dajo $v = k[\mathrm{NO}]^2[\mathrm{O_2}]$, a to ne sledi iz koeficientov (pri $2\,\mathrm{N_2O_5}$ je red $1$). Korak 3 ima isto napako kot korak 2.

? Mleko v hladilniku ($4\,^\circ\mathrm{C}$) zdrži več dni dlje kot na mizi ($22\,^\circ\mathrm{C}$). Kaj je najboljša razlaga?
- Mraz bakterije ubije.
~ Pri $4\,^\circ\mathrm{C}$ večina bakterij preživi; le njihove reakcije potekajo počasneje.
+ Encimske reakcije, s katerimi bakterije rastejo in kisajo mleko, imajo aktivacijsko energijo, zato so pri nižji temperaturi mnogo počasnejše.
- Pri nižji temperaturi se ravnotežje kisanja premakne nazaj.
~ Kisanje je skoraj nepovratno; mraz ne premakne ravnotežja, ampak upočasni hitrost.
> Po Arrheniusovi enačbi se konstante hitrosti z nižjo temperaturo eksponentno zmanjšajo. Za $18\,^\circ\mathrm{C}$ nižja temperatura pri tipičnih $E_a$ pomeni nekajkrat počasnejše reakcije.

:::simboli
v | hitrost reakcije | v = -\frac{1}{a}\frac{\mathrm{d}[\mathrm{A}]}{\mathrm{d}t} | mol\,L^{-1}\,s^{-1}
v_0 | začetna hitrost reakcije | | mol\,L^{-1}\,s^{-1}
a, b, c, d | stehiometrijski koeficienti | | –
\mathrm{A} | reaktant A | | | $[\mathrm{A}]$ koncentracija v mol/L, $[\mathrm{A}]_0$ začetna
\mathrm{B} | reaktant B | | | $[\mathrm{B}]$ koncentracija v mol/L
\mathrm{C} | produkt C | | | $[\mathrm{C}]$ koncentracija v mol/L
e | osnova naravnega logaritma | | | $e \approx 2{,}718$
k | konstanta hitrosti | k = A\,e^{-E_a/(RT)} | | enota odvisna od reda
k_1, k_2 | konstanti hitrosti pri $T_1$ in $T_2$ | | h^{-1} | v Nalogi 3: $k_1$ počasnega koraka
k_0 | konstanta hitrosti pri $25\,^\circ\mathrm{C}$ | | h^{-1}
m, n | reda glede na A in B | | –
t | čas | | s
\Delta t | časovni interval | | s
t_{1/2} | razpolovni čas | t_{1/2} = \frac{\ln 2}{k} | s | za 1. red
t_{10} | čas do razgradnje $10\,\%$ | t_{10} = \frac{-\ln 0{,}90}{k_0} | h
A | predeksponentni (frekvenčni) faktor | | | enota kot $k$
E_a | aktivacijska energija | | J/mol
R | splošna plinska konstanta | | J\,mol^{-1}\,K^{-1} | $8{,}314$
T | absolutna temperatura | | K
T_0, T_1, T_2 | temperature pri izračunu | | K
v_2, v_1 | začetni hitrosti dveh meritev | | mol\,L^{-1}\,s^{-1}
:::
