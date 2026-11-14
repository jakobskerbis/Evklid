---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka, brez kakršne koli teorije. Kaj izpiše ta program?

```python
a = 5
b = a
a = a + 1
print(b)
```

Zapiši svojo napoved, preden bereš naprej. Ena skupina ugiba $6$, ker »sta `a` in `b` povezana«. Druga ugiba $5$. Pravilno je $5$, razlog pa je jedro prve ideje programiranja: **spremenljivka**.

Telefon vsak trenutek dela s takimi spremenljivkami: odstotek baterije, število korakov, porabljeni megabajti. Aplikacija si vrednosti zapomni, jih ponavlja v zanki in svoje delo zapre v funkcije. Prav te tri gradnike spoznaš tukaj. V preglednici si formule vpisoval v celice. V Pythonu iste izračune zapišeš kot program. Poženeš ga iz ukazne vrstice z `python3 program.py`, tudi na tisočih podatkih.

## Razlaga

**1. Spremenljivka je ime za vrednost.** Vrstica `a = 5` ni enačba. Pomeni: »izračunaj desno stran in rezultat shrani pod ime `a`«. Znaku `=` zato rečemo **prireditev**. Vrstica `b = a` vzame *trenutno* vrednost `a`, torej $5$, in jo shrani pod `b`. Ko nato `a` povečamo, `b` tega ne izve. Kot pri kopiranju števila v preglednici s *Prilepi vrednosti*: kopija se ne spreminja z izvirnikom.

Sledimo programu vrstico za vrstico:

| Vrstica | `a` | `b` |
|---|---|---|
| `a = 5` | $5$ | – |
| `b = a` | $5$ | $5$ |
| `a = a + 1` | $6$ | $5$ |

Zapis `a = a + 1` v matematiki ne bi imel smisla. V programu pomeni: vzemi staro `a`, prištej $1$, shrani nazaj pod `a`.

Vrednosti imajo **tip**. Celo število (`int`) je `80`, decimalno (`float`) je `3.5` (s piko, ne z vejico!), besedilo (`str`) je v narekovajih: `"Baterija"`. Tip šteje: `5 + 3` je `8`, `"5" + "3"` pa je `"53"`, ker se besedili zlepita.

**2. Opazi vzorec v zankah.** Zanka `for` ponovi zamaknjene vrstice (več o zamiku v točki 3) za vsako vrednost iz zaporedja. Zaporedje števil da `range`. Poženi te tri programčke v mislih in poglej izpise:

| Program | Izpiše |
|---|---|
| `for i in range(3): print(i)` | `0 1 2` |
| `for i in range(5): print(i)` | `0 1 2 3 4` |
| `for i in range(2, 6): print(i)` | `2 3 4 5` |

(Izpis je zapisan v eni vrstici; `print` v resnici vsako število izpiše v svojo vrstico.)

:::premisli
Kaj je skupno vsem trem? Koliko števil da `range(2, 6)` in katero število manjka? Napovej, kaj izpiše `range(4, 7)`.
---
Začetno število je vključeno, končno ni. `range(2, 6)` da $6 - 2 = 4$ števila, manjka $6$. Torej `range(4, 7)` izpiše `4 5 6`. Če začetka ne napišeš, se šteje od $0$.
:::

To je pravilo: **`range(a, b)` da cela števila od $a$ do $b - 1$, skupaj $b - a$ števil (če je $a < b$; sicer je obseg prazen).** `range(n)` je kratko za `range(0, n)` in da natanko $n$ ponovitev.

Zanka lahko gre tudi skozi **seznam** (vrednosti v oglatih oklepajih, ločene z vejicami):

```python
prenosi = [120, 340, 95]
skupaj = 0
for mb in prenosi:
    skupaj = skupaj + mb
print(skupaj)
```

Spremenljivka `skupaj` je **akumulator**: začne z $0$ in v vsakem koraku zraste. To je ista ideja kot `SUM` v preglednici, le da vsak korak vidiš.

**3. Zamik je del programa.** Telo zanke so vrstice, zamaknjene za štiri presledke pod vrstico z dvopičjem. Ko se zamik konča, se konča zanka. `print(skupaj)` zgoraj ni zamaknjen, zato se izvede enkrat, po zanki.

:::premisli
Kaj bi izpisal program, če bi bil `print(skupaj)` zamaknjen enako kot `skupaj = skupaj + mb`?
---
Trikrat bi izpisal vmesno vsoto: `120`, `460`, `555`. Zamaknjen `print` je del telesa zanke, zato se izvede v vsakem koraku.
:::

**4. Zanka `while`: ponavljaj, dokler velja.** Včasih ne veš vnaprej, kolikokrat ponoviti. Zanka `while pogoj:` ponavlja telo, dokler je pogoj resničen. Primerjave pišemo z `<`, `>`, `<=`, `>=`, `==` (enako; dva enačaja, ker je en enačaj že prireditev) in `!=` (različno). Če pogoj nikoli ne postane neresničen, zanka teče v nedogled; ustaviš jo s `Ctrl+C`.

**5. Funkcija zapakira postopek.** Ko isti izračun potrebuješ večkrat, ga zapišeš kot **funkcijo**:

```python
def ostanek(baterija, poraba, ure):
    return baterija - poraba * ure
```

Vrstica z `def` da funkciji ime in **parametre** v oklepaju. `return` vrne rezultat tistemu, ki je funkcijo poklical. Klic `ostanek(80, 12, 3)` vstavi **argumente** $80$, $12$ in $3$ namesto parametrov in vrne vrednost, ki jo lahko shraniš: `x = ostanek(80, 12, 3)`.

Pozor na razliko: `print` vrednost pokaže na zaslonu, `return` jo preda naprej. Funkcija brez `return` vrne posebno vrednost `None` (nič).

## Rešeni primeri

### Primer 1 (lažji): spremenljivke

Telefon ima $80\,\%$ baterije. Navigacija porabi $12\,\%$ na uro. Kaj izpiše program?

```python
baterija = 80
poraba = 12
baterija = baterija - 3 * poraba
print(baterija)
```

**Podatki:** začetna vrednost `baterija = 80`, `poraba = 12`, odštejemo porabo za $3$ ure
**Iščemo:** izpisano vrednost `baterija`

:::formula
Prireditev: najprej izračunaj desno stran s *starimi* vrednostmi, nato rezultat shrani pod ime na levi.
:::

**Rešitev:**

1. Po prvih dveh vrsticah je `baterija` $80$, `poraba` $12$.
2. Desna stran tretje vrstice: množenje ima prednost, $3 \cdot 12 = 36$.
3. Nato $80 - 36 = 44$; to se shrani nazaj v `baterija`.
4. Odgovor: program izpiše `44`, po treh urah navigacije ostane $44\,\%$ baterije.

### Primer 2: zanka z akumulatorjem

Telefon beleži prenesene podatke po dnevih v tednu (v MB): $120$, $340$, $95$, $410$, $260$, $180$, $75$. Napiši program, ki izračuna tedensko porabo, in povej, kaj izpiše.

**Podatki:** seznam `prenosi = [120, 340, 95, 410, 260, 180, 75]`, $7$ dni, enota MB
**Iščemo:** program in izpisano skupno porabo

:::formula
Akumulator: `skupaj = 0`, nato v zanki `skupaj = skupaj + mb`, izpis po zanki.
:::

**Rešitev:**

1. Program:

```python
prenosi = [120, 340, 95, 410, 260, 180, 75]
skupaj = 0
for mb in prenosi:
    skupaj = skupaj + mb
print(skupaj)
```

2. Zanka gre skozi $7$ vrednosti. Akumulator raste: $120$, $460$, $555$, $965$, $1225$, $1405$, $1480$.
3. Preverimo s seštevanjem: $120 + 340 + 95 + 410 + 260 + 180 + 75 = 1480$.
4. `print` ni zamaknjen, zato se izvede enkrat, po zanki.
5. Odgovor: program izpiše `1480`, telefon je v tednu prenesel $1480\,\mathrm{MB}$.

### Primer 3 (težji): funkcija z zanko `while`

Napiši funkcijo `ure(baterija, poraba)`, ki vrne, po koliko urah baterija pade pod $20\,\%$. Kaj vrne klic `ure(100, 15)`?

**Podatki:** začetna baterija $100\,\%$, poraba $15\,\%$ na uro, meja $20\,\%$
**Iščemo:** funkcijo in vrednost `ure(100, 15)`

:::formula
Ponavljaj, dokler je `baterija >= 20`: odštej porabo in prištej eno uro. Na koncu vrni števec ur.
:::

**Rešitev:**

1. Ne vemo vnaprej, koliko ur bo, zato uporabimo `while`. Potrebujemo še števec ur, ki začne z $0$.

```python
def ure(baterija, poraba):
    u = 0
    while baterija >= 20:
        baterija = baterija - poraba
        u = u + 1
    return u
```

2. Sledimo klicu `ure(100, 15)`. Po vsaki uri je baterija: $85$, $70$, $55$, $40$, $25$, $10$.
3. Po šesti uri je $25 - 15 = 10$, kar je manj kot $20$. Pogoj ne velja več, zanka se ustavi pri `u` $= 6$.
4. `return u` vrne vrednost; izpiše jo šele `print(ure(100, 15))`.
5. Odgovor: funkcija vrne $6$; baterija pade pod $20\,\%$ v šesti uri.

### Primer 4: zdaj ti

Isto funkcijo pokličeš za tablico: `ure(80, 25)`. Koliko vrne?

**Podatki:** `baterija = 80`, `poraba = 25`, meja $20\,\%$
**Iščemo:** vrednost `ure(80, 25)`

:::formula
Ista funkcija `ure` kot v primeru 3.
:::

**Rešitev:**

1. Pogoj na začetku: $80 \geq 20$ velja, zanka se začne.
2. Po prvi uri: $80 - 25 = 55$, `u` je $1$. Nadaljuj sam: zapiši vrednost baterije po vsaki uri, dokler pogoj ne odpove.

:::premisli
Koliko vrne `ure(80, 25)`?
---
Vrne $3$. Baterija gre $80 \to 55 \to 30 \to 5$. Ko je $5$, pogoj $5 \geq 20$ ne velja več, števec pa je takrat $3$.
:::

## Pogoste napake

- **`=` kot enačba.** Kdor bere `b = a` kot »za vedno enaka«, pričakuje, da se `b` spremeni z `a`. Prireditev shrani le *trenutno* vrednost. Popravek: ob vsaki vrstici si zapiši tabelo vrednosti.
- **`range(5)` vsebuje $5$.** Ne: `range(5)` da `0 1 2 3 4`. Kdor šteje do $5$, dobi eno ponovitev preveč (npr. vsoto $15$ namesto $10$). Popravek: konec ni vključen, ponovitev je `b - a`.
- **Napačen zamik.** `print` ali akumulator na napačni globini spremeni program: vsota se izpiše vsak korak ali pa se `skupaj = 0` ponastavi v vsakem koraku. Popravek: preveri, katere vrstice so v telesu zanke.
- **`print` namesto `return`.** Funkcija z `print` pokaže število, a vrne `None`. Klic `x = f(4)` potem shrani `None`, in `x + 1` javi napako. Popravek: funkcija, katere rezultat potrebuješ, ima `return`.
- **Besedilo namesto števila.** `"5" + "3"` je `"53"`. Vrednost, ki jo uporabnik vtipka in jo prebereš z `input()`, je vedno besedilo. Popravek: pretvori z `int(...)` ali `float(...)`. Decimalna števila pišeš s piko: `3.5`.

## Povzetek

- Spremenljivka je ime za vrednost; `x = izraz` izračuna desno stran in jo shrani pod `x`. Tipi: `int`, `float` (s piko), `str` (v narekovajih).
- `for i in range(a, b):` ponovi telo za $i = a, \ldots, b - 1$, skupaj $(b - a)$-krat; `for x in seznam:` gre skozi elemente seznama.
- Akumulator: začni z $0$, v zanki prištevaj, izpiši po zanki.
- `while pogoj:` ponavlja, dokler pogoj velja; uporabimo jo, ko število ponovitev ni znano vnaprej.
- Telo zanke ali funkcije je zamaknjeno za $4$ presledke.
- `def ime(parametri):` definira funkcijo; `return` vrne rezultat, `print` ga le pokaže. Brez `return` funkcija vrne `None`.
- Program poženeš v ukazni vrstici z `python3 ime.py`.

## Drugače: Korak za korakom s številkami

Sledenje programu je kot izpolnjevanje preglednice: ena vrstica tabele za vsak korak. Program:

```python
s = 0
for i in range(1, 5):
    s = s + i
print(s)
```

| Korak | `i` | `s` pred | `s` po |
|---|---|---|---|
| 1 | $1$ | $0$ | $1$ |
| 2 | $2$ | $1$ | $3$ |
| 3 | $3$ | $3$ | $6$ |
| 4 | $4$ | $6$ | $10$ |

Postopek:

1. Zapiši začetne vrednosti vseh spremenljivk.
2. Ugotovi, katere vrednosti dobi `i`: `range(1, 5)` da $1, 2, 3, 4$; $5$ ni vključena.
3. Za vsako vrednost izračunaj desno stran s starimi vrednostmi in zapiši novo.
4. Po zadnjem koraku izvedi nezamaknjene vrstice: `print(s)` izpiše `10`.

Preverba: $1 + 2 + 3 + 4 = 10$.

## Drugače: Kot zgodba

Predstavljaj si, da je program pomočnik z beležko in navodili na listku.

Ko prebere `baterija = 80`, v beležko napiše »baterija: 80«. Ko prebere `baterija = baterija - 36`, pogleda v beležko, izračuna $44$, staro številko prečrta in napiše novo. Ne spominja se, kako je do številke prišel; pozna le, kar trenutno piše.

Zanka `for` je navodilo »za vsak dan v tednu naredi tole«. Pomočnik vzame prvi dan, opravi zamaknjena navodila, vzame naslednjega, in tako do konca seznama. Šele nato bere naprej.

Zanka `while` je navodilo »dokler je baterija vsaj $20$, ponavljaj«. Pred vsako ponovitvijo pogleda v beležko. Ko številka pade pod $20$, odloži listek.

Funkcija pa je recept, ki ga pomočnik shrani v predal. Ko rečeš `ure(100, 15)`, odpre predal, vzame nov list beležke, nanj napiše »baterija: 100, poraba: 15«, opravi recept in ti z `return` poda listek z rezultatom. Pomožni list nato zavrže; zato spremenljivka `u` zunaj funkcije ne obstaja.

## Preveri se

? Štirje sošolci si po prvi vaji zapišejo po eno pravilo. Čigavo pravilo drži?
- `x = x + 1` je napaka, ker $x$ ne more biti enak $x + 1$.
~ `=` ni enačba, ampak prireditev: vzemi staro `x`, prištej $1$, shrani nazaj.
- `range(5)` da števila od $1$ do $5$.
~ Štetje se začne z $0$ in konec ni vključen: `0 1 2 3 4`.
+ Funkcija brez `return` vrne `None`.
- `"5" + "3"` je `8`.
~ V narekovajih sta besedili, ki se zlepita v `"53"`.
> Če funkcija ne vrne ničesar z `return`, klic vrne posebno vrednost `None`, tudi če je med izvajanjem kaj izpisala s `print`.

? Program: `s = 0`, nato `for i in range(1, 5):` z zamaknjeno vrstico `s = s + i`, na koncu nezamaknjen `print(s)`. Kaj izpiše?
- $15$
~ To je $1 + 2 + 3 + 4 + 5$. Konec $5$ v `range` ni vključen.
+ $10$
- $4$
~ To je zadnja vrednost `i`. Akumulator `s` pa sešteva vse vrednosti.
- `1 3 6 10` v štirih vrsticah
~ Tako bi bilo, če bi bil `print` zamaknjen v telo zanke. Tu je po zanki in se izvede enkrat.
> `i` dobi vrednosti $1, 2, 3, 4$, zato je $s = 1 + 2 + 3 + 4 = 10$.

? Sošolec napiše `def dvakrat(x):` z zamaknjeno vrstico `print(2 * x)`, nato `y = dvakrat(4)` in `print(y + 1)`. Pričakuje $9$, dobi pa napako. Kje je napaka?
- `4` bi moral pisati v narekovajih.
~ Z narekovaji bi bilo `4` besedilo; računanje z njim bi bilo še slabše.
+ Funkcija rezultat izpiše s `print`, ne vrne ga z `return`, zato je `y` enak `None`.
- Funkcija se mora imenovati z veliko začetnico.
~ Ime funkcije je lahko z malimi črkami; Python tega ne zahteva.
> `print` pokaže `8` na zaslonu, a klic vrne `None`. `None + 1` javi napako. Popravek: `return 2 * x`.

? Kdaj je zanka `while` primernejša od zanke `for`?
- Kadar gremo skozi vse elemente seznama.
~ Za to je `for x in seznam:` krajša in varnejša.
+ Kadar ne vemo vnaprej, kolikokrat bo treba ponoviti, vemo pa, kdaj se ustaviti.
- Nikoli, ker sta zanki popolnoma enaki.
~ Z `while` lahko zapišeš vse, kar s `for`, a obratno ni preprosto: `for` potrebuje znano zaporedje.
> `while` preverja pogoj pred vsako ponovitvijo, kot pri bateriji, ki se prazni, dokler ne pade pod mejo.

? Aplikacija za štetje korakov ima seznam korakov po dnevih. Kateri del programa izračuna tedensko vsoto pravilno?
- `for k in koraki:` in zamaknjeno `skupaj = 0` ter `skupaj = skupaj + k`
~ Ker je `skupaj = 0` v telesu zanke, se akumulator v vsakem koraku ponastavi; ostane le zadnji dan.
+ `skupaj = 0` pred zanko, nato `for k in koraki:` z zamaknjenim `skupaj = skupaj + k`
- `for k in koraki:` z zamaknjenim `skupaj = k`
~ Prireditev `skupaj = k` vsakič prepiše vrednost; na koncu je v `skupaj` le zadnji dan.
> Akumulator nastavimo na $0$ enkrat, pred zanko; v zanki pa vsak dan prištejemo k vsoti.

:::simboli
a | začetek obsega range(a, b) | | | vključen
b | konec obsega range(a, b) | | | ni vključen; obseg ima $b - a$ števil
n | število ponovitev pri range(n) | | | range(n) je kratko za range(0, n)
i | števec zanke for | | | dobi vrednosti $a, \ldots, b - 1$
x | spremenljivka | | | x = x + 1 je prireditev, ne enačba
:::
