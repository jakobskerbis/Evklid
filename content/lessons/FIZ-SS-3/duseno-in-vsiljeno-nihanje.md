---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na izletu prečkaš leseno brv čez potok. Hodiš sproščeno, približno $2$ koraka na sekundo. Brv se ob vsakem koraku malo ugrezne, in kmalu se ziblje tako, da se moraš prijeti za ograjo. Prijateljica gre čez isto brv počasneje, s $3$ koraki v $2$ sekundah, in brv se komaj premakne.

Zakaj je razlika tolikšna, čeprav sta oba enako težka? In zakaj se brv, ko stopiš z nje, v nekaj sekundah umiri?

Odgovor skriva **lastna frekvenca** brvi: frekvenca, s katero brv niha sama od sebe, če jo enkrat sunemo. Če je blizu $2\,\mathrm{Hz}$, tvoji koraki brv poganjajo v pravem ritmu. Gradbeniki zato pri vsakem mostu, stopnišču in strehi preverijo, ali se njihova lastna frekvenca ne ujema s koraki, vetrom ali stroji.

## Razlaga

**1. Idealno in resnično nihanje.** V lekciji o nihanju je imela utež na vzmeti ves čas enako amplitudo. Tako niha utež v simulaciji spodaj (»Nihanje uteži na vzmeti«): nastavi amplitudo $8\,\mathrm{cm}$ in opazuj, da ostane enaka, dokler gledaš. Resnična utež tega ne zmore. Postavimo obe drugo ob drugo:

| | idealno | resnično |
|---|---|---|
| amplituda | stalna | pojema |
| energija | stalna | pojema |
| nihajni čas | stalen | skoraj enak |

Nihanje, pri katerem amplituda s časom pojema, je **dušeno nihanje**. Vzroki dušenja so vedno sile, ki nasprotujejo gibanju:

- zračni upor (gugalnica, list papirja na vzmeti);
- trenje v ležajih in tečajih (vrata, nihalna ura);
- notranje trenje v snovi: vzmet, les ali beton se pri upogibanju malo segrejejo;
- v nihajnem krogu električni upor žic, ki tok spreminja v toploto.

**2. Kako pojema amplituda.** Graf odmika dušenega nihanja je kosinusna krivulja, ujeta med dve črtkani **ovojnici**. To sta krivulji, ki povezujeta vrhove, in se s časom ožata.

:::risba graf
opis: Graf odmika x v centimetrih v odvisnosti od časa t v sekundah, od 0 do 9 s. Nihajni čas je 1 s. Vrhovi pojemajo: 4 cm pri 0 s, 2 cm pri 3 s, 1 cm pri 6 s, 0,5 cm pri 9 s. Črtkani ovojnici povezujeta vrhove zgoraj in spodaj.
x: 0 .. 9 | 1 | t [s]
y: -4 .. 4 | 1 | x [cm]
f: 4*0,5^(x/3) | siva črtkano
f: -4*0,5^(x/3) | siva črtkano
f: 4*0,5^(x/3)*cos(2*pi*x) | modra
točka: 0; 4 | 4 cm | desno
točka: 3; 2 | 2 cm | nad
točka: 6; 1 | 1 cm | nad
podnapis: Dušeno nihanje: vsake 3 s se amplituda razpolovi.
:::

Z grafa razberemo: v prvih $3\,\mathrm{s}$ amplituda pade s $4\,\mathrm{cm}$ na $2\,\mathrm{cm}$, v naslednjih $3\,\mathrm{s}$ z $2\,\mathrm{cm}$ na $1\,\mathrm{cm}$. Amplituda torej ne pada za enako število centimetrov, ampak se v enakih časih zmanjša za **enak faktor**. Tako pojemanje je **eksponentno**. Čas, v katerem se amplituda razpolovi, je **razpolovni čas** $t_{1/2}$:

$$x_0(t) = x_0(0) \cdot \left(\frac{1}{2}\right)^{t/t_{1/2}}$$

Fiziki isti zakon pišejo z osnovo $e$:

$$x_0(t) = x_0(0) \cdot e^{-t/\tau}$$

Tu je $\tau$ **karakteristični čas**: v njem amplituda pade na $\frac{1}{e} \approx 37\,\%$ začetne. Zvezo med obema časoma lahko preveriš s kalkulatorjem: $t_{1/2} = \tau \ln 2 \approx 0{,}69\,\tau$. Na grafu zgoraj je $t_{1/2} = 3\,\mathrm{s}$ in $\tau \approx 4{,}3\,\mathrm{s}$. Pri večjem dušenju sta oba časa krajša.

:::premisli
Amplituda je v $3\,\mathrm{s}$ padla s $4\,\mathrm{cm}$ na $2\,\mathrm{cm}$. Kolikšna bo pri $t = 12\,\mathrm{s}$? Ali bo nihanje kdaj točno nič?
---
Po $12\,\mathrm{s}$ (štirje razpolovni časi) je $4\,\mathrm{cm} \cdot \frac{1}{16} = 0{,}25\,\mathrm{cm}$. Po zakonu amplituda nikoli ne pade točno na nič, le vse bolj se približuje nič. V resnici se nihalo ustavi, ko je odmik manjši od tega, kar še opazimo, ali ko ga zadrži lepenje v ležaju.
:::

**3. Energija pri dušenju.** Energija nihala je $W = \frac{1}{2} k x_0^2$, torej je sorazmerna s **kvadratom** amplitude. Ko se amplituda razpolovi, ostane le četrtina energije:

$$\frac{W'}{W} = \left(\frac{x_0'}{x_0}\right)^2$$

Na grafu zgoraj je nihajni čas $1\,\mathrm{s}$, tretjina razpolovnega časa. V treh nihajih se amplituda razpolovi, zato se amplituda v enem nihaju zmanjša na $\sqrt[3]{0{,}5} \approx 79\,\%$, energija pa na $0{,}79^2 \approx 63\,\%$. V vsakem nihaju se v toploto spremeni približno $37\,\%$ energije, ki jo nihalo še ima. Pri šibkem dušenju velja priročno pravilo: odstotek izgubljene energije je približno dvakratnik odstotka, za katerega pade amplituda.

**4. Lastno in vsiljeno nihanje.** Nihalo, ki ga izmaknemo in spustimo, niha z **lastno frekvenco** $\nu_0$. Določa jo samo nihalo: pri vzmeti masa in koeficient vzmeti, pri nihajnem krogu $L$ in $C$:

$$\nu_0 = \frac{1}{2\pi}\sqrt{\frac{k}{m}}$$

Zdaj nihalo poganjajmo s periodično silo: potiskamo gugalnico, motor trese podlago, koraki pritiskajo na brv. Takemu nihanju rečemo **vsiljeno nihanje**, kar ga poganja, pa je **vzbujevalnik**. Kaj se spremeni? Po kratkem prehodnem času nihalo ne niha več s svojo frekvenco, ampak s **frekvenco vzbujevalnika** $\nu$. Dušenje ga ne ustavi, ker vzbujevalnik v vsakem nihaju dovede toliko energije, kolikor se je izgubi.

**5. Resonanca.** Amplituda vsiljenega nihanja je odvisna od tega, kako blizu je $\nu$ lastni frekvenci $\nu_0$. Graf amplitude v odvisnosti od frekvence vzbujevalnika je **resonančna krivulja**. Spodaj sta dve za brv z $\nu_0 = 2\,\mathrm{Hz}$. Če bi ista sila brv potiskala zelo počasi ($\nu \approx 0$), bi jo odmaknila za $1\,\mathrm{mm}$:

:::risba graf
opis: Resonančni krivulji: amplituda v milimetrih v odvisnosti od frekvence vzbujevalnika od 0 do 4 Hz. Pri šibkem dušenju (polna črta) je vrh pri 2 Hz in visok 8 mm, krivulja je ozka. Pri močnem dušenju (črtkana črta) je vrh pri približno 1,9 Hz in visok le 2 mm, krivulja je široka. Pri 0 Hz imata obe 1 mm, pri 4 Hz približno 0,3 mm.
x: 0 .. 4 | 0,5 | ν [Hz]
y: 0 .. 9 | 1 | x₀ [mm]
f: 1/sqrt((1-(x/2)^2)^2 + (x/16)^2) | modra
f: 1/sqrt((1-(x/2)^2)^2 + (x/4)^2) | oranžna črtkano
napis: 2,2; 8 | šibko dušenje | desno
napis: 2,4; 2,6 | močno dušenje | desno
podnapis: Resonančni krivulji brvi z lastno frekvenco 2 Hz
:::

Ko je $\nu \approx \nu_0$, je amplituda največja. Temu pojavu rečemo **resonanca**. Vzbujevalnik takrat potiska vedno v smeri gibanja, zato vsak potisk nihalu doda energijo. Dušenje določa obliko vrha:

- šibko dušenje: vrh je visok in ozek;
- močno dušenje: vrh je nizek in širok, pomakne se malo k nižji frekvenci.

Daleč pod $\nu_0$ nihalo sledi sili skoraj brez zaostanka (amplituda $1\,\mathrm{mm}$). Daleč nad $\nu_0$ ne dohaja sile in komaj niha.

:::premisli
Pralni stroj med pospeševanjem centrifuge pri nekem številu obratov močno zaropota in se strese. Pri največjih obratih pa teče spet mirno. Zakaj?
---
Boben z neenakomerno razporejenim perilom stroj trese s frekvenco vrtenja. Stroj na nogicah ima svojo lastno frekvenco. Ko frekvenca vrtenja med pospeševanjem gre skozi lastno frekvenco, nastopi resonanca. Pri največjih obratih je frekvenca vzbujevalnika daleč nad $\nu_0$, zato je amplituda majhna.
:::

**6. Resonanca okoli nas.** Gugalnico potiskaš enkrat na nihaj, ravno ko se začne odmikati od tebe. Vojaki gredo čez most ne v koraku, da ga ne bi poganjali v ritmu. Avto ima poleg vzmeti **blažilnike** (amortizerje), ki nihanje karoserije po grbini zadušijo v enem ali dveh nihajih. Radijski sprejemnik pa resonanco izkorišča: nihajni krog z lastno frekvenco $\nu_0 = \frac{1}{2\pi\sqrt{LC}}$ močno zaniha le pri postaji z enako frekvenco.

## Rešeni primeri

### Primer 1: letev v primežu

Mizar vpne leseno letev v primež in udari po prostem koncu. Konec zaniha z začetno amplitudo $12\,\mathrm{mm}$, ki se razpolovi vsakih $0{,}4\,\mathrm{s}$. Kolikšna je amplituda po $1{,}2\,\mathrm{s}$ in kolikšen delež začetne energije ima letev takrat še?

**Podatki:** $x_0(0) = 12\,\mathrm{mm}$, $t_{1/2} = 0{,}4\,\mathrm{s}$, $t = 1{,}2\,\mathrm{s}$
**Iščemo:** amplitudo $x_0(t)$ in razmerje $\frac{W'}{W}$

:::formula
$x_0(t) = x_0(0) \cdot \left(\frac{1}{2}\right)^{t/t_{1/2}}$ in $\frac{W'}{W} = \left(\frac{x_0'}{x_0}\right)^2$
:::

**Rešitev:**

1. Število razpolovnih časov: $\frac{1{,}2\,\mathrm{s}}{0{,}4\,\mathrm{s}} = 3$.
2. Amplituda se trikrat razpolovi: $12\,\mathrm{mm}$ → $6\,\mathrm{mm}$ → $3\,\mathrm{mm}$ → $1{,}5\,\mathrm{mm}$.
3. Razmerje amplitud je $\frac{1}{8}$, energija gre s kvadratom: $\left(\frac{1}{8}\right)^2 = \frac{1}{64} \approx 0{,}016$.
4. Odgovor: po $1{,}2\,\mathrm{s}$ niha letev z amplitudo $1{,}5\,\mathrm{mm}$ in ima le še okoli $1{,}6\,\%$ začetne energije.

### Primer 2: dobri in obrabljeni blažilniki

Vzmet ob enem kolesu avtomobila ima koeficient $k = 25\,\mathrm{kN/m}$. Po grbini karoserija zaniha z amplitudo $4{,}0\,\mathrm{cm}$. Z dobrim blažilnikom je amplituda po enem nihaju še $1{,}0\,\mathrm{cm}$, z obrabljenim $3{,}0\,\mathrm{cm}$. Kolikšen delež energije se v prvem nihaju spremeni v toploto v vsakem primeru?

**Podatki:** $k = 25\,\mathrm{kN/m} = 25\,000\,\mathrm{N/m}$, $x_0 = 4{,}0\,\mathrm{cm}$, dober blažilnik $x_0' = 1{,}0\,\mathrm{cm}$, obrabljen $x_0'' = 3{,}0\,\mathrm{cm}$
**Iščemo:** delež izgubljene energije v enem nihaju

:::formula
$W = \frac{1}{2} k x_0^2$
:::

**Rešitev:**

1. Začetna energija: $W = \frac{1}{2} \cdot 25\,000 \cdot 0{,}04^2\,\mathrm{J}$, torej $W = 20\,\mathrm{J}$.
2. Dober blažilnik: $W' = \frac{1}{2} \cdot 25\,000 \cdot 0{,}01^2\,\mathrm{J}$, torej $W' = 1{,}25\,\mathrm{J}$. Izgubljeno je $18{,}75\,\mathrm{J}$, to je $\frac{18{,}75}{20} \approx 94\,\%$.
3. Obrabljen blažilnik: $W'' = \frac{1}{2} \cdot 25\,000 \cdot 0{,}03^2\,\mathrm{J}$, torej $W'' = 11{,}25\,\mathrm{J}$. Izgubljeno je $8{,}75\,\mathrm{J}$, to je $\approx 44\,\%$.
4. Preverba s kvadratom: $\left(\frac{3}{4}\right)^2 = 0{,}5625$, ostane $56\,\%$, kar se ujema.
5. Odgovor: dober blažilnik v prvem nihaju pobere $94\,\%$ energije, obrabljen le $44\,\%$, zato avto z njim poskakuje še več nihajev.

### Primer 3: brv na gradbišču

Na gradbišču postavijo začasno brv za delavce. Ko na sredino položijo breme s težo $1{,}0\,\mathrm{kN}$, se brv povesi za $2{,}0\,\mathrm{mm}$. Nihajoči del brvi ima maso $3200\,\mathrm{kg}$. Ali je brv varna pred resonanco, ko čez gredo delavci z $2$ koraki na sekundo? Kolikšen bi moral biti koeficient $k$, da bi bila lastna frekvenca $3{,}0\,\mathrm{Hz}$?

**Podatki:** $F = 1{,}0\,\mathrm{kN} = 1000\,\mathrm{N}$, $x = 2{,}0\,\mathrm{mm} = 0{,}002\,\mathrm{m}$, $m = 3200\,\mathrm{kg}$, koraki $\nu = 2\,\mathrm{Hz}$, želena $\nu_0' = 3{,}0\,\mathrm{Hz}$
**Iščemo:** lastno frekvenco $\nu_0$ in potrebni koeficient $k'$

:::formula
$k = \frac{F}{x}$, $t_0 = 2\pi\sqrt{\frac{m}{k}}$, $\nu_0 = \frac{1}{t_0}$
:::

**Rešitev:**

1. Brv se upogiba kot vzmet: $k = \frac{1000\,\mathrm{N}}{0{,}002\,\mathrm{m}} = 500\,000\,\mathrm{N/m}$.
2. Nihajni čas:

   $$t_0 = 2\pi\sqrt{\frac{3200\,\mathrm{kg}}{500\,000\,\mathrm{N/m}}}$$

   torej $t_0 = 2\pi \cdot 0{,}08\,\mathrm{s} \approx 0{,}50\,\mathrm{s}$.
3. Lastna frekvenca: $\nu_0 = \frac{1}{0{,}503\,\mathrm{s}} \approx 1{,}99\,\mathrm{Hz}$. To je skoraj natanko frekvenca korakov, zato brv **ni** varna: koraki bi jo poganjali v resonanci.
4. Iz enačbe za lastno frekvenco izrazi $k'$ in izračunaj sam, nato preveri:

:::premisli
Kolikšen mora biti $k'$ za $\nu_0' = 3{,}0\,\mathrm{Hz}$ in kolikokrat je to več kot zdaj?
---
$k' = m\,(2\pi\nu_0')^2$. Vstavimo: $k' = 3200\,\mathrm{kg} \cdot (2\pi \cdot 3{,}0\,\mathrm{Hz})^2$, torej $k' \approx 1{,}14 \cdot 10^6\,\mathrm{N/m}$. To je približno $2{,}3$-krat več kot $500\,000\,\mathrm{N/m}$: frekvenca je sorazmerna s $\sqrt{k}$, zato za $1{,}5$-krat višjo frekvenco potrebujemo $(3{,}0/1{,}99)^2 \approx 2{,}3$-krat tršo brv.
:::

## Pogoste napake

- **»Amplituda se je razpolovila, torej tudi energija.«** Energija je sorazmerna s $x_0^2$. Pri polovični amplitudi ostane četrtina energije. Pred vsakim računom energije amplitudo kvadriraj.
- **»Amplituda pada enakomerno, po dvakratnem času je nič.«** Če je pri $4\,\mathrm{cm}$ v $3\,\mathrm{s}$ izgubila $2\,\mathrm{cm}$, se zdi, da bo čez nadaljnje $3\,\mathrm{s}$ nič. Pojemanje je eksponentno: v enakih časih pade za enak *faktor*, zato po $6\,\mathrm{s}$ ostane $1\,\mathrm{cm}$.
- **»Ko amplituda pada, se nihanje upočasni.«** Nihajni čas harmoničnega nihala ni odvisen od amplitude. Dušeno nihalo niha z manjšim odmikom, a skoraj v istem ritmu.
- **»Vsiljeno nihalo niha s svojo lastno frekvenco.«** Lastno frekvenco ima samo prosto nihalo. Ko se vsiljeno nihanje ustali, nihalo sledi frekvenci vzbujevalnika; od razlike med $\nu$ in $\nu_0$ je odvisna samo amplituda.
- **»Dušenje vpliva le na to, kako hitro nihanje zamre, resonance ne spremeni.«** Dušenje določa višino in širino resonančnega vrha. Brez dušenja bi amplituda v resonanci rasla brez meje; z več dušenja je vrh nizek in širok.

## Povzetek

- **Dušeno nihanje**: amplituda pojema, ker zračni upor, trenje in notranje trenje energijo spreminjajo v toploto.
- Amplituda pojema **eksponentno**: v vsakem razpolovnem času $t_{1/2}$ se razpolovi.
$$x_0(t) = x_0(0) \cdot e^{-t/\tau}$$
- **Energija** je sorazmerna s kvadratom amplitude, $W = \frac{1}{2} k x_0^2$: pol amplitude pomeni četrtino energije.
- **Lastna frekvenca** $\nu_0$ je frekvenca prostega nihala; določa jo nihalo samo ($m$ in $k$, $L$ in $C$).
- **Vsiljeno nihanje**: nihalo niha s frekvenco vzbujevalnika $\nu$, ne s svojo.
- **Resonanca**: pri $\nu \approx \nu_0$ je amplituda največja. Šibko dušenje da visok in ozek vrh, močno nizek in širok.
- Primeri: gugalnica, brv in most, blažilniki v avtu, nihajni krog v radiu.

## Drugače: Na sliki

Isto dušeno nihanje kot na grafu v razlagi, a gledamo samo energijo. Stolpci kažejo, koliko odstotkov začetne energije ima nihalo po vsakem nihaju.

:::risba stolpci
opis: Stolpčni prikaz energije nihala po zaporednih nihajih, v odstotkih začetne: na začetku 100, po 1. nihaju 63, po 2. 40, po 3. 25, po 4. 16.
os: energija [%]
korak: 20
stolpec: začetek | 100
stolpec: 1. nihaj | 63
stolpec: 2. nihaj | 40
stolpec: 3. nihaj | 25
stolpec: 4. nihaj | 16
:::

Vsak stolpec je $63\,\%$ prejšnjega. Po treh nihajih ($3\,\mathrm{s}$) je energija na četrtini, amplituda pa na polovici. Stolpci se nižajo po enakem faktorju, zato nikoli ne padejo točno na nič.

## Drugače: Iz vsakdanjega življenja

- **Gugalnica.** Če potiskaš vsakič, ko se gugalnica vrne, gre vse višje. Če potiskaš hitreje, kot sama niha, potiski enkrat pomagajo, drugič zavirajo, in gugalnica komaj niha.
- **Kitara in violina.** Struna sama da tih zvok. Lesen trup ima veliko lastnih frekvenc in z njimi zaniha, zato je zvok glasen. Pri trupu je močno dušenje zaželeno, da odgovori na vse tone.
- **Nebotičnik.** V vrhu nekaterih visokih stavb visi več sto ton težko dušilno nihalo. Ko veter zaziba stavbo, nihalo zaniha nasprotno in z blažilniki porablja energijo nihanja.
- **Vrtalnik na polici.** Ko vrtaš v steno, polica pri določenih obratih zabrenči, pri drugih ne. Spet resonanca.

## Preveri se

? Zakaj se gugalnica, ki je nihče ne poganja, sčasoma ustavi?
- Ker se njen nihajni čas podaljšuje, dokler ne postane neskončen.
~ Nihajni čas ostane skoraj enak. Zmanjšuje se amplituda.
+ Ker zračni upor in trenje v ležajih njeno energijo spreminjata v toploto.
- Ker teža gugalnico vleče navzdol in ji jemlje energijo.
~ Teža energije ne jemlje: pri nihanju se potencialna energija spreminja v kinetično in nazaj. Energijo odnaša trenje.
> Dušenje povzročajo sile, ki nasprotujejo gibanju. Energija ne izgine, ampak se spremeni v notranjo energijo zraka in ležajev.

? Na sliki sta resonančni krivulji vzmetenja istega avtomobila: enkrat z novimi, enkrat z obrabljenimi blažilniki. Katera krivulja velja za nove blažilnike?
:::risba graf
opis: Dve resonančni krivulji, amplituda nihanja karoserije v odvisnosti od frekvence vzbujanja od 0 do 3 Hz. Krivulja 1 ima ozek vrh pri 1,5 Hz, visok približno 6. Krivulja 2 ima nizek in širok vrh pri približno 1,3 Hz, visok približno 1,6.
x: 0 .. 3 | 0,5 | ν [Hz]
y: 0 .. 7 | 1 | amplituda
f: 1/sqrt((1-(x/1,5)^2)^2 + (x/9)^2) | modra
f: 1/sqrt((1-(x/1,5)^2)^2 + (x/2,25)^2) | oranžna črtkano
napis: 1,6; 6,2 | 1 | desno
napis: 1,3; 2,1 | 2 | nad
:::
- Krivulja 1, ker ima višji vrh.
~ Visok vrh pomeni veliko amplitudo v resonanci, torej šibko dušenje. Tako se obnaša avto z obrabljenimi blažilniki.
+ Krivulja 2, ker ima nizek in širok vrh.
- Obe, saj imata vrh skoraj pri isti frekvenci.
~ Lega vrha je skoraj enaka, ker je odvisna od mase in vzmeti. Dušenje pa spremeni višino in širino vrha.
> Novi blažilniki nihanje močno dušijo, zato je resonančni vrh nizek in širok (krivulja 2).

? Amplituda nihala se v vsakem nihaju zmanjša za $10\,\%$. Približno koliko odstotkov energije, ki jo ima nihalo na začetku nihaja, se izgubi v tem nihaju?
= 19 % | 1
~ 10 | Energija ni sorazmerna z amplitudo, ampak z njenim kvadratom: ostane $0{,}9^2 = 0{,}81$.
~ 81 | To je delež energije, ki *ostane*. Izgubi se $100\,\% - 81\,\% = 19\,\%$.
> Ostane $0{,}9^2 = 0{,}81$ energije, izgubi se $19\,\%$, približno dvakrat več kot $10\,\%$.

? Energija nihala na vzmeti se v $5\,\mathrm{s}$ zmanjša na četrtino. Kolikšna je takrat amplituda, če je bila na začetku $8\,\mathrm{cm}$?
= 4 cm | 0,1
~ 2 | Na četrtino pade energija, ne amplituda. Amplituda je koren: $\sqrt{\frac{1}{4}} = \frac{1}{2}$.
~ 6 | Od amplitude si odštel četrtino. Na četrtino se zmanjša energija, zato je amplituda polovična.
> $\frac{x_0'}{x_0} = \sqrt{\frac{W'}{W}} = \sqrt{\frac{1}{4}} = \frac{1}{2}$, torej $x_0' = 4\,\mathrm{cm}$.

? V radijskem sprejemniku antena vzbuja nihajni krog s signali mnogih postaj hkrati. Zakaj mora imeti nihajni krog čim manjši upor?
- Ker upor spremeni lastno frekvenco kroga.
~ Lastna frekvenca $\nu_0 = \frac{1}{2\pi\sqrt{LC}}$ ni odvisna od upora. Upor določa dušenje.
+ Ker je pri majhnem dušenju resonančni vrh visok in ozek, zato krog močno zaniha le pri eni postaji.
- Ker bi pri večjem uporu krog nihal s svojo lastno frekvenco namesto s frekvenco postaje.
~ Vsiljeno nihanje vedno sledi frekvenci vzbujevalnika, ne glede na upor.
> Upor duši nihanje. Majhen upor pomeni ozek in visok vrh, zato sprejemnik loči postaje z bližnjimi frekvencami.

:::simboli
x_0 | amplituda | | m | največji odmik
t | čas | | s
t_{1/2} | razpolovni čas amplitude | t_{1/2} = \tau \ln 2 | s
\tau | karakteristični čas dušenja | | s | amplituda pade na $\frac{1}{e}$
e | Eulerjevo število | | – | $e \approx 2{,}718$
W | energija nihala | W = \frac{1}{2} k x_0^2 | J
W', W'' | energija pozneje (npr. po enem nihaju) | | J
x_0', x_0'' | amplituda pozneje (npr. po enem nihaju) | | m
k | koeficient vzmeti | k = \frac{F}{x} | N/m | pri brvi: togost
k' | potrebni koeficient brvi | k' = m\,(2\pi\nu_0')^2 | N/m
F | sila (teža bremena) | | N
x | poves (odmik) | | m
m | masa nihala | | kg
t_0 | nihajni čas | t_0 = 2\pi\sqrt{\frac{m}{k}} | s
\nu_0 | lastna frekvenca | \nu_0 = \frac{1}{t_0} | Hz
\nu_0' | želena lastna frekvenca | | Hz
\nu | frekvenca vzbujevalnika | | Hz
L | induktivnost tuljave | | H
C | kapaciteta kondenzatorja | | F
:::

<<RACUN
vrednost: 4*(1/2)^(12/3) | 0.25
vrednost: 3/ln(2) | 4.33
vrednost: 0.5^(1/3) | 0.79
vrednost: 0.5^(2/3) | 0.63
vrednost: 12*(1/2)^(1.2/0.4) | 1.5
vrednost: (1/8)^2 | 0.015625
vrednost: 0.5*25000*0.04^2 | 20
vrednost: 0.5*25000*0.01^2 | 1.25
vrednost: 0.5*25000*0.03^2 | 11.25
vrednost: (20-1.25)/20 | 0.9375
vrednost: (20-11.25)/20 | 0.4375
vrednost: 1000/0.002 | 500000
vrednost: 2*pi*sqrt(3200/500000) | 0.503
vrednost: 1/(2*pi*sqrt(3200/500000)) | 1.99
vrednost: 3200*(2*pi*3)^2/10^6 | 1.137
vrednost: 1-0.9^2 | 0.19
vrednost: 8*sqrt(1/4) | 4
>>
