---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Uganka za začetek. Na topel poletni večer na travniku prešteješ, da murn v $15$ sekundah zacvrči $30$-krat. Koliko stopinj je? Ugibaj, preden bereš naprej.

Pomaga ti tabela, ki jo je neka dijakinja zbrala v osmih večerih (izmišljeni podatki):

| večer | temperatura (°C) | cvrki v 15 s |
|---|---|---|
| 1 | 14 | 18 |
| 2 | 16 | 22 |
| 3 | 17 | 23 |
| 4 | 19 | 28 |
| 5 | 21 | 31 |
| 6 | 22 | 34 |
| 7 | 24 | 37 |
| 8 | 26 | 41 |

Več ko je cvrkov, topleje je. $30$ cvrkov leži med $28$ (pri $19$ °C) in $31$ (pri $21$ °C), zato je približno $20$ °C. Murn je postal termometer.

Tu nismo opazovali ene količine, ampak dve hkrati in iskali, kako sta **povezani**. Tako delajo vremenoslovci, biologi in vsak, ki piše raziskovalno nalogo: izberejo vprašanje, zberejo podatke, jih uredijo, analizirajo in odgovorijo. Celoten postopek se imenuje **statistična naloga**.

## Razlaga

**1. Ena spremenljivka proti dvema.** Pri statistiki si imel eno **spremenljivko**, na primer samo temperaturo osmih večerov. Izračunal si sredino, mediano, standardni odklon in narisal histogram. Večer je bil **statistična enota**, temperatura njena lastnost.

Zdaj vsaka enota prinese dve vrednosti: večer ima temperaturo $x$ in število cvrkov $y$. Razlike so v tabeli:

| | ena spremenljivka | dve spremenljivki |
|---|---|---|
| podatek | število $x_i$ | par $(x_i, y_i)$ |
| prikaz | histogram, škatla z brki | razsevni diagram |
| vprašanje | kje je sredina, kako so razpršeni | ali se $y$ spreminja z $x$ |

Spremenljivka je **številska**, če so vrednosti števila (temperatura, število cvrkov), in **opisna**, če so vrednosti besede (vreme: sončno, oblačno, deževno).

**2. Razsevni diagram.** Vsak par $(x_i, y_i)$ narišemo kot eno točko v koordinatnem sistemu. Oblak vseh točk je **razsevni diagram**. Točk ne povezujemo s črto, ker vrstni red meritev ni pomemben.

:::risba graf
opis: Razsevni diagram osmih večerov. Na vodoravni osi je temperatura od 12 do 28 °C, na navpični število cvrkov v 15 sekundah od 15 do 45. Točke (14; 18), (16; 22), (17; 23), (19; 28), (21; 31), (22; 34), (24; 37) in (26; 41) se vzpenjajo od levo spodaj proti desno zgoraj, skoraj na premici.
x: 12 .. 28 | 2 | temperatura (°C)
y: 15 .. 45 | 5 | cvrki v 15 s
točka: 14; 18
točka: 16; 22
točka: 17; 23
točka: 19; 28
točka: 21; 31
točka: 22; 34
točka: 24; 37
točka: 26; 41
podnapis: Murn in temperatura: pozitivna povezanost
:::

Iz oblaka točk razberemo **povezanost** spremenljivk:

- **pozitivna**: točke se od leve proti desni dvigajo; večjim $x$ v povprečju pripadajo večji $y$ (murn in temperatura);
- **negativna**: točke se spuščajo; večjim $x$ pripadajo manjši $y$;
- **ni povezanosti**: točke so razsute v okroglem ali vodoravnem oblaku brez smeri.

Povezanost je **močna**, če točke ležijo blizu neke premice, in **šibka**, če so okoli nje močno razpršene. Računalniški programi moč izrazijo s **korelacijskim koeficientom**, številom med $-1$ in $1$: blizu $1$ pomeni močno pozitivno, blizu $-1$ močno negativno, blizu $0$ nobene povezanosti. Formule zanj ne potrebuješ; dovolj je, da znaš oblak točk opisati z besedami.

:::premisli
Kakšno povezanost napoveš med številom ur sonca v dnevu in količino padavin istega dne? In med številko čevlja dijaka in dnevno temperaturo na dan meritve?
---
Prva je negativna: dnevi z več sonca imajo navadno manj dežja. Pri drugi je ni: številka čevlja nima nobene zveze z vremenom, zato bi bile točke razsute brez smeri.
:::

**3. Povezanost še ni vzrok.** Pri eni spremenljivki se nismo spraševali, kaj kaj povzroča. Pri dveh se to vprašanje vsili, a razsevni diagram nanj ne odgovori. Poleti se poveča prodaja sončnih krem in hkrati število pikov komarjev. Povezanost je pozitivna, a krema ne privablja komarjev: obe količini poganja **tretja spremenljivka**, toplo vreme. Iz podatkov lahko trdimo »sta povezani«, za »$x$ povzroča $y$« pa potrebujemo še znanje o pojavu ali poskus.

:::premisli
V neki vasi so opazili, da se je v letih, ko je gnezdilo več štorkelj, rodilo več otrok. Predlagaj tretjo spremenljivko, ki bi lahko poganjala obe količini, in še en razlog, zakaj ta povezanost ne dokazuje, da štorklje prinašajo otroke.
---
Povezanost lahko pojasni tretja spremenljivka, na primer velikost vasi ali število hiš: kjer je več hiš in streh, je več gnezd in tudi več družin. Lahko gre tudi za naključje pri malo letih. Podatki pokažejo le, da količini skupaj rasteta.
:::

**4. Zbiranje podatkov.** Vse enote, o katerih nas kaj zanima, so **populacija** (vsi julijski dnevi v kraju, vsi dijaki šole). Navadno izmerimo le del, **vzorec**. Ta mora biti **reprezentativen**: podoben populaciji v vsem, kar bi lahko vplivalo na odgovor. Podatke dobimo z merjenjem (termometer), opazovanjem (štetje cvrkov), anketo (vprašalnik) ali iz obstoječih virov, na primer arhiva vremenske postaje. Anketno vprašanje naj bo jasno in ne sme namigovati odgovora.

**5. Statistična naloga v šestih korakih.** Empirična preiskava, to je preiskava na podlagi zbranih podatkov, gre takole:

1. **Tema**: kaj te zanima (vreme in zrak v domačem kraju).
2. **Preiskovalno vprašanje**: jasno in merljivo. Ne »Kako je z zrakom?«, ampak »Ali je ob dnevih z močnejšim vetrom v zraku manj prašnih delcev?«
3. **Zbiranje podatkov**: kaj, kje, kdaj, koliko enot in s čim merimo.
4. **Urejanje**: tabela, urejanje po velikosti, razvrščanje v skupine ali razrede, izločanje očitnih napak pri vpisu.
5. **Analiza**: sredine in razpršenost, primerjava skupin, razsevni diagram.
6. **Prikaz in interpretacija**: diagram, odgovor na vprašanje z besedami in omejitve (majhen vzorec, en letni čas).

Statistika, ki si jo že znal, je le korak 5. Statistična naloga jo postavi med vprašanje na začetku in odgovor na koncu.

## Rešeni primeri

### Primer 1 (lažji): višje je hladneje

Planinsko društvo je za šest postaj na različnih nadmorskih višinah zapisalo povprečno julijsko temperaturo (izmišljeni podatki). Kakšna je povezanost med višino in temperaturo? Oceni temperaturo na višini $1350\,\mathrm{m}$.

**Podatki:** višine $300$, $600$, $900$, $1200$, $1500$, $1800\,\mathrm{m}$; temperature po vrsti $21{,}5$; $19{,}8$; $18{,}1$; $16{,}4$; $14{,}2$; $12{,}9$ °C
**Iščemo:** vrsto in moč povezanosti; oceno temperature pri $1350\,\mathrm{m}$

:::formula
Če $y$ z naraščajočim $x$ pada, je povezanost negativna. Za $x$ na sredini med sosednjima podatkoma ocenimo $y \approx \dfrac{y_1 + y_2}{2}$.
:::

**Rešitev:**

1. Podatki so že urejeni po višini, zato smer vidimo takoj: z vsakim korakom navzgor temperatura pade.
2. Povezanost je negativna. Padci so vsakič podobni (od $1{,}3$ do $2{,}2$ °C), točke bi ležale skoraj na premici, zato je povezanost močna.
3. Na $1500\,\mathrm{m}$ višinske razlike pade temperatura za $21{,}5 - 12{,}9 = 8{,}6$ °C, to je v povprečju približno $0{,}57$ °C na $100\,\mathrm{m}$.
4. Višina $1350\,\mathrm{m}$ je na sredini med $1200$ in $1500\,\mathrm{m}$, zato: $\dfrac{16{,}4 + 14{,}2}{2} = 15{,}3$.
5. Odgovor: povezanost je močna in negativna; na $1350\,\mathrm{m}$ pričakujemo okoli $15{,}3$ °C.

### Primer 2: deževni in suhi dnevi

Dijak je deset julijskih dni beležil najvišjo dnevno temperaturo in ali je deževalo. Zapisal je: $27$ suho, $21$ dež, $29$ suho, $23$ dež, $25$ suho, $30$ suho, $19$ dež, $28$ suho, $22$ dež, $26$ suho. Ali so bili deževni dnevi hladnejši?

**Podatki:** $10$ dni; številska spremenljivka najvišja temperatura (°C), opisna spremenljivka padavine (suho, dež); vrednosti zgoraj
**Iščemo:** primerjavo temperatur suhih in deževnih dni

:::formula
Pri opisni in številski spremenljivki primerjamo skupine: $\bar x = \dfrac{x_1 + x_2 + \dots + x_N}{N}$ in mediano $\mathrm{Me}$ vsake skupine.
:::

**Rešitev:**

1. Uredimo v dve skupini, ker so padavine tu opisna spremenljivka in razsevnega diagrama zanjo ne moremo narisati. Suhi dnevi: $25$, $26$, $27$, $28$, $29$, $30$. Deževni: $19$, $21$, $22$, $23$.
2. Sredina suhih: $\dfrac{27 + 29 + 25 + 30 + 28 + 26}{6} = 27{,}5$; mediana $\dfrac{27 + 28}{2} = 27{,}5$.
3. Sredina deževnih: $\dfrac{21 + 23 + 19 + 22}{4} = 21{,}25$; mediana $\dfrac{21 + 22}{2} = 21{,}5$.
4. Razlika sredin: $27{,}5 - 21{,}25 = 6{,}25$. Tudi najtoplejši deževni dan ($23$ °C) je bil hladnejši od najhladnejšega suhega ($25$ °C).
5. Odgovor: v teh desetih dneh so bili deževni dnevi v povprečju za približno $6$ °C hladnejši. Sklep velja za ta julij; za trdnejšega bi potrebovali več dni.

### Primer 3 (težji): veter in prašni delci

Nika piše raziskovalno nalogo. Zanima jo, ali veter čisti zrak. Na spletni strani vremenske službe je za osem zimskih dni prebrala povprečno hitrost vetra (km/h) in koncentracijo prašnih delcev PM10 (µg/m³). Pari so (izmišljeni podatki): $(12; 38)$, $(3; 62)$, $(18; 30)$, $(8; 48)$, $(22; 24)$, $(5; 55)$, $(15; 33)$, $(10; 50)$. Izpelji preiskavo do odgovora.

**Podatki:** $8$ dni; $x$ hitrost vetra v $\mathrm{km/h}$, $y$ koncentracija PM10 v $\mu\mathrm{g/m^3}$; pari zgoraj
**Iščemo:** preiskovalno vprašanje, ureditev, analizo in odgovor

:::formula
Koraki statistične naloge: vprašanje, zbiranje, urejanje, analiza (razsevni diagram, sredine skupin), prikaz in interpretacija.
:::

**Rešitev:**

1. Vprašanje: »Ali je ob dnevih z močnejšim vetrom koncentracija PM10 manjša?« Je merljivo, ker obe količini merijo postaje.
2. Zbiranje: podatki so iz obstoječega vira, ne iz lastnega merjenja. Vsi so iz istega kraja in iste zime, da razlike v kurjenju ne zmedejo primerjave.
3. Urejanje po hitrosti vetra: $3$, $5$, $8$, $10$, $12$, $15$, $18$, $22$; pripadajoči PM10: $62$, $55$, $48$, $50$, $38$, $33$, $30$, $24$.
4. Analiza: razsevni diagram ima točke, ki se spuščajo, ena ($10$; $50$) malo odstopa. Štirje mirnejši dnevi imajo sredino $\dfrac{62 + 55 + 48 + 50}{4} = 53{,}75$, štirje vetrovnejši $\dfrac{38 + 33 + 30 + 24}{4} = 31{,}25$.
5. Interpretacijo zapiši sam: kakšna je povezanost, kaj odgovoriš na vprašanje in katere so omejitve preiskave?

:::premisli
Kako se glasi Nikin odgovor?
---
Povezanost je negativna in precej močna: ob vetrovnejših dneh je bilo v povprečju za $53{,}75 - 31{,}25 = 22{,}5\,\mu\mathrm{g/m^3}$ manj prašnih delcev. Odgovor na vprašanje je »da, v teh podatkih«. Omejitve: le osem dni, ena zima, en kraj. Da veter delce res odnaša, podpira znanje o pojavu, ne sam diagram.
:::

## Pogoste napake

**»Povezani sta, torej ena povzroča drugo.«** Razsevni diagram pokaže le, da se količini spreminjata skupaj. Morda obe poganja tretja spremenljivka (sončne kreme in komarji, oboje zaradi vročine). Zapiši »sta povezani«, vzrok utemelji posebej.

**Vzorec, ki ni podoben populaciji.** Kdor o vseh dijakih šole sprašuje le člane planinskega krožka, dobi preveč ur v naravi. Sklep velja samo za populacijo, ki jo vzorec res predstavlja.

**Točke povezane s črto.** Razsevni diagram ni časovni graf. Če točke povežeš v vrstnem redu meritev, dobiš cikcak, ki zakrije oblak in njegovo smer.

**»Točke niso na premici, torej ni povezanosti.«** Šibka povezanost je še vedno povezanost, če se oblak jasno dviga ali spušča. Nasprotno pa dve ali tri točke ne zadoščajo za noben sklep.

**Preširoko vprašanje.** »Kako je z vremenom?« se ne da izmeriti. Dobro vprašanje pove, katero spremenljivko merimo in kaj primerjamo.

## Povzetek

- Statistična naloga: tema, preiskovalno vprašanje, zbiranje, urejanje, analiza, prikaz in interpretacija.
- Populacija so vse enote, vzorec izmerjeni del; vzorec mora biti reprezentativen.
- Podatki iz merjenja, opazovanja, ankete ali obstoječih virov; spremenljivka je številska ali opisna.
- Dve številski spremenljivki prikažemo z razsevnim diagramom: vsaka enota je točka $(x_i, y_i)$.
- Povezanost je pozitivna, negativna ali je ni; močna, če so točke blizu premice. Korelacijski koeficient je med $-1$ in $1$.
- Pri opisni in številski spremenljivki primerjamo sredini (in mediani) skupin.
- Povezanost ni dokaz vzroka; v interpretaciji navedi omejitve.

## Drugače: Na sliki

Predstavljaj si razsevni diagram kot jato ptic na nebu. Če jata leti poševno navzgor, je povezanost pozitivna; če se spušča, negativna. Ozka, podolgovata jata pomeni močno povezanost, široka in razvlečena šibko. Okrogla jata, ki nikamor ne kaže, pomeni, da povezanosti ni. Takšen je diagram datuma v mesecu in najvišje temperature ob desetih naključnih dneh:

:::risba graf
opis: Razsevni diagram brez povezanosti. Vodoravna os je dan v mesecu od 0 do 30, navpična najvišja temperatura od 10 do 30 °C. Deset točk je razsutih brez smeri: (2; 18), (5; 25), (8; 15), (11; 22), (13; 17), (16; 26), (19; 20), (22; 14), (25; 24), (28; 19).
x: 0 .. 30 | 5 | dan v mesecu
y: 10 .. 30 | 5 | temperatura (°C)
točka: 2; 18
točka: 5; 25
točka: 8; 15
točka: 11; 22
točka: 13; 17
točka: 16; 26
točka: 19; 20
točka: 22; 14
točka: 25; 24
točka: 28; 19
podnapis: Ni povezanosti: oblak brez smeri
:::

Primerjaj ga z diagramom murnov zgoraj: tam točke tvorijo ozek pas, ki se dviga, tu pa po oblaku ne moreš napovedati ničesar.

## Drugače: Iz vsakdanjega življenja

Aplikacija na telefonu šteje korake in spanje. Če bi za mesec dni izpisal pare »koraki, ure spanja«, bi dobil razsevni diagram. Morda bi se oblak rahlo dvigal: v dneh z več gibanja spiš dlje. To je že povezanost, a ali gibanje res izboljša spanec? Lahko so dnevi z veliko korakov kar vikendi, ko tudi spiš dlje. Vikend je tretja spremenljivka.

Tudi vremenska napoved je ena velika statistična naloga: vprašanje (bo jutri deževalo?), podatki tisočev postaj, urejanje v tabele, analiza z modeli, prikaz na zemljevidu in interpretacija »verjetnost padavin $70\,\%$«.

## Preveri se

? Katera trditev o razsevnem diagramu je pravilna?
- Vsaka točka je ena vrednost ene same spremenljivke.
~ To velja za prikaz ene spremenljivke na premici. V razsevnem diagramu ima vsaka točka dve koordinati.
+ Vsaka točka je ena statistična enota z obema vrednostma $(x, y)$.
- Če se točke dvigajo, sprememba $x$ povzroča spremembo $y$.
~ Diagram pokaže le povezanost. Obe spremenljivki lahko poganja tretja.
- Točke povežemo z lomljeno črto v vrstnem redu meritev.
~ To je časovni graf. V razsevnem diagramu vrstni red meritev ni pomemben, točk ne povezujemo.
> Razsevni diagram prikaže pare: enota z vrednostma $x$ in $y$ je ena točka.

? Razsevni diagram kaže število ur sonca in najvišjo dnevno temperaturo za sedem dni. Z diagrama oceni najvišjo temperaturo dneva z $8$ urami sonca (v °C).
:::risba graf
opis: Razsevni diagram sedmih dni. Vodoravna os so ure sonca od 0 do 13, navpična najvišja temperatura od 10 do 30 °C. Točke: (2; 14), (4; 17), (5; 18), (7; 21), (9; 23), (10; 25), (12; 27). Točke se dvigajo skoraj na premici.
x: 0 .. 13 | 1 | ure sonca
y: 10 .. 30 | 2 | temperatura (°C)
točka: 2; 14
točka: 4; 17
točka: 5; 18
točka: 7; 21
točka: 9; 23
točka: 10; 25
točka: 12; 27
:::
= 22 °C | 1,5
~ 8 | Vpisal si število ur sonca. Iskana je temperatura na navpični osi nad $x = 8$.
> Pri $8$ urah je sredina med točkama $(7; 21)$ in $(9; 23)$, torej približno $22$ °C. Povezanost je pozitivna.

? Luka je preiskoval, koliko ur na teden dijaki njegove šole ($800$ dijakov) preživijo v naravi. 1) Anketiral je $15$ članov planinskega krožka. 2) Odgovore je uredil v frekvenčno tabelo. 3) Izračunal je povprečje $9{,}2$ ure. 4) Sklenil je: dijaki šole so v naravi povprečno $9{,}2$ ure na teden. Kje je napaka?
+ V 1. koraku: vzorec ni reprezentativen, zato sklep v 4. koraku ne velja za vso šolo.
- V 2. koraku: odgovorov ankete se ne ureja v frekvenčno tabelo.
~ Frekvenčna tabela je pravi način urejanja. Težava je v tem, koga je vprašal.
- V 3. koraku: namesto povprečja bi moral izračunati modus.
~ Povprečje je smiselna mera za ure. Tudi z modusom bi bil sklep napačen, ker vzorec ni podoben populaciji.
- Napake ni, $15$ odgovorov je dovolj.
~ Ni le majhnost vzorca: planinci so v naravi več kot povprečen dijak, zato vzorec ni podoben vsem $800$ dijakom.
> Vzorec mora predstavljati populacijo. Člani planinskega krožka gredo v naravo pogosteje, zato je $9{,}2$ ure precenjeno.

? (brez računala) Na štiri sončne dni so na cvetovih lipe našteli $30$, $34$, $26$ in $30$ čebel, na štiri oblačne $12$, $18$, $14$ in $16$. Za koliko čebel je povprečje sončnih dni večje od povprečja oblačnih?
= 15
~ 60 | Odštel si vsoti ($120 - 60$). Primerjaj sredini: najprej deli vsako vsoto s $4$.
~ 2 | To je količnik sredin ($30 : 15$). Vprašanje je, za koliko je večje, torej razlika.
> $\bar x_{\text{sonce}} = \frac{120}{4} = 30$, $\bar x_{\text{oblačno}} = \frac{60}{4} = 15$, razlika $15$ čebel.

? Občinska svetovalka želi vedeti, ali je na ulicah z več drevesi poleti hladneje. Razvrsti korake njene preiskave.
1. Postavi vprašanje: »Ali je na ulicah z več drevesi popoldne nižja temperatura zraka?«
2. Na $12$ ulicah prešteje drevesa in ob isti uri izmeri temperaturo.
3. Za vsako ulico vpiše par (število dreves, temperatura) v tabelo.
4. Nariše razsevni diagram in preveri, ali se točke spuščajo.
5. Zapiše odgovor in omejitev, da je merila le en dan.
> Statistična naloga gre od vprašanja prek zbiranja, urejanja in analize do interpretacije z omejitvami.

<<RACUN
vrednost: (16.4+14.2)/2 | 15.3
vrednost: (21.5-12.9)/15 | 0.57
vrednost: (27+29+25+30+28+26)/6 | 27.5
vrednost: (21+23+19+22)/4 | 21.25
vrednost: 27.5-21.25 | 6.25
vrednost: (21+22)/2 | 21.5
vrednost: (62+55+48+50)/4 | 53.75
vrednost: (38+33+30+24)/4 | 31.25
vrednost: 53.75-31.25 | 22.5
vrednost: (30+34+26+30)/4-(12+18+14+16)/4 | 15
vrednost: (21+23)/2 | 22
>>

:::simboli
x | prva spremenljivka (na vodoravni osi) | | | v primeru 2 najvišja temperatura
y | druga spremenljivka (na navpični osi) | |
y_1, y_2 | vrednosti $y$ pri sosednjih podatkih | |
\bar x | aritmetična sredina | \bar x = \frac{x_1 + x_2 + \dots + x_N}{N} |
x_1, x_2, x_N | posamezni podatki | |
N | število podatkov v skupini | |
\mathrm{Me} | mediana | | | srednji podatek urejenega niza
:::
