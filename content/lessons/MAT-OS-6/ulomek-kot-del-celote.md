---
stanje: osnutek
demo: ulomki
avtor: AI
---

## Zakaj se tega učimo

Pred več kot tri tisoč leti so egipčanski pisarji delili kruh in pivo delavcem. Hlebcev pogosto ni bilo toliko, da bi vsak dobil celega. Na Rhindovem papirusu, eni najstarejših ohranjenih zbirk matematičnih nalog, so naloge o tem, kako nekaj hlebcev pošteno razdeliti med deset mož. Pisarji so zato potrebovali števila za **dele celote**. Pisali so jih drugače kot mi, skoraj vedno kot vsoto delov, kot sta polovica ali četrtina: namesto »tri četrtine« so zapisali »polovica in četrtina«. Zapis z ulomkovo črto se je razvil mnogo pozneje.

Isto vprašanje te čaka v trgovini: »polovična cena«, »četrt kilograma sira«, »tri četrtine litra soka«. Koliko je to in kako tak del narišemo? Odgovor so **ulomki**. Danes jih pokažeš na liku in na številski premici, kmalu pa ti bodo pomagali pri decimalnih številih, kot je $2{,}50\,€$.

## Razlaga

**1. Mamljiva napaka: »štirje kosi so četrtine«.** Prodajalka v pekarni razreže pito na $4$ kose, enega pa precej večjega od drugih. Ali je vsak kos četrtina pite? Veliko ljudi reče da, saj so kosi štirje. Pa ni res: veliki kos je več kot četrtina, majhni manj. O četrtinah govorimo šele, ko celoto razdelimo na **enake dele**. Celota je lahko karkoli: pita, ura, meter ali skupina $20$ učencev. Del dobi ime po tem, na koliko enakih delov smo razdelili celoto:

| število delov | ime dela | zapis |
|---|---|---|
| 2 | polovica | $\dfrac{1}{2}$ |
| 3 | tretjina | $\dfrac{1}{3}$ |
| 4 | četrtina | $\dfrac{1}{4}$ |
| 5 | petina | $\dfrac{1}{5}$ |
| 6 | šestina | $\dfrac{1}{6}$ |
| 8 | osmina | $\dfrac{1}{8}$ |
| 10 | desetina | $\dfrac{1}{10}$ |
| 12 | dvanajstina | $\dfrac{1}{12}$ |

**2. Zapis ulomka.** Ulomek zapišemo z dvema številoma, ločenima z ulomkovo črto, na primer $\dfrac{3}{5}$.

- **Imenovalec** (spodaj, tu $5$) pove, na koliko enakih delov smo razdelili celoto. Tako dele tudi poimenuje: petine.
- **Števec** (zgoraj, tu $3$) pove, koliko takih delov vzamemo.

Za spomin: *imenovalec poimenuje, števec šteje*. Ulomek $\dfrac{3}{5}$ torej pomeni »tri petine celote«. Imenovalec ni nikoli $0$, saj celote ne moremo razdeliti na nič delov. Ulomke beremo takole:

| ulomek | beremo |
|---|---|
| $\dfrac{1}{4}$ | ena četrtina |
| $\dfrac{2}{3}$ | dve tretjini |
| $\dfrac{3}{5}$ | tri petine |
| $\dfrac{5}{8}$ | pet osmin |
| $\dfrac{7}{12}$ | sedem dvanajstin |

:::premisli
Ena pica je razrezana na četrtine, enako velika pica pa na osmine. Kateri kos je večji, $\dfrac{1}{4}$ ali $\dfrac{1}{8}$ pice? Napovej in pojasni.
---
Večji je $\dfrac{1}{4}$. Pico razdelimo na manj delov, zato je vsak del večji. Večji imenovalec pomeni več delov in zato manjše kose, čeprav je $8$ večje od $4$.
:::

**3. Ulomek na liku.** Lik (pravokotnik, krog, kvadrat) predstavlja celoto. Ulomek $\dfrac{a}{b}$ na njem prikažemo v dveh korakih:

1. Lik razdelimo na toliko **enako velikih** delov, kot pove imenovalec $b$.
2. Pobarvamo toliko delov, kot pove števec $a$.

:::risba skica
opis: Pravokotnik, razdeljen na 6 enakih navpičnih delov. Prvi 4 deli z leve so pobarvani, zadnja 2 sta prazna.
območje: 0; -0,6 .. 6; 1
pravokotnik: 0; 0 .. 1; 1 | modra polno
pravokotnik: 1; 0 .. 2; 1 | modra polno
pravokotnik: 2; 0 .. 3; 1 | modra polno
pravokotnik: 3; 0 .. 4; 1 | modra polno
pravokotnik: 4; 0 .. 5; 1
pravokotnik: 5; 0 .. 6; 1
napis: 2; -0,3 | 4 pobarvani
napis: 5; -0,3 | 2 prazna
:::

Pravokotnik na sliki je razdeljen na $6$ enakih delov, pobarvani so $4$. Pobarvan je torej $\dfrac{4}{6}$ celote, prazna sta $2$ dela, to je $\dfrac{2}{6}$. Ulomek z lika pa preberemo obratno: preštejemo vse enake dele (imenovalec) in med njimi pobarvane (števec).

Poskusi z interaktivno simulacijo spodaj: z drsnikoma spreminjaš števec in imenovalec ter opazuješ, kako se pobarva krog in kam se postavi točka na številski premici.

**4. Ulomek na številski premici.** Na številski premici označimo točki $0$ in $1$. Razdalja med njima je **enota** (celota). Ulomek $\dfrac{a}{b}$ označimo takole:

1. Enoto od $0$ do $1$ razdelimo na $b$ enakih delov.
2. Od $0$ proti desni preštejemo $a$ takih delov. Točka, kjer končamo, je ulomek $\dfrac{a}{b}$.

Enoto si je pametno izbrati tako, da je število kvadratkov v njej **deljivo z imenovalcem**. Za $\dfrac{3}{4}$ vzemimo enoto, dolgo $8$ kvadratkov v zvezku. Ena četrtina je $8 : 4 = 2$ kvadratka, torej $\dfrac{3}{4}$ leži $3 \cdot 2 = 6$ kvadratkov desno od $0$.

:::risba premica
opis: Številska premica od 0 do 1, razdeljena na 4 enake dele. Črtice so pri 0, 1/4, 2/4, 3/4 in 1.
od: 0
do: 1
korak: 0,25
oznake: ne
oznaka: 0 | 0
oznaka: 0,25 | 1/4
oznaka: 0,5 | 2/4
oznaka: 0,75 | 3/4
oznaka: 1 | 1
:::

Pozor: imenovalec je število **delov** (razmakov med črticami), ne število črtic. Enota, razdeljena na $4$ dele, ima med $0$ in $1$ le tri vmesne črtice.

:::premisli
Tina pravi: »Za petine narišem med $0$ in $1$ pet vmesnih črtic.« Ima prav? Koliko vmesnih črtic je res in pri kateri od njih leži $\dfrac{3}{5}$?
---
Tina nima prav: vmesne črtice so $4$, ena manj kot delov. Točka $\dfrac{3}{5}$ leži pri tretji vmesni črtici, ker od $0$ preštejemo $3$ dele.
:::

**5. Pravi in nepravi ulomki, mešano število.** Ulomki niso vedno manjši od celote.

- **Pravi ulomek** ima števec manjši od imenovalca, na primer $\dfrac{3}{5}$. Je manjši od $1$ in leži med $0$ in $1$.
- **Nepravi ulomek** ima števec večji ali enak imenovalcu, na primer $\dfrac{7}{4}$. Leži pri $1$ ali desno od njega.
- Če je števec enak imenovalcu, vzamemo vse dele: $\dfrac{5}{5} = 1$.

Številska premica se nadaljuje čez $1$: enoto od $1$ do $2$ razdelimo enako kot prvo. Ulomek $\dfrac{7}{4}$ pomeni sedem četrtin. Štiri četrtine so ena cela, ostanejo še tri četrtine, zato je $\dfrac{7}{4} = 1\dfrac{3}{4}$. Takemu zapisu rečemo **mešano število** (»ena cela in tri četrtine«).

- Nepravi ulomek v mešano število: števec delimo z imenovalcem. Količnik je celi del, ostanek je števec, imenovalec ostane isti. Za $\dfrac{7}{4}$: $7 : 4 = 1$, ostanek $3$, torej $1\dfrac{3}{4}$.
- Mešano število v nepravi ulomek: celi del pomnožimo z imenovalcem in prištejemo števec. Za $2\dfrac{3}{5}$: $2 \cdot 5 + 3 = 13$, torej $\dfrac{13}{5}$.

**6. Ulomek količine.** Celota je lahko tudi znesek ali skupina predmetov. Koliko je $\dfrac{3}{4}$ od $20\,€$?

1. Celoto delimo z imenovalcem: $20 : 4 = 5$, ena četrtina je $5\,€$.
2. Rezultat pomnožimo s števcem: $5 \cdot 3 = 15$.

Torej so $\dfrac{3}{4}$ od $20\,€$ enake $15\,€$. Pravilo: delimo z imenovalcem, množimo s števcem. Skupino lahko pošteno razdelimo le, če je število njenih članov deljivo z imenovalcem: $12$ učencev ne moreš razdeliti na $5$ enakih skupin.

**7. Iz dela poiščemo celoto.** Včasih poznamo vrednost nekaj delov in iščemo celoto. Če sta $\dfrac{2}{3}$ celote enaki $12$, najprej poiščemo eno tretjino ($12 : 2 = 6$), nato celoto s tremi tretjinami ($6 \cdot 3 = 18$). Najprej delimo s števcem, potem množimo z imenovalcem.

## Rešeni primeri

### Primer 1 (lažji)

Maja v trgovini kupi čokolado z $12$ enakimi kockami, razporejenimi v $3$ vrstice po $4$ kocke. Doma poje $5$ kock. Kolikšen del čokolade je pojedla in kolikšen del je ostal? Oba ulomka zapiši in ju preberi.

**Podatki:** vseh enakih kock $12$ ($3$ vrstice po $4$ kocke), pojedenih kock $5$
**Iščemo:** ulomek pojedenega dela in ulomek ostanka

:::formula
$\dfrac{\text{število izbranih delov}}{\text{število vseh enakih delov}}$
:::

**Rešitev:**

1. Celota je cela čokolada, razdeljena na $12$ enakih delov (kock), zato je imenovalec $12$.
2. Maja je pojedla $5$ kock, zato je števec $5$. Pojeden del je $\dfrac{5}{12}$, beremo »pet dvanajstin«.
3. Ostalo je $12 - 5 = 7$ kock, zato je ostanek $\dfrac{7}{12}$, beremo »sedem dvanajstin«.
4. Preverimo: pojedenih in ostalih kock je skupaj $5 + 7 = 12$, to je vsa čokolada.
5. Odgovor: Maja je pojedla $\dfrac{5}{12}$ čokolade, ostalo je $\dfrac{7}{12}$.

### Primer 2 (srednji)

Na zvezek narišeš številsko premico, na kateri je enota (razdalja od $0$ do $1$) dolga $10$ kvadratkov. a) Enoto razdeli na petine in označi točke $\dfrac{3}{5}$, $\dfrac{5}{5}$ in $\dfrac{7}{5}$. b) Koliko kvadratkov desno od $0$ leži vsaka od njih? c) Zapiši $\dfrac{7}{5}$ kot mešano število.

**Podatki:** enota od $0$ do $1$ je dolga $10$ kvadratkov, ulomki $\dfrac{3}{5}$, $\dfrac{5}{5}$ in $\dfrac{7}{5}$
**Iščemo:** lego točk (v kvadratkih od $0$) in $\dfrac{7}{5}$ kot mešano število

:::formula
Ena $b$-ina enote je $\text{enota} : b$. Ulomek $\dfrac{a}{b}$ leži $a$ takih delov desno od $0$.

Mešano število: $a : b$ da celi del, ostanek je števec, imenovalec ostane $b$.
:::

**Rešitev:**

1. Imenovalec je $5$, zato enoto razdelimo na $5$ enakih delov. Ker je $10 : 5 = 2$, je ena petina dolga $2$ kvadratka.
2. Točka $\dfrac{3}{5}$ leži $3 \cdot 2 = 6$ kvadratkov desno od $0$ (med $0$ in $1$).
3. Točka $\dfrac{5}{5}$ leži $5 \cdot 2 = 10$ kvadratkov desno od $0$. To je točka $1$.
4. Točka $\dfrac{7}{5}$ leži $7 \cdot 2 = 14$ kvadratkov desno od $0$, torej $4$ kvadratke desno od točke $1$, v drugi enoti.
5. Mešano število: $7 : 5 = 1$, ostanek $2$, zato je $\dfrac{7}{5} = 1\dfrac{2}{5}$. Preverimo: ena cela enota ima $10$ kvadratkov, dve petini pa $2 \cdot 2 = 4$ kvadratke, skupaj $14$ kvadratkov.
6. Odgovor: točke ležijo $6$, $10$ in $14$ kvadratkov desno od $0$, $\dfrac{7}{5} = 1\dfrac{2}{5}$.

### Primer 3 (težji)

Lana je za darilo porabila $\dfrac{3}{5}$ svojih prihrankov, to je $15\,€$. Koliko evrov je imela prihranjenih? Koliko evrov ji je ostalo in kolikšen del prihrankov je to?

**Podatki:** porabljeni del $\dfrac{3}{5}$ prihrankov, porabljeni znesek $15\,€$
**Iščemo:** vse prihranke, ostanek v evrih in ostanek kot ulomek

:::formula
Če je $\dfrac{a}{b}$ celote enako $k$, je ena $b$-ina enaka $k : a$, celota pa $b \cdot (k : a)$.
:::

**Rešitev:**

1. Prihranke si predstavljamo kot $5$ enakih delov (petin). Porabljeni so $3$ deli in ti so vredni $15\,€$.
2. Ena petina: $15 : 3 = 5$, torej $5\,€$, ker so trije enaki deli skupaj $15\,€$.
3. Vsi prihranki so pet petin: $5 \cdot 5 = 25$, torej $25\,€$.
4. Zdaj ti: koliko delov je ostalo, kolikšen ulomek je to in koliko evrov?

:::premisli
Koliko je Lani ostalo?
---
Ostala sta $2$ od $5$ delov, to je $\dfrac{2}{5}$ prihrankov, in $2 \cdot 5 = 10$, torej $10\,€$. Preizkus: $25 - 15 = 10$. Odgovor: Lana je imela $25\,€$, ostalo ji je $10\,€$, to sta $\dfrac{2}{5}$ prihrankov.
:::

## Pogoste napake

- **Deli niso enaki.** Pito, razrezano na štiri neenake kose, učenec imenuje četrtine, ker so kosi štirje. Ulomek pa velja le za enake dele. Pravilno: najprej preveri, da so vsi deli enako veliki, nato preštej.
- **Štetje črtic namesto delov.** Enota, razdeljena na $4$ dele, ima med $0$ in $1$ le $3$ vmesne črtice. Kdor šteje črtice, napiše imenovalec $3$. Pravilno: štej razmake med črticami.
- **Večji imenovalec, večji del.** Učenec misli, da je $\dfrac{1}{8}$ več kot $\dfrac{1}{4}$, ker je $8 > 4$. Večji imenovalec pomeni več delov, zato je vsak manjši. Pravilno: pri enakem števcu je večji ulomek tisti z manjšim imenovalcem.
- **Deljenje s števcem.** Pri $\dfrac{3}{4}$ od $20\,€$ učenec računa $20 : 3$. Pozabi, da imenovalec pove, na koliko delov delimo celoto. Pravilno: delimo z imenovalcem ($20 : 4 = 5$), nato množimo s števcem ($5 \cdot 3 = 15$).
- **»Ulomek je vedno manjši od 1.«** Učenec $\dfrac{7}{4}$ prepiše v $\dfrac{4}{7}$, ker »števec ne sme biti večji«. A števec šteje dele in lahko jih vzamemo več, kot jih ima ena celota. Pravilno: $\dfrac{7}{4} = 1\dfrac{3}{4}$, ulomek $\dfrac{4}{7}$ pa je manjši od $1$.

## Povzetek

- Ulomek $\dfrac{a}{b}$ pomeni $a$ delov celote, razdeljene na $b$ enakih delov. Deli morajo biti enaki.
- Imenovalec $b$ pove, na koliko delov razdelimo celoto, in dele poimenuje; števec $a$ pove, koliko delov vzamemo. Imenovalec ni $0$.
- Na liku: razdelimo ga na $b$ enakih delov in pobarvamo $a$ delov.
- Na številski premici: enoto od $0$ do $1$ razdelimo na $b$ delov (to je $b - 1$ vmesnih črtic) in od $0$ preštejemo $a$ delov.
- Večji imenovalec pomeni manjše dele: $\dfrac{1}{8}$ je manj kot $\dfrac{1}{4}$.
- Pravi ulomek ($a < b$) je manjši od $1$; nepravi ($a \ge b$) je večji ali enak $1$ in ga zapišemo kot mešano število, npr. $\dfrac{7}{4} = 1\dfrac{3}{4}$.
- Ulomek količine: delimo z imenovalcem, množimo s števcem ($\dfrac{3}{4}$ od $20\,€$ je $15\,€$). Iz dela do celote: delimo s števcem, množimo z imenovalcem.

## Drugače: Kot zgodba

Predstavljaj si egipčanskega pisarja, ki mora tri hlebce kruha razdeliti med štiri delavce. Celega hlebca ne more dati nikomur, ker jih je premalo. Hlebce bi lahko razlomil na oko, a potem bi se delavci prepirali, kdo je dobil večji kos.

Zato vsak hlebec razreže na štiri **enake** dele. Iz treh hlebcev dobi $3 \cdot 4 = 12$ četrtin. Vsak delavec vzame $12 : 4 = 3$ četrtine, to je $\dfrac{3}{4}$ hlebca. Vsi dobijo enako in nič ne ostane.

Pisar pri tem opazi še nekaj: vsak delavec dobi toliko, kolikor je $3 : 4$. Ulomkova črta torej pomeni tudi deljenje, ki se ne izide brez ostanka. Svoj delež bi pisar zapisal kot »polovica in četrtina hlebca«, mi pa pišemo krajše: $\dfrac{3}{4}$.

## Drugače: Korak za korakom s številkami

Tri postopke pokažemo na konkretnih številih.

**Postopek A: ulomek količine.** Koliko je $\dfrac{5}{6}$ od $42\,€$?

1. Prebereš imenovalec: $6$. Celoto razdeliš na $6$ enakih delov.
2. Izračunaš eno šestino: $42 : 6 = 7$ (deljenje gre brez ostanka, ker je $42$ večkratnik števila $6$).
3. Vzameš toliko delov, kot pove števec: $5 \cdot 7 = 35$.
4. Odgovor: $\dfrac{5}{6}$ od $42\,€$ je $35\,€$.

**Postopek B: ulomek na številski premici.** Enota naj bo dolga $12$ kvadratkov. Kje je $\dfrac{3}{4}$, $\dfrac{5}{6}$ in $\dfrac{7}{3}$?

| ulomek | dolžina enega dela | koliko delov | kvadratkov od 0 |
|---|---|---|---|
| $\dfrac{3}{4}$ | $12 : 4 = 3$ | 3 | $3 \cdot 3 = 9$ |
| $\dfrac{5}{6}$ | $12 : 6 = 2$ | 5 | $5 \cdot 2 = 10$ |
| $\dfrac{7}{3}$ | $12 : 3 = 4$ | 7 | $7 \cdot 4 = 28$ |

Točka $\dfrac{7}{3}$ je za $28 - 24 = 4$ kvadratke desno od točke $2$ (ki je pri $24$ kvadratkih), v tretji enoti. Res je $7 : 3 = 2$, ostanek $1$, torej $\dfrac{7}{3} = 2\dfrac{1}{3}$.

**Postopek C: pretvorbe.**

1. $\dfrac{17}{5}$ v mešano število: $17 : 5 = 3$, ostanek $2$, torej $3\dfrac{2}{5}$.
2. Preverimo nazaj: $3 \cdot 5 + 2 = 17$, torej $\dfrac{17}{5}$.
3. $4\dfrac{2}{3}$ v nepravi ulomek: $4 \cdot 3 + 2 = 14$, torej $\dfrac{14}{3}$.

## Preveri se

? Razvrsti korake, s katerimi na številski premici označiš $\dfrac{3}{5}$.
1. Na premici označi $0$ in $1$.
2. Enoto od $0$ do $1$ razdeli na $5$ enakih delov.
3. Od $0$ proti desni preštej $3$ dele.
4. Točko, kjer končaš, označi z $\dfrac{3}{5}$.
> Imenovalec pove, na koliko delov razdelimo enoto, števec, koliko delov preštejemo od $0$.

? Trije zapisi pomenijo isto število, eden ne. Kateri ne spada zraven?
- $\dfrac{7}{4}$
~ Ulomek je lahko večji od $1$: sedem četrtin je ena cela in tri četrtine.
- $1\dfrac{3}{4}$
~ Ena cela ima $4$ četrtine, skupaj s tremi je to $7$ četrtin, torej $\dfrac{7}{4}$.
- »sedem četrtin«
~ To je samo z besedo zapisan $\dfrac{7}{4}$.
+ $\dfrac{4}{7}$
> $\dfrac{4}{7}$ so štiri sedmine in so manj kot $1$. Ostali trije zapisi pomenijo $\dfrac{7}{4} = 1\dfrac{3}{4}$, kar je več kot $1$.

? Imenovalec ulomka povečamo, števec pa ostane enak, na primer iz $\dfrac{1}{4}$ v $\dfrac{1}{8}$. Kaj se zgodi?
- Ulomek se poveča, ker je $8$ več kot $4$.
~ Večji imenovalec pomeni, da je celota razdeljena na več delov, zato je vsak del manjši.
- Ulomek ostane enak, ker se števec ni spremenil.
~ Števec pove, koliko delov vzamemo, velikost dela pa določa imenovalec.
+ Vsak del je manjši, zato je ulomek manjši.
> Pico, razrezano na $8$ enakih kosov, razdelimo na manjše kose kot pico, razrezano na $4$. Zato je $\dfrac{1}{8}$ manj kot $\dfrac{1}{4}$.

? Jakna stane $28\,€$. Na razprodaji plačaš le $\dfrac{3}{4}$ cene. Koliko evrov plačaš?
= 21 € | 0,01
~ 7 | To je ena četrtina cene, torej popust. Vzeti moraš tri četrtine.
~ 84 | Pomnožil si s števcem, z imenovalcem pa nisi delil.
> Ena četrtina: $28 : 4 = 7$, torej $7\,€$. Tri četrtine: $7 \cdot 3 = 21$, torej $21\,€$.

? Miha je ulomek pri točki na premici določil v štirih korakih. Kateri korak je napačen?
:::risba premica
opis: Številska premica od 0 do 1 s tremi enako razmaknjenimi vmesnimi črticami. Točka z vprašajem leži pri tretji vmesni črtici, tik pred 1.
od: 0
do: 1
korak: 0,25
oznake: ne
oznaka: 0 | 0
oznaka: 1 | 1
točka: 0,75 | ?
:::
Mihovi koraki: 1. Med $0$ in $1$ so $3$ vmesne črtice. 2. Zato je imenovalec $3$. 3. Točka je pri tretji črtici, zato je števec $3$. 4. Točka je $\dfrac{3}{3} = 1$.
- korak 1
~ Vmesne črtice so res $3$, ta korak je pravilen.
+ korak 2
- korak 3
~ Točka je res na koncu tretjega dela od $0$, števec $3$ je pravilen.
- korak 4
~ Račun $\dfrac{3}{3} = 1$ je pravilen; napačen rezultat izhaja iz koraka 2.
> Tri vmesne črtice razdelijo enoto na $4$ dele, zato je imenovalec $4$. Točka je $\dfrac{3}{4}$, ne $1$.

<<RACUN
vrednost: 12-5 | 7
vrednost: 10/5 | 2
vrednost: 3*2 | 6
vrednost: 7*2 | 14
enako: 7/5 | 1+2/5
vrednost: 15/3 | 5
vrednost: 5*5 | 25
vrednost: 25-15 | 10
vrednost: 20/4*3 | 15
vrednost: 12/2*3 | 18
vrednost: 28/4*3 | 21
vrednost: 42/6*5 | 35
enako: 7/4 | 1+3/4
enako: 2+3/5 | 13/5
enako: 7/3 | 2+1/3
enako: 17/5 | 3+2/5
enako: 4+2/3 | 14/3
>>

:::simboli
a | števec | | – | koliko delov vzamemo
b | imenovalec | | – | na koliko enakih delov razdelimo celoto; $b \ne 0$
k | znana vrednost dela celote | | | $\frac{a}{b}$ celote je $k$
:::
