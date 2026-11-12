---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Po poletni nevihti so na strehi avtomobila pred blokom vdolbine. Isti avto je prejšnji teden ves dan stal na dežju, pa se mu ni zgodilo nič. Velika dežna kapljica s premerom okoli $4{,}5\,\mathrm{mm}$ ima maso okoli $0{,}05\,\mathrm{g}$ in pade s hitrostjo okoli $9\,\mathrm{m/s}$. Zrno toče s premerom okoli $3{,}5\,\mathrm{cm}$ ima maso okoli $20\,\mathrm{g}$ in prileti s hitrostjo okoli $25\,\mathrm{m/s}$.

Masa toče je $400$-krat večja, hitrost le slabo $3$-krat. Kolikokrat močneje torej udari zrno toče? Vdolbino naredi sila, zato bomo morali ugotoviti tudi, od česa je odvisna. Potrebujemo količino, ki združi oboje. Imenuje se **gibalna količina**. Z njo razložiš, zakaj sneg ublaži padec, kako hitro leti sokol, ko ujame goloba, in kako se gibljeta telesi po trku.

## Razlaga

**1. Kaj odloča, kako težko je telo ustaviti.** Po gladkem zaledenelem ribniku drsijo kosi ledu. Trenje zanemarimo. Vsakega ustavimo z roko, ki nanj deluje s stalno silo $3\,\mathrm{N}$. Čas ustavljanja izračunamo iz $a = \dfrac{F}{m}$ in $t = \dfrac{v}{a}$:

| Kos | $m$ [kg] | $v$ [m/s] | $t$ [s] |
|---|---|---|---|
| A | $0{,}5$ | $6$ | $1$ |
| B | $1$ | $3$ | $1$ |
| C | $1{,}5$ | $2$ | $1$ |
| D | $1{,}5$ | $4$ | $2$ |

Kosi A, B in C imajo zelo različne mase in hitrosti, pa se ustavijo v enakem času. Preden bereš naprej, poišči, kaj jim je skupno.

Zmnožek $m \cdot v$ je pri vseh treh enak, $3\,\mathrm{kg\,m/s}$. Kos D ima zmnožek dvakrat večji in potrebuje dvakrat več časa.

:::premisli
Kos ledu z maso $2\,\mathrm{kg}$ drsi s hitrostjo $4{,}5\,\mathrm{m/s}$. Koliko časa ga ustavljamo z isto silo $3\,\mathrm{N}$? Napovej brez formule za pospešek.
---
$3\,\mathrm{s}$. Zmnožek $m \cdot v$ je $9\,\mathrm{kg\,m/s}$, kar je trikrat več kot pri kosih A, B in C, zato traja ustavljanje trikrat dlje.
:::

**2. Gibalna količina.** Zmnožek mase in hitrosti imenujemo **gibalna količina** $\vec p$ (v nekaterih učbenikih $\vec G$):

$$\vec p = m\,\vec v$$

Je vektor in kaže v smer hitrosti. Enota je $\mathrm{kg\,m/s}$, kar je isto kot $\mathrm{N\,s}$. Pri gibanju po premici izberemo pozitivno smer. Gibalna količina v nasprotni smeri je negativna.

**3. Izrek o gibalni količini.** Iz tabele sledi $F \cdot t = m \cdot v$. Ni naključje. Po 2. Newtonovem zakonu je rezultanta sil $F = m\,a$ (prej $F_\mathrm{r}$, tu krajše $F$), pospešek pa je $a = \dfrac{\Delta v}{\Delta t}$. Torej $F\,\Delta t = m\,\Delta v$. Na desni je sprememba gibalne količine $\Delta p$. Na levi je zmnožek sile in časa delovanja, ki ga imenujemo **sunek sile**. Izrek o gibalni količini pravi:

$$F\,\Delta t = \Delta p$$

Sunek rezultante sil je enak spremembi gibalne količine telesa, $\Delta p = p' - p$ (črtica pomeni »po«).

Posledica je pomembna. Kadar mora telo izgubiti določeno gibalno količino, je sila tem manjša, čim daljši je čas ustavljanja. Kuna z maso $1{,}5\,\mathrm{kg}$ skoči z veje in pristane s hitrostjo $4\,\mathrm{m/s}$. Izgubiti mora gibalno količino $6\,\mathrm{N\,s}$. S togimi nogami se ustavi v $0{,}05\,\mathrm{s}$, z upogibanjem nog v $0{,}2\,\mathrm{s}$. Povprečna rezultanta sil nanjo je $F = \dfrac{\Delta p}{\Delta t}$: s togimi nogami $120\,\mathrm{N}$, z upognjenimi le $30\,\mathrm{N}$.

:::risba graf
opis: Graf sile v odvisnosti od časa pri pristanku kune. Pravokotnik s črtkano obrobo: toge noge, sila 120 N, čas 0,05 s. Pravokotnik s polno obrobo: ustavljanje traja {d:.2} s, sila je {6/d:.0} N. Siva krivulja z napisom F·Δt = 6 N s povezuje oglišča vseh pravokotnikov s ploščino 6 N s. V aplikaciji se čas ustavljanja spreminja z drsnikom.
x: 0 .. 0,45 | 0,05 | Δt [s]
y: 0 .. 140 | 20 | F [N]
drsnik: d | 0,05 .. 0,4 | 0,01 | 0,2 | čas ustavljanja v sekundah
f: 6/x | siva | 0,045 .. 0,4
pravokotnik: 0; 0 .. 0,05; 120 | modra črtkano
pravokotnik: 0; 0 .. d; 6/d | oranžna
napis: 0,3; 36 | F·Δt = 6 N s | desno
točka: d; 6/d | {6/d:.0} N | nad desno | oranžna
podnapis: Ploščina je sunek sile. Črtkano, toge noge: 0,05 s · 120 N = 6 N s. Polna obroba: {d:.2} s · {6/d:.0} N = 6 N s.
:::

Ploščina pravokotnika je sunek sile. V aplikaciji premikaj drsnik »čas ustavljanja«. Pravokotnik s polno obrobo se razteza v desno in hkrati znižuje, njegovo oglišče drsi po sivi krivulji z napisom $F \cdot \Delta t = 6\,\mathrm{N\,s}$. Ploščina ostane $6\,\mathrm{N\,s}$, sila pa pada: pri $0{,}1\,\mathrm{s}$ je $60\,\mathrm{N}$, pri $0{,}4\,\mathrm{s}$ le še $15\,\mathrm{N}$. Natisnjena slika kaže čas $0{,}2\,\mathrm{s}$: sila je tam štirikrat manjša kot pri togih nogah. Enako deluje debela snežna odeja, kup listja ali čelada.

Tudi kadar se sila med trkom spreminja, je sunek sile enak ploščini pod grafom $F(t)$; $F$ v izreku je potem povprečna sila.

**4. Trki.** Dva kosa ledu trčita na gladkem ribniku. Izmerimo gibalno količino vsakega pred trkom in po njem. V vsaki celici sta $p_1$; $p_2$ v $\mathrm{kg\,m/s}$, desno je pozitivno:

| Trk | pred | po |
|---|---|---|
| A: $1\,\mathrm{kg}$ in $1\,\mathrm{kg}$, odskočita | $3$; $-1$ | $-1$; $3$ |
| B: $3\,\mathrm{kg}$ in $1\,\mathrm{kg}$, odskočita | $6$; $0$ | $3$; $3$ |
| C: $2\,\mathrm{kg}$ in $2\,\mathrm{kg}$, sprimeta se | $8$; $-2$ | $3$; $3$ |

Gibalna količina posameznega kosa se pri trku spremeni. Seštej pa obe števili v vsaki celici: v vsaki vrstici je vsota pred trkom enaka vsoti po njem ($2$; $6$; $6$).

Zakaj? Med trkom kosa delujeta drug na drugega z enako velikima, nasprotno usmerjenima silama (3. Newtonov zakon). Sili delujeta enako dolgo, zato sta sunka nasprotno enaka. Kar en kos gibalne količine pridobi, drugi izgubi. To je **zakon o ohranitvi gibalne količine**: če je vsota zunanjih sil na sistem teles nič (to so sile okolice, na primer trenje ali upor), se skupna gibalna količina ne spremeni.

$$p_1 + p_2 = p_1' + p_2'$$

Pri **prožnem trku** se telesi odbijeta tako, da se po trku razmikata enako hitro, kot sta se pred njim približevala. V vrstici B imata kosa pred trkom hitrosti $2$ in $0\,\mathrm{m/s}$, po njem $1$ in $3\,\mathrm{m/s}$: približujeta in razmikata se z $2\,\mathrm{m/s}$. Pri **popolnoma neprožnem trku** se telesi sprimeta in nadaljujeta s skupno hitrostjo $v'$:

$$m_1 v_1 + m_2 v_2 = (m_1 + m_2)\,v'$$

Resnični trki so večinoma nekje vmes: zrno toče se od strehe odbije, a počasneje, kot je priletelo. Tudi takim trkom pravimo neprožni. Zakon o ohranitvi gibalne količine velja pri vseh vrstah trkov, prožnih in neprožnih, dokler je vsota zunanjih sil na sistem nič. Pri toči in avtu ni: tla držijo avto, zato se njuna skupna gibalna količina ne ohrani.

V simulaciji »Trki in gibalna količina« (za rešenimi primeri) nastavi $m_1 = 3\,\mathrm{kg}$, $v_1 = 2\,\mathrm{m/s}$, $m_2 = 1\,\mathrm{kg}$ in $v_2 = 0$. Zaženi prožni trk, nato še neprožnega. Opazuj stolpec »skupaj«: pred trkom in po njem je enako visok, čeprav se stolpca $p_1$ in $p_2$ močno spremenita. Vozička v simulaciji se gibljeta kot kosa ledu na gladkem ribniku.

:::premisli
Dva enaka kosa ledu drsita drug proti drugemu, vsak s hitrostjo $2\,\mathrm{m/s}$. Ob trku se sprimeta. Kako se gibljeta potem?
---
Obstaneta na mestu. Gibalni količini sta nasprotno enaki, zato je skupna gibalna količina nič že pred trkom. Nič mora ostati tudi po njem, zato je $v' = 0$.
:::

Kaj pa, ko se gibalni količini ne izničita? Graf kaže hitrosti kosov ledu pri popolnoma neprožnem trku. Kos 1 ima maso $2\,\mathrm{kg}$ in hitrost $4\,\mathrm{m/s}$. Kos 2 ima maso $m$ in hitrost $u$; na sliki sta $m = 2\,\mathrm{kg}$ in $u = -1\,\mathrm{m/s}$, kot v trku C. Ob času $1\,\mathrm{s}$ se kosa sprimeta. Skupna hitrost je $v' = \dfrac{8 + m\,u}{2 + m}$, tu $1{,}5\,\mathrm{m/s}$.

:::risba graf
opis: Graf hitrosti v odvisnosti od časa pri popolnoma neprožnem trku dveh kosov ledu. Kos 1 (2 kg) ima pred trkom hitrost 4 m/s, kos 2 ({m} kg) hitrost {u} m/s. Ob času 1 s se sprimeta, potem imata skupno hitrost {(8+m*u)/(2+m):.2} m/s. V aplikaciji se masa in hitrost kosa 2 spreminjata z drsnikoma.
x: 0 .. 2 | 0,5 | t [s]
y: -5 .. 6 | 1 | v [m/s]
drsnik: m | 0,5 .. 8 | 0,5 | 2 | masa kosa 2 v kilogramih
drsnik: u | -4 .. 3,5 | 0,5 | -1 | hitrost kosa 2 v metrih na sekundo
črta: 1; -5 -> 1; 6 | siva črtkano
črta: 0; 4 -> 1; 4 | modra debelo
črta: 0; u -> 1; u | oranžna debelo
črta: 1; (8+m*u)/(2+m) -> 2; (8+m*u)/(2+m) | zelena debelo
napis: 0,5; 4 | kos 1 | nad
napis: 0,5; u | kos 2 | pod
napis: 1,5; (8+m*u)/(2+m) | skupaj | nad
napis: 1; 6 | trk | desno
podnapis: Pred trkom: 8,0 + ({m*u:.1}) = {8+m*u:.1} kg m/s. Po trku: {2+m:.1} kg · {(8+m*u)/(2+m):.2} m/s = {8+m*u:.1} kg m/s.
:::

V aplikaciji najprej spreminjaj samo maso kosa 2, na primer $m = 0{,}5\,\mathrm{kg}$ in nato $m = 8\,\mathrm{kg}$. Opazi, da je skupna hitrost vedno med hitrostma obeh kosov in bližje hitrosti težjega. Nato nastavi $m = 2\,\mathrm{kg}$ in $u = -4\,\mathrm{m/s}$: gibalni količini sta $8$ in $-8\,\mathrm{kg\,m/s}$, zato kosa po trku obstaneta. Drsnik za $u$ se ustavi pri $3{,}5\,\mathrm{m/s}$: pri $u = 4\,\mathrm{m/s}$ bi se kosa gibala enako hitro in se nikoli ne bi dotaknila. Podnapis pod sliko pri vsaki nastavitvi pokaže, da je vsota pred trkom enaka gibalni količini po njem.

## Rešeni primeri

### Primer 1: kapljica ali toča

Dežna kapljica z maso $0{,}05\,\mathrm{g}$ pade s hitrostjo $9\,\mathrm{m/s}$, zrno toče z maso $20\,\mathrm{g}$ s hitrostjo $25\,\mathrm{m/s}$. Kolikšni sta njuni gibalni količini in kolikokrat večja je gibalna količina toče?

**Podatki:** $m_\mathrm{k} = 0{,}05\,\mathrm{g}$, $v_\mathrm{k} = 9\,\mathrm{m/s}$, $m_\mathrm{t} = 20\,\mathrm{g}$, $v_\mathrm{t} = 25\,\mathrm{m/s}$
**Iščemo:** gibalni količini $p_\mathrm{k}$ in $p_\mathrm{t}$ ter njuno razmerje

:::formula
$p = m\,v$
:::

**Rešitev:**

1. Maso pretvorimo v kilograme, ker je enota $\mathrm{kg\,m/s}$: $m_\mathrm{k} = 0{,}00005\,\mathrm{kg}$, $m_\mathrm{t} = 0{,}02\,\mathrm{kg}$.
2. Kapljica: $p_\mathrm{k} = 0{,}00005 \cdot 9 = 0{,}00045\,\mathrm{kg\,m/s}$.
3. Toča: $p_\mathrm{t} = 0{,}02 \cdot 25 = 0{,}5\,\mathrm{kg\,m/s}$.
4. Razmerje: $\dfrac{0{,}5}{0{,}00045} \approx 1100$.
5. Odgovor: gibalna količina zrna toče je približno $1100$-krat večja od gibalne količine kapljice. Vdolbino naredi sila, ta pa je $\dfrac{\Delta p}{\Delta t}$: le če se obe ustavita v enakem času, je tudi sila na pločevino toliko večja.

### Primer 2: toča se odbije od strehe

Zrno toče z maso $20\,\mathrm{g}$ pade na streho avtomobila s hitrostjo $25\,\mathrm{m/s}$ in se odbije navzgor s hitrostjo $5\,\mathrm{m/s}$. Trk traja $0{,}002\,\mathrm{s}$. S kolikšno povprečno silo deluje streha na zrno? Težo zrna zanemarimo, ker je le okoli $0{,}2\,\mathrm{N}$.

**Podatki:** $m = 0{,}02\,\mathrm{kg}$, $v = -25\,\mathrm{m/s}$ (navzdol), $v' = 5\,\mathrm{m/s}$ (navzgor), $\Delta t = 0{,}002\,\mathrm{s}$
**Iščemo:** povprečno silo $F$

:::formula
$F\,\Delta t = \Delta p$, kjer je $\Delta p = m\,(v' - v)$
:::

**Rešitev:**

1. Pozitivno smer izberemo navzgor, zato ima hitrost pred trkom negativen predznak.
2. Gibalni količini: pred trkom $p = 0{,}02 \cdot (-25) = -0{,}5\,\mathrm{kg\,m/s}$, po trku $p' = 0{,}02 \cdot 5 = 0{,}1\,\mathrm{kg\,m/s}$.
3. Sprememba gibalne količine: $\Delta p = 0{,}02 \cdot (5 - (-25)) = 0{,}02 \cdot 30 = 0{,}6\,\mathrm{N\,s}$. Na sliki je to zelena puščica desno: vzporedno zamaknjena sega od višine konca $p$ do višine konca $p'$.

:::risba skica
opis: Gibalna količina zrna toče pri odboju od strehe, pozitivna smer je navzgor, en kvadratek je 0,1 kg m/s. Pred trkom kaže puščica p navzdol in je dolga 5 kvadratkov. Po trku kaže puščica p′ navzgor in je dolga 1 kvadratek. Desno sta obe puščici narisani iz iste točke; puščica Δp je vzporedno zamaknjena, sega od višine konca p do višine konca p′, kaže navzgor in je dolga 6 kvadratkov.
območje: 0; -6 .. 12; 3
enota: 22
mreža: da
črta: 0; 0 -> 12; 0 | siva
puščica: 2; 0 -> 2; -5 | p | desno | modra debelo
puščica: 5,5; 0 -> 5,5; 1 | p′ | desno | oranžna debelo
puščica: 8,5; 0 -> 8,5; -5 | p | levo | modra črtkano
puščica: 8,5; 0 -> 8,5; 1 | p′ | levo | oranžna črtkano
puščica: 10; -5 -> 10; 1 | Δp | desno | zelena debelo
napis: 2; 2 | pred | sredina
napis: 5,5; 2 | po | sredina
napis: 9,5; 2 | razlika | sredina
podnapis: En kvadratek je 0,1 kg m/s. Δp = 0,1 − (−0,5) = 0,6 kg m/s, navzgor.
:::

4. Sila iz izreka: $F = \dfrac{0{,}6}{0{,}002} = 300\,\mathrm{N}$.
5. Primerjava: če bi zrno obstalo na strehi, bi bila sprememba le $0{,}5\,\mathrm{N\,s}$ in sila $250\,\mathrm{N}$. Odboj pomeni večjo spremembo gibalne količine, ker mora streha zrno ustaviti in ga še pognati nazaj.
6. Odgovor: streha deluje na zrno s povprečno silo $300\,\mathrm{N}$ navzgor, to je okoli $1500$-krat več od njegove teže. Po 3. Newtonovem zakonu enako velika sila deluje na pločevino navzdol, zato nastane vdolbina.

### Primer 3: sokol ujame grivarja

Sokol z maso $1\,\mathrm{kg}$ leti vodoravno s hitrostjo $30\,\mathrm{m/s}$. Dohiti goloba grivarja z maso $0{,}5\,\mathrm{kg}$, ki leti v isti smeri s hitrostjo $15\,\mathrm{m/s}$, in ga zgrabi. Kolikšna je njuna skupna hitrost tik po tem? S kolikšno povprečno silo deluje sokol na goloba, če prijem traja $0{,}1\,\mathrm{s}$?

**Podatki:** $m_1 = 1\,\mathrm{kg}$, $v_1 = 30\,\mathrm{m/s}$, $m_2 = 0{,}5\,\mathrm{kg}$, $v_2 = 15\,\mathrm{m/s}$, $\Delta t = 0{,}1\,\mathrm{s}$
**Iščemo:** skupno hitrost $v'$ in silo $F$ na goloba

:::formula
$m_1 v_1 + m_2 v_2 = (m_1 + m_2)\,v'$, nato $F\,\Delta t = \Delta p_2$
:::

**Rešitev:**

1. To je popolnoma neprožni trk: ptiča se po prijemu gibljeta skupaj. Zračni upor v tem kratkem času zanemarimo.
2. Skupna gibalna količina pred prijemom: $1 \cdot 30 + 0{,}5 \cdot 15 = 37{,}5\,\mathrm{kg\,m/s}$.
3. Skupna hitrost: $v' = \dfrac{37{,}5}{1{,}5} = 25\,\mathrm{m/s}$.
4. Golobu se gibalna količina poveča: $\Delta p_2 = 0{,}5 \cdot (25 - 15) = 5\,\mathrm{N\,s}$. Sokolu se za enako zmanjša: $1 \cdot (25 - 30) = -5\,\mathrm{N\,s}$.
5. Sila na goloba: $F = \dfrac{5}{0{,}1} = 50\,\mathrm{N}$.
6. Odgovor: tik po prijemu letita s hitrostjo $25\,\mathrm{m/s}$, sokol pa deluje na goloba s povprečno silo $50\,\mathrm{N}$.

Sokol selec plen pogosto napade v strmoglavem letu od zgoraj, včasih pa ga lovi tudi vodoravno. Tak prijem smo izbrali, da je račun po premici.

### Primer 4: zdaj ti

Kepa snega z maso $0{,}15\,\mathrm{kg}$ prileti vodoravno v mirujoče sani z maso $2{,}85\,\mathrm{kg}$ na zaledenelem ribniku in se prilepi nanje. Sani se odpeljejo s hitrostjo $0{,}6\,\mathrm{m/s}$. Kolikšna je bila hitrost kepe?

**Podatki:** $m_1 = 0{,}15\,\mathrm{kg}$, $m_2 = 2{,}85\,\mathrm{kg}$, $v_2 = 0$, $v' = 0{,}6\,\mathrm{m/s}$
**Iščemo:** hitrost kepe $v_1$

:::formula
$m_1 v_1 + m_2 v_2 = (m_1 + m_2)\,v'$
:::

**Rešitev:**

1. Sani mirujejo, zato je pred trkom gibalna količina samo kepina, $m_1 v_1$.
2. Po trku: $(m_1 + m_2)\,v' = 3 \cdot 0{,}6 = 1{,}8\,\mathrm{kg\,m/s}$.
3. Izenači obe strani in izračunaj $v_1$ sam, nato preveri:

:::premisli
Koliko je $v_1$?
---
$0{,}15 \cdot v_1 = 1{,}8$, torej $v_1 = \dfrac{1{,}8}{0{,}15} = 12\,\mathrm{m/s}$. Hitrost kepe je $20$-krat večja od hitrosti sani, ker je masa sani s kepo $20$-krat večja od mase kepe.
:::

## Pogoste napake

- **Seštevanje brez predznakov.** Kosa ledu s $8\,\mathrm{kg\,m/s}$ v desno in $2\,\mathrm{kg\,m/s}$ v levo nimata skupaj $10\,\mathrm{kg\,m/s}$. Gibalna količina je vektor. Najprej izberi pozitivno smer, potem seštej: $8 - 2 = 6\,\mathrm{kg\,m/s}$.
- **»Odboj je mehkejši kot zaustavitev.«** Zdi se, da se pri odboju del gibalne količine »vrne«. V resnici je sprememba večja: pri toči $0{,}6$ namesto $0{,}5\,\mathrm{N\,s}$. Pri $\Delta p = m\,(v' - v)$ obe hitrosti vstavi s predznakom.
- **»Težje telo dobi pri trku večji sunek.«** Sunka sta vedno nasprotno enaka, ker sta sili enaki po 3. Newtonovem zakonu. Lažje telo samo bolj spremeni hitrost, ker ima manjšo maso.
- **»Snežna odeja zmanjša spremembo gibalne količine.«** Sprememba je enaka, saj se telo v vsakem primeru ustavi. Mehka podlaga podaljša čas $\Delta t$, zato je sila manjša.
- **Ohranitev za vsako telo posebej.** Ohranja se le *vsota* gibalnih količin vseh teles v sistemu. Posamezno telo jo pri trku vedno spremeni.

## Povzetek

- Gibalna količina: $\vec p = m\,\vec v$, vektor v smeri hitrosti, enota $\mathrm{kg\,m/s} = \mathrm{N\,s}$.
- Izrek o gibalni količini: $F\,\Delta t = \Delta p$; sunek rezultante sil je enak spremembi gibalne količine.
- Pri enaki $\Delta p$ daljši čas pomeni manjšo silo (upognjene noge, sneg, čelada).
- Pri odboju je $\Delta p$ večja kot pri zaustavitvi; hitrosti vstavljamo s predznakom.
- Ohranitev: če je vsota zunanjih sil nič, je $p_1 + p_2 = p_1' + p_2'$; posamezna telesa si gibalno količino izmenjajo.
- Popolnoma neprožni trk (telesi se sprimeta): $m_1 v_1 + m_2 v_2 = (m_1 + m_2)\,v'$. Prožni trk: telesi se odbijeta in se po trku razmikata enako hitro, kot sta se približevala.

## Drugače: Korak za korakom s številkami

Na zamrznjenem jezeru drsi drsalec z maso $60\,\mathrm{kg}$ s hitrostjo $2\,\mathrm{m/s}$. Naproti mu pridrsi drsalka z maso $40\,\mathrm{kg}$ s hitrostjo $1\,\mathrm{m/s}$. Ujameta se in drsita naprej skupaj. Recept za vsak trk:

1. **Skica in smer.** Nariši obe telesi s puščicama hitrosti. Pozitivna smer naj bo smer gibanja drsalca. Trenje ledu v kratkem času objema zanemarimo, zato se skupna gibalna količina ohrani.
2. **Predznaki.** $v_1 = 2\,\mathrm{m/s}$, $v_2 = -1\,\mathrm{m/s}$.
3. **Gibalna količina vsakega telesa.** $p_1 = 60 \cdot 2 = 120\,\mathrm{kg\,m/s}$, $p_2 = 40 \cdot (-1) = -40\,\mathrm{kg\,m/s}$.
4. **Vsota pred trkom.** $120 - 40 = 80\,\mathrm{kg\,m/s}$.
5. **Po trku** se drsalca gibljeta skupaj, masa je $100\,\mathrm{kg}$.
6. **Izenači.** $100 \cdot v' = 80$, torej $v' = \dfrac{80}{100} = 0{,}8\,\mathrm{m/s}$.
7. **Preveri.** Predznak je pozitiven, zato skupaj drsita v smer, v katero je drsel drsalec. Hitrost je manjša od $2\,\mathrm{m/s}$, kot pričakujemo, ker je drsalka zavirala.

## Drugače: Kot zgodba

Januarja je ribnik za vasjo zamrznil. Tina je sedla na sani in čakala, da jo kdo porine. Njen pes Fido z maso $20\,\mathrm{kg}$ je pritekel po ledu s hitrostjo $6\,\mathrm{m/s}$ in skočil k njej. Tina in sani imata skupaj $40\,\mathrm{kg}$.

Fido je prinesel gibalno količino $120\,\mathrm{kg\,m/s}$. Ko je pristal na saneh, si jo je razdelil z njimi. Zdaj se je gibalo $60\,\mathrm{kg}$, zato je bila hitrost le $2\,\mathrm{m/s}$. Skupna gibalna količina je ostala enaka, ker led skoraj ne zavira.

Na koncu ribnika je bil kup snega. Tina se je odločila: ne bo se zaletela v deblo, ampak v sneg. Sani so se v snegu ustavljale približno sekundo, ob deblu bi se v stotinki sekunde. Gibalna količina, ki jo je morala izgubiti, je bila v obeh primerih enaka. Ker je sneg ustavljanje raztegnil, je bila sila približno stokrat manjša. Fizika je delala natančno tako, kot pravita izrek o gibalni količini in zakon o njeni ohranitvi.

## Preveri se

? Razvrsti telesa po velikosti gibalne količine, od najmanjše do največje.
1. dežna kapljica z maso $0{,}05\,\mathrm{g}$ in hitrostjo $9\,\mathrm{m/s}$
2. vrabec z maso $30\,\mathrm{g}$ in hitrostjo $8\,\mathrm{m/s}$
3. zrno toče z maso $20\,\mathrm{g}$ in hitrostjo $25\,\mathrm{m/s}$
4. sokol z maso $1\,\mathrm{kg}$ in hitrostjo $30\,\mathrm{m/s}$
5. srna z maso $25\,\mathrm{kg}$ in hitrostjo $2\,\mathrm{m/s}$
> Zmnožki $m\,v$ v $\mathrm{kg\,m/s}$: $0{,}00045$; $0{,}24$; $0{,}5$; $30$; $50$. Počasna srna ima največjo gibalno količino, ker ima daleč največjo maso. Vrabec je težji od zrna toče, a počasnejši, zato ima manjšo gibalno količino: odloča zmnožek.

? Zakaj divja mačka pri doskoku z drevesa upogne noge?
- Ker tako zmanjša spremembo svoje gibalne količine.
~ Sprememba je enaka, saj se mačka v vsakem primeru ustavi. Spremeni se čas ustavljanja.
- Ker tako zmanjša svojo težo.
~ Teža je $m\,g$ in se z držo ne spremeni. Pomemben je čas, v katerem se ustavi.
+ Ker podaljša čas ustavljanja, zato sta pri enakem sunku povprečna sila tal in rezultanta manjši.
- Ker tako zmanjša hitrost, s katero pristane.
~ Hitrost ob doskoku je določena s padcem z drevesa. Upogib nog spremeni le čas ustavljanja.
> Izrek $F\,\Delta t = \Delta p$: pri enaki $\Delta p$ večji $\Delta t$ pomeni manjšo silo $F$.

? Graf kaže silo tal na zrno toče z maso $0{,}024\,\mathrm{kg}$, ki pade na asfalt in na njem obstane. Z grafa odčitaj sunek sile in izračunaj, s kolikšno hitrostjo je zrno priletelo.
:::risba graf
opis: Graf sile v odvisnosti od časa. Sila enakomerno naraste od 0 ob času 0 do 300 N ob času 2 ms in nato enakomerno pade na 0 ob času 4 ms. Graf je trikotnik.
x: 0 .. 5 | 1 | t [ms]
y: 0 .. 350 | 50 | F [N]
lik: 0; 0 -> 2; 300 -> 4; 0 | modra ozadje
:::
= 25 m/s | 0,5
~ 50 | Sunek si izračunal kot $300 \cdot 0{,}004 = 1{,}2\,\mathrm{N\,s}$. Ploščina trikotnika je polovica tega.
~ 12,5 | Za osnovo trikotnika si vzel $2\,\mathrm{ms}$. Sila deluje $4\,\mathrm{ms}$.
~ 25000 | Čas si vstavil v milisekundah. Najprej pretvori: $4\,\mathrm{ms} = 0{,}004\,\mathrm{s}$.
> Sunek je ploščina trikotnika: $\tfrac{1}{2} \cdot 0{,}004\,\mathrm{s} \cdot 300\,\mathrm{N} = 0{,}6\,\mathrm{N\,s}$. Toliko gibalne količine je zrno izgubilo, zato $v = \dfrac{0{,}6}{0{,}024} = 25\,\mathrm{m/s}$.

? Dva kosa ledu trčita na gladkem ribniku. Pred trkom sta njuni gibalni količini $5\,\mathrm{kg\,m/s}$ in $-2\,\mathrm{kg\,m/s}$. Kateri par vrednosti po trku se sklada z zakonom o ohranitvi gibalne količine?
+ $-1$ in $4\,\mathrm{kg\,m/s}$
- $3$ in $4\,\mathrm{kg\,m/s}$
~ Vsota je $7$: tako dobiš, če sešteješ velikosti brez predznaka. Pravilna vsota pred trkom je $5 - 2 = 3$.
- $-5$ in $2\,\mathrm{kg\,m/s}$
~ Pri trku se ne obrne vsa gibalna količina. Vsota $-3$ ni enaka vsoti pred trkom, $3$.
- $0$ in $0\,\mathrm{kg\,m/s}$
~ Kosa se ne moreta oba ustaviti, ker je bila skupna gibalna količina pred trkom $3$, ne $0$.
> Ohranja se vsota: pred trkom $5 + (-2) = 3$, po trku $-1 + 4 = 3\,\mathrm{kg\,m/s}$.

? Sokol z maso $1\,\mathrm{kg}$ zgrabi grivarja z maso $0{,}5\,\mathrm{kg}$ kot v Primeru 3. Kateri ptič med prijemom dobi večji sunek sile?
- Sokol, ker je težji.
~ Sili med ptičema sta po 3. Newtonovem zakonu enako veliki in delujeta enako dolgo. Masa ne vpliva na sunek.
- Golob, ker se mu hitrost bolj spremeni.
~ Golob res bolj spremeni hitrost, a ker ima manjšo maso. Sprememba gibalne količine je pri obeh enako velika.
+ Oba dobita enako velik sunek, nasprotno usmerjen.
- Golob, ker je sokol napadalec.
~ Kdo koga zgrabi, ne šteje. Sili vzajemnega delovanja sta vedno enaki.
> V Primeru 3 je $\Delta p_2 = 5\,\mathrm{N\,s}$ za goloba in $-5\,\mathrm{N\,s}$ za sokola. Sunka sta nasprotno enaka; lažji golob le bolj spremeni hitrost.

? Ribič z maso $70\,\mathrm{kg}$ skoči iz mirujočega čolna z maso $50\,\mathrm{kg}$ proti bregu z vodoravno hitrostjo $2\,\mathrm{m/s}$. Kolikšna je hitrost čolna tik po skoku? Smer proti bregu je pozitivna, zato vpiši hitrost s predznakom. Upor vode zanemari.
= -2,8 m/s | 0,05
~ 2,8 | Velikost je prava, smer ne: skupna gibalna količina mora ostati nič, zato se čoln giblje nasprotno od ribiča.
~ -2 | Enaki morata biti gibalni količini, ne hitrosti. Čoln ima manjšo maso, zato večjo hitrost.
~ 0 | Pred skokom je skupna gibalna količina nič. Ribič dobi gibalno količino proti bregu, zato jo mora čoln dobiti v nasprotno smer.
> $0 = 70 \cdot 2 + 50 \cdot v'$, torej $v' = -2{,}8\,\mathrm{m/s}$: čoln odplava stran od brega.

<<RACUN
vrednost: 0.00005*9 | 0.00045
vrednost: 0.02*25 | 0.5
vrednost: 0.5/0.00045 | 1111.1
vrednost: 0.02*(5-(-25)) | 0.6
vrednost: 0.6/0.002 | 300
vrednost: 0.5/0.002 | 250
vrednost: 300/0.2 | 1500
vrednost: 6/0.05 | 120
vrednost: 6/0.2 | 30
resi: 1*30+0.5*15=1.5*v | v | 25
vrednost: 0.5*(25-15) | 5
vrednost: 5/0.1 | 50
resi: 0.15*v=3*0.6 | v | 12
resi: 60*2+40*(-1)=100*v | v | 0.8
resi: 20*6=60*v | v | 2
vrednost: 0.5*0.004*300/0.024 | 25
resi: 0=70*2+50*v | v | -2.8
>>

:::simboli
\vec p, p | gibalna količina | p = m\,v | kg\,m/s | vektor v smeri hitrosti
\vec G | gibalna količina (oznaka v nekaterih učbenikih) | G = m\,v | kg\,m/s |
m | masa | | kg |
\vec v, v | hitrost | | m/s | s predznakom glede na izbrano smer
v' | hitrost po trku (pri popolnoma neprožnem trku skupna) | | m/s |
t | čas (v tabeli: čas ustavljanja) | t = \frac{v}{a} | s |
F | povprečna rezultanta sil | F = \frac{\Delta p}{\Delta t} | N | v lekciji o Newtonovih zakonih $F_\mathrm{r}$
\Delta t | čas delovanja sile | | s |
\Delta p | sprememba gibalne količine | \Delta p = p' - p | N\,s | enaka sunku sile
p' | gibalna količina po trku | | kg\,m/s |
p_1, p_2 | gibalni količini teles pred trkom | | kg\,m/s |
p_1', p_2' | gibalni količini teles po trku | | kg\,m/s |
m_1, m_2 | masi teles | | kg |
v_1, v_2 | hitrosti teles pred trkom | | m/s |
p_\mathrm{k}, p_\mathrm{t} | gibalna količina kapljice, toče | | kg\,m/s |
m_\mathrm{k}, m_\mathrm{t} | masa kapljice, toče | | kg |
v_\mathrm{k}, v_\mathrm{t} | hitrost kapljice, toče | | m/s |
a | pospešek | a = \frac{\Delta v}{\Delta t} | m/s^2 |
\Delta v | sprememba hitrosti | | m/s |
u | hitrost kosa 2 na grafu trka | | m/s | s predznakom
\Delta p_2 | sprememba gibalne količine goloba | \Delta p_2 = m_2\,(v' - v_2) | N\,s |
:::
