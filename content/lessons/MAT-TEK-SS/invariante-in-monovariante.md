---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi list karirastega papirja in izreži kvadrat $8 \times 8$ polj. Odreži mu dve nasprotni vogalni polji, zgoraj levo in spodaj desno. Ostane $62$ polj. Nato iz drugega lista izreži domine, pravokotnike $1 \times 2$, in poskusi z njimi pokriti vseh $62$ polj, brez prekrivanja in brez rezanja.

Pred enako nalogo stoji keramičar. Kopalnica ima tla iz $8 \times 8$ kvadratov, v dveh nasprotnih vogalih stojita odtočni cevi, na voljo pa ima samo ploščice $1 \times 2$. Števila se lepo izidejo: $62$ polj, $31$ ploščic. Pa vendar ne gre.

Ni kriva premajhna vztrajnost. Kratek dokaz pokaže, da ne bo šlo **nikoli**, kakor koli ploščice obrača. Skrivnost je v količini, ki se pri polaganju ne spremeni. Taki količini rečemo **invarianta**. Z invariantami in monovariantami (količinami, ki se pri vsaki potezi spremenijo v isto smer) rešiš tekmovalne naloge tipa »ali je mogoče …?« in »ali se postopek konča?«.

## Razlaga

**Barvanje razkrije oviro.** Pobarvaj tla šahovsko, belo in črno. Sosednji polji imata vedno različni barvi. Ploščica $1 \times 2$ zato vedno pokrije natanko eno belo in eno črno polje, ne glede na to, kam in kako jo položimo.

Nasprotna vogala sta iste barve, recimo bela. Po odstranitvi ostane $32$ črnih in $30$ belih polj. Vseh $31$ ploščic bi pokrilo $31$ belih in $31$ črnih polj. Takega pokritja torej ni.

Kaj se je ohranilo? Razlika med številom pokritih črnih in pokritih belih polj. Pred prvo ploščico je $0$ in vsaka nova ploščica jo pusti pri $0$. Pri popolnem pokritju bi morala biti $32 - 30 = 2$.

:::premisli
Recimo, da cevi stojita na dveh **sosednjih** poljih namesto v vogalih. Ali barvanje tudi zdaj dokaže, da pokritje ni mogoče?
---
Ne. Sosednji polji sta različnih barv, zato ostane $31$ belih in $31$ črnih polj. Invarianta ne najde ovire. To pa še ni dokaz, da pokritje obstaja: enako število barv je **potreben** pogoj, ne zadosten. Da gre, pokažeš šele s konkretnim polaganjem.
:::

V simulaciji spodaj (»Invarianta z barvanjem«, plošča $6 \times 6$) sta dve polji iste barve, nasprotna vogala, že odstranjeni. Pritisni Tlakuj. Nato s klikom en vogal vrni in odstrani polje druge barve. Opazi, da se zapis pod sliko spremeni takoj, ko se števili belih in temnih polj izenačita.

**Invarianta ob indukciji.** Spomni se popolne indukcije: lastnost velja na začetku, korak $n \to n + 1$ jo ohrani, zato velja povsod. Invarianta je ista misel, le da koraki niso števila $n$, ampak **poteze**: položena ploščica, zamenjava, preklop. Invarianta je količina ali lastnost stanja, ki je nobena dovoljena poteza ne spremeni. Če ima cilj drugačno vrednost invariante kot začetek, ga ne doseže nobeno zaporedje potez.

**Parnost in ostanki.** Pogosto se ne ohrani sama količina, ampak njena parnost (sodo ali liho) ali ostanek pri deljenju s $3$ ali $4$. Barvanje je pravzaprav parnost: seštej številko vrstice in številko stolpca polja. Soda vsota (ostanek $0$ pri deljenju z $2$) je bela, liha (ostanek $1$) črna. Za ploščice $1 \times 4$ vzamemo štiri barve, ostanke pri deljenju s $4$.

**Monovarianta ob rekurziji.** Pri rekurziji $a_{n+1} = q a_n + d$ z $0 < q < 1$ se razdalja do ravnovesja $L$, vrednosti, h kateri se zaporedje bliža, vsakič zmanjša, pri $q = 0{,}5$ na primer $1$; $0{,}5$; $0{,}25$; … Monovarianta je količina, ki se pri vsaki potezi spremeni v isto smer, recimo strogo pada. Če je poleg tega **nenegativno celo število**, se mora postopek končati. Vsak padec jo zmanjša vsaj za $1$, zato z začetne vrednosti $M$ pade največ $M$-krat:

$$k \le M$$

Tu je $k$ število potez. Invarianta pove, česa ni mogoče doseči. Monovarianta pove, da se postopek ustavi, in pogosto tudi, po največ koliko potezah.

:::premisli
Razdalja do $L$ iz rekurzije zgoraj pri vsakem koraku pade in nikoli ni negativna. Ali to zagotovi, da se postopek konča? Kateri pogoj monovariante ji manjka?
---
Realno število lahko pada v nedogled: $1$; $0{,}5$; $0{,}25$; $0{,}125$; … Vsak člen je manjši od prejšnjega in nobeden ni negativen, a postopek se ne konča. Pri celih številih je vsak padec vsaj $1$, zato se spust ustavi najkasneje pri $0$.
:::

**Kako poiščeš invarianto.**

1. Natančno zapiši, kaj naredi ena poteza.
2. Preizkusi kandidate: vsota, parnost, ostanek, število polj posamezne barve, število parov v napačnem vrstnem redu.
3. Preveri, da se kandidat ohrani pri **vsaki** vrsti poteze (ležeča in pokončna ploščica, večje in manjše število).
4. Primerjaj vrednost na začetku in na cilju.

## Rešeni primeri

### Primer 1 (lažji): parnost

Na tabli so zapisana števila $1, 2, \dots, 10$. V eni potezi zbrišemo dve števili $a$ in $b$ in namesto njiju zapišemo $|a - b|$. Po $9$ potezah ostane eno samo število. Ali je lahko to število $0$?

**Podatki:** števila $1, 2, \dots, 10$; poteza: $a, b \to |a - b|$; $9$ potez
**Iščemo:** ali je lahko zadnje število enako $0$

:::formula
Števili $a + b$ in $|a - b|$ se razlikujeta za dvakratnik manjšega od $a$ in $b$, zato imata enako parnost. Parnost vsote vseh števil na tabli je invarianta.
:::

**Rešitev:**

1. Vsota na začetku: $\frac{10 \cdot 11}{2} = 55$, kar je liho.
2. Poteza odvzame $a + b$ in doda $|a - b|$. Razlika med njima je soda, zato se parnost vsote ne spremeni.
3. Po $9$ potezah je vsota kar zadnje število. Biti mora liho, kot je bila vsota na začetku.
4. Odgovor: zadnje število ne more biti $0$, ker je vedno liho.

### Primer 2: monovarianta pri urejanju dlet

Mizar ima na polici od leve proti desni dleta širin $12$, $6$, $25$, $10$, $20$ in $16$ milimetrov. Rad bi jih uredil od najožjega do najširšega. V eni potezi zamenja dve sosednji dleti, pri katerih je levo širše od desnega. Ali se postopek zagotovo konča? Po koliko zamenjavah?

**Podatki:** širine $12$, $6$, $25$, $10$, $20$, $16$ (v mm, od leve); poteza: zamenjava sosednjih dlet v napačnem vrstnem redu
**Iščemo:** ali se postopek konča in število zamenjav

:::formula
Inverzija je par dlet, pri katerem stoji širše levo od ožjega. Naj bo $I$ število inverzij. Ena zamenjava sosednjih dlet v napačnem vrstnem redu zmanjša $I$ natanko za $1$.
:::

**Rešitev:**

1. Zakaj natanko za $1$: zamenjava spremeni vrstni red samo zamenjanega para, vsi drugi pari ostanejo v enakem razmerju. Ta par je bil inverzija, po zamenjavi ni več.
2. Za vsako dleto preštej ožja dleta desno od njega: $12$ ima $2$ ($6$ in $10$), $6$ nima nobenega, $25$ ima $3$, $10$ nobenega, $20$ ima $1$, $16$ nobenega.
3. Skupaj: $I = 2 + 0 + 3 + 0 + 1 + 0 = 6$.
4. $I$ je nenegativno celo število in vsaka poteza ga zmanjša, zato je monovarianta. Postopek se konča, ko ni več sosednjega para v napačnem vrstnem redu. Tedaj so dleta urejena in $I = 0$.
5. Ker vsaka poteza zmanjša $I$ za natanko $1$, je zamenjav vedno $6$, ne glede na to, kateri par mizar izbere.
6. Odgovor: postopek se zagotovo konča, in to po natanko $6$ zamenjavah.

### Primer 3 (težji): ploščice $1 \times 4$

Keramičar mora tlakovati tla iz $10 \times 10$ kvadratov ($1\,\mathrm{m} \times 1\,\mathrm{m}$, kvadrat meri $10\,\mathrm{cm}$) s ploščicami $10\,\mathrm{cm} \times 40\,\mathrm{cm}$, torej $1 \times 4$ kvadrate. Ploščice ne sme rezati. Ali mu lahko uspe?

**Podatki:** tla $10 \times 10$ kvadratov (kvadrat meri $10\,\mathrm{cm}$); ploščica $1 \times 4$ kvadrate ($10\,\mathrm{cm} \times 40\,\mathrm{cm}$), ležeča ali pokončna, brez rezanja
**Iščemo:** ali tlakovanje obstaja

:::formula
Kvadrat v vrstici $i$ in stolpcu $j$ pobarvamo z ostankom števila $i + j$ pri deljenju s $4$ (barve $0$, $1$, $2$, $3$).
:::

**Rešitev:**

1. Število ploščic: $\frac{100}{4} = 25$. Števila sama ne izključijo tlakovanja.
2. Ploščica pokrije štiri zaporedne kvadrate v vrstici ali stolpcu. Vsote $i + j$ so tam štiri zaporedna števila, ki dajo vse štiri ostanke. Vsaka ploščica zato pokrije po en kvadrat vsake barve.
3. Pri $25$ ploščicah bi bilo torej vsake barve natanko $25$ kvadratov. Preštejmo.
4. Levih $8$ stolpcev: v vsaki vrstici je $8$ zaporednih vsot, vsak ostanek dvakrat. To da $10 \cdot 2 = 20$ kvadratov vsake barve.
5. Desna dva stolpca: vsote $i + 9$ so števila od $10$ do $19$, vsote $i + 10$ od $11$ do $20$. Preštejemo ostanke:

| barva | levih $8$ stolpcev | desna $2$ stolpca | skupaj |
|---|---|---|---|
| $0$ | $20$ | $5$ | $25$ |
| $1$ | $20$ | $4$ | $24$ |
| $2$ | $20$ | $5$ | $25$ |
| $3$ | $20$ | $6$ | $26$ |

6. Barve $3$ je $26$ kvadratov, barve $1$ samo $24$. Ploščice bi jih morale pokriti po $25$.
7. Odgovor: tlakovanje ni mogoče, čeprav je $100$ deljivo s $4$.

### Primer 4: zdaj ti

Keramičar ima $13$ belih, $15$ sivih in $17$ črnih ploščic. V peči za glaziranje lahko dve ploščici **različnih** barv preglazira v tretjo barvo. Primer: bela in siva postaneta dve črni. Ali lahko doseže, da so vse ploščice iste barve?

**Podatki:** $13$ belih, $15$ sivih, $17$ črnih ploščic; poteza: dve ploščici različnih barv postaneta dve ploščici tretje barve
**Iščemo:** ali so lahko vse ploščice iste barve

:::formula
Opazuj razlike med števili ploščic posameznih barv in njihovo deljivost s $3$.
:::

**Rešitev:**

1. Pri potezi bela in siva → dve črni se števila spremenijo za $-1$, $-1$ in $+2$. Razlika belih in sivih ostane enaka, razliki s črnimi se spremenita za $3$. Enako velja za drugi dve potezi.
2. Zato se pri nobeni razliki ne spremeni, ali je deljiva s $3$. To je invarianta.
3. Na cilju je vseh $45$ ploščic iste barve, drugih dveh barv je $0$. Razlika teh dveh je $0$, ki je deljiva s $3$.
4. Izračunaj tri začetne razlike in odgovori sam.

:::premisli
Ali je katera od začetnih razlik deljiva s $3$? Kaj to pomeni za cilj?
---
Razlike so $15 - 13 = 2$, $17 - 15 = 2$ in $17 - 13 = 4$. Nobena ni deljiva s $3$ in tudi nikoli ne bo. Na cilju pa bi bila ena razlika $0$. Vse ploščice iste barve keramičar ne more nikoli dobiti.
:::

## Pogoste napake

- **»Poskusil sem desetkrat in ni šlo, torej ni mogoče.«** Neuspeli poskusi niso dokaz, ker ne pokrijejo vseh možnosti. Dokaz »nikoli« da šele invarianta, ki se ohrani pri vsaki potezi.
- **»Invarianta se ujema, torej gre.«** Enako število belih in črnih polj je potreben, ne zadosten pogoj. Kadar se invarianta na začetku in cilju ujema, moraš pokritje ali zaporedje potez še konstruirati.
- **Barvanje, ki ne loči.** Šahovsko barvanje za ploščice $1 \times 4$ ne pove ničesar, ker vsaka pokrije dve beli in dve črni polji. Izberi barvanje, pri katerem vsak kos pokrije enako mnogo polj vsake barve, na tleh pa barve niso enako zastopane. Prvo preveri za ležeče in pokončne kose.
- **»Pada, torej se konča.«** Količina, ki pada, a je lahko poljubno realno število, lahko pada v nedogled ($1$; $0{,}5$; $0{,}25$; …). Monovarianta mora biti nenegativno celo število ali imeti le končno mnogo vrednosti.

## Povzetek

- Invarianta je količina ali lastnost, ki je nobena dovoljena poteza ne spremeni. Če se na začetku in na cilju razlikuje, cilj ni dosegljiv.
- Ujemanje invariante je le potreben pogoj; dosegljivost pokažeš s konstrukcijo.
- Pogoste invariante: parnost vsote, ostanek pri deljenju s $3$ ali $4$, razlika števila polj dveh barv pri barvanju.
- Barvanje izberi tako, da vsak kos pokrije enako število polj vsake barve, na tleh pa barve niso enako zastopane: šahovsko za $1 \times 2$, ostanki $i + j$ pri deljenju s $4$ za $1 \times 4$.
- Monovarianta se pri vsaki potezi spremeni v isto smer. Če je nenegativno celo število z začetno vrednostjo $M$, se postopek konča po največ $M$ potezah.
- Število inverzij je monovarianta pri menjavah sosednjih elementov: vsaka zamenjava ga zmanjša za natanko $1$.

## Drugače: Na sliki

Ena vrstica tal iz Primera 3 (vrstica $i = 1$). V vsakem kvadratu je njegova barva, ostanek $1 + j$ pri deljenju s $4$:

:::risba skica
opis: Vrstica desetih kvadratov. V kvadratih so po vrsti zapisane barve 2, 3, 0, 1, 2, 3, 0, 1, 2, 3. Odebeljen pravokotnik, ploščica 1 × 4, pokriva tretji do šesti kvadrat z barvami 0, 1, 2, 3.
območje: 0; 0 .. 10; 3
enota: 30
pravokotnik: 0; 1 .. 1; 2 | siva
pravokotnik: 1; 1 .. 2; 2 | siva
pravokotnik: 2; 1 .. 3; 2 | siva
pravokotnik: 3; 1 .. 4; 2 | siva
pravokotnik: 4; 1 .. 5; 2 | siva
pravokotnik: 5; 1 .. 6; 2 | siva
pravokotnik: 6; 1 .. 7; 2 | siva
pravokotnik: 7; 1 .. 8; 2 | siva
pravokotnik: 8; 1 .. 9; 2 | siva
pravokotnik: 9; 1 .. 10; 2 | siva
napis: 0,5; 1,5 | 2 | sredina
napis: 1,5; 1,5 | 3 | sredina
napis: 2,5; 1,5 | 0 | sredina
napis: 3,5; 1,5 | 1 | sredina
napis: 4,5; 1,5 | 2 | sredina
napis: 5,5; 1,5 | 3 | sredina
napis: 6,5; 1,5 | 0 | sredina
napis: 7,5; 1,5 | 1 | sredina
napis: 8,5; 1,5 | 2 | sredina
napis: 9,5; 1,5 | 3 | sredina
pravokotnik: 2; 0,85 .. 6; 2,15 | oranžna debelo
napis: 4; 0,4 | ploščica 1 × 4 | sredina | oranžna
:::

Barve se ponavljajo v krogu $0, 1, 2, 3$. Kamorkoli v vrstici položiš ploščico, pokrije štiri zaporedne kvadrate in zato vsako barvo enkrat. V stolpcu je enako, saj se tam spreminja $i$ namesto $j$. Ker na tleh ni enako mnogo kvadratov vseh štirih barv, jih ploščice ne morejo pokriti.

## Drugače: Iz vsakdanjega življenja

**Menjalno stikalo.** Na hodniku sta dve stikali za isto luč. Vsak preklop luč prižge ali ugasne. Če je bila zjutraj ugasnjena in je bilo čez dan $15$ preklopov, zvečer gori, kdor koli je preklapljal. Odloča le parnost števila preklopov.

**Pospravljanje delavnice.** Vsak večer pospraviš vsaj eno orodje s tal na polico, novega na tla ne odlagaš. Število orodij na tleh je celo, nenegativno in vsak večer manjše. Če jih je danes $14$, bodo tla čista najkasneje čez $14$ večerov. To je monovarianta.

## Preveri se

? Količina $Q$ se pri vsaki potezi postopka zmanjša. Kaj še mora veljati, da se postopek zagotovo konča?
- Nič, padanje je dovolj.
~ Realno število lahko pada v nedogled: $1$; $0{,}5$; $0{,}25$; … Postopek se tedaj ne konča.
+ $Q$ je ves čas nenegativno celo število.
- $Q$ se mora zmanjšati vsaj za $2$.
~ Velikost koraka ni bistvena. Celo število pade vsaj za $1$, kar že zadostuje, če $Q$ ne more postati negativen.
> Nenegativno celo število z začetno vrednostjo $M$ lahko strogo pade največ $M$-krat, zato se postopek ustavi.

? Na tleh $4 \times 4$ sta zasedeni dve polji, označeni z ×. Ali lahko preostala polja pokrijemo s ploščicami $1 \times 2$?
:::risba skica
opis: Tla 4 × 4 polja, pobarvana šahovsko. V vsakem polju je črka B za belo ali Č za črno. Prva vrstica od leve: ×, Č, B, Č. Druga vrstica: Č, ×, Č, B. Tretja vrstica: B, Č, B, Č. Četrta vrstica: Č, B, Č, B. Zasedeni polji z oznako × sta zgoraj levo in drugo polje v drugi vrstici; obe bi bili beli.
območje: 0; 0 .. 4; 4
enota: 45
mreža: da
pravokotnik: 1; 3 .. 2; 4 | siva ozadje
pravokotnik: 3; 3 .. 4; 4 | siva ozadje
pravokotnik: 0; 2 .. 1; 3 | siva ozadje
pravokotnik: 2; 2 .. 3; 3 | siva ozadje
pravokotnik: 1; 1 .. 2; 2 | siva ozadje
pravokotnik: 3; 1 .. 4; 2 | siva ozadje
pravokotnik: 0; 0 .. 1; 1 | siva ozadje
pravokotnik: 2; 0 .. 3; 1 | siva ozadje
napis: 0,5; 3,5 | × | sredina | debelo
napis: 1,5; 3,5 | Č | sredina
napis: 2,5; 3,5 | B | sredina
napis: 3,5; 3,5 | Č | sredina
napis: 0,5; 2,5 | Č | sredina
napis: 1,5; 2,5 | × | sredina | debelo
napis: 2,5; 2,5 | Č | sredina
napis: 3,5; 2,5 | B | sredina
napis: 0,5; 1,5 | B | sredina
napis: 1,5; 1,5 | Č | sredina
napis: 2,5; 1,5 | B | sredina
napis: 3,5; 1,5 | Č | sredina
napis: 0,5; 0,5 | Č | sredina
napis: 1,5; 0,5 | B | sredina
napis: 2,5; 0,5 | Č | sredina
napis: 3,5; 0,5 | B | sredina
:::
- Da, ker ostane $14$ polj, kar je sodo število.
~ Sodo število polj je potrebno, a ne zadošča. Preštej še barve.
- Da, če ploščice postavimo tudi pokončno.
~ Tudi pokončna ploščica pokrije eno belo in eno črno polje. Obračanje ne pomaga.
+ Ne, ker ostane $6$ belih in $8$ črnih polj.
> Obe zasedeni polji sta beli. Ostane $6$ belih in $8$ črnih polj, vsaka ploščica pa pokrije eno belo in eno črno, zato pokritje ni mogoče.

? Mizar ima $100$ dlet v ravno obratnem vrstnem redu (najširše skrajno levo). Vsaka zamenjava dveh sosednjih dlet v napačnem vrstnem redu mu vzame $3$ sekunde. Približno koliko minut bo urejal?
= 247,5 min | 1
~ 495 | Število parov je $\frac{100 \cdot 99}{2}$: pozabil si deliti z $2$.
~ 5 | Ni ena zamenjava na dleto. Šteje število parov v napačnem vrstnem redu.
~ 14850 | To so sekunde. Deli s $60$.
> V obratnem vrstnem redu je vsak par inverzija: $\frac{100 \cdot 99}{2} = 4950$ inverzij. Vsaka zamenjava jih odpravi natanko eno, zato je $4950 \cdot 3 = 14850$ sekund, kar je $247{,}5$ minute.

? Na tabli so števila $1, 2, \dots, n$. Poteza: zbrišeš $a$ in $b$ in zapišeš $|a - b|$. Za katero najmanjše število $n > 10$ je lahko zadnje število $0$?
= 11
~ 12 | Ne gre za parnost števila $n$, ampak za parnost vsote $1 + 2 + \dots + n$. Pri $n = 11$ je vsota že soda.
> Zadnje število ima parnost vsote $\frac{n(n+1)}{2}$, zato mora biti vsota soda. Pri $n = 11$ je vsota $66$. Ničla je res dosegljiva: pari $(2, 3)$, $(4, 5)$, …, $(10, 11)$ dajo pet enic, skupaj z $1$ je to šest enic, te dajo tri ničle, ničle pa ničlo.

? Skakač na šahovnici skače v obliki črke L ($2$ polji v eno smer in $1$ v pravokotno). Ali se lahko po natanko $25$ skokih vrne na začetno polje?
- Da, če je šahovnica dovolj velika.
~ Velikost šahovnice ne spremeni barve, na katero skakač pristane. Odloča parnost števila skokov.
- Ne vemo, treba bi bilo preizkusiti vse poti.
~ Preizkušanje ni potrebno: invarianta odgovori za vse poti hkrati.
+ Ne, ker vsak skok zamenja barvo polja, po lihem številu skokov pa skakač stoji na drugi barvi.
> Skok premakne skakača za $2 + 1 = 3$ polja, zato se vsota številk vrstice in stolpca spremeni za liho število in barva se zamenja. Po $25$ skokih je barva druga kot na začetku.

<<RACUN
vrednost: 8*8-2 | 62
vrednost: 62/2 | 31
vrednost: 32-30 | 2
vrednost: 10*11/2 | 55
vrednost: 2+0+3+0+1+0 | 6
vrednost: 100/4 | 25
vrednost: 10*2 | 20
vrednost: 20+5 | 25
vrednost: 20+6 | 26
vrednost: 20+4 | 24
vrednost: 25+24+25+26 | 100
vrednost: 13+15+17 | 45
vrednost: 17-13 | 4
vrednost: 100*99/2 | 4950
vrednost: 4950*3/60 | 247.5
vrednost: 100*99*3/60 | 495
vrednost: 100*3/60 | 5
vrednost: 11*12/2 | 66
vrednost: 8-2 | 6
>>

:::simboli
k | število potez | | | $k \le M$
a, b | števili, ki ju zbrišemo | | |
I | število inverzij | | | pada za $1$ na zamenjavo
i | številka vrstice | | |
j | številka stolpca | | |
M | začetna vrednost monovariante | | | nenegativno celo število
:::
