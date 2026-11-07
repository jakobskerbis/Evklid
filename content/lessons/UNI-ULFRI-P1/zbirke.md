---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Laborantka mora pred naročilom preveriti, ali steklenica s klorovodikovo kislino že stoji v kateri od omar s tri tisoč reagenti. Spletna trgovina mora ob registraciji preveriti, ali je uporabniško ime že zasedeno med milijonom imen. Naloga je ista: **ali je element v zbirki**, brez ponovitev in čim hitreje. Če obe rešimo s tabelo in zanko, gre program čez vse elemente. Javine **zbirke** (*collections*) ponujajo strukture, ki tako vprašanje rešijo v trenutku, poleg tega pa sezname, ki rastejo, in slovarje, ki povežejo ključ z vrednostjo.

## Razlaga

### Najprej en primer: dnevnik tehtanja

V laboratoriju vsak, ki odtehta snov, vpiše njeno ime v dnevnik. Zanima nas, koliko različnih snovi so uporabili in kolikokrat vsako.

```java
List<String> dnevnik = List.of(
  "NaCl", "glukoza", "NaCl",
  "CuSO4", "glukoza", "NaCl",
  "KMnO4");

Set<String> snovi =
  new HashSet<>(dnevnik);
System.out.println(snovi.size());
// 4

Map<String, Integer> st =
  new TreeMap<>();
for (String s : dnevnik) {
  st.merge(s, 1, Integer::sum);
}
System.out.println(st);
// {CuSO4=1, KMnO4=1,
//  NaCl=3, glukoza=2}
```

V tem kratkem programu smo uporabili tri vrste zbirk:

- **seznam** `List` hrani vnose po vrsti, s ponovitvami;
- **množica** `Set` vsako snov hrani le enkrat, zato je njena velikost število različnih snovi;
- **slovar** `Map` vsaki snovi (ključu) priredi število (vrednost). Klic `merge(s, 1, Integer::sum)` vstavi $1$, če ključa še ni, sicer staro vrednost poveča za $1$. Zapis `Integer::sum` je sklic na metodo, ki sešteje dve števili (staro vrednost in $1$).

`TreeMap` je izpisal ključe urejeno. Velike črke so v Javi pred malimi, zato je `glukoza` zadnja.

Zbirke so v paketu `java.util` (`import java.util.*;`) in hranijo le objekte: namesto `int` pišemo `Integer`, Java pa pretvarja sama.

### Ogrodje zbirk

Zdaj primer posplošimo. Zbirke so zgrajene iz **vmesnikov** (kaj zbirka zna) in **izvedb** (kako to dela). Spremenljivko napovemo z vmesnikom, objekt ustvarimo z izvedbo: `List<String> s = new ArrayList<>();`. Tako lahko izvedbo pozneje zamenjamo, ne da bi spreminjali ostalo kodo.

```
       Iterable
          |
      Collection
       /      \
    List      Set        Map
     |       /   \      /   \
ArrayList Hash- Tree- Hash- Tree-
LinkedList Set  Set   Map   Map
```

Vmesnik `Map` ne deduje od `Collection`, ker ne hrani posameznih elementov, ampak pare.

**Definicija.** **Seznam** (`List`) je urejeno zaporedje elementov z indeksi od $0$ naprej; ponovitve so dovoljene. **Množica** (`Set`) je zbirka brez ponovitev: dva elementa sta enaka, če ju `equals` razglasi za enaka. **Slovar** (`Map<K, V>`) je zbirka parov ključ → vrednost z enoličnimi ključi.

### Seznami

`ArrayList` hrani elemente v notranji tabeli, ki se po potrebi poveča. Dostop `get(i)` je takojšen, vstavljanje ali brisanje na začetku pa zamakne vse naslednje elemente. `LinkedList` hrani elemente v verigi vozlov: vstavljanje na znanem mestu je hitro, `get(i)` pa mora prehoditi $i$ vozlov. V praksi je skoraj vedno boljši `ArrayList`.

Pozor pri `List<Integer>`: `remove(1)` odstrani element na **indeksu** $1$, `remove(Integer.valueOf(1))` pa prvi element z **vrednostjo** $1$.

### Množice

- `HashSet`: brez vrstnega reda, `contains` takoj;
- `LinkedHashSet`: vrstni red vstavljanja, `contains` takoj;
- `TreeSet`: urejen, `contains` v okoli $\log_2 n$ korakih.

`add` vrne `true`, če je element nov, in `false`, če je že bil v množici. Množične operacije spremenijo množico, na kateri jih kličemo:

- `a.addAll(b)` – unija;
- `a.retainAll(b)` – presek;
- `a.removeAll(b)` – razlika $a \setminus b$.

`TreeSet` elemente ureja po **naravni urejenosti** (razred implementira `Comparable` z metodo `compareTo`, kot `String` in `Integer`) ali po **primerjalniku** (`Comparator`), ki ga podamo konstruktorju.

### Slovarji

Glavne metode `Map<K, V>`:

- `put(k, v)` vstavi par ali **prepiše** staro vrednost;
- `get(k)` vrne vrednost ali `null`, če ključa ni;
- `getOrDefault(k, d)` vrne `d`, če ključa ni;
- `containsKey(k)`, `remove(k)`, `size()`;
- `keySet()`, `values()` in `entrySet()` vrnejo poglede na ključe, vrednosti in pare.

`HashMap` ne zagotavlja vrstnega reda, `TreeMap` ključe ureja.

:::premisli
V slovar `Map<String, Integer> m` vstavimo `m.put("NaCl", 3)` in nato `m.put("NaCl", 5)`. Koliko parov ima slovar in kaj vrne `m.get("NaCl")`? Kaj bi vrnil `m.get("KCl")`?
---
En par: ključ je enoličen, drugi `put` staro vrednost prepiše, zato `get` vrne $5$. Za `"KCl"` vrne `null`; če bi to shranili v `int`, bi program vrgel `NullPointerException`.
:::

### Iteratorji

Vsaka `Collection` je `Iterable`: zna vrniti **iterator**, objekt, ki zbirko prehodi element za elementom.

```java
Iterator<String> it = s.iterator();
while (it.hasNext()) {
  String x = it.next();
  if (x.startsWith("K")) {
    it.remove();
  }
}
```

`hasNext()` pove, ali je še kak element, `next()` ga vrne in se premakne naprej, `remove()` odstrani zadnjega vrnjenega. Zanka `for (String x : s)` je le krajši zapis iste zanke z iteratorjem.

**Pravilo.** Med prehodom zbirke z iteratorjem (tudi s `for`-each) je ne smemo spreminjati z njenimi lastnimi metodami (`s.remove`, `s.add`). Iterator to zazna in vrže `ConcurrentModificationException`. Brisati smemo le z `it.remove()` ali z metodo `s.removeIf(…)`.

Slovar prehodimo prek `entrySet()`:

```java
for (Map.Entry<String, Integer> e
       : st.entrySet()) {
  System.out.println(
    e.getKey() + ": " + e.getValue());
}
```

### Enakost lastnih objektov

`HashSet` in `HashMap` element najprej s `hashCode()` preslikata v predal, nato v predalu primerjata z `equals`. Zato velja **pogodba**: če je `a.equals(b)`, mora biti `a.hashCode() == b.hashCode()`. Razred, ki prepiše `equals`, mora prepisati tudi `hashCode`, sicer dva enaka objekta navadno končata v različnih predalih in množica hrani oba.

:::premisli
`TreeSet` ne uporablja `hashCode`. Kako potem ugotovi, da je element že v množici?
---
S primerjavo: `compareTo` (ali primerjalnik) vrne $0$ za enaka elementa. Zato mora biti urejenost usklajena z `equals`, sicer `TreeSet` in `HashSet` z istimi podatki dasta različne množice.
:::

## Rešeni primeri

### Primer 1 (lažji)

Na polici A so `NaCl`, `KCl`, `CuSO4`, `HCl`, `NaOH`, na polici B pa `NaOH`, `HCl`, `H2SO4`, `KCl`, `etanol`, `aceton`. Katere snovi so na obeh policah, koliko je različnih snovi skupaj in katere so le na polici A?

**Podatki:** `a` = {NaCl, KCl, CuSO4, HCl, NaOH}, `b` = {NaOH, HCl, H2SO4, KCl, etanol, aceton}
**Iščemo:** presek, velikost unije, razliko $a \setminus b$

:::formula
presek `retainAll`, unija `addAll`, razlika `removeAll`; vsaka spremeni množico, na kateri jo kličemo
:::

**Rešitev:**

1. Operacije spremenijo množico, zato za vsako naredimo kopijo:

```java
Set<String> p = new TreeSet<>(a);
p.retainAll(b);
Set<String> u = new HashSet<>(a);
u.addAll(b);
Set<String> r = new TreeSet<>(a);
r.removeAll(b);
```

2. Presek: `[HCl, KCl, NaOH]` ($3$ snovi, urejeno, ker je `TreeSet`).
3. Unija: $5 + 6 - 3 = 8$ snovi; `u.size()` je $8$.
4. Razlika: `[CuSO4, NaCl]`.
5. Odgovor: na obeh policah so HCl, KCl in NaOH; skupaj je $8$ različnih snovi; le na polici A sta CuSO4 in NaCl.

### Primer 2

Zalogo v gramih vodimo v slovarju. Kaj izpiše program in koliko parov ima slovar na koncu?

```java
Map<String, Double> zaloga =
  new TreeMap<>();
zaloga.put("NaCl", 500.0);
zaloga.put("CuSO4", 250.0);
zaloga.merge("NaCl", -120.0,
  Double::sum);
zaloga.merge("KCl", 100.0,
  Double::sum);
zaloga.put("CuSO4", 200.0);
double g =
  zaloga.getOrDefault("HCl", 0.0);
System.out.println(zaloga + " " + g);
```

**Podatki:** zaporedje klicev v programu, `TreeMap`
**Iščemo:** izpis in število parov

:::formula
`put` prepiše; `merge(k, v, Double::sum)` vstavi `v` ali prišteje; `getOrDefault` ne vstavlja
:::

**Rešitev:**

1. Po prvih dveh `put`: NaCl → $500{,}0$, CuSO4 → $250{,}0$.
2. `merge` za NaCl: ključ obstaja, $500 - 120 = 380$.
3. `merge` za KCl: ključa ni, vstavi $100{,}0$.
4. `put` za CuSO4 staro vrednost prepiše z $200{,}0$.
5. `getOrDefault` za HCl vrne $0{,}0$ in slovarja ne spremeni.
6. Odgovor: izpis je `{CuSO4=200.0, KCl=100.0,` `NaCl=380.0} 0.0`; slovar ima $3$ pare.

### Primer 3 (težji)

Razred `Reagent` ima polja `ime`, `omara` in `rok` (leto izteka). Študent je napisal metodo, ki iz seznama odstrani reagente z rokom pred letom `leto`:

```java
static void odstrani(
    List<Reagent> s, int leto) {
  for (Reagent r : s) {
    if (r.rok < leto) s.remove(r);
  }
}
```

Seznam vsebuje (ime, omara, rok): (NaCl, A, $2027$), (HCl, B, $2025$), (aceton, B, $2026$), (CuSO4, A, $2024$), (etanol, C, $2028$), (KCl, A, $2030$). a) Kaj se zgodi pri klicu z `leto = 2026`? b) Popravi metodo. c) Napiši metodo, ki vrne število preostalih reagentov po omarah, urejeno po oznaki omare, in jo izvedi na popravljenem seznamu. d) Kolikšna je časovna zahtevnost popravljene metode za `ArrayList` z $n$ elementi?

**Podatki:** metoda `odstrani`, seznam šestih reagentov, `leto = 2026`
**Iščemo:** obnašanje, popravek, slovar omara → število, zahtevnost

:::formula
brisanje med prehodom samo z `Iterator.remove()`; štetje z `merge(k, 1, Integer::sum)` v `TreeMap`
:::

**Rešitev:**

1. a) Zanka `for` uporablja iterator. HCl ima rok $2025 < 2026$, zato ga `s.remove(r)` odstrani mimo iteratorja. Ob naslednjem `next()` iterator zazna spremembo in vrže `ConcurrentModificationException`.
2. b) Brišemo z iteratorjem:

```java
static void odstrani(
    List<Reagent> s, int leto) {
  Iterator<Reagent> it = s.iterator();
  while (it.hasNext()) {
    if (it.next().rok < leto) {
      it.remove();
    }
  }
}
```

3. Odstranjena sta HCl ($2025$) in CuSO4 ($2024$); aceton z rokom $2026$ ostane, ker $2026 < 2026$ ne velja. Ostanejo NaCl, aceton, etanol, KCl.
4. c) Štetje po omarah:

```java
static Map<String, Integer> poOmarah(
    List<Reagent> s) {
  Map<String, Integer> m =
    new TreeMap<>();
  for (Reagent r : s) {
    m.merge(r.omara, 1, Integer::sum);
  }
  return m;
}
```

5. Rezultat: `{A=2, B=1, C=1}` (NaCl in KCl v A, aceton v B, etanol v C).
6. d) Pri `ArrayList` vsak `it.remove()` zamakne preostale elemente, kar je do $n$ korakov. Če odstranimo veliko elementov, je skupaj do okoli $n^2$ korakov. `s.removeIf(r -> r.rok < leto)` naredi isto v enem prehodu, okoli $n$ korakov; zapis `r -> r.rok < leto` (lambda) je pogoj, ki za vsak `r` vrne `true` ali `false`.
7. Odgovor: izvirna metoda vrže `ConcurrentModificationException`; popravljena odstrani HCl in CuSO4; po omarah je `{A=2, B=1, C=1}`; zahtevnost je v najslabšem primeru kvadratna, z `removeIf` linearna.

### Primer 4 – zdaj ti

Razred `Spojina` ima polje `cas` (številka CAS) in prepiše `equals` tako, da sta spojini enaki, če imata enak `cas`. Metode `hashCode` ne prepiše. V `HashSet<Spojina>` dodamo `new Spojina("7647-14-5")` dvakrat. Koliko elementov ima množica? Kaj se spremeni, če dodamo `hashCode`, ki vrne `cas.hashCode()`?

**Podatki:** `equals` po polju `cas`, brez `hashCode`; dva objekta z enako številko CAS
**Iščemo:** velikost množice brez in s `hashCode`

:::formula
pogodba: `a.equals(b)` ⇒ `a.hashCode() == b.hashCode()`
:::

**Rešitev:**

1. Privzeti `hashCode` iz `Object` je odvisen od identitete objekta, zato imata dva ločena objekta navadno različni vrednosti.
2. `HashSet` ju zato pošlje v različna predala in ju z `equals` sploh ne primerja.
3. Dokončaj sam: kolikšna je velikost v obeh primerih?

:::premisli
Kolikšna je velikost množice?
---
Brez `hashCode` je navadno $2$: množica hrani dva »enaka« objekta, kar krši njen pomen. Z `hashCode` po polju `cas` gresta oba v isti predal, `equals` vrne `true` in drugi `add` vrne `false`: velikost je $1$.
:::

## Pogoste napake

- **Brisanje v zanki `for`-each.** `s.remove(x)` med prehodom vrže `ConcurrentModificationException`. Briši z `it.remove()` ali `removeIf`.
- **`get` na manjkajočem ključu da $0$.** Vrne `null`; v `int` to vrže `NullPointerException`. Uporabi `getOrDefault(k, 0)` ali `merge`.
- **`remove(1)` na `List<Integer>` odstrani vrednost $1$.** Odstrani element na indeksu $1$; za vrednost piši `remove(Integer.valueOf(1))`.
- **`equals` brez `hashCode`.** `HashSet` in `HashMap` potem ne najdeta enakih objektov. Prepiši obe metodi skupaj.
- **Pričakovan vrstni red v `HashSet` ali `HashMap`.** Vrstni red ni zagotovljen; za urejenost uporabi `TreeSet`/`TreeMap`, za vrstni red vstavljanja `LinkedHashSet`/`LinkedHashMap`.

## Povzetek

- Zbirke v `java.util`: vmesniki `List`, `Set`, `Map`; spremenljivko napovemo z vmesnikom, objekt z izvedbo.
- `List`: urejen, s ponovitvami; `ArrayList` hiter `get(i)`, počasno vstavljanje na začetek.
- `Set`: brez ponovitev; `HashSet` hiter `contains`, `TreeSet` urejen; unija `addAll`, presek `retainAll`, razlika `removeAll`.
- `Map`: ključ → vrednost, ključi enolični; `put` prepiše, `get` vrne `null`; `getOrDefault`, `merge`, `entrySet`.
- Iterator: `hasNext`, `next`, `remove`; med prehodom spreminjaj le prek iteratorja.
- Lastni razred v `HashSet`/`HashMap`: usklajena `equals` in `hashCode`; v `TreeSet`/`TreeMap`: `Comparable` ali `Comparator`.

## Za izpit

Znati moraš povedati:

- razliko med seznamom, množico in slovarjem ter vlogo vmesnikov in izvedb;
- lastnosti `ArrayList`/`LinkedList`, `HashSet`/`TreeSet` in `HashMap`/`TreeMap` (vrstni red, hitrost);
- delovanje iteratorja in vzrok za `ConcurrentModificationException`;
- pogodbo `equals`–`hashCode` in posledice njene kršitve;
- vlogo `Comparable` in `Comparator` pri urejenih zbirkah.

### Naloga 1

Napiši metodo `Map<String, Set<String>> poElementih(List<String> formule)`, ki za vsak kemijski element vrne urejeno množico formul, v katerih nastopa. Simbol elementa je velika črka, ki ji sledi nič ali več malih črk; števke preskoči. Elementi naj bodo urejeni. Nato za vhod `H2O`, `NaCl`, `NaOH`, `HCl`, `CuSO4` zapiši rezultat in izpiši elemente, ki nastopajo v vsaj dveh formulah.

**Rešitev:**

1. Za urejenost ključev in formul uporabimo `TreeMap` in `TreeSet`.
2. Vsako formulo beremo z indeksom `i`. Ko najdemo veliko črko, z `j` poiščemo konec simbola.

```java
static Map<String, Set<String>>
    poElementih(List<String> formule) {
  Map<String, Set<String>> m =
    new TreeMap<>();
  for (String f : formule) {
    int i = 0;
    while (i < f.length()) {
      char c = f.charAt(i);
      if (Character.isUpperCase(c)) {
        int j = i + 1;
        while (j < f.length() &&
            Character.isLowerCase(
              f.charAt(j))) {
          j++;
        }
        String el = f.substring(i, j);
        if (!m.containsKey(el)) {
          m.put(el, new TreeSet<>());
        }
        m.get(el).add(f);
        i = j;
      } else {
        i++;
      }
    }
  }
  return m;
}
```

3. `NaCl` da simbola `Na` in `Cl`; `CuSO4` da `Cu`, `S`, `O`; števki v `H2O` in `CuSO4` preskočimo. Formula, v kateri se element pojavi dvakrat (npr. `CH3COOH`), je v njegovi množici le enkrat.
4. Rezultat (ključ → množica): Cl → `[HCl, NaCl]`; Cu → `[CuSO4]`; H → `[H2O, HCl, NaOH]`; Na → `[NaCl, NaOH]`; O → `[CuSO4, H2O, NaOH]`; S → `[CuSO4]`. V nizih je števka pred velikimi črkami, zato je `H2O` pred `HCl`.
5. Izpis elementov v vsaj dveh formulah:

```java
for (Map.Entry<String, Set<String>> e
       : m.entrySet()) {
  if (e.getValue().size() >= 2) {
    System.out.print(e.getKey() + " ");
  }
}
```

6. Odgovor: izpiše `Cl H Na O`.

### Naloga 2

Natančno navedi pogodbo med `equals` in `hashCode`. Utemelji, zakaj `HashSet` ne deluje pravilno, če razred prepiše le `equals`, in zakaj obratna smer pogodbe ne velja (različna objekta smeta imeti enak `hashCode`). Pojasni, zakaj iterator vrže `ConcurrentModificationException`, in navedi dva pravilna načina brisanja med prehodom.

**Rešitev:**

1. Pogodba: če je `a.equals(b)`, mora biti `a.hashCode() == b.hashCode()`; `hashCode` mora za nespremenjen objekt vedno vrniti isto vrednost.
2. `HashSet.add(x)` izračuna `x.hashCode()` in izbere predal; le v tem predalu primerja z `equals`. Če ima enak objekt drugačno zgoščeno vrednost, je v drugem predalu, primerjave ni, zato množica sprejme duplikat in `contains` ga ne najde.
3. Obratna smer: zgoščenih vrednosti `int` je končno mnogo, objektov (npr. nizov) neomejeno, zato morajo biti trki. Trk le podaljša iskanje v predalu, pravilnosti ne pokvari, ker odloči `equals`.
4. Iterator si ob nastanku zapomni števec sprememb zbirke. Ob vsakem `next()` ga primerja s trenutnim; če se je zbirka spremenila mimo iteratorja, bi bil njegov položaj lahko napačen (preskočen ali podvojen element), zato raje vrže izjemo.
5. Pravilno brisanje: `it.remove()`, ki popravi tudi iterator, ali `s.removeIf(pogoj)`.
6. Odgovor: enaki objekti morajo imeti enako zgoščeno vrednost, različni smejo imeti enako; brez `hashCode` zgoščene zbirke ne najdejo enakih elementov; spreminjati smemo le prek iteratorja ali z `removeIf`.

## Drugače: Z analogijo

Laboratorij ima tri načine shranjevanja:

- **Seznam** je stojalo z oštevilčenimi epruvetami. Do epruvete $5$ sežeš takoj; če vstaviš novo na mesto $0$, moraš vse druge premakniti za eno mesto.
- **Množica** je kontrolni seznam »katere snovi imamo«. Vsaka je na njem enkrat; če jo dopišeš drugič, se nič ne spremeni.
- **Slovar** je register po številki CAS: iz številke takoj najdeš omaro in količino. Ista številka ne more imeti dveh vrstic.

**Iterator** je laborant s kazalcem, ki gre po stojalu od leve proti desni. Če mu medtem kdo drug izmakne epruveto, se kazalec zmede; zato sme epruveto vzeti le on sam (`it.remove()`).

**`hashCode`** je oznaka omare, `equals` pa natančna primerjava steklenic v njej. Če dve enaki steklenici dobita različni oznaki omar, ju nihče nikoli ne primerja.

## Drugače: Uporaba v stroki

**Laboratorijski informacijski sistemi** (LIMS) hranijo vzorce v slovarjih po identifikatorju vzorca in množice dovoljenih analiz; podvojen vnos zavrnejo z `add`, ki vrne `false`.

**Obdelava podatkov.** Odstranjevanje podvojenih zapisov, štetje pojavitev in združevanje po ključu (»koliko meritev na napravo«) so vsakdanji vzorci `Set` in `Map`.

**Predpomnilnik.** Strežniki rezultate dragih izračunov hranijo v slovarju; `LinkedHashMap` z vrstnim redom dostopa omogoča, da najstarejše vnose zavržejo.

## Drugače: Bolj natančno

**Zgoščena tabela.** `HashMap` hrani tabelo predalov. Ko je zasedenost večja od $0{,}75$ (privzeti faktor polnjenja), tabelo podvoji in elemente prerazporedi. Povprečno sta `get` in `put` zato takojšnja ne glede na velikost. Predal z veliko trki Java od različice 8 naprej pretvori v uravnoteženo drevo.

**Rdeče-črno drevo.** `TreeMap` in `TreeSet` sta uravnoteženi iskalni drevesi: višina je reda $\log_2 n$, zato iskanje, vstavljanje in brisanje potrebujejo okoli $\log_2 n$ primerjav. Pri milijonu elementov je to okoli $20$ primerjav.

**Hitro odpovedujoči iteratorji.** Preverjanje sprememb je »po najboljših močeh«: Java ne zagotavlja, da bo izjema vržena vedno (npr. ob brisanju predzadnjega elementa zanka lahko tiho konča). Na izjemo se zato ne smemo zanašati v logiki programa.

## Preveri se

? V `Set<String> s` že je `"HCl"`. Kaj vrne `s.add("HCl")`?
- `true`, ker je dodajanje uspelo.
~ Množica elementa ne doda drugič; `add` vrne `true` le za nov element.
+ `false`, in množica se ne spremeni.
- Vrže izjemo, ker elementa ne smemo dodati dvakrat.
~ Ponovni `add` je dovoljen; le vrne `false`. Izjemo vrže `Set.of` z dvema enakima elementoma.
> Množica hrani vsak element največ enkrat; `add` sporoči, ali se je množica spremenila.

? Zbirka ima milijon nizov. Uredi `contains` od najhitrejšega do najpočasnejšega: `ArrayList`, `HashSet`, `TreeSet`.
- `TreeSet`, `HashSet`, `ArrayList`
~ `TreeSet` potrebuje okoli $20$ primerjav, `HashSet` povprečno eno.
+ `HashSet`, `TreeSet`, `ArrayList`
- `ArrayList`, `HashSet`, `TreeSet`
~ `ArrayList.contains` mora v najslabšem primeru pregledati vseh milijon elementov.
> `HashSet` takoj, `TreeSet` okoli $\log_2 10^6 \approx 20$ primerjav, `ArrayList` do $10^6$ primerjav.

? Kaj se zgodi, če v zanki `for (Integer x : s)` nad `ArrayList` z elementi $4, 7, 2, 7, 9$ pokličemo `s.remove(x)`, kadar je `x > 5`?
- Odstrani vse elemente, večje od $5$.
~ Seznam bi se spremenil mimo iteratorja; zanka se prekine z izjemo, preden pride do konca.
+ Odstrani prvo $7$, nato pa vrže `ConcurrentModificationException`.
- Odstrani element na indeksu $7$ in vrže `IndexOutOfBoundsException`.
~ `x` je tipa `Integer`, zato `remove(x)` odstrani po vrednosti, ne po indeksu.
> Ob naslednjem `next()` iterator zazna spremembo; seznam ostane `[4, 2, 7, 9]`.

? Kolikšen je `s.size()` po `Set<String> s = new HashSet<>(); s.add("Fe"); s.add("Cu"); s.add("Fe"); s.add("Zn"); s.remove("Cu");`?
- $4$
~ Šteješ vse klice `add`; drugi `"Fe"` ni dodan, `"Cu"` je odstranjen.
- $3$
~ Upošteval si podvojeni `"Fe"`, ne pa odstranitve `"Cu"`.
+ $2$
> Po dodajanju je $\{\mathrm{Fe}, \mathrm{Cu}, \mathrm{Zn}\}$, po odstranitvi ostaneta Fe in Zn.

? Seznam `[4, 7, 2, 7, 9]` prehodimo z iteratorjem in z `it.remove()` odstranimo vse elemente, večje od $5$. Kolikšna je vsota preostalih?
- $13$
~ To je $4 + 2 + 7$: ena sedmica ti je ostala. Iterator prehodi vse elemente, zato odstrani obe sedmici in devetico.
+ $6$
- $29$
~ To je vsota celotnega seznama; `it.remove()` elemente res odstrani.
> Ostaneta $4$ in $2$, vsota je $6$.

:::simboli
n | število elementov v zbirki | | | od njega je odvisen čas operacij
a, b | množici snovi na policah | | | v Primeru 1
:::
