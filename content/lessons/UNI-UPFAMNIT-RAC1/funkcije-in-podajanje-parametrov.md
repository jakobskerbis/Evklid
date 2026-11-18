---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Ta program je videti očitno pravilen, pa ni:

```java
static void povecaj(int utrip) {
    utrip = utrip + 10;
}

public static void main(String[] a) {
    int utrip = 70;
    povecaj(utrip);
    System.out.println(utrip);
}
```

Metoda se imenuje `povecaj`, v njej piše `utrip = utrip + 10`, spremenljivki imata celo enako ime. Program vseeno izpiše $70$, ne $80$.

To ni napaka Jave, ampak namen: metoda dobi **kopijo** podatka, ne podatka samega. Zato bolnišnični program lahko pokliče metodo za odmerek ali indeks telesne mase brez strahu, da bo ta prepisala pacientove podatke. Tako so veliki programi sestavljeni iz majhnih, ločeno preverljivih kosov.

## Razlaga

**1. Najprej en račun.** Indeks telesne mase (ITM) je masa v kilogramih, deljena s kvadratom višine v metrih. Za Ano z maso $60\,\text{kg}$ in višino $1{,}65\,\text{m}$:

$$\text{ITM} = \frac{60}{1{,}65^2} \approx 22{,}04$$

V programu bi to zapisali tako:

```java
double itmAna = 60 / (1.65 * 1.65);
```

Za Bora ($80\,\text{kg}$; $1{,}80\,\text{m}$) prepišemo isto vrstico z drugimi števili in dobimo $24{,}69$. Za tisoč pacientov bi imeli tisoč skoraj enakih vrstic.

**2. Posplošimo.** Med obema vrsticama se spreminjata le masa in višina. Ti dve vrednosti poimenujemo, račun pa zapišemo enkrat:

```java
static double itm(double masa,
                  double visina) {
    return masa / (visina * visina);
}
```

To je **metoda** (v drugih jezikih **funkcija**): poimenovan kos programa, ki ga lahko večkrat uporabimo. Sestavni deli:

- **glava**: `static double itm(double masa, double visina)`; `double` pred imenom je tip vrednosti, ki jo metoda vrne,
- **parametri**: `masa` in `visina`, spremenljivki, ki ob klicu dobita vrednosti,
- **telo**: blok v zavitih oklepajih,
- **`return`**: konča metodo in vrne vrednost klicatelju.

Metodo uporabimo s **klicem**, `itm(60, 1.65)`. Vrednostim v klicu rečemo **argumenti**. Prvi argument gre v prvi parameter, drugi v drugega: odloča položaj, ne ime.

Metoda, ki ničesar ne vrne, ima namesto tipa besedo `void`, tako kot `povecaj` iz uvoda. Besedo `static` za zdaj jemlji kot obvezen del glave; tudi `main`, kjer se program začne, je taka metoda.

**3. Kaj se zgodi ob klicu.** Ob klicu `itm(60, 1.65)` se zgodi tole:

1. Izračunajo se argumenti: $60$ in $1{,}65$.
2. Za vsak parameter nastane **nova** spremenljivka, ki dobi kopijo argumenta.
3. Izvede se telo. Ko pride do `return`, se vrednost vrne na mesto klica.
4. Parametri in vse spremenljivke iz telesa izginejo.

Temu pravilu rečemo **podajanje po vrednosti**. Zdaj razumeš uvod: `utrip` v metodi `povecaj` je druga spremenljivka kot `utrip` v `main`. Prišteli smo $10$ kopiji, ki je ob koncu metode izginila.

:::premisli
Kako bi spremenil metodo `povecaj` in klic, da bi `main` res izpisal $80$?
---
Metoda naj novo vrednost vrne, klicatelj pa jo shrani: `static int povecaj(int utrip) { return utrip + 10; }` in v `main` `utrip = povecaj(utrip);`. Metoda ne more spremeniti klicateljeve spremenljivke, lahko pa ji da novo vrednost, ki jo klicatelj sam priredi.
:::

**4. Doseg spremenljivk.** **Doseg** imena je del programa, v katerem je ime vidno. Spremenljivka, deklarirana v bloku, je **lokalna**: vidna je od deklaracije do konca tega bloka. Parameter je viden v celem telesu svoje metode. Vzemimo:

```java
static double itm(double masa,
                  double visina) {
    double kvadrat = visina * visina;
    return masa / kvadrat;
}

public static void main(String[] a) {
    double masa = 60;
    double r = itm(masa, 1.65);
}
```

| Ime | Kje je deklarirano | Kje je vidno |
|---|---|---|
| `masa`, `visina` | glava metode `itm` | celo telo `itm` |
| `kvadrat` | telo `itm` | od deklaracije do konca `itm` |
| `masa` | telo `main` | od deklaracije do konca `main` |
| `r` | telo `main` | od deklaracije do konca `main` |

Imeni `masa` sta dve različni spremenljivki. V `main` imena `kvadrat` ni. Enako velja za števec zanke: `i` iz `for (int i = 0; …)` obstaja le v zanki.

**5. Metoda, ki kliče sebe.** Kofein ima v telesu razpolovni čas približno $5$ ur: vsakih $5$ ur ga ostane polovica. Po štirih skodelicah kave s skupaj $400\,\text{mg}$ kofeina ga po enem razpolovnem času ostane $200\,\text{mg}$, po dveh $100\,\text{mg}$, po treh $50\,\text{mg}$.

Vsaka vrednost nastane iz prejšnje: količina po $n$ razpolovnih časih je **polovica količine po $n - 1$** razpolovnih časih. Na začetku, pri $n = 0$, je $400\,\text{mg}$. To pravilo lahko prepišemo dobesedno:

```java
static double kofein(int n) {
    if (n == 0) {
        return 400;
    }
    return kofein(n - 1) / 2;
}
```

Metoda kliče samo sebe. Temu rečemo **rekurzija**. Ima dva dela:

- **osnovni primer** (`n == 0`): odgovor je znan brez novega klica,
- **rekurzivni korak**: problem prevedemo na manjši problem iste vrste.

Klic `kofein(3)` poteka kot stopnice dol in nazaj gor:

```text
kofein(3) čaka na kofein(2)
  kofein(2) čaka na kofein(1)
    kofein(1) čaka na kofein(0)
      kofein(0) vrne 400
    kofein(1) vrne 200
  kofein(2) vrne 100
kofein(3) vrne 50
```

Vsak klic ima svoj `n`, zato se vrednosti štirih hkrati odprtih klicev ne pomešajo.

:::premisli
Kaj se zgodi ob klicu `kofein(-1)`?
---
Program se ne ustavi pravilno. Klici gredo na $-2$, $-3$, … in nikoli ne pridejo do `n == 0`. Odprtih klicev je vedno več, dokler Java ne javi napake `StackOverflowError`. Rekurzivni korak se mora vedno približati osnovnemu primeru.
:::

## Rešeni primeri

### Primer 1: klic z dvema argumentoma

Minutni volumen srca je količina krvi, ki jo srce prečrpa v eni minuti: utrip krat utripni volumen.

```java
static int minutniVolumen(int utrip,
                          int volumen) {
    return utrip * volumen;
}
```

Kaj vrne klic `minutniVolumen(72, 70)`, če je utrip v udarcih na minuto, volumen pa v mililitrih?

**Podatki:** utrip $72$ na minuto, utripni volumen $70\,\text{ml}$, metoda zgoraj
**Iščemo:** vrnjeno vrednost

:::formula
Argumenti gredo v parametre po vrsti; `return` vrne vrednost izraza.
:::

**Rešitev:**

1. Prvi argument gre v prvi parameter: `utrip` $= 72$, `volumen` $= 70$.
2. Telo izračuna $72 \cdot 70 = 5040$.
3. `return` vrne $5040$ na mesto klica.
4. Odgovor: klic vrne $5040$, torej srce prečrpa $5040\,\text{ml}$ krvi na minuto, približno $5$ litrov.

### Primer 2: dve spremenljivki z istim imenom

```java
static int odmerek(int masa) {
    int doza = masa * 10;
    masa = 0;
    return doza;
}

// v main:
int masa = 25;
int doza = 5;
int r = odmerek(masa);
System.out.println(
    masa + " " + doza + " " + r);
```

Kaj izpiše program?

**Podatki:** v `main` `masa = 25`, `doza = 5`; metoda `odmerek` zgoraj
**Iščemo:** izpis vrednosti `masa`, `doza` in `r`

:::formula
Podajanje po vrednosti: parameter je kopija argumenta. Lokalne spremenljivke metode so ločene od spremenljivk klicatelja.
:::

**Rešitev:**

1. Ob klicu nastane parameter `masa` z vrednostjo $25$, kopija spremenljivke iz `main`.
2. Lokalna `doza` v metodi dobi $25 \cdot 10 = 250$. To je druga `doza` kot tista v `main`.
3. `masa = 0` spremeni le kopijo v metodi.
4. Metoda vrne $250$, ki se shrani v `r`. Spremenljivki `masa` in `doza` v `main` sta ostali nedotaknjeni.
5. Odgovor: program izpiše `25 5 250`.

### Primer 3: rekurzija v dveh korakih

Bakterijska celica se v ugodnih razmerah razdeli na dve vsakih $20$ minut. Število celic po $n$ delitvah iz ene celice računa metoda:

```java
static int celice(int n) {
    if (n == 0) {
        return 1;
    }
    return 2 * celice(n - 1);
}
```

Koliko celic je po $2$ urah? Kolikokrat se pri tem izračunu metoda `celice` skupaj pokliče?

**Podatki:** čas $2\,\text{h} = 120\,\text{min}$, ena delitev na $20\,\text{min}$, začetek $1$ celica
**Iščemo:** vrednost `celice(n)` in število klicev

:::formula
$n = \dfrac{\text{čas}}{\text{čas ene delitve}}$, nato $\text{celice}(n) = 2 \cdot \text{celice}(n-1)$, $\text{celice}(0) = 1$
:::

**Rešitev:**

1. Najprej ugotovimo, s katerim argumentom kličemo metodo. Število delitev je $n = \dfrac{120}{20} = 6$.
2. Klici gredo navzdol: `celice(6)`, `celice(5)`, …, `celice(0)`.
3. Osnovni primer vrne $1$, nato se vrednosti vračajo navzgor in vsakič podvojijo: $1, 2, 4, 8, 16, 32, 64$.
4. Klicev je od $n = 6$ do $n = 0$, torej $6 + 1 = 7$. Osnovni primer je tudi klic.
5. Odgovor: po $2$ urah je $64$ celic; metoda se pokliče $7$-krat.

### Primer 4: zdaj ti

V čakalnici so $4$ pacienti. Na koliko načinov jih lahko razvrstimo v vrsto? Prvega izberemo na $n$ načinov, preostale pa razvrstimo kot manjši problem z $n - 1$ pacienti:

```java
static int vrstniRedi(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * vrstniRedi(n - 1);
}
```

**Podatki:** $n = 4$, metoda zgoraj
**Iščemo:** vrednost `vrstniRedi(4)`

:::formula
$\text{vrstniRedi}(n) = n \cdot \text{vrstniRedi}(n - 1)$, $\text{vrstniRedi}(1) = 1$
:::

**Rešitev:**

1. Razpišemo: `vrstniRedi(4)` $= 4 \cdot$ `vrstniRedi(3)` $= 4 \cdot 3 \cdot$ `vrstniRedi(2)`.
2. Nadaljuj do osnovnega primera in zmnoži sam, nato preveri:

:::premisli
Koliko vrne `vrstniRedi(4)`?
---
`vrstniRedi(2)` $= 2 \cdot$ `vrstniRedi(1)` $= 2 \cdot 1 = 2$. Torej $4 \cdot 3 \cdot 2 = 24$. Štiri paciente lahko razvrstimo na $24$ načinov.
:::

## Pogoste napake

- **»Metoda spremeni moj argument.«** Kdor misli, da `povecaj(utrip)` poveča `utrip` v `main`, pozablja, da parameter dobi kopijo. Popravek: če želiš novo vrednost, jo vrni z `return` in jo priredi: `utrip = povecaj(utrip);`.
- **Izpis namesto vrnitve.** Metoda z `System.out.println(rezultat)` vrednost le pokaže na zaslonu, klicatelj pa je ne dobi. Zapis `double x = itm(60, 1.65);` deluje le, če metoda uporabi `return`. Popravek: računske metode naj vračajo, izpisuje naj klicatelj.
- **Rekurzija brez konca.** Manjka osnovni primer ali pa se mu korak ne približa (na primer `kofein(n + 1)`). Klicev je vedno več in program se zruši s `StackOverflowError`. Popravek: najprej zapiši osnovni primer in preveri, da vsak klic zmanjša argument proti njemu.
- **Ime iz drugega bloka.** V `main` uporabiš `kvadrat` iz metode `itm` in prevajalnik javi, da ime ne obstaja. Lokalna spremenljivka živi le v svojem bloku. Popravek: vrednost vrni iz metode ali deklariraj spremenljivko v bloku, kjer jo potrebuješ.
- **Argumenti po imenih.** Kdor pokliče `itm(visina, masa)` in misli, da bo Java po imenih ugotovila, kaj je kaj, dobi nesmiseln rezultat brez opozorila. Popravek: argumente piši v vrstnem redu parametrov iz glave.

## Povzetek

- Metoda (funkcija) je poimenovan kos programa z glavo (tip vrnjene vrednosti, ime, parametri) in telesom; `void` pomeni, da nič ne vrne.
- Ob klicu se argumenti po vrsti kopirajo v parametre (podajanje po vrednosti); spremembe parametra ne vplivajo na klicatelja.
- `return` konča metodo in vrne vrednost na mesto klica.
- Doseg: lokalna spremenljivka je vidna od deklaracije do konca svojega bloka; enaka imena v različnih metodah so različne spremenljivke.
- Rekurzija: metoda kliče sebe na manjšem problemu; potrebuje osnovni primer in korak, ki se mu približa. Vsak klic ima svoje parametre.

## Za izpit

Znati moraš povedati:

- sestavne dele metode (glava s tipom vrnjene vrednosti, parametri, telo, `return`, `void`) in razliko med parametrom in argumentom;
- štiri korake, ki se zgodijo ob klicu metode, in kaj pomeni podajanje po vrednosti;
- kaj je doseg in kje sta vidna lokalna spremenljivka in parameter;
- kaj je rekurzija, kaj sta osnovni primer in rekurzivni korak ter kdaj se rekurzija ustavi;
- kaj je na klicnem skladu med rekurzivnimi klici in zakaj nastane `StackOverflowError`;
- dokaz pravilnosti rekurzivne metode z indukcijo (osnovni primer, indukcijski korak, ustavitev).

### Naloga 1

Dana je metoda:

```java
static int f(int n) {
    if (n <= 1) {
        return 1;
    }
    return f(n - 1) + 2 * f(n - 2);
}
```

(a) Koliko vrne klic `f(6)`? (b) Kolikokrat se pri tem metoda `f` skupaj pokliče? (c) Največ koliko okvirjev metode `f` je hkrati na klicnem skladu?

**Rešitev:**

1. Osnovna primera: $f(0) = 1$ in $f(1) = 1$.
2. Vrednosti računamo od spodaj navzgor: $f(2) = 1 + 2 \cdot 1 = 3$, $f(3) = 3 + 2 \cdot 1 = 5$, $f(4) = 5 + 2 \cdot 3 = 11$, $f(5) = 11 + 2 \cdot 5 = 21$, $f(6) = 21 + 2 \cdot 11 = 43$.
3. Število klicev označimo s $K(n)$. Klic z $n \le 1$ ne kliče naprej: $K(0) = K(1) = 1$. Za $n \ge 2$ štejemo klic sam in vse klice obeh manjših problemov: $K(n) = 1 + K(n - 1) + K(n - 2)$.
4. Dobimo $K(2) = 1 + 1 + 1 = 3$, $K(3) = 1 + 3 + 1 = 5$, $K(4) = 1 + 5 + 3 = 9$, $K(5) = 1 + 9 + 5 = 15$, $K(6) = 1 + 15 + 9 = 25$.
5. Sklad: klic `f(n - 2)` se začne šele, ko se `f(n - 1)` že vrne in je njegov okvir odstranjen. Najdaljša veriga odprtih klicev je `f(6)`, `f(5)`, `f(4)`, `f(3)`, `f(2)`, `f(1)`, torej $6$ okvirjev.
6. Odgovor: (a) `f(6)` vrne $43$; (b) metoda se pokliče $25$-krat; (c) hkrati je odprtih največ $6$ okvirjev metode `f`. Klicev je veliko več kot različnih vrednosti $n$ ($7$), ker se isti manjši problemi računajo večkrat.

### Naloga 2

Kaj izpiše program? Za vsako spremenljivko v izpisu utemelji vrednost s pravili o podajanju po vrednosti in dosegu.

```java
static int a(int x, int y) {
    x = x + y;
    y = b(x) + y;
    return x * y;
}

static int b(int x) {
    x = x - 3;
    return 2 * x;
}

public static void main(String[] args) {
    int x = 4, y = 7;
    int z = a(y, x);
    b(z);
    System.out.println(x + " " + y + " " + z);
}
```

**Rešitev:**

1. Klic `a(y, x)`: argumenta sta $7$ in $4$. Odloča položaj, ne ime, zato parameter `x` metode `a` dobi $7$, parameter `y` pa $4$.
2. V metodi `a`: `x` postane $7 + 4 = 11$.
3. Klic `b(x)`: parameter `x` metode `b` dobi kopijo $11$, postane $11 - 3 = 8$, metoda vrne $2 \cdot 8 = 16$. Spremenljivka `x` v metodi `a` ostane $11$.
4. V metodi `a`: `y` postane $16 + 4 = 20$, metoda vrne $11 \cdot 20 = 220$. Ta vrednost se shrani v `z`.
5. Klic `b(z)` vrne $2 \cdot (220 - 3) = 434$, a klicatelj vrednosti ne shrani, zato se izgubi. `z` ostane $220$, ker je metoda spreminjala le svojo kopijo.
6. Spremenljivki `x` in `y` v `main` sta drugi spremenljivki kot parametri z istim imenom v metodah `a` in `b`; nobena metoda ju ni mogla spremeniti.
7. Odgovor: program izpiše `4 7 220`.

### Naloga 3

Metoda računa potenco $a^n$ za celo število $n \ge 0$ (`n / 2` je celoštevilsko deljenje):

```java
static long potenca(long a, int n) {
    if (n == 0) {
        return 1;
    }
    long h = potenca(a, n / 2);
    if (n % 2 == 0) {
        return h * h;
    }
    return h * h * a;
}
```

(a) Dokaži z indukcijo, da metoda za vsak $n \ge 0$ vrne $a^n$, in utemelji, da se ustavi. (b) Kolikokrat se metoda pokliče pri `potenca(3, 13)` in koliko vrne? (c) Primerjaj s številom klicev metode, ki uporablja korak $a^n = a \cdot a^{n-1}$.

**Rešitev:**

1. Osnovni primer: za $n = 0$ metoda vrne $1 = a^0$.
2. Indukcijska predpostavka: metoda vrne pravilno vrednost za vse eksponente, manjše od $n$ (potrebujemo vse manjše, ne le $n - 1$, ker klic skoči na $\lfloor n/2 \rfloor$). Za $n \ge 1$ je $\lfloor n/2 \rfloor < n$, zato je $h = a^{\lfloor n/2 \rfloor}$.
3. Če je $n$ sod, je $n = 2 \lfloor n/2 \rfloor$ in metoda vrne $h \cdot h = a^{2 \lfloor n/2 \rfloor} = a^n$. Če je $n$ lih, je $n = 2 \lfloor n/2 \rfloor + 1$ in metoda vrne $h \cdot h \cdot a = a^n$. Trditev torej velja za vsak $n \ge 0$.
4. Ustavitev: za $n \ge 1$ je $0 \le \lfloor n/2 \rfloor < n$, zato se argument strogo zmanjšuje in ostane nenegativen; po končno mnogo klicih doseže osnovni primer $n = 0$.
5. Klici pri $n = 13$: eksponenti so $13 \to 6 \to 3 \to 1 \to 0$, torej $5$ klicev.
6. Vrednosti se vračajo navzgor: $1$; nato $1 \cdot 1 \cdot 3 = 3$ (za $n = 1$); $3 \cdot 3 \cdot 3 = 27$ (za $n = 3$); $27 \cdot 27 = 729$ (za $n = 6$); $729 \cdot 729 \cdot 3 = 1\,594\,323$ (za $n = 13$).
7. Metoda s korakom $a \cdot a^{n-1}$ se pokliče za $n = 13, 12, \ldots, 0$, torej $13 + 1 = 14$-krat. Na splošno potrebuje $n + 1$ klicev, metoda z razpolavljanjem pa za $n \ge 1$ le $\lfloor \log_2 n \rfloor + 2$ klicev: pri $n = 1000$ je to $11$ namesto $1001$.
8. Odgovor: metoda je pravilna in se ustavi za vsak $n \ge 0$; `potenca(3, 13)` vrne $1\,594\,323$ po $5$ klicih, preprosta rekurzija bi jih potrebovala $14$.

## Drugače: Z analogijo

Predstavljaj si, da družinska zdravnica pošlje pacienta k specialistu. Specialistu ne da originalne kartoteke, ampak **fotokopijo** izvidov. Specialist lahko po kopiji piše, original ostane nedotaknjen. To je podajanje po vrednosti. Ko specialist konča, pošlje nazaj **svoj izvid**: to je `return`. Zdravnica ga sama vloži v kartoteko, kot klicatelj z `utrip = povecaj(utrip);`.

Vsaka ambulanta ima svoj predal. Mapa z imenom »masa« v predalu kardiologa in mapa »masa« v predalu družinske zdravnice sta dve različni mapi. To je doseg.

Rekurzija je kot veriga posvetov: vsak zdravnik vpraša kolega o nekoliko lažjem primeru, dokler zadnji ne ve odgovora sam. Nato gredo odgovori po verigi nazaj, vsak doda svoj del.

## Drugače: Bolj natančno

**Klicni sklad.** Ob vsakem klicu Java na **sklad** položi **okvir**, v katerem so parametri, lokalne spremenljivke in mesto vrnitve. Ob `return` se okvir odstrani. Pri `kofein(3)` so na skladu hkrati štirje okviri, vsak s svojim `n`. Sklad je omejen, zato zelo globoka rekurzija povzroči `StackOverflowError` tudi pri pravilnem algoritmu; takrat jo prepišemo v zanko.

**Vedno po vrednosti.** Java vse argumente podaja po vrednosti. Pri tabelah in objektih (spoznal jih boš v naslednjih poglavjih) je vrednost spremenljivke **referenca**, torej naslov podatkov. Kopira se naslov, zato metoda lahko spremeni vsebino tabele, ne more pa klicateljeve spremenljivke preusmeriti na drugo tabelo.

**Pravilnost rekurzije z indukcijo.** Trdimo: za vsak $n \ge 0$ velja $\text{kofein}(n) = \dfrac{400}{2^n}$.

- Osnovni primer: $\text{kofein}(0) = 400 = \dfrac{400}{2^0}$.
- Indukcijski korak: če velja $\text{kofein}(n-1) = \dfrac{400}{2^{n-1}}$, potem metoda vrne $\dfrac{400}{2^{n-1}} : 2 = \dfrac{400}{2^n}$.

Še ustavitev: za $n \ge 0$ se argument vsakič zmanjša za $1$, zato po $n$ korakih doseže $0$. Za $n < 0$ se metoda ne ustavi, zato bi pravilna metoda negativne argumente zavrnila.

## Preveri se

? V klicu `itm(80, 1.8)` sta `80` in `1.8` …
- parametra metode
~ Parametra sta imeni v glavi metode (`masa`, `visina`). Vrednosti v klicu so nekaj drugega.
+ argumenta, katerih kopiji dobita parametra `masa` in `visina`
- lokalni spremenljivki metode `main`
~ To sta zapisani vrednosti, ne poimenovani spremenljivki; nikjer nista deklarirani.
- vrednosti, ki ju metoda vrne
~ Metoda vrne en rezultat z `return`, ta dva podatka pa ji klicatelj šele da.
> Vrednosti v klicu so argumenti. Ob klicu se po vrsti kopirajo v parametre iz glave.

? Pri klicu `kofein(2)` se odpre več klicev. V kakšnem vrstnem redu ti klici **vrnejo** svoj rezultat?
- `kofein(2)`, `kofein(1)`, `kofein(0)`
~ To je vrstni red, v katerem se klici začnejo. Vrniti pa se ne morejo, preden dobijo odgovor manjšega klica.
+ `kofein(0)`, `kofein(1)`, `kofein(2)`
- `kofein(2)`, `kofein(0)`, `kofein(1)`
~ `kofein(2)` potrebuje rezultat `kofein(1)`, zato ne more vrniti prvi.
> Prvi vrne osnovni primer, nato vsak klic dokonča svoj račun z rezultatom manjšega klica: zadnji začeti je prvi končani.

? Kaj se zgodi, če namesto `itm(60, 1.65)` pokličemo `itm(1.65, 60)`?
- Java po imenih parametrov ugotovi pravi vrstni red in vrne $22{,}04$.
~ Argumenti nimajo imen; v parametre gredo po položaju.
- Prevajalnik javi napako, ker se argumenta ne ujemata.
~ Oba argumenta sta števili, ki ju Java sprejme kot `double` (celo število $60$ samodejno pretvori), zato prevajalnik nima česa javiti.
+ Program teče brez napake, a vrne nesmiselno majhno število.
> `masa` dobi $1{,}65$, `visina` pa $60$, zato je rezultat $\frac{1{,}65}{3600} \approx 0{,}00046$. Vrstni red argumentov je pomemben, napake pa računalnik ne opazi.

? Imamo `static int f(int x) { x = x * 2; return x + 1; }`. V `main` napišemo `int a = 5; int b = f(a);`. Koliko sta `a` in `b`?
- `a` je $10$, `b` je $11$
~ `x = x * 2` spremeni le kopijo v metodi; `a` v `main` ostane $5$.
- `a` je $5$, `b` je $10$
~ Metoda vrne `x + 1`, ne le podvojenega `x`.
+ `a` je $5$, `b` je $11$
- `a` je $11$, `b` je $11$
~ Vrnjena vrednost gre v `b`, ne nazaj v argument `a`.
> Parameter `x` dobi kopijo $5$, se podvoji v $10$, metoda vrne $11$. Spremenljivka `a` ostane $5$.

? Koliko vrne `kofein(4)` z metodo iz razlage (začetnih $400\,\text{mg}$, vsak korak razpolovi)?
- $50$
~ To je `kofein(3)`: en razpolovni čas premalo.
- $100$
~ To je $400 : 4$. Vsak korak deli z $2$, zato po štirih korakih deliš z $2^4$.
+ $25$
- $12{,}5$
~ Osnovni primer `kofein(0)` vrne $400$ brez razpolavljanja; tu je en razpolovni čas preveč.
> $400 \to 200 \to 100 \to 50 \to 25$: $\frac{400}{2^4} = 25\,\text{mg}$.

:::simboli
n | argument rekurzivne metode: število razpolovnih časov ali delitev, v primeru 4 število pacientov | n = \frac{\text{čas}}{\text{čas ene delitve}} | – | celice(n) = 2 · celice(n − 1)
:::
