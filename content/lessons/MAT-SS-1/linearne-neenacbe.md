---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Za vrtno ograjo potrebuješ lesene letve. V trgovini z gradbenim materialom stane ena letev $4{,}50\,\text{€}$, dostava na dom pa $6\,\text{€}$. V denarnici imaš $33\,\text{€}$. Koliko letev lahko naročiš?

Odgovor ni eno samo število. Denarja je dovolj za $3$ letve, za $5$ in tudi za $6$, za $7$ pa ne več. Iščemo **območje vrednosti**, ki izpolni pogoj »ne več kot $33\,\text{€}$«. Linearne enačbe, na primer $2x + 3 = 11$, že znaš reševati, števila znaš primerjati na številski premici: $-3 < 2$. Iz obojega zdaj sestavimo novo orodje.

Podobno vprašanje se pojavi na gradbišču. Dvigalo prenese največ $600\,\text{kg}$. Koliko škatel po $45\,\text{kg}$ lahko naložiš poleg sebe, če tehtaš $70\,\text{kg}$?

Tudi tu dobimo **množico rešitev**, ki jo zapišemo kot **interval**. Pri linearni funkciji to pomeni: za katere $x$ je graf nad ali pod določeno vrednostjo.

## Razlaga

**1. Linearna neenačba.** To je neenačba, v kateri se neznanka $x$ pojavlja samo v prvi potenci, npr. $3x - 5 < 7$. Namesto znaka $=$ so znaki:

- $<$ manjše,
- $>$ večje,
- $\le$ manjše ali enako,
- $\ge$ večje ali enako.

*Hitro preveri:* ali je $4x + 1 \ge 0$ linearna neenačba? (Da: $x$ je v prvi potenci.)

**2. Rešitev** je vsako število, ki neenačbo spremeni v pravilno izjavo. Pri $x + 1 > 3$ so rešitve $2{,}5$; $3$; $10$ … in sicer vsa števila, večja od $2$. Rešitev je torej neskončno mnogo.

*Hitro preveri:* ali je $x = 2$ rešitev neenačbe $x + 1 > 3$? (Ne: $3 > 3$ ne drži.)

**3. Ekvivalentna preoblikovanja.** Neenačbo rešujemo podobno kot enačbo:

- na obeh straneh lahko **prištejemo ali odštejemo** isto število, znak ostane enak;
- obe strani lahko **pomnožimo ali delimo s pozitivnim** številom, znak ostane enak;
- obe strani **pomnožimo ali delimo z negativnim** številom, znak pa se **obrne** ($<$ postane $>$ in obratno).

Zakaj se obrne? $2 < 5$ drži. Če pomnožimo z $-1$, dobimo $-2$ in $-5$, na številski premici pa je $-5$ levo od $-2$, torej $-2 > -5$.

:::premisli
Vzemi neenačbo $-x > 3$. Napovej, ali je $x = -5$ rešitev in ali je $x = 0$ rešitev. Kaj ti to pove o smeri končnega znaka?
---
$x = -5$ je rešitev, ker $5 > 3$. $x = 0$ ni, ker $0 > 3$ ne drži. Rešitve so torej števila **levo** od $-3$: $x < -3$. Po deljenju z $-1$ se je $>$ spremenil v $<$.
:::

*Hitro preveri:* kaj dobiš iz $-2x < 8$? ($x > -4$, ker deliš z negativnim številom.)

**4. Zapis rešitve kot interval.** Množico rešitev zapišemo na številski premici in z intervalom:

| Neenačba | Interval |
|---|---|
| $x > a$ | $(a, \infty)$ |
| $x \ge a$ | $[a, \infty)$ |
| $x < a$ | $(-\infty, a)$ |
| $x \le a$ | $(-\infty, a]$ |

Prva dva intervala segata od $a$ naprej, zadnja dva do $a$.

- **Oklepaj** $($ ali $)$ pomeni, da krajišče **ni** v množici (pri strogih znakih $<$, $>$). Na številski premici ga narišemo kot **prazen krožec**.
- **Oglati oklepaj** $[$ ali $]$ pomeni, da krajišče **je** v množici (pri $\le$, $\ge$). Narišemo ga kot **poln krožec**.
- Pri $\infty$ in $-\infty$ je oklepaj vedno okrogel, saj to nista števili.

*Hitro preveri:* kako zapišeš $x \le 7$? ($(-\infty, 7]$.)

**5. Poseben primer.** Včasih členi z $x$ pri poenostavitvi odpadejo in ostane neenačba brez $x$, na primer $0 \cdot x < 5$ ali $0 \cdot x > 5$. Če je resnična, je rešitev vsako realno število $(-\infty, \infty)$; če ni, rešitev ni (prazna množica).

:::premisli
Ima neenačba $2x + 1 < 2x - 3$ kakšno rešitev? Napovej, preden poenostaviš.
---
Nima. Ko na obeh straneh odšteješ $2x$, ostane $1 < -3$, kar ni res za noben $x$. Leva stran je pri vsakem $x$ za $4$ večja od desne.
:::

## Rešeni primeri

### Primer 1: osnovna neenačba

Reši neenačbo $2x + 3 < 11$ in zapiši rešitev kot interval.

**Podatki:** neenačba $2x + 3 < 11$, koeficient pri $x$ je $2$ (pozitiven)
**Iščemo:** množico rešitev kot interval

:::formula
Odštevanje istega števila in deljenje s pozitivnim številom znaka ne spremenita: iz $ax < b$ sledi $x < \dfrac{b}{a}$, če je $a > 0$.
:::

**Rešitev:**

1. Odštejemo $3$ na obeh straneh, da ločimo člen z $x$: $2x < 8$.
2. Delimo z $2$. Ker je $2$ pozitivno število, se znak **ne** obrne: $x < 4$.
3. Interval: $(-\infty, 4)$. Krajišče $4$ ni rešitev, ker je znak strog (prazen krožec).
4. Preizkus: $x = 0$ da $3 < 11$ ✓. $x = 4$ da $11 < 11$, kar ne drži, zato $4$ ni rešitev ✓.
5. Odgovor: rešitve so vsa realna števila, manjša od $4$, torej interval $(-\infty, 4)$.

### Primer 2: negativen koeficient

Reši neenačbo $5 - 3x \le 14$.

**Podatki:** neenačba $5 - 3x \le 14$, koeficient pri $x$ je $-3$ (negativen)
**Iščemo:** množico rešitev kot interval

:::formula
Deljenje z negativnim številom obrne znak: iz $ax \le b$ sledi $x \ge \dfrac{b}{a}$, če je $a < 0$.
:::

**Rešitev:**

1. Odštejemo $5$: $-3x \le 9$.
2. Delimo z $-3$. Ker delimo z negativnim številom, se znak **obrne**: $x \ge -3$.
3. Interval: $[-3, \infty)$. Znak je $\ge$, zato je $-3$ rešitev (poln krožec).
4. Preizkus: $x = -3$ da $5 + 9 = 14 \le 14$ ✓. $x = 0$ da $5 \le 14$ ✓. $x = -4$ da $5 + 12 = 17 \le 14$ ne drži, zato $-4$ ni rešitev ✓.
5. Odgovor: rešitev je interval $[-3, \infty)$.

### Primer 3: letve za ograjo

Vrnimo se k vprašanju z začetka. Letev stane $4{,}50\,\text{€}$, dostava $6\,\text{€}$, imaš $33\,\text{€}$. Koliko letev lahko naročiš?

**Podatki:** cena letve $4{,}50\,\text{€}$, dostava $6\,\text{€}$, denar $33\,\text{€}$
**Iščemo:** vsa možna števila letev $x$

:::formula
dostava $+$ cena letve $\cdot\, x \le$ denar, pri tem $x \ge 0$
:::

**Rešitev:**

1. **Neznanka.** Naj bo $x$ število letev. Velja $x \ge 0$, saj negativnega števila letev ni.
2. **Neenačba.** Račun je $6 + 4{,}5x$ in ne sme preseči $33$, torej $6 + 4{,}5x \le 33$.
3. Odštejemo $6$, da ostane le člen z $x$: $4{,}5x \le 27$.
4. Delimo s $4{,}5$, ki je pozitivno, zato znak ostane: $x \le 6$.
5. Upoštevamo še $x \ge 0$: matematična rešitev je interval $[0, 6]$.
6. Letve kupujemo cele, zato iz intervala vzamemo cela števila $0, 1, \dots, 6$.
7. Preizkus: pri $6$ letvah je račun $6 + 4{,}5 \cdot 6 = 33\,\text{€}$, kar še gre. Pri $7$ bi bil $37{,}5\,\text{€}$.
8. **Odgovor.** Naročiš lahko največ $6$ letev.

### Primer 4: zdaj ti

Reši neenačbo $3(x - 2) \ge 5x + 4$ in zapiši rešitev kot interval.

**Podatki:** neenačba $3(x - 2) \ge 5x + 4$
**Iščemo:** množico rešitev kot interval

:::formula
$a(x - b) = ax - ab$; pri deljenju z negativnim številom se znak obrne.
:::

**Rešitev:**

1. Odpravimo oklepaj, da so vsi členi vidni: $3x - 6 \ge 5x + 4$.
2. Člene z $x$ zberemo levo, števila desno: $3x - 5x \ge 4 + 6$, torej $-2x \ge 10$.
3. Zdaj deli sam in zapiši interval. Pazi na predznak koeficienta.

:::premisli
Kaj dobiš iz $-2x \ge 10$ in kateri interval je to?
---
Delimo z $-2$, zato se znak obrne: $x \le -5$. Interval je $(-\infty, -5]$, krajišče $-5$ je vključeno. Preizkus: pri $x = -5$ sta obe strani $-21$ ✓.
:::

## Pogoste napake

- **Pozabljena obrnitev znaka.** Pri množenju ali deljenju z negativnim številom se znak obrne. Iz $-2x < 6$ sledi $x > -3$, ne $x < -3$.
- **Napačen oklepaj.** Pri $<$ in $>$ krajišče ni rešitev, zato okrogel oklepaj; pri $\le$ in $\ge$ oglati. Pri $\infty$ je oklepaj vedno okrogel.
- **Napačna smer intervala.** Pri $x > 4$ rešitev ni $(-\infty, 4)$. Interval se vedno zapiše od manjšega števila k večjemu: $(4, \infty)$.
- **Obravnavanje kot enačbe.** Rešitev ni eno število, ampak množica. Zapis $x = 4$ pri neenačbi je napačen.
- **Pozabljen dodaten pogoj ali zaokroževanje navzgor** pri besedilnih nalogah. Število letev ne more biti negativno. Iz $x \le 10{,}5$ pri celih kosih sledi največ $10$, ne $11$: pri $11$ bi bil pogoj že prekršen.

## Povzetek

- Linearna neenačba ima obliko $ax + b < c$ (ali z znakom $>$, $\le$, $\ge$).
- Reševanje: prištevanje in odštevanje ne spremeni znaka, množenje in deljenje s pozitivnim številom tudi ne.
- Pri množenju ali deljenju z **negativnim** številom se znak **obrne**.
- Rešitev zapišemo kot interval: okrogel oklepaj pri strogi neenačbi in pri $\pm\infty$, oglati oklepaj pri $\le$, $\ge$.
- Pri besedilnih nalogah upoštevamo še smiselnost rešitve (npr. $x \ge 0$).

## Ponovitev

**Formule**
- Prištevanje, odštevanje: znak ostane (na pamet)
- Množenje ali deljenje s $c > 0$: znak ostane (na pamet)
- S $c < 0$ se znak obrne: $-2x < 6 \Rightarrow x > -3$ (na pamet)
- $x > 4$: $(4, \infty)$; $x \le 4$: $(-\infty, 4]$ (na pamet)

**Postopek**
1. Odpri oklepaje in odpravi ulomke.
2. Člene z $x$ zberi na eni strani.
3. Deli s koeficientom; pri negativnem obrni znak.
4. Rešitev zapiši kot interval in jo nariši na številsko premico.
5. Pri besedilni nalogi upoštevaj smiselnost (npr. $x \ge 0$, cela števila).

**Pazi na**
- Pri deljenju z negativnim številom obrni znak.
- Okrogel oklepaj pri $<$, $>$ in $\pm\infty$, oglati pri $\le$, $\ge$.
- Interval piši od manjšega k večjemu: $x > 4$ je $(4, \infty)$.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Rešite neenačbo $\dfrac{x - 1}{3} - \dfrac{x + 2}{2} \ge \dfrac{x}{6} - 1$ in rešitev zapišite z intervalom.

**Rešitev:**

1. Pomnožimo s pozitivnim številom $6$, znak ostane: $2(x - 1) - 3(x + 2) \ge x - 6$.
2. Odpremo oklepaje: $2x - 2 - 3x - 6 \ge x - 6$, torej $-x - 8 \ge x - 6$ in $-2x \ge 2$.
3. Delimo z negativnim številom $-2$, zato se znak obrne: $x \le -1$.
4. Preizkus: pri $x = -1$ je leva stran $-\dfrac{2}{3} - \dfrac{1}{2} = -\dfrac{7}{6}$ in desna $-\dfrac{1}{6} - 1 = -\dfrac{7}{6}$, zato je $-1$ rešitev. Pri $x = 0$ dobimo $-\dfrac{1}{3} - 1 = -\dfrac{4}{3}$, kar ni večje ali enako $-1$, zato $0$ ni rešitev.
5. Odgovor: $x \in (-\infty, -1]$.

**Točkovanje:** 1 točka za neenačbo brez ulomkov, 1 točka za $-2x \ge 2$ ali enakovredno neenačbo, 1 točka za $x \le -1$ z obrnjenim znakom in interval $(-\infty, -1]$.

### Naloga 2: krajša strukturirana naloga, 6 točk, pola 2 (z računalom)

Podjetje izdeluje majice s potiskom. Mesečni stalni stroški so $1350\,\text{€}$, izdelava ene majice stane $4{,}20\,\text{€}$, majico pa prodajo za $11{,}70\,\text{€}$. Z $x$ označimo število majic, ki jih v mesecu izdelajo in prodajo.

a) Zapišite izraz za mesečni dobiček v odvisnosti od $x$. (1 točka)
b) Zapišite in rešite neenačbo, s katero ugotovite, najmanj koliko majic mora podjetje prodati, da bo dobiček pozitiven. (2 točki)
c) Najmanj koliko majic mora podjetje prodati, da bo dobiček znašal vsaj $20\,\%$ prihodka od prodaje? Mejo izračunajte na dve decimalni mesti natančno in odgovor utemeljite. (3 točke)

**Rešitev:**

1. a) Prihodek je $11{,}70x$, stroški so $1350 + 4{,}20x$. Dobiček je $11{,}70x - 4{,}20x - 1350 = 7{,}50x - 1350$ (v evrih).
2. b) $7{,}50x - 1350 > 0$, torej $7{,}50x > 1350$. Delimo s pozitivnim številom, znak ostane: $x > 180$.
3. b) Pri $180$ majicah je dobiček $0\,\text{€}$, zato mora podjetje prodati najmanj $181$ majic.
4. c) $20\,\%$ prihodka je $0{,}2 \cdot 11{,}70x = 2{,}34x$. Neenačba: $7{,}50x - 1350 \ge 2{,}34x$.
5. c) $5{,}16x \ge 1350$, torej $x \ge \dfrac{1350}{5{,}16} = 261{,}627\ldots \approx 261{,}63$.
6. c) Število majic je celo, zato je najmanjše tako število $262$. Preizkus: pri $262$ majicah je dobiček $7{,}50 \cdot 262 - 1350 = 615\,\text{€}$, $20\,\%$ prihodka pa $2{,}34 \cdot 262 = 613{,}08\,\text{€}$. Pri $261$ majicah je dobiček $607{,}50\,\text{€}$, kar je manj od $2{,}34 \cdot 261 = 610{,}74\,\text{€}$.
7. Odgovor: a) dobiček je $7{,}50x - 1350$ evrov; b) najmanj $181$ majic; c) najmanj $262$ majic.

**Točkovanje:** a) 1 točka za izraz $7{,}50x - 1350$; b) 1 točka za neenačbo in $x > 180$, 1 točka za odgovor $181$ majic; c) 1 točka za neenačbo $7{,}50x - 1350 \ge 2{,}34x$; 1 točka za mejo $261{,}63$; 1 točka za odgovor $262$ majic z utemeljitvijo, zakaj zaokrožimo navzgor.

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Dani sta linearni funkciji $f(x) = \dfrac{x + 7}{2}$ in $g(x) = \dfrac{4x - 2}{3}$.

a) Rešite neenačbo $f(x) \ge g(x)$ in rešitev zapišite z intervalom. (3 točke)
b) Pojasnite, kaj rešitev iz a) pove o legi grafov funkcij $f$ in $g$. (1 točka)
c) Za katera števila $x$ sta vrednosti obeh funkcij pozitivni? (2 točki)
d) Zapišite množico števil $x$, ki izpolnjujejo pogoja iz a) in c) hkrati. (1 točka)
e) Določite realni parameter $p$ tako, da bo množica rešitev neenačbe $f(x) \ge g(x) + p$ enaka $(-\infty, 2]$. (3 točke)

**Rešitev:**

1. a) Pomnožimo s $6$: $3(x + 7) \ge 2(4x - 2)$, torej $3x + 21 \ge 8x - 4$.
2. a) Uredimo: $-5x \ge -25$. Delimo z negativnim številom $-5$ in znak obrnemo: $x \le 5$, torej $x \in (-\infty, 5]$.
3. b) Pri $x = 5$ je $f(5) = g(5) = 6$, zato se grafa sekata v točki $(5, 6)$. Levo od presečišča leži graf funkcije $f$ nad grafom funkcije $g$, desno od njega pa pod njim.
4. c) $f(x) > 0$ velja za $x + 7 > 0$, torej $x > -7$. $g(x) > 0$ velja za $4x - 2 > 0$, torej $x > \dfrac{1}{2}$.
5. c) Obe vrednosti sta pozitivni, ko velja oboje, torej za $x > \dfrac{1}{2}$ oziroma $x \in \left(\dfrac{1}{2}, \infty\right)$.
6. d) Presek intervalov $(-\infty, 5]$ in $\left(\dfrac{1}{2}, \infty\right)$ je $\left(\dfrac{1}{2}, 5\right]$.
7. e) Pomnožimo s $6$: $3x + 21 \ge 8x - 4 + 6p$, torej $-5x \ge 6p - 25$ in po deljenju z $-5$ (znak se obrne) $x \le \dfrac{25 - 6p}{5}$.
8. e) Zahtevamo $\dfrac{25 - 6p}{5} = 2$, torej $25 - 6p = 10$ in $p = \dfrac{5}{2}$.
9. e) Preizkus: $f(2) = \dfrac{9}{2}$ in $g(2) + \dfrac{5}{2} = 2 + \dfrac{5}{2} = \dfrac{9}{2}$, zato je $2$ krajišče intervala rešitev.
10. Odgovor: a) $(-\infty, 5]$; b) za $x \le 5$ graf funkcije $f$ leži nad grafom funkcije $g$ ali ga seka, presečišče je $(5, 6)$; c) $\left(\dfrac{1}{2}, \infty\right)$; d) $\left(\dfrac{1}{2}, 5\right]$; e) $p = \dfrac{5}{2}$.

**Točkovanje:** a) 1 točka za neenačbo brez ulomkov, 1 točka za $-5x \ge -25$, 1 točka za $x \le 5$ z obrnjenim znakom in interval $(-\infty, 5]$; b) 1 točka za pojasnilo s presečiščem $(5, 6)$; c) 1 točka za $x > -7$, 1 točka za $x > \dfrac{1}{2}$ in skupni interval; d) 1 točka za $\left(\dfrac{1}{2}, 5\right]$; e) 1 točka za $x \le \dfrac{25 - 6p}{5}$, 1 točka za enačbo $\dfrac{25 - 6p}{5} = 2$, 1 točka za $p = \dfrac{5}{2}$.

### Ustno vprašanje 1

:::premisli
Katera preoblikovanja linearne neenačbe so ekvivalentna? Dokaži, da se pri množenju z negativnim številom znak neenačbe obrne.
---
Na obeh straneh smemo prišteti ali odšteti isto število in obe strani pomnožiti ali deliti z istim pozitivnim številom, ne da bi se znak spremenil. Pri množenju ali deljenju z negativnim številom se znak obrne. Za dokaz vzemimo $a < b$ in $c < 0$. Tedaj je $b - a > 0$, zato je produkt $c(b - a)$ negativen. Iz $cb - ca < 0$ sledi $cb < ca$, torej $ca > cb$.
:::

### Ustno vprašanje 2

:::premisli
Kako zapišemo množico rešitev linearne neenačbe z intervalom? Pojasni pomen okroglega in oglatega oklepaja ter navedi primer.
---
Rešitev linearne neenačbe je navadno neskončna množica števil, ki jo zapišemo kot interval. Oglati oklepaj pomeni, da krajišče pripada množici, kar je pri znakih $\le$ in $\ge$. Okrogli oklepaj pomeni, da krajišče ne pripada množici, kar je pri znakih $<$ in $>$; pri $\infty$ in $-\infty$ je oklepaj vedno okrogel. Rešitev neenačbe $x \le 3$ je na primer interval $(-\infty, 3]$, rešitev neenačbe $x > 3$ pa interval $(3, \infty)$.
:::

### Ustno vprašanje 3

:::premisli
Navedi primer linearne neenačbe brez rešitve in primer neenačbe, ki jo reši vsako realno število, ter pojasni, kako to prepoznaš.
---
Če se pri poenostavljanju členi z $x$ odštejejo, ostane neenačba brez neznanke, ki je resnična ali neresnična. Pri neenačbi $x + 2 < x$ po odštevanju $x$ dobimo $2 < 0$, kar ni res, zato neenačba nima rešitve. Pri neenačbi $x + 2 > x$ dobimo $2 > 0$, kar je vedno res, zato jo reši vsako realno število. Množica rešitev je v prvem primeru prazna, v drugem pa je to interval $(-\infty, \infty)$.
:::

## Drugače: Na sliki

Na številski premici je rešitev neenačbe **del premice**, ki ga pobarvamo.

Za $x < 4$ pobarvamo vse levo od $4$ in v $4$ narišemo prazen krožec, ker $4$ ni rešitev.

:::risba premica
opis: Številska premica od −3 do 6. Pri 4 je prazen krožec, pobarvan je del premice levo od 4: to so rešitve neenačbe x < 4. Pobarvani del se nadaljuje v levo brez konca.
od: -3
do: 6
interval: -3 .. 4 | x < 4 | modra
točka: 4 | 4 | prazna
:::

Za $x \ge -3$ pobarvamo vse desno od $-3$ in v $-3$ narišemo poln krožec.

:::risba premica
opis: Številska premica od −5 do 4. Pri −3 je poln krožec, pobarvan je del premice desno od −3: to so rešitve neenačbe x ≥ −3. Pobarvani del se nadaljuje v desno brez konca.
od: -5
do: 4
interval: -3 .. 4 | x ≥ −3 | modra
točka: -3 | −3 | polno
:::

Pomaga tudi graf funkcije. Pri $f(x) = 2x + 3$ neenačba $2x + 3 < 11$ sprašuje: **pri katerih $x$ je graf pod vodoravno premico $y = 11$?** Graf in premica se sekata pri $x = 4$. Ker je graf naraščajoč, je pod premico levo od presečišča, torej za $x < 4$.

Če je funkcija padajoča, kot pri $5 - 3x$, je ravno obratno: graf je pod vrednostjo $14$ desno od presečišča. To je slikovna razlaga, zakaj se pri negativnem koeficientu znak obrne.

## Drugače: Iz vsakdanjega življenja

Predstavljaj si dvigalo z napisom »največ $600\,\text{kg}$«. Ti tehtaš $70\,\text{kg}$, vsaka škatla $45\,\text{kg}$. Koliko škatel $x$ lahko naložiš?

$$70 + 45x \le 600$$

Odštejemo $70$: $45x \le 530$. Delimo s $45$: $x \le 11{,}78\ldots$ Ker škatel ne moremo deliti, je največ $11$ škatel. Preveri: $70 + 45 \cdot 11 = 565 \le 600$ ✓, $70 + 45 \cdot 12 = 610 > 600$ ✗.

Iz tega se vidi, da matematična rešitev ($x \le 11{,}78\ldots$) in rešitev v resničnem svetu ($x \in \{0, 1, \dots, 11\}$) nista vedno enaki. Pri besedilnih nalogah vedno premisli, ali je rešitev smiselna.

Analogija za obrnitev znaka: če si po višini razvrščen od najnižjega do najvišjega in se obrneš na glavo (množenje z $-1$), je vrstni red obrnjen.

## Drugače: Korak za korakom s številkami

Reši $4 - 2x > 10$ in preveri z vzorčnimi števili.

| Korak | Zapis | Kaj smo naredili |
|---|---|---|
| 1 | $4 - 2x > 10$ | začetna neenačba |
| 2 | $-2x > 6$ | odšteli $4$ |
| 3 | $x < -3$ | delili z $-2$, znak se obrne |

Interval: $(-\infty, -3)$.

Preizkus z vzorčnimi števili:

| $x$ | $4 - 2x$ | Ali je $> 10$? |
|---|---|---|
| $-5$ | $14$ | da |
| $-3$ | $10$ | ne (enakost, znak je strog) |
| $0$ | $4$ | ne |

Samo števila, manjša od $-3$, ustrezajo, kar se ujema z rešitvijo. Če bi znak pozabili obrniti in zapisali $x > -3$, bi rešitev izbrali napačno. Preizkus z enim številom, na primer $x = 0$, takoj odkrije napako.

## Drugače: Bolj natančno

**Zakaj se znak obrne?** Naj bo $a < b$ in $c < 0$. Potem je $b - a > 0$. Produkt pozitivnega in negativnega števila je negativen, zato $c(b - a) < 0$, torej $cb - ca < 0$ oziroma $cb < ca$. Pri množenju z negativnim številom torej iz $a < b$ sledi $ca > cb$.

**Splošna rešitev.** Neenačba $ax + b < c$ ima za $a \ne 0$ rešitev:

- za $a > 0$: $x < \dfrac{c - b}{a}$, torej interval $\left(-\infty, \dfrac{c - b}{a}\right)$;
- za $a < 0$: $x > \dfrac{c - b}{a}$, torej interval $\left(\dfrac{c - b}{a}, \infty\right)$.

**Pomen intervalov.** Interval je množica vseh realnih števil med dvema krajiščema. Oglati oklepaj pomeni, da je krajišče element množice, okrogli, da ni. Simbol $\infty$ ni število, zato ga ne moremo vključiti in pri njem uporabljamo okrogel oklepaj.

## Preveri se

? Katera slika na številski premici prikazuje rešitve $x \le 2$?
- Prazen krožec pri $2$, pobarvan del levo od $2$.
~ Prazen krožec pomeni, da $2$ ni rešitev. Pri $\le$ je $2$ rešitev, zato je krožec poln.
+ Poln krožec pri $2$, pobarvan del levo od $2$.
- Poln krožec pri $2$, pobarvan del desno od $2$.
~ Desno so števila, večja od $2$. Znak $\le$ zahteva manjša števila, torej levo.
> Pri $\le$ je krajišče vključeno (poln krožec), rešitve so manjše od $2$ (levo). Interval: $(-\infty, 2]$.

? Pri reševanju $-4x < 12$ delimo z $-4$. Zakaj dobimo $x > -3$ in ne $x < -3$?
- Ker je $12$ pozitivno število.
~ Predznak desne strani ne odloča. Znak se obrne zaradi negativnega števila, s katerim deliš.
+ Ker deljenje z negativnim številom obrne vrstni red števil na premici.
- Ker se znak obrne vsakič, ko delimo.
~ Pri deljenju s pozitivnim številom ($2x < 8$ v $x < 4$) znak ostane. Obrne se le pri negativnem.
> Iz $2 < 5$ z množenjem z $-1$ dobiš $-2 > -5$. Isto se zgodi pri deljenju z $-4$, zato $x > -3$. Preizkus: $x = 0$ da $0 < 12$ ✓.

? Katera neenačba ima rešitev $(-\infty, 5)$?
- $7 - x < 2$
~ Iz te dobiš $-x < -5$ in $x > 5$, torej $(5, \infty)$. Pri deljenju z $-1$ se znak obrne.
+ $7 - x > 2$
- $7 - x \ge 2$
~ Ta da $x \le 5$, torej $(-\infty, 5]$: zaradi $\ge$ je $5$ vključen, oklepaj bi bil oglat.
> Odštejemo $7$: $-x > -5$. Delimo z $-1$ in obrnemo znak: $x < 5$. Znak je strog, zato je $5$ izključen.

? (brez računala) Mizar reže letev dolžine $250\,\text{cm}$ na kose po $32\,\text{cm}$ (širino reza zanemari). Koliko celih kosov največ dobi?
= 7 | 0
~ 7,8 | To je meja $x \le 7{,}8\ldots$ iz neenačbe, kosi pa so celi. Vzameš največje celo število v intervalu.
~ 8 | $250 : 32 \approx 7{,}8$; zaokrožil si navzgor, a $8 \cdot 32 = 256\,\text{cm}$ je že več od $250\,\text{cm}$.
> Neenačba $32x \le 250$ da $x \le 7{,}8\ldots$ Ocena: $7 \cdot 32 = 224 \le 250$, $8 \cdot 32 = 256 > 250$. Največ $7$ kosov.

? (brez računala) Zidar zida steno, ki sme biti visoka največ $2{,}4\,\text{m}$. Temelj je visok $0{,}3\,\text{m}$, vsaka vrsta zidakov z malto $0{,}2\,\text{m}$. Koliko vrst $x$ največ lahko sezida?
= 10 | 0
~ 10,5 | To je meja $x \le 10{,}5$ iz neenačbe, vrste pa so cele. Vzameš največje celo število v intervalu.
~ 12 | To je $2{,}4 : 0{,}2$: pozabil si odšteti temelj. Neenačba je $0{,}3 + 0{,}2x \le 2{,}4$.
~ 11 | Iz $x \le 10{,}5$ si zaokrožil navzgor. Pri $11$ vrstah bi bila stena $2{,}5\,\text{m}$, kar je preveč.
> $0{,}3 + 0{,}2x \le 2{,}4$, odštejemo $0{,}3$: $0{,}2x \le 2{,}1$, delimo z $0{,}2$: $x \le 10{,}5$. Vrste so cele, zato največ $10$.

:::simboli
x | neznanka (v besedilnih nalogah število letev) | | |
a | koeficient pri $x$ | | | njegov predznak odloči, ali se znak obrne; v preglednici intervalov je $a$ krajišče
b | število na desni strani neenačbe $ax < b$ | | | v obliki $ax + b < c$ je $b$ prosti člen na levi
c | število na desni strani neenačbe $ax + b < c$ | | | v dokazu obrnitve znaka negativno število, s katerim množimo
f, g | linearni funkciji | | |
p | parameter | | | dano realno število
:::

<<RACUN
neenacba: (x-1)/3-(x+2)/2>=x/6-1 | x | (-oo, -1]
neenacba: -2*x>=2 | x | (-oo, -1]
vrednost: (-1-1)/3-(-1+2)/2 | -7/6
vrednost: -1/6-1 | -7/6
enako: 11.7*x-4.2*x-1350 | 7.5*x-1350
neenacba: 7.5*x-1350>0 | x | (180, oo)
neenacba: 15/2*x-1350>=234/100*x | x | [11250/43, oo)
vrednost: 1350/5.16 | 261.63
vrednost: 7.5*262-1350 | 615
vrednost: 2.34*262 | 613.08
vrednost: 7.5*261-1350 | 607.5
vrednost: 2.34*261 | 610.74
neenacba: (x+7)/2>=(4*x-2)/3 | x | (-oo, 5]
vrednost: (5+7)/2 | 6
vrednost: (4*5-2)/3 | 6
neenacba: (x+7)/2>0 | x | (-7, oo)
neenacba: (4*x-2)/3>0 | x | (1/2, oo)
neenacba: (x+7)/2>=(4*x-2)/3+5/2 | x | (-oo, 2]
resi: (25-6*p)/5=2 | p | 5/2
neenacba: x+2<x | x | none
neenacba: x+2>x | x | (-oo, oo)
neenacba: 32*x<=250 | x | (-oo, 125/16]
neenacba: 0.3+0.2*x<=2.4 | x | (-oo, 21/2]
>>
