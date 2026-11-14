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

```
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

```
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

```
cena [€]:  2   5   8   12   16   23   38   56
indeks:    0   1   2   3    4    5    6    7
```

Iščemo izdelek za $23$ €. Pogledamo sredino, indeks $3$, kjer je $12$ €. Ker je $12 < 23$ in so cene urejene, je iskani izdelek gotovo **desno**. Leva polovica odpade naenkrat. Med indeksoma $4$ in $7$ je sredina indeks $5$, tam je $23$ €. Našli smo ga v dveh primerjavah.

Vsaka primerjava razpolovi del, kjer še iščemo. Iskanje v polovici je isti problem na manjšem delu tabele, zato ga zapišemo rekurzivno. Meji dela sta indeksa `lo` in `hi`:

```
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

## Drugače: Z analogijo

Rekurzija je kot ruska babuška. Odpreš veliko lutko in v njej najdeš enako, le manjšo. Odpreš tudi to in najdeš še manjšo. Najmanjša se ne odpre: to je osnovni primer. Ko jo najdeš, lutke zapiraš v obratnem vrstnem redu, od najmanjše do največje. Tako se tudi klici vračajo: zadnji odprti se prvi zapre.

Babuška brez najmanjše, polne lutke bi se odpirala v nedogled. To je rekurzija brez osnovnega primera.

## Drugače: Iz vsakdanjega življenja

**Vrsta pri blagajni.** Rad bi vedel, koliko ljudi stoji pred tabo, a ne vidiš začetka vrste. Vprašaš osebo pred sabo: »Koliko jih je pred tabo?« Ta vpraša naprej. Kdor stoji prvi, odgovori »nihče« (osnovni primer). Vsak nato odgovoru prišteje ena in ga poda nazaj. Ko odgovor pride do tebe, veš število. Iterativna različica: hodiš od začetka vrste do sebe in šteješ.

**Ugibanje cene.** Prijatelj si je kupil kolo do $1000$ € in ti na ugib odgovarja le »več« ali »manj«. Če začneš pri $500$, nato $250$ ali $750$ in tako naprej, ceno na cel evro najdeš v največ $10$ ugibih. To je dvojiško iskanje.

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
