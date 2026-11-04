---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ana, študentka kemije, na tečaju prve pomoči opazi, da se defibrilator polni nekaj sekund, sunek skozi prsni koš pa traja le delček sekunde. Zakaj aparat energije ne odda kar sproti iz baterije? Odgovor je **RC vezje**: kondenzator se počasi polni prek velikega upora in se nato prek majhnega upora telesa hitro izprazni, tok pa se pri tem s časom spreminja eksponentno. Enako vezje iz uporov in kondenzatorjev v prvem približku opiše celično membrano in prevajanje živčnega impulza. Ohmov zakon ter zaporedno in vzporedno vezane upore poznaš iz gimnazije; tu tok povežeš z gibanjem nosilcev naboja in lastnostmi snovi (specifični upor, gostota toka), s **Kirchhoffovima zakonoma** pa izračunaš tokove v poljubno razvejanem vezju z več viri. Ista orodja potrebuješ za vsako napravo, ki kemijsko ali fizikalno količino pretvori v napetost ali tok, od pH-metra, konduktometra in termočlena do fotodiode in laboratorijskega potenciostata.

## Razlaga

O toku se hitro ustalijo štiri mamljive predstave. Vse so napačne ali vsaj nepopolne, a vsaka ima jedro, iz katerega zraste pravilna slika:

| Mamljiva predstava | Kaj v resnici velja | Razdelek |
|---|---|---|
| Ob pritisku stikala elektroni v hipu pridrvijo od vira do žarnice. | Elektroni lezejo z delčki milimetra na sekundo; s skoraj svetlobno hitrostjo se razširi električno polje. | 1 |
| Vsak dodatni upor poveča upor vezja. | Vzporedno vezan upor ga zmanjša, ker tok dobi dodatno pot. | 5 |
| Tok se na poti skozi upore »porablja«. | Kolikor naboja priteče v razcep žic, toliko ga odteče; porablja se energija, ne naboj. | 3, 6 |
| Skozi kondenzator tok ne teče, zato ob priklopu v vezju ne teče nič. | Med ploščama res ne teče, a ob priklopu praznega kondenzatorja po žicah steče največji tok, ki nato pojema. | 8 |

### Tok, upor in moč

**1. Električni tok.** Tok je naboj, ki v časovni enoti preteče skozi presek vodnika:

$$I = \frac{\mathrm{d}Q}{\mathrm{d}t}, \qquad [I] = \mathrm{A} = \mathrm{C/s}.$$

Naboj označujemo s $Q$, osnovni naboj pa z $e_0 = 1{,}602 \cdot 10^{-19}\,\mathrm{C}$. Dogovorjena smer toka je smer gibanja pozitivnih nosilcev; v kovinah se elektroni gibljejo v nasprotni smeri. **Gostota toka** je tok na enoto preseka, $j = I/S$. Če je v enoti prostornine $n$ nosilcev z nabojem $e_0$, ki se v povprečju premikajo z **hitrostjo potovanja** $v$, velja

$$I = n e_0 v S.$$

*Izpeljava.* V času $\mathrm{d}t$ preidejo presek vsi nosilci v valju s presekom $S$ in dolžino $v\,\mathrm{d}t$, torej $\mathrm{d}Q = ne_0Sv\,\mathrm{d}t$. Hitrost potovanja je presenetljivo majhna (delčki milimetra na sekundo); tok pa steče takoj, ker se električno polje po vodniku razširi skoraj s svetlobno hitrostjo.

**2. Ohmov zakon in upor.** Za mnoge snovi (ohmske vodnike) pri stalni temperaturi je tok sorazmeren z napetostjo:

$$U = RI, \qquad [R] = \Omega = \mathrm{V/A}.$$

Upor žice z dolžino $l$ in presekom $S$ je

$$R = \zeta\,\frac{l}{S},$$

kjer je $\zeta$ **specifični upor** snovi (baker: $1{,}7 \cdot 10^{-8}\,\Omega\,\mathrm{m}$). Obratna vrednost $\sigma = 1/\zeta$ je **specifična prevodnost**. *Izpeljava.* V ohmski snovi velja Ohmov zakon v točki, $\vec{j} = \sigma\vec{E}$. V homogeni žici je $E = U/l$ in $j = I/S$, zato $I/S = \sigma U/l$ oziroma $U = \dfrac{l}{\sigma S}\,I = \zeta\dfrac{l}{S}\,I$. Pri kovinah upor s temperaturo narašča, približno $R = R_0(1 + \alpha\,\Delta T)$, pri polprevodnikih in elektrolitih pa pada. Ohmov zakon ni naravni zakon za vse snovi: za diodo, žarnico z žarilno nitko in plinsko razelektritev ne velja.

**3. Moč.** Ko naboj $\mathrm{d}Q$ preide napetost $U$, električno polje opravi delo $U\,\mathrm{d}Q$. Moč je zato

$$P = UI = I^2R = \frac{U^2}{R}.$$

Na uporu se ta moč pretvori v toploto (Joulova toplota).

### Viri in vezave

**4. Vir napetosti.** Baterija ali akumulator ima **gonilno napetost** $U_g$ in **notranji upor** $R_n$. Ko iz vira teče tok $I$, je napetost na njegovih sponkah

$$U = U_g - IR_n.$$

Z zunanjim uporom $R$ je $U = RI$, zato $I = U_g/(R + R_n)$.

Pri kratkem stiku ($R = 0$) teče največji tok $U_g/R_n$, ki baterijo hitro segreje.

**5. Zaporedna in vzporedna vezava.** Pri **zaporedni** vezavi teče skozi vse upore isti tok, napetosti se seštejejo, zato je $R = R_1 + R_2 + \dots$ Pri **vzporedni** vezavi je na vseh uporih ista napetost, tokovi se seštejejo, zato je $1/R = 1/R_1 + 1/R_2 + \dots$ *Dokaz* sledi iz Kirchhoffovih zakonov (točka 6): brez razcepov je po vozliščnem zakonu tok povsod isti in $U = \sum IR_k = I\sum R_k$; pri vzporedni vezavi je po zančnem zakonu napetost na vseh vejah enaka in $I = \sum U/R_k = U\sum 1/R_k$. Nadomestni upor vzporedne vezave je vedno manjši od najmanjšega posameznega upora.

:::premisli
Žarnici z uporoma $R$ in $2R$ priključimo vzporedno na isto napetost. Katera sveti močneje? Kaj pa, če ju vežemo zaporedno?
---
Vzporedno imata isto napetost, zato je $P = U^2/R$ večja pri manjšem uporu: močneje sveti žarnica z $R$. Zaporedno teče skozi obe isti tok, zato je $P = I^2R$ večja pri večjem uporu: močneje sveti žarnica z $2R$ (upor žarnic tu jemljemo kot stalen).
:::

### Kirchhoffova zakona

**6. Kirchhoffova zakona.** Vezja z več viri ali s prepletenimi vejami ne moremo vedno poenostaviti na zaporedne in vzporedne dele. Takrat uporabimo dva splošna zakona, ki veljata za **stacionarne** (s časom nespremenljive ali počasi spremenljive) tokove v vezjih brez tuljav (induktivnosti).

- **Prvi (vozliščni) zakon:** vsota tokov, ki pritekajo v vozlišče, je enaka vsoti tokov, ki iz njega odtekajo, $\sum I_k = 0$ (pritekajoče štejemo pozitivno, odtekajoče negativno). To je ohranitev naboja: v vozlišču se naboj ne nabira, zato je naboj, ki v času $\mathrm{d}t$ priteče, enak naboju, ki odteče.
- **Drugi (zančni) zakon:** vsota gonilnih napetosti v sklenjeni zanki je enaka vsoti padcev napetosti na uporih, $\sum U_{g,k} = \sum R_kI_k$. To je ohranitev energije: pri stacionarnih tokovih je električno polje potencialno, $\oint\vec{E}\cdot\mathrm{d}\vec{s} = 0$, zato se naboj, ki obkroži zanko, vrne na isti potencial.

Postopek: (a) vsaki veji izberi smer toka (če je izbira napačna, dobiš negativen tok); (b) zapiši vozliščne enačbe (za $N$ vozlišč je neodvisnih $N - 1$); (c) zapiši zančne enačbe za toliko neodvisnih zank, da imaš toliko enačb, kolikor je neznanih tokov; (d) reši sistem linearnih enačb. Pri zančnem zakonu gonilno napetost štejemo pozitivno, če nas smer obhoda vodi skozi vir od $-$ proti $+$, padec $RI$ pa pozitivno, če gremo skozi upor v smeri izbranega toka.

### Kondenzator in RC vezje

**7. Kondenzator v vezju.** Kondenzator s kapaciteto $C$ ima na ploščah naboj $Q = CU$. Enosmeren tok skozenj ne teče, med polnjenjem ali praznjenjem pa naboj teče po žicah do plošč in nazaj.

**8. RC vezje.** Kondenzator s kapaciteto $C$ prek upora $R$ priključimo na vir z gonilno napetostjo $U_g$ (notranji upor vira zanemarimo ali ga prištejemo k $R$). Zančni zakon da $U_g = RI + Q/C$, pri čemer je $I = \mathrm{d}Q/\mathrm{d}t$:

$$R\,\frac{\mathrm{d}Q}{\mathrm{d}t} + \frac{Q}{C} = U_g.$$

*Rešitev.* Z novo spremenljivko $y = Q - CU_g$ dobimo $\dot{y} = -y/(RC)$, torej $y = y_0e^{-t/RC}$. Iz začetnega pogoja $Q(0) = 0$ sledi $y_0 = -CU_g$ in

$$Q(t) = CU_g\left(1 - e^{-t/\tau}\right), \qquad I(t) = \frac{U_g}{R}\,e^{-t/\tau}, \qquad \tau = RC.$$

Količina $\tau$ je **časovna konstanta** (enota $\Omega \cdot \mathrm{F} = \mathrm{s}$). V času $\tau$ se kondenzator napolni do $1 - e^{-1} \approx 63\,\%$ končnega naboja, po $5\tau$ pa do več kot $99\,\%$. Pri **praznjenju** kondenzatorja z začetnim nabojem $Q_0$ prek upora $R$ je $Q(t) = Q_0\,e^{-t/\tau}$, napetost in tok pojemata z isto časovno konstanto. V napolnjenem kondenzatorju je shranjena energija $W = \tfrac{1}{2}CU^2$.

:::premisli
Tik po priklopu praznega kondenzatorja: kolikšna je napetost na kondenzatorju in kolikšna na uporu? Zakaj torej takrat teče največji tok in ne nič, čeprav skozi izolator med ploščama naboj ne more preiti?
---
Na praznem kondenzatorju je napetost $Q/C = 0$, zato je ob $t = 0$ vsa gonilna napetost na uporu in teče tok $U_g/R$; naboj teče po žicah do plošč, ne skozi izolator. Ko se kondenzator polni, njegova napetost raste, napetost na uporu in tok pa pojemata.
:::

Pozor na zapis: v eksponentu je $e$ Eulerjevo število, osnovni naboj pa smo zato označili z $e_0$.

## Rešeni primeri

### Primer 1 (lažji)

Podaljšek ima bakreno žico z dolžino $20\,\mathrm{m}$ in presekom $1{,}5\,\mathrm{mm^2}$. Specifični upor bakra je $1{,}7 \cdot 10^{-8}\,\Omega\,\mathrm{m}$. Kolikšen je upor žice, kolikšen je padec napetosti na njej in kolikšna moč se na njej pretvori v toploto, ko po njej teče tok $10\,\mathrm{A}$? S kolikšno hitrostjo potujejo elektroni, če je v bakru $8{,}5 \cdot 10^{28}$ prostih elektronov na kubični meter?

**Podatki:** $l = 20\,\mathrm{m}$, $S = 1{,}5\,\mathrm{mm^2} = 1{,}5 \cdot 10^{-6}\,\mathrm{m^2}$, $\zeta = 1{,}7 \cdot 10^{-8}\,\Omega\,\mathrm{m}$, $I = 10\,\mathrm{A}$, $n = 8{,}5 \cdot 10^{28}\,\mathrm{m^{-3}}$, $e_0 = 1{,}6 \cdot 10^{-19}\,\mathrm{C}$
**Iščemo:** upor $R$, padec napetosti $U$, moč $P$, hitrost potovanja $v$

:::formula
$R = \zeta l/S$, $U = RI$, $P = I^2R$, $I = ne_0vS$
:::

**Rešitev:**

1. $R = 1{,}7 \cdot 10^{-8}\,\Omega\,\mathrm{m} \cdot 20\,\mathrm{m} / 1{,}5 \cdot 10^{-6}\,\mathrm{m^2} \approx 0{,}227\,\Omega$.
2. Po Ohmovem zakonu za žico: $U = 0{,}227\,\Omega \cdot 10\,\mathrm{A} \approx 2{,}27\,\mathrm{V}$.
3. Vsa električna moč na žici se pretvori v toploto, zato $P = (10\,\mathrm{A})^2 \cdot 0{,}227\,\Omega \approx 22{,}7\,\mathrm{W}$.
4. Iz $I = ne_0vS$ izrazimo hitrost: $v = I/(ne_0S) = 10\,\mathrm{A} / (8{,}5 \cdot 10^{28}\,\mathrm{m^{-3}} \cdot 1{,}6 \cdot 10^{-19}\,\mathrm{C} \cdot 1{,}5 \cdot 10^{-6}\,\mathrm{m^2}) \approx 4{,}9 \cdot 10^{-4}\,\mathrm{m/s}$.
5. Odgovor: upor žice je približno $0{,}23\,\Omega$, padec napetosti $2{,}3\,\mathrm{V}$, na žici se sprošča okoli $23\,\mathrm{W}$ toplote; elektroni potujejo s hitrostjo le okoli $0{,}5\,\mathrm{mm/s}$.

### Primer 2

Vezje ima tri vzporedne veje med vozliščema $A$ (zgoraj) in $B$ (spodaj). V levi veji sta vir z gonilno napetostjo $12\,\mathrm{V}$ in upor $2{,}0\,\Omega$, v desni vir z gonilno napetostjo $6{,}0\,\mathrm{V}$ in upor $4{,}0\,\Omega$, v srednji veji pa le upor $6{,}0\,\Omega$. Pozitivna pola obeh virov sta obrnjena proti vozlišču $A$, notranja upora virov sta zanemarljiva. Izračunaj tokove v vseh treh vejah.

**Podatki:** $U_1 = 12\,\mathrm{V}$, $R_1 = 2{,}0\,\Omega$, $U_2 = 6{,}0\,\mathrm{V}$, $R_2 = 4{,}0\,\Omega$, $R_3 = 6{,}0\,\Omega$, pozitivna pola proti $A$, $R_n = 0$
**Iščemo:** tokove $I_1$, $I_2$, $I_3$

:::formula
Vozlišče: $I_1 + I_2 = I_3$. Zanki: $U_1 = R_1I_1 + R_3I_3$, $U_2 = R_2I_2 + R_3I_3$.
:::

**Rešitev:**

1. Izberemo smeri: $I_1$ in $I_2$ tečeta skozi vira navzgor proti $A$, $I_3$ skozi srednji upor navzdol. Vozlišče $A$: $I_1 + I_2 = I_3$.
2. Leva zanka: $12 = 2I_1 + 6I_3$. Desna zanka: $6 = 4I_2 + 6I_3$ (tokovi v A, napetosti v V).
3. Iz zank: $I_1 = 6 - 3I_3$ in $I_2 = 1{,}5 - 1{,}5\,I_3$. Vstavimo v vozliščno enačbo: $7{,}5 - 4{,}5\,I_3 = I_3$, torej $I_3 = 7{,}5/5{,}5 = 15/11 \approx 1{,}36\,\mathrm{A}$.
4. $I_1 = 6 - 3 \cdot 15/11 = 21/11 \approx 1{,}91\,\mathrm{A}$, $I_2 = 1{,}5 - 1{,}5 \cdot 15/11 = -6/11 \approx -0{,}55\,\mathrm{A}$.
5. Preizkus: $1{,}91 - 0{,}55 = 1{,}36$ ✓. Napetost med $A$ in $B$ je $R_3I_3 \approx 8{,}18\,\mathrm{V}$.
6. Odgovor: v levi veji teče $1{,}91\,\mathrm{A}$ proti $A$, v srednji $1{,}36\,\mathrm{A}$ navzdol, v desni pa $0{,}55\,\mathrm{A}$ v nasprotni smeri, kot smo jo izbrali, torej skozi šibkejši vir od $+$ proti $-$: močnejši vir šibkejšega polni.

### Primer 3 (težji)

Ana na laboratorijski vaji sestavi počasen model celične membrane, da lahko napetost spremlja z voltmetrom. Kondenzator s kapaciteto $47\,\mu\mathrm{F}$, ki je na začetku prazen, prek upora $100\,\mathrm{k}\Omega$ priključi na baterijo z gonilno napetostjo $9{,}0\,\mathrm{V}$ (notranji upor zanemarimo). Kolikšna je časovna konstanta? Po kolikšnem času je napetost na kondenzatorju $5{,}0\,\mathrm{V}$ in kolikšen tok takrat teče? Koliko energije je v kondenzatorju, ko je popolnoma napolnjen? Kolikšen upor bi morala izbrati, da bi napetost $5{,}0\,\mathrm{V}$ dosegla šele po $10\,\mathrm{s}$?

**Podatki:** $C = 47\,\mu\mathrm{F} = 4{,}7 \cdot 10^{-5}\,\mathrm{F}$, $R = 100\,\mathrm{k}\Omega = 1{,}0 \cdot 10^{5}\,\Omega$, $U_g = 9{,}0\,\mathrm{V}$, $Q(0) = 0$, $U_C = 5{,}0\,\mathrm{V}$
**Iščemo:** $\tau$, čas $t_1$, ko je $U_C = 5{,}0\,\mathrm{V}$, tok $I(t_1)$, energijo $W$ pri polnem kondenzatorju, upor $R'$, s katerim bi bil $t_1 = 10\,\mathrm{s}$

:::formula
$\tau = RC$, $U_C(t) = U_g(1 - e^{-t/\tau})$, $I(t) = \dfrac{U_g}{R}e^{-t/\tau}$, $W = \tfrac{1}{2}CU_g^2$
:::

**Rešitev:**

1. $\tau = 1{,}0 \cdot 10^5\,\Omega \cdot 4{,}7 \cdot 10^{-5}\,\mathrm{F} = 4{,}7\,\mathrm{s}$.
2. Napetost na kondenzatorju je $Q/C$, zato raste kot naboj. Iz $5{,}0 = 9{,}0\,(1 - e^{-t_1/\tau})$ sledi $e^{-t_1/\tau} = 4/9$, torej $t_1 = \tau\ln(9/4) = 4{,}7\,\mathrm{s} \cdot 0{,}811 \approx 3{,}8\,\mathrm{s}$.
3. Tok pojema z istim faktorjem $e^{-t/\tau}$ kot napetost na uporu. Začetni tok je $U_g/R = 9{,}0\,\mathrm{V}/1{,}0 \cdot 10^5\,\Omega = 90\,\mu\mathrm{A}$. Ob $t_1$: $I = 90\,\mu\mathrm{A} \cdot 4/9 = 40\,\mu\mathrm{A}$.
4. Preizkus z zančnim zakonom: $RI + U_C = 10^5\,\Omega \cdot 40 \cdot 10^{-6}\,\mathrm{A} + 5{,}0\,\mathrm{V} = 4{,}0\,\mathrm{V} + 5{,}0\,\mathrm{V} = 9{,}0\,\mathrm{V}$ ✓.
5. Obratno vprašanje: $t_1 = RC\ln(9/4)$ je sorazmeren z $R$, zato za $t_1' = 10\,\mathrm{s}$ potrebujemo $R' = \dfrac{t_1'}{C\ln(9/4)} = \dfrac{10\,\mathrm{s}}{4{,}7 \cdot 10^{-5}\,\mathrm{F} \cdot 0{,}811} \approx 2{,}6 \cdot 10^5\,\Omega$.
6. $W = \tfrac{1}{2} \cdot 4{,}7 \cdot 10^{-5}\,\mathrm{F} \cdot (9{,}0\,\mathrm{V})^2 \approx 1{,}9 \cdot 10^{-3}\,\mathrm{J}$.
7. Odgovor: časovna konstanta je $4{,}7\,\mathrm{s}$; napetost $5{,}0\,\mathrm{V}$ doseže po približno $3{,}8\,\mathrm{s}$, ko teče tok $40\,\mu\mathrm{A}$; napolnjen kondenzator hrani približno $1{,}9\,\mathrm{mJ}$ energije. Za $10\,\mathrm{s}$ bi potrebovala upor okoli $260\,\mathrm{k}\Omega$.

### Primer 4 – zdaj ti

Kondenzator s kapaciteto $10\,\mu\mathrm{F}$, napolnjen na $12\,\mathrm{V}$, odklopimo od vira in ga praznimo prek upora $220\,\mathrm{k}\Omega$. Kolikšna je napetost na kondenzatorju po $3{,}0\,\mathrm{s}$?

**Podatki:** $C = 10\,\mu\mathrm{F} = 1{,}0 \cdot 10^{-5}\,\mathrm{F}$, $R = 220\,\mathrm{k}\Omega = 2{,}2 \cdot 10^{5}\,\Omega$, $U_0 = 12\,\mathrm{V}$, $t = 3{,}0\,\mathrm{s}$
**Iščemo:** napetost $U_C$ ob času $t$

:::formula
$\tau = RC$, $U_C(t) = U_0\,e^{-t/\tau}$
:::

**Rešitev:**

1. Enote pretvorimo v $\Omega$ in $\mathrm{F}$, da dobimo čas v sekundah: $\tau = 2{,}2 \cdot 10^5\,\Omega \cdot 1{,}0 \cdot 10^{-5}\,\mathrm{F} = 2{,}2\,\mathrm{s}$.
2. Tok praznjenja $I = U_C/R$ je sorazmeren z napetostjo, zato napetost pojema eksponentno. Razmerje v eksponentu: $t/\tau = 3{,}0/2{,}2 \approx 1{,}36$.
3. Zdaj ti: izračunaj $e^{-1{,}36}$ in pomnoži z začetno napetostjo.

:::premisli
Kolikšna je napetost na kondenzatorju po $3{,}0\,\mathrm{s}$?
---
$U_C = 12\,\mathrm{V} \cdot e^{-1{,}36} \approx 12\,\mathrm{V} \cdot 0{,}256 \approx 3{,}1\,\mathrm{V}$. Ker je $3{,}0\,\mathrm{s}$ nekaj več kot $\tau$, je ostalo nekaj manj kot $37\,\%$ začetne napetosti.
:::

## Pogoste napake

- **Vzporedni upori se seštevajo.** Seštevajo se obratne vrednosti. Upora $4\,\Omega$ in $12\,\Omega$ vzporedno dasta $3\,\Omega$, ne $16\,\Omega$.
- **Strah pred negativnim tokom.** Pri Kirchhoffovih zakonih negativen rezultat le pove, da tok teče v nasprotni smeri od izbrane. Smeri ne popravljaj sredi računa, sicer zamešaš predznake.
- **Predznaki v zančnem zakonu.** Za vsak upor in vir posebej preveri, ali greš v smeri toka in ali vir prečkaš od $-$ proti $+$. Ena napačna predznačna izbira pokvari vse tokove.
- **Preveč vozliščnih enačb.** Za $N$ vozlišč je neodvisnih le $N - 1$ enačb; zadnja je posledica ostalih in ne da nove informacije.
- **Napolnjenost po času $\tau$.** Po času $\tau$ je kondenzator napolnjen do $63\,\%$, ne do polovice in ne do konca. Polovico doseže po $\tau\ln 2 \approx 0{,}69\,\tau$.
- **Enote v $\tau = RC$.** $\mathrm{k}\Omega$ in $\mu\mathrm{F}$ najprej pretvori v $\Omega$ in $\mathrm{F}$; $1\,\mathrm{k}\Omega \cdot 1\,\mu\mathrm{F} = 1\,\mathrm{ms}$.

## Povzetek

- Tok $I = \mathrm{d}Q/\mathrm{d}t$, mikroskopsko $I = ne_0vS$; gostota toka $j = I/S$.
- Ohmov zakon $U = RI$, upor žice $R = \zeta l/S$, moč $P = UI = I^2R$.
- Realni vir: $U = U_g - IR_n$.
- Zaporedno: $R = \sum R_k$; vzporedno: $1/R = \sum 1/R_k$.
- Kirchhoff: v vozlišču $\sum I = 0$ (ohranitev naboja), v zanki $\sum U_g = \sum RI$ (ohranitev energije).
- RC vezje: $\tau = RC$; polnjenje $U_C = U_g(1 - e^{-t/\tau})$, praznjenje $U_C = U_0e^{-t/\tau}$, tok $I \propto e^{-t/\tau}$; energija $W = \tfrac{1}{2}CU^2$.

## Za izpit

Znati moraš povedati:

- definicijo toka in gostote toka ter izpeljavo $I = ne_0vS$;
- Ohmov zakon s pogojem veljavnosti in izpeljavo $R = \zeta l/S$ iz $\vec{j} = \sigma\vec{E}$;
- Kirchhoffova zakona s pogojem (stacionarni tokovi), njuno utemeljitev z ohranitvijo naboja in energije ter iz njiju izpeljavo zaporedne in vzporedne vezave;
- diferencialno enačbo RC vezja, njeno rešitev za polnjenje in praznjenje ter pomen časovne konstante;
- energijsko bilanco polnjenja kondenzatorja.

### Naloga 1

Vir z gonilno napetostjo $12\,\mathrm{V}$ in zanemarljivim notranjim uporom je prek upora $R_1 = 10\,\mathrm{k}\Omega$ priključen na vzporedno vezavo upora $R_2 = 20\,\mathrm{k}\Omega$ in praznega kondenzatorja s kapaciteto $100\,\mu\mathrm{F}$. Ob $t = 0$ sklenemo stikalo. Zapiši diferencialno enačbo za napetost $U_C$ na kondenzatorju in jo reši. Kolikšni sta končna napetost in časovna konstanta, kolikšen tok teče skozi $R_1$ takoj po vklopu in po dolgem času ter po kolikšnem času doseže $U_C$ $90\,\%$ končne vrednosti?

**Rešitev:**

1. Tokovi: $I_1$ skozi $R_1$, $I_2$ skozi $R_2$, $I_C = C\,\mathrm{d}U_C/\mathrm{d}t$ v kondenzator. Vozlišče: $I_1 = I_2 + I_C$. Zanka vir–$R_1$–$C$: $U_g = R_1I_1 + U_C$. Zanka $C$–$R_2$: $U_C = R_2I_2$.
2. Vstavimo $I_1 = (U_g - U_C)/R_1$ in $I_2 = U_C/R_2$ v vozliščno enačbo: $C\,\dfrac{\mathrm{d}U_C}{\mathrm{d}t} = \dfrac{U_g - U_C}{R_1} - \dfrac{U_C}{R_2}$. Pomnožimo z $R_p = \dfrac{R_1R_2}{R_1 + R_2}$: $R_pC\,\dfrac{\mathrm{d}U_C}{\mathrm{d}t} + U_C = U_g\dfrac{R_2}{R_1 + R_2}$.
3. To je enačba RC vezja z gonilno napetostjo $U_\infty = 12 \cdot 20/30\,\mathrm{V} = 8{,}0\,\mathrm{V}$ in uporom $R_p = 10 \cdot 20/30\,\mathrm{k}\Omega \approx 6{,}67\,\mathrm{k}\Omega$, zato $U_C(t) = U_\infty(1 - e^{-t/\tau})$ s $\tau = R_pC = 6{,}67 \cdot 10^3\,\Omega \cdot 1{,}0 \cdot 10^{-4}\,\mathrm{F} \approx 0{,}667\,\mathrm{s}$.
4. Ob $t = 0$ je $U_C = 0$, zato $I_2 = 0$ in $I_1 = U_g/R_1 = 12\,\mathrm{V}/10^4\,\Omega = 1{,}2\,\mathrm{mA}$. Po dolgem času je $I_C = 0$ in $I_1 = I_2 = U_g/(R_1 + R_2) = 12\,\mathrm{V}/(3{,}0 \cdot 10^4\,\Omega) = 0{,}40\,\mathrm{mA}$.
5. $90\,\%$: $e^{-t/\tau} = 0{,}10$, torej $t = \tau\ln 10 = 0{,}667\,\mathrm{s} \cdot 2{,}303 \approx 1{,}54\,\mathrm{s}$.
6. Odgovor: $U_C(t) = 8{,}0\,\mathrm{V}\,(1 - e^{-t/0{,}667\,\mathrm{s}})$; končna napetost je $8{,}0\,\mathrm{V}$, $\tau \approx 0{,}67\,\mathrm{s}$; tok skozi $R_1$ pade z $1{,}2\,\mathrm{mA}$ na $0{,}40\,\mathrm{mA}$, $90\,\%$ končne napetosti je doseženih po približno $1{,}5\,\mathrm{s}$.

### Naloga 2

Izpelji diferencialno enačbo za polnjenje praznega kondenzatorja s kapaciteto $C$ prek upora $R$ iz vira z gonilno napetostjo $U_g$ in jo reši. Dokaži, da se med polnjenjem v uporu pretvori v toploto natanko toliko energije, kot je na koncu ostane v kondenzatorju, ne glede na $R$.

**Rešitev:**

1. Zančni zakon: $U_g = RI + Q/C$, z $I = \mathrm{d}Q/\mathrm{d}t$ torej $R\,\dfrac{\mathrm{d}Q}{\mathrm{d}t} + \dfrac{Q}{C} = U_g$.
2. Z $y = Q - CU_g$ dobimo $\mathrm{d}y/\mathrm{d}t = -y/(RC)$ in $y = y_0e^{-t/\tau}$, $\tau = RC$. Iz $Q(0) = 0$ sledi $y_0 = -CU_g$, zato $Q(t) = CU_g(1 - e^{-t/\tau})$ in $I(t) = \dfrac{U_g}{R}e^{-t/\tau}$.
3. Vir pri stalni napetosti $U_g$ prenese naboj $CU_g$ in opravi delo $A = U_g \cdot CU_g = CU_g^2$.
4. Energija v kondenzatorju: $W = \int_0^{CU_g}\dfrac{Q}{C}\,\mathrm{d}Q = \tfrac{1}{2}CU_g^2$.
5. Toplota v uporu: $\int_0^\infty I^2R\,\mathrm{d}t = \dfrac{U_g^2}{R}\int_0^\infty e^{-2t/\tau}\,\mathrm{d}t = \dfrac{U_g^2}{R} \cdot \dfrac{\tau}{2} = \tfrac{1}{2}CU_g^2$.
6. Bilanca: $CU_g^2 = \tfrac{1}{2}CU_g^2 + \tfrac{1}{2}CU_g^2$. Upor $R$ se je pokrajšal: manjši upor da večji tok v krajšem času, izguba pa ostane enaka.
7. Odgovor: $Q(t) = CU_g(1 - e^{-t/RC})$; v uporu se vedno pretvori polovica dela vira, $\tfrac{1}{2}CU_g^2$, ne glede na $R$.

## Drugače: Na sliki

Vezje iz Primera 2 (vozlišče $A$ zgoraj, $B$ spodaj):

```
  A o-------------o-------------o
    |             |             |
   [R1]          [R3]          [R2]
    |             |             |
   (+)            |            (+)
   U1             |            U2
   (-)            |            (-)
    |             |             |
  B o-------------o-------------o
```

Vsaka navpična črta je veja z enim tokom. Zanka »levo + sredina« vsebuje $U_1$, $R_1$ in $R_3$, zanka »desno + sredina« pa $U_2$, $R_2$ in $R_3$.

Polnjenje kondenzatorja je krivulja, ki se pri $t = 0$ dviga najhitreje in se nato vse počasneje približuje vodoravni asimptoti $U_g$:

| $t/\tau$ | $U_C/U_g$ | $I/I_0$ |
|---|---|---|
| $0$ | $0$ | $1$ |
| $1$ | $0{,}63$ | $0{,}37$ |
| $2$ | $0{,}86$ | $0{,}14$ |
| $3$ | $0{,}95$ | $0{,}05$ |
| $5$ | $0{,}99$ | $0{,}01$ |

Tangenta na krivuljo $U_C(t)$ v izhodišču seka asimptoto ravno pri $t = \tau$: če bi tok ves čas ostal začetni, bi se kondenzator napolnil v času $\tau$.

## Drugače: Uporaba v stroki

**Celična membrana kot RC vezje.** Lipidni dvosloj je tanek izolator med prevodnima raztopinama, torej kondenzator s specifično kapaciteto okoli $1\,\mu\mathrm{F/cm^2}$. Ionski kanali so upori vzporedno z njim (mirujoča membrana: reda $1\,\mathrm{k}\Omega\,\mathrm{cm^2}$), zato je $\tau \approx 1\,\mathrm{ms}$. Gonilne napetosti so Nernstovi potenciali, mirovni potencial pa dobimo s Kirchhoffovimi zakoni za veje s kanali za $\mathrm{K^+}$, $\mathrm{Na^+}$ in $\mathrm{Cl^-}$.

**Konduktometrija.** Prevodnost raztopine je sorazmerna s koncentracijo in gibljivostjo ionov. Pri titraciji močne kisline z bazo najprej pada (hitri $\mathrm{H_3O^+}$ zamenjajo počasnejši kationi), za ekvivalentno točko spet narašča. Merilnik uporablja izmenično napetost, da se elektrodi ne polarizirata.

**Merilni instrumenti.** Voltmeter z notranjim uporom $10\,\mathrm{M}\Omega$ na uporu $1\,\mathrm{M}\Omega$ tvori vzporedno vezavo z $0{,}91\,\mathrm{M}\Omega$ in meritev popači; pri pH-elektrodi z uporom stekla reda $100\,\mathrm{M}\Omega$ zato potrebujemo merilnik z vhodnim uporom nad $10^{12}\,\Omega$.

## Drugače: Korak za korakom s številkami

Upora $R_1 = 6{,}0\,\Omega$ in $R_2 = 3{,}0\,\Omega$ sta vezana vzporedno, zaporedno z njima pa je upor $R_3 = 4{,}0\,\Omega$. Celotno vezje je priključeno na napetost $12\,\mathrm{V}$.

1. **Vzporedni del:** $1/R_{12} = 1/6 + 1/3 = 1/2$, torej $R_{12} = 2{,}0\,\Omega$.
2. **Celotni upor:** $R = R_{12} + R_3 = 2{,}0 + 4{,}0 = 6{,}0\,\Omega$.
3. **Celotni tok:** $I = 12\,\mathrm{V}/6{,}0\,\Omega = 2{,}0\,\mathrm{A}$; ta tok teče skozi $R_3$.
4. **Napetosti:** $U_3 = 4{,}0\,\Omega \cdot 2{,}0\,\mathrm{A} = 8{,}0\,\mathrm{V}$, na vzporednem delu $U_{12} = 2{,}0\,\Omega \cdot 2{,}0\,\mathrm{A} = 4{,}0\,\mathrm{V}$. Vsota $12\,\mathrm{V}$ ✓.
5. **Tokova v vejah:** $I_1 = 4{,}0/6{,}0 \approx 0{,}67\,\mathrm{A}$, $I_2 = 4{,}0/3{,}0 \approx 1{,}33\,\mathrm{A}$. Vsota $2{,}0\,\mathrm{A}$ ✓ (vozliščni zakon).
6. **Moč:** $P = UI = 12\,\mathrm{V} \cdot 2{,}0\,\mathrm{A} = 24\,\mathrm{W}$; na $R_3$ je $16\,\mathrm{W}$, na $R_1$ $2{,}7\,\mathrm{W}$, na $R_2$ $5{,}3\,\mathrm{W}$.

## Drugače: Bolj natančno

**Drudejev model.** Zakaj velja $\vec{j} = \sigma\vec{E}$? Elektron se med trki pospešuje v polju, povprečni čas med trki je $t_\mathrm{c}$, zato je hitrost potovanja $v = e_0Et_\mathrm{c}/m$ in $\sigma = ne_0^2t_\mathrm{c}/m$ ($m$ je masa elektrona).

**Število enačb.** Vezje z $N$ vozlišči in $B$ vejami ima $B$ neznanih tokov, $N - 1$ neodvisnih vozliščnih enačb in $B - N + 1$ neodvisnih zank. V Primeru 2 je $N = 2$ in $B = 3$: ena vozliščna in dve zančni enačbi.

## Preveri se

? Upora $4\,\Omega$ in $12\,\Omega$ sta vezana vzporedno. Kolikšen je nadomestni upor?
- $16\,\Omega$
~ To je zaporedna vezava; pri vzporedni se seštevajo obratne vrednosti uporov.
+ $3\,\Omega$
- $8\,\Omega$
~ Povprečje ni nadomestni upor: vzporedna vezava ima upor, manjši od najmanjšega posameznega ($4\,\Omega$), ker tok dobi dodatno pot.
> $1/R = 1/4 + 1/12 = 4/12$, torej $R = 3\,\Omega$. $16\,\Omega$ je zaporedna vezava, $8\,\Omega$ pa povprečje.

? Kolikšna je časovna konstanta RC vezja z uporom $2{,}0\,\mathrm{k}\Omega$ in kondenzatorjem $50\,\mu\mathrm{F}$?
- $100\,\mathrm{s}$
~ Pomnožil si $2{,}0 \cdot 50$ brez predpon; $\mathrm{k} = 10^3$ in $\mu = 10^{-6}$ dasta skupaj faktor $10^{-3}$.
- $0{,}01\,\mathrm{s}$
~ Zmotil si se za red velikosti pri predponi, na primer $50\,\mu\mathrm{F}$ zapisal kot $5 \cdot 10^{-6}\,\mathrm{F}$.
+ $0{,}10\,\mathrm{s}$
> $\tau = RC = 2{,}0 \cdot 10^3\,\Omega \cdot 50 \cdot 10^{-6}\,\mathrm{F} = 0{,}10\,\mathrm{s}$. $100\,\mathrm{s}$ dobiš, če predpon ne pretvoriš.

? Do kolikšnega deleža končnega naboja se prazen kondenzator napolni v času ene časovne konstante?
- $37\,\%$
~ To je $e^{-1}$: delež naboja, ki ostane pri praznjenju, ali delež začetnega toka; pri polnjenju je naboj $1 - e^{-1}$ končnega.
- $50\,\%$
~ Polovico naboja doseže že prej, po $\tau\ln 2 \approx 0{,}69\,\tau$; polnjenje ni linearno.
+ $63\,\%$
> $Q(\tau)/Q_\infty = 1 - e^{-1} \approx 0{,}63$. $37\,\%$ je delež naboja, ki ostane po času $\tau$ pri praznjenju.

? Baterija z gonilno napetostjo $9{,}0\,\mathrm{V}$ in notranjim uporom $0{,}50\,\Omega$ poganja tok skozi upor $4{,}0\,\Omega$. Kolikšna je napetost na sponkah baterije?
+ $8{,}0\,\mathrm{V}$
- $9{,}0\,\mathrm{V}$
~ To je gonilna napetost, ki jo izmeriš, ko tok ne teče; ko tok teče, del napetosti pade na notranjem uporu.
- $1{,}0\,\mathrm{V}$
~ To je padec $IR_n$ na notranjem uporu, ne napetost na sponkah; ta je gonilna napetost, zmanjšana za ta padec.
> $I = 9{,}0/(4{,}0 + 0{,}50) = 2{,}0\,\mathrm{A}$, $U = U_g - IR_n = 9{,}0 - 1{,}0 = 8{,}0\,\mathrm{V}$. $1{,}0\,\mathrm{V}$ je padec na notranjem uporu.

? Pri reševanju vezja s Kirchhoffovima zakonoma dobiš za tok v neki veji $I_2 = -0{,}55\,\mathrm{A}$. Kaj to pomeni?
- V računu je napaka, ker tok ne more biti negativen.
~ Smer toka izberemo sami, preden ga poznamo; negativen rezultat pove le, da je bila izbira smeri napačna, račun pa je lahko pravilen.
+ V tej veji teče tok $0{,}55\,\mathrm{A}$ v nasprotni smeri od izbrane.
- Smer toka v tej veji je treba obrniti in ves račun ponoviti.
~ Ponavljanje ni potrebno: rešitev je že pravilna, le predznak beremo kot smer. Spreminjanje smeri sredi računa samo zameša predznake.
> Predznak toka je glede na izbrano smer. Tako je v Primeru 2 desni vir tok prejemal: močnejši vir je šibkejšega polnil.

:::simboli
I | električni tok | I = \frac{\mathrm{d}Q}{\mathrm{d}t} | A
I_1, I_2, I_3 | tokovi v vejah vezja | | A | v zgledu velja I₁ + I₂ = I₃
Q | električni naboj | | C | na kondenzatorju Q = CU
t | čas | | s
n | število nosilcev naboja na enoto prostornine | | m^{-3}
e_0 | osnovni naboj | | C | 1,602 · 10⁻¹⁹ C
v | hitrost potovanja nosilcev naboja | v = \frac{I}{n e_0 S} | m/s | zelo majhna, reda mm/s
S | presek vodnika | | m^2
U | električna napetost | U = RI | V
U_1, U_2 | gonilni napetosti virov v vezju | | V
U_C | napetost na kondenzatorju | U_C = \frac{Q}{C} | V | pri polnjenju $U_C = U_g(1 - e^{-t/\tau})$
U_0 | začetna napetost na kondenzatorju | | V | pri praznjenju
R | električni upor | R = \frac{U}{I} | Ω | žica: R = ζ l/S
R_1, R_2, R_3 | upori v vejah vezja | | Ω
\Omega | ohm, enota za upor | | | 1 Ω = 1 V/A
\zeta | specifični upor snovi | | Ω m | baker: 1,7 · 10⁻⁸ Ω m
l | dolžina žice | | m
P | električna moč | P = UI = I^2R = \frac{U^2}{R} | W
U_g | gonilna napetost vira | | V
R_n | notranji upor vira | | Ω
C | kapaciteta kondenzatorja | C = \frac{Q}{U} | F
e | osnova naravnega logaritma | | – | e ≈ 2,718
\tau | časovna konstanta RC vezja | \tau = RC | s | po 5τ je kondenzator skoraj poln
W | energija v kondenzatorju | W = \tfrac{1}{2}CU^2 | J
:::
