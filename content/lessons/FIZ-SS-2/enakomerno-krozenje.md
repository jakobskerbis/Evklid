---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na slovenski avtocesti sme avto voziti največ $130\,\mathrm{km/h}$. Mednarodna vesoljska postaja (ISS) v $93$ minutah obkroži celo Zemljo. Njen tir je skoraj natančno krožnica s polmerom $6790\,\mathrm{km}$, merjeno od središča Zemlje. Kako hitro torej leti?

Izračun, ki ga boš znal narediti čez nekaj minut, da skoraj $7{,}7\,\mathrm{km}$ v sekundi. To je več kot $27\,000\,\mathrm{km/h}$, torej več kot dvestokrat hitreje od avta na avtocesti.

Drugo vprašanje je še bolj zanimivo. Zakaj postaja ne odleti naravnost v vesolje, ampak ostaja na krožnici? Odgovor skriva **centripetalni pospešek**. Z istimi orodji opišemo Luno okoli Zemlje, Zemljo okoli Sonca, satelite za televizijo in centrifugo, v kateri trenirajo astronavti.

## Razlaga

Kroženje bomo sestavili iz majhnih korakov. Za vsakim je kratko vprašanje za preverjanje, odgovor je v oklepaju.

**1. Kaj pomeni »enakomerno«.** Telo kroži **enakomerno**, ko v poljubnih enako dolgih časovnih intervalih opravi enako dolge loke krožnice. Čas enega celega obhoda je **obhodni čas** $t_0$. Število obhodov v eni sekundi je **frekvenca** $\nu = \dfrac{1}{t_0}$, z enoto $\mathrm{s^{-1}}$; to enoto imenujemo tudi hertz, $1\,\mathrm{s^{-1}} = 1\,\mathrm{Hz}$.

*Preveri:* vrtiljak naredi en obrat v $4\,\mathrm{s}$. Kolikšna je frekvenca? ($\nu = 0{,}25\,\mathrm{s^{-1}}$)

**2. Obodna hitrost.** V enem obhodu telo prepotuje obseg krožnice $2\pi r$ in za to porabi čas $t_0$. Velikost hitrosti je pot, deljena s časom:

$$v = \frac{2\pi r}{t_0}$$

Tej hitrosti rečemo **obodna hitrost**. Za ISS je $t_0 = 93\,\mathrm{min} = 5580\,\mathrm{s}$ in $r = 6{,}79 \cdot 10^6\,\mathrm{m}$, zato je $v \approx 7650\,\mathrm{m/s}$.

*Preveri:* dva otroka sedita na istem vrtiljaku, zato imata enak obhodni čas. Prvi kroži na dvakrat večjem polmeru. Kateri je hitrejši? (Prvi, dvakrat: v enakem času prepotuje dvakrat daljšo pot.)

**3. Smer hitrosti.** Hitrost je vektor, zato ima tudi smer. V vsaki točki kaže po **tangenti** na krožnico, to je pravokotno na polmer. Ko se telo premika po krožnici, se ta smer ves čas obrača. Velikost $v$ ostaja enaka, vektor $\vec v$ pa ne.

:::risba skica
opis: Krožnica s središčem S in polmerom 2. Telo kroži v smeri urinih kazalcev. V štirih točkah (zgoraj, desno, spodaj in levo) je narisana enako dolga puščica hitrosti v. Vsaka je pravokotna na polmer do svoje točke, zato kažejo v štiri različne smeri: v desno, navzdol, v levo in navzgor. Pri zgornji točki je polmer narisan črtkano z oznako pravega kota.
območje: -3,6; -2,8 .. 3,6; 2,8
krog: 0; 0 | 2 | siva
črta: 0; 0 -> 0; 2 | črtkano
pravikot: 0; 2 | 0; 0 | 1,4; 2
točka: 0; 0 | S | pod
puščica: 0; 2 -> 1,4; 2 | v | nad | modra
puščica: 2; 0 -> 2; -1,4 | v | desno | modra
puščica: 0; -2 -> -1,4; -2 | v | pod | modra
puščica: -2; 0 -> -2; 1,4 | v | levo | modra
podnapis: Hitrost kaže po tangenti: velikost je povsod enaka, smer pa se obrača.
:::

:::premisli
Kamen vrtiš na vrvici v vodoravni ravnini. Ravno ko je kamen severno od tvoje roke in se giblje proti vzhodu, se vrvica pretrga. Kam odleti: proti severu (navzven), proti vzhodu ali naprej po krivulji? Napovej, nato preveri v simulaciji spodaj.
---
Proti vzhodu, po tangenti. Ko vrvica ne vleče več, na kamen v vodoravni smeri ne deluje nobena sila. Po 1. Newtonovem zakonu zato nadaljuje premo, v smeri hitrosti, ki jo je imel v tistem trenutku. Navzven ga nič ne potiska.
:::

**4. Pospešek brez spremembe velikosti.** Pospešek pove, kako hitro se spreminja vektor hitrosti, ne le njegova velikost. Pri kroženju se spreminja smer, zato ima telo pospešek.

Kam kaže? Telo na sliki kroži v smeri urinih kazalcev. Na vrhu, v točki $A$, kaže hitrost $\vec v_1$ vodoravno v desno. Četrt obhoda kasneje, v točki $B$, kaže enako dolga hitrost $\vec v_2$ navpično navzdol.

:::risba skica
opis: Levo je krožnica s središčem S. Na vrhu, v točki A, puščica v₁ kaže v desno. Na desni strani, v točki B, puščica v₂ kaže navzdol. Na sredini loka med A in B je točka M, iz nje kaže črtkana puščica proti S. Desno sta v₁ in v₂ narisani iz iste točke O: v₁ v desno, v₂ navzdol. Puščica Δv gre od konca v₁ do konca v₂, torej poševno navzdol in v levo, vzporedno s črtkano puščico pri M.
območje: -5,6; -2,6 .. 5,6; 2,9
krog: -3; 0 | 2 | siva
točka: -3; 0 | S | pod
točka: -3; 2 | A | nad levo
točka: -1; 0 | B | levo
puščica: -3; 2 -> -1,6; 2 | v_1 | nad | modra
puščica: -1; 0 -> -1; -1,4 | v_2 | desno | modra
točka: -1,59; 1,41 | M | desno
puščica: -1,59; 1,41 -> -2,40; 0,60 | | | črtkano
točka: 2,2; 1,2 | O | levo
puščica: 2,2; 1,2 -> 4,6; 1,2 | v_1 | nad | modra
puščica: 2,2; 1,2 -> 2,2; -1,2 | v_2 | levo | modra
puščica: 4,6; 1,2 -> 2,2; -1,2 | Δv | desno | oranžna
podnapis: Sprememba hitrosti Δv kaže enako kot črtkana puščica pri M: proti središču.
:::

Na desni sta obe hitrosti narisani iz iste točke $O$. Sprememba hitrosti $\Delta \vec v$ je puščica od konca $\vec v_1$ do konca $\vec v_2$: kaže navzdol in v levo. Na sredini loka $AB$, v točki $M$, je to ravno smer proti $S$. Na kateremkoli koščku krožnice dobimo isto: sprememba hitrosti kaže proti središču.

Takemu pospešku rečemo **centripetalni** ali **radialni pospešek** $a_r$. Beseda »centripetalen« pomeni »ki teži k središču«.

*Preveri:* kam kaže pospešek ISS, ko leti točno nad Slovenijo? (Proti središču Zemlje, torej navpično navzdol.)

**5. Kako velik je pospešek.** Velikost centripetalnega pospeška je

$$a_r = \frac{v^2}{r}$$

Zakaj kvadrat hitrosti? Pri večji hitrosti je vektor $\vec v$ daljši, zato pomeni enak zasuk večjo spremembo. Poleg tega telo pri večji hitrosti hitreje preteče lok, zato se smer zasuče hitreje. Vsak razlog prinese en faktor $v$. S številkami: pri dvakratni hitrosti je $\Delta v$ za enak zasuk dvakrat daljši in nastane v pol krajšem času, zato je pospešek $2 \cdot 2 = 4$-krat večji. Večji polmer pomeni bolj položno krožnico: smer se obrača počasneje, zato je $a_r$ manjši. Natančno izpeljavo s sliko dveh podobnih trikotnikov najdeš spodaj v »Drugače: Bolj natančno«.

Za ISS to da $a_r \approx 8{,}6\,\mathrm{m/s^2}$ (račun je v primeru 2). Ta in druga telesa so zbrana v tabeli.

| Telo (obhodni čas) | $r$ | $v$ | $a_r$ |
|---|---|---|---|
| ISS ($93\,\mathrm{min}$) | $6790\,\mathrm{km}$ | $7{,}65\,\mathrm{km/s}$ | $8{,}6\,\mathrm{m/s^2}$ |
| TV satelit ($\approx 24\,\mathrm{h}$) | $42\,200\,\mathrm{km}$ | $3{,}1\,\mathrm{km/s}$ | $0{,}22\,\mathrm{m/s^2}$ |
| Luna ($27{,}3$ dneva) | $384\,000\,\mathrm{km}$ | $1{,}0\,\mathrm{km/s}$ | $0{,}0027\,\mathrm{m/s^2}$ |
| Zemlja okoli Sonca ($365$ dni) | $1{,}5 \cdot 10^{8}\,\mathrm{km}$ | $29{,}9\,\mathrm{km/s}$ | $0{,}0060\,\mathrm{m/s^2}$ |

Podatki v tabeli so zaokroženi, zato se zadnja števka lahko malo razlikuje od izmerjene.

*Preveri:* hitrost podvojiš, polmer ostane enak. Kolikokrat se poveča $a_r$? (Štirikrat, ker je $v$ na kvadrat.)

Isto pokaže graf. Na vodoravni osi je hitrost v $\mathrm{km/s}$, na navpični pospešek. Polna (modra) krivulja s točkama velja za polmer tira $6800\,\mathrm{km}$, kot pri ISS. Črtkana (siva) krivulja ves čas kaže ISS, zato se na začetku krivulji prekrivata. Točka pri $8\,\mathrm{km/s}$ leži pri $9{,}41\,\mathrm{m/s^2}$, točka pri $4\,\mathrm{km/s}$ pri $2{,}35\,\mathrm{m/s^2}$: štirikrat nižje. V aplikaciji premikaj drsnik polmera do $42\,000\,\mathrm{km}$ (tir TV satelita). Opazi dvoje: polna krivulja se splošči daleč pod črtkano, vrednosti v podnapisu pa se še vedno razlikujeta štirikrat (deli ju).

:::risba graf
opis: Graf centripetalnega pospeška v odvisnosti od hitrosti pri stalnem polmeru tira. Polna modra krivulja je parabola skozi izhodišče. Črtkana siva parabola za primerjavo vedno kaže ISS s polmerom 6,8 tisoč km; pri začetnem polmeru se krivulji prekrivata. V aplikaciji polmer modre spreminjaš z drsnikom; izbran je polmer {r} tisoč km. Pri 4 km/s je pospešek {16/r:.2} m/s², pri 8 km/s pa {64/r:.2} m/s², torej štirikrat več.
x: 0 .. 10 | 2 | v [km/s]
y: 0 .. 16 | 4 | a_r [m/s^2]
drsnik: r | 6,4 .. 42 | 0,2 | 6,8 | polmer tira v tisoč km
f: x^2/r | modra
f: x^2/6,8 | siva črtkano
točka: 4; 16/r
točka: 8; 64/r
podnapis: Polmer {r} tisoč km: pri 4 km/s je aᵣ = {16/r:.2} m/s², pri 8 km/s pa {64/r:.2} m/s².
:::

:::premisli
Zemlja leti okoli Sonca skoraj štirikrat hitreje kot ISS okoli Zemlje, pa ima skoraj $1500$-krat manjši pospešek. Zakaj?
---
Ker je polmer njenega tira ogromen. Kvadrat hitrosti je pri Zemlji okoli $15$-krat večji, polmer pa okoli $22\,000$-krat večji. V $a_r = \dfrac{v^2}{r}$ deljenje z velikim $r$ močno prevlada nad večjim $v^2$. Tir je tako položen, da se smer hitrosti obrača zelo počasi.
:::

**6. Kdo poskrbi za pospešek.** Po 2. Newtonovem zakonu pospešek zahteva silo. Za kroženje mora rezultanta sil kazati proti središču in biti velika

$$F_r = m\,a_r = \frac{m v^2}{r}$$

To je **centripetalna sila**. Ni nova vrsta sile, ampak vloga, ki jo prevzame znana sila. Pri kamnu na vrvici je to sila vrvice, pri ISS privlak Zemlje. Kako velik je ta privlak, pove gravitacijski zakon v naslednji lekciji.

*Preveri:* kaj da centripetalno silo avtomobilu v krožnem ovinku? (Sila lepenja med pnevmatikami in cesto.)

V simulaciji spodaj (»Enakomerno kroženje«) nastavi polmer $1\,\mathrm{m}$ in obhodni čas $2\,\mathrm{s}$. Zapiši $a_r$, nato obhodni čas razpolovi na $1\,\mathrm{s}$. Opazi, da se $a_r$ poveča štirikrat. Na koncu pritisni »Prereži vrvico« in poglej, v katero smer odleti kamen.

## Rešeni primeri

### Primer 1: Zemlja na poti okoli Sonca

Zemlja kroži okoli Sonca po približno krožnem tiru s polmerom $1{,}5 \cdot 10^{11}\,\mathrm{m}$. En obhod traja $365$ dni. Kolikšna je njena obodna hitrost?

**Podatki:** $r = 1{,}5 \cdot 10^{11}\,\mathrm{m}$, $t_0 = 365$ dni
**Iščemo:** obodno hitrost $v$

:::formula
$v = \dfrac{2\pi r}{t_0}$
:::

**Rešitev:**

1. Čas pretvorimo v sekunde, da bo hitrost v $\mathrm{m/s}$: $t_0 = 365 \cdot 24 \cdot 3600\,\mathrm{s} = 31\,536\,000\,\mathrm{s} \approx 3{,}15 \cdot 10^7\,\mathrm{s}$.
2. Obseg tira: $2\pi r = 2\pi \cdot 1{,}5 \cdot 10^{11}\,\mathrm{m} \approx 9{,}42 \cdot 10^{11}\,\mathrm{m}$.
3. Delimo pot s časom: $v = \dfrac{9{,}42 \cdot 10^{11}\,\mathrm{m}}{3{,}15 \cdot 10^7\,\mathrm{s}} \approx 2{,}99 \cdot 10^4\,\mathrm{m/s}$.
4. Odgovor: Zemlja leti okoli Sonca s hitrostjo približno $30\,\mathrm{km/s}$. V eni sekundi prepotuje toliko kot avto po avtocesti v približno $14$ minutah.

### Primer 2: pospešek vesoljske postaje

ISS kroži s hitrostjo $7{,}65\,\mathrm{km/s}$ po krožnici s polmerom $6790\,\mathrm{km}$. Kolikšen je njen centripetalni pospešek?

**Podatki:** $v = 7{,}65\,\mathrm{km/s}$, $r = 6790\,\mathrm{km}$
**Iščemo:** centripetalni pospešek $a_r$

:::formula
$a_r = \dfrac{v^2}{r}$
:::

**Rešitev:**

1. Pretvorimo v osnovne enote: $v = 7650\,\mathrm{m/s}$, $r = 6{,}79 \cdot 10^6\,\mathrm{m}$.
2. Kvadrat hitrosti: $v^2 = (7650\,\mathrm{m/s})^2 = 5{,}85 \cdot 10^7\,\mathrm{m^2/s^2}$.
3. Delimo s polmerom: $a_r = \dfrac{5{,}85 \cdot 10^7\,\mathrm{m^2/s^2}}{6{,}79 \cdot 10^6\,\mathrm{m}} \approx 8{,}6\,\mathrm{m/s^2}$.
4. Odgovor: pospešek postaje je približno $8{,}6\,\mathrm{m/s^2}$, kar je skoraj toliko kot pospešek kamna, ki prosto pada blizu tal ($9{,}8\,\mathrm{m/s^2}$). Postaja v resnici ves čas pada proti Zemlji, le da zaradi velike hitrosti ves čas »zgreši« tla.

### Primer 3: centrifuga za astronavte

Astronavti se na velike pospeške ob vzletu pripravljajo tudi v centrifugah. Naša centrifuga je izmišljena, a po velikosti podobna resničnim: kabina je na koncu ročice in kroži s polmerom $8{,}0\,\mathrm{m}$. Trener želi, da ima kabina centripetalni pospešek $29{,}4\,\mathrm{m/s^2}$, kar je trikrat več od $9{,}8\,\mathrm{m/s^2}$. Kolikšna mora biti obodna hitrost kabine in koliko obratov na minuto mora narediti ročica? Astronavt ima maso $80\,\mathrm{kg}$. Kolikšna vodoravna sila deluje nanj?

**Podatki:** $r = 8{,}0\,\mathrm{m}$, $a_r = 29{,}4\,\mathrm{m/s^2}$, $m = 80\,\mathrm{kg}$
**Iščemo:** obodno hitrost $v$, število obratov v eni minuti in silo $F_r$ na astronavta

:::formula
Iz $a_r = \dfrac{v^2}{r}$ sledi $v = \sqrt{a_r\, r}$; nato $t_0 = \dfrac{2\pi r}{v}$ in $F_r = m\,a_r$.
:::

**Rešitev:**

1. Tokrat poznamo pospešek in iščemo hitrost, zato enačbo obrnemo: $v^2 = a_r\, r = 29{,}4\,\mathrm{m/s^2} \cdot 8{,}0\,\mathrm{m} = 235{,}2\,\mathrm{m^2/s^2}$.
2. Korenimo: $v = \sqrt{235{,}2}\,\mathrm{m/s} \approx 15{,}3\,\mathrm{m/s}$, to je okoli $55\,\mathrm{km/h}$.
3. Obhodni čas iz obsega in hitrosti: $2\pi r \approx 50{,}3\,\mathrm{m}$, zato $t_0 = \dfrac{50{,}3\,\mathrm{m}}{15{,}3\,\mathrm{m/s}} \approx 3{,}3\,\mathrm{s}$.
4. Obrati v minuti: $\dfrac{60\,\mathrm{s}}{3{,}3\,\mathrm{s}} \approx 18$.
5. Sila na astronavta z maso $80\,\mathrm{kg}$, ker pospešek zahteva silo: $F_r = m\,a_r = 80\,\mathrm{kg} \cdot 29{,}4\,\mathrm{m/s^2} \approx 2350\,\mathrm{N}$. To je vodoravni del sile sedeža in kaže proti osi; navpični del sile sedeža hkrati drži astronavtovo težo.
6. Odgovor: kabina mora krožiti s hitrostjo približno $15\,\mathrm{m/s}$, ročica pa narediti okoli $18$ obratov na minuto. Pospešek $3 \cdot 9{,}8\,\mathrm{m/s^2}$ zapišemo kot $3\,g$, kjer je $g = 9{,}8\,\mathrm{m/s^2}$. Astronavt hkrati čuti še svojo težo, to je $1\,g$ navpično navzdol. Obe smeri sta pravokotni, zato je skupni občutek po Pitagorovem izreku $\sqrt{3^2 + 1^2}\,g \approx 3{,}2\,g$.

### Primer 4: zdaj ti

Fobos, večja Marsova luna, kroži okoli Marsa po krožnici s polmerom $9380\,\mathrm{km}$. En obhod traja $7{,}65\,\mathrm{h}$. Kolikšni sta njegova obodna hitrost in centripetalni pospešek?

**Podatki:** $r = 9380\,\mathrm{km}$, $t_0 = 7{,}65\,\mathrm{h}$
**Iščemo:** obodno hitrost $v$ in centripetalni pospešek $a_r$

:::formula
$v = \dfrac{2\pi r}{t_0}$, nato $a_r = \dfrac{v^2}{r}$
:::

**Rešitev:**

1. Pretvorimo enote: $r = 9{,}38 \cdot 10^6\,\mathrm{m}$, $t_0 = 7{,}65 \cdot 3600\,\mathrm{s} = 27\,540\,\mathrm{s}$.
2. Obseg tira: $2\pi r \approx 5{,}89 \cdot 10^7\,\mathrm{m}$.
3. Izračunaj $v$ in nato $a_r$ sam, potem preveri:

:::premisli
Koliko sta $v$ in $a_r$?
---
$v = \dfrac{5{,}89 \cdot 10^7\,\mathrm{m}}{27\,540\,\mathrm{s}} \approx 2140\,\mathrm{m/s}$ in $a_r = \dfrac{(2140\,\mathrm{m/s})^2}{9{,}38 \cdot 10^6\,\mathrm{m}} \approx 0{,}49\,\mathrm{m/s^2}$.
:::

## Pogoste napake

- **»Hitrost je stalna, zato ni pospeška.«** Stalna je le velikost hitrosti. Smer se ves čas spreminja, in tudi to je sprememba hitrosti. Zato ima vsako kroženje pospešek $a_r = \dfrac{v^2}{r}$.
- **»Pospešek kaže navzven.«** V avtu v ovinku te res »vrže« proti zunanji strani. To pa ni sila navzven, ampak tvoje telo, ki bi rado nadaljevalo naravnost. Pospešek in rezultanta sil kažeta proti središču.
- **»Ko se vrvica pretrga, kamen odleti radialno navzven.«** Odleti po tangenti, v smeri hitrosti v tistem trenutku, ker nanj ne deluje več nobena vodoravna sila.
- **Podvojena hitrost, podvojen pospešek.** V $a_r = \dfrac{v^2}{r}$ je hitrost na kvadrat: dvakrat večja hitrost pomeni štirikrat večji pospešek.
- **Mešanje enot.** Polmer v kilometrih in čas v minutah ali dnevih dajo nesmiselne rezultate. Pred računanjem vse pretvori v metre in sekunde.

## Povzetek

- Enakomerno kroženje: v enakih časih enako dolgi loki. Obhodni čas $t_0$, frekvenca $\nu = \dfrac{1}{t_0}$.
- Obodna hitrost: $v = \dfrac{2\pi r}{t_0}$; kaže po tangenti, njena smer se ves čas spreminja.
- Centripetalni (radialni) pospešek kaže proti središču: $a_r = \dfrac{v^2}{r}$.
- Za kroženje je potrebna rezultanta sil proti središču, $F_r = \dfrac{m v^2}{r}$; to vlogo prevzame znana sila (vrvica, lepenje, gravitacija).
- Brez te sile telo nadaljuje premo po tangenti.

## Drugače: Na sliki

Krožnica spodaj ima polmer $1{,}2$ enote, telo na njej kroži v smeri urinih kazalcev. Iz telesa izhajata dve puščici: hitrost $\vec v$ in pospešek $\vec a_r$. Kot merimo od desne strani krožnice v nasprotni smeri urinih kazalcev, kot v matematiki. Natisnjena slika kaže telo pri kotu $60°$. Telo kroži v smeri urinih kazalcev, zato se njegov kot s časom manjša. V aplikaciji zato premakni drsnik kota od $360°$ proti $0°$ in sledi puščicama.

:::risba graf
opis: Krožnica s središčem S. Telo kroži v smeri urinih kazalcev. V aplikaciji drsnik premika telo po krožnici; izbran je kot {k} stopinj. Iz telesa kažeta dve puščici: hitrost v po tangenti in pospešek aᵣ po polmeru proti S. Puščici sta pri vsakem kotu pravokotni.
x: 0 .. 4 | 4 |
y: 0 .. 4 | 4 |
enako: da
oznake: ne
mreža: ne
drsnik: k | 0 .. 360 | 15 | 60 | kot telesa v stopinjah
krog: 2; 2 | 1,2 | siva
točka: 2; 2 | S | pod
puščica: 2 + 1,2*cos(k*pi/180); 2 + 1,2*sin(k*pi/180) -> 2 + 1,2*cos(k*pi/180) + 0,7*sin(k*pi/180); 2 + 1,2*sin(k*pi/180) - 0,7*cos(k*pi/180) | | | modra
napis: 2 + 1,2*cos(k*pi/180) + 0,95*sin(k*pi/180); 2 + 1,2*sin(k*pi/180) - 0,95*cos(k*pi/180) | v | sredina
puščica: 2 + 1,2*cos(k*pi/180); 2 + 1,2*sin(k*pi/180) -> 2 + 0,5*cos(k*pi/180); 2 + 0,5*sin(k*pi/180) | | | oranžna
napis: 2 + 0,85*cos(k*pi/180) - 0,25*sin(k*pi/180); 2 + 0,85*sin(k*pi/180) + 0,25*cos(k*pi/180) | a_r | sredina
točka: 2 + 1,2*cos(k*pi/180); 2 + 1,2*sin(k*pi/180)
podnapis: Telo pri kotu {k}°: v po tangenti, aᵣ proti središču.
:::

Opazi dvoje. Puščica $\vec v$ je vedno pravokotna na polmer, puščica $\vec a_r$ pa vedno leži na polmeru in kaže v središče. Obe puščici sta ves čas pravokotni druga na drugo. Zato pospešek hitrosti ne poveča in ne zmanjša, ampak jo le obrača.

## Drugače: Bolj natančno

**Kotna hitrost.** Polmer, ki kaže na telo, se v času $t_0$ zavrti za poln kot $2\pi$. **Kotna hitrost** je $\omega = \dfrac{2\pi}{t_0}$, enota $\mathrm{rad/s}$, kar je isto kot $\mathrm{s^{-1}}$. Ker je $v = \dfrac{2\pi r}{t_0}$, velja $v = \omega r$.

**Izpeljava $a_r = \dfrac{v^2}{r}$.** V kratkem času $\Delta t$ telo prepotuje lok dolžine $v\,\Delta t$, polmer pa se zavrti za majhen kot $\varphi$. Za isti kot se zavrti tudi vektor hitrosti. Imamo dva enakokraka trikotnika z enakim vrhnim kotom:

- iz dveh polmerov $r$ in tetive, ki je skoraj enaka loku $v\,\Delta t$;
- iz dveh hitrosti $v$ in spremembe hitrosti $\Delta v$.

:::risba skica
opis: Levo je trikotnik iz središča S: dva polmera r oklepata kot φ, med njunima koncema je tetiva, označena v·Δt, nad njo črtkan lok krožnice. Desno sta iz točke O narisani hitrosti v pred in po premiku, enako dolgi, ki oklepata isti kot φ. Puščica Δv gre od konca prve hitrosti do konca druge, navpično navzdol. Oba trikotnika sta enakokraka z istim vrhnim kotom φ, zato sta podobna. Na sliki je kot povečan na 40 stopinj, da se bolje vidi.
območje: -6,2; -2 .. 3,8; 2,2
črta: -4; -1,5 -> -5,03; 1,32 | modra
črta: -4; -1,5 -> -2,97; 1,32 | modra
črta: -5,03; 1,32 -> -2,97; 1,32 | debelo
črta: -5,03; 1,32 -> -4,52; 1,45 -> -4; 1,5 -> -3,48; 1,45 -> -2,97; 1,32 | črtkano
točka: -4; -1,5 | S | pod
napis: -4,51; -0,09 | r | levo
napis: -3,49; -0,09 | r | desno
napis: -4; -0,8 | φ | sredina
napis: -4; 1,1 | v·Δt | pod
točka: 0; 0 | O | levo
puščica: 0; 0 -> 2,82; 1,03 | v | nad | modra
puščica: 0; 0 -> 2,82; -1,03 | v | pod | modra
puščica: 2,82; 1,03 -> 2,82; -1,03 | Δv | desno | oranžna
napis: 0,9; 0 | φ | sredina
podnapis: Levo polmera in tetiva, desno hitrosti in Δv: enak kot φ, podobna trikotnika.
:::

Trikotnika sta podobna, zato $\dfrac{\Delta v}{v} = \dfrac{v\,\Delta t}{r}$. Sledi $a_r = \dfrac{\Delta v}{\Delta t} = \dfrac{v^2}{r}$.

**Druge oblike.** Z $v = \omega r$ dobimo $a_r = \omega^2 r = \dfrac{4\pi^2 r}{t_0^2}$. Ali $a_r$ s polmerom raste ali pada, je odvisno od tega, kaj ostane enako. Pri enakem obhodnem času (na primer točke na isti vrteči se plošči) velja $a_r \propto r$. Pri enaki obodni hitrosti velja $a_r \propto \dfrac{1}{r}$.

## Preveri se

? Telo kroži v smeri urinih kazalcev in je ravno v točki $P$ na vrhu krožnice. Katera puščica na sliki kaže smer njegovega pospeška?
:::risba skica
opis: Krožnica s središčem S. Telo P je na vrhu krožnice in kroži v smeri urinih kazalcev. Iz P izhajajo štiri puščice: A navpično navzgor, B vodoravno v desno, C navpično navzdol in D poševno navzdol in v desno.
območje: -3; -2,6 .. 3; 3,6
krog: 0; 0 | 2 | siva
točka: 0; 0 | S | pod
točka: 0; 2 | P | nad levo
puščica: 0; 2 -> 0; 3,3 | A | desno
puščica: 0; 2 -> 1,4; 2 | B | nad
puščica: 0; 2 -> 0; 0,7 | C | levo
puščica: 0; 2 -> 1; 1 | D | desno
:::
- Puščica $A$.
~ To je občutek »metanja navzven« v ovinku. Pospešek pri kroženju kaže proti središču, ne stran od njega.
- Puščica $B$.
~ Puščica $B$ kaže po tangenti: to je smer hitrosti. Pospešek v smeri hitrosti bi telo pospeševal, pri enakomernem kroženju pa se velikost hitrosti ne spreminja.
+ Puščica $C$.
- Puščica $D$.
~ Pospešek nima dela v smeri hitrosti, zato ni nagnjen naprej. Pri enakomernem kroženju je pravokoten na hitrost.
> Hitrost kaže po tangenti ($B$), centripetalni pospešek pa vedno po polmeru proti središču $S$, torej navzdol ($C$).

? Zakaj ima ISS pospešek, čeprav leti ves čas z enako veliko hitrostjo?
- Ker na njeni višini ni gravitacije.
~ Na višini ISS je privlak Zemlje še zelo močan. Prav ta privlak ji daje centripetalni pospešek.
- Ker jo motorji ves čas pospešujejo naprej.
~ Motorje uporablja le občasno za popravke tira. Pospešek pri kroženju kaže proti središču, ne naprej.
- Nima pospeška, saj je hitrost stalna.
~ Stalna je le velikost hitrosti. Sprememba smeri je tudi sprememba vektorja hitrosti.
+ Ker se smer njene hitrosti ves čas spreminja.
> Pospešek opisuje spremembo vektorja hitrosti. Pri kroženju se spreminja smer, zato je pospešek $a_r = \dfrac{v^2}{r}$ usmerjen proti središču Zemlje.

? Luna obkroži Zemljo v približno $30$ dneh na razdalji približno $400\,000\,\mathrm{km}$. Brez računala oceni njeno obodno hitrost v $\mathrm{m/s}$.
= 1000 m/s | 200
~ 1,5·10^2 | Polmer si delil s časom. V enem obhodu Luna prepotuje cel obseg $2\pi r$, ne le $r$.
~ 5·10^2 | Uporabil si pol obsega $\pi r$. En obhod je cel obseg $2\pi r$.
~ 1 | To je hitrost v $\mathrm{km/s}$. Odgovor vpiši v $\mathrm{m/s}$.
> $v = \dfrac{2\pi r}{t_0} \approx \dfrac{2{,}5 \cdot 10^9\,\mathrm{m}}{2{,}6 \cdot 10^6\,\mathrm{s}} \approx 1000\,\mathrm{m/s}$. Račun s temi podatki da okoli $970\,\mathrm{m/s}$; z natančnima podatkoma iz tabele ($27{,}3$ dneva, $384\,000\,\mathrm{km}$) dobiš $1{,}02\,\mathrm{km/s}$.

? Satelit kroži s hitrostjo $7{,}8\,\mathrm{km/s}$ po krožnici s polmerom $6700\,\mathrm{km}$. Koliko minut traja en obhod?
= 90 min | 1
~ 45 | Uporabil si pot $\pi r$, to je pol obsega. En obhod je cel obseg $2\pi r$.
~ 5,4·10^3 | To je obhodni čas v sekundah. Deli s $60$, da dobiš minute.
~ 5,4 | Dobil si $5{,}4$ – premalo za sekunde in za minute. Polmer si vstavil v kilometrih, hitrost pa v metrih na sekundo. Najprej vse pretvori v metre in sekunde.
~ 0,09 | To je $5{,}4\,\mathrm{s}$, pretvorjenih v minute. Polmer si vstavil v kilometrih, hitrost pa v metrih na sekundo. Najprej vse pretvori v metre in sekunde.
> $t_0 = \dfrac{2\pi r}{v} = \dfrac{2\pi \cdot 6{,}7 \cdot 10^6\,\mathrm{m}}{7800\,\mathrm{m/s}} \approx 5400\,\mathrm{s} = 90\,\mathrm{min}$.

? Slika kaže centrifugo za astronavte od zgoraj. Ročica se vrti enakomerno, na njej sta kabini $K_1$ na razdalji $r$ in $K_2$ na razdalji $2r$ od osi. Kolikokrat večji centripetalni pospešek ima $K_2$ kot $K_1$?
:::risba skica
opis: Pogled od zgoraj. Iz središča S gre vodoravno v desno ročica. Na njej sta dve kabini: K₁ na razdalji r od S in K₂ na koncu, na razdalji 2r. Krožnici kažeta tira obeh kabin. Obe kabini naredita en obrat v istem času.
območje: -4,6; -4,6 .. 4,6; 4,6
krog: 0; 0 | 4 | siva
krog: 0; 0 | 2 | siva
črta: 0; 0 -> 4; 0 | debelo
točka: 0; 0 | S | levo
točka: 2; 0 | K_1 | nad desno
točka: 4; 0 | K_2 | nad levo
napis: 1; 0 | r | pod
napis: 3; 0 | r | pod
:::
- Enak.
~ Pri enakem obhodnem času na večjem polmeru telo prepotuje daljšo pot, zato je hitrejše in pospešek se spremeni.
- Dvakrat manjši.
~ V $a_r = \dfrac{v^2}{r}$ si upošteval le večji $r$. Hitrost pa se pri enakem $t_0$ tudi podvoji.
- Štirikrat večji.
~ Hitrost se res podvoji in je na kvadrat, a pozabil si, da se podvoji tudi $r$ v imenovalcu.
+ Dvakrat večji.
> Kabini imata enak obhodni čas, zato je $K_2$ dvakrat hitrejša. Kvadrat hitrosti je štirikrat večji, polmer pa dvakrat: $a_r$ je $\dfrac{4}{2} = 2$-krat večji. Isto pove $a_r = \dfrac{4\pi^2 r}{t_0^2}$.

? Kamen na vrvici kroži v vodoravni ravnini v smeri urinih kazalcev; sliko gledaš od zgoraj. Ko je kamen v točki $P$, se vrvica pretrga. Po kateri puščici odleti?
:::risba skica
opis: Pogled od zgoraj. Krožnica s središčem S je tir kamna, ki kroži v smeri urinih kazalcev. Črtkana vrvica gre od S do kamna P na vrhu krožnice. Iz P izhajajo tri puščice: A navpično navzgor, stran od S; B vodoravno v desno, po tangenti; C poševno navzgor in v desno.
območje: -3; -2,6 .. 3; 3,6
krog: 0; 0 | 2 | siva
črta: 0; 0 -> 0; 2 | črtkano
točka: 0; 0 | S | pod
točka: 0; 2 | P | nad levo
puščica: 0; 2 -> 0; 3,3 | A | levo
puščica: 0; 2 -> 1,4; 2 | B | pod
puščica: 0; 2 -> 1; 3 | C | desno
:::
- Puščica $A$.
~ Zdi se, da kamen »vleče navzven«, a navzven nanj ne deluje nobena sila. Brez vrvice nadaljuje v smeri, v kateri se je gibal.
+ Puščica $B$.
- Puščica $C$.
~ To je mešanica smeri hitrosti in »sile navzven«. Sile navzven ni, zato kamen ohrani le smer hitrosti po tangenti.
- Nobeni: kamen nadaljuje po krožnici.
~ Za ukrivljeno pot je potrebna sila proti središču. Ko vrvica ne vleče več, se smer hitrosti ne obrača.
> V točki $P$ kaže hitrost po tangenti, v desno. Po 1. Newtonovem zakonu kamen brez vodoravne sile nadaljuje premo v tej smeri, po puščici $B$.

? Razvrsti kroženja od največjega do najmanjšega centripetalnega pospeška.
1. $v = 4\,\mathrm{m/s}$, $r = 2\,\mathrm{m}$
2. $v = 2\,\mathrm{m/s}$, $r = 1\,\mathrm{m}$
3. $v = 1{,}5\,\mathrm{m/s}$, $r = 0{,}75\,\mathrm{m}$
4. $v = 1\,\mathrm{m/s}$, $r = 0{,}5\,\mathrm{m}$
> Po $a_r = \dfrac{v^2}{r}$: $\dfrac{16}{2} = 8$, $\dfrac{4}{1} = 4$, $\dfrac{2{,}25}{0{,}75} = 3$ in $\dfrac{1}{0{,}5} = 2$ (vse v $\mathrm{m/s^2}$). Razmerje $\dfrac{v}{r}$ je pri vseh štirih enako, a hitrost šteje na kvadrat.

<<RACUN
vrednost: 1/4 | 0.25
vrednost: 2*pi*(6.79*10^6)/5580 | 7645.7
vrednost: 7646^2/(6.79*10^6) | 8.61
vrednost: 2*pi*(42.2*10^6)/86400 | 3068.9
vrednost: 2*pi*(3.84*10^8)/(27.3*86400) | 1022.9
vrednost: 2*pi*(1.5*10^11)/(365*86400) | 29885.8
vrednost: 7650^2/(6.79*10^6) | 8.62
vrednost: 29.4*8 | 235.2
vrednost: sqrt(235.2) | 15.34
vrednost: 60/(2*pi*8/sqrt(235.2)) | 18.31
vrednost: 2*pi*(9.38*10^6)/27540 | 2140.0
vrednost: 2140^2/(9.38*10^6) | 0.488
vrednost: 2*pi*(4*10^8)/(30*86400) | 969.6
vrednost: 2*pi*(6.7*10^6)/7800/60 | 89.95
vrednost: 80*29.4 | 2352
vrednost: 1.5^2/0.75 | 3
vrednost: 16/6.8 | 2.35
vrednost: 64/6.8 | 9.41
vrednost: sqrt(3^2+1^2) | 3.16
vrednost: 4*10^8/(30*86400) | 154.3
vrednost: pi*4*10^8/(30*86400) | 484.8
vrednost: 2*pi*(6.7*10^6)/7800 | 5397
vrednost: 130*14/60 | 30.3
>>

:::simboli
v | obodna hitrost | v = \dfrac{2\pi r}{t_0} | m/s | velikost stalna, smer se spreminja
r | polmer kroženja | | m
t_0 | obhodni čas | t_0 = \dfrac{2\pi r}{v} | s | čas enega celega obhoda
a_r | radialni (centripetalni) pospešek | a_r = \dfrac{v^2}{r} | m/s^2 | kaže proti središču
F_r | rezultanta sil proti središču | F_r = m\,a_r = \dfrac{m v^2}{r} | N
\nu | frekvenca | \nu = \dfrac{1}{t_0} | s^{-1} | $1\,\mathrm{s^{-1}} = 1\,\mathrm{Hz}$
\omega | kotna hitrost | \omega = \dfrac{2\pi}{t_0} | rad/s | $1\,\mathrm{rad/s} = 1\,\mathrm{s^{-1}}$; velja $v = \omega r$
m | masa | | kg
:::
