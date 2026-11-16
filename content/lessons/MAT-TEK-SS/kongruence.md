---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na blagajni so trije izdelki po $17$ €, $28$ € in $39$ €. Prodajalka ve, da se bo znesek končal s štirico, še preden ga izračuna do konca. Sešteje le zadnje števke: $7 + 8 + 9 = 24$. Res, $17 + 28 + 39 = 84$.

Naslednji obrok za telefon moraš plačati čez $100$ dni, danes pa je ponedeljek. Na kateri dan v tednu pade plačilo? Polni tedni ne spremenijo dneva, zato šteje le ostanek: $100 = 14 \cdot 7 + 2$. Plačilo bo v sredo.

V obeh primerih smo velike številke zavrgli in računali le z ostanki: enkrat pri deljenju z $10$, drugič s $7$. Kongruence so zapis za tak račun. Na tekmovanjih z njimi poiščeš zadnjo števko ogromne potence ali dokažeš, da enačba nima celih rešitev, ne da bi preizkušal število za številom.

## Razlaga

Začnimo z enim nakupom: $23$ škatel po $47$ €. Znesek je $23 \cdot 47 = 1081$ € in se konča z $1$. Tudi $3 \cdot 7 = 21$ se konča z $1$. To ni naključje. Razstavimo $23 = 20 + 3$ in $47 = 40 + 7$:

$$23 \cdot 47 = 20 \cdot 40 + 20 \cdot 7 + 3 \cdot 40 + 3 \cdot 7$$

Prvi trije členi so deljivi z $10$, zato o zadnji števki odloča le $3 \cdot 7$.

**Definicija.** Naj bo $m$ naravno število, **modul**. Celi števili $a$ in $b$ sta **kongruentni po modulu** $m$, če $m$ deli razliko $a - b$. Pišemo

$$a \equiv b \pmod{m}$$

To pomeni isto kot: $a$ in $b$ dasta pri deljenju z $m$ enak ostanek. Primer: $47 \equiv 12 \pmod{5}$, ker $5 \mid 35$; obe števili dasta ostanek $2$.

Pri negativnih številih je ostanek vedno med $0$ in $m - 1$. Ker je $-13 = 5 \cdot (-3) + 2$, velja $-13 \equiv 2 \pmod{5}$.

**Računska pravila.** Iz nakupa posplošimo: če je $a \equiv b \pmod{m}$ in $c \equiv d \pmod{m}$, potem po modulu $m$ velja

$$a + c \equiv b + d$$

$$a \cdot c \equiv b \cdot d$$

in za vsako naravno število $n$ tudi $a^n \equiv b^n$. Razlog za produkt: $ac - bd = a(c - d) + d(a - b)$, oba člena pa sta deljiva z $m$. Velja tudi za odštevanje. Kongruence torej seštevamo, odštevamo, množimo in potenciramo kot enačbe.

:::premisli
Velja $2 \cdot 3 \equiv 2 \cdot 8 \pmod{10}$, saj se $6$ in $16$ obe končata s $6$. Ali smemo obe strani deliti z $2$?
---
Ne: $3 \not\equiv 8 \pmod{10}$. Deliti s $k$ smemo le, če je $D(k, m) = 1$. Sicer se deli tudi modul: iz $ka \equiv kb \pmod{m}$ sledi $a \equiv b \pmod{\frac{m}{D(k, m)}}$, tu $3 \equiv 8 \pmod{5}$.
:::

**Ostanki potenc.** Zanima nas zadnja števka števila $7^{222}$. Potenciramo po modulu $10$ in vsakič obdržimo le ostanek:

| $n$ | $7^n$ | ostanek pri deljenju z $10$ |
|---|---|---|
| $1$ | $7$ | $7$ |
| $2$ | $49$ | $9$ |
| $3$ | $343$ | $3$ |
| $4$ | $2401$ | $1$ |
| $5$ | $16807$ | $7$ |

Ker je $7^4 \equiv 1 \pmod{10}$, je $7^{n+4} = 7^n \cdot 7^4 \equiv 7^n$. Ostanki se ponavljajo s **periodo** $4$. Eksponent zato delimo s $4$: $222 = 4 \cdot 55 + 2$, torej $7^{222} \equiv 7^2 \equiv 9 \pmod{10}$.

Ponavljanje ni posebnost sedmice. Možnih ostankov je le $m$, vsak naslednji pa je odvisen samo od prejšnjega. Prej ali slej se ostanek ponovi in od tam naprej se ponavlja vse.

:::premisli
Napovej zadnjo števko števila $7^{100}$. Eksponent $100$ da pri deljenju s $4$ ostanek $0$.
---
Zadnja števka je $1$. Ostanku $0$ ustreza zadnji člen periode, ne prvi: $7^{100} = (7^4)^{25} \equiv 1^{25} = 1 \pmod{10}$.
:::

V simulaciji spodaj »Računanje po modulu« nastavi modul $m = 12$ in korak $b = 8$, nato še $b = 5$. Zaporedje začne pri $a$ in vsakič prišteje $b$. Najprej napovej, koliko točk na krogu obišče, nato preveri: pri koraku $8$ jih obišče $3$, ker je $D(8, 12) = 4$ in $\frac{12}{4} = 3$; pri koraku $5$ obišče vseh $12$.

**Kvadratni ostanki.** Ostanki, ki jih dajo kvadrati celih števil pri deljenju z $m$, so **kvadratni ostanki** po modulu $m$. Ker iz $x \equiv r$ sledi $x^2 \equiv r^2$, je dovolj kvadrirati ostanke $0, 1, \ldots, m - 1$:

| modul | kvadratni ostanki | kvadrat jih ne da |
|---|---|---|
| $3$ | $0, 1$ | $2$ |
| $4$ | $0, 1$ | $2, 3$ |
| $8$ | $0, 1, 4$ | $2, 3, 5, 6, 7$ |
| $10$ | $0, 1, 4, 5, 6, 9$ | $2, 3, 7, 8$ |

Iz zadnje vrstice: popoln kvadrat se nikoli ne konča z $2$, $3$, $7$ ali $8$. Iz vrstice za $4$: vsota dveh kvadratov da ostanek $0$, $1$ ali $2$, nikoli $3$. To je najpogostejši tekmovalni trik: enačbo pogledamo po primernem modulu in pokažemo, da se strani ne moreta ujemati.

## Rešeni primeri

### Prvi primer: zadnja števka računa

Na računu je $38$ izdelkov po $57$ € in $19$ izdelkov po $23$ €. S katero števko se konča znesek? Ne izračunaj celega zneska.

**Podatki:** $38$ kosov po $57$ €, $19$ kosov po $23$ €
**Iščemo:** zadnjo števko zneska, to je ostanek pri deljenju z $10$

:::formula
Po modulu $m$: $a \equiv b$, $c \equiv d$ da $ac \equiv bd$ in $a + c \equiv b + d$.
:::

**Rešitev:**

1. Po modulu $10$ zamenjamo vsako število z njegovo zadnjo števko: $38 \equiv 8$, $57 \equiv 7$, $19 \equiv 9$, $23 \equiv 3$.
2. Prvi produkt: $8 \cdot 7 = 56$, ostanek $6$.
3. Drugi produkt: $9 \cdot 3 = 27$, ostanek $7$.
4. Vsota: $6 + 7 = 13$, ostanek $3$.
5. Preizkus s celim zneskom: $38 \cdot 57 + 19 \cdot 23 = 2166 + 437 = 2603$.
6. Odgovor: znesek se konča s $3$.

### Drugi primer: dan plačila čez ogromno dni

Danes je ponedeljek. Kateri dan v tednu bo čez $2^{100}$ dni?

**Podatki:** danes ponedeljek, čez $2^{100}$ dni, teden ima $7$ dni
**Iščemo:** dan v tednu, torej ostanek $2^{100}$ pri deljenju s $7$

:::formula
Če je $a^p \equiv 1 \pmod{m}$, je $a^{pk + s} \equiv a^s \pmod{m}$.
:::

**Rešitev:**

1. Prve potence po modulu $7$: $2^1 = 2$, $2^2 = 4$, $2^3 = 8 \equiv 1$.
2. Perioda je $3$, ker je $2^3 \equiv 1 \pmod{7}$.
3. Eksponent delimo s periodo: $100 = 3 \cdot 33 + 1$.
4. $2^{100} = (2^3)^{33} \cdot 2 \equiv 1^{33} \cdot 2 = 2 \pmod{7}$.
5. Dva dneva za ponedeljkom je sreda.
6. Odgovor: čez $2^{100}$ dni bo sreda.

### Tretji primer (težji): vsota treh kvadratov

Dokaži, da vsota kvadratov treh zaporednih celih števil ni nikoli popoln kvadrat.

**Podatki:** zaporedna cela števila $n - 1$, $n$, $n + 1$
**Iščemo:** dokaz, da $(n - 1)^2 + n^2 + (n + 1)^2$ ni kvadrat celega števila

:::formula
Kvadratni ostanki po modulu $3$ so $0$ in $1$.
:::

**Rešitev:**

1. Poenostavimo vsoto (dvojna produkta $-2n$ in $+2n$ se odštejeta): $(n - 1)^2 + n^2 + (n + 1)^2 = 3n^2 + 2$.
2. Izraz ima člen $3n^2$, zato je modul $3$ naravna izbira: $3n^2 + 2 \equiv 2 \pmod{3}$ za vsak $n$.
3. Kvadrat celega števila da po modulu $3$ ostanek $0$ ali $1$: $0^2 = 0$, $1^2 = 1$, $2^2 = 4 \equiv 1$.
4. Vsota ima ostanek $2$, kvadrat pa nikoli, zato vsota ne more biti kvadrat.
5. Odgovor: vsota kvadratov treh zaporednih celih števil ni nikoli popoln kvadrat (za $n = 1, 2, 3, 4$ dobimo $5$, $14$, $29$, $50$).

### Četrti primer – zdaj ti

Ali ima enačba $x^2 - 5y = 3$ kakšno rešitev v celih številih?

**Podatki:** enačba $x^2 - 5y = 3$, $x$ in $y$ sta celi števili
**Iščemo:** ali rešitev obstaja

:::formula
Enačbo zapišemo po modulu $5$; člen $5y$ je deljiv s $5$.
:::

**Rešitev:**

1. Prenesemo: $x^2 = 5y + 3$, torej mora veljati $x^2 \equiv 3 \pmod{5}$.
2. Preveriti je treba, ali je $3$ kvadratni ostanek po modulu $5$. Dovolj je kvadrirati ostanke $0, 1, 2, 3, 4$.
3. Kvadriraj jih in odloči, preden pogledaš rešitev:

:::premisli
Kateri so kvadratni ostanki po modulu $5$ in kaj to pove o enačbi?
---
$0^2 = 0$, $1^2 = 1$, $2^2 = 4$, $3^2 = 9 \equiv 4$, $4^2 = 16 \equiv 1$. Kvadratni ostanki so $0$, $1$ in $4$; ostanka $3$ ni med njimi. Enačba nima celoštevilskih rešitev.
:::

## Pogoste napake

- **Krajšanje, kot da gre za enačbo.** Iz $6x \equiv 6y \pmod{9}$ nekdo sklepa $x \equiv y \pmod{9}$. Protiprimer: $x = 0$, $y = 3$ ($6 \cdot 0 = 0$ in $6 \cdot 3 = 18$ sta oba deljiva z $9$, a $0 \not\equiv 3 \pmod{9}$). Ker je $D(6, 9) = 3$, je pravilno $x \equiv y \pmod{3}$.
- **Eksponent zmanjšan po modulu.** Za $2^{10}$ po modulu $7$ nekdo vzame $10 \equiv 3$ in dobi $2^3 \equiv 1$. Napačno: eksponent zmanjšamo po **periodi** potenc, tu $3$. Ker je $10 = 3 \cdot 3 + 1$, je $2^{10} \equiv 2$; res $1024 = 7 \cdot 146 + 2$.
- **Ostanek nič pri eksponentu.** Pri $7^{100}$ je $100 = 4 \cdot 25 + 0$, nekdo pa vzame prvi člen periode in reče $7$. Ostanku $0$ ustreza zadnji člen periode: $7^{100} \equiv 7^4 \equiv 1$.
- **Negativen ostanek.** Ostanek števila $-13$ pri deljenju s $5$ ni $-3$ in ne $3$, ampak $2$, ker mora biti med $0$ in $4$: $-13 = 5 \cdot (-3) + 2$.
- **Preizkus le nekaj števil.** Kdor za $x^2 \equiv 3 \pmod{5}$ preveri le $x = 1, 2, 3$, še nima dokaza. Dokaz je šele pregled **vseh** ostankov $0, \ldots, m - 1$.

## Povzetek

- $a \equiv b \pmod{m}$ pomeni $m \mid a - b$, torej enak ostanek pri deljenju z $m$; ostanek je vedno med $0$ in $m - 1$.
- Kongruence po istem modulu seštevamo, odštevamo, množimo in potenciramo. Deliti s $k$ smemo le, če je $D(k, m) = 1$; sicer se modul zmanjša na $\frac{m}{D(k, m)}$.
- Ostanki potenc so periodični. Če je $a^p \equiv 1$, eksponent delimo s $p$; ostanku $0$ ustreza $a^p$.
- Kvadratni ostanki: po modulu $3$ in $4$ le $0, 1$; po modulu $8$ le $0, 1, 4$; kvadrat se ne konča z $2, 3, 7, 8$.
- Enačba nima celih rešitev, če po nekem modulu strani nimata skupnega ostanka.

## Drugače: Z analogijo

Predstavljaj si, da imaš v denarnici le bankovce po $5$ €. Kar od cene ne moreš pokriti z bankovci, doplačaš v kovancih. Za $47$ € daš devet bankovcev in $2$ € v kovancih, za $12$ € dva bankovca in spet $2$ €. Ceni sta »kongruentni po modulu $5$«: v kovancih doplačaš enak znesek.

Ko kupiš dve stvari, se kovanci seštejejo, odvečni pa se spet zamenjajo za bankovec. Zato je pri vsoti dovolj sešteti ostanke. Bankovci so »nepomembni del«, ki ga kongruenca zavrže.

Isto dela kazalec na uri: po $12$ urah je spet na istem mestu. Ura je modul $12$, teden modul $7$, zadnja števka modul $10$.

## Drugače: Bolj natančno

**Razredi ostankov.** Relacija $\equiv \pmod{m}$ je refleksivna, simetrična in tranzitivna. Cela števila zato razpadejo na $m$ **razredov ostankov** $\{0, 1, \ldots, m - 1\}$, v vsakem so števila z istim ostankom. Računska pravila povedo, da vsota in produkt nista odvisna od izbire predstavnika razreda.

**Obratni element.** Če je $D(a, m) = 1$, po Bézoutovi enakosti obstajata celi $x$ in $y$, da je $ax + my = 1$. Po modulu $m$ to da $ax \equiv 1$: število $x$ je **obratni element** števila $a$. Z njim kongruenco $ak \equiv al$ pomnožimo in dobimo $k \equiv l$. Zato je krajšanje s številom, tujim modulu, dovoljeno.

**Periodičnost potenc.** Če je $D(a, m) = 1$, so vse potence $a^n$ tuje z $m$. Ostankov je končno mnogo, zato je $a^i \equiv a^j$ za neka $i < j$. Krajšamo z $a^i$ in dobimo $a^{j - i} \equiv 1$: zaporedje se vrne na $1$. Če $a$ in $m$ nista tuji, se lahko ponavljanje začne šele kasneje (po modulu $8$: $2, 4, 0, 0, \ldots$).

## Preveri se

? Izdelka staneta $47$ € in $12$ €. Prodajalec reče: »$47 \equiv 12 \pmod{5}$.« Katera razlaga njegove trditve je pravilna?
- Pri deljenju s $5$ imata $47$ in $12$ enak količnik.
~ Količnika sta $9$ in $2$. Enak je ostanek, ne količnik.
- Razlika cen je natanko $5$ €.
~ Razlika je $35$ €. Kongruenca zahteva, da je razlika večkratnik števila $5$, ne natanko $5$.
+ Število $5$ deli razliko $47 - 12 = 35$, zato imata ceni pri deljenju s $5$ enak ostanek $2$.
> Po definiciji $a \equiv b \pmod{m}$ natanko tedaj, ko $m \mid a - b$. Obe ceni dasta ostanek $2$.

? Velja $6x \equiv 6y \pmod{9}$. Kaj se zgodi, če obe strani delimo s $6$, modul pa pustimo $9$?
- Dobimo pravilno kongruenco $x \equiv y \pmod{9}$.
~ Protiprimer: $x = 0$, $y = 3$ ustrezata, a $0 \not\equiv 3 \pmod{9}$. Krajšati smeš le s številom, tujim modulu.
+ Sklep je lahko napačen; pravilno je $x \equiv y \pmod{3}$, ker je $D(6, 9) = 3$.
- Ne zgodi se nič posebnega, ker sta $6$ in $9$ obe deljivi s $3$.
~ Prav zato, ker imata $6$ in $9$ skupni delitelj $3$, se modul pri krajšanju zmanjša na $\frac{9}{3} = 3$.
> Iz $ka \equiv kb \pmod{m}$ sledi le $a \equiv b \pmod{\frac{m}{D(k, m)}}$, tu $\frac{9}{3} = 3$.

? Na risbi je »ura« z ostanki pri deljenju s $6$. Začnemo pri $0$ in vsakič skočimo za $4$ naprej. Koliko različnih ostankov obiščemo?
:::risba skica
opis: Krog s šestimi točkami, označenimi z 0 do 5 v smeri urinega kazalca, 0 je na vrhu. Puščice vodijo od 0 do 4, od 4 do 2 in od 2 nazaj do 0. Točke 1, 3 in 5 nimajo puščic.
območje: 0; 0 .. 6; 6
enota: 40
krog: 3; 3 | 2 | siva
puščica: 3; 5 -> 1,268; 2 | | | modra
puščica: 1,268; 2 -> 4,732; 2 | | | modra
puščica: 4,732; 2 -> 3; 5 | | | modra
točka: 3; 5 | 0 | nad
točka: 4,732; 4 | 1 | desno
točka: 4,732; 2 | 2 | desno
točka: 3; 1 | 3 | pod
točka: 1,268; 2 | 4 | levo
točka: 1,268; 4 | 5 | levo
:::
= 3
~ 6 | Vse ostanke bi obiskali le, če bi bila korak in modul tuja. Tu je $D(4, 6) = 2$.
~ 2 | To je $D(4, 6)$. Obiščemo $\frac{6}{2} = 3$ ostanke: $0$, $4$ in $2$.
> Zaporedje $0, 4, 8 \equiv 2, 12 \equiv 0$ se vrne na začetek po treh korakih: $\frac{6}{D(4, 6)} = 3$.

? Razvrsti potence po zadnji števki, od najmanjše do največje.
1. $3^{100}$
2. $3^{41}$
3. $3^{203}$
4. $3^{50}$
> Ostanki potenc $3^n$ pri deljenju z $10$ so $3, 9, 7, 1$ in se ponavljajo s periodo $4$. Eksponenti $100$, $41$, $203$ in $50$ dajo pri deljenju s $4$ ostanke $0$, $1$, $3$ in $2$, zato so zadnje števke $1$, $3$, $7$ in $9$.

? Katerega ostanka pri deljenju s $4$ nikoli ne da vsota kvadratov dveh celih števil? Vpiši ostanek.
= 3
~ 2 | Ostanek $2$ je mogoč: $1^2 + 1^2 = 2$.
~ 1 | Ostanek $1$ je mogoč: $1^2 + 0^2 = 1$.
> Kvadrat da po modulu $4$ ostanek $0$ ali $1$, zato vsota dveh da $0$, $1$ ali $2$, nikoli $3$.

<<RACUN
vrednost: 17 + 28 + 39 | 84
vrednost: mod(100, 7) | 2
vrednost: 23*47 | 1081
vrednost: mod(-13, 5) | 2
vrednost: mod(7^222, 10) | 9
vrednost: mod(7^100, 10) | 1
vrednost: 38*57 + 19*23 | 2603
vrednost: mod(38*57 + 19*23, 10) | 3
vrednost: mod(2^100, 7) | 2
enako: (n-1)^2 + n^2 + (n+1)^2 | 3*n^2 + 2
vrednost: 3*4^2 + 2 | 50
vrednost: mod(2^2, 5) | 4
vrednost: mod(3^2, 5) | 4
vrednost: mod(4^2, 5) | 1
vrednost: mod(2^10, 7) | 2
vrednost: 7*146 + 2 | 1024
vrednost: mod(3^100, 10) | 1
vrednost: mod(3^41, 10) | 3
vrednost: mod(3^203, 10) | 7
vrednost: mod(3^50, 10) | 9
vrednost: 47 - 12 | 35
vrednost: 6/gcd(4, 6) | 3
vrednost: 12/gcd(8, 12) | 3
>>

:::simboli
a, b | celi števili, ki ju primerjamo; v simulaciji začetek $a$ in korak $b$ | | 
c, d | drugi par kongruentnih števil | | 
m | modul | | | naravno število
n | naravni eksponent; v tretjem primeru srednje od treh števil | | 
k | celo število: faktor, s katerim krajšamo; v $a^{pk + s}$ količnik eksponenta pri deljenju s periodo | | 
r | ostanek pri deljenju z $m$ | | | $0 \leq r \leq m - 1$
p | perioda ostankov potenc | | | $a^p \equiv 1 \pmod{m}$
s | ostanek eksponenta pri deljenju s periodo | | 
x, y | celi neznanki | | 
:::
