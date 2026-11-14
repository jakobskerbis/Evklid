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

```
a ──┐
    ├──►  Racun: lastnik "Ana", stanje 130
c ──┘
b ─────►  Racun: lastnik "Bor", stanje 20
```

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

## Drugače: Iz vsakdanjega življenja

Pomisli na obrazec za vpis na fakulteto. Prazen obrazec je **razred**: določa, katera polja obstajajo (ime, priimek, datum rojstva). Vsak izpolnjen obrazec je **objekt**: ima ista polja, a svoje vrednosti. Ko Ana popravi svoj datum, se Borov obrazec ne spremeni.

**Konstruktor** je trenutek, ko vzameš nov obrazec in vpišeš začetne podatke. **Atributi** so izpolnjena polja. **Metode** so dejanja, ki jih uradnik naredi z obrazcem, na primer »potrdi« ali »spremeni naslov«. Vsakič dela z enim, točno določenim obrazcem. To je `self`.

Če dva uradnika držita isti list papirja, je to `c = a`: dve roki, en obrazec.

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
