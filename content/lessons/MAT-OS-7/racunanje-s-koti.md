---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poskus za jasen večer: iztegni roko in proti nebu pokaži mezinec. Na tej razdalji pokrije približno $1^\circ$ neba. Ko je Luna polna, jo poskusi skriti za mezinec. Skriješ jo v celoti in ob strani ostane še nekaj prostora. Luna je na nebu široka le približno pol stopinje.

Šolski kotomer kaže cele stopinje, astronomom, pilotom in pomorščakom pa to ni dovolj. Zato stopinjo razdelimo na manjše dele, **kotne minute**. Navidezni premer Lune, torej kako široka je videti na nebu, je približno $31'$ (enaintrideset kotnih minut), Ljubljana leži na zemljepisni širini približno $46^\circ 03'$.

Že znaš kote meriti in poznaš pare kotov: sokota merita skupaj $180^\circ$, komplementarna kota $90^\circ$. Zdaj boš kote pretvarjal med stopinjami in minutami ter jih sešteval, odšteval, množil in delil z naravnim številom. Računaš podobno kot z urami in minutami.

## Razlaga

**1. Kotna minuta.** Stopinjo razdelimo na $60$ enakih delov. En tak del je **kotna minuta**, označimo jo z znakom $'$:

$$1^\circ = 60'$$

Kot, ki meri $35$ stopinj in $48$ minut, zapišemo $35^\circ 48'$ in preberemo »petintrideset stopinj in oseminštirideset minut«.

Za še natančnejše meritve minuto razdelimo na $60$ **kotnih sekund** ($1' = 60''$). Tu bomo računali samo s stopinjami in minutami.

**2. Pravilen zapis.** V pravilnem zapisu je število minut vedno med $0$ in $59$. Če dobiš $60$ ali več minut, jih pretvoriš v stopinje:

$$62^\circ 73' = 62^\circ + 60' + 13' = 63^\circ 13'$$

**3. Pretvarjanje stopinj v minute.** Stopinje množimo s $60$:

- $3^\circ = 3 \cdot 60' = 180'$,
- $12^\circ 25' = 12 \cdot 60' + 25' = 720' + 25' = 745'$.

**4. Pretvarjanje minut v stopinje.** Minute delimo s $60$; količnik so stopinje, ostanek so minute:

- $150' = 2^\circ 30'$, ker je $150 : 60 = 2$, ostanek $30$.

**5. Decimalni zapis stopinj.** Kot je lahko zapisan tudi z decimalnim številom, npr. $15{,}4^\circ$. Decimalni del množimo s $60$:

- $15{,}4^\circ = 15^\circ + 0{,}4 \cdot 60' = 15^\circ 24'$,
- $0{,}5^\circ = 30'$, $\;0{,}25^\circ = 15'$, $\;0{,}75^\circ = 45'$.

Obratno: $45' = \dfrac{45}{60}{}^\circ = 0{,}75^\circ$.

**6. Seštevanje.** Poglej tri vsote. V srednjem stolpcu so stopinje in minute seštete vsake posebej:

| vsota | posebej | pravilen zapis |
|---|---|---|
| $10^\circ 20' + 5^\circ 15'$ | $15^\circ 35'$ | $15^\circ 35'$ |
| $20^\circ 40' + 10^\circ 30'$ | $30^\circ 70'$ | $31^\circ 10'$ |
| $15^\circ 45' + 15^\circ 15'$ | $30^\circ 60'$ | $31^\circ 0'$ |

:::premisli
V katerih vrsticah se zapis na koncu spremeni in zakaj? Napovej še, koliko je $40^\circ 59' + 1'$.
---
V drugi in tretji, ker je minut $60$ ali več. Vsakih $60'$ je $1^\circ$, zato jih prenesemo k stopinjam. $40^\circ 59' + 1' = 40^\circ 60' = 41^\circ 0'$.
:::

Pravilo: seštejemo posebej stopinje in posebej minute. Če je minut $60$ ali več, $60'$ zamenjamo z $1^\circ$.

**7. Odštevanje.** Odštejemo posebej stopinje in posebej minute. Pri $50^\circ 10' - 20^\circ 40'$ pa minut zmanjka, saj $10' - 40'$ ne gre. Tedaj si »izposodimo« eno stopinjo in jo spremenimo v $60'$: $50^\circ 10' = 49^\circ 70'$.

:::premisli
Koliko je $180^\circ - 123^\circ 45'$? Namig: $180^\circ$ nima minut, zato najprej eno stopinjo razbij na $60'$.
---
$180^\circ = 179^\circ 60'$, zato je $179^\circ 60' - 123^\circ 45' = 56^\circ 15'$. Preizkus: $56^\circ 15' + 123^\circ 45' = 179^\circ 60' = 180^\circ$.
:::

Pogosta primera izposojanja: $90^\circ = 89^\circ 60'$ in $180^\circ = 179^\circ 60'$.

**8. Množenje z naravnim številom.** Z istim številom pomnožimo stopinje in minute, nato zapis uredimo.

**9. Deljenje z naravnim številom.** Najprej delimo stopinje. Ostanek stopinj pretvorimo v minute in jih prištejemo minutam, nato delimo še minute.

| Operacija | Primer | Postopek |
|---|---|---|
| seštevanje | $20^\circ 40' + 10^\circ 30'$ | $30^\circ 70' = 31^\circ 10'$ |
| odštevanje | $50^\circ 10' - 20^\circ 40'$ | $49^\circ 70' - 20^\circ 40' = 29^\circ 30'$ |
| množenje | $2 \cdot 15^\circ 40'$ | $30^\circ 80' = 31^\circ 20'$ |
| deljenje | $25^\circ 30' : 3$ | $24^\circ 90' : 3 = 8^\circ 30'$ |

V simulaciji spodaj (**Seštevanje kotov v stopinjah in minutah**) z drsniki nastaviš stopinje in minute dveh kotov. Nastavi $35^\circ 40'$ in $54^\circ 20'$. Opazi, da je minut skupaj ravno $60$, zato vsota postane $90^\circ 0'$: kota sta komplementarna.

## Rešeni primeri

### Primer 1 (lažji)

Kot $\alpha$ meri $35^\circ 48'$, kot $\beta$ pa $27^\circ 25'$. Koliko meri vsota $\alpha + \beta$?

**Podatki:** $\alpha = 35^\circ 48'$, $\beta = 27^\circ 25'$
**Iščemo:** vsoto $\alpha + \beta$

:::formula
Stopinje seštejemo s stopinjami, minute z minutami; nato uporabimo $60' = 1^\circ$.
:::

**Rešitev:**

1. Seštejemo stopinje: $35^\circ + 27^\circ = 62^\circ$.
2. Seštejemo minute: $48' + 25' = 73'$.
3. Vmesni rezultat je $62^\circ 73'$. Minut je več kot $60$, zato $73' = 60' + 13' = 1^\circ 13'$.
4. $62^\circ 73' = 63^\circ 13'$.
5. Preverimo v minutah: $35^\circ 48' = 2148'$, $27^\circ 25' = 1645'$, vsota $3793'$; $3793 : 60 = 63$, ostanek $13$. ✓
6. Odgovor: vsota kotov meri $63^\circ 13'$.

### Primer 2 (srednji)

Kot $\alpha$ meri $52^\circ 17'$. Izračunaj njegov sokot $\beta$ in njegov komplementarni kot $\gamma$.

**Podatki:** $\alpha = 52^\circ 17'$
**Iščemo:** sokot $\beta$ in komplementarni kot $\gamma$

:::formula
$\beta = 180^\circ - \alpha$, $\quad \gamma = 90^\circ - \alpha$; pri odštevanju uporabi $180^\circ = 179^\circ 60'$ in $90^\circ = 89^\circ 60'$.
:::

**Rešitev:**

1. Pri $180^\circ$ ni minut, zato si izposodimo eno stopinjo: $180^\circ = 179^\circ 60'$.
2. $\beta = 179^\circ 60' - 52^\circ 17' = 127^\circ 43'$.
3. Enako za komplementarni kot: $90^\circ = 89^\circ 60'$.
4. $\gamma = 89^\circ 60' - 52^\circ 17' = 37^\circ 43'$.
5. Preverimo: $52^\circ 17' + 127^\circ 43' = 179^\circ 60' = 180^\circ$ ✓ in $52^\circ 17' + 37^\circ 43' = 89^\circ 60' = 90^\circ$ ✓.
6. Odgovor: sokot meri $127^\circ 43'$, komplementarni kot pa $37^\circ 43'$. Opazi, da se razlikujeta natanko za $90^\circ$.

### Primer 3 (težji)

Kot $\alpha$ meri $24^\circ 38'$. Kot $\beta$ je trikrat tolikšen kot $\alpha$. Kot $\gamma$ je sokot kota $\beta$. Izračunaj $\beta$, $\gamma$ in tretjino kota $\gamma$.

**Podatki:** $\alpha = 24^\circ 38'$, $\beta = 3 \cdot \alpha$, $\gamma$ je sokot kota $\beta$
**Iščemo:** $\beta$, $\gamma$ in $\gamma : 3$

:::formula
$\beta = 3 \cdot \alpha$, $\quad \gamma = 180^\circ - \beta$; pri deljenju ostanek stopinj pretvori v minute ($1^\circ = 60'$).
:::

**Rešitev:**

1. Množenje: $3 \cdot 24^\circ 38' = 72^\circ 114'$.
2. Uredimo: $114' = 60' + 54' = 1^\circ 54'$, zato $\beta = 73^\circ 54'$.
3. Sokot: $\gamma = 180^\circ - 73^\circ 54' = 179^\circ 60' - 73^\circ 54' = 106^\circ 6'$.
4. Deljenje stopinj: $106 : 3 = 35$, ostanek $1$ (ker $3 \cdot 35 = 105$).
5. Ostanek $1^\circ = 60'$ prištejemo minutam: $60' + 6' = 66'$.
6. Deljenje minut: $66' : 3 = 22'$. Torej $\gamma : 3 = 35^\circ 22'$.
7. Preverimo: $3 \cdot 35^\circ 22' = 105^\circ 66' = 106^\circ 6'$. ✓
8. Odgovor: $\beta = 73^\circ 54'$, $\gamma = 106^\circ 6'$, tretjina kota $\gamma$ pa meri $35^\circ 22'$.

### Primer 4 – zdaj ti

Opoldne je Sonce najvišje na nebu. Na zemljepisni širini $\varphi$ je 21. junija opoldne na višini $90^\circ - \varphi + 23^\circ 26'$ nad obzorjem, 21. decembra pa na višini $90^\circ - \varphi - 23^\circ 26'$. Kot $23^\circ 26'$ je nagib zemeljske osi. Kako visoko je opoldansko Sonce v Ljubljani ($\varphi = 46^\circ 03'$) na oba dneva? Za koliko je junija višje?

**Podatki:** $\varphi = 46^\circ 03'$, nagib osi $\varepsilon = 23^\circ 26'$
**Iščemo:** višino Sonca $h_1$ (21. junij), $h_2$ (21. december) in razliko $h_1 - h_2$

:::formula
$h_1 = 90^\circ - \varphi + \varepsilon$, $\quad h_2 = 90^\circ - \varphi - \varepsilon$
:::

**Rešitev:**

1. Najprej skupni del: $90^\circ - 46^\circ 03' = 89^\circ 60' - 46^\circ 03' = 43^\circ 57'$. To je komplementarni kot kota $\varphi$.
2. Junij: $h_1 = 43^\circ 57' + 23^\circ 26' = 66^\circ 83' = 67^\circ 23'$, ker je $83' = 1^\circ 23'$.
3. December: odštej sam $h_2 = 43^\circ 57' - 23^\circ 26'$.
4. Razlika: izračunaj $h_1 - h_2$; pri minutah si boš moral izposoditi stopinjo.

:::premisli
Koliko meri $h_2$ in kolikšna je razlika $h_1 - h_2$?
---
$h_2 = 43^\circ 57' - 23^\circ 26' = 20^\circ 31'$. Razlika: $67^\circ 23' - 20^\circ 31' = 66^\circ 83' - 20^\circ 31' = 46^\circ 52'$. To je ravno $2 \cdot 23^\circ 26' = 46^\circ 52'$, dvakratni nagib osi.
:::

## Pogoste napake

- **Računanje, kot da ima stopinja 100 minut.** Učenec zapiše $62^\circ 73'$ kot končni rezultat ali pa misli, da je $0{,}5^\circ = 50'$. Razlog: navada iz desetiškega sistema. Pravilno: stopinja ima $60'$, zato je $0{,}5^\circ = 30'$ in $62^\circ 73' = 63^\circ 13'$.
- **Pozabljeno izposojanje pri odštevanju.** Pri $90^\circ - 34^\circ 25'$ učenec zapiše $56^\circ 25'$ ali $56^\circ 35'$. Razlog: pri $90^\circ$ ni minut, zato minute »izginejo«. Pravilno: $90^\circ = 89^\circ 60'$, torej $89^\circ 60' - 34^\circ 25' = 55^\circ 35'$.
- **Pri izposojanju dodaš 100 namesto 60.** Pri $50^\circ 10' - 20^\circ 40'$ učenec piše $49^\circ 110'$. Razlog: postopek pisnega odštevanja z desetiškimi enotami. Pravilno: $1^\circ = 60'$, zato $50^\circ 10' = 49^\circ 70'$ in rezultat je $29^\circ 30'$.
- **Pri deljenju zavržeš ostanek stopinj.** Pri $25^\circ 30' : 3$ učenec deli $25 : 3 = 8$ in $30' : 3 = 10'$ ter dobi $8^\circ 10'$. Razlog: ostanek $1^\circ$ je ostal neupoštevan. Pravilno: $25^\circ 30' = 24^\circ 90'$, zato $24^\circ 90' : 3 = 8^\circ 30'$.
- **Decimalni zapis prepišeš kot minute.** $15{,}4^\circ$ ni $15^\circ 4'$ niti $15^\circ 40'$. Razlog: decimalke so desetinke stopinje, ne minute. Pravilno: $0{,}4 \cdot 60' = 24'$, zato $15{,}4^\circ = 15^\circ 24'$.

## Povzetek

- $1^\circ = 60'$ (in $1' = 60''$); kot zapišemo kot $35^\circ 48'$.
- V pravilnem zapisu je minut od $0$ do $59$; $60'$ zamenjamo z $1^\circ$.
- Stopinje v minute: množimo s $60$; minute v stopinje: delimo s $60$ (ostanek so minute).
- Decimalni del stopinje pomnožimo s $60$: $15{,}4^\circ = 15^\circ 24'$.
- Seštevamo in odštevamo posebej stopinje in posebej minute; pri odštevanju po potrebi $1^\circ \to 60'$, npr. $180^\circ = 179^\circ 60'$.
- Pri množenju pomnožimo oba dela in uredimo; pri deljenju ostanek stopinj pretvorimo v minute.
- Sokot: $180^\circ - \alpha$, komplementarni kot: $90^\circ - \alpha$.

## Drugače: Iz vsakdanjega življenja

Najbolj podobna stvar kotom so **ure in minute**. Ena ura ima $60$ minut, tako kot ima ena stopinja $60'$. Če film traja $1$ uro $48$ minut, drugi pa $1$ uro $25$ minut, skupaj trajata $2$ uri $73$ minut, kar je $3$ ure $13$ minut. Natanko enako računamo s koti.

Tudi izposojanje poznaš: od $10{:}15$ do $11{:}40$ mine $1$ ura $25$ minut, od $10{:}40$ do $12{:}15$ pa moraš eno uro »razbiti« na $60$ minut in dobiš $1$ uro $35$ minut.

Kotne minute srečaš na zemljevidih. Zemljepisno lego krajev pišemo v stopinjah in minutah: Ljubljana leži približno na $46^\circ 03'$ severne zemljepisne širine in $14^\circ 30'$ vzhodne zemljepisne dolžine. Pomorščaki in piloti še danes računajo smer in lego v stopinjah in minutah.

## Drugače: Korak za korakom s številkami

Vsako nalogo lahko rešiš po istem receptu. Vzemimo $47^\circ 38' + 25^\circ 42'$ in $90^\circ - 34^\circ 25'$.

**Seštevanje:**

1. Podpiši stopinje pod stopinje, minute pod minute.
2. Stopinje: $47 + 25 = 72$.
3. Minute: $38 + 42 = 80$.
4. Vmesni rezultat: $72^\circ 80'$.
5. Ali je minut $60$ ali več? Da: $80' = 1^\circ 20'$.
6. Rezultat: $73^\circ 20'$.

**Odštevanje:**

1. Ali ima zmanjševanec dovolj minut? $90^\circ$ ima $0'$, odštevamo $25'$, torej ne.
2. Izposodi si eno stopinjo: $90^\circ = 89^\circ 60'$.
3. Stopinje: $89 - 34 = 55$.
4. Minute: $60 - 25 = 35$.
5. Rezultat: $55^\circ 35'$.
6. Preizkus: $55^\circ 35' + 34^\circ 25' = 89^\circ 60' = 90^\circ$. ✓

**Pretvorba decimalnega zapisa:** $28{,}75^\circ$: cele stopinje so $28$, decimalni del $0{,}75 \cdot 60 = 45$, torej $28^\circ 45'$.

## Drugače: Bolj natančno

Zakaj ravno $60$ in ne $100$? Delitev na $60$ delov izvira od starih Babiloncev, ki so računali v **šestdesetiškem številskem sistemu**. Število $60$ ima veliko deliteljev: $1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60$. Zato se stopinja brez ostanka razdeli na polovice, tretjine, četrtine, petine, šestine in še več delov, kar je zelo priročno.

Celotni sistem enot za kote je:

$$1^\circ = 60' = 3600'' \qquad 1' = 60''$$

Pri pretvarjanju minut v decimalni zapis bodi previden. $45' = 0{,}75^\circ$ je končno decimalno število, $20' = \dfrac{20}{60}{}^\circ = \dfrac{1}{3}{}^\circ = 0{,}333\ldots^\circ$ pa ni. Zato je zapis v stopinjah in minutah pogosto bolj natančen od zaokroženega decimalnega zapisa. Če računaš z žepnim računalom, ima to pogosto posebno tipko za vnos stopinj, minut in sekund.

Zanimivost: ena kotna minuta zemljepisne širine ustreza na zemeljskem površju razdalji približno $1{,}85\,\text{km}$. Iz tega je nastala **navtična milja** ($1852\,\text{m}$), ki jo uporabljajo v pomorstvu in letalstvu.

## Drugače: Kot zgodba

Mornarka Maja pluje ponoči po Jadranu brez satelitske navigacije. S sekstantom izmeri, kako visoko nad obzorjem je Severnica. Iz meritve in tabele popravkov izračuna, da je na zemljepisni širini $43^\circ 48'$.

Pristati želi v luki na širini $45^\circ 33'$, ki leži severno od nje. Koliko še? Maja odšteje $45^\circ 33' - 43^\circ 48'$. Minut je premalo ($33 < 48$), zato si izposodi stopinjo: $45^\circ 33' = 44^\circ 93'$. Razlika je $44^\circ 93' - 43^\circ 48' = 1^\circ 45'$.

Ena kotna minuta zemljepisne širine je približno ena navtična milja ($1852\,\text{m}$). Ker je $1^\circ 45' = 105'$, je pred njo še približno $105$ navtičnih milj, to je okoli $194\,\text{km}$. Njen mlajši brat je računal kot z decimalnimi števili: $45{,}33 - 43{,}48 = 1{,}85$. Dobil je »$1^\circ 85'$«, takega zapisa pa ni, saj je minut vedno manj kot $60$.

## Preveri se

? Koliko kotnih minut je $0{,}7^\circ$? Vpiši število minut.
= 42
~ 70 | To bi veljalo, če bi imela stopinja $100$ minut. Ima jih $60$: $0{,}7 \cdot 60' = 42'$.
~ 7 | Decimalke so desetinke stopinje, ne minute. $0{,}7^\circ$ je sedem desetin od $60'$.
> $1^\circ = 60'$, zato je $0{,}7^\circ = 0{,}7 \cdot 60' = 42'$.

? Na sliki je pravi kot, razdeljen na dva dela. Koliko meri kot, označen z vprašajem?
:::risba skica
opis: Pravi kot z vrhom O med vodoravnim in navpičnim krakom. Notranji poltrak ga razdeli na dva kota: spodnji kot α ob vodoravnem kraku meri 34°25', zgornji kot ob navpičnem kraku je označen z vprašajem.
območje: -0,8; -0,5 .. 5; 4,5
enota: 50
črta: 0; 0 -> 4,5; 0 | puščica
črta: 0; 0 -> 0; 4,2 | puščica
črta: 0; 0 -> 3,3; 2,26 | modra puščica
napis: 1,6; 0,5 | α = 34°25' | desno
napis: 0,5; 2 | ? | desno
točka: 0; 0 | O | levo
:::
- $56^\circ 25'$
~ Odštel si samo stopinje, minute pa prepisal. Pri $90^\circ$ ni minut, zato je $90^\circ = 89^\circ 60'$.
+ $55^\circ 35'$
- $56^\circ 35'$
~ Minute si odštel prav ($60' - 25' = 35'$), a pozabil, da si eno stopinjo izposodil: ostane $89^\circ$, ne $90^\circ$.
- $145^\circ 35'$
~ To je sokot, do $180^\circ$. Kota na sliki skupaj tvorita pravi kot, zato računaš do $90^\circ$.
> $90^\circ - 34^\circ 25' = 89^\circ 60' - 34^\circ 25' = 55^\circ 35'$.

? Razvrsti kote od najmanjšega do največjega.
1. $15^\circ 20'$
2. $15{,}4^\circ$
3. $925'$
4. $15^\circ 40'$
> $15{,}4^\circ = 15^\circ 24'$, ker je $0{,}4 \cdot 60' = 24'$. $925' = 15^\circ 25'$, ker je $925 : 60 = 15$, ostanek $25$. Kdor $15{,}4^\circ$ bere kot $15^\circ 40'$, ga postavi na napačno mesto.

? Trikratnik kota meri $106^\circ 6'$. Koliko meri kot?
- $35^\circ 2'$
~ Ostanek $1^\circ$ pri $106 : 3$ si zavrgel. Pretvori ga v $60'$: $(60' + 6') : 3 = 22'$.
+ $35^\circ 22'$
- $318^\circ 18'$
~ To je $3 \cdot 106^\circ 6'$. Iščemo kot, katerega trikratnik je $106^\circ 6'$, zato delimo s $3$.
> $106^\circ 6' = 105^\circ 66'$; $105 : 3 = 35$ in $66' : 3 = 22'$. Preizkus: $3 \cdot 35^\circ 22' = 105^\circ 66' = 106^\circ 6'$.

? Sonce je na nebu široko približno $32'$. Približno koliko Sončevih kolutov bi zložil v vrsto od obzorja do nadglavišča (točke naravnost nad glavo), to je čez $90^\circ$? Rezultat zaokroži na celo število.
= 169 | 2
~ 281 | Računal si, kot da ima stopinja $100'$. Pravilno: $90^\circ = 90 \cdot 60' = 5400'$.
~ 3 | Stopinj ne smeš deliti z minutami. Najprej pretvori $90^\circ$ v minute.
> $90^\circ = 5400'$ in $5400' : 32' = 168{,}75 \approx 169$.

<<RACUN
enako: 35+48/60+27+25/60 | 63+13/60
vrednost: 35*60+48+27*60+25 | 3793
enako: 180-(52+17/60) | 127+43/60
enako: 90-(52+17/60) | 37+43/60
enako: 3*(24+38/60) | 73+54/60
enako: 180-(73+54/60) | 106+6/60
enako: (106+6/60)/3 | 35+22/60
enako: 90-(46+3/60) | 43+57/60
enako: 43+57/60+23+26/60 | 67+23/60
enako: 43+57/60-(23+26/60) | 20+31/60
enako: 67+23/60-(20+31/60) | 46+52/60
enako: 180-(123+45/60) | 56+15/60
enako: 90-(34+25/60) | 55+35/60
enako: 15.4 | 15+24/60
enako: 925/60 | 15+25/60
vrednost: 90*60/32 | 168.75
enako: 45+33/60-(43+48/60) | 1+45/60
vrednost: 105*1.852 | 194.46
vrednost: 0.7*60 | 42
>>

:::simboli
\alpha | dani kot | | ° | $1^\circ = 60'$ (kotnih minut)
\beta | sokot kota $\alpha$ | \beta = 180^\circ - \alpha | ° | v primeru 3: $\beta = 3 \cdot \alpha$
\gamma | komplementarni kot kota $\alpha$ | \gamma = 90^\circ - \alpha | ° | v primeru 3 sokot kota $\beta$
\varphi | zemljepisna širina | | ° | Ljubljana: $46^\circ 03'$
\varepsilon | nagib zemeljske osi | | ° | približno $23^\circ 26'$
h_1 | višina opoldanskega Sonca 21. junija | h_1 = 90^\circ - \varphi + \varepsilon | °
h_2 | višina opoldanskega Sonca 21. decembra | h_2 = 90^\circ - \varphi - \varepsilon | °
:::
