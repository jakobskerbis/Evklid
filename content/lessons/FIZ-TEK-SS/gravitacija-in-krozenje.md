---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Maja s staršema z avtodomom potuje na Hvar. Na izvozu z avtoceste, v tesni zanki, jih vse potegne v stran, čeprav oče drži stalno hitrost. Na kampu mora Maja sama nastaviti satelitsko anteno za televizijo. Navodila so kratka: »Krožnik obrni proti jugu, nagni ga približno $40^\circ$ nad obzorje in ga privij. Potem ga ne premikaj več.«

Maja se čudi. Navigacija v njenem telefonu ves čas lovi satelite GPS, ki se po nebu premikajo, in na vsakih nekaj minut uporablja druge. Zakaj bi bil televizijski satelit pri miru? In kako visoko ga je treba »parkirati«?

Odgovor se začne pri zanki na avtocesti. Avtodom v zavoju in satelit okoli Zemlje se gibljeta po krivulji, za kar oba potrebujeta silo proti središču. Ko to razumeš, z nekaj vrsticami izračunaš višino vsakega satelita, hitrost vesoljske postaje in obliko tirov planetov. To so stalni gostje tekmovalnih nalog.

## Razlaga

**1. Slika zavoja.** Avtodom vozi po krožni zanki s stalno hitrostjo. Nariši ga v dveh bližnjih legah A in B:

:::risba skica
opis: Krog s središčem S. Avto se giblje v nasprotni smeri urnega kazalca. V točki A desno zgoraj kaže puščica hitrosti levo navzgor, v točki B levo zgoraj kaže puščica hitrosti levo navzdol. Puščici sta enako dolgi, a različno usmerjeni. Na vrhu kroga kaže puščica centripetalnega pospeška navpično navzdol proti središču.
območje: 0; 0 .. 8; 6,5
enota: 38
krog: 4; 3,2 | 2,4 | siva
točka: 4; 3,2 | S | pod
točka: 5,2; 5,28 | A | desno
točka: 2,8; 5,28 | B | levo
puščica: 5,2; 5,28 -> 3,81; 6,08 | v_A | desno | modra
puščica: 2,8; 5,28 -> 1,41; 4,48 | v_B | levo | modra
puščica: 4; 5,6 -> 4; 4,2 | a_r | desno | oranžna
:::

Puščici hitrosti sta enako dolgi, a kažeta v različni smeri. Hitrost se je torej spremenila, čeprav merilnik hitrosti kaže isto. Če od $v_B$ odšteješ $v_A$, razlika kaže naravnost proti središču S. Vsako kroženje ima zato pospešek proti središču, **centripetalni pospešek** $a_r$.

Kdaj je velik? Hitrost šteje dvakrat: pri večji hitrosti se smer obrača hitreje, poleg tega pa vsak obrat spremeni daljšo puščico. Pri ožjem zavoju (manjšem $r$) se smer obrača hitreje. Vse skupaj da

$$a_r = \frac{v^2}{r}$$

kjer je $r$ polmer kroženja. Za en obhod potrebuje telo **obhodni čas** $t_0$, zato je $v = \frac{2\pi r}{t_0}$ in

$$a_r = \frac{4\pi^2 r}{t_0^2}$$

Centripetalni pospešek ni posledica nove, posebne sile. Povzroča ga rezultanta sil, ki jih že poznaš: na cesti sila lepenja med gumami in asfaltom, pri kamnu na vrvici sila vrvice, pri satelitu teža.

V simulaciji spodaj »Kroženje« podvoji hitrost vrtenja (prepolovi $t_0$). Opazuj, kolikokrat se poveča potrebna sila.

**2. Kaj drži satelit na tiru.** Predstavljaj si top na zelo visoki gori, ki strelja vodoravno. Počasna krogla pade blizu. Hitrejša pade dlje, ker se tla pod njo že nekoliko ukrivijo. Pri pravi hitrosti se Zemlja pod kroglo ukrivlja natanko toliko, kot krogla pada. Krogla pada ves čas, a nikoli ne pade na tla. To je satelit.

Silo proti središču daje gravitacija. Med satelitom z maso $m$ in Zemljo z maso $M$ na razdalji $r$ med središčema deluje

$$F_g = \frac{G m M}{r^2}$$

kjer je $G = 6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2}$ gravitacijska konstanta. Ko $F_g$ izenačiš z $m a_r = m\frac{v^2}{r}$, se masa satelita pokrajša in ostane

$$v = \sqrt{\frac{G M}{r}}$$

Vsa telesa na isti krožnici, lahka in težka, krožijo enako hitro. Nižji satelit kroži hitreje.

:::premisli
Vesoljska postaja ISS kroži $420\,\mathrm{km}$ nad tlemi, kjer je težni pospešek še vedno okoli $8{,}6\,\mathrm{m/s^2}$. Zakaj astronavti v njej lebdijo?
---
Ker postaja in astronavti skupaj prosto padajo proti Zemlji z enakim pospeškom. Tla postaje ne pritiskajo nanje, zato ne čutijo teže. Gravitacija ni izginila; prav ona jih drži na tiru.
:::

**3. Tabela satelitov.** Johannes Kepler je zakonitosti tirov našel iz meritev, brez Newtonovega zakona. Naredimo isto z Zemljinimi spremljevalci:

| Tir | $r$ [km] | $t_0$ [h] | $r^3/t_0^2$ |
|---|---|---|---|
| ISS | $6\,790$ | $1{,}548$ | $1{,}306$ |
| GPS | $26\,560$ | $11{,}97$ | $1{,}308$ |
| geostac. | $42\,160$ | $23{,}93$ | $1{,}309$ |
| Luna | $384\,400$ | $655{,}7$ | $1{,}321$ |

Zadnji stolpec je v enotah $10^{11}\,\mathrm{km^3/h^2}$. Polmeri se razlikujejo za faktor $57$, količnik v zadnjem stolpcu pa skoraj nič. To je **3. Keplerjev zakon**: za vsa telesa okoli istega osrednjega telesa je $r^3/t_0^2$ enak. Iz $F_g = m a_r$ dobiš še, koliko je:

$$\frac{r^3}{t_0^2} = \frac{G M}{4\pi^2}$$

Luna ima malo večji količnik, ker ni zanemarljivo lahka v primerjavi z Zemljo.

**4. Elipsa.** Tiri planetov niso natanko krožnice. **1. Keplerjev zakon**: planet se giblje po elipsi, Sonce je v enem od njenih gorišč. Gorišči sta točki na najdaljšem premeru elipse, za kateri je vsota razdalj do katerekoli točke elipse enaka. Pri elipsi je $r$ v 3. zakonu velika polos, polovica najdaljšega premera.

:::risba skica
opis: Močno sploščena elipsa. Sonce je v gorišču blizu desnega konca. Iz Sonca vodita dva osenčena izseka z enako ploščino: A₁ ob najbližji točki je kratek in širok, A₂ ob najbolj oddaljeni točki je dolg in ozek. Lok izseka A₁ je okoli 5,4 enote, lok izseka A₂ manj kot 1,3 enote.
območje: 0; 0 .. 9,2; 6,6
enota: 33
lik: 8,60; 3,30 -> 8,52; 3,89 -> 8,30; 4,45 -> 7,93; 4,97 -> 7,43; 5,42 -> 6,82; 5,79 -> 6,13; 6,07 -> 5,38; 6,24 -> 4,60; 6,30 -> 3,82; 6,24 -> 3,07; 6,07 -> 2,38; 5,79 -> 1,77; 5,42 -> 1,27; 4,97 -> 0,90; 4,45 -> 0,68; 3,89 -> 0,60; 3,30 -> 0,68; 2,71 -> 0,90; 2,15 -> 1,27; 1,63 -> 1,77; 1,18 -> 2,38; 0,81 -> 3,07; 0,53 -> 3,82; 0,36 -> 4,60; 0,30 -> 5,38; 0,36 -> 6,13; 0,53 -> 6,82; 0,81 -> 7,43; 1,18 -> 7,93; 1,63 -> 8,30; 2,15 -> 8,52; 2,71 | siva
lik: 7,25; 3,30 -> 7,26; 1,06 -> 7,87; 1,57 -> 8,38; 2,32 -> 8,60; 3,30 -> 8,38; 4,28 -> 7,87; 5,03 -> 7,26; 5,54 | oranžna ozadje
lik: 7,25; 3,30 -> 0,69; 3,93 -> 0,64; 3,72 -> 0,61; 3,51 -> 0,60; 3,30 -> 0,61; 3,09 -> 0,64; 2,88 -> 0,69; 2,67 | modra ozadje
točka: 7,25; 3,30 | Sonce | pod
napis: 8,1; 4,1 | A₁ | levo
napis: 2,2; 3,3 | A₂ | nad
:::

**2. Keplerjev zakon**: zveznica Sonce–planet v enakih časih opiše enake ploščine. Oba osenčena izseka imata enako ploščino, zato planet obe poti prepotuje v enakem času. Lok ob Soncu je mnogo daljši, torej je planet tam hitrejši.

Kako hitrejši? Ozek izsek je skoraj trikotnik z osnovnico $v\,\Delta t$ in višino $r$. Ploščina $\frac{1}{2} r v\,\Delta t$ mora biti v najbližji in najbolj oddaljeni točki enaka:

$$v_p r_p = v_a r_a$$

Tu sta $r_p$ in $v_p$ razdalja in hitrost v **prisončju** (najbližji točki), $r_a$ in $v_a$ pa v **odsončju**. Zveza velja samo v teh dveh točkah, kjer je hitrost pravokotna na zveznico.

:::premisli
Zemlja je Soncu najbližje v začetku januarja ($147{,}1$ milijona km), najdlje v začetku julija ($152{,}1$ milijona km). Kdaj se giblje hitreje in za koliko odstotkov?
---
Januarja. $\dfrac{v_p}{v_a} = \dfrac{r_a}{r_p} = \dfrac{152{,}1}{147{,}1} \approx 1{,}034$, torej je januarja hitrejša za približno $3{,}4\,\%$. Zima na severni polobli ni posledica razdalje do Sonca.
:::

V simulaciji spodaj »Tir satelita in Keplerjevi zakoni« nastavi začetno hitrost najprej na krožno hitrost ($1{,}00$), nato na $1{,}20$-kratnik krožne. Opazuj, kje na elipsi satelit pospeši. Nato poišči hitrost, pri kateri satelit odleti in se ne vrne več.

## Rešeni primeri

### Primer 1: izvozna zanka

Avtodom vozi skozi izvozno zanko avtoceste s polmerom $50\,\mathrm{m}$ s hitrostjo $54\,\mathrm{km/h}$. Kolikšen je njegov centripetalni pospešek? Kolikšen mora biti vsaj koeficient lepenja med gumami in cesto, da avtodom ne zdrsne? Cesta je vodoravna.

**Podatki:** $r = 50\,\mathrm{m}$, $v = 54\,\mathrm{km/h}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** $a_r$ in najmanjši $k_l$

:::formula
$a_r = \dfrac{v^2}{r}$, pogoj lepenja $m a_r \le k_l m g$, torej $k_l \ge \dfrac{a_r}{g}$
:::

**Rešitev:**

1. Pretvorimo hitrost: $v = \dfrac{54}{3{,}6} = 15\,\mathrm{m/s}$.
2. $a_r = \dfrac{(15\,\mathrm{m/s})^2}{50\,\mathrm{m}} = 4{,}5\,\mathrm{m/s^2}$.
3. Silo proti središču daje samo sila lepenja, največ $k_l m g$. Masa se pokrajša: $k_l \ge \dfrac{4{,}5}{9{,}81} \approx 0{,}46$.
4. Odgovor: pospešek je $4{,}5\,\mathrm{m/s^2}$, koeficient lepenja pa mora biti vsaj $0{,}46$. Na mokri cesti je lepenje lahko manjše, na poledeneli pa zagotovo, zato je tam hitrost omejena.

### Primer 2: vesoljska postaja

ISS kroži $420\,\mathrm{km}$ nad površjem Zemlje. Kolikšna je njena hitrost in obhodni čas? Polmer Zemlje je $6\,370\,\mathrm{km}$, njena masa $5{,}97 \cdot 10^{24}\,\mathrm{kg}$, $G = 6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2}$.

**Podatki:** $h = 420\,\mathrm{km}$, $R = 6\,370\,\mathrm{km}$, $M = 5{,}97 \cdot 10^{24}\,\mathrm{kg}$, $G = 6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2}$
**Iščemo:** hitrost $v$ in obhodni čas $t_0$

:::formula
$r = R + h$, $v = \sqrt{\dfrac{G M}{r}}$, $t_0 = \dfrac{2\pi r}{v}$
:::

**Rešitev:**

1. Polmer tira merimo od središča Zemlje: $r = 6\,370\,\mathrm{km} + 420\,\mathrm{km} = 6\,790\,\mathrm{km} = 6{,}79 \cdot 10^6\,\mathrm{m}$.
2. $G M = 6{,}67 \cdot 10^{-11} \cdot 5{,}97 \cdot 10^{24} \approx 3{,}982 \cdot 10^{14}\,\mathrm{m^3/s^2}$.
3. $v = \sqrt{\dfrac{3{,}982 \cdot 10^{14}}{6{,}79 \cdot 10^{6}}} \approx 7\,658\,\mathrm{m/s} \approx 7{,}66\,\mathrm{km/s}$.
4. Obseg tira deljen s hitrostjo: $t_0 = \dfrac{2\pi \cdot 6{,}79 \cdot 10^6}{7\,658} \approx 5\,571\,\mathrm{s} \approx 92{,}9\,\mathrm{min}$.
5. Odgovor: ISS leti s hitrostjo $7{,}66\,\mathrm{km/s}$ in obkroži Zemljo v $92{,}9$ minutah, kar je približno $15{,}5$ obhoda na dan.

### Primer 3: kje parkirati televizijski satelit

Majin televizijski satelit je **geostacionaren**: nad ekvatorjem kroži v smeri vrtenja Zemlje z obhodnim časom enega zvezdnega dne, $23{,}93\,\mathrm{h}$. Zato je ves čas nad isto točko. Kolikšen je polmer njegovega tira in kako visoko nad tlemi je? Namesto mase Zemlje uporabi Luno: kroži na razdalji $384\,400\,\mathrm{km}$ z obhodnim časom $27{,}32$ dneva. Polmer Zemlje je $6\,370\,\mathrm{km}$.

**Podatki:** $t_g = 23{,}93\,\mathrm{h}$, $r_L = 384\,400\,\mathrm{km}$, $t_L = 27{,}32\,\mathrm{d}$, $R = 6\,370\,\mathrm{km}$
**Iščemo:** polmer tira $r_g$ in višino $h$

:::formula
3. Keplerjev zakon: $\dfrac{r_g^3}{t_g^2} = \dfrac{r_L^3}{t_L^2}$, torej $r_g = r_L \left(\dfrac{t_g}{t_L}\right)^{2/3}$
:::

**Rešitev:**

1. Oba časa v isti enoti: $t_g = \dfrac{23{,}93}{24}\,\mathrm{d} \approx 0{,}9971\,\mathrm{d}$.
2. Razmerje časov: $\dfrac{0{,}9971}{27{,}32} \approx 0{,}03650$.
3. Iz $r^3 \propto t_0^2$ sledi $r \propto t_0^{2/3}$: $0{,}03650^{2/3} \approx 0{,}1100$.
4. $r_g = 384\,400\,\mathrm{km} \cdot 0{,}1100 \approx 42\,300\,\mathrm{km}$.
5. Višina nad tlemi: $h = 42\,300\,\mathrm{km} - 6\,370\,\mathrm{km} \approx 35\,900\,\mathrm{km}$.
6. Odgovor: satelit kroži približno $42\,300\,\mathrm{km}$ od središča Zemlje, $35\,900\,\mathrm{km}$ nad ekvatorjem. Natančna vrednost je $42\,160\,\mathrm{km}$; majhno razliko povzroči Lunina masa. Ker je ekvator južno od Hrvaške, Maja anteno obrne proti jugu in je nikoli več ne premika.

### Primer 4: zdaj ti – sateliti GPS

Sateliti GPS obkrožijo Zemljo v polovici zvezdnega dne. Kako visoko nad tlemi krožijo? Geostacionarni tir ima polmer $42\,160\,\mathrm{km}$, polmer Zemlje je $6\,370\,\mathrm{km}$.

**Podatki:** $t_{GPS} = \frac{1}{2} t_g$, $r_g = 42\,160\,\mathrm{km}$, $R = 6\,370\,\mathrm{km}$
**Iščemo:** višino $h$

:::formula
$r_{GPS} = r_g \left(\dfrac{t_{GPS}}{t_g}\right)^{2/3}$, $h = r_{GPS} - R$
:::

**Rešitev:**

1. Razmerje obhodnih časov je $\frac{1}{2}$.
2. $\left(\frac{1}{2}\right)^{2/3} \approx 0{,}630$.
3. Polmer tira in višino zdaj izračunaj ti. Rezultat primerjaj spodaj:

:::premisli
Koliko sta $r_{GPS}$ in $h$?
---
$r_{GPS} = 42\,160\,\mathrm{km} \cdot 0{,}630 \approx 26\,560\,\mathrm{km}$, $h = 26\,560\,\mathrm{km} - 6\,370\,\mathrm{km} = 20\,190\,\mathrm{km}$. Satelit GPS obkroži Zemljo dvakrat na dan, zato se po Majinem nebu premika.
:::

## Pogoste napake

- **»Centrifugalna sila ga potiska ven.«** Iz avtodoma v zavoju te nič ne vleče navzven: tvoje telo bi rado nadaljevalo naravnost, avtodom pa zavije. Na krožeče telo deluje rezultanta **proti središču**. Ni dodatna sila, ampak teža, lepenje ali sila vrvice.
- **»V vesoljski postaji ni gravitacije.«** Na višini ISS je težni pospešek okoli $8{,}6\,\mathrm{m/s^2}$. Astronavti lebdijo, ker skupaj s postajo prosto padajo.
- **»Težji satelit mora krožiti hitreje.«** Masa satelita se pri $F_g = m a_r$ pokrajša. Hitrost in obhodni čas sta odvisna le od $r$ in mase osrednjega telesa.
- **Višina namesto polmera.** V $v = \sqrt{GM/r}$ in v 3. Keplerjev zakon gre razdalja od **središča** Zemlje, ne višina nad tlemi.
- **Napačna potenca v 3. Keplerjevem zakonu.** Iz $r^3 \propto t_0^2$ sledi $r \propto t_0^{2/3}$, ne $t_0^{3/2}$ in ne $t_0^2$. Dvakrat daljši obhodni čas pomeni le $1{,}59$-krat večji polmer.

## Povzetek

- Pri kroženju je pospešek usmerjen proti središču: $a_r = \frac{v^2}{r} = \frac{4\pi^2 r}{t_0^2}$. Povzroča ga rezultanta znanih sil.
- Satelitu silo proti središču daje gravitacija $F_g = \frac{G m M}{r^2}$; hitrost na krožnici je $v = \sqrt{GM/r}$, neodvisna od mase satelita.
- 1. Keplerjev zakon: tir je elipsa, osrednje telo je v gorišču.
- 2. Keplerjev zakon: enake ploščine v enakih časih; $v_p r_p = v_a r_a$.
- 3. Keplerjev zakon: $r^3/t_0^2 = GM/(4\pi^2)$, enako za vsa telesa okoli istega osrednjega telesa.
- Geostacionarni satelit: $t_0 = 23{,}93\,\mathrm{h}$, $r = 42\,160\,\mathrm{km}$, nad ekvatorjem.

## Drugače: Z analogijo

Kroženje je kot kamen na vrvici. Vrvica ga ves čas vleče proti roki in mu obrača smer. Če jo prerežeš, kamen odleti naravnost po tangenti, ne navzven. Pri satelitu je vrvica nevidna: gravitacija. Daljša vrvica pri isti sili pomeni daljši obhodni čas. Oddaljen satelit ga ima še daljšega, ker ga gravitacija vleče šibkeje.

Za 2. Keplerjev zakon si predstavljaj vrv za skakanje, ki jo vrtiš. Kadar jo skrajšaš, konec vrvi hitreje švigne okoli. Planet blizu Sonca je na »kratki vrvi« in hiti, daleč od Sonca je na »dolgi« in se vleče.

Za 3. zakon pomisli na proge na atletskem stadionu, le da je tu vsaka zunanja proga še počasnejša. Zunanji tekač mora preteči daljšo pot in teče počasneje, zato krog traja nesorazmerno dlje: polmer $4$-krat, čas $8$-krat.

## Drugače: Iz vsakdanjega življenja

- **Navigacija v telefonu** računa lego iz signalov vsaj štirih satelitov GPS. Ti krožijo $20\,190\,\mathrm{km}$ visoko in vsak obkroži Zemljo dvakrat na dan, zato jih telefon sproti menja.
- **Satelitske antene** v Sloveniji in na Hrvaškem gledajo proti jugu in navzgor. Vse kažejo na isti pas nad ekvatorjem, kjer stojijo geostacionarni sateliti.
- **Izvozi z avtocest** imajo omejitev hitrosti in so pogosto nagnjeni navznoter. Na nagnjeni cesti k sili proti središču prispeva tudi sila podlage, zato je zavoj varnejši.
- **ISS na nočnem nebu** je svetla pika, ki prečka nebo v nekaj minutah. Hitro se premika, ker je nizko in obkroži Zemljo v dobri uri in pol.

## Preveri se

? Razvrsti korake, s katerimi iz obhodnega časa izračunaš višino satelita nad tlemi.
1. Iz naloge izpiši obhodni čas in ga pretvori v sekunde.
2. Gravitacijsko silo izenači z $m a_r$, kjer je $a_r = \frac{4\pi^2 r}{t_0^2}$.
3. Izrazi tretjo potenco polmera: $r^3 = \frac{G M t_0^2}{4\pi^2}$.
4. Izračunaj tretji koren in dobiš $r$.
5. Od $r$ odštej polmer Zemlje.
> Najprej enote, nato fizikalna enačba, nato algebra. Zadnji korak je pogosto pozabljen: $r$ je razdalja od središča Zemlje, višina pa $h = r - R$.

? Vsi sateliti na isti krožnici okoli Zemlje imajo nekatere količine enake. Katera količina **ne sodi** zraven, ker je pri različnih satelitih različna?
- hitrost
~ Hitrost $v = \sqrt{GM/r}$ je odvisna samo od $r$; masa satelita se pokrajša.
- obhodni čas
~ Obhodni čas sledi iz 3. Keplerjevega zakona in ni odvisen od mase satelita.
- centripetalni pospešek
~ $a_r = \frac{GM}{r^2}$ je enak za vse satelite na isti razdalji, tako kot je težni pospešek enak za vsa telesa.
+ gravitacijska sila na satelit
> $F_g = \frac{G m M}{r^2}$ je sorazmerna z maso satelita $m$. Pospešek, hitrost in obhodni čas pa so za lahke in težke satelite enaki.

? Komet kroži okoli Sonca po elipsi na risbi. V prisončju je $0{,}8\,\mathrm{AE}$ od Sonca in ima hitrost $45\,\mathrm{km/s}$. Odsončje je $7{,}2\,\mathrm{AE}$ od Sonca. Kolikšna je hitrost kometa v odsončju (v km/s)?
:::risba skica
opis: Elipsa, Sonce je v gorišču blizu desnega konca. Najbližja točka elipse, prisončje, je 0,8 AE desno od Sonca. Najbolj oddaljena točka, odsončje, je 7,2 AE levo od Sonca.
območje: 0; 0 .. 11; 6,6
enota: 28
lik: 10,50; 3,30 -> 10,40; 3,89 -> 10,12; 4,45 -> 9,66; 4,97 -> 9,04; 5,42 -> 8,28; 5,79 -> 7,41; 6,07 -> 6,48; 6,24 -> 5,50; 6,30 -> 4,52; 6,24 -> 3,59; 6,07 -> 2,72; 5,79 -> 1,96; 5,42 -> 1,34; 4,97 -> 0,88; 4,45 -> 0,60; 3,89 -> 0,50; 3,30 -> 0,60; 2,71 -> 0,88; 2,15 -> 1,34; 1,63 -> 1,96; 1,18 -> 2,72; 0,81 -> 3,59; 0,53 -> 4,52; 0,36 -> 5,50; 0,30 -> 6,48; 0,36 -> 7,41; 0,53 -> 8,28; 0,81 -> 9,04; 1,18 -> 9,66; 1,63 -> 10,12; 2,15 -> 10,40; 2,71 | siva
točka: 9,5; 3,3 | Sonce | pod
točka: 10,5; 3,3 | prisončje | nad levo
točka: 0,5; 3,3 | odsončje | nad desno
črta: 0,5; 3,3 -> 9,5; 3,3 | črtkano
napis: 5; 3,3 | 7,2 AE | pod
:::
= 5 km/s | 0,1
~ 405 | Hitrost si pomnožil z razmerjem razdalj. Daleč od Sonca je komet počasnejši, ne hitrejši.
~ 15 | Uporabil si koren razmerja razdalj. Iz enakih ploščin sledi $v_p r_p = v_a r_a$, brez korena.
~ 45 | Hitrost se po elipsi spreminja: 2. Keplerjev zakon zahteva manjšo hitrost v odsončju.
> $v_a = \dfrac{v_p r_p}{r_a} = \dfrac{45 \cdot 0{,}8}{7{,}2} = 5\,\mathrm{km/s}$.

? Satelit s krožnice preide na nižjo krožnico. Kaj je posledica?
- Hitrost se zmanjša, obhodni čas se podaljša.
~ Na nižji krožnici je gravitacija močnejša. Da ostane v tiru, mora satelit krožiti hitreje: $v = \sqrt{GM/r}$.
+ Hitrost se poveča, obhodni čas se skrajša.
- Hitrost ostane enaka, obhodni čas se skrajša le zaradi krajše poti.
~ Hitrost ni enaka za vse tire. Odvisna je od $r$, zato se spremenita obe količini.
> Iz $v = \sqrt{GM/r}$ sledi večja hitrost pri manjšem $r$, iz $r^3/t_0^2 = \text{konst.}$ pa krajši obhodni čas.

? Jure računa, kolikokrat večji polmer tira ima satelit B od satelita A, če ima $8$-krat daljši obhodni čas. V katerem koraku se je zmotil?
1. korak: $t_B / t_A = 8$.
2. korak: iz 3. Keplerjevega zakona $r_B / r_A = 8^{3/2}$.
3. korak: $8^{3/2} \approx 22{,}6$.
4. korak: polmer tira B je $22{,}6$-krat večji.
- v 1. koraku
~ Razmerje obhodnih časov je res $8$, kot pove naloga.
+ v 2. koraku
- v 3. koraku
~ Račun $8^{3/2} = \sqrt{512} \approx 22{,}6$ je pravilen, napaka je že prej v potenci.
- nikjer, rešitev je pravilna
~ Iz $r^3 \propto t_0^2$ sledi $r \propto t_0^{2/3}$, Jure pa je potenco obrnil.
> Pravilno je $r_B / r_A = 8^{2/3} = 4$. Polmer tira B je $4$-krat večji: $4^3 = 64 = 8^2$.

<<RACUN
enote: 54*km/h | 15*m/s
vrednost: 15^2/50 | 4.5
vrednost: 4.5/9.81 | 0.46
vrednost: 6.67*10^(-11)*5.97*10^24 | 3.982*10^14
vrednost: sqrt(6.67*10^(-11)*5.97*10^24/(6.79*10^6)) | ≈7658
vrednost: 2*pi*6.79*10^6/7658 | ≈5571
vrednost: 5571/60 | 92.9
vrednost: 23.93/24 | 0.9971
vrednost: 0.9971/27.32 | 0.03650
vrednost: 0.0365^(2/3) | 0.1100
vrednost: 384400*0.1100 | 42284
vrednost: 42300-6370 | 35930
vrednost: (1/2)^(2/3) | 0.630
vrednost: 42160*0.630 | ≈26561
vrednost: 26560-6370 | 20190
vrednost: 152.1/147.1 | 1.034
vrednost: 45*0.8/7.2 | 5
vrednost: 8^(2/3) | 4
>>

:::simboli
a_r | centripetalni pospešek | a_r = \frac{v^2}{r} | m/s^2 | usmerjen proti središču
v | hitrost (obodna) | v = \frac{2\pi r}{t_0} | m/s
r | polmer tira (od središča osrednjega telesa) | | m | pri elipsi velika polos
t_0 | obhodni čas | | s
F_g | gravitacijska sila | F_g = \frac{G m M}{r^2} | N
G | gravitacijska konstanta | | N\,m^2/kg^2 | $6{,}67 \cdot 10^{-11}$
m | masa krožečega telesa | | kg
M | masa osrednjega telesa (Zemlje, Sonca) | | kg
v_p | hitrost v prisončju | v_p = \frac{v_a r_a}{r_p} | m/s
r_p | razdalja v prisončju | | m
v_a | hitrost v odsončju | | m/s
r_a | razdalja v odsončju | | m
k_l | koeficient lepenja | | –
g | težni pospešek | | m/s^2 | $9{,}81\,\mathrm{m/s^2}$
R | polmer Zemlje | | m | $6\,370\,\mathrm{km}$
h | višina nad tlemi | h = r - R | m
r_g | polmer geostacionarnega tira | | m
t_g | obhodni čas geostacionarnega satelita | | s | en zvezdni dan
r_L | polmer Luninega tira | | m
t_L | obhodni čas Lune | | s
r_{GPS} | polmer tira satelita GPS | r_{GPS} = r_g \left(\frac{t_{GPS}}{t_g}\right)^{2/3} | m
t_{GPS} | obhodni čas satelita GPS | | s
:::
