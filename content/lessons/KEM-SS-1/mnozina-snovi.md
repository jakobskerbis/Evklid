---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Iz osnovne šole že veš, da so snovi zgrajene iz zelo majhnih delcev: atomov, molekul in ionov. Veš tudi, da lahko maso snovi izmeriš s tehtnico. Težava je v tem, da v kemijski reakciji delci reagirajo v določenih razmerjih, delcev pa ne moremo prešteti niti videti. En sam delec je izjemno lahek, zato je že v kapljici vode ogromno molekul.

Zato kemiki uporabljamo posebno količino, **množino snovi**. Z njo »štejemo« delce tako, da stehtamo snov. Ko veš, koliko molov snovi imaš, veš, koliko delcev je v njej, in lahko načrtuješ reakcije: koliko vodika potrebuješ za sintezo amoniaka, koliko apna za nevtralizacijo kisline ali koliko zdravilne učinkovine je v tableti.

## Razlaga

**1. Množina snovi.** Množina snovi je fizikalna količina, ki pove, koliko delcev (atomov, molekul, ionov ...) snovi imamo. Označimo jo z $n$, enota je **mol** ($\mathrm{mol}$).

**2. Mol.** En mol je množina snovi, ki vsebuje natanko toliko delcev, kolikor jih pove Avogadrova konstanta.

**3. Avogadrova konstanta.** Število delcev v enem molu je približno

$$N_A = 6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}$$

To pomeni: v $1\,\mathrm{mol}$ vode je približno $6{,}022 \cdot 10^{23}$ molekul vode, v $1\,\mathrm{mol}$ železa približno $6{,}022 \cdot 10^{23}$ atomov železa. Mol je podoben izrazu »ducat« (12 kosov), le da je število veliko večje.

**4. Število delcev in množina.** Če je $N$ število delcev, velja:

$$N = n \cdot N_A \qquad\Longleftrightarrow\qquad n = \frac{N}{N_A}$$

:::premisli
V enem kozarcu so $3\,\mathrm{mol}$ vode, v drugem $3\,\mathrm{mol}$ sladkorja. Kje je več molekul?
---
Nikjer, število molekul je enako: $N = 3\,\mathrm{mol} \cdot N_A$. Množina snovi šteje delce, ne glede na to, kako veliki ali težki so.
:::

**5. Molska masa.** Molska masa $M$ je masa enega mola snovi:

$$M = \frac{m}{n}, \qquad \text{enota: } \mathrm{g/mol}$$

Številska vrednost molske mase (v $\mathrm{g/mol}$) je enaka relativni atomski masi elementa, ki jo odčitaš iz periodnega sistema, ali relativni molekulski masi spojine, ki jo iz teh vrednosti izračunaš.

**6. Kako izračunamo molsko maso spojine.** Seštejemo molske mase vseh atomov v formulski enoti. Za vodo $\mathrm{H_2O}$ (uporabimo $A_r(\mathrm{H}) = 1$, $A_r(\mathrm{O}) = 16$):

$$M(\mathrm{H_2O}) = 2 \cdot 1 + 16 = 18\,\mathrm{g/mol}$$

**7. Zveza med maso in množino.** Iz $M = m/n$ sledi:

$$n = \frac{m}{M} \qquad m = n \cdot M$$

Tako povežemo maso (ki jo izmerimo) s številom delcev (ki ga ne moremo prešteti):

$$m \;\longleftrightarrow\; n \;\longleftrightarrow\; N$$

:::premisli
Imaš $10\,\mathrm{g}$ vodika $\mathrm{H_2}$ ($M = 2\,\mathrm{g/mol}$) in $10\,\mathrm{g}$ kisika $\mathrm{O_2}$ ($M = 32\,\mathrm{g/mol}$). Kje je več molekul?
---
V vodiku. Vodika je $\dfrac{10}{2} = 5\,\mathrm{mol}$, kisika le $\dfrac{10}{32} \approx 0{,}31\,\mathrm{mol}$. Molekule vodika so lažje, zato jih je v isti masi več. Enaka masa ne pomeni enakega števila delcev.
:::

V simulaciji spodaj »Mol, molska masa in Avogadrovo število« izberi vodo in pritisni gumb »1 mol«, nato izberi glukozo in spet pritisni »1 mol«. Opazi, da se masa močno spremeni, število delcev $N$ pa ostane približno $6{,}02 \cdot 10^{23}$. Simulacija računa z natančnejšimi relativnimi atomskimi masami (npr. $18{,}02\,\mathrm{g/mol}$ za vodo), zato so rezultati malo drugačni kot pri zaokroženih vrednostih.

## Rešeni primeri

### Primer 1: molska masa in množina

Koliko molov je v $36\,\mathrm{g}$ vode? Uporabi $A_r(\mathrm{H}) = 1$ in $A_r(\mathrm{O}) = 16$.

**Podatki:** $m = 36\,\mathrm{g}$, snov $\mathrm{H_2O}$, $A_r(\mathrm{H}) = 1$, $A_r(\mathrm{O}) = 16$
**Iščemo:** množino $n$

:::formula
$M(\mathrm{H_2O}) = 2 \cdot A_r(\mathrm{H}) + A_r(\mathrm{O})$ v $\mathrm{g/mol}$, nato $n = \dfrac{m}{M}$
:::

**Rešitev:**

1. Najprej potrebujemo molsko maso, ker je ta »most« med maso in množino: $M(\mathrm{H_2O}) = 2 \cdot 1 + 16 = 18\,\mathrm{g/mol}$.
2. Iščemo množino, zato uporabimo $n = \dfrac{m}{M}$.
3. Vstavimo: $n = \dfrac{36\,\mathrm{g}}{18\,\mathrm{g/mol}} = 2\,\mathrm{mol}$.
4. Preverimo enoto: gram, deljen z gramom na mol, da mol. ✓
5. Odgovor: v $36\,\mathrm{g}$ vode sta $2\,\mathrm{mol}$ vode.

To lahko preveriš v simulaciji spodaj: izberi vodo in nastavi maso na $36\,\mathrm{g}$. Dobiš približno $1{,}998\,\mathrm{mol}$, ker simulacija računa z $M = 18{,}02\,\mathrm{g/mol}$.

### Primer 2: masa iz množine

Kolikšna je masa $0{,}5\,\mathrm{mol}$ ogljikovega dioksida $\mathrm{CO_2}$? Uporabi $A_r(\mathrm{C}) = 12$ in $A_r(\mathrm{O}) = 16$.

**Podatki:** $n = 0{,}5\,\mathrm{mol}$, snov $\mathrm{CO_2}$, $A_r(\mathrm{C}) = 12$, $A_r(\mathrm{O}) = 16$
**Iščemo:** maso $m$

:::formula
$M(\mathrm{CO_2}) = A_r(\mathrm{C}) + 2 \cdot A_r(\mathrm{O})$ v $\mathrm{g/mol}$, nato $m = n \cdot M$
:::

**Rešitev:**

1. Molska masa: $M(\mathrm{CO_2}) = 12 + 2 \cdot 16 = 44\,\mathrm{g/mol}$. Pri kisiku množimo z 2, ker sta v formuli dva atoma.
2. Iščemo maso, zato $m = n \cdot M$.
3. Vstavimo: $m = 0{,}5\,\mathrm{mol} \cdot 44\,\mathrm{g/mol} = 22\,\mathrm{g}$.
4. Smiselnost: pol mola tehta polovico molske mase, torej polovico od $44\,\mathrm{g}$. ✓
5. Odgovor: $0{,}5\,\mathrm{mol}$ ogljikovega dioksida ima maso $22\,\mathrm{g}$.

### Primer 3: število delcev (težji)

Koliko molekul vode in koliko atomov vodika je v $9\,\mathrm{g}$ vode? Molska masa vode je $18\,\mathrm{g/mol}$.

**Podatki:** $m = 9\,\mathrm{g}$, $M(\mathrm{H_2O}) = 18\,\mathrm{g/mol}$, $N_A = 6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}$
**Iščemo:** število molekul $N(\mathrm{H_2O})$ in število atomov vodika $N(\mathrm{H})$

:::formula
$n = \dfrac{m}{M}$

$N = n \cdot N_A$

$N(\mathrm{H}) = 2 \cdot N(\mathrm{H_2O})$
:::

**Rešitev:**

1. **Množina vode:** do števila delcev pridemo le prek množine, zato najprej $n = \dfrac{m}{M} = \dfrac{9\,\mathrm{g}}{18\,\mathrm{g/mol}} = 0{,}5\,\mathrm{mol}$.
2. **Število molekul:** $N = n \cdot N_A = 0{,}5\,\mathrm{mol} \cdot 6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}} = 3{,}011 \cdot 10^{23}$ molekul.
3. **Atomi vodika:** vsaka molekula $\mathrm{H_2O}$ vsebuje 2 atoma vodika, zato je atomov dvakrat toliko: $2 \cdot 3{,}011 \cdot 10^{23} = 6{,}022 \cdot 10^{23}$ atomov vodika.
4. **Preverimo:** $0{,}5\,\mathrm{mol}$ vode vsebuje $1\,\mathrm{mol}$ atomov vodika, kar je natanko $6{,}022 \cdot 10^{23}$ atomov. ✓
5. Odgovor: v $9\,\mathrm{g}$ vode je $3{,}011 \cdot 10^{23}$ molekul vode in $6{,}022 \cdot 10^{23}$ atomov vodika.

### Primer 4: zdaj ti

Kemik je odtehtal vzorec železa, v katerem je $3{,}011 \cdot 10^{23}$ atomov železa. Kolikšna je masa vzorca? Molska masa železa je $56\,\mathrm{g/mol}$.

**Podatki:** $N = 3{,}011 \cdot 10^{23}$, $M(\mathrm{Fe}) = 56\,\mathrm{g/mol}$, $N_A = 6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}$
**Iščemo:** maso $m$

:::formula
$n = \dfrac{N}{N_A}$, nato $m = n \cdot M$
:::

**Rešitev:**

1. Tokrat gremo po verigi v obratni smeri, $N \to n \to m$, ker je dano število delcev.
2. Množina: $n = \dfrac{3{,}011 \cdot 10^{23}}{6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}} = 0{,}5\,\mathrm{mol}$. Potenci $10^{23}$ se pokrajšata.
3. Izračunaj maso sam, nato preveri:

:::premisli
Kolikšna je masa $0{,}5\,\mathrm{mol}$ železa?
---
$m = n \cdot M = 0{,}5\,\mathrm{mol} \cdot 56\,\mathrm{g/mol} = 28\,\mathrm{g}$. Vzorec ima maso $28\,\mathrm{g}$.
:::

## Pogoste napake

- **Mešanje mase in množine.** Masa $m$ je v gramih, množina $n$ v molih. $36\,\mathrm{g}$ vode ni $36\,\mathrm{mol}$ vode. Prav tako $1\,\mathrm{mol}$ vode in $1\,\mathrm{mol}$ železa nimata enake mase ($18\,\mathrm{g}$ in $56\,\mathrm{g}$), imata pa enako število delcev.
- **Napačno upoštevanje indeksov v formuli.** Pri $\mathrm{CO_2}$ je $M = 12 + 2 \cdot 16 = 44\,\mathrm{g/mol}$, ne $12 + 16 = 28$ (pozabljen indeks) in ne $2 \cdot (12 + 16) = 56$. Indeks velja le za atom, za katerim stoji.
- **Obrnjena ali pomnožena formula.** Kdor si zapomni le, da »nastopata $m$ in $M$«, izračuna $M/m$ ali $m \cdot M$. Pravilno je $n = m/M$. Preveri enote: rezultat mora biti v molih.
- **Mol molekul ni mol atomov.** Napačno: »$1{,}5\,\mathrm{mol}$ vode ima $1{,}5\,\mathrm{mol}$ atomov vodika.« En mol molekul $\mathrm{H_2O}$ vsebuje $1\,\mathrm{mol}$ molekul, a $2\,\mathrm{mol}$ atomov vodika in $1\,\mathrm{mol}$ atomov kisika. Množino molekul pomnoži z indeksom.
- **Napačno računanje s potencami.** Pri $n \cdot N_A$ pomnožiš števili ($0{,}5 \cdot 6{,}022$) in potenco $10^{23}$ pustiš.

## Povzetek

- Množina snovi $n$ pove, koliko delcev je v vzorcu; enota je mol.
- En mol vsebuje $N_A = 6{,}022 \cdot 10^{23}$ delcev.
- $N = n \cdot N_A$.
- Molska masa $M = m/n$ ima enoto $\mathrm{g/mol}$ in je številsko enaka relativni atomski ali molekulski masi.
- $n = \dfrac{m}{M}$ povezuje maso z množino, $n = \dfrac{N}{N_A}$ pa število delcev z množino.
- Pri računu molske mase upoštevaj vse atome v formuli.

## Drugače: Na sliki

Predstavljaj si tri »vrečke«, ki jih povezujejo puščice:

- **masa** $m$ (v gramih), ki jo stehtaš,
- **množina** $n$ (v molih), ki je v sredini,
- **število delcev** $N$, ki ga ne vidiš.

Množina je vedno v sredini. Od mase do množine greš z deljenjem z $M$, od množine do števila delcev z množenjem z $N_A$. Nazaj greš z obratnimi operacijami: $n$ pomnožiš z $M$ (dobiš $m$), $N$ pa deliš z $N_A$ (dobiš $n$).

Če hočeš iz mase priti do števila delcev, vedno narediš dva koraka: $m \to n \to N$. Neposredne bližnjice ni.

## Drugače: Iz vsakdanjega življenja

Pomisli na ducat jajc. Ne rečeš »dvanajst jajc«, ampak »ducat«. Ducat je samo ime za število 12. Mol je ime za število $6{,}022 \cdot 10^{23}$. Ker so atomi in molekule tako majhni, potrebujemo »ducat«, ki je neizmerno večji.

Še ena primerjava: v trgovini ne šteješ posameznih zrn riža, ampak kupiš kilogram. Če veš, koliko tehta eno zrno, iz mase izračunaš število zrn. Prav tako kemik iz mase snovi in molske mase izračuna množino delcev.

Primer: žlička kuhinjske soli ($\mathrm{NaCl}$), ki tehta približno $6\,\mathrm{g}$, vsebuje približno $0{,}1\,\mathrm{mol}$ formulskih enot, saj je $M(\mathrm{NaCl}) \approx 58{,}5\,\mathrm{g/mol}$ in $6/58{,}5 \approx 0{,}1$.

## Drugače: Korak za korakom s številkami

Recept za nalogo: *Koliko atomov je v $12\,\mathrm{g}$ ogljika?* ($A_r(\mathrm{C}) = 12$)

| Korak | Kaj naredimo | Račun |
|---|---|---|
| 1 | Zapišemo, kaj je dano in kaj iščemo | $m = 12\,\mathrm{g}$, iščemo $N$ |
| 2 | Molska masa | $M(\mathrm{C}) = 12\,\mathrm{g/mol}$ |
| 3 | Množina | $n = \dfrac{12\,\mathrm{g}}{12\,\mathrm{g/mol}} = 1\,\mathrm{mol}$ |
| 4 | Število delcev | $N = 1\,\mathrm{mol} \cdot 6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}$ |
| 5 | Rezultat | $N = 6{,}022 \cdot 10^{23}$ atomov |
| 6 | Preverimo smiselnost | masa je enaka številu v periodnem sistemu, torej je to točno 1 mol ✓ |

Za drugo primerjavo: $24\,\mathrm{g}$ ogljika je $2\,\mathrm{mol}$, torej $1{,}2044 \cdot 10^{24}$ atomov.

## Drugače: Bolj natančno

Mol je osnovna enota SI za množino snovi. Od leta 2019 je definiran tako, da ima Avogadrova konstanta natančno vrednost $N_A = 6{,}02214076 \cdot 10^{23}\,\mathrm{mol^{-1}}$; en mol ima torej natanko toliko delcev. Ker šteje delce na mol, je $N_A$ konstanta z enoto $\mathrm{mol^{-1}}$ in ni brezdimenzijsko število.

Zakaj je molska masa v $\mathrm{g/mol}$ številsko enaka relativni atomski masi? Relativna atomska masa pove, kolikokrat je masa atoma večja od določene atomske enote mase. Ker mol vsebuje $N_A$ delcev, je masa enega mola enaka masi enega atoma, pomnoženi z $N_A$. Ta množitelj je izbran tako, da dobimo vrednost v gramih, ki je enaka relativni atomski masi. Zato npr. za ogljik ($A_r = 12$) velja $M = 12\,\mathrm{g/mol}$.

Dimenzijski preizkus formul:

$$n = \frac{m}{M}: \quad \frac{\mathrm{g}}{\mathrm{g/mol}} = \mathrm{mol}, \qquad N = n \cdot N_A: \quad \mathrm{mol} \cdot \mathrm{mol^{-1}} = 1$$

Število delcev je čisto število, zato se enote ujemajo.

## Preveri se

? Koliko delcev vsebuje $1\,\mathrm{mol}$ katerekoli snovi?
- Toliko, kolikor je njena molska masa v gramih.
~ Molska masa pove maso enega mola, ne števila delcev. Število delcev v molu je za vse snovi enako.
+ Približno $6{,}022 \cdot 10^{23}$.
- Odvisno od snovi: težje snovi imajo v molu manj delcev.
~ Tu mešaš maso in množino. En mol vedno vsebuje $N_A$ delcev; težje snovi imajo le večjo maso mola.
> En mol vsebuje $N_A \approx 6{,}022 \cdot 10^{23}$ delcev, ne glede na snov.

? Kolikšna je molska masa $\mathrm{CO_2}$? ($A_r(\mathrm{C}) = 12$, $A_r(\mathrm{O}) = 16$)
- $28\,\mathrm{g/mol}$
~ Tako dobiš, če pozabiš indeks 2: sešteješ le en atom kisika ($12 + 16$).
- $60\,\mathrm{g/mol}$
~ To bi bila molska masa skupine s tremi atomi kisika ($12 + 3 \cdot 16$). V $\mathrm{CO_2}$ sta le dva.
+ $44\,\mathrm{g/mol}$
- $56\,\mathrm{g/mol}$
~ To je $2 \cdot (12 + 16)$: indeks 2 velja le za kisik, ne za ogljik.
> $M(\mathrm{CO_2}) = 12 + 2 \cdot 16 = 44\,\mathrm{g/mol}$. Indeks 2 se nanaša le na atom kisika pred njim.

? Koliko molov je v $20\,\mathrm{g}$ natrijevega hidroksida $\mathrm{NaOH}$? ($M(\mathrm{NaOH}) = 40\,\mathrm{g/mol}$)
- $2\,\mathrm{mol}$
~ To je $\dfrac{M}{m} = \dfrac{40}{20}$, obrnjen ulomek. Enota bi bila $\mathrm{mol^{-1}}$, ne mol.
+ $0{,}5\,\mathrm{mol}$
- $800\,\mathrm{mol}$
~ To je $m \cdot M = 20 \cdot 40$. Maso z molsko maso delimo, ne množimo; produkt ima enoto $\mathrm{g^2/mol}$.
> $n = \dfrac{m}{M} = \dfrac{20\,\mathrm{g}}{40\,\mathrm{g/mol}} = 0{,}5\,\mathrm{mol}$.

? Koliko molov atomov vodika je v $1{,}5\,\mathrm{mol}$ vode $\mathrm{H_2O}$?
- $1{,}5\,\mathrm{mol}$
~ To je množina molekul vode. Vsaka molekula ima dva atoma vodika, zato je atomov vodika dvakrat več.
+ $3\,\mathrm{mol}$
- $0{,}75\,\mathrm{mol}$
~ Z 2 je treba pomnožiti, ne deliti: atomov vodika je več kot molekul vode, ne manj.
> V vsaki molekuli $\mathrm{H_2O}$ sta 2 atoma vodika, zato $n(\mathrm{H}) = 2 \cdot 1{,}5\,\mathrm{mol} = 3\,\mathrm{mol}$.

? Koliko molekul je v $2\,\mathrm{mol}$ snovi?
- $3{,}011 \cdot 10^{23}$
~ To je število molekul v $0{,}5\,\mathrm{mol}$: delil si z 2, namesto da bi množil.
- $6{,}022 \cdot 10^{23}$
~ To je število molekul v $1\,\mathrm{mol}$. Pozabil si pomnožiti z množino $n = 2\,\mathrm{mol}$.
+ $1{,}2044 \cdot 10^{24}$
> $N = n \cdot N_A = 2 \cdot 6{,}022 \cdot 10^{23} = 12{,}044 \cdot 10^{23} = 1{,}2044 \cdot 10^{24}$.

:::simboli
n | množina snovi | n = \frac{m}{M} | mol | tudi n = N : N_A
m | masa vzorca | m = n \cdot M | g
M | molska masa | M = \frac{m}{n} | g/mol | številsko enaka vsoti A_r atomov v formuli
N | število delcev | N = n \cdot N_A | – | molekul, atomov ali formulskih enot
N_A | Avogadrova konstanta | | mol^{-1} | N_A = 6,022 · 10²³ mol⁻¹
A_r | relativna atomska masa | | – | iz periodnega sistema
:::
