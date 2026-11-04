---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Recimo, da na Zemlji skočiš $40\,\mathrm{cm}$ visoko. Na Luni je težni pospešek približno $1{,}62\,\mathrm{m/s^2}$, na Zemlji $9{,}81\,\mathrm{m/s^2}$, zato te ista odrivna hitrost tam ponese približno šestkrat višje. Bi preskočil skalo, visoko $2\,\mathrm{m}$? Program naj se odloči sam: glede na vnos izpiše eno ali drugo vrstico. Za take **odločitve** služijo **pogojni stavki**.

## Razlaga

**1. Poskus v konzoli.** V interaktivno okno Pythona (konzolo, kjer ukaz vtipkaš za `>>>`) vtipkaj nekaj primerjav in zapiši, kaj vrne:

| izraz | rezultat |
|---|---|
| `242.2 > 200` | `True` |
| `181.7 > 200` | `False` |
| `5.7 <= 6` | `True` |
| `"Mars" == "mars"` | `False` |

Opaziš vzorec: vsaka primerjava vrne logično vrednost tipa `bool`, ki je lahko le `True` ali `False`. Primerjalni operatorji so `<`, `>`, `<=`, `>=`, `==` (enako) in `!=` (različno). Pozor: `==` primerja, en sam `=` pa prireja vrednost spremenljivki.

Python dovoli tudi **verižno primerjavo**: `a < b < c` pomeni `a < b and b < c` (veljati morata obe primerjavi; `and` natančneje spoznaš v točki 6), le da se `b` izračuna enkrat. Števila tipa `float` so shranjena dvojiško in le približno, zato `0.1 + 0.2 == 0.3` vrne `False` (levo je `0.30000000000000004`). Decimalni števili zato primerjamo s toleranco: `abs(x - y) < 1e-9` ali `math.isclose(x, y)`.

**2. Stavek `if`.** Zdaj napišimo program za skok:

```python
h = float(input("Višina skoka na Zemlji (cm): "))
h_luna = h * 9.81 / 1.62
if h_luna > 200:
    print("Na Luni preskočiš skalo!")
print("Konec.")
```

Poženi ga dvakrat: z vnosom `40` in z vnosom `30`. Pri $40$ dobiš $h_\text{luna} \approx 242{,}2$ in program izpiše obe vrstici. Pri $30$ dobiš $h_\text{luna} \approx 181{,}7$ in izpiše le »Konec.«.

Pravilo, ki ga razbereš: za `if` stoji **pogoj** (izraz, ki da `True` ali `False`) in dvopičje. Vrstice pod njim so **zamaknjene** za štiri presledke. Ta zamaknjeni **blok** se izvede le, če je pogoj `True`. Prva nezamaknjena vrstica ni več del bloka, zato se izvede vedno.

**Pravilo (pomen stavka `if`).** Naj bo `P` poljuben izraz in `B` zamaknjen blok pod `if P:`. Python izračuna `P` in ga pretvori v logično vrednost `bool(P)`. Če je `bool(P)` enako `True`, izvede `B` in nato nadaljuje za blokom; sicer `B` preskoči. Pogoj ni nujno primerjava. Med vgrajenimi vrednostmi so **neresnične** (angl. *falsy*) `False`, `None`, ničla vsakega številskega tipa (`0`, `0.0`) ter prazen niz in prazne zbirke (`""`, `[]`, `()`, `{}`, `set()`); vse druge so resnične. Zato `if seznam:` pomeni »če seznam ni prazen«.

:::premisli
Kaj izpiše program, če vrstico `print("Konec.")` zamakneš za štiri presledke in vneseš `30`?
---
Razen vprašanja za vnos ne izpiše ničesar. Zamaknjena vrstica postane del bloka `if`, pogoj $181{,}7 > 200$ pa je `False`, zato se celoten blok preskoči.
:::

**3. Stavek `else`.** Pri $30$ bi radi slišali tudi slabo novico. Dodamo `else:` (brez pogoja), poravnan z `if`:

```python
if h_luna > 200:
    print("Preskočiš skalo!")
else:
    print("Skala je previsoka.")
```

Zdaj se izvede **natanko eden** od dveh blokov, ker je `bool(P)` bodisi `True` bodisi `False`.

**4. Veriga `elif`.** Astronomi svetlost zvezd merijo z **navidezno magnitudo** $m$: manjše število pomeni svetlejši objekt. Do $m = 6$ objekt vidiš s prostim očesom, pod $m = 0$ pa je zelo svetel (Venera ima okoli $-4{,}4$). Treh možnosti z enim `if` in `else` ne zajameš, zato vmes dodamo `elif` (»else if«):

```python
if m < 0:
    print("Zelo svetel")
elif m <= 6:
    print("Viden s prostim očesom")
else:
    print("Potrebuješ daljnogled")
```

Python preverja pogoje od zgoraj navzdol in izvede **prvi** blok, katerega pogoj je `True`. Ostale preskoči, tudi če bi bili resnični. Za Venero sta resnična oba prva pogoja, izpiše pa se le »Zelo svetel«.

**Izrek (veriga `if`/`elif`/`else`).** Naj bodo $P_1, \dots, P_n$ zaporedni pogoji verige, $B_1, \dots, B_n$ njihovi bloki in $B_\text{else}$ blok `else`, in naj izračun nobenega pogoja ne javi napake. Potem se $B_k$ izvede natanko tedaj, ko je $P_k$ resničen in so $P_1, \dots, P_{k-1}$ neresnični, $B_\text{else}$ pa natanko tedaj, ko so neresnični vsi. Zato se izvede **največ en** blok, če ima veriga `else`, pa **natanko en**.

*Dokaz.* Python preveri $P_k$ le, če so bili vsi prejšnji pogoji neresnični; ob prvem resničnem izvede njegov blok in skoči za verigo. Od tod prvi del. Za $j < k$ blok $B_k$ zahteva, da je $P_j$ neresničen, $B_j$ pa, da je $P_j$ resničen, zato se ne moreta izvesti oba. Z `else`: če je resničen vsaj en pogoj, se izvede blok najmanjšega takega $k$, sicer $B_\text{else}$. $\square$

:::premisli
Prva dva pogoja zamenjaš: najprej `if m <= 6:`, nato `elif m < 0:`. Kaj izpiše program za Venero ($m = -4{,}4$)? Ali sploh obstaja $m$, pri katerem bi izpisal »Zelo svetel«?
---
»Viden s prostim očesom«. Pogoj $-4{,}4 \le 6$ je resničen in pride prvi, zato se izvede njegov blok, `elif` pa se sploh ne preveri. Tak $m$ ne obstaja: vsak $m < 0$ ujame že prvi pogoj. Pri verigi `elif` gre ožji pogoj pred širšega.
:::

**5. Gnezdenje.** Blok lahko vsebuje nov pogojni stavek. Temu rečemo **gnezdenje**. Opazovanje neba je smiselno le ponoči, in še to le, če ni preveč oblačno:

```python
if je_noc:
    if oblacnost < 30:
        print("Opazuj!")
    else:
        print("Preveč oblačno.")
else:
    print("Počakaj na noč.")
```

Kot drevo:

```
je_noc?
├─ False → "Počakaj na noč."
└─ True → oblacnost < 30?
          ├─ True  → "Opazuj!"
          └─ False → "Preveč oblačno."
```

Notranji `if` je zamaknjen za štiri presledke, ker je znotraj zunanjega bloka, njegov blok pa za osem. Zamik pove, kateremu `if` pripada kateri `else`.

**6. Logični operatorji.** `A and B` je resničen natanko tedaj, ko sta resnična oba, `A or B`, ko je resničen vsaj eden, `not A` pa, ko je `A` neresničen. Operatorja `and` in `or` Python računa **skrajšano**: pri `A and B` izračuna `B` le, če je `A` resničen, pri `A or B` le, če je `A` neresničen (vrneta zadnji izračunani operand, `0 or 5` vrne `5`). Zato je `n != 0 and x / n > 2` varen: pri `n = 0` deljenja ni.

Če pri gnezdenju potrebuješ le izid »Opazuj!«, pogoja združiš z `and`. Izpeljava: notranji blok se izvede natanko tedaj, ko je resničen `je_noc` in nato še `oblacnost < 30`, kar je ravno pogoj `je_noc and oblacnost < 30`. Za zanikanje sestavljenih pogojev veljata **De Morganova zakona**: `not (A and B)` je enakovredno `not A or not B`, `not (A or B)` pa `not A and not B`. *Dokaz* s tabelo resničnosti (T = `True`, F = `False`):

| A | B | `not (A and B)` | `not A or not B` |
|---|---|---|---|
| T | T | F | F |
| T | F | T | T |
| F | T | T | T |
| F | F | T | T |

| A | B | `not (A or B)` | `not A and not B` |
|---|---|---|---|
| T | T | F | F |
| T | F | F | F |
| F | T | F | F |
| F | F | T | T |

V obeh tabelah se zadnja dva stolpca ujemata v vsaki vrstici. $\square$ Opazovanje torej ni mogoče, ko velja `not je_noc or oblacnost >= 30`.

## Rešeni primeri

### Primer 1 (lažji): ali Uran vidimo?

Uran ima navidezno magnitudo $m = 5{,}7$. Napiši program, ki izpiše »Vidno« ali »Nevidno« (s prostim očesom, meja $m \le 6$), in ugotovi izpis za Uran.

**Podatki:** $m = 5{,}7$, meja vidnosti $m \le 6$
**Iščemo:** program in njegov izpis

:::formula
`if pogoj:` blok1 `else:` blok2 — izvede se natanko eden od blokov
:::

**Rešitev:**

1. Pogoj je primerjava `m <= 6`, program:

```python
m = 5.7
if m <= 6:
    print("Vidno")
else:
    print("Nevidno")
```

2. `5.7 <= 6` je `True`, zato se izvede prvi blok.
3. Odgovor: program izpiše »Vidno«.

### Primer 2: razvrščanje objektov

Za Venero ($m = -4{,}4$), Severnico ($m = 2{,}0$) in Neptun ($m = 7{,}8$) ugotovi izpis verige `elif` iz razlage.

**Podatki:** $m_1 = -4{,}4$, $m_2 = 2{,}0$, $m_3 = 7{,}8$; program iz točke 4 razlage
**Iščemo:** izpis za vsak objekt

:::formula
`if` / `elif` / `else`: izvede se prvi blok z resničnim pogojem, sicer `else`
:::

**Rešitev:**

1. Venera: `-4.4 < 0` je `True`. Izpis »Zelo svetel«, nadaljnjih pogojev ne preverja.
2. Severnica: `2.0 < 0` je `False`, `2.0 <= 6` je `True`. Izpis »Viden s prostim očesom«.
3. Neptun: oba pogoja sta `False`, ostane `else`: »Potrebuješ daljnogled«.
4. Odgovor: Venera je zelo svetla, Severnica vidna s prostim očesom, Neptun le z daljnogledom.

### Primer 3 (težji): start rakete z vnosom

Raketa sme vzleteti le, če je hitrost vetra manjša od $15\,\mathrm{m/s}$. Če veter dovoljuje, mora biti temperatura vsaj $-5\,^\circ\mathrm{C}$, sicer start prestavijo zaradi zmrzali. Program prebere obe vrednosti z `input()`. (a) Napiši program z gnezdenim `if` in ugotovi izpis pri vnosih `12` in `-8`. (b) Zapiši enakovreden program brez gnezdenja, z eno verigo `if`/`elif`/`else`. (c) Zapiši en sam pogoj brez `not`, pri katerem start prestavijo (iz kateregakoli razloga), in ga preveri pri $v = 15$, $T = 0$.

**Podatki:** meja vetra $15\,\mathrm{m/s}$ (strogo manj), meja temperature $-5\,^\circ\mathrm{C}$ (vsaj), vnos $v = 12$, $T = -8$; za (c) $v = 15$, $T = 0$
**Iščemo:** program in izpis, enakovredno verigo, pogoj za preložitev

:::formula
Gnezden `if`: notranji pogoj se preveri le, če je zunanji `True`; `input()` vrne niz, zato `float(...)`. De Morgan: `not (A and B)` ≡ `not A or not B`
:::

**Rešitev:**

1. `input()` vrne niz. Primerjava `"12" < 15` bi javila napako, zato vrednost pretvorimo s `float()`.
2. Program:

```python
v = float(input("Veter (m/s): "))
T = float(input("Temperatura (°C): "))
if v < 15:
    if T >= -5:
        print("Start!")
    else:
        print("Prestavljeno: zmrzal.")
else:
    print("Prestavljeno: veter.")
```

3. Zunanji pogoj: `12.0 < 15` je `True`, zato gremo v zunanji blok.
4. Notranji pogoj: `-8.0 >= -5` je `False`, ker je $-8$ manjše od $-5$. Izvede se notranji `else`, izpis je »Prestavljeno: zmrzal.«.
5. (b) Preberemo, kdaj se izvede kateri izpis: veter pri `v >= 15`, zmrzal pri `v < 15 and T < -5`, start pri `v < 15 and T >= -5`. Veriga:

```python
if v >= 15:
    print("Prestavljeno: veter.")
elif T < -5:
    print("Prestavljeno: zmrzal.")
else:
    print("Start!")
```

6. Po izreku o verigi se `elif` izvede natanko pri `v >= 15` neresničnem in `T < -5` resničnem, torej pri `v < 15 and T < -5`, `else` pa pri `v < 15 and T >= -5`. To so isti trije primeri, zato sta programa enakovredna. Vrstni red šteje: s `T < -5` na prvem mestu bi pri $v = 20$, $T = -8$ dobili »zmrzal«.
7. (c) Start je `v < 15 and T >= -5`, preložitev je njegovo zanikanje. Po De Morganu je to `not (v < 15) or not (T >= -5)`, torej `v >= 15 or T < -5`.
8. Preverba: pri $v = 15$ je `15 >= 15` resnično, zato je ves pogoj `True`, `T < -5` se zaradi skrajšanega računanja ne preveri. Tudi program da isto: `15 < 15` je `False`, izpis »Prestavljeno: veter.«.
9. Odgovor: (a) program izpiše »Prestavljeno: zmrzal.«; (b) zgornja veriga je enakovredna; (c) start prestavijo pri `v >= 15 or T < -5`, pri $v = 15$, $T = 0$ zaradi vetra.

### Primer 4 – zdaj ti: skok na Luni

Izidi: nad $300\,\mathrm{cm}$ »Preskočiš lunarni modul«, nad $200\,\mathrm{cm}$ »Preskočiš skalo«, sicer »Ostaneš na tleh«. Kaj izpiše za skok $h = 45\,\mathrm{cm}$ na Zemlji?

**Podatki:** $h = 45\,\mathrm{cm}$, $h_\text{luna} = h \cdot 9{,}81 / 1{,}62$, meji $300\,\mathrm{cm}$ in $200\,\mathrm{cm}$
**Iščemo:** izpis programa

:::formula
`if h_luna > 300:` … `elif h_luna > 200:` … `else:` …
:::

**Rešitev:**

1. $h_\text{luna} = 45 \cdot 9{,}81 / 1{,}62 = 272{,}5\,\mathrm{cm}$.
2. Prvi pogoj: $272{,}5 > 300$ je `False`, zato Python preveri `elif`.
3. Preveri drugi pogoj sam.

:::premisli
Kaj program izpiše?
---
»Preskočiš skalo«, ker je $272{,}5 > 200$ `True`.
:::

## Pogoste napake

- **`=` namesto `==`.** `if m = 6:` je prirejanje v pogoju, zato Python javi `SyntaxError`. Primerja `==`.
- **Manjkajoče dvopičje ali napačen zamik.** Brez `:` je napaka v skladnji; nezamaknjena vrstica se izvede vedno, vse vrstice bloka pa morajo imeti enak zamik.
- **Širši pogoj pred ožjim.** Pri `if m <= 6:` pred `elif m < 0:` se drugi blok nikoli ne izvede.
- **Ločeni `if` namesto `elif`.** Zaporedni `if` se preverijo vsi in lahko izpišejo več vrstic.
- **Primerjava niza s številom.** `"12" < 15` javi `TypeError`, `"12" == 12` pa tiho vrne `False`. Vnos iz `input()` najprej pretvori z `int()` ali `float()`.

## Povzetek

- Primerjave (`<`, `>`, `<=`, `>=`, `==`, `!=`) vrnejo `True` ali `False`; `float` primerjaj s toleranco.
- `if P:` izvede zamaknjeni blok le, ko je `bool(P)` `True`; `else:` ujame vse ostalo.
- Veriga `elif`: izvede se prvi blok z resničnim pogojem, zato ožji pogoji gredo naprej.
- Gnezdenje z enim izidom je enakovredno `and`; `and` in `or` se računata skrajšano, zanikamo po De Morganu.
- Vnos iz `input()` pretvori v število, preden ga primerjaš.

## Za izpit

Znati moraš povedati:

- pomen stavka `if P:` (izračun `bool(P)`) in katere vgrajene vrednosti so neresnične;
- izrek o verigi `if`/`elif`/`else` z vsemi pogoji in dokaz, da se izvede največ en blok, z `else` natanko en;
- skrajšano računanje `and` in `or` ter zakaj je `n != 0 and x / n > 2` varen pogoj;
- De Morganova zakona z dokazom s tabelo resničnosti in zanikanje sestavljenega pogoja;
- izpeljavo enakovrednosti gnezdenega `if` in pogoja z `and`, pomen verižne primerjave in zakaj `float` primerjamo s toleranco.

### Naloga 1

Dana je funkcija:

```python
def razred(x, n):
    if n != 0 and x / n > 2:
        return "A"
    elif x > 10 or x / n < 0:
        return "B"
    elif not (x >= 0 and n > 0):
        return "C"
    else:
        return "D"
```

Za pare $(x, n) = (6, 2)$, $(4, 3)$, $(-1, 2)$, $(-1, -1)$, $(12, 0)$ in $(10, 0)$ ugotovi, kaj funkcija vrne ali katero napako javi, in navedi, kateri deli pogojev se sploh izračunajo. Nato utemelji, da pri $x > 0$ funkcija nikoli ne vrne »C«.

**Rešitev:**

1. $(6, 2)$: `2 != 0` in `6 / 2 = 3.0 > 2` sta `True`. Vrne »A«.
2. $(4, 3)$: `4 / 3 ≈ 1.33 > 2` je `False`; `4 > 10` in `4 / 3 < 0` sta `False`; `4 >= 0 and 3 > 0` je `True`, zanikanje `False`. Vrne »D« (`else`).
3. $(-1, 2)$: `-0.5 > 2` je `False`; `-1 > 10` je `False`, `-0.5 < 0` je `True`. Vrne »B«.
4. $(-1, -1)$: `1.0 > 2` je `False`; `-1 > 10` in `1.0 < 0` sta `False`; `-1 >= 0` je `False`, zato `and` ne preveri `n > 0`, `not` da `True`. Vrne »C«.
5. $(12, 0)$: `0 != 0` je `False`, zato `and` ne deli. `12 > 10` je `True`, zato tudi `or` ne deli. Vrne »B«.
6. $(10, 0)$: prvi pogoj je `False` brez deljenja; `10 > 10` je `False`, zato `or` izračuna `10 / 0`: `ZeroDivisionError`.
7. Pri $x > 0$ je `x >= 0` resnično, zato »C« zahteva $n \le 0$. Pri $n = 0$ drugi pogoj vrne »B« (če $x > 10$) ali javi napako. Pri $n < 0$ je $x / n < 0$, zato najkasneje drugi pogoj vrne »B«. »C« ni dosegljiv.
8. Odgovor: A, D, B, C, B in `ZeroDivisionError`; pri $x > 0$ funkcija »C« nikoli ne vrne.

### Naloga 2

Utemelji, ali sta programu A enakovredna programa B in C, torej ali za vsako realno število `m` na koncu dasta isti `r`.

```python
# A
if m < 0: r = "svetel"
elif m <= 6: r = "viden"
else: r = "daljnogled"

# B
r = "daljnogled"
if m <= 6: r = "viden"
if m < 0: r = "svetel"

# C
r = "daljnogled"
if m < 0: r = "svetel"
if m <= 6: r = "viden"
```

**Rešitev:**

1. A: po izreku o verigi se izvede blok prvega resničnega pogoja, zato $m < 0$ da »svetel«, $0 \le m \le 6$ »viden«, $m > 6$ »daljnogled«.
2. B: ločena `if` se preverita oba in zadnja prireditev obvelja. Pri $m < 0$ sta resnična oba, zadnji zapiše »svetel«. Pri $0 \le m \le 6$ je resničen le prvi: »viden«. Pri $m > 6$ ostane »daljnogled«. V vseh treh primerih enako kot A, zato sta A in B enakovredna.
3. C: pri $m = -4{,}4$ prvi `if` zapiše »svetel«, nato je `-4.4 <= 6` resnično in drugi `if` to prepiše v »viden«. A da »svetel«, zato C ni enakovreden.
4. Odgovor: B je enakovreden A, C ni (protiprimer $m = -4{,}4$). Pri ločenih `if` mora širši pogoj priti prvi, pri verigi `elif` ožji.

## Drugače: Korak za korakom s številkami

Veriga `elif` za magnitudo:

| $m$ | `m < 0` | `m <= 6` | izpis |
|---|---|---|---|
| $-4{,}4$ | `True` | se ne preveri | Zelo svetel |
| $0$ | `False` | `True` | Viden s prostim očesom |
| $6$ | `False` | `True` | Viden s prostim očesom |
| $6{,}1$ | `False` | `False` | Potrebuješ daljnogled |

Mejna vnosa: `0 < 0` je neresnično (strogi neenačaj meje ne vključuje), `6 <= 6` pa resnično. Preizkusi vrednost na meji in tik nad njo.

## Drugače: Uporaba v stroki

Regulator laboratorijskega reaktorja vsako sekundo: `if T > T_max:` izklopi grelec, `elif T < T_min:` ga vklopi, sicer ne spremeni ničesar. Pas med mejama (histereza) prepreči stalno preklapljanje releja. Pri meritvah `if n > 0 and vsota / n > meja:` varuje pred deljenjem z nič.

## Preveri se

? Kaj v Pythonu pomenijo znaki `=`, `==` in `!=`?
- `=` primerja, `==` priredi, `!=` primerja različnost
~ Vlogi sta zamenjani.
+ `=` priredi, `==` primerja enakost, `!=` primerja različnost
- vsi trije primerjajo, le na različne načine
~ `m = 6` v `m` zapiše $6$ in ne vrne `True` ali `False`.
> `m = 6` shrani vrednost, `m == 6` in `m != 6` primerjata.

? Program izpiše »Preskočiš«, če je `h * 9.81 / 1.62 > 300`. Kolikšen mora biti skok `h` na Zemlji vsaj?
- približno $300\,\mathrm{cm}$
~ To je meja na Luni; na Zemlji je skok šestkrat nižji.
+ približno $50\,\mathrm{cm}$
- približno $1800\,\mathrm{cm}$
~ Mejo si pomnožil s $6$ namesto delil.
- približno $6\,\mathrm{cm}$
~ $6$ je razmerje težnih pospeškov, ne višina skoka.
> $9{,}81 / 1{,}62 \approx 6$, zato mora biti $h > 300 / 6 = 50\,\mathrm{cm}$ (natančneje $49{,}5\,\mathrm{cm}$).

? V verigi `if m <= 6:` … `elif m < 0:` … se drugi blok nikoli ne izvede. Zakaj?
- Ker `elif` deluje le z `==`.
~ `elif` sprejme poljuben pogoj.
- Ker Python `elif` preveri le, če je prvi pogoj `True`.
~ Ravno obratno: le, ko je prejšnji `False`.
+ Ker vsak $m < 0$ izpolni že pogoj $m \le 6$ in se izvede prvi blok.
> Izvede se le prvi resnični blok, zato gre ožji pogoj naprej.

? Program je `if T >= -5:` `print("Start")` `else:` `print("Zmrzal")`. Pri kateri temperaturi izpiše »Zmrzal«?
- $T = -5$
~ `-5 >= -5` je `True`, ker `>=` vključuje mejo.
- $T = 0$
~ $0 \ge -5$ drži, izpis je »Start«.
+ $T = -6$
- $T = 5$
~ $5 \ge -5$ drži.
> `else` se izvede pri $T < -5$; od ponujenih je to le $-6$.

? Gnezden `if je_noc:` z notranjim `if oblacnost < 30:` `print("Opazuj!")` (brez `else`) zapišeš z enim `if`. Kateri pogoj je enakovreden?
- `if je_noc or oblacnost < 30:`
~ Z `or` bi izpisal »Opazuj!« tudi podnevi ob jasnem nebu.
+ `if je_noc and oblacnost < 30:`
- `if je_noc == oblacnost < 30:`
~ To je veriga primerjav `je_noc == oblacnost and oblacnost < 30`, kar nima smisla.
> Notranji blok se izvede le, ko sta oba pogoja `True`.

:::simboli
h | višina skoka na Zemlji | | cm | vnos v programu
h_\text{luna} | višina skoka na Luni | h_\text{luna} = h \cdot \dfrac{9{,}81}{1{,}62} | cm | približno šestkrat višje kot na Zemlji
m | navidezna magnituda | | – | manjše število pomeni svetlejši objekt
m_1, m_2, m_3 | navidezne magnitude treh objektov | | – | vnosi za verigo elif
v | hitrost vetra | | m/s | meja 15 m/s
T | temperatura | | ^\circ\mathrm{C} | meja $-5\,^\circ\mathrm{C}$
:::
