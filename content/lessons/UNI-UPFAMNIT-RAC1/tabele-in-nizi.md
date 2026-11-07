---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta 1950 so na ameriškem računalniku ENIAC izračunali prvo numerično vremensko napoved. Meteorologi in matematiki so ozračje nad Severno Ameriko razdelili v mrežo točk in za vsako točko hranili vrednost, iz katere so korak za korakom računali prihodnje stanje. Napoved za $24$ ur je trajala skoraj prav toliko časa, a dokazala je, da se vreme da računati. Ključna ideja ni bila fizika, ampak organizacija podatkov: namesto sto ločenih spremenljivk ena **mreža**, v kateri vsako vrednost najdeš po njeni legi.

Nekaj let kasneje je skupina pri IBM pod vodstvom Johna Backusa razvila jezik FORTRAN za znanstveno računanje, v katerem so bile take mreže – **tabele** (angl. *arrays*) – osnovni gradnik jezika. Danes podnebni modeli računajo na mrežah z milijoni točk, vremenske postaje pa vsak dan pošiljajo tisoče vrstic besedila, ki jih je treba razčleniti. Kako se s takimi mrežami in z vrsticami besedila – **nizi** – dela v Javi, je tema te lekcije: od ene vrste vrednosti do mreže in razčlenjevanja besedila.

## Razlaga

### Slika: tabela je vrsta oštevilčenih predalov

Temperature v Ljubljani en teden ob 14. uri (levo indeks, desno vrednost v predalu):

```
 i    t[i]
    +------+
 0  | 18,4 |
 1  | 21,0 |
 2  | 24,6 |
 3  | 23,2 |
 4  | 19,8 |
 5  | 17,5 |
 6  | 20,3 |
    +------+
```

Vse vrednosti so istega tipa, vsaka ima svoj **indeks**, štetje se začne pri $0$. Zadnji indeks je za ena manjši od dolžine. Do vrednosti prideš neposredno po indeksu, ne da bi šel čez prejšnje: `t[2]` je $24{,}6$.

### Enodimenzionalne tabele v Javi

**Deklaracija in ustvarjanje.**

```java
double[] t = new double[7];                // 7 predalov, vsi 0.0
double[] u = {18.4, 21.0, 24.6, 23.2, 19.8, 17.5, 20.3};
int n = u.length;                          // 7
```

`new double[7]` rezervira prostor za $7$ vrednosti in jih nastavi na privzeto vrednost tipa ($0$ za števila, `false` za `boolean`, `null` za objekte). Dolžina je **stalna**: tabeli ne moreš dodati osmega predala. Atribut `length` (brez oklepajev) pove dolžino.

**Pravilo (indeksi).** Za tabelo `a` dolžine $n$ so veljavni indeksi $0, 1, \dots, n - 1$. Dostop do `a[i]` pri $i < 0$ ali $i \geq n$ med izvajanjem sproži izjemo `ArrayIndexOutOfBoundsException`; Java ne prebere »sosednjega« pomnilnika.

**Obhod tabele.** Vse elemente obdelamo z zanko `for`, kjer števec teče od $0$ do `length - 1`:

```java
double s = 0;
for (int i = 0; i < u.length; i++) {
    s = s + u[i];
}
double povp = s / u.length;
```

Pogoj je `i < u.length`, ne `<=`. Kadar indeksa ne potrebujemo, je krajša zanka `for (double x : u) { s += x; }`.

**Spremenljivka hrani sklic, ne tabele.** To je največja razlika od spremenljivk tipa `int` ali `double`:

```java
int[] a = {1, 2, 3};
int[] b = a;      // b kaže na ISTO tabelo
b[0] = 9;
System.out.println(a[0]);   // 9
```

Prireditev `b = a` ne prepiše vrednosti, ampak **sklic** (naslov tabele). Obe imeni kažeta na isto vrsto predalov. Kopijo dobiš z `int[] c = a.clone();` ali `Arrays.copyOf(a, a.length)`. Isto velja za parametre metod: iz lekcije o funkcijah veš, da se argument skopira v parameter. Pri tabeli se skopira **sklic**, zato metoda, ki spremeni `a[i]`, spremeni tabelo klicatelja. Če pa parametru priredi novo tabelo (`a = new int[5]`), klicatelj tega ne vidi.

:::premisli
Metoda `void ponastavi(int[] x) { x[0] = 0; x = new int[]{7, 7}; x[1] = 5; }` dobi tabelo `a = {4, 4}`. Kaj vsebuje `a` po klicu `ponastavi(a)`?
---
`{0, 4}`. Prva vrstica spremeni tabelo, na katero kaže tudi `a`. Druga vrstica parametru `x` priredi sklic na novo tabelo; od tod naprej `x` kaže drugam, zato `x[1] = 5` spremeni le novo tabelo, ki jo klicatelj ne vidi.
:::

### Tipični algoritmi na tabelah

Večino nalog rešimo s štirimi vzorci, ki si jih velja zapomniti skupaj z njihovo **invarianto** (trditvijo, ki velja po vsakem obhodu):

- **Vsota.** Začetek `s = 0`; v obhodu `s += a[i]`. Invarianta: `s` je vsota `a[0..i]`.
- **Največji.** Začetek `mi = 0`; v obhodu `if (a[i] > a[mi]) mi = i`. Invarianta: `a[mi]` je največji v `a[0..i]`.
- **Štetje.** Začetek `c = 0`; v obhodu `if (pogoj) c++`. Invarianta: `c` šteje ustrezne v `a[0..i]`.
- **Iskanje.** Začetek `k = -1`; v obhodu `if (a[i] == x) { k = i; break; }`. Invarianta (po obhodu brez `break`): `x` ni v `a[0..i]`.

Pri iskanju največjega hranimo **indeks** (`mi`), ne le vrednosti: tako vemo tudi, kje je. Začetna vrednost `mi = 0` predpostavlja, da tabela ni prazna.

**Obračanje na mestu.** Element na indeksu $i$ zamenjamo s simetričnim na indeksu $n - 1 - i$, a le za prvo polovico, sicer bi tabelo obrnili dvakrat:

```java
for (int i = 0; i < n / 2; i++) {
    double tmp = a[i];
    a[i] = a[n - 1 - i];
    a[n - 1 - i] = tmp;
}
```

### Večdimenzionalne tabele

Mesečne povprečne temperature treh postaj (p 0, p 1, p 2) za štiri mesece (januar–april) so **dvodimenzionalna tabela** s $3$ vrsticami in $4$ stolpci:

```
      jan  feb  mar  apr
p 0: [ 2,1  4,5  9,8 14,2]
p 1: [-1,3  1,2  6,4 11,0]
p 2: [ 0,4  3,0  8,1 12,6]
```

```java
double[][] m = new double[3][4];
m[1][2] = 6.4;            // vrstica 1, stolpec 2
int vrstice = m.length;   // 3
int stolpci = m[0].length; // 4
```

Prvi indeks je vrstica, drugi stolpec. V Javi je dvodimenzionalna tabela **tabela tabel**: `m[1]` je cela vrstica, enodimenzionalna tabela dolžine $4$. Zato so vrstice lahko različno dolge (»nazobčana« tabela, `new double[3][]` in nato vsaka vrstica posebej). Obhod potrebuje dve gnezdeni zanki:

```java
for (int i = 0; i < m.length; i++) {
    for (int j = 0; j < m[i].length; j++) {
        // obdelaj m[i][j]
    }
}
```

**Vrstični zapis.** V pomnilniku (in v datotekah) je mreža pogosto shranjena kot ena dolga vrsta, vrstica za vrstico. Pri mreži z $s$ stolpci je element $(i, j)$ na mestu $i \cdot s + j$; v našem primeru je `m[1][2]` na mestu $1 \cdot 4 + 2 = 6$. Tako hranijo mreže tudi podnebni modeli in slikovne datoteke. Javanska `double[][]` vrstic ne hrani nujno skupaj (vsaka vrstica je svoja tabela); kdor želi en neprekinjen blok, vzame `double[]` dolžine $v \cdot s$ in indeks $i \cdot s + j$.

:::premisli
Kolikokrat se izvede notranje telo, ko obhodiš celotno tabelo `new double[3][4]`? In koliko, če obhodiš le zgornji trikotnik kvadratne tabele $n \times n$ (vsi $j \geq i$)?
---
$3 \cdot 4 = 12$-krat. Pri zgornjem trikotniku ima vrstica $i$ še $n - i$ elementov, skupaj $n + (n - 1) + \dots + 1 = n(n + 1)/2$.
:::

### Nizi

Niz (`String`) je zaporedje znakov (`char`) z indeksi od $0$ do `length() - 1`, podobno kot tabela, a z dvema pomembnima razlikama: dolžino dobiš z **metodo** `length()` (z oklepaji), znakov pa ne moreš spreminjati – niz je **nespremenljiv** (angl. *immutable*). Vsaka »sprememba« ustvari nov niz.

Osnovne metode na primeru `v = "LJ;31.4;0.0"`:

| klic | rezultat |
|---|---|
| `v.length()` | `11` |
| `v.charAt(0)` | `'L'` |
| `v.indexOf(";")` | `2` |
| `v.substring(3, 7)` | `"31.4"` |
| `v.split(";")` | `{"LJ", "31.4", "0.0"}` |
| `v.equals("LJ")` | `false` |

`substring(a, b)` vrne znake od indeksa $a$ do indeksa $b$, brez $b$.

**Primerjava nizov.** `a == b` primerja sklica (ali je to isti objekt), `a.equals(b)` pa vsebino. Dva niza z enakimi znaki sta lahko različna objekta, zato vsebino **vedno** primerjaj z `equals`; vrstni red po kodah znakov da `compareTo` (zato `"ž"` pride za `"z"`, ne pred njim; to ni slovenska abeceda).

**Znaki so števila.** `char` je v Javi celoštevilski tip, zato `'7' - '0'` da $7$, `(char)('a' + 1)` pa `'b'`. Pretvorbo celega niza v število opravita `Integer.parseInt` in `Double.parseDouble`.

**Sestavljanje nizov.** Ker so nizi nespremenljivi, `s = s + c` v zanki vsakič ustvari nov niz in vanj skopira vse dosedanje znake – pri $n$ znakih okoli $n^2/2$ kopiranj. Za sestavljanje v zanki uporabi `StringBuilder` (`sb.append(c)`, na koncu `sb.toString()`).

## Rešeni primeri

### Primer 1 (lažji)

Za tedenske temperature iz slike ($18{,}4$; $21{,}0$; $24{,}6$; $23{,}2$; $19{,}8$; $17{,}5$ in $20{,}3\,^\circ\mathrm{C}$) izračunaj povprečje in poišči najtoplejši dan (indeks in vrednost).

**Podatki:** tabela `u` dolžine $7$ z zgornjimi vrednostmi, indeksi $0$ do $6$
**Iščemo:** povprečje, indeks in vrednost največjega elementa

:::formula
vsota: `s += u[i]`; povprečje $s/n$; največji: `if (u[i] > u[mi]) mi = i`
:::

**Rešitev:**

1. Program:

```java
double s = 0;
int mi = 0;
for (int i = 0; i < u.length; i++) {
    s += u[i];
    if (u[i] > u[mi]) {
        mi = i;
    }
}
System.out.println(s / u.length + " " + mi + " " + u[mi]);
```

2. Vsota: $18{,}4 + 21{,}0 + 24{,}6 + 23{,}2 + 19{,}8 + 17{,}5 + 20{,}3 = 144{,}8$.
3. Povprečje: $144{,}8/7 \approx 20{,}69\,^\circ\mathrm{C}$.
4. `mi` se spremeni pri `i = 1` ($21{,}0 > 18{,}4$) in pri `i = 2` ($24{,}6 > 21{,}0$), nato nikoli več.
5. Odgovor: povprečje je približno $20{,}69\,^\circ\mathrm{C}$, najtoplejši je dan z indeksom $2$ (tretji dan) s $24{,}6\,^\circ\mathrm{C}$.

### Primer 2

Za tabelo mesečnih temperatur treh postaj iz razlage izračunaj povprečje vsake postaje, najvišjo temperaturo vsakega meseca in število vseh meritev nad $5\,^\circ\mathrm{C}$.

**Podatki:** `m` velikosti $3 \times 4$: vrstice $(2{,}1; 4{,}5; 9{,}8; 14{,}2)$; $(-1{,}3; 1{,}2; 6{,}4; 11{,}0)$; $(0{,}4; 3{,}0; 8{,}1; 12{,}6)$; meja $5\,^\circ\mathrm{C}$
**Iščemo:** povprečja vrstic, največje vrednosti stolpcev, število vrednosti nad mejo

:::formula
vrstica: zunanja zanka po $i$, notranja po $j$; stolpec: zunanja po $j$, notranja po $i$; štetje: `if (m[i][j] > 5) c++`
:::

**Rešitev:**

1. Povprečja vrstic – za vsako vrstico ločen seštevalnik:

```java
for (int i = 0; i < m.length; i++) {
    double s = 0;
    for (int j = 0; j < m[i].length; j++) {
        s += m[i][j];
    }
    System.out.println(s / m[i].length);
}
```

2. Postaja 0: $(2{,}1 + 4{,}5 + 9{,}8 + 14{,}2)/4 = 30{,}6/4 = 7{,}65$; postaja 1: $17{,}3/4 \approx 4{,}33$; postaja 2: $24{,}1/4 \approx 6{,}03$.
3. Največji po stolpcih – zanki zamenjamo, ker zdaj ena vrednost pripada stolpcu:

```java
for (int j = 0; j < m[0].length; j++) {
    double mx = m[0][j];
    for (int i = 1; i < m.length; i++) {
        if (m[i][j] > mx) mx = m[i][j];
    }
    System.out.println(mx);
}
```

4. V vsakem mesecu je najtoplejša postaja 0: $2{,}1$; $4{,}5$; $9{,}8$ in $14{,}2$.
5. Štetje nad $5$: v vrstici 0 sta $9{,}8$ in $14{,}2$, v vrstici 1 $6{,}4$ in $11{,}0$, v vrstici 2 $8{,}1$ in $12{,}6$; skupaj $6$.
6. Odgovor: povprečja $7{,}65$; $4{,}33$ in $6{,}03\,^\circ\mathrm{C}$; najvišje temperature po mesecih $2{,}1$; $4{,}5$; $9{,}8$ in $14{,}2\,^\circ\mathrm{C}$; nad $5\,^\circ\mathrm{C}$ je $6$ meritev. Seštevalnik `s` je deklariran **znotraj** zunanje zanke, da se za vsako vrstico začne pri nič.

### Primer 3 (težji)

Vročinski val je zaporedje vsaj treh zaporednih dni z najvišjo temperaturo vsaj $30\,^\circ\mathrm{C}$. Napiši metodo, ki v tabeli dnevnih maksimumov poišče **najdaljše** zaporedje dni z vsaj $30\,^\circ\mathrm{C}$ in vrne njegov začetni indeks in dolžino. Izračunaj rezultat za podatke $28{,}5$; $31{,}2$; $32{,}0$; $29{,}9$; $30{,}1$; $30{,}4$; $33{,}0$; $31{,}8$; $29{,}0$ in $30{,}5$ in povej, ali gre za vročinski val.

**Podatki:** tabela `d` dolžine $10$ z zgornjimi vrednostmi, meja $30{,}0\,^\circ\mathrm{C}$, val vsaj $3$ dni
**Iščemo:** začetni indeks in dolžino najdaljšega zaporedja

:::formula
v obhodu: če `d[i] >= 30` potem `tek++`, sicer `tek = 0`; če `tek > naj`: `naj = tek`, `zacetek = i - tek + 1`
:::

**Rešitev:**

1. Ideja: hranimo dolžino **trenutnega** zaporedja (`tek`) in najdaljšega doslej (`naj`) z začetkom. Invarianta po obhodu $i$: `tek` je dolžina zaporedja vročih dni, ki se konča pri $i$; `naj` je največja dolžina v `d[0..i]`.
2. Metoda (vrne tabelo z dvema številoma, ker metoda vrne eno vrednost):

```java
static int[] najdaljsiVal(double[] d) {
    int tek = 0, naj = 0, zacetek = -1;
    for (int i = 0; i < d.length; i++) {
        if (d[i] >= 30.0) {
            tek++;
        } else {
            tek = 0;
        }
        if (tek > naj) {
            naj = tek;
            zacetek = i - tek + 1;
        }
    }
    return new int[]{zacetek, naj};
}
```

3. Sledenje: `i = 0` ($28{,}5$): `tek = 0`. `i = 1`, `2`: `tek` $= 1$, $2$; `naj = 2`, začetek $1$. `i = 3` ($29{,}9$): `tek = 0`.
4. `i = 4` do `7` ($30{,}1$; $30{,}4$; $33{,}0$; $31{,}8$): `tek` $= 1, 2, 3, 4$; pri `tek = 3` (`i = 6`) in `tek = 4` (`i = 7`) se `naj` poveča, začetek je $7 - 4 + 1 = 4$.
5. `i = 8` ($29{,}0$): `tek = 0`. `i = 9` ($30{,}5$): `tek = 1 < 4`, brez spremembe.
6. Robni primeri: tabela brez vročih dni vrne `{-1, 0}`; zaporedje na samem koncu se upošteva, ker `naj` posodobimo v vsakem obhodu, ne šele ob prekinitvi zaporedja.
7. Odgovor: metoda vrne `{4, 4}` – najdaljše zaporedje se začne na indeksu $4$ (peti dan) in traja $4$ dni; ker je dolgo vsaj $3$ dni, je to vročinski val.

### Primer 4 – zdaj ti

Opazovalec padavin vsak dan zapiše črko: `D` za dan z dežjem, `S` za suh dan. Za mesec, ki se je začel z zapisom `"SSDDDSDDDDS"`, preštej deževne dni in izračunaj njihov delež.

**Podatki:** niz `p = "SSDDDSDDDDS"`
**Iščemo:** število znakov `'D'` in delež

:::formula
`for (int i = 0; i < p.length(); i++) if (p.charAt(i) == 'D') c++;` delež $c/n$
:::

**Rešitev:**

1. Dolžina niza: `p.length()` je $11$ (metoda z oklepaji).
2. Znake primerjamo z `==`, ker je `char` osnovni tip; za cele nize bi potrebovali `equals`.
3. Zdaj ti: preštej znake `'D'` in izračunaj delež; pazi na celoštevilsko deljenje.

:::premisli
Koliko je deževnih dni, kolikšen je delež in kako ga izračunaš v Javi?
---
`'D'` je na indeksih $2, 3, 4, 6, 7, 8, 9$, torej $c = 7$. Delež je $7/11 \approx 0{,}636$. V Javi `c / p.length()` da $0$ (deljenje dveh celih števil), zato pišemo `(double) c / p.length()`.
:::

## Pogoste napake

- **`i <= a.length` v pogoju zanke.** Zadnji veljavni indeks je `a.length - 1`; pri `<=` zadnji obhod sproži `ArrayIndexOutOfBoundsException`.
- **`b = a` kot kopija.** Kopira se sklic; spremembe prek `b` vidiš v `a`. Za kopijo uporabi `clone()` ali `Arrays.copyOf`.
- **Primerjava nizov z `==`.** Lahko vrne `false` za enaka besedila. Uporabi `equals`.
- **`length` pri nizih in tabelah.** Tabela ima atribut `a.length`, niz metodo `s.length()`.
- **Celoštevilsko deljenje pri povprečju ali deležu.** `vsota / n` z dvema `int` zaokroži navzdol; vsaj eno število pretvori v `double`.

## Povzetek

- Tabela je vrsta vrednosti istega tipa z indeksi $0$ do `length - 1`; dolžina je stalna.
- Spremenljivka tabele hrani sklic: `b = a` ne kopira, metoda lahko spremeni elemente klicateljeve tabele.
- Vzorci: vsota, največji (hrani indeks), štetje, iskanje; vsak ima svojo invarianto.
- Dvodimenzionalna tabela je tabela tabel, `m[i][j]` (vrstica, stolpec); obhod z gnezdenima zankama; vrstični zapis $i \cdot s + j$.
- Nizi: `length()`, `charAt`, `substring(a, b)`, `indexOf`, `split`; so nespremenljivi; vsebino primerjaj z `equals`; sestavljaj s `StringBuilder`.

## Za izpit

Znati moraš povedati:

- kako se tabela ustvari, kakšne so privzete vrednosti in kateri indeksi so veljavni;
- razliko med kopiranjem sklica in kopiranjem tabele ter posledice pri podajanju tabele metodi;
- algoritme za vsoto, največji element, štetje, linearno iskanje in obračanje z invariantami;
- zgradbo dvodimenzionalne tabele v Javi in vrstični zapis mreže;
- lastnosti nizov (nespremenljivost, `equals` proti `==`, osnovne metode) in zakaj je `StringBuilder` hitrejši pri sestavljanju.

### Naloga 1

Mreža temperaturnih odstopanj je dvodimenzionalna tabela `g` velikosti $3 \times 4$ z vrsticami $(1, 3, 2, 4)$, $(5, 7, 6, 8)$ in $(2, 0, 4, 1)$. **Glajenje** nadomesti vsako celico s povprečjem nje same in njenih sosed zgoraj, spodaj, levo in desno, kolikor jih obstaja (na robu jih je manj). Napiši metodo, ki vrne novo, zglajeno tabelo, in izračunaj rezultat za celice $(0, 0)$, $(1, 1)$ in $(2, 3)$. Utemelji, zakaj rezultat ne sme nastajati v isti tabeli.

**Rešitev:**

1. Rezultat mora biti nova tabela: če bi celice prepisovali sproti, bi pri izračunu naslednje celice uporabili že zglajeno sosedo, ne prvotne vrednosti.
2. Metoda:

```java
static double[][] zgladi(double[][] g) {
    int v = g.length, s = g[0].length;
    double[][] r = new double[v][s];
    int[] di = {1, -1, 0, 0};
    int[] dj = {0, 0, 1, -1};
    for (int i = 0; i < v; i++) {
        for (int j = 0; j < s; j++) {
            double vsota = g[i][j];
            int c = 1;
            for (int k = 0; k < 4; k++) {
                int a = i + di[k], b = j + dj[k];
                if (a >= 0 && a < v && b >= 0 && b < s) {
                    vsota += g[a][b];
                    c++;
                }
            }
            r[i][j] = vsota / c;
        }
    }
    return r;
}
```

3. Pogoj `a >= 0 && a < v && b >= 0 && b < s` izloči sosede zunaj mreže; ker `&&` računa skrajšano, do `g[a][b]` pride le, ko sta indeksa veljavna.
4. Celica $(0, 0)$: soseda sta $(1, 0) = 5$ in $(0, 1) = 3$; $(1 + 5 + 3)/3 = 3{,}0$.
5. Celica $(1, 1)$: vse štiri sosede obstajajo, $(7 + 0 + 3 + 6 + 5)/5 = 21/5 = 4{,}2$.
6. Celica $(2, 3)$: soseda sta $(1, 3) = 8$ in $(2, 2) = 4$; $(1 + 8 + 4)/3 \approx 4{,}33$.
7. Notranje telo se izvede $3 \cdot 4 \cdot 4 = 48$-krat.
8. Odgovor: zglajene vrednosti so $3{,}0$; $4{,}2$ in približno $4{,}33$; nova tabela je nujna, sicer bi bil rezultat odvisen od vrstnega reda obhoda.

### Naloga 2

Kaj izpiše spodnji program (prvi del stoji v metodi `main`, `spremeni` je metoda istega razreda)? Za vsako vrstico izpisa utemelji, kaj se zgodi v pomnilniku.

```java
int[] a = {1, 2, 3};
int[] b = a;
int[] c = a.clone();
b[0] = 10;
c[1] = 20;
spremeni(a);
System.out.println(a[0] + " " + a[1] + " " + a[2]);
String s = "dež";
String t = new String("dež");
System.out.println((s == t) + " " + s.equals(t));

static void spremeni(int[] x) {
    x[2] = 30;
    x = new int[]{0, 0, 0};
}
```

**Rešitev:**

1. `b = a`: `a` in `b` kažeta na isto tabelo. `c = a.clone()`: `c` kaže na novo tabelo $\{1, 2, 3\}$.
2. `b[0] = 10` spremeni skupno tabelo: `a` je $\{10, 2, 3\}$. `c[1] = 20` spremeni le kopijo.
3. V `spremeni` parameter `x` dobi kopijo sklica na skupno tabelo; `x[2] = 30` jo spremeni: $\{10, 2, 30\}$. Priredba `x = new int[]{...}` spremeni le lokalni `x`.
4. Prvi izpis: `10 2 30`.
5. `new String("dež")` ustvari nov objekt z enako vsebino: `s == t` primerja sklica in da `false`, `s.equals(t)` primerja znake in da `true`.
6. Drugi izpis: `false true`.

### Naloga 3

Napiši metodo `obrni(double[] a)`, ki tabelo obrne **na mestu** (brez nove tabele). Navedi invarianto zanke, dokaži, da je rezultat pravilen za sodo in liho dolžino, in povej, koliko zamenjav naredi. Kaj bi se zgodilo, če bi zanka tekla do $n$ namesto do $n/2$?

**Rešitev:**

1. Metoda je zanka iz razlage: za `i` od $0$ do `n / 2 - 1` zamenja `a[i]` in `a[n - 1 - i]`.
2. Invarianta: po obhodu $i$ so na mestih $0, \dots, i$ in $n - 1 - i, \dots, n - 1$ že končne (zamenjane) vrednosti, sredina pa je nespremenjena.
3. Po zadnjem obhodu ($i = \lfloor n/2\rfloor - 1$) je obdelanih $\lfloor n/2\rfloor$ parov. Pri sodem $n$ so to vsi elementi. Pri lihem ostane srednji element na indeksu $(n - 1)/2$, ki je sam sebi simetričen in mora ostati na mestu.
4. Zamenjav je $\lfloor n/2\rfloor$ (pri $n = 7$ tri).
5. Zanka do $n$: druga polovica obhodov bi vsak par zamenjal še enkrat in tabelo vrnil v prvotni vrstni red – program bi bil »pravilen« le za tabele, ki so same sebi obrnjene (dolžine $0$ ali $1$ ali simetrične, npr. $\{1, 2, 1\}$).

## Drugače: Z analogijo

**Tabela kot vrsta poštnih predalčkov.** V bloku je vrsta oštevilčenih predalčkov od $0$ naprej. Do predalčka $5$ prideš naravnost, ne da bi odprl prejšnje. Predalčkov ne moreš dodati, ne da bi zgradil novo vrsto. Spremenljivka tabele je **listek z naslovom** vrste predalčkov: če listek prepišeš (`b = a`), imata dva človeka naslov iste vrste in vsak vidi, kar drugi vrže v predalček.

**Dvodimenzionalna tabela kot parkirna hiša.** Nadstropje je prvi indeks, mesto v nadstropju drugi. V Javi ima vsako nadstropje lahko drugačno število mest (nazobčana tabela).

**Niz kot natisnjena beseda.** Natisnjene besede ne popraviš s kemičnim svinčnikom; natisneš novo. `StringBuilder` je zvezek, v katerega sproti pišeš in na koncu natisneš.

## Drugače: Uporaba v stroki

**Vreme in podnebje.** Podnebni in vremenski modeli hranijo temperaturo, tlak in vlago v tri- ali štiridimenzionalnih mrežah (višina, širina, dolžina, čas); vsak časovni korak je glajenju iz Naloge 1 podoben izračun iz sosednjih celic. Podatki se izmenjujejo v formatih (npr. NetCDF), ki mreže hranijo vrstično, kot v razlagi.

**Merilne postaje.** Postaje pošiljajo vrstice besedila, npr. `LJ;2024-07-15;31.4;0.0`. Program jih razčleni s `split`, besedilne dele preveri z `equals`, števila pretvori z `Double.parseDouble` in jih zapiše v tabele po dnevih. Napačne vrstice (prazna polja, vejica namesto pike) mora prepoznati, sicer `parseDouble` sproži izjemo.

**Slike in bioinformatika.** Satelitski posnetek je dvodimenzionalna tabela pikslov (za vsak kanal svetlobe ena), indeks vegetacije pa izračun za vsak piksel iz dveh kanalov. Zaporedja DNA so dolgi nizi, v katerih iščemo vzorce in štejemo znake, kot v Primeru 4.

## Drugače: Korak za korakom s številkami

Obrni tabelo `a = {3, 8, 1, 6, 4}` na mestu z zanko iz razlage.

1. **Dolžina in število obhodov:** $n = 5$, zanka teče za `i` od $0$ do `n / 2 - 1`; `n / 2` je pri celih številih $2$, torej obhoda `i = 0` in `i = 1`.
2. **Obhod `i = 0`:** par indeksov $0$ in $n - 1 - 0 = 4$; zamenjamo $3$ in $4$: `{4, 8, 1, 6, 3}`.
3. **Obhod `i = 1`:** par indeksov $1$ in $5 - 1 - 1 = 3$; zamenjamo $8$ in $6$: `{4, 6, 1, 8, 3}`.
4. **Srednji element:** indeks $2$ (vrednost $1$) je sam sebi simetričen in ostane.
5. **Preizkus:** obrnjena prvotna tabela je $4, 6, 1, 8, 3$. ✓
6. **Zamenjave:** $2 = \lfloor 5/2\rfloor$. Pri tabeli s $6$ elementi bi bile $3$.

## Preveri se

? Katera operacija ne sodi zraven, ker ne spremeni prvotnega objekta?
- `a[0] = 5;` za tabelo `a`
~ Prireditev elementu spremeni tabelo, na katero kaže `a`.
- `Arrays.sort(a);` za tabelo `a`
~ Urejanje preuredi elemente v isti tabeli.
+ `s.toUpperCase();` za niz `s`
- `m[1][2] = 0;` za dvodimenzionalno tabelo `m`
~ Spremeni element v vrstici `m[1]`, torej prvotno tabelo.
> Nizi so nespremenljivi: `toUpperCase()` vrne nov niz, `s` ostane enak. Tabele lahko spreminjamo na mestu.

? Koliko elementov ima tabela `new int[3][5]` in kateri je zadnji veljavni dostop?
- $15$; `m[3][5]`
~ Indeksi gredo do dolžine minus ena: največja sta $2$ in $4$.
+ $15$; `m[2][4]`
- $8$; `m[2][4]`
~ $8 = 3 + 5$; elementov je $3 \cdot 5$.
> Tri vrstice po pet elementov da $15$; veljavni indeksi so $0..2$ in $0..4$.

? Po `int[] a = {1, 2, 3}; int[] b = a; b[0] = 9;` izpišeš `a[0]`. Kaj dobiš in zakaj?
+ $9$, ker `a` in `b` kažeta na isto tabelo.
- $1$, ker je `b` kopija `a`.
~ Prireditev skopira sklic, ne tabele; kopijo bi dal `a.clone()`.
- Napako, ker sta dve imeni za isto tabelo prepovedani.
~ Več sklicev na isto tabelo je dovoljeno in pogosto; to je ravno pomen sklica.
> `b = a` kopira naslov; obe spremenljivki kažeta na isti objekt, zato je sprememba prek `b` vidna prek `a`.

? Kateri korak rešitve je napačen? Naloga: povprečje tabele `t` z $7$ elementi. (1) `double s = 0;` (2) `for (int i = 0; i <= t.length; i++) s += t[i];` (3) `double p = s / t.length;`
- korak 1
~ Seštevalnik se pravilno začne pri nič pred zanko.
+ korak 2
- korak 3
~ Ker je `s` tipa `double`, deljenje ni celoštevilsko; korak je pravilen.
> Pri `i <= t.length` zadnji obhod zahteva `t[7]`, ki ne obstaja, in sproži `ArrayIndexOutOfBoundsException`. Pravilno je `i < t.length`.

? Program za vremensko postajo prebere oznako postaje v spremenljivko `oznaka` in preverja `if (oznaka == "LJ")`. Pri testu z vpisano oznako `LJ` pogoj ni izpolnjen. Zakaj?
- Ker `==` pri nizih primerja dolžino.
~ `==` ne primerja dolžine ali vsebine, ampak ali gre za isti objekt.
+ Ker je prebrani niz nov objekt; `==` primerja sklica, vsebino pa primerja `equals`.
- Ker je treba oznako najprej pretvoriti v `char`.
~ Oznaka ima dva znaka, zato je niz; pretvorba v `char` ni mogoča in ni potrebna.
> Niz, prebran z vhoda, je nov objekt z enakimi znaki, a drugim naslovom. Pravilno: `if (oznaka.equals("LJ"))`.

:::simboli
n | dolžina tabele | | –
i | indeks (vrstica) | | –
j | indeks stolpca | | –
s | število stolpcev (ali vsota) | | –
c | števec | | –
:::
