---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Že znaš urediti kemijsko enačbo in izračunati množino snovi iz mase: $n = \dfrac{m}{M}$. Znaš tudi, da koeficienti v enačbi povedo, v kakšnem razmerju delci reagirajo.

Stehiometrija združi vse troje in odgovori na praktična vprašanja:

- Koliko produkta nastane iz dane količine reaktanta?
- Koliko reaktanta moram odtehtati, da dobim želeno količino produkta?
- Kaj, če reaktantov ne vzamem v pravem razmerju? Kateri se porabi prej in koliko drugega ostane?

Brez teh izračunov ne gre v laboratoriju, v farmaciji ali v industriji gnojil. Vedno je treba vedeti, koliko česa odmeriti, da ne zavržemo dragih surovin.

## Razlaga

**1. Kaj pove enačba.** Koeficienti v urejeni enačbi povedo razmerje **množin** (ne mas!). Za enačbo

$$2\,\mathrm{H_2} + \mathrm{O_2} \rightarrow 2\,\mathrm{H_2O}$$

velja: $2\,\text{mol}$ vodika reagira z $1\,\text{mol}$ kisika in nastaneta $2\,\text{mol}$ vode. Razmerje množin je $n(\mathrm{H_2}) : n(\mathrm{O_2}) : n(\mathrm{H_2O}) = 2 : 1 : 2$.

:::premisli
Ali $2\,\text{g}$ vodika reagira z natanko $1\,\text{g}$ kisika?
---
Ne. Razmerje $2 : 1$ velja za mole. $2\,\text{g}$ vodika je $1\,\text{mol}$ $\mathrm{H_2}$, ki potrebuje $0{,}5\,\text{mol}$ $\mathrm{O_2}$, to pa je $0{,}5\,\text{mol} \cdot 32\,\text{g/mol} = 16\,\text{g}$ kisika.
:::

**2. Splošno pravilo.** Stehiometrijski koeficient snovi označimo z grško črko $\nu$ (»ni«). Za snov A (znana) in snov B (iskana) s koeficientoma $\nu(\mathrm{A})$ in $\nu(\mathrm{B})$:

$$\frac{n(\mathrm{B})}{n(\mathrm{A})} = \frac{\nu(\mathrm{B})}{\nu(\mathrm{A})}$$

**3. Postopek računanja iz enačbe** (vedno enak):

1. Zapiši **urejeno** enačbo.
2. Podano maso pretvori v množino: $n = m / M$.
3. Z razmerjem koeficientov izračunaj množino iskane snovi.
4. Množino pretvori v maso: $m = n \cdot M$.

Maso ene snovi torej nikoli ne pretvarjaš neposredno v maso druge. Vmes je vedno množina.

**4. Prebitni reaktant in omejitveni reaktant.** Pogosto reaktantov ne vzamemo v točno stehiometrijskem razmerju. Tisti, ki se porabi do konca, je **omejitveni reaktant** (omeji, koliko produkta nastane). Tisti, ki ga ostane, je **prebitni reaktant**.

**Kako ugotoviš omejitveni reaktant:** za vsak reaktant izračunaj $\dfrac{n}{\nu}$ (množino, deljeno s koeficientom). Reaktant z **manjšim** količnikom je omejitveni.

**5. Količino produkta vedno računaš iz omejitvenega reaktanta.** Prebitni reaktant ima »preveč«, zato po njem ne moreš računati. Koliko prebitnega reaktanta ostane, dobiš tako, da od začetne množine odšteješ porabljeno.

:::premisli
Za $2\,\mathrm{H_2} + \mathrm{O_2} \rightarrow 2\,\mathrm{H_2O}$ imaš $3\,\text{mol}$ vodika in $2\,\text{mol}$ kisika. Vodika je več. Kateri reaktant je omejitveni?
---
Vodik. Količnika sta $\dfrac{3}{2} = 1{,}5$ za $\mathrm{H_2}$ in $\dfrac{2}{1} = 2$ za $\mathrm{O_2}$. Vodik se porabi prvi, ker ga reakcija potrebuje dvakrat več kot kisika. Ostane $2 - 1{,}5 = 0{,}5\,\text{mol}$ kisika.
:::

**6. Simulacija.** V simulaciji spodaj (»Omejitveni reaktant«) izberi reakcijo vodika s kisikom, nastavi $6$ molekul $\mathrm{H_2}$ in $4$ molekule $\mathrm{O_2}$. Najprej napovej, koliko molekul vode nastane in kateri reaktant ostane, nato pritisni **Reagiraj** in preveri. Potem poišči število molekul kisika, pri katerem ne ostane nič. V drugi simulaciji (»Mase snovi pri reakciji«) preveri primer 1: pri $4\,\text{g}$ vodika je masa reaktantov enaka masi produktov.

**Uporabljene relativne atomske mase** (zaokrožene): $\mathrm{H} = 1$, $\mathrm{C} = 12$, $\mathrm{O} = 16$, $\mathrm{Na} = 23$, $\mathrm{Mg} = 24$, $\mathrm{Ca} = 40$, $\mathrm{Cl} = 35{,}5$.

## Rešeni primeri

### Primer 1: masa produkta iz mase reaktanta

Koliko gramov vode nastane pri popolnem zgorevanju $4{,}0\,\text{g}$ vodika?

$$2\,\mathrm{H_2} + \mathrm{O_2} \rightarrow 2\,\mathrm{H_2O}$$

**Podatki:** $m(\mathrm{H_2}) = 4{,}0\,\text{g}$, enačba $2\,\mathrm{H_2} + \mathrm{O_2} \rightarrow 2\,\mathrm{H_2O}$, kisika je dovolj (zgorevanje je popolno); $A_\mathrm{r}(\mathrm{H}) = 1$, $A_\mathrm{r}(\mathrm{O}) = 16$
**Iščemo:** maso vode $m(\mathrm{H_2O})$

:::formula
$n = \dfrac{m}{M}$

$\dfrac{n(\mathrm{B})}{n(\mathrm{A})} = \dfrac{\nu(\mathrm{B})}{\nu(\mathrm{A})}$

$m = n \cdot M$
:::

**Rešitev:**

1. Enačba je že urejena. To preverimo najprej, ker brez tega razmerje koeficientov ne bi bilo pravilno.
2. Maso vodika pretvorimo v množino, ker enačba govori o množinah: $M(\mathrm{H_2}) = 2\,\text{g/mol}$, zato $n(\mathrm{H_2}) = \dfrac{4{,}0\,\text{g}}{2\,\text{g/mol}} = 2{,}0\,\text{mol}$.
3. Razmerje koeficientov $\mathrm{H_2} : \mathrm{H_2O} = 2 : 2$, zato je $n(\mathrm{H_2O}) = 2{,}0\,\text{mol}$.
4. Množino pretvorimo v maso, ker nas zanima masa: $M(\mathrm{H_2O}) = 2 \cdot 1 + 16 = 18\,\text{g/mol}$, zato $m(\mathrm{H_2O}) = 2{,}0\,\text{mol} \cdot 18\,\text{g/mol} = 36\,\text{g}$.
5. **Odgovor:** nastane $36\,\text{g}$ vode.

### Primer 2: enake množine, različne mase

Pri segrevanju apnenca razpade kalcijev karbonat:

$$\mathrm{CaCO_3} \rightarrow \mathrm{CaO} + \mathrm{CO_2}$$

Koliko gramov žganega apna ($\mathrm{CaO}$) in koliko gramov $\mathrm{CO_2}$ nastane iz $50\,\text{g}$ $\mathrm{CaCO_3}$?

**Podatki:** $m(\mathrm{CaCO_3}) = 50\,\text{g}$, enačba $\mathrm{CaCO_3} \rightarrow \mathrm{CaO} + \mathrm{CO_2}$; $A_\mathrm{r}(\mathrm{Ca}) = 40$, $A_\mathrm{r}(\mathrm{C}) = 12$, $A_\mathrm{r}(\mathrm{O}) = 16$
**Iščemo:** $m(\mathrm{CaO})$ in $m(\mathrm{CO_2})$

:::formula
$n = \dfrac{m}{M}$

$n(\mathrm{CaO}) = n(\mathrm{CO_2}) = n(\mathrm{CaCO_3})$ (vsi koeficienti so $1$)

$m = n \cdot M$
:::

**Rešitev:**

1. Molska masa reaktanta (upoštevamo vse tri atome kisika): $M(\mathrm{CaCO_3}) = 40 + 12 + 3 \cdot 16 = 100\,\text{g/mol}$.
2. Maso pretvorimo v množino, ker koeficienti veljajo za mole: $n(\mathrm{CaCO_3}) = \dfrac{50\,\text{g}}{100\,\text{g/mol}} = 0{,}50\,\text{mol}$.
3. Vsi koeficienti so $1$, zato nastane po $0{,}50\,\text{mol}$ vsakega produkta.
4. Mase: $M(\mathrm{CaO}) = 40 + 16 = 56\,\text{g/mol}$, torej $m(\mathrm{CaO}) = 0{,}50\,\text{mol} \cdot 56\,\text{g/mol} = 28\,\text{g}$. $M(\mathrm{CO_2}) = 12 + 2 \cdot 16 = 44\,\text{g/mol}$, torej $m(\mathrm{CO_2}) = 0{,}50\,\text{mol} \cdot 44\,\text{g/mol} = 22\,\text{g}$.
5. **Preverimo z zakonom o ohranitvi mase:** $28\,\text{g} + 22\,\text{g} = 50\,\text{g}$, kar je enako začetni masi. Množine vseh treh snovi so enake ($0{,}50\,\text{mol}$), mase pa ne, ker ima vsaka snov drugačno molsko maso.
6. **Odgovor:** nastane $28\,\text{g}$ $\mathrm{CaO}$ in $22\,\text{g}$ $\mathrm{CO_2}$.

### Primer 3 (težji): prebitni reaktant

Zmešamo $12\,\text{g}$ magnezija in $10\,\text{g}$ kisika in magnezij zgori:

$$2\,\mathrm{Mg} + \mathrm{O_2} \rightarrow 2\,\mathrm{MgO}$$

Koliko gramov $\mathrm{MgO}$ nastane in koliko katerega reaktanta ostane?

**Podatki:** $m(\mathrm{Mg}) = 12\,\text{g}$, $m(\mathrm{O_2}) = 10\,\text{g}$, enačba $2\,\mathrm{Mg} + \mathrm{O_2} \rightarrow 2\,\mathrm{MgO}$; $A_\mathrm{r}(\mathrm{Mg}) = 24$, $A_\mathrm{r}(\mathrm{O}) = 16$
**Iščemo:** $m(\mathrm{MgO})$ in maso prebitnega reaktanta, ki ostane

:::formula
Omejitveni reaktant ima manjši količnik $\dfrac{n}{\nu}$.

Produkt računamo iz omejitvenega reaktanta: $\dfrac{n(\mathrm{B})}{n(\mathrm{A})} = \dfrac{\nu(\mathrm{B})}{\nu(\mathrm{A})}$

$n(\text{ostanek}) = n(\text{začetna}) - n(\text{porabljena})$
:::

**Rešitev:**

1. **Množini reaktantov**, ker lahko primerjamo samo mole, ne grame. $n(\mathrm{Mg}) = \dfrac{12\,\text{g}}{24\,\text{g/mol}} = 0{,}50\,\text{mol}$. $M(\mathrm{O_2}) = 32\,\text{g/mol}$, zato $n(\mathrm{O_2}) = \dfrac{10\,\text{g}}{32\,\text{g/mol}} = 0{,}3125\,\text{mol}$.
2. **Omejitveni reaktant.** Primerjamo $\dfrac{n}{\nu}$: za Mg je $\dfrac{0{,}50}{2} = 0{,}25$, za $\mathrm{O_2}$ je $\dfrac{0{,}3125}{1} = 0{,}3125$. Manjši količnik ima magnezij, zato je **magnezij omejitveni**, kisik pa prebitni.
3. **Produkt iz omejitvenega reaktanta**, ker se reakcija ustavi, ko ga zmanjka. $\mathrm{Mg} : \mathrm{MgO} = 2 : 2$, torej $n(\mathrm{MgO}) = 0{,}50\,\text{mol}$. $M(\mathrm{MgO}) = 24 + 16 = 40\,\text{g/mol}$, zato $m(\mathrm{MgO}) = 0{,}50 \cdot 40 = 20\,\text{g}$.
4. **Porabljeni kisik.** $\mathrm{Mg} : \mathrm{O_2} = 2 : 1$, zato se porabi $n(\mathrm{O_2}) = 0{,}25\,\text{mol}$.
5. **Ostanek kisika.** $0{,}3125 - 0{,}25 = 0{,}0625\,\text{mol}$, kar je $m = 0{,}0625 \cdot 32 = 2{,}0\,\text{g}$.
6. **Preverimo:** pred reakcijo $12 + 10 = 22\,\text{g}$, po reakciji $20\,\text{g}$ $\mathrm{MgO}$ in $2\,\text{g}$ $\mathrm{O_2}$, skupaj $22\,\text{g}$.
7. **Odgovor:** nastane $20\,\text{g}$ $\mathrm{MgO}$, ostane $2{,}0\,\text{g}$ kisika.

### Primer 4: zdaj ti

Natrij reagira s klorom v prebitku: $2\,\mathrm{Na} + \mathrm{Cl_2} \rightarrow 2\,\mathrm{NaCl}$. Koliko gramov natrijevega klorida nastane iz $4{,}6\,\text{g}$ natrija?

**Podatki:** $m(\mathrm{Na}) = 4{,}6\,\text{g}$, klor je v prebitku, enačba $2\,\mathrm{Na} + \mathrm{Cl_2} \rightarrow 2\,\mathrm{NaCl}$; $A_\mathrm{r}(\mathrm{Na}) = 23$, $A_\mathrm{r}(\mathrm{Cl}) = 35{,}5$
**Iščemo:** $m(\mathrm{NaCl})$

:::formula
$n = \dfrac{m}{M}$, $\dfrac{n(\mathrm{NaCl})}{n(\mathrm{Na})} = \dfrac{2}{2}$, $m = n \cdot M$
:::

**Rešitev:**

1. Klor je v prebitku, zato je natrij omejitveni in računamo iz njega.
2. Maso pretvorimo v množino: $n(\mathrm{Na}) = \dfrac{4{,}6\,\text{g}}{23\,\text{g/mol}} = 0{,}20\,\text{mol}$.
3. Razmerje $\mathrm{Na} : \mathrm{NaCl} = 2 : 2$, zato je $n(\mathrm{NaCl}) = 0{,}20\,\text{mol}$.
4. Izračunaj sam, nato preveri:

:::premisli
Kolikšna je masa nastalega NaCl?
---
$M(\mathrm{NaCl}) = 23 + 35{,}5 = 58{,}5\,\text{g/mol}$, zato $m(\mathrm{NaCl}) = 0{,}20\,\text{mol} \cdot 58{,}5\,\text{g/mol} = 11{,}7\,\text{g}$. Preverba: porabi se $0{,}10\,\text{mol}$ $\mathrm{Cl_2}$ ($7{,}1\,\text{g}$), in $4{,}6\,\text{g} + 7{,}1\,\text{g} = 11{,}7\,\text{g}$.
:::

## Pogoste napake

- **Računanje z masami namesto z množinami.** »Iz $200\,\text{g}$ $\mathrm{CaCO_3}$ nastane $200\,\text{g}$ $\mathrm{CaO}$, ker je razmerje $1 : 1$.« Razmerje velja za mole, en mol $\mathrm{CaO}$ pa je lažji od mola $\mathrm{CaCO_3}$. Popravek: maso vedno najprej pretvori v množino.
- **Napačno uporabljeni koeficienti.** »$3\,\text{mol}$ $\mathrm{H_2}$, koeficient vode je $2$, torej nastane $6\,\text{mol}$ vode.« Šteje *razmerje* koeficientov iskane in znane snovi, ne en sam koeficient. Popravek: pomnoži z $\dfrac{\nu(\mathrm{B})}{\nu(\mathrm{A})} = \dfrac{2}{2}$, nastanejo $3\,\text{mol}$.
- **Omejitveni reaktant po manjši masi ali množini.** »Klora ($3\,\text{mol}$) je manj kot natrija ($4\,\text{mol}$), zato je klor omejitveni.« Ker natrij potrebujemo dvakrat več, se porabi prej. Popravek: primerjaj količnika $\dfrac{n}{\nu}$, ne samih mas ali množin.
- **Produkt iz prebitnega reaktanta.** Če v primeru 3 računaš $\mathrm{MgO}$ iz kisika, dobiš $0{,}625\,\text{mol}$ $\mathrm{MgO}$ ($25\,\text{g}$), čeprav magnezija za to ni dovolj. Popravek: količino produkta določa omejitveni reaktant.
- **Napačna molska masa.** Pri $\mathrm{O_2}$ je $32\,\text{g/mol}$, ne $16\,\text{g/mol}$, ker ima molekula dva atoma. Pri $\mathrm{H_2}$ je $2\,\text{g/mol}$.

## Povzetek

- Koeficienti v enačbi so razmerje **množin** snovi.
- Postopek: urejena enačba, $m \to n$, razmerje koeficientov, $n \to m$.
- Omejitveni reaktant ima najmanjši količnik $n/\nu$ in določa količino produkta.
- Prebitni reaktant se ne porabi do konca. Ostanek je začetna množina minus porabljena.
- Preveri z ohranitvijo mase: masa reaktantov (porabljenih in ostanka) je enaka masi produktov (in ostanka).

## Drugače: Na sliki

Predstavljaj si molekule kot kroglice. Za $2\,\mathrm{Mg} + \mathrm{O_2} \rightarrow 2\,\mathrm{MgO}$ narišeš:

- na levi: 4 atome Mg in 4 molekule $\mathrm{O_2}$,
- vsaka molekula $\mathrm{O_2}$ »poje« dva atoma Mg in naredi dve enoti MgO.

S 4 atomi Mg lahko tvorimo samo 2 para, zato reagirata le 2 molekuli $\mathrm{O_2}$. Nastanejo 4 enote MgO, ostaneta pa 2 molekuli $\mathrm{O_2}$. Magnezij je tu omejitveni, kisik prebitni, čeprav smo na začetku imeli enako število delcev obeh.

V simulaciji spodaj (»Omejitveni reaktant«) preizkusi isto z vodikom in kisikom. Spreminjaj število molekul reaktantov in opazuj, kateri se prej porabi, koliko produkta nastane in kaj ostane. Poskusi najti primer, ko ne ostane nič.

## Drugače: Iz vsakdanjega življenja

Sendvič naredimo iz 2 rezin kruha in 1 rezine sira. Receptu rečemo »enačba«:

$$2\,\text{kruh} + 1\,\text{sir} \rightarrow 1\,\text{sendvič}$$

Imaš 7 rezin kruha in 5 rezin sira. Koliko sendvičev lahko narediš?

- Iz kruha: $7 / 2 = 3{,}5$, torej 3 cele sendviče.
- Iz sira: $5 / 1 = 5$ sendvičev.

Manjše število določa rezultat. Kruh je omejitveni »reaktant«, zato naredimo 3 sendviče. Porabimo 6 rezin kruha in 3 rezine sira. Ostane 1 rezina kruha in 2 rezini sira. Sir je torej prebitni »reaktant«.

V kemiji je enako, le da namesto rezin štejemo mole.

## Drugače: Korak za korakom s številkami

Primer: $\mathrm{N_2} + 3\,\mathrm{H_2} \rightarrow 2\,\mathrm{NH_3}$. Imamo $2\,\text{mol}$ $\mathrm{N_2}$ in $3\,\text{mol}$ $\mathrm{H_2}$.

**Korak 1.** Izračunamo $n/\nu$:

| Snov | $n$ (mol) | $\nu$ | $n/\nu$ |
|---|---|---|---|
| $\mathrm{N_2}$ | 2 | 1 | 2 |
| $\mathrm{H_2}$ | 3 | 3 | 1 |

**Korak 2.** Manjši količnik ima $\mathrm{H_2}$, torej je omejitveni.

**Korak 3.** Iz njega izračunamo produkt: $n(\mathrm{NH_3}) = 3 \cdot \dfrac{2}{3} = 2\,\text{mol}$.

**Korak 4.** Porabljeni $\mathrm{N_2}$: $3 \cdot \dfrac{1}{3} = 1\,\text{mol}$. Ostane $2 - 1 = 1\,\text{mol}$ $\mathrm{N_2}$.

**Korak 5.** Končno stanje (preglednica »pred in po«):

| | $\mathrm{N_2}$ | $\mathrm{H_2}$ | $\mathrm{NH_3}$ |
|---|---|---|---|
| pred | 2 | 3 | 0 |
| sprememba | $-1$ | $-3$ | $+2$ |
| po | 1 | 0 | 2 |

## Drugače: Bolj natančno

Zakaj lahko računamo z razmerjem koeficientov? Ker je množina snovi sorazmerna s številom delcev: $N = n \cdot N_\mathrm{A}$. Enačba pove, da na vsakih $\nu(\mathrm{A})$ delcev snovi A nastane $\nu(\mathrm{B})$ delcev snovi B. Če se razmerje delcev ohranja, se ohranja tudi razmerje množin:

$$\frac{N(\mathrm{B})}{N(\mathrm{A})} = \frac{\nu(\mathrm{B})}{\nu(\mathrm{A})} \;\Rightarrow\; \frac{n(\mathrm{B})}{n(\mathrm{A})} = \frac{\nu(\mathrm{B})}{\nu(\mathrm{A})}$$

Če vse združimo v eno formulo za maso:

$$m(\mathrm{B}) = \frac{m(\mathrm{A})}{M(\mathrm{A})} \cdot \frac{\nu(\mathrm{B})}{\nu(\mathrm{A})} \cdot M(\mathrm{B})$$

Preizkus na primeru 1: $m(\mathrm{H_2O}) = \dfrac{4{,}0}{2} \cdot \dfrac{2}{2} \cdot 18 = 36\,\text{g}$, kar se ujema.

Ker se atomi pri reakciji ne ustvarjajo in ne uničujejo, je vsota mas vseh snovi pred reakcijo (z ostankom vred) enaka vsoti po njej. To je zakon o ohranitvi mase, s katerim preverjamo račune.

## Preveri se

? Kaj povedo koeficienti v urejeni kemijski enačbi?
- Razmerje mas snovi, ki reagirajo in nastanejo.
~ Koeficienti veljajo za delce oziroma mole. $2\,\text{g}$ vodika ne reagira z $1\,\text{g}$ kisika, ker imajo moli različnih snovi različne mase.
+ Razmerje množin (molov) snovi, ki reagirajo in nastanejo.
- Koliko gramov snovi moramo natehtati.
~ Koeficienti so le razmerje, ne konkretna količina. Za grame potrebuješ še molsko maso: $m = n \cdot M$.
> Koeficienti povedo razmerje števila delcev, zato tudi razmerje množin: pri $2\,\mathrm{H_2} + \mathrm{O_2} \rightarrow 2\,\mathrm{H_2O}$ je to $2 : 1 : 2$.

? Pri reakciji $2\,\mathrm{H_2} + \mathrm{O_2} \rightarrow 2\,\mathrm{H_2O}$ popolnoma reagira $3\,\text{mol}$ vodika (kisika je dovolj). Koliko molov vode nastane?
- $1{,}5\,\text{mol}$
~ To je množina porabljenega kisika (razmerje $2 : 1$). Za vodo velja razmerje $\mathrm{H_2} : \mathrm{H_2O} = 2 : 2$.
+ $3\,\text{mol}$
- $6\,\text{mol}$
~ Pomnožil si s koeficientom vode $2$. Upoštevati moraš razmerje $\dfrac{\nu(\mathrm{H_2O})}{\nu(\mathrm{H_2})} = \dfrac{2}{2} = 1$.
- $2\,\text{mol}$
~ To je kar koeficient vode iz enačbe. Koeficient je razmerje, ne množina, ki nastane.
> Razmerje $\mathrm{H_2} : \mathrm{H_2O}$ je $2 : 2$, torej $1 : 1$, zato nastane enako število molov vode, $3\,\text{mol}$. Odgovor $1{,}5\,\text{mol}$ je razmerje z $\mathrm{O_2}$, ne z vodo.

? Za reakcijo $2\,\mathrm{Na} + \mathrm{Cl_2} \rightarrow 2\,\mathrm{NaCl}$ imamo $4\,\text{mol}$ natrija in $3\,\text{mol}$ klora. Kateri je omejitveni reaktant in koliko prebitnega ostane?
- $\mathrm{Cl_2}$; ostane $1\,\text{mol}$ Na
~ Izbral si reaktant z manjšo množino. Natrija pa reakcija potrebuje dvakrat več, zato primerjaj $\dfrac{n}{\nu}$: $\dfrac{4}{2} = 2$ in $\dfrac{3}{1} = 3$.
+ Na; ostane $1\,\text{mol}$ $\mathrm{Cl_2}$
- Na; ostane $2\,\text{mol}$ $\mathrm{Cl_2}$
~ Upošteval si, da $4\,\text{mol}$ Na porabi $1\,\text{mol}$ $\mathrm{Cl_2}$. Po razmerju $2 : 1$ porabi $2\,\text{mol}$ $\mathrm{Cl_2}$, zato ostane $1\,\text{mol}$.
> $n/\nu$: za Na $4/2 = 2$, za $\mathrm{Cl_2}$ $3/1 = 3$. Manjši količnik ima Na, ki je omejitveni. Porabi se $2\,\text{mol}$ $\mathrm{Cl_2}$, ostane $3 - 2 = 1\,\text{mol}$.

? Za reakcijo $2\,\mathrm{Mg} + \mathrm{O_2} \rightarrow 2\,\mathrm{MgO}$ zmešamo $10\,\text{g}$ magnezija in $10\,\text{g}$ kisika. Kaj velja?
- Ne ostane nič, ker sta masi reaktantov enaki.
~ Enake mase niso enake množine. Razmerje $2 : 1$ velja za mole, ne za grame.
- Ostane magnezij, ker je njegov koeficient v enačbi večji.
~ Večji koeficient pomeni, da magnezija reakcija *porabi* več, zato ga prej zmanjka.
+ Ostane kisik, magnezij je omejitveni reaktant.
> $n(\mathrm{Mg}) = \dfrac{10}{24} \approx 0{,}42\,\text{mol}$, $\dfrac{n}{\nu} \approx 0{,}21$. $n(\mathrm{O_2}) = \dfrac{10}{32} \approx 0{,}31\,\text{mol}$, $\dfrac{n}{\nu} \approx 0{,}31$. Magnezij ima manjši količnik in je omejitveni, kisika ostane približno $0{,}10\,\text{mol}$ ($3{,}3\,\text{g}$).

? Kalcijev karbonat razpade po enačbi $\mathrm{CaCO_3} \rightarrow \mathrm{CaO} + \mathrm{CO_2}$. Koliko gramov $\mathrm{CaO}$ nastane iz $200\,\text{g}$ $\mathrm{CaCO_3}$? ($M(\mathrm{CaCO_3}) = 100\,\text{g/mol}$, $M(\mathrm{CaO}) = 56\,\text{g/mol}$.)
- $200\,\text{g}$
~ Razmerje $1 : 1$ velja za mole, ne za grame. Mol $\mathrm{CaO}$ ima manjšo maso kot mol $\mathrm{CaCO_3}$, del mase odnese $\mathrm{CO_2}$.
- $56\,\text{g}$
~ To je masa $1\,\text{mol}$ $\mathrm{CaO}$. Iz $200\,\text{g}$ $\mathrm{CaCO_3}$ dobiš $2{,}0\,\text{mol}$, zato pomnoži z $2{,}0$.
- $88\,\text{g}$
~ To je masa nastalega $\mathrm{CO_2}$ ($2{,}0 \cdot 44\,\text{g}$), ne $\mathrm{CaO}$.
+ $112\,\text{g}$
> $n(\mathrm{CaCO_3}) = 200/100 = 2{,}0\,\text{mol}$, nastane $2{,}0\,\text{mol}$ $\mathrm{CaO}$, torej $m = 2{,}0 \cdot 56 = 112\,\text{g}$. Odgovor $56\,\text{g}$ bi veljal za $1\,\text{mol}$, $88\,\text{g}$ pa je masa nastalega $\mathrm{CO_2}$.

:::simboli
n | množina snovi | n = \dfrac{m}{M} | mol
m | masa snovi | m = n \cdot M | g
M | molska masa | | g/mol
\nu | stehiometrijski koeficient | | – | število pred formulo v urejeni enačbi
N | število delcev | N = n \cdot N_\mathrm{A} | –
N_{\mathrm{A}} | Avogadrova konstanta | | mol^{-1} | N_A = 6,022 · 10²³ mol⁻¹
:::
