---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ura kaže $10$. Koliko bo kazala čez $5$ ur? Ne $15$, ampak $3$. Na klavirju igraš ton C in se dvigneš za $17$ poltonov. Pristaneš na tonu F, le oktavo višje, ker je $17 = 1 \cdot 12 + 5$ in je F pet poltonov nad C.

Dva različna svetova, ista ideja: računaš z **ostanki pri deljenju z $12$**. Ta »aritmetika ostankov« ima presenetljive lastnosti. Če se iz C vzpenjaš po kvintah ($7$ poltonov), obiščeš vseh $12$ tonov, preden se vrneš (krog kvint). Če pa se vzpenjaš po velikih tercah ($4$ poltone), se po treh korakih vrneš na C: C, E, G$\sharp$, C. Tri terce so »nič«: $3 \cdot 4 \equiv 0 \pmod{12}$, čeprav niti $3$ niti $4$ ni nič.

Isto vprašanje se pojavi pri polinomih: kdaj gre deljenje brez ostanka, koliko ničel ima polinom, s čim lahko delimo. Odgovor je odvisen od tega, v kakšni strukturi računaš: v **kolobarju** ali v **polju**. To je podlaga za kodiranje (CD-ji, QR-kode), kriptografijo in za konstrukcijo kompleksnih števil.

## Razlaga

**1. Mamljiva ideja.** Iz srednje šole znaš: polinom stopnje $2$ ima največ dve ničli. Preizkusimo to v svetu ure. Poišči vse $x \in \{0, 1, \dots, 11\}$, za katere je $x^2 \equiv 1 \pmod{12}$, torej ničle polinoma $x^2 - 1$:

- $1^2 = 1$,
- $5^2 = 25 = 2 \cdot 12 + 1$,
- $7^2 = 49 = 4 \cdot 12 + 1$,
- $11^2 = 121 = 10 \cdot 12 + 1$.

Štiri ničle polinoma stopnje $2$! Pravilo »največ $n$ ničel« torej ni zakon narave. Velja le v strukturah z dodatno lastnostjo. Da jo najdemo, moramo najprej natančno povedati, kje računamo.

**2. Kolobar.** **Kolobar** je množica $R$ z dvema operacijama, $+$ in $\cdot$, pri čemer je $(R, +)$ Abelova grupa, množenje je asociativno in velja distributivnost $a(b + c) = ab + ac$, $(a + b)c = ac + bc$. Večinoma bomo delali s **komutativnimi kolobarji z enico** ($ab = ba$, obstaja $1$). Primeri: cela števila $\mathbb{Z}$; ostanki $\mathbb{Z}_n = \{0, 1, \dots, n-1\}$ z računanjem po modulu $n$; polinomi $R[x]$ s koeficienti iz $R$. Kvadratne matrike tvorijo kolobar, ki ni komutativen.

**3. Kje se je zalomilo.** Element $a \neq 0$ je **delitelj niča**, če obstaja $b \neq 0$ z $ab = 0$. V $\mathbb{Z}_{12}$ sta to na primer $3$ in $4$ (tri velike terce). Komutativen kolobar brez deliteljev niča (in z $1 \neq 0$) je **cel kolobar**. Element $a$ je **obrnljiv** (enota), če obstaja $b$ z $ab = 1$.

Kateri intervali obiščejo vseh $12$ tonov? Tisti, ki so v $\mathbb{Z}_{12}$ obrnljivi. Korak $k$ obišče $12/\gcd(k, 12)$ različnih tonov:

| korak $k$ (poltoni) | interval | različnih tonov | $\gcd(k, 12)$ |
|---|---|---|---|
| $1$ | polton | $12$ | $1$ |
| $3$ | mala terca | $4$ | $3$ |
| $4$ | velika terca | $3$ | $4$ |
| $7$ | kvinta | $12$ | $1$ |

V splošnem je $k$ obrnljiv v $\mathbb{Z}_n$ natanko tedaj, ko je $\gcd(k, n) = 1$. Sicer je (pri $k \not\equiv 0$) delitelj niča.

:::premisli
Zakaj delitelj niča v kolobarju uniči pravilo »največ $n$ ničel«? Namig: $x^2 - 1 = (x - 1)(x + 1)$.
---
Iz $(x - 1)(x + 1) = 0$ bi radi sklepali $x - 1 = 0$ ali $x + 1 = 0$. To sme le kolobar brez deliteljev niča. Pri $x = 5$ je $(5 - 1)(5 + 1) = 4 \cdot 6 = 24 \equiv 0 \pmod{12}$, čeprav nobeden od faktorjev ni nič.
:::

**4. Polje.** **Polje** je komutativen kolobar z $1 \neq 0$, v katerem je **vsak** neničelen element obrnljiv. Primeri: $\mathbb{Q}$, $\mathbb{R}$, $\mathbb{C}$ in $\mathbb{Z}_p$ za praštevilo $p$. Vsako polje je cel kolobar: iz $ab = 0$ in $a \neq 0$ dobiš $b = a^{-1}ab = 0$. Kolobar $\mathbb{Z}_n$ je polje natanko tedaj, ko je $n$ praštevilo; $\mathbb{Z}_{12}$ ni polje, $\mathbb{Z}_{13}$ je.

**5. Deljenje polinomov z ostankom.** Naj bo $F$ polje in $f, g \in F[x]$, $g \neq 0$. Potem obstajata **enolično** določena $q, r \in F[x]$, da je

$$f = q\,g + r, \qquad \deg r < \deg g.$$

Postopek je enak kot pri številih: delimo vodilni člen z vodilnim členom, odštejemo, ponovimo. Polje potrebujemo, ker v vsakem koraku delimo z vodilnim koeficientom $g$. V $\mathbb{Z}[x]$ na primer $x^2$ z $2x$ ne gre, ker $\tfrac12 \notin \mathbb{Z}$. Pravimo, da $g$ **deli** $f$ ($g \mid f$), če je $r = 0$.

Nad celim kolobarjem velja $\deg(fg) = \deg f + \deg g$, ker se vodilna koeficienta ne moreta zmnožiti v nič. V $\mathbb{Z}_{12}[x]$ to ne drži: $(2x)(6x) = 12x^2 \equiv 0$.

**6. Ničle.** **Izrek o ostanku:** ostanek pri deljenju $f$ z $x - a$ je število $f(a)$. Dokaz: $f = q(x)(x - a) + r$ s konstanto $r$; vstavi $x = a$. Posledica: $a$ je ničla $f$ natanko tedaj, ko $(x - a) \mid f$.

Zdaj popravimo mamljivo idejo. Če je $F$ polje (ali cel kolobar) in $f \neq 0$ stopnje $n$, ima $f$ **največ $n$ ničel**. Vsaka ničla $a$ odcepi faktor $x - a$ in stopnja pade za $1$. Pišimo $f = q\,(x - a)$. Za drugo ničlo $b \neq a$ velja $0 = f(b) = q(b)(b - a)$. Ker je $b - a \neq 0$ in deliteljev niča ni, je $q(b) = 0$: vse ostale ničle $f$ so ničle $q$, ki ima stopnjo $n - 1$. V $\mathbb{Z}_{12}$ prav ta korak odpove.

:::premisli
Koliko ničel ima $x^2 - 1$ v $\mathbb{Z}_{13}$? Odgovori brez preizkušanja vseh trinajstih števil.
---
Natanko dve, $1$ in $12$. $\mathbb{Z}_{13}$ je polje, zato ima polinom stopnje $2$ največ dve ničli, in $1$ ter $12 \equiv -1$ sta očitno ničli.
:::

**7. Nerazcepni polinomi in nova polja.** Polinom stopnje vsaj $1$ je **nerazcepen** nad $F$, če ni produkt dveh polinomov nižje stopnje. Polinom stopnje $2$ ali $3$ je nerazcepen natanko tedaj, ko nima ničle v $F$ (vsak razcep bi imel linearen faktor). Primer: $x^2 + 1$ je nerazcepen nad $\mathbb{R}$, nad $\mathbb{C}$ pa je $(x - i)(x + i)$. Nerazcepni polinomi so »praštevila« med polinomi; iz njih se gradijo nova polja (glej »Drugače: Kot zgodba«).

## Rešeni primeri

### Primer 1 (lažji): obrat kvinte

Krog kvint dobiš, če kromatične tone $0, 1, \dots, 11$ pomnožiš s $7$ po modulu $12$. S katerim številom moraš množiti, da se vrneš nazaj na kromatično lestvico? Z drugimi besedami: poišči inverz $7$ v $\mathbb{Z}_{12}$.

**Podatki:** kolobar $\mathbb{Z}_{12}$, element $a = 7$
**Iščemo:** $b \in \mathbb{Z}_{12}$ s $7b \equiv 1 \pmod{12}$

:::formula
$a$ je obrnljiv v $\mathbb{Z}_n \iff \gcd(a, n) = 1$; inverz: $ab \equiv 1 \pmod n$
:::

**Rešitev:**

1. $\gcd(7, 12) = 1$, zato inverz obstaja.
2. Preizkusimo kandidate med obrnljivimi elementi $1, 5, 7, 11$: $7 \cdot 5 = 35 = 2 \cdot 12 + 11$, ne ustreza.
3. $7 \cdot 7 = 49 = 4 \cdot 12 + 1$, torej $7 \cdot 7 \equiv 1 \pmod{12}$.
4. Odgovor: inverz kvinte je spet $7$. Če krog kvint še enkrat »pomnožiš s kvinto«, dobiš nazaj kromatično lestvico.

### Primer 2: deljenje in izrek o ostanku

Deli $f(x) = x^4 - 3x^3 + 2x + 5$ z $g(x) = x^2 - x + 1$ nad $\mathbb{R}$. Nato brez deljenja povej ostanek pri deljenju $f$ z $x - 2$.

**Podatki:** $f(x) = x^4 - 3x^3 + 2x + 5$, $g(x) = x^2 - x + 1$, $a = 2$
**Iščemo:** $q$ in $r$ z $f = qg + r$, $\deg r < 2$; ostanek pri deljenju z $x - 2$

:::formula
$f = q\,g + r$, $\deg r < \deg g$; ostanek pri deljenju z $x - a$ je $f(a)$
:::

**Rešitev:**

1. $x^4 : x^2 = x^2$. Odštejemo $x^2 g = x^4 - x^3 + x^2$; ostane $-2x^3 - x^2 + 2x + 5$.
2. $-2x^3 : x^2 = -2x$. Odštejemo $-2x\,g = -2x^3 + 2x^2 - 2x$; ostane $-3x^2 + 4x + 5$.
3. $-3x^2 : x^2 = -3$. Odštejemo $-3g = -3x^2 + 3x - 3$; ostane $x + 8$. Stopnja $1 < 2$, zato končamo.
4. Torej $q = x^2 - 2x - 3$, $r = x + 8$.
5. Ostanek pri deljenju z $x - 2$: $f(2) = 16 - 24 + 4 + 5 = 1$.
6. Preizkus pri $x = 2$: $q(2) = -3$, $g(2) = 3$, $r(2) = 10$, in $(-3) \cdot 3 + 10 = 1 = f(2)$.
7. Odgovor: $f = (x^2 - 2x - 3)(x^2 - x + 1) + (x + 8)$; pri deljenju z $x - 2$ je ostanek $1$.

### Primer 3 (težji): koliko ničel ima $x^2 - 1$?

Učenec trdi: »$x^2 - 1$ ima vedno točno dve ničli, $1$ in $-1$.« Preveri trditev v $\mathbb{Z}_{15}$ in v $\mathbb{Z}_{17}$ in pojasni razliko.

**Podatki:** polinom $x^2 - 1$; kolobarja $\mathbb{Z}_{15}$ in $\mathbb{Z}_{17}$
**Iščemo:** vse ničle v obeh kolobarjih in razlog za razliko

:::formula
$x^2 - 1 = (x - 1)(x + 1)$; v polju iz $ab = 0$ sledi $a = 0$ ali $b = 0$
:::

**Rešitev:**

1. V $\mathbb{Z}_{15}$ iščemo $x$, da $15 \mid (x - 1)(x + 1)$. Ker je $15 = 3 \cdot 5$, mora $3$ deliti enega od faktorjev, $5$ pa tudi enega, ne nujno istega. Ustrezajo $x = 1, 4, 11, 14$: na primer $(4 - 1)(4 + 1) = 3 \cdot 5 = 15$.
2. Pri $x = 4$ in $x = 11$ noben faktor ni deljiv s $15$; produkt je nič zaradi deliteljev niča ($3 \cdot 5$ oz. $10 \cdot 12 = 120 = 8 \cdot 15$).
3. $\mathbb{Z}_{17}$ je polje, ker je $17$ praštevilo. Iz $(x - 1)(x + 1) \equiv 0$ sledi $x \equiv 1$ ali $x \equiv -1 \equiv 16$.
4. Odgovor: v $\mathbb{Z}_{15}$ ima polinom štiri ničle ($1, 4, 11, 14$), v $\mathbb{Z}_{17}$ natanko dve ($1, 16$). Trditev je zagotovljena le v celem kolobarju (z $1 \neq -1$), $\mathbb{Z}_{15}$ pa to ni.

### Primer 4 – zdaj ti

Z Evklidovim algoritmom poišči največji skupni delitelj polinomov $f = x^3 - 1$ in $g = x^2 - 1$ nad $\mathbb{Q}$.

**Podatki:** $f = x^3 - 1$, $g = x^2 - 1$, polje $\mathbb{Q}$
**Iščemo:** $\gcd(f, g)$ (normiran)

:::formula
Evklidov algoritem: $f = q_1 g + r_1$, $g = q_2 r_1 + r_2$, …; zadnji neničelni ostanek je $\gcd$
:::

**Rešitev:**

1. $x^3 : x^2 = x$. Odštejemo $x \cdot g = x^3 - x$; ostane $x - 1$. Torej $x^3 - 1 = x(x^2 - 1) + (x - 1)$.
2. Zdaj deli $g = x^2 - 1$ z ostankom $x - 1$ in povej, kaj je $\gcd$.

:::premisli
Kakšen je ostanek v drugem koraku in kaj je $\gcd(f, g)$?
---
$x^2 - 1 = (x + 1)(x - 1) + 0$. Ostanek je $0$, zato je zadnji neničelni ostanek $x - 1$ in $\gcd(f, g) = x - 1$. Res: $x - 1$ deli oba, ker je $1$ skupna ničla, druge skupne ničle pa ni.
:::

## Pogoste napake

- **»Polinom stopnje $n$ ima vedno največ $n$ ničel.«** Sklep »faktor je nič« ni dovoljen, če ima kolobar delitelje niča; $x^2 - 1$ ima v $\mathbb{Z}_{12}$ štiri ničle. Popravek: pravilo velja nad poljem oz. celim kolobarjem.
- **»Če $a \neq 0$ in $b \neq 0$, je tudi $ab \neq 0$.«** To je navada iz $\mathbb{R}$. V $\mathbb{Z}_{12}$ je $3 \cdot 4 \equiv 0$. Popravek: najprej preveri, ali je struktura cel kolobar; $\mathbb{Z}_n$ je polje le pri praštevilskem $n$.
- **»Stopnja produkta je vsota stopenj.«** Drži le, če se vodilna koeficienta ne zmnožita v nič. V $\mathbb{Z}_{12}[x]$ je $(4x^2 + 1)(3x + 5) = 8x^2 + 3x + 5$, stopnje $2$, ne $3$.
- **Napačen predznak v izreku o ostanku.** Ostanek pri deljenju z $x + 2$ ni $f(2)$, ampak $f(-2)$, ker je $x + 2 = x - (-2)$.
- **Prezgodnji ali prepozni konec deljenja.** Deljenje se ustavi natanko takrat, ko je $\deg r < \deg g$, ne prej in ne pozneje. Ostanek stopnje $1$ pri delitelju stopnje $2$ je pravilen končni rezultat.

## Povzetek

- Kolobar: Abelova grupa za $+$, asociativno množenje, distributivnost. Primeri: $\mathbb{Z}$, $\mathbb{Z}_n$, $R[x]$, matrike.
- Delitelj niča: $a \neq 0$ z $ab = 0$ za neki $b \neq 0$. Cel kolobar jih nima. V $\mathbb{Z}_n$ je $k$ obrnljiv natanko pri $\gcd(k, n) = 1$.
- Polje: vsak neničelen element je obrnljiv. $\mathbb{Z}_n$ je polje natanko pri praštevilskem $n$.
- Nad poljem: $f = qg + r$, $\deg r < \deg g$, $q$ in $r$ enolična; $\gcd$ z Evklidovim algoritmom.
- Izrek o ostanku: ostanek pri deljenju z $x - a$ je $f(a)$; $a$ je ničla $\iff (x - a) \mid f$.
- Nad celim kolobarjem ima polinom stopnje $n$ največ $n$ ničel; v $\mathbb{Z}_{12}$ ima $x^2 - 1$ štiri.
- Polinom stopnje $2$ ali $3$ je nerazcepen natanko tedaj, ko nima ničle.

## Za izpit

Znati moraš povedati:

- definicije kolobarja, delitelja niča, obrnljivega elementa, celega kolobarja in polja, vsako s primerom in protiprimerom,
- kdaj je $k$ obrnljiv v $\mathbb{Z}_n$ in kdaj je $\mathbb{Z}_n$ polje; dokaz, da je vsako polje cel kolobar,
- izrek o deljenju polinomov z ostankom nad poljem (obstoj in enoličnost $q$ in $r$) in zakaj je potrebno polje,
- izrek o ostanku z dokazom in posledico $f(a) = 0 \iff (x - a) \mid f$,
- trditev, da ima neničelni polinom stopnje $n$ nad celim kolobarjem največ $n$ ničel, z dokazom in protiprimerom v $\mathbb{Z}_{12}$,
- definicijo nerazcepnega polinoma in kriterij z ničlami za stopnji $2$ in $3$ (ter zakaj pri stopnji $4$ ne zadošča).

### Naloga 1

V $\mathbb{Z}_5[x]$ sta dana polinoma $f = x^4 + x^3 + 3x^2 + 2x + 2$ in $g = x^3 + 3x^2 + 2x + 1$. (a) Z Evklidovim algoritmom poišči normiran $\gcd(f, g)$. (b) Razcepi $f$ in $g$ na nerazcepne faktorje nad $\mathbb{Z}_5$. (c) Koliko ničel ima $f$ in koliko $g$ v $\mathbb{Z}_5$?

**Rešitev:**

1. Prvo deljenje, $f$ z $g$. $x^4 : x^3 = x$; odštejemo $x\,g = x^4 + 3x^3 + 2x^2 + x$ in ostane $-2x^3 + x^2 + x + 2 \equiv 3x^3 + x^2 + x + 2$.
2. $3x^3 : x^3 = 3$; odštejemo $3g = 3x^3 + 9x^2 + 6x + 3 \equiv 3x^3 + 4x^2 + x + 3$ in ostane $-3x^2 - 1 \equiv 2x^2 + 4$. Torej $f = (x + 3)\,g + (2x^2 + 4)$.
3. Drugo deljenje, $g$ z $r_1 = 2x^2 + 4$. Delimo z vodilnim koeficientom $2$, njegov inverz v $\mathbb{Z}_5$ je $3$, ker je $2 \cdot 3 = 6 \equiv 1$. Zato je prvi člen kvocienta $3x$ (ker je $3x \cdot 2x^2 = 6x^3 \equiv x^3$); odštejemo $3x\,r_1 = 6x^3 + 12x \equiv x^3 + 2x$ in ostane $3x^2 + 1$.
4. Drugi člen kvocienta je $3 \cdot 3 = 9 \equiv 4$ (vodilni koeficient $3$ krat inverz $3$); odštejemo $4r_1 = 8x^2 + 16 \equiv 3x^2 + 1$ in ostane $0$. Torej $g = (3x + 4)\,r_1$.
5. Zadnji neničelni ostanek je $2x^2 + 4$. Normiramo ga z množenjem s $3$: $3(2x^2 + 4) = 6x^2 + 12 \equiv x^2 + 2$. Torej $\gcd(f, g) = x^2 + 2$.
6. (b) Iz koraka 4: $g = (3x + 4) \cdot 2\,(x^2 + 2) = (6x + 8)(x^2 + 2) \equiv (x + 3)(x^2 + 2)$.
7. Delimo $f$ z $x^2 + 2$: $x^4 : x^2 = x^2$, ostane $x^3 + x^2 + 2x + 2$; $x^3 : x^2 = x$, ostane $x^2 + 2$; $x^2 : x^2 = 1$, ostane $0$. Torej $f = (x^2 + x + 1)(x^2 + 2)$.
8. Nerazcepnost kvadratnih faktorjev preverimo z ničlami. Vrednosti $x^2 + 2$ pri $x = 0, 1, 2, 3, 4$ so $2, 3, 1, 1, 3$ (po modulu $5$), vrednosti $x^2 + x + 1$ pa $1, 3, 2, 3, 1$. Nobena ni $0$, zato sta oba faktorja stopnje $2$ nerazcepna.
9. (c) Ker je $\mathbb{Z}_5$ polje, je produkt nič le, če je nič eden od faktorjev. $f$ je produkt dveh faktorjev brez ničel, zato nima nobene ničle. $g$ ima natanko eno: $x + 3 = 0$, torej $x = -3 \equiv 2$.
10. Odgovor: $\gcd(f, g) = x^2 + 2$; $f = (x^2 + 2)(x^2 + x + 1)$, $g = (x^2 + 2)(x + 3)$; $f$ nima ničel v $\mathbb{Z}_5$, $g$ ima eno, $x = 2$.

### Naloga 2

Nad poljem $\mathbb{Z}_3$ sta dana $p = x^3 + 2x + 1$ in $h = x^4 + 1$. (a) Dokaži, da je $p$ nerazcepen. (b) Pokaži, da $h$ nima ničle v $\mathbb{Z}_3$, in utemelji, ali je nerazcepen. (c) Koliko elementov ima $\mathbb{Z}_3[x]/(p)$ in kateri element je v njem inverz elementa $x$? Ali je $\mathbb{Z}_3[x]/(h)$ polje?

**Rešitev:**

1. (a) $p(0) = 1$, $p(1) = 1 + 2 + 1 = 4 \equiv 1$, $p(2) = 8 + 4 + 1 = 13 \equiv 1$. Polinom $p$ nima ničle v $\mathbb{Z}_3$.
2. Če bi bil $p$ produkt dveh polinomov nižje stopnje, bi bil eden stopnje $1$ (ker je $3 = 1 + 2$) in bi dal ničlo. Zato je $p$ nerazcepen.
3. (b) $h(0) = 1$, $h(1) = 2$, $h(2) = 16 + 1 = 17 \equiv 2$. Ničle ni, torej $h$ nima linearnega faktorja. Pri stopnji $4$ to še ne pomeni nerazcepnosti: možen je razcep na dva kvadratna faktorja.
4. Nastavek z normiranima faktorjema: $(x^2 + ax + b)(x^2 + cx + d) = x^4 + (a + c)x^3 + (b + d + ac)x^2 + (ad + bc)x + bd$. Primerjamo z $x^4 + 1$: $a + c = 0$, $b + d + ac = 0$, $ad + bc = 0$, $bd = 1$.
5. Iz $c = -a$ dobimo $a(d - b) = 0$ in $b + d = a^2$. Če je $a = 0$, je $d = -b$ in $bd = -b^2 = 1$, torej $b^2 = 2$; to v $\mathbb{Z}_3$ ni mogoče, ker sta kvadrata le $0$ in $1$. Torej $a \neq 0$ in $d = b$.
6. Potem je $b^2 = 1$ in $2b = a^2 = 1$ (kvadrat neničelnega elementa v $\mathbb{Z}_3$ je $1$). Iz $2b = 1$ sledi $b = 2$, in res $b^2 = 4 \equiv 1$. Vzamemo $a = 1$, $c = 2$.
7. Preizkus: $(x^2 + x + 2)(x^2 + 2x + 2) = x^4 + 3x^3 + 6x^2 + 6x + 4 \equiv x^4 + 1$. Polinom $h$ je torej razcepen, čeprav nima ničle.
8. (c) Elementi $\mathbb{Z}_3[x]/(p)$ so ostanki $a_0 + a_1x + a_2x^2$ s koeficienti iz $\mathbb{Z}_3$; teh je $3^3 = 27$. Ker je $p$ nerazcepen, je to polje.
9. V njem je $x^3 + 2x \equiv -1$, torej $x(x^2 + 2) \equiv -1$ in $x \cdot \bigl(-(x^2 + 2)\bigr) \equiv 1$. Inverz je $-(x^2 + 2) = -x^2 - 2 \equiv 2x^2 + 1$.
10. $\mathbb{Z}_3[x]/(h)$ ni polje: ostanka $x^2 + x + 2$ in $x^2 + 2x + 2$ sta neničelna, njun produkt pa je $h \equiv 0$. To sta delitelja niča, enako kot $3$ in $4$ v $\mathbb{Z}_{12}$.
11. Odgovor: $p$ je nerazcepen; $h = (x^2 + x + 2)(x^2 + 2x + 2)$ je razcepen brez ničel; $\mathbb{Z}_3[x]/(p)$ je polje s $27$ elementi, inverz elementa $x$ je $2x^2 + 1$; $\mathbb{Z}_3[x]/(h)$ ni polje.

### Naloga 3

Natančno navedi izrek o deljenju polinomov z ostankom in dokaži enoličnost kvocienta in ostanka. Nato navedi in dokaži izrek o ostanku ter trditev o številu ničel polinoma. Utemelji, na katerem mestu dokaz odpove v $\mathbb{Z}_{12}[x]$.

**Rešitev:**

1. Izrek: naj bo $F$ polje in $f, g \in F[x]$, $g \neq 0$. Potem obstajata enolično določena $q, r \in F[x]$ z $f = qg + r$ in $\deg r < \deg g$ (ali $r = 0$).
2. Enoličnost: naj bo $f = q_1g + r_1 = q_2g + r_2$, oba ostanka stopnje manj kot $\deg g$. Potem je $(q_1 - q_2)\,g = r_2 - r_1$.
3. Če bi bil $q_1 \neq q_2$, bi imela leva stran stopnjo $\deg(q_1 - q_2) + \deg g \geq \deg g$, ker v polju ni deliteljev niča in se stopnji seštejeta. Desna stran ima stopnjo manj kot $\deg g$. Protislovje, zato $q_1 = q_2$ in potem $r_1 = r_2$.
4. Izrek o ostanku: ostanek pri deljenju $f$ z $x - a$ je $f(a)$. Dokaz: $f = q\,(x - a) + r$ z $\deg r < 1$, torej je $r$ konstanta. Vstavimo $x = a$: $f(a) = q(a) \cdot 0 + r = r$.
5. Posledica: $f(a) = 0$ natanko tedaj, ko je $r = 0$, torej ko $(x - a) \mid f$.
6. Trditev: neničelni polinom stopnje $n$ nad poljem (ali celim kolobarjem) ima največ $n$ ničel. Dokaz z indukcijo po $n$. Pri $n = 0$ je $f$ neničelna konstanta in nima ničel.
7. Korak: naj bo $\deg f = n \geq 1$. Če $f$ nima ničle, ni kaj dokazovati. Sicer naj bo $a$ ničla; po koraku 5 je $f = q\,(x - a)$ z $\deg q = n - 1$.
8. Za vsako drugo ničlo $b \neq a$ je $0 = f(b) = q(b)(b - a)$. Ker je $b - a \neq 0$ in deliteljev niča ni, je $q(b) = 0$. Vse ničle razen $a$ so torej ničle $q$, teh je po indukcijski predpostavki največ $n - 1$. Skupaj jih je največ $n$.
9. V $\mathbb{Z}_{12}$ odpove sklep v koraku 8: iz $q(b)(b - a) = 0$ ne sledi $q(b) = 0$. Za $f = x^2 - 1$, $a = 1$, $q = x + 1$ in $b = 5$ je $q(5)(5 - 1) = 6 \cdot 4 = 24 \equiv 0$, čeprav $q(5) = 6 \neq 0$. Zato ima $x^2 - 1$ tam štiri ničle: $1, 5, 7, 11$.
10. Odgovor: deljenje z ostankom je nad poljem enolično zaradi primerjave stopenj; ostanek pri deljenju z $x - a$ je $f(a)$; meja $n$ ničel sloni na odsotnosti deliteljev niča in zato v $\mathbb{Z}_{12}$ ne velja. (Izrek o ostanku sam velja nad vsakim komutativnim kolobarjem, ker je $x - a$ normiran.)

## Drugače: Kot zgodba

V 16. stoletju so italijanski matematiki reševali kubične enačbe in v formulah naleteli na $\sqrt{-1}$. Ničesar takega ni bilo, a račun je na koncu dal pravilne realne rešitve. Kako si izmisliti število, ki ne obstaja?

Sodobni odgovor je presenetljivo skromen. Vzemi kolobar $\mathbb{R}[x]$ in se dogovori, da računaš **po modulu** $x^2 + 1$, tako kot ura računa po modulu $12$. Vsak polinom zamenjaš z njegovim ostankom pri deljenju z $x^2 + 1$; ostanki so oblike $a + bx$. Množenje: $(a + bx)(c + dx) = ac + (ad + bc)x + bd\,x^2$, in ker je $x^2 \equiv -1$, dobiš $(ac - bd) + (ad + bc)x$. To je natanko množenje kompleksnih števil, $x$ igra vlogo $i$.

Zakaj je nastalo polje in ne le kolobar? Ker je $x^2 + 1$ nad $\mathbb{R}$ nerazcepen, tako kot je $13$ praštevilo. Pri uri z $12$ urami (sestavljeno število) so se pojavili delitelji niča; pri nerazcepnem polinomu se ne morejo. V splošnem je $F[x]/(p)$ (polinomi nad $F$, računani po modulu $p$) polje natanko tedaj, ko je $p$ nerazcepen.

Isti trik v $\mathbb{Z}_2$ s polinomom $x^2 + x + 1$ (nima ničle, saj sta vrednosti pri $0$ in $1$ obe $1$) da polje s štirimi elementi $0, 1, x, x + 1$. Taka končna polja so jedro kod, ki popravljajo napake na glasbenih CD-jih.

## Drugače: Korak za korakom s številkami

Ostanek pri deljenju z $x - a$ (in kvocient) najhitreje dobiš s **Hornerjevim algoritmom**. Za $f(x) = x^4 - 3x^3 + 0x^2 + 2x + 5$ in $a = 2$:

1. Izpiši vse koeficiente, tudi ničle: $1, -3, 0, 2, 5$.
2. Prvi koeficient prepiši: $1$.
3. Pomnoži z $a$ in prištej naslednjega: $1 \cdot 2 - 3 = -1$.
4. Ponovi: $-1 \cdot 2 + 0 = -2$.
5. Ponovi: $-2 \cdot 2 + 2 = -2$.
6. Zadnjič: $-2 \cdot 2 + 5 = 1$. To je ostanek, $f(2) = 1$.
7. Prejšnja števila $1, -1, -2, -2$ so koeficienti kvocienta: $f = (x^3 - x^2 - 2x - 2)(x - 2) + 1$.

Rezultat se ujema s Primerom 2. Isti postopek deluje v $\mathbb{Z}_p$, le vsak vmesni rezultat zmanjšaš po modulu $p$.

## Preveri se

? V $\mathbb{Z}_{12}$ velja $3 \cdot 4 \equiv 0$. Kako imenujemo element $3$ v tem kolobarju?
+ Delitelj niča.
- Obrnljiv element (enota).
~ Obrnljiv bi bil, če bi obstajal $b$ s $3b \equiv 1$. Ker je $\gcd(3, 12) = 3$, takega $b$ ni.
- Nerazcepen element, ker je $3$ praštevilo.
~ Da je $3$ praštevilo v $\mathbb{Z}$, ne pove nič o njegovi vlogi v $\mathbb{Z}_{12}$, kjer je $3 \cdot 4 \equiv 0$.
- Ničla polinoma.
~ Ničla je vrednost $x$, pri kateri je polinom enak nič. Tu govorimo o produktu dveh neničelnih elementov.
> Element $a \neq 0$ je delitelj niča, če obstaja $b \neq 0$ z $ab = 0$. Tu je $b = 4$.

? Razvrsti kolobarje po številu rešitev enačbe $x^2 = 1$, od najmanj do največ: $\mathbb{Z}_7$, $\mathbb{Z}_{12}$, $\mathbb{Z}_{24}$.
- Vsi imajo po dve rešitvi, zato vrstnega reda ni.
~ Dve rešitvi zagotovo velja le v polju. $\mathbb{Z}_{12}$ in $\mathbb{Z}_{24}$ nista polji.
+ $\mathbb{Z}_7$ (2), $\mathbb{Z}_{12}$ (4), $\mathbb{Z}_{24}$ (8).
- $\mathbb{Z}_{24}$, $\mathbb{Z}_{12}$, $\mathbb{Z}_7$, ker ima večji kolobar manj rešitev.
~ Velikost kolobarja ne zmanjša števila rešitev; v $\mathbb{Z}_{24}$ je kvadrat vsakega lihega števila, ki ni deljivo s $3$, enak $1$.
> $\mathbb{Z}_7$ je polje: le $1$ in $6$. V $\mathbb{Z}_{12}$: $1, 5, 7, 11$. V $\mathbb{Z}_{24}$: $1, 5, 7, 11, 13, 17, 19, 23$.

? Kaj se zgodi s stopnjo, če v $\mathbb{Z}_{12}[x]$ zmnožiš $4x^2 + 1$ in $3x + 5$?
- Stopnja je $3$, kot vedno vsota stopenj.
~ Vsota stopenj velja le, če produkt vodilnih koeficientov ni nič. Tu je $4 \cdot 3 \equiv 0$.
+ Stopnja pade na $2$.
- Stopnja je $6$, produkt stopenj.
~ Pri množenju polinomov se stopnje seštevajo (če sploh), ne množijo.
- Produkt je ničelni polinom.
~ Ničelni bi bil, če bi vsi koeficienti postali nič. Konstantni člen je $1 \cdot 5 = 5$.
> $(4x^2 + 1)(3x + 5) = 12x^3 + 20x^2 + 3x + 5 \equiv 8x^2 + 3x + 5$. Člen $12x^3$ izgine, ker je $4$ delitelj niča.

? Kolikšen je ostanek pri deljenju $f(x) = x^3 - 2x^2 + 4x + 1$ z $x + 1$?
- $4$
~ To je $f(1)$. Delitelj $x + 1$ je $x - (-1)$, zato vstavimo $-1$.
- $1$
~ To je samo prosti člen, torej $f(0)$, kar je ostanek pri deljenju z $x$.
+ $-6$
- $0$
~ Ostanek bi bil $0$, če bi bil $-1$ ničla. Tu $f(-1) \neq 0$.
> Po izreku o ostanku: $f(-1) = -1 - 2 - 4 + 1 = -6$.

? Koliko je inverz elementa $5$ v polju $\mathbb{Z}_7$?
- $2$
~ $2$ je nasprotni element, ker $5 + 2 \equiv 0$. Inverz za množenje mora dati $5b \equiv 1$; $5 \cdot 2 = 10 \equiv 3$.
- $\tfrac15$
~ Ulomkov v $\mathbb{Z}_7$ ni; iščemo celo število od $0$ do $6$.
+ $3$
- $5$
~ $5 \cdot 5 = 25 \equiv 4 \pmod 7$, ne $1$.
> $5 \cdot 3 = 15 = 2 \cdot 7 + 1$, torej $5 \cdot 3 \equiv 1 \pmod 7$.

:::simboli
f | deljenec (polinom, ki ga delimo) | f = q\,g + r
g | delitelj (polinom, s katerim delimo) | | | g ≠ 0
q | kvocient | | | enolično določen
r | ostanek pri deljenju | r = f - q\,g | | deg r < deg g
q_1, q_2 | kvocienta v korakih Evklidovega algoritma
r_1, r_2 | ostanka v korakih Evklidovega algoritma | | | zadnji neničelni ostanek je gcd
a, b | elementa kolobarja | | | pri x − a število, v katerem računamo f(a)
n | modul (število ostankov v ℤₙ) ali stopnja polinoma
x | spremenljivka polinoma
:::
