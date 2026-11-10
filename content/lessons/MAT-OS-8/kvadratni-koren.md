---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Maja z družino načrtuje pohod okoli naravnega rezervata. Na zemljevidu ima rezervat obliko kvadrata. V legendi piše le: ploščina $49\,\text{km}^2$. Oče vpraša: »Koliko kilometrov bomo prehodili, če gremo enkrat naokoli?«

Za obseg Maja potrebuje stranico. Pozna pa le ploščino. Na zemljevidu je mreža kvadratkov s stranico $1\,\text{km}$. Maja prešteje, da je rezervat širok $7$ kvadratkov, in preveri: $7 \cdot 7 = 49$. Pot naokoli je dolga $4 \cdot 7 = 28$ kilometrov.

Sosednji rezervat meri $50\,\text{km}^2$. Tu štetje odpove: noben kvadrat iz celih kvadratkov nima točno $50$ kvadratkov. Kako dolga je njegova stranica? Odgovor da **kvadratni koren**. Potreboval ga boš vedno, ko boš iz ploščine iskal dolžino, kmalu pa tudi pri Pitagorovem izreku.

## Razlaga

**1. Kvadrat iz kvadratkov.** Iz $16$ enakih kvadratkov lahko zložiš kvadrat le na en način: $4$ vrste po $4$.

:::risba mreža
opis: Kvadrat iz 16 enakih kvadratkov: 4 vrste, v vsaki 4 kvadratki. Stranica kvadrata je dolga 4 kvadratke.
vrstic: 4
stolpcev: 4
spodaj: 4 kvadratki
desno: 4 vrste
:::

Stranica je dolga $4$ kvadratke, ker je $4 \cdot 4 = 16$. Iz ploščine smo dobili stranico. Pri tem nismo delili z $2$ ali s $4$. Iskali smo število, ki **pomnoženo samo s seboj** da ploščino.

**2. Tabela ploščin in stranic.** Če stranico daljšaš za en kvadratek, dobiš ploščine, ki jih poznaš iz lekcije o kvadratu števila:

| ploščina | stranica | ploščina | stranica |
|---|---|---|---|
| 1 | 1 | 81 | 9 |
| 4 | 2 | 100 | 10 |
| 9 | 3 | 121 | 11 |
| 16 | 4 | 144 | 12 |
| 25 | 5 | 169 | 13 |
| 36 | 6 | 196 | 14 |
| 49 | 7 | 225 | 15 |
| 64 | 8 | | |

Števila v stolpcih »ploščina« so **popolni kvadrati**: njihova stranica je naravno število. Tabelo zdaj beri od ploščine proti stranici.

:::premisli
Kvadrat s ploščino $4$ ima stranico $2$. Kolikšna je stranica kvadrata s ploščino $400$, ki je $100$-krat večja? Kolikokrat se je povečala stranica? Napovej, preden preveriš.
---
Stranica je $20$, ker je $20 \cdot 20 = 400$. Povečala se je le $10$-krat, saj je $10 \cdot 10 = 100$. Ploščina raste veliko hitreje kot stranica.
:::

**3. Znak za koren.** Šele zdaj vpeljemo simbol. Stranico kvadrata s ploščino $a$ zapišemo $\sqrt{a}$ in preberemo »kvadratni koren iz $a$«. Število pod korenom je **korenjenec**, računanju korena pravimo **korenjenje**.

$$\sqrt{a} = b \ \text{ pomeni } \ b^2 = a, \quad a \ge 0,\ b \ge 0$$

Tako je $\sqrt{49} = 7$, ker je $7^2 = 49$. Korenjenje razveljavi kvadriranje: $\left(\sqrt{a}\right)^2 = a$.

Dve omejitvi:

- Koren negativnega števila ne obstaja. Kvadrat vsakega števila je $\ge 0$, zato nobeno število na kvadrat ne da $-9$. Kvadrata s ploščino $-9$ tudi ni.
- $\sqrt{16}$ je samo $4$, ne »$\pm 4$«. Res je $(-4)^2 = 16$, a znak $\sqrt{\ }$ vedno pomeni nenegativno število, tako kot je stranica vedno pozitivna.

**4. Decimalna števila.** $\sqrt{0{,}25} = 0{,}5$, ker je $0{,}5 \cdot 0{,}5 = 0{,}25$. Korenjenec ima dve decimalki, koren eno. Zato je $\sqrt{0{,}49} = 0{,}7$ in ne $0{,}07$.

**5. Med dvema kvadratoma.** Števila $50$ ni v tabeli. Postavi ploščine in stranice na dve vzporedni številski premici:

```
ploščina:  49 · 50 ··········· 64
stranica:   7 · ?  ···········  8
```

Ker je $49 < 50 < 64$, je stranica med $7$ in $8$. Ker je $50$ tik ob $49$, je stranica le malo nad $7$. Splošno: če je $n^2 < a < (n+1)^2$, je $n < \sqrt{a} < n + 1$. To je **ocena brez računala**.

Natančneje oceniš s poskusi. $7{,}1^2 = 50{,}41$ je že preveč, $7^2 = 49$ premalo, zato je $7 < \sqrt{50} < 7{,}1$. Decimalke korena $\sqrt{50}$ se nikoli ne končajo, zato pišemo $\sqrt{50} \approx 7{,}1$.

V simulaciji spodaj (»Kvadratni koren in približki«) nastavi ploščino na $50$ in dvakrat klikni »Približaj (+1 decimalka)«. Opazuj, kako se odsek na premici, v katerem leži stranica, vsakič skrči na desetino.

:::premisli
Brez računala: ali je $\sqrt{60}$ večji ali manjši od $7{,}5$? Najprej ugani, nato preveri s kvadriranjem.
---
Večji. $7{,}5^2 = 56{,}25$, kar je manj od $60$. Kvadrat s stranico $7{,}5$ je premajhen, zato je $\sqrt{60} > 7{,}5$ (približno $7{,}7$).
:::

**6. Delno korenjenje.** Rezervat s ploščino $50\,\text{km}^2$ razreži v mrežo $5 \times 5$ manjših kvadratov. Vsak ima ploščino $50 : 25 = 2$, torej stranico $\sqrt{2}$. Stranica velikega kvadrata je sestavljena iz $5$ takih stranic:

$$\sqrt{50} = \sqrt{25 \cdot 2} = \sqrt{25} \cdot \sqrt{2} = 5\sqrt{2}$$

Temu pravimo **delno korenjenje**: iz korenjenca izluščimo popolni kvadrat. Pravilo je $\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}$ za $a, b \ge 0$. Izluščimo **največji** popolni kvadrat, sicer delo ni dokončano.

Za vsoto takega pravila ni: $\sqrt{9 + 16} = \sqrt{25} = 5$, $\sqrt{9} + \sqrt{16}$ pa je $7$.

## Rešeni primeri

### Primer 1 (lažji): park na zemljevidu

Na zemljevidu mesta ima kvadratni park ploščino $2500\,\text{m}^2$. Koliko metrov prehodiš, če greš ob eni njegovi stranici?

**Podatki:** park je kvadrat, ploščina $S = 2500\,\text{m}^2$
**Iščemo:** dolžino stranice $a$

:::formula
$a = \sqrt{S}$
:::

**Rešitev:**

1. Razstavimo na popolna kvadrata: $2500 = 25 \cdot 100$. Zato je $\sqrt{2500} = 5 \cdot 10 = 50$.
2. Preverimo s kvadriranjem: $50 \cdot 50 = 2500$. ✓
3. Odgovor: ob eni stranici parka prehodiš $50\,\text{m}$.

### Primer 2: delno korenjenje

Delno koreni $\sqrt{72}$.

**Podatki:** korenjenec $72$
**Iščemo:** zapis $b\sqrt{c}$, pri katerem $c$ nima več popolnega kvadrata za faktor

:::formula
$\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}$ za $a, b \ge 0$
:::

**Rešitev:**

1. Popolni kvadrati, ki delijo $72$, so $4$, $9$ in $36$. Vzamemo največjega: $72 = 36 \cdot 2$.
2. Razbijemo koren na dva korena: $\sqrt{72} = \sqrt{36} \cdot \sqrt{2}$.
3. Popolni kvadrat korenimo: $\sqrt{36} = 6$, zato je $\sqrt{72} = 6\sqrt{2}$.
4. Preverimo s kvadriranjem: $6^2 \cdot 2 = 36 \cdot 2 = 72$. ✓
5. Odgovor: $\sqrt{72} = 6\sqrt{2}$.

Z manjšim kvadratom bi dobil $\sqrt{72} = 2\sqrt{18}$. To ni napačno, a ni dokončano: $18$ ima še faktor $9$.

### Primer 3 (težji): pot okoli rezervata

Majin sosednji rezervat je kvadrat s ploščino $50\,\text{km}^2$. Brez računala oceni njegovo stranico na eno decimalko. Nato oceni, kako dolga je pot enkrat naokoli.

**Podatki:** rezervat je kvadrat, $S = 50\,\text{km}^2$, računanje brez računala
**Iščemo:** stranico $a$ na eno decimalko in obseg $o$

:::formula
$a = \sqrt{S}$; če je $n^2 < S < (n+1)^2$, je $n < \sqrt{S} < n+1$

Obseg kvadrata: $o = 4a$
:::

**Rešitev:**

1. Sosednja popolna kvadrata sta $7^2 = 49$ in $8^2 = 64$. Ker je $49 < 50 < 64$, je $7 < a < 8$.
2. $50$ je zelo blizu $49$, zato poskusimo $7{,}1$: $7{,}1^2 = 50{,}41$, kar je več od $50$. Torej je $7 < a < 7{,}1$.
3. Za zaokroževanje preverimo sredino: $7{,}05^2 = 49{,}7025$, kar je manj od $50$. Stranica je daljša od $7{,}05$, zato je $a \approx 7{,}1\,\text{km}$.
4. Obseg je med $4 \cdot 7{,}05 = 28{,}2$ in $4 \cdot 7{,}1 = 28{,}4$ kilometra.
5. Odgovor: stranica meri približno $7{,}1\,\text{km}$, pot naokoli pa približno $28\,\text{km}$. Je le malo daljša kot pri rezervatu s ploščino $49\,\text{km}^2$.

### Primer 4 – zdaj ti

Kvadratno počivališče ob avtocesti ima na načrtu ploščino $300\,\text{m}^2$. Brez računala oceni dolžino njegove stranice na eno decimalko.

**Podatki:** počivališče je kvadrat, $S = 300\,\text{m}^2$, brez računala
**Iščemo:** stranico $a$ na eno decimalko

:::formula
$a = \sqrt{S}$; če je $n^2 < S < (n+1)^2$, je $n < \sqrt{S} < n+1$
:::

**Rešitev:**

1. $17^2 = 289$ in $18^2 = 324$. Ker je $289 < 300 < 324$, je $17 < a < 18$, bližje $17$.
2. Kvadriraj $17{,}3$ in $17{,}4$, nato še sredino $17{,}35$. Izračunaj sam, nato preveri:

:::premisli
Med katerima številoma z eno decimalko leži $a$? Koliko je $a$, zaokrožen na eno decimalko?
---
$17{,}3^2 = 299{,}29 < 300$ in $17{,}4^2 = 302{,}76 > 300$, zato je $17{,}3 < a < 17{,}4$. Ker je $17{,}35^2 = 301{,}0225 > 300$, je $a$ manjši od $17{,}35$, torej $a \approx 17{,}3\,\text{m}$.
:::

## Pogoste napake

- **Koren zamenjaš z deljenjem.** $\sqrt{36}$ ni $18$. Iščeš število, ki **samo s seboj** pomnoženo da $36$: to je $6$. Podobno: če se ploščina poveča $4$-krat, se stranica ne poveča $4$-krat, ampak $2$-krat.
- **Koren vsote razbiješ.** $\sqrt{36 + 64}$ ni $6 + 8$. Pravilo $\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}$ velja za produkt, ne za vsoto. Najprej seštej: $\sqrt{100} = 10$.
- **Decimalke prešteješ narobe.** $\sqrt{0{,}49}$ ni $0{,}07$, ker je $0{,}07^2 = 0{,}0049$. Koren ima pol toliko decimalk kot korenjenec: $0{,}7$.
- **Delno korenjenje ostane nedokončano.** $\sqrt{48} = 2\sqrt{12}$ še ni končni zapis, ker je $12 = 4 \cdot 3$. Takoj izlušči največji popolni kvadrat: $\sqrt{48} = \sqrt{16 \cdot 3} = 4\sqrt{3}$.
- **Znak $\pm$ in negativni korenjenec.** $\sqrt{16} = 4$, ne $\pm 4$. $\sqrt{-16}$ pa ne obstaja, ker noben kvadrat ni negativen.

## Povzetek

- $\sqrt{a}$ je stranica kvadrata s ploščino $a$: $\sqrt{a} = b$ pomeni $b^2 = a$, pri čemer $a \ge 0$ in $b \ge 0$.
- Popolni kvadrati do $15^2 = 225$ imajo naravne korene; poznaj jih na pamet.
- Koren negativnega števila ne obstaja. $\sqrt{16} = 4$, ne $\pm 4$.
- Decimalke: $\sqrt{0{,}49} = 0{,}7$; koren ima pol toliko decimalk kot korenjenec.
- Ocena brez računala: če je $n^2 < a < (n+1)^2$, je $n < \sqrt{a} < n+1$. Decimalke poiščeš s kvadriranjem poskusov.
- Delno korenjenje: $\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}$; izlušči največji popolni kvadrat, npr. $\sqrt{72} = 6\sqrt{2}$.
- Za vsoto pravilo ne velja: $\sqrt{9 + 16} = 5$, ne $7$.

## Drugače: Z analogijo

Kvadriranje in korenjenje sta kot vožnja tja in nazaj po isti cesti. Kvadriranje te iz kraja »stranica $7$« pripelje v kraj »ploščina $49$«. Korenjenje je vožnja nazaj: iz $49$ se vrneš v $7$. Tako tudi odštevanje razveljavi seštevanje.

Oceno korena si predstavljaj kot igro »više–niže«. Prijatelj si je zamislil $\sqrt{50}$. Rečeš »$7$?« in odgovori: »Više, $7^2 = 49$ je premalo.« Rečeš »$8$?«: »Niže, $64$ je preveč.« Nato poskusiš $7{,}1$: »Niže, $50{,}41$ je preveč.« Prijatelj vsakič le kvadrira tvoj poskus in ga primerja s $50$. Z vsakim krogom se območje zoži in skrito število ujameš vedno natančneje.

## Drugače: Iz vsakdanjega življenja

Želiš položiti ploščice na kvadratno teraso s ploščino $64\,\text{m}^2$. Koliko meri stranica? Iščeš $\sqrt{64} = 8\,\text{m}$.

Vrt kvadratne oblike ima ploščino $200\,\text{m}^2$. Stranico oceniš takole: $14^2 = 196$ in $15^2 = 225$, zato je stranica malo čez $14\,\text{m}$. To zadošča, da veš, koliko ograje kupiti: obseg je nekaj več kot $4 \cdot 14 = 56\,\text{m}$.

Ko vrtnar ploščino kvadratne grede podvoji, ne potrebuje dvakrat več ograje. Stranica se poveča le približno $1{,}4$-krat, ker je $1{,}4^2 = 1{,}96$, kar je skoraj $2$.

## Drugače: Korak za korakom s številkami

Recept za delno korenjenje, na primeru $\sqrt{180}$:

1. Razcepi korenjenec na prafaktorje: $180 = 2 \cdot 2 \cdot 3 \cdot 3 \cdot 5 = 2^2 \cdot 3^2 \cdot 5$.
2. Poišči pare enakih faktorjev: par $2 \cdot 2$ in par $3 \cdot 3$.
3. Iz vsakega para pride ven en faktor: $2$ in $3$. Faktor $5$ nima para.
4. Zmnoži, kar je prišlo ven: $2 \cdot 3 = 6$. Pod korenom ostane $5$.
5. Rezultat: $\sqrt{180} = 6\sqrt{5}$.
6. Preveri: $6^2 \cdot 5 = 36 \cdot 5 = 180$. ✓

## Drugače: Bolj natančno

Pravilo $\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}$ za $a, b \ge 0$ izhaja iz definicije korena. Označimo $x = \sqrt{a}$ in $y = \sqrt{b}$, torej $x^2 = a$ in $y^2 = b$. Potem je

$$(x \cdot y)^2 = x^2 \cdot y^2 = a \cdot b.$$

Število $x \cdot y$ je nenegativno in njegov kvadrat je $a \cdot b$, zato je po definiciji $x \cdot y = \sqrt{a \cdot b}$.

Tudi ocena je upravičena. Za nenegativna števila večje število da večji kvadrat. Če je $n^2 < a < (n+1)^2$, mora zato veljati $n < \sqrt{a} < n+1$.

## Preveri se

? Katero število ne sodi med ostala, ker ni popoln kvadrat?
- $121$
~ $121 = 11 \cdot 11$, torej je popoln kvadrat. Morda te je zmotilo, da je liho.
- $169$
~ $169 = 13 \cdot 13$. Popolne kvadrate do $15^2$ najdeš v tabeli v razlagi.
+ $128$
- $196$
~ $196 = 14 \cdot 14$, torej je popoln kvadrat.
> $11^2 = 121$ in $12^2 = 144$, zato $128$ leži med zaporednima kvadratoma in ni popoln kvadrat. Hiter znak: popolni kvadrat se nikoli ne konča na $8$.

? Koliko je $\sqrt{0{,}49}$?
- $0{,}07$
~ $0{,}07^2 = 0{,}0049$. Koren ima pol toliko decimalk kot korenjenec, torej eno.
- $0{,}245$
~ To je $0{,}49 : 2$. Korenjenje ni deljenje z $2$.
+ $0{,}7$
- $7$
~ $7^2 = 49$, ne $0{,}49$. Pozabil si na decimalno vejico.
> $0{,}7 \cdot 0{,}7 = 0{,}49$, zato je $\sqrt{0{,}49} = 0{,}7$.

? Ploščina kvadratne parcele se poveča s $25\,\text{m}^2$ na $100\,\text{m}^2$, torej $4$-krat. Kaj se zgodi z dolžino stranice?
- Poveča se $4$-krat.
~ To bi veljalo, če bi stranica rasla enako kot ploščina. Ploščina je stranica krat stranica, zato stranica raste počasneje.
+ Poveča se $2$-krat.
- Poveča se za $75\,\text{m}$.
~ $75\,\text{m}^2$ je razlika ploščin, ne stranic. Stranica zraste s $5\,\text{m}$ na $10\,\text{m}$.
- Poveča se $16$-krat.
~ $16 = 4^2$: faktor si kvadriral, namesto da bi ga korenil.
> $\sqrt{25} = 5$ in $\sqrt{100} = 10$. Stranica se poveča $\sqrt{4} = 2$-krat.

? Tina računa takole: (1) $\sqrt{36 + 64} = \sqrt{36} + \sqrt{64}$, (2) $\sqrt{36} + \sqrt{64} = 6 + 8$, (3) $6 + 8 = 14$. Kateri korak je napačen?
- Korak (2)
~ $\sqrt{36} = 6$ in $\sqrt{64} = 8$ sta pravilna korena.
- Korak (3)
~ $6 + 8 = 14$ je pravilen seštevek. Napaka je prej.
+ Korak (1)
- Noben, rezultat je pravilen.
~ Preizkus s kvadriranjem: $14^2 = 196$, ne $100$. Rezultat ne more biti pravilen.
> Korena vsote ne smeš razbiti na vsoto korenov. Najprej seštej: $\sqrt{100} = 10$. Razbijanje velja le za produkt.

? Kvadratna parcela v kampu ima ploščino $90\,\text{m}^2$. Med katerima zaporednima naravnima številoma metrov je dolžina njene stranice?
- med $8$ in $9$
~ $9^2 = 81$ je še manj kot $90$, zato je stranica daljša od $9\,\text{m}$.
+ med $9$ in $10$
- med $22$ in $23$
~ $90 : 4 = 22{,}5$: ploščino si delil s $4$, kot da bi iz obsega računal stranico. Tu potrebuješ koren.
- med $45$ in $46$
~ $90 : 2 = 45$: koren si zamenjal z deljenjem z $2$.
> $9^2 = 81 < 90 < 100 = 10^2$, zato je stranica med $9\,\text{m}$ in $10\,\text{m}$ (približno $9{,}5\,\text{m}$).

:::simboli
a | število pod korenom | | | a ≥ 0; v a = √S stranica kvadrata
b | kvadratni koren števila a | b = \sqrt{a} | | b ≥ 0 in b² = a; v √(a · b) drugo število
x, y | kvadratna korena števil a in b | | | x = √a, y = √b
S | ploščina kvadrata | | | stranica je √S
n | naravno število za oceno korena | | | iz n² < S < (n + 1)² sledi n < √S < n + 1
o | obseg kvadrata | o = 4a |
:::
