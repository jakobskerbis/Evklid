---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta 1619 je Johannes Kepler izdal knjigo *Harmonices Mundi* (Harmonija sveta). Iskal je »glasbo sfer«: verjel je, da so gibanja planetov urejena kot glasbeni intervali. Našel je zanimivo ujemanje. Ko je Zemlja najbližje Soncu, okoli njega kroži hitreje kot takrat, ko je najdlje. Razmerje obeh kotnih hitrosti, gledano s Sonca, je približno $16 : 15$. To je v glasbi poltonski korak, od mi do fa.

V isti knjigi je objavil še eno pravilo, ki ga danes imenujemo 3. Keplerjev zakon: planet, ki je dlje od Sonca, potrebuje za en obhod veliko več časa. Natančneje: kvadrat obhodnega časa je sorazmeren s kubom razdalje od Sonca, $t_0^2 \propto r^3$. Kepler je znal opisati, **kako** se planeti gibljejo, ni pa znal pravilno pojasniti, **zakaj**. Slutil je, da planete poganja neka sila s Sonca, a jo je opisal napačno. Kaj jih sploh drži na tirih?

Odgovor je pozneje dal Isaac Newton z gravitacijskim zakonom. Z njim danes izračunamo, kako hitro mora leteti vesoljska postaja, in na kateri višini mora krožiti satelit, s katerega gledamo televizijo ali poslušamo radio.

## Razlaga

**Dve telesi na sliki.** Začnimo z risbo dveh krogel. Vsaka vleče drugo k sebi.

:::risba skica
opis: Dve krogli, levo večja z maso m₁, desno manjša z maso m₂. Na vsako deluje enako dolga puščica gravitacijske sile proti drugi krogli. Spodaj je označena razdalja r med središčema krogel.
območje: 0; -2,4 .. 10; 2
krog: 2; 0 | 1,2 | modra
krog: 8; 0 | 0,7 | oranžna
točka: 2; 0 | m_1 | pod
točka: 8; 0 | m_2 | pod
puščica: 3,3; 0 -> 4,8; 0 | F_g | nad | puščica
puščica: 7,2; 0 -> 5,7; 0 | F_g | nad | puščica
črta: 2; -1,8 -> 8; -1,8 | siva
črta: 2; -1,5 -> 2; -2,1 | siva
črta: 8; -1,5 -> 8; -2,1 | siva
napis: 5; -1,8 | r (med središčema) | pod
podnapis: Telesi se privlačita z enako veliko silo; r merimo od središča do središča.
:::

Iz risbe preberemo tri stvari. Sili sta enako dolgi in nasprotno usmerjeni, kot zahteva 3. Newtonov zakon. Sila deluje vzdolž zveznice središč. Razdaljo $r$ merimo med **središčema**, ne med površjema.

**Kako je sila odvisna od razdalje?** Newton je primerjal dve telesi, ki ju Zemlja pospešuje: jabolko na površju in Luno. Luna je od središča Zemlje približno $60$ Zemljinih polmerov ($384\,000\,\mathrm{km}$) in jo obkroži v $27{,}3$ dneh. Njen centripetalni pospešek izračunamo iz enakomernega kroženja.

| Telo | razdalja $r$ | pospešek |
|---|---|---|
| jabolko | $1\,R_Z$ | $9{,}81\,\mathrm{m/s^2}$ |
| Luna | $60\,R_Z$ | $0{,}00272\,\mathrm{m/s^2}$ |

Razdalja je $60$-krat večja, pospešek pa $9{,}81 : 0{,}00272 \approx 3600$-krat manjši. In $60^2 = 3600$. Privlak Zemlje je torej **obratno sorazmeren s kvadratom razdalje**: pri dvakratni razdalji je štirikrat manjši, pri trikratni devetkrat.

**Kako je sila odvisna od mas?** Telo z dvakrat večjo maso Zemlja vleče z dvakrat večjo silo (teža $mg$). Ker telesi delujeta druga na drugo enako, mora sila na enak način rasti tudi z maso drugega telesa. Če bi bila sorazmerna le z $m_1$, bi bila sila jabolka na Zemljo drugačna od sile Zemlje na jabolko, kar krši 3. Newtonov zakon. Zato vsebuje produkt $m_1 m_2$. Vse skupaj zapišemo v **gravitacijski zakon**:

$$F_g = G\,\frac{m_1 m_2}{r^2}$$

$G = 6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2}$ je **gravitacijska konstanta**, enaka za vsa telesa v vesolju. Zakon natančno velja za krogelno simetrična telesa (npr. homogene krogle) in za telesa, ki so majhna v primerjavi z razdaljo med njima. Ker je $G$ tako majhen, je privlak med predmeti v sobi neznaten. Opazen postane, ko je vsaj eno telo velikansko, kot planet.

**Težni pospešek na različnih razdaljah.** Za telo z maso $m$ na površju Zemlje vstavimo maso Zemlje $M_Z = 5{,}97 \cdot 10^{24}\,\mathrm{kg}$ in $r = R_Z = 6370\,\mathrm{km}$. Sila mora biti ravno teža $mg$:

$$G\,\frac{M_Z\, m}{R_Z^2} = m g$$

$$g = \frac{G M_Z}{R_Z^2}$$

Števec je $G M_Z = 6{,}67 \cdot 10^{-11} \cdot 5{,}97 \cdot 10^{24} \approx 3{,}98 \cdot 10^{14}\,\mathrm{m^3/s^2}$; ta produkt bomo potrebovali pri satelitih. Iz tega dobimo $g \approx 9{,}81\,\mathrm{m/s^2}$. Višje nad Zemljo ali na drugem planetu je težni pospešek drugačen: $g = \dfrac{G M}{r^2}$.

:::premisli
Satelit kroži $6370\,\mathrm{km}$ nad površjem Zemlje. Kolikšen del svoje teže na tleh ima tam? Napovej, preden pogledaš graf spodaj.
---
Četrtino. Višina je en Zemljin polmer, zato je satelit od središča oddaljen $2\,R_Z$. Razdalja od središča se je podvojila, sila je štirikrat manjša. Kdor vzame za $r$ samo višino, dobi napačen rezultat.
:::

:::risba graf
opis: Graf težnega pospeška g v odvisnosti od razdalje r od središča Zemlje, merjene v Zemljinih polmerih, od 1 do 8. Krivulja pada vedno počasneje. V aplikaciji drsnik izbere razdaljo; izbrano je r = {d}-kratnik Zemljinega polmera, kjer je g = {9.81/(d*d):.2} m/s².
x: 0 .. 8 | 1 | r [R_Z]
y: 0 .. 12 | 2 | g [m/s^2]
drsnik: d | 1 .. 6 | 0,5 | 2 | razdalja od središča v Zemljinih polmerih
f: 9.81/x^2 | modra | 1 .. 8
črta: d; 0 -> d; 9.81/d^2 | siva črtkano
točka: d; 9.81/d^2 | {9.81/(d*d):.2} | nad desno | oranžna
podnapis: Pri r = {d}-kratniku Zemljinega polmera je g = {9.81/(d*d):.2} m/s²: vrednost s površja, deljena z {d*d}.
:::

Napoved preveri na grafu. V aplikaciji premikaj drsnik od $1$ do $6$. Opazi: pri $r = 2\,R_Z$ je $g = 2{,}45\,\mathrm{m/s^2}$, četrtina vrednosti na tleh, pri $3\,R_Z$ pa le še devetina, $1{,}09\,\mathrm{m/s^2}$. Krivulja se hitro položi, a nikoli ne pade na nič.

:::premisli
Jabolko vleče Zemljo z enako veliko silo kot Zemlja jabolko. Zakaj potem jabolko pade na Zemljo in ne Zemlja na jabolko?
---
Enaka sila ne pomeni enakega pospeška. Po 2. Newtonovem zakonu je $a = \dfrac{F}{m}$. Masa Zemlje je več kot $10^{25}$-krat večja od mase jabolka, zato je njen pospešek nemerljivo majhen.
:::

**Sateliti in planeti.** Kamen na vrvici kroži, ker mu vrvica daje centripetalno silo. Satelit nima vrvice; njeno vlogo prevzame gravitacija.

:::risba skica
opis: Zemlja v središču in satelit na krožnem tiru nad njo. Na satelit deluje gravitacijska sila navzdol proti središču Zemlje, hitrost v kaže vodoravno po tangenti. Na desni je razdalja od središča do tira razdeljena na polmer Zemlje in višino h; skupaj je to r.
območje: -5,6; -6,6 .. 5,6; 6,4
enota: 26
črta: 5,00; 0,00 -> 4,94; 0,78 -> 4,76; 1,55 -> 4,46; 2,27 -> 4,05; 2,94 -> 3,54; 3,54 -> 2,94; 4,05 -> 2,27; 4,46 -> 1,55; 4,76 -> 0,78; 4,94 -> 0,00; 5,00 -> -0,78; 4,94 -> -1,55; 4,76 -> -2,27; 4,46 -> -2,94; 4,05 -> -3,54; 3,54 -> -4,05; 2,94 -> -4,46; 2,27 -> -4,76; 1,55 -> -4,94; 0,78 -> -5,00; 0,00 -> -4,94; -0,78 -> -4,76; -1,55 -> -4,46; -2,27 -> -4,05; -2,94 -> -3,54; -3,54 -> -2,94; -4,05 -> -2,27; -4,46 -> -1,55; -4,76 -> -0,78; -4,94 -> 0,00; -5,00 -> 0,78; -4,94 -> 1,55; -4,76 -> 2,27; -4,46 -> 2,94; -4,05 -> 3,54; -3,54 -> 4,05; -2,94 -> 4,46; -2,27 -> 4,76; -1,55 -> 4,94; -0,78 -> 5,00; 0,00 | siva črtkano
krog: 0; 0 | 2,5 | modra
točka: 0; 0 | | | modra
napis: -1,1; -1,2 | Zemlja | sredina
točka: 0; 5 | satelit | nad levo | oranžna
puščica: 0; 5 -> 2,4; 5 | v | nad | puščica
puščica: 0; 5 -> 0; 3,3 | F_g | levo | puščica debelo
črta: 0; 0 -> 5; 0 | siva
napis: 1,25; 0 | R_Z | nad
napis: 3,75; 0 | h | nad
točka: 2,5; 0 | | | siva
črta: 0; -5,9 -> 5; -5,9 | siva
črta: 0; -5,6 -> 0; -6,2 | siva
črta: 5; -5,6 -> 5; -6,2 | siva
napis: 2,5; -5,9 | r = R_Z + h | pod
podnapis: Gravitacija kaže proti središču, hitrost po tangenti.
:::

Na risbi kaže sila $F_g$ proti središču, hitrost $v$ pa pravokotno nanjo. Sila satelita ne zavira, le zavija mu smer. Pri krožnem tiru mora biti gravitacijska sila ravno enaka potrebni centripetalni sili:

$$G\,\frac{M m}{r^2} = \frac{m v^2}{r}$$

$$v = \sqrt{\frac{G M}{r}}$$

Tu je $M$ masa osrednjega telesa. Masa satelita $m$ se pokrajša: majhen satelit in velika postaja na istem tiru letita enako hitro.

Dlje od središča je hitrost manjša, pot okoli pa daljša, zato obhodni čas hitro raste. Hitrost vstavimo v $t_0 = \dfrac{2\pi r}{v}$ in kvadriramo:

$$t_0^2 = \frac{4\pi^2}{G M}\, r^3$$

Ulomek pred $r^3$ je odvisen le od mase osrednjega telesa. Za vse planete okoli Sonca je razmerje $\dfrac{t_0^2}{r^3}$ enako. To je Keplerjevo pravilo iz leta 1619, ki ga je Newton zdaj tudi pojasnil. Pri eliptičnem tiru namesto $r$ vstavimo **veliko polos**, polovico najdaljšega premera elipse.

:::risba graf
opis: Hitrost satelita na krožnem tiru okoli Zemlje v odvisnosti od polmera tira r v tisočih kilometrov, od 6,37 do 60. Označeni so ISS pri 6,79 in 7,66 km/s, sateliti GPS pri 26,6 in 3,87 km/s ter geostacionarni sateliti pri 42,2 in 3,07 km/s. V aplikaciji drsnik izbere polmer; izbrano je r = {s} tisoč km, kjer je v = {sqrt(398.6/s):.2} km/s in obhodni čas {2*pi*s/sqrt(398.6/s)/3.6:.1} h.
x: 0 .. 60 | 10 | r [1000 km]
y: 0 .. 9 | 1 | v [km/s]
drsnik: s | 6,8 .. 42,2 | 0,2 | 10 | polmer tira v tisočih km
f: sqrt(398.6/x) | modra | 6,37 .. 60
točka: 6,79; 7,66 | ISS | levo
točka: 26,6; 3,87 | GPS | nad
točka: 42,2; 3,07 | GEO | pod
črta: s; 0 -> s; sqrt(398.6/s) | oranžna črtkano
točka: s; sqrt(398.6/s) | {sqrt(398.6/s):.2} | nad desno | oranžna
podnapis: Pri r = {s} tisoč km je v = {sqrt(398.6/s):.2} km/s, en obhod traja {2*pi*s/sqrt(398.6/s)/3.6:.1} h.
:::

Oznaka GEO na grafu pomeni geostacionarni tir (primer 3). V aplikaciji premikaj drsnik od ISS proti GEO. Opazi dvoje: hitrost pada, obhodni čas pa raste mnogo hitreje, od približno $1{,}5\,\mathrm{h}$ do $24\,\mathrm{h}$. Polmer se poveča približno $6$-krat, obhodni čas pa $16$-krat, ker $t_0$ raste z $r^{3/2}$.

V simulaciji spodaj (»Gravitacijski zakon in orbite«) nastavi začetno hitrost na $1{,}00$-kratnik krožne: tir je krožnica. Nato jo zmanjšaj na $0{,}80$. Tir postane elipsa, planet pa je blizu zvezde hitrejši kot daleč od nje. To je isti pojav, ki ga je Kepler pri Zemlji zapisal kot polton. Zemljin tir je skoraj krožnica, zato je pri njej razlika le $16 : 15$.

## Rešeni primeri

### Primer 1: dva koncertna klavirja

Na velikem odru stojita dva koncertna klavirja. Recimo, da ima vsak maso približno $480\,\mathrm{kg}$ in da sta njuni težišči $5\,\mathrm{m}$ narazen. S kolikšno silo se privlačita? Primerjaj jo s težo klavirja. Klavirja obravnavaj kot točkasti telesi; ker nista krogli, dobiš le red velikosti.

**Podatki:** $m_1 = m_2 = 480\,\mathrm{kg}$, $r = 5\,\mathrm{m}$, $G = 6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** gravitacijsko silo $F_g$ med klavirjema

:::formula
$F_g = G\,\dfrac{m_1 m_2}{r^2}$
:::

**Rešitev:**

1. Produkt mas: $480 \cdot 480 = 230\,400$, torej $230\,400\,\mathrm{kg^2}$. Kvadrat razdalje: $5^2 = 25$, torej $25\,\mathrm{m^2}$.
2. Vstavimo v zakon: $F_g = 6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2} \cdot \dfrac{230\,400\,\mathrm{kg^2}}{25\,\mathrm{m^2}} \approx 6{,}1 \cdot 10^{-7}\,\mathrm{N}$.
3. Teža klavirja za primerjavo: $480 \cdot 9{,}81 = 4708{,}8$, torej okoli $4710\,\mathrm{N}$, kar je več kot milijardokrat več.
4. Odgovor: klavirja se privlačita s silo reda velikosti $6 \cdot 10^{-7}\,\mathrm{N}$. Trenje s tlemi je neprimerno večje, zato se ne premakneta.

### Primer 2: bobni na Luni

Bend bi za koncert v lunarni bazi pripeljal bobne z maso $40\,\mathrm{kg}$. Kolikšna je njihova teža na Luni in kolikokrat je manjša kot na Zemlji? Masa Lune je $7{,}35 \cdot 10^{22}\,\mathrm{kg}$, njen polmer $1740\,\mathrm{km}$.

**Podatki:** $m = 40\,\mathrm{kg}$, $M_L = 7{,}35 \cdot 10^{22}\,\mathrm{kg}$, $R_L = 1740\,\mathrm{km}$, $G = 6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2}$, na Zemlji $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** težo $F_L$ na Luni in razmerje s težo na Zemlji

:::formula
$g_L = \dfrac{G M_L}{R_L^2}$, nato $F_L = m\, g_L$
:::

**Rešitev:**

1. Polmer v metrih, ker je $G$ v metrih: $R_L = 1{,}74 \cdot 10^6\,\mathrm{m}$, $R_L^2 \approx 3{,}03 \cdot 10^{12}\,\mathrm{m^2}$.
2. Števec: $G M_L \approx 4{,}90 \cdot 10^{12}\,\mathrm{N\,m^2/kg}$.
3. Težni pospešek na Luni: $g_L \approx \dfrac{4{,}90 \cdot 10^{12}}{3{,}03 \cdot 10^{12}}\,\mathrm{m/s^2} \approx 1{,}62\,\mathrm{m/s^2}$.
4. Teža na Luni: $40 \cdot 1{,}62 = 64{,}8$, torej $F_L \approx 65\,\mathrm{N}$. Na Zemlji: $40 \cdot 9{,}81 = 392{,}4$, torej okoli $392\,\mathrm{N}$.
5. Razmerje: $9{,}81 : 1{,}62 \approx 6{,}1$.
6. Odgovor: bobni na Luni tehtajo okoli $65\,\mathrm{N}$, približno šestkrat manj kot na Zemlji. Masa ostane $40\,\mathrm{kg}$, zato jih je enako težko pospešiti ali ustaviti.

### Primer 3: satelit za televizijo in radio

Satelit, s katerega sprejemamo televizijske in radijske programe, mora biti nad istim krajem na ekvatorju ves čas. Zato obkroži Zemljo v istem času, kot se Zemlja zavrti okoli osi: v $23\,\mathrm{h}\,56\,\mathrm{min}$. Na kolikšni višini nad površjem kroži?

**Podatki:** $t_0 = 23\,\mathrm{h}\,56\,\mathrm{min}$, $G M_Z = 3{,}98 \cdot 10^{14}\,\mathrm{m^3/s^2}$, $R_Z = 6370\,\mathrm{km}$
**Iščemo:** polmer tira $r$ in višino $h$ nad površjem

:::formula
$t_0^2 = \dfrac{4\pi^2}{G M_Z}\, r^3$, torej $r = \sqrt[3]{\dfrac{G M_Z\, t_0^2}{4\pi^2}}$; nato $h = r - R_Z$
:::

**Rešitev:**

1. Čas v sekundah: $23 \cdot 3600 + 56 \cdot 60 = 86\,160$, torej $t_0 = 86\,160\,\mathrm{s}$.
2. Kvadrat časa: $t_0^2 \approx 7{,}42 \cdot 10^{9}\,\mathrm{s^2}$.
3. Pod korenom: $\dfrac{G M_Z\, t_0^2}{4\pi^2} \approx 7{,}48 \cdot 10^{22}\,\mathrm{m^3}$.
4. Tretji koren: $r \approx 4{,}214 \cdot 10^7\,\mathrm{m} = 42\,140\,\mathrm{km}$. To je polmer tira, merjen od **središča**.
5. Višina nad površjem: $h = 42\,140\,\mathrm{km} - 6370\,\mathrm{km} \approx 35\,800\,\mathrm{km}$, ker odštejemo Zemljin polmer.
6. Odgovor: satelit kroži približno $35\,800\,\mathrm{km}$ nad ekvatorjem. Tak tir imenujemo **geostacionarni**. Zato satelitska antena na hiši ves čas gleda v isto točko neba.

### Primer 4: zdaj ti

Leta 2013 je astronavt Chris Hadfield na Mednarodni vesoljski postaji (ISS) s kitaro posnel pesem *Space Oddity*; videospot pogosto navajajo kot prvega, posnetega v vesolju. Postaja kroži po krožnici s polmerom $6790\,\mathrm{km}$ okoli središča Zemlje. Kako hitro leti in koliko časa traja en obhod, torej ena »kitica« okoli Zemlje?

**Podatki:** $r = 6790\,\mathrm{km}$, $G M_Z = 3{,}98 \cdot 10^{14}\,\mathrm{m^3/s^2}$
**Iščemo:** hitrost $v$ in obhodni čas $t_0$

:::formula
$v = \sqrt{\dfrac{G M_Z}{r}}$, nato $t_0 = \dfrac{2\pi r}{v}$
:::

**Rešitev:**

1. Pretvorimo: $r = 6{,}79 \cdot 10^6\,\mathrm{m}$.
2. $\dfrac{G M_Z}{r} \approx 5{,}86 \cdot 10^7\,\mathrm{m^2/s^2}$; obseg tira $2\pi r \approx 4{,}27 \cdot 10^7\,\mathrm{m}$.
3. Izračunaj koren in nato še obhodni čas sam, potem preveri:

:::premisli
Napovej najprej: bo ISS hitrejša ali počasnejša od geostacionarnega satelita iz primera 3? Nato izračunaj $v$ in $t_0$.
---
Hitrejša, ker je bližje središču Zemlje. $v = \sqrt{5{,}86 \cdot 10^7}\,\mathrm{m/s} \approx 7660\,\mathrm{m/s}$ in $t_0 = \dfrac{4{,}27 \cdot 10^7\,\mathrm{m}}{7660\,\mathrm{m/s}} \approx 5570\,\mathrm{s}$, kar je okoli $93\,\mathrm{min}$. Ker je $86\,400\,\mathrm{s} : 5570\,\mathrm{s} \approx 15{,}5$, je Hadfield Zemljo obkrožil 15- do 16-krat na dan.
:::

## Pogoste napake

- **Razdalja od površja.** V zakon vstavljaš razdaljo med središčema. Za ISS, ki je $420\,\mathrm{km}$ nad tlemi, je $r = 6370\,\mathrm{km} + 420\,\mathrm{km} = 6790\,\mathrm{km}$, ne $420\,\mathrm{km}$. Kdor vstavi $420\,\mathrm{km}$, dobi težni pospešek nekaj tisoč $\mathrm{m/s^2}$, kar ne more biti res.
- **»Dvakrat dlje, pol manjša sila.«** Razdalja je v imenovalcu na kvadrat. Dvakratna razdalja pomeni štirikrat manjšo silo, trikratna devetkrat manjšo.
- **»Zemlja vleče jabolko močneje kot jabolko Zemljo.«** Sili sta enako veliki in nasprotno usmerjeni. Različna sta le pospeška, ker sta masi zelo različni.
- **»Na ISS ni gravitacije.«** Na višini postaje ($420\,\mathrm{km}$) je težni pospešek še okoli $8{,}6\,\mathrm{m/s^2}$. Astronavti in Hadfieldova kitara lebdijo, ker skupaj s postajo prosto padajo okoli Zemlje.
- **»Višji satelit mora leteti hitreje« ali »težji satelit mora leteti hitreje«.** Iz $v = \sqrt{\dfrac{G M}{r}}$ sledi, da je na višjem tiru hitrost manjša, masa satelita pa sploh ne nastopa.

## Povzetek

- Gravitacijski zakon: $F_g = G\,\dfrac{m_1 m_2}{r^2}$, $G = 6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2}$; $r$ je razdalja med središčema.
- Obe telesi se privlačita z enako veliko silo; sila je obratno sorazmerna s kvadratom razdalje (Newtonova primerjava jabolka in Lune).
- Težni pospešek: $g = \dfrac{G M}{r^2}$; na površju Zemlje $9{,}81\,\mathrm{m/s^2}$, na Luni $1{,}62\,\mathrm{m/s^2}$.
- Pri satelitih in planetih je gravitacija centripetalna sila: $v = \sqrt{\dfrac{G M}{r}}$, neodvisno od mase satelita.
- Višje je hitrost manjša in obhodni čas daljši; $\dfrac{t_0^2}{r^3}$ je enak za vsa telesa okoli istega središča (3. Keplerjev zakon; pri elipsi namesto $r$ velika polos). Geostacionarni satelit kroži okoli $35\,800\,\mathrm{km}$ nad ekvatorjem.

## Drugače: Z analogijo

Gravitacija se z razdaljo »redči« podobno kot zvok iz zvočnika na prostem. Zvočnik odda vsako sekundo enako energijo, ta pa se razširi po krogli okoli njega. Površina krogle je $4\pi r^2$. Dvakrat dlje se ista energija porazdeli po štirikrat večji površini, zato je jakost zvoka tam štirikrat manjša.

| razdalja | površina | jakost |
|---|---|---|
| $1\,\mathrm{m}$ | $4\pi\,\mathrm{m^2}$ | $I$ |
| $2\,\mathrm{m}$ | $16\pi\,\mathrm{m^2}$ | $I/4$ |
| $3\,\mathrm{m}$ | $36\pi\,\mathrm{m^2}$ | $I/9$ |

Če si gravitacijo predstavljamo kot »silnice«, ki se redčijo po vse večjih kroglah okoli Zemlje, dobimo isti $1/r^2$. To je slika, ne dokaz: Newton je zakon dobil iz Lune (zgoraj). Razlika je ena: zvok lahko stena zaustavi, gravitacije ne zaustavi nič.

## Drugače: Iz vsakdanjega življenja

Na vrhu visokega stolpa stoji bobnar in vodoravno vrže paličico. Pri počasnem metu pade blizu stolpa, pri hitrejšem dlje. Zemlja je okrogla, zato se tla pod paličico ves čas malo »umikajo« navzdol.

Zamisli si met s hitrostjo skoraj $8\,\mathrm{km/s}$ brez zračnega upora. Paličica bi ves čas padala, tla pa bi se umikala enako hitro. Nikoli ne bi pristala, ampak bi obkrožila Zemljo. To je satelit: telo, ki pada, a ves čas zgreši tla.

Zato je Hadfieldova kitara na ISS lebdela. Gravitacija je delovala nanjo, a je padala skupaj s postajo in astronavtom. Podoben občutek imaš za hip v dvigalu, ki naglo spelje navzdol.

## Preveri se

? Katera trditev o gravitacijski sili med dvema telesoma **ne** drži?
- Deluje med vsemi telesi, tudi med dvema klavirjema.
~ To drži: zakon velja za vsa telesa, sila je le zelo majhna, kadar sta obe masi majhni.
- Pri trikratni razdalji med središčema je devetkrat manjša.
~ To drži: razdalja je v imenovalcu na kvadrat, $3^2 = 9$.
+ Težje telo vleče lažje močneje, kot lažje vleče težje.
- Razdaljo merimo med središčema teles.
~ To drži: pri satelitu je to polmer tira, ne višina nad tlemi.
> Sili sta po 3. Newtonovem zakonu enako veliki; v formuli lahko $m_1$ in $m_2$ zamenjaš, pa se sila ne spremeni. Različna sta le pospeška.

? Graf kaže silo Zemlje na sondo v odvisnosti od razdalje od središča Zemlje. Z grafa odčitaj silo na površju in izračunaj, kolikšna je sila, ko je sonda $2\,R_Z$ **nad površjem**.
:::risba graf
opis: Graf sile F v newtonih v odvisnosti od razdalje r od središča Zemlje, merjene v Zemljinih polmerih od 1 do 4,2. Na površju, pri r = 1, je sila 900 N, nato krivulja pada.
x: 0 .. 5 | 1 | r [R_Z]
y: 0 .. 1000 | 100 | F [N]
f: 900/x^2 | modra | 1 .. 4,2
črta: 0; 900 -> 1; 900 | siva črtkano
točka: 1; 900 | 900 N | desno
:::
= 100 N | 2
~ 225 | To je sila pri $r = 2\,R_Z$. Višini $2\,R_Z$ moraš prišteti še polmer Zemlje: $r = 3\,R_Z$.
~ 300 | Sila ne pada premo z razdaljo, ampak s kvadratom: pri trikratni razdalji je devetkrat manjša.
~ 450 | Vzel si višino za razdaljo in še delil z $2$ namesto z $2^2$.
> Na površju je $900\,\mathrm{N}$. Razdalja od središča je $R_Z + 2\,R_Z = 3\,R_Z$, zato je sila $\dfrac{900\,\mathrm{N}}{3^2} = 100\,\mathrm{N}$. Preveri na grafu: pri $r = 2$ krivulja kaže okoli $225\,\mathrm{N}$ (četrtina), pri $r = 3$ pa $100\,\mathrm{N}$ (devetina).

? Satelit s pogonom prestavimo z nižjega na višji krožni tir. Kaj se zgodi z njegovo hitrostjo in obhodnim časom, ko spet enakomerno kroži?
+ Hitrost se zmanjša, obhodni čas se podaljša.
- Hitrost se poveča, obhodni čas se podaljša.
~ Višje je gravitacija šibkejša, zato je za kroženje potrebna manjša centripetalna sila in manjša hitrost: $v = \sqrt{\dfrac{G M}{r}}$.
- Hitrost ostane enaka, ker se masa satelita ni spremenila.
~ Masa satelita res ne vpliva, vpliva pa polmer tira $r$.
- Hitrost se zmanjša, obhodni čas se skrajša.
~ Obhodni čas se podaljša iz dveh razlogov: pot okoli je daljša, hitrost pa manjša.
> Iz $v = \sqrt{\dfrac{G M}{r}}$ in $t_0 = \dfrac{2\pi r}{v}$ sledi: večji $r$, manjša $v$, daljši $t_0$ (ISS $93\,\mathrm{min}$, geostacionarni satelit en dan).

? Dijakinja računa težni pospešek na ISS, $420\,\mathrm{km}$ nad površjem. V katerem koraku je napaka?
1) $g = \dfrac{G M_Z}{r^2}$
2) $r = 420\,\mathrm{km} = 4{,}2 \cdot 10^5\,\mathrm{m}$
3) $r^2 \approx 1{,}76 \cdot 10^{11}\,\mathrm{m^2}$
4) $g = \dfrac{3{,}98 \cdot 10^{14}}{1{,}76 \cdot 10^{11}}\,\mathrm{m/s^2} \approx 2260\,\mathrm{m/s^2}$
- V 1. koraku.
~ Formula je pravilna: težni pospešek na razdalji $r$ od središča je $\dfrac{G M}{r^2}$.
+ V 2. koraku.
- V 3. koraku.
~ Kvadriranje je pravilno izvedeno; napačna je že vrednost $r$, ki jo kvadriraš.
- V 4. koraku.
~ Deljenje je pravilno; rezultat je nesmiseln (več kot na tleh), ker je napačen $r$.
> $r$ je razdalja od središča: $r = 6370\,\mathrm{km} + 420\,\mathrm{km} = 6790\,\mathrm{km}$. Potem je $g \approx 8{,}6\,\mathrm{m/s^2}$.

? Razvrsti korake, s katerimi iz višine satelita nad površjem izračunaš njegov obhodni čas v minutah.
1. Višini prišteješ polmer Zemlje in dobiš $r$ (v metrih).
2. Iz $r$ izračunaš hitrost $v = \sqrt{\dfrac{G M_Z}{r}}$.
3. Iz $r$ in $v$ izračunaš $t_0 = \dfrac{2\pi r}{v}$.
4. $t_0$ iz sekund pretvoriš v minute.
> Vsak korak potrebuje rezultat prejšnjega: brez $r$ od središča ni hitrosti, brez hitrosti ni obhodnega časa, ta pa pride v sekundah, zato ga na koncu pretvoriš.

? Sateliti GPS krožijo približno $20\,200\,\mathrm{km}$ nad površjem Zemlje. Kolikšna je njihova hitrost v $\mathrm{km/s}$? Uporabi $G M_Z = 3{,}98 \cdot 10^{14}\,\mathrm{m^3/s^2}$ in $R_Z = 6370\,\mathrm{km}$.
= 3,87 km/s | 0,05
~ 4,44 | Za $r$ si vzel višino. Prištej polmer Zemlje: $r = 26\,570\,\mathrm{km}$.
~ 122 | Polmer si vstavil v kilometrih, $G M_Z$ pa je v metrih. Najprej pretvori $r$ v metre.
> $r = 20\,200\,\mathrm{km} + 6370\,\mathrm{km} = 2{,}657 \cdot 10^7\,\mathrm{m}$, zato je $v = \sqrt{\dfrac{3{,}98 \cdot 10^{14}}{2{,}657 \cdot 10^7}}\,\mathrm{m/s} \approx 3870\,\mathrm{m/s} = 3{,}87\,\mathrm{km/s}$. Enako kaže točka GPS na grafu hitrosti v razlagi.

:::simboli
F_g | gravitacijska sila | F_g = G\,\dfrac{m_1 m_2}{r^2} | N
G | gravitacijska konstanta | | N\,m^2/kg^2 | $6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2}$
m_1, m_2 | masi teles | | kg
r | razdalja med središčema teles | | m | pri satelitu polmer tira
m | masa telesa (satelita) | | kg
M_Z | masa Zemlje | | kg | $5{,}97 \cdot 10^{24}\,\mathrm{kg}$
R_Z | polmer Zemlje | | m | $6370\,\mathrm{km}$
M | masa osrednjega telesa | | kg
g | težni pospešek | g = \frac{G M}{r^2} | m/s^2 | na površju Zemlje $9{,}81\,\mathrm{m/s^2}$
v | hitrost kroženja satelita | v = \sqrt{\dfrac{G M}{r}} | m/s
t_0 | obhodni čas | t_0 = \dfrac{2\pi r}{v} | s
a | pospešek | a = \dfrac{F}{m} | m/s^2
h | višina nad površjem | h = r - R_Z | m
g_L | težni pospešek na Luni | g_L = \dfrac{G M_L}{R_L^2} | m/s^2 | približno $1{,}62\,\mathrm{m/s^2}$
M_L | masa Lune | | kg | $7{,}35 \cdot 10^{22}\,\mathrm{kg}$
R_L | polmer Lune | | m | $1740\,\mathrm{km}$
F_L | teža na Luni | F_L = m\, g_L | N
:::

<<RACUN
vrednost: 4*pi**2*3.84*10**(8)/(27.3*86400)**2 | 0.00272
vrednost: 9.81/0.00272 | 3606.6
vrednost: 6.67*10**(-11)*5.97*10**(24)/(6.37*10**(6))**2 | 9.81
vrednost: 6.67*10**(-11)*480*480/5**2 | 6.15*10**(-7)
vrednost: 6.67*10**(-11)*7.35*10**(22)/(1.74*10**(6))**2 | 1.62
vrednost: 9.81/1.62 | 6.06
vrednost: (3.98*10**(14)*(23*3600+56*60)**2/(4*pi**2))**(1/3)/10**7 | 4.214
vrednost: 42140-6370 | 35770
vrednost: 3.98*10**(14)/(6.79*10**(6))/10**7 | 5.86
vrednost: sqrt(3.98*10**(14)/(6.79*10**(6)))/1000 | 7.66
vrednost: 2*pi*6.79*10**(6)/sqrt(3.98*10**(14)/(6.79*10**(6)))/1000 | 5.57
vrednost: 86400/5570 | 15.5
vrednost: 900/3**2 | 100
vrednost: 3.98*10**(14)/(6.79*10**(6))**2 | 8.63
vrednost: 3.98*10**(14)/(4.2*10**(5))**2/1000 | 2.256
vrednost: sqrt(3.98*10**(14)/(2.657*10**(7)))/1000 | 3.87
>>
