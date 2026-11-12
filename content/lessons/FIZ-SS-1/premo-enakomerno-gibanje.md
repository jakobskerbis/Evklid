---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nika je tonska tehničarka na koncertu na prostem. Oder ima glavne zvočnike, $102\,\mathrm{m}$ dlje v publiki pa stoji še en stolp zvočnikov za zadnje vrste. Če stolp zaigra hkrati z odrom, poslušalci zadaj slišijo vsak udarec bobna dvakrat: najprej iz stolpa, nato še z odra. Nika mora stolpu nastaviti **zakasnitev**. Za koliko?

Zvok potuje po zraku s stalno hitrostjo, približno $340\,\mathrm{m/s}$. Iz osnovne šole poznaš formulo $v = \dfrac{s}{t}$, torej je $t = \dfrac{102\,\mathrm{m}}{340\,\mathrm{m/s}} = 0{,}3\,\mathrm{s}$. Nika nastavi $0{,}3\,\mathrm{s}$ in udarca se zlijeta v enega.

Zdaj to znanje nadgradimo: gibanje začnemo **opisovati z grafi**. Graf pove veliko več kot ena številka. Iz njega razbereš, kje je telo ob katerem času, ali miruje, ali se giblje hitro ali počasi in v katero smer. Tako berejo podatke prometniki, športni trenerji in vsak, ki si ogleda zapis gibanja s senzorja ali telefona.

Najpreprostejše gibanje je **premo enakomerno gibanje**. Na njem se naučimo risati in brati grafa $s(t)$ in $v(t)$, ki ju bomo potrebovali pri vseh težjih gibanjih.

## Razlaga

**Nikin zvok, korak za korakom.** Sledimo udarcu bobna od odra proti stolpu. Vsako desetinko sekunde zapišemo, kako daleč od odra je zvok:

| $t\,(\mathrm{s})$ | $0$ | $0{,}1$ | $0{,}2$ | $0{,}3$ |
|---|---|---|---|---|
| $s\,(\mathrm{m})$ | $0$ | $34$ | $68$ | $102$ |

V vsaki desetinki zvok napreduje za enakih $34\,\mathrm{m}$. Ko točke vrišemo v koordinatni sistem s časom na vodoravni osi, ležijo na ravni črti:

:::risba graf
opis: Graf lege zvoka v odvisnosti od časa. Čas od 0 do 0,3 sekunde, lega od 0 do 102 metrov. Točke (0; 0), (0,1; 34), (0,2; 68) in (0,3; 102) ležijo na premici skozi izhodišče.
x: 0 .. 0,3 | 0,1 | t [s]
y: 0 .. 120 | 20 | s [m]
f: 340*x | modra | 0 .. 0,3
točka: 0; 0
točka: 0,1; 34
točka: 0,2; 68
točka: 0,3; 102 | stolp | levo
:::

:::premisli
Kako daleč od odra je zvok po $0{,}5\,\mathrm{s}$? Napovej iz vzorca v tabeli, ne iz formule.
---
$170\,\mathrm{m}$. Vsaka desetinka doda $34\,\mathrm{m}$, pet desetink torej $5 \cdot 34\,\mathrm{m}$. Točka leži na isti premici, le dlje desno.
:::

Iz tega enega primera zdaj posplošimo.

**1. Kaj je premo enakomerno gibanje.** Telo se giblje po ravni črti (premo) in v vsakem enakem časovnem intervalu opravi enako dolgo pot (enakomerno). Hitrost je zato ves čas **stalna**.

**2. Hitrost.** Pri tem gibanju je hitrost enaka količniku prepotovane poti in časa:

$$v = \frac{s}{t}$$

Enota je $\mathrm{m/s}$. Iz formule dobimo tudi pot:

$$s = v \cdot t$$

**3. Začetni položaj.** Če telo ne začne v izhodišču, ampak pri $s_0$, je lega ob času $t$:

$$s = s_0 + v \cdot t$$

Večinoma bomo vzeli $s_0 = 0$ in $t$ merimo od začetka gibanja.

**4. Graf $s(t)$ (pot v odvisnosti od časa).** Na vodoravno os nanašamo čas $t$, na navpično pot $s$. Ker je $s = v \cdot t$, je graf **premica skozi izhodišče** (če je $s_0 = 0$).

- Naklon premice je enak hitrosti: $v = \dfrac{\Delta s}{\Delta t}$.
- Strmejša premica pomeni večjo hitrost.
- Vodoravna premica pomeni mirovanje ($v = 0$).

**5. Graf $v(t)$ (hitrost v odvisnosti od časa).** Na navpično os nanašamo hitrost. Ker je hitrost stalna, je graf **vodoravna premica** na višini $v$.

:::premisli
Bobnar korakajoče godbe na pihala sredi skladbe za $4\,\mathrm{s}$ obstane na mestu, nato koraka naprej enako hitro kot prej. Kakšen je ta del grafa $s(t)$ in kakšen del grafa $v(t)$?
---
Na $s(t)$ je vodoraven odsek: lega se ne spreminja. Na $v(t)$ črta za $4\,\mathrm{s}$ pade na $0$ in se nato vrne na prejšnjo višino. Vodoravno na $s(t)$ pomeni mirovanje, vodoravno na $v(t)$ pa stalno hitrost.
:::

V simulaciji spodaj, »Premo enakomerno gibanje«, izberi graf $x(t)$ (tam je lega označena z $x$) in nastavi hitrost najprej na $10\,\mathrm{m/s}$, nato na $20\,\mathrm{m/s}$ in na $-5\,\mathrm{m/s}$. Opazuj naklon premice: pri dvojni hitrosti je dvakrat strmejša, pri negativni pada. Nato preklopi na $v(t)$ in preveri, da je črta vedno vodoravna.

**6. Ploščina pod grafom $v(t)$.** Pod vodoravno premico je pravokotnik s stranicama $v$ in $t$. Njegova ploščina je $v \cdot t = s$. Zato velja:

> Ploščina pod grafom $v(t)$ je enaka prepotovani poti.

**7. Povprečna in trenutna hitrost.** Pri enakomernem gibanju sta enaki: hitrost je ves čas ista.

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

| $t\,(\mathrm{s})$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| $s\,(\mathrm{m})$ | 0 | 5 | 10 | 15 | 20 |

4. Točke ležijo na premici skozi izhodišče. Graf $v(t)$ je vodoravna premica pri $5\,\mathrm{m/s}$.
5. Odgovor: kolesar v $4\,\mathrm{s}$ opravi $20\,\mathrm{m}$ poti.

### Primer 2: branje hitrosti iz grafa $s(t)$

Na grafu $s(t)$ je premica, ki gre skozi točki $(0\,\mathrm{s},\ 0\,\mathrm{m})$ in $(6\,\mathrm{s},\ 30\,\mathrm{m})$. Določi hitrost in zapiši enačbo gibanja.

**Podatki:** točki na premici grafa $s(t)$: $(0\,\mathrm{s},\ 0\,\mathrm{m})$ in $(6\,\mathrm{s},\ 30\,\mathrm{m})$; premica gre skozi izhodišče ($s_0 = 0$)
**Iščemo:** hitrost $v$ in enačbo gibanja $s(t)$

:::formula
Hitrost je naklon premice: $v = \dfrac{\Delta s}{\Delta t}$, enačba gibanja: $s = v \cdot t$
:::

**Rešitev:**

1. Hitrost je naklon premice: $v = \dfrac{\Delta s}{\Delta t}$. Zato izberemo dve točki na premici.
2. $\Delta s = 30\,\mathrm{m} - 0\,\mathrm{m} = 30\,\mathrm{m}$, $\Delta t = 6\,\mathrm{s} - 0\,\mathrm{s} = 6\,\mathrm{s}$.
3. $v = \dfrac{30\,\mathrm{m}}{6\,\mathrm{s}} = 5\,\mathrm{m/s}$.
4. Enačba gibanja: $s = 5\,\mathrm{m/s} \cdot t$.
5. Preverimo: pri $t = 6\,\mathrm{s}$ je $s = 30\,\mathrm{m}$. ✓
6. Odgovor: hitrost je $5\,\mathrm{m/s}$, enačba gibanja je $s = 5\,\mathrm{m/s} \cdot t$.

### Primer 3 (težji): gibanje z začetnim položajem in dve telesi

Pešec je ob $t = 0$ na mestu $s_0 = 20\,\mathrm{m}$ in hodi s hitrostjo $1{,}5\,\mathrm{m/s}$ v pozitivno smer. Kolesar začne ob $t = 0$ v izhodišču ($s_0 = 0$) in se vozi s hitrostjo $5\,\mathrm{m/s}$ v isto smer. Kdaj kolesar dohiti pešca in kje?

**Podatki:** pešec: $s_{0P} = 20\,\mathrm{m}$, $v_P = 1{,}5\,\mathrm{m/s}$; kolesar: $s_{0K} = 0$, $v_K = 5\,\mathrm{m/s}$; oba začneta ob $t = 0$ in se gibljeta v isto (pozitivno) smer
**Iščemo:** čas $t$ in mesto $s$, kjer kolesar dohiti pešca

:::formula
Enačba gibanja za vsako telo: $s = s_0 + v\,t$; dohitevanje pomeni $s_K = s_P$
:::

**Rešitev:**

1. **Enačbi gibanja** (zakaj: vsako telo ima svojo lego kot funkcijo časa):
   - pešec: $s_P = 20 + 1{,}5\,t$,
   - kolesar: $s_K = 5\,t$.
2. **Dohitevanje** pomeni, da sta na istem mestu: $s_K = s_P$.
3. $5\,t = 20 + 1{,}5\,t$, torej $3{,}5\,t = 20$.
4. $t = \dfrac{20}{3{,}5} \approx 5{,}71\,\mathrm{s}$.
5. Mesto: $s_K = 5 \cdot 5{,}71 \approx 28{,}6\,\mathrm{m}$.
6. **Preverimo** s pešcem: $20 + 1{,}5 \cdot 5{,}71 = 20 + 8{,}57 \approx 28{,}6\,\mathrm{m}$. ✓
7. **Na grafu $s(t)$** se premici sekata v tej točki. Kolesarjeva premica je strmejša, premica pešca pa se začne višje, pri $20\,\mathrm{m}$.
8. Odgovor: kolesar dohiti pešca po približno $5{,}7\,\mathrm{s}$, približno $28{,}6\,\mathrm{m}$ od izhodišča.

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
- **Hitrost iz ene točke.** Napačno: premica gre skozi $(20\,\mathrm{s};\ 70\,\mathrm{m})$, torej je $v = \dfrac{70}{20}$. To velja le, če je $s_0 = 0$; sicer pozabiš, da telo ni začelo v izhodišču. Popravek: vzemi dve točki in izračunaj $v = \dfrac{\Delta s}{\Delta t}$.
- **Ploščina pod napačnim grafom.** Napačno: »Pot je ploščina pod grafom $s(t)$.« Ploščina ima enoto produkta osi; pri $v(t)$ je to $\mathrm{m/s} \cdot \mathrm{s} = \mathrm{m}$, pri $s(t)$ pa $\mathrm{m} \cdot \mathrm{s}$, kar ni pot. Popravek: pot je ploščina pod $v(t)$, na $s(t)$ jo preprosto prebereš z navpične osi.
- **Mešanje enot.** Napačno: hitrost v $\mathrm{m/s}$ pomnožiš s časom v minutah. Rezultat je $60$-krat premajhen. Popravek: pred računom pretvori, $1\,\mathrm{min} = 60\,\mathrm{s}$.

## Povzetek

- Premo enakomerno gibanje: ravna črta, stalna hitrost.
- $v = \dfrac{s}{t}$, $s = v t$, z začetnim položajem $s = s_0 + v t$.
- Graf $s(t)$ je premica, njen naklon je hitrost. Strmejša premica pomeni večjo hitrost, vodoravna pomeni mirovanje.
- Graf $v(t)$ je vodoravna premica.
- Ploščina pod grafom $v(t)$ je enaka prepotovani poti.
- Srečanje dveh teles: izenačimo njuni enačbi gibanja oziroma poiščemo presečišče grafov.

## Drugače: Na sliki

Predstavljaj si dva grafa, enega pod drugim, z isto vodoravno osjo časa.

**Zgornji graf $s(t)$:** premica, ki se dviga od izhodišča. Če izbereš dve točki, narišeš pravokotni trikotnik pod premico. Navpična stranica je $\Delta s$, vodoravna $\Delta t$. Njun količnik je hitrost.

**Spodnji graf $v(t)$:** vodoravna črta na višini $v$. Med $t = 0$ in izbranim časom $t$ nastane pravokotnik s ploščino $v \cdot t$.

Iz tega vidiš povezavo: **naklon zgornjega grafa je višina spodnjega**, **ploščina spodnjega grafa je višina zgornjega**.

Če se hitrost podvoji, je premica na $s(t)$ dvakrat strmejša, črta na $v(t)$ pa dvakrat višja.

## Drugače: Z analogijo

Premo enakomerno gibanje je kot glasba ob **metronomu**. Metronom tiktaka v stalnem tempu, glasbenik pa ob vsakem tiku naredi en enako dolg korak naprej.

- **Tempo** (koliko korakov na sekundo) ustreza hitrosti. Hitrejši tempo pomeni več poti v isti sekundi, zato strmejšo premico na $s(t)$.
- **Stalni tempo** je vodoravna črta na $v(t)$: hitrost se med skladbo ne spreminja.
- **Število narejenih korakov** ustreza poti: tempo krat trajanje, tako kot $s = v \cdot t$.
- **Pavza**, med katero glasbenik stoji, je vodoravni odsek na $s(t)$.

Če dirigent sredi skladbe pospeši tempo, gibanje ni več enakomerno in graf $s(t)$ ni več ena sama premica, ampak se nagne strmeje.

## Drugače: Korak za korakom s številkami

**Naloga:** Gibanje je podano s tabelo. Ali je enakomerno? Kolikšna je hitrost?

| $t\,(\mathrm{s})$ | 0 | 2 | 4 | 6 |
|---|---|---|---|---|
| $s\,(\mathrm{m})$ | 10 | 16 | 22 | 28 |

1. **Izračunaj spremembe lege** v enakih časovnih korakih: $16 - 10 = 6$, $22 - 16 = 6$, $28 - 22 = 6$ (vsakič v $2\,\mathrm{s}$).
2. **Primerjaj.** Spremembe so enake, zato je gibanje enakomerno. Če bi se razlikovale, ne bi bilo.
3. **Hitrost:** $v = \dfrac{6\,\mathrm{m}}{2\,\mathrm{s}} = 3\,\mathrm{m/s}$.
4. **Začetni položaj:** ob $t = 0$ je $s_0 = 10\,\mathrm{m}$.
5. **Enačba:** $s = 10 + 3\,t$.
6. **Preveri** pri $t = 6\,\mathrm{s}$: $10 + 3 \cdot 6 = 28\,\mathrm{m}$. ✓
7. **Graf $s(t)$:** premica, ki se začne pri $10\,\mathrm{m}$ na navpični osi. **Graf $v(t)$:** vodoravna črta pri $3\,\mathrm{m/s}$.

## Drugače: Bolj natančno

Hitrost telesa je v splošnem definirana kot sprememba lege v času:

$$v = \frac{\Delta s}{\Delta t} = \frac{s_2 - s_1}{t_2 - t_1}$$

Premo enakomerno gibanje je gibanje, pri katerem je ta količnik **enak za vsak izbor** $t_1$ in $t_2$. Če vzamemo $t_1 = 0$ (lega $s_0$) in poljuben $t_2 = t$ (lega $s$), dobimo:

$$v = \frac{s - s_0}{t} \quad\Rightarrow\quad s = s_0 + v\,t$$

To je enačba premice $y = k x + n$, kjer je $k = v$ (naklon) in $n = s_0$ (presečišče z navpično osjo). Zato je graf $s(t)$ res premica.

Če je $v < 0$, premica pada. Telo se giblje v negativno smer. Hitrost je torej **vektorska** količina, ki ima predznak glede na izbrano smer. Pot (dolžina prehojene poti) pa se ne more zmanjševati.

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

? Bobnar korakajoče godbe začne hoditi dvakrat hitreje kot prej. Kaj se zgodi z grafoma?
- Obe črti postaneta dvakrat strmejši.
~ Graf $v(t)$ ostane vodoraven, ker je nova hitrost spet stalna. Strmejši je samo $s(t)$.
- Premica $s(t)$ se le premakne navzgor, njen naklon ostane enak.
~ Premik navzgor pomeni drugačno začetno lego $s_0$, ne večje hitrosti. Hitrost je naklon.
+ Premica $s(t)$ postane dvakrat strmejša, črta $v(t)$ se dvigne na dvakratno višino.
- Nič se ne spremeni, ker je gibanje še vedno enakomerno.
~ Enakomerno ostane, a z drugo hitrostjo: naklon $s(t)$ in višina $v(t)$ sta prav hitrost.
> Naklon $s(t)$ je hitrost, višina črte $v(t)$ tudi. Dvojna hitrost podvoji oboje, oblika grafov pa ostane enaka.

? Telo se enakomerno giblje s hitrostjo $3\,\mathrm{m/s}$ v času od $0$ do $8\,\mathrm{s}$. Kolikšna je ploščina pod grafom $v(t)$ in kaj pomeni?
- $11\,\mathrm{m}$, pomeni prepotovano pot.
~ To je vsota $3 + 8$. Ploščina pravokotnika je zmnožek stranic.
- $24\,\mathrm{m/s}$, pomeni hitrost.
~ Enota ploščine je $\mathrm{m/s} \cdot \mathrm{s} = \mathrm{m}$, torej pot, ne hitrost.
+ $24\,\mathrm{m}$, pomeni prepotovano pot.
- $24\,\mathrm{m}$, pomeni čas gibanja.
~ Število je pravo, pomen ne: čas je na vodoravni osi, ploščina ima enoto metrov.
> Pod grafom je pravokotnik s stranicama $3\,\mathrm{m/s}$ in $8\,\mathrm{s}$, torej ploščina $3 \cdot 8 = 24\,\mathrm{m}$. To je prepotovana pot, saj je $s = v t$.

? Godba na pihala koraka enakomerno. Ob $t = 0$ je $40\,\mathrm{m}$ od starta, ob $t = 20\,\mathrm{s}$ pa $70\,\mathrm{m}$. Luka računa hitrost: (1) $\Delta s = 70\,\mathrm{m} - 40\,\mathrm{m} = 30\,\mathrm{m}$; (2) $\Delta t = 20\,\mathrm{s}$; (3) $v = \dfrac{70\,\mathrm{m}}{20\,\mathrm{s}} = 3{,}5\,\mathrm{m/s}$. Kateri korak je napačen?
- Korak (1)
~ Razlika leg je pravilna: $70 - 40 = 30$.
- Korak (2)
~ Čas je pravilen: $20\,\mathrm{s} - 0\,\mathrm{s} = 20\,\mathrm{s}$.
+ Korak (3)
- Noben, račun je pravilen.
~ $3{,}5\,\mathrm{m/s}$ dobiš iz ene same točke. Godba ni začela v izhodišču, zato to ni hitrost.
> V koraku (3) bi moral deliti $\Delta s$, ne lege: $v = \dfrac{30\,\mathrm{m}}{20\,\mathrm{s}} = 1{,}5\,\mathrm{m/s}$.

? Med nevihto vidiš blisk, grom pa slišiš $3\,\mathrm{s}$ pozneje. Zvok potuje s $340\,\mathrm{m/s}$. Kako daleč je udarila strela?
- Približno $113\,\mathrm{m}$
~ To je $340 : 3$. Pri stalni hitrosti pot dobiš z množenjem: $s = v \cdot t$.
+ Približno $1\,\mathrm{km}$
- Približno $343\,\mathrm{m}$
~ To je $340 + 3$. Hitrosti in časa ne seštevamo, ker imata različni enoti.
> Zvok se giblje enakomerno: $s = 340\,\mathrm{m/s} \cdot 3\,\mathrm{s} = 1020\,\mathrm{m}$, približno $1\,\mathrm{km}$. Vsake $3\,\mathrm{s}$ zamika pomenijo okoli kilometer.

:::simboli
v | hitrost | v = \dfrac{\Delta s}{\Delta t} | m/s
s | lega (pot od izhodišča) | s = s_0 + v\,t | m
s_0 | začetna lega | | m | pogosto vzamemo s₀ = 0
t | čas | | s
s_1, s_2 | legi ob časih t₁ in t₂ | | m
t_1, t_2 | časa dveh opazovanj | | s
s_K | lega kolesarja | | m
s_P | lega pešca | | m
:::
