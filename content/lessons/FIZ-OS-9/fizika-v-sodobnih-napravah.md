---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na poletnem festivalu odpreš zemljevid na telefonu. Modra pika natančno pokaže, pred katerim odrom stojiš. Sateliti GPS pa sploh ne vedo, da obstajaš: tvoj telefon jim ne pošlje niti enega signala. Kako potem ve, kje je?

Odgovor poznaš z vsakega koncerta na prostem. Kdor stoji daleč od odra, sliši boben malo pozneje, kot vidi udarec. Iz te zamude lahko izračunaš, kako daleč je oder, ne da bi bobnarju karkoli poslal.

Na istem festivalu glasbo s plošče bere **laser**, zvočnik ob šotoru napaja **sončna celica**, del elektrike za ozvočenje pa pride iz **jedrske elektrarne**. Pri vseh štirih napravah ti pomaga znanje, ki ga že imaš: pot, hitrost in čas, električna moč in delo, magneti in tuljave.

## Razlaga

**1. Najprej en primer z zvokom.** Stojiš na travniku pred odrom. Bobnar udari po činelah, zvok slišiš $0{,}5\,\mathrm{s}$ pozneje. Svetloba pride do tebe praktično v trenutku, zvok pa potuje s hitrostjo približno $340\,\mathrm{m/s}$. Razdaljo dobiš iz zveze za enakomerno gibanje:

$$s = v \cdot t$$

$$s = 340 \cdot 0{,}5 = 170\,\mathrm{m}$$

Oder je $170\,\mathrm{m}$ daleč. Zapomni si bistvo: **iz zamude signala in njegove hitrosti izračunaš razdaljo**.

**2. Ista ideja v GPS.** Okoli Zemlje kroži več kot dvajset satelitov GPS, približno $20\,000\,\mathrm{km}$ visoko. Vsak ima izjemno natančno uro in ves čas oddaja radijski signal, ki pove: »To sem jaz, satelit številka toliko, in pri meni je ura točno toliko.« Telefon je le **sprejemnik**: signal ujame in primerja čas oddaje s časom sprejema. Razlika je zamuda $t$.

Radijski valovi ne potujejo s hitrostjo zvoka, ampak s **hitrostjo svetlobe** $c = 300\,000\,\mathrm{km/s}$. Zato je zveza enaka kot pri bobnu, le z drugo hitrostjo:

$$s = c \cdot t$$

Ena razdalja pove le, da si nekje na površju namišljene krogle s satelitom v središču. Če pozna razdalje do vsaj štirih satelitov hkrati, telefon najde edino točko, ki ustreza vsem (četrti satelit je potreben, ker ura v telefonu ni tako natančna kot satelitske). Tam je modra pika.

:::premisli
Ura na satelitu zaostaja za eno milijoninko sekunde ($0{,}000\,001\,\mathrm{s}$). Napovej: za koliko se zmoti izračunana razdalja? In koliko bi se, če bi signal potoval s hitrostjo zvoka?
---
Pri hitrosti svetlobe, $300\,000\,000\,\mathrm{m/s}$, za $300\,\mathrm{m}$, kar je dolžina celega festivalskega prostora. Pri zvoku bi bila napaka le približno tretjina milimetra. Ker je signal tako hiter, že drobna napaka v času pomeni veliko napako v razdalji. Zato imajo sateliti tako natančne ure.
:::

**3. Laser: svetloba ene barve v ozkem snopu.** Navadna žarnica seva mešanico barv na vse strani. **Laser** seva svetlobo **ene same barve**, v **ozkem snopu**, ki se tudi na veliki razdalji skoraj ne razširi. V njem svetloba potuje sem in tja med dvema zrcaloma in se pri tem krepi. Eno zrcalo malo prepušča, zato skozenj izstopi snop.

Ozek snop lahko zberemo v drobceno piko. To izkorišča predvajalnik CD. Na plošči je vzdolž spirale na milijone drobnih vdolbinic. Od gladkega dela se laserska svetloba odbije močno, ob robu vdolbinice šibko. Svetlobni senzor te spremembe prebere kot ničle in enice, iz njih pa elektronika sestavi zvok. Za razliko od gramofona se plošče ne dotika nobena igla.

Laser v predvajalniku ni močan, njegova moč je le nekaj tisočink watta. Vseeno nikoli ne glej v laserski snop: očesna leča ozek snop zbere v drobceno točko na mrežnici, kjer je vsa moč zgoščena. Tudi glasba, ki jo pretakaš, del poti prepotuje kot laserski bliski po optičnih vlaknih.

**4. Sončna celica: svetloba sprosti elektrone.** Sončna celica je tanka rezina **silicija** z dvema različno obdelanima plastema. Svetloba je sestavljena iz drobnih delčkov energije, **fotonov**. Foton, ki zadene celico, preda svojo energijo enemu elektronu in ga sprosti. Meja med plastema sproščene elektrone potiska vedno v isto smer, zato med stranema celice nastane napetost, približno $0{,}5\,\mathrm{V}$. Ko celico vežemo v krog, teče tok. Celica nima vrtečih se delov in ne potrebuje goriva, ponoči pa ne daje toka.

Pol volta je za zvočnik premalo. Zato celice vežemo **zaporedno**, kot baterije, in napetosti se seštejejo. Če je $N$ število celic in $U_1$ napetost ene celice:

$$U = N \cdot U_1$$

Dvanajst zaporedno vezanih celic da:

$$U = 12 \cdot 0{,}5 = 6\,\mathrm{V}$$

Moč panela izračunaš kot pri vsakem viru: $P = U \cdot I$.

V simulaciji spodaj »Svetloba izbija elektrone (sončna celica)« nastavi valovno dolžino na $700\,\mathrm{nm}$ (rdeča svetloba) in jakost svetlobe na največ. Nato jakost zmanjšaj skoraj na nič in valovno dolžino pomikaj proti $250\,\mathrm{nm}$ (vijolična in nevidna ultravijolična svetloba). Opazi: močna rdeča svetloba ne izbije nobenega elektrona, šibka vijolična pa ga. **Barva odloči, ali ima posamezen foton dovolj energije. Jakost pove, koliko fotonov pride.** V simulaciji svetloba izbija elektrone iz kovine; v siliciju sončne celice jih sprostijo že rdeči fotoni.

:::premisli
Sončni zvočnik prestaviš iz sence na sonce. Kaj se bolj spremeni: napetost celice ali tok? Zakaj?
---
Predvsem tok. Na soncu na celico vsako sekundo pade več fotonov, zato se sprosti več elektronov in teče večji tok. Napetost ene celice ostane približno $0{,}5\,\mathrm{V}$, saj je odvisna od snovi celice, ne od količine svetlobe.
:::

**5. Jedrska elektrarna: toplota iz jeder.** V Krškem stoji jedrska elektrarna z električno močjo približno $700\,\mathrm{MW}$. Gorivo je **uran**. Ko **nevtron**, drobni delec iz atomskega jedra, zadene jedro urana, se jedro razcepi na dva manjša dela. Pri tej **cepitvi** se sprosti veliko toplote in še dva ali trije novi nevtroni. Ti cepijo naslednja jedra: nastane **verižna reakcija**. **Nadzorne palice** vpijajo nevtrone. Globlje kot so v reaktorju, manj jeder se cepi.

Toplota segreje vodo, nastane para pod visokim tlakom. Para vrti **turbino**, ta pa **generator**. Generator deluje obratno kot elektromagnet: pri elektromagnetu tok ustvari magnetno polje, v generatorju pa vrteči se magnet ob tuljavah požene tok. Oblak nad hladilnim stolpom je vodna para, ne dim.

Izrabljeno gorivo vsebuje **radioaktivne** snovi: njihova jedra sama od sebe razpadajo in sevajo. Zato jih morajo dolgo in varno hraniti; kako razpadajo, vidiš v simulaciji spodaj »Razpad jeder (jedrsko gorivo in odpadki)«.

**6. Pregled.**

| Naprava | Kaj izkorišča | Kar že poznaš |
|---|---|---|
| GPS | zamudo radijskega signala | $s = c \cdot t$ |
| laser | eno barvo, ozek snop | odboj svetlobe |
| sončna celica | fotone, ki sprostijo elektrone | $U$, $I$, $P = U \cdot I$ |
| jedrska elektrarna | toploto iz cepitve jeder | magnet in tuljava |

## Rešeni primeri

### Primer 1: sončni zvočnik

Panel na prenosnem zvočniku daje napetost $6\,\mathrm{V}$ in tok $0{,}5\,\mathrm{A}$. Kolikšna je njegova moč? Ali zadošča za zvočnik, ki porabi $2{,}5\,\mathrm{W}$?

**Podatki:** $U = 6\,\mathrm{V}$, $I = 0{,}5\,\mathrm{A}$, poraba zvočnika $2{,}5\,\mathrm{W}$
**Iščemo:** moč panela $P$

:::formula
$P = U \cdot I$
:::

**Rešitev:**

1. Enoti sta brez predpon (V in A), zato kar vstavimo: $P = 6\,\mathrm{V} \cdot 0{,}5\,\mathrm{A} = 3\,\mathrm{W}$.
2. Odgovor: panel ima moč $3\,\mathrm{W}$, kar je več kot $2{,}5\,\mathrm{W}$, zato na soncu zadošča za zvočnik.

### Primer 2: razdalja do satelita

Telefon ugotovi, da je signal satelita GPS potoval $0{,}07\,\mathrm{s}$. Kako daleč je satelit?

**Podatki:** $t = 0{,}07\,\mathrm{s}$, $c = 300\,000\,\mathrm{km/s}$
**Iščemo:** razdaljo $s$

:::formula
$s = c \cdot t$
:::

**Rešitev:**

1. Signal je radijski val, zato vzamemo hitrost svetlobe, ne zvoka.
2. Hitrost je v $\mathrm{km/s}$, čas v $\mathrm{s}$, zato bo razdalja v $\mathrm{km}$: $s = 300\,000\,\mathrm{km/s} \cdot 0{,}07\,\mathrm{s} = 21\,000\,\mathrm{km}$.
3. Smiselno: sateliti so približno $20\,000\,\mathrm{km}$ visoko, ta ni naravnost nad telefonom, ampak malo postrani, zato je nekoliko dlje.
4. Odgovor: satelit je približno $21\,000\,\mathrm{km}$ daleč.

### Primer 3: koncert na sončni pogon

Ozvočenje na koncertu na prostem ima moč $2{,}4\,\mathrm{kW}$ in deluje $4$ ure. Organizatorji ga želijo napajati s sončnimi paneli, ki imajo na soncu vsak moč $300\,\mathrm{W}$. Koliko panelov potrebujejo? Koliko električnega dela porabi ozvočenje v času koncerta?

**Podatki:** $P = 2{,}4\,\mathrm{kW}$, $t = 4\,\mathrm{h}$, $P_1 = 300\,\mathrm{W}$
**Iščemo:** število panelov $n$ in delo $A$

:::formula
$n = \dfrac{P}{P_1}$, nato $A = P \cdot t$
:::

**Rešitev:**

1. Moči morata biti v isti enoti: $2{,}4\,\mathrm{kW} = 2400\,\mathrm{W}$.
2. Vsak panel prispeva $300\,\mathrm{W}$, zato delimo: $n = \dfrac{2400\,\mathrm{W}}{300\,\mathrm{W}} = 8$.
3. Delo računamo v $\mathrm{kWh}$, ker sta dana $\mathrm{kW}$ in ure: $A = 2{,}4\,\mathrm{kW} \cdot 4\,\mathrm{h} = 9{,}6\,\mathrm{kWh}$.
4. Odgovor: potrebujejo $8$ panelov, ozvočenje pa porabi $9{,}6\,\mathrm{kWh}$ električnega dela.

### Primer 4: zdaj ti

Jedrska elektrarna z električno močjo $700\,\mathrm{MW}$ deluje eno uro. Za koliko koncertov bi zadostovala ta energija, če ozvočenje enega koncerta z močjo $2\,\mathrm{kW}$ deluje $5$ ur?

**Podatki:** $P_\mathrm{e} = 700\,\mathrm{MW}$, $t_\mathrm{e} = 1\,\mathrm{h}$, $P_\mathrm{k} = 2\,\mathrm{kW}$, $t_\mathrm{k} = 5\,\mathrm{h}$
**Iščemo:** število koncertov $k$

:::formula
$A = P \cdot t$, nato $k = \dfrac{A_\mathrm{e}}{A_\mathrm{k}}$
:::

**Rešitev:**

1. Obe moči zapišemo v $\mathrm{kW}$: $700\,\mathrm{MW} = 700\,000\,\mathrm{kW}$.
2. Delo elektrarne v eni uri: $A_\mathrm{e} = 700\,000\,\mathrm{kW} \cdot 1\,\mathrm{h} = 700\,000\,\mathrm{kWh}$.
3. Izračunaj sam delo ozvočenja $A_\mathrm{k}$ in nato število koncertov $k$, potem preveri:

:::premisli
Koliko je $A_\mathrm{k}$ in koliko je $k$?
---
$A_\mathrm{k} = 2\,\mathrm{kW} \cdot 5\,\mathrm{h} = 10\,\mathrm{kWh}$. Število koncertov: $k = \dfrac{700\,000\,\mathrm{kWh}}{10\,\mathrm{kWh}} = 70\,000$. Ena ura elektrarne zadošča za $70\,000$ koncertov.
:::

## Pogoste napake

- **»Satelit ve, kje sem.«** Napačno sklepanje: pika je na pravem mestu, torej me satelit opazuje. V resnici satelit le oddaja, telefon pa sam računa. Popravek: GPS je kot poslušanje bobna, ne kot klicanje.
- **Hitrost zvoka pri radijskem signalu.** Radijski valovi so elektromagnetno valovanje kot svetloba. Popravek: pri GPS vedno $c = 300\,000\,\mathrm{km/s}$ in pazi, da hitrost pomnožiš s časom, ne deliš.
- **»Laser je zelo močna svetilka.«** Laser v predvajalniku je šibkejši od žepne svetilke. Posebna je njegova svetloba: ene barve in v ozkem snopu. Popravek: laser loči od žarnice ena barva in ozek snop, ne moč.
- **»Večja sončna celica da večjo napetost.«** Napetost ene celice je odvisna od snovi, okoli $0{,}5\,\mathrm{V}$. Večja celica ujame več fotonov in da večji tok. Popravek: za večjo napetost celice veži zaporedno, $U = N \cdot U_1$.
- **»Reaktor da tok kot baterija.«** Uran toka ne poganja neposredno. Popravek: cepitev jeder da toploto, para vrti turbino, šele generator z magnetom in tuljavami da tok.

## Povzetek

- GPS: sprejemnik meri zamudo radijskih signalov s satelitov in izračuna razdalje $s = c \cdot t$, $c = 300\,000\,\mathrm{km/s}$; potrebuje vsaj štiri satelite in zelo natančne ure.
- Laser seva svetlobo ene barve v ozkem snopu; predvajalnik CD z njim bere odboje od vdolbinic na plošči.
- Sončna celica iz silicija: fotoni sprostijo elektrone, ena celica da okoli $0{,}5\,\mathrm{V}$; zaporedno vezane: $U = N \cdot U_1$; moč $P = U \cdot I$.
- Barva svetlobe odloči, ali foton sprosti elektron, jakost pa, koliko elektronov se sprosti.
- Jedrska elektrarna: cepitev jeder urana → toplota → para → turbina → generator → tok; nadzorne palice vpijajo nevtrone; odpadki so radioaktivni.
- Pri računih: $A = P \cdot t$, pazi na enote ($\mathrm{MW} \to \mathrm{kW}$, $\mathrm{kW}$ in $\mathrm{h}$ dasta $\mathrm{kWh}$).

## Drugače: Z analogijo

- **GPS je kot štetje do groma.** Ko zabliska, šteješ sekunde do groma in veš, kako daleč je nevihta. Sateliti so kot »bliski«, ki natančno povedo, kdaj je signal krenil.
- **Laser je kot zbor, ki poje isti ton.** Množica na trgu ustvarja hrup: vsak z drugim glasom, v svojo smer. To je navadna žarnica. Zbor, ki v ritmu poje isti ton, je laser: ena barva, vsi valovi korakajo skupaj.
- **Sončna celica je kot dvigalo za elektrone.** Vsak foton dvigne en elektron na višjo polico. Od tam se elektron skozi krog spusti nazaj in med potjo poganja zvočnik. Več fotonov pomeni več dvignjenih elektronov, torej večji tok. Višina police, torej napetost, ostane enaka.
- **Jedrska elektrarna je kot lonec z vetrnico.** Pod loncem namesto plina »gori« uran. Para iz lonca vrti vetrnico, vetrnica pa vrti magnet v tuljavi kolesarskega dinama.

## Drugače: Bolj natančno

**GPS.** Tri razdalje bi zadoščale za lego, če bi bila ura v telefonu popolna. Ni, zato telefon s četrtim satelitom izračuna še, za koliko se njegova ura zmoti. Ure na satelitih so atomske. Na višini satelitov čas teče malenkost drugače kot na tleh (to razloži teorija relativnosti), zato jih sproti popravljajo.

**Laser.** Atomi v laserju dobijo energijo (npr. iz električnega toka). Foton, ki gre mimo vzbujenega atoma, ga spodbudi, da izseva še en povsem enak foton: iste barve, v isti smeri, v istem taktu. Zrcali ta proces ponavljata, zato se svetloba krepi. CD bere nevidna infrardeča svetloba, Blu-ray pa modro-vijolična, ki jo lahko zberemo v manjšo piko.

**Fotoni.** Energija fotona je odvisna od barve: vijolični foton ima več energije kot rdeč, infrardeči pa še manj. Elektrone v siliciju sprostijo že fotoni z valovno dolžino do približno $1100\,\mathrm{nm}$. Celica pretvori v električno energijo le okoli petino vpadle svetlobe, ostalo jo segreje.

**Cepitev.** Cepi se predvsem uran-235. Razcepka sta novi, radioaktivni jedri. Število nerazpadlih jeder se v vsakem **razpolovnem času** zmanjša na polovico. Pri nekaterih odpadkih je ta čas več tisoč let.

## Preveri se

? Predvajalnik CD bere glasbo z laserjem. Po čem se laserska svetloba loči od svetlobe navadne žarnice?
- Laser je zelo močan, zato v ploščo vžge luknjice, ko jo predvajamo.
~ Laser v predvajalniku je šibek in plošče med predvajanjem ne spreminja, le bere odboje. Laser ni »močna svetilka«.
+ Ima eno samo barvo in ozek snop, ki se skoraj ne razširi.
- Potuje hitreje od svetlobe žarnice.
~ Vsa svetloba v zraku potuje s praktično enako hitrostjo, okoli $300\,000\,\mathrm{km/s}$.
> Laser seva svetlobo ene barve v ozkem snopu, zato jo lahko zberemo v drobno piko, ki loči vdolbinice na plošči.

? V katerem vrstnem redu si sledijo koraki v jedrski elektrarni?
- cepitev jeder → električni tok → toplota → para
~ Uran ne daje toka neposredno kot baterija. Tok nastane šele v generatorju, na koncu verige.
+ cepitev jeder → toplota → para vrti turbino → generator da tok
- para vrti turbino → cepitev jeder → toplota → generator da tok
~ Para nastane šele iz toplote, ki jo sprosti cepitev. Brez cepitve ni pare.
- generator → turbina → para → cepitev jeder
~ To je obrnjeno: turbina vrti generator, ne obratno, in na začetku je cepitev.
> Cepitev sprosti toploto, toplota upari vodo, para vrti turbino, turbina vrti generator, v njem vrteči se magnet ob tuljavah požene tok.

? Kaj se zgodi, če nadzorne palice potisnemo globlje v reaktor?
- Reaktor se bolj segreje, ker palice zadržujejo toploto.
~ Palice ne zadržujejo toplote, ampak vpijajo nevtrone. Brez nevtronov je cepitev manj.
+ Vpijejo več nevtronov, cepi se manj jeder, sprosti se manj toplote in elektrarna da manjšo moč.
- Nič, palice le ščitijo delavce pred sevanjem.
~ Palice so v reaktorju zato, da uravnavajo verižno reakcijo, ne kot zaščitni zid.
> Manj prostih nevtronov pomeni manj cepitev v sekundi, torej manj toplote, pare in električne moči.

? Signal satelita GPS potuje $0{,}08\,\mathrm{s}$. Kako daleč je satelit?
- $27{,}2\,\mathrm{m}$
~ To je razdalja pri hitrosti zvoka ($340\,\mathrm{m/s}$). Radijski signal potuje s hitrostjo svetlobe.
- $3\,750\,000\,\mathrm{km}$
~ Tako dobiš, če hitrost deliš s časom. Razdalja je produkt: $s = c \cdot t$.
+ $24\,000\,\mathrm{km}$
> $s = c \cdot t = 300\,000\,\mathrm{km/s} \cdot 0{,}08\,\mathrm{s} = 24\,000\,\mathrm{km}$.

? Zvočnik potrebuje napetost $9\,\mathrm{V}$. Ena sončna celica da $0{,}5\,\mathrm{V}$. Koliko celic moraš vezati zaporedno?
- $4{,}5$
~ To je $9 \cdot 0{,}5$. Število celic dobiš z deljenjem: koliko polovic volta gre v $9\,\mathrm{V}$.
- eno, če je dovolj velika
~ Večja celica da večji tok, napetost ene celice pa ostane okoli $0{,}5\,\mathrm{V}$.
+ $18$
> Napetosti zaporedno vezanih celic se seštejejo: $N = \dfrac{9\,\mathrm{V}}{0{,}5\,\mathrm{V}} = 18$.

:::simboli
s | razdalja (pot signala) | s = v \cdot t | m | pri GPS v km
v | hitrost zvoka | | m/s | približno $340\,\mathrm{m/s}$
t | čas (zamuda signala ali čas delovanja) | | s | pri delu v urah
c | hitrost svetlobe (radijskih valov) | | km/s | $300\,000\,\mathrm{km/s}$
U | napetost panela | U = N \cdot U_1 | V
N | število zaporedno vezanih celic | N = \dfrac{U}{U_1} | –
U_1 | napetost ene celice | | V | približno $0{,}5\,\mathrm{V}$
P | moč | P = U \cdot I | W | pri koncertu v kW
I | električni tok | I = \dfrac{P}{U} | A
P_1 | moč enega panela | | W
n | število panelov | n = \dfrac{P}{P_1} | –
A | električno delo | A = P \cdot t | kWh | ali J
A_\mathrm{e} | delo elektrarne v eni uri | A_\mathrm{e} = P_\mathrm{e} \cdot t_\mathrm{e} | kWh
A_\mathrm{k} | delo ozvočenja enega koncerta | A_\mathrm{k} = P_\mathrm{k} \cdot t_\mathrm{k} | kWh
P_\mathrm{e} | električna moč elektrarne | | MW
t_\mathrm{e} | čas delovanja elektrarne | | h
P_\mathrm{k} | moč ozvočenja koncerta | | kW
t_\mathrm{k} | čas koncerta | | h
k | število koncertov | k = \dfrac{A_\mathrm{e}}{A_\mathrm{k}} | –
:::
