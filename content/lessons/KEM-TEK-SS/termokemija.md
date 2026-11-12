---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec Žan pri malici razlaga: »Če bi vodik v raketnem motorju zgorel po ovinku, najprej v vodikov peroksid, ta pa bi nato razpadel v vodo in kisik, bi raketa dobila več toplote. Dve reakciji pomenita dvakrat toploto.«

Zveni prepričljivo, saj vodikov peroksid res uporabljajo kot raketno gorivo. A Žan se moti. Na koncu razlage boš znal to dokazati s številkami. Znal boš tudi izračunati, koliko toplote da kilogram vodika v motorju, koliko je odda razpad hidrazina v potisniku satelita in koliko toplote mora odvajati naprava, ki na vesoljski postaji iz ogljikovega dioksida dela vodo.

Na tekmovanjih so takšne naloge stalnica: podane so tri ali štiri enačbe s toplotami, iskana pa je peta.

## Razlaga

**Kaj že znaš in kaj je novo.** Termokemija je stehiometrija, ki poleg snovi šteje še energijo. Levi stolpec že znaš, desni je nov. Večina pravil je podobnih, nekaj pa je drugačnih:

| | Stehiometrija | Termokemija |
|---|---|---|
| šteješ | $n$ v mol | $Q$ v kJ |
| koeficienti | razmerje množin | $Q$ raste s $\frac{n}{\nu}$ |
| ohranja se | masa | energija |
| stanje snovi | nepomembno | para ima več energije |
| smer | nepomembna | obrat: drug predznak |

Tu je $Q$ toplota, $\nu$ pa koeficient snovi v enačbi. Zadnji dve vrstici sta največja razlika, zato ju bomo vzeli posebej.

**1. Reakcijska entalpija.** Vsaka snov ima neko notranjo zalogo energije. Pri stalnem tlaku ji rečemo **entalpija** $H$. Same entalpije ne moremo izmeriti, njeno spremembo pa lahko. **Reakcijska entalpija** $\Delta H$ je razlika med entalpijo produktov in entalpijo reaktantov. Pri stalnem tlaku je enaka toploti, ki jo reakcijska zmes sprejme.

Če reakcija toploto oddaja, imajo produkti manj entalpije kot reaktanti in je $\Delta H < 0$. Taka reakcija je **eksotermna**. Če toploto sprejema, je $\Delta H > 0$ in je **endotermna**.

**2. Termokemijska enačba.** To je urejena enačba z agregatnimi stanji in reakcijsko entalpijo:

$$2\,\mathrm{H_2(g)} + \mathrm{O_2(g)} \rightarrow 2\,\mathrm{H_2O(g)} \qquad \Delta H = -483{,}6\,\mathrm{kJ/mol}$$

Enota kJ/mol pomeni »na mol reakcije, kot je zapisana«: ko zreagirata $2\,\mathrm{mol}$ vodika in $1\,\mathrm{mol}$ kisika, se sprosti $483{,}6\,\mathrm{kJ}$. Tri pravila:

- Enačbo pomnožiš s številom, $\Delta H$ pomnožiš z istim številom.
- Enačbo obrneš, $\Delta H$ spremeni predznak.
- Agregatno stanje šteje: za $2\,\mathrm{H_2O(l)}$ je $\Delta H = -571{,}6\,\mathrm{kJ/mol}$, ker kondenzacija pare sprosti dodatno toploto.

:::premisli
Napovej $\Delta H$ za razkroj vodne pare $\mathrm{H_2O(g)} \rightarrow \mathrm{H_2(g)} + \frac{1}{2}\,\mathrm{O_2(g)}$.
---
$+241{,}8\,\mathrm{kJ/mol}$. Enačbo smo razpolovili (polovica od $483{,}6$) in obrnili (predznak plus). Razkroj vode je endotermen: toliko energije, kot jo da gorenje vodika, moraš vložiti, da vodo spet razstaviš.
:::

**3. Tvorbene entalpije.** **Standardna tvorbena entalpija** $\Delta H_\mathrm{f}$ je reakcijska entalpija nastanka $1\,\mathrm{mol}$ spojine iz elementov v njihovi najstabilnejši obliki pri $25\,\mathrm{°C}$ in $100\,\mathrm{kPa}$. Za elemente v tej obliki ($\mathrm{H_2(g)}$, $\mathrm{O_2(g)}$, $\mathrm{N_2(g)}$, $\mathrm{C(s)}$) je po dogovoru nič. Vrednosti v kJ/mol, ki jih rabimo v tej lekciji:

| Snov | $\Delta H_\mathrm{f}$ | Snov | $\Delta H_\mathrm{f}$ |
|---|---|---|---|
| $\mathrm{H_2O(l)}$ | $-285{,}8$ | $\mathrm{CO_2(g)}$ | $-393{,}5$ |
| $\mathrm{H_2O(g)}$ | $-241{,}8$ | $\mathrm{CO(g)}$ | $-110{,}5$ |
| $\mathrm{H_2O_2(l)}$ | $-187{,}8$ | $\mathrm{CH_4(g)}$ | $-74{,}8$ |
| $\mathrm{NH_3(g)}$ | $-45{,}9$ | $\mathrm{N_2H_4(l)}$ | $+50{,}6$ |

Iz njih izračunaš reakcijsko entalpijo katerekoli reakcije med temi snovmi:

$$\Delta H = \sum \nu\,\Delta H_\mathrm{f}(\mathrm{produkti}) - \sum \nu\,\Delta H_\mathrm{f}(\mathrm{reaktanti})$$

Tu je $\nu$ koeficient snovi v enačbi. Vrstni red je vedno »produkti minus reaktanti«, tako kot pri vsaki spremembi: končno minus začetno.

**4. Hessov zakon.** Entalpija je **veličina stanja**: odvisna je samo od tega, katere snovi imaš in v kakšnem stanju, ne od tega, kako so nastale. Podobno je pri plinu: $p$, $V$ in $T$ ti povedo vse o njem, ne glede na to, kako si ga stisnil ali segrel. Zato velja **Hessov zakon**: če reakcijo razstaviš na več korakov, je vsota njihovih reakcijskih entalpij enaka entalpiji neposredne reakcije.

$$\Delta H = \Delta H_1 + \Delta H_2$$

Zdaj lahko presodimo Žanovo trditev. Pot prek peroksida ima dva koraka. Prvi je tvorba peroksida $\mathrm{H_2 + O_2 \rightarrow H_2O_2(l)}$, njegova $\Delta H$ je v tabeli. Drugi je razpad $\mathrm{H_2O_2(l) \rightarrow H_2O(l) + \frac{1}{2}\,O_2}$ z $\Delta H = -98{,}0\,\mathrm{kJ/mol}$:

:::risba skica
opis: Entalpijski diagram. Zgoraj je raven H₂ + O₂ pri 0 kJ/mol. Levo puščica naravnost navzdol do ravni H₂O(l) + ½ O₂ pri −285,8 kJ/mol. Desno pot v dveh korakih: najprej navzdol do H₂O₂(l) pri −187,8 kJ/mol, nato še za −98,0 kJ/mol do iste spodnje ravni.
območje: 0; 0 .. 10; 8
enota: 30
črta: 0,5; 7 -> 5; 7 | modra debelo
črta: 3,5; 3,24 -> 9,5; 3,24 | oranžna debelo
črta: 0,5; 1,28 -> 9,5; 1,28 | zelena debelo
napis: 2,7; 7 | H_2 + O_2 | nad
napis: 7,5; 3,24 | H_2O_2(l) | nad
napis: 5; 1,28 | H_2O(l) + 1/2 O_2 | pod
puščica: 1,5; 7 -> 1,5; 1,28 | −285,8 | desno | modra
puščica: 4,2; 7 -> 4,2; 3,24 | −187,8 | desno | oranžna
puščica: 7; 3,24 -> 7; 1,28 | −98,0 | desno | zelena
podnapis: Ena pot ali dve: skupni padec entalpije je enak.
:::

$$\Delta H = -187{,}8 - 98{,}0 = -285{,}8\,\mathrm{kJ/mol}$$

Natanko toliko kot neposredno gorenje v tekočo vodo. Ovinek ne prinese niti kilojoula več, saj začetek in konec ostaneta enaka. Žan ni upošteval, da prvi korak sprosti manj toplote kot neposredna pot.

V simulaciji spodaj »Hessov zakon« izberi nastanek dušikovega dioksida. Prvi korak je endotermen (puščica gre gor), drugi eksotermen. Opazi, da je skupna puščica vseeno točno vsota obeh, z ustreznima predznakoma.

:::premisli
Iz šob raketnega motorja uhaja vodna para, ne tekoča voda. Zakaj raketa zato na mol vodika dobi $241{,}8\,\mathrm{kJ}$ in ne $285{,}8\,\mathrm{kJ}$?
---
Razlika $44{,}0\,\mathrm{kJ/mol}$ se sprosti šele, ko para kondenzira. To se zgodi daleč za raketo, ko je izpuh že odletel, zato te toplote motor ne izkoristi. Končno stanje je drugačno, torej je drugačna tudi $\Delta H$.
:::

**Strategija za naloge s Hessovim zakonom.** (1) Poišči v danih enačbah vsako snov iz iskane enačbe in preveri, na kateri strani je. (2) Enačbo po potrebi obrni in pomnoži, da bo snov na pravi strani s pravim koeficientom. (3) Enačbe seštej: vmesne snovi se pokrajšajo. (4) Enako kot z enačbami naredi z njihovimi $\Delta H$.

**5. Kalorimetrija.** Reakcijsko entalpijo izmerimo v **kalorimetru**, toplotno izolirani posodi, v kateri reakcija segreje vodo. Toplota, ki jo sprejme voda, je

$$Q = m\,c\,\Delta T$$

kjer je $c = 4{,}18\,\mathrm{J/(g \cdot K)}$ specifična toplota vode. Če se $100\,\mathrm{g}$ vode segreje za $5{,}0\,\mathrm{K}$, sprejme $Q = 100 \cdot 4{,}18 \cdot 5{,}0 = 2090\,\mathrm{J}$. Reakcija je to toploto oddala, zato ima njena entalpija nasproten predznak. Delimo še z množino $n$ zreagirane snovi, da dobimo vrednost na mol:

$$\Delta H = -\frac{Q}{n}$$

Pri **bombnem kalorimetru** gorivo zgori v jekleni posodi s kisikom, ki je potopljena v vodo. Celoten kalorimeter (voda in jeklo) ima **toplotno kapaciteto** $C_\mathrm{kal}$, ki jo določijo prej s snovjo z znano toploto gorenja. Potem velja $Q = C_\mathrm{kal}\,\Delta T$.

## Rešeni primeri

### Primer 1 (lažji): glavni motorji raketoplana

Glavni motorji raketoplana so sežigali tekoči vodik s tekočim kisikom. Koliko toplote se sprosti, ko zgori $1{,}000\,\mathrm{kg}$ vodika v vodno paro? Računaj s termokemijsko enačbo za plinasta reaktanta; toplota za uparitev tekočega vodika in kisika je v primerjavi s toploto gorenja majhna.

**Podatki:** $m(\mathrm{H_2}) = 1{,}000\,\mathrm{kg} = 1000\,\mathrm{g}$; $M(\mathrm{H_2}) = 2{,}016\,\mathrm{g/mol}$; $2\,\mathrm{H_2(g)} + \mathrm{O_2(g)} \rightarrow 2\,\mathrm{H_2O(g)}$; $\Delta H = -483{,}6\,\mathrm{kJ/mol}$; $\nu(\mathrm{H_2}) = 2$
**Iščemo:** sproščeno toploto $Q$

:::formula
$n = \dfrac{m}{M}$, nato $Q = \dfrac{n}{\nu}\,|\Delta H|$
:::

**Rešitev:**

1. Množina vodika: $n = \dfrac{1000\,\mathrm{g}}{2{,}016\,\mathrm{g/mol}} = 496{,}0\,\mathrm{mol}$.
2. Delimo s koeficientom, ker $\Delta H$ velja za $2\,\mathrm{mol}$ vodika: $\dfrac{n}{\nu} = \dfrac{496{,}0}{2} = 248{,}0\,\mathrm{mol}$.
3. $Q = 248{,}0 \cdot 483{,}6 = 119\,932{,}8$, torej $Q \approx 1{,}20 \cdot 10^5\,\mathrm{kJ}$.
4. Odgovor: zgorevanje kilograma vodika sprosti približno $120\,\mathrm{MJ}$ toplote.

### Primer 2: potisnik satelita

Majhni potisniki satelitov uporabljajo hidrazin. Na katalizatorju razpade brez kisika: $3\,\mathrm{N_2H_4(l)} \rightarrow 4\,\mathrm{NH_3(g)} + \mathrm{N_2(g)}$. Izračunaj reakcijsko entalpijo in toploto na mol hidrazina.

**Podatki:** $\Delta H_\mathrm{f}(\mathrm{N_2H_4, l}) = +50{,}6\,\mathrm{kJ/mol}$, $\Delta H_\mathrm{f}(\mathrm{NH_3, g}) = -45{,}9\,\mathrm{kJ/mol}$, $\Delta H_\mathrm{f}(\mathrm{N_2, g}) = 0$
**Iščemo:** $\Delta H$ in toploto na mol $\mathrm{N_2H_4}$

:::formula
$\Delta H = \sum \nu\,\Delta H_\mathrm{f}(\mathrm{produkti}) - \sum \nu\,\Delta H_\mathrm{f}(\mathrm{reaktanti})$
:::

**Rešitev:**

1. Produkti: $4 \cdot (-45{,}9) + 0 = -183{,}6\,\mathrm{kJ/mol}$. Dušik je element, zato prispeva nič.
2. Reaktanti: $3 \cdot 50{,}6 = 151{,}8\,\mathrm{kJ/mol}$.
3. Produkti minus reaktanti: $\Delta H = -183{,}6 - 151{,}8 = -335{,}4\,\mathrm{kJ/mol}$.
4. Ta vrednost velja za $3\,\mathrm{mol}$ hidrazina: $\dfrac{-335{,}4}{3} = -111{,}8\,\mathrm{kJ}$ na mol.
5. Odgovor: razpad je eksotermen, $\Delta H = -335{,}4\,\mathrm{kJ/mol}$, kar je $111{,}8\,\mathrm{kJ}$ toplote na mol hidrazina. Hidrazin ima pozitivno tvorbeno entalpijo, zato že sam razpad sprosti energijo.

### Primer 3 (težji): voda iz izdihanega zraka

Na Mednarodni vesoljski postaji Sabatierjev reaktor iz $\mathrm{CO_2}$, ki ga izdihajo astronavti, in vodika naredi metan in vodo: $\mathrm{CO_2(g)} + 4\,\mathrm{H_2(g)} \rightarrow \mathrm{CH_4(g)} + 2\,\mathrm{H_2O(g)}$. Iz danih enačb izračunaj $\Delta H$. Koliko toplote mora hladilni sistem odvesti, če reaktor predela $1{,}000\,\mathrm{kg}$ $\mathrm{CO_2}$?

**Podatki:**
(1) $\mathrm{H_2(g)} + \frac{1}{2}\,\mathrm{O_2(g)} \rightarrow \mathrm{H_2O(g)}$, $\Delta H_1 = -241{,}8\,\mathrm{kJ/mol}$
(2) $\mathrm{CH_4(g)} + 2\,\mathrm{O_2(g)} \rightarrow \mathrm{CO_2(g)} + 2\,\mathrm{H_2O(g)}$, $\Delta H_2 = -802{,}3\,\mathrm{kJ/mol}$
$m(\mathrm{CO_2}) = 1000\,\mathrm{g}$, $M(\mathrm{CO_2}) = 44{,}01\,\mathrm{g/mol}$
**Iščemo:** $\Delta H$ Sabatierjeve reakcije in odvedeno toploto $Q$

:::formula
Hessov zakon: $\Delta H = 4\,\Delta H_1 - \Delta H_2$, nato $Q = n\,|\Delta H|$
:::

**Rešitev:**

1. $\mathrm{CO_2}$ mora biti na levi, v (2) pa je na desni. Enačbo (2) zato obrnemo: $+802{,}3\,\mathrm{kJ/mol}$.
2. Na levi potrebujemo $4\,\mathrm{H_2}$, zato (1) pomnožimo s 4: $4 \cdot (-241{,}8) = -967{,}2\,\mathrm{kJ/mol}$.
3. Seštejemo: $4\,\mathrm{H_2} + 2\,\mathrm{O_2} + \mathrm{CO_2} + 2\,\mathrm{H_2O} \rightarrow 4\,\mathrm{H_2O} + \mathrm{CH_4} + 2\,\mathrm{O_2}$. Kisik in dve molekuli vode se pokrajšajo, ostane iskana enačba.
4. $\Delta H = -967{,}2 + 802{,}3 = -164{,}9\,\mathrm{kJ/mol}$.
5. Množina: $n(\mathrm{CO_2}) = \dfrac{1000}{44{,}01} = 22{,}72\,\mathrm{mol}$. Koeficient $\mathrm{CO_2}$ je 1, zato je to tudi množina reakcije.
6. $Q = 22{,}72 \cdot 164{,}9 = 3746{,}5\,\mathrm{kJ}$.
7. Odgovor: reakcija je eksotermna, $\Delta H = -164{,}9\,\mathrm{kJ/mol}$; za kilogram $\mathrm{CO_2}$ mora hladilni sistem odvesti približno $3{,}75\,\mathrm{MJ}$.

### Primer 4: zdaj ti

Prve velike rakete so kot gorivo uporabljale etanol. V bombnem kalorimetru s toplotno kapaciteto $C_\mathrm{kal} = 10{,}00\,\mathrm{kJ/K}$ zgori $1{,}000\,\mathrm{g}$ etanola $\mathrm{C_2H_5OH}$, temperatura naraste za $2{,}970\,\mathrm{K}$. Kolikšna je entalpija gorenja etanola? Razliko med toploto pri stalni prostornini in pri stalnem tlaku tu zanemari.

**Podatki:** $C_\mathrm{kal} = 10{,}00\,\mathrm{kJ/K}$, $m = 1{,}000\,\mathrm{g}$, $\Delta T = 2{,}970\,\mathrm{K}$, $M(\mathrm{C_2H_5OH}) = 46{,}07\,\mathrm{g/mol}$
**Iščemo:** entalpijo gorenja $\Delta H$ na mol etanola

:::formula
$Q = C_\mathrm{kal}\,\Delta T$, $n = \dfrac{m}{M}$, $\Delta H = -\dfrac{Q}{n}$
:::

**Rešitev:**

1. Kalorimeter je sprejel $Q = 10{,}00 \cdot 2{,}970 = 29{,}70\,\mathrm{kJ}$.
2. Množina etanola: $n = \dfrac{1{,}000}{46{,}07} = 0{,}02171\,\mathrm{mol}$.
3. Zdaj izračunaj sam $\Delta H$ in pazi na predznak.

:::premisli
Koliko je $\Delta H$?
---
$\Delta H = -\dfrac{29{,}70\,\mathrm{kJ}}{0{,}02171\,\mathrm{mol}} \approx -1368\,\mathrm{kJ/mol}$. Predznak je minus, ker se je kalorimeter segrel: reakcija je toploto oddala.
:::

## Pogoste napake

- **Obrnjena enačba, isti predznak.** Kdor obrne enačbo in pusti $\Delta H$ negativen, trdi, da tudi razkroj vode sprosti toploto. To bi bil vir energije iz nič. Ob obratu vedno spremeni predznak.
- **Pozabljen koeficient.** Pri tvorbenih entalpijah učenec sešteje $\Delta H_\mathrm{f}$ brez množenja z $\nu$, ker so vrednosti v tabeli »na mol«. Tabela velja za $1\,\mathrm{mol}$ snovi, v enačbi pa jih je lahko več. Vsako vrednost pomnoži s koeficientom.
- **Reaktanti minus produkti ali seštevanje vsega.** Sprememba je vedno »končno minus začetno«, torej produkti minus reaktanti. Elementi v osnovni obliki ($\mathrm{O_2}$, $\mathrm{N_2}$) imajo $\Delta H_\mathrm{f} = 0$, zato jih ni treba iskati v tabeli.
- **Agregatno stanje ni pomembno.** $\mathrm{H_2O(l)}$ in $\mathrm{H_2O(g)}$ se razlikujeta za $44{,}0\,\mathrm{kJ/mol}$. Preden vzameš vrednost iz tabele, preveri oznako (l) ali (g).
- **Predznak v kalorimetriji in J namesto kJ.** Voda se segreje, torej je reakcija oddala toploto in je $\Delta H < 0$. $Q = m\,c\,\Delta T$ da rezultat v J, entalpije pa so v kJ/mol: deli s 1000.

## Povzetek

- $\Delta H$ je razlika entalpij produktov in reaktantov; eksotermna reakcija ima $\Delta H < 0$, endotermna $\Delta H > 0$.
- Termokemijska enačba velja za množine, kot so zapisane: pomnožena enačba pomnoži $\Delta H$, obrnjena spremeni predznak, agregatno stanje šteje.
- Toplota pri dani množini snovi: $Q = \frac{n}{\nu}\,|\Delta H|$.
- $\Delta H = \sum \nu\,\Delta H_\mathrm{f}$ produktov minus reaktantov; elementi v osnovni obliki imajo nič.
- Hessov zakon: entalpija je veličina stanja, zato je $\Delta H$ celotne reakcije vsota $\Delta H$ korakov.
- Kalorimetrija: $Q = m\,c\,\Delta T$ ali $Q = C_\mathrm{kal}\,\Delta T$, nato $\Delta H = -\frac{Q}{n}$.

## Drugače: Na sliki

Predstavljaj si entalpijo kot višino nadstropja v stavbi. Vsaka snov stanuje v svojem nadstropju: elementi v pritličju (nič), $\mathrm{CO_2}$ globoko v kleti ($-393{,}5$), hidrazin v prvem nadstropju ($+50{,}6$).

- Reakcija je vožnja z dvigalom iz nadstropja reaktantov v nadstropje produktov. $\Delta H$ je razlika višin.
- Vožnja navzdol je eksotermna, navzgor endotermna.
- Hessov zakon: če se pelješ z vmesnim postankom, je skupna razlika višin enaka.
- Tvorbene entalpije: vsako pot lahko speljemo prek pritličja. Iz nadstropja reaktantov se pelješ v pritličje ($-\sum \nu\,\Delta H_\mathrm{f}$ reaktantov), od tam pa v nadstropje produktov ($+\sum \nu\,\Delta H_\mathrm{f}$ produktov).

## Drugače: Iz vsakdanjega življenja

Na embalaži živil piše energijska vrednost, na primer $1500\,\mathrm{kJ}$ na $100\,\mathrm{g}$. To je toplota gorenja, kakršno merijo v bombnem kalorimetru: hrano sežgejo v kisiku in izmerijo, za koliko se segreje voda.

Telo hrane ne sežge s plamenom, ampak v dolgi verigi korakov v celicah. Kljub temu dobi iz glukoze enako energijo, kot bi jo dala v kalorimetru, saj so začetne snovi (glukoza in kisik) in končne ($\mathrm{CO_2}$ in voda) enake. To je Hessov zakon v tvojem telesu. Prav zato lahko podatek iz kalorimetra natisnejo na embalažo.

## Preveri se

? Katera trditev o reakcijski entalpiji je pravilna?
- $\Delta H$ je odvisna od poti, po kateri pridemo od reaktantov do produktov.
~ Ravno nasprotno: entalpija je veličina stanja, zato je pot nepomembna (Hessov zakon).
+ Če enačbo obrnemo, $\Delta H$ ohrani absolutno vrednost, a spremeni predznak.
- Za $\mathrm{H_2O(l)}$ in $\mathrm{H_2O(g)}$ je tvorbena entalpija enaka, ker gre za isto snov.
~ Para ima več entalpije kot tekočina; razlika je $44{,}0\,\mathrm{kJ/mol}$.
- Če enačbo pomnožimo z 2, ostane $\Delta H$ enaka, ker je enota kJ/mol.
~ kJ/mol pomeni »na mol reakcije, kot je zapisana«. Podvojena enačba opisuje dvakrat več snovi, zato je $\Delta H$ dvakrat večja.
> Obrnjena reakcija je pot nazaj med istima stanjema: enaka razlika entalpij, nasproten predznak.

? Gorenje do vodne pare: $\Delta H(\mathrm{H_2}) = -241{,}8\,\mathrm{kJ/mol}$ za $\mathrm{H_2 + \frac{1}{2}O_2 \rightarrow H_2O}$, $\Delta H(\mathrm{CH_4}) = -802{,}3\,\mathrm{kJ/mol}$ za $\mathrm{CH_4 + 2\,O_2 \rightarrow CO_2 + 2\,H_2O}$. $M(\mathrm{H_2}) = 2{,}016\,\mathrm{g/mol}$, $M(\mathrm{CH_4}) = 16{,}04\,\mathrm{g/mol}$. Primerjaj gorivi.
- Metan da več toplote na mol in na gram.
~ Na gram moraš deliti z molsko maso: vodik je zelo lahek, zato ga je v gramu veliko molov.
- Vodik da več toplote na mol in na gram.
~ Na mol da metan več ($802{,}3$ proti $241{,}8\,\mathrm{kJ}$), saj zgori v več produktov.
+ Metan da več toplote na mol, vodik pa na gram.
- Na gram dasta enako, ker oba zgorita do vode.
~ Ogljik v metanu doda maso; na gram dobiš $50{,}0\,\mathrm{kJ}$ pri metanu in $119{,}9\,\mathrm{kJ}$ pri vodiku.
> Na gram: vodik $\frac{241{,}8}{2{,}016} = 119{,}9\,\mathrm{kJ/g}$, metan $\frac{802{,}3}{16{,}04} = 50{,}0\,\mathrm{kJ/g}$. Zato rakete, kjer šteje vsak kilogram, rade uporabljajo vodik.

? Rešitev za gorenje hidrazina $\mathrm{N_2H_4(l) + O_2(g) \rightarrow N_2(g) + 2\,H_2O(g)}$ ima napako. V katerem koraku? Podatki: $\Delta H_\mathrm{f}(\mathrm{N_2H_4}) = +50{,}6$, $\Delta H_\mathrm{f}(\mathrm{H_2O, g}) = -241{,}8\,\mathrm{kJ/mol}$.
Korak 1: produkti $2 \cdot (-241{,}8) + 0 = -483{,}6$. Korak 2: reaktanti $50{,}6 + 0 = 50{,}6$. Korak 3: $\Delta H = -483{,}6 + 50{,}6 = -433{,}0\,\mathrm{kJ/mol}$.
- V 1. koraku: $\mathrm{N_2}$ ne prispeva nič.
~ Dušik je element v osnovni obliki, zato je njegova tvorbena entalpija res nič. Korak je pravilen.
- V 2. koraku: kisik bi moral imeti tvorbeno entalpijo.
~ Tudi $\mathrm{O_2}$ je element v osnovni obliki, njegov prispevek je nič.
+ V 3. koraku: reaktante je treba odšteti, ne prišteti.
- Rešitev je pravilna.
~ Seštevanje produktov in reaktantov je napaka: sprememba je končno minus začetno.
> Pravilno je $\Delta H = -483{,}6 - 50{,}6 = -534{,}2\,\mathrm{kJ/mol}$.

? Naprava MOXIE na roverju na Marsu dela kisik iz ogljikovega dioksida: $2\,\mathrm{CO_2(g)} \rightarrow 2\,\mathrm{CO(g)} + \mathrm{O_2(g)}$. Iz diagrama odčitaj $\Delta H$ te reakcije v kJ/mol.
:::risba skica
opis: Entalpijski diagram s tremi ravnmi. Zgoraj C(s) + O₂ pri 0 kJ/mol, v sredini CO(g) + ½ O₂ pri −110,5 kJ/mol, spodaj CO₂(g) pri −393,5 kJ/mol. Vse vrednosti veljajo za 1 mol ogljika.
območje: 0; 0 .. 10; 8,5
enota: 30
črta: 3; 7,5 -> 8; 7,5 | siva debelo
črta: 3; 5,66 -> 8; 5,66 | oranžna debelo
črta: 3; 0,94 -> 8; 0,94 | modra debelo
napis: 5,5; 7,5 | C(s) + O_2 | nad
napis: 5,5; 5,66 | CO(g) + 1/2 O_2 | nad
napis: 5,5; 0,94 | CO_2(g) | nad
napis: 2,8; 7,5 | 0 | levo
napis: 2,8; 5,66 | −110,5 | levo
napis: 2,8; 0,94 | −393,5 | levo
napis: 0,3; 8,2 | H v kJ/mol | desno
:::
= 566 kJ/mol | 1
~ -566 | Reakcija gre iz spodnje ravni ($\mathrm{CO_2}$) navzgor, zato je endotermna in ima pozitiven predznak.
~ 283 | To je razlika za 1 mol $\mathrm{CO_2}$. V enačbi sta 2 mol, zato vrednost podvoji.
~ -283 | Pozabil si podvojiti in obrniti predznak: pot navzgor je endotermna.
~ 393,5 | To je razlika do elementov, ne do $\mathrm{CO}$.
> Za 1 mol: $-110{,}5 - (-393{,}5) = +283{,}0\,\mathrm{kJ/mol}$. Za 2 mol $\mathrm{CO_2}$: $+566\,\mathrm{kJ/mol}$. Zato MOXIE potrebuje veliko električne energije.

? Samogrelni obrok vsebuje magnezij, ki z vodo reagira: $\mathrm{Mg(s) + 2\,H_2O(l) \rightarrow Mg(OH)_2(s) + H_2(g)}$, $\Delta H = -352{,}9\,\mathrm{kJ/mol}$. Koliko gramov magnezija ($M = 24{,}31\,\mathrm{g/mol}$) potrebuješ, da $250\,\mathrm{g}$ hrane segreješ za $60\,\mathrm{K}$? Hrana ima $c = 4{,}18\,\mathrm{J/(g \cdot K)}$, izgube zanemari.
= 4,32 g | 0,05
~ 0,178 | To je množina magnezija v mol. Pomnoži še z molsko maso.
~ 4319 | $Q$ je bil v J, entalpija pa v kJ/mol. Pred deljenjem pretvori $62\,700\,\mathrm{J} = 62{,}7\,\mathrm{kJ}$.
> $Q = 250 \cdot 4{,}18 \cdot 60 = 62\,700\,\mathrm{J} = 62{,}7\,\mathrm{kJ}$; $n = \frac{62{,}7}{352{,}9} = 0{,}1777\,\mathrm{mol}$; $m = 0{,}1777 \cdot 24{,}31 = 4{,}32\,\mathrm{g}$.

<<RACUN
kemija: 2 H2 + O2 -> 2 H2O
kemija: H2 + O2 -> H2O2
kemija: 2 H2O2 -> 2 H2O + O2
kemija: 3 N2H4 -> 4 NH3 + N2
kemija: CH4 + 2 O2 -> CO2 + 2 H2O
kemija: CO2 + 4 H2 -> CH4 + 2 H2O
kemija: C2H5OH + 3 O2 -> 2 CO2 + 3 H2O
kemija: N2H4 + O2 -> N2 + 2 H2O
kemija: 2 CO2 -> 2 CO + O2
kemija: Mg + 2 H2O -> Mg(OH)2 + H2
molska: H2 | 2.016
molska: CO2 | 44.01
molska: C2H5OH | 46.07
molska: CH4 | 16.04
vrednost: -187.8-98.0 | -285.8
vrednost: -285.8-(-241.8) | -44.0
vrednost: 1000/2.016 | 496.0
vrednost: 1000/2.016/2*483.6 | 1.20e5
vrednost: 4*(-45.9)-3*50.6 | -335.4
vrednost: (4*(-45.9)-3*50.6)/3 | -111.8
vrednost: 4*(-241.8)+802.3 | -164.9
vrednost: -74.8+2*(-241.8)-(-393.5) | -164.9
vrednost: 1000/44.01*164.9 | ≈3747
vrednost: 100*4.18*5.0 | 2090
vrednost: 10.00*2.970 | 29.70
vrednost: -29.70/(1.000/46.07) | ≈-1368
vrednost: 241.8/2.016 | 119.9
vrednost: 802.3/16.04 | 50.0
vrednost: 2*(-241.8)-50.6 | -534.2
vrednost: 2*(-110.5)-2*(-393.5) | 566
vrednost: 250*4.18*60/1000/352.9*24.31 | 4.32
>>

:::simboli
\Delta H | reakcijska entalpija | \Delta H = -\frac{Q}{n} | kJ/mol | na mol reakcije, kot je zapisana
\Delta H_\mathrm{f} | standardna tvorbena entalpija | | kJ/mol | za elemente v osnovni obliki nič
\nu | koeficient snovi v enačbi | | – |
\Delta H_1, \Delta H_2 | reakcijski entalpiji posameznih korakov | | kJ/mol |
Q | toplota | Q = m\,c\,\Delta T | kJ | ali J pri $Q = m\,c\,\Delta T$
m | masa | m = n\,M | g |
c | specifična toplota | | J/(g\cdot K) | za vodo $4{,}18$
\Delta T | sprememba temperature | | K | enaka v K in °C
n | množina snovi | n = \frac{m}{M} | mol |
M | molska masa | | g/mol |
C_\mathrm{kal} | toplotna kapaciteta kalorimetra | C_\mathrm{kal} = \frac{Q}{\Delta T} | kJ/K |
:::
