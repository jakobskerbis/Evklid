---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Januar, zunaj je že teden dni $-10\,^\circ\mathrm{C}$. V tvoji sobi je zato vsak večer pet ur prižgan električni radiator z napisom $2000\,\mathrm{W}$. Tvoj polnilnik telefona ima $10\,\mathrm{W}$ in je priključen dve uri na dan. Elektrika stane $0{,}20$ € za kilovatno uro. Koliko bo mesečni račun za radiator in koliko za polnilnik? Ugibaj: je razlika dvakratna, desetkratna ali še večja?

Odgovor je v Primeru 1, spodaj. Na položnici za elektriko ni vatov, ampak kilovatne ure. Kdor zna preiti od napisa na napravi do evrov na računu, ve, katere naprave res štejejo. Tekmovalne naloge pa dodajo še tok, napetost in upor, ki jih že poznaš iz vezij.

## Razlaga

**Vzorec 1: moč, tok in napetost.** V hišnem omrežju je napetost $230\,\mathrm{V}$. **Moč** $P$ je energija, ki jo naprava prejme v eni sekundi; zapisana je na napisni ploščici naprave. Z ampermetrom izmerimo tok skozi nekaj naprav in ga primerjamo z njihovo močjo.

| naprava | $I$ [A] | $P$ [W] | $P : I$ |
|---|---|---|---|
| LED žarnica | $0{,}04$ | $9{,}2$ | $230$ |
| hladilnik | $0{,}5$ | $115$ | $230$ |
| sušilnik | $5$ | $1150$ | $230$ |
| radiator | $10$ | $2300$ | $230$ |

Zadnji stolpec je vedno $230$, toliko kot napetost. Moč je torej napetost, pomnožena s tokom:

$$P = U \cdot I$$

Ena napetost za vse naprave pomeni: večja moč, večji tok.

:::premisli
Mikrovalovna pečica ima moč $690\,\mathrm{W}$. Napovej tok, preden računaš.
---
$I = \dfrac{690\,\mathrm{W}}{230\,\mathrm{V}} = 3\,\mathrm{A}$. Moč je trikrat $230$, zato je tok $3\,\mathrm{A}$.
:::

**Vzorec 2: koliko energije.** Spodaj so štiri naprave, ki delujejo različno dolgo:

| moč $P$ | čas $t$ | $P \cdot t$ |
|---|---|---|
| $1000\,\mathrm{W}$ | $1\,\mathrm{h}$ | $1000\,\mathrm{Wh}$ |
| $100\,\mathrm{W}$ | $10\,\mathrm{h}$ | $1000\,\mathrm{Wh}$ |
| $2000\,\mathrm{W}$ | $0{,}5\,\mathrm{h}$ | $1000\,\mathrm{Wh}$ |
| $10\,\mathrm{W}$ | $100\,\mathrm{h}$ | $1000\,\mathrm{Wh}$ |

Vse porabijo enako energijo, čeprav so moči zelo različne. Šteje produkt moči in časa:

$$W = P \cdot t$$

Vat, pomnožen z uro, je **vatna ura** (Wh). Če $P$ vstaviš v kW in $t$ v urah, dobiš energijo v **kilovatnih urah** (kWh), $1\,\mathrm{kWh} = 1000\,\mathrm{Wh}$. Vsaka vrstica tabele je natanko $1\,\mathrm{kWh} = 3{,}6\,\mathrm{MJ}$. Števec elektrike v hiši šteje prav kWh. Strošek je energija, pomnožena s ceno $c$ za kWh:

$$C = W \cdot c$$

**Vzorec 3: moč in upor.** Če v $P = U \cdot I$ vstaviš Ohmov zakon $I = \dfrac{U}{R}$, dobiš

$$P = \frac{U^2}{R}$$

Pri isti napetosti ima večjo moč porabnik z **manjšim** uporom. Radiator $2300\,\mathrm{W}$ ima $R = \dfrac{230^2}{2300} = 23\,\Omega$, LED žarnica pa več tisoč ohmov. Z $U = R \cdot I$ pa dobiš še $P = I^2 R$.

:::premisli
Dva grelca z napisom $230\,\mathrm{V}$, $1000\,\mathrm{W}$ vežeš zaporedno na $230\,\mathrm{V}$. Kolikšna je skupna moč? Napovej, nato premisli zakaj.
---
Samo $500\,\mathrm{W}$, ne $2000\,\mathrm{W}$. Zaporedno se upora seštejeta, zato je skupni upor dvakrat večji. Pri isti napetosti je po $P = \dfrac{U^2}{R}$ moč polovična. Vsak grelec dobi le $115\,\mathrm{V}$ in ima $250\,\mathrm{W}$.
:::

**Hišna napeljava.** Vtičnice so vezane **vzporedno**, zato ima vsaka naprava $230\,\mathrm{V}$, tokovi pa se seštevajo. Tokokrog varuje **varovalka**, ki prekine tok, ko preseže dovoljeno vrednost, npr. $16\,\mathrm{A}$. Na tak tokokrog lahko hkrati priključiš največ $230\,\mathrm{V} \cdot 16\,\mathrm{A} = 3680\,\mathrm{W}$.

**Stanje pripravljenosti.** Televizor, ki ga ugasneš z daljincem, še vedno prejema nekaj vatov. Moč je majhna, čas pa dolg: vseh $365 \cdot 24 = 8760$ ur v letu.

V simulaciji spodaj (Poraba električne energije) nastavi hladilniku in štedilniku ure na dan. Opazuj, katera naprava ima višji stolpec porabe, čeprav ima manjšo moč.

## Rešeni primeri

### Primer 1: radiator med mrazom

To je vprašanje z začetka. Radiator $2000\,\mathrm{W}$ dela $5$ ur na dan, $30$ dni. Cena je $0{,}20$ €/kWh. Koliko stane? Primerjaj s polnilnikom $10\,\mathrm{W}$, ki je priključen $2$ uri na dan.

**Podatki:** $P = 2000\,\mathrm{W}$, $5\,\mathrm{h}$ na dan, $30$ dni, $c = 0{,}20$ €/kWh; polnilnik $P_p = 10\,\mathrm{W}$, $2\,\mathrm{h}$ na dan
**Iščemo:** strošek $C$ za radiator in za polnilnik

:::formula
$W = P \cdot t$, $C = W \cdot c$
:::

**Rešitev:**

1. Moč v kW, da dobimo kWh: $P = 2\,\mathrm{kW}$.
2. Čas: $t = 5 \cdot 30 = 150\,\mathrm{h}$.
3. Energija: $W = 2\,\mathrm{kW} \cdot 150\,\mathrm{h} = 300\,\mathrm{kWh}$.
4. Strošek: $C = 300 \cdot 0{,}20 = 60$ €.
5. Polnilnik dela $2 \cdot 30 = 60\,\mathrm{h}$: $W_p = 0{,}01\,\mathrm{kW} \cdot 60\,\mathrm{h} = 0{,}6\,\mathrm{kWh}$, kar stane $0{,}12$ €.
6. Odgovor: radiator stane $60$ € na mesec, polnilnik $12$ centov, kar je $500$-krat manj.

### Primer 2: grelni kabel v žlebu

Po sneženju grelni kabel v žlebu preprečuje ledene sveče. Na $230\,\mathrm{V}$ skozenj teče $1{,}5\,\mathrm{A}$. Vklopljen je $8$ ur na dan, $20$ dni. Kolikšna je njegova moč in koliko stane ogrevanje žleba pri $0{,}20$ €/kWh?

**Podatki:** $U = 230\,\mathrm{V}$; $I = 1{,}5\,\mathrm{A}$; $8\,\mathrm{h}$ na dan; $20$ dni; $c = 0{,}20$ €/kWh
**Iščemo:** moč $P$ in strošek $C$

:::formula
$P = U \cdot I$, $W = P \cdot t$, $C = W \cdot c$
:::

**Rešitev:**

1. Moč: $P = 230\,\mathrm{V} \cdot 1{,}5\,\mathrm{A} = 345\,\mathrm{W} = 0{,}345\,\mathrm{kW}$.
2. Čas: $t = 8 \cdot 20 = 160\,\mathrm{h}$.
3. Energija: $W = 0{,}345\,\mathrm{kW} \cdot 160\,\mathrm{h} = 55{,}2\,\mathrm{kWh}$.
4. Strošek: $C = 55{,}2 \cdot 0{,}20 = 11{,}04$ €.
5. Odgovor: kabel ima moč $345\,\mathrm{W}$, ogrevanje žleba stane približno $11$ €.

### Primer 3: razvlažilnik po poplavi

Po poplavi v kleti ves dan dela razvlažilnik. Števec je v $24$ urah, ko je bil vklopljen samo razvlažilnik, naštel $4{,}8\,\mathrm{kWh}$. Kolikšna je moč razvlažilnika in kolikšen tok teče skozenj?

**Podatki:** $W = 4{,}8\,\mathrm{kWh}$, $t = 24\,\mathrm{h}$, $U = 230\,\mathrm{V}$ (hišno omrežje)
**Iščemo:** moč $P$ in tok $I$

:::formula
$P = \dfrac{W}{t}$, $I = \dfrac{P}{U}$
:::

**Rešitev:**

1. Naloga je obrnjena: znana je energija, iščemo moč. Moč je energija na čas: $P = \dfrac{4{,}8\,\mathrm{kWh}}{24\,\mathrm{h}} = 0{,}2\,\mathrm{kW} = 200\,\mathrm{W}$.
2. Tok iz $P = U \cdot I$: $I = \dfrac{200\,\mathrm{W}}{230\,\mathrm{V}} \approx 0{,}87\,\mathrm{A}$.
3. Odgovor: razvlažilnik ima moč $200\,\mathrm{W}$, skozenj teče približno $0{,}87\,\mathrm{A}$.

### Primer 4: zdaj ti

Ob mrzlih večerih, ko vsi grejejo, napetost v vasi pade z $230\,\mathrm{V}$ na $207\,\mathrm{V}$. Kolikšna je tedaj moč radiatorja z napisom $230\,\mathrm{V}$, $2000\,\mathrm{W}$? Upor naj ostane enak.

**Podatki:** $U = 230\,\mathrm{V}$, $P = 2000\,\mathrm{W}$, nižja napetost $U' = 207\,\mathrm{V}$
**Iščemo:** moč $P'$ pri nižji napetosti

:::formula
$R = \dfrac{U^2}{P}$, $P' = \dfrac{U'^2}{R}$
:::

**Rešitev:**

1. Upor ostane enak, zato ga izračunamo iz napisa: $R = \dfrac{230^2}{2000} = 26{,}45\,\Omega$.
2. Izračunaj $P'$ in ga primerjaj z $2000\,\mathrm{W}$.

:::premisli
Koliko je $P'$?
---
$P' = \dfrac{207^2}{26{,}45} = 1620\,\mathrm{W}$. Napetost je padla za $10\,\%$, moč pa za $19\,\%$, ker je moč odvisna od kvadrata napetosti.
:::

## Pogoste napake

- **Moč zamenjaš z energijo.** »Hladilnik porabi $115\,\mathrm{W}$ na uro« je napačno. Vat je že energija na sekundo. Hladilnik ima moč $115\,\mathrm{W}$; v eni uri porabi $115\,\mathrm{Wh}$.
- **Vati namesto kilovatov.** Kdor računa $2000 \cdot 150$ in napiše $300\,000\,\mathrm{kWh}$, ima $1000$-krat preveč. Pred množenjem pretvori W v kW, ali pa dobljene Wh deli s $1000$.
- **Minute kot decimalke.** $1\,\mathrm{h}\ 30\,\mathrm{min}$ ni $1{,}3\,\mathrm{h}$, ampak $1{,}5\,\mathrm{h}$. Minute deli s $60$.
- **Zaporedni grelci seštejejo moč.** Napisna moč velja le pri napisani napetosti. Zaporedno vsak grelec dobi manjšo napetost, skupni upor zraste in moč pade, ne naraste.
- **»Majhna moč pomeni majhen strošek.«** Pozabiš na čas. Naprava v stanju pripravljenosti z $5\,\mathrm{W}$ v letu porabi skoraj $44\,\mathrm{kWh}$.

## Povzetek

- Moč električne naprave: $P = U \cdot I$; z Ohmovim zakonom tudi $P = \dfrac{U^2}{R} = I^2 R$.
- Energija: $W = P \cdot t$; s $P$ v kW in $t$ v h dobiš kWh; $1\,\mathrm{kWh} = 3{,}6\,\mathrm{MJ}$.
- Strošek: $C = W \cdot c$ (energija v kWh krat cena za kWh).
- Doma so naprave vzporedno na $230\,\mathrm{V}$; tokovi se seštevajo, varovalka $16\,\mathrm{A}$ dopušča največ $3680\,\mathrm{W}$.
- Pri isti napetosti ima večjo moč porabnik z manjšim uporom; zaporedna vezava grelcev moč zmanjša.
- Strošek je odvisen od moči in časa: majhna moč ves dan lahko stane več kot velika moč nekaj minut.

## Drugače: Korak za korakom s številkami

Ista pot vodi od napisa na napravi do evrov. Vzemimo sušilnik za lase $1150\,\mathrm{W}$, ki ga uporabljaš $12$ minut na dan, $30$ dni, pri $0{,}20$ €/kWh.

1. Moč v kW: $1150\,\mathrm{W} = 1{,}15\,\mathrm{kW}$.
2. Čas v urah: $12\,\mathrm{min} = 0{,}2\,\mathrm{h}$, v mesecu $0{,}2 \cdot 30 = 6\,\mathrm{h}$.
3. Energija: $W = 1{,}15 \cdot 6 = 6{,}9\,\mathrm{kWh}$.
4. Strošek: $C = 6{,}9 \cdot 0{,}20 = 1{,}38$ €.
5. Smiselnost: naprava z veliko močjo, a kratkim časom, stane manj kot radiator, ki dela ure.

Če moraš iz moči dobiti tok, dodaš korak $I = \dfrac{P}{U}$: sušilnik ima $\dfrac{1150}{230} = 5\,\mathrm{A}$.

## Drugače: Kot zgodba

Med snežnim tednom je Ana opazila, da je števec kWh v hodniku nenavadno hiter. Zjutraj je prebrala stanje, zvečer spet: v dvanajstih urah $18\,\mathrm{kWh}$. Prej je bilo okoli $6\,\mathrm{kWh}$ na dan.

Šla je od naprave do naprave in brala napisne ploščice. Hladilnik: $115\,\mathrm{W}$; priključen je ves čas, a moč je majhna. Radiator v dnevni sobi: $2000\,\mathrm{W}$, prižgan ves dan. Pomnožila je $2\,\mathrm{kW}$ z $12\,\mathrm{h}$ in dobila $24\,\mathrm{kWh}$. Več, kot je pokazal števec! Potem se je spomnila, da ima radiator termostat: ko je soba topla, se izklopi. Delal je torej le del časa.

Ana je s tem odkrila dvoje. Za porabo šteje moč, pomnožena s časom, ko naprava res dela. Na računu pa največ naredijo naprave, ki grejejo.

## Preveri se

? Vse naprave so priključene na $230\,\mathrm{V}$. Razvrsti jih od najmanjše do največje moči.
1. polnilnik telefona z močjo $10\,\mathrm{W}$
2. hladilnik, skozi katerega teče $0{,}5\,\mathrm{A}$
3. sušilnik za lase, skozi katerega teče $5\,\mathrm{A}$
4. radiator z močjo $2\,\mathrm{kW}$
> Iz $P = U \cdot I$: hladilnik $230 \cdot 0{,}5 = 115\,\mathrm{W}$, sušilnik $230 \cdot 5 = 1150\,\mathrm{W}$. Radiator ima $2\,\mathrm{kW} = 2000\,\mathrm{W}$. Največ moči imajo naprave, ki grejejo.

? Na isti tokokrog z varovalko $16\,\mathrm{A}$ hkrati vklopiš radiator $2300\,\mathrm{W}$ in grelnik vode $2000\,\mathrm{W}$. Varovalka izklopi. Zakaj?
- Ker se napetosti seštejeta v $460\,\mathrm{V}$.
~ Vtičnice so vezane vzporedno, zato ima vsaka naprava $230\,\mathrm{V}$. Seštevajo se tokovi, ne napetosti.
+ Ker se tokova seštejeta: $10\,\mathrm{A} + 8{,}7\,\mathrm{A} \approx 18{,}7\,\mathrm{A}$, več kot $16\,\mathrm{A}$.
- Ker radiator porabi tok, ki bi ga potreboval grelnik vode.
~ Tok se ne porabi. Vsaka naprava ima svojo vejo, tok iz napeljave je vsota tokov obeh vej.
> Skupna moč je $4300\,\mathrm{W}$, varovalka dopušča največ $230 \cdot 16 = 3680\,\mathrm{W}$.

? Polnilnik telefona ima moč približno $10\,\mathrm{W}$ in polni $2$ uri na dan, vse leto ($365$ dni). Oceni porabo energije v kWh na leto.
= 7,3 kWh | 0,5
~ 7300 | To so vatne ure. Za kWh deli s $1000$.
~ 0,02 | To je poraba enega dne. Pomnoži še s $365$.
> $W = 0{,}01\,\mathrm{kW} \cdot 2\,\mathrm{h} \cdot 365 = 7{,}3\,\mathrm{kWh}$ na leto, kar stane okoli $1{,}5$ €.

? Graf kaže porabo energije v hiši na en mrzel zimski dan. Radiator je delal $4$ ure. Kolikšna je njegova moč v vatih?
:::risba stolpci
opis: Stolpčni diagram porabe energije v kWh v enem dnevu: radiator 8, bojler 4, hladilnik 1, ostalo 2.
os: energija [kWh]
korak: 2
stolpec: radiator | 8
stolpec: bojler | 4
stolpec: hladilnik | 1
stolpec: ostalo | 2
:::
= 2000 W | 1
~ 2 | To je moč v kW. Vprašanje sprašuje po vatih: $2\,\mathrm{kW} = 2000\,\mathrm{W}$.
~ 32 | Energijo si pomnožil s časom. Moč je energija, deljena s časom.
~ 0,5 | Čas si delil z energijo. Moč je $\dfrac{W}{t}$, ne $\dfrac{t}{W}$.
> Z grafa: radiator $8\,\mathrm{kWh}$. $P = \dfrac{8\,\mathrm{kWh}}{4\,\mathrm{h}} = 2\,\mathrm{kW} = 2000\,\mathrm{W}$.

? Grelca z napisoma $230\,\mathrm{V}$, $1000\,\mathrm{W}$ in $230\,\mathrm{V}$, $500\,\mathrm{W}$ vežeš zaporedno na $230\,\mathrm{V}$. Kolikšna je skupna moč?
- $1500\,\mathrm{W}$
~ Moči bi se seštele le, če bi bil vsak grelec na $230\,\mathrm{V}$, torej vzporedno.
- $500\,\mathrm{W}$
~ To je napisna moč šibkejšega grelca. Zaporedno je skupni upor večji od njegovega, zato je skupna moč manjša od $500\,\mathrm{W}$.
+ približno $333\,\mathrm{W}$
- $375\,\mathrm{W}$
~ Napetost se razdeli na pol le pri enakih grelcih. Grelec $500\,\mathrm{W}$ ima dvakrat večji upor, zato dobi dvakrat večjo napetost.
> Upora grelcev sta $\dfrac{230^2}{1000} = 52{,}9\,\Omega$ in $\dfrac{230^2}{500} = 105{,}8\,\Omega$, zaporedno $158{,}7\,\Omega$. $P = \dfrac{230^2}{158{,}7} \approx 333\,\mathrm{W}$.

<<RACUN
vrednost: 230*0.04 | 9.2
vrednost: 230*5 | 1150
vrednost: 690/230 | 3
vrednost: 230^2/2300 | 23
vrednost: 230^2/(2*230^2/1000) | 500
vrednost: 230*16 | 3680
vrednost: 230*1.5 | 345
vrednost: 230^2/2000 | 26.45
vrednost: 230^2/(230^2/1000+230^2/500) | 333.33
vrednost: 2*5*30 | 300
vrednost: 300*0.20 | 60
vrednost: 0.01*2*30*0.20 | 0.12
vrednost: 0.345*8*20 | 55.2
vrednost: 55.2*0.20 | 11.04
vrednost: 4.8/24*1000 | 200
vrednost: 200/230 | 0.87
vrednost: 207^2/(230^2/2000) | 1620
vrednost: 1.15*0.2*30*0.20 | 1.38
vrednost: 0.01*2*365 | 7.3
vrednost: 8/4*1000 | 2000
enote: 1*kW*h | 3.6*MJ
>>

:::simboli
P | moč naprave | P = U \cdot I | W | napisna moč velja pri $230\,\mathrm{V}$
P' | moč pri nižji napetosti | P' = \dfrac{U'^2}{R} | W
U | napetost | | V | doma $230\,\mathrm{V}$
U' | znižana napetost | | V
I | električni tok | I = \dfrac{P}{U} | A
R | električni upor naprave | R = \dfrac{U^2}{P} | Ω
W | električna energija | W = P \cdot t | kWh | $1\,\mathrm{kWh} = 3{,}6\,\mathrm{MJ}$
t | čas delovanja | | h
C | strošek | C = W \cdot c | €
c | cena za kilovatno uro | | €/kWh
:::
