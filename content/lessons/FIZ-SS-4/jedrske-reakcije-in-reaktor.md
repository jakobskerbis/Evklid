---
stanje: osnutek
demo: razpad
avtor: AI
---

## Zakaj se tega učimo

Tilen med odmorom razlaga: »Jedrska elektrarna je v resnici velik lonec na pritisk. Uran v njej gori kot plin na štedilniku, le bolj vroče je.«

Pol trditve drži: v Krškem res segrevajo vodo pod visokim tlakom. Uran pa ne gori. Pri gorenju plina se atomi le preuredijo v nove molekule, v reaktorju pa se spremenijo jedra sama. Zato da kilogram urana-235 milijonkrat več energije kot kilogram plina.

S števili bomo pokazali, koliko energije da ena reakcija, kateri delec manjka v zapisu in kako v NEK držijo verižno reakcijo na pravi moči. Vse to pride na maturo.

## Razlaga

**Od razpada k reakciji.** Pri radioaktivnem razpadu jedro razpade samo od sebe. Pri **jedrski reakciji z obstreljevanjem** pa jedro zadene delec (nevtron, proton, delec alfa) in nastanejo nova jedra. Prvo tako reakcijo je izvedel Rutherford leta 1919, ko je z delci alfa obstreljeval dušik:

$${}^{14}_{7}\mathrm{N} + {}^{4}_{2}\mathrm{He} \rightarrow {}^{17}_{8}\mathrm{O} + {}^{1}_{1}\mathrm{H}$$

Primerjaj jo z gorenjem plina v kuhinji:

| | plin | jedro |
|---|---|---|
| spremeni se | vezi | jedra |
| ohrani se | atomi | $A$ in $Z$ |
| energija | eV | MeV |
| masa | enaka | drugačna |

**Ohranitveni zakoni.** Pri vsaki jedrski reakciji se ohranijo štiri količine:

1. **število nukleonov**: vsota masnih števil $A$ (zgornjih indeksov) levo je enaka vsoti desno;
2. **naboj**: vsota vrstnih števil $Z$ (spodnjih indeksov) levo je enaka vsoti desno (elektron šteje kot $-1$);
3. **energija**, če štejemo tudi mirovno energijo $mc^2$;
4. **gibalna količina**.

Iz prvih dveh najdeš neznani delec; po vrstnem številu $Z$ ga poiščeš v periodnem sistemu. Pri Rutherfordovi reakciji je desno $Z = 8$ (kisik) in $A = 17$, poleg tega pa še ${}^{1}_{1}\mathrm{H}$, proton.

Ohrani se naboj, ne število protonov: pri razpadu $\beta^-$ se nevtron spremeni v proton in elektron z nabojem $-1$.

**Masa ni ohranjena.** Testo je enako težko kot sestavine, v jedru pa se skupna masa spremeni. Razlika je **masni primanjkljaj reakcije**:

$$\Delta m = m_\mathrm{pred} - m_\mathrm{po}$$

Iz nje dobimo **reakcijsko energijo**:

$$W_\mathrm{r} = \Delta m \, c^2$$

Če je $\Delta m > 0$, se energija sprosti kot kinetična energija produktov ali foton gama. Če je $\Delta m < 0$, mora vpadni delec prinesti dovolj kinetične energije. Rutherfordova reakcija ima $\Delta m < 0$ (izračunal ga boš v primeru 4), zato potrebuje hitre delce alfa.

**Hitrejša pot z enoto u.** Atomske mase so v tabelah v atomskih enotah mase, $1\,\mathrm{u} = 1{,}66054\cdot10^{-27}\,\mathrm{kg}$. Mirovna energija ene enote je $1\,\mathrm{u}\cdot c^2 = 1{,}4924\cdot10^{-10}\,\mathrm{J}$, kar je $931{,}5\,\mathrm{MeV}$. Zato ni treba pretvarjati v kilograme: $\Delta m$ v u pomnožiš s $931{,}5\,\mathrm{MeV/u}$.

Tabele navajajo mase **atomov**, ne golih jeder. To ne moti, če je elektronov na obeh straneh enako. Tak je razpad $\beta^-$ ogljika-14:

$${}^{14}_{6}\mathrm{C} \rightarrow {}^{14}_{7}\mathrm{N} + {}^{0}_{-1}\mathrm{e} + \bar{\nu}$$

Atom ogljika ima 6 elektronov, atom dušika 7. Desno so jedro dušika, šest elektronov, ki jih je imel ogljik, in izsevani elektron: skupaj ravno atom dušika. Zato vzameš kar razliko atomskih mas, elektrona ne odšteješ še enkrat:

$$\Delta m = 14{,}003242\,\mathrm{u} - 14{,}003074\,\mathrm{u}$$

$$\Delta m = 0{,}000168\,\mathrm{u}$$

To da $0{,}156\,\mathrm{MeV}$. To energijo si razdelita elektron in antinevtrino $\bar{\nu}$, delec skoraj brez mase in brez naboja. Zato imajo elektroni iz razpada $\beta^-$ različne energije.

V simulaciji spodaj (»Razpad jeder in razpolovni čas«) izberi ogljik-14: v enem razpolovnem času razpade polovica jeder in vsako sprosti $0{,}156\,\mathrm{MeV}$.

**Odboj pri razpadu alfa.** Jedro pred razpadom miruje. Po razpadu imata delec alfa in novo jedro enako veliki gibalni količini v nasprotnih smereh, kot puška in krogla pri strelu. Kinetična energija je $W = p^2/(2m)$, zato pri enakem $p$ dobi lažji delec več energije.

:::premisli
Novo jedro je pri razpadu radija okoli 55-krat težje od delca alfa. Oceni, kolikšen del sproščene energije dobi jedro, preden pogledaš odgovor.
---
Gibalni količini sta enako veliki, kinetična energija pa je $p^2/(2m)$. Pri enakem $p$ ima delec s 55-krat manjšo maso 55-krat večjo kinetično energijo. Jedro dobi le okoli $2\,\%$ energije.
:::

**Verižna reakcija.** Počasen nevtron zadene uran-235 in jedro se razcepi, na primer:

$${}^{235}_{92}\mathrm{U} + {}^{1}_{0}\mathrm{n} \rightarrow {}^{141}_{56}\mathrm{Ba} + {}^{92}_{36}\mathrm{Kr} + 3\,{}^{1}_{0}\mathrm{n}$$

Pri cepitvi nastanejo 2 ali 3 novi nevtroni. Vsak lahko razcepi naslednje jedro. Število cepitev v eni »generaciji« deljeno s številom v prejšnji je **faktor množenja**:

$$k = \frac{N_2}{N_1}$$

Pri $k < 1$ reakcija ugasne, pri $k = 1$ teče enakomerno (reaktor), pri $k > 1$ število cepitev hitro narašča (bomba). V majhnem kosu urana veliko nevtronov uide skozi površino, preden kaj zadene, zato je $k < 1$. **Kritična masa** je najmanjša masa, pri kateri je $k = 1$.

**Reaktor v Krškem.** NEK ima tlačnovodni reaktor z električno močjo okoli $700\,\mathrm{MW}$ in toplotno okoli $2000\,\mathrm{MW}$. Skica:

:::risba skica
opis: Shema tlačnovodne elektrarne. Levo reaktorska posoda z vodo (3), v njej tri navpične gorivne palice (1), od zgoraj vanjo segata kontrolni palici (2). Primarni krog vodi vročo vodo na desno v uparjalnik (4) in jo vrača nazaj. Iz uparjalnika gre para v turbino (5), ki vrti generator (6). Para iz turbine gre navzdol v kondenzator (7), ki ga hladi reka Sava; voda se vrača v uparjalnik.
območje: 0; 0 .. 12; 7
enota: 24
pravokotnik: 0,4; 0,8 .. 3,4; 5 | modra
črta: 1,1; 1,3 -> 1,1; 3,6 | debelo
črta: 1,9; 1,3 -> 1,9; 3,6 | debelo
črta: 2,7; 1,3 -> 2,7; 3,6 | debelo
črta: 1,5; 6,2 -> 1,5; 3,0 | rdeča debelo
črta: 2,3; 6,2 -> 2,3; 3,0 | rdeča debelo
napis: 1,5; 1,05 | 1 | sredina
napis: 1,9; 6,5 | 2 | sredina
napis: 3,0; 4,4 | 3 | sredina
puščica: 3,4; 4,4 -> 5,0; 4,4
puščica: 5,0; 1,4 -> 3,4; 1,4
pravokotnik: 5,0; 0,8 .. 6,6; 5 | oranžna
napis: 5,8; 2,9 | 4 | sredina
puščica: 6,6; 4,4 -> 8,2; 4,4
lik: 8,2; 3,6 -> 9,8; 3,0 -> 9,8; 5,8 -> 8,2; 5,2 | zelena
napis: 9,0; 4,4 | 5 | sredina
črta: 9,8; 4,4 -> 10,5; 4,4
krog: 11,2; 4,4 | 0,7 | modra
napis: 11,2; 4,4 | 6 | sredina
puščica: 9,0; 3,3 -> 9,0; 2,2
pravokotnik: 8,2; 0,8 .. 9,8; 2,2 | siva
napis: 9,0; 1,5 | 7 | sredina
puščica: 8,2; 1,4 -> 6,6; 1,4
puščica: 11,8; 1,5 -> 9,8; 1,5 | Sava | nad
podnapis: 1 gorivo, 2 kontrolne palice, 3 voda, 4 uparjalnik, 5 turbina, 6 generator, 7 kondenzator
:::

1. **Gorivo** so tablete uranovega oksida v kovinskih ceveh, gorivnih palicah. Uran je obogaten: namesto $0{,}7\,\%$ urana-235 ga je okoli $4\,\%$.
2. **Moderator** je voda. Hitri nevtroni v trkih z vodikovimi jedri izgubijo hitrost, počasni pa veliko lažje razcepijo uran-235.
3. **Kontrolne palice** iz srebra, indija in kadmija nevtrone **vpijajo**, ne upočasnjujejo. Vodi dodajo tudi borovo kislino; bor-10 prav tako vpija nevtrone. Tako držijo $k = 1$.
4. **Hladilo** je ista voda. V primarnem krogu ima okoli $300\,\mathrm{^\circ C}$ in tlak $155\,\mathrm{bar}$, zato ne zavre.
5. **Parni krog.** V uparjalniku primarna voda skozi stene cevi upari vodo sekundarnega kroga. Para žene turbino in generator, v kondenzatorju jo ohladi voda iz Save. Radioaktivna primarna voda turbine nikoli ne doseže.

Le okoli tretjina toplote postane električna energija; ostanek odnese hladilna voda.

:::premisli
Operater potisne kontrolne palice globlje v sredico. Kaj se zgodi s faktorjem $k$ in z močjo reaktorja?
---
Palice vpijejo več nevtronov, zato $k$ pade pod $1$ in število cepitev z vsako generacijo upada. Moč pada. Ko jih potisnejo do konca, se verižna reakcija ustavi.
:::

## Rešeni primeri

### Primer 1: bor v kontrolnem sistemu

Bor-10 ujame nevtron: ${}^{10}_{5}\mathrm{B} + {}^{1}_{0}\mathrm{n} \rightarrow {}^{7}_{3}\mathrm{Li} + \mathrm{X}$. Kateri delec je $\mathrm{X}$? Koliko energije se sprosti? Računaj na dva načina.

**Podatki:** $M(\mathrm{B}) = 10{,}012937\,\mathrm{u}$; $m_\mathrm{n} = 1{,}008665\,\mathrm{u}$; $M(\mathrm{Li}) = 7{,}016003\,\mathrm{u}$; $M(\mathrm{He}) = 4{,}002603\,\mathrm{u}$; $1\,\mathrm{u} = 1{,}66054\cdot10^{-27}\,\mathrm{kg}$; $c = 3{,}00\cdot10^{8}\,\mathrm{m/s}$
**Iščemo:** delec $\mathrm{X}$ in reakcijsko energijo $W_\mathrm{r}$

:::formula
Ohranitev $A$ in $Z$; $\Delta m = m_\mathrm{pred} - m_\mathrm{po}$; $W_\mathrm{r} = \Delta m \cdot 931{,}5\,\mathrm{MeV/u}$ ali $W_\mathrm{r} = \Delta m \, c^2$
:::

**Rešitev:**

1. Nukleoni: $10 + 1 = 7 + A$, torej $A = 4$.
2. Naboj: $5 + 0 = 3 + Z$, torej $Z = 2$. Element z $Z = 2$ je helij, $\mathrm{X} = {}^{4}_{2}\mathrm{He}$, delec alfa.
3. Mase seštejemo na vsaki strani, pred reakcijo $M(\mathrm{B}) + m_\mathrm{n}$, po njej $M(\mathrm{Li}) + M(\mathrm{He})$:

   $$m_\mathrm{pred} = 11{,}021602\,\mathrm{u}$$

   $$m_\mathrm{po} = 11{,}018606\,\mathrm{u}$$

4. Masa pred je večja, zato se energija sprosti:

   $$\Delta m = 0{,}002996\,\mathrm{u}$$

5. Prvi način, z enoto u:

   $$W_\mathrm{r} = 0{,}002996 \cdot 931{,}5\,\mathrm{MeV}$$

   $$W_\mathrm{r} = 2{,}79\,\mathrm{MeV}$$

6. Drugi način: $\Delta m$ pomnožimo z $1{,}66054\cdot10^{-27}\,\mathrm{kg/u}$, nato s $c^2$:

   $$\Delta m = 4{,}975\cdot10^{-30}\,\mathrm{kg}$$

   $$W_\mathrm{r} = \Delta m \, c^2 = 4{,}48\cdot10^{-13}\,\mathrm{J}$$

   To je $2{,}80\,\mathrm{MeV}$; majhna razlika je le zaradi zaokroženega $c$.
7. Odgovor: delec $\mathrm{X}$ je delec alfa; sprosti se okoli $2{,}8\,\mathrm{MeV}$. Nevtron pri tem izgine, zato bor dobro duši verižno reakcijo.

### Primer 2: detektor dima v kuhinji

V detektorju dima nad štedilnikom je americij-241, ki razpada z razpadom alfa v neptunij-237. Kolikšna je reakcijska energija? Koliko dobi delec alfa, koliko odrinjeno jedro?

**Podatki:** $M(\mathrm{Am}) = 241{,}056829\,\mathrm{u}$; $M(\mathrm{Np}) = 237{,}048173\,\mathrm{u}$; $M(\mathrm{He}) = 4{,}002603\,\mathrm{u}$; jedro americija pred razpadom miruje
**Iščemo:** $W_\mathrm{r}$, kinetično energijo delca alfa $W_\alpha$ in jedra $W_\mathrm{Np}$

:::formula
$W_\mathrm{r} = \Delta m \cdot 931{,}5\,\mathrm{MeV/u}$; ohranitev gibalne količine: $p_\alpha = p_\mathrm{Np}$, zato $W_\alpha = W_\mathrm{r} \cdot \dfrac{m_\mathrm{Np}}{m_\mathrm{Np} + m_\alpha}$
:::

**Rešitev:**

1. Zapis: ${}^{241}_{95}\mathrm{Am} \rightarrow {}^{237}_{93}\mathrm{Np} + {}^{4}_{2}\mathrm{He}$; $241 = 237 + 4$ in $95 = 93 + 2$.
2. Elektronov je levo 95, desno $93 + 2$, zato smemo odšteti atomske mase. Masa po razpadu je $M(\mathrm{Np}) + M(\mathrm{He})$:

   $$m_\mathrm{po} = 241{,}050776\,\mathrm{u}$$

   $$\Delta m = 0{,}006053\,\mathrm{u}$$

3. Reakcijska energija:

   $$W_\mathrm{r} = 0{,}006053 \cdot 931{,}5\,\mathrm{MeV}$$

   $$W_\mathrm{r} = 5{,}64\,\mathrm{MeV}$$
4. Gibalni količini sta enako veliki, zato se energija razdeli obratno sorazmerno z masama. Za maso vzamemo kar masni števili.
5. Delež delca alfa je $237/241$, delež jedra $4/241$:

   $$W_\alpha = 5{,}638\,\mathrm{MeV} \cdot \frac{237}{241}$$

   $$W_\alpha = 5{,}54\,\mathrm{MeV}$$

   $$W_\mathrm{Np} = 5{,}638\,\mathrm{MeV} \cdot \frac{4}{241}$$

   $$W_\mathrm{Np} = 0{,}094\,\mathrm{MeV}$$
6. Odgovor: sprosti se $5{,}64\,\mathrm{MeV}$; delec alfa odnese $5{,}54\,\mathrm{MeV}$, jedro neptunija le $0{,}09\,\mathrm{MeV}$. (Večina izmerjenih delcev alfa ima $5{,}49\,\mathrm{MeV}$, ker jedro neptunija ostane vzbujeno in razliko odda kot foton gama.)

### Primer 3: koliko urana za lonec testenin

Pri cepitvi ${}^{235}_{92}\mathrm{U} + {}^{1}_{0}\mathrm{n} \rightarrow {}^{141}_{56}\mathrm{Ba} + {}^{92}_{36}\mathrm{Kr} + 3\,{}^{1}_{0}\mathrm{n}$ se sprosti energija. Koliko urana-235 bi bilo treba razcepiti, da segrejemo $2\,\mathrm{L}$ vode za testenine z $20\,\mathrm{^\circ C}$ do vrelišča? Predpostavi, da gre vsa energija v vodo.

**Podatki:** $M(\mathrm{U}) = 235{,}043930\,\mathrm{u}$; $m_\mathrm{n} = 1{,}008665\,\mathrm{u}$; $M(\mathrm{Ba}) = 140{,}914403\,\mathrm{u}$; $M(\mathrm{Kr}) = 91{,}926173\,\mathrm{u}$; $m_\mathrm{v} = 2\,\mathrm{kg}$; $c_\mathrm{v} = 4200\,\mathrm{J/(kg\,K)}$; $\Delta T = 80\,\mathrm{K}$; $1\,\mathrm{MeV} = 1{,}602\cdot10^{-13}\,\mathrm{J}$; $1\,\mathrm{u} = 1{,}66054\cdot10^{-27}\,\mathrm{kg}$
**Iščemo:** maso urana-235 $m_\mathrm{U}$

:::formula
$W_\mathrm{r} = \Delta m \cdot 931{,}5\,\mathrm{MeV/u}$; $Q = m_\mathrm{v} c_\mathrm{v} \Delta T$; $N = \dfrac{Q}{W_\mathrm{r}}$; $m_\mathrm{U} = N \cdot m_1$
:::

**Rešitev:**

1. Pred cepitvijo sta uran in nevtron. Po njej so barij, kripton in **trije** nevtroni, ti imajo $3 \cdot 1{,}008665 = 3{,}025995$ (v u).
2. Vsota mas na vsaki strani in razlika:

   $$m_\mathrm{pred} = 236{,}052595\,\mathrm{u}$$

   $$m_\mathrm{po} = 235{,}866571\,\mathrm{u}$$

   $$\Delta m = 0{,}186024\,\mathrm{u}$$

3. Energija ene cepitve v MeV, nato v joulih (krat $1{,}602\cdot10^{-13}\,\mathrm{J/MeV}$):

   $$W_\mathrm{r} = 0{,}186024 \cdot 931{,}5\,\mathrm{MeV}$$

   $$W_\mathrm{r} = 173{,}3\,\mathrm{MeV}$$

   $$W_\mathrm{r} = 2{,}776\cdot10^{-11}\,\mathrm{J}$$

4. Toplota za vodo:

   $$Q = 2 \cdot 4200 \cdot 80\,\mathrm{J}$$

   $$Q = 672\,000\,\mathrm{J}$$

5. Število cepitev:

   $$N = \frac{672\,000\,\mathrm{J}}{2{,}776\cdot10^{-11}\,\mathrm{J}}$$

   $$N = 2{,}42\cdot10^{16}$$

6. En atom ima $235{,}04\,\mathrm{u}$; v kilogramih in nato za vseh $N$ atomov ($m_\mathrm{U} = N \cdot m_1$):

   $$m_1 = 3{,}903\cdot10^{-25}\,\mathrm{kg}$$

   $$m_\mathrm{U} = 9{,}4\cdot10^{-9}\,\mathrm{kg}$$
7. Odgovor: dovolj je okoli $9\,\mu\mathrm{g}$ urana-235. Zemeljskega plina (okoli $50\,\mathrm{MJ/kg}$) bi pokurili okoli $13\,\mathrm{g}$, več kot milijonkrat več.

### Primer 4: zdaj ti

Izračunaj reakcijsko energijo Rutherfordove reakcije ${}^{14}_{7}\mathrm{N} + {}^{4}_{2}\mathrm{He} \rightarrow {}^{17}_{8}\mathrm{O} + \mathrm{X}$ in povej, kaj pomeni njen predznak.

**Podatki:** $M(\mathrm{N}) = 14{,}003074\,\mathrm{u}$; $M(\mathrm{He}) = 4{,}002603\,\mathrm{u}$; $M(\mathrm{O}) = 16{,}999132\,\mathrm{u}$; $M(\mathrm{H}) = 1{,}007825\,\mathrm{u}$
**Iščemo:** delec $\mathrm{X}$ in $W_\mathrm{r}$

:::formula
$\Delta m = m_\mathrm{pred} - m_\mathrm{po}$; $W_\mathrm{r} = \Delta m \cdot 931{,}5\,\mathrm{MeV/u}$
:::

**Rešitev:**

1. $A$: $14 + 4 = 17 + 1$; $Z$: $7 + 2 = 8 + 1$. $\mathrm{X} = {}^{1}_{1}\mathrm{H}$, proton.
2. Pred reakcijo sta dušik in helij, po njej kisik in vodik:

   $$m_\mathrm{pred} = 18{,}005677\,\mathrm{u}$$

   $$m_\mathrm{po} = 18{,}006957\,\mathrm{u}$$
3. Izračunaj $\Delta m$ in $W_\mathrm{r}$ sam, nato preveri:

:::premisli
Koliko je $W_\mathrm{r}$ in kaj pove predznak?
---
Masa po je večja:

$$\Delta m = -0{,}001280\,\mathrm{u}$$

Krat $931{,}5\,\mathrm{MeV/u}$:

$$W_\mathrm{r} = -1{,}19\,\mathrm{MeV}$$

Produkti so težji od začetnih delcev, zato se energija ne sprosti, ampak porabi. Delec alfa mora prinesti vsaj $1{,}19\,\mathrm{MeV}$ kinetične energije (zaradi odboja v resnici še nekaj več).
:::

## Pogoste napake

- **Masna števila namesto mas.** »$\Delta m = 241 - 237 - 4 = 0$, torej se nič ne sprosti.« Masna števila se vedno ujemajo. Energija je skrita v majhnih razlikah natančnih mas, zato računaj z masami v u na šest decimalk.
- **Pozabljen delec.** Pri cepitvi kdo odšteje le en nevtron ali pozabi vpadnega. Pred računom zapiši vse delce in preveri $A$ in $Z$.
- **»Ohrani se masa« ali »ohrani se število protonov«.** Ohranita se število nukleonov in naboj. Masa se spremeni za $\Delta m$, pri razpadu $\beta^-$ pa nastane nov proton.
- **Moderator in kontrolne palice zamenjaš.** Moderator (voda) nevtrone upočasni in s tem reakcijo omogoči. Kontrolne palice in bor nevtrone vpijejo in reakcijo dušijo.
- **Elektron dvakrat pri razpadu $\beta^-$.** Z atomskimi masami je $\Delta m = M(\text{starš}) - M(\text{hči})$; atomska masa hčerinskega atoma izsevani elektron že vsebuje, zato ga ne odštevaj še enkrat.

## Povzetek

- **Jedrska reakcija z obstreljevanjem**: delec zadene jedro, nastanejo nova jedra.
- **Ohranijo se** število nukleonov ($A$), naboj ($Z$), energija in gibalna količina; neznani delec najdeš iz $A$ in $Z$ ter periodnega sistema.
- **Reakcijska energija** iz razlike mas:
$$W_\mathrm{r} = \Delta m \, c^2$$
- $1\,\mathrm{u}$ ustreza $931{,}5\,\mathrm{MeV}$; $\Delta m > 0$ energijo sprosti, $\Delta m < 0$ jo porabi.
- **Odboj pri razpadu alfa**: gibalni količini sta enaki, lažji delec alfa dobi skoraj vso energijo.
- **Faktor množenja** $k$: $k < 1$ ugaša, $k = 1$ reaktor, $k > 1$ plaz; kritična masa da $k = 1$.
- **Reaktor**: gorivo (obogateni uran), moderator (voda upočasni nevtrone), kontrolne palice (vpijejo nevtrone), hladilo; NEK: primarni krog pod tlakom, uparjalnik, turbina, kondenzator s Savo.

## Drugače: Na sliki

Verižna reakcija pri dveh vrednostih $k$:

:::risba skica
opis: Dve verigi cepitev. Zgoraj, za k = 1, štiri jedra v vrsti, vsaka cepitev s puščico sproži natanko eno naslednjo. Spodaj, za k = 2, eno jedro sproži dve, ti dve sprožita štiri, nato sledi 8, 16 in tako naprej.
območje: 0; 0 .. 12; 7
enota: 24
napis: 0,2; 6,6 | k = 1 (reaktor) | desno
krog: 1,5; 5,7 | 0,35 | modra polno
krog: 4,5; 5,7 | 0,35 | modra polno
krog: 7,5; 5,7 | 0,35 | modra polno
krog: 10,5; 5,7 | 0,35 | modra polno
puščica: 1,9; 5,7 -> 4,1; 5,7
puščica: 4,9; 5,7 -> 7,1; 5,7
puščica: 7,9; 5,7 -> 10,1; 5,7
napis: 0,2; 4,4 | k = 2 (plaz) | desno
krog: 1,5; 2,3 | 0,35 | oranžna polno
krog: 4,5; 3,3 | 0,35 | oranžna polno
krog: 4,5; 1,3 | 0,35 | oranžna polno
krog: 7,5; 3,8 | 0,35 | oranžna polno
krog: 7,5; 2,8 | 0,35 | oranžna polno
krog: 7,5; 1,8 | 0,35 | oranžna polno
krog: 7,5; 0,8 | 0,35 | oranžna polno
puščica: 1,9; 2,4 -> 4,1; 3,2
puščica: 1,9; 2,2 -> 4,1; 1,4
puščica: 4,9; 3,4 -> 7,1; 3,8
puščica: 4,9; 3,2 -> 7,1; 2,8
puščica: 4,9; 1,4 -> 7,1; 1,8
puščica: 4,9; 1,2 -> 7,1; 0,9
napis: 10,2; 2,3 | 8, 16, … | sredina
:::

Zgoraj vsaka cepitev sproži natanko eno novo: moč je stalna. Spodaj se število cepitev v vsaki generaciji podvoji, generacija pa traja manj kot tisočinko sekunde. Kontrolne palice in bor »odrežejo« odvečne puščice, da ostane zgornja slika.

## Drugače: Iz vsakdanjega življenja

- **Recept in ohranitev $A$ in $Z$.** Iz dveh jajc ne nastanejo tri. Tudi v jedru se »sestavine« (nukleoni in naboj) le prerazporedijo, zato iz zapisa najdeš manjkajoči delec.
- **Lonec na pritisk.** V njem voda ne zavre pri $100\,\mathrm{^\circ C}$. V primarnem krogu NEK je tlak $155\,\mathrm{bar}$, zato voda ostane tekoča pri okoli $300\,\mathrm{^\circ C}$. Tu je imel Tilen prav, pri »gorenju« urana pa ne.

## Preveri se

? Katera trditev o jedrski reakciji je pravilna?
- Masa začetnih delcev je vedno enaka masi produktov.
~ To velja v kuhinji, ne v jedru. Razlika mas je ravno reakcijska energija, deljena s $c^2$.
- Število protonov je levo in desno vedno enako.
~ Ohrani se naboj, ne število protonov: pri razpadu $\beta^-$ nastane nov proton, a tudi elektron z nabojem $-1$.
+ Vsota masnih števil in vsota vrstnih števil sta levo in desno enaki.
- Vsaka jedrska reakcija sprosti energijo.
~ Če so produkti težji, je $\Delta m < 0$ in reakcija energijo porabi, kot Rutherfordova ($-1{,}19\,\mathrm{MeV}$).
> Ohranita se število nukleonov in naboj (pa tudi energija in gibalna količina); masa se spremeni za $\Delta m$.

? Maja je izračunala energijo razpada alfa polonija-210: ${}^{210}_{84}\mathrm{Po} \rightarrow {}^{206}_{82}\mathrm{Pb} + {}^{4}_{2}\mathrm{He}$. **Korak 1:** preverila je $210 = 206 + 4$ in $84 = 82 + 2$. **Korak 2:** $\Delta m = 210 - 206 - 4 = 0$. **Korak 3:** sklepala je, da se pri razpadu ne sprosti nič energije. Kje je napaka?
- V koraku 1.
~ Korak 1 je pravilen: tako preveriš ohranitev nukleonov in naboja.
+ V koraku 2.
- V koraku 3.
~ Sklep sledi iz koraka 2; napačen je zato, ker je napačen $\Delta m$, ne sam sklep.
- Nikjer, polonij res ne sprosti energije.
~ Polonij-210 je močan sevalec alfa; energija pride iz razlike natančnih mas, ne masnih števil.
> Masna števila se zaradi ohranitve nukleonov vedno ujemajo. Vzeti je treba atomske mase v u: $\Delta m = 0{,}005806\,\mathrm{u}$, kar da $5{,}41\,\mathrm{MeV}$.

? Kobalt-60, s katerim obsevajo tudi živila, razpade z razpadom $\beta^-$ v nikelj-60. Atomski masi sta $M(\mathrm{Co}) = 59{,}933817\,\mathrm{u}$ in $M(\mathrm{Ni}) = 59{,}930786\,\mathrm{u}$. Koliko energije se sprosti pri enem razpadu (v MeV)?
= 2,82 MeV | 0,02
~ 2,31 | Elektron si odštel dvakrat: atomska masa niklja že vsebuje elektron, ki nastane pri razpadu.
~ 0,00303 | To je $\Delta m$ v u. Pomnoži ga s $931{,}5\,\mathrm{MeV/u}$.
~ -2,82 | Odštel si v napačnem vrstnem redu: masa pred minus masa po.
> $\Delta m = 59{,}933817 - 59{,}930786 = 0{,}003031\,\mathrm{u}$, $W_\mathrm{r} = 0{,}003031 \cdot 931{,}5\,\mathrm{MeV} = 2{,}82\,\mathrm{MeV}$.

? Primerjaj kroglo urana-235 pod kritično maso in kroglo nad njo. Zakaj v manjši verižna reakcija ugasne?
- Ker pri cepitvi v manjši krogli nastane manj nevtronov.
~ Vsaka cepitev da 2 do 3 nevtrone, ne glede na velikost kosa.
+ Ker ima manjša krogla glede na prostornino več površine, zato več nevtronov uide, preden razcepi novo jedro.
- Ker manjša krogla vsebuje manj moderatorja.
~ Moderator ni del kosa urana; v čistem uranu ga ni v nobeni krogli.
- Ker so jedra v manjši krogli trdneje vezana.
~ Vezavna energija na nukleon je lastnost jedra, ne velikosti kosa.
> Pri manjši krogli je razmerje površina/prostornina večje, zato $k < 1$. Nad kritično maso uide dovolj malo nevtronov, da je $k \geq 1$.

? Ob zagonu reaktorja so izmerili število nevtronov v zaporednih generacijah (graf). Moč je dosegla želeno vrednost. Kaj naredijo operaterji?
:::risba stolpci
opis: Stolpčni graf števila nevtronov v štirih zaporednih generacijah: 1000, 1050, 1103 in 1158.
stolpec: 1. | 1000
stolpec: 2. | 1050
stolpec: 3. | 1103
stolpec: 4. | 1158
os: število nevtronov
korak: 200
:::
- Nič, ker se število nevtronov komaj spreminja in je reakcija že stalna.
~ Število narašča za $5\,\%$ na generacijo; generacije si sledijo v delčkih sekunde, zato moč hitro raste.
- Izvlečejo kontrolne palice, da upočasnijo nevtrone.
~ Kontrolne palice nevtrone vpijajo, ne upočasnjujejo; izvlečenje bi $k$ še povečalo.
+ Potisnejo kontrolne palice malo globlje, da $k$ pade s $1{,}05$ na $1$.
- Dodajo več moderatorja, da se reakcija umiri.
~ Moderator nevtrone upočasni in s tem cepitve olajša; reakcije ne duši.
> $k = \dfrac{1050}{1000} = 1{,}05 > 1$, moč raste. Globlje kontrolne palice vpijejo več nevtronov, dokler ni $k = 1$.

:::simboli
\Delta m | masni primanjkljaj reakcije | \Delta m = m_\mathrm{pred} - m_\mathrm{po} | u | ali kg; pozitiven pomeni sproščeno energijo
m_\mathrm{pred} | skupna masa delcev pred reakcijo | | u |
m_\mathrm{po} | skupna masa delcev po reakciji | | u |
W_\mathrm{r} | reakcijska energija | W_\mathrm{r} = \Delta m \, c^2 | MeV | ali J
c | hitrost svetlobe | | m/s | $3{,}00\cdot10^{8}\,\mathrm{m/s}$
k | faktor množenja | k = \frac{N_2}{N_1} | – | reaktor: $k = 1$
N_1 | število cepitev v eni generaciji | | – |
A | masno število (število nukleonov) | | – |
Z | vrstno število (naboj jedra v enotah $e$) | | – |
\bar{\nu} | antinevtrino | | – | skoraj brez mase in brez naboja
N_2 | število cepitev v naslednji generaciji | | – |
p_\alpha | gibalna količina delca alfa | | kg\,m/s |
p_\mathrm{Np} | gibalna količina odrinjenega jedra neptunija | | kg\,m/s |
W_\alpha | kinetična energija delca alfa | W_\alpha = W_\mathrm{r} \cdot \frac{m_\mathrm{Np}}{m_\mathrm{Np} + m_\alpha} | MeV |
m_\alpha | masa delca alfa | | u |
m_\mathrm{Np} | masa jedra neptunija | | u |
W | kinetična energija | W = \frac{p^2}{2m} | J |
p | gibalna količina | | kg\,m/s |
m | masa | | kg |
Q | toplota za segrevanje vode | Q = m_\mathrm{v} c_\mathrm{v} \Delta T | J |
m_\mathrm{v} | masa vode | | kg |
c_\mathrm{v} | specifična toplota vode | | J/(kg\,K) |
\Delta T | sprememba temperature | | K |
N | število cepitev | N = \frac{Q}{W_\mathrm{r}} | – |
m_\mathrm{U} | masa razcepljenega urana-235 | m_\mathrm{U} = N \cdot m_1 | kg |
m_1 | masa enega atoma urana-235 | | kg |
:::

<<RACUN
vrednost: 10.012937+1.008665-7.016003-4.002603 | 0.002996
vrednost: 0.002996*931.5 | 2.79
vrednost: 0.002996*1.66054e-27 | 4.975e-30
vrednost: 4.975e-30*(3.00e8)^2 | 4.48e-13
vrednost: 4.4775e-13/1.602e-13 | 2.795
vrednost: 241.056829-237.048173-4.002603 | 0.006053
vrednost: 0.006053*931.5 | 5.638
vrednost: 5.638*237/241 | 5.544
vrednost: 5.638*4/241 | 0.0936
vrednost: 235.043930+1.008665-140.914403-91.926173-3*1.008665 | 0.186024
vrednost: 0.186024*931.5 | 173.28
vrednost: 173.3*1.602e-13 | 2.776e-11
vrednost: 2*4200*80 | 672000
vrednost: 672000/(2.776*10^-11) | 2.421*10^16
vrednost: 235.04*1.66054*10^-27 | 3.903*10^-25
vrednost: 2.42*10^16*3.903*10^-25 | 9.445*10^-9
vrednost: 235.043930+1.008665 | 236.052595
vrednost: 140.914403+91.926173+3*1.008665 | 235.866571
vrednost: 672000/50e6 | 0.01344
vrednost: 14.003074+4.002603-16.999132-1.007825 | -0.00128
vrednost: -0.001280*931.5 | -1.192
vrednost: 14.003242-14.003074 | 0.000168
vrednost: 0.000168*931.5 | 0.1565
vrednost: 209.982874-205.974465-4.002603 | 0.005806
vrednost: 0.005806*931.5 | 5.408
vrednost: 59.933817-59.930786 | 0.003031
vrednost: 0.003031*931.5 | 2.823
vrednost: (0.003031-0.000549)*931.5 | 2.312
vrednost: 1050/1000 | 1.05
vrednost: 10.012937+1.008665 | 11.021602
vrednost: 7.016003+4.002603 | 11.018606
vrednost: 237.048173+4.002603 | 241.050776
vrednost: 241.056829-241.050776 | 0.006053
vrednost: 3*1.008665 | 3.025995
vrednost: 236.052595-235.866571 | 0.186024
vrednost: 14.003074+4.002603 | 18.005677
vrednost: 16.999132+1.007825 | 18.006957
vrednost: 18.005677-18.006957 | -0.00128
vrednost: 1.66053907e-27*299792458^2 | 1.4924e-10
>>
