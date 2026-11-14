---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ob radiatorju se lahko greješ cel popoldan, pa te ne opeče; pol ure opoldanskega sonca pa lahko kožo pordeči. Radiator koži preda veliko energije, a v drobnih obrokih. Ultravijolična svetloba prinaša obroke, od katerih je vsak posebej dovolj velik, da poškoduje molekulo DNK v celici kože. Šteje torej velikost enega obroka, ne skupna moč. Ta obrok je **foton**.

Klasična fizika ni znala razložiti, zakaj svetloba iz kovine izbije elektrone le pri dovolj kratki valovni dolžini, zakaj razredčen vodik sveti le pri nekaj barvah in zakaj so atomi stabilni. Odgovori so vodili do **kvantne fizike**, brez katere ne razumemo spektroskopije, fotosinteze, elektronskega mikroskopa in zgradbe periodnega sistema.

Pot vodi od **fotona** in **fotoefekta** prek **de Brogliejeve valovne dolžine** delcev do **energijskih nivojev** atoma na primeru vodika.

## Razlaga

### Najprej en foton: zakaj UV opeče, radiator pa ne

Vzemimo ultravijolično svetlobo UV-B z valovno dolžino $300\,\mathrm{nm}$. Njena frekvenca je $\nu = c/\lambda = 3{,}00 \cdot 10^8/3{,}00 \cdot 10^{-7}\,\mathrm{Hz} = 1{,}00 \cdot 10^{15}\,\mathrm{Hz}$, en obrok energije pa je zmnožek frekvence in Planckove konstante $h$ (natančneje jo vpeljemo spodaj): $h\nu = 6{,}626 \cdot 10^{-34} \cdot 1{,}00 \cdot 10^{15}\,\mathrm{J} \approx 6{,}6 \cdot 10^{-19}\,\mathrm{J} \approx 4{,}1\,\mathrm{eV}$. To je dovolj za prekinitev ali preureditev kemijske vezi v DNK. Infrardeče sevanje radiatorja ima valovno dolžino okoli $10\,\mu\mathrm{m}$, njegov obrok je zato več kot tridesetkrat manjši, okoli $0{,}12\,\mathrm{eV}$, in molekule le segreje. Iz tega primera sledi splošno pravilo.

**1. Foton.** Svetloba s frekvenco $\nu$ izmenjuje energijo s snovjo v obrokih, **fotonih**, z energijo

$$W_f = h\nu = \frac{hc}{\lambda},$$

kjer je $h = 6{,}626 \cdot 10^{-34}\,\mathrm{J\,s}$ **Planckova konstanta**. Foton nima mase, ima pa gibalno količino

$$p = \frac{h}{\lambda} = \frac{W_f}{c}.$$

*Izpeljava:* po posebni teoriji relativnosti velja za vsak delec $W^2 = p^2c^2 + m^2c^4$; za delec brez mase je $W = pc$, zato $p = h\nu/c = h/\lambda$.

Priročno je računati v elektronvoltih: $hc \approx 1240\,\mathrm{eV\,nm}$, zato ima foton z valovno dolžino $\lambda$ (v nanometrih) energijo $W_f \approx 1240/\lambda\,\mathrm{eV}$. Vidna svetloba ($400$ do $700\,\mathrm{nm}$) ima fotone z energijo od približno $3{,}1$ do $1{,}8\,\mathrm{eV}$, kar je ravno reda energije kemijskih vezi in elektronskih prehodov v molekulah. Svetlobni tok z močjo $P$ prinese v sekundi $P/W_f$ fotonov.

### Fotoefekt: en foton, en elektron

**2. Fotoefekt.** Ko na čisto kovinsko površino posvetimo s svetlobo, ta lahko izbije elektrone. Poskusi pokažejo:

- elektroni izstopajo le, če je frekvenca svetlobe večja od **mejne frekvence** $\nu_0$, ki je značilna za kovino; pod njo jih ni, ne glede na jakost svetlobe;
- največja kinetična energija izbitih elektronov narašča linearno s frekvenco in **ni odvisna od jakosti** svetlobe;
- jakost svetlobe določa le **število** izbitih elektronov na sekundo (tok);
- elektroni izstopijo takoj, brez zakasnitve.

Klasična valovna slika tega ne razloži: po njej bi močnejša svetloba dala elektronom več energije, mejne frekvence ne bi bilo, pri šibki svetlobi pa bi elektron izstopil šele z zakasnitvijo, ko bi nabral dovolj energije. Einstein je predlagal, da en foton preda vso energijo enemu elektronu. **Izstopno delo** $A_i$ je najmanjše delo, potrebno, da elektron odstranimo iz kovine. Elektron ga porabi za izstop, preostanek energije fotona je njegova kinetična energija; največja je pri elektronih, ki so vezani najšibkeje:

$$W_{k,\max} = h\nu - A_i.$$

Ker kinetična energija ne more biti negativna, fotoefekt nastopi natanko tedaj, ko je $h\nu \ge A_i$, torej nad **mejno frekvenco** $\nu_0 = A_i/h$ ali pod mejno valovno dolžino $\lambda_0 = hc/A_i$. Za tipične kovine je izstopno delo $2$ do $5\,\mathrm{eV}$. Največjo kinetično energijo merimo z **zaporno napetostjo** $U_z$: to je napetost, pri kateri tudi najhitrejši elektroni ne dosežejo nasprotne elektrode, $e_0U_z = W_{k,\max}$. Iz Einsteinove enačbe sledi $U_z = (h/e_0)\,\nu - A_i/e_0$: graf $U_z$ v odvisnosti od $\nu$ je premica z naklonom $h/e_0$, ki seka navpično os pri $-A_i/e_0$, kar je bil eden prvih natančnih načinov za merjenje Planckove konstante.

:::premisli
Kovino z mejno valovno dolžino $550\,\mathrm{nm}$ osvetlimo enkrat z zelo šibko modro svetlobo, drugič z zelo močno rdečo. V katerem primeru izstopajo elektroni?
---
Le pri šibki modri svetlobi. En foton preda energijo enemu elektronu; modri foton ima dovolj energije, rdeči ne. Še tako veliko rdečih fotonov ne pomaga, ker energij več fotonov elektron ne sešteje.
:::

### Delci kot valovi

**3. De Brogliejeva valovna dolžina.** Če ima svetloba lastnosti delcev, imajo morda delci lastnosti valovanja. De Broglie je predlagal, da delcu z gibalno količino $p$ pripada valovna dolžina

$$\lambda = \frac{h}{p} = \frac{h}{mv}.$$

Za nerelativističen delec ($W_k \ll mc^2$, za elektron $mc^2 = 511\,\mathrm{keV}$) s kinetično energijo $W_k$ je $W_k = p^2/(2m)$, torej $p = \sqrt{2mW_k}$. Elektron, ki ga pospešimo iz mirovanja z napetostjo $U$, dobi od polja delo $e_0U$, zato $W_k = e_0U$ in

$$\lambda = \frac{h}{\sqrt{2m_ee_0U}} \approx \frac{1{,}23\,\mathrm{nm}}{\sqrt{U/\mathrm{V}}}.$$

Pri $U = 100\,\mathrm{V}$ je $\lambda \approx 0{,}12\,\mathrm{nm}$, kar je primerljivo z razdaljami med atomi v kristalu. Davisson in Germer sta to potrdila z uklonom elektronov na kristalu niklja. Pri telesih iz vsakdanjega življenja je valovna dolžina neizmerno majhna, zato valovnih lastnosti ne opazimo.

:::premisli
Proton in elektron imata enako kinetično energijo. Kateri ima daljšo de Brogliejevo valovno dolžino?
---
Elektron. Pri enaki kinetični energiji je $p = \sqrt{2mW_k}$ manjša pri manjši masi, $\lambda = h/p$ pa zato daljša. Proton je okoli $1836$-krat težji, zato je njegova valovna dolžina okoli $\sqrt{1836} \approx 43$-krat krajša.
:::

### Od črt v spektru do nivojev atoma

**4. Energijski nivoji atoma.** Ko skozi razredčen vodik v stekleni cevi steče električni tok, plin ne zasveti v mavrici barv, ampak le v nekaj ostrih črtah; najmočnejša vidna je rdeča pri $656\,\mathrm{nm}$. Tako se vedejo vsi atomi plina: oddajajo in absorbirajo svetlobo le pri določenih valovnih dolžinah, zato je spekter **črtast**. Razlaga je, da ima elektron v atomu lahko le določene energije, **energijske nivoje** $W_1 < W_2 < W_3 < \dots$ Ko elektron preide z višjega nivoja $W_m$ na nižji $W_n$, atom izseva foton z energijo

$$h\nu = W_m - W_n.$$

To je zakon o ohranitvi energije za atom in foton (**Bohrov frekvenčni pogoj**). Pri absorpciji je obratno: atom absorbira le foton z energijo, ki je točno enaka razliki dveh nivojev.

**5. Vodikov atom.** Za vodik so nivoji

$$W_n = -\frac{13{,}6\,\mathrm{eV}}{n^2}, \qquad n = 1, 2, 3, \dots$$

Število $n$ je **glavno kvantno število**. Pri ionih z enim elektronom (npr. $\mathrm{He^+}$) in vrstnim številom $Z$ je energija nivojev $Z^2$-krat večja po absolutni vrednosti. Nivo $n = 1$ je **osnovno stanje**; energija $13{,}6\,\mathrm{eV}$ je **ionizacijska energija** vodika iz osnovnega stanja. Valovne dolžine črt podaja Rydbergova formula

$$\frac{1}{\lambda} = R_\infty\left(\frac{1}{n^2} - \frac{1}{m^2}\right), \qquad R_\infty = 1{,}097 \cdot 10^7\,\mathrm{m^{-1}}, \qquad m > n.$$

*Izpeljava:* iz $hc/\lambda = W_m - W_n = 13{,}6\,\mathrm{eV}\,(1/n^2 - 1/m^2)$ sledi $R_\infty = 13{,}6\,\mathrm{eV}/(hc) = 13{,}6/1240\,\mathrm{nm^{-1}} \approx 1{,}097 \cdot 10^{-2}\,\mathrm{nm^{-1}}$.

Prehodi na $n = 1$ tvorijo **Lymanovo serijo** (ultravijolično), na $n = 2$ **Balmerjevo** (vidno: rdeča črta $656\,\mathrm{nm}$, modrozelena $486\,\mathrm{nm}$, vijolični $434$ in $410\,\mathrm{nm}$), na $n = 3$ **Paschenovo** (infrardečo).

**6. Bohrov model in kaj je pravilno.** *Bohrova postulata:* (1) elektron kroži okoli jedra le po stacionarnih krožnicah, na katerih je vrtilna količina $m_evr = n\hbar$ ($\hbar = h/2\pi$; enakovredno: na obseg gre $n$ de Brogliejevih valovnih dolžin), in pri tem ne seva; (2) pri prehodu med stacionarnima stanjema atom izseva ali absorbira foton s $h\nu = W_m - W_n$. *Izpeljava* (jedro miruje, ker je $m_p \gg m_e$): Coulombova sila je centripetalna, $\frac{e_0^2}{4\pi\varepsilon_0r^2} = \frac{m_ev^2}{r}$. Z $v = n\hbar/(m_er)$ dobimo $r_n = \frac{4\pi\varepsilon_0\hbar^2}{m_ee_0^2}\,n^2$. Iz sile je $W_k = \frac{1}{2}m_ev^2 = \frac{e_0^2}{8\pi\varepsilon_0r}$, z $W_p = -\frac{e_0^2}{4\pi\varepsilon_0r}$ pa $W_n = -\frac{e_0^2}{8\pi\varepsilon_0r_n} = -\frac{m_ee_0^4}{8\varepsilon_0^2h^2}\,\frac{1}{n^2}$. To so pravilne energije in polmeri $r_n = n^2r_1$ z $r_1 = 0{,}0529\,\mathrm{nm}$. Sodobna kvantna mehanika (Schrödingerjeva enačba) da iste energije, a elektrona ne opiše s tirom, temveč z **orbitalo**, ki pove verjetnost, kje ga najdemo. Pri atomih z več elektroni so nivoji odvisni še od drugih kvantnih števil, kar razloži zgradbo periodnega sistema.

## Rešeni primeri

### Primer 1 (lažji)

Laserski kazalnik, s katerim predavateljica kaže strukturne formule na prosojnici, oddaja zeleno svetlobo z valovno dolžino $500\,\mathrm{nm}$ in močjo $1{,}0\,\mathrm{mW}$. Kolikšna sta energija in gibalna količina enega fotona? Koliko fotonov odda laser v eni sekundi?

**Podatki:** $\lambda = 500\,\mathrm{nm} = 5{,}00 \cdot 10^{-7}\,\mathrm{m}$, $P = 1{,}0\,\mathrm{mW} = 1{,}0 \cdot 10^{-3}\,\mathrm{W}$, $t = 1{,}0\,\mathrm{s}$, $h = 6{,}626 \cdot 10^{-34}\,\mathrm{J\,s}$, $c = 3{,}00 \cdot 10^8\,\mathrm{m/s}$, $e_0 = 1{,}602 \cdot 10^{-19}\,\mathrm{C}$
**Iščemo:** energijo fotona $W_f$, gibalno količino $p$, število fotonov $N$ v eni sekundi

:::formula
$W_f = hc/\lambda$, $p = h/\lambda$, $N = Pt/W_f$
:::

**Rešitev:**

1. $W_f = 6{,}626 \cdot 10^{-34} \cdot 3{,}00 \cdot 10^8/5{,}00 \cdot 10^{-7}\,\mathrm{J} \approx 3{,}98 \cdot 10^{-19}\,\mathrm{J}$; to je energija enega obroka svetlobe dane valovne dolžine.
2. V elektronvoltih: $W_f = 3{,}98 \cdot 10^{-19}/1{,}602 \cdot 10^{-19}\,\mathrm{eV} \approx 2{,}48\,\mathrm{eV}$ (preizkus: $1240/500 = 2{,}48$ ✓).
3. $p = 6{,}626 \cdot 10^{-34}/5{,}00 \cdot 10^{-7}\,\mathrm{kg\,m/s} \approx 1{,}33 \cdot 10^{-27}\,\mathrm{kg\,m/s}$.
4. $N = 1{,}0 \cdot 10^{-3}\,\mathrm{J}/3{,}98 \cdot 10^{-19}\,\mathrm{J} \approx 2{,}5 \cdot 10^{15}$, ker laser v sekundi odda energijo $Pt$ v obrokih po $W_f$.
5. Odgovor: foton ima energijo okoli $2{,}5\,\mathrm{eV}$ ($4{,}0 \cdot 10^{-19}\,\mathrm{J}$) in gibalno količino $1{,}3 \cdot 10^{-27}\,\mathrm{kg\,m/s}$; laser odda okoli $2{,}5 \cdot 10^{15}$ fotonov na sekundo.

### Primer 2

Natrijevo površino osvetlimo z vijolično svetlobo z valovno dolžino $400\,\mathrm{nm}$. Izstopno delo natrija je $2{,}28\,\mathrm{eV}$. Kolikšni so največja kinetična energija izbitih elektronov, zaporna napetost, njihova največja hitrost in njihova de Brogliejeva valovna dolžina? Kolikšna je mejna valovna dolžina za natrij?

**Podatki:** $\lambda = 400\,\mathrm{nm}$, $A_i = 2{,}28\,\mathrm{eV}$, $hc = 1240\,\mathrm{eV\,nm}$, $h = 6{,}626 \cdot 10^{-34}\,\mathrm{J\,s}$, $m_e = 9{,}11 \cdot 10^{-31}\,\mathrm{kg}$, $e_0 = 1{,}602 \cdot 10^{-19}\,\mathrm{C}$
**Iščemo:** $W_{k,\max}$, $U_z$, $v_{\max}$, valovno dolžino elektrona $\lambda_e$, mejno valovno dolžino $\lambda_0$

:::formula
$W_{k,\max} = \dfrac{hc}{\lambda} - A_i$, $e_0U_z = W_{k,\max}$, $v = \sqrt{2W_k/m_e}$, $\lambda_e = \dfrac{h}{m_ev}$, $\lambda_0 = \dfrac{hc}{A_i}$
:::

**Rešitev:**

1. Energija fotona: $W_f = 1240\,\mathrm{eV\,nm}/400\,\mathrm{nm} = 3{,}10\,\mathrm{eV}$.
2. $W_{k,\max} = 3{,}10 - 2{,}28 = 0{,}82\,\mathrm{eV} = 0{,}82 \cdot 1{,}602 \cdot 10^{-19}\,\mathrm{J} \approx 1{,}31 \cdot 10^{-19}\,\mathrm{J}$; del energije fotona elektron porabi za izstop iz kovine.
3. Zaporna napetost: $U_z = W_{k,\max}/e_0 = 0{,}82\,\mathrm{V}$, ker mora ustaviti ravno najhitrejše elektrone.
4. $v_{\max} = \sqrt{2 \cdot 1{,}31 \cdot 10^{-19}/9{,}11 \cdot 10^{-31}}\,\mathrm{m/s} \approx 5{,}4 \cdot 10^5\,\mathrm{m/s}$; energijo vstavimo v joulih, ker je masa v kilogramih.
5. $\lambda_e = 6{,}626 \cdot 10^{-34}/(9{,}11 \cdot 10^{-31} \cdot 5{,}37 \cdot 10^5)\,\mathrm{m} \approx 1{,}35 \cdot 10^{-9}\,\mathrm{m} = 1{,}35\,\mathrm{nm}$; nerelativistična formula zadošča, ker je $v \ll c$.
6. Mejna valovna dolžina: $\lambda_0 = 1240/2{,}28\,\mathrm{nm} \approx 544\,\mathrm{nm}$; svetloba z daljšo valovno dolžino (rumena, rdeča) elektronov iz natrija ne izbije.
7. Odgovor: najhitrejši elektroni imajo kinetično energijo $0{,}82\,\mathrm{eV}$, zaporna napetost je $0{,}82\,\mathrm{V}$, hitrost okoli $5{,}4 \cdot 10^5\,\mathrm{m/s}$ in de Brogliejeva valovna dolžina okoli $1{,}35\,\mathrm{nm}$; mejna valovna dolžina natrija je okoli $544\,\mathrm{nm}$.

### Primer 3 (težji)

V cevi z razredčenim vodikom so vsi atomi v osnovnem stanju. Atome obstreljujemo z elektroni, ki jih iz mirovanja pospeši napetost $12{,}5\,\mathrm{V}$ (kot v Franck-Hertzovem poskusu). Do katerega nivoja trki vzbudijo atome? Katere črte seva plin in katera je vidna? Valovno dolžino vidne črte preveri z Rydbergovo formulo. Kolikšna mora biti najmanjša napetost, da se pojavi še modrozelena črta $486\,\mathrm{nm}$?

**Podatki:** $U = 12{,}5\,\mathrm{V}$, začetno stanje $n = 1$, $W_n = -13{,}6\,\mathrm{eV}/n^2$, $hc = 1240\,\mathrm{eV\,nm}$, $R_\infty = 1{,}097 \cdot 10^7\,\mathrm{m^{-1}}$
**Iščemo:** najvišji vzbujeni nivo, valovne dolžine izsevanih črt, najmanjšo napetost $U_4$ za črto $486\,\mathrm{nm}$

:::formula
$W_k = e_0U$, $h\nu = W_m - W_n = 13{,}6\,\mathrm{eV}\left(\dfrac{1}{n^2} - \dfrac{1}{m^2}\right)$, $\lambda = \dfrac{hc}{h\nu}$
:::

**Rešitev:**

1. Elektron prinese kinetično energijo $W_k = e_0U = 12{,}5\,\mathrm{eV}$; pri trku atomu preda le razliko dveh nivojev, preostanek obdrži.
2. Vzbujevalne energije iz $n = 1$: $W_2 - W_1 = 13{,}6\,(1 - 1/4)\,\mathrm{eV} = 10{,}2\,\mathrm{eV}$, $W_3 - W_1 = 13{,}6\,(1 - 1/9)\,\mathrm{eV} \approx 12{,}09\,\mathrm{eV}$, $W_4 - W_1 = 13{,}6\,(1 - 1/16)\,\mathrm{eV} = 12{,}75\,\mathrm{eV}$.
3. Ker je $12{,}75\,\mathrm{eV} > 12{,}5\,\mathrm{eV}$, je najvišji dosegljivi nivo $n = 3$.
4. Iz $n = 3$ atom preide v osnovno stanje neposredno ali prek $n = 2$: prehodi $3 \to 1$, $3 \to 2$ in $2 \to 1$ dajo tri črte.
5. $\lambda_{31} = 1240/12{,}09\,\mathrm{nm} \approx 103\,\mathrm{nm}$ in $\lambda_{21} = 1240/10{,}2\,\mathrm{nm} \approx 122\,\mathrm{nm}$ sta v Lymanovi seriji (UV).
6. $W_3 - W_2 = 13{,}6\,(1/4 - 1/9)\,\mathrm{eV} \approx 1{,}89\,\mathrm{eV}$, zato $\lambda_{32} = 1240/1{,}889\,\mathrm{nm} \approx 656\,\mathrm{nm}$: rdeča črta Balmerjeve serije (končno stanje $n = 2$), edina vidna.
7. Preizkus: $1/\lambda = 1{,}097 \cdot 10^7 \cdot (1/4 - 1/9)\,\mathrm{m^{-1}}$, $\lambda \approx 6{,}56 \cdot 10^{-7}\,\mathrm{m}$ ✓.
8. Črta $486\,\mathrm{nm}$ ima energijo $1240/486\,\mathrm{eV} \approx 2{,}55\,\mathrm{eV} = 13{,}6\,(1/4 - 1/16)\,\mathrm{eV}$, torej prehod $4 \to 2$. Vzbuditi moramo $n = 4$, zato $e_0U_4 \ge 12{,}75\,\mathrm{eV}$ in $U_4 = 12{,}75\,\mathrm{V}$.
9. Odgovor: elektroni vzbudijo atome največ do $n = 3$; plin seva tri črte, $103\,\mathrm{nm}$ in $122\,\mathrm{nm}$ v UV ter vidno rdečo $656\,\mathrm{nm}$. Za modrozeleno črto mora biti napetost vsaj $12{,}75\,\mathrm{V}$.

### Primer 4 – zdaj ti

Neznano kovino osvetlimo z ultravijolično svetlobo z valovno dolžino $300\,\mathrm{nm}$. Tok izbitih elektronov preneha pri zaporni napetosti $2{,}00\,\mathrm{V}$. Kolikšna sta izstopno delo kovine in njena mejna valovna dolžina? Ali bi elektrone izbijala tudi rdeča svetloba z valovno dolžino $650\,\mathrm{nm}$?

**Podatki:** $\lambda = 300\,\mathrm{nm}$, $U_z = 2{,}00\,\mathrm{V}$, $hc = 1240\,\mathrm{eV\,nm}$, rdeča svetloba $\lambda_r = 650\,\mathrm{nm}$
**Iščemo:** izstopno delo $A_i$, mejno valovno dolžino $\lambda_0$, ali rdeča svetloba izbija elektrone

:::formula
$W_{k,\max} = \dfrac{hc}{\lambda} - A_i$, $e_0U_z = W_{k,\max}$, $\lambda_0 = \dfrac{hc}{A_i}$
:::

**Rešitev:**

1. Energija fotona: $W_f = 1240\,\mathrm{eV\,nm}/300\,\mathrm{nm} \approx 4{,}13\,\mathrm{eV}$; valovno dolžino pustimo v nanometrih, ker je $hc$ v $\mathrm{eV\,nm}$.
2. Največja kinetična energija: $W_{k,\max} = e_0U_z = 2{,}00\,\mathrm{eV}$, ker zaporna napetost ravno ustavi najhitrejše elektrone (naboj $e_0$ pri napetosti $2{,}00\,\mathrm{V}$ da $2{,}00\,\mathrm{eV}$).
3. Izračunaj sam izstopno delo in mejno valovno dolžino ter ju primerjaj s $650\,\mathrm{nm}$.

:::premisli
Kolikšna sta $A_i$ in $\lambda_0$ in ali rdeča svetloba izbija elektrone?
---
$A_i = W_f - W_{k,\max} \approx 4{,}13 - 2{,}00 = 2{,}13\,\mathrm{eV}$, $\lambda_0 = 1240/2{,}133\,\mathrm{nm} \approx 581\,\mathrm{nm}$. Rdeča svetloba ima daljšo valovno dolžino od mejne, njeni fotoni imajo premalo energije ($1240/650 \approx 1{,}9\,\mathrm{eV}$), zato elektronov ne izbija, ne glede na jakost.
:::

## Pogoste napake

- **Jakost in energija elektronov.** Močnejša svetloba iste barve izbije **več** elektronov, ne hitrejših.
- **Kinetična energija in izstopno delo.** Odštej izstopno delo; pri $h\nu < A_i$ fotoefekta ni, kinetična energija ne more biti negativna.
- **Mešanje enot eV in J.** Pri $v = \sqrt{2W_k/m}$ in $\lambda = h/p$ mora biti energija v joulih.
- **De Broglie s svetlobno hitrostjo.** Za delec z maso velja $\lambda = h/(mv)$, ne $\lambda = c/\nu$. Formula $W = hc/\lambda$ velja le za fotone.
- **Predznak energijskih nivojev.** Energija prostega mirujočega elektrona je nič, zato so nivoji negativni; večji $n$ pomeni večjo energijo.
- **Absorpcijski spekter je enak emisijskemu.** V hladnem plinu so skoraj vsi atomi v osnovnem stanju, zato absorbirajo le fotone z energijo $W_m - W_1$ (pri vodiku Lymanova serija). Vroč plin seva tudi Balmerjevo serijo.

## Povzetek

- Foton: $W_f = h\nu = hc/\lambda$, $p = h/\lambda$; $hc \approx 1240\,\mathrm{eV\,nm}$.
- Fotoefekt: $W_{k,\max} = h\nu - A_i$, mejna frekvenca $\nu_0 = A_i/h$, zaporna napetost $e_0U_z = W_{k,\max}$; jakost svetlobe vpliva le na število elektronov.
- De Brogliejeva valovna dolžina: $\lambda = h/p = h/\sqrt{2mW_k}$; elektron pri napetosti $U$: $\lambda \approx 1{,}23\,\mathrm{nm}/\sqrt{U/\mathrm{V}}$.
- Energijski nivoji: atom seva ali absorbira foton s $h\nu = W_m - W_n$; spekter je črtast.
- Vodik: $W_n = -13{,}6\,\mathrm{eV}/n^2$; Lymanova serija ($n = 1$, UV), Balmerjeva ($n = 2$, vidna), Paschenova ($n = 3$, IR).

## Za izpit

Znati moraš povedati:

- definicijo fotona, $W_f = h\nu$, $p = h/\lambda$ in izpeljavo gibalne količine iz $W = pc$;
- poskusna dejstva fotoefekta, zakaj jih valovna slika ne razloži, Einsteinovo enačbo z mejno frekvenco in kako iz premice $U_z(\nu)$ dobimo $h$ in $A_i$;
- de Brogliejevo hipotezo in izpeljavo $\lambda = h/\sqrt{2m_ee_0U}$ s pogojem $W_k \ll mc^2$;
- Bohrova postulata, izpeljavo $r_n$ in $W_n$ za vodik ter Rydbergove formule;
- zakaj je spekter atomov črtast in zakaj hladen vodik absorbira le Lymanovo serijo.

### Naloga 1

Svetloba vodikove spektralne svetilke pada na fotokatodo iz kalija z izstopnim delom $2{,}30\,\mathrm{eV}$. Svetilka seva Balmerjeve črte s prehodov z $m = 3, 4, 5, 6$ na $n = 2$. Katere črte izbijajo elektrone, kolikšna je izmerjena zaporna napetost in kolikšna je de Brogliejeva valovna dolžina najhitrejših elektronov? Kolikšna bi bila zaporna napetost, če bi svetilka sevala vse do meje Balmerjeve serije? $hc = 1240\,\mathrm{eV\,nm}$, $h = 6{,}626 \cdot 10^{-34}\,\mathrm{J\,s}$, $m_e = 9{,}11 \cdot 10^{-31}\,\mathrm{kg}$, $e_0 = 1{,}602 \cdot 10^{-19}\,\mathrm{C}$.

**Rešitev:**

1. Energije fotonov so $W_m - W_2 = 13{,}6\,(1/4 - 1/m^2)\,\mathrm{eV}$: za $m = 3$ $1{,}89\,\mathrm{eV}$ ($656\,\mathrm{nm}$), za $m = 4$ $2{,}55\,\mathrm{eV}$ ($486\,\mathrm{nm}$), za $m = 5$ $2{,}86\,\mathrm{eV}$ ($434\,\mathrm{nm}$), za $m = 6$ $3{,}02\,\mathrm{eV}$ ($410\,\mathrm{nm}$).
2. Mejna valovna dolžina kalija: $\lambda_0 = 1240/2{,}30\,\mathrm{nm} \approx 539\,\mathrm{nm}$. Elektrone izbijajo črte $486$, $434$ in $410\,\mathrm{nm}$; rdeča $656\,\mathrm{nm}$ jih ne, ne glede na jakost, ker en foton preda energijo enemu elektronu.
3. Zaporno napetost določajo najhitrejši elektroni, torej fotoni z največjo energijo ($410\,\mathrm{nm}$): $W_{k,\max} = 3{,}02 - 2{,}30 = 0{,}72\,\mathrm{eV}$, $U_z = 0{,}72\,\mathrm{V}$.
4. Gibalna količina: $p = \sqrt{2m_eW_{k,\max}} = \sqrt{2 \cdot 9{,}11 \cdot 10^{-31} \cdot 0{,}72 \cdot 1{,}602 \cdot 10^{-19}}\,\mathrm{kg\,m/s} \approx 4{,}58 \cdot 10^{-25}\,\mathrm{kg\,m/s}$; energijo smo pretvorili v joule.
5. $\lambda_e = h/p = 6{,}626 \cdot 10^{-34}/4{,}58 \cdot 10^{-25}\,\mathrm{m} \approx 1{,}45 \cdot 10^{-9}\,\mathrm{m}$ (preizkus: $1{,}23/\sqrt{0{,}72}\,\mathrm{nm} \approx 1{,}45\,\mathrm{nm}$ ✓).
6. Meja Balmerjeve serije je prehod z $m \to \infty$ na $n = 2$; foton nosi $3{,}40\,\mathrm{eV}$, kar je tudi ionizacijska energija iz $n = 2$, in ima $\lambda_{\infty 2} = 1240/3{,}40\,\mathrm{nm} \approx 365\,\mathrm{nm}$ (bližnji UV).
7. Tedaj bi bilo $W_{k,\max} = 3{,}40 - 2{,}30 = 1{,}10\,\mathrm{eV}$ in $U_z = 1{,}10\,\mathrm{V}$.
8. Odgovor: elektrone izbijajo črte $486$, $434$ in $410\,\mathrm{nm}$; zaporna napetost je $0{,}72\,\mathrm{V}$, valovna dolžina najhitrejših elektronov okoli $1{,}45\,\mathrm{nm}$. Z vsemi črtami do meje serije pri $365\,\mathrm{nm}$ bi bila zaporna napetost $1{,}10\,\mathrm{V}$.

### Naloga 2

Natančno navedi Bohrova postulata. Iz njiju izpelji polmere tirov in energije nivojev vodikovega atoma, iz konstant izračunaj energijo osnovnega stanja in izpelji Rydbergovo formulo. Utemelji, zakaj je ionizacijska energija vodika iz osnovnega stanja $13{,}6\,\mathrm{eV}$. Uporabi $m_e = 9{,}11 \cdot 10^{-31}\,\mathrm{kg}$, $e_0 = 1{,}602 \cdot 10^{-19}\,\mathrm{C}$, $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\mathrm{A\,s/(V\,m)}$, $h = 6{,}626 \cdot 10^{-34}\,\mathrm{J\,s}$.

**Rešitev:**

1. Postulata: (1) elektron kroži le po stacionarnih krožnicah z vrtilno količino $m_evr = n\hbar$, $n = 1, 2, \dots$, in na njih ne seva; (2) pri prehodu s stanja z energijo $W_m$ v stanje z $W_n$ izseva foton s $h\nu = W_m - W_n$, pri absorpciji obratno.
2. Jedro miruje ($m_p \gg m_e$), Coulombova sila je centripetalna: $\dfrac{e_0^2}{4\pi\varepsilon_0r^2} = \dfrac{m_ev^2}{r}$.
3. Iz postulata (1) je $v = n\hbar/(m_er)$; vstavimo in dobimo $\dfrac{e_0^2}{4\pi\varepsilon_0} = \dfrac{n^2\hbar^2}{m_er}$, torej $r_n = \dfrac{4\pi\varepsilon_0\hbar^2}{m_ee_0^2}\,n^2 = n^2 \cdot 0{,}0529\,\mathrm{nm}$.
4. Iz koraka 2 je $W_k = \tfrac{1}{2}m_ev^2 = \dfrac{e_0^2}{8\pi\varepsilon_0r}$, potencialna energija pa $W_p = -\dfrac{e_0^2}{4\pi\varepsilon_0r}$; skupaj $W_n = -\dfrac{e_0^2}{8\pi\varepsilon_0r_n} = -\dfrac{m_ee_0^4}{8\varepsilon_0^2h^2}\,\dfrac{1}{n^2}$.
5. Številsko: $\dfrac{m_ee_0^4}{8\varepsilon_0^2h^2} = \dfrac{9{,}11 \cdot 10^{-31} \cdot (1{,}602 \cdot 10^{-19})^4}{8 \cdot (8{,}85 \cdot 10^{-12})^2 \cdot (6{,}626 \cdot 10^{-34})^2}\,\mathrm{J} \approx 2{,}18 \cdot 10^{-18}\,\mathrm{J} \approx 13{,}6\,\mathrm{eV}$.
6. Po postulatu (2) je $hc/\lambda = W_m - W_n = 13{,}6\,\mathrm{eV}\,(1/n^2 - 1/m^2)$ za $m > n$, kar je Rydbergova formula z $R_\infty = 13{,}6\,\mathrm{eV}/(hc) \approx 1{,}097 \cdot 10^7\,\mathrm{m^{-1}}$.
7. Ionizacija iz osnovnega stanja je prehod z $W_1 = -13{,}6\,\mathrm{eV}$ v $W_\infty = 0$ (prost mirujoč elektron), zato je potrebna energija $13{,}6\,\mathrm{eV}$.
8. Odgovor: $r_n = n^2 \cdot 0{,}0529\,\mathrm{nm}$, $W_n = -13{,}6\,\mathrm{eV}/n^2$, $1/\lambda = R_\infty(1/n^2 - 1/m^2)$ z $R_\infty \approx 1{,}097 \cdot 10^7\,\mathrm{m^{-1}}$; ionizacijska energija je $-W_1 = 13{,}6\,\mathrm{eV}$.

## Drugače: Na sliki

Energijski nivoji vodika (ne v merilu):

```
  0,00 eV  ----------------------  n = ∞  (ionizacija)
 -0,85 eV  ----------------------  n = 4
                        |
 -1,51 eV  ----------------------  n = 3
               |        |
               | 656 nm | 486 nm (s 4 na 2)
               v        v
 -3,40 eV  ----------------------  n = 2   ← Balmerjeva serija
               |
               | 122 nm (Lyman α)
               v
-13,6 eV   ----------------------  n = 1   ← osnovno stanje
```

Nivoji se z večanjem $n$ zgoščujejo proti nič; dolžina puščice je energija izsevanega fotona.

Fotoefekt na grafu: $W_{k,\max}(\nu)$ je premica z naklonom $h$, ki seka vodoravno os pri $\nu_0$, navpično pa pri $-A_i$; različne kovine dajo vzporedne premice.

## Drugače: Uporaba v stroki

**UV-VIS spektrofotometrija.** Raztopina absorbira le fotone, ki ustrezajo prehodom v njenih molekulah (raztopina bakrovega(II) sulfata absorbira rdečo, zato je modra). Vsak absorbiran foton je en prehod v eni molekuli, zato je absorbanca sorazmerna s koncentracijo.

**Atomska spektrometrija.** Atomi v plamenu ali plazmi absorbirajo in, ko so vzbujeni, sevajo značilne črte (natrij $589\,\mathrm{nm}$): AAS meri absorpcijo, ICP-OES emisijo, in tako določata sledi kovin.

**Elektronska mikroskopija.** Elektroni, pospešeni s $100\,\mathrm{kV}$, imajo valovno dolžino nekaj tisočink nanometra (z relativističnim popravkom), zato elektronski mikroskop loči podrobnosti pod nanometrom.

**Detektorji.** Fotopomnoževalka izkorišča zunanji fotoefekt, silicijeva fotodioda notranjega (foton elektron le sprosti v snovi, da prevaja tok, iz nje ga ne izbije): silicij potrebuje fotone nad okoli $1{,}1\,\mathrm{eV}$, torej pod okoli $1100\,\mathrm{nm}$.

## Drugače: Bolj natančno

**Bohrovi nivoji številsko.** Izraza iz točke 6 Razlage z vstavljenimi konstantami dasta

$$r_n = \frac{4\pi\varepsilon_0\hbar^2}{m_ee_0^2}\,n^2 = n^2 \cdot 0{,}0529\,\mathrm{nm}, \qquad W_n = -\frac{m_ee_0^4}{8\varepsilon_0^2h^2}\,\frac{1}{n^2} = -\frac{13{,}6\,\mathrm{eV}}{n^2}.$$

Preizkus za $n = 2$: obseg $2\pi \cdot 0{,}212\,\mathrm{nm} \approx 1{,}33\,\mathrm{nm}$, de Brogliejeva valovna dolžina elektrona s kinetično energijo $3{,}40\,\mathrm{eV}$ pa je $0{,}665\,\mathrm{nm}$: na obseg gresta točno dve.

**Nedoločenost.** Valovna narava delcev ima za posledico **Heisenbergovo načelo nedoločenosti**: $\Delta x\,\Delta p_x \ge \hbar/2$. Elektron, omejen na $\Delta x \approx 0{,}1\,\mathrm{nm}$, ima $\Delta p \approx 5 \cdot 10^{-25}\,\mathrm{kg\,m/s}$ in kinetično energijo reda elektronvolta, zato ne pade v jedro.

**Delec v škatli.** Najpreprostejši kvantni model energijskih nivojev: delec z maso $m$ v enodimenzionalni škatli z dolžino $L$ ima stoječe valovanje z $L = n\lambda/2$. Iz $p = h/\lambda$ dobimo $W_n = \frac{p^2}{2m} = \frac{n^2h^2}{8mL^2}$. Model opiše konjugirana barvila: daljša veriga pomeni manjšo razliko nivojev in absorpcijo pri daljši valovni dolžini.

**Comptonov pojav.** Pri sipanju rentgenskih žarkov na elektronih se valovna dolžina poveča za $\Delta\lambda = \frac{h}{m_ec}(1 - \cos\vartheta)$. Dobimo ga iz ohranitve energije in **gibalne količine** fotona $p = h/\lambda$, kar dokazuje, da ima foton gibalno količino.

## Preveri se

? Kolikšna je energija fotona z valovno dolžino $620\,\mathrm{nm}$?
- $0{,}50\,\mathrm{eV}$
~ Razmerje si obrnil: izračunal si $\lambda/(hc)$; energija fotona je $hc/\lambda$, zato je pri krajši valovni dolžini večja.
+ $2{,}0\,\mathrm{eV}$
- $1{,}24\,\mathrm{eV}$
~ To je $hc = 1{,}24\,\mathrm{eV\,\mu m}$ brez deljenja z valovno dolžino $0{,}62\,\mu\mathrm{m}$; tako energijo ima foton z valovno dolžino $1000\,\mathrm{nm}$.
> $W_f = 1240\,\mathrm{eV\,nm}/620\,\mathrm{nm} = 2{,}0\,\mathrm{eV}$.

? Pri fotoefektu povečamo jakost svetlobe, frekvenca pa ostane enaka. Kaj se zgodi?
- Izbiti elektroni so hitrejši.
~ To je klasična valovna predstava. Vsak elektron dobi energijo enega fotona, ta pa je odvisna le od frekvence.
+ Izbitih elektronov je več, njihova največja kinetična energija pa je enaka.
- Mejna frekvenca se zmanjša.
~ Mejna frekvenca $\nu_0 = A_i/h$ je lastnost kovine (izstopnega dela), ne svetlobe.
> En foton izbije en elektron, energijo elektrona določa $h\nu - A_i$. Večja jakost pomeni več fotonov in zato več elektronov.

? Hitrost elektrona podvojimo (nerelativistično). Kako se spremeni njegova de Brogliejeva valovna dolžina?
+ Razpolovi se.
- Podvoji se.
~ Zamenjal si sorazmernost: $\lambda = h/(mv)$ je obratno sorazmerna s hitrostjo, hitrejši delec ima krajšo valovno dolžino.
- Zmanjša se na četrtino.
~ Kinetična energija se res početveri, a valovna dolžina je obratno sorazmerna z gibalno količino, ne z energijo.
> $\lambda = h/(mv)$ je obratno sorazmerna s hitrostjo. Na četrtino bi se zmanjšala šele pri štirikratni hitrosti (šestnajstkratni kinetični energiji).

? Kolikšno energijo ima foton, ki ga izseva vodikov atom pri prehodu iz $n = 2$ v $n = 1$?
- $13{,}6\,\mathrm{eV}$
~ To je ionizacijska energija, prehod iz $n = 1$ v $n = \infty$; foton nosi razliko nivojev $2$ in $1$.
- $3{,}4\,\mathrm{eV}$
~ To je absolutna vrednost energije nivoja $n = 2$, ne razlika nivojev.
+ $10{,}2\,\mathrm{eV}$
> $W_2 - W_1 = -3{,}4\,\mathrm{eV} - (-13{,}6\,\mathrm{eV}) = 10{,}2\,\mathrm{eV}$, kar ustreza ultravijolični črti z valovno dolžino okoli $122\,\mathrm{nm}$.

? Katera serija črt vodikovega spektra leži v vidnem delu spektra?
- Lymanova (prehodi na $n = 1$)
~ Misliš, da je najbolj znana serija tudi vidna; prehodi na osnovno stanje imajo veliko energijo (vsaj $10{,}2\,\mathrm{eV}$), zato so njihove črte v ultravijoličnem delu.
+ Balmerjeva (prehodi na $n = 2$)
- Paschenova (prehodi na $n = 3$)
~ Misliš, da manjša energija fotona še pomeni vidno svetlobo; prehodi na $n = 3$ dajo fotone pod $1{,}6\,\mathrm{eV}$, ki so že v infrardečem delu.
> Balmerjeva serija ima črte pri $656$, $486$, $434$ in $410\,\mathrm{nm}$, torej v vidnem delu.

:::simboli
W_f | energija fotona | W_f = h\nu = \frac{hc}{\lambda} | J | pogosto v eV
h | Planckova konstanta | | J\,s | 6,626 · 10⁻³⁴ J s
\nu | frekvenca svetlobe | \nu = \frac{c}{\lambda} | Hz
\nu_0 | mejna frekvenca | \nu_0 = \frac{A_i}{h} | Hz
c | hitrost svetlobe | | m/s | 3,00 · 10⁸ m/s
\lambda | valovna dolžina | \lambda = \frac{h}{p} | m | hc ≈ 1240 eV nm
\lambda_e | valovna dolžina elektrona | \lambda_e = \frac{h}{m_e v} | m
\lambda_0 | mejna valovna dolžina | \lambda_0 = \frac{hc}{A_i} | m
p | gibalna količina | p = \frac{h}{\lambda} | kg\,m/s
W_{k,\max} | največja kinetična energija izbitih elektronov | W_{k,\max} = h\nu - A_i | J
W_k | kinetična energija delca | W_k = \frac{m v^2}{2} | J | elektron, pospešen z napetostjo U: W_k = e₀U
A_i | izstopno delo | | J | običajno v eV
m | masa delca | | kg | v Rydbergovi formuli kvantno število višjega nivoja
m_e | masa elektrona | | kg | 9,11 · 10⁻³¹ kg
v | hitrost delca | v = \sqrt{\frac{2W_k}{m}} | m/s
e_0 | osnovni naboj | | C | 1,602 · 10⁻¹⁹ C
U | pospeševalna napetost | | V
U_z | zaporna napetost | e_0U_z = W_{k,\max} | V
W_m | energija višjega nivoja | | J | začetno stanje pri izsevanju
W_n | energija n-tega nivoja vodikovega atoma | W_n = -\frac{13{,}6\,\mathrm{eV}}{n^2} | J | običajno v eV
n | glavno kvantno število | | – | n = 1, 2, 3, …
R_\infty | Rydbergova konstanta | | m^{-1} | 1,097 · 10⁷ m⁻¹
r_n | polmer n-te Bohrove orbite | r_n = n^2 \cdot 0{,}0529\,\mathrm{nm} | m
\varepsilon_0 | influenčna konstanta | | A\,s/(V\,m)
N | število fotonov | N = \frac{Pt}{W_f} | –
P | moč svetlobnega toka | | W
t | čas | | s
\hbar | reducirana Planckova konstanta | \hbar = \frac{h}{2\pi} | J s | ≈ 1,055 · 10⁻³⁴ J s
:::
