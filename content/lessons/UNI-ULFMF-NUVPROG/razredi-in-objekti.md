---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Recimo, da pišeš program za bančne račune. Znaš že uporabljati slovarje in funkcije, zato račun shraniš kot slovar in napišeš funkcijo:

```python
racun = {"lastnik": "Ana", "stanje": 100}

def polozi(racun, znesek):
    racun["stanje"] = racun["stanje"] + znesek
```

To deluje, dokler je programa malo. Ko imaš račune, stranke in kartice, se funkcije pomešajo. Nihče te ne ustavi, če funkcijo za kartice kličeš na računu. Tudi nič ne zagotavlja, da ima vsak slovar-račun ključa `"lastnik"` in `"stanje"`: vsak je lahko sestavljen po svoje.

**Razred** podatke in funkcije, ki z njimi delajo, poveže v eno celoto. Tako zapišeš: »račun ima lastnika in stanje, nanj lahko položiš ali z njega dvigneš denar«. Na tem temelji večina večjih programov, tudi knjižnice, ki jih boš uporabljal (datoteke, nizi in seznami so v Pythonu prav tako objekti).

## Razlaga

**1. Razred in objekt.** **Razred** je načrt: opiše, katere podatke ima neka vrsta stvari in kaj zna. **Objekt** (tudi *primerek* ali *instanca*) je ena konkretna stvar, narejena po tem načrtu. Razred `Racun` je eden, objektov `Racun` (Anin račun, Borov račun …) je lahko poljubno mnogo.

To že poznaš: `list` je razred, vsak seznam, ki ga ustvariš, pa je objekt tega razreda. Klic `[1, 2].append(3)` je klic **metode** `append` na tem objektu.

**2. Konstruktor.** Razred definiramo z besedo `class`. Posebna metoda `__init__` (dva podčrtaja spredaj in zadaj) je **konstruktor**: Python jo pokliče sam, ko ustvariš nov objekt.

```python
class Racun:
    def __init__(self, lastnik, stanje):
        self.lastnik = lastnik
        self.stanje = stanje
```

Objekt ustvariš tako, da razred pokličeš kot funkcijo:

```python
a = Racun("Ana", 100)
```

Kaj se zgodi: Python naredi prazen objekt, nato pokliče `__init__` in mu kot prvi argument poda ta novi objekt. Ta parameter se po dogovoru imenuje **`self`** (»jaz sam«). Ostala argumenta, `"Ana"` in `100`, gresta v `lastnik` in `stanje`. Na koncu se objekt shrani v `a`.

**3. Atributi.** Vrstica `self.stanje = stanje` objektu doda **atribut**: spremenljivko, ki pripada temu objektu. Atribut prebereš ali spremeniš s piko:

```python
>>> a.lastnik
'Ana'
>>> a.stanje = 250
>>> a.stanje
250
```

Vsak objekt ima svoje atribute. Po `b = Racun("Bor", 20)` imamo dva ločena objekta:

| Ime | Objekt | `lastnik` | `stanje` |
|---|---|---|---|
| `a` | prvi `Racun` | `"Ana"` | `250` |
| `b` | drugi `Racun` | `"Bor"` | `20` |

Pozor: v `__init__` sta `stanje` in `self.stanje` dve različni stvari. Prvo je parameter, ki izgine, ko se funkcija konča. Drugo je atribut, ki ostane v objektu.

**4. Metode.** **Metoda** je funkcija, definirana znotraj razreda. Njen prvi parameter je vedno `self`, objekt, na katerem jo kličemo:

```python
class Racun:
    def __init__(self, lastnik, stanje):
        self.lastnik = lastnik
        self.stanje = stanje

    def polozi(self, znesek):
        self.stanje = self.stanje + znesek

    def dvigni(self, znesek):
        if znesek > self.stanje:
            return False
        self.stanje = self.stanje - znesek
        return True
```

Metodo kličeš s piko in oklepaji: `a.polozi(50)`. Python sam vstavi `a` na mesto `self`, `50` pa na mesto `znesek`. Zato pri klicu podaš en argument manj, kot ima definicija parametrov.

Metoda `dvigni` pokaže, zakaj je razred koristen: pravilo »ne dvigni več, kot imaš« je zapisano na enem mestu, ob podatkih, ki jih varuje.

:::premisli
Imamo `a = Racun("Ana", 100)` in `b = Racun("Bor", 20)`. Pokličemo `a.polozi(30)`. Kolikšno je zdaj `b.stanje`? Zakaj?
---
Še vedno `20`. Metoda je spremenila `self.stanje`, `self` pa je bil pri tem klicu objekt `a`. Objekt `b` ima svoj atribut `stanje`, ki ga nihče ni spremenil.
:::

**5. Ime in objekt.** Spremenljivka ne vsebuje objekta, ampak **kaže nanj**, tako kot pri seznamih. Prirejanje `c = a` ne naredi novega računa, ampak novo ime za isti račun:

:::risba skica
opis: Levo so imena a, c in b, desno dva pravokotnika, ki pomenita objekta. Od imen a in c vodita puščici v isti pravokotnik z napisom Racun: lastnik "Ana", stanje 130. Od imena b vodi puščica v drug pravokotnik z napisom Racun: lastnik "Bor", stanje 20.
območje: 0; 0 .. 14; 8
pravokotnik: 4,5; 4,4 .. 13,5; 7,6 | modra | ozadje
napis: 9; 6,7 | Racun: | sredina
napis: 9; 5,3 | lastnik "Ana", stanje 130 | sredina
pravokotnik: 4,5; 0,4 .. 13,5; 3,6 | oranžna | ozadje
napis: 9; 2,7 | Racun: | sredina
napis: 9; 1,3 | lastnik "Bor", stanje 20 | sredina
napis: 1; 7 | a | levo | debelo
napis: 1; 5 | c | levo | debelo
napis: 1; 2 | b | levo | debelo
puščica: 1,3; 7 -> 4,5; 6,4
puščica: 1,3; 5 -> 4,5; 5,6
puščica: 1,3; 2 -> 4,5; 2
podnapis: Imeni a in c kažeta na isti objekt, ime b na drugega.
:::

Nov objekt nastane samo s klicem razreda, na primer `Racun("Ana", 130)`.

:::premisli
Po `c = a` pokličemo `c.dvigni(30)`. Koliko je `a.stanje`, če je bilo prej `130`? Napovej.
---
`100`. Imeni `a` in `c` kažeta na isti objekt, zato je sprememba prek `c` vidna tudi prek `a`. Enako se zgodi pri seznamih po `t2 = t1`.
:::

## Rešeni primeri

### Primer 1 (lažji): točka v ravnini

Dan je razred:

```python
class Tocka:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def razdalja(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5
```

Kaj vrneta `t.x` in `t.razdalja()` po `t = Tocka(3, 4)`?

**Podatki:** razred `Tocka` z atributoma `x`, `y` in metodo `razdalja`; klic `t = Tocka(3, 4)`
**Iščemo:** vrednost atributa `t.x` in rezultat `t.razdalja()`

:::formula
Konstruktor shrani argumente v atribute; v metodi je `self` objekt pred piko. Razdalja od izhodišča: $\sqrt{x^2 + y^2}$.
:::

**Rešitev:**

1. Klic `Tocka(3, 4)` ustvari objekt in pokliče `__init__` z `self` = novi objekt, `x = 3`, `y = 4`.
2. Konstruktor nastavi `self.x = 3` in `self.y = 4`, zato `t.x` vrne `3`.
3. Pri `t.razdalja()` je `self` objekt `t`, zato metoda računa s `self.x = 3` in `self.y = 4`.
4. $3^2 + 4^2 = 25$, koren iz $25$ je $5$; ker je eksponent `0.5` tipa `float`, Python vrne `5.0`.
5. Odgovor: `t.x` je `3`, `t.razdalja()` vrne `5.0`.

### Primer 2: sledimo stanju računa

Z razredom `Racun` iz razlage izvedemo:

```python
a = Racun("Ana", 100)
a.polozi(50)
ok = a.dvigni(200)
a.dvigni(30)
```

Kolikšno je na koncu `a.stanje` in kaj je shranjeno v `ok`?

**Podatki:** začetno stanje $100$, polog $50$, poskus dviga $200$, dvig $30$; metoda `dvigni` vrne `False` in ne spremeni stanja, če je znesek večji od stanja
**Iščemo:** končno vrednost `a.stanje` in vrednost `ok`

:::formula
Vsak klic metode spremeni atribut objekta pred piko: `polozi` prišteje, `dvigni` odšteje le, če je dovolj denarja.
:::

**Rešitev:**

1. Konstruktor: `a.stanje` je `100`.
2. `a.polozi(50)`: $100 + 50 = 150$, `a.stanje` je `150`.
3. `a.dvigni(200)`: pogoj `200 > 150` je resničen, zato metoda takoj vrne `False`; stanje ostane `150`, `ok` je `False`.
4. `a.dvigni(30)`: pogoj `30 > 150` ni resničen, zato $150 - 30 = 120$, metoda vrne `True` (vrednosti ne shranimo).
5. Odgovor: na koncu je `a.stanje` enako `120`, `ok` pa `False`.

### Primer 3 (težji): razred napišeš sam

Napiši razred `Pravokotnik`. Konstruktor sprejme širino in višino. Metoda `ploscina` vrne ploščino, `obseg` obseg, `povecaj(faktor)` pa obe stranici pomnoži s faktorjem. Kaj vrne `p.obseg()` po `p = Pravokotnik(3, 4)` in `p.povecaj(2)`?

**Podatki:** širina $3$, višina $4$, faktor povečave $2$; zahtevane metode `ploscina`, `obseg`, `povecaj`
**Iščemo:** kodo razreda in vrednost `p.obseg()` po povečavi

:::formula
Atribute nastavi v `__init__`; metoda, ki spremeni objekt, prepiše `self.atribut`. $S = a \cdot b$, $o = 2(a + b)$.
:::

**Rešitev:**

1. Podatke, ki jih ima vsak pravokotnik, shranimo kot atributa `self.sirina` in `self.visina` v konstruktorju.
2. Metodi `ploscina` in `obseg` samo računata iz atributov in vrneta rezultat z `return`.
3. Metoda `povecaj` ne vrača ničesar, ampak spremeni atributa:

```python
class Pravokotnik:
    def __init__(self, sirina, visina):
        self.sirina = sirina
        self.visina = visina

    def ploscina(self):
        return self.sirina * self.visina

    def obseg(self):
        return 2 * (self.sirina + self.visina)

    def povecaj(self, faktor):
        self.sirina = self.sirina * faktor
        self.visina = self.visina * faktor
```

4. Pred povečavo: ploščina $3 \cdot 4 = 12$, obseg $2 \cdot (3 + 4) = 14$.
5. `p.povecaj(2)`: širina postane $3 \cdot 2 = 6$, višina $4 \cdot 2 = 8$.
6. `p.obseg()` zdaj računa z novima atributoma: $2 \cdot (6 + 8) = 28$.
7. Odgovor: po povečavi `p.obseg()` vrne `28` (in `p.ploscina()` vrne `48`).

### Primer 4: zdaj ti

Razred `Kosarica` hrani cene artiklov v slovarju. Dopolni metodo `skupaj`, ki vrne vsoto vseh cen, in izračunaj rezultat po treh klicih `dodaj`.

```python
class Kosarica:
    def __init__(self):
        self.cene = {}

    def dodaj(self, ime, cena):
        self.cene[ime] = cena

    def skupaj(self):
        pass  # dopolni

k = Kosarica()
k.dodaj("kruh", 2.5)
k.dodaj("mleko", 1.5)
k.dodaj("jabolka", 0.75)
```

**Podatki:** prazna košarica, artikli kruh $2{,}5$ €, mleko $1{,}5$ €, jabolka $0{,}75$ €
**Iščemo:** telo metode `skupaj` in vrednost `k.skupaj()`

:::formula
Metoda bere atribut `self.cene`; vsota vrednosti slovarja je `sum(slovar.values())`.
:::

**Rešitev:**

1. Konstruktor nima parametrov razen `self`, zato `Kosarica()` kličemo brez argumentov. Vsak nov objekt dobi svoj prazen slovar.
2. Po treh klicih `dodaj` je `k.cene` enak `{"kruh": 2.5, "mleko": 1.5, "jabolka": 0.75}`.
3. Napiši telo metode `skupaj` sam in izračunaj vrednost, nato preveri:

:::premisli
Kako se glasi metoda `skupaj` in kaj vrne `k.skupaj()`?
---
```python
def skupaj(self):
    return sum(self.cene.values())
```
Vrne `4.75`, ker je $2{,}5 + 1{,}5 + 0{,}75 = 4{,}75$. Brez `self.` metoda ne bi našla slovarja.
:::

## Pogoste napake

- **Pozabljen `self` v definiciji.** Študent napiše `def obseg():`, ker pri klicu `p.obseg()` ne poda nobenega argumenta. Python pa objekt `p` poda sam, zato javi `TypeError: Pravokotnik.obseg() takes 0 positional arguments but 1 was given`. Prvi parameter vsake metode je `self`.
- **Brez `self.` v metodi.** V metodi `polozi` študent napiše `stanje = stanje + znesek`. To je lokalna spremenljivka, ki ne obstaja, zato dobi napako; če pa je le priredi (`stanje = 0`), atribut ostane nespremenjen. Do atributov objekta vedno dostopaš s `self.ime`.
- **Konstruktor naj vrne objekt.** Študent v `__init__` napiše `return self` ali kliče `a.__init__(...)` ročno. Objekt ustvari klic razreda `Racun(...)`; `__init__` ga le napolni z atributi in ne sme vrniti ničesar (Python javi `TypeError`).
- **Klic metode brez oklepajev.** `p.ploscina` ni število, ampak metoda sama; izpis pokaže nekaj kot `<bound method ...>`. Za izračun potrebuješ `p.ploscina()`.
- **`c = a` naredi kopijo.** Kot pri seznamih prirejanje objekta ne kopira, ampak doda novo ime za isti objekt. Če želiš drug račun, pokliči `Racun(...)`.

## Povzetek

- Razred (`class Ime:`) je načrt, objekt je primerek, ustvarjen s klicem `Ime(...)`.
- Konstruktor `__init__(self, ...)` se pokliče sam ob ustvarjanju; v njem nastavimo atribute `self.atribut = vrednost`.
- Atribut je podatek objekta, dostopen s piko (`a.stanje`); vsak objekt ima svoje atribute.
- Metoda je funkcija v razredu s prvim parametrom `self`; klic `a.polozi(50)` pomeni `Racun.polozi(a, 50)`.
- Spremenljivka kaže na objekt; `c = a` ne naredi kopije.

## Za izpit

Znati moraš povedati:
- definicijo razreda in objekta (primerka) ter kako objekt nastane: klic `Ime(...)` ustvari prazen objekt in nanj pokliče `__init__`;
- kaj je `self` in zakaj je klic `a.polozi(50)` enak klicu `Racun.polozi(a, 50)`;
- razliko med parametrom ali lokalno spremenljivko metode in atributom `self.ime`;
- razliko med atributom objekta (nastavljen v `__init__`) in atributom razreda (zapisan v telesu razreda) ter zakaj spremenljivih podatkov ne hranimo v atributu razreda;
- da spremenljivka kaže na objekt: `c = a` ne naredi kopije, enako velja za seznam, ki ga objekt shrani v atribut;
- čemu služita posebni metodi `__str__` in `__eq__`.

### Naloga 1

Razred `Polinom` hrani koeficiente polinoma v seznamu; `koef[i]` je koeficient pri $x^i$.

```python
class Polinom:
    def __init__(self, koef):
        self.koef = koef

    def stopnja(self):
        return len(self.koef) - 1

    def vrednost(self, x):
        v = 0
        for k in reversed(self.koef):
            v = v * x + k
        return v

    def odvod(self):
        nov = []
        for i in range(1, len(self.koef)):
            nov.append(i * self.koef[i])
        return Polinom(nov)

    def pomnozi(self, c):
        for i in range(len(self.koef)):
            self.koef[i] = self.koef[i] * c

t = [1, -3, 0, 2]
p = Polinom(t)
q = p.odvod()
r = p
r.pomnozi(2)
t.append(1)
print(p.vrednost(2), q.vrednost(2), p.stopnja(), q.stopnja())
```

(a) Kaj izpiše program? Pri vsakem koraku povej, na katere objekte kažejo imena `t`, `p`, `q` in `r`. (b) Spremeni eno vrstico razreda tako, da spreminjanje seznama `t` zunaj razreda ne vpliva več na polinom, in povej, kaj program izpiše po popravku.

**Rešitev:**

1. `p = Polinom(t)`: konstruktor izvede `self.koef = koef`, zato `p.koef` in `t` kažeta na isti seznam `[1, -3, 0, 2]`. Polinom je $1 - 3x + 2x^3$.
2. `q = p.odvod()`: metoda sestavi nov seznam `[1 * (-3), 2 * 0, 3 * 2]`, torej `[-3, 0, 6]`, in vrne nov objekt. `q` je $-3 + 6x^2$ in s `p` ne deli ničesar.
3. `r = p`: novo ime za isti objekt, novega polinoma ni.
4. `r.pomnozi(2)`: `self` je objekt, na katerega kažeta `r` in `p`. Skupni seznam postane `[2, -6, 0, 4]`; to vidimo prek `p.koef` in prek `t`. Objekt `q` je nastal prej in ostane `[-3, 0, 6]`.
5. `t.append(1)`: ker je `t` isti seznam kot `p.koef`, ima polinom `p` zdaj koeficiente `[2, -6, 0, 4, 1]`, torej $2 - 6x + 4x^3 + x^4$.
6. `p.vrednost(2)`: $2 - 6 \cdot 2 + 4 \cdot 2^3 + 2^4 = 2 - 12 + 32 + 16 = 38$. `q.vrednost(2)`: $-3 + 6 \cdot 2^2 = 21$.
7. `p.stopnja()` vrne $5 - 1 = 4$, `q.stopnja()` vrne $3 - 1 = 2$. Program izpiše `38 21 4 2`.
8. (b) V konstruktorju napišemo `self.koef = list(koef)`. Objekt dobi svojo kopijo seznama, zato `t.append(1)` spremeni le `t`. Imeni `r` in `p` še vedno kažeta na isti objekt, zato množenje z $2$ ostane: `p.koef` je `[2, -6, 0, 4]`.
9. Po popravku: `p.vrednost(2)` je $2 - 12 + 32 = 22$, `p.stopnja()` je $4 - 1 = 3$; `q` se ne spremeni.
10. Odgovor: (a) `38 21 4 2`; (b) s `self.koef = list(koef)` program izpiše `22 21 3 2`.

### Naloga 2

Natančno navedi razliko med atributom razreda in atributom objekta. Nato utemelji, kaj izpiše spodnji program, in razred popravi tako, da ima vsaka skupina svoje člane.

```python
class Skupina:
    clani = []

    def __init__(self, ime):
        self.ime = ime

    def dodaj(self, oseba):
        self.clani.append(oseba)

a = Skupina("A")
b = Skupina("B")
a.dodaj("Ana")
b.dodaj("Bor")
b.ime = "C"
print(len(a.clani), a.ime, a.clani is b.clani)
```

**Rešitev:**

1. Atribut objekta nastane s prirejanjem `self.ime = vrednost` (navadno v `__init__`) in pripada enemu objektu; vsak objekt ima svojega.
2. Atribut razreda je spremenljivka, zapisana v telesu razreda zunaj metod. Obstaja enkrat, v razredu, in ga delijo vsi objekti tega razreda.
3. Ko Python bere `self.clani`, atribut najprej išče v objektu; ker ga tam ni, ga najde v razredu. Pri `a` in `b` je to isti seznam `Skupina.clani`.
4. `a.dodaj("Ana")` in `b.dodaj("Bor")` zato dodajata v isti seznam, ki je na koncu `["Ana", "Bor"]`. Metoda `append` seznam spremeni, ničesar ne priredi, zato nov atribut objekta ne nastane.
5. `b.ime = "C"` je prirejanje atributu objekta `b`; atribut `a.ime` je ločen in ostane `"A"`.
6. Program izpiše `2 A True`: `len(a.clani)` je $2$, `a.ime` je `"A"`, izraz `a.clani is b.clani` pa je `True`, ker gre za en sam seznam.
7. Popravek: vrstico `clani = []` izbrišemo in v konstruktor dodamo `self.clani = []`. Vsak klic `Skupina(...)` potem ustvari nov prazen seznam in program izpiše `1 A False`.

### Naloga 3

Napiši razred `Ulomek` za ulomke s pozitivnim števcem in imenovalcem. Konstruktor ulomek okrajša. Metoda `plus(drugi)` vrne nov ulomek, vsoto obeh, in ne spremeni nobenega od seštevancev. Dodaj `__eq__` in `__str__` (izpis oblike `7/15`). Kaj izpiše `print(Ulomek(1, 6).plus(Ulomek(3, 10)))`? Utemelji, zakaj brez metode `__eq__` izraz `Ulomek(1, 2) == Ulomek(1, 2)` vrne `False`.

**Rešitev:**

1. Atributa sta `self.st` in `self.im`. Za krajšanje v konstruktorju z Evklidovim algoritmom poiščemo največji skupni delitelj in oba dela z njim delimo.
2. `plus` uporabi $\frac{a}{b} + \frac{c}{d} = \frac{ad + cb}{bd}$ in rezultat vrne s klicem `Ulomek(...)`; tako ga konstruktor sam okrajša, objekta `self` in `drugi` pa ostaneta nespremenjena.

```python
class Ulomek:
    def __init__(self, st, im):
        a, b = st, im
        while b != 0:
            a, b = b, a % b
        self.st = st // a
        self.im = im // a

    def plus(self, drugi):
        return Ulomek(self.st * drugi.im + drugi.st * self.im,
                      self.im * drugi.im)

    def __eq__(self, drugi):
        return self.st == drugi.st and self.im == drugi.im

    def __str__(self):
        return str(self.st) + "/" + str(self.im)
```

3. `Ulomek(1, 6)` in `Ulomek(3, 10)` sta že okrajšana. V `plus` je števec $1 \cdot 10 + 3 \cdot 6 = 28$, imenovalec $6 \cdot 10 = 60$.
4. Konstruktor novega ulomka: Evklidov algoritem na paru $(28, 60)$ da zaporedje $(60, 28)$, $(28, 4)$, $(4, 0)$, delitelj je $4$. Atributa sta $28 : 4 = 7$ in $60 : 4 = 15$.
5. `print` pokliče `__str__`, zato se izpiše `7/15`.
6. Brez `__eq__` operator `==` pri objektih lastnega razreda primerja, ali sta operanda isti objekt. Vsak klic `Ulomek(1, 2)` ustvari nov objekt, zato je rezultat `False`, čeprav sta atributa enaka. Z `__eq__` primerjamo atribute; ker konstruktor krajša, je tudi `Ulomek(2, 4) == Ulomek(1, 2)` enako `True`.

## Drugače: Uporaba v stroki

Matematik in fizik pri delu skoraj nikoli ne pišeta vsega sama, ampak uporabljata objekte iz knjižnic. V modulu `fractions` je `Fraction` **razred**: `Fraction(1, 3)` pokliče **konstruktor**, **atributa** `numerator` in `denominator` hranita števec in imenovalec. Vsota `Fraction(1, 3) + Fraction(1, 6)` je natanko `Fraction(1, 2)`, medtem ko `0.1 + 0.2` da `0.30000000000000004`.

V numeričnih izračunih je matrika **objekt** razreda `ndarray` iz knjižnice NumPy. Atribut `A.shape` pove velikost, na primer `(1000, 1000)`, **metoda** `A.sum()` pa sešteje vseh milijon elementov. V simulaciji gibanja delcev je vsak delec objekt z atributi za lego in hitrost ter metodo, ki ga premakne za en časovni korak.

Tudi `c = a` ima tu posledice. Matrika $1000 \times 1000$ realnih števil zasede $8$ MB. `B = A` ne porabi nič novega pomnilnika, a sprememba `B[0, 0] = 5` spremeni tudi `A`. Ločeno matriko naredi `A.copy()`, ki zasede novih $8$ MB.

## Drugače: Korak za korakom s številkami

Pri sledenju programu z objekti si naredi tabelo: vrstica za vsak klic, stolpec za vsak atribut. Za primer 2:

| Klic | `self` | `a.stanje` po klicu | Vrne |
|---|---|---|---|
| `Racun("Ana", 100)` | nov objekt | `100` | objekt |
| `a.polozi(50)` | `a` | `150` | `None` |
| `a.dvigni(200)` | `a` | `150` | `False` |
| `a.dvigni(30)` | `a` | `120` | `True` |

1. Pri vsakem klicu najprej zapiši, kateri objekt je `self` (tisti pred piko).
2. Preberi stare vrednosti atributov iz prejšnje vrstice.
3. Izvedi telo metode in v tabelo zapiši nove vrednosti.
4. Če metoda nima `return`, vrne `None`.

## Drugače: Bolj natančno

**Kaj je v resnici klic metode.** Izraz `a.polozi(50)` Python prevede v `Racun.polozi(a, 50)`. Metoda je navadna funkcija, shranjena v razredu; `self` ni rezervirana beseda, ampak le dogovorjeno ime prvega parametra.

**Atributi razreda in atributi objekta.** Spremenljivka, zapisana neposredno v telesu razreda (zunaj metod), je atribut **razreda** in jo delijo vsi objekti:

```python
class Kosarica:
    cene = {}          # en slovar za VSE košarice
```

Če bi tako napisali `Kosarica`, bi vsak `dodaj` pisal v isti slovar in vse košarice bi imele iste artikle. Zato spremenljive podatke (sezname, slovarje) ustvarjaj v `__init__` kot `self.cene = {}`.

**Izpis objekta.** `print(a)` privzeto izpiše nekaj kot `<__main__.Racun object at 0x...>`. Če v razred dodaš metodo `__str__(self)`, ki vrne niz, `print` uporabi ta niz. Metode z imeni oblike `__ime__` (posebne metode) določajo, kako se objekt obnaša pri vgrajenih operacijah, na primer `__eq__` za `==` in `__len__` za `len`.

**Zakaj ne slovar.** Objekt Pythona svoje atribute dejansko hrani v slovarju `a.__dict__`. Razred doda dvoje: metode so vezane na podatke in vsi objekti istega razreda imajo enako zgradbo, zato je program lažje brati in preverjati.

## Preveri se

? Kaj je konstruktor v Pythonovem razredu?
- Metoda, ki jo moraš poklicati ročno, preden uporabiš objekt.
~ Konstruktorja ne kličeš sam: Python ga pokliče ob `Racun(...)`.
+ Metoda `__init__`, ki se samodejno izvede ob ustvarjanju objekta in nastavi atribute.
- Metoda, ki z `return` vrne novi objekt.
~ Objekt ustvari klic razreda; `__init__` ne sme vrniti ničesar.
> Ob `Racun("Ana", 100)` Python ustvari objekt in nanj pokliče `__init__`, ki nastavi začetne atribute.

? Metoda je definirana kot `def polozi(self, znesek):`. Koliko argumentov podaš pri klicu `a.polozi(...)`?
- Dva: objekt in znesek.
~ Objekt pred piko Python poda sam kot `self`, zato ga ne pišeš v oklepaje.
+ Enega: znesek.
- Nobenega.
~ Parameter `znesek` mora dobiti vrednost, sicer Python javi napako.
> Klic `a.polozi(50)` je enak `Racun.polozi(a, 50)`: `self` je `a`, `znesek` je `50`.

? Imamo `a = Racun("Ana", 100)`, nato `c = a` in `c.polozi(20)`. Koliko je `a.stanje`?
- `100`
~ `c = a` ne naredi kopije. Obe imeni kažeta na isti objekt.
+ `120`
- `20`
~ `polozi` stanju prišteje znesek, ne nastavi ga na znesek.
> `a` in `c` sta dve imeni za en objekt, zato se polog vidi tudi prek `a`: $100 + 20 = 120$.

? Za razred `Pravokotnik` iz primera 3 izvedemo `p = Pravokotnik(5, 2)` in `p.povecaj(3)`. Kaj vrne `p.ploscina()`?
- `10`
~ To je ploščina pred povečavo. `povecaj` je spremenil atributa objekta.
- `30`
~ Povečali sta se obe stranici, zato se ploščina poveča devetkrat, ne trikrat.
+ `90`
> Po povečavi je širina $5 \cdot 3 = 15$ in višina $2 \cdot 3 = 6$, ploščina je $15 \cdot 6 = 90$.

? V razredu `Tocka` napišemo `def premakni(self, dx): x = self.x + dx`. Kaj se zgodi po `t = Tocka(3, 4)` in `t.premakni(2)`?
- `t.x` postane `5`.
~ `x` brez `self.` je lokalna spremenljivka metode, ki po koncu izgine.
+ `t.x` ostane `3`.
- Python javi napako, ker `x` ni definiran.
~ Prirejanje `x = ...` lokalno spremenljivko ustvari, zato napake ni; samo atribut se ne spremeni.
> Atribut spremeniš le s `self.x = self.x + dx`. Brez `self.` se rezultat shrani v lokalno spremenljivko.

:::simboli
x, y | koordinati točke | | | razdalja od izhodišča je √(x² + y²)
S | ploščina pravokotnika | S = a \cdot b
o | obseg pravokotnika | o = 2(a + b)
a, b | stranici pravokotnika
:::
