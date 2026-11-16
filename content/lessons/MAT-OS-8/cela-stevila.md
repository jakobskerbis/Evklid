---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec Žan je bil s stricem na gradbišču stanovanjske hiše. Na načrtu je videl oznake višin: tla pritličja $0\,\text{m}$, klet $-3\,\text{m}$, garaža $-6\,\text{m}$, streha $9\,\text{m}$. V šoli trdi: »Garaža je višje od kleti, saj je $6$ več kot $3$.«

Ima Žan prav? Gradbinci, zidarji in mizarji morajo števila pod ničlo brati brez napake, sicer bi stopnice iz kleti vodile v napačno smer. Do konca lekcije boš Žanovo trditev presodil sam.

## Razlaga

Snov sestavljamo po kosih. Za vsakim kosom je kratek preizkus, odgovor je v oklepaju.

**1. Cela števila.** Na gradbišču merijo višino od tal pritličja. Kar je nad njimi, ima pozitivno oznako, kar je pod njimi, negativno. Tla pritličja imajo oznako $0$.

Naravna števila $1, 2, 3, \dots$, število $0$ in negativna števila $-1, -2, -3, \dots$ skupaj sestavljajo **cela števila**:

$$\mathbb{Z} = \{\dots, -2, -1, 0, 1, 2, \dots\}$$

Števila, večja od $0$, so **pozitivna**, manjša od $0$ pa **negativna**. Število $0$ ni ne pozitivno ne negativno.

*Preizkus:* Je $-3$ celo število? *(Da, negativno celo število.)*

**2. Številska premica.** Na premici izberemo točko za $0$ in dolžino enega koraka, **enoto**. Pozitivna števila nanašamo desno od $0$, negativna levo. Korak med sosednjima številoma je povsod enak.

:::risba premica
opis: Številska premica s celimi števili od −6 do 3. Črtice so enako narazen; negativna števila so levo od 0, pozitivna desno.
od: -6
do: 3
:::

Gradbeni načrt je ista premica, le postavljena pokonci: desno pomeni gor, levo pomeni dol. Od dveh števil je **večje tisto, ki leži bolj desno**. Zato je $-2 > -5$.

*Preizkus:* Katero število je večje, $-1$ ali $-4$? *($-1$, ker leži bolj desno.)*

:::premisli
Garaža je na $-6\,\text{m}$, klet na $-3\,\text{m}$. Kaj leži višje? Napovej, nato poišči obe števili na premici zgoraj.
---
Klet. Število $-3$ leži desno od $-6$, torej $-3 > -6$. Žan se moti: garaža je $3\,\text{m}$ pod kletjo.
:::

**3. Nasprotna števila.** Prvo nadstropje je $3\,\text{m}$ nad pritličjem, klet $3\,\text{m}$ pod njim. Števili $3$ in $-3$ sta **nasprotni števili**: ležita na enaki razdalji od $0$, a na nasprotnih straneh. Nasprotno število števila $a$ zapišemo $-a$.

- Nasprotno število od $7$ je $-7$.
- Nasprotno število od $-4$ je $4$, saj je $-(-4) = 4$.
- Nasprotno število od $0$ je $0$.

Število in njegovo nasprotno število imata vsoto $0$: $a + (-a) = 0$.

*Preizkus:* Katero število je nasprotno številu $-9$? *($9$.)*

**4. Absolutna vrednost.** Delavec nese vedro iz kleti na $-3\,\text{m}$ do pritličja in ga dvigne za $3\,\text{m}$. Iz prvega nadstropja na $3\,\text{m}$ ga do pritličja spusti prav tako za $3\,\text{m}$. Razdalja od ničle je obakrat $3$.

**Absolutna vrednost** števila $a$, zapisana $|a|$, je razdalja števila $a$ od $0$ na številski premici. Razdalja ni nikoli negativna, zato je $|a| \ge 0$.

Primeri: $|5| = 5$, $|-5| = 5$, $|0| = 0$. Nasprotni števili imata enako absolutno vrednost: $|a| = |-a|$.

*Preizkus:* Koliko je $|-6|$? *($6$.)*

V simulaciji spodaj (»Cela števila na številski premici«) vklopi »pokaži nasprotno število in absolutno vrednost«. Drsnik »prvo število« premakni s $4$ na $-4$. Opazuj: točka preskoči na drugo stran ničle, absolutna vrednost pa ostane $4$.

**5. Primerjanje.** Tri pravila povzemajo vse, kar smo videli na premici:

| Števili | Večje je | Primer |
|---|---|---|
| različnih predznakov | pozitivno | $2 > -8$ |
| obe pozitivni | tisto z večjo $\lvert a \rvert$ | $7 > 3$ |
| obe negativni | tisto z **manjšo** $\lvert a \rvert$ | $-3 > -7$ |

:::premisli
Zakaj je od dveh negativnih števil večje tisto z manjšo absolutno vrednostjo?
---
Manjša absolutna vrednost pomeni, da je število bliže ničli. Negativno število, ki je bliže ničli, leži bolj desno, torej je večje. Klet na $-3\,\text{m}$ je zato višje kot garaža na $-6\,\text{m}$.
:::

*Preizkus:* Je $0 > -100$? *(Da, vsako negativno število je manjše od $0$.)*

## Rešeni primeri

### Primer 1 (lažji): razvrščanje

Razvrsti števila $3$, $-6$, $0$, $-1$, $5$ od najmanjšega do največjega.

**Podatki:** števila $3$, $-6$, $0$, $-1$, $5$
**Iščemo:** vrstni red od najmanjšega do največjega

:::formula
Manjše število leži bolj levo. Pri negativnih številih: večja $|a|$ pomeni manjše število.
:::

**Rešitev:**

1. Negativni števili $-6$ in $-1$ sta manjši od $0$ in od pozitivnih, zato prideta na začetek.
2. Ker je $|-6| = 6$ več kot $|-1| = 1$, leži $-6$ bolj levo: $-6 < -1$.
3. Pozitivni števili: $3 < 5$.
4. Združimo: $-6 < -1 < 0 < 3 < 5$.
5. Odgovor: vrstni red je $-6$, $-1$, $0$, $3$, $5$.

### Primer 2: nasprotno število in absolutna vrednost

Določi nasprotno število in absolutno vrednost za števili $-9$ in $12$.

**Podatki:** števili $-9$ in $12$
**Iščemo:** nasprotni števili in absolutni vrednosti

:::formula
Nasprotno število od $a$ je $-a$. Absolutna vrednost $|a|$ je razdalja od $0$.
:::

**Rešitev:**

1. Za $-9$: nasprotno število je $-(-9) = 9$, ker se prestavimo na drugo stran ničle. Razdalja od ničle je $|-9| = 9$.
2. Za $12$: nasprotno število je $-12$, absolutna vrednost pa $|12| = 12$.
3. Preverimo: $|-9| = |9|$ in $|12| = |-12|$. Nasprotni števili imata res enako absolutno vrednost.
4. Odgovor: $-9$ ima nasprotno število $9$ in absolutno vrednost $9$; $12$ ima nasprotno število $-12$ in absolutno vrednost $12$.

### Primer 3 (težji): dvigalo na gradbišču

Gradbeno dvigalo vozi material od garaže na višini $-6\,\text{m}$ do strehe na višini $9\,\text{m}$. Koliko metrov prevozi v eno smer?

**Podatki:** garaža $-6\,\text{m}$, streha $9\,\text{m}$, tla pritličja $0\,\text{m}$
**Iščemo:** razdaljo med višinama v metrih

:::formula
Števili na nasprotnih straneh ničle: razdalja $= |a| + |b|$
:::

**Rešitev:**

1. Garaža je pod ničlo, streha nad njo, zato dvigalo pelje mimo pritličja. Pot razdelimo na dva dela.
2. Od garaže do pritličja: $|-6| = 6$, torej $6\,\text{m}$.
3. Od pritličja do strehe: $|9| = 9$, torej $9\,\text{m}$.
4. Delni poti seštej sam, nato preveri:

:::premisli
Koliko metrov prevozi dvigalo od garaže do strehe?
---
$6 + 9 = 15$, torej $15\,\text{m}$. Preveriš lahko s štetjem korakov po $1\,\text{m}$ na premici: od $-6$ do $9$ jih je $15$.
:::

## Pogoste napake

- **»$-6$ je več kot $-3$, ker je $6 > 3$.«** To je Žanova napaka: primerja le števki in pozabi na predznak. Pri negativnih številih je večje tisto, ki je bliže ničli. Pomagaj si s premico: $-3$ leži desno od $-6$, torej $-3 > -6$.
- **»$|5| = -5$, absolutna vrednost zamenja predznak.«** Tu je absolutna vrednost zamenjana z nasprotnim številom. Absolutna vrednost je razdalja, ta pa ni nikoli negativna: $|5| = 5$.
- **»Nasprotno od $-3$ je $-3$, saj je nasprotno število negativno.«** Nasprotno število leži na drugi strani ničle. Nasprotno od $-3$ je zato pozitivno: $-(-3) = 3$.
- **»$0$ je pozitivno, ker nima minusa.«** Ničla ločuje pozitivna in negativna števila in ni ne eno ne drugo. Je pa celo število in je nasprotna sama sebi.
- **»Od $-6\,\text{m}$ do $9\,\text{m}$ je $9 - 6 = 3\,\text{m}$.«** Ko sta števili na nasprotnih straneh ničle, pot vodi čez ničlo. Absolutni vrednosti seštejemo: $6 + 9 = 15$.

## Povzetek

- Cela števila $\mathbb{Z}$: naravna števila, $0$ in negativna števila $\dots, -2, -1$.
- Na številski premici je večje število vedno bolj desno; $0$ ni ne pozitivno ne negativno.
- Nasprotni števili $a$ in $-a$ sta enako daleč od $0$ na nasprotnih straneh; $a + (-a) = 0$ in $-(-a) = a$.
- Absolutna vrednost $|a|$ je razdalja od $0$ in ni nikoli negativna; $|a| = |-a|$.
- Od dveh negativnih števil je večje tisto z manjšo absolutno vrednostjo.
- Razdalja med številoma na nasprotnih straneh ničle je vsota njunih absolutnih vrednosti.

## Drugače: Na sliki

Prerez hiše, kot ga kaže gradbeni načrt (desno so višine v metrih):

:::risba skica
opis: Prerez hiše z višinami v metrih. Tla garaže so na −6, tla kleti na −3, tla pritličja na 0 (ob njih je teren), tla prvega nadstropja na +3, vrh strehe na +9. Garaža in klet sta pod zemljo.
območje: 0; -7 .. 17; 10
pravokotnik: 0; -7 .. 11,5; 0 | siva
pravokotnik: 1; -6 .. 9; 6 | ozadje
lik: 0,4; 6 -> 5; 9 -> 9,6; 6 | oranžna
črta: 1; 3 -> 9; 3
črta: 1; -3 -> 9; -3
črta: 0; 0 -> 11,5; 0 | debelo
napis: 5; 6,9 | streha
napis: 5; 4,5 | 1. nadstropje
napis: 5; 1,5 | pritličje
napis: 5; -1,5 | klet
napis: 5; -4,5 | garaža
črta: 13; -7 -> 13; 10 | puščica
črta: 5; 9 -> 13,3; 9 | črtkano siva
črta: 9; 3 -> 13,3; 3 | črtkano siva
črta: 11,5; 0 -> 13,3; 0 | črtkano siva
črta: 9; -3 -> 13,3; -3 | črtkano siva
črta: 9; -6 -> 13,3; -6 | črtkano siva
napis: 13,3; 9 | +9 m | desno
napis: 13,3; 3 | +3 m | desno
napis: 13,3; 0 | 0 m | desno | debelo
napis: 13,3; -3 | −3 m | desno
napis: 13,3; -6 | −6 m | desno
:::

- Višje pomeni večje število. Garaža je najnižje, zato je $-6$ najmanjše od teh števil.
- Prvo nadstropje ($+3$) in klet ($-3$) sta zrcalni sliki čez črto pritličja: to sta nasprotni števili.
- Absolutna vrednost je višina, ki jo prehodiš po stopnicah od pritličja do izbrane ravni, ne glede na smer. Do kleti in do prvega nadstropja je enako daleč: $|-3| = |3| = 3$.

## Drugače: Bolj natančno

Absolutno vrednost definiramo po primerih:

$$|a| = \begin{cases} a, & a \ge 0 \\ -a, & a < 0 \end{cases}$$

Definicija se ujema z razdaljo od ničle. Če je $a < 0$, je $-a > 0$, zato je $|a|$ res nenegativna. Na primer $a = -6$: $|-6| = -(-6) = 6$.

Iz definicije sledi: $|a| \ge 0$ za vsak $a$, $|a| = 0$ natanko tedaj, ko je $a = 0$, in $|a| = |-a|$.

Če je $|x| = 5$, imamo dve rešitvi, $x = 5$ ali $x = -5$, saj sta na razdalji $5$ od ničle natanko ti dve števili. Enačba $|x| = -2$ nima rešitve, ker razdalja ne more biti negativna.

## Preveri se

? Katera trditev je pravilna?
- Število $0$ je pozitivno.
~ $0$ ni ne pozitivno ne negativno; ločuje obe strani premice.
- Nasprotno število je vedno negativno.
~ Nasprotno od $-3$ je $3$, ki je pozitivno.
+ Absolutna vrednost števila ni nikoli negativna.
- $|-3| = -3$
~ Absolutna vrednost je razdalja od ničle, zato je $|-3| = 3$.
> $|a|$ je razdalja od $0$, razdalja pa ne more biti negativna.

? Koliko je $|-11| + |4|$?
- $-7$
~ To dobiš, če izračunaš $-11 + 4$ in absolutno vrednost izpustiš.
- $7$
~ To je $11 - 4$. Obe absolutni vrednosti sta pozitivni, zato ju sešteješ.
+ $15$
- $-15$
~ Absolutni vrednosti sta pozitivni, zato njuna vsota ne more biti negativna.
> $|-11| = 11$ in $|4| = 4$, vsota je $11 + 4 = 15$.

? Miha razvrsti števila $-2$, $5$, $-8$, $0$ od najmanjšega do največjega: $-2 < -8 < 0 < 5$, »ker je $2 < 8$«. Kaj je narobe?
+ Negativni števili sta zamenjani: pravilno je $-8 < -2$.
- Število $0$ bi moralo biti na začetku.
~ $0$ je večje od vsakega negativnega števila, zato stoji za $-8$ in $-2$.
- Število $5$ bi moralo biti pred $0$.
~ $5$ je pozitivno, zato je večje od $0$ in stoji na koncu.
- Nič, rešitev je pravilna.
~ Miha je primerjal le števki. Pri negativnih je večje tisto število, ki je bliže ničli.
> $-8$ leži levo od $-2$. Pravilno: $-8 < -2 < 0 < 5$.

? Primerjaj števili $-15$ in $-9$ ter njuni absolutni vrednosti. Kaj velja?
- $-15 > -9$ in $|-15| > |-9|$
~ Večja absolutna vrednost pri negativnem številu pomeni, da leži dlje levo, torej je manjše.
+ $-15 < -9$ in $|-15| > |-9|$
- $-15 < -9$ in $|-15| < |-9|$
~ Prvi del je pravilen, a $|-15| = 15$ je več kot $|-9| = 9$.
> $-15$ je dlje od ničle kot $-9$: ima večjo absolutno vrednost in leži bolj levo, zato je manjše.

? Gradbinci postavijo zunanje stopnišče od dna jaška na višini $-4\,\text{m}$ do terase na višini $7\,\text{m}$. Kolikšno višino premaga stopnišče?
- $3\,\text{m}$
~ To je $7 - 4$. Višini sta na nasprotnih straneh ničle, zato absolutni vrednosti sešteješ.
+ $11\,\text{m}$
- $-11\,\text{m}$
~ Višinska razlika kot razdalja ni nikoli negativna.
> Do pritličja je $|-4| = 4\,\text{m}$, naprej še $|7| = 7\,\text{m}$; skupaj $4 + 7 = 11\,\text{m}$.

:::simboli
a, b | celi števili | | | −a je nasprotno število števila a
:::
