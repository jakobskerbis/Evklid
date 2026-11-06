---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na treningu košarke Luka zadene $9$ od $15$ prostih metov, Maja $12$ od $20$. Doma potem Maja igra računalniško igro: njen junak ima še $150$ od $250$ točk življenja.

Dve povsem različni situaciji, a v obeh se skriva ista misel: **kolikšen del celote** imamo. Pri Luku, pri Maji in pri junaku je to natanko $60$ od vsakih $100$, torej $60\,\%$.

Odstotki so skupni jezik za take primerjave. Z njimi primerjaš strelce, ki so metali različnokrat, preveriš, ali je kopačka na razprodaji res ugodna, in izračunaš, za koliko se podraži članarina v klubu.

## Razlaga

**Mamljiva napačna ideja.** Maja je zadela $12$ metov, Luka le $9$. Torej je Maja boljša? Tako bi sklepal skoraj vsak. A Maja je tudi metala večkrat. Število zadetkov samo ne pove, kako uspešen je bil strelec; primerjati moramo **del celote**.

**Popravek: vse primerjamo s $100$.** Predstavljaj si, da bi oba metala po $100$-krat in zadevala enako uspešno.

- Luka: $\dfrac{9}{15} = \dfrac{60}{100}$.
- Maja: $\dfrac{12}{20} = \dfrac{60}{100}$.

Oba bi zadela $60$ od $100$. Sta enako uspešna. **Odstotek** pomeni »od sto«; zapišemo ga z znakom $\%$:

$$1\,\% = \frac{1}{100} = 0{,}01$$

:::premisli
Tretji igralec zadene $7$ od $10$ metov. Napovej: je uspešnejši od Luke in Maje ali ne?
---
Je. $\dfrac{7}{10} = \dfrac{70}{100} = 70\,\%$, kar je več kot $60\,\%$, čeprav je zadel najmanj metov.
:::

**Tri količine.** V vsaki nalogi z odstotki nastopajo tri količine:

- **osnova** $o$: celota, ki ji ustreza $100\,\%$ (vsi meti, vse točke, prvotna cena);
- **odstotek** $p\,\%$: koliko stotink osnove vzamemo;
- **delež** $d$: del osnove, ki ustreza odstotku (zadeti meti, preostale točke).

Pri Maji je osnova $20$ metov, delež $12$ zadetih metov, odstotek $60\,\%$.

**Slika: dvojna premica.** Nad premico zapišemo odstotke, pod njo iste točke v metih. Obe lestvici se raztezata premo sorazmerno:

| Odstotek | $0\,\%$ | $10\,\%$ | $60\,\%$ | $100\,\%$ |
|---|---|---|---|---|
| Maja (meti) | $0$ | $2$ | $12$ | $20$ |

Ker sta lestvici premo sorazmerni, velja zveza $\dfrac{d}{o} = \dfrac{p}{100}$. Iz nje dobimo:

$$d = o \cdot \frac{p}{100}$$

$$p = \frac{d}{o} \cdot 100$$

$$o = \frac{d \cdot 100}{p}$$

Vse tri lahko nadomestiš s sklepnim računom, ki ga že poznaš: najprej izračunaš $1\,\%$, nato želeni odstotek.

V simulaciji spodaj (»Odstotki na mreži in dvojni premici«) nastavi osnovo na $250$ in odstotek na $60\,\%$. Na mreži je pobarvanih $60$ od $100$ kvadratkov, na premici pa preberi delež: $150$, prav toliko točk ima Majin junak.

**Popust in podražitev.** Tu se skriva druga mamljiva napaka: »popust $20\,\%$ pomeni $20$ evrov manj«. Ne. Odstotek je vedno del osnove, osnova pa je **prvotna cena**.

- Popust $p\,\%$: plačamo $(100 - p)\,\%$ prvotne cene. Pri popustu $20\,\%$ je to $80\,\%$, torej $0{,}8$ prvotne cene.
- Podražitev $p\,\%$: nova cena je $(100 + p)\,\%$ prvotne. Pri podražitvi $20\,\%$ je to $120\,\%$, torej $1{,}2$ prvotne cene.

:::premisli
Kopačke podražijo za $10\,\%$, čez mesec pocenijo za $10\,\%$. Ali stanejo enako kot na začetku? Zakaj?
---
Ne, stanejo manj. Pri $100\,\text{€}$: podražitev na $110\,\text{€}$, nato popust $10\,\%$ od $110\,\text{€}$, kar je $11\,\text{€}$, torej $99\,\text{€}$. Drugi odstotek računamo od večje osnove, zato je odvzetih evrov več, kot jih je bilo dodanih.
:::

## Rešeni primeri

### Primer 1: zmage v sezoni

Košarkarska ekipa je v sezoni odigrala $30$ tekem in zmagala na $40\,\%$ tekem. Koliko zmag je dosegla?

**Podatki:** osnova $o = 30$ tekem, odstotek $p = 40\,\%$
**Iščemo:** delež $d$ (število zmag)

:::formula
$d = o \cdot \dfrac{p}{100}$
:::

**Rešitev:**

1. Osnova so vse tekme, ker odstotek opisuje del sezone.
2. $\dfrac{40}{100} = 0{,}4$.
3. $d = 30 \cdot 0{,}4 = 12$.
4. Odgovor: ekipa je zmagala $12$-krat.

### Primer 2: kdo je boljši strelec?

Rokometaš Tim je zadel $18$ od $24$ sedemmetrovk, Nik $21$ od $30$. Kdo je uspešnejši strelec?

**Podatki:** Tim $d_1 = 18$, $o_1 = 24$; Nik $d_2 = 21$, $o_2 = 30$
**Iščemo:** odstotka uspešnosti $p_1$ in $p_2$

:::formula
$p = \dfrac{d}{o} \cdot 100$
:::

**Rešitev:**

1. Tim: $\dfrac{18}{24} = 0{,}75$, torej $p_1 = 75\,\%$.
2. Nik: $\dfrac{21}{30} = 0{,}7$, torej $p_2 = 70\,\%$.
3. Nik ima več zadetkov, a je metal tudi večkrat. Odloča odstotek.
4. Odgovor: uspešnejši je Tim ($75\,\%$ proti $70\,\%$).

### Primer 3: cena pred popustom

Po popustu $25\,\%$ stanejo kopačke $63\,\text{€}$. Koliko so stale pred popustom?

**Podatki:** popust $25\,\%$, cena po popustu $63\,\text{€}$
**Iščemo:** prvotno ceno $o$

:::formula
Po popustu plačamo $(100 - p)\,\%$ osnove.

$o = \dfrac{d \cdot 100}{p}$
:::

**Rešitev:**

1. Osnova je prvotna cena, ki je ne poznamo. Cena $63\,\text{€}$ ni $100\,\%$.
2. Po popustu plačamo $100\,\% - 25\,\% = 75\,\%$ prvotne cene, zato je $d = 63\,\text{€}$ in $p = 75\,\%$.
3. $1\,\%$ prvotne cene je $63 : 75 = 0{,}84\,\text{€}$.
4. $100\,\%$ je $0{,}84 \cdot 100 = 84\,\text{€}$.
5. Preizkus: $25\,\%$ od $84\,\text{€}$ je $21\,\text{€}$, in $84 - 21 = 63$. ✓
6. Odgovor: kopačke so stale $84\,\text{€}$.

### Primer 4: zdaj ti

Letna članarina v teniškem klubu je $240\,\text{€}$. Klub jo podraži za $15\,\%$. Kolikšna je nova članarina?

**Podatki:** osnova $o = 240\,\text{€}$, podražitev $15\,\%$
**Iščemo:** novo članarino

:::formula
Po podražitvi je cena $(100 + p)\,\%$ osnove.
:::

**Rešitev:**

1. Osnova je stara članarina, ker podražitev računamo od nje.
2. Nova članarina je $100\,\% + 15\,\% = 115\,\%$ stare, torej $1{,}15$ stare.
3. Izračunaj sam, nato preveri:

:::premisli
Koliko je nova članarina?
---
$240 \cdot 1{,}15 = 276\,\text{€}$. Drugače: podražitev je $240 \cdot 0{,}15 = 36\,\text{€}$, nova cena $240 + 36 = 276\,\text{€}$.
:::

## Pogoste napake

- **Primerjanje zadetkov namesto odstotkov.** »Nik je zadel $21$, Tim $18$, torej je Nik boljši.« Napačno, ker sta metala različnokrat. Popravek: izračunaj odstotek obeh in primerjaj odstotka.
- **Odstotek kot evri.** »Popust $20\,\%$ na $30\,\text{€}$ je $30 - 20 = 10\,\text{€}$.« Odstotek ni znesek, ampak del osnove: $20\,\%$ od $30\,\text{€}$ je $6\,\text{€}$, plačamo $24\,\text{€}$.
- **Napačna osnova pri vračanju.** Pri iskanju cene pred popustom učenci prištejejo $25\,\%$ od $63\,\text{€}$ in dobijo $78{,}75\,\text{€}$. Toda $25\,\%$ je del prvotne cene, ne nove. Popravek: nova cena je $75\,\%$ prvotne; od tu izračunaj $1\,\%$ in $100\,\%$.
- **»Popust in podražitev se izničita.«** Po podražitvi $10\,\%$ in popustu $10\,\%$ cena pade s $100\,\text{€}$ na $99\,\text{€}$, ker sta osnovi različni.
- **Izguba namesto ostanka.** Če igra vzame $30\,\%$ točk, je $30\,\%$ izguba; ostane $70\,\%$. Preberi, kaj naloga sprašuje.

## Povzetek

- $1\,\% = \dfrac{1}{100}$; odstotek pove, koliko stotink osnove vzamemo.
- Osnova $o$ je celota ($100\,\%$), delež $d$ je del osnove, $p\,\%$ je odstotek.
- $d = o \cdot \dfrac{p}{100}$, $p = \dfrac{d}{o} \cdot 100$, $o = \dfrac{d \cdot 100}{p}$; vse tri iz $\dfrac{d}{o} = \dfrac{p}{100}$.
- Sklepni račun: najprej $1\,\%$, nato želeni odstotek.
- Uspešnost primerjamo z odstotki, ne s številom zadetkov.
- Popust $p\,\%$: plačamo $(100 - p)\,\%$ prvotne cene. Podražitev $p\,\%$: nova cena je $(100 + p)\,\%$.
- Pri vsaki nalogi najprej določi osnovo.

## Drugače: Kot zgodba

Zala je statističarka nogometne ekipe. Trener jo je vprašal: »Kdo naj izvaja enajstmetrovke, Jan ali Tilen?« Jan je zadel $8$ od $10$, Tilen $12$ od $16$.

Zala je najprej hotela reči »Tilen, saj je zadel več«. Potem se je spomnila, da je Tilen tudi streljal večkrat. Zato si je zamislila, da bi vsak streljal $100$-krat. Jan zadene $8$ od $10$, torej $80$ od $100$. Tilen zadene $12$ od $16$; to je $3$ od $4$, torej $75$ od $100$.

»Jan, z $80\,\%$,« je rekla trenerju. »Tilen ima $75\,\%$.«

Po tekmi je klub prodajal drese s popustom $20\,\%$. Dres je prej stal $50\,\text{€}$. Zala ni odštela $20$ evrov, ampak je izračunala $20\,\%$ od $50\,\text{€}$, kar je $10\,\text{€}$, in plačala $40\,\text{€}$. Pri obeh odločitvah se je najprej vprašala isto: »Kaj je tukaj celota?«

## Drugače: Korak za korakom s številkami

Sklepni račun prek $1\,\%$ deluje pri vseh treh vrstah nalog.

**Delež:** koliko je $15\,\%$ od $240\,\text{€}$?

| Korak | Račun |
|---|---|
| $100\,\%$ | $240\,\text{€}$ |
| $1\,\%$ | $240 : 100 = 2{,}4\,\text{€}$ |
| $15\,\%$ | $15 \cdot 2{,}4 = 36\,\text{€}$ |

**Osnova:** $75\,\%$ cene je $63\,\text{€}$. Kolikšna je cela cena?

| Korak | Račun |
|---|---|
| $75\,\%$ | $63\,\text{€}$ |
| $1\,\%$ | $63 : 75 = 0{,}84\,\text{€}$ |
| $100\,\%$ | $0{,}84 \cdot 100 = 84\,\text{€}$ |

**Odstotek:** $18$ zadetkov od $24$ metov. Delež delimo z osnovo in pomnožimo s $100$: $\dfrac{18}{24} \cdot 100 = 75$, torej $75\,\%$.

Vedno: zgoraj zapiši, kaj je $100\,\%$, nato pojdi na $1\,\%$ in od tam na iskano vrstico.

## Preveri se

? Rokometaš je zadel $6$ od $8$ strelov, kar je $75\,\%$. Kaj je v tem primeru osnova?
- $6$
~ $6$ je delež: zadeti streli so le del vseh strelov.
+ $8$
- $75$
~ $75$ je odstotek, ne osnova; pove, koliko stotink osnove je delež.
- $100$
~ Osnovi ustreza $100\,\%$, sama osnova pa je število strelov, $8$.
> Osnova je celota, torej vseh $8$ strelov. Delež je $6$ zadetih, odstotek $75\,\%$.

? Trije strelci: A je zadel $16$ od $20$, B $9$ od $12$, C $14$ od $25$. Razvrsti jih od najbolj do najmanj uspešnega.
+ A, B, C
- A, C, B
~ To je razvrstitev po številu zadetkov. C je metal največkrat, zato mu več zadetkov ne prinese višjega odstotka.
- B, A, C
~ To je razvrstitev po najmanj zgrešenih metih. Tudi to ne upošteva, kolikokrat je kdo metal.
> A: $80\,\%$, B: $75\,\%$, C: $56\,\%$. Uspešnost primerjamo z odstotki.

? Kaj se zgodi s ceno žoge, če jo najprej podražijo za $20\,\%$, nato pa pocenijo za $20\,\%$?
- Cena je enaka kot na začetku.
~ Odstotka se ne izničita, ker se drugi računa od večje, podražene cene.
+ Cena je nižja kot na začetku.
- Cena je višja kot na začetku.
~ Popust se računa od višje cene, zato odvzame več evrov, kot jih je dodala podražitev.
> Pri $100\,\text{€}$: $100 \cdot 1{,}2 = 120\,\text{€}$, nato $120 \cdot 0{,}8 = 96\,\text{€}$. Cena je nižja za $4\,\text{€}$.

? Junak v igri ima $250$ točk življenja. Napad mu vzame $30\,\%$ točk. Koliko točk mu ostane?
- $75$
~ To so izgubljene točke, ne preostale. Naloga sprašuje po ostanku.
- $220$
~ Odštel si $30$ točk namesto $30\,\%$ od $250$.
+ $175$
> Izguba: $250 \cdot 0{,}3 = 75$ točk. Ostane $250 - 75 = 175$ točk, kar je $70\,\%$.

? Po popustu $20\,\%$ stane teniški lopar $48\,\text{€}$. Kolikšna je bila prvotna cena?
- $57{,}60\,\text{€}$
~ To je $48\,\text{€}$ in še $20\,\%$ od $48\,\text{€}$. Popust je bil izračunan od prvotne cene, ne od $48\,\text{€}$.
- $68\,\text{€}$
~ Prištel si $20$ evrov. Odstotek ni znesek v evrih.
+ $60\,\text{€}$
- $38{,}40\,\text{€}$
~ Popust si odštel še enkrat. Iščeš ceno pred popustom, ki je višja od $48\,\text{€}$.
> $48\,\text{€}$ je $80\,\%$ prvotne cene. $1\,\%$ je $48 : 80 = 0{,}6\,\text{€}$; $100\,\%$ je $60\,\text{€}$. Preizkus: $60 \cdot 0{,}8 = 48$.

:::simboli
d | delež | d = o \cdot \frac{p}{100} | | del osnove
o | osnova (celota) | o = \frac{d \cdot 100}{p} | | ustreza 100 %
p | odstotek | p = \frac{d}{o} \cdot 100 | | zapišemo p %; 1 % = 1/100
:::
