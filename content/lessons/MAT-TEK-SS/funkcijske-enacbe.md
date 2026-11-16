---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Kaj imata skupnega žlička sirupa in utrip srca?

Medicinska sestra odmeri otroku sirup: najprej $5\,\mathrm{mL}$, nato še $10\,\mathrm{mL}$. Otrok je dobil točno toliko zdravilne učinkovine, kot če bi naenkrat popil $15\,\mathrm{mL}$. Če je v $5\,\mathrm{mL}$ učinkovine $120\,\mathrm{mg}$, je v $15\,\mathrm{mL}$ trikrat toliko, $360\,\mathrm{mg}$.

Zdravnica šteje udarce srca v mirovanju. Udarci v prvih $10$ minutah in udarci v naslednjih $5$ minutah dajo skupaj ravno udarce v $15$ minutah.

Dve zelo različni situaciji, ena sama lastnost. Če z $f(x)$ označimo, koliko »dobimo« pri količini $x$ (miligrame pri mililitrih, udarce pri minutah), v obeh velja

$$f(x + y) = f(x) + f(y)$$

To je **funkcijska enačba**: neznanka v njej ni število, ampak cela funkcija $f$. Na tekmovanjih se pogosto glasi »Poišči vse funkcije $f$, za katere velja …«. Vprašanje te lekcije: ali ta lastnost sama prisili $f$, da je oblike $f(x) = cx$? In kako take enačbe rešujemo, ko so bolj zapletene?

## Razlaga

**Najprej en primer do konca.** Zapis $f\colon \mathbb{R} \to \mathbb{R}$ pomeni, da $f$ vsakemu realnemu številu priredi realno število. Iščemo vse take $f$, za katere enačba $f(x + y) = f(x) + f(y)$ velja pri **vseh** realnih $x$ in $y$. Označimo $c = f(1)$. Ker enačba velja za vse pare, smemo namesto $x$ in $y$ vstaviti, kar nam koristi. Vsaki taki izbiri rečemo **substitucija**.

*Korak 1.* Vstavimo $x = y = 0$. Dobimo $f(0) = f(0) + f(0)$, torej $f(0) = 0$.

:::premisli
Ali je lahko $f(x) = x + 1$ rešitev te enačbe? Odloči se brez računanja $f(x + y)$.
---
Ne. Vsaka rešitev mora imeti $f(0) = 0$, ta funkcija pa ima $f(0) = 1$. Že ena posebna vrednost izloči celo družino kandidatov.
:::

*Korak 2.* Vstavimo $y = x$: $f(2x) = 2f(x)$. Nato $y = 2x$: $f(3x) = f(x) + f(2x) = 3f(x)$. Tako nadaljujemo in dobimo $f(nx) = n f(x)$ za vsako naravno število $n$. Pri $x = 1$ to da $f(n) = nc$.

*Korak 3.* Vstavimo $y = -x$: $f(0) = f(x) + f(-x)$. Ker je $f(0) = 0$, je $f(-x) = -f(x)$. Zato tudi $f(-n) = -nc$.

*Korak 4.* Ulomki. Iz koraka 2 pri $x = \frac{1}{q}$ in $n = q$ dobimo $f(1) = q \cdot f\!\left(\frac{1}{q}\right)$, torej $f\!\left(\frac{1}{q}\right) = \frac{c}{q}$. Še enkrat korak 2: $f\!\left(\frac{p}{q}\right) = p \cdot \frac{c}{q}$.

Pregled korakov:

| vstavimo | sklep |
|---|---|
| $x = y = 0$ | $f(0) = 0$ |
| $y = x$, … | $f(n) = nc$ |
| $y = -x$ | $f(-x) = -f(x)$ |
| ulomek $\frac{1}{q}$ | $f(\frac{p}{q}) = \frac{p}{q} c$ |

Za sirup s $c = 24\,\mathrm{mg/mL}$ to da $f(5) = 120$ in $f(2{,}5) = 60$. Enačba velja tudi pri negativnih številih, kjer za sirup nimajo več pomena, zato je $f(-5) = -120$.

Na vseh racionalnih številih je torej $f(x) = cx$. Graf je na teh točkah premica skozi izhodišče.

**Splošno: substitucije.** Iz enega primera vidimo vzorec. Vsaka substitucija da novo enačbo, ki velja za vse preostale spremenljivke. Najpogostejše izbire:

- ničle in enice: $x = 0$, $y = 0$, $x = y = 0$, $x = 1$;
- enaki ali nasprotni spremenljivki: $y = x$, $y = -x$;
- zamenjava, ki par vrne nazaj: $x \to 1 - x$ ali $x \to -x$; tako dobimo sistem dveh enačb za $f(x)$ in $f(1 - x)$ (ali $f(-x)$);
- izbira, ki argument izniči: če nastopa $f(x - f(y))$, vstavimo $x = f(y)$.

**Injektivnost.** Funkcija $f$ je **injektivna**, če iz $f(a) = f(b)$ sledi $a = b$. Z drugimi besedami: različni vhodi dajo različne izhode. Funkcija $f(x) = x^2$ ni injektivna, saj je $f(-2) = f(2)$.

Injektivnost dokažemo tako, da predpostavimo $f(a) = f(b)$ in iz enačbe izpeljemo $a = b$. Pomaga mesto v enačbi, kjer spremenljivka stoji tudi sama, zunaj $f$. Primer: velja $f(f(x)) = x + 5$ (enačba). Iz $f(a) = f(b)$ sledi $f(f(a)) = f(f(b))$, torej $a + 5 = b + 5$ in $a = b$.

Uporabimo jo takrat, ko pridemo do $f(A) = f(B)$: smemo »pokrajšati« $f$ in dobimo $A = B$. Pri neinjektivni funkciji tak sklep ni dovoljen.

:::premisli
Za $f$ velja $f(x)^3 = x$ za vse realne $x$ (enačba). Ali je $f$ injektivna? Zakaj?
---
Da. Iz $f(a) = f(b)$ sledi $f(a)^3 = f(b)^3$, to pa je $a = b$. Vedno, ko se da $x$ izraziti iz $f(x)$, je $f$ injektivna.
:::

**Cauchyjeva enačba.** Enačbi $f(x + y) = f(x) + f(y)$ rečemo **Cauchyjeva enačba**. Prvi primer je dokazal prvi del tega izreka:

- Če $f$ slika iz $\mathbb{Q}$, je $f(x) = cx$ in $c = f(1)$.
- Na $\mathbb{R}$ to velja, če $f$ izpolni še en pogoj: je zvezna, ali monotona, ali omejena na kakem intervalu.

Brez takega pogoja obstajajo tudi zelo nenavadne rešitve, katerih graf je razpršen po vsej ravnini. Na tekmovanju je pogoj zato vedno podan ali pa ga je treba dokazati.

**Preizkus.** Vse, kar izpeljemo s substitucijami, so *potrebni* pogoji: če je $f$ rešitev, mora biti take oblike. Ali je kandidat res rešitev, pove šele preizkus v prvotni enačbi.

V simulaciji spodaj (Preizkus kandidatov za funkcijske enačbe) izberi enačbo $f(x + y) = f(x) + f(y)$ in zaporedoma kandidate $2x$, $x^2$ in $x + 1$. Opazi, da preizkus prestane le $2x$; pri $x + 1$ simulacija takoj najde protiprimer.

## Rešeni primeri

### Primer 1: zamenjava, ki par vrne nazaj

Poišči vse funkcije $f\colon \mathbb{R} \to \mathbb{R}$, za katere za vse realne $x$ velja $f(x) + 2f(1 - x) = x^2$. Koliko je $f(3)$?

**Podatki:** enačba $f(x) + 2f(1 - x) = x^2$ za vse $x \in \mathbb{R}$
**Iščemo:** vse funkcije $f$ in vrednost $f(3)$

:::formula
Zamenjava $x \to 1 - x$ da drugo enačbo; iz sistema dveh enačb izrazimo $f(x)$.
:::

**Rešitev:**

1. Vstavimo $1 - x$ namesto $x$. Ker je $1 - (1 - x) = x$, dobimo $f(1 - x) + 2f(x) = (1 - x)^2$.
2. Označimo $A = f(x)$ in $B = f(1 - x)$. Imamo sistem $A + 2B = x^2$ in $2A + B = (1 - x)^2$.
3. Drugo enačbo pomnožimo z $2$ in odštejemo prvo: $3A = 2(1 - x)^2 - x^2$, torej $f(x) = \frac{x^2 - 4x + 2}{3}$.
4. Preizkus: $f(1 - x) = \frac{x^2 + 2x - 1}{3}$, zato je $f(x) + 2f(1 - x) = \frac{3x^2}{3} = x^2$. Rešitev je prava.
5. $f(3) = \frac{9 - 12 + 2}{3} = -\frac{1}{3}$.

Odgovor: edina rešitev je $f(x) = \frac{x^2 - 4x + 2}{3}$, zato je $f(3) = -\frac{1}{3}$.

### Primer 2: argument postavimo na nič

Poišči vse $f\colon \mathbb{R} \to \mathbb{R}$, za katere za vse realne $x$, $y$ velja $f(x - f(y)) = 1 - x - y$.

**Podatki:** enačba $f(x - f(y)) = 1 - x - y$ za vse $x, y \in \mathbb{R}$
**Iščemo:** vse funkcije $f$

:::formula
Substitucija $x = f(y)$, da je argument na levi enak $0$; nato preizkus kandidata.
:::

**Rešitev:**

1. Vstavimo $x = f(y)$: leva stran je $f(0)$, desna $1 - f(y) - y$.
2. Izrazimo $f(y)$: $f(y) = 1 - f(0) - y$. Z $a = 1 - f(0)$ je torej $f(y) = a - y$; neznana je le še konstanta $a$.
3. Kandidata vstavimo v prvotno enačbo, ker korak 2 da le potreben pogoj. Leva stran je $f(x - a + y) = a - x + a - y = 2a - x - y$.
4. Primerjamo z $1 - x - y$: $2a = 1$, torej $a = \frac{1}{2}$.

Odgovor: edina rešitev je $f(x) = \frac{1}{2} - x$.

### Primer 3: najprej injektivnost, nato Cauchy

Poišči vse zvezne funkcije $f\colon \mathbb{R} \to \mathbb{R}$, za katere za vse realne $x$, $y$ velja $f(f(x) + f(y)) = x + y + 2$.

**Podatki:** enačba $f(f(x) + f(y)) = x + y + 2$ za vse $x, y \in \mathbb{R}$; $f$ je zvezna
**Iščemo:** vse funkcije $f$

:::formula
Injektivnost: iz $f(A) = f(B)$ sledi $A = B$. Cauchy: zvezna rešitev enačbe $g(x + y) = g(x) + g(y)$ je $g(x) = kx$.
:::

**Rešitev:**

1. *Injektivnost.* Naj bo $f(a) = f(b)$. Vstavimo $x = a$, nato $x = b$, pri istem $y$. Ker je $f(a) = f(b)$, je leva stran obakrat enaka, zato $a + y + 2 = b + y + 2$ in $a = b$.
2. *Dva para z enako vsoto.* Desna stran je odvisna le od $x + y$. Par $(x, y)$ in par $(x + y, 0)$ imata enako vsoto, zato $f(f(x) + f(y)) = f(f(x + y) + f(0))$.
3. Zaradi injektivnosti pokrajšamo $f$: $f(x) + f(y) = f(x + y) + f(0)$.
4. *Cauchy.* Označimo $c = f(0)$ in $g(x) = f(x) - c$. Iz koraka 3 dobimo $g(x + y) = g(x) + g(y)$. Funkcija $g$ je zvezna, zato $g(x) = kx$ in $f(x) = kx + c$.
5. *Preizkus določi $k$ in $c$.* Velja $f(x) + f(y) = k(x + y) + 2c$, zato je leva stran $k^2(x + y) + 2kc + c$. Biti mora $x + y + 2$, torej $k^2 = 1$ in $2kc + c = 2$.
6. Pri $k = 1$ je $3c = 2$, $c = \frac{2}{3}$. Pri $k = -1$ je $-c = 2$, $c = -2$.

Odgovor: rešitvi sta dve, $f(x) = x + \frac{2}{3}$ in $f(x) = -x - 2$.

### Primer 4: zdaj ti

Ledvice v vsaki minuti prefiltrirajo enako količino krvne plazme. Naj bo $f(t)$ prostornina plazme, prefiltrirana v $t$ minutah. Velja $f(s + t) = f(s) + f(t)$ za vse $s, t \ge 0$, funkcija $f$ je naraščajoča, v $4$ minutah se prefiltrira $500\,\mathrm{mL}$. Koliko časa traja, da se prefiltrira $180\,\mathrm{L}$ plazme?

**Podatki:** $f(s + t) = f(s) + f(t)$; $f$ naraščajoča; $f(4\,\mathrm{min}) = 500\,\mathrm{mL}$; $V = 180\,\mathrm{L}$
**Iščemo:** čas $t$, pri katerem je $f(t) = V$

:::formula
Cauchy z monotonostjo: $f(t) = kt$, nato $t = \frac{V}{k}$.
:::

**Rešitev:**

1. Enačba je Cauchyjeva, $f$ je monotona, zato $f(t) = kt$.
2. Pretvorimo: $180\,\mathrm{L} = 180\,000\,\mathrm{mL}$.
3. Izračunaj $k$ in nato $t$.

:::premisli
Koliko je $k$ in koliko časa traja filtracija $180\,\mathrm{L}$?
---
$k = \frac{500\,\mathrm{mL}}{4\,\mathrm{min}} = 125\,\mathrm{mL/min}$. Nato $t = \frac{180\,000\,\mathrm{mL}}{125\,\mathrm{mL/min}} = 1440\,\mathrm{min} = 24\,\mathrm{h}$. Ledvice v enem dnevu prefiltrirajo približno $180\,\mathrm{L}$ plazme.
:::

## Pogoste napake

- **Ugibanje namesto reševanja.** »Funkcija $f(x) = x$ ustreza, torej je to rešitev naloge.« Naloga sprašuje po *vseh* rešitvah. Primer 3 ima dve, in druge ne bi našel z ugibanjem. Ugib je dober začetek, dokaz pa mora pokazati, da drugih ni.
- **Brez preizkusa.** »Izpeljal sem $f(y) = a - y$, končano.« Substitucije dajo le potrebne pogoje. V primeru 2 šele preizkus določi $a = \frac{1}{2}$; brez njega bi navedel neskončno funkcij, od katerih je prava ena.
- **Krajšanje $f$ brez injektivnosti.** Iz $f(A) = f(B)$ ne smeš kar sklepati $A = B$. Pri $f(x) = x^2$ je $f(-3) = f(3)$, a $-3 \ne 3$. Najprej dokaži, da je $f$ injektivna.
- **Cauchy na $\mathbb{R}$ brez pogoja.** »Velja $f(x + y) = f(x) + f(y)$, torej $f(x) = cx$.« Na $\mathbb{Q}$ je to res, na $\mathbb{R}$ pa le ob dodatnem pogoju (zveznost, monotonost, omejenost na intervalu). V rešitvi ga vedno navedi.
- **Vrednosti zunaj definicijskega območja.** Če $f$ slika iz pozitivnih realnih števil, substitucija $x = 0$ ali $y = -x$ ni dovoljena. Vstavljaj samo števila, za katera enačba velja.

## Povzetek

- Funkcijska enačba velja za vse dovoljene vrednosti spremenljivk; vsaka substitucija ($0$, $1$, $y = x$, $y = -x$, $x \to 1 - x$, $x = f(y)$) da novo enačbo.
- Zamenjava, ki par vrne nazaj, da sistem dveh enačb za $f(x)$ in partnerja.
- $f$ je injektivna, če iz $f(a) = f(b)$ sledi $a = b$; dokaz: predpostavi $f(a) = f(b)$ in vstavi v enačbo. Šele nato smeš krajšati $f$.
- Cauchyjeva enačba $f(x + y) = f(x) + f(y)$: na $\mathbb{Q}$ je $f(x) = cx$, na $\mathbb{R}$ le ob zveznosti, monotonosti ali omejenosti na intervalu.
- Izpeljava da potrebne pogoje; vedno naredi preizkus v prvotni enačbi.

## Drugače: Z analogijo

Reševanje funkcijske enačbe je kot postavljanje diagnoze. Bolnik je neznana funkcija $f$, enačba pa je opis, kako se vede v vseh okoliščinah.

- Vsaka substitucija je preiskava. Vstavljanje $x = y = 0$ je kot merjenje temperature: hitro, poceni in pogosto izloči veliko možnosti (»$f(0) = 0$, torej $x + 1$ odpade«).
- Injektivnost je kot ugotovitev, da je prstni odtis enoličen: ko se odtisa ujemata, gre za isto osebo. Brez te ugotovitve sklep »isti odtis, ista oseba« ni dovoljen.
- Cauchyjev izrek je kot znan sindrom: ko prepoznaš vzorec $g(x + y) = g(x) + g(y)$ in preveriš dodatni pogoj, že veš, kako se konča.
- Preizkus je kontrolni pregled: diagnozo, ki se ne ujema z vsemi simptomi, zavržeš.

## Drugače: Bolj natančno

Zakaj monotonost zadošča za Cauchyjevo enačbo na $\mathbb{R}$? Naj bo $f$ naraščajoča in $f(x) = cx$ na vseh racionalnih številih. Tedaj je $c = f(1) \ge f(0) = 0$. Vzemimo realni $x$ in racionalni števili $r < x < s$. Iz monotonosti sledi $cr = f(r) \le f(x) \le f(s) = cs$. Ker lahko $r$ in $s$ izberemo poljubno blizu $x$, se $cr$ in $cs$ poljubno približata $cx$, zato $f(x) = cx$.

Brez pogoja nenavadne rešitve res obstajajo. Realna števila si lahko predstavljamo kot neskončno razsežen prostor nad $\mathbb{Q}$; na vsaki »osi« tega prostora lahko $f$ množi z drugim faktorjem. Taka $f$ je aditivna, a ni oblike $cx$. Njen obstoj sloni na aksiomu izbire, zato je ne moremo zapisati s formulo. Za tekmovanje si zapomni: pogoj (zveznost, monotonost, omejenost na intervalu ali $f(x) \ge 0$ za $x \ge 0$) je ključ, ki ga moraš najti ali dokazati.

## Preveri se

? Zdravilo dajemo v različnih odmerkih. Funkcija $f$ odmerku $x$ priredi najvišjo koncentracijo v krvi. Kaj pomeni, da je $f$ injektivna?
+ Različna odmerka dasta različni najvišji koncentraciji.
- Vsako koncentracijo lahko dosežemo s kakim odmerkom.
~ To je surjektivnost: vsak izhod je dosežen. Injektivnost govori o tem, da se izhoda dveh različnih vhodov ne ujemata.
- Dvojni odmerek da dvojno koncentracijo.
~ To je lastnost $f(2x) = 2f(x)$, ki izhaja iz aditivnosti. Injektivna je lahko tudi funkcija, ki ni sorazmerna.
- Pri odmerku $0$ je koncentracija $0$.
~ To je $f(0) = 0$, ena posebna vrednost. Injektivnost primerja vse pare vhodov.
> Injektivnost: iz $f(a) = f(b)$ sledi $a = b$. Če poznaš izhod, je vhod določen enolično.

? Razvrsti korake dokaza, da je vsaka rešitev Cauchyjeve enačbe na $\mathbb{Q}$ oblike $f(x) = cx$, kjer je $c = f(1)$.
1. $x = y = 0$ da $f(0) = 0$.
2. $y = x$, $y = 2x$, … da $f(n) = nc$ za naravna $n$.
3. $y = -x$ da $f(-n) = -nc$.
4. Iz $f(1) = q \cdot f(\frac{1}{q})$ sledi $f(\frac{p}{q}) = \frac{p}{q} c$.
5. Preizkus: $f(x) = cx$ res reši enačbo.
> Vsak korak uporabi prejšnjega: $f(-n) = -f(n)$ potrebuje $f(0) = 0$ in $f(n) = nc$, ulomki potrebujejo $f(nx) = nf(x)$. Preizkus je na koncu.

? Kaj se zgodi, če pri Cauchyjevi enačbi na $\mathbb{R}$ izpustimo pogoj zveznosti (in vse podobne pogoje)?
- Nič: rešitve so še vedno samo $f(x) = cx$.
~ Na $\mathbb{Q}$ je to res, na $\mathbb{R}$ pa brez pogoja obstajajo tudi nezvezne aditivne funkcije.
+ Na racionalnih številih je še vedno $f(x) = cx$, na realnih pa obstajajo tudi nenavadne rešitve.
- Rešitve postanejo tudi vse funkcije $f(x) = kx + n$.
~ Iz $x = y = 0$ vedno sledi $f(0) = 0$, zato $n = 0$. Premik grafa ni dovoljen.
- Enačba nima več nobene rešitve.
~ Funkcije $f(x) = cx$ so še vedno rešitve; pogoj samo izloči druge.
> Koraki z naravnimi števili in ulomki ne potrebujejo zveznosti, zato na $\mathbb{Q}$ še vedno $f(x) = cx$. Zveznost potrebujemo le za prehod na iracionalna števila.

? Graf zvezne rešitve Cauchyjeve enačbe gre skozi točko $(2; 3)$. Koliko je $f(10)$?
:::risba graf
opis: Koordinatni sistem. Označena je točka s koordinatama x = 2 in y = 3. Graf funkcije ni narisan.
x: -1 .. 11 | 1 | x
y: -1 .. 16 | 2 | y
točka: 2; 3 | (2; 3) | desno
:::
= 15
~ 11 | Premica $y = x + 1$ gre skozi $(2; 3)$, a ni rešitev: vsaka rešitev ima $f(0) = 0$.
~ 30 | Vzel si $c = 3$, a $3$ je $f(2)$, ne $f(1)$. Iz $f(2) = 2c$ sledi $c = \frac{3}{2}$.
> Zvezna rešitev je $f(x) = cx$. Iz $f(2) = 3$ je $c = \frac{3}{2}$, zato $f(10) = 15$.

? Za vse realne $x$ velja $f(x) + 2f(-x) = 3x + 6$ (enačba). Koliko je $f(5)$?
= -13
~ 7 | Privzel si $f(-5) = f(5)$. Pravilno je, da vstaviš še $-x$ in rešiš sistem dveh enačb.
~ 17 | To je $f(-5)$: iz sistema si izrazil $f(-x) = 3x + 2$ namesto $f(x)$.
> Z $x \to -x$ dobimo $f(-x) + 2f(x) = -3x + 6$. Sistem da $f(x) = -3x + 2$, zato $f(5) = -13$.

<<RACUN
vrednost: 3*120 | 360
vrednost: 24*5 | 120
vrednost: 24*2.5 | 60
enako: (x^2-4*x+2)/3+2*((1-x)^2-4*(1-x)+2)/3 | x^2
enako: ((1-x)^2-4*(1-x)+2)/3 | (x^2+2*x-1)/3
vrednost: (9-12+2)/3 | -1/3
enako: 1/2-(x-(1/2-y)) | 1-x-y
resi: 3*c=2 | c | 2/3
resi: -c=2 | c | -2
enako: ((x+2/3)+(y+2/3))+2/3 | x+y+2
enako: -((-x-2)+(-y-2))-2 | x+y+2
vrednost: 500/4 | 125
vrednost: 180000/125 | 1440
vrednost: 1440/60 | 24
vrednost: 3/2*10 | 15
enako: (-3*x+2)+2*(3*x+2) | 3*x+6
vrednost: -3*5+2 | -13
>>

:::simboli
f | iskana funkcija | | | v primeru 4 prefiltrirana prostornina plazme
x, y | spremenljivki v enačbi | | | veljati mora za vse dovoljene vrednosti
c | konstanta $f(1)$ pri Cauchyjevi enačbi | c = f(1) | | v primeru 3 je $c = f(0)$
g | pomožna funkcija v primeru 3 | g(x) = f(x) - f(0) | | aditivna: $g(x + y) = g(x) + g(y)$
k | smerni koeficient | g(x) = kx | |
A, B | v primeru 1 $f(x)$ in $f(1-x)$; v primeru 3 argumenta funkcije $f$ | | |
a | konstanta iz primera 2 | a = 1 - f(0) | |
s, t | časa v primeru 4 | | min |
V | prostornina plazme | V = kt | mL |
:::
