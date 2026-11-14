---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Luka vodi statistiko študentske košarkarske lige. Po vsakem krogu ročno označi igralce z vsaj $10$ točkami, sešteje točke ekip in prepiše lestvico. Za en krog porabi uro.

Vse, kar dela, je ponavljanje istih korakov z drugimi številkami. Kratek program v preglednici, **makro**, to opravi v sekundi. Zanj potrebuješ **spremenljivke**, **pogojne stavke**, **zanke** in sam makro, ki jih poveže s celicami. Primeri so v jeziku VBA, vgrajenem v Excel; enake ideje veljajo v Pythonu, R in drugih jezikih.

## Razlaga

**1. Mamljiva napaka: »enačaj pomeni enako«.** Iz matematike znaš, da $x = x + 3$ nima rešitve. V programu pa je vrstica

```vb
tocke = tocke + 3
```

povsem pravilna in zelo pogosta. Zakaj? Ker enačaj v programu ni trditev, ampak **ukaz**. Imenujemo ga **prireditev**: izračunaj desno stran in rezultat shrani v spremenljivko na levi. Prejšnja vrednost se pri tem izgubi.

**Spremenljivka** je poimenovana škatla v pomnilniku z natanko eno vrednostjo. Pri ukazu `tocke = tocke + 3` (trojka) iz škatle vzamemo staro število, prištejemo $3$ in rezultat vrnemo v isto škatlo. Potek kaže tabela sledenja:

| korak | ukaz | `tocke` po ukazu |
|---|---|---|
| 1 | `tocke = 0` | 0 |
| 2 | `tocke = tocke + 3` | 3 |
| 3 | `tocke = tocke + 2` | 5 |

V VBA spremenljivko najavimo z `Dim` in ji določimo **tip**: `Integer` ali `Long` za cela števila, `Double` za decimalna, `String` za besedilo, `Boolean` za `True`/`False`. Tip pove, kakšno vrednost škatla sprejme.

:::premisli
Program izvede `a = 5`, nato `b = a`, nato `a = 7`. Kolikšen je zdaj `b`? Napovej, preden pogledaš.
---
`b` je $5$. Prireditev `b = a` je ob izvedbi prepisala *vrednost*, ne povezave. Spremenljivka ni celica s formulo, ki bi se sama osvežila, ko se `a` spremeni.
:::

**2. Mamljiva napaka: »program preveri vse pogoje in naredi vse, kar drži«.** Pogojni stavek izbere *eno* pot:

```vb
If razlika > 0 Then
    izid = "zmaga"
ElseIf razlika = 0 Then
    izid = "neodloceno"
Else
    izid = "poraz"
End If
```

Računalnik gre od zgoraj navzdol, izvede vejo prvega pogoja, ki drži, in skoči za `End If`. Če ne drži noben, izvede `Else`. Primerjave so `>`, `<`, `>=`, `<=`, `=` in `<>` (različno), povežemo jih z `And` in `Or`. Znotraj `If` je `=` primerjava, ne prireditev.

:::premisli
Trener podeli značke: vsaj $10$ točk je »bron«, vsaj $20$ točk »zlato«. Napiše najprej `If t >= 10 Then`, nato `ElseIf t >= 20 Then`. Kaj dobi igralec z $25$ točkami in zakaj?
---
Dobi »bron«. Pogoj `t >= 10` drži že prvi, zato veja z zlatom nikoli ne pride na vrsto. Ostrejši pogoj mora biti prvi: najprej `t >= 20`, nato `t >= 10`.
:::

**3. Mamljiva napaka: »za sto vrstic napišem sto ukazov«.** **Zanka** ponavlja isti blok. Ko število ponovitev poznaš vnaprej, uporabiš `For`:

```vb
For i = 2 To 7
    ' telo zanke
Next i
```

Števec `i` dobi zaporedoma vrednosti $2, 3, \ldots, 7$, kar je $7 - 2 + 1 = 6$ ponovitev. Ko število ni znano (»do prve prazne celice«), uporabiš `Do While pogoj … Loop`. Ta zanka sama ne ve, kdaj nehati: če se v telesu nič ne spremeni, program obvisi. Zato v telesu premakneš števec, npr. `i = i + 1`.

**4. Mamljiva napaka: »posneti makro razume, kaj sem hotel«.** **Makro** je poimenovan postopek (`Sub ime() … End Sub`), ki ga Excel izvede na ukaz. Lahko ga posnameš (Ogled → Makri → Posnemi makro), a snemalnik zapiše natanko tiste celice, ki si jih kliknil, npr. `Range("B2:B7")`. Ko se tabela podaljša, posneti makro nove vrstice spregleda. Napisan makro z zanko pa dela s celicami prek števca:

- `Cells(i, 2).Value` je vrednost v vrstici `i`, stolpcu $2$ (stolpec B),
- `Range("D1").Value = vsota` zapiše rezultat v celico D1.

Makre urejaš v urejevalniku VBA (Alt + F11), zaženeš jih z Alt + F8. Datoteko shraniš kot `.xlsm`, sicer se makri ne ohranijo. Dejanj makra Ctrl + Z ne razveljavi, zato ga preizkusi na kopiji. Makrov iz neznanih virov ne zaganjaj.

## Rešeni primeri

### Primer 1: točke ene tekme

Igralka je zadela $7$ metov za dve točki, $4$ mete za tri točke in $5$ prostih metov po eno točko. Kolikšna je vrednost `tocke` po spodnjih ukazih?

```vb
Dim tocke As Integer
tocke = 0
tocke = tocke + 2 * 7
tocke = tocke + 3 * 4
tocke = tocke + 5
```

**Podatki:** $7$ dvojk, $4$ trojke, $5$ prostih metov; začetna vrednost `tocke = 0`
**Iščemo:** končno vrednost spremenljivke `tocke`

:::formula
Prireditev: nova vrednost = izračun desne strani s staro vrednostjo
:::

**Rešitev:**

1. Po `tocke = 0` je v škatli $0$.
2. Prva prireditev: $0 + 2 \cdot 7 = 14$, ker najprej izračunamo desno stran.
3. Druga: $14 + 3 \cdot 4 = 26$; stara vrednost $14$ se prepiše.
4. Tretja: $26 + 5 = 31$.
5. Odgovor: na koncu je `tocke` enako $31$, kar je igralkin izkupiček tekme.

### Primer 2: točke za lestvico

Luka pomaga še prijatelju v nogometni ligi. Ekipa ima pred tekmo $17$ točk na lestvici. Tekma se konča $2 : 2$. Za zmago dobi $3$ točke, za neodločen izid $1$, za poraz $0$. Kakšna sta `izid` in `lestvica` po izvedbi?

```vb
razlika = goliDoma - goliGost
If razlika > 0 Then
    izid = "zmaga"
    lestvica = lestvica + 3
ElseIf razlika = 0 Then
    izid = "neodloceno"
    lestvica = lestvica + 1
Else
    izid = "poraz"
End If
```

**Podatki:** `goliDoma = 2`, `goliGost = 2`, `lestvica = 17`; zmaga $3$, neodločeno $1$, poraz $0$ točk
**Iščemo:** vrednosti `izid` in `lestvica`

:::formula
Izvede se prva veja, katere pogoj drži; druge veje se preskočijo.
:::

**Rešitev:**

1. Razlika golov: $2 - 2 = 0$.
2. Pogoj `razlika > 0` ne drži, ker $0$ ni večje od $0$.
3. Pogoj `razlika = 0` drži, zato se izvede druga veja; veja `Else` se preskoči.
4. `lestvica` postane $17 + 1 = 18$.
5. Odgovor: `izid` je »neodloceno«, ekipa ima na lestvici $18$ točk.

### Primer 3: makro za cel krog

Luka ima v stolpcu B točke igralca na šestih tekmah (celice B2 do B7, v B1 je naslov). Vrednosti so $12$, $7$, $15$, $9$, $20$ in $11$. Napiši makro, ki v D1 zapiše vsoto točk, v D2 pa število tekem z vsaj $10$ točkami. Koliko je nato povprečje na tekmo?

**Podatki:** B2:B7 $= 12, 7, 15, 9, 20, 11$; B1 je naslov; meja $10$ točk
**Iščemo:** makro, vrednosti v D1 in D2 ter povprečje

:::formula
Zanka `For i = 2 To 7` čez vrstice; v telesu prištevanje in pogojno štetje; povprečje $= \dfrac{\text{vsota}}{\text{število tekem}}$
:::

**Rešitev:**

1. Zanka začne pri $2$, ker je v vrstici $1$ naslov, in konča pri $7$: to je $7 - 2 + 1 = 6$ tekem. Spremenljivka `vsota` hrani seštevek točk, `st` pa šteje tekme z vsaj $10$ točkami.

```vb
Sub Krog()
    Dim i As Integer, st As Integer
    Dim vsota As Integer
    vsota = 0
    st = 0
    For i = 2 To 7
        vsota = vsota + Cells(i, 2).Value
        If Cells(i, 2).Value >= 10 Then
            st = st + 1
        End If
    Next i
    Range("D1").Value = vsota
    Range("D2").Value = st
End Sub
```

2. Vsota: $12 + 7 + 15 + 9 + 20 + 11 = 74$, saj zanka vsako vrednost enkrat prišteje.
3. Pogoj `>= 10` drži pri $12$, $15$, $20$ in $11$, zato je `st` na koncu $4$.
4. Povprečje: $\dfrac{74}{6} \approx 12{,}33$ točke na tekmo.
5. Odgovor: v D1 je $74$, v D2 je $4$, povprečje je približno $12{,}33$ točke.

### Primer 4: zdaj ti

Kolesarka trenira štiri dni. Prvi dan prevozi $20\,\text{km}$, vsak naslednji dan $5\,\text{km}$ več. Kolikšni sta `skupaj` in `km` po zanki?

```vb
km = 20
skupaj = 0
For dan = 1 To 4
    skupaj = skupaj + km
    km = km + 5
Next dan
```

**Podatki:** `km = 20`, `skupaj = 0`, $4$ ponovitve, vsak dan $+5\,\text{km}$
**Iščemo:** končni vrednosti `skupaj` in `km`

:::formula
V vsaki ponovitvi: najprej `skupaj = skupaj + km`, nato `km = km + 5`
:::

**Rešitev:**

1. Dan 1: `skupaj` $= 0 + 20 = 20$, `km` $= 20 + 5 = 25$.
2. Dan 2: `skupaj` $= 20 + 25 = 45$, `km` $= 25 + 5 = 30$.
3. Nadaljuj za dneva 3 in 4 sam, nato preveri:

:::premisli
Kolikšna sta `skupaj` in `km`, ko se zanka konča?
---
Dan 3: `skupaj` $= 45 + 30 = 75$, `km` $= 35$. Dan 4: `skupaj` $= 75 + 35 = 110$, `km` $= 40$. Kolesarka je skupaj prevozila $110\,\text{km}$; `km` je $40$, čeprav peti dan ni bil prevožen.
:::

## Pogoste napake

- **Napačna meja zanke.** Kdor misli, da `For i = 2 To 7` teče $5$-krat, ali začne pri $1$ in zajame naslov, dobi napačno vsoto ali napako tipa. Ponovitev je $\text{konec} - \text{začetek} + 1$.
- **Vrstni red pogojev.** Ker se izvede le prva veja, ki drži, širši pogoj na vrhu (`>= 10` pred `>= 20`) požre ožjega. Najprej napiši najstrožji pogoj.
- **`>` namesto `>=`.** »Vsaj $10$« pomeni `>= 10`. Z `> 10` igralec z natanko $10$ točkami izpade. Mejni primer vedno preizkusi posebej.
- **Neskončna zanka `Do While`.** Brez `i = i + 1` se pogoj nikoli ne spremeni in Excel obvisi (ustaviš ga s Ctrl + Break). Števec premakni v vsaki ponovitvi.
- **»Ctrl + Z bo popravil.«** Po zagonu makra Excel izbriše zgodovino razveljavitev. Makro preizkusi na kopiji.

## Povzetek

- Spremenljivka je poimenovana škatla z eno vrednostjo; `Dim ime As Tip` jo najavi.
- `x = x + 3` je prireditev: izračunaj desno, shrani levo; stara vrednost se izgubi.
- `If … ElseIf … Else … End If` izvede natanko eno vejo, prvo, katere pogoj drži.
- `For i = a To b` ponovi blok $b - a + 1$-krat; `Do While … Loop` ponavlja, dokler pogoj drži, in potrebuje spremembo v telesu.
- Makro (`Sub … End Sub`) bere in piše celice z `Cells(vrstica, stolpec).Value` in `Range("D1").Value`; datoteka `.xlsm`; Ctrl + Z ga ne razveljavi.

## Za izpit

Znati moraš povedati:
- kaj je spremenljivka, kaj pove njen tip in kako jo v VBA najaviš (`Dim ime As Tip`);
- kaj naredi prireditev `x = x + 3` in zakaj to ni enačba; razliko med `=` kot prireditvijo in `=` kot primerjavo v `If`;
- kako se izvede `If … ElseIf … Else … End If`: natanko ena veja, prva, katere pogoj drži, zato je vrstni red pogojev pomemben;
- koliko ponovitev izvede `For i = a To b` in kolikšen je števec po zanki; kdaj namesto nje uporabiš `Do While … Loop` in kaj mora biti v njenem telesu, da se ustavi;
- kaj je makro, kako z `Cells(vrstica, stolpec).Value` in `Range("D1").Value` bere in piše celice ter zakaj je napisan makro z zanko boljši od posnetega;
- kako s tabelo sledenja poiščeš napako v programu.

### Naloga 1

V laboratoriju štejejo kolonije na ploščah. V stolpcu B so števila kolonij (B1 je naslov): v B2 do B8 so $34$, $120$, $12$, $87$, $310$, $45$ in $150$, celica B9 je prazna. Plošča je števna, če ima od $30$ do $300$ kolonij.

```vb
Sub Plosce()
    Dim i As Integer, st As Integer
    Dim x As Long, vsota As Long, maks As Long
    i = 2
    vsota = 0
    st = 0
    maks = 0
    Do While Cells(i, 2).Value <> ""
        x = Cells(i, 2).Value
        If x > 300 Then
            Cells(i, 3).Value = "prevec"
        ElseIf x >= 30 Then
            Cells(i, 3).Value = "stevna"
            vsota = vsota + x
            st = st + 1
            If x > maks Then
                maks = x
            End If
        Else
            Cells(i, 3).Value = "premalo"
        End If
        i = i + 1
    Loop
    Range("E1").Value = vsota / st
    Range("E2").Value = maks
    Range("E3").Value = i
End Sub
```

(a) Kaj makro zapiše v celice C2 do C8 ter v E1, E2 in E3? (b) Študentka zamenja pogoja: najprej `If x >= 30 Then` (z vejo »stevna«), nato `ElseIf x > 300 Then` (z vejo »prevec«). Kaj je zdaj v C6 in E1? (c) V prvotnem makru nekdo pobriše celico B5. Kaj je po zagonu v E1, E2 in E3?

**Rešitev:**

1. Zanka začne pri `i = 2` in teče, dokler celica v stolpcu B ni prazna, torej za $i = 2, 3, \ldots, 8$. To je $8 - 2 + 1 = 7$ ponovitev.
2. Tabela sledenja:

| `i` | `x` | veja | `vsota` | `st` | `maks` |
|---|---|---|---|---|---|
| 2 | 34 | stevna | 34 | 1 | 34 |
| 3 | 120 | stevna | 154 | 2 | 120 |
| 4 | 12 | premalo | 154 | 2 | 120 |
| 5 | 87 | stevna | 241 | 3 | 120 |
| 6 | 310 | prevec | 241 | 3 | 120 |
| 7 | 45 | stevna | 286 | 4 | 120 |
| 8 | 150 | stevna | 436 | 5 | 150 |

3. V C2 do C8 so po vrsti »stevna«, »stevna«, »premalo«, »stevna«, »prevec«, »stevna«, »stevna«.
4. Po ponovitvi z `i = 8` števec postane $9$; B9 je prazna, zato se zanka konča. V E3 je $9$.
5. V E1 je povprečje števnih plošč $\dfrac{436}{5} = 87{,}2$, v E2 največje število kolonij na števni plošči, $150$.
6. (b) Pri $x = 310$ pogoj `x >= 30` drži že prvi, zato veja »prevec« nikoli ne pride na vrsto. V C6 je »stevna«, vsota je $436 + 310 = 746$, `st` je $6$, v E1 je $\dfrac{746}{6} \approx 124{,}33$.
7. (c) Zanka se konča pri prvi prazni celici, to je zdaj B5. Obdela le $34$, $120$ in $12$: vsota je $34 + 120 = 154$, `st` je $2$, `maks` je $120$.
8. Odgovor: (a) v E1 je $87{,}2$, v E2 $150$, v E3 $9$; (b) v C6 je »stevna«, v E1 približno $124{,}33$; (c) v E1 je $\dfrac{154}{2} = 77$, v E2 $120$, v E3 $5$. Makro pri tem ne javi napake, čeprav je tri plošče (B6 do B8) spregledal.

### Naloga 2

Natančno navedi, koliko ponovitev izvede zanka `For i = a To b` pri $a \le b$ in kolikšen je `i` po njej. Zanko `For i = 3 To 11` s telesom `s = s + i` nato zapiši z `Do While` in utemelji, kaj se zgodi, če eno vrstico telesa izpustiš.

**Rešitev:**

1. Števec dobi zaporedoma vrednosti $a, a + 1, \ldots, b$, obe meji sta vključeni. Ponovitev je zato $b - a + 1$.
2. Po zadnji ponovitvi se števec poveča še enkrat. Ker je $b + 1$ čez mejo, se zanka konča in `i` je enak $b + 1$.
3. Za `For i = 3 To 11` je ponovitev $11 - 3 + 1 = 9$, po zanki je `i` enak $12$.
4. Enakovredna zanka s pogojem:

```vb
i = 3
Do While i <= 11
    s = s + i
    i = i + 1
Loop
```

5. Začetno vrednost in povečanje števca, ki ju `For` opravi sam, moraš pri `Do While` napisati sam. Pogoj je `<=`, ker je meja $11$ vključena; z `<` bi bilo ponovitev le $8$.
6. Brez vrstice `i = i + 1` ostane `i` ves čas $3$. Pogoj `i <= 11` zato vedno drži in zanka se nikoli ne konča.
7. Odgovor: $b - a + 1$ ponovitev, po zanki je `i` enak $b + 1$; zanka `Do While` potrebuje v telesu spremembo, ki pogoj nekoč ovrže.

### Naloga 3

Kultura bakterij ima na začetku $500$ celic in se podvoji vsakih $20$ minut. (a) Kolikšna sta `n` in `t` po spodnji zanki? (b) Utemelji, zakaj tu ni primerna zanka `For`. (c) Utemelji, ali ukaza `a = b` in `b = a` zamenjata vrednosti spremenljivk `a = 4` in `b = 9`, in zapiši pravilno zamenjavo.

```vb
n = 500
t = 0
Do While n < 100000
    n = n * 2
    t = t + 20
Loop
```

**Rešitev:**

1. Vsaka ponovitev `n` podvoji in `t` poveča za $20$. Zaporedne vrednosti `n` so $1000$, $2000$, $4000$, $8000$, $16\,000$, $32\,000$, $64\,000$ in $128\,000$.
2. Po sedmi ponovitvi je `n` enak $64\,000$, kar je manj od $100\,000$, zato zanka teče še enkrat. Po osmi je `n` enak $128\,000$ in pogoj ne drži več.
3. Ponovitev je $8$, zato je `t` enak $8 \cdot 20 = 160$ minut.
4. (b) Število ponovitev ni znano vnaprej, saj je odvisno od začetnega števila celic in meje. `For` zahteva znano končno vrednost števca, `Do While` pa se ustavi, ko pogoj neha držati.
5. (c) Ukaz `a = b` v `a` shrani $9$; stara vrednost $4$ se izgubi. Ukaz `b = a` nato v `b` prepiše $9$. Obe spremenljivki sta $9$, zamenjave ni.
6. Pravilno je s tretjo spremenljivko: `c = a`, `a = b`, `b = c`. Po teh ukazih je `c` enak $4$, `a` enak $9$ in `b` enak $4$.
7. Odgovor: (a) `n` je $128\,000$, `t` je $160$ minut; (b) ker število ponovitev ni znano vnaprej; (c) ne, obe sta $9$, za zamenjavo potrebuješ pomožno spremenljivko.

## Drugače: Kot zgodba

Zapisnikar na tekmi ima tablo »točke«, na kateri je eno samo število. To je spremenljivka.

Sodnik zakliče: »Trojka!« Zapisnikar pogleda tablo ($14$), prišteje $3$, zbriše in napiše $17$. To je prireditev `tocke = tocke + 3`.

Ob koncu napada se odloči: če je žoga šla v koš, zapiše točke, sicer nič. To je pogojni stavek.

Tekma ima štiri četrtine in pri vsaki ponovi isti postopek. To je zanka `For cetrtina = 1 To 4`. Postopek je zapisan na listu od vodje lige: to je makro, po katerem vsak zapisnikar naredi natanko isto.

## Drugače: Korak za korakom s številkami

Sledimo makru iz Primera 3, vrstico za vrstico. Zapisuj, kaj je v škatlah po vsaki ponovitvi:

| `i` | `Cells(i, 2)` | `vsota` | `st` |
|---|---|---|---|
| 2 | 12 | 12 | 1 |
| 3 | 7 | 19 | 1 |
| 4 | 15 | 34 | 2 |
| 5 | 9 | 43 | 2 |
| 6 | 20 | 63 | 3 |
| 7 | 11 | 74 | 4 |

1. Pred zanko sta `vsota` in `st` enaka $0$.
2. Pri `i = 3`: $12 + 7 = 19$; $7$ ni vsaj $10$, zato `st` ostane $1$.
3. Po `i = 7` števec postane $8$, kar je čez mejo, zato se zanka konča.

Ko program ne da pričakovanega rezultata, naredi tako tabelo: napaka je v prvi vrstici, ki se razlikuje od pričakovane.

## Preveri se

? Luka zažene makro, ki po pomoti pobriše stolpec s točkami. Pritisne Ctrl + Z, a se nič ne zgodi. Zakaj?
- Ker je datoteka shranjena kot `.xlsm`.
~ Končnica `.xlsm` le dovoli shranjevanje makrov; na razveljavljanje ne vpliva.
+ Ker Excel ob zagonu makra izbriše zgodovino razveljavitev.
- Ker makro ni bil posnet, ampak napisan.
~ Tudi posneti makro ima isto lastnost: njegovih dejanj Ctrl + Z ne razveljavi.
> Dejanj makra Ctrl + Z ne razveljavi, zato makro preizkusiš na kopiji.

? Kolikšen je `s` po izvedbi: `s = 0`, nato `For i = 1 To 4`, v telesu `s = s + 2 * i`, `Next i`?
- $8$
~ To je le zadnji prištevek $2 \cdot 4$. Prireditev staro vrednost `s` vzame s seboj, zato se prištevki seštevajo.
- $10$
~ To je $1 + 2 + 3 + 4$; pozabil si na množenje z $2$ v telesu zanke.
+ $20$
- $12$
~ To je $2 + 4 + 6$: zanka `1 To 4` vključi tudi $i = 4$, torej teče štirikrat.
> $s = 2 + 4 + 6 + 8 = 20$. Zanka teče za $i = 1, 2, 3, 4$ in vsakič prišteje $2i$.

? V B2:B5 so točke $12$, $10$, $15$, $8$. Makro z `For i = 2 To 5` in `If Cells(i, 2).Value > 10 Then st = st + 1` šteje tekme. Študent je sledil takole: (1) `i = 2`: $12 > 10$, `st` $= 1$; (2) `i = 3`: $10 > 10$, `st` $= 2$; (3) `i = 4`: $15 > 10$, `st` $= 3$; (4) `i = 5`: $8$ ne, `st` ostane $3$. Kateri korak je napačen?
- (1), ker zanka začne pri $1$.
~ Zanka je zapisana z `2 To 5`, zato je prva vrednost števca $2$.
+ (2), ker $10 > 10$ ne drži.
- (4), ker bi se moral `st` zmanjšati.
~ Ko pogoj ne drži, se veja preprosto preskoči; `st` se ne spremeni.
- (3), ker se `st` ne bi smel povečati dvakrat zapored.
~ `st` se poveča pri vsaki ponovitvi, v kateri pogoj drži, ne glede na prejšnje.
> $10$ ni strogo večje od $10$, zato v koraku (2) `st` ostane $1$. Pravilni rezultat je $2$. Za »vsaj $10$« bi potreboval `>= 10`.

? Kateri od naštetih gradnikov **ni** zanka?
- `For i = 1 To 10 … Next i`
~ To je zanka s števcem: blok ponovi desetkrat.
- `Do While i < 10 … Loop`
~ To je zanka s pogojem: ponavlja, dokler pogoj drži.
+ `If i < 10 Then … End If`
- `For Each c In Range("B2:B7") … Next c`
~ Tudi to je zanka: gre po vseh celicah v območju.
> `If` pogoj preveri enkrat in blok izvede največ enkrat. Ponavljanja ni, zato to ni zanka.

? Trener vpisuje rezultate v stolpec A, a ne ve vnaprej, koliko tekem bo v sezoni. Makro naj obdela vse vrstice do prve prazne celice. Kaj uporabi?
- `For i = 2 To 10`
~ Zanka s fiksno mejo obdela natanko devet vrstic, tudi če je tekem več ali manj.
- `If Cells(i, 1).Value <> "" Then`
~ `If` preveri le eno vrstico in se ne ponovi.
+ `Do While Cells(i, 1).Value <> ""` z `i = i + 1` v telesu
- `Do While Cells(i, 1).Value <> ""` brez spreminjanja `i`
~ Brez `i = i + 1` makro ves čas gleda isto celico in se nikoli ne ustavi.
> Pri neznanem številu ponovitev uporabiš zanko s pogojem in v vsaki ponovitvi povečaš števec.

:::simboli
x | spremenljivka | | | v programu x = x + 3 poveča x za 3
i | števec zanke | | | v zanki For dobi zaporedne vrednosti
a, b | začetna in končna vrednost števca | | | For i = a To b ponovi blok $b - a + 1$-krat
s | spremenljivka, ki zbira vsoto | | | začne z 0, v vsaki ponovitvi ji prištejemo
\text{vsota} | vsota točk na vseh tekmah | | |
\text{število tekem} | število odigranih tekem | | | povprečje je vsota : število tekem
:::
