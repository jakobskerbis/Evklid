---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pevka Nika si pred koncertom v grelniku segreje vodo za čaj z medom. Grelnik brni več kot pol minute, preden je voda dovolj vroča.

Trobentač Jure sedi v mrzli cerkvi. Hladna trobenta zveni prenizko, zato jo pred nastopom drži v rokah in vanjo nekaj minut tiho piha. Ko se kovina in zrak v trobenti ogrejeta, se ton popravi.

Prizora sta si različna, ideja pa je ista: obe telesi moramo segreti, za to pa jima moramo dovesti energijo. Koliko? Zakaj Juretu zadošča že topel dih, Nika pa potrebuje grelnik z močjo $2000\,\mathrm{W}$? Odgovor je odvisen od tega, koliko snovi segrevamo, iz česa je in za koliko stopinj jo segrejemo.

## Razlaga

**1. En primer do konca.** Nika segreje $0{,}25\,\text{kg}$ vode z $20\,^\circ\text{C}$ na $80\,^\circ\text{C}$. Merilnik pokaže, da je grelnik vodi dovedel $63\,000\,\text{J}$ energije. Energiji, ki preide s toplejšega telesa (vroče grelne plošče) na hladnejše (vodo) zaradi razlike v temperaturi, rečemo **toplota** $Q$. Merimo jo v joulih; $1\,\text{kJ} = 1000\,\text{J}$. Ko voda toploto prejme, se ji poveča notranja energija in z njo temperatura.

**2. Spreminjamo en podatek naenkrat.** Kaj, če bi Nika segrevala več vode ali jo segrela manj? Meritve z isto vodo:

| masa vode | dvig temperature | toplota |
|---|---|---|
| $0{,}25\,\text{kg}$ | $60\,^\circ\text{C}$ | $63\,000\,\text{J}$ |
| $0{,}5\,\text{kg}$ | $60\,^\circ\text{C}$ | $126\,000\,\text{J}$ |
| $0{,}25\,\text{kg}$ | $30\,^\circ\text{C}$ | $31\,500\,\text{J}$ |
| $1\,\text{kg}$ | $1\,^\circ\text{C}$ | $4200\,\text{J}$ |

Dvakrat več vode potrebuje dvakrat več toplote. Za pol manjši dvig temperature je treba pol manj toplote. Toplota je sorazmerna z maso in z dvigom temperature.

:::premisli
Koliko toplote bi Nika potrebovala za $0{,}5\,\text{kg}$ vode, ki jo segreje le za $30\,^\circ\text{C}$? Napovej iz tabele, preden računaš.
---
Spet $63\,000\,\text{J}$. Masa je dvakrat večja (toplota $\times 2$), dvig temperature pa pol manjši (toplota $: 2$). Učinka se izničita.
:::

**3. Na en kilogram in eno stopinjo.** Zadnja vrstica tabele nastane, ko toploto iz prve vrstice deliš z maso in z dvigom temperature: $63\,000 : 0{,}25 : 60 = 4200$. To število je lastnost vode. Imenujemo ga **specifična toplota** $c$: pove, koliko toplote potrebuje $1\,\text{kg}$ snovi, da se segreje za $1\,^\circ\text{C}$. Enota je $\dfrac{\mathrm{J}}{\mathrm{kg}\cdot{}^\circ\mathrm{C}}$, kar je isto kot $\dfrac{\mathrm{J}}{\mathrm{kg}\cdot\mathrm{K}}$.

**4. Druge snovi.** Jure segreva medenino (zlitino bakra in cinka), iz katere je trobenta, in ne vode. Vsaka snov ima svoj $c$ (zaokrožene vrednosti):

| snov | $c$ v $\dfrac{\mathrm{J}}{\mathrm{kg}\cdot{}^\circ\mathrm{C}}$ |
|---|---|
| voda | $4200$ |
| led | $2100$ |
| aluminij | $900$ |
| železo | $450$ |
| baker | $390$ |
| medenina | $380$ |

Medenina potrebuje za vsak kilogram in vsako stopinjo več kot desetkrat manj toplote kot voda. Zato Juretu zadošča topel dih, Nika pa za vodo potrebuje grelnik.

:::premisli
$1\,\text{kg}$ vode in $1\,\text{kg}$ železa prejmeta vsak po $4200\,\text{J}$ toplote. Za koliko stopinj se segreje vsak? Zakaj je razlika tako velika?
---
Voda za $1\,^\circ\text{C}$, železo pa za približno $9\,^\circ\text{C}$ ($4200 : 450 \approx 9{,}3$). Železo potrebuje za vsako stopinjo približno devetkrat manj toplote kot voda, zato ga ista toplota segreje bolj.
:::

**5. Enačba.** Vse skupaj zapišemo z eno enačbo:

$$Q = m \cdot c \cdot \Delta T$$

Tu je $\Delta T = t_{\text{konč}} - t_{\text{zač}}$ sprememba temperature, $t_{\text{zač}}$ in $t_{\text{konč}}$ pa začetna in končna temperatura v $^\circ\text{C}$. Razlika temperatur je v $^\circ\text{C}$ in v kelvinih enaka. Pri segrevanju je $\Delta T > 0$ in telo toploto prejme. Pri ohlajanju je $\Delta T < 0$, zato je $Q < 0$: telo toploto odda.

**6. Druge oblike.** Ko iščeš drugo količino, enačbo preoblikuješ:

$$c = \frac{Q}{m \cdot \Delta T}$$

$$\Delta T = \frac{Q}{m \cdot c}$$

Masa mora biti v kilogramih, ker je $c$ podan na kilogram: $500\,\text{g} = 0{,}5\,\text{kg}$.

V simulaciji spodaj (»Toplota: segrevanje in mešanje vode«) izberi vodo, maso $1\,\text{kg}$ in moč grelnika $1000\,\mathrm{W}$ ter segrevaj. Nato isto ponovi z železom. Opazuj graf: črta za železo je približno devetkrat strmejša, ker ima železo približno devetkrat manjši $c$.

## Rešeni primeri

### Primer 1: čaj za ves zbor

Pred vajo zbora Nika v velikem loncu segreje $2\,\text{kg}$ vode s $15\,^\circ\text{C}$ na $95\,^\circ\text{C}$. Koliko toplote prejme voda?

**Podatki:** $m = 2\,\text{kg}$, $t_{\text{zač}} = 15\,^\circ\text{C}$, $t_{\text{konč}} = 95\,^\circ\text{C}$, $c = 4200\,\dfrac{\mathrm{J}}{\mathrm{kg}\cdot{}^\circ\mathrm{C}}$ (voda, iz tabele)
**Iščemo:** toploto $Q$

:::formula
$Q = m \cdot c \cdot \Delta T$, kjer je $\Delta T = t_{\text{konč}} - t_{\text{zač}}$
:::

**Rešitev:**

1. Sprememba temperature, ker enačba potrebuje razliko: $\Delta T = 95 - 15 = 80\,^\circ\text{C}$.
2. Toplota: $Q = 2 \cdot 4200 \cdot 80 = 672\,000\,\text{J}$.
3. Odgovor: voda prejme $672\,000\,\text{J} = 672\,\text{kJ}$ toplote.

### Primer 2: trobenta v mrzlem avtu

Po koncertu ima Juretova trobenta z maso $1100\,\text{g}$ temperaturo $30\,^\circ\text{C}$. V mrzlem avtu se ohladi na $10\,^\circ\text{C}$. Koliko toplote odda?

**Podatki:** $m = 1100\,\text{g}$, $t_{\text{zač}} = 30\,^\circ\text{C}$, $t_{\text{konč}} = 10\,^\circ\text{C}$, $c = 380\,\dfrac{\mathrm{J}}{\mathrm{kg}\cdot{}^\circ\mathrm{C}}$ (medenina, iz tabele)
**Iščemo:** oddano toploto $Q$

:::formula
$Q = m \cdot c \cdot \Delta T$, kjer je $\Delta T = t_{\text{konč}} - t_{\text{zač}}$; masa v $\text{kg}$
:::

**Rešitev:**

1. Maso pretvorimo v kilograme, ker je $c$ podan na kilogram: $1100\,\text{g} = 1{,}1\,\text{kg}$.
2. Sprememba temperature: $\Delta T = 10 - 30 = -20\,^\circ\text{C}$. Negativna je, ker se trobenta ohlaja.
3. Toplota: $Q = 1{,}1 \cdot 380 \cdot (-20) = -8360\,\text{J}$.
4. Odgovor: trobenta odda okolici $8360\,\text{J}$, približno $8{,}4\,\text{kJ}$ toplote (minus pomeni oddajanje).

### Primer 3: iz česa je ploščica metalofona?

Ploščica metalofona z maso $200\,\text{g}$ leži na soncu. Prejme $1800\,\text{J}$ toplote in se segreje z $20\,^\circ\text{C}$ na $30\,^\circ\text{C}$. Iz katere kovine je?

**Podatki:** $m = 200\,\text{g}$, $Q = 1800\,\text{J}$, $t_{\text{zač}} = 20\,^\circ\text{C}$, $t_{\text{konč}} = 30\,^\circ\text{C}$
**Iščemo:** specifično toploto $c$ in po tabeli kovino

:::formula
$c = \dfrac{Q}{m \cdot \Delta T}$
:::

**Rešitev:**

1. Iščemo $c$, zato vzamemo obliko $c = \dfrac{Q}{m \cdot \Delta T}$.
2. Maso pretvorimo: $200\,\text{g} = 0{,}2\,\text{kg}$.
3. Sprememba temperature: $\Delta T = 30 - 20 = 10\,^\circ\text{C}$.
4. Račun: $c = \dfrac{1800}{0{,}2 \cdot 10} = 900\,\dfrac{\mathrm{J}}{\mathrm{kg}\cdot{}^\circ\mathrm{C}}$.
5. Primerjava s tabelo: to vrednost ima aluminij.
6. Odgovor: ploščica je najverjetneje iz aluminija.

### Primer 4: zdaj ti

V zaodrju je v grelniku $1{,}5\,\text{kg}$ vode z začetno temperaturo $20\,^\circ\text{C}$. Grelnik ji dovede $126\,000\,\text{J}$ toplote. Kolikšna je končna temperatura vode?

**Podatki:** $m = 1{,}5\,\text{kg}$, $t_{\text{zač}} = 20\,^\circ\text{C}$, $Q = 126\,000\,\text{J}$, $c = 4200\,\dfrac{\mathrm{J}}{\mathrm{kg}\cdot{}^\circ\mathrm{C}}$ (voda, iz tabele)
**Iščemo:** končno temperaturo $t_{\text{konč}}$

:::formula
$\Delta T = \dfrac{Q}{m \cdot c}$, nato $t_{\text{konč}} = t_{\text{zač}} + \Delta T$
:::

**Rešitev:**

1. Najprej iščemo spremembo temperature, zato vzamemo obliko $\Delta T = \dfrac{Q}{m \cdot c}$.
2. Enote so že prave (kg, J), pretvarjati ni treba.
3. Izračunaj sam, nato preveri:

:::premisli
Koliko je $\Delta T$ in kolikšna je končna temperatura?
---
$\Delta T = \dfrac{126\,000}{1{,}5 \cdot 4200} = \dfrac{126\,000}{6300} = 20\,^\circ\text{C}$, torej $t_{\text{konč}} = 20\,^\circ\text{C} + 20\,^\circ\text{C} = 40\,^\circ\text{C}$. Pazi: $20\,^\circ\text{C}$ ni končna temperatura, ampak le dvig.
:::

## Pogoste napake

- **Masa v gramih.** Če vstaviš $1100$ namesto $1{,}1$, je rezultat tisočkrat prevelik, ker je $c$ podan na kilogram. Maso najprej pretvori v $\text{kg}$.
- **Ena temperatura namesto razlike.** V enačbo ne gre $95\,^\circ\text{C}$, ampak $\Delta T = 95 - 15$. Toplota je odvisna od tega, *za koliko* se telo segreje.
- **Obrnjena razlika.** $\Delta T$ je vedno končna minus začetna. Če ju zamenjaš, dobiš napačen predznak in zamenjaš prejeto toploto z oddano.
- **»Večji $c$, močnejše segrevanje.«** Ravno obratno. $c$ pove, koliko toplote snov potrebuje za vsako stopinjo. Pri enaki toploti in masi se bolj segreje snov z manjšim $c$.
- **Toplota in temperatura sta isto.** Temperatura pove, kako toplo je telo ($^\circ\text{C}$). Toplota je prenesena energija ($\text{J}$). Velik lonec in skodelica se lahko ohladita za enako število stopinj, lonec pa odda veliko več toplote.

## Povzetek

- Toplota $Q$ je energija, ki zaradi temperaturne razlike preide s toplejšega telesa na hladnejše; enota je $\mathrm{J}$.
- Specifična toplota $c$ pove, koliko toplote potrebuje $1\,\text{kg}$ snovi za segretje za $1\,^\circ\text{C}$; je lastnost snovi.
- $Q = m \cdot c \cdot \Delta T$, kjer je $\Delta T = t_{\text{konč}} - t_{\text{zač}}$; pri ohlajanju je $Q$ negativen.
- Voda ima zelo velik $c$ ($4200\,\dfrac{\mathrm{J}}{\mathrm{kg}\cdot{}^\circ\mathrm{C}}$), kovine majhnega, zato se kovine ob enaki toploti segrejejo bolj.
- Maso vedno pretvori v kilograme.

## Drugače: Z analogijo

Predstavljaj si kozarce različnih širin, v katere naliješ vodo.

- Nalita voda je **toplota** $Q$.
- Višina gladine je **temperatura**.
- Širina dna kozarca je zmnožek $m \cdot c$.

V ozek kozarec naliješ deciliter in gladina se močno dvigne. V širok kozarec naliješ isti deciliter in gladina se komaj premakne. Tako je z isto toploto pri železu (ozek kozarec) in vodi (širok). Večja masa pomeni širši kozarec, večji $c$ prav tako.

Za enak dvig gladine potrebuje širok kozarec več vode. Natanko to pove $Q = m \cdot c \cdot \Delta T$.

Kje primerjava odpove: toplota ni snov, ki bi jo telo »vsebovalo«. Je energija, ki se prenese, ko je med telesoma razlika v temperaturi.

## Drugače: Bolj natančno

Specifična toplota je **definirana** kot količnik:

$$c = \frac{Q}{m \cdot \Delta T}$$

Iz definicije sledi enota $\dfrac{\mathrm{J}}{\mathrm{kg}\cdot{}^\circ\mathrm{C}}$. Ko enačbo pomnožimo z $m \cdot \Delta T$, dobimo $Q = m \cdot c \cdot \Delta T$.

Zmnožek $C = m \cdot c$ imenujemo **toplotna kapaciteta** telesa. Pove, koliko toplote potrebuje celo telo, da se segreje za $1\,^\circ\text{C}$. Enačba je potem $Q = C \cdot \Delta T$. Juretova trobenta ima $C = 1{,}1 \cdot 380 = 418\,\mathrm{J/{}^\circ C}$, čaj v skodelici ($0{,}25\,\text{kg}$) pa $C = 0{,}25 \cdot 4200 = 1050\,\mathrm{J/{}^\circ C}$.

Enačba velja, dokler snov ne spremeni agregatnega stanja in je $c$ približno stalen. Ko se snov tali ali vre, prejema toploto, temperatura pa ostane enaka. V simulaciji to vidiš pri vodi pri $100\,^\circ\text{C}$: graf postane vodoraven.

## Preveri se

? V tabeli piše, da ima medenina $c = 380\,\dfrac{\mathrm{J}}{\mathrm{kg}\cdot{}^\circ\mathrm{C}}$. Kaj to pove o medeninasti trobenti?
+ Vsak kilogram trobente potrebuje $380\,\text{J}$ toplote, da se segreje za $1\,^\circ\text{C}$.
- Cela trobenta potrebuje $380\,\text{J}$ za $1\,^\circ\text{C}$, ne glede na to, kako težka je.
~ Podatek velja za $1\,\text{kg}$ snovi. Težja trobenta potrebuje sorazmerno več toplote.
- Kilogram medenine se segreje za $380\,^\circ\text{C}$, če mu dovedemo $1\,\text{J}$.
~ Razmerje je obrnjeno: $380\,\text{J}$ je toplota za eno stopinjo, ne dvig temperature.
- Trobenta vsebuje $380\,\text{J}$ toplote.
~ Toplota ni nekaj, kar telo vsebuje, ampak energija, ki se prenese. $c$ je lastnost snovi.
> Specifična toplota pove, koliko toplote potrebuje $1\,\text{kg}$ snovi za segretje za $1\,^\circ\text{C}$.

? Enako maso vode, aluminija in bakra postavimo na sonce, da vsaka prejme enako toploto. Razvrsti jih od najmanjšega do največjega dviga temperature.
- baker, aluminij, voda
~ Misliš, da večji $c$ pomeni močnejše segrevanje. Velja obratno: snov z večjim $c$ potrebuje za vsako stopinjo več toplote.
- Vse se segrejejo enako, ker sta masa in toplota enaki.
~ Enaki sta masa in toplota, snov pa ne. Različen $c$ pomeni različen $\Delta T$.
+ voda, aluminij, baker
> Iz $\Delta T = \dfrac{Q}{m \cdot c}$: pri enakih $Q$ in $m$ je dvig tem večji, čim manjši je $c$. Voda ($4200$) se segreje najmanj, baker ($390$) najbolj.

? Skodelica čaja ($0{,}2\,\text{kg}$) se ohladi z $80\,^\circ\text{C}$ na $20\,^\circ\text{C}$. Kaj se zgodi z oddano toploto, če se enako ohladi lonec juhe z maso $2\,\text{kg}$ ($c$ kot voda)?
- Ostane enaka, ker se ohladi za enako število stopinj.
~ Enaka je le sprememba temperature. Toplota je odvisna tudi od mase: $Q = m \cdot c \cdot \Delta T$.
- Je manjša, ker se lonec ohlaja počasneje.
~ Hitrost ohlajanja ne pove, koliko toplote telo odda. Več snovi pomeni več oddane toplote.
+ Je desetkrat večja.
> $\Delta T$ in $c$ sta enaka, masa lonca pa je desetkrat večja. Lonec odda $504\,000\,\text{J}$, skodelica $50\,400\,\text{J}$.

? Koliko toplote potrebuje $3\,\text{kg}$ vode, da se segreje z $10\,^\circ\text{C}$ na $30\,^\circ\text{C}$? ($c = 4200\,\dfrac{\mathrm{J}}{\mathrm{kg}\cdot{}^\circ\mathrm{C}}$)
- $126\,000\,\text{J}$
~ To je $3 \cdot 4200 \cdot 10$: vstavil si začetno temperaturo. V enačbo gre $\Delta T = 30 - 10 = 20\,^\circ\text{C}$.
+ $252\,000\,\text{J}$
- $378\,000\,\text{J}$
~ To je $3 \cdot 4200 \cdot 30$: vstavil si končno temperaturo namesto spremembe.
- $12\,600\,\text{J}$
~ To je le $3 \cdot 4200$: pozabil si pomnožiti s spremembo temperature.
> $\Delta T = 30 - 10 = 20\,^\circ\text{C}$, torej $Q = 3 \cdot 4200 \cdot 20 = 252\,000\,\text{J}$.

? Kos bakra z maso $200\,\text{g}$ se segreje za $50\,^\circ\text{C}$. Koliko toplote prejme? ($c = 390\,\dfrac{\mathrm{J}}{\mathrm{kg}\cdot{}^\circ\mathrm{C}}$)
- $3\,900\,000\,\text{J}$
~ Maso si vstavil v gramih. Ker je $c$ podan na kilogram, vstavi $0{,}2\,\text{kg}$; tvoj rezultat je tisočkrat prevelik.
+ $3900\,\text{J}$
- $19\,500\,\text{J}$
~ To je $390 \cdot 50$: pozabil si pomnožiti z maso. Toliko bi prejel $1\,\text{kg}$ bakra.
> $200\,\text{g} = 0{,}2\,\text{kg}$, zato je $Q = 0{,}2 \cdot 390 \cdot 50 = 3900\,\text{J}$.

:::simboli
Q | toplota | Q = m \cdot c \cdot \Delta T | J | negativna, ko telo toploto odda
m | masa | m = \frac{Q}{c \cdot \Delta T} | kg
c | specifična toplota | c = \frac{Q}{m \cdot \Delta T} | J/(kg\cdot{}^\circ C) | voda: $4200\,\mathrm{J/(kg\cdot{}^\circ C)}$
\Delta T | sprememba temperature | \Delta T = t_{\text{konč}} - t_{\text{zač}} | ^\circ C | enaka v $^\circ\mathrm{C}$ in v K
t_{\text{zač}} | začetna temperatura | | ^\circ C
t_{\text{konč}} | končna temperatura | t_{\text{konč}} = t_{\text{zač}} + \Delta T | ^\circ C
C | toplotna kapaciteta telesa | C = m \cdot c | J/{}^\circ C
:::
