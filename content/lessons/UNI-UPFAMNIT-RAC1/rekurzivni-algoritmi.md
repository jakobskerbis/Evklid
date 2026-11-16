---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta 1883 je francoski matematik Édouard Lucas izdal igračo z lesenimi palicami in luknjastimi diski različnih velikosti. Imenoval jo je **hanojski stolp**. Diske je treba prestaviti z ene palice na drugo, vendar lahko naenkrat premakneš le en disk in večjega nikoli ne smeš položiti na manjšega. Zraven je priložil legendo o menihih, ki prestavljajo $64$ zlatih diskov, in ko bodo končali, bo konec sveta.

Kako opisati rešitev za poljubno število diskov? Lucas je opazil, da se veliki problem skriva v manjšem: če znaš prestaviti stolp s tremi diski, znaš prestaviti tudi stolp s štirimi. Ta misel se imenuje **rekurzija**. Programski jeziki so jo kasneje sprejeli tako, da funkcija lahko pokliče samo sebe. To je dovolil že ALGOL 60.

Ista zamisel ti danes pomaga v spletni trgovini. Ko v ceniku z milijon izdelki, urejenimi po ceni, iščeš izdelek z določeno ceno, ga program najde v največ $20$ korakih, ne v milijon. Zakaj, boš videl spodaj.

## Razlaga

Začnimo s sliko. Na blagajni je račun s cenami $3$ €, $5$ € in $2$ €. Funkcija `vsota` ga sešteje tako, da vzame prvo ceno in jo prišteje k vsoti **ostanka** računa. Za ostanek pokliče kar samo sebe:

| klic | kaj izračuna | vrne |
|---|---|---|
| `vsota([3, 5, 2])` | $3 +$ `vsota([5, 2])` | $10$ |
| `vsota([5, 2])` | $5 +$ `vsota([2])` | $7$ |
| `vsota([2])` | $2 +$ `vsota([])` | $2$ |
| `vsota([])` | nič več ni, vrne $0$ | $0$ |

Tabelo beri dvakrat. Navzdol se klici kopičijo: vsak čaka na odgovor klica pod sabo. Navzgor se odgovori vračajo: $0$, nato $2$, nato $7$, na koncu $10$.

Čakajoči klici se zlagajo eden na drugega kot krožniki. To je **klicni sklad**, ista struktura LIFO, ki jo poznaš iz povezanih struktur. Zadnji poklicani klic se prvi konča.

Iz slike razberemo dve sestavini vsake rekurzivne funkcije:

- **Osnovni primer**: tako majhen problem, da odgovor poznamo brez nadaljnjih klicev (prazen račun ima vsoto $0$).
- **Rekurzivni korak**: problem zmanjšamo in pokličemo isto funkcijo na manjšem problemu (račun brez prve cene).

```text
vsota(cene):
    če je cene prazen: vrni 0
    vrni cene[0] + vsota(cene brez prvega)
```

:::premisli
Kaj se zgodi, če iz funkcije odstranimo vrstico z osnovnim primerom in jo pokličemo na računu s tremi cenami?
---
Ko račun postane prazen, ga funkcija vseeno skuša razdeliti na prvo ceno in ostanek. Klici se nikoli ne začnejo vračati. Program se konča z napako: ali ni prvega elementa, ali zmanjka prostora na klicnem skladu (**prekoračitev sklada**).
:::

**Rekurzija proti iteraciji.** Isti račun lahko seštejemo z zanko. Temu pravimo **iteracija**:

```text
vsota_z_zanko(cene):
    s = 0
    za vsako c v cene: s = s + c
    vrni s
```

| | rekurzija | iteracija |
|---|---|---|
| ponavljanje | funkcija kliče sebe | zanka |
| ustavitev | osnovni primer | pogoj zanke |
| pomnilnik | prostor na skladu za vsak klic | nekaj spremenljivk |

Za seštevanje je zanka preprostejša in varčnejša. Rekurzija zasije tam, kjer se problem naravno razcepi na manjše kopije samega sebe. Dva taka primera sta hanojski stolp in dvojiško iskanje.

**Hanojski stolp na sliki.** Imamo tri palice: $A$ (začetek), $B$ (pomožna) in $C$ (cilj). Na $A$ je stolp $n$ diskov, največji spodaj. Pomisli na **največji** disk. Da ga lahko premaknemo na $C$, mora biti vse nad njim nekje drugje, in to ne na $C$, sicer bi ga položili na manjši disk. Torej:

1. Stolp z $n - 1$ manjšimi diski prestavi z $A$ na $B$ (pomožna je zdaj $C$).
2. Največji disk prestavi z $A$ na $C$.
3. Stolp z $n - 1$ diski prestavi z $B$ na $C$ (pomožna je zdaj $A$).

Koraka 1 in 3 sta isti problem z enim diskom manj. Osnovni primer je stolp brez diskov: nič ni treba narediti. Potez je torej dvakrat toliko kot za en disk manj, plus ena.

| diskov $n$ | potez |
|---|---|
| 1 | 1 |
| 2 | 3 |
| 3 | 7 |
| 4 | 15 |

:::premisli
Iz tabele napovej, koliko potez potrebuješ za $5$ diskov. Ali opaziš, kako je število potez povezano s potencami števila $2$?
---
$2 \cdot 15 + 1 = 31$. Vsako število je za $1$ manjše od potence $2$: $1, 3, 7, 15, 31$ so $2^1 - 1, 2^2 - 1, \ldots, 2^5 - 1$.
:::

Šele zdaj simboli. Če $P(n)$ označuje število potez, velja $P(0) = 0$ in $P(n) = 2P(n-1) + 1$, kar da $P(n) = 2^n - 1$. Za $64$ diskov iz legende je to več kot $1{,}8 \cdot 10^{19}$ potez.

**Dvojiško iskanje na številski premici.** Cene osmih izdelkov so urejene od najcenejšega do najdražjega. Pod vsako ceno je indeks:

:::risba premica
opis: Številska premica z indeksi od 0 do 7. Nad vsakim indeksom je cena: indeks 0 je 2 €, indeks 1 je 5 €, indeks 2 je 8 €, indeks 3 je 12 €, indeks 4 je 16 €, indeks 5 je 23 €, indeks 6 je 38 €, indeks 7 je 56 €.
od: 0
do: 7
točka: 0 | 2 €
točka: 1 | 5 €
točka: 2 | 8 €
točka: 3 | 12 €
točka: 4 | 16 €
točka: 5 | 23 €
točka: 6 | 38 €
točka: 7 | 56 €
podnapis: Urejen cenik: pod premico indeks, nad točko cena
:::

Iščemo izdelek za $23$ €. Pogledamo sredino, indeks $3$, kjer je $12$ €. Ker je $12 < 23$ in so cene urejene, je iskani izdelek gotovo **desno**. Leva polovica odpade naenkrat. Med indeksoma $4$ in $7$ je sredina indeks $5$, tam je $23$ €. Našli smo ga v dveh primerjavah.

Vsaka primerjava razpolovi del, kjer še iščemo. Iskanje v polovici je isti problem na manjšem delu tabele, zato ga zapišemo rekurzivno. Meji dela sta indeksa `lo` in `hi`:

```text
isci(t, x, lo, hi):
    če lo > hi: vrni -1              # osnovni primer: ni ga
    s = (lo + hi) // 2               # celoštevilsko deljenje
    če t[s] == x: vrni s             # osnovni primer: našli
    če t[s] < x: vrni isci(t, x, s + 1, hi)
    vrni isci(t, x, lo, s - 1)
```

Največ dela je, ko iskanega elementa ni ali ga najdemo šele v zadnjem koraku. Tabela z $n$ elementi zahteva največ $\lceil \log_2(n+1) \rceil$ primerjav. Iskanje po vrsti od začetka pa jih lahko zahteva $n$. Dvojiško iskanje deluje **samo na urejeni tabeli**.

## Rešeni primeri

### Primer 1: račun po korakih

Na računu so cene $4$ €, $7$ € in $9$ €. Sledi rekurzivni funkciji `vsota`: koliko klicev nastane in kaj vrne vsak?

**Podatki:** cene $4$ €, $7$ €, $9$ €; osnovni primer: prazen račun vrne $0$
**Iščemo:** število klicev, vrednost vsakega klica in skupno vsoto

:::formula
`vsota(cene)` $=$ prva cena $+$ `vsota(ostanek)`, `vsota([])` $= 0$
:::

**Rešitev:**

1. Klici gredo navzdol: `vsota([4, 7, 9])`, `vsota([7, 9])`, `vsota([9])`, `vsota([])`. To so $4$ klici, eden več, kot je cen, ker se ustavimo šele pri praznem računu.
2. Najgloblji klic vrne $0$.
3. `vsota([9])` vrne $9 + 0 = 9$.
4. `vsota([7, 9])` vrne $7 + 9 = 16$.
5. `vsota([4, 7, 9])` vrne $4 + 16 = 20$.
6. Odgovor: nastanejo $4$ klici, skupna vsota je $20$ €.

### Primer 2: trije diski

Na palici $A$ so trije diski. Zapiši vse poteze, s katerimi jih prestaviš na palico $C$, in preveri število potez s pravilom.

**Podatki:** $n = 3$ diski, začetna palica $A$, pomožna $B$, cilj $C$
**Iščemo:** zaporedje potez in njihovo število

:::formula
premakni $n - 1$ na pomožno, največjega na cilj, $n - 1$ s pomožne na cilj; $P(n) = 2P(n-1) + 1$
:::

**Rešitev:**

1. Prestavi zgornja dva diska z $A$ na $B$ (pri tem je $C$ pomožna): $A \to C$, $A \to B$, $C \to B$.
2. Največji disk: $A \to C$.
3. Prestavi dva diska z $B$ na $C$ (pomožna je $A$): $B \to A$, $B \to C$, $A \to C$.
4. Štetje: $3 + 1 + 3 = 7$, s pravilom $P(3) = 2P(2) + 1 = 2 \cdot 3 + 1 = 7$.
5. Odgovor: poteze so $A \to C$, $A \to B$, $C \to B$, $A \to C$, $B \to A$, $B \to C$, $A \to C$; skupaj $7$ potez.

### Primer 3: iskanje v ceniku

Trgovina ima urejen cenik iz razlage ($2$, $5$, $8$, $12$, $16$, $23$, $38$, $56$ €). Kupec išče izdelek za $38$ €. Koliko primerjav naredi dvojiško iskanje? Koliko primerjav bi v najslabšem primeru potrebovali, če bi imel cenik $1000$ izdelkov?

**Podatki:** urejena tabela $8$ cen (indeksi $0$ do $7$), iskana cena $x = 38$ €; drugi cenik: $n = 1000$
**Iščemo:** število primerjav za $x = 38$ in največje število primerjav pri $n = 1000$

:::formula
$s = (\mathrm{lo} + \mathrm{hi})$ celoštevilsko deljeno z $2$; največ $\lceil \log_2(n+1) \rceil$ primerjav
:::

**Rešitev:**

1. $\mathrm{lo} = 0$, $\mathrm{hi} = 7$, sredina $s = 3$, cena $12$. Ker je $12 < 38$, iščemo desno: $\mathrm{lo} = 4$.
2. $\mathrm{lo} = 4$, $\mathrm{hi} = 7$, sredina $s = 5$ ($11$ deljeno z $2$ je $5$, ostanek zavržemo), cena $23 < 38$: $\mathrm{lo} = 6$.
3. $\mathrm{lo} = 6$, $\mathrm{hi} = 7$, sredina $s = 6$, cena $38$. Našli smo ga.
4. Za $1000$ izdelkov del, kjer iščemo, razpolavljamo: $1000, 500, 250, 125, 62, 31, 15, 7, 3, 1$. To je $10$ primerjav, kar se ujema z $\lceil \log_2 1001 \rceil = 10$, ker je $2^{10} = 1024 \geq 1001$.
5. Odgovor: izdelek za $38$ € najdemo v $3$ primerjavah; pri $1000$ izdelkih jih potrebujemo največ $10$.

### Primer 4: zdaj ti

Spletna trgovina ima $1\,000\,000$ izdelkov, urejenih po ceni. Koliko primerjav v najslabšem primeru potrebuje iskanje po vrsti in koliko dvojiško iskanje?

**Podatki:** $n = 1\,000\,000$ izdelkov, cene urejene
**Iščemo:** največje število primerjav po vrsti in pri dvojiškem iskanju

:::formula
po vrsti: največ $n$; dvojiško: najmanjši $k$, za katerega je $2^k \geq n + 1$
:::

**Rešitev:**

1. Po vrsti v najslabšem primeru pregledamo vse: $1\,000\,000$ primerjav.
2. Za dvojiško iskanje preveri potence: $2^{19} = 524288$ je manj kot $1\,000\,001$. Dokončaj sam:

:::premisli
Kateri je najmanjši $k$ in koliko primerjav potrebuje dvojiško iskanje?
---
$2^{20} = 1048576 \geq 1\,000\,001$, torej $k = 20$. Dvojiško iskanje potrebuje največ $20$ primerjav namesto milijona.
:::

## Pogoste napake

- **Pozabljen osnovni primer.** Kdor razmišlja »funkcija bo že vedela, kdaj nehati«, dobi neskončno verigo klicev. Računalnik ne ugiba konca, zato se program sesuje s prekoračitvijo sklada. Vedno najprej zapiši, pri katerem najmanjšem problemu funkcija vrne odgovor brez klica.
- **Klic, ki problema ne zmanjša.** Pri dvojiškem iskanju kdo zapiše `isci(t, x, s, hi)` namesto `s + 1`. Ko sta `lo` in `hi` soseda, je sredina spet `lo` in del se ne zmanjša, zato se klic ponavlja v nedogled. Pravilno je, da iz iskanja izločimo tudi preverjeno sredino.
- **Dvojiško iskanje na neurejeni tabeli.** Odločitev »levo ali desno« sloni na tem, da so desno večje vrednosti. Če cene niso urejene, lahko iskani element zavržemo. Tabelo je treba najprej urediti ali iskati po vrsti.
- **»En disk več, dve potezi več.«** Študent sklepa, da je potez $2n$. Res pa se vsakič stolp z $n - 1$ diski prestavi **dvakrat**, zato se število potez skoraj podvoji: $P(n) = 2^n - 1$.
- **»Rekurzija je vedno boljša od zanke.«** Vsak klic zasede prostor na klicnem skladu. Rekurzivna vsota milijona cen lahko sklad prekorači, zanka pa porabi eno spremenljivko. Rekurzijo izberemo, ko se problem naravno razcepi, ne zato, ker je krajša.

## Povzetek

- Rekurzivna funkcija pokliče samo sebe na manjšem problemu (rekurzivni korak) in se ustavi pri osnovnem primeru.
- Čakajoči klici tvorijo klicni sklad (LIFO); preveč klicev povzroči prekoračitev sklada.
- Iteracija ponavlja z zanko; za preprosta ponavljanja je varčnejša.
- Hanojski stolp: $n - 1$ diskov na pomožno, največjega na cilj, $n - 1$ diskov na cilj; $P(n) = 2^n - 1$ potez.
- Dvojiško iskanje na urejeni tabeli razpolavlja del, kjer iščemo; največ $\lceil \log_2(n+1) \rceil$ primerjav.

## Za izpit

Znati moraš povedati:

- definicijo rekurzivne funkcije ter obe sestavini, osnovni primer in rekurzivni korak, s pogojem, da se vsak klic približa osnovnemu primeru;
- kaj je klicni sklad, zakaj se klici vračajo po pravilu LIFO in kdaj pride do prekoračitve sklada;
- razliko med rekurzijo in iteracijo (ponavljanje, ustavitev, poraba pomnilnika) in kdaj izbrati katero;
- rekurzivni postopek za hanojski stolp, zvezo $P(n) = 2P(n-1) + 1$ s $P(0) = 0$ in dokaz z indukcijo, da je $P(n) = 2^n - 1$;
- rekurzivno dvojiško iskanje z mejama `lo` in `hi`, pogoj, da je tabela urejena, in mejo $\lceil \log_2(n+1) \rceil$ primerjav z utemeljitvijo.

### Naloga 1

Urejena tabela `t` ima $13$ elementov: $3, 7, 11, 15, 19, 24, 30, 37, 41, 48, 52, 60, 67$ (indeksi $0$ do $12$). Uporabi funkcijo `isci` iz razlage. (a) Sledi klicu `isci(t, 20, 0, 12)`: za vsak klic zapiši `lo`, `hi` in `s` ter povej, koliko primerjav z elementi tabele in koliko klicev funkcije nastane. (b) Koliko primerjav v povprečju potrebuje uspešno iskanje, če je vsak od $13$ elementov enako verjetno iskani? (c) Koliko primerjav največ potrebuje iskanje v urejeni tabeli z $10^9$ elementi?

**Rešitev:**

1. Prvi klic: $\mathrm{lo} = 0$, $\mathrm{hi} = 12$, $s = 6$, `t[6]` je $30$. Ker je $30 > 20$, iščemo levo: $\mathrm{hi} = 5$.
2. Drugi klic: $\mathrm{lo} = 0$, $\mathrm{hi} = 5$, $s = 2$ ($5$ deljeno z $2$ je $2$, ostanek zavržemo), `t[2]` je $11$. Ker je $11 < 20$, iščemo desno: $\mathrm{lo} = 3$.
3. Tretji klic: $\mathrm{lo} = 3$, $\mathrm{hi} = 5$, $s = 4$, `t[4]` je $19 < 20$: $\mathrm{lo} = 5$.
4. Četrti klic: $\mathrm{lo} = 5$, $\mathrm{hi} = 5$, $s = 5$, `t[5]` je $24 > 20$: $\mathrm{hi} = 4$.
5. Peti klic: $\mathrm{lo} = 5 > \mathrm{hi} = 4$, osnovni primer, funkcija vrne $-1$. Nastalo je $5$ klicev in $4$ primerjave z elementi tabele; največ jih je lahko $\lceil \log_2 14 \rceil = 4$, ker je $2^3 = 8 < 14 \le 2^4 = 16$. Ko zadnji klic teče, je na klicnem skladu vseh $5$ klicev.
6. Za povprečje preštej, koliko elementov najdemo s koliko primerjavami. Z eno primerjavo najdemo sredino (indeks $6$). Z dvema sredini obeh polovic (indeksa $2$ in $9$). S tremi sredine štirih četrtin (indeksi $0$, $4$, $7$, $11$). Preostalih $13 - 1 - 2 - 4 = 6$ elementov (indeksi $1$, $3$, $5$, $8$, $10$, $12$) najdemo s štirimi.
7. Skupaj primerjav: $1 \cdot 1 + 2 \cdot 2 + 4 \cdot 3 + 6 \cdot 4 = 41$. Povprečje: $\frac{41}{13} \approx 3{,}15$.
8. Za $n = 10^9$ iščemo najmanjši $k$, za katerega je $2^k \ge 10^9 + 1$. Ker je $2^{29} = 536\,870\,912 < 10^9 + 1$ in $2^{30} = 1\,073\,741\,824 \ge 10^9 + 1$, je $k = 30$.
9. Odgovor: (a) $5$ klicev in $4$ primerjave, funkcija vrne $-1$; (b) povprečno približno $3{,}15$ primerjave, le malo manj kot v najslabšem primeru ($4$); (c) največ $30$ primerjav.

### Naloga 2

Rekurzivna funkcija `hanoi(n, a, b, c)` prestavi $n$ diskov s palice `a` na palico `c` s pomožno palico `b`: če je $n = 0$, se takoj vrne; sicer pokliče `hanoi(n - 1, a, c, b)`, premakne disk z `a` na `c` in pokliče `hanoi(n - 1, b, a, c)`. (a) Izpelji zvezo za število potez $P(n)$ in z indukcijo dokaži zaprto obliko. (b) Izpelji, koliko klicev funkcije $K(n)$ nastane (vštej tudi klice z $n = 0$), in izračunaj $P(10)$, $K(10)$ ter največje število klicev, ki so hkrati na klicnem skladu. (c) Koliko let bi trajalo prestavljanje $64$ diskov pri eni potezi na sekundo (leto ima $365{,}25$ dneva)?

**Rešitev:**

1. Klic z $n = 0$ ne naredi nobene poteze: $P(0) = 0$. Klic z $n \ge 1$ naredi poteze prvega notranjega klica, eno svojo potezo in poteze drugega notranjega klica: $P(n) = P(n-1) + 1 + P(n-1) = 2P(n-1) + 1$.
2. Trditev: $P(n) = 2^n - 1$. Osnovni primer: $P(0) = 0 = 2^0 - 1$. Indukcijski korak: če velja $P(n-1) = 2^{n-1} - 1$, je $P(n) = 2(2^{n-1} - 1) + 1 = 2^n - 2 + 1 = 2^n - 1$.
3. Klici: klic z $n = 0$ je en sam, $K(0) = 1$. Klic z $n \ge 1$ šteje sebe in oba notranja klica z vsemi njunimi: $K(n) = 2K(n-1) + 1$.
4. Zaprta oblika: zaporedje $K(n) + 1$ se pri vsakem koraku podvoji, ker je $K(n) + 1 = 2(K(n-1) + 1)$, in se začne s $K(0) + 1 = 2$. Zato je $K(n) + 1 = 2^{n+1}$, torej $K(n) = 2^{n+1} - 1$.
5. Za $n = 10$: $P(10) = 2^{10} - 1 = 1023$ potez in $K(10) = 2^{11} - 1 = 2047$ klicev.
6. Na skladu je hkrati le ena veriga čakajočih klicev, z $n = 10, 9, \ldots, 1, 0$. To je največ $11$ klicev. Število klicev raste eksponentno, globina sklada pa le linearno ($n + 1$).
7. Za $64$ diskov: $P(64) = 2^{64} - 1 \approx 1{,}845 \cdot 10^{19}$ potez, torej toliko sekund. Leto ima $365{,}25 \cdot 86\,400 = 31\,557\,600\ \mathrm{s}$, zato je čas $\frac{1{,}845 \cdot 10^{19}}{3{,}156 \cdot 10^{7}} \approx 5{,}85 \cdot 10^{11}$ let.
8. Odgovor: $P(n) = 2^n - 1$, $K(n) = 2^{n+1} - 1$; pri $10$ diskih je $1023$ potez, $2047$ klicev in največ $11$ klicev na skladu; $64$ diskov bi trajalo približno $585$ milijard let.

### Naloga 3

Natančno navedi, katera dva pogoja mora izpolniti rekurzivna funkcija, da se zagotovo ustavi. Nato utemelji, ali se ustavi različica funkcije `isci`, v kateri je klic `isci(t, x, s + 1, hi)` zamenjan s klicem `isci(t, x, s, hi)`, na tabeli $2, 5$ pri iskanju $x = 5$. Na koncu zapiši dvojiško iskanje z zanko in primerjaj porabo pomnilnika obeh različic.

**Rešitev:**

1. Prvi pogoj: funkcija ima osnovni primer, pri katerem vrne odgovor brez novega klica. Drugi pogoj: vsak rekurzivni klic dobi strogo manjši problem, tako da po končno mnogo klicih pride do osnovnega primera.
2. Pri pravilni funkciji `isci` je velikost problema število elementov med `lo` in `hi`, torej $\mathrm{hi} - \mathrm{lo} + 1$. Klica z $s + 1$ in $s - 1$ sredino izločita, zato se ta velikost pri vsakem klicu zmanjša vsaj za $1$. Ko pade na $0$, je $\mathrm{lo} > \mathrm{hi}$ in nastopi osnovni primer.
3. Napačna različica na tabeli $2, 5$: $\mathrm{lo} = 0$, $\mathrm{hi} = 1$, $s = 0$ ($1$ deljeno z $2$ je $0$), `t[0]` je $2 < 5$. Klic `isci(t, 5, 0, 1)` ima isti meji kot prej.
4. Problem se ni zmanjšal, zato se isti klic ponavlja. Drugi pogoj ni izpolnjen; funkcija se ne ustavi sama, program se konča s prekoračitvijo sklada. Osnovni primer sam torej ne zadošča.
5. Različica z zanko:

```text
isci_z_zanko(t, x):
    lo = 0
    hi = dolžina(t) - 1
    dokler lo <= hi:
        s = (lo + hi) // 2
        če t[s] == x: vrni s
        če t[s] < x: lo = s + 1
        sicer: hi = s - 1
    vrni -1
```

6. Zanka naredi iste primerjave kot rekurzija, ker se `lo` in `hi` spreminjata enako. Porabi pa le tri spremenljivke (`lo`, `hi`, `s`) ne glede na $n$.
7. Rekurzivna različica ima na skladu največ $\lceil \log_2(n+1) \rceil + 1$ klicev (toliko, kot je primerjav, in še zadnji klic z $\mathrm{lo} > \mathrm{hi}$). Pri milijonu elementov je to $21$ klicev, kar sklada ne ogrozi. Drugače je pri rekurzivni funkciji `vsota`, kjer je globina $n + 1$.
8. Sklep: različica z `s` namesto `s + 1` se ne ustavi; dvojiško iskanje z zanko je enako hitro in porabi stalno količino pomnilnika, rekurzivno pa pomnilnik, sorazmeren z $\log_2 n$.

## Drugače: Z analogijo

Rekurzija je kot ruska babuška. Odpreš veliko lutko in v njej najdeš enako, le manjšo. Odpreš tudi to in najdeš še manjšo. Najmanjša se ne odpre: to je osnovni primer. Ko jo najdeš, lutke zapiraš v obratnem vrstnem redu, od najmanjše do največje. Tako se tudi klici vračajo: zadnji odprti se prvi zapre.

Babuška brez najmanjše, polne lutke bi se odpirala v nedogled. To je rekurzija brez osnovnega primera.

## Drugače: Uporaba v stroki

**Iskanje krive spremembe.** Razvijalec ve, da je program pred mesecem dni deloval, danes pa ne. Vmes je $1000$ shranjenih sprememb kode. Orodje `git bisect` preizkusi srednjo spremembo; razvijalec odgovori »deluje« ali »ne deluje« in polovica zgodovine odpade. Krivo spremembo tako najde po približno $10$ preizkusih namesto po $1000$. To je dvojiško iskanje po urejeni zgodovini. Enako podatkovna baza išče po urejenem indeksu.

**Obhod map.** Program za varnostne kopije obdela mapo tako, da datoteke prepiše, za vsako podmapo pa pokliče samega sebe. Osnovni primer je mapa brez podmap. Globina klicev je enaka globini gnezdenja map, navadno manj kot $20$, zato je rekurzija tu varna. Enako prevajalnik obdela gnezdene oklepaje v izrazu.

**Meja sklada.** Python privzeto dovoli okoli $1000$ gnezdenih klicev, Java pa klice omeji z velikostjo sklada niti (pogosto okoli $1$ MB) in ob prekoračitvi javi `StackOverflowError`. Zato v praksi dolge sezname obdelamo z zanko, rekurzijo pa prihranimo za probleme z majhno globino.

## Drugače: Bolj natančno

**Formula za hanojski stolp.** Trdimo, da je $P(n) = 2^n - 1$ za vsak $n \ge 0$. Dokaz z indukcijo:

- Osnovni primer: $P(0) = 0 = 2^0 - 1$.
- Indukcijski korak: če velja $P(n-1) = 2^{n-1} - 1$, je $P(n) = 2(2^{n-1} - 1) + 1 = 2^n - 1$.

Manj potez ne gre: preden se največji disk premakne, mora vseh $n - 1$ manjših ležati na tretji palici, po premiku pa jih je treba prestaviti nanj. Vsak od obeh delov zahteva vsaj $P(n-1)$ potez.

**Meja za dvojiško iskanje.** Če sredina dela z $m$ elementi ni iskani element, ostane največ $\lfloor m/2 \rfloor$ elementov. Iz $m \le 2^k - 1$ sledi $\lfloor m/2 \rfloor \le 2^{k-1} - 1$. Tabela z $n \le 2^k - 1$ elementi je zato preiskana po največ $k$ primerjavah; najmanjši tak $k$ je $\lceil \log_2(n+1) \rceil$.

## Preveri se

? Trije od naštetih so del vsake pravilne rekurzivne funkcije. Kateri izstopa?
- osnovni primer, ki vrne odgovor brez klica
~ Brez osnovnega primera se klici nikoli ne ustavijo, zato je nujen.
- klic iste funkcije
~ Klic same sebe je prav tisto, kar funkcijo naredi rekurzivno.
- klic na manjšem problemu
~ Če se problem ne zmanjšuje, funkcija nikoli ne pride do osnovnega primera.
+ globalni števec, ki šteje klice
> Števca klicev rekurzija ne potrebuje. Nujni so osnovni primer in klic same sebe na manjšem problemu.

? Koliko potez potrebuješ za hanojski stolp s $6$ diski?
- $12$
~ To je $2n$. Stolp z enim diskom manj se prestavi dvakrat, zato število potez raste skoraj s podvajanjem.
- $64$
~ To je $2^6$. Pravilo je $2^n - 1$, ker za $0$ diskov potrebujemo $0$ potez, ne $1$.
+ $63$
- $36$
~ To je $n^2$. Iz tabele $1, 3, 7, 15$ se vidi, da število potez ne raste kvadratno.
> $P(6) = 2 \cdot 31 + 1 = 63 = 2^6 - 1$.

? Študent je iz funkcije `vsota` izbrisal vrstico z osnovnim primerom. Kaj je posledica?
- Funkcija vrne $0$, ker je račun na koncu prazen.
~ $0$ vrne prav osnovni primer, ki ga ni več. Brez njega funkcija tudi prazen račun skuša razdeliti naprej.
+ Klici se ne začnejo vračati; program se konča z napako, ker ni prvega elementa ali zmanjka klicnega sklada.
- Prevajalnik rekurzijo sam pretvori v zanko in vrne pravilno vsoto.
~ Prevajalnik ne ve, kdaj bi bilo prav nehati; osnovni primer mora zapisati programer.
> Osnovni primer je edino mesto, kjer se klici začnejo vračati. Brez njega jih nastaja vedno več.

? V ceniku $2, 5, 8, 12, 16, 23, 38, 56$ (indeksi $0$ do $7$) študent dvojiško išče $38$. Korak 1: $\mathrm{lo} = 0$, $\mathrm{hi} = 7$, $s = 3$, cena $12$. Korak 2: ker je $12 < 38$, nastavi $\mathrm{hi} = 2$. Korak 3: išče med indeksoma $0$ in $2$ in javi, da $38$ ni v ceniku. Kateri korak je napačen?
- Korak 1
~ Sredina med $0$ in $7$ je pri celoštevilskem deljenju res indeks $3$.
+ Korak 2
- Korak 3
~ Korak 3 je le posledica: v delu od $0$ do $2$ cene $38$ res ni. Napaka je nastala prej.
> Ker je $12 < 38$, je iskana cena **desno** od sredine, torej $\mathrm{lo} = 4$. Študent je zavrgel napačno polovico.

? Prodajalec ima tiskan cenik s $1000$ artikli, urejenimi po ceni. Kateri način iskanja artikla z dano ceno potrebuje v najslabšem primeru najmanj pogledov?
- Pregleduje od prve vrstice naprej.
~ V najslabšem primeru pogleda vseh $1000$ vrstic.
- Odpira na naključnih mestih.
~ Naključno odpiranje ne izloči nobene polovice, zato nima zagotovljene meje.
+ Pogleda sredino, nato sredino tiste polovice, kjer mora biti artikel, in tako naprej.
> Vsak pogled razpolovi del cenika, zato zadošča največ $10$ pogledov, ker je $2^{10} = 1024 \geq 1001$.

:::simboli
n | število diskov | | – | pri dvojiškem iskanju število elementov tabele
P | število potez za stolp z n diski | P(n) = 2P(n-1) + 1 | – | P(n) = 2ⁿ − 1
s | indeks sredine dela tabele | s = \left\lfloor \frac{\mathrm{lo} + \mathrm{hi}}{2} \right\rfloor | – | vsoto celoštevilsko delimo z 2
\mathrm{lo} | spodnja meja (indeks) dela tabele | | –
\mathrm{hi} | zgornja meja (indeks) dela tabele | | –
k | število primerjav | | – | najmanjši k z 2ᵏ ≥ n + 1
:::
