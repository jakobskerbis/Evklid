---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Astronomski krožek na šolskem igrišču čaka Mednarodno vesoljsko postajo (ISS). Na večernem nebu se pokaže kot svetla pika, ki enakomerno drsi mimo zvezd. Pet učencev s štoparicami na telefonih meri, koliko časa potrebuje od vrha dimnika do zvonika. Dobijo pet različnih časov.

Žan je prepričan: »Če bi vsi merili pravilno, bi dobili isto število. Ena meritev je prava, drugi ste se zmotili. Moja je prava, ker sem najhitrejši.«

Ima Žan prav? In katero število naj krožek zapiše v dnevnik opazovanj? Odgovor potrebuje vsak, ki meri: astronom, ki meri lego planeta, zdravnik, ki meri tlak, in ti, ko pri vaji meriš dolžino nihala.

## Razlaga

**Kaj so izmerili.** Vsi so merili isti prelet, torej isti čas. Rezultati:

| Učenec | Čas $t$ [s] | Odmik od $42{,}1\,\text{s}$ [s] |
|---|---|---|
| Ana | $41{,}8$ | $-0{,}3$ |
| Žan | $42{,}4$ | $+0{,}3$ |
| Maja | $42{,}1$ | $0$ |
| Tim | $41{,}6$ | $-0{,}5$ |
| Lea | $42{,}6$ | $+0{,}5$ |

Tretji stolpec pove, za koliko je vsak čas nad ali pod $42{,}1\,\text{s}$; od kod ta številka, izveš malo niže. Najprej opazi tri stvari. Vse meritve so blizu $42\,\text{s}$, nobena ni zelo daleč. Nekatere so nad sredino, nekatere pod njo. Odmiki navzgor in navzdol so si podobni po velikosti; če jih seštejemo, dobimo $0$.

**Zakaj se meritve razlikujejo.** Nihče se ni »zmotil«. Razlika med izmerjeno in pravo vrednostjo je **merska napaka**. Ima jo vsaka meritev, tudi tvoja. Pri štoparici nastane takole: vsak pritisne malo prej ali malo pozneje, ker človek potrebuje čas, da opazi pikico ob dimniku in premakne prst. Enkrat pohiti, drugič zamudi. Taki napaki rečemo **naključna napaka**: pri vsaki meritvi je drugačna, enkrat poveča rezultat, drugič ga zmanjša.

:::premisli
Žan trdi, da je prava njegova meritev, $42{,}4\,\text{s}$. S čim bi jo moral primerjati, da bi to dokazal? Ali to sploh lahko stori?
---
Prave vrednosti nihče ne pozna, saj tudi Žanova štoparica in njegov prst nista popolna. Njegovih $42{,}4\,\text{s}$ je le ena od petih enakovrednih meritev, ki so vse razpršene okoli neke sredine.
:::

**Povprečje.** Ker se napake navzgor in navzdol večinoma izničijo, je najboljši približek prave vrednosti sredina vseh meritev. Imenujemo jo **povprečje** in jo označimo z $\bar{t}$ (beri »t s črtico«). Vse meritve seštejemo in vsoto delimo s številom meritev $n$:

$$\bar{t} = \frac{t_1 + t_2 + \dots + t_n}{n}$$

Za krožek: $\bar{t} = \dfrac{210{,}5\,\text{s}}{5} = 42{,}1\,\text{s}$.

**Slika na številski premici.** Meritve narišemo kot pike:

```
  Tim   Ana      Maja     Žan   Lea
  41,6  41,8     42,1     42,4  42,6
───•─────•────────•────────•─────•──── t [s]
                  ↑
             povprečje
```

Pike se gnetejo okoli povprečja. Najbolj oddaljeni sta Tim in Lea, oba za $0{,}5\,\text{s}$.

**Absolutna napaka.** Največji odmik od povprečja imenujemo **absolutna napaka** in jo označimo z $\Delta t$ (beri »delta t«). Pove, kako daleč od povprečja je lahko prava vrednost. Tu je $\Delta t = 0{,}5\,\text{s}$. Rezultat zapišemo kot povprečje $\pm$ absolutna napaka:

$$t = (42{,}1 \pm 0{,}5)\,\text{s}$$

To pomeni: prava vrednost je najverjetneje nekje med $41{,}6\,\text{s}$ in $42{,}6\,\text{s}$.

**Več meritev, zanesljivejše povprečje.** Ena sama meritev je lahko po naključju daleč od prave vrednosti. Pri petih meritvah se ena prehitra in ena prepozna med sabo poravnata. Zato v fiziki meritev vedno ponovimo.

:::premisli
Krožek doda še šesto meritev, $42{,}1\,\text{s}$. Kako se spremeni povprečje? Napovej brez računanja.
---
Ostane $42{,}1\,\text{s}$. Nova meritev je enaka povprečju, zato sredine ne premakne ne navzgor ne navzdol.
:::

**Česar povprečje ne popravi.** Če bi vsi učenci štoparico vedno ustavljali prepozno, ker čakajo na Žanov klic »zdaj!«, bi bili vsi časi predolgi. Taka **sistematična napaka** vse meritve premakne v isto smer, zato je povprečje ne izniči. Odkriješ jo le, če spremeniš način merjenja. Še tretja vrsta je **groba napaka**: nekdo pozabi pritisniti in dobi $63\,\text{s}$. Tako meritev, ki močno odstopa od vseh drugih, izločimo, preden računamo povprečje.

**Natančnost merila.** Kot že veš, instrumenta ne moreš odčitati natančneje od njegovega najmanjšega razdelka. Zato povprečje zaokrožimo na toliko decimalk, kot jih imajo meritve (največ eno več). Če kalkulator pokaže $42{,}133\ldots\,\text{s}$, zapišemo $42{,}1\,\text{s}$.

V simulaciji spodaj (»Merjenje in merska napaka«) izberi ravnilo s centimetri in klikni »Izmeri 5-krat« dvakrat. Nato ponovi z ravnilom z milimetri. Opazuj, kako širok je modri pas okoli povprečja: pri natančnejšem merilu je ožji.

## Rešeni primeri

### Primer 1: premer Jupitra na fotografiji

Štirje učenci z ravnilom izmerijo premer Jupitra na fotografiji iz šolskega teleskopa. Dobijo $24\,\text{mm}$, $25\,\text{mm}$, $23\,\text{mm}$ in $24\,\text{mm}$. Kolikšno je povprečje?

**Podatki:** $d_1 = 24\,\text{mm}$, $d_2 = 25\,\text{mm}$, $d_3 = 23\,\text{mm}$, $d_4 = 24\,\text{mm}$, $n = 4$
**Iščemo:** povprečni premer $\bar{d}$

:::formula
$\bar{d} = \dfrac{d_1 + d_2 + d_3 + d_4}{n}$
:::

**Rešitev:**

1. Seštejemo vse meritve: $24 + 25 + 23 + 24 = 96$, torej $96\,\text{mm}$.
2. Vsoto delimo s številom meritev, ker iščemo sredino: $\dfrac{96}{4} = 24$, torej $24\,\text{mm}$.
3. Odgovor: povprečni premer Jupitra na fotografiji je $24\,\text{mm}$.

### Primer 2: sled meteorja z absolutno napako

Na fotografiji nočnega neba je svetla črta, sled meteorja (utrinka). Pet učencev izmeri njeno dolžino: $6{,}4\,\text{cm}$; $6{,}7\,\text{cm}$; $6{,}5\,\text{cm}$; $6{,}6\,\text{cm}$ in $6{,}3\,\text{cm}$. Zapiši rezultat s povprečjem in absolutno napako.

**Podatki:** $l_1 = 6{,}4\,\text{cm}$, $l_2 = 6{,}7\,\text{cm}$, $l_3 = 6{,}5\,\text{cm}$, $l_4 = 6{,}6\,\text{cm}$, $l_5 = 6{,}3\,\text{cm}$, $n = 5$
**Iščemo:** povprečje $\bar{l}$, absolutno napako $\Delta l$ in zapis rezultata

:::formula
$\bar{l} = \dfrac{l_1 + l_2 + \dots + l_5}{n}$, $\Delta l$ = največji odmik od $\bar{l}$, rezultat $l = (\bar{l} \pm \Delta l)$
:::

**Rešitev:**

1. Vsota: $6{,}4 + 6{,}7 + 6{,}5 + 6{,}6 + 6{,}3 = 32{,}5$, torej $32{,}5\,\text{cm}$.
2. Povprečje: $\dfrac{32{,}5}{5} = 6{,}5$, torej $\bar{l} = 6{,}5\,\text{cm}$.
3. Odmiki od povprečja so $-0{,}1$; $+0{,}2$; $0$; $+0{,}1$ in $-0{,}2\,\text{cm}$. Gledamo velikost odmika, ne predznaka.
4. Največji odmik je $0{,}2\,\text{cm}$, zato je $\Delta l = 0{,}2\,\text{cm}$.
5. Odgovor: dolžina sledi je $l = (6{,}5 \pm 0{,}2)\,\text{cm}$.

### Primer 3: prelet postaje in groba napaka

Krožek drugič meri prelet ISS med istima točkama. Šest časov: $58{,}2\,\text{s}$; $57{,}9\,\text{s}$; $58{,}4\,\text{s}$; $63{,}1\,\text{s}$; $58{,}0\,\text{s}$ in $58{,}3\,\text{s}$. Tim prizna, da je ob zvoniku gledal stran in štoparico ustavil šele nekaj sekund pozneje. Kolikšen je čas preleta?

**Podatki:** $t_1 = 58{,}2\,\text{s}$, $t_2 = 57{,}9\,\text{s}$, $t_3 = 58{,}4\,\text{s}$, $t_4 = 63{,}1\,\text{s}$, $t_5 = 58{,}0\,\text{s}$, $t_6 = 58{,}3\,\text{s}$; ena meritev je pokvarjena
**Iščemo:** čas preleta $t = (\bar{t} \pm \Delta t)$

:::formula
Najprej izloči grobo napako, nato $\bar{t} = \dfrac{t_1 + \dots + t_n}{n}$ in $\Delta t$ = največji odmik od $\bar{t}$
:::

**Rešitev:**

1. Meritev $63{,}1\,\text{s}$ odstopa za skoraj $5\,\text{s}$, druge so znotraj pol sekunde. To je groba napaka, zato jo izločimo. Ostane $n = 5$.
2. Vsota preostalih: $58{,}2 + 57{,}9 + 58{,}4 + 58{,}0 + 58{,}3 = 290{,}8$, torej $290{,}8\,\text{s}$.
3. Povprečje: $\dfrac{290{,}8}{5} = 58{,}16$; zaokrožimo na desetinke kot meritve: $\bar{t} \approx 58{,}2\,\text{s}$.
4. Odmiki od $58{,}16\,\text{s}$: največji je pri $57{,}9\,\text{s}$, in sicer $58{,}16 - 57{,}9 = 0{,}26$. Zaokrožimo navzgor, da napake ne podcenimo: $\Delta t = 0{,}3\,\text{s}$.
5. Za primerjavo: s pokvarjeno meritvijo bi bilo povprečje $\dfrac{353{,}9}{6} \approx 58{,}98\,\text{s}$, skoraj sekundo preveč. Ena groba napaka premakne vse.
6. Odgovor: prelet traja $t = (58{,}2 \pm 0{,}3)\,\text{s}$.

### Primer 4: zdaj ti

Učenka štirikrat izmeri premer Lune na fotografiji. Povprečje je $38{,}5\,\text{mm}$. Tri meritve so $38{,}2\,\text{mm}$; $38{,}9\,\text{mm}$ in $38{,}6\,\text{mm}$, četrte pa ni zapisala. Koliko je bila četrta meritev?

**Podatki:** $\bar{d} = 38{,}5\,\text{mm}$, $n = 4$, $d_1 = 38{,}2\,\text{mm}$, $d_2 = 38{,}9\,\text{mm}$, $d_3 = 38{,}6\,\text{mm}$
**Iščemo:** četrto meritev $d_4$

:::formula
Vsota vseh meritev $= n \cdot \bar{d}$, zato $d_4 = n \cdot \bar{d} - (d_1 + d_2 + d_3)$
:::

**Rešitev:**

1. Iz povprečja dobimo vsoto vseh štirih: $4 \cdot 38{,}5 = 154$, torej $154{,}0\,\text{mm}$.
2. Vsota znanih treh: $38{,}2 + 38{,}9 + 38{,}6 = 115{,}7$, torej $115{,}7\,\text{mm}$.
3. Zadnji korak naredi sam, nato preveri:

:::premisli
Koliko je $d_4$?
---
$d_4 = 154{,}0\,\text{mm} - 115{,}7\,\text{mm} = 38{,}3\,\text{mm}$. Preizkus: $\dfrac{38{,}2 + 38{,}9 + 38{,}6 + 38{,}3}{4} = 38{,}5$.
:::

## Pogoste napake

- **»Ena meritev je prava, druge so napačne.«** Tako je mislil Žan. Napako ima vsaka meritev, tudi najbolj skrbna, zato nobena ni »prava«. Najboljši približek je povprečje vseh.
- **»Več decimalk pomeni bolj natančno.«** Kalkulator da $58{,}16$ ali $42{,}1333$, a štoparica s človeškim prstom ne meri na stotinke sekunde. Povprečje zaokroži na natančnost meritev.
- **»Vse meritve gredo v povprečje.«** Meritev, ki je očitno pokvarjena (prepozno ustavljena štoparica, napačno odčitan razdelek), povprečje močno premakne. Grobo napako najprej izloči.
- **»Povprečje odpravi vse napake.«** Odpravi le naključne, ki gredo enkrat gor, enkrat dol. Če vsi merijo z ravnilom, ki ima obrabljen začetek, so vse dolžine prekratke, in povprečje je prekratko prav tako.

## Povzetek

- Vsaka meritev ima mersko napako; ponovljene meritve se zato razlikujejo.
- Naključne napake so enkrat navzgor, enkrat navzdol; sistematične vse premaknejo v isto smer; grobo napako izločimo.
- Povprečje: $\bar{x} = \dfrac{x_1 + x_2 + \dots + x_n}{n}$ je najboljši približek prave vrednosti.
- Absolutna napaka $\Delta x$ je največji odmik meritve od povprečja. Rezultat: $x = (\bar{x} \pm \Delta x)$ z enoto.
- Povprečje zaokrožimo na natančnost meritev. Več meritev da zanesljivejše povprečje.

## Drugače: Korak za korakom s številkami

Recept za vsako ponovljeno meritev, na primeru časov $12{,}4$; $12{,}7$; $12{,}5$; $12{,}6$ in $12{,}3\,\text{s}$:

1. **Preglej.** Je kakšna meritev daleč od drugih? Tu ne, vse so med $12{,}3$ in $12{,}7\,\text{s}$.
2. **Seštej.** $12{,}4 + 12{,}7 + 12{,}5 + 12{,}6 + 12{,}3 = 62{,}5$
3. **Deli s številom meritev.** $\dfrac{62{,}5}{5} = 12{,}5$, torej $\bar{t} = 12{,}5\,\text{s}$.
4. **Poišči največji odmik.** $12{,}7 - 12{,}5 = 0{,}2$ in $12{,}5 - 12{,}3 = 0{,}2$, torej $\Delta t = 0{,}2\,\text{s}$.
5. **Zapiši.** $t = (12{,}5 \pm 0{,}2)\,\text{s}$.
6. **Preveri smisel.** Povprečje mora ležati med najmanjšo in največjo meritvijo. $12{,}5$ leži med $12{,}3$ in $12{,}7$.

## Drugače: Kot zgodba

Leta 1676 je danski astronom Ole Rømer opazoval Io, Jupitrovo luno. Io vsakih nekaj dni zaide v senco Jupitra in »ugasne«. Rømer je zapisoval čase teh mrkov, noč za nočjo.

Ni se zanesel na eno opazovanje. Vedel je, da se lahko zmoti za kakšno minuto: oblak, nemirna slika v teleskopu, utrujene oči. Zato je mrke opazoval znova in znova in primerjal množico zapisov.

Iz njih je opazil nekaj presenetljivega: ko je bila Zemlja daleč od Jupitra, so mrki zamujali za nekaj minut, več kot bi jih mogla povzročiti njegova napaka pri odčitavanju. Iz tega je sklepal, da svetloba potrebuje čas, da pride od Jupitra do nas.

Nauk zgodbe: šele ko poznaš velikost svoje merske napake, lahko presodiš, ali je razlika med meritvami le naključje ali pa odkritje.

## Preveri se

? Katera trditev o večkratnem merjenju iste količine je pravilna?
- Če merimo pravilno, dobimo vsakič isto število.
~ Tudi pri skrbnem merjenju ima vsaka meritev majhno naključno napako, zato se meritve razlikujejo.
- Najbolj zanesljiva je prva meritev, ker je merilec še zbran.
~ Prva meritev nima posebne vloge. Vse meritve so enakovredne.
+ Najboljši približek prave vrednosti je povprečje vseh meritev.
- Najbolj zanesljiva je največja meritev.
~ Največja meritev je le ena od razpršenih. Napake so navzgor in navzdol, zato je prava vrednost nekje vmes.
> Naključne napake gredo enkrat navzgor, enkrat navzdol in se v povprečju večinoma izničijo.

? Pet učencev izmeri čas, v katerem se zvezda skrije za rob strehe: $12{,}4\,\text{s}$; $12{,}7\,\text{s}$; $12{,}5\,\text{s}$; $12{,}6\,\text{s}$; $12{,}3\,\text{s}$. Kolikšno je povprečje?
- $62{,}5\,\text{s}$
~ To je vsota. Vsoto moraš še deliti s številom meritev, $5$.
+ $12{,}5\,\text{s}$
- $12{,}7\,\text{s}$
~ To je največja meritev. Povprečje je sredina, ne največja vrednost.
- $12{,}4\,\text{s}$
~ To je le prva meritev. Povprečje upošteva vse meritve.
> $\bar{t} = \dfrac{62{,}5\,\text{s}}{5} = 12{,}5\,\text{s}$.

? Miha izmeri dolžino na fotografiji Saturna: $3{,}2\,\text{cm}$; $3{,}4\,\text{cm}$; $3{,}3\,\text{cm}$; $9{,}3\,\text{cm}$. Zapiše: $\bar{l} = \dfrac{19{,}2\,\text{cm}}{4} = 4{,}8\,\text{cm}$. Kje je napaka?
- Narobe je seštel meritve.
~ Vsota $19{,}2\,\text{cm}$ je pravilna. Težava je v tem, katere meritve je seštel.
- Povprečje bi moral zapisati natančneje, $4{,}80\,\text{cm}$.
~ Več decimalk ne popravi napačnega povprečja. Poleg tega imajo meritve le desetinke.
+ Meritev $9{,}3\,\text{cm}$ je groba napaka, ki bi jo moral izločiti.
- Napake ni, povprečje je pravilno.
~ Povprečje $4{,}8\,\text{cm}$ je večje od treh od štirih meritev, kar kaže, da ga je nekaj pokvarilo.
> $9{,}3\,\text{cm}$ močno odstopa od drugih (verjetno je odčital napačno oznako). Brez nje: $\bar{l} = \dfrac{9{,}9\,\text{cm}}{3} = 3{,}3\,\text{cm}$.

? Dve skupini merita čas preleta istega satelita. Skupina A zapiše $(20{,}1 \pm 0{,}1)\,\text{s}$, skupina B $(20{,}4 \pm 0{,}6)\,\text{s}$. Katera je merila natančneje?
- Skupina B, ker ima večje povprečje.
~ Velikost povprečja ne pove nič o natančnosti. Natančnost kaže absolutna napaka.
+ Skupina A, ker ima manjšo absolutno napako.
- Obe enako, ker sta povprečji skoraj enaki.
~ Povprečji sta podobni, a meritve skupine B so precej bolj razpršene.
> Manjša absolutna napaka pomeni, da so meritve tesneje zbrane okoli povprečja. A ima $0{,}1\,\text{s}$, B kar $0{,}6\,\text{s}$.

? Učenci merijo čas preleta ISS, a štoparice zaženejo šele, ko učitelj zakliče »zdaj!«, kar vedno zamuja za kakšno sekundo. Ustavijo jih sami, ob pravem trenutku. Izmerijo desetkrat in izračunajo povprečje. Kaj velja?
- Napaka se v povprečju izniči, ker so meritve ponovili desetkrat.
~ Izničijo se le napake, ki so enkrat navzgor, enkrat navzdol. Ta zamuda je vedno v isto smer.
+ Povprečje bo prekratko, ker je to sistematična napaka v isto smer.
- Povprečje bo predolgo, ker so štoparice zagnali prepozno.
~ Če štoparico zaženeš prepozno, ustaviš pa ob pravem času, izmeriš manj časa, ne več.
> Pozni zagon vsako meritev skrajša za približno enako. Povprečje te sistematične napake ne odpravi; pomaga le boljši način merjenja.

:::simboli
t | izmerjeni čas | | s | rezultat zapišemo kot t = (t̄ ± Δt)
\bar{t} | povprečje meritev časa | \bar{t} = \dfrac{t_1 + t_2 + \dots + t_n}{n} | s
t_1, t_2, t_n | posamezne meritve časa | | s
\Delta t | absolutna napaka časa | | s | največji odmik meritve od povprečja
n | število meritev | | –
d | premer | | mm
\bar{d} | povprečni premer | \bar{d} = \dfrac{d_1 + d_2 + d_3 + d_4}{n} | mm
d_1, d_2, d_3, d_4 | posamezne meritve premera | | mm
l | dolžina | | cm | rezultat zapišemo kot l = (l̄ ± Δl)
\bar{l} | povprečna dolžina | \bar{l} = \dfrac{l_1 + l_2 + \dots + l_5}{n} | cm
l_1, l_2, l_5 | posamezne meritve dolžine | | cm
\Delta l | absolutna napaka dolžine | | cm | največji odmik meritve od povprečja
:::
