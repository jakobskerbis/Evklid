---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Luka si je pri košarki poškodoval koleno. Po šestih tednih vaj ga fizioterapevtka Ana preizkusi na stopnicah: Luka mora čim hitreje priteči v prvo nadstropje, $3\,\text{m}$ višje. Pred poškodbo je to zmogel v $2{,}5\,\text{s}$, danes potrebuje $4\,\text{s}$.

Ana mora v karton zapisati, koliko je Luka še šibkejši. Samo delo tu ne pomaga: v obeh primerih Luka dvigne isto telo na isto višino, zato je delo enako. Razlika je v tem, *kako hitro* delo opravi. To pove **moč**. Druga količina, **izkoristek**, pa pove, kolikšen del porabljene energije gre za koristno delo. Z njima opisujemo telo pri treningu, srce, dvigala in vse naprave z napisom v vatih.

## Razlaga

**1. Najprej Lukov primer.** Luka ima maso $50\,\text{kg}$. Pri teku po stopnicah dvigne svoje telo za $h = 3\,\text{m}$, zato opravi delo $A = m g h = 50 \cdot 10 \cdot 3 = 1500\,\text{J}$ (z $g = 10\,\frac{\text{N}}{\text{kg}}$). Delo razdelimo na sekunde:

| | $A$ | $t$ | v $1\,\text{s}$ |
|---|---|---|---|
| prej | $1500\,\text{J}$ | $2{,}5\,\text{s}$ | $600\,\text{J}$ |
| danes | $1500\,\text{J}$ | $4\,\text{s}$ | $375\,\text{J}$ |

V stolpcu $A$ je delo, v stolpcu $t$ čas, v zadnjem delo v eni sekundi.

Delo je enako, delo v eni sekundi pa ne. Danes Luka v vsaki sekundi opravi le $\frac{375}{600} = 0{,}625 = 62{,}5\,\%$ toliko dela kot pred poškodbo.

**2. Posplošimo: moč.** Zadnji stolpec tabele je **moč** $P$: delo, opravljeno v eni sekundi.

$$P = \frac{A}{t}$$

Tu je $A$ opravljeno delo in $t$ čas, v katerem je bilo opravljeno. Moč pove, *kako hitro* se opravlja delo, ne koliko ga je.

**3. Enota.** Enota za moč je **vat** ($\mathrm{W}$):

$$1\,\mathrm{W} = 1\,\frac{\mathrm{J}}{\mathrm{s}}$$

Luka je imel pred poškodbo moč $600\,\mathrm{W}$, danes $375\,\mathrm{W}$. Večji enoti: $1\,\mathrm{kW} = 1000\,\mathrm{W}$ in $1\,\mathrm{MW} = 1\,000\,000\,\mathrm{W}$. Čas mora biti v sekundah, sicer rezultat ni v vatih.

**4. Še dve obliki.** Iz $P = \dfrac{A}{t}$ sledi $A = P \cdot t$ (koliko dela opravimo z znano močjo v danem času) in $t = \dfrac{A}{P}$ (koliko časa potrebujemo). Ker se pri delu spremeni energija, moč pove tudi, koliko energije se v eni sekundi pretvori.

:::premisli
Luka naslednji teden teče z nahrbtnikom z maso $10\,\text{kg}$, in spet potrebuje $4\,\text{s}$. Ali je njegova moč zdaj večja, manjša ali enaka kot brez nahrbtnika?
---
Večja. Dviga $60\,\text{kg}$, zato opravi $A = 60 \cdot 10 \cdot 3 = 1800\,\text{J}$ v istem času. Moč je $\frac{1800\,\text{J}}{4\,\text{s}} = 450\,\mathrm{W}$ namesto $375\,\mathrm{W}$.
:::

**5. Izkoristek.** Lukove mišice za delo porabljajo energijo iz hrane. Ne spremeni se vsa v delo: večina se spremeni v toploto, zato se pri teku segreje in poti. Tok energije pri mišicah:

**energija iz hrane $100\,\text{J}$ → mišice → koristno delo $20\,\text{J}$ + toplota $80\,\text{J}$**

Delež dovedene energije, ki se spremeni v koristno delo, je **izkoristek** $\eta$ (grška črka eta):

$$\eta = \frac{A_\text{koristno}}{A_\text{dovedeno}}$$

Za mišice je $\eta = \frac{20}{100} = 0{,}2 = 20\,\%$; izmerjene vrednosti so približno od $20\,\%$ do $25\,\%$. Izkoristek nima enote, ker delimo dve energiji. Zapišemo ga kot decimalno število ali v odstotkih.

**6. Izkoristek nikoli ne preseže 1.** Koristnega dela ne more biti več, kot je bilo dovedene energije, ker energija ne nastane iz nič. Pri resničnih napravah se del energije vedno pretvori v toploto (trenje, segrevanje žic), zato je $\eta$ manjši od $1$ (manjši od $100\,\%$). Enako razmerje velja za moči: $\eta = \dfrac{P_\text{koristna}}{P_\text{dovedena}}$.

:::premisli
Zakaj se ti pri hitrem teku po stopnicah segreje telo bolj kot pri počasni hoji, čeprav dvigneš isto telo na isto višino?
---
Delo je enako, a ga opraviš v krajšem času, zato je moč večja. Pri izkoristku približno $20\,\%$ se v toploto spremeni štirikrat toliko energije, kot je opravljenega dela. Pri večji moči zato v vsaki sekundi nastane več toplote, kot je telo sproti odda okolici.
:::

V simulaciji spodaj (»Moč in izkoristek dvigala«) maso, višino in moč motorja pusti nespremenjene, izkoristek pa zmanjšaj s $60\,\%$ na $30\,\%$. Pritisni »Dvigni« in opazuj: koristno delo ostane enako, rdeči pas izgub se razširi, dvig pa traja dvakrat dlje.

## Rešeni primeri

### Primer 1: moč srca

Srce pri enem utripu opravi približno $1\,\text{J}$ dela, ko potisne kri v žile. V mirovanju utripne $72$-krat na minuto. Kolikšna je povprečna moč srca?

**Podatki:** delo pri enem utripu $1\,\text{J}$, $72$ utripov, $t = 1\,\text{min}$
**Iščemo:** povprečno moč $P$

:::formula
$P = \dfrac{A}{t}$
:::

**Rešitev:**

1. Delo v eni minuti: $A = 72 \cdot 1\,\text{J} = 72\,\text{J}$.
2. Čas v sekundah, ker je vat joule na sekundo: $t = 60\,\text{s}$.
3. $P = \dfrac{72\,\text{J}}{60\,\text{s}} = 1{,}2\,\mathrm{W}$.
4. Odgovor: povprečna moč srca je približno $1{,}2\,\mathrm{W}$, manj kot moč LED žarnice v namizni svetilki.

### Primer 2: obremenitveni test

Pri obremenitvenem testu na ergometru (sobnem kolesu, ki meri moč) kardiolog naroči gospe Mariji, naj $3\,\text{min}$ poganja s stalno močjo $150\,\mathrm{W}$. Koliko dela opravi?

**Podatki:** $P = 150\,\mathrm{W}$, $t = 3\,\text{min}$
**Iščemo:** delo $A$

:::formula
$A = P \cdot t$ (čas v sekundah)
:::

**Rešitev:**

1. Iščemo delo, zato iz $P = \dfrac{A}{t}$ vzamemo obliko $A = P \cdot t$.
2. Čas pretvorimo: $t = 3 \cdot 60\,\text{s} = 180\,\text{s}$.
3. $A = 150\,\mathrm{W} \cdot 180\,\text{s} = 27\,000\,\text{J}$.
4. Smiselnost: v vsaki sekundi $150\,\text{J}$, v $180$ sekundah $180$-krat toliko.
5. Odgovor: gospa Marija opravi $27\,000\,\text{J}$ ($27\,\text{kJ}$) dela.

### Primer 3: koliko energije porabi telo

Mišice gospe Marije iz primera 2 imajo izkoristek $20\,\%$. Koliko energije iz hrane porabi med testom za poganjanje kolesa? Koliko te energije se spremeni v toploto?

**Podatki:** $A_\text{koristno} = 27\,000\,\text{J}$, $\eta = 20\,\% = 0{,}2$
**Iščemo:** dovedeno energijo $A_\text{dovedeno}$ in toploto

:::formula
$\eta = \dfrac{A_\text{koristno}}{A_\text{dovedeno}}$, torej $A_\text{dovedeno} = \dfrac{A_\text{koristno}}{\eta}$
:::

**Rešitev:**

1. Iščemo imenovalec, zato enačbo obrnemo: $A_\text{dovedeno} = \dfrac{A_\text{koristno}}{\eta}$.
2. $A_\text{dovedeno} = \dfrac{27\,000\,\text{J}}{0{,}2} = 135\,000\,\text{J}$.
3. Smiselnost: dovedena energija mora biti večja od koristnega dela, in $135\,000 > 27\,000$.
4. Toplota je preostanek: $135\,000\,\text{J} - 27\,000\,\text{J} = 108\,000\,\text{J}$.
5. Odgovor: telo porabi $135\,\text{kJ}$ energije iz hrane, od tega se $108\,\text{kJ}$ spremeni v toploto, zato se gospa Marija poti.

### Primer 4: zdaj ti

Bolnišnično dvigalo dvigne posteljo z bolnikom (skupaj $300\,\text{kg}$) za $12\,\text{m}$ v $20\,\text{s}$. Motor dobiva iz omrežja moč $3\,\mathrm{kW}$. Kolikšna je koristna moč in kolikšen izkoristek motorja? $g = 10\,\frac{\text{N}}{\text{kg}}$.

**Podatki:** $m = 300\,\text{kg}$, $h = 12\,\text{m}$, $t = 20\,\text{s}$, $P_\text{dovedena} = 3\,\mathrm{kW}$, $g = 10\,\frac{\text{N}}{\text{kg}}$
**Iščemo:** koristno moč $P_\text{koristna}$ in izkoristek $\eta$

:::formula
$A = m g h$, $P_\text{koristna} = \dfrac{A}{t}$, $\eta = \dfrac{P_\text{koristna}}{P_\text{dovedena}}$
:::

**Rešitev:**

1. Koristno delo je dviganje: $A = 300 \cdot 10 \cdot 12 = 36\,000\,\text{J}$.
2. Koristna moč: $P_\text{koristna} = \dfrac{36\,000\,\text{J}}{20\,\text{s}} = 1800\,\mathrm{W}$.
3. Pretvori $3\,\mathrm{kW}$ v vate in izračunaj izkoristek.

:::premisli
Kolikšen je izkoristek motorja?
---
$P_\text{dovedena} = 3000\,\mathrm{W}$, zato $\eta = \dfrac{1800\,\mathrm{W}}{3000\,\mathrm{W}} = 0{,}6 = 60\,\%$. Preostalih $1200\,\mathrm{W}$ se spremeni v toploto.
:::

## Pogoste napake

- **Čas ni v sekundah.** Kdor vstavi $3$ namesto $180\,\text{s}$, dobi moč v »joulih na minuto«, ne v vatih. $1\,\text{min} = 60\,\text{s}$, $1\,\text{h} = 3600\,\text{s}$.
- **»Hitreje pomeni več dela.«** Luka pri hitrem in počasnem teku opravi enako delo. Krajši čas poveča moč, ne dela.
- **Zamenjava moči in energije.** Vat je enota za moč, joule za delo in energijo. Kilovatna ura ($\mathrm{kWh}$) na računu za elektriko je energija: $1\,\mathrm{kWh} = 1000\,\mathrm{W} \cdot 3600\,\text{s} = 3\,600\,000\,\text{J}$.
- **Obrnjen izkoristek.** Koristno delimo z dovedenim. Izkoristek nad $100\,\%$ je znak, da si števec in imenovalec zamenjal.
- **Masa namesto teže.** Pri dviganju je delo $m g h$. Kdor pozabi $g$, dobi desetkrat premajhno delo in moč.

## Povzetek

- Moč pove, kako hitro se opravlja delo: $P = \dfrac{A}{t}$; obrnjeno $A = P \cdot t$ in $t = \dfrac{A}{P}$.
- Enota je vat: $1\,\mathrm{W} = 1\,\dfrac{\mathrm{J}}{\mathrm{s}}$; $1\,\mathrm{kW} = 1000\,\mathrm{W}$. Čas vedno v sekundah.
- Enako delo v krajšem času pomeni večjo moč.
- Izkoristek: $\eta = \dfrac{A_\text{koristno}}{A_\text{dovedeno}} = \dfrac{P_\text{koristna}}{P_\text{dovedena}}$, brez enote; pri resničnih napravah manjši od $1$ ($100\,\%$).
- Mišice imajo izkoristek približno $20\,\%$ do $25\,\%$, ostanek energije se spremeni v toploto.

## Drugače: Z analogijo

Moč je za delo to, kar je hitrost za pot:

| Gibanje | Delo |
|---|---|
| prevožena pot $s$ | opravljeno delo $A$ |
| hitrost $v = \frac{s}{t}$ | moč $P = \frac{A}{t}$ |
| $\frac{\text{m}}{\text{s}}$ | $\frac{\text{J}}{\text{s}} = \mathrm{W}$ |

Kolesar in pešec lahko prepotujeta isto pot, a kolesar je hitrejši. Enako Luka pred poškodbo in danes opravi isto delo, a pred poškodbo z večjo močjo.

Izkoristek si predstavljaj kot zalivalko z luknjo. Vanjo natočiš $10\,\text{L}$ vode (dovedeno), do rož pride $6\,\text{L}$ (koristno), ostalo izteče skozi luknjo (toplota). Izkoristek zalivalke je $\frac{6}{10} = 60\,\%$. Več kot natočiš, ne more priteči do rož.

## Drugače: Bolj natančno

Ker je $1\,\text{J} = 1\,\text{N} \cdot \text{m}$, je

$$1\,\mathrm{W} = 1\,\frac{\mathrm{J}}{\mathrm{s}} = 1\,\frac{\mathrm{N \cdot m}}{\mathrm{s}}.$$

Če stalna sila $F$ vleče telo v smeri gibanja z enakomerno hitrostjo $v = \dfrac{s}{t}$, je moč

$$P = \frac{A}{t} = \frac{F \cdot s}{t} = F \cdot v.$$

Zato avto z isto močjo motorja po strmem klancu vozi počasneje: za večjo silo ostane manjša hitrost.

Formula $P = \dfrac{A}{t}$ da **povprečno moč** v času $t$. Lukova moč med tekom se spreminja od koraka do koraka; $375\,\mathrm{W}$ je povprečje. Izkoristek $\eta = 1$ bi pomenil napravo brez izgub; takšne ni, zato je pri resničnih napravah $0 < \eta < 1$.

## Preveri se

? Katera enota ne spada med enote za moč?
- $\mathrm{kW}$
~ Kilovat je $1000$ vatov, torej enota za moč.
- $\frac{\mathrm{J}}{\mathrm{s}}$
~ Joule na sekundo je ravno definicija vata.
+ $\mathrm{kWh}$
- $\mathrm{W}$
~ Vat je osnovna enota za moč.
> Kilovatna ura je moč, pomnožena s časom, torej energija: $1\,\mathrm{kWh} = 3\,600\,000\,\text{J}$.

? Planinec z nahrbtnikom ima maso $60\,\text{kg}$. V $1\,\text{h}$ se povzpne $600\,\text{m}$ višje. Kolikšna je njegova povprečna moč pri dviganju? ($g = 10\,\frac{\text{N}}{\text{kg}}$)
- $6000\,\mathrm{W}$
~ Čas si vzel v minutah ($60$). Za vate mora biti v sekundah: $3600\,\text{s}$.
- $10\,\mathrm{W}$
~ Pozabil si $g$: delo je $m g h$, ne $m h$.
+ $100\,\mathrm{W}$
- $0{,}01\,\mathrm{W}$
~ Delil si čas z delom. Moč je delo, deljeno s časom.
> $A = 60 \cdot 10 \cdot 600 = 360\,000\,\text{J}$, $t = 3600\,\text{s}$, $P = \dfrac{360\,000\,\text{J}}{3600\,\text{s}} = 100\,\mathrm{W}$.

? Luka gre v isto nadstropje enkrat počasi, drugič teče. Kaj se zgodi z delom in z močjo, ko teče?
- Delo je večje, moč enaka.
~ Delo je odvisno od teže in višine, ne od hitrosti. Spremeni se moč.
+ Delo je enako, moč je večja.
- Delo in moč sta enaka.
~ Delo je res enako, a v krajšem času, zato je delo v eni sekundi večje.
> Telo dvigne na isto višino, zato je $A = m g h$ enako. Čas je krajši, zato je $P = \dfrac{A}{t}$ večja.

? Pri ergometru Nina $2\,\text{min}$ poganja z močjo $100\,\mathrm{W}$ in porabi $60\,000\,\text{J}$ energije iz hrane. Nik računa izkoristek: (1) $t = 2\,\text{min} = 120\,\text{s}$; (2) $A = 100\,\mathrm{W} \cdot 120\,\text{s} = 12\,000\,\text{J}$; (3) $\eta = \frac{60\,000\,\text{J}}{12\,000\,\text{J}} = 5 = 500\,\%$. Kateri korak je napačen?
- korak (1)
~ $2\,\text{min}$ je res $120\,\text{s}$; pretvorba je pravilna.
- korak (2)
~ $A = P \cdot t$ je pravilna oblika in $100 \cdot 120 = 12\,000$.
+ korak (3)
- noben, rezultat je pravilen
~ Izkoristek nad $100\,\%$ ni mogoč: telo ne more opraviti več dela, kot dobi energije.
> V števcu mora biti koristno delo, v imenovalcu dovedena energija: $\eta = \dfrac{12\,000\,\text{J}}{60\,000\,\text{J}} = 0{,}2 = 20\,\%$.

? Dedek ima maso $80\,\text{kg}$. Po operaciji srca mu zdravnica dovoli obremenitev največ $80\,\mathrm{W}$. Najmanj koliko časa naj mu vzame vzpon po stopnicah na višino $3\,\text{m}$? ($g = 10\,\frac{\text{N}}{\text{kg}}$)
- $3\,\text{s}$
~ Računal si z maso namesto s težo: delo je $m g h = 2400\,\text{J}$, ne $240\,\text{J}$.
+ $30\,\text{s}$
- $0{,}03\,\text{s}$
~ Delil si moč z delom. Čas je $t = \dfrac{A}{P}$.
- $192\,000\,\text{s}$
~ Pomnožil si delo in moč. Iz $P = \dfrac{A}{t}$ sledi $t = \dfrac{A}{P}$.
> $A = 80 \cdot 10 \cdot 3 = 2400\,\text{J}$, $t = \dfrac{A}{P} = \dfrac{2400\,\text{J}}{80\,\mathrm{W}} = 30\,\text{s}$. Če gre počasneje, je njegova moč manjša od $80\,\mathrm{W}$.

:::simboli
P | moč | P = \dfrac{A}{t} | W | pri stalni hitrosti $P = F \cdot v$
A | opravljeno delo | A = P \cdot t | J | pri dviganju $A = m g h$
t | čas | | s
\eta | izkoristek | \eta = \dfrac{A_\text{koristno}}{A_\text{dovedeno}} | – | pri resničnih napravah manjši od 1
A_\text{koristno} | koristno delo | | J
A_\text{dovedeno} | dovedena energija (delo) | A_\text{dovedeno} = \dfrac{A_\text{koristno}}{\eta} | J
P_\text{koristna} | koristna moč | P_\text{koristna} = \dfrac{A}{t} | W
P_\text{dovedena} | dovedena moč | | W
F | sila v smeri gibanja | | N
s | pot | | m
v | hitrost | v = \dfrac{s}{t} | m/s
m | masa | | kg
g | težni pospešek | | N/kg | približno $10\,\mathrm{N/kg}$
h | višina dviga | | m
:::
