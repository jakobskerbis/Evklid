---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Ob polni Luni prilepi kovanec za $2\,\text{€}$ (premer približno $2{,}5\,\text{cm}$) na okno in se odmikaj od njega. Pri približno $275\,\text{cm}$ od očesa kovanec natanko prekrije Luno. Luna je od nas oddaljena $384\,000\,\text{km}$. Kako velika je? Do nje ne moreš z metrom, pa vendar boš odgovor izračunal v treh vrsticah.

Pri tem uporabiš nekaj, kar že znaš: razmerje in sorazmerje, na primer $\dfrac{x}{12} = \dfrac{3}{4}$, vsoto notranjih kotov trikotnika $180^\circ$ in Pitagorov izrek.

Podobnost razširi to znanje. Dva lika sta podobna, če imata enako obliko, velikost pa je lahko različna. S podobnostjo izračunaš velikost stvari, ki je ne moreš izmeriti neposredno, na primer premer Lune, bere pa se tudi zemljevid ali načrt. Iz podobnih trikotnikov izpeljemo še dva izreka o pravokotnem trikotniku, **Evklidov** in **višinski izrek**. Z njima računamo odseke hipotenuze in višino, Pitagorov izrek pa dobimo kot posledico.

## Razlaga

**1. Podobna trikotnika.** Trikotnika $ABC$ in $A'B'C'$ sta **podobna**, kar zapišemo $\triangle ABC \sim \triangle A'B'C'$, če velja:

- ustrezni koti so enaki: $\alpha = \alpha'$, $\beta = \beta'$, $\gamma = \gamma'$,
- razmerja ustreznih stranic so enaka:
$$\frac{a'}{a} = \frac{b'}{b} = \frac{c'}{c} = k$$

Število $k$ je **koeficient podobnosti**. Če je $k > 1$, je drugi trikotnik večji, če je $k < 1$, je manjši. Pri $k = 1$ sta trikotnika skladna.

Podobnost najlažje razumeš ob **skladnosti**, ki jo poznaš iz osnovne šole. Razlika je ena sama: pri skladnih trikotnikih so stranice *enake*, pri podobnih so le *v istem razmerju*.

| | Skladna | Podobna |
|---|---|---|
| koti | enaki | enaki |
| stranice | enake | $k$-krat daljše |
| ploščina | enaka | $k^2$-krat večja |
| zapis | $\cong$ | $\sim$ |

**2. Ustrezne stranice.** Ustrezni stranici ležita nasproti enakih kotov. Najkrajša stranica prvega trikotnika ustreza najkrajši stranici drugega.

**3. Izreki o podobnosti trikotnikov.** Ni treba preverjati vsega. Izreki SSS, SKS in SSK imajo enaka imena kot izreki o skladnosti, le »enaki stranici« zamenja »enako razmerje stranic«; namesto KSK zadošča že KK. Trikotnika sta podobna že, če velja eno od naslednjega:

- **KK:** ujemata se v dveh kotih. Tretji kot je potem samodejno enak, saj je vsota kotov $180^\circ$.
- **SSS:** razmerja vseh treh parov ustreznih stranic so enaka.
- **SKS:** razmerje dveh parov ustreznih stranic je enako in kota med njima sta enaka.
- **SSK:** razmerje dveh parov ustreznih stranic je enako in enaka sta kota, ki ležita nasproti daljše od teh dveh stranic.

**4. Ploščine.** Če je razmerje dolžin $k$, je razmerje ploščin $k^2$.

:::premisli
Fotografijo Lune natisneš tako, da je njen premer $3$-krat večji kot na prvem odtisu. Kolikokrat več črnila porabiš za Lunin krog? Napovej, preden bereš naprej.
---
Približno $9$-krat več. Krog se raztegne $3$-krat v širino in $3$-krat v višino, zato ploščina zraste za $k^2 = 3^2 = 9$.
:::

**5. Pravokotni trikotnik in višina na hipotenuzo.** Trikotnik $ABC$ ima pravi kot pri $C$. Hipotenuza je $c = |AB|$, kateti sta $a = |BC|$ in $b = |AC|$. Višina iz $C$ seka hipotenuzo v točki $D$ in je dolga $v_c = |CD|$. Točka $D$ razdeli hipotenuzo na dva odseka:

- $c_a = |DB|$ je odsek ob kateti $a$,
- $c_b = |AD|$ je odsek ob kateti $b$,

zato je $c = c_a + c_b$. Višina razdeli trikotnik na dva manjša pravokotna trikotnika, ki sta podobna drug drugemu in tudi velikemu trikotniku. Dokaz je spodaj v razdelku »Drugače: Bolj natančno«.

:::risba skica
opis: Pravokotni trikotnik ABC s pravim kotom pri C. Hipotenuza AB je vodoravna in dolga 25. Višina iz C pade pravokotno v točko D na hipotenuzi in je dolga 12. Odsek AD ob kateti b meri 16, odsek DB ob kateti a meri 9. Kateta a = BC meri 15, kateta b = AC meri 20.
območje: -2; -3 .. 27; 14
enota: 10
lik: 0; 0 -> 25; 0 -> 16; 12 | modra
črta: 16; 12 -> 16; 0 | oranžna črtkano
pravikot: 16; 12 | 0; 0 | 25; 0
pravikot: 16; 0 | 25; 0 | 16; 12
točka: 0; 0 | A | pod levo
točka: 25; 0 | B | pod desno
točka: 16; 12 | C | nad
točka: 16; 0 | D | pod
napis: 8; 0 | c_b = 16 | pod
napis: 20,5; 0 | c_a = 9 | pod
napis: 16; 5 | v_c = 12 | levo
napis: 20,5; 6 | a = 15 | desno
napis: 8; 6 | b = 20 | levo
:::

**6. Evklidov izrek.** Pitagorov izrek povezuje *obe* kateti s hipotenuzo. Evklidov izrek vzame vsako kateto posebej in jo poveže s hipotenuzo in enim odsekom. Kvadrat katete je enak zmnožku hipotenuze in odseka, ki leži ob tej kateti:

$$a^2 = c \cdot c_a, \qquad b^2 = c \cdot c_b$$

**7. Višinski izrek.** Kvadrat višine na hipotenuzo je enak zmnožku obeh odsekov hipotenuze:

$$v_c^2 = c_a \cdot c_b$$

Na risbi zgoraj: $15^2 = 25 \cdot 9$, $20^2 = 25 \cdot 16$ in $12^2 = 9 \cdot 16$.

:::premisli
Kaj se zgodi, če višina razdeli hipotenuzo na dva enaka odseka, $c_a = c_b$? Kolikšna je tedaj višina v primerjavi z odsekom in kakšen je trikotnik?
---
Iz $v_c^2 = c_a \cdot c_a = c_a^2$ sledi $v_c = c_a$: višina je enako dolga kot vsak odsek. Kateti sta enaki ($a^2 = c \cdot c_a = b^2$), zato je trikotnik enakokrak pravokotni, kota ob hipotenuzi sta $45^\circ$.
:::

**8. Središčni razteg.** Podobne like dobimo s preslikavo. Izberemo točko $S$, **središče raztega**, in število $k \ne 0$, **koeficient raztega**. **Središčni razteg** vsaki točki $T$ priredi točko $T'$ na premici $ST$, za katero je

$$|ST'| = |k| \cdot |ST|$$

Pri $k > 0$ leži $T'$ na isti strani središča kot $T$ (na poltraku $ST$), pri $k < 0$ na nasprotni strani. Središče $S$ se preslika samo vase. Tako deluje projektor: središče je v objektivu, slika na platnu je povečana. Tudi kovanec in Luna iz primera 2 sta povezana s središčnim raztegom s središčem v očesu.

- Daljica se preslika v vzporedno daljico, ki je $|k|$-krat daljša: $|A'B'| = |k| \cdot |AB|$.
- Koti se ohranijo.
- Zato je slika lika podobna liku s koeficientom podobnosti $|k|$, ploščina pa se pomnoži s $k^2$.

Pri $|k| > 1$ se lik poveča, pri $|k| < 1$ se pomanjša. Pri $k = 1$ ostane vse na mestu, pri $k = -1$ je razteg zrcaljenje čez točko $S$.

V koordinatnem sistemu merimo odmik točke od središča in ga pomnožimo s $k$. Točka $T(x, y)$ se pri središču $S(x_S, y_S)$ preslika v $T'(x', y')$:

$$x' = x_S + k\,(x - x_S), \qquad y' = y_S + k\,(y - y_S)$$

Pri središču v izhodišču je preprosto $T'(kx, ky)$. Na risbi je središče v izhodišču: večji trikotnik je slika trikotnika $ABC$ pri $k = 2$, manjši na drugi strani središča pri $k = -\frac{1}{2}$.

:::risba graf
opis: Središčni razteg s središčem v izhodišču S. Modri trikotnik ABC ima oglišča A(2, 1), B(4, 1), C(3, 3). Pri k = 2 se preslika v oranžni trikotnik A'B'C' z oglišči (4, 2), (8, 2), (6, 6), ki ima dvakrat daljše stranice. Pri k = −1/2 se preslika v zeleni trikotnik z oglišči (−1; −0,5), (−2; −0,5), (−1,5; −1,5) na drugi strani središča. Črtkane premice skozi S povezujejo ustrezna oglišča.
x: -3 .. 9 | 1 | x
y: -2 .. 7 | 1 | y
enako: da
črta: -1; -0,5 -> 4; 2 | siva črtkano
črta: -2; -0,5 -> 8; 2 | siva črtkano
črta: -1,5; -1,5 -> 6; 6 | siva črtkano
lik: 2; 1 -> 4; 1 -> 3; 3 | modra
lik: 4; 2 -> 8; 2 -> 6; 6 | oranžna
lik: -1; -0,5 -> -2; -0,5 -> -1,5; -1,5 | zelena
točka: 0; 0 | S | nad levo
točka: 2; 1 | A | pod
točka: 4; 1 | B | pod
točka: 3; 3 | C | levo
točka: 4; 2 | A' | nad levo
točka: 8; 2 | B' | pod
točka: 6; 6 | C' | levo
:::

## Rešeni primeri

### Primer 1: koeficient podobnosti in neznane stranice

Trikotnik $ABC$ ima stranice $a = 4\,\text{cm}$, $b = 6\,\text{cm}$, $c = 8\,\text{cm}$. Trikotnik $A'B'C'$ je njemu podoben in ima stranico $a' = 10\,\text{cm}$, ki ustreza stranici $a$. Izračunaj $b'$ in $c'$.

**Podatki:** $a = 4\,\text{cm}$, $b = 6\,\text{cm}$, $c = 8\,\text{cm}$, $a' = 10\,\text{cm}$, $\triangle ABC \sim \triangle A'B'C'$
**Iščemo:** stranici $b'$ in $c'$

:::formula
$k = \dfrac{a'}{a}$, nato $b' = k \cdot b$ in $c' = k \cdot c$
:::

**Rešitev:**

1. Ustrezni stranici sta $a$ in $a'$, zato je $k = \dfrac{a'}{a} = \dfrac{10}{4} = 2{,}5$.
2. Vse stranice se povečajo z istim faktorjem: $b' = k \cdot b = 2{,}5 \cdot 6 = 15\,\text{cm}$.
3. Podobno $c' = 2{,}5 \cdot 8 = 20\,\text{cm}$.
4. Preverimo: $\dfrac{15}{6} = 2{,}5$ in $\dfrac{20}{8} = 2{,}5$. ✓
5. Odgovor: $b' = 15\,\text{cm}$ in $c' = 20\,\text{cm}$.

### Primer 2: kako velika je Luna

Odgovorimo na vprašanje z začetka. Kovanec s premerom $2{,}5\,\text{cm}$ na razdalji $275\,\text{cm}$ od očesa natanko prekrije Luno, ki je od nas oddaljena $384\,000\,\text{km}$. Kolikšen je premer Lune?

**Podatki:** premer kovanca $p = 2{,}5\,\text{cm}$, razdalja kovanca od očesa $r = 275\,\text{cm}$, razdalja Lune $R = 384\,000\,\text{km}$
**Iščemo:** premer Lune $x$

:::formula
$\dfrac{x}{R} = \dfrac{p}{r}$ (podobna trikotnika z vrhom v očesu)
:::

**Rešitev:**

1. **Skica.** Od očesa do obeh robov kovanca vodita dva žarka, ki gresta naprej do robov Lune. Nastaneta dva enakokraka trikotnika z vrhom v očesu: majhen s kovancem, velik z Luno.
2. **Zakaj sta podobna?** Kot pri očesu je skupen. Kovanec je vzporeden s premerom Lune, zato sta tudi kota ob osnovnicah enaka (istoležna kota ob vzporednicah). Po izreku KK sta trikotnika podobna.
3. **Sorazmerje.** Premer ustreza premeru, razdalja razdalji, zato $\dfrac{x}{384\,000} = \dfrac{2{,}5}{275}$. Razmerje na desni je brez enote, ker sta obe dolžini v cm.
4. **Račun.** $x = \dfrac{2{,}5 \cdot 384\,000}{275} \approx 3491\,\text{km}$.
5. **Odgovor.** Premer Lune je približno $3500\,\text{km}$. Natančno izmerjeni premer je $3474\,\text{km}$, zato je naša ocena zelo dobra.

### Primer 3: Evklidov in višinski izrek

V pravokotnem trikotniku višina na hipotenuzo razdeli hipotenuzo na odseka $c_a = 9\,\text{cm}$ in $c_b = 16\,\text{cm}$. Izračunaj višino $v_c$ ter kateti $a$ in $b$.

**Podatki:** $c_a = 9\,\text{cm}$, $c_b = 16\,\text{cm}$, pravi kot pri $C$
**Iščemo:** višino $v_c$ ter kateti $a$ in $b$

:::formula
$c = c_a + c_b$, višinski izrek $v_c^2 = c_a \cdot c_b$, Evklidov izrek $a^2 = c \cdot c_a$ in $b^2 = c \cdot c_b$
:::

**Rešitev:**

1. **Hipotenuza.** $c = c_a + c_b = 9 + 16 = 25\,\text{cm}$.
2. **Višina.** Uporabimo višinski izrek: $v_c^2 = c_a \cdot c_b = 9 \cdot 16 = 144$, zato $v_c = \sqrt{144} = 12\,\text{cm}$.
3. **Kateta $a$.** Odsek $c_a$ leži ob kateti $a$, zato $a^2 = c \cdot c_a = 25 \cdot 9 = 225$ in $a = 15\,\text{cm}$.
4. **Kateta $b$.** $b^2 = c \cdot c_b = 25 \cdot 16 = 400$ in $b = 20\,\text{cm}$.
5. **Preverimo s Pitagorovim izrekom:** $15^2 + 20^2 = 225 + 400 = 625 = 25^2$. ✓
6. Odgovor: višina je $12\,\text{cm}$, kateti merita $15\,\text{cm}$ in $20\,\text{cm}$. To je trikotnik z risbe v razlagi.

### Primer 4: zdaj ti

Pravokotni trikotnik ima hipotenuzo $c = 50\,\text{cm}$ in kateto $a = 30\,\text{cm}$. Izračunaj odseka hipotenuze in višino $v_c$.

**Podatki:** $c = 50\,\text{cm}$, $a = 30\,\text{cm}$
**Iščemo:** odseka $c_a$, $c_b$ in višino $v_c$

:::formula
Evklidov izrek $a^2 = c \cdot c_a$, nato $c_b = c - c_a$ in višinski izrek $v_c^2 = c_a \cdot c_b$
:::

**Rešitev:**

1. Naloga je obrnjena: znan je kvadrat katete, iščemo odsek. Iz Evklidovega izreka $c_a = \dfrac{a^2}{c} = \dfrac{900}{50} = 18\,\text{cm}$.
2. Zdaj izračunaj sam drugi odsek in višino.

:::premisli
Koliko merita $c_b$ in $v_c$?
---
$c_b = 50 - 18 = 32\,\text{cm}$ in $v_c^2 = 18 \cdot 32 = 576$, zato $v_c = 24\,\text{cm}$. Preizkus: $b^2 = 50 \cdot 32 = 1600$, $b = 40\,\text{cm}$, in $30 \cdot 40 = 50 \cdot 24$, ker sta to dvakratni ploščini.
:::

### Primer 5: središčni razteg v koordinatah

Trikotnik $ABC$ ima oglišča $A(2, 2)$, $B(4, 2)$ in $C(2, 3)$. Preslikaj ga s središčnim raztegom s središčem $S(1, 1)$ in koeficientom a) $k = 2$, b) $k = -1$. Primerjaj ploščine slik s ploščino trikotnika $ABC$.

**Podatki:** $A(2, 2)$, $B(4, 2)$, $C(2, 3)$, središče $S(1, 1)$, koeficienta $k = 2$ in $k = -1$
**Iščemo:** oglišča slik in njihove ploščine

:::formula
$x' = x_S + k\,(x - x_S)$, $\;y' = y_S + k\,(y - y_S)$; ploščina slike je $k^2$-krat ploščina lika
:::

**Rešitev:**

1. Odmiki od središča: $A$ je $1$ desno in $1$ gor od $S$, $B$ je $3$ desno in $1$ gor, $C$ je $1$ desno in $2$ gor.
2. a) Pri $k = 2$ odmike podvojimo: $A'(1 + 2, 1 + 2) = A'(3, 3)$, $B'(1 + 6, 1 + 2) = B'(7, 3)$, $C'(1 + 2, 1 + 4) = C'(3, 5)$.
3. b) Pri $k = -1$ odmike obrnemo: $A''(1 - 1, 1 - 1) = A''(0, 0)$, $B''(1 - 3, 1 - 1) = B''(-2, 0)$, $C''(1 - 1, 1 - 2) = C''(0, -1)$.
4. Trikotnik $ABC$ ima pravi kot pri $A$, kateti merita $|AB| = 2$ in $|AC| = 1$, zato je $P = \dfrac{2 \cdot 1}{2} = 1$.
5. Slika pri $k = 2$ ima kateti $4$ in $2$: $P' = \dfrac{4 \cdot 2}{2} = 4 = 2^2 \cdot 1$. Slika pri $k = -1$ ima kateti $2$ in $1$: $P'' = 1 = (-1)^2 \cdot 1$.
6. Odgovor: a) $A'(3, 3)$, $B'(7, 3)$, $C'(3, 5)$, ploščina je $4$-krat večja; b) $A''(0, 0)$, $B''(-2, 0)$, $C''(0, -1)$, trikotnik je skladen z $ABC$ (zrcaljen čez $S$), ploščina je enaka.

## Pogoste napake

- **Napačno povezane stranice.** Razmerje mora povezovati *ustrezni* stranici, torej tisti, ki ležita nasproti enakih kotov. Preden zapišeš sorazmerje, označi enake kote.
- **Obrnjeno razmerje na eni strani.** Kar na levi deliš v nekem vrstnem redu (na primer premer z razdaljo), moraš v istem vrstnem redu deliti tudi na desni. Pri Luni je zapis $\dfrac{x}{384\,000} = \dfrac{275}{2{,}5}$ napačen: na levi je premer deljen z razdaljo, na desni razdalja s premerom.
- **Ploščina raste s $k$ namesto s $k^2$.** Kdor misli »dvakrat daljše, dvakrat večje«, pozabi, da se lik raztegne v dveh smereh. Če so dolžine dvakrat večje, je ploščina štirikrat večja. Iz razmerja ploščin dobiš $k$ s korenjenjem.
- **Zamenjana odseka pri Evklidovem izreku.** Kvadrat katete $a$ je enak $c \cdot c_a$, kjer je $c_a$ odsek *ob* kateti $a$ (med $B$ in vznožjem višine). Ne uporabi odseka ob drugi kateti.
- **Pozabljen koren.** Velja $v_c^2 = c_a \cdot c_b$ in $a^2 = c \cdot c_a$. Kdor zapiše zmnožek kot končni rezultat, dobi pri odsekih $4$ in $25$ višino $100$, kar je daljše od hipotenuze. Na koncu še koreni.

## Povzetek

- Trikotnika sta podobna, če imata enake ustrezne kote in enaka razmerja ustreznih stranic. Razmerje je koeficient podobnosti $k$.
- Dovolj je ujemanje v dveh kotih (KK) ali eden od izrekov SSS, SKS, SSK.
- Razmerje dolžin je $k$, razmerje ploščin je $k^2$.
- V pravokotnem trikotniku višina na hipotenuzo razdeli hipotenuzo na odseka $c_a$ in $c_b$ ter trikotnik na dva podobna trikotnika.
- Evklidov izrek: $a^2 = c \cdot c_a$, $b^2 = c \cdot c_b$.
- Višinski izrek: $v_c^2 = c_a \cdot c_b$.
- Središčni razteg s središčem $S$ in koeficientom $k \ne 0$: $|ST'| = |k| \cdot |ST|$; pri $k < 0$ je $T'$ na drugi strani $S$. Slika je podobna liku s koeficientom $|k|$, ploščina se pomnoži s $k^2$.
- Pri nalogah najprej nariši skico, označi enake kote in šele nato zapiši sorazmerje.

## Ponovitev

**Formule**
- $\dfrac{a'}{a} = \dfrac{b'}{b} = \dfrac{c'}{c} = k$ (na pamet)
- razmerje ploščin je $k^2$ (na pamet)
- $a^2 = c \cdot c_a$, $\;b^2 = c \cdot c_b$ (priloga)
- $v_c^2 = c_a \cdot c_b$ (priloga)
- središčni razteg: $|ST'| = |k| \cdot |ST|$ (na pamet)

**Postopek**
1. Nariši skico in označi enake kote.
2. Podobnost utemelji s KK, SSS, SKS ali SSK.
3. Poveži ustrezni stranici in izračunaj $k$.
4. Zapiši sorazmerje v istem vrstnem redu na obeh straneh.
5. Izračunaj neznano dolžino; pri ploščinah uporabi $k^2$.

**Pazi na**
- Povezuj stranici nasproti enakih kotov.
- Ploščina se pomnoži s $k^2$, ne s $k$.
- Pri Evklidovem in višinskem izreku na koncu še koreni.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

V trikotniku $ABC$ vzporednica s stranico $AB$ seka stranico $AC$ v točki $M$ in stranico $BC$ v točki $N$. Velja $|CM| = 4\,\text{cm}$ in $|MA| = 2\,\text{cm}$, ploščina trikotnika $MNC$ pa je $12\,\text{cm}^2$. Izračunaj ploščino trapeza $ABNM$.

**Rešitev:**

1. Ker je $MN \parallel AB$, sta kota pri $M$ in $A$ istoležna kota ob vzporednicah, zato enaka; kot pri $C$ je skupen. Po izreku KK sta trikotnika $ABC$ in $MNC$ podobna.
2. Ustrezni stranici sta $|CA| = 4\,\text{cm} + 2\,\text{cm} = 6\,\text{cm}$ in $|CM| = 4\,\text{cm}$, zato je koeficient podobnosti $k = \dfrac{|CA|}{|CM|} = \dfrac{6}{4} = \dfrac{3}{2}$.
3. Razmerje ploščin je $k^2 = \dfrac{9}{4}$, zato je ploščina trikotnika $ABC$ enaka $\dfrac{9}{4} \cdot 12\,\text{cm}^2 = 27\,\text{cm}^2$.
4. Trapez $ABNM$ je trikotnik $ABC$ brez trikotnika $MNC$: $27\,\text{cm}^2 - 12\,\text{cm}^2 = 15\,\text{cm}^2$.
5. Odgovor: ploščina trapeza $ABNM$ je $15\,\text{cm}^2$.

**Točkovanje:** 1 točka za podobnost trikotnikov in $k = \dfrac{3}{2}$, 1 točka za ploščino trikotnika $ABC$ ($27\,\text{cm}^2$), 1 točka za ploščino trapeza ($15\,\text{cm}^2$).

### Naloga 2: krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

V pravokotnem trikotniku $ABC$ s pravim kotom pri $C$ je $D$ nožišče višine iz oglišča $C$ na hipotenuzo. Višina meri $|CD| = 6\,\text{cm}$, odsek hipotenuze pa $|DB| = 3\,\text{cm}$.

a) Izračunaj dolžino odseka $|AD|$ in dolžino hipotenuze $|AB|$. (2 točki)
b) Izračunaj dolžini katet $a = |BC|$ in $b = |AC|$. Rezultata zapiši s poenostavljenima korenoma. (2 točki)
c) Utemelji, da sta trikotnika $ACD$ in $CBD$ podobna. Izračunaj koeficient podobnosti $k = \dfrac{|AC|}{|CB|}$ in razmerje ploščin trikotnikov $ACD$ in $CBD$. (3 točke)

**Rešitev:**

1. a) Odsek $|DB|$ leži ob kateti $a$, zato je $c_a = 3\,\text{cm}$, iskani odsek je $c_b = |AD|$. Po višinskem izreku je $v_c^2 = c_a \cdot c_b$, torej $c_b = \dfrac{v_c^2}{c_a} = \dfrac{36}{3} = 12\,\text{cm}$.
2. a) Hipotenuza: $c = c_a + c_b = 3 + 12 = 15\,\text{cm}$.
3. b) Po Evklidovem izreku je $a^2 = c \cdot c_a = 15 \cdot 3 = 45$, zato $a = \sqrt{45} = 3\sqrt{5}\,\text{cm}$.
4. b) Prav tako $b^2 = c \cdot c_b = 15 \cdot 12 = 180$, zato $b = \sqrt{180} = 6\sqrt{5}\,\text{cm}$. Preverimo: $45 + 180 = 225 = 15^2$. ✓
5. c) Oba trikotnika imata pravi kot pri $D$. Kot trikotnika $ACD$ pri $A$ je kot $\alpha$ trikotnika $ABC$. V trikotniku $CBD$ je kot pri $C$ enak $90^\circ - \beta = \alpha$. Trikotnika se ujemata v dveh kotih, zato sta po izreku KK podobna.
6. c) Ustrezni stranici sta hipotenuzi obeh trikotnikov, $|AC|$ in $|CB|$: $k = \dfrac{6\sqrt{5}}{3\sqrt{5}} = 2$. Preverimo še z drugim parom ustreznih stranic: $\dfrac{|AD|}{|CD|} = \dfrac{12}{6} = 2$. ✓
7. c) Razmerje ploščin je $k^2 = 4$. Preverimo: ploščina trikotnika $ACD$ je $\dfrac{12 \cdot 6}{2} = 36\,\text{cm}^2$, ploščina trikotnika $CBD$ je $\dfrac{3 \cdot 6}{2} = 9\,\text{cm}^2$, in $36 : 9 = 4$. ✓
8. Odgovor: a) $|AD| = 12\,\text{cm}$, $|AB| = 15\,\text{cm}$; b) $a = 3\sqrt{5}\,\text{cm}$, $b = 6\sqrt{5}\,\text{cm}$; c) trikotnika sta podobna po izreku KK, $k = 2$, razmerje ploščin je $4 : 1$.

**Točkovanje:** a) 1 točka za višinski izrek z vstavljenimi podatki in $|AD| = 12\,\text{cm}$, 1 točka za $|AB| = 15\,\text{cm}$; b) 1 točka za $a = 3\sqrt{5}\,\text{cm}$, 1 točka za $b = 6\sqrt{5}\,\text{cm}$ (pravilna odseka v Evklidovem izreku); c) 1 točka za utemeljitev podobnosti z dvema enakima kotoma, 1 točka za $k = 2$, 1 točka za razmerje ploščin $4$.

### Ustno vprašanje 1

:::premisli
Naštej izreke o podobnosti trikotnikov in pojasni, zakaj pri izreku KK zadoščata dva para enakih kotov.
---
Po izreku KK sta trikotnika podobna, če se ujemata v dveh kotih. Dva kota zadoščata, ker je vsota notranjih kotov trikotnika $180^\circ$, zato sta enaka tudi tretja kota. Po izreku SSS sta trikotnika podobna, če so razmerja vseh treh parov ustreznih stranic enaka. Po izreku SKS sta podobna, če sta razmerji dveh parov ustreznih stranic enaki in sta enaka kota med tema stranicama. Po izreku SSK sta podobna, če sta razmerji dveh parov ustreznih stranic enaki in sta enaka kota, ki ležita nasproti daljše od teh dveh stranic.
:::

### Ustno vprašanje 2

:::premisli
Dokaži Evklidov izrek v pravokotnem trikotniku in iz njega izpelji Pitagorov izrek.
---
V pravokotnem trikotniku $ABC$ s pravim kotom pri $C$ višina iz $C$ seka hipotenuzo v točki $D$ in jo razdeli na odseka $c_a = |DB|$ in $c_b = |AD|$. Trikotnika $ABC$ in $CBD$ imata pravi kot in skupni kot pri $B$, zato sta po izreku KK podobna. Iz razmerja ustreznih stranic $\dfrac{c}{a} = \dfrac{a}{c_a}$ sledi $a^2 = c \cdot c_a$, enako iz podobnosti trikotnikov $ABC$ in $ACD$ sledi $b^2 = c \cdot c_b$. Ko obe enakosti seštejemo, dobimo $a^2 + b^2 = c\,(c_a + c_b) = c^2$, kar je Pitagorov izrek.
:::

### Ustno vprašanje 3

:::premisli
V kakšnem razmerju sta ploščini dveh podobnih trikotnikov? Odgovor utemelji.
---
Če sta trikotnika podobna s koeficientom podobnosti $k$, je razmerje njunih ploščin $k^2$. Vse dolžine drugega trikotnika so $k$-krat daljše, torej tudi izbrana stranica in višina nanjo. Ploščina je polovica zmnožka stranice in višine, zato se pomnoži s $k \cdot k = k^2$. Na primer pri dvakrat daljših stranicah je ploščina štirikrat večja.
:::

## Drugače: Na sliki

Predstavljaj si fotografijo, ki jo povečaš na fotokopirnem stroju. Vsi kosi na sliki se povečajo za isti faktor, kotov pa stroj ne spremeni. Povečani trikotnik je podoben prvotnemu, faktor povečave je $k$.

Pri pravokotnem trikotniku nariši višino na hipotenuzo. Dobiš tri pravokotne trikotnike:

- veliki trikotnik $ABC$ s hipotenuzo $c$,
- trikotnik $CBD$ s hipotenuzo $a$ (v njem leži odsek $c_a$),
- trikotnik $ACD$ s hipotenuzo $b$ (v njem leži odsek $c_b$).

Vsi trije imajo enake kote $\alpha$, $\beta$ in $90^\circ$, le različno velikost. Če si manjša trikotnika zamisliš zavrtena in povečana, se prilegata velikemu. Iz tega izhajajo vsa razmerja v Evklidovem in višinskem izreku.

## Drugače: Iz vsakdanjega življenja

**Zemljevid.** Na zemljevidu z merilom $1 : 50\,000$ je razdalja med dvema krajema $6\,\text{cm}$. V naravi je to $6 \cdot 50\,000 = 300\,000\,\text{cm} = 3\,\text{km}$. Zemljevid je podoben terenu s koeficientom $k = \dfrac{1}{50\,000}$. Kotov med potmi zemljevid ne spremeni.

**Dolga senca, visok stolp.** Ko sonce zahaja, so sence dolge. Razmerje med višino predmeta in dolžino njegove sence pa je v istem trenutku za vse predmete enako. Zato lahko višino stolpa izračunaš s palico in metrom.

**Načrt hiše.** Arhitekt nariše načrt v merilu $1 : 100$. Dolžina $5\,\text{cm}$ na načrtu je $5\,\text{m}$ v resnici, ploščina $1\,\text{cm}^2$ na načrtu pa je $10\,000\,\text{cm}^2 = 1\,\text{m}^2$ v resnici. Ploščine se torej množijo s $k^2$, dolžine s $k$.

## Drugače: Korak za korakom s številkami

Vzemimo pravokotni trikotnik s katetama $a = 6\,\text{cm}$ in $b = 8\,\text{cm}$. Hipotenuza je $c = 10\,\text{cm}$, saj $36 + 64 = 100$. Izračunajmo vse s podobnostjo.

| Korak | Račun | Rezultat |
|---|---|---|
| Odsek ob $a$ iz Evklida: $a^2 = c \cdot c_a$ | $c_a = \dfrac{36}{10}$ | $c_a = 3{,}6\,\text{cm}$ |
| Odsek ob $b$ iz Evklida: $b^2 = c \cdot c_b$ | $c_b = \dfrac{64}{10}$ | $c_b = 6{,}4\,\text{cm}$ |
| Preverimo vsoto | $3{,}6 + 6{,}4$ | $10 = c$ ✓ |
| Višina iz višinskega izreka | $v_c^2 = 3{,}6 \cdot 6{,}4 = 23{,}04$ | $v_c = 4{,}8\,\text{cm}$ |

Preverimo višino še s ploščino. Ploščina je $\dfrac{a \cdot b}{2} = \dfrac{6 \cdot 8}{2} = 24\,\text{cm}^2$ in tudi $\dfrac{c \cdot v_c}{2} = \dfrac{10 \cdot 4{,}8}{2} = 24\,\text{cm}^2$. ✓

## Drugače: Bolj natančno (dokaz)

**Podobnost trikotnikov.** V pravokotnem trikotniku $ABC$ (pravi kot pri $C$) naj bo $D$ vznožje višine iz $C$. Označimo kota $\alpha$ pri $A$ in $\beta$ pri $B$, pri čemer $\alpha + \beta = 90^\circ$.

- $\triangle ABC$ in $\triangle CBD$: oba imata pravi kot (pri $C$ oziroma pri $D$) in skupni kot $\beta$ pri $B$. Po izreku KK sta podobna.
- $\triangle ABC$ in $\triangle ACD$: oba imata pravi kot in skupni kot $\alpha$ pri $A$. Po izreku KK sta podobna.
- $\triangle ACD$ in $\triangle CBD$: v prvem je kot pri $C$ enak $90^\circ - \alpha = \beta$, v drugem je kot pri $C$ enak $90^\circ - \beta = \alpha$. Oba imata pravi kot pri $D$, zato sta po KK podobna. Ustrezna oglišča so $A \leftrightarrow C$, $C \leftrightarrow B$, $D \leftrightarrow D$.

**Evklidov izrek.** Iz $\triangle ABC \sim \triangle CBD$ sledi
$$\frac{|AB|}{|CB|} = \frac{|CB|}{|DB|} \;\Rightarrow\; \frac{c}{a} = \frac{a}{c_a} \;\Rightarrow\; a^2 = c \cdot c_a.$$
Iz $\triangle ABC \sim \triangle ACD$ podobno sledi $\dfrac{c}{b} = \dfrac{b}{c_b}$, torej $b^2 = c \cdot c_b$.

**Višinski izrek.** Iz $\triangle ACD \sim \triangle CBD$ sledi
$$\frac{|AD|}{|CD|} = \frac{|CD|}{|DB|} \;\Rightarrow\; \frac{c_b}{v_c} = \frac{v_c}{c_a} \;\Rightarrow\; v_c^2 = c_a \cdot c_b.$$

**Pitagorov izrek kot posledica.** Seštejemo obe obliki Evklidovega izreka:
$$a^2 + b^2 = c \cdot c_a + c \cdot c_b = c\,(c_a + c_b) = c \cdot c = c^2.$$

**Ploščine.** Če sta trikotnika podobna s koeficientom $k$, je osnovnica večjega $k$-krat daljša, višina nanjo tudi. Ploščina je zato $\dfrac{k z \cdot k v}{2} = k^2 \cdot \dfrac{z v}{2}$, torej $k^2$-krat večja.

## Preveri se

? Poglej risbo pravokotnega trikotnika z višino $v_c$ v razlagi. Katera zveza velja za kateto $a = |BC|$?
- $a^2 = c \cdot c_b$
~ $c_b$ leži ob kateti $b$ (med $A$ in $D$). Pri kateti $a$ vzameš odsek ob njej, $c_a = |DB|$.
+ $a^2 = c \cdot c_a$
- $a^2 = c_a \cdot c_b$
~ Zmnožek obeh odsekov da kvadrat višine (višinski izrek), ne kvadrata katete.
> Evklidov izrek: kvadrat katete je zmnožek hipotenuze in odseka ob tej kateti. Na risbi $15^2 = 25 \cdot 9$.

? Zakaj sta trikotnik oko–kovanec in trikotnik oko–Luna iz primera 2 podobna?
- Ker imata enako dolge stranice.
~ Enako dolge stranice imajo skladni trikotniki. Podobna imata le enako razmerje stranic.
+ Ker imata skupni kot pri očesu in enaka kota ob osnovnici (KK).
- Ker sta oba okrogla predmeta enako oddaljena od očesa.
~ Razdalji sta zelo različni ($275\,\text{cm}$ in $384\,000\,\text{km}$). Podobnost pride iz enakih kotov.
> Skupni kot pri očesu in vzporedni osnovnici dajo dva para enakih kotov. Po izreku KK sta trikotnika podobna.

? Trikotnik povečamo tako, da je njegova ploščina $9$-krat večja. Kolikšen je koeficient podobnosti $k$?
- $9$
~ To je razmerje ploščin, $k^2$. Dolžine se povečajo za $k = \sqrt{9}$.
- $4{,}5$
~ Polovica od $9$ nima zveze s ploščino. Ploščina raste s kvadratom $k$, zato koreniš.
+ $3$
> Razmerje ploščin je $k^2 = 9$, zato $k = 3$.

? Na fotografiji meri premer Lune $3{,}5\,\text{cm}$, krater na njej pa $0{,}2\,\text{cm}$. Premer Lune je približno $3500\,\text{km}$. Oceni premer kraterja.
- $20\,\text{km}$
~ Fotografija je pomanjšana za $3500\,\text{km} : 3{,}5\,\text{cm}$, torej $1\,\text{cm}$ pomeni $1000\,\text{km}$; $0{,}2\,\text{cm}$ je $200\,\text{km}$, ne $20$.
+ $200\,\text{km}$
- $700\,\text{km}$
~ To je $0{,}2 \cdot 3500$: pozabil si deliti s $3{,}5$. Razmerje je $\dfrac{0{,}2}{3{,}5}$, ne $0{,}2$.
> Krater in Luna sta na sliki pomanjšana z istim koeficientom: $1\,\text{cm}$ na sliki je $1000\,\text{km}$, zato $0{,}2\,\text{cm}$ pomeni $200\,\text{km}$.

? Višina na hipotenuzo razdeli hipotenuzo na odseka $4\,\text{cm}$ in $21\,\text{cm}$. Kolikšna je kateta ob odseku $4\,\text{cm}$?
- $100\,\text{cm}$
~ To je $a^2$. Na koncu moraš še koreniti.
- $\sqrt{84}\,\text{cm}$
~ $\sqrt{4 \cdot 21}$ je višina $v_c$ (višinski izrek), ne kateta.
+ $10\,\text{cm}$
- $\sqrt{525}\,\text{cm}$
~ $25 \cdot 21$ uporabi odsek ob drugi kateti. Kateta ob odseku $4\,\text{cm}$ potrebuje prav ta odsek.
> Najprej hipotenuza $c = 4 + 21 = 25\,\text{cm}$, nato Evklidov izrek $a^2 = 25 \cdot 4 = 100$, torej $a = 10\,\text{cm}$.

? (brez računala) Središčni razteg s središčem $S(1, 2)$ in koeficientom $k = -2$ preslika točko $T(3, 5)$ v točko $T'$. Koliko je prva koordinata (abscisa) točke $T'$?
= -3
~ 5 | Vzel si $k = 2$. Pri negativnem $k$ leži $T'$ na drugi strani središča.
~ -6 | Raztegnil si iz izhodišča, $-2 \cdot 3$. Odmik meriš od središča $S$.
~ -4 | Če si izračunal $-2 \cdot (3 - 1)$, je to le pomnoženi odmik, prišteti mu moraš še $x_S = 1$. Če si izračunal drugo koordinato $y' = -4$: sprašujemo po prvi, $x'$.
> $x' = 1 + (-2) \cdot (3 - 1) = 1 - 4 = -3$. (Druga koordinata: $y' = 2 + (-2) \cdot (5 - 2) = -4$, torej $T'(-3, -4)$.)

? Lik s ploščino $5\,\text{cm}^2$ preslikamo s središčnim raztegom s koeficientom $k = -3$. Kolikšna je ploščina slike?
= 45 cm²
~ -45 | Ploščina ni negativna. Razmerje ploščin je $k^2 = (-3)^2 = 9$.
~ 15 | Dolžine se pomnožijo s $|k| = 3$, ploščina pa s $k^2 = 9$.
> Slika je podobna liku s koeficientom $|k| = 3$, zato je njena ploščina $9 \cdot 5\,\text{cm}^2 = 45\,\text{cm}^2$.

:::simboli
a, b, c | stranice trikotnika | | | pri višini na hipotenuzo: a, b kateti, c hipotenuza
a', b', c' | ustrezne (istoležne) stranice podobnega trikotnika | | |
k | koeficient podobnosti; pri središčnem raztegu koeficient raztega | k = \frac{a'}{a} | | k > 1: večji trikotnik, k < 1: manjši; koeficient raztega je lahko tudi negativen
S | središče središčnega raztega | | |
T, T' | točka in njena slika pri središčnem raztegu | | |
y | druga koordinata točke $T$ (pri središčnem raztegu) | | |
x_S, y_S | koordinati središča raztega | | |
x', y' | koordinati slike $T'$ | x' = x_S + k\,(x - x_S) | |
P, P', P'' | ploščina trikotnika in njegovih slik | | |
c_a | odsek hipotenuze ob kateti a | | | a² = c · c_a
c_b | odsek hipotenuze ob kateti b | | | b² = c · c_b
v_c | višina na hipotenuzo | v_c^2 = c_a \cdot c_b | |
x | premer Lune | x = \frac{p \cdot R}{r} | km | pri središčnem raztegu prva koordinata točke $T$
p | premer kovanca | | cm
r | razdalja kovanca od očesa | | cm
R | razdalja od Zemlje do Lune | | km
A, B, C | oglišča trikotnika | | | pravi kot je pri C; pri središčnem raztegu poljubni trikotnik, v primeru 5 je pravi kot pri A
D | nožišče višine na hipotenuzo | | |
M, N | presečišči vzporednice z AB s stranicama AC in BC (naloga 1 za maturo) | | |
:::

<<RACUN
vrednost: (4+2)/4 | 3/2
vrednost: (3/2)^2*12 | 27
vrednost: 27-12 | 15
vrednost: 6^2/3 | 12
vrednost: 3+12 | 15
vrednost: sqrt(15*3) | 3*sqrt(5)
vrednost: sqrt(15*12) | 6*sqrt(5)
vrednost: (6*sqrt(5))/(3*sqrt(5)) | 2
vrednost: (12*6/2)/(3*6/2) | 4
vrednost: 12*6/2 | 36
vrednost: 3*6/2 | 9
vrednost: 1+2*(2-1) | 3
vrednost: 1+2*(4-1) | 7
vrednost: 1+2*(3-1) | 5
vrednost: 1-1*(4-1) | -2
vrednost: 1-1*(3-1) | -1
vrednost: 4*2/2 | 4
vrednost: 1+(-2)*(3-1) | -3
vrednost: 2+(-2)*(5-2) | -4
vrednost: (-3)^2*5 | 45
>>
