---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi telefon, vklopi štoparico in v kuhinji izberi pot od vrat do okna, recimo $5\,\mathrm{m}$. Do okna pojdi počasi, kot da nosiš poln lonec juhe. Nazaj se vrni hitro, s praznimi rokami. Oba časa zapiši.

Sošolka je izmerila: tja $10\,\mathrm{s}$, nazaj $2{,}5\,\mathrm{s}$. Njeni hitrosti sta bili $0{,}5\,\mathrm{m/s}$ in $2\,\mathrm{m/s}$. Kolikšna je bila povprečna hitrost za pot tja in nazaj? Skoraj vsi rečejo $1{,}25\,\mathrm{m/s}$, saj je to sredina obeh hitrosti. Pravilno je $0{,}8\,\mathrm{m/s}$.

Na tekmovanju je skoraj vsaka naloga o gibanju sestavljena: gibanje ima več odsekov, vmes je postanek, dva se gibljeta hkrati, srečata se ali eden dohiti drugega. Vse take naloge rešiš z dvema mislima. Prva: celotno pot deli s celotnim časom. Druga: opazuj, kako hitro se spreminja razmik med telesoma.

## Razlaga

**1. Trije poskusi v kuhinji.** Poskus ponovimo še na dva načina. Pri prvem hodiš $4\,\mathrm{s}$ počasi ($0{,}5\,\mathrm{m/s}$) in nato $4\,\mathrm{s}$ hitro ($2\,\mathrm{m/s}$); skupaj prehodiš $2\,\mathrm{m} + 8\,\mathrm{m} = 10\,\mathrm{m}$, enako kot tja in nazaj. Pri drugem (postanek) se pri oknu za $5\,\mathrm{s}$ ustaviš, da premešaš juho, ostalo je kot v uvodu.

| poskus | $s$ [m] | $t$ [s] | $s/t$ [m/s] |
|---|---|---|---|
| enaka časa | $10$ | $8$ | $1{,}25$ |
| enaki poti | $10$ | $12{,}5$ | $0{,}8$ |
| postanek | $10$ | $17{,}5$ | $0{,}57$ |

Primerjaj vrstice. Ko oba dela trajata enako dolgo, dobiš res sredino hitrosti. Ko sta enaki poti, je rezultat manjši: počasni del traja štirikrat dlje kot hitri, zato v celotnem času prevladuje.

Postanek poti ne podaljša, čas pa. Zato povprečno hitrost še zmanjša.

**2. Pravilo.** **Povprečna hitrost** $\bar v$ je celotna pot, deljena s celotnim časom, skupaj s postanki:

$$\bar v = \frac{s}{t}$$

Pri več odsekih seštej poti in posebej čase:

$$\bar v = \frac{s_1 + s_2 + \dots}{t_1 + t_2 + \dots}$$

Čas posameznega odseka dobiš iz njegove poti in hitrosti, na primer $t_1 = \dfrac{s_1}{v_1}$. Sredina hitrosti $\dfrac{v_1 + v_2}{2}$ je pravilna samo takrat, ko sta odseka trajala enako dolgo.

:::premisli
Tabela kaže le en primer. Pot do okna in nazaj prehodiš s poljubnima različnima hitrostma $v_1$ in $v_2$. Ali je povprečna hitrost vedno manjša od $\dfrac{v_1 + v_2}{2}$ ali je lahko tudi večja? Zakaj?
---
Vedno manjša. S počasnejšo hitrostjo hodiš dlje časa, zato ta hitrost v celotnem času prevlada. Enaki bi bili le pri $v_1 = v_2$.
:::

Kadar sta poti enaki ($s$ tja in $s$ nazaj), vstavi $t_1 = \dfrac{s}{v_1}$ in $t_2 = \dfrac{s}{v_2}$ v $\bar v = \dfrac{2s}{t_1 + t_2}$. Pot $s$ se pokrajša in ostane zapis brez poti, uporaben pri vprašanjih »tja in nazaj«:

$$\bar v = \frac{2 v_1 v_2}{v_1 + v_2}$$

Za kuhinjski poskus: $\dfrac{2 \cdot 0{,}5 \cdot 2}{0{,}5 + 2} = 0{,}8$, enako kot v tabeli.

**3. Dve telesi hkrati.** Na kuhinjskem pultu sta dve mravlji, $200\,\mathrm{cm}$ narazen. Ena leze s hitrostjo $3\,\mathrm{cm/s}$, druga z $2\,\mathrm{cm/s}$. Opazujmo **razmik** (razdaljo med njima) v dveh primerih: ko lezeta druga proti drugi (nasproti) in ko hitrejša lovi počasnejšo (lovljenje).

| čas [s] | nasproti [cm] | lovljenje [cm] |
|---|---|---|
| $0$ | $200$ | $200$ |
| $10$ | $150$ | $190$ |
| $20$ | $100$ | $180$ |
| $40$ | $0$ | $160$ |

V levem stolpcu se razmik vsako sekundo zmanjša za $5\,\mathrm{cm}$, kar je $3 + 2$. Vsaka mravlja prileze svoj del in oba dela se seštejeta. V desnem stolpcu se zmanjša le za $1\,\mathrm{cm}$, kar je $3 - 2$: hitrejša se v sekundi približa za $3\,\mathrm{cm}$, počasnejša pa se ji za $2\,\mathrm{cm}$ odmakne.

**Srečevanje.** Telesi se gibljeta drugo proti drugemu, začetni razmik je $d$. Razmik se manjša s hitrostjo $v_1 + v_2$, zato se srečata po času

$$t = \frac{d}{v_1 + v_2}$$

**Dohitevanje.** Telesi se gibljeta v isto smer, hitrejše ($v_1$) je zadaj. Razmik se manjša z razliko hitrosti, zato ga dohiti po času

$$t = \frac{d}{v_1 - v_2}$$

Pri $v_1 \le v_2$ do dohitevanja nikoli ne pride. Tistemu, ki lovi, rečemo **zasledovalec**, tistemu, ki ga lovi, pa **ubežnik**. Če zasledovalec krene iz istega kraja $t_0$ pozneje, ima ubežnik takrat **prednost** $d = v_2 \cdot t_0$. Šele od tega trenutka naprej računaš z razliko hitrosti.

:::premisli
Hitrejša mravlja lovi počasnejšo, razmik je $200\,\mathrm{cm}$. Kaj pa, če bi bila vsaka od začetka za $1\,\mathrm{cm/s}$ hitrejša? Napovej: ali jo dohiti prej, pozneje ali ob istem času?
---
Ob istem času, po $200\,\mathrm{s}$. Razmik se manjša z razliko hitrosti, $4 - 3 = 1\,\mathrm{cm/s}$, ta pa je enaka kot prej.
:::

V simulaciji spodaj »Srečevanje in dohitevanje« izberi »Dohitevanje« in nastavi $v_1 = 60\,\mathrm{km/h}$, $v_2 = 40\,\mathrm{km/h}$ ter razdaljo $40\,\mathrm{km}$. Avto A dohiti avto B po $2\,\mathrm{h}$. Nato obe hitrosti povečaj za $20\,\mathrm{km/h}$. Opazi, da se čas ne spremeni.

## Rešeni primeri

### Primer 1 (lažji): po moko in nazaj

Za palačinke zmanjka moke. Maja gre v trgovino, ki je $720\,\mathrm{m}$ od doma, s hitrostjo $1{,}2\,\mathrm{m/s}$. V trgovini ostane $5\,\mathrm{min}$. Nazaj nese težko vrečko in hodi s hitrostjo $0{,}8\,\mathrm{m/s}$. Kolikšna je njena povprečna hitrost za cel izlet?

**Podatki:** $s_1 = s_2 = 720\,\mathrm{m}$, $v_1 = 1{,}2\,\mathrm{m/s}$, $v_2 = 0{,}8\,\mathrm{m/s}$, postanek $t_3 = 5\,\mathrm{min}$
**Iščemo:** povprečno hitrost $\bar v$

:::formula
$\bar v = \dfrac{s_1 + s_2}{t_1 + t_2 + t_3}$, pri tem je $t_1 = \dfrac{s_1}{v_1}$ in $t_2 = \dfrac{s_2}{v_2}$
:::

**Rešitev:**

1. Pretvorimo postanek v sekunde: $t_3 = 5 \cdot 60\,\mathrm{s} = 300\,\mathrm{s}$.
2. Čas poti tja: $t_1 = \dfrac{720\,\mathrm{m}}{1{,}2\,\mathrm{m/s}} = 600\,\mathrm{s}$.
3. Čas poti nazaj: $t_2 = \dfrac{720\,\mathrm{m}}{0{,}8\,\mathrm{m/s}} = 900\,\mathrm{s}$. Nazaj hodi počasneje, zato dlje.
4. Celoten čas s postankom, ker je del izleta: $t = 600\,\mathrm{s} + 900\,\mathrm{s} + 300\,\mathrm{s} = 1800\,\mathrm{s}$.
5. Celotna pot: $s = 2 \cdot 720\,\mathrm{m} = 1440\,\mathrm{m}$.
6. $\bar v = \dfrac{1440\,\mathrm{m}}{1800\,\mathrm{s}} = 0{,}8\,\mathrm{m/s}$.
7. Odgovor: Majina povprečna hitrost je $0{,}8\,\mathrm{m/s}$. Brez postanka bi bila $0{,}96\,\mathrm{m/s}$, sredina hitrosti pa je $1\,\mathrm{m/s}$; nobena od teh dveh vrednosti ni odgovor.

### Primer 2: mama gre naproti

Jaka je kupil moko in gre domov. Do doma ima $900\,\mathrm{m}$ in hodi s hitrostjo $1{,}2\,\mathrm{m/s}$. V istem trenutku mu gre mama po isti poti naproti s hitrostjo $1{,}8\,\mathrm{m/s}$. Kdaj in kako daleč od doma se srečata?

**Podatki:** začetni razmik $d = 900\,\mathrm{m}$, mama $v_1 = 1{,}8\,\mathrm{m/s}$, Jaka $v_2 = 1{,}2\,\mathrm{m/s}$, kreneta hkrati
**Iščemo:** čas do srečanja $t$ in mamino pot $s_1$ od doma

:::formula
$t = \dfrac{d}{v_1 + v_2}$, nato $s_1 = v_1 \cdot t$
:::

**Rešitev:**

1. Gibljeta se drug proti drugemu, zato se razmik manjša s hitrostjo $v_1 + v_2 = 3\,\mathrm{m/s}$.
2. $t = \dfrac{900\,\mathrm{m}}{3\,\mathrm{m/s}} = 300\,\mathrm{s}$, to je $5\,\mathrm{min}$.
3. Mama v tem času prehodi $s_1 = 1{,}8\,\mathrm{m/s} \cdot 300\,\mathrm{s} = 540\,\mathrm{m}$.
4. Preverimo z Jakovo potjo: $s_2 = 1{,}2\,\mathrm{m/s} \cdot 300\,\mathrm{s} = 360\,\mathrm{m}$, skupaj $540\,\mathrm{m} + 360\,\mathrm{m} = 900\,\mathrm{m}$.
5. Odgovor: srečata se po $5\,\mathrm{min}$, $540\,\mathrm{m}$ od doma.

Na grafu poti od doma v odvisnosti od časa je srečanje presečišče obeh premic:

:::risba graf
opis: Graf razdalje od doma s v metrih v odvisnosti od časa t v sekundah. Mamina premica gre iz izhodišča navzgor, Jakova se začne pri 900 m in pada. Premici se sekata pri 300 s in 540 m, kar je srečanje.
x: 0 .. 400 | 100 | t [s]
y: 0 .. 900 | 300 | s [m]
f: 9*x/5 | modra | 0 .. 400
f: 900 - 6*x/5 | oranžna | 0 .. 400
točka: 300; 540 | srečanje | levo
napis: 100; 180 | mama | pod
napis: 100; 780 | Jaka | nad
:::

### Primer 3 (težji): pozabljena denarnica

Tim gre v trgovino po jajca s hitrostjo $1{,}5\,\mathrm{m/s}$. Čez $4\,\mathrm{min}$ mama opazi, da je pozabil denarnico, in se po isti poti odpelje za njim s kolesom s hitrostjo $6\,\mathrm{m/s}$. Trgovina je $800\,\mathrm{m}$ od doma. Ali ga dohiti pred trgovino? Koliko časa vozi?

**Podatki:** Tim $v_2 = 1{,}5\,\mathrm{m/s}$, mama $v_1 = 6\,\mathrm{m/s}$, zamik $t_0 = 4\,\mathrm{min}$, do trgovine $800\,\mathrm{m}$
**Iščemo:** mamin čas vožnje $t$ in kraj dohitevanja

:::formula
prednost $d = v_2 \cdot t_0$, nato $t = \dfrac{d}{v_1 - v_2}$
:::

**Rešitev:**

1. Zamik v sekundah: $t_0 = 4 \cdot 60\,\mathrm{s} = 240\,\mathrm{s}$.
2. Timova prednost, ko mama krene: $d = 1{,}5\,\mathrm{m/s} \cdot 240\,\mathrm{s} = 360\,\mathrm{m}$.
3. Gibljeta se v isto smer, zato se razmik manjša z razliko hitrosti: $v_1 - v_2 = 4{,}5\,\mathrm{m/s}$.
4. $t = \dfrac{360\,\mathrm{m}}{4{,}5\,\mathrm{m/s}} = 80\,\mathrm{s}$.
5. Kraj: mama prevozi $6\,\mathrm{m/s} \cdot 80\,\mathrm{s} = 480\,\mathrm{m}$, kar je manj kot $800\,\mathrm{m}$.
6. Preverimo s Timom: $360\,\mathrm{m} + 1{,}5\,\mathrm{m/s} \cdot 80\,\mathrm{s} = 480\,\mathrm{m}$. Ujema se.
7. Odgovor: mama Tima dohiti po $80\,\mathrm{s}$ vožnje, $480\,\mathrm{m}$ od doma, torej še pred trgovino.

### Primer 4 – zdaj ti

Luka se s kolesom pelje k babici po marmelado s hitrostjo $6\,\mathrm{m/s}$ in se po isti poti vrne. Kako hitro mora peljati nazaj, da bo povprečna hitrost za pot tja in nazaj $4\,\mathrm{m/s}$?

**Podatki:** $v_1 = 6\,\mathrm{m/s}$, $\bar v = 4\,\mathrm{m/s}$, pot tja je enaka poti nazaj ($s_1 = s_2$), dolžina ni dana
**Iščemo:** hitrost nazaj $v_2$

:::formula
$\bar v = \dfrac{s_1 + s_2}{t_1 + t_2}$ ali za enaki poti $\bar v = \dfrac{2 v_1 v_2}{v_1 + v_2}$
:::

**Rešitev:**

1. Dolžina poti ni dana, rezultat pa od nje ni odvisen. Zato si jo izberemo sami, tako da bodo števila lepa: $s_1 = s_2 = 1200\,\mathrm{m}$.
2. Čas poti tja: $t_1 = \dfrac{1200\,\mathrm{m}}{6\,\mathrm{m/s}} = 200\,\mathrm{s}$.
3. Za povprečje $4\,\mathrm{m/s}$ mora cela pot trajati $t = \dfrac{2400\,\mathrm{m}}{4\,\mathrm{m/s}} = 600\,\mathrm{s}$.
4. Izračunaj sam, koliko časa ostane za pot nazaj in kolikšna je hitrost $v_2$.

:::premisli
Koliko sta $t_2$ in $v_2$?
---
$t_2 = 600\,\mathrm{s} - 200\,\mathrm{s} = 400\,\mathrm{s}$ in $v_2 = \dfrac{1200\,\mathrm{m}}{400\,\mathrm{s}} = 3\,\mathrm{m/s}$. Preizkus s formulo: $\dfrac{2 \cdot 6 \cdot 3}{6 + 3} = 4$. Sredina hitrosti bi napačno dala $2\,\mathrm{m/s}$.
:::

## Pogoste napake

- **Sredina hitrosti namesto pot / čas.** »Tja $4\,\mathrm{km/h}$, nazaj $6\,\mathrm{km/h}$, torej povprečno $5\,\mathrm{km/h}$.« To bi veljalo le pri enakih časih. Pri enakih poteh traja počasni del dlje, pravilno je $4{,}8\,\mathrm{km/h}$. Vedno izračunaj celotno pot in celoten čas.
- **Pozabljen postanek.** Ker se med postankom ne premikaš, se zdi, da ne šteje. Šteje: čas teče, pot ne. Postanek prištej k celotnemu času.
- **Napačen znak pri hitrostih.** Pri srečevanju nekateri odštejejo hitrosti, pri dohitevanju seštejejo. Vprašaj se, ali se razmik krajša z obeh strani (vsota) ali eden beži drugemu (razlika).
- **Pozabljena prednost.** Pri zamiku nekateri delijo kar razdaljo do cilja z razliko hitrosti ali čas merijo od napačnega trenutka. Najprej izračunaj, kje je ubežnik, ko zasledovalec krene: $d = v_2 \cdot t_0$.
- **Mešanje enot.** Minute z m/s ali km/h z metri. Pred računom vse pretvori v iste enote, na primer m, s in m/s.

## Povzetek

- Povprečna hitrost je celotna pot, deljena s celotnim časom: $\bar v = \dfrac{s}{t}$; postanki štejejo v čas.
- Sredina hitrosti velja le pri enakih časih odsekov; pri enakih poteh je $\bar v = \dfrac{2 v_1 v_2}{v_1 + v_2}$ in je manjša od sredine.
- Srečevanje: razmik $d$ se manjša z $v_1 + v_2$, zato $t = \dfrac{d}{v_1 + v_2}$.
- Dohitevanje: razmik se manjša z $v_1 - v_2$, zato $t = \dfrac{d}{v_1 - v_2}$; pri zamiku je prednost $d = v_2 \cdot t_0$.
- Na grafu $s(t)$ je srečanje ali dohitevanje presečišče premic.
- Če dolžina poti ni dana, si jo izberi sam.

## Drugače: Korak za korakom s številkami

Vzemimo Primer 3 in poglejmo, kako daleč od doma sta mama in Tim (v metrih) vsakih $20\,\mathrm{s}$, odkar mama krene. Tim ima $360\,\mathrm{m}$ prednosti in v $20\,\mathrm{s}$ prehodi $30\,\mathrm{m}$, mama pa prevozi $120\,\mathrm{m}$.

| $t$ [s] | Tim | mama | razmik |
|---|---|---|---|
| $0$ | $360$ | $0$ | $360$ |
| $20$ | $390$ | $120$ | $270$ |
| $40$ | $420$ | $240$ | $180$ |
| $60$ | $450$ | $360$ | $90$ |
| $80$ | $480$ | $480$ | $0$ |

Razmik se vsakih $20\,\mathrm{s}$ zmanjša za enakih $90\,\mathrm{m}$, to je $4{,}5\,\mathrm{m}$ na sekundo. Ko pade na nič, je mama Tima dohitela. Formula $t = \dfrac{d}{v_1 - v_2}$ samo preskoči vse vrstice naenkrat.

## Drugače: Kot zgodba

Teta Meta je šla z avtom na tržnico po zelenjavo za juho. Do tržnice je $15\,\mathrm{km}$, a promet je bil gost in vozila je le s hitrostjo $30\,\mathrm{km/h}$. »Nič hudega,« je rekla, »nazaj bom vozila tako hitro, da bo povprečje za celo pot $60\,\mathrm{km/h}$.«

Nečak je vzel svinčnik. Pot tja ji je vzela $\dfrac{15}{30} = 0{,}5$ ure. Za celo pot, $30\,\mathrm{km}$, s povprečjem $60\,\mathrm{km/h}$ bi smela porabiti prav tako $0{,}5$ ure. Ta čas je že porabila za pot tja. Za vrnitev ji ne ostane nič, zato bi morala nazaj priti v trenutku.

Teta je zmajala z glavo in se peljala domov po pravilih. Nauk zgodbe: hiter konec ne popravi počasnega začetka, ker povprečna hitrost šteje čas, ne hitrosti.

## Preveri se

? Dva natakarja gresta po dolgem hodniku restavracije drug proti drugemu s hitrostma $1{,}5\,\mathrm{m/s}$ in $1\,\mathrm{m/s}$. Zakaj se razdalja med njima vsako sekundo zmanjša za $2{,}5\,\mathrm{m}$?
+ Ker vsak v sekundi prehodi svoj del razdalje in se oba dela seštejeta.
- Razdalja se zmanjša le za $0{,}5\,\mathrm{m}$, ker šteje razlika hitrosti.
~ Razlika velja, ko se gibljeta v isto smer in eden lovi drugega. Drug proti drugemu se razdalja krajša z obeh strani.
- Ker se pri gibanju dveh teles hitrosti vedno seštejejo.
~ Ne vedno: če gresta v isto smer, se razmik spreminja z razliko hitrosti.
> Hitrost približevanja je $1{,}5 + 1 = 2{,}5\,\mathrm{m/s}$, ker se razmik krajša z obeh koncev hkrati.

? Ana nese babici juho. Malo pozneje gre za njo brat, ker je Ana pozabila žlice. Z grafa odčitaj, koliko časa je bila Ana že na poti, ko jo je brat dohitel.
:::risba graf
opis: Graf razdalje od doma s v metrih v odvisnosti od časa t v minutah. Anina premica gre od 0 m pri 0 min do 720 m pri 12 min. Bratova premica gre od 0 m pri 4 min do 800 m pri 12 min. Presečišče je označeno s točko P.
x: 0 .. 12 | 2 | t [min]
y: 0 .. 800 | 200 | s [m]
f: 60*x | modra | 0 .. 12
f: 100*(x - 4) | oranžna | 4 .. 12
točka: 10; 600 | P | levo
napis: 2; 120 | Ana | nad
napis: 6; 200 | brat | desno
:::
- $4\,\mathrm{min}$
~ Pri $4\,\mathrm{min}$ je brat šele krenil od doma. Dohitevanje je tam, kjer se premici sekata.
- $6\,\mathrm{min}$
~ Toliko časa je hodil brat (od $4$ do $10\,\mathrm{min}$). Vprašanje sprašuje po Aninem času.
+ $10\,\mathrm{min}$
- $12\,\mathrm{min}$
~ Pri $12\,\mathrm{min}$ se graf samo konča; premici se sekata prej.
> Točka P leži pri $t = 10\,\mathrm{min}$ in $s = 600\,\mathrm{m}$. Preizkus: Ana v $10\,\mathrm{min}$ prehodi $60 \cdot 10 = 600\,\mathrm{m}$, brat v $6\,\mathrm{min}$ prehodi $100 \cdot 6 = 600\,\mathrm{m}$.

? Oceni, koliko sekund potrebuješ, da iz kuhinje na mizo prineseš 6 krožnikov, vsakega posebej. Do mize je $8\,\mathrm{m}$, hodiš s približno $1\,\mathrm{m/s}$, pri vsakem krožniku pa skupaj izgubiš približno $4\,\mathrm{s}$ za nalaganje in odlaganje.
= 120 s | 15
~ 48 | Šteješ samo pot do mize. Po vsak naslednji krožnik se moraš vrniti, zato je pot za krožnik $16\,\mathrm{m}$.
~ 96 | Pozabil si na postanke. Med nalaganjem in odlaganjem čas teče, čeprav stojiš.
> Pot: $6 \cdot 2 \cdot 8\,\mathrm{m} = 96\,\mathrm{m}$, pri $1\,\mathrm{m/s}$ je to $96\,\mathrm{s}$. Postanki: $6 \cdot 4\,\mathrm{s} = 24\,\mathrm{s}$. Skupaj približno $120\,\mathrm{s}$, torej dve minuti. Če zadnje vrnitve v kuhinjo ne šteješ, dobiš $112\,\mathrm{s}$, kar je za oceno enako dobro.

? Dostavljavec pic se s kolesom pelje do stranke v klanec s hitrostjo $12\,\mathrm{km/h}$, po isti poti nazaj pa navzdol s hitrostjo $36\,\mathrm{km/h}$. Kolikšna je njegova povprečna hitrost za pot tja in nazaj v km/h?
= 18 km/h | 0,1
~ 24 | To je sredina hitrosti. Veljala bi le, če bi oba dela trajala enako dolgo, v klanec pa vozi trikrat dlje kot navzdol.
> Poti sta enaki, zato $\bar v = \dfrac{2 \cdot 12 \cdot 36}{12 + 36} = 18\,\mathrm{km/h}$. Brez formule: izberi $12\,\mathrm{km}$ v vsako smer. Tja vozi $60\,\mathrm{min}$, nazaj $20\,\mathrm{min}$, torej $24\,\mathrm{km}$ v $80\,\mathrm{min}$.

? Mama in sin sta $480\,\mathrm{m}$ narazen in hkrati kreneta drug proti drugemu. Mama hodi s hitrostjo $1{,}5\,\mathrm{m/s}$. Srečata se po $2\,\mathrm{min}$. Kolikšna je sinova hitrost v m/s?
= 2,5 m/s | 0,05
~ 4 | To je hitrost, s katero se manjša razmik, $v_1 + v_2$. Odšteti moraš še maminih $1{,}5\,\mathrm{m/s}$.
~ 5,5 | Mamino hitrost si prištel. Razmik se manjša z vsoto hitrosti, zato je sinova hitrost $4 - 1{,}5$.
~ 238,5 | Čas $2\,\mathrm{min}$ si vstavil kot $2$ namesto $120\,\mathrm{s}$.
> $v_1 + v_2 = \dfrac{480\,\mathrm{m}}{120\,\mathrm{s}} = 4\,\mathrm{m/s}$, zato je sinova hitrost $4 - 1{,}5 = 2{,}5\,\mathrm{m/s}$.

? Kuhinjska ura kaže točno 12.00 in oba kazalca se pokrivata. Veliki kazalec se zavrti za $6^\circ$ na minuto, mali za $0{,}5^\circ$ na minuto. Čez koliko minut se kazalca spet pokrijeta? Zaokroži na desetinko minute.
= 65,5 min | 0,2
~ 60 | Po eni uri je veliki kazalec spet na 12, mali pa se je medtem premaknil na 1. Velik ga mora še dohiteti.
~ 5,5 | To je čas po 13. uri. Vprašanje sprašuje, koliko minut mine od 12.00.
> To je dohitevanje: veliki kazalec mora malega »prehiteti za cel krog«, $360^\circ$. Razmik se manjša s $6 - 0{,}5 = 5{,}5^\circ$ na minuto, zato $t = \dfrac{360}{5{,}5} \approx 65{,}5\,\mathrm{min}$, malo po 13.05.

:::simboli
\bar v | povprečna hitrost | \bar v = \frac{s}{t} | m/s | postanki štejejo v čas
s | celotna pot | | m
t | celoten čas; pri srečevanju in dohitevanju čas do srečanja | | s
s_1, s_2 | pot prvega in drugega odseka | | m
t_1, t_2 | čas prvega in drugega odseka | t_1 = \frac{s_1}{v_1} | s
t_3 | čas postanka | | s
v_1 | hitrost na prvem odseku; pri srečevanju in dohitevanju hitrost prvega telesa (zasledovalca) | | m/s
v_2 | hitrost na drugem odseku; hitrost drugega telesa (ubežnika) | | m/s
d | začetni razmik med telesoma (prednost) | d = v_2 \cdot t_0 | m | $d = v_2 \cdot t_0$ le pri zamiku štarta
t_0 | zamik štarta zasledovalca | | s
:::

<<RACUN
vrednost: 10/12.5 | 0.8
vrednost: (2+8)/8 | 1.25
vrednost: 10/17.5 | 0.57
vrednost: 2*0.5*2/(0.5+2) | 0.8
vrednost: 720/1.2 | 600
vrednost: 720/0.8 | 900
vrednost: 1440/(600+900+300) | 0.8
vrednost: 1440/1500 | 0.96
vrednost: 900/(1.8+1.2) | 300
vrednost: 1.8*300 | 540
vrednost: 1.5*240 | 360
vrednost: 360/(6-1.5) | 80
vrednost: 6*80 | 480
resi: 2*6*v/(6+v)=4 | v | 3
vrednost: 2*4*6/(4+6) | 4.8
resi: 60*t=100*(t-4) | t | 10
vrednost: 6*2*8/1+6*4 | 120
vrednost: 11*8/1+6*4 | 112
vrednost: 2*12*36/(12+36) | 18
vrednost: 24/(80/60) | 18
resi: 480/120=1.5+v | v | 2.5
resi: 6*t=0.5*t+360 | t | 720/11
vrednost: 15/30 | 0.5
>>
