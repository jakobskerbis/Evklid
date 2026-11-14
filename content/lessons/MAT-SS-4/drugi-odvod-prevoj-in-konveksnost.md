---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

*(višja raven) Drugi odvod, konveksnost, konkavnost in prevoj matura preverja samo na višji ravni.*

Na astronomskem krožku ste izstrelili model rakete in iz posnetka narisali graf višine $h$ v odvisnosti od časa $t$. Graf se najprej dviga vse strmeje, potem vse bolj položno, na vrhu pa se zravna.

Naredi poskus. Na list nariši tako krivuljo, vzemi ravnilo in ga na več mestih položi ob krivuljo kot tangento, tako da se je le dotika. Na spodnjem delu leži krivulja **nad** ravnilom, na zgornjem **pod** njim. Na enem samem mestu pa ravnilo krivuljo **preseka**: na eni strani je krivulja pod njim, na drugi nad njim.

Prav tam je raketa letela najhitreje: ravnilo je tam najbolj strmo, naklon tangente pa je hitrost. Prvi odvod pove, ali graf narašča. Kako je graf ukrivljen in kje se ukrivljenost obrne, pove **drugi odvod**. Z njim to točko izračunaš brez ravnila.

## Razlaga

**1. Odvod odvoda.** Odvod $f'$ je spet funkcija, zato ga lahko še enkrat odvajamo. Dobimo **drugi odvod** $f''$:

$$f''(x) = \bigl(f'(x)\bigr)'$$

Za $f(x) = x^3$ je $f'(x) = 3x^2$ in $f''(x) = 6x$. Drugi odvod pove, kako hitro se spreminja naklon tangente. Pri raketi je $h'$ hitrost, $h''$ pa pospešek.

**2. Trije grafi, en vzorec.** Primerjaj tri znane funkcije. Pri vsaki ravnilo (tangento) položi kamorkoli na graf in zapiši, ali je graf nad tangento ali pod njo.

| $f(x)$ | $f''(x)$ | graf glede na tangente |
|---|---|---|
| $x^2$ | $2 > 0$ | nad |
| $-x^2$ | $-2 < 0$ | pod |
| $x^3$ | $6x$ | levo pod, desno nad |

Kjer je $f''$ pozitiven, leži graf nad tangentami. Kjer je negativen, leži pod njimi. Zakaj? Pri $f'' > 0$ odvod $f'$ narašča, nakloni tangent se z večanjem $x$ večajo in graf se upogiba navzgor, stran od tangente.

**3. Imena.** Funkcija je na intervalu **konveksna**, če njen graf tam leži nad vsako svojo tangento (oblika »skodelice«, $\cup$). Je **konkavna**, če graf leži pod tangentami (oblika »kupole«, $\cap$). Za dvakrat odvedljivo funkcijo velja:

- $f''(x) > 0$ na intervalu: $f$ je tam konveksna;
- $f''(x) < 0$ na intervalu: $f$ je tam konkavna.

:::premisli
Funkcija $g(x) = \ln x$ ves čas narašča. Napovej: ali je konveksna ali konkavna? Preveri z drugim odvodom.
---
Konkavna. $g'(x) = \frac{1}{x}$ in $g''(x) = -\frac{1}{x^2} < 0$ za vsak $x > 0$. Naraščanje določa predznak **prvega** odvoda, ukrivljenost pa predznak **drugega**. Graf $\ln x$ se dviga vse počasneje, zato leži pod tangentami.
:::

**4. Prevoj.** Točka na grafu, v kateri se konveksnost zamenja s konkavnostjo (ali obratno), je **prevojna točka** ali **prevoj**. V njej tangenta graf preseka, kot ravnilo v poskusu.

Na sliki je graf $f(x) = x^3 - 3x$ s tremi tangentami.

:::risba graf
opis: Graf funkcije f(x) = x³ − 3x za x od −2,5 do 2,5 in tri črtkane tangente. Tangenta y = 2 v točki A(−1, 2) leži nad grafom. Tangenta y = −2 v točki B(1, −2) leži pod grafom. Tangenta y = −3x v točki P(0, 0) graf preseka: levo od P je graf pod njo, desno nad njo.
x: -2,5 .. 2,5 | 1 | x
y: -4 .. 4 | 1 | y
f: x^3 - 3*x | modra debelo
f: 2 | oranžna črtkano | -2 .. 0
f: -2 | zelena črtkano | 0 .. 2
f: -3*x | rdeča črtkano | -1,2 .. 1,2
točka: -1; 2 | A | nad
točka: 1; -2 | B | pod
točka: 0; 0 | P | desno
:::

Tu je $f''(x) = 6x$. Levo od $0$ je negativen (graf konkaven, tangenta v $A$ nad grafom), desno pozitiven (graf konveksen, tangenta v $B$ pod grafom). V $P(0, 0)$ zamenja predznak: to je prevoj.

Pravilo: v prevoju $f''$ **zamenja predznak**. Če $f''(x_0)$ obstaja, je zato $f''(x_0) = 0$. Prevoje torej iščeš med ničlami drugega odvoda, nato pa preveriš menjavo predznaka.

:::premisli
Za $f(x) = x^4$ je $f''(x) = 12x^2$ in $f''(0) = 0$. Ali ima graf v $(0, 0)$ prevoj? Najprej si zamisli graf $x^4$, nato preveri predznak $f''$ levo in desno od $0$.
---
Nima. $12x^2 > 0$ na obeh straneh ničle, zato je $x^4$ konveksna povsod in v $(0, 0)$ ima minimum. Pogoj $f''(x_0) = 0$ je **potreben, ni pa zadosten**: odločilna je menjava predznaka.
:::

**5. Prevoj ni stacionarna točka.** V prevoju $f''$ zamenja predznak, zato $f'$ na eni strani narašča, na drugi pada. Naklon tangente je tam največji ali najmanjši v okolici: $f'$ ima ekstrem. Tangenta je vodoravna le izjemoma (pri $x^3$ v $0$). Pri raketi je prevoj grafa višine trenutek največje hitrosti, ne vrh leta.

**6. Drugi odvod in ekstremi.** Iz lekcije Uporaba odvoda veš, da je v stacionarni točki $a$ ekstrem, če $f'$ zamenja predznak. Drugi odvod to pogosto pove hitreje:

- $f'(a) = 0$ in $f''(a) > 0$: graf je okoli $a$ skodelica, v $a$ je **minimum**;
- $f'(a) = 0$ in $f''(a) < 0$: graf je kupola, v $a$ je **maksimum**;
- $f'(a) = 0$ in $f''(a) = 0$: drugi odvod ne odloči. Pri $x^4$, $-x^4$ in $x^3$ je v $0$ po vrsti minimum, maksimum in nobenega ekstrema. Vrni se k predznaku $f'$.

**7. Simulacija spodaj** »Odvod in oblika grafa« kaže funkcijo $x^3 - 3x$ in pod njo graf odvoda $f'$. Počasi premikaj točko $x_0$ od $-2$ do $2$ in opazuj točko na spodnjem grafu. Vrednost $f'$ najprej pada, pri $x_0 = 0$ doseže najmanjšo vrednost $-3$, nato spet raste. Tam tangenta graf preseka: to je prevoj.

## Rešeni primeri

### Primer 1 (lažji): ena prevojna točka

Določi, kje je funkcija $f(x) = x^3 - 3x^2 + 2$ konveksna in kje konkavna, ter poišči njen prevoj.

**Podatki:** $f(x) = x^3 - 3x^2 + 2$, definirana za vse realne $x$
**Iščemo:** intervala konveksnosti in konkavnosti, prevoj $T$

:::formula
$f''(x) > 0$: konveksna; $f''(x) < 0$: konkavna; prevoj tam, kjer $f''$ zamenja predznak.
:::

**Rešitev:**

1. Prvi odvod: $f'(x) = 3x^2 - 6x$.
2. Drugi odvod: $f''(x) = 6x - 6 = 6(x - 1)$.
3. Rešimo enačbo $6x - 6 = 0$: $x = 1$, edina kandidatka za prevoj.
4. Predznak preverimo na vsaki strani: $f''(0) = -6 < 0$, $f''(2) = 6 > 0$. Predznak se zamenja.
5. Ordinata prevoja: $f(1) = 1 - 3 + 2 = 0$.
6. Odgovor: $f$ je konkavna na $(-\infty, 1)$, konveksna na $(1, \infty)$, prevoj je $T(1, 0)$.

### Primer 2: dva prevoja in vrsta ekstremov

Za $f(x) = x^4 - 6x^2$ poišči prevoje in intervale konveksnosti. Nato z drugim odvodom določi vrsto stacionarnih točk.

**Podatki:** $f(x) = x^4 - 6x^2$, definirana za vse realne $x$
**Iščemo:** prevoje, intervale konveksnosti in konkavnosti, vrsto ekstremov

:::formula
Prevoj: $f''$ zamenja predznak. Ekstrem: $f'(a) = 0$ in $f''(a) > 0$ (minimum) ali $f''(a) < 0$ (maksimum).
:::

**Rešitev:**

1. $f'(x) = 4x^3 - 12x = 4x(x^2 - 3)$.
2. $f''(x) = 12x^2 - 12 = 12(x - 1)(x + 1)$, ničli sta $x = -1$ in $x = 1$.
3. Predznak $f''$ po intervalih: $f''(-2) = 36 > 0$, $f''(0) = -12 < 0$, $f''(2) = 36 > 0$. Na vsaki ničli se zamenja.
4. Ordinati: $f(1) = 1 - 6 = -5$ in enako $f(-1) = -5$, ker je funkcija soda.
5. Stacionarne točke iz $f'(x) = 0$: $x = 0$ in $x = \pm\sqrt{3}$.
6. $f''(0) = -12 < 0$, zato je v $0$ maksimum $f(0) = 0$. $f''(\sqrt{3}) = 12 \cdot 3 - 12 = 24 > 0$, zato sta v $\pm\sqrt{3}$ minimuma $f(\pm\sqrt{3}) = 9 - 18 = -9$.
7. Odgovor: $f$ je konveksna na $(-\infty, -1)$ in na $(1, \infty)$, konkavna na $(-1, 1)$; prevoja sta $T_1(-1, -5)$ in $T_2(1, -5)$. Maksimum je $(0, 0)$, minimuma sta $(-\sqrt{3}, -9)$ in $(\sqrt{3}, -9)$.

### Primer 3 (težji): kdaj raketa leti najhitreje?

Višino modela rakete v prvih štirih sekundah leta opisuje poenostavljen model $h(t) = 6t^2 - t^3$ (višina v metrih, čas v sekundah). Kdaj se raketa dviga najhitreje, s kolikšno hitrostjo in na kateri višini je takrat? Kakšen je graf $h$ pred tem trenutkom in po njem?

**Podatki:** $h(t) = 6t^2 - t^3$ v $\mathrm{m}$, $t$ v $\mathrm{s}$, $0 \le t \le 4\,\mathrm{s}$
**Iščemo:** čas $t$ največje hitrosti, hitrost $v$, višino $h$ ob tem času, obliko grafa

:::formula
$v(t) = h'(t)$, pospešek je $h''(t)$. Največja hitrost je tam, kjer $h''$ zamenja predznak iz $+$ v $-$: to je prevoj grafa $h$.
:::

**Rešitev:**

1. Hitrost: $v(t) = h'(t) = 12t - 3t^2$.
2. Pospešek: $h''(t) = 12 - 6t$.
3. Rešimo enačbo $12 - 6t = 0$: $t = 2\,\mathrm{s}$. Za $t < 2$ je $h''(t) > 0$ (raketa pospešuje, graf $h$ je konveksen), za $t > 2$ je $h''(t) < 0$ (raketa zavira, graf je konkaven).
4. Hitrost tedaj: $v(2) = 12 \cdot 2 - 3 \cdot 4 = 12$, torej $12\,\mathrm{m/s}$.
5. Robova za primerjavo: $v(0) = 0$ in $v(4) = 48 - 48 = 0$, obe manjši od $12\,\mathrm{m/s}$.
6. Višina: $h(2) = 6 \cdot 4 - 8 = 16$, torej $16\,\mathrm{m}$.
7. Odgovor: raketa se najhitreje dviga po $2\,\mathrm{s}$, s hitrostjo $12\,\mathrm{m/s}$, na višini $16\,\mathrm{m}$. Točka $(2, 16)$ je prevoj grafa višine: pred njo je graf konveksen, za njo konkaven. Vrh leta pri $t = 4\,\mathrm{s}$ ni prevoj, ampak maksimum.

### Primer 4 – zdaj ti

Za $f(x) = x\,e^{-x}$ določi vrsto stacionarne točke z drugim odvodom in poišči prevoj.

**Podatki:** $f(x) = x\,e^{-x}$, definirana za vse realne $x$
**Iščemo:** vrsto ekstrema, prevoj $T$

:::formula
$(u\,w)' = u'\,w + u\,w'$; prevoj tam, kjer $f''$ zamenja predznak.
:::

**Rešitev:**

1. Po pravilu za produkt: $f'(x) = e^{-x} - x\,e^{-x} = (1 - x)\,e^{-x}$. Stacionarna točka je $x = 1$.
2. Še enkrat: $f''(x) = -e^{-x} - (1 - x)\,e^{-x} = (x - 2)\,e^{-x}$.
3. Ker je $e^{-x} > 0$, ima $f''$ predznak izraza $x - 2$. Dokončaj sam: vrsta ekstrema v $x = 1$ in prevoj.

:::premisli
Kaj je v $x = 1$ in kje je prevoj?
---
$f''(1) = -e^{-1} < 0$, zato je v $x = 1$ maksimum $f(1) = e^{-1} \approx 0{,}37$. $f''$ zamenja predznak v $x = 2$ (levo negativen, desno pozitiven), zato je prevoj $T(2, 2e^{-2}) \approx (2; 0{,}27)$. Levo od $2$ je $f$ konkavna, desno konveksna.
:::

## Pogoste napake

- **»$f''(x_0) = 0$, torej je tam prevoj.«** Pri $x^4$ je $f''(0) = 0$, a $f'' = 12x^2$ je na obeh straneh pozitiven, zato prevoja ni (tam je minimum). Ničla $f''$ je samo kandidatka. Vedno preveri, ali $f''$ zamenja predznak.
- **»Funkcija narašča, torej je konveksna.«** Naraščanje je predznak $f'$, ukrivljenost predznak $f''$. Funkcija $\ln x$ narašča in je konkavna, $e^{-x}$ pada in je konveksna. Za obliko vedno izračunaj $f''$.
- **»Prevoj je tam, kjer je tangenta vodoravna.«** Kdor reši $f'(x) = 0$, najde stacionarne točke, ne prevojev. V prevoju ima $f'$ ekstrem, zato tam rešiš $f''(x) = 0$. Pri raketi je to trenutek največje hitrosti, ne vrh.
- **Prevoj, kjer funkcija ni definirana.** Za $f(x) = \frac{1}{x}$ je $f''(x) = \frac{2}{x^3}$, ki pri $0$ zamenja predznak. Točke na grafu pa tam ni, zato prevoja ni. Prevoj je vedno točka $(x_0, f(x_0))$ grafa.
- **»Če je $f''(a) = 0$, ekstrema ni.«** Pri $f'(a) = 0$ in $f''(a) = 0$ drugi odvod ne pove ničesar: $x^4$ ima v $0$ minimum, $x^3$ nima ekstrema. Odloči predznak $f'$ okoli $a$.

## Povzetek

- Drugi odvod je odvod odvoda: $f''(x) = \bigl(f'(x)\bigr)'$; pove, kako se spreminja naklon tangente (pri gibanju: pospešek).
- $f'' > 0$: funkcija je konveksna (graf nad tangentami, $\cup$); $f'' < 0$: konkavna (graf pod tangentami, $\cap$).
- Prevoj je točka grafa, kjer se konveksnost in konkavnost zamenjata; tam $f''$ zamenja predznak in tangenta preseka graf.
- $f''(x_0) = 0$ je le potreben pogoj: pri $x^4$ v $0$ prevoja ni.
- Iskanje: $f''$, ničle $f''$, predznak na intervalih, ordinata $f(x_0)$.
- Test ekstrema: $f'(a) = 0$ in $f''(a) > 0$ minimum, $f''(a) < 0$ maksimum, $f''(a) = 0$ ne odloči.

## Za maturo

### Naloga 1 (višja raven): krajša strukturirana naloga, 8 točk, pola 1 (brez računala)

Dana je funkcija $f(x) = x^4 - 4x^3 + 10$.

a) Izračunaj $f'(x)$ in $f''(x)$. (2 točki)
b) Določi intervale, na katerih je $f$ konveksna oziroma konkavna, in prevoje funkcije $f$. (3 točke)
c) Poišči stacionarni točki funkcije $f$ in določi njuno vrsto. Pojasni, zakaj test z drugim odvodom v eni od njiju ne zadošča. (3 točke)

**Rešitev:**

1. a) $f'(x) = 4x^3 - 12x^2 = 4x^2(x - 3)$.
2. a) $f''(x) = 12x^2 - 24x = 12x(x - 2)$.
3. b) Ničli drugega odvoda sta $x = 0$ in $x = 2$. Predznak: $f''(-1) = 36 > 0$, $f''(1) = -12 < 0$, $f''(3) = 36 > 0$.
4. b) $f$ je konveksna na $(-\infty, 0)$ in na $(2, \infty)$, konkavna na $(0, 2)$. V obeh ničlah $f''$ zamenja predznak.
5. b) $f(0) = 10$ in $f(2) = 16 - 32 + 10 = -6$, zato sta prevoja $P_1(0, 10)$ in $P_2(2, -6)$.
6. c) Iz $4x^2(x - 3) = 0$ dobimo stacionarni točki $x = 0$ in $x = 3$.
7. c) $f''(3) = 108 - 72 = 36 > 0$, zato je v $x = 3$ lokalni minimum $f(3) = 81 - 108 + 10 = -17$, točka $(3, -17)$.
8. c) $f''(0) = 0$, zato drugi odvod o vrsti ne odloči. Izraz $4x^2(x - 3)$ je levo in desno od $0$ negativen, $f'$ predznaka ne zamenja, zato v $x = 0$ ni ekstrema: točka $(0, 10)$ je prevoj z vodoravno tangento.
9. Odgovor: $f$ je konveksna na $(-\infty, 0)$ in $(2, \infty)$, konkavna na $(0, 2)$; prevoja sta $P_1(0, 10)$ in $P_2(2, -6)$; lokalni minimum je $(3, -17)$, v $x = 0$ ekstrema ni.

**Točkovanje:** a) 1 točka za $f'$, 1 točka za $f''$; b) 1 točka za ničli $f''$ s preverjeno menjavo predznaka, 1 točka za intervale konveksnosti in konkavnosti, 1 točka za oba prevoja z ordinatama; c) 1 točka za stacionarni točki, 1 točka za minimum $(3, -17)$ z utemeljitvijo, 1 točka za utemeljitev, da v $x = 0$ ni ekstrema ($f''(0) = 0$ ne odloči, $f'$ ne zamenja predznaka).

### Naloga 2 (višja raven): strukturirana naloga, 10 točk, pola 2 (z računalom)

Dana je funkcija $f(x) = (x^2 - 3)\,e^x$. Rezultate, ki niso cela števila, zaokroži na dve decimalki.

a) Izračunaj $f'(x)$ in $f''(x)$ ter oba zapiši kot produkt polinoma in $e^x$. (2 točki)
b) Poišči stacionarni točki funkcije $f$ in z drugim odvodom določi njuno vrsto. (3 točke)
c) Izračunaj prevoja funkcije $f$ in utemelji, da sta res prevoja. (3 točke)
d) Zapiši intervale, na katerih je $f$ konveksna oziroma konkavna. (2 točki)

**Rešitev:**

1. a) Po pravilu za produkt: $f'(x) = 2x\,e^x + (x^2 - 3)\,e^x = (x^2 + 2x - 3)\,e^x$.
2. a) Še enkrat: $f''(x) = (2x + 2)\,e^x + (x^2 + 2x - 3)\,e^x = (x^2 + 4x - 1)\,e^x$.
3. b) Ker je $e^x > 0$, je $f'(x) = 0$ natanko pri $x^2 + 2x - 3 = (x + 3)(x - 1) = 0$, torej pri $x = -3$ in $x = 1$.
4. b) $f''(-3) = (9 - 12 - 1)\,e^{-3} = -4e^{-3} < 0$: lokalni maksimum $f(-3) = 6e^{-3} \doteq 0{,}2987$, točka $(-3; 0{,}30)$.
5. b) $f''(1) = 4e > 0$: lokalni minimum $f(1) = -2e \doteq -5{,}4366$, točka $(1; -5{,}44)$.
6. c) $f''(x) = 0$ pri $x^2 + 4x - 1 = 0$: $x_{1,2} = -2 \pm \sqrt{5}$, torej $x_1 \doteq -4{,}2361$ in $x_2 \doteq 0{,}2361$.
7. c) Ničli kvadratnega polinoma sta enostavni, zato $x^2 + 4x - 1$ v obeh zamenja predznak; faktor $e^x > 0$ predznaka ne spremeni, zato ga zamenja tudi $f''$. Obe točki sta prevoja.
8. c) $f(x_1) = (6 + 4\sqrt{5})\,e^{-2 - \sqrt{5}} \doteq 0{,}2162$ in $f(x_2) = (6 - 4\sqrt{5})\,e^{-2 + \sqrt{5}} \doteq -3{,}7282$. Prevoja sta $P_1(-4{,}24; 0{,}22)$ in $P_2(0{,}24; -3{,}73)$.
9. d) Polinom $x^2 + 4x - 1$ je negativen med ničlama in pozitiven zunaj njiju. Zato je $f$ konveksna na $(-\infty, -2 - \sqrt{5})$ in na $(-2 + \sqrt{5}, \infty)$, konkavna pa na $(-2 - \sqrt{5}, -2 + \sqrt{5})$, približno na $(-4{,}24; 0{,}24)$.
10. Odgovor: maksimum $(-3; 0{,}30)$, minimum $(1; -5{,}44)$, prevoja $P_1(-4{,}24; 0{,}22)$ in $P_2(0{,}24; -3{,}73)$; $f$ je konkavna med prevojema in konveksna zunaj tega intervala.

**Točkovanje:** a) 1 točka za $f'$, 1 točka za $f''$; b) 1 točka za $x = -3$ in $x = 1$, 1 točka za maksimum z utemeljitvijo in ordinato, 1 točka za minimum z utemeljitvijo in ordinato; c) 1 točka za abscisi $-2 \pm \sqrt{5}$, 1 točka za utemeljitev menjave predznaka, 1 točka za ordinati; d) 1 točka za intervala konveksnosti, 1 točka za interval konkavnosti.

### Ustno vprašanje 1

:::premisli
(višja raven) Kdaj je funkcija na intervalu konveksna in kdaj konkavna ter kako to ugotoviš z drugim odvodom?
---
Funkcija je na intervalu konveksna, če njen graf tam leži nad vsako svojo tangento, in konkavna, če leži pod njimi. Za dvakrat odvedljivo funkcijo velja: če je $f''(x) > 0$ na intervalu, je $f$ tam konveksna. Če je $f''(x) < 0$ na intervalu, je $f$ tam konkavna. Razlog je, da pri $f'' > 0$ odvod $f'$ narašča, nakloni tangent se večajo in graf se upogiba navzgor, stran od tangent.
:::

### Ustno vprašanje 2

:::premisli
(višja raven) Kaj je prevoj funkcije in kako ga poiščeš? Navedi primer, ki pokaže, da ničla drugega odvoda še ni nujno prevoj.
---
Prevoj je točka grafa, v kateri se konveksnost zamenja s konkavnostjo ali obratno; tangenta v njej graf preseka. V prevoju drugi odvod zamenja predznak, zato je tam $f''(x_0) = 0$, če $f''(x_0)$ obstaja. Prevoje iščeš med ničlami drugega odvoda in pri vsaki preveriš, ali $f''$ v njej zamenja predznak. Pri $f(x) = x^4$ je $f''(0) = 0$, a $f''(x) = 12x^2$ je na obeh straneh pozitiven, zato v $(0, 0)$ ni prevoja, ampak minimum.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Kako z drugim odvodom ugotoviš vrsto ekstrema v stacionarni točki in kdaj ta test ne odloči?
---
Naj bo $a$ stacionarna točka, torej $f'(a) = 0$. Če je $f''(a) > 0$, je v $a$ lokalni minimum: $f'$ v $a$ narašča, zato je tik levo od $a$ negativen, tik desno pa pozitiven. Če je $f''(a) < 0$, je v $a$ lokalni maksimum, ker $f'$ tam preide iz pozitivnih v negativne vrednosti. Če je $f''(a) = 0$, test ne odloči: $x^4$, $-x^4$ in $x^3$ imajo v $0$ po vrsti minimum, maksimum in nobenega ekstrema, zato pogledaš predznak $f'$ levo in desno od $a$.
:::

## Drugače: Korak za korakom s številkami

Primerjaj $x^3$ in $x^4$ blizu točke $0$, kjer je pri obeh $f''(0) = 0$. Izračunaj drugi odvod malo levo in malo desno.

| $x$ | $(x^3)'' = 6x$ | $(x^4)'' = 12x^2$ |
|---|---|---|
| $-0{,}1$ | $-0{,}6$ | $0{,}12$ |
| $0$ | $0$ | $0$ |
| $0{,}1$ | $0{,}6$ | $0{,}12$ |

1. Pri $x^3$ se predznak zamenja iz $-$ v $+$: v $(0, 0)$ je prevoj.
2. Pri $x^4$ je predznak na obeh straneh $+$: prevoja ni, funkcija je povsod konveksna.
3. Preizkus s tangento: tangenta na $x^3$ v $0$ je os $x$. Vrednost $(-0{,}1)^3 = -0{,}001$ je pod njo, $0{,}1^3 = 0{,}001$ nad njo: tangenta graf res preseka.
4. Pri $x^4$ sta obe vrednosti $0{,}0001$ nad osjo $x$: graf leži nad tangento, ne preseka je.

## Drugače: Kot zgodba

Rover se po Marsu pelje čez pokrajino s profilom $y = f(x)$, od leve proti desni. Najprej zapelje v kotanjo. Na dnu je skoraj vodoraven, nato se njegov nos dviga vse bolj. Naklon raste, to je $f'' > 0$: pokrajina je tu konveksna, skodelica.

Pobočje ga pripelje do mesta, kjer je nos dvignjen najbolj, vozilo pa se še vedno vzpenja. Odtod naprej se naklon manjša: rover se bliža grebenu in nos se počasi spušča proti vodoravni legi. Zdaj je $f'' < 0$: pokrajina je konkavna, kupola.

Mesto, kjer je bil nos dvignjen najbolj, je prevoj. Tam pobočje ni bilo vodoravno, bilo je najbolj strmo. Kamera, pritrjena na rover vzporedno s tlemi, bi tam za trenutek gledala natanko vzdolž tangente in videla tla pod seboj na eni strani in nad seboj na drugi.

## Preveri se

? Na nekem intervalu velja $f''(x) < 0$. Kaj zagotovo velja za graf funkcije $f$ na tem intervalu?
- Funkcija na intervalu pada.
~ Padanje je predznak prvega odvoda ($f' < 0$). Predznak drugega odvoda pove ukrivljenost.
+ Graf je konkaven: leži pod svojimi tangentami.
- Graf je konveksen: leži nad svojimi tangentami.
~ Zamenjal si imeni: nad tangentami (skodelica) leži graf pri $f'' > 0$.
> $f'' < 0$ pomeni, da odvod $f'$ pada, nakloni tangent se manjšajo in graf se upogiba navzdol, pod tangente. Funkcija pri tem lahko narašča ali pada.

? Na sliki je graf **odvoda** $f'$ neke funkcije $f$, ne graf $f$. Z grafa oceni absciso prevojne točke funkcije $f$ (na eno decimalko).
:::risba graf
opis: Graf odvoda f′ (ne funkcije f). Parabola, odprta navzgor, seka os x pri približno 0,4 in 2,6; teme leži pod osjo x, natanko na sredini med tema dvema ničlama, pri y = −1,25.
x: -1 .. 4 | 1 | x
y: -2 .. 5 | 1 | y
f: x^2 - 3*x + 1 | modra debelo
napis: 3,3; 4 | f′ | levo
:::
= 1,5 | 0,1
~ 0,4 | To je ničla $f'$, torej stacionarna točka funkcije $f$ (tam je ekstrem), ne prevoj.
~ 2,6 | To je ničla $f'$: v njej ima $f$ ekstrem. Prevoj je tam, kjer ima $f'$ ekstrem.
> V prevoju ima $f'$ ekstrem. Najnižja točka parabole je na sredini med ničlama, pri $x = 1{,}5$. Levo od nje $f'$ pada ($f'' < 0$), desno raste ($f'' > 0$).

? Zakaj funkcija $f(x) = x^4$ v točki $(0, 0)$ nima prevoja, čeprav je $f''(0) = 0$?
- Ker je $f'(0) = 0$, v stacionarni točki pa prevoja ne more biti.
~ Lahko je: $x^3$ ima v $0$ vodoravno tangento in prevoj. Odloča predznak $f''$, ne $f'$.
+ Ker je $f''(x) = 12x^2$ na obeh straneh ničle pozitiven, zato se ukrivljenost ne zamenja.
- Ker prevoj obstaja samo tam, kjer je $f''(x_0) \ne 0$.
~ Ravno obratno: če $f''(x_0)$ obstaja, je v prevoju vedno $f''(x_0) = 0$. Ta pogoj je potreben, ni pa zadosten.
> Prevoj zahteva menjavo predznaka $f''$. Pri $x^4$ je $f''$ levo in desno od $0$ pozitiven, graf je povsod konveksen, v $0$ ima minimum.

? (brez računala) Za katero vrednost parametra $k$ ima funkcija $f(x) = x^3 + k x^2 + 1$ prevoj pri $x = 2$?
= -6
~ -3 | Rešil si $f'(2) = 0$ in dobil stacionarno točko. Za prevoj rešiš $f''(2) = 0$.
~ 6 | Predznak: iz $12 + 2k = 0$ sledi $k = -6$.
> $f''(x) = 6x + 2k$. Iz $f''(2) = 12 + 2k = 0$ sledi $k = -6$. Takrat je $f''(x) = 6x - 12$, ki pri $x = 2$ res zamenja predznak.

? Recimo, da svetlost $L(t)$ oddaljene supernove po vrhu pada, sprva vse hitreje, potem vse počasneje. Kaj velja za graf $L$ v trenutku $t_0$, ko svetlost pada najhitreje?
- V $t_0$ ima $L$ minimum, ker je $L'(t_0) = 0$.
~ $L'(t_0) = 0$ bi pomenilo, da se svetlost v tem trenutku ne spreminja. Ko pada najhitreje, je $L'$ najbolj negativen, ne $0$.
- $L''(t_0) < 0$, ker svetlost pada.
~ Padanje pove predznak $L'$, ne $L''$. Pred $t_0$ je $L''$ negativen, po njem pozitiven.
+ V $t_0$ ima graf prevoj: $L''$ zamenja predznak iz $-$ v $+$.
> Dokler padanje pospešuje, se $L'$ manjša ($L'' < 0$, graf konkaven); potem se padanje umirja ($L'' > 0$, graf konveksen). Menjava je prevoj, v njem ima $L'$ minimum.

<<RACUN
odvod: x^3-3*x^2+2 | x | 3*x^2-6*x
odvod: 3*x^2-6*x | x | 6*x-6
resi: 6*x-6=0 | x | 1
vrednost: 1^3-3*1^2+2 | 0
odvod: x^4-6*x^2 | x | 4*x^3-12*x
odvod: 4*x^3-12*x | x | 12*x^2-12
resi: 12*x^2-12=0 | x | -1, 1
neenacba: 12*x^2-12<0 | x | (-1, 1)
resi: 4*x^3-12*x=0 | x | -sqrt(3), 0, sqrt(3)
vrednost: (sqrt(3))^4-6*(sqrt(3))^2 | -9
vrednost: 12*(sqrt(3))^2-12 | 24
odvod: 6*t^2-t^3 | t | 12*t-3*t^2
odvod: 12*t-3*t^2 | t | 12-6*t
resi: 12-6*t=0 | t | 2
vrednost: 12*2-3*2^2 | 12
vrednost: 6*2^2-2^3 | 16
odvod: x*exp(-x) | x | (1-x)*exp(-x)
odvod: (1-x)*exp(-x) | x | (x-2)*exp(-x)
vrednost: exp(-1) | 0.37
vrednost: 2*exp(-2) | 0.27
odvod: ln(x) | x | 1/x
odvod: 1/x | x | -1/x^2
odvod: x^2-3*x+1 | x | 2*x-3
resi: 2*x-3=0 | x | 1.5
resi: 6*2+2*k=0 | k | -6
odvod: x^4-4*x^3+10 | x | 4*x^3-12*x^2
odvod: 4*x^3-12*x^2 | x | 12*x^2-24*x
resi: 12*x^2-24*x=0 | x | 0, 2
neenacba: 12*x^2-24*x<0 | x | (0, 2)
vrednost: 2^4-4*2^3+10 | -6
resi: 4*x^3-12*x^2=0 | x | 0, 3
vrednost: 12*3^2-24*3 | 36
vrednost: 3^4-4*3^3+10 | -17
odvod: (x^2-3)*exp(x) | x | (x^2+2*x-3)*exp(x)
odvod: (x^2+2*x-3)*exp(x) | x | (x^2+4*x-1)*exp(x)
resi: x^2+2*x-3=0 | x | -3, 1
vrednost: (9-12-1)*exp(-3) | -4*exp(-3)
vrednost: ((-3)^2-3)*exp(-3) | 0.2987
vrednost: (1-3)*exp(1) | -5.4366
resi: x^2+4*x-1=0 | x | -2-sqrt(5), -2+sqrt(5)
vrednost: (6+4*sqrt(5))*exp(-2-sqrt(5)) | 0.2162
vrednost: (6-4*sqrt(5))*exp(-2+sqrt(5)) | -3.7282
neenacba: x^2+4*x-1<0 | x | (-2-sqrt(5), -2+sqrt(5))
>>

:::simboli
f | funkcija | | | 
f' | prvi odvod funkcije | | | naklon tangente
f'' | drugi odvod funkcije | f''(x) = \bigl(f'(x)\bigr)' | | predznak pove ukrivljenost
x | neodvisna spremenljivka | | | 
x_0 | abscisa kandidata za prevoj | | | 
a | abscisa stacionarne točke | f'(a) = 0 | | 
h | višina rakete | h(t) = 6t^2 - t^3 | m | 
t | čas od izstrelitve | | s | 
v | hitrost dviganja rakete | v = h' | m/s | 
u | prvi faktor produkta | | | v Primeru 4 $u = x$
u' | odvod prvega faktorja | | | 
w | drugi faktor produkta | | | v Primeru 4 $w = e^{-x}$
k | parameter v funkciji | | | 
:::
