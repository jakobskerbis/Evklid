---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Bolnik vsako jutro vzame tableto s $100\,\mathrm{mg}$ zdravila. Do naslednjega jutra jetra in ledvice izločijo polovico tega, kar je v telesu. Ali se zdravilo kopiči brez konca?

Druga zgodba: v posodo za zalivanje vsak dan dolijemo $100\,\mathrm{L}$ vode, čez dan pa polovica vode, ki je v njej, izhlapi in se porabi. Ali se posoda kdaj prelije?

Telo in posoda nimata nič skupnega, računica pa je obakrat ista: *jutrišnja količina je polovica današnje in še $100$.* Pravilu, ki vsak člen zaporedja izračuna iz prejšnjih, rečemo **rekurzija**. Na tekmovanjih rekurzije srečaš pri štetju, deljivosti in neenakostih. Odprti sta dve vprašanji: kako iz rekurzije dobiti formulo za $n$-ti člen in kako z **indukcijo** dokazati, da formula res velja za vsa naravna števila.

## Razlaga

**Slika 1: zdravilo se ustali.** Naj bo $a_n$ količina zdravila v miligramih tik po $n$-ti tableti. Prva tableta da $a_1 = 100$, nato vsakič razpolovimo in prištejemo $100$:

| $n$ | $a_n$ [mg] | do $200\,\mathrm{mg}$ manjka |
|---|---|---|
| 1 | 100 | 100 |
| 2 | 150 | 50 |
| 3 | 175 | 25 |
| 4 | 187,5 | 12,5 |
| 5 | 193,75 | 6,25 |

Desni stolpec pove vse: razdalja do $200$ se vsak dan razpolovi. Na številski premici so to skoki, ki se krajšajo:

:::risba premica
opis: Številska premica od 0 do 200. Točke 100, 150, 175 in 187,5 so prve štiri količine zdravila. Skoki med njimi so dolgi 50, 25 in 12,5. Pri 200 je označena meja L.
od: 0
do: 200
korak: 25
oznake: 2
točka: 100 | a₁ | modra
točka: 150 | a₂ | modra
točka: 175 | a₃ | modra
točka: 187,5 | a₄ | modra
točka: 200 | L | prazna
skok: 100 -> 150 | +50
skok: 150 -> 175 | +25
skok: 175 -> 187,5 | +12,5
:::

Zdravilo se torej ne kopiči brez konca, ampak se ustali pri $200\,\mathrm{mg}$. Številu, pri katerem se zaporedje ne bi več spremenilo, rečemo **ravnovesje** (negibna točka): $\frac{200}{2} + 100 = 200$.

:::premisli
Kaj se zgodi, če bolnik začne z udarnim odmerkom in je $a_1 = 300\,\mathrm{mg}$? Napovej prve tri člene.
---
Zaporedje pada proti istemu ravnovesju: $300$, $250$, $225$. Razdalja do $200$ je $100$, $50$, $25$ in se še vedno razpolavlja; začetek spremeni le pot, ne cilja.
:::

Šele zdaj simboli. Rekurzija oblike $a_{n+1} = q\,a_n + d$ je **linearna rekurzija prvega reda**. Ravnovesje $L$ reši enačbo $L = qL + d$, zato $L = \frac{d}{1 - q}$ (pri $q \ne 1$). Razdalja do ravnovesja se vsakič pomnoži s $q$:

$$a_n - L = q^{\,n-1}(a_1 - L)$$

Pri zdravilu: $a_n = 200 - 100 \cdot \left(\frac{1}{2}\right)^{n-1}$.

Isti trik reši Hanojske stolpe, kjer stolp ploščic prestavimo na drug drog, po eno ploščico naenkrat in nikoli večje na manjšo. Za $n$ ploščic potrebujemo $h_n = 2h_{n-1} + 1$ potez. Ravnovesje je $-1$, zato se $h_n + 1$ vsakič podvoji in $h_n = 2^n - 1$. V simulaciji spodaj (Hanojski stolpi: rekurzija) premakni stolp s $4$ ploščicami in opazi: najprej preneseš zgornje $3$ ($7$ potez), nato največjo ($1$ poteza), nato spet $3$ ($7$ potez), skupaj $15$.

**Slika 2: celice se delijo.** V kulturi celic vsaka celica, stara vsaj dva dni, vsak dan da dve novi. Naj bo $a_n$ število celic na dan $n$, $a_0 = a_1 = 1$. Danes imamo vse včerajšnje celice in še po dve novi za vsako celico, ki je obstajala predvčerajšnjim: $a_{n+2} = a_{n+1} + 2a_n$. Tabela s količnikom zaporednih členov:

| $n$ | $a_n$ | $a_n : a_{n-1}$ |
|---|---|---|
| 2 | 3 | 3 |
| 3 | 5 | 1,667 |
| 4 | 11 | 2,2 |
| 5 | 21 | 1,909 |
| 6 | 43 | 2,048 |
| 7 | 85 | 1,977 |

Količnik skače okoli $2$: enkrat nad, enkrat pod. Rast je skoraj geometrijska s količnikom $2$, z majhnim popravkom, ki menja predznak.

To nas vodi do nastavka $a_n = r^n$. Vstavimo ga v rekurzijo in delimo z $r^n$: dobimo $r^2 = r + 2$, torej $r = 2$ ali $r = -1$. Člen z $(-1)^n$ je ravno popravek, ki menja predznak. Ker rekurzija le sešteva večkratnike členov, jo reši tudi vsota večkratnikov obeh potenc:

$$a_n = A \cdot 2^n + B \cdot (-1)^n$$

Iz $a_0 = 1$ dobimo $A + B = 1$, iz $a_1 = 1$ pa $2A - B = 1$. Torej $A = \frac{2}{3}$, $B = \frac{1}{3}$ in $a_n = \frac{2^{n+1} + (-1)^n}{3}$. Za $n = 6$: $\frac{128 + 1}{3} = 43$, kot v tabeli.

Splošno pravilo. Za **linearno rekurzijo drugega reda** $a_{n+2} = b\,a_{n+1} + c\,a_n$ zapišemo **karakteristično enačbo** $r^2 = br + c$. Če ima različni ničli $r_1$ in $r_2$, je $a_n = A r_1^{\,n} + B r_2^{\,n}$; konstanti $A$ in $B$ določita prva dva člena. (Pri dvojni ničli $r$ je $a_n = (A + Bn)\,r^n$.) Rekurzijo za potenčne vsote $s_n = x_1^n + x_2^n$, torej $s_n = e_1 s_{n-1} - e_2 s_{n-2}$ z $e_1 = x_1 + x_2$ in $e_2 = x_1 x_2$, že poznaš iz Vietovih formul: ničli njene karakteristične enačbe sta ravno $x_1$ in $x_2$.

**Slika 3: indukcija kot veriga skokov.** Formulo smo uganili iz tabele. Da velja za *vse* $n$, dokažemo z indukcijo. Predstavljaj si naravna števila kot točke na premici.

**Popolna (matematična) indukcija** ima dva dela. *Baza:* trditev preverimo pri začetnem $n_0$. *Indukcijski korak:* dokažemo, da iz veljavnosti pri $n$ sledi veljavnost pri $n + 1$. Baza postavi prvo točko, korak je skok na naslednjo; tako pridemo do vsake.

Pri **krepki indukciji** smemo v koraku uporabiti trditev za *vsa* manjša števila, ne le za predhodnika. Primer: tablete po $3\,\mathrm{mg}$ in $5\,\mathrm{mg}$. Odmerke $8$, $9$ in $10\,\mathrm{mg}$ sestavimo neposredno, vsak večji pa dobimo s skokom za $3$ od odmerka, manjšega za $3$:

:::risba premica
opis: Številska premica od 7 do 17. Točke 8, 9 in 10 so baza. Skoki dolžine 3 vodijo od 8 do 11 in 14, od 9 do 12 in 15, od 10 do 13 in 16.
od: 7
do: 17
točka: 8 | baza | zelena
točka: 9 | baza | zelena
točka: 10 | baza | zelena
skok: 8 -> 11 | +3
skok: 9 -> 12 | +3
skok: 10 -> 13 | +3
skok: 11 -> 14 | +3
skok: 12 -> 15 | +3
skok: 13 -> 16 | +3
:::

Tri verige skokov skupaj pokrijejo vsa števila od $8$ naprej. Zato potrebujemo tri baze: skok za $3$ iz ene same baze bi zadel le vsako tretje število.

Krepka indukcija dokaže tudi formulo za celice. Naj velja za $n$ in $n + 1$. Obe formuli vstavimo v $a_{n+2} = a_{n+1} + 2a_n$:

$$a_{n+2} = \frac{2^{n+2} + (-1)^{n+1}}{3} + \frac{2 \cdot 2^{n+1} + 2 \cdot (-1)^n}{3}$$

Števca seštejemo: $2^{n+2} + 2 \cdot 2^{n+1} = 2^{n+3}$ in $(-1)^{n+1} + 2 \cdot (-1)^n = (-1)^n$. Dobimo $\frac{2^{n+3} + (-1)^n}{3}$, torej formulo pri $n + 2$, saj je $(-1)^{n+2} = (-1)^n$.

:::premisli
Zakaj pri dokazu formule za celice preverimo bazo pri $n = 0$ *in* $n = 1$, pri formuli za zdravilo pa zadošča ena baza?
---
Korak za celice uporabi dva prejšnja člena ($a_{n+2}$ iz $a_{n+1}$ in $a_n$). Iz same baze $n = 0$ ne bi mogli narediti niti prvega skoka do $n = 2$, $n = 1$ pa bi ostal nedokazan. Pri zdravilu vsak člen potrebuje le predhodnika.
:::

## Rešeni primeri

### Primer 1: ravnovesje in formula

Zaporedje je dano z $a_0 = 5$ in $a_{n+1} = 3a_n - 4$. Poišči formulo za $a_n$ in izračunaj $a_5$.

**Podatki:** $a_0 = 5$; $a_{n+1} = 3a_n - 4$
**Iščemo:** formulo za $a_n$ in $a_5$

:::formula
Ravnovesje $L = qL + d$; razdalja do ravnovesja se vsakič pomnoži s $q$: $a_n - L = q^n (a_0 - L)$ pri začetku $a_0$.
:::

**Rešitev:**

1. Ravnovesje: $L = 3L - 4$, torej $L = 2$.
2. Razdalja $a_n - 2$ se vsak korak pomnoži s $3$, ker je $a_{n+1} - 2 = 3(a_n - 2)$.
3. Na začetku je $a_0 - 2 = 3$, zato $a_n - 2 = 3 \cdot 3^n$ in $a_n = 2 + 3^{n+1}$.
4. Kontrola: $a_1 = 3 \cdot 5 - 4 = 11$ in $2 + 3^2 = 11$.
5. $a_5 = 2 + 3^6 = 731$.

Odgovor: $a_n = 2 + 3^{n+1}$, zato $a_5 = 731$.

### Primer 2: popolna indukcija za deljivost

Dokaži, da $7$ deli $3^{2n+1} + 2^{n+2}$ za vsako celo število $n \ge 0$.

**Podatki:** izraz $3^{2n+1} + 2^{n+2}$; $n \ge 0$
**Iščemo:** dokaz, da je izraz vedno večkratnik števila $7$

:::formula
Baza pri $n = 0$; korak: novi izraz zapiši s starim izrazom in večkratnikom števila $7$.
:::

**Rešitev:**

1. *Baza:* pri $n = 0$ je izraz $3^1 + 2^2 = 7$. Velja.
2. *Predpostavka:* naj bo $3^{2n+1} + 2^{n+2} = 7m$ za neko celo število $m$.
3. *Korak:* pri $n + 1$ je izraz $3^{2n+3} + 2^{n+3} = 9 \cdot 3^{2n+1} + 2 \cdot 2^{n+2}$.
4. Zapišemo $9 = 2 + 7$: izraz je $2\left(3^{2n+1} + 2^{n+2}\right) + 7 \cdot 3^{2n+1} = 2 \cdot 7m + 7 \cdot 3^{2n+1}$.
5. Oba člena sta večkratnika $7$, zato tudi vsota. Kontrola pri $n = 2$: $3^5 + 2^4 = 259 = 7 \cdot 37$.

Odgovor: po popolni indukciji $7$ deli $3^{2n+1} + 2^{n+2}$ za vse $n \ge 0$.

### Primer 3: odmerki iz dveh vrst tablet

Lekarna ima tablete po $3\,\mathrm{mg}$ in po $5\,\mathrm{mg}$; tablet ne lomimo. Dokaži, da lahko natančno sestavimo vsak odmerek od $8\,\mathrm{mg}$ naprej. Kateri je največji celoštevilski odmerek, ki ga ne moremo sestaviti?

**Podatki:** tableti $3\,\mathrm{mg}$ in $5\,\mathrm{mg}$; odmerek $n \ge 8$ celih miligramov
**Iščemo:** dokaz za vse $n \ge 8$ in največji nedosegljivi odmerek

:::formula
Krepka indukcija: baze $8$, $9$, $10$; korak $n - 3 \to n$ z eno tableto po $3\,\mathrm{mg}$ več.
:::

**Rešitev:**

1. *Baze:* $8 = 3 + 5$, $9 = 3 + 3 + 3$, $10 = 5 + 5$.
2. *Korak:* naj bo $n \ge 11$ in naj se da sestaviti vsak odmerek od $8$ do $n - 1$. Ker je $n - 3 \ge 8$, se da sestaviti tudi $n - 3$. Dodamo eno tableto po $3\,\mathrm{mg}$ in dobimo $n$.
3. Korak uporabi trditev za $n - 3$, ne za $n - 1$, zato gre za krepko indukcijo.
4. *Obratno vprašanje:* $7$ ni mogoče. Brez tablete po $5\,\mathrm{mg}$ bi moral biti $7$ večkratnik števila $3$, z eno pa ostanek $7 - 5 = 2$; nobeno ni. Vsi večji odmerki pa gredo po dokazanem.

Odgovor: vsak odmerek od $8\,\mathrm{mg}$ naprej je mogoč; največji nedosegljivi je $7\,\mathrm{mg}$.

### Primer 4: zdaj ti

Zaporedje je dano z $a_0 = 2$, $a_1 = 5$ in $a_{n+2} = 5a_{n+1} - 6a_n$. Poišči formulo za $a_n$ in izračunaj $a_6$.

**Podatki:** $a_0 = 2$; $a_1 = 5$; $a_{n+2} = 5a_{n+1} - 6a_n$
**Iščemo:** formulo za $a_n$ in $a_6$

:::formula
Karakteristična enačba $r^2 = br + c$; $a_n = A r_1^{\,n} + B r_2^{\,n}$.
:::

**Rešitev:**

1. Karakteristična enačba je $r^2 = 5r - 6$, ničli sta $r_1 = 2$ in $r_2 = 3$.
2. Nastavek $a_n = A \cdot 2^n + B \cdot 3^n$. Iz $a_0$ in $a_1$: $A + B = 2$ in $2A + 3B = 5$.
3. Reši sistem in izračunaj $a_6$.

:::premisli
Koliko sta $A$ in $B$ ter koliko je $a_6$?
---
Iz sistema je $B = 1$ in $A = 1$, zato $a_n = 2^n + 3^n$. Kontrola: $a_2 = 5 \cdot 5 - 6 \cdot 2 = 13 = 4 + 9$. Nato $a_6 = 64 + 729 = 793$.
:::

## Pogoste napake

- **Korak brez baze.** »Če je $n^2 + n$ liho, je tudi $(n+1)^2 + (n+1) = n^2 + n + 2(n + 1)$ liho, torej je vedno liho.« Korak je pravilen, a baza ne velja: $1^2 + 1 = 2$ je sodo. Brez baze veriga skokov nima začetka. Vedno najprej preveri bazo.
- **Ena baza, korak pa uporabi dva člena.** Pri rekurziji drugega reda korak potrebuje $n$ in $n + 1$. Z eno samo bazo ostane drugi začetni člen nedokazan. Preveri toliko baz, kolikor nazaj seže korak (pri tabletah tri).
- **Zamik indeksov.** Pri $a_n = A r_1^{\,n} + B r_2^{\,n}$ in začetku $a_1$ nekateri vstavijo $a_1$ kot $n = 0$, pa dobijo napačna $A$ in $B$. Konstante vedno računaj z indeksom, ki ga ima člen.
- **Ravnovesje narobe.** »Ob dvojnem odmerku se raven ustali $100\,\mathrm{mg}$ višje« ali »ostane $200\,\mathrm{mg}$, ker se polovica vedno izloči«. Ravnovesje je $L = \frac{d}{1 - q}$, sorazmerno z odmerkom $d$: dvojni odmerek da dvojno ravnovesje. Od začetne vrednosti pa ravnovesje ni odvisno.
- **Predznak v karakteristični enačbi.** Iz $a_{n+2} = 5a_{n+1} - 6a_n$ nekdo zapiše $r^2 + 5r - 6 = 0$. Člene prenesi na levo s spremenjenim predznakom: $r^2 - 5r + 6 = 0$.

## Povzetek

- Rekurzija izračuna člen iz prejšnjih. Linearna prvega reda $a_{n+1} = q a_n + d$: ravnovesje $L = \frac{d}{1 - q}$, razdalja do $L$ se vsakič pomnoži s $q$.
- Linearna drugega reda $a_{n+2} = b a_{n+1} + c a_n$: karakteristična enačba $r^2 = br + c$; pri različnih ničlah $a_n = A r_1^{\,n} + B r_2^{\,n}$, $A$ in $B$ iz prvih dveh členov.
- Popolna indukcija: baza pri $n_0$ in korak $n \to n + 1$.
- Krepka indukcija: korak sme uporabiti vse manjše primere; baz je toliko, kolikor nazaj seže korak.
- Formulo, uganjeno iz tabele, vedno dokaži z indukcijo ali preveri na nekaj členih.

## Drugače: Z analogijo

Indukcija je kot plezanje po lestvi. Baza pove, da stojiš na prvi prečki. Korak pove, da s katerekoli prečke dosežeš naslednjo. Skupaj zagotovita, da prideš do vsake prečke, ne glede na to, kako visoko je.

Krepka indukcija je kot lestev, pri kateri so prečke daleč narazen, zato se odrineš od prečke dve ali tri nižje. Takrat moraš na začetku stati na več prečkah hkrati, sicer kakšne nikoli ne dosežeš. Pri tabletah so to prečke $8$, $9$ in $10$.

Rekurzija je navodilo za naslednjo prečko, formula za $a_n$ pa je naslov prečke, do katere skočiš naravnost.

## Drugače: Iz vsakdanjega življenja

Skodelica kave ima približno $100\,\mathrm{mg}$ kofeina. Telo ga izloči tako, da ga po približno $6$ urah ostane polovica. V $24$ urah so to štiri razpolovitve, zato do naslednjega jutra ostane $\frac{1}{16}$ kofeina.

Če piješ eno kavo vsako jutro, je količina zjutraj po kavi $a_{n+1} = \frac{1}{16} a_n + 100$. Ravnovesje je $L = \frac{100}{1 - \frac{1}{16}} \approx 107\,\mathrm{mg}$. Kofein se torej skoraj ne kopiči, ker se v enem dnevu skoraj ves izloči. Pri zdravilu iz začetka lekcije, kjer ostane polovica, je ravnovesje dvakratni odmerek. Daljši ko je razpolovni čas glede na presledek med odmerki, višje je ravnovesje.

## Preveri se

? Pri dokazu, da lahko iz tablet po $3\,\mathrm{mg}$ in $5\,\mathrm{mg}$ sestavimo vsak odmerek $n \ge 8$, v koraku uporabimo trditev za $n - 3$. Kako imenujemo to vrsto dokaza?
- Popolna indukcija s korakom $n \to n + 1$.
~ Navadni korak uporabi le predhodnika $n - 1$. Tu sklepamo iz $n - 3$, zato potrebujemo krepko indukcijo in tri baze.
+ Krepka indukcija.
- Rekurzija.
~ Rekurzija je pravilo, ki določa člene zaporedja. Dokazna metoda je indukcija.
- Dokaz s protislovjem.
~ Ničesar ne predpostavimo napačnega in ne pridemo do protislovja; iz manjših primerov gradimo večje.
> Krepka indukcija sme v koraku uporabiti katerikoli manjši primer, tu $n - 3$. Zato so baze $8$, $9$ in $10$.

? Raven zdravila sledi $a_{n+1} = 0{,}5\,a_n + 100$ in se ustali pri $200\,\mathrm{mg}$. Kaj se zgodi, če dnevni odmerek podvojimo na $200\,\mathrm{mg}$?
- Raven se ustali pri $300\,\mathrm{mg}$.
~ Dodatnih $100\,\mathrm{mg}$ ne prišteješ enkrat: vsak dan pride več, zato je ravnovesje $L = \frac{d}{1 - q}$ sorazmerno z odmerkom.
+ Raven se ustali pri $400\,\mathrm{mg}$.
- Raven ostane $200\,\mathrm{mg}$, ker se polovica vedno izloči.
~ Izloči se polovica tega, kar je v telesu, zato se ravnovesje premakne skupaj z odmerkom.
- Raven narašča brez meje.
~ Dokler je $q = 0{,}5 < 1$, se razdalja do ravnovesja razpolavlja, ne glede na velikost odmerka.
> $L = \frac{200}{1 - 0{,}5} = 400\,\mathrm{mg}$: dvojni odmerek da dvojno ravnovesje.

? Razvrsti korake reševanja linearne rekurzije drugega reda $a_{n+2} = b\,a_{n+1} + c\,a_n$.
1. Zapiši karakteristično enačbo $r^2 = br + c$.
2. Poišči njeni ničli $r_1$ in $r_2$.
3. Zapiši nastavek $a_n = A r_1^{\,n} + B r_2^{\,n}$.
4. Iz prvih dveh členov določi $A$ in $B$.
5. Preveri formulo na naslednjem členu ali jo dokaži z indukcijo.
> Ničli potrebuješ za nastavek, nastavek za sistem za $A$ in $B$; preverjanje je na koncu.

? Na premici so prvi štirje členi zaporedja $a_{n+1} = q\,a_n + d$. Odčitaj dolžine skokov in določi ravnovesje $L$.
:::risba premica
opis: Številska premica od 0 do 90. Točke 0, 40, 60 in 70 so členi a₀, a₁, a₂ in a₃. Skoki med njimi so dolgi 40, 20 in 10.
od: 0
do: 90
korak: 10
točka: 0 | a₀ | modra
točka: 40 | a₁ | modra
točka: 60 | a₂ | modra
točka: 70 | a₃ | modra
skok: 0 -> 40 | +40
skok: 40 -> 60 | +20
skok: 60 -> 70 | +10
:::
= 80
~ 75 | To je le naslednji člen $a_4$. Skoki se nadaljujejo: $5 + 2{,}5 + \dots = 10$, zato je meja $70 + 10$.
~ 70 | To je zadnja narisana točka, zaporedje pa še narašča.
> Skoki se razpolavljajo, zato je $q = 0{,}5$ in $d = a_1 - q a_0 = 40$. Ravnovesje $L = \frac{40}{1 - 0{,}5} = 80$.

? Zaporedje je dano z $a_0 = 2$, $a_1 = 3$ in $a_{n+2} = 3a_{n+1} - 2a_n$. Koliko je $a_{10}$?
= 1025
~ 1024 | To je le $2^{10}$. Pozabil si člen $A \cdot 1^n = 1$, ki ga daje ničla $r = 1$.
~ 2049 | Zamaknil si indeks: $2^{11} + 1$ je $a_{11}$.
> Karakteristična enačba $r^2 = 3r - 2$ ima ničli $1$ in $2$. Iz $A + B = 2$ in $A + 2B = 3$ je $A = B = 1$, zato $a_n = 1 + 2^n$ in $a_{10} = 1025$.

<<RACUN
vrednost: 100/2+100 | 150
vrednost: 187.5/2+100 | 193.75
vrednost: 100/(1-1/2) | 200
vrednost: 200-100*(1/2)^4 | 193.75
vrednost: 2^4-1 | 15
resi: r^2=r+2 | r | -1, 2
resi: A+B=1, 2*A-B=1 | A, B | A=2/3, B=1/3
vrednost: (2^7+(-1)^6)/3 | 43
enako: (2^(n+2)+(-1)^(n+1))/3+(2*2^(n+1)+2*(-1)^n)/3 | (2^(n+3)+(-1)^n)/3
resi: L=3*L-4 | L | 2
vrednost: 2+3^6 | 731
enako: 3^(2*n+3)+2^(n+3) | 2*(3^(2*n+1)+2^(n+2))+7*3^(2*n+1)
vrednost: 3^5+2^4 | 259
resi: r^2=5*r-6 | r | 2, 3
resi: A+B=2, 2*A+3*B=5 | A, B | A=1, B=1
vrednost: 2^6+3^6 | 793
vrednost: 200/(1-0.5) | 400
vrednost: 40/(1-0.5) | 80
vrednost: 1+2^10 | 1025
vrednost: 100/(1-1/16) | 1600/15
>>

:::simboli
a_n | $n$-ti člen zaporedja | | | pri zdravilu v mg
a_1 | prvi člen (pri zdravilu po prvi tableti) | | |
a_0 | začetni člen | | |
a_{n+2} | člen, izračunan iz dveh prejšnjih | a_{n+2} = b\,a_{n+1} + c\,a_n | |
q | faktor, s katerim se množi prejšnji člen | | – | pri zdravilu delež, ki ostane
d | stalni dodatek v vsakem koraku | | | pri zdravilu dnevni odmerek
L | ravnovesje (negibna točka) | L = \frac{d}{1 - q} | |
n | indeks člena | | |
h_n | število potez pri $n$ ploščicah | h_n = 2h_{n-1} + 1 | |
A, B | konstanti v formuli za $a_n$ | | | določita ju prva dva člena
r | ničla karakteristične enačbe | r^2 = br + c | |
b, c | koeficienta rekurzije drugega reda | | |
:::
