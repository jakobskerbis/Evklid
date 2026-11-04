---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Kolesar s $60\,\mathrm{kg}$ se postavi na pedal in nanj pritisne s silo okoli $600\,\mathrm{N}$. Ročica je dolga $17\,\mathrm{cm}$, zato os pedalov dobi navor $600\,\mathrm{N} \cdot 0{,}17\,\mathrm{m} = 102\,\mathrm{N\,m}$. Os se ne zlomi in se skoraj ne zvije. Kako debela mora biti, da je tako?

Isto vprašanje rešujejo inženirji, ki gradijo rover za Mars. Motor vsakega kolesa ga poganja prek gredi z navorom okoli $150\,\mathrm{N\,m}$. Vsak gram, ki ga izstrelimo v vesolje, stane, zato gred ne sme biti debelejša, kot je treba. Ne sme pa se niti zlomiti, saj na Marsu ni serviserja.

Gred, ki jo obremenjuje navor okoli njene osi, je obremenjena na **torzijo** (zvijanje). Izračunal boš največjo strižno napetost v okrogli gredi in kot, za katerega se gred zasuče. Enako računamo pogonske gredi, osi vijačnikov in torzijske vzmeti.

## Razlaga

Pri osni obremenitvi palico vlečemo vzdolž osi. Pri torziji jo vrtimo okoli osi: en konec zadržuje kolo ali vpetje, na drugi konec deluje motor z **navorom** $T$ (merimo ga v $\mathrm{N\,m}$). Novo idejo zgradimo iz razlik do osne obremenitve, ki jo že poznaš.

**Razlika 1: vrsta deformacije.** Na površino gredi nariši mrežo kvadratkov. Pri nategu se kvadratek podaljša. Pri torziji se poševno nagne v romb: zgornji rob se premakne vstran glede na spodnjega. To je **strižna deformacija** $\gamma$, kot, za katerega se nagne nekdaj pravi kot (v radianih). Pripada ji **strižna napetost** $\tau$, sila na ploščino, ki deluje *v ravnini* preseka. Hookov zakon za strig je $\tau = G\gamma$, kjer je $G$ **strižni modul** (jeklo $80\,\mathrm{GPa}$, titan okoli $44\,\mathrm{GPa}$, aluminij okoli $26\,\mathrm{GPa}$). Velja do meje proporcionalnosti za strig; za izotropen material je $G = \frac{E}{2(1 + \nu)}$, kjer je $\nu$ Poissonovo število.

**Razlika 2: kako se napetost razporedi.** Pri nategu vsako vlakno nosi enako napetost $\sigma = F/A$. Pri torziji ne. Črta, ki jo narišeš vzdolž gredi, se zvije v vijačnico. Če se konec gredi zasuče za kot $\varphi$, se točka na razdalji $\rho$ od osi premakne po loku $\rho\varphi$. Točka na osi se sploh ne premakne. Ta premik se porazdeli po vsej dolžini $L$, zato je nagib kvadratka lok, deljen z dolžino:

$$\gamma = \frac{\rho\,\varphi}{L}, \qquad \tau = G\,\frac{\rho\,\varphi}{L}$$

Napetost raste **linearno od nič na osi do največje vrednosti na površini**.

**Predpostavke.** Gred je ravna, s stalnim polnim ali kolobarjastim krožnim prerezom, material je homogen, izotropen in linearno elastičen, navor deluje okoli osi. Prerezi ostanejo ravni in okrogli, polmeri v njih ostanejo ravni in se le zasučejo. Prav to smo zgoraj uporabili za $\gamma = \rho\varphi/L$.

**Izrek.** Če gred dolžine $L$ ob teh predpostavkah prenaša stalen navor $T$, potem je $\tau(\rho) = \frac{T\rho}{J}$ in $\varphi = \frac{TL}{GJ}$, kjer je $J = \int_A \rho^2\,\mathrm{d}A$ polarni vztrajnostni moment preseka (pomen pojasni razlika 3).

*Dokaz.* Napetost $\tau = G\rho\varphi/L$ na ploščici $\mathrm{d}A$ da glede na os navor $\tau\rho\,\mathrm{d}A$. Ravnovesje dela gredi: $T = \int_A \tau\rho\,\mathrm{d}A = \frac{G\varphi}{L}\int_A \rho^2\,\mathrm{d}A = \frac{G\varphi}{L} J$. Od tod $\varphi = \frac{TL}{GJ}$; vstavimo v $\tau = G\rho\varphi/L$ in dobimo $\tau = \frac{T\rho}{J}$. $\square$

:::premisli
V jekleni gredi s polmerom $10\,\mathrm{mm}$ je na površini $\tau = 90\,\mathrm{MPa}$. Sredico do polmera $5\,\mathrm{mm}$ bi radi izvrtali. Kolikšna je največja strižna napetost v snovi, ki jo odstranimo? Kje bi pri preobremenitvi začela nastajati razpoka?
---
$45\,\mathrm{MPa}$, ker je $\tau$ sorazmerna z $\rho$, $5\,\mathrm{mm}$ pa je pol polmera. Razpoka nastane na površini, kjer je napetost največja.
:::

**Razlika 3: kaj meri »debelino« preseka.** Pri nategu je odločilna ploščina $A$. Pri torziji kos ploščine $\mathrm{d}A$ na razdalji $\rho$ nosi napetost, sorazmerno z $\rho$, in ima ročico $\rho$, zato šteje $\rho^2\,\mathrm{d}A$. Seštevek je **polarni vztrajnostni moment** $J$. Za poln krog s premerom $d$ in za cev z zunanjim $D$ in notranjim $d$:

$$J = \frac{\pi d^4}{32}, \qquad J_{\text{cev}} = \frac{\pi (D^4 - d^4)}{32}$$

*Izpeljava.* Kolobar s polmerom $\rho$ in debelino $\mathrm{d}\rho$ ima $\mathrm{d}A = 2\pi\rho\,\mathrm{d}\rho$, zato je za poln krog s polmerom $r = d/2$: $J = \int_0^{r} 2\pi\rho^3\,\mathrm{d}\rho = \frac{\pi r^4}{2} = \frac{\pi d^4}{32}$. Za cev integriramo od $d/2$ do $D/2$.

Iz upogiba poznaš $I = \pi d^4/64$. Za krog je $J = 2I$, ker je $\rho^2 = y^2 + z^2$ in zato $J = I_y + I_z$.

Primerjava obeh obremenitev:

| | Osna obremenitev | Torzija |
|---|---|---|
| obremenitev | sila $F$ | navor $T$ |
| napetost | $\sigma = F/A$, enakomerna | $\tau = T\rho/J$, linearna |
| deformacija | $\varepsilon$ | $\gamma$ |
| modul | $E$ | $G$ |
| togost | $EA$ | $GJ$ |
| sprememba oblike | $\Delta L = \dfrac{FL}{EA}$ | $\varphi = \dfrac{TL}{GJ}$ |

Največja napetost je na površini ($\rho = d/2$):

$$\tau_{\max} = \frac{T\,d/2}{J} = \frac{16\,T}{\pi d^3}$$

Kot zasuka $\varphi$ dobimo v **radianih**. V stopinje ga pretvorimo z $180^\circ/\pi$. Pri cevi je $\tau_{\max} = \frac{T\,D/2}{J_{\text{cev}}}$. Količnik med $J$ in polmerom zunanje površine imenujemo **polarni odpornostni moment**: $W_\mathrm{p} = J/(d/2)$ pri polni gredi in $W_\mathrm{p} = J_{\text{cev}}/(D/2)$ pri cevi. Tedaj je $\tau_{\max} = T/W_\mathrm{p}$.

**Dimenzioniranje.** Gred mora izpolniti **trdnostni pogoj** $\tau_{\max} \le \tau_\mathrm{dop}$ in pogosto še **togostni pogoj** $\varphi/L \le \theta_\mathrm{dop}$ (dopustni zasuk na meter, npr. $0{,}25^\circ/\mathrm{m}$ pri pogonskih gredeh). Navor pogosto ni podan neposredno, ampak z močjo $P$ in vrtilno frekvenco $n$: iz $P = T\omega$ in $\omega = 2\pi n$ sledi $T = \frac{P}{2\pi n}$.

**Statično nedoločena gred.** Če je gred vpeta na obeh koncih in navor $T$ deluje vmes, na razdaljah $a$ in $b$ od vpetij, ravnovesje da le $T_A + T_B = T$. Drugo enačbo da skladnost: prerez, kjer deluje $T$, ima en sam zasuk, zato $\frac{T_A a}{GJ} = \frac{T_B b}{GJ}$. Sledi $T_A = \frac{Tb}{a + b}$ in $T_B = \frac{Ta}{a + b}$: bližnje vpetje prevzame večji del.

:::premisli
Premer gredi podvojiš, navor ostane enak. Kolikokrat se zmanjšata $\tau_{\max}$ in $\varphi$? Primerjaj s palico, ki ji pri nategu podvojiš premer.
---
$\tau_{\max} \propto 1/d^3$ se zmanjša osemkrat, $\varphi \propto 1/d^4$ šestnajstkrat. Pri nategu se $\sigma$ in $\Delta L$ zmanjšata le štirikrat, ker je $A \propto d^2$. Premer je pri torziji veliko močnejši vzvod.
:::

Iz linearne razporeditve sledi še nekaj: snov blizu osi nosi majhno napetost in skoraj nič ne prispeva k $J$. Zato so gredi v vesoljskih napravah pogosto votle. Formule veljajo le za okrogle prereze in v elastičnem območju.

Na površinskem elementu delujejo enake strižne napetosti tudi v vzdolžnih ravninah (**konjugiranost strižnih napetosti**). V smereh pod $45^\circ$ na os sta zato glavni napetosti $\sigma_{1,2} = \pm\tau$: krhka snov poči po vijačnici pod $45^\circ$ zaradi natega, žilava pa po prečnem prerezu zaradi striga.

## Rešeni primeri

### Primer 1: gred kolesa roverja

Polna jeklena gred, ki poganja kolo roverja, ima premer $20\,\mathrm{mm}$ in prenaša navor $150\,\mathrm{N\,m}$. Kolikšna je največja strižna napetost? Kolikšna je napetost $5\,\mathrm{mm}$ od osi?

**Podatki:** $T = 150\,\mathrm{N\,m} = 150\,000\,\mathrm{N\,mm}$, $d = 20\,\mathrm{mm}$, $\rho = 5\,\mathrm{mm}$
**Iščemo:** $\tau_{\max}$ in $\tau$ pri $\rho = 5\,\mathrm{mm}$

:::formula
$\tau_{\max} = \dfrac{16\,T}{\pi d^3}$, $\quad \tau(\rho) = \tau_{\max}\,\dfrac{\rho}{d/2}$
:::

**Rešitev:**

1. Navor pretvorimo v $\mathrm{N\,mm}$, da dobimo napetost v $\mathrm{N/mm^2} = \mathrm{MPa}$.
2. $\tau_{\max} = \dfrac{16 \cdot 150\,000\,\mathrm{N\,mm}}{\pi \cdot (20\,\mathrm{mm})^3} \approx 95{,}5\,\mathrm{MPa}$.
3. Točka $5\,\mathrm{mm}$ od osi leži na polovici polmera, zato je $\tau \approx 95{,}5\,\mathrm{MPa} / 2 \approx 47{,}7\,\mathrm{MPa}$.
4. Odgovor: na površini je $\tau_{\max} \approx 95{,}5\,\mathrm{MPa}$, na polovici polmera pa okoli $47{,}7\,\mathrm{MPa}$.

### Primer 2: za koliko se gred zasuče

Ista gred je med motorjem in kolesom dolga $300\,\mathrm{mm}$. Za koliko stopinj se zasuče kolo glede na motor, ko gred prenaša $150\,\mathrm{N\,m}$?

**Podatki:** $T = 150\,000\,\mathrm{N\,mm}$, $L = 300\,\mathrm{mm}$, $d = 20\,\mathrm{mm}$, $G = 80\,000\,\mathrm{MPa}$
**Iščemo:** kot zasuka $\varphi$

:::formula
$J = \dfrac{\pi d^4}{32}$, $\quad \varphi = \dfrac{TL}{GJ}$
:::

**Rešitev:**

1. $J = \dfrac{\pi \cdot (20\,\mathrm{mm})^4}{32} \approx 15\,708\,\mathrm{mm^4}$.
2. Torzijska togost: $GJ \approx 80\,000\,\mathrm{MPa} \cdot 15\,708\,\mathrm{mm^4} \approx 1{,}257 \cdot 10^9\,\mathrm{N\,mm^2}$.
3. $\varphi = \dfrac{150\,000\,\mathrm{N\,mm} \cdot 300\,\mathrm{mm}}{1{,}257 \cdot 10^9\,\mathrm{N\,mm^2}} \approx 0{,}0358\,\mathrm{rad}$.
4. V stopinjah: $0{,}0358 \cdot 180^\circ / \pi \approx 2{,}05^\circ$.
5. Odgovor: kolo zaostane za motorjem za približno $2^\circ$.

### Primer 3: votla gred je lažja in močnejša

Inženirji polno gred iz primerov 1 in 2 zamenjajo z votlo jekleno cevjo z zunanjim premerom $24\,\mathrm{mm}$ in notranjim $18\,\mathrm{mm}$. Navor je še vedno $150\,\mathrm{N\,m}$. Je cev lažja? Kolikšna je v njej največja strižna napetost? Nato obratno: kolikšen je najmanjši zunanji premer cevi z razmerjem premerov $d/D = 0{,}75$, ki ima enako $\tau_{\max}$ kot polna gred, in koliko je ta cev lažja?

**Podatki:** $D = 24\,\mathrm{mm}$, $d = 18\,\mathrm{mm}$, $T = 150\,000\,\mathrm{N\,mm}$; polna gred: $d_0 = 20\,\mathrm{mm}$, $\tau_{\max,0} \approx 95{,}5\,\mathrm{MPa}$; za drugi del $k = d/D = 0{,}75$
**Iščemo:** razmerje mas (pri enaki dolžini in snovi), $\tau_{\max}$ v cevi ter $D$ druge cevi in njeno razmerje mas

:::formula
$A = \dfrac{\pi (D^2 - d^2)}{4}$, $\quad J = \dfrac{\pi (D^4 - d^4)}{32}$, $\quad \tau_{\max} = \dfrac{T\,D/2}{J} = \dfrac{16\,T}{\pi D^3 (1 - k^4)}$
:::

**Rešitev:**

1. Masa je sorazmerna s ploščino preseka. Razmerje: $\dfrac{D^2 - d^2}{d_0^2} = \dfrac{576 - 324}{400} = 0{,}63$.
2. Cev ima torej le $63\,\%$ mase polne gredi, je za $37\,\%$ lažja.
3. $J = \dfrac{\pi \cdot (331\,776 - 104\,976)\,\mathrm{mm^4}}{32} \approx 22\,266\,\mathrm{mm^4}$, več kot pri polni gredi ($15\,708\,\mathrm{mm^4}$).
4. Napetost na zunanji površini: $\tau_{\max} = \dfrac{150\,000\,\mathrm{N\,mm} \cdot 12\,\mathrm{mm}}{22\,266\,\mathrm{mm^4}} \approx 80{,}8\,\mathrm{MPa}$.
5. Obratno vprašanje: enaka $\tau_{\max}$ pri istem $T$ zahteva enak $W_\mathrm{p}$, torej $D^3(1 - k^4) = d_0^3$. Z $1 - 0{,}75^4 = 0{,}6836$ dobimo $D = 20\,\mathrm{mm}/\sqrt[3]{0{,}6836} \approx 22{,}7\,\mathrm{mm}$ in notranji premer $0{,}75 \cdot 22{,}7 \approx 17{,}0\,\mathrm{mm}$.
6. Razmerje mas: $\dfrac{D^2(1 - k^2)}{d_0^2} = \dfrac{22{,}7^2 \cdot 0{,}4375}{400} \approx 0{,}564$.
7. Odgovor: prva cev je za $37\,\%$ lažja, največja napetost pa se zniža s $95{,}5$ na približno $80{,}8\,\mathrm{MPa}$. Cev z $D \approx 22{,}7\,\mathrm{mm}$ in $d \approx 17{,}0\,\mathrm{mm}$ je enako trdna kot polna gred in za okoli $44\,\%$ lažja. Snov smo premaknili tja, kjer nosi največ.

### Primer 4: zdaj ti

Sveder, ki na Marsu vrta vzorce kamnin, poganja polna titanova gred. Prenaša navor $40\,\mathrm{N\,m}$, dovoljena strižna napetost je $60\,\mathrm{MPa}$. Kolikšen mora biti najmanj premer gredi?

**Podatki:** $T = 40\,\mathrm{N\,m} = 40\,000\,\mathrm{N\,mm}$, $\tau_{\text{dop}} = 60\,\mathrm{MPa}$
**Iščemo:** najmanjši premer $d$

:::formula
$\tau_{\max} = \dfrac{16\,T}{\pi d^3} \le \tau_{\text{dop}}$ $\;\Rightarrow\;$ $d \ge \sqrt[3]{\dfrac{16\,T}{\pi\,\tau_{\text{dop}}}}$
:::

**Rešitev:**

1. Neznanka je premer, zato enačbo za $\tau_{\max}$ obrnemo: $d^3 = \dfrac{16\,T}{\pi\,\tau_{\text{dop}}}$.
2. Vstavi: $d^3 = \dfrac{16 \cdot 40\,000\,\mathrm{N\,mm}}{\pi \cdot 60\,\mathrm{N/mm^2}}$. Izračunaj sam, nato preveri:

:::premisli
Koliko je $d^3$ in koliko $d$?
---
$d^3 \approx 3395\,\mathrm{mm^3}$, $d = \sqrt[3]{3395}\,\mathrm{mm} \approx 15{,}0\,\mathrm{mm}$. Snov ($G$) pri trdnosti ne nastopa; vpliva le na kot zasuka.
:::

## Pogoste napake

- **»Napetost je po preseku enaka, kot pri nategu.«** Pri torziji je na osi nič in linearno raste do površine. Zato $\tau = T/A$ ne velja; prava formula je $\tau = T\rho/J$.
- **Kot v stopinjah v formuli.** $\varphi = TL/(GJ)$ in $\gamma = \rho\varphi/L$ zahtevata radiane. Izmerjen kot v stopinjah najprej pomnoži s $\pi/180^\circ$.
- **Zamenjava $J$ in $I$.** Iz upogiba poznaš $I = \pi d^4/64$. Pri torziji je potreben polarni $J = \pi d^4/32 = 2I$. Kdor vzame $I$, dobi dvakrat preveliko napetost in zasuk.
- **Polmer namesto premera.** V $\tau_{\max} = 16T/(\pi d^3)$ je $d$ premer. Kdor vstavi polmer, dobi osemkrat preveliko napetost. V $\tau = T\rho/J$ pa je $\rho$ razdalja od osi, na površini $d/2$.
- **$E$ namesto $G$.** Za strig šteje strižni modul. Jeklo ima $E = 200\,\mathrm{GPa}$, a $G = 80\,\mathrm{GPa}$; z $E$ dobiš $2{,}5$-krat premajhen zasuk.

## Povzetek

- Torzija: navor $T$ okoli osi gredi. Nastanejo strižne napetosti $\tau$ in strižne deformacije $\gamma$, $\tau = G\gamma$.
- V okrogli gredi $\tau = T\rho/J$ raste linearno od $0$ na osi do $\tau_{\max} = \dfrac{16T}{\pi d^3}$ na površini.
- Polarni vztrajnostni moment: $J = \pi d^4/32$ (poln krog), $J = \pi(D^4 - d^4)/32$ (cev); $J = 2I$.
- Kot zasuka v radianih: $\varphi = \dfrac{TL}{GJ}$, analogno $\Delta L = \dfrac{FL}{EA}$.
- $\tau_{\max} \propto 1/d^3$, $\varphi \propto 1/d^4$. Votla gred pri isti masi prenese več.
- Računaj v $\mathrm{N\,mm}$, $\mathrm{mm}$, $\mathrm{MPa}$; jeklo $G = 80\,\mathrm{GPa}$.

## Za izpit

Znati moraš povedati:

- predpostavke torzije okrogle gredi (ravni in okrogli prerezi, ravni polmeri, linearno elastičen homogen material) in Hookov zakon za strig $\tau = G\gamma$;
- izpeljavo $\gamma = \rho\varphi/L$, $\tau = T\rho/J$ in $\varphi = TL/(GJ)$ iz ravnovesja navorov;
- izpeljavo $J = \pi d^4/32$ za krog in $J = \pi(D^4 - d^4)/32$ za cev ter zvezo $J = 2I$;
- trdnostni in togostni pogoj ter $T = P/(2\pi n)$;
- reševanje obojestransko vpete gredi (ravnovesje + skladnost zasukov) in zakaj krhka gred poči pod $45^\circ$.

### Naloga 1

Polna jeklena gred ($G = 80\,\mathrm{GPa}$) s premerom $40\,\mathrm{mm}$ in dolžino $1{,}2\,\mathrm{m}$ je na obeh koncih togo vpeta. Na razdalji $a = 0{,}4\,\mathrm{m}$ od levega vpetja A nanjo deluje navor $T = 1{,}2\,\mathrm{kN\,m}$. (a) Izračunaj reakcijska navora v vpetjih. (b) Preveri trdnostni pogoj pri $\tau_\mathrm{dop} = 60\,\mathrm{MPa}$ in določi najmanjši potrebni premer. (c) Za koliko stopinj se zasuče prerez, kjer deluje navor (pri $d = 40\,\mathrm{mm}$)?

**Rešitev:**

1. Ravnovesje: $T_A + T_B = T = 1200\,\mathrm{N\,m}$; ena enačba za dve neznanki, gred je statično nedoločena.
2. Skladnost: zasuk prereza C, izračunan z leve in z desne, je enak: $T_A a = T_B b$ z $b = 0{,}8\,\mathrm{m}$.
3. $T_A = \frac{Tb}{L} = \frac{1200 \cdot 0{,}8}{1{,}2} = 800\,\mathrm{N\,m}$, $T_B = 400\,\mathrm{N\,m}$.
4. (b) Največji navor je v krajšem delu: $\tau_{\max} = \dfrac{16 \cdot 800\,000\,\mathrm{N\,mm}}{\pi \cdot (40\,\mathrm{mm})^3} \approx 63{,}7\,\mathrm{MPa} > 60\,\mathrm{MPa}$, pogoj ni izpolnjen.
5. Najmanjši premer: $d^3 \ge \dfrac{16 \cdot 800\,000}{\pi \cdot 60}\,\mathrm{mm^3} \approx 67\,906\,\mathrm{mm^3}$, $d \ge 40{,}8\,\mathrm{mm}$; izberemo $41\,\mathrm{mm}$ (sprememba $d$ reakcij ne spremeni, ker se $GJ$ pokrajša).
6. (c) $J = \dfrac{\pi \cdot 40^4}{32} \approx 251\,327\,\mathrm{mm^4}$, $GJ \approx 2{,}011 \cdot 10^{10}\,\mathrm{N\,mm^2}$.
7. $\varphi_C = \dfrac{T_A a}{GJ} = \dfrac{800\,000 \cdot 400}{2{,}011 \cdot 10^{10}} \approx 0{,}0159\,\mathrm{rad} \approx 0{,}91^\circ$; kontrola z desne: $\frac{400\,000 \cdot 800}{2{,}011 \cdot 10^{10}}$ da isto.
8. Odgovor: $T_A = 800\,\mathrm{N\,m}$, $T_B = 400\,\mathrm{N\,m}$; pri $40\,\mathrm{mm}$ je $\tau_{\max} \approx 63{,}7\,\mathrm{MPa}$, kar je preveč, potreben je premer vsaj $40{,}8\,\mathrm{mm}$; prerez C se zasuče za okoli $0{,}91^\circ$.

### Naloga 2

Navedi predpostavke torzije okrogle gredi in izpelji $\tau = T\rho/J$ in $\varphi = TL/(GJ)$. Izpelji $J$ za cev. Utemelji, ali votla gred z $d/D = 0{,}8$ prenese večji navor kot polna gred iz istega materiala z enako maso in dolžino, in kolikokrat.

**Rešitev:**

1. Predpostavke: krožen prerez, ravni in okrogli prerezi, ravni polmeri, homogen izotropen linearno elastičen material, navor okoli osi.
2. Točka na razdalji $\rho$ se zasuče po loku $\rho\varphi$, porazdeljenem po dolžini $L$: $\gamma = \rho\varphi/L$, po Hookovem zakonu $\tau = G\rho\varphi/L$.
3. Ravnovesje: $T = \int_A \tau\rho\,\mathrm{d}A = \frac{G\varphi}{L} J$, torej $\varphi = \frac{TL}{GJ}$ in $\tau = \frac{T\rho}{J}$.
4. Cev: $J = \int_{d/2}^{D/2} 2\pi\rho^3\,\mathrm{d}\rho = \frac{\pi}{2}\Big[\big(\tfrac{D}{2}\big)^4 - \big(\tfrac{d}{2}\big)^4\Big] = \frac{\pi (D^4 - d^4)}{32}$.
5. Enaka masa pomeni enako ploščino: $D^2(1 - 0{,}8^2) = d_0^2$, zato $D = d_0/0{,}6 \approx 1{,}667\,d_0$.
6. Prenesen navor pri $\tau_\mathrm{dop}$ je $T = \tau_\mathrm{dop} W_\mathrm{p}$, $W_\mathrm{p} = \frac{\pi D^3(1 - k^4)}{16}$ s $k = 0{,}8$, pri polni gredi $\frac{\pi d_0^3}{16}$. Razmerje: $\frac{D^3(1 - 0{,}8^4)}{d_0^3} = 4{,}630 \cdot 0{,}5904 \approx 2{,}73$.
7. Odgovor: da, votla gred enake mase prenese okoli $2{,}7$-krat večji navor, ker je snov odmaknjena od osi, kjer nosi največ napetosti. Meja je lokalno izbočenje pretankih sten.

## Drugače: Na sliki

Predstavljaj si gred kot snop tankih cevi, vtaknjenih druga v drugo, kot letnice v deblu.

| Razdalja od osi | Lok pri zasuku | Nagib $\gamma$ | $\tau$ |
|---|---|---|---|
| $0$ (os) | $0$ | $0$ | $0$ |
| $r/2$ | $r\varphi/2$ | $\gamma_{\max}/2$ | $\tau_{\max}/2$ |
| $r$ (površina) | $r\varphi$ | $\gamma_{\max}$ | $\tau_{\max}$ |

Ko zasučeš konec gredi za kot $\varphi$, se vse cevi zasučejo za isti kot. Zunanja cev pa mora pri tem prepotovati daljši lok, zato se njena površina najbolj nagne in je najbolj napeta. Notranje cevi se komaj nagnejo.

Črta, ki je bila narisana vzdolž gredi, se po zasuku ovije v vijačnico. Kot med vijačnico in osjo je $\gamma$ na površini. Pri dvakrat daljši gredi se ob istem navoru konec zasuče dvakrat bolj, nagib $\gamma$ pa ostane enak.

## Drugače: Uporaba v stroki

- **Mešala in črpalke.** Motor mešala v reaktorju z močjo $5{,}5\,\mathrm{kW}$ pri $150\,\mathrm{min^{-1}}$ obremenjuje gred z $T = P/(2\pi n) \approx 350\,\mathrm{N\,m}$. Gred dimenzioniramo z rezervo, ker utor za moznik povzroči koncentracijo napetosti, ponavljajoči se zagoni pa utrujanje.
- **Vzmeti varnostnih ventilov.** Žica vijačne vzmeti je obremenjena pretežno torzijsko, $\tau \approx \frac{8FD_\mathrm{v}}{\pi d^3}$ ($D_\mathrm{v}$ je srednji premer vzmeti), s popravnim faktorjem za ukrivljenost. Od nje je odvisno, pri katerem tlaku se ventil odpre.
- **Merjenje navora.** Merilni lističi, nalepljeni na gred pod $\pm 45^\circ$, merijo glavni deformaciji; iz njiju dobimo $\gamma$ in navor. Tako delujejo merilne gredi na preizkuševališčih.
- **Preiskava lomov.** Žilava gred, porušena s torzijo, ima gladek prečen prelom; krhka (litina) poči po vijačnici pod $45^\circ$, kot kreda med prsti. Pri preiskavi nesreče oblika preloma pove, ali je šlo za preobremenitev z navorom ali za utrujanje.

## Drugače: Bolj natančno

Predpostavke: prerezi ostanejo ravni in okrogli, polmeri ostanejo ravni, snov je elastična in homogena. Tedaj je $\gamma(\rho) = \rho\,\varphi/L$ in $\tau(\rho) = G\rho\,\varphi/L$. Ravnovesje med zunanjim navorom in notranjimi napetostmi:

$$T = \int_A \tau\,\rho\,\mathrm{d}A = \frac{G\varphi}{L}\int_A \rho^2\,\mathrm{d}A = \frac{G\varphi}{L}\,J$$

Od tod $\varphi = TL/(GJ)$, z vstavitvijo v $\tau$ pa $\tau = T\rho/J$. Za krog z $\mathrm{d}A = 2\pi\rho\,\mathrm{d}\rho$ je $J = \int_0^{r} 2\pi\rho^3\,\mathrm{d}\rho = \pi r^4/2 = \pi d^4/32$. Ker je $\rho^2 = y^2 + z^2$, velja $J = I_y + I_z = 2I$.

Za neokrogle prereze (pravokotnik, profil I) prerezi niso več ravni, ampak se vbočijo, in te formule ne veljajo. Zasuk po delih gredi s spremenljivim navorom ali premerom seštejemo: $\varphi = \sum_i T_i L_i/(G_i J_i)$.

## Preveri se

? Zakaj so gredi v vesoljskih napravah pogosto votle?
- Ker je pri votli gredi napetost po preseku enakomerna.
~ Tudi v cevi napetost raste z $\rho$; razlika je le, da manjka del z majhno napetostjo.
+ Ker snov blizu osi nosi majhno napetost in malo prispeva k $J$, zato jo lahko odstranimo z malo izgube trdnosti.
- Ker je votla gred pri enakem zunanjem premeru močnejša od polne.
~ Pri enakem zunanjem premeru ima cev manjši $J$ in je malo šibkejša. Prednost je v razmerju trdnosti in mase.
> Prispevek k $J$ je sorazmeren z $\rho^2$, zato sredica skoraj nič ne nosi, pa veliko tehta.

? Katera razporeditev strižne napetosti po polmeru ustreza polni okrogli gredi pri torziji?
- $\rho = 0;\ r/2;\ r$: $\tau = 60;\ 60;\ 60\,\mathrm{MPa}$
~ Enakomerna napetost velja pri osni obremenitvi. Pri torziji se točka na osi ne deformira.
+ $\rho = 0;\ r/2;\ r$: $\tau = 0;\ 30;\ 60\,\mathrm{MPa}$
- $\rho = 0;\ r/2;\ r$: $\tau = 60;\ 30;\ 0\,\mathrm{MPa}$
~ Obrnjeno: največ se deformira površina, ki prepotuje najdaljši lok, os pa nič.
> $\tau = T\rho/J$ je sorazmerna z razdaljo od osi: na osi $0$, na površini največ.

? Gredi podvojimo dolžino in premer, navor ostane enak. Kako se spremeni kot zasuka $\varphi$?
- Ostane enak, ker se dvojki pokrajšata.
~ Dolžina in premer ne vplivata enako močno: $\varphi \propto L/d^4$, ne $L/d$.
- Zmanjša se šestnajstkrat.
~ To je le vpliv premera. Dvakrat daljša gred se pri istem navoru zasuče dvakrat bolj.
- Zmanjša se dvakrat.
~ To bi dobil s $\varphi \propto L/d^2$, kot pri $\Delta L = FL/(EA)$. Pri torziji šteje $J \propto d^4$.
+ Zmanjša se osemkrat.
> $\varphi = TL/(GJ) \propto L/d^4$: $2/2^4 = 1/8$.

? Jeklena gred ($G = 80\,\mathrm{GPa}$) z $J = 2{,}0 \cdot 10^{-8}\,\mathrm{m^4}$ in dolžino $0{,}4\,\mathrm{m}$ se zasuče za $1{,}72^\circ$. Kolikšen navor prenaša?
- Približno $6880\,\mathrm{N\,m}$
~ Tu je kot vstavljen v stopinjah. Formula zahteva radiane: $1{,}72^\circ \approx 0{,}030\,\mathrm{rad}$.
- Približno $19\,\mathrm{N\,m}$
~ Tu je dolžina pomnožena, ne deljena. Daljša gred se pri istem navoru zasuče bolj, zato $T = GJ\varphi/L$.
+ Približno $120\,\mathrm{N\,m}$
> $\varphi = 1{,}72^\circ \cdot \pi/180^\circ \approx 0{,}030\,\mathrm{rad}$, $T = \dfrac{GJ\varphi}{L} = \dfrac{80 \cdot 10^9 \cdot 2{,}0 \cdot 10^{-8} \cdot 0{,}030}{0{,}4}\,\mathrm{N\,m} \approx 120\,\mathrm{N\,m}$.

? Astronavt pri vesoljskem sprehodu privija vijak z orodjem, ki ima polno jekleno steblo s premerom $10\,\mathrm{mm}$. Navor je $20\,\mathrm{N\,m}$. Kolikšna je največja strižna napetost v steblu?
- Približno $815\,\mathrm{MPa}$
~ To dobiš, če v $16T/(\pi d^3)$ vstaviš polmer $5\,\mathrm{mm}$ namesto premera.
- Približno $204\,\mathrm{MPa}$
~ Tu je uporabljen $I = \pi d^4/64$ iz upogiba namesto polarnega $J = \pi d^4/32$.
+ Približno $102\,\mathrm{MPa}$
- Približno $0{,}25\,\mathrm{MPa}$
~ To je $T/A$, kot pri nategu. Navor ni sila in napetost ni enakomerna.
> $\tau_{\max} = \dfrac{16 \cdot 20\,000\,\mathrm{N\,mm}}{\pi \cdot (10\,\mathrm{mm})^3} \approx 102\,\mathrm{MPa}$. V breztežnosti se navor ne spremeni: steblo napenja roka astronavta, ne teža.

:::simboli
\gamma | strižna deformacija | \gamma = \frac{\rho\,\varphi}{L} | rad |
\rho | razdalja od osi gredi | | m | na obodu ρ = d/2
\varphi | zasučni kot gredi | \varphi = \dfrac{TL}{GJ} | rad |
L | dolžina gredi | | m |
\tau | strižna napetost | \tau = G\,\frac{\rho\,\varphi}{L} | Pa | sorazmerna z ρ
G | strižni modul | | Pa | jeklo 80 GPa
J | polarni vztrajnostni moment preseka | J = \int_A \rho^2\,\mathrm{d}A | m^4 | za poln krog J = πd⁴/32 = 2I
d | premer gredi (pri cevi notranji premer) | | m | pri dimenzioniranju d ≥ ∛(16T/(π τ_dop))
J_{\text{cev}} | polarni vztrajnostni moment cevi | J_{\text{cev}} = \frac{\pi (D^4 - d^4)}{32} | m^4 |
D | zunanji premer cevi | | m |
\tau_{\max} | največja strižna napetost (na obodu) | \tau_{\max} = \frac{T\,d/2}{J} = \frac{16\,T}{\pi d^3} | Pa | za cev τ_max = T·(D/2)/J
T | navor | | N m | v zgledih v N mm
A | ploščina prečnega prereza | | m^2 | za cev A = π(D² − d²)/4
\tau_{\text{dop}} | dopustna strižna napetost | | Pa | v zgledih v MPa
W_\mathrm{p} | polarni odpornostni moment | W_\mathrm{p} = \frac{J}{d/2} | m^3 | τ_max = T/W_p; pri cevi W_p = J/(D/2)
P | moč | P = T\omega | W |
n | vrtilna frekvenca | | s^{-1} | T = P/(2πn)
k | razmerje notranjega in zunanjega premera cevi | k = \frac{d}{D} | – |
:::
