---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ko sta Ken Thompson in Dennis Ritchie v Bellovih laboratorijih razvijala operacijski sistem Unix, so bile prve različice napisane v zbirnem jeziku, ki ga razume le ena vrsta procesorja. Za vsak nov računalnik bi morali sistem napisati znova. Potrebovali so jezik, ki je blizu strojni opremi in hiter kot zbirnik, a ga je mogoče prevesti za različne stroje. Ritchie je zato razvil jezik **C** in z njim so Unix na novo napisali.

Ta odločitev živi še danes. Jedro Linuxa, nad katerim teče tvoja ukazna lupina, je večinoma v C. V C so napisani tudi deli igralnih pogonov in programi v pametnih urah, ki štejejo korake med tekom. Ko razumeš C, razumeš, kaj se dogaja »pod pokrovom« jezikov, ki si jih spoznal pri vrstah programskih jezikov.

## Razlaga

Pri vsakem koščku začnemo z mislijo, ki se ponuja, ker poznaš bash, in jo popravimo.

**1. »Program napišem in ga poženem kot skripto.«** Pri bashu napišeš `igra.sh`, dodaš `chmod +x` in poženeš `./igra.sh`; lupina bere ukaze vrstico za vrstico. C je **prevajan** jezik: izvorne kode `igra.c` procesor ne razume. Najprej jo **prevajalnik** `gcc` pretvori v strojno kodo in nastane **izvedljiva datoteka**:

```
igra.c ──(predprocesor: #include)──(prevajalnik)──(povezovalnik)──► igra
 besedilo                                                        strojna koda
```

```bash
gcc -Wall -o igra igra.c   # prevedi; -Wall vklopi opozorila
./igra                     # poženi izvedljivo datoteko
```

Predprocesor v besedilo vstavi vsebino datotek iz `#include`, prevajalnik ga pretvori v strojno kodo, povezovalnik pa doda že prevedeno kodo knjižnic, npr. funkcije `printf`. Vse tri korake opravi en ukaz `gcc`.

Najmanjši program:

```c
#include <stdio.h>

int main(void) {
    printf("Začni tekmo!\n");
    return 0;
}
```

`#include <stdio.h>` doda opis funkcije `printf`. Izvajanje se vedno začne v funkciji `main`. `return 0` vrne lupini status $0$, ki pomeni »uspeh«, tako kot pri ukazih v bashu.

**Napaka in opozorilo.** Če manjka podpičje, `gcc` javi *napako* in izvedljive datoteke ne naredi. *Opozorilo* (*warning*) datoteko naredi, a pogosto kaže na pravo napako, zato ga beri.

:::premisli
V `igra.c` zamenjaš besedilo v `printf` z »Konec tekme!«, shraniš in takoj poženeš `./igra`. Kaj se izpiše? Zakaj?
---
Še vedno »Začni tekmo!«. `./igra` je stara izvedljiva datoteka; sprememba v `igra.c` nanjo ne vpliva, dokler znova ne poženeš `gcc`.
:::

**2. »Spremenljivka je kar ime z vrednostjo.«** V bashu napišeš `tocke=5` in vse je niz. V C ima vsaka spremenljivka **tip**, ki ga napoveš ob **deklaraciji**, preden jo uporabiš. Tip določi, koliko pomnilnika zasede in kaj lahko hrani:

| tip | hrani | primer | v `printf` |
|---|---|---|---|
| `int` | cela števila | `int gol = 3;` | `%d` |
| `double` | realna števila | `double cas = 9.58;` | `%f`, `%.2f` |
| `char` | en znak | `char ekipa = 'A';` | `%c` |

V kodi C se decimalke pišejo s piko (`9.58`). Spremenljivka, deklarirana v funkciji (**lokalna**), brez začetne vrednosti ne vsebuje $0$, ampak naključni ostanek v pomnilniku.

Pri deljenju dveh `int` C zavrže decimalni del: `7 / 2` je `3`, ostanek dobiš z `7 % 2`, kar je `1`. Če je vsaj en operand `double`, je rezultat realen: `7.0 / 2` je `3.5`.

:::premisli
Košarkar je v $2$ tekmah dosegel $7$ košev. Napišemo `int k = 7, t = 2; double povp = k / t;`. Napovej vrednost `povp`.
---
`3.0`, ne `3.5`. Deljenje `k / t` se izvede med dvema `int`, rezultat `3` se šele nato pretvori v `double`. Pravilno je `(double) k / t`.
:::

**3. »Zanka se ponovi tolikokrat, kot piše zgornja meja.«** Zanka `for` ima tri dele: začetek, pogoj in korak.

```c
for (int krog = 1; krog <= 5; krog++) {
    printf("Krog %d\n", krog);
}
```

Najprej se izvede `krog = 1`. Pred vsakim obhodom se preveri pogoj, po vsakem obhodu se izvede `krog++` (kratko za `krog = krog + 1`; `krog += 2` pomeni `krog = krog + 2`). Število obhodov je odvisno od vseh treh delov: pri `krog < 5` bi bili obhodi le $4$, pri koraku `krog += 2` pa $3$. Zanka `while (pogoj) { … }` ponavlja, dokler pogoj velja, npr. dokler ima igralec še življenja.

**4. »Funkcija spremeni spremenljivko, ki ji jo podam.«** **Funkcija** je poimenovan kos kode s **parametri** in **vrnjeno vrednostjo**:

```c
int tocke(int dvojke, int trojke, int prosti) {
    return 2 * dvojke + 3 * trojke + prosti;
}
```

Pred imenom je tip vrnjene vrednosti (`void`, če funkcija ne vrne nič). C podaja argumente **po vrednosti**: funkcija dobi kopijo. Če v funkciji spremeniš parameter, se spremenljivka v `main` ne spremeni. Rezultat dobiš nazaj z `return`. Funkcija mora biti znana pred klicem: napišeš jo nad `main` ali nad `main` daš njen **prototip**, npr. `int tocke(int, int, int);`.

## Rešeni primeri

### Primer 1: točke košarkarja

Košarkar je na tekmi zadel $4$ mete za dve točki, $3$ mete za tri točke in $5$ prostih metov. Program `kos.c` naj izpiše njegove točke.

```c
#include <stdio.h>

int main(void) {
    int dvojke = 4, trojke = 3, prosti = 5;
    int tocke = 2 * dvojke + 3 * trojke + prosti;
    printf("Točke: %d\n", tocke);
    return 0;
}
```

**Podatki:** $4$ dvojke, $3$ trojke, $5$ prostih metov (prosti met je $1$ točka); izvorna datoteka `kos.c`
**Iščemo:** ukaza za prevajanje in zagon ter izpis programa

:::formula
`gcc -Wall -o ime ime.c`, nato `./ime`; točke $= 2 \cdot \text{dvojke} + 3 \cdot \text{trojke} + 1 \cdot \text{prosti}$
:::

**Rešitev:**

1. Prevedemo: `gcc -Wall -o kos kos.c`. Nastane izvedljiva datoteka `kos`.
2. Poženemo: `./kos`.
3. Program izračuna $2 \cdot 4 + 3 \cdot 3 + 1 \cdot 5 = 22$.
4. `printf` na mesto `%d` vstavi vrednost `tocke`.
5. Odgovor: z ukazoma `gcc -Wall -o kos kos.c` in `./kos` dobimo izpis `Točke: 22`.

### Primer 2: točke po stopnjah igre

V igri prineseta stopnja $1$ $10$ točk, stopnja $2$ $20$ točk in tako naprej: stopnja $i$ prinese $10 \cdot i$ točk. Igralec preigra stopnje od $1$ do $5$.

```c
int skupaj = 0;
for (int i = 1; i <= 5; i++) {
    skupaj = skupaj + 10 * i;
}
printf("%d\n", skupaj);
```

**Podatki:** stopnje $i = 1, \dots, 5$; stopnja $i$ prinese $10 \cdot i$ točk; začetno `skupaj = 0`
**Iščemo:** izpis programa

:::formula
V vsakem obhodu: novi `skupaj` $=$ stari `skupaj` $+ 10 \cdot i$
:::

**Rešitev:** Sledimo zanki v tabeli (vrednost `skupaj` po obhodu).

| `i` | prišteto | `skupaj` |
|---|---|---|
| 1 | 10 | 10 |
| 2 | 20 | 30 |
| 3 | 30 | 60 |
| 4 | 40 | 100 |
| 5 | 50 | 150 |

1. `skupaj` začne pri $0$; brez te začetne vrednosti bi bil rezultat naključen.
2. Zadnji obhod: $100 + 50 = 150$.
3. Ko je `i` enak $6$, pogoj `i <= 5` ne velja in zanka se konča.
4. Odgovor: program izpiše `150`.

### Primer 3: povprečje na tekmo, popravi napako

Nogometaš je v štirih tekmah sezone igral $18$, $25$, $21$ in $30$ minut. Sošolec je napisal funkcijo, a izpiše `23.0` namesto pričakovanega `23.5`. Najdi napako in jo popravi.

```c
double povprecje(int vsota, int n) {
    return vsota / n;
}
/* v main: */
printf("%.1f\n", povprecje(18 + 25 + 21 + 30, 4));
```

**Podatki:** minute $18$, $25$, $21$, $30$; število tekem $n = 4$; izpis `23.0`
**Iščemo:** vzrok napake, popravljeno funkcijo in pravilen izpis

:::formula
Povprečje $= \dfrac{\text{vsota}}{n}$; deljenje dveh `int` zavrže decimalni del, zato vsaj en operand pretvorimo v `double`.
:::

**Rešitev:**

1. Vsota: $18 + 25 + 21 + 30 = 94$.
2. V funkciji sta `vsota` in `n` tipa `int`, zato `94 / 4` da celo število `23`. Šele `return` ga pretvori v `23.0`.
3. Popravek: `return (double) vsota / n;`. Zdaj je deljenec realen.
4. Pravilno: $\dfrac{94}{4} = 23{,}5$.
5. Odgovor: krivo je celoštevilsko deljenje; s pretvorbo `(double)` program izpiše `23.5`.

### Primer 4: zdaj ti

V igri dobi igralec ob zmagi $50$ bonus točk. Programer napiše:

```c
void dodaj_bonus(int t) {
    t = t + 50;
}
/* v main: */
int tocke = 120;
dodaj_bonus(tocke);
printf("%d\n", tocke);
```

**Podatki:** `tocke = 120`; bonus $50$ točk; funkcija `dodaj_bonus` s parametrom `int t`
**Iščemo:** kaj program izpiše in kako ga popravimo, da izpiše vsoto z bonusom

:::formula
C podaja argumente po vrednosti: funkcija dela s kopijo. Rezultat vrneš z `return`.
:::

**Rešitev:**

1. Ob klicu se v `t` skopira vrednost $120$.
2. V funkciji je $t = 120 + 50 = 170$, a to je le kopija, ki ob koncu funkcije izgine.
3. Dokončaj sam: kaj izpiše `printf` in kako funkcijo popraviš?

:::premisli
Kaj izpiše program in kakšen je popravek?
---
Izpiše `120`, ker se `tocke` v `main` ni spremenila. Popravek: `int dodaj_bonus(int t) { return t + 50; }` in v `main` `tocke = dodaj_bonus(tocke);`. Nato izpiše `170`.
:::

## Pogoste napake

- **Sprememba brez ponovnega prevajanja.** Urediš `igra.c` in poženeš staro `./igra`. Vsaka sprememba izvorne kode zahteva nov `gcc`.
- **Celoštevilsko deljenje.** `int` deljeno z `int` je `int`: `7 / 2` je `3`. Tudi če rezultat shraniš v `double`, je decimalni del že izgubljen. Pretvori operand: `(double) a / b`.
- **Spremenljivka brez začetne vrednosti.** `int vsota;` nato `vsota += x;` v zanki daje naključne rezultate. Napiši `int vsota = 0;`.
- **`=` namesto `==` v pogoju.** `if (zivljenja = 0)` vrednost priredi, pogoj je vedno neresničen. Za primerjavo piši `==`; `-Wall` na to opozori.
- **Funkcija spremeni argument.** Parametri so kopije; spremembo vrneš z `return` in jo priredi spremenljivki v klicoči funkciji.

## Povzetek

- C je prevajan jezik: `gcc -Wall -o prog prog.c` naredi izvedljivo datoteko, `./prog` jo požene; po vsaki spremembi znova prevedi.
- Program se začne v `int main(void)`; `return 0` vrne lupini status uspeha.
- Spremenljivke imajo tip (`int`, `double`, `char`), ki ga napoveš ob deklaraciji; začetno vrednost nastavi sam.
- `int / int` zavrže decimalke; `%` da ostanek; za realen rezultat uporabi `double`.
- `for (začetek; pogoj; korak)` in `while (pogoj)`; število obhodov preveri na mejnih vrednostih.
- Funkcija ima tip vrnjene vrednosti in parametre; argumenti se podajo po vrednosti, rezultat vrne `return`.

## Za izpit

Znati moraš povedati:

- korake od izvorne do izvedljive datoteke (predprocesor, prevajalnik, povezovalnik) ter razliko med napako in opozorilom;
- kaj določa tip spremenljivke, kaj vsebuje lokalna spremenljivka brez začetne vrednosti in kako C deli dva `int`;
- kako se izvaja zanka `for` (začetek, pogoj, korak) in kako prešteješ obhode;
- kaj pomeni podajanje argumentov po vrednosti in čemu služi prototip funkcije.

### Naloga 1

Program `izpit.c`:

```c
#include <stdio.h>

int polovica(int x) {
    x = x / 2;
    return x;
}

int main(void) {
    int n = 9, vsota = 0;
    for (int i = 1; i <= n; i += 3) {
        vsota += polovica(i) + i % 2;
    }
    double p = vsota / 2;
    printf("%d %d %.1f\n", n, vsota, p);
    return 0;
}
```

(a) Kolikokrat se izvede telo zanke in katere vrednosti zavzame `i`? (b) Kaj program izpiše? (c) Popravi eno vrstico, da bo `p` prava polovica vsote, in navedi nov izpis.

**Rešitev:**

1. (a) `i` zavzame vrednosti $1$, $4$, $7$; pri $10$ pogoj `i <= 9` ne velja. Telo se izvede $3$-krat.
2. Obhod `i = 1`: `polovica(1)` vrne $0$ (celoštevilsko deljenje), `1 % 2` je $1$; `vsota` je $0 + 0 + 1 = 1$.
3. Obhod `i = 4`: `polovica(4)` vrne $2$, `4 % 2` je $0$; `vsota` je $1 + 2 + 0 = 3$.
4. Obhod `i = 7`: `polovica(7)` vrne $3$, `7 % 2` je $1$; `vsota` je $3 + 3 + 1 = 7$.
5. Funkcija `polovica` spreminja le svoj parameter `x`, ki je kopija; `i` v `main` ostane nespremenjen, zato zanka teče po korakih $3$.
6. `vsota / 2` je deljenje dveh `int`: `7 / 2` je `3`, ki se nato pretvori v `3.0`.
7. (b) Izpis: `9 7 3.0`.
8. (c) `double p = (double) vsota / 2;` ali `double p = vsota / 2.0;`. Nov izpis: `9 7 3.5`.

### Naloga 2

Pojasni, kaj pomeni, da C podaja argumente po vrednosti. Utemelji, zakaj klic `podvoji(a);` funkcije `void podvoji(int x) { x = 2 * x; }` ne spremeni spremenljivke `a`, in funkcijo popravi. Opiši še, zakaj se popravek v izvorni datoteki pokaže šele po ponovnem prevajanju.

**Rešitev:**

1. Ob klicu se vrednost argumenta skopira v parameter. Parameter je lokalna spremenljivka funkcije z lastnim prostorom v pomnilniku.
2. Pri `podvoji(a);` dobi `x` kopijo vrednosti `a`. Prireditev `x = 2 * x` spremeni le `x`; ko se funkcija konča, `x` izgine, `a` pa ostane enak.
3. Popravek: funkcija naj novo vrednost vrne, `int podvoji(int x) { return 2 * x; }`, klic pa naj jo priredi: `a = podvoji(a);`.
4. Tip vrnjene vrednosti se je spremenil iz `void` v `int`; če je nad `main` prototip, ga je treba popraviti enako.
5. Procesor izvaja strojno kodo v izvedljivi datoteki, ne izvorne kode. Izvedljiva datoteka nastane ob prevajanju in se ob urejanju izvorne datoteke ne spremeni, zato je po vsakem popravku potreben nov `gcc`.

## Drugače: Kot zgodba

Maja razvija preprosto igro s točkami. Zjutraj v urejevalniku napiše `igra.c`, vtipka `./igra.c` in lupina zagon zavrne (`Permission denied`): besedilo C ni skripta, ki bi jo lupina znala izvesti. Spomni se, da mora program najprej prevesti, zato požene `gcc -Wall -o igra igra.c`. Prevajalnik javi napako v vrstici $12$: manjka podpičje. Popravi ga, prevede znova in dobi datoteko `igra`.

Igra deluje, a povprečje točk je vedno okroglo število. Maja opazi, da deli dva `int`, in doda `(double)`. Zažene `./igra`: povprečje je še vedno okroglo. Šele ko spet požene `gcc`, se popravek pokaže. Popoldne napiše funkcijo za bonus točke; ta jih »doda«, a rezultat se ne spremeni. Funkcija je delala s kopijo, zato jo prepiše tako, da vrača novo vrednost. Zvečer ima Maja delujočo igro in štiri pravila, ki jih ne bo več pozabila.

## Drugače: Korak za korakom s številkami

Sledimo programu, ki sešteje kvadrate števil od $1$ do $4$ (npr. točke za zaporedne zadetke v pikadu):

```c
int vsota = 0;
for (int i = 1; i <= 4; i++) {
    vsota += i * i;
}
```

1. Začetek: `vsota` je $0$, `i` je $1$. Pogoj $1 \le 4$ velja.
2. Obhod 1: prišteje $1 \cdot 1 = 1$, `vsota` je $1$; `i` postane $2$.
3. Obhod 2: prišteje $2 \cdot 2 = 4$, `vsota` je $1 + 4 = 5$; `i` postane $3$.
4. Obhod 3: prišteje $3 \cdot 3 = 9$, `vsota` je $5 + 9 = 14$; `i` postane $4$.
5. Obhod 4: prišteje $4 \cdot 4 = 16$, `vsota` je $14 + 16 = 30$; `i` postane $5$.
6. Pogoj $5 \le 4$ ne velja, zanka se konča. Obhodov je bilo $4$, `vsota` je $30$.

Enako sledenje uporabi pri funkciji: zapiši vrednost vsakega parametra ob klicu in vrednost, ki jo vrne `return`.

## Preveri se

? Kateri od teh tipov **ni** vgrajen osnovni tip v jeziku C?
- `int`
~ `int` je osnovni tip za cela števila.
- `double`
~ `double` je osnovni tip za realna števila.
+ `string`
- `char`
~ `char` je osnovni tip za en znak.
> C nima tipa `string`; niz je tabela znakov `char`, ki jo spoznaš kasneje.

? Kolikokrat se izvede telo zanke `for (int i = 0; i <= 10; i += 2)`?
- $5$
~ Pozabil si na obhod pri `i = 0` ali pri `i = 10`; pogoj `<=` vključi oba konca.
- $10$
~ To je le razlika mej $10 - 0$. Štej vrednosti, ki jih `i` zavzame: korak $2$ preskoči liha števila, oba konca pa sta vključena.
+ $6$
- $11$
~ To bi veljalo za korak `i++`. Tu se `i` vsakič poveča za $2$.
> `i` zavzame vrednosti $0, 2, 4, 6, 8, 10$, torej $6$ obhodov.

? Popravil si napako v `tekma.c`, shranil datoteko in pognal `./tekma`. Program se obnaša enako kot pred popravkom. Kaj je vzrok?
+ Nisi znova prevedel; `./tekma` je še stara izvedljiva datoteka.
- Datoteka `tekma.c` nima pravice za izvajanje (`chmod +x`).
~ `tekma.c` se ne izvaja, izvaja se `tekma`; pravice izvorne datoteke niso pomembne.
- Prevajalnik si zapomni prvo različico kode.
~ `gcc` nič ne pomni; vsakič prevede tisto, kar je v datoteki. Le pognati ga moraš.
> Med izvorno in izvedljivo datoteko je korak prevajanja; brez njega popravek ne pride v program.

? Rešitev naloge »povprečje golov na tekmo, $9$ golov v $4$ tekmah«: (1) `int goli = 9, tekme = 4;` (2) `double p = goli / tekme;` (3) `printf("%.2f", p);` izpiše `2.25`. Kateri korak je napačen?
- Korak (1): goli morajo biti `double`.
~ Gole je smiselno hraniti kot `int`; težava je šele pri deljenju.
+ Korak (2): `goli / tekme` je celoštevilsko deljenje, zato je `p` enak `2.0` in izpis `2.00`.
- Korak (3): `%.2f` ni primeren za `double`.
~ `%.2f` je pravi format za `double` z dvema decimalkama.
> Popravek: `double p = (double) goli / tekme;`, nato izpis `2.25`.

? Na semaforju za odbojko pokličeš `void tocka(int rezultat) { rezultat++; }` z `tocka(domaci);`, a rezultat domačih na zaslonu ostane enak. Zakaj?
- Ker `++` v funkciji ne deluje.
~ `++` deluje, a poveča le lokalno kopijo `rezultat`.
- Ker manjka `return 0;`.
~ Funkcija tipa `void` ne vrača vrednosti; `return 0` tu ne bi pomagal.
+ Ker funkcija dobi kopijo vrednosti `domaci` in poveča le kopijo.
> Argumenti se v C podajo po vrednosti. Popravek: `int tocka(int r) { return r + 1; }` in `domaci = tocka(domaci);`.

:::simboli
i | številka stopnje | | – | stopnja i prinese 10 · i točk
n | število tekem | | –
:::
