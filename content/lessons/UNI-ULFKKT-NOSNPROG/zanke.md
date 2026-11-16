---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Žogico spustiš z višine $1\,\mathrm{m}$ na trdo mizo. Pri vsakem odboju izgubi del energije: pri koeficientu odboja $e = 0{,}8$ se dvigne le do $0{,}8^2 = 0{,}64$ prejšnje višine. Idealna žogica bi se torej odbila **neskončnokrat** – a vsi ti odboji trajajo skupaj le končno dolgo, približno štiri sekunde pri tej višini. V laboratoriju to slišiš: udarci si sledijo vse hitreje, dokler ne preidejo v brnenje in utihnejo.

Koliko odbojev je višjih od centimetra? Koliko poti naredi žogica do konca? Na papirju bi računal odboj za odbojem. Program pa lahko isti korak ponovi tolikokrat, kolikor je treba, in sproti šteje in sešteva. Za to so **zanke**: `while` ponavlja, dokler velja pogoj, `for` ponovi za vsak element zaporedja, `break` zanko predčasno prekine. Z njimi boš obdelal meritve, simuliral gibanje, iskal rešitve enačb in preverjal formule.

## Razlaga

### Najprej en primer

Program za žogico iz uvoda: kateri odboj po vrsti je prvi nižji od $1\,\mathrm{cm}$?

```python
h = 1.0        # višina v metrih
n = 0          # število odbojev
while h >= 0.01:
    h = h * 0.64
    n = n + 1
print(n, h)
```

Program izpiše `11 0.007378697629483823`. Kaj se je zgodilo, pokaže **sledilna tabela** – stanje spremenljivk po vsakem obhodu:

| obhod | `h` pred → pogoj | `h` po | `n` po |
|---|---|---|---|
| 1 | $1{,}0$ → `True` | $0{,}64$ | $1$ |
| 2 | $0{,}64$ → `True` | $0{,}4096$ | $2$ |
| 3 | $0{,}4096$ → `True` | $0{,}2621$ | $3$ |
| … | … | … | … |
| 11 | $0{,}0115$ → `True` | $0{,}0074$ | $11$ |
| – | $0{,}0074$ → `False` | konec | $11$ |

Iz primera razberemo štiri stvari, ki veljajo za vsako zanko `while`:

1. Spremenljivke, ki jih zanka spreminja (`h`, `n`), morajo imeti vrednost **pred** zanko.
2. Pogoj se preveri **pred vsakim** obhodom, tudi pred prvim.
3. Telo mora pogoj sčasoma spremeniti, sicer se zanka nikoli ne konča.
4. Po zanki pogoj ne velja več (tu: `h < 0.01`).

Rezultat lahko preverimo z matematiko: po $n$ odbojih je $h = 0{,}64^n$; iščemo najmanjši $n$ s $0{,}64^n < 0{,}01$, torej $n > \ln 0{,}01/\ln 0{,}64 \approx 10{,}3$, zato $n = 11$. ✓ Enajsti odboj je torej prvi pod $1\,\mathrm{cm}$; višjih od centimetra je $10$ odbojev.

### Zanka `while`

**Pravilo (pomen zanke `while`).** Naj bo `P` izraz in `B` zamaknjen blok pod `while P:`. Python izračuna `bool(P)`. Če je `True`, izvede `B` in se vrne na začetek (spet izračuna `P`); če je `False`, nadaljuje za zanko. En izvedbeni krog telesa imenujemo **obhod** (iteracija).

Telo se lahko izvede tudi nič-krat: če je pogoj že na začetku neresničen, Python blok preskoči. Če pa telo pogoja nikoli ne spremeni, dobimo **neskončno zanko**; program prekineš s Ctrl + C.

**Kdaj se zanka konča.** Zanesljivo vemo, da se `while` konča, če najdemo **mero napredka**: celoštevilsko količino, ki je med izvajanjem nenegativna in se v vsakem obhodu zmanjša vsaj za $1$. Ker nenegativno celo število ne more padati neskončno dolgo, je obhodov končno mnogo. Pri žogici je to na primer število množenj z $0{,}64$, ki še manjkajo, da `h` pade pod $0{,}01$ (pred zanko $11$) – manj formalno: `h` se v vsakem obhodu pomnoži z $0{,}64 < 1$ in zato pade pod vsako pozitivno mejo.

:::premisli
V programu za žogico zamenjaš faktor `0.64` z `1.0` (popolnoma prožna žogica). Kaj se zgodi, ko program poženeš, in zakaj?
---
Program se nikoli ne konča. `h` ostane $1{,}0$, pogoj `h >= 0.01` je vedno `True`, `n` pa raste brez konca. Mera napredka ne pada; to je neskončna zanka.
:::

### Zanka `for` in `range`

Kadar vnaprej vemo, kolikokrat ponavljamo, je preglednejša zanka `for`:

```python
for i in range(5):
    print(i, i * i)
```

izpiše vrstice `0 0`, `1 1`, `2 4`, `3 9`, `4 16`. Zanka `for` spremenljivki `i` po vrsti priredi vsak element zaporedja in za vsakega izvede telo. Zaporedje števil da `range`:

| klic | vrednosti |
|---|---|
| `range(5)` | $0, 1, 2, 3, 4$ |
| `range(2, 6)` | $2, 3, 4, 5$ |
| `range(3, 20, 4)` | $3, 7, 11, 15, 19$ |
| `range(10, 0, -3)` | $10, 7, 4, 1$ |

`range(a, b, k)` začne pri `a`, prišteva `k` in se ustavi **pred** `b` (`b` ni vključen). Pri $k > 0$ in $a < b$ je obhodov $\lceil (b - a)/k\rceil$ (zaokroženo navzgor); v tabeli zgoraj po vrsti $5$, $4$, $5$ in $4$ obhodov. Zgornja meja, ki ni vključena, je najpogostejši vir napak »za ena« (angl. *off-by-one*).

Zanka `for` lahko teče tudi po znakih niza: `for c in "DNA":` priredi `c` po vrsti `"D"`, `"N"`, `"A"`. Druge zbirke (sezname) spoznaš v naslednji lekciji.

Vsako zanko `for` po `range(a, b, k)` s $k > 0$ lahko zapišemo z `while`:

```python
i = a
while i < b:
    # telo
    i = i + k
```

Obratno ne gre vedno: pri žogici števila obhodov ne poznamo vnaprej, zato je `while` naravna izbira.

### Štetje in seštevanje

Dva vzorca boš uporabljal v skoraj vsakem programu z zanko.

**Seštevalnik (akumulator).** Pred zanko `s = 0`; v vsakem obhodu `s = s + x` (krajše `s += x`). Po zanki je `s` vsota vseh `x`.

**Števec.** Pred zanko `n = 0`; v obhodu, kjer velja pogoj, `n += 1`. Po zanki je `n` število obhodov, v katerih je pogoj veljal.

Vsota števil od $1$ do $100$:

```python
s = 0
for k in range(1, 101):
    s += k
print(s)        # 5050
```

**Pravilo (invarianta zanke).** Trditev, ki velja pred prvim obhodom in jo vsak obhod ohrani, velja tudi po zanki. Za zgornji program je invarianta: »po obhodu s števcem $k$ je `s` $= 1 + 2 + \dots + k$«.

**Dokaz pravilnosti.** Pred prvim obhodom je `s = 0`, vsota praznega zaporedja. Če po obhodu s $k - 1$ velja `s` $= 1 + \dots + (k - 1)$, po obhodu s $k$ velja `s` $= 1 + \dots + (k - 1) + k$. Po zadnjem obhodu ($k = 100$) je zato `s` $= 1 + \dots + 100 = 100 \cdot 101/2 = 5050$. $\square$ To je matematična indukcija, zapisana s programom.

Pogosta past: začetna vrednost seštevalnika mora biti **pred** zanko; če `s = 0` napišeš v telo, se vsota v vsakem obhodu izbriše.

### `break` in `continue`

`break` takoj konča **najbližjo** zanko, v kateri stoji, in program nadaljuje za njo. `continue` preskoči preostanek trenutnega obhoda in začne naslednjega. Pogost vzorec je zanka, ki se konča »nekje na sredini«:

```python
while True:
    vrstica = input("Meritev (prazno za konec): ")
    if vrstica == "":
        break
    # obdelava meritve
```

`while True` bi bila neskončna zanka, `break` pa jo konča, ko uporabnik vnese prazno vrstico. Tak »stražar« (angl. *sentinel*) je primeren, ko število podatkov ni znano vnaprej.

:::premisli
V gnezdeni zanki (zanka v zanki) notranja zanka vsebuje `break`. Ali se konča tudi zunanja zanka? Kaj pa, če `break` zamenjaš s `continue`?
---
Ne. `break` konča le najbližjo, notranjo zanko; zunanja nadaljuje z naslednjim obhodom in notranja se spet začne od začetka. `continue` v notranji zanki preskoči le preostanek trenutnega notranjega obhoda; notranja zanka teče naprej.
:::

## Rešeni primeri

### Primer 1 (lažji)

S programom izračunaj vsoto števil od $1$ do $100$ in rezultat preveri z Gaussovo formulo $n(n + 1)/2$.

**Podatki:** števila od $1$ do $n = 100$
**Iščemo:** vsoto $s$ in preizkus

:::formula
seštevalnik: `s = 0` pred zanko, `s += k` v zanki `for k in range(1, n + 1)`; preizkus $s = \dfrac{n(n + 1)}{2}$
:::

**Rešitev:**

1. Zgornja meja `range` ni vključena, zato za $100$ potrebujemo `range(1, 101)`:

```python
n = 100
s = 0
for k in range(1, n + 1):
    s += k
print(s)
```

2. Zanka se izvede $101 - 1 = 100$-krat, `s` po vrsti postane $1, 3, 6, 10, \dots$
3. Program izpiše `5050`.
4. Preizkus: $100 \cdot 101/2 = 5050$. ✓
5. Odgovor: vsota je $5050$. Z `range(1, 100)` bi dobil $4950$ – napaka za ena.

### Primer 2

V praktikumu vnašaš izmerjene nihajne čase nihala v sekundah, dokler ne vneseš prazne vrstice. Program naj izpiše število meritev, povprečje, največjo vrednost in koliko meritev je daljših od $2{,}0\,\mathrm{s}$. Kaj izpiše pri vnosih $2{,}03$; $1{,}98$; $2{,}07$; $2{,}01$; $1{,}95$ (nato prazno)?

**Podatki:** meritve $2{,}03$; $1{,}98$; $2{,}07$; $2{,}01$ in $1{,}95\,\mathrm{s}$, prazna vrstica za konec, meja $2{,}0\,\mathrm{s}$
**Iščemo:** število meritev, povprečje, največjo vrednost, število nad mejo

:::formula
`while True` z `break` ob prazni vrstici; števec `n += 1`; seštevalnik `s += t`; največja: `if t > mx: mx = t`; povprečje $\bar t = s/n$
:::

**Rešitev:**

1. Program:

```python
n = 0
s = 0.0
nad = 0
mx = None
while True:
    v = input("t (s): ")
    if v == "":
        break
    t = float(v)
    n += 1
    s += t
    if mx is None or t > mx:
        mx = t
    if t > 2.0:
        nad += 1
if n > 0:
    print(n, s / n, mx, nad)
```

2. `mx = None` pomeni »še ni meritve«; pri prvi meritvi pogoj `mx is None` poskrbi, da `mx` dobi prvo vrednost. Začetna vrednost `0` bi bila napačna pri samih negativnih podatkih.
3. Obhodi: `n` naraste do $5$, `s` do $2{,}03 + 1{,}98 + 2{,}07 + 2{,}01 + 1{,}95 = 10{,}04$.
4. Največja vrednost je $2{,}07$; nad $2{,}0$ so $2{,}03$; $2{,}07$ in $2{,}01$, torej `nad` $= 3$.
5. Povprečje: $10{,}04/5 = 2{,}008$.
6. Pogoj `if n > 0` prepreči deljenje z nič, če uporabnik takoj vnese prazno vrstico.
7. Odgovor: program izpiše `5 2.008 2.07 3`.

### Primer 3 (težji)

Žogico spustiš z višine $h_0 = 2{,}0\,\mathrm{m}$; koeficient odboja je $e = 0{,}8$, zato je vsak naslednji vrh $e^2 = 0{,}64$ prejšnjega, čas padca z višine $h$ pa je $\sqrt{2h/g}$. Napiši program, ki sešteje skupno pot in skupni čas gibanja, dokler višina odboja ne pade pod $1\,\mathrm{mm}$, in prešteje te odboje. Rezultat primerjaj z vsoto neskončne geometrijske vrste. $g = 9{,}81\,\mathrm{m/s^2}$.

**Podatki:** $h_0 = 2{,}0\,\mathrm{m}$, $e = 0{,}8$, meja $0{,}001\,\mathrm{m}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** število odbojev, pot $s$, čas $t$; primerjava z neskončno vrsto

:::formula
vsak odboj: $h \leftarrow e^2h$, pot $+2h$, čas $+2\sqrt{2h/g}$; neskončno: $s_\infty = h_0\dfrac{1 + e^2}{1 - e^2}$, $t_\infty = t_0\dfrac{1 + e}{1 - e}$, $t_0 = \sqrt{2h_0/g}$
:::

**Rešitev:**

1. Prvi padec da pot $h_0$ in čas $t_0 = \sqrt{2 \cdot 2{,}0/9{,}81}\,\mathrm{s} \approx 0{,}639\,\mathrm{s}$. Vsak odboj doda pot gor in dol ($2h$) ter dvakratni čas padca z višine $h$.
2. Program (`break` konča zanko, ko je odboj prenizek; šteje se le odboj, ki ni pod mejo):

```python
import math
g, h0, e = 9.81, 2.0, 0.8
h = h0
pot = h0
cas = math.sqrt(2 * h0 / g)
odboji = 0
while True:
    h = h * e * e
    if h < 0.001:
        break
    odboji += 1
    pot += 2 * h
    cas += 2 * math.sqrt(2 * h / g)
print(odboji, pot, cas)
```

3. Število odbojev: $0{,}64^n \cdot 2{,}0 \geq 0{,}001$ velja do $n = 17$ ($0{,}64^{17} \cdot 2{,}0 \approx 0{,}0010$), pri $n = 18$ je višina pod $1\,\mathrm{mm}$. Program izpiše `17`.
4. Izpisana pot je približno $9{,}108\,\mathrm{m}$, čas približno $5{,}63\,\mathrm{s}$.
5. Neskončna vrsta: $s_\infty = 2{,}0 \cdot 1{,}64/0{,}36\,\mathrm{m} \approx 9{,}111\,\mathrm{m}$; $t_\infty = 0{,}639 \cdot 1{,}8/0{,}2\,\mathrm{s} \approx 5{,}75\,\mathrm{s}$.
6. Pot se ujema na tri veljavna mesta, ker členi padajo kot $0{,}64^n$. Čas pa zaostane za okoli $0{,}12\,\mathrm{s}$: časovni členi padajo le kot $0{,}8^n$, zato je ostanek vrste večji.
7. Odgovor: $17$ odbojev nad $1\,\mathrm{mm}$, pot okoli $9{,}11\,\mathrm{m}$, čas okoli $5{,}63\,\mathrm{s}$; neskončni odboji bi dali $9{,}111\,\mathrm{m}$ in $5{,}75\,\mathrm{s}$ – končen čas za neskončno odbojev.

### Primer 4 – zdaj ti

Z zanko `while` izračunaj vsoto števk števila $2026$ in preštej, koliko števk ima. Uporabi ostanek pri deljenju z $10$ (zadnja števka) in celoštevilsko deljenje z $10$ (odstrani zadnjo števko).

**Podatki:** $x = 2026$
**Iščemo:** vsoto števk $s$ in število števk $k$

:::formula
`while x > 0:` `s += x % 10`, `x //= 10`, `k += 1`
:::

**Rešitev:**

1. Program:

```python
x = 2026
s = 0
k = 0
while x > 0:
    s += x % 10
    x //= 10
    k += 1
print(s, k)
```

2. Mera napredka je `x`: je nenegativno celo število in se v vsakem obhodu zmanjša, zato se zanka konča.
3. Prvi obhod: `x % 10` je `6`, `s` postane $6$, `x` postane $202$, `k` postane $1$.
4. Zdaj ti: nadaljuj sledilno tabelo do konca in povej izpis.

:::premisli
Kaj izpiše program?
---
Drugi obhod: `s` $= 6 + 2 = 8$, `x` $= 20$, `k` $= 2$. Tretji: `s` $= 8 + 0 = 8$, `x` $= 2$, `k` $= 3$. Četrti: `s` $= 10$, `x` $= 0$, `k` $= 4$. Pogoj `0 > 0` je `False`. Izpis `10 4`. Za $x = 0$ bi program izpisal `0 0` – števka $0$ bi bila spregledana, kar je robni primer.
:::

## Pogoste napake

- **Neskončna zanka.** Telo ne spremeni spremenljivke v pogoju (pozabljen `n += 1` ali `h = h * 0.64`). Preden poženeš, poišči mero napredka.
- **Napaka za ena pri `range`.** `range(1, 100)` ne vsebuje $100$. Število obhodov preveri z $\lceil (b - a)/k\rceil$ ali z majhnim primerom.
- **Seštevalnik v telesu.** `s = 0` znotraj zanke vsoto v vsakem obhodu izbriše; začetne vrednosti gredo pred zanko.
- **Napačen zamik.** `print` z enakim zamikom kot telo se izvede v vsakem obhodu, ne le enkrat po zanki.
- **`break` konča vse zanke.** Konča le najbližjo; za izhod iz gnezdene zanke potrebuješ zastavico ali funkcijo z `return`.

## Povzetek

- `while P:` ponavlja telo, dokler je `P` resničen; pogoj se preveri pred vsakim obhodom; potrebna je mera napredka.
- `for x in zaporedje:` izvede telo za vsak element; `range(a, b, k)` da $a, a + k, \dots$ do (brez) $b$.
- Seštevalnik `s = 0` in števec `n = 0` pred zanko, `s += x`, `n += 1` v zanki.
- Invarianta zanke dokaže pravilnost (indukcija po obhodih).
- `break` konča najbližjo zanko, `continue` preskoči preostanek obhoda; `while True` z `break` za neznano število podatkov.

## Za izpit

Znati moraš povedati:

- natančen pomen zank `while` in `for` ter kdaj se telo izvede nič-krat;
- kako zapišeš `for` po `range` z `while` in koliko obhodov da `range(a, b, k)`;
- pojem invariante zanke in dokaz pravilnosti seštevalnika z indukcijo;
- pojem mere napredka in zakaj zagotavlja, da se zanka konča;
- delovanje `break` in `continue`, tudi v gnezdenih zankah.

### Naloga 1

Vsota $1 + \frac{1}{4} + \frac{1}{9} + \dots$ teži proti $\pi^2/6 \approx 1{,}6449$. (a) Napiši program, ki poišče najmanjši $n$, pri katerem delna vsota $S_n = \sum_{k=1}^{n} 1/k^2$ preseže $1{,}64$, in izpiše $n$ in $S_n$. (b) Kaj se zgodi, če mejo spremeniš na $1{,}65$? Popravi program, da se v vsakem primeru konča po največ $10^6$ členih, in pove, ali je mejo dosegel.

**Rešitev:**

1. (a) Ne vemo, koliko členov potrebujemo, zato `while`:

```python
S = 0.0
k = 0
while S <= 1.64:
    k += 1
    S += 1 / k**2
print(k, S)
```

2. Invarianta: po vsakem obhodu je `S` $= S_k$. Ker so členi pozitivni, `S` strogo narašča.
3. Program izpiše `203 1.6400200718...`: $S_{202} \leq 1{,}64 < S_{203}$. Oceno potrdi ostanek vrste, ki je približno $1/n$: $1{,}6449 - 1{,}64 \approx 0{,}0049$, torej $n \approx 1/0{,}0049 \approx 204$.
4. (b) Pri meji $1{,}65 > \pi^2/6$ vsota nikoli ne preseže meje: pogoj ostane resničen in zanka se ne konča. Pozitivni členi ne zagotavljajo napredka proti cilju, ki ga ni mogoče doseči.
5. Popravek z omejitvijo števila členov:

```python
meja = 1.65
S = 0.0
k = 0
dosegel = False
while k < 10**6:
    k += 1
    S += 1 / k**2
    if S > meja:
        dosegel = True
        break
print(k, S, dosegel)
```

6. Mera napredka je zdaj $10^6 - k$, ki je nenegativna in v vsakem obhodu pade za $1$, zato se zanka zagotovo konča. Za mejo $1{,}65$ izpiše `1000000`, vsoto okoli $1{,}644933$ in `False`.
7. Odgovor: (a) $n = 203$, $S_n \approx 1{,}64002$; (b) brez omejitve neskončna zanka; s števcem in `break` se program konča in pove, da meje ni dosegel.

### Naloga 2

Natančno opiši pomen zanke `while`. Za program, ki z zanko `for k in range(1, n + 1)` sešteje $1 + 2 + \dots + n$, navedi invarianto zanke in z indukcijo dokaži, da po zanki velja `s` $= n(n + 1)/2$. Pokaži, kako isto zapišeš z `while`, in dokaži, da se ta zanka konča. Utemelji, koliko obhodov naredi `range(a, b, k)` pri $k > 0$.

**Rešitev:**

1. Pomen: izračunaj `bool(P)`; če `True`, izvedi telo in ponovi; če `False`, nadaljuj za zanko.
2. Invarianta: po obhodu s števcem $k$ je `s` $= 1 + 2 + \dots + k$.
3. Indukcija: pred prvim obhodom `s` $= 0$ (prazna vsota). Če velja za $k - 1$, po obhodu `s` $= (1 + \dots + (k - 1)) + k$. Po obhodu $k = n$ je `s` $= 1 + \dots + n$, kar je po Gaussovi formuli $n(n + 1)/2$.
4. Z `while`: `s = 0`, `k = 1`, `while k <= n:` `s += k`, `k += 1`.
5. Mera napredka: $n + 1 - k$ je pred vsakim obhodom nenegativno celo število (ker `k <= n`) in se v obhodu zmanjša za $1$; zato je obhodov največ $n$.
6. Obhodi `range(a, b, k)`: vrednosti so $a + ik$ za $i = 0, 1, \dots$, dokler je $a + ik < b$, torej $i < (b - a)/k$. Število celih $i \geq 0$ s to lastnostjo je $\lceil (b - a)/k\rceil$ (pri $a \geq b$ nič).

### Naloga 3

Kaj izpiše program? Utemelji z opisom obhodov.

```python
for i in range(1, 5):
    for j in range(1, 5):
        if j == i:
            continue
        if i * j > 6:
            break
        print(i, j)
```

**Rešitev:**

1. `continue` preskoči par z enakima številoma, `break` konča **notranjo** zanko, ko zmnožek preseže $6$; zunanja nadaljuje.
2. `i = 1`: `j = 1` preskočen; `j = 2`, `3`, `4` dajo zmnožke $2$, $3$, $4$; izpis `1 2`, `1 3`, `1 4`.
3. `i = 2`: `j = 1` ($2$) izpis `2 1`; `j = 2` preskočen; `j = 3` ($6$, ni večje od $6$) izpis `2 3`; `j = 4` ($8 > 6$) `break`.
4. `i = 3`: `j = 1` ($3$) izpis `3 1`; `j = 2` ($6$) izpis `3 2`; `j = 3` preskočen; `j = 4` ($12$) `break`.
5. `i = 4`: `j = 1` ($4$) izpis `4 1`; `j = 2` ($8$) `break`.
6. Odgovor: osem vrstic, `1 2`, `1 3`, `1 4`, `2 1`, `2 3`, `3 1`, `3 2`, `4 1`.

## Drugače: Z analogijo

**`while` kot polnjenje bazena.** Čuvaj odpira ventil in vsakih nekaj minut pogleda, ali je voda že do črte. Dokler ni, pusti ventil odprt in spet pogleda. Ne ve vnaprej, kolikokrat bo pogledal. Če pozabi odpreti ventil (telo ne spremeni stanja), gleda v nedogled – neskončna zanka.

**`for` kot preverjanje epruvet v stojalu.** Laborant vzame vsako epruveto po vrsti, nanjo nalepi nalepko in jo vrne. Število korakov je določeno s številom epruvet v stojalu. `range(a, b, k)` je stojalo z označenimi mesti od $a$ do (brez) $b$ s korakom $k$.

**Seštevalnik kot blagajna.** Na začetku dneva blagajno izprazniš (`s = 0`), ob vsakem nakupu prišteješ znesek. Če bi jo izpraznil ob vsakem nakupu (`s = 0` v telesu), bi zvečer v njej ostal le zadnji znesek.

**`break` kot zasilni izklop.** Tekoči trak dela, dokler ga ne ustavi pogoj. Senzor, ki zazna napako sredi cikla, trak ustavi takoj, ne šele ob koncu cikla.

## Drugače: Korak za korakom s številkami

Kolikokrat se izvede telo in kaj izpiše program?

```python
s = 0
for k in range(0, 10, 3):
    s += k
print(s)
```

1. **Vrednosti `range(0, 10, 3)`:** $0$, $3$, $6$, $9$; naslednja bi bila $12 \geq 10$, zato ne. Obhodov: $\lceil 10/3\rceil = 4$.
2. **Obhod 1:** `k = 0`, `s` $= 0 + 0 = 0$.
3. **Obhod 2:** `k = 3`, `s` $= 0 + 3 = 3$.
4. **Obhod 3:** `k = 6`, `s` $= 3 + 6 = 9$.
5. **Obhod 4:** `k = 9`, `s` $= 9 + 9 = 18$.
6. **Po zanki:** `print` ni zamaknjen, izvede se enkrat in izpiše `18`.
7. **Preizkus:** $0 + 3 + 6 + 9 = 18$. ✓

## Drugače: Bolj natančno

**`else` pri zanki.** Python dovoli `else` tudi za zanko: blok `else` se izvede, ko se zanka konča **brez** `break` (pogoj `while` postane neresničen ali `for` porabi zaporedje). Zastavico `dosegel` iz Naloge 1 bi lahko nadomestili z `else:` za zanko, ki izpiše »meje ni dosegel«.

**Plavajoča vejica v zankah.** Desetkratno prištevanje `0.1` da `0.9999999999999999`, ne `1.0`, ker $0{,}1$ v dvojiškem zapisu ni točen. Zanka `while x != 1.0: x += 0.1` se zato nikoli ne konča. Pogojev zank s števili `float` ne piši z `==` ali `!=`; uporabi `<`, `<=` ali celoštevilski števec in vrednost izračunaj kot `x = k * 0.1`.

**Časovna zahtevnost.** Gnezdeni zanki z $n$ obhodi vsaka izvedeta notranje telo $n^2$-krat. Pri $n = 10^4$ je to $10^8$ obhodov, za Python nekaj deset sekund. Zato je pri velikih podatkih pomembno, kolikokrat se telo izvede, ne le, ali je program pravilen. Knjižnica NumPy opravi isto delo z operacijami nad celimi tabelami brez zank v Pythonu, mnogo hitreje.

**Delna pravilnost in ustavitev.** Invarianta dokaže, da je rezultat pravilen, **če** se zanka konča (delna pravilnost); mera napredka dokaže, da se konča. Šele oboje skupaj da popolno pravilnost. Za nekatere zanke ustavitve ne zna dokazati nihče: pri Collatzovi zanki (`n = n // 2` za sodo, `n = 3 * n + 1` za liho, dokler `n != 1`) je odprto vprašanje, ali se konča za vsak začetni $n$.

## Preveri se

? Študent pri zagovoru reče: »Moja zanka ima mero napredka `n - i`.« Kaj s tem trdi?
- Da se `n - i` v vsakem obhodu izpiše.
~ Mera napredka ni izpis, ampak količina za dokaz, da se zanka konča.
+ Da je `n - i` nenegativno celo število, ki se v vsakem obhodu zmanjša, zato se zanka konča.
- Da je po zanki `n - i` enako vsoti.
~ To bi bila invarianta (trditev o rezultatu), ne mera napredka.
> Mera napredka je nenegativno celo število, ki v vsakem obhodu pade vsaj za $1$; zato zanka ne more teči v nedogled.

? Razvrsti vrstice programa za povprečje $n$ vnesenih števil v pravilen vrstni red: (A) `s += float(input())`, (B) `print(s / n)`, (C) `s = 0`, (D) `for i in range(n):`.
- D, C, A, B
~ `s = 0` v telesu ali takoj za glavo zanke bi vsoto ponastavljal; začetna vrednost gre pred zanko.
+ C, D, A, B
- C, D, B, A
~ `print` pred prištevanjem bi izpisal povprečje, preden so prebrana vsa števila; izpis gre za zanko.
> Najprej seštevalnik (C), nato zanka (D) s prištevanjem v telesu (A, zamaknjeno), izpis (B) brez zamika po zanki.

? Kaj se zgodi, če v programu za žogico pozabiš vrstico `h = h * 0.64`?
- Program izpiše `0 1.0`.
~ Pogoj `1.0 >= 0.01` je resničen, zato se telo izvede vsaj enkrat; `n` se poveča.
- Program javi napako.
~ Sintaktično je vse pravilno; Python ne prepozna, da se pogoj nikoli ne spremeni.
+ Zanka se nikoli ne konča, `n` raste brez meje.
> `h` ostane $1{,}0$, pogoj je vedno resničen. Ni mere napredka, zato je zanka neskončna.

? Kolikokrat se izvede telo zanke `for k in range(3, 20, 4):`?
- $4$
~ Pozabil si zadnjo vrednost $19$, ki je še manjša od $20$.
+ $5$
- $17$
~ $17 = 20 - 3$ je število obhodov pri koraku $1$; s korakom $4$ jih je mnogo manj.
> Vrednosti so $3, 7, 11, 15, 19$; $\lceil 17/4\rceil = 5$.

? Kaj izpiše program `s = 0`, `for k in range(1, 6):`, `    if k % 2 == 0:`, `        continue`, `    s += k`, `print(s)`?
- $15$
~ To je vsota vseh od $1$ do $5$; `continue` preskoči soda števila.
- $6$
~ To je vsota sodih števil $2 + 4$; `continue` preskoči prav ta.
+ $9$
> Prištejejo se le liha: $1 + 3 + 5 = 9$.

:::simboli
n | število odbojev (obhodov) | | –
h | višina | | m
h_0 | začetna višina | | m
e | koeficient odboja | | –
g | težni pospešek | | m/s^2
s | seštevalnik (vsota, pot) | | –
s_\infty | pot pri neskončno odbojih | s_\infty = h_0\frac{1 + e^2}{1 - e^2} | m
t_\infty | čas pri neskončno odbojih | t_\infty = t_0\frac{1 + e}{1 - e} | s
t_0 | čas prvega padca | t_0 = \sqrt{2h_0/g} | s
\bar t | povprečni nihajni čas | \bar t = \frac{s}{n} | s
S_n | delna vsota | S_n = \sum_{k=1}^{n} \frac{1}{k^2} | –
k | števec obhodov | | –
x | obdelovano število | | –
:::
