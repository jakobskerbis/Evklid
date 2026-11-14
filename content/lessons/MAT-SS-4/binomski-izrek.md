---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na turističnem zemljevidu mesta s pravokotno mrežo ulic (tak je na primer Manhattan v New Yorku) leži muzej $4$ odseke ulice vzhodno in $4$ odseke severno od hotela. Odsek je del ulice med dvema sosednjima križiščema. Vsaka najkrajša pot do muzeja je dolga $8$ odsekov. Koliko je različnih najkrajših poti?

Večina ljudi ugiba $8$ ali $16$. Pravih je $70$. Še bolj nenavadno je, kje se isto število pojavi drugič: ko z množenjem razviješ $(a+b)^8$, stoji pred členom $a^4 b^4$ natanko koeficient $70$. Zemljevid in algebra štejeta isto stvar.

To ni naključje. Binomski izrek pove, kako potenco dvočlenika $(a+b)^n$ razviješ v enem koraku, brez osmih zaporednih množenj. Potreboval ga boš pri verjetnosti zaporednih poskusov, pri približnem računanju potenc in povsod, kjer štejemo izbire »ali – ali«.

## Razlaga

**1. Štetje poti na zemljevidu.** Vzemimo manjši zemljevid: muzej $M$ je $3$ odseke vzhodno in $2$ odseka severno od hotela $H$. Najkrajša pot gre vedno samo proti vzhodu (V) ali severu (S). Ob vsako križišče zapišemo, po koliko najkrajših poteh pridemo do njega.

:::risba skica
opis: Mreža ulic s 3 odseki v smeri vzhoda in 2 odsekoma v smeri severa. Hotel H je spodaj levo, muzej M zgoraj desno. Ob križiščih je število najkrajših poti iz H. Spodnja vrsta: 1, 1, 1, 1. Srednja vrsta: 1, 2, 3, 4. Zgornja vrsta: 1, 3, 6, 10. Pri muzeju je 10.
območje: -1; -1 .. 4,5; 3
enota: 55
črta: 0; 0 -> 3; 0 | siva
črta: 0; 1 -> 3; 1 | siva
črta: 0; 2 -> 3; 2 | siva
črta: 0; 0 -> 0; 2 | siva
črta: 1; 0 -> 1; 2 | siva
črta: 2; 0 -> 2; 2 | siva
črta: 3; 0 -> 3; 2 | siva
točka: 0; 0 | 1 | nad desno
točka: 1; 0 | 1 | nad desno
točka: 2; 0 | 1 | nad desno
točka: 3; 0 | 1 | nad desno
točka: 0; 1 | 1 | nad desno
točka: 1; 1 | 2 | nad desno
točka: 2; 1 | 3 | nad desno
točka: 3; 1 | 4 | nad desno
točka: 0; 2 | 1 | nad desno
točka: 1; 2 | 3 | nad desno
točka: 2; 2 | 6 | nad desno
točka: 3; 2 | 10 | nad desno | oranžna
napis: 0; -0,5 | H (hotel) | pod
napis: 3,6; 2,5 | M (muzej) | desno
:::

Do križišča na robu (samo vzhodno ali samo severno) vodi ena pot. Do vsakega drugega križišča prideš ali od zahoda ali od juga. Zato je število ob križišču **vsota števil levo in spodaj**: $3 + 3 = 6$, nato $6 + 4 = 10$. Do muzeja vodi $10$ poti.

Isto število da kombinatorika. Pot do muzeja je $5$ odsekov, od tega $2$ proti severu. Ko izberemo, kateri $2$ od $5$ korakov sta severna, je pot določena. Takih izbir je $C_5^2 = \binom{5}{2} = 10$.

**2. Pascalov trikotnik.** Zavrti zemljevid tako, da je hotel na vrhu. Križišča, enako oddaljena od hotela, se zdaj zvrstijo v vodoravne vrste, njihova števila pa tvorijo **Pascalov trikotnik**. Vrstice štejemo od $0$: vrstica $n$ ustreza potem, dolgim $n$ odsekov.

:::risba skica
opis: Pascalov trikotnik, vrstice od 0 do 6. Vrstica 0: 1. Vrstica 1: 1, 1. Vrstica 2: 1, 2, 1. Vrstica 3: 1, 3, 3, 1. Vrstica 4: 1, 4, 6, 4, 1. Vrstica 5: 1, 5, 10, 10, 5, 1. Vrstica 6: 1, 6, 15, 20, 15, 6, 1. Puščici kažeta, da se 4 in 6 iz vrstice 4 seštejeta v 10 v vrstici 5.
območje: -1; -0,6 .. 13; 6,6
enota: 22
napis: 6; 6 | 1 | sredina
napis: 5; 5 | 1 | sredina
napis: 7; 5 | 1 | sredina
napis: 4; 4 | 1 | sredina
napis: 6; 4 | 2 | sredina
napis: 8; 4 | 1 | sredina
napis: 3; 3 | 1 | sredina
napis: 5; 3 | 3 | sredina
napis: 7; 3 | 3 | sredina
napis: 9; 3 | 1 | sredina
napis: 2; 2 | 1 | sredina
napis: 4; 2 | 4 | sredina | oranžna
napis: 6; 2 | 6 | sredina | oranžna
napis: 8; 2 | 4 | sredina
napis: 10; 2 | 1 | sredina
napis: 1; 1 | 1 | sredina
napis: 3; 1 | 5 | sredina
napis: 5; 1 | 10 | sredina | oranžna
napis: 7; 1 | 10 | sredina
napis: 9; 1 | 5 | sredina
napis: 11; 1 | 1 | sredina
napis: 0; 0 | 1 | sredina
napis: 2; 0 | 6 | sredina
napis: 4; 0 | 15 | sredina
napis: 6; 0 | 20 | sredina
napis: 8; 0 | 15 | sredina
napis: 10; 0 | 6 | sredina
napis: 12; 0 | 1 | sredina
puščica: 4,2; 1,7 -> 4,8; 1,35 | oranžna
puščica: 5,8; 1,7 -> 5,2; 1,35 | oranžna
:::

Iz slike preberemo tri pravila:

- **Pravilo sosedov:** vsako notranje število je vsota obeh sosedov, ki stojita nad njim ($4 + 6 = 10$). Na robu so enice.
- **Simetrija:** vrstica se bere enako z leve in z desne.
- **Vsota vrstice** $n$ je $2^n$, saj ima vsak od $n$ korakov dve možnosti: $1 + 6 + 15 + 20 + 15 + 6 + 1 = 64 = 2^6$.

:::premisli
Napovej vrstico $7$, ne da bi jo kje prepisal. Kolikšna mora biti njena vsota?
---
$1, 7, 21, 35, 35, 21, 7, 1$ (na primer $6 + 15 = 21$ in $15 + 20 = 35$). Vsota je $2^7 = 128$, kar je dvakratnik vsote vrstice $6$: vsako število vrstice $6$ prispeva k dvema sosedoma spodaj.
:::

**3. Od poti do oklepajev.** Zakaj se ista števila pojavijo pri potencah? Poglej $(V+S)^2 = (V+S)(V+S)$. Iz vsakega oklepaja vzamemo $V$ ali $S$, natanko kot na vsakem odseku poti izberemo smer:

$$(V+S)^2 = VV + VS + SV + SS = V^2 + 2VS + S^2$$

Člena $VS$ in $SV$ sta dve različni poti, ki se končata v istem križišču, zato se seštejeta v $2VS$. Pri $(a+b)^n$ množimo $n$ oklepajev. Člen $a^{n-k}b^k$ dobimo vsakič, ko iz $k$ oklepajev vzamemo $b$, iz ostalih pa $a$. Takih izbir je $\binom{n}{k}$.

**4. Pravila za višje potence.** Iz vrstice $4$ Pascalovega trikotnika takoj zapišemo:

$$(a+b)^4 = a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4$$

Za vsak $n$ velja:

- razvoj ima $n + 1$ členov;
- eksponent pri $a$ pada od $n$ do $0$, eksponent pri $b$ raste od $0$ do $n$;
- v vsakem členu je vsota eksponentov enaka $n$;
- koeficienti so vrstica $n$ Pascalovega trikotnika.

**5. Binomski izrek.** Zdaj pravila zapišemo s simboli. **Binomski simbol** $\binom{n}{k}$ (beri »$n$ nad $k$«) je število kombinacij $C_n^k = \frac{n!}{k!\,(n-k)!}$ iz kombinatorike in hkrati $k$-to število v vrstici $n$ (štejemo od $0$):

$$(a+b)^n = \binom{n}{0}a^n + \binom{n}{1}a^{n-1}b + \binom{n}{2}a^{n-2}b^2 + \dots + \binom{n}{n}b^n$$

Člen, ki vsebuje $\binom{n}{k}$, je po vrsti $(k+1)$-ti, zato ga imenujemo **splošni člen**:

$$T_{k+1} = \binom{n}{k}a^{n-k}b^k$$

Pravilo sosedov v simbolih je $\binom{n}{k} + \binom{n}{k+1} = \binom{n+1}{k+1}$, simetrija pa $\binom{n}{k} = \binom{n}{n-k}$.

**6. Dvočlenik z minusom.** $(a-b)^n$ zapišemo kot $(a+(-b))^n$. Liha potenca števila $-b$ je negativna, soda pozitivna, zato se predznaki izmenjujejo:

$$(a-b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$$

:::premisli
Koliko je vsota vseh koeficientov v razvoju $(x-1)^7$? Odgovori brez razvijanja.
---
$0$. Vsoto koeficientov dobiš, če vstaviš $x = 1$, in $(1-1)^7 = 0$. Pozitivni in negativni koeficienti se natanko izničijo.
:::

## Rešeni primeri

### Primer 1 (lažji): poti po mestu

Turistka gre od postaje do razgledne točke $4$ odseke vzhodno in $2$ odseka severno, vedno po najkrajši poti. Koliko je takih poti? Kateri koeficient v razvoju $(V+S)^6$ jih šteje?

**Podatki:** $4$ koraki proti vzhodu, $2$ koraka proti severu, skupaj $n = 6$
**Iščemo:** število najkrajših poti in ustrezni koeficient

:::formula
$T_{k+1} = \binom{n}{k}a^{n-k}b^k$, tu $a = V$, $b = S$
:::

**Rešitev:**

1. Pot je določena, ko izberemo, katera $2$ od $6$ korakov sta severna, zato $k = 2$.
2. $\binom{6}{2} = \frac{6 \cdot 5}{2} = 15$, kar je tudi število $15$ v vrstici $6$ Pascalovega trikotnika.
3. V razvoju $(V+S)^6$ je to koeficient člena $15V^4S^2$.
4. Odgovor: turistka lahko izbira med $15$ najkrajšimi potmi; šteje jih koeficient pri $V^4S^2$.

### Primer 2: dvočlenik z minusom

Razvij $(x-2)^5$.

**Podatki:** dvočlenik $x - 2$, torej $a = x$, $b = -2$; eksponent $n = 5$
**Iščemo:** razvoj potence

:::formula
$(a+b)^5 = a^5 + 5a^4b + 10a^3b^2 + 10a^2b^3 + 5ab^4 + b^5$
:::

**Rešitev:**

1. Koeficienti iz vrstice $5$: $1, 5, 10, 10, 5, 1$.
2. Potence $b = -2$: $1$; $-2$; $4$; $-8$; $16$; $-32$ (liha potenca negativna).
3. Zmnožimo po vrsti: $5 \cdot (-2) = -10$, $10 \cdot 4 = 40$, $10 \cdot (-8) = -80$, $5 \cdot 16 = 80$.
4. Odgovor: $(x-2)^5 = x^5 - 10x^4 + 40x^3 - 80x^2 + 80x - 32$.

Preizkus: pri $x = 1$ je leva stran $(-1)^5 = -1$, desna pa $1 - 10 + 40 - 80 + 80 - 32 = -1$.

### Primer 3 (težji): člen brez $x$

V razvoju $\left(x^2 - \frac{2}{x}\right)^6$ poišči člen, ki ne vsebuje $x$, in koeficient pri $x^3$.

**Podatki:** $a = x^2$, $b = -\frac{2}{x}$, $n = 6$
**Iščemo:** člen brez $x$ in koeficient pri $x^3$

:::formula
$T_{k+1} = \binom{6}{k}(x^2)^{6-k}\left(-\frac{2}{x}\right)^k = \binom{6}{k}(-2)^k x^{12-3k}$
:::

**Rešitev:**

1. Splošni člen poenostavimo: $(x^2)^{6-k} = x^{12-2k}$ in $\frac{1}{x^k} = x^{-k}$, skupaj $x^{12-3k}$.
2. Člen brez $x$ ima eksponent $0$: $12 - 3k = 0$, torej $k = 4$.
3. $T_5 = \binom{6}{4}(-2)^4 = 15 \cdot 16 = 240$. Predznak je pozitiven, ker je potenca soda.
4. Za $x^3$: $12 - 3k = 3$, torej $k = 3$ in koeficient $\binom{6}{3}(-2)^3 = 20 \cdot (-8) = -160$.
5. Odgovor: člen brez $x$ je peti člen, $240$; koeficient pri $x^3$ je $-160$.

### Primer 4: zdaj ti

Poišči koeficient pri $x^3$ v razvoju $(2x-1)^5$.

**Podatki:** $a = 2x$, $b = -1$, $n = 5$
**Iščemo:** koeficient pri $x^3$

:::formula
$T_{k+1} = \binom{5}{k}(2x)^{5-k}(-1)^k$
:::

**Rešitev:**

1. Potenca $x^3$ pride iz $(2x)^{3}$, zato $5 - k = 3$ in $k = 2$.
2. V koeficient gre cela potenca $(2x)^3 = 8x^3$, ne le $x^3$.
3. Izračunaj sam $\binom{5}{2} \cdot 2^3 \cdot (-1)^2$, nato preveri:

:::premisli
Koliko je koeficient pri $x^3$?
---
$\binom{5}{2} \cdot 8 \cdot 1 = 10 \cdot 8 = 80$. Predznak je pozitiven, ker je $(-1)^2 = 1$.
:::

## Pogoste napake

- **»Potenca se razdeli.«** Zapis $(a+b)^3 = a^3 + b^3$ je napačen: izpusti vse mešane člene, torej vse poti, ki zavijejo. Pravilno: razvoj ima $n + 1$ členov.
- **Število pred spremenljivko ostane brez potence.** Pri $(2x-1)^5$ nekdo vzame $(2x)^3$ kot $2x^3$ in dobi $20$ namesto $80$. Potenciraš cel člen, tudi število in predznak.
- **Minus samo pri zadnjem členu.** Pri $(a-b)^n$ so negativni vsi členi z liho potenco $b$, ne le zadnji. Pomagaj si z $(a+(-b))^n$.
- **Napačna vrstica ali napačen člen.** Vrstica $1, 4, 6, 4, 1$ je vrstica $4$, ne $5$, ker štejemo od $0$. Člen z $\binom{n}{k}$ je $(k+1)$-ti: člen brez $x$ v primeru 3 je peti, čeprav je $k = 4$.
- **Koeficient je le binomski simbol.** Pri $(x+3)^5$ koeficient pri $x^3$ ni $\binom{5}{2} = 10$, ampak $10 \cdot 3^2 = 90$: zraven gre potenca drugega člena.

## Povzetek

- Pascalov trikotnik: robovi so $1$, notranje število je vsota sosedov nad njim; vrstica $n$ (štejemo od $0$) ima vsoto $2^n$.
- Binomski simbol $\binom{n}{k} = C_n^k = \frac{n!}{k!\,(n-k)!}$ je $k$-to število vrstice $n$.
- Binomski izrek: $(a+b)^n = \binom{n}{0}a^n + \binom{n}{1}a^{n-1}b + \dots + \binom{n}{n}b^n$; $n + 1$ členov, eksponenti pri $a$ padajo, pri $b$ rastejo, vsota je vedno $n$.
- Splošni člen $T_{k+1} = \binom{n}{k}a^{n-k}b^k$; za člen z $x^m$ izenači eksponent z $m$ in izračunaj $k$.
- $(a-b)^n$: predznaki se izmenjujejo; potenciraj cel člen, tudi število.

## Drugače: Z analogijo

Razvoj $(a+b)^n$ je kot sestavljanje kosila v menzi z $n$ okenci. Pri vsakem okencu vzameš eno od dveh jedi, $a$ ali $b$. Ko pladenj pride do blagajne, blagajničarka ne gleda vrstnega reda, le koliko kosov $b$ imaš. Pladnjev s $k$ kosi $b$ je toliko, kolikor je načinov, da izbereš $k$ okenc od $n$, torej $\binom{n}{k}$. Vsota vseh pladnjev, razvrščenih po številu kosov $b$, je natanko razvoj $(a+b)^n$.

Če je jed $b$ »negativna« (na primer vračilo kupona), vsak par kuponov da spet plus. Zato se pri $(a-b)^n$ predznaki izmenjujejo.

## Drugače: Iz vsakdanjega življenja

Na potovanju z vlakom imaš $5$ prestopnih postaj in na vsaki izbereš ekspresni ali regionalni vlak. Vseh kombinacij je $2^5 = 32$, kar je vsota vrstice $5$: $1 + 5 + 10 + 10 + 5 + 1$. Natanko $2$ ekspresna vlaka izbereš na $\binom{5}{2} = 10$ načinov.

Lep stranski pojav: $11^2 = 121$, $11^3 = 1331$ in $11^4 = 14641$. To so vrstice Pascalovega trikotnika, ker je $11 = 10 + 1$ in je $(10+1)^4 = 1 \cdot 10^4 + 4 \cdot 10^3 + 6 \cdot 10^2 + 4 \cdot 10 + 1$. Pri $11^5$ se zatakne, ker je v vrstici $5$ dvomestno število $10$ in se njegova enica prenese na sosednje mesto.

## Preveri se

? Na risbi je del mestnega zemljevida; ob križiščih so števila, izračunana po pravilu sosedov. Kaj pomeni število $6$ pri križišču $C$?
:::risba skica
opis: Mreža ulic 2 krat 2 odseka. Hotel H je spodaj levo, križišče C zgoraj desno. Spodnja vrsta: 1, 1, 1. Srednja vrsta: 1, 2, 3. Zgornja vrsta: 1, 3, 6. Pri C je 6.
območje: -1; -1 .. 3,5; 3
enota: 60
črta: 0; 0 -> 2; 0 | siva
črta: 0; 1 -> 2; 1 | siva
črta: 0; 2 -> 2; 2 | siva
črta: 0; 0 -> 0; 2 | siva
črta: 1; 0 -> 1; 2 | siva
črta: 2; 0 -> 2; 2 | siva
točka: 0; 0 | 1 | nad desno
točka: 1; 0 | 1 | nad desno
točka: 2; 0 | 1 | nad desno
točka: 0; 1 | 1 | nad desno
točka: 1; 1 | 2 | nad desno
točka: 2; 1 | 3 | nad desno
točka: 0; 2 | 1 | nad desno
točka: 1; 2 | 3 | nad desno
točka: 2; 2 | 6 | nad desno
napis: 0; -0,5 | H | pod
napis: 2,6; 2,5 | C | desno
:::
- Število odsekov, ki jih prehodiš od $H$ do $C$.
~ Do $C$ prehodiš $4$ odseke. Število $6$ šteje poti, ne korakov.
+ Število najkrajših poti od $H$ do $C$, torej $\binom{4}{2}$.
- Število križišč, mimo katerih greš od $H$ do $C$.
~ Vsaka najkrajša pot gre mimo enako mnogo križišč. Število ob križišču je vsota števil levo in spodaj, torej šteje poti.
> Pot do $C$ ima $4$ korake, od tega $2$ severna: $\binom{4}{2} = 6$. To je tudi koeficient pri $a^2b^2$ v $(a+b)^4$.

? Razvrsti korake, s katerimi poiščeš člen brez $x$ v razvoju $\left(x + \frac{1}{x^2}\right)^9$.
1. Zapiši splošni člen $\binom{9}{k}x^{9-k}\left(\frac{1}{x^2}\right)^k$.
2. Združi potence: $x^{9-3k}$.
3. Eksponent izenači z $0$ in izračunaj $k = 3$.
4. Vstavi $k$ v splošni člen in izračunaj koeficient.
> Najprej splošni člen, nato skupni eksponent $x$, iz pogoja »eksponent $0$« dobiš $k$ in šele na koncu število $\binom{9}{3} = 84$.

? Kaj se zgodi z razvojem $(a+b)^6$, če $b$ zamenjamo z $-b$?
- Vsi členi postanejo negativni.
~ Soda potenca $-b$ je pozitivna, zato členi z $b^0$, $b^2$, $b^4$, $b^6$ ostanejo pozitivni.
- Spremeni se le predznak zadnjega člena.
~ Zadnji člen je $(-b)^6 = b^6$, torej celo ostane pozitiven. Negativni so členi z liho potenco $b$.
+ Koeficienti po absolutni vrednosti ostanejo enaki, negativni postanejo členi z liho potenco $b$.
> $(a-b)^6 = a^6 - 6a^5b + 15a^4b^2 - 20a^3b^3 + 15a^2b^4 - 6ab^5 + b^6$: predznaki se izmenjujejo.

? (brez računala) Koliko je koeficient pri $x^3$ v razvoju $(x+3)^5$?
= 90
~ 10 | To je samo $\binom{5}{2}$. Koeficient vsebuje še $3^2 = 9$.
~ 30 | Število $3$ je treba kvadrirati: člen je $\binom{5}{2}x^3 \cdot 3^2$.
~ 270 | Vzel si $k = 3$. Pri $x^3$ je potenca drugega člena $5 - 3 = 2$.
> $x^3$ pomeni $5 - k = 3$, torej $k = 2$: $\binom{5}{2} \cdot 3^2 = 10 \cdot 9 = 90$.

? Izračunaj člen brez $x$ v razvoju $\left(2x - \frac{1}{x}\right)^6$.
= -160
~ 160 | Pri $k = 3$ je $(-1)^3 = -1$, zato je člen negativen.
~ 20 | Pozabil si potenco $2^3 = 8$ in predznak: potenciraš cel člen $2x$.
~ -20 | Pozabil si, da $2$ iz $2x$ potenciraš: $(2x)^3 = 8x^3$.
> Splošni člen $\binom{6}{k}2^{6-k}(-1)^k x^{6-2k}$; $6 - 2k = 0$ da $k = 3$, člen pa je $20 \cdot 8 \cdot (-1) = -160$.

<<RACUN
vrednost: factorial(8)/(factorial(4)*factorial(4)) | 70
vrednost: factorial(5)/(factorial(2)*factorial(3)) | 10
vrednost: 1+6+15+20+15+6+1 | 64
enako: (V+S)^2 | V^2+2*V*S+S^2
enako: (a+b)^4 | a^4+4*a^3*b+6*a^2*b^2+4*a*b^3+b^4
enako: (a-b)^3 | a^3-3*a^2*b+3*a*b^2-b^3
vrednost: 6*5/2 | 15
enako: (x-2)^5 | x^5-10*x^4+40*x^3-80*x^2+80*x-32
enako: (x^2-2/x)^6 | x^12-12*x^9+60*x^6-160*x^3+240-192/x^3+64/x^6
vrednost: 10*2^3*(-1)^2 | 80
vrednost: 10*3^2 | 90
vrednost: factorial(9)/(factorial(3)*factorial(6)) | 84
vrednost: 20*2^3*(-1)^3 | -160
vrednost: 11^4 | 14641
>>

:::simboli
a, b | člena dvočlenika | | | v primerih npr. $a = x$, $b = -2$
n | eksponent potence (številka vrstice) | | | vrstice štejemo od $0$
k | število izbir drugega člena $b$ | | | $0 \le k \le n$
C_n | binomski simbol $\binom{n}{k}$ (»$n$ nad $k$«), število kombinacij $C_n^k$ | C_n^k = \binom{n}{k} = \frac{n!}{k!\,(n-k)!} | | $k$-to število v vrstici $n$
T_{k+1} | splošni ($(k+1)$-ti) člen razvoja | T_{k+1} = \binom{n}{k}a^{n-k}b^k | |
V | korak proti vzhodu | | | na zemljevidu
S | korak proti severu | | | na zemljevidu
x | spremenljivka | | |
:::
