---
stanje: osnutek
demo: koren
avtor: AI
---

## Zakaj se tega učimo

Vzemi kvadratni list origami papirja ali kvadratno keramično ploščico in z ravnilom izmeri stranico in diagonalo. List s stranico $15\,\text{cm}$ ima diagonalo približno $21{,}2\,\text{cm}$. Ploščica s stranico $20\,\text{cm}$ ima diagonalo približno $28{,}3\,\text{cm}$. Deli diagonalo s stranico: obakrat dobiš približno $1{,}41$.

Po Pitagorovem izreku je diagonala lista dolga $\sqrt{15^2 + 15^2} = \sqrt{450}\,\text{cm}$. Zakaj je potem $\sqrt{450}$ ravno $15$-krat večji od $\sqrt{2} \approx 1{,}41$? Odgovor da pravilo za računanje s koreni, ki ga boš spodaj odkril sam. Z njim mizar ali keramičar iz $\sqrt{450}$ naredi $15\sqrt{2}$ in dolžino oceni na pamet.

Spoznal boš še **delno korenjenje** in **racionalizacijo**. Potreboval ju boš pri kvadratnih enačbah, pri diagonalah in višinah v geometriji ter pri razdaljah v koordinatnem sistemu.

## Razlaga

**1. Kvadratni koren.** Za $a \ge 0$ je $\sqrt{a}$ **nenegativno** število, katerega kvadrat je $a$. Pogoj $a \ge 0$ je nujen: v realnih številih ne obstaja koren negativnega števila. Velja

$$\left(\sqrt{a}\right)^2 = a \quad (a \ge 0), \qquad \sqrt{x^2} = |x| \quad (x \in \mathbb{R}).$$

Zato je $\sqrt{(-3)^2} = \sqrt{9} = 3 = |-3|$ in ne $-3$.

**2. n-ti koren.** Za naravno število $n \ge 2$ je $\sqrt[n]{a}$ tisto število $b$, za katero velja $b^n = a$. Število $n$ je **korenski eksponent**, število $a$ pod korenom pa **korenjenec**. Pri **sodem** $n$ mora biti $a \ge 0$ in je koren po dogovoru nenegativen. Pri **lihem** $n$ je koren definiran tudi za negativne $a$: $\sqrt[3]{-27} = -3$, ker je $(-3)^3 = -27$. Korenu $\sqrt[3]{a}$ pravimo kubični koren.

**3. Odkrij vzorec.** Zmnožek korenov izračunaj na dva načina: najprej vsak koren posebej, nato en koren iz zmnožka.

| Zmnožek | Posebej | En koren |
|---|---|---|
| $\sqrt{4} \cdot \sqrt{9}$ | $2 \cdot 3 = 6$ | $\sqrt{36} = 6$ |
| $\sqrt{4} \cdot \sqrt{25}$ | $2 \cdot 5 = 10$ | $\sqrt{100} = 10$ |
| $\sqrt{2} \cdot \sqrt{225}$ | $1{,}414 \cdot 15$ | $\sqrt{450}$ |

Vsakič dobiš isto, tudi v zadnji vrstici: oba izraza sta približno $21{,}21$. Zadnja vrstica je diagonala lista iz uvoda: $\sqrt{450} = \sqrt{225} \cdot \sqrt{2} = 15\sqrt{2}$.

**Pravila za računanje.** Vzorec velja v splošnem. Za $a, b \ge 0$ (in $b > 0$ pri deljenju) veljajo:

| Pravilo | Primer |
|---|---|
| $\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}$ | $\sqrt{3} \cdot \sqrt{12} = \sqrt{36} = 6$ |
| $\sqrt{\dfrac{a}{b}} = \dfrac{\sqrt{a}}{\sqrt{b}}$ | $\sqrt{\dfrac{25}{4}} = \dfrac{5}{2}$ |
| $\sqrt[n]{a \cdot b} = \sqrt[n]{a} \cdot \sqrt[n]{b}$ | $\sqrt[3]{2} \cdot \sqrt[3]{4} = \sqrt[3]{8} = 2$ |
| $\sqrt[m]{\sqrt[n]{a}} = \sqrt[m \cdot n]{a}$ | $\sqrt{\sqrt{16}} = \sqrt[4]{16} = 2$ |

:::premisli
Ali vzorec velja tudi za vsoto? Napovej, ali je $\sqrt{9} + \sqrt{16}$ enako $\sqrt{9 + 16}$, nato izračunaj.
---
Ne velja: $\sqrt{9} + \sqrt{16} = 3 + 4 = 7$, $\sqrt{9 + 16} = \sqrt{25} = 5$. Zato tudi diagonala lista ni $15 + 15 = 30\,\text{cm}$, ampak $\sqrt{15^2 + 15^2} \approx 21{,}2\,\text{cm}$.
:::

Za seštevanje pravila ni: **$\sqrt{a + b} \ne \sqrt{a} + \sqrt{b}$**.

**Ocena korena.** Če $a$ ni popoln kvadrat, koren ocenimo med dvema celima številoma. Ker je $4^2 = 16$ in $5^2 = 25$, velja $4 < \sqrt{20} < 5$. Ker je $4{,}4^2 = 19{,}36$ in $4{,}5^2 = 20{,}25$, je še natančneje $4{,}4 < \sqrt{20} < 4{,}5$. Tako lahko hitro preveriš, ali je rezultat računa smiseln.

V simulaciji spodaj (»Kvadratni koren in približki«) nastavi ploščino na $50$ in nekajkrat pritisni »Približaj«. Opazi, da se približek $7{,}07$ ujema s $5\sqrt{2} \approx 5 \cdot 1{,}414$, saj je $50 = 25 \cdot 2$.

**4. Seštevanje in odštevanje.** Seštevamo lahko samo **istovrstne korene**: člene z enakim korenskim eksponentom in enakim korenjencem. Seštejemo jih kot podobne člene v algebrskih izrazih: $2\sqrt{3} + 5\sqrt{3} = 7\sqrt{3}$. Člena $2\sqrt{3}$ in $3\sqrt{5}$ ne moremo združiti.

**5. Delno korenjenje.** Pod korenom poiščemo največji popolni kvadrat, ki je faktor, in ga »izvlečemo«:

$$\sqrt{a^2 \cdot b} = a\sqrt{b} \quad (a \ge 0,\ b \ge 0).$$

Primer: $\sqrt{72} = \sqrt{36 \cdot 2} = 6\sqrt{2}$. Z neznankami: $\sqrt{18a^3} = \sqrt{9a^2 \cdot 2a} = 3a\sqrt{2a}$ za $a \ge 0$. Pri kubičnem korenu iščemo popolne kube (tretje potence naravnih števil): $\sqrt[3]{54} = \sqrt[3]{27 \cdot 2} = 3\sqrt[3]{2}$. Obratno, faktor lahko vnesemo pod koren: $3\sqrt{2} = \sqrt{9 \cdot 2} = \sqrt{18}$ (če faktor ni negativen).

**6. Racionalizacija imenovalca.** **Racionalizirati** imenovalec pomeni ulomek preoblikovati tako, da v imenovalcu ni korena. S takim ulomkom je lažje računati in ocenjevati, saj namesto deljenja s korenom samo množimo. Ulomek razširimo tako, da vrednost ostane enaka.

- Imenovalec je en koren: $\dfrac{a}{\sqrt{b}} = \dfrac{a \cdot \sqrt{b}}{\sqrt{b} \cdot \sqrt{b}} = \dfrac{a\sqrt{b}}{b}$.
- Imenovalec je vsota ali razlika dveh členov s korenom: razširimo s **konjugiranim izrazom** (ista člena, med njima nasprotni znak), ker velja razlika kvadratov
$$\left(\sqrt{a} + \sqrt{b}\right)\left(\sqrt{a} - \sqrt{b}\right) = a - b.$$

Tako je $\dfrac{1}{\sqrt{a} - \sqrt{b}} = \dfrac{\sqrt{a} + \sqrt{b}}{a - b}$ za $a \ne b$.

Razširitev je dovoljena, ker ulomek množimo z $1$, na primer z $\dfrac{\sqrt{b}}{\sqrt{b}}$. Konjugirani izraz deluje tudi, kadar je le eden od členov koren: $\dfrac{3}{2 + \sqrt{3}} = \dfrac{3\left(2 - \sqrt{3}\right)}{4 - 3} = 6 - 3\sqrt{3}$. Preverjanje: leva stran je $\dfrac{3}{3{,}732} \approx 0{,}804$, desna $6 - 5{,}196 = 0{,}804$.

:::premisli
S čim razširiš ulomek $\dfrac{1}{\sqrt[3]{2}}$, da v imenovalcu ne bo več korena? Namig: pod kubičnim korenom mora nastati popolni kub.
---
S $\sqrt[3]{4}$, ker je $\sqrt[3]{2} \cdot \sqrt[3]{4} = \sqrt[3]{8} = 2$. Torej je $\dfrac{1}{\sqrt[3]{2}} = \dfrac{\sqrt[3]{4}}{2}$. Razširitev s $\sqrt[3]{2}$ ne zadošča, ker je $\sqrt[3]{2} \cdot \sqrt[3]{2} = \sqrt[3]{4}$ še vedno koren.
:::

## Rešeni primeri

### Primer 1 (lažji)

Poenostavi izraz $\sqrt{50} + \sqrt{18} - \sqrt{8}$.

**Podatki:** dan je izraz $\sqrt{50} + \sqrt{18} - \sqrt{8}$ (brez dodatnih številskih podatkov)
**Iščemo:** čim preprostejši zapis izraza

:::formula
$\sqrt{a^2 \cdot b} = a\sqrt{b}$ in $\;p\sqrt{b} + q\sqrt{b} = (p + q)\sqrt{b}$
:::

**Rešitev:**

1. Vsak koren delno korenimo: $\sqrt{50} = \sqrt{25 \cdot 2} = 5\sqrt{2}$, $\sqrt{18} = \sqrt{9 \cdot 2} = 3\sqrt{2}$, $\sqrt{8} = \sqrt{4 \cdot 2} = 2\sqrt{2}$.
2. Zdaj imamo istovrstne korene: $5\sqrt{2} + 3\sqrt{2} - 2\sqrt{2} = (5 + 3 - 2)\sqrt{2} = 6\sqrt{2}$.
3. Preverjanje: $\sqrt{50} + \sqrt{18} - \sqrt{8} \approx 7{,}0711 + 4{,}2426 - 2{,}8284 = 8{,}4853$ in $6\sqrt{2} \approx 8{,}4853$.
4. Odgovor: izraz je enak $6\sqrt{2}$.

### Primer 2 (srednji)

Racionaliziraj imenovalec in poenostavi: a) $\dfrac{6}{\sqrt{3}}$, b) $\dfrac{10}{\sqrt{7} - \sqrt{2}}$.

**Podatki:** ulomka $\dfrac{6}{\sqrt{3}}$ in $\dfrac{10}{\sqrt{7} - \sqrt{2}}$
**Iščemo:** enaka ulomka brez korena v imenovalcu

:::formula
$\dfrac{a}{\sqrt{b}} = \dfrac{a\sqrt{b}}{b}$ in $\;\left(\sqrt{a} - \sqrt{b}\right)\left(\sqrt{a} + \sqrt{b}\right) = a - b$
:::

**Rešitev:**

1. a) Razširimo s $\sqrt{3}$: $\dfrac{6}{\sqrt{3}} = \dfrac{6\sqrt{3}}{\sqrt{3} \cdot \sqrt{3}} = \dfrac{6\sqrt{3}}{3} = 2\sqrt{3}$.
2. b) Konjugirani izraz imenovalca je $\sqrt{7} + \sqrt{2}$. Ulomek razširimo z njim:
$$\frac{10}{\sqrt{7} - \sqrt{2}} \cdot \frac{\sqrt{7} + \sqrt{2}}{\sqrt{7} + \sqrt{2}} = \frac{10\left(\sqrt{7} + \sqrt{2}\right)}{7 - 2}.$$
3. Imenovalec je $7 - 2 = 5$, zato je rezultat $\dfrac{10\left(\sqrt{7} + \sqrt{2}\right)}{5} = 2\left(\sqrt{7} + \sqrt{2}\right) = 2\sqrt{7} + 2\sqrt{2}$.
4. Preverjanje: $\dfrac{10}{2{,}6458 - 1{,}4142} \approx 8{,}120$ in $2 \cdot 2{,}6458 + 2 \cdot 1{,}4142 \approx 8{,}120$.
5. Odgovor: a) $2\sqrt{3}$, b) $2\sqrt{7} + 2\sqrt{2}$.

### Primer 3: ploščice ob steni

Keramičar ima kvadratne ploščice s ploščino $50\,\text{cm}^2$. Ob steni, dolgi $1\,\text{m}$, jih položi v eno vrsto brez fug. Koliko celih ploščic gre v vrsto in koliko prostora ostane?

**Podatki:** ploščina ploščice $S = 50\,\text{cm}^2$, dolžina stene $d = 1\,\text{m} = 100\,\text{cm}$, ploščice so kvadratne, fug ni
**Iščemo:** število celih ploščic in preostanek prostora ob steni

:::formula
$s = \sqrt{S}$, $\;\sqrt{a^2 \cdot b} = a\sqrt{b}$ in $\;\dfrac{a}{\sqrt{b}} = \dfrac{a\sqrt{b}}{b}$
:::

**Rešitev:**

1. Kvadrat s ploščino $S$ ima stranico $\sqrt{S}$: $s = \sqrt{50} = \sqrt{25 \cdot 2} = 5\sqrt{2}\,\text{cm} \approx 7{,}07\,\text{cm}$.
2. Število ploščic je dolžina stene, deljena s stranico: $\dfrac{100}{5\sqrt{2}} = \dfrac{20}{\sqrt{2}}$.
3. Racionaliziramo, da namesto deljenja s korenom množimo: $\dfrac{20}{\sqrt{2}} = \dfrac{20\sqrt{2}}{2} = 10\sqrt{2} \approx 14{,}14$.
4. Celih ploščic je $14$. Zasedejo $14 \cdot 5\sqrt{2} = 70\sqrt{2} \approx 98{,}99\,\text{cm}$.
5. Ostane $100 - 70\sqrt{2} \approx 1{,}01\,\text{cm}$.
6. Odgovor: v vrsto gre $14$ celih ploščic. Ob koncu ostane približno $1\,\text{cm}$, ki ga zapolni odrezan kos ploščice.

### Primer 4: zdaj ti

Izračunaj in poenostavi: $\dfrac{\sqrt{3} + \sqrt{2}}{\sqrt{3} - \sqrt{2}} - \dfrac{\sqrt{3} - \sqrt{2}}{\sqrt{3} + \sqrt{2}}$.

**Podatki:** dan je izraz $\dfrac{\sqrt{3} + \sqrt{2}}{\sqrt{3} - \sqrt{2}} - \dfrac{\sqrt{3} - \sqrt{2}}{\sqrt{3} + \sqrt{2}}$ (brez dodatnih številskih podatkov)
**Iščemo:** vrednost izraza v najpreprostejši obliki

:::formula
$\left(\sqrt{a} \pm \sqrt{b}\right)^2 = a \pm 2\sqrt{ab} + b$ in $\;\left(\sqrt{a} - \sqrt{b}\right)\left(\sqrt{a} + \sqrt{b}\right) = a - b$
:::

**Rešitev:**

1. Prvi ulomek razširimo s $\sqrt{3} + \sqrt{2}$: imenovalec je $3 - 2 = 1$, števec pa $\left(\sqrt{3} + \sqrt{2}\right)^2 = 3 + 2\sqrt{6} + 2 = 5 + 2\sqrt{6}$. Prvi ulomek je torej $5 + 2\sqrt{6}$.
2. Drugi ulomek razširi sam, na enak način s $\sqrt{3} - \sqrt{2}$. Nato oba rezultata odštej in preveri s približki:

:::premisli
Kaj dobiš za drugi ulomek in kaj za celoten izraz?
---
Drugi ulomek: imenovalec je $3 - 2 = 1$, števec $\left(\sqrt{3} - \sqrt{2}\right)^2 = 3 - 2\sqrt{6} + 2 = 5 - 2\sqrt{6}$. Razlika: $\left(5 + 2\sqrt{6}\right) - \left(5 - 2\sqrt{6}\right) = 4\sqrt{6}$. Preverjanje: prvi ulomek je približno $9{,}899$, drugi $0{,}101$, razlika $9{,}798$, in $4\sqrt{6} \approx 9{,}798$.
:::

## Pogoste napake

- **Koren vsote kot vsota korenov.** Zapis $\sqrt{a + b} = \sqrt{a} + \sqrt{b}$ je napačen, saj pravilo velja le za produkt in količnik. Če je v korenu vsota, je ne smeš razdeliti. Preizkus: $\sqrt{9 + 16} = 5 \ne 7$.
- **$\sqrt{x^2} = x$.** To velja le za $x \ge 0$. Za $x = -3$ je $\sqrt{(-3)^2} = 3$. Pravilno: $\sqrt{x^2} = |x|$.
- **Seštevanje različnih korenov.** $2\sqrt{3} + 3\sqrt{5} = 5\sqrt{8}$ ni res. Seštejemo samo člene z enakim številom pod korenom. Najprej delno korenimo, nato šele ugotovimo, ali so istovrstni.
- **Napačen faktor pri racionalizaciji.** Pri $\dfrac{1}{\sqrt{5} - \sqrt{2}}$ ulomka ne smeš razširiti z $\sqrt{5} - \sqrt{2}$, ker dobiš $\left(\sqrt{5} - \sqrt{2}\right)^2 = 7 - 2\sqrt{10}$, ki še vedno vsebuje koren. Razširiti moraš z izrazom nasprotnega znaka $\sqrt{5} + \sqrt{2}$, da dobiš $5 - 2 = 3$.
- **Delno korenjenje do polovice.** $\sqrt{72} = 2\sqrt{18}$ drži, a ni končna oblika, ker je v $18$ še popolni kvadrat $9$. Izvleči moraš *največji* popolni kvadrat: $72 = 36 \cdot 2$, zato je $\sqrt{72} = 6\sqrt{2}$.

## Povzetek

- $\sqrt{a}$ je definiran za $a \ge 0$ in je nenegativen; $\left(\sqrt{a}\right)^2 = a$, $\sqrt{x^2} = |x|$.
- Za $a, b \ge 0$: $\sqrt{ab} = \sqrt{a}\sqrt{b}$ in $\sqrt{\dfrac{a}{b}} = \dfrac{\sqrt{a}}{\sqrt{b}}$ ($b > 0$); pri vsoti pravila ni: $\sqrt{a + b} \ne \sqrt{a} + \sqrt{b}$.
- Sodi koren negativnega števila ni realen; lihi koren je: $\sqrt[3]{-8} = -2$.
- Seštevamo samo istovrstne korene: $p\sqrt{b} + q\sqrt{b} = (p + q)\sqrt{b}$.
- Delno korenjenje: $\sqrt{a^2 b} = a\sqrt{b}$ za $a, b \ge 0$; izvleči moraš največji popolni kvadrat.
- Racionalizacija: $\dfrac{a}{\sqrt{b}} = \dfrac{a\sqrt{b}}{b}$.
- Konjugirani izraz: $\left(\sqrt{a} - \sqrt{b}\right)\left(\sqrt{a} + \sqrt{b}\right) = a - b$.

## Drugače: Na sliki

Kvadratni koren je **dolžina stranice kvadrata** z dano ploščino. Kvadrat s stranico $1\,\text{cm}$ ima ploščino $1\,\text{cm}^2$, njegova diagonala pa je po Pitagorovem izreku dolga $\sqrt{2}\,\text{cm}$. Kvadrat s ploščino $2\,\text{cm}^2$ ima stranico $\sqrt{2}\,\text{cm} \approx 1{,}41\,\text{cm}$.

Pravilo za produkt vidimo na pravokotniku s stranicama $\sqrt{2}$ in $\sqrt{3}$: njegova ploščina je $\sqrt{2} \cdot \sqrt{3}$, kar je enako ploščini kvadrata s stranico $\sqrt{6}$. Zato je $\sqrt{2}\sqrt{3} = \sqrt{6}$. Pri $\sqrt{6} \approx 2{,}449$ to tudi preveriš: $1{,}414 \cdot 1{,}732 \approx 2{,}449$.

Graf funkcije $y = \sqrt{x}$ leži v prvem kvadrantu. Začne se v izhodišču, nato pa vedno bolj počasi raste. Nekaj točk:

| $x$ | $y = \sqrt{x}$ |
|---|---|
| $0$ | $0$ |
| $1$ | $1$ |
| $4$ | $2$ |
| $9$ | $3$ |
| $16$ | $4$ |

Za negativen $x$ grafa ni, saj koren negativnega števila ni realen. Graf lahko preizkusiš v simulaciji spodaj (»Grafi korenskih funkcij«).

## Drugače: Kot zgodba

Mojster Tone in vajenka Maja delata kvadraten lesen okvir za gredico s stranico $1{,}2\,\text{m}$. Da se okvir ne bi zvil, bosta od vogala do vogala pribila diagonalno letev. Maja jo izmeri z metrom in dobi približno $1{,}70\,\text{m}$.

»Preveriva z računom,« reče Tone. »Po Pitagori je diagonala $\sqrt{1{,}2^2 + 1{,}2^2} = \sqrt{2 \cdot 1{,}2^2}$. Kvadrat je faktor, zato ga izvlečeš iz korena: diagonala je $1{,}2\sqrt{2} \approx 1{,}697\,\text{m}$.« Maja je zadela na centimeter natančno.

Za drugo gredico imata le letev, dolgo $1{,}2\,\text{m}$, ki naj bo ravno diagonala. Kolikšna je stranica? Iz enačbe $s\sqrt{2} = 1{,}2$ sledi $s = \dfrac{1{,}2}{\sqrt{2}}$. Maja se namršči, saj z $1{,}414$ na pamet ne zna deliti. Tone ulomek razširi s $\sqrt{2}$ in dobi $\dfrac{1{,}2\sqrt{2}}{2} = 0{,}6\sqrt{2}$. Zdaj je treba le množiti: $0{,}6 \cdot 1{,}414 \approx 0{,}85\,\text{m}$.

»Zato racionaliziramo,« pravi Tone. »Množiti je lažje kot deliti s korenom.«

## Drugače: Korak za korakom s številkami

**Delno korenjenje $\sqrt{180}$.**

1. Razstavi število pod korenom na praštevila: $180 = 2 \cdot 2 \cdot 3 \cdot 3 \cdot 5 = 2^2 \cdot 3^2 \cdot 5$.
2. Vsak par enakih praštevil gre ven iz korena kot eno število: $\sqrt{2^2 \cdot 3^2 \cdot 5} = 2 \cdot 3 \cdot \sqrt{5}$.
3. Rezultat je $6\sqrt{5}$.
4. Preverjanje: $\sqrt{180} \approx 13{,}416$ in $6\sqrt{5} \approx 6 \cdot 2{,}236 = 13{,}416$.

**Racionalizacija $\dfrac{7}{2\sqrt{5}}$.**

1. V imenovalcu je koren $\sqrt{5}$. Ulomek razširimo s $\sqrt{5}$, ne z $2\sqrt{5}$.
2. Števec: $7 \cdot \sqrt{5} = 7\sqrt{5}$. Imenovalec: $2\sqrt{5} \cdot \sqrt{5} = 2 \cdot 5 = 10$.
3. Rezultat: $\dfrac{7\sqrt{5}}{10}$.
4. Preverjanje: $\dfrac{7}{2 \cdot 2{,}236} \approx 1{,}565$ in $\dfrac{7 \cdot 2{,}236}{10} \approx 1{,}565$.

**Kubični koren $\sqrt[3]{54}$.** Najdemo popolni kub: $54 = 27 \cdot 2$, zato je $\sqrt[3]{54} = 3\sqrt[3]{2} \approx 3{,}78$.

## Drugače: Bolj natančno

**Zakaj velja pravilo za produkt?** Naj bo $a, b \ge 0$. Število $\sqrt{a}\sqrt{b}$ je nenegativno in njegov kvadrat je $\left(\sqrt{a}\sqrt{b}\right)^2 = \sqrt{a}^2 \cdot \sqrt{b}^2 = ab$. Edino nenegativno število s kvadratom $ab$ pa je po definiciji $\sqrt{ab}$, zato je $\sqrt{a}\sqrt{b} = \sqrt{ab}$.

**Zakaj je $\sqrt{x^2} = |x|$?** Število $\sqrt{x^2}$ je po definiciji nenegativno in ima kvadrat $x^2$. Za $x \ge 0$ ima ta lastnost število $x$, za $x < 0$ pa število $-x$. To je ravno definicija absolutne vrednosti.

**Zakaj konjugirani izraz deluje?** Pri produktu $(u - v)(u + v)$ se mešana člena uničita in ostane $u^2 - v^2$. Če vstavimo $u = \sqrt{a}$ in $v = \sqrt{b}$, kvadrata korenov izgineta in ostane racionalno število $a - b$.

**Zakaj je $\sqrt{2}$ iracionalen?** Denimo, da je $\sqrt{2} = \dfrac{p}{q}$ s tujima naravnima številoma $p$ in $q$ (nimata skupnega delitelja, večjega od $1$). Potem je $p^2 = 2q^2$, torej je $p^2$ sodo, zato je sodo tudi $p$. Zapišemo $p = 2r$ in dobimo $4r^2 = 2q^2$, torej $q^2 = 2r^2$ in je sodo tudi $q$. To je protislovje, saj $p$ in $q$ nista tuja.

## Preveri se

? Katera vrstica pravilno kaže vrednosti $\sqrt{x}$ za $x = 4$, $9$ in $16$ (v tem vrstnem redu)?
- $16$, $81$, $256$
~ To so kvadrati $x^2$. Koren je obratno: iščeš število, katerega kvadrat je $x$.
- $2$, $4{,}5$, $8$
~ To so polovice $\dfrac{x}{2}$. Koren števila $9$ je $3$, ker je $3^2 = 9$.
+ $2$, $3$, $4$
> $2^2 = 4$, $3^2 = 9$ in $4^2 = 16$, zato je $\sqrt{4} = 2$, $\sqrt{9} = 3$ in $\sqrt{16} = 4$.

? Oceni $5\sqrt{3}$ brez računala. Med katerima zaporednima celima številoma leži?
- med $3$ in $4$
~ Tako dobiš $\sqrt{15}$: faktor $5$ si vnesel pod koren brez kvadriranja. Pravilno je $5\sqrt{3} = \sqrt{25 \cdot 3} = \sqrt{75}$.
- med $15$ in $16$
~ Vzel si $\sqrt{3}$ kot $3$. V resnici je $\sqrt{3} \approx 1{,}73$.
+ med $8$ in $9$
> $5\sqrt{3} = \sqrt{75}$ in $8^2 = 64 < 75 < 81 = 9^2$, zato je $8 < 5\sqrt{3} < 9$ (natančneje $5\sqrt{3} \approx 8{,}66$).

? Zakaj ulomek $\dfrac{1}{\sqrt{5} - \sqrt{2}}$ razširimo s $\sqrt{5} + \sqrt{2}$ in ne s $\sqrt{5} - \sqrt{2}$?
- Ker se imenovalec poenostavi v $\sqrt{7}$.
~ Napačno je misliti, da je $\sqrt{5} + \sqrt{2}$ enako $\sqrt{7}$: vsota korenov ni koren vsote ($3{,}65$ proti $2{,}65$).
+ Ker zmnožek s $\sqrt{5} + \sqrt{2}$ da $5 - 2 = 3$ brez korena, kvadrat $\left(\sqrt{5} - \sqrt{2}\right)^2 = 7 - 2\sqrt{10}$ pa koren še ima.
- Ker se s tem vrednost ulomka poveča in je lažje računati.
~ Razširjanje vrednosti ne spremeni: ulomek množimo z $\dfrac{\sqrt{5} + \sqrt{2}}{\sqrt{5} + \sqrt{2}} = 1$.
> Konjugirani izraz da razliko kvadratov, v kateri korena izgineta: $\dfrac{1}{\sqrt{5} - \sqrt{2}} = \dfrac{\sqrt{5} + \sqrt{2}}{3}$.

? Kateri koren je enak $3\sqrt{5}$?
- $\sqrt{15}$
~ Faktor pred korenom pri vnašanju pod koren kvadriraš: $3 = \sqrt{9}$, ne $\sqrt{3}$.
+ $\sqrt{45}$
- $\sqrt{75}$
~ $\sqrt{75} = \sqrt{25 \cdot 3} = 5\sqrt{3}$: zamenjal si število pred korenom in pod njim.
> $3\sqrt{5} = \sqrt{9} \cdot \sqrt{5} = \sqrt{45}$. Preizkus z delnim korenjenjem: $\sqrt{45} = \sqrt{9 \cdot 5} = 3\sqrt{5}$.

? Mizar izdeluje kvadratno desko za stolček s stranico $30\,\text{cm}$. Kako dolga je njena diagonala?
- $60\,\text{cm}$
~ Diagonala ni vsota stranic. Po Pitagori je $\sqrt{30^2 + 30^2}$, koren vsote pa ni vsota korenov.
- $\sqrt{60}\,\text{cm} \approx 7{,}7\,\text{cm}$
~ Pod koren gredo kvadrata stranic, ne stranici: $30^2 + 30^2 = 1800$.
+ $30\sqrt{2}\,\text{cm} \approx 42{,}4\,\text{cm}$
- $900\sqrt{2}\,\text{cm}$
~ Iz korena izvlečeš $\sqrt{900} = 30$, ne $900$.
> $\sqrt{30^2 + 30^2} = \sqrt{900 \cdot 2} = 30\sqrt{2} \approx 42{,}4\,\text{cm}$.

:::simboli
a | korenjenec; pri delnem korenjenju faktor pred korenom | | | a ≥ 0 pri kvadratnem korenu
n, m | korenski eksponent | | | naravno število, n ≥ 2
b | korenjenec (faktor pod korenom) | | | b > 0 pri deljenju
x | realno število | | | koren iz x² je absolutna vrednost x
p, q | koeficienta pred istim korenom | | |
S | ploščina ploščice | | cm^2 |
s | stranica kvadrata | s = \sqrt{S} | cm |
d | dolžina stene | | cm |
:::
