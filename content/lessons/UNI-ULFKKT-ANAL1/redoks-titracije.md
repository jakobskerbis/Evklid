---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Konec vročega julija ribiči na plitvem jezeru opazijo, da ribe lovijo zrak tik pod gladino. Topla voda raztopi manj kisika, alge pa ga ponoči porabljajo. Koliko kisika je res ostalo v vodi, izmerimo z **jodometrijo**. Kako močno je reka obremenjena z organskimi snovmi, ki kisik porabljajo, pove **manganometrija**. Obe sta **redoks titraciji**: titrant in analit si izmenjata elektrone.

»Titracija je titracija,« pravi Luka pred vajo. »Pri $\mathrm{NaOH}$ in $\mathrm{HCl}$ je razmerje 1 : 1, pri EDTA tudi. Torej en mol $\mathrm{KMnO_4}$ porabi en mol železa.« Če bi imel prav, bi vsi njegovi rezultati za železo prišli petkrat premajhni. Kje se zmoti, bomo razčistili spotoma.

## Razlaga

Kislinsko-bazne titracije že poznaš. Redoks titracijo zgradimo tako, da gremo po vrsti skozi razlike:

| | kislinsko-bazna | redoks |
|---|---|---|
| prenaša se | proton $\mathrm{H^+}$ | elektron $\mathrm{e^-}$ |
| moč reagenta | $\mathrm{p}K_a$ | standardni potencial $E^\circ$ |
| na krivulji merimo | pH | potencial $E$ |
| razmerje | iz števila $\mathrm{H^+}$ | iz števila $\mathrm{e^-}$ |

**Prva razlika: elektroni namesto protonov.** Kislina odda proton, baza ga sprejme. Pri redoks reakciji **reducent** odda elektrone (se oksidira, oksidacijsko število se mu zviša), **oksidant** jih sprejme (se reducira, oksidacijsko število se mu zniža). Vsako reakcijo razstavimo na dve **polreakciji**:

$$\mathrm{MnO_4^- + 8\,H^+ + 5\,e^- \rightarrow Mn^{2+} + 4\,H_2O}$$

$$\mathrm{Fe^{2+} \rightarrow Fe^{3+} + e^-}$$

**Druga razlika: razmerje ni samo po sebi 1 : 1.** Pri $\mathrm{HCl}$ in $\mathrm{NaOH}$ gre en proton k eni bazi. EDTA vedno objame en kovinski ion. Pri redoksu pa mora biti elektronov, ki jih reducent odda, toliko, kolikor jih oksidant sprejme. Permanganat sprejme pet elektronov, železov ion jih odda enega, zato:

$$\mathrm{MnO_4^- + 5\,Fe^{2+} + 8\,H^+ \rightarrow Mn^{2+} + 5\,Fe^{3+} + 4\,H_2O}$$

Tu se Luka zmoti: $n(\mathrm{Fe^{2+}}) = 5\,n(\mathrm{MnO_4^-})$.

**Pravilo za ekvivalenčno točko.** Naj reducent v svoji polreakciji odda $z_\mathrm{red}$ elektronov na delec, oksidant pa sprejme $z_\mathrm{ox}$ elektronov na delec. Ker se elektroni ne kopičijo, je v ekvivalenčni točki število oddanih elektronov enako številu sprejetih:
$$z_\mathrm{red}\,n(\text{reducent}) = z_\mathrm{ox}\,n(\text{oksidant}).$$
Za železo in permanganat: $1 \cdot n(\mathrm{Fe^{2+}}) = 5 \cdot n(\mathrm{MnO_4^-})$.

:::premisli
Oksalatni ion se oksidira do ogljikovega dioksida: $\mathrm{C_2O_4^{2-} \rightarrow 2\,CO_2 + 2\,e^-}$. Napovej, v kakšnem razmerju reagirata permanganat in oksalat.
---
$2 : 5$. Dva permanganata sprejmeta $10$ elektronov, pet oksalatov jih odda prav toliko: $\mathrm{2\,MnO_4^- + 5\,C_2O_4^{2-} + 16\,H^+ \rightarrow 2\,Mn^{2+} + 10\,CO_2 + 8\,H_2O}$.
:::

**Tretja razlika: potencial namesto pH.** Moč kisline pove $\mathrm{p}K_a$, moč oksidanta **standardni elektrodni potencial** $E^\circ$: višji je, močnejši je oksidant. Primerjava enačb (pri $25\,^\circ\mathrm{C}$) je skoraj dobesedna:

$$\mathrm{pH} = \mathrm{p}K_a + \log\frac{[\mathrm{A^-}]}{[\mathrm{HA}]}$$

$$E = E^\circ + \frac{0{,}0592\ \mathrm{V}}{n}\log\frac{[\mathrm{ox}]}{[\mathrm{red}]}$$

Druga je **Nernstova enačba**, $n$ je število izmenjanih elektronov (isto kot $z$ zgoraj, ne množina). Natančno: naj bo polreakcija $\mathrm{ox} + n\,\mathrm{e^-} \rightleftharpoons \mathrm{red}$ na elektrodi v ravnotežju. Potem je $E = E^\circ + \dfrac{RT}{nF}\ln\dfrac{a_\mathrm{ox}}{a_\mathrm{red}}$; pri $25\,^\circ\mathrm{C}$ je $\dfrac{RT\ln 10}{F} = 0{,}0592\ \mathrm{V}$, v razredčenih raztopinah pa aktivnosti nadomestimo s koncentracijami. Če v polreakciji nastopajo še druge zvrsti, vstopijo s koeficienti kot potencami, npr. $E = E^\circ + \dfrac{0{,}0592\ \mathrm{V}}{5}\log\dfrac{[\mathrm{MnO_4^-}][\mathrm{H^+}]^8}{[\mathrm{Mn^{2+}}]}$. Potencial permanganata je zato močno odvisen od kislosti.

Pri polovični titraciji kisline velja $\mathrm{pH} = \mathrm{p}K_a$. Pri polovični oksidaciji železa je $[\mathrm{Fe^{3+}}] = [\mathrm{Fe^{2+}}]$, logaritem je $0$ in $E = E^\circ(\mathrm{Fe^{3+}/Fe^{2+}}) = 0{,}77\ \mathrm{V}$. Čim bolj se $E^\circ$ titranta in analita razlikujeta, tem višji je preskok potenciala v ekvivalenčni točki, tako kot je pri kislinah preskok pH večji pri močnejši kislini.

**Potencial v ekvivalenčni točki.** *Izrek:* pri titraciji $\mathrm{Fe^{2+}}$ s $\mathrm{MnO_4^-}$ pri $[\mathrm{H^+}] = 1\ \mathrm{mol/L}$ je $E_\mathrm{EP} = \dfrac{1 \cdot E^\circ_\mathrm{Fe} + 5 \cdot E^\circ_\mathrm{Mn}}{6}$. *Dokaz:* med titracijo sta oba para v ravnotežju, zato ima raztopina en sam potencial. Zapišemo $E = E^\circ_\mathrm{Fe} + 0{,}0592\log\dfrac{[\mathrm{Fe^{3+}}]}{[\mathrm{Fe^{2+}}]}$ in $5E = 5E^\circ_\mathrm{Mn} + 0{,}0592\log\dfrac{[\mathrm{MnO_4^-}][\mathrm{H^+}]^8}{[\mathrm{Mn^{2+}}]}$ ter enačbi seštejemo. V EP je po stehiometriji $[\mathrm{Fe^{3+}}] = 5[\mathrm{Mn^{2+}}]$ in $[\mathrm{Fe^{2+}}] = 5[\mathrm{MnO_4^-}]$, zato je argument skupnega logaritma $[\mathrm{H^+}]^8 = 1$ in $6E = E^\circ_\mathrm{Fe} + 5E^\circ_\mathrm{Mn}$. Številsko: $E_\mathrm{EP} = (0{,}77 + 5 \cdot 1{,}51)/6\ \mathrm{V} \approx 1{,}39\ \mathrm{V}$. Enako v splošnem: če prvi par izmenja $z_1$, drugi $z_2$ elektronov, je $E_\mathrm{EP} = \dfrac{z_1E^\circ_1 + z_2E^\circ_2}{z_1 + z_2}$, kadar ima v vsaki polreakciji oksidirana oblika enak koeficient kot reducirana in so vse druge zvrsti (npr. $\mathrm{H^+}$) pri $1\ \mathrm{mol/L}$.

**Ravnotežna konstanta.** Ko izenačimo potenciala obeh parov v ravnotežju in pomnožimo z $5$, dobimo $\dfrac{5(E^\circ_\mathrm{Mn} - E^\circ_\mathrm{Fe})}{0{,}0592\ \mathrm{V}} = \log\dfrac{[\mathrm{Mn^{2+}}][\mathrm{Fe^{3+}}]^5}{[\mathrm{MnO_4^-}][\mathrm{H^+}]^8[\mathrm{Fe^{2+}}]^5} = \log K$. V splošnem je $\log K = \dfrac{z\,\Delta E^\circ}{0{,}0592\ \mathrm{V}}$, kjer je $z$ skupno število izmenjanih elektronov. Za permanganat in železo je $\log K = 5 \cdot 0{,}74/0{,}0592 = 62{,}5$: reakcija poteče praktično do konca.

**Četrta razlika: indikator.** Kislinsko-bazni indikator je sam šibka kislina. Pri redoksu imamo tri možnosti. **Samoindikator**: titrant je obarvan, produkt ne. **Specifični indikator**: škrob z jodom tvori temno modro spojino. **Redoks indikator** (npr. feroin) spremeni barvo pri določenem potencialu.

**Manganometrija.** Titrant je $\mathrm{KMnO_4}$ ($E^\circ = 1{,}51\ \mathrm{V}$), zelo močan oksidant. Ion $\mathrm{MnO_4^-}$ je vijoličast, $\mathrm{Mn^{2+}}$ skoraj brezbarven. Do ekvivalenčne točke se vsaka kapljica takoj razbarva. Prva kapljica v prebitku obarva raztopino trajno rožnato. Za to potrebujemo:

- **močno kisel medij z $\mathrm{H_2SO_4}$**, sicer nastaja rjav $\mathrm{MnO_2}$ in elektronov je samo 3;
- **ne $\mathrm{HCl}$**, ker bi permanganat oksidiral $\mathrm{Cl^-}$ v $\mathrm{Cl_2}$, in ne $\mathrm{HNO_3}$, ki je sama oksidant;
- **standardizacijo**, ker $\mathrm{KMnO_4}$ ni primarni standard: počasi razpada. Umerimo ga z natrijevim oksalatom pri $60$–$70\,^\circ\mathrm{C}$. Reakcija je na začetku počasna, nastali $\mathrm{Mn^{2+}}$ pa jo pospeši (**avtokataliza**).

**Jodometrija.** Jod je šibek oksidant ($E^\circ(\mathrm{I_2/I^-}) = 0{,}54\ \mathrm{V}$), zato uberemo posredno pot. Vzorcu z **oksidantom** dodamo prebitek $\mathrm{KI}$. Oksidant iz jodida sprosti ekvivalentno množino $\mathrm{I_2}$, tega pa titriramo z natrijevim tiosulfatom:

$$\mathrm{I_2 + 2\,S_2O_3^{2-} \rightarrow 2\,I^- + S_4O_6^{2-}}$$

Prebitka $\mathrm{KI}$ ni treba odmeriti natančno, saj tiosulfat meri le sproščeni jod. Pri **jodimetriji** pa je titrant sam jod in z njim neposredno titriramo **reducent** (npr. vitamin C). Tiosulfat umerimo z $\mathrm{KIO_3}$, ki je primarni standard: $\mathrm{IO_3^- + 5\,I^- + 6\,H^+ \rightarrow 3\,I_2 + 3\,H_2O}$.

:::premisli
Med titracijo joda s tiosulfatom se raztopina razbarva od rjave prek rumene do brezbarvne. Zakaj škrob dodamo šele, ko je raztopina bledo rumena, in ne že na začetku?
---
Pri veliki koncentraciji joda se škrob nanj močno in počasi reverzibilno veže. Del joda bi ostal ujet, modra barva bi izginjala počasi in končna točka bi prišla prepozno. Tik pred koncem je joda malo in modra barva izgine ostro z eno kapljico.
:::

**Kisik po Winklerju.** Vzorcu dodamo $\mathrm{Mn^{2+}}$ in bazo, da se obori bel $\mathrm{Mn(OH)_2}$. Kisik oksidira $\mathrm{Mn(OH)_2}$ v rjav $\mathrm{Mn(OH)_3}$, ki po nakisanju z jodidom sprosti jod:

$$\mathrm{2\,Mn(OH)_2 + \tfrac{1}{2}\,O_2 + H_2O \rightarrow 2\,Mn(OH)_3}$$

$$\mathrm{2\,Mn(OH)_3 + 2\,I^- + 6\,H^+ \rightarrow 2\,Mn^{2+} + I_2 + 6\,H_2O}$$

Pol mola $\mathrm{O_2}$ da en mol $\mathrm{I_2}$, ta pa porabi dva mola tiosulfata. Torej je $n(\mathrm{S_2O_3^{2-}}) = 4\,n(\mathrm{O_2})$.

## Rešeni primeri

### Primer 1: železo v limonitu

Limonit je rjava železova ruda, ki nastane s preperevanjem železovih mineralov na zraku in v deževnici. Vzorec z maso $0{,}2500\ \mathrm{g}$ raztopimo, vse železo reduciramo v $\mathrm{Fe^{2+}}$ in titriramo z $\mathrm{KMnO_4}$ s koncentracijo $0{,}02000\ \mathrm{mol/L}$. Do trajne rožnate barve porabimo $22{,}40\ \mathrm{mL}$. Kolikšen je masni delež železa?

**Podatki:** $m(\text{vzorec}) = 0{,}2500\ \mathrm{g}$, $c(\mathrm{KMnO_4}) = 0{,}02000\ \mathrm{mol/L}$, $V = 22{,}40\ \mathrm{mL}$, $M(\mathrm{Fe}) = 55{,}845\ \mathrm{g/mol}$
**Iščemo:** masni delež $w(\mathrm{Fe})$

:::formula
$n(\mathrm{Fe^{2+}}) = 5\,c(\mathrm{KMnO_4})\,V$, $\quad w(\mathrm{Fe}) = \dfrac{n(\mathrm{Fe})\,M(\mathrm{Fe})}{m(\text{vzorec})}$
:::

**Rešitev:**

1. Permanganat: $0{,}02000 \cdot 22{,}40 = 0{,}4480$, torej $0{,}4480\ \mathrm{mmol}$.
2. Vsak $\mathrm{MnO_4^-}$ sprejme pet elektronov, vsak $\mathrm{Fe^{2+}}$ odda enega: $5 \cdot 0{,}4480 = 2{,}240$, torej $2{,}240\ \mathrm{mmol}$ železa.
3. Masa železa: $2{,}240 \cdot 55{,}845 = 125{,}09$, torej $125{,}1\ \mathrm{mg}$.
4. Delež: $\dfrac{125{,}09}{250{,}0} \cdot 100 = 50{,}04$.
5. Odgovor: limonit vsebuje $50{,}04\ \%$ železa. Z Lukovim razmerjem 1 : 1 bi dobili le $10{,}01\ \%$.

### Primer 2: umerjanje tiosulfata

$0{,}1070\ \mathrm{g}$ $\mathrm{KIO_3}$ raztopimo v bučki do $250{,}0\ \mathrm{mL}$. Alikvotu $25{,}00\ \mathrm{mL}$ dodamo prebitek $\mathrm{KI}$ in kislino. Sproščeni jod porabi $29{,}85\ \mathrm{mL}$ raztopine $\mathrm{Na_2S_2O_3}$. Kolikšna je koncentracija tiosulfata?

**Podatki:** $m(\mathrm{KIO_3}) = 0{,}1070\ \mathrm{g}$, $M(\mathrm{KIO_3}) = 214{,}00\ \mathrm{g/mol}$, $V(\text{bučka}) = 250{,}0\ \mathrm{mL}$, $V(\text{alikvot}) = 25{,}00\ \mathrm{mL}$, $V(\mathrm{S_2O_3^{2-}}) = 29{,}85\ \mathrm{mL}$
**Iščemo:** $c(\mathrm{Na_2S_2O_3})$

:::formula
$1\ \mathrm{IO_3^-} \rightarrow 3\ \mathrm{I_2} \rightarrow 6\ \mathrm{S_2O_3^{2-}}$, $\quad c = \dfrac{n(\mathrm{S_2O_3^{2-}})}{V(\mathrm{S_2O_3^{2-}})}$
:::

**Rešitev:**

1. Jodat v bučki: $\dfrac{0{,}1070}{214{,}00} = 0{,}0005000$, torej $0{,}5000\ \mathrm{mmol}$.
2. V alikvotu je desetina: $0{,}05000\ \mathrm{mmol}$ $\mathrm{IO_3^-}$.
3. En jodat sprosti tri molekule joda: $3 \cdot 0{,}05000 = 0{,}1500$, torej $0{,}1500\ \mathrm{mmol}$ $\mathrm{I_2}$.
4. Vsak $\mathrm{I_2}$ porabi dva tiosulfata: $2 \cdot 0{,}1500 = 0{,}3000$, torej $0{,}3000\ \mathrm{mmol}$.
5. Koncentracija: $\dfrac{0{,}3000}{29{,}85} = 0{,}01005$.
6. Odgovor: koncentracija tiosulfata je $0{,}01005\ \mathrm{mol/L}$.

### Primer 3: kisik v jezeru po vročem dnevu

Z umerjenim tiosulfatom iz primera 2 določimo kisik v površinski plasti jezera popoldne, ko je voda segreta na $25\,^\circ\mathrm{C}$. Vzorec $200{,}0\ \mathrm{mL}$ obdelamo po Winklerju, sproščeni jod porabi $19{,}90\ \mathrm{mL}$ tiosulfata. Kolikšna je masna koncentracija kisika in koliko je to odstotkov nasičenosti, če voda pri $25\,^\circ\mathrm{C}$ raztopi največ $8{,}26\ \mathrm{mg/L}$ kisika? Naslednje jutro je nasičenost pri enaki temperaturi le še $40\ \%$. Koliko mL istega tiosulfata bo porabil enak vzorec?

**Podatki:** $V(\text{vzorec}) = 200{,}0\ \mathrm{mL}$, $c(\mathrm{S_2O_3^{2-}}) = 0{,}01005\ \mathrm{mol/L}$, $V(\mathrm{S_2O_3^{2-}}) = 19{,}90\ \mathrm{mL}$, $M(\mathrm{O_2}) = 32{,}00\ \mathrm{g/mol}$, $\gamma_{\text{nas}} = 8{,}26\ \mathrm{mg/L}$, jutranja nasičenost $40\ \%$
**Iščemo:** $\gamma(\mathrm{O_2})$, nasičenost v $\%$ in jutranjo porabo tiosulfata

:::formula
$n(\mathrm{O_2}) = \dfrac{n(\mathrm{S_2O_3^{2-}})}{4}$, $\quad \gamma(\mathrm{O_2}) = \dfrac{n(\mathrm{O_2})\,M(\mathrm{O_2})}{V(\text{vzorec})}$, $\quad \text{nasičenost} = \dfrac{\gamma(\mathrm{O_2})}{\gamma_{\text{nas}}} \cdot 100\ \%$, $\quad V = \dfrac{n(\mathrm{S_2O_3^{2-}})}{c(\mathrm{S_2O_3^{2-}})}$
:::

**Rešitev:**

1. Tiosulfat: $0{,}01005 \cdot 19{,}90 \approx 0{,}2000$, torej $0{,}2000\ \mathrm{mmol}$.
2. En $\mathrm{O_2}$ prek dveh $\mathrm{I_2}$ porabi štiri tiosulfate: $\dfrac{0{,}2000}{4} = 0{,}05000$, torej $0{,}05000\ \mathrm{mmol}$ kisika.
3. Masa kisika: $0{,}05000 \cdot 32{,}00 = 1{,}600$, torej $1{,}600\ \mathrm{mg}$ v $0{,}2000\ \mathrm{L}$.
4. $\gamma(\mathrm{O_2}) = 1{,}600\ \mathrm{mg} / 0{,}2000\ \mathrm{L} = 8{,}00\ \mathrm{mg/L}$, nasičenost $8{,}00 / 8{,}26 \cdot 100\ \% \approx 97\ \%$.
5. Jutro, obratna pot: $\gamma = 0{,}40 \cdot 8{,}26 = 3{,}304\ \mathrm{mg/L}$, v $0{,}2000\ \mathrm{L}$ je $0{,}6608\ \mathrm{mg}$ kisika, to je $0{,}6608 / 32{,}00 = 0{,}02065\ \mathrm{mmol}$.
6. Tiosulfata je štirikrat več: $4 \cdot 0{,}02065 = 0{,}08260\ \mathrm{mmol}$, volumen $0{,}08260 / 0{,}01005 \approx 8{,}22\ \mathrm{mL}$.
7. Odgovor: popoldne je v vodi $8{,}00\ \mathrm{mg/L}$ kisika ($97\ \%$ nasičenosti), ker ga alge podnevi proizvajajo; zjutraj, ko ga alge in razkroj čez noč porabijo, bi isti vzorec porabil le $8{,}22\ \mathrm{mL}$ tiosulfata. Ribe se dušijo ponoči in zjutraj.

## Pogoste napake

- **»Vedno 1 : 1«.** Luka je prenesel razmerje iz kislinsko-baznih titracij in EDTA. Pri redoksu razmerje določa število elektronov: $\mathrm{MnO_4^-}$ sprejme 5, $\mathrm{Fe^{2+}}$ odda 1. Najprej uravnoteži elektrone, šele nato računaj množine.
- **Nakisanje s $\mathrm{HCl}$.** »Kislina je kislina.« Permanganat oksidira tudi klorid, zato porabimo preveč titranta in dobimo previsok rezultat. Pri manganometriji nakisamo z $\mathrm{H_2SO_4}$.
- **Škrob na začetku.** Zdi se, da je zgodnji indikator varnejši. Pri veliki koncentraciji joda pa se jod ujame v škrob in sprošča počasi, končna točka zamuja. Škrob dodaj pri bledo rumeni barvi.
- **Winkler 1 : 2.** Ker $\mathrm{I_2}$ porabi dva tiosulfata, učenci pišejo $n(\mathrm{O_2}) = n(\mathrm{S_2O_3^{2-}})/2$. Pozabijo, da en $\mathrm{O_2}$ sprosti dva $\mathrm{I_2}$. Pravilno: $n(\mathrm{O_2}) = n(\mathrm{S_2O_3^{2-}})/4$.
- **Zamenjava jodometrije in jodimetrije.** Pri jodometriji je analit oksidant in titrant tiosulfat; pri jodimetriji je analit reducent in titrant jod. Najprej se vprašaj: ali analit jod sprošča ali porablja?

## Povzetek

- Redoks titracija temelji na prenosu elektronov; razmerje sledi iz izenačenja elektronov v polreakcijah, ne samo po sebi 1 : 1.
- Nernstova enačba $E = E^\circ + \dfrac{0{,}0592\ \mathrm{V}}{n}\log\dfrac{[\mathrm{ox}]}{[\mathrm{red}]}$ je redoks dvojček Henderson-Hasselbalchove; večja razlika $E^\circ$ da višji preskok.
- Manganometrija: $\mathrm{KMnO_4}$ v $\mathrm{H_2SO_4}$, samoindikator (trajno rožnato), $n(\mathrm{Fe^{2+}}) = 5\,n(\mathrm{MnO_4^-})$, umerjanje z oksalatom (2 : 5).
- Jodometrija: oksidant + prebitek $\mathrm{I^-}$ → $\mathrm{I_2}$, titracija s tiosulfatom ($\mathrm{I_2} : \mathrm{S_2O_3^{2-}} = 1 : 2$), škrob tik pred koncem; tiosulfat umerimo s $\mathrm{KIO_3}$ (1 : 6).
- Winkler: $n(\mathrm{S_2O_3^{2-}}) = 4\,n(\mathrm{O_2})$.

## Za izpit

Znati moraš povedati:

- definicije oksidanta, reducenta in polreakcije ter pravilo $z_\mathrm{red}\,n(\text{reducent}) = z_\mathrm{ox}\,n(\text{oksidant})$ v ekvivalenčni točki;
- Nernstovo enačbo s pogoji (ravnotežje, temperatura, aktivnosti, vpliv $\mathrm{H^+}$);
- izpeljavo potenciala v ekvivalenčni točki $E_\mathrm{EP} = \dfrac{z_1E^\circ_1 + z_2E^\circ_2}{z_1 + z_2}$ in pogoj, pod katerim velja;
- izpeljavo $\log K = z\,\Delta E^\circ / 0{,}0592\ \mathrm{V}$ in kdaj reakcija poteče kvantitativno;
- stehiometrijo manganometrije, jodometrije in Winklerjeve metode.

### Naloga 1

Raztopino $\mathrm{KMnO_4}$ umerimo s $0{,}1340\ \mathrm{g}$ $\mathrm{Na_2C_2O_4}$ ($M = 134{,}00\ \mathrm{g/mol}$) v $\mathrm{H_2SO_4}$ pri $70\,^\circ\mathrm{C}$; porabimo $20{,}15\ \mathrm{mL}$. Nato $0{,}2000\ \mathrm{g}$ apnenca raztopimo v kislini, kalcij oborimo kot $\mathrm{CaC_2O_4}$, oborino speremo in raztopimo v $\mathrm{H_2SO_4}$. Sproščeni oksalat porabi $31{,}40\ \mathrm{mL}$ permanganata. Izračunaj masni delež $\mathrm{CaCO_3}$ v apnencu ($M(\mathrm{CaCO_3}) = 100{,}09\ \mathrm{g/mol}$).

**Rešitev:**

1. Oksalat za umerjanje: $0{,}1340 / 134{,}00 = 0{,}001000\ \mathrm{mol} = 1{,}000\ \mathrm{mmol}$.
2. Permanganat sprejme $5$ elektronov, oksalat odda $2$, zato $5\,n(\mathrm{MnO_4^-}) = 2\,n(\mathrm{C_2O_4^{2-}})$: $n(\mathrm{MnO_4^-}) = \tfrac25 \cdot 1{,}000 = 0{,}4000\ \mathrm{mmol}$.
3. $c(\mathrm{KMnO_4}) = 0{,}4000 / 20{,}15 = 0{,}019851\ \mathrm{mol/L}$.
4. Pri analizi: $n(\mathrm{MnO_4^-}) = 0{,}019851 \cdot 31{,}40 = 0{,}62332\ \mathrm{mmol}$.
5. Oksalat: $n(\mathrm{C_2O_4^{2-}}) = \tfrac52 \cdot 0{,}62332 = 1{,}5583\ \mathrm{mmol}$. V $\mathrm{CaC_2O_4}$ je razmerje $1 : 1$, zato je toliko tudi Ca in $\mathrm{CaCO_3}$.
6. $m(\mathrm{CaCO_3}) = 1{,}5583 \cdot 100{,}09 = 155{,}97\ \mathrm{mg}$.
7. $w = 155{,}97 / 200{,}0 \cdot 100 = 77{,}99$.
8. Odgovor: apnenec vsebuje $77{,}99\ \%$ $\mathrm{CaCO_3}$. Kalcij sam ni redoks aktiven; določili smo ga posredno prek oksalata.

### Naloga 2

Utemelji, kdaj redoks reakcija $\mathrm{ox_1 + red_2 \rightarrow red_1 + ox_2}$, pri kateri vsak par izmenja $z$ elektronov, poteče v ekvivalenčni točki vsaj $99{,}9\ \%$. Izpelji pogoj za $\Delta E^\circ$ in ga uporabi za titracijo $\mathrm{Fe^{2+}}$ s $\mathrm{Ce^{4+}}$ (formalni potencial, to je potencial pri $[\mathrm{Ce^{4+}}] = [\mathrm{Ce^{3+}}]$ v $1\ \mathrm{mol/L}$ $\mathrm{H_2SO_4}$: $E^\circ{}' = 1{,}44\ \mathrm{V}$; $E^\circ(\mathrm{Fe^{3+}/Fe^{2+}}) = 0{,}77\ \mathrm{V}$). Izračunaj še potencial v ekvivalenčni točki.

**Rešitev:**

1. V ravnotežju sta potenciala obeh parov enaka: $E^\circ_1 + \dfrac{0{,}0592}{z}\log\dfrac{[\mathrm{ox_1}]}{[\mathrm{red_1}]} = E^\circ_2 + \dfrac{0{,}0592}{z}\log\dfrac{[\mathrm{ox_2}]}{[\mathrm{red_2}]}$.
2. Preuredimo: $\log K = \log\dfrac{[\mathrm{red_1}][\mathrm{ox_2}]}{[\mathrm{ox_1}][\mathrm{red_2}]} = \dfrac{z(E^\circ_1 - E^\circ_2)}{0{,}0592\ \mathrm{V}}$.
3. V ekvivalenčni točki sta začetni množini enaki. Če zreagira $99{,}9\ \%$, je $[\mathrm{red_1}] = [\mathrm{ox_2}] = 0{,}999\,c$ in $[\mathrm{ox_1}] = [\mathrm{red_2}] = 0{,}001\,c$.
4. Zato mora biti $K \geq (0{,}999/0{,}001)^2 \approx 10^6$, torej $\dfrac{z\,\Delta E^\circ}{0{,}0592\ \mathrm{V}} \geq 6$ in $\Delta E^\circ \geq \dfrac{6 \cdot 0{,}0592}{z}\ \mathrm{V} \approx \dfrac{0{,}36}{z}\ \mathrm{V}$.
5. Za $\mathrm{Ce^{4+}/Fe^{2+}}$ je $z = 1$ in $\Delta E^\circ = 1{,}44 - 0{,}77 = 0{,}67\ \mathrm{V}$, kar je več od $0{,}36\ \mathrm{V}$; $\log K = 0{,}67/0{,}0592 \approx 11{,}3$.
6. Potencial v ekvivalenčni točki: $E_\mathrm{EP} = \dfrac{0{,}77 + 1{,}44}{2}\ \mathrm{V} \approx 1{,}11\ \mathrm{V}$, na sredini skoka, ker oba para izmenjata po en elektron.
7. Odgovor: reakcija je kvantitativna, če je $\Delta E^\circ \geq 0{,}36\ \mathrm{V}/z$; cerimetrija železa ta pogoj izpolni ($0{,}67\ \mathrm{V}$, $K \approx 10^{11{,}3}$), potencial v ekvivalenčni točki je okoli $1{,}11\ \mathrm{V}$, krivulja pa je simetrična.

## Drugače: Na sliki

Postavi krivulji drugo ob drugo. Pri titraciji šibke kisline z bazo pH najprej počasi raste, pri polovici je enak $\mathrm{p}K_a$, nato skoči. Pri titraciji $\mathrm{Fe^{2+}}$ s permanganatom (v $1\ \mathrm{mol/L}$ kislini) je enako, le da se na navpični osi dviga potencial:

| delež titracije | potencial $E$ | kaj ga določa |
|---|---|---|
| 50 % | $0{,}77\ \mathrm{V}$ | par $\mathrm{Fe^{3+}/Fe^{2+}}$, enako zastopan |
| 100 % | $\approx 1{,}39\ \mathrm{V}$ | ekvivalenčna točka |
| 200 % | $\approx 1{,}51\ \mathrm{V}$ | par $\mathrm{MnO_4^-/Mn^{2+}}$, enako zastopan |

Potencial v ekvivalenčni točki je tehtano povprečje: $\dfrac{1 \cdot 0{,}77 + 5 \cdot 1{,}51}{6}\ \mathrm{V} \approx 1{,}39\ \mathrm{V}$. Ker permanganat izmenja več elektronov, točka ni na sredini skoka, ampak bližje $1{,}51\ \mathrm{V}$. Krivulja je zato nesimetrična, kar pri titraciji 1 : 1 ne vidiš.

Potencial na lestvici:

```
 0,08 V      0,54 V      0,77 V              1,51 V
 S4O6/S2O3   I2/I-       Fe3+/Fe2+           MnO4-/Mn2+
 ----|-----------|-----------|-------------------|---->  E°
   močnejši reducent               močnejši oksidant
```

Vsak oksidant oksidira vse reducente, ki so na lestvici levo od njega. Zato jod oksidira tiosulfat, permanganat pa železo (in žal tudi klorid pri $1{,}36\ \mathrm{V}$).

## Drugače: Uporaba v stroki

- **Kisik in BPK.** Winklerjeva metoda je referenčna metoda za raztopljeni kisik; z njo laboratoriji preverjajo optične in elektrokemijske kisikove sonde. Biokemijsko potrebo po kisiku ($\mathrm{BPK_5}$) dobimo kot razliko kisika pred petdnevno inkubacijo vzorca v temi pri $20\,^\circ\mathrm{C}$ in po njej.
- **Organska obremenitev vode.** Permanganatni indeks pitne vode je manganometrija: vzorec kuhamo z znanim prebitkom $\mathrm{KMnO_4}$ v $\mathrm{H_2SO_4}$, nato dodamo oksalat in njegov prebitek povratno titriramo s permanganatom. Za odpadne vode se kemijska potreba po kisiku (KPK) določa z dikromatom, prebitek pa titrira z $\mathrm{Fe^{2+}}$ ob feroinu.
- **Živila.** Peroksidno število olj (stopnja žarkosti) je jodometrija: peroksidi iz $\mathrm{KI}$ sprostijo jod, tega titriramo s tiosulfatom.
- **Farmacija.** Askorbinsko kislino v učinkovinah in tabletah določajo z jodimetrijo ob škrobu, vodo v učinkovinah pa s Karl Fischerjevo titracijo, pri kateri jod oksidira $\mathrm{SO_2}$ le ob prisotnosti vode.

## Preveri se

? Vzorcu z neznanim oksidantom dodamo $\mathrm{KI}$ in kislino. Kako poteka ta jodometrična določitev?
- Analit je reducent, ki ga titriramo neposredno z raztopino joda.
~ To je jodimetrija. Pri jodometriji analit jod sprosti, ne porabi.
+ Analit je oksidant, ki iz prebitka $\mathrm{I^-}$ sprosti jod; tega titriramo s tiosulfatom.
- Prebitek $\mathrm{KI}$ moramo odmeriti natančno na $0{,}01\ \mathrm{mL}$.
~ Odmerjanje $\mathrm{KI}$ ne vpliva na rezultat, saj je v prebitku. Natančno merimo tiosulfat.
- Škrob dodamo na začetku, da končne točke ne zgrešimo.
~ Na začetku je joda veliko in se ujame v škrob; končna točka zamuja.
> Oksidant sprosti ekvivalentno množino $\mathrm{I_2}$, tiosulfat pa jo izmeri.

? $25{,}00\ \mathrm{mL}$ raztopine $\mathrm{Fe^{2+}}$ porabi $15{,}00\ \mathrm{mL}$ $\mathrm{KMnO_4}$ s koncentracijo $0{,}01000\ \mathrm{mol/L}$. Kolikšna je $c(\mathrm{Fe^{2+}})$?
- $0{,}006000\ \mathrm{mol/L}$
~ To je razmerje 1 : 1. Permanganat sprejme pet elektronov, zato množino pomnožiš s 5.
- $0{,}001200\ \mathrm{mol/L}$
~ Delil si s 5. Petkrat več je železa, ne permanganata.
+ $0{,}03000\ \mathrm{mol/L}$
> $n(\mathrm{Fe^{2+}}) = 5 \cdot 0{,}01000 \cdot 15{,}00 = 0{,}7500\ \mathrm{mmol}$, $c = 0{,}7500\ \mathrm{mmol} / 25{,}00\ \mathrm{mL} = 0{,}03000\ \mathrm{mol/L}$.

? Laborantka ribiške družine je za $100{,}0\ \mathrm{mL}$ vzorca reke in $12{,}00\ \mathrm{mL}$ tiosulfata ($0{,}01000\ \mathrm{mol/L}$) zapisala: $n(\mathrm{O_2}) = 0{,}1200/2 = 0{,}06000\ \mathrm{mmol}$, $\gamma(\mathrm{O_2}) = 19{,}2\ \mathrm{mg/L}$. Ali je račun pravilen?
- Napake ni; $19{,}2\ \mathrm{mg/L}$ je običajna vrednost za reko.
~ Pri sobni temperaturi voda raztopi le okoli $8$–$10\ \mathrm{mg/L}$ kisika, rezultat je nemogoč.
- Pozabila je pretvoriti mL v L, zato je rezultat desetkrat prevelik.
~ Enote so pravilne; napaka je v stehiometriji.
+ Deliti bi morala s 4, ker en $\mathrm{O_2}$ sprosti dva $\mathrm{I_2}$; pravilno je $9{,}60\ \mathrm{mg/L}$.
> $n(\mathrm{O_2}) = 0{,}1200/4 = 0{,}03000\ \mathrm{mmol}$, $\gamma = 0{,}03000 \cdot 32{,}00\ \mathrm{mg} / 0{,}1000\ \mathrm{L} = 9{,}60\ \mathrm{mg/L}$.

? Primerjaj manganometrijo in kislinsko-bazno titracijo. Kaj drži?
- Pri obeh je razmerje titrant : analit vedno 1 : 1.
~ Pri redoksu razmerje sledi iz števila elektronov, pri $\mathrm{MnO_4^-}$ in $\mathrm{Fe^{2+}}$ je 1 : 5.
+ Pri manganometriji vlogo indikatorja prevzame titrant sam, pri kislinsko-bazni potrebujemo dodano barvilo.
- Pri obeh na titracijski krivulji spremljamo pH.
~ Pri redoks titraciji spremljamo potencial $E$, ne pH.
> $\mathrm{MnO_4^-}$ je vijoličast, $\mathrm{Mn^{2+}}$ skoraj brezbarven, zato prva kapljica prebitka obarva raztopino rožnato.

? Pri vzorčenju jezera za Winklerjevo metodo v steklenici ostane mehurček zraka. Kako to vpliva na rezultat?
- Nič, mehurček je premajhen, da bi vplival.
~ Kisik iz mehurčka ($21\ \%$ zraka) se med obdelavo raztopi in reagira z $\mathrm{Mn(OH)_2}$.
+ Rezultat bo previsok, ker se v vzorec raztopi še kisik iz zraka.
- Rezultat bo prenizek, ker kisik pobegne v mehurček.
~ Kisik ne uhaja: $\mathrm{Mn(OH)_2}$ ga veže, in zrak v mehurčku ima več kisika, kot ga je v enaki prostornini vode.
> $\mathrm{Mn(OH)_2}$ veže ves dostopen kisik, tudi tistega iz mehurčka, zato je poraba tiosulfata večja.

:::simboli
K_a | konstanta kisline | | mol/L |
\mathrm{p}K_a | negativni logaritem konstante kisline | \mathrm{p}K_a = -\log K_a | – | moč kisline: manjši pKₐ, močnejša kislina
\mathrm{pH} | pH raztopine | \mathrm{pH} = \mathrm{p}K_a + \log\frac{[\mathrm{A^-}]}{[\mathrm{HA}]} | – | Henderson-Hasselbalchova enačba
E | elektrodni potencial | E = E^\circ + \frac{0{,}0592\ \mathrm{V}}{n}\log\frac{[\mathrm{ox}]}{[\mathrm{red}]} | V | n je tu število izmenjanih elektronov; E° standardni potencial
n | množina snovi | | mol | v Nernstovi enačbi: število izmenjanih elektronov
z_\mathrm{red} | število elektronov, ki jih odda en delec reducenta | | – | Fe²⁺: 1, C₂O₄²⁻: 2
z_\mathrm{ox} | število elektronov, ki jih sprejme en delec oksidanta | | – | MnO₄⁻ v kislem: 5
c | množinska koncentracija | c = \dfrac{n(\mathrm{S_2O_3^{2-}})}{V(\mathrm{S_2O_3^{2-}})} | mol/L
V | prostornina porabljenega titranta | | mL
w | masni delež železa v vzorcu | w(\mathrm{Fe}) = \dfrac{n(\mathrm{Fe})\,M(\mathrm{Fe})}{m(\text{vzorec})} | –
M | molska masa | | g/mol
m | masa vzorca | | g
\gamma | masna koncentracija kisika | \gamma(\mathrm{O_2}) = \dfrac{n(\mathrm{O_2})\,M(\mathrm{O_2})}{V(\text{vzorec})} | mg/L
\gamma_{\text{nas}} | masna koncentracija kisika v nasičeni vodi | | mg/L | odvisna od temperature; pri 25 °C 8,26 mg/L
:::
