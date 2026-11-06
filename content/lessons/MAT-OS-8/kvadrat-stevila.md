---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Lana in Tim pečeta pecivo. Recept je napisan za kvadratni pekač s stranico $15\,\text{cm}$, doma pa imata pekač s stranico $30\,\text{cm}$. Tim reče: »Stranica je dvakrat daljša, torej podvojiva recept.«

Ima prav? Testo pokrije dno pekača, zato šteje ploščina dna, ne stranica. Mali pekač ima dno $15 \cdot 15$ kvadratnih centimetrov, veliki $30 \cdot 30$. Produktu števila s samim seboj pravimo **kvadrat števila**. Ko ga znaš izračunati in hitro oceniti, Timovo trditev preveriš v eni vrstici. Kvadrate boš potreboval tudi pri korenih, Pitagorovem izreku in vseh ploščinah.

## Razlaga

Snov gradimo v majhnih korakih. Za vsakim je kratek preizkus: reši ga v mislih, šele nato poglej rešitev v oklepaju.

**Korak 1: kaj je kvadrat.** Kvadrat števila $a$ je produkt števila s samim seboj:

$$a^2 = a \cdot a$$

Beremo »$a$ na kvadrat«. To je potenca z osnovo $a$ in eksponentom $2$. Ime prihaja iz geometrije: kvadrat s stranico $a$ ima ploščino $a \cdot a$.

Zdaj lahko presodimo Tima. $15^2 = 225$ in $30^2 = 900$, dno velikega pekača je torej $900 : 225 = 4$-krat večje. Recept je treba početveriti, ne podvojiti. Ko stranico podvojiš, se podvojita dolžina **in** širina, zato ploščina zraste $2 \cdot 2 = 4$-krat.

*Preizkus:* Koliko je $8^2$? (Rešitev: $8 \cdot 8 = 64$, ne $16$.)

**Korak 2: popolni kvadrati.** Kvadratom naravnih števil pravimo **popolni kvadrati**. Znaj jih na pamet, ker so opora za vse ocene:

| $n$ | $n^2$ | $n$ | $n^2$ |
|---|---|---|---|
| $1$ | $1$ | $9$ | $81$ |
| $2$ | $4$ | $10$ | $100$ |
| $3$ | $9$ | $11$ | $121$ |
| $4$ | $16$ | $12$ | $144$ |
| $5$ | $25$ | $13$ | $169$ |
| $6$ | $36$ | $14$ | $196$ |
| $7$ | $49$ | $15$ | $225$ |
| $8$ | $64$ | $20$ | $400$ |

*Preizkus:* Je $150$ popolni kvadrat? (Rešitev: ne, leži med $12^2 = 144$ in $13^2 = 169$.)

**Korak 3: negativna osnova.** Produkt dveh negativnih števil je pozitiven, zato je $(-4)^2 = (-4) \cdot (-4) = 16$. Števili $4$ in $-4$ imata enak kvadrat. Kvadrat ni nikoli negativen: $a^2 \ge 0$ za vsako število $a$.

*Preizkus:* Koliko je $(-7)^2$? (Rešitev: $49$.)

**Korak 4: oklepaj odloča.** Brez oklepaja se kvadrira le število neposredno pred eksponentom. Zato je $-4^2 = -(4 \cdot 4) = -16$, $(-4)^2$ pa $16$.

:::premisli
Sošolka trdi, da imata $-3^2$ in $(-3)^2$ isto vrednost, ker »je minus tako ali tako pred trojko«. Napovej obe vrednosti in pojasni, zakaj se razlikujeta.
---
$(-3)^2 = 9$, ker kvadriramo celo število $-3$. Pri $-3^2$ velja eksponent le za $3$: najprej $3^2 = 9$, nato minus, torej $-9$. Potenca ima prednost pred predznakom pred njo.
:::

**Korak 5: ulomki in decimalna števila.** Pri ulomku kvadriramo števec in imenovalec: $\left(\dfrac{2}{3}\right)^2 = \dfrac{2 \cdot 2}{3 \cdot 3} = \dfrac{4}{9}$. Pri decimalnem številu najprej pomnožimo brez vejice, nato štejemo decimalke. Kvadrat jih ima dvakrat toliko kot osnova: $(0{,}3)^2 = 0{,}09$, ker je $3 \cdot 3 = 9$, decimalki pa sta dve.

*Preizkus:* Koliko je $(0{,}5)^2$? (Rešitev: $0{,}25$.)

:::premisli
Ali je kvadrat števila vedno večji od števila? Preden odgovoriš, preizkusi $3$, $1$ in $0{,}5$.
---
Ne. $3^2 = 9$ je več kot $3$, $1^2 = 1$ je enako $1$; $(0{,}5)^2 = 0{,}25$ pa je manj kot $0{,}5$. Množenje z $0{,}5$ pomeni vzeti polovico, zato se število zmanjša. Kvadrat je večji od števila le, če je število večje od $1$ ali negativno.
:::

**Korak 6: ocenjevanje.** Števila, ki ga ni v tabeli, ujameš med dva znana kvadrata. Za $27^2$: ker je $20 < 27 < 30$, je $400 < 27^2 < 900$. Ker je $27$ bliže $30$, bo kvadrat bliže $900$; natančno je $729$. Lahko pa osnovo zaokrožiš: $48^2 \approx 50^2 = 2500$. Pravi rezultat, $2304$, je malo manjši, ker je $48 < 50$. Enako gre z decimalnimi števili: $(6{,}8)^2$ je malo manj kot $7^2 = 49$, natančno $46{,}24$.

V simulaciji spodaj (Kvadrat števila s ploščino) nastavi število na $23$. Kvadrat $23 \times 23$ se razreže na kvadrat $20 \times 20$, kvadrat $3 \times 3$ in pravokotnika $20 \times 3$. Preštej pravokotnika: sta dva, zato je $23^2 = 400 + 60 + 60 + 9 = 529$.

*Preizkus:* Oceni $31^2$. (Rešitev: malo več kot $30^2 = 900$; natančno $961$.)

**Korak 7: zadnja števka.** Zadnja števka kvadrata je odvisna le od zadnje števke osnove:

| osnova se konča na | kvadrat se konča na | osnova se konča na | kvadrat se konča na |
|---|---|---|---|
| $0$ | $0$ | $5$ | $5$ |
| $1$ | $1$ | $6$ | $6$ |
| $2$ | $4$ | $7$ | $9$ |
| $3$ | $9$ | $8$ | $4$ |
| $4$ | $6$ | $9$ | $1$ |

Kvadrat naravnega števila se nikoli ne konča na $2$, $3$, $7$ ali $8$. Število $1237$ zato ne more biti popolni kvadrat.

*Preizkus:* Na katero števko se konča $38^2$? (Rešitev: na $4$, ker je $8 \cdot 8 = 64$.)

## Rešeni primeri

### Primer 1 (lažji): trije kvadrati z minusom

Izračunaj $9^2$, $(-6)^2$ in $-6^2$.

**Podatki:** izrazi $9^2$, $(-6)^2$ in $-6^2$
**Iščemo:** vrednost vsakega izraza

:::formula
$a^2 = a \cdot a$; eksponent velja le za tisto, kar stoji neposredno pred njim.
:::

**Rešitev:**

1. $9^2 = 9 \cdot 9 = 81$.
2. $(-6)^2 = (-6) \cdot (-6) = 36$, ker je produkt dveh negativnih števil pozitiven.
3. $-6^2 = -(6 \cdot 6) = -36$, ker eksponent velja samo za $6$, minus pa ostane pred njim.
4. Odgovor: vrednosti so $81$, $36$ in $-36$.

### Primer 2: ulomek in decimalno število

Izračunaj $\left(\dfrac{3}{5}\right)^2$ in $(1{,}2)^2$.

**Podatki:** izraza $\left(\dfrac{3}{5}\right)^2$ in $(1{,}2)^2$
**Iščemo:** vrednosti obeh kvadratov

:::formula
$\left(\dfrac{a}{b}\right)^2 = \dfrac{a^2}{b^2}$; kvadrat decimalnega števila ima dvakrat toliko decimalk kot osnova.
:::

**Rešitev:**

1. Ulomek: $\left(\dfrac{3}{5}\right)^2 = \dfrac{3^2}{5^2} = \dfrac{9}{25}$, ker pri množenju ulomkov množimo števec s števcem in imenovalec z imenovalcem.
2. Decimalno število brez vejice: $12 \cdot 12 = 144$.
3. Osnova $1{,}2$ ima eno decimalko, kvadrat dve: $(1{,}2)^2 = 1{,}44$.
4. Ocena za preizkus: $1{,}2$ je malo več kot $1$, zato mora biti kvadrat malo več kot $1$. Ujema se.
5. Odgovor: $\left(\dfrac{3}{5}\right)^2 = \dfrac{9}{25}$ in $(1{,}2)^2 = 1{,}44$.

### Primer 3 (težji): večji pekač za brownije

Recept za brownije je za kvadratni pekač s stranico $20\,\text{cm}$ in zahteva $200\,\text{g}$ čokolade. Ti imaš pekač s stranico $23\,\text{cm}$. Kolikokrat več testa potrebuješ in koliko čokolade, če naj bo pecivo enako visoko?

**Podatki:** stranica malega pekača $a_1 = 20\,\text{cm}$, stranica tvojega pekača $a_2 = 23\,\text{cm}$, čokolada po receptu $200\,\text{g}$
**Iščemo:** razmerje ploščin dna $\dfrac{p_2}{p_1}$ in maso čokolade za večji pekač

:::formula
$p = a^2$

razmerje ploščin $= \dfrac{p_2}{p_1}$
:::

**Rešitev:**

1. Ocena: $20 < 23 < 25$, zato je $23^2$ med $400$ in $625$.
2. Račun po delih: $23^2 = 23 \cdot 20 + 23 \cdot 3 = 460 + 69 = 529$, torej $p_2 = 529\,\text{cm}^2$. Zadnja števka se ujema: $3 \cdot 3 = 9$.
3. Mali pekač: $p_1 = 20^2\,\text{cm}^2 = 400\,\text{cm}^2$.
4. Razmerje: $\dfrac{529}{400} \approx 1{,}32$. Testa potrebuješ približno $1{,}3$-krat toliko.
5. Čokolada: $200\,\text{g} \cdot 1{,}3 = 260\,\text{g}$.
6. Odgovor: potrebuješ približno $1{,}3$-krat več testa in okoli $260\,\text{g}$ čokolade. Stranica je daljša le za $3\,\text{cm}$, dno pa je večje za $129\,\text{cm}^2$.

### Primer 4 – zdaj ti: deska za rezanje

Kvadratna deska za rezanje ima stranico $2{,}9\,\text{dm}$. Najprej oceni njeno ploščino, nato jo izračunaj.

**Podatki:** $a = 2{,}9\,\text{dm}$
**Iščemo:** ploščino $p$, najprej oceno, nato natančno vrednost

:::formula
$p = a^2$
:::

**Rešitev:**

1. Ocena: $2{,}9$ je malo manj kot $3$, zato bo $p$ malo manj kot $3^2 = 9\,\text{dm}^2$.
2. Množenje brez vejice: $29 \cdot 29 = 841$.
3. Zdaj ti: postavi decimalno vejico in rezultat primerjaj z oceno.

:::premisli
Koliko je $(2{,}9)^2$?
---
$2{,}9$ ima eno decimalko, kvadrat dve: $(2{,}9)^2 = 8{,}41$, torej $p = 8{,}41\,\text{dm}^2$. To je malo manj kot $9$, kot je napovedala ocena.
:::

## Pogoste napake

- **Kvadrat kot množenje z $2$.** Učenec računa $7^2 = 14$, ker misli, da »$2$ pomeni krat dva«. Eksponent pove, kolikokrat je osnova faktor v produktu: $7^2 = 7 \cdot 7 = 49$.
- **Minus brez oklepaja.** Učenec napiše $(-5)^2 = -25$ ali pa $-5^2 = 25$. Pri $(-5)^2$ kvadriramo celo negativno število in dobimo $25$; pri $-5^2$ se kvadrira le $5$, rezultat je $-25$.
- **Decimalna vejica.** Učenec zapiše $(0{,}4)^2 = 1{,}6$ ali $0{,}016$, ker ne prešteje decimalk. Kvadrat ima dvakrat toliko decimalk kot osnova: $0{,}16$. Pomaga ocena: kvadrat števila med $0$ in $1$ je manjši od tega števila.
- **»Dvakrat daljša stranica, dvakrat večja ploščina.«** Tako je mislil Tim. Podvojita se dolžina in širina, zato je ploščina štirikrat večja: $30^2 = 900 = 4 \cdot 225$.
- **Kvadrat vsote po delih.** $(3 + 4)^2 = 3^2 + 4^2 = 25$ je napačno. Najprej izračunaj oklepaj: $7^2 = 49$. Na sliki manjkata dva pravokotnika $3 \times 4$, in res je $25 + 24 = 49$.

## Povzetek

- Kvadrat števila: $a^2 = a \cdot a$; kvadrat s stranico $a$ ima ploščino $a^2$.
- Kvadrat ni nikoli negativen; $(-a)^2 = a^2$, toda $-a^2$ je negativno: $(-4)^2 = 16$, $-4^2 = -16$.
- Kvadrat ulomka: $\left(\dfrac{a}{b}\right)^2 = \dfrac{a^2}{b^2}$; kvadrat decimalnega števila ima dvakrat toliko decimalk.
- Kvadrat števila med $0$ in $1$ je manjši od števila.
- Dvakrat daljša stranica da štirikrat večjo ploščino.
- Kvadrat ocenimo tako, da osnovo ujamemo med dve okrogli števili ali jo zaokrožimo.
- Popolni kvadrat se ne konča na $2$, $3$, $7$ ali $8$.

## Drugače: Na sliki

Na karo papirju nariši kvadrat s stranico $4$ kvadratke. Vanj gredo $4$ vrstice po $4$ kvadratke, skupaj $16$. Zato je $4^2 = 16$; ime »kvadrat« pri številih izvira prav iz te slike.

Za $5^2$ kvadratu $4 \times 4$ dodaš eno vrstico in en stolpec. Dodani del ima obliko črke L in šteje $4 + 4 + 1 = 9$ kvadratkov, zato je $5^2 = 16 + 9 = 25$. Vsak naslednji L je za $2$ kvadratka večji, zato so kvadrati vsote zaporednih lihih števil:

$$1,\quad 1+3,\quad 1+3+5,\quad 1+3+5+7,\ \dots$$

Slika pokaže tudi, zakaj kvadrat hitro raste. Če stranico podvojiš, se v kvadrat prilegajo štirje stari kvadrati, ne dva. Iz $3^2 = 9$ tako dobiš $6^2 = 36 = 4 \cdot 9$.

## Drugače: Bolj natančno

**Zakaj je kvadrat vedno nenegativen?** Če je $a > 0$, je produkt dveh pozitivnih števil pozitiven. Če je $a < 0$, je produkt dveh negativnih števil pozitiven. Če je $a = 0$, je $0^2 = 0$. V vseh primerih velja $a^2 \ge 0$.

**Zakaj je $(-a)^2 = a^2$?** Ker je $(-a) \cdot (-a) = a \cdot a$: minus krat minus je plus.

**Zakaj je vsota lihih števil kvadrat?** Iz kvadrata $n \times n$ dobimo kvadrat s stranico $n + 1$ tako, da dodamo vrstico z $n$ kvadratki, stolpec z $n$ kvadratki in en kotni kvadratek:

$$(n+1)^2 = n^2 + 2n + 1$$

Za $n = 4$: $5^2 = 16 + 9 = 25$. Ker je $2n + 1$ vedno liho število, je $n^2$ vsota prvih $n$ lihih števil.

**Zakaj se kvadrat ne konča na $2$, $3$, $7$ ali $8$?** Zadnja števka produkta $a \cdot a$ je odvisna samo od zadnje števke števila $a$, ker desetice in stotice k enicam ne prispevajo ničesar. Preizkusiš vseh deset možnosti (tabela v razlagi) in dobiš le zadnje števke $0$, $1$, $4$, $5$, $6$ in $9$.

## Preveri se

? Katera trditev je pravilna?
- $(-6)^2 = -36$
~ Produkt dveh negativnih števil je pozitiven: $(-6) \cdot (-6) = 36$.
- $(0{,}2)^2 = 0{,}4$
~ To je $0{,}2 \cdot 2$. Kvadrat je $0{,}2 \cdot 0{,}2 = 0{,}04$, z dvema decimalkama.
- $-3^2 = 9$
~ Brez oklepaja se kvadrira le $3$, minus ostane: $-3^2 = -9$.
+ $(-3)^2 = 3^2$
> $(-3)^2 = (-3) \cdot (-3) = 9$ in $3^2 = 9$. Nasprotni števili imata enak kvadrat.

? Koliko je $\left(\dfrac{3}{4}\right)^2$?
+ $\dfrac{9}{16}$
- $\dfrac{6}{8}$
~ Števec in imenovalec si pomnožil z $2$. Kvadrat pomeni množenje s samim seboj: $3 \cdot 3$ in $4 \cdot 4$.
- $\dfrac{9}{4}$
~ Kvadrirati je treba tudi imenovalec, ker množimo ulomek z ulomkom.
- $\dfrac{3}{16}$
~ Kvadrirati je treba tudi števec, ne le imenovalec.
> $\left(\dfrac{3}{4}\right)^2 = \dfrac{3 \cdot 3}{4 \cdot 4} = \dfrac{9}{16}$.

? Ana je računala: $(0{,}7)^2 = 0{,}7 \cdot 0{,}7 = 4{,}9$. Kje je napaka?
- Napake ni, račun je pravilen.
~ Kvadrat števila med $0$ in $1$ je manjši od števila, $4{,}9$ pa je večje od $0{,}7$. Rezultat ne more biti pravilen.
- V prvem koraku: pravilno je $0{,}7 \cdot 2 = 1{,}4$.
~ Prvi korak je pravilen. $a^2$ pomeni $a \cdot a$, ne $a \cdot 2$.
+ V zadnjem koraku: kvadrat mora imeti dve decimalki, $0{,}49$.
- V zadnjem koraku: pravilno je $0{,}049$.
~ Decimalk je dvakrat toliko kot v osnovi, torej dve, ne tri.
> $7 \cdot 7 = 49$; ker ima $0{,}7$ eno decimalko, ima kvadrat dve: $(0{,}7)^2 = 0{,}49$.

? Primerjaj števili $0{,}9$ in $(0{,}9)^2$.
+ $(0{,}9)^2 < 0{,}9$
- $(0{,}9)^2 > 0{,}9$
~ Med pozitivnimi števili kvadriranje poveča le tista, ki so večja od $1$. Množenje z $0{,}9$ vzame manj kot celoto.
- $(0{,}9)^2 = 0{,}9$
~ Enaka sta le pri številih $0$ in $1$. $(0{,}9)^2 = 0{,}81$.
> $(0{,}9)^2 = 0{,}81$, kar je manj kot $0{,}90$. Vzeti $0{,}9$ od nečesa pomeni vzeti manj kot celoto.

? Kvadratni pekač za torto ima stranico $19\,\text{cm}$. Katera ocena ploščine dna je najboljša?
- približno $40\,\text{cm}^2$
~ To je $2 \cdot 20$. Kvadrat ni množenje z $2$, ampak s samim seboj.
- približno $80\,\text{cm}^2$
~ To je $4 \cdot 20$, ocena obsega v $\text{cm}$, ne ploščine.
+ malo manj kot $400\,\text{cm}^2$
- približno $4000\,\text{cm}^2$
~ $20 \cdot 20 = 400$, ne $4000$: ena ničla preveč.
> $19$ je malo manj kot $20$, zato je $19^2$ malo manj kot $20^2 = 400$. Natančno: $19^2 = 361\,\text{cm}^2$.

:::simboli
a | število, ki ga kvadriramo | | | a² = a · a; v p = a² stranica kvadrata
b | imenovalec ulomka | | | b ≠ 0
n | naravno število | | | (n + 1)² = n² + 2n + 1
p | ploščina kvadrata | p = a^2 |
a_1 | stranica malega pekača | |
a_2 | stranica večjega pekača | |
p_1 | ploščina dna malega pekača | p_1 = a_1^2 |
p_2 | ploščina dna večjega pekača | p_2 = a_2^2 | | razmerje ploščin p₂ : p₁
:::
