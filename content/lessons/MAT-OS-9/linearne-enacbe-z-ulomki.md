---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Varčuješ za teleskop, s katerim bi videl Saturnove obroče. Polovico cene si že prihranil. Tretjino ti je obljubila babica. Manjka ti še $40\,€$. Koliko stane teleskop?

Ceno označimo z $x$. Polovica cene, tretjina cene in $40\,€$ skupaj dajo celo ceno:

$$\frac{x}{2}+\frac{x}{3}+40=x$$

To je linearna enačba, le da so v njej ulomki. Linearne enačbe že znaš reševati: člene z $x$ spraviš na eno stran, števila na drugo in deliš. Z ulomki pa je računanje dolgo in hitro se zmotiš. Zato ulomke najprej **odpravimo**: enačbo pomnožimo s primernim številom, da ostanejo samo cela števila. Na koncu rezultat še **preizkusimo** v prvotni enačbi.

Podobne enačbe dobiš pri vseh nalogah z deleži: »tretjina poti«, »četrtina zneska«, »polovica zalog«.

## Razlaga

**1. Ekvivalentna enačba.** Enačbi, ki imata natanko iste rešitve, sta **ekvivalentni** (enakovredni). Če obe strani enačbe pomnožimo z istim številom, ki ni $0$, dobimo ekvivalentno enačbo. Enačba $\dfrac{x}{2}=4$ ima rešitev $8$. Ko obe strani pomnožimo z $2$, dobimo $x=8$: rešitev je ista.

*Hitro preverjanje:* ima enačba $10x=30$ isto rešitev kot $x=3$? *(Da: prva je druga, pomnožena z $10$.)*

**2. Najmanjši skupni večkratnik imenovalcev.** Iščemo število, ki je deljivo z vsemi imenovalci. Vzamemo najmanjše tako število, **najmanjši skupni večkratnik**. Za imenovalca $2$ in $3$ v enačbi s teleskopom je to $6$. Za imenovalce $2$, $3$ in $4$ je to $12$. Deloval bi tudi večji skupni večkratnik, na primer $24$, a bi dobili večja števila.

*Hitro preverjanje:* kateri je najmanjši skupni večkratnik imenovalcev $4$ in $6$? *(To je $12$, ne $24$: tudi $12$ je deljivo s $4$ in s $6$.)*

**3. Vsak člen.** Z izbranim številom pomnožimo **vsak člen** na obeh straneh, tudi tistega brez ulomka. Tabela kaže, kaj nastane pri množenju z $12$:

| Člen | Pomnožen z $12$ | Po krajšanju |
|---|---|---|
| $\dfrac{x}{4}$ | $12\cdot\dfrac{x}{4}$ | $3x$ |
| $\dfrac{x+1}{3}$ | $12\cdot\dfrac{x+1}{3}$ | $4(x+1)$ |
| $5$ | $12\cdot 5$ | $60$ |

Ulomek izgine, ker se imenovalec pokrajša z izbranim številom. Člen brez ulomka se le poveča.

:::premisli
Matic je enačbo $\dfrac{x}{2}+3=5$ pomnožil z $2$ in dobil $x+3=5$, torej $x=2$. Ali je $2$ res rešitev prvotne enačbe? Preden pogledaš, vstavi $2$ in poišči, kje se je Matic zmotil.
---
Ni. Pri $x=2$ je leva stran $\dfrac{2}{2}+3=4$, ne $5$. Matic je pozabil pomnožiti člena $3$ in $5$. Pravilno je $x+6=10$, torej $x=4$; preizkus: $\dfrac{4}{2}+3=5$.
:::

**4. Števec z vsoto ali razliko gre v oklepaj.** Kadar je števec vsota ali razlika (na primer $\dfrac{x-2}{6}$), ga pri krajšanju zapišemo v **oklepaj**. Iz $12\cdot\dfrac{x-2}{6}$ dobimo $2(x-2)$, nato oklepaj odpravimo: $2x-4$. Oklepaj je posebej pomemben, kadar je pred ulomkom minus. Takrat minus spremeni predznak **vsakemu** členu v oklepaju: $-2(x-2)=-2x+4$.

*Hitro preverjanje:* kaj nastane iz $-6\cdot\dfrac{x+1}{3}$? *(Nastane $-2(x+1)=-2x-2$.)*

**5. Preizkus.** Rešitev vstavimo v **prvotno** enačbo, tisto z ulomki. Izračunamo levo in desno stran posebej. Če sta enaki, je rešitev pravilna. Za teleskop: množimo s $6$, dobimo $3x+2x+240=6x$, torej $5x+240=6x$ in $x=240$. Preizkus: $\dfrac{240}{2}+\dfrac{240}{3}+40=120+80+40=240$. Teleskop stane $240\,€$.

:::premisli
Zakaj rešitev preizkusimo v prvotni enačbi z ulomki in ne v enačbi, ki smo jo dobili po množenju?
---
Če smo se zmotili prav pri množenju (na primer pozabili člen ali predznak), je nova enačba napačna. Naša rešitev ji ustreza, prvotni pa ne. Napako odkrije samo preizkus v prvotni enačbi.
:::

**Postopek na kratko:**

1. Poišči najmanjši skupni večkratnik vseh imenovalcev.
2. Z njim pomnoži **vsak člen** na obeh straneh.
3. Pokrajšaj; števce z vsoto ali razliko zapiši v oklepaj.
4. Odpravi oklepaje in pazi na predznak.
5. Reši dobljeno linearno enačbo: združi člene z $x$, združi števila, deli.
6. Naredi preizkus v prvotni enačbi.

V simulaciji spodaj (Enačbe z ulomki) najprej z drsnikom »preizkusi x« poišči vrednost, pri kateri je tehtnica v ravnovesju. Nato pritisni »pomnoži obe strani z imenovalcem« in opazuj, da ostane ravnovesje pri istem $x$, ulomkov pa ni več.

## Rešeni primeri

### Primer 1 (lažji)

Reši enačbo $\dfrac{x}{3}+\dfrac{x}{2}=5$ in naredi preizkus.

**Podatki:** enačba $\dfrac{x}{3}+\dfrac{x}{2}=5$; imenovalca $3$ in $2$
**Iščemo:** neznanko $x$ in preizkus

:::formula
Vsak člen pomnožimo z najmanjšim skupnim večkratnikom imenovalcev.
:::

**Rešitev:**

1. Najmanjši skupni večkratnik števil $3$ in $2$ je $6$, ker je to najmanjše število, deljivo z obema.
2. Vsak člen pomnožimo s $6$, da dobimo ekvivalentno enačbo brez ulomkov:
$$6\cdot\frac{x}{3}+6\cdot\frac{x}{2}=6\cdot 5$$
3. Pokrajšamo: $2x+3x=30$.
4. Združimo člene z $x$: $5x=30$.
5. Delimo s $5$, da ostane $x$ sam: $x=6$.
6. Preizkus: leva stran je $\dfrac{6}{3}+\dfrac{6}{2}=2+3=5$, desna stran je $5$. Strani sta enaki.
7. Odgovor: rešitev enačbe je $x=6$.

### Primer 2

Reši enačbo $\dfrac{x+1}{2}-\dfrac{2x-1}{3}=1$ in naredi preizkus.

**Podatki:** enačba $\dfrac{x+1}{2}-\dfrac{2x-1}{3}=1$; imenovalca $2$ in $3$; pred drugim ulomkom je minus
**Iščemo:** neznanko $x$ in preizkus

:::formula
Pomnoži vsak člen z najmanjšim skupnim večkratnikom; števce zapiši v oklepaj; minus pred oklepajem spremeni predznak vsem členom v oklepaju.
:::

**Rešitev:**

1. Najmanjši skupni večkratnik števil $2$ in $3$ je $6$.
2. Vsak člen pomnožimo s $6$, tudi $1$ na desni:
$$6\cdot\frac{x+1}{2}-6\cdot\frac{2x-1}{3}=6\cdot 1$$
3. Pokrajšamo in števce zapišemo v oklepaj, ker sta vsoti oziroma razliki: $3(x+1)-2(2x-1)=6$.
4. Odpravimo oklepaje. Pred drugim oklepajem je $-2$, zato se predznak spremeni obema členoma v njem: $3x+3-4x+2=6$.
5. Združimo: $-x+5=6$, torej $-x=1$ in $x=-1$.
6. Preizkus: leva stran je $\dfrac{-1+1}{2}-\dfrac{2\cdot(-1)-1}{3}=\dfrac{0}{2}-\dfrac{-3}{3}=0-(-1)=1$, desna stran je $1$. Strani sta enaki.
7. Odgovor: rešitev enačbe je $x=-1$.

### Primer 3 (težji): pot vesoljske sonde

Vesoljska sonda je v prvem letu preletela tretjino poti do cilja, v drugem letu dve petini poti. Do cilja ji je ostalo še $120$ milijonov kilometrov. Kako dolga je vsa pot?

**Podatki:** prvo leto $\dfrac{1}{3}$ poti; drugo leto $\dfrac{2}{5}$ poti; ostanek $120$ milijonov km
**Iščemo:** dolžino vse poti $x$ (v milijonih km)

:::formula
Prvi del, drugi del in ostanek skupaj dajo vso pot: $\dfrac{x}{3}+\dfrac{2x}{5}+120=x$
:::

**Rešitev:**

1. Zapišemo enačbo, ker deli skupaj dajo celoto: $\dfrac{x}{3}+\dfrac{2x}{5}+120=x$.
2. Najmanjši skupni večkratnik števil $3$ in $5$ je $15$.
3. Vsak člen pomnožimo s $15$, tudi $120$ in $x$ na desni: $5x+6x+1800=15x$.
4. Združimo: $11x+1800=15x$.
5. Odštejemo $11x$ na obeh straneh, da so členi z $x$ samo na eni strani: $1800=4x$.
6. Delimo s $4$: $x=450$.
7. Preizkus: $\dfrac{450}{3}=150$, $\dfrac{2\cdot 450}{5}=180$ in $150+180+120=450$. Deli se res seštejejo v vso pot.
8. Odgovor: vsa pot sonde je dolga $450$ milijonov kilometrov.

### Primer 4 – zdaj ti

Reši enačbo $\dfrac{3x-1}{4}-\dfrac{x-2}{6}=\dfrac{x}{2}+\dfrac{1}{3}$.

**Podatki:** enačba $\dfrac{3x-1}{4}-\dfrac{x-2}{6}=\dfrac{x}{2}+\dfrac{1}{3}$; imenovalci $4$, $6$, $2$ in $3$
**Iščemo:** neznanko $x$ in preizkus

:::formula
Vsak člen pomnožimo z najmanjšim skupnim večkratnikom imenovalcev; števce z razliko zapišemo v oklepaj.
:::

**Rešitev:**

1. Najmanjši skupni večkratnik števil $4$, $6$, $2$ in $3$ je $12$.
2. Vsak člen pomnožimo z $12$ in pokrajšamo: $3(3x-1)-2(x-2)=6x+4$.
3. Odpravimo oklepaje; minus pred drugim oklepajem spremeni oba predznaka: $9x-3-2x+4=6x+4$.
4. Poenostavimo levo stran: $7x+1=6x+4$.
5. Dokončaj sam: člene z $x$ spravi na levo, števila na desno, nato naredi preizkus.

:::premisli
Kolikšen je $x$? Ali se strani pri preizkusu ujemata?
---
$7x-6x=4-1$, torej $x=3$. Preizkus: leva stran je $\dfrac{3\cdot 3-1}{4}-\dfrac{3-2}{6}=2-\dfrac{1}{6}=\dfrac{11}{6}$, desna stran je $\dfrac{3}{2}+\dfrac{1}{3}=\dfrac{9}{6}+\dfrac{2}{6}=\dfrac{11}{6}$. Strani sta enaki.
:::

## Pogoste napake

- **Pozabljen člen brez ulomka.** Učenec misli: »Množim zato, da odpravim ulomke, zato množim samo ulomke.« Pri $\dfrac{x}{2}+3=5$ tako dobi $x+3=5$. To ni ekvivalentna enačba, ker leva in desna stran nista pomnoženi celi. Pravilno: z $2$ pomnoži tudi $3$ in $5$, torej $x+6=10$.
- **Minus pred ulomkom.** Učenec iz $-\dfrac{x-2}{6}$ pri množenju s $6$ zapiše $-x-2$. Minus pa velja za cel števec, ne le za $x$. Pravilno: $-(x-2)=-x+2$. Zato števec vedno najprej zapiši v oklepaj.
- **Napačno krajšanje.** Učenec iz $12\cdot\dfrac{3x-1}{4}$ zapiše $3\cdot 3x-1=9x-1$. S $3$ pa je treba pomnožiti cel števec. Pravilno: $3(3x-1)=9x-3$.
- **Množenje samo ene strani.** Učenec pomnoži levo stran s $6$, desno pusti. Tehtnica ni več v ravnovesju: z istim številom moraš pomnožiti **obe** strani.
- **Preskočen preizkus.** Učenec misli: »Postopek sem znal, rezultat je gotovo prav.« Napaka v predznaku pa se pokaže šele, ko rešitev vstaviš v prvotno enačbo in strani nista enaki.

## Povzetek

- Ulomke odpravimo tako, da enačbo pomnožimo z najmanjšim skupnim večkratnikom imenovalcev.
- Pomnožiti je treba **vsak člen** na obeh straneh.
- Števce z vsoto ali razliko zapišemo v oklepaj, nato pazimo na predznak.
- Dobimo navadno linearno enačbo, ki jo rešimo na znani način.
- Rešitev vedno preizkusimo v prvotni enačbi.

## Drugače: Na sliki

Ceno teleskopa narišemo kot trak. Razdelimo ga na $6$ enakih delov, ker je $6$ najmanjši skupni večkratnik imenovalcev $2$ in $3$.

:::risba skica
opis: Trak predstavlja ceno teleskopa x in je razdeljen na 6 enakih delov. Prvi trije deli so polovica cene, naslednja dva dela sta tretjina cene, zadnji del je 40 evrov.
območje: 0; 0 .. 12; 4
enota: 24
pravokotnik: 0; 1 .. 6; 2,5 | modra ozadje
pravokotnik: 6; 1 .. 10; 2,5 | oranžna ozadje
pravokotnik: 10; 1 .. 12; 2,5 | zelena ozadje
črta: 2; 1 -> 2; 2,5 | siva črtkano
črta: 4; 1 -> 4; 2,5 | siva črtkano
črta: 8; 1 -> 8; 2,5 | siva črtkano
napis: 3; 1,75 | polovica | sredina
napis: 8; 1,75 | tretjina | sredina
napis: 11; 1,75 | 40 € | sredina
črta: 0; 3,1 -> 12; 3,1 | siva
napis: 6; 3,6 | cena x | sredina
napis: 6; 0,4 | 6 enakih delov | sredina
:::

Polovica so $3$ deli, tretjina $2$ dela. Ostane natanko $1$ del, ki je vreden $40\,€$. Ves trak ima $6$ delov, torej je cena $6\cdot 40=240\,€$.

Množenje enačbe s $6$ naredi isto: namesto »polovice« in »tretjine« šteješ cele dele, $3x+2x+240=6x$. Tehtnica v simulaciji spodaj kaže še drugo plat: ko vsebino obeh skodelic povečaš enako mnogokrat, ostane tehtnica v ravnovesju.

## Drugače: Bolj natančno

Zakaj množenje enačbe ne spremeni rešitev? Če je $A=B$, je tudi $k\cdot A=k\cdot B$ za vsako število $k$. Če je $k\neq 0$, velja tudi obratno: iz $kA=kB$ delimo s $k$ in dobimo $A=B$. Zato imata prvotna in nova enačba natanko iste rešitve. Pogoj $k\neq 0$ je pomemben: z $0$ bi dobili $0=0$, kar velja za vsak $x$, in izgubili bi vso informacijo.

Zakaj mora biti pomnožen vsak člen? Leva stran je en izraz, sestavljen iz več členov. Množenje izraza $\dfrac{x}{3}+\dfrac{x}{2}$ s $6$ je množenje vsote, zato po zakonu o razčlenjevanju (distributivnosti) pomnožimo vsak člen:

$$6\left(\frac{x}{3}+\frac{x}{2}\right)=6\cdot\frac{x}{3}+6\cdot\frac{x}{2}=2x+3x$$

Zakaj najmanjši skupni večkratnik? Vsak skupni večkratnik odpravi ulomke, ker se z njim pokrajša vsak imenovalec. Najmanjši da najmanjša števila in s tem najmanj priložnosti za računsko napako.

Preizkus je kontrola celotnega postopka. Če smo kje naredili napako, bo vstavitev rešitve v prvotno enačbo dala neenaki strani.

## Preveri se

? Kateri zapis v tabeli je enačba $\dfrac{x}{2}+\dfrac{2}{3}=\dfrac{5}{6}$, pravilno pomnožena s $6$?

| Zapis | Enačba |
|---|---|
| A | $3x+2=5$ |
| B | $3x+4=\dfrac{5}{6}$ |
| C | $3x+4=5$ |

- A
~ Pri členu $\dfrac{2}{3}$ si $6$ le delil s $3$ in pozabil še pomnožiti s števcem $2$: $6\cdot\dfrac{2}{3}=2\cdot 2=4$.
- B
~ Desna stran je ostala nepomnožena. Z istim številom je treba pomnožiti vsak člen na obeh straneh.
+ C
> $6\cdot\dfrac{x}{2}=3x$, $6\cdot\dfrac{2}{3}=4$ in $6\cdot\dfrac{5}{6}=5$, torej $3x+4=5$.

? Brez natančnega računanja oceni: kateremu številu je enaka rešitev enačbe $\dfrac{x}{3}+\dfrac{x}{4}=7$?
- približno $2$
~ Tretjina in četrtina števila $2$ bi dali le približno $1$. Za vsoto $7$ mora biti $x$ veliko večji.
+ $12$
- približno $50$
~ Tretjina od $50$ je že več kot $16$, kar je več od $7$. To število je preveliko.
> Tretjina in četrtina skupaj sta malo več kot polovica števila. Polovica števila je malo manj kot $7$, torej je $x$ malo manj kot $14$. Natančno: množimo z $12$, $4x+3x=84$, $7x=84$, $x=12$; preizkus $4+3=7$.

? Zakaj moramo pri enačbi $\dfrac{x}{2}+3=5$ z $2$ pomnožiti tudi števili $3$ in $5$?
- Ker je tako lažje računati.
~ Ne gre za lažje računanje. Če ju ne pomnožiš, dobiš enačbo z drugo rešitvijo.
+ Ker moramo z istim številom pomnožiti obe celi strani, sicer nova enačba nima iste rešitve.
- Ni treba, ker v teh dveh členih ni ulomka.
~ Člen brez ulomka je še vedno del strani. Množimo celo stran, ne samo ulomkov.
> Z $2$ pomnožimo vsak člen: $x+6=10$, $x=4$. Če $3$ in $5$ ne pomnožiš, dobiš $x+3=5$ in napačni $x=2$.

? Nika je enačbo pomnožila s $6$ in dobila $3x-2(x-1)=12$. Katero enačbo je imela na začetku?
+ $\dfrac{x}{2}-\dfrac{x-1}{3}=2$
- $\dfrac{x}{2}-\dfrac{x-1}{3}=12$
~ Pozabil si, da je bila s $6$ pomnožena tudi desna stran. Ta enačba bi dala desno $72$.
- $\dfrac{x}{3}-\dfrac{x-1}{2}=2$
~ Imenovalca sta zamenjana: $6\cdot\dfrac{x}{3}=2x$, ne $3x$.
> $6\cdot\dfrac{x}{2}=3x$, $6\cdot\dfrac{x-1}{3}=2(x-1)$ in $6\cdot 2=12$.

? Na vesoljski postaji porabijo polovico zaloge vode za pitje in hrano, tretjino za umivanje, preostalih $30$ litrov je rezerva. Koliko litrov vode je v zalogi?
- $30$ litrov
~ Pri množenju s $6$ si pozabil pomnožiti člen $30$: iz $3x+2x+30=6x$ dobiš napačni $x=30$.
- $36$ litrov
~ Število $30$ si vzel kot porabljenih pet šestin. Teh $30$ litrov pa je preostala šestina.
+ $180$ litrov
> $\dfrac{x}{2}+\dfrac{x}{3}+30=x$; množimo s $6$: $3x+2x+180=6x$, torej $x=180$. Preizkus: $90+60+30=180$.

:::simboli
x | neznanka | |
:::
