---
stanje: osnutek
demo: linearna
avtor: AI
---

## Zakaj se tega učimo

Ob 20.00 začneš na telefonu gledati prenos v živo: sonda bo ob 23.30 pristala na Marsu. Baterija ima še $60\,\%$, prenos videa pa jo vsako uro izprazni za $15\,\%$. Polnilnik je ostal pri prijatelju. Boš pristanek še videl?

Odstotek baterije po $x$ urah opiše linearna funkcija $y = -15x + 60$: začetna vrednost je $n = 60$, smerni koeficient pa $k = -15$, ker baterija pada. Pravo vprašanje je: pri katerem $x$ bo $y = 0$? Na grafu je to točka, kjer premica prečka os $x$. Tako vprašanje si postavljajo tudi inženirji pri vesoljskih poletih: kdaj bo pristajalni modul na tleh, kdaj bo raketi zmanjkalo goriva. Ko znaš graf narisati in iz njega prebrati, kje seka obe osi, na taka vprašanja odgovoriš v eni vrstici.

## Razlaga

Iz lekcije Linearna funkcija veš, da je graf funkcije $y = kx + n$ premica, da je $k$ smerni koeficient in $n$ začetna vrednost. Zdaj to uporabimo pri risanju.

**1. Graf iz tabele.** Za $y = -2x + 4$ izberemo nekaj vrednosti $x$ in izračunamo $y$:

| $x$ | $y = -2x + 4$ |
|---|---|
| $-1$ | $6$ |
| $0$ | $4$ |
| $1$ | $2$ |
| $2$ | $0$ |
| $3$ | $-2$ |

Točke vrišemo v koordinatni sistem in skoznje z ravnilom potegnemo premico, podaljšano čez skrajni točki. Ker je graf premica, zadoščata dve točki. Tretja služi za preverjanje: če ne leži na premici, smo se nekje zmotili.

*Hitro preveri:* ali točka $(3, -2)$ leži na grafu? (Da: $-2 \cdot 3 + 4 = -2$.)

**2. Hitro risanje s $k$ in $n$.** Začnemo v točki $(0, n)$ na osi $y$. Od tam naredimo **stopnico**: $1$ v desno in za $k$ navzgor, pri negativnem $k$ navzdol. Pri $y = -2x + 4$ gremo iz $(0, 4)$ za $1$ desno in $2$ dol, v točko $(1, 2)$, in še enkrat, v $(2, 0)$.

*Hitro preveri:* kam prideš iz $(0, 1)$, če je $k = 3$? (V točko $(1, 4)$.)

:::premisli
Pri $y = \dfrac{1}{2}x - 1$ bi morala stopnica iti le pol enote navzgor, kar je težko natančno narisati. Kako lahko narišeš to premico brez polovic?
---
Narediš dvojno stopnico: $2$ v desno in $1$ navzgor. Iz $(0, -1)$ prideš v točko $(2, 0)$. To velja, ker $k = \dfrac{1}{2}$ pomeni pol enote navzgor na vsako enoto v desno, torej celo enoto navzgor na dve enoti v desno.
:::

**3. Presečišče z osjo $y$.** Vse točke na osi $y$ imajo prvo koordinato $x = 0$. Vstavimo: $y = k \cdot 0 + n = n$. Presečišče z osjo $y$ je točka $(0, n)$. Pri $y = -2x + 4$ je to $(0, 4)$.

*Hitro preveri:* kje graf funkcije $y = 2x - 8$ seka os $y$? (V točki $(0, -8)$.)

**4. Ničla in presečišče z osjo $x$.** Točke na osi $x$ imajo drugo koordinato $y = 0$. **Ničla** funkcije je tisto število $x$, pri katerem je $y = 0$. Dobimo jo kot rešitev enačbe $kx + n = 0$. Od tod je $kx = -n$. Če je $k \ne 0$, smemo deliti s $k$ (z $0$ deliti ne smemo):

$$x = -\frac{n}{k}.$$

Presečišče z osjo $x$ je točka $\left(-\dfrac{n}{k}, 0\right)$. Pri $y = -2x + 4$ rešimo $-2x + 4 = 0$, torej $-2x = -4$ in $x = 2$. Presečišče je $(2, 0)$.

:::risba graf
opis: Graf funkcije y = −2x + 4. Premica pada od leve proti desni. Os y seka v točki (0, 4), os x v točki (2, 0). Označena je še točka (3, −2) za preverjanje.
x: -2 .. 4 | 1 | x
y: -3 .. 7 | 1 | y
f: -2*x + 4 | modra
točka: 0; 4 | (0, 4) | desno
točka: 2; 0 | ničla (2, 0) | desno
točka: 3; -2 | (3, −2) | levo
podnapis: Presečišči z osema sta dovolj za risanje, tretja točka je preizkus.
:::

Zdaj znaš odgovoriti tudi na vprašanje s telefonom: iz $-15x + 60 = 0$ sledi $-15x = -60$ in $x = 4$. Baterija se izprazni po $4$ urah, ob polnoči, torej pristanek ob 23.30 še vidiš.

*Hitro preveri:* kolikšna je ničla funkcije $y = 2x - 8$? (Odgovor: $x = 4$.)

**5. Posebni primeri.**

- Če je $k = 0$ in $n \ne 0$, je $y = n$ pri vsakem $x$. Graf je vodoravna premica, ki osi $x$ nikoli ne doseže: funkcija **nima ničle**. Primer: $y = 3$.
- Če je $k = 0$ in $n = 0$, je $y = 0$: graf je kar os $x$ in vsak $x$ je ničla.
- Če je $n = 0$ in $k \ne 0$, gre graf skozi izhodišče in ničla je $x = 0$.

:::premisli
Premica s $k = 0{,}01$ je skoraj vodoravna. Ali obstaja linearna funkcija s $k \ne 0$, katere graf osi $x$ nikoli ne doseže? Zakaj?
---
Ne obstaja. Pri $k \ne 0$ premica ni vodoravna: v eno smer se dviga, v drugo spušča, zato os $x$ prečka natanko enkrat. Tudi računsko vedno dobimo eno ničlo $x = -\dfrac{n}{k}$, ker s $k \ne 0$ smemo deliti.
:::

**6. Graf v besedilni nalogi.** Pri telefonu imajo smisel le časi od $0$ do $4$ ur: prej prenosa še ni, pozneje bi bila baterija negativna. Zato narišemo le **daljico** od $(0, 60)$ do $(4, 0)$. Če ima smisel vsak $x \ge 0$ brez konca, narišemo **poltrak**, ki se začne na osi $y$.

*Hitro preveri:* zakaj pri telefonu ne rišemo točke za $x = 5$? (Ker bi bil $y = -15$, baterija pa ne more imeti $-15\,\%$.)

## Rešeni primeri

### Primer 1: graf iz predpisa

Nariši graf funkcije $y = 2x + 1$.

**Podatki:** predpis $y = 2x + 1$
**Iščemo:** graf (vsaj tri točke na premici)

:::formula
$y = kx + n$: graf začnemo v $(0, n)$, stopnica je $1$ v desno in $k$ navzgor.
:::

**Rešitev:**

1. Iz predpisa preberemo $k = 2$ in $n = 1$. Ker je $k > 0$, funkcija narašča.
2. Izračunamo tabelo:

| $x$ | $0$ | $1$ | $2$ |
|---|---|---|---|
| $y = 2x + 1$ | $1$ | $3$ | $5$ |

3. Točke $(0, 1)$, $(1, 3)$ in $(2, 5)$ vrišemo in skoznje potegnemo premico.
4. Preizkus s stopnico: iz $(0, 1)$ gremo $1$ v desno in $2$ navzgor ter pridemo v $(1, 3)$, ki je že v tabeli.

:::risba graf
opis: Graf funkcije y = 2x + 1. Premica narašča in gre skozi točke (0, 1), (1, 3) in (2, 5).
x: -3 .. 3 | 1 | x
y: -3 .. 7 | 1 | y
f: 2*x + 1 | modra
točka: 0; 1 | (0, 1) | levo
točka: 1; 3 | (1, 3) | levo
točka: 2; 5 | (2, 5) | levo
:::

5. Odgovor: graf je naraščajoča premica skozi $(0, 1)$, $(1, 3)$ in $(2, 5)$.

### Primer 2: presečišči z osema

Za funkcijo $y = -\dfrac{1}{2}x + 3$ poišči ničlo in presečišči grafa z osema ter graf nariši.

**Podatki:** predpis $y = -\dfrac{1}{2}x + 3$
**Iščemo:** ničlo, presečišče z osjo $y$ in presečišče z osjo $x$

:::formula
Presečišče z osjo $y$: $(0, n)$. Ničla: rešitev enačbe $kx + n = 0$, presečišče z osjo $x$ je $(\text{ničla}, 0)$.
:::

**Rešitev:**

1. **Presečišče z osjo $y$:** pri $x = 0$ je $y = 3$, točka $(0, 3)$.
2. **Ničla:** postavimo $y = 0$ in rešimo enačbo $-\dfrac{1}{2}x + 3 = 0$. Odštejemo $3$: $-\dfrac{1}{2}x = -3$. Pomnožimo z $-2$, da ostane sam $x$: $x = 6$.
3. **Presečišče z osjo $x$:** $(6, 0)$.
4. **Preizkus:** $-\dfrac{1}{2} \cdot 6 + 3 = -3 + 3 = 0$.
5. Ker je $k = -\dfrac{1}{2} < 0$, funkcija pada. Res: od $(0, 3)$ do $(6, 0)$ gremo navzdol. Graf narišemo skozi ti dve točki.
6. Odgovor: ničla je $x = 6$, presečišči sta $(0, 3)$ in $(6, 0)$.

### Primer 3: pristanek na Marsu

Pristajalni modul je $60\,\mathrm{m}$ nad površjem Marsa. Od tam se spušča enakomerno, vsako sekundo za $1{,}5\,\mathrm{m}$. Zapiši višino $y$ (v metrih) v odvisnosti od časa $x$ (v sekundah), poišči ničlo in povej, kaj pomeni. Nariši graf. Čez koliko sekund je modul $15\,\mathrm{m}$ nad tlemi?

**Podatki:** začetna višina $60\,\mathrm{m}$; spuščanje $1{,}5\,\mathrm{m}$ vsako sekundo; iskana višina $15\,\mathrm{m}$
**Iščemo:** predpis, ničlo (čas pristanka), graf in čas, ko je $y = 15\,\mathrm{m}$

:::formula
$y = kx + n$; ničla je rešitev enačbe $kx + n = 0$.
:::

**Rešitev:**

1. Pri $x = 0$ je višina $60\,\mathrm{m}$, zato $n = 60$. Višina vsako sekundo pade za $1{,}5\,\mathrm{m}$, zato $k = -1{,}5$. Predpis: $y = -1{,}5x + 60$.
2. **Ničla:** rešimo enačbo $-1{,}5x + 60 = 0$. Dobimo $-1{,}5x = -60$ in $x = 40$. Ničla pomeni trenutek, ko je višina $0$: modul pristane po $40\,\mathrm{s}$.
3. **Graf:** smisel imajo le časi od $0$ do $40\,\mathrm{s}$, zato narišemo daljico od $(0, 60)$ do $(40, 0)$.

:::risba graf
opis: Graf višine pristajalnega modula. Vodoravna os je čas od 0 do 45 sekund, navpična os višina od 0 do 70 metrov. Daljica gre od točke (0, 60) do točke (40, 0).
x: 0 .. 45 | 5 | čas x (s)
y: 0 .. 70 | 10 | višina y (m)
f: -3*x/2 + 60 | modra | 0 .. 40
točka: 0; 60 | (0, 60) | desno
točka: 40; 0 | pristanek (40, 0) | nad
:::

4. Za višino $15\,\mathrm{m}$ v predpis vstavimo $y = 15$. Enačbo reši sam.

:::premisli
Reši enačbo $-1{,}5x + 60 = 15$. Čez koliko sekund je modul $15\,\mathrm{m}$ nad tlemi? Preveri še na grafu.
---
$-1{,}5x = 15 - 60 = -45$, zato $x = 30$. Modul je $15\,\mathrm{m}$ nad tlemi po $30\,\mathrm{s}$, $10\,\mathrm{s}$ pred pristankom. Preizkus: $-1{,}5 \cdot 30 + 60 = -45 + 60 = 15$. Na grafu je pri $x = 30$ daljica res na višini $15$.
:::

## Pogoste napake

- **Napačen predznak pri ničli.** Pri $y = 2x - 6$ učenec zapiše ničlo $x = -6$ ali $x = -3$, ker »ničla ima nasproten predznak«. Iz enačbe $2x - 6 = 0$ sledi $2x = 6$ in $x = 3$. Popravek: enačbo vedno reši korak za korakom in naredi preizkus: $2 \cdot 3 - 6 = 0$.
- **Zamenjana $k$ in $n$.** Pri $y = 3x + 5$ graf ne seka osi $y$ v $(0, 3)$, ampak v $(0, 5)$. Os $y$ seka pri $x = 0$, takrat ostane le $n$.
- **Zamenjani koordinati.** Ničla $6$ da presečišče $(6, 0)$ na osi $x$, točka $(0, 6)$ pa leži na osi $y$. Prva koordinata je vedno $x$.
- **Napačna smer stopnice.** Pri $k = -2$ se po koraku $1$ v desno premakneš za $2$ *navzdol*, ne navzgor. Negativen $k$ pomeni padajočo premico.
- **»Vodoravna premica ima ničlo $n$.«** Pri $y = 3$ nekdo reče, da je ničla $3$. Število $3$ je vrednost $y$, ne $x$: $y$ je vedno $3$ in nikoli $0$, zato ničle ni.

## Povzetek

- Graf $y = kx + n$ je premica: dovolj sta dve točki, tretja je preizkus. Riši z ravnilom in podaljšaj čez točki.
- Hitro risanje: iz $(0, n)$ naredi stopnico $1$ v desno in $k$ navzgor (pri $k < 0$ navzdol).
- Presečišče z osjo $y$ je $(0, n)$.
- Ničla je $x$, pri katerem je $y = 0$: reši $kx + n = 0$, pri $k \ne 0$ je $x = -\dfrac{n}{k}$. Presečišče z osjo $x$ je $\left(-\dfrac{n}{k}, 0\right)$.
- Pri $k = 0$, $n \ne 0$ ničle ni; pri $k = 0$, $n = 0$ je vsak $x$ ničla; pri $n = 0$, $k \ne 0$ je ničla $0$.
- V besedilni nalogi nariši le smiselne vrednosti (daljica ali poltrak); ničla pogosto odgovori na vprašanje »kdaj bo nič«.

## Drugače: Na sliki

:::risba graf
opis: Premica y = kx + n z označenima presečiščema. V aplikaciji se k in n spreminjata z drsnikoma; izbrano je k = {k} in n = {n}. Os y seka v točki (0, {n}), os x pri ničli x = {-n/k}.
x: -6 .. 6
y: -6 .. 6
enako: da
drsnik: k | -3 .. 3 | 0,5 | 1 | smerni koeficient k
drsnik: n | -3 .. 3 | 1 | 2 | začetna vrednost n
f: k*x + n
točka: 0; n | (0, {n}) | levo
točka: -n/k; 0 | ničla {-n/k} | pod
podnapis: Premica pri k = {k} in n = {n}; ničla je {-n/k}
:::

- Najprej napovej, nato preveri: kam se pri $k = 1$ premakne ničla, če $n$ povečaš za $1$? (Za $1$ v levo, ker je ničla $-n$.)
- Spreminjaj $k$ pri stalnem $n$: presečišče $(0, n)$ ostane na mestu, ničla pa se pri bolj strmi premici približa osi $y$.
- Ničla na sliki se vedno ujema z $-\dfrac{n}{k}$. Pri $k = 0$ točka ničle izgine, ker je premica vodoravna.

V simulaciji spodaj (»Graf funkcije y = kx + n«) nastavi $k = 0$ in počasi spreminjaj $n$. Opazi, da se premica premika gor in dol, os $x$ pa doseže le pri $n = 0$, ko z njo sovpade.

## Drugače: Bolj natančno

V lekciji Linearna funkcija smo pokazali, da je za vsak par točk $(x_1, y_1)$ in $(x_2, y_2)$ na grafu, kjer je $x_2 \ne x_1$, razmerje $\dfrac{y_2 - y_1}{x_2 - x_1}$ enako $k$. Za risanje to pomeni: vse stopnice med točkami grafa imajo enako razmerje med navpičnim in vodoravnim delom, zato so trikotniki pod njimi podobni in vse točke ležijo na isti premici. Zato je vseeno, kateri dve točki izberemo za risanje.

Ničla: $kx + n = 0$ pomeni $kx = -n$. Če je $k \ne 0$, delimo s $k$ in dobimo natanko eno ničlo $x = -\dfrac{n}{k}$. Če je $k = 0$, je $y = n$ povsod enak: pri $n \ne 0$ ničle ni, pri $n = 0$ pa je vsak $x$ ničla.

Vsaka nenavpična premica je graf neke linearne funkcije. Navpična premica, na primer skozi vse točke z $x = 2$, pa ni graf funkcije: istemu $x = 2$ bi pripadalo neskončno mnogo vrednosti $y$, funkcija pa vsakemu $x$ priredi natanko en $y$.

## Preveri se

? Kateri opis pripada grafu funkcije $y = 3x - 6$?
- Narašča, os $y$ seka v $(0, 3)$, os $x$ v $(2, 0)$.
~ Točka $(0, 3)$ nastane z zamenjavo $k$ in $n$. Na osi $y$ je $x = 0$, takrat je $y = n = -6$.
- Narašča, os $y$ seka v $(0, -6)$, os $x$ v $(-2, 0)$.
~ Napačen predznak ničle: iz $3x - 6 = 0$ sledi $3x = 6$ in $x = 2$.
- Narašča, os $y$ seka v $(-6, 0)$, os $x$ v $(0, 2)$.
~ Zamenjani koordinati: točka na osi $y$ ima prvo koordinato $0$, zato je $(0, -6)$.
+ Narašča, os $y$ seka v $(0, -6)$, os $x$ v $(2, 0)$.
> $k = 3 > 0$, zato narašča. Pri $x = 0$ je $y = -6$, ničla pa je rešitev $3x - 6 = 0$, torej $x = 2$.

? Koliko ničel ima funkcija $y = 3$ in zakaj?
- Eno, $x = 3$, ker je $n = 3$.
~ Število $3$ je vrednost $y$, ne $x$. Pri $x = 3$ je $y = 3$, ne $0$.
- Eno, $x = 0$, ker je $k = 0$.
~ Pri $x = 0$ je $y = 3$, ne $0$. $k = 0$ pove le, da je premica vodoravna.
- Neskončno mnogo, ker je $k = 0$.
~ Neskončno ničel ima le $y = 0$ ($k = 0$ in $n = 0$), ko graf leži na osi $x$.
+ Nobene, ker je $y$ vedno $3$ in vodoravna premica ne seka osi $x$.
> Pri $k = 0$ in $n = 3 \ne 0$ je graf vodoravna premica $3$ enote nad osjo $x$. Vrednost $y = 0$ ni nikoli dosežena.

? Ničla funkcije $y = 2x + n$ je $x = 3$. Koliko je $n$?
- $6$
~ Iz enačbe $2 \cdot 3 + n = 0$ sledi $n = -6$; predznak se pri prenosu na drugo stran spremeni.
- $3$
~ Ničla ni začetna vrednost. Ničla je $x$ pri $y = 0$, $n$ pa $y$ pri $x = 0$.
- $-3$
~ Ničla ni $-n$, ampak $-\dfrac{n}{k}$. Pri $n = -3$ bi bila ničla $1{,}5$.
+ $-6$
> Pri $x = 3$ je $y = 0$: iz enačbe $2 \cdot 3 + n = 0$ sledi $n = -6$. Preizkus: $2 \cdot 3 - 6 = 0$.

? Sonda je $250\,\mathrm{m}$ nad površjem Lune in se spušča enakomerno, $2{,}4\,\mathrm{m}$ vsako sekundo. Približno čez koliko časa pristane?
- približno $600\,\mathrm{s}$
~ Zmnožil si $250 \cdot 2{,}4$. Ničla je rešitev $-2{,}4x + 250 = 0$, torej deljenje.
- približno $250\,\mathrm{s}$
~ $250$ je začetna vrednost $n$ (višina pri $x = 0$), ne ničla.
+ približno $100\,\mathrm{s}$
> $y = -2{,}4x + 250$, ničla je $x = \dfrac{250}{2{,}4} \approx 104$, torej približno $100\,\mathrm{s}$.

? Raketna stopnja ima ob vžigu $1200\,\mathrm{kg}$ goriva in ga porabi $40\,\mathrm{kg}$ vsako sekundo. Po koliko sekundah zmanjka goriva?
- $-30\,\mathrm{s}$
~ Izgubljen predznak: $x = -\dfrac{n}{k} = -\dfrac{1200}{-40} = 30$. Čas tu ne more biti negativen.
- $1160\,\mathrm{s}$
~ $1160\,\mathrm{kg}$ goriva ostane po eni sekundi; to ni ničla.
- $48\,000\,\mathrm{s}$
~ Zmnožil si $1200 \cdot 40$. Ničlo dobiš z deljenjem.
+ $30\,\mathrm{s}$
> Masa goriva je $y = -40x + 1200$. Iz enačbe $-40x + 1200 = 0$ sledi $40x = 1200$ in $x = 30$.

:::simboli
x | neodvisna spremenljivka (abscisa) | | | ničla: $x = -\frac{n}{k}$
y | vrednost funkcije (ordinata) | y = kx + n | |
k | smerni koeficient | k = \frac{y_2 - y_1}{x_2 - x_1} | | $k > 0$ narašča, $k < 0$ pada
n | začetna vrednost | | | graf seka os $y$ v $(0, n)$
x_1, y_1 | koordinati prve točke na grafu | | |
x_2, y_2 | koordinati druge točke na grafu | | |
:::
