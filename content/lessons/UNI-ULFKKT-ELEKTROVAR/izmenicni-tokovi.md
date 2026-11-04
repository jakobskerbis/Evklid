---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na gradbišču je betonski mešalnik priključen na vtičnico $230\,\mathrm{V}$. Tokovne klešče na dovodnem kablu kažejo $3{,}83\,\mathrm{A}$. Sošolec hitro izračuna: »Moč je $U I$, torej $230\,\mathrm{V} \cdot 3{,}83\,\mathrm{A} \approx 881\,\mathrm{W}$. Toliko energije v sekundi gre v boben.«

Števec električne energije na gradbiščni omarici se s tem ne strinja. V eni uri našteje le okoli $0{,}53\,\mathrm{kWh}$, ne $0{,}88\,\mathrm{kWh}$. Kdo ima prav in kam gre razlika? Odgovor skriva izmenični tok: napetost in tok v motorju nista »v koraku«. Do konca lekcije boš sošolčevo trditev popravil s tremi orodji: s kazalci, z impedanco ter z delovno in jalovo močjo. Ista orodja rabi električar, ko izbira presek kabla za delavnico ali kondenzatorje za kompenzacijo.

## Razlaga

Gradimo po en kos naenkrat. Večina kosov se konča s kratkim preverjanjem.

**1. Sinusna napetost.** V omrežju napetost ni stalna kot pri bateriji. Niha po sinusu: $u(t) = U_\mathrm{m} \sin(\omega t)$. Pri tem je $U_\mathrm{m}$ temenska (največja) vrednost, $f = 50\,\mathrm{Hz}$ frekvenca in $\omega = 2\pi f \approx 314\,\mathrm{s^{-1}}$ krožna frekvenca. Smer toka se zamenja stokrat v sekundi.

*Preveri:* kolikokrat v sekundi doseže napetost vrh $+U_\mathrm{m}$? (Petdesetkrat, enkrat na periodo $T = 1/f = 20\,\mathrm{ms}$.)

**2. Efektivna vrednost.** Napis »$230\,\mathrm{V}$« ni vrh sinusa. Je **efektivna vrednost** $U$: enosmerna napetost, ki bi v istem grelcu sprostila enako toploto. Natančno: naj bo $u(t)$ periodična s periodo $T$; njena efektivna vrednost je koren povprečja kvadrata,

$$U = \sqrt{\frac{1}{T}\int_0^T u^2(t)\,\mathrm{d}t}.$$

*Izpeljava za sinus.* Za $u = U_\mathrm{m}\sin\omega t$ je $u^2 = U_\mathrm{m}^2 \sin^2\omega t = \tfrac12 U_\mathrm{m}^2\,(1 - \cos 2\omega t)$. Integral kosinusa čez celo periodo je nič, zato je povprečje $u^2$ enako $\tfrac12 U_\mathrm{m}^2$ in $U = U_\mathrm{m}/\sqrt{2}$. Enako za tok $I = I_\mathrm{m}/\sqrt{2}$. Faktor $\sqrt{2}$ velja le za sinusno obliko. Ampermetri in voltmetri kažejo efektivne vrednosti; vse formule spodaj jih uporabljajo.

*Preveri:* kolikšen je vrh omrežne napetosti? ($U_\mathrm{m} = 230\,\mathrm{V} \cdot \sqrt{2} \approx 325\,\mathrm{V}$.)

**3. Kazalci.** Namesto risanja dveh sinusov nad časovno osjo narišemo puščici. **Kazalec** je puščica, katere dolžina je efektivna vrednost, kot glede na vodoravnico pa faza (za koliko je sinus zamaknjen v času). Predstavljaj si, da se vse puščice vrtijo skupaj s kotno hitrostjo $\omega$. Ker se vrtijo skupaj, jih lahko »zamrznemo« in gledamo le kot med njimi. Kot med kazalcem napetosti in kazalcem toka je **fazni kot** $\varphi$.

**4. Trije elementi.** Upornik, tuljava in kondenzator se na izmenično napetost odzovejo različno. **Tuljava** (navitje žice, npr. v motorju ali transformatorju) ima induktivnost $L$ v henryjih ($\mathrm{H}$); spremembam toka se upira. **Kondenzator** ima kapacitivnost $C$ v faradih ($\mathrm{F}$); se izmenično polni in prazni. Namesto upornosti imata **reaktanco** $X$, tudi v ohmih:

| element | »upor« pri $\omega$ | tok glede na napetost | večja $f$ |
|---|---|---|---|
| upornik | $R$ | v fazi, $\varphi = 0$ | nič se ne spremeni |
| tuljava | $X_L = \omega L$ | zaostaja za $90^\circ$ | $X_L$ raste |
| kondenzator | $X_C = \dfrac{1}{\omega C}$ | prehiteva za $90^\circ$ | $X_C$ pada |

*Izpeljava.* Za idealno tuljavo velja $u_L = L\,\dfrac{\mathrm{d}i}{\mathrm{d}t}$. Naj bo $i = I_\mathrm{m}\sin\omega t$; potem $u_L = \omega L I_\mathrm{m}\cos\omega t = \omega L I_\mathrm{m}\sin(\omega t + 90^\circ)$. Amplituda napetosti je $\omega L$-krat amplituda toka, torej $X_L = \omega L$, in napetost prehiteva tok za $90^\circ$ (tok zaostaja). Za kondenzator velja $i_C = C\,\dfrac{\mathrm{d}u}{\mathrm{d}t}$; iz $u = U_\mathrm{m}\sin\omega t$ dobimo $i = \omega C U_\mathrm{m}\sin(\omega t + 90^\circ)$, zato $X_C = \dfrac{1}{\omega C}$ in tok prehiteva napetost za $90^\circ$.

:::premisli
Kondenzator priključimo najprej na baterijo, nato na omrežje. Kje bo tekel stalen tok in zakaj?
---
Le v omrežju. Pri enosmerni napetosti je $\omega = 0$, zato je $X_C = \dfrac{1}{\omega C}$ neskončen: kondenzator se nabije in tok preneha. Pri $50\,\mathrm{Hz}$ se neprestano polni in prazni, zato tok teče.
:::

*Preveri:* kaj se zgodi z $X_L$, če frekvenco podvojimo? (Podvoji se.)

**5. Impedanca.** Navitje motorja ima hkrati upornost žice $R$ in reaktanco $X_L$. Tok skozi oba je isti. Napetost na $R$ je z njim v fazi, napetost na tuljavi pa ga prehiteva za $90^\circ$. Napetosti na njiju torej nista v fazi, zato ju ne seštevamo kot števili, ampak kot kazalca pod pravim kotom. Nastane pravokotni trikotnik. Hipotenuza je **impedanca** $Z$, skupni »upor« vezja:

$$Z = \sqrt{R^2 + X^2}, \quad X = X_L - X_C$$

Ohmov zakon velja z impedanco: $I = U/Z$. Fazni kot preberemo iz istega trikotnika: $\cos\varphi = R/Z$.

Natančno: naj bodo $R$, $L$ in $C$ vezani zaporedno na sinusno napetost s krožno frekvenco $\omega$, v ustaljenem stanju. Skupni tok $I$ vzamemo za referenco. $U_R = IR$ leži v smeri toka, $U_L = IX_L$ in $U_C = IX_C$ sta pravokotna nanj in nasprotno usmerjena, zato je njuna vsota $I(X_L - X_C)$. Po Pitagori $U = I\sqrt{R^2 + X^2}$, kar da $Z$, in $\tan\varphi = X/R$. Če je $X > 0$, je vezje induktivno (tok zaostaja), če je $X < 0$, kapacitivno (tok prehiteva). Pri $X_L = X_C$, torej pri **resonančni** krožni frekvenci $\omega_0 = 1/\sqrt{LC}$, je $Z = R$ najmanjša, tok največji in $\varphi = 0$.

:::premisli
Sošolec iz uvoda veže upornik $30\,\Omega$ in tuljavo z $X_L = 40\,\Omega$ zaporedno in zapiše $Z = 70\,\Omega$. Kje se zmoti in koliko je prav? Utemelji s kazalcema, ne le s formulo.
---
$50\,\Omega$. Kazalca sta pravokotna, zato velja Pitagora: $\sqrt{30^2 + 40^2} = 50$. Vsota $70\,\Omega$ bi veljala le, če bi bila napetosti v fazi.
:::

**6. Tri moči.** Moč v vsakem trenutku je $p = u \cdot i$. Ker sta $u$ in $i$ zamaknjena, je $p$ del periode negativna: tuljava energijo vrne v omrežje. Zato ločimo tri moči:

- **delovna moč** $P = U I \cos\varphi$ v vatih ($\mathrm{W}$): povprečje, ki se spremeni v toploto ali mehansko delo; to šteje števec;
- **jalova moč** $Q = U I \sin\varphi$ v voltamperih reaktivnih ($\mathrm{var}$): energija, ki niha sem in tja med virom in poljem tuljave ali kondenzatorja;
- **navidezna moč** $S = U I$ v voltamperih ($\mathrm{VA}$): določa tok, ki ga morajo prenesti kabli.

Moči tvorijo **trikotnik moči**: $P$ vodoravno, $Q$ navpično, $S$ hipotenuza, $S^2 = P^2 + Q^2$. Razmerje $\cos\varphi = P/S$ je **faktor moči**.

*Izpeljava delovne moči.* Naj bo $u = \sqrt{2}\,U\sin\omega t$ in $i = \sqrt{2}\,I\sin(\omega t - \varphi)$. Z $\sin a \sin b = \tfrac12[\cos(a - b) - \cos(a + b)]$ dobimo $p = ui = UI\cos\varphi - UI\cos(2\omega t - \varphi)$. Drugi člen niha z dvojno frekvenco in ima povprečje čez periodo nič, zato $P = UI\cos\varphi$. Pri zaporedni vezavi z $U = IZ$ in $\cos\varphi = R/Z$ sledi $P = I^2 R$, enako $Q = I^2 X$: delovno moč troši le upornost.

*Preveri:* koliko je $P$ pri čisti tuljavi? (Nič, ker je $\varphi = 90^\circ$ in $\cos 90^\circ = 0$.)

**Kompenzacija.** Kondenzator, vezan vzporedno k induktivnemu bremenu, ima jalovo moč nasprotnega predznaka, $Q_C = U^2/X_C = \omega C U^2$. Napetost na bremenu ostane ista, zato se $P$ ne spremeni; skupna jalova moč $Q - Q_C$ pa pade, z njo $S$ in tok v dovodu. Za dvig faktorja moči s $\cos\varphi_1$ na $\cos\varphi_2$ potrebujemo $Q_C = P(\tan\varphi_1 - \tan\varphi_2)$, ker je $Q = P\tan\varphi$.

Sošolec je izračunal $S$, ne $P$. To je jedro napake iz uvoda.

## Rešeni primeri

### Primer 1: dušilka v delavnici

Stara fluorescenčna svetilka v mizarski delavnici ima dušilko (tuljavo) z induktivnostjo $0{,}5\,\mathrm{H}$. Upornost navitja zanemarimo. Kolikšna je reaktanca dušilke in kolikšen tok bi tekel, če bi jo sámo priključili na $230\,\mathrm{V}$, $50\,\mathrm{Hz}$?

**Podatki:** $L = 0{,}5\,\mathrm{H}$, $U = 230\,\mathrm{V}$, $f = 50\,\mathrm{Hz}$, $R \approx 0$
**Iščemo:** reaktanco $X_L$ in tok $I$

:::formula
$X_L = 2\pi f L$, $\quad I = \dfrac{U}{X_L}$
:::

**Rešitev:**

1. Reaktanca, ker je element tuljava: $X_L = 2\pi \cdot 50\,\mathrm{Hz} \cdot 0{,}5\,\mathrm{H} \approx 157{,}1\,\Omega$.
2. Brez upornosti je $Z = X_L$, zato $I = \dfrac{230\,\mathrm{V}}{157{,}1\,\Omega} \approx 1{,}46\,\mathrm{A}$.
3. Odgovor: reaktanca je približno $157\,\Omega$, tok pa $1{,}46\,\mathrm{A}$. Delovna moč je kljub toku enaka nič, ker je $\varphi = 90^\circ$.

### Primer 2: mešalnik iz uvoda

Navitje motorja mešalnika ima pri $50\,\mathrm{Hz}$ upornost $36\,\Omega$ in induktivno reaktanco $48\,\Omega$. Priključeno je na $230\,\mathrm{V}$. Izračunaj tok, faktor moči ter delovno, jalovo in navidezno moč.

**Podatki:** $R = 36\,\Omega$, $X_L = 48\,\Omega$, $U = 230\,\mathrm{V}$
**Iščemo:** $I$, $\cos\varphi$, $P$, $Q$, $S$

:::formula
$Z = \sqrt{R^2 + X_L^2}$, $\quad I = \dfrac{U}{Z}$, $\quad \cos\varphi = \dfrac{R}{Z}$

$P = UI\cos\varphi$, $\quad Q = UI\sin\varphi$, $\quad S = UI$
:::

**Rešitev:**

1. Kazalca $R$ in $X_L$ sta pravokotna: $Z = \sqrt{36^2 + 48^2}\,\Omega = 60\,\Omega$.
2. Tok po Ohmovem zakonu: $I = \dfrac{230\,\mathrm{V}}{60\,\Omega} \approx 3{,}83\,\mathrm{A}$. To je tok s klešč.
3. Faktor moči: $\cos\varphi = \dfrac{36}{60} = 0{,}6$, zato $\sin\varphi = 0{,}8$ in $\varphi \approx 53{,}1^\circ$.
4. Navidezna moč: $S = 230\,\mathrm{V} \cdot 3{,}833\,\mathrm{A} \approx 882\,\mathrm{VA}$.
5. Delovna moč: $P = S \cos\varphi \approx 882 \cdot 0{,}6\,\mathrm{W} \approx 529\,\mathrm{W}$. Preverimo z $I^2 R = 3{,}833^2 \cdot 36 \approx 529\,\mathrm{W}$; toplota in delo nastajata le v »$R$-delu«.
6. Jalova moč: $Q = S \sin\varphi \approx 705\,\mathrm{var}$.
7. Odgovor: tok je $3{,}83\,\mathrm{A}$, $\cos\varphi = 0{,}6$, $P \approx 529\,\mathrm{W}$, $Q \approx 705\,\mathrm{var}$, $S \approx 882\,\mathrm{VA}$. Sošolec je izračunal $S$; števec šteje $P$, zato v eni uri pokaže $0{,}53\,\mathrm{kWh}$.

### Primer 3 (izpitna raven): kompresor iz meritve in kompenzacija

Električar v kleparski delavnici izmeri na kompresorju napetost $230\,\mathrm{V}$, tok $8\,\mathrm{A}$ in z vatmetrom delovno moč $1{,}29\,\mathrm{kW}$ pri $50\,\mathrm{Hz}$. (a) Kolikšna sta faktor moči in jalova moč? (b) Kompresor predstavimo z zaporedno vezavo upornika in tuljave; določi $R$ in $L$. (c) Kolikšen kondenzator, vezan vzporedno, dvigne faktor moči na $0{,}95$ in kolikšen tok potem teče po dovodu?

**Podatki:** $U = 230\,\mathrm{V}$, $I = 8\,\mathrm{A}$, $P = 1290\,\mathrm{W}$, $f = 50\,\mathrm{Hz}$, želeni $\cos\varphi_2 = 0{,}95$
**Iščemo:** $\cos\varphi$, $Q$, $R$, $L$, kapacitivnost $C$ in tok $I_2$

:::formula
$S = UI$, $\quad \cos\varphi = \dfrac{P}{S}$, $\quad Q = \sqrt{S^2 - P^2}$, $\quad R = \dfrac{P}{I^2}$, $\quad X_L = \dfrac{Q}{I^2}$

kondenzator: $Q_C = P(\tan\varphi_1 - \tan\varphi_2) = \omega C U^2$, $\quad I_2 = \dfrac{P}{U\cos\varphi_2}$
:::

**Rešitev:**

1. Navidezna moč: $S = 230\,\mathrm{V} \cdot 8\,\mathrm{A} = 1840\,\mathrm{VA}$.
2. Faktor moči: $\cos\varphi = \dfrac{1290}{1840} \approx 0{,}70$, torej $\varphi \approx 45{,}5^\circ$.
3. Jalova moč iz trikotnika moči: $Q = \sqrt{1840^2 - 1290^2}\,\mathrm{var} \approx 1312\,\mathrm{var}$.
4. Nadomestno vezje: delovno moč troši le upornost, zato $R = \dfrac{1290\,\mathrm{W}}{(8\,\mathrm{A})^2} \approx 20{,}2\,\Omega$; jalova moč je v tuljavi, $X_L = \dfrac{1312}{64}\,\Omega \approx 20{,}5\,\Omega$.
5. Induktivnost: $L = \dfrac{X_L}{2\pi f} = \dfrac{20{,}5\,\Omega}{314{,}16\,\mathrm{s^{-1}}} \approx 0{,}0653\,\mathrm{H} = 65\,\mathrm{mH}$. Preverimo: $\sqrt{20{,}2^2 + 20{,}5^2} \approx 28{,}8\,\Omega \approx \dfrac{230}{8}$.
6. Pri $\cos\varphi_2 = 0{,}95$ je $\tan\varphi_2 = \dfrac{\sqrt{1 - 0{,}95^2}}{0{,}95} \approx 0{,}329$, zato ostane $Q_2 = 1290 \cdot 0{,}329 \approx 424\,\mathrm{var}$.
7. Kondenzator prevzame razliko, ker $P$ ostane enaka: $Q_C = 1312 - 424 = 888\,\mathrm{var}$.
8. Kapacitivnost: $C = \dfrac{Q_C}{2\pi f U^2} = \dfrac{888}{314{,}16 \cdot 230^2}\,\mathrm{F} \approx 53\,\mu\mathrm{F}$.
9. Nov tok: $I_2 = \dfrac{1290\,\mathrm{W}}{230\,\mathrm{V} \cdot 0{,}95} \approx 5{,}9\,\mathrm{A}$.
10. Odgovor: $\cos\varphi \approx 0{,}70$, $Q \approx 1312\,\mathrm{var}$; kompresor je kot $R \approx 20{,}2\,\Omega$ zaporedno z $L \approx 65\,\mathrm{mH}$; kondenzator $53\,\mu\mathrm{F}$ dvigne faktor moči na $0{,}95$ in zmanjša tok z $8\,\mathrm{A}$ na $5{,}9\,\mathrm{A}$.

:::premisli
Kolikšen $C$ bi jalovo moč povsem kompenziral? Kolikšen tok bi tedaj tekel po dovodu?
---
$C = \dfrac{Q_C}{2\pi f U^2} = \dfrac{1312}{2\pi \cdot 50 \cdot 230^2}\,\mathrm{F} \approx 79\,\mu\mathrm{F}$. Po kompenzaciji je $S = P$, zato $I = \dfrac{1290\,\mathrm{W}}{230\,\mathrm{V}} \approx 5{,}6\,\mathrm{A}$ namesto $8\,\mathrm{A}$. Kompresor dela enako, kabel pa je manj obremenjen. Za zadnjih $0{,}3\,\mathrm{A}$ bi potrebovali še $26\,\mu\mathrm{F}$, zato v praksi kompenziramo le do okoli $0{,}95$.
:::

## Pogoste napake

- **»Moč je vedno $UI$.«** To velja le za grelce in žarnice z nitko, kjer je $\varphi = 0$. Pri motorjih je $UI$ navidezna moč v $\mathrm{VA}$. Delovno moč dobiš šele s faktorjem $\cos\varphi$.
- **Upornost in reaktanco seštejemo.** $Z = R + X_L$ je napačno, ker napetosti na $R$ in na $L$ nista v fazi. Kazalca sta pravokotna, zato $Z = \sqrt{R^2 + X^2}$.
- **»$230\,\mathrm{V}$ je največja napetost.«** Je efektivna vrednost. Vrh je $325\,\mathrm{V}$, kar je pomembno pri izbiri izolacije in kondenzatorjev. V formulah za moč pa uporabljaš $230\,\mathrm{V}$, ne $325\,\mathrm{V}$.
- **»Jalova moč se porabi in jo plačamo kot toploto.«** Jalova energija niha med virom in tuljavo ter se ne spremeni v delo. Škodi pa posredno: poveča tok, zato se bolj grejejo kabli in transformatorji.
- **»Pri višji frekvenci ima kondenzator večji upor.«** Obratno: $X_C = \dfrac{1}{\omega C}$ pada s frekvenco. S frekvenco raste $X_L$.

## Povzetek

- Omrežje: $230\,\mathrm{V}$ efektivno, $f = 50\,\mathrm{Hz}$, vrh $U_\mathrm{m} = \sqrt{2}\,U \approx 325\,\mathrm{V}$.
- Kazalec: puščica z dolžino efektivne vrednosti; kot med $U$ in $I$ je fazni kot $\varphi$.
- Reaktanci: $X_L = \omega L$ (tok zaostaja $90^\circ$), $X_C = 1/(\omega C)$ (tok prehiteva $90^\circ$).
- Impedanca: $Z = \sqrt{R^2 + (X_L - X_C)^2}$, $I = U/Z$, $\cos\varphi = R/Z$.
- Moči: $P = UI\cos\varphi$ (W), $Q = UI\sin\varphi$ (var), $S = UI$ (VA), $S^2 = P^2 + Q^2$.
- Kompenzacija: vzporedni kondenzator zmanjša $Q$ in tok, $P$ ostane enak.

## Za izpit

Znati moraš povedati:

- definicijo efektivne vrednosti periodične napetosti in izpeljavo $U = U_\mathrm{m}/\sqrt{2}$ za sinus;
- izpeljavo $X_L = \omega L$ in $X_C = 1/(\omega C)$ ter faznih zamikov iz $u_L = L\,\mathrm{d}i/\mathrm{d}t$ in $i_C = C\,\mathrm{d}u/\mathrm{d}t$;
- impedanco zaporedne vezave $RLC$ s kazalčnim diagramom, fazni kot, kdaj je vezje induktivno ali kapacitivno, in resonanco $\omega_0 = 1/\sqrt{LC}$;
- izpeljavo $P = UI\cos\varphi$ iz trenutne moči, definicije $Q$, $S$ in faktorja moči, $S^2 = P^2 + Q^2$;
- kompenzacijo: zakaj vzporedni kondenzator ne spremeni $P$ in kako izračunaš potreben $C$.

### Naloga 1

Upornik $R = 40\,\Omega$, tuljava $L = 0{,}20\,\mathrm{H}$ in kondenzator $C = 100\,\mu\mathrm{F}$ so vezani zaporedno na $230\,\mathrm{V}$, $50\,\mathrm{Hz}$. (a) Izračunaj tok in fazni kot; je vezje induktivno ali kapacitivno? (b) Izračunaj $P$, $Q$ in $S$. (c) Izračunaj napetosti na posameznih elementih in pojasni, zakaj je $U_L$ večja od napetosti vira. (d) Pri kateri frekvenci bi bil tok največji in kolikšen bi bil tedaj, pri isti efektivni napetosti?

**Rešitev:**

1. $\omega = 2\pi \cdot 50\,\mathrm{Hz} \approx 314{,}16\,\mathrm{s^{-1}}$; $X_L = 314{,}16 \cdot 0{,}20\,\Omega \approx 62{,}83\,\Omega$; $X_C = \dfrac{1}{314{,}16 \cdot 100 \cdot 10^{-6}}\,\Omega \approx 31{,}83\,\Omega$.
2. $X = X_L - X_C \approx 31{,}00\,\Omega > 0$, zato je vezje induktivno in tok zaostaja.
3. $Z = \sqrt{40^2 + 31{,}00^2}\,\Omega \approx 50{,}61\,\Omega$; $I = \dfrac{230}{50{,}61}\,\mathrm{A} \approx 4{,}545\,\mathrm{A}$.
4. $\cos\varphi = \dfrac{40}{50{,}61} \approx 0{,}790$, $\varphi \approx 37{,}8^\circ$.
5. $P = I^2 R = 4{,}545^2 \cdot 40\,\mathrm{W} \approx 826\,\mathrm{W}$; $Q = I^2 X = 4{,}545^2 \cdot 31{,}00\,\mathrm{var} \approx 640\,\mathrm{var}$; $S = 230 \cdot 4{,}545\,\mathrm{VA} \approx 1045\,\mathrm{VA}$. Preverimo: $\sqrt{826^2 + 640^2} \approx 1045$.
6. $U_R = IR \approx 181{,}8\,\mathrm{V}$, $U_L = IX_L \approx 285{,}6\,\mathrm{V}$, $U_C = IX_C \approx 144{,}7\,\mathrm{V}$.
7. $U_L > U$, ker se $U_L$ in $U_C$ kot kazalca odštevata: $\sqrt{181{,}8^2 + (285{,}6 - 144{,}7)^2} \approx 230\,\mathrm{V}$. Efektivnih napetosti na zaporednih elementih ne seštevamo kot števil.
8. Tok je največji pri resonanci, ko je $Z = R$: $f_0 = \dfrac{1}{2\pi\sqrt{LC}} = \dfrac{1}{2\pi\sqrt{0{,}20 \cdot 10^{-4}}}\,\mathrm{Hz} \approx 35{,}6\,\mathrm{Hz}$.
9. Tedaj $I_0 = \dfrac{230}{40}\,\mathrm{A} = 5{,}75\,\mathrm{A}$, $P = 230 \cdot 5{,}75\,\mathrm{W} \approx 1323\,\mathrm{W}$; pri resonanci je $X_L = X_C = \omega_0 L = \sqrt{L/C}$, zato je na tuljavi in kondenzatorju po $I_0\sqrt{L/C} \approx 5{,}75 \cdot 44{,}7\,\mathrm{V} \approx 257\,\mathrm{V}$.
10. Odgovor: $I \approx 4{,}55\,\mathrm{A}$, $\varphi \approx 37{,}8^\circ$ (induktivno); $P \approx 826\,\mathrm{W}$, $Q \approx 640\,\mathrm{var}$, $S \approx 1045\,\mathrm{VA}$; $U_R \approx 182\,\mathrm{V}$, $U_L \approx 286\,\mathrm{V}$, $U_C \approx 145\,\mathrm{V}$; največji tok $5{,}75\,\mathrm{A}$ teče pri $f_0 \approx 35{,}6\,\mathrm{Hz}$.

### Naloga 2

Naj bo $u = \sqrt{2}\,U\sin\omega t$ napetost na bremenu in $i = \sqrt{2}\,I\sin(\omega t - \varphi)$ tok skozenj. Izpelji trenutno moč $p(t)$ in dokaži, da je povprečna moč $P = UI\cos\varphi$. Utemelji, ali idealna tuljava troši delovno moč, in pokaži, da za zaporedno vezavo $R$ in $L$ velja $P = I^2 R$.

**Rešitev:**

1. $p = ui = 2UI\sin\omega t\,\sin(\omega t - \varphi)$.
2. Z $\sin a\sin b = \tfrac12[\cos(a - b) - \cos(a + b)]$ pri $a = \omega t$, $b = \omega t - \varphi$: $p = UI\cos\varphi - UI\cos(2\omega t - \varphi)$.
3. Povprečje čez periodo $T = 2\pi/\omega$: prvi člen je stalen, integral $\cos(2\omega t - \varphi)$ čez $T$ obsega dve celi periodi in je nič. Zato $P = \dfrac1T\displaystyle\int_0^T p\,\mathrm{d}t = UI\cos\varphi$.
4. Idealna tuljava: $\varphi = 90^\circ$, zato $P = 0$; $p(t) = -UI\cos(2\omega t - 90^\circ)$ je polovico časa pozitivna, polovico negativna: energijo sprejme in vrne. Delovne moči ne troši.
5. Zaporedna $R$, $L$: $U = IZ$ in $\cos\varphi = R/Z$, zato $P = IZ \cdot I \cdot \dfrac{R}{Z} = I^2 R$.
6. Odgovor: $P = UI\cos\varphi$ je časovno povprečje $p(t)$; idealna tuljava ne troši delovne moči, v vezju $RL$ se vsa delovna moč sprosti na upornosti, $P = I^2 R$.

## Drugače: Na sliki

Nariši vodoravno puščico toka $I$. Ker je pri zaporedni vezavi tok skupen, je to referenca.

- Napetost na uporniku $U_R = IR$ leži na isti vodoravnici, ker je v fazi s tokom.
- Napetost na tuljavi $U_L = I X_L$ kaže navpično navzgor, ker ji tok sledi z zamikom $90^\circ$.
- Napetost na kondenzatorju $U_C = I X_C$ bi kazala navpično navzdol.

Postavi $U_L$ na konec $U_R$. Puščica od začetka $U_R$ do konca $U_L$ je napetost vira $U$. Dobiš pravokotni trikotnik, kot $\varphi$ je ob oglišču, kjer se začne $U_R$.

Vse stranice deli s tokom $I$: dobiš trikotnik $R$, $X$, $Z$. Vse pomnoži s tokom $I$: dobiš trikotnik $P$, $Q$, $S$. Trije trikotniki so si podobni, zato imajo isti kot $\varphi$. Za mešalnik iz Primera 2 so stranice v razmerju $3 : 4 : 5$.

## Drugače: Uporaba v stroki

- **Pogoni v procesni industriji.** Črpalke, mešala, kompresorji in ventilatorji so asinhronski motorji s $\cos\varphi$ okoli $0{,}7$ do $0{,}9$. Podjetje plača jalovo energijo, če je povprečni faktor moči pod predpisano mejo (pogosto $0{,}95$), zato ima v razdelilni postaji avtomatsko kondenzatorsko baterijo, ki stopenjsko vklaplja kondenzatorje.
- **Konduktometrija.** Prevodnost raztopin merimo z izmenično napetostjo (navadno okoli $1\,\mathrm{kHz}$), ker bi enosmerni tok elektrode polariziral in spremenil sestavo raztopine ob njih.
- **Elektrokemijska impedančna spektroskopija.** Na elektrodo pritisnemo majhno izmenično napetost pri frekvencah od mHz do MHz in merimo impedanco in fazni kot v odvisnosti od $\omega$. Dvoplastno kapacitivnost in upornost prenosa naboja odčitamo iz nadomestnega vezja $R$–$C$, tako preučujemo korozijo, baterije in prevleke.
- **Varnost.** Izolacija mora zdržati vrh $325\,\mathrm{V}$, ne $230\,\mathrm{V}$; kondenzatorji kompenzacije ostanejo po izklopu nabiti, zato imajo praznilne upornike.

## Drugače: Bolj natančno

Kazalec je kompleksno število. Napetost $u(t) = \sqrt{2}\,U\sin(\omega t)$ zapišemo kot $\underline{U} = U\,e^{j0}$, kjer je $j^2 = -1$. Iz $u_L = L\,\dfrac{\mathrm{d}i}{\mathrm{d}t}$ sledi, da odvod sinusa pomeni množenje kazalca z $j\omega$. Zato:

$$\underline{Z}_R = R, \quad \underline{Z}_L = j\omega L, \quad \underline{Z}_C = \frac{1}{j\omega C} = -\frac{j}{\omega C}$$

Zaporedne impedance seštevamo kot kompleksna števila: $\underline{Z} = R + j(X_L - X_C)$. Absolutna vrednost je $Z = \sqrt{R^2 + X^2}$, argument pa $\varphi$. Vzporedne vezave računamo kot upornike: $\dfrac{1}{\underline{Z}} = \dfrac{1}{\underline{Z}_1} + \dfrac{1}{\underline{Z}_2}$.

**Kompleksna moč.** $\underline{S} = \underline{U}\,\underline{I}^{*} = P + jQ$: realni del je delovna moč $UI\cos\varphi$, imaginarni jalova $UI\sin\varphi$, absolutna vrednost navidezna moč $S$.

## Preveri se

? Katera trditev o idealni tuljavi na izmenični napetosti je pravilna?
- Tok je v fazi z napetostjo, ker tuljava nima upornosti.
~ V fazi je tok le pri uporniku. Pri tuljavi tok zaostaja za $90^\circ$.
+ Tok teče, delovna moč pa je enaka nič.
- Tuljava porabi moč $UI$, ki se spremeni v toploto.
~ $UI$ je navidezna moč. Pri $\varphi = 90^\circ$ je $P = UI\cos\varphi = 0$; energija le niha.
- Pri višji frekvenci skozi tuljavo teče večji tok.
~ $X_L = \omega L$ s frekvenco raste, zato tok pada. Narašča tok skozi kondenzator.
> Tok zaostaja za $90^\circ$, zato je $\cos\varphi = 0$ in $P = 0$. Tuljava energijo v enem delu periode sprejme, v drugem vrne.

? Upornik $40\,\Omega$ in tuljava z $X_L = 30\,\Omega$ sta zaporedno na $230\,\mathrm{V}$. Kolikšen je tok?
- $3{,}29\,\mathrm{A}$
~ To je $\dfrac{230}{40 + 30}$. Upornosti in reaktance ne seštevamo kot števil, ker nista v fazi.
- $5{,}75\,\mathrm{A}$
~ To je $\dfrac{230}{40}$, kot da tuljave ni. Tudi reaktanca zmanjša tok.
+ $4{,}6\,\mathrm{A}$
> $Z = \sqrt{40^2 + 30^2}\,\Omega = 50\,\Omega$, $I = \dfrac{230\,\mathrm{V}}{50\,\Omega} = 4{,}6\,\mathrm{A}$.

? Rešitev naloge: »$U = 230\,\mathrm{V}$, $I = 6\,\mathrm{A}$, $\cos\varphi = 0{,}8$. (1) $S = UI = 1380\,\mathrm{VA}$. (2) $P = S\cos\varphi = 1104\,\mathrm{W}$. (3) $Q = S - P = 276\,\mathrm{var}$.« Kje je napaka?
- V koraku (1): navidezno moč moramo računati s temensko vrednostjo $325\,\mathrm{V}$.
~ Merilniki in formule za moč uporabljajo efektivne vrednosti, zato je $230\,\mathrm{V}$ pravilno.
- V koraku (2): pravilno je $P = UI = 1380\,\mathrm{W}$.
~ $UI$ je navidezna moč. Delovna moč vsebuje še faktor $\cos\varphi$.
+ V koraku (3): pravilno je $Q = \sqrt{S^2 - P^2} = 828\,\mathrm{var}$.
> $P$ in $Q$ sta pravokotni stranici trikotnika moči, zato ju ne odštevamo. $Q = \sqrt{1380^2 - 1104^2}\,\mathrm{var} = 828\,\mathrm{var}$.

? Stroja v delavnici imata pri $230\,\mathrm{V}$ enako delovno moč $1\,\mathrm{kW}$. Prvi ima $\cos\varphi = 1$, drugi $\cos\varphi = 0{,}5$. Kaj velja za tok?
- Tok je pri obeh enak, ker imata enako moč.
~ Enaka je le delovna moč. Tok določa navidezna moč $S = P/\cos\varphi$.
+ Drugi vleče dvakrat večji tok ($8{,}7\,\mathrm{A}$ namesto $4{,}3\,\mathrm{A}$).
- Drugi vleče polovico toka, ker polovico moči »vrne« omrežju.
~ Vrnjena jalova energija ne zmanjša toka, ampak ga poveča: tok mora nositi tudi jalovo moč.
> $I = \dfrac{P}{U\cos\varphi}$. Pri $\cos\varphi = 0{,}5$ je tok dvakrat večji, zato drugi stroj potrebuje debelejši kabel.

? Obrtnik z mnogimi motorji v lesni delavnici dobi na računu postavko za jalovo energijo. Električar vgradi kondenzatorsko baterijo. Kaj se zgodi?
- Motorji porabijo manj delovne moči in delajo počasneje.
~ Kondenzatorji ne spremenijo dela motorjev; $P$ ostane enaka.
- Kondenzatorji shranijo odvečno delovno energijo za kasneje.
~ Kondenzator izmenjuje le jalovo energijo z motorji. Delovne energije ne shranjuje.
+ Jalovo moč motorjem dajejo kondenzatorji, zato iz omrežja teče manjši tok.
> Kondenzator ima jalovo moč nasprotnega predznaka kot tuljava. Skupni $Q$ pade, $\cos\varphi$ se približa $1$, tok v dovodu se zmanjša, $P$ pa ostane enaka.

:::simboli
Z | impedanca | Z = \sqrt{R^2 + X^2} | Ω | skupni »upor« vezja; I = U/Z
R | upornost | | Ω
X | reaktanca | X = X_L - X_C | Ω
X_L | induktivna reaktanca tuljave | X_L = 2\pi f L | Ω | raste s frekvenco
X_C | kapacitivna reaktanca kondenzatorja | X_C = \dfrac{1}{\omega C} | Ω | pada s frekvenco
L | induktivnost | | H
C | kapacitivnost | | F
j | imaginarna enota | | | j² = −1
\omega | krožna frekvenca | \omega = 2\pi f | 1/s | pri 50 Hz okoli 314 s⁻¹
f | frekvenca | | Hz
t | čas | | s
T | perioda | T = \dfrac{1}{f} | s | pri 50 Hz 20 ms
u | trenutna napetost | u = U_\mathrm{m} \sin\omega t | V
\omega_0 | resonančna krožna frekvenca | \omega_0 = \dfrac{1}{\sqrt{LC}} | 1/s | X_L = X_C, Z = R
p | trenutna moč | p = u \cdot i | W | del periode je negativna
U | efektivna napetost | U = \dfrac{U_\mathrm{m}}{\sqrt{2}} | V
I | efektivni tok | I = \dfrac{U}{Z} | A
\varphi | fazni kot med napetostjo in tokom | \cos\varphi = \dfrac{R}{Z} | ° | cos φ je faktor moči
P | delovna moč | P = UI\cos\varphi | W
Q | jalova moč | Q = UI\sin\varphi | var
S | navidezna moč | S = UI | VA | S² = P² + Q²
Q_C | jalova moč kondenzatorja | Q_C = \dfrac{U^2}{X_C} = \omega C U^2 | var
:::
