---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poskus za odmor: zberi šest prijateljev. Za vsak par preverite, ali imata oba drug drugega shranjena v imeniku telefona. Na list nariši šest pik, po eno za vsakega. Če imata oba v paru drug drugega shranjena, pike poveži s polno črto, sicer s črtkano.

Parov je $15$. Ko so vse črte narisane, poišči tri pike, med katerimi so vse tri črte enake: vse polne ali vse črtkane. Našel jih boš. Ne zaradi sreče: pri šestih ljudeh se jim ni mogoče izogniti, ne glede na to, kdo ima koga shranjenega. Pri petih ljudeh to ni več res.

Drugi del poskusa: vsak naj pove, koliko ljudi iz skupine je s polno črto povezanih z njim. Seštej ta števila. Vsota bo soda, vedno.

Obe opažanji sta izreka teorije grafov. Na tekmovanjih rešita naloge, ki so na prvi pogled brezupno iskanje primerov, z nekaj vrsticami razmisleka.

## Razlaga

**1. Graf.** Pike iz poskusa imenujemo **točke** (tudi vozlišča), črte med njimi **povezave**. **Graf** je množica točk skupaj s povezavami med nekaterimi pari točk. Povezava nima smeri: če je Anin telefon prek Bluetootha seznanjen z Bojanovim, je tudi Bojanov z Aninim. Zank (povezave točke same s sabo) in dvojnih povezav ne dovolimo.

Graf, v katerem je povezan vsak par točk, je **polni graf** $K_n$. Število povezav označimo z $m$. V $K_n$ je povezav toliko, kolikor je parov točk:

$$m = \binom{n}{2} = \frac{n(n - 1)}{2}$$

*Hitro preverjanje:* koliko povezav ima $K_6$ iz poskusa? Odgovor: $\frac{6 \cdot 5}{2} = 15$.

**2. Stopnja točke.** **Stopnja** točke $v$, oznaka $d(v)$, je število povezav, ki imajo krajišče v $v$. Pri telefonih: s koliko napravami je telefon seznanjen. V $K_n$ ima vsaka točka stopnjo $n - 1$, ker je povezana z vsemi drugimi.

*Hitro preverjanje:* kolikšna je stopnja vsake točke v $K_6$? Odgovor: $5$.

**3. Lema o rokovanju.** Seštejmo stopnje vseh točk. Vsaka povezava ima dve krajišči, zato jo v vsoti štejemo dvakrat. To je **dvojno štetje**: isto količino preštejemo na dva načina, enkrat po točkah, enkrat po povezavah:

$$d(v_1) + d(v_2) + \dots + d(v_n) = 2m$$

Ime izvira iz rokovanja. Če vsak udeleženec pove, s koliko ljudmi se je rokoval, je vsota dvakratno število rokovanj.

:::premisli
V skupini je sedem telefonov. Ali je mogoče, da je vsak seznanjen z natanko tremi drugimi? Odgovori brez risanja.
---
Ni mogoče. Vsota stopenj bi bila $7 \cdot 3 = 21$, kar je liho število. Lema o rokovanju pa zahteva sodo vsoto $2m$.
:::

Iz leme sledi **posledica**: točk z liho stopnjo je vedno sodo mnogo. Točke s sodo stopnjo prispevajo k vsoti sodo število. Da je vsa vsota soda, mora biti tudi lihih seštevancev sodo mnogo.

*Hitro preverjanje:* ali obstaja graf s stopnjami $2, 3, 3, 3, 4$? Odgovor: ne, vsota $15$ je liha.

**4. Barvanje povezav.** V poskusu je bil povezan vsak par, a z eno od dveh vrst črt. Rečemo, da smo povezave grafa $K_6$ **pobarvali z dvema barvama**. Ker barve na zaslonu ali v tisku niso vedno vidne, ju tu ločimo po obliki: polna in črtkana črta. **Enobarvni trikotnik** so tri točke, med katerimi so vse tri povezave iste barve.

*Hitro preverjanje:* koliko trojk točk (možnih trikotnikov) ima $K_6$? Odgovor: $\binom{6}{3} = 20$.

**5. Šest točk vedno zadošča.** Trditev: pri vsakem barvanju povezav grafa $K_6$ z dvema barvama obstaja enobarvni trikotnik.

Dokaz začnemo v eni točki $A$. Iz nje gre pet povezav, barvi sta dve. Po Dirichletovem načelu so vsaj $\left\lceil \frac{5}{2} \right\rceil = 3$ povezave iste barve. Recimo, da so polne in vodijo do točk $B$, $C$, $D$.

Zdaj poglej tri povezave med temi sosedi: $BC$, $CD$ in $BD$. Če je katera polna, na primer $BC$, je trikotnik $ABC$ poln. Če ni polna nobena, so vse tri črtkane in trikotnik $BCD$ je črtkan. Tretje možnosti ni.

**6. Pet točk ne zadošča.** Pri $K_5$ obstaja barvanje brez enobarvnega trikotnika. Stranice petkotnika so polne, diagonale (zvezda) črtkane:

:::risba skica
opis: Pravilni petkotnik z oglišči A, B, C, D, E. Stranice AB, BC, CD, DE in EA so polne črte. Diagonale AC, AD, BD, BE in CE so črtkane in tvorijo zvezdo. Nobene tri točke nimajo vseh treh povezav iste vrste.
območje: -2,8; -2,4 .. 2,8; 2,8
enota: 50
črta: 0; 2 -> 1,9; 0,62 -> 1,18; -1,62 -> -1,18; -1,62 -> -1,9; 0,62 -> 0; 2 | modra debelo
črta: 0; 2 -> 1,18; -1,62 -> -1,9; 0,62 -> 1,9; 0,62 -> -1,18; -1,62 -> 0; 2 | oranžna črtkano
točka: 0; 2 | A | nad
točka: 1,9; 0,62 | B | desno
točka: 1,18; -1,62 | C | pod
točka: -1,18; -1,62 | D | pod
točka: -1,9; 0,62 | E | levo
podnapis: Polne stranice, črtkane diagonale: K₅ brez enobarvnega trikotnika
:::

Vsake tri točke petkotnika imajo med sabo vsaj eno stranico (polno) in vsaj eno diagonalo (črtkano). Zato je $6$ najmanjše število točk s to lastnostjo.

**Ramseyjevo število** $R(s, t)$ je najmanjši $n$, pri katerem vsako barvanje povezav $K_n$ z dvema barvama vsebuje poln $K_s$ ali črtkan $K_t$. Trikotnik je $K_3$, zato koraka 5 in 6 skupaj povesta $R(3, 3) = 6$.

:::premisli
Ali bi dokaz iz koraka 5 deloval tudi pri $K_5$? Kje točno se zatakne?
---
Ne. Iz točke $A$ gredo le štiri povezave, Dirichlet zagotovi samo $\left\lceil \frac{4}{2} \right\rceil = 2$ enaki. Pri dveh sosedih $B$, $C$ je ena sama povezava $BC$; če je črtkana, ne da trikotnika. Petkotnik pokaže, da to ni le slabost dokaza: pri petih točkah trditev res ne velja.
:::

V simulaciji spodaj, »Barvanje povezav: R(3, 3) = 6«, poskusi pobarvati povezave šestih točk tako, da se izogneš enobarvnemu trikotniku. Opazuj, kdaj obtičiš: takoj ko ima ena točka tri povezave iste barve, med njenimi tremi sosedi ni več varne barve.

**7. Strategija za tekmovanje.** Pri nalogi »dokaži, da vedno obstaja …« besedilo najprej prevedi v graf: kaj so točke, kaj povezave, kaj barve. Nato poišči točko z veliko povezavami iste barve (Dirichlet) in obravnavaj njene sosede. Pri vprašanju »ali je mogoče …« najprej preveri parnost vsote stopenj.

## Rešeni primeri

### Primer 1 (lažji): pametne ure

Devet pametnih ur želimo povezati prek Bluetootha tako, da je vsaka seznanjena z natanko tremi drugimi. Je to mogoče? Kaj pa pri desetih urah?

**Podatki:** $n_1 = 9$ ur, $n_2 = 10$ ur, vsaka ura naj ima stopnjo $3$
**Iščemo:** ali tak graf obstaja

:::formula
Lema o rokovanju: $d(v_1) + \dots + d(v_n) = 2m$
:::

**Rešitev:**

1. Ure so točke, seznanitve povezave. Vsaka točka naj ima stopnjo $3$.
2. Pri devetih urah je vsota stopenj $9 \cdot 3 = 27$. To je liho število, zato ne more biti enako $2m$.
3. Pri desetih urah je vsota $10 \cdot 3 = 30$, torej bi bilo povezav $m = \frac{30}{2} = 15$. Lema tega ne prepove, a obstoja tudi ne zagotovi: graf moramo še najti.
4. Ure postavimo v krog. Vsako povežemo z obema sosedama in z uro, ki je pet mest naprej (nasprotna ura). Vsaka ima tri povezave.
5. Odgovor: pri devetih urah to ni mogoče, pri desetih je mogoče s $15$ povezavami.

### Primer 2: usmerjevalniki v omrežju

V omrežju je $12$ usmerjevalnikov in $20$ kablov, vsak kabel povezuje dva usmerjevalnika. Vsak usmerjevalnik je povezan s tremi ali s štirimi drugimi. Koliko usmerjevalnikov ima štiri povezave?

**Podatki:** $n = 12$ točk, $m = 20$ povezav, vsaka stopnja je $3$ ali $4$
**Iščemo:** število $x$ točk s stopnjo $4$

:::formula
$d(v_1) + \dots + d(v_n) = 2m$, kjer ima $x$ točk stopnjo $4$, ostalih $12 - x$ pa stopnjo $3$
:::

**Rešitev:**

1. Vsota stopenj je $2m = 2 \cdot 20 = 40$.
2. Isto vsoto zapišemo po skupinah točk, dobimo enačbo $4x + 3(12 - x) = 40$.
3. Enačbo poenostavimo v $x + 36 = 40$, zato $x = 4$.
4. Preizkus: $4 \cdot 4 + 8 \cdot 3 = 40$, kar je res $2 \cdot 20$.
5. Odgovor: štirje usmerjevalniki imajo štiri povezave, osem jih ima tri.

### Primer 3 (težji): tri tehnologije

Med sedemnajstimi telefoni vsak par komunicira na natanko enega od treh načinov: Wi-Fi, Bluetooth ali NFC. Dokaži, da obstajajo trije telefoni, ki vsi med seboj komunicirajo na isti način.

**Podatki:** $n = 17$ točk, povezan je vsak par, $3$ barve povezav (Wi-Fi, Bluetooth, NFC)
**Iščemo:** dokaz, da obstaja enobarvni trikotnik

:::formula
Dirichletovo načelo: med $N$ predmeti v $k$ predalih je v nekem predalu vsaj $\left\lceil \frac{N}{k} \right\rceil$ predmetov; poleg tega $R(3, 3) = 6$
:::

**Rešitev:**

1. Telefoni so točke, vsak par je povezan, način komunikacije je barva. Imamo $K_{17}$, pobarvan s tremi barvami.
2. Izberemo telefon $A$. Iz njega gre $16$ povezav, barve so tri. Po Dirichletu je vsaj $\left\lceil \frac{16}{3} \right\rceil = 6$ povezav iste barve, recimo Wi-Fi, do telefonov $B_1, \dots, B_6$. Zakaj je pomembno, da jih je prav šest, se pokaže v zadnjem koraku.
3. Če sta katera dva izmed $B_1, \dots, B_6$ povezana prek Wi-Fi, recimo $B_i$ in $B_j$, je $A B_i B_j$ trikotnik Wi-Fi in smo končali.
4. Ostane primer, ko med $B_1, \dots, B_6$ ni nobene povezave Wi-Fi. Tega dokončaj sam.

:::premisli
Katere barve imajo tedaj povezave med $B_1, \dots, B_6$ in kaj od tod sledi?
---
Samo Bluetooth in NFC. To je $K_6$, pobarvan z dvema barvama, in ker je $R(3, 3) = 6$, ima enobarvni trikotnik (Bluetooth ali NFC). V vsakem primeru obstajajo trije telefoni, ki med seboj komunicirajo na isti način.
:::

## Pogoste napake

- **Vsota stopenj kot število povezav.** Kdor pri primeru 2 sešteje stopnje, dobi $40$ in reče »$40$ kablov«, je vsak kabel štel dvakrat, enkrat pri vsakem krajišču. Pravilno je $m = \frac{40}{2} = 20$.
- **Liho mnogo točk z liho stopnjo.** »Samo ena točka ima liho stopnjo« ni nikoli res. Če ti štetje to da, si spregledal povezavo. Lema o rokovanju zahteva sodo število takih točk.
- **Prešibek Dirichlet.** Iz petih povezav in dveh barv nekateri sklepajo le »vsaj dve iste barve«. To drži, a za dokaz ne zadošča. Pravilno je vsaj $\left\lceil \frac{5}{2} \right\rceil = 3$, in prav tretji sosed omogoči trikotnik.
- **Poskusi namesto dokaza, neuspel dokaz namesto protiprimera.** Nekaj barvanj $K_5$ z enobarvnim trikotnikom še ne dokaže, da ga ima vsako. Obratno: to, da dokaz pri $K_5$ odpove, še ne pove, da trditev ne velja. Za »ne velja« potrebuješ konkretno barvanje, na primer petkotnik z zvezdo.
- **Izrek izbere barvo.** $R(3, 3) = 6$ zagotavlja trikotnik ene *ali* druge barve. Da je poln, ni zagotovljeno: če so vse povezave črtkane, polnega trikotnika ni.

## Povzetek

- Graf sestavljajo točke in povezave. Polni graf $K_n$ ima $\binom{n}{2}$ povezav.
- Stopnja $d(v)$ je število povezav s krajiščem v točki $v$.
- Lema o rokovanju: vsota vseh stopenj je $2m$. Zato je točk z liho stopnjo sodo mnogo.
- $R(3, 3) = 6$: vsako barvanje povezav $K_6$ z dvema barvama ima enobarvni trikotnik. Pri $K_5$ ga petkotnik s polnimi stranicami in črtkanimi diagonalami nima.
- Dokaz: točka s petimi povezavami ima po Dirichletu tri iste barve; nato pogledamo povezave med temi tremi sosedi.
- Tri barve na $17$ točkah: Dirichlet da šest sosedov iste barve, med njimi uporabimo $R(3, 3) = 6$.

## Drugače: Na sliki

Ves dokaz $R(3, 3) = 6$ na eni sliki:

:::risba skica
opis: Točka A je na levi. Iz nje gredo tri polne povezave do točk B, C in D ter dve črtkani do točk E in F. Med B, C in D so tri sive povezave BC, CD in BD, ki še niso pobarvane.
območje: -0,8; -0,6 .. 5,4; 5,2
enota: 45
črta: 0; 2,5 -> 3; 4,5 | modra debelo
črta: 0; 2,5 -> 4,5; 3,5 | modra debelo
črta: 0; 2,5 -> 3; 2,5 | modra debelo
črta: 0; 2,5 -> 3; 0 | oranžna črtkano
črta: 0; 2,5 -> 4,5; 1 | oranžna črtkano
črta: 3; 4,5 -> 4,5; 3,5 -> 3; 2,5 -> 3; 4,5 | siva
točka: 0; 2,5 | A | levo
točka: 3; 4,5 | B | nad
točka: 4,5; 3,5 | C | desno
točka: 3; 2,5 | D | pod
točka: 3; 0 | E | pod
točka: 4,5; 1 | F | desno
:::

- Tri debele polne črte iz $A$ so tiste, ki jih zagotovi Dirichlet.
- Sive črte $BC$, $CD$ in $BD$ še čakajo na barvo. Če katerokoli pobarvaš polno, se zapre poln trikotnik z $A$.
- Če vse tri pobarvaš črtkano, je trikotnik $BCD$ črtkan.

Povezav $E$ in $F$ ter vseh drugih sploh ne potrebujemo. To je tipično za tekmovalne dokaze: odločilen je majhen del slike.

## Drugače: Bolj natančno

**Splošna ocena.** Za Ramseyjeva števila velja $R(2, t) = t$ in rekurzivna ocena

$$R(s, t) \le R(s - 1, t) + R(s, t - 1)$$

Dokaz je enak kot pri trikotnikih. Vzemimo polni graf na $R(s - 1, t) + R(s, t - 1)$ točkah. Točka $A$ ima v njem $R(s - 1, t) + R(s, t - 1) - 1$ povezav, zato po Dirichletu vsaj $R(s - 1, t)$ polnih ali vsaj $R(s, t - 1)$ črtkanih. V prvem primeru je med polnimi sosedi poln $K_{s-1}$ (skupaj z $A$ poln $K_s$) ali črtkan $K_t$. Drugi primer je simetričen. Ocena da $R(3, 4) \le 4 + 6 = 10$; prava vrednost je $9$. Znano je še $R(4, 4) = 18$, za $R(5, 5)$ pa le, da leži med $43$ in $46$.

**Tri barve.** Primer 3 pokaže, da je pri treh barvah dovolj $17$ točk. Obstaja barvanje $K_{16}$ s tremi barvami brez enobarvnega trikotnika, zato je $17$ najmanjše možno število.

**Koliko enobarvnih trikotnikov?** V $K_6$ sta vedno vsaj dva. Štej »dvobarvne kote«: pare povezav iz iste točke z različnima barvama. Točka z $r$ polnimi in $5 - r$ črtkanimi povezavami ima $r(5 - r) \le 6$ takih parov, vseh skupaj je največ $6 \cdot 6 = 36$. Trikotnik, ki ni enobarven, ima natanko dva dvobarvna kota, zato je takih trikotnikov največ $\frac{36}{2} = 18$. Enobarvnih je vsaj $20 - 18 = 2$. Dvojno štetje in Dirichlet sta tu spet glavni orodji.

## Preveri se

? Na risbi je omrežje petih naprav. Katere točke imajo liho stopnjo?
:::risba skica
opis: Graf s petimi točkami A, B, C, D, E in sedmimi povezavami: AB, AC, BC, BD, CD, CE in DE.
območje: -0,8; -1,2 .. 4,8; 3,2
enota: 50
črta: 0; 1 -> 2; 2,5 -> 4; 2,5 -> 4; -0,5 -> 2; -0,5 -> 0; 1 | modra
črta: 2; 2,5 -> 2; -0,5 -> 4; 2,5 | modra
točka: 0; 1 | A | levo
točka: 2; 2,5 | B | nad
točka: 2; -0,5 | C | pod
točka: 4; 2,5 | D | nad
točka: 4; -0,5 | E | pod
:::
- Samo točka $B$.
~ Točk z liho stopnjo je vedno sodo mnogo. Preštej še povezave v točki $D$: $BD$, $CD$ in $DE$.
+ Točki $B$ in $D$.
- Točka $C$.
~ Iz $C$ gredo štiri povezave ($CA$, $CB$, $CD$, $CE$), kar je sodo število.
- Nobena, vse stopnje so sode.
~ Iz $B$ gredo tri povezave: $BA$, $BC$ in $BD$.
> Stopnje so $2$, $3$, $4$, $3$, $2$ za $A$, $B$, $C$, $D$, $E$. Vsota $14$ je $2 \cdot 7$, liho stopnjo imata dve točki, kot zahteva lema o rokovanju.

? Omrežje ima $250$ naprav, vsaka je povprečno povezana s približno $4{,}8$ drugimi. Oceni, koliko povezav ima omrežje.
= 600 | 15
~ 1200 | To je vsota stopenj. Vsaka povezava je v njej šteta dvakrat, zato deli z $2$.
~ 31125 | To je število vseh parov naprav, kot da bi bila povezana vsaka z vsako.
> $m = \frac{250 \cdot 4{,}8}{2} = 600$.

? Zakaj je $R(3, 3) = 6$ in ne $5$?
- Ker dokaz pri $K_5$ ne deluje: iz točke gredo le štiri povezave.
~ Neuspel dokaz ne pove, da trditev ne velja; morda bi uspel drug dokaz. Potrebuješ protiprimer.
+ Ker obstaja barvanje $K_5$ brez enobarvnega trikotnika: polne stranice petkotnika, črtkane diagonale.
- Ker ima $K_5$ liho število točk.
~ Parnost točk tu ne igra vloge. Pri sedmih točkah enobarvni trikotnik vedno obstaja, saj $K_7$ vsebuje $K_6$.
> Za »pet ne zadošča« je potrebno eno konkretno barvanje $K_5$ brez enobarvnega trikotnika. Petkotnik z zvezdo je tak.

? V omrežju je $15$ naprav in $45$ povezav. Vsaka naprava je povezana z enakim številom drugih. S koliko?
= 6
~ 3 | Delil si $45$ s $15$ in pozabil, da vsako povezavo štejeta obe krajišči: $15d = 2 \cdot 45$.
> Po lemi o rokovanju je $15 \cdot d = 2 \cdot 45 = 90$, zato $d = 6$.

? Šest dijakov se pripravlja na tekmovanje. Vsak par je bodisi že bil v isti ekipi bodisi še nikoli. Kaj zagotovo velja?
- Obstajajo trije dijaki, od katerih je vsak par že bil v isti ekipi.
~ Izrek ne izbere barve. Če ni bil nihče z nikomer v ekipi, takih treh ni.
+ Obstajajo trije, od katerih je vsak par že bil v isti ekipi, ali trije, od katerih ni bil noben par.
- Vsak dijak je že bil v ekipi z vsaj tremi drugimi.
~ Dirichlet v eni točki da tri povezave *iste* barve, lahko so to tri »nikoli«.
- Obstajajo štirje dijaki, med katerimi so vsi pari enaki.
~ Za štiri točke potrebuješ veliko več: $R(4, 4) = 18$, šest dijakov ne zadošča.
> Dijaki so točke, »že v ekipi« in »nikoli« sta barvi povezav $K_6$. Ker je $R(3, 3) = 6$, obstaja enobarvni trikotnik, ne vemo pa, katere barve.

<<RACUN
vrednost: 6*5/2 | 15
vrednost: binomial(6, 3) | 20
vrednost: ceiling(5/2) | 3
vrednost: ceiling(4/2) | 2
vrednost: 7*3 | 21
vrednost: 2+3+3+3+4 | 15
vrednost: 9*3 | 27
vrednost: 10*3/2 | 15
resi: 4*x+3*(12-x)=40 | x | 4
vrednost: 4*4+8*3 | 40
vrednost: ceiling(16/3) | 6
vrednost: 2+3+4+3+2 | 14
vrednost: 250*4.8/2 | 600
vrednost: 250*249/2 | 31125
resi: 15*d=2*45 | d | 6
vrednost: binomial(6, 3) - 6*6/2 | 2
>>

:::simboli
m | število povezav | m = \frac{1}{2}\left(d(v_1) + \dots + d(v_n)\right) | | v $K_n$ je $m = \binom{n}{2}$
n | število točk grafa | | |
d | stopnja točke, $d(v)$ | | | število povezav s krajiščem v $v$
v_1, v_2, v_n | točke grafa | | |
K_n | polni graf na $n$ točkah | | | vsak par točk je povezan
R | Ramseyjevo število $R(s, t)$ | | | najmanjši $n$, da ima vsako barvanje $K_n$ poln $K_s$ ali črtkan $K_t$
s, t | velikosti iskanih enobarvnih polnih grafov | | |
N | število predmetov (Dirichlet) | | |
k | število predalov (Dirichlet) | | |
x | število točk s stopnjo $4$ | | |
:::
