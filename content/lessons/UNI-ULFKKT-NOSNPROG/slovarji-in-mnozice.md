---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na transfuzijski postaji v enem dopoldnevu daruje kri $9$ ljudi. Sestra zapiše njihove krvne skupine v seznam, ukaz `len(set(skupine))` vrne $4$. Kam je izginilo pet darovalcev?

Nikamor. Python je odgovoril na drugo vprašanje: **koliko različnih** krvnih skupin je bilo. In še ena nenavadnost: če iz zbirke `{"A": 4, "0": 3}` hočeš »prvi element« z `[0]`, Python ne vrne $4$, ampak javi napako, čeprav podatki tam so.

Oboje postane logično, ko spoznaš dve novi zbirki. **Slovar** hrani pare »ime: podatek« in iščeš po imenu, ne po mestu. **Množica** hrani vsak element samo enkrat. Z njima hitro prešteješ pojavitve (diagnoze, nukleotide v DNK) in primerjaš skupine, na primer simptome dveh bolezni.

## Razlaga

**Najprej en primer na papirju.** Seznam krvnih skupin z dopoldneva je:

```python
skupine = ["A", "0", "A", "B", "0", "A", "AB", "0", "A"]
```

Sestra bi na list napisala štiri vrstice in ob vsaki delala črtice: A ||||, 0 |||, B |, AB |. Na levi je **oznaka**, na desni **število**. Natanko tako je zgrajen slovar:

```python
stevec = {"A": 4, "0": 3, "B": 1, "AB": 1}
```

Vsak par ima **ključ** (levo od dvopičja) in **vrednost** (desno). Ključ je kot naslov predalčka, vrednost je tisto, kar je v njem.

**Definicija.** *Slovar* (tip `dict`) je zbirka parov `ključ: vrednost`, v kateri so ključi paroma različni in **zgoščljivi** (angl. *hashable*): nespremenljivi objekti, npr. `int`, `float`, `str`, `bool` ali terka takih vrednosti; seznam, množica ali slovar ne more biti ključ. Matematično je slovar preslikava iz končne množice ključev v vrednosti. Ključa sta ista, če sta enaka po `==`. Zato `{1: "a", 1.0: "b", True: "c"}` ni slovar s tremi ključi, ampak `{1: "c"}`: velja `1 == 1.0 == True`, ostane prvi zapisani ključ, vrednost pa se dvakrat prepiše.

**Branje in pisanje.** Do vrednosti prideš s ključem v oglatih oklepajih: `stevec["0"]` je `3`. Z enakim zapisom vrednost spremeniš ali dodaš nov par: `stevec["A"] = 5` prepiše staro vrednost, `stevec["A2"] = 1` doda nov ključ. Ključi so **edinstveni**: isti ključ ne more biti v slovarju dvakrat. `len(stevec)` pove število ključev, ne vsote vrednosti.

Ker slovar išče po ključu, `stevec[0]` ne pomeni »prvi par«. Python išče ključ `0` (število), ga ne najde in javi napako `KeyError`. Enako se zgodi pri ključu, ki ga ni: `stevec["C"]`. Zato pred branjem preveri `if "C" in stevec:` (operator `in` pri slovarju gleda ključe) ali uporabi `stevec.get("C", 0)`, ki vrne `0`, če ključa ni. Natančno: `d.get(k, p)` vrne `d[k]`, če je `k in d`, sicer `p` (brez `p` vrne `None`), slovarja pa ne spremeni.

:::premisli
Pisanje v nov ključ par doda, branje manjkajočega ključa pa javi napako. Slovar je prazen: `stevec = {}`. Ali vrstica `stevec["A"] = stevec["A"] + 1` naredi `{"A": 1}`? Zakaj?
---
Python javi `KeyError`. Desna stran se izračuna najprej, ključa `"A"` pa še ni, zato ga ni mogoče prebrati. Prvo pojavitev moraš zapisati s `stevec["A"] = 1`.
:::

**Od primera do postopka.** Črtice na papirju pretvorimo v zanko. Za vsak element vprašamo isto, kar se je spraševala sestra: »Ali vrstico za to skupino že imam?«

```python
stevec = {}
for s in skupine:
    if s in stevec:
        stevec[s] += 1
    else:
        stevec[s] = 1
```

Zapis `stevec[s] += 1` je okrajšava za `stevec[s] = stevec[s] + 1`. Krajše celoten `if` naredi `stevec[s] = stevec.get(s, 0) + 1`. Postopek deluje za vsak seznam ali niz: za diagnoze v kartoteki, za črke v zaporedju DNK, za besede v izvidu. Po slovarju se sprehodiš z `for k in stevec:`; zanka da ključe, vrednost dobiš s `stevec[k]`.

**Trditev (pravilnost štetja).** Naj bo `seznam` dolžine $n$ z zgoščljivimi elementi. Po zanki je za vsak element `x` seznama `stevec[x]` enak številu pojavitev `x`, ključi slovarja pa so natanko različni elementi. Zato je vsota vrednosti enaka $n$ in `len(stevec) == len(set(seznam))` (`set` spodaj odstrani ponovitve).

*Dokaz* (indukcija po številu obdelanih elementov). Dokažemo močnejšo trditev: po obdelanih prvih $i$ elementih so ključi natanko različni med njimi, vrednost vsakega pa je število njegovih pojavitev med njimi. Pred zanko je slovar prazen, zato to za $i = 0$ drži. Naj drži po $i$ elementih in naj bo naslednji `s`. Če `s` že je ključ, se njegova vrednost poveča za $1$, sicer `s` postane ključ z vrednostjo $1$; drugi ključi se ne spremenijo. Torej trditev drži tudi po $i + 1$ elementih, pri $i = n$ pa je to ravno trditev o štetju. Vsak korak poveča vsoto vrednosti za $1$, zato je na koncu $n$. $\square$

**Množica: samo različni.** Včasih število ni pomembno, zanima te le, *kaj vse* se pojavi. Takrat uporabiš množico. `set(skupine)` naredi množico `{"A", "0", "B", "AB"}`: ponovitve izginejo, zato je `len` enak $4$. Množica nima vrstnega reda in nima indeksov; Python jo lahko izpiše v kateremkoli zaporedju. Prazno množico ustvariš s `set()`, ker je `{}` prazen slovar. Element dodaš z `.add(x)`, z `x in m` pa preveriš, ali je v množici.

**Definicija.** *Množica* (tip `set`) je neurejena zbirka paroma različnih zgoščljivih elementov. Za množici $a$ in $b$ so operacije enake kot v matematiki:

- unija `a | b` $= a \cup b = \{x : x \in a \text{ ali } x \in b\}$,
- presek `a & b` $= a \cap b = \{x : x \in a \text{ in } x \in b\}$,
- razlika `a - b` $= a \setminus b = \{x : x \in a \text{ in } x \notin b\}$,
- simetrična razlika `a ^ b` $= (a \setminus b) \cup (b \setminus a)$, elementi natanko ene od množic,
- `a <= b` je `True` natanko tedaj, ko je $a \subseteq b$.

Slovar in množica sta **zgoščevalni tabeli**: iz elementa (ključa) Python izračuna število `hash(x)` in iz njega neposredno mesto v pomnilniku (več v razdelku Bolj natančno). Zato `x in mnozica` in `k in slovar` v povprečju trajata enako dolgo ne glede na velikost, `x in seznam` pa sorazmerno z dolžino seznama.

**Dve množici skupaj.** Vzemimo simptome dveh bolezni:

```python
gripa = {"vročina", "kašelj", "bolečine v mišicah", "utrujenost"}
prehlad = {"kašelj", "izcedek iz nosu", "kihanje", "utrujenost"}
```

Nariši dva kroga, ki se delno prekrivata. V prekrivanju sta kašelj in utrujenost, v levem delu le gripa (vročina, bolečine v mišicah), v desnem le prehlad (izcedek, kihanje).

| Operacija | Zapis | Pomen | Rezultat |
|---|---|---|---|
| unija | `gripa \| prehlad` | v vsaj eni | $6$ simptomov |
| presek | `gripa & prehlad` | v obeh | kašelj, utrujenost |
| razlika | `gripa - prehlad` | le v prvi | vročina, bolečine v mišicah |

**Unija** združi oba kroga, **presek** vzame le prekrivanje.

:::premisli
Gripa ima $4$ simptome, prehlad tudi $4$. Zakaj ima unija le $6$ elementov in ne $8$? Kako bi število elementov unije izračunal iz velikosti preseka?
---
Kašelj in utrujenost sta v obeh, množica pa vsak element hrani le enkrat. Velja $4 + 4 - 2 = 6$: velikost unije je vsota velikosti, zmanjšana za velikost preseka.
:::

**Izrek (načelo vključitev in izključitev).** Naj bosta $a$ in $b$ končni množici, $|a|$ pa število elementov množice $a$ (v Pythonu `len(a)`). Potem je $|a \cup b| = |a| + |b| - |a \cap b|$.

*Dokaz.* Unija razpade na tri disjunktne dele: $a \setminus b$, $a \cap b$ in $b \setminus a$. Ker je $a$ disjunktna unija $a \setminus b$ in $a \cap b$, je $|a| = |a \setminus b| + |a \cap b|$, enako $|b| = |b \setminus a| + |a \cap b|$. Seštejemo: $|a| + |b| = |a \setminus b| + |b \setminus a| + 2|a \cap b| = |a \cup b| + |a \cap b|$. $\square$

## Rešeni primeri

### Primer 1: telesne temperature

Na oddelku so izmerili temperature: `temp = {"Ana": 37.2, "Bor": 38.5, "Cene": 36.8}`. Zvečer sprejmejo Dano s $39{,}1\,^\circ\mathrm{C}$ in jo zapišejo z `temp["Dana"] = 39.1`. Koliko je `temp["Bor"]`, koliko je potem `len(temp)` in kdo ima vročino ($38\,^\circ\mathrm{C}$ ali več)?

**Podatki:** Ana $37{,}2\,^\circ\mathrm{C}$, Bor $38{,}5\,^\circ\mathrm{C}$, Cene $36{,}8\,^\circ\mathrm{C}$, nova Dana $39{,}1\,^\circ\mathrm{C}$; meja za vročino $38\,^\circ\mathrm{C}$
**Iščemo:** `temp["Bor"]`, `len(temp)` in imena bolnikov z vročino

:::formula
`slovar[ključ]` vrne vrednost; `slovar[nov_ključ] = vrednost` doda par; `for k in slovar:` da ključe
:::

**Rešitev:**

1. Ključ `"Bor"` obstaja, zato `temp["Bor"]` vrne `38.5`.
2. Ključa `"Dana"` še ni bilo, zato prirejanje doda nov par: slovar ima $3 + 1 = 4$ ključe.
3. Zanka `for k in temp:` z `if temp[k] >= 38:` preveri vsakega: Ana ne, Bor da, Cene ne, Dana da.
4. Odgovor: `temp["Bor"]` je `38.5`, `len(temp)` je $4$, vročino imata Bor in Dana.

### Primer 2: štetje krvnih skupin

Iz seznama `skupine = ["A", "0", "A", "B", "0", "A", "AB", "0", "A"]` naredi slovar pojavitev. Koliko je `stevec["A"]` in koliko `len(stevec)`?

**Podatki:** seznam $9$ krvnih skupin: A, 0, A, B, 0, A, AB, 0, A
**Iščemo:** `stevec["A"]` in število ključev `len(stevec)`

:::formula
Za vsak element `s`: `stevec[s] = stevec.get(s, 0) + 1`
:::

**Rešitev:**

1. Začnemo s praznim slovarjem `{}`, ker še nismo videli nobene skupine.
2. Sledimo zanki: A → `{"A": 1}`, 0 → `{"A": 1, "0": 1}`, A → `"A": 2`, B → nov ključ, 0 → `"0": 2`, A → `"A": 3`, AB → nov ključ, 0 → `"0": 3`, A → `"A": 4`.
3. Končni slovar: `{"A": 4, "0": 3, "B": 1, "AB": 1}`.
4. Preizkus: vsota vrednosti mora biti enaka dolžini seznama, $4 + 3 + 1 + 1 = 9$.
5. Odgovor: `stevec["A"]` je $4$, slovar ima $4$ ključe (toliko je različnih skupin).

### Primer 3 (težji): kateri bolezni ustreza bolnik

Bolnik navaja simptome `bolnik = {"kašelj", "kihanje", "izcedek iz nosu"}`. Množici `gripa` in `prehlad` sta iz razlage. Podobnost meri **Jaccardov indeks** $J(a, b) = |a \cap b| / |a \cup b|$ (za neprazno unijo). (a) Izračunaj $J$ bolnika z vsako boleznijo. (b) Koliko različnih simptomov skupaj pokrivata obe bolezni? (c) Bolniku se nato pojavi $k$ simptomov gripe, ki jih še nima. Pri katerem najmanjšem $k$ je njegov indeks z gripo vsaj $0{,}5$?

**Podatki:** `gripa` = {vročina, kašelj, bolečine v mišicah, utrujenost}; `prehlad` = {kašelj, izcedek iz nosu, kihanje, utrujenost}; `bolnik` = {kašelj, kihanje, izcedek iz nosu}; meja $J \ge 0{,}5$
**Iščemo:** $J$(gripa, bolnik), $J$(prehlad, bolnik), `len(gripa | prehlad)`, najmanjši $k$

:::formula
Skupni elementi: `a & b`; vsi elementi: `a | b`; $|a \cup b| = |a| + |b| - |a \cap b|$, kjer $|a|$ pomeni `len(a)`
:::

**Rešitev:**

1. Presek z gripo: `gripa & bolnik` je {kašelj}, velikost $1$. Unija po izreku: $4 + 3 - 1 = 6$. Torej $J = 1/6 \approx 0{,}17$.
2. Presek s prehladom: `prehlad & bolnik` je {kašelj, kihanje, izcedek iz nosu}, velikost $3$. Unija: $4 + 3 - 3 = 4$, torej $J = 3/4 = 0{,}75$. Bolnik se bolj ujema s prehladom.
3. Unija bolezni: $4 + 4 - 2 = 6$, ker sta kašelj in utrujenost v obeh.
4. (c) Simptomi gripe, ki jih bolnik nima, so `gripa - bolnik` = {vročina, bolečine v mišicah, utrujenost}, torej $0 \le k \le 3$. Vsak nov tak simptom poveča presek in bolnikovo množico za $1$: presek je $1 + k$, bolnik ima $3 + k$ simptomov.
5. Unija: $4 + (3 + k) - (1 + k) = 6$, neodvisno od $k$, ker novi simptomi že so v gripi.
6. Pogoj $(1 + k)/6 \ge 0{,}5$ da $1 + k \ge 3$, torej $k \ge 2$. Preverba: $k = 1$ da $2/6 \approx 0{,}33$, $k = 2$ da $3/6 = 0{,}5$.
7. Odgovor: $J$ z gripo je $1/6$, s prehladom $3/4$, zato se bolnik bolj ujema s prehladom; bolezni pokrivata $6$ simptomov; indeks z gripo doseže $0{,}5$ šele pri $k = 2$ novih simptomih gripe.

Pozor: tak izračun je le vaja s podatki, ne diagnoza.

### Primer 4: zdaj ti

Odsek DNK je zapisan kot niz `dnk = "GATTACAGA"`. Preštej, kolikokrat se pojavi vsak nukleotid.

**Podatki:** niz `"GATTACAGA"` z $9$ znaki (nukleotidi A, C, G, T)
**Iščemo:** slovar pojavitev in število različnih nukleotidov

:::formula
`for z in dnk:` in `stevec[z] = stevec.get(z, 0) + 1`; različni: `len(set(dnk))`
:::

**Rešitev:**

1. Zanka `for` po nizu da znak za znakom, tako kot po seznamu.
2. Za vsak znak povečamo njegov števec; prvič ga `.get` začne pri $0$.
3. Sledi zanki sam, nato preveri:

:::premisli
Kakšen je končni slovar in koliko je `len(set(dnk))`?
---
`{"G": 2, "A": 4, "T": 2, "C": 1}`; vsota $2 + 4 + 2 + 1 = 9$ se ujema z dolžino niza. Različni so $4$ nukleotidi, zato je `len(set(dnk))` enak $4$.
:::

## Pogoste napake

- **Slovar po mestu.** Slovar nima indeksov: `stevec[0]` išče ključ `0` in javi `KeyError`. Vrednost dobiš s ključem, ključe pa našteješ z `for k in stevec:`.
- **Povečevanje ključa, ki ga še ni.** `stevec[s] += 1` mora najprej prebrati staro vrednost, ki je pri prvi pojavitvi ni: `KeyError`. Uporabi `if s in stevec: … else: stevec[s] = 1` ali `.get(s, 0) + 1`.
- **Vedno `= 1`.** `stevec[s] = 1` v zanki vsakič prepiše vrednost, zato so na koncu vse vrednosti $1$.
- **Unija in presek zamenjana.** Znak `&` beremo »in«, zato se zdi, da `gripa & prehlad` pomeni »gripa in prehlad skupaj«. V resnici `&` pomeni »v obeh hkrati«, vse skupaj pa da `|`. Presek je prekrivanje krogov, unija vse, kar je pokrito.
- **`{}` kot prazna množica.** `{}` ustvari prazen slovar, zato `.add` javi napako. Prazna množica je `set()`.

## Povzetek

- Slovar hrani pare `ključ: vrednost`; ključi so edinstveni, vrednost dobiš s `slovar[ključ]`, nov par dodaš ali staro vrednost prepišeš s `slovar[ključ] = vrednost`.
- Neobstoječ ključ da `KeyError`; preveri z `ključ in slovar` ali beri s `slovar.get(ključ, privzeto)`.
- `len(slovar)` je število ključev; `for k in slovar:` gre po ključih.
- Štetje pojavitev: prazen slovar, nato za vsak element `stevec[x] = stevec.get(x, 0) + 1`; vsota vrednosti je dolžina seznama.
- Množica hrani vsak element enkrat, brez vrstnega reda; `set(seznam)` odstrani ponovitve, prazna množica je `set()`.
- Unija `a | b` (v vsaj eni), presek `a & b` (v obeh), razlika `a - b` (le v prvi); $|a \cup b| = |a| + |b| - |a \cap b|$.

## Za izpit

Znati moraš povedati:

- definicijo slovarja (ključi paroma različni in zgoščljivi) ter natančen pomen `d[k]`, `d[k] = v`, `k in d` in `d.get(k, p)`;
- definicijo množice in operacij `|`, `&`, `-`, `^`, `<=` z množičnim zapisom;
- načelo vključitev in izključitev za dve končni množici in njegov dokaz;
- trditev o pravilnosti štetja pojavitev z dokazom z indukcijo in posledico, da je vsota vrednosti dolžina seznama;
- zakaj seznam ne more biti ključ in zakaj je `x in mnozica` hitrejše od `x in seznam`.

### Naloga 1

Laboratorij beleži, kateri ioni so bili zaznani v katerem vzorcu:

```python
meritve = [("V1", "Na"), ("V2", "Cl"), ("V1", "K"), ("V3", "Na"),
           ("V2", "Na"), ("V1", "Na"), ("V3", "Ca")]
ioni = {}
for v, ion in meritve:
    if v not in ioni:
        ioni[v] = set()
    ioni[v].add(ion)
stevilo = {}
for v in ioni:
    for ion in ioni[v]:
        stevilo[ion] = stevilo.get(ion, 0) + 1
```

(a) Zapiši `ioni` in `stevilo` po izvedbi. (b) Izračunaj `ioni["V1"] & ioni["V2"]`, `ioni["V1"] ^ ioni["V3"]` in `len(ioni["V1"] | ioni["V2"])`, zadnjo tudi z načelom vključitev in izključitev. (c) Koliko je vsota vrednosti v `stevilo` in zakaj ni enaka `len(meritve)`?

**Rešitev:**

1. Prva zanka: vsak vzorec ob prvi pojavitvi dobi prazno množico, nato se doda ion. Par `("V1", "Na")` se pojavi dvakrat, a množica ga hrani enkrat. Dobimo `ioni = {"V1": {"Na", "K"}, "V2": {"Cl", "Na"}, "V3": {"Na", "Ca"}}`.
2. Druga zanka šteje, v koliko vzorcih je ion: Na je v vseh treh, K, Cl in Ca vsak v enem. `stevilo = {"Na": 3, "K": 1, "Cl": 1, "Ca": 1}` (vrstni red ključev je lahko drugačen).
3. Presek `ioni["V1"] & ioni["V2"]` je `{"Na"}`.
4. Simetrična razlika: v V1 in ne v V3 je K, v V3 in ne v V1 je Ca, torej `{"K", "Ca"}`.
5. Unija V1 in V2 je {Na, K, Cl}, velikost $3$. Po izreku: $2 + 2 - 1 = 3$, ujema se.
6. (c) Vsota vrednosti je $3 + 1 + 1 + 1 = 6$, kar je vsota velikosti množic $2 + 2 + 2 = 6$. Meritev je $7$, vsota pa le $6$, ker se `("V1", "Na")` ponovi, množica pa ponovitev ne hrani.
7. Odgovor: `ioni` in `stevilo` kot zgoraj; presek {Na}, simetrična razlika {K, Ca}, unija ima $3$ elemente; vsota vrednosti je $6$, ne $7$, zaradi podvojene meritve.

### Naloga 2

Natančno navedi načelo vključitev in izključitev za dve končni množici in ga dokaži. Nato izpelji formulo za $|a \cup b \cup c|$ in jo preveri na množicah `ioni["V1"]`, `ioni["V2"]`, `ioni["V3"]` iz naloge 1.

**Rešitev:**

1. Izrek: za končni množici $a$, $b$ je $|a \cup b| = |a| + |b| - |a \cap b|$.
2. Dokaz: $a \cup b$ je disjunktna unija $a \setminus b$, $a \cap b$ in $b \setminus a$. Iz $|a| = |a \setminus b| + |a \cap b|$ in $|b| = |b \setminus a| + |a \cap b|$ sledi $|a| + |b| = |a \cup b| + |a \cap b|$. $\square$
3. Za tri množice uporabimo izrek na $a \cup b$ in $c$: $|a \cup b \cup c| = |a \cup b| + |c| - |(a \cup b) \cap c|$.
4. Po distributivnosti je $(a \cup b) \cap c = (a \cap c) \cup (b \cap c)$, presek teh dveh pa je $a \cap b \cap c$. Izrek da $|(a \cup b) \cap c| = |a \cap c| + |b \cap c| - |a \cap b \cap c|$.
5. Vstavimo še $|a \cup b| = |a| + |b| - |a \cap b|$: $|a \cup b \cup c| = |a| + |b| + |c| - |a \cap b| - |a \cap c| - |b \cap c| + |a \cap b \cap c|$.
6. Preverba: vse tri množice imajo po $2$ elementa, vsi preseki parov in trojni presek so {Na}. Formula da $2 + 2 + 2 - 1 - 1 - 1 + 1 = 4$, neposredno pa je unija {Na, K, Cl, Ca}, prav tako $4$ elementi.
7. Odgovor: $|a \cup b \cup c|$ je vsota velikosti, zmanjšana za preseke parov in povečana za trojni presek; za vzorce dobimo $4$ različne ione.

## Drugače: Z analogijo

**Slovar je kartoteka v ambulanti.** Mapa ima nalepko z imenom (ključ), v njej je izvid (vrednost). Sestra ne vpraša za »tretjo mapo«, ampak za »mapo Ane Novak«. Če mape ni, je ne more izročiti: to je `KeyError`.

**Množica je seznam alergij na kartonu.** Penicilin piše enkrat, ne glede na to, kolikokrat ga je bolnik omenil. Kdor predpisuje zdravilo dvema bolnikoma, se izogne uniji njunih alergenov.

## Drugače: Uporaba v stroki

V kemijskem ali kliničnem laboratoriju je slovar naravna oblika podatkov: `{oznaka_vzorca: koncentracija}` ali `{ion: molska_masa}`, kjer vrednost poiščeš po oznaki, ne po vrstici. Množice primerjajo nabore: `zaznani - dovoljeni` takoj pokaže nepričakovane snovi v vzorcu, presek spojin dveh šarž pa skupne nečistoče. Štetje z `.get(k, 0) + 1` je osnova histogramov, na primer kolikokrat se pojavi vsak kodon v zaporedju DNK.

## Drugače: Bolj natančno

Slovar in množica sta zgrajena kot **zgoščevalna tabela** (angl. hash table). Iz ključa Python izračuna število, zgoščeno vrednost (`hash(k)`), in iz nje neposredno mesto v pomnilniku. Zato `x in mnozica` in `slovar[k]` v povprečju trajata enako dolgo ne glede na velikost zbirke. Pri seznamu mora `x in seznam` pregledati elemente enega za drugim, zato pri $n$ elementih traja sorazmerno z $n$.

Iz tega sledi pogoj za ključe: zgoščena vrednost se ne sme spremeniti, zato `{[1, 2]: "x"}` javi `TypeError: unhashable type: 'list'`.

Od Pythona 3.7 slovar ohranja vrstni red vstavljanja ključev, zato jih zanka vrne v tem redu. Množica takega jamstva nima.

Operacije nad množicami imajo tudi metode: `a.union(b)`, `a.intersection(b)`, `a.difference(b)`, `a.symmetric_difference(b)`.

## Preveri se

? V programu je `tlak = {"Ana": 120, "Bor": 135}`. Kaj je v tem slovarju `"Ana"`?
- Vrednost, ki jo slovar hrani.
~ Vrednost je desno od dvopičja ($120$). `"Ana"` je oznaka, po kateri jo poiščeš.
+ Ključ, s katerim dobiš vrednost: `tlak["Ana"]` je $120$.
- Indeks prvega elementa.
~ Slovar nima indeksov po mestu. `tlak[0]` bi javil `KeyError`.
> Levo od dvopičja je ključ, desno vrednost. Do vrednosti prideš s ključem.

? Izvedeš `stevec = {}` in nato `stevec["A"] += 1`. Kaj se zgodi?
- `stevec` postane `{"A": 1}`.
~ Tako bi bilo, če bi Python začel pri $0$. Za `+=` mora najprej prebrati staro vrednost, ki je ni.
+ Python javi `KeyError`, ker ključa `"A"` še ni.
- `stevec` ostane prazen, napake ni.
~ Python neuspele operacije ne preskoči tiho: ustavi se z napako.
> Prvo pojavitev zapiši s `stevec["A"] = 1` ali uporabi `stevec.get("A", 0) + 1`.

? `s = ["kašelj", "vročina", "kašelj", "kašelj", "glavobol", "vročina", "kašelj"]` in `stevec` je slovar pojavitev iz `s`. Kaj izpiše `print(len(s), len(set(s)), stevec["kašelj"])`?
- `7 7 4`
~ `set` odstrani ponovitve: različni simptomi so le kašelj, vročina in glavobol, torej $3$.
+ `7 3 4`
- `3 3 4`
~ `len(s)` šteje vse elemente seznama, tudi ponovitve, teh je $7$. Različne šteje šele `len(set(s))`.
> Seznam ima $7$ elementov, različni simptomi so $3$, kašelj se pojavi $4$-krat.

? Po pravilni zanki za štetje seznama `["A", "0", "A", "AB", "0", "A"]` koliko je `stevec["0"]`?
- $6$
~ To je dolžina celega seznama, ne število pojavitev skupine 0.
- $3$
~ $3$ je število različnih skupin (`len(stevec)`) ali število pojavitev A, ne skupine 0.
+ $2$
- $1$
~ To dobiš, če v zanki vedno pišeš `stevec[s] = 1` in vrednost prepišeš namesto povečaš.
> Skupina 0 se pojavi na drugem in petem mestu, zato je `stevec["0"]` enak $2$.

? Bolnik 1 je alergičen na `{"penicilin", "aspirin", "lateks"}`, bolnik 2 na `{"aspirin", "oreščki"}`. Koliko je `len(b1 | b2)`?
- $5$
~ Aspirin je v obeh, unija pa vsak element hrani le enkrat: $3 + 2 - 1$.
- $1$
~ $1$ je velikost preseka (`b1 & b2`, le aspirin), ne unije.
+ $4$
> Unija je {penicilin, aspirin, lateks, oreščki}: $3 + 2 - 1 = 4$.

:::simboli
a | prva množica (Pythonov set) | | | število elementov $\lvert a \rvert$ je len(a)
b | druga množica (Pythonov set) | | |
:::
