---
stanje: osnutek
demo: ohm
avtor: AI
---

## Zakaj se tega učimo

Maja se s staršema pelje proti Piranu. Oče ima v avtu grelec za skodelico, ki ga vtakne v avtomobilsko vtičnico z napetostjo $12\,\text{V}$. Sredi Krasa grelec neha greti. Oče najde vzrok: v vtiču kabla je pregorela varovalka za $0{,}25\,\text{A}$, ki jo je tja vstavil prejšnji lastnik avta. V predalu sta dve rezervni, ena za $0{,}25\,\text{A}$ in ena za $1\,\text{A}$. Na grelcu piše, da ima grelna žica upor $20\,\Omega$.

Katero varovalko naj vstavijo? Prešibka bo spet pregorela, premočna pa ne bi ščitila kabla. Odgovor skriva povezava med napetostjo, tokom in uporom, ki jo opisuje **Ohmov zakon**. Ista povezava pove, koliko toka steče skozi sušilnik las v hotelski sobi in koliko skozi lučko za branje zemljevida. Na njej stojijo tudi vsa električna vezja, ki pridejo v naslednji lekciji.

## Razlaga

**Najprej Majin primer.** Doma Maja grelec priključi na nastavljiv vir. Vezje je na sliki: ampermeter je v isti veji kot grelec, voltmeter pa je priključen na njegova dva konca.

:::risba skica
opis: Sklenjeno vezje. Levo je vir z napetostjo U, pol plus je zgoraj. Po zgornji žici gre tok najprej skozi ampermeter (krog s črko A), nato skozi grelno žico z uporom R = 20 ohmov (pravokotnik). Voltmeter (krog s črko V) je z dvema žicama priključen na oba konca grelne žice, vzporedno k njej. Puščica I pod spodnjo žico kaže smer toka od plusa skozi porabnik nazaj k minusu. Puščica e⁻ nad spodnjo žico kaže, da se elektroni gibljejo v nasprotno smer.
območje: -1; 0 .. 14; 9
črta: 1; 4,8 -> 1; 7 -> 13; 7 -> 13; 2 -> 1; 2 -> 1; 4,2
črta: 0,2; 4,8 -> 1,8; 4,8 | debelo
črta: 0,6; 4,2 -> 1,4; 4,2 | debelo
napis: 1,8; 5,2 | + | desno
napis: 1,8; 3,8 | − | desno
napis: 0; 4,5 | U | levo
krog: 4; 7 | 0,6 | ozadje
napis: 4; 7 | A | sredina
napis: 4; 7,6 | ampermeter | nad
pravokotnik: 7,8; 6,5 .. 10,2; 7,5 | ozadje
napis: 9; 7,5 | R = 20 Ω | nad
črta: 7; 7 -> 7; 4,5 -> 11; 4,5 -> 11; 7
točka: 7; 7 | | nad | polno
točka: 11; 7 | | nad | polno
krog: 9; 4,5 | 0,6 | ozadje
napis: 9; 4,5 | V | sredina
napis: 9; 3,9 | voltmeter | pod
puščica: 9; 1,2 -> 5; 1,2 | I | pod
puščica: 3; 2,6 -> 6; 2,6 | e⁻ | nad
:::

Maja napetost postopno povečuje in zapisuje tok. Vsako meritev odčita takoj po vklopu, da se žica ne utegne segreti:

| $U$ [V] | $I$ [A] | $U/I$ [V/A] |
|---|---|---|
| 3 | 0,15 | 20 |
| 6 | 0,30 | 20 |
| 9 | 0,45 | 20 |
| 12 | 0,60 | 20 |

Ko se napetost podvoji, se podvoji tudi tok. Količnik $U/I$ je v vsaki vrstici enak, $20$. Pri $12\,\text{V}$ v avtu torej teče $0{,}60\,\text{A}$. Varovalka za $0{,}25\,\text{A}$ je prešibka: tok $0{,}60\,\text{A}$ je več kot dvakrat večji od njenega nazivnega toka, zato je pregorela in bi pregorela znova. Vstavijo tisto za $1\,\text{A}$. Med vožnjo je napetost v vtičnici nekoliko višja, približno $14\,\text{V}$, upor grelne žice pa se ob segrevanju spremeni le malo. Tok je tedaj okoli $0{,}7\,\text{A}$, še vedno pod $1\,\text{A}$.

:::premisli
Kolikšen tok bi tekel, če bi Maja napetost povečala na $15\,\text{V}$? Napovej brez računala.
---
$0{,}75\,\text{A}$. Vsakih $3\,\text{V}$ prinese $0{,}15\,\text{A}$. Napetost $15\,\text{V}$ je petkrat $3\,\text{V}$, torej je tok $5 \cdot 0{,}15\,\text{A}$.
:::

Iz tega enega primera sledi vse, kar je spodaj: kaj točno je tok, kaj ga žene, kaj mu nasprotuje in zakaj je razmerje stalno.

**1. Električni tok.** Električni tok je urejeno gibanje nabitih delcev. V kovinskem vodniku se gibljejo prosti elektroni. Električni tok $I$ pove, koliko naboja steče skozi presek vodnika v enoti časa. Naboj, ki steče skozi presek, delimo s časom, v katerem steče:

$$I = \frac{e}{t}$$

Pri tem je $e$ naboj, ki steče skozi presek vodnika v času $t$. Enota za naboj je amperska sekunda ($\text{As}$), kot v lekciji o naboju; $1\,\text{As} = 1\,\text{C}$ (coulomb). Enota za tok je **amper** ($\text{A}$): $1\,\text{A}$ pomeni, da v vsaki sekundi steče $1\,\text{As}$ naboja.

**2. Smer toka.** Po dogovoru je smer toka od plusa proti minusu vira. Elektroni se v resnici gibljejo v nasprotno smer (puščica e⁻ na Majini sliki), vendar to za računanje ni pomembno.

**3. Napetost.** Da steče tok, mora vir (baterija, vtičnica) ustvariti **električno napetost** $U$. Napetost med priključkoma že poznaš: delo električne sile na enoto naboja, $U = A_e/e$. Predstavljaš si jo lahko kot »potisk«, ki žene naboje po krogu. Enota je **volt** ($\text{V}$). Napetost merimo z voltmetrom, ki ga vežemo **vzporedno** k porabniku. Tok merimo z ampermetrom, ki ga vežemo **zaporedno**, torej v isto vejo vezja. Na Majini sliki zgoraj je oboje že narisano.

**4. Električni upor.** Vodnik se toku upira, ker se elektroni na poti zaletavajo v ione kristalne mreže. Ta lastnost se imenuje **električni upor** $R$. Enota je **ohm** ($\Omega$). Večji ko je upor, manjši tok steče pri isti napetosti.

**5. Ohmov zakon.** Zakaj je tok sorazmeren z napetostjo? Napetost $U$ na žici dolžine $l$ ustvari v njej polje $E = U/l$, tako kot $U = Ed$ med ploščama. Elektroni se zaradi trkov z ioni ne pospešujejo v nedogled, ampak lezejo s povprečno hitrostjo, sorazmerno z $E$. Podobno je s kroglico, ki tone v medu: med jo zavira tem bolj, čim hitreje se giblje, zato po kratkem času tone s stalno hitrostjo, dvakrat večja sila pa ji da dvakrat večjo končno hitrost. Dvakrat večja napetost da dvakrat močnejše polje, dvakrat hitrejše lezenje in dvakrat večji tok.

Pri kovinskih vodnikih pri stalni temperaturi zato velja:

$$U = I \cdot R \qquad \Rightarrow \qquad I = \frac{U}{R}, \quad R = \frac{U}{I}$$

Velja $1\,\Omega = 1\,\dfrac{\text{V}}{\text{A}}$. Če napetost podvojimo, se pri enakem uporu podvoji tudi tok. Če pri enaki napetosti podvojimo upor, se tok razpolovi.

Slika spodaj kaže tok v odvisnosti od upora pri $U = 12\,\text{V}$. Pri $20\,\Omega$ teče $0{,}60\,\text{A}$, pri $40\,\Omega$ le $0{,}30\,\text{A}$. Napovej: kolikšen bo tok pri $20\,\Omega$, ko je $U = 24\,\text{V}$? Nato v aplikaciji premakni drsnik na $24\,\text{V}$, preveri napoved in odčitaj še tok pri $40\,\Omega$. Ali je razmerje še vedno $2 : 1$?

:::risba graf
opis: Tok I v amperih v odvisnosti od upora R v ohmih od 10 do 60 ohmov pri napetosti U = {U} V. Krivulja pada: večji upor, manjši tok. Pri 20 ohmih teče {U/20:.2} A, pri 40 ohmih {U/40:.2} A, kar je natanko polovica.
x: 0 .. 70 | 10 | R [Ω]
y: 0 .. 2,5 | 0,5 | I [A]
drsnik: U | 4 .. 24 | 4 | 12 | napetost U v voltih
f: U/x | modra | 10 .. 60
točka: 20; U/20 | {U/20:.2} A | nad desno
točka: 40; U/40 | {U/40:.2} A | nad desno
podnapis: Pri U = {U} V: dvakrat večji upor, pol manjši tok.
:::

**6. Grafična predstavitev.** Če za kovinski upornik narišemo graf $I(U)$, dobimo premico skozi koordinatno izhodišče. Strmejša ko je premica, manjši je upor.

:::risba graf
opis: Graf toka I v amperih v odvisnosti od napetosti U v voltih od 0 do 12 V. Polna premica je Majin grelec z uporom 20 ohmov: pri 12 V doseže 0,6 A. Črtkana premica je upornik z uporom R = {R} ohmov: pri 12 V doseže {12/R:.2} A. Obe gresta skozi izhodišče, premica za večji upor je bolj položna.
x: 0 .. 12 | 3 | U [V]
y: 0 .. 0,7 | 0,1 | I [A]
drsnik: R | 25 .. 80 | 5 | 40 | upor črtkane premice v ohmih
f: x/20 | modra | 0 .. 12
f: x/R | oranžna črtkano | 0 .. 12
napis: 8; 0,45 | 20 Ω | levo
točka: 12; 0,6 | 0,60 A | nad levo
točka: 12; 12/R | | nad | polno
napis: 9; 9/R | {R} Ω | pod desno
podnapis: Pri 12 V: 20 Ω da 0,60 A, {R} Ω da {12/R:.2} A.
:::

Slika kaže začetno stanje, $40\,\Omega$. V aplikaciji drsnik premakni do $80\,\Omega$: črtkana premica postaja vse bolj položna, pri $12\,\text{V}$ pade na $0{,}15\,\text{A}$.

V simulaciji spodaj (»Električni tok in Ohmov zakon«) nastavi upor na $20\,\Omega$ in napetost povečuj od $0$ do $12\,\text{V}$. Opazuj, da tok narašča v enakih korakih kot v Majini tabeli. Nato upor podvoji in poglej, za koliko pade tok pri isti napetosti.

:::premisli
Zakaj je premica za $40\,\Omega$ ravno pol tako strma kot premica za $20\,\Omega$?
---
Pri vsaki napetosti teče skozi dvakrat večji upor pol manjši tok, $I = \dfrac{U}{R}$. Vsaka točka črtkane premice je zato na polovični višini, na primer $0{,}3\,\text{A}$ namesto $0{,}6\,\text{A}$ pri $12\,\text{V}$.
:::

## Rešeni primeri

### Primer 1: tok iz naboja in časa

Na postajališču ob avtocesti Maja polni telefon. Skozi kabel polnilnika steče v $20\,\text{s}$ naboj $60\,\text{As}$. Kolikšen tok teče po kablu?

**Podatki:** $t = 20\,\text{s}$, $e = 60\,\text{As}$
**Iščemo:** tok $I$

:::formula
$I = \dfrac{e}{t}$
:::

**Rešitev:**

1. Uporabimo definicijo toka: $I = \dfrac{e}{t}$. Zakaj: tok pove, koliko naboja steče v eni sekundi.
2. Vstavimo: $I = \dfrac{60\,\text{As}}{20\,\text{s}} = 3\,\text{A}$.
3. Preverimo enote: $\dfrac{\text{As}}{\text{s}} = \text{A}$. ✓
4. Odgovor: po kablu teče tok $3\,\text{A}$.

### Primer 2: Ohmov zakon

V hotelski sobi Maja priključi sušilnik las v vtičnico. Omrežna napetost v Sloveniji in drugod v Evropi je $U = 230\,\text{V}$, grelna žica sušilnika ima upor $R = 46\,\Omega$. Kolikšen tok teče skozi sušilnik?

**Podatki:** $R = 46\,\Omega$, $U = 230\,\text{V}$
**Iščemo:** tok $I$

:::formula
Ohmov zakon v obliki z $I$ na levi: $I = \dfrac{U}{R}$
:::

**Rešitev:**

1. Ohmov zakon povezuje vse tri količine, zato ga preoblikujemo za tok: $I = \dfrac{U}{R}$.
2. Vstavimo: $I = \dfrac{230\,\text{V}}{46\,\Omega} = 5\,\text{A}$.
3. Preverimo smiselnost: pri $230\,\text{V}$ in $5\,\text{A}$ bi bil upor res $\dfrac{230}{5} = 46\,\Omega$. ✓
4. Odgovor: skozi sušilnik teče tok $5\,\text{A}$. To je precej manj od toka, pri katerem izklopi hišna varovalka (navadno $10\,\text{A}$ ali $16\,\text{A}$), zato je sušilnik varno priključiti.

### Primer 3: varovalka določa najmanjši upor (obratno vprašanje)

Oče ima za avtomobilsko vtičnico razdelilec, ki ima v vtiču varovalko za $1\,\text{A}$. a) Kolikšen upor mora imeti grelni porabnik na $12\,\text{V}$ najmanj, da tok ne preseže $1\,\text{A}$? b) Ali sme Maja prek razdelilca priključiti drug grelec z uporom $8\,\Omega$?

**Podatki:** $U = 12\,\text{V}$, $I_{\max} = 1\,\text{A}$, drugi grelec $R_2 = 8\,\Omega$
**Iščemo:** a) najmanjši upor $R_{\min}$, b) tok $I_2$ skozi drugi grelec

:::formula
$R_{\min} = \dfrac{U}{I_{\max}}$, nato $I_2 = \dfrac{U}{R_2}$
:::

**Rešitev:**

**a)**
1. Pri stalni napetosti manjši upor pomeni večji tok. Največji dovoljeni tok zato določa najmanjši upor: $R_{\min} = \dfrac{U}{I_{\max}}$.
2. $R_{\min} = \dfrac{12\,\text{V}}{1\,\text{A}} = 12\,\Omega$.

**b)**
1. Tok skozi drugi grelec: $I_2 = \dfrac{U}{R_2} = \dfrac{12\,\text{V}}{8\,\Omega} = 1{,}5\,\text{A}$. Zakaj: Ohmov zakon da tok iz napetosti in upora.
2. Primerjamo: $1{,}5\,\text{A} > 1\,\text{A}$, ker je $8\,\Omega < 12\,\Omega$. Oba pogleda se ujemata. ✓
3. Odgovor: upor mora biti vsaj $12\,\Omega$. Grelca z $8\,\Omega$ Maja ne sme priključiti, saj bi varovalka prej ali slej pregorela.

### Primer 4 – zdaj ti

Ponoči Maja na zadnjem sedežu bere papirnati zemljevid ob lučki, ki je priključena na $12\,\text{V}$ in ima pri delovanju upor $48\,\Omega$. Koliko naboja steče skozi lučko v $10$ minutah branja?

**Podatki:** $U = 12\,\text{V}$, $R = 48\,\Omega$, $t = 10\,\text{min}$
**Iščemo:** naboj $e$

:::formula
$I = \dfrac{U}{R}$, nato $e = I \cdot t$
:::

**Rešitev:**

1. Tok skozi lučko: $I = \dfrac{U}{R} = \dfrac{12\,\text{V}}{48\,\Omega} = 0{,}25\,\text{A}$. Zakaj: naboja ne poznamo, tok pa dobimo iz Ohmovega zakona.
2. Čas v sekundah: $t = 10 \cdot 60\,\text{s} = 600\,\text{s}$. Zakaj: tok je v amperih, to je $\text{As}$ na sekundo, zato mora biti čas v sekundah.
3. Zdaj ti: iz $I = \dfrac{e}{t}$ izrazi naboj in izračunaj.

:::premisli
Koliko naboja steče skozi lučko?
---
$e = I \cdot t = 0{,}25\,\text{A} \cdot 600\,\text{s} = 150\,\text{As}$. Skozi lučko steče $150\,\text{As}$ naboja.
:::

## Pogoste napake

- **Zamenjava formul.** »$I = \dfrac{R}{U} = \dfrac{20}{10} = 2\,\text{A}$.« Večji upor bi tako dal večji tok, kar je v nasprotju z vsem, kar upor pomeni. Pomagaj si s trikotnikom: $U$ je zgoraj, $I$ in $R$ spodaj; prekrij količino, ki jo iščeš. Na koncu preveri: večji upor, manjši tok.
- **Množenje namesto deljenja.** »Tok je $U \cdot R$, saj oboje vpliva nanj.« Tako dobiš pri $12\,\text{V}$ in $3\,\Omega$ kar $36\,\text{A}$. Enota $\text{V} \cdot \Omega$ ni amper, to te opozori. Tok je $\dfrac{U}{R}$, množimo le pri $U = I \cdot R$.
- **»Večja napetost, večji upor.«** Ker se pri večji napetosti spremeni tok, se zdi, da se spremeni tudi upor. Upor je lastnost upornika (snov, dolžina, presek), ne napetosti. Pri kovinskem uporniku se ob podvojeni napetosti podvoji tok, $U/I$ pa ostane enak.
- **Zamenjane meritve.** »Ampermeter vežem vzporedno, da izmeri tok ob uporniku.« Ampermeter ima zelo majhen upor, zato bi vzporedno skozenj stekel velik tok. Ampermeter vežemo zaporedno, voltmeter vzporedno.
- **Pozabljena pretvorba.** »$I = \dfrac{6\,\text{V}}{2\,\text{k}\Omega} = 3\,\text{A}$.« Kilo pomeni tisoč, zato je $2\,\text{k}\Omega = 2000\,\Omega$ in $I = 0{,}003\,\text{A} = 3\,\text{mA}$. Pred vstavljanjem vse pretvori v $\text{V}$, $\text{A}$, $\Omega$ in $\text{s}$.

## Povzetek

- Električni tok je urejeno gibanje nabojev: $I = \dfrac{e}{t}$, enota amper ($\text{A}$).
- Napetost ($\text{V}$) žene tok, upor ($\Omega$) mu nasprotuje.
- Ohmov zakon: $U = I \cdot R$, torej $I = \dfrac{U}{R}$ in $R = \dfrac{U}{I}$.
- Pri kovinskih upornikih pri stalni temperaturi je tok sorazmeren z napetostjo, graf $I(U)$ je premica skozi izhodišče.
- Ampermeter vežemo zaporedno, voltmeter vzporedno.

## Drugače: Z analogijo

**Vodni krog.** Črpalka dviga vodo na vrh hriba, od tam voda teče po cevi navzdol in nazaj k črpalki. Črpalka je vir, višinska razlika je napetost, ozek del cevi je upor. Tok je, koliko vode v sekundi steče mimo izbranega mesta.

- Dvakrat večja višinska razlika pri isti cevi: v sekundi steče dvakrat več vode. To je $I \sim U$ pri stalnem $R$.
- Dvakrat daljši ozki del cevi (dvakrat večji upor) pri isti višini: pretok pade na polovico. To je $I \sim \dfrac{1}{R}$ pri stalnem $U$.
- Voda se v cevi ne »porabi«: kolikor je priteče v ozki del, toliko je odteče. Tudi tok je pred porabnikom in za njim enak.

Analogija ima mejo. Voda teče hitro, elektroni v žici pa lezejo zelo počasi. Tok vseeno steče skoraj takoj po vsem krogu, ker se ob vklopu začnejo premikati elektroni v celotni žici hkrati.

## Drugače: Bolj natančno

**Upor žice.** Upor je odvisen od snovi (baker prevaja bolje kot železo), od temperature in od oblike žice. Za homogeno žico dolžine $l$ in preseka $S$ velja

$$R = \rho \cdot \frac{l}{S},$$

kjer je $\rho$ **specifični upor** snovi. Dvakrat daljša žica ima dvakrat večji upor, dvakrat večji presek pa polovični upor.

**Meje Ohmovega zakona.** Ohmov zakon ne velja za vse snovi in naprave. Za diodo ali svetlečo diodo (LED) graf $I(U)$ ni premica: količnik $U/I$ se spreminja z napetostjo. Pri žarnici z žarilno nitko se upor poveča, ko se nitka segreje, zato graf $I(U)$ ni premica. Upornike, pri katerih velja Ohmov zakon, imenujemo ohmski. Pomembno je razlikovati med zakonom ($I \sim U$ pri stalni temperaturi) in definicijo upora ($R = U/I$), ki jo lahko izračunamo za vsak porabnik.

## Preveri se

? Tri trditve o kovinskem uporniku pri stalni temperaturi držijo, ena ne. Katera ne sodi zraven?
- Graf $I(U)$ je premica skozi izhodišče.
~ Ta trditev drži: tok je premo sorazmeren z napetostjo, zato je graf premica skozi izhodišče.
- Količnik $\dfrac{U}{I}$ je pri vseh napetostih enak.
~ Ta trditev drži: ravno ta stalni količnik je upor, pri Maji je bil vedno $20\,\Omega$.
- Če podvojimo napetost, se podvoji tok.
~ Ta trditev drži, to je Ohmov zakon. Iskana trditev je tista, ki trdi, da se z napetostjo spremeni upor.
+ Če podvojimo napetost, se podvoji upor.
> Upor je lastnost upornika (snov, dolžina, presek, temperatura). Ko podvojimo napetost, se podvoji tok, upor $\dfrac{U}{I}$ pa ostane enak.

? Skozi žarnico steče v $5\,\text{s}$ naboj $10\,\text{As}$. Kolikšen je tok?
= 2 A | 0,05
~ 50 | Naboj in čas si pomnožil. Tok je naboj *na* sekundo, zato naboj delimo s časom.
~ 0,5 | Delil si čas z nabojem. Enota bi bila $\text{s}/\text{As}$, ne amper.
~ 15 | Naboj in čas si seštel. Količin z različnimi enotami ne moremo seštevati.
> Tok je naboj na enoto časa: $I = \dfrac{10\,\text{As}}{5\,\text{s}} = 2\,\text{A}$.

? Grelec na $12\,\text{V}$ z uporom $20\,\Omega$ zamenjamo z grelcem z uporom $60\,\Omega$. Napetost ostane enaka. Kaj se zgodi s tokom?
- Tok se potroji.
~ Večji upor toku bolj nasprotuje, zato tok ne more narasti. Pri stalni napetosti je $I \sim \dfrac{1}{R}$.
- Tok ostane enak, ker je napetost enaka.
~ Morda misliš, da tok določa le napetost. Tok je odvisen od obeh, $I = \dfrac{U}{R}$.
+ Tok se zmanjša na tretjino.
- Tok se zmanjša na polovico.
~ Upor se ni podvojil, ampak potrojil: $60\,\Omega$ je trikrat $20\,\Omega$, zato je tok trikrat manjši.
> Pri stalni napetosti je tok obratno sorazmeren z uporom. Trikrat večji upor da trikrat manjši tok: $0{,}60\,\text{A}$ pade na $\dfrac{12\,\text{V}}{60\,\Omega} = 0{,}20\,\text{A}$.

? Nik računa tok skozi upornik v navigacijski napravi z uporom $4\,\text{k}\Omega$ na napetosti $12\,\text{V}$. 1) $I = \dfrac{U}{R}$. 2) $I = \dfrac{12\,\text{V}}{4\,\Omega} = 3\,\text{A}$. 3) Tok skozi upornik je $3\,\text{A}$. Kateri korak je napačen?
- Korak 1
~ Formula je pravilna: tok je napetost, deljena z uporom.
+ Korak 2
- Korak 3
~ Korak 3 le prepiše rezultat iz koraka 2; napaka je nastala prej.
- Nobeden
~ Upor je več tisoč ohmov, napetost le $12\,\text{V}$, zato mora teči veliko manj kot $1\,\text{A}$. Rezultat $3\,\text{A}$ je tisočkrat prevelik.
> Nik je v koraku 2 pozabil pretvoriti kiloohme: $4\,\text{k}\Omega = 4000\,\Omega$. Pravilno je $I = \dfrac{12\,\text{V}}{4000\,\Omega} = 0{,}003\,\text{A} = 3\,\text{mA}$.

? Luka je izmeril tok skozi neznani upornik pri več napetostih in narisal graf. Z grafa odčitaj označeno točko in izračunaj upor.
:::risba graf
opis: Graf toka I v amperih v odvisnosti od napetosti U v voltih. Premica gre skozi izhodišče. Označena točka leži pri napetosti 8 V in toku 0,2 A.
x: 0 .. 10 | 2 | U [V]
y: 0 .. 0,3 | 0,05 | I [A]
f: x/40 | modra | 0 .. 10
točka: 8; 0,2 | | nad | polno
:::
= 40 Ω | 1
~ 0,025 | Delil si tok z napetostjo. Upor je $\dfrac{U}{I}$, ne $\dfrac{I}{U}$.
~ 4 | Tok si vzel kot $2$ namesto $0{,}2\,\text{A}$. Preberi decimalno vejico na osi $I$.
~ 1,6 | Napetost in tok si pomnožil. Enota $\text{V} \cdot \text{A}$ ni ohm; upor je $\dfrac{U}{I}$.
> Točka leži pri $8\,\text{V}$ in $0{,}2\,\text{A}$, zato je $R = \dfrac{8\,\text{V}}{0{,}2\,\text{A}} = 40\,\Omega$. Ker je graf premica skozi izhodišče, da vsaka točka enak upor.

? Razvrsti korake meritve upora z ampermetrom in voltmetrom po vrsti.
1. Pri izklopljenem viru sestavi krog vir–upornik–ampermeter (ampermeter na območju, večjem od pričakovanega toka), voltmeter pa priključi na oba konca upornika.
2. Vklopi vir.
3. Odčitaj napetost in tok.
4. Izračunaj upor kot količnik $\dfrac{U}{I}$.
> Vezje sestavljamo brez napetosti, ampermeter pa nastavimo na dovolj veliko območje, preden skozenj steče tok, sicer bi ga lahko poškodovali. Šele ko je vir vklopljen, lahko odčitamo $U$ in $I$; upor izračunamo iz izmerjenih vrednosti.

:::simboli
I | električni tok | I = \dfrac{e}{t} | A
e | električni naboj | | A\,s | 1 A s = 1 C
t | čas | | s
U | električna napetost | U = I \cdot R | V
R | električni upor | R = \dfrac{U}{I} | Ω | za žico tudi $R = \rho l/S$; pri kovini pri stalni temperaturi stalen
E | jakost električnega polja v žici | E = \dfrac{U}{l} | V/m
A_e | delo električne sile | U = \dfrac{A_e}{e} | J
\rho | specifični upor snovi | | Ω\,m
l | dolžina žice | | m
S | presek žice | | m^2
R_{\min} | najmanjši dovoljeni upor | R_{\min} = \dfrac{U}{I_{\max}} | Ω
I_{\max} | nazivni tok varovalke | | A
R_2 | upor drugega grelca | | Ω
I_2 | tok skozi drugi grelec | I_2 = \dfrac{U}{R_2} | A
:::

<<RACUN
vrednost: 12/20 | 0.6
vrednost: 15/20 | 0.75
vrednost: 12/40 | 0.3
vrednost: 12/80 | 0.15
vrednost: 60/20 | 3
vrednost: 230/46 | 5
vrednost: 12/1 | 12
vrednost: 12/8 | 1.5
vrednost: 12/60 | 0.2
vrednost: 8/2 | 4
vrednost: 14/20 | 0.7
vrednost: 12/4000 | 0.003
vrednost: 12/48 | 0.25
vrednost: 0.25*600 | 150
vrednost: 10/5 | 2
vrednost: 10/20 | 0.5
vrednost: 8/0.2 | 40
>>
