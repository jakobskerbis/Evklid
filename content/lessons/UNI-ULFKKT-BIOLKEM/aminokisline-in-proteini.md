---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Veslačica Maja si po treningu speče jajčne beljake. Prozorna tekočina v ponvi postane bela in čvrsta. Enako se zgodi beljaku v kozarcu, v katerega je trener za šalo kapnil kis. Kemijska sestava se pri tem skoraj ne spremeni: proteinske verige se le razvijejo in sprimejo. Maja bi rada vedela, kaj je verige prej držalo zvite in zakaj jih kis razvije.

Odgovor so naboji aminokislin, ki so odvisni od pH. Kdor zna iz pH napovedati naboj, razume tudi, zakaj encim deluje le v ozkem območju pH, kako ločimo proteine z elektroforezo in zakaj ena zamenjana aminokislina povzroči srpastocelično anemijo.

## Razlaga

### Ena aminokislina, dvajset različic

**α-aminokislina** je karboksilna kislina, ki ima amino skupino na ogljiku $\alpha$, tj. na ogljiku, sosednjem karboksilni skupini. Na osrednji ogljik $\mathrm{C_\alpha}$ so torej vezani štirje deli: amino skupina $-\mathrm{NH_2}$, karboksilna skupina $-\mathrm{COOH}$, vodik in **stranska veriga** $R$. V proteinih je 20 standardnih aminokislin, ki se razlikujejo le po $R$. Razen glicina ($R = \mathrm{H}$) imajo vse kiralen $\mathrm{C_\alpha}$; v proteinih so vse v obliki L (v Fischerjevi projekciji s karboksilno skupino zgoraj in stransko verigo spodaj je amino skupina levo).

Po stranski verigi jih razvrstimo v štiri skupine:

| skupina | aminokisline |
|---|---|
| nepolarne | Gly, Ala, Val, Leu, Ile, Met, Phe, Trp, Pro |
| polarne nenabite | Ser, Thr, Asn, Gln, Cys, Tyr |
| kisle | Asp, Glu |
| bazične | Lys, Arg, His |

### Naboj na številski premici pH

Najprej slika. Glicin ($\mathrm{p}K_1 = 2{,}34$, $\mathrm{p}K_2 = 9{,}60$) na številski premici pH:

```
pH:   0 ------ 2,34 ------------ 9,60 ------ 14
oblika:  H3N+–COOH | H3N+–COO– | H2N–COO–
naboj:      +1     |     0     |    –1
```

Vsak $\mathrm{p}K$ je meja na premici. Levo od nje (pH pod $\mathrm{p}K_\mathrm{a}$) skupina večinoma *nosi* proton, desno ga je *oddala*. Pri vsakem $\mathrm{p}K$ je povprečni naboj natanko na sredi med sosednjima oblikama, npr. $+0{,}5$ pri $\mathrm{pH} = 2{,}34$.

Karboksilna skupina na $\mathrm{C_\alpha}$ ima $\mathrm{p}K_\mathrm{a} \approx 2$, amino skupina $\mathrm{p}K_\mathrm{a} \approx 9$ do $10$. Pri $\mathrm{pH}\ 7$, v srednjem polju premice, je zato $-\mathrm{COOH}$ oddala proton ($-\mathrm{COO^-}$), $-\mathrm{NH_2}$ pa ga je sprejela ($-\mathrm{NH_3^+}$). Molekula ima oba naboja, skupni naboj pa je nič. Taki obliki rečemo **ion dvojček**.

### Kako ostra je meja: Henderson-Hasselbalchova enačba

Kislina $\mathrm{HA}$ odda proton in nastane konjugirana baza $\mathrm{A^-}$. Pri $\mathrm{pH} = \mathrm{p}K_\mathrm{a}$ sta obliki v razmerju $1:1$. Vsaka enota pH nad $\mathrm{p}K_\mathrm{a}$ pomeni desetkrat več deprotonirane oblike. Natančno razmerje pri danem pH pove **Henderson-Hasselbalchova enačba**:

$$\mathrm{pH} = \mathrm{p}K_\mathrm{a} + \log\frac{[\mathrm{A^-}]}{[\mathrm{HA}]}$$

*Izpeljava.* Konstanta kisline je $K_\mathrm{a} = \dfrac{[\mathrm{H^+}][\mathrm{A^-}]}{[\mathrm{HA}]}$. Logaritmiramo in pomnožimo z $-1$: $-\log[\mathrm{H^+}] = -\log K_\mathrm{a} + \log\dfrac{[\mathrm{A^-}]}{[\mathrm{HA}]}$, kar je enačba zgoraj z $\mathrm{pH} = -\log[\mathrm{H^+}]$ in $\mathrm{p}K_\mathrm{a} = -\log K_\mathrm{a}$. Iz nje sledi delež deprotonirane oblike $\alpha = \dfrac{[\mathrm{A^-}]}{[\mathrm{HA}] + [\mathrm{A^-}]} = \dfrac{1}{1 + 10^{\,\mathrm{p}K_\mathrm{a} - \mathrm{pH}}}$. **Povprečni naboj** molekule je vsota prispevkov vseh skupin: kisla skupina prispeva $-\alpha$, bazična (npr. $-\mathrm{NH_3^+}$) pa $+(1 - \alpha)$.

### Izoelektrična točka

**Izoelektrična točka** $\mathrm{pI}$ je pH, pri katerem je povprečni skupni naboj molekule nič. Na premici je to sredina polja z nabojem $0$, torej med obema $\mathrm{p}K$, ki obdajata nevtralno obliko:

$$\mathrm{pI} = \frac{\mathrm{p}K_\text{pred} + \mathrm{p}K_\text{za}}{2}$$

*Dokaz za glicin.* Naj bodo oblike $\mathrm{H_2A^+}$, $\mathrm{HA}$ (ion dvojček) in $\mathrm{A^-}$, s $K_1 = \dfrac{[\mathrm{HA}][\mathrm{H^+}]}{[\mathrm{H_2A^+}]}$ in $K_2 = \dfrac{[\mathrm{A^-}][\mathrm{H^+}]}{[\mathrm{HA}]}$. Skupni naboj je nič natanko tedaj, ko je $[\mathrm{H_2A^+}] = [\mathrm{A^-}]$, torej $\dfrac{[\mathrm{HA}][\mathrm{H^+}]}{K_1} = \dfrac{K_2[\mathrm{HA}]}{[\mathrm{H^+}]}$ in $[\mathrm{H^+}]^2 = K_1K_2$. Logaritmiramo: $\mathrm{pI} = \tfrac12(\mathrm{p}K_1 + \mathrm{p}K_2)$.

Pri glicinu sta to $\mathrm{p}K_1$ in $\mathrm{p}K_2$. Pri aminokislinah z ionizirajočo stransko verigo pa moraš najprej poiskati, med katerima $\mathrm{p}K$ leži nevtralna oblika.

Na tem temelji elektroforeza: pri $\mathrm{pH} < \mathrm{pI}$ je molekula pozitivna in v električnem polju potuje h katodi ($-$), pri $\mathrm{pH} > \mathrm{pI}$ je negativna in potuje k anodi ($+$), pri $\mathrm{pI}$ obstane.

:::premisli
Aspartat ima v stranski verigi še eno karboksilno skupino ($\mathrm{p}K_R = 3{,}65$). Ali bo njegov $\mathrm{pI}$ višji ali nižji od glicinovega? Zakaj?
---
Nižji. Dodatna kisla skupina pri $\mathrm{pH}$ nad $3{,}65$ prinese še en negativni naboj. Nevtralna oblika zato obstaja le pri nizkem pH, med $\mathrm{p}K_1$ in $\mathrm{p}K_R$, in $\mathrm{pI}$ leži okoli $2{,}8$.
:::

### Peptidna vez

Karboksilna skupina ene aminokisline in amino skupina druge se povežeta z odcepom vode. Nastane **peptidna vez** $-\mathrm{CO-NH}-$. Veriga ima smer: začne se s prosto amino skupino (**N-konec**) in konča s prosto karboksilno skupino (**C-konec**). Peptidna vez je amidna vez. Zaradi resonance med $\mathrm{C{=}O}$ in prostim elektronskim parom dušika ima vez C–N delni značaj dvojne vezi (je krajša od enojne), zato je skupina $\mathrm{C_\alpha{-}CO{-}NH{-}C_\alpha}$ ravninska in skoraj vedno v obliki trans. Vrtenje je mogoče le okoli vezi na $\mathrm{C_\alpha}$; kota vrtenja imenujemo $\varphi$ in $\psi$.

### Štiri ravni zgradbe

| raven | kaj opisuje | kaj jo drži |
|---|---|---|
| primarna | zaporedje aminokislin od N- do C-konca | peptidne (kovalentne) vezi |
| sekundarna | lokalno zvitje ogrodja: α-vijačnica, β-ploskev | vodikove vezi med $\mathrm{C{=}O}$ in $\mathrm{N{-}H}$ ogrodja |
| terciarna | prostorska oblika cele verige | hidrofobni učinek, vodikove in ionske vezi, disulfidni mostički |
| kvartarna | povezava več verig (podenot) | enake nekovalentne interakcije, včasih disulfidi |

V **α-vijačnici** tvori $\mathrm{C{=}O}$ aminokisline $n$ vodikovo vez z $\mathrm{N{-}H}$ aminokisline $n+4$. En zavoj obsega $3{,}6$ aminokisline in je visok $0{,}54\,\mathrm{nm}$; na aminokislino pride $0{,}15\,\mathrm{nm}$ dolžine. Stranske verige štrlijo navzven. V **β-ploskvi** ležijo iztegnjeni odseki verige drug ob drugem (vzporedno ali protivzporedno), vodikove vezi pa so med sosednjimi odseki.

### Hidrofobni učinek

V vodi se nepolarne stranske verige zberejo v notranjosti proteina, polarne in nabite pa ostanejo na površini. To je glavna gonilna sila zvijanja v terciarno zgradbo. Ionske vezi (npr. Lys$^+$ z Asp$^-$) in disulfidni mostički med dvema Cys obliko dodatno utrdijo.

:::premisli
Zakaj ekstremen pH (npr. kis v beljaku) proteinske verige razvije, čeprav peptidnih vezi ne pretrga?
---
Ker spremeni naboje stranskih verig. Pri nizkem pH Asp in Glu sprejmeta proton in izgubita negativni naboj. Ionske vezi z Lys in Arg razpadejo, enako nabite skupine se odbijajo in veriga se razvije. Primarna zgradba ostane, terciarna se podre.
:::

### Denaturacija in zvijanje

**Denaturacija** je izguba sekundarne, terciarne in kvartarne zgradbe brez pretrganja peptidnih vezi. Povzročijo jo toplota, ekstremen pH, sečnina ali detergenti. Ker zaporedje ostane, se nekateri proteini po odstranitvi denaturanta sami spet pravilno zvijejo. Iz tega sklepamo, da primarna zgradba določa prostorsko obliko. Klasičen dokaz je **Anfinsenov poskus**: ribonukleazo A razvijemo s sečnino in 2-merkaptoetanolom, ki reducira štiri disulfidne mostičke. Ko oba odstranimo z dializo in pustimo cisteine počasi oksidirati na zraku, encim spet dobi skoraj vso aktivnost; od $105$ možnih parjenj osmih cisteinov nastane spet pravo.

## Rešeni primeri

### Primer 1 (lažji): izoelektrična točka glicina

Glicin ima $\mathrm{p}K_1 = 2{,}34$ ($\alpha$-karboksilna skupina) in $\mathrm{p}K_2 = 9{,}60$ ($\alpha$-amino skupina). Izračunaj $\mathrm{pI}$.

**Podatki:** $\mathrm{p}K_1 = 2{,}34$, $\mathrm{p}K_2 = 9{,}60$, stranska veriga se ne ionizira
**Iščemo:** izoelektrično točko $\mathrm{pI}$

:::formula
$\mathrm{pI} = \dfrac{\mathrm{p}K_1 + \mathrm{p}K_2}{2}$
:::

**Rešitev:**

1. Oblike od nizkega pH proti visokemu: naboj $+1$, nato $0$, nato $-1$. Nevtralna oblika leži med $\mathrm{p}K_1$ in $\mathrm{p}K_2$.
2. $\mathrm{pI} = \dfrac{2{,}34 + 9{,}60}{2} = 5{,}97$.
3. Odgovor: izoelektrična točka glicina je $5{,}97$.

### Primer 2: delež protonirane oblike histidina

Mišice šprinterjev vsebujejo veliko karnozina, dipeptida s histidinom, ki med sprintom lovi protone. Imidazolna skupina v stranski verigi prostega histidina ima $\mathrm{p}K_R = 6{,}0$. Kolikšen delež teh skupin je protoniran (pozitivno nabit) pri $\mathrm{pH} = 7{,}0$?

**Podatki:** $\mathrm{p}K_R = 6{,}0$, $\mathrm{pH} = 7{,}0$
**Iščemo:** delež protonirane oblike $\mathrm{HA}$

:::formula
$\dfrac{[\mathrm{A}]}{[\mathrm{HA}]} = 10^{\,\mathrm{pH} - \mathrm{p}K_\mathrm{a}}$, $\quad$ delež $\mathrm{HA} = \dfrac{1}{1 + [\mathrm{A}]/[\mathrm{HA}]}$
:::

**Rešitev:**

1. Henderson-Hasselbalchovo enačbo obrnemo: $\dfrac{[\mathrm{A}]}{[\mathrm{HA}]} = 10^{7{,}0 - 6{,}0} = 10$. Na eno protonirano skupino pride deset deprotoniranih.
2. Od $11$ delov je protoniran $1$: delež $= \dfrac{1}{11} \approx 0{,}091$.
3. Odgovor: pri $\mathrm{pH}\ 7{,}0$ je protoniranih približno $9{,}1\,\%$ imidazolnih skupin. Ker je $\mathrm{p}K_R$ blizu fiziološkega pH, histidin v aktivnih mestih encimov zlahka sprejema in oddaja proton.

### Primer 3 (težji): izoelektrična točka kisle aminokisline

Aspartat ima $\mathrm{p}K_1 = 1{,}88$ ($\alpha$-COOH), $\mathrm{p}K_R = 3{,}65$ (COOH v stranski verigi) in $\mathrm{p}K_2 = 9{,}60$ ($\alpha$-$\mathrm{NH_3^+}$). Izračunaj $\mathrm{pI}$ in napovej skupni naboj pri $\mathrm{pH}\ 7$. Nato s Henderson-Hasselbalchovo enačbo izračunaj povprečni naboj pri $\mathrm{pH} = 3{,}00$ in preveri, ali se ujema z $\mathrm{pI}$.

**Podatki:** $\mathrm{p}K_1 = 1{,}88$, $\mathrm{p}K_R = 3{,}65$, $\mathrm{p}K_2 = 9{,}60$, $\mathrm{pH} = 7$ in $\mathrm{pH} = 3{,}00$
**Iščemo:** $\mathrm{pI}$, naboj pri $\mathrm{pH}\ 7$ in povprečni naboj $z$ pri $\mathrm{pH} = 3{,}00$

:::formula
$\mathrm{pI} = \dfrac{\mathrm{p}K_\text{pred} + \mathrm{p}K_\text{za}}{2}$, kjer sta $\mathrm{p}K$ tik pod in tik nad nevtralno obliko; $\alpha = \dfrac{1}{1 + 10^{\,\mathrm{p}K_\mathrm{a} - \mathrm{pH}}}$
:::

**Rešitev:**

1. $\mathrm{p}K$ uredimo naraščajoče: $1{,}88 < 3{,}65 < 9{,}60$. Pri zelo nizkem pH so vse skupine protonirane, naboj je $+1$ (le $-\mathrm{NH_3^+}$).
2. Nad $1{,}88$ odda proton $\alpha$-COOH: naboj $0$. Nad $3{,}65$ ga odda stranska veriga: naboj $-1$. Nad $9{,}60$ ga odda amino skupina: naboj $-2$.
3. Nevtralna oblika leži med $1{,}88$ in $3{,}65$. Tretjega $\mathrm{p}K$ ($9{,}60$) zato ne uporabimo.
4. $\mathrm{pI} = \dfrac{1{,}88 + 3{,}65}{2} = 2{,}765 \approx 2{,}77$.
5. $\mathrm{pH}\ 7$ leži med $3{,}65$ in $9{,}60$, kjer je naboj $-1$.
6. Pri $\mathrm{pH} = 3{,}00$ je $\alpha$-COOH deprotonirana v deležu $\alpha_1 = \dfrac{1}{1 + 10^{1{,}88 - 3{,}00}} \approx 0{,}930$, stranska veriga v deležu $\alpha_R = \dfrac{1}{1 + 10^{3{,}65 - 3{,}00}} \approx 0{,}183$; amino skupina je protonirana praktično v celoti ($10^{3{,}00 - 9{,}60}$ je zanemarljivo).
7. Povprečni naboj: $z = +1 - 0{,}930 - 0{,}183 \approx -0{,}11$. Je majhen in negativen, kar se ujema s tem, da je $\mathrm{pH} = 3{,}00$ malo nad $\mathrm{pI} = 2{,}77$.
8. Odgovor: $\mathrm{pI}$ aspartata je približno $2{,}77$; pri $\mathrm{pH}\ 7$ ima naboj približno $-1$, pri $\mathrm{pH} = 3{,}00$ pa $z \approx -0{,}11$.

### Primer 4: zdaj ti

Lizin ima $\mathrm{p}K_1 = 2{,}18$ ($\alpha$-COOH), $\mathrm{p}K_2 = 8{,}95$ ($\alpha$-$\mathrm{NH_3^+}$) in $\mathrm{p}K_R = 10{,}53$ ($\varepsilon$-$\mathrm{NH_3^+}$ v stranski verigi). Izračunaj $\mathrm{pI}$.

**Podatki:** $\mathrm{p}K_1 = 2{,}18$, $\mathrm{p}K_2 = 8{,}95$, $\mathrm{p}K_R = 10{,}53$
**Iščemo:** izoelektrično točko $\mathrm{pI}$

:::formula
$\mathrm{pI} = \dfrac{\mathrm{p}K_\text{pred} + \mathrm{p}K_\text{za}}{2}$
:::

**Rešitev:**

1. Pri nizkem pH sta protonirani obe amino skupini, karboksilna je nenabita: naboj $+2$.
2. Nad $2{,}18$: $+1$. Nad $8{,}95$: $0$. Nad $10{,}53$: $-1$. Nevtralna oblika je med $8{,}95$ in $10{,}53$.
3. Izračunaj sam, nato preveri:

:::premisli
Koliko je $\mathrm{pI} = \dfrac{8{,}95 + 10{,}53}{2}$?
---
$\mathrm{pI} = 9{,}74$. Lizin je bazična aminokislina, zato je njegov $\mathrm{pI}$ visoko nad $7$; pri fiziološkem pH je pozitivno nabit.
:::

## Pogoste napake

- **Povprečje vseh treh $\mathrm{p}K$.** Pri aspartatu bi $\dfrac{1{,}88 + 3{,}65 + 9{,}60}{3}$ dalo $5{,}04$, kar je napačno. Vzameš le dva $\mathrm{p}K$, ki obdajata nevtralno obliko. Vedno najprej zapiši naboje po vrsti.
- **»Pri $\mathrm{pI}$ aminokislina nima nabitih skupin.«** Pri $\mathrm{pI}$ je *skupni* naboj nič, a molekula je večinoma ion dvojček s $-\mathrm{COO^-}$ in $-\mathrm{NH_3^+}$.
- **Obrnjena smer pH.** Pri pH *nad* $\mathrm{p}K_\mathrm{a}$ je skupina deprotonirana, ne protonirana. Z nižanjem pH molekula pridobiva protone in pozitivni naboj.
- **»Vijačnico držijo vezi med stranskimi verigami.«** Sekundarno zgradbo držijo vodikove vezi med $\mathrm{C{=}O}$ in $\mathrm{N{-}H}$ ogrodja. Stranske verige štrlijo navzven in določajo predvsem terciarno zgradbo.
- **»Denaturacija pretrga peptidne vezi.«** Denaturacija podre le prostorsko zgradbo; primarna zgradba ostane. Peptidne vezi pretrga hidroliza (kisline pri visoki temperaturi ali proteaze).

## Povzetek

- Aminokislina: $\mathrm{C_\alpha}$ z $-\mathrm{NH_2}$, $-\mathrm{COOH}$, H in stransko verigo $R$; 20 standardnih, v proteinih oblika L.
- Henderson-Hasselbalch: $\mathrm{pH} = \mathrm{p}K_\mathrm{a} + \log([\mathrm{A^-}]/[\mathrm{HA}])$; pod $\mathrm{p}K_\mathrm{a}$ skupina nosi proton, nad njim ne.
- Pri $\mathrm{pH}\ 7$ so aminokisline ioni dvojčki ($-\mathrm{COO^-}$, $-\mathrm{NH_3^+}$).
- $\mathrm{pI}$ je povprečje dveh $\mathrm{p}K$, ki obdajata nevtralno obliko (Gly $5{,}97$, Asp $2{,}77$, Lys $9{,}74$). Pri $\mathrm{pH} < \mathrm{pI}$ je molekula pozitivna, pri $\mathrm{pH} > \mathrm{pI}$ negativna.
- Peptidna vez je ravninska in trans; veriga ima N- in C-konec.
- Primarna (zaporedje), sekundarna (α-vijačnica, β-ploskev; H-vezi ogrodja), terciarna (hidrofobni učinek, ionske vezi, disulfidi), kvartarna (več podenot).
- Denaturacija podre prostorsko zgradbo, zaporedje ostane; zaporedje določa obliko.

## Za izpit

Znati moraš povedati:

- definiciji α-aminokisline in izoelektrične točke ter razvrstitev 20 aminokislin po stranski verigi;
- izpeljavo Henderson-Hasselbalchove enačbe iz $K_\mathrm{a}$ in računanje deleža oblik ter povprečnega naboja pri danem pH;
- dokaz $\mathrm{pI} = \tfrac12(\mathrm{p}K_1 + \mathrm{p}K_2)$ in pravilo, katera dva $\mathrm{p}K$ vzameš pri ionizirajoči stranski verigi;
- zgradbo peptidne vezi (resonanca, ravninska, trans) in štiri ravni zgradbe z vezmi, ki jih držijo;
- definicijo denaturacije in Anfinsenov poskus kot dokaz, da zaporedje določa obliko.

### Naloga 1

Tetrapeptid Ala–His–Asp–Lys ima ionizirajoče skupine s temi $\mathrm{p}K$: C-konec $3{,}1$, stranska veriga Asp $3{,}9$, stranska veriga His $6{,}0$, N-konec $8{,}0$, stranska veriga Lys $10{,}5$. (a) Določi $\mathrm{pI}$. (b) Izračunaj povprečni naboj pri $\mathrm{pH} = 7{,}40$ na dve decimalki. (c) V katero smer potuje peptid pri elektroforezi s pufrom $\mathrm{pH} = 7{,}40$?

**Rešitev:**

1. Kisle skupine (C-konec, Asp) so nevtralne ali negativne, bazične (His, N-konec, Lys) pozitivne ali nevtralne. Pri zelo nizkem pH je naboj $+3$.
2. Po naraščajočih $\mathrm{p}K$: nad $3{,}1$ naboj $+2$, nad $3{,}9$ $+1$, nad $6{,}0$ $0$, nad $8{,}0$ $-1$, nad $10{,}5$ $-2$.
3. Nevtralna oblika je med $6{,}0$ in $8{,}0$, zato $\mathrm{pI} = \dfrac{6{,}0 + 8{,}0}{2} = 7{,}0$.
4. Bazične skupine pri $\mathrm{pH} = 7{,}40$, protonirani delež $1/(1 + 10^{\,\mathrm{pH} - \mathrm{p}K})$: His $\dfrac{1}{1 + 10^{1{,}4}} \approx 0{,}038$, N-konec $\dfrac{1}{1 + 10^{-0{,}6}} \approx 0{,}799$, Lys $\dfrac{1}{1 + 10^{-3{,}1}} \approx 0{,}999$.
5. Kisli skupini: deprotonirana deleža $\dfrac{1}{1 + 10^{-4{,}3}} \approx 1{,}000$ in $\dfrac{1}{1 + 10^{-3{,}5}} \approx 1{,}000$; skupaj prispevata $-2{,}00$.
6. Povprečni naboj: $z = 0{,}038 + 0{,}799 + 0{,}999 - 2{,}000 \approx -0{,}16$.
7. Ker je $\mathrm{pH} > \mathrm{pI}$, je naboj negativen in peptid počasi potuje proti anodi ($+$).
8. Odgovor: $\mathrm{pI} = 7{,}0$; pri $\mathrm{pH} = 7{,}40$ je $z \approx -0{,}16$ in peptid potuje k anodi.

### Naloga 2

Izpelji Henderson-Hasselbalchovo enačbo iz definicije konstante kisline. Nato natančno navedi pogoj za izoelektrično točko in dokaži, da za aminokislino z neionizirajočo stransko verigo velja $\mathrm{pI} = \tfrac12(\mathrm{p}K_1 + \mathrm{p}K_2)$. Utemelji, ali sme študent pri aspartatu vzeti povprečje vseh treh $\mathrm{p}K$.

**Rešitev:**

1. Za $\mathrm{HA \rightleftharpoons H^+ + A^-}$ je $K_\mathrm{a} = \dfrac{[\mathrm{H^+}][\mathrm{A^-}]}{[\mathrm{HA}]}$; logaritmiramo in pomnožimo z $-1$, pa dobimo $\mathrm{pH} = \mathrm{p}K_\mathrm{a} + \log\dfrac{[\mathrm{A^-}]}{[\mathrm{HA}]}$.
2. Pogoj: $\mathrm{pI}$ je pH, pri katerem je povprečni skupni naboj molekule nič.
3. Z oblikami $\mathrm{H_2A^+}$, $\mathrm{HA}$, $\mathrm{A^-}$ je naboj $([\mathrm{H_2A^+}] - [\mathrm{A^-}])/c$, kjer je $c$ skupna koncentracija aminokisline; torej je nič natanko pri $[\mathrm{H_2A^+}] = [\mathrm{A^-}]$.
4. Iz $K_1$ in $K_2$: $[\mathrm{H_2A^+}] = [\mathrm{HA}][\mathrm{H^+}]/K_1$ in $[\mathrm{A^-}] = K_2[\mathrm{HA}]/[\mathrm{H^+}]$. Izenačimo: $[\mathrm{H^+}]^2 = K_1K_2$.
5. Z $-\log$: $2\,\mathrm{pI} = \mathrm{p}K_1 + \mathrm{p}K_2$, kar je bilo treba dokazati.
6. Aspartat: nevtralna oblika obstaja le med $\mathrm{p}K_1 = 1{,}88$ in $\mathrm{p}K_R = 3{,}65$. Pri pH okoli $3$ je oblika z nabojem $-2$ zaradi $\mathrm{p}K_2 = 9{,}60$ zanemarljiva, zato se pogoj prevede na $[\mathrm{H^+}]^2 = K_1K_R$.
7. Odgovor: ne sme; povprečje vseh treh ($5{,}04$) leži v območju z nabojem $-1$, pravilno je $\mathrm{pI} = \tfrac12(1{,}88 + 3{,}65) \approx 2{,}77$.

## Drugače: Na sliki

Nariši graf naboja v odvisnosti od pH za aspartat: na osi $x$ pH od $0$ do $14$, na osi $y$ naboj od $+1$ do $-2$.

- Krivulja ima tri »stopnice« navzdol, vsako pri enem $\mathrm{p}K$: pri $1{,}88$ z $+1$ na $0$, pri $3{,}65$ z $0$ na $-1$, pri $9{,}60$ z $-1$ na $-2$.
- Na sredi vsake stopnice je naboj točno polovičen (npr. $-0{,}5$ pri $\mathrm{pH} = 3{,}65$).
- $\mathrm{pI}$ je točka, kjer krivulja seka vodoravno os z nabojem $0$: na sredi med prvo in drugo stopnico, pri $2{,}77$.

Pri elektroforezi to pomeni: pod $\mathrm{pI}$ molekula potuje h katodi ($-$), nad $\mathrm{pI}$ k anodi ($+$), pri $\mathrm{pI}$ pa obstane.

## Drugače: Uporaba v stroki

- **Ionsko-izmenjevalna kromatografija:** pufer izberemo glede na $\mathrm{pI}$. Pri $\mathrm{pH} > \mathrm{pI}$ je protein negativen in se veže na anionski izmenjevalec (npr. DEAE), z naraščajočo koncentracijo soli ga speremo.
- **Izoelektrično fokusiranje:** v gelu z gradientom pH protein potuje, dokler ne pride do svojega $\mathrm{pI}$; v kombinaciji s SDS-PAGE (dvodimenzionalna elektroforeza) ločimo tisoče proteinov celice.
- **Izoelektrično obarjanje:** proteini so pri $\mathrm{pI}$ najmanj topni. Kazein se obori pri pH okoli $4{,}6$; na tem temelji kislinsko sirjenje mleka pri izdelavi skute in svežih sirov.
- **Biofarmacija:** rekombinantni proteini iz bakterije *E. coli* so pogosto v netopnih inkluzijskih telesih. Raztopimo jih v sečnini in jih s postopnim odstranjevanjem denaturanta ponovno zvijemo, kot v Anfinsenovem poskusu. Formulacijo zdravila pufriramo stran od $\mathrm{pI}$, da protein ne agregira.

## Drugače: Bolj natančno

**Izpeljava $\mathrm{pI}$ za tri skupine.** Pri aspartatu so oblike $\mathrm{H_3A^+}$, $\mathrm{H_2A}$, $\mathrm{HA^-}$ in $\mathrm{A^{2-}}$. Naboj je nič, ko je $[\mathrm{H_3A^+}] = [\mathrm{HA^-}] + 2[\mathrm{A^{2-}}]$. Ker je $[\mathrm{A^{2-}}]/[\mathrm{HA^-}] = 10^{\,\mathrm{pH} - 9{,}60}$, pri pH okoli $3$ reda velikosti $10^{-7}$, člen zanemarimo in dobimo

$$\frac{[\mathrm{H_2A}][\mathrm{H^+}]}{K_1} = \frac{K_R[\mathrm{H_2A}]}{[\mathrm{H^+}]} \;\Rightarrow\; [\mathrm{H^+}]^2 = K_1K_R$$

Zato je pravilo »dva sosednja $\mathrm{p}K$« približek, ki je dober, kadar so ostale vrednosti $\mathrm{p}K$ daleč.

**Puferska kapaciteta.** Aminokislina najbolje pufrira v območju $\mathrm{p}K \pm 1$, ne pri $\mathrm{pI}$. Med proteini v krvi pufrira predvsem hemoglobin s svojimi histidini, ker je njihov $\mathrm{p}K_R$ blizu $7$.

**$\mathrm{p}K$ v proteinu.** Tabelirane vrednosti veljajo za proste aminokisline. V proteinu jih okolica premakne: v hidrofobnem žepu ali ob istoimenskem naboju je nabita oblika skupine manj ugodna. Tako ima npr. Lys v aktivnem mestu acetoacetat-dekarboksilaze $\mathrm{p}K$ okoli $6$.

**Ramachandranov diagram.** Zaradi steričnih trkov so dovoljene le nekatere kombinacije kotov $\varphi$ in $\psi$. Desnosučna α-vijačnica leži pri $\varphi \approx -57^\circ$, $\psi \approx -47^\circ$, β-ploskev v območju $\varphi \approx -120^\circ$, $\psi \approx +130^\circ$. Prolin ima obroč, ki zaklene $\varphi$, in nima $\mathrm{N{-}H}$ za vodikovo vez, zato α-vijačnico prekine. Glicin je zaradi majhne stranske verige zelo gibljiv.

**Termodinamika zvijanja.** Nativna oblika je stabilnejša od razvite le za približno $20$ do $60\,\mathrm{kJ/mol}$. To je majhna razlika velikih prispevkov: entalpija vodikovih vezi in van der Waalsovih stikov ter entropija vode, ki se sprosti s hidrofobnih površin, proti izgubi konformacijske entropije verige.

## Preveri se

? Kaj je izoelektrična točka $\mathrm{pI}$?
- pH, pri katerem so vse skupine aminokisline nenabite.
~ Pri $\mathrm{pI}$ ima molekula nabite skupine (ion dvojček), le skupni naboj je nič.
+ pH, pri katerem je povprečni skupni naboj molekule nič.
- pH, ki je enak $\mathrm{p}K_\mathrm{a}$ amino skupine.
~ Pri $\mathrm{p}K_\mathrm{a}$ je skupina napol protonirana, skupni naboj pa ni nič. $\mathrm{pI}$ leži med dvema $\mathrm{p}K$.
> $\mathrm{pI}$ je pH brez skupnega naboja; tam molekula v električnem polju obstane.

? V kakšni obliki je glicin pretežno pri $\mathrm{pH}\ 7$?
- $\mathrm{H_3N^+{-}CH_2{-}COOH}$, naboj $+1$.
~ Karboksilna skupina ima $\mathrm{p}K \approx 2{,}3$. Pri $\mathrm{pH}\ 7$, daleč nad tem, je proton že oddala.
+ $\mathrm{H_3N^+{-}CH_2{-}COO^-}$, ion dvojček.
- $\mathrm{H_2N{-}CH_2{-}COOH}$, nenabita molekula.
~ Ta oblika je v vodi zanemarljiva: pri $\mathrm{pH}\ 7$ je karboksilna skupina deprotonirana, amino skupina pa protonirana.
> $\mathrm{pH}\ 7$ je nad $\mathrm{p}K_1 = 2{,}34$ (COOH odda proton) in pod $\mathrm{p}K_2 = 9{,}60$ (amino skupina ga obdrži).

? Kaj neposredno stabilizira α-vijačnico?
- Ionske vezi med stranskimi verigami sosednjih aminokislin.
~ Stranske verige v vijačnici štrlijo navzven. Ionske vezi lahko pomagajo, a niso osnova sekundarne zgradbe.
- Disulfidni mostički med cisteini.
~ Disulfidi utrjujejo terciarno ali kvartarno zgradbo, vijačnica pa nastane tudi brez cisteina.
+ Vodikove vezi med $\mathrm{C{=}O}$ aminokisline $n$ in $\mathrm{N{-}H}$ aminokisline $n+4$ v ogrodju.
> Sekundarno zgradbo držijo vodikove vezi peptidnega ogrodja; v α-vijačnici povezujejo ostanka $n$ in $n+4$.

? Glutamat ima $\mathrm{p}K_1 = 2{,}19$, $\mathrm{p}K_R = 4{,}25$ in $\mathrm{p}K_2 = 9{,}67$. Kolikšen je njegov $\mathrm{pI}$?
- $5{,}37$
~ To je povprečje vseh treh $\mathrm{p}K$. Vzameš le tista dva, ki obdajata nevtralno obliko.
- $5{,}93$
~ To je povprečje $\mathrm{p}K_1$ in $\mathrm{p}K_2$, kot pri glicinu. Glutamat ima kislo stransko verigo, zato nevtralna oblika leži med $\mathrm{p}K_1$ in $\mathrm{p}K_R$.
+ $3{,}22$
> Naboji: $+1$, nad $2{,}19$ $0$, nad $4{,}25$ $-1$. $\mathrm{pI} = \dfrac{2{,}19 + 4{,}25}{2} = 3{,}22$.

? Protein s $\mathrm{pI} = 5{,}0$ nanesemo na gel z $\mathrm{pH} = 8{,}0$ in vklopimo električno polje. Kam potuje?
- Proti katodi ($-$), ker je pozitivno nabit.
~ Pozitiven bi bil pri pH pod $\mathrm{pI}$. Tu je pH višji, zato je protein oddal protone in je negativen.
+ Proti anodi ($+$), ker je negativno nabit.
- Ostane na mestu, ker je nevtralen.
~ Nevtralen je le pri $\mathrm{pH} = \mathrm{pI} = 5{,}0$, ne pri $8{,}0$.
> Pri $\mathrm{pH} > \mathrm{pI}$ prevladajo deprotonirane, negativne skupine, zato protein potuje k pozitivni elektrodi, anodi.

:::simboli
\mathrm{pH} | pH raztopine | \mathrm{pH} = \mathrm{p}K_\mathrm{a} + \log\frac{[\mathrm{A^-}]}{[\mathrm{HA}]} | – | Henderson-Hasselbalchova enačba
\mathrm{pI} | izoelektrična točka | \mathrm{pI} = \frac{\mathrm{p}K_\text{pred} + \mathrm{p}K_\text{za}}{2} | – | pH, pri katerem je povprečni naboj nič
K_\mathrm{a} | konstanta kisline | | mol/L | pKₐ = −log Kₐ
K | konstanta kisline skupine | | mol/L | vsak pK je meja na premici pH
K_\text{pred} | konstanta skupine tik pod nevtralno obliko | | mol/L
K_\text{za} | konstanta skupine tik nad nevtralno obliko | | mol/L
K_1 | konstanta karboksilne skupine | | mol/L | glicin: pK₁ = 2,34
K_2 | konstanta amino skupine | | mol/L | glicin: pK₂ = 9,60
K_R | konstanta skupine v stranski verigi | | mol/L | aspartat: pK_R = 3,65
\alpha | delež deprotonirane oblike | \alpha = \frac{1}{1 + 10^{\mathrm{p}K_\mathrm{a} - \mathrm{pH}}} | – |
z | povprečni naboj molekule | | – | vsota prispevkov skupin
c | skupna koncentracija aminokisline | | mol/L |
:::
