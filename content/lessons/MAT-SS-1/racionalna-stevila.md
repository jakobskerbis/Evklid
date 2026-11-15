---
stanje: preverjeno
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

Vsako racionalno število ima končen ali periodičen decimalni zapis. Kdaj je zapis končen? Takrat, ko ima **nekrajšljiv** ulomek v imenovalcu samo praštevili $2$ in $5$ (ali nobenega). Takrat ga lahko razširimo na imenovalec $10$, $100$, $1000$, …, ki so zmnožki samih dvojk in petic, npr. $\dfrac{3}{8} = \dfrac{375}{1000}$. Takemu ulomku rečemo **desetiški ulomek**. Ulomek $\dfrac{5}{12}$ je periodičen, ker je $12 = 2 \cdot 2 \cdot 3$ in nastopa praštevilo $3$. Pozor: ulomek $\dfrac{9}{15}$ ima v imenovalcu faktor $3$, a ga lahko skrajšamo v $\dfrac{3}{5} = 0{,}6$, zato je končen. Najprej vedno skrajšaj.

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

**Delež v odstotkih.** Odstotek je stotina: $1\,\% = \dfrac{1}{100} = 0{,}01$. Za odstotke delež zapišemo kot decimalno število in ga pomnožimo s $100$: Majin delež je $\dfrac{5}{8} = 0{,}625 = 62{,}5\,\%$, Anin pa $\dfrac{7}{12} = 0{,}58\overline{3} \approx 58{,}3\,\%$. Obratno: $35\,\% = \dfrac{35}{100} = \dfrac{7}{20}$, zato je $35\,\%$ od $60$ enako $\dfrac{7}{20} \cdot 60 = 21$. Procentni račun nadgradiš v lekciji o obrestnem računu.

**6. Urejenost.** Pri primerjanju se hitro ujamemo v dve bližnjici: »$0{,}35 > 0{,}4$, ker je $35 > 4$« in »$-\dfrac{1}{2} > -\dfrac{1}{3}$, ker je $\dfrac{1}{2} > \dfrac{1}{3}$«. Obe sta napačni. Za poljubni racionalni števili $p$ in $q$ velja natanko ena od možnosti: $p < q$, $p = q$ ali $p > q$. Na številski premici je manjše število levo od večjega:

$$-1 \;<\; -\tfrac{1}{2} \;<\; -\tfrac{1}{3} \;<\; 0 \;<\; 0{,}35 \;<\; 0{,}4 \;<\; 1$$

Ulomek $\dfrac{a}{b}$ narišemo na premico tako, da enoto razdelimo na $b$ enakih delov in od $0$ odmerimo $|a|$ takih delov: v desno, če je število pozitivno, v levo, če je negativno (Primer 5).

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

**7. Zakoni računskih operacij.** Za vsa racionalna števila $p$, $q$ in $r$ veljajo isti zakoni kot za cela števila:

- zamenljivost: $p + q = q + p$ in $p \cdot q = q \cdot p$,
- združevalnost: $(p + q) + r = p + (q + r)$ in $(p \cdot q) \cdot r = p \cdot (q \cdot r)$,
- razčlenitev: $p \cdot (q + r) = p \cdot q + p \cdot r$,
- nevtralna elementa: $p + 0 = p$ in $p \cdot 1 = p$,
- nasprotno število: $p + (-p) = 0$; obratna vrednost: $p \cdot \dfrac{1}{p} = 1$ za $p \neq 0$.

Zakoni veljajo, ker z ulomki računamo prek števcev in imenovalcev, ki so cela števila. Tako je $\dfrac{a}{b} \cdot \dfrac{c}{d} = \dfrac{a \cdot c}{b \cdot d} = \dfrac{c \cdot a}{d \cdot b} = \dfrac{c}{d} \cdot \dfrac{a}{b}$. Nova je le obratna vrednost: v $\mathbb{Z}$ jo imata samo $1$ in $-1$, v $\mathbb{Q}$ pa vsako število razen $0$. Odštevanje in deljenje nista zamenljivi: $\dfrac{1}{2} : \dfrac{1}{4} = 2$, a $\dfrac{1}{4} : \dfrac{1}{2} = \dfrac{1}{2}$.

Zakoni skrajšajo račun. Z zamenljivostjo in združevalnostjo: $\dfrac{5}{6} + \dfrac{2}{9} + \dfrac{1}{6} = \left(\dfrac{5}{6} + \dfrac{1}{6}\right) + \dfrac{2}{9} = 1 + \dfrac{2}{9} = \dfrac{11}{9}$. Z razčlenitvijo: $\dfrac{3}{7} \cdot \dfrac{5}{8} + \dfrac{3}{7} \cdot \dfrac{3}{8} = \dfrac{3}{7} \cdot \left(\dfrac{5}{8} + \dfrac{3}{8}\right) = \dfrac{3}{7} \cdot 1 = \dfrac{3}{7}$.

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

### Primer 5: Racionalna števila na številski premici

Na številski premici predstavi števila $\dfrac{5}{4}$, $-\dfrac{3}{4}$ in $-1{,}5$.

**Podatki:** števila $\dfrac{5}{4}$, $-\dfrac{3}{4}$ in $-1{,}5$
**Iščemo:** lego vseh treh števil na številski premici

:::formula
Za $\dfrac{a}{b}$ enoto razdelimo na $b$ enakih delov in od $0$ odmerimo $|a|$ delov: v desno pri pozitivnem, v levo pri negativnem številu.
:::

**Rešitev:**

1. Decimalno število zapišemo kot ulomek: $-1{,}5 = -\dfrac{3}{2} = -\dfrac{6}{4}$. Vsa tri števila imajo imenovalec $4$, zato enoto razdelimo na četrtine.
2. $\dfrac{5}{4}$: od $0$ odmerimo $5$ četrtin v desno. To je ena cela in še ena četrtina, $\dfrac{5}{4} = 1\dfrac{1}{4}$.
3. $-\dfrac{3}{4}$: od $0$ odmerimo $3$ četrtine v levo.
4. $-\dfrac{6}{4}$: od $0$ odmerimo $6$ četrtin v levo, to je na sredini med $-2$ in $-1$.

:::risba premica
opis: Številska premica od −2 do 2, vsaka enota je razdeljena na četrtine, napisana so cela števila. Točka −3/2 leži na sredini med −2 in −1, točka −3/4 tri četrtine levo od 0, točka 5/4 eno četrtino desno od 1.
od: -2
do: 2
korak: 0,25
oznake: 1
točka: -1,5 | −3/2 | modra
točka: -0,75 | −3/4 | modra
točka: 1,25 | 5/4 | modra
:::

5. Odgovor: z leve proti desni ležijo $-1{,}5 < -\dfrac{3}{4} < \dfrac{5}{4}$.

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
- V $\mathbb{Q}$ veljajo zamenljivost, združevalnost in razčlenitev; vsako število razen $0$ ima obratno vrednost. Odstotek je stotina: $\dfrac{5}{8} = 62{,}5\,\%$.

## Ponovitev

**Formule**
- $\frac{a}{b} = \frac{c}{d} \iff ad = bc$ (na pamet)
- $\frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}$, $\frac{a}{b} : \frac{c}{d} = \frac{a}{b} \cdot \frac{d}{c}$ (na pamet)
- vsota in razlika: najprej skupni imenovalec, najbolje $v(b, d)$ (na pamet)
- $\frac{a}{b} < \frac{c}{d} \iff ad < bc$ za $b, d > 0$ (na pamet)
- končen decimalni zapis: v imenovalcu nekrajšljivega ulomka le praštevili $2$ in $5$ (na pamet)

**Postopek**
1. Decimalna in periodična števila zapiši kot ulomke.
2. Pri seštevanju poišči skupni imenovalec, pri deljenju množi z obratno vrednostjo.
3. Krajšaj le skupne faktorje; rezultat naj bo nekrajšljiv.
4. Periodično število: $x = 0{,}\overline{3}$, $10x - x = 3$, $x = \frac{1}{3}$.

**Pazi na**
- Števcev in imenovalcev ne seštevaj: $\frac{1}{2} + \frac{1}{3} = \frac{5}{6}$.
- Krajšaš faktorje, ne seštevancev: $\frac{4 + 3}{4} = \frac{7}{4}$.
- Minus obrne vrstni red: $-\frac{1}{2} < -\frac{1}{3}$.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Število $0{,}\overline{135}$ zapiši kot nekrajšljiv ulomek. Nato brez računala ugotovi, katero od števil $0{,}\overline{135}$ in $\dfrac{2}{15}$ je večje.

**Rešitev:**

1. Naj bo $x = 0{,}\overline{135}$. Perioda ima tri števke, zato je $1000x = 135{,}\overline{135}$. Odštejemo $x$ in dobimo $999x = 135$.
2. $x = \dfrac{135}{999} = \dfrac{5}{37}$, krajšali smo s $27$, saj je $135 = 27 \cdot 5$ in $999 = 27 \cdot 37$.
3. Primerjamo $\dfrac{5}{37}$ in $\dfrac{2}{15}$: imenovalca sta pozitivna, $5 \cdot 15 = 75$ in $37 \cdot 2 = 74$. Ker je $75 > 74$, je $\dfrac{5}{37} > \dfrac{2}{15}$.
4. Odgovor: $0{,}\overline{135} = \dfrac{5}{37}$, večje je število $0{,}\overline{135}$.

**Točkovanje:** 1 točka za enačbo $999x = 135$, 1 točka za nekrajšljiv ulomek $\dfrac{5}{37}$, 1 točka za utemeljeno primerjavo in pravilen sklep.

### Naloga 2: krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Zbiralnik za deževnico je bil zjutraj napolnjen do $\dfrac{3}{8}$ svoje prostornine. Čez dan je natekla še voda, ki zavzema $\dfrac{5}{12}$ prostornine zbiralnika. Zvečer so za zalivanje porabili $\dfrac{2}{3}$ vode, ki je bila takrat v zbiralniku.

a) Kolikšen del prostornine zbiralnika je bil napolnjen tik pred zalivanjem? (2 točki)
b) Kolikšen del prostornine zbiralnika je bil napolnjen po zalivanju? Rezultat zapiši kot nekrajšljiv ulomek. (2 točki)
c) Brez deljenja utemelji, ali ima ulomek iz b) končen ali periodičen decimalni zapis. Nato ga zapiši kot decimalno število. (2 točki)
d) Prostornina zbiralnika je $360$ litrov. Koliko litrov vode je ostalo v zbiralniku po zalivanju? (1 točka)

**Rešitev:**

1. a) Skupni imenovalec je $v(8, 12) = 24$: $\dfrac{3}{8} + \dfrac{5}{12} = \dfrac{9}{24} + \dfrac{10}{24} = \dfrac{19}{24}$.
2. b) Porabili so $\dfrac{2}{3}$ vode, ostala je $1 - \dfrac{2}{3} = \dfrac{1}{3}$ vode. To je $\dfrac{1}{3} \cdot \dfrac{19}{24} = \dfrac{19}{72}$ prostornine.
3. b) Ulomek je nekrajšljiv, ker je $19$ praštevilo, ki ne deli $72$.
4. c) $72 = 2^3 \cdot 3^2$. Nekrajšljiv ulomek ima v imenovalcu tudi praštevilo $3$, zato je decimalni zapis periodičen.
5. c) Delimo $19 : 72$: $190 : 72 = 2$, ostanek $46$; $460 : 72 = 6$, ostanek $28$; $280 : 72 = 3$, ostanek $64$; $640 : 72 = 8$, ostanek $64$. Ostanek se ponovi, zato se ponavlja števka $8$: $\dfrac{19}{72} = 0{,}263\overline{8}$.
6. d) $\dfrac{19}{72} \cdot 360\,\text{l} = 19 \cdot 5\,\text{l} = 95\,\text{l}$.
7. Odgovor: pred zalivanjem je bilo napolnjenih $\dfrac{19}{24}$ prostornine, po zalivanju $\dfrac{19}{72} = 0{,}263\overline{8}$ prostornine (periodičen zapis), to je $95$ litrov vode.

**Točkovanje:** a) 1 točka za razširitev na skupni imenovalec, 1 točka za $\dfrac{19}{24}$; b) 1 točka za množenje $\dfrac{1}{3} \cdot \dfrac{19}{24}$ (ali odštevanje $\dfrac{19}{24} - \dfrac{2}{3} \cdot \dfrac{19}{24}$), 1 točka za $\dfrac{19}{72}$; c) 1 točka za utemeljitev z razcepom imenovalca $72 = 2^3 \cdot 3^2$, 1 točka za $0{,}263\overline{8}$; d) 1 točka za $95$ litrov.

### Ustno vprašanje 1

:::premisli
Kaj je racionalno število in zakaj množico celih števil razširimo z racionalnimi števili?
---
Racionalno število je število, ki ga lahko zapišemo kot ulomek $\dfrac{a}{b}$, kjer je $a$ celo število in $b$ naravno število. V množici celih števil deljenje ne uspe vedno, saj na primer enačba $3x = 1$ v $\mathbb{Z}$ nima rešitve. V množici $\mathbb{Q}$ so vsota, razlika, zmnožek in količnik dveh racionalnih števil (pri količniku z deliteljem, različnim od $0$) spet racionalna števila. Vsako celo število je tudi racionalno, zato velja $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q}$.
:::

### Ustno vprašanje 2

:::premisli
Kdaj ima nekrajšljiv ulomek končen decimalni zapis? Pojasni in navedi primer.
---
Nekrajšljiv ulomek ima končen decimalni zapis natanko tedaj, ko ima njegov imenovalec v razcepu na prafaktorje le praštevili $2$ in $5$. Takrat ulomek razširimo na imenovalec $10$, $100$, $1000$ …, ki so zmnožki samih dvojk in petic, na primer $\dfrac{3}{8} = \dfrac{375}{1000} = 0{,}375$. Obratno je število s $k$ decimalkami enako ulomku z imenovalcem $10^k = 2^k \cdot 5^k$, zato imenovalec nekrajšljivega ulomka deli $10^k$ in nima drugih prafaktorjev kot $2$ in $5$. Če imenovalec vsebuje kako drugo praštevilo, zapis torej ni končen, ampak periodičen, na primer $\dfrac{1}{3} = 0{,}\overline{3}$. Ulomek moramo pred presojo skrajšati, saj ima $\dfrac{9}{15} = \dfrac{3}{5} = 0{,}6$ končen zapis, čeprav je v imenovalcu $15$ faktor $3$.
:::

### Ustno vprašanje 3

:::premisli
Dokaži, da med dvema različnima racionalnima številoma vedno leži še eno racionalno število.
---
Naj bosta $p$ in $q$ racionalni števili in $p < q$. Njuno povprečje $\dfrac{p + q}{2}$ je racionalno število, ker sta vsota in količnik racionalnih števil (z deliteljem $2 \neq 0$) spet racionalni števili. Iz $p < q$ sledi $2p < p + q < 2q$, po deljenju s pozitivnim številom $2$ pa $p < \dfrac{p + q}{2} < q$. Postopek lahko ponavljamo, zato med $p$ in $q$ leži neskončno mnogo racionalnih števil in »naslednjega« racionalnega števila ni.
:::

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

? Katera točka na premici pripada številu $-\dfrac{7}{5}$?
:::risba premica
opis: Številska premica od −2 do 2, vsaka enota je razdeljena na petine, napisana so cela števila. Točka A leži dve petini levo od −1, točka B dve petini levo od 0, točka C dve petini desno od 0, točka D dve petini desno od 1.
od: -2
do: 2
korak: 0,2
oznake: 1
točka: -1,4 | A | modra
točka: -0,4 | B | modra
točka: 0,4 | C | modra
točka: 1,4 | D | modra
:::
+ A
- B
~ B je $-\dfrac{2}{5}$. Odmeriti moraš $7$ petin, to je cela enota in še $2$ petini.
- C
~ C je $\dfrac{2}{5}$: napačna sta smer in velikost. Negativno število leži levo od $0$.
- D
~ D je $\dfrac{7}{5}$. Velikost je prava, a negativno število leži levo od $0$.
> $-\dfrac{7}{5} = -1\dfrac{2}{5}$: od $0$ odmerimo $7$ petin v levo, to je do $-1$ in še dve petini naprej, točka A.

? (brez računala) Z razčlenitvijo izračunaj $\dfrac{3}{4} \cdot \dfrac{7}{9} + \dfrac{3}{4} \cdot \dfrac{2}{9}$. Rezultat vpiši kot decimalno število.
= 0,75
~ 1,5 | Faktor $\dfrac{3}{4}$ si vzel dvakrat. Pri razčlenitvi ga izpostaviš enkrat: $\dfrac{3}{4} \cdot \left(\dfrac{7}{9} + \dfrac{2}{9}\right)$.
> $\dfrac{3}{4} \cdot \left(\dfrac{7}{9} + \dfrac{2}{9}\right) = \dfrac{3}{4} \cdot 1 = \dfrac{3}{4} = 0{,}75$.

? Pri testu je Luka pravilno rešil $17$ od $20$ nalog. Koliko odstotkov nalog je rešil pravilno?
= 85 %
~ 17 | To je število nalog, ne delež.
~ 0,85 | To je delež. V odstotkih ga pomnoži s $100$.
> $\dfrac{17}{20} = \dfrac{85}{100} = 0{,}85 = 85\,\%$.

<<RACUN
vrednost: 5/8 | 0.625
vrednost: 35/100 | 7/20
vrednost: 7/20*60 | 21
vrednost: 5/6+2/9+1/6 | 11/9
vrednost: 3/7*5/8+3/7*3/8 | 3/7
vrednost: (1/2)/(1/4) | 2
vrednost: (1/4)/(1/2) | 1/2
vrednost: -1.5*4 | -6
vrednost: 3/4*7/9+3/4*2/9 | 0.75
vrednost: 17/20*100 | 85
vrednost: 7/12*100 | 58.3
vrednost: 5/4 | 1.25
vrednost: -7/5 | -1.4
resi: 999*x=135 | x | 5/37
vrednost: 135/999 | 5/37
vrednost: 5*15 | 75
vrednost: 37*2 | 74
vrednost: 3/8+5/12 | 19/24
vrednost: 1-2/3 | 1/3
vrednost: 1/3*19/24 | 19/72
vrednost: 19/24-2/3*19/24 | 19/72
vrednost: 19/72 | 0.2638889
vrednost: 19/72*360 | 95
>>

:::simboli
a | števec ulomka | | | celo število
b | imenovalec ulomka | | | naravno število
c | števec drugega ulomka | | |
a', c' | števca ulomkov, razširjenih na skupni imenovalec | | |
d | imenovalec drugega ulomka | | |
v | skupni imenovalec | | | najmanjši skupni večkratnik imenovalcev
p, q, r | racionalna števila (urejenost, gostost, zakoni računskih operacij) | | |
:::
