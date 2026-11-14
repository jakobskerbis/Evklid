---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ponoči je zapadlo $20\,\text{cm}$ snega. V šolskem parku sta dve gredici. Prva je kvadrat s stranico $4\,\text{m}$. Druga je romb s stranico $4\,\text{m}$, ki je precej »sploščen«: razdalja med njegovima vzporednima stranicama je le $2\,\text{m}$.

Tilen trdi: »Na obeh gredicah leži enako snega. Obe imata stranice po $4\,\text{m}$, torej enak obseg in enako ploščino.«

Obseg res imata enak: $4 \cdot 4 = 16\,\text{m}$. Kaj pa ploščina? Ploščina kvadrata je $16\,\text{m}^2$. Za romb Tilen te formule ne sme kar prepisati. Ko boš znal računati ploščino paralelograma, romba, trapeza in deltoida, boš njegovo trditev preveril sam. Isto znanje uporabiš, ko oceniš, koliko semena potrebuje njiva, koliko vode pade na travnik ali koliko papirja potrebuješ za zmaja.

## Razlaga

**Gradnik 1: obseg.** Obseg vsakega štirikotnika je vsota dolžin vseh štirih stranic: $o = a + b + c + d$. Pri likih z enakimi stranicami se zapis skrajša. Paralelogram ima dva para enakih stranic, zato je $o = 2(a + b)$. Romb ima vse štiri enake, zato je $o = 4a$. Deltoid ima dva para enakih sosednjih stranic, zato je tudi zanj $o = 2(a + b)$.

*Kratko vprašanje:* paralelogram ima stranici $9\,\text{cm}$ in $5\,\text{cm}$. Kolikšen je obseg? (Odgovor: $2 \cdot (9 + 5) = 28\,\text{cm}$.)

**Gradnik 2: paralelogram.** Iz papirja izreži paralelogram s stranico $a$. Iz enega oglišča nariši **višino** $v_a$: daljico, ki je pravokotna na stranico $a$ in sega do nasprotne stranice. Ob višini odreži pravokotni trikotnik in ga prestavi na drugo stran. Nastane pravokotnik s stranicama $a$ in $v_a$. Papirja ni ne več ne manj, zato:

$$S = a \cdot v_a$$

Poševna stranica $b$ ni višina. Je daljša od višine, zato bi $a \cdot b$ dal preveliko ploščino.

*Kratko vprašanje:* paralelogram ima $a = 9\,\text{cm}$, $b = 5\,\text{cm}$ in $v_a = 4\,\text{cm}$. Kolikšna je ploščina? (Odgovor: $9 \cdot 4 = 36\,\text{cm}^2$.)

V simulaciji spodaj (Ploščine štirikotnikov) izberi paralelogram, nastavi $a = 7$ in $v = 4$, nato premikaj drsnik »zamik vrha«. Lik se nagiba, poševna stranica se daljša, ploščina pa ostane $7 \cdot 4 = 28$ kvadratkov.

:::premisli
Paralelogram iz palčk s stranicama $6\,\text{cm}$ in $5\,\text{cm}$ stisneš, da se kot zmanjša. Kaj se zgodi z obsegom in kaj s ploščino?
---
Obseg ostane $2 \cdot (6 + 5) = 22\,\text{cm}$, ker se palčke ne spremenijo. Ploščina se zmanjša, ker se zmanjša višina. Enak obseg torej ne pomeni enake ploščine.
:::

**Gradnik 3: trapez.** Trapez ima vzporedni stranici $a$ in $c$, ki ju imenujemo **osnovnici**. Drugi dve stranici, $b$ in $d$, sta **kraka**. Višina $v$ je razdalja med osnovnicama. Vzemi dva enaka trapeza in drugega zasukaj za $180^\circ$. Ko ju zložiš skupaj, dobiš paralelogram z osnovnico $a + c$ in višino $v$. En trapez je polovica tega paralelograma:

$$S = \frac{(a + c) \cdot v}{2}$$

Obseg trapeza je vsota vseh štirih stranic, kraka sta tu potrebna. V ploščini kraka ne nastopata.

*Kratko vprašanje:* trapez ima osnovnici $7\,\text{cm}$ in $3\,\text{cm}$ ter višino $4\,\text{cm}$. Ploščina? (Odgovor: $\dfrac{(7 + 3) \cdot 4}{2} = 20\,\text{cm}^2$.)

:::premisli
Kaj da formula za trapez, če je $c = a$? Zakaj je to smiselno?
---
$\dfrac{(a + a) \cdot v}{2} = \dfrac{2a \cdot v}{2} = a \cdot v$, kar je ploščina paralelograma. Trapez z enako dolgima osnovnicama ima dva para vzporednih stranic, torej je paralelogram.
:::

**Gradnik 4: romb.** Romb je paralelogram, zato velja $S = a \cdot v$. Ima pa še eno lastnost: diagonali $e$ in $f$ sta pravokotni. Okoli romba nariši pravokotnik, katerega stranici sta dolgi kot diagonali. Diagonali razdelita pravokotnik na štiri manjše pravokotnike. Vsakega stranica romba razpolovi, en del je v rombu, drugi zunaj. Romb je zato natanko polovica velikega pravokotnika:

$$S = \frac{e \cdot f}{2}$$

*Kratko vprašanje:* romb ima diagonali $10\,\text{cm}$ in $4\,\text{cm}$. Ploščina? (Odgovor: $\dfrac{10 \cdot 4}{2} = 20\,\text{cm}^2$.)

**Gradnik 5: deltoid.** Tudi deltoid ima pravokotni diagonali, zato zanj velja ista slika s pravokotnikom in ista formula $S = \dfrac{e \cdot f}{2}$. Deltoid pa ni paralelogram, zato formula $a \cdot v$ zanj ne velja.

*Kratko vprašanje:* deltoid ima diagonali $9\,\text{cm}$ in $4\,\text{cm}$. Ploščina? (Odgovor: $\dfrac{9 \cdot 4}{2} = 18\,\text{cm}^2$.)

**Nazaj k snegu.** Romb na gredici je paralelogram z $a = 4\,\text{m}$ in $v = 2\,\text{m}$: $S = 4 \cdot 2 = 8\,\text{m}^2$. Kvadrat ima $16\,\text{m}^2$. Na rombu je pol manj snega, Tilen se je zmotil.

## Rešeni primeri

### Primer 1: njiva

Njiva ima obliko paralelograma. Stranici sta dolgi $120\,\text{m}$ in $75\,\text{m}$, razdalja med daljšima stranicama pa je $60\,\text{m}$. Izračunaj obseg in ploščino njive.

**Podatki:** $a = 120\,\text{m}$, $b = 75\,\text{m}$, $v_a = 60\,\text{m}$
**Iščemo:** obseg $o$ in ploščino $S$

:::formula
$o = 2(a + b)$, $S = a \cdot v_a$
:::

**Rešitev:**

1. Obseg: nasprotni stranici sta enaki, zato $o = 2 \cdot (120 + 75) = 2 \cdot 195 = 390\,\text{m}$.
2. Ploščina: višina $60\,\text{m}$ je razdalja med stranicama $a$, zato množimo z $a$: $S = 120 \cdot 60 = 7200\,\text{m}^2$.
3. Stranica $b = 75\,\text{m}$ v ploščini ne nastopa, ker ni pravokotna na $a$.
4. Odgovor: obseg njive je $390\,\text{m}$, ploščina $7200\,\text{m}^2$.

### Primer 2: travnik ob potoku

Travnik ima obliko pravokotnega trapeza. Ob potoku je dolg $80\,\text{m}$, ob poti $50\,\text{m}$; potok in pot sta vzporedna. Krak, ki je pravokoten na obe osnovnici, meri $40\,\text{m}$, poševni krak pa $50\,\text{m}$. Po nevihti je voda poplavila ves travnik. Kolikšna je poplavljena površina in koliko ograje je okoli travnika?

**Podatki:** $a = 80\,\text{m}$, $c = 50\,\text{m}$, $d = 40\,\text{m}$ (pravokotni krak), $b = 50\,\text{m}$
**Iščemo:** ploščino $S$ in obseg $o$

:::formula
$S = \dfrac{(a + c) \cdot v}{2}$, $o = a + b + c + d$
:::

**Rešitev:**

1. Pravokotni krak je hkrati razdalja med osnovnicama, zato $v = 40\,\text{m}$.
2. Vsota osnovnic: $80 + 50 = 130\,\text{m}$.
3. Pomnožimo z višino: $130 \cdot 40 = 5200$.
4. Delimo z $2$, ker je trapez polovica paralelograma: $5200 : 2 = 2600$, torej $S = 2600\,\text{m}^2$.
5. Obseg: $80 + 50 + 50 + 40 = 220\,\text{m}$.
6. Odgovor: poplavljena je površina $2600\,\text{m}^2$, ograje je $220\,\text{m}$.

### Primer 3: zmaj v vetru (težji)

Zmaj ima obliko deltoida. Prečna palica (diagonala $f$) je dolga $40\,\text{cm}$. Papir zmaja ima ploščino $1260\,\text{cm}^2$. Kako dolga je vzdolžna palica (diagonala $e$)? Stranice zmaja merijo $25\,\text{cm}$ in $52\,\text{cm}$. Koliko traku potrebujemo za rob zmaja?

**Podatki:** $f = 40\,\text{cm}$, $S = 1260\,\text{cm}^2$, $a = 25\,\text{cm}$, $b = 52\,\text{cm}$
**Iščemo:** diagonalo $e$ in obseg $o$

:::formula
$S = \dfrac{e \cdot f}{2}$, $o = 2(a + b)$
:::

**Rešitev:**

1. Formula je obrnjena: poznamo ploščino, iščemo diagonalo. Vstavimo podatke: $1260 = \dfrac{e \cdot 40}{2}$.
2. Obe strani pomnožimo z $2$: $e \cdot 40 = 2 \cdot 1260 = 2520$.
3. Delimo s $40$: $e = 2520 : 40 = 63\,\text{cm}$.
4. Preizkus: $\dfrac{63 \cdot 40}{2} = 1260$. ✓
5. Obseg: $o = 2 \cdot (25 + 52) = 2 \cdot 77 = 154\,\text{cm}$. Diagonal v obseg ne štejemo, ker nista na robu.
6. Odgovor: vzdolžna palica je dolga $63\,\text{cm}$, traku potrebujemo $154\,\text{cm}$.

### Primer 4: zdaj ti

Ribnik v obliki romba je zamrznil. Stranica romba meri $10\,\text{m}$, diagonali pa $16\,\text{m}$ in $12\,\text{m}$. Kolikšna je ploščina ledu in kolikšna je razdalja med nasprotnima stranicama romba (višina)?

**Podatki:** $a = 10\,\text{m}$, $e = 16\,\text{m}$, $f = 12\,\text{m}$
**Iščemo:** ploščino $S$ in višino $v$

:::formula
$S = \dfrac{e \cdot f}{2}$ in $S = a \cdot v$
:::

**Rešitev:**

1. Iz diagonal: $S = \dfrac{16 \cdot 12}{2} = 96\,\text{m}^2$.
2. Romb je paralelogram, zato velja tudi $S = a \cdot v$, torej $96 = 10 \cdot v$.
3. Izračunaj $v$ in zapiši odgovor.

:::premisli
Kolikšna je višina romba?
---
$v = 96 : 10 = 9{,}6\,\text{m}$. Odgovor: led pokriva $96\,\text{m}^2$, višina romba je $9{,}6\,\text{m}$. Višina je krajša od stranice, kar je pri rombu, ki ni kvadrat, pravilno.
:::

## Pogoste napake

- **Stranica namesto višine.** Kot Tilen: pri paralelogramu ali rombu množiš sosednji stranici. Tako dobiš ploščino pravokotnika, ki je večja. Vstavi višino, ki je pravokotna na osnovnico.
- **Enak obseg, »torej« enaka ploščina.** Paralelogram iz istih palčk ima pri različnih kotih različno ploščino. Obseg in ploščina sta različni količini in ju računaš posebej.
- **Brez deljenja z $2$ ali z deljenjem tam, kjer ga ni.** Pri trapezu, rombu (z diagonalama) in deltoidu je v formuli deljenje z $2$. Pri paralelogramu ga ni, $S = a \cdot v_a$. Deljenje z $2$ pri paralelogramu je zamenjava s formulo za trikotnik.
- **Osnovnici zmnožiš namesto seštevaš.** Pri trapezu je v števcu $(a + c) \cdot v$, ne $a \cdot c \cdot v$.
- **Diagonale ali višine v obsegu.** Obseg je samo rob lika. Diagonala in višina sta znotraj lika.

## Povzetek

| lik | obseg | ploščina |
|---|---|---|
| paralelogram | $2(a + b)$ | $a \cdot v_a$ |
| trapez | $a + b + c + d$ | $\dfrac{(a + c) \cdot v}{2}$ |
| romb | $4a$ | $a \cdot v$ ali $\dfrac{e \cdot f}{2}$ |
| deltoid | $2(a + b)$ | $\dfrac{e \cdot f}{2}$ |

- Višina je pravokotna na osnovnico; poševna stranica ni višina.
- Paralelogram je pravokotnik po prestavitvi trikotnika; trapez je pol paralelograma; romb in deltoid sta pol pravokotnika iz diagonal.
- Enak obseg ne pomeni enake ploščine.
- Obseg je v dolžinskih enotah ($\text{m}$), ploščina v kvadratnih ($\text{m}^2$). Mere pred računom izrazi v isti enoti.

## Drugače: Na sliki

Predstavljaj si vse štiri like narisane na karirastem papirju, en kvadratek je $1\,\text{cm}^2$.

**Paralelogram** ($a = 7$, $v_a = 4$): na levi strani leži pravokotni trikotnik, ki štrli čez navpično črto višine. Odreži ga in ga prestavi na desno. Lik postane pravokotnik $7$ krat $4$, to je $28$ kvadratkov.

**Trapez** ($a = 7$, $c = 3$, $v = 4$): poleg njega nariši enak trapez, obrnjen na glavo. Skupaj tvorita paralelogram z osnovnico $7 + 3 = 10$ in višino $4$, to je $40$ kvadratkov. En trapez je pol: $20$ kvadratkov.

**Romb in deltoid** ($e = 8$, $f = 6$): okoli lika nariši pravokotnik $8$ krat $6$, ki ima $48$ kvadratkov. Diagonali ga razdelita na štiri pravokotnike. Stranica lika vsakega razreže na dva enaka trikotnika: eden je v liku, drugi zunaj. Lik ima $24$ kvadratkov, pol pravokotnika.

## Drugače: Bolj natančno

**Od kod formula za trapez?** Trapez z osnovnicama $a$, $c$ in višino $v$ zasukamo za $180^\circ$ okoli razpolovišča kraka $b$. Kopija in izvirnik skupaj tvorita paralelogram z osnovnico $a + c$ in višino $v$. Njegova ploščina je $(a + c) \cdot v$, trapez je polovica.

**Od kod $\dfrac{e \cdot f}{2}$?** Diagonala $e$ razdeli romb ali deltoid na dva trikotnika z osnovnico $e$. Diagonala $f$ je pravokotna na $e$, zato sta njena dela $f_1$ in $f_2$ višini teh trikotnikov, $f_1 + f_2 = f$:

$$S = \frac{e \cdot f_1}{2} + \frac{e \cdot f_2}{2}$$

$$S = \frac{e \cdot (f_1 + f_2)}{2} = \frac{e \cdot f}{2}$$

**Obe formuli za romb se ujemata.** Romb s stranico $5\,\text{cm}$ in diagonalama $8\,\text{cm}$ in $6\,\text{cm}$ ima $S = \dfrac{8 \cdot 6}{2} = 24\,\text{cm}^2$. Njegova višina je zato $24 : 5 = 4{,}8\,\text{cm}$ in res je $5 \cdot 4{,}8 = 24$.

**Zakaj ima kvadrat največjo ploščino?** Pri paralelogramu s stranicama $a$ in $b$ je višina $v_a$ kvečjemu tako dolga kot $b$; enaka je le, če je kot pravi. Zato je $S = a \cdot v_a \le a \cdot b$. Med vsemi rombi s stranico $4\,\text{m}$ ima zato največjo ploščino kvadrat, $16\,\text{m}^2$.

## Preveri se

? Trapez ima osnovnici $9\,\text{cm}$ in $5\,\text{cm}$ ter višino $6\,\text{cm}$. Kolikšna je ploščina?
- $84\,\text{cm}^2$
~ Pozabil si deliti z $2$. Trapez je pol paralelograma.
+ $42\,\text{cm}^2$
- $135\,\text{cm}^2$
~ Osnovnici si zmnožil. V formuli ju seštejemo: $(a + c) \cdot v$.
- $20\,\text{cm}^2$
~ To je vsota $9 + 5 + 6$. Ploščino dobimo z množenjem.
> $S = \dfrac{(9 + 5) \cdot 6}{2} = \dfrac{84}{2} = 42\,\text{cm}^2$.

? Kaj velja za ploščino likov s pravokotnima diagonalama?
- Ploščina romba je $e + f$.
~ Vsota diagonal ni ploščina; diagonali zmnožimo in delimo z $2$.
- Ploščina deltoida je $a \cdot v$, kot pri paralelogramu.
~ Deltoid ni paralelogram, zato $a \cdot v$ zanj ne velja.
+ Ploščina romba in deltoida je $\dfrac{e \cdot f}{2}$.
- Ploščina deltoida je $e \cdot f$.
~ To je ploščina pravokotnika okoli deltoida. Deltoid je natanko njegova polovica.
> Romb in deltoid zavzameta pol pravokotnika s stranicama $e$ in $f$.

? Rok je izračunal ploščino paralelograma z $a = 12\,\text{cm}$, $b = 7\,\text{cm}$ in $v_a = 5\,\text{cm}$: $S = 12 \cdot 7 = 84\,\text{cm}^2$. Kje je napaka?
+ Namesto višine je vzel poševno stranico; pravilno je $S = 12 \cdot 5 = 60\,\text{cm}^2$.
- Pozabil je deliti z $2$; pravilno je $42\,\text{cm}^2$.
~ Deljenje z $2$ je pri trikotniku in trapezu, pri paralelogramu ne.
- Napake ni.
~ Stranica $b$ je poševna, zato ni razdalja med vzporednima stranicama.
- Moral bi računati $2 \cdot (12 + 7) = 38\,\text{cm}^2$.
~ To je obseg in ima enoto $\text{cm}$, ne $\text{cm}^2$.
> Ploščina paralelograma je $a \cdot v_a = 12 \cdot 5 = 60\,\text{cm}^2$.

? Romb ima diagonali $10\,\text{cm}$ in $6\,\text{cm}$. Paralelogram ima stranici $10\,\text{cm}$ in $5\,\text{cm}$, višina na daljšo stranico je $3\,\text{cm}$. Kateri lik ima večjo ploščino?
- Romb, ker je $10 \cdot 6 = 60$ več kot $30$.
~ Pri rombu je treba zmnožek diagonal deliti z $2$.
- Paralelogram, ker je $10 \cdot 5 = 50$ več kot $30$.
~ $5\,\text{cm}$ je poševna stranica, ne višina.
+ Ploščini sta enaki.
> Romb: $\dfrac{10 \cdot 6}{2} = 30\,\text{cm}^2$. Paralelogram: $10 \cdot 3 = 30\,\text{cm}^2$.

? Streha planinske koče ima obliko enakokrakega trapeza z osnovnicama $14\,\text{m}$ in $8\,\text{m}$, krakoma po $5\,\text{m}$ in višino $4\,\text{m}$. Po sneženju je na vsakem kvadratnem metru $50\,\text{kg}$ snega. Koliko snega je na strehi?
- $4400\,\text{kg}$
~ Pozabil si deliti z $2$; ploščina je $44\,\text{m}^2$, ne $88\,\text{m}^2$.
- $2750\,\text{kg}$
~ Namesto višine $4\,\text{m}$ si vstavil krak $5\,\text{m}$.
- $1600\,\text{kg}$
~ To je obseg strehe $32\,\text{m}$ krat $50$. Sneg pokriva ploskev, zato potrebuješ ploščino.
+ $2200\,\text{kg}$
> $S = \dfrac{(14 + 8) \cdot 4}{2} = 44\,\text{m}^2$, snega je $44 \cdot 50 = 2200\,\text{kg}$.

:::simboli
S | ploščina štirikotnika | | | paralelogram a · v_a, trapez (a + c) · v : 2
o | obseg štirikotnika | o = a + b + c + d | | paralelogram: o = 2(a + b)
a | stranica (osnovnica) | | | pri trapezu ena od osnovnic
b | sosednja stranica | | | pri trapezu krak
c | druga osnovnica trapeza | | | vzporedna z a
d | drugi krak trapeza | |
v_a | višina na stranico a | |
v | višina (razdalja med osnovnicama) | | | pri rombu višina na stranico a
e, f | diagonali | | | pri rombu in deltoidu pravokotni: S = e · f : 2
f_1, f_2 | dela diagonale f | | | f₁ + f₂ = f
:::
