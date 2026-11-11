---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Let z letalom iz Ljubljane v New York traja približno $9$ ur. Mednarodna vesoljska postaja (ISS) v $93$ minutah obkroži celo Zemljo. Njen tir je skoraj natančno krožnica s polmerom $6790\,\mathrm{km}$, merjeno od središča Zemlje. Kako hitro torej leti?

Izračun, ki ga boš znal narediti čez nekaj minut, da skoraj $7{,}7\,\mathrm{km}$ v sekundi. To je več kot $27\,000\,\mathrm{km/h}$, torej približno tridesetkrat hitreje od letala.

Drugo vprašanje je še bolj zanimivo. Zakaj postaja ne odleti naravnost v vesolje, ampak ostaja na krožnici? Odgovor skriva **centripetalni pospešek**. Z istimi orodji opišemo Luno okoli Zemlje, Zemljo okoli Sonca, satelite za televizijo in centrifugo, v kateri trenirajo astronavti.

## Razlaga

Kroženje bomo sestavili iz majhnih korakov. Za vsakim je kratko vprašanje za preverjanje, odgovor je v oklepaju.

**1. Kaj pomeni »enakomerno«.** Telo kroži **enakomerno**, ko v enakih časih opravi enako dolge loke krožnice. Čas enega celega obhoda je **obhodni čas** $t_0$. Število obhodov v eni sekundi je **frekvenca** $\nu = \dfrac{1}{t_0}$, z enoto $\mathrm{s^{-1}}$.

*Preveri:* vrtiljak naredi en obrat v $4\,\mathrm{s}$. Kolikšna je frekvenca? ($\nu = 0{,}25\,\mathrm{s^{-1}}$)

**2. Obodna hitrost.** V enem obhodu telo prepotuje obseg krožnice $2\pi r$ in za to porabi čas $t_0$. Velikost hitrosti je pot, deljena s časom:

$$v = \frac{2\pi r}{t_0}$$

Tej hitrosti rečemo **obodna hitrost**. Za ISS je $t_0 = 93\,\mathrm{min} = 5580\,\mathrm{s}$ in $r = 6{,}79 \cdot 10^6\,\mathrm{m}$, zato je $v \approx 7650\,\mathrm{m/s}$.

*Preveri:* dva otroka sedita na istem vrtiljaku, zato imata enak obhodni čas. Prvi kroži na dvakrat večjem polmeru. Kateri je hitrejši? (Prvi, dvakrat: v enakem času prepotuje dvakrat daljšo pot.)

**3. Smer hitrosti.** Hitrost je vektor, zato ima tudi smer. V vsaki točki kaže po **tangenti** na krožnico, to je pravokotno na polmer. Ko se telo premika po krožnici, se ta smer ves čas obrača. Velikost $v$ ostaja enaka, vektor $\vec v$ pa ne.

:::premisli
Kamen vrtiš na vrvici v vodoravni ravnini. Ravno ko je kamen severno od tvoje roke in se giblje proti vzhodu, se vrvica pretrga. Kam odleti: proti severu (navzven), proti vzhodu ali naprej po krivulji? Napovej, nato preveri v simulaciji spodaj.
---
Proti vzhodu, po tangenti. Ko vrvica ne vleče več, na kamen v vodoravni smeri ne deluje nobena sila. Po 1. Newtonovem zakonu zato nadaljuje premo, v smeri hitrosti, ki jo je imel v tistem trenutku. Navzven ga nič ne potiska.
:::

**4. Pospešek brez spremembe velikosti.** Pospešek pove, kako hitro se spreminja vektor hitrosti, ne le njegova velikost. Pri kroženju se spreminja smer, zato ima telo pospešek.

Kam kaže? Nariši krožnico s središčem $S$ in telo, ki kroži v smeri urinih kazalcev. Na vrhu kaže hitrost vodoravno v desno. Četrt obhoda kasneje, na desni strani krožnice, kaže enako dolga hitrost navpično navzdol.

Iz »desno« je nastalo »navzdol«, torej je bilo treba hitrosti dodati del, ki kaže navzdol in v levo. Če to puščico narišeš na sredini loka, kaže ravno proti $S$. Na kateremkoli koščku krožnice dobimo isto: sprememba hitrosti kaže proti središču.

Takemu pospešku rečemo **centripetalni** ali **radialni pospešek** $a_r$. Beseda »centripetalen« pomeni »ki teži k središču«.

*Preveri:* kam kaže pospešek ISS, ko leti točno nad Slovenijo? (Proti središču Zemlje, torej navpično navzdol.)

**5. Kako velik je pospešek.** Velikost centripetalnega pospeška je

$$a_r = \frac{v^2}{r}$$

Zakaj kvadrat hitrosti? Pri večji hitrosti je vektor $\vec v$ daljši, zato pomeni enak zasuk večjo spremembo. Poleg tega telo pri večji hitrosti hitreje preteče lok, zato se smer zasuče hitreje. Vsak razlog prinese en faktor $v$. Večji polmer pomeni bolj položno krožnico: smer se obrača počasneje, zato je $a_r$ manjši.

Za ISS: $a_r = \dfrac{(7650\,\mathrm{m/s})^2}{6{,}79 \cdot 10^6\,\mathrm{m}} \approx 8{,}6\,\mathrm{m/s^2}$. Ta in druga telesa so zbrana v tabeli.

| Telo (obhodni čas) | $r$ | $v$ | $a_r$ |
|---|---|---|---|
| ISS ($93\,\mathrm{min}$) | $6790\,\mathrm{km}$ | $7{,}65\,\mathrm{km/s}$ | $8{,}6\,\mathrm{m/s^2}$ |
| TV satelit ($24\,\mathrm{h}$) | $42\,200\,\mathrm{km}$ | $3{,}1\,\mathrm{km/s}$ | $0{,}22\,\mathrm{m/s^2}$ |
| Luna ($27{,}3$ dneva) | $384\,000\,\mathrm{km}$ | $1{,}0\,\mathrm{km/s}$ | $0{,}0027\,\mathrm{m/s^2}$ |
| Zemlja okoli Sonca ($365$ dni) | $1{,}5 \cdot 10^{8}\,\mathrm{km}$ | $29{,}9\,\mathrm{km/s}$ | $0{,}0060\,\mathrm{m/s^2}$ |

*Preveri:* hitrost podvojiš, polmer ostane enak. Kolikokrat se poveča $a_r$? (Štirikrat, ker je $v$ na kvadrat.)

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
4. Odgovor: Zemlja leti okoli Sonca s hitrostjo približno $30\,\mathrm{km/s}$. V eni sekundi prepotuje toliko kot avto po avtocesti v četrt ure.

### Primer 2: pospešek vesoljske postaje

ISS kroži s hitrostjo $7{,}7\,\mathrm{km/s}$ po krožnici s polmerom $6790\,\mathrm{km}$. Kolikšen je njen centripetalni pospešek?

**Podatki:** $v = 7{,}7\,\mathrm{km/s}$, $r = 6790\,\mathrm{km}$
**Iščemo:** centripetalni pospešek $a_r$

:::formula
$a_r = \dfrac{v^2}{r}$
:::

**Rešitev:**

1. Pretvorimo v osnovne enote: $v = 7700\,\mathrm{m/s}$, $r = 6{,}79 \cdot 10^6\,\mathrm{m}$.
2. Kvadrat hitrosti: $v^2 = (7700\,\mathrm{m/s})^2 = 5{,}93 \cdot 10^7\,\mathrm{m^2/s^2}$.
3. Delimo s polmerom: $a_r = \dfrac{5{,}93 \cdot 10^7\,\mathrm{m^2/s^2}}{6{,}79 \cdot 10^6\,\mathrm{m}} \approx 8{,}7\,\mathrm{m/s^2}$.
4. Odgovor: pospešek postaje je približno $8{,}7\,\mathrm{m/s^2}$ (v razlagi je $8{,}6\,\mathrm{m/s^2}$, ker smo tam računali z natančnejšo hitrostjo $7650\,\mathrm{m/s}$), kar je skoraj toliko kot pospešek kamna, ki prosto pada blizu tal ($9{,}8\,\mathrm{m/s^2}$). Postaja v resnici ves čas pada proti Zemlji, le da zaradi velike hitrosti ves čas »zgreši« tla.

### Primer 3: centrifuga za astronavte

Astronavti se na velike pospeške ob vzletu pripravljajo v centrifugi. Kabina je na koncu ročice in kroži s polmerom $8{,}0\,\mathrm{m}$. Trener želi, da ima kabina centripetalni pospešek $29{,}4\,\mathrm{m/s^2}$, kar je trikrat več od $9{,}8\,\mathrm{m/s^2}$. Kolikšna mora biti obodna hitrost kabine in koliko obratov na minuto mora narediti ročica?

**Podatki:** $r = 8{,}0\,\mathrm{m}$, $a_r = 29{,}4\,\mathrm{m/s^2}$
**Iščemo:** obodno hitrost $v$ in število obratov v eni minuti

:::formula
Iz $a_r = \dfrac{v^2}{r}$ sledi $v = \sqrt{a_r\, r}$; nato $t_0 = \dfrac{2\pi r}{v}$.
:::

**Rešitev:**

1. Tokrat poznamo pospešek in iščemo hitrost, zato enačbo obrnemo: $v^2 = a_r\, r = 29{,}4\,\mathrm{m/s^2} \cdot 8{,}0\,\mathrm{m} = 235{,}2\,\mathrm{m^2/s^2}$.
2. Korenimo: $v = \sqrt{235{,}2}\,\mathrm{m/s} \approx 15{,}3\,\mathrm{m/s}$, to je okoli $55\,\mathrm{km/h}$.
3. Obhodni čas iz obsega in hitrosti: $2\pi r \approx 50{,}3\,\mathrm{m}$, zato $t_0 = \dfrac{50{,}3\,\mathrm{m}}{15{,}3\,\mathrm{m/s}} \approx 3{,}3\,\mathrm{s}$.
4. Obrati v minuti: $\dfrac{60\,\mathrm{s}}{3{,}3\,\mathrm{s}} \approx 18$.
5. Odgovor: kabina mora krožiti s hitrostjo približno $15\,\mathrm{m/s}$, ročica pa narediti okoli $18$ obratov na minuto.

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

Predstavljaj si krožnico kot številčnico ure in telo, ki kroži v smeri urinih kazalcev. V vsaki točki narišemo dve puščici: hitrost $\vec v$ in pospešek $\vec a_r$.

| Položaj | Smer $\vec v$ | Smer $\vec a_r$ |
|---|---|---|
| ob 12h (zgoraj) | v desno | navzdol |
| ob 3h (desno) | navzdol | v levo |
| ob 6h (spodaj) | v levo | navzgor |
| ob 9h (levo) | navzgor | v desno |

Opazi dvoje. Puščica $\vec v$ je vedno pravokotna na polmer, puščica $\vec a_r$ pa vedno leži na polmeru in kaže v središče. Obe puščici sta ves čas pravokotni druga na drugo. Zato pospešek hitrosti ne poveča in ne zmanjša, ampak jo le obrača.

## Drugače: Bolj natančno

**Kotna hitrost.** Polmer, ki kaže na telo, se v času $t_0$ zavrti za poln kot $2\pi$. **Kotna hitrost** je $\omega = \dfrac{2\pi}{t_0}$, enota $\mathrm{s^{-1}}$. Ker je $v = \dfrac{2\pi r}{t_0}$, velja $v = \omega r$.

**Izpeljava $a_r = \dfrac{v^2}{r}$.** V kratkem času $\Delta t$ telo prepotuje lok dolžine $v\,\Delta t$, polmer pa se zavrti za majhen kot $\varphi$. Za isti kot se zavrti tudi vektor hitrosti. Imamo dva enakokraka trikotnika z enakim vrhnim kotom:

- iz dveh polmerov $r$ in tetive, ki je skoraj enaka loku $v\,\Delta t$;
- iz dveh hitrosti $v$ in spremembe hitrosti $\Delta v$.

Trikotnika sta podobna, zato $\dfrac{\Delta v}{v} = \dfrac{v\,\Delta t}{r}$. Sledi $a_r = \dfrac{\Delta v}{\Delta t} = \dfrac{v^2}{r}$.

**Druge oblike.** Z $v = \omega r$ dobimo $a_r = \omega^2 r = \dfrac{4\pi^2 r}{t_0^2}$. Ali $a_r$ s polmerom raste ali pada, je odvisno od tega, kaj ostane enako. Pri enakem obhodnem času (na primer točke na isti vrteči se plošči) velja $a_r \propto r$. Pri enaki obodni hitrosti velja $a_r \propto \dfrac{1}{r}$.

## Preveri se

? Telo kroži v smeri urinih kazalcev in je ravno na vrhu krožnice. Kateri opis slike je pravilen?
+ $\vec v$ kaže vodoravno v desno, $\vec a_r$ navpično navzdol proti središču.
- $\vec v$ kaže v desno, $\vec a_r$ navzgor, stran od središča.
~ To je občutek »metanja navzven«. Pospešek pri kroženju kaže proti središču, ne stran od njega.
- $\vec v$ in $\vec a_r$ kažeta oba v desno.
~ Pospešek v smeri hitrosti bi telo pospeševal. Pri enakomernem kroženju se velikost hitrosti ne spreminja, pospešek je pravokoten na hitrost.
- $\vec v$ kaže v desno, pospeška ni.
~ Smer hitrosti se spreminja, zato pospešek obstaja, tudi če je velikost hitrosti stalna.
> Hitrost kaže po tangenti (na vrhu pri gibanju v smeri urinih kazalcev v desno), centripetalni pospešek pa vedno proti središču.

? Zakaj ima ISS pospešek, čeprav leti ves čas z enako veliko hitrostjo?
- Ker na njeni višini ni gravitacije.
~ Na višini ISS je privlak Zemlje še zelo močan. Prav ta privlak ji daje centripetalni pospešek.
+ Ker se smer njene hitrosti ves čas spreminja.
- Ker jo motorji ves čas pospešujejo naprej.
~ Motorje uporablja le občasno za popravke tira. Pospešek pri kroženju kaže proti središču, ne naprej.
- Nima pospeška, saj je hitrost stalna.
~ Stalna je le velikost hitrosti. Sprememba smeri je tudi sprememba vektorja hitrosti.
> Pospešek opisuje spremembo vektorja hitrosti. Pri kroženju se spreminja smer, zato je pospešek $a_r = \dfrac{v^2}{r}$ usmerjen proti središču Zemlje.

? Luna obkroži Zemljo v približno $30$ dneh na razdalji približno $400\,000\,\mathrm{km}$. Brez računala oceni njeno obodno hitrost.
- Okoli $1\,\mathrm{m/s}$.
~ Na nebu se Luna premika počasi, ker je zelo daleč. Njen tir pa je zelo dolg: okoli $2{,}5$ milijona kilometrov v mesecu.
+ Okoli $1\,\mathrm{km/s}$.
- Okoli $30\,\mathrm{km/s}$.
~ To je hitrost Zemlje okoli Sonca. Lunin tir je več stokrat krajši, zato je Luna precej počasnejša.
> $v = \dfrac{2\pi r}{t_0} \approx \dfrac{2{,}5 \cdot 10^9\,\mathrm{m}}{2{,}6 \cdot 10^6\,\mathrm{s}} \approx 1000\,\mathrm{m/s}$.

? Satelit kroži s hitrostjo $7{,}8\,\mathrm{km/s}$ po krožnici s polmerom $6700\,\mathrm{km}$. Kolikšen je njegov obhodni čas?
- Približno $5{,}4\,\mathrm{s}$.
~ Tako dobiš, če polmer vstaviš v kilometrih, hitrost pa v metrih na sekundo. Enote morajo biti usklajene.
- Približno $45\,\mathrm{min}$.
~ Tu je uporabljena pot $\pi r$, to je pol obsega. En obhod je cel obseg $2\pi r$.
+ Približno $90\,\mathrm{min}$.
> $t_0 = \dfrac{2\pi r}{v} = \dfrac{2\pi \cdot 6{,}7 \cdot 10^6\,\mathrm{m}}{7800\,\mathrm{m/s}} \approx 5400\,\mathrm{s} = 90\,\mathrm{min}$.

? V centrifugi za astronavte kabino premaknejo na dvakrat daljšo ročico, obhodni čas pa ostane enak. Kolikokrat se spremeni centripetalni pospešek?
- Ostane enak.
~ Pri enakem obhodnem času na večjem polmeru telo prepotuje daljšo pot, zato je hitrejše in pospešek se spremeni.
- Zmanjša se na polovico.
~ V $a_r = \dfrac{v^2}{r}$ si upošteval le večji $r$. Hitrost pa se pri enakem $t_0$ tudi podvoji.
- Poveča se štirikrat.
~ Hitrost se res podvoji in je na kvadrat, a pozabil si, da se podvoji tudi $r$ v imenovalcu.
+ Poveča se dvakrat.
> Hitrost se podvoji, njen kvadrat poveča štirikrat, polmer pa dvakrat: $a_r$ se poveča $\dfrac{4}{2} = 2$-krat. Isto pove $a_r = \dfrac{4\pi^2 r}{t_0^2}$.

:::simboli
v | obodna hitrost | v = \dfrac{2\pi r}{t_0} | m/s | velikost stalna, smer se spreminja
r | polmer kroženja | | m
t_0 | obhodni čas | t_0 = \dfrac{2\pi r}{v} | s | čas enega celega obhoda
a_r | radialni (centripetalni) pospešek | a_r = \dfrac{v^2}{r} | m/s^2 | kaže proti središču
F_r | rezultanta sil proti središču | F_r = m\,a_r = \frac{m v^2}{r} | N
m | masa | | kg
:::
