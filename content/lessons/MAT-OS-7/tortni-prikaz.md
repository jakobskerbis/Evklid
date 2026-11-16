---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na tehniškem dnevu je razred izdelal $24$ ptičjih hišic: $12$ iz smreke, $6$ iz bukve, $4$ iz topola in $2$ iz hrasta. Neža bi rada za razstavo narisala tortni prikaz, iz katerega bi bilo takoj vidno, iz katerega lesa je bilo izdelanih največ hišic.

Sošolec Matic ji svetuje: »Smreka je polovica vseh hišic, to je $50\,\%$. Torej nariši izsek s kotom $50^\circ$.«

Neža posluša. Za bukev nariše $25^\circ$, za topol in hrast še manj. Ko konča, izseki pokrijejo manj kot tretjino kroga, ostalo je prazno. Kje je Matic zgrešil?

Tortni prikaz srečaš v časopisu, v poročilu o porabi denarja pri gradnji, na računu za elektriko. Ko ga znaš brati, hitro vidiš, kolikšen del celote pripada vsaki skupini. Ko ga znaš narisati, lahko svoje podatke pokažeš drugim.

## Razlaga

**Cel krog je cela skupina.** Tortni prikaz je krog, razdeljen na **izseke**. Izsek je del kroga med dvema polmeroma, kot kos torte. Vsak izsek predstavlja eno skupino podatkov. Cel krog predstavlja vse podatke skupaj.

Velikost izseka določa njegov **središčni kot**: kot med polmeroma, ki izsek omejujeta, z vrhom v središču kroga. Ves krog okoli središča meri $360^\circ$.

**Nekaj primerov.** Poglej, kako velik je izsek, ki pripada znanemu delu celote:

| del celote | v odstotkih | središčni kot |
|---|---|---|
| $\frac{1}{2}$ | $50\,\%$ | $180^\circ$ |
| $\frac{1}{4}$ | $25\,\%$ | $90^\circ$ |
| $\frac{1}{8}$ | $12{,}5\,\%$ | $45^\circ$ |
| $\frac{1}{10}$ | $10\,\%$ | $36^\circ$ |

Polovica kroga je iztegnjeni kot, četrtina je pravi kot. Za osmino razpoloviš pravi kot.

:::premisli
Kolikšen je središčni kot izseka za tretjino podatkov? Napovej iz tabele, preden pogledaš.
---
$120^\circ$. Ves krog razdeliš na tri enake dele: $360^\circ : 3 = 120^\circ$. V vsaki vrstici tabele je kot enak delu celote, pomnoženemu s $360^\circ$.
:::

**Pravilo.** V vseh vrsticah velja isto: kot dobiš, če del celote pomnožiš s $360^\circ$. Del celote je ulomek: število podatkov v skupini, deljeno s številom vseh podatkov.

$$\text{kot} = \frac{\text{število v skupini}}{\text{število vseh}} \cdot 360^\circ$$

Ker je ves krog $100\,\%$ in hkrati $360^\circ$, je $1\,\%$ enak $360^\circ : 100 = 3{,}6^\circ$. Za odstotke torej velja: $\text{kot} = \text{odstotek} \cdot 3{,}6^\circ$.

Zdaj vidiš, kje je zgrešil Matic. Smreka ima $50\,\%$, njen izsek pa meri $50 \cdot 3{,}6^\circ = 180^\circ$, ne $50^\circ$. Odstotek in stopinja nista ista enota.

**Branje prikaza** je isti račun v obratni smeri. Iz kota dobiš del celote, iz dela celote pa število:

$$\text{število v skupini} = \frac{\text{kot}}{360^\circ} \cdot \text{število vseh}$$

**Risanje po korakih.** Najprej izračunaj kote za vse skupine in preveri, da je njihova vsota $360^\circ$. S šestilom nariši krog in vanj en polmer, na primer navpično navzgor. Ob tem polmeru s kotomerom odmeri prvi kot in nariši drugi polmer. Naslednji kot odmeriš od **novega** polmera, ne od začetnega. Tako nadaljuješ okoli kroga. Vsak izsek označi z imenom skupine in s številom ali odstotkom, ne samo z barvo.

V simulaciji spodaj (Tortni prikaz) izberi »Tortni«. Nato z gumbom $+$ povečaj število glasov za hruško z $2$ na $8$. Opazuj izsek za jabolko: njegovih glasov je še vedno $7$, kot pa se zmanjša s $105^\circ$ na $84^\circ$.

:::premisli
Zakaj se je izsek za jabolko zmanjšal, čeprav ima jabolko še vedno $7$ glasov?
---
Ker se je povečalo število vseh glasov, s $24$ na $30$. Jabolko ima zdaj manjši del celote: $\frac{7}{30}$ namesto $\frac{7}{24}$. Tortni prikaz kaže delež, ne števila samega.
:::

## Rešeni primeri

### Primer 1: risanje iz števil

Nariši tortni prikaz za Nežine ptičje hišice: $12$ iz smreke, $6$ iz bukve, $4$ iz topola in $2$ iz hrasta.

**Podatki:** smreka $12$, bukev $6$, topol $4$, hrast $2$ hišic
**Iščemo:** središčne kote izsekov in prikaz

:::formula
$\text{kot} = \dfrac{\text{število v skupini}}{\text{število vseh}} \cdot 360^\circ$
:::

**Rešitev:**

1. Vseh hišic je $12 + 6 + 4 + 2 = 24$. To je celota, ki ji pripada ves krog.
2. Smreka: $\dfrac{12}{24} \cdot 360^\circ = 180^\circ$, ker je to polovica.
3. Bukev: $\dfrac{6}{24} \cdot 360^\circ = 90^\circ$, ker je to četrtina.
4. Topol: $\dfrac{4}{24} \cdot 360^\circ = 60^\circ$.
5. Hrast: $\dfrac{2}{24} \cdot 360^\circ = 30^\circ$.
6. Preizkus: $180^\circ + 90^\circ + 60^\circ + 30^\circ = 360^\circ$, ves krog je razdeljen.
7. Nariši krog in polmer navzgor. Od njega odmeri $180^\circ$ (smreka), od novega polmera $90^\circ$ (bukev), nato $60^\circ$ (topol). Ostanek je hrast in mora meriti $30^\circ$.
8. Odgovor: izseki merijo $180^\circ$, $90^\circ$, $60^\circ$ in $30^\circ$; vsakega označi z imenom lesa in številom hišic.

### Primer 2: risanje iz odstotkov

Družina gradi garažo. Za material porabi $45\,\%$ denarja, za delo $35\,\%$, za dovoljenja in načrte pa $20\,\%$. Kolikšni so koti izsekov?

**Podatki:** material $45\,\%$, delo $35\,\%$, dovoljenja $20\,\%$
**Iščemo:** središčne kote treh izsekov

:::formula
$\text{kot} = \text{odstotek} \cdot 3{,}6^\circ$ (ker je $100\,\% = 360^\circ$)
:::

**Rešitev:**

1. Preverimo, da so zajeti vsi stroški: $45 + 35 + 20 = 100$, torej $100\,\%$.
2. Material: $45 \cdot 3{,}6^\circ = 162^\circ$.
3. Delo: $35 \cdot 3{,}6^\circ = 126^\circ$.
4. Dovoljenja: $20 \cdot 3{,}6^\circ = 72^\circ$.
5. Preizkus: $162^\circ + 126^\circ + 72^\circ = 360^\circ$.
6. Odgovor: izseki merijo $162^\circ$, $126^\circ$ in $72^\circ$. Material ima največji izsek, a manj kot pol kroga.

### Primer 3: iz enega izseka do celote

Mizar je izdelal leseno omaro. Na tortnem prikazu stroškov meri izsek za okovje (tečaje in ročaje) $48^\circ$. Za okovje je plačal $64\,€$. Koliko je stala celotna izdelava? Koliko je stal les, če njegov izsek meri $225^\circ$?

**Podatki:** okovje $48^\circ$ in $64\,€$, les $225^\circ$
**Iščemo:** celotni strošek in strošek lesa

:::formula
$\text{celota} = \text{znesek} \cdot \dfrac{360^\circ}{\text{kot}}$, nato $\text{znesek} = \dfrac{\text{kot}}{360^\circ} \cdot \text{celota}$
:::

**Rešitev:**

1. Ves krog je $\dfrac{360^\circ}{48^\circ} = 7{,}5$-krat večji od izseka za okovje, zato je tudi celota $7{,}5$-krat večja.
2. Celota: $64 \cdot 7{,}5 = 480$, torej $480\,€$.
3. Les zaseda $\dfrac{225^\circ}{360^\circ}$ kroga.
4. Les: $\dfrac{225}{360} \cdot 480 = 300$, torej $300\,€$.
5. Preizkus: $\dfrac{48}{360} \cdot 480 = 64$, kar se ujema s podatkom.
6. Odgovor: izdelava je stala $480\,€$, od tega les $300\,€$.

### Primer 4: zdaj ti

Pleskar je pri obnovi hiše porabil $20$ litrov barve. Na tortnem prikazu porabe merijo izseki: stene $216^\circ$, strop $108^\circ$, vrata $36^\circ$. Koliko litrov je šlo za stene in kolikšen odstotek barve za strop?

**Podatki:** skupaj $20\,\ell$; stene $216^\circ$, strop $108^\circ$, vrata $36^\circ$
**Iščemo:** litre za stene, odstotek za strop

:::formula
$\text{količina} = \dfrac{\text{kot}}{360^\circ} \cdot \text{celota}$, $\text{odstotek} = \dfrac{\text{kot}}{3{,}6^\circ}$
:::

**Rešitev:**

1. Preizkus kotov: $216^\circ + 108^\circ + 36^\circ = 360^\circ$, prikaz je popoln.
2. Vrata za primerjavo: $\dfrac{36}{360} \cdot 20 = 2$, torej $2\,\ell$.
3. Izračunaj še stene in strop, nato preveri:

:::premisli
Koliko litrov za stene in kolikšen odstotek za strop?
---
Stene: $\dfrac{216}{360} \cdot 20 = 12$, torej $12\,\ell$. Strop: $108 : 3{,}6 = 30$, torej $30\,\%$ (to je $6\,\ell$). Preizkus: $12 + 6 + 2 = 20$ litrov.
:::

## Pogoste napake

- **Odstotek kar v stopinje.** »$25\,\%$ je $25^\circ$.« Tako je razmišljal Matic. Ves krog ima $360^\circ$, ne $100^\circ$, zato bi vsi izseki skupaj pokrili komaj dobro četrtino kroga. Pravilno: $25 \cdot 3{,}6^\circ = 90^\circ$.
- **Število kar v stopinje.** »$12$ hišic, torej $12^\circ$.« Kot ni število podatkov, ampak njihov del celote, pomnožen s $360^\circ$. Pravilno: $\dfrac{12}{24} \cdot 360^\circ = 180^\circ$.
- **Vsak kot od začetnega polmera.** Če vse kote meriš od istega polmera, se izseki prekrivajo in zadnji del kroga ostane prazen. Vsak naslednji kot meri od polmera, ki si ga pravkar narisal.
- **Vsota ni $360^\circ$.** Pozabljena skupina ali napačen račun se pokaže, ko kote sešteješ. Pri zaokroževanju je dovoljeno odstopanje za stopinjo ali dve: pri $1$, $3$ in $3$ od $7$ desk dobiš $51^\circ$, $154^\circ$ in $154^\circ$, skupaj $359^\circ$. Takrat enega od največjih izsekov popravi za $1^\circ$.
- **Enak izsek, enako število.** Dva tortna prikaza z enako velikim izsekom ne pomenita enakega števila, če sta celoti različni. Četrtina od $24$ je $6$, četrtina od $32$ je $8$.

## Povzetek

- Tortni prikaz je krog, razdeljen na izseke; cel krog ($360^\circ$) so vsi podatki.
- Risanje: $\text{kot} = \dfrac{\text{število v skupini}}{\text{število vseh}} \cdot 360^\circ$; iz odstotkov $\text{kot} = \text{odstotek} \cdot 3{,}6^\circ$.
- Branje: $\text{število} = \dfrac{\text{kot}}{360^\circ} \cdot \text{celota}$; iz enega znanega izseka dobiš celoto.
- Koti skupaj dajo $360^\circ$ (pri zaokroževanju približno).
- Pri risanju vsak kot odmeri od prejšnjega polmera; izseke označi z imenom in številom, ne samo z barvo.
- Prikaz kaže deleže; prikaza z različnima celotama ne primerjaš po velikosti izsekov.

## Drugače: Korak za korakom s številkami

Na sejmu domače obrti je rezbar prodal $50$ izdelkov: $20$ skled, $15$ žlic, $10$ deščic in $5$ skrinjic.

1. **Seštej vse.** $20 + 15 + 10 + 5 = 50$.
2. **Za vsako skupino zapiši del celote.** Sklede $\frac{20}{50}$, žlice $\frac{15}{50}$, deščice $\frac{10}{50}$, skrinjice $\frac{5}{50}$.
3. **Pomnoži s $360^\circ$.**

| izdelek | število | delež | kot |
|---|---|---|---|
| sklede | $20$ | $40\,\%$ | $144^\circ$ |
| žlice | $15$ | $30\,\%$ | $108^\circ$ |
| deščice | $10$ | $20\,\%$ | $72^\circ$ |
| skrinjice | $5$ | $10\,\%$ | $36^\circ$ |

4. **Preveri vsoto.** $144^\circ + 108^\circ + 72^\circ + 36^\circ = 360^\circ$.
5. **Nariši.** Krog, polmer navzgor, nato zapored $144^\circ$, $108^\circ$, $72^\circ$, vsakič od novega polmera. Zadnji izsek ($36^\circ$) ostane sam.
6. **Označi.** V vsak izsek napiši ime izdelka in število ali odstotek.

## Drugače: Kot zgodba

Mizar Ivo izdeluje okroglo mizo z vzorcem iz treh vrst lesa. V delavnici ima $12$ enakih deščic: $6$ orehovih, $4$ javorjeve in $2$ češnjevi. Vse hoče uporabiti, mizna plošča pa mora biti cela, brez lukenj.

Ivo razmišlja: »Če je vsaka deščica enak kos plošče, razrežem krog na $12$ enakih klinov. Ves krog je $360^\circ$, en klin torej $360^\circ : 12 = 30^\circ$.«

Nato zloži kline po vrsti lesa. Orehovi zavzamejo $6 \cdot 30^\circ = 180^\circ$, polovico mize. Javorjevi $4 \cdot 30^\circ = 120^\circ$, tretjino. Češnjeva dva klina skupaj $60^\circ$, šestino.

Ko gostje pogledajo mizo, takoj vidijo, katerega lesa je največ. To je tortni prikaz iz lesa: vsak podatek dobi enako velik kos, kosi iste vrste pa ležijo skupaj.

## Preveri se

? Katera trditev o tortnem prikazu drži?
- Izsek za $10\,\%$ podatkov ima središčni kot $10^\circ$.
~ Odstotek ni stopinja. Ves krog je $360^\circ$, zato je $10\,\%$ enako $36^\circ$.
+ Središčni koti vseh izsekov skupaj merijo $360^\circ$.
- Središčni kot izseka je enak številu podatkov v skupini.
~ Kot je odvisen od dela celote, ne od števila samega. $5$ od $10$ je pol kroga, $5$ od $100$ pa majhen izsek.
- Večji ko je krog, več podatkov prikazuje.
~ Polmer izbereš sam, da je prikaz pregleden. Podatke nosijo koti, ne velikost kroga.
> Ves krog predstavlja vse podatke, okoli središča pa je $360^\circ$. Zato koti vseh izsekov skupaj dajo $360^\circ$.

? V šolski delavnici je $40$ orodij, od tega $14$ izvijačev. Kolikšen je središčni kot izseka za izvijače?
- $14^\circ$
~ To je število orodij, ne kot. Najprej izračunaj del celote: $\frac{14}{40}$.
- $35^\circ$
~ To je odstotek ($35\,\%$), zapisan kot stopinje. Odstotek pomnoži s $3{,}6^\circ$.
+ $126^\circ$
- $50{,}4^\circ$
~ Tu si število $14$ obravnaval kot odstotek ($14 \cdot 3{,}6$). Izvijači so $35\,\%$ orodij, ne $14\,\%$.
> $\dfrac{14}{40} \cdot 360^\circ = 126^\circ$ ali, ker je to $35\,\%$ orodij, $35 \cdot 3{,}6^\circ = 126^\circ$.

? Maja riše prikaz $36$ desk, od katerih je $9$ borovih. Zapiše: »Del celote je $\frac{9}{36}$. Kot je $\frac{9}{36} \cdot 100 = 25^\circ$.« Kje je napaka?
- Ulomek bi moral biti $\frac{36}{9}$.
~ Del celote je skupina, deljena s celoto: $\frac{9}{36}$ je pravilen.
+ Del celote bi morala pomnožiti s $360^\circ$, ne s $100$.
- Napake ni, $25^\circ$ je pravilno.
~ $25$ je odstotek borovih desk. Kot zanje je $25 \cdot 3{,}6^\circ = 90^\circ$.
> $\frac{9}{36}$ je četrtina. Četrtina kroga je $\frac{1}{4} \cdot 360^\circ = 90^\circ$, pravi kot.

? Tortna prikaza za 7.a ($24$ učencev) in 7.b ($32$ učencev) imata izsek »rezbarjenje« s kotom $90^\circ$. Kaj velja?
- V obeh razredih je rezbarjenje izbralo enako učencev.
~ Enak kot pomeni enak delež, ne enakega števila. Celoti sta različni.
- V 7.a je rezbarjenje izbralo več učencev.
~ V obeh je to četrtina razreda. Četrtina manjšega razreda je manj učencev, ne več.
+ V 7.b sta rezbarjenje izbrala $2$ učenca več kot v 7.a.
> $90^\circ$ je četrtina kroga. Četrtina od $24$ je $6$, četrtina od $32$ je $8$, razlika je $2$.

? Gradbinec je za prenovo porabil $2400\,€$. Na tortnem prikazu meri izsek za cement $60^\circ$. Koliko je stal cement?
- $40\,€$
~ To je $2400 : 60$. Kot ni število delov, na katere razdeliš denar; delež je $\frac{60}{360}$.
- $1440\,€$
~ Tako dobiš, če $60^\circ$ bereš kot $60\,\%$. Stopinje najprej deli s $360$.
+ $400\,€$
> $\dfrac{60^\circ}{360^\circ} = \dfrac{1}{6}$, zato je cement stal $\dfrac{1}{6} \cdot 2400\,€ = 400\,€$.

:::simboli
\text{kot} | središčni kot izseka | \text{kot} = \dfrac{\text{število v skupini}}{\text{število vseh}} \cdot 360^\circ | ^\circ | cel krog je $360^\circ$
\text{število v skupini} | koliko podatkov je v eni skupini | \text{število v skupini} = \dfrac{\text{kot}}{360^\circ} \cdot \text{število vseh} |
\text{število vseh} | število vseh podatkov (celota) | | | vsota vseh skupin
\text{odstotek} | delež skupine v odstotkih | \text{odstotek} = \dfrac{\text{kot}}{3{,}6^\circ} | \% | $1\,\%$ celote je $3{,}6^\circ$
\text{celota} | celoten znesek ali količina, ki jo prikazuje krog | \text{celota} = \text{znesek} \cdot \dfrac{360^\circ}{\text{kot}} | | ustreza $360^\circ$
\text{znesek}, \text{količina} | del celote, ki ga prikazuje en izsek | \text{znesek} = \dfrac{\text{kot}}{360^\circ} \cdot \text{celota} |
:::
