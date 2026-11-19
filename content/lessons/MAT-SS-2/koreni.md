---
stanje: preverjeno
demo: koren
avtor: AI
---

## Zakaj se tega učimo

Vzemi kvadratni list origami papirja ali kvadratno keramično ploščico in z ravnilom izmeri stranico in diagonalo. List s stranico $15\,\text{cm}$ ima diagonalo približno $21{,}2\,\text{cm}$. Ploščica s stranico $20\,\text{cm}$ ima diagonalo približno $28{,}3\,\text{cm}$. Deli diagonalo s stranico: obakrat dobiš približno $1{,}41$.

Po Pitagorovem izreku je diagonala lista dolga $\sqrt{15^2 + 15^2} = \sqrt{450}\,\text{cm}$. Zakaj je potem $\sqrt{450}$ ravno $15$-krat večji od $\sqrt{2} \approx 1{,}41$? Odgovor da pravilo za računanje s koreni, ki ga boš spodaj odkril sam. Z njim mizar ali keramičar iz $\sqrt{450}$ naredi $15\sqrt{2}$ in dolžino oceni na pamet.

Spoznal boš še **delno korenjenje** in **racionalizacijo**. Potreboval ju boš pri kvadratnih enačbah, pri diagonalah in višinah v geometriji ter pri razdaljah v koordinatnem sistemu.

## Razlaga

**1. Kvadratni koren.** Za $a \ge 0$ je $\sqrt{a}$ **nenegativno** število, katerega kvadrat je $a$. Pogoj $a \ge 0$ je nujen: v realnih številih ne obstaja kvadratni koren negativnega števila. Velja

$$\left(\sqrt{a}\right)^2 = a \quad (a \ge 0), \qquad \sqrt{x^2} = |x| \quad (x \in \mathbb{R}).$$

Zato je $\sqrt{(-3)^2} = \sqrt{9} = 3 = |-3|$ in ne $-3$.

**2. n-ti koren.** Za naravno število $n \ge 2$ je $\sqrt[n]{a}$ tisto število $b$, za katero velja $b^n = a$. Število $n$ je **korenski eksponent**, število $a$ pod korenom pa **korenjenec**. Pri **sodem** $n$ mora biti $a \ge 0$ in je koren po dogovoru nenegativen. Pri **lihem** $n$ je koren definiran tudi za negativne $a$: $\sqrt[3]{-27} = -3$, ker je $(-3)^3 = -27$. Korenu $\sqrt[3]{a}$ pravimo kubični koren.

**3. Odkrij vzorec.** Zmnožek korenov izračunaj na dva načina: najprej vsak koren posebej, nato en koren iz zmnožka.

| Zmnožek | Posebej | En koren |
|---|---|---|
| $\sqrt{4} \cdot \sqrt{9}$ | $2 \cdot 3$ | $\sqrt{36}$ |
| $\sqrt{4} \cdot \sqrt{25}$ | $2 \cdot 5$ | $\sqrt{100}$ |
| $\sqrt{2} \cdot \sqrt{225}$ | $1{,}414 \cdot 15$ | $\sqrt{450}$ |

Vsakič dobiš isto: v prvi vrstici $6$, v drugi $10$, v zadnji pa sta oba izraza približno $21{,}21$. Zadnja vrstica je diagonala lista iz uvoda: $\sqrt{450} = \sqrt{225} \cdot \sqrt{2} = 15\sqrt{2}$.

**Pravila za računanje.** Vzorec velja v splošnem. Za $a, b \ge 0$ (in $b > 0$ pri deljenju) veljajo:

- $\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}$, primer: $\sqrt{3} \cdot \sqrt{12} = \sqrt{36} = 6$;
- $\sqrt{\dfrac{a}{b}} = \dfrac{\sqrt{a}}{\sqrt{b}}$, primer: $\sqrt{\dfrac{25}{4}} = \dfrac{5}{2}$;
- $\sqrt[n]{a \cdot b} = \sqrt[n]{a} \cdot \sqrt[n]{b}$, primer: $\sqrt[3]{2} \cdot \sqrt[3]{4} = \sqrt[3]{8} = 2$;
- $\sqrt[m]{\sqrt[n]{a}} = \sqrt[m \cdot n]{a}$, primer: $\sqrt{\sqrt{16}} = \sqrt[4]{16} = 2$.

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

Razširitev je dovoljena, ker ulomek množimo z $1$, na primer s $\dfrac{\sqrt{b}}{\sqrt{b}}$. Konjugirani izraz deluje tudi, kadar je le eden od členov koren: $\dfrac{3}{2 + \sqrt{3}} = \dfrac{3\left(2 - \sqrt{3}\right)}{4 - 3} = 6 - 3\sqrt{3}$. Preverjanje: leva stran je $\dfrac{3}{3{,}732} \approx 0{,}804$, desna $6 - 5{,}196 = 0{,}804$.

:::premisli
S čim razširiš ulomek $\dfrac{1}{\sqrt[3]{2}}$, da v imenovalcu ne bo več korena? Namig: pod kubičnim korenom mora nastati popolni kub.
---
S $\sqrt[3]{4}$, ker je $\sqrt[3]{2} \cdot \sqrt[3]{4} = \sqrt[3]{8} = 2$. Torej je $\dfrac{1}{\sqrt[3]{2}} = \dfrac{\sqrt[3]{4}}{2}$. Razširitev s $\sqrt[3]{2}$ ne zadošča, ker je $\sqrt[3]{2} \cdot \sqrt[3]{2} = \sqrt[3]{4}$ še vedno koren.
:::

**7. Konstrukcija kvadratnih korenov.** Kvadratni koren naravnega števila, ki ni popolni kvadrat, je iracionalen: $\sqrt{2}$, $\sqrt{3}$, $\sqrt{5}$, $\sqrt{13}$ (dokaz je podoben kot za $\sqrt{2}$ v razdelku »Bolj natančno«). Njihove decimalke se nikoli ne končajo, daljico take dolžine pa vseeno narišemo natančno, z ravnilom in šestilom. Pomaga Pitagorov izrek.

- **Koren kot hipotenuza.** Kateti $p$ in $q$ dasta hipotenuzo $\sqrt{p^2 + q^2}$. Kateti $1$ in $1$ dasta $\sqrt{2}$, kateti $1$ in $2$ dasta $\sqrt{5}$, kateti $2$ in $3$ dasta $\sqrt{13}$.
- **Spirala.** Na hipotenuzo $\sqrt{n}$ postavimo pravokotno kateto $1$. Nova hipotenuza je $\sqrt{n + 1}$, saj je $\left(\sqrt{n}\right)^2 + 1^2 = n + 1$. Tako dobimo po vrsti $\sqrt{2}$, $\sqrt{3}$, $\sqrt{4} = 2$, $\sqrt{5}$ in naprej (risba).
- **Koren kot kateta.** Hipotenuza $h$ in kateta $p$ dasta drugo kateto $\sqrt{h^2 - p^2}$. Hipotenuza $2$ in kateta $1$ dasta $\sqrt{3}$.

:::risba skica
opis: Polžasta spirala iz štirih pravokotnih trikotnikov s skupnim ogliščem O. Prvi ima obe kateti dolgi 1. Vsak naslednji ima za eno kateto hipotenuzo prejšnjega, druga kateta dolžine 1 je pravokotna nanjo. Hipotenuze iz O merijo po vrsti √2, √3, 2 in √5; dolžina je napisana ob zunanjem krajišču vsake.
območje: -2,1; -0,4 .. 1,6; 2,3
enota: 80
lik: 0; 0 -> 1; 0 -> 1; 1 | modra
lik: 0; 0 -> 1; 1 -> 0,293; 1,707 | modra
lik: 0; 0 -> 0,293; 1,707 -> -0,693; 1,876 | modra
lik: 0; 0 -> -0,693; 1,876 -> -1,631; 1,53 | modra
pravikot: 1; 0 | 0; 0 | 1; 1
pravikot: 1; 1 | 0; 0 | 0,293; 1,707
pravikot: 0,293; 1,707 | 0; 0 | -0,693; 1,876
pravikot: -0,693; 1,876 | 0; 0 | -1,631; 1,53
točka: 0; 0 | O | pod
napis: 0,5; 0 | 1 | pod
napis: 1; 0,5 | 1 | desno
točka: 1; 1 | √2 | desno
točka: 0,293; 1,707 | √3 | nad desno
točka: -0,693; 1,876 | 2 | nad
točka: -1,631; 1,53 | √5 | levo
:::

Narisano dolžino prenesemo na številsko premico: šestilo zapičimo v $0$ in odmerimo hipotenuzo. Tako dobimo točko $\sqrt{5}$ med $2$ in $3$, natančno, brez zaokroževanja.

**8. Kubični in n-ti koreni z računalom.** Kubične korene popolnih kubov računamo na pamet. Zapomni si kube $1$, $8$, $27$, $64$, $125$, $216$, $343$, $512$, $729$, $1000$. Z njimi je $\sqrt[3]{343} = 7$, $\sqrt[3]{-64} = -4$, $\sqrt[3]{0{,}008} = 0{,}2$ (ker je $0{,}2^3 = 0{,}008$) in $\sqrt[3]{\dfrac{27}{125}} = \dfrac{3}{5}$.

Kadar korenjenec ni popolni kub, uporabimo računalo. Tipke so na različnih računalih različno označene (druga funkcija je dosegljiva s SHIFT ali 2nd), vse pa naredijo isto:

- tipka za kubični koren $\sqrt[3]{\square}$: $\sqrt[3]{50} \approx 3{,}684$;
- tipka za $n$-ti koren $\sqrt[\square]{\square}$: najprej vtipkaš korenski eksponent, nato korenjenec, na primer $\sqrt[5]{200} \approx 2{,}885$;
- potenca z eksponentom $\frac{1}{n}$ (velja $a^{\frac{1}{n}} = \sqrt[n]{a}$, podrobneje v lekciji o potencah z racionalnimi eksponenti): koren $\sqrt[5]{200}$ vtipkaš kot `200 ^ (1 ÷ 5)`. Oklepaj je nujen, brez njega računalo izračuna $200^1 : 5 = 40$.

Lihi koren negativnega števila je realen: $\sqrt[3]{-20} \approx -2{,}714$. Nekatera računala pri potenci $(-20)^{1/3}$ javijo napako, tedaj izračunaš $-\sqrt[3]{20}$. Sodi koren negativnega števila računalo zavrne z napako, ker ni realen.

Rezultat računala vedno preveri: s potenciranjem ($3{,}684^3 \approx 50{,}0$) in z oceno ($27 < 50 < 64$, zato je $\sqrt[3]{50}$ med $3$ in $4$).

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

### Primer 5: konstrukcija korenov

Z ravnilom, trikotnikom in šestilom nariši daljici, dolgi $\sqrt{13}\,\text{cm}$ in $\sqrt{7}\,\text{cm}$.

**Podatki:** dolžini $\sqrt{13}\,\text{cm}$ in $\sqrt{7}\,\text{cm}$; orodje: ravnilo, trikotnik (za pravi kot) in šestilo
**Iščemo:** konstrukcijo obeh daljic

:::formula
Hipotenuza s katetama $p$ in $q$ meri $\sqrt{p^2 + q^2}$; kateta pri hipotenuzi $h$ in drugi kateti $p$ meri $\sqrt{h^2 - p^2}$.
:::

**Rešitev:**

1. Število $13$ zapišemo kot vsoto kvadratov: $13 = 4 + 9 = 2^2 + 3^2$. Zato je $\sqrt{13}$ hipotenuza trikotnika s katetama $2\,\text{cm}$ in $3\,\text{cm}$.
2. Nariši daljico $3\,\text{cm}$, v enem krajišču s trikotnikom pravokotnico in na njej odmeri $2\,\text{cm}$. Zveznica prostih krajišč meri $\sqrt{13}\,\text{cm} \approx 3{,}61\,\text{cm}$.
3. Število $7$ ni vsota dveh kvadratov celih števil, je pa razlika: $7 = 16 - 9 = 4^2 - 3^2$. Zato je $\sqrt{7}$ kateta trikotnika s hipotenuzo $4\,\text{cm}$ in kateto $3\,\text{cm}$.
4. Nariši daljico $3\,\text{cm}$ in v enem krajišču pravokotnico. Šestilo odpri na $4\,\text{cm}$, ga zapiči v drugo krajišče daljice in zareži pravokotnico. Odsek pravokotnice do zareze meri $\sqrt{16 - 9} = \sqrt{7}\,\text{cm} \approx 2{,}65\,\text{cm}$.
5. Odgovor: $\sqrt{13}$ je hipotenuza trikotnika s katetama $2$ in $3$, $\sqrt{7}$ je kateta trikotnika s hipotenuzo $4$ in kateto $3$ (v centimetrih). Z ravnilom izmeriš približno $3{,}6\,\text{cm}$ in $2{,}6\,\text{cm}$.

### Primer 6: na pamet in z računalom

a) Na pamet izračunaj $\sqrt[3]{-0{,}125}$ in $\sqrt[3]{\dfrac{8}{27}}$. b) Z računalom izračunaj $\sqrt[3]{-20}$ in $\sqrt[4]{500}$ na tri decimalke in rezultata preveri. c) Naložba v sklad v $5$ letih zraste za $30\,\%$. Vsako leto se pomnoži z istim faktorjem $q$. Kolikšen je $q$?

**Podatki:** korenjenci $-0{,}125$; $\dfrac{8}{27}$; $-20$ in $500$; rast naložbe za $30\,\%$ (faktor $1{,}3$) v $5$ letih
**Iščemo:** vrednosti korenov in letni faktor $q$

:::formula
$b = \sqrt[n]{a}$ pomeni $b^n = a$; na računalu tipka $\sqrt[\square]{\square}$ ali potenca z eksponentom $\frac{1}{n}$
:::

**Rešitev:**

1. a) $(-0{,}5)^3 = -0{,}125$, zato je $\sqrt[3]{-0{,}125} = -0{,}5$. Ker je $2^3 = 8$ in $3^3 = 27$, je $\sqrt[3]{\dfrac{8}{27}} = \dfrac{2}{3}$.
2. b) Računalo da $\sqrt[3]{-20} \approx -2{,}714$. Preverjanje: $(-2{,}714)^3 \approx -19{,}99$, ocena pa $-27 < -20 < -8$, zato je koren med $-3$ in $-2$.
3. b) S tipko za $n$-ti koren (najprej $4$, nato $500$) dobimo $\sqrt[4]{500} \approx 4{,}729$. Preverjanje: $4{,}729^4 \approx 500{,}1$; ker je $4^4 = 256$ in $5^4 = 625$, je koren med $4$ in $5$.
4. c) V petih letih se vloga pomnoži s $q^5$, zato velja enačba $q^5 = 1{,}3$ in $q = \sqrt[5]{1{,}3} \approx 1{,}0539$.
5. Odgovor: a) $-0{,}5$ in $\dfrac{2}{3}$; b) $\sqrt[3]{-20} \approx -2{,}714$ in $\sqrt[4]{500} \approx 4{,}729$; c) $q \approx 1{,}054$. Naložba vsako leto zraste za približno $5{,}4\,\%$, ne za $30\,\% : 5 = 6\,\%$.

## Pogoste napake

- **Koren vsote kot vsota korenov.** Zapis $\sqrt{a + b} = \sqrt{a} + \sqrt{b}$ je napačen, saj pravilo velja le za produkt in količnik. Če je v korenu vsota, je ne smeš razdeliti. Preizkus: $\sqrt{9 + 16} = 5 \ne 7$.
- **$\sqrt{x^2} = x$.** To velja le za $x \ge 0$. Za $x = -3$ je $\sqrt{(-3)^2} = 3$. Pravilno: $\sqrt{x^2} = |x|$.
- **Seštevanje različnih korenov.** $2\sqrt{3} + 3\sqrt{5} = 5\sqrt{8}$ ni res. Seštejemo samo člene z enakim številom pod korenom. Najprej delno korenimo, nato šele ugotovimo, ali so istovrstni.
- **Napačen faktor pri racionalizaciji.** Pri $\dfrac{1}{\sqrt{5} - \sqrt{2}}$ ulomka ne smeš razširiti s $\sqrt{5} - \sqrt{2}$, ker dobiš $\left(\sqrt{5} - \sqrt{2}\right)^2 = 7 - 2\sqrt{10}$, ki še vedno vsebuje koren. Razširiti moraš z izrazom nasprotnega znaka $\sqrt{5} + \sqrt{2}$, da dobiš $5 - 2 = 3$.
- **Delno korenjenje do polovice.** $\sqrt{72} = 2\sqrt{18}$ drži, a ni končna oblika, ker je v $18$ še popolni kvadrat $9$. Izvleči moraš *največji* popolni kvadrat: $72 = 36 \cdot 2$, zato je $\sqrt{72} = 6\sqrt{2}$.

## Povzetek

- $\sqrt{a}$ je definiran za $a \ge 0$ in je nenegativen.

$$\left(\sqrt{a}\right)^2 = a, \quad \sqrt{x^2} = |x|$$

**Pravila** za $a, b \ge 0$ (pri ulomku $b > 0$):

$$\sqrt{ab} = \sqrt{a}\,\sqrt{b}$$

$$\sqrt{\frac{a}{b}} = \frac{\sqrt{a}}{\sqrt{b}}$$

Pri vsoti pravila ni:

$$\sqrt{a + b} \ne \sqrt{a} + \sqrt{b}$$

- **Sodi koren** negativnega števila ni realen; **lihi** je: $\sqrt[3]{-8} = -2$.

**Seštevaš samo istovrstne korene:**

$$p\sqrt{b} + q\sqrt{b} = (p + q)\sqrt{b}$$

**Delno korenjenje** ($a, b \ge 0$); izvleči moraš največji popolni kvadrat:

$$\sqrt{a^2 b} = a\sqrt{b}$$

**Racionalizacija:**

$$\frac{a}{\sqrt{b}} = \frac{a\sqrt{b}}{b}$$

**Konjugirani izraz:**

$$\left(\sqrt{a} - \sqrt{b}\right)\left(\sqrt{a} + \sqrt{b}\right) = a - b$$

- Daljico $\sqrt{n}$ konstruiraš s Pitagorovim izrekom: kot hipotenuzo $\sqrt{p^2 + q^2}$ ali kot kateto $\sqrt{h^2 - p^2}$.
- Na računalu: tipka za $n$-ti koren ali potenca $a^{1/n}$ z eksponentom v oklepaju; rezultat preveri s potenciranjem.

## Ponovitev

**Formule**
- $\sqrt{x^2} = |x|$, $\;\left(\sqrt{a}\right)^2 = a$ (na pamet)
- $\sqrt{ab} = \sqrt{a}\sqrt{b}$, $\;\sqrt{\dfrac{a}{b}} = \dfrac{\sqrt{a}}{\sqrt{b}}$ za $a, b \ge 0$ (pri ulomku $b > 0$) (na pamet)
- $p\sqrt{b} + q\sqrt{b} = (p + q)\sqrt{b}$ (na pamet)
- $\sqrt{a^2 b} = a\sqrt{b}$ za $a, b \ge 0$ (na pamet)
- $\dfrac{a}{\sqrt{b}} = \dfrac{a\sqrt{b}}{b}$ (na pamet)
- $\left(\sqrt{a} - \sqrt{b}\right)\left(\sqrt{a} + \sqrt{b}\right) = a - b$ (na pamet)

**Postopek**
1. Delno koreni: izvleči največji popolni kvadrat.
2. Seštej istovrstne korene.
3. Racionaliziraj imenovalec: razširi s korenom ali s konjugiranim izrazom.
4. Rezultat preveri s potenciranjem ali na računalu.

**Pazi na**
- $\sqrt{a + b} \ne \sqrt{a} + \sqrt{b}$: pravilo velja le za produkt in količnik.
- Seštevaš le korene z enakim številom pod korenom; najprej delno koreni.
- Pri $\sqrt{a} - \sqrt{b}$ v imenovalcu razširi s $\sqrt{a} + \sqrt{b}$.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Izračunajte in rezultat zapišite čim preprosteje: $\sqrt{48} + \dfrac{9}{\sqrt{3}} - \sqrt{75}$.

**Rešitev:**

1. Delno korenimo: $\sqrt{48} = \sqrt{16 \cdot 3} = 4\sqrt{3}$ in $\sqrt{75} = \sqrt{25 \cdot 3} = 5\sqrt{3}$.
2. Racionaliziramo: $\dfrac{9}{\sqrt{3}} = \dfrac{9\sqrt{3}}{3} = 3\sqrt{3}$.
3. Seštejemo istovrstne korene: $4\sqrt{3} + 3\sqrt{3} - 5\sqrt{3} = 2\sqrt{3}$.
4. Odgovor: $2\sqrt{3}$.

**Točkovanje:** 1 točka za delno korenjenje obeh korenov, 1 točka za racionalizacijo $\dfrac{9}{\sqrt{3}} = 3\sqrt{3}$, 1 točka za rezultat $2\sqrt{3}$.

### Naloga 2: krajša strukturirana naloga, 6 točk, pola 2 (z računalom)

Kocka ima prostornino $V = 128\,\text{cm}^3$.

a) Zapišite enačbo za rob $c$ kocke in iz nje izrazite $c$ natančno, z delno korenjenim kubičnim korenom. (2 točki)
b) Izračunajte rob $c$ in diagonalo ploskve kocke $D = c\sqrt{2}$. Rezultata zaokrožite na dve decimalni mesti. (2 točki)
c) Izračunajte natančno prostornino kocke, katere rob je dolg $D$, in jo nato zaokrožite na cele kubične centimetre. (2 točki)

**Rešitev:**

1. a) $c^3 = 128$. Eksponent $3$ je lih, zato ima enačba natanko eno realno rešitev $c = \sqrt[3]{128}$.
2. a) $128 = 64 \cdot 2 = 4^3 \cdot 2$, zato je $c = \sqrt[3]{4^3 \cdot 2} = 4\sqrt[3]{2}\,\text{cm}$.
3. b) Z računalom (tipka za $n$-ti koren ali potenca $128^{1/3}$): $c \approx 5{,}039684$, torej $c \approx 5{,}04\,\text{cm}$.
4. b) $D = c\sqrt{2} \approx 5{,}039684 \cdot 1{,}414214 \approx 7{,}127190$, torej $D \approx 7{,}13\,\text{cm}$.
5. c) $D^3 = \left(c\sqrt{2}\right)^3 = c^3 \cdot \left(\sqrt{2}\right)^3 = 128 \cdot 2\sqrt{2} = 256\sqrt{2}\,\text{cm}^3$.
6. c) $256\sqrt{2} \approx 362{,}0387$, torej približno $362\,\text{cm}^3$.
7. Odgovor: $c = 4\sqrt[3]{2}\,\text{cm} \approx 5{,}04\,\text{cm}$; $D \approx 7{,}13\,\text{cm}$; prostornina večje kocke je $256\sqrt{2}\,\text{cm}^3 \approx 362\,\text{cm}^3$.

**Točkovanje:** a) 1 točka za enačbo $c^3 = 128$, 1 točka za $c = 4\sqrt[3]{2}\,\text{cm}$; b) 1 točka za $c \approx 5{,}04\,\text{cm}$ in 1 točka za $D \approx 7{,}13\,\text{cm}$; c) 1 točka za natančno vrednost $256\sqrt{2}\,\text{cm}^3$ in 1 točka za zaokroženo vrednost $362\,\text{cm}^3$.

### Ustno vprašanje 1

:::premisli
Pod kakšnimi pogoji obstaja $n$-ti koren realnega števila $a$ in koliko realnih rešitev ima enačba $x^n = a$?
---
Pri sodem korenskem eksponentu $n$ je $\sqrt[n]{a}$ definiran le za $a \ge 0$ in je po dogovoru nenegativen. Zato ima enačba $x^n = a$ pri sodem $n$ dve rešitvi $\pm\sqrt[n]{a}$, če je $a > 0$, eno rešitev $0$, če je $a = 0$, in nobene realne rešitve, če je $a < 0$. Pri lihem $n$ je $\sqrt[n]{a}$ definiran za vsako realno število $a$, tudi za negativno. Enačba $x^n = a$ ima pri lihem $n$ natanko eno realno rešitev $x = \sqrt[n]{a}$.
:::

### Ustno vprašanje 2

:::premisli
Kaj pomeni racionalizirati imenovalec ulomka in kako to naredimo, kadar je v imenovalcu razlika dveh kvadratnih korenov?
---
Racionalizirati imenovalec pomeni ulomek preoblikovati v enak ulomek, ki v imenovalcu nima korena. Ulomek razširimo, torej števec in imenovalec pomnožimo z istim izrazom, zato se njegova vrednost ne spremeni. Pri imenovalcu $\sqrt{a} - \sqrt{b}$ razširimo s konjugiranim izrazom $\sqrt{a} + \sqrt{b}$. Po razliki kvadratov je $\left(\sqrt{a} - \sqrt{b}\right)\left(\sqrt{a} + \sqrt{b}\right) = a - b$, kar ne vsebuje več korena.
:::

### Ustno vprašanje 3

:::premisli
Dokaži, da je število $\sqrt{2}$ iracionalno, torej ga ne moremo zapisati kot ulomek.
---
Denimo nasprotno, da je $\sqrt{2} = \frac{p}{q}$, kjer sta $p$ in $q$ tuji naravni števili. S kvadriranjem dobimo $p^2 = 2q^2$, zato je $p^2$ sodo število in je sodo tudi $p$, saj je kvadrat lihega števila lih. Zapišemo $p = 2r$ in dobimo $4r^2 = 2q^2$, torej $q^2 = 2r^2$, zato je sodo tudi $q$. Števili $p$ in $q$ sta tedaj obe sodi, kar nasprotuje predpostavki, da sta tuji, zato $\sqrt{2}$ ni racionalno število.
:::

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
- $2$; $4{,}5$; $8$
~ To so polovice $\dfrac{x}{2}$. Koren števila $9$ je $3$, ker je $3^2 = 9$.
+ $2$, $3$, $4$
> $2^2 = 4$, $3^2 = 9$ in $4^2 = 16$, zato je $\sqrt{4} = 2$, $\sqrt{9} = 3$ in $\sqrt{16} = 4$.

? Oceni $5\sqrt{3}$ brez računala. Med katerima zaporednima celima številoma leži?
- med $3$ in $4$
~ Tako dobiš $\sqrt{15}$: faktor $5$ si vnesel pod koren brez kvadriranja. Pravilno je $5\sqrt{3} = \sqrt{25 \cdot 3} = \sqrt{75}$.
- med $6$ in $7$
~ Seštel si $5 + \sqrt{3} \approx 6{,}73$. Zapis $5\sqrt{3}$ pomeni produkt $5 \cdot \sqrt{3}$.
+ med $8$ in $9$
> $5\sqrt{3} = \sqrt{75}$ in $8^2 = 64 < 75 < 81 = 9^2$, zato je $8 < 5\sqrt{3} < 9$ (natančneje $5\sqrt{3} \approx 8{,}66$).

? Zakaj ulomek $\dfrac{1}{\sqrt{5} - \sqrt{2}}$ razširimo s $\sqrt{5} + \sqrt{2}$ in ne s $\sqrt{5} - \sqrt{2}$?
- Ker se imenovalec poenostavi v $\sqrt{7}$.
~ Napačno je misliti, da je $\sqrt{5} + \sqrt{2}$ enako $\sqrt{7}$: vsota korenov ni koren vsote ($3{,}65$ proti $2{,}65$).
+ Ker zmnožek s $\sqrt{5} + \sqrt{2}$ da $5 - 2 = 3$ brez korena, kvadrat $\left(\sqrt{5} - \sqrt{2}\right)^2 = 7 - 2\sqrt{10}$ pa koren še ima.
- Ker se s tem vrednost ulomka poveča in je lažje računati.
~ Razširjanje vrednosti ne spremeni: ulomek množimo s $\dfrac{\sqrt{5} + \sqrt{2}}{\sqrt{5} + \sqrt{2}} = 1$.
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

? (brez računala) Za konstrukcijo daljice $\sqrt{n}$ narišeš pravokotni trikotnik s katetama $1$ in $4$. Njegova hipotenuza meri $\sqrt{n}$. Koliko je $n$?
= 17 | 0
~ 5 | Seštel si kateti, $1 + 4$. Po Pitagorovem izreku pod koren gresta kvadrata katet.
~ 15 | Odštel si kvadrata, $16 - 1$. Tako dobiš kateto trikotnika s hipotenuzo $4$, ne hipotenuze.
> Hipotenuza je $\sqrt{1^2 + 4^2} = \sqrt{17}$, torej $n = 17$.

? Z računalom izračunaj $\sqrt[5]{300}$ in rezultat zaokroži na dve decimalni mesti.
= 3,13
~ 60 | Vtipkal si 300 ^ 1 ÷ 5 brez oklepaja, zato je računalo izračunalo $300 : 5$. Eksponent $\frac{1}{5}$ mora biti v oklepaju.
~ 17,32 | To je kvadratni koren $\sqrt{300}$. Pri tipki za $n$-ti koren najprej vneseš korenski eksponent $5$.
> $\sqrt[5]{300} \approx 3{,}129$, zaokroženo $3{,}13$. Preverjanje: $3{,}129^5 \approx 300$, ocena: $3^5 = 243 < 300 < 1024 = 4^5$.

<<RACUN
enako: sqrt(48) | 4*sqrt(3)
enako: sqrt(75) | 5*sqrt(3)
enako: 9/sqrt(3) | 3*sqrt(3)
enako: sqrt(48)+9/sqrt(3)-sqrt(75) | 2*sqrt(3)
resi: c^3=128 | c | 4*2^(1/3)
enako: 128^(1/3) | 4*2^(1/3)
vrednost: 128^(1/3) | 5.04
vrednost: 128^(1/3)*sqrt(2) | 7.13
enako: (4*2^(1/3)*sqrt(2))^3 | 256*sqrt(2)
vrednost: 256*sqrt(2) | 362.04
enako: sqrt(2^2+3^2) | sqrt(13)
enako: sqrt(4^2-3^2) | sqrt(7)
vrednost: sqrt(13) | 3.61
vrednost: sqrt(7) | 2.65
vrednost: 50^(1/3) | 3.684
vrednost: 200^(1/5) | 2.885
vrednost: 300^(1/5) | 3.13
vrednost: 3.129^5 | 299.94
enako: (-1/2)^3 | -1/8
enako: (2/3)^3 | 8/27
vrednost: -(20^(1/3)) | -2.714
vrednost: 500^(1/4) | 4.729
vrednost: 1.3^(1/5) | 1.0539
enako: 1^2+4^2 | 17
>>

:::simboli
a | korenjenec; pri delnem korenjenju faktor pred korenom, pri racionalizaciji števec ulomka | | | a ≥ 0 pri kvadratnem korenu
n, m | korenski eksponent | | | naravno število, n ≥ 2; pri konstrukciji korenov (spirala, vprašanje) je $n$ število pod korenom $\sqrt{n}$
b | korenjenec (faktor pod korenom) | | | b > 0 pri deljenju; v definiciji $n$-tega korena in v primeru 6 vrednost korena, $b^n = a$
x | realno število | | | koren iz x² je absolutna vrednost x
p, q | koeficienta pred istim korenom | | | v dokazu iracionalnosti števila $\sqrt{2}$ števec in imenovalec ulomka; pri konstrukciji korenov kateti; v primeru 6 je $q$ letni faktor rasti
h | hipotenuza pri konstrukciji korena | | cm |
S | ploščina ploščice | | cm^2 |
s | stranica kvadrata | s = \sqrt{S} | cm |
d | dolžina stene | | cm |
V | prostornina kocke | V = c^3 | cm^3 |
c | rob kocke | c = \sqrt[3]{V} | cm |
D | diagonala ploskve kocke | D = c\sqrt{2} | cm |
:::
