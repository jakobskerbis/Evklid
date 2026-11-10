---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Odpri kalkulator na telefonu, vtipkaj $2$ in pritisni $\sqrt{\phantom{x}}$. Zaslon pokaže $1{,}414213562$. Zdaj to število prepiši in ga pomnoži samo s seboj. Dobiš $1{,}99999999894\ldots$, ne pa natanko $2$.

Je kalkulator zgrešil? Ne. Zaslon ima le deset mest, število $\sqrt{2}$ pa ima neskončno decimalk, ki se nikoli ne začnejo ponavljati. Tako število ni ulomek. Imenujemo ga **iracionalno**.

Taka števila srečuješ pogosto. Kvadratna nalepka za telefon s ploščino $2\,\text{cm}^2$ ima stranico $\sqrt{2}\,\text{cm}$. Okrogla ura ima obseg, v katerem nastopa $\pi$. Ugotovili bomo, kako iracionalna števila prepoznaš, kje ležijo na številski premici in zakaj skupaj z ulomki tvorijo **realna števila**.

## Razlaga

**1. Racionalna števila.** Število je **racionalno**, če ga lahko zapišemo kot ulomek $\dfrac{m}{n}$, kjer je $m$ celo število, $n$ pa naravno število. Množico racionalnih števil označimo z $\mathbb{Q}$. Sem sodijo naravna števila ($5 = \dfrac{5}{1}$), cela števila ($-3 = \dfrac{-3}{1}$), ulomki, končna decimalna števila ($0{,}75 = \dfrac{3}{4}$) in neskončna **periodična** decimalna števila ($0{,}333\ldots = \dfrac{1}{3}$).

*Hitra preizkušnja:* je $-1{,}5$ racionalno? (Da, $-1{,}5 = \dfrac{-3}{2}$.)

**2. Iracionalna števila.** Število je **iracionalno**, če ga **ni mogoče** zapisati kot ulomek. Njegov decimalni zapis je neskončen in **neperiodičen**: noben vzorec števk se ne ponavlja v nedogled. Primeri: $\sqrt{2} = 1{,}41421356\ldots$, $\sqrt{3} = 1{,}7320508\ldots$, $\pi = 3{,}14159265\ldots$

*Hitra preizkušnja:* je $0{,}121212\ldots$ iracionalno? (Ne, vzorec $12$ se ponavlja, zato je periodično.)

:::premisli
Na zaslonu telefona sta $\dfrac{1}{7} = 0{,}1428571429$ in $\sqrt{2} = 1{,}414213562$ skoraj enako dolga. Zakaj je prvo število racionalno, drugo pa ne?
---
Pri $\dfrac{1}{7}$ se skupina števk $142857$ ponavlja v nedogled; zaslon je le odrezal zapis. Pri $\sqrt{2}$ se tudi za zaslonom noben vzorec ne ponavlja. O vrsti števila ne odloča dolžina zapisa na zaslonu, ampak to, ali je zapis periodičen.
:::

**3. Kdaj je koren iracionalen?** Naj bo $n$ naravno število. Če je $n$ popolni kvadrat ($1$, $4$, $9$, $16$, $25$, …), je $\sqrt{n}$ naravno število, na primer $\sqrt{16} = 4$. Če $n$ ni popolni kvadrat, je $\sqrt{n}$ iracionalno, na primer $\sqrt{2}$, $\sqrt{7}$, $\sqrt{10}$.

*Hitra preizkušnja:* je $\sqrt{36}$ iracionalno? (Ne, $\sqrt{36} = 6$.)

**4. Realna števila.** Racionalna in iracionalna števila skupaj tvorijo **realna števila** z oznako $\mathbb{R}$. Vsaka množica je vsebovana v naslednji:

$$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$$

| množica | oznaka | primeri |
|---|---|---|
| naravna | $\mathbb{N}$ | $1$, $7$, $\sqrt{9}$ |
| cela | $\mathbb{Z}$ | $-3$, $0$, $7$ |
| racionalna | $\mathbb{Q}$ | $\dfrac{2}{3}$; $-1{,}5$; $0{,}333\ldots$ |
| realna | $\mathbb{R}$ | vsa zgoraj ter $\sqrt{2}$, $\pi$, $-\sqrt{5}$ |

Iracionalna števila so v $\mathbb{R}$, niso pa v $\mathbb{Q}$.

*Hitra preizkušnja:* je vsako celo število realno? (Da, $\mathbb{Z} \subset \mathbb{R}$.)

**5. Številska premica.** Vsakemu realnemu številu ustreza natanko ena točka na številski premici in vsaki točki natanko eno realno število. Iracionalna števila zapolnijo vse »luknje« med ulomki. Lego najprej ocenimo s celima številoma: ker je $1^2 = 1 < 2 < 4 = 2^2$, je $1 < \sqrt{2} < 2$.

:::risba premica
opis: Številska premica od −3 do 4 s točkami −√5 (približno −2,24, malo levo od −2), 0,5, √2 (približno 1,41) in π (približno 3,14).
od: -3
do: 4
točka: -2,2361 | −√5
točka: 0,5 | 0,5
točka: 1,4142 | √2
točka: 3,1416 | π
:::

:::premisli
Napovej: leži $-\sqrt{5}$ levo ali desno od $-2$?
---
Levo. Ker je $4 < 5 < 9$, je $\sqrt{5}$ med $2$ in $3$, približno $2{,}24$. Nasprotno število $-\sqrt{5} \approx -2{,}24$ leži zrcalno čez $0$, torej levo od $-2$.
:::

V simulaciji spodaj, »Realna števila: kam spada število?«, najprej klikni $\sqrt{9}$, nato $\sqrt{2}$. Opazuj, v kateri množici se pojavi točka in kje na premici leži. Opazi, da je $\sqrt{9}$ v najmanjši množici, $\sqrt{2}$ pa samo v $\mathbb{R}$.

**6. Približki.** Iracionalnega števila ne moremo zapisati z vsemi decimalkami, zato pišemo približek z znakom $\approx$ (»približno enako«): $\sqrt{2} \approx 1{,}41$. Približek izboljšujemo s kvadriranjem poskusov:

| poskus | kvadrat | primerjava z $2$ |
|---|---|---|
| $1{,}4$ | $1{,}96$ | premalo |
| $1{,}5$ | $2{,}25$ | preveč |
| $1{,}41$ | $1{,}9881$ | premalo |
| $1{,}42$ | $2{,}0164$ | preveč |

Torej $1{,}41 < \sqrt{2} < 1{,}42$. Postopek lahko nadaljuješ, a se nikoli ne konča s kvadratom natanko $2$.

*Hitra preizkušnja:* je zapis $\sqrt{2} = 1{,}41$ pravilen? (Ne, pravilno je $\sqrt{2} \approx 1{,}41$.)

## Rešeni primeri

### Primer 1: razvrščanje števil

Katera od števil $7$; $-3$; $0{,}5$; $\sqrt{9}$; $\sqrt{7}$; $\pi$; $\sqrt{\dfrac{16}{25}}$ so racionalna in katera iracionalna?

**Podatki:** števila $7$; $-3$; $0{,}5$; $\sqrt{9}$; $\sqrt{7}$; $\pi$; $\sqrt{\dfrac{16}{25}}$
**Iščemo:** katera so racionalna in katera iracionalna

:::formula
Racionalno je število, ki ga zapišemo kot $\dfrac{m}{n}$. Koren naravnega števila je racionalen le, če je to število popolni kvadrat.
:::

**Rešitev:**

1. $7 = \dfrac{7}{1}$ in $-3 = \dfrac{-3}{1}$ sta racionalni, ker sta celi števili.
2. $0{,}5 = \dfrac{1}{2}$ je racionalno, ker je končno decimalno število.
3. $\sqrt{9} = 3$, ker je $3^2 = 9$. Koren torej še ne pomeni iracionalnega števila.
4. $\sqrt{7}$ je iracionalno, ker $7$ ni popolni kvadrat: $2^2 = 4$ in $3^2 = 9$.
5. $\pi$ je iracionalno; to je znano dejstvo, njegove decimalke se ne ponavljajo.
6. $\sqrt{\dfrac{16}{25}} = \dfrac{4}{5}$, ker je $\left(\dfrac{4}{5}\right)^2 = \dfrac{16}{25}$. To je ulomek, torej racionalno število.
7. Odgovor: iracionalni sta le $\sqrt{7}$ in $\pi$, vsa druga števila so racionalna. Realna so vsa.

### Primer 2: položaj na številski premici

Med katerima zaporednima celima številoma ležita $\sqrt{50}$ in $-\sqrt{20}$? Kateremu celemu številu je vsako bližje?

**Podatki:** števili $\sqrt{50}$ in $-\sqrt{20}$
**Iščemo:** sosednji celi števili in bližje celo število za vsako

:::formula
Če je $k^2 < x < (k + 1)^2$, je $k < \sqrt{x} < k + 1$.
:::

**Rešitev:**

1. Za $\sqrt{50}$: $7^2 = 49$ in $8^2 = 64$, torej $49 < 50 < 64$ in zato $7 < \sqrt{50} < 8$.
2. Število $50$ je zelo blizu $49$, zato je $\sqrt{50}$ blizu $7$. Preverimo: $7{,}07^2 = 49{,}9849$ in $7{,}08^2 = 50{,}1264$, torej $\sqrt{50} \approx 7{,}07$.
3. Za $\sqrt{20}$: $4^2 = 16$ in $5^2 = 25$, torej $4 < \sqrt{20} < 5$. Ker je $4{,}47^2 = 19{,}9809$ in $4{,}48^2 = 20{,}0704$, je $\sqrt{20} \approx 4{,}47$.
4. Nasprotno število leži zrcalno čez $0$: $-5 < -\sqrt{20} < -4$, približno pri $-4{,}47$.
5. Odgovor: $\sqrt{50}$ leži med $7$ in $8$, bližje $7$; $-\sqrt{20}$ leži med $-5$ in $-4$, bližje $-4$.

### Primer 3: zaslon pametne ure

Pametna ura ima kvadraten zaslon s ploščino $10\,\text{cm}^2$. Trije prijatelji ugibajo dolžino stranice: Ana reče $3{,}1\,\text{cm}$, Bor $\pi\,\text{cm}$, Cene $\dfrac{22}{7}\,\text{cm}$. Uredi pravo stranico in vsa tri ugibanja po velikosti. Kdo je najbliže?

**Podatki:** $S = 10\,\text{cm}^2$, ugibanja $3{,}1\,\text{cm}$, $\pi\,\text{cm}$, $\dfrac{22}{7}\,\text{cm}$
**Iščemo:** stranico $a$, vrstni red števil in najboljše ugibanje

:::formula
$a = \sqrt{S}$
:::

**Rešitev:**

1. Stranica kvadrata je koren ploščine: $a = \sqrt{10}\,\text{cm}$. Ker $10$ ni popolni kvadrat, je to iracionalno število.
2. Približek: $3{,}16^2 = 9{,}9856$ in $3{,}17^2 = 10{,}0489$, torej $\sqrt{10} \approx 3{,}162$.
3. Ugibanja zapišemo z decimalkami: $3{,}1$; $\pi \approx 3{,}1416$; $\dfrac{22}{7} = 3{,}142857\ldots$
4. Po velikosti: $3{,}1 < \pi < \dfrac{22}{7} < \sqrt{10}$.
5. Najbližje $\sqrt{10}$ je največje ugibanje, $\dfrac{22}{7}$: razlika je le približno $0{,}02\,\text{cm}$.
6. Odgovor: stranica meri $\sqrt{10}\,\text{cm} \approx 3{,}16\,\text{cm}$; najbliže je Cene. Mimogrede: $\dfrac{22}{7}$ je le približek za $\pi$, saj je $\pi$ iracionalen.

### Primer 4: zdaj ti

Aplikacija za fotografije ustvari kvadratno sliko. Ali ima lahko slika natanko $2\,250\,000$ pikslov? Pa natanko $2\,000\,000$ pikslov?

**Podatki:** $S_1 = 2\,250\,000$ pikslov, $S_2 = 2\,000\,000$ pikslov, kvadratna oblika
**Iščemo:** ali je stranica v pikslih naravno število

:::formula
$a = \sqrt{S}$; $a$ je naravno število le, če je $S$ popolni kvadrat.
:::

**Rešitev:**

1. Stranica mora imeti celo število pikslov, zato mora biti $\sqrt{S}$ naravno število.
2. $1500^2 = 2\,250\,000$, zato je prva slika mogoča: $1500 \times 1500$ pikslov.
3. Zdaj ti: med katerima zaporednima kvadratoma leži $2\,000\,000$? Namig: poskusi s $1414$ in $1415$. Kaj to pove o $\sqrt{2\,000\,000}$?

:::premisli
Kaj dobiš?
---
$1414^2 = 1\,999\,396$ in $1415^2 = 2\,002\,225$, zato $1414 < \sqrt{2\,000\,000} < 1415$. Število $2\,000\,000$ ni popolni kvadrat, $\sqrt{2\,000\,000} \approx 1414{,}2$ je iracionalno. Kvadratne slike z natanko $2\,000\,000$ piksli ni; aplikacija vzame na primer $1414 \times 1414$ pikslov.
:::

## Pogoste napake

- **»Vsak koren je iracionalen.«** Učenec vidi znak za koren in sklepa na iracionalnost. Toda $\sqrt{16} = 4$ in $\sqrt{0{,}49} = 0{,}7$ sta racionalni. Najprej preveri, ali je pod korenom popolni kvadrat.
- **»Dolg ali neskončen zapis pomeni iracionalno.«** Število $0{,}333\ldots$ je neskončno, a periodično, zato je $\dfrac{1}{3}$. Iracionalno je le število, ki je neskončno **in** neperiodično.
- **Približek namesto vrednosti.** Zapisa $\pi = 3{,}14$ in $\sqrt{2} = 1{,}41$ sta napačna, ker sta to zaokrožena približka. Tudi $\dfrac{22}{7}$ ni $\pi$. Piši $\pi \approx 3{,}14$.
- **Napačna lega negativnih korenov.** $-\sqrt{5}$ ni med $2$ in $3$, ampak zrcalno čez $0$: med $-3$ in $-2$, približno pri $-2{,}24$.
- **Koren zamenjan s polovico.** »$\sqrt{70}$ je okrog $35$«, ker je učenec delil z $2$. Koren je število, ki krat samo sebe da $70$: $8^2 = 64$ in $9^2 = 81$, torej je $\sqrt{70}$ med $8$ in $9$.

## Povzetek

- Racionalno število ($\mathbb{Q}$) lahko zapišemo kot ulomek; njegov decimalni zapis je končen ali periodičen.
- Iracionalnega števila ne moremo zapisati kot ulomek; zapis je neskončen in neperiodičen. Primeri: $\sqrt{2}$, $\sqrt{3}$, $\pi$.
- $\sqrt{n}$ za naravni $n$ je naravno število, če je $n$ popolni kvadrat, sicer je iracionalno.
- Racionalna in iracionalna števila skupaj so realna števila: $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$.
- Vsakemu realnemu številu ustreza natanko ena točka na številski premici. Lego korena določimo z bližnjima kvadratoma; $-\sqrt{a}$ leži zrcalno čez $0$.
- Iracionalna števila zapisujemo s približki in znakom $\approx$.

## Drugače: Na sliki

Predstavljaj si številsko premico in povečevalno steklo nad njo.

- Brez povečave vidiš le, da je točka $\sqrt{2}$ med $1$ in $2$.
- Razdelek med $1$ in $2$ povečaš in razdeliš na deset delov: $1{,}1$; $1{,}2$; …; $1{,}9$. Točka $\sqrt{2}$ je med $1{,}4$ in $1{,}5$.
- Povečaš še razdelek med $1{,}4$ in $1{,}5$: točka je med $1{,}41$ in $1{,}42$.
- To lahko ponavljaš brez konca. Vsaka povečava ti da eno števko več, a točka nikoli ne pade natanko na oznako.

Točka $\sqrt{2}$ na premici torej **obstaja**, ne moremo pa je zapisati s končnim decimalnim številom ali ulomkom. Prav to pomeni beseda iracionalno. Podobno kot pri povečavi fotografije na telefonu: vsak zoom pokaže več podrobnosti, a slika se nikoli ne »konča«.

## Drugače: Bolj natančno

**Zakaj $\sqrt{2}$ ni ulomek?** Dokažemo s protislovjem: predpostavimo nasprotno in pokažemo, da to vodi v nesmisel.

Recimo, da je $\sqrt{2} = \dfrac{m}{n}$, kjer je ulomek **okrajšan**: $m$ in $n$ nimata skupnega delitelja, večjega od $1$.

1. Kvadriramo: $2 = \dfrac{m^2}{n^2}$, torej $m^2 = 2n^2$. Zato je $m^2$ sodo število.
2. Kvadrat lihega števila je lih, zato mora biti sodo tudi $m$. Zapišemo $m = 2k$.
3. Vstavimo: $4k^2 = 2n^2$, po deljenju z $2$ pa $n^2 = 2k^2$. Torej je $n^2$ sodo in s tem tudi $n$.
4. Oba, $m$ in $n$, sta soda in imata skupni delitelj $2$. To nasprotuje predpostavki, da je ulomek okrajšan.

Predpostavka je bila napačna, zato $\sqrt{2}$ ni racionalno število. Podoben razmislek deluje za koren vsakega naravnega števila, ki ni popolni kvadrat.

## Preveri se

? Katera razvrstitev v tabelo je pravilna?
- racionalna: $0{,}333\ldots$ | iracionalna: $\sqrt{16}$, $\pi$
~ $\sqrt{16} = 4$ je naravno število. Koren ni vedno iracionalen.
+ racionalna: $\sqrt{16}$, $0{,}333\ldots$ | iracionalna: $\sqrt{15}$, $\pi$
- racionalna: $\sqrt{16}$ | iracionalna: $0{,}333\ldots$, $\pi$
~ $0{,}333\ldots$ je neskončno, a periodično, zato je enako $\dfrac{1}{3}$.
> $\sqrt{16} = 4$ in $0{,}333\ldots = \dfrac{1}{3}$ sta racionalni. $15$ ni popolni kvadrat, zato je $\sqrt{15}$ iracionalno, enako kot $\pi$.

? Oceni: med katerima zaporednima celima številoma leži $\sqrt{70}$?
- med $35$ in $36$
~ Število $70$ si delil z $2$. Koren je število, ki krat samo sebe da $70$.
- med $7$ in $8$
~ $8^2 = 64$ je še manj kot $70$, zato je $\sqrt{70}$ večji od $8$.
+ med $8$ in $9$
> $8^2 = 64$ in $9^2 = 81$, torej $64 < 70 < 81$ in zato $8 < \sqrt{70} < 9$ (približno $8{,}37$).

? Zakaj je $0{,}333\ldots$ racionalno število, $1{,}41421356\ldots$ (to je $\sqrt{2}$) pa ne?
- Ker ima $\sqrt{2}$ več decimalk.
~ Oba zapisa sta neskončna. O vrsti števila ne odloča število decimalk.
- Ker je $0{,}333\ldots$ manjše od $1$.
~ Velikost ni pomembna: tudi $5{,}5$ je racionalno in $\sqrt{0{,}5}$ iracionalno.
+ Ker se v $0{,}333\ldots$ števke ponavljajo, v zapisu $\sqrt{2}$ pa ne.
> Periodičen zapis lahko zapišemo kot ulomek ($0{,}333\ldots = \dfrac{1}{3}$); neperiodičnega neskončnega ne moremo.

? Iracionalno število leži na številski premici med $6$ in $7$. Katero je lahko?
- $\sqrt{50}$
~ $49 < 50 < 64$, zato je $\sqrt{50}$ med $7$ in $8$.
- $\sqrt{49}$
~ $\sqrt{49} = 7$ je naravno število, ne iracionalno, in ne leži med $6$ in $7$.
+ $\sqrt{40}$
- $6{,}5$
~ $6{,}5 = \dfrac{13}{2}$ leži med $6$ in $7$, a je racionalno.
> $36 < 40 < 49$, zato $6 < \sqrt{40} < 7$. Ker $40$ ni popolni kvadrat, je $\sqrt{40}$ iracionalno.

? Kvadratna ikona aplikacije na zaslonu ima ploščino $8\,\text{cm}^2$. Katera trditev o njeni stranici je pravilna?
- Stranica je $4\,\text{cm}$.
~ Ploščino si delil z $2$. Kvadrat s stranico $4\,\text{cm}$ ima ploščino $16\,\text{cm}^2$.
- Stranica je natanko $2{,}83\,\text{cm}$.
~ $2{,}83$ je le približek: $2{,}83^2 = 8{,}0089$, ne natanko $8$.
+ Stranica je $\sqrt{8}\,\text{cm} \approx 2{,}83\,\text{cm}$ in je iracionalno število.
> Stranica je $\sqrt{8}\,\text{cm}$. Ker $8$ ni popolni kvadrat, je to iracionalno število, približno $2{,}83\,\text{cm}$.

:::simboli
m | števec ulomka | | | celo število
n | imenovalec ulomka | | | naravno število
k | največje celo število, manjše od korena | | | $k < \sqrt{x} < k + 1$
x | število pod korenom (korenjenec) | |
S | ploščina kvadrata | S = a^2 | cm^2 | v Primeru 4 v pikslih
a | stranica kvadrata | a = \sqrt{S} | cm | v Primeru 4 v pikslih
S_1, S_2 | število pikslov prve in druge slike | | –
:::
