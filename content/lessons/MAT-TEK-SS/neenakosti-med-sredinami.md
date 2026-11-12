---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na klavirju poišči ton A s frekvenco $220\,\mathrm{Hz}$ in ton A oktavo više, $440\,\mathrm{Hz}$. Med njima je dvanajst poltonov. Tipka točno na sredini, šest poltonov od vsakega, je Dis. Kolikšno frekvenco ima?

Prvi odgovor je skoraj vedno $330\,\mathrm{Hz}$, povprečje. Napačno. Dis ima približno $311\,\mathrm{Hz}$. Ton s $330\,\mathrm{Hz}$ je E, ki je sedem poltonov nad spodnjim A. Uho namreč ne sliši razlik frekvenc, ampak razmerja: $311 : 220$ je skoraj natanko enako $440 : 311$.

Imamo torej dve različni »sredini« istih dveh števil, in ena je vedno manjša od druge. Ta neenakost in njene sorodnice so na tekmovanjih glavno orodje, ko iščeš največjo ali najmanjšo vrednost izraza ali dokazuješ neenakost.

## Razlaga

**1. Štiri sredine na premici.** Vzemi števili $2$ in $8$ ter poišči štiri različne »sredine«:

- **aritmetična sredina** $A$: od $2$ do nje je enako daleč kot od nje do $8$. To je $5$.
- **geometrijska sredina** $G$: od $2$ do nje pomnožiš z enakim faktorjem kot od nje do $8$. To je $4$, ker $2 \cdot 2 = 4$ in $4 \cdot 2 = 8$.
- **harmonična sredina** $H$: njena obratna vrednost je aritmetična sredina obratnih vrednosti $\frac12$ in $\frac18$. To je $3{,}2$.
- **kvadratna sredina** $K$: njen kvadrat je aritmetična sredina kvadratov $4$ in $64$. To je $\sqrt{34} \approx 5{,}83$.

:::risba premica
opis: Številska premica od 1 do 9. Označeni sta števili a = 2 in b = 8, med njima pa štiri sredine po vrsti od leve: H = 3,2, G = 4, A = 5 in K ≈ 5,83.
od: 1
do: 9
točka: 2 | a
točka: 8 | b
točka: 3,2 | H
točka: 4 | G
točka: 5 | A
točka: 5,83 | K
:::

Vse štiri ležijo med $2$ in $8$. Vrstni red od leve je $H$, $G$, $A$, $K$.

**2. Tabela za več parov.** Ali je ta vrstni red naključje? Poglej še druge pare:

| števili | $H$ | $G$ | $A$ |
|---|---|---|---|
| $2$ in $8$ | $3{,}2$ | $4$ | $5$ |
| $3$ in $12$ | $4{,}8$ | $6$ | $7{,}5$ |
| $1$ in $9$ | $1{,}8$ | $3$ | $5$ |
| $4$ in $4$ | $4$ | $4$ | $4$ |

V vsaki vrstici velja $H \le G \le A$. Bolj ko sta števili narazen, večje so razlike. Pri enakih številih se vse sredine zlijejo v eno.

:::premisli
Para $2$ in $8$ ter $1$ in $9$ imata enako aritmetično sredino $5$, geometrijsko pa $4$ in $3$. Kateri par števil z vsoto $10$ ima največjo geometrijsko sredino in kolikšna je?
---
Par $5$ in $5$, kjer je $G = A = 5$. Pri $1$ in $9$ je $\sqrt{1 \cdot 9} = 3$, pri $2$ in $8$ že $4$. Pri enaki vsoti je produkt manjši, ko sta števili bolj narazen. Zato je $G$ pri stalni $A$ največja, ko sta števili enaki.
:::

**3. Slika na polkrogu.** Daljico dolžine $a + b = 10$ razdeli s točko $C$ na dela $a = 8$ in $b = 2$. Nad njo nariši polkrog s središčem $O$.

:::risba skica
opis: Polkrog nad premerom PQ dolžine 10 s središčem O. Točka C deli premer na PC = a = 8 in CQ = b = 2. Navpična daljica CD do loka je dolga 4 (geometrijska sredina G). Polmer OD je dolg 5 (aritmetična sredina A). Iz C je spuščena pravokotnica na OD z nožiščem E; DE je dolga 3,2 (harmonična sredina H). Daljica CT do vrha T nad središčem je dolga √34 ≈ 5,83 (kvadratna sredina K).
območje: -0,5; -1 .. 10,5; 5,8
enota: 28
črta: 0; 0 -> 10; 0
črta: 10; 0 -> 9,83; 1,29 -> 9,33; 2,5 -> 8,54; 3,54 -> 7,5; 4,33 -> 6,29; 4,83 -> 5; 5 -> 3,71; 4,83 -> 2,5; 4,33 -> 1,46; 3,54 -> 0,67; 2,5 -> 0,17; 1,29 -> 0; 0 | siva
črta: 5; 0 -> 6,08; 1,44 | oranžna debelo
črta: 6,08; 1,44 -> 8; 4 | zelena debelo
črta: 8; 0 -> 8; 4 | modra debelo
črta: 8; 0 -> 6,08; 1,44 | siva črtkano
črta: 8; 0 -> 5; 5 | rdeča črtkano
črta: 5; 0 -> 5; 5 | siva črtkano
točka: 0; 0 | P | pod
točka: 10; 0 | Q | pod
točka: 5; 0 | O | pod
točka: 8; 0 | C | pod
točka: 8; 4 | D | desno
točka: 6,08; 1,44 | E | levo
točka: 5; 5 | T | nad
napis: 2,5; 0,3 | a | nad
napis: 9; 0,3 | b | nad
napis: 8; 2 | G | desno
napis: 7,04; 2,72 | H | levo
napis: 5,5; 0,7 | A | levo
napis: 6,8; 2 | K | desno
:::

Preberi sliko:

- Polmer $OD$ je polovica premera, torej $\frac{a + b}{2} = 5$: to je $A$.
- Višina $CD$ je po višinskem izreku v pravokotnem trikotniku $PDQ$ (kot pri $D$ je pravi po Talesu) enaka $\sqrt{ab} = 4$: to je $G$.
- Odsek $DE$ je po izreku o kateti v trikotniku $OCD$ enak $\frac{CD^2}{OD} = \frac{16}{5} = 3{,}2$: to je $H$.
- Daljica $CT$ je hipotenuza trikotnika $OCT$ in meri $\sqrt{34}$: to je $K$.

Zdaj vrstni red vidiš brez računa. $CD$ je kateta, $OD$ hipotenuza trikotnika $OCD$, zato $G \le A$. $DE$ je kateta, $CD$ hipotenuza trikotnika $CED$, zato $H \le G$. $OT = A$ je kateta, $CT$ hipotenuza, zato $A \le K$. Enakost nastopi samo, ko $C$ pade v $O$, torej pri $a = b$.

V simulaciji spodaj »AM ≥ GM ≥ HM na polkrogu« nastavi drsnika na $a = b$, nato enega počasi premikaj. Opazuj, kako se stolpci sredin razmaknejo, a nikoli ne zamenjajo vrstnega reda.

:::premisli
Točko $C$ v mislih premakni skoraj do $Q$. Kaj se zgodi z dolžinama $CD$ in $OD$? Ali lahko kje na premeru $CD$ preseže $OD$?
---
$G$ je navpična polovica tetive skozi $C$, $A$ pa polmer. Nobena točka loka ni od premera oddaljena več kot polmer, zato $CD \le OD$. Ob robu je $CD$ skoraj $0$, polmer pa ostane $5$.
:::

**4. Simboli.** Za pozitivni števili $a$ in $b$ so sredine

$$A = \frac{a + b}{2}$$

$$G = \sqrt{ab}$$

$$H = \frac{2ab}{a + b}$$

$$K = \sqrt{\frac{a^2 + b^2}{2}}$$

in vedno velja

$$H \le G \le A \le K$$

Enakost v katerikoli neenakosti verige velja natanko tedaj, ko je $a = b$. Neenakost $A \ge G$ imenujemo **neenakost AM-GM** (po angl. *arithmetic mean*, *geometric mean*). Algebrski dokaz je ena vrstica: iz $(\sqrt a - \sqrt b)^2 \ge 0$ sledi $a + b \ge 2\sqrt{ab}$.

Za $n$ pozitivnih števil $a_1, a_2, \dots, a_n$ velja isto:

$$\frac{a_1 + \dots + a_n}{n} \ge \sqrt[n]{a_1 \cdots a_n}$$

z enakostjo natanko pri $a_1 = a_2 = \dots = a_n$. Na tekmovanjih jo uporabiš na dva načina. Če je **produkt stalen**, je vsota najmanjša pri enakih členih. Če je **vsota stalna**, je produkt največji pri enakih členih. Vsakič pa preveri, da enakost res lahko nastopi.

## Rešeni primeri

### Primer 1: najmanjša vsota pri stalnem produktu

Poišči najmanjšo vrednost izraza $x + \frac{9}{x}$ za $x > 0$.

**Podatki:** izraz $x + \frac{9}{x}$, pogoj $x > 0$
**Iščemo:** najmanjšo vrednost in $x$, pri katerem nastopi

:::formula
$u + w \ge 2\sqrt{uw}$ za $u, w > 0$, enakost pri $u = w$
:::

**Rešitev:**

1. Oba člena sta pozitivna in njun produkt $x \cdot \frac{9}{x} = 9$ je stalen. Zato je AM-GM pravo orodje.
2. $x + \frac{9}{x} \ge 2\sqrt{9} = 6$.
3. Enakost: $x = \frac{9}{x}$, torej $x^2 = 9$ in $x = 3$, ker je $x$ pozitiven.
4. Preverimo: $3 + \frac{9}{3} = 6$. Meja $6$ je res dosežena.
5. Odgovor: najmanjša vrednost je $6$, pri $x = 3$.

### Primer 2: omarica za zvočnik

Mizar sestavi ogrodje omarice za zvočnik v obliki kvadra. Za vseh $12$ robov porabi $240\,\mathrm{cm}$ letvic. Kolikšna je največja možna prostornina omarice?

**Podatki:** vsota vseh robov $4(a + b + c) = 240\,\mathrm{cm}$; robovi $a, b, c > 0$
**Iščemo:** največjo prostornino $V = abc$

:::formula
$\frac{a + b + c}{3} \ge \sqrt[3]{abc}$, torej $abc \le \left(\frac{a + b + c}{3}\right)^3$
:::

**Rešitev:**

1. Dolžina, širina in višina skupaj: $a + b + c = 240 : 4 = 60\,\mathrm{cm}$, ker se vsak rob ponovi štirikrat.
2. Vsota je stalna, zato išči največji produkt z AM-GM: $\frac{a + b + c}{3} = 20\,\mathrm{cm}$.
3. $V = abc \le 20^3 = 8000\,\mathrm{cm^3}$.
4. Enakost pri $a = b = c = 20\,\mathrm{cm}$; to je kocka, ki jo mizar lahko sestavi.
5. Odgovor: največja prostornina je $8000\,\mathrm{cm^3}$, to je $8\,\mathrm{L}$, pri kocki z robom $20\,\mathrm{cm}$.

### Primer 3: dokaz v dveh korakih

Dokaži, da za pozitivna števila $a$, $b$, $c$ velja $(a + b)(b + c)(c + a) \ge 8abc$. Kdaj velja enakost?

**Podatki:** $a, b, c > 0$
**Iščemo:** dokaz neenakosti in pogoj za enakost

:::formula
$u + w \ge 2\sqrt{uw}$ za $u, w > 0$
:::

**Rešitev:**

1. AM-GM za vsak oklepaj posebej: $a + b \ge 2\sqrt{ab}$, $b + c \ge 2\sqrt{bc}$, $c + a \ge 2\sqrt{ca}$.
2. Vse strani so pozitivne, zato smemo neenakosti zmnožiti: $(a + b)(b + c)(c + a) \ge 8\sqrt{ab \cdot bc \cdot ca}$.
3. Pod korenom je $a^2b^2c^2$, zato je desna stran $8abc$.
4. Enakost bi morala veljati v vseh treh korakih hkrati: $a = b$, $b = c$ in $c = a$, torej $a = b = c$. Preizkus pri $a = b = c = 1$: $2 \cdot 2 \cdot 2 = 8$.
5. Odgovor: neenakost velja za vse pozitivne $a$, $b$, $c$; enakost natanko pri $a = b = c$.

### Primer 4 – zdaj ti

Pozitivni števili $x$ in $y$ imata vsoto $x + y = 1$. Poišči najmanjšo vrednost $\frac{1}{x} + \frac{1}{y}$.

**Podatki:** $x, y > 0$, $x + y = 1$
**Iščemo:** najmanjšo vrednost $\frac1x + \frac1y$

:::formula
$H \le A$: $\frac{2}{\frac1x + \frac1y} \le \frac{x + y}{2}$
:::

**Rešitev:**

1. Desna stran je $\frac{x + y}{2} = \frac12$.
2. Iz $\frac{2}{\frac1x + \frac1y} \le \frac12$ izrazi $\frac1x + \frac1y$ in poišči, kdaj velja enakost.

:::premisli
Kolikšna je najmanjša vrednost in pri katerih $x$, $y$ nastopi?
---
Obrnemo neenakost (obe strani sta pozitivni): $\frac1x + \frac1y \ge 4$. Enakost pri $x = y = \frac12$, ko je $\frac{1}{1/2} + \frac{1}{1/2} = 4$. Najmanjša vrednost je $4$.
:::

## Pogoste napake

- **Negativna števila.** Napačno: »$x + \frac1x \ge 2$ za vsak $x \ne 0$.« Za $x = -1$ je vsota $-2$. AM-GM velja le za nenegativna števila. Koren $\sqrt{x \cdot \frac1x} = 1$ tu sicer obstaja, neenakost pa ne velja.
- **Produkt ni stalen.** Napačno: »$x^2 + \frac1x \ge 2\sqrt{x}$, torej je najmanjša vrednost $2\sqrt{x}$.« Desna stran se spreminja z $x$, zato ni meja. Popravek: člene razdeli tako, da je produkt stalen, npr. $x^2 + \frac{1}{2x} + \frac{1}{2x}$, kjer je produkt $\frac14$.
- **Enakost ni dosegljiva.** Napačno: »Za $x \ge 3$ je $x + \frac4x \ge 4$, torej je najmanjša vrednost $4$.« Enakost zahteva $x = 2$, ki ni dovoljen. Neenakost drži, a $4$ ni dosežena; pravi minimum je $3 + \frac43 = \frac{13}{3}$. Popravek: vedno poišči, kdaj velja enakost, in preveri, da je dovoljena.
- **Sredina tonov je povprečje.** Napačno: »Ton na sredini med $220\,\mathrm{Hz}$ in $440\,\mathrm{Hz}$ ima $330\,\mathrm{Hz}$.« Uho sliši razmerja, zato je sredina po višini $G = \sqrt{220 \cdot 440} \approx 311\,\mathrm{Hz}$.
- **Pomešan vrstni red.** Napačno: »Pri stalni vsoti produkt ostane enak« ali »$G$ je lahko večja od $A$«. Vedno $H \le G \le A \le K$; pri stalni vsoti produkt raste, ko se števili približujeta.

## Povzetek

- Sredine pozitivnih $a$, $b$: $H = \frac{2ab}{a+b}$, $G = \sqrt{ab}$, $A = \frac{a+b}{2}$, $K = \sqrt{\frac{a^2+b^2}{2}}$. Vedno $H \le G \le A \le K$, enakost natanko pri $a = b$.
- Na polkrogu nad $a + b$: $A$ je polmer, $G$ višina v točki delitve, $H$ njena projekcija na polmer.
- AM-GM za $n$ pozitivnih števil: $\frac{a_1 + \dots + a_n}{n} \ge \sqrt[n]{a_1 \cdots a_n}$, enakost pri enakih členih.
- Stalen produkt: vsota je najmanjša pri enakih členih. Stalna vsota: produkt je največji pri enakih členih.
- Najmanjša ali največja vrednost obstaja le, če enakost lahko nastopi v dovoljenem območju.
- Pri tonih je sredina po višini geometrijska sredina frekvenc.

## Drugače: Z analogijo

Ojačevalnik ima dve stopnji: prva ojača signal $2$-krat, druga $8$-krat, skupaj $16$-krat. Kolikšno bi bilo ojačanje vsake stopnje, če bi bili enaki? Ne $5$-krat, saj je $5 \cdot 5 = 25$. Pravi odgovor je $4$-krat, ker $4 \cdot 4 = 16$.

Pri seštevanju je »povprečni korak« aritmetična sredina, pri množenju geometrijska. Tipke na klavirju so kot stopnje ojačevalnika: vsak polton pomnoži frekvenco z istim faktorjem. Zato je srednja tipka geometrijska sredina, ne aritmetična.

## Drugače: Iz vsakdanjega življenja

Avtobus pelje v hrib s $40\,\mathrm{km/h}$, po isti poti nazaj s $60\,\mathrm{km/h}$. Povprečna hitrost ni $50\,\mathrm{km/h}$, ampak harmonična sredina $\frac{2 \cdot 40 \cdot 60}{40 + 60} = 48\,\mathrm{km/h}$. Počasnejši del traja dlje, zato bolj šteje.

Z $40\,\mathrm{m}$ ograje ogradiš pravokoten vrt. Polovica obsega je $20\,\mathrm{m}$, torej $a + b = 20\,\mathrm{m}$. Ploščina $ab$ je največja pri $a = b = 10\,\mathrm{m}$: kvadrat s $100\,\mathrm{m^2}$. Vrt $5\,\mathrm{m} \times 15\,\mathrm{m}$ ima le $75\,\mathrm{m^2}$.

## Preveri se

? Na sliki je polkrog nad premerom $PQ$, ki ga točka $C$ deli na $PC = a$ in $CQ = b$. Katera daljica predstavlja geometrijsko sredino števil $a$ in $b$?
:::risba skica
opis: Polkrog nad premerom PQ s središčem O. Točka C deli premer na PC = a in CQ = b, pri čemer je a večji. Iz C gre navpična daljica do točke D na loku. Narisan je polmer OD, na njem je točka E, nožišče pravokotnice iz C.
območje: -0,5; -1 .. 10,5; 5,5
enota: 28
črta: 0; 0 -> 10; 0
črta: 10; 0 -> 9,83; 1,29 -> 9,33; 2,5 -> 8,54; 3,54 -> 7,5; 4,33 -> 6,29; 4,83 -> 5; 5 -> 3,71; 4,83 -> 2,5; 4,33 -> 1,46; 3,54 -> 0,67; 2,5 -> 0,17; 1,29 -> 0; 0 | siva
črta: 5; 0 -> 9; 3 | debelo
črta: 9; 0 -> 9; 3 | debelo
črta: 9; 0 -> 7,56; 1,92 | črtkano
točka: 0; 0 | P | pod
točka: 10; 0 | Q | pod
točka: 5; 0 | O | pod
točka: 9; 0 | C | pod
točka: 9; 3 | D | nad
točka: 7,56; 1,92 | E | levo
:::
- $OD$
~ $OD$ je polmer, torej polovica premera $\frac{a+b}{2}$: to je aritmetična sredina.
+ $CD$
- $DE$
~ $DE$ je projekcija $CD$ na polmer, krajša od $CD$: to je harmonična sredina.
- $PC$
~ $PC$ je kar število $a$, ne sredina.
> Po višinskem izreku v pravokotnem trikotniku $PDQ$ je $CD^2 = PC \cdot CQ = ab$, torej $CD = \sqrt{ab}$.

? Za števili $1$ in $9$ razvrsti sredine od najmanjše do največje.
1. $\frac{2 \cdot 1 \cdot 9}{1 + 9}$
2. $\sqrt{1 \cdot 9}$
3. $\frac{1 + 9}{2}$
4. $\sqrt{\frac{1^2 + 9^2}{2}}$
> $H = 1{,}8$, $G = 3$, $A = 5$, $K = \sqrt{41} \approx 6{,}40$. Vrstni red $H \le G \le A \le K$ velja za vsaka pozitivna števila.

? Vsota $a + b = 10$ ostane enaka, števili $a$ in $b$ pa se približujeta: $1$ in $9$, nato $3$ in $7$, nato $5$ in $5$. Kaj se zgodi s produktom $ab$?
- Ostane enak, ker je vsota enaka.
~ Stalna vsota ne pomeni stalnega produkta: $1 \cdot 9 = 9$, $3 \cdot 7 = 21$.
- Pada, ker se večje število manjša.
~ Večje število se res manjša, a manjše raste hitreje v razmerju. Izračunaj: $9$, $21$, $25$.
+ Raste in je največji, $25$, pri $a = b = 5$.
> Pri stalni $A = 5$ je $G = \sqrt{ab} \le 5$, z enakostjo pri $a = b$. Zato je $ab \le 25$.

? Kolikšna je najmanjša vrednost izraza $4x + \frac{25}{x}$ za $x > 0$?
= 20
~ 10 | Izračunal si le $\sqrt{4x \cdot \frac{25}{x}} = 10$. AM-GM da $u + w \ge 2\sqrt{uw}$, manjka faktor $2$.
~ 29 | Vstavil si $x = 1$. Najmanjšo vrednost da enakost $4x = \frac{25}{x}$, torej $x = 2{,}5$.
> Produkt členov je $100$, zato $4x + \frac{25}{x} \ge 2\sqrt{100} = 20$. Enakost pri $4x = \frac{25}{x}$, to je $x = 2{,}5$.

? Kitarist išče ton, ki je po višini točno na sredini med tonoma s frekvencama $200\,\mathrm{Hz}$ in $800\,\mathrm{Hz}$. Kolikšna je njegova frekvenca?
- $500\,\mathrm{Hz}$
~ To je aritmetična sredina. Uho sliši razmerja, zato je sredina geometrijska.
- $320\,\mathrm{Hz}$
~ To je harmonična sredina $\frac{2 \cdot 200 \cdot 800}{1000}$. Ta da ton, ki je bliže spodnjemu.
+ $400\,\mathrm{Hz}$
> $\sqrt{200 \cdot 800} = 400\,\mathrm{Hz}$: od $200$ do $400$ in od $400$ do $800$ se frekvenca podvoji, vsakič za oktavo.

<<RACUN
vrednost: 2*2*8/(2+8) | 3.2
vrednost: sqrt(2*8) | 4
vrednost: sqrt((2^2+8^2)/2) | 5.83
vrednost: 2*3*12/(3+12) | 4.8
vrednost: sqrt(220*440) | 311.1
vrednost: 16/5 | 3.2
resi: x+9/x=6 | x | 3
vrednost: (240/4/3)^3 | 8000
enako: (a+b)*(b+c)*(c+a)-8*a*b*c | a*(b-c)^2+b*(c-a)^2+c*(a-b)^2
resi: 1/x+1/(1-x)=4 | x | 1/2
vrednost: 3+4/3 | 13/3
vrednost: 2*sqrt(4*25) | 20
resi: 4*x=25/x | x | -5/2, 5/2
vrednost: 2*1*9/(1+9) | 1.8
vrednost: sqrt((1^2+9^2)/2) | 6.40
vrednost: sqrt(200*800) | 400
vrednost: 2*40*60/(40+60) | 48
>>

:::simboli
a, b | pozitivni števili, katerih sredine iščemo | | |
A | aritmetična sredina | A = \frac{a + b}{2} | | polmer polkroga nad $a + b$
G | geometrijska sredina | G = \sqrt{ab} | | višina v točki delitve
H | harmonična sredina | H = \frac{2ab}{a + b} | | $\frac{1}{H}$ je povprečje $\frac1a$ in $\frac1b$
K | kvadratna sredina | K = \sqrt{\frac{a^2 + b^2}{2}} | |
a_1, a_n | pozitivna števila v neenakosti AM-GM | | |
n | število členov | | |
u, w | pozitivna člena vsote | | |
x, y | pozitivni spremenljivki | | |
c | tretji rob kvadra oz. tretje število | | |
V | prostornina omarice | V = abc | cm^3 |
:::
