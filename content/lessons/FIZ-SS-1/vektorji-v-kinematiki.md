---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tina se s kajakom odpravlja čez reko. Na zemljevidu je na drugem bregu, natanko nasproti izhodišča, označen pomol. Reka je tam široka $60\,\text{m}$ in teče s hitrostjo $0{,}8\,\text{m/s}$. Tina vesla s hitrostjo $1{,}5\,\text{m/s}$ glede na vodo in kajak ves čas usmerja pravokotno čez reko.

Bo pristala ob pomolu? Ne bo, saj jo tok med veslanjem nosi s seboj. Toda kje bo pristala? In koliko više ob reki, torej gorvodno, mora začeti, da bo prispela točno do pomola?

Na ta vprašanja odgovorita dve ideji. Prva: hitrost ima smer, zato dveh hitrosti ne seštevamo vedno kot navadna števila. Druga: gibanje čez reko in gibanje vzdolž reke potekata neodvisno drugo od drugega. Isti ideji pojasnita tudi, kam pade kamen, ki ga vržeš vodoravno z mostu.

## Razlaga

**Ena sekunda na zemljevidu.** Tina v eni sekundi preveslja $1{,}5\,\text{m}$ čez reko. V isti sekundi jo tok odnese $0{,}8\,\text{m}$ vzdolž reke. Narišimo oba premika drugega za drugim:

:::risba skica
opis: Premiki kajaka v eni sekundi. Navpična puščica 1,5 m je veslanje čez reko. Z njenega konca gre vodoravna puščica 0,8 m, premik s tokom. Poševna puščica od začetka do konca je dejanski premik, dolg 1,7 m. Puščice tvorijo pravokotni trikotnik.
območje: -1,9; -0,3 .. 2,6; 2,1
enota: 68
puščica: 0; 0 -> 0; 1,5 | veslanje 1,5 m | levo | modra
puščica: 0; 1,5 -> 0,8; 1,5 | tok 0,8 m | nad | modra
puščica: 0; 0 -> 0,8; 1,5 | dejanski premik 1,7 m | desno | oranžna debelo
točka: 0; 0 | izhodišče | pod
:::

Dejanski premik je poševna puščica. Ni dolg $1{,}5 + 0{,}8 = 2{,}3\,\text{m}$, ker premika ne kažeta v isto smer. Trije premiki tvorijo pravokotni trikotnik, zato dolžino poševne stranice da Pitagorov izrek. Premik v eni sekundi je hitrost, torej velja enako za hitrosti:

$$v = \sqrt{1{,}5^2 + 0{,}8^2}\,\text{m/s} = 1{,}7\,\text{m/s}$$

**Vektor.** Količina, ki ima poleg velikosti tudi smer, je **vektor**. Hitrost je vektor; rišemo jo s puščico, katere dolžina pove velikost. Dve hitrosti **sestavimo** tako, da drugo puščico narišemo z začetkom na koncu prve. Puščica od začetka prve do konca druge je **rezultanta**, skupna hitrost. Hitrosti, iz katerih je sestavljena, so njene **komponente**.

Tabela postavi znano in novo drugo ob drugo:

| smer hitrosti | slika | rezultanta |
|---|---|---|
| ista | $\to\to$ | $v_1 + v_2$ |
| nasprotna | $\to\leftarrow$ | $\lvert v_1 - v_2 \rvert$ |
| pravokotna | $\uparrow\to$ | $\sqrt{v_1^2 + v_2^2}$ |

Pri pravokotnih hitrostih je rezultanta večja od vsake komponente, a manjša od njune vsote.

**Kje Tina pristane.** Čas prečkanja določa samo hitrost čez reko $v_1$. Pri širini reke $d$ je $t = \dfrac{d}{v_1} = \dfrac{60\,\text{m}}{1{,}5\,\text{m/s}} = 40\,\text{s}$. Ves ta čas jo tok s hitrostjo $v_2$ nosi vzdolž reke, zato pristane $s = v_2 t = 0{,}8\,\text{m/s} \cdot 40\,\text{s} = 32\,\text{m}$ dolvodno od pomola (v smeri toka, na zemljevidu desno). Razdalji $s$ pravimo **zanos**. Tir na zemljevidu je ravna poševna črta:

:::risba graf
opis: Zemljevid reke, široke 60 m. Bregova sta vodoravni črti pri 0 in 60 m. Pomol je na drugem bregu natanko nasproti izhodišča. Tir kajaka je ravna poševna puščica od izhodišča do pristanka. V aplikaciji se hitrost toka spreminja z drsnikom; izbrano je {u} m/s, pristanek je {40*u} m dolvodno od pomola.
x: -20 .. 100 | 20 | vzdolž reke (m)
y: -10 .. 80 | 20 | čez reko (m)
drsnik: u | 0,4 .. 2 | 0,1 | 0,8 | hitrost toka (m/s)
črta: -20; 0 -> 100; 0 | siva debelo
črta: -20; 60 -> 100; 60 | siva debelo
puščica: 60; 15 -> 90; 15 | smer toka | nad | modra
točka: 0; 60 | pomol | nad levo
točka: 0; 0 | izhodišče | pod desno
puščica: 0; 0 -> 40*u; 60 | | | oranžna debelo
točka: 40*u; 60 | pristanek | nad | oranžna
podnapis: Tok {u} m/s: kajak pristane {40*u} m dolvodno od pomola.
:::

V aplikaciji premikaj drsnik hitrosti toka. Opazi dvoje: tir se nagiba, čas prečkanja pa ostane $40\,\text{s}$, zato je zanos sorazmeren s hitrostjo toka. Pri $1{,}6\,\text{m/s}$ je zanos dvakrat večji, $64\,\text{m}$. Odgovor za Tino: odriniti mora $32\,\text{m}$ gorvodno od pomola (na zemljevidu levo) in spet veslati pravokotno čez reko.

Lahko pa odrine kar nasproti pomola in kajak usmeri poševno gorvodno. Tedaj mora njena hitrost glede na vodo, $1{,}5\,\text{m/s}$, imeti gorvodno komponento $0{,}8\,\text{m/s}$, ki tok ravno izniči. Zdaj je $1{,}5\,\text{m/s}$ poševna stranica trikotnika:

:::risba skica
opis: Kajak, usmerjen poševno gorvodno. Poševna puščica 1,5 m/s je hitrost glede na vodo, kaže gor in levo. Z njenega konca gre vodoravna puščica 0,8 m/s v desno, tok. Navpična puščica od začetka do konca je dejanska hitrost čez reko, 1,27 m/s, naravnost proti pomolu.
območje: -2,4; -0,3 .. 1,9; 1,7
enota: 70
puščica: 0; 0 -> -0,8; 1,27 | veslanje 1,5 m/s | levo | modra
puščica: -0,8; 1,27 -> 0; 1,27 | tok 0,8 m/s | nad | modra
puščica: 0; 0 -> 0; 1,27 | čez reko 1,27 m/s | desno | oranžna debelo
točka: 0; 0 | izhodišče | pod
:::

Ostane ji $\sqrt{1{,}5^2 - 0{,}8^2}\,\text{m/s} \approx 1{,}27\,\text{m/s}$ čez reko, zato prečkanje traja $\dfrac{60\,\text{m}}{1{,}27\,\text{m/s}} \approx 47\,\text{s}$ namesto $40\,\text{s}$.

:::premisli
Reka po nevihti teče dvakrat hitreje. Tina vesla enako in kajak spet usmeri pravokotno čez reko. Napovej: bo na drugi breg prišla prej, pozneje ali enako hitro kot prej?
---
Enako hitro, po $40\,\text{s}$. Tok je pravokoten na smer čez reko, zato ne spremeni hitrosti čez reko, ta ostane $1{,}5\,\text{m/s}$. Spremeni se le, kje pristane: zanos se podvoji na $64\,\text{m}$.
:::

**Vodoravni met: dve znani gibanji hkrati.** Telo vržemo vodoravno s hitrostjo $v_0$, na primer kamen z mostu. Spet ločimo dve komponenti in vsako primerjamo z gibanjem, ki ga že poznaš:

- **Vodoravno** ni pospeška (zračni upor zanemarimo). To je premo enakomerno gibanje: $v_x = v_0$ in $x = v_0 t$.
- **Navpično** telo pospešuje navzdol z $g$, začetna navpična hitrost pa je $0$. To je natanko prosti pad: $v_y = g t$ in $y = \dfrac{g t^2}{2}$, kjer je $y$ padec pod začetno višino.

To lahko preveriš sam. Na rob mize položi dva kovanca. Z ravnilom udari tako, da prvi odleti vodoravno, drugi pa z roba le pade navzdol. Na tleh zaslišiš en sam »klik«: kovanca padeta hkrati. Razlog: navpično oba začneta z $v_y = 0$ in imata isti pospešek $g$, vodoravna hitrost pa navpičnega gibanja ne spremeni. Spodnja slika kaže, kaj se dogaja. Na njej sta lega telesa, ki prosto pade, in lega telesa, vrženega vodoravno z $v_0 = 2\,\text{m/s}$, vsako desetinko sekunde:

:::risba graf
opis: Stroboskopska slika dveh teles vsako desetinko sekunde. Levo telo pade navpično, desno je vrženo vodoravno z 2 m/s. Navpična os kaže višino glede na začetek, zato so lege pod začetkom negativne. Ob istem času sta telesi na isti višini: 0; 0,05; 0,20; 0,44 in 0,78 m pod začetkom. Vodoravni razmik desnega telesa je vsakič 0,2 m. Desno telo leti po paraboli.
x: -0,8 .. 1 | 0,2 | x (m)
y: -1 .. 0,1 | 0,2 | višina (m)
enako: da
oznake: ne
oznakax: 0 | 0
oznakax: 0,2 | 0,2
oznakax: 0,4 | 0,4
oznakax: 0,6 | 0,6
oznakax: 0,8 | 0,8
oznakax: 1 | 1
oznakay: 0 | 0
oznakay: -0,2 | −0,2
oznakay: -0,4 | −0,4
oznakay: -0,6 | −0,6
oznakay: -0,8 | −0,8
oznakay: -1 | −1
f: -1.22625*x^2 | oranžna | 0 .. 0,8
črta: -0,35; -0,049 -> 0,2; -0,049 | siva črtkano
črta: -0,35; -0,196 -> 0,4; -0,196 | siva črtkano
črta: -0,35; -0,441 -> 0,6; -0,441 | siva črtkano
črta: -0,35; -0,785 -> 0,8; -0,785 | siva črtkano
točka: -0,35; 0
točka: -0,35; -0,049 | 0,1 s | levo
točka: -0,35; -0,196 | 0,2 s | levo
točka: -0,35; -0,441 | 0,3 s | levo
točka: -0,35; -0,785 | 0,4 s | levo
točka: 0; 0 | | | oranžna
točka: 0,2; -0,049 | | | oranžna
točka: 0,4; -0,196 | | | oranžna
točka: 0,6; -0,441 | | | oranžna
točka: 0,8; -0,785 | | | oranžna
napis: 0,45; -0,12 | vodoravni met | desno
napis: -0,6; -0,9 | prosti pad | desno
:::

Vodoravni razmiki so enaki, $0{,}2\,\text{m}$ vsakič: vodoravno gibanje je enakomerno. Navpični razmiki rastejo kot pri prostem padu. Črtkane črte pokažejo, da sta telesi ob vsakem času na isti višini. Lege vrženega telesa ležijo na krivulji, ki se vse bolj sklanja navzdol. Zakaj je to **parabola**? Iz $x = v_0 t$ je $t = \dfrac{x}{v_0}$; vstavimo v $y = \dfrac{g t^2}{2}$ in dobimo $y = \dfrac{g}{2 v_0^2}\,x^2$. Padec je sorazmeren s kvadratom vodoravne razdalje, kot pri paraboli $y = k x^2$. Pri $v_0 = 2\,\text{m/s}$ je $k = \dfrac{9{,}81}{8} \approx 1{,}23\,\text{m}^{-1}$: pri dvakrat večjem $x$ je padec štirikrat večji.

| $t$ [s] | $x$ [m] | padec $y$ [m] | $v_y$ [m/s] |
|---|---|---|---|
| $0{,}1$ | $0{,}2$ | $0{,}05$ | $0{,}98$ |
| $0{,}2$ | $0{,}4$ | $0{,}20$ | $1{,}96$ |
| $0{,}3$ | $0{,}6$ | $0{,}44$ | $2{,}94$ |
| $0{,}4$ | $0{,}8$ | $0{,}78$ | $3{,}92$ |

:::premisli
Kovanec z iste mize odleti z dvakrat večjo hitrostjo. Kaj se zgodi s časom padanja in z razdaljo od mize, kjer pristane?
---
Čas ostane enak, ker je odvisen le od višine mize ($y = \dfrac{g t^2}{2}$ ne vsebuje $v_0$). Razdalja $x = v_0 t$ se podvoji, ker je čas enak in hitrost dvakrat večja.
:::

**Čas padanja in domet.** Telo pade na tla, ko je padec $y$ enak višini $h$. Iz $h = \dfrac{g t^2}{2}$ dobimo čas padanja $t = \sqrt{\dfrac{2h}{g}}$. Vodoravna razdalja do mesta padca je **domet** $x = v_0 t$.

:::risba graf
opis: Tir telesa, vrženega vodoravno z roba pečine. Siv pravokotnik je pečina, visoka {h} m, krivulja je parabola od roba do tal. V aplikaciji se začetna hitrost in višina spreminjata z drsnikoma; izbrano je v₀ = {v} m/s in h = {h} m, čas padanja je {sqrt(2*h/9.81):.2} s, domet {v*sqrt(2*h/9.81):.2} m.
x: -1 .. 11 | 1 | x (m)
y: 0 .. 11 | 1 | višina (m)
drsnik: v | 1 .. 6 | 0,5 | 3 | začetna hitrost v₀ (m/s)
drsnik: h | 2 .. 10 | 1 | 5 | višina pečine h (m)
pravokotnik: -1; 0 .. 0; h | siva ozadje
f: h - 4.905*x^2/v^2 | oranžna | 0 .. 11
točka: 0; h | rob | nad desno
točka: v*sqrt(2*h/9.81); 0 | | | oranžna
podnapis: v₀ = {v} m/s, h = {h} m: čas padanja {sqrt(2*h/9.81):.2} s, domet {v*sqrt(2*h/9.81):.2} m
:::

Na sliki je $v_0 = 3\,\text{m/s}$ in $h = 5\,\text{m}$: telo pada $1{,}01\,\text{s}$ in pristane $3{,}03\,\text{m}$ od pečine. V aplikaciji najprej premikaj samo začetno hitrost. Domet raste sorazmerno z njo, čas padanja v podnapisu pa se ne spremeni. Nato premikaj višino: zdaj se spremeni čas, a počasneje kot višina. Štirikrat višja pečina da le dvakrat daljši čas.

**Hitrost ob padcu.** Med letom sta komponenti hitrosti pravokotni: $v_x = v_0$ ostaja enaka, $v_y = g t$ raste. Velikost hitrosti dobimo z istim Pitagorovim izrekom kot pri kajaku:

$$v = \sqrt{v_x^2 + v_y^2}$$

V simulaciji spodaj »Poševni met: komponente hitrosti« nastavi kot na najmanjšo vrednost, $5^\circ$ (met je skoraj vodoraven), in začetno višino na $20\,\text{m}$. Med letom opazuj puščici komponent: vodoravna ostane ves čas enako dolga. Navpična pri $5^\circ$ na začetku za hip še kaže malo navzgor. Po delčku sekunde je enaka nič; od tam naprej je gibanje natanko vodoravni met, navpična puščica pa se navzdol enakomerno daljša.

## Rešeni primeri

### Primer 1: dron riše zemljevid

Dron snema polje za zemljevid. Glede na zrak leti s hitrostjo $6\,\text{m/s}$ proti severu, veter piha s hitrostjo $2{,}5\,\text{m/s}$ proti vzhodu. Kolikšna je hitrost drona glede na tla?

**Podatki:** $v_1 = 6\,\text{m/s}$ (proti severu), $v_2 = 2{,}5\,\text{m/s}$ (proti vzhodu)
**Iščemo:** velikost rezultante $v$

:::formula
Hitrosti sta pravokotni: $v = \sqrt{v_1^2 + v_2^2}$
:::

**Rešitev:**

1. Smeri sta pravokotni, zato hitrosti ne seštejemo, ampak uporabimo Pitagorov izrek.
2. $v_1^2 + v_2^2 = 36 + 6{,}25 = 42{,}25$ (v $\text{m}^2/\text{s}^2$).
3. $v = \sqrt{42{,}25}\,\text{m/s} = 6{,}5\,\text{m/s}$.
4. Smer: v vsaki sekundi dron preleti $6\,\text{m}$ proti severu in $2{,}5\,\text{m}$ proti vzhodu. Puščice tvorijo enak trikotnik kot pri kajaku:

:::risba skica
opis: Hitrosti drona. Navpična puščica 6 m/s kaže proti severu, z njenega konca gre vodoravna puščica 2,5 m/s proti vzhodu, veter. Poševna puščica od začetka do konca je hitrost glede na tla, 6,5 m/s.
območje: -4,2; -0,8 .. 5,4; 7,4
enota: 30
puščica: 0; 0 -> 0; 6 | sever 6 m/s | levo | modra
puščica: 0; 6 -> 2,5; 6 | veter 2,5 m/s | nad | modra
puščica: 0; 0 -> 2,5; 6 | 6,5 m/s | desno | oranžna debelo
:::

5. Odgovor: dron se glede na tla giblje s hitrostjo $6{,}5\,\text{m/s}$, večinoma proti severu in nekoliko proti vzhodu. Rezultanta je bližje severu, ker je severna komponenta več kot dvakrat večja od vzhodne.

### Primer 2: telefon zdrsne z mize

Telefon zdrsne z roba mize, visoke $0{,}80\,\text{m}$, s hitrostjo $1{,}5\,\text{m/s}$. Koliko časa pada in kako daleč od roba mize pristane?

**Podatki:** $h = 0{,}80\,\text{m}$, $v_0 = 1{,}5\,\text{m/s}$, $g = 9{,}81\,\text{m/s}^2$
**Iščemo:** čas padanja $t$ in domet $x$

:::formula
Navpično: $h = \dfrac{g t^2}{2}$, torej $t = \sqrt{\dfrac{2h}{g}}$. Vodoravno: $x = v_0 t$
:::

**Rešitev:**

1. Čas določa le navpično gibanje, ki je enako prostemu padu.
2. $t = \sqrt{\dfrac{2 \cdot 0{,}80\,\text{m}}{9{,}81\,\text{m/s}^2}} \approx 0{,}404\,\text{s}$.
3. Ves ta čas se telefon giblje vodoravno s stalno hitrostjo: $x = 1{,}5\,\text{m/s} \cdot 0{,}404\,\text{s} \approx 0{,}61\,\text{m}$.
4. Odgovor: telefon pada približno $0{,}40\,\text{s}$ in pristane približno $0{,}61\,\text{m}$ od roba mize.

### Primer 3: skakalci s pečine v Acapulcu

Turisti v mehiškem Acapulcu gledajo skakalce, ki skačejo v morje s pečine La Quebrada, visoke približno $35\,\text{m}$. Vzemimo, da skakalec skoči z nekoliko nižje skale, $h = 30\,\text{m}$, in recimo, da skale ob vznožju segajo $5\,\text{m}$ v morje. S kolikšno vodoravno hitrostjo se mora skakalec vsaj odriniti, da preleti skale? S kolikšno hitrostjo zadene vodo? Skakalca obravnavamo kot točko, zračni upor zanemarimo. (Voda v ozki soteski je plitva in njena globina je odvisna od valov, zato skakalci skok uskladijo z valom. Širina skal je naša predpostavka.)

**Podatki:** $h = 30\,\text{m}$, $x = 5\,\text{m}$, $g = 9{,}81\,\text{m/s}^2$
**Iščemo:** najmanjšo začetno hitrost $v_0$ in hitrost ob vstopu v vodo $v$

:::formula
$t = \sqrt{\dfrac{2h}{g}}$, $v_0 = \dfrac{x}{t}$, $v_y = g t$, $v = \sqrt{v_0^2 + v_y^2}$
:::

**Rešitev:**

1. Najprej čas iz višine, ker ga $v_0$ ne spremeni: $t = \sqrt{\dfrac{2 \cdot 30\,\text{m}}{9{,}81\,\text{m/s}^2}} \approx 2{,}47\,\text{s}$.
2. V tem času mora skakalec vodoravno preleteti vsaj $5\,\text{m}$, gibanje pa je enakomerno: $v_0 = \dfrac{5\,\text{m}}{2{,}47\,\text{s}} \approx 2{,}0\,\text{m/s}$.
3. Navpična komponenta ob vstopu v vodo je kot pri prostem padu z višine $h$: $v_y = g t = \sqrt{2 g h} = \sqrt{2 \cdot 9{,}81\,\text{m/s}^2 \cdot 30\,\text{m}} \approx 24{,}3\,\text{m/s}$.
4. Komponenti sta pravokotni: $v = \sqrt{(2{,}0\,\text{m/s})^2 + (24{,}3\,\text{m/s})^2} \approx 24\,\text{m/s}$.
5. Odgovor: zadošča odriv z okoli $2\,\text{m/s}$, kar je hitrost počasnega teka. Vodo zadene s približno $24\,\text{m/s}$ (okoli $88\,\text{km/h}$), skoraj navpično.

### Primer 4: zdaj ti

Učenec s telefonom posname žogico, ki se skotali s police. Na posnetku izmeri, da se je s police skotalila s hitrostjo $1{,}8\,\text{m/s}$ in pristala $0{,}90\,\text{m}$ od roba police. Kako visoka je polica in s kolikšno hitrostjo žogica prileti na tla?

**Podatki:** $v_0 = 1{,}8\,\text{m/s}$, $x = 0{,}90\,\text{m}$, $g = 9{,}81\,\text{m/s}^2$
**Iščemo:** višino police $h$ in hitrost ob padcu $v$

:::formula
$t = \dfrac{x}{v_0}$, $h = \dfrac{g t^2}{2}$, $v_y = g t$, $v = \sqrt{v_0^2 + v_y^2}$
:::

**Rešitev:**

1. Tokrat čas dobimo iz vodoravnega gibanja, ker poznamo hitrost in razdaljo: $t = \dfrac{0{,}90\,\text{m}}{1{,}8\,\text{m/s}} = 0{,}50\,\text{s}$.
2. Ta čas je tudi čas prostega pada s police. Izračunaj višino police in hitrost ob padcu sam, nato preveri:

:::premisli
Kako visoka je polica in s kolikšno hitrostjo žogica prileti na tla?
---
$h = \dfrac{9{,}81\,\text{m/s}^2 \cdot (0{,}50\,\text{s})^2}{2} \approx 1{,}2\,\text{m}$. Navpična komponenta: $v_y = 9{,}81\,\text{m/s}^2 \cdot 0{,}50\,\text{s} \approx 4{,}9\,\text{m/s}$. Hitrost: $v = \sqrt{(1{,}8\,\text{m/s})^2 + (4{,}9\,\text{m/s})^2} \approx 5{,}2\,\text{m/s}$, večinoma navzdol.
:::

## Pogoste napake

- **Hitrosti v različnih smereh seštevamo kot števila.** Kajak z $1{,}5\,\text{m/s}$ v toku z $0{,}8\,\text{m/s}$ nima hitrosti $2{,}3\,\text{m/s}$. Seštevanje velja le za isto smer. Pri pravokotnih hitrostih uporabi Pitagorov izrek: $\sqrt{2{,}25 + 0{,}64} = 1{,}7\,\text{m/s}$. Velja tudi obratno: za hitrosti na isti premici Pitagorov izrek ne velja, tam seštevaš ali odštevaš.
- **»Tok podaljša pot, zato prečkanje traja dlje.«** Pot je res daljša, a tudi hitrost je večja. Čas določa samo komponenta čez reko: $t = \dfrac{d}{v_1}$. Tok spremeni le, kje pristaneš.
- **»Hitreje vrženo telo dlje pada.«** Občutek pravi, da hitri kovanec »lebdi« dlje. Čas padanja pa je odvisen le od višine, ker je navpično gibanje enako prostemu padu. Večja $v_0$ poveča samo domet. Pri računanju časa pazi na $2$ in koren: $t = \sqrt{\dfrac{2h}{g}}$, ne $\sqrt{\dfrac{h}{g}}$ in ne $\dfrac{2h}{g}$.
- **»Vodoravna hitrost med letom pojema.«** Brez zračnega upora vodoravnega gibanja nič ne zavira, zato $v_x = v_0$ ostane enaka do tal. Spreminja se le $v_y$.
- **Hitrost ob padcu je $v_0 + g t$ (ali samo $g t$).** Komponenti sta pravokotni, zato ju ne seštejemo kot števil. Velikost hitrosti je $\sqrt{v_0^2 + (g t)^2}$: večja od vsake komponente, manjša od njune vsote.

## Povzetek

- Hitrost je vektor: ima velikost in smer, rišemo jo s puščico.
- Hitrosti v isti smeri seštejemo, v nasprotnih odštejemo, pri pravokotnih uporabimo Pitagorov izrek: $v = \sqrt{v_1^2 + v_2^2}$.
- Pravokotni komponenti gibanja sta neodvisni: ena ne spremeni časa ali hitrosti v drugi smeri. Čas prečkanja reke je $t = \dfrac{d}{v_1}$, zanos $s = v_2 t$.
- Vodoravni met: vodoravno $v_x = v_0$, $x = v_0 t$; navpično kot prosti pad, $v_y = g t$, $y = \dfrac{g t^2}{2}$.
- Čas padanja je $t = \sqrt{\dfrac{2h}{g}}$ in ni odvisen od $v_0$; domet je $x = v_0 t$; tir je parabola.
- Hitrost ob padcu: $v = \sqrt{v_0^2 + (g t)^2}$.

## Drugače: Z analogijo

Predstavljaj si, da vodoravni met snemata dve kameri. Prva je visoko nad prizoriščem in gleda navpično navzdol. Vidi le, kako se telo premika vzdolž tal: enakomerno, kot avto s tempomatom na ravni cesti. Druga kamera stoji daleč pred metalcem, v smeri meta, in gleda naravnost proti njemu, zato vodoravnega premika ne vidi. Zanjo telo preprosto prosto pade, kot kamen, spuščen z mostu.

Vsaka kamera vidi gibanje, ki ga že znaš izračunati. Pravi tir dobiš, ko oba posnetka sestaviš: ob vsakem času vzameš vodoravno lego s prve kamere in višino z druge. Ker kameri druga za drugo ne vesta, tudi komponenti druga na drugo ne vplivata.

Isto velja za kajak: kamera, ki z mostu gleda vzdolž reke, vidi samo veslanje čez reko. Kamera, ki z brega gleda čez reko, vidi samo zanos s tokom.

## Drugače: Iz vsakdanjega življenja

Na letališču hodiš po tekočem traku. Trak naj se giblje z $0{,}9\,\text{m/s}$, ti pa hodiš z $1{,}2\,\text{m/s}$. Če hodiš v smeri traku, se hitrosti seštejeta: $2{,}1\,\text{m/s}$, in prehitevaš ljudi ob traku. Če se obrneš in hodiš proti traku, se odštejeta: napreduješ le z $0{,}3\,\text{m/s}$.

Pravokotni hitrosti srečaš na trajektu. Trajekt pluje s $4\,\text{m/s}$, ti pa z $1{,}2\,\text{m/s}$ prečkaš krov od enega boka do drugega. Glede na morje se giblješ poševno s $\sqrt{4^2 + 1{,}2^2}\,\text{m/s} \approx 4{,}2\,\text{m/s}$: malo hitreje od trajekta in veliko manj kot $5{,}2\,\text{m/s}$.

Na vlaku, ki enakomerno vozi, vrži ključe navpično navzgor. Padejo ti nazaj v roko. Ključi imajo poleg navpične še vodoravno hitrost vlaka in jo ohranijo ves čas leta, tako kot ti. Opazovalec na peronu pa vidi, da ključi letijo po loku: zanj je to sestavljeno gibanje, vodoravno enakomerno in navpično pospešeno.

## Preveri se

? Katera trditev o vodoravnem metu (brez zračnega upora) **ne** drži?
- Vodoravna komponenta hitrosti ostane ves čas enaka.
~ Ta trditev drži: vodoravno ni pospeška, zato $v_x = v_0$ do tal.
- Navpično se telo giblje kot pri prostem padu.
~ Ta trditev drži: začetna navpična hitrost je $0$, pospešek pa $g$.
+ Telo, vrženo z večjo hitrostjo, pada dlje časa.
- Tir telesa je parabola.
~ Ta trditev drži: $x$ raste enakomerno, $y$ s kvadratom časa.
> Čas padanja je $t = \sqrt{\dfrac{2h}{g}}$ in ni odvisen od $v_0$. Večja začetna hitrost poveča le domet.

? Puščici na sliki kažeta komponenti hitrosti kamna, vrženega vodoravno, v nekem trenutku. En kvadratek pomeni $1\,\text{m/s}$. S kolikšno hitrostjo se kamen giblje v tem trenutku?
:::risba graf
opis: Mreža s kvadratki po 1 m/s. Vodoravna puščica je dolga 3 kvadratke in kaže v desno, navpična puščica je dolga 4 kvadratke in kaže navzdol. Obe izhajata iz iste točke. Poševna puščica od te točke do nasprotnega vogala pravokotnika kaže skupno hitrost.
x: 0 .. 5 | 1
y: -6 .. 0 | 1
enako: da
mreža: da
oznake: ne
črta: 4; -1 -> 4; -5 | siva črtkano
črta: 1; -5 -> 4; -5 | siva črtkano
puščica: 1; -1 -> 4; -1 | v_x | nad | modra
puščica: 1; -1 -> 1; -5 | v_y | levo | modra
puščica: 1; -1 -> 4; -5 | | | oranžna debelo
napis: 2,9; -2,6 | v | desno
:::
= 5 m/s | 0,1
~ 7 | Komponenti si seštel kot števili. Pravokotni komponenti sestaviš s Pitagorovim izrekom.
~ 1 | Komponenti si odštel. Rezultanta pravokotnih komponent je večja od vsake posebej.
~ 25 | To je $v^2$. Na koncu manjka še koren.
> $v_x = 3\,\text{m/s}$, $v_y = 4\,\text{m/s}$, zato $v = \sqrt{9 + 16}\,\text{m/s} = 5\,\text{m/s}$.

? Na zemljevidu sta dva tira Tininega kajaka čez reko, široko $60\,\text{m}$. Obakrat vesla s $1{,}5\,\text{m/s}$ pravokotno čez reko. Tir A je pri toku $0{,}8\,\text{m/s}$ (prečkanje traja $40\,\text{s}$), tir B pri dvakrat hitrejšem toku. Koliko časa traja prečkanje po tiru B?
:::risba graf
opis: Zemljevid reke, široke 60 m. Oba tira začneta v izhodišču. Tir A je poševna puščica do točke 32 m dolvodno na drugem bregu, tir B je bolj nagnjena puščica do točke 64 m dolvodno.
x: -10 .. 100 | 20 | vzdolž reke (m)
y: -10 .. 80 | 20 | čez reko (m)
črta: -10; 0 -> 100; 0 | siva debelo
črta: -10; 60 -> 100; 60 | siva debelo
puščica: 0; 0 -> 32; 60 | | | modra
puščica: 0; 0 -> 64; 60 | | | oranžna debelo
točka: 32; 60 | A | nad
točka: 64; 60 | B | nad
:::
+ $40\,\text{s}$, enako kot po tiru A.
- $80\,\text{s}$, ker je zanos dvakrat večji.
~ Zanos je večji, ker tok deluje enako dolgo, a dvakrat hitreje. Na čas prečkanja tok ne vpliva.
- Približno $58\,\text{s}$, ker je tir B daljši.
~ Tir B je res dolg okoli $88\,\text{m}$, a po njem se kajak giblje hitreje, s $\sqrt{1{,}5^2 + 1{,}6^2}\,\text{m/s} \approx 2{,}2\,\text{m/s}$. Daljša pot in večja hitrost dasta isti čas.
- $20\,\text{s}$, ker jo hitrejši tok bolj poganja.
~ Tok jo poganja vzdolž reke, ne čez reko. Hitrost čez reko ostane $1{,}5\,\text{m/s}$.
> Čas prečkanja je $t = \dfrac{d}{v_1} = \dfrac{60\,\text{m}}{1{,}5\,\text{m/s}} = 40\,\text{s}$ in tok ga ne spremeni. Hitrejši tok podvoji le zanos, z $32$ na $64\,\text{m}$.

? Kamen vržemo vodoravno z mostu, visokega $20\,\text{m}$, s hitrostjo $5\,\text{m/s}$. Učenec izračuna hitrost ob padcu v vodo. V katerem koraku je napaka?
- 1. $t = \sqrt{\dfrac{2 \cdot 20\,\text{m}}{9{,}81\,\text{m/s}^2}} \approx 2{,}02\,\text{s}$
~ Ta korak je pravilen: čas padanja določa le višina.
- 2. $x = 5\,\text{m/s} \cdot 2{,}02\,\text{s} \approx 10{,}1\,\text{m}$
~ Ta korak je pravilen: vodoravno je gibanje enakomerno. Za hitrost ob padcu sicer ni potreben.
- 3. $v_y = 9{,}81\,\text{m/s}^2 \cdot 2{,}02\,\text{s} \approx 19{,}8\,\text{m/s}$
~ Ta korak je pravilen: navpično je to prosti pad, $v_y = g t$.
+ 4. $v = 5\,\text{m/s} + 19{,}8\,\text{m/s} = 24{,}8\,\text{m/s}$
> Komponenti sta pravokotni, zato $v = \sqrt{(5\,\text{m/s})^2 + (19{,}8\,\text{m/s})^2} \approx 20{,}4\,\text{m/s}$.

? Razvrsti korake, s katerimi izračunaš hitrost ob padcu pri vodoravnem metu z znane višine.
1. Ugotovi, da je začetna navpična hitrost $0$, zato je navpično gibanje prosti pad.
2. Iz višine izračunaj čas padanja $t = \sqrt{\dfrac{2h}{g}}$.
3. Iz časa izračunaj navpično komponento hitrosti ob padcu $v_y = g t$.
4. Navpično komponento in $v_x = v_0$ sestavi s Pitagorovim izrekom: $v = \sqrt{v_0^2 + v_y^2}$.
> Vsak korak potrebuje rezultat prejšnjega: formula za čas velja, ker je navpično gibanje prosti pad; $v_y$ potrebuje čas; Pitagorov izrek potrebuje $v_y$.

? Z razglednega mostu nad sotesko, $45\,\text{m}$ nad vodo, vržemo kamenček vodoravno s hitrostjo $4\,\text{m/s}$. Kako daleč od navpičnice pod mostom pade v vodo?
= 12,1 m | 0,2
~ 36,7 | Za čas si vzel $\dfrac{2h}{g}$, to je $t^2$. Manjka še koren.
~ 8,6 | Za čas si vzel $\sqrt{\dfrac{h}{g}}$. Iz $h = \dfrac{g t^2}{2}$ sledi $t = \sqrt{\dfrac{2h}{g}}$.
~ 18,3 | Za čas si vzel $\dfrac{h}{g}$, brez korena. Iz $h = \dfrac{g t^2}{2}$ sledi $t = \sqrt{\dfrac{2h}{g}}$.
> $t = \sqrt{\dfrac{2 \cdot 45\,\text{m}}{9{,}81\,\text{m/s}^2}} \approx 3{,}03\,\text{s}$, zato $x = 4\,\text{m/s} \cdot 3{,}03\,\text{s} \approx 12{,}1\,\text{m}$.

<<RACUN
vrednost: sqrt(1.5^2+0.8^2) | 1.7
vrednost: 60/1.5 | 40
vrednost: 0.8*40 | 32
vrednost: 1.6*40 | 64
vrednost: sqrt(2*5/9.81) | 1.01
vrednost: 3*sqrt(2*5/9.81) | 3.03
vrednost: sqrt(6^2+2.5^2) | 6.5
vrednost: sqrt(2*0.80/9.81) | 0.404
vrednost: sqrt(1.5^2-0.8^2) | 1.27
vrednost: 60/sqrt(1.5^2-0.8^2) | ≈47
vrednost: sqrt(60^2+64^2) | ≈88
vrednost: sqrt(1.5^2+1.6^2) | 2.2
vrednost: sqrt(60^2+64^2)/1.5 | ≈58
vrednost: sqrt(4^2+1.2^2) | 4.2
vrednost: 9.81/(2*2^2) | 1.23
vrednost: 1.5*sqrt(2*0.80/9.81) | 0.61
vrednost: sqrt(2*30/9.81) | 2.47
vrednost: 5/sqrt(2*30/9.81) | 2.0
vrednost: sqrt(2*9.81*30) | 24.3
vrednost: 9.81*sqrt(2*30/9.81) | 24.3
vrednost: sqrt(2.0^2+24.3^2) | ≈24
vrednost: 3.6*sqrt((5/sqrt(2*30/9.81))^2+2*9.81*30) | ≈88
vrednost: 0.90/1.8 | 0.50
vrednost: 9.81*0.5^2/2 | 1.2
vrednost: 9.81*0.5 | 4.9
vrednost: sqrt(1.8^2+(9.81*0.5)^2) | 5.2
vrednost: sqrt(2*20/9.81) | 2.02
vrednost: 5*sqrt(2*20/9.81) | 10.1
vrednost: 9.81*sqrt(2*20/9.81) | 19.8
vrednost: 4*sqrt(2*45/9.81) | 12.1
vrednost: sqrt(25+(9.81*sqrt(40/9.81))^2) | 20.4
>>

:::simboli
v | velikost rezultantne hitrosti | v = \sqrt{v_x^2 + v_y^2} | m/s | za pravokotni hitrosti
v_1 | hitrost drona glede na zrak (kajaka glede na vodo) | | m/s
v_2 | hitrost vetra (toka reke) | | m/s
v_x | vodoravna komponenta hitrosti | | m/s | pri vodoravnem metu ves čas $v_0$
v_y | navpična komponenta hitrosti | v_y = g t | m/s
v_0 | začetna (vodoravna) hitrost | v_0 = \dfrac{x}{t} | m/s
h | višina, s katere telo pade | h = \dfrac{g t^2}{2} | m
g | težni pospešek | | m/s^2 | približno $9{,}81\,\mathrm{m/s^2}$
t | čas (padanja ali prečkanja reke) | t = \sqrt{\dfrac{2h}{g}} | s | pri reki $t = d/v_1$
x | vodoravna razdalja (domet) | x = v_0 t | m
y | padec pod začetno višino | y = \dfrac{g t^2}{2} | m
d | širina reke | | m
s | zanos ob toku | s = v_2 t | m
:::
