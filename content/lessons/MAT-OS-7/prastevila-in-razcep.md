---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tjaša pomaga učiteljici športa pri športnem dnevu. Na igrišču je $84$ učencev. Razdeliti jih mora v enako velike ekipe, in nihče ne sme ostati brez ekipe. Ekipa naj ima od $5$ do $15$ igralcev. Katere velikosti so možne?

Tjaša bi lahko poskušala na slepo: po $5$? Po $8$? Po $10$? Hitreje gre, če ve, iz katerih »gradnikov« je število $84$ zloženo. Ti gradniki so **praštevila**. Ko število zapiše kot zmnožek praštevil, takoj vidi vse možne velikosti ekip.

Naslednje leto pride na športni dan $89$ učencev. Tokrat Tjaša ne najde nobene velikosti ekipe, razen ene same ekipe z vsemi ali »ekip« po enega učenca. Zakaj je število $89$ tako trmasto, boš razumel do konca lekcije.

Razcep na prafaktorje boš potreboval kmalu: pri največjem skupnem delitelju, pri najmanjšem skupnem večkratniku in pri krajšanju ulomkov.

## Razlaga

**Mamljiva zmota: »Liho število je praštevilo.«** Tjaša najprej pomisli: $84$ je sodo, torej se da deliti, $89$ pa je liho, torej se ne da. Ta misel je napačna. Število $9$ je liho, pa je $9 = 3 \cdot 3$. Tudi $15 = 3 \cdot 5$ in $21 = 3 \cdot 7$ sta lihi števili, ki se dasta deliti. Lihost pove le, da število ni deljivo z $2$.

**Kaj praštevilo zares je.** **Delitelj** števila je število, s katerim ga delimo brez ostanka. Naravno število, večje od $1$, je **praštevilo**, če ima natanko dva delitelja: $1$ in samo sebe. Prva praštevila so $2, 3, 5, 7, 11, 13, 17, 19, 23, 29$. Število $2$ je edino sodo praštevilo.

Število, večje od $1$, ki ni praštevilo, je **sestavljeno število**. Ima vsaj tri delitelje. Število $1$ ni ne praštevilo ne sestavljeno število, saj ima en sam delitelj.

:::premisli
Ali je $51$ praštevilo? Napovej, nato preveri z vsoto števk.
---
Ni. Vsota števk je $5 + 1 = 6$, kar je deljivo s $3$. Zato je tudi $51$ deljivo s $3$: $51 = 3 \cdot 17$.
:::

**Kako preverimo, ali je število praštevilo.** Poskusimo deliti s praštevili po vrsti: $2, 3, 5, 7, \dots$ Pomagajo pravila deljivosti: z $2$, če je zadnja števka soda; s $3$, če je vsota števk deljiva s $3$; s $5$, če je zadnja števka $0$ ali $5$. Za $7$ preprostega pravila ni, zato kar delimo.

Za $89$: ni sodo, vsota števk $17$ ni deljiva s $3$, ne konča se z $0$ ali $5$, pri deljenju s $7$ pa ostane ostanek $5$.

:::premisli
Pri $89$ smo poskusili $2$, $3$, $5$ in $7$. Zakaj ni treba poskusiti še $11$, $13$ in večjih praštevil?
---
Če bi bilo $89$ zmnožek dveh števil, ki sta obe vsaj $11$, bi bil zmnožek vsaj $11 \cdot 11 = 121$, kar je več kot $89$. Zato bi moral biti vsaj en faktor manjši od $11$, te pa smo že preizkusili. Torej je $89$ praštevilo.
:::

Pravilo za vsa števila: deliti poskušamo samo s praštevili $p$, pri katerih je $p \cdot p$ največ toliko kot število.

**Druga zmota: »Vsak zapis z množenjem je razcep.«** Zapis $84 = 4 \cdot 21$ je pravilen račun, ni pa še razcep na prafaktorje. Ne $4$ ne $21$ nista praštevili. **Razcep na prafaktorje** je zapis števila kot zmnožka samih praštevil. Ta praštevila imenujemo **prafaktorji**. Vsako sestavljeno število ima razcep.

**Postopek.** Število delimo z najmanjšim praštevilom, s katerim je deljivo. Z enakim praštevilom delimo, dokler gre, nato preidemo na naslednje. Ustavimo se pri $1$. Za $84$ je zapis takšen:

| Število | Delimo s | Rezultat |
|---|---|---|
| $84$ | $2$ | $42$ |
| $42$ | $2$ | $21$ |
| $21$ | $3$ | $7$ |
| $7$ | $7$ | $1$ |

Prafaktorji so v srednjem stolpcu: $84 = 2 \cdot 2 \cdot 3 \cdot 7$. Enake faktorje zapišemo krajše s **potenco**: $2 \cdot 2 = 2^2$, torej $84 = 2^2 \cdot 3 \cdot 7$. Mali zgornji indeks pove, kolikokrat se faktor ponovi.

**Razcep je en sam.** Miha začne drugače: $84 = 6 \cdot 14$, nato $6 = 2 \cdot 3$ in $14 = 2 \cdot 7$. Dobi iste prafaktorje $2, 2, 3, 7$, le v drugem vrstnem redu. Ne glede na začetek je razcep (do vrstnega reda) vedno enak.

V simulaciji spodaj »Razcep na prafaktorje« nastavi $360$ in večkrat pritisni »Razcepi drugače«. Opazuj: drevo je vsakič drugačno, obarvani krogi na koncu vej pa so vedno ista praštevila.

**Kaj Tjaši pove razcep.** Vsak delitelj števila $84$ je zmnožek nekaterih njegovih prafaktorjev. Iz $2, 2, 3, 7$ sestavi velikosti med $5$ in $15$: $2 \cdot 3 = 6$, $7$, $2 \cdot 2 \cdot 3 = 12$ in $2 \cdot 7 = 14$. Število $89$ pa je praštevilo, zato ima samo delitelja $1$ in $89$.

## Rešeni primeri

### Primer 1 (lažji): minute nogometne tekme

Nogometna tekma traja $90$ minut. Razcepi število $90$ na prafaktorje.

**Podatki:** število $90$
**Iščemo:** razcep števila $90$ na prafaktorje

:::formula
Deli z najmanjšim praštevilom, s katerim je število deljivo, dokler ne dobiš $1$. Prafaktorji so vsa števila, s katerimi si delil.
:::

**Rešitev:**

1. $90$ je sodo, zato delimo z $2$: $90 : 2 = 45$.
2. $45$ je liho; vsota števk $4 + 5 = 9$ je deljiva s $3$: $45 : 3 = 15$.
3. Tudi $15$ je deljivo s $3$, ker je $1 + 5 = 6$: $15 : 3 = 5$.
4. $5$ je praštevilo: $5 : 5 = 1$. Tu se ustavimo.
5. Preverimo z množenjem: $2 \cdot 3 \cdot 3 \cdot 5 = 90$.

Razcep je $90 = 2 \cdot 3^2 \cdot 5$.

### Primer 2: startna številka na teku

Tekačica Ema ima na mestnem teku startno številko $119$. Pravi, da je to praštevilo, ker se ne da deliti ne z $2$ ne s $3$ ne s $5$. Ali ima prav? Če nima, razcepi $119$ na prafaktorje.

**Podatki:** število $119$; ni deljivo z $2$, $3$ in $5$
**Iščemo:** ali je $119$ praštevilo; če ni, njegov razcep

:::formula
Deli s praštevili $p$ po vrsti, dokler je $p \cdot p$ največ toliko kot število. Če nobeno ne deli števila, je praštevilo.
:::

**Rešitev:**

1. Do katerega praštevila moramo preizkušati? $11 \cdot 11 = 121$, kar je več kot $119$. Dovolj je preizkusiti $2$, $3$, $5$ in $7$.
2. Z $2$, $3$ in $5$ število ni deljivo; vsota števk je $1 + 1 + 9 = 11$, zato res ne s $3$.
3. Ostane $7$, za katerega ni pravila, zato delimo: $119 : 7 = 17$. Deljenje gre brez ostanka.
4. $17$ je praštevilo, zato je razcep končan: $7 \cdot 17 = 119$.

Ema nima prav. Število $119$ je sestavljeno, njegov razcep je $119 = 7 \cdot 17$.

### Primer 3 (težji): žoge v mrežah

Trener ima $126$ teniških žog. Spraviti jih želi v mreže tako, da je v vsaki mreži enako število žog, in sicer od $10$ do $20$. Nobena žoga ne sme ostati. Koliko žog je lahko v eni mreži?

**Podatki:** $126$ žog; v vsaki mreži enako število žog, od $10$ do $20$; brez ostanka
**Iščemo:** možna števila žog v eni mreži

:::formula
Število žog v mreži mora biti delitelj števila $126$. Vsak delitelj je zmnožek nekaterih prafaktorjev števila.
:::

**Rešitev:**

1. Razcepimo $126$: $126 : 2 = 63$, $63 : 3 = 21$, $21 : 3 = 7$, $7 : 7 = 1$.
2. Torej je $126 = 2 \cdot 3^2 \cdot 7$, prafaktorji so $2, 3, 3, 7$.
3. Iz njih sestavimo zmnožke med $10$ in $20$: $2 \cdot 7 = 14$ in $2 \cdot 3 \cdot 3 = 18$. Drugi zmnožki so premajhni (na primer $3 \cdot 3 = 9$) ali preveliki ($3 \cdot 7 = 21$).
4. Preverimo: $126 : 14 = 9$ in $126 : 18 = 7$.

V eni mreži je lahko $14$ žog (potrebuje $9$ mrež) ali $18$ žog (potrebuje $7$ mrež).

### Primer 4: zdaj ti

Na šahovskem turnirju igra $168$ igralcev. Razcepi $168$ na prafaktorje.

**Podatki:** število $168$
**Iščemo:** razcep števila $168$ na prafaktorje

:::formula
Deli z najmanjšim možnim praštevilom, dokler ne dobiš $1$.
:::

**Rešitev:**

1. $168 : 2 = 84$, ker je $168$ sodo.
2. $84 : 2 = 42$ in $42 : 2 = 21$; obe števili sta sodi.
3. $21$ je liho. Nadaljuj sam: s katerim praštevilom deliš, kaj dobiš in kako se glasi razcep?

:::premisli
Kako se nadaljuje in kakšen je razcep števila $168$?
---
$21 : 3 = 7$ in $7 : 7 = 1$. Delili smo trikrat z $2$, enkrat s $3$ in enkrat s $7$, zato je $168 = 2^3 \cdot 3 \cdot 7$. Preizkus: $8 \cdot 3 \cdot 7 = 168$.
:::

## Pogoste napake

- **»Liho pomeni praštevilo.«** Učenec reče, da je $21$ praštevilo, ker ni sodo. Lihost izključi le delitelj $2$. Preizkusi še $3$, $5$, $7$: $21 = 3 \cdot 7$.
- **»Število $1$ je praštevilo.«** Zdi se, da se $1$ deli samo z $1$ in s samim seboj. A to je en in isti delitelj, praštevilo pa jih ima natanko dva. Zato $1$ ni praštevilo.
- **Prehitro ustavljanje.** Učenec preveri le $2$, $3$ in $5$ ter razglasi $91$ ali $119$ za praštevilo. Preizkušati moraš vsa praštevila $p$, pri katerih je $p \cdot p$ največ toliko kot število, torej tudi $7$: $91 = 7 \cdot 13$.
- **Nedokončan razcep.** Zapis $84 = 4 \cdot 21$ ni razcep na prafaktorje, ker $4$ in $21$ nista praštevili. Razstavljaj naprej, dokler niso vsi faktorji praštevila.
- **Napačno branje potence.** Učenec prebere $2^3$ kot $2 \cdot 3 = 6$. Potenca $2^3$ pomeni $2 \cdot 2 \cdot 2 = 8$. Vedno preveri razcep z množenjem.

## Povzetek

- Praštevilo je naravno število, večje od $1$, z natanko dvema deliteljema: $1$ in samim sabo. Prva so $2, 3, 5, 7, 11, 13$.
- $1$ ni praštevilo; $2$ je edino sodo praštevilo. Liho število ni nujno praštevilo.
- Ali je število praštevilo: deli s praštevili $p$, dokler je $p \cdot p$ največ toliko kot število.
- Razcep na prafaktorje: deli z najmanjšim možnim praštevilom, dokler ne dobiš $1$. Razcep je en sam (do vrstnega reda).
- Enake faktorje zapišemo s potenco: $84 = 2^2 \cdot 3 \cdot 7$. Rezultat preveri z množenjem.
- Vsak delitelj števila je zmnožek nekaterih njegovih prafaktorjev.

## Drugače: Kot zgodba

Jan in Lara igrata igro s kartami. Na vsaki karti je praštevilo: $2$, $3$, $5$, $7$ in tako naprej, vsakega je dovolj. Kdor želi »kupiti« število, mora položiti karte, katerih zmnožek je to število.

Lara želi kupiti $60$. Položi $2$ in $30$. »Karte $30$ ni,« reče Jan, »$30$ ni praštevilo.« Lara zamenja $30$ s kartami $2$, $3$ in $5$. Na mizi so zdaj $2, 2, 3, 5$, in res: $2 \cdot 2 \cdot 3 \cdot 5 = 60$.

Jan kupi isto število po svoje. Začne s $3$ in $20$, nato $20$ zamenja z $2$, $2$ in $5$. Ko primerjata karte, ugotovita, da imata obe roki iste štiri karte. Še tolikokrat poskusita, vedno dobita $2, 2, 3, 5$. Vsako število ima svojo eno samo »roko« kart.

Nato Lara predlaga še karto $1$. Jan se zasmeji: »Z njo bi lahko vsako roko podaljšala v nedogled, $1 \cdot 1 \cdot 2 \cdot 2 \cdot 3 \cdot 5$ je še vedno $60$.« Zato karte $1$ v igri ni, tako kot $1$ ni praštevilo.

Na koncu Lara poskuša kupiti $13$. Rabi samo eno karto, $13$. Drugače ne gre, ker je $13$ praštevilo.

## Drugače: Korak za korakom s številkami

Razcep števila $1\,260$, vrstica za vrstico. V zadnjem stolpcu je, zakaj smo izbrali ta delitelj.

| Število | Delimo s | Rezultat | Zakaj |
|---|---|---|---|
| $1\,260$ | $2$ | $630$ | sodo |
| $630$ | $2$ | $315$ | sodo |
| $315$ | $3$ | $105$ | $3 + 1 + 5 = 9$ |
| $105$ | $3$ | $35$ | $1 + 0 + 5 = 6$ |
| $35$ | $5$ | $7$ | konča se s $5$ |
| $7$ | $7$ | $1$ | praštevilo |

1. Preberi srednji stolpec: $2, 2, 3, 3, 5, 7$.
2. Enake faktorje združi s potenco: $1\,260 = 2^2 \cdot 3^2 \cdot 5 \cdot 7$.
3. Preizkus z množenjem: $4 \cdot 9 = 36$, $36 \cdot 5 = 180$, $180 \cdot 7 = 1\,260$.

Vrstni red pravil je vedno isti: najprej $2$, dokler gre, nato $3$, nato $5$, nato $7$, $11$ in tako naprej.

## Preveri se

? Katero od števil $2$, $17$, $23$, $27$ ni praštevilo?
- $2$
~ $2$ je sodo, a ima samo delitelja $1$ in $2$. Je edino sodo praštevilo.
- $23$
~ $23$ ni deljivo z $2$, $3$ ali $5$, in $5 \cdot 5 = 25$ je že več kot $23$. Zato je praštevilo.
+ $27$
- $17$
~ $17$ ima samo delitelja $1$ in $17$, zato je praštevilo.
> $27 = 3 \cdot 3 \cdot 3$ je sestavljeno število. Ostala tri so praštevila. Pozor: $27$ je liho, pa vseeno ni praštevilo.

? Kateri zapis je razcep števila $150$ na prafaktorje?
- $2 \cdot 75$
~ $75$ ni praštevilo ($75 = 3 \cdot 5 \cdot 5$), zato razcep še ni končan.
- $2 \cdot 3 \cdot 25$
~ $25 = 5 \cdot 5$ ni praštevilo. Razcep mora vsebovati same prafaktorje.
+ $2 \cdot 3 \cdot 5^2$
- $2 \cdot 3^2 \cdot 5$
~ Ta zapis da $2 \cdot 9 \cdot 5 = 90$. Potenco si dal napačnemu faktorju; preveri z množenjem.
> $150 : 2 = 75$, $75 : 3 = 25$, $25 : 5 = 5$, $5 : 5 = 1$. Torej $150 = 2 \cdot 3 \cdot 5^2$.

? Prafaktorji nekega števila so $2$, $3$, $3$ in $5$. Kaj zato zagotovo drži?
- Število je liho, ker so trije od štirih prafaktorjev lihi.
~ Že en faktor $2$ naredi zmnožek sod. Število je sodo.
- Število je deljivo s $4$.
~ Za deljivost s $4 = 2 \cdot 2$ bi potreboval dva faktorja $2$, v razcepu pa je samo eden.
+ Število je deljivo z $18$.
- Število je deljivo s $7$.
~ Če $7$ ni med prafaktorji, število ni deljivo s $7$. Razcep je en sam, drugih prafaktorjev ni.
> $18 = 2 \cdot 3 \cdot 3$, vsi ti faktorji so v razcepu. Število je $90$, in $90 : 18 = 5$.

? Žan preverja, ali je $91$ praštevilo. (1) $91$ ni sodo, zato ni deljivo z $2$. (2) $9 + 1 = 10$, zato ni deljivo s $3$. (3) Ne konča se z $0$ ali $5$, zato ni deljivo s $5$. (4) Torej je $91$ praštevilo. Kateri korak je napačen?
- Korak (1)
~ Liho število res ni deljivo z $2$; ta korak drži.
- Korak (2)
~ Vsota števk $10$ ni deljiva s $3$, zato $91$ res ni deljivo s $3$.
- Korak (3)
~ Pravilo za $5$ je uporabljeno prav.
+ Korak (4)
> Ker je $7 \cdot 7 = 49$ manj kot $91$, mora Žan preizkusiti še $7$. In res: $91 = 7 \cdot 13$, zato $91$ ni praštevilo.

? Na turnirju v odbojki je $72$ igralcev. Organizatorka želi enako velike ekipe s $6$ do $10$ igralci, brez ostanka. Katere velikosti ekip so možne? ($72 = 2^3 \cdot 3^2$)
- Samo $6$ in $9$
~ Pozabil si na $2 \cdot 2 \cdot 2 = 8$. Potenca $2^3$ pomeni tri faktorje $2$.
+ $6$, $8$ in $9$
- $6$, $7$, $8$, $9$ in $10$
~ $7$ in $10 = 2 \cdot 5$ nista zmnožka prafaktorjev števila $72$, zato pri deljenju ostane ostanek.
- Nobena, ker je $72$ sodo.
~ Sodost ne preprečuje deljenja, ravno nasprotno: $72$ ima veliko deliteljev.
> Iz $2, 2, 2, 3, 3$ dobimo $6 = 2 \cdot 3$, $8 = 2 \cdot 2 \cdot 2$ in $9 = 3 \cdot 3$. Res: $72 : 6 = 12$, $72 : 8 = 9$, $72 : 9 = 8$.

:::simboli
p | praštevilo | | | delimo, dokler je p · p največ toliko kot število
:::
