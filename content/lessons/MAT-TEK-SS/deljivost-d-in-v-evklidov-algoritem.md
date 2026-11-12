---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Bobnar ponavlja vzorec, dolg $12$ dob, basist pa vzorec, dolg $18$ dob. Oba začneta na prvi dobi. Kdaj spet hkrati začneta svoj vzorec? Po $36$ dobah, ker je $36$ najmanjše število, ki je večkratnik obeh dolžin.

Drugje dve struni zazvenita s frekvencama $440\,\mathrm{Hz}$ in $660\,\mathrm{Hz}$. Skupni zvok se ponavlja s frekvenco $220\,\mathrm{Hz}$: to je največje število, ki deli obe frekvenci ($440 = 2 \cdot 220$, $660 = 3 \cdot 220$). Uho ta ton pogosto zazna kot osnovnega, čeprav ga nobena struna ne igra.

Ritem in višina tona sta na videz različni stvari. V prvi situaciji iščemo najmanjši skupni večkratnik, v drugi največji skupni delitelj. Obe vprašanji sta o deljivosti. Na tekmovanjih se ta ideja skriva v nalogah o ulomkih, enačbah s celimi števili in ostankih. Glavni orodji sta Evklidov algoritem in Bézoutova enakost.

## Razlaga

**1. Oznake.** Celo število $a$ **deli** celo število $b$ (pišemo $a \mid b$), če je $b = k \cdot a$ za neko celo število $k$. Tako $7 \mid 21$, ne pa $7 \mid 20$.

**Največji skupni delitelj** $D(a, b)$ je največje naravno število, ki deli $a$ in $b$. **Najmanjši skupni večkratnik** $v(a, b)$ je najmanjše naravno število, ki je deljivo z $a$ in $b$. Števili sta **tuji**, če je $D(a, b) = 1$.

Prva uporabna lastnost: če $d \mid a$ in $d \mid b$, potem $d$ deli tudi vsako število oblike $ax + by$ s celima $x$ in $y$. Razlog: $a = d \cdot k$ in $b = d \cdot l$ za neki celi števili $k$ in $l$, zato je $ax + by = d(kx + ly)$.

**2. En primer do konca.** Poiščimo $D(1071, 462)$, ne da bi števili razstavili na prafaktorje. Delimo z ostankom:

$$1071 = 2 \cdot 462 + 147$$

Vsak skupni delitelj števil $1071$ in $462$ deli tudi $147 = 1071 - 2 \cdot 462$. Velja tudi obratno: vsak skupni delitelj števil $462$ in $147$ deli $1071 = 2 \cdot 462 + 147$. Par $(1071, 462)$ ima torej natanko iste skupne delitelje kot par $(462, 147)$, zato tudi isti $D$. Manjši par je lažji, zato postopek ponovimo:

| deljenec | delitelj | količnik | ostanek |
|---|---|---|---|
| $1071$ | $462$ | $2$ | $147$ |
| $462$ | $147$ | $3$ | $21$ |
| $147$ | $21$ | $7$ | $0$ |

Ko je ostanek $0$, velja $21 \mid 147$, zato je $D(147, 21) = 21$. Torej je $D(1071, 462) = 21$.

:::premisli
Ali se lahko zgodi, da tak postopek nikoli ne pride do ostanka $0$? Zakaj?
---
Ne more. Vsak ostanek je manjši od svojega delitelja, zato ostanki strogo padajo ($147 > 21 > 0$). Strogo padajoče zaporedje nenegativnih celih števil ne more biti neskončno, zato po končno mnogo korakih pridemo do ostanka $0$.
:::

**3. Splošno: Evklidov algoritem.** Za naravni števili $a \geq b$ zapišemo $a = qb + r$, kjer je $q$ **količnik** in $r$ **ostanek**, $0 \leq r < b$. Zgornji razmislek dokaže

$$D(a, b) = D(b, r)$$

Par $(a, b)$ zamenjamo s parom $(b, r)$ in ponavljamo. **Zadnji neničelni ostanek** je $D(a, b)$.

V simulaciji »Evklidov algoritem« spodaj nastavi $a = 55$ in $b = 34$. Iz pravokotnika $55 \times 34$ se zaporedoma odrežejo čim večji kvadrati: število enakih kvadratov je količnik, stranica zadnjih kvadratov pa $D(a, b)$. Preštej korake: skoraj vsi količniki so $1$, zato je takih korakov veliko, čeprav sta števili majhni.

**4. Nazaj po tabeli: Bézoutova enakost.** Iz druge vrstice izrazimo zadnji neničelni ostanek, iz prve pa ostanek $147$:

$$21 = 462 - 3 \cdot 147$$

$$147 = 1071 - 2 \cdot 462$$

Drugo vstavimo v prvo in združimo enake člene:

$$21 = 462 - 3 \cdot (1071 - 2 \cdot 462) = 7 \cdot 462 - 3 \cdot 1071$$

Število $21$ smo zapisali kot $1071x + 462y$ s celima $x = -3$ in $y = 7$. Izrazu $ax + by$ pravimo **celoštevilska linearna kombinacija** števil $a$ in $b$.

**Bézoutova enakost.** Za cela števila $a$ in $b$, ki nista obe $0$, obstajata celi števili $x$ in $y$, da je

$$ax + by = D(a, b)$$

Števili $x$ in $y$ najdemo z Evklidovim algoritmom, ki ga preberemo od spodaj navzgor.

:::premisli
Ali obstajata celi števili $x$ in $y$, da je $1071x + 462y = 10$? Kaj pa $1071x + 462y = 42$?
---
Za $10$ ne: po točki 1 je leva stran vedno deljiva z $21$, $10$ pa ni. Za $42$ da: enakost $1071 \cdot (-3) + 462 \cdot 7 = 21$ pomnožimo z $2$ in dobimo $x = -6$, $y = 14$.
:::

**5. Lastnosti, ki jih uporabljamo na tekmovanjih.**

- Celoštevilske linearne kombinacije števil $a$ in $b$ so natanko večkratniki števila $D(a, b)$. Enačba $ax + by = c$ ima cele rešitve natanko tedaj, ko $D(a, b) \mid c$.
- Vsak skupni delitelj števil $a$ in $b$ deli $D(a, b)$. Ni le manjši ali enak, ampak ga deli.
- Za naravni $k$ je $D(ka, kb) = k \cdot D(a, b)$. Števili $\frac{a}{D(a, b)}$ in $\frac{b}{D(a, b)}$ sta tuji.
- **Evklidova lema:** če $a \mid bc$ in je $D(a, b) = 1$, potem $a \mid c$. Enakost $ax + by = 1$ pomnožimo s $c$: $c = acx + bcy$. Prvi člen je očitno deljiv z $a$, drugi pa zato, ker $a \mid bc$.
- Za naravni $a$ in $b$ velja $D(a, b) \cdot v(a, b) = a \cdot b$. Tako dobimo $v$ brez razcepa.

## Rešeni primeri

### Primer 1 (lažji): dva ritma

Bobnar udari na veliki boben na vsakih $18$ dob, tolkalist na činelo na vsakih $24$ dob. Oba udarita na dobi $0$. Na kateri dobi prvič spet udarita hkrati? Kolikokrat udarita hkrati v dobah od $1$ do $360$?

**Podatki:** razmik bobnarja $18$ dob, razmik tolkalista $24$ dob, skupni začetek na dobi $0$, opazujemo dobe od $1$ do $360$
**Iščemo:** prvo skupno dobo in število skupnih udarcev

:::formula
$D(a, b) \cdot v(a, b) = a \cdot b$, $D$ pa z Evklidovim algoritmom.
:::

**Rešitev:**

1. Evklidov algoritem: $24 = 1 \cdot 18 + 6$ in $18 = 3 \cdot 6 + 0$, zato je $D(18, 24) = 6$.
2. Skupne dobe so skupni večkratniki obeh razmikov. Najmanjši je $v(18, 24) = \dfrac{18 \cdot 24}{6} = 72$.
3. Skupni udarci so na dobah $72, 144, 216, 288, 360$. Teh je $\dfrac{360}{72} = 5$.
4. Odgovor: prvič spet udarita hkrati na dobi $72$, v dobah od $1$ do $360$ pa petkrat.

### Primer 2: Bézoutovi koeficienti

Poišči $D(252, 198)$ in celi števili $x$, $y$, da je $252x + 198y = D(252, 198)$.

**Podatki:** $a = 252$, $b = 198$
**Iščemo:** $D(252, 198)$ ter celi $x$ in $y$

:::formula
$a = qb + r$, $D(a, b) = D(b, r)$, nato vstavljanje ostankov od spodaj navzgor.
:::

**Rešitev:**

1. $252 = 1 \cdot 198 + 54$
2. $198 = 3 \cdot 54 + 36$
3. $54 = 1 \cdot 36 + 18$
4. $36 = 2 \cdot 18 + 0$, zato je $D(252, 198) = 18$ (zadnji neničelni ostanek).
5. Iz koraka 3: $18 = 54 - 36$. Iz koraka 2 vstavimo $36 = 198 - 3 \cdot 54$, da ostaneta le $54$ in $198$: $18 = 4 \cdot 54 - 198$.
6. Iz koraka 1 vstavimo $54 = 252 - 198$: $18 = 4 \cdot 252 - 5 \cdot 198$.
7. Preizkus: $4 \cdot 252 - 5 \cdot 198 = 1008 - 990 = 18$.
8. Odgovor: $D(252, 198) = 18$, na primer $x = 4$ in $y = -5$.

### Primer 3 (težji): skladba iz fraz

Skladatelj sestavi skladbo samo iz fraz po $7$ dob in fraz po $12$ dob. Skladba mora trajati natanko $100$ dob. Koliko fraz vsake vrste uporabi?

**Podatki:** fraza A ima $7$ dob, fraza B ima $12$ dob, skupaj $100$ dob, števili fraz sta nenegativni celi števili
**Iščemo:** število fraz A ($x$) in fraz B ($y$)

:::formula
$7x + 12y = 100$; najprej Bézout za $7$ in $12$, nato vse rešitve $x = x_0 + 12t$, $y = y_0 - 7t$.
:::

**Rešitev:**

1. Evklidov algoritem: $12 = 1 \cdot 7 + 5$, $7 = 1 \cdot 5 + 2$, $5 = 2 \cdot 2 + 1$. Torej $D(7, 12) = 1$ in $1 \mid 100$, zato rešitve obstajajo.
2. Nazaj: $1 = 5 - 2 \cdot 2 = 5 - 2 \cdot (7 - 5) = 3 \cdot 5 - 2 \cdot 7 = 3 \cdot (12 - 7) - 2 \cdot 7$, torej $7 \cdot (-5) + 12 \cdot 3 = 1$.
3. Pomnožimo s $100$: $7 \cdot (-500) + 12 \cdot 300 = 100$. To je ena celoštevilska rešitev, a ni smiselna, ker je $x$ negativen.
4. Če $x$ povečamo za $12$ in $y$ zmanjšamo za $7$, se vsota ne spremeni ($7 \cdot 12 = 12 \cdot 7$). Zato so rešitve tudi $x = -500 + 12t$, $y = 300 - 7t$ za vsak celi $t$. Drugih ni: če od $7x + 12y = 100$ odštejemo $7 \cdot (-500) + 12 \cdot 300 = 100$, dobimo $7(x + 500) = 12(300 - y)$; iz tega in $D(7, 12) = 1$ po Evklidovi lemi sledi $12 \mid x + 500$.
5. Pogoja $x \geq 0$ in $y \geq 0$ dasta $t \geq \frac{500}{12} \approx 41{,}7$ in $t \leq \frac{300}{7} \approx 42{,}9$. Edini celi $t$ je $42$.
6. $x = -500 + 12 \cdot 42 = 4$ in $y = 300 - 7 \cdot 42 = 6$. Preizkus: $7 \cdot 4 + 12 \cdot 6 = 28 + 72 = 100$.
7. Odgovor: skladatelj uporabi $4$ fraze po $7$ dob in $6$ fraz po $12$ dob; druge možnosti ni.

### Primer 4 – zdaj ti

Dokaži, da je ulomek $\dfrac{5n + 3}{3n + 2}$ okrajšan za vsako naravno število $n$.

**Podatki:** števec $5n + 3$, imenovalec $3n + 2$, $n$ je naravno število
**Iščemo:** dokaz, da je $D(5n + 3, 3n + 2) = 1$

:::formula
Če $d \mid a$ in $d \mid b$, potem $d \mid ax + by$.
:::

**Rešitev:**

1. Naj bo $d$ skupni delitelj števca in imenovalca. Potem $d$ deli vsako njuno linearno kombinacijo.
2. Izberemo koeficienta, pri katerih se $n$ odšteje: števec pomnožimo s $3$, imenovalec s $5$.
3. Izračunaj kombinacijo sam in sklepaj, nato preveri:

:::premisli
Koliko je $3(5n + 3) - 5(3n + 2)$ in kaj to pove o $d$?
---
$3(5n + 3) - 5(3n + 2) = 15n + 9 - 15n - 10 = -1$. Torej $d \mid -1$, zato je $d = 1$. Števec in imenovalec sta tuja, ulomek je okrajšan.
:::

## Pogoste napake

- **D je zadnji ostanek ali zadnji količnik.** Pri $147 = 7 \cdot 21 + 0$ nekdo zapiše $D = 0$ ali $D = 7$. Ostanek $0$ samo pove, da se je algoritem končal. $D$ je zadnji **neničelni** ostanek, tukaj $21$.
- **Bézoutova koeficienta sta enolična in pozitivna.** Iz $7 \cdot (-5) + 12 \cdot 3 = 1$ dobimo neskončno parov: $x$ povečamo za $12$, $y$ zmanjšamo za $7$. Pri naravnih $a$ in $b$ je vsaj en koeficient negativen ali $0$, sicer bi bilo $ax + by \geq a + b > D(a, b)$.
- **»Če $d \mid ab$, potem $d \mid a$ ali $d \mid b$.«** To velja le za praštevilo $d$. Protiprimer: $6 \mid 4 \cdot 9$, a $6 \nmid 4$ in $6 \nmid 9$. Pravilno: Evklidova lema zahteva $D(d, a) = 1$.
- **$D \cdot v = $ produkt tudi za tri števila.** Za $2$, $4$, $6$ je $D = 2$ in $v = 12$, torej $D \cdot v = 24$, produkt pa je $48$. Zveza velja le za dve števili.
- **Enačba $ax + by = c$ ima vedno cele rešitve.** Pri $6x + 9y = 10$ je leva stran vedno deljiva s $3$, desna pa ne. Najprej preveri, ali $D(a, b) \mid c$.

## Povzetek

- $a \mid b$ pomeni $b = ka$ za celi $k$. Če $d$ deli $a$ in $b$, deli tudi vsako $ax + by$.
- Evklidov algoritem: $a = qb + r$, $D(a, b) = D(b, r)$; zadnji neničelni ostanek je $D(a, b)$.
- Bézout: obstajata cela $x$, $y$ z $ax + by = D(a, b)$; najdemo ju z vstavljanjem ostankov od spodaj navzgor.
- $ax + by = c$ ima cele rešitve natanko tedaj, ko $D(a, b) \mid c$; vse rešitve: $x = x_0 + \frac{b}{d}t$, $y = y_0 - \frac{a}{d}t$, kjer je $d = D(a, b)$.
- Evklidova lema: $a \mid bc$ in $D(a, b) = 1$ da $a \mid c$. Za dve naravni števili $D \cdot v = a \cdot b$.

## Drugače: Z analogijo

Na klaviaturi je $12$ poltonov v oktavi. Predstavljaj si, da smeš melodijo premikati le za kvinto ($7$ poltonov) ali za oktavo ($12$ poltonov), gor ali dol. Ali lahko ton dvigneš za en sam polton?

Lahko: $7$ kvint gor in $4$ oktave dol da $7 \cdot 7 - 12 \cdot 4 = 1$ polton. To je Bézoutova enakost za $7$ in $12$, ker je $D(7, 12) = 1$. S kvintami in oktavami dosežeš vsak ton.

Če bi smel premikati le za veliko terco ($4$ poltone) in oktavo, bi dosegel le premike $4x + 12y$, torej samo večkratnike $D(4, 12) = 4$. Od tona C prideš le do E, Gis in spet C. Dva »koraka« dosežeta natanko večkratnike njunega največjega skupnega delitelja.

## Drugače: Bolj natančno

**Dokaz Bézoutove enakosti brez algoritma.** Naj bo $S$ množica vseh pozitivnih števil oblike $ax + by$ s celima $x$, $y$. Ni prazna (vsebuje $|a|$ ali $|b|$), zato ima najmanjši element $s = ax_0 + by_0$.

Delimo $a$ s $s$: $a = qs + r$, $0 \leq r < s$. Potem je $r = a(1 - qx_0) + b(-qy_0)$ spet oblike $ax + by$. Če bi bil $r > 0$, bi bil v $S$ in manjši od $s$, kar ni mogoče. Torej $r = 0$ in $s \mid a$. Enako $s \mid b$.

Število $s$ je skupni delitelj, zato $s \leq D(a, b)$. Ker $D(a, b)$ deli $a$ in $b$, deli tudi $s$, zato $D(a, b) \leq s$. Sledi $s = D(a, b)$.

**Vse rešitve.** Naj bo $d = D(a, b)$ in $(x_0, y_0)$ ena rešitev enačbe $ax + by = c$. Če je $(x, y)$ druga, odštejemo: $a(x - x_0) = -b(y - y_0)$. Delimo z $d$; števili $\frac{a}{d}$ in $\frac{b}{d}$ sta tuji, zato po Evklidovi lemi $\frac{b}{d} \mid x - x_0$. Dobimo natanko rešitve $x = x_0 + \frac{b}{d}t$, $y = y_0 - \frac{a}{d}t$.

**Več števil.** $D(a, b, c) = D(D(a, b), c)$; Bézoutova enakost velja tudi za tri števila: $ax + by + cz = D(a, b, c)$.

## Preveri se

? Ritma dolžin $4$ in $9$ dob sta »tuja«, ker je $D(4, 9) = 1$. Kaj to pomeni?
- Števili $4$ in $9$ sta praštevili.
~ Nobeno od njiju ni praštevilo. Tuji sta, ker nimata skupnega delitelja, večjega od $1$.
+ Edini skupni naravni delitelj je $1$, zato se ritma spet ujameta šele po $v(4, 9) = 36$ dobah.
- Ritma se po začetku nikoli več ne ujameta.
~ Ujameta se, po $v(4, 9) = \frac{4 \cdot 9}{1} = 36$ dobah. Tujost pove le, da je to najkasneje mogoče.
> $D(4, 9) = 1$, zato je $v(4, 9) = 4 \cdot 9 = 36$: ritma se ujameta šele po zmnožku obeh dolžin.

? Razvrsti korake, s katerimi najdeš celi $x$, $y$, da je $ax + by = D(a, b)$.
1. Delimo z ostankom $a = qb + r$ in ponavljamo s parom $(b, r)$, dokler ostanek ni $0$.
2. Zadnji neničelni ostanek je $D(a, b)$.
3. Iz predzadnje enačbe izrazimo $D(a, b)$ z deljencem in deliteljem te vrstice.
4. Zaporedoma vstavljamo ostanke iz višjih vrstic, dokler ne ostaneta le $a$ in $b$.
5. Preverimo, ali je $ax + by$ res enako $D(a, b)$.
> Algoritem gre navzdol do ostanka $0$, Bézoutova koeficienta pa dobimo, ko gremo po vrsticah nazaj navzgor.

? Velja $D(a, b) = d$. Kaj se zgodi z največjim skupnim deliteljem, če obe števili pomnožimo s $5$?
- Ostane $d$.
~ Novi števili imata skupni delitelj $5d$, ki je večji od $d$. Največji skupni delitelj se poveča.
- Postane $25d$.
~ Faktor $5$ je v obeh številih, a v skupnem delitelju šteje enkrat. Produkt $5a \cdot 5b$ bi se res povečal $25$-krat, $D$ pa ne.
+ Postane $5d$.
> $D(5a, 5b) = 5 \cdot D(a, b)$: vsi ostanki v Evklidovem algoritmu se pomnožijo s $5$, tudi zadnji neničelni.

? Pravokotnik $10 \times 4$ režemo na čim večje kvadrate, kot kaže risba. Odčitaj $D(10, 4)$.
:::risba skica
opis: Pravokotnik, širok 10 in visok 4. Levo sta dva kvadrata 4 krat 4, desno ostane trak 2 krat 4, ki je razrezan na dva kvadrata 2 krat 2.
območje: 0; 0 .. 10; 4
enota: 28
pravokotnik: 0; 0 .. 4; 4 | modra
pravokotnik: 4; 0 .. 8; 4 | modra
pravokotnik: 8; 0 .. 10; 2 | oranžna
pravokotnik: 8; 2 .. 10; 4 | oranžna
napis: 2; 2 | 4 × 4 | sredina
napis: 6; 2 | 4 × 4 | sredina
napis: 9; 1 | 2 × 2 | sredina
napis: 9; 3 | 2 × 2 | sredina
:::
= 2
~ 4 | To je stranica prvih kvadratov ($10 = 2 \cdot 4 + 2$). Algoritem se tam še ne konča, ker ostane trak širine $2$.
~ 0 | Ostanek $0$ pove, da je rezanje končano. $D$ je stranica najmanjših kvadratov.
> $10 = 2 \cdot 4 + 2$, $4 = 2 \cdot 2 + 0$. Najmanjši kvadrati imajo stranico $2$, zato je $D(10, 4) = 2$.

? Dva vzorca se ponavljata na $84$ in $120$ dob. Po koliko dobah se prvič spet začneta hkrati? Izračunaj $v(84, 120)$.
= 840
~ 10080 | To je zmnožek $84 \cdot 120$. Ker števili nista tuji, ga moraš deliti z $D(84, 120) = 12$.
~ 12 | To je $D(84, 120)$, največji skupni delitelj. Iščeš najmanjši skupni večkratnik.
> $120 = 1 \cdot 84 + 36$, $84 = 2 \cdot 36 + 12$, $36 = 3 \cdot 12$, zato je $D = 12$ in $v = \frac{84 \cdot 120}{12} = 840$.

<<RACUN
vrednost: lcm(12, 18) | 36
vrednost: gcd(440, 660) | 220
vrednost: gcd(1071, 462) | 21
vrednost: 7*462 - 3*1071 | 21
vrednost: 1071*(-6) + 462*14 | 42
vrednost: gcd(18, 24) | 6
vrednost: lcm(18, 24) | 72
vrednost: 360/72 | 5
vrednost: gcd(252, 198) | 18
vrednost: 4*252 - 5*198 | 18
vrednost: 7*(-5) + 12*3 | 1
vrednost: -500 + 12*42 | 4
vrednost: 300 - 7*42 | 6
vrednost: 7*4 + 12*6 | 100
enako: 3*(5*n + 3) - 5*(3*n + 2) | -1
vrednost: 7*7 - 12*4 | 1
vrednost: lcm(4, 9) | 36
vrednost: gcd(10, 4) | 2
vrednost: gcd(84, 120) | 12
vrednost: lcm(84, 120) | 840
>>

:::simboli
a, b | celi števili, katerih skupne delitelje iščemo | | 
q | količnik pri deljenju z ostankom | | 
r | ostanek pri deljenju z ostankom | r = a - qb | | $0 \leq r < b$
D | največji skupni delitelj | | | $D(a, b)$
v | najmanjši skupni večkratnik | v(a, b) = \frac{ab}{D(a, b)} | | za naravni $a$, $b$
x, y | celoštevilska koeficienta linearne kombinacije | | 
x_0, y_0 | ena znana rešitev enačbe | | 
t | poljubno celo število (parameter rešitev) | | 
c | desna stran enačbe $ax + by = c$ | | 
d | skupni delitelj števil $a$ in $b$; v formuli za vse rešitve največji, $d = D(a, b)$ | | 
k | celo število, s katerim množimo (na primer v $b = ka$) | | 
n | naravno število v ulomku | | 
:::
