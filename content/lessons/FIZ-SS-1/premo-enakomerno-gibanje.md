---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nika je tonska tehničarka na koncertu na prostem. Oder ima glavne zvočnike, $102\,\mathrm{m}$ dlje v publiki pa stoji še en stolp zvočnikov za zadnje vrste. Če stolp zaigra hkrati z odrom, poslušalci zadaj slišijo vsak udarec bobna dvakrat: najprej iz stolpa, nato še z odra. Nika mora stolpu nastaviti **zakasnitev**. Za koliko?

Zvok potuje po zraku s stalno hitrostjo, pri okoli $15\,^\circ\mathrm{C}$ približno $340\,\mathrm{m/s}$. Iz osnovne šole poznaš formulo $v = \dfrac{s}{t}$, torej je $t = \dfrac{102\,\mathrm{m}}{340\,\mathrm{m/s}} = 0{,}3\,\mathrm{s}$. Nika nastavi $0{,}3\,\mathrm{s}$ in udarca se zlijeta v enega. V praksi tonski tehniki dodajo še nekaj milisekund: zvok iz stolpa tako pride malo za zvokom z odra in poslušalcu se zdi, da vse prihaja z odra.

Zdaj to znanje nadgradimo: gibanje začnemo **opisovati z grafi**. Graf pove veliko več kot ena številka. Iz njega razbereš, kje je telo ob katerem času, ali miruje, ali se giblje hitro ali počasi in v katero smer. Aplikacija za tek med tekom iz GPS zapisuje, kje si bil ob katerem času; iz takih podatkov lahko narišeš prav tak graf. V Primeru 2 iz njega razberemo hitrost tekačice.

Najpreprostejše gibanje je **premo enakomerno gibanje**. Na njem se naučimo risati in brati grafa $s(t)$ in $v(t)$, ki ju bomo potrebovali pri vseh težjih gibanjih.

## Razlaga

**Nikin zvok, korak za korakom.** Sledimo udarcu bobna od odra proti stolpu. Vsako desetinko sekunde zapišemo, kako daleč od odra je zvok:

| $t\,(\mathrm{s})$ | $s\,(\mathrm{m})$ |
|---|---|
| $0$ | $0$ |
| $0{,}1$ | $34$ |
| $0{,}2$ | $68$ |
| $0{,}3$ | $102$ |

V vsaki desetinki zvok napreduje za enakih $34\,\mathrm{m}$. Ko točke vrišemo v koordinatni sistem s časom na vodoravni osi, ležijo na ravni črti:

:::risba graf
opis: Graf lege zvoka v odvisnosti od časa. Čas od 0 do 0,3 sekunde, lega od 0 do 102 metrov. Točke (0; 0), (0,1; 34), (0,2; 68) in (0,3; 102) ležijo na premici skozi izhodišče.
x: 0 .. 0,3 | 0,1 | t [s]
y: 0 .. 120 | 20 | s [m]
f: 340*x | modra | 0 .. 0,3
točka: 0; 0
točka: 0,1; 34
točka: 0,2; 68
točka: 0,3; 102 | stolp | nad levo
:::

:::premisli
Kako daleč od odra je zvok po $0{,}5\,\mathrm{s}$? Napovej iz vzorca v tabeli, ne iz formule.
---
$170\,\mathrm{m}$. Vsaka desetinka doda $34\,\mathrm{m}$, pet desetink torej $5 \cdot 34\,\mathrm{m}$. Točka leži na isti premici, le dlje desno.
:::

Iz tega enega primera zdaj posplošimo.

**1. Kaj je premo enakomerno gibanje.** Telo se giblje po ravni črti (premo) in v vsakem enakem časovnem intervalu opravi enako dolgo pot (enakomerno). Hitrost je zato ves čas **stalna**.

**2. Hitrost.** Pri tem gibanju je hitrost enaka količniku spremembe lege in časa. **Lega** $s$ je oddaljenost od izhodišča, s predznakom. Če telo začne v izhodišču in se giblje v pozitivno smer, je lega kar prepotovana pot:

$$v = \frac{s}{t}$$

Enota je $\mathrm{m/s}$. Iz formule dobimo tudi pot:

$$s = v \cdot t$$

**3. Začetna lega.** Če telo ne začne v izhodišču, ampak pri $s_0$, je lega ob času $t$:

$$s = s_0 + v \cdot t$$

Večinoma bomo vzeli $s_0 = 0$ in $t$ merimo od začetka gibanja.

**4. Graf $s(t)$ (lega v odvisnosti od časa).** Na vodoravno os nanašamo čas $t$, na navpično lego $s$. Ker je $s = v \cdot t$, je graf **premica skozi izhodišče** (če je $s_0 = 0$).

- Naklon premice je enak hitrosti: $v = \dfrac{\Delta s}{\Delta t}$.
- Strmejša premica pomeni večjo hitrost.
- Vodoravna premica pomeni mirovanje ($v = 0$).

Na sliki je $v = 5\,\mathrm{m/s}$ in $s_0 = 0$. Trikotnik ob premici kaže, da se lega v $4\,\mathrm{s}$ (od $2\,\mathrm{s}$ do $6\,\mathrm{s}$) spremeni za $20\,\mathrm{m}$, torej $v = \dfrac{20\,\mathrm{m}}{4\,\mathrm{s}} = 5\,\mathrm{m/s}$. Hitrost je lahko tudi negativna; zato ima navpična os tudi negativne lege. V aplikaciji pred vsakim premikom napovej, kaj se bo zgodilo:

- Hitrost premikaj od $0$ do $6\,\mathrm{m/s}$. Opazi: navpična stranica trikotnika raste skupaj z naklonom.
- Nastavi $v = -4\,\mathrm{m/s}$. Opazi: premica pada, ker se lega zmanjšuje; telo se giblje v negativno smer, po $8\,\mathrm{s}$ je pri $-32\,\mathrm{m}$.
- Vrni $v = 5\,\mathrm{m/s}$ in spremeni le $s_0$. Opazi: premica se vzporedno premakne navzgor, naklon ostane enak.

:::risba graf
opis: Graf lege s v odvisnosti od časa t za gibanje s = s₀ + v·t. Izbrano je v = {v} m/s in s₀ = {n} m. Trikotnik med t = 2 s in t = 6 s ima vodoravno stranico Δt = 4 s in navpično stranico Δs = {4*v} m.
x: 0 .. 8 | 1 | t [s]
y: -40 .. 80 | 20 | s [m]
drsnik: v | -4 .. 6 | 1 | 5 | hitrost v v metrih na sekundo
drsnik: n | 0 .. 20 | 5 | 0 | začetna lega s₀ v metrih
f: n + v*x | modra debelo
črta: 2; n + 2*v -> 6; n + 2*v -> 6; n + 6*v | oranžna debelo
napis: 0,3; 70 | trikotnik: Δt = 4 s, Δs = {4*v} m | desno | oranžna
točka: 0; n
podnapis: v = {v} m/s in s₀ = {n} m: v vsakih 4 s se lega spremeni za {4*v} m.
:::

**5. Graf $v(t)$ (hitrost v odvisnosti od časa).** Na navpično os nanašamo hitrost. Ker je hitrost stalna, je graf **vodoravna premica** na višini $v$.

:::premisli
Bobnar korakajoče godbe na pihala sredi skladbe za $4\,\mathrm{s}$ obstane na mestu, nato koraka naprej enako hitro kot prej. Kakšen je ta del grafa $s(t)$ in kakšen del grafa $v(t)$?
---
Na $s(t)$ je vodoraven odsek: lega se ne spreminja. Na $v(t)$ črta za $4\,\mathrm{s}$ pade na $0$ in se nato vrne na prejšnjo višino. Navpična skoka sta poenostavitev: v resnici bobnar ustavi in spet pospeši v kratkem, a ne ničelnem času. Vodoravno na $s(t)$ pomeni mirovanje, vodoravno na $v(t)$ pa stalno hitrost.
:::

V simulaciji spodaj, »Premo enakomerno gibanje«, je lega označena z $x$. Preklopi med grafoma $x(t)$ in $v(t)$ in opazuj, da je pri vsaki hitrosti $v(t)$ vodoraven.

**6. Ploščina pod grafom $v(t)$.** Pod vodoravno premico je pravokotnik s stranicama $v$ in $t$. Njegova ploščina je $v \cdot t$. Zato velja:

> Ploščina pod grafom $v(t)$ je enaka spremembi lege; pri gibanju v eno smer je to prepotovana pot.

Pri $v < 0$ leži pravokotnik pod osjo $t$; njegovo ploščino štejemo z minusom in pove spremembo lege v negativno smer.

Na sliki je $v = 3\,\mathrm{m/s}$ in $t = 8\,\mathrm{s}$, zato je ploščina $3 \cdot 8 = 24$, torej $24\,\mathrm{m}$. V aplikaciji premikaj drsnika za hitrost in čas. Opazi: dvojna hitrost ali dvojni čas podvoji ploščino in s tem pot. Grafa se tako dopolnjujeta: naklon $s(t)$ je višina $v(t)$, ploščina pod $v(t)$ pa je sprememba lege na $s(t)$.

:::risba graf
opis: Graf hitrosti v odvisnosti od časa. Hitrost je stalna, v = {v} m/s, zato je graf vodoravna črta. Pod njo je med t = 0 in t = {c} s osenčen pravokotnik s ploščino {v*c} m; to je sprememba lege.
x: 0 .. 11 | 1 | t [s]
y: 0 .. 6 | 1 | v [m/s]
drsnik: v | 0,5 .. 5 | 0,5 | 3 | hitrost v v metrih na sekundo
drsnik: c | 1 .. 10 | 1 | 8 | čas gibanja t v sekundah
pravokotnik: 0; 0 .. c; v | zelena
f: v | modra debelo | 0 .. 10
napis: (c/2 + 5/2 + abs(c/2 - 5/2))/2; v + 0,45 | s = {v*c} m | sredina
podnapis: Ploščina pravokotnika: {v} m/s · {c} s = {v*c} m
:::

**7. Povprečna in trenutna hitrost.** Povprečna hitrost je celotna pot, deljena s celotnim časom. Trenutna hitrost je hitrost v izbranem trenutku, kakršno kaže merilnik hitrosti na kolesu. Pri enakomernem gibanju sta enaki, ker ima premica $s(t)$ povsod enak naklon. Pri pospešenem gibanju se bosta razlikovali.

## Rešeni primeri

### Primer 1 (lažji): izračun poti in risanje grafov

Kolesar se enakomerno vozi s hitrostjo $v = 5\,\mathrm{m/s}$. Koliko poti opravi v $4\,\mathrm{s}$? Sestavi tabelo vrednosti za graf $s(t)$.

**Podatki:** $v = 5\,\mathrm{m/s}$, $t = 4\,\mathrm{s}$, začetek v izhodišču ($s_0 = 0$)
**Iščemo:** pot $s$ in tabelo vrednosti za graf $s(t)$

:::formula
$s = v \cdot t$
:::

**Rešitev:**

1. Gibanje je enakomerno, zato uporabimo $s = v \cdot t$.
2. Vstavimo: $s = 5\,\mathrm{m/s} \cdot 4\,\mathrm{s} = 20\,\mathrm{m}$.
3. Tabela vrednosti (zakaj: za premico zadoščata dve točki, tretja služi za preverjanje):

| $t\,(\mathrm{s})$ | $s\,(\mathrm{m})$ |
|---|---|
| $0$ | $0$ |
| $2$ | $10$ |
| $4$ | $20$ |

4. Točke ležijo na premici skozi izhodišče. Graf $v(t)$ je vodoravna premica pri $5\,\mathrm{m/s}$.
5. Odgovor: kolesar v $4\,\mathrm{s}$ opravi $20\,\mathrm{m}$ poti.

### Primer 2: branje hitrosti iz grafa $s(t)$

Tjaša teče enakomerno ob glasbi iz slušalk. Iz podatkov aplikacije na telefonu narišemo graf $s(t)$ njene lege, merjene od klopi v parku. Aplikacija je začela meriti, ko je bila Tjaša že malo mimo klopi, zato premica ne gre skozi izhodišče. Z grafa odčitamo točki $(2\,\mathrm{s};\ 14\,\mathrm{m})$ in $(6\,\mathrm{s};\ 30\,\mathrm{m})$. Kolikšna je Tjašina hitrost in kje je bila ob $t = 0$?

:::risba graf
opis: Graf lege s v odvisnosti od časa t za Tjašin tek. Premica se začne pri 6 m na navpični osi in gre skozi točki (2; 14) in (6; 30). Med njima je trikotnik z vodoravno stranico Δt = 4 s in navpično stranico Δs = 16 m.
x: 0 .. 8 | 1 | t [s]
y: 0 .. 40 | 10 | s [m]
f: 6 + 4*x | modra debelo | 0 .. 8
črta: 2; 14 -> 6; 14 -> 6; 30 | oranžna debelo
napis: 4; 14 | Δt = 4 s | pod | oranžna
napis: 6; 22 | Δs = 16 m | desno | oranžna
točka: 2; 14 | (2; 14) | nad levo
točka: 6; 30 | (6; 30) | nad levo
točka: 0; 6 | s₀ | desno
:::

**Podatki:** točki na premici grafa $s(t)$: $(2\,\mathrm{s};\ 14\,\mathrm{m})$ in $(6\,\mathrm{s};\ 30\,\mathrm{m})$
**Iščemo:** hitrost $v$ in začetno lego $s_0$

:::formula
$v = \dfrac{\Delta s}{\Delta t}$, $\quad s = s_0 + v\,t$
:::

**Rešitev:**

1. Hitrost je naklon premice, zato potrebujemo dve točki: $\Delta s = 30\,\mathrm{m} - 14\,\mathrm{m} = 16\,\mathrm{m}$, $\Delta t = 6\,\mathrm{s} - 2\,\mathrm{s} = 4\,\mathrm{s}$.
2. $v = \dfrac{16\,\mathrm{m}}{4\,\mathrm{s}} = 4\,\mathrm{m/s}$.
3. Past: $\dfrac{30\,\mathrm{m}}{6\,\mathrm{s}} = 5\,\mathrm{m/s}$ je napačno, ker premica ne gre skozi izhodišče in $30\,\mathrm{m}$ ni pot, pretečena v $6\,\mathrm{s}$.
4. Začetna lega: od točke $(2\,\mathrm{s};\ 14\,\mathrm{m})$ gremo $2\,\mathrm{s}$ nazaj, lega se zmanjša za $4\,\mathrm{m/s} \cdot 2\,\mathrm{s} = 8\,\mathrm{m}$. Torej $s_0 = 14\,\mathrm{m} - 8\,\mathrm{m} = 6\,\mathrm{m}$.
5. Enačba gibanja: $s = 6\,\mathrm{m} + 4\,\mathrm{m/s} \cdot t$. Preverimo pri $t = 6\,\mathrm{s}$: $6 + 4 \cdot 6 = 30\,\mathrm{m}$. ✓
6. Odgovor: Tjaša teče s hitrostjo $4\,\mathrm{m/s}$; ob $t = 0$ je bila $6\,\mathrm{m}$ od klopi.

### Primer 3 (težji): dve telesi z različnima začetnima legama

Pešec je ob $t = 0$ na mestu $s_0 = 20\,\mathrm{m}$ in hodi s hitrostjo $1{,}5\,\mathrm{m/s}$ v pozitivno smer. Kolesar začne ob $t = 0$ v izhodišču ($s_0 = 0$) in se vozi s hitrostjo $5\,\mathrm{m/s}$ v isto smer. Kdaj kolesar dohiti pešca in kje? Kdo je spredaj ob $t = 3\,\mathrm{s}$ in za koliko?

**Podatki:** pešec: $s_{0P} = 20\,\mathrm{m}$, $v_P = 1{,}5\,\mathrm{m/s}$; kolesar: $s_{0K} = 0$, $v_K = 5\,\mathrm{m/s}$; oba začneta ob $t = 0$ in se gibljeta v isto (pozitivno) smer
**Iščemo:** čas $t$ in mesto $s$, kjer kolesar dohiti pešca; razdaljo med njima ob $t = 3\,\mathrm{s}$

:::formula
Enačba gibanja za vsako telo: $s = s_0 + v\,t$; dohitevanje pomeni $s_K = s_P$
:::

**Rešitev:**

1. **Enačbi gibanja** (zakaj: vsako telo ima svojo lego kot funkcijo časa):
   - pešec: $s_P = 20 + 1{,}5\,t$,
   - kolesar: $s_K = 5\,t$.
2. **Dohitevanje** pomeni, da sta na istem mestu: $s_K = s_P$.
3. $5\,t = 20 + 1{,}5\,t$, torej $3{,}5\,t = 20$. Zakaj $3{,}5$: vsako sekundo kolesar naredi $3{,}5\,\mathrm{m}$ več kot pešec, zato se prednost $20\,\mathrm{m}$ zapira s hitrostjo $3{,}5\,\mathrm{m/s}$.
4. $t = \dfrac{20}{3{,}5} \approx 5{,}71\,\mathrm{s}$.
5. Mesto: $s_K = 5 \cdot 5{,}71 \approx 28{,}6\,\mathrm{m}$.
6. **Preverimo** s pešcem: $20 + 1{,}5 \cdot 5{,}71 = 20 + 8{,}57 \approx 28{,}6\,\mathrm{m}$. ✓
7. **Na grafu $s(t)$** se premici sekata v tej točki. Kolesarjeva premica je strmejša, premica pešca pa se začne višje, pri $20\,\mathrm{m}$. Pred presečiščem je pešec pred kolesarjem, za njim kolesar pred pešcem.

:::risba graf
opis: Grafa lege v odvisnosti od časa za pešca in kolesarja. Premica pešca se začne pri 20 m in se položno dviga do 32 m pri 8 s. Premica kolesarja gre iz izhodišča strmo do 40 m pri 8 s. Premici se sekata pri t približno 5,7 s in s približno 28,6 m.
x: 0 .. 8 | 1 | t [s]
y: 0 .. 40 | 10 | s [m]
f: 20 + 1,5*x | oranžna | 0 .. 8
f: 5*x | modra debelo | 0 .. 8
napis: 1; 21,5 | pešec | nad | oranžna
napis: 2; 5 | kolesar | desno | modra
črta: 5,714; 0 -> 5,714; 28,57 | siva črtkano
točka: 5,714; 28,57 | srečanje | desno pod
črta: 3; 15 -> 3; 24,5 | oranžna črtkano
napis: 3; 19,75 | 9,5 m | levo | oranžna
:::

8. **Ob $t = 3\,\mathrm{s}$** je presečišče še desno, zato je spredaj pešec. Na grafu je premica pešca pri $s_P = 20 + 1{,}5 \cdot 3 = 24{,}5\,\mathrm{m}$, kolesarjeva pa pri $s_K = 5 \cdot 3 = 15\,\mathrm{m}$. Razdalja je navpična razlika premic: $24{,}5\,\mathrm{m} - 15\,\mathrm{m} = 9{,}5\,\mathrm{m}$.
9. Odgovor: kolesar dohiti pešca po približno $5{,}71\,\mathrm{s}$, približno $28{,}6\,\mathrm{m}$ od izhodišča. Ob $3\,\mathrm{s}$ je pešec $9{,}5\,\mathrm{m}$ pred kolesarjem.

### Primer 4 – zdaj ti: kako daleč je oder?

Na koncertu vidiš, kako bobnar udari po činelah, zvok pa slišiš $0{,}25\,\mathrm{s}$ pozneje. Svetloba pride do tebe skoraj v trenutku. Kako daleč od odra stojiš? Hitrost zvoka je $340\,\mathrm{m/s}$.

**Podatki:** $v = 340\,\mathrm{m/s}$, $t = 0{,}25\,\mathrm{s}$
**Iščemo:** razdaljo $s$ do odra

:::formula
$s = v \cdot t$
:::

**Rešitev:**

1. Zvok potuje s stalno hitrostjo, zato gre za premo enakomerno gibanje.
2. Zakasnitev $0{,}25\,\mathrm{s}$ je ravno čas, ki ga zvok porabi od odra do tebe, ker svetloba zamude skoraj nima.
3. Vstavi in izračunaj sam, nato preveri:

:::premisli
Koliko je $s = 340\,\mathrm{m/s} \cdot 0{,}25\,\mathrm{s}$?
---
$s = 85\,\mathrm{m}$. Stojiš $85\,\mathrm{m}$ od odra, malo bližje kot Nikin stolp zvočnikov.
:::

## Pogoste napake

- **Graf $s(t)$ zamenjamo s sliko poti.** Napačno: »Premica gre navzgor, torej se telo vzpenja.« Graf ni zemljevid, na navpični osi je lega, ne višina. Popravek: naraščajoča premica pomeni, da lega s časom raste, telo pa se lahko giblje po ravnih tleh.
- **Vodoravna črta na $s(t)$ pomeni stalno hitrost.** Napačno: »Črta je ravna in enakomerna, torej se telo giblje enakomerno.« Na $s(t)$ vodoravna črta pomeni, da se lega ne spreminja. Popravek: vodoravno na $s(t)$ je mirovanje ($v = 0$), vodoravno na $v(t)$ je stalna hitrost.
- **Hitrost iz ene točke.** Napačno: premica gre skozi $(20\,\mathrm{s};\ 70\,\mathrm{m})$, torej je $v = \dfrac{70}{20}$. To velja le, če je $s_0 = 0$; sicer pozabiš, da telo ni začelo v izhodišču. Popravek: vzemi dve točki in izračunaj $v = \dfrac{\Delta s}{\Delta t}$. Enako pri ploščini pod $v(t)$: širina pravokotnika je $\Delta t$, ne končni čas.
- **Ploščina pod napačnim grafom.** Napačno: »Pot je ploščina pod grafom $s(t)$.« Ploščina ima enoto produkta osi; pri $v(t)$ je to $\mathrm{m/s} \cdot \mathrm{s} = \mathrm{m}$, pri $s(t)$ pa $\mathrm{m} \cdot \mathrm{s}$, kar ni pot. Popravek: pot je ploščina pod $v(t)$, na $s(t)$ pa je sprememba lege razlika dveh odčitkov na navpični osi.
- **Mešanje enot.** Napačno: hitrost v $\mathrm{m/s}$ pomnožiš s časom v minutah. Rezultat je $60$-krat premajhen. Popravek: pred računom pretvori, $1\,\mathrm{min} = 60\,\mathrm{s}$.

## Povzetek

- Premo enakomerno gibanje: ravna črta, stalna hitrost.
- $v = \dfrac{s}{t}$, $s = v t$, z začetno lego $s = s_0 + v t$.
- Graf $s(t)$ je premica, njen naklon je hitrost. Strmejša premica pomeni večjo hitrost, vodoravna pomeni mirovanje.
- Graf $v(t)$ je vodoravna premica.
- Ploščina pod grafom $v(t)$ je sprememba lege; pri gibanju v eno smer je to pot.
- Srečanje dveh teles: izenačimo njuni enačbi gibanja oziroma poiščemo presečišče grafov.

## Drugače: Z analogijo

Premo enakomerno gibanje je kot glasba ob **metronomu**. Metronom tiktaka v stalnem tempu, glasbenik pa ob vsakem tiku naredi en enako dolg korak naprej.

- **Tempo** (koliko korakov na sekundo) ustreza hitrosti. Hitrejši tempo pomeni več poti v isti sekundi, zato strmejšo premico na $s(t)$.
- **Stalni tempo** je vodoravna črta na $v(t)$: hitrost se med skladbo ne spreminja.
- **Število narejenih korakov** ustreza poti: tempo krat trajanje, tako kot $s = v \cdot t$.
- **Pavza**, med katero glasbenik stoji, je vodoravni odsek na $s(t)$.

Če dirigent sredi skladbe pospeši tempo, gibanje ni več enakomerno in graf $s(t)$ ni več ena sama premica, ampak se nagne strmeje.

## Drugače: Korak za korakom s številkami

**Naloga:** Gibanje je podano s tabelo. Ali je enakomerno? Kolikšna je hitrost?

| $t\,(\mathrm{s})$ | $s\,(\mathrm{m})$ |
|---|---|
| $0$ | $10$ |
| $2$ | $16$ |
| $4$ | $22$ |
| $6$ | $28$ |

1. **Izračunaj spremembe lege** v enakih časovnih korakih: $16 - 10 = 6$, $22 - 16 = 6$, $28 - 22 = 6$ (vsakič v $2\,\mathrm{s}$).
2. **Primerjaj.** Spremembe so enake, zato je gibanje enakomerno. Če bi se razlikovale, ne bi bilo.
3. **Hitrost:** $v = \dfrac{6\,\mathrm{m}}{2\,\mathrm{s}} = 3\,\mathrm{m/s}$.
4. **Začetna lega:** ob $t = 0$ je $s_0 = 10\,\mathrm{m}$.
5. **Enačba:** $s = 10 + 3\,t$.
6. **Preveri** pri $t = 6\,\mathrm{s}$: $10 + 3 \cdot 6 = 28\,\mathrm{m}$. ✓
7. **Graf $s(t)$:** premica, ki se začne pri $10\,\mathrm{m}$ na navpični osi. **Graf $v(t)$:** vodoravna črta pri $3\,\mathrm{m/s}$.

## Drugače: Bolj natančno

Hitrost telesa je v splošnem definirana kot sprememba lege v času:

$$v = \frac{\Delta s}{\Delta t} = \frac{s_2 - s_1}{t_2 - t_1}$$

Premo enakomerno gibanje je gibanje, pri katerem je ta količnik **enak za vsak izbor** $t_1$ in $t_2$. Če vzamemo $t_1 = 0$ (lega $s_0$) in poljuben $t_2 = t$ (lega $s$), dobimo:

$$v = \frac{s - s_0}{t} \quad\Rightarrow\quad s = s_0 + v\,t$$

To je enačba premice $y = k x + n$, kjer je $k = v$ (naklon) in $n = s_0$ (presečišče z navpično osjo). Zato je graf $s(t)$ res premica.

Če je $v < 0$, premica pada. Telo se giblje v negativno smer. Hitrost ima torej predznak, ki pove smer gibanja glede na izbrano pozitivno smer. Pot (dolžina prehojene poti) pa se ne more zmanjševati.

Ploščina pod $v(t)$: če je $v$ stalna, je lik med grafom, osjo $t$ in navpičnicama pri $0$ in $t$ pravokotnik s ploščino $v t$, kar je ravno $s - s_0$ (sprememba lege).

## Preveri se

? Telo se giblje premo enakomerno s hitrostjo $2\,\mathrm{m/s}$ in začne v izhodišču. Trije opisi se ujemajo s tem gibanjem, eden ne. Kateri je vsiljivec?
- Graf $s(t)$ gre skozi točko $(5\,\mathrm{s};\ 10\,\mathrm{m})$.
~ Ta opis se ujema: $s = 2\,\mathrm{m/s} \cdot 5\,\mathrm{s} = 10\,\mathrm{m}$.
- Graf $v(t)$ je vodoravna črta pri $2\,\mathrm{m/s}$.
~ Ta opis se ujema: hitrost je stalna, zato je $v(t)$ vodoraven. Vodoravno na $v(t)$ ne pomeni mirovanja.
- Ploščina pod grafom $v(t)$ od $0$ do $3\,\mathrm{s}$ je $6\,\mathrm{m}$.
~ Ta opis se ujema: pravokotnik $2\,\mathrm{m/s} \cdot 3\,\mathrm{s} = 6\,\mathrm{m}$ je pot v treh sekundah.
+ Graf $v(t)$ je naraščajoča premica skozi izhodišče.
> Naraščajoča premica skozi izhodišče je oblika grafa $s(t)$. Na $v(t)$ bi pomenila, da hitrost raste, pri enakomernem gibanju pa je stalna.

? Bobnar korakajoče godbe začne hoditi dvakrat hitreje kot prej. Kaj se od tega trenutka naprej zgodi z grafoma?
+ Od tega trenutka je premica $s(t)$ dvakrat strmejša, črta $v(t)$ pa se dvigne na dvakratno višino.
- Obe črti postaneta dvakrat strmejši.
~ Graf $v(t)$ ostane vodoraven, ker je nova hitrost spet stalna. Strmejši je samo $s(t)$.
- Premica $s(t)$ se le premakne navzgor, njen naklon ostane enak.
~ Premik navzgor pomeni drugačno začetno lego $s_0$, ne večje hitrosti. Hitrost je naklon.
- Nič se ne spremeni, ker je gibanje še vedno enakomerno.
~ Enakomerno ostane, a z drugo hitrostjo: naklon $s(t)$ in višina $v(t)$ sta prav hitrost.
- Premica $s(t)$ postane strmejša, ker bobnar zdaj hodi navkreber.
~ Graf $s(t)$ ni slika poti: na navpični osi je lega, ne višina. Strmejša premica pomeni večjo hitrost.
> Naklon $s(t)$ je hitrost, višina črte $v(t)$ tudi. Dvojna hitrost podvoji oboje. Oba ostaneta ravni črti: $s(t)$ se v tem trenutku zlomi navzgor, $v(t)$ skoči višje.

? Graf kaže lego trobentača, ki enakomerno koraka ob paradi. Z grafa odčitaj njegovo hitrost.
:::risba graf
opis: Graf lege s v metrih v odvisnosti od časa t v sekundah. Premica se začne v točki (0; 10) in gre enakomerno navzgor do točke (8; 22). Mreža ima razdelke po 1 s in po 2 m.
x: 0 .. 8 | 1 | t [s]
y: 0 .. 24 | 2 | s [m]
f: 10 + 1,5*x | modra debelo | 0 .. 8
točka: 0; 10
točka: 8; 22
:::
= 1,5 m/s | 0,05
~ 2,75 | Delil si $22\,\mathrm{m}$ z $8\,\mathrm{s}$, a premica se ne začne v izhodišču. Vzemi $\Delta s = 22\,\mathrm{m} - 10\,\mathrm{m}$.
~ 1,25 | Delil si $10\,\mathrm{m}$ z $8\,\mathrm{s}$: začetna lega $10\,\mathrm{m}$ ni sprememba lege.
~ 0,67 | Delil si čas s spremembo lege ($8 : 12$). Hitrost je $\dfrac{\Delta s}{\Delta t}$, ne obratno.
> V $8\,\mathrm{s}$ se lega spremeni z $10\,\mathrm{m}$ na $22\,\mathrm{m}$, torej $v = \dfrac{12\,\mathrm{m}}{8\,\mathrm{s}} = 1{,}5\,\mathrm{m/s}$.

? Graf kaže hitrost kolesarke. Luka računa, koliko poti opravi od $2\,\mathrm{s}$ do $7\,\mathrm{s}$: (1) z grafa odčita $v = 4\,\mathrm{m/s}$; (2) pot je ploščina pod grafom $v(t)$; (3) širina pravokotnika je $7\,\mathrm{s}$; (4) $s = 4\,\mathrm{m/s} \cdot 7\,\mathrm{s} = 28\,\mathrm{m}$. Kateri korak je napačen?
:::risba graf
opis: Graf hitrosti v odvisnosti od časa. Vodoravna črta pri 4 m/s od 0 do 8 s. Med t = 2 s in t = 7 s je pod črto osenčen pravokotnik.
x: 0 .. 8 | 1 | t [s]
y: 0 .. 5 | 1 | v [m/s]
pravokotnik: 2; 0 .. 7; 4 | zelena
f: 4 | modra debelo | 0 .. 8
:::
- Korak (1)
~ Črta je res pri $4\,\mathrm{m/s}$.
- Korak (2)
~ Ploščina pod $v(t)$ je res pot (kolesarka vozi v eno smer).
+ Korak (3)
- Noben, račun je pravilen.
~ $28\,\mathrm{m}$ je pot od $0$ do $7\,\mathrm{s}$. Pravokotnik se začne pri $2\,\mathrm{s}$.
> Širina pravokotnika je $\Delta t = 7\,\mathrm{s} - 2\,\mathrm{s} = 5\,\mathrm{s}$, zato $s = 4\,\mathrm{m/s} \cdot 5\,\mathrm{s} = 20\,\mathrm{m}$.

? Godba na pihala na paradi koraka enakomerno s hitrostjo $1{,}2\,\mathrm{m/s}$. Koliko metrov prehodi v $5\,\mathrm{min}$?
= 360 m | 1
~ 6 | Pomnožil si z minutami: $1{,}2 \cdot 5$. Hitrost je v $\mathrm{m/s}$, zato najprej pretvori $5\,\mathrm{min} = 300\,\mathrm{s}$.
~ 250 | To je $300 : 1{,}2$. Pri stalni hitrosti pot dobiš z množenjem: $s = v \cdot t$.
~ 0,24 | To je $1{,}2 : 5$. Hitrost deljena s časom ni pot.
> Najprej enote: $5\,\mathrm{min} = 300\,\mathrm{s}$. Nato $s = 1{,}2\,\mathrm{m/s} \cdot 300\,\mathrm{s} = 360\,\mathrm{m}$.

? Kolesar dohiteva pešca. Razvrsti korake, s katerimi izračunaš, kdaj in kje ga dohiti.
1. Za vsako telo zapiši enačbo gibanja $s = s_0 + v\,t$.
2. Izenači legi obeh teles.
3. Iz dobljene enačbe izrazi čas $t$.
4. Čas vstavi v eno enačbo gibanja in izračunaj mesto srečanja.
5. Preveri mesto z enačbo drugega telesa.
> Najprej potrebuješ obe enačbi, nato pogoj srečanja (enaki legi), iz njega čas, iz časa mesto in na koncu preverjanje.

<<RACUN
vrednost: 102/340 | 0.3
vrednost: 5*34 | 170
vrednost: 5*4 | 20
vrednost: (30-14)/(6-2) | 4
vrednost: 14-4*2 | 6
vrednost: 6+4*6 | 30
resi: 5*t=20+1.5*t | t | 40/7
vrednost: 20+1.5*3 | 24.5
vrednost: 24.5-5*3 | 9.5
vrednost: 20/3.5 | 5.71
vrednost: 5*40/7 | 28.6
vrednost: 340*0.25 | 85
vrednost: 3*8 | 24
vrednost: (16-10)/2 | 3
vrednost: 10+3*6 | 28
vrednost: 2*5 | 10
vrednost: (22-10)/8 | 1.5
vrednost: 4*(7-2) | 20
vrednost: 1.2*5*60 | 360
enote: 1.2*m/s*300*s | 360*m
>>

:::simboli
v | hitrost | v = \dfrac{\Delta s}{\Delta t} | m/s
s | lega (oddaljenost od izhodišča, s predznakom) | s = s_0 + v\,t | m
s_0 | začetna lega | | m | pogosto vzamemo s₀ = 0
t | čas | | s
s_1, s_2 | legi ob časih t₁ in t₂ | | m
t_1, t_2 | časa dveh opazovanj | | s
s_K | lega kolesarja | | m
s_P | lega pešca | | m
s_{0P}, s_{0K} | začetni legi pešca in kolesarja | | m
v_P, v_K | hitrosti pešca in kolesarja | | m/s
:::
