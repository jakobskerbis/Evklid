---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na bateriji tvojega telefona piše $4000\,\mathrm{mAh}$ in $3{,}85\,\mathrm{V}$. To je približno $55\,\mathrm{kJ}$ energije, dovolj za dan brskanja in sporočil. Glavni motorji raket, ki so vozile astronavte v vesolje, so dobivali energijo iz reakcije vodika s kisikom. Koliko vodika bi moral tak motor sežgati, da bi sprostil toliko energije, kot je je v tvoji polni bateriji? Kilogram? Gram?

Odgovor je presenetljivo majhen in ga boš izračunal sam v zadnjem primeru. Za to moraš vedeti, kako kemik zapiše, koliko toplote reakcija odda ali sprejme. Isto znanje uporabljajo inženirji pri izbiri raketnega goriva, pri hladilnih oblogah za športne poškodbe in pri grelcih za roke.

## Razlaga

Snov gradimo po delih. Za vsakim delom je kratko vprašanje, s katerim preveriš, ali ga razumeš.

**1. Sistem in okolica.** Snovi, ki reagirajo, imenujemo **sistem**. Vse drugo (epruveta, zrak, tvoja roka) je **okolica**. Med reakcijo lahko energija prehaja med sistemom in okolico, najpogosteje kot **toplota**.

**Preveri:** Ko gori vžigalica, kaj je sistem? *Odgovor: snovi na glavici in les, ki gorijo, ter kisik, ki z njimi reagira.*

**2. Eksotermne reakcije.** Reakcija, pri kateri sistem **odda** toploto okolici, je **eksotermna** (grško *ekso* = ven). Okolica se segreje. Tak je vsak ogenj, pa tudi nevtralizacija kisline z bazo in reakcija vodika s kisikom v raketnem motorju.

**Preveri:** Pri reakciji v čaši se čaša segreje. Ali je reakcija eksotermna? *Odgovor: da, toplota je šla iz sistema v čašo.*

**3. Endotermne reakcije.** Reakcija, pri kateri sistem **sprejme** toploto iz okolice, je **endotermna** (*endo* = noter). Če ji energije ne dovajamo, se okolica ohladi. Hladilna obloga za prvo pomoč vsebuje amonijev nitrat. Ko oblogo stisneš, se sol v njej raztopi v vodi in obloga postane ledeno mrzla. Endotermen je tudi razkroj apnenca, ki ga moramo močno segrevati.

**Preveri:** Kaj se zgodi s temperaturo vode, v kateri poteka endotermna reakcija? *Odgovor: zniža se, ker voda odda toploto sistemu.*

:::premisli
Gorenje vžigalice je eksotermno. Zakaj jo moraš vseeno podrgniti ob škatlico, preden zagori?
---
Reakcija se mora najprej »zagnati«: delci morajo dobiti dovolj energije, da se stare vezi začnejo trgati. To je **aktivacijska energija**. Trenje jo dovede, potem pa sproščena toplota sama poganja nadaljnje gorenje. Ali je reakcija eksotermna, je neodvisno od tega, ali potrebuje vžig.
:::

**4. Entalpija.** Vsaka snov ima v sebi shranjeno energijo, ki jo pri stalnem tlaku imenujemo **entalpija** $H$. Same entalpije ne moremo izmeriti, lahko pa izmerimo njeno **spremembo** med reakcijo. To je **reakcijska entalpija** $\Delta H$:

$$\Delta H = H(\text{produkti}) - H(\text{reaktanti})$$

Pri eksotermni reakciji imajo produkti manj entalpije kot reaktanti, razlika je šla v okolico. Zato je $\Delta H < 0$. Pri endotermni reakciji imajo produkti več entalpije, zato je $\Delta H > 0$. Predznak torej opisuje sistem: minus pomeni, da je sistem energijo izgubil.

:::risba skica
opis: Dva energijska diagrama. Višje na sliki pomeni večjo entalpijo H. Levo eksotermna reakcija: reaktanti so zgoraj, produkti spodaj, puščica ΔH kaže navzdol, ΔH je manjši od nič. Desno endotermna reakcija: reaktanti so spodaj, produkti zgoraj, puščica ΔH kaže navzgor, ΔH je večji od nič.
območje: 0; 0 .. 10; 6
enota: 30
napis: 2,5; 5,6 | eksotermna | sredina | debelo
napis: 7,5; 5,6 | endotermna | sredina | debelo
črta: 0,5; 4,5 -> 2; 4,5 | modra
napis: 1,25; 4,5 | reaktanti | nad
črta: 2; 4,5 -> 3,75; 4,5 | črtkano
črta: 3; 1,5 -> 4,5; 1,5 | oranžna
napis: 3,75; 1,5 | produkti | pod
puščica: 3,75; 4,5 -> 3,75; 1,6 | ΔH < 0 | levo | rdeča
črta: 5,5; 1,5 -> 7; 1,5 | modra
napis: 6,25; 1,5 | reaktanti | pod
črta: 7; 1,5 -> 8,75; 1,5 | črtkano
črta: 8; 4,5 -> 9,5; 4,5 | oranžna
napis: 8,75; 4,5 | produkti | nad
puščica: 8,75; 1,5 -> 8,75; 4,4 | ΔH > 0 | levo | zelena
:::

**Preveri:** Za razkroj apnenca je $\Delta H = +178\,\mathrm{kJ}$. Ali so produkti na diagramu višje ali nižje od reaktantov? *Odgovor: višje, ker je $\Delta H$ pozitiven.*

**5. Termokemijska enačba.** Urejeno enačbo z agregatnimi stanji in z $\Delta H$ imenujemo **termokemijska enačba**. Na primer gorenje vodika v raketnem motorju, kjer nastaja vodna para:

$$\mathrm{2\,H_2(g) + O_2(g) \rightarrow 2\,H_2O(g)}$$

pri čemer je $\Delta H = -484\,\mathrm{kJ}$. Ta vrednost velja za **množine, ki jih kažejo koeficienti**: ko zgorita $2\,\mathrm{mol}$ vodika in $1\,\mathrm{mol}$ kisika, se sprosti $484\,\mathrm{kJ}$. Če zgori dvakrat toliko, se sprosti dvakrat toliko toplote. Toploto $Q$ za poljubno množino $n$ snovi, ki ima v enačbi koeficient $\nu$ (grška črka »ni«), dobiš tako:

$$Q = \frac{n}{\nu} \cdot |\Delta H|$$

Količnik $\frac{n}{\nu}$ že poznaš iz stehiometrije. Pove, »kolikokrat« je reakcija potekla v primerjavi z enačbo.

**Preveri:** Koliko toplote se sprosti, ko zgori $4\,\mathrm{mol}$ vodika? *Odgovor: $Q = \frac{4}{2} \cdot 484\,\mathrm{kJ} = 968\,\mathrm{kJ}$.*

:::premisli
Na mednarodni vesoljski postaji iz tekoče vode z elektrolizo pridobivajo kisik za dihanje: $\mathrm{2\,H_2O(l) \rightarrow 2\,H_2(g) + O_2(g)}$. Za nastanek **tekoče** vode iz vodika in kisika je $\Delta H = -572\,\mathrm{kJ}$ (več kot pri pari, ker se sprosti še toplota utekočinjenja). Napovej $\Delta H$ za elektrolizo in pojasni.
---
$\Delta H = +572\,\mathrm{kJ}$. Obratna reakcija ima enako velik $\Delta H$ z nasprotnim predznakom. Če bi razkroj vode potreboval manj energije, kot se je sprosti pri njenem nastanku, bi s krogom »razkroj, nato gorenje« dobivali energijo iz nič.
:::

**6. Od kod energija: vezi.** Pri reakciji se vezi v reaktantih trgajo, v produktih pa nastajajo nove. Za **trganje** vezi je energijo treba **dovesti**, pri **nastanku** vezi se energija **sprosti**. Če nove vezi skupaj sprostijo več, kot so stale pretrgane, je reakcija eksotermna. Če manj, je endotermna.

**Preveri:** Ali se pri trganju vezi energija sprošča? *Odgovor: ne, porabi se. Sprošča se pri nastajanju vezi.*

V simulaciji spodaj, »Reakcijska entalpija in aktivacijska energija«, izberi najprej gorenje metana, nato razkroj apnenca. Opazuj, v katero smer kaže puščica $\Delta H$ in kakšen predznak ima. Nato vklopi katalizator (snov, ki reakcijo pospeši): »hrib« aktivacijske energije (energije za zagon, kot pri vžigalici) se zniža, $\Delta H$ pa ostane enak.

## Rešeni primeri

### Primer 1: hladilna obloga

V hladilni oblogi je $40\,\mathrm{g}$ amonijevega nitrata. Ob raztapljanju poteče:

$$\mathrm{NH_4NO_3(s) \rightarrow NH_4^+(aq) + NO_3^-(aq)}$$

pri čemer je $\Delta H = +26\,\mathrm{kJ}$. Ali je proces eksotermen ali endotermen in koliko toplote sprejme iz okolice?

**Podatki:** $m(\mathrm{NH_4NO_3}) = 40\,\mathrm{g}$, $M(\mathrm{NH_4NO_3}) = 80\,\mathrm{g/mol}$, $\Delta H = +26\,\mathrm{kJ}$, $\nu = 1$
**Iščemo:** vrsto procesa in toploto $Q$

:::formula
$n = \dfrac{m}{M}$, nato $Q = \dfrac{n}{\nu} \cdot |\Delta H|$
:::

**Rešitev:**

1. $\Delta H$ je pozitiven, zato je proces endotermen: sistem toploto sprejme.
2. Množina: $n = \dfrac{40\,\mathrm{g}}{80\,\mathrm{g/mol}} = 0{,}5\,\mathrm{mol}$.
3. Toplota: $Q = \dfrac{0{,}5}{1} \cdot 26\,\mathrm{kJ} = 13\,\mathrm{kJ}$.
4. Odgovor: raztapljanje je endotermno. Obloga vzame okolici, torej tudi poškodovanemu gležnju, $13\,\mathrm{kJ}$ toplote, zato hladi.

### Primer 2: kilogram raketnega goriva

Raketni motor sežge $1\,\mathrm{kg}$ vodika. Koliko toplote se sprosti?

$$\mathrm{2\,H_2(g) + O_2(g) \rightarrow 2\,H_2O(g)}$$

**Podatki:** $m(\mathrm{H_2}) = 1\,\mathrm{kg} = 1000\,\mathrm{g}$, $M(\mathrm{H_2}) = 2{,}0\,\mathrm{g/mol}$, $\Delta H = -484\,\mathrm{kJ}$, $\nu(\mathrm{H_2}) = 2$
**Iščemo:** sproščeno toploto $Q$

:::formula
$n = \dfrac{m}{M}$, nato $Q = \dfrac{n}{\nu} \cdot |\Delta H|$
:::

**Rešitev:**

1. Masa v gramih, ker je molska masa v g/mol: $n(\mathrm{H_2}) = \dfrac{1000\,\mathrm{g}}{2{,}0\,\mathrm{g/mol}} = 500\,\mathrm{mol}$.
2. Vodik ima v enačbi koeficient $2$, zato reakcija poteče $\dfrac{500}{2} = 250$-krat.
3. $Q = 250 \cdot 484\,\mathrm{kJ} = 121\,000\,\mathrm{kJ}$.
4. Odgovor: sprosti se $121\,000\,\mathrm{kJ}$ ($121\,\mathrm{MJ}$) toplote. Negativni $\Delta H$ pomeni, da se ta energija sprosti. Najprej močno segreje nastalo vodno paro, ki nato z veliko hitrostjo izteka iz šobe in potiska raketo.

### Primer 3: kisik za astronavta

Astronavt na vesoljski postaji porabi na dan $840\,\mathrm{g}$ kisika. Kisik pridobivajo z elektrolizo vode. Za nastanek tekoče vode $\mathrm{2\,H_2(g) + O_2(g) \rightarrow 2\,H_2O(l)}$ je $\Delta H = -572\,\mathrm{kJ}$. Koliko energije je najmanj treba dovesti na dan za kisik enega astronavta?

**Podatki:** $m(\mathrm{O_2}) = 840\,\mathrm{g}$, $M(\mathrm{O_2}) = 32\,\mathrm{g/mol}$, za nastanek vode $\Delta H = -572\,\mathrm{kJ}$
**Iščemo:** dovedeno energijo $Q$ za elektrolizo

:::formula
Obrnjena enačba ima nasprotni predznak $\Delta H$, nato $n = \dfrac{m}{M}$ in $Q = \dfrac{n}{\nu} \cdot |\Delta H|$
:::

**Rešitev:**

1. Elektroliza je obratna reakcija: $\mathrm{2\,H_2O(l) \rightarrow 2\,H_2(g) + O_2(g)}$, zato je $\Delta H = +572\,\mathrm{kJ}$. Reakcija je endotermna, energijo ji dajo sončne celice postaje.
2. Množina kisika: $n(\mathrm{O_2}) = \dfrac{840\,\mathrm{g}}{32\,\mathrm{g/mol}} = 26{,}25\,\mathrm{mol}$.
3. Kisik ima v tej enačbi koeficient $1$: $Q = 26{,}25 \cdot 572\,\mathrm{kJ} = 15\,015\,\mathrm{kJ}$.
4. Odgovor: na dan je treba dovesti vsaj okoli $15\,000\,\mathrm{kJ}$ ($15\,\mathrm{MJ}$). V resnici več, ker naprava del energije izgubi kot toploto.

### Primer 4: zdaj ti

Vrnimo se k vprašanju iz uvoda. Koliko gramov vodika mora zgoreti v raketnem motorju, da se sprosti $55\,\mathrm{kJ}$, toliko kot je energije v bateriji telefona?

**Podatki:** $Q = 55\,\mathrm{kJ}$, $\Delta H = -484\,\mathrm{kJ}$ za $\mathrm{2\,H_2(g) + O_2(g) \rightarrow 2\,H_2O(g)}$, $\nu(\mathrm{H_2}) = 2$, $M(\mathrm{H_2}) = 2{,}0\,\mathrm{g/mol}$
**Iščemo:** maso $m(\mathrm{H_2})$

:::formula
$n = \dfrac{\nu \cdot Q}{|\Delta H|}$, nato $m = n \cdot M$
:::

**Rešitev:**

1. Iz $Q = \dfrac{n}{\nu} \cdot |\Delta H|$ izrazimo množino: $n = \dfrac{\nu \cdot Q}{|\Delta H|}$.
2. Vstavi podatke, izračunaj $n$, nato še maso. Preveri:

:::premisli
Koliko je $n(\mathrm{H_2})$ in koliko $m(\mathrm{H_2})$?
---
$n = \dfrac{2 \cdot 55}{484}\,\mathrm{mol} \approx 0{,}227\,\mathrm{mol}$ in $m = 0{,}227\,\mathrm{mol} \cdot 2{,}0\,\mathrm{g/mol} \approx 0{,}45\,\mathrm{g}$. Manj kot pol grama vodika sprosti toliko energije kot polna baterija telefona.
:::

## Pogoste napake

- **»Toplota se sprosti, torej je $\Delta H$ pozitiven.«** Predznak opisuje sistem, ne okolice. Sistem je energijo izgubil, zato je pri eksotermni reakciji $\Delta H < 0$. Minus pomeni »odšlo iz sistema«.
- **»Endotermna reakcija oddaja mraz.«** Mraz ni snov, ki bi tekla. Okolica se ohladi, ker reakcija iz nje **vzame** toploto. Pravilno: pri endotermni reakciji toplota teče iz okolice v sistem.
- **$\Delta H$ ne glede na množino.** $\Delta H = -484\,\mathrm{kJ}$ velja za $2\,\mathrm{mol}$ vodika, kot kaže koeficient. Kdor vzame $484\,\mathrm{kJ}$ za vsak mol vodika, dobi dvakrat preveč toplote. Vedno upoštevaj $\dfrac{n}{\nu}$.
- **»Eksotermna reakcija steče sama od sebe.«** Metan v štedilniku ne zagori brez iskre, čeprav je gorenje eksotermno. Vžig dovede aktivacijsko energijo. $\Delta H$ pove, koliko energije se na koncu sprosti, ne pa, ali reakcija sploh začne.
- **»Ko se vez pretrga, se sprosti energija.«** Ravno obratno: trganje vezi energijo porabi. Energija goriva se sprosti, ker nastanejo nove, močnejše vezi v $\mathrm{CO_2}$ in $\mathrm{H_2O}$.

## Povzetek

- Sistem so snovi, ki reagirajo; okolica je vse drugo. Energija med njima prehaja kot toplota.
- Eksotermna reakcija toploto odda, okolica se segreje, $\Delta H < 0$. Endotermna toploto sprejme, okolica se ohladi, $\Delta H > 0$.
- Reakcijska entalpija: $\Delta H = H(\text{produkti}) - H(\text{reaktanti})$.
- $\Delta H$ v termokemijski enačbi velja za množine, ki jih kažejo koeficienti. Toplota za množino $n$: $Q = \dfrac{n}{\nu} \cdot |\Delta H|$.
- Obratna reakcija ima nasprotni predznak $\Delta H$.
- Trganje vezi energijo porabi, nastanek vezi jo sprosti; od razlike je odvisen predznak $\Delta H$.
- Aktivacijska energija je potrebna za začetek reakcije in ni isto kot $\Delta H$.

## Drugače: Na sliki

Reakcijo vodika s kisikom si zamisli kot energijski račun v dveh korakih. Najprej je treba pretrgati vse vezi v $2\,\mathrm{mol}$ $\mathrm{H_2}$ in v $1\,\mathrm{mol}$ $\mathrm{O_2}$. Potem nastanejo vezi $\mathrm{O{-}H}$ v $2\,\mathrm{mol}$ vode, v vsaki molekuli dve.

:::risba stolpci
opis: Stolpčni prikaz energije pri reakciji 2 H₂ + O₂ v 2 H₂O. Stolpec »trganje vezi« je visok 1370 kJ, stolpec »nastanek vezi« pa 1852 kJ.
podnapis: Energija vezi pri gorenju vodika (vodna para)
os: energija v kJ
korak: 400
stolpec: trganje vezi | 1370
stolpec: nastanek vezi | 1852
:::

Desni stolpec je višji: nove vezi sprostijo za okoli $480\,\mathrm{kJ}$ več, kot so stale stare. Ta presežek odide v okolico, zato je reakcija eksotermna. Pri endotermni reakciji bi bil višji levi stolpec, razliko bi morala dati okolica.

Energijski diagram iz razlage pove isto drugače: reaktanti so »na polici«, produkti »na tleh«. Ko kamen pade s police, odda energijo. Da pa sploh pade, ga moraš najprej malo dvigniti čez rob. To je aktivacijska energija.

## Drugače: Bolj natančno

Entalpija je določena tako, da je pri **stalnem tlaku** $\Delta H$ natanko enaka toploti, ki jo sistem izmenja z okolico. Večina reakcij v odprti posodi in v ozračju poteka pri stalnem tlaku, zato je $\Delta H$ praktična mera.

Agregatno stanje šteje. Za nastanek **tekoče** vode je $\Delta H = -572\,\mathrm{kJ}$, za nastanek **vodne pare** $-484\,\mathrm{kJ}$. Razlika $88\,\mathrm{kJ}$ je toplota, ki se sprosti, ko se $2\,\mathrm{mol}$ pare utekočinita. Zato v termokemijski enačbi vedno pišemo $\mathrm{(s)}$, $\mathrm{(l)}$, $\mathrm{(g)}$ ali $\mathrm{(aq)}$.

Iz povprečnih energij vezi ($\mathrm{H{-}H}$ $436\,\mathrm{kJ/mol}$, $\mathrm{O{=}O}$ $498\,\mathrm{kJ/mol}$, $\mathrm{O{-}H}$ $463\,\mathrm{kJ/mol}$) oceniš $\Delta H \approx 1370\,\mathrm{kJ} - 1852\,\mathrm{kJ} = -482\,\mathrm{kJ}$, kar se lepo ujema z izmerjeno vrednostjo za paro. Ocena je le približna, ker so energije vezi povprečja iz različnih molekul.

V tabelah je reakcijska entalpija pogosto podana v $\mathrm{kJ/mol}$, kar pomeni »na mol reakcije«, torej za množine iz enačbe. Pogosto je označena tudi s $\Delta H^\circ$ (standardna reakcijska entalpija), ko velja pri standardnih pogojih.

## Preveri se

? Apnenec razpade le, če ga močno segrevamo: $\mathrm{CaCO_3(s) \rightarrow CaO(s) + CO_2(g)}$, $\Delta H = +178\,\mathrm{kJ}$. Kateri opis energijskega diagrama ustreza tej reakciji?
- Produkti so nižje od reaktantov, puščica $\Delta H$ kaže navzdol.
~ Tak diagram ima eksotermna reakcija z negativnim $\Delta H$. Tu je $\Delta H$ pozitiven.
+ Produkti so višje od reaktantov, puščica $\Delta H$ kaže navzgor.
- Produkti in reaktanti so na isti višini, ker se masa pri reakciji ohrani.
~ Ohrani se masa, entalpija pa se spremeni. Prav ta sprememba je $\Delta H$.
> Pozitiven $\Delta H$ pomeni, da imajo produkti več entalpije kot reaktanti. Na diagramu so višje, puščica kaže navzgor.

? Pri gorenju $1\,\mathrm{mol}$ metana se sprosti $890\,\mathrm{kJ}$. Približno koliko toplote da $1\,\mathrm{kg}$ metana ($M = 16\,\mathrm{g/mol}$)?
- Približno $900\,\mathrm{kJ}$.
~ $890\,\mathrm{kJ}$ velja za en mol, ne za vsako maso. Kilogram metana je veliko molov.
- Približno $14\,000\,\mathrm{kJ}$.
~ Tu je $890$ pomnoženo z molsko maso $16$. Množino dobiš z deljenjem: $1000 : 16$.
- Približno $890\,000\,\mathrm{kJ}$.
~ Vsak gram tu šteje kot en mol. Mol metana ima $16\,\mathrm{g}$, zato je molov $16$-krat manj.
+ Približno $56\,000\,\mathrm{kJ}$.
> $n = \dfrac{1000\,\mathrm{g}}{16\,\mathrm{g/mol}} \approx 62{,}5\,\mathrm{mol}$, $Q \approx 62{,}5 \cdot 890\,\mathrm{kJ} \approx 56\,000\,\mathrm{kJ}$.

? Zakaj postane hladilna obloga z amonijevim nitratom mrzla?
- Ker se pri raztapljanju sprošča mraz.
~ Mraz ni snov ali energija, ki bi se sproščala. Ohladitev pomeni, da je toplota odtekla.
- Ker je raztapljanje eksotermno.
~ Pri eksotermnem procesu bi se obloga segrela, kot pri grelcu za roke.
+ Ker raztapljanje toploto sprejme iz okolice, ki se zato ohladi.
- Ker se pri raztapljanju trgajo vezi in pri tem se sprošča energija.
~ Trganje vezi energijo porabi, ne sprošča.
> Raztapljanje amonijevega nitrata je endotermno ($\Delta H > 0$). Toplota teče iz vode in kože v sistem, zato je obloga mrzla.

? Pri $\mathrm{2\,H_2(g) + O_2(g) \rightarrow 2\,H_2O(g)}$ je $\Delta H = -484\,\mathrm{kJ}$. Pri preskusu raketnega motorja se je sprostilo $121\,\mathrm{kJ}$. Koliko molov vodika je zgorelo?
- $0{,}25\,\mathrm{mol}$
~ Tu je $484\,\mathrm{kJ}$ vzeto za en mol vodika. Velja pa za $2\,\mathrm{mol}$, kot kaže koeficient.
- $4\,\mathrm{mol}$
~ To je $484 : 121$, količnik je obrnjen. Sprostilo se je manj kot $484\,\mathrm{kJ}$, torej je zgorelo manj kot $2\,\mathrm{mol}$.
+ $0{,}5\,\mathrm{mol}$
> $n = \dfrac{\nu \cdot Q}{|\Delta H|} = \dfrac{2 \cdot 121}{484}\,\mathrm{mol} = 0{,}5\,\mathrm{mol}$.

? Samogrevalna konzerva za planince greje z reakcijo $\mathrm{CaO(s) + H_2O(l) \rightarrow Ca(OH)_2(s)}$, $\Delta H = -65\,\mathrm{kJ}$. Koliko gramov kalcijevega oksida ($M = 56\,\mathrm{g/mol}$) potrebuješ za $130\,\mathrm{kJ}$ toplote?
- $56\,\mathrm{g}$
~ To je en mol, ki da le $65\,\mathrm{kJ}$. Za dvakrat več toplote potrebuješ dva mola.
- $28\,\mathrm{g}$
~ Tu je razmerje obrnjeno ($65 : 130$). Več toplote zahteva več snovi, ne manj.
- $2\,\mathrm{g}$
~ $2$ je množina v molih, ne masa. Pomnožiti jo moraš z molsko maso.
+ $112\,\mathrm{g}$
> $n = \dfrac{130}{65}\,\mathrm{mol} = 2\,\mathrm{mol}$, $m = 2\,\mathrm{mol} \cdot 56\,\mathrm{g/mol} = 112\,\mathrm{g}$.

:::simboli
\Delta H | reakcijska entalpija | \Delta H = H(\text{produkti}) - H(\text{reaktanti}) | kJ | velja za množine iz enačbe; $< 0$ eksotermna
H | entalpija (energija, shranjena v snovi) | | kJ
Q | toplota, ki jo reakcija odda ali sprejme | Q = \frac{n}{\nu} \cdot \lvert \Delta H \rvert | kJ
n | množina snovi | n = \frac{m}{M} | mol
\nu | koeficient snovi v enačbi | | – | npr. $2$ pri $\mathrm{2\,H_2}$
m | masa | m = n \cdot M | g
M | molska masa | M = \frac{m}{n} | g/mol
:::
