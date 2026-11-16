---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec Žan je prepričan: »Mojster Jure obloži kopalnico s ploščicami v $6$ urah, njegov vajenec v $12$ urah. Če delata skupaj, bosta potrebovala povprečje, torej $9$ ur.«

Nekaj tu ne gre skupaj. Po Žanovem računu bi vajenec mojstra le oviral, saj Jure sam konča že v $6$ urah. Dva delavca pa vendar naredita več kot eden. Do konca lekcije bomo Žanu natančno povedali, koliko časa bosta potrebovala in kje je zgrešil.

Enaka past se skriva v nalogah o povprečni hitrosti, o srečevanju in o mešanju malte ali barve. Vedno je vprašanje isto: katere količine smemo sešteti in katerih ne. Na tekmovanjih se te naloge pogosto pojavijo.

## Razlaga

Žanovo trditev preverimo kar z razpredelnico. Jure vsako uro obloži $\dfrac{1}{6}$ kopalnice, vajenec $\dfrac{1}{12}$.

| čas | Jure | vajenec | skupaj |
|---|---|---|---|
| $1\,\mathrm{h}$ | $\frac{1}{6}$ | $\frac{1}{12}$ | $\frac{3}{12} = \frac{1}{4}$ |
| $2\,\mathrm{h}$ | $\frac{2}{6}$ | $\frac{2}{12}$ | $\frac{1}{2}$ |
| $4\,\mathrm{h}$ | $\frac{4}{6}$ | $\frac{4}{12}$ | $1$ |

Vsako uro skupaj opravita četrtino dela, zato končata v $4$ urah, ne v $9$. Delež dela, ki ga nekdo opravi v eni uri, imenujemo **hitrost dela**. Kdor delo konča v času $t$, ima hitrost dela $\dfrac{1}{t}$.

Pravilo: **pri skupnem delu se seštevajo hitrosti dela, ne časi.**

$$\frac{1}{t} = \frac{1}{t_1} + \frac{1}{t_2}$$

Tu sta $t_1$ in $t_2$ časa posameznikov, $t$ pa čas, ko delata skupaj.

:::premisli
Ekipi se pridruži še drugi vajenec, prav tako z $12$ urami. Napovej: koliko časa bodo zdaj potrebovali trije?
---
$\dfrac{1}{6} + \dfrac{1}{12} + \dfrac{1}{12} = \dfrac{4}{12} = \dfrac{1}{3}$ kopalnice na uro, torej $3$ ure. Vsak nov delavec skrajša čas, tudi počasen.
:::

Podobno past ima **povprečna hitrost**. Dostavni kombi pelje ploščice $120\,\mathrm{km}$ daleč s hitrostjo $60\,\mathrm{km/h}$, prazen pa se vrne s $40\,\mathrm{km/h}$. Ali je povprečje $50\,\mathrm{km/h}$? Poskusimo z dvema različnima razdaljama:

| razdalja v eno smer | čas tja | čas nazaj | povprečna hitrost |
|---|---|---|---|
| $120\,\mathrm{km}$ | $2\,\mathrm{h}$ | $3\,\mathrm{h}$ | $\frac{240}{5} = 48\,\mathrm{km/h}$ |
| $60\,\mathrm{km}$ | $1\,\mathrm{h}$ | $1{,}5\,\mathrm{h}$ | $\frac{120}{2{,}5} = 48\,\mathrm{km/h}$ |

Obakrat dobimo $48$, ne $50$. Razdalja ne vpliva na rezultat. Povprečna hitrost je vedno **celotna pot, deljena s celotnim časom**: $v_\mathrm{p} = \dfrac{s}{t}$. Če sta poti tja in nazaj enaki, velja krajša formula $v_\mathrm{p} = \dfrac{2 v_1 v_2}{v_1 + v_2}$. Preveri: $\dfrac{2 \cdot 60 \cdot 40}{100} = 48$.

:::premisli
Zakaj je povprečna hitrost $48\,\mathrm{km/h}$ bližje $40$ kot $60$?
---
Ker kombi s $40\,\mathrm{km/h}$ vozi dlje časa: $3$ ure, s $60\,\mathrm{km/h}$ pa le $2$ uri. Povprečna hitrost upošteva, koliko časa vozi s posamezno hitrostjo.
:::

Pri **srečevanju** se razdalja med udeležencema vsako uro skrajša. Ko gresta drug proti drugemu, se skrajša za $v_1 + v_2$. Ko hitrejši dohiteva počasnejšega, se skrajša le za $v_1 - v_2$. Čas do srečanja je zato razdalja, deljena s to **hitrostjo približevanja**.

Spodnja simulacija (Srečevanje in dohitevanje) to pokaže na grafu: izberi »Vožnja nasproti«, nastavi $v_1 = 60\,\mathrm{km/h}$, $v_2 = 40\,\mathrm{km/h}$ in razdaljo $100\,\mathrm{km}$, nato pritisni »Poženi«. Opazi, da se srečata po $1$ uri. Preklopi na »Dohitevanje« z enakimi nastavitvami: zdaj traja $5$ ur, ker se razmik vsako uro zmanjša le za $20\,\mathrm{km}$. Presečišče črt na grafu pokaže čas in kraj srečanja.

Zadnja vrsta nalog so **mešanice**. Zidar zmeša $10\,\mathrm{kg}$ suhe mešanice z $10\,\%$ cementa in $30\,\mathrm{kg}$ mešanice s $30\,\%$ cementa. Ali dobi $20\,\%$? Preštejmo kilograme cementa: $1\,\mathrm{kg} + 9\,\mathrm{kg} = 10\,\mathrm{kg}$ v $40\,\mathrm{kg}$ mešanice, torej $25\,\%$. Rezultat je bližje odstotku večje količine: od $25\,\%$ do $10\,\%$ je trikrat dlje kot do $30\,\%$, ker je druge mešanice trikrat več.

Pravilo: **seštevamo količine snovi (kilograme cementa), nikoli odstotkov.** **Delež** je količina snovi, deljena s celotno količino mešanice.

Skupna nit vseh štirih vrst: seštevamo hitrosti dela, hitrosti pri srečevanju, poti, čase in kilograme. Ne seštevamo in ne povprečimo pa časov skupnega dela, hitrosti na delih poti in odstotkov.

## Rešeni primeri

### Primer 1 (lažji): dva pleskarja

Ana sama prepleska sobo v $3$ urah, Bor v $6$ urah. Koliko časa potrebujeta, če delata skupaj?

**Podatki:** $t_1 = 3\,\mathrm{h}$, $t_2 = 6\,\mathrm{h}$
**Iščemo:** skupni čas $t$

:::formula
$\dfrac{1}{t} = \dfrac{1}{t_1} + \dfrac{1}{t_2}$
:::

**Rešitev:**

1. Ana na uro prepleska $\dfrac{1}{3}$ sobe, Bor $\dfrac{1}{6}$ sobe.
2. Skupaj na uro: $\dfrac{1}{3} + \dfrac{1}{6} = \dfrac{1}{2}$ sobe, ker se hitrosti dela seštevajo.
3. Pol sobe na uro pomeni celo sobo v $2$ urah.
4. Odgovor: skupaj sobo prepleskata v $2$ urah.

### Primer 2: jarek z obeh koncev

Za vodovodno cev je treba izkopati jarek, dolg $180\,\mathrm{m}$. Bager A koplje z enega konca s hitrostjo $12\,\mathrm{m/h}$, bager B z drugega s hitrostjo $8\,\mathrm{m/h}$. Začneta hkrati. Čez koliko ur se srečata in koliko metrov izkoplje bager A?

**Podatki:** $d = 180\,\mathrm{m}$, $v_A = 12\,\mathrm{m/h}$, $v_B = 8\,\mathrm{m/h}$, začneta hkrati
**Iščemo:** čas srečanja $t$ in dolžino $s_A$, ki jo izkoplje A

:::formula
$t = \dfrac{d}{v_A + v_B}$, nato $s_A = v_A \cdot t$
:::

**Rešitev:**

1. Bagra se približujeta drug drugemu, zato se neizkopani del vsako uro skrajša za $12 + 8 = 20$ metrov.
2. $t = 180 : 20 = 9$ ur.
3. Bager A izkoplje $12 \cdot 9 = 108$ metrov, bager B $8 \cdot 9 = 72$ metrov.
4. Preverimo: $108 + 72 = 180$, kar je cel jarek.
5. Odgovor: srečata se po $9$ urah, bager A izkoplje $108\,\mathrm{m}$.

### Primer 3 (težji): koliko cementa dodati

Zidar ima $30\,\mathrm{kg}$ suhe mešanice, v kateri je $20\,\%$ cementa. Za močnejšo malto potrebuje $25\,\%$ cementa. Koliko kilogramov čistega cementa mora dodati?

**Podatki:** $m = 30\,\mathrm{kg}$, delež cementa $20\,\%$, želeni delež $25\,\%$, dodajamo čisti cement
**Iščemo:** maso dodanega cementa $x$

:::formula
$\text{delež} = \dfrac{\text{masa cementa}}{\text{masa mešanice}}$, torej $\dfrac{6 + x}{30 + x} = 0{,}25$
:::

**Rešitev:**

1. Cementa je zdaj $0{,}2 \cdot 30 = 6$ kilogramov.
2. Ko dodamo $x$ kilogramov, se poveča masa cementa in tudi masa vse mešanice: $\dfrac{6 + x}{30 + x} = 0{,}25$.
3. Pomnožimo z imenovalcem: $6 + x = 7{,}5 + 0{,}25x$.
4. Uredimo: $0{,}75x = 1{,}5$, zato $x = 2$.
5. Preverimo: $\dfrac{8}{32} = 0{,}25$.
6. Odgovor: dodati mora $2\,\mathrm{kg}$ cementa.

### Primer 4 – zdaj ti: pot nazaj

Kombi pelje material na gradbišče, ki je $60\,\mathrm{km}$ daleč. Zaradi gneče vozi tja s povprečno hitrostjo $30\,\mathrm{km/h}$. Kako hitro mora voziti nazaj, da bo povprečna hitrost za vso pot $40\,\mathrm{km/h}$?

**Podatki:** $s = 60\,\mathrm{km}$ v eno smer, $v_1 = 30\,\mathrm{km/h}$, $v_\mathrm{p} = 40\,\mathrm{km/h}$
**Iščemo:** hitrost nazaj $v_2$

:::formula
$v_\mathrm{p} = \dfrac{\text{celotna pot}}{\text{celotni čas}}$
:::

**Rešitev:**

1. Tja potrebuje $60 : 30 = 2$ uri.
2. Za $120$ kilometrov (tja in nazaj) s povprečjem $40\,\mathrm{km/h}$ sme porabiti $120 : 40 = 3$ ure.
3. Izračunaj čas za pot nazaj in hitrost sam:

:::premisli
Kolikšna je hitrost $v_2$?
---
Za pot nazaj ostane $3 - 2 = 1$ ura, zato je $v_2 = 60\,\mathrm{km} : 1\,\mathrm{h} = 60\,\mathrm{km/h}$. Ne $50\,\mathrm{km/h}$, kot bi dalo povprečenje hitrosti.
:::

## Pogoste napake

- **Povprečje časov.** Žanov račun $\dfrac{6 + 12}{2} = 9$ ur je napačen, ker časi skupnega dela niso količina, ki bi se seštevala. Skupni čas mora biti krajši od časa hitrejšega delavca. Seštej hitrosti dela $\dfrac{1}{t}$ in obrni.
- **Povprečje hitrosti.** $\dfrac{60 + 40}{2} = 50$ bi veljalo le, če bi kombi z obema hitrostma vozil enako dolgo. Ker počasneje vozi dlje, je povprečje manjše. Vedno računaj celotno pot, deljeno s celotnim časom.
- **Zamenjana znaka pri srečevanju.** Kdor pri dohitevanju sešteje hitrosti, dobi prekratek čas. Vprašaj se, za koliko se razmik zmanjša v eni uri: nasproti $v_1 + v_2$, v isto smer $v_1 - v_2$.
- **Pozabljena nova masa mešanice.** Kdor pri Primeru 3 doda $5\,\%$ od $30\,\mathrm{kg}$, torej $1{,}5\,\mathrm{kg}$, pozabi, da se z dodajanjem poveča tudi masa mešanice. Tako dobi le približno $23{,}8\,\%$. Vedno zapiši delež kot ulomek s posodobljenim imenovalcem.
- **Decimalne ure.** $1{,}2\,\mathrm{h}$ ni $1\,\mathrm{h}\,20\,\mathrm{min}$, ampak $1\,\mathrm{h}\,12\,\mathrm{min}$, ker je $0{,}2 \cdot 60 = 12$.

## Povzetek

- Hitrost dela: kdor konča v času $t$, opravi $\dfrac{1}{t}$ dela na uro. Pri skupnem delu se hitrosti seštevajo: $\dfrac{1}{t} = \dfrac{1}{t_1} + \dfrac{1}{t_2}$.
- Povprečna hitrost je celotna pot, deljena s celotnim časom. Za enaki poti: $\dfrac{2v_1v_2}{v_1 + v_2}$, pri različnih hitrostih vedno manj od navadnega povprečja.
- Srečevanje: čas je razdalja, deljena s $v_1 + v_2$ (nasproti) ali $v_1 - v_2$ (dohitevanje).
- Mešanice: seštevaj količine snovi, ne odstotkov. Pri dodajanju se spremeni tudi celotna količina.
- Rezultat preveri: skupni čas je krajši od najkrajšega, mešanica je med obema odstotkoma.

## Drugače: Korak za korakom s številkami

Vsako od štirih vrst rešiš z istim receptom: najprej poišči količino, ki se sešteva.

1. **Skupno delo** (Jure $6\,\mathrm{h}$, vajenec $12\,\mathrm{h}$): $\dfrac{1}{6} = \dfrac{2}{12}$, $\dfrac{2}{12} + \dfrac{1}{12} = \dfrac{3}{12} = \dfrac{1}{4}$ na uro, torej $4\,\mathrm{h}$.
2. **Povprečna hitrost** ($120\,\mathrm{km}$ tja s $60$, nazaj s $40$): časa $2\,\mathrm{h}$ in $3\,\mathrm{h}$, skupaj $5\,\mathrm{h}$; pot $240\,\mathrm{km}$; $240 : 5 = 48\,\mathrm{km/h}$.
3. **Srečevanje** (jarek $180\,\mathrm{m}$, $12$ in $8\,\mathrm{m/h}$): približevanje $20\,\mathrm{m/h}$; $180 : 20 = 9\,\mathrm{h}$.
4. **Mešanica** ($10\,\mathrm{kg}$ z $10\,\%$ in $30\,\mathrm{kg}$ s $30\,\%$): cement $1 + 9 = 10\,\mathrm{kg}$; vsega $40\,\mathrm{kg}$; $10 : 40 = 25\,\%$.
5. **Preizkus smisla**: $4\,\mathrm{h} < 6\,\mathrm{h}$; $48$ je med $40$ in $60$; $25\,\%$ je med $10\,\%$ in $30\,\%$.

## Drugače: Kot zgodba

Nekega jutra mojster Jure in vajenec prideta v hišo, kjer naj kopalnico obložita s ploščicami. Jure ve, da bi sam delal $6$ ur. Na steno nariše dvanajst enakih pasov. »Jaz bom vsako uro naredil dva pasova, ti enega. Skupaj trije na uro.« Po štirih urah je vseh dvanajst pasov pokritih. Vajenec se čudi: »Žan je rekel devet ur!«

Popoldne vajenec s kombijem odpelje ostanke na deponijo. Tja vozi hitro, nazaj v gneči počasi. Opazi, da mu počasni del vzame več ur. Zato povprečna hitrost ni na sredini, ampak bližje počasni.

Zvečer meša malto. Ena vreča ima malo cementa, druga veliko, a druge je trikrat več. Mešanica se zato »nagne« proti močnejši vreči. Vajenec si zapiše v zvezek: *seštevaj delo, pot, čas in kilograme, nikoli ur skupnega dela, hitrosti na delih poti ali odstotkov.*

## Preveri se

? Katero pravilo bi Žana obvarovalo pred napako?
- Pri skupnem delu je skupni čas povprečje časov posameznikov.
~ Povprečje je daljše od časa hitrejšega, kar bi pomenilo, da pomočnik zavira. Seštejejo se hitrosti dela.
+ Pri skupnem delu se seštevajo hitrosti dela $\dfrac{1}{t}$, ne časi.
- Pri skupnem delu se seštevajo časi posameznikov.
~ Vsota časov je še daljša. Dva delavca končata prej kot vsak sam.
> Kdor konča v času $t$, opravi $\dfrac{1}{t}$ dela na uro. Te deleže seštejemo, skupni čas je obratna vrednost vsote.

? Ena črpalka izčrpa vodo iz gradbene jame v $2$ urah, druga v $3$ urah. Koliko časa potrebujeta skupaj?
- $2{,}5\,\mathrm{h}$
~ To je povprečje časov. Skupni čas mora biti krajši od $2$ ur.
- $1\,\mathrm{h}\,20\,\mathrm{min}$
~ Pravilno je $1{,}2\,\mathrm{h}$, a $0{,}2\,\mathrm{h}$ je $12$ minut, ne $20$.
+ $72\,\mathrm{min}$
- $5\,\mathrm{h}$
~ To je vsota časov. Skupaj delata hitreje, zato je čas krajši.
> $\dfrac{1}{2} + \dfrac{1}{3} = \dfrac{5}{6}$ jame na uro, torej $\dfrac{6}{5}\,\mathrm{h} = 1{,}2\,\mathrm{h} = 72\,\mathrm{min}$.

? Tesar gre peš do gozdne koče s hitrostjo $4\,\mathrm{km/h}$, nazaj po isti poti s $6\,\mathrm{km/h}$. Rešitev: »Povprečna hitrost je $\dfrac{4 + 6}{2} = 5\,\mathrm{km/h}$.« Kje je napaka?
- Napake ni, pot je obakrat enaka.
~ Enaka pot pomeni različna časa: počasneje hodi dlje. Zato povprečje ni na sredini.
+ Povprečna hitrost je celotna pot, deljena s celotnim časom; pravilno je $4{,}8\,\mathrm{km/h}$.
- Hitrosti bi morali sešteti: $10\,\mathrm{km/h}$.
~ Seštevamo hitrosti pri srečevanju, ne pri povprečni hitrosti enega pešca.
> Za enaki poti je $v_\mathrm{p} = \dfrac{2 \cdot 4 \cdot 6}{4 + 6} = 4{,}8\,\mathrm{km/h}$, manj od $5$, ker počasneje hodi dlje časa.

? Mešanica A: $1\,\mathrm{L}$ barve z $10\,\%$ pigmenta in $1\,\mathrm{L}$ s $30\,\%$. Mešanica B: $1\,\mathrm{L}$ z $10\,\%$ in $3\,\mathrm{L}$ s $30\,\%$. Katera ima večji delež pigmenta?
- A
~ A je ravno na sredini, $20\,\%$. V B je več močnejše barve, zato je bolj nagnjena proti $30\,\%$.
+ B
- Enaki sta, ker sta iz istih dveh barv.
~ Pomembno je tudi razmerje količin, ne le vrsta barv.
> A: $\dfrac{0{,}1 + 0{,}3}{2} = 20\,\%$. B: $\dfrac{0{,}1 + 0{,}9}{4} = 25\,\%$.

? Delavec ob $7.00$ odpelje s kolesom z gradbišča s hitrostjo $15\,\mathrm{km/h}$. Ob $7.20$ za njim po isti cesti odpelje šef z avtom s hitrostjo $45\,\mathrm{km/h}$, ker je delavec pozabil orodje. Kdaj ga dohiti?
- Ob $7.25$
~ Hitrosti si seštel. Pri dohitevanju se razmik zmanjšuje le za razliko $30\,\mathrm{km/h}$.
- Ob $7.10$
~ $10$ minut je pravilen čas vožnje, a šteje od $7.20$, ko šef odpelje.
+ Ob $7.30$
> Do $7.20$ delavec prevozi $15 \cdot \dfrac{1}{3} = 5\,\mathrm{km}$. Razmik se manjša za $45 - 15 = 30\,\mathrm{km/h}$, torej $\dfrac{5}{30}\,\mathrm{h} = 10\,\mathrm{min}$. Dohiti ga ob $7.30$.

:::simboli
t | čas skupnega dela | \frac{1}{t} = \frac{1}{t_1} + \frac{1}{t_2} | h | pri bagrih čas do srečanja
t_1, t_2 | časa posameznikov za celo delo | | h |
d | dolžina jarka | | m |
v_A, v_B | hitrosti kopanja bagrov A in B | | m/h |
s_A | dolžina, ki jo izkoplje bager A | s_A = v_A \cdot t | m |
x | masa dodanega cementa | | kg |
m | masa suhe mešanice pred dodajanjem | | kg |
v_1, v_2 | hitrosti dveh udeležencev ali hitrosti na delih poti | | km/h |
s | pot | | km | v $v_\mathrm{p} = \dfrac{s}{t}$ celotna pot (tam je $t$ celotni čas); v Primeru 4 pot v eno smer
v_\mathrm{p} | povprečna hitrost | v_\mathrm{p} = \frac{\text{celotna pot}}{\text{celotni čas}} | km/h |
:::
