---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Izdelovalka glasbil ima na tehtnici dva kupčka po $10\,\mathrm{g}$: aluminij za palčko triangla in zlato za pozlato ustnika trobente. Tehtnica pri obeh kaže isto. Pa vendar je v aluminiju več kot sedemkrat več atomov kot v zlatu.

Zveni narobe? Enaka masa, različno število delcev. Iz prejšnje lekcije poznaš mol in molsko maso. Zdaj ju boš uporabil za pot, ki jo kemik prehodi vsak dan: od mase na tehtnici do števila delcev in nazaj. Tako izračunaš, koliko atomov je v kitarski struni, koliko zlata pokrije ustnik ali koliko molekul se dvigne v odrsko meglo.

## Razlaga

**1. Mamljiva misel: enaka masa, enako delcev.** Zdi se logično, da imata enako težka vzorca enako atomov. Preverimo z množino. Uporabimo $M(\mathrm{Al}) = 27\,\mathrm{g/mol}$ in $M(\mathrm{Au}) = 197\,\mathrm{g/mol}$:

$$n(\mathrm{Al}) = \frac{10\,\mathrm{g}}{27\,\mathrm{g/mol}} \approx 0{,}370\,\mathrm{mol}$$

$$n(\mathrm{Au}) = \frac{10\,\mathrm{g}}{197\,\mathrm{g/mol}} \approx 0{,}0508\,\mathrm{mol}$$

Atom zlata je približno $7{,}3$-krat težji od atoma aluminija. Zato je v enaki masi zlata $7{,}3$-krat manj atomov. Število delcev določa množina $n$, ne masa $m$.

:::premisli
Kje je več atomov: v $27\,\mathrm{g}$ aluminija ali v $197\,\mathrm{g}$ zlata? Napovej, preden računaš.
---
Enako. Oba vzorca imata maso, enako svoji molski masi, zato je v vsakem $1\,\mathrm{mol}$ atomov, to je $6{,}02 \cdot 10^{23}$. Zlato je več kot sedemkrat težje, atomov pa ni več.
:::

**2. Mamljiva misel: iz mase naravnost v število delcev.** Nekateri pomnožijo maso z Avogadrovo konstanto, $m \cdot N_A$ (napačno). Enote izdajo napako: $\mathrm{g} \cdot \mathrm{mol^{-1}}$ ni število delcev. $N_A = 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$ pove, koliko delcev je v enem *molu*, ne v enem gramu. Pot zato vedno vodi čez množino:

$$m \xrightarrow{\ :M\ } n \xrightarrow{\ \cdot N_A\ } N$$

| Iz | V | Kaj narediš |
|---|---|---|
| masa $m$ | množina $n$ | deliš z $M$ |
| množina $n$ | število $N$ | množiš z $N_A$ |
| število $N$ | množina $n$ | deliš z $N_A$ |
| množina $n$ | masa $m$ | množiš z $M$ |

Množina je v sredini, ker je most med svetom, ki ga stehtamo, in svetom delcev. Zapisano z enačbami:

$$n = \frac{m}{M} \qquad m = n \cdot M$$

$$N = n \cdot N_A \qquad n = \frac{N}{N_A}$$

**3. Mamljiva misel: molekul in atomov je enako.** $1\,\mathrm{mol}$ vode $\mathrm{H_2O}$ vsebuje $6{,}02 \cdot 10^{23}$ molekul. Vsaka molekula ima dva atoma vodika, zato je atomov vodika $2\,\mathrm{mol}$, atomov kisika pa $1\,\mathrm{mol}$. Preden računaš, se vprašaj: katere delce štejem?

:::premisli
Je v $1\,\mathrm{mol}$ ogljikovega dioksida $\mathrm{CO_2}$ več ali manj kot $6{,}02 \cdot 10^{23}$ atomov? Kolikokrat? Odgovori, preden bereš naprej.
---
Več, trikrat. Vsaka molekula ima $3$ atome ($1$ C in $2$ O), zato so v $1\,\mathrm{mol}$ molekul $3\,\mathrm{mol}$ atomov: $3 \cdot 6{,}02 \cdot 10^{23} = 1{,}806 \cdot 10^{24}$ atomov.
:::

**4. Računanje s potencami.** Ko množiš z $N_A$, množiš samo število pred potenco, potenca ostane: $0{,}5 \cdot 6{,}02 \cdot 10^{23} = 3{,}01 \cdot 10^{23}$. Če je število pred potenco $10$ ali več, rezultat zapišeš drugače: $12{,}04 \cdot 10^{23} = 1{,}204 \cdot 10^{24}$. Vejica se premakne za eno mesto v levo, eksponent se poveča za $1$.

**5. Podatki za vaje.** Uporabljali bomo $M(\mathrm{H}) = 1$, $M(\mathrm{C}) = 12$, $M(\mathrm{O}) = 16$, $M(\mathrm{Na}) = 23$, $M(\mathrm{Al}) = 27$, $M(\mathrm{Fe}) = 56$, $M(\mathrm{Au}) = 197$ (vse v $\mathrm{g/mol}$).

## Rešeni primeri

### Primer 1: atomi v kitarski struni

Jeklena struna kitare ima maso $0{,}56\,\mathrm{g}$. Vzemimo, da je iz čistega železa. Koliko atomov železa je v njej? Uporabi $M(\mathrm{Fe}) = 56\,\mathrm{g/mol}$ in $N_A = 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$.

**Podatki:** $m = 0{,}56\,\mathrm{g}$, snov $\mathrm{Fe}$, $M(\mathrm{Fe}) = 56\,\mathrm{g/mol}$, $N_A = 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$
**Iščemo:** število atomov $N$

:::formula
$n = \dfrac{m}{M}$, nato $N = n \cdot N_A$
:::

**Rešitev:**

1. **Množina.** Iz mase ne moremo naravnost v število atomov, zato najprej izračunamo $n$:
$$n = \frac{0{,}56\,\mathrm{g}}{56\,\mathrm{g/mol}} = 0{,}01\,\mathrm{mol}$$
2. **Število atomov.** Vsak mol ima $N_A$ atomov:
$$N = 0{,}01 \cdot 6{,}02 \cdot 10^{23} = 6{,}02 \cdot 10^{21}$$
3. Smiselnost: struna je stotina mola, zato ima stotino od $6{,}02 \cdot 10^{23}$ atomov. ✓
4. Odgovor: v struni je približno $6{,}02 \cdot 10^{21}$ atomov železa.

### Primer 2: požirek vode med koncertom

Pevka med dvema pesmima popije požirek, $9\,\mathrm{g}$ vode $\mathrm{H_2O}$. Koliko molekul vode in koliko atomov vodika je to? Uporabi $M(\mathrm{H_2O}) = 18\,\mathrm{g/mol}$ in $N_A = 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$.

**Podatki:** $m = 9\,\mathrm{g}$, formula $\mathrm{H_2O}$ (2 atoma vodika v molekuli), $M(\mathrm{H_2O}) = 18\,\mathrm{g/mol}$, $N_A = 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$
**Iščemo:** število molekul vode $N(\mathrm{H_2O})$ in število atomov vodika $N(\mathrm{H})$

:::formula
$n = \dfrac{m}{M}$, nato $N = n \cdot N_A$; atomov vodika je $2$-krat več kot molekul vode.
:::

**Rešitev:**

1. **Množina:** $n = \dfrac{9\,\mathrm{g}}{18\,\mathrm{g/mol}} = 0{,}5\,\mathrm{mol}$.
2. **Število molekul:** $N = n \cdot N_A = 0{,}5 \cdot 6{,}02 \cdot 10^{23} = 3{,}01 \cdot 10^{23}$ molekul.
3. **Atomi vodika:** vsaka molekula $\mathrm{H_2O}$ ima 2 atoma vodika, zato $2 \cdot 3{,}01 \cdot 10^{23} = 6{,}02 \cdot 10^{23}$ atomov vodika.
4. Preverimo: $0{,}5\,\mathrm{mol}$ vode vsebuje $1\,\mathrm{mol}$ atomov vodika, to je ravno $6{,}02 \cdot 10^{23}$ atomov. ✓
5. Odgovor: v požirku je $3{,}01 \cdot 10^{23}$ molekul vode in $6{,}02 \cdot 10^{23}$ atomov vodika.

### Primer 3: zlato na ustniku trobente

Ustnik trobente je prevlečen s tanko plastjo zlata, v kateri je $3{,}01 \cdot 10^{20}$ atomov zlata. Kolikšna je masa zlata? Uporabi $M(\mathrm{Au}) = 197\,\mathrm{g/mol}$ in $N_A = 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$.

**Podatki:** $N = 3{,}01 \cdot 10^{20}$, snov $\mathrm{Au}$, $M(\mathrm{Au}) = 197\,\mathrm{g/mol}$, $N_A = 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$
**Iščemo:** maso zlata $m$

:::formula
$n = \dfrac{N}{N_A}$, nato $m = n \cdot M$
:::

**Rešitev:**

1. Pot gre tokrat v obratni smeri, $N \to n \to m$. Tudi nazaj ne moremo preskočiti množine.
2. **Množina.** Število atomov delimo z $N_A$. $3{,}01$ je polovica od $6{,}02$; $10^{20}$ pa je tisočina od $10^{23}$. Polovica tisočine je $0{,}0005$:
$$n = \frac{3{,}01 \cdot 10^{20}}{6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}} = 0{,}0005\,\mathrm{mol}$$
3. **Masa.**
$$m = 0{,}0005\,\mathrm{mol} \cdot 197\,\mathrm{g/mol} = 0{,}0985\,\mathrm{g}$$
4. Smiselnost: plast zlata je zelo tanka, zato je pričakovana masa manj kot gram. ✓
5. Odgovor: na ustniku je približno $0{,}1\,\mathrm{g}$ zlata.

### Primer 4: zdaj ti

Za nizko meglo na odru porabijo $4{,}4\,\mathrm{kg}$ suhega ledu, to je trdnega ogljikovega dioksida $\mathrm{CO_2}$. Koliko molekul $\mathrm{CO_2}$ se spremeni v plin? Uporabi $M(\mathrm{CO_2}) = 44\,\mathrm{g/mol}$ in $N_A = 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$.

**Podatki:** $m = 4{,}4\,\mathrm{kg}$, formula $\mathrm{CO_2}$, $M(\mathrm{CO_2}) = 44\,\mathrm{g/mol}$, $N_A = 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$
**Iščemo:** število molekul $N$

:::formula
$n = \dfrac{m}{M}$, nato $N = n \cdot N_A$
:::

**Rešitev:**

1. Molska masa je v $\mathrm{g/mol}$, zato maso pretvorimo v grame: $4{,}4\,\mathrm{kg} = 4400\,\mathrm{g}$.
2. **Množina:**
$$n = \frac{4400\,\mathrm{g}}{44\,\mathrm{g/mol}} = 100\,\mathrm{mol}$$
3. Zadnji korak naredi sam, nato preveri:

:::premisli
Koliko je $N = 100\,\mathrm{mol} \cdot 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$?
---
$N = 6{,}02 \cdot 10^{25}$ molekul. Množenje s $100 = 10^2$ poveča eksponent za $2$.
:::

## Pogoste napake

- **Enaka masa, enako delcev.** Učenec misli, da je v $10\,\mathrm{g}$ zlata toliko atomov kot v $10\,\mathrm{g}$ aluminija, ker »tehtata enako«. Atomi različnih elementov so različno težki. Popravek: za vsako snov posebej izračunaj $n = \dfrac{m}{M}$ in primerjaj množine.
- **Preskok množine.** Učenec računa $m \cdot N_A$ (napačno), ker sta obe števili na voljo. $N_A$ velja za en mol, ne za en gram. Popravek: najprej $n = \dfrac{m}{M}$, šele nato $N = n \cdot N_A$.
- **Obrnjena formula.** Učenec računa $\dfrac{M}{m}$, ker zamenja maso vzorca $m$ (v $\mathrm{g}$, s tehtnice) in molsko maso $M$ (v $\mathrm{g/mol}$, iz formule). Preveri enote: rezultat mora biti v $\mathrm{mol}$. Pravilno je $n = \dfrac{m}{M}$.
- **Mešanje molekul in atomov.** Učenec za število atomov vodika v vodi vzame število molekul. Mol molekul $\mathrm{H_2O}$ vsebuje dva mola atomov vodika in en mol atomov kisika. Vedno preveri, katere delce šteješ.
- **Napake pri potencah.** Učenec pri množenju spremeni eksponent ali ga pri prepisu pozabi popraviti. $0{,}5 \cdot 6{,}02 \cdot 10^{23} = 3{,}01 \cdot 10^{23}$: potenca ostane enaka, rezultat ni $3{,}01 \cdot 10^{22}$. Pri $12{,}04 \cdot 10^{23}$ pa se eksponent poveča: $1{,}204 \cdot 10^{24}$.

## Povzetek

- Množina snovi $n$ se meri v molih. En mol vsebuje $N_A = 6{,}02 \cdot 10^{23}$ delcev.
- Enaka masa različnih snovi ne pomeni enakega števila delcev; o tem odloča $n = \dfrac{m}{M}$.
- $n = \dfrac{m}{M}$, $m = n \cdot M$, $N = n \cdot N_A$, $n = \dfrac{N}{N_A}$.
- Od mase do števila delcev in nazaj greš vedno prek množine: $m \to n \to N$.
- Molekul in atomov ni enako: za število atomov ene vrste pomnoži število molekul z indeksom.
- Pri vsaki nalogi najprej zapiši formulo snovi in molsko maso, maso pretvori v grame.

## Drugače: Kot zgodba

Maja igra kitaro in na koncertu šole rada udari še po trianglu. Nekega dne opazi, da aluminijasti triangel tehta le $54\,\mathrm{g}$. »Koliko atomov je v njem?« se vpraša.

Šteti ne more, tehtati pa. V periodnem sistemu najde aluminij: relativna atomska masa $27$, torej $M = 27\,\mathrm{g/mol}$. Vsakih $27\,\mathrm{g}$ je en mol, en »paket« atomov. V $54\,\mathrm{g}$ sta dva paketa: $n = 2\,\mathrm{mol}$.

Nato se spomni, da je v vsakem paketu $6{,}02 \cdot 10^{23}$ atomov. Dva paketa: $2 \cdot 6{,}02 \cdot 10^{23} = 12{,}04 \cdot 10^{23}$, lepše zapisano $1{,}204 \cdot 10^{24}$ atomov.

Ko pokaže račun bratu, ta vpraša: »Kaj pa, če bi bil triangel iz jekla in bi prav tako tehtal $54\,\mathrm{g}$?« Maja se nasmehne: »Potem bi bilo atomov manj, ker je atom železa težji. Najprej bi moral spet izračunati množino.«

## Drugače: Korak za korakom s številkami

Naloga: Koliko formulskih enot $\mathrm{NaCl}$ je v $117\,\mathrm{g}$ kuhinjske soli?

| Korak | Kaj naredim | Račun |
|---|---|---|
| 1 | Zapišem formulo | $\mathrm{NaCl}$ |
| 2 | Izračunam molsko maso | $M = 23 + 35{,}5 = 58{,}5\,\dfrac{\mathrm{g}}{\mathrm{mol}}$ |
| 3 | Izračunam množino | $n = \dfrac{117}{58{,}5} = 2\,\mathrm{mol}$ |
| 4 | Izračunam število delcev | $N = 2 \cdot 6{,}02 \cdot 10^{23} = 12{,}04 \cdot 10^{23}$ |
| 5 | Zapišem v znanstvenem zapisu (število pred potenco med 1 in 10) | $N = 1{,}204 \cdot 10^{24}$ formulskih enot |

Preverjanje: $117$ je dvakrat $58{,}5$, zato sta dva mola, delcev pa dvakrat $N_A$. ✓

## Preveri se

? Na škatlici kitarskih strun piše: »Ena struna vsebuje $0{,}01\,\mathrm{mol}$ železa.« Kaj to pomeni?
- Struna tehta $0{,}01\,\mathrm{g}$.
~ Mol ni enota za maso. Masa bi bila $0{,}01\,\mathrm{mol} \cdot 56\,\mathrm{g/mol} = 0{,}56\,\mathrm{g}$.
+ V struni je $6{,}02 \cdot 10^{21}$ atomov železa.
- V struni je $0{,}01$ atoma železa.
~ Mol je paket $6{,}02 \cdot 10^{23}$ delcev. $0{,}01\,\mathrm{mol}$ je stotina tega paketa, ne stotina atoma.
> Množina pove število delcev: $N = 0{,}01 \cdot 6{,}02 \cdot 10^{23} = 6{,}02 \cdot 10^{21}$.

? Razvrsti vzorce po številu atomov, od največ do najmanj: A $27\,\mathrm{g}$ aluminija ($M = 27\,\mathrm{g/mol}$), B $127\,\mathrm{g}$ bakra ($M = 63{,}5\,\mathrm{g/mol}$), C $98{,}5\,\mathrm{g}$ zlata ($M = 197\,\mathrm{g/mol}$).
- B, C, A
~ To je razvrstitev po masi. Več mase ne pomeni več atomov, če so atomi težji.
+ B, A, C
- C, B, A
~ To je razvrstitev po molski masi, torej po teži enega atoma. Težji atomi pomenijo pri isti masi manj atomov.
- Vsi imajo enako atomov.
~ Tako bi bilo le, če bi bil vsak vzorec $1\,\mathrm{mol}$. Izračunaj $n$ za vsakega.
> $n(\mathrm{A}) = 1\,\mathrm{mol}$, $n(\mathrm{B}) = 2\,\mathrm{mol}$, $n(\mathrm{C}) = 0{,}5\,\mathrm{mol}$. Število atomov je sorazmerno z množino.

? Kitarist zamenja struno z debelejšo iz istega jekla, ki ima dvakrat večjo maso. Kaj se zgodi s številom atomov železa v struni?
- Ostane enako.
~ Enaka ostane molska masa, ker je snov ista. Množina in število atomov sta odvisna od mase vzorca.
+ Se podvoji.
- Se razpolovi.
~ Tako bi bilo, če bi bila masa v imenovalcu ($n = \dfrac{M}{m}$), kar je obrnjena formula.
> $n = \dfrac{m}{M}$: pri isti $M$ dvakrat večja masa da dvakrat večjo množino, s tem pa dvakrat več atomov.

? Kolikšna je množina $80\,\mathrm{g}$ natrijevega hidroksida $\mathrm{NaOH}$? ($M(\mathrm{Na}) = 23$, $M(\mathrm{O}) = 16$, $M(\mathrm{H}) = 1$ v $\mathrm{g/mol}$)
- $0{,}5\,\mathrm{mol}$
~ To je $\dfrac{M}{m} = \dfrac{40}{80}$, obrnjena formula. Masa vzorca je v števcu.
+ $2\,\mathrm{mol}$
- $3200\,\mathrm{mol}$
~ To je $m \cdot M$. Množino dobiš z deljenjem.
- $40\,\mathrm{mol}$
~ $40$ je molska masa v $\mathrm{g/mol}$, ne množina. To je zamenjava $m$, $M$ in $n$.
> $M(\mathrm{NaOH}) = 23 + 16 + 1 = 40\,\mathrm{g/mol}$, zato $n = \dfrac{80}{40} = 2\,\mathrm{mol}$.

? Koliko atomov je v $5{,}4\,\mathrm{g}$ aluminija? ($M(\mathrm{Al}) = 27\,\mathrm{g/mol}$, $N_A = 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$)
- približno $3{,}25 \cdot 10^{24}$
~ To je $m \cdot N_A$, preskok množine. $N_A$ velja za en mol, ne za en gram.
- $1{,}204 \cdot 10^{22}$
~ Množina je prava, eksponent pa ne: $0{,}2 \cdot 6{,}02 \cdot 10^{23} = 1{,}204 \cdot 10^{23}$.
+ $1{,}204 \cdot 10^{23}$
- $0{,}2$
~ To je množina v molih, ne število atomov. Pomnoži še z $N_A$.
> $n = \dfrac{5{,}4\,\mathrm{g}}{27\,\mathrm{g/mol}} = 0{,}2\,\mathrm{mol}$, $N = 0{,}2 \cdot 6{,}02 \cdot 10^{23} = 1{,}204 \cdot 10^{23}$.

:::simboli
n | množina snovi | n = \frac{m}{M} | mol
m | masa vzorca | m = n \cdot M | g
M | molska masa | | g/mol | koliko gramov tehta en mol snovi
N | število delcev | N = n \cdot N_A | – | atomov, molekul ali formulskih enot
N_A | Avogadrova konstanta | | mol^{-1} | $N_A = 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$
:::
