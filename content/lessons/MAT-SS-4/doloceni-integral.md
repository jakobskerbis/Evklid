---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Trener atletike ima posnetek štarta: radar vsako stotinko sekunde izmeri hitrost šprinterja. Poti ne meri nihče. Pa vendar trener na centimeter natančno izračuna, koliko metrov je tekač pretekel v prvih štirih sekundah.

Skrivnost je v grafu hitrosti. Prepotovana pot je **ploščina lika pod grafom**. Ta lik ima ukrivljen rob, zato ga ne razrežeš na pravokotnike in trikotnike. Presenečenje pride šele zdaj: ploščino boš izračunal z nedoločenim integralom, torej z odvajanjem nazaj. Orodje, ki je nastalo za naklone tangent, meri ploščine. Zveni narobe, a prav to je ena najmočnejših zvez v matematiki.

Z isto idejo izračunaš tudi prostornino žoge za ragbi, stožca ali pokala, ki nastane z vrtenjem krivulje okoli osi.

## Razlaga

**1. Pot je ploščina.** Kolesar vozi $10$ sekund s stalno hitrostjo $6\,\mathrm{m/s}$. Na grafu $v(t)$ je to vodoravna daljica na višini $6$. Lik pod njo je pravokotnik s stranicama $10\,\mathrm{s}$ in $6\,\mathrm{m/s}$, njegova ploščina pa je $60\,\mathrm{m}$, ravno prevožena pot. Če hitrost enakomerno narašča, je lik trikotnik. Ko pa se graf ukrivi, potrebujemo nov način.

**2. Pravokotniki pod krivuljo.** Vzemimo najpreprostejšo krivuljo, $f(x) = x^2$ med $x = 0$ in $x = 1$. Predstavljaj si sliko: enotski kvadrat, v njem parabola, ki gre iz levega spodnjega v desni zgornji kot. Lik pod parabolo je tanek »rog« ob desnem robu.

Interval razdelimo na $n$ enako širokih delov, vsak je širok $\Delta x = \frac{1}{n}$. Nad vsakim delom narišemo pravokotnik. Parabola na $[0, 1]$ narašča. Če zato višino vzamemo na levem robu dela, so vsi pravokotniki pod krivuljo: njihova skupna ploščina je **spodnja vsota**. Če jo vzamemo na desnem robu, segajo čez krivuljo: to je **zgornja vsota**. Prava ploščina je vedno nekje vmes.

| $n$ | spodnja vsota | zgornja vsota | razlika |
|---|---|---|---|
| $4$ | $0{,}21875$ | $0{,}46875$ | $0{,}25$ |
| $10$ | $0{,}285$ | $0{,}385$ | $0{,}1$ |
| $100$ | $0{,}32835$ | $0{,}33835$ | $0{,}01$ |

Obe vsoti se stiskata k istemu številu, $\frac{1}{3}$. Lik pod parabolo zavzema natanko tretjino kvadrata. To je odkril že Arhimed, skoraj dva tisoč let pred iznajdbo odvoda.

:::premisli
Razlika med zgornjo in spodnjo vsoto je bila $0{,}25$; $0{,}1$ in $0{,}01$. Kolikšna bo pri $n = 1000$? Zakaj se tako lepo zmanjšuje?
---
$0{,}001$. Zgornja vsota ima iste pravokotnike kot spodnja, le premaknjene za en del v desno: izgubi prvega (višina $f(0) = 0$) in dobi novega na koncu (višina $f(1) = 1$, širina $\frac{1}{n}$). Razlika je torej $\frac{1}{n}$.
:::

V simulaciji spodaj (»Ploščina pod grafom in Riemannove vsote«) izberi funkcijo $x^2$ in počasi povečuj število pravokotnikov. Opazuj napako: pri vsakem pravilu (višina na levem robu, na desnem robu ali na sredini dela) se manjša, pri sredini pa najhitreje.

**3. Določeni integral.** Število, h kateremu se stiskajo vsote pravokotnikov, imenujemo **določeni integral** funkcije $f$ od $a$ do $b$ in ga zapišemo $\int_a^b f(x)\,dx$. Številu $a$ rečemo **spodnja meja**, številu $b$ **zgornja meja**, funkciji $f$ pa **integrand**. Znak $\int$ je raztegnjena črka S (vsota), $f(x)\,dx$ pa spominja na ploščino enega tankega pravokotnika z višino $f(x)$ in širino $dx$. Za razliko od nedoločenega integrala rezultat ni družina funkcij, ampak **eno število**.

**4. Zakaj pomaga odvajanje nazaj.** Naj bo $A(x)$ ploščina pod grafom od $a$ do $x$. Ko se $x$ premakne za majhen $h$ v desno, se ploščini doda tanek trak s širino $h$ in višino približno $f(x)$. Zato je $A(x + h) - A(x) \approx f(x) \cdot h$ in v limiti $A'(x) = f(x)$. Ploščina je torej primitivna funkcija integranda. Vsaka druga primitivna funkcija $F$ se od $A$ razlikuje le za konstanto, zato je $F(b) - F(a) = A(b) - A(a)$. Ker je $A(a) = 0$, za vsako primitivno funkcijo $F$ velja **Newton-Leibnizova formula**:

$$\int_a^b f(x)\,dx = F(b) - F(a)$$

Razliko krajše pišemo $F(x)\Big|_a^b$. Konstanta $C$ se pri odštevanju izniči, zato je ne pišemo. Preizkus: za $f(x) = x^2$ je $F(x) = \frac{x^3}{3}$ in $F(1) - F(0) = \frac{1}{3}$, natanko kot v tabeli.

**5. Predznak.** Kjer je graf pod osjo $x$, so »višine« pravokotnikov negativne, zato je tam integral negativen. Integral šteje ploščino nad osjo s plusom, pod osjo z minusom. Kadar iščeš **ploščino**, interval razdeli v ničlah funkcije in seštej absolutne vrednosti delnih integralov.

:::premisli
Napovej, koliko je $\int_{-1}^{1} x^3\,dx$, preden kaj računaš. Kolikšna pa je ploščina lika med grafom $y = x^3$ in osjo $x$ na tem intervalu?
---
Integral je $0$: graf je simetričen glede na izhodišče, del pod osjo je enako velik kot del nad njo. Ploščina pa je $2 \cdot \int_0^1 x^3\,dx = 2 \cdot \frac{1}{4} = \frac{1}{2}$.
:::

**6. Ploščina med krivuljama.** Če je na intervalu $[a, b]$ graf $g$ ves čas nad grafom $f$, je ploščina vmes $\int_a^b \bigl(g(x) - f(x)\bigr)\,dx$: zgornja minus spodnja. Tanek trak pri $x$ je namreč visok $g(x) - f(x)$, ne glede na to, kje leži os $x$.

**7. Prostornina vrtenine.** Graf $f$ zavrtimo okoli osi $x$. Nastane **vrtenina**, telo kot vaza ali žoga. Predstavljaj si, da jo narežeš kot salamo na tanke rezine. Vsaka rezina je skoraj valj s polmerom $f(x)$ in debelino $dx$, njena prostornina je $\pi f(x)^2\,dx$. Seštejemo vse rezine:

$$V = \pi \int_a^b f(x)^2\,dx$$

Kvadrat je tu zato, ker je osnovna ploskev rezine krog s ploščino $\pi r^2$.

## Rešeni primeri

### Primer 1 (lažji): štart šprinterja

Hitrost šprinterja v prvih štirih sekundah opisuje $v(t) = 4t - 0{,}5t^2$ (čas v sekundah, hitrost v $\mathrm{m/s}$). Koliko metrov preteče v tem času?

**Podatki:** $v(t) = 4t - 0{,}5t^2$ v $\mathrm{m/s}$, od $t = 0\,\mathrm{s}$ do $t = 4\,\mathrm{s}$
**Iščemo:** pot $s$

:::formula
$s = \int_0^4 v(t)\,dt = F(4) - F(0)$, kjer je $F' = v$
:::

**Rešitev:**

1. Primitivna funkcija po členih: $F(t) = 2t^2 - \frac{t^3}{6}$. Preizkus z odvajanjem: $F'(t) = 4t - 0{,}5t^2$.
2. Zgornja meja: $F(4) = 32 - \frac{64}{6} = \frac{64}{3} \approx 21{,}33$.
3. Spodnja meja: $F(0) = 0$.
4. $s = F(4) - F(0) \approx 21{,}3\,\mathrm{m}$.
5. Odgovor: šprinter v prvih štirih sekundah preteče približno $21{,}3\,\mathrm{m}$ in pri tem doseže hitrost $v(4) = 8\,\mathrm{m/s}$.

### Primer 2: ploščina, ko graf prečka os

Izračunaj ploščino lika med grafom $f(x) = x^2 - 2x - 3$ in osjo $x$ na intervalu $[0, 4]$.

**Podatki:** $f(x) = x^2 - 2x - 3$, $a = 0$, $b = 4$
**Iščemo:** ploščino $p$

:::formula
Interval razdeli v ničli, nato $p = \left|\int_0^3 f(x)\,dx\right| + \left|\int_3^4 f(x)\,dx\right|$
:::

**Rešitev:**

1. Ničle: $x^2 - 2x - 3 = (x - 3)(x + 1)$, na intervalu leži ničla $x = 3$. Na $[0, 3]$ je graf pod osjo, na $[3, 4]$ nad njo.
2. Primitivna funkcija: $F(x) = \frac{x^3}{3} - x^2 - 3x$, zato je $F(0) = 0$, $F(3) = -9$ in $F(4) = -\frac{20}{3}$.
3. Prvi del: $\int_0^3 f(x)\,dx = -9 - 0 = -9$, ploščina $9$.
4. Drugi del: $\int_3^4 f(x)\,dx = -\frac{20}{3} + 9 = \frac{7}{3}$.
5. Seštejemo: $p = 9 + \frac{7}{3} = \frac{34}{3} \approx 11{,}33$.
6. Odgovor: ploščina je $\frac{34}{3}$. Integral čez cel interval bi dal le $-\frac{20}{3}$, ker se dela odštejeta.

### Primer 3 (težji): prostornina žoge za ragbi

Žoga za ragbi je dolga $30\,\mathrm{cm}$, na sredini ima premer $18\,\mathrm{cm}$. Njen obris opišemo s parabolo $f(x) = 9 - \frac{x^2}{25}$ za $-15 \le x \le 15$ (vse v centimetrih). Koliko litrov zraka je v žogi?

**Podatki:** $f(x) = 9 - \frac{x^2}{25}$ v $\mathrm{cm}$, $a = -15\,\mathrm{cm}$, $b = 15\,\mathrm{cm}$, dolžina $30\,\mathrm{cm}$, premer $18\,\mathrm{cm}$
**Iščemo:** prostornino $V$ v litrih

:::formula
$V = \pi \int_{-15}^{15} f(x)^2\,dx$
:::

**Rešitev:**

1. Preverimo obris: $f(0) = 9$ (polmer na sredini) in $f(15) = 0$ (konica žoge).
2. Kvadriramo: $f(x)^2 = 81 - \frac{18x^2}{25} + \frac{x^4}{625}$.
3. Obris je simetričen, zato $V = 2\pi \int_0^{15} f(x)^2\,dx$: računamo samo polovico.
4. Primitivna funkcija: $G(x) = 81x - \frac{6x^3}{25} + \frac{x^5}{3125}$, $G(0) = 0$.
5. $G(15) = 1215 - 810 + 243 = 648$.
6. $V = 2\pi \cdot 648 = 1296\pi \approx 4071{,}5\,\mathrm{cm^3}$.
7. Ker je $1\,\mathrm{L} = 1000\,\mathrm{cm^3}$, je $V \approx 4{,}07\,\mathrm{L}$.
8. Odgovor: v žogi je približno $4{,}1$ litra zraka.

### Primer 4: zdaj ti

Na treningu imajo plastične stožce, visoke $30\,\mathrm{cm}$, s polmerom osnovne ploskve $10\,\mathrm{cm}$. Da jih veter ne odnese, jih napolnijo s peskom. Koliko peska gre v en stožec?

**Podatki:** višina $h = 30\,\mathrm{cm}$, polmer $r = 10\,\mathrm{cm}$
**Iščemo:** prostornino $V$

:::formula
$V = \pi \int_0^{30} f(x)^2\,dx$
:::

**Rešitev:**

1. Stožec položimo na bok, vrh v izhodišče, os stožca na os $x$. Plašč nastane z vrtenjem daljice od $(0, 0)$ do $(30, 10)$, torej $f(x) = \frac{x}{3}$.
2. Kvadrat integranda: $f(x)^2 = \frac{x^2}{9}$, zato $V = \pi \int_0^{30} \frac{x^2}{9}\,dx$.
3. Poišči primitivno funkcijo, vstavi meji in rezultat pretvori v litre.

:::premisli
Koliko je $V$?
---
$\int_0^{30} \frac{x^2}{9}\,dx = \frac{x^3}{27}\Big|_0^{30} = \frac{27000}{27} = 1000$, torej $V = 1000\pi \approx 3142\,\mathrm{cm^3} \approx 3{,}1\,\mathrm{L}$. Enako da formula za stožec $\frac{\pi r^2 h}{3}$.
:::

## Pogoste napake

- **Integral je kar ploščina.** »Izračunal sem $\int_0^4 f(x)\,dx$, to je ploščina.« Če graf prečka os, se deli pod osjo odštejejo (v Primeru 2 bi dobil $-\frac{20}{3}$ namesto $\frac{34}{3}$). Najprej poišči ničle, integriraj po delih in seštej absolutne vrednosti.
- **Meji v napačnem vrstnem redu.** $F(a) - F(b)$ da nasprotno predznačen rezultat. Vedno je »zgornja minus spodnja«: $F(b) - F(a)$.
- **$F(0)$ je vedno $0$.** Pri potencah drži, pri drugih funkcijah ne: za $F(x) = -\cos x$ je $F(0) = -1$, za $F(x) = e^x$ je $F(0) = 1$. Spodnjo mejo vedno izračunaj.
- **Prostornina brez kvadrata.** Kdor piše $V = \pi \int_a^b f(x)\,dx$, rezini pripiše ploskev $\pi r$ namesto ploščine kroga $\pi r^2$. Rezina je valj s ploščino osnovne ploskve $\pi f(x)^2$, zato pride $f$ pod integral na kvadrat. Pomaga preizkus s stožcem: formula mora dati $\frac{\pi r^2 h}{3}$.
- **Pri ploščini med krivuljama spodnja minus zgornja.** Rezultat je negativen. Odštevaj vedno graf, ki je višje, minus graf, ki je nižje.

## Povzetek

- Določeni integral $\int_a^b f(x)\,dx$ je limita vsot ploščin pravokotnikov pod grafom; rezultat je število.
- Newton-Leibnizova formula: $\int_a^b f(x)\,dx = F(b) - F(a)$, kjer je $F$ katera koli primitivna funkcija; $C$ se izniči.
- Integral šteje dele nad osjo s plusom, pod osjo z minusom. Za ploščino razdeli interval v ničlah in seštej absolutne vrednosti.
- Ploščina med krivuljama: $\int_a^b (g - f)\,dx$, kjer je $g$ zgoraj.
- Prostornina vrtenine okoli osi $x$: $V = \pi \int_a^b f(x)^2\,dx$.
- Pot je integral hitrosti po času: $s = \int_{t_1}^{t_2} v(t)\,dt$.

## Drugače: Z analogijo

Predstavljaj si števec kilometrov v avtu in merilnik hitrosti. Merilnik hitrosti kaže $f$, števec pa $F$: števec se spreminja tako hitro, kot kaže merilnik, zato je $F' = f$.

Koliko si prevozil med dvema trenutkoma? Ne seštevaš hitrosti, ampak pogledaš števec na koncu in na začetku ter odšteješ: $F(b) - F(a)$. Pri tem je vseeno, ali je števec na začetku kazal $0$ ali $85\,000\,\mathrm{km}$. Ta začetna vrednost je konstanta $C$, ki se pri odštevanju izgubi.

Prostornina vrtenine pa je kot kup kovancev različnih velikosti, naložen v stolpec. Vsak kovanec je tanek valj; prostornino stolpca dobiš, ko sešteješ ploščine vseh krogov, pomnožene z debelino kovanca.

## Drugače: Iz vsakdanjega življenja

Športna ura z GPS-om vsako sekundo zabeleži tvojo hitrost. Pot izračuna tako, da vsako hitrost pomnoži z eno sekundo in vse produkte sešteje. To je vsota pravokotnikov širine $1\,\mathrm{s}$ iz razlage. Pri teku je natančnost dovolj dobra, ker se hitrost v eni sekundi skoraj ne spremeni.

Podobno računa aplikacija za kolesarjenje porabljeno energijo: moč v vatih krat čas, seštevano vsako sekundo. Energija je ploščina pod grafom moči.

Tudi pri vrtenini ni treba daleč: kozarec, vaza ali pokal za zmagovalca turnirja nastanejo na stružnici, ki obris vrti okoli osi. Količino vode, ki gre v pokal, izračunaš z $V = \pi \int_a^b f(x)^2\,dx$, kjer je $f$ notranji obris.

## Preveri se

? Trener ima graf hitrosti kolesarja $v(t)$ v $\mathrm{m/s}$ za prvo minuto dirke. Kaj pove število $\int_0^{60} v(t)\,dt$?
- Povprečno hitrost kolesarja v prvi minuti.
~ Povprečna hitrost je ta integral, deljen s $60\,\mathrm{s}$. Integral sam ima enoto $\mathrm{m/s} \cdot \mathrm{s} = \mathrm{m}$.
+ Pot, ki jo kolesar prevozi v prvi minuti.
- Pospešek kolesarja ob koncu prve minute.
~ Pospešek je odvod hitrosti, ne integral. Integriranje gre v nasprotno smer: od hitrosti k poti.
- Največjo hitrost, ki jo kolesar doseže.
~ Največjo hitrost bi poiskal z odvodom ($v' = 0$). Integral sešteva vse hitrosti, pomnožene s časom.
> Integral hitrosti po času je ploščina pod grafom $v(t)$, enota je $\mathrm{m/s} \cdot \mathrm{s} = \mathrm{m}$: to je prevožena pot.

? Razvrsti integrale $I_1 = \int_0^1 x\,dx$, $I_2 = \int_0^1 x^2\,dx$ in $I_3 = \int_0^1 x^3\,dx$ od najmanjšega do največjega.
- $I_1 < I_2 < I_3$
~ Višja potenca ni večja: za $0 < x < 1$ je $x^3 < x^2 < x$, ker množenje s številom, manjšim od $1$, zmanjšuje.
+ $I_3 < I_2 < I_1$
- Vsi trije so enaki, ker imajo enake meje.
~ Enake meje pomenijo enako širok lik, višine grafov pa so različne.
> Na $(0, 1)$ leži graf $x^3$ pod grafom $x^2$, ta pa pod grafom $x$. Res: $I_3 = \frac{1}{4}$, $I_2 = \frac{1}{3}$, $I_1 = \frac{1}{2}$.

? Kaj se zgodi s prostornino vrtenine, če vse vrednosti funkcije $f$ podvojiš (obris je dvakrat dlje od osi), meji pa ostaneta enaki?
- Podvoji se.
~ Tako bi bilo pri ploščini pod grafom. Pri vrtenini je pod integralom $f^2$, ne $f$.
+ Poveča se štirikrat.
- Poveča se osemkrat.
~ Osemkrat bi se povečala, če bi podvojil tudi dolžino telesa (vse tri mere). Tu se dolžina ne spremeni.
> $V = \pi \int_a^b \bigl(2f(x)\bigr)^2\,dx = 4\pi \int_a^b f(x)^2\,dx$: vsaka rezina ima dvakrat večji polmer, zato štirikrat večjo ploskev.

? Koliko je $\int_1^3 2x\,dx$?
- $-8$
~ Odšteval si v napačnem vrstnem redu, $F(1) - F(3)$. Pravilno je zgornja minus spodnja.
- $9$
~ To je le $F(3)$. Odšteti moraš še vrednost pri spodnji meji, $F(1) = 1$.
+ $8$
- $4$
~ To je pravokotnik z višino $f(1) = 2$ in širino $2$. Funkcija pa na intervalu raste, zato je lik večji.
> $F(x) = x^2$, zato $\int_1^3 2x\,dx = 9 - 1 = 8$.

? Kolikšna je ploščina lika med grafom $f(x) = x^2 - 1$ in osjo $x$ na intervalu $[0, 2]$?
- $\frac{2}{3}$
~ To je $\int_0^2 f(x)\,dx$. Ker je graf na $[0, 1]$ pod osjo, se ta del odšteje od dela nad osjo.
- $\frac{4}{3}$
~ To je samo del nad osjo, na $[1, 2]$. Pozabil si lik pod osjo na $[0, 1]$.
+ $2$
- $-\frac{2}{3}$
~ To je samo integral na $[0, 1]$, ki je negativen. Ploščina ne more biti negativna.
> Ničla je $x = 1$. $\int_0^1 (x^2 - 1)\,dx = -\frac{2}{3}$, $\int_1^2 (x^2 - 1)\,dx = \frac{4}{3}$. Ploščina je $\frac{2}{3} + \frac{4}{3} = 2$.

:::simboli
f | integrand (funkcija pod integralom) | | | višina grafa nad točko $x$
x | neodvisna spremenljivka | | |
a | spodnja meja integrala | | |
b | zgornja meja integrala | | |
F | primitivna funkcija integranda | F' = f | |
V | prostornina vrtenine | V = \pi \int_a^b f(x)^2\,dx | cm^3 |
\pi | število pi | | – | razmerje med obsegom in premerom kroga
s | pot | s = \int v(t)\,dt | m |
v | hitrost | | m/s |
t | čas | | s |
G | primitivna funkcija za $f(x)^2$ | G' = f^2 | |
p | ploščina lika | | |
g | funkcija z zgornjim grafom pri ploščini med krivuljama | | |
A | ploščina pod grafom od $a$ do $x$ | A' = f | |
d | oznaka v $dx$ (spremenljivka integracije $x$) | | | $dx$ je širina tankega pravokotnika
:::
