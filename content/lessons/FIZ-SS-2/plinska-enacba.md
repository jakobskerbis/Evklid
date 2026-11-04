---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na Kredarici popiješ vodo in zapreš prazno plastenko s prostornino $0{,}5\,\mathrm{L}$. Zračni tlak je tam okoli $75\,\mathrm{kPa}$. Ko sestopiš v dolino, kjer je tlak okoli $96\,\mathrm{kPa}$, je plastenka zmečkana. Koliko prostornine je izgubila? In zakaj se vrečka čipsa na isti poti navzgor napihne?

Odgovor je v obnašanju plina. Za razliko od trdnin, ki se pri segrevanju razširijo le za tisočinke, plin močno spremeni prostornino, kadar se spremeni tlak ali temperatura. Iste zveze uporabljajo meteorologi pri vremenskih balonih, potapljači pri dihanju pod vodo in vozniki pri polnjenju gum.

## Razlaga

**1. Stanje plina.** Plin vedno zapolni vso posodo. Njegove molekule se gibljejo hitro in neurejeno ter trkajo ob stene; vsi ti trki skupaj dajo **tlak** $p$ (v paskalih, $1\,\mathrm{bar} = 100\,\mathrm{kPa}$). Stanje plina opišejo štiri količine: tlak $p$, prostornina $V$ (v $\mathrm{m^3}$, $1\,\mathrm{L} = 10^{-3}\,\mathrm{m^3}$), temperatura $T$ v kelvinih ($T = t + 273\,\mathrm{K}$) in količina plina $n$ v molih (en mol je $6{,}02 \cdot 10^{23}$ molekul).

*Preveri:* koliko $\mathrm{m^3}$ je $0{,}5\,\mathrm{L}$? Odgovor: $5 \cdot 10^{-4}\,\mathrm{m^3}$.

**2. Stalna temperatura.** Stisni plin na polovico prostornine. Molekule so enako hitre, a jih je v vsakem kubičnem centimetru dvakrat več, zato vsak kos stene zadenejo dvakrat pogosteje. Tlak se podvoji. Tlak in prostornina sta obratno sorazmerna, njun produkt je stalen. To je **Boyle-Mariottov zakon**:

$$p_1 V_1 = p_2 V_2$$

Za plastenko s Kredarice (če je temperatura enaka): $V_2 = 0{,}5\,\mathrm{L} \cdot \dfrac{75\,\mathrm{kPa}}{96\,\mathrm{kPa}} \approx 0{,}39\,\mathrm{L}$. Zrak v njej se stisne za približno $0{,}11\,\mathrm{L}$.

*Preveri:* plin pri stalni temperaturi stisneš na tretjino prostornine. Kaj se zgodi s tlakom? Odgovor: postane trikrat večji.

**3. Stalni tlak.** Balon na soncu se napihne, v mrazu se skrči. Tlak v njem ostaja približno enak zunanjemu, spreminjata se temperatura in prostornina. Za $1\,\mathrm{mol}$ zraka pri $100\,\mathrm{kPa}$ dobimo:

| $t$ [$^\circ\mathrm{C}$] | $T$ [K] | $V$ [L] | $V/T$ [L/K] |
|---|---|---|---|
| $-100$ | $173$ | $14{,}4$ | $0{,}083$ |
| $0$ | $273$ | $22{,}7$ | $0{,}083$ |
| $100$ | $373$ | $31{,}0$ | $0{,}083$ |

Zadnji stolpec je stalen: prostornina je premo sorazmerna z absolutno temperaturo. Sorazmernost velja le v kelvinih, ne v stopinjah Celzija. Če bi zvezo podaljšal k nižjim temperaturam, bi prostornina dosegla nič pri $0\,\mathrm{K}$, to je pri $-273\,^\circ\mathrm{C}$. Tej temperaturi pravimo **absolutna ničla**.

$$\frac{V_1}{T_1} = \frac{V_2}{T_2}$$

*Preveri:* pri stalnem tlaku segreješ plin s $300\,\mathrm{K}$ na $450\,\mathrm{K}$. Kolikšna je nova prostornina? Odgovor: $1{,}5$-krat večja.

:::premisli
Sošolec reče: »Plin segrejem z $10\,^\circ\mathrm{C}$ na $20\,^\circ\mathrm{C}$, temperatura se podvoji, torej se podvoji tudi prostornina.« Napovej, za koliko se prostornina res poveča, in pojasni, zakaj se moti.
---
Le za približno $3{,}5\,\%$: absolutna temperatura zraste z $283\,\mathrm{K}$ na $293\,\mathrm{K}$. Lestvica Celzija ima ničlo pri zmrzišču vode, ne tam, kjer bi plin imel prostornino nič, zato razmerje stopinj nima fizikalnega pomena.
:::

**4. Stalna prostornina.** V zaprti jeklenki ali gumi se prostornina skoraj ne spremeni. Ko plin segrejemo, so molekule hitrejše, ob stene udarjajo močneje in pogosteje. Tlak raste premo sorazmerno z absolutno temperaturo:

$$\frac{p_1}{T_1} = \frac{p_2}{T_2}$$

*Preveri:* plin v zaprti jeklenki segreješ s $300\,\mathrm{K}$ na $600\,\mathrm{K}$. Kaj se zgodi s tlakom? Odgovor: podvoji se.

Tri posebne spremembe v pregledu:

| sprememba | kaj je stalno | zakon |
|---|---|---|
| izotermna | $T$ | $pV$ stalen |
| izobarna | $p$ | $V/T$ stalen |
| izohorna | $V$ | $p/T$ stalen |

**5. Vse naenkrat.** Pri plastenki s Kredarice se spremenita tlak in temperatura hkrati, saj je na vrhu hladneje kot v dolini. Tri zakone združimo v enega: za dano količino plina je $\dfrac{pV}{T}$ stalen.

$$\frac{p_1 V_1}{T_1} = \frac{p_2 V_2}{T_2}$$

Koliko je ta stalnica? Odvisna je le od količine plina. Na mol plina je enaka **splošni plinski konstanti** $R = 8{,}31\,\mathrm{J/(mol\,K)}$. Tako dobimo **plinsko enačbo**:

$$pV = nRT$$

Količino plina izračunamo iz mase: $n = \dfrac{m}{M}$, kjer je $M$ molska masa (za helij $4\,\mathrm{g/mol}$, za zrak okoli $29\,\mathrm{g/mol}$).

*Preveri:* kolikšno prostornino ima $1\,\mathrm{mol}$ plina pri $273\,\mathrm{K}$ in $101{,}3\,\mathrm{kPa}$? Odgovor: $V = \dfrac{8{,}31 \cdot 273}{101\,300}\,\mathrm{m^3} \approx 0{,}0224\,\mathrm{m^3}$, to je $22{,}4\,\mathrm{L}$.

:::premisli
En mol helija ima maso $4\,\mathrm{g}$, en mol kisika $32\,\mathrm{g}$. Kateri od njiju ima pri enakem tlaku in temperaturi večjo prostornino?
---
Prostornini sta enaki. V enačbi $pV = nRT$ ni molske mase: šteje le število molekul, ne njihova masa. Lažje molekule helija so hitrejše, zato ob stene udarjajo enako močno kot težje molekule kisika.
:::

**6. Idealni plin.** Enačba $pV = nRT$ natančno velja za **idealni plin**: model, v katerem so molekule drobne točke, ki se med seboj ne privlačijo in le trkajo. Zrak, helij in drugi plini se pri običajnih tlakih in temperaturah obnašajo skoraj idealno. Odstopanja so velika pri zelo visokih tlakih in tik pred utekočinjenjem, na primer pri vodni pari, ki se v oblaku kondenzira v kapljice.

V simulaciji spodaj (»Plin v posodi: tlak, prostornina, temperatura«) nastavi temperaturo na $300\,\mathrm{K}$, nato prostornino prepolovi. Opazuj, da se tlak podvoji, molekule pa so enako hitre kot prej.

## Rešeni primeri

### Primer 1: mehurček z dna jezera

Iz mulja na dnu jezera se odtrga mehurček plina s prostornino $2\,\mathrm{cm^3}$. Na dnu je tlak $300\,\mathrm{kPa}$, na gladini $100\,\mathrm{kPa}$. Kolikšna je prostornina mehurčka tik pod gladino, če je voda povsod enako topla?

**Podatki:** $V_1 = 2\,\mathrm{cm^3}$, $p_1 = 300\,\mathrm{kPa}$, $p_2 = 100\,\mathrm{kPa}$, temperatura je stalna
**Iščemo:** prostornino $V_2$

:::formula
$p_1 V_1 = p_2 V_2$
:::

**Rešitev:**

1. Temperatura se ne spremeni, zato velja Boyle-Mariottov zakon. Izrazimo $V_2 = V_1 \dfrac{p_1}{p_2}$.
2. Enote: tlaka sta oba v kPa, njuno razmerje je brez enote, zato pretvarjanje ni potrebno.
3. $V_2 = 2\,\mathrm{cm^3} \cdot \dfrac{300\,\mathrm{kPa}}{100\,\mathrm{kPa}} = 6\,\mathrm{cm^3}$.
4. Odgovor: mehurček se med dviganjem napihne na $6\,\mathrm{cm^3}$, torej na trikratno prostornino.

### Primer 2: balon na zimskem sejmu

V trgovini pri $22\,^\circ\mathrm{C}$ ima balon s helijem prostornino $10\,\mathrm{L}$. Zunaj je $-8\,^\circ\mathrm{C}$. Kolikšna je prostornina balona zunaj? Tlak v balonu naj ostane enak.

**Podatki:** $V_1 = 10\,\mathrm{L}$, $t_1 = 22\,^\circ\mathrm{C}$, $t_2 = -8\,^\circ\mathrm{C}$, tlak je stalen
**Iščemo:** prostornino $V_2$

:::formula
$\dfrac{V_1}{T_1} = \dfrac{V_2}{T_2}$
:::

**Rešitev:**

1. Temperaturi v kelvinih, ker sorazmernost velja le zanje: $T_1 = 295\,\mathrm{K}$, $T_2 = 265\,\mathrm{K}$.
2. Izrazimo $V_2 = V_1 \dfrac{T_2}{T_1}$.
3. $V_2 = 10\,\mathrm{L} \cdot \dfrac{265\,\mathrm{K}}{295\,\mathrm{K}} \approx 8{,}98\,\mathrm{L}$.
4. Odgovor: zunaj se balon skrči na približno $9{,}0\,\mathrm{L}$. Ko ga prineseš nazaj na toplo, se spet napihne.

### Primer 3: vremenski balon

Meteorologi spustijo balon z merilnimi napravami. Pri tleh ga napolnijo s $2\,\mathrm{m^3}$ helija pri tlaku $100\,\mathrm{kPa}$ in temperaturi $15\,^\circ\mathrm{C}$. Koliko helija je v balonu (v molih in kilogramih)? Kolikšna je prostornina balona na višini $10\,\mathrm{km}$, kjer je tlak $26\,\mathrm{kPa}$ in temperatura $-50\,^\circ\mathrm{C}$? Tlak v balonu naj bo enak zunanjemu.

**Podatki:** $V_1 = 2\,\mathrm{m^3}$, $p_1 = 100\,\mathrm{kPa}$, $t_1 = 15\,^\circ\mathrm{C}$, $p_2 = 26\,\mathrm{kPa}$, $t_2 = -50\,^\circ\mathrm{C}$, $M = 4\,\mathrm{g/mol}$, $R = 8{,}31\,\mathrm{J/(mol\,K)}$
**Iščemo:** količino $n$, maso $m$ in prostornino $V_2$

:::formula
$pV = nRT$, $m = nM$, nato $\dfrac{p_1 V_1}{T_1} = \dfrac{p_2 V_2}{T_2}$
:::

**Rešitev:**

1. Temperaturi v kelvinih: $T_1 = 288\,\mathrm{K}$, $T_2 = 223\,\mathrm{K}$.
2. Iz plinske enačbe izrazimo $n = \dfrac{p_1 V_1}{R T_1}$ in vstavimo osnovne enote, tlak v paskalih: $n = \dfrac{100\,000\,\mathrm{Pa} \cdot 2\,\mathrm{m^3}}{8{,}31\,\mathrm{J/(mol\,K)} \cdot 288\,\mathrm{K}} \approx 83{,}6\,\mathrm{mol}$.
3. Masa: $m = 83{,}6\,\mathrm{mol} \cdot 0{,}004\,\mathrm{kg/mol} \approx 0{,}33\,\mathrm{kg}$.
4. Na višini se spremenita tlak in temperatura, zato vzamemo združeni zakon: $V_2 = V_1 \dfrac{p_1}{p_2} \dfrac{T_2}{T_1} = 2\,\mathrm{m^3} \cdot \dfrac{100}{26} \cdot \dfrac{223}{288} \approx 5{,}96\,\mathrm{m^3}$.
5. Preverimo smiselnost: tlak pade skoraj na četrtino (balon se napihne), mraz ga nekoliko skrči, zato je rezultat manjši od štirikratne prostornine.
6. Odgovor: v balonu je približno $84\,\mathrm{mol}$ oziroma $0{,}33\,\mathrm{kg}$ helija; na višini $10\,\mathrm{km}$ ima prostornino približno $6\,\mathrm{m^3}$. Še višje se napihne toliko, da poči.

### Primer 4: zdaj ti

Vrnimo se k plastenki s Kredarice. Zapreš jo pri $75\,\mathrm{kPa}$ in $2\,^\circ\mathrm{C}$, v dolini je $96\,\mathrm{kPa}$ in $22\,^\circ\mathrm{C}$. Kolikšna je prostornina zraka v plastenki v dolini?

**Podatki:** $V_1 = 0{,}5\,\mathrm{L}$, $p_1 = 75\,\mathrm{kPa}$, $t_1 = 2\,^\circ\mathrm{C}$, $p_2 = 96\,\mathrm{kPa}$, $t_2 = 22\,^\circ\mathrm{C}$
**Iščemo:** prostornino $V_2$

:::formula
$\dfrac{p_1 V_1}{T_1} = \dfrac{p_2 V_2}{T_2}$
:::

**Rešitev:**

1. Temperaturi v kelvinih: $T_1 = 275\,\mathrm{K}$, $T_2 = 295\,\mathrm{K}$.
2. Izrazimo $V_2 = V_1 \dfrac{p_1}{p_2} \dfrac{T_2}{T_1}$. Vstavi in izračunaj sam.

:::premisli
Kolikšna je $V_2$? Je večja ali manjša kot pri računu brez spremembe temperature ($0{,}39\,\mathrm{L}$)?
---
$V_2 = 0{,}5\,\mathrm{L} \cdot \dfrac{75}{96} \cdot \dfrac{295}{275} \approx 0{,}42\,\mathrm{L}$. Večja je, ker toplejši zrak v dolini potrebuje več prostora; plastenka je zato nekoliko manj zmečkana.
:::

## Pogoste napake

- **Temperatura v stopinjah Celzija.** Učenec vstavi $t = 20$ namesto $T = 293\,\mathrm{K}$, ker je tako napisano v nalogi. Plinski zakoni pa veljajo za absolutno temperaturo; pri $0\,^\circ\mathrm{C}$ bi s Celzijem delil z nič. Vsako temperaturo najprej pretvori v kelvine.
- **Litri in kilopaskali v $pV = nRT$.** Ker je $R = 8{,}31\,\mathrm{J/(mol\,K)}$, morajo biti tlak v Pa in prostornina v $\mathrm{m^3}$. Kdor vstavi kPa ali litre, dobi rezultat, ki je $1000$-krat napačen. V razmerjih ($p_1 V_1 = p_2 V_2$) enote smeš obdržati, ker se pokrajšajo.
- **»Večji tlak, večja prostornina.«** Ker pri segrevanju rasteta obe, učenec misli, da tlak in prostornina vedno rasteta skupaj. Pri stalni temperaturi sta obratno sorazmerna: če tlak pade na polovico, se prostornina podvoji.
- **Nadtlak namesto tlaka.** Merilnik na črpalki pokaže, za koliko je tlak v gumi večji od zunanjega. Kazalec pri $2\,\mathrm{bar}$ pomeni pravi tlak okoli $3\,\mathrm{bar}$. V plinske zakone vstavi pravi tlak, sicer razmerja niso pravilna.

## Povzetek

- Idealni plin: molekule kot točke, brez privlačnih sil, le trki; zrak in helij pri običajnih pogojih se tako obnašata.
- Plinska enačba: $pV = nRT$, $R = 8{,}31\,\mathrm{J/(mol\,K)}$, $n = \dfrac{m}{M}$; $p$ v Pa, $V$ v $\mathrm{m^3}$, $T$ v K.
- Za dano količino plina je $\dfrac{pV}{T}$ stalen: $\dfrac{p_1 V_1}{T_1} = \dfrac{p_2 V_2}{T_2}$.
- Posebni primeri: izotermna ($pV$ stalen, Boyle-Mariottov zakon), izobarna ($V/T$ stalen), izohorna ($p/T$ stalen).
- Temperatura vedno v kelvinih; absolutna ničla je pri $-273\,^\circ\mathrm{C}$.

## Drugače: Na sliki

Nariši tri grafe v mislih ali na papir.

- **$p$ proti $V$ pri stalni $T$:** krivulja, ki se spušča in se osema le približuje (hiperbola). Ko $V$ podvojiš, se točka spusti na polovično višino. Pri višji temperaturi leži cela krivulja višje.
- **$V$ proti $T$ pri stalnem $p$:** premica skozi izhodišče, če je na vodoravni osi $T$ v kelvinih. Če na os pišeš stopinje Celzija, premica seka os pri $-273\,^\circ\mathrm{C}$, ne v ničli.
- **$p$ proti $T$ pri stalni $V$:** prav tako premica skozi izhodišče v kelvinih.

Shema vremenskega balona v besedah: pri tleh je majhna kroglica, na $5\,\mathrm{km}$ ima okoli $1{,}6$-krat večjo prostornino, na $10\,\mathrm{km}$ okoli trikrat večjo, dokler opna ne poči. Vsak korak navzgor pomeni nižji tlak in zato večjo prostornino, mraz pa rast le nekoliko zavira.

## Drugače: Bolj natančno

Plinsko enačbo lahko zapišemo s številom molekul $N$: $pV = N k_B T$, kjer je $k_B = 1{,}38 \cdot 10^{-23}\,\mathrm{J/K}$ Boltzmannova konstanta. Ker je v molu $N_A = 6{,}02 \cdot 10^{23}$ molekul, velja $R = N_A k_B$.

Idealni plin predpostavlja dvoje: molekule nimajo lastne prostornine in se med trki ne privlačijo. Pri visokem tlaku so molekule tako blizu, da njihova lastna prostornina ni več zanemarljiva. Pri nizki temperaturi, blizu utekočinjenja, privlačne sile zmanjšajo tlak na stene. Zato vodna para v nasičenem zraku ne sledi $pV = nRT$: namesto da bi pri ohlajanju samo zmanjšala tlak, se kondenzira v roso ali oblak.

Absolutna ničla je meja, ki je ne moremo doseči. Pri resničnih plinih je ne opazimo kot »prostornino nič«, ker se prej utekočinijo; premica iz meritev pa za vse pline kaže na isto točko, $-273{,}15\,^\circ\mathrm{C}$.

## Preveri se

? Katera tabela opisuje dano količino plina pri stalni temperaturi?
- $V$: $1$, $2$, $4\,\mathrm{L}$; $p$: $100$, $200$, $400\,\mathrm{kPa}$
~ Tu tlak raste skupaj s prostornino. Pri stalni temperaturi sta obratno sorazmerna: večja prostornina, manjši tlak.
+ $V$: $1$, $2$, $4\,\mathrm{L}$; $p$: $400$, $200$, $100\,\mathrm{kPa}$
- $V$: $1$, $2$, $4\,\mathrm{L}$; $p$: $400$, $300$, $200\,\mathrm{kPa}$
~ Tlak res pada, a produkt $pV$ ni stalen ($400$, $600$, $800$). Ni dovolj, da ena količina pada, ko druga raste.
> Pri izotermni spremembi je $pV$ stalen: $1 \cdot 400 = 2 \cdot 200 = 4 \cdot 100 = 400\,\mathrm{kPa\,L}$.

? Učilnica meri $10\,\mathrm{m} \times 8\,\mathrm{m} \times 2{,}5\,\mathrm{m}$, v njej je zrak pri $20\,^\circ\mathrm{C}$ in $100\,\mathrm{kPa}$. Koliko molov zraka je približno v njej?
- okoli $8\,\mathrm{mol}$
~ Tak rezultat dobiš, če tlak vstaviš v kPa. Z $R = 8{,}31\,\mathrm{J/(mol\,K)}$ mora biti tlak v Pa.
+ okoli $8000\,\mathrm{mol}$
- okoli $120\,000\,\mathrm{mol}$
~ To je rezultat s temperaturo $20$ namesto $293\,\mathrm{K}$. Plinska enačba zahteva kelvine.
- okoli $8\,000\,000\,\mathrm{mol}$
~ Tu je prostornina vstavljena v litrih ($200\,000\,\mathrm{L}$). V plinski enačbi mora biti v $\mathrm{m^3}$.
> $V = 200\,\mathrm{m^3}$, $n = \dfrac{pV}{RT} = \dfrac{100\,000 \cdot 200}{8{,}31 \cdot 293} \approx 8200\,\mathrm{mol}$, kar je približno $240\,\mathrm{kg}$ zraka.

? Zakaj je guma kolesa zjutraj po mrzli noči mehkejša kot popoldne na soncu, čeprav je nihče ni dopolnil?
- Ker ponoči nekaj zraka uide skozi ventil.
~ Če bi zrak ušel, guma popoldne ne bi bila spet trda. Sprememba se vrača, zato jo povzroča temperatura.
+ Ker je zrak v gumi hladnejši, pri skoraj enaki prostornini pa je tlak sorazmeren z absolutno temperaturo.
- Ker se guma na mrazu raztegne in ima zrak več prostora.
~ Snovi se pri ohlajanju krčijo, ne raztezajo. Prostornina gume se skoraj ne spremeni, spremeni se tlak.
> Pri izohorni spremembi je $\dfrac{p}{T}$ stalen. Nižja temperatura ponoči pomeni nižji tlak, na soncu pa tlak spet zraste.

? Plin v zaprti jeklenki ima pri $27\,^\circ\mathrm{C}$ tlak $200\,\mathrm{kPa}$. Pri kateri temperaturi bo tlak $400\,\mathrm{kPa}$?
- pri $54\,^\circ\mathrm{C}$
~ Podvojena je temperatura v stopinjah Celzija. Sorazmernost velja le za absolutno temperaturo.
+ pri $327\,^\circ\mathrm{C}$
- pri $600\,^\circ\mathrm{C}$
~ $600$ je pravilna temperatura, a v kelvinih. Za stopinje Celzija odštej $273$.
> $T_1 = 300\,\mathrm{K}$; tlak se podvoji, zato $T_2 = 600\,\mathrm{K}$, kar je $327\,^\circ\mathrm{C}$.

? Potapljač izdihne mehurček v globini, kjer je tlak $200\,\mathrm{kPa}$ in voda ima $7\,^\circ\mathrm{C}$. Pri gladini je tlak $100\,\mathrm{kPa}$, voda pa ima $27\,^\circ\mathrm{C}$. Kolikokrat se poveča prostornina mehurčka?
- $0{,}5$-krat
~ Tlak se zmanjša, zato se prostornina poveča, ne zmanjša: pri stalni temperaturi sta obratno sorazmerna.
- $2$-krat
~ Upoštevan je le tlak. Tudi temperatura se spremeni in mehurček še malo napihne.
+ približno $2{,}14$-krat
- približno $7{,}7$-krat
~ Temperaturi sta vstavljeni v stopinjah ($\tfrac{27}{7}$). V kelvinih je razmerje le $\tfrac{300}{280}$.
> $\dfrac{V_2}{V_1} = \dfrac{p_1}{p_2} \cdot \dfrac{T_2}{T_1} = \dfrac{200}{100} \cdot \dfrac{300}{280} \approx 2{,}14$.

:::simboli
p | tlak | p = \frac{nRT}{V} | Pa
V | prostornina | V = \frac{nRT}{p} | m^3
T | absolutna temperatura | T = \frac{pV}{nR} | K
n | količina plina (množina) | n = \frac{m}{M} | mol
R | splošna plinska konstanta | | J/(mol\,K) | $8{,}31\,\mathrm{J/(mol\,K)}$
m | masa plina | m = nM | kg
M | molska masa | | kg/mol | helij $0{,}004\,\mathrm{kg/mol}$
p_1, p_2 | tlak v začetnem in končnem stanju | | Pa
V_1, V_2 | prostornina v začetnem in končnem stanju | | m^3
T_1, T_2 | temperatura v začetnem in končnem stanju | | K
:::
