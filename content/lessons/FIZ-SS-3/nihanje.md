---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Skladatelji so dolgo pisali tempo le z besedami, na primer *Allegro* (hitro) ali *Adagio* (počasi). Vsak glasbenik si jih je razlagal po svoje. Ista skladba je zato v enem mestu zvenela hitreje kot v drugem.

V začetku 19. stoletja je Johann Nepomuk Mälzel izdelal in prodajal **metronom**: napravo, ki enakomerno tiktaka. Beethoven je bil med prvimi skladatelji, ki so v note zapisali število udarcev na minuto. Srce metronoma je nihalo z utežjo, ki jo lahko premikaš po palici in s tem nastaviš tempo.

Ideja je starejša. Galileo Galilei je opazil, da nihalo pri majhnih odmikih za en nihaj potrebuje enako dolgo, ne glede na to, kako daleč ga odmakneš. Kasneje je Christiaan Huygens na tem zgradil prvo natančno nihalno uro.

Kaj torej določa, kako hitro nekaj niha? Odgovor potrebuješ za metronom, za uro, za strune in glasbene vilice, pa tudi za razumevanje zvoka in valovanja v naslednjih lekcijah.

## Razlaga

**1. En primer do konca.** Utež z maso $0{,}4\,\mathrm{kg}$ obesimo na vzmet s koeficientom $k = 40\,\mathrm{N/m}$. Utež obvisi v **ravnovesni legi**, kjer se teža in sila vzmeti izenačita. Potegnemo jo $5\,\mathrm{cm}$ navzdol in spustimo. Utež niha gor in dol okoli ravnovesne lege.

Opis nihanja potrebuje nekaj izrazov:

- **odmik** $x$ je oddaljenost od ravnovesne lege;
- **amplituda** $x_0$ je največji odmik, tu $5\,\mathrm{cm}$;
- **nihajni čas** $t_0$ je čas enega celega nihaja, od spodnje lege do zgornje in nazaj;
- **frekvenca** $\nu = \dfrac{1}{t_0}$ pove, koliko nihajev naredi v sekundi.

S štoparico izmerimo $10$ nihajev v $6{,}3\,\mathrm{s}$. En nihaj torej traja $t_0 = 0{,}63\,\mathrm{s}$, frekvenca je približno $1{,}6\,\mathrm{Hz}$.

Zakaj se utež vrača? Ko jo odmakneš iz ravnovesne lege, se sila vzmeti in teža ne izenačita več. Njuna rezultanta vedno kaže proti ravnovesni legi in je sorazmerna z odmikom: $F = k x$. Zato odmik merimo od ravnovesne lege.

| Lega uteži | Rezultanta sil | Hitrost |
|---|---|---|
| spodaj, $5\,\mathrm{cm}$ | $2\,\mathrm{N}$ gor | $0$ |
| ravnovesna, $x = 0$ | $0$ | največja |
| zgoraj, $5\,\mathrm{cm}$ | $2\,\mathrm{N}$ dol | $0$ |

V skrajni legi je sila največja, hitrost pa nič. Skozi ravnovesno lego utež šine z največjo hitrostjo, ker jo je sila do tja ves čas pospeševala.

**2. Spreminjamo en podatek naenkrat.** Utež zamenjamo z dvakrat težjo, $0{,}8\,\mathrm{kg}$. Izmerimo $t_0 = 0{,}89\,\mathrm{s}$. Nihajni čas se ni podvojil, povečal se je približno $1{,}41$-krat, to je $\sqrt{2}$-krat. Trša vzmet (večji $k$) pa nihajni čas skrajša.

:::premisli
Utež spet obesimo na prvo vzmet, a jo tokrat potegnemo $10\,\mathrm{cm}$ navzdol. Napovej: ali bo nihajni čas daljši, krajši ali enak?
---
Enak. Pri dvakrat večjem odmiku je sila dvakrat večja, zato utež dvakrat daljšo pot prepotuje z dvakrat večjo hitrostjo. Čas nihaja se ne spremeni. Zato metronom tiktaka enakomerno, tudi ko nihanje počasi pojema.
:::

**3. Posplošitev.** Iz takih meritev (in iz Newtonovega zakona) dobimo nihajni čas nihala na vzmeti:

$$t_0 = 2\pi\sqrt{\frac{m}{k}}$$

Preverimo na našem primeru: $t_0 = 2\pi\sqrt{\dfrac{0{,}4}{40}} = 0{,}628\,\mathrm{s}$, kar se ujema z meritvijo. Masa je v števcu: težja utež niha počasneje. Koeficient vzmeti je v imenovalcu: trša vzmet niha hitreje. Amplitude v enačbi ni.

Graf odmika v odvisnosti od časa je kosinusna krivulja. Takemu nihanju pravimo **harmonično nihanje**.

:::risba graf
opis: Graf odmika x v centimetrih v odvisnosti od časa t v sekundah za utež na vzmeti s k = 40 N/m in amplitudo 5 cm. Krivulja je kosinusna, začne pri 5 cm. V aplikaciji maso spreminjaš z drsnikom; izbrano je m = {m} kg.
x: 0 .. 2 | 0,5 | t [s]
y: -6 .. 6 | 2 | x [cm]
drsnik: m | 0,1 .. 1,6 | 0,1 | 0,4 | masa uteži v kg
f: 5*cos(x*sqrt(40/m)) | modra
podnapis: Utež z maso m = {m} kg na vzmeti s k = 40 N/m
:::

Premakni drsnik na $1{,}6\,\mathrm{kg}$, to je štirikrat več kot $0{,}4\,\mathrm{kg}$. Nihajev v dveh sekundah je pol manj: štirikratna masa pomeni dvakrat daljši nihajni čas.

**4. Matematično nihalo.** Majhna utež na dolgi, lahki vrvici je **matematično nihalo**. Tu uteži ne vleče nazaj vzmet, ampak komponenta teže, ki kaže vzdolž loka proti najnižji legi. Pri majhnih odmikih (do okoli $10°$) velja:

$$t_0 = 2\pi\sqrt{\frac{l}{g}}$$

Tu je $l$ dolžina nihala, $g = 9{,}81\,\mathrm{m/s^2}$ pa težni pospešek. Mase v enačbi ni. Nihalo z dolžino $1\,\mathrm{m}$ ima nihajni čas okoli $2{,}0\,\mathrm{s}$, zato vsako sekundo preide iz ene skrajne lege v drugo.

:::premisli
Pri nihalu na vzmeti težja utež niha počasneje, pri matematičnem nihalu pa masa ne vpliva. Zakaj je razlika?
---
Pri vzmeti je sila, ki vleče nazaj, odvisna le od vzmeti ($F = kx$); težjo utež enaka sila pospeši manj. Pri matematičnem nihalu silo, ki vleče nazaj, da teža. Dvakrat težja utež ima dvakrat večjo težo, a tudi dvakrat večjo maso, ki jo mora ta sila pospeševati, zato ostane pospešek enak.
:::

**5. Energija.** Ko utež potegneš v skrajno lego, opraviš delo. Vzmet ga shrani kot **prožnostno energijo**. Pri spustu se ta pretvarja v **kinetično energijo**. V ravnovesni legi je vsa energija kinetična, v drugi skrajni legi spet vsa prožnostna. Brez trenja je celotna energija stalna:

$$W = \frac{1}{2} k x_0^2$$

To je prožnostna energija v skrajni legi. Ista energija je v ravnovesni legi vsa kinetična:

$$W = \frac{1}{2} m v_0^2$$

Tu je $v_0$ največja hitrost, ki jo ima utež v ravnovesni legi. Za naš primer je $W = 0{,}05\,\mathrm{J}$ in $v_0 = 0{,}5\,\mathrm{m/s}$. Pri viseči uteži je v $W$ že upoštevana tudi teža, ker odmik merimo od ravnovesne lege. Pri matematičnem nihalu se na enak način pretakata potencialna in kinetična energija.

V resnici trenje in upor zraka energijo počasi odvzemata. Amplituda se manjša, nihanje je **dušeno**. Zvok glasbenih vilic zato pojema. Metronom pa dobiva energijo iz navite vzmeti, zato tiktaka naprej.

## Rešeni primeri

### Primer 1: utež na vrvici kot metronom

Učitelj glasbe obesi majhno utež na vrvico dolžine $80\,\mathrm{cm}$ in jo rahlo odmakne. Kolikšen je nihajni čas in kolikšna frekvenca?

**Podatki:** $l = 80\,\mathrm{cm}$, $g = 9{,}81\,\mathrm{m/s^2}$, majhen odmik
**Iščemo:** nihajni čas $t_0$ in frekvenco $\nu$

:::formula
$t_0 = 2\pi\sqrt{\dfrac{l}{g}}$, nato $\nu = \dfrac{1}{t_0}$
:::

**Rešitev:**

1. Dolžino pretvorimo v metre, da se enote ujemajo z $g$: $l = 0{,}8\,\mathrm{m}$.
2. $t_0 = 2\pi\sqrt{\dfrac{0{,}8\,\mathrm{m}}{9{,}81\,\mathrm{m/s^2}}} = 1{,}79\,\mathrm{s}$.
3. $\nu = \dfrac{1}{1{,}79\,\mathrm{s}} = 0{,}56\,\mathrm{Hz}$.
4. Odgovor: nihalo naredi en nihaj v $1{,}79\,\mathrm{s}$, frekvenca je $0{,}56\,\mathrm{Hz}$.

### Primer 2: energija uteži na vzmeti

Utež z maso $0{,}25\,\mathrm{kg}$ niha na vzmeti s koeficientom $100\,\mathrm{N/m}$ z amplitudo $4\,\mathrm{cm}$. Kolikšna je energija nihanja in kolikšna je največja hitrost uteži?

**Podatki:** $m = 0{,}25\,\mathrm{kg}$, $k = 100\,\mathrm{N/m}$, $x_0 = 4\,\mathrm{cm}$
**Iščemo:** energijo $W$ in največjo hitrost $v_0$

:::formula
$W = \dfrac{1}{2} k x_0^2$, nato iz $W = \dfrac{1}{2} m v_0^2$ izrazimo $v_0 = \sqrt{\dfrac{2W}{m}}$
:::

**Rešitev:**

1. Amplituda v metrih: $x_0 = 0{,}04\,\mathrm{m}$.
2. V skrajni legi je vsa energija prožnostna: $W = \dfrac{1}{2} \cdot 100\,\mathrm{N/m} \cdot (0{,}04\,\mathrm{m})^2 = 0{,}08\,\mathrm{J}$.
3. V ravnovesni legi je vsa energija kinetična: $v_0 = \sqrt{\dfrac{2 \cdot 0{,}08\,\mathrm{J}}{0{,}25\,\mathrm{kg}}} = 0{,}8\,\mathrm{m/s}$.
4. Odgovor: energija nihanja je $0{,}08\,\mathrm{J}$, utež skozi ravnovesno lego šine s hitrostjo $0{,}8\,\mathrm{m/s}$.

### Primer 3: dolžina nihala za izbrani tempo

Za vajo bobnarja želimo preprost metronom z matematičnim nihalom. Udarec naj se sliši vsakič, ko je utež v skrajni legi. Kako dolgo mora biti nihalo za tempo $120$ udarcev na minuto?

**Podatki:** $120$ udarcev v $60\,\mathrm{s}$, udarec v vsaki skrajni legi, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** dolžino nihala $l$

:::formula
iz $t_0 = 2\pi\sqrt{\dfrac{l}{g}}$ izrazimo $l = \dfrac{g\, t_0^2}{4\pi^2}$
:::

**Rešitev:**

1. Dva udarca na sekundo pomenita $0{,}5\,\mathrm{s}$ med udarcema.
2. Med dvema udarcema utež preide iz ene skrajne lege v drugo, to je pol nihaja. Cel nihaj traja dvakrat dlje: $t_0 = 1\,\mathrm{s}$.
3. Enačbo kvadriramo in izrazimo $l$: $l = \dfrac{g\, t_0^2}{4\pi^2}$.
4. Vstavi podatke sam, nato preveri:

:::premisli
Kolikšna je dolžina $l$? Kako bi jo moral spremeniti za dvakrat počasnejši tempo, $60$ udarcev na minuto?
---
$l = \dfrac{9{,}81\,\mathrm{m/s^2} \cdot (1\,\mathrm{s})^2}{4\pi^2} = 0{,}248\,\mathrm{m}$, torej okoli $25\,\mathrm{cm}$. Za dvakrat počasnejši tempo mora biti nihajni čas dvakrat daljši, dolžina pa štirikrat večja: okoli $0{,}99\,\mathrm{m}$.
:::

## Pogoste napake

- **»Težja utež na vrvici niha počasneje.«** To velja pri vzmeti, ne pri matematičnem nihalu. Pri matematičnem nihalu nihajni čas določata le $l$ in $g$.
- **»Večji odmik, daljši nihaj.«** Pri večjem odmiku je tudi sila večja, zato utež hitreje prepotuje daljšo pot. Pri majhnih odmikih je nihajni čas od amplitude neodvisen.
- **Zamenjana $m$ in $k$ pod korenom.** Če računaš $2\pi\sqrt{\dfrac{k}{m}}$, dobiš nesmiselno dolg čas. Preveri smisel: težja utež mora nihati počasneje, torej je $m$ v števcu.
- **Pol nihaja namesto celega.** Pot od ene skrajne lege do druge je pol nihaja. Nihajni čas je čas, da se utež vrne v isto lego in se giblje v isto smer.
- **Amplituda v centimetrih ali brez kvadrata.** V $W = \dfrac{1}{2} k x_0^2$ vstavi $x_0$ v metrih in ga kvadriraj; sicer je energija povsem napačna, s centimetri kar $10\,000$-krat prevelika.

## Povzetek

- Nihanje je gibanje sem in tja okoli ravnovesne lege. Opisujejo ga odmik $x$, amplituda $x_0$, nihajni čas $t_0$ in frekvenca $\nu = \dfrac{1}{t_0}$.
- Sila, ki vleče nazaj, je sorazmerna z odmikom ($F = kx$); tako nihanje je harmonično, graf $x(t)$ je kosinusna krivulja.
- Nihalo na vzmeti: $t_0 = 2\pi\sqrt{\dfrac{m}{k}}$. Težja utež niha počasneje, trša vzmet hitreje.
- Matematično nihalo pri majhnih odmikih: $t_0 = 2\pi\sqrt{\dfrac{l}{g}}$; masa in amplituda ne vplivata. Štirikrat daljše nihalo ima dvakrat daljši nihajni čas.
- Energija se pretaka med prožnostno (potencialno) in kinetično: $W = \dfrac{1}{2} k x_0^2 = \dfrac{1}{2} m v_0^2$. Trenje nihanje duši.
- Uporaba: metronom, nihalna ura, glasbene vilice.

## Drugače: Z analogijo

Iz prejšnje lekcije poznaš nihajni krog s kondenzatorjem in tuljavo. Utež na vzmeti je njegov mehanski dvojček:

| Utež na vzmeti | Nihajni krog |
|---|---|
| odmik $x$ | naboj $Q$ |
| hitrost $v$ | tok $I$ |
| masa $m$ | induktivnost $L$ |
| koeficient $k$ | $\dfrac{1}{C}$ |
| prožnostna energija | električna energija |
| kinetična energija | magnetna energija |
| $t_0 = 2\pi\sqrt{\dfrac{m}{k}}$ | $t_0 = 2\pi\sqrt{LC}$ |

Ko je kondenzator poln, tok ne teče, tako kot utež v skrajni legi miruje. Ko je kondenzator prazen, je tok največji, tako kot je hitrost uteži največja v ravnovesni legi. Masa se upira spremembi hitrosti tako, kot se tuljava upira spremembi toka. Upor žic duši nihajni krog, trenje duši utež na vzmeti.

## Drugače: Bolj natančno

**Kotna frekvenca.** Odmik pri harmoničnem nihanju je $x = x_0 \cos(\omega t)$, kjer je $\omega = \dfrac{2\pi}{t_0}$ kotna frekvenca. Za nihalo na vzmeti je $\omega = \sqrt{\dfrac{k}{m}}$. Največja hitrost je $v_0 = \omega x_0$, največji pospešek $a_0 = \omega^2 x_0$.

Za utež iz razlage je $\omega = 10\,\mathrm{s^{-1}}$. Največja hitrost je $10 \cdot 0{,}05 = 0{,}5\,\mathrm{m/s}$, enako kot iz energije. Največji pospešek je $10^2 \cdot 0{,}05 = 5\,\mathrm{m/s^2}$, enako kot iz sile $2\,\mathrm{N}$ na $0{,}4\,\mathrm{kg}$.

**Kako majhen je »majhen odmik«.** Pri matematičnem nihalu je sila, ki vleče nazaj, $mg\sin\varphi$. Le pri majhnih kotih je $\sin\varphi$ približno sorazmeren s kotom in je nihanje harmonično. Pri večjih odmikih je nihajni čas nekoliko daljši:

| Amplituda | Nihajni čas je daljši za |
|---|---|
| $10°$ | $0{,}2\,\%$ |
| $30°$ | $1{,}7\,\%$ |
| $60°$ | $7{,}3\,\%$ |

Ura z nihalom, ki niha z $10°$ namesto z $1°$, bi na dan zaostala skoraj tri minute. Zato imajo nihalne ure majhne odmike.

**Zvok.** Krak glasbenih vilic za ton A niha s frekvenco $440\,\mathrm{Hz}$, njegov nihajni čas je približno $2{,}27\,\mathrm{ms}$. Višina tona je določena s frekvenco, glasnost z amplitudo. Ker je nihanje skoraj harmonično, ostane ton enako visok, tudi ko pojema.

## Preveri se

? Tri od teh sprememb spremenijo nihajni čas uteži na vzmeti. Katera je izjema?
- Utež zamenjamo s težjo.
~ Masa je v enačbi $t_0 = 2\pi\sqrt{\dfrac{m}{k}}$, težja utež niha počasneje.
- Vzmet zamenjamo s tršo.
~ Koeficient $k$ je v enačbi; trša vzmet nihanje pospeši.
+ Utež na začetku potegnemo dlje od ravnovesne lege.
- Vzmet zamenjamo z mehkejšo.
~ Mehkejša vzmet ima manjši $k$, zato je nihajni čas daljši.
> Amplitude v enačbi ni: pri večjem odmiku je sila večja, utež gre hitreje po daljši poti.

? Utež z maso $0{,}5\,\mathrm{kg}$ niha na vzmeti s koeficientom $50\,\mathrm{N/m}$. Kolikšen je nihajni čas?
- $62{,}8\,\mathrm{s}$
~ Pod korenom si zamenjal $m$ in $k$. Težja utež niha počasneje, zato je masa v števcu.
- $0{,}1\,\mathrm{s}$
~ To je le koren. Pozabil si pomnožiti z $2\pi$.
+ $0{,}63\,\mathrm{s}$
> $t_0 = 2\pi\sqrt{\dfrac{0{,}5\,\mathrm{kg}}{50\,\mathrm{N/m}}} = 2\pi \cdot 0{,}1\,\mathrm{s} = 0{,}63\,\mathrm{s}$.

? Nihalna ura s kovinskim nihalom v poletni vročini zaostaja. Kaj je vzrok?
- Toplejši zrak bolj zavira nihalo, zato je nihanje počasnejše.
~ Upor zraka zmanjšuje amplitudo, nihajnega časa pa skoraj ne spremeni.
+ Kovinska palica se segreje in podaljša, daljše nihalo ima daljši nihajni čas.
- Utež se segreje in postane težja, zato niha počasneje.
~ Masa se pri segrevanju ne spremeni, pri matematičnem nihalu pa tudi ne vpliva na nihajni čas.
> $t_0 = 2\pi\sqrt{\dfrac{l}{g}}$: večji $l$ pomeni daljši nihaj, zato ura naredi manj nihajev na dan in zaostaja.

? Učenec računa energijo uteži z maso $0{,}2\,\mathrm{kg}$ na vzmeti s $k = 80\,\mathrm{N/m}$ pri amplitudi $5\,\mathrm{cm}$. Korak 1: $x_0 = 0{,}05\,\mathrm{m}$. Korak 2: $W = \dfrac{1}{2} \cdot 80 \cdot 0{,}05 = 2\,\mathrm{J}$. Korak 3: $v_0 = \sqrt{\dfrac{2W}{m}}$. Kateri korak je napačen?
- Korak 1
~ Pretvorba je pravilna: $5\,\mathrm{cm} = 0{,}05\,\mathrm{m}$.
+ Korak 2
- Korak 3
~ Zveza za največjo hitrost je pravilna, napačna je le energija, ki jo vanjo vstavi.
- Noben, vsi koraki so pravilni.
~ Amplituda v formuli za energijo je kvadrirana, učenec pa je ni kvadriral.
> Pravilno je $W = \dfrac{1}{2} \cdot 80 \cdot 0{,}05^2 = 0{,}1\,\mathrm{J}$ in nato $v_0 = 1\,\mathrm{m/s}$.

? Na gugalnici se je gugal otrok. Na isto gugalnico sede njegov oče, ki je trikrat težji, in se guga z majhnimi odmiki. Kaj se zgodi z nihajnim časom?
- Postane daljši, ker je oče težji.
~ Težja oseba ima večjo težo, ki jo vrača proti najnižji legi, a tudi večjo maso; pospešek ostane enak.
- Postane krajši, ker večja teža močneje vleče navzdol.
~ Večja teža mora pospeševati tudi večjo maso; učinka se izničita.
+ Ostane približno enak, ker dolžina vrvi ostane enaka.
> Gugalnica je približno matematično nihalo: $t_0 = 2\pi\sqrt{\dfrac{l}{g}}$ je odvisen le od dolžine in $g$, ne od mase.

:::simboli
t_0 | nihajni čas | | s | čas enega celega nihaja
\nu | frekvenca | \nu = \frac{1}{t_0} | Hz
m | masa uteži | | kg
k | koeficient vzmeti | | N/m
l | dolžina nihala | | m
g | težni pospešek | | m/s^2 | $9{,}81\,\mathrm{m/s^2}$
x | odmik od ravnovesne lege | | m
x_0 | amplituda (največji odmik) | | m
F | sila, ki vleče nazaj | F = k x | N | rezultanta sile vzmeti in teže, kaže proti ravnovesni legi
W | energija nihanja | W = \frac{1}{2} k x_0^2 | J | stalna, če ni trenja
v_0 | največja hitrost | v_0 = \sqrt{\frac{2W}{m}} | m/s | v ravnovesni legi
\omega | kotna frekvenca | \omega = \frac{2\pi}{t_0} | s^{-1}
:::
