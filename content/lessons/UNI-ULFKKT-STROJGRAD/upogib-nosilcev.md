---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Stegnenica, najmočnejša kost v telesu, je v sredini votla. V njej je kostni mozeg, nosilni del je le cev z debelo steno. Zveni kot slaba zasnova: zakaj bi narava zapravila prostor tam, kjer bi lahko bila trdna kost?

Presenečenje je obratno. Če bi iz enake količine kostnine naredili poln valj, bi bil pri upogibu **šibkejši**: ob enakem obremenjevanju bi v njem nastala okoli $1{,}7$-krat večja napetost. Votla kost je hkrati lažja in trdnejša.

Pri hoji, teku ali padcu se stegnenica upogiba, ne le stiska. Enako velja za zobne mostičke, kostne ploščice po zlomu, ročice bolniških postelj in stropna dvigala za paciente. Vsi so **nosilci**: dolgi elementi, obremenjeni s silami prečno na svojo os. Ko razumeš upogib, razumeš tudi, zakaj je kost votla.

## Razlaga

**1. Ali zadošča kar $\sigma = F/A$?** Pri osni obremenitvi je napetost po preseku enakomerna, $\sigma = F/A$. Kaj, če isto formulo uporabimo tudi tu? Potem bi štela le površina preseka: odvzem materiala iz sredine kosti bi jo vedno oslabil, oblika pa ne bi bila pomembna.

Odgovor da plastično ravnilo, široko $30\,\mathrm{mm}$ in debelo $2\,\mathrm{mm}$. Vpnemo ga v mizo, da gleda $150\,\mathrm{mm}$ čez rob, in na konec pritisnemo s prstom s silo $5\,\mathrm{N}$. Po $F/A$ je $\sigma = \dfrac{5\,\mathrm{N}}{60\,\mathrm{mm^2}} \approx 0{,}08\,\mathrm{MPa}$. To je premalo, da bi plastika sploh opazila. Ravnilo pa se vidno upogne in ob malo večji sili poči. Pravilni račun spodaj da $37{,}5\,\mathrm{MPa}$, kar je $450$-krat več. Račun $F/A$ torej zgreši bistvo.

**2. Kaj se dogaja v prerezu.** Nosilec v mislih prerežemo na mestu $x$. Da del ostane v ravnovesju, mora v prerezu delovati dvoje:

- **prečna sila** $T$: vsota vseh zunanjih sil pravokotno na os na eni strani prereza;
- **upogibni moment** $M$: vsota momentov teh sil glede na prerez.

Dogovor o predznaku: $T > 0$, če je rezultanta zunanjih sil na delu levo od prereza usmerjena navzgor; $M > 0$, če nosilec upogiba tako, da so spodnja vlakna v nategu (»smešek«). Notranji sili na desnem delu sta po zakonu akcije in reakcije enako veliki in nasprotno usmerjeni, zato je vseeno, kateri del gledamo.

Ravnilo je **konzola**, nosilec, vpet na enem koncu. Če je $a$ razdalja od prostega konca do prereza, je $T = F$ povsod in $M = F \cdot a$ (po velikosti; zgornja vlakna so v nategu, zato je po dogovoru $M < 0$). Moment je nič pod prstom in največji ob vpetju, $M_\mathrm{max} = F L = 5\,\mathrm{N} \cdot 150\,\mathrm{mm} = 750\,\mathrm{N\,mm}$.

:::premisli
Na konec iztegnjene roke položiš težko torbo. Kje v roki (kot konzoli) je upogibni moment največji: v zapestju, komolcu ali rami? Kolikokrat večji je v rami kot v komolcu, če je komolec na polovici poti od rame do torbe?
---
V rami. Tam je ročica do torbe najdaljša, $M = F \cdot a$ pa raste z oddaljenostjo od bremena. Ročica do rame je dvakrat daljša kot do komolca, zato je moment v rami dvakrat večji. Zato se utrudijo ramenske mišice, ne zapestje.
:::

**3. Prostoležeči nosilec.** Nosilec na dveh podporah z razponom $L$, s silo $F$ na sredini, ima v vsaki podpori reakcijo $F/2$. Levo od sile je na levem delu le reakcija, $T = +F/2$. Desno od sile se ji pridruži še $F$ navzdol, zato $T = F/2 - F = -F/2$. Potek $T$ in $M$:

| mesto | $T$ | $M$ |
|---|---|---|
| leva podpora | $+F/2$ | $0$ |
| tik levo od sile | $+F/2$ | raste linearno do $FL/4$ |
| tik desno od sile | $-F/2$ | $FL/4$, nato pada |
| desna podpora | $-F/2$ | $0$ |

**Izrek (diferencialni zvezi).** Naj na odsek nosilca deluje le zvezna prečna obremenitev $q(x)$ (sila na dolžino, pozitivna navzdol), brez točkovnih sil in momentov. Potem na tem odseku velja

$$\frac{\mathrm{d}T}{\mathrm{d}x} = -q, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = T.$$

*Dokaz.* Izrežemo element dolžine $\mathrm{d}x$. Levo deluje $T$ in $M$, desno $T + \mathrm{d}T$ in $M + \mathrm{d}M$, na element pa še $q\,\mathrm{d}x$. Ravnovesje navpičnih sil da $T - q\,\mathrm{d}x - (T + \mathrm{d}T) = 0$, torej $\mathrm{d}T = -q\,\mathrm{d}x$. Ravnovesje momentov okoli desnega roba da $M + T\,\mathrm{d}x - q\,\mathrm{d}x \cdot \mathrm{d}x/2 - (M + \mathrm{d}M) = 0$; člen drugega reda zanemarimo in dobimo $\mathrm{d}M = T\,\mathrm{d}x$. Pod točkovno silo $F$ prečna sila skoči za $F$, moment pa ima tam lom.

Posledica: kjer prečna sila zamenja predznak, ima moment ekstrem. Nevarni prerez je tam, kjer je $|M|$ največji, ne nujno tam, kjer deluje sila.

**Enakomerna obremenitev.** Prostoležeči nosilec razpona $L$ z obremenitvijo $q$ ima reakciji $qL/2$. Zato $T(x) = qL/2 - qx$ in $M(x) = qLx/2 - qx^2/2$. Prečna sila je nič pri $x = L/2$, kjer je $M_\mathrm{max} = qL^2/8$.

**4. Upogibna napetost.** Upognjeno ravnilo ima na eni strani raztegnjena vlakna, na drugi skrčena. Vmes je plast, ki ni ne raztegnjena ne skrčena: **nevtralna os**, pri simetričnem preseku na sredini višine.

**Izrek (Navierova enačba).** Naj bo nosilec raven in prizmatičen, iz homogenega linearno elastičnega materiala, upogiban z momentom $M$ (brez osne sile) v ravnini simetrije preseka, in naj prečni prerezi ostanejo ravni in pravokotni na upognjeno os (Bernoullijeva hipoteza). Potem nevtralna os poteka skozi težišče preseka in normalna napetost na razdalji $y$ od nje je

$$\sigma = \frac{M\,y}{I}, \qquad I = \int_A y^2\,\mathrm{d}A.$$

*Dokaz.* Pri krivinskem polmeru $\rho$ se vlakno na razdalji $y$ raztegne za $\varepsilon = y/\rho$, po Hookovem zakonu je $\sigma = E y/\rho$. Osne sile ni: $\int_A \sigma\,\mathrm{d}A = (E/\rho)\int_A y\,\mathrm{d}A = 0$, torej je statični moment glede na nevtralno os nič in os gre skozi težišče. Moment notranjih sil je $M = \int_A \sigma y\,\mathrm{d}A = E I/\rho$. Iz obeh enačb sledi $\sigma = M y/I$.

Tu je $I$ **vztrajnostni moment preseka** (v $\mathrm{mm^4}$) glede na nevtralno os; pove, koliko materiala je daleč od nje. Največja napetost je v skrajnem vlaknu, $y = h/2$:

$$\sigma_\mathrm{max} = \frac{M}{W}, \quad W = \frac{I}{h/2}$$

$W$ je **odpornostni moment** (v $\mathrm{mm^3}$). Za pravokotnik širine $b$ in višine $h$ je $I = \dfrac{b h^3}{12}$ in $W = \dfrac{b h^2}{6}$. Za ravnilo: $W = \dfrac{30 \cdot 2^2}{6}\,\mathrm{mm^3} = 20\,\mathrm{mm^3}$ in $\sigma_\mathrm{max} = \dfrac{750}{20}\,\mathrm{MPa} = 37{,}5\,\mathrm{MPa}$. To je popravljen račun iz prvega koraka.

:::premisli
Ravnilo zasukaš na rob, tako da je $h = 30\,\mathrm{mm}$ in $b = 2\,\mathrm{mm}$. Površina je enaka. Kolikokrat se spremeni največja napetost pri isti sili?
---
Pade na petnajstino. $W = \dfrac{2 \cdot 30^2}{6} = 300\,\mathrm{mm^3}$ namesto $20\,\mathrm{mm^3}$, zato $\sigma_\mathrm{max} = 2{,}5\,\mathrm{MPa}$. Višina šteje s kvadratom, širina le linearno.
:::

**5. Nazaj h kosti.** Material ob nevtralni osi nosi skoraj nič, ker je tam $y \approx 0$. Material daleč od nje nosi največ. Cev zato izkoristi kostnino bolje kot poln valj. Za krog s premerom $d$ je $W = \dfrac{\pi d^3}{32}$, za cev z zunanjim premerom $D$ in notranjim $d$ pa $W = \dfrac{\pi (D^4 - d^4)}{32\,D}$.

## Rešeni primeri

### Primer 1: ročica monitorja ob postelji

Na steni intenzivne enote je vodoravna ročica dolžine $0{,}5\,\mathrm{m}$. Na prostem koncu nosi monitor s težo $80\,\mathrm{N}$. Lastno težo ročice zanemarimo. Kolikšni sta prečna sila in upogibni moment ob steni in na sredini ročice?

**Podatki:** $L = 0{,}5\,\mathrm{m}$, $F = 80\,\mathrm{N}$ na prostem koncu, konzola
**Iščemo:** $T$ in $M$ ob steni in na sredini

:::formula
Konzola s silo na koncu: $T = F$, $\quad M = F \cdot a$ ($a$ je razdalja od sile do prereza)
:::

**Rešitev:**

1. Prečna sila: med vsakim prerezom in prostim koncem je le monitor, zato je $T = 80\,\mathrm{N}$ povsod.
2. Na sredini je $a = 0{,}25\,\mathrm{m}$: $M = 80\,\mathrm{N} \cdot 0{,}25\,\mathrm{m} = 20\,\mathrm{N\,m}$.
3. Ob steni je $a = 0{,}5\,\mathrm{m}$: $M = 80\,\mathrm{N} \cdot 0{,}5\,\mathrm{m} = 40\,\mathrm{N\,m}$.
4. Odgovor: $T = 80\,\mathrm{N}$ po vsej dolžini; moment je $20\,\mathrm{N\,m}$ na sredini in $40\,\mathrm{N\,m}$ ob steni. Zgornja vlakna so v nategu; ročica bi počila ob steni.

### Primer 2: zobni mostiček

Kovinsko-keramični mostiček nadomešča manjkajoči zob in leži na dveh brušenih zobeh (podporah) z razponom $20\,\mathrm{mm}$. Pri grizenju deluje na sredino sila $300\,\mathrm{N}$. Presek mostička je približno pravokoten, širok $4\,\mathrm{mm}$ in visok $5\,\mathrm{mm}$. Kolikšna je največja upogibna napetost?

**Podatki:** $L = 20\,\mathrm{mm}$, $F = 300\,\mathrm{N}$ na sredini, $b = 4\,\mathrm{mm}$, $h = 5\,\mathrm{mm}$
**Iščemo:** $\sigma_\mathrm{max}$

:::formula
$M_\mathrm{max} = \dfrac{F L}{4}$, $\quad W = \dfrac{b h^2}{6}$, $\quad \sigma_\mathrm{max} = \dfrac{M_\mathrm{max}}{W}$
:::

**Rešitev:**

1. Reakciji podpor sta po $150\,\mathrm{N}$, zato je $T = \pm 150\,\mathrm{N}$.
2. Moment je največji pod silo: $M_\mathrm{max} = \dfrac{300 \cdot 20}{4}\,\mathrm{N\,mm} = 1500\,\mathrm{N\,mm}$.
3. Odpornostni moment: $W = \dfrac{4 \cdot 5^2}{6}\,\mathrm{mm^3} \approx 16{,}67\,\mathrm{mm^3}$.
4. Napetost: $\sigma_\mathrm{max} = \dfrac{1500\,\mathrm{N\,mm}}{16{,}67\,\mathrm{mm^3}} \approx 90\,\mathrm{MPa}$, ker je $1\,\mathrm{N/mm^2} = 1\,\mathrm{MPa}$.
5. Odgovor: največja napetost je približno $90\,\mathrm{MPa}$, natezna na spodnji strani na sredini razpona, pod silo.

### Primer 3: votla ali polna kost

Srednji del stegnenice poenostavimo v cev z zunanjim premerom $30\,\mathrm{mm}$ in notranjim $18\,\mathrm{mm}$. Pri padcu nanj deluje upogibni moment $150\,\mathrm{N\,m}$. (a) Kolikšna je največja napetost? (b) Kolikšna bi bila v polnem valju z enako površino preseka (torej z enako maso)? (c) Kolikšen premer bi moral imeti poln valj, da bi bila napetost enaka kot v cevi, in kolikokrat težji bi bil?

**Podatki:** $D = 30\,\mathrm{mm}$, $d = 18\,\mathrm{mm}$, $M = 150\,\mathrm{N\,m}$, poln valj z enako površino oziroma z enakim $W$
**Iščemo:** $\sigma_\mathrm{max}$ v cevi in v polnem valju, premer $d_2$ valja z enako napetostjo, razmerje mas

:::formula
$A = \dfrac{\pi}{4}(D^2 - d^2)$, $\quad W_\mathrm{cev} = \dfrac{\pi (D^4 - d^4)}{32\,D}$

$W_\mathrm{valj} = \dfrac{\pi d_\mathrm{v}^3}{32}$, $\quad d_2 = \sqrt[3]{\dfrac{32\,W_\mathrm{cev}}{\pi}}$
:::

**Rešitev:**

1. Enote: $M = 150\,\mathrm{N\,m} = 150\,000\,\mathrm{N\,mm}$, da bo napetost v $\mathrm{MPa}$.
2. Površina cevi: $A = \dfrac{\pi}{4}(30^2 - 18^2)\,\mathrm{mm^2} \approx 452\,\mathrm{mm^2}$.
3. Poln valj z enako površino: $d_\mathrm{v}^2 = 30^2 - 18^2 = 576$, torej $d_\mathrm{v} = 24\,\mathrm{mm}$.
4. Cev: $W_\mathrm{cev} = \dfrac{\pi (30^4 - 18^4)}{32 \cdot 30}\,\mathrm{mm^3} \approx 2307\,\mathrm{mm^3}$, zato $\sigma = \dfrac{150\,000}{2307}\,\mathrm{MPa} \approx 65\,\mathrm{MPa}$.
5. Poln valj: $W_\mathrm{valj} = \dfrac{\pi \cdot 24^3}{32}\,\mathrm{mm^3} \approx 1357\,\mathrm{mm^3}$, $\sigma = \dfrac{150\,000}{1357}\,\mathrm{MPa} \approx 110{,}5\,\mathrm{MPa}$. To je $1{,}7$-krat več kot v cevi, čeprav je masa enaka.
6. Obratno vprašanje: enaka napetost pri istem $M$ pomeni enak $W$, torej $\pi d_2^3/32 = 2307\,\mathrm{mm^3}$ in $d_2 = \sqrt[3]{32 \cdot 2307/\pi}\,\mathrm{mm} \approx 28{,}6\,\mathrm{mm}$.
7. Ploščina takega valja: $\pi \cdot 28{,}64^2/4\,\mathrm{mm^2} \approx 644\,\mathrm{mm^2}$; razmerje mas je razmerje ploščin, $644/452 \approx 1{,}42$.
8. Odgovor: v cevi je največja napetost okoli $65\,\mathrm{MPa}$, v polnem valju enake mase okoli $110{,}5\,\mathrm{MPa}$; poln valj z enako napetostjo bi potreboval premer $28{,}6\,\mathrm{mm}$ in bil za okoli $42\,\%$ težji. Votla kost je pri enaki masi trdnejša, pri enaki trdnosti pa lažja.

## Pogoste napake

- **Napetost iz $F/A$.** Pri upogibu napetost ni enakomerna. Raste od nič na nevtralni osi do $M/W$ na robu in je lahko stokrat večja od $F/A$. Formulo $F/A$ uporabi le pri osni obremenitvi.
- **Nevarni prerez je pod silo.** Pri konzoli je $M$ pod silo enak nič, največji pa ob vpetju. Najprej nariši potek $M$, šele nato išči nevarni prerez.
- **»Enaka površina, enaka trdnost.«** Odpornostni moment je odvisen od oblike: $W = bh^2/6$ raste s kvadratom višine. Ploščat in pokončen presek z enako površino se lahko razlikujeta več kot desetkrat.
- **Mešanje $\mathrm{N\,m}$ in $\mathrm{mm}$.** Če vstaviš $M$ v $\mathrm{N\,m}$ in $W$ v $\mathrm{mm^3}$, dobiš napetost, ki je $1000$-krat premajhna. Pretvori $M$ v $\mathrm{N\,mm}$.
- **$M_\mathrm{max} = FL$ za vsak nosilec.** To velja le za konzolo s silo na koncu. Pri prostoležečem nosilcu s silo na sredini je $M_\mathrm{max} = FL/4$.

## Povzetek

- Nosilec je obremenjen prečno na os; v prerezu delujeta prečna sila $T$ in upogibni moment $M$, ki ju dobimo iz ravnovesja dela nosilca.
- Konzola s silo na koncu: $T = F$, $M_\mathrm{max} = FL$ ob vpetju. Prostoležeči nosilec s silo na sredini: $T = \pm F/2$, $M_\mathrm{max} = FL/4$ pod silo.
- $\dfrac{\mathrm{d}M}{\mathrm{d}x} = T$: moment ima vrh, kjer $T$ zamenja predznak.
- Upogibna napetost: $\sigma = My/I$, linearno po višini, nič na nevtralni osi; $\sigma_\mathrm{max} = M/W$.
- Pravokotnik: $W = bh^2/6$; krog: $W = \pi d^3/32$; cev: $W = \pi(D^4 - d^4)/(32D)$.
- Material daleč od nevtralne osi nosi največ, zato so cevi in profili I učinkoviti. Računaj v $\mathrm{N}$, $\mathrm{mm}$, $\mathrm{MPa}$.

## Za izpit

Znati moraš povedati:

- definiciji prečne sile in upogibnega momenta v prerezu z dogovorom o predznaku;
- diferencialni zvezi $\mathrm{d}T/\mathrm{d}x = -q$ in $\mathrm{d}M/\mathrm{d}x = T$ s pogojem (odsek brez točkovnih obremenitev) in dokaz iz ravnovesja elementa; kaj se zgodi pod točkovno silo;
- Navierovo enačbo $\sigma = My/I$ z vsemi predpostavkami in dokaz, da nevtralna os poteka skozi težišče;
- izpeljavo $I = bh^3/12$ in $W = bh^2/6$ za pravokotnik ter $W$ za krog in cev;
- postopek dimenzioniranja: reakcije, poteka $T$ in $M$, nevarni prerez, pogoj $M_\mathrm{max}/W \le \sigma_\mathrm{dop}$.

### Naloga 1

Lesen prostoležeči nosilec razpona $4\,\mathrm{m}$ (podpori $A$ levo in $B$ desno) nosi enakomerno obremenitev $3\,\mathrm{kN/m}$ po vsej dolžini in točkovno silo $6\,\mathrm{kN}$ na razdalji $1\,\mathrm{m}$ od podpore $A$. Presek je pravokoten z višino, enako dvakratni širini. (a) Izračunaj reakciji. (b) Določi potek prečne sile in poišči nevarni prerez. (c) Kolikšen je največji upogibni moment? (d) Kolikšni morata biti najmanj širina in višina, če je dopustna napetost lesa $10\,\mathrm{MPa}$?

**Rešitev:**

1. Ravnovesje momentov okoli $A$: $4B = 3 \cdot 4 \cdot 2 + 6 \cdot 1 = 30$, zato $B = 7{,}5\,\mathrm{kN}$. Ravnovesje sil: $A = 12 + 6 - 7{,}5 = 10{,}5\,\mathrm{kN}$.
2. Na $0 < x < 1\,\mathrm{m}$: $T = 10{,}5 - 3x$, tik levo od sile $T = 7{,}5\,\mathrm{kN}$. Pod silo $T$ skoči za $6\,\mathrm{kN}$ na $1{,}5\,\mathrm{kN}$.
3. Na $x > 1\,\mathrm{m}$: $T = 1{,}5 - 3(x - 1)$, kar je nič pri $x = 1{,}5\,\mathrm{m}$. Ker je $\mathrm{d}M/\mathrm{d}x = T$, ima moment tam maksimum: to je nevarni prerez (ne pod silo).
4. $M(1{,}5) = 10{,}5 \cdot 1{,}5 - 3 \cdot 1{,}5^2/2 - 6 \cdot 0{,}5 = 9{,}375\,\mathrm{kN\,m}$. Za primerjavo pod silo: $M(1) = 10{,}5 - 1{,}5 = 9\,\mathrm{kN\,m}$.
5. Potreben odpornostni moment: $W \ge M_\mathrm{max}/\sigma_\mathrm{dop} = 9{,}375 \cdot 10^6/10\,\mathrm{mm^3} = 937\,500\,\mathrm{mm^3}$.
6. Pri $h = 2b$ je $W = b(2b)^2/6 = 2b^3/3$, zato $b^3 \ge 1{,}406 \cdot 10^6\,\mathrm{mm^3}$ in $b \ge 112{,}04\,\mathrm{mm}$, $h \ge 224{,}07\,\mathrm{mm}$.
7. Odgovor: $A = 10{,}5\,\mathrm{kN}$, $B = 7{,}5\,\mathrm{kN}$; nevarni prerez je $1{,}5\,\mathrm{m}$ od $A$, kjer je $M_\mathrm{max} = 9{,}375\,\mathrm{kN\,m}$; presek mora biti malo več kot $112 \times 224\,\mathrm{mm}$ (npr. $120 \times 240\,\mathrm{mm}$).

### Naloga 2

Natančno navedi predpostavke Navierove enačbe in jo izpelji. Dokaži, da nevtralna os poteka skozi težišče. Nato utemelji, ali ima pri enaki ploščini preseka cev (zunanji premer $D$, notranji $d > 0$) vedno večji odpornostni moment kot poln valj.

**Rešitev:**

1. Predpostavke: raven prizmatičen nosilec, homogen linearno elastičen material (Hookov zakon), upogib v ravnini simetrije, prerezi ostanejo ravni in pravokotni na upognjeno os.
2. Vlakno na razdalji $y$ od nevtralne plasti pri krivinskem polmeru $\rho$: $\varepsilon = y/\rho$, $\sigma = E y/\rho$.
3. Osne sile ni: $\int_A \sigma\,\mathrm{d}A = (E/\rho)\int_A y\,\mathrm{d}A = 0$. Statični moment preseka glede na nevtralno os je nič, torej gre os skozi težišče.
4. Ravnovesje momentov: $M = \int_A \sigma y\,\mathrm{d}A = (E/\rho)\int_A y^2\,\mathrm{d}A = EI/\rho$, torej $E/\rho = M/I$ in $\sigma = My/I$.
5. Cev: $A = \pi(D^2 - d^2)/4$ in $W_\mathrm{cev} = \pi(D^2 - d^2)(D^2 + d^2)/(32D) = A\,(D^2 + d^2)/(8D)$.
6. Poln valj z enako ploščino ima $d_\mathrm{v}^2 = D^2 - d^2$ in $W_\mathrm{valj} = \pi d_\mathrm{v}^3/32 = A\,d_\mathrm{v}/8$.
7. Razmerje: $W_\mathrm{cev}/W_\mathrm{valj} = (D^2 + d^2)/(D\,d_\mathrm{v})$. Ker je $d_\mathrm{v} < D$ in $D^2 + d^2 > D^2$, je razmerje večje od $1$.
8. Odgovor: da, pri $d > 0$ ima cev vedno večji $W$ kot poln valj enake ploščine; za stegnenico ($D = 30$, $d = 18$, $d_\mathrm{v} = 24\,\mathrm{mm}$) je razmerje $1224/720 = 1{,}7$.

## Drugače: Kot zgodba

Zobozdravnica Maja mora pacientu nadomestiti manjkajoči kočnik. Izdela mostiček iz keramike na kovinskem ogrodju, ki leži na dveh sosednjih zobeh.

Pacient ugrizne v oreh. Sila $300\,\mathrm{N}$ pritisne na sredino mostička. Oba podporna zoba potisneta nazaj, vsak s $150\,\mathrm{N}$. Mostiček se ne premakne, a se neopazno upogne: spodnja stran se raztegne, zgornja skrči. Na sredini višine je tanka plast, ki ne čuti ničesar.

Maja ve, da keramika dobro prenese tlak, nateg pa slabo. Zato največ pazi na spodnjo stran na sredini razpona, kjer sta moment in natezna napetost največja. Vezni del med zobmi lahko poveča le malo, ker mora ostati prostor za dlesen. Vprašanje je, kam dodati milimeter: v širino ali v višino?

Odloči se za višino. Z višino $5\,\mathrm{mm}$ namesto $4\,\mathrm{mm}$ se $W$ poveča za faktor $(5/4)^2 \approx 1{,}56$, napetost pa pade za približno tretjino. En milimeter več v širino bi dal le faktor $5/4$. Mostiček zdrži še leta.

## Drugače: Korak za korakom s številkami

Ročica monitorja iz Primera 1 je poln jeklen pravokotnik $30\,\mathrm{mm} \times 10\,\mathrm{mm}$. Ali je bolje, da je pokončen ali položen?

1. **Model:** konzola, sila $80\,\mathrm{N}$ na koncu, $L = 500\,\mathrm{mm}$.
2. **Potek $M$:** linearno od $0$ pod monitorjem do $M_\mathrm{max} = 80 \cdot 500\,\mathrm{N\,mm} = 40\,000\,\mathrm{N\,mm}$ ob steni.
3. **Pokončen presek** ($b = 10\,\mathrm{mm}$, $h = 30\,\mathrm{mm}$): $W = \dfrac{10 \cdot 30^2}{6}\,\mathrm{mm^3} = 1500\,\mathrm{mm^3}$.
4. **Napetost:** $\sigma_\mathrm{max} = \dfrac{40\,000}{1500}\,\mathrm{MPa} \approx 26{,}7\,\mathrm{MPa}$.
5. **Položen presek** ($b = 30\,\mathrm{mm}$, $h = 10\,\mathrm{mm}$): $W = \dfrac{30 \cdot 10^2}{6}\,\mathrm{mm^3} = 500\,\mathrm{mm^3}$, $\sigma_\mathrm{max} = 80\,\mathrm{MPa}$.
6. **Primerjava:** enaka masa, a položen presek ima trikrat večjo napetost. Ročico vgradimo pokonci.

## Drugače: Uporaba v stroki

- **Cevni mostovi v obratih.** Cevovod med podporami poenostavljeno obravnavamo kot nosilec z enakomerno obremenitvijo $q$ (teža cevi, medija in izolacije). Iz $M_\mathrm{max} = qL^2/8$, dopustne napetosti in dopustnega povesa določimo največji razmik podpor.
- **Nosilne konstrukcije.** Ploščadi, podesti in nosilci dvižnih naprav so iz profilov I ali škatlastih profilov, ki imajo pri isti masi mnogo večji $W$ kot poln presek; profil izberemo iz preglednic odpornostnih momentov.
- **Gredi strojev.** Gred mešala ali črpalke je nosilec, ki ga sile na rotorju in ležajih upogibajo; nevarni prerez iščemo iz poteka $M$, poleg upogiba upoštevamo še torzijo.
- **Upogibni preskus.** Pri tritočkovnem preskusu (npr. SIST EN ISO 178 za polimere) iz sile ob porušitvi izračunamo upogibno trdnost $\sigma = M/W = 3FL/(2bh^2)$.

## Drugače: Bolj natančno

**Upogibnica.** Iz $M = EI/\rho$ in $1/\rho \approx w''$ pri majhnih povesih sledi enačba upogibnice $EI\,w'' = M$ (za pomik $w$ navzgor). Za prostoležeči nosilec s silo $F$ na sredini dvakratna integracija da največji poves $FL^3/(48EI)$, za konzolo s silo na koncu $FL^3/(3EI)$. Na tej enačbi temelji tudi uklon.

**Steinerjev izrek.** Za os, vzporedno s težiščno na razdalji $e$, je $I = I_T + A e^2$. Tako sestavimo $I$ profila I iz pasnic in stojine.

**Pravokotnik.** $I = \displaystyle\int_{-h/2}^{h/2} y^2\,b\,\mathrm{d}y = \dfrac{b h^3}{12}$, zato $W = \dfrac{I}{h/2} = \dfrac{b h^2}{6}$. Za krog enak račun da $I = \pi d^4/64$ in $W = \pi d^3/32$.

## Preveri se

? Zobozdravnica pravi, da je upogibni moment v mostičku največji na sredini, pod točko ugriza. Kaj je upogibni moment v nekem prerezu?
- Sila, s katero zob pritiska na mostiček.
~ To je zunanja obremenitev $F$. Moment upošteva tudi ročice sil do prereza.
- Vsota vseh sil pravokotno na os na eni strani prereza.
~ To je prečna sila $T$, ne moment.
+ Vsota momentov vseh zunanjih sil na eni strani prereza glede na ta prerez.
- Napetost v najbolj oddaljenem vlaknu prereza.
~ To je $\sigma_\mathrm{max} = M/W$; moment je vzrok zanjo, ne ista količina.
> Upogibni moment dobimo iz ravnovesja dela nosilca: seštejemo sile, pomnožene z njihovimi ročicami do prereza.

? Štirje preseki imajo enako površino $400\,\mathrm{mm^2}$: pokončen pravokotnik $10 \times 40\,\mathrm{mm}$ ($h = 40$), kvadrat $20 \times 20\,\mathrm{mm}$, poln krog in položen pravokotnik $40 \times 10\,\mathrm{mm}$ ($h = 10$). Razvrsti jih od najmanjše do največje napetosti pri istem $M$.
- Vsi imajo enako napetost, ker je površina enaka.
~ To bi veljalo za $\sigma = F/A$. Pri upogibu odloča $W$, ki je odvisen od oblike.
- Krog, kvadrat, pokončen, položen.
~ Krog ni najboljši: ima veliko materiala blizu nevtralne osi.
+ Pokončen, kvadrat, krog, položen.
- Položen, kvadrat, krog, pokončen.
~ Širina šteje le linearno, višina s kvadratom. Položen presek je najšibkejši.
> $W$: pokončen $2667\,\mathrm{mm^3}$, kvadrat $1333\,\mathrm{mm^3}$, krog $1128\,\mathrm{mm^3}$, položen $667\,\mathrm{mm^3}$. Večji $W$ pomeni manjšo napetost.

? Kaj se zgodi z največjo napetostjo v pravokotni opornici, če njeno debelino (višino $h$ v smeri upogiba) podvojimo, širina in moment pa ostaneta enaka?
- Pade na polovico, ker je presek dvakrat večji.
~ To je sklepanje po $F/A$. Pri upogibu je $W \propto h^2$.
+ Pade na četrtino.
- Pade na osmino.
~ $h^3$ nastopa v vztrajnostnem momentu $I$, napetost pa je $M/W$ z $W = bh^2/6$.
- Ostane enaka, ker se moment ne spremeni.
~ Moment je enak, a $W$ se poveča, zato napetost pade.
> $W = bh^2/6$ se pri dvakratni višini poveča štirikrat, zato je $\sigma_\mathrm{max} = M/W$ štirikrat manjša.

? Oprijemalni ročaj v kopalnici je konzola dolžine $200\,\mathrm{mm}$ s pravokotnim presekom $b = 20\,\mathrm{mm}$, $h = 10\,\mathrm{mm}$. Na konec deluje sila $100\,\mathrm{N}$. Kolikšna je največja napetost?
- $0{,}5\,\mathrm{MPa}$
~ To je $F/A = 100/200$. Pri upogibu napetost ni enakomerna.
- $30\,\mathrm{MPa}$
~ Zamenjal si $b$ in $h$. Višina je v smeri sile, $h = 10\,\mathrm{mm}$.
+ $60\,\mathrm{MPa}$
- $0{,}06\,\mathrm{MPa}$
~ Moment si vstavil v $\mathrm{N\,m}$ ($20$), $W$ pa v $\mathrm{mm^3}$. Pretvori $M$ v $\mathrm{N\,mm}$.
> $M = 100 \cdot 200 = 20\,000\,\mathrm{N\,mm}$, $W = \dfrac{20 \cdot 10^2}{6} \approx 333\,\mathrm{mm^3}$, $\sigma_\mathrm{max} = \dfrac{20\,000}{333{,}3} = 60\,\mathrm{MPa}$.

? Prečka stropnega dvigala za paciente leži na dveh podporah z razponom $2\,\mathrm{m}$. Na sredini visi pacient s težo $1000\,\mathrm{N}$. Kolikšen je največji upogibni moment?
- $2000\,\mathrm{N\,m}$
~ $F \cdot L$ velja za konzolo s silo na koncu, ne za nosilec na dveh podporah.
- $1000\,\mathrm{N\,m}$
~ To je $FL/2$. Reakcija je le $F/2$, njena ročica do sredine pa $L/2$.
+ $500\,\mathrm{N\,m}$
> Reakcija $500\,\mathrm{N}$ z ročico $1\,\mathrm{m}$: $M_\mathrm{max} = \dfrac{FL}{4} = \dfrac{1000 \cdot 2}{4}\,\mathrm{N\,m} = 500\,\mathrm{N\,m}$.

:::simboli
\sigma | upogibna (normalna) napetost v prerezu | \sigma = \frac{M\,y}{I} | MPa | pri osni obremenitvi σ = F/A
\sigma_\mathrm{max} | največja napetost v skrajnem vlaknu | \sigma_\mathrm{max} = \frac{M}{W} | MPa
M | upogibni moment | M = \int_A \sigma\,y\,\mathrm{d}A | N m | konzola s silo na koncu: M = F·a; pogosto v N mm
M_\mathrm{max} | največji upogibni moment v nosilcu | | N m | sila na sredini prostoležečega nosilca: FL/4
y | razdalja od nevtralne osi | | mm | največja v skrajnem vlaknu, y = h/2
I | vztrajnostni moment preseka | I = \int_A y^2\,\mathrm{d}A | mm^4 | za pravokotnik I = bh³/12
W | odpornostni moment preseka | W = \frac{I}{h/2} | mm^3 | za pravokotnik W = bh²/6
W_\mathrm{cev} | odpornostni moment cevi | W_\mathrm{cev} = \frac{\pi (D^4 - d^4)}{32\,D} | mm^3
W_\mathrm{valj} | odpornostni moment polnega valja | W_\mathrm{valj} = \frac{\pi d_\mathrm{v}^3}{32} | mm^3
h | višina prereza | | mm
b | širina prereza | | mm
A | ploščina prereza | | mm^2 | za cev A = π(D² − d²)/4
E | elastični (Youngov) modul materiala | | MPa
\rho | krivinski polmer upognjene nevtralne osi | \rho = \frac{E I}{M} | mm
T | prečna sila v prerezu | | N | pri konzoli s silo na koncu T = F
F | zunanja sila (breme) na nosilec | | N
a | razdalja od prostega konca do prereza | | mm | ročica sile F
L | dolžina (razpon) nosilca | | mm
D | zunanji premer cevi | | mm
d | notranji premer cevi | | mm | pri polnem krogu njegov premer
d_\mathrm{v} | premer polnega valja | d_\mathrm{v}^2 = D^2 - d^2 | mm | valj z enako ploščino prereza kot cev
d_2 | premer polnega valja z enakim W kot cev | d_2 = \sqrt[3]{\frac{32\,W_\mathrm{cev}}{\pi}} | mm
x | lega prereza vzdolž nosilca | | m
q | zvezna prečna obremenitev (sila na dolžino) | q = -\frac{\mathrm{d}T}{\mathrm{d}x} | N/m | enakomerna: M_max = qL²/8
\sigma_\mathrm{dop} | dopustna napetost | | MPa | pogoj σ_max ≤ σ_dop
:::
