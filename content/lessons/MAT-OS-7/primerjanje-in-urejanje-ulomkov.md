---
stanje: osnutek
demo: ulomki-primerjava
avtor: AI
---

## Zakaj se tega učimo

Pri matematiki zbereš $17$ od $20$ točk, pri fiziki $21$ od $25$. Pri fiziki imaš več točk. Je bil zato tudi rezultat boljši? Primerjati moraš ulomka $\dfrac{17}{20}$ in $\dfrac{21}{25}$.

Podobno vprašanje se pojavi v vesolju. Na Luni bi ti osebna tehtnica pokazala približno $\dfrac{1}{6}$ tega, kar kaže doma, na Marsu približno $\dfrac{3}{8}$. Kje bi bil »lažji«? Števec $3$ je večji od $1$, a tudi imenovalec $8$ je večji od $6$. Samo s pogledom na števila odgovora ne vidiš.

Za oba odgovora rabiš, kar že znaš: **razširjanje ulomkov** in **najmanjši skupni večkratnik**. Ko znaš ulomke primerjati, jih znaš tudi urediti po velikosti in postaviti na številsko premico. Brez tega ne gre pri nobenem nadaljnjem računu z ulomki.

## Razlaga

Primerjati ulomka pomeni ugotoviti, ali je prvi **manjši** ($<$), **večji** ($>$) ali **enak** ($=$) drugemu. Spomni se: ulomek $\dfrac{a}{b}$ pomeni, da celoto razdelimo na $b$ enakih delov (imenovalec) in vzamemo $a$ delov (števec).

**1. Enaka imenovalca.** Celoti sta razdeljeni na enako velike dele, zato je večji tisti ulomek, ki ima **več delov**, torej večji števec:

$$\frac{2}{7} < \frac{5}{7}, \text{ ker je } 2 < 5.$$

*Preizkus:* kaj je več, $\dfrac{4}{11}$ ali $\dfrac{6}{11}$? (Več je $\dfrac{6}{11}$, ker je $6 > 4$.)

**2. Enaka števca.** Vzamemo enako število delov, a so deli različno veliki. Na čim več delov razdelimo celoto, tem **manjši** je vsak del. Zato je pri enakih števcih večji tisti ulomek, ki ima **manjši imenovalec**:

$$\frac{3}{5} > \frac{3}{8}, \text{ ker je petina večja od osmine.}$$

:::premisli
Sošolka trdi, da je $\dfrac{2}{9}$ večji od $\dfrac{2}{5}$, ker je $9 > 5$. Brez računanja: ima prav? Kako bi ji to razložil s kosi pice?
---
Večji je $\dfrac{2}{5}$. Oba vzameta po $2$ dela, a celota, razrezana na $5$ delov, ima večje kose kot celota, razrezana na $9$ delov. Večji imenovalec pomeni manjše kose.
:::

**3. Različna imenovalca.** Ulomka najprej **razširimo na skupni imenovalec**, nato primerjamo števca kot v 1. pravilu. Za skupni imenovalec je najugodnejši **najmanjši skupni večkratnik** imenovalcev, ker so tako števila najmanjša. Postopek:

- poiščemo najmanjši skupni večkratnik imenovalcev,
- vsak ulomek razširimo, da dobi ta imenovalec,
- primerjamo števca,
- odgovor zapišemo s **prvotnima** ulomkoma.

Primer: $\dfrac{3}{4}$ in $\dfrac{5}{6}$. Najmanjši skupni večkratnik števil $4$ in $6$ je $12$; krajše pišemo $v(4, 6) = 12$. Velja $\dfrac{3}{4} = \dfrac{9}{12}$ in $\dfrac{5}{6} = \dfrac{10}{12}$. Ker je $9 < 10$, je $\dfrac{3}{4} < \dfrac{5}{6}$.

*Preizkus:* zdaj lahko odgovoriš na vprašanji z začetka. Ker je $v(6, 8) = 24$, je $\dfrac{1}{6} = \dfrac{4}{24}$ in $\dfrac{3}{8} = \dfrac{9}{24}$, torej $\dfrac{1}{6} < \dfrac{3}{8}$: na Luni si lažji. Pri testih je $v(20, 25) = 100$: $\dfrac{17}{20} = \dfrac{85}{100}$ in $\dfrac{21}{25} = \dfrac{84}{100}$. Matematika je šla malo bolje, čeprav imaš pri fiziki več točk.

**4. Primerjava z $1$ in z $\dfrac{1}{2}$.** Včasih odgovor najdemo brez računanja:

| ulomek | kdaj velja | primer |
|---|---|---|
| manjši od $1$ | števec je manjši od imenovalca | $\dfrac{7}{9} < 1$ |
| enak $1$ | števec je enak imenovalcu | $\dfrac{6}{6} = 1$ |
| večji od $1$ | števec je večji od imenovalca | $\dfrac{9}{7} > 1$ |
| manjši od $\dfrac{1}{2}$ | dvakratnik števca je manjši od imenovalca | $\dfrac{3}{8} < \dfrac{1}{2}$, ker je $6 < 8$ |
| večji od $\dfrac{1}{2}$ | dvakratnik števca je večji od imenovalca | $\dfrac{5}{9} > \dfrac{1}{2}$, ker je $10 > 9$ |

Če je en ulomek manjši od $\dfrac{1}{2}$, drugi pa večji, je primerjava že končana: $\dfrac{3}{8} < \dfrac{5}{9}$.

:::premisli
Ali $\dfrac{5}{12}$ in $\dfrac{4}{7}$ lahko primerjaš brez skupnega imenovalca? Napovej, kateri je večji.
---
Da. $2 \cdot 5 = 10 < 12$, zato je $\dfrac{5}{12} < \dfrac{1}{2}$. $2 \cdot 4 = 8 > 7$, zato je $\dfrac{4}{7} > \dfrac{1}{2}$. Torej je $\dfrac{5}{12} < \dfrac{4}{7}$. Skupni imenovalec $84$ da isto: $\dfrac{35}{84} < \dfrac{48}{84}$.
:::

**5. Enakovredni ulomki.** Če po razširjanju dobimo enaka števca, sta ulomka enakovredna (enaka): $\dfrac{4}{6} = \dfrac{6}{9}$, ker sta oba enaka $\dfrac{12}{18}$.

*Preizkus:* ali je $\dfrac{6}{8} = \dfrac{9}{12}$? (Da, oba sta enaka $\dfrac{18}{24}$.)

**6. Urejanje ulomkov.** Več ulomkov uredimo po velikosti tako, da jih razširimo na **skupni imenovalec vseh** imenovalcev, uredimo števce in ulomke zapišemo z znaki $<$ (naraščajoče, od najmanjšega) ali $>$ (padajoče, od največjega).

*Preizkus:* uredi naraščajoče $\dfrac{1}{2}$, $\dfrac{1}{3}$ in $\dfrac{1}{4}$. ($\dfrac{1}{4} < \dfrac{1}{3} < \dfrac{1}{2}$: števci so enaki, večji imenovalec da manjši ulomek.)

**7. Ulomki na številski premici.** Na številski premici leži večji od dveh ulomkov bolj desno. Razdaljo od $0$ do $1$ razdelimo na toliko enakih delov, kolikor kaže skupni imenovalec, in ulomke vrišemo.

V simulaciji spodaj (**Primerjanje ulomkov**) nastavi $\dfrac{5}{6}$ in $\dfrac{7}{9}$, nato vklopi »razdeli na skupni imenovalec«. Opazi: oba trakova razpadeta na $18$ enakih koščkov, točka za $\dfrac{5}{6}$ pa leži na premici en košček desno od točke za $\dfrac{7}{9}$.

## Rešeni primeri

### Primer 1 (lažji)

Med ulomka vstavi pravi znak $<$, $>$ ali $=$:

a) $\dfrac{5}{9}$ in $\dfrac{7}{9}$, b) $\dfrac{3}{8}$ in $\dfrac{3}{5}$.

**Podatki:** a) ulomka $\dfrac{5}{9}$ in $\dfrac{7}{9}$ (enaka imenovalca); b) ulomka $\dfrac{3}{8}$ in $\dfrac{3}{5}$ (enaka števca)
**Iščemo:** pravi znak med ulomkoma pri a) in b)

:::formula
Enaka imenovalca: $\dfrac{a}{b} < \dfrac{c}{b}$, če je $a < c$.

Enaka števca: $\dfrac{a}{b} < \dfrac{a}{d}$, če je $b > d$ (večji imenovalec pomeni manjše dele).
:::

**Rešitev:**

1. a) Imenovalca sta enaka, oba ulomka štejeta devetine. Primerjamo števca: $5 < 7$.
2. Zato velja $\dfrac{5}{9} < \dfrac{7}{9}$.
3. b) Števca sta enaka, v obeh primerih vzamemo $3$ dele. Osmina je manjša od petine, ker je celota razdeljena na več delov ($8 > 5$).
4. Zato velja $\dfrac{3}{8} < \dfrac{3}{5}$.
5. Odgovor: a) $\dfrac{5}{9} < \dfrac{7}{9}$, b) $\dfrac{3}{8} < \dfrac{3}{5}$.

### Primer 2 (srednji)

Tina je prebrala $\dfrac{5}{6}$ knjige, Gal pa $\dfrac{7}{9}$ enako debele knjige. Kdo je prebral več?

**Podatki:** Tina: $\dfrac{5}{6}$ knjige; Gal: $\dfrac{7}{9}$ knjige; knjigi sta enako debeli
**Iščemo:** kateri ulomek je večji, torej kdo je prebral več

:::formula
Ulomka razširimo na skupni imenovalec $v(6, 9)$ (najmanjši skupni večkratnik) in primerjamo števca.
:::

**Rešitev:**

1. Poiščemo najmanjši skupni večkratnik imenovalcev. Večkratniki števila $6$: $6, 12, 18, 24, \ldots$ Večkratniki števila $9$: $9, 18, 27, \ldots$ Prvi skupni je $18$, torej $v(6, 9) = 18$.
2. Razširimo prvi ulomek s $3$: $\dfrac{5}{6} = \dfrac{5 \cdot 3}{6 \cdot 3} = \dfrac{15}{18}$.
3. Razširimo drugi ulomek z $2$: $\dfrac{7}{9} = \dfrac{7 \cdot 2}{9 \cdot 2} = \dfrac{14}{18}$.
4. Primerjamo števca: $15 > 14$, zato je $\dfrac{15}{18} > \dfrac{14}{18}$.
5. Vrnemo se k prvotnima ulomkoma: $\dfrac{5}{6} > \dfrac{7}{9}$.
6. Odgovor: Tina je prebrala več, in sicer za eno osemnajstino knjige.

### Primer 3 (težji)

Štirje prijatelji so jedli enako velike pice. Jan je pojedel $\dfrac{2}{3}$ pice, Lara $\dfrac{3}{4}$, Miha $\dfrac{5}{8}$ in Ula $\dfrac{7}{12}$ pice. Uredi ulomke po velikosti od najmanjšega do največjega in ugotovi, kdo je pojedel največ.

**Podatki:** Jan $\dfrac{2}{3}$, Lara $\dfrac{3}{4}$, Miha $\dfrac{5}{8}$, Ula $\dfrac{7}{12}$; pice so enako velike
**Iščemo:** ulomke, urejene naraščajoče, in kdo je pojedel največ

:::formula
Vse ulomke razširimo na skupni imenovalec $v(3, 4, 8, 12)$ in jih uredimo po števcih.
:::

**Rešitev:**

1. Iščemo najmanjši skupni večkratnik števil $3$, $4$, $8$ in $12$. Večkratniki največjega števila $12$ so $12, 24, 36, \ldots$ Število $12$ ni deljivo z $8$, število $24$ pa je deljivo s $3$, $4$, $8$ in $12$. Torej je $v(3, 4, 8, 12) = 24$.
2. Razširimo vse ulomke na imenovalec $24$:
   - $\dfrac{2}{3} = \dfrac{2 \cdot 8}{3 \cdot 8} = \dfrac{16}{24}$,
   - $\dfrac{3}{4} = \dfrac{3 \cdot 6}{4 \cdot 6} = \dfrac{18}{24}$,
   - $\dfrac{5}{8} = \dfrac{5 \cdot 3}{8 \cdot 3} = \dfrac{15}{24}$,
   - $\dfrac{7}{12} = \dfrac{7 \cdot 2}{12 \cdot 2} = \dfrac{14}{24}$.
3. Uredimo števce: $14 < 15 < 16 < 18$.
4. Zapišemo s prvotnimi ulomki: $\dfrac{7}{12} < \dfrac{5}{8} < \dfrac{2}{3} < \dfrac{3}{4}$.
5. Preverimo smiselnost: vsi ulomki so večji od $\dfrac{1}{2} = \dfrac{12}{24}$ in manjši od $1$, kar se ujema s tem, da je vsak pojedel več kot pol pice, a ne cele.
6. Odgovor: po velikosti je $\dfrac{7}{12} < \dfrac{5}{8} < \dfrac{2}{3} < \dfrac{3}{4}$; največ je pojedla Lara ($\dfrac{3}{4}$ pice), najmanj Ula.

### Primer 4 – zdaj ti

Na Veneri bi osebna tehtnica pokazala približno $\dfrac{9}{10}$ tega, kar kaže na Zemlji. Na Uranu, ki nima trdnih tal, bi na vrhu oblakov pokazala približno $\dfrac{8}{9}$. Kje bi tehtnica pokazala več?

**Podatki:** Venera: $\dfrac{9}{10}$ zemeljske teže; Uran: $\dfrac{8}{9}$ zemeljske teže
**Iščemo:** večji od ulomkov $\dfrac{9}{10}$ in $\dfrac{8}{9}$

:::formula
Razširi na skupni imenovalec $v(10, 9)$ in primerjaj števca.
:::

**Rešitev:**

1. Primerjava s $1$ in s $\dfrac{1}{2}$ ne odloči: oba ulomka sta med $\dfrac{1}{2}$ in $1$.
2. Števili $10$ in $9$ sta tuji, zato je $v(10, 9) = 10 \cdot 9 = 90$.
3. Razširimo: $\dfrac{9}{10} = \dfrac{81}{90}$ in $\dfrac{8}{9} = \dfrac{80}{90}$.
4. Primerjaj števca sam in zapiši odgovor s prvotnima ulomkoma.

:::premisli
Kateri ulomek je večji in kje tehtnica pokaže več?
---
$81 > 80$, zato je $\dfrac{9}{10} > \dfrac{8}{9}$: na Veneri pokaže malo več. To se vidi tudi brez računa: ulomku $\dfrac{9}{10}$ do $1$ manjka $\dfrac{1}{10}$, ulomku $\dfrac{8}{9}$ pa večji kos, $\dfrac{1}{9}$.
:::

## Pogoste napake

- **Večji imenovalec pomeni večji ulomek.** Ker je $8 > 5$, nekateri mislijo, da je $\dfrac{1}{8} > \dfrac{1}{5}$. Napačno: več kot je delov, manjši je vsak del. *Pravilno:* pri enakih števcih je večji ulomek z manjšim imenovalcem, torej $\dfrac{1}{8} < \dfrac{1}{5}$.
- **Primerjanje števcev pri različnih imenovalcih.** Pri $\dfrac{3}{4}$ in $\dfrac{4}{7}$ ni dovolj reči »$3 < 4$, torej je prvi manjši«. Deli so različno veliki. *Pravilno:* razširi na skupni imenovalec $28$: $\dfrac{21}{28} > \dfrac{16}{28}$, torej $\dfrac{3}{4} > \dfrac{4}{7}$.
- **Razširjen samo imenovalec.** Iz $\dfrac{2}{3}$ ne nastane $\dfrac{2}{12}$, ampak $\dfrac{8}{12}$. Z istim številom moraš pomnožiti števec in imenovalec, sicer se vrednost ulomka spremeni.
- **Primerjanje razlik.** Nekateri sklepajo, da sta $\dfrac{3}{4}$ in $\dfrac{6}{7}$ »enako daleč od $1$«, ker sta števec in imenovalec v obeh primerih različna za $1$. Napačno: $\dfrac{3}{4}$ manjka do $1$ ena četrtina, $\dfrac{6}{7}$ pa le ena sedmina, zato je $\dfrac{3}{4} < \dfrac{6}{7}$.
- **Odgovor z razširjenimi ulomki.** Če vprašanje sprašuje po ulomkih $\dfrac{5}{6}$ in $\dfrac{7}{9}$, mora biti v odgovoru $\dfrac{5}{6} > \dfrac{7}{9}$, ne le $\dfrac{15}{18} > \dfrac{14}{18}$. Razširjeni ulomki so samo pomoč pri računu.

## Povzetek

- Enaka imenovalca: večji je ulomek z večjim števcem, $\dfrac{2}{7} < \dfrac{5}{7}$.
- Enaka števca: večji je ulomek z manjšim imenovalcem, $\dfrac{3}{8} < \dfrac{3}{5}$.
- Različna imenovalca: ulomka razširimo na skupni imenovalec (najbolje najmanjši skupni večkratnik imenovalcev) in primerjamo števca.
- Ulomek je manjši od $1$, če je števec manjši od imenovalca, in večji od $1$, če je števec večji.
- Hitra primerjava s polovico: $\dfrac{a}{b} > \dfrac{1}{2}$, če je $2a > b$.
- Več ulomkov uredimo tako, da jih razširimo na skupni imenovalec vseh in uredimo števce.
- Odgovor zapišemo s prvotnimi ulomki in znaki $<$, $>$ ali $=$.

## Drugače: Na sliki

Nariši dva enako dolga pravokotna traka, enega pod drugim. Zgornji trak razdeli na $6$ enakih delov in pobarvaj $5$ delov, to je $\dfrac{5}{6}$. Spodnji trak razdeli na $9$ enakih delov in pobarvaj $7$ delov, to je $\dfrac{7}{9}$. Na prvi pogled sta pobarvana dela skoraj enako dolga, zato je težko oceniti, kateri je daljši.

Zdaj vsak del zgornjega traku razreži še na $3$ manjše dele, vsak del spodnjega traku pa na $2$. Oba trakova imata zdaj $18$ enakih koščkov, koščki so na obeh trakovih enako veliki. Na zgornjem je pobarvanih $15$ koščkov, na spodnjem $14$. Zdaj je jasno, da je zgornji pobarvani del za en košček daljši.

:::risba skica
opis: Dva enako dolga trakova, eden nad drugim. Zgornji je razdeljen na 6 delov, pobarvanih je 5 (to je 5/6). Spodnji je razdeljen na 9 delov, pobarvanih je 7 (to je 7/9). Črtkane črte razrežejo oba trakova na 18 enakih koščkov: zgoraj je pobarvanih 15 koščkov, spodaj 14.
območje: 0; -0,8 .. 18; 3,6
enota: 17
pravokotnik: 0; 1,8 .. 3; 2,8 | modra polno
pravokotnik: 3; 1,8 .. 6; 2,8 | modra polno
pravokotnik: 6; 1,8 .. 9; 2,8 | modra polno
pravokotnik: 9; 1,8 .. 12; 2,8 | modra polno
pravokotnik: 12; 1,8 .. 15; 2,8 | modra polno
pravokotnik: 15; 1,8 .. 18; 2,8
črta: 1; 1,8 -> 1; 2,8 | črtkano
črta: 2; 1,8 -> 2; 2,8 | črtkano
črta: 4; 1,8 -> 4; 2,8 | črtkano
črta: 5; 1,8 -> 5; 2,8 | črtkano
črta: 7; 1,8 -> 7; 2,8 | črtkano
črta: 8; 1,8 -> 8; 2,8 | črtkano
črta: 10; 1,8 -> 10; 2,8 | črtkano
črta: 11; 1,8 -> 11; 2,8 | črtkano
črta: 13; 1,8 -> 13; 2,8 | črtkano
črta: 14; 1,8 -> 14; 2,8 | črtkano
črta: 16; 1,8 -> 16; 2,8 | črtkano
črta: 17; 1,8 -> 17; 2,8 | črtkano
pravokotnik: 0; 0 .. 2; 1 | oranžna polno
pravokotnik: 2; 0 .. 4; 1 | oranžna polno
pravokotnik: 4; 0 .. 6; 1 | oranžna polno
pravokotnik: 6; 0 .. 8; 1 | oranžna polno
pravokotnik: 8; 0 .. 10; 1 | oranžna polno
pravokotnik: 10; 0 .. 12; 1 | oranžna polno
pravokotnik: 12; 0 .. 14; 1 | oranžna polno
pravokotnik: 14; 0 .. 16; 1
pravokotnik: 16; 0 .. 18; 1
črta: 1; 0 -> 1; 1 | črtkano
črta: 3; 0 -> 3; 1 | črtkano
črta: 5; 0 -> 5; 1 | črtkano
črta: 7; 0 -> 7; 1 | črtkano
črta: 9; 0 -> 9; 1 | črtkano
črta: 11; 0 -> 11; 1 | črtkano
črta: 13; 0 -> 13; 1 | črtkano
črta: 15; 0 -> 15; 1 | črtkano
črta: 17; 0 -> 17; 1 | črtkano
napis: 9; 3,25 | 5/6 = 15/18 | sredina
napis: 9; -0,45 | 7/9 = 14/18 | sredina
:::


To je natanko tisto, kar narediš z razširjanjem na skupni imenovalec: oba ulomka izraziš z enako velikimi koščki in jih nato samo prešteješ. V interaktivni simulaciji spodaj lahko trakove in številsko premico opazuješ sam.

## Drugače: Bolj natančno

Zakaj postopek s skupnim imenovalcem vedno deluje? Razširjanje ne spremeni vrednosti ulomka. Ko imata ulomka isti imenovalec $n$, sta oba izražena z enako velikimi deli $\dfrac{1}{n}$, zato je primerjava ulomkov enaka primerjavi števcev, torej primerjavi naravnih števil.

Za skupni imenovalec bi lahko vzeli kar zmnožek imenovalcev $b \cdot d$: $\dfrac{a}{b} = \dfrac{a \cdot d}{b \cdot d}$ in $\dfrac{c}{d} = \dfrac{c \cdot b}{b \cdot d}$. Ker sta imenovalca zdaj enaka, je

$$\frac{a}{b} < \frac{c}{d} \quad \text{natanko takrat, ko je} \quad a \cdot d < c \cdot b.$$

To je hiter preizkus z **navzkrižnim množenjem**: pri $\dfrac{5}{6}$ in $\dfrac{7}{9}$ je $5 \cdot 9 = 45$ in $7 \cdot 6 = 42$. Ker je $45 > 42$, je $\dfrac{5}{6} > \dfrac{7}{9}$. Najmanjši skupni večkratnik ima prednost, ker so števila manjša, a obe poti dasta isti odgovor.

Zanimivo je še to: med dvema različnima ulomkoma vedno leži še kak ulomek. Med $\dfrac{1}{3}$ in $\dfrac{1}{2}$ ga najdeš, če oba razširiš na imenovalec $12$: $\dfrac{4}{12}$ in $\dfrac{6}{12}$, vmes je $\dfrac{5}{12}$. Če bi iskal ulomek med $\dfrac{4}{12}$ in $\dfrac{5}{12}$, bi razširil še enkrat, na $\dfrac{8}{24}$ in $\dfrac{10}{24}$, in vmes je $\dfrac{9}{24}$. Tako lahko nadaljuješ brez konca.

Včasih je še hitreje razširiti na **enak števec**. Pri $\dfrac{1}{7}$ in $\dfrac{2}{15}$ razširimo prvi ulomek z $2$: $\dfrac{1}{7} = \dfrac{2}{14}$. Zdaj sta števca enaka, zato je večji ulomek z manjšim imenovalcem: $\dfrac{2}{14} > \dfrac{2}{15}$, torej $\dfrac{1}{7} > \dfrac{2}{15}$.

## Preveri se

? Zakaj je $\dfrac{1}{8}$ manjši od $\dfrac{1}{5}$, čeprav je $8 > 5$?
- Ni res: $\dfrac{1}{8}$ je večji, ker je $8 > 5$.
~ To je najpogostejša napaka. Večji imenovalec pomeni, da je celota razrezana na več delov, zato je vsak del manjši.
+ Ker je celota razrezana na več delov, je vsak del manjši.
- Ker imenovalec na velikost ulomka ne vpliva, odloča samo števec.
~ Imenovalec vpliva: pove, na koliko delov razrežemo celoto, torej kako velik je vsak del.
> Osmina je manjša od petine. Pri enakih števcih je večji ulomek z manjšim imenovalcem.

? Razdalja od $0$ do $1$ je razdeljena na $12$ enakih delov. Kateri ulomek leži med točkama $A$ in $B$?
:::risba premica
opis: Številska premica od 0 do 1, razdeljena na 12 enakih delov. Točka A je pri sedmi črtici, točka B pri deveti črtici.
od: 0
do: 12
korak: 1
oznake: ne
oznaka: 0 | 0
oznaka: 12 | 1
točka: 7 | A
točka: 9 | B
:::
- $\dfrac{1}{2}$
~ $\dfrac{1}{2} = \dfrac{6}{12}$ leži pri šesti črtici, levo od $A$.
+ $\dfrac{2}{3}$
- $\dfrac{7}{9}$
~ Števec $7$ je enak kot pri $A$, a deli so devetine. $\dfrac{7}{9} = \dfrac{28}{36}$ je več kot $\dfrac{3}{4} = \dfrac{27}{36}$, zato leži desno od $B$.
- $\dfrac{4}{5}$
~ $\dfrac{4}{5}$ in $\dfrac{3}{4}$ nista enako daleč od $1$: prvemu manjka le petina. $\dfrac{4}{5} = \dfrac{16}{20} > \dfrac{15}{20} = \dfrac{3}{4}$, zato leži desno od $B$.
> Točka $A$ je $\dfrac{7}{12}$, točka $B$ je $\dfrac{9}{12} = \dfrac{3}{4}$. Ulomek $\dfrac{2}{3} = \dfrac{8}{12}$ leži na osmi črtici, med $A$ in $B$.

? Vpiši najmanjše naravno število $x$, pri katerem velja $\dfrac{5}{8} < \dfrac{x}{24} < \dfrac{3}{4}$.
= 16
~ 15 | $\dfrac{15}{24} = \dfrac{5}{8}$. Ulomek mora biti večji od $\dfrac{5}{8}$, ne enak.
~ 18 | $\dfrac{18}{24} = \dfrac{3}{4}$. Ulomek mora biti manjši od $\dfrac{3}{4}$, ne enak.
~ 4 | $4$ leži med števcema $3$ in $5$, a števcev ulomkov z različnimi imenovalci ne smeš primerjati. $\dfrac{4}{24}$ je celo manjši od $\dfrac{5}{8} = \dfrac{15}{24}$.
> Razširimo na $24$: $\dfrac{5}{8} = \dfrac{15}{24}$ in $\dfrac{3}{4} = \dfrac{18}{24}$. Vmes sta $\dfrac{16}{24}$ in $\dfrac{17}{24}$, zato je najmanjši $x = 16$ (ustreza tudi $17$).

? Kateri je največji naravni števec $x$, pri katerem je $\dfrac{x}{6} < \dfrac{5}{9}$?
= 3
~ 4 | $\dfrac{4}{6} = \dfrac{12}{18}$ je več kot $\dfrac{5}{9} = \dfrac{10}{18}$. Primerjal si samo števca, imenovalca pa sta različna.
~ 5 | Pri enakih števcih je večji ulomek z manjšim imenovalcem: $\dfrac{5}{6} > \dfrac{5}{9}$.
> $v(6, 9) = 18$ in $\dfrac{5}{9} = \dfrac{10}{18}$. Ulomek $\dfrac{x}{6}$ razširimo s $3$, njegov števec je $3 \cdot x$. Ta mora biti manjši od $10$, zato je največ $x = 3$: $\dfrac{3}{6} = \dfrac{9}{18} < \dfrac{10}{18}$.

? Osebna tehtnica bi na teh nebesnih telesih pokazala približno tak del tega, kar kaže na Zemlji: Io $\dfrac{2}{11}$, Evropa $\dfrac{2}{15}$, Luna $\dfrac{1}{6}$, Titan $\dfrac{1}{7}$. Razvrsti jih od najmanjše do največje teže.
1. Evropa, $\dfrac{2}{15}$
2. Titan, $\dfrac{1}{7}$
3. Luna, $\dfrac{1}{6}$
4. Io, $\dfrac{2}{11}$
> Razširimo na enak števec $2$: $\dfrac{1}{7} = \dfrac{2}{14}$ in $\dfrac{1}{6} = \dfrac{2}{12}$. Pri enakih števcih je manjši ulomek z večjim imenovalcem: $\dfrac{2}{15} < \dfrac{2}{14} < \dfrac{2}{12} < \dfrac{2}{11}$.

<<RACUN
enako: 1/6 | 4/24
enako: 3/8 | 9/24
enako: 17/20 | 85/100
enako: 21/25 | 84/100
enako: 5/12 | 35/84
enako: 4/7 | 48/84
enako: 5/6 | 15/18
enako: 7/9 | 14/18
vrednost: 5*9-7*6 | 3
enako: 2/3 | 16/24
enako: 3/4 | 18/24
enako: 5/8 | 15/24
enako: 7/12 | 14/24
enako: 9/10 | 81/90
enako: 8/9 | 80/90
enako: 2/3 | 8/12
enako: 5/9 | 10/18
enako: 1/7 | 2/14
enako: 1/6 | 2/12
>>

:::simboli
a | števec (prvega) ulomka | |
b | imenovalec (prvega) ulomka | | | pri enakih imenovalcih imata oba ulomka $b$
c | števec drugega ulomka | |
d | imenovalec drugega ulomka | | | $b \cdot d$ je vedno skupni imenovalec
v | najmanjši skupni večkratnik | | | $v(6, 9) = 18$ je najmanjši skupni imenovalec
:::
