---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Medicinska sestra mora z vso silo pritiskati na bat brizge, ko skozi tanko iglo vbrizga gosto zdravilo. Zdravnik pa s stetoskopom na prsih slabokrvnega bolnika sliši šum, ki ga pri zdravem človeku ni: redkejša kri v aorti teče hitreje in se vrtinči. V prvem prizoru se boriš z notranjim trenjem, v drugem nastajajo vrtinci. Za obema stoji isto vprašanje: koliko tekočino zavira trenje in koliko jo nosi njena vztrajnost?

Bernoullijeva enačba trenja ne pozna. V ceveh, črpalkah, reaktorjih in žilah pa so od njega odvisne tlačne izgube, mešanje snovi in prenos toplote. Za vsak tok zato najprej potrebuješ dve številki: kako »gosta« je tekočina (**viskoznost**) in ali teče urejeno ali vrtinčasto (**Reynoldsovo število**).

## Razlaga

### Slika 1: plasti med ploščama

**Viskoznost kot notranje trenje.** Vzemi tanko plast tekočine med dvema vzporednima ploščama. Spodnja plošča miruje, zgornjo vlečemo s stalno hitrostjo. Tekočina se drži obeh plošč: ob spodnji miruje, ob zgornji se giblje z njo. Vmes plasti tekočine drsijo druga ob drugi, vsaka nekoliko hitreje od tiste pod njo.

Diagram v besedah (prerez, hitrost plasti je dolžina puščice):

```
zgornja plošča  ==========>  v
                --------->
                ------>
                --->
spodnja plošča  ==========   0
```

Za vlečenje potrebujemo silo. Sila na enoto ploskve je **strižna napetost** $\tau$ (v Pa). Spremembi hitrosti s prečno razdaljo $\dfrac{\mathrm{d}v}{\mathrm{d}y}$ rečemo **strižna hitrost** (v $\mathrm{s^{-1}}$).

**Newtonov zakon viskoznosti.** Naj tekočina teče v vzporednih plasteh, ki se med seboj ne mešajo (laminarno), s hitrostjo $v(y)$, kjer je $y$ razdalja pravokotno na smer toka. Tekočina je **newtonska**, če je strižna napetost med plastmi sorazmerna s strižno hitrostjo, s koeficientom, ki je pri dani temperaturi in tlaku od strižne hitrosti neodvisen:

$$\tau = \mu \frac{\mathrm{d}v}{\mathrm{d}y}$$

Sorazmernostni koeficient $\mu$ je **dinamična viskoznost**. Enota je $\mathrm{Pa \cdot s}$. Starejša enota je centipoise: $1\,\mathrm{cP} = 1\,\mathrm{mPa \cdot s} = 10^{-3}\,\mathrm{Pa \cdot s}$. Newtonske so voda, zrak in večina preprostih tekočin.

**Linearni profil med ploščama (Couettov tok).** Naj bo med vzporednima ploščama na razdalji $\delta$ newtonska tekočina, tok stacionaren in laminaren, brez tlačnega padca v smeri toka. Potem je profil hitrosti linearen in za vlečenje zgornje plošče s ploščino $S$ potrebujemo silo $F = \mu S \dfrac{v_0}{\delta}$. *Izpeljava:* plast med $y$ in $y + \mathrm{d}y$ se giblje enakomerno, zato sta strižni sili na njeni spodnji in zgornji ploskvi nasprotno enaki; $\tau$ je torej na vseh višinah enaka. Iz $\tau = \mu \dfrac{\mathrm{d}v}{\mathrm{d}y}$ sledi $\dfrac{\mathrm{d}v}{\mathrm{d}y} = \dfrac{\tau}{\mu}$ = konst., z robnima pogojema $v(0) = 0$, $v(\delta) = v_0$ pa $v(y) = v_0\dfrac{y}{\delta}$, $\tau = \mu\dfrac{v_0}{\delta}$ in $F = \tau S$. Na tem temelji rotacijski viskozimeter.

### Tabela: kako »gosta« je tekočina

**Kinematična viskoznost.** V računih tokov pogosto nastopa razmerje viskoznosti in gostote:

$$\nu = \frac{\mu}{\rho}$$

To je **kinematična viskoznost**, enota $\mathrm{m^2/s}$. Pove, kako hitro se »razširi« motnja hitrosti v tekočini.

| Snov (20 °C) | $\mu$ [Pa·s] | $\nu$ [m²/s] |
|---|---|---|
| zrak | $1{,}8 \cdot 10^{-5}$ | $1{,}5 \cdot 10^{-5}$ |
| voda | $1{,}0 \cdot 10^{-3}$ | $1{,}0 \cdot 10^{-6}$ |
| olivno olje | $\approx 0{,}08$ | $\approx 8{,}8 \cdot 10^{-5}$ |
| glicerol | $1{,}41$ | $1{,}1 \cdot 10^{-3}$ |

Zrak ima okoli 55-krat manjšo dinamično viskoznost kot voda, a 15-krat večjo kinematično. Razlog je zelo majhna gostota zraka.

**Viskoznost in temperatura.** Trenje med plastmi ima pri kapljevinah in plinih različen izvor. V kapljevini se molekule tesno držijo sosed in se morajo od njih odtrgati, da plast zdrsne. V plinu so molekule daleč narazen, prosto letijo med plastmi in s trki prenašajo gibalno količino iz hitrejše plasti v počasnejšo.

:::premisli
Motorno olje in zrak segrejemo z $20\,^\circ\mathrm{C}$ na $80\,^\circ\mathrm{C}$. Kako se spremeni viskoznost vsake snovi? Napovej, preden pogledaš.
---
Olju viskoznost močno pade (večkrat), ker se molekule kapljevine lažje premikajo druga mimo druge. Zraku viskoznost naraste (za okoli $15\,\%$), ker je pri plinu viskoznost posledica prenosa gibalne količine med trki, ta pa s hitrostjo molekul raste.
:::

### Slika 2: nit barvila v cevi

```
majhna hitrost:  ═══════════════════════   nit ostane ravna
velika hitrost:  ═════~~≈≈≋≋▒▒▒▒▒▒▒▒▒▒▒▒   nit se raztrga, barvilo zapolni presek
```

**Reynoldsov poskus.** Osborne Reynolds je v stekleno cev z vodo vbrizgal tanko nit barvila. Pri majhni hitrosti je nit ostala ravna in ostra do konca cevi. Tak tok je **laminaren**: plasti tečejo vzporedno, brez mešanja. Pri veliki hitrosti se je nit po kratki razdalji raztrgala in barvilo je obarvalo ves presek. Tak tok je **turbulenten**: hitrost se na vsakem mestu nenehno spreminja po smeri in velikosti, nastajajo vrtinci.

**Reynoldsovo število.** Reynolds je ugotovil, da o vrsti toka ne odloča hitrost sama, ampak kombinacija štirih količin:

$$\mathrm{Re} = \frac{\rho\, v\, D}{\mu} = \frac{v\, D}{\nu}$$

Tu je $v$ povprečna hitrost (prostorninski pretok, deljen s presekom), $D$ notranji premer cevi, $\rho$ in $\mu$ pa gostota in dinamična viskoznost tekočine pri temperaturi toka. Re je **brezdimenzijsko**: $\dfrac{\mathrm{kg\,m^{-3}} \cdot \mathrm{m\,s^{-1}} \cdot \mathrm{m}}{\mathrm{kg\,m^{-1}\,s^{-1}}} = 1$. Pomeni razmerje med vztrajnostnimi silami (ki motnje ojačajo) in viskoznimi silami (ki jih dušijo): vztrajnostna napetost je reda $\rho v^2$, viskozna reda $\mu v/D$, njuno razmerje je $\dfrac{\rho v^2}{\mu v/D} = \dfrac{\rho v D}{\mu}$.

Za tok v ravni okrogli cevi Re razdeli številsko premico na tri območja:

```
   laminarno       prehodno (nestabilno)      turbulentno
0 ─────────────── 2100 ─────────────── 4000 ──────────────► Re
```

- $\mathrm{Re} < 2100$: laminarni tok,
- $2100 < \mathrm{Re} < 4000$: prehodno območje (tok je nestabilen),
- $\mathrm{Re} > 4000$: turbulentni tok.

Meja $2100$ je dogovorna; nekateri viri navajajo $2300$. V zelo gladkih cevih brez motenj se laminarni tok lahko ohrani tudi do precej večjih Re.

### Slika 3: profil hitrosti v preseku

```
  laminarno         turbulentno
 |->               |------>
 |------>          |-------->
 |---------->      |-------->
 |------>          |-------->
 |->               |------>
```

**Profil hitrosti.** Ob steni je hitrost vedno nič. V laminarnem toku je profil parabola, največja hitrost na osi je dvakrat večja od povprečne. V turbulentnem toku vrtinci premešajo tekočino, zato je profil sredi cevi skoraj raven, povprečna hitrost je približno $0{,}8$ največje.

**Hagen-Poiseuillov zakon.** Naj nestisljiva newtonska tekočina teče stacionarno, laminarno in polno razvito po ravni okrogli cevi s polmerom $R$, ob steni naj ne drsi. Potem za profil hitrosti, povprečno hitrost $\bar v$ in tlačni padec $\Delta p$ na dolžini $L$ (premer $D = 2R$) velja
$$v(r) = v_\mathrm{max}\left(1 - \frac{r^2}{R^2}\right),\quad \bar v = \frac{v_\mathrm{max}}{2},$$
$$\Delta p = \frac{32\, \mu\, L\, \bar v}{D^2}.$$
*Izpeljava:* na koaksialni valj tekočine s polmerom $r$ in dolžino $L$ deluje tlačna sila $\Delta p\, \pi r^2$, po plašču pa zavira strižna sila $\tau\, 2\pi r L$. Valj se ne pospešuje, zato sta enaki: $\tau = \dfrac{\Delta p\, r}{2L}$. Z $\tau = -\mu \dfrac{\mathrm{d}v}{\mathrm{d}r}$ (hitrost proti steni pada) dobimo $\dfrac{\mathrm{d}v}{\mathrm{d}r} = -\dfrac{\Delta p\, r}{2\mu L}$, z integracijo in pogojem $v(R) = 0$ pa $v(r) = \dfrac{\Delta p}{4\mu L}(R^2 - r^2)$, torej $v_\mathrm{max} = \dfrac{\Delta p R^2}{4\mu L}$. Pretok je $Q = \int_0^R v\, 2\pi r\, \mathrm{d}r = \dfrac{\pi \Delta p R^4}{8 \mu L}$, zato $\bar v = \dfrac{Q}{\pi R^2} = \dfrac{\Delta p R^2}{8\mu L} = \dfrac{v_\mathrm{max}}{2}$. Z $R = D/2$ izrazimo $\Delta p = \dfrac{8\mu L \bar v}{R^2} = \dfrac{32\mu L \bar v}{D^2}$. Pri turbulentnem toku zakon ne velja.

:::premisli
Skozi cev teče stalen prostorninski pretok. Cev zamenjamo s cevjo z dvakrat večjim premerom. Ali se Re poveča, zmanjša ali ostane enak?
---
Zmanjša se na polovico. Presek je štirikrat večji, zato je hitrost štirikrat manjša. Premer je v števcu dvakrat večji. Skupaj: $\mathrm{Re}$ se spremeni za faktor $\frac{2}{4} = \frac{1}{2}$. Pri stalnem pretoku je $\mathrm{Re} = \dfrac{4 \rho Q}{\pi \mu D}$.
:::

## Rešeni primeri

### Primer 1 (lažji): voda v cevi

Voda pri $20\,^\circ\mathrm{C}$ teče s povprečno hitrostjo $0{,}8\,\mathrm{m/s}$ po cevi z notranjim premerom $2{,}5\,\mathrm{cm}$. Gostota vode je $998\,\mathrm{kg/m^3}$, viskoznost $1{,}0\,\mathrm{mPa \cdot s}$. Ali je tok laminaren ali turbulenten?

**Podatki:** $v = 0{,}8\,\mathrm{m/s}$, $D = 2{,}5\,\mathrm{cm}$, $\rho = 998\,\mathrm{kg/m^3}$, $\mu = 1{,}0\,\mathrm{mPa \cdot s}$
**Iščemo:** $\mathrm{Re}$ in vrsto toka

:::formula
$\mathrm{Re} = \dfrac{\rho\, v\, D}{\mu}$
:::

**Rešitev:**

1. Pretvorimo v osnovne enote SI: $D = 0{,}025\,\mathrm{m}$, $\mu = 1{,}0 \cdot 10^{-3}\,\mathrm{Pa \cdot s}$.
2. Vstavimo: $\mathrm{Re} = \dfrac{998 \cdot 0{,}8 \cdot 0{,}025}{0{,}001} = 19960$.
3. Primerjamo z mejo: $19960 > 4000$, torej smo daleč v turbulentnem območju.
4. Odgovor: $\mathrm{Re} \approx 2{,}0 \cdot 10^4$, tok je turbulenten.

### Primer 2: olje, dan je pretok

Olje ($\rho = 880\,\mathrm{kg/m^3}$, $\mu = 0{,}10\,\mathrm{Pa \cdot s}$) črpamo s prostorninskim pretokom $2{,}0\,\mathrm{L/s}$ po cevi s premerom $5{,}0\,\mathrm{cm}$. Kakšen je tok?

**Podatki:** $\rho = 880\,\mathrm{kg/m^3}$, $\mu = 0{,}10\,\mathrm{Pa \cdot s}$, $Q = 2{,}0\,\mathrm{L/s}$, $D = 5{,}0\,\mathrm{cm}$
**Iščemo:** povprečno hitrost $v$, $\mathrm{Re}$ in vrsto toka

:::formula
$v = \dfrac{Q}{A}$, $A = \dfrac{\pi D^2}{4}$, nato $\mathrm{Re} = \dfrac{\rho\, v\, D}{\mu}$
:::

**Rešitev:**

1. Enote: $Q = 0{,}0020\,\mathrm{m^3/s}$, $D = 0{,}050\,\mathrm{m}$.
2. Presek: $A = \dfrac{\pi \cdot (0{,}050\,\mathrm{m})^2}{4} \approx 1{,}96 \cdot 10^{-3}\,\mathrm{m^2}$.
3. Hitrost iz kontinuitetne enačbe: $v = \dfrac{0{,}0020\,\mathrm{m^3/s}}{1{,}96 \cdot 10^{-3}\,\mathrm{m^2}} \approx 1{,}02\,\mathrm{m/s}$.
4. $\mathrm{Re} = \dfrac{880 \cdot 1{,}02 \cdot 0{,}050}{0{,}10} \approx 448$.
5. $448 < 2100$, zato je tok laminaren, čeprav je hitrost večja kot pri vodi v primeru 1. Odloča velika viskoznost.
6. Odgovor: $\mathrm{Re} \approx 450$, olje teče laminarno.

### Primer 3 (težji): največji pretok za laminarni tok

V laboratoriju želimo z vodo ($\rho = 998\,\mathrm{kg/m^3}$, $\mu = 1{,}0 \cdot 10^{-3}\,\mathrm{Pa \cdot s}$) v vodoravni cevki s premerom $1{,}0\,\mathrm{cm}$ in dolžino $2{,}0\,\mathrm{m}$ prikazati laminarni tok. Vodo dovajamo iz posode s stalno gladino. (a) Kolikšen je največji prostorninski pretok v litrih na minuto, pri katerem je $\mathrm{Re} \le 2100$? (b) Kolikšen je pri tem pretoku tlačni padec zaradi trenja in za koliko mora biti gladina v posodi višja od iztoka, da ga premaga (vstopne izgube in kinetično energijo curka zanemari)? (c) Kolikšna je hitrost v osi cevke?

**Podatki:** $\rho = 998\,\mathrm{kg/m^3}$, $\mu = 1{,}0 \cdot 10^{-3}\,\mathrm{Pa \cdot s}$, $D = 1{,}0\,\mathrm{cm}$, $L = 2{,}0\,\mathrm{m}$, $\mathrm{Re}_\mathrm{krit} = 2100$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** največji pretok $Q_\mathrm{max}$ v $\mathrm{L/min}$, tlačni padec $\Delta p$, višino gladine $h$, hitrost $v_\mathrm{max}$

:::formula
$v = \dfrac{\mathrm{Re}\, \mu}{\rho\, D}$, $Q = v \cdot \dfrac{\pi D^2}{4}$, $\Delta p = \dfrac{32\,\mu\,L\,\bar v}{D^2}$, $\Delta p = \rho g h$
:::

**Rešitev:**

1. Obrnemo definicijo Re, ker zdaj poznamo Re in iščemo hitrost: $v = \dfrac{\mathrm{Re}\,\mu}{\rho\,D}$.
2. $v = \dfrac{2100 \cdot 0{,}001}{998 \cdot 0{,}010} \approx 0{,}210\,\mathrm{m/s}$.
3. Presek: $A = \dfrac{\pi \cdot (0{,}010\,\mathrm{m})^2}{4} \approx 7{,}85 \cdot 10^{-5}\,\mathrm{m^2}$.
4. $Q = v A \approx 0{,}210\,\mathrm{m/s} \cdot 7{,}85 \cdot 10^{-5}\,\mathrm{m^2} \approx 1{,}65 \cdot 10^{-5}\,\mathrm{m^3/s}$.
5. Pretvorimo: $1{,}65 \cdot 10^{-5}\,\mathrm{m^3/s} = 0{,}0165\,\mathrm{L/s}$, pomnožimo s $60\,\mathrm{s/min}$ in dobimo $\approx 0{,}99\,\mathrm{L/min}$.
6. Tok je laminaren, zato smemo uporabiti Hagen-Poiseuillov zakon: $\Delta p = \dfrac{32 \cdot 0{,}001 \cdot 2{,}0 \cdot 0{,}2104}{0{,}010^2}\,\mathrm{Pa} \approx 135\,\mathrm{Pa}$.
7. Ta padec mora dati hidrostatični tlak stolpca vode: $h = \dfrac{\Delta p}{\rho g} = \dfrac{134{,}7}{998 \cdot 9{,}81}\,\mathrm{m} \approx 0{,}0138\,\mathrm{m}$.
8. Hitrost v osi je pri laminarnem toku dvakratnik povprečne: $v_\mathrm{max} = 2 \cdot 0{,}2104\,\mathrm{m/s} \approx 0{,}421\,\mathrm{m/s}$.
9. Odgovor: laminarni tok dobimo le pri pretoku pod približno $1\,\mathrm{L/min}$; tlačni padec je tedaj okoli $135\,\mathrm{Pa}$, za kar zadošča gladina le $1{,}4\,\mathrm{cm}$ nad iztokom, voda v osi pa teče z $0{,}42\,\mathrm{m/s}$. (Zanemarjena kinetična energija curka, pri paraboličnem profilu $\rho \bar v^2$, bi dodala še okoli $44\,\mathrm{Pa}$ oziroma dobre $4\,\mathrm{mm}$ višine.) Zato voda v ceveh skoraj vedno teče turbulentno.

### Primer 4: zdaj ti

Zrak s kinematično viskoznostjo $1{,}5 \cdot 10^{-5}\,\mathrm{m^2/s}$ teče s povprečno hitrostjo $3{,}0\,\mathrm{m/s}$ po prezračevalnem kanalu bolnišnične operacijske dvorane, okroglega preseka s premerom $20\,\mathrm{cm}$. Kakšen je tok?

**Podatki:** $\nu = 1{,}5 \cdot 10^{-5}\,\mathrm{m^2/s}$, $v = 3{,}0\,\mathrm{m/s}$, $D = 20\,\mathrm{cm}$
**Iščemo:** $\mathrm{Re}$ in vrsto toka

:::formula
$\mathrm{Re} = \dfrac{v\, D}{\nu}$
:::

**Rešitev:**

1. Dana je kinematična viskoznost, zato gostote ne potrebujemo: že vsebovana je v $\nu$.
2. Premer v metrih: $D = 0{,}20\,\mathrm{m}$.
3. Izračunaj Re in odloči sam, nato preveri:

:::premisli
Koliko je $\mathrm{Re}$ in kakšen je tok?
---
$\mathrm{Re} = \dfrac{3{,}0 \cdot 0{,}20}{1{,}5 \cdot 10^{-5}} = 40\,000$. To je več kot $4000$, tok je turbulenten.
:::

## Pogoste napake

- **»Večja hitrost vedno pomeni turbulenco.«** Hitrost je le ena od štirih količin. Olje v primeru 2 teče hitreje od $1\,\mathrm{m/s}$ in je laminarno, ker ima veliko viskoznost. Odloča vedno $\mathrm{Re}$, ne hitrost sama.
- **Zamenjava $\mu$ in $\nu$.** Kdor v $\mathrm{Re} = \dfrac{\rho v D}{\mu}$ vstavi kinematično viskoznost, dobi rezultat, ki je za faktor $\rho$ prevelik (pri vodi $1000$-krat). Preveri enote: $\mu$ ima $\mathrm{Pa \cdot s}$, $\nu$ ima $\mathrm{m^2/s}$. Z $\nu$ uporabi obliko $\dfrac{vD}{\nu}$.
- **Nepretvorjene enote.** Premer v centimetrih ali viskoznost v cP ($\mathrm{mPa \cdot s}$) da napačen red velikosti. Pred računanjem vse pretvori v m, kg, s in $\mathrm{Pa \cdot s}$; Re mora na koncu ostati brez enote.
- **Polmer namesto premera.** V definiciji za cev je premer $D$. S polmerom dobiš polovico prave vrednosti in lahko napačno sklepaš na laminarni tok.
- **»Pri segrevanju vsaka tekočina postane manj viskozna.«** To velja za kapljevine. Plinom viskoznost s temperaturo raste.

## Povzetek

- Viskoznost je notranje trenje tekočine. Newtonov zakon: $\tau = \mu \dfrac{\mathrm{d}v}{\mathrm{d}y}$.
- Dinamična viskoznost $\mu$ v $\mathrm{Pa \cdot s}$ ($1\,\mathrm{cP} = 1\,\mathrm{mPa \cdot s}$); kinematična $\nu = \mu/\rho$ v $\mathrm{m^2/s}$.
- Kapljevinam viskoznost s temperaturo pada, plinom raste.
- $\mathrm{Re} = \dfrac{\rho v D}{\mu} = \dfrac{vD}{\nu}$ je brezdimenzijsko razmerje vztrajnostnih in viskoznih sil.
- V okrogli cevi: $\mathrm{Re} < 2100$ laminarno, $2100$ do $4000$ prehodno, $\mathrm{Re} > 4000$ turbulentno.
- Laminarni profil je parabola ($v_\mathrm{max} = 2\bar v$), turbulentni je sredi cevi skoraj raven.
- Hagen-Poiseuille (laminarno, polno razvito): $\Delta p = \dfrac{32\mu L \bar v}{D^2}$.

## Za izpit

Znati moraš povedati:

- Newtonov zakon viskoznosti s pogoji (laminaren plastovit tok, $\mu$ neodvisna od strižne hitrosti) in definicijo newtonske tekočine; izpeljavo linearnega profila med ploščama.
- Definiciji $\mu$ in $\nu = \mu/\rho$ z enotami ter odvisnost obeh od temperature pri kapljevinah in plinih z razlago.
- Definicijo $\mathrm{Re}$ (kaj sta $v$ in $D$), dokaz, da je brezdimenzijsko, razlago kot razmerje sil in obliko $\mathrm{Re} = \dfrac{4\rho Q}{\pi\mu D}$.
- Meje režimov v okrogli cevi in zakaj je meja $2100$ dogovorna.
- Izpeljavo Hagen-Poiseuillovega zakona: parabolični profil, $\bar v = v_\mathrm{max}/2$ in $\Delta p = \dfrac{32\mu L\bar v}{D^2}$, s pogoji veljavnosti.

### Naloga 1

Viskoznost olja z gostoto $880\,\mathrm{kg/m^3}$ merimo tako, da ga črpamo skozi vodoravno ravno cev z notranjim premerom $12\,\mathrm{mm}$. Na razdalji $3{,}0\,\mathrm{m}$ med priključkoma manometra je pri pretoku $0{,}30\,\mathrm{L/min}$ tlačni padec $1{,}2\,\mathrm{kPa}$. (a) Ob predpostavki laminarnega toka določi dinamično in kinematično viskoznost olja. (b) Preveri predpostavko. (c) Pri kolikšnem pretoku bi Re doseglo $2100$ in kolikšen bi bil tedaj tlačni padec na isti razdalji?

**Rešitev:**

1. Enote: $Q = \dfrac{0{,}30 \cdot 10^{-3}}{60}\,\mathrm{m^3/s} = 5{,}0 \cdot 10^{-6}\,\mathrm{m^3/s}$, $D = 0{,}012\,\mathrm{m}$, $\Delta p = 1200\,\mathrm{Pa}$.
2. Presek $A = \dfrac{\pi \cdot 0{,}012^2}{4} \approx 1{,}131 \cdot 10^{-4}\,\mathrm{m^2}$, povprečna hitrost $\bar v = \dfrac{Q}{A} \approx 0{,}0442\,\mathrm{m/s}$.
3. Hagen-Poiseuillov zakon obrnemo na viskoznost: $\mu = \dfrac{\Delta p\, D^2}{32\, L\, \bar v} = \dfrac{1200 \cdot 0{,}012^2}{32 \cdot 3{,}0 \cdot 0{,}04421}\,\mathrm{Pa\cdot s} \approx 0{,}0407\,\mathrm{Pa \cdot s}$.
4. $\nu = \dfrac{\mu}{\rho} = \dfrac{0{,}04072}{880}\,\mathrm{m^2/s} \approx 4{,}63 \cdot 10^{-5}\,\mathrm{m^2/s}$.
5. Preverba: $\mathrm{Re} = \dfrac{\bar v D}{\nu} = \dfrac{0{,}04421 \cdot 0{,}012}{4{,}627 \cdot 10^{-5}} \approx 11{,}5 < 2100$, tok je laminaren in uporaba zakona je upravičena.
6. Mejna hitrost: $\bar v_\mathrm{krit} = \dfrac{2100\, \nu}{D} = \dfrac{2100 \cdot 4{,}627 \cdot 10^{-5}}{0{,}012}\,\mathrm{m/s} \approx 8{,}10\,\mathrm{m/s}$.
7. Pretok: $Q = \bar v_\mathrm{krit} A \approx 8{,}097 \cdot 1{,}131 \cdot 10^{-4}\,\mathrm{m^3/s} \approx 9{,}16 \cdot 10^{-4}\,\mathrm{m^3/s} \approx 55\,\mathrm{L/min}$.
8. V laminarnem toku je $\Delta p$ sorazmeren z $\bar v$, zato $\Delta p = 1200\,\mathrm{Pa} \cdot \dfrac{8{,}097}{0{,}04421} \approx 2{,}2 \cdot 10^5\,\mathrm{Pa}$.
9. Odgovor: $\mu \approx 0{,}041\,\mathrm{Pa \cdot s}$, $\nu \approx 4{,}6 \cdot 10^{-5}\,\mathrm{m^2/s}$; tok pri meritvi je laminaren ($\mathrm{Re} \approx 11$); laminarna meja je pri okoli $55\,\mathrm{L/min}$, ko je tlačni padec okoli $220\,\mathrm{kPa}$.

### Naloga 2

Natančno navedi pogoje in izpelji profil hitrosti laminarnega toka v ravni okrogli cevi. Dokaži, da je povprečna hitrost polovica največje, in izpelji $\Delta p = \dfrac{32\mu L\bar v}{D^2}$. Utemelji, ali smemo zakon uporabiti za vodo ($\rho = 998\,\mathrm{kg/m^3}$, $\mu = 1{,}0\,\mathrm{mPa\cdot s}$) s pretokom $10\,\mathrm{L/min}$ v cevi s premerom $2{,}0\,\mathrm{cm}$.

**Rešitev:**

1. Pogoji: nestisljiva newtonska tekočina, stacionaren, laminaren, polno razvit tok, ravna okrogla cev s polmerom $R$, na steni $v = 0$.
2. Ravnovesje sil na valj s polmerom $r$ in dolžino $L$: $\Delta p\,\pi r^2 = \tau\, 2\pi r L$, torej $\tau = \dfrac{\Delta p\, r}{2L}$.
3. Z $\tau = -\mu\dfrac{\mathrm{d}v}{\mathrm{d}r}$: $\dfrac{\mathrm{d}v}{\mathrm{d}r} = -\dfrac{\Delta p\, r}{2\mu L}$; integracija s $v(R) = 0$ da $v(r) = \dfrac{\Delta p}{4\mu L}(R^2 - r^2)$, parabolo z $v_\mathrm{max} = \dfrac{\Delta p R^2}{4\mu L}$ v osi.
4. $Q = \int_0^R v(r)\,2\pi r\,\mathrm{d}r = \dfrac{2\pi \Delta p}{4\mu L}\left(\dfrac{R^4}{2} - \dfrac{R^4}{4}\right) = \dfrac{\pi\Delta p R^4}{8\mu L}$.
5. $\bar v = \dfrac{Q}{\pi R^2} = \dfrac{\Delta p R^2}{8\mu L} = \dfrac{v_\mathrm{max}}{2}$.
6. Iz koraka 5: $\Delta p = \dfrac{8\mu L\bar v}{R^2}$, z $R = D/2$ pa $\Delta p = \dfrac{32\mu L\bar v}{D^2}$.
7. Preverba za vodo: $Q = 1{,}667 \cdot 10^{-4}\,\mathrm{m^3/s}$, $\bar v = \dfrac{4Q}{\pi D^2} \approx 0{,}531\,\mathrm{m/s}$, $\mathrm{Re} = \dfrac{998 \cdot 0{,}5305 \cdot 0{,}020}{0{,}001} \approx 1{,}06 \cdot 10^4$.
8. Odgovor: profil je parabola, $\bar v = v_\mathrm{max}/2$ in $\Delta p = 32\mu L\bar v/D^2$; za to vodo zakona ne smemo uporabiti, ker je $\mathrm{Re} \approx 10\,600 > 4000$ in je tok turbulenten.

## Drugače: Uporaba v stroki

- **Kapilarni viskozimeter.** V Ubbelohdejevem ali Ostwaldovem viskozimetru odmerjena prostornina kapljevine laminarno izteče skozi kapilaro pod lastno težo. Po Hagen-Poiseuillu je čas iztekanja sorazmeren s kinematično viskoznostjo, $\nu = K t$, konstanto $K$ pa umerimo s standardom znane viskoznosti. Tako merijo viskoznost olj in raztopin polimerov.
- **Rotacijski viskozimeter in reometer.** Merita navor pri znani strižni hitrosti (valja ali stožec in plošča, Couettov tok). Iz krivulje $\tau$ v odvisnosti od $\mathrm{d}v/\mathrm{d}y$ ugotovimo, ali je vzorec newtonski; tako preverjajo barve, kreme in taline polimerov.
- **Cevovodi in črpalke.** Inženir najprej izračuna Re, saj je od njega odvisen koeficient trenja in s tem tlačni padec ter moč črpalke. Viskozna olja črpajo ogreta, da se $\mu$ zmanjša.
- **Toplotni prenosniki.** Načrtujemo jih za turbulentni tok (običajno $\mathrm{Re} > 10^4$), ker vrtinci prenašajo toploto do stene veliko bolje kot laminarne plasti.
- **Mikrofluidika in kromatografija.** V kanalih širine okoli $100\,\mu\mathrm{m}$ je Re običajno pod $1$, zato se dva vzporedna tokova mešata le z difuzijo, kar izkoriščajo laboratoriji na čipu. Tudi skozi polnilo kromatografske kolone teče mobilna faza laminarno, zato tlačni padec raste sorazmerno s pretokom.

## Drugače: Korak za korakom s številkami

Postopek za vsak izračun Re v cevi:

1. Izpiši $\rho$, $\mu$ (ali $\nu$), $D$ in $v$ (ali $Q$).
2. Pretvori v SI: cm v m, L/s v $\mathrm{m^3/s}$, cP v $\mathrm{Pa \cdot s}$ (deli s $1000$).
3. Če je dan pretok, izračunaj $v = \dfrac{4Q}{\pi D^2}$.
4. Izračunaj $\mathrm{Re}$ z $\mu$ ali z $\nu$, nikoli z obema hkrati.
5. Preveri enote: ostati ne sme nič.
6. Primerjaj z $2100$ in $4000$.

Primer za občutek pri vodi ($\nu \approx 10^{-6}\,\mathrm{m^2/s}$): $\mathrm{Re} \approx 10^6 \cdot v \cdot D$ (z $v$ v m/s in $D$ v m). Za cev $D = 0{,}02\,\mathrm{m}$ in $v = 1\,\mathrm{m/s}$ to da $\mathrm{Re} \approx 20\,000$.

## Drugače: Bolj natančno

**Dimenzijska analiza.** Re je eno od brezdimenzijskih števil, ki jih da Buckinghamov teorem $\pi$ za tok v cevi: iz seznama vseh količin, od katerih je tok odvisen, sestavi neodvisne kombinacije brez enot.

**Koeficient trenja.** Tlačne izgube v cevi zapišemo z Darcy-Weisbachovo enačbo $\Delta p = f\,\dfrac{L}{D}\,\dfrac{\rho \bar v^2}{2}$. Primerjava s Hagen-Poiseuillovim zakonom da za laminarni tok $f = \dfrac{64\mu}{\rho \bar v D} = \dfrac{64}{\mathrm{Re}}$. Za turbulentni tok $f$ odčitamo iz Moodyjevega diagrama, odvisen je še od hrapavosti stene.

**Turbulentni profil.** Približno ga opiše potenčni zakon $v(r) = v_\mathrm{max}\left(1 - \dfrac{r}{R}\right)^{1/7}$. Tik ob steni ostane tanka viskozna podplast, v kateri je tok laminaren.

**Nekrožni preseki.** Namesto $D$ vzamemo hidravlični premer $D_h = \dfrac{4A}{O}$ ($A$ presek, $O$ omočeni obseg). Za krog da $D_h = D$.

**Nenewtonske tekočine.** Pri njih $\mu$ ni stalna. Psevdoplastične (barve, kri, kečap) se pri večji strižni hitrosti redčijo, binghamske (zobna pasta) tečejo šele nad mejno napetostjo. Zanje se Re definira s prilagojeno viskoznostjo.

## Preveri se

? Kaj fizikalno pove Reynoldsovo število?
- Razmerje med tlakom in gostoto tekočine.
~ Tlak v Re ne nastopa. Re primerja sile, ki ohranjajo gibanje, s silami trenja.
+ Razmerje med vztrajnostnimi in viskoznimi silami v toku.
- Hitrost tekočine, preračunano v brezdimenzijsko obliko.
~ Hitrost je le en del Re. Ista hitrost da pri medu in vodi povsem različna Re.
- Koliko energije se izgubi zaradi trenja na enoto dolžine cevi.
~ To so tlačne izgube, ki so od Re odvisne, a niso Re sam.
> $\mathrm{Re} = \dfrac{\rho v D}{\mu}$ primerja vztrajnost ($\rho v^2$) z viskoznim trenjem ($\mu v/D$). Pri velikem Re trenje ne uspe zadušiti motenj in tok postane turbulenten.

? Olje laminarno teče po cevi pri $\mathrm{Re} = 1800$. Olje segrejemo, pretok ostane enak. Kaj se zgodi?
- Re pade, tok ostane še bolj laminaren.
~ Tako bi bilo, če bi viskoznost s temperaturo rasla. Pri kapljevinah pada.
+ Re naraste, tok lahko preide v prehodno ali turbulentno območje.
- Re ostane enak, ker se hitrost ne spremeni.
~ Hitrost res ostane enaka, a $\mu$ v imenovalcu se zmanjša, zato Re zraste.
> Viskoznost olja s temperaturo močno pade. Ker je $\mu$ v imenovalcu, Re zraste in lahko preseže $2100$.

? Zakaj se viskoznost zraka pri segrevanju poveča?
- Ker se zrak pri segrevanju zgosti.
~ Pri stalnem tlaku se segret zrak razredči, ne zgosti.
- Ker se med molekulami okrepijo privlačne sile.
~ Privlačne sile so pomembne pri kapljevinah. Pri plinih viskoznost izvira iz trkov in prenosa gibalne količine.
+ Ker hitrejše molekule med plastmi prenesejo več gibalne količine.
> Pri plinih molekule letijo med hitrejšimi in počasnejšimi plastmi in izenačujejo njihovo hitrost. Pri višji temperaturi je ta prenos hitrejši, zato je trenje večje.

? Kapljevina z $\rho = 1000\,\mathrm{kg/m^3}$ in $\mu = 2\,\mathrm{cP}$ teče s hitrostjo $0{,}5\,\mathrm{m/s}$ po cevi s premerom $4\,\mathrm{cm}$. Koliko je Re?
- $10$
~ Tako dobiš, če cP vstaviš kot $\mathrm{Pa \cdot s}$. $2\,\mathrm{cP} = 0{,}002\,\mathrm{Pa \cdot s}$.
- $5000$
~ To je polovica pravega rezultata: vstavil si polmer $2\,\mathrm{cm}$ namesto premera.
+ $10\,000$
- $1000$
~ Tako dobiš, če premer vstaviš v cm in viskoznost v cP. Obe enoti moraš pretvoriti v SI.
> $\mathrm{Re} = \dfrac{1000 \cdot 0{,}5 \cdot 0{,}04}{0{,}002} = 10\,000$. Tok je turbulenten.

? Olje s kinematično viskoznostjo $1{,}0 \cdot 10^{-4}\,\mathrm{m^2/s}$ in gostoto $900\,\mathrm{kg/m^3}$ teče s hitrostjo $1{,}0\,\mathrm{m/s}$ po cevi s premerom $10\,\mathrm{cm}$. Kakšen je tok?
- Turbulenten, $\mathrm{Re} = 900\,000$.
~ Gostoto si vstavil še enkrat. V $\nu$ je že vsebovana: $\mathrm{Re} = \dfrac{vD}{\nu}$.
+ Laminaren, $\mathrm{Re} = 1000$.
- Turbulenten, ker je hitrost $1\,\mathrm{m/s}$ velika.
~ O vrsti toka ne odloča hitrost sama. Izračunaj Re.
> $\mathrm{Re} = \dfrac{1{,}0 \cdot 0{,}10}{1{,}0 \cdot 10^{-4}} = 1000 < 2100$, tok je laminaren.

:::simboli
\tau | strižna napetost | \tau = \mu \frac{\mathrm{d}v}{\mathrm{d}y} | Pa
\mu | dinamična viskoznost | | Pa s | voda pri 20 °C približno 1,0 mPa s
\nu | kinematična viskoznost | \nu = \frac{\mu}{\rho} | m^2/s
\rho | gostota tekočine | | kg/m^3
v | povprečna hitrost toka v cevi | v = \frac{Q}{A} | m/s | v τ = μ dv/dy hitrost plasti tekočine
y | prečna razdalja, pravokotno na smer toka | | m
\delta | razdalja med ploščama | | m
v_0 | hitrost zgornje plošče | | m/s
S | ploščina plošče | | m^2
F | sila za vlečenje plošče | F = \mu S \frac{v_0}{\delta} | N
\mathrm{Re} | Reynoldsovo število | \mathrm{Re} = \frac{\rho\, v\, D}{\mu} | – | v cevi laminarno pod 2100, turbulentno nad 4000
D | notranji premer cevi | | m
r | oddaljenost od osi cevi | | m
R | polmer cevi | | m
v_\mathrm{max} | največja hitrost (v osi cevi) | | m/s | pri laminarnem toku v_max = 2 v̄
\bar v | povprečna hitrost po preseku | \bar v = \frac{v_\mathrm{max}}{2} | m/s | velja za laminarni tok
\Delta p | tlačni padec na dolžini cevi | \Delta p = \frac{32\, \mu\, L\, \bar v}{D^2} | Pa | Hagen-Poiseuillov zakon, laminarni tok
L | dolžina cevi | | m
h | višina gladine nad iztokom | h = \frac{\Delta p}{\rho g} | m | hidrostatični tlak Δp = ρgh
g | težni pospešek | | m/s^2 | 9,81 m/s²
Q | prostorninski pretok | Q = v\,A | m^3/s | okrogla cev: Q = v πD²/4
A | ploščina preseka cevi | A = \frac{\pi D^2}{4} | m^2
:::
