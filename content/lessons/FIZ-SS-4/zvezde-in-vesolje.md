---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Opoldne v juliju na vsak kvadratni meter sončne elektrarne na strehi pade okoli $1000\,\mathrm{W}$, toliko, kolikor porabi likalnik. Nad ozračjem, kjer oblaki in zrak ničesar ne zadržijo, je to $1360\,\mathrm{W}$ na kvadratni meter. In to od telesa, ki je $150$ milijonov kilometrov daleč.

Koliko moči potem izseva celo Sonce? Kako vemo, da je njegovo površje vroče skoraj $6000\,\mathrm{K}$, če tja ni nihče nesel termometra? In kaj ga greje milijarde let?

Vse odgovore nosi svetloba. Iz barve zvezde preberemo temperaturo, iz temperature in velikosti njeno moč, iz moči pa, koliko vodika na sekundo predela v jedru. Enako fiziko uporabljajo vremenski sateliti, ki temperaturo oblakov in morja merijo po nevidnem infrardečem sevanju.

## Razlaga

**1. Barva razkrije temperaturo.** Vsako telo seva, tudi ti in tla pod tabo. Toplejše ko je, več seva in drugačne barve je svetloba. Za nekaj teles so izmerili valovno dolžino $\lambda_{\max}$, pri kateri sevajo najmočneje:

| telo | $T$ [K] | $\lambda_{\max}$ [nm] | barva |
|---|---|---|---|
| tla na Zemlji | 288 | 10 100 | infrardeče |
| žareča plošča | 1000 | 2900 | temno rdeče |
| Sonce | 5800 | 500 | rumeno belo |
| Sirij | 9900 | 293 | modro belo |

Pomnoži v vsaki vrstici $\lambda_{\max}$ s $T$. Vsakič dobiš približno isto število, okoli $2{,}9\cdot10^{6}\,\mathrm{nm\,K}$. Ta vzorec se imenuje **Wienov zakon**:

$$\lambda_{\max} T = k_\mathrm{W}$$

Ker je $1\,\mathrm{nm} = 10^{-9}\,\mathrm{m}$, je konstanta v metrih $k_\mathrm{W} = 2{,}90\cdot10^{-3}\,\mathrm{m\,K}$. Toplejše telo seva najmočneje pri krajši valovni dolžini. Zato so rdeče zvezde najhladnejše, modre pa najtoplejše. Tla in oblaki sevajo okoli $10\,\mu\mathrm{m}$ ($10\,000\,\mathrm{nm}$), v infrardečem, ki ga oko ne vidi, satelitska kamera pa ga zazna.

:::premisli
Ploščo štedilnika izklopiš. Kako se med ohlajanjem spreminja njena barva? Zakaj je na koncu ne vidiš več žareti, z dlanjo pa še čutiš, da greje?
---
Ko se ohlaja, se $\lambda_{\max}$ veča: barva gre od oranžne proti temno rdeči in nato v infrardeče. Infrardečega sevanja oko ne zazna, koža pa ga čuti kot toploto. Plošča še seva, le ne več vidno.
:::

**2. Koliko seva kvadratni meter.** Moč, ki jo izseva $1\,\mathrm{m^2}$ površine, je **gostota energijskega toka** $j$, merimo jo v $\mathrm{W/m^2}$. Poglej meritve za telo pri treh temperaturah:

| $T$ [K] | $j$ [W/m²] |
|---|---|
| 300 | 459 |
| 600 | 7350 |
| 1200 | 118 000 |

Ko temperaturo podvojimo, $j$ ne zraste dvakrat, ampak $\dfrac{7350}{459} \approx 16$-krat. Pri naslednji podvojitvi spet $16$-krat. Ker je $16 = 2^4$, je $j$ sorazmeren s četrto potenco temperature. To je **Stefanov zakon**:

$$j = \sigma T^4$$

**Stefanova konstanta** je $\sigma = 5{,}67\cdot10^{-8}\,\mathrm{W/(m^2\,K^4)}$. Temperatura je vedno v kelvinih. Zakon velja za »črno telo«, ki vso vpadlo svetlobo vpije; zvezde so mu zelo podobne.

**3. Izsev zvezde.** **Izsev** $L$ (tudi svetilnost) je vsa moč, ki jo zvezda izseva v vse smeri, v vatih. Zvezda je krogla s površino $4\pi R^2$, vsak kvadratni meter pa seva $\sigma T^4$:

$$L = 4\pi R^2 \sigma T^4$$

Izsev je torej odvisen od temperature in od polmera. Velika hladna zvezda ima lahko večji izsev od majhne vroče.

Astronomi zvezde rišejo na **HR-diagram**: vodoravno temperatura (vroče levo), navpično izsev. Večina zvezd leži na diagonalnem pasu, **glavni veji**; desno zgoraj so velike hladne **rdeče orjakinje**, levo spodaj majhne vroče **bele pritlikavke**. Preizkusi v simulaciji spodaj (»Zvezde na HR-diagramu«): nastavi temperaturo na $3500\,\mathrm{K}$ in z drugim drsnikom večaj polmer. Zvezda ohrani barvo, a se dviga po diagramu.

:::premisli
Dve zvezdi imata enako temperaturo, ena pa ima desetkrat večji polmer. Kolikokrat večji je njen izsev? In rdeča orjakinja z dvakrat nižjo temperaturo od Sonca, a stokrat večjim polmerom: seva več ali manj od Sonca?
---
Pri desetkrat večjem polmeru $100$-krat, ker je izsev sorazmeren z $R^2$. Orjakinji polmer prinese $100^2 = 10\,000$-krat več, nižja temperatura pa $2^4 = 16$-krat manj. Skupaj seva okoli $600$-krat več od Sonca: velikost premaga hladnost.
:::

**4. Svetloba se razredči.** Daleč od zvezde se izsev porazdeli po krogli s polmerom $d$, ki je razdalja do zvezde:

$$j = \frac{L}{4\pi d^2}$$

Dvakrat dlje je gostota toka štirikrat manjša. Kako svetla se zvezda zdi na nebu, je torej odvisno od izseva in od razdalje.

**5. Kaj greje zvezde: fuzija.** Sonce izseva skoraj $4\cdot10^{26}\,\mathrm{W}$ že $4{,}6$ milijarde let. Kemično gorenje bi ga izčrpalo v nekaj tisoč letih. V jedru Sonca je okoli $15$ milijonov kelvinov. Jedra vodika (protoni) so tam tako hitra, da premagajo električno odbijanje in se zlivajo. Temu pravimo **jedrsko zlivanje** ali **fuzija**, nasprotje cepitve v jedrski elektrarni. V več korakih nastane iz štirih vodikovih jeder eno helijevo, poleg njega pa dva pozitrona ($\mathrm{e^+}$) in dva nevtrina ($\nu$):

$$4\,{}^{1}\mathrm{H} \rightarrow {}^{4}\mathrm{He} + 2\,\mathrm{e^+} + 2\,\nu$$

Masa štirih vodikovih atomov je $4{,}031\,30\,\mathrm{u}$, helijevega atoma pa $4{,}002\,60\,\mathrm{u}$. Razlika $0{,}028\,70\,\mathrm{u}$, to je $0{,}71\,\%$ mase, se po $E = m c^2$ sprosti kot $26{,}7\,\mathrm{MeV}$ energije. Zvezde na glavni veji v jedru zlivajo vodik v helij. Ko ga zmanjka, se Sonce napihne v rdečo orjakinjo in na koncu ostane bela pritlikavka.

**6. Razdalje v vesolju.** Metri so za vesolje premajhni. Uporabljamo:

| enota | v metrih | kaj pomeni |
|---|---|---|
| a.e. | $1{,}50\cdot10^{11}$ | razdalja Zemlja–Sonce |
| svetlobno leto | $9{,}46\cdot10^{15}$ | pot svetlobe v enem letu |
| parsek (pc) | $3{,}09\cdot10^{16}$ | $3{,}26$ svetlobnega leta |

Razdaljo do bližnjih zvezd izmerimo s **paralakso**. Iztegni palec in ga glej izmenično z levim in desnim očesom: palec poskakuje glede na ozadje.

Zemlja v pol leta pride na drugo stran tira, zato bližnja zvezda na nebu malo poskoči glede na zelo oddaljene. Polovica tega premika je kot paralakse $p$. Pri $p = 1''$ (ločna sekunda) je zvezda $1\,\mathrm{pc}$ daleč; manjši kot je kot, dlje je zvezda: $d = 1/p$ ($d$ v pc, $p$ v ločnih sekundah).

Najbližja zvezda, Proksima Kentavra, ima paralakso $0{,}768''$ in je $1{,}30\,\mathrm{pc}$ oziroma $4{,}24$ svetlobnega leta daleč. Naša galaksija, Rimska cesta, meri okoli $100\,000$ svetlobnih let, sosednja galaksija Andromeda je $2{,}5$ milijona svetlobnih let daleč.

## Rešeni primeri

### Primer 1: temperatura Betelgeze

Rdečkasta zvezda Betelgeza v Orionu seva najmočneje pri valovni dolžini $830\,\mathrm{nm}$. Kolikšna je temperatura njenega površja?

**Podatki:** $\lambda_{\max} = 830\,\mathrm{nm} = 8{,}30\cdot10^{-7}\,\mathrm{m}$, $k_\mathrm{W} = 2{,}90\cdot10^{-3}\,\mathrm{m\,K}$
**Iščemo:** temperaturo $T$

:::formula
Wienov zakon: $\lambda_{\max} T = k_\mathrm{W}$, zato $T = \dfrac{k_\mathrm{W}}{\lambda_{\max}}$
:::

**Rešitev:**

1. Nanometre pretvorimo v metre, ker je $k_\mathrm{W}$ v $\mathrm{m\,K}$: $830\,\mathrm{nm} = 8{,}30\cdot10^{-7}\,\mathrm{m}$.
2. $T = \dfrac{2{,}90\cdot10^{-3}}{8{,}30\cdot10^{-7}} \approx 3490\,\mathrm{K}$.
3. Odgovor: površje Betelgeze ima okoli $3500\,\mathrm{K}$, precej manj od Sončevih $5800\,\mathrm{K}$; zato je rdečkasta.

### Primer 2: izsev Sonca iz merjenja nad ozračjem

Satelit nad ozračjem izmeri, da na vsak kvadratni meter, obrnjen proti Soncu, pade $1360\,\mathrm{W}$. Sonce je oddaljeno $1{,}50\cdot10^{11}\,\mathrm{m}$. Kolikšen je izsev Sonca?

**Podatki:** $j_0 = 1360\,\mathrm{W/m^2}$, $d = 1{,}50\cdot10^{11}\,\mathrm{m}$
**Iščemo:** izsev $L$

:::formula
$j_0 = \dfrac{L}{4\pi d^2}$, zato $L = 4\pi d^2 j_0$
:::

**Rešitev:**

1. Vsa moč Sonca gre skozi namišljeno kroglo s polmerom $d$. Njena površina je $4\pi d^2 = 4\pi \cdot (1{,}50\cdot10^{11})^2 = 2{,}827\cdot10^{23}\,\mathrm{m^2}$.
2. Vsak kvadratni meter te krogle prejme $j_0$: $L = 2{,}827\cdot10^{23} \cdot 1360 = 3{,}845\cdot10^{26}\,\mathrm{W}$.
3. Odgovor: izsev Sonca je približno $3{,}85\cdot10^{26}\,\mathrm{W}$.

### Primer 3: kako vemo, kako vroče je Sonce

Izsev Sonca je $3{,}85\cdot10^{26}\,\mathrm{W}$ (primer 2), njegov polmer pa $6{,}96\cdot10^{8}\,\mathrm{m}$. Kolikšna je temperatura Sončevega površja? Ali se ujema z barvo Sonca?

**Podatki:** $L = 3{,}85\cdot10^{26}\,\mathrm{W}$, $R = 6{,}96\cdot10^{8}\,\mathrm{m}$, $\sigma = 5{,}67\cdot10^{-8}\,\mathrm{W/(m^2\,K^4)}$, $k_\mathrm{W} = 2{,}90\cdot10^{-3}\,\mathrm{m\,K}$
**Iščemo:** temperaturo površja $T$ in valovno dolžino $\lambda_{\max}$

:::formula
$j = \dfrac{L}{4\pi R^2}$, nato iz $j = \sigma T^4$ sledi $T = \sqrt[4]{\dfrac{j}{\sigma}}$; za preizkus $\lambda_{\max} = \dfrac{k_\mathrm{W}}{T}$
:::

**Rešitev:**

1. Površina Sonca: $4\pi R^2 = 4\pi \cdot (6{,}96\cdot10^{8})^2 = 6{,}087\cdot10^{18}\,\mathrm{m^2}$.
2. Moč na kvadratni meter površja: $j = \dfrac{3{,}85\cdot10^{26}}{6{,}087\cdot10^{18}} = 6{,}325\cdot10^{7}\,\mathrm{W/m^2}$.
3. Delimo s $\sigma$: $\dfrac{j}{\sigma} = \dfrac{6{,}325\cdot10^{7}}{5{,}67\cdot10^{-8}} = 1{,}116\cdot10^{15}\,\mathrm{K^4}$.
4. Četrti koren (dvakrat zapored kvadratni koren): $T = \sqrt[4]{1{,}116\cdot10^{15}} \approx 5780\,\mathrm{K}$.
5. Preizkus z Wienovim zakonom: $\lambda_{\max} = \dfrac{2{,}90\cdot10^{-3}}{5780} = 5{,}02\cdot10^{-7}\,\mathrm{m}$, to je $502\,\mathrm{nm}$, sredina vidnega spektra.
6. Odgovor: površje Sonca ima okoli $5780\,\mathrm{K}$; sevanje je najmočnejše pri $502\,\mathrm{nm}$, kar se ujema z njegovo rumeno belo svetlobo.

### Primer 4 – zdaj ti: koliko mase izgubi Sonce

Sonce izseva $3{,}85\cdot10^{26}\,\mathrm{W}$. Za koliko se mu vsako sekundo zmanjša masa? Koliko vodika mora vsako sekundo zliti, če se v energijo spremeni $0{,}71\,\%$ mase vodika?

**Podatki:** $L = 3{,}85\cdot10^{26}\,\mathrm{W}$, $t = 1\,\mathrm{s}$, $c = 3{,}00\cdot10^{8}\,\mathrm{m/s}$, delež $0{,}71\,\% = 0{,}0071$
**Iščemo:** izgubo mase $\Delta m$ v eni sekundi in maso zlitega vodika $m_\mathrm{H}$

:::formula
$E = L t = \Delta m\, c^2$, zato $\Delta m = \dfrac{L t}{c^2}$; nato $m_\mathrm{H} = \dfrac{\Delta m}{0{,}0071}$
:::

**Rešitev:**

1. V eni sekundi Sonce izseva $E = L t = 3{,}85\cdot10^{26}\,\mathrm{J}$.
2. Kvadrat svetlobne hitrosti: $c^2 = (3{,}00\cdot10^{8})^2 = 9{,}00\cdot10^{16}\,\mathrm{m^2/s^2}$.
3. Deljenje opravi sam: najprej $\Delta m$, iz njega $m_\mathrm{H}$.

:::premisli
Koliko sta $\Delta m = \dfrac{3{,}85\cdot10^{26}\,\mathrm{J}}{9{,}00\cdot10^{16}\,\mathrm{m^2/s^2}}$ in $m_\mathrm{H} = \dfrac{\Delta m}{0{,}0071}$?
---
$\Delta m \approx 4{,}28\cdot10^{9}\,\mathrm{kg}$, več kot štiri milijone ton na sekundo. Zliti vodik: $m_\mathrm{H} \approx 6{,}0\cdot10^{11}\,\mathrm{kg}$, okoli $600$ milijonov ton na sekundo. Sonce je tako masivno, da mu ga bo vseeno dovolj še za okoli pet milijard let.
:::

## Pogoste napake

- **»Rdeča je vroča, modra hladna.«** Tako je označeno na pipi. Pri zvezdah je obratno: po Wienovem zakonu toplejše telo seva pri krajši valovni dolžini, zato so modre zvezde najtoplejše.
- **»Dvakrat toplejša zvezda seva dvakrat več.«** Mislimo, da je sevanje sorazmerno s temperaturo. Po Stefanovem zakonu je sorazmerno s $T^4$: dvakrat višja temperatura pomeni $16$-krat večjo gostoto toka.
- **Stopinje Celzija v formuli.** Temperatura v zakonih je absolutna, v kelvinih. Če za površje s $5500\,^\circ\mathrm{C}$ vstaviš $5500$ namesto $5773\,\mathrm{K}$, dobiš pri $T^4$ okoli $18\,\%$ premajhen izsev; pri hladnih telesih je napaka še večja.
- **»Svetlejša zvezda ima večji izsev.«** Svetlost na nebu je gostota toka $j = \dfrac{L}{4\pi d^2}$, odvisna tudi od razdalje. Bližnja šibka zvezda je lahko na nebu svetlejša od daljne močne.
- **»Svetlobno leto je čas.«** Ime zavaja zaradi besede »leto«. Svetlobno leto je razdalja, ki jo svetloba prepotuje v enem letu, $9{,}46\cdot10^{15}\,\mathrm{m}$.

## Povzetek

- Wienov zakon: $\lambda_{\max} T = k_\mathrm{W}$, $k_\mathrm{W} = 2{,}90\cdot10^{-3}\,\mathrm{m\,K}$; rdeče zvezde so hladne, modre vroče, Sonce ima okoli $5800\,\mathrm{K}$.
- Stefanov zakon: $j = \sigma T^4$, $\sigma = 5{,}67\cdot10^{-8}\,\mathrm{W/(m^2\,K^4)}$; $T$ vedno v kelvinih.
- Izsev je vsa izsevana moč: $L = 4\pi R^2 \sigma T^4$; Sonce $3{,}85\cdot10^{26}\,\mathrm{W}$. Na razdalji $d$: $j = \dfrac{L}{4\pi d^2}$.
- HR-diagram: izsev proti temperaturi; glavna veja, rdeče orjakinje, bele pritlikavke.
- Zvezde greje fuzija: $4\,{}^{1}\mathrm{H} \rightarrow {}^{4}\mathrm{He}$, sprosti se $0{,}71\,\%$ mase, $26{,}7\,\mathrm{MeV}$ na helijevo jedro; Sonce izgubi $4{,}3\cdot10^{9}\,\mathrm{kg}$ mase na sekundo.
- Razdalje: $1\,\mathrm{a.e.} = 1{,}50\cdot10^{11}\,\mathrm{m}$, $1$ svetlobno leto $= 9{,}46\cdot10^{15}\,\mathrm{m}$, $1\,\mathrm{pc} = 3{,}26$ svetlobnega leta; paralaksa $d = 1/p$.

## Drugače: Korak za korakom s številkami

Kako astronomi iz treh meritev ugotovijo, kako velika je zvezda, ki je nihče ne more obiskati? Vzemimo Sirij.

1. **Razdalja iz paralakse.** Izmerjena paralaksa je $p = 0{,}379''$. Torej $d = 1/0{,}379 = 2{,}64\,\mathrm{pc}$, to je $2{,}64 \cdot 3{,}09\cdot10^{16} = 8{,}16\cdot10^{16}\,\mathrm{m}$ ali $8{,}6$ svetlobnega leta.
2. **Izsev iz svetlosti.** Na Zemlji izmerimo od Sirija $j = 1{,}15\cdot10^{-7}\,\mathrm{W/m^2}$. Izsev je $L = 4\pi d^2 j = 8{,}36\cdot10^{34}\,\mathrm{m^2} \cdot 1{,}15\cdot10^{-7}\,\mathrm{W/m^2} \approx 9{,}6\cdot10^{27}\,\mathrm{W}$, okoli $25$-krat več kot Sonce.
3. **Temperatura iz barve.** Sirij seva najmočneje pri $293\,\mathrm{nm}$, zato $T = \dfrac{2{,}90\cdot10^{-3}}{2{,}93\cdot10^{-7}} \approx 9900\,\mathrm{K}$.
4. **Moč kvadratnega metra.** $\sigma T^4 = 5{,}67\cdot10^{-8} \cdot 9900^4 = 5{,}45\cdot10^{8}\,\mathrm{W/m^2}$.
5. **Površina in polmer.** Površina je $\dfrac{L}{\sigma T^4} = \dfrac{9{,}6\cdot10^{27}}{5{,}45\cdot10^{8}} \approx 1{,}76\cdot10^{19}\,\mathrm{m^2}$. Iz $4\pi R^2$ sledi $R \approx 1{,}18\cdot10^{9}\,\mathrm{m}$, kar je $1{,}7$ polmera Sonca.

Vse to iz svetlobe, ki je do nas potovala osem let in pol.

## Drugače: Kot zgodba

Pred $4{,}6$ milijarde let je v naši galaksiji lebdel hladen oblak vodika in helija. Ko ga je zmotil morda udarni val bližnje eksplozije, se je začel krčiti pod lastno težo. Pri krčenju se je segreval, tako kot se segreje zrak v tlačilki.

V središču je nastala vroča krogla. Ko je temperatura v njej dosegla okoli $15$ milijonov kelvinov, so se protoni prvič zaleteli dovolj močno, da so se zlili v helij. Sonce je zasvetilo. Odtlej vsako sekundo predela okoli $600$ milijonov ton vodika in izgubi štiri milijone ton mase, ki odleti kot svetloba.

Foton, rojen v jedru, se več deset tisoč let prebija skozi gosto notranjost, se odbija in vpija. Ko končno uide s površja s temperaturo $5800\,\mathrm{K}$, zleti v vesolje in v dobrih osmih minutah pade na tvoje lice kot toplota.

Čez okoli pet milijard let bo vodika v jedru zmanjkalo. Sonce se bo napihnilo v rdečo orjakinjo, ohladilo se bo površje, zato bo rdeče. Na koncu bo zunanje plasti odpihnilo, ostalo bo vroče, majhno jedro: bela pritlikavka, ki se bo počasi ohlajala.

## Preveri se

? Katera vrstica pravilno poveže barvo zvezde in temperaturo njenega površja?
- rdeča $12\,000\,\mathrm{K}$, rumena $5800\,\mathrm{K}$, modra $3500\,\mathrm{K}$
~ To je barvna oznaka s pipe. Po Wienovem zakonu ima toplejše telo krajšo $\lambda_{\max}$, torej je modro.
+ rdeča $3500\,\mathrm{K}$, rumena $5800\,\mathrm{K}$, modra $12\,000\,\mathrm{K}$
- vse imajo okoli $5800\,\mathrm{K}$, barva je odvisna od razdalje
~ Razdalja vpliva na to, kako svetla je zvezda, ne na njeno barvo. Barvo določa temperatura.
> Wienov zakon: $\lambda_{\max} T = k_\mathrm{W}$. Višja temperatura pomeni krajšo valovno dolžino, od rdeče proti modri.

? Rigel ima nekaj tisočkrat večji izsev kot Sirij, a je Sirij na nebu svetlejši. Zakaj?
- Ker je Rigel hladnejši in zato šibkeje seva.
~ Rigel je celo toplejši od Sirija, njegov izsev je večji. Odloča razdalja.
+ Ker je Sirij približno stokrat bližje in gostota toka pada s kvadratom razdalje.
- Ker je Sirij večji, zato ima večji izsev.
~ Izsev Sirija je manjši, ne večji. Svetlost na nebu ni isto kot izsev.
> $j = \dfrac{L}{4\pi d^2}$: stokrat dlje pomeni $10\,000$-krat manjšo gostoto toka, kar premaga nekaj tisočkrat večji izsev Rigela.

? Proksima Kentavra je $4{,}2$ svetlobnega leta daleč. Na njej danes zagledaš izbruh. Kdaj se je zgodil?
- Danes, ker svetloba potuje v trenutku.
~ Svetloba ima končno hitrost, $3{,}00\cdot10^{8}\,\mathrm{m/s}$. Že od Sonca potuje osem minut.
- Pred $4{,}2$ dneva.
~ Svetlobno leto ni dan in ni čas, ampak razdalja, ki jo svetloba prepotuje v enem letu.
+ Pred okoli $4{,}2$ leta.
> Svetlobno leto je razdalja, ki jo svetloba prepotuje v letu. Za $4{,}2$ svetlobnega leta potrebuje $4{,}2$ leta, zato vidimo, kar se je zgodilo takrat.

? Zvezda ima enak polmer kot Sonce, a dvakrat višjo temperaturo površja. Oceni njen izsev.
- približno $2$-krat večji od Sončevega
~ To bi veljalo, če bi bil izsev sorazmeren s $T$. Po Stefanovem zakonu je sorazmeren s $T^4$.
- približno $4$-krat večji od Sončevega
~ To je $2^2$. Kvadrat nastopa pri polmeru, pri temperaturi je četrta potenca.
+ približno $16$-krat večji od Sončevega
> $L = 4\pi R^2 \sigma T^4$; pri enakem $R$ je razmerje $2^4 = 16$.

? Zvezda seva najmočneje pri $\lambda_{\max} = 290\,\mathrm{nm}$. Kolikšna je temperatura njenega površja?
- $1000\,\mathrm{K}$
~ Tako dobiš, če $290\,\mathrm{nm}$ zapišeš kot $2{,}9\cdot10^{-6}\,\mathrm{m}$. Pravilno je $2{,}9\cdot10^{-7}\,\mathrm{m}$.
+ $10\,000\,\mathrm{K}$
- $8{,}4\cdot10^{-10}\,\mathrm{K}$
~ To je produkt $k_\mathrm{W} \cdot \lambda_{\max}$. Temperaturo dobiš z deljenjem, $T = k_\mathrm{W}/\lambda_{\max}$.
> $T = \dfrac{2{,}90\cdot10^{-3}\,\mathrm{m\,K}}{2{,}90\cdot10^{-7}\,\mathrm{m}} = 10\,000\,\mathrm{K}$; zvezda je modro bela.

:::simboli
\lambda_{\max} | valovna dolžina, pri kateri telo seva najmočneje | \lambda_{\max} = \frac{k_\mathrm{W}}{T} | m
T | temperatura površja | T = \sqrt[4]{\frac{j}{\sigma}} | K | vedno v kelvinih
k_\mathrm{W} | Wienova konstanta | | m\,K | $2{,}90\cdot10^{-3}\,\mathrm{m\,K}$
j | gostota energijskega toka | j = \sigma T^4 | W/m^2 | moč na kvadratni meter
\sigma | Stefanova konstanta | | W/(m^2\,K^4) | $5{,}67\cdot10^{-8}$
L | izsev (svetilnost) | L = 4\pi R^2 \sigma T^4 | W | vsa izsevana moč
R | polmer zvezde | | m
d | razdalja od zvezde | d = \frac{1}{p} | m | pri paralaksi v pc
p | kot paralakse | | ″ | v ločnih sekundah
j_0 | gostota energijskega toka Sonca nad ozračjem | j_0 = \frac{L}{4\pi d^2} | W/m^2 | $1360\,\mathrm{W/m^2}$
E | izsevana energija | E = L t | J
t | čas | | s
\Delta m | zmanjšanje mase | \Delta m = \frac{L t}{c^2} | kg
c | hitrost svetlobe | | m/s | $3{,}00\cdot10^{8}\,\mathrm{m/s}$
m | masa | | kg | v $E = m c^2$
m_\mathrm{H} | masa zlitega vodika | m_\mathrm{H} = \frac{\Delta m}{0{,}0071} | kg
\mathrm{H}, \mathrm{He} | vodik, helij | | | ${}^{1}\mathrm{H}$ proton, ${}^{4}\mathrm{He}$ helijevo jedro
\mathrm{e^+} | pozitron | | |
\nu | nevtrino | | |
:::
