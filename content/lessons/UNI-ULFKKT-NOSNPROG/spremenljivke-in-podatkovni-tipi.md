---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Žan napiše `"4" + "2"` in pričakuje `6`. Python vrne `'42'`.

Žan je računalniku dal dva kosa besedila, ne dve števili, in `+` ju je zlepil. Tudi kar natipkaš v polje obrazca, pride v program kot besedilo. Zato program za vsak podatek hrani **ime**, pod katerim ga najde, in **tip**, ki pove, kaj z njim sme početi. Primeri so v Pythonu; ideje veljajo tudi v drugih jezikih.

## Razlaga

### Blok 1: ime in vrednost

Spremenljivka je **ime**, ki kaže na neko **vrednost** v pomnilniku. Ustvarimo jo s **prirejanjem**:

```python
starost = 19
```

Beri od desne proti levi: »vrednost `19` shrani pod ime `starost`«. Znak `=` tu ne pomeni enakosti kot v matematiki, ampak ukaz »priredi«. Zato je vrstica `starost = starost + 1` smiselna: vzemi staro vrednost, prištej $1$ in rezultat shrani pod isto ime.

**Definicija.** *Spremenljivka* je ime, povezano z vrednostjo (objektom) v pomnilniku. *Prirejanje* `ime = izraz` se izvede v dveh korakih: najprej Python izračuna `izraz` s **trenutnimi** vrednostmi, nato ime poveže z dobljeno vrednostjo; prejšnja povezava imena se izgubi. Posledica: po `a = 5`, `b = a`, `a = a + 1` je `a` enak `6`, `b` pa ostane `5`, ker je `a + 1` nova vrednost, `b` pa je še vedno povezan s staro.

Predstavljaj si nalepko z imenom, prilepljeno na škatlo z vrednostjo:

```
starost  ──►  [ 19 ]
po starost = starost + 1:
starost  ──►  [ 20 ]
```

Ime se začne s črko ali podčrtajem, vsebuje le črke, števke in `_` (brez presledkov) in ne sme biti rezervirana beseda jezika (`if`, `for`, `True`, `None` …). Velike in male črke se razlikujejo: `Starost` in `starost` sta dve različni imeni. Dobra imena povedo, kaj hranijo: `cena`, ne `x7`.

*Preveri v eni vrstici:* sta `baterija` in `Baterija` isto ime? (Ne, velike in male črke se razlikujejo.)

### Blok 2: vsaka vrednost ima tip

Vsaka vrednost ima **tip**, ki pove, kaj vrednost je in kaj lahko z njo delamo. Natančneje: **podatkovni tip** je množica dovoljenih vrednosti skupaj z operacijami, ki so nad njimi definirane. Tip izveš s funkcijo `type`. V interaktivni lupini Python (vrstice z `>>>`) vtipkaš izraz in takoj vidiš rezultat:

```python
>>> type(19)
<class 'int'>
>>> type(3.5)
<class 'float'>
>>> type("19")
<class 'str'>
>>> type(True)
<class 'bool'>
```

Štirje osnovni tipi:

| Tip | Kaj hrani | Primeri | Opomba |
|---|---|---|---|
| `int` | cela števila | `19`, `-4`, `0` | poljubno velika |
| `float` | decimalna števila | `3.5`, `-0.25`, `2.0` | decimalna **pika** |
| `str` | nizi (besedilo) | `"19"`, `'Ana'`, `""` | v narekovajih |
| `bool` | logične vrednosti | `True`, `False` | z veliko začetnico |

*Preveri v eni vrstici:* kakšen tip ima `"True"`? (`str`, ker je v narekovajih.)

### Blok 3: števila

Cela števila so tipa `int`, števila z decimalno piko pa tipa `float`. Pri `+`, `-` in `*` dveh celih števil dobiš celo število. Če je v računu vsaj en `float`, je rezultat `float`.

**Pravilo (tip rezultata).** Naj bosta `x` in `y` števili tipa `int` ali `float`. Rezultat `x + y`, `x - y`, `x * y`, `x // y` in `x % y` (zadnja dva definiramo v naslednjem odstavku) je `int`, če sta oba operanda `int`, sicer `float`; `x / y` je vedno `float`.

**Celoštevilsko deljenje in ostanek.** Naj bosta `a` in `b` celi števili, $b \neq 0$. Potem je `a // b` največje celo število, ki ni večje od $a/b$ (zaokrožitev navzdol), ostanek pa je definiran kot `a % b = a - b * (a // b)`. Zato vedno velja `a == b * (a // b) + a % b`. Za $b > 0$ je še $0 \le$ `a % b` $< b$. *Dokaz:* za $q =$ `a // b` velja $q \le a/b < q + 1$; pomnožimo z $b > 0$ in dobimo $bq \le a < bq + b$, torej $0 \le a - bq < b$. $\square$ Primeri: `17 // 5` je `3`, `17 % 5` je `2`; `-7 // 2` je `-4` (ne `-3`), `-7 % 2` je `1`.

Deljenje z `/` vedno vrne `float`, tudi kadar se deli brez ostanka:

```python
>>> 7 / 2
3.5
>>> 6 / 2
3.0
```

Števila tipa `float` so shranjena v dvojiškem zapisu, zato so nekatera le približna. Zato `0.1 + 0.2` ni točno `0.3`, ampak `0.30000000000000004`. Za večino računov je to dovolj natančno, decimalnih števil pa ne primerjaj na zadnjo decimalko.

Razlog: `float` je dvojiško število s $53$ veljavnimi dvojiškimi mesti (to je *mantisa*, standard IEEE 754). **Trditev:** okrajšan ulomek $m/n$ ($n > 0$) ima končen dvojiški zapis natanko tedaj, ko je $n$ potenca števila $2$. *Dokaz:* če je $n = 2^k$, je $m/2^k$ dvojiški zapis $m$ s premaknjeno vejico za $k$ mest. Obratno: če ima $q$ v dvojiškem zapisu $k$ mest za vejico, je $q \cdot 2^k$ celo število $N$, torej $q = N/2^k$; imenovalec okrajšanega ulomka deli $2^k$ in je zato potenca števila $2$. $\square$ Ker je $0{,}1 = 1/10$ in $10 = 2 \cdot 5$, ima $0{,}1$ neskončen periodičen zapis $0{,}0\overline{0011}_2$ in se mora zaokrožiti. Iz istega razloga je `1.15 * 100` enako `114.99999999999999`.

:::premisli
Oba izraza, `4 * 2.5` in `8 / 4`, imata za rezultat celo število. Je zato kateri od njiju tipa `int`? Napovej tip in izpis, preden pogledaš.
---
Oba sta `float`: `4 * 2.5` je `10.0`, ker je en operand `float`, `8 / 4` pa je `2.0`, ker deljenje z `/` vedno vrne `float`.
:::

### Blok 4: nizi

**Niz** (angl. *string*, tip `str`) je zaporedje znakov med narekovaji: `"Ljubljana"`, `'a'`, `"19"`, ali prazen niz `""`. Enojni in dvojni narekovaji pomenijo isto.

Pri nizih ima `+` drug pomen: **stakne** (zlepi) dva niza. Znak `*` z nizom in celim številom niz ponovi:

```python
>>> "Dober " + "dan"
'Dober dan'
>>> "4" + "2"
'42'
>>> "ab" * 3
'ababab'
```

Funkcija `len` vrne dolžino niza: `len("Ana")` je `3`.

*Preveri v eni vrstici:* kaj vrne `"ha" * 2 + "!"`? (`'haha!'`.)

### Blok 5: logične vrednosti

Tip `bool` ima le dve vrednosti: `True` (resnično) in `False` (neresnično). Dobimo jih največkrat iz **primerjav**:

```python
>>> starost = 19
>>> starost >= 18
True
>>> starost == 20
False
```

Dvojni `==` sprašuje »ali sta enaka?«, enojni `=` pa prireja. Logične vrednosti boš potreboval pri pogojnih stavkih in zankah.

*Preveri v eni vrstici:* kaj vrne `len("Ana") == 3`? (`True`.)

### Blok 6: pretvorbe

Tip lahko pretvoriš s funkcijo, ki se imenuje kot ciljni tip:

| Klic | Rezultat | Kaj se zgodi |
|---|---|---|
| `int("42")` | `42` | niz s celim številom v `int` |
| `float("2.5")` | `2.5` | niz z decimalnim številom v `float` |
| `int(3.9)` | `3` | decimalke se **odrežejo** (proti $0$) |
| `str(14.0)` | `'14.0'` | število v niz |

Pretvorba deluje le, če ima niz pravo obliko. `int("3.5")` in `float("3,5")` javita napako `ValueError`. Natančno: `int(s)` za niz `s` uspe le, če je `s` zapis celega števila (z morebitnim predznakom in presledki okrog), za `float` `x` pa `int(x)` vrne celi del, odrezan proti $0$: `int(-3.9)` je `-3`, medtem ko `-3.9 // 1` da `-4.0`.

Ko boš podatke bral s tipkovnice, jih Python vedno prebere kot niz, zato jih boš moral pretvoriti v število, preden z njimi računaš.

Tudi v `bool` lahko pretvoriš. Med štirimi osnovnimi tipi da `bool(x)` vrednost `False` natanko za `0`, `0.0`, prazen niz `""` in `False`, za vse drugo `True`.

:::premisli
Kaj vrne `bool("0")`? Zakaj ne `False`?
---
Vrne `True`. Funkcija `bool` pri nizu ne gleda, kaj piše v njem, ampak le, ali je prazen. Niz `"0"` ima en znak, zato ni prazen.
:::

## Rešeni primeri

### Primer 1 (lažji): tipi spremenljivk

Kakšen tip in vrednost ima vsaka spremenljivka?

```python
a = 17
b = 2.5
c = "17"
d = a > 10
```

**Podatki:** prirejanja `a = 17`, `b = 2.5`, `c = "17"`, `d = a > 10`
**Iščemo:** tip in vrednost spremenljivk `a`, `b`, `c`, `d`

:::formula
Celo število brez pike je `int`, število s piko `float`, vse v narekovajih `str`, rezultat primerjave pa `bool`.
:::

**Rešitev:**

1. `a = 17`: celo število brez pike, `int`.
2. `b = 2.5`: decimalna pika, `float`.
3. `c = "17"`: v narekovajih, `str` z znakoma `1` in `7`, ne število.
4. `d = a > 10`: najprej se izračuna `17 > 10`, kar je resnično, zato je `d` `True`, tip `bool`.
5. Odgovor: `a` je `int` (`17`), `b` je `float` (`2.5`), `c` je `str` (`"17"`), `d` je `bool` (`True`).

### Primer 2: račun za kavo

Kava stane $3{,}5$ €, naročimo $4$ kave. Izračunaj znesek in ga zapiši v niz `"Skupaj: ... EUR"`.

**Podatki:** cena kave $3{,}5$ € (`cena = 3.5`), število kav $4$ (`kolicina = 4`)
**Iščemo:** vrednost in tip zneska `skupaj` ter besedilo za izpis

:::formula
`skupaj = cena * kolicina`, nato `"Skupaj: " + str(skupaj) + " EUR"` (niz lahko stakneš le z nizom).
:::

**Rešitev:**

1. `skupaj = cena * kolicina` da $\text{skupaj} = \text{cena} \cdot \text{količina} = 3{,}5 \cdot 4 = 14$, v Pythonu `14.0`. Tip je `float`, ker je `cena` decimalno število.
2. `"Skupaj: " + skupaj` bi javil `TypeError` (niz in število), zato pretvorimo: `str(skupaj)` je `"14.0"`.
3. `"Skupaj: " + "14.0" + " EUR"` je niz `"Skupaj: 14.0 EUR"`.
4. Odgovor: znesek je `14.0` (tip `float`), besedilo pa `"Skupaj: 14.0 EUR"`.

### Primer 3 (težji): podatki iz obrazca

Obrazec za registracijo vrne podatke kot nize: `starost = "23"`, `visina = "1.75"` (v metrih) in `trajanje = "135"` (trajanje vadbe v minutah). (a) Izračunaj starost čez $5$ let in višino v celih centimetrih (tip `int`). (b) Iz trajanja z `//` in `%` sestavi niz `"2 h 15 min"`. (c) Drug uporabnik vpiše višino `"1.15"` in izraz iz (a) da `114`. Pojasni, zakaj, in izraz popravi.

**Podatki:** `starost = "23"` (niz), `visina = "1.75"` (niz, v metrih), `trajanje = "135"` (niz, v minutah), čez $5$ let, $1\,\mathrm{m} = 100\,\mathrm{cm}$, $1\,\mathrm{h} = 60\,\mathrm{min}$; drugi uporabnik `"1.15"`
**Iščemo:** starost čez $5$ let, višino v centimetrih kot `int`, niz s trajanjem, razlago za `114` in popravek

:::formula
`int(niz)` za cela števila, `float(niz)` za decimalna; `int(x)` odreže decimalke števila `x`; `a == b * (a // b) + a % b`
:::

**Rešitev:**

1. `starost + 5` bi javilo `TypeError`, ker je `starost` niz. Najprej pretvorimo: `int(starost)` je `23`, `int(starost) + 5` je `28`.
2. `int(visina)` bi javilo `ValueError`, ker niz `"1.75"` ni zapis celega števila. Zato `float(visina)`, kar je `1.75`.
3. V centimetre: `float(visina) * 100` je `175.0`, še vedno `float`; `int(175.0)` je `175`, tip `int`. Tu je račun točen, ker je $1{,}75 = 7/4$ in je imenovalec potenca števila $2$.
4. (b) `m = int(trajanje)` je `135`. Ker je $135 = 60 \cdot 2 + 15$, je `m // 60` enako `2` in `m % 60` enako `15`.
5. Niz: `str(m // 60) + " h " + str(m % 60) + " min"` je `"2 h 15 min"`; `str` je nujen, ker niza in števila ne moremo stakniti.
6. (c) $1{,}15 = 23/20$ in $20$ ni potenca števila $2$, zato `float("1.15")` hrani le približek, malo manjši od $1{,}15$. Produkt `float("1.15") * 100` je `114.99999999999999`, `int` pa odreže proti $0$ in vrne `114`.
7. Popravek: `round(float(visina) * 100)`. Funkcija `round` z enim argumentom vrne najbližje celo število kot `int`, tu `115`.
8. Odgovor: čez $5$ let bo star $28$ let; visok je $175\,\mathrm{cm}$ (`int(float(visina) * 100)`); trajanje je `"2 h 15 min"`; pri `"1.15"` je za pravilnih $115\,\mathrm{cm}$ treba pisati `round(float(visina) * 100)`.

### Primer 4: zdaj ti

Termostat pošlje temperaturo kot niz `t = "21.5"`. Ogrevanje jo dvigne za $3$ stopinje. Sestavi niz z novo temperaturo in enoto `"... °C"`.

**Podatki:** `t = "21.5"` (niz), dvig za $3$ stopinje
**Iščemo:** niz z novo temperaturo in enoto `°C`

:::formula
`float(t) + 3`, nato `str(...) + " °C"`.
:::

**Rešitev:**

1. Niz ima decimalno piko, zato `float(t)` da `21.5`.
2. Izračunaj `float(t) + 3`, pretvori v niz in dodaj enoto:

:::premisli
Kakšna je nova temperatura in kakšen niz dobiš?
---
`float(t) + 3` je `24.5` (tip `float`). `str(24.5) + " °C"` je niz `"24.5 °C"`.
:::

## Pogoste napake

- **Niz in število sta isto.** `"5" + 3` javi `TypeError`, `"5" + "3"` pa je `"53"`, ne `8`. Preveri tip s `type` in po potrebi pretvori.
- **Decimalna vejica v kodi.** `x = 3,5` Python razume kot par števil `3` in `5`. V kodi piši `3.5`.
- **`int` zaokroži.** `int(3.9)` je `3`, ne `4`: `int` odreže. Zaokroži `round`.
- **Deljenje celih števil da celo število.** `6 / 2` je `3.0`, tip `float`; celo število da `6 // 2`.
- **`=` je enačba.** `x = x + 1` je ukaz: izračunaj desno stran in jo shrani v `x`. Primerja `==`.

## Povzetek

- Spremenljivka je ime, ki kaže na vrednost; ustvarimo jo s prirejanjem `ime = vrednost` (desna stran se izračuna najprej).
- Osnovni tipi: `int` (cela števila), `float` (decimalna, s piko), `str` (nizi v narekovajih), `bool` (`True`, `False`).
- `/` vedno vrne `float`; `//` zaokroži navzdol, `a % b = a - b * (a // b)`; `float` je točen le za ulomke z imenovalcem $2^k$.
- Pri nizih `+` stika, `*` ponavlja; niza in števila ne moreš sešteti.
- Pretvorbe: `int()`, `float()`, `str()`, `bool()`; `int` odreže proti $0$; `int("3.5")` javi napako.
- `bool` da `False` le za `0`, `0.0`, prazen niz in `False`, za vse drugo `True`.

## Za izpit

Znati moraš povedati:

- definicijo spremenljivke in natančen potek prirejanja `ime = izraz` ter pravila za imena;
- definicijo podatkovnega tipa in pravilo za tip rezultata aritmetičnih operacij;
- definicijo `a // b` in `a % b`, identiteto `a == b * (a // b) + a % b` in dokaz, da je za $b > 0$ ostanek med $0$ in $b - 1$;
- trditev, kdaj ima ulomek končen dvojiški zapis, z dokazom, in zakaj `0.1 + 0.2 != 0.3`;
- natančno delovanje `int()`, `float()`, `str()` in `bool()`, tudi odrezovanje proti $0$ in `ValueError`.

### Naloga 1

Določi vrednost in tip vseh spremenljivk po izvedbi programa:

```python
a = "12"
b = a * 2
c = int(b) // 5
d = int(b) % 5
e = -int(a) // 5
r = -int(a) % 5
f = int(-7.8) + c
h = 0.1 * 3 == 0.3
a = a + "3"
g = b == "1212" and len(a) > 2
```

**Rešitev:**

1. `b = "12" * 2` ponovi niz: `b` je `"1212"`, tip `str`.
2. `int(b)` je $1212$. Ker je $1212 = 5 \cdot 242 + 2$, je `c` enak `242` in `d` enak `2`, oba `int`.
3. Enočleni minus veže močneje kot `//`, zato je `e = (-12) // 5`. Ker je $-12/5 = -2{,}4$, zaokrožitev navzdol da `e = -3` (ne `-2`).
4. Ostanek iz definicije: `r = -12 - 5 * (-3) = 3`. Preverba: $5 \cdot (-3) + 3 = -12$ in $0 \le 3 < 5$.
5. `int(-7.8)` odreže proti $0$ in da `-7`, zato je `f = -7 + 242 = 235`, tip `int`.
6. `0.1 * 3` je `0.30000000000000004`, ker $0{,}1$ ni točno predstavljiv, zato je `h` enak `False`, tip `bool`.
7. `a = "12" + "3"` je `"123"`; stara vrednost `"12"` je že bila uporabljena pri `b`, zato se `b` ne spremeni.
8. `g`: `b == "1212"` je `True`, `len("123") > 2` je `True`, zato `g` je `True`.
9. Odgovor: `a = "123"`, `b = "1212"` (`str`); `c = 242`, `d = 2`, `e = -3`, `r = 3`, `f = 235` (`int`); `h = False`, `g = True` (`bool`).

### Naloga 2

Natančno navedi, kdaj ima okrajšan ulomek $m/n$ končen dvojiški zapis, in trditev dokaži. Nato utemelji, ali `0.5 + 0.25 == 0.75` vrne `True`.

**Rešitev:**

1. Trditev: naj bo $m/n$ okrajšan ulomek, $n > 0$. Ima končen dvojiški zapis natanko tedaj, ko je $n = 2^k$ za neko celo število $k \ge 0$.
2. Če je $n = 2^k$: deljenje z $2^k$ premakne dvojiško vejico v zapisu celega števila $m$ za $k$ mest v levo, zapis ostane končen.
3. Obratno: naj ima $q = m/n$ v dvojiškem zapisu $k$ mest za vejico. Potem je $N = q \cdot 2^k$ celo število in $m/n = N/2^k$, torej $m \cdot 2^k = N n$. Ker sta $m$ in $n$ tuji, $n$ deli $2^k$, zato je $n$ potenca števila $2$. $\square$
4. $0{,}5 = 1/2$, $0{,}25 = 1/4$ in $0{,}75 = 3/4$ imajo imenovalce $2$, $4$ in $4$ ter največ dve dvojiški mesti za vejico, kar je veliko manj od $53$, zato so v `float` shranjeni točno.
5. Pri seštevanju IEEE 754 vrne točen rezultat, zaokrožen na najbližji `float`. Točna vsota $3/4$ je sama predstavljiva, zato zaokroževanja ni.
6. Odgovor: `0.5 + 0.25 == 0.75` vrne `True`, medtem ko `0.1 + 0.2 == 0.3` vrne `False`, ker $1/10$, $1/5$ in $3/10$ nimajo imenovalca, ki bi bil potenca števila $2$.

## Drugače: Uporaba v stroki

Instrument ali preglednica izvozi podatke kot besedilo, v slovenskih nastavitvah pogosto `"21,5"`: `float` javi `ValueError`, zato najprej `s.replace(",", ".")`. Oznaka vzorca `"007"` ostane niz, ker `int("007")` vrne `7`. Zneske in mase pogosto hranijo v celih centih ali miligramih (`int`), ker `float` vsote $0{,}1 + 0{,}2$ ne da točno.

## Drugače: Bolj natančno

**Dinamični tipi.** V Pythonu tip pripada vrednosti, ne imenu. Po `x = 5` in `x = "pet"` ima `x` tip `str`. V jezikih s statičnimi tipi (C, Java) tip določiš ob deklaraciji (`int x;`).

**Cela števila.** `int` v Pythonu nima zgornje meje: `2 ** 100` se izračuna točno. V mnogih jezikih ima celo število $32$ ali $64$ bitov in lahko pride do prekoračitve.

**Plavajoča vejica.** Ker se `float` zaokroži, je `int(1.15 * 100)` enako `114`; za celo število iz decimalnega rezultata uporabi `round`.

**Logične vrednosti so števila.** `bool` je podtip `int`, zato je `True + True` enako `2`.

## Preveri se

? Kakšen tip ima vrednost `3.0`?
- `int`
~ Tip določa zapis: pika pomeni `float`.
+ `float`
- `str`
~ Niz bi moral biti v narekovajih, na primer `"3.0"`.
> Število z decimalno piko je `float`, tudi če so decimalke ničle.

? Kaj vrne izraz `"4" + "2"`?
- `6`
~ Narekovaji pomenijo niz, `+` stika.
+ `'42'`
- Napako `TypeError`.
~ Napaka nastane le pri mešanju niza in števila.
> Oba operanda sta niza, zato `+` niza zlepi v `"42"`.

? Po vrsticah `x = 5` in `x = x + 1` ima `x` vrednost:
- `5`
~ Druga vrstica je ukaz, ki spremeni `x`.
+ `6`
- `x + 1`
~ Python shrani izračunano vrednost, ne zapisa izraza.
- `True`
~ `=` ne primerja. Za primerjavo bi potreboval `==`.
> Desna stran `x + 1` se izračuna s staro vrednostjo $5$, rezultat $6$ pa se shrani nazaj v `x`.

? Spremenljivka `n = "7"` je niz. Kaj vrne `int(n) * 2`?
- `'77'`
~ Tako bi bilo pri `n * 2` brez pretvorbe.
+ `14`
- `14.0`
~ `int` in `int` pri množenju dasta `int`, ne `float`.
> `int("7")` je celo število $7$, $7 \cdot 2 = 14$, tip `int`.

? Kaj vrne `int(float("2.9")) + 1`?
- `4`
~ `int` ne zaokroži, ampak odreže.
+ `3`
- `3.9`
~ To bi dobil brez `int`, kot `2.9 + 1`.
- Napako `ValueError`.
~ Napako bi dobil pri `int("2.9")`. Tu je niz najprej pretvorjen s `float`, kar deluje.
> `float("2.9")` je `2.9`, `int(2.9)` je `2` (odreže), `2 + 1` je `3`.

:::simboli
\text{cena} | cena ene kave | | € | v programu cena = 3.5 (tip float)
\text{količina} | število kav | | – | v programu kolicina = 4 (tip int)
\text{skupaj} | znesek za vse kave | \text{skupaj} = \text{cena} \cdot \text{količina} | € | tip float, ker je cena decimalno število
:::
