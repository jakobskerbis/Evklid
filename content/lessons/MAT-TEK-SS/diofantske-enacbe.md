---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V antični Aleksandriji je matematik Diofant napisal zbirko nalog *Aritmetika*. Iskal je rešitve enačb v ulomkih in celih številih, ne v poljubnih realnih številih. Veliko stoletij pozneje je knjigo bral Pierre de Fermat. Ob njenih nalogah je postavljal nova vprašanja o celih številih in izumil metodo, ki ji danes rečemo neskončni spust.

Zakaj sta oba vztrajala pri celih številih? Ker se veliko stvari šteje po kosih. Vozovnic, kovancev, avtomobilov na trajektu ali kvadratkov na zemljevidu ne moreš imeti dva in pol. Enačbi, pri kateri iščemo samo celoštevilske rešitve, rečemo **diofantska enačba**. Na tekmovanjih je med najpogostejšimi vrstami nalog.

## Razlaga

**Mamljiva misel.** »Ena enačba z dvema neznankama ima neskončno rešitev. Izberem $x$ in izračunam $y$.« Za realna števila to drži. Preizkusimo pri celih številih.

Popotnica kupuje vozovnice za vlak po $6\,€$ in za avtobus po $9\,€$. Ali lahko porabi točno $20\,€$? Enačba je $6x + 9y = 20$. Pri $x = 1$ dobiš $y = \frac{14}{9}$, pri $x = 2$ pa $y = \frac{8}{9}$. Celega $y$ ne dobiš nikoli. Razlog: leva stran je vedno deljiva s $3$, desna ni.

**Popravek: pogoj za rešljivost.** Naj bo $d = D(a, b)$. Linearna diofantska enačba

$$ax + by = c$$

ima celoštevilske rešitve natanko takrat, ko $d \mid c$. Če $d \nmid c$, rešitev ni, ker $d$ deli levo stran. Če $d \mid c$, z Evklidovim algoritmom nazaj zapišeš $d = ax' + by'$ in pomnožiš s $\frac{c}{d}$.

V simulaciji spodaj (»Linearne diofantske enačbe«) nastavi $6x + 9y = c$ in spreminjaj $c$. Opazuj, da se celoštevilske točke pojavijo samo pri $c$, deljivem s $3$.

**Ena rešitev še ni vse.** Vlak naj stane $7\,€$, avtobus $4\,€$, porabljenih je $50\,€$. Ena rešitev je $x = 2$, $y = 9$. Naj bo $(x; y)$ katerakoli druga. Odštejemo enačbi in dobimo $7(x - 2) = 4(9 - y)$. Ker sta $7$ in $4$ tuji, mora $4$ deliti $x - 2$. Torej je $x = 2 + 4t$, in ko to vstavimo, dobimo $y = 9 - 7t$ za celo število $t$.

:::risba graf
opis: Premica 7x + 4y = 50 v prvem kvadrantu. Seka os y pri 12,5 in os x pri približno 7,1. Na njej sta označeni celoštevilski točki (2; 9) in (6; 2). Od prve do druge se x poveča za 4, y pa zmanjša za 7.
x: 0 .. 8 | 1 | x
y: 0 .. 13 | 1 | y
f: (50 - 7*x)/4 | modra | 0 .. 7,14
točka: 2; 9 | (2; 9) | desno | oranžna
točka: 6; 2 | (6; 2) | desno | oranžna
puščica: 2,3; 8,5 -> 5,7; 2,5 | korak (4; −7) | desno | siva
podnapis: Celoštevilske točke na premici so med seboj oddaljene za korak (4; −7).
:::

Na premici je neskončno realnih točk, celoštevilske pa so redke in enakomerno razporejene. Z $x \geq 0$ in $y \geq 0$ sta samo dve: dve vožnji z vlakom in devet z avtobusom ali šest z vlakom in dve z avtobusom.

V splošnem, če je $(x_0; y_0)$ ena rešitev, so vse rešitve

$$x = x_0 + \frac{b}{d}\,t, \quad y = y_0 - \frac{a}{d}\,t$$

kjer je $t$ poljubno celo število.

:::premisli
Pri enačbi $6x + 9y = 21$ je $(2; 1)$ rešitev. Ali je rešitev tudi $(5; -1)$? Kaj to pove o koraku, s katerim se spreminja $x$?
---
Je: $6 \cdot 5 + 9 \cdot (-1) = 21$. Korak za $x$ je $3 = \frac{9}{3}$, ne $9$. Ker imata $6$ in $9$ skupni delitelj $3$, se ta pri koraku pokrajša.
:::

**Druga mamljiva misel: »Poskušam, dokler ne najdem.«** Pri nelinearnih enačbah poskušanje najde nekaj rešitev. Ne dokaže pa, da drugih ni. Za popolno rešitev potrebuješ metodo, ki možnosti zapre.

**Razcep.** Enačbo preoblikuješ v obliko »produkt = znano število«. Pri $x^2 - y^2 = 45$ v naravnih številih velja $(x - y)(x + y) = 45$. Faktorja sta delitelja števila $45$, manjši je $x - y$. Pari $1 \cdot 45$, $3 \cdot 15$ in $5 \cdot 9$ dajo rešitve $(23; 22)$, $(9; 6)$ in $(7; 2)$. Drugih ni, ker smo pregledali vse pare deliteljev.

**Omejevanje.** Z neenakostmi ali ostanki zožiš možnosti na končno mnogo primerov. Primer z ostanki: kvadrat da pri deljenju s $4$ ostanek $0$ ali $1$ (sodo število na kvadrat je $4k^2$, liho $4k^2 + 4k + 1$), zato je vsota dveh kvadratov $0$, $1$ ali $2$ po modulu $4$. Enačba $x^2 + y^2 = 2027$ nima rešitve, ker je $2027 \equiv 3 \pmod 4$.

**Neskončni spust.** Pokažimo, da $x^2 = 2y^2$ nima rešitve v naravnih številih. Recimo, da ima, in vzemimo tisto z najmanjšim $y$. Ker je $x^2$ sod, je $x$ sod, $x = 2u$. Sledi $4u^2 = 2y^2$ oziroma $y^2 = 2u^2$. Tudi $(y; u)$ je rešitev. Ker je $x^2 = 2y^2 < 4y^2$, je $x < 2y$ in zato $u < y$. To nasprotuje izbiri najmanjšega $y$.

:::premisli
Zakaj ne bi zadoščalo, da je nova rešitev samo »ne večja« od stare?
---
Ker bi bila lahko enaka stari in protislovja ne bi bilo. Le strogo padajoče zaporedje naravnih števil se mora ustaviti, najpozneje po toliko korakih, kolikor je začetno število.
:::

## Rešeni primeri

### Primer 1 (lažji)

Poišči vse celoštevilske rešitve enačbe $11x + 7y = 3$.

**Podatki:** $a = 11$, $b = 7$, $c = 3$
**Iščemo:** vse cele pare $(x; y)$

:::formula
Evklidov algoritem nazaj; nato $x = x_0 + \frac{b}{d}t$, $y = y_0 - \frac{a}{d}t$
:::

**Rešitev:**

1. Evklidov algoritem: $11 = 1 \cdot 7 + 4$, $7 = 1 \cdot 4 + 3$, $4 = 1 \cdot 3 + 1$. Torej je $d = D(11, 7) = 1$, ki deli $3$, zato rešitve obstajajo.
2. Nazaj: $1 = 4 - 3 = 4 - (7 - 4) = 2 \cdot 4 - 7 = 2(11 - 7) - 7 = 2 \cdot 11 - 3 \cdot 7$.
3. Pomnožimo s $3$: $11 \cdot 6 + 7 \cdot (-9) = 3$. Ena rešitev je $x_0 = 6$, $y_0 = -9$.
4. Ker je $d = 1$, je korak za $x$ enak $7$, za $y$ pa $11$.
5. Odgovor: vse rešitve so $x = 6 + 7t$, $y = -9 - 11t$, kjer je $t$ celo število.

### Primer 2

Na karirastem zemljevidu meri stranica kvadratka $1\,\mathrm{km}$. Narisati želimo pravokotno območje s stranicama vzdolž mreže, pri katerem je ploščina v $\mathrm{km^2}$ številsko enaka obsegu v $\mathrm{km}$. Katere dimenzije so možne?

**Podatki:** stranici $x$ in $y$ sta naravni števili (v km), $x \leq y$; ploščina $xy$ je številsko enaka obsegu $2x + 2y$
**Iščemo:** vse pare $(x; y)$

:::formula
$(x - 2)(y - 2) = 4$
:::

**Rešitev:**

1. Enačba $xy = 2x + 2y$ preoblikovana: $xy - 2x - 2y + 4 = 4$.
2. Leva stran se razcepi: $(x - 2)(y - 2) = 4$.
3. Ker sta $x, y \geq 1$, sta faktorja vsaj $-1$. Produkt $4$ je pozitiven, zato imata faktorja isti predznak. Negativna bi morala biti oba, a $(-1) \cdot (-1) = 1 \neq 4$. Zato sta oba pozitivna.
4. Ostaneta pozitivna para z $x - 2 \leq y - 2$: $1 \cdot 4$ da $(3; 6)$, $2 \cdot 2$ da $(4; 4)$.
5. Preizkus: $3 \cdot 6 = 18 = 2 \cdot 3 + 2 \cdot 6$ in $4 \cdot 4 = 16 = 2 \cdot 4 + 2 \cdot 4$.
6. Odgovor: območje meri $3\,\mathrm{km} \times 6\,\mathrm{km}$ ali $4\,\mathrm{km} \times 4\,\mathrm{km}$.

### Primer 3 (težji)

Tri ekipe si razdelijo traso štafete. Prva prevozi $\frac{1}{x}$ trase, druga $\frac{1}{y}$, tretja $\frac{1}{z}$, kjer so $x \leq y \leq z$ naravna števila. Skupaj prevozijo celo traso. Poišči vse možne trojice.

**Podatki:** $\frac{1}{x} + \frac{1}{y} + \frac{1}{z} = 1$, $x \leq y \leq z$, vse tri ekipe vozijo
**Iščemo:** vse trojice $(x; y; z)$

:::formula
Omejevanje: iz $x \leq y \leq z$ sledi $\frac{1}{x} + \frac{1}{y} + \frac{1}{z} \leq \frac{3}{x}$
:::

**Rešitev:**

1. Najmanjši imenovalec da največji ulomek: $1 \leq \frac{3}{x}$, zato $x \leq 3$. Ker morata ostali dve ekipi tudi voziti, je $x \geq 2$.
2. Primer $x = 2$: ostane $\frac{1}{y} + \frac{1}{z} = \frac{1}{2}$ in enako kot zgoraj $\frac{2}{y} \geq \frac{1}{2}$, torej $y \leq 4$. Ker je $\frac{1}{y} < \frac{1}{2}$, je $y \geq 3$.
3. $y = 3$ da $\frac{1}{z} = \frac{1}{6}$, $z = 6$. $y = 4$ da $z = 4$.
4. Primer $x = 3$: $\frac{1}{y} + \frac{1}{z} = \frac{2}{3}$ in $\frac{2}{y} \geq \frac{2}{3}$, torej $y \leq 3$. Ker je $y \geq x = 3$, je $y = 3$ in $z = 3$.
5. Odgovor: trojice so $(2; 3; 6)$, $(2; 4; 4)$ in $(3; 3; 3)$.

### Primer 4 – zdaj ti

Dokaži, da ima enačba $x^2 + y^2 = 3z^2$ v celih številih samo rešitev $x = y = z = 0$.

**Podatki:** $x, y, z$ so cela števila
**Iščemo:** dokaz, da je $x = y = z = 0$

:::formula
Kvadrat da pri deljenju s $3$ ostanek $0$ ali $1$; neskončni spust
:::

**Rešitev:**

1. Desna stran je deljiva s $3$. Vsota dveh ostankov iz $\{0, 1\}$ je deljiva s $3$ samo, če sta oba $0$. Zato $3 \mid x$ in $3 \mid y$.
2. Vstavimo $x = 3x_1$, $y = 3y_1$: $9x_1^2 + 9y_1^2 = 3z^2$, torej $z^2 = 3(x_1^2 + y_1^2)$ in zato $3 \mid z$, $z = 3z_1$.
3. Po krajšanju dobimo $x_1^2 + y_1^2 = 3z_1^2$. Dokončaj sam.

:::premisli
Kako iz tega sledi trditev?
---
Trojica $(x_1; y_1; z_1)$ reši isto enačbo. Če bi bil $z \neq 0$, bi bil $|z_1| = \frac{|z|}{3}$ naravno število, manjše od $|z|$, postopek pa bi se ponavljal brez konca. Neskončno strogo padajoče zaporedje naravnih števil ne obstaja, zato je $z = 0$. Tedaj je $x^2 + y^2 = 0$, torej $x = y = 0$.
:::

## Pogoste napake

- **Rešitev brez preverjanja pogoja.** »Vsaka linearna enačba ima cele rešitve, le poiskati jih je treba.« Pri $6x + 9y = 20$ jih ni, ker $D(6, 9) = 3$ ne deli $20$. Najprej izračunaj $d$ in preveri $d \mid c$.
- **Korak $b$ namesto $\frac{b}{d}$.** Kdor pri $6x + 9y = 21$ piše $x = 2 + 9t$, izpusti dve tretjini rešitev, na primer $(5; -1)$. Korak je $\frac{b}{d} = 3$.
- **En sam razcep.** »$x^2 - y^2 = 12 = 3 \cdot 4$, torej $x - y = 3$, $x + y = 4$.« Ta par ne da rešitve, par $2 \cdot 6$ pa da $(4; 2)$. Pregledati moraš vse pare deliteljev, pri celih številih tudi negativne. Faktorja $x - y$ in $x + y$ imata vedno isto parnost.
- **Nekaj primerov ni dokaz.** Če najdeš $(2; 3; 6)$ in $(3; 3; 3)$, to še ne pomeni, da drugih ni. Šele omejitev $x \leq 3$ zapre primere.
- **Spust brez strogega padanja.** Nova rešitev mora biti strogo manjša in še vedno naravna, sicer protislovja ni.

## Povzetek

- Diofantska enačba: iščemo samo celoštevilske rešitve.
- $ax + by = c$ je rešljiva natanko tedaj, ko $d = D(a, b)$ deli $c$. Eno rešitev da Evklidov algoritem nazaj.
- Vse rešitve: $x = x_0 + \frac{b}{d}t$, $y = y_0 - \frac{a}{d}t$, $t$ celo število.
- Nelinearne enačbe: razcep na »produkt = število« in pregled vseh parov deliteljev.
- Omejevanje: z urejenostjo neznank, neenakostmi ali ostanki zožiš možnosti na končno mnogo primerov.
- Neskončni spust: iz rešitve izpelješ strogo manjšo naravno rešitev; to je nemogoče, zato rešitve ni.

## Drugače: Kot zgodba

Popotnica pride v deželo, kjer imajo samo kovance za $6$ in $9$ tolarjev. Prodajalec zahteva $20$ tolarjev in vrača drobiž z istimi kovanci. Popotnica šteje: karkoli da in karkoli dobi nazaj, vsota je večkratnik $3$. Plačati točno $20$ je nemogoče, plačati $21$ pa je lahko.

V sosednji deželi imajo kovance za $7$ in $4$ tolarje. Tam lahko plača vsak znesek, saj je $D(7, 4) = 1$. Za $50$ tolarjev ima brez vračanja natanko dve možnosti: $2$ sedmici in $9$ štiric ali $6$ sedmic in $2$ štirici. Od prve možnosti do druge pride tako, da doda štiri sedmice in vzame sedem štiric stran: oboje je vredno $28$ tolarjev, zato se vsota ne spremeni.

## Drugače: Korak za korakom s številkami

Postopek na enačbi $19x + 8y = 5$:

1. Evklidov algoritem: $19 = 2 \cdot 8 + 3$, $8 = 2 \cdot 3 + 2$, $3 = 1 \cdot 2 + 1$. Torej $d = 1$, ki deli $5$.
2. Nazaj: $1 = 3 - 2 = 3 - (8 - 2 \cdot 3) = 3 \cdot 3 - 8$.
3. Vstavi $3 = 19 - 2 \cdot 8$: $1 = 3 \cdot 19 - 7 \cdot 8$.
4. Pomnoži s $5$: $19 \cdot 15 + 8 \cdot (-35) = 5$.
5. Vse rešitve: $x = 15 + 8t$, $y = -35 - 19t$.
6. Pri $t = -1$ dobiš rešitev z manjšimi števili: $x = 7$, $y = -16$. Preizkus: $133 - 128 = 5$.

## Preveri se

? Katera enačba ne sodi zraven, ker edina nima celoštevilskih rešitev?
- $6x + 9y = 21$
~ $D(6, 9) = 3$ deli $21$; rešitev je na primer $(2; 1)$.
- $4x + 10y = 14$
~ Oba koeficienta sta soda, a tudi $14$ je sodo: $D(4, 10) = 2$ deli $14$, rešitev je $(1; 1)$.
- $5x + 7y = 1$
~ Desna stran je majhna, a negativne rešitve so dovoljene: $(3; -2)$.
+ $6x + 15y = 20$
> $D(6, 15) = 3$, število $20$ pa ni deljivo s $3$. Pri ostalih treh $d$ deli desno stran.

? Risba kaže premico $3x + 5y = 30$ na mreži. Koliko je na njej točk, ki imajo obe koordinati celi in nenegativni?
:::risba graf
opis: Premica 3x + 5y = 30 na mreži s korakom 1. Seka os y pri 6 in os x pri 10.
x: 0 .. 10 | 1 | x
y: 0 .. 6 | 1 | y
enako: da
f: (30 - 3*x)/5 | modra
:::
= 3
~ 1 | Pozabil si točki na oseh: $(0; 6)$ in $(10; 0)$ sta tudi rešitvi, saj je $0$ nenegativno.
~ 11 | Preštel si vse navpične črte mreže. Celi morata biti obe koordinati, $y$ pa je cel samo, če $5 \mid 30 - 3x$.
> Točke so $(0; 6)$, $(5; 3)$ in $(10; 0)$. Korak med njimi je $(5; -3)$, kot napove formula $\frac{b}{d} = 5$, $\frac{a}{d} = 3$.

? Par $(3; -1)$ je rešitev enačbe $4x + 6y = 6$, $D(4, 6) = 2$. Kaj iz tega sledi za vse rešitve?
- $x$ se spreminja v korakih po $6$.
~ Vzel si korak $b$. Skupni delitelj $2$ se pokrajša, korak je $\frac{6}{2}$.
+ $x$ se spreminja v korakih po $3$, $y$ v korakih po $2$.
- $x$ se spreminja v korakih po $2$.
~ $2$ je $D(4, 6)$, ne korak. Korak za $x$ je $\frac{b}{d} = 3$.
- Druge rešitve ni.
~ Linearna enačba z rešitvijo jih ima neskončno: na primer $(0; 1)$.
> Vse rešitve so $x = 3 + 3t$, $y = -1 - 2t$, ker sta $\frac{b}{d} = 3$ in $\frac{a}{d} = 2$.

? Učenec rešuje $x^2 - y^2 = 12$ v naravnih številih. Kateri korak je napačen?
(1) $(x - y)(x + y) = 12$.
(2) Ker je $12 = 3 \cdot 4$, je $x - y = 3$ in $x + y = 4$.
(3) Seštejemo: $2x = 7$, zato rešitve ni.
- Korak (1)
~ To je pravilna razlika kvadratov.
+ Korak (2)
- Korak (3)
~ Za izbrani par je račun pravilen: $x = 3{,}5$ ni naravno. Napaka je prej.
> Pregledati je treba vse pare deliteljev: $1 \cdot 12$, $2 \cdot 6$, $3 \cdot 4$. Faktorja morata imeti isto parnost, ustreza le $2 \cdot 6$, ki da $x = 4$, $y = 2$.

? Razvrsti korake reševanja enačbe $ax + by = c$.
1. Z Evklidovim algoritmom izračunaj $d = D(a, b)$.
2. Preveri, ali $d$ deli $c$.
3. Z algoritmom nazaj zapiši $d = ax' + by'$.
4. Pomnoži s $\frac{c}{d}$ in dobiš eno rešitev $(x_0; y_0)$.
5. Zapiši vse rešitve s korakoma $\frac{b}{d}$ in $\frac{a}{d}$.
> Brez pogoja $d \mid c$ je iskanje nesmiselno. Algoritem nazaj da rešitev za desno stran $d$, zato šele množenje s $\frac{c}{d}$ da rešitev za $c$.

<<RACUN
vrednost: gcd(6, 9) | 3
vrednost: 7*2+4*9 | 50
vrednost: 7*6+4*2 | 50
enako: 7*(2+4*t)+4*(9-7*t) | 50
vrednost: 6*5+9*(-1) | 21
vrednost: 23^2-22^2 + 9^2-6^2 + 7^2-2^2 | 135
vrednost: Mod(2027, 4) | 3
vrednost: 11*2-3*7 | 1
enako: 11*(6+7*t)+7*(-9-11*t) | 3
enako: (x-2)*(y-2) | x*y-2*x-2*y+4
vrednost: 1/2+1/3+1/6 | 1
vrednost: 1/2+1/4+1/4 | 1
vrednost: 3*19-7*8 | 1
enako: 19*(15+8*t)+8*(-35-19*t) | 5
vrednost: 3*5+5*3 | 30
enako: 4*(3+3*t)+6*(-1-2*t) | 6
>>

:::simboli
a, b | koeficienta linearne enačbe | | |
c | desna stran enačbe | | |
d | največji skupni delitelj $D(a, b)$ | d = D(a, b) | |
x, y | neznanki (celi števili) | | |
x_0, y_0 | ena (posebna) rešitev | | |
t | poljubno celo število (parameter) | | |
z | tretja neznanka | | |
u | polovica $x$ pri spustu | u = \frac{x}{2} | |
x_1, y_1, z_1 | tretjine $x$, $y$, $z$ pri spustu (manjša rešitev) | | |
:::
