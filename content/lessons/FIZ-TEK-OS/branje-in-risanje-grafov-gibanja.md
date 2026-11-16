---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na šolskem tekmovanju ste dobili graf hitrosti pladnja na tekočem traku v restavraciji s sušijem. Črta na grafu je od začetka do konca vodoravna, na višini $0{,}2\,\mathrm{m/s}$. Sošolec Luka takoj reče: »Vodoravna črta pomeni, da se nič ne dogaja. Pladenj stoji.«

Ima prav? Graf gibanja je kot recept: vsak del nekaj pove, a samo, če ga znaš prebrati. Na tekmovanjih je skoraj vsaka naloga iz gibanja podana z grafom ali pa zahteva, da ga narišeš. Ko jih znaš brati, iz ene slike razbereš lego, hitrost, pospešek in pot, ne da bi računal na pamet. Do konca razlage boš vedel, kje se je Luka zmotil.

## Razlaga

Graf bomo gradili po kosih. Za vsakim kosom je kratko vprašanje; odgovori nanj, preden greš naprej.

**1. Graf poti $s(t)$.** Kuhar Marko gre od štedilnika do hladilnika, tam nekaj časa izbira sestavine, nato počasi nese težak lonec do mize na koncu kuhinje. Na vodoravno os nanesemo **čas** $t$, na navpično os **pot** $s$, to je razdaljo, ki jo je Marko prehodil od štedilnika. Vsaka točka grafa pove: ob tem času je bil toliko metrov daleč.

:::risba graf
opis: Graf poti s v metrih v odvisnosti od časa t v sekundah. Odsek A gre od točke (0; 0) do (4; 6), odsek B je vodoraven od (4; 6) do (10; 6), odsek C gre od (10; 6) do (16; 9).
x: 0 .. 16 | 2 | t [s]
y: 0 .. 10 | 2 | s [m]
črta: 0; 0 -> 4; 6 -> 10; 6 -> 16; 9 | modra debelo
napis: 2; 3 | A | nad levo
napis: 7; 6 | B | nad
napis: 13; 7,5 | C | nad levo
podnapis: Marko v kuhinji: hoja do hladilnika (A), izbiranje (B), nošenje lonca (C).
:::

*Preveri:* kje je bil Marko ob $t = 2\,\mathrm{s}$? *(Odgovor: $3\,\mathrm{m}$ od štedilnika, točka leži na sredini odseka A.)*

**2. Naklon je hitrost.** V odseku A je Marko v $4\,\mathrm{s}$ prehodil $6\,\mathrm{m}$. Spremembo poti označimo z $\Delta s$ (beri »delta s«), pretečeni čas pa z $\Delta t$. Njuno razmerje je **naklon** grafa in hkrati hitrost:

$$v = \frac{\Delta s}{\Delta t}$$

V odseku A: $v = \dfrac{6\,\mathrm{m}}{4\,\mathrm{s}} = 1{,}5\,\mathrm{m/s}$. V odseku C je $\Delta s = 9\,\mathrm{m} - 6\,\mathrm{m} = 3\,\mathrm{m}$ in $\Delta t = 16\,\mathrm{s} - 10\,\mathrm{s} = 6\,\mathrm{s}$, zato $v = \dfrac{3\,\mathrm{m}}{6\,\mathrm{s}} = 0{,}5\,\mathrm{m/s}$. Strmejši odsek pomeni hitrejšo hojo.

:::premisli
Kolikšna je Markova hitrost v odseku B? Napovej iz oblike odseka, ne računaj.
---
Nič. Odsek je vodoraven: čas teče, pot pa ostaja $6\,\mathrm{m}$, torej je $\Delta s = 0$ in $v = 0$. Na grafu $s(t)$ vodoraven del pomeni **mirovanje**.
:::

**3. Graf hitrosti $v(t)$.** Iz naklonov narišemo nov graf: na navpično os zdaj nanesemo hitrost. V vsakem odseku je hitrost stalna, zato je vsak del vodoravna črta, na višini, ki jo je dal naklon. Senčena pravokotnika pod črtama prideta na vrsto v 4. koraku.

:::risba graf
opis: Graf hitrosti v v metrih na sekundo v odvisnosti od časa t v sekundah. Od 0 do 4 s je hitrost 1,5 m/s, od 4 do 10 s je 0, od 10 do 16 s je 0,5 m/s. Pod prvim delom je pravokotnik s ploščino 6 m, pod tretjim pravokotnik s ploščino 3 m.
x: 0 .. 16 | 2 | t [s]
y: 0 .. 2 | 0,5 | v [m/s]
pravokotnik: 0; 0 .. 4; 1,5 | zelena ozadje
pravokotnik: 10; 0 .. 16; 0,5 | zelena ozadje
črta: 0; 1,5 -> 4; 1,5 | modra debelo
črta: 4; 0 -> 10; 0 | modra debelo
črta: 10; 0,5 -> 16; 0,5 | modra debelo
napis: 2; 0,75 | 6 m | sredina
napis: 13; 0,25 | 3 m | sredina
:::

Zdaj lahko presodiš Lukovo trditev. Vodoravna črta na grafu $v(t)$ pri $0{,}2\,\mathrm{m/s}$ pomeni, da se pladenj ves čas giblje z enako hitrostjo: **enakomerno gibanje**. Pladenj bi stal le, če bi črta ležala na časovni osi, pri $v = 0$. Luka je zamenjal graf hitrosti z grafom poti.

*Preveri:* kakšen je graf $v(t)$ za kuharja, ki vso minuto stoji pri štedilniku? *(Odgovor: vodoravna črta na osi $t$, pri $v = 0$.)*

**4. Ploščina pod grafom $v(t)$ je pot.** Pod odsekom A je pravokotnik s stranicama $4\,\mathrm{s}$ in $1{,}5\,\mathrm{m/s}$. Njegova ploščina je $4\,\mathrm{s} \cdot 1{,}5\,\mathrm{m/s} = 6\,\mathrm{m}$, kar je natanko pot v odseku A. To ni naključje: pri enakomernem gibanju je $s = v \cdot t$, to pa je ravno »višina krat širina«. Pod odsekom C je pravokotnik s ploščino $0{,}5\,\mathrm{m/s} \cdot 6\,\mathrm{s} = 3\,\mathrm{m}$. Skupaj $6\,\mathrm{m} + 3\,\mathrm{m} = 9\,\mathrm{m}$, enako kot na koncu grafa $s(t)$.

*Preveri:* tekoči trak iz uvoda vozi pladenj $30\,\mathrm{s}$. Kolikšna je ploščina pod njegovim grafom? *(Odgovor: $0{,}2\,\mathrm{m/s} \cdot 30\,\mathrm{s} = 6\,\mathrm{m}$, toliko pladenj prepotuje.)*

**5. Pospešeno gibanje.** Kuhar potisne voziček s posodo, da ta enakomerno pospešuje: v $4\,\mathrm{s}$ doseže hitrost $2\,\mathrm{m/s}$. Graf $v(t)$ je zdaj poševna premica skozi izhodišče. Njen naklon je **pospešek** $a$, sprememba hitrosti v vsaki sekundi:

$$a = \frac{\Delta v}{\Delta t}$$

Tu je $a = \dfrac{2\,\mathrm{m/s}}{4\,\mathrm{s}} = 0{,}5\,\mathrm{m/s^2}$. Ploščina pod grafom je zdaj trikotnik: $\dfrac{4\,\mathrm{s} \cdot 2\,\mathrm{m/s}}{2} = 4\,\mathrm{m}$. Pravilo »ploščina je pot« velja za vsako obliko grafa, ne le za pravokotnik.

:::premisli
Kakšen je graf $s(t)$ za ta voziček: premica, krivulja, ki je vse bolj strma, ali krivulja, ki je vse bolj položna? Zakaj?
---
Krivulja, ki je vse bolj strma. Naklon grafa $s(t)$ je hitrost, hitrost pa ves čas raste. V vsaki naslednji sekundi voziček prevozi več kot v prejšnji, zato se graf vse hitreje dviga.
:::

*Preveri:* kaj pomeni poševna premica, ki na grafu $v(t)$ pada proti osi $t$? *(Odgovor: telo enakomerno zavira; naklon in pospešek sta negativna.)*

**6. Strategija za tekmovanja.** Ko dobiš graf, se najprej vprašaj, kaj je na navpični osi. Pri $s(t)$ iščeš **naklon** (hitrost), pri $v(t)$ iščeš **naklon** (pospešek) in **ploščino** (pot). Graf razreži na odseke, kjer je oblika preprosta, in vsakega obravnavaj posebej. Če rišeš graf iz besedila, si najprej izpiši časovne mejnike.

## Rešeni primeri

### Primer 1: robotski sesalnik v kuhinji

Graf kaže pot robotskega sesalnika, ki čisti kuhinjo. Kolikšna je njegova hitrost v prvih $20\,\mathrm{s}$? Koliko časa stoji? Koliko metrov je prevozil do $t = 40\,\mathrm{s}$?

:::risba graf
opis: Graf poti s v metrih v odvisnosti od časa t v sekundah za robotski sesalnik. Od (0; 0) do (20; 6) graf enakomerno narašča, od 20 do 30 s je vodoraven pri 6 m, od (30; 6) do (50; 10) spet narašča.
x: 0 .. 50 | 10 | t [s]
y: 0 .. 12 | 2 | s [m]
črta: 0; 0 -> 20; 6 -> 30; 6 -> 50; 10 | modra debelo
:::

**Podatki:** odčitki z grafa: od $0$ do $20\,\mathrm{s}$ pot naraste od $0$ do $6\,\mathrm{m}$; od $20$ do $30\,\mathrm{s}$ ostane $6\,\mathrm{m}$; od $30$ do $50\,\mathrm{s}$ naraste od $6$ do $10\,\mathrm{m}$
**Iščemo:** hitrost $v_1$ v prvem odseku, čas mirovanja in pot ob $t = 40\,\mathrm{s}$

:::formula
Hitrost je naklon grafa $s(t)$: $v = \dfrac{\Delta s}{\Delta t}$
:::

**Rešitev:**

1. Prvi odsek: $v_1 = \dfrac{6\,\mathrm{m}}{20\,\mathrm{s}} = 0{,}3\,\mathrm{m/s}$.
2. Vodoraven del traja od $20$ do $30\,\mathrm{s}$, torej sesalnik stoji $10\,\mathrm{s}$ (morda obrača smer ali prazni posodo).
3. Tretji odsek ima naklon $v_3 = \dfrac{10\,\mathrm{m} - 6\,\mathrm{m}}{50\,\mathrm{s} - 30\,\mathrm{s}} = 0{,}2\,\mathrm{m/s}$; potrebujemo ga, ker $t = 40\,\mathrm{s}$ leži v tem odseku.
4. Od $30$ do $40\,\mathrm{s}$ prevozi še $0{,}2\,\mathrm{m/s} \cdot 10\,\mathrm{s} = 2\,\mathrm{m}$, skupaj $6\,\mathrm{m} + 2\,\mathrm{m} = 8\,\mathrm{m}$.
5. Odgovor: v prvih $20\,\mathrm{s}$ vozi s hitrostjo $0{,}3\,\mathrm{m/s}$, stoji $10\,\mathrm{s}$, do $t = 40\,\mathrm{s}$ pa prevozi $8\,\mathrm{m}$.

### Primer 2: natakar s pladnjem

Natakar z juho na pladnju iz mirovanja enakomerno pospešuje $2\,\mathrm{s}$, da doseže hitrost $1{,}2\,\mathrm{m/s}$. Nato $5\,\mathrm{s}$ hodi s to hitrostjo, potem pa v $1\,\mathrm{s}$ enakomerno ustavi pri mizi. Nariši graf $v(t)$. Kolikšen je pospešek v prvem delu in kako daleč je miza od kuhinje?

**Podatki:** začetna hitrost $0$; pospeševanje $t_1 = 2\,\mathrm{s}$; največja hitrost $v = 1{,}2\,\mathrm{m/s}$; enakomerna hoja $t_2 = 5\,\mathrm{s}$; zaviranje $t_3 = 1\,\mathrm{s}$
**Iščemo:** pospešek $a$ in celotno pot $s$

:::formula
$a = \dfrac{\Delta v}{\Delta t}$; pot je ploščina pod grafom $v(t)$ (trikotnik, pravokotnik, trikotnik)
:::

**Rešitev:**

1. Graf $v(t)$: premica od $(0; 0)$ do $(2\,\mathrm{s}; 1{,}2\,\mathrm{m/s})$, vodoravna črta do $t = 7\,\mathrm{s}$, nato premica do $(8\,\mathrm{s}; 0)$. Oblika je trapez (slika pod rešitvijo).
2. Pospešek: $a = \dfrac{1{,}2\,\mathrm{m/s}}{2\,\mathrm{s}} = 0{,}6\,\mathrm{m/s^2}$.
3. Prvi trikotnik: $s_1 = \dfrac{2\,\mathrm{s} \cdot 1{,}2\,\mathrm{m/s}}{2} = 1{,}2\,\mathrm{m}$.
4. Pravokotnik: $s_2 = 5\,\mathrm{s} \cdot 1{,}2\,\mathrm{m/s} = 6\,\mathrm{m}$.
5. Drugi trikotnik: $s_3 = \dfrac{1\,\mathrm{s} \cdot 1{,}2\,\mathrm{m/s}}{2} = 0{,}6\,\mathrm{m}$.
6. Seštejemo, ker se odseki nadaljujejo drug za drugim: $s = 1{,}2\,\mathrm{m} + 6\,\mathrm{m} + 0{,}6\,\mathrm{m} = 7{,}8\,\mathrm{m}$.
7. Odgovor: natakar pospešuje z $0{,}6\,\mathrm{m/s^2}$, miza je $7{,}8\,\mathrm{m}$ od kuhinje.

:::risba graf
opis: Graf hitrosti v v metrih na sekundo v odvisnosti od časa t v sekundah za natakarja. Od (0; 0) do (2; 1,2) hitrost enakomerno raste, od 2 do 7 s je stalna 1,2 m/s, od (7; 1,2) do (8; 0) enakomerno pada. Lik pod grafom je trapez.
x: 0 .. 8 | 1 | t [s]
y: 0 .. 1,6 | 0,4 | v [m/s]
črta: 0; 0 -> 2; 1,2 -> 7; 1,2 -> 8; 0 | modra debelo
:::

### Primer 3: kuhinjsko dvigalo (obratno vprašanje)

Kuhinjsko dvigalo dvigne krožnike iz kuhinje v kleti v restavracijo $6\,\mathrm{m}$ višje. Prvi $2\,\mathrm{s}$ enakomerno pospešuje, nato vozi s stalno hitrostjo, zadnji $2\,\mathrm{s}$ pa enakomerno zavira do ustavitve. Vožnja traja $8\,\mathrm{s}$. Kolikšna je največja hitrost dvigala in kolikšen je pospešek na začetku?

**Podatki:** pot $s = 6\,\mathrm{m}$; celotni čas $t = 8\,\mathrm{s}$; pospeševanje $2\,\mathrm{s}$; zaviranje $2\,\mathrm{s}$; začne in konča v mirovanju
**Iščemo:** največjo hitrost $v_{\max}$ in pospešek $a$

:::formula
Ploščina trapeza pod grafom $v(t)$: $s = v_{\max} \cdot \dfrac{t + t_\mathrm{e}}{2}$, kjer je $t_\mathrm{e}$ čas vožnje s stalno hitrostjo; nato $a = \dfrac{v_{\max}}{2\,\mathrm{s}}$
:::

**Rešitev:**

1. Graf $v(t)$ je trapez: osnovnica na osi $t$ je dolga $8\,\mathrm{s}$, zgornja stranica pa je čas stalne hitrosti.
2. Čas stalne hitrosti: $t_\mathrm{e} = 8\,\mathrm{s} - 2\,\mathrm{s} - 2\,\mathrm{s} = 4\,\mathrm{s}$.
3. Višina trapeza je neznana $v_{\max}$, ploščina pa mora biti pot $6\,\mathrm{m}$: $v_{\max} \cdot \dfrac{8\,\mathrm{s} + 4\,\mathrm{s}}{2} = 6\,\mathrm{m}$.
4. Izračunaj sam $v_{\max}$ in nato še pospešek, potem preveri:

:::premisli
Koliko sta $v_{\max}$ in $a$?
---
Iz $v_{\max} \cdot 6\,\mathrm{s} = 6\,\mathrm{m}$ sledi $v_{\max} = 1\,\mathrm{m/s}$. Pospešek: $a = \dfrac{1\,\mathrm{m/s}}{2\,\mathrm{s}} = 0{,}5\,\mathrm{m/s^2}$. Dvigalo vozi največ $1\,\mathrm{m/s}$ in na začetku pospešuje z $0{,}5\,\mathrm{m/s^2}$.
:::

## Pogoste napake

- **Graf kot slika poti.** »Graf $s(t)$ gre navzgor, torej je voziček peljal po klancu.« Graf ni zemljevid: navpična os je pot, ne višina. Graf, ki se dviga, pomeni le, da se pot veča. Vedno najprej preberi oznako na navpični osi.
- **Vodoravno pomeni mirovanje, ne glede na graf.** To je bila Lukova napaka. Vodoravni del grafa $s(t)$ pomeni mirovanje, vodoravni del grafa $v(t)$ pa enakomerno gibanje. Telo na grafu $v(t)$ stoji samo, kjer je črta na osi $t$.
- **Hitrost iz ene same točke.** Pri odseku, ki se ne začne v izhodišču, učenec računa $v = \dfrac{s}{t}$ z vrednostmi na koncu odseka. Prav je razmerje **sprememb** $\dfrac{\Delta s}{\Delta t}$: od konca odseka odštej njegov začetek.
- **Trikotnik računan kot pravokotnik.** Pri pospeševanju iz mirovanja je pot polovica produkta $t \cdot v$, ker je lik pod grafom trikotnik. Kdor pozabi deliti z $2$, dobi dvakrat preveliko pot.
- **Presečišče grafov $v(t)$ je srečanje.** Če se grafa hitrosti dveh vozičkov sekata, imata takrat **enako hitrost**, ne pa nujno enake lege. Za srečanje potrebujeta enako lego: preberi jo z grafa $s(t)$ ali, če vozička začneta na istem mestu, primerjaj ploščini pod grafoma $v(t)$.

## Povzetek

- Graf $s(t)$: naklon $\dfrac{\Delta s}{\Delta t}$ je hitrost; vodoraven del pomeni mirovanje, strmejši del večjo hitrost.
- Graf $v(t)$: vodoravna črta je enakomerno gibanje, na osi $t$ pa mirovanje; naklon $\dfrac{\Delta v}{\Delta t}$ je pospešek.
- Ploščina pod grafom $v(t)$ je pot (pravokotnik, trikotnik, trapez); pri trikotniku ne pozabi deliti z $2$.
- Pri pospešenem gibanju je graf $s(t)$ krivulja, ki postaja vse bolj strma.
- Strategija: preberi osi, razreži graf na preproste odseke, pri obratnih nalogah ploščino izenači z znano potjo.

## Drugače: Na sliki

Tri osnovna gibanja (mirovanje, enakomerno in enakomerno pospešeno) in njihova grafa:

| Gibanje | $s(t)$ | $v(t)$ |
|---|---|---|
| $v = 0$ | vodoravno | na osi |
| $v$ stalna | premica | vodoravno |
| $v$ raste | krivulja | premica |

V zadnji vrstici je graf $s(t)$ krivulja, ki je vse bolj strma, graf $v(t)$ pa poševna premica, ki se dviga.

Spodnji graf kaže pot vozička iz razlage 5. Primerjaj ga z grafom $v(t)$, kjer je bil trikotnik s ploščino $4\,\mathrm{m}$: krivulja se konča točno pri $4\,\mathrm{m}$.

:::risba graf
opis: Graf poti s v metrih za voziček, ki iz mirovanja pospešuje z 0,5 m/s². Krivulja začne vodoravno v izhodišču in je vse bolj strma; ob t = 4 s doseže 4 m.
x: 0 .. 5 | 1 | t [s]
y: 0 .. 5 | 1 | s [m]
f: 0.25*x^2 | modra | 0 .. 4
točka: 4; 4 | (4 s; 4 m) | levo
:::

V simulaciji spodaj »Grafi enakomernega gibanja« nastavi hitrost najprej na $4\,\mathrm{m/s}$, nato na $8\,\mathrm{m/s}$ in obakrat poglej graf $x(t)$ (graf lege; pri gibanju samo naprej je enak grafu poti $s(t)$). Opazi, da je premica pri dvakrat večji hitrosti dvakrat bolj strma. Nato preklopi na $v(t)$ in poglej senčeno ploščino: to je prevožena pot.

## Drugače: Bolj natančno

**Lega in pot.** Doslej se je Marko premikal samo naprej. Kaj pa, če se vrne? Zato fiziki rišejo graf **lege** $x(t)$: koliko metrov je telo od izbrane točke, recimo od štedilnika. Če se Marko iz $9\,\mathrm{m}$ v $6\,\mathrm{s}$ vrne k štedilniku, graf $x(t)$ pade z $9\,\mathrm{m}$ na $0$. Naklon je negativen: $v = \dfrac{0 - 9\,\mathrm{m}}{6\,\mathrm{s}} = -1{,}5\,\mathrm{m/s}$. Minus pove smer, ne »manj kot nič hitrosti«. Prehojena pot pa se ne zmanjša: $9\,\mathrm{m}$ tja in $9\,\mathrm{m}$ nazaj je $18\,\mathrm{m}$.

**Ploščina pod osjo.** Ko se telo vrača, je njegova hitrost negativna, zato na grafu $v(t)$ ta del leži pod osjo $t$. Ta ploščina se pri **legi** odšteje, pri **poti** pa prišteje.

**Trenutna hitrost na krivulji.** Pri ukrivljenem grafu $s(t)$ naklon ni povsod enak. Hitrost v izbranem trenutku dobiš iz naklona **tangente**: premice, ki se krivulje v tej točki le dotakne. Na tekmovanju jo nariši z ravnilom in odčitaj dve oddaljeni točki na njej.

**Štetje kvadratkov.** Če graf $v(t)$ ni sestavljen iz preprostih likov, preštej kvadratke mreže pod njim. En kvadratek ni $1\,\mathrm{m}$, ampak (velikost razdelka na osi $v$) krat (velikost razdelka na osi $t$), na primer $0{,}5\,\mathrm{m/s} \cdot 2\,\mathrm{s} = 1\,\mathrm{m}$.

## Preveri se

? Katera trditev o grafu poti $s(t)$ je pravilna?
- Kjer se graf dviga, se telo premika navzgor.
~ Graf ni slika poti. Navpična os je pot, zato dvigajoči graf pove le, da se pot veča, ne da gre telo navkreber.
- Vodoraven del grafa pomeni enakomerno gibanje.
~ To velja za graf $v(t)$. Pri $s(t)$ vodoraven del pomeni, da se pot ne spreminja: telo miruje.
+ Strmejši del grafa pomeni večjo hitrost.
- Ploščina pod grafom $s(t)$ je prepotovana pot.
~ Pot je ploščina pod grafom $v(t)$. Pri $s(t)$ pot preprosto odčitaš na navpični osi.
> Naklon grafa $s(t)$ je $\dfrac{\Delta s}{\Delta t}$, to je hitrost. Strmejši del pomeni večjo hitrost.

? Mravlja hodi po kuhinjskem pultu. Graf kaže njeno pot. Razvrsti odseke od tistega z največjo do tistega z najmanjšo hitrostjo.
:::risba graf
opis: Graf poti s v centimetrih v odvisnosti od časa t v sekundah. Odsek A od (0; 0) do (2; 4), odsek B vodoravno od (2; 4) do (5; 4), odsek C od (5; 4) do (6; 8), odsek D od (6; 8) do (10; 10).
x: 0 .. 10 | 1 | t [s]
y: 0 .. 10 | 2 | s [cm]
črta: 0; 0 -> 2; 4 -> 5; 4 -> 6; 8 -> 10; 10 | modra debelo
napis: 1; 2 | A | nad levo
napis: 3,5; 4 | B | nad
napis: 5,5; 6 | C | levo
napis: 8; 9 | D | nad levo
:::
1. odsek C
2. odsek A
3. odsek D
4. odsek B
> Nakloni: C $\dfrac{4\,\mathrm{cm}}{1\,\mathrm{s}} = 4\,\mathrm{cm/s}$, A $\dfrac{4\,\mathrm{cm}}{2\,\mathrm{s}} = 2\,\mathrm{cm/s}$, D $\dfrac{2\,\mathrm{cm}}{4\,\mathrm{s}} = 0{,}5\,\mathrm{cm/s}$, B je vodoraven, tam mravlja stoji.

? Kuhar potiska voziček. Graf kaže njegovo hitrost. Kolikšno pot prevozi voziček v $10\,\mathrm{s}$?
:::risba graf
opis: Graf hitrosti v v metrih na sekundo v odvisnosti od časa t v sekundah. Od (0; 0) do (3; 1,5) hitrost enakomerno raste, od 3 do 7 s je stalna 1,5 m/s, od (7; 1,5) do (10; 0) enakomerno pada.
x: 0 .. 10 | 1 | t [s]
y: 0 .. 2 | 0,5 | v [m/s]
črta: 0; 0 -> 3; 1,5 -> 7; 1,5 -> 10; 0 | modra debelo
:::
= 10,5 m | 0,1
~ 15 | Pomnožil si $1{,}5\,\mathrm{m/s}$ s celim časom $10\,\mathrm{s}$, kot da bi bil lik pravokotnik. Prvi in zadnji del sta trikotnika.
~ 6 | Upošteval si samo srednji del. Tudi med pospeševanjem in zaviranjem se voziček premika.
> Trikotnik $\dfrac{3 \cdot 1{,}5}{2} = 2{,}25\,\mathrm{m}$, pravokotnik $4 \cdot 1{,}5 = 6\,\mathrm{m}$, trikotnik $2{,}25\,\mathrm{m}$. Skupaj $10{,}5\,\mathrm{m}$.

? Poišči napako v rešitvi. Naloga: graf $s(t)$ gre od točke $(10\,\mathrm{s}; 4\,\mathrm{m})$ do točke $(30\,\mathrm{s}; 8\,\mathrm{m})$. Kolikšna je hitrost v tem odseku? Rešitev: (1) Na koncu odseka odčitam $s = 8\,\mathrm{m}$ in $t = 30\,\mathrm{s}$. (2) $v = \dfrac{8\,\mathrm{m}}{30\,\mathrm{s}} \approx 0{,}27\,\mathrm{m/s}$. (3) Odgovor: $0{,}27\,\mathrm{m/s}$. Kje je napaka?
- Pri (1): odčitek je napačen.
~ Odčitek je pravilen, konec odseka je res pri $8\,\mathrm{m}$ in $30\,\mathrm{s}$. Težava je v tem, kaj z njim narediš.
+ Pri (2): deliti je treba spremembi, $\dfrac{8\,\mathrm{m} - 4\,\mathrm{m}}{30\,\mathrm{s} - 10\,\mathrm{s}} = 0{,}2\,\mathrm{m/s}$.
- Rešitev je pravilna.
~ Odsek se ne začne v izhodišču. Količnik $\dfrac{s}{t}$ ob koncu odseka meša prejšnje gibanje z gibanjem v tem odseku.
> Hitrost je naklon odseka, torej $\dfrac{\Delta s}{\Delta t} = \dfrac{4\,\mathrm{m}}{20\,\mathrm{s}} = 0{,}2\,\mathrm{m/s}$.

? Natakar nese juho: najprej pospešuje, nato hodi enakomerno, pred mizo pa enakomerno upočasni do ustavitve. Kako je videti graf njegove poti $s(t)$?
- Kot hrib: najprej se dviga, nato je raven, nato pade nazaj na nič.
~ To je oblika grafa $v(t)$, ne $s(t)$. Pot se med hojo naprej nikoli ne zmanjša.
+ Najprej vse bolj strma krivulja, nato premica, nato vse bolj položna krivulja, ki se konča vodoravno.
- Ena sama premica od izhodišča do mize.
~ Premica pomeni stalno hitrost ves čas. Natakar pa na začetku pospešuje in na koncu zavira.
> Naklon $s(t)$ je hitrost: raste (graf postaja strmejši), je stalen (premica), pada do nič (graf se položi in na koncu postane vodoraven).

:::simboli
s | pot | | m
t | čas | | s
v | hitrost | v = \dfrac{\Delta s}{\Delta t} | m/s
\Delta s | sprememba poti v odseku | | m
\Delta t | pretečeni čas odseka | | s
a | pospešek | a = \dfrac{\Delta v}{\Delta t} | m/s^2
\Delta v | sprememba hitrosti | | m/s
v_{\max} | največja hitrost dvigala | | m/s
t_\mathrm{e} | čas vožnje s stalno hitrostjo | | s
:::

<<RACUN
vrednost: 6/4 | 1.5
vrednost: (9-6)/(16-10) | 0.5
vrednost: 1.5*4+0.5*6 | 9
vrednost: 2/4 | 0.5
vrednost: 4*2/2 | 4
vrednost: 6/20 | 0.3
vrednost: (10-6)/(50-30) | 0.2
vrednost: 6+0.2*10 | 8
vrednost: 1.2/2 | 0.6
vrednost: 2*1.2/2+5*1.2+1*1.2/2 | 7.8
vrednost: 8-2-2 | 4
resi: v*(8+4)/2=6 | v | 1
vrednost: 1/2 | 0.5
vrednost: 3*1.5/2+4*1.5+3*1.5/2 | 10.5
vrednost: (8-4)/(30-10) | 0.2
vrednost: 8/30 | 0.27
vrednost: 0.2*30 | 6
vrednost: (0-9)/6 | -1.5
enote: 1.5*m/s*4*s | 6*m
>>
