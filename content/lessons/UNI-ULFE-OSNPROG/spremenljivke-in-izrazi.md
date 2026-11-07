---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Kolokvijsko vprašanje: »Kaj izpiše program?« Brez računalnika.

```python
x = 7
y = 2
print(x // y * y + x % y, -x ** y, 2 ** 3 ** 2)
print(x / y > 3 and not y == 2 or x < 0)
```

Če si za drugo število napisal `49` in za tretje `64`, nisi sam, a oba odgovora sta napačna. Računalnik izraz izračuna po točnih pravilih: katera operacija ima prednost, v katero smer se združujejo enake operacije in kakšnega tipa je vmesni rezultat. Program za ceno z DDV, obrok kredita ali število palet je pravilen le, če je vsak izraz izračunan tako, kot si mislil. Odgovor je na koncu Razlage.

Primeri so v Pythonu 3; ideje (tipi, prednost operatorjev, vhod in izhod) veljajo v vseh jezikih, podrobnosti pa se razlikujejo.

## Razlaga

**1. Spremenljivka, vrednost, izraz.** Program v enem koraku algoritma zapiše:

```python
cena = 40.0
```

**Definicija.** **Spremenljivka** je ime, povezano z vrednostjo v pomnilniku. **Prirejanje** `ime = izraz` najprej izračuna desno stran s trenutnimi vrednostmi in šele nato ime poveže z rezultatom. Zato je `n = n + 1` smiselno: »povečaj `n` za ena«. Znak `=` ni matematična enakost.

**Definicija.** **Izraz** je zapis iz vrednosti (literalov), imen spremenljivk, operatorjev in klicev funkcij, ki se **izračuna** v natanko eno vrednost. `3`, `cena`, `cena * 1.22` in `len("abc") + 1` so izrazi. `cena = 40.0` je **stavek**: ne da vrednosti, ampak nekaj naredi.

**2. Podatkovni tipi.** Vsaka vrednost ima **tip**: množico dovoljenih vrednosti in operacij nad njimi. Osnovni štirje:

| Tip | Vrednosti | Primer |
|---|---|---|
| `int` | cela števila | `-4`, `2025` |
| `float` | decimalna števila | `3.5`, `1e-3` |
| `str` | nizi (besedilo) | `"Ana"`, `"42"` |
| `bool` | logični vrednosti | `True`, `False` |

V Pythonu tip pripada **vrednosti**, ne imenu: po `a = 5` in nato `a = "pet"` je `a` niz. Tip izveš s `type(a)`. Iz tipa je odvisen pomen operatorja: `3 + 4` je `7`, `"3" + "4"` pa `"34"` (stik nizov).

**3. Aritmetični operatorji.**

- `+`, `-`, `*`: seštevanje, odštevanje, množenje;
- `/`: deljenje, rezultat je **vedno** `float` (`6 / 3` je `2.0`);
- `//`: celoštevilsko deljenje (zaokroži navzdol);
- `%`: ostanek;
- `**`: potenciranje (`2 ** 10` je `1024`; znak `^` v Pythonu ni potenca).

**Pravilo (tip rezultata).** Pri `+`, `-`, `*`, `//`, `%` in `**` z nenegativnim celim eksponentom je rezultat `int`, če sta oba operanda `int`; če je vsaj eden `float`, je rezultat `float`.

**Definicija.** Za celi števili $a$ in $b \neq 0$ je `a // b` največje celo število $q$ z $q \le \frac{a}{b}$, ostanek pa `a % b` $= a - bq$. Za $b > 0$ velja $0 \le$ `a % b` $< b$. Primeri: `17 // 5` je `3` in `17 % 5` je `2`; `-17 // 5` je `-4` in `-17 % 5` je `3`, ker je $-17 = 5 \cdot (-4) + 3$.

**4. Kdo ima prednost? Najprej opazuj.** Python vrne:

| Izraz | Izpis |
|---|---|
| `2 + 3 * 4` | `14` |
| `10 - 4 - 3` | `3` |
| `2 * 3 % 4` | `2` |
| `2 ** 3 ** 2` | `512` |
| `-3 ** 2` | `-9` |

Prvi dve vrstici sta kot v matematiki: množenje pred seštevanjem, odštevanje od leve proti desni ($(10 - 4) - 3$). Tretja pokaže, da sta `*` in `%` **na isti ravni** in se računata od leve: $(2 \cdot 3) \bmod 4 = 2$. Zadnji dve sta drugačni. `2 ** 3 ** 2` je $2^{(3^2)} = 2^9$, torej se potence združujejo **od desne**. Pri `-3 ** 2` ima potenca prednost pred predznakom: $-(3^2) = -9$.

**Pravilo (prednost operatorjev v Pythonu,** od najmočnejše do najšibkejše**):**

1. oklepaji `( )` in klici funkcij,
2. `**` (združuje od desne),
3. predznak `-x`, `+x`,
4. `*`, `/`, `//`, `%`,
5. `+`, `-`,
6. primerjave `<`, `<=`, `>`, `>=`, `==`, `!=`,
7. `not`,
8. `and`,
9. `or`.

Vse dvomestne operacije razen `**` se na isti ravni združujejo **od leve**. Kadar nisi prepričan, piši oklepaj.

:::premisli
Napovej vrednost izraza `2 * -3 ** 2`. Kaj se zgodi najprej?
---
Najprej `3 ** 2 = 9` (potenca je močnejša od predznaka), nato predznak da `-9`, nazadnje `2 * -9 = -18`. Kdor računa $(-3)^2$, dobi napačnih $18$.
:::

**5. Primerjave in logični izrazi.** Primerjava vrne `bool`. Python dovoli **verižne primerjave**: `0 < x < 10` pomeni `0 < x and x < 10`. Logični operatorji so `not`, `and` in `or`.

**Pravilo (kratkostično vrednotenje).** Pri `A and B` se `B` izračuna le, če je `A` resničen; pri `A or B` le, če je `A` neresničen. Zato je izraz

```python
y != 0 and x / y > 1
```

varen tudi pri `y = 0`: ker je `y != 0` neresnično, se deljenje sploh ne izvede in rezultat je `False`. Obrnjen vrstni red (`x / y > 1 and y != 0`) pri `y = 0` javi napako `ZeroDivisionError`.

Natančneje: `and` in `or` vrneta enega od operandov, ne nujno `True` ali `False`: `"" or "gost"` je `"gost"`.

**6. Vhod in izhod.** Funkcija `input(poziv)` izpiše poziv, počaka na vrstico s tipkovnice in jo vrne kot **niz**. Za računanje jo pretvorimo:

```python
kos = int(input("Število kosov: "))
cena = float(input("Cena kosa: "))
```

Funkcija `print` izpiše več vrednosti, privzeto ločenih s presledkom in s prehodom v novo vrstico na koncu. To spremenita argumenta `sep` in `end`: `print(1, 2, 3, sep=", ", end="!\n")` izpiše `1, 2, 3!`.

Za lep izpis števil uporabljamo **f-nize**: izraz v zavitih oklepajih se izračuna in vstavi, za dvopičjem pa je oblika. `f"{43.9167:.2f} €"` je `"43.92 €"` (dve decimalki), `f"{7:3d}"` je `"  7"` (širina tri). Zapis zaokroži le pri izpisu, vrednost spremenljivke ostane enaka.

Funkcija `round(x, n)` vrne zaokroženo število. Pozor: `round(2.5)` je `2` in `round(3.5)` je `4` (pri točni polovici gre k sodemu številu), `round(2.675, 2)` pa je `2.67`, ker `2.675` v dvojiškem zapisu ni točno shranjen.

:::premisli
Uporabnik vpiše `12`. Kaj izpiše `n = input(); print(n * 3)` in kaj `n = int(input()); print(n * 3)`? Zakaj se izpisa razlikujeta?
---
Prvi izpiše `121212`, ker je `n` niz `"12"` in `*` niz ponovi. Drugi izpiše `36`, ker je `n` celo število. Vhod je vedno niz; tip določi pretvorba.
:::

**7. Prirejanje z operacijo in hkratno prirejanje.** `s += 4` pomeni `s = s + 4`; enako `-=`, `*=`, `//=`, `%=`. Pri **hkratnem prirejanju** `a, b = b, a + b` se najprej izračunata **obe** desni vrednosti s starima `a` in `b`, šele nato se priredita. Po `a, b = 3, 5` in `a, b = b, a + b` je `a = 5`, `b = 8`.

**Odgovor na kolokvijsko vprašanje.** `x // y * y + x % y` je $3 \cdot 2 + 1 = 7$ (vedno se vrne $x$). `-x ** y` je $-(7^2) = -49$. `2 ** 3 ** 2` je $2^9 = 512$. Druga vrstica je `False` (razčlenitev po ravneh je v »Korak za korakom«). Program izpiše `7 -49 512` in `False`.

## Rešeni primeri

### Primer 1 (lažji)

Trgovina ima izdelek z neto ceno $40{,}00$ €. Dodati mora DDV $22\,\%$, nato dati popust $10\,\%$. Kaj izpiše program?

```python
neto = 40.00
ddv = 22
popust = 10
bruto = neto * (1 + ddv / 100)
koncna = bruto * (1 - popust / 100)
print(f"{koncna:.2f} €")
```

**Podatki:** `neto = 40.00` (€), `ddv = 22` (%), `popust = 10` (%), izpis z dvema decimalkama
**Iščemo:** izpis programa

:::formula
Oklepaji imajo prednost; `/` vrne `float`; `f"{x:.2f}"` izpiše dve decimalki.
:::

**Rešitev:**

1. V oklepaju najprej `ddv / 100`, kar je `0.22`, nato `1 + 0.22 = 1.22`.
2. `bruto` je $40 \cdot 1{,}22 = 48{,}8$, v Pythonu `48.8`.
3. `1 - popust / 100` je $1 - 0{,}1 = 0{,}9$, zato je `koncna` $48{,}8 \cdot 0{,}9 = 43{,}92$.
4. Brez oklepajev bi `neto * 1 + ddv / 100` dal $40{,}22$: množenje pred seštevanjem.
5. Odgovor: program izpiše `43.92 €`.

### Primer 2

Podjetje pakira izdelke v škatle po $12$. Za naročilo $100$ izdelkov potrebuje polne škatle in eno delno. Napiši izraz za število škatel in izraz za število izdelkov v zadnji škatli. Preveri na $n = 100$ in $n = 96$.

**Podatki:** škatla sprejme $k = 12$ izdelkov, naročilo $n = 100$, za preizkus še $n = 96$
**Iščemo:** število škatel in vsebino zadnje škatle

:::formula
Za $k > 0$: $n = k \cdot q + r$ z $q =$ `n // k`, $r =$ `n % k`, $0 \le r < k$. Zaokrožitev navzgor: `(n + k - 1) // k`.
:::

**Rešitev:**

1. Polnih škatel je `100 // 12`, kar je `8` ($8 \cdot 12 = 96$).
2. Ostane `100 % 12`, kar je `4`; preizkus: $8 \cdot 12 + 4 = 100$.
3. Ker so ostali izdelki, potrebujemo še eno škatlo, skupaj $9$. Z enim izrazom: `(100 + 11) // 12` je `111 // 12`, torej `9`.
4. Prištevanje $k - 1$ potisne vsak neničelni ostanek čez naslednji večkratnik $k$ (dokaz v Nalogi 2). Za $n = 96$: `107 // 12` je `8`, ostanek `0`.
5. Zadnja škatla: če je `n % k` enako `0`, je polna ($12$), sicer ima `n % k` izdelkov. Pri $n = 100$ ima $4$ izdelke.
6. Odgovor: `skatle = (n + k - 1) // k`; pri $100$ izdelkih je to $9$ škatel, v zadnji so $4$ izdelki. Pri $96$ izdelkih je $8$ polnih škatel.

### Primer 3 (težji)

Program naj prebere glavnico, letno obrestno mero v odstotkih in število let ter izpiše končni znesek z obrestnimi obresti in obresti, oboje na dve decimalki. Študent je napisal:

```python
G = input("Glavnica: ")
p = float(input("Obrestna mera v %: "))
n = int(input("Leta: "))
K = G * 1 + p / 100 ** n
print("Znesek:", K, "obresti:", K - G)
```

(a) Kaj se zgodi pri vnosu `1500`, `3.5`, `4`? (b) Najdi vse napake in napiši pravilen program. (c) Kaj izpiše popravljeni program?

**Podatki:** vnos `"1500"`, `"3.5"`, `"4"`; formula za obrestno obrestovanje; izpis na dve decimalki
**Iščemo:** obnašanje danega programa, popravljen program, izpis

:::formula
$K = G\left(1 + \frac{p}{100}\right)^n$; prednost: `**` pred `*` in `/` pred `+`; `input` vrne niz.
:::

**Rešitev:**

1. (a) `G` je niz `"1500"`, ker manjka pretvorba. V četrti vrstici `G * 1` da spet niz `"1500"`, nato `"1500" + ...` s številom javi `TypeError`.
2. (b) Prva napaka: `G = float(input("Glavnica: "))`.
3. Druga napaka je prednost. Python izraz `G * 1 + p / 100 ** n` bere kot `(G * 1) + (p / (100 ** n))`, saj je `**` najmočnejši, nato `*` in `/`, nato `+`. Pri popravljenem `G` bi dobili $1500 + \frac{3{,}5}{10^8}$, skoraj $1500$.
4. Pravilno: `K = G * (1 + p / 100) ** n`. Tu oklepaj izračunamo prvi ($1{,}035$), nato potenco, nato množenje.
5. Tretja napaka: izpis ni zaokrožen. Zadnja vrstica naj bo `print(f"Znesek: {K:.2f}, obresti: {K - G:.2f}")`.
6. (c) $1{,}035^4 = 1{,}147523$, zato $K = 1500 \cdot 1{,}147523 = 1721{,}28$; obresti so $1721{,}28 - 1500 = 221{,}28$.
7. Odgovor: dani program se ustavi z napako `TypeError`. Popravljeni program izpiše `Znesek: 1721.28, obresti: 221.28`.

### Primer 4 – zdaj ti

Delavnica ima mesečne stalne stroške $12\,500$ €. Izdelek prodaja po $25$ €, spremenljivi strošek na kos je $17$ €. Koliko kosov mora prodati, da pokrije stalne stroške (prag pokritja)? Napiši izraz v Pythonu, ki da celo število kosov.

**Podatki:** `F = 12500` (€), `c = 25` (€/kos), `v = 17` (€/kos)
**Iščemo:** najmanjše celo število kosov $q$, da je $q(c - v) \ge F$

:::formula
$q = \frac{F}{c - v}$, zaokroženo navzgor: `(F + d - 1) // d` z `d = c - v`.
:::

**Rešitev:**

1. Prispevek enega kosa je `c - v`, torej `8` €.
2. `F / (c - v)` je `1562.5`, kar ni celo število kosov; zaokrožiti moramo **navzgor**.
3. Zapiši izraz po Primeru 2 in ga izračunaj. Zakaj `int(F / (c - v))` ne bi bil pravilen?

:::premisli
Kakšen je izraz in koliko kosov je treba prodati?
---
`d = c - v`, `q = (F + d - 1) // d` da `12507 // 8`, torej `1563`. `int(1562.5)` bi dal `1562`, kar prinese le $12\,496$ € in ne pokrije stroškov.
:::

## Pogoste napake

- **Vhod ni pretvorjen.** `input()` vedno vrne niz. `"3" + "4"` je `"34"`, `"3" + 4` pa napaka. Pretvori takoj pri branju: `int(input())` ali `float(input())`.
- **Predznak in potenca.** `-3 ** 2` je `-9`, ne `9`. Če misliš $(-3)^2$, piši oklepaj. Enako `2 ** 3 ** 2` je $2^9$, ne $8^2$.
- **Znak `^` za potenco.** V Pythonu je `^` bitni »izključni ali«: `2 ^ 3` je `1`. Potenca je `**`.
- **Pozabljeni oklepaji pri ulomkih.** `a + b / 2` ni povprečje: deli se le `b`. Povprečje je `(a + b) / 2`.
- **Zaokrožitev z `int`.** `int(x)` odreže decimalke, ne zaokroži: `int(2.9)` je `2`. Za zaokrožitev navzgor pri celih številih uporabi `(n + k - 1) // k`, za najbližje celo število `round`.

## Povzetek

- Izraz se izračuna v eno vrednost s tipom; prirejanje najprej izračuna desno stran.
- Osnovni tipi: `int`, `float`, `str`, `bool`; tip pripada vrednosti in določa pomen operatorja.
- `/` vrne `float`; `//` zaokroži navzdol; `a == b * (a // b) + a % b`; za $b > 0$ je $0 \le$ `a % b` $< b$.
- Prednost: oklepaji, `**` (od desne), predznak, `* / // %`, `+ -`, primerjave, `not`, `and`, `or`; sicer od leve.
- `and` in `or` računata kratkostično; verižna primerjava `0 < x < 10`.
- `input` vrne niz; `print` s `sep` in `end`; f-niz `f"{x:.2f}"`; `round` pri polovici k sodemu.

## Za izpit

Znati moraš povedati:

- definicijo spremenljivke, prirejanja, izraza in podatkovnega tipa,
- pravilo za tip rezultata aritmetičnih operacij,
- definicijo `//` in `%` ter zvezo med njima,
- vrstni red prednosti operatorjev in smer združevanja (izjema `**`),
- kratkostično vrednotenje in zakaj je `y != 0 and x / y > 1` varen,
- vlogo `input`, pretvorb in oblikovanega izpisa.

### Naloga 1

Kaj izpiše program? Pri vsaki vrstici zapiši vrednosti spremenljivk.

```python
z = 47
a, b = z // 10, z % 10
z = b * 10 + a
a += b
print(z, a, z // a, f"{z / a:.3f}")
print(5 + 3 // 2 ** 2 * 3 - 1, not 0 or 5, 4 % 3 ** 2)
```

**Rešitev:**

1. `z // 10` je `4`, `z % 10` je `7`; hkratno prirejanje da `a = 4`, `b = 7` (desetice in enice).
2. `z = 7 * 10 + 4` je `74`: števki sta zamenjani.
3. `a += b` da `a = 11`.
4. `z // a` je `74 // 11`, torej `6`; `z / a` je $6{,}7272\ldots$, na tri decimalke `6.727`.
5. Prva vrstica izpisa: `74 11 6 6.727`.
6. `5 + 3 // 2 ** 2 * 3 - 1`: najprej `2 ** 2 = 4`; nato od leve `3 // 4 = 0` in `0 * 3 = 0`; nazadnje `5 + 0 - 1 = 4`.
7. `not 0 or 5`: `not 0` je `True`, zato se `or` ustavi in vrne `True` (desni operand se ne izračuna).
8. `4 % 3 ** 2` je `4 % 9`, torej `4`.
9. Odgovor: program izpiše `74 11 6 6.727` in `4 True 4`.

### Naloga 2

(a) Natančno definiraj `a // b` in `a % b` za celi števili $a$ in $b > 0$ ter dokaži, da je $0 \le$ `a % b` $< b$. (b) Izračunaj `-17 // 5`, `-17 % 5` in preveri zvezo. (c) Utemelji, ali za vsa cela števila $n \ge 0$ in $k \ge 1$ izraz `(n + k - 1) // k` da $\left\lceil \frac{n}{k} \right\rceil$.

**Rešitev:**

1. (a) `a // b` je največje celo število $q$ z $q \le \frac{a}{b}$; `a % b` je $r = a - bq$.
2. Iz definicije je $q \le \frac{a}{b} < q + 1$. Pomnožimo z $b > 0$: $bq \le a < bq + b$.
3. Odštejemo $bq$: $0 \le a - bq < b$, torej $0 \le r < b$. $\square$
4. (b) $\frac{-17}{5} = -3{,}4$; največje celo število, ki ni večje, je $-4$. Torej `-17 // 5` je `-4` in `-17 % 5` je $-17 - 5 \cdot (-4) = 3$. Preizkus: $5 \cdot (-4) + 3 = -17$.
5. (c) Zapišimo $n = kq + r$ z $0 \le r < k$.
6. Če je $r = 0$: $n + k - 1 = kq + (k - 1)$ in $0 \le k - 1 < k$, zato je rezultat $q = \frac{n}{k} = \left\lceil \frac{n}{k} \right\rceil$.
7. Če je $1 \le r \le k - 1$: $n + k - 1 = k(q + 1) + (r - 1)$ in $0 \le r - 1 < k$, zato je rezultat $q + 1 = \left\lceil \frac{n}{k} \right\rceil$.
8. Odgovor: da, izraz za vse $n \ge 0$, $k \ge 1$ da zaokrožitev navzgor; dokaz je ločitev primerov po ostanku.

## Drugače: Korak za korakom s številkami

Izraz `x / y > 3 and not y == 2 or x < 0` pri `x = 7`, `y = 2` razstavimo po ravneh prednosti:

1. Aritmetika: `x / y` je `3.5`.
2. Primerjave: `3.5 > 3` je `True`, `y == 2` je `True`, `x < 0` je `False`.
3. `not`: `not True` je `False`.
4. `and`: `True and False` je `False`.
5. `or`: `False or False` je `False`.

Z oklepaji, ki jih Python postavi sam: `((x / y > 3) and (not (y == 2))) or (x < 0)`. Kadar izraz bereš, ga v mislih vedno opremi z oklepaji od najmočnejše ravni navzgor.

## Drugače: Uporaba v stroki

- **Finance in računovodstvo.** Cene, DDV in obresti se računajo z decimalnimi števili; ker `float` nekaterih vrednosti ne hrani točno, bančni sistemi računajo v centih kot `int` ali z modulom `decimal`. Izpis je vedno oblikovan (`:.2f`).
- **Logistika in proizvodnja.** Število palet, škatel, voženj ali izmen je zaokrožitev navzgor; `(n + k - 1) // k` se pojavi v vsakem programu za načrtovanje.
- **Vgrajeni sistemi.** V jeziku C je `7 / 2` enako `3` (celoštevilsko deljenje pri dveh `int`), `-7 / 2` pa `-3` (odrez proti nič). Kdor prenaša kodo med jeziki, mora poznati obe pravili.

## Drugače: Bolj natančno

**Tipi in pretvorbe.** Python je **dinamično** tipiziran (tip se preveri ob izvajanju) in **močno** tipiziran (`"3" + 4` ne pretvori sam, ampak javi napako). Jezik C je **statično** tipiziran: tip spremenljivke določi deklaracija `int n;`, prevajalnik pa pri mešanih izrazih sam pretvori `int` v `double`.

**Decimalna števila.** `float` je 64-bitno dvojiško število po standardu IEEE 754 s približno 15–16 veljavnimi desetiškimi mesti. Zato `0.1 + 0.2 == 0.3` vrne `False`; decimalna števila primerjamo z dopustnim odstopanjem, na primer `abs(a - b) < 1e-9`.

## Preveri se

? Katera tabela pravilno podaja tip rezultata?
- `7 / 7` → `int`; `7 // 7` → `int`; `7.0 // 2` → `int`
~ Deljenje z `/` vedno vrne `float`; tudi `//` z operandom `float` vrne `float`.
+ `7 / 7` → `float`; `7 // 7` → `int`; `7.0 // 2` → `float`
- `7 / 7` → `float`; `7 // 7` → `float`; `7.0 // 2` → `int`
~ Pri `//` z dvema `int` je rezultat `int`; z enim `float` je `float`.
- `7 / 7` → `int`; `7 // 7` → `float`; `7.0 // 2` → `float`
~ `7 / 7` je `1.0`, ne `1`: `/` vrne `float` tudi pri deljenju brez ostanka.
> `7 / 7` je `1.0`, `7 // 7` je `1`, `7.0 // 2` je `3.0`.

? Program izračuna `p = 1000 * (1 + 4 / 100) ** 10` (glavnica in $4\,\%$ obresti v desetih letih). Katera ocena izpisa je najbližja?
- okoli `1040`
~ To je le eno leto obrestovanja; potenca $10$ velja za cel oklepaj.
- okoli `1400`
~ To je $1000 \cdot (1 + 10 \cdot 0{,}04)$, navadno obrestovanje; obrestne obresti dajo več.
+ okoli `1480`
- okoli `10400`
~ Potenca ne pomnoži zneska z $10$; $1{,}04^{10}$ je okoli $1{,}48$.
> $1{,}04^{10} = 1{,}4802$, zato je $p \approx 1480$.

? Zakaj je izraz `n != 0 and vsota / n > 5` varen tudi pri `n = 0`?
- Ker Python deljenje z nič vrne kot `0`.
~ Deljenje z nič javi `ZeroDivisionError`; varnost izhaja iz vrstnega reda.
- Ker ima `/` prednost pred `!=`, se deljenje izvede prvo in napako ujame `and`.
~ Prednost določa združevanje, ne vrstnega reda izračuna; `and` napak ne lovi.
+ Ker se pri neresničnem levem operandu `and` desni operand sploh ne izračuna.
- Ker je `vsota / n` pri `n = 0` enako `inf`.
~ Pri celih in decimalnih številih Python ne vrne `inf`, ampak javi napako.
> Kratkostično vrednotenje: `False and X` je `False` ne glede na `X`, zato se `X` ne izračuna.

? Izpis programa je `121212`. Kateri program ga je dal, če je uporabnik vpisal `12`?
+ `n = input(); print(n * 3)`
- `n = int(input()); print(n * 3)`
~ Pri celem številu `12 * 3` da `36`.
- `n = float(input()); print(n * 3)`
~ Pri decimalnem številu je izpis `36.0`.
- `n = input(); print(n + 3)`
~ Niza in števila ne moremo sešteti; program javi `TypeError`.
> Brez pretvorbe je `n` niz `"12"`, `*` z nizom in celim številom pa niz ponovi.

? Program za razrez profila potrebuje število palic dolžine $6\,\mathrm{m}$ za skupno dolžino `L` metrov (celo število). Kateri izraz je pravilen za vse `L > 0`?
- `L // 6 + 1`
~ Pri `L = 12` da $3$, potrebni pa sta le $2$ palici.
- `int(L / 6)`
~ `int` odreže: pri `L = 13` da $2$, potrebne pa so $3$.
+ `(L + 5) // 6`
- `round(L / 6)`
~ Pri `L = 7` da $1$, potrebni pa sta $2$; `round` zaokroži k najbližjemu, ne navzgor.
> Zaokrožitev navzgor je `(L + k - 1) // k` s $k = 6$; preizkus: $7 \mapsto 2$, $12 \mapsto 2$, $13 \mapsto 3$.

:::simboli
a | deljenec | | | celo število
b | delitelj | | | celo število, $b \neq 0$
q | količnik celoštevilskega deljenja | | | v Primeru 2 število polnih škatel
r | ostanek | r = a - b q | | $0 \le r < b$ pri $b > 0$
n | število izdelkov (deljenec); v Primeru 3 število let | | – | 
k | velikost škatle (delitelj) | | – | $k \ge 1$
K | končni znesek | K = G\left(1 + \frac{p}{100}\right)^n | €
G | glavnica | | €
p | letna obrestna mera v odstotkih | | – | v Primeru 3
F | stalni stroški | | €
c | prodajna cena kosa | | €/kos
v | spremenljivi strošek kosa | | €/kos
:::
