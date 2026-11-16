---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Po poletni nevihti sošolec Tine razlaga: »Na vrtu imam veliko vedro, ti pa le kozarec za vlaganje. V moje vedro je nateklo skoraj tri litre vode, v tvoj kozarec pa komaj deciliter. Pri nas je torej padlo veliko več dežja.«

Sliši se prepričljivo, a v trditvi je napaka. Na koncu razlage jo boš pokazal z meritvami.

Na tekmovanjih iz fizike so pogoste eksperimentalne naloge: dobiš vprašanje in pripomočke ali že tabelo meritev. Točke ne prinese samo končno število. Ocenjevalec gleda, ali si pravilno izbral spremenljivke, uredil tabelo, narisal graf, iz njega odčital strmino in zapisal sklep, ki ga meritve res podpirajo.

## Razlaga

Postopek gradimo po korakih. Vsak korak preveriš z enim kratkim vprašanjem.

**1. Vprašanje.** Poskus se začne z vprašanjem, na katero odgovori merjenje. »Ali širša posoda pokaže več dežja?« je tako vprašanje. Pred merjenjem zapiši še **napoved** (domnevo): »Širša posoda nabere več vode, višina vode v njej pa je enaka kot v ozki.«

*Preizkus:* Ali je »Ali je jutranja megla lepa?« vprašanje za poskus? *Ne, lepote ne izmeriš z nobenim merilom.*

**2. Spremenljivke.** Količino, ki jo izbiraš in spreminjaš sam, imenujemo **neodvisna spremenljivka**. Pri dežju je to ploščina odprtine posode $S$. Količino, ki jo potem izmeriš, imenujemo **odvisna spremenljivka**: prostornina nabrane vode $V$. Vse ostalo, kar bi lahko vplivalo na izid, držiš enako. To so **kontrolirane spremenljivke**: vse posode stojijo hkrati na istem odprtem mestu, imajo navpične stene in so enako dolgo na dežju.

*Preizkus:* Kaj je neodvisna spremenljivka, če meriš, kako daleč odnese veter liste pri različnih hitrostih vetra? *Hitrost vetra.*

:::premisli
Tine je vedro postavil sredi vrta, kozarec pa na okensko polico pod napuščem. Ali lahko iz teh dveh meritev sklepa, kako širina posode vpliva na izid? Zakaj?
---
Ne more. Hkrati sta se spremenili dve stvari: širina posode in mesto. Pod napuščem pade manj dežja, zato ne ve, ali je v kozarcu malo vode zaradi ožje odprtine ali zaradi strehe. V dobrem poskusu spreminjaš eno samo spremenljivko.
:::

**3. Merjenje.** Vodo iz vsake posode zliješ v merilni valj in odčitaš prostornino. Natančnost odčitka je določena z najmanjšim razdelkom valja. Kadar meritev ponavljaš (na primer čas z uro), izmeri večkrat in izračunaj **povprečje**:

$$\bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n}$$

Kako zelo so meritve raztresene, pove **odstopanje** $\Delta x$: največja razlika med posamezno meritvijo in povprečjem. Rezultat zapišeš kot $\bar{x} \pm \Delta x$.

*Preizkus:* Meritve $10\,\mathrm{s}$, $12\,\mathrm{s}$ in $14\,\mathrm{s}$. Koliko sta povprečje in odstopanje? *$12\,\mathrm{s}$ in $2\,\mathrm{s}$.*

V simulaciji spodaj »Obdelava meritev« pritisni »Izmeri 5-krat«. Opazuj, kje med meritvami leži povprečje in kako se odstopanje spremeni, ko meritev dodaš še več.

**4. Tabela.** Meritve uredi v tabelo. Prvi stolpec je neodvisna spremenljivka. V glavi stolpca sta oznaka in enota, v vrsticah samo števila. Dodaš lahko stolpec z izračunano količino. Tu je to $V/S$. Ker je $1\,\mathrm{mL} = 1\,\mathrm{cm^3}$, ima enoto $\mathrm{cm^3/cm^2} = \mathrm{cm}$.

| $S$ [cm²] | $V$ [mL] | $V/S$ [cm] |
|---|---|---|
| 50 | 61 | 1,22 |
| 100 | 118 | 1,18 |
| 150 | 182 | 1,21 |
| 200 | 236 | 1,18 |
| 300 | 362 | 1,21 |

*Preizkus:* Zakaj enote ne pišemo ob vsako število? *Ker je že v glavi; tabela je tako preglednejša.*

**5. Graf.** Neodvisno spremenljivko nanesi na vodoravno os, odvisno na navpično. Nato z ravnilom potegni **premico najboljšega ujemanja**: približno toliko točk naj bo nad njo kot pod njo. Točk ne povezuj z lomljeno črto. Meritve se zaradi napak raztresajo, zakon v ozadju pa ne.

:::risba graf
opis: Graf prostornine nabrane vode V v odvisnosti od ploščine odprtine S. Pet merjenih točk: (50; 61), (100; 118), (150; 182), (200; 236) in (300; 362). Skoznje gre premica skozi izhodišče in točko (300; 360). Črtkani trikotnik strmine ima vodoravno stranico ΔS = 300 cm² in navpično stranico ΔV = 360 mL.
x: 0 .. 300 | 50 | S [cm^2]
y: 0 .. 400 | 100 | V [mL]
f: 1.2*x | modra
črta: 0; 0 -> 300; 0 -> 300; 360 | črtkano oranžna
točka: 50; 61
točka: 100; 118
točka: 150; 182
točka: 200; 236
točka: 300; 362
napis: 200; 0 | ΔS = 300 cm^2 | nad
napis: 300; 160 | ΔV = 360 mL | levo
:::

**Strmina** premice pove, za koliko se spremeni odvisna spremenljivka, ko se neodvisna poveča za eno enoto:

$$k = \frac{y_B - y_A}{x_B - x_A}$$

Točki $A(x_A; y_A)$ in $B(x_B; y_B)$ izberi *na premici*, čim bolj narazen, ne dveh merjenih točk. Strmina ima tudi enoto:

$$k = \frac{360\,\mathrm{mL}}{300\,\mathrm{cm^2}} = 1{,}2\,\mathrm{cm}$$

*Preizkus:* Kaj bi pomenila bolj strma premica pri istih posodah? *Da je padlo več dežja.*

**6. Sklep.** Sklep odgovori na vprašanje iz prvega koraka, s števili in v mejah natančnosti. Točke ležijo na premici skozi izhodišče, zato je prostornina premo sorazmerna s ploščino: $V = h \cdot S$. Višina vode $h$ pa je v vseh posodah enaka, okoli $1{,}2\,\mathrm{cm}$, in je enaka strmini. To je **višina padavin**: padlo je $12\,\mathrm{mm}$ dežja. Meteorologi jo podajo tudi v litrih na kvadratni meter, ker $12\,\mathrm{mm}$ vode na $1\,\mathrm{m^2}$ pomeni $12\,\mathrm{L}$.

Tinetova napaka je zdaj jasna. Vedro nabere več vode, ker ima večjo odprtino, ne zato, ker bi pri njem padlo več dežja. Primerjati smeš samo višini vode v posodah z navpičnimi stenami.

:::premisli
Sošolka z ožjo posodo ima vodo $1{,}0\,\mathrm{cm}$ visoko, Tine $1{,}3\,\mathrm{cm}$. Posodi sta stali v istem vrtu. Ali lahko zdaj trdita, da je pri Tinetu padlo več dežja? Kaj bi morala vedeti še?
---
Le, če je razlika večja od odstopanja meritev. Iz tabele vidiš, da višine v enakih pogojih nihajo za nekaj stotink centimetra, $0{,}3\,\mathrm{cm}$ pa je precej več. Preveriti morata še, ali sta posodi stali enako odprto in enako dolgo, sicer razlike ne moreta pripisati dežju.
:::

**7. Ko graf ni premica.** Na tekmovanju odvisnost pogosto ni premo sorazmerna in točke ležijo na krivulji. Takrat na navpično os nanesi drugo količino, na primer kvadrat merjene. Pri nihalu je to kvadrat nihajnega časa $T$ v odvisnosti od dolžine vrvi $l$: če točke $(l; T^2)$ ležijo na premici, si našel zakon in iz strmine izračunaš, kar naloga sprašuje. To strategijo uporabiš v Primeru 3.

## Rešeni primeri

### Primer 1 (lažji): povprečje in odstopanje

Maja spušča javorjev plod (»helikopterček«) z višine $2{,}0\,\mathrm{m}$ in s štoparico meri čas padanja. Dobi $1{,}52\,\mathrm{s}$; $1{,}48\,\mathrm{s}$; $1{,}61\,\mathrm{s}$; $1{,}45\,\mathrm{s}$ in $1{,}54\,\mathrm{s}$. Zapiši rezultat z odstopanjem. Kaj bi bila neodvisna spremenljivka, če bi spuščala plodove z različnih višin?

**Podatki:** višina $2{,}0\,\mathrm{m}$; $t_1 = 1{,}52\,\mathrm{s}$, $t_2 = 1{,}48\,\mathrm{s}$, $t_3 = 1{,}61\,\mathrm{s}$, $t_4 = 1{,}45\,\mathrm{s}$, $t_5 = 1{,}54\,\mathrm{s}$
**Iščemo:** povprečni čas $\bar{t}$, odstopanje $\Delta t$ in neodvisno spremenljivko

:::formula
$\bar{t} = \dfrac{t_1 + t_2 + t_3 + t_4 + t_5}{5}$; $\Delta t$ je največja razlika med meritvijo in $\bar{t}$.
:::

**Rešitev:**

1. Seštejemo meritve: $1{,}52 + 1{,}48 + 1{,}61 + 1{,}45 + 1{,}54 = 7{,}60$.
2. Delimo s številom meritev, ker iščemo povprečje: $\bar{t} = \dfrac{7{,}60\,\mathrm{s}}{5} = 1{,}52\,\mathrm{s}$.
3. Razlike od povprečja so $0$; $0{,}04$; $0{,}09$; $0{,}07$ in $0{,}02$ sekunde. Največja je $1{,}61 - 1{,}52 = 0{,}09$, zato $\Delta t = 0{,}09\,\mathrm{s}$.
4. Pri spuščanju z različnih višin bi višino izbirala sama, zato bi bila višina neodvisna spremenljivka, čas pa odvisna.
5. Odgovor: plod pada $(1{,}52 \pm 0{,}09)\,\mathrm{s}$. Neodvisna spremenljivka bi bila višina spusta.

### Primer 2: strmina in napoved iz grafa

Pomladno sonce tali snežno odejo. Ana vsaki dve uri izmeri debelino snega. Ob $t = 0$; $2$; $4$; $6$ in $8\,\mathrm{h}$ dobi $h = 42$; $37$; $31$; $27$ in $21\,\mathrm{cm}$. Za koliko se sneg stanjša v eni uri? Čez koliko ur bi sneg izginil, če bi se talil enako hitro?

**Podatki:** časi $0$; $2$; $4$; $6$; $8\,\mathrm{h}$ in debeline $42$; $37$; $31$; $27$; $21\,\mathrm{cm}$
**Iščemo:** strmino $k$ (hitrost taljenja) in čas, ko je $h = 0$

:::formula
$k = \dfrac{h_B - h_A}{t_B - t_A}$ za dve točki $A$ in $B$ na premici
:::

**Rešitev:**

1. Čas izbira Ana, zato gre na vodoravno os; debelina gre na navpično.
2. Narišemo točke in premico najboljšega ujemanja. Ne gre skozi izhodišče, ker je bilo ob $t = 0$ snega $42\,\mathrm{cm}$.

:::risba graf
opis: Graf debeline snega h v odvisnosti od časa t. Merjene točke: (0; 42), (2; 37), (4; 31), (6; 27) in (8; 21). Polna premica gre od (0; 42) do (8; 21,2), črtkano se nadaljuje do (16,2; 0). Črtkani trikotnik strmine gre od (0; 42) vodoravno do (10; 42) in navpično navzdol do (10; 16).
x: 0 .. 18 | 2 | t [h]
y: 0 .. 45 | 5 | h [cm]
f: 42 - 2.6*x | modra | 0 .. 8
f: 42 - 2.6*x | modra črtkano | 8 .. 16.15
črta: 0; 42 -> 10; 42 -> 10; 16 | črtkano oranžna
točka: 0; 42
točka: 2; 37
točka: 4; 31
točka: 6; 27
točka: 8; 21
napis: 5; 42 | Δt = 10 h | nad
napis: 10; 30 | Δh = −26 cm | desno
:::

3. Na premici izberemo točki $A(0; 42)$ in $B(10; 16)$, ker sta daleč narazen: $k = \dfrac{16 - 42}{10 - 0} = -2{,}6$, torej $-2{,}6\,\mathrm{cm/h}$.
4. Minus pomeni, da se debelina manjša. Vsako uro se sneg stanjša za $2{,}6\,\mathrm{cm}$.
5. Sneg izgine, ko premica seka vodoravno os, torej ko je $42 - 2{,}6\,t = 0$: $\dfrac{42}{2{,}6} = 16{,}2$, torej po približno $16\,\mathrm{h}$.
6. Napoved velja le, če ostanejo pogoji enaki. Ponoči sonca ni, zato bi se taljenje skoraj ustavilo.
7. Odgovor: sneg se tanjša za $2{,}6\,\mathrm{cm}$ na uro; ob enakem taljenju bi izginil po približno $16$ urah.

### Primer 3 (težji): graf zravnaš

Na veji drevesa visi gugalnica. Luka spreminja dolžino vrvi $l$ in meri nihajni čas $T$ (čas enega celega nihaja):

| $l$ [m] | $T$ [s] | $T^2$ [s²] |
|---|---|---|
| 0,50 | 1,42 | 2,02 |
| 1,00 | 2,01 | 4,04 |
| 1,50 | 2,46 | 6,05 |
| 2,00 | 2,84 | 8,07 |

Ali je nihajni čas premo sorazmeren z dolžino vrvi? Kako dolgo vrv potrebuje, da bo en nihaj trajal $3{,}00\,\mathrm{s}$?

**Podatki:** pari $(l; T)$ iz tabele; želeni $T = 3{,}00\,\mathrm{s}$
**Iščemo:** vrsto odvisnosti in dolžino $l$

:::formula
Če je $T^2 = k \cdot l$, je $k = \dfrac{\Delta (T^2)}{\Delta l}$ in $l = \dfrac{T^2}{k}$.
:::

**Rešitev:**

1. Preverimo premo sorazmerje: dolžina se od $0{,}50\,\mathrm{m}$ do $1{,}00\,\mathrm{m}$ podvoji, čas pa naraste le za faktor $\dfrac{2{,}01}{1{,}42} = 1{,}42$. Torej ni premo sorazmeren, graf $T(l)$ je ukrivljen.
2. Poskusimo s kvadratom: $1{,}42^2 = 2{,}02$ in $2{,}84^2 = 8{,}07$. Ko se $l$ poveča štirikrat (z $0{,}50\,\mathrm{m}$ na $2{,}00\,\mathrm{m}$), se štirikrat poveča tudi $T^2$. Točke $(l; T^2)$ ležijo na premici skozi izhodišče.
3. Premica najboljšega ujemanja gre skozi izhodišče in točko $(2{,}0; 8{,}06)$, zato je $k = \dfrac{8{,}06}{2{,}0} = 4{,}03$, torej $4{,}03\,\mathrm{s^2/m}$.
4. Za želeni čas izračunamo $T^2 = 9{,}00\,\mathrm{s^2}$. Zadnji korak naredi sam.

:::premisli
Kolikšna je dolžina vrvi $l = \dfrac{T^2}{k}$? Ali je pri tem napoved zunaj merjenega območja?
---
$l = \dfrac{9{,}00}{4{,}03} = 2{,}2$, torej približno $2{,}2\,\mathrm{m}$. Merili smo do $2{,}00\,\mathrm{m}$, zato premico podaljšamo le malo, kar je še zanesljivo. Nihajni čas torej ni premo sorazmeren z dolžino, njegov kvadrat pa je.
:::

## Pogoste napake

- **Lomljena črta skozi vse točke.** Kdor poveže točke »od pike do pike«, misli, da je vsaka meritev točna. Vsaka ima napako, zato zakon pokaže šele premica najboljšega ujemanja, ki gre med točkami.
- **Strmina iz ene same točke.** Pri snegu bi kdo iz točke $(2; 37)$ izračunal $\dfrac{37}{2} = 18{,}5$, torej $18{,}5\,\mathrm{cm/h}$, kar je sedemkrat preveč. Količnik $y/x$ je strmina samo, kadar gre premica skozi izhodišče. Vedno vzemi razliki med dvema točkama na premici.
- **Dve spremenljivki hkrati.** Če spremeniš širino posode in mesto, ne veš, kaj je povzročilo razliko. Pred poskusom zapiši, katere količine držiš enake.
- **Sklep, ki ga meritve ne podpirajo.** Razlika, manjša od odstopanja, ni dokaz. Prav tako ne smeš daleč napovedovati zunaj merjenega območja: ponoči se sneg ne tali enako kot podnevi.
- **Strmina brez enote.** Število $1{,}2$ samo ne pove ničesar; $1{,}2\,\mathrm{cm}$ dežja pa je odgovor. Enota strmine je enota navpične osi, deljena z enoto vodoravne.

## Povzetek

- Neodvisno spremenljivko spreminjaš sam, odvisno meriš, kontrolirane držiš enake. Spreminjaj eno samo.
- Ponovljene meritve: povprečje $\bar{x}$ in odstopanje $\Delta x$ (največja razlika od povprečja); rezultat $\bar{x} \pm \Delta x$.
- Tabela: neodvisna spremenljivka v prvem stolpcu, oznaka in enota v glavi.
- Graf: neodvisna na vodoravni osi; premica najboljšega ujemanja, ne lomljena črta.
- Strmina $k = \dfrac{y_B - y_A}{x_B - x_A}$ iz dveh oddaljenih točk na premici, z enoto; pogosto je prav ona iskana količina.
- Ukrivljen graf poskusi zravnati (na primer $T^2$ namesto $T$).
- Sklep odgovori na vprašanje s števili, v mejah natančnosti in merjenega območja.

## Drugače: Na sliki

Isti podatki z gugalnice na dveh grafih. Levo je nihajni čas $T$ v odvisnosti od dolžine $l$: točke ležijo na krivulji, ki se vse bolj položi. Iz krivulje strmine ne odčitaš.

:::risba graf
opis: Graf nihajnega časa T v odvisnosti od dolžine vrvi l. Točke (0,5; 1,42), (1; 2,01), (1,5; 2,46) in (2; 2,84) ležijo na krivulji, ki se z večjo dolžino vse bolj položi.
x: 0 .. 2,5 | 0,5 | l [m]
y: 0 .. 3,5 | 0,5 | T [s]
f: 2.006*sqrt(x) | modra | 0 .. 2,5
točka: 0,5; 1,42
točka: 1; 2,01
točka: 1,5; 2,46
točka: 2; 2,84
:::

Ko na navpično os nanesemo $T^2$, se krivulja zravna v premico skozi izhodišče. Zdaj strmino odčitaš s trikotnikom in iz nje računaš.

:::risba graf
opis: Graf kvadrata nihajnega časa T² v odvisnosti od dolžine vrvi l. Točke (0,5; 2,02), (1; 4,04), (1,5; 6,05) in (2; 8,07) ležijo na premici skozi izhodišče s strmino 4,03 s² na meter.
x: 0 .. 2,5 | 0,5 | l [m]
y: 0 .. 10 | 2 | T^2 [s^2]
f: 4.03*x | modra | 0 .. 2,48
točka: 0,5; 2,02
točka: 1; 4,04
točka: 1,5; 6,05
točka: 2; 8,07
:::

## Drugače: Bolj natančno

**Napaka strmine.** Skozi vsako točko si predstavljaj navpično daljico, ki sega za odstopanje nad točko in za odstopanje pod njo. Nato potegneš najbolj strmo in najbolj položno premico, ki še zadeneta vse daljice. Polovica razlike njunih strmin je odstopanje strmine.

**Relativna napaka** je $\dfrac{\Delta x}{\bar{x}}$. Pri javorjevem plodu je to $\dfrac{0{,}09}{1{,}52} \approx 5{,}9\,\%$.

**Število mest.** Rezultat zapiši le na toliko mest, kolikor jih dopušča odstopanje. $(1{,}52 \pm 0{,}09)\,\mathrm{s}$ je smiselno, $1{,}5200\,\mathrm{s}$ pa ne.

**Dve vrsti napak.** Naključne napake (reakcijski čas, sunki vetra) raztresejo točke na obe strani premice; zmanjšaš jih s ponavljanjem. Sistematične premaknejo vse meritve v isto smer, na primer izhlapevanje vode iz posode na soncu. Ponavljanje jih ne odpravi.

## Preveri se

? Nina raziskuje, ali slana voda zmrzne počasneje kot voda iz pipe. 1) V lonček A nalije $100\,\mathrm{mL}$ vode iz pipe, v lonček B $100\,\mathrm{mL}$ slane vode. 2) Lonček A postavi na balkon (zunaj je $-5\,^\circ\mathrm{C}$), lonček B v zamrzovalnik ($-18\,^\circ\mathrm{C}$). 3) Vsakih $10$ minut pogleda, ali je voda zmrznila. 4) Sklep: slana voda zmrzne hitreje. Kateri korak pokvari poskus?
- Korak 1, ker bi morala vzeti različni prostornini.
~ Enaka prostornina je prav dobra izbira: je kontrolirana spremenljivka.
+ Korak 2, ker se poleg vrste vode spremeni tudi temperatura okolice.
- Korak 3, ker bi morala gledati vsako minuto.
~ Pogostejše gledanje bi dalo natančnejši čas, a sklep bi bil še vedno napačen, ker sta lončka v različno mrzlem okolju.
> Spreminjati sme samo vrsto vode. Lonček B je v mnogo hladnejšem zamrzovalniku, zato zmrzne prej ne glede na sol.

? Katera trditev o tabeli in grafu je pravilna?
- Merjene točke povežemo z lomljeno črto, da gre graf skozi vse.
~ Vsaka meritev ima napako. Zakon pokaže premica najboljšega ujemanja, ki gre med točkami.
+ Neodvisno spremenljivko nanesemo na vodoravno os.
- Enoto zapišemo ob vsako število v tabeli, v glavi pa je ni.
~ Ravno obratno: enota je v glavi stolpca, v vrsticah so samo števila.
- Strmino vedno izračunamo iz prve in zadnje merjene točke.
~ Merjeni točki imata napaki. Strmino računamo iz dveh točk na premici najboljšega ujemanja.
> Količino, ki jo izbiramo sami, nanesemo vodoravno, merjeno pa navpično.

? Na sončni strani strehe raste ledena sveča. Z grafa odčitaj, za koliko centimetrov se je daljšala v eni uri.
:::risba graf
opis: Graf dolžine ledene sveče L v odvisnosti od časa t. Merjene točke (0; 12), (2; 18), (4; 24) in (6; 30) ležijo na premici, ki ob času 0 začne pri 12 cm.
x: 0 .. 6 | 1 | t [h]
y: 0 .. 35 | 5 | L [cm]
f: 12 + 3*x | modra | 0 .. 6
točka: 0; 12
točka: 2; 18
točka: 4; 24
točka: 6; 30
:::
= 3 cm/h | 0,1
~ 5 | Izračunal si $30/6$, kot da premica gre skozi izhodišče. Ob času $0$ je bila sveča že dolga $12\,\mathrm{cm}$.
~ 2 | Izračunal si $12/6$; to je začetna dolžina, deljena s časom, ne sprememba.
> $k = \dfrac{30 - 12}{6 - 0} = 3$, torej $3\,\mathrm{cm/h}$.

? Plod javorja s celimi krilci pade v $(1{,}52 \pm 0{,}09)\,\mathrm{s}$, plod z malo krajšimi krilci v $(1{,}58 \pm 0{,}09)\,\mathrm{s}$. Kaj lahko sklepaš?
- Daljša krilca skrajšajo čas padanja.
~ Razlika povprečij je le $0{,}06\,\mathrm{s}$, manj kot odstopanje. Iz teh meritev tega ne moreš trditi.
- Krajša krilca zagotovo podaljšajo čas padanja.
~ Tudi tu je razlika manjša od odstopanja, zato je lahko le posledica raztrosa meritev.
+ Razlika je manjša od odstopanja, zato vpliva krilc iz teh meritev ne moremo potrditi.
> Razliko smeš razglasiti za učinek šele, ko je večja od odstopanja. Z več ponovitvami bi bili povprečji zanesljivejši.

? Planinec na isti dan meri temperaturo zraka v senci: na $600\,\mathrm{m}$ nadmorske višine $14\,^\circ\mathrm{C}$, na $1100\,\mathrm{m}$ $11\,^\circ\mathrm{C}$, na $1600\,\mathrm{m}$ $8\,^\circ\mathrm{C}$. Kolikšno temperaturo pričakuje na vrhu na $2100\,\mathrm{m}$?
- $10{,}5\,^\circ\mathrm{C}$
~ Vzel si premo sorazmerje ($8 \cdot \dfrac{2100}{1600}$). Temperatura z višino pada, poleg tega premica ne gre skozi izhodišče.
- $2\,^\circ\mathrm{C}$
~ Odštel si $6\,^\circ\mathrm{C}$, kar velja za $1000\,\mathrm{m}$. Od $1600\,\mathrm{m}$ do $2100\,\mathrm{m}$ je le $500\,\mathrm{m}$.
+ $5\,^\circ\mathrm{C}$
- Napovedi ni mogoče dati.
~ Točke ležijo na premici in vrh je le malo nad merjenim območjem, zato je kratko podaljšanje premice smiselno.
> Na vsakih $500\,\mathrm{m}$ se ohladi za $3\,^\circ\mathrm{C}$ ($k = -0{,}6\,^\circ\mathrm{C}$ na $100\,\mathrm{m}$), zato je na vrhu $8 - 3 = 5\,^\circ\mathrm{C}$.

<<RACUN
vrednost: (1.52+1.48+1.61+1.45+1.54)/5 | 1.52
vrednost: 1.61-1.52 | 0.09
vrednost: 360/300 | 1.2
enote: 1.2*cm | 12*mm
enote: 0.012*m*m^2 | 12*L
vrednost: (16-42)/(10-0) | -2.6
vrednost: 42/2.6 | 16.2
vrednost: 37/2 | 18.5
vrednost: 2.01/1.42 | 1.42
vrednost: 1.42^2 | 2.02
vrednost: 2.84^2 | 8.07
vrednost: 8.06/2.0 | 4.03
vrednost: 9.00/4.03 | 2.2
vrednost: 0.09/1.52*100 | 5.9
vrednost: (30-12)/(6-0) | 3
vrednost: (11-14)/500*100 | -0.6
vrednost: 8-3 | 5
>>

:::simboli
\bar{x} | povprečje meritev | \bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n} | | enota je enaka enoti meritev
x_1, x_2, x_n | posamezne meritve | | |
n | število meritev | | – |
\Delta x | odstopanje (največja razlika od povprečja) | | | rezultat zapišemo kot $\bar{x} \pm \Delta x$
k | strmina premice | k = \frac{y_B - y_A}{x_B - x_A} | | enota navpične osi, deljena z enoto vodoravne
x_A, x_B | vodoravni koordinati točk $A$ in $B$ na premici | | |
y_A, y_B | navpični koordinati točk $A$ in $B$ na premici | | |
V | prostornina nabrane vode | V = h \cdot S | mL |
S | ploščina odprtine posode | | cm^2 |
h | višina vode, debelina snega | | cm |
\bar{t} | povprečni čas padanja | \bar{t} = \frac{t_1 + t_2 + t_3 + t_4 + t_5}{5} | s |
t_1, t_2, t_3, t_4, t_5 | izmerjeni časi padanja ploda | | s |
\Delta t | odstopanje časa padanja | | s |
h_A, h_B | debelina snega v točkah $A$ in $B$ na premici | | cm |
t_A, t_B | čas v točkah $A$ in $B$ na premici | | h |
A, B | točki na premici, iz katerih računamo strmino | | |
T | nihajni čas gugalnice | | s |
l | dolžina vrvi | l = \frac{T^2}{k} | m |
:::
