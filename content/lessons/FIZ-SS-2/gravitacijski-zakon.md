---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Zidarji in tesarji že stoletja preverjajo navpičnost sten s **svinčnico**: utež na vrvici. Napeta vrvica kaže proti središču Zemlje. Recimo, da svinčnico z utežjo $0{,}2\,\mathrm{kg}$ obesiš ob betonski blok z maso $50\,\mathrm{t}$, tako da je utež $2\,\mathrm{m}$ od težišča bloka. Ali blok povleče utež k sebi? In če jo, za koliko pokvari meritev?

Newtonov gravitacijski zakon odgovori: da, vsako telo privlači vsako drugo. Blok vleče utež s silo približno $1{,}7 \cdot 10^{-7}\,\mathrm{N}$. Zemlja jo vleče z $2\,\mathrm{N}$, kar je več kot desetmilijonkrat več. Na metrski vrvici se svinčnica odmakne za manj kot desettisočinko milimetra, zato gradbeniku ni treba skrbeti. Ob veliki gori pa je odklon merljiv. Leta 1774 so ga izmerili na škotski gori in iz njega prvič ocenili maso Zemlje.

Isti zakon drži Luno ob Zemlji in planete ob Soncu. Z njim izračunamo, kako hitro mora leteti satelit, ki telefonu pošilja signal GPS, in koliko bi tehtal gradbeni blok na Luni.

## Razlaga

Novo idejo zgradimo ob znani. Primerjali bomo silo teže, ki jo poznaš, in gravitacijski zakon ter si ogledali, v čem se razlikujeta.

**Staro: sila teže.** Iz 1. letnika veš, da Zemlja vleče telo z maso $m$ s silo $F_g = m g$, kjer je $g = 9{,}81\,\mathrm{m/s^2}$. Na gradbišču to zadostuje: žerjav mora dvigniti tono betona, ki tehta $9810\,\mathrm{N}$. Ta formula pa molči o dveh stvareh. Ali beton privlači tudi delavca ob sebi? In kolikšen je privlak na Luni, $384\,000\,\mathrm{km}$ daleč?

**Novo: gravitacijski zakon.** Dve telesi z masama $m_1$ in $m_2$ se privlačita s silo

$$F_g = G\,\frac{m_1 m_2}{r^2}$$

Tu je $r$ razdalja med **središčema** teles (pri krogli je to njeno geometrijsko središče). Natančno zakon velja za krogle in za telesa, ki so majhna v primerjavi z razdaljo med njima; za druga telesa da dobro oceno. $G = 6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2}$ je **gravitacijska konstanta**, enaka za vsa telesa v vesolju.

Razlike med starim in novim so zbrane v tabeli.

| Lastnost | Sila teže $mg$ | Gravitacijski zakon |
|---|---|---|
| Kdo privlači | samo Zemlja | vsako telo |
| Odvisnost od razdalje | ni je, $g$ je stalen | pada s kvadratom razdalje |
| Na koga deluje | na telo | na obe telesi, enako močno |
| Kje velja | blizu površja Zemlje | povsod |

**Razlika 1: privlači vsako telo.** Ker je $G$ tako majhen, je privlak med predmeti na gradbišču neznaten. Opazen postane šele, ko je vsaj eno telo velikansko, kot planet ali zvezda.

**Razlika 2: sila pada s kvadratom razdalje.** Če se razdalja med središčema podvoji, se sila zmanjša na četrtino. Pri trikratni razdalji je devetkrat manjša. Pomembno: $r$ merimo od **središča** Zemlje, ne od površja. Človek na tleh je od središča oddaljen en Zemljin polmer, $R_Z = 6370\,\mathrm{km}$.

:::premisli
Satelit kroži $6370\,\mathrm{km}$ nad površjem Zemlje. Kolikšen del svoje teže na tleh ima tam? Napovej, preden bereš naprej.
---
Četrtino. Višina nad površjem je en Zemljin polmer, zato je satelit od središča oddaljen $2 R_Z$. Razdalja od središča se je podvojila, sila pa je zato štirikrat manjša. Kdor vzame samo višino $6370\,\mathrm{km}$ kot razdaljo, dobi napačen rezultat.
:::

**Razlika 3: sila deluje na obe telesi.** Zemlja vleče jabolko in jabolko vleče Zemljo z enako veliko silo v nasprotni smeri, kot pravi 3. Newtonov zakon. To vidiš tudi v formuli: če zamenjaš $m_1$ in $m_2$, ostane sila enaka.

:::premisli
Če jabolko vleče Zemljo z enako silo kot Zemlja jabolko, zakaj jabolko pade na Zemljo in ne Zemlja na jabolko?
---
Enaka sila ne pomeni enakega pospeška. Po 2. Newtonovem zakonu je $a = \dfrac{F}{m}$. Masa Zemlje je okoli $10^{25}$-krat večja od mase jabolka, zato je njen pospešek nemerljivo majhen. Premakne se jabolko.
:::

**Staro kot poseben primer novega.** Za telo na površju Zemlje vstavimo maso Zemlje $m_1 = M_Z$ in razdaljo $r = R_Z$. Gravitacijski zakon mora dati ravno težo $mg$:

$$G\,\frac{M_Z\, m}{R_Z^2} = m g \quad\Rightarrow\quad g = \frac{G M_Z}{R_Z^2}$$

Z maso Zemlje $M_Z = 5{,}97 \cdot 10^{24}\,\mathrm{kg}$ dobimo $g \approx 9{,}81\,\mathrm{m/s^2}$. Zdaj vemo več kot prej: na drugem planetu ali višje nad Zemljo je $g$ drugačen, $g = \dfrac{G M}{r^2}$.

**Gibanje satelitov in planetov.** Spomni se kamna na vrvici: kroži, ker mu vrvica daje centripetalno silo $\dfrac{m v^2}{r}$. Satelit nima vrvice. Njeno vlogo prevzame gravitacija osrednjega telesa z maso $M$, na primer Zemlje. Pri krožnem tiru mora biti gravitacijska sila enaka potrebni centripetalni sili:

$$G\,\frac{M m}{r^2} = \frac{m v^2}{r} \quad\Rightarrow\quad v = \sqrt{\frac{G M}{r}}$$

Masa satelita $m$ se pokrajša. Majhen satelit in velika postaja na istem tiru letita enako hitro.

Dlje od središča je hitrost manjša, pot okoli pa daljša, zato obhodni čas hitro raste. To hitrost vstavimo v $t_0 = \dfrac{2\pi r}{v}$ in enačbo kvadriramo:

$$t_0^2 = \frac{4\pi^2}{G M}\, r^3$$

Ulomek pred $r^3$ je odvisen le od mase osrednjega telesa. Za vse planete okoli Sonca je torej razmerje $\dfrac{t_0^2}{r^3}$ enako. To je **3. Keplerjev zakon**.

V simulaciji spodaj (»Gravitacijski zakon in orbite«) nastavi začetno hitrost na $1{,}00$-kratnik krožne in zaženi: tir je krožnica. Nato hitrost zmanjšaj na $0{,}80$. Opazi, da tir postane elipsa in da je planet blizu zvezde hitrejši kot daleč od nje.

## Rešeni primeri

### Primer 1: privlak betonskega bloka

Žerjav drži betonski blok z maso $3{,}0\,\mathrm{t}$. Delavec z maso $80\,\mathrm{kg}$ stoji tako, da je razdalja med njegovim težiščem in težiščem bloka $2{,}0\,\mathrm{m}$. S kolikšno silo se privlačita? Primerjaj jo s težo delavca.

**Podatki:** $m_1 = 3{,}0\,\mathrm{t}$, $m_2 = 80\,\mathrm{kg}$, $r = 2{,}0\,\mathrm{m}$, $G = 6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** gravitacijsko silo $F_g$ med blokom in delavcem

:::formula
$F_g = G\,\dfrac{m_1 m_2}{r^2}$
:::

**Rešitev:**

1. Maso bloka pretvorimo v kilograme: $m_1 = 3000\,\mathrm{kg}$.
2. Produkt mas: $m_1 m_2 = 3000\,\mathrm{kg} \cdot 80\,\mathrm{kg} = 240\,000\,\mathrm{kg^2}$; kvadrat razdalje: $r^2 = 4{,}0\,\mathrm{m^2}$.
3. $F_g = 6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2} \cdot \dfrac{240\,000\,\mathrm{kg^2}}{4{,}0\,\mathrm{m^2}} \approx 4{,}0 \cdot 10^{-6}\,\mathrm{N}$.
4. Teža delavca: $m_2 g = 80\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \approx 785\,\mathrm{N}$, kar je okoli $200$ milijonkrat več.
5. Odgovor: blok in delavec se privlačita s silo približno $4 \cdot 10^{-6}\,\mathrm{N}$. Delavec je ne more občutiti.

### Primer 2: gradbeni blok na Luni

Načrtovalci lunarne baze bi zidove gradili iz blokov, stisnjenih iz luninega prahu. En blok ima maso $500\,\mathrm{kg}$. Kolikšna je njegova teža na Luni in kolikokrat je manjša kot na Zemlji? Masa Lune je $7{,}35 \cdot 10^{22}\,\mathrm{kg}$, njen polmer $1740\,\mathrm{km}$.

**Podatki:** $m = 500\,\mathrm{kg}$, $M_L = 7{,}35 \cdot 10^{22}\,\mathrm{kg}$, $R_L = 1740\,\mathrm{km}$, $G = 6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2}$, na Zemlji $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** težo bloka na Luni $F_L$ in razmerje s težo na Zemlji

:::formula
$g_L = \dfrac{G M_L}{R_L^2}$, nato $F_L = m\, g_L$
:::

**Rešitev:**

1. Polmer v metrih: $R_L = 1{,}74 \cdot 10^6\,\mathrm{m}$, zato $R_L^2 \approx 3{,}03 \cdot 10^{12}\,\mathrm{m^2}$.
2. Števec: $G M_L \approx 4{,}90 \cdot 10^{12}\,\mathrm{N\,m^2/kg}$.
3. Težni pospešek na Luni: $g_L = \dfrac{4{,}90 \cdot 10^{12}}{3{,}03 \cdot 10^{12}}\,\mathrm{m/s^2} \approx 1{,}62\,\mathrm{m/s^2}$.
4. Teža bloka: $F_L = 500\,\mathrm{kg} \cdot 1{,}62\,\mathrm{m/s^2} = 810\,\mathrm{N}$. Na Zemlji bi bila $500\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \approx 4905\,\mathrm{N}$.
5. Odgovor: na Luni blok tehta približno $810\,\mathrm{N}$, kar je okoli šestkrat manj kot na Zemlji. Žerjav na Luni je lahko precej šibkejši. Masa bloka pa ostane $500\,\mathrm{kg}$, zato ga je enako težko pospešiti ali ustaviti.

### Primer 3: hitrost in obhodni čas vesoljske postaje

ISS kroži po krožnici s polmerom $6790\,\mathrm{km}$ okoli središča Zemlje. Kolikšna mora biti njena hitrost, da ostane na tem tiru, in koliko časa traja en obhod?

**Podatki:** $r = 6790\,\mathrm{km}$, $M_Z = 5{,}97 \cdot 10^{24}\,\mathrm{kg}$, $G = 6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2}$
**Iščemo:** hitrost $v$ in obhodni čas $t_0$

:::formula
Gravitacija je centripetalna sila: $G\,\dfrac{M_Z m}{r^2} = \dfrac{m v^2}{r}$, zato $v = \sqrt{\dfrac{G M_Z}{r}}$; nato $t_0 = \dfrac{2\pi r}{v}$.
:::

**Rešitev:**

1. Pretvorimo: $r = 6{,}79 \cdot 10^6\,\mathrm{m}$. Izračunamo $G M_Z \approx 3{,}98 \cdot 10^{14}\,\mathrm{m^3/s^2}$.
2. Delimo s polmerom: $\dfrac{G M_Z}{r} \approx 5{,}86 \cdot 10^7\,\mathrm{m^2/s^2}$.
3. Korenimo: $v \approx 7660\,\mathrm{m/s}$.
4. Obseg tira: $2\pi r \approx 4{,}27 \cdot 10^7\,\mathrm{m}$, zato $t_0 = \dfrac{4{,}27 \cdot 10^7\,\mathrm{m}}{7660\,\mathrm{m/s}} \approx 5570\,\mathrm{s}$, kar je okoli $93\,\mathrm{min}$.
5. Odgovor: postaja mora leteti s hitrostjo približno $7{,}7\,\mathrm{km/s}$ in obkroži Zemljo v približno $93$ minutah. Masa postaje v računu ni nastopila.

### Primer 4: zdaj ti

Sateliti GPS, po katerih telefon določi svoj položaj, krožijo na razdalji $26\,600\,\mathrm{km}$ od središča Zemlje. Kolikšna je njihova hitrost in kolikšen obhodni čas?

**Podatki:** $r = 26\,600\,\mathrm{km}$, $G M_Z = 3{,}98 \cdot 10^{14}\,\mathrm{m^3/s^2}$
**Iščemo:** hitrost $v$ in obhodni čas $t_0$

:::formula
$v = \sqrt{\dfrac{G M_Z}{r}}$, nato $t_0 = \dfrac{2\pi r}{v}$
:::

**Rešitev:**

1. Pretvorimo: $r = 2{,}66 \cdot 10^7\,\mathrm{m}$.
2. $\dfrac{G M_Z}{r} \approx 1{,}50 \cdot 10^7\,\mathrm{m^2/s^2}$; obseg tira $2\pi r \approx 1{,}67 \cdot 10^8\,\mathrm{m}$.
3. Koreni in izračunaj obhodni čas sam, nato preveri:

:::premisli
Najprej napovej: bo satelit GPS hitrejši ali počasnejši od ISS? Nato izračunaj $v$ in $t_0$.
---
Počasnejši, ker je dlje od središča Zemlje. $v = \sqrt{1{,}50 \cdot 10^7}\,\mathrm{m/s} \approx 3870\,\mathrm{m/s}$ in $t_0 = \dfrac{1{,}67 \cdot 10^8\,\mathrm{m}}{3870\,\mathrm{m/s}} \approx 43\,200\,\mathrm{s} = 12\,\mathrm{h}$. Satelit GPS obkroži Zemljo dvakrat na dan.
:::

## Pogoste napake

- **Razdalja od površja.** V gravitacijski zakon vstavljaš razdaljo med središčema. Za satelit $400\,\mathrm{km}$ nad tlemi je $r = 6370\,\mathrm{km} + 400\,\mathrm{km} = 6770\,\mathrm{km}$, ne $400\,\mathrm{km}$.
- **Dvakrat dlje, pol manjša sila.** Razdalja je v imenovalcu na kvadrat. Dvakratna razdalja pomeni štirikrat manjšo silo, trikratna devetkrat manjšo.
- **»Zemlja vleče jabolko močneje kot jabolko Zemljo.«** Sili sta enako veliki in nasprotno usmerjeni. Različna sta le pospeška, ker sta masi zelo različni.
- **»Na ISS ni gravitacije.«** Na višini postaje je težni pospešek še okoli $8{,}6\,\mathrm{m/s^2}$. Astronavti lebdijo, ker skupaj s postajo prosto padajo okoli Zemlje.
- **»Težji satelit mora leteti hitreje.«** Masa satelita se pri izenačitvi gravitacijske in centripetalne sile pokrajša. Hitrost na krožnem tiru je odvisna le od mase osrednjega telesa in od $r$.

## Povzetek

- Gravitacijski zakon: $F_g = G\,\dfrac{m_1 m_2}{r^2}$, $G = 6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2}$; $r$ je razdalja med središčema.
- Privlačita se obe telesi z enako veliko silo; sila pada s kvadratom razdalje.
- Teža $mg$ je poseben primer: $g = \dfrac{G M}{r^2}$, na površju Zemlje $9{,}81\,\mathrm{m/s^2}$, na Luni $1{,}62\,\mathrm{m/s^2}$.
- Pri satelitih in planetih je gravitacija centripetalna sila: $v = \sqrt{\dfrac{G M}{r}}$, neodvisno od mase satelita.
- Dlje od središča je hitrost manjša in obhodni čas daljši; $\dfrac{t_0^2}{r^3}$ je enak za vsa telesa okoli istega središča (3. Keplerjev zakon).

## Drugače: Na sliki

Predstavljaj si pleskarja, ki z barvno pištolo razprši stalno količino barve. Blizu pištole barva prekrije majhno ploskev z debelo plastjo. Dvakrat dlje se ista barva razporedi na ploskev, ki je dvakrat širša in dvakrat višja, torej štirikrat večja. Plast je štirikrat tanjša. Gravitacija Zemlje se »razporeja« podobno, na krogle okoli Zemlje, zato pada s kvadratom razdalje.

Graf prikazuje težni pospešek v odvisnosti od razdalje od središča Zemlje:

:::risba graf
opis: Graf težnega pospeška g v odvisnosti od razdalje r od središča Zemlje, merjene v polmerih Zemlje. Pri enem polmeru je g 9,81 m/s², pri dveh 2,45, pri treh 1,09, pri štirih 0,61 m/s². Krivulja pada vedno počasneje in ne doseže nič.
x: 0 .. 4,5 | 1 | r
y: 0 .. 10 | 2 | g [m/s^2]
oznake: ne
oznakax: 1 | R_Z
oznakax: 2 | 2R_Z
oznakax: 3 | 3R_Z
oznakax: 4 | 4R_Z
oznakay: 2 | 2
oznakay: 4 | 4
oznakay: 6 | 6
oznakay: 8 | 8
oznakay: 10 | 10
f: 9.81/x^2 | modra | 1 .. 4,5
točka: 1; 9,81 | 9,81 | desno
točka: 2; 2,45 | 2,45 | nad desno
točka: 3; 1,09 | 1,09 | nad desno
točka: 4; 0,61 | 0,61 | nad
:::

Vsak naslednji padec $g$ je manjši od prejšnjega: krivulja se hitro položi, a nikoli ne pade na nič.

## Drugače: Iz vsakdanjega življenja

Na vrhu visokega stolpa stoji zidar in vodoravno vrže opeko. Pri počasnem metu pade blizu stolpa. Pri hitrejšem metu pade dlje. Zemlja je okrogla, zato se tla pod opeko ves čas malo »umikajo« navzdol.

Zdaj si zamisli, da bi jo vrgel s hitrostjo skoraj $8\,\mathrm{km/s}$ in da zrak ne bi zaviral. Opeka bi ves čas padala, tla pa bi se umikala enako hitro. Nikoli ne bi pristala, ampak bi obkrožila Zemljo. To je satelit: telo, ki pada, a ves čas zgreši tla.

Zato astronavti na ISS lebdijo. Gravitacija nanje deluje, a padajo skupaj s postajo. Podoben občutek imaš za hip na toboganu ali v dvigalu, ki naglo spelje navzdol.

## Preveri se

? Satelit na razdalji $r$ od središča Zemlje privlači Zemlja s silo $F$. Katera vrstica pravilno kaže silo pri razdaljah $r$, $2r$ in $3r$?
- $F$, $\dfrac{F}{2}$, $\dfrac{F}{3}$
~ To bi veljalo, če bi sila padala premo sorazmerno z razdaljo. Razdalja je v imenovalcu na kvadrat.
+ $F$, $\dfrac{F}{4}$, $\dfrac{F}{9}$
- $F$, $F$, $F$
~ Stalna sila velja le blizu površja, kjer se razdalja od središča skoraj ne spremeni. Daleč od Zemlje sila pada.
> $F_g \propto \dfrac{1}{r^2}$: pri dvakratni razdalji je sila $2^2 = 4$-krat manjša, pri trikratni $3^2 = 9$-krat.

? Dva sošolca z masama po $70\,\mathrm{kg}$ stojita $1\,\mathrm{m}$ narazen. Oceni, s kolikšno silo se gravitacijsko privlačita.
- Približno $700\,\mathrm{N}$.
~ To je teža enega sošolca, torej privlak Zemlje. Privlak med sošolcema je neprimerno manjši, ker sta njuni masi majhni.
+ Približno $3 \cdot 10^{-7}\,\mathrm{N}$.
- Točno $0\,\mathrm{N}$, ljudje se ne privlačijo.
~ Gravitacijski zakon velja za vsa telesa. Sila ni nič, je le premajhna, da bi jo občutili.
> $F_g = 6{,}67 \cdot 10^{-11} \cdot \dfrac{70 \cdot 70}{1^2}\,\mathrm{N} \approx 3{,}3 \cdot 10^{-7}\,\mathrm{N}$.

? Zakaj ISS ne pade na Zemljo, čeprav jo Zemlja privlači?
- Ker na višini $400\,\mathrm{km}$ ni več gravitacije.
~ Na tej višini je težni pospešek še skoraj $90\,\%$ tistega na tleh. Brez gravitacije bi postaja odletela naravnost.
- Ker centrifugalna sila navzven uravnovesi gravitacijo.
~ Na postajo deluje le gravitacija proti središču. Rezultanta ni nič, sicer bi postaja letela premo.
+ Ker ima tolikšno vodoravno hitrost, da je gravitacija ravno potrebna centripetalna sila.
> Postaja ves čas pada proti Zemlji, a se med padanjem toliko premakne vstran, da ostaja na krožnici: $G\,\dfrac{M m}{r^2} = \dfrac{m v^2}{r}$.

? Na istem krožnem tiru krožita satelit z maso $100\,\mathrm{kg}$ in satelit z maso $1000\,\mathrm{kg}$. Kaj velja za njuni hitrosti?
- Težji je hitrejši, ker nanj deluje večja sila.
~ Večja je tudi potrebna centripetalna sila $\dfrac{m v^2}{r}$. Masa se na obeh straneh pokrajša.
- Lažji je hitrejši, ker ga Zemlja manj zavira.
~ Gravitacija na krožnem tiru satelita ne zavira, ampak mu le spreminja smer. Masa satelita na hitrost ne vpliva.
+ Hitrosti sta enaki.
> $v = \sqrt{\dfrac{G M_Z}{r}}$ vsebuje le maso Zemlje in polmer tira, ne mase satelita.

? Na kateri višini nad površjem Zemlje ($R_Z = 6370\,\mathrm{km}$) je teža telesa četrtina teže na tleh?
- $12\,740\,\mathrm{km}$
~ To je razdalja od središča, $2 R_Z$. Višino nad površjem dobiš, ko odšteješ $R_Z$.
+ $6370\,\mathrm{km}$
- $19\,110\,\mathrm{km}$
~ Tako dobiš, če misliš, da sila pada premo z razdaljo, in vzameš $r = 4 R_Z$. Sila pada s kvadratom, zato zadošča $r = 2 R_Z$.
> Četrtina sile pomeni dvakratno razdaljo od središča: $r = 2 R_Z$. Višina nad površjem je $r - R_Z = R_Z = 6370\,\mathrm{km}$.

:::simboli
F_g | gravitacijska sila | F_g = G\,\dfrac{m_1 m_2}{r^2} | N
G | gravitacijska konstanta | | N\,m^2/kg^2 | 6,67 · 10⁻¹¹ N m²/kg²
m_1, m_2 | masi teles | | kg
r | razdalja med središčema teles | | m | pri satelitu polmer tira
m | masa telesa (satelita) | | kg
M_Z | masa Zemlje | | kg | 5,97 · 10²⁴ kg
R_Z | polmer Zemlje | | m | 6370 km
M | masa osrednjega telesa | | kg
g | težni pospešek | g = \frac{G M_Z}{R_Z^2} | m/s^2 | na površju Zemlje 9,81 m/s²
v | hitrost kroženja satelita | v = \sqrt{\dfrac{G M_Z}{r}} | m/s
t_0 | obhodni čas | t_0 = \dfrac{2\pi r}{v} | s
g_L | težni pospešek na Luni | g_L = \dfrac{G M_L}{R_L^2} | m/s^2 | približno 1,62 m/s²
M_L | masa Lune | | kg
R_L | polmer Lune | | m | 1740 km
F_L | teža na Luni | F_L = m\, g_L | N
:::
