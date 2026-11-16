---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ko na telefonu odpreš zemljevid, telefon ujame signale vsaj štirih satelitov GPS. Vsak od njih obkroži Zemljo v približno $12$ urah na višini okoli $20\,200\,\mathrm{km}$. Satelit, ki pošilja satelitsko televizijo, potrebuje za en obhod cel dan in kroži na višini skoraj $36\,000\,\mathrm{km}$. Mednarodna vesoljska postaja ISS je le $400\,\mathrm{km}$ nad tlemi in naredi krog v $92$ minutah.

Teh časov ni nihče izbral poljubno. Kdor pozna višino, pozna tudi obhodni čas. Isto pravilo velja za Mars, Jupiter in vsak komet okoli Sonca. Johannes Kepler ga je pred štiristo leti razbral iz meritev planetov, Isaac Newton pa ga je razložil z gravitacijo. Z njim izračunaš, kam postaviti satelit, in razložiš, zakaj leto na Marsu traja skoraj dve zemeljski leti.

## Razlaga

**1. Telesa v Osončju.** V središču je **Sonce**, ki ima $99{,}86\,\%$ vse mase Osončja. Okoli njega kroži osem **planetov**. Notranji štirje (Merkur, Venera, Zemlja, Mars) so majhni in kamniti. Zunanji štirje (Jupiter, Saturn, Uran, Neptun) so plinasti in ledeni velikani.

Med Marsom in Jupitrom je **asteroidni pas** z ogromno skalnatimi telesi. Za Neptunom so **pritlikavi planeti**, kot je Pluton, in ledena telesa, iz katerih prihajajo **kometi**. Okoli večine planetov krožijo **lune** (naravni sateliti).

Razdalje v Osončju merimo v **astronomskih enotah**. Ena astronomska enota je povprečna razdalja med Zemljo in Soncem: $1\,\mathrm{a.e.} = 1{,}50\cdot10^{11}\,\mathrm{m}$.

**2. Kroženje, ki ga že poznaš.** Kamen na vrvici kroži, ker ga vrvica vleče proti središču. Sila proti središču je **centripetalna sila** $F_\mathrm{c} = \dfrac{m v^2}{r}$. Hitrost kamna je stalna, tir je krožnica, obhodni čas pa izbereš sam: hitreje ko vrtiš, krajši je.

Planet okoli Sonca je kamnu podoben, a se od njega razlikuje v treh stvareh:

| | kamen na vrvici | planet okoli Sonca |
|---|---|---|
| kaj vleče | vrvica | gravitacija Sonca |
| tir | krožnica | elipsa |
| hitrost | stalna | večja bližje Soncu |
| obhodni čas | poljuben | določa ga razdalja |

Iz teh razlik so zrasli trije Keplerjevi zakoni.

**3. Prvi zakon: elipsa.** Planeti krožijo po **elipsah**. Sonce je v enem od dveh **gorišč** elipse, ne v njenem središču. Elipso narišeš z vrvico, ki jo pripneš na dva žebljička in napeto vodiš s svinčnikom; žebljička sta gorišči. Polovica najdaljšega premera elipse je **velika polos** $a$. Za planet je to povprečna razdalja od Sonca.

Tiri planetov so skoraj krožnice. Zemlja je Soncu najbližje $147{,}1$ milijona kilometrov, najdlje $152{,}1$ milijona kilometrov. Kometi pa imajo zelo podolgovate elipse.

**4. Drugi zakon: enake ploščine.** Daljica od Sonca do planeta v enakih časih opiše enake ploščine. Blizu Sonca je ta daljica kratka. Da opiše enako ploščino, mora planet v istem času prepotovati daljši lok, torej se giblje hitreje.

Zemlja je Soncu najbližje, v **prisončju**, v začetku januarja; tedaj potuje s $30{,}3\,\mathrm{km/s}$. V začetku julija je v **odsončju** in potuje s $29{,}3\,\mathrm{km/s}$.

V simulaciji spodaj (»Keplerjevi zakoni«) zmanjšaj začetno hitrost, da tir postane podolgovata elipsa, in vklopi »pokaži ploskve v enakih časih«. Opazi: ploskve blizu Sonca so kratke in široke, daleč od Sonca dolge in ozke, a vse enako velike.

:::premisli
Halleyjev komet pride Soncu bližje kot Venera, odide pa dlje od Neptuna. Kje na tiru je hiter in kje počasen? Kje preživi večino svojih $76$ let?
---
Hiter je blizu Sonca, kjer je daljica Sonce–komet kratka in mora za enako ploščino prepotovati dolg lok. Daleč zunaj je počasen, zato tam preživi večino obhodnega časa. Zato ga z Zemlje vidimo le nekaj mesecev.
:::

**5. Tretji zakon: razdalja določa leto.** Primerjaj podatke za nekaj planetov. Velika polos $a$ je v astronomskih enotah, obhodni čas $T$ v zemeljskih letih.

| planet | $a$ [a.e.] | $T$ [leta] | $T^2/a^3$ |
|---|---|---|---|
| Merkur | 0,387 | 0,241 | 1,00 |
| Zemlja | 1 | 1 | 1 |
| Mars | 1,524 | 1,88 | 1,00 |
| Jupiter | 5,20 | 11,86 | 1,00 |
| Neptun | 30,1 | 165 | 1,00 |

Dlje ko je planet, daljše je njegovo leto, a ne sorazmerno. Jupiter je $5{,}2$-krat dlje od Zemlje, njegovo leto pa je skoraj $12$-krat daljše. Stalen je šele količnik $T^2/a^3$. To je **tretji Keplerjev zakon**: za vsa telesa, ki krožijo okoli istega osrednjega telesa, je količnik $T^2/a^3$ enak.

:::premisli
Planet bi bil štirikrat dlje od Sonca kot Zemlja. Koliko let bi trajalo njegovo leto? Napovej, preden računaš.
---
$8$ let. V letih in a.e. je $T^2 = a^3$, torej $T^2 = 4^3 = 64$ in $T = 8$ let. Štirikrat dlje pomeni osemkrat daljše leto.
:::

**6. Od kod zakoni: gravitacija namesto vrvice.** Newton je pokazal, da Sonce z maso $M$ privlači planet z maso $m$ na razdalji $r$ z gravitacijsko silo

$$F_\mathrm{g} = \frac{G m M}{r^2}$$

Tu je $G = 6{,}67\cdot10^{-11}\,\mathrm{N\,m^2/kg^2}$ gravitacijska konstanta. Pri kroženju gravitacija prevzame vlogo vrvice: je centripetalna sila. Ko izenačimo $\dfrac{G m M}{r^2} = \dfrac{m v^2}{r}$, se masa planeta $m$ pokrajša. Hitrost kroženja je

$$v = \sqrt{\frac{G M}{r}}$$

Bližji planet kroži hitreje. Vstavimo še $v = \dfrac{2\pi r}{T}$ (obseg krožnice, deljen z obhodnim časom) in kvadriramo: $\dfrac{4\pi^2 r^2}{T^2} = \dfrac{G M}{r}$. Ko preuredimo, dobimo tretji Keplerjev zakon s konstanto:

$$\frac{T^2}{r^3} = \frac{4\pi^2}{G M}$$

Za elipso namesto $r$ pišemo veliko polos $a$. Na desni je le masa osrednjega telesa $M$. Zato imajo vsi planeti okoli Sonca en količnik, vsi sateliti okoli Zemlje pa drugega. Masa planeta ali satelita na obhodni čas ne vpliva.

## Rešeni primeri

### Primer 1: leto na Marsu

Mars je od Sonca povprečno oddaljen $1{,}52\,\mathrm{a.e.}$ Koliko traja leto na Marsu v zemeljskih letih in v dnevih?

**Podatki:** $a_\mathrm{M} = 1{,}52\,\mathrm{a.e.}$; za Zemljo $a_\mathrm{Z} = 1\,\mathrm{a.e.}$ in $T_\mathrm{Z} = 1\,\text{leto} = 365{,}25\,\text{dni}$
**Iščemo:** obhodni čas Marsa $T_\mathrm{M}$

:::formula
Tretji Keplerjev zakon za dve telesi okoli Sonca: $\dfrac{T_\mathrm{M}^2}{a_\mathrm{M}^3} = \dfrac{T_\mathrm{Z}^2}{a_\mathrm{Z}^3}$
:::

**Rešitev:**

1. Za Zemljo je $T_\mathrm{Z} = 1$ leto in $a_\mathrm{Z} = 1\,\mathrm{a.e.}$, zato je desna stran enaka $1$. V letih in a.e. velja kar $T_\mathrm{M}^2 = a_\mathrm{M}^3$.
2. $a_\mathrm{M}^3 = 1{,}52^3 = 3{,}512$.
3. Iščemo $T$, ne $T^2$, zato korenimo: $T_\mathrm{M} = \sqrt{3{,}512} = 1{,}874$ leta.
4. V dnevih: $1{,}874 \cdot 365{,}25 \approx 684$ dni.
5. Odgovor: leto na Marsu traja približno $1{,}87$ zemeljskega leta oziroma $684$ dni. Z natančnejšim podatkom $a_\mathrm{M} = 1{,}524\,\mathrm{a.e.}$ dobiš izmerjenih $687$ dni.

### Primer 2: kako hitro potujemo okoli Sonca

Masa Sonca je $1{,}99\cdot10^{30}\,\mathrm{kg}$, Zemlja kroži okoli njega na razdalji $1{,}50\cdot10^{11}\,\mathrm{m}$. S kolikšno hitrostjo se giblje Zemlja po tiru?

**Podatki:** $M = 1{,}99\cdot10^{30}\,\mathrm{kg}$, $r = 1{,}50\cdot10^{11}\,\mathrm{m}$, $G = 6{,}67\cdot10^{-11}\,\mathrm{N\,m^2/kg^2}$
**Iščemo:** hitrost $v$

:::formula
Gravitacija je centripetalna sila: $\dfrac{G m M}{r^2} = \dfrac{m v^2}{r}$, zato $v = \sqrt{\dfrac{G M}{r}}$
:::

**Rešitev:**

1. Števec: $G M = 6{,}67\cdot10^{-11} \cdot 1{,}99\cdot10^{30} = 1{,}327\cdot10^{20}\,\mathrm{m^3/s^2}$.
2. Delimo z razdaljo: $\dfrac{G M}{r} = \dfrac{1{,}327\cdot10^{20}}{1{,}50\cdot10^{11}} = 8{,}85\cdot10^{8}\,\mathrm{m^2/s^2}$.
3. Korenimo: $v = \sqrt{8{,}85\cdot10^{8}} = 2{,}97\cdot10^{4}\,\mathrm{m/s}$.
4. Preizkus po drugi poti: obseg tira $2\pi r$, deljen z letom ($3{,}156\cdot10^{7}\,\mathrm{s}$), da $2{,}99\cdot10^{4}\,\mathrm{m/s}$. Ujemanje potrdi, da gravitacija res drži Zemljo na tiru.
5. Odgovor: Zemlja potuje okoli Sonca s približno $30\,\mathrm{km/s}$, to je več kot $100\,000\,\mathrm{km/h}$.

### Primer 3: kam postaviti satelit za televizijo

Satelitska antena na balkonu je ves čas obrnjena v isto točko neba. Satelit mora zato Zemljo obkrožiti v istem času, kot se Zemlja zavrti, v $24\,\mathrm{h}$. Na kolikšni višini nad površjem mora krožiti?

**Podatki:** $T = 24\,\mathrm{h} = 86\,400\,\mathrm{s}$, $M_\mathrm{Z} = 5{,}97\cdot10^{24}\,\mathrm{kg}$, $R_\mathrm{Z} = 6370\,\mathrm{km}$, $G = 6{,}67\cdot10^{-11}\,\mathrm{N\,m^2/kg^2}$
**Iščemo:** višino $h$ nad površjem

:::formula
$\dfrac{T^2}{r^3} = \dfrac{4\pi^2}{G M_\mathrm{Z}}$, zato $r^3 = \dfrac{G M_\mathrm{Z} T^2}{4\pi^2}$; višina $h = r - R_\mathrm{Z}$
:::

**Rešitev:**

1. Osrednje telo je zdaj Zemlja, zato vstavimo maso Zemlje, ne Sonca: $G M_\mathrm{Z} = 3{,}982\cdot10^{14}\,\mathrm{m^3/s^2}$.
2. $T^2 = 86\,400^2 = 7{,}465\cdot10^{9}\,\mathrm{s^2}$.
3. V imenovalcu je $4\pi^2 = 39{,}48$, zato $r^3 = \dfrac{3{,}982\cdot10^{14} \cdot 7{,}465\cdot10^{9}}{39{,}48} = 7{,}53\cdot10^{22}\,\mathrm{m^3}$.
4. Kubni koren: $r = \sqrt[3]{7{,}53\cdot10^{22}} = 4{,}223\cdot10^{7}\,\mathrm{m}$, torej $42\,230\,\mathrm{km}$. To je razdalja od **središča** Zemlje.
5. Odštejemo polmer Zemlje: $h = 42\,230 - 6370 = 35\,860\,\mathrm{km}$.
6. Odgovor: satelit mora krožiti približno $36\,000\,\mathrm{km}$ nad ekvatorjem. Natančna višina je $35\,790\,\mathrm{km}$, ker se Zemlja glede na zvezde zavrti v $23\,\mathrm{h}\;56\,\mathrm{min}$, ne v $24\,\mathrm{h}$.

### Primer 4 – zdaj ti: višina satelitov GPS

Satelit GPS obkroži Zemljo v $12\,\mathrm{h}$, v polovici časa satelita iz primera 3. Na kolikšni višini kroži?

**Podatki:** $T_\mathrm{GPS} = 12\,\mathrm{h}$, $T = 24\,\mathrm{h}$, $r = 42\,230\,\mathrm{km}$ (iz primera 3), $R_\mathrm{Z} = 6370\,\mathrm{km}$
**Iščemo:** višino $h_\mathrm{GPS}$

:::formula
Oba krožita okoli Zemlje: $\dfrac{T_\mathrm{GPS}^2}{r_\mathrm{GPS}^3} = \dfrac{T^2}{r^3}$, zato $r_\mathrm{GPS} = r \cdot \left(\dfrac{T_\mathrm{GPS}}{T}\right)^{2/3}$
:::

**Rešitev:**

1. Razmerje časov: $\dfrac{12\,\mathrm{h}}{24\,\mathrm{h}} = 0{,}5$. Ure se pokrajšajo, zato pretvarjanje v sekunde ni potrebno.
2. $(0{,}5)^{2/3} = 0{,}630$.
3. Izračunaj sam polmer tira in višino, nato preveri:

:::premisli
Koliko sta $r_\mathrm{GPS} = 42\,230\,\mathrm{km} \cdot 0{,}630$ in $h_\mathrm{GPS} = r_\mathrm{GPS} - R_\mathrm{Z}$?
---
$r_\mathrm{GPS} \approx 26\,600\,\mathrm{km}$ in $h_\mathrm{GPS} \approx 26\,600\,\mathrm{km} - 6370\,\mathrm{km} \approx 20\,200\,\mathrm{km}$, točno toliko, kot piše v uvodu.
:::

## Pogoste napake

- **»Poleti smo bližje Soncu.«** Letne čase bi radi razložili z eliptičnim tirom. A Zemlja je Soncu najbližje v začetku januarja, ko je pri nas zima, in razdalja se čez leto spremeni le za okoli $3\,\%$. Letne čase povzroča nagnjena Zemljina os: poleti Sonce sije bolj strmo in dlje časa.
- **»Sonce je v središču elipse.«** Ob risanju se zdi naravno postaviti Sonce na sredino. Sonce je v gorišču, zato je planet na eni strani tira bližje, na drugi dlje, in tam tudi počasnejši.
- **»Dvakrat dlje, dvakrat daljše leto.«** Iz vsakdanjega gibanja smo navajeni, da je čas sorazmeren s potjo. Pri planetih velja $T^2 \propto a^3$: dvakrat dlje pomeni $\sqrt{8} \approx 2{,}8$-krat daljše leto, ker je pot daljša in hitrost manjša.
- **»Težji satelit kroži drugače.«** Zdi se, da je težji satelit težje obdržati na tiru. Nanj res deluje večja gravitacijska sila, a ima tudi večjo maso; $m$ se pokrajša. Obhodni čas določata le masa osrednjega telesa in razdalja.
- **»Ista konstanta za vse.«** Količnik $T^2/a^3$ je enak le za telesa okoli istega osrednjega telesa. Za satelite okoli Zemlje velja konstanta z maso Zemlje; »$T^2 = a^3$ v letih in a.e.« zanje ne velja.

## Povzetek

- Osončje: Sonce ($99{,}86\,\%$ mase), osem planetov (štirje kamniti, štirje velikani), pritlikavi planeti, lune, asteroidi in kometi; $1\,\mathrm{a.e.} = 1{,}50\cdot10^{11}\,\mathrm{m}$.
- 1. Keplerjev zakon: planeti krožijo po elipsah, Sonce je v enem gorišču.
- 2. Keplerjev zakon: daljica Sonce–planet v enakih časih opiše enake ploščine; blizu Sonca je planet hitrejši.
- 3. Keplerjev zakon: $\dfrac{T^2}{a^3} = \dfrac{4\pi^2}{G M}$ je enak za vsa telesa okoli istega osrednjega telesa; za planete v letih in a.e. velja $T^2 = a^3$.
- Gravitacija $F_\mathrm{g} = \dfrac{G m M}{r^2}$ je centripetalna sila: $v = \sqrt{\dfrac{G M}{r}}$; masa krožečega telesa ne vpliva ne na hitrost ne na obhodni čas.

## Drugače: Na sliki

Nariši si v mislih podolgovato elipso. Na njeni dolgi osi označi dve točki, gorišči. V desno gorišče postavi Sonce, levo naj ostane prazno.

Iz Sonca nariši dve »rezini pice« do tira. Prva sega do desnega, bližnjega dela tira: je kratka in široka, njen lok na tiru je dolg. Druga sega do levega, oddaljenega dela: je dolga in ozka, njen lok je kratek. Ploščini sta enaki, planet oba loka prepotuje v enakem času, zato je na desnem, dolgem loku hitrejši.

Še slika velikosti. Če bi Sonce pomanjšali na žogo s premerom $30\,\mathrm{cm}$, bi bila Zemlja $3\,\mathrm{mm}$ velika kroglica $32\,\mathrm{m}$ stran, Jupiter $3\,\mathrm{cm}$ velika frnikola $170\,\mathrm{m}$ stran, Neptun pa skoraj kilometer daleč. Osončje je skoraj povsem prazno. V 3D-simulaciji »Sončni sistem v resničnem merilu« to vidiš sam.

## Drugače: Iz vsakdanjega življenja

Drugi zakon poznaš z drsališča. Drsalka, ki se vrti z razprtimi rokami, se zavrti hitreje, ko roke pritegne k telesu. Planet ravna enako: ko pride bližje Soncu, se giblje hitreje.

Tretji zakon pa vidiš v telefonu, ki uporablja satelite na različnih višinah:

| telo okoli Zemlje | razdalja od središča | obhodni čas |
|---|---|---|
| ISS | $6770\,\mathrm{km}$ | $92\,\mathrm{min}$ |
| satelit GPS | $26\,600\,\mathrm{km}$ | $12\,\mathrm{h}$ |
| televizijski satelit | $42\,200\,\mathrm{km}$ | $24\,\mathrm{h}$ |
| Luna | $384\,000\,\mathrm{km}$ | $27{,}3$ dneva |

Višji tir je daljši, satelit pa se na njem giblje počasneje. Zato obhodni čas raste hitreje kot razdalja. Za vse štiri je količnik $T^2/r^3$ enak, ker vse drži ista Zemlja.

## Preveri se

? Rišeš eliptični tir planeta. Kam na sliki moraš postaviti Sonce?
- V središču elipse.
~ Tako bi bilo pri krožnici. Pri elipsi je Sonce v enem od gorišč, zato je planet enkrat bližje, drugič dlje.
+ V enem od obeh gorišč elipse.
- Na tiru, v točki, kjer je planet najhitrejši.
~ Planet se Sonca ne dotakne. Najhitrejši je v prisončju, ki je od Sonca še vedno daleč.
> Prvi Keplerjev zakon: Sonce je v enem gorišču, drugo gorišče je prazno.

? Zemlja se januarja giblje s $30{,}3\,\mathrm{km/s}$, julija s $29{,}3\,\mathrm{km/s}$. Zakaj?
- Ker je januarja pri nas zima in je Zemlja zato dlje od Sonca.
~ Letnih časov ne povzroča razdalja, ampak nagnjena os. Januarja je Zemlja Soncu najbližje.
+ Ker je januarja Soncu najbližje in mora v istem času opisati enako ploščino kot julija.
- Ker se Zemlja čez leto zaradi trenja v vesolju upočasnjuje.
~ V praznem prostoru ni trenja, ki bi zaviralo planet. Hitrost se vsako leto ponovi.
> Drugi Keplerjev zakon: blizu Sonca je daljica Sonce–Zemlja krajša, zato mora Zemlja v enakem času prepotovati daljši lok.

? Dva satelita krožita na isti višini nad Zemljo. Prvi ima maso $500\,\mathrm{kg}$, drugi $5000\,\mathrm{kg}$. Kako se razlikujeta njuna obhodna časa?
- Težji ima desetkrat krajši obhodni čas.
~ Nanj deluje res desetkrat večja sila, a ima tudi desetkrat večjo maso. Pospešek je enak.
- Težji ima daljši obhodni čas, ker ga je težje pospešiti.
~ Res ga je težje pospešiti, a nanj deluje tudi večja sila. Oba učinka se natanko izničita.
+ Obhodna časa sta enaka.
> V $\dfrac{T^2}{r^3} = \dfrac{4\pi^2}{G M}$ nastopa le masa Zemlje $M$; masa satelita se pokrajša.

? Jupiter je od Sonca oddaljen približno $5{,}2\,\mathrm{a.e.}$ Približno koliko zemeljskih let traja njegovo leto?
- približno $5$ let
~ To bi veljalo, če bi bil obhodni čas sorazmeren z razdaljo. Velja $T^2 = a^3$.
- približno $27$ let
~ To je $a^2$. Zakon je $T^2 = a^3$, ne $T = a^2$.
+ približno $12$ let
- približno $140$ let
~ To je $a^3$, torej $T^2$. Pozabil si koreniti.
> $T = \sqrt{5{,}2^3} = \sqrt{140{,}6} \approx 11{,}9$ leta, torej okoli $12$ let.

? Asteroid obkroži Sonce v $8$ letih. Kolikšna je velika polos njegovega tira?
- $2\,\mathrm{a.e.}$
~ To je kubni koren iz $T = 8$. Koreniti moraš $T^2 = 64$.
+ $4\,\mathrm{a.e.}$
- $8\,\mathrm{a.e.}$
~ To bi veljalo, če bi bila razdalja sorazmerna s časom. Iz $a^3 = T^2$ sledi manjša vrednost.
- $22{,}6\,\mathrm{a.e.}$
~ To je $\sqrt{8^3}$: zamenjal si vlogi $T$ in $a$.
> $a^3 = T^2 = 64$, zato $a = \sqrt[3]{64} = 4\,\mathrm{a.e.}$ Asteroid kroži med tiroma Marsa in Jupitra.

:::simboli
F_\mathrm{g} | gravitacijska sila | F_\mathrm{g} = \frac{G m M}{r^2} | N
F_\mathrm{c} | centripetalna sila | F_\mathrm{c} = \frac{m v^2}{r} | N
G | gravitacijska konstanta | | N\,m^2/kg^2 | $6{,}67\cdot10^{-11}$
m | masa krožečega telesa (planeta, satelita) | | kg | se pokrajša
M | masa osrednjega telesa (Sonca ali Zemlje) | | kg
r | razdalja od središča osrednjega telesa (polmer tira) | | m
v | hitrost kroženja | v = \sqrt{\frac{G M}{r}} | m/s
T | obhodni čas | T^2 = \frac{4\pi^2 r^3}{G M} | s | v primeru 3 tudi čas obrata Zemlje
a | velika polos elipse | | m | za planete pogosto v a.e.
a_\mathrm{M} | velika polos tira Marsa | | a.e.
T_\mathrm{M} | obhodni čas Marsa | T_\mathrm{M} = \sqrt{a_\mathrm{M}^3} | leto | $a$ v a.e.
a_\mathrm{Z} | velika polos tira Zemlje | | a.e. | $1\,\mathrm{a.e.}$
T_\mathrm{Z} | obhodni čas Zemlje | | leto | $1$ leto
M_\mathrm{Z} | masa Zemlje | | kg
R_\mathrm{Z} | polmer Zemlje | | km
h | višina satelita nad površjem | h = r - R_\mathrm{Z} | km
T_\mathrm{GPS} | obhodni čas satelita GPS | | h
r_\mathrm{GPS} | polmer tira satelita GPS | r_\mathrm{GPS} = r \left(\frac{T_\mathrm{GPS}}{T}\right)^{2/3} | km
h_\mathrm{GPS} | višina satelita GPS nad površjem | h_\mathrm{GPS} = r_\mathrm{GPS} - R_\mathrm{Z} | km
:::
