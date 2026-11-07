---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ob sončni elektrarni na strehi industrijske hale so namestili baterijo kondenzatorjev, da bi izboljšali faktor moči. Kmalu zatem so se v hali začeli pregrevati kondenzatorji in nenadoma izklapljati razsmerniki. Meritev je pokazala, da je na zbiralkah napetost pete harmonske komponente ($250\,\mathrm{Hz}$) narasla z okoli $1\,\%$ na več kot $20\,\%$ osnovne napetosti. Razsmerniki pa harmonskih tokov niso proizvajali nič več kot prej. Kako lahko dodan pasiven element, ki moči sploh ne troši, signal desetkrat poveča?

Pojav se imenuje **resonanca**. Isti pojav izbere eno radijsko postajo izmed sto, omogoča ultrazvočne merilnike vetra na vremenskih postajah in brezžično polnjenje. Ko ga razumemo, ga znamo uporabiti ali se mu izogniti.

## Razlaga

### Mamljiva, a napačna misel

Zaporedno vežimo upornik $R = 10\,\Omega$, tuljavo $L = 10\,\mathrm{mH}$ in kondenzator $C = 1\,\mu\mathrm{F}$ na sinusni vir z amplitudo $5\,\mathrm{V}$. Večina študentov pravi: po Kirchhoffovem zakonu se napetosti na elementih seštejejo v napetost vira, zato nobena ne more biti večja od $5\,\mathrm{V}$.

Izmerimo pri $f = 1592\,\mathrm{Hz}$: na kondenzatorju je $50\,\mathrm{V}$ amplitude, na tuljavi prav tako $50\,\mathrm{V}$, na uporniku $5\,\mathrm{V}$.

Napaka je v besedi »seštejejo«. Kirchhoffov zakon velja za **kazalce** (kompleksne amplitude), ne za njihove velikosti. Napetost tuljave prehiteva tok za $90^\circ$, napetost kondenzatorja zaostaja za $90^\circ$. Kazalca sta nasprotna in se lahko skoraj odštejeta, čeprav je vsak zase velik.

```
   U_L ↑  50 V
       |
  U_R  +-----→ 5 V  (= U vira)
       |
   U_C ↓  50 V
```

### Zaporedni nihajni krog

Impedanca zaporedne vezave je

$$Z = R + \mathrm{j}\left(\omega L - \frac{1}{\omega C}\right).$$

**Definicija.** **Resonanca** zaporednega kroga nastopi pri krožni frekvenci, pri kateri je jalovi del impedance nič, $\omega_0 L = 1/(\omega_0 C)$:

$$\omega_0 = \frac{1}{\sqrt{LC}}.$$

Pri resonanci je $Z = R$: impedanca je najmanjša in čisto delovna, tok je največji, $I_0 = U/R$, in v fazi z napetostjo. Reaktanci tuljave in kondenzatorja sta enaki, $X_0 = \omega_0 L = \sqrt{L/C}$ (**karakteristična upornost**).

**Definicija.** **Kvaliteta** (faktor kakovosti) kroga je

$$Q = 2\pi\,\frac{W}{W_{izg}},$$

kjer je $W$ energija, shranjena v krogu, $W_{izg}$ pa energija, ki se v eni periodi spremeni v toploto.

*Izpeljava za zaporedni krog.* Pri resonanci je tok $i = I_p\sin\omega_0 t$. Energija prehaja med tuljavo in kondenzatorjem, vsota pa je stalna: ko je tok največji, je vsa v tuljavi, $W = \tfrac{1}{2}LI_p^2$. Povprečna moč na uporu je $\tfrac{1}{2}RI_p^2$, v periodi $T = 2\pi/\omega_0$ se porabi $W_{izg} = \pi RI_p^2/\omega_0$. Torej

$$Q = \frac{\omega_0 L}{R} = \frac{1}{\omega_0 CR} = \frac{1}{R}\sqrt{\frac{L}{C}}.$$

Napetosti na reaktivnih elementih pri resonanci sta $U_L = U_C = X_0 I_0 = (X_0/R)\,U = QU$. To je odgovor na uvodno uganko: $Q = 10$ in $10 \cdot 5\,\mathrm{V} = 50\,\mathrm{V}$.

:::premisli
Upornost zaporednega kroga podvojimo, $L$ in $C$ ostaneta. Kaj se zgodi z resonančno frekvenco, z napetostjo na kondenzatorju pri resonanci in s širino krivulje?
---
Resonančna frekvenca ostane enaka, ker je odvisna le od $L$ in $C$. Tok pri resonanci se razpolovi, zato se razpolovi tudi $U_C = QU$. Pasovna širina $R/L$ se podvoji: krivulja je nižja in širša.
:::

### Krivulja in pasovna širina

Razmerje toka pri poljubni frekvenci in toka pri resonanci je

$$\frac{I}{I_0} = \frac{1}{\sqrt{1 + Q^2\left(\frac{\omega}{\omega_0} - \frac{\omega_0}{\omega}\right)^2}}.$$

**Definicija.** **Mejni frekvenci** $\omega_1 < \omega_0 < \omega_2$ sta tisti, pri katerih moč na uporu pade na polovico največje, tok pa na $I_0/\sqrt{2}$. **Pasovna širina** je $B = \omega_2 - \omega_1$.

**Izrek.** Za zaporedni krog velja

$$B = \frac{R}{L} = \frac{\omega_0}{Q}, \qquad \omega_1\omega_2 = \omega_0^2.$$

*Dokaz.* Tok pade na $I_0/\sqrt{2}$, ko je $|Z| = \sqrt{2}R$, torej ko je jalovi del enak $\pm R$: $\omega L - 1/(\omega C) = \pm R$. Pomnožimo z $\omega/L$: $\omega^2 \mp (R/L)\omega - \omega_0^2 = 0$. Pozitivni rešitvi sta $\omega_{1,2} = \mp\frac{R}{2L} + \sqrt{\frac{R^2}{4L^2} + \omega_0^2}$. Njuna razlika je $R/L$, produkt pa $\omega_0^2$ (vstavimo in uporabimo $(s - a)(s + a) = s^2 - a^2$).

Resonančna frekvenca je torej **geometrijska** sredina mejnih, ne aritmetična; pri velikem $Q$ je razlika zanemarljiva.

```
 I/I0
 1,0 |        _
     |       / \
 0,71|------/---\------
     |    _/     \_
     |___/         \___
     +-----+--+--+------ f
          f1 f0 f2
```

### Vzporedni nihajni krog

Idealni vzporedni krog (upornik $R$, tuljava $L$ in kondenzator $C$ vzporedno) je dual zaporednega. Admitanca je

$$Y = \frac{1}{R} + \mathrm{j}\left(\omega C - \frac{1}{\omega L}\right).$$

Resonanca je spet pri $\omega_0 = 1/\sqrt{LC}$, a tu je pri resonanci **admitanca** najmanjša, **impedanca** največja ($Z = R$) in tok iz vira najmanjši. Kvaliteta je $Q = R/(\omega_0 L) = \omega_0 RC$, pasovna širina $B = 1/(RC)$. Tokova skozi tuljavo in kondenzator sta pri resonanci $Q$-krat večja od toka vira: med njima kroži velik tok, vir pa dovaja le izgube.

**Realni vzporedni krog.** V praksi ima upornost predvsem tuljava: veja $R + \mathrm{j}\omega L$, vzporedno pa $C$. Ničli jalovega dela admitance da

$$\omega_0 = \sqrt{\frac{1}{LC} - \frac{R^2}{L^2}}, \qquad Z_0 = \frac{L}{RC}.$$

*Izpeljava.* $Y = \frac{R - \mathrm{j}\omega L}{R^2 + \omega^2L^2} + \mathrm{j}\omega C$. Jalovi del je nič, ko je $C(R^2 + \omega^2L^2) = L$, od koder sledi $\omega_0$. Tedaj je $R^2 + \omega_0^2L^2 = L/C$, delovni del admitance pa $R/(L/C) = RC/L$, torej $Z_0 = L/(RC)$. Resonanca obstaja le, če je $R < \sqrt{L/C}$.

:::premisli
Katera vezava je primerna, da iz signala z mnogo frekvencami **izločimo** eno samo (jo zadušimo), in katera, da jo **poudarimo** na izhodu, ki ga napaja tokovni vir?
---
Zaporedni krog, vezan prečno med vodnika, ima pri $\omega_0$ najmanjšo impedanco in to frekvenco kratko sklene: izloči jo (tako delujejo harmonski filtri). Vzporedni krog, ki ga napaja tok, ima pri $\omega_0$ največjo impedanco, zato je napetost na njem pri tej frekvenci največja: poudari jo (nihajni krog v sprejemniku).
:::

## Rešeni primeri

### Primer 1 (lažji)

Za uvodni zaporedni krog ($R = 10\,\Omega$, $L = 10\,\mathrm{mH}$, $C = 1{,}0\,\mu\mathrm{F}$, amplituda vira $5{,}0\,\mathrm{V}$) izračunaj resonančno frekvenco, tok, kvaliteto, napetost na kondenzatorju in pasovno širino v hercih.

**Podatki:** $R = 10\,\Omega$, $L = 0{,}010\,\mathrm{H}$, $C = 1{,}0 \cdot 10^{-6}\,\mathrm{F}$, $U = 5{,}0\,\mathrm{V}$
**Iščemo:** $f_0$, $I_0$, $Q$, $U_C$, $\Delta f$

:::formula
$\omega_0 = \dfrac{1}{\sqrt{LC}}$, $I_0 = \dfrac{U}{R}$, $Q = \dfrac{\omega_0 L}{R}$, $U_C = QU$, $B = \dfrac{R}{L}$
:::

**Rešitev:**

1. $\omega_0 = 1/\sqrt{0{,}010 \cdot 10^{-6}}\,\mathrm{s^{-1}} = 10\,000\,\mathrm{s^{-1}}$, torej $f_0 = \omega_0/(2\pi) \approx 1592\,\mathrm{Hz}$.
2. Pri resonanci je $Z = R$: $I_0 = 5{,}0/10\,\mathrm{A} = 0{,}50\,\mathrm{A}$.
3. Karakteristična upornost $X_0 = 10\,000 \cdot 0{,}010\,\Omega = 100\,\Omega$, zato $Q = 100/10 = 10$.
4. $U_C = QU = 10 \cdot 5{,}0\,\mathrm{V} = 50\,\mathrm{V}$.
5. $B = R/L = 10/0{,}010\,\mathrm{s^{-1}} = 1000\,\mathrm{s^{-1}}$, v hercih $\Delta f = 1000/(2\pi)\,\mathrm{Hz} \approx 159\,\mathrm{Hz}$.
6. Odgovor: $f_0 \approx 1{,}59\,\mathrm{kHz}$, $I_0 = 0{,}50\,\mathrm{A}$, $Q = 10$, na kondenzatorju je $50\,\mathrm{V}$, pas je širok okoli $159\,\mathrm{Hz}$. Kondenzator mora biti narejen za desetkratno napetost vira.

### Primer 2

Ultrazvočni merilnik vetra na vremenski postaji ima pretvornike, ki jih blizu resonance opišemo kot zaporedni krog z $R = 500\,\Omega$ in $L = 40\,\mathrm{mH}$; resonančna frekvenca je $40\,\mathrm{kHz}$. Določi $C$, kvaliteto in natančni mejni frekvenci. Za koliko pade tok, če pretvornik vzbujamo z $41\,\mathrm{kHz}$?

**Podatki:** $R = 500\,\Omega$, $L = 0{,}040\,\mathrm{H}$, $f_0 = 40\,\mathrm{kHz}$, $f = 41\,\mathrm{kHz}$
**Iščemo:** $C$, $Q$, $f_1$, $f_2$, $I/I_0$ pri $41\,\mathrm{kHz}$

:::formula
$C = \dfrac{1}{\omega_0^2 L}$, $Q = \dfrac{\omega_0 L}{R}$, $\omega_{1,2} = \mp\dfrac{R}{2L} + \sqrt{\dfrac{R^2}{4L^2} + \omega_0^2}$, $\dfrac{I}{I_0} = \dfrac{1}{\sqrt{1 + Q^2\left(\frac{\omega}{\omega_0} - \frac{\omega_0}{\omega}\right)^2}}$
:::

**Rešitev:**

1. $\omega_0 = 2\pi \cdot 40\,000\,\mathrm{s^{-1}} \approx 2{,}513 \cdot 10^5\,\mathrm{s^{-1}}$; $C = 1/(\omega_0^2 L) \approx 396\,\mathrm{pF}$.
2. $Q = 2{,}513 \cdot 10^5 \cdot 0{,}040/500 \approx 20{,}1$.
3. $R/(2L) = 6250\,\mathrm{s^{-1}}$; koren $\sqrt{6250^2 + \omega_0^2} \approx 2{,}514 \cdot 10^5\,\mathrm{s^{-1}}$.
4. Mejni frekvenci: $f_1 \approx 39\,018\,\mathrm{Hz}$ in $f_2 \approx 41\,007\,\mathrm{Hz}$. Razlika je $1989\,\mathrm{Hz} = R/(2\pi L)$, kot napove izrek.
5. Preverba: $\sqrt{39\,018 \cdot 41\,007} \approx 40\,000$; resonanca je geometrijska sredina. Mejni frekvenci nista simetrični okoli $40\,\mathrm{kHz}$ ($982\,\mathrm{Hz}$ spodaj, $1007\,\mathrm{Hz}$ zgoraj).
6. Pri $41\,\mathrm{kHz}$: $x = 41/40 = 1{,}025$, $x - 1/x \approx 0{,}0494$, $Q(x - 1/x) \approx 0{,}993$, zato $I/I_0 \approx 1/\sqrt{1 + 0{,}986} \approx 0{,}71$.
7. Odgovor: $C \approx 396\,\mathrm{pF}$, $Q \approx 20$, pas od okoli $39{,}0$ do $41{,}0\,\mathrm{kHz}$. Že $1\,\mathrm{kHz}$ (zgolj $2{,}5\,\%$) mimo resonance tok pade na okoli $71\,\%$: pretvornik je treba vzbujati natančno.

### Primer 3 (težji)

V omrežju hale iz uvoda je induktivnost omrežja (transformator in vodi), preračunana na fazo, $L = 0{,}50\,\mathrm{mH}$, njena upornost $R = 0{,}020\,\Omega$. Baterija kondenzatorjev ima na fazo $C = 0{,}81\,\mathrm{mF}$. Razsmerniki injicirajo peto harmonsko komponento toka z amplitudo $2{,}0\,\mathrm{A}$ na fazo; fazna napetost omrežja je $230\,\mathrm{V}$. a) Pri kateri frekvenci nastopi vzporedna resonanca omrežja s kondenzatorji? b) Kolikšna je harmonska napetost na zbiralkah s kondenzatorji in brez njih? c) Kolikšna je kvaliteta in kaj to pomeni?

**Podatki:** $L = 5{,}0 \cdot 10^{-4}\,\mathrm{H}$, $R = 0{,}020\,\Omega$, $C = 8{,}1 \cdot 10^{-4}\,\mathrm{F}$, $I_5 = 2{,}0\,\mathrm{A}$ pri $250\,\mathrm{Hz}$, $U_f = 230\,\mathrm{V}$
**Iščemo:** $f_0$, $U_5$ z baterijo in brez nje, $Q$

:::formula
$\omega_0 = \sqrt{\dfrac{1}{LC} - \dfrac{R^2}{L^2}}$, $Z_0 = \dfrac{L}{RC}$, $Q = \dfrac{\omega_0 L}{R}$, $Z_L = \sqrt{R^2 + \omega^2 L^2}$
:::

**Rešitev:**

1. Zakaj vzporedni krog: za tok, ki ga razsmernik injicira v zbiralke, sta omrežje (veja $R$, $L$) in baterija ($C$) vezana vzporedno.
2. $1/(LC) \approx 2{,}47 \cdot 10^6\,\mathrm{s^{-2}}$, $R^2/L^2 = 1600\,\mathrm{s^{-2}}$; drugi člen je zanemarljiv. $\omega_0 \approx 1571\,\mathrm{s^{-1}}$, $f_0 \approx 250\,\mathrm{Hz}$: resonanca je točno na peti harmonski komponenti.
3. Impedanca pri resonanci: $Z_0 = 5{,}0 \cdot 10^{-4}/(0{,}020 \cdot 8{,}1 \cdot 10^{-4})\,\Omega \approx 30{,}9\,\Omega$.
4. Harmonska napetost z baterijo: $U_5 = 2{,}0 \cdot 30{,}9\,\mathrm{V} \approx 62\,\mathrm{V}$, to je $62/230 \approx 27\,\%$ fazne napetosti.
5. Brez baterije teče harmonski tok le skozi omrežje: reaktanca $\omega L = 1571 \cdot 5{,}0 \cdot 10^{-4}\,\Omega \approx 0{,}785\,\Omega$ in $Z_L = \sqrt{0{,}020^2 + 0{,}785^2}\,\Omega \approx 0{,}786\,\Omega$, zato $U_5 \approx 1{,}57\,\mathrm{V}$, okoli $0{,}7\,\%$.
6. Kvaliteta: $Q = 1571 \cdot 5{,}0 \cdot 10^{-4}/0{,}020 \approx 39$. Razmerje obeh napetosti, $62/1{,}57 \approx 39$, je enako $Q$.
7. Odgovor: resonanca je pri $250\,\mathrm{Hz}$; baterija harmonsko napetost poveča s $1{,}6\,\mathrm{V}$ na okoli $62\,\mathrm{V}$, kar je okoli $39$-kratno povečanje (kvaliteta kroga). Standard kakovosti napetosti dovoljuje za peto harmonsko komponento okoli $6\,\%$; zato baterijam dodajo dušilke, ki resonanco premaknejo pod $250\,\mathrm{Hz}$.

### Primer 4 – zdaj ti

Sprejemnik mreže za zaznavanje strel posluša elektromagnetne sunke pri okoli $10\,\mathrm{kHz}$. Vhodni idealni vzporedni krog ima $L = 10\,\mathrm{mH}$, vzporedno upornost $R = 20\,\mathrm{k\Omega}$ in je uglašen na $10\,\mathrm{kHz}$. Določi $C$, kvaliteto in pasovno širino.

**Podatki:** $L = 0{,}010\,\mathrm{H}$, $R = 2{,}0 \cdot 10^4\,\Omega$, $f_0 = 10\,\mathrm{kHz}$
**Iščemo:** $C$, $Q$, $\Delta f$

:::formula
$C = \dfrac{1}{\omega_0^2 L}$, $Q = \dfrac{R}{\omega_0 L}$, $\Delta f = \dfrac{f_0}{Q} = \dfrac{1}{2\pi RC}$
:::

**Rešitev:**

1. $\omega_0 = 2\pi \cdot 10^4\,\mathrm{s^{-1}} \approx 62\,832\,\mathrm{s^{-1}}$, $C = 1/(\omega_0^2 L) \approx 25{,}3\,\mathrm{nF}$.
2. Reaktanca tuljave pri resonanci: $\omega_0 L \approx 628\,\Omega$.
3. Kvaliteto in pasovno širino izračunaj sam.

:::premisli
Kolikšna sta $Q$ in $\Delta f$?
---
$Q = 20\,000/628 \approx 31{,}8$ (pri vzporednem krogu je $Q$ večja, če je $R$ **večja**). $\Delta f = 10\,000/31{,}8\,\mathrm{Hz} \approx 314\,\mathrm{Hz}$; enako da $1/(2\pi RC)$. Tok skozi tuljavo in kondenzator je pri resonanci okoli $32$-krat večji od toka, ki pride iz antene.
:::

## Pogoste napake

- **Napetost na elementu ne more preseči napetosti vira.** Kirchhoffov zakon velja za kazalce. Pri resonanci se $U_L$ in $U_C$ odštejeta, vsaka pa je $Q$-krat večja od napetosti vira.
- **Pri resonanci je tok vedno največji.** To velja za zaporedni krog. Pri vzporednem je tok iz vira **najmanjši**, impedanca največja; velik tok kroži le med $L$ in $C$.
- **Enaka formula za $Q$.** Pri zaporednem krogu je $Q = \omega_0 L/R$ (večji $R$ pomeni slabšo kvaliteto), pri idealnem vzporednem $Q = R/(\omega_0 L)$ (večji $R$ pomeni boljšo). Formulo izberemo glede na to, ali je $R$ vezan zaporedno ali vzporedno.
- **Resonanca je na sredini pasu.** $\omega_0$ je geometrijska sredina $\sqrt{\omega_1\omega_2}$; pri majhnem $Q$ je $\omega_0$ opazno bližje spodnji meji kot aritmetična sredina.
- **Realni vzporedni krog ima $\omega_0 = 1/\sqrt{LC}$.** Z upornostjo tuljave je $\omega_0 = \sqrt{1/(LC) - R^2/L^2}$; pri majhni kvaliteti je razlika nekaj odstotkov ali več (Naloga 1).

## Povzetek

- Resonanca: jalovi del impedance (zaporedno) ali admitance (vzporedno) je nič; idealno $\omega_0 = 1/\sqrt{LC}$.
- Zaporedni krog: pri $\omega_0$ je $Z = R$ najmanjša, tok največji, $U_L = U_C = QU$; $Q = \omega_0 L/R = \tfrac{1}{R}\sqrt{L/C}$.
- Kvaliteta iz energije: $Q = 2\pi W/W_{izg}$.
- Pasovna širina (padec moči na polovico): $B = \omega_2 - \omega_1 = \omega_0/Q$, zaporedno $R/L$; $\omega_1\omega_2 = \omega_0^2$.
- Idealni vzporedni krog: pri $\omega_0$ je $Z = R$ največja, tok vira najmanjši, $I_L = I_C = QI$; $Q = R/(\omega_0 L)$, $B = 1/(RC)$.
- Realni vzporedni krog (upornost v tuljavi): $\omega_0 = \sqrt{1/(LC) - R^2/L^2}$, $Z_0 = L/(RC)$.
- Kondenzatorske baterije in induktivnost omrežja lahko tvorijo resonanco na harmonski frekvenci in harmonsko napetost povečajo $Q$-krat.

## Za izpit

Znati moraš povedati:

- definicijo resonance za zaporedni in vzporedni krog ter kaj se pri njej zgodi s tokom, impedanco in fazo;
- definicijo kvalitete z energijo in izpeljavo $Q = \omega_0 L/R$ za zaporedni krog;
- izrek o pasovni širini, $B = \omega_0/Q$ in $\omega_1\omega_2 = \omega_0^2$, z dokazom;
- zakaj sta pri resonanci napetosti (zaporedno) oziroma tokova (vzporedno) na $L$ in $C$ $Q$-krat večja;
- izpeljavo resonančne frekvence in impedance realnega vzporednega kroga ter pogoj, da resonanca obstaja.

### Naloga 1

Tuljava z $L = 2{,}0\,\mathrm{mH}$ in upornostjo $R = 40\,\Omega$ je vzporedno vezana s kondenzatorjem $C = 100\,\mathrm{nF}$. Krog napaja sinusni vir z amplitudo $10\,\mathrm{V}$. a) Določi resonančno frekvenco in jo primerjaj z $1/(2\pi\sqrt{LC})$. b) Izračunaj impedanco pri resonanci in tok vira. c) Izračunaj amplitudi tokov v veji s tuljavo in v veji s kondenzatorjem. Zakaj nista enaka?

**Rešitev:**

1. a) $1/(LC) = 1/(2 \cdot 10^{-3} \cdot 10^{-7})\,\mathrm{s^{-2}} = 5{,}0 \cdot 10^9\,\mathrm{s^{-2}}$, $R^2/L^2 = (40/0{,}002)^2\,\mathrm{s^{-2}} = 4{,}0 \cdot 10^8\,\mathrm{s^{-2}}$.
2. $\omega_0 = \sqrt{5{,}0 \cdot 10^9 - 4{,}0 \cdot 10^8}\,\mathrm{s^{-1}} \approx 67\,820\,\mathrm{s^{-1}}$, $f_0 \approx 10{,}79\,\mathrm{kHz}$.
3. Idealna vrednost: $1/\sqrt{LC} \approx 70\,711\,\mathrm{s^{-1}}$, $11{,}25\,\mathrm{kHz}$; razlika je okoli $4\,\%$, ker je kvaliteta tuljave majhna.
4. b) $Z_0 = L/(RC) = 0{,}002/(40 \cdot 10^{-7})\,\Omega = 500\,\Omega$; tok vira $10/500\,\mathrm{A} = 20\,\mathrm{mA}$, v fazi z napetostjo.
5. c) Veja s kondenzatorjem: $I_C = U\omega_0 C = 10 \cdot 67\,820 \cdot 10^{-7}\,\mathrm{A} \approx 67{,}8\,\mathrm{mA}$.
6. Veja s tuljavo: $Z_L = \sqrt{40^2 + (67\,820 \cdot 0{,}002)^2}\,\Omega \approx 141{,}4\,\Omega$, zato $I_L \approx 10/141{,}4\,\mathrm{A} \approx 70{,}7\,\mathrm{mA}$.
7. Tokova nista nasprotna: $I_C$ prehiteva napetost za $90^\circ$, $I_L$ pa zaostaja za manj kot $90^\circ$ (za $\arctan(\omega_0 L/R) \approx 73{,}6^\circ$). Jalovi komponenti se odštejeta, delovna komponenta $I_L$ ostane in je enaka toku vira.
8. Odgovor: $f_0 \approx 10{,}8\,\mathrm{kHz}$ (idealna formula da $11{,}25\,\mathrm{kHz}$); $Z_0 = 500\,\Omega$, tok vira $20\,\mathrm{mA}$; v vejah krožita okoli $68\,\mathrm{mA}$ in $71\,\mathrm{mA}$. Kvaliteta tuljave je le $\omega_0 L/R \approx 3{,}4$, zato približki za velik $Q$ tu ne veljajo.

### Naloga 2

Za zaporedni krog $RLC$ dokaži, da je pasovna širina $B = R/L = \omega_0/Q$ in da je resonančna frekvenca geometrijska sredina mejnih. Utemelji, zakaj velja $Q = 2\pi W/W_{izg}$ z $W = \tfrac{1}{2}LI_p^2$ in zakaj je ta energija pri resonanci stalna.

**Rešitev:**

1. Moč na uporu je $\tfrac{1}{2}RI_p^2$, tok pa $I_p = U_p/|Z|$. Moč pade na polovico, ko je $|Z| = \sqrt{2}R$, torej ko je $(\omega L - 1/(\omega C))^2 = R^2$.
2. Dve enačbi: $\omega L - 1/(\omega C) = +R$ (nad resonanco) in $= -R$ (pod njo). Pomnožimo z $\omega/L$: $\omega^2 \mp (R/L)\omega - \omega_0^2 = 0$.
3. Pozitivni rešitvi: $\omega_2 = \frac{R}{2L} + s$ in $\omega_1 = -\frac{R}{2L} + s$, kjer je $s = \sqrt{R^2/(4L^2) + \omega_0^2}$.
4. $B = \omega_2 - \omega_1 = R/L$; z $Q = \omega_0 L/R$ je $R/L = \omega_0/Q$.
5. $\omega_1\omega_2 = s^2 - R^2/(4L^2) = \omega_0^2$, torej $\omega_0 = \sqrt{\omega_1\omega_2}$.
6. Pri resonanci je $i = I_p\sin\omega_0 t$, napetost na kondenzatorju zaostaja za $90^\circ$: $u_C = -X_0I_p\cos\omega_0 t$ z $X_0 = \sqrt{L/C}$.
7. Energija: $\tfrac{1}{2}Li^2 + \tfrac{1}{2}Cu_C^2 = \tfrac{1}{2}LI_p^2\sin^2\omega_0 t + \tfrac{1}{2}C\frac{L}{C}I_p^2\cos^2\omega_0 t = \tfrac{1}{2}LI_p^2$, neodvisno od časa.
8. V periodi se porabi $\tfrac{1}{2}RI_p^2 \cdot 2\pi/\omega_0$; razmerje da $2\pi W/W_{izg} = \omega_0 L/R = Q$.
9. Odgovor: $B = R/L = \omega_0/Q$, $\omega_0 = \sqrt{\omega_1\omega_2}$; pri resonanci se energija le preliva med tuljavo in kondenzatorjem, vir nadomešča samo izgube, zato je $Q$ razmerje med shranjeno in v periodi porabljeno energijo (krat $2\pi$).

## Drugače: Na sliki

Predstavljaj si gugalnico. Lastna frekvenca je $\omega_0$; potiskaš jo s periodičnimi sunki. Če potiskaš ravno ob pravem trenutku, se amplituda iz nihaja v nihaj veča, dokler izgube (trenje, upor zraka) ne požrejo toliko energije, kot je dodaš. Pri gugalnici z malo trenja (velik $Q$) je amplituda ogromna, a moraš ujeti frekvenco zelo natančno: krivulja je ozka. Pri gugalnici v vodi (majhen $Q$) je amplituda skromna, a ne zahteva natančnosti: krivulja je široka.

Električni krog je ista slika: energija se preliva med kondenzatorjem (kot višina gugalnice) in tuljavo (kot hitrost), upornik je trenje.

## Drugače: Uporaba v stroki

- **Kakovost električne energije.** Pred namestitvijo kondenzatorskih baterij v elektrarnah na obnovljive vire in v industriji izračunajo resonančno frekvenco z omrežjem; pogost približek je $h = \sqrt{S_k/Q_C}$ (razmerje kratkostične moči omrežja in moči baterije da red harmonske komponente). V Primeru 3 je $S_k \approx 1\,\mathrm{MVA}$, $Q_C \approx 40\,\mathrm{kvar}$, torej $h \approx 5$. Rešitev je **dušena** baterija z zaporedno dušilko.
- **Harmonski filtri.** Zaporedni krog, uglašen na peto ali sedmo harmonsko komponento, harmonski tok kratko sklene, preden doseže omrežje.
- **Merilniki okolja.** Ultrazvočni anemometri, ehosonde za merjenje globine snega in sodarji delujejo s pretvorniki blizu resonance, ker tam z majhno napetostjo dosežejo največjo amplitudo.
- **Brezžični prenos energije.** Pri polnjenju električnih vozil sta oddajna in sprejemna tuljava uglašeni s kondenzatorjema na isto resonančno frekvenco; tako se prenese veliko moči tudi pri šibkem sklopu.
- **Radijske komunikacije.** Senzorske mreže v naravi (merjenje pretoka rek, onesnaženosti zraka) uporabljajo sprejemnike z nihajnimi krogi in kristali, katerih $Q$ je več tisoč; tako so kanali tesno drug ob drugem.

## Drugače: Korak za korakom s številkami

Zaporedni krog $R = 10\,\Omega$, $L = 10\,\mathrm{mH}$, $C = 1\,\mu\mathrm{F}$, $U = 5\,\mathrm{V}$. Kako se tok spreminja s frekvenco?

1. Pri $\omega = 5000\,\mathrm{s^{-1}}$: $X_L = 50\,\Omega$, $X_C = 200\,\Omega$, $X = -150\,\Omega$. $|Z| = \sqrt{10^2 + 150^2}\,\Omega \approx 150{,}3\,\Omega$, tok $I \approx 33\,\mathrm{mA}$.
2. Pri $\omega = 9500\,\mathrm{s^{-1}}$: $X_L = 95\,\Omega$, $X_C \approx 105{,}3\,\Omega$, $X \approx -10{,}3\,\Omega$. $|Z| \approx 14{,}3\,\Omega$, tok okoli $0{,}35\,\mathrm{A}$, skoraj mejna frekvenca.
3. Pri $\omega = 10\,000\,\mathrm{s^{-1}}$: $X = 0$, $|Z| = 10\,\Omega$, tok $0{,}50\,\mathrm{A}$.
4. Pri $\omega = 20\,000\,\mathrm{s^{-1}}$: $X_L = 200\,\Omega$, $X_C = 50\,\Omega$, $X = 150\,\Omega$, spet $33\,\mathrm{mA}$.
5. Opazi: pri $\omega_0/2$ in $2\omega_0$ je tok enak, ker je krivulja simetrična v logaritemski skali; to je druga oblika izreka $\omega_1\omega_2 = \omega_0^2$.

## Preveri se

? Inženir pravi: »Baterija in omrežje sta pri $250\,\mathrm{Hz}$ v vzporedni resonanci.« Kaj to pomeni za harmonski tok, ki ga razsmernik injicira pri $250\,\mathrm{Hz}$?
- Tok vidi zelo majhno impedanco, zato je harmonska napetost majhna.
~ To velja za zaporedno resonanco; pri vzporedni je impedanca največja.
+ Tok vidi zelo veliko impedanco, zato je harmonska napetost na zbiralkah velika.
- Harmonski tok se v resonanci izniči.
~ Vzporedni krog tok vira ne izniči; vir ga injicira, napetost pa je $Z_0$ krat tok.
> Vzporedni krog ima pri resonanci največjo impedanco $Z_0 = L/(RC)$; napetost je $Q$-krat večja kot brez kondenzatorjev.

? Trije zaporedni krogi imajo enako $\omega_0$ in enak $R$, induktivnosti pa $1\,\mathrm{mH}$, $10\,\mathrm{mH}$ in $100\,\mathrm{mH}$. Uredi jih po pasovni širini od najožje do najširše.
+ $100\,\mathrm{mH}$, $10\,\mathrm{mH}$, $1\,\mathrm{mH}$
- $1\,\mathrm{mH}$, $10\,\mathrm{mH}$, $100\,\mathrm{mH}$
~ Večja $L$ pri enaki $\omega_0$ pomeni večjo $Q = \omega_0 L/R$ in ožji pas $B = R/L$.
- Vsi imajo enako pasovno širino, ker je $\omega_0$ enaka.
~ $\omega_0$ določi lego vrha, širino pa $R/L$.
> $B = R/L$: pri enakem $R$ ima največja $L$ najožji pas.

? Kaj se zgodi z resonančno frekvenco zaporednega kroga, če kapacitivnost zmanjšamo na četrtino?
- Zmanjša se na četrtino.
~ $\omega_0 \propto 1/\sqrt{C}$; manjša $C$ poveča frekvenco.
- Poveča se štirikrat.
~ Odvisnost je s korenom: četrtina $C$ da $\sqrt{4} = 2$.
+ Podvoji se.
> $\omega_0 = 1/\sqrt{LC}$; $C \to C/4$ da $\omega_0 \to 2\omega_0$.

? Zaporedni krog ima $L = 50\,\mathrm{mH}$, $C = 20\,\mathrm{nF}$ in $R = 25\,\Omega$. Kolikšna je kvaliteta?
- $0{,}016$
~ Izračunal si $R/X_0$; kvaliteta zaporednega kroga je obratno razmerje, $X_0/R$.
+ $63$
- $1580$
~ Vzel si $X_0 = \sqrt{L/C} \approx 1581\,\Omega$, a pozabil deliti z $R$.
> $X_0 = \sqrt{0{,}05/(2 \cdot 10^{-8})}\,\Omega \approx 1581\,\Omega$, $Q = 1581/25 \approx 63$.

? Krog iz prejšnjega vprašanja priključimo pri resonanci na vir z amplitudo $2{,}0\,\mathrm{V}$. Kolikšna je amplituda napetosti na kondenzatorju?
- $2{,}0\,\mathrm{V}$
~ Kazalca $U_L$ in $U_C$ se odštejeta, a vsak zase je $Q$-krat večji od napetosti vira.
- $1{,}0\,\mathrm{V}$
~ Napetost vira se ne razdeli na pol med $L$ in $C$; pri resonanci je vsa napetost vira na uporu.
+ okoli $126\,\mathrm{V}$
> $U_C = QU \approx 63 \cdot 2{,}0\,\mathrm{V} \approx 126\,\mathrm{V}$.

:::simboli
Z | impedanca | | Ω
Z_0 | impedanca pri resonanci | Z_0 = \frac{L}{RC} | Ω | realni vzporedni krog
Z_L | velikost impedance veje s tuljavo | Z_L = \sqrt{R^2 + \omega^2 L^2} | Ω
Y | admitanca | Y = \frac{1}{Z} | S
R | upornost | | Ω
L | induktivnost | | H
C | kapacitivnost | | F
\omega | krožna frekvenca | \omega = 2\pi f | 1/s
\omega_0 | resonančna krožna frekvenca | \omega_0 = \frac{1}{\sqrt{LC}} | 1/s
\omega_1, \omega_2 | mejni krožni frekvenci | \omega_1 \omega_2 = \omega_0^2 | 1/s | moč pade na polovico
f, f_0 | frekvenca, resonančna frekvenca | f_0 = \frac{\omega_0}{2\pi} | Hz
f_1, f_2 | mejni frekvenci | | Hz
\Delta f | pasovna širina v hercih | \Delta f = \frac{f_0}{Q} | Hz
B | pasovna širina | B = \omega_2 - \omega_1 | 1/s
Q | kvaliteta kroga | Q = \frac{\omega_0 L}{R} | – | zaporedno
X_0 | karakteristična upornost | X_0 = \sqrt{\frac{L}{C}} | Ω
I, I_0 | tok, tok pri resonanci | I_0 = \frac{U}{R} | A
I_p | temenska vrednost toka | | A
I_5 | tok pete harmonske komponente | | A
I_L, I_C | tokova v vejah s tuljavo in kondenzatorjem | | A
U | napetost vira | | V
U_L, U_C | napetost na tuljavi in kondenzatorju | U_C = QU | V | pri resonanci
U_R | napetost na uporu | | V
U_5 | napetost pete harmonske komponente | | V
U_f | fazna napetost omrežja | | V
W | shranjena energija | W = \frac{1}{2}LI_p^2 | J
W_{izg} | izgube v eni periodi | | J
:::
