---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi list papirja in škarje. Izreži trikotnik, kakršen koli, lahko čisto postrani. Vsak vogal označi z lokom. Nato vse tri vogale odtrgaj in jih položi drug ob drugega, tako da se konice stikajo v eni točki.

Kaj dobiš? Zunanji robovi vogalov sestavijo ravno črto. Poskusi še z zelo ozkim ali zelo širokim trikotnikom: črta je spet ravna. Trije koti vsakega trikotnika so torej skupaj iztegnjeni kot.

To s pridom uporabljajo tesarji in mizarji. Ko izdelujejo trikotno oporo za polico ali strešno ogrodje, izmerijo dva kota, tretjega pa izračunajo in po njem nastavijo žago.

## Razlaga

**1. Deli trikotnika.** Trikotnik ima tri **oglišča** $A$, $B$, $C$, tri **stranice** $a$, $b$, $c$ in tri **notranje kote** $\alpha$, $\beta$, $\gamma$. Kot $\alpha$ je pri oglišču $A$, stranica $a$ pa leži temu oglišču nasproti.

*Preveri v eni vrstici:* kateri kot leži nasproti stranice $b$? (Kot $\beta$.)

**2. Vrste po stranicah.** Primerjamo dolžine stranic.

| vrsta | stranice | koti |
|---|---|---|
| raznostranični | vse različno dolge | vsi različni |
| enakokraki | dve enaki (kraka) | kota ob osnovnici enaka |
| enakostranični | vse tri enake | vsi trije enaki |

Pri enakokrakem trikotniku enaki stranici imenujemo **kraka**, tretjo pa **osnovnica**. Kota ob osnovnici sta enaka. Velja tudi obratno: če sta v trikotniku dva kota enaka, je trikotnik enakokrak. Oglišču med krakoma rečemo vrh.

*Preveri v eni vrstici:* je enakostranični trikotnik tudi enakokrak? (Da, saj ima celo vse tri stranice enake.)

**3. Vrste po kotih.** Trikotnik je **ostrokotni**, če so vsi trije koti ostri. **Pravokotni** ima en pravi kot, **topokotni** pa en topi kot.

*Preveri v eni vrstici:* trikotnik s koti $30^\circ$, $60^\circ$, $90^\circ$ je katere vrste? (Pravokotni.)

**4. Vsota notranjih kotov.** Poskus s papirjem pokaže pravilo, ki velja za vsak trikotnik:

$$\alpha + \beta + \gamma = 180^\circ$$

Iz dveh znanih kotov tretjega dobiš z odštevanjem: $\gamma = 180^\circ - \alpha - \beta$.

:::premisli
Ali lahko narišeš trikotnik z dvema topima kotoma? Napovej in povej, zakaj.
---
Ne. Že dva topa kota sta skupaj več kot $180^\circ$, za tretji kot ne bi ostalo nič. Tudi pravi kot je lahko največ eden: dva prava kota sta skupaj že $180^\circ$.
:::

**5. Posledice za posebne trikotnike.**

- Enakostranični: trije enaki koti dajo $180^\circ$, zato vsak meri $180^\circ : 3 = 60^\circ$.
- Enakokraki: če poznaš kot ob vrhu $\gamma$, sta kota ob osnovnici $(180^\circ - \gamma) : 2$.
- Pravokotni: ostra kota skupaj merita $180^\circ - 90^\circ = 90^\circ$. Sta torej komplementarna.

*Preveri v eni vrstici:* v pravokotnem trikotniku je en ostri kot $45^\circ$; koliko meri drugi? ($45^\circ$, trikotnik je enakokrak.)

**6. Zunanji kot.** Stranico trikotnika podaljšaj čez oglišče, kot da bi letev podaljšal čez rob opore. Kot med podaljškom in sosednjo stranico je **zunanji kot**. Označimo ga s črtico: $\alpha'$, $\beta'$, $\gamma'$. Zunanji in notranji kot pri istem oglišču sta sokota:

$$\alpha + \alpha' = 180^\circ$$

*Preveri v eni vrstici:* notranji kot meri $70^\circ$; koliko meri zunanji kot pri istem oglišču? ($110^\circ$.)

**7. Izrek o zunanjem kotu.** Pri oglišču $C$ velja $\gamma' = 180^\circ - \gamma$. Iz vsote kotov pa vemo, da je tudi $\alpha + \beta = 180^\circ - \gamma$. Desni strani sta enaki, zato:

$$\gamma' = \alpha + \beta$$

Zunanji kot je enak vsoti tistih dveh notranjih kotov, ki **nista** pri istem oglišču.

:::premisli
Zakaj je zunanji kot vedno večji od vsakega od teh dveh notranjih kotov?
---
Ker je njuna vsota, oba pa sta večja od $0^\circ$. Na primer pri $\alpha = 40^\circ$ in $\beta = 60^\circ$ je $\gamma' = 100^\circ$, več kot vsak posebej.
:::

**8. Vsota zunanjih kotov.** Pri vsakem oglišču vzemi en zunanji kot, vse v isti smeri obhoda. Ti trije koti dajo skupaj $360^\circ$, poln obrat.

V simulaciji spodaj »Vrste trikotnikov in vsota kotov« vleci oglišče $C$, dokler kot $\gamma$ ni pravi. Opazuj, kako se trije koti spodaj vedno zložijo v ravno črto in koliko skupaj merita $\alpha$ in $\beta$.

## Rešeni primeri

### Primer 1: opora za polico

Mizar izdeluje trikotno oporo za polico. Kot pri oglišču $A$ meri $55^\circ$, pri oglišču $B$ pa $70^\circ$. Koliko meri kot pri $C$? Katere vrste je opora po kotih in po stranicah?

**Podatki:** $\alpha = 55^\circ$, $\beta = 70^\circ$
**Iščemo:** kot $\gamma$ in vrsto trikotnika

:::formula
$\gamma = 180^\circ - \alpha - \beta$
:::

**Rešitev:**

1. Vsota notranjih kotov je $180^\circ$, zato odštejemo oba znana kota.
2. $\gamma = 180^\circ - 55^\circ - 70^\circ = 55^\circ$.
3. Vsi trije koti so manjši od $90^\circ$, zato je trikotnik ostrokotni.
4. Kota $\alpha$ in $\gamma$ sta enaka, zato je trikotnik enakokrak.
5. Preverimo: $55^\circ + 70^\circ + 55^\circ = 180^\circ$.
6. Odgovor: kot pri $C$ meri $55^\circ$. Opora je ostrokotni enakokraki trikotnik.

### Primer 2: strešno ogrodje

Strešno ogrodje ima obliko enakokrakega trikotnika: špirovca sta kraka, stropni tram je osnovnica. Kot ob slemenu (vrh) meri $100^\circ$. Pod kolikšnim kotom se špirovec stika s stropnim tramom?

**Podatki:** enakokraki trikotnik, kot ob vrhu $\gamma = 100^\circ$
**Iščemo:** kota ob osnovnici $\alpha = \beta$

:::formula
$\alpha + \beta + \gamma = 180^\circ$ in $\alpha = \beta$, torej $\alpha = (180^\circ - \gamma) : 2$
:::

**Rešitev:**

1. Kota ob osnovnici sta enaka, skupaj merita $180^\circ - 100^\circ = 80^\circ$.
2. Vsak kot je polovica: $80^\circ : 2 = 40^\circ$.
3. Preverimo: $40^\circ + 40^\circ + 100^\circ = 180^\circ$.
4. Odgovor: špirovec se stika s stropnim tramom pod kotom $40^\circ$.

### Primer 3: lesena ploščica, obratna naloga

Na trikotni leseni ploščici podaljšamo stranico čez oglišče $C$. Zunanji kot pri $C$ meri $116^\circ 15'$, notranji kot pri $A$ pa $48^\circ 25'$. Koliko merita notranja kota pri $B$ in pri $C$?

**Podatki:** $\gamma' = 116^\circ 15'$, $\alpha = 48^\circ 25'$
**Iščemo:** kota $\beta$ in $\gamma$

:::formula
$\gamma' = \alpha + \beta$, torej $\beta = \gamma' - \alpha$; $\gamma = 180^\circ - \gamma'$
:::

**Rešitev:**

1. Zunanji kot pri $C$ je vsota notranjih kotov pri $A$ in $B$, zato $\beta = \gamma' - \alpha$.
2. Minut je pri $\gamma'$ premalo, zato $1^\circ$ zamenjamo s $60'$: $116^\circ 15' = 115^\circ 75'$.
3. $\beta = 115^\circ 75' - 48^\circ 25' = 67^\circ 50'$.
4. Notranji in zunanji kot pri $C$ sta sokota: $\gamma = 180^\circ - 116^\circ 15' = 179^\circ 60' - 116^\circ 15' = 63^\circ 45'$.
5. Preverimo vsoto: $48^\circ 25' + 67^\circ 50' + 63^\circ 45' = 178^\circ 120' = 180^\circ$.
6. Odgovor: $\beta = 67^\circ 50'$ in $\gamma = 63^\circ 45'$.

### Primer 4: zdaj ti

Stopniščna rama, tla in navpična stena oklepajo pravokotni trikotnik. Rama se dviga pod kotom $37^\circ$ glede na tla. Koliko meri drugi ostri kot (med ramo in steno)? Koliko meri zunanji kot ob vznožju rame, če tla podaljšamo čez vznožje, stran od stene?

**Podatki:** pravokotni trikotnik, $\alpha = 37^\circ$, $\gamma = 90^\circ$
**Iščemo:** drugi ostri kot $\beta$ in zunanji kot $\alpha'$

:::formula
$\alpha + \beta = 90^\circ$; $\alpha' = 180^\circ - \alpha$ (ali $\alpha' = \beta + \gamma$)
:::

**Rešitev:**

1. V pravokotnem trikotniku sta ostra kota komplementarna.
2. Zunanji kot ob vznožju je sokot notranjega kota $\alpha$.
3. Izračunaj sam in preveri na oba načina:

:::premisli
Koliko merita $\beta$ in $\alpha'$?
---
$\beta = 90^\circ - 37^\circ = 53^\circ$ in $\alpha' = 180^\circ - 37^\circ = 143^\circ$. Preverba z izrekom o zunanjem kotu: $53^\circ + 90^\circ = 143^\circ$.
:::

## Pogoste napake

- **Vsota $360^\circ$.** Pri kotih $89^\circ$ in $88^\circ$ učenec za tretji kot dobi $183^\circ$. Misli na štirikotnik ali poln obrat. V trikotniku je vsota $180^\circ$, tretji kot meri le $3^\circ$.
- **Zunanji kot je enak notranjemu.** Zunanji in notranji kot pri istem oglišču sta sokota, skupaj merita $180^\circ$. Enaka sta le pri pravem kotu.
- **V izrek vzamemo napačna kota.** Zunanji kot pri $C$ je vsota kotov pri $A$ in $B$, ne vsota, v kateri je tudi $\gamma$. Kdor $\alpha + \beta$ odšteje od $180^\circ$, dobi notranji kot $\gamma$, ne zunanjega.
- **Enak je kot ob vrhu.** Pri enakokrakem trikotniku sta enaka kota ob osnovnici. Kot ob vrhu je lahko drugačen.
- **Pozabljeno deljenje z $2$.** Pri vrhu $110^\circ$ ostane za osnovnico $70^\circ$. To je vsota obeh kotov ob osnovnici, vsak meri $35^\circ$.

## Povzetek

- Po stranicah: raznostranični, enakokraki, enakostranični. Po kotih: ostrokotni, pravokotni, topokotni.
- Vsota notranjih kotov: $\alpha + \beta + \gamma = 180^\circ$. Trikotnik ima največ en pravi ali topi kot.
- Enakostranični trikotnik ima vse kote po $60^\circ$. Enakokraki ima enaka kota ob osnovnici: $(180^\circ - \gamma) : 2$.
- V pravokotnem trikotniku sta ostra kota komplementarna.
- Zunanji in notranji kot pri istem oglišču sta sokota: $\alpha + \alpha' = 180^\circ$.
- Zunanji kot je vsota nesosednjih notranjih kotov: $\gamma' = \alpha + \beta$.
- Vsota zunanjih kotov (po eden pri vsakem oglišču) je $360^\circ$.

## Drugače: Na sliki

Predstavljaj si trikotnik z osnovnico $AB$ spodaj in vrhom $C$ zgoraj. Skozi $C$ nariši vodoravno premico, vzporedno z $AB$. Ob $C$ na tej premici zdaj stojijo trije koti drug ob drugem:

- levo kot, ki je enak $\alpha$,
- na sredini notranji kot $\gamma$,
- desno kot, ki je enak $\beta$.

Skupaj zapolnijo premico, torej $180^\circ$. To je ista slika kot pri poskusu s papirjem, le da vogalov ni treba trgati.

Zunanji kot pri $B$ si nariši tako: stranico $AB$ podaljšaj v desno čez $B$. Med podaljškom in stranico $BC$ je zunanji kot $\beta'$. Notranji kot $\beta$ in $\beta'$ ležita ob isti premici, drug ob drugem.

## Drugače: Bolj natančno

**Zakaj je vsota $180^\circ$.** Skozi $C$ potegnemo premico $p$, vzporedno s stranico $AB$. Kot ob $C$ med premico $p$ in stranico $CA$ ima kraka vzporedna s krakoma kota $\alpha$, a oba obrnjena v nasprotno smer. Taka kota sta enaka. Enako velja za kot ob $C$ med $p$ in $CB$ ter kot $\beta$. Ta dva kota in $\gamma$ skupaj tvorijo iztegnjeni kot, zato je $\alpha + \beta + \gamma = 180^\circ$.

**Vsota zunanjih kotov.** Vsak zunanji kot je sokot notranjega:

$$\alpha' + \beta' + \gamma' = (180^\circ - \alpha) + (180^\circ - \beta) + (180^\circ - \gamma)$$

To je $3 \cdot 180^\circ - (\alpha + \beta + \gamma) = 540^\circ - 180^\circ = 360^\circ$.

**Obhod okoli trikotnika.** Tesar obide trikotno ogrodje vzdolž robov. Pri vsakem oglišču se zasuka natanko za zunanji kot. Ko pride nazaj na začetek in gleda v prvotno smer, se je zasukal za poln obrat, $360^\circ$.

## Preveri se

? Katera trojica kotov ustreza enakokrakemu pravokotnemu trikotniku?
- $90^\circ$, $60^\circ$, $30^\circ$
~ Ta trikotnik je pravokoten, a raznostraničen: noben par kotov ni enak.
+ $90^\circ$, $45^\circ$, $45^\circ$
- $60^\circ$, $60^\circ$, $60^\circ$
~ To je enakostranični trikotnik, ki je ostrokoten, ne pravokoten.
- $90^\circ$, $90^\circ$, $0^\circ$
~ Kot $0^\circ$ ne more biti kot trikotnika. Dva prava kota že porabita vseh $180^\circ$.
> Pravi kot je eden, ostala dva sta enaka in skupaj merita $90^\circ$, zato vsak $45^\circ$.

? Trikotnik ima kota $89^\circ$ in $88^\circ$. Kolikšen je približno tretji kot?
- približno $90^\circ$
~ Koti trikotnika niso nujno podobni. Dva skoraj prava kota porabita skoraj vseh $180^\circ$.
+ zelo majhen, približno $3^\circ$
- približno $183^\circ$
~ To dobiš z vsoto $360^\circ$. Ta velja za štirikotnik, v trikotniku je vsota $180^\circ$.
> Znana kota skupaj merita skoraj $180^\circ$, zato za tretjega ostane le $180^\circ - 177^\circ = 3^\circ$. Trikotnik je zelo ozek.

? Zakaj trikotnik ne more imeti dveh topih kotov?
- Ker topi koti v trikotniku nastanejo le pri oglišču $C$.
~ Oznake oglišč so poljubne. Topi kot je lahko pri katerem koli oglišču.
+ Ker bi bila že ta dva kota skupaj več kot $180^\circ$.
- Ker mora biti vsak trikotnik ostrokoten.
~ Ne drži: obstajajo pravokotni in topokotni trikotniki. Topokotni ima natanko en topi kot.
> Vsota vseh treh kotov je $180^\circ$. Dva kota, večja od $90^\circ$, bi to vsoto že presegla.

? Zunanji kot pri oglišču $C$ meri $130^\circ$, notranji kot $\alpha = 50^\circ$. Koliko meri notranji kot $\beta$?
- $50^\circ$
~ To je $180^\circ - 130^\circ$, notranji kot $\gamma$ pri istem oglišču, ne $\beta$.
+ $80^\circ$
- $180^\circ$
~ Kota si seštel. Zunanji kot je že vsota $\alpha + \beta$, zato $\alpha$ odštej.
- $130^\circ$
~ Zunanji kot ni enak nobenemu notranjemu, razen ko je pravi.
> $\gamma' = \alpha + \beta$, zato $\beta = 130^\circ - 50^\circ = 80^\circ$. Preverba: $\gamma = 50^\circ$ in $50^\circ + 80^\circ + 50^\circ = 180^\circ$.

? Tesar postavlja enakokrako streho, kot ob slemenu meri $110^\circ$. Pod kolikšnim kotom mora odrezati špirovec ob stropnem tramu?
- $70^\circ$
~ To je vsota obeh kotov ob osnovnici. Ker sta enaka, jo deli z $2$.
- $110^\circ$
~ Enaka sta kota ob osnovnici, ne kot ob vrhu in kot ob osnovnici.
+ $35^\circ$
- $125^\circ$
~ To je $(360^\circ - 110^\circ) : 2$. V trikotniku je vsota $180^\circ$, ne $360^\circ$.
> Kota ob osnovnici skupaj merita $180^\circ - 110^\circ = 70^\circ$, vsak torej $70^\circ : 2 = 35^\circ$.

:::simboli
\alpha | notranji kot pri oglišču A | | ° | α + α' = 180°
\beta | notranji kot pri oglišču B | | °
\gamma | notranji kot pri oglišču C | \gamma = 180^\circ - \alpha - \beta | °
\alpha' | zunanji kot pri oglišču A | \alpha' = 180^\circ - \alpha | ° | enak tudi β + γ
\beta' | zunanji kot pri oglišču B | | °
\gamma' | zunanji kot pri oglišču C | \gamma' = \alpha + \beta | ° | vsota vseh zunanjih kotov je 360°
:::
