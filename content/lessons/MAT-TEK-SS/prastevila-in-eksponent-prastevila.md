---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Uganka za začetek. Kalkulator na telefonu za $25!$, produkt vseh naravnih števil od $1$ do $25$, izpiše le $1{,}551121004 \cdot 10^{25}$. Število ima $26$ števk, zaslon pa jih pokaže deset. S koliko ničlami se $25!$ konča?

Poskusi, preden bereš naprej. Namig: vsako ničlo na koncu da en par $2 \cdot 5$. Ali je odgovor $2$, ker sta do $25$ samo dva večkratnika števila $10$? Ali $5$, ker je toliko večkratnikov števila $5$? Rešitev najdeš v razlagi.

Tekmovalne naloge to vprašanje rade zavijejo: največja potenca števila $12$, ki deli $50!$; najmanjši $n$, pri katerem $243$ deli $7^n - 1$. Jedro je vedno isto. Ne zanima nas, *ali* praštevilo deli število, ampak *kolikokrat*.

## Razlaga

**1. Od »ali deli« do »kolikokrat deli«.** Pri deljivosti si spraševal, ali $2 \mid 40$. Odgovor je da ali ne. Zdaj vprašamo več: kolikokrat lahko $40$ zaporedoma razpolovimo? $40 \to 20 \to 10 \to 5$, torej trikrat.

To število se imenuje **eksponent praštevila** $p$ v številu $n$ ali **$p$-adična valuacija**, oznaka $v_p(n)$. Je največji $k$, za katerega velja $p^k \mid n$. Iz razcepa ga prebereš kar kot eksponent: $40 = 2^3 \cdot 5$, zato $v_2(40) = 3$ in $v_5(40) = 1$. Če $p \nmid n$, je $v_p(n) = 0$.

| $n$ | razcep | ali $2 \mid n$? | $v_2(n)$ |
|---|---|---|---|
| $40$ | $2^3 \cdot 5$ | da | $3$ |
| $45$ | $3^2 \cdot 5$ | ne | $0$ |
| $96$ | $2^5 \cdot 3$ | da | $5$ |
| $1024$ | $2^{10}$ | da | $10$ |

Stolpec »ali« loči samo $45$ od ostalih. Stolpec $v_2$ loči vsa štiri števila. Telefon računa dvojiško: $96 = 1100000_2$ se konča s petimi ničlami, ker je $v_2(96) = 5$. V desetiškem zapisu potrebuje vsaka ničla en faktor $2$ in en faktor $5$, zato je ničel na koncu $\min(v_2(n), v_5(n))$.

**2. Računska pravila.** Pri množenju se eksponenti v razcepu seštejejo:

$$v_p(ab) = v_p(a) + v_p(b)$$

Pravilo spominja na logaritem, le da šteje samo faktorje $p$. Za vsoto takega pravila ni. Velja le $v_p(a + b) \ge \min(v_p(a), v_p(b))$, z enakostjo, kadar sta eksponenta različna.

Zveza s staro snovjo: $a \mid b$ natanko tedaj, ko je $v_p(a) \le v_p(b)$ za vsako praštevilo $p$. Pri največjem skupnem delitelju $D(a, b)$ vzameš manjši eksponent vsakega praštevila, pri najmanjšem skupnem večkratniku $v(a, b)$ (ne zamenjaj ga z $v_p$) pa večjega.

:::premisli
Velja $v_2(40) = 3$ in $v_2(24) = 3$. Napovej $v_2(40 + 24)$. Ali je res lahko kar $3$?
---
Ni: $40 + 24 = 64 = 2^6$, torej $v_2(64) = 6$. Pri enakih eksponentih se vsota lahko »poravna«: $2^3 \cdot 5 + 2^3 \cdot 3 = 2^3 \cdot 8$. Zato je pri vsoti zagotovljena le spodnja meja.
:::

**3. Legendrova formula.** Najprej oznaka: $\lfloor x \rfloor$ je **celi del** (spodnji), največje celo število, ki ni večje od $x$, na primer $\lfloor 7{,}8 \rfloor = 7$. Število $\lfloor n/m \rfloor$ pove, koliko večkratnikov $m$ je med $1$ in $n$.

Stari način za $v_5(25!)$: razcepi vsak faktor od $1$ do $25$ in seštej petice. Deluje, a je dolgo. Novi način šteje po plasteh. Vsak večkratnik $5$ prispeva eno petico, takih je $\lfloor 25/5 \rfloor = 5$. Vsak večkratnik $25$ prispeva še drugo, takih je $\lfloor 25/25 \rfloor = 1$. Skupaj $6$.

Za praštevilo $p$ in naravni $n$ velja **Legendrova formula**:

$$v_p(n!) = \left\lfloor \frac{n}{p} \right\rfloor + \left\lfloor \frac{n}{p^2} \right\rfloor + \left\lfloor \frac{n}{p^3} \right\rfloor + \dots$$

Vsota se ustavi, ko je $p^k > n$; naprej so vsi členi $0$.

Zdaj uganka. Dvojk je v $25!$ $12 + 6 + 3 + 1 = 22$, petic $5 + 1 = 6$. Par $2 \cdot 5$ sestaviš le šestkrat, zato se $25!$ konča s $6$ ničlami. V vsakem $n!$ je dvojk vsaj toliko kot petic, zato je ničel na koncu $n!$ kar $v_5(n!)$.

V simulaciji spodaj »Legendrova formula: eksponent praštevila v $n!$« izberi $p = 5$ in premakni $n$ s $24$ na $25$. Opazuj: polje $25$ dobi dve piki, vsota pa skoči za $2$, ne za $1$.

:::premisli
Zakaj z Legendrovo formulo ne smeš izračunati največje potence števila $6$, ki deli $12!$, tako da vstaviš $p = 6$?
---
Formula bi dala $\lfloor 12/6 \rfloor = 2$, pravi odgovor pa je $5$. Faktorja $2$ in $3$ v številu $6$ lahko prideta iz različnih števil, na primer $2$ iz $4$ in $3$ iz $9$. Pravilno: $v_2(12!) = 6 + 3 + 1 = 10$ in $v_3(12!) = 4 + 1 = 5$, torej je največja potenca $6^5$.
:::

**4. Lema o dvigu eksponenta (LTE).** Kongruence povedo, da $3 \mid 4^n - 1$, ker $4 \equiv 1 \pmod 3$. Ne povedo pa, s katero potenco trojke. To pokaže tabela:

| $n$ | $4^n - 1$ | $v_3(n)$ | $v_3(4^n - 1)$ |
|---|---|---|---|
| $1$ | $3$ | $0$ | $1$ |
| $2$ | $15$ | $0$ | $1$ |
| $3$ | $63$ | $1$ | $2$ |
| $9$ | $262\,143$ | $2$ | $3$ |

Zadnji stolpec je vedno za $1$ večji od tretjega, $1$ pa je ravno $v_3(4 - 1)$. Splošno pravilo je **lema o dvigu eksponenta** (angl. *lifting the exponent*, LTE). Naj bo $p$ **liho** praštevilo, $p \mid a - b$, $p \nmid a$ in $p \nmid b$. Potem za vsak naravni $n$ velja

$$v_p(a^n - b^n) = v_p(a - b) + v_p(n)$$

Zakaj? Razcepimo $a^n - b^n = (a - b)(a^{n-1} + a^{n-2}b + \dots + b^{n-1})$. Ker je $a \equiv b \pmod p$, je drugi oklepaj kongruenten $n a^{n-1}$ po modulu $p$. Če $p \nmid n$, ne prinese nobenega $p$. Pri $n = p$ prinese natanko enega; to pokaže račun po modulu $p^2$, kjer potrebujemo, da je $p$ lih. Iz teh dveh korakov sestaviš formulo za vsak $n$.

Pri $p = 2$ je drugače. Za liha $a$, $b$ in sod $n$ velja

$$v_2(a^n - b^n) = v_2(a - b) + v_2(a + b) + v_2(n) - 1$$

Pri lihem $n$ pa je $v_2(a^n - b^n) = v_2(a - b)$. Pogoje vedno preveri: pri $2^n - 1$ in $p = 3$ LTE ne velja, ker $3 \nmid 2 - 1$.

## Rešeni primeri

### Primer 1: ničle v dvojiškem zapisu

Računalnik zapiše $100!$ dvojiško. S koliko ničlami se zapis konča?

**Podatki:** število $100!$, zapis v osnovi $2$, praštevilo $p = 2$
**Iščemo:** število ničel na koncu, to je $v_2(100!)$

:::formula
$v_2(n!) = \left\lfloor \frac{n}{2} \right\rfloor + \left\lfloor \frac{n}{4} \right\rfloor + \left\lfloor \frac{n}{8} \right\rfloor + \dots$
:::

**Rešitev:**

1. Vsaka ničla na koncu dvojiškega zapisa je en faktor $2$, zato iščemo $v_2(100!)$.
2. Plasti: $\lfloor 100/2 \rfloor = 50$, $\lfloor 100/4 \rfloor = 25$, $\lfloor 100/8 \rfloor = 12$, $\lfloor 100/16 \rfloor = 6$, $\lfloor 100/32 \rfloor = 3$, $\lfloor 100/64 \rfloor = 1$.
3. Ker je $128 > 100$, so naslednji členi $0$.
4. Seštejemo: $50 + 25 + 12 + 6 + 3 + 1 = 97$.
5. Odgovor: dvojiški zapis $100!$ se konča s $97$ ničlami.

### Primer 2: osnova, ki ni praštevilo

Najdi največji naravni $k$, da $12^k \mid 50!$.

**Podatki:** $n = 50$, osnova $12 = 2^2 \cdot 3$
**Iščemo:** največji $k$

:::formula
$12^k \mid 50!$ natanko tedaj, ko je $2k \le v_2(50!)$ in $k \le v_3(50!)$
:::

**Rešitev:**

1. Za $12$ Legendrove formule ne smemo uporabiti, ker ni praštevilo. Razcep da $v_2(12^k) = 2k$ in $v_3(12^k) = k$.
2. $v_2(50!) = 25 + 12 + 6 + 3 + 1 = 47$.
3. $v_3(50!) = 16 + 5 + 1 = 22$.
4. Iz $2k \le 47$ sledi $k \le 23$, iz trojk pa $k \le 22$.
5. Veljati morata oba pogoja, zato odloča strožji: $k = 22$.
6. Odgovor: največji $k$ je $22$. Ozko grlo so trojke, čeprav je dvojk več kot dvakrat toliko.

### Primer 3: obratno vprašanje z LTE

Za katero najmanjše naravno število $n$ je $7^n - 1$ deljivo s $3^5 = 243$?

**Podatki:** $a = 7$, $b = 1$, $p = 3$, pogoj $v_3(7^n - 1) \ge 5$
**Iščemo:** najmanjši $n$

:::formula
$v_p(a^n - b^n) = v_p(a - b) + v_p(n)$, če je $p$ liho, $p \mid a - b$ in $p \nmid ab$
:::

**Rešitev:**

1. Pogoji: $3$ je liho, $7 - 1 = 6$ je deljivo s $3$, $3 \nmid 7$ in $3 \nmid 1$. LTE smemo uporabiti.
2. $v_3(7 - 1) = v_3(6) = 1$, zato je $v_3(7^n - 1) = 1 + v_3(n)$ za vsak $n$.
3. Pogoj $1 + v_3(n) \ge 5$ pomeni $v_3(n) \ge 4$, torej $81 \mid n$.
4. Najmanjši tak $n$ je $81$. Pri $n = 27$ je $v_3(7^{27} - 1) = 1 + 3 = 4$, kar je premalo.
5. Odgovor: $n = 81$. Brez LTE bi računal ostanke potenc števila $7$ po modulu $243$; z LTE je dovolj nekaj vrstic.

### Primer 4 – zdaj ti

Ali je $3^{64} - 1$ deljivo z $2^{10} = 1024$? Katera je največja potenca dvojke, ki ga deli?

**Podatki:** $a = 3$, $b = 1$, $n = 64$, $p = 2$
**Iščemo:** $v_2(3^{64} - 1)$ in ali je vsaj $10$

:::formula
$v_2(a^n - b^n) = v_2(a - b) + v_2(a + b) + v_2(n) - 1$ za liha $a$, $b$ in sod $n$
:::

**Rešitev:**

1. Praštevilo je $2$, zato vzamemo obliko za $p = 2$: $3$ in $1$ sta liha, $64$ je sod.
2. $v_2(3 - 1) = 1$, $v_2(3 + 1) = 2$, $v_2(64) = 6$.
3. Seštej sam in odgovori.

:::premisli
Koliko je $v_2(3^{64} - 1)$? Ali $1024 \mid 3^{64} - 1$? In kaj bi dobil, če bi po pomoti vzel osnovno obliko LTE?
---
$v_2(3^{64} - 1) = 1 + 2 + 6 - 1 = 8$. Število je deljivo z $2^8 = 256$, z $1024$ pa ne. Kdor pozabi člen $v_2(a + b) - 1$, dobi napačno $7$.
:::

## Pogoste napake

- **Samo prva plast.** Napačno: »$v_5(25!) = 25 : 5 = 5$, torej $5$ ničel.« Število $25$ prinese dve petici, pa jo šteješ enkrat. Popravek: seštevaj $\lfloor n/p^k \rfloor$, dokler je $p^k \le n$; $25!$ ima $6$ ničel.
- **Ničle z deljenjem z $10$.** Napačno: »$100!$ ima $100 : 10 = 10$ ničel.« Ničle ne dajejo le večkratniki $10$: že $4 \cdot 25 = 100$ prinese dve. Popravek: štej petice, $v_5(100!) = 20 + 4 = 24$.
- **Legendre za sestavljeno osnovo.** Napačno: »$12^k \mid 50!$ za $k = \lfloor 50/12 \rfloor + \lfloor 50/144 \rfloor = 4$.« Faktorja $2$ in $3$ prideta iz različnih števil. Popravek: razcepi osnovo in vzemi najstrožji pogoj (Primer 2 da $22$).
- **Valuacija vsote kot pri produktu.** Napačno: »$v_2(40 + 24) = v_2(40) + v_2(24) = 6$, ker velja vedno.« Tu se izide po naključju; pri $v_2(8 + 8)$ bi dobil napačno $6$ namesto $4$. Za vsoto velja le spodnja meja z minimumom.
- **LTE brez pogojev.** Napačno: osnovna oblika pri $p = 2$, npr. »$v_2(7^{16} - 1) = 1 + 4 = 5$«, pravilno je $1 + 3 + 4 - 1 = 7$. Ali pa LTE za $v_3(2^n - 1)$, kjer $3 \nmid 2 - 1$. Popravek: najprej preveri pogoje, pri $p = 2$ dodaj $v_2(a + b) - 1$.

## Povzetek

- $v_p(n)$ je največji $k$ s $p^k \mid n$, torej eksponent $p$ v razcepu. Velja $v_p(ab) = v_p(a) + v_p(b)$; za vsoto le $v_p(a + b) \ge \min(v_p(a), v_p(b))$.
- Ničle na koncu desetiškega zapisa: $\min(v_2, v_5)$; pri $n!$ kar $v_5(n!)$. Dvojiške ničle: $v_2$.
- Legendrova formula (samo za praštevilo $p$): $v_p(n!) = \lfloor n/p \rfloor + \lfloor n/p^2 \rfloor + \dots$
- Sestavljeno osnovo razcepi; največji $k$ določi najstrožji pogoj.
- LTE za liho $p$, $p \mid a - b$, $p \nmid ab$: $v_p(a^n - b^n) = v_p(a - b) + v_p(n)$. Pri $p = 2$ in sodem $n$ dodaj $v_2(a + b) - 1$.

## Drugače: Na sliki

Nad vsakim večkratnikom števila $5$ do $25$ zložimo toliko kock, kolikor je $v_5$ tega števila:

:::risba stolpci
opis: Stolpčni diagram. Nad števili 5, 10, 15, 20 je po ena kocka, nad številom 25 sta dve. Skupaj 6 kock.
os: v₅(k)
korak: 1
stolpec: 5 | 1
stolpec: 10 | 1
stolpec: 15 | 1
stolpec: 20 | 1
stolpec: 25 | 2
:::

Kocke lahko prešteješ na dva načina. Po stolpcih: razcepiš vsako število posebej, to je stari način. Po vrsticah: spodnja vrstica ima $5$ kock, to je $\lfloor 25/5 \rfloor$; druga vrstica ima $1$ kocko, to je $\lfloor 25/25 \rfloor$. Štetje po vrsticah je Legendrova formula. Število $125$ bi segalo v tretjo vrstico.

## Drugače: Iz vsakdanjega življenja

Fotografija na telefonu je široka $4096$ pikslov. Kolikokrat jo lahko pomanjšaš na polovico, da je število pikslov vedno celo? $4096 = 2^{12}$, torej $12$-krat: to je $v_2(4096)$.

Video ima $1920 \times 1080$ pikslov. Polovice: $960 \times 540$, $480 \times 270$, $240 \times 135$. Naprej ne gre, ker je $135$ liho. Širina bi zdržala $7$ razpolovitev ($1920 = 2^7 \cdot 15$), višina samo $3$ ($1080 = 2^3 \cdot 135$). Odloči manjša, kot pri $12^k$ v Primeru 2: veljati morata oba pogoja hkrati.

## Preveri se

? Katera trditev drži za vsako praštevilo $p$ in naravni števili $a$, $b$?
- $v_p(a + b) = v_p(a) + v_p(b)$
~ Seštevanje eksponentov velja za produkt, ne za vsoto. Že $v_2(1 + 1) = 1$, desna stran pa je $0$.
+ $v_p(ab) = v_p(a) + v_p(b)$
- $v_p(n)$ je število različnih praštevil, ki delijo $n$.
~ To je drug pojem. $v_p(n)$ šteje, kolikokrat se pojavi eno samo praštevilo $p$.
- Legendrova formula velja tudi, če je $p$ sestavljeno število.
~ Ne velja: faktorji sestavljenega števila lahko pridejo iz različnih števil, npr. pri $6$ in $12!$.
> Pri množenju se eksponenti v razcepu seštejejo, zato $v_p(ab) = v_p(a) + v_p(b)$.

? Stolpci kažejo $v_2(k)$ za $k = 1, 2, \dots, 8$. Z risbe odčitaj $v_2(8!)$.
:::risba stolpci
opis: Stolpčni diagram za števila od 1 do 8. Višine stolpcev: 1 ima 0, 2 ima 1, 3 ima 0, 4 ima 2, 5 ima 0, 6 ima 1, 7 ima 0, 8 ima 3.
os: v₂(k)
korak: 1
stolpec: 1 | 0
stolpec: 2 | 1
stolpec: 3 | 0
stolpec: 4 | 2
stolpec: 5 | 0
stolpec: 6 | 1
stolpec: 7 | 0
stolpec: 8 | 3
:::
= 7
~ 4 | Preštel si le soda števila (prva plast, $\lfloor 8/2 \rfloor$). Število $4$ prinese dve dvojki, $8$ pa tri.
~ 6 | Pozabil si tretjo plast: $8$ je deljivo z $2^3$, to doda še $\lfloor 8/8 \rfloor = 1$.
> Vsota višin: $0 + 1 + 0 + 2 + 0 + 1 + 0 + 3 = 7$. Po Legendru: $\lfloor 8/2 \rfloor + \lfloor 8/4 \rfloor + \lfloor 8/8 \rfloor = 4 + 2 + 1 = 7$.

? Poišči napako v rešitvi: »$v_2(7^{16} - 1)$: po LTE je $v_2(7 - 1) + v_2(16) = 1 + 4 = 5$.«
- Napake ni, rezultat je $5$.
~ Osnovna oblika LTE velja le za liho praštevilo. Pri $p = 2$ manjka člen.
+ Pri $p = 2$ in sodem $n$ manjka člen $v_2(7 + 1) - 1 = 2$, pravilno je $7$.
- LTE tu sploh ne velja, ker $2 \nmid 7$.
~ Pogoj je $p \mid a - b$, ne $p \mid a$. Res $2 \mid 7 - 1$, liha $a$ in $b$ pa sta ravno zahtevana.
> Za liha $a$, $b$ in sod $n$: $v_2(a^n - b^n) = v_2(a - b) + v_2(a + b) + v_2(n) - 1 = 1 + 3 + 4 - 1 = 7$.

? Primerjaj števili $A = 10^9 - 1$ (devet devetk) in $B = 10^6 - 1$ (šest devetk). Katero je deljivo z večjo potenco števila $3$?
- Enaki sta, ker je pri obeh $v_3(10 - 1) = 2$.
~ Pozabil si člen $v_3(n)$: eksponent $9$ prinese dve trojki, eksponent $6$ le eno.
- $A$, ker je $v_3(A) = 9$ in $v_3(B) = 6$: vsaka devetka da trojko.
~ Števke niso faktorji: $999\,999$ ima šest devetk, a le $v_3 = 3$.
+ $A$, ker je $v_3(A) = 4$ in $v_3(B) = 3$.
> LTE pri $p = 3$, $a = 10$, $b = 1$: $v_3(10^n - 1) = v_3(9) + v_3(n) = 2 + v_3(n)$. Za $n = 9$ dobiš $4$, za $n = 6$ pa $3$.

? Aplikacij na zaslonu telefona je $30$. Vseh razporeditev je $30!$. S koliko ničlami se konča to število?
- $3$
~ To je $30 : 10$. Ničle dajejo pari $2 \cdot 5$, ne le večkratniki $10$.
- $6$
~ Prešteta je le prva plast. Število $25$ prinese dve petici.
+ $7$
- $26$
~ To je $v_2(30!)$. Dvojk je več kot petic, zato število ničel določajo petice.
> $v_5(30!) = \lfloor 30/5 \rfloor + \lfloor 30/25 \rfloor = 6 + 1 = 7$, dvojk pa je $26$, zato je ničel $7$.

<<RACUN
vrednost: floor(25/5)+floor(25/25) | 6
vrednost: floor(25/2)+floor(25/4)+floor(25/8)+floor(25/16) | 22
vrednost: floor(100/2)+floor(100/4)+floor(100/8)+floor(100/16)+floor(100/32)+floor(100/64) | 97
vrednost: mod(factorial(100)/2^97, 2) | 1
vrednost: floor(50/2)+floor(50/4)+floor(50/8)+floor(50/16)+floor(50/32) | 47
vrednost: floor(50/3)+floor(50/9)+floor(50/27) | 22
vrednost: mod(factorial(50), 12^22) | 0
vrednost: floor(12/2)+floor(12/4)+floor(12/8) | 10
vrednost: floor(12/3)+floor(12/9) | 5
vrednost: mod(7^81-1, 3^5) | 0
vrednost: mod(7^27-1, 3^5) | 162
vrednost: mod(3^64-1, 2^10) | 256
vrednost: mod(7^16-1, 2^8) | 128
vrednost: mod(10^9-1, 3^5) | 81
vrednost: mod(10^6-1, 3^4) | 54
vrednost: floor(30/5)+floor(30/25) | 7
vrednost: floor(30/2)+floor(30/4)+floor(30/8)+floor(30/16) | 26
vrednost: floor(8/2)+floor(8/4)+floor(8/8) | 7
vrednost: 4^9-1 | 262143
vrednost: mod(4^9-1, 3^4) | 27
vrednost: floor(100/5)+floor(100/25) | 24
>>

:::simboli
v_p | eksponent praštevila $p$ ($p$-adična valuacija) | | | $v_p(n)$: največji $k$, da $p^k$ deli $n$
v_2 | eksponent dvojke | | | $v_2(n)$: ničle na koncu dvojiškega zapisa $n$
v_3 | eksponent trojke | | |
v_5 | eksponent petice | | | $v_5(n!)$: ničle na koncu desetiškega zapisa $n!$
p | praštevilo | | |
n | naravno število (pri $n!$ zgornja meja produkta) | | |
a, b | celi števili | | |
k | eksponent potence | | |
:::
