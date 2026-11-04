---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec trdi: »Dva enako težka rotorja motor zavrti enako hitro, masa je pač masa.« Pri gibanju naravnost bi imel prav, pri vrtenju pa ne. Ventilator v prenosniku, motorček za vibracije v telefonu in rotor trdega diska so rotorji, pri katerih šteje, kako daleč od osi je masa, ne le koliko je je. Telefon vrtenje tudi meri: žiroskop v njem zazna, kako hitro ga obračaš. Za opis vrtenja potrebujemo tri nove količine – **navor**, **vztrajnostni moment** in **vrtilno količino** –, ki imajo vsaka svoj par pri gibanju naravnost. Sošolčevo trditev ovržeš, ko vidiš, v čem se para razlikujeta.

## Razlaga

### Kaj ostane enako in kaj je novo

Vrtenje okoli stalne osi je zgrajeno po vzoru gibanja naravnost; vsaka količina ima svoj par. Razlike so tisto, česar se je treba naučiti na novo:

| gibanje naravnost | vrtenje okoli stalne osi | kaj je novo |
|---|---|---|
| pot $x$, hitrost $v$ | kot $\varphi$, kotna hitrost $\omega$ | vse točke imajo isto $\omega$, ne pa iste $v = \omega r$ |
| sila $F$ | navor $M = r_\perp F$ | šteje tudi, kje in v kateri smeri sila prijemlje |
| masa $m$ | vztrajnostni moment $J = \sum m_ir_i^2$ | odvisen od razporeditve mase in izbire osi |
| $F = ma$ | $M = J\alpha$ | |
| $G = mv$ | $\Gamma = J\omega$ | telo lahko z notranjimi silami samo spremeni $J$ |

### Kinematika in navor

**1. Togo telo in vrtenje okoli stalne osi.** Togo telo je idealizacija, pri kateri se razdalje med deli telesa ne spreminjajo. Pri vrtenju okoli stalne osi se vse točke zavrtijo za enak kot $\varphi$, zato imajo enako kotno hitrost $\omega = \mathrm{d}\varphi/\mathrm{d}t$ in enak kotni pospešek $\alpha = \mathrm{d}\omega/\mathrm{d}t$. Točka na razdalji $r$ od osi ima obodno hitrost $v = \omega r$.

**2. Navor.** Navor sile $\vec{F}$, ki prijemlje v točki s krajevnim vektorjem $\vec{r}$ glede na os (ali izbrano točko), je

$$\vec{M} = \vec{r} \times \vec{F}, \qquad M = rF\sin\varphi = r_\perp F.$$

Tu je $\varphi$ kot med $\vec{r}$ in $\vec{F}$, $r_\perp = r\sin\varphi$ pa **ročica**: pravokotna razdalja od osi do nosilke sile. Enota je $\mathrm{N\,m}$ (ne pišemo J, čeprav je enota enaka). Sila, katere nosilka gre skozi os, nima navora. Smer vektorja $\vec{M}$ določa pravilo desne roke: prsti v smeri vrtenja, palec v smeri navora.

### Vztrajnost pri vrtenju

**3. Vztrajnostni moment.** Kinetična energija vrtečega se telesa je vsota prispevkov posameznih delov: $W_k = \sum\tfrac{1}{2}m_iv_i^2 = \tfrac{1}{2}\left(\sum m_ir_i^2\right)\omega^2$. Izraz v oklepaju je **vztrajnostni moment** glede na izbrano os:

$$J = \sum_i m_ir_i^2 \quad\text{oziroma}\quad J = \int r^2\,\mathrm{d}m.$$

Enota je $\mathrm{kg\,m^2}$. Vztrajnostni moment ni odvisen le od mase, ampak tudi od tega, kako daleč od osi je masa razporejena. Nekaj vrednosti za homogena telesa z maso $m$:

| telo | os | $J$ |
|---|---|---|
| tanek obroč, polmer $R$ | skozi središče, pravokotno | $mR^2$ |
| poln valj (kolut), polmer $R$ | geometrijska os | $\tfrac{1}{2}mR^2$ |
| polna krogla, polmer $R$ | skozi središče | $\tfrac{2}{5}mR^2$ |
| tanka palica, dolžina $l$ | skozi središče, pravokotno | $\tfrac{1}{12}ml^2$ |
| tanka palica, dolžina $l$ | skozi krajišče, pravokotno | $\tfrac{1}{3}ml^2$ |

Primer izračuna: za tanko palico z dolžinsko gostoto $\lambda = m/l$ in osjo skozi krajišče je $J = \int_0^l x^2\lambda\,\mathrm{d}x = \lambda l^3/3 = \tfrac13 ml^2$.

**Steinerjev izrek.** Naj ima telo z maso $m$ vztrajnostni moment $J_{ms}$ glede na os skozi masno središče in naj bo druga os vzporedna z njo na razdalji $d$. Potem je vztrajnostni moment glede na drugo os

$$J = J_{ms} + md^2.$$

*Dokaz:* razdalje merimo v ravnini, pravokotni na osi. Naj bo $\vec{r}_i = \vec{d} + \vec{r}_i\,'$, kjer je $\vec{r}_i\,'$ merjen od osi skozi masno središče. Potem je $\sum m_ir_i^2 = md^2 + 2\vec{d}\cdot\sum m_i\vec{r}_i\,' + \sum m_ir_i'^2$; srednji člen je nič, ker je po definiciji masnega središča $\sum m_i\vec{r}_i\,' = 0$. Posledica: med vsemi vzporednimi osmi ima telo najmanjši $J$ okoli osi skozi masno središče.

**4. Osnovni zakon vrtenja.** Naj se togo telo vrti okoli nepremične osi. Potem je vsota navorov zunanjih sil glede na to os enaka

$$\sum M = J\alpha.$$

*Dokaz:* delec $i$ kroži po krogu s polmerom $r_i$, zato tangentno velja $F_{i,t} = m_ia_{i,t} = m_ir_i\alpha$. Pomnožimo z $r_i$ in seštejemo: $\sum r_iF_{i,t} = \left(\sum m_ir_i^2\right)\alpha = J\alpha$. Notranje sile delujejo v parih, nasprotno enakih in na isti nosilki, zato je vsota njihovih navorov nič in na levi ostanejo le navori zunanjih sil.

Primerjava z gibanjem naravnost: sila $\leftrightarrow$ navor, masa $\leftrightarrow$ vztrajnostni moment, pospešek $\leftrightarrow$ kotni pospešek.

:::premisli
Kolesi imata enako maso in polmer: pri prvem je vsa masa v tankem obroču, drugo je poln kolut. Katero se pri enakem navoru hitreje zavrti?
---
Kolut. Obroč ima $J = mR^2$, kolut le $\tfrac{1}{2}mR^2$, ker je del njegove mase blizu osi. Pri enakem navoru ima kolut dvakrat večji kotni pospešek, čeprav sta kolesi enako težki.
:::

### Energija in vrtilna količina

**5. Energija in delo pri vrtenju.** Kinetična energija vrtenja je $W_k = \tfrac{1}{2}J\omega^2$. Ko se telo zasuče za $\mathrm{d}\varphi$, se prijemališče sile premakne za $r\,\mathrm{d}\varphi$ in sila opravi delo $F_tr\,\mathrm{d}\varphi = M\,\mathrm{d}\varphi$. Zato je delo navora $A = \int M\,\mathrm{d}\varphi$ (pri stalnem navoru $A = M\varphi$), moč $P = M\omega$, iz $M = J\,\mathrm{d}\omega/\mathrm{d}t$ pa sledi $M\,\mathrm{d}\varphi = J\omega\,\mathrm{d}\omega$ (ker je $\mathrm{d}\varphi/\mathrm{d}t = \omega$) in po integraciji $A = \Delta\left(\tfrac12 J\omega^2\right)$. Telo, ki se **kotali** brez spodrsavanja (stična točka miruje), ima obe vrsti kinetične energije:

$$W_k = \tfrac{1}{2}mv_{ms}^2 + \tfrac{1}{2}J_{ms}\omega^2, \qquad v_{ms} = \omega R.$$

Izpeljava: v danem trenutku se telo vrti okoli stične točke, za katero je po Steinerjevem izreku $J = J_{ms} + mR^2$; zato je $W_k = \tfrac12(J_{ms} + mR^2)\omega^2$, z $\omega R = v_{ms}$ pa dobimo zgornji izraz.

**6. Vrtilna količina.** Za točkasto telo je vrtilna količina $\vec{\Gamma} = \vec{r} \times m\vec{v}$, za togo telo, ki se vrti okoli simetrijske osi, pa $\vec{\Gamma} = J\vec{\omega}$. Enota je $\mathrm{kg\,m^2/s}$. Splošni zakon vrtenja je

$$\sum\vec{M} = \frac{\mathrm{d}\vec{\Gamma}}{\mathrm{d}t}.$$

*Dokaz za delec:* $\dot{\vec{\Gamma}} = \dot{\vec{r}}\times m\vec{v} + \vec{r}\times m\dot{\vec{v}} = \vec{v}\times m\vec{v} + \vec{r}\times\vec{F} = \vec{M}$. Za sistem delcev seštejemo; navori notranjih sil se v parih odštejejo, zato je $\vec{M}$ vsota navorov zunanjih sil (glede na nepremično točko ali masno središče).

**Izrek o ohranitvi vrtilne količine.** Če je vsota navorov zunanjih sil enaka nič, je vrtilna količina sistema stalna. Za telo, ki okoli stalne osi spremeni vztrajnostni moment, velja $J_1\omega_1 = J_2\omega_2$. Telo, ki zmanjša vztrajnostni moment (drsalka pritegne roke), se zavrti hitreje.

:::premisli
Mirno sediš na vrtljivem stolu in nad glavo držiš kolo s kolesa. Kolo zavrtiš v smeri urinega kazalca (gledano od zgoraj). Kaj naredi stol?
---
Zavrti se v nasprotno smer. Med teboj in kolesom delujejo le notranje sile, zato skupna vrtilna količina ostane nič: vrtilna količina kolesa v eno smer mora biti uravnotežena z enako veliko vrtilno količino tebe in stola v drugo.
:::

### Ravnovesje in postopek

**7. Ravnovesje togega telesa.** Togo telo miruje, če sta izpolnjena oba pogoja:

$$\sum\vec{F} = 0, \qquad \sum\vec{M} = 0.$$

Navore lahko računamo glede na katero koli točko: če je $\sum\vec{F} = 0$, je vsota navorov glede na točko $\vec{a}$ enaka $\sum(\vec{r}_i - \vec{a})\times\vec{F}_i = \sum\vec{r}_i\times\vec{F}_i - \vec{a}\times\sum\vec{F}_i = \sum\vec{r}_i\times\vec{F}_i$, torej neodvisna od izbire točke. Najbolje je izbrati točko, skozi katero gre neznana sila, ker ta potem nima navora.

**8. Postopek.** (1) Nariši telo in vse sile z njihovimi prijemališči. (2) Izberi os in pozitivno smer vrtenja. (3) Za vsako silo določi ročico in predznak navora. (4) Za telesa, ki se gibljejo naravnost, zapiši $\sum F = ma$, za vrteča se $\sum M = J\alpha$. (5) Poveži enačbe s kinematično vezjo, na primer $a = \alpha R$ za vrv, ki ne drsi po kolutu.

## Rešeni primeri

### Primer 1 (lažji)

Matico privijamo z vijačnim ključem, dolgim $25\,\mathrm{cm}$. Na konec ključa delujemo s silo $80\,\mathrm{N}$ pod kotom $60^\circ$ glede na ročaj. Kolikšen je navor na matico?

**Podatki:** $r = 25\,\mathrm{cm} = 0{,}25\,\mathrm{m}$, $F = 80\,\mathrm{N}$, $\varphi = 60^\circ$ (med ročajem in silo)
**Iščemo:** navor $M$

:::formula
$M = rF\sin\varphi$
:::

**Rešitev:**

1. Šteje le pravokotna razdalja od osi do nosilke sile, zato je ročica $r_\perp = r\sin\varphi = 0{,}25\,\mathrm{m} \cdot \sin 60^\circ \approx 0{,}217\,\mathrm{m}$.
2. Navor: $M = r_\perp F = 0{,}217\,\mathrm{m} \cdot 80\,\mathrm{N} \approx 17{,}3\,\mathrm{N\,m}$.
3. Pri pravokotni sili bi bil navor $0{,}25 \cdot 80\,\mathrm{N\,m} = 20\,\mathrm{N\,m}$, kar je največ, kar lahko s to silo dosežemo.
4. Odgovor: navor na matico je približno $17{,}3\,\mathrm{N\,m}$.

### Primer 2

Na kolut (poln homogen valj) z maso $3{,}0\,\mathrm{kg}$ in polmerom $10\,\mathrm{cm}$, ki se lahko brez trenja vrti okoli vodoravne osi, je navita lahka vrvica. Na njej visi utež z maso $0{,}50\,\mathrm{kg}$. Utež spustimo iz mirovanja. Kolikšen je njen pospešek, kolikšna je sila vrvice in kolikšno hitrost ima utež, ko se spusti za $1{,}0\,\mathrm{m}$? Vzemi $g = 9{,}81\,\mathrm{m/s^2}$.

**Podatki:** $M_k = 3{,}0\,\mathrm{kg}$, $R = 10\,\mathrm{cm} = 0{,}10\,\mathrm{m}$, $J = \tfrac{1}{2}M_kR^2$, $m = 0{,}50\,\mathrm{kg}$, $v_0 = 0$, $h = 1{,}0\,\mathrm{m}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** pospešek $a$, silo vrvice $F_v$, hitrost $v$ po $1{,}0\,\mathrm{m}$

:::formula
Utež: $mg - F_v = ma$. Kolut: $F_vR = J\alpha$. Vez: $a = \alpha R$. Sledi $a = \dfrac{mg}{m + J/R^2}$; $v^2 = 2ah$.
:::

**Rešitev:**

1. Vztrajnostni moment koluta potrebujemo v enačbi za kolut: $J = \tfrac{1}{2} \cdot 3{,}0\,\mathrm{kg} \cdot (0{,}10\,\mathrm{m})^2 = 0{,}015\,\mathrm{kg\,m^2}$, torej $J/R^2 = 1{,}5\,\mathrm{kg}$.
2. Iz enačbe za kolut in vezi: $F_v = J\alpha/R = (J/R^2)\,a$. Vstavimo v enačbo za utež: $mg = (m + J/R^2)\,a$.
3. Pospešek: $a = \dfrac{0{,}50 \cdot 9{,}81}{0{,}50 + 1{,}5}\,\mathrm{m/s^2} \approx 2{,}45\,\mathrm{m/s^2}$.
4. Sila vrvice iz enačbe za utež: $F_v = m(g - a) = 0{,}50\,\mathrm{kg} \cdot (9{,}81 - 2{,}45)\,\mathrm{m/s^2} \approx 3{,}68\,\mathrm{N}$, kar je manj od teže uteži ($4{,}91\,\mathrm{N}$).
5. Pospešek je stalen, zato je hitrost po $1{,}0\,\mathrm{m}$: $v = \sqrt{2ah} = \sqrt{2 \cdot 2{,}45 \cdot 1{,}0}\,\mathrm{m/s} \approx 2{,}21\,\mathrm{m/s}$.
6. Preizkus z energijo: $mgh = 4{,}905\,\mathrm{J}$; $\tfrac{1}{2}mv^2 + \tfrac{1}{2}J(v/R)^2 \approx 1{,}23\,\mathrm{J} + 3{,}68\,\mathrm{J} = 4{,}91\,\mathrm{J}$. ✓
7. Odgovor: utež pada s pospeškom približno $2{,}45\,\mathrm{m/s^2}$, sila vrvice je približno $3{,}68\,\mathrm{N}$, po $1{,}0\,\mathrm{m}$ pa ima utež hitrost približno $2{,}21\,\mathrm{m/s}$.

### Primer 3 (težji)

Študent sedi na vrtljivem stolu z utežema v iztegnjenih rokah. Skupni vztrajnostni moment je $6{,}0\,\mathrm{kg\,m^2}$, stol se vrti s $0{,}50$ obrata na sekundo. Študent pritegne roke k telesu, s čimer se vztrajnostni moment zmanjša na $2{,}0\,\mathrm{kg\,m^2}$. Kolikšna je nova frekvenca vrtenja? Kako se spremeni kinetična energija in od kod razlika? Na kolikšno vrednost bi moral študent zmanjšati vztrajnostni moment, da bi se vrtel z $2{,}0$ obrata na sekundo, in koliko dela bi pri tem opravil? Trenje v ležaju zanemari.

**Podatki:** $J_1 = 6{,}0\,\mathrm{kg\,m^2}$, $\nu_1 = 0{,}50\,\mathrm{s^{-1}}$, $J_2 = 2{,}0\,\mathrm{kg\,m^2}$, $\nu_3 = 2{,}0\,\mathrm{s^{-1}}$, zunanjih navorov ni
**Iščemo:** $\nu_2$, $W_{k1}$, $W_{k2}$ in delo študenta; $J_3$ za $\nu_3$ in delo za to spremembo

:::formula
$J_1\omega_1 = J_2\omega_2$, $\omega = 2\pi\nu$, $W_k = \tfrac{1}{2}J\omega^2 = \dfrac{\Gamma^2}{2J}$, $A = \dfrac{\Gamma^2}{2}\left(\dfrac{1}{J_3} - \dfrac{1}{J_1}\right)$
:::

**Rešitev:**

1. Teža in sila ležaja imata nosilke vzdolž osi ali skozi njo, zato nimata navora okoli navpične osi. Vrtilna količina se ohranja.
2. $\nu_2 = \nu_1 J_1/J_2 = 0{,}50\,\mathrm{s^{-1}} \cdot 6{,}0/2{,}0 = 1{,}5\,\mathrm{s^{-1}}$.
3. Za energijo potrebujemo kotni hitrosti v $\mathrm{s^{-1}}$, ne obratov na sekundo: $\omega_1 = 2\pi \cdot 0{,}50\,\mathrm{s^{-1}} = \pi\,\mathrm{s^{-1}} \approx 3{,}14\,\mathrm{s^{-1}}$, $\omega_2 = 3\pi\,\mathrm{s^{-1}} \approx 9{,}42\,\mathrm{s^{-1}}$.
4. $W_{k1} = \tfrac{1}{2} \cdot 6{,}0 \cdot 3{,}14^2\,\mathrm{J} \approx 29{,}6\,\mathrm{J}$, $W_{k2} = \tfrac{1}{2} \cdot 2{,}0 \cdot 9{,}42^2\,\mathrm{J} \approx 88{,}8\,\mathrm{J}$.
5. Kinetična energija se je povečala za približno $59{,}2\,\mathrm{J}$. Ker je $W_k = \Gamma^2/(2J)$ in se $\Gamma$ ohranja, se energija poveča za faktor $J_1/J_2 = 3$.
6. Obratno vprašanje: iz $J_1\nu_1 = J_3\nu_3$ je $J_3 = 6{,}0 \cdot 0{,}50/2{,}0\,\mathrm{kg\,m^2} = 1{,}5\,\mathrm{kg\,m^2}$.
7. Delo mišic je sprememba kinetične energije: $\Gamma = J_1\omega_1 = 6{,}0 \cdot \pi\,\mathrm{kg\,m^2/s} \approx 18{,}85\,\mathrm{kg\,m^2/s}$, $W_{k3} = \Gamma^2/(2J_3) = 18{,}85^2/3{,}0\,\mathrm{J} \approx 118{,}4\,\mathrm{J}$, zato $A = 118{,}4\,\mathrm{J} - 29{,}6\,\mathrm{J} \approx 88{,}8\,\mathrm{J}$. Delo raste kot $1/J_3$, zato vsako nadaljnje zmanjšanje $J$ stane več.
8. Odgovor: stol se vrti s $1{,}5$ obrata na sekundo, kinetična energija naraste s $29{,}6\,\mathrm{J}$ na $88{,}8\,\mathrm{J}$; razliko, približno $59\,\mathrm{J}$, opravijo študentove mišice, ko vlečejo uteži proti osi. Za $2{,}0$ obrata na sekundo bi moral $J$ zmanjšati na $1{,}5\,\mathrm{kg\,m^2}$ in opraviti približno $88{,}8\,\mathrm{J}$ dela.

### Primer 4 – zdaj ti

Za snemanje izdelka v $360^\circ$ položiš telefon na sredino vrtljive ploščadi. Ploščad je poln homogen kolut z maso $0{,}80\,\mathrm{kg}$ in polmerom $0{,}15\,\mathrm{m}$, telefon ima glede na os vztrajnostni moment $2{,}0 \cdot 10^{-4}\,\mathrm{kg\,m^2}$. Motor naj ploščad iz mirovanja v $2{,}0\,\mathrm{s}$ enakomerno zavrti do $0{,}25$ obrata na sekundo. Kolikšen navor mora dajati motor? Trenje zanemari.

**Podatki:** $m_p = 0{,}80\,\mathrm{kg}$, $R = 0{,}15\,\mathrm{m}$, $J_t = 2{,}0 \cdot 10^{-4}\,\mathrm{kg\,m^2}$, $\omega_0 = 0$, $t = 2{,}0\,\mathrm{s}$, $\nu = 0{,}25\,\mathrm{s^{-1}}$
**Iščemo:** navor motorja $M$

:::formula
$J_p = \tfrac{1}{2}m_pR^2$, $J = J_p + J_t$, $\omega = 2\pi\nu$, $\alpha = \omega/t$, $M = J\alpha$
:::

**Rešitev:**

1. Ploščad je poln kolut: $J_p = 0{,}5 \cdot 0{,}80 \cdot 0{,}15^2\,\mathrm{kg\,m^2} = 0{,}0090\,\mathrm{kg\,m^2}$.
2. Vztrajnostna momenta okoli iste osi se seštejeta: $J = 0{,}0090\,\mathrm{kg\,m^2} + 0{,}00020\,\mathrm{kg\,m^2} = 0{,}0092\,\mathrm{kg\,m^2}$.
3. Zakon vrtenja zahteva kotno hitrost v $\mathrm{s^{-1}}$: $\omega = 2\pi \cdot 0{,}25\,\mathrm{s^{-1}} \approx 1{,}57\,\mathrm{s^{-1}}$.
4. Zdaj ti: izračunaj kotni pospešek ploščadi in navor motorja.

:::premisli
Kolikšna sta kotni pospešek in navor?
---
$\alpha = \omega/t = 1{,}57\,\mathrm{s^{-1}}/2{,}0\,\mathrm{s} \approx 0{,}785\,\mathrm{s^{-2}}$, $M = J\alpha = 0{,}0092\,\mathrm{kg\,m^2} \cdot 0{,}785\,\mathrm{s^{-2}} \approx 7{,}2 \cdot 10^{-3}\,\mathrm{N\,m}$. Telefon prispeva le okoli $2\,\%$ vztrajnostnega momenta, ker je blizu osi.
:::

## Pogoste napake

- **Navor kot $rF$ brez kota.** Pomembna je pravokotna razdalja do nosilke sile. Sila vzdolž ročaja ključa nima navora.
- **Vztrajnostni moment kot lastnost telesa.** $J$ je odvisen od izbire osi. Palica ima okoli krajišča štirikrat večji $J$ kot okoli središča.
- **Pozabljen vztrajnostni moment koluta.** Pri uteži na vrvici, navito na kolut, pospešek ni $g$ in sila vrvice ni $mg$; del energije gre v vrtenje koluta.
- **Kotaljenje brez energije vrtenja.** Pri kotaljenju je $W_k = \tfrac{1}{2}mv^2 + \tfrac{1}{2}J\omega^2$, zato se valj po klancu spusti počasneje kot klada, ki drsi brez trenja.
- **Ohranitev kinetične energije namesto vrtilne količine.** Ko se $J$ spremeni zaradi notranjih sil, se ohranja $\Gamma = J\omega$, kinetična energija pa se spremeni.
- **Obrati in radiani.** V $W_k = \tfrac{1}{2}J\omega^2$ in $v = \omega R$ vstavi $\omega$ v $\mathrm{s^{-1}}$ (rad/s), ne frekvence v obratih na sekundo.

## Povzetek

- Navor $\vec{M} = \vec{r}\times\vec{F}$, $M = r_\perp F$; enota $\mathrm{N\,m}$.
- Vztrajnostni moment $J = \sum m_ir_i^2 = \int r^2\,\mathrm{d}m$; obroč $mR^2$, valj $\tfrac{1}{2}mR^2$, krogla $\tfrac{2}{5}mR^2$, palica $\tfrac{1}{12}ml^2$; Steiner $J = J_{ms} + md^2$.
- Zakon vrtenja: $\sum M = J\alpha$, splošno $\sum\vec{M} = \mathrm{d}\vec{\Gamma}/\mathrm{d}t$.
- Energija vrtenja $\tfrac{1}{2}J\omega^2$, delo $M\varphi$, moč $M\omega$; kotaljenje: $\tfrac{1}{2}mv^2 + \tfrac{1}{2}J\omega^2$.
- Vrtilna količina $\Gamma = J\omega$ se brez zunanjih navorov ohranja: $J_1\omega_1 = J_2\omega_2$.
- Ravnovesje: $\sum\vec{F} = 0$ in $\sum\vec{M} = 0$.

## Za izpit

Znati moraš povedati:

- definicije navora $\vec{M} = \vec{r}\times\vec{F}$, vztrajnostnega momenta $J = \int r^2\,\mathrm{d}m$ in vrtilne količine $\vec{\Gamma} = \vec{r}\times m\vec{v}$ z enotami;
- izpeljavo $\sum M = J\alpha$ za togo telo okoli nepremične osi in zakaj notranji navori odpadejo;
- Steinerjev izrek s pogoji in dokazom;
- zakon $\sum\vec{M} = \mathrm{d}\vec{\Gamma}/\mathrm{d}t$ z dokazom in izrek o ohranitvi vrtilne količine s pogojem;
- izpeljavo $A = \int M\,\mathrm{d}\varphi$, $P = M\omega$ in kinetične energije kotaljenja.

### Naloga 1

Klada z maso $m_1 = 2{,}0\,\mathrm{kg}$ leži na vodoravni mizi (koeficient trenja $k_\mathrm{tr} = 0{,}20$). Z lahko vrvico, ki teče čez škripec na robu mize, je povezana z utežjo $m_2 = 1{,}5\,\mathrm{kg}$, ki visi navpično. Škripec je poln homogen valj z maso $1{,}0\,\mathrm{kg}$ in polmerom $0{,}10\,\mathrm{m}$, ležaj je brez trenja, vrvica po škripcu ne drsi. Sistem spustimo iz mirovanja. Izračunaj pospešek, sili v obeh delih vrvice in hitrost uteži, ko se spusti za $0{,}80\,\mathrm{m}$; rezultat preveri z energijo. $g = 9{,}81\,\mathrm{m/s^2}$.

**Rešitev:**

1. Škripec: $J = \tfrac12 \cdot 1{,}0 \cdot 0{,}10^2\,\mathrm{kg\,m^2} = 0{,}0050\,\mathrm{kg\,m^2}$, torej $J/R^2 = 0{,}50\,\mathrm{kg}$.
2. Enačbe: utež $m_2g - F_2 = m_2a$; klada $F_1 - k_\mathrm{tr}m_1g = m_1a$; škripec $(F_2 - F_1)R = J\alpha$; vez $a = \alpha R$, zato $F_2 - F_1 = (J/R^2)\,a$. Sili v vrvici sta različni, ker mora razlika navorov pospeševati škripec.
3. Seštejemo vse tri enačbe: $m_2g - k_\mathrm{tr}m_1g = (m_1 + m_2 + J/R^2)\,a$.
4. $a = \dfrac{1{,}5 \cdot 9{,}81 - 0{,}20 \cdot 2{,}0 \cdot 9{,}81}{2{,}0 + 1{,}5 + 0{,}50}\,\mathrm{m/s^2} = \dfrac{10{,}791}{4{,}0}\,\mathrm{m/s^2} \approx 2{,}70\,\mathrm{m/s^2}$.
5. $F_2 = m_2(g - a) = 1{,}5 \cdot (9{,}81 - 2{,}698)\,\mathrm{N} \approx 10{,}67\,\mathrm{N}$; $F_1 = m_1a + k_\mathrm{tr}m_1g = 2{,}0 \cdot 2{,}698\,\mathrm{N} + 3{,}924\,\mathrm{N} \approx 9{,}32\,\mathrm{N}$. Preizkus: $F_2 - F_1 \approx 1{,}35\,\mathrm{N} = 0{,}50\,\mathrm{kg} \cdot 2{,}698\,\mathrm{m/s^2}$. ✓
6. Hitrost: $v = \sqrt{2ah} = \sqrt{2 \cdot 2{,}698 \cdot 0{,}80}\,\mathrm{m/s} \approx 2{,}08\,\mathrm{m/s}$.
7. Energija: $m_2gh - k_\mathrm{tr}m_1gh = 10{,}791 \cdot 0{,}80\,\mathrm{J} \approx 8{,}63\,\mathrm{J}$ in $\tfrac12(m_1 + m_2 + J/R^2)v^2 = \tfrac12 \cdot 4{,}0 \cdot 4{,}316\,\mathrm{J} \approx 8{,}63\,\mathrm{J}$. ✓
8. Odgovor: $a \approx 2{,}70\,\mathrm{m/s^2}$, sila v navpičnem delu vrvice je $10{,}7\,\mathrm{N}$, v vodoravnem $9{,}32\,\mathrm{N}$, hitrost uteži po $0{,}80\,\mathrm{m}$ pa $2{,}08\,\mathrm{m/s}$.

### Naloga 2

Natančno navedi in dokaži Steinerjev izrek. Z integralom izračunaj vztrajnostni moment tanke palice okoli osi skozi središče, pravokotne na palico, in s Steinerjevim izrekom še okoli osi skozi krajišče. Utemelji, ali ima palica okoli kakšne vzporedne osi manjši vztrajnostni moment kot okoli osi skozi središče.

**Rešitev:**

1. Izrek: naj ima telo z maso $m$ vztrajnostni moment $J_{ms}$ okoli osi skozi masno središče; za vzporedno os na razdalji $d$ je $J = J_{ms} + md^2$.
2. Dokaz: v ravnini, pravokotni na osi, je $\vec{r}_i = \vec{d} + \vec{r}_i\,'$, zato $r_i^2 = d^2 + 2\vec{d}\cdot\vec{r}_i\,' + r_i'^2$.
3. Pomnožimo z $m_i$ in seštejemo: $J = md^2 + 2\vec{d}\cdot\sum m_i\vec{r}_i\,' + J_{ms}$; srednji člen je nič, ker je masno središče izhodišče za $\vec{r}_i\,'$.
4. Palica okoli središča: $J_{ms} = \int_{-l/2}^{l/2} x^2\frac{m}{l}\,\mathrm{d}x = \frac{m}{l}\cdot\frac{2}{3}\left(\frac{l}{2}\right)^3 = \tfrac{1}{12}ml^2$.
5. Okoli krajišča: $d = l/2$, $J = \tfrac{1}{12}ml^2 + \tfrac14 ml^2 = \tfrac13 ml^2$.
6. Ker je $md^2 \geq 0$ in je enak nič le pri $d = 0$, je $J_{ms}$ najmanjši med vsemi vzporednimi osmi; manjšega ni.

### Naloga 3

Izpelji hitrost, ki jo ima telo z maso $m$, polmerom $R$ in vztrajnostnim momentom $J_{ms}$ na dnu klanca višine $h$, če se iz mirovanja skotali brez spodrsavanja. Utemelji, ali je vrstni red polne krogle, polnega valja in obroča odvisen od njihove mase in polmera, in izračunaj hitrosti za $h = 0{,}50\,\mathrm{m}$.

**Rešitev:**

1. Pri kotaljenju brez spodrsavanja stična točka miruje, zato sila lepenja ne opravlja dela in se mehanska energija ohranja: $mgh = \tfrac12 mv^2 + \tfrac12 J_{ms}\omega^2$.
2. Z $\omega = v/R$: $mgh = \tfrac12 mv^2\left(1 + \dfrac{J_{ms}}{mR^2}\right)$, torej $v = \sqrt{\dfrac{2gh}{1 + J_{ms}/(mR^2)}}$.
3. Razmerje $J_{ms}/(mR^2)$ je odvisno le od oblike: krogla $2/5$, valj $1/2$, obroč $1$. Masa in polmer se pokrajšata, zato vrstni red od njiju ni odvisen.
4. Pri $h = 0{,}50\,\mathrm{m}$ ($2gh = 9{,}81\,\mathrm{m^2/s^2}$): krogla $v = \sqrt{9{,}81/1{,}4}\,\mathrm{m/s} \approx 2{,}65\,\mathrm{m/s}$, valj $\sqrt{9{,}81/1{,}5}\,\mathrm{m/s} \approx 2{,}56\,\mathrm{m/s}$, obroč $\sqrt{9{,}81/2}\,\mathrm{m/s} \approx 2{,}21\,\mathrm{m/s}$.
5. Odgovor: najhitrejša je krogla, nato valj, nato obroč, ne glede na maso in polmer.

## Drugače: Na sliki

Vrata gledamo od zgoraj. Tečaji so os, sila deluje na kljuko:

```
  os (tečaji)
   O=========================[kljuka]
   |<------------- r -------------->|
                                    ^
                                    | F (pravokotno: največji navor)
```

Če silo nagnemo proti tečajem, se ročica (pravokotna razdalja od osi do nosilke sile) skrajša in vrata se odpirajo težje. Če pritisnemo ob tečajih, je ročica skoraj nič in vrata se ne premaknejo.

Vztrajnostni moment si predstavljaj z dvema enako težkima kolesoma: pri prvem je masa v obroču daleč od osi, pri drugem zbrana v pestu. Prvo je težje zavrteti in težje ustaviti, ker vsak del mase prispeva sorazmerno s $r^2$.

Tabela analogij: $x \leftrightarrow \varphi$, $v \leftrightarrow \omega$, $a \leftrightarrow \alpha$, $m \leftrightarrow J$, $F \leftrightarrow M$, $G = mv \leftrightarrow \Gamma = J\omega$, $\tfrac{1}{2}mv^2 \leftrightarrow \tfrac{1}{2}J\omega^2$.

## Drugače: Uporaba v stroki

**Laboratorijska centrifuga.** Pri $12\,000$ obratih na minuto je $\omega \approx 1257\,\mathrm{s^{-1}}$; na polmeru $8{,}0\,\mathrm{cm}$ je centripetalni pospešek $\omega^2r \approx 1{,}26 \cdot 10^5\,\mathrm{m/s^2}$, okoli $12\,900\,g$ (relativna centrifugalna sila). Rotor z $J = 0{,}020\,\mathrm{kg\,m^2}$ ima tedaj $\tfrac12 J\omega^2 \approx 16\,\mathrm{kJ}$ energije, zato je pokrov med vrtenjem zaklenjen. Epruvete morajo biti uravnotežene: pri neuravnoteženem rotorju masno središče ni na osi, zato ležaji čutijo veliko silo, ki se vrti skupaj z rotorjem.

**Vztrajniki.** Vztrajnik shrani energijo $\tfrac12 J\omega^2$: v batnih strojih zgladi sunkovit navor, v napravah za brezprekinitveno napajanje pa nekaj sekund nadomešča omrežje. Ker vsak del mase prispeva k $J$ sorazmerno s kvadratom razdalje od osi, je masa zbrana na obodu.

**Rotacijski spektri molekul.** Dvoatomna molekula, na primer $\mathrm{CO}$, se vrti okoli osi, pravokotne na vez, z vztrajnostnim momentom $J = \mu_r r_0^2$ (reducirana masa $\mu_r$, dolžina vezi $r_0$). Iz razmika črt v mikrovalovnem spektru določimo $J$ in s tem dolžino vezi; energija vrtenja prispeva tudi k toplotni kapaciteti dvoatomnih plinov.

## Drugače: Korak za korakom s številkami

Kolikšen je vztrajnostni moment palice z maso $1{,}2\,\mathrm{kg}$ in dolžino $1{,}0\,\mathrm{m}$ okoli osi skozi krajišče?

1. **Okoli središča:** $J_{ms} = \tfrac{1}{12}ml^2 = \tfrac{1}{12} \cdot 1{,}2 \cdot 1{,}0^2\,\mathrm{kg\,m^2} = 0{,}10\,\mathrm{kg\,m^2}$.
2. **Razdalja med osema:** $d = l/2 = 0{,}50\,\mathrm{m}$.
3. **Steinerjev izrek:** $J = J_{ms} + md^2 = 0{,}10 + 1{,}2 \cdot 0{,}25 = 0{,}10 + 0{,}30 = 0{,}40\,\mathrm{kg\,m^2}$.
4. **Preizkus s formulo:** $\tfrac{1}{3}ml^2 = 0{,}40\,\mathrm{kg\,m^2}$. ✓
5. **Pomen:** isto palico je okoli krajišča štirikrat težje pospešiti kot okoli središča, ker je masa v povprečju dlje od osi.

## Drugače: Bolj natančno

**Vztrajnostni moment valja z integralom.** Za poln valj razdelimo telo na tanke cilindrične lupine s polmerom $r$ in maso $\mathrm{d}m = \frac{m}{\pi R^2}2\pi r\,\mathrm{d}r$; integral $\int_0^R r^2\,\mathrm{d}m$ da $\tfrac{1}{2}mR^2$.

**Tenzor vztrajnostnega momenta.** V splošnem $\vec{\Gamma}$ ni vzporeden z $\vec{\omega}$: velja $\vec{\Gamma} = \underline{J}\,\vec{\omega}$, kjer je $\underline{J}$ simetrična matrika $3\times 3$. V koordinatnem sistemu glavnih osi je matrika diagonalna. Če se telo vrti okoli glavne osi, je $\vec{\Gamma} \parallel \vec{\omega}$; sicer ležaji čutijo navor, kar se kaže kot opletanje neuravnoteženih koles.

## Preveri se

? Na kljuko vrat, $0{,}50\,\mathrm{m}$ od tečajev, delujemo s silo $20\,\mathrm{N}$ pravokotno na vrata. Kolikšen je navor?
- $40\,\mathrm{N\,m}$
~ Silo si delil z ročico: $20/0{,}50 = 40$. Navor je zmnožek ročice in sile.
+ $10\,\mathrm{N\,m}$
- $5{,}0\,\mathrm{N\,m}$
~ Pomnožil si še z $\tfrac{1}{2}$, kot pri kinetični energiji. Pri pravokotni sili je navor kar $rF$.
> $M = rF = 0{,}50\,\mathrm{m} \cdot 20\,\mathrm{N} = 10\,\mathrm{N\,m}$. $40\,\mathrm{N\,m}$ dobiš, če silo deliš z ročico namesto množiš.

? Kolikšen je vztrajnostni moment tanke palice z maso $m$ in dolžino $l$ glede na os skozi krajišče, pravokotno na palico?
- $\tfrac{1}{12}ml^2$
~ To velja za os skozi središče. Okoli krajišča je masa v povprečju dlje od osi, zato je $J$ večji (Steinerjev izrek).
- $ml^2$
~ Tako bi bilo, če bi bila vsa masa na drugem koncu, na razdalji $l$. Palica ima maso razporejeno od $0$ do $l$.
+ $\tfrac{1}{3}ml^2$
> Po Steinerjevem izreku je $J = \tfrac{1}{12}ml^2 + m(l/2)^2 = \tfrac{1}{3}ml^2$. $\tfrac{1}{12}ml^2$ velja za os skozi središče.

? S klanca hkrati spustimo poln valj, polno kroglo in tanek obroč. Katero telo se, če se kotalijo brez spodrsavanja, prvo pripelje na dno?
+ Krogla.
- Obroč.
~ Obroč ima vso maso daleč od osi ($J = mR^2$), zato gre pri njem največji delež energije v vrtenje in je najpočasnejši.
- Vsa hkrati.
~ To velja za telesa, ki drsijo brez trenja. Pri kotaljenju je del energije v vrtenju, ta delež pa je odvisen od oblike telesa.
> Pri kotaljenju je $v^2 = 2gh/(1 + J/(mR^2))$. Krogla ima najmanjše razmerje $J/(mR^2) = 2/5$, zato je najhitrejša; obroč z razmerjem $1$ je najpočasnejši.

? Drsalka med pirueto pritegne roke k telesu. Kaj se zgodi z njeno vrtilno količino in kinetično energijo?
- Vrtilna količina se poveča, kinetična energija ostane enaka.
~ Notranje sile vrtilne količine ne spremenijo, ta se brez zunanjih navorov ohranja. Spremeni se kinetična energija.
+ Vrtilna količina ostane enaka, kinetična energija se poveča.
- Obe ostaneta enaki.
~ Vrtilna količina se ohranja, kinetična energija pa ne: drsalka z mišicami opravi delo, ko pritegne roke.
> Zunanjih navorov ni, zato se $\Gamma = J\omega$ ohranja. Ker je $W_k = \Gamma^2/(2J)$ in se $J$ zmanjša, se kinetična energija poveča; razliko opravijo mišice.

? Rotor ventilatorja v prenosniku ima vztrajnostni moment $2{,}0 \cdot 10^{-6}\,\mathrm{kg\,m^2}$. Motor ga iz mirovanja v $0{,}50\,\mathrm{s}$ enakomerno zavrti do kotne hitrosti $400\,\mathrm{s^{-1}}$. Kolikšen je navor motorja?
- $4{,}0 \cdot 10^{-4}\,\mathrm{N\,m}$
~ Kotno hitrost si s časom pomnožil, namesto da bi jo delil: $\alpha = \omega/t$.
- $8{,}0 \cdot 10^{-4}\,\mathrm{N\,m}$
~ To je vrtilna količina $J\omega$ (v $\mathrm{kg\,m^2/s}$), ne navor. Navor je sprememba vrtilne količine na enoto časa.
+ $1{,}6 \cdot 10^{-3}\,\mathrm{N\,m}$
> $\alpha = \omega/t = 400\,\mathrm{s^{-1}}/0{,}50\,\mathrm{s} = 800\,\mathrm{s^{-2}}$, zato $M = J\alpha = 2{,}0 \cdot 10^{-6}\,\mathrm{kg\,m^2} \cdot 800\,\mathrm{s^{-2}} = 1{,}6 \cdot 10^{-3}\,\mathrm{N\,m}$.

:::simboli
\vec{M} | vektor navora | \vec{M} = \vec{r} \times \vec{F} | N\,m
M | navor | M = rF\sin\varphi = r_\perp F | N\,m
\vec{r} | krajevni vektor prijemališča sile | | m | merjen od osi
r | razdalja prijemališča sile od osi | | m
r_\perp | ročica | r_\perp = r\sin\varphi | m
\vec{F} | vektor sile | | N
F | sila | | N
\varphi | kot med krajevnim vektorjem in silo | | rad | tudi kot zasuka pri vrtenju
J | vztrajnostni moment | J = \sum_i m_ir_i^2 | kg\,m^2 | odvisen od razporeditve mase in osi
J_{ms} | vztrajnostni moment glede na os skozi masno središče | | kg\,m^2
d | razdalja med osjo skozi masno središče in vzporedno osjo | | m | Steinerjev izrek
A | delo navora (mišic) | A = \int M\,\mathrm{d}\varphi | J
J_1, J_2 | vztrajnostna momenta pred spremembo in po njej | | kg\,m^2
J_p | vztrajnostni moment ploščadi | J_p = \tfrac{1}{2}m_pR^2 | kg\,m^2
J_t | vztrajnostni moment telefona | | kg\,m^2
i | zaporedna številka delca telesa | | –
m_i | masa i-tega delca | | kg
r_i | razdalja i-tega delca od osi | | m
m | masa telesa (uteži) | | kg
m_p | masa ploščadi | | kg
M_k | masa koluta | | kg
\alpha | kotni pospešek | \alpha = \frac{\mathrm{d}\omega}{\mathrm{d}t} | s^{-2}
\omega | kotna hitrost | \omega = \frac{\mathrm{d}\varphi}{\mathrm{d}t} | s^{-1} | enakomerno vrtenje: ω = 2πν
\omega_1, \omega_2 | kotna hitrost pred spremembo in po njej | | s^{-1} | brez zunanjih navorov J₁ω₁ = J₂ω₂
\nu | frekvenca vrtenja (obrati na sekundo) | | s^{-1}
W_k | kinetična energija | W_k = \tfrac{1}{2}mv_{ms}^2 + \tfrac{1}{2}J_{ms}\omega^2 | J
v_{ms} | hitrost masnega središča | | m/s | kotaljenje brez zdrsa: v_ms = ωR
v | hitrost | | m/s
R | polmer koluta ali valja | | m
\vec{\Gamma} | vektor vrtilne količine | \vec{\Gamma} = \vec{r} \times m\vec{v} | kg\,m^2/s
\Gamma | vrtilna količina | \Gamma = J\omega | kg\,m^2/s | ohranja se brez zunanjih navorov
t | čas | | s
F_v | sila vrvice | | N
a | pospešek uteži | | m/s^2 | vrvica ne zdrsne: a = αR
g | težni pospešek | | m/s^2 | 9,81 m/s²
h | višina padca uteži | | m
:::
