---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Najprej dve uganki, še brez teorije. Odgovora si zapiši, preden bereš naprej.

**Uganka A.** Poleti zvečer nad travnikom utripata dve kresnici. Prva zasveti vsake $4$ sekunde, druga vsakih $6$ sekund. Pravkar sta zasvetili hkrati. Čez koliko sekund bosta spet zasvetili skupaj?

**Uganka B.** Na vrtu je zraslo $12$ rumenih in $18$ belih tulipanov. Iz vseh želiš narediti čim več enakih šopkov: v vsakem naj bo enako rumenih in enako belih cvetov, noben cvet naj ne ostane. Koliko šopkov narediš?

Uganki sta si podobni, a sprašujeta nasprotno. V prvi iščeš **najmanjše** število, ki ga lahko razdeliš na štirice in na šestice. V drugi iščeš **največje** število, s katerim lahko razdeliš $12$ in $18$. Temu rečemo najmanjši skupni večkratnik in največji skupni delitelj. Kmalu ti bosta prihranila delo pri ulomkih: z enim ulomek skrajšaš v enem koraku, z drugim najdeš najmanjši skupni imenovalec.

## Razlaga

Pojma zgradimo po kosih. Za vsakim kosom je kratko vprašanje; odgovori nanj, preden greš naprej.

**1. Delitelj.** Število $d$ je **delitelj** števila $a$, če $a$ deliš z $d$ brez ostanka. Vse delitelje števila zapišemo v množico, na primer $D(12)=\{1, 2, 3, 4, 6, 12\}$. Deliteljev je vedno končno mnogo.

*Preveri:* Ali je $7$ delitelj števila $42$? *(Da, $42:7=6$.)*

**2. Večkratnik.** Število je **večkratnik** števila $a$, če ga dobiš kot $a\cdot 1$, $a\cdot 2$, $a\cdot 3$ … Večkratniki števila $4$ so $4, 8, 12, 16, \dots$ Teh je neskončno mnogo.

*Preveri:* Ali je $54$ večkratnik števila $6$? *(Da, $6\cdot 9=54$.)*

**3. Največji skupni delitelj.** Število, ki deli $a$ in $b$, je njun **skupni delitelj**. Največjemu rečemo **največji skupni delitelj** in ga zapišemo $D(a, b)$.

Uganka B: število šopkov mora deliti $12$ in $18$, sicer bi kak cvet ostal. Iz $D(12)=\{1, 2, 3, 4, 6, 12\}$ in $D(18)=\{1, 2, 3, 6, 9, 18\}$ so skupni $1, 2, 3, 6$. Torej je $D(12, 18)=6$: narediš $6$ šopkov, vsak ima $2$ rumena in $3$ bele tulipane.

*Preveri:* Koliko je $D(8, 12)$? *(Skupni delitelji so $1, 2, 4$, zato $4$.)*

**4. Najmanjši skupni večkratnik.** Število, ki je večkratnik $a$ in $b$, je njun **skupni večkratnik**. Najmanjšemu (večjemu od $0$) rečemo **najmanjši skupni večkratnik** in ga zapišemo $v(a, b)$.

Uganka A: prva kresnica sveti pri $4, 8, 12, 16, 20, 24$ s, druga pri $6, 12, 18, 24$ s. Prvič se ujameta pri $12$ s, torej $v(4, 6)=12$.

:::premisli
Kdaj po $12$ sekundah kresnici naslednjič zasvetita skupaj? Napovej brez pisanja seznamov.
---
Pri $24$ sekundah. Vsi skupni večkratniki so večkratniki najmanjšega: $12, 24, 36, \dots$
:::

**5. Tuja števila.** Če je $D(a, b)=1$, sta števili **tuji**: razen $1$ ju ne deli nobeno skupno število. Primer: $D(8, 15)=1$, čeprav nobeno od njiju ni praštevilo.

*Preveri:* Ali sta $9$ in $16$ tuji? *(Da, delitelja $3$ in $9$ ne delita $16$.)*

**6. Prafaktorji za večja števila.** Pri velikih številih je naštevanje dolgo. Hitreje gre z razcepom, ki ga že znaš: $60=2^2\cdot 3\cdot 5$ in $84=2^2\cdot 3\cdot 7$. Prafaktorje zložimo v tabelo:

| prafaktor | v $60$ | v $84$ | vzame $D$ / vzame $v$ |
|---|---|---|---|
| $2$ | $2^2$ | $2^2$ | $2^2$ / $2^2$ |
| $3$ | $3$ | $3$ | $3$ / $3$ |
| $5$ | $5$ | ni ga | nič / $5$ |
| $7$ | ni ga | $7$ | nič / $7$ |

- **$D(a, b)$:** samo prafaktorji, ki so v *obeh* številih, vsak z *manjšo* potenco. $D(60, 84)=2^2\cdot 3=12$.
- **$v(a, b)$:** *vsi* prafaktorji iz vsaj enega števila, vsak z *večjo* potenco. $v(60, 84)=2^2\cdot 3\cdot 5\cdot 7=420$.

:::premisli
Zakaj $D(60, 84)$ prafaktorja $5$ ne vzame, $v(60, 84)$ pa ga mora?
---
$D$ mora deliti obe števili, $84$ pa ni deljivo s $5$. $v$ mora biti večkratnik obeh, zato mora vsebovati vse prafaktorje števila $60$, tudi $5$.
:::

V simulaciji spodaj (»D in v z Vennovim diagramom«) nastavi $a=60$ in $b=84$. V preseku krogov so skupni prafaktorji, njihov produkt je $D$. Vsi prafaktorji v obeh krogih skupaj dajo $v$. Nato nastavi $b=77$ in opazuj: presek je prazen, števili sta tuji.

**7. Uporaba pri ulomkih.** V ulomku $\frac{12}{18}$ je $12$ števec, $18$ pa imenovalec. Ulomek **skrajšamo**, ko števec in imenovalec delimo z istim številom; vrednost ostane enaka. Če delimo z $D(12, 18)=6$, pridemo do konca v enem koraku: $\frac{12}{18}=\frac{2}{3}$.

Ulomka seštejemo, ko imata enak imenovalec. Najmanjši skupni imenovalec je $v$ imenovalcev: pri $\frac{1}{4}+\frac{1}{6}$ je to $v(4, 6)=12$, kar je odgovor na uganko s kresnicama. Dobimo $\frac{3}{12}+\frac{2}{12}=\frac{5}{12}$. Oboje boš natančno vadil v lekcijah o krajšanju in seštevanju ulomkov.

*Preveri:* Do konca skrajšaj $\frac{8}{12}$. *($D(8, 12)=4$, zato $\frac{2}{3}$.)*

**8. Besedilne naloge.** Pred računanjem se vprašaj:

- delim nekaj na **enake** dele, skupine, kose, čim večje ali čim več? To je $D$;
- čakam, da se dva ponavljajoča se dogodka spet zgodita **hkrati**? To je $v$.

*Preveri:* Dva dežemera praznimo vsake $3$ in vsakih $5$ dni. Kdaj ju spet praznimo isti dan, poiščeš z $D$ ali z $v$? *(Z $v$.)*

## Rešeni primeri

### Primer 1: naštevanje

Določi $D(16, 24)$ in $v(16, 24)$.

**Podatki:** števili $16$ in $24$
**Iščemo:** $D(16, 24)$ in $v(16, 24)$

:::formula
$D(a, b)$ = največji element preseka $D(a)$ in $D(b)$; $v(a, b)$ = prvi skupni večkratnik
:::

**Rešitev:**

1. Delitelji: $D(16)=\{1, 2, 4, 8, 16\}$, $D(24)=\{1, 2, 3, 4, 6, 8, 12, 24\}$.
2. Skupni delitelji so $1, 2, 4, 8$. Največji je $8$, torej $D(16, 24)=8$.
3. Večkratnike pišemo, dokler se ne pojavi skupni: pri $16$ so $16, 32, 48$, pri $24$ pa $24, 48$.
4. Prvi skupni je $48$, torej $v(16, 24)=48$.
5. Smiselnost: $D$ ni večji od manjšega števila ($8\le 16$), $v$ ni manjši od večjega ($48\ge 24$).
6. Odgovor: $D(16, 24)=8$ in $v(16, 24)=48$.

### Primer 2: prafaktorji in ulomki

a) Določi $D(72, 108)$ in $v(72, 108)$. b) Skrajšaj $\dfrac{72}{108}$. c) Izračunaj $\dfrac{5}{72}+\dfrac{7}{108}$.

**Podatki:** števili $72$ in $108$, ulomka $\dfrac{5}{72}$ in $\dfrac{7}{108}$
**Iščemo:** $D$, $v$, skrajšan ulomek in vsoto

:::formula
$D$: skupni prafaktorji z manjšo potenco; $v$: vsi prafaktorji z večjo potenco
:::

**Rešitev:**

1. Razcep: $72=2^3\cdot 3^2$ (ker $8\cdot 9=72$) in $108=2^2\cdot 3^3$ (ker $4\cdot 27=108$).
2. $D$ vzame manjši potenci: $D(72, 108)=2^2\cdot 3^2=4\cdot 9=36$.
3. $v$ vzame večji potenci: $v(72, 108)=2^3\cdot 3^3=8\cdot 27=216$.
4. Preizkus: $72:36=2$, $108:36=3$, $216:72=3$, $216:108=2$, vse brez ostanka.
5. b) Krajšamo z $D=36$, da pridemo do konca v enem koraku: $\dfrac{72}{108}=\dfrac{72:36}{108:36}=\dfrac{2}{3}$.
6. c) Najmanjši skupni imenovalec je $v=216$. Razširimo: $\dfrac{5}{72}=\dfrac{15}{216}$ (ker $216:72=3$) in $\dfrac{7}{108}=\dfrac{14}{216}$ (ker $216:108=2$).
7. Seštejemo števca: $\dfrac{15}{216}+\dfrac{14}{216}=\dfrac{29}{216}$. Krajšati ne moremo, ker je $29$ praštevilo in ne deli $216$.
8. Odgovor: $D=36$, $v=216$, $\dfrac{72}{108}=\dfrac{2}{3}$, vsota je $\dfrac{29}{216}$.

### Primer 3: sadike ob potoku

Gozdar ima $48$ sadik bukve in $60$ sadik smreke. Ob potoku jih želi posaditi v čim več enakih gruč, v vsaki enako bukev in enako smrek. Porabiti mora vse sadike. Koliko gruč naredi in kaj je v vsaki?

**Podatki:** $48$ bukev, $60$ smrek, čim več enakih gruč, nobena sadika ne ostane
**Iščemo:** število gruč in sestavo ene gruče

:::formula
število gruč $=D(48, 60)$
:::

**Rešitev:**

1. Delimo na enake dele in iščemo čim več delov, zato je to največji skupni delitelj.
2. Razcep: $48=2^4\cdot 3$, $60=2^2\cdot 3\cdot 5$.
3. Manjši potenci skupnih prafaktorjev sta $2^2$ in $3$; petice ni v $48$, zato je ne vzamemo. $D(48, 60)=2^2\cdot 3=12$.
4. V vsaki gruči so $48:12=4$ bukve in $60:12=5$ smrek.
5. Preizkus: $12\cdot 4=48$ in $12\cdot 5=60$.
6. Odgovor: gozdar naredi $12$ gruč, v vsaki so $4$ bukve in $5$ smrek.

### Primer 4 – zdaj ti: vremenski postaji

Vremenska postaja v dolini pošlje podatke vsakih $15$ minut, postaja na hribu vsakih $20$ minut. Ob 6.00 sta poslali hkrati. Ob kateri uri spet pošljeta podatke hkrati?

**Podatki:** dolina vsakih $15$ min, hrib vsakih $20$ min, skupaj ob 6.00
**Iščemo:** naslednji čas, ko pošljeta hkrati

:::formula
čas do naslednjega skupnega pošiljanja $=v(15, 20)$
:::

**Rešitev:**

1. Dogodka se ponavljata in čakamo, da se spet zgodita hkrati, zato iščemo $v$.
2. Razcep: $15=3\cdot 5$ in $20=2^2\cdot 5$.
3. Vzemi vse prafaktorje z večjo potenco, izračunaj $v$ in prištej čas k 6.00.

:::premisli
Koliko je $v(15, 20)$ in ob kateri uri postaji spet pošljeta hkrati?
---
$v(15, 20)=2^2\cdot 3\cdot 5=60$. Čez $60$ minut, torej ob 7.00. Preizkus: $60:15=4$ in $60:20=3$.
:::

## Pogoste napake

- **Zamenjava $D$ in $v$.** Učenec pri $D(12, 18)$ zapiše $36$, ker »največji« pomeni veliko število. Delitelj pa ne more biti večji od števila, ki ga deli. Popravek: $D(a, b)$ je največ tako velik kot manjše število, $v(a, b)$ vsaj tako velik kot večje.
- **Napačna izbira prafaktorjev.** Pri $v(12, 30)$ učenec vzame samo skupne prafaktorje in dobi $2\cdot 3=6$. To je postopek za $D$; število $6$ ni niti večkratnik $12$. Popravek: pri $v$ vzameš vse prafaktorje z večjo potenco, $2^2\cdot 3\cdot 5=60$.
- **Prvi skupni delitelj, ki ga najdeš.** Učenec opazi, da $6$ deli $24$ in $36$, in se ustavi. Ulomek, skrajšan s $6$, je treba krajšati še enkrat. Popravek: preglej vse skupne delitelje ali uporabi prafaktorje; $D(24, 36)=12$.
- **»Produkt je vedno najmanjši skupni večkratnik.«** Produkt je res skupni večkratnik, a najmanjši je samo pri tujih številih. Za $4$ in $6$ je $4\cdot 6=24$, $v(4, 6)$ pa je $12$. Popravek: najprej preveri, ali imata števili skupne prafaktorje.
- **Napačen pojem v besedilni nalogi.** Učenec pri šopkih računa $v$, ker »sta v nalogi dve števili«. Popravek: deliš na enake dele, torej $D$; čakaš na ponovni skupni dogodek, torej $v$.

## Povzetek

- $D(a, b)$ je največje število, ki deli $a$ in $b$. $v(a, b)$ je najmanjše število, ki je večkratnik obeh.
- Pri prafaktorjih: $D$ vzame skupne prafaktorje z manjšim eksponentom, $v$ vse prafaktorje z večjim eksponentom.
- Števili sta tuji, če je $D(a, b) = 1$.
- Ulomek do konca skrajšamo tako, da števec in imenovalec delimo z $D$ števca in imenovalca.
- Najmanjši skupni imenovalec pri seštevanju in odštevanju ulomkov je $v$ imenovalcev.
- Besedilne naloge: »enake skupine, čim večje« pomeni $D$, »spet hkrati« pomeni $v$.

## Drugače: Na sliki

Predstavljaj si pravokotnik z dolžino $18\,\text{cm}$ in širino $12\,\text{cm}$. Pokriti ga želiš s kvadratnimi ploščicami brez vrzeli in brez rezanja. Stranica ploščice mora deliti $18$ in $12$, torej mora biti skupni delitelj. Največja možna ploščica ima stranico $D(12, 18) = 6\,\text{cm}$. Potrebuješ $18 : 6 = 3$ ploščice v vrsti in $12 : 6 = 2$ vrsti, skupaj $6$ ploščic.

Za najmanjši skupni večkratnik si predstavljaj dve vrsti ploščic na ravni črti. Ene so dolge $12\,\text{cm}$, druge $18\,\text{cm}$. Obe vrsti polagaš od iste začetne črte. Stiki ploščic se prvič poravnajo pri $36\,\text{cm}$, torej $v(12, 18) = 36$. Do takrat potrebuješ $3$ ploščice prve vrste ($3 \cdot 12 = 36$) in $2$ ploščici druge vrste ($2 \cdot 18 = 36$).

## Drugače: Bolj natančno

**Zveza med $D$ in $v$.** Za poljubni naravni števili $a$ in $b$ velja

$$D(a, b) \cdot v(a, b) = a \cdot b.$$

Zakaj? Pri vsakem prafaktorju ima eno število eksponent $m$, drugo $n$. Pri $D$ vzamemo manjšega, pri $v$ večjega, torej $\min(m, n) + \max(m, n) = m + n$. Eksponenti pri produktu $D \cdot v$ so zato isti kot pri produktu $a \cdot b$.

Preizkus: $D(12, 18) \cdot v(12, 18) = 6 \cdot 36 = 216 = 12 \cdot 18$. ✓

Iz tega sledi uporaben trik: če poznaš $D$, lahko dobiš $v = \dfrac{a \cdot b}{D}$. Za tuji števili ($D = 1$) je $v(a, b) = a \cdot b$. Na primer $v(8, 15) = 120$.

**Zakaj je pri seštevanju ulomkov dovolj $v$ imenovalcev?** Skupni imenovalec mora biti večkratnik obeh imenovalcev, da ulomka lahko razširimo na isti imenovalec. Najmanjši tak imenovalec je po definiciji $v$. Računanje z najmanjšim imenovalcem pomeni manjša števila in manj krajšanja na koncu.

## Preveri se

? Katera trditev je pravilna?
- $D(a, b)$ je lahko večji od obeh števil.
~ Delitelj ne more biti večji od števila, ki ga deli. $D(a, b)$ je največ tako velik kot manjše število.
+ $v(a, b)$ je vsaj tako velik kot večje od obeh števil.
- Tuji števili sta vedno praštevili.
~ Tuji sta, ko je $D(a, b)=1$. Števili $8$ in $15$ sta tuji, a nobeno ni praštevilo.
> Vsak večkratnik števila je enak številu ali večji od njega, zato $v(a, b)$ ni manjši od večjega števila. Npr. $v(4, 6)=12$.

? Koliko je $D(24, 36)$?
- $6$
~ $6$ res deli obe števili, a ni največji skupni delitelj: tudi $12$ deli obe.
+ $12$
- $72$
~ To je $v(24, 36)$: vzel si večje potence. Pri $D$ vzameš manjše.
> $24=2^3\cdot 3$ in $36=2^2\cdot 3^2$. Manjši potenci: $D(24, 36)=2^2\cdot 3=12$.

? Jaka je računal: $12=2^2\cdot 3$, $30=2\cdot 3\cdot 5$, zato $v(12, 30)=2\cdot 3=6$. Kje je napaka?
- Napačno je razcepil $30$.
~ Razcep je pravilen, $2\cdot 3\cdot 5=30$. Napaka je pri izbiri prafaktorjev.
+ Izračunal je $D$ namesto $v$; pravilno je $v(12, 30)=2^2\cdot 3\cdot 5=60$.
- Pravilen rezultat je $12\cdot 30=360$.
~ $360$ je skupni večkratnik, ni pa najmanjši: že $60$ je deljivo z $12$ in s $30$.
> Pri $v$ vzameš vse prafaktorje z večjo potenco. Rezultat $6$ je manjši od $12$, kar pri $v$ ni mogoče.

? Kaj je večje: $v(4, 6)$ ali $v(4, 5)$?
- $v(4, 6)$, ker je $6$ večje od $5$.
~ Večje število ne pomeni nujno večjega $v$. Števili $4$ in $6$ imata skupni prafaktor $2$, zato je njun $v$ manjši od produkta.
- Sta enaka.
~ $v(4, 6)=12$ in $v(4, 5)=20$, nista enaka.
+ $v(4, 5)$
> $4$ in $5$ sta tuji, zato $v(4, 5)=4\cdot 5=20$. Pri $4=2^2$ in $6=2\cdot 3$ je $v(4, 6)=2^2\cdot 3=12$.

? Vrtnarka ima $36$ tulipanov in $54$ narcis. Iz vseh naredi čim več enakih šopkov, noben cvet ne ostane. Koliko šopkov naredi?
- $6$
~ $6$ je skupni delitelj, a ne največji. Lahko naredi več šopkov.
+ $18$
- $108$
~ To je $v(36, 54)$. Šopkov ne more biti več kot tulipanov; deliš na enake dele, zato iščeš $D$.
> $36=2^2\cdot 3^2$, $54=2\cdot 3^3$, $D(36, 54)=2\cdot 3^2=18$. V vsakem šopku sta $2$ tulipana in $3$ narcise.

:::simboli
D | največji skupni delitelj | | | D(a, b); D(a) je množica deliteljev števila a
v | najmanjši skupni večkratnik | | | D(a, b) · v(a, b) = a · b
a, b | naravni števili | |
d | delitelj števila | | | a deljeno z d se izide brez ostanka
:::
