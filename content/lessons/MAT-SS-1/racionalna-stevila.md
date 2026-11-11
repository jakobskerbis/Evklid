---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tekma je izenačena, ekipa trenerja Tineta ima še en prosti met. Tine mora izbrati strelko. Ana je na treningu zadela $7$ metov od $12$, Maja $5$ od $8$. Je Ana z več zadetki boljša?

Ne nujno, saj je Ana tudi več metala. Šteje **delež** zadetkov: $7 : 12$ pri Ani in $5 : 8$ pri Maji. Kalkulator za Majo pokaže $0{,}625$, za Ano pa $0{,}58333\ldots$ in trojke se kar ponavljajo. Maja je torej boljša, čeprav je zadela manj.

Tine ima zdaj tri vprašanja. Kako zapišemo količnik, ki ni celo število? Zakaj se pri $7 : 12$ decimalke ne končajo? Kako primerjamo dva taka količnika? V množici $\mathbb{Z}$ takih količnikov ni: že enačba $3x = 1$ v njej nima rešitve. Potrebujemo množico, v kateri deljenje (razen z $0$) vedno uspe. To so **racionalna števila**, označimo jih z $\mathbb{Q}$ (po besedi *quotient*, količnik).

## Razlaga

**1. Kaj je racionalno število.** Anin delež je količnik $7 : 12$, ki ga zapišemo kot **ulomek** $\dfrac{7}{12}$. Racionalno število je vsako število, ki ga lahko zapišemo kot ulomek $\dfrac{a}{b}$, kjer je $a$ celo število in $b$ naravno število:

$$\mathbb{Q} = \left\{ \frac{a}{b} \mid a \in \mathbb{Z},\ b \in \mathbb{N} \right\}$$

Številu $a$ rečemo **števec**, številu $b$ **imenovalec**. Imenovalec ne sme biti $0$, ker z $0$ ne delimo. Vsako celo število je tudi racionalno, saj je npr. $5 = \dfrac{5}{1}$ in $-3 = \dfrac{-3}{1}$. Zato velja veriga množic

$$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q}.$$

**2. Razširjanje, krajšanje in enakost ulomkov.** Zdi se, da ulomka, zapisana z različnimi števili, ne moreta biti enaka. A zadeti $1$ od $2$ metov je enako dobro kot $3$ od $6$. Isto število ima mnogo zapisov: $\dfrac{1}{2} = \dfrac{2}{4} = \dfrac{3}{6}$. Ulomek **razširimo**, če števec in imenovalec pomnožimo z istim številom (različnim od $0$). Ulomek **skrajšamo**, če ju delimo z istim številom. Vrednost se pri tem ne spremeni. Za enakost dveh ulomkov velja

$$\frac{a}{b} = \frac{c}{d} \iff a \cdot d = b \cdot c.$$

Ulomka $\dfrac{6}{9}$ in $\dfrac{10}{15}$ sta enaka, ker je $6 \cdot 15 = 90 = 9 \cdot 10$. Ulomek je **nekrajšljiv**, če sta števec in imenovalec tuji števili, torej če je njun največji skupni delitelj $D(a,b) = 1$. Krajšamo z največjim skupnim deliteljem: $D(18, 30) = 6$, zato je $\dfrac{18}{30} = \dfrac{3}{5}$. Predznak pišemo pred ulomek ali v števec, imenovalec naj bo pozitiven: $-\dfrac{3}{5} = \dfrac{-3}{5}$.

**3. Računanje z ulomki.** Najbolj mamljivo je sešteti števca in imenovalca: $\dfrac{1}{2} + \dfrac{1}{3} = \dfrac{2}{5}$ (napačno). Rezultat $0{,}4$ je manjši od $\dfrac{1}{2}$, zato ne more biti prav. Polovica in tretjina sta različno velika kosa. Najprej ju zapišemo s kosi iste velikosti, s **skupnim imenovalcem**: $\dfrac{3}{6} + \dfrac{2}{6} = \dfrac{5}{6}$. **Obratna vrednost** ulomka $\dfrac{c}{d}$ (za $c \neq 0$) je $\dfrac{d}{c}$, saj je njun zmnožek $1$.

| Operacija | Pravilo | Primer |
|---|---|---|
| Vsota in razlika | skupni imenovalec: $\dfrac{a}{b} \pm \dfrac{c}{d} = \dfrac{ad \pm bc}{bd}$ | $\dfrac{1}{2} + \dfrac{1}{3} = \dfrac{3 + 2}{6} = \dfrac{5}{6}$ |
| Zmnožek | števec s števcem, imenovalec z imenovalcem: $\dfrac{a}{b} \cdot \dfrac{c}{d} = \dfrac{ac}{bd}$ | $\dfrac{2}{3} \cdot \dfrac{3}{8} = \dfrac{6}{24} = \dfrac{1}{4}$ |
| Količnik | množimo z obratno vrednostjo: $\dfrac{a}{b} : \dfrac{c}{d} = \dfrac{a}{b} \cdot \dfrac{d}{c}$, $c \neq 0$ | $\dfrac{3}{4} : \dfrac{9}{8} = \dfrac{3}{4} \cdot \dfrac{8}{9} = \dfrac{2}{3}$ |

Za skupni imenovalec je najbolje vzeti **najmanjši skupni večkratnik** $v(b,d)$, da so števila manjša. Rezultat vedno skrajšaj. Ulomek z večjim števcem od imenovalca lahko zapišemo kot **mešano število**: $\dfrac{19}{12} = 1\dfrac{7}{12}$, kar pomeni $1 + \dfrac{7}{12}$ (ne zmnožek!). Vsota, razlika, zmnožek in količnik dveh racionalnih števil (pri količniku delitelj ni $0$) so spet racionalna števila. V $\mathbb{Q}$ torej deljenje vedno uspe, v $\mathbb{Z}$ ne.

**4. Decimalni zapis.** Mnogi mislijo, da se vsako deljenje prej ali slej konča, kot $5 : 8 = 0{,}625$. Pri Ani se ni. Ulomek pretvorimo v decimalno število tako, da števec delimo z imenovalcem. Dobimo dve vrsti zapisov:

- **končen** decimalni zapis: $\dfrac{3}{8} = 0{,}375$,
- **periodičen** decimalni zapis, kjer se skupina števk ponavlja v neskončnost: $\dfrac{1}{3} = 0{,}333\ldots = 0{,}\overline{3}$ in $\dfrac{5}{11} = 0{,}\overline{45}$. Črta označuje **periodo**. Če se perioda ne začne takoj za vejico, števke pred njo imenujemo predperioda: $\dfrac{1}{6} = 0{,}1\overline{6}$.

Vsako racionalno število ima končen ali periodičen decimalni zapis. Kdaj je zapis končen? Takrat, ko ima **nekrajšljiv** ulomek v imenovalcu samo praštevili $2$ in $5$ (ali nobene). Takrat ga lahko razširimo na imenovalec $10$, $100$, $1000$, …, ki so zmnožki samih dvojk in petic, npr. $\dfrac{3}{8} = \dfrac{375}{1000}$. Ulomek $\dfrac{5}{12}$ je periodičen, ker je $12 = 2 \cdot 2 \cdot 3$ in nastopa praštevilo $3$. Pozor: ulomek $\dfrac{9}{15}$ ima v imenovalcu faktor $3$, a ga lahko skrajšamo v $\dfrac{3}{5} = 0{,}6$, zato je končen. Najprej vedno skrajšaj.

V simulaciji spodaj (Periodični decimalni zapis) nastavi števec $1$ in imenovalec najprej $8$, nato $7$. Opazuj stolpec ostankov: pri $8$ pride ostanek $0$ in deljenje se ustavi, pri $7$ pa se po šestih korakih vrne ostanek $1$ in števke se začnejo ponavljati.

:::premisli
Imenovalec ulomka $\dfrac{21}{28}$ je $28 = 2 \cdot 2 \cdot 7$. Napovej: bo decimalni zapis končen ali periodičen?
---
Končen. Ulomek ni nekrajšljiv: $D(21, 28) = 7$, zato je $\dfrac{21}{28} = \dfrac{3}{4} = 0{,}75$. Sedmica izgine pri krajšanju, pravilo velja šele za skrajšan imenovalec.
:::

**5. Od decimalnega zapisa nazaj k ulomku.** Velja tudi obratno: vsako končno ali periodično decimalno število je racionalno:

- Končno število: $0{,}35 = \dfrac{35}{100} = \dfrac{7}{20}$.
- Čisto periodično število, npr. $x = 2{,}\overline{18}$: perioda ima dve števki, zato pomnožimo s $100$, da se »repa« (neskončni niz števk za vejico) ujemata: $100x = 218{,}\overline{18}$. Odštejemo $x$: $99x = 216$, torej $x = \dfrac{216}{99} = \dfrac{24}{11}$.
- Mešano periodično število, npr. $x = 0{,}1\overline{6}$: pomnožimo z $10$ in s $100$: $10x = 1{,}\overline{6}$ in $100x = 16{,}\overline{6}$. Odštejemo: $90x = 15$, torej $x = \dfrac{15}{90} = \dfrac{1}{6}$.

Splošno: število pomnožimo z dvema od števil $1$, $10$, $100$, … Razlikujeta se za toliko ničel, kolikor mest ima perioda, zato se »repa« ujemata in pri odštevanju izgineta.

**6. Urejenost.** Pri primerjanju se hitro ujamemo v dve bližnjici: »$0{,}35 > 0{,}4$, ker je $35 > 4$« in »$-\dfrac{1}{2} > -\dfrac{1}{3}$, ker je $\dfrac{1}{2} > \dfrac{1}{3}$«. Obe sta napačni. Za poljubni racionalni števili $p$ in $q$ velja natanko ena od možnosti: $p < q$, $p = q$ ali $p > q$. Na številski premici je manjše število levo od večjega:

$$-1 \;<\; -\tfrac{1}{2} \;<\; -\tfrac{1}{3} \;<\; 0 \;<\; 0{,}35 \;<\; 0{,}4 \;<\; 1$$

Kako primerjamo?

- Pri istem pozitivnem imenovalcu je večji ulomek tisti z večjim števcem: $\dfrac{3}{7} < \dfrac{5}{7}$.
- Pri istem pozitivnem števcu je večji ulomek tisti z manjšim imenovalcem: $\dfrac{1}{8} < \dfrac{1}{5}$.
- Splošno za $b, d > 0$: $\dfrac{a}{b} < \dfrac{c}{d} \iff a \cdot d < b \cdot c$.
- Decimalna števila primerjamo od leve: najprej izenačimo število decimalk ($0{,}4 = 0{,}40$), nato primerjamo.

:::premisli
Tine primerja $\dfrac{7}{12}$ in $\dfrac{5}{8}$ brez kalkulatorja: $7 \cdot 8 = 56$ in $12 \cdot 5 = 60$. Zakaj sme namesto ulomkov primerjati ta zmnožka in zakaj pravilo zahteva $b, d > 0$?
---
Obe strani neenakosti pomnožimo z istim pozitivnim številom $12 \cdot 8 = 96$. Iz $\dfrac{7}{12}$ dobimo $7 \cdot 8 = 56$, iz $\dfrac{5}{8}$ pa $12 \cdot 5 = 60$. Množenje s pozitivnim številom vrstnega reda ne spremeni, zato je $\dfrac{7}{12} < \dfrac{5}{8}$, ker je $56 < 60$: Majin delež je večji. Pri negativnem $bd$ bi se neenakost obrnila, zato mora biti $b, d > 0$.
:::

Racionalna števila so **gosta**: med različnima $p < q$ leži vsaj njuno povprečje $\dfrac{p+q}{2}$, npr. $\dfrac{5}{12}$ med $\dfrac{1}{3}$ in $\dfrac{1}{2}$. Zato »naslednjega« racionalnega števila ni, pri celih pa za $4$ pride $5$.

## Rešeni primeri

### Primer 1 (lažji)

Pri receptu za palačinke potrebuješ $\dfrac{3}{4}$ litra mleka za testo in $\dfrac{5}{6}$ litra mleka za nadev. Koliko litrov mleka potrebuješ skupaj? Rezultat zapiši kot ulomek in kot mešano število.

**Podatki:** mleko za testo $\dfrac{3}{4}\,\text{l}$, mleko za nadev $\dfrac{5}{6}\,\text{l}$
**Iščemo:** skupno količino mleka $V$ (ulomek in mešano število)

:::formula
Ulomka razširimo na skupni imenovalec $v$ (najmanjši skupni večkratnik imenovalcev) in seštejemo števca: $\dfrac{a}{b} + \dfrac{c}{d} = \dfrac{a' + c'}{v}$, kjer sta $a'$ in $c'$ števca razširjenih ulomkov
:::

**Rešitev:**

1. Najmanjši skupni večkratnik števil $4$ in $6$ je $v(4,6) = 12$.
2. Razširimo: $\dfrac{3}{4} = \dfrac{3 \cdot 3}{4 \cdot 3} = \dfrac{9}{12}$ in $\dfrac{5}{6} = \dfrac{5 \cdot 2}{6 \cdot 2} = \dfrac{10}{12}$.
3. Seštejemo: $V = \dfrac{9}{12} + \dfrac{10}{12} = \dfrac{19}{12}$. Ulomek je nekrajšljiv, ker je $19$ praštevilo in ne deli števila $12$.
4. Mešano število: $19 = 1 \cdot 12 + 7$, torej $\dfrac{19}{12} = 1\dfrac{7}{12}$.
5. Odgovor: skupaj potrebuješ $\dfrac{19}{12}\,\text{l} = 1\dfrac{7}{12}\,\text{l}$ mleka, to je približno $1{,}58\,\text{l}$.

### Primer 2 (srednji)

Anin delež zadetkov $\dfrac{7}{12}$ iz uvoda zapiši kot decimalno število. Najprej utemelji, ali bo zapis končen ali periodičen, nato izvedi deljenje.

**Podatki:** delež $\dfrac{7}{12}$ ($7$ zadetkov od $12$ metov)
**Iščemo:** decimalni zapis števila $\dfrac{7}{12}$ in vrsto zapisa (končen ali periodičen)

:::formula
Nekrajšljiv ulomek ima končen decimalni zapis natanko tedaj, ko ima imenovalec samo praštevili $2$ in $5$; sicer je zapis periodičen. Zapis dobimo z deljenjem $a : b$.
:::

**Rešitev:**

1. Števili $7$ in $12$ sta tuji, torej je ulomek nekrajšljiv.
2. Razcep imenovalca: $12 = 2 \cdot 2 \cdot 3$. Nastopa praštevilo $3$, zato bo zapis **periodičen**.
3. Delimo (pisno): $7 : 12 = 0{,}\ldots$ Pri vsakem koraku pripišemo ničlo ostanku.
   - $70 : 12 = 5$, ostanek $70 - 60 = 10$,
   - $100 : 12 = 8$, ostanek $100 - 96 = 4$,
   - $40 : 12 = 3$, ostanek $40 - 36 = 4$.
4. Ostanek $4$ se je ponovil, zato se bo števka $3$ ponavljala v neskončnost.
5. Odgovor: $\dfrac{7}{12} = 0{,}58333\ldots = 0{,}58\overline{3}$. Zapis je periodičen s predperiodo $58$ in periodo $3$.

### Primer 3 (težji)

Na turnirju v malem nogometu ekipe primerjajo po povprečni gol razliki na tekmo (dani minus prejeti goli, deljeno s številom tekem). Ekipa A ima $\dfrac{3}{5}$, ekipa B $-\dfrac{2}{3}$, ekipa C $0{,}\overline{6}$, ekipa D $-0{,}7$ in ekipa E $\dfrac{5}{8}$. Razvrsti ekipe od najslabše do najboljše.

**Podatki:** A: $\dfrac{3}{5}$, B: $-\dfrac{2}{3}$, C: $0{,}\overline{6}$, D: $-0{,}7$, E: $\dfrac{5}{8}$ (enota: gol na tekmo)
**Iščemo:** vrstni red ekip od najmanjše do največje gol razlike

:::formula
Periodično število pretvorimo v ulomek, vsa števila zapišemo na skupnem imenovalcu $v > 0$; pri istem pozitivnem imenovalcu je večje število tisto z večjim števcem.
:::

**Rešitev:**

1. Pretvorimo $x = 0{,}\overline{6}$: $10x = 6{,}\overline{6}$, odštejemo $x$ in dobimo $9x = 6$, torej $x = \dfrac{6}{9} = \dfrac{2}{3}$.
2. Zapišemo $-0{,}7 = -\dfrac{7}{10}$.
3. Najmanjši skupni večkratnik imenovalcev $5$, $3$, $10$ in $8$ je $v = 120$.
4. Razširimo vsa števila na imenovalec $120$:
   - $\dfrac{3}{5} = \dfrac{72}{120}$,
   - $-\dfrac{2}{3} = -\dfrac{80}{120}$,
   - $0{,}\overline{6} = \dfrac{2}{3} = \dfrac{80}{120}$,
   - $-0{,}7 = -\dfrac{7}{10} = -\dfrac{84}{120}$,
   - $\dfrac{5}{8} = \dfrac{75}{120}$.
5. Števci po velikosti: $-84 < -80 < 72 < 75 < 80$.
6. Velja $-0{,}7 < -\dfrac{2}{3} < \dfrac{3}{5} < \dfrac{5}{8} < 0{,}\overline{6}$. Števili ekip B in C sta enako daleč od $0$, a minus postavi B daleč levo.
7. Odgovor: od najslabše do najboljše so ekipe D, B, A, E in C.

### Primer 4 – zdaj ti

Kalkulator pri deležu zmag ekipe pokaže $0{,}277777\ldots$ Ekipa je odigrala $18$ tekem. Zapiši delež kot nekrajšljiv ulomek in ugotovi, koliko tekem je zmagala.

**Podatki:** delež zmag $x = 0{,}2\overline{7}$, število tekem $18$
**Iščemo:** nekrajšljiv ulomek za $x$ in število zmag

:::formula
Mešano periodično število pomnožimo z $10$ in s $100$, da se »repa« ujemata, in zmnožka odštejemo.
:::

**Rešitev:**

1. Predperioda ima eno števko, perioda eno, zato množimo z $10$ in s $100$: $10x = 2{,}\overline{7}$ in $100x = 27{,}\overline{7}$.
2. Odštej, skrajšaj in pomnoži z $18$ sam, nato preveri:

:::premisli
Kateri ulomek je $x$ in koliko zmag ima ekipa?
---
$100x - 10x = 27 - 2$, torej $90x = 25$ in $x = \dfrac{25}{90} = \dfrac{5}{18}$. Ekipa je zmagala $5$ tekem od $18$.
:::

## Pogoste napake

- **Seštevanje števcev in imenovalcev: $\dfrac{1}{2} + \dfrac{1}{3} = \dfrac{2}{5}$.** Kosa sta različno velika, $\dfrac{2}{5} = 0{,}4$ pa je celo manj kot $\dfrac{1}{2}$. Pravilno: skupni imenovalec $6$, $\dfrac{3}{6} + \dfrac{2}{6} = \dfrac{5}{6}$.
- **Krajšanje seštevancev: $\dfrac{4 + 3}{4} = 3$.** Krajšamo lahko samo skupne **faktorje** celega števca in celega imenovalca, ne seštevancev. Pravilno: $\dfrac{4 + 3}{4} = \dfrac{7}{4}$. Pri zmnožku se krajša: $\dfrac{4 \cdot 3}{4} = 3$.
- **Napačna primerjava negativnih ulomkov: $-\dfrac{1}{2} > -\dfrac{1}{3}$, ker je $\dfrac{1}{2} > \dfrac{1}{3}$.** Minus obrne vrstni red. Pravilno: na premici je $-0{,}5$ levo od $-0{,}33\ldots$, zato je $-\dfrac{1}{2} < -\dfrac{1}{3}$.
- **Decimalna števila kot cela: $0{,}35 > 0{,}4$, ker je $35 > 4$.** $0{,}35$ je $35$ stotink, $0{,}4$ pa $40$ stotink. Pravilno: izenači število decimalk, $0{,}35$ in $0{,}40$, nato primerjaj $35 < 40$.
- **Periodično število z imenovalcem $10$: $0{,}\overline{3} = \dfrac{3}{10}$.** Ulomek $\dfrac{3}{10}$ je $0{,}3$, brez ponavljanja. Pravilno: $x = 0{,}\overline{3}$, $10x - x = 3$, torej $9x = 3$ in $x = \dfrac{1}{3}$. Pri čisto periodičnem številu ima imenovalec pred krajšanjem toliko devetk, kolikor mest ima perioda.

## Povzetek

- Racionalno število je število oblike $\dfrac{a}{b}$, $a \in \mathbb{Z}$, $b \in \mathbb{N}$; velja $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q}$.
- Enakost ulomkov: $\dfrac{a}{b} = \dfrac{c}{d} \iff ad = bc$; krajšamo z največjim skupnim deliteljem, rezultat naj bo nekrajšljiv.
- Vsota in razlika: skupni imenovalec. Zmnožek: $\dfrac{ac}{bd}$. Količnik: množi z obratno vrednostjo.
- Decimalni zapis je končen ali periodičen. Nekrajšljiv ulomek ima končen zapis natanko tedaj, ko ima v imenovalcu samo praštevili $2$ in $5$.
- Periodično število v ulomek: pomnoži z $10$, $100$, … in odštej, da »rep« izgine.
- Primerjanje: skupni imenovalec ali $\dfrac{a}{b} < \dfrac{c}{d} \iff ad < bc$ ($b, d > 0$); levo na številski premici je manjše.
- Gostost: med dvema racionalnima številoma je vedno še eno, npr. $\dfrac{p+q}{2}$.

## Drugače: Kot zgodba

Lana trenira na stezi, ob kateri stoji šest količkov z oznakami od $1$ do $6$. Med tekom deli $1 : 7$. Začne pri količku $1$, to je prvi ostanek. Na vsakem koraku ostanku pripiše ničlo, deli s $7$, zapiše števko in steče do novega ostanka:

- $10 : 7 = 1$, ostanek $3$; $30 : 7 = 4$, ostanek $2$; $20 : 7 = 2$, ostanek $6$,
- $60 : 7 = 8$, ostanek $4$; $40 : 7 = 5$, ostanek $5$; $50 : 7 = 7$, ostanek $1$.

Spet stoji pri količku $1$. Od tu naprej teče isti krog in zapisuje iste števke: $\dfrac{1}{7} = 0{,}\overline{142857}$.

Količkov je le šest, zato se mora prej ali slej vrniti k enemu od njih in krog je dolg največ šest korakov. Pri $1 : 8$ pa po treh korakih pride do ostanka $0$. To ni količek, ampak cilj: tam se tek in deljenje končata, $\dfrac{1}{8} = 0{,}125$.

## Drugače: Korak za korakom s številkami

Izračunaj $\left(\dfrac{2}{3} - \dfrac{5}{8}\right) : \dfrac{1}{4}$ in rezultat zapiši še kot decimalno število.

| Korak | Kaj naredimo | Rezultat |
|---|---|---|
| 1 | Najprej račun v oklepaju. Najmanjši skupni večkratnik $3$ in $8$ je $24$. | $\dfrac{2}{3} = \dfrac{16}{24}$, $\dfrac{5}{8} = \dfrac{15}{24}$ |
| 2 | Odštejemo števca. | $\dfrac{16}{24} - \dfrac{15}{24} = \dfrac{1}{24}$ |
| 3 | Deljenje zamenjamo z množenjem z obratno vrednostjo. | $\dfrac{1}{24} \cdot \dfrac{4}{1}$ |
| 4 | Pomnožimo in skrajšamo s $4$. | $\dfrac{4}{24} = \dfrac{1}{6}$ |
| 5 | Delimo $1 : 6$: $10 : 6 = 1$, ostanek $4$; $40 : 6 = 6$, ostanek $4$. Ostanek se ponovi, zato se števka $6$ ponavlja. | $0{,}1\overline{6}$ |

Rezultat je $\dfrac{1}{6} = 0{,}1\overline{6}$.

## Preveri se

? Kateri ulomek po vrsti decimalnega zapisa ne spada k ostalim?
- $\dfrac{1}{3}$
~ $0{,}33$ je le zaokrožen zapis. Deljenje $1 : 3$ se nikoli ne konča, zapis je periodičen $0{,}\overline{3}$.
- $\dfrac{5}{12}$
~ Imenovalec $12$ je sod, a vsebuje tudi praštevilo $3$, zato je zapis periodičen: $0{,}41\overline{6}$.
+ $\dfrac{3}{8}$
- $\dfrac{2}{7}$
~ Dolga perioda ni druga vrsta zapisa. $\dfrac{2}{7} = 0{,}\overline{285714}$ je periodičen kot ostali.
> Nekrajšljiv $\dfrac{3}{8}$ ima v imenovalcu $8 = 2 \cdot 2 \cdot 2$ le praštevilo $2$, zato je edini končen: $0{,}375$. Ostali imajo v imenovalcu $3$ ali $7$ in so periodični.

? Število $0{,}\overline{45}$ zapiši kot nekrajšljiv ulomek.
- $\dfrac{9}{20}$
~ $\dfrac{9}{20} = 0{,}45$, brez ponavljanja. Periodično število ni enako končnemu z istimi števkami.
- $\dfrac{1}{2}$
~ Morda si odštel $100x - 10x$ kot pri mešanem periodičnem številu. Tu se perioda začne takoj, ima dve mesti, zato odštej $100x - x$.
+ $\dfrac{5}{11}$
> Naj bo $x = 0{,}\overline{45}$. Perioda ima dve števki, zato je $100x = 45{,}\overline{45}$. Odštejemo $x$: $99x = 45$, torej $x = \dfrac{45}{99} = \dfrac{5}{11}$.

? Pozitivnemu ulomku povečamo imenovalec, števec ostane enak. Kaj se zgodi z njegovo vrednostjo?
- Poveča se.
~ Večja števila ne pomenijo večjega ulomka. Z večjim imenovalcem je celota razdeljena na več manjših kosov, števec pa šteje enako kosov.
+ Zmanjša se.
- Ostane enaka.
~ Vrednost ostane enaka le pri razširjanju, ko števec in imenovalec pomnožimo z istim številom. Tu se spremeni samo imenovalec.
> Pri istem pozitivnem števcu je večji ulomek tisti z manjšim imenovalcem, npr. $\dfrac{1}{5} > \dfrac{1}{8}$. Večji imenovalec torej pomeni manjšo vrednost.

? Nina primerja $-\dfrac{3}{4}$ in $-\dfrac{2}{3}$. (1) Skupni imenovalec je $12$. (2) $-\dfrac{3}{4} = -\dfrac{9}{12}$ in $-\dfrac{2}{3} = -\dfrac{8}{12}$. (3) Ker je $9 > 8$, je $-\dfrac{3}{4} > -\dfrac{2}{3}$. Kateri korak je napačen?
- Korak (1)
~ $v(4, 3) = 12$, korak je pravilen.
- Korak (2)
~ $\dfrac{3}{4} = \dfrac{9}{12}$ in $\dfrac{2}{3} = \dfrac{8}{12}$, minus ostane spredaj. Razširjanje je pravilno.
+ Korak (3)
- Vsi koraki so pravilni.
~ Nina je primerjala števili brez minusa. Pri negativnih številih je manjše tisto, ki je dlje od $0$.
> Primerjati je treba števca $-9$ in $-8$. Ker je $-9 < -8$, je $-\dfrac{3}{4} < -\dfrac{2}{3}$: na premici leži bolj levo.

? V odbojkarski ligi ekipe razvrstijo po deležu zmag. Ekipa A je zmagala $11$ od $15$ tekem, ekipa B $8$ od $11$ in ekipa C $13$ od $18$. Katera ekipa je prva?
+ Ekipa A
- Ekipa B
~ B ima res najmanj porazov ($3$), a odigrala je manj tekem. Šteje delež: $\dfrac{8}{11} = 0{,}\overline{72} < \dfrac{11}{15} = 0{,}7\overline{3}$.
- Ekipa C
~ C ima največ zmag, a tudi največ tekem. Delež $\dfrac{13}{18} = 0{,}7\overline{2}$ je najmanjši.
- Vse tri so izenačene.
~ Na eno decimalko so vsi deleži res približno $0{,}7$, a natančno se razlikujejo.
> $\dfrac{11}{15} > \dfrac{8}{11}$, ker je $11 \cdot 11 = 121 > 15 \cdot 8 = 120$, in $\dfrac{8}{11} > \dfrac{13}{18}$, ker je $8 \cdot 18 = 144 > 11 \cdot 13 = 143$. Prva je ekipa A.

:::simboli
a | števec ulomka | | | celo število
b | imenovalec ulomka | | | naravno število
c | števec drugega ulomka | | |
a', c' | števca ulomkov, razširjenih na skupni imenovalec | | |
d | imenovalec drugega ulomka | | |
v | skupni imenovalec | | | najmanjši skupni večkratnik imenovalcev
:::
