---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nina je medicinska sestra v bolnišnici, kjer hodniki tvorijo pravilno mrežo. Lekarna je v spodnjem levem kotu, otroški oddelek pa $4$ hodnike proti vzhodu in $3$ hodnike proti severu. Zdravila bo odslej vozil robot. Ta gre vedno po najkrajši poti: vsak korak ga pelje en hodnik proti vzhodu ali en hodnik proti severu.

Pred zagonom mora Nina pregledati vsako pot, ki jo robot lahko izbere, saj na nobeni ne sme biti ovir. Koliko poti bo pregledala?

Sodelavec odgovori v hipu: »Štiri krat tri, torej $12$.« Zveni prepričljivo, a je narobe. Pravih poti je skoraj trikrat toliko.

Na tekmovanjih so pogoste naloge s potmi po mreži, trikotniki na sliki in pravokotniki v mreži. Štetje s prstom tu hitro zaide. Pomaga orodje, ki ga že imaš: izbira $k$ od $n$.

## Razlaga

**1. Zakaj množenje ne deluje.** Števili $4$ in $3$ bi smeli zmnožiti, če bi robot izbral enega od štirih hodnikov in nato enega od treh. A ne izbira tako. Opravi **vse** $4$ korake proti vzhodu in **vse** $3$ proti severu. Poti se med seboj razlikujejo le po vrstnem redu korakov.

**2. Pot kot beseda.** Na načrtu je vzhod desno in sever gor. Korak desno zapišimo s črko D, korak gor s črko G. Vsaka najkrajša pot je potem beseda iz $7$ črk: $4$ črke D in $3$ črke G, na primer DDGDGGD. Velja tudi obratno: vsaka taka beseda opiše natanko eno pot. Šteti poti torej pomeni šteti besede.

Besedo določimo, ko izberemo, na katerih $3$ od $7$ mest stoji G. Na ostala mesta gre D. Vrstni red izbranih mest ni pomemben, zato je to kombinacija:

$$\binom{7}{3} = \frac{7 \cdot 6 \cdot 5}{3 \cdot 2 \cdot 1} = 35$$

Nina mora pregledati $35$ poti, ne $12$. Splošno: če gremo $m$ korakov desno in $n$ korakov gor, je najkrajših poti $\binom{m+n}{n}$. Enako dobimo z $\binom{m+n}{m}$, če izbiramo mesta za črke D.

:::premisli
Koliko najkrajših poti vodi čez kvadratno mrežo $2 \times 2$ (dva koraka desno, dva gor)? Napovej in jih nato naštej.
---
$\binom{4}{2} = 6$: DDGG, DGDG, DGGD, GDDG, GDGD, GGDD. Množenje $2 \cdot 2 = 4$ bi dve poti izpustilo.
:::

**3. Slika s števili v vozliščih.** Križišču hodnikov recimo vozlišče. Vanj vpišemo, koliko najkrajših poti vodi do njega iz lekarne A. V vozlišče pridemo z zadnjim korakom bodisi z leve bodisi od spodaj. Ti dve skupini poti se ne prekrivata, zato po pravilu vsote seštejemo število levo in število spodaj. Na spodnjem in levem robu je povsod $1$, saj tja vodi ena sama ravna pot. Za Ninino mrežo (A spodaj levo, oddelek B zgoraj desno):

:::risba skica
opis: Mreža 4 krat 3. V vsakem vozlišču je število najkrajših poti iz A spodaj levo. Po vrstah od spodaj: 1, 1, 1, 1, 1; 1, 2, 3, 4, 5; 1, 3, 6, 10, 15; 1, 4, 10, 20, 35. V B zgoraj desno je 35.
območje: -0,8; -0,5 .. 4,8; 3,5
enota: 54
črta: 0; 0 -> 4; 0 | siva
črta: 0; 1 -> 4; 1 | siva
črta: 0; 2 -> 4; 2 | siva
črta: 0; 3 -> 4; 3 | siva
črta: 0; 0 -> 0; 3 | siva
črta: 1; 0 -> 1; 3 | siva
črta: 2; 0 -> 2; 3 | siva
črta: 3; 0 -> 3; 3 | siva
črta: 4; 0 -> 4; 3 | siva
krog: 0; 3 | 0,28 | ozadje
napis: 0; 3 | 1 | sredina
krog: 1; 3 | 0,28 | ozadje
napis: 1; 3 | 4 | sredina
krog: 2; 3 | 0,28 | ozadje
napis: 2; 3 | 10 | sredina
krog: 3; 3 | 0,28 | ozadje
napis: 3; 3 | 20 | sredina
krog: 4; 3 | 0,28 | ozadje
napis: 4; 3 | 35 | sredina | debelo
krog: 0; 2 | 0,28 | ozadje
napis: 0; 2 | 1 | sredina
krog: 1; 2 | 0,28 | ozadje
napis: 1; 2 | 3 | sredina
krog: 2; 2 | 0,28 | ozadje
napis: 2; 2 | 6 | sredina
krog: 3; 2 | 0,28 | ozadje
napis: 3; 2 | 10 | sredina
krog: 4; 2 | 0,28 | ozadje
napis: 4; 2 | 15 | sredina
krog: 0; 1 | 0,28 | ozadje
napis: 0; 1 | 1 | sredina
krog: 1; 1 | 0,28 | ozadje
napis: 1; 1 | 2 | sredina
krog: 2; 1 | 0,28 | ozadje
napis: 2; 1 | 3 | sredina
krog: 3; 1 | 0,28 | ozadje
napis: 3; 1 | 4 | sredina
krog: 4; 1 | 0,28 | ozadje
napis: 4; 1 | 5 | sredina
krog: 0; 0 | 0,28 | ozadje
napis: 0; 0 | 1 | sredina
krog: 1; 0 | 0,28 | ozadje
napis: 1; 0 | 1 | sredina
krog: 2; 0 | 0,28 | ozadje
napis: 2; 0 | 1 | sredina
krog: 3; 0 | 0,28 | ozadje
napis: 3; 0 | 1 | sredina
krog: 4; 0 | 0,28 | ozadje
napis: 4; 0 | 1 | sredina
napis: -0,35; 0 | A | levo | modra debelo
napis: 4,35; 3 | B | desno | modra debelo
:::

Če je kakšno vozlišče zaprto, vanj vpišemo $0$ in seštevamo naprej.

V simulaciji spodaj (Štetje poti po mreži) nastavi širino $4$ in višino $3$. Nato klikni vozlišče na sredini mreže, da ga zapreš. Opazuj, katera števila se spremenijo: samo tista desno in nad zaprtim vozliščem.

**4. Liki na sliki: najprej mamljiva napaka.** Mreža z $2$ vrsticama po $3$ kvadratke ima $6$ kvadratkov. Koliko pravokotnikov je na njej? Prvi odgovor je pogosto »$6$«, a ta šteje le najmanjše. Tudi štetje »na oko« zaide: kakšnega spregledamo, kakšnega štejemo dvakrat.

**5. Pravokotnik določata dva para črt.** Vsak pravokotnik v mreži ima levo in desno stranico na dveh navpičnih črtah, spodnjo in zgornjo pa na dveh vodoravnih. Velja tudi obratno: vsaka izbira dveh navpičnih in dveh vodoravnih črt da natanko en pravokotnik. Mreža z $a$ stolpci in $b$ vrsticami kvadratkov ima $a + 1$ navpičnih in $b + 1$ vodoravnih črt. Pravokotnikov je zato

$$\binom{a+1}{2} \cdot \binom{b+1}{2}$$

Štejemo **črte**, ne kvadratkov. Mrežo iz točke 4 tako preštejemo v Primeru 1.

:::premisli
Zakaj pri pravokotnikih smemo množiti, pri robotu pa množenje $4 \cdot 3$ ni delovalo?
---
Pri pravokotniku sta izbiri res neodvisni: kateri koli par navpičnih črt se ujame s katerim koli parom vodoravnih. Pri robotu pa $4$ in $3$ nista števili možnosti, ampak števili korakov. Možnosti so vrstni redi teh korakov.
:::

**6. Trikotniki: štej trojice črt.** Trikotnik na sliki nastane iz treh črt, ki se paroma sekajo v treh različnih točkah. Pogosta tekmovalna slika je **pahljača**: iz oglišča trikotnika gre do nasprotne stranice (osnovnice) nekaj daljic, čez pa je narisanih nekaj vzporednic z osnovnico. Tri črte skozi isto oglišče se sekajo v eni sami točki. Dve vzporedni črti se ne sekata. Trikotnik zato nastane le iz **dveh črt skozi oglišče in ene vzporednice**.

Ena strategija za vse like: poišči, kaj lik **natanko določa** (par črt, trojica črt, začetek in konec poti), in štej te izbire. Če tega ne najdeš, razdeli like po velikosti in štej vsako skupino posebej.

## Rešeni primeri

### Primer 1 (lažji): pretisni omot tablet

Pretisni omot ima $2$ vrsti po $3$ tablete, ločene z zarezami. Farmacevtka lahko z omota odreže kateri koli pravokoten kos iz celih celic. Koliko različnih kosov (po položaju na omotu) lahko odreže?

**Podatki:** $a = 3$ stolpci celic, $b = 2$ vrstici celic; kos je pravokotnik iz celih celic
**Iščemo:** število pravokotnikov $N$

:::formula
$N = \binom{a+1}{2} \cdot \binom{b+1}{2}$
:::

**Rešitev:**

1. Navpičnih črt (robov in zarez) je $3 + 1 = 4$, vodoravnih $2 + 1 = 3$. Na njih ležijo stranice kosa.
2. Dve navpični črti izberemo na $\binom{4}{2} = 6$ načinov.
3. Dve vodoravni črti izberemo na $\binom{3}{2} = 3$ načine.
4. Izbiri sta neodvisni, zato $N = 6 \cdot 3 = 18$.
5. Preizkus po velikostih: kosov z $1$ celico je $6$, vodoravnih z $2$ celicama $4$, s $3$ celicami $2$, navpičnih z $2$ celicama $3$, kvadratov $2 \times 2$ sta $2$, cel omot je $1$. Skupaj $6 + 4 + 2 + 3 + 2 + 1 = 18$.
6. Odgovor: farmacevtka lahko odreže $18$ različnih kosov.

### Primer 2: robot in moker hodnik

Ninin robot vozi po mreži iz razlage: $4$ korake desno in $3$ gor. Križišče X, ki je $2$ hodnika desno in $1$ hodnik gor od lekarne A, čistilka pravkar pomiva. Robot skozenj ne sme. Koliko najkrajših poti mu ostane?

**Podatki:** $m = 4$ koraki desno, $n = 3$ koraki gor; zaprto križišče X je $2$ desno in $1$ gor od A
**Iščemo:** število najkrajših poti, ki se X izognejo

:::formula
$N = \binom{m+n}{n} - N_{A \to X} \cdot N_{X \to B}$
:::

**Rešitev:**

1. Vseh najkrajših poti je $\binom{7}{3} = 35$.
2. Od A do X gremo $2$ desno in $1$ gor: $\binom{3}{1} = 3$ poti.
3. Od X do B ostaneta $2$ koraka desno in $2$ gor: $\binom{4}{2} = 6$ poti.
4. Vsak začetek se ujame z vsakim nadaljevanjem, zato skozi X vodi $3 \cdot 6 = 18$ poti (produkt, ne vsota).
5. Mimo X: $35 - 18 = 17$ poti.
6. Preizkus s števili v vozliščih, kjer X dobi $0$:

:::risba skica
opis: Mreža 4 krat 3 z zaprtim vozliščem X (vpisana 0). V vsakem vozlišču je število najkrajših poti iz A spodaj levo. Po vrstah od spodaj: 1, 1, 1, 1, 1; 1, 2, 0, 1, 2; 1, 3, 3, 4, 6; 1, 4, 7, 11, 17. V B zgoraj desno je 17.
območje: -0,8; -0,5 .. 4,8; 3,5
enota: 54
črta: 0; 0 -> 4; 0 | siva
črta: 0; 1 -> 4; 1 | siva
črta: 0; 2 -> 4; 2 | siva
črta: 0; 3 -> 4; 3 | siva
črta: 0; 0 -> 0; 3 | siva
črta: 1; 0 -> 1; 3 | siva
črta: 2; 0 -> 2; 3 | siva
črta: 3; 0 -> 3; 3 | siva
črta: 4; 0 -> 4; 3 | siva
krog: 0; 3 | 0,28 | ozadje
napis: 0; 3 | 1 | sredina
krog: 1; 3 | 0,28 | ozadje
napis: 1; 3 | 4 | sredina
krog: 2; 3 | 0,28 | ozadje
napis: 2; 3 | 7 | sredina
krog: 3; 3 | 0,28 | ozadje
napis: 3; 3 | 11 | sredina
krog: 4; 3 | 0,28 | ozadje
napis: 4; 3 | 17 | sredina | debelo
krog: 0; 2 | 0,28 | ozadje
napis: 0; 2 | 1 | sredina
krog: 1; 2 | 0,28 | ozadje
napis: 1; 2 | 3 | sredina
krog: 2; 2 | 0,28 | ozadje
napis: 2; 2 | 3 | sredina
krog: 3; 2 | 0,28 | ozadje
napis: 3; 2 | 4 | sredina
krog: 4; 2 | 0,28 | ozadje
napis: 4; 2 | 6 | sredina
krog: 0; 1 | 0,28 | ozadje
napis: 0; 1 | 1 | sredina
krog: 1; 1 | 0,28 | ozadje
napis: 1; 1 | 2 | sredina
krog: 2; 1 | 0,28 | ozadje
napis: 2; 1 | 0 | sredina | rdeča debelo
krog: 3; 1 | 0,28 | ozadje
napis: 3; 1 | 1 | sredina
krog: 4; 1 | 0,28 | ozadje
napis: 4; 1 | 2 | sredina
krog: 0; 0 | 0,28 | ozadje
napis: 0; 0 | 1 | sredina
krog: 1; 0 | 0,28 | ozadje
napis: 1; 0 | 1 | sredina
krog: 2; 0 | 0,28 | ozadje
napis: 2; 0 | 1 | sredina
krog: 3; 0 | 0,28 | ozadje
napis: 3; 0 | 1 | sredina
krog: 4; 0 | 0,28 | ozadje
napis: 4; 0 | 1 | sredina
napis: -0,35; 0 | A | levo | modra debelo
napis: 4,35; 3 | B | desno | modra debelo
napis: 2,22; 0,78 | X | pod desno | rdeča
:::

7. Odgovor: robotu ostane $17$ najkrajših poti.

### Primer 3 (težji): trikotna ruta

Na trikotni ruti iz kompleta prve pomoči je natisnjen vzorec. Iz vrha rute (oglišča nasproti najdaljše stranice) vodijo do najdaljše stranice $3$ daljice. Čez ruto sta od roba do roba narisani še $2$ daljici, vzporedni z najdaljšo stranico. Koliko trikotnikov je na ruti, če štejemo tudi njen rob?

**Podatki:** $3$ notranje daljice iz vrha; $2$ narisani vzporednici z najdaljšo stranico; rob rute je trikotnik
**Iščemo:** število vseh trikotnikov $T$

:::formula
$T = \binom{p}{2} \cdot q$, kjer je $p$ število črt skozi vrh in $q$ število vzporednih črt
:::

**Rešitev:**

1. Črte skozi vrh so $3$ notranje daljice in obe stranici rute ob vrhu: $p = 3 + 2 = 5$. Stranici je lahko pozabiti.
2. Vzporedne črte so $2$ narisani in najdaljša stranica: $q = 2 + 1 = 3$.
3. Tri črte skozi vrh se sekajo v isti točki, dve vzporedni se ne sekata. Trikotnik zato da le izbira dveh črt skozi vrh in ene vzporednice, in vsaka taka izbira da natanko enega.
4. Par črt skozi vrh izberemo na $\binom{5}{2} = 10$ načinov.
5. Vsak par se ujame z vsako od treh vzporednic: $T = 10 \cdot 3 = 30$.
6. Odgovor: na ruti je $30$ trikotnikov.

### Primer 4 – zdaj ti: obvezen postanek

Reševalec gre peš od doma A do zdravstvenega doma B po ulicah, ki tvorijo mrežo: $5$ ulic desno in $3$ gor, vedno po najkrajši poti. Spotoma mora v lekarno L, ki je $2$ ulici desno in $1$ ulico gor od A. Koliko je takih poti?

**Podatki:** od A do B $5$ korakov desno in $3$ gor; L je $2$ desno in $1$ gor od A; poti so najkrajše
**Iščemo:** število najkrajših poti, ki gredo skozi L

:::formula
$N = N_{A \to L} \cdot N_{L \to B}$
:::

**Rešitev:**

1. Pot razdelimo na dva dela, A → L in L → B. Vsak začetek se ujame z vsakim nadaljevanjem, zato bomo množili.
2. Od A do L: $2$ desno in $1$ gor, torej $\binom{3}{1} = 3$ poti.
3. Od L do B ostanejo $3$ koraki desno in $2$ gor. Izračunaj sam število poti od L do B in nato vseh poti skozi L.

:::premisli
Koliko poti vodi od L do B in koliko je vseh najkrajših poti skozi L?
---
Od L do B: $\binom{5}{2} = 10$ poti. Skozi L: $3 \cdot 10 = 30$ poti. Za primerjavo: brez postanka bi jih bilo $\binom{8}{3} = 56$.
:::

## Pogoste napake

- **Množenje števil korakov.** »$4$ desno in $3$ gor, torej $4 \cdot 3 = 12$ poti« (ali celo $4 + 3 = 7$). Števili $4$ in $3$ povesta, koliko korakov naredimo, ne med koliko možnostmi izbiramo. Pot je beseda iz $7$ črk; izberemo mesta za G: $\binom{7}{3} = 35$.
- **Štetje le najmanjših likov.** V mreži $3 \times 3$ ni samo $9$ pravokotnikov, ker so pravokotniki tudi sestavljeni iz več kvadratkov. Tudi $14$ ni prav: to so le kvadrati. Šteti je treba izbire črt: $\binom{4}{2} \cdot \binom{4}{2} = 36$.
- **Celice namesto črt.** Kdor pri omotu $2 \times 3$ računa $\binom{3}{2} \cdot \binom{2}{2} = 3$, je izbiral stolpce in vrstice celic. Stranice ležijo na črtah, teh je v vsaki smeri za ena več kot celic.
- **Vsota namesto produkta skozi točko.** Poti skozi X niso $3 + 6 = 9$, ampak $3 \cdot 6 = 18$. Vsakega od $3$ začetkov lahko nadaljuješ na vsakega od $6$ načinov.
- **Pozabljeni robovi.** Pri pahljači sta tudi stranici velikega trikotnika črti skozi oglišče, osnovnica pa je ena od vzporednic. Kdor ju izpusti, v Primeru 3 dobi $\binom{3}{2} \cdot 2 = 6$ namesto $30$.

## Povzetek

- Najkrajša pot z $m$ koraki desno in $n$ koraki gor je beseda iz $m$ črk D in $n$ črk G. Poti je $\binom{m+n}{n}$, ne $m \cdot n$.
- Števila v vozliščih: vsota števila levo in števila spodaj (pravilo vsote); zaprto vozlišče dobi $0$.
- Poti skozi točko X: (poti do X) $\cdot$ (poti od X). Poti mimo X: vse poti minus te.
- Pravokotnik v mreži z $a$ stolpci in $b$ vrsticami določata dve navpični in dve vodoravni črti: $\binom{a+1}{2} \cdot \binom{b+1}{2}$ pravokotnikov.
- Pahljača s $p$ črtami skozi oglišče (s stranicama) in $q$ vzporednicami (z osnovnico) ima $\binom{p}{2} \cdot q$ trikotnikov.
- Strategija: poišči, kaj lik ali pot natanko določa, in štej te izbire; sicer štej po velikostih.

## Drugače: Kot zgodba

Predstavljaj si, da v vsakem križišču Nininih hodnikov stoji vratar z listkom. Na listek mora napisati, na koliko načinov lahko robot prispe do njega.

Vratar v lekarni napiše $1$: robot je že tam. Vratarji ob spodnjem in levem robu tudi napišejo $1$, saj vodi do njih ena sama ravna pot.

Drugi vratarji ne štejejo sami. Vsak pokliče soseda na levi in soseda spodaj ter vpraša: »Koliko si napisal ti?« Robot pride k njemu od enega ali od drugega, zato števili sešteje.

Če križišče pomivajo, tamkajšnji vratar napiše $0$. Robot mimo njega ne more, zato njegovi sosedje od njega ne dobijo nič.

Vratar pred otroškim oddelkom na koncu prebere svoj listek: $35$, ko je vse odprto, in $17$, ko je križišče X zaprto. Nihče ni moral narisati niti ene poti.

## Drugače: Korak za korakom s številkami

Preverimo obe metodi na majhni mreži, kjer lahko vse naštejemo: $3$ koraki desno in $2$ gor.

1. Formula: $\binom{5}{2} = \dfrac{5 \cdot 4}{2 \cdot 1} = 10$.
2. Naštevanje po abecedi, da ne izpustimo nobene besede: DDDGG, DDGDG, DDGGD, DGDDG, DGDGD, DGGDD, GDDDG, GDDGD, GDGDD, GGDDD. To je $10$ besed.
3. Števila v vozliščih, vrstica za vrstico od spodaj:
   - spodnja vrstica: $1, 1, 1, 1$;
   - srednja: $1, 2, 3, 4$ (na primer $3 = 2 + 1$: levo je $2$, spodaj $1$);
   - zgornja: $1, 3, 6, 10$ (na primer $10 = 6 + 4$).
4. Vse tri metode dajo $10$.

Še pravokotniki v traku iz $3$ kvadratkov (označimo jih 1, 2, 3):

1. Navpičnih črt je $4$, vodoravnih $2$: $\binom{4}{2} \cdot \binom{2}{2} = 6 \cdot 1 = 6$.
2. Naštejemo: [1], [2], [3], [1–2], [2–3], [1–3]. To je $6$ pravokotnikov.
3. Pravokotnik [2–3] na primer leži med drugo in četrto navpično črto.

## Preveri se

? Mreža ima $5$ korakov desno in $3$ gor. Trije od štirih zapisov spodaj dajo število najkrajših poti, eden ne. Kateri izstopa?
- $\binom{8}{3}$
~ To je osnovna formula: izmed $8$ korakov izberemo $3$ mesta za G. Pravilna je, zato ne izstopa.
- $\binom{8}{5}$
~ Izbrati $5$ mest za D je isto kot izbrati $3$ mesta za G, zato $\binom{8}{5} = \binom{8}{3} = 56$. Tudi ta zapis je pravilen.
+ $5 \cdot 3$
- število besed iz $5$ črk D in $3$ črk G
~ Vsaka pot je natanko ena taka beseda, zato je to pravilno štetje.
> Izstopa $5 \cdot 3 = 15$: števili korakov nista števili možnosti. Pravilno je $\binom{8}{3} = 56$.

? Koliko pravokotnikov (kvadrati so tudi pravokotniki) je v kvadratni mreži $3 \times 3$?
- $9$
~ To so le najmanjši kvadratki. Pravokotniki iz več kvadratkov manjkajo.
- $14$
~ To so vsi kvadrati ($9 + 4 + 1$). Pravokotniki, ki niso kvadrati, manjkajo.
- $16$
~ To je $4 \cdot 4$, zmnožek števil črt. Izbrati moraš po dve črti v vsaki smeri.
+ $36$
> Navpičnih črt je $4$, vodoravnih tudi $4$: $\binom{4}{2} \cdot \binom{4}{2} = 6 \cdot 6 = 36$.

? Zakaj je število poti v vozlišču enako vsoti števila levo in števila spodaj?
+ Ker v vozlišče pridemo z zadnjim korakom bodisi z leve bodisi od spodaj in se ti dve skupini poti ne prekrivata.
- Ker vsako pot z leve kombiniramo z vsako potjo od spodaj.
~ To bi vodilo v produkt. Posamezna pot pride v vozlišče le iz ene smeri, zato skupini seštejemo.
- Ker so števila v Pascalovem trikotniku simetrična.
~ Simetrija drži, a ne pove, zakaj seštevamo. Razlog je zadnji korak poti.
> Pravilo vsote: vsaka pot do vozlišča ima natanko en zadnji korak, desno ali gor.

? Luka šteje poti na mreži s $4$ koraki desno in $3$ gor, ki se izognejo križišču X ($2$ desno in $1$ gor od začetka). (1) Vseh poti je $\binom{7}{3} = 35$. (2) Do X vodijo $3$ poti, od X do cilja $6$. (3) Skozi X je $3 + 6 = 9$ poti. (4) Mimo X je $35 - 9 = 26$ poti. Kateri korak je napačen?
- korak (1)
~ $\binom{7}{3} = 35$ je pravilno število vseh poti.
- korak (2)
~ Do X: $2$ desno, $1$ gor, $\binom{3}{1} = 3$. Od X: $2$ desno, $2$ gor, $\binom{4}{2} = 6$. Oboje drži.
+ korak (3)
- korak (4)
~ Odštevanje (dopolnilo) je prava ideja. Napačen je le vmesni rezultat iz koraka (3).
> Vsak začetek se ujame z vsakim nadaljevanjem: $3 \cdot 6 = 18$, zato mimo X vodi $35 - 18 = 17$ poti.

? Reševalno vozilo mora od postaje do nesreče prevoziti $3$ ulice proti vzhodu in $3$ proti severu, po mreži ulic in vedno po najkrajši poti. Med koliko različnimi potmi lahko izbira voznik?
- $9$
~ $3 \cdot 3$ množi števili korakov; to niso možnosti.
- $6$
~ $3 + 3 = 6$ je dolžina poti (število korakov), ne število poti.
- $64$
~ $2^6$ šteje vsa zaporedja šestih korakov, tudi tista s $5$ koraki proti vzhodu. Najkrajša pot ima natanko $3$ in $3$.
+ $20$
> Izmed $6$ korakov izberemo $3$ za sever: $\binom{6}{3} = 20$.

:::simboli
a | število stolpcev kvadratkov v mreži | | | navpičnih črt je a + 1
b | število vrstic kvadratkov v mreži | | | vodoravnih črt je b + 1
N | število pravokotnikov v mreži | N = \binom{a+1}{2} \cdot \binom{b+1}{2} | | pri poteh: število najkrajših poti
m | število korakov desno | | |
n | število korakov gor | | |
N_{A \to X} | število najkrajših poti od A do X | | | X je zaprto križišče
N_{X \to B} | število najkrajših poti od X do B | | |
N_{A \to L} | število najkrajših poti od A do L | | | L je lekarna na poti
N_{L \to B} | število najkrajših poti od L do B | | |
T | število vseh trikotnikov | T = \binom{p}{2} \cdot q | |
p | število črt skozi vrh | | |
q | število vzporednih črt | | |
:::
