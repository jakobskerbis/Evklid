---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Spletna trgovina ima navadne in akcijske izdelke. Akcijski je za $20\,\%$ cenejši. Preden bereš naprej, ugani, kaj izpiše zadnja vrstica.

```java
class Izdelek {
  double osnova;
  Izdelek(double o) { osnova = o; }
  double cena() { return osnova; }
}
class Akcijski extends Izdelek {
  Akcijski(double o) { super(o); }
  double cena() {
    return 0.8 * osnova;
  }
}

Izdelek i = new Akcijski(100);
System.out.println(i.cena());
```

Spremenljivka `i` je tipa `Izdelek`, zato bi pričakovali `100.0`. Program izpiše `80.0`. Java ne vpraša, kakšnega tipa je *spremenljivka*, ampak kakšen je *objekt*, na katerega kaže. Temu pravimo **polimorfizem**. Zaradi njega lahko trgovina vse izdelke hrani v eni tabeli `Izdelek[]` in v isti zanki sešteje košarico, čeprav vsaka vrsta izdelka ceno računa po svoje.

Razrede, objekte, konstruktorje in metode že poznaš. Zdaj jih bomo povezali v **hierarhijo**.

## Razlaga

**1. Razred proti podrazredu.** Doslej je vsak razred stal sam zase: polja, konstruktor, metode. Pri **dedovanju** novi razred ne začne iz nič, ampak iz obstoječega.

**Definicija.** Z `class B extends A` je `B` **podrazred** (izpeljani razred), `A` pa **nadrazred** razreda `B`. `B` podeduje polja in metode razreda `A`, razen zasebnih (`private`): ta so v objektu sicer prisotna, a jih `B` ne vidi in se po specifikaciji Jave ne dedujejo. `B` lahko doda nove člane ali prekrije podedovane metode. Java dovoli natanko en neposredni nadrazred; vsak razred brez `extends` deduje od `Object`.

Dedovanje opisuje razmerje **»je«**: akcijski izdelek *je* izdelek. Če razmerje ni »je« (košarica *ima* izdelke), uporabimo polje, ne dedovanje.

Razlike glede na navaden razred:

- **Konstruktorji se ne dedujejo.** Prvi stavek konstruktorja podrazreda je `super(...)`, klic konstruktorja nadrazreda. Če ga ne napišemo, Java vstavi `super()` brez argumentov; če nadrazred takega nima, se program ne prevede.
- **Vrstni red ob `new B(...)`:** vsa polja dobijo privzete vrednosti ($0$, `false`, `null`); nato se izvede konstruktor nadrazreda; šele po vrnitvi iz `super(...)` se izvedejo inicializacije polj podrazreda (`double x = 0.02;`), nazadnje preostanek konstruktorja `B`.
- **`super.metoda()`** pokliče različico iz nadrazreda, tudi če jo podrazred spremeni.
- **`protected`** dostop dovoli uporabo v podrazredih (in v istem paketu).

**2. Prekrivanje metod.**

**Definicija.** Podrazred **prekrije** (*override*) metodo nadrazreda, če definira metodo z **enakim imenom in enakimi tipi parametrov**. Vrnjeni tip mora biti enak ali podtip, dostop ne sme biti ožji (javne ne moremo narediti zasebne). Metode, ki je v nadrazredu `private`, `static` ali `final`, ni mogoče prekriti. Oznaka `@Override` prevajalniku naroči, naj preveri, ali res prekrivamo.

Prekrivanje primerjajmo s **preobteževanjem** (*overload*), ki ga že poznaš: ista imena, a **različni** tipi ali število parametrov.

- **Preobteževanje:** parametri različni; različico izbere prevajalnik po statičnih tipih.
- **Prekrivanje:** parametri enaki; različico izbere izvajanje po dinamičnem tipu objekta.

**3. Statični in dinamični tip.** V `Izdelek i = new Akcijski(100);` je **statični tip** spremenljivke `Izdelek` (zapisan v kodi, pozna ga prevajalnik), **dinamični tip** objekta pa `Akcijski` (nastane ob izvajanju). Prireditev podrazreda spremenljivki nadrazreda je vedno dovoljena (*pretvorba navzgor*).

**Pravilo (dinamično povezovanje).** Klic `x.m(argumenti)` se izvede v dveh korakih:

1. **prevajalnik** v razredu *statičnega* tipa `x` poišče metodo `m`, ki ustreza statičnim tipom argumentov, in si zapomni njen **podpis** (ime in tipe parametrov); če je ni, je napaka pri prevajanju;
2. **ob izvajanju** se izvede tista različica s tem podpisom, ki je najbližja *dinamičnemu* tipu `x` (če jo podrazred prekrije, njegova).

Polja in statične metode se ne povezujejo dinamično: zanje velja statični tip.

:::premisli
Razred `Akcijski` doda še metodo `double prihranek()`. Ali se `i.prihranek()` za `Izdelek i = new Akcijski(100)` prevede? Zakaj?
---
Ne. Prevajalnik išče metodo v statičnem tipu `Izdelek`, ki je nima. Pomaga pretvorba navzdol: `((Akcijski) i).prihranek()`.
:::

**4. Pretvorba navzdol.** `(Akcijski) i` prevajalniku obljubi, da `i` kaže na `Akcijski`. Če obljuba ob izvajanju ne drži, Java vrže `ClassCastException`. Varno: najprej preveri z `if (i instanceof Akcijski)`.

**5. Abstraktni razredi.** Včasih nadrazred ne zna izračunati metode, ki jo morajo imeti vsi podrazredi. Kakšen je donos »naložbe na splošno«? Odvisno od vrste.

**Definicija.** **Abstraktna metoda** ima glavo brez telesa, `abstract double donos(int leta);`. Razred z vsaj eno abstraktno metodo mora biti **abstrakten** (`abstract class`). Abstraktnega razreda ne moremo instancirati (`new Nalozba()` je napaka), lahko pa ima polja, konstruktorje in običajne metode. Podrazred, ki ni abstrakten, mora prekriti vse abstraktne metode.

**6. Vmesniki.**

**Definicija.** **Vmesnik** (`interface`) našteje metode, ki jih mora imeti razred, ki ga **implementira** (`class C implements I`). Metode vmesnika so javne in abstraktne, razen tistih z oznako `default` (imajo telo) ali `static`; od Jave 9 so dovoljene še zasebne pomožne metode s telesom. Vmesnik nima konstruktorjev in nima polj objektov (le konstante). Razred lahko implementira **več** vmesnikov, deduje pa le od enega razreda.

Kdaj kaj? Abstraktni razred, ko podrazredi delijo stanje in del kode (vse naložbe imajo `znesek`). Vmesnik, ko nepovezanim razredom damo skupno zmožnost (izdelek in storitev sta obdavčljiva, nista pa ista vrsta stvari).

:::premisli
Zakaj Java dovoli implementirati več vmesnikov, dedovati pa le od enega razreda?
---
Razreda s poljem ali metodo z istim imenom bi dala dvoumno stanje in kodo (kateri `znesek`?). Vmesnik stanja nima, abstraktne metode pa se ne prepirajo: razred jih napiše enkrat. Pri dveh enakih `default` metodah mora razred konflikt razrešiti sam s prekrivanjem.
:::

## Rešeni primeri

### Primer 1 (lažji)

Kaj izpiše program?

```java
class Racun {
  String opis() { return "račun"; }
}
class Varcevalni extends Racun {
  @Override
  String opis() {
    return "varčevalni " + super.opis();
  }
}

Racun r = new Varcevalni();
System.out.println(r.opis());
```

**Podatki:** razred `Racun` z metodo `opis()`, podrazred `Varcevalni`, ki jo prekrije in pokliče `super.opis()`; spremenljivka tipa `Racun` kaže na objekt `Varcevalni`
**Iščemo:** izpis programa

:::formula
Dinamično povezovanje: izvede se različica, ki ustreza dinamičnemu tipu; `super.m()` pokliče različico nadrazreda.
:::

**Rešitev:**

1. Prevajalnik v `Racun` najde `opis()`; klic se prevede.
2. Dinamični tip je `Varcevalni`, ki `opis()` prekrije, zato se izvede njegova različica.
3. `super.opis()` vrne `"račun"`, metoda vrne `"varčevalni račun"`.
4. Odgovor: program izpiše `varčevalni račun`.

### Primer 2

Abstraktni razred `Nalozba` ima polje `znesek` in abstraktno metodo `donos(int leta)`. `Varcevanje` obrestuje z obrestnimi obrestmi, `Obveznica` daje vsako leto enak kupon. Koliko je skupni donos portfelja po $5$ letih, če ima $10\,000$ € v varčevanju po $3\,\%$ in $5000$ € v obveznici s kuponom $4\,\%$?

```java
abstract class Nalozba {
  double znesek, p;
  Nalozba(double z, double p) {
    znesek = z; this.p = p;
  }
  abstract double donos(int leta);
}
class Varcevanje extends Nalozba {
  Varcevanje(double z, double p) {
    super(z, p);
  }
  double donos(int leta) {
    return znesek
      * (Math.pow(1 + p, leta) - 1);
  }
}
class Obveznica extends Nalozba {
  Obveznica(double z, double p) {
    super(z, p);
  }
  double donos(int leta) {
    return znesek * p * leta;
  }
}

Nalozba[] portfelj = {
  new Varcevanje(10000, 0.03),
  new Obveznica(5000, 0.04)
};
double vsota = 0;
for (Nalozba n : portfelj)
  vsota += n.donos(5);
```

**Podatki:** varčevanje $Z_1 = 10\,000$ €, $p_1 = 0{,}03$; obveznica $Z_2 = 5000$ €, $p_2 = 0{,}04$; $n = 5$ let
**Iščemo:** vrednost `vsota`

:::formula
Varčevanje: $D_1 = Z_1\big((1 + p_1)^n - 1\big)$; obveznica: $D_2 = Z_2\,p_2\,n$; zanka pokliče `donos` dinamičnega tipa vsakega elementa.
:::

**Rešitev:**

1. V zanki je statični tip `n` vedno `Nalozba`; `donos` obstaja (abstraktno), zato se klic prevede.
2. Prvi element je `Varcevanje`: $D_1 = 10\,000 \cdot (1{,}03^5 - 1) = 1592{,}74$ €.
3. Drugi element je `Obveznica`: $D_2 = 5000 \cdot 0{,}04 \cdot 5 = 1000$ €.
4. $D = 1592{,}74 + 1000 = 2592{,}74$ €.
5. Odgovor: `vsota` je približno $2592{,}74$ €. Zanka ne ve za vrste naložb; nova vrsta (na primer delnica) bi zahtevala le nov podrazred.

### Primer 3 (težji)

Kaj izpišejo trije klici? Pazi na preobteževanje in prekrivanje hkrati.

```java
class Stranka {}
class Stalna extends Stranka {}

class Cenik {
  int cena(Stranka s) { return 100; }
}
class Akcija extends Cenik {
  int cena(Stranka s) { return 90; }
  int cena(Stalna s) { return 80; }
}

Cenik c = new Akcija();
Stranka s = new Stalna();
Stalna t = new Stalna();
System.out.println(c.cena(t));
System.out.println(((Akcija) c).cena(t));
System.out.println(((Akcija) c).cena(s));
```

**Podatki:** `Akcija` prekrije `cena(Stranka)` in jo preobteži s `cena(Stalna)`; `c` ima statični tip `Cenik`, dinamični `Akcija`; `s` ima statični tip `Stranka`, `t` pa `Stalna`
**Iščemo:** tri izpisane vrednosti

:::formula
Korak 1 (prevajalnik): podpis po statičnem tipu prejemnika in argumentov. Korak 2 (izvajanje): različica s tem podpisom po dinamičnem tipu prejemnika.
:::

**Rešitev:**

1. `c.cena(t)`: statični tip `c` je `Cenik`, ki ima le `cena(Stranka)`. `Stalna` je `Stranka`, zato je izbran podpis `cena(Stranka)`.
2. Ob izvajanju je objekt `Akcija`, ki ta podpis prekrije: rezultat $90$, ne $80$. Metoda `cena(Stalna)` v `Cenik` ne obstaja, zato je prevajalnik ni mogel izbrati.
3. `((Akcija) c).cena(t)`: statični tip je zdaj `Akcija` z obema metodama; za argument tipa `Stalna` je najbolj specifična `cena(Stalna)`. Rezultat $80$.
4. `((Akcija) c).cena(s)`: statični tip argumenta je `Stranka`, ustreza le `cena(Stranka)`. Dinamični tip argumenta ne vpliva na izbiro preobtežene metode. Rezultat $90$.
5. Odgovor: program izpiše `90`, `80` in `90`. Dinamično se izbira le po prejemniku (objektu pred piko), nikoli po argumentih.

### Primer 4 – zdaj ti

Vmesnik `Obdavcljivo` ima metodo `double davek()`. `Blago` (cena $50$ €) ima DDV $22\,\%$, `Storitev` (cena $200$ €) pa $9{,}5\,\%$. Koliko je skupni davek v tabeli `Obdavcljivo[] t = {new Blago(50), new Storitev(200)}`?

**Podatki:** blago $50$ €, stopnja $0{,}22$; storitev $200$ €, stopnja $0{,}095$
**Iščemo:** vsoto `t[i].davek()`

:::formula
Vsak razred implementira `davek()` po svoje; vsota prek vmesnika: $D = \sum_i c_i\,s_i$.
:::

**Rešitev:**

1. Statični tip elementov je `Obdavcljivo`, ki `davek()` ima; klic se prevede.
2. Blago: $50 \cdot 0{,}22 = 11$ €.
3. Storitev izračunaj sam in seštej.

:::premisli
Kolikšen je skupni davek?
---
Storitev: $200 \cdot 0{,}095 = 19$ €; skupaj $11 + 19 = 30$ €.
:::

## Pogoste napake

- **»Klic izbere statični tip.«** Napačno sklepanje: `Izdelek i` je izdelek, torej `i.cena()` iz `Izdelek`. Pri prekritih metodah odloča objekt. Statični tip odloča le, *ali* se klic prevede in kateri podpis velja.
- **Preobteževanje namesto prekrivanja.** `double cena(int kolicina)` v podrazredu ne prekrije `double cena()`, ampak doda novo metodo; klic `i.cena()` ostane stari. Oznaka `@Override` takšno napako ujame že pri prevajanju.
- **Dinamična izbira po argumentu.** Kot v Primeru 3: `cena(s)` z `Stranka s = new Stalna()` ne izbere `cena(Stalna)`. Preobteženo metodo izbere prevajalnik po statičnih tipih argumentov.
- **Instanciranje abstraktnega razreda ali vmesnika.** `new Nalozba(100, 0.03)` se ne prevede. Ustvarimo konkretni podrazred, spremenljivka pa je lahko tipa `Nalozba`.
- **Pozabljen `super(...)`.** Če nadrazred nima konstruktorja brez argumentov, mora podrazred v prvi vrstici konstruktorja poklicati `super(...)` z argumenti.

## Povzetek

- `class B extends A`: `B` podeduje polja in metode, doda nove ali prekrije stare; en nadrazred, razmerje »je«.
- Konstruktor podrazreda najprej pokliče `super(...)`; `super.m()` kliče različico nadrazreda.
- Prekrivanje: enak podpis, izbira ob izvajanju po dinamičnem tipu. Preobteževanje: drugačni parametri, izbira pri prevajanju po statičnih tipih.
- Klic `x.m(a)`: podpis po statičnih tipih `x` in `a`, različica po dinamičnem tipu `x`.
- Abstraktni razred: ni ga mogoče instancirati, lahko ima stanje in abstraktne metode. Vmesnik: brez stanja, le konstante in metode (javne abstraktne, `default`, `static`, od Jave 9 še zasebne pomožne); razred jih implementira več.

## Za izpit

Znati moraš povedati:

- definicije podrazreda, prekrivanja (pogoji: podpis, vrnjeni tip, dostop) in preobteževanja,
- statični in dinamični tip ter pravilo dinamičnega povezovanja v dveh korakih,
- vrstni red ob `new`: konstruktor nadrazreda, nato inicializacija polj podrazreda, nato preostanek konstruktorja,
- razliko med abstraktnim razredom in vmesnikom ter kdaj izbereš katerega,
- pretvorbo navzgor, navzdol, `instanceof` in `ClassCastException`.

### Naloga 1

Kaj izpiše `new Varcevalni(1000);`? Utemelji vsako vrstico izpisa.

```java
class Racun {
  double stanje;
  Racun(double s) {
    stanje = s;
    izpisi();
  }
  void izpisi() {
    System.out.println(
      "R " + stanje);
  }
}
class Varcevalni extends Racun {
  double obresti = 0.02;
  Varcevalni(double s) {
    super(s);
    izpisi();
    super.izpisi();
  }
  @Override
  void izpisi() {
    System.out.println(
      "V " + stanje * obresti);
  }
}
```

**Rešitev:**

1. `new Varcevalni(1000)` najprej rezervira objekt; vsa polja dobijo privzete vrednosti, `obresti = 0.0`.
2. Prvi stavek konstruktorja je `super(1000)`: v `Racun` se nastavi `stanje = 1000.0` in pokliče `izpisi()`.
3. Objekt je že tipa `Varcevalni`, zato se izvede prekrita `izpisi()`. Ker inicializacija `obresti = 0.02` še ni stekla, izpiše `V 0.0`.
4. Po vrnitvi iz `super` se izvedejo inicializatorji polj podrazreda: `obresti = 0.02`.
5. Nato `izpisi()` v konstruktorju `Varcevalni`: $1000 \cdot 0{,}02 = 20$, izpis `V 20.0`.
6. `super.izpisi()` pokliče različico iz `Racun`: izpis `R 1000.0`.
7. Odgovor: `V 0.0`, `V 20.0`, `R 1000.0`. Nauk: v konstruktorju ne kliči metod, ki jih podrazred lahko prekrije.

### Naloga 2

Z razredi iz Primera 2 napiši statično metodo `Nalozba najboljsa(Nalozba[] t, int leta)`, ki vrne naložbo z največjim donosom. Kaj vrne za tabelo z varčevanjem $8000$ € po $2{,}5\,\%$, obveznico $6000$ € s kuponom $4{,}5\,\%$ in varčevanjem $4000$ € po $5\,\%$ pri $4$ letih?

**Rešitev:**

1. Metoda (privzamemo neprazno tabelo):

```java
static Nalozba najboljsa(
    Nalozba[] t, int leta) {
  Nalozba naj = t[0];
  for (Nalozba n : t)
    if (n.donos(leta)
        > naj.donos(leta))
      naj = n;
  return naj;
}
```

2. Metoda ne pozna podrazredov; `donos` vsakega elementa se izbere dinamično.
3. Varčevanje 1: $8000 \cdot (1{,}025^4 - 1) = 830{,}50$ €.
4. Obveznica: $6000 \cdot 0{,}045 \cdot 4 = 1080$ €.
5. Varčevanje 2: $4000 \cdot (1{,}05^4 - 1) = 862{,}03$ €.
6. Odgovor: metoda vrne obveznico (donos $1080$ €). Najvišja obrestna mera ($5\,\%$) ne zmaga, ker je znesek majhen.

### Naloga 3

Natančno navedi pogoje za prekrivanje metode v Javi in pravilo dinamičnega povezovanja. Nato za vsako vrstico utemelji, ali se prevede (`Nalozba` je abstraktna, `Blago implements Obdavcljivo`):
(a) `Nalozba n = new Nalozba(100, 0.03);`
(b) `Obdavcljivo o = new Blago(50);`
(c) `Nalozba m = new Obveznica(100, 0.04); Obveznica b = m;`
(d) v `Obveznica`: `private double donos(int leta) {...}`

**Rešitev:**

1. Prekrivanje: enako ime in enaki tipi parametrov kot v nadrazredu; vrnjeni tip enak ali podtip; dostop enak ali širši; metoda ni `static`, `final` ali `private` v nadrazredu.
2. Dinamično povezovanje: prevajalnik izbere podpis po statičnih tipih, ob izvajanju se izvede različica dinamičnega tipa prejemnika.
3. (a) Ne: abstraktnega razreda ni mogoče instancirati.
4. (b) Da: `Blago` implementira `Obdavcljivo`, pretvorba navzgor je samodejna.
5. (c) Ne: statični tip `m` je `Nalozba`; pretvorba navzdol zahteva `(Obveznica) m`.
6. (d) Ne: `donos` je v `Nalozba` paketna (privzeti dostop), `private` je ožji dostop, kar prekrivanje prepoveduje.
7. Odgovor: prevede se samo (b).

## Drugače: Na sliki

Hierarhijo rišemo kot drevo. Puščica kaže od podrazreda k nadrazredu (»je«), črtkana puščica pomeni »implementira«.

```
        Object
          ^
       Nalozba  (abstraktna)
       ^     ^
Varcevanje  Obveznica

  Obdavcljivo  (vmesnik)
    ^      ^
    :      :
  Blago  Storitev
```

Klic `n.donos(5)` si predstavljaj kot iskanje od spodaj navzgor: začni pri razredu objekta in pojdi po puščicah, dokler ne najdeš metode z izbranim podpisom. Prevajalnik pa pogleda le škatlo statičnega tipa in vse nad njo.

## Drugače: Uporaba v stroki

- **Finančna programska oprema.** Banke vrednotijo tisoče vrst instrumentov (obveznice, opcije, posojila) z enim vmesnikom, na primer `vrednost(datum)`. Izračun tveganja portfelja je ena zanka; novi instrument doda le razred.
- **Optimizacija.** Knjižnice za optimizacijo zahtevajo, da ciljna funkcija implementira vmesnik (na primer metodo `vrednost(double[] x)`). Isti algoritem tako optimizira stroške proizvodnje ali dobiček portfelja.
- **Vzorec »strategija«.** Pravilo popusta (količinski, sezonski, za stalne stranke) je objekt vmesnika `Popust`; trgovina ga zamenja brez spreminjanja kode blagajne.
- **Javanske zbirke.** `List`, `Set` in `Map` so vmesniki; `ArrayList` in `LinkedList` implementirata `List`. Koda, napisana za `List`, deluje z obema (zbirke so naslednja tema).

## Drugače: Bolj natančno

**Liskovino načelo zamenljivosti.** Podrazred je pravilen, če lahko objekt podrazreda nadomesti objekt nadrazreda, ne da bi se pravilnost programa pokvarila. Prekrita metoda ne sme zahtevati več (strožji pogoji na vhod) in ne sme obljubiti manj (šibkejši izid). Klasičen protiprimer: `Kvadrat extends Pravokotnik` z metodo `nastaviSirino`, ki spremeni tudi višino.

**Tabela navideznih metod.** Javanski navidezni stroj (JVM) ob nalaganju razreda pripravi tabelo naslovov njegovih metod; prekrita metoda zasede isto mesto kot v nadrazredu. Klic se ob izvajanju prevede v en skok prek tabele objekta, zato je dinamično povezovanje skoraj tako hitro kot navaden klic.

**`final` in zapečateni razredi.** Metode `final` ni mogoče prekriti, razreda `final` ni mogoče razširiti (`String`). Od Jave 17 razred `sealed ... permits A, B` dovoli dedovanje le naštetim razredom.

## Preveri se

? Katera trditev o vmesnikih v Javi je pravilna?
- Razred lahko implementira največ en vmesnik.
~ Omejitev ena velja za nadrazred (`extends`), ne za vmesnike.
- Vmesnik ima lahko konstruktor, ki ga kliče `super()`.
~ Vmesnik nima konstruktorjev in ga ne moremo instancirati.
+ Spremenljivka tipa vmesnika lahko kaže na objekt vsakega razreda, ki ga implementira.
- Vse metode vmesnika morajo biti brez telesa.
~ Metode `default` in `static` imajo telo.
> To je pretvorba navzgor; tako zanka prek `Obdavcljivo[]` obdela blago in storitve.

? Kolikšna je vsota, ko se izvede `double v = 0; for (Izdelek x : t) v += x.cena();` za `t = {new Izdelek(50), new Akcijski(50), new Akcijski(100)}` iz uvoda?
- $200$
~ Vse cene so vzete iz `Izdelek`, kot da bi izbiral statični tip.
+ $170$
- $160$
~ Popust je uporabljen tudi pri navadnem izdelku.
- $140$
~ Pri akcijskih izdelkih je popust odštet dvakrat ($40\,\%$ namesto $20\,\%$: $30$ in $60$); pravilno staneta $40$ in $80$.
> $50 + 0{,}8 \cdot 50 + 0{,}8 \cdot 100 = 50 + 40 + 80 = 170$.

? Študent želi v `Akcijski` prekriti `double cena()` in napiše `double cena(double popust) { return osnova * (1 - popust); }`. Nato `Izdelek i = new Akcijski(100); i.cena()` izpiše `100.0`. Kje je napaka?
- `Akcijski` mora biti abstrakten.
~ Abstraktnost ni potrebna; razred ima vse metode s telesom.
+ Metoda ima drugačne parametre, zato je preobtežena, ne prekrita.
- Klic bi moral biti `super.cena()`.
~ `super` uporabimo znotraj podrazreda za klic različice nadrazreda, ne pri klicu od zunaj.
- Java ne dovoli metod z istim imenom v podrazredu.
~ Dovoli: z enakim podpisom je to prekrivanje, z drugačnim preobteževanje.
> Prekrita metoda mora imeti enake tipe parametrov; `@Override` bi napako javil pri prevajanju.

? V čem se abstraktni razred razlikuje od vmesnika?
- Abstraktni razred je mogoče instancirati, vmesnika ne.
~ Nobenega od njiju ni mogoče instancirati z `new`.
- Vmesnik ima lahko polja objekta, abstraktni razred ne.
~ Obratno: polja objekta ima lahko le abstraktni razred, vmesnik le konstante.
+ Abstraktni razred ima lahko stanje in konstruktor, razred pa deduje le od enega.
- Ni razlike, le ime je drugo.
~ Razlika je v stanju, konstruktorjih in številu nadrazredov oziroma vmesnikov.
> Zato abstraktni razred izberemo za skupno stanje (`znesek`), vmesnik za skupno zmožnost nepovezanih razredov.

? Davčna aplikacija dobi nov zakon: nepremičnine imajo svojo stopnjo. Kaj je najboljša sprememba, če zanka sešteje `Obdavcljivo[]`?
- V zanko dodamo `if (x instanceof Nepremicnina)` z novo formulo.
~ To deluje, a vsaka nova vrsta zahteva spremembo zanke; polimorfizem tega ne potrebuje.
+ Nov razred `Nepremicnina implements Obdavcljivo` s svojo metodo `davek()`.
- `Nepremicnina extends Blago` in v `Blago` dodamo nov `if`.
~ Nepremičnina ni blago (razmerje »je« ne drži), `if` v nadrazredu pa podre samostojnost razredov.
- V vmesnik dodamo metodo `davekNepremicnine()`.
~ Vsi razredi bi morali to metodo implementirati, čeprav je ne potrebujejo.
> Obstoječa koda ostane nespremenjena; zanka pokliče `davek()` dinamično.

:::simboli
D_1, D_2 | donos posamezne naložbe | | €
D | skupni donos oziroma davek | | €
Z_1, Z_2 | vloženi znesek | | €
p_1, p_2 | letna obrestna mera ali kupon | | – | kot decimalno število
n | število let | | leto
c_i | cena $i$-tega elementa | | €
s_i | davčna stopnja $i$-tega elementa | | –
i | zaporedna številka elementa v tabeli | |
:::
