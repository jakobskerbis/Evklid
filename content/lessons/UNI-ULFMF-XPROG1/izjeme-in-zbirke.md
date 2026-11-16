---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka. Aplikacija na telefonu hrani stanje baterije treh naprav v tabeli. Kaj izpiše ta program? Ugibaj, preden bereš naprej.

```java
int[] baterija = {80, 45, 12};
System.out.println(baterija[3]);
System.out.println("Konec");
```

Ne izpiše ne števila ne besede »Konec«. Program se ustavi z rdečim sporočilom `ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3`. Tabela ima indekse od $0$ do $2$, indeksa $3$ ni.

Uganka razkrije dve težavi resničnih programov. Prvič: med izvajanjem gre lahko kaj narobe (napačen indeks, uporabnik vpiše »dvajset« namesto $20$, datoteke ni), in program se ne bi smel zaradi tega kar sesuti. Drugič: tabela ima stalno dolžino, aplikacija za stike pa ne ve vnaprej, koliko stikov boš shranil. Za prvo ima Java **izjeme**, za drugo **zbirke**.

## Razlaga

Za vsakim koščkom je kratko vprašanje; odgovor je v oklepaju.

**1. Kaj je izjema.** **Izjema** (*exception*) je objekt, ki opisuje napako med izvajanjem. Ko Java naleti na napako, izjemo **vrže**: prekine trenutno metodo in jo preda klicoči metodi, ta svoji klicoči in tako naprej. Če je nihče ne ujame, se program konča in izpiše sled klicev (*stack trace*). Izjeme so razredi z dedovanjem, npr. `NumberFormatException` je podrazred `IllegalArgumentException`, ta pa podrazred `RuntimeException`.

*Preveri:* ali `Integer.parseInt("dvajset")` vrne $0$? (Ne, vrže `NumberFormatException`.)

**2. Ujemanje s `try`–`catch`.** Kodo, ki lahko vrže izjemo, damo v blok `try`. Za njim v blok `catch` napišemo, kaj naredimo ob napaki.

```java
try {
    int leto = Integer.parseInt(vnos);
    System.out.println("Rojen " + leto);
} catch (NumberFormatException e) {
    System.out.println("To ni število: " + vnos);
}
```

Ko se v `try` vrže izjema, se preostanek bloka `try` preskoči in izvede se prvi `catch`, katerega tip se ujema. Blok `finally` (neobvezen) se izvede vedno, z napako ali brez nje.

*Preveri:* če je `vnos` enak `"2007"`, ali se izvede `catch`? (Ne, napake ni.)

:::premisli
Napišemo `catch (Exception e)` pred `catch (NumberFormatException e)`. Kaj misliš, da se zgodi? Zakaj?
---
Prevajalnik javi napako. Vsaka `NumberFormatException` je tudi `Exception`, zato bi jo ujel že prvi blok in drugi ne bi bil nikoli dosegljiv. Bolj specifični tipi gredo naprej, splošni na konec.
:::

**3. Lastno metanje s `throw`.** Izjemo lahko vržemo sami, ko podatki niso smiselni:

```java
if (odstotek < 0 || odstotek > 100) {
    throw new IllegalArgumentException("Napačen odstotek: " + odstotek);
}
```

Nekatere izjeme so **preverjene** (npr. `IOException`): metoda jih mora ujeti ali v glavi napovedati s `throws IOException`. Izjeme iz `RuntimeException` so **nepreverjene**, zanje prevajalnik tega ne zahteva.

*Preveri:* ali se vrstica takoj za `throw` v istem bloku še izvede? (Ne, metoda se tam prekine.)

**4. Seznam `ArrayList`.** **Seznam** je zbirka elementov v vrstnem redu, ki raste in se krči. Indeksi so kot pri tabeli, od $0$ naprej. Spremenljivko napovemo s splošnejšim tipom `List`, objekt pa ustvarimo kot `ArrayList`; to je polimorfizem, ki ga že poznaš. Vsi razredi zbirk so v paketu `java.util`, zato na vrh datoteke napiši `import java.util.*;`.

```java
List<String> aplikacije = new ArrayList<>();
aplikacije.add("Kamera");       // na konec
aplikacije.add(0, "Ura");       // na indeks 0, ostali se zamaknejo
String prva = aplikacije.get(0);
aplikacije.remove(1);           // odstrani element na indeksu 1
int n = aplikacije.size();
```

*Preveri:* kolikšen je `n`? ($1$, ostane samo `"Ura"`.)

**5. Slovar `HashMap`.** **Slovar** hrani pare **ključ → vrednost**. Ključ je enoličen: `put` z obstoječim ključem staro vrednost **prepiše**. Metoda `get` vrne vrednost ali `null`, če ključa ni.

```java
Map<String, String> stiki = new HashMap<>();
stiki.put("Ana", "041 111 222");
stiki.put("Bor", "031 333 444");
stiki.containsKey("Ana");               // true
stiki.getOrDefault("Cene", "ni stika"); // "ni stika"
```

*Preveri:* kaj vrne `stiki.get("Cene")`? (`null`.)

**6. Generiki.** V `List<String>` je `String` **tipski parameter**: pove, kakšne elemente zbirka hrani. Prevajalnik zato zavrne `aplikacije.add(42)` in ti pri `get` ni treba pretvarjati tipa. Tipski parameter mora biti razred, ne osnovni tip: `List<int>` ne gre, pišemo `List<Integer>`. Java pretvorbo med `int` in `Integer` naredi sama (*autoboxing*). Tudi sam lahko napišeš generičen razred:

```java
class Par<A, B> {
    A prvi; B drugi;
    Par(A prvi, B drugi) { this.prvi = prvi; this.drugi = drugi; }
}
Par<String, Integer> p = new Par<>("Ana", 17);
```

*Preveri:* kaj je `B` v `p`? (`Integer`.)

**Primerjava v tabeli.**

| | tabela `int[]` | `ArrayList<Integer>` | `HashMap<String, Integer>` |
|---|---|---|---|
| velikost | stalna | raste | raste |
| dostop | `t[i]` | `get(i)` | `get(ključ)` |
| dolžina | `t.length` | `size()` | `size()` |

:::premisli
Imaš `List<Integer> s` z vsebino `[5, 7, 9]` in pokličeš `s.remove(1)`. Napovej vsebino seznama.
---
`[5, 9]`. Argument tipa `int` Java razume kot **indeks**, zato odstrani element na indeksu $1$, to je $7$. Po vrednosti briše `s.remove(Integer.valueOf(1))`, ki tu ne bi odstranil ničesar, ker $1$ ni v seznamu.
:::

## Rešeni primeri

### Primer 1: seznam aplikacij na zaslonu

Na domačem zaslonu telefona hranimo aplikacije v seznamu. Kaj izpiše program?

```java
List<String> apps = new ArrayList<>();
apps.add("Kamera");
apps.add("Zemljevid");
apps.add("Glasba");
apps.add(1, "Sporočila");
apps.remove(0);
System.out.println(apps + " " + apps.size());
```

**Podatki:** prazen seznam `apps`; zaporedje klicev `add("Kamera")`, `add("Zemljevid")`, `add("Glasba")`, `add(1, "Sporočila")`, `remove(0)`
**Iščemo:** izpis vsebine seznama in njegove velikosti

:::formula
`add(x)` doda na konec; `add(i, x)` vstavi na indeks $i$ in desne zamakne; `remove(i)` odstrani indeks $i$ in desne pomakne levo; `size()` je število elementov.
:::

**Rešitev:**

1. Po treh `add`: `[Kamera, Zemljevid, Glasba]`, ker vsak doda na konec.
2. `add(1, "Sporočila")`: `[Kamera, Sporočila, Zemljevid, Glasba]`, ker se Zemljevid in Glasba zamakneta desno.
3. `remove(0)`: `[Sporočila, Zemljevid, Glasba]`, ker gre ven element na indeksu $0$.
4. Velikost: $4 - 1 = 3$.
5. Odgovor: program izpiše `[Sporočila, Zemljevid, Glasba] 3`.

### Primer 2: štetje obvestil s slovarjem

Telefon je čez noč prejel obvestila iz aplikacij v tem vrstnem redu: Viber, Gmail, Viber, Instagram, Viber, Gmail. Prešteti želimo obvestila po aplikacijah.

```java
String[] obv = {"Viber", "Gmail", "Viber", "Instagram", "Viber", "Gmail"};
Map<String, Integer> stevec = new HashMap<>();
for (String a : obv) {
    stevec.put(a, stevec.getOrDefault(a, 0) + 1);
}
```

**Podatki:** tabela `obv` s $6$ nizi (Viber, Gmail, Viber, Instagram, Viber, Gmail); prazen slovar `stevec`
**Iščemo:** `stevec.get("Viber")`, `stevec.get("Gmail")` in `stevec.size()`

:::formula
`getOrDefault(k, 0)` vrne vrednost ključa $k$ ali $0$, če ga ni; `put(k, v)` vrednost nastavi ali prepiše.
:::

**Rešitev:**

1. Viber: ključa še ni, zato $0 + 1 = 1$.
2. Gmail: $0 + 1 = 1$.
3. Viber: ključ obstaja, $1 + 1 = 2$; `put` prepiše staro vrednost.
4. Instagram: $0 + 1 = 1$.
5. Viber: $2 + 1 = 3$.
6. Gmail: $1 + 1 = 2$.
7. Različni ključi so trije, zato je `size()` enak $3$, čeprav je bilo $6$ klicev `put`.
8. Odgovor: Viber ima $3$ obvestila, Gmail $2$, slovar ima $3$ ključe.

### Primer 3: povprečna baterija z napačnimi vnosi

Uporabniki pametnih ur ročno vpišejo stanje baterije. Vnosi so `"85"`, `"40%"`, `"120"`, `"17"`, `"63"`. Veljavne odstotke zberemo v seznam, napačne preštejemo, nato izračunamo povprečje veljavnih.

```java
static int preberi(String s) {
    int x = Integer.parseInt(s);      // lahko vrže NumberFormatException
    if (x < 0 || x > 100) {
        throw new IllegalArgumentException("Izven 0–100: " + x);
    }
    return x;
}

List<Integer> veljavne = new ArrayList<>();
int napake = 0;
for (String s : vhod) {
    try {
        veljavne.add(preberi(s));
    } catch (IllegalArgumentException e) {
        napake++;
    }
}
```

**Podatki:** `vhod` = `{"85", "40%", "120", "17", "63"}`; veljaven je cel odstotek od $0$ do $100$
**Iščemo:** vsebino `veljavne`, vrednost `napake` in povprečje veljavnih

:::formula
Izjema v `try` preskoči preostanek bloka in skoči v ujemajoči `catch`; `catch (T e)` ujame tip $T$ in vse njegove podrazrede. Povprečje $= \dfrac{\text{vsota}}{\text{število}}$.
:::

**Rešitev:**

1. `"85"` se pretvori, je v mejah, doda se: `[85]`.
2. `"40%"`: `parseInt` vrže `NumberFormatException`. Ta je podrazred `IllegalArgumentException`, zato jo `catch` ujame; `add` se ne izvede. `napake` je $1$.
3. `"120"`: pretvorba uspe, a `preberi` vrže `IllegalArgumentException`. `napake` je $2$.
4. `"17"` in `"63"` se dodata: `[85, 17, 63]`.
5. Vsota: $85 + 17 + 63 = 165$.
6. Povprečje: $\dfrac{165}{3} = 55$.
7. Odgovor: veljavni so $85$, $17$ in $63$, napačna vnosa sta $2$, povprečna baterija je $55\,\%$.

### Primer 4: zdaj ti

Imenik v telefonu je slovar `Map<String, String> imenik = new HashMap<>();`. Izvedemo:

```java
imenik.put("Ana", "041 111 222");
imenik.put("Bor", "031 333 444");
imenik.put("Ana", "070 555 666");
```

**Podatki:** prazen slovar `imenik`; trije klici `put`, dva s ključem `"Ana"`
**Iščemo:** `imenik.size()` in `imenik.get("Ana")`

:::formula
Ključ v slovarju je enoličen; `put` z obstoječim ključem prepiše vrednost.
:::

**Rešitev:**

1. Po prvih dveh klicih sta v slovarju dva ključa, Ana in Bor.
2. Tretji klic ima ključ, ki že obstaja. Dokončaj sam: koliko ključev je zdaj in kaj vrne `get("Ana")`?

:::premisli
Kolikšna sta `imenik.size()` in `imenik.get("Ana")`?
---
`size()` je $2$, `get("Ana")` vrne `"070 555 666"`. Tretji `put` ne doda novega para, ampak prepiše Anino staro številko.
:::

## Pogoste napake

- **`remove(1)` odstrani vrednost 1.** Pri `List<Integer>` je argument `int` indeks, ne vrednost. Iz `[1, 2, 3]` odstrani $2$. Za vrednost piši `remove(Integer.valueOf(1))`.
- **`put` z istim ključem doda nov vnos.** Slovar ima vsak ključ največ enkrat; drugi `put` staro vrednost prepiše in `size()` se ne poveča.
- **`get` za manjkajoči ključ vrne 0.** Vrne `null`. Vrstica `int n = mapa.get("X");` zato vrže `NullPointerException`, ker `null` ne gre v `int`. Uporabi `getOrDefault("X", 0)` ali najprej `containsKey`.
- **`List<int>`.** Generiki sprejmejo samo razrede. Piši `List<Integer>`, `Map<String, Double>`.
- **Prazen ali preširok `catch`.** `catch (Exception e) {}` skrije vsako napako, tudi tisto, ki je nisi pričakoval, in program molče računa narobe. Lovi čim bolj specifičen tip in ob napaki vsaj kaj izpiši ali ukrepaj. Specifični `catch` mora stati pred splošnim, sicer prevajalnik javi nedosegljivo kodo.

## Povzetek

- Izjema je objekt, ki ga Java vrže ob napaki med izvajanjem; potuje navzgor po klicih, dokler je kdo ne ujame.
- `try { … } catch (Tip e) { … } finally { … }`: `catch` ujame tip in njegove podrazrede; specifični tipi pred splošnimi; `finally` se izvede vedno.
- S `throw new …` izjemo vržemo sami; preverjene izjeme je treba ujeti ali napovedati s `throws`.
- `ArrayList`: urejen seznam spremenljive dolžine; `add`, `add(i, x)`, `get(i)`, `set(i, x)`, `remove(i)`, `size()`.
- `HashMap`: pari ključ → vrednost, ključi enolični; `put` prepiše, `get` vrne `null`, če ključa ni.
- Generiki (`List<String>`, `Par<A, B>`) dajo preverjanje tipov ob prevajanju; parametri so razredi (`Integer`, ne `int`).

## Za izpit

Znati moraš povedati:

- definicijo izjeme in pot vržene izjeme po skladu klicev do prvega ujemajočega `catch` ali do konca programa,
- pravila bloka `try`–`catch`–`finally`: kaj se ob izjemi preskoči, kateri `catch` se izbere (tip in podrazredi, specifični pred splošnimi), kdaj se izvede `finally`,
- razliko med preverjenimi in nepreverjenimi izjemami ter kaj prevajalnik zahteva (`catch` ali `throws`),
- delovanje metod `add`, `add(i, x)`, `get`, `remove(i)`, `size` pri `ArrayList` ter `put`, `get`, `getOrDefault`, `containsKey` pri `HashMap`,
- zakaj je tipski parameter razred (`Integer`, ne `int`) in kaj generiki preverijo ob prevajanju,
- časovno zahtevnost osnovnih operacij seznama in slovarja z utemeljitvijo.

### Naloga 1

Kaj izpiše spodnji program? Za vsak obhod zanke zapiši vsebino seznama `s`, vrednost `vsota` in vsebino slovarja `m`.

```java
static int f(List<Integer> s, int i) {
    try {
        return 100 / s.get(2 * i);
    } catch (ArithmeticException e) {
        return -1;
    } finally {
        s.add(i);
    }
}

public static void main(String[] args) {
    List<Integer> s = new ArrayList<>(List.of(4, 0, 0));
    Map<String, Integer> m = new HashMap<>();
    int vsota = 0;
    for (int i = 0; i < 5; i++) {
        try {
            vsota += f(s, i);
            m.put("ok", m.getOrDefault("ok", 0) + 1);
        } catch (IndexOutOfBoundsException e) {
            m.put("izven", m.getOrDefault("izven", 0) + 1);
        }
    }
    System.out.println(vsota + " " + s + " " + m.get("ok")
        + " " + m.get("izven") + " " + m.get("deljenje"));
}
```

**Rešitev:**

1. Pravila: celoštevilsko deljenje z $0$ vrže `ArithmeticException`, `get` z indeksom izven seznama vrže `IndexOutOfBoundsException`. Blok `finally` v `f` se izvede vedno, torej se `i` doda na konec seznama pri vsakem klicu, tudi ko `f` vrne vrednost ali ko izjema potuje naprej v `main`.
2. $i = 0$: `s.get(0)` je $4$, `f` vrne $\frac{100}{4} = 25$; `finally` doda $0$: `[4, 0, 0, 0]`. `vsota` je $25$, `m` je `{ok=1}`.
3. $i = 1$: `s.get(2)` je $0$, deljenje vrže `ArithmeticException`, ki jo ujame `catch` v `f`; `f` vrne $-1$. `finally` doda $1$: `[4, 0, 0, 0, 1]`. `vsota` je $25 - 1 = 24$, `m` je `{ok=2}`.
4. $i = 2$: `s.get(4)` je $1$, `f` vrne $\frac{100}{1} = 100$; `finally` doda $2$: `[4, 0, 0, 0, 1, 2]`. `vsota` je $24 + 100 = 124$, `m` je `{ok=3}`.
5. $i = 3$: seznam ima $6$ elementov (indeksi od $0$ do $5$), `s.get(6)` vrže `IndexOutOfBoundsException`. Ta ni podrazred `ArithmeticException`, zato je `catch` v `f` ne ujame; `finally` kljub temu doda $3$: `[4, 0, 0, 0, 1, 2, 3]`. Izjema pride v `main`, preostanek bloka `try` se preskoči (`vsota` in ključ `ok` se ne spremenita), `catch` nastavi `izven` na $1$.
6. $i = 4$: seznam ima $7$ elementov, `s.get(8)` spet vrže `IndexOutOfBoundsException`; `finally` doda $4$: `[4, 0, 0, 0, 1, 2, 3, 4]`. `izven` je $2$.
7. Ključa `deljenje` ni v slovarju, zato `get` vrne `null`; pri lepljenju nizov se izpiše kot `null` in izjeme ni.
8. Odgovor: program izpiše `124 [4, 0, 0, 0, 1, 2, 3, 4] 3 2 null`.

### Naloga 2

Natančno navedi razliko med preverjenimi in nepreverjenimi izjemami ter pravilo o vrstnem redu blokov `catch`. Nato za vsak odlomek utemelji, ali se prevede; če se prevede, povej, kaj se zgodi ob izvajanju.

(a) `static void shrani() { throw new IOException("disk"); }`
(b) `static void nastavi(int p) { if (p < 0) throw new IllegalArgumentException("p"); }`
(c) `try { Integer.parseInt(s); } catch (IllegalArgumentException e) { } catch (NumberFormatException e) { }`
(d) `Map<String, int> m = new HashMap<>();`
(e) `Map<String, Integer> m = new HashMap<>(); int n = m.get("x");`

**Rešitev:**

1. Preverjene izjeme so podrazredi `Exception`, ki niso podrazredi `RuntimeException` (npr. `IOException`). Metoda, v kateri lahko nastanejo, jih mora ujeti s `catch` ali napovedati v glavi s `throws`; to preveri prevajalnik. Nepreverjene so podrazredi `RuntimeException` (in `Error`); zanje prevajalnik ne zahteva ničesar.
2. Vrstni red: ob izjemi se izvede prvi `catch`, katerega tip je tip izjeme ali njegov nadrazred. Blok za podrazred mora zato stati pred blokom za nadrazred, sicer je nedosegljiv in prevajalnik javi napako.
3. (a) Ne: `IOException` je preverjena, metoda je ne ujame in nima `throws IOException`.
4. (b) Da: `IllegalArgumentException` je podrazred `RuntimeException`, torej nepreverjena. Klic `nastavi(-1)` vrže izjemo, ki potuje h klicoči metodi; klic `nastavi(5)` se konča brez izjeme.
5. (c) Ne: `NumberFormatException` je podrazred `IllegalArgumentException`, zato bi jo ujel že prvi blok; drugi je nedosegljiv.
6. (d) Ne: tipski parameter mora biti razred; pravilno je `Map<String, Integer>`.
7. (e) Da, prevede se, ker Java vrednost tipa `Integer` sama pretvori v `int`. Ob izvajanju `get` vrne `null`, saj ključa ni, pretvorba `null` v `int` pa vrže `NullPointerException`.
8. Odgovor: prevedeta se (b) in (e); (e) se ob izvajanju konča z `NullPointerException`.

### Naloga 3

Seznam z $n$ elementi zgradimo iz praznega `ArrayList` na dva načina: (A) $n$-krat pokličemo `add(0, x)`, (B) $n$-krat pokličemo `add(x)`. Izpelji, koliko premikov obstoječih elementov povzroči vsak način, in rezultat izračunaj za $n = 2000$. Povečevanje notranje tabele zanemari. Utemelji, zakaj pri slovarju `HashMap` takega pojava ni.

**Rešitev:**

1. `add(0, x)` vstavi na indeks $0$, zato se vsi obstoječi elementi zamaknejo za eno mesto desno. Če je v seznamu $k$ elementov, je premikov $k$.
2. Način A: pri zaporednih klicih je v seznamu $0, 1, 2, \dots, n - 1$ elementov, skupaj $0 + 1 + \dots + (n - 1) = \dfrac{n(n - 1)}{2}$ premikov. To je $O(n^2)$.
3. Način B: `add(x)` doda na konec in ne premakne nobenega elementa, skupaj $0$ premikov; vseh $n$ klicev je $O(n)$.
4. Za $n = 2000$: način A povzroči $\dfrac{2000 \cdot 1999}{2} = 1\,999\,000$ premikov, to je povprečno $\dfrac{1\,999\,000}{2000} = 999{,}5$ premika na klic; način B nobenega.
5. Slovar elementov ne hrani po zaporednih indeksih. `put` s `hashCode()` izračuna predal ključa in par shrani vanj, drugi pari ostanejo na mestu. Zato je `put` povprečno $O(1)$ ne glede na število parov.
6. Odgovor: način A povzroči $\dfrac{n(n - 1)}{2}$ premikov (pri $n = 2000$ je to $1\,999\,000$), način B nobenega; v slovarju se ob vstavljanju nič ne premika.

## Drugače: Na sliki

Pot izjeme si predstavljaj kot sklad klicev, narisan od spodaj navzgor:

:::risba skica
opis: Sklad klicev kot trije pravokotniki drug pod drugim. Zgoraj je klic preberi("40%"), kjer parseInt vrže izjemo in se preberi prekine. Puščica navzdol kaže, da izjema pade v zanko v main; tam jo ujame try-catch in zanka teče naprej. Črtkana puščica navzdol do JVM kaže pot, če catch ne bi obstajal: program se konča in izpiše sled klicev.
območje: 0; 0 .. 22; 9
pravokotnik: 0,5; 6,5 .. 9; 8,5 | rdeča
pravokotnik: 0,5; 3,5 .. 9; 5,5 | zelena
pravokotnik: 0,5; 0,5 .. 9; 2,5 | siva
napis: 4,75; 7,5 | preberi("40%") | sredina
napis: 4,75; 4,5 | zanka v main | sredina
napis: 4,75; 1,5 | JVM | sredina
puščica: 4,75; 6,5 -> 4,75; 5,5
puščica: 4,75; 3,5 -> 4,75; 2,5 | | | črtkano
napis: 9,5; 7,5 | parseInt vrže izjemo | desno
napis: 9,5; 6 | izjema pade dol | desno
napis: 9,5; 4,5 | try-catch ujame izjemo | desno
napis: 9,5; 3 | če ne bi bilo catch | desno
napis: 9,5; 1,5 | konec in sled klicev | desno
:::

Zbirke pa kot predale. `ArrayList` ima oštevilčene predale brez lukenj:

| indeks | `[0]` | `[1]` | `[2]` |
|---|---|---|---|
| element | Kamera | Sporočila | Glasba |

`HashMap` ima nalepke namesto številk:

| ključ (nalepka) | vrednost |
|---|---|
| `"Ana"` | 070 555 666 |
| `"Bor"` | 031 333 444 |

Pri seznamu iščeš po številki predala, pri slovarju po nalepki. Vstavljanje v seznam premakne vse predale od tistega mesta naprej za eno v desno; v slovarju se nič ne premika.

## Drugače: Bolj natančno

**Hierarhija.** Vse, kar lahko vržemo, deduje od `Throwable`. Ta ima dva podrazreda: `Error` (resne težave okolja, npr. `StackOverflowError` pri neskončni rekurziji; teh običajno ne lovimo) in `Exception`. Podrazredi `RuntimeException` so nepreverjeni, ostali `Exception` so preverjeni: prevajalnik zahteva `catch` ali `throws`. Lastno izjemo naredimo z dedovanjem, npr. `class PraznaBaterija extends Exception`.

**Časovna zahtevnost.** `ArrayList.get(i)` je $O(1)$, `add(x)` na konec povprečno $O(1)$ (notranja tabela se ob polnosti poveča za konstanten faktor), `add(0, x)` in `remove(0)` pa $O(n)$, ker se zamaknejo vsi elementi. `HashMap.get` in `put` sta povprečno $O(1)$: ključ se z `hashCode()` preslika v predal, enakost se preveri z `equals()`. Zato mora razred, ki ga uporabljaš kot ključ, imeti usklajena `equals` in `hashCode`.

**Brisanje tipov.** Generiki obstajajo le ob prevajanju; v izvedljivi kodi je `List<String>` samo `List` (*type erasure*). Zato ne moreš napisati `new T()` ali `new T[10]`, in zato `List<int>` ni mogoč: notranje so elementi tipa `Object`.

## Preveri se

? Katera trditev o `HashMap<String, Integer>` je resnična?
- Če dvakrat pokličeš `put` z istim ključem, slovar hrani oba para.
~ Ključ je enoličen: drugi `put` staro vrednost prepiše, `size()` ostane enak.
- `get` za ključ, ki ga ni, vrne $0$.
~ Vrne `null`. Privzeto vrednost dobiš z `getOrDefault(ključ, 0)`.
+ Vsak ključ se pojavi največ enkrat, `get` za manjkajoči ključ vrne `null`.
- Elementi so vedno v vrstnem redu vstavljanja.
~ `HashMap` vrstnega reda ne zagotavlja; to dela `LinkedHashMap`.
> Slovar preslika vsak ključ v natanko eno vrednost. Manjkajoči ključ da `null`.

? `List<Integer> s = new ArrayList<>(List.of(1, 2, 3, 4));` nato `s.remove(1);` in `s.add(0, 5);`. Kaj vrne `s.get(1)`?
- $2$
~ Tako dobiš, če misliš, da `remove(1)` odstrani vrednost $1$. Argument `int` je indeks.
- $5$
~ Indeksi se začnejo z $0$: element $5$ je na indeksu $0$, ne $1$.
+ $1$
- $3$
~ Pozabil si, da `add(0, 5)` vse elemente zamakne za eno mesto desno.
> `remove(1)` odstrani indeks $1$ (vrednost $2$): `[1, 3, 4]`. `add(0, 5)`: `[5, 1, 3, 4]`. Na indeksu $1$ je $1$.

? Rešitev naloge »koliko klicev je imela Mama« se glasi: (1) `Map<String, Integer> klici = new HashMap<>();` (2) Mama še ni klicala. (3) `int n = klici.get("Mama");` da $n = 0$. Kje je napaka?
- V koraku (1): slovar mora biti `HashMap<String, int>`.
~ Generiki ne sprejmejo osnovnih tipov; `Integer` je pravilno.
- Nikjer, rezultat je $0$.
~ Za manjkajoči ključ `get` ne vrne $0$, ampak `null`.
+ V koraku (3): `get` vrne `null` in pretvorba v `int` vrže `NullPointerException`.
> Pravilno je `int n = klici.getOrDefault("Mama", 0);`, ki res vrne $0$.

? Primerjaj tabelo `String[]` in `ArrayList<String>`. Kaj drži?
+ Tabeli dolžino določiš ob ustvarjanju, seznam pa raste z `add`.
- Seznam ima indekse od $1$ naprej, tabela od $0$.
~ Oba imata indekse od $0$ do dolžine manj $1$.
- V seznam lahko poleg nizov dodaš tudi števila, ker je zbirka.
~ `List<String>` sprejme samo nize; prevajalnik `add(42)` zavrne. Prav to je namen generikov.
- Tabela vrže izjemo pri napačnem indeksu, seznam pa vrne `null`.
~ Tudi `get` z napačnim indeksom vrže izjemo (`IndexOutOfBoundsException`).
> Glavna razlika je spremenljiva dolžina; dostop po indeksu je pri obeh enak.

? Pišeš aplikacijo, ki ob vnosu imena prijatelja takoj pokaže njegovo telefonsko številko. Prijateljev je lahko nekaj tisoč. Kaj izbereš?
- `String[]` s številkami in iskanje z zanko.
~ Tabela ima stalno dolžino, iskanje z zanko pa gre čez vse elemente.
- `ArrayList<String>` z imeni in številkami izmenično.
~ Deluje, a iskanje po imenu je počasno in nerodno; parov seznam ne opisuje naravno.
+ `HashMap<String, String>` s ključem ime in vrednostjo številka.
- `ArrayList<Integer>` s številkami, ker so številke števila.
~ Telefonske številke niso števila za računanje (presledki, vodilna ničla), pa tudi ime manjka.
> Slovar najde vrednost po ključu v povprečju v konstantnem času, ne glede na število prijateljev.

:::simboli
i | indeks elementa v seznamu | | | šteje od 0
k | ključ v slovarju (mapi)
T | tip (razred) izjeme | | | catch ujame tudi podrazrede
:::
