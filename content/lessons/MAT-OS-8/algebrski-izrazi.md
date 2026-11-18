---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Tim je zapisnikar na šolskem košarkarskem turnirju. Po vsaki tekmi mora za dvanajst igralcev izračunati točke. Koš iz igre prinese $2$ točki (dvojka), met izza črte $3$ točke (trojka), prosti met pa $1$ točko.

Prvi igralec mu vzame minuto, drugi spet minuto. Tim ugotovi, da vsakič ponavlja isti račun, spreminjajo se le števila metov. Zato si na rob zapisnika napiše eno samo pravilo s črkami. Kako je videti to pravilo in kako z njim hitro računa? Prav to so algebrski izrazi.

## Razlaga

**Najprej en igralec.** Jan je zadel $4$ dvojke, $1$ trojko in $3$ proste mete. Tim računa:

$$4 \cdot 2 + 1 \cdot 3 + 3 \cdot 1 = 8 + 3 + 3 = 14$$

Jan ima $14$ točk.

**Od primera k pravilu.** Pri vsakem igralcu se spremenijo le tri števila: koliko dvojk, trojk in prostih metov je zadel. Označimo jih s črkami $d$, $t$ in $p$. Pravilo za točke je potem:

$$2d + 3t + p$$

Črki, ki nadomešča poljubno število, rečemo **spremenljivka**. **Algebrski izraz** je zapis, v katerem so števila in spremenljivke povezani z računskimi operacijami. Primeri: $3x$, $a + 5$, $2d + 3t + p$, $x^2 - 4$.

**Dogovori o zapisu.**

- Znak za množenje med številom in črko izpustimo: namesto $2 \cdot d$ pišemo $2d$.
- Število pišemo pred črko: $5a$, ne $a5$.
- Namesto $1 \cdot p$ pišemo $p$, namesto $(-1) \cdot x$ pa $-x$.
- Namesto $x \cdot x$ pišemo $x^2$.
- Deljenje zapišemo z ulomkom: $a : 4 = \dfrac{a}{4}$.

**Besede v izraz.** Pogosti zapisi:

| Besedilo | Izraz |
|---|---|
| število $x$, povečano za $7$ | $x + 7$ |
| število $x$, zmanjšano za $7$ | $x - 7$ |
| $7$, zmanjšano za $x$ | $7 - x$ |
| trikratnik števila $x$ | $3x$ |
| tretjina števila $x$ | $\dfrac{x}{3}$ |
| kvadrat števila $x$ | $x^2$ |

Pri odštevanju je vrstni red pomemben: $x - 7$ in $7 - x$ nista isto.

**Vrednost izraza.** Ko za spremenljivke vstavimo števila, dobimo številski izraz. Izračunano število je **vrednost izraza** za izbrana števila. Za Jana smo vstavili $d = 4$, $t = 1$, $p = 3$ in dobili vrednost $14$.

Računamo po običajnem vrstnem redu: oklepaji, potence, množenje in deljenje, nazadnje seštevanje in odštevanje. Negativno število vedno vstavimo v oklepaj.

:::premisli
Ema je na tekmi zadela samo trojke, in sicer $5$. Kolikšna je vrednost izraza $2d + 3t + p$ zanjo? Napovej, preden računaš.
---
$15$. Vstavimo $d = 0$, $t = 5$, $p = 0$: $2 \cdot 0 + 3 \cdot 5 + 0 = 15$. Člena z $d$ in $p$ sta enaka $0$.
:::

**Členi in podobni členi.** Izraz je sestavljen iz **členov**, ki jih ločujeta znaka $+$ in $-$. Člen ima **koeficient** (številski faktor) in **črkovni del**. Pri členu $-5xy$ je koeficient $-5$, črkovni del pa $xy$.

Jan je na prvi tekmi zadel $4$ dvojke, na drugi $3$ dvojke. Skupaj je to $7$ dvojk. Isto velja za mete, vredne $x$ točk: $4$ meti po $x$ in še $3$ meti po $x$ so $7$ metov po $x$, torej $4x + 3x = 7x$.

Če pa je zadel $4$ mete po $x$ točk in $3$ mete po $y$ točk, nima $7$ enakih metov. Izraz $4x + 3y$ ostane, kot je.

**Podobni členi** imajo enak črkovni del, koeficienta sta lahko različna. Podobna sta $3x$ in $-7x$. Člena $3x$ in $3x^2$ nista podobna, ker je $x$ drugačen črkovni del kot $x^2$. Člena brez črk, na primer $5$ in $-2$, sta podobna med seboj.

**Poenostavljanje.** Podobne člene seštejemo tako, da seštejemo koeficiente, črkovni del pa prepišemo:

$$3x + 5x = (3 + 5)x = 8x$$

Nepodobnih členov ne združujemo: $3x + 5y$ ostane $3x + 5y$.

V simulaciji spodaj (»Algebrske ploščice: podobni členi«) je vsak člen ploščica: velik kvadrat je $x^2$, palica je $x$, majhen kvadratek je $1$. Sestavi $2x^2 - x + 3$, nato dodaj še eno ploščico $+x$. Opazuj, da se $x$ in $-x$ izničita, kvadrati in enice pa ostanejo, kot so bili.

:::premisli
Ali lahko $3x + 2x^2$ zapišemo kot en sam člen, na primer $5x^2$? Razmisli s ploščicami.
---
Ne. Palica $x$ in kvadrat $x^2$ sta ploščici različne oblike, zato ju ne štejemo skupaj. Za $x = 2$ je $3x + 2x^2 = 6 + 8 = 14$, $5x^2$ pa bi dalo $20$.
:::

## Rešeni primeri

### Primer 1 (lažji): zapis z izrazom

Maja na treningu preteče $n$ krogov po $400\,\text{m}$, nato še $150\,\text{m}$ do slačilnice. Zapiši izraz za njeno pot in ga preveri za $n = 3$.

**Podatki:** en krog $= 400\,\text{m}$, število krogov $n$, dodatnih $150\,\text{m}$, preverjanje za $n = 3$
**Iščemo:** izraz za pot v metrih in njegovo vrednost za $n = 3$

:::formula
pot $=$ (dolžina kroga) $\cdot$ (število krogov) $+$ dodatna pot
:::

**Rešitev:**

1. $n$ krogov po $400\,\text{m}$ je $400n$ metrov, ker se krog ponovi $n$-krat.
2. Dodatnih $150\,\text{m}$ prištejemo: izraz je $400n + 150$.
3. Preverimo za $n = 3$: $400 \cdot 3 + 150 = 1350$.
4. Odgovor: Maja preteče $400n + 150$ metrov, pri treh krogih $1350\,\text{m}$.

### Primer 2: vrednost izraza

Izračunaj vrednost izraza $2a^2 - 3b$ za $a = -3$ in $b = 4$.

**Podatki:** izraz $2a^2 - 3b$, $a = -3$, $b = 4$
**Iščemo:** vrednost izraza

:::formula
Vstavi števila (negativna v oklepaju), nato: potence, množenje, odštevanje.
:::

**Rešitev:**

1. Vstavimo, negativno število v oklepaju: $2 \cdot (-3)^2 - 3 \cdot 4$.
2. Najprej potenca: $(-3)^2 = 9$, ker je produkt dveh negativnih števil pozitiven.
3. Nato množenje: $2 \cdot 9 = 18$ in $3 \cdot 4 = 12$.
4. Nazadnje odštevanje: $18 - 12 = 6$.
5. Odgovor: vrednost izraza je $6$.

### Primer 3 (težji): poenostavljanje in vrednost

Poenostavi izraz $4x + 3y - 7x + 5 - y + 2$ in izračunaj njegovo vrednost za $x = 2$ in $y = -1$.

**Podatki:** izraz $4x + 3y - 7x + 5 - y + 2$, $x = 2$, $y = -1$
**Iščemo:** poenostavljen izraz in njegovo vrednost

:::formula
$ma + na = (m + n)a$ (seštejemo koeficiente podobnih členov)
:::

**Rešitev:**

1. Razvrstimo člene po črkovnem delu; znak pred členom gre z njim:
   - z $x$: $4x$ in $-7x$,
   - z $y$: $3y$ in $-y$ (koeficient $-1$),
   - števili: $5$ in $2$.
2. Seštejemo koeficiente: $4x - 7x = -3x$, $3y - y = 2y$, $5 + 2 = 7$.
3. Poenostavljen izraz: $-3x + 2y + 7$.
4. Vstavimo: $-3 \cdot 2 + 2 \cdot (-1) + 7 = -6 - 2 + 7 = -1$.
5. Preverimo z začetnim izrazom: $8 - 3 - 14 + 5 + 1 + 2 = -1$. Ujema se, zato je poenostavitev pravilna.
6. Odgovor: izraz je enak $-3x + 2y + 7$, njegova vrednost pa je $-1$.

### Primer 4 – zdaj ti

Pri družabni igri je moder žeton vreden $x$ točk, rdeč pa $y$ točk. Vrednosti pred zadnjim krogom določi kocka. Lara ima $5$ modrih in $2$ rdeča žetona. V zadnjem krogu dobi še $3$ modre, $1$ rdečega pa mora vrniti. Kocka določi $x = 3$ in $y = -2$. Koliko točk ima Lara?

**Podatki:** $5$ modrih in $2$ rdeča, nato $+3$ modri in $-1$ rdeč; $x = 3$, $y = -2$
**Iščemo:** Larine točke

:::formula
Poenostavi z $ma + na = (m + n)a$, nato vstavi.
:::

**Rešitev:**

1. Izraz za točke: $5x + 2y + 3x - y$.
2. Podobni členi: $5x + 3x = 8x$ in $2y - y = y$, torej $8x + y$.
3. Vstavi $x = 3$ in $y = -2$ ter izračunaj sam, nato preveri:

:::premisli
Kolikšna je vrednost izraza $8x + y$ za $x = 3$ in $y = -2$?
---
$8 \cdot 3 + (-2) = 24 - 2 = 22$. Lara ima $22$ točk.
:::

## Pogoste napake

- **Združevanje nepodobnih členov.** »$3x + 2y = 5xy$, saj seštejem številke in zložim črke.« Člena imata različna črkovna dela, kot dvojke in trojke. Za $x = 2$, $y = 1$ je $3x + 2y = 8$, $5xy$ pa je $10$. Izraz pusti, kot je.
- **Potenca se pri seštevanju poveča.** »$3x^2 + 2x^2 = 5x^4$.« Pri seštevanju podobnih členov se spremeni samo koeficient, črkovni del ostane: $5x^2$. Potenca se poveča le pri množenju, $x \cdot x = x^2$.
- **Pozabljen koeficient $1$.** »V $3y - y$ člen $y$ nima številke, zato ga izpustim.« Člen $y$ ima koeficient $1$, člen $-y$ pa $-1$. Pravilno je $3y - y = 2y$.
- **Negativno število brez oklepaja.** Za $x = -2$ učenec napiše $-2^2 = -4$. Brez oklepaja se kvadrira le $2$. Pravilno: $(-2)^2 = 4$.
- **Obrnjen vrstni red pri odštevanju.** »$7$, zmanjšano za $x$« zapiše kot $x - 7$. Zmanjšujemo število $7$, zato je izraz $7 - x$. Preveri s številom: za $x = 2$ je $7 - 2 = 5$.

## Povzetek

- Algebrski izraz sestavljajo števila, spremenljivke in računske operacije, na primer $2d + 3t + p$.
- Znak za množenje med številom in črko izpustimo: $3 \cdot x = 3x$; $x \cdot x = x^2$.
- Vrednost izraza dobimo z vstavljanjem števil in upoštevanjem vrstnega reda operacij; negativna števila damo v oklepaj.
- Podobni členi imajo enak črkovni del. Seštejemo jih tako, da seštejemo koeficiente: $3x + 5x = 8x$.
- Nepodobnih členov ne združujemo; $x$ in $x^2$ nista podobna.

## Drugače: Z analogijo

Predstavljaj si, da je $x$ škatla bombonov. Vse škatle so enake, a ne veš, koliko bombonov je v eni.

- $3x$ so tri škatle, $5x$ pet škatel. Skupaj je to osem škatel: $3x + 5x = 8x$. Ne veš, koliko je bombonov, a število škatel znaš sešteti.
- Če imaš še $2$ posamezna bombona, ju ne moreš prišteti k škatlam. Ne veš, koliko bombonov je v škatli, zato $8x + 2$ ostane tako.
- $x^2$ je kot velik zaboj, v katerem je $x$ škatel. Zaboj in škatla nista ista stvar, zato $x$ in $x^2$ ne seštevamo skupaj.

Ko izraz vrednotiš, odpreš škatlo: izveš, koliko bombonov je v njej (vrednost $x$), in prešteješ vse.

## Drugače: Bolj natančno

Zakaj podobne člene seštejemo tako, da seštejemo koeficiente? Zaradi **distributivnosti** množenja glede na seštevanje, ki velja za vsa števila:

$$ma + na = (m + n)a$$

Tako je $3x + 5x = (3 + 5)x = 8x$. Preveri za $x = 4$: leva stran $3 \cdot 4 + 5 \cdot 4 = 12 + 20 = 32$, desna stran $8 \cdot 4 = 32$.

Enakost, ki velja za vse vrednosti spremenljivk, pomeni, da sta izraza **enakovredna**: $3x + 5x$ in $8x$ imata pri vsakem $x$ isto vrednost, le zapisana sta različno.

Za nepodobna člena takšnega pravila ni. Dovolj je en protiprimer: za $x = 2$ je $x + x^2 = 2 + 4 = 6$, $2x^2$ pa bi dalo $8$. Zato $x + x^2$ ne moremo zapisati z enim členom.

## Preveri se

? Kateri člen **ne** spada k ostalim (ni podoben ostalim)?
- $x$
~ Člen $x$ ima koeficient $1$, le zapisan ni. Črkovni del je $x$, kot pri ostalih.
- $-2x$
~ Negativen koeficient ne spremeni črkovnega dela. $-2x$ je podoben $7x$.
+ $3x^2$
- $7x$
~ Velik koeficient ni pomemben. Podobnost določa samo črkovni del.
> $x$, $-2x$ in $7x$ imajo črkovni del $x$. Člen $3x^2$ ima črkovni del $x^2$, zato ni podoben ostalim.

? Kolikšna je vrednost izraza $3x^2 - 2x$ za $x = -2$?
- $-8$
~ Napisal si $-2^2 = -4$. Negativno število vstavi v oklepaj: $(-2)^2 = 4$.
- $8$
~ Člen $-2 \cdot (-2)$ je $+4$, ne $-4$: produkt dveh negativnih števil je pozitiven.
- $40$
~ Kvadriral si $3x$ namesto samo $x$. V $3x^2$ se kvadrira le $x$.
+ $16$
> $3 \cdot (-2)^2 - 2 \cdot (-2) = 3 \cdot 4 + 4 = 16$.

? Zakaj lahko $4x + 3x$ zapišemo kot $7x$, izraza $4x + 3y$ pa ne kot $7xy$?
- Ker $y$ predstavlja večje število kot $x$.
~ Velikost števil ni pomembna; $x$ in $y$ sta lahko poljubni števili.
+ Ker imata $4x$ in $3x$ enak črkovni del, $4x$ in $3y$ pa ne.
- Ker členov s črkami sploh ne smemo seštevati.
~ Smemo, a le podobne. $4x + 3x = 7x$ velja za vsak $x$.
> Seštevamo lahko le podobne člene. Za $x = 2$, $y = 1$ je $4x + 3y = 11$, $7xy$ pa $14$, zato enakost ne velja.

? Nik poenostavlja $5a + 2b - 3a + b$. **1. korak:** $5a - 3a = 2a$. **2. korak:** $2b + b = 2b$. **3. korak:** rezultat je $2a + 2b$. Kje je prva napaka?
- V 1. koraku.
~ $5a - 3a = (5 - 3)a = 2a$ je pravilno; znak $-$ gre s členom $3a$.
+ V 2. koraku.
- V 3. koraku.
~ 3. korak le zapiše, kar sta dala prva dva. Napaka se je zgodila prej.
- Napake ni.
~ Člen $b$ ima koeficient $1$, ki ga je Nik izpustil.
> $2b + b = 2b + 1b = 3b$. Pravilni rezultat je $2a + 3b$.

? Tina in Ema najameta teniško igrišče. Tina plača $8h + 3$ evrov, Ema $8h + 2$ evrov, kjer je $h$ število ur. Koliko plačata skupaj za $2$ uri?
- $21\,\text{€}$
~ To dobiš, če vzameš $8h + 8h = 8h$. Seštej koeficienta: $16h$.
- $42\,\text{€}$
~ To dobiš, če $16h + 5$ združiš v $21h$. Člena $16h$ in $5$ nista podobna.
+ $37\,\text{€}$
> Skupaj: $8h + 3 + 8h + 2 = 16h + 5$. Za $h = 2$: $16 \cdot 2 + 5 = 37$, torej $37\,\text{€}$.

:::simboli
d | število zadetih dvojk | | | točke igralca: 2d + 3t + p
t | število zadetih trojk | |
p | število zadetih prostih metov | |
x, a | spremenljivki v izrazih | | | namesto njiju vstavimo števila
m, n | koeficienta podobnih členov | | | v nalogi z Majo je n število krogov
:::
