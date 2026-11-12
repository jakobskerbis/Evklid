---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta 1783 je francoski fizik Jacques Charles iz Pariza poletel z balonom, polnim vodika. Balon je imel ventil, skozi katerega je izpuščal vodik, da se je balon spustil. Pozneje je meril, kako se plini raztezajo pri segrevanju.

Isti pojav srečaš na planinski turi. Na Kredarici popiješ vodo in zapreš prazno plastenko s prostornino $0{,}5\,\mathrm{L}$. Zračni tlak je tam okoli $75\,\mathrm{kPa}$. Ko se vrneš v Ljubljano, kjer je tlak okoli $98\,\mathrm{kPa}$, je plastenka zmečkana. Koliko prostornine je izgubila?

## Razlaga

**1. Stanje plina.** Plin vedno zapolni vso posodo. Njegove molekule se gibljejo hitro in neurejeno ter trkajo ob stene; vsi ti trki skupaj dajo **tlak** $p$ (v paskalih, $1\,\mathrm{bar} = 100\,\mathrm{kPa}$). Stanje plina opišejo štiri količine: tlak $p$, prostornina $V$ (v $\mathrm{m^3}$, $1\,\mathrm{L} = 10^{-3}\,\mathrm{m^3}$), temperatura $T$ v kelvinih (številsko $T = t + 273$, torej je $0\,^\circ\mathrm{C}$ enako $273\,\mathrm{K}$) in **množina snovi** $n$ v molih, na kratko količina plina (en mol je $6{,}02 \cdot 10^{23}$ molekul).

**2. Stalna temperatura (izotermna sprememba).** V valju z batom sta $2\,\mathrm{L}$ zraka pri $100\,\mathrm{kPa}$. Bat potisni počasi, da temperatura ostane enaka (pri hitrem stiskanju bi se zrak segrel, kot v tlačilki za kolo), dokler plinu ne ostane polovica prostornine, $1\,\mathrm{L}$. Molekule so enako hitre kot prej, a jih je v vsakem kubičnem centimetru dvakrat več, zato vsak kos stene zadenejo dvakrat pogosteje. Tlak se podvoji na $200\,\mathrm{kPa}$.

:::risba skica
opis: Dva valja z batom, plin je osenčen. V levem je bat izvlečen skoraj do konca valja: 8 molekul je razporejenih po prostornini 2 L, tlak je 100 kPa. V desnem, enako dolgem valju je bat potisnjen na polovico prostornine: istih 8 molekul je v prostornini 1 L, torej dvakrat bolj na gosto, tlak je 200 kPa. Del valja za batom je v obeh prazen.
območje: 0; -1,6 .. 10,8; 2,9
pravokotnik: 0,3; 0 .. 4,3; 2 | siva
črta: 4,3; 0 -> 4,3; 2 | debelo
črta: 4,3; 1 -> 5,3; 1 | debelo
črta: 4,3; 0 -> 5; 0
črta: 4,3; 2 -> 5; 2
napis: 4,8; 1,5 | bat
krog: 0,8; 0,5 | 0,08 | polno modra
krog: 1,5; 1,5 | 0,08 | polno modra
krog: 2; 0,7 | 0,08 | polno modra
krog: 2,5; 1,6 | 0,08 | polno modra
krog: 3; 0,4 | 0,08 | polno modra
krog: 3,4; 1,2 | 0,08 | polno modra
krog: 3,9; 1,7 | 0,08 | polno modra
krog: 1; 1,1 | 0,08 | polno modra
napis: 2,3; 2,5 | 2 L
napis: 2,3; -0,6 | 100 kPa
napis: 2,3; -1,2 | 8 molekul
pravokotnik: 5,8; 0 .. 7,8; 2 | siva
črta: 7,8; 0 -> 10,5; 0
črta: 7,8; 2 -> 10,5; 2
črta: 7,8; 0 -> 7,8; 2 | debelo
črta: 7,8; 1 -> 8,8; 1 | debelo
napis: 8,4; 1,5 | bat
krog: 6,05; 0,5 | 0,08 | polno modra
krog: 6,4; 1,5 | 0,08 | polno modra
krog: 6,65; 0,7 | 0,08 | polno modra
krog: 6,9; 1,6 | 0,08 | polno modra
krog: 7,15; 0,4 | 0,08 | polno modra
krog: 7,35; 1,2 | 0,08 | polno modra
krog: 7,6; 1,7 | 0,08 | polno modra
krog: 6,15; 1,1 | 0,08 | polno modra
napis: 6,8; 2,5 | 1 L
napis: 6,8; -0,6 | 200 kPa
napis: 6,8; -1,2 | istih 8, dvakrat gosteje
:::

Tlak in prostornina sta obratno sorazmerna, njun produkt je stalen. To je **Boyle-Mariottov zakon**:

$$p_1 V_1 = p_2 V_2$$

Za plastenko s Kredarice (če je temperatura enaka): $V_2 = 0{,}5\,\mathrm{L} \cdot \dfrac{75\,\mathrm{kPa}}{98\,\mathrm{kPa}} \approx 0{,}38\,\mathrm{L}$. Zrak v njej se stisne za približno $0{,}12\,\mathrm{L}$.

Graf kaže to zvezo za $1\,\mathrm{mol}$ zraka pri $300\,\mathrm{K}$. Pri $V = 25\,\mathrm{L}$ je tlak $99{,}72\,\mathrm{kPa}$. Osenčeni pravokotnik pod točko ima ploščino $pV = 2493\,\mathrm{kPa\,L}$. Napovej tlak pri $50\,\mathrm{L}$, nato v aplikaciji premakni drsnik za prostornino in preveri. Pri $10\,\mathrm{L}$ je pravokotnik ožji in višji ($249{,}3\,\mathrm{kPa}$), ploščina pa ostane $2493$. Nato premakni drsnik za temperaturo na $600\,\mathrm{K}$: cela krivulja se dvigne, ploščina se podvoji. Zakaj, pove 5. točka.

:::risba graf
opis: Graf tlaka p v kilopaskalih v odvisnosti od prostornine V v litrih za 1 mol plina pri stalni temperaturi. Krivulja pada: večja prostornina, manjši tlak. V aplikaciji se z drsnikoma spreminjata prostornina in temperatura. Izbrano je V = {V} L in T = {T} K: tlak je {8,31*T/V} kPa, pravokotnik med izhodiščem in točko na krivulji ima ploščino {8,31*T} kPa·L.
x: 0 .. 60 | 10 | V (L)
y: 0 .. 600 | 100 | p (kPa)
drsnik: V | 10 .. 50 | 5 | 25 | prostornina V v litrih
drsnik: T | 200 .. 600 | 50 | 300 | temperatura T v kelvinih
pravokotnik: 0; 0 .. V; 8,31*T/V | oranžna
f: 8,31*T/x | modra | 5 .. 52
točka: V; 8,31*T/V
podnapis: {V} L, {T} K: p = {8,31*T/V} kPa, pV = {8,31*T} kPa·L
:::

**3. Stalni tlak (izobarna sprememba).** Balon na soncu se napihne, v mrazu se skrči. Hitrejše molekule udarjajo močneje in opno potiskajo navzven, dokler niso trki toliko redkejši, da je tlak spet enak zunanjemu. Šolski poskus: zrak v tanki stekleni cevki zapira kapljica živega srebra, ki se prosto premika, zato je tlak stalen. Cevko damo v mešanico ledu in vode, nato v vrelo vodo in merimo dolžino zračnega stolpca.

Gay-Lussac je leta 1802 nameril, da se zrak med $0\,^\circ\mathrm{C}$ in $100\,^\circ\mathrm{C}$ raztegne za $37{,}5\,\%$. Natančnejše meritve Magnusa in Regnaulta okoli leta 1840 so dale približno $36{,}65\,\%$; tukaj računamo s $36{,}6\,\%$. Preračunano na $1\,\mathrm{mol}$ pri $100\,\mathrm{kPa}$ je to rast z $22{,}7\,\mathrm{L}$ na $31{,}0\,\mathrm{L}$. Tudi meritve pri vmesnih temperaturah ležijo na premici skozi ti točki.

Premico podaljšamo še navzdol, pod območje meritev (ekstrapolacija). Prostornina bi dosegla nič $\dfrac{100}{0{,}366} \approx 273$ stopinj pod lediščem, pri $-273\,^\circ\mathrm{C}$. Tej temperaturi pravimo **absolutna ničla**. To je podaljšek modela: pravi zrak se pri okoli $-194\,^\circ\mathrm{C}$ utekočini in prostornine nič ne doseže.

Če temperaturo štejemo od absolutne ničle, $T = t + 273$, dobimo za točke s premice:

| $t$ [$^\circ\mathrm{C}$] | $T$ [K] | $V$ [L] | $V/T$ [L/K] |
|---|---|---|---|
| $0$ | $273$ | $22{,}7$ | $0{,}083$ |
| $50$ | $323$ | $26{,}8$ | $0{,}083$ |
| $100$ | $373$ | $31{,}0$ | $0{,}083$ |
| $-100$ (podaljšek) | $173$ | $14{,}4$ | $0{,}083$ |

Zadnji stolpec je stalen prav zato, ker $T$ štejemo od točke, kjer premica zadene os: prostornina je premo sorazmerna z absolutno temperaturo. Pri nas je to **Gay-Lussacov zakon**, drugod mu rečejo Charlesov. Sorazmernost velja le v kelvinih, ne v stopinjah Celzija.

$$\frac{V_1}{T_1} = \frac{V_2}{T_2}$$

Na grafu so točke iz tabele (pri $100\,\mathrm{kPa}$). Polna črta je območje meritev, črtkana podaljšek proti mrazu; na njem leži točka pri $-100\,^\circ\mathrm{C}$. Pod sliko sta prostornini pri $0\,^\circ\mathrm{C}$ in $100\,^\circ\mathrm{C}$: $22{,}69\,\mathrm{L}$ in $31{,}00\,\mathrm{L}$. V aplikaciji z drsnikom spremeni tlak: pri $50\,\mathrm{kPa}$ je premica dvakrat strmejša (pri $0\,^\circ\mathrm{C}$ je $45{,}37\,\mathrm{L}$), pri $200\,\mathrm{kPa}$ položnejša ($11{,}34\,\mathrm{L}$). Razmerje obeh prostornin pod sliko (deli ju sam) ostane približno $1{,}37$, natančno $373 : 273$, premica pa vedno zadene vodoravno os pri $-273\,^\circ\mathrm{C}$.

:::risba graf
opis: Graf prostornine V v litrih v odvisnosti od temperature t v stopinjah Celzija za 1 mol plina pri stalnem tlaku. Premica narašča; polna je med 0 in 100 °C, kjer so točke pri 0, 50 in 100 °C, črtkan podaljšek s točko pri −100 °C seka vodoravno os pri −273 °C. V aplikaciji se z drsnikom spreminja tlak. Izbrano je p = {p} kPa: pri 0 °C je prostornina {8,31*273/p} L, pri 100 °C {8,31*373/p} L. Pri vsakem tlaku premica zadene os v isti točki, −273 °C.
x: -300 .. 150 | 100 | t (°C)
y: 0 .. 70 | 10 | V (L)
drsnik: p | 50 .. 200 | 25 | 100 | tlak p v kilopaskalih
f: 8,31*(x + 273)/p | modra črtkano | -273 .. 0
f: 8,31*(x + 273)/p | modra | 0 .. 100
točka: -100; 8,31*173/p
točka: 0; 8,31*273/p
točka: 50; 8,31*323/p
točka: 100; 8,31*373/p
točka: -273; 0 | | | oranžna
puščica: -225; 37 -> -268; 4 | | | oranžna
napis: -215; 43 | −273 °C | | oranžna
podnapis: p = {p} kPa: V = {8,31*273/p:.2} L pri 0 °C, {8,31*373/p:.2} L pri 100 °C
:::

:::premisli
Sošolec reče: »Plin segrejem z $10\,^\circ\mathrm{C}$ na $20\,^\circ\mathrm{C}$, temperatura se podvoji, torej se podvoji tudi prostornina.« Napovej, za koliko se prostornina res poveča, in pojasni, zakaj se moti.
---
Le za približno $3{,}5\,\%$: absolutna temperatura zraste z $283\,\mathrm{K}$ na $293\,\mathrm{K}$. Celzijeva lestvica ima ničlo pri ledišču vode, ne tam, kjer bi plin imel prostornino nič, zato razmerje stopinj nima fizikalnega pomena.
:::

**4. Stalna prostornina (izohorna sprememba).** V zaprti jeklenki ali gumi se prostornina skoraj ne spremeni. Ko plin segrejemo, so molekule hitrejše, ob stene udarjajo močneje in pogosteje. Zrak v togi bučki, ki ima pri $0\,^\circ\mathrm{C}$ tlak $100\,\mathrm{kPa}$, ima pri $100\,^\circ\mathrm{C}$ približno $136{,}6\,\mathrm{kPa}$: tlak zraste za enak delež kot prej prostornina. Razmerje $p/T$ je obakrat $0{,}366\,\mathrm{kPa/K}$, podaljšana premica $p(t)$ pa spet zadene ničlo pri $-273\,^\circ\mathrm{C}$. Absolutno ničlo torej pokažeta dva različna poskusa. Tlak je premo sorazmeren z absolutno temperaturo; to je **Amontonsov zakon** (v nekaterih učbenikih brez posebnega imena):

$$\frac{p_1}{T_1} = \frac{p_2}{T_2}$$

Enako kaže prvi graf: v aplikaciji pusti $V = 25\,\mathrm{L}$ in premakni temperaturo s $300\,\mathrm{K}$ na $600\,\mathrm{K}$. Tlak zraste z $99{,}72\,\mathrm{kPa}$ na $199{,}44\,\mathrm{kPa}$.

**5. Vse naenkrat.** Pri plastenki s Kredarice se spremenita tlak in temperatura hkrati, saj je na vrhu hladneje kot v mestu. Tako spremembo razdelimo na dva koraka, ki ju že poznamo. Najprej pri stalni temperaturi $T_1$ spremenimo tlak s $p_1$ na $p_2$. Po Boyle-Mariottovem zakonu dobi plin vmesno prostornino $V'$:

$$V' = \frac{p_1 V_1}{p_2}$$

Nato ga pri stalnem tlaku $p_2$ segrejemo s $T_1$ na $T_2$. Po Gay-Lussacovem zakonu velja:

$$\frac{V'}{T_1} = \frac{V_2}{T_2}$$

Vstavimo $V'$ in tlak $p_2$ prenesemo na desno. Za dano količino plina je torej $\dfrac{pV}{T}$ stalen:

$$\frac{p_1 V_1}{T_1} = \frac{p_2 V_2}{T_2}$$

Koliko je ta stalnica? Tega ne moremo izpeljati, treba jo je izmeriti. Meritve pokažejo, da je za en mol katerega koli plina $\dfrac{pV}{T} = 8{,}31\,\mathrm{J/K}$ (enota je joule, ker je $1\,\mathrm{Pa \cdot m^3} = 1\,\mathrm{N\,m} = 1\,\mathrm{J}$). To je **splošna plinska konstanta** $R = 8{,}31\,\mathrm{J/(mol\,K)}$. Preveri s točko z drugega grafa, ki je narisan s to vrednostjo: $\dfrac{100\,000\,\mathrm{Pa} \cdot 0{,}02269\,\mathrm{m^3}}{273\,\mathrm{K}} \approx 8{,}31\,\mathrm{J/K}$.

Kaj pa dva mola? Združi dve enaki posodi z enim molom pri istem tlaku in temperaturi: $p$ in $T$ ostaneta, prostornina se podvoji. Stalnica je torej sorazmerna z množino snovi $n$. Tako dobimo **plinsko enačbo**:

$$pV = nRT$$

Zato se je ploščina pravokotnika na prvem grafu pri $600\,\mathrm{K}$ podvojila: $pV$ raste premo sorazmerno s $T$.

Količino plina izračunamo iz mase: $n = \dfrac{m}{M}$, kjer je $M$ molska masa (za helij $4\,\mathrm{g/mol}$, za zrak okoli $29\,\mathrm{g/mol}$).

:::premisli
En mol helija ima maso $4\,\mathrm{g}$, en mol kisika $32\,\mathrm{g}$. Kateri od njiju ima pri enakem tlaku in temperaturi večjo prostornino?
---
Prostornini sta enaki. V enačbi $pV = nRT$ ni molske mase: šteje le število molekul, ne njihova masa. Lažje molekule helija ob steno udarijo šibkeje, a so hitrejše in zato trkajo pogosteje. Oboje se ravno izravna, zato je tlak enak kot pri težjih molekulah kisika.
:::

**6. Idealni plin.** Enačba $pV = nRT$ natančno velja za **idealni plin**: model, v katerem so molekule drobne točke, ki se med seboj ne privlačijo in le trkajo. Zrak, helij in drugi plini se pri običajnih tlakih in temperaturah obnašajo skoraj idealno. Odstopanja so velika pri zelo visokih tlakih in blizu utekočinjenja: v gasilnem aparatu (okoli $60\,\mathrm{bar}$) je del ogljikovega dioksida že tekoč.

V simulaciji spodaj (»Plin v posodi: tlak, prostornina, temperatura«) nastavi temperaturo na $300\,\mathrm{K}$ in prostornino na $20\,\mathrm{dm^3}$ (to je $20\,\mathrm{L}$), nato prostornino zmanjšaj na $10\,\mathrm{dm^3}$. Opazuj, da se tlak podvoji, molekule pa so enako hitre kot prej.

## Rešeni primeri

### Primer 1: mehurček z dna jezera

Iz mulja na dnu jezera se odtrga mehurček plina s prostornino $2\,\mathrm{cm^3}$. Na dnu, $20\,\mathrm{m}$ globoko, je tlak $300\,\mathrm{kPa}$ (vsakih $10\,\mathrm{m}$ vode doda približno $100\,\mathrm{kPa}$), na gladini $100\,\mathrm{kPa}$. Kolikšna je prostornina mehurčka tik pod gladino, če je voda povsod enako topla?

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

### Primer 2: guma po vožnji

Pred vožnjo pri $10\,^\circ\mathrm{C}$ merilnik na črpalki pokaže v avtomobilski gumi $2{,}2\,\mathrm{bar}$, po dolgi vožnji $2{,}5\,\mathrm{bar}$. Merilnik kaže nadtlak, torej razliko do zunanjega tlaka $1{,}0\,\mathrm{bar}$. Kolikšna je temperatura zraka v gumi po vožnji? Prostornina gume naj se ne spremeni.

**Podatki:** nadtlaka $2{,}2\,\mathrm{bar}$ in $2{,}5\,\mathrm{bar}$, zunanji tlak $1{,}0\,\mathrm{bar}$, $t_1 = 10\,^\circ\mathrm{C}$, prostornina je stalna
**Iščemo:** temperaturo $t_2$

:::formula
$\dfrac{p_1}{T_1} = \dfrac{p_2}{T_2}$
:::

**Rešitev:**

1. V zakon sodi pravi tlak, zato nadtlaku prištejemo zunanji tlak: $p_1 = 3{,}2\,\mathrm{bar}$, $p_2 = 3{,}5\,\mathrm{bar}$.
2. Temperatura v kelvinih, ker sorazmernost velja le zanje: $T_1 = 283\,\mathrm{K}$.
3. Izrazimo $T_2 = T_1 \dfrac{p_2}{p_1} = 283\,\mathrm{K} \cdot \dfrac{3{,}5\,\mathrm{bar}}{3{,}2\,\mathrm{bar}} \approx 309{,}5\,\mathrm{K}$. Tlaka smeta ostati v barih, ker nastopata kot razmerje.
4. Nazaj v stopinje Celzija: $309{,}5\,\mathrm{K}$ je $36{,}5\,^\circ\mathrm{C}$, torej približno $37\,^\circ\mathrm{C}$.
5. Odgovor: zrak v gumi se je segrel na približno $37\,^\circ\mathrm{C}$. Odčitek na $0{,}1\,\mathrm{bar}$ natančno pomeni približno $\pm 9\,^\circ\mathrm{C}$, zato je to ocena. Tlak v gumah meri pred vožnjo, ko so hladne.

### Primer 3: vremenski balon

Meteorologi spustijo balon z merilnimi napravami. Pri tleh ga napolnijo s $2\,\mathrm{m^3}$ helija pri tlaku $100\,\mathrm{kPa}$ in temperaturi $15\,^\circ\mathrm{C}$. Koliko helija je v balonu (v molih in kilogramih)? Kolikšna je prostornina balona na višini $10\,\mathrm{km}$, kjer je tlak $26\,\mathrm{kPa}$ in temperatura $-50\,^\circ\mathrm{C}$? Tlak v balonu naj bo enak zunanjemu.

**Podatki:** $V_1 = 2\,\mathrm{m^3}$, $p_1 = 100\,\mathrm{kPa}$, $t_1 = 15\,^\circ\mathrm{C}$, $p_2 = 26\,\mathrm{kPa}$, $t_2 = -50\,^\circ\mathrm{C}$, $M = 4\,\mathrm{g/mol}$, $R = 8{,}31\,\mathrm{J/(mol\,K)}$
**Iščemo:** količino $n$, maso $m$ in prostornino $V_2$

:::formula
$pV = nRT$, $m = nM$

$\dfrac{p_1 V_1}{T_1} = \dfrac{p_2 V_2}{T_2}$
:::

**Rešitev:**

1. Temperaturi v kelvinih: $T_1 = 288\,\mathrm{K}$, $T_2 = 223\,\mathrm{K}$.
2. Iz plinske enačbe izrazimo $n = \dfrac{p_1 V_1}{R T_1}$. Vstavimo osnovne enote, tlak v paskalih: $n = \dfrac{100\,000 \cdot 2}{8{,}31 \cdot 288}\,\mathrm{mol} \approx 83{,}6\,\mathrm{mol}$. Ocena na pamet: mol plina pri sobnih pogojih zavzame okoli $24\,\mathrm{L}$, $2000 : 24 \approx 83$.
3. Masa: $m = 83{,}6\,\mathrm{mol} \cdot 0{,}004\,\mathrm{kg/mol} \approx 0{,}33\,\mathrm{kg}$ (molska masa v kg/mol da maso v kg).
4. Na višini se spremenita tlak in temperatura, zato vzamemo združeni zakon in izrazimo $V_2 = V_1 \dfrac{p_1}{p_2} \dfrac{T_2}{T_1}$. Vstavimo: $V_2 = 2\,\mathrm{m^3} \cdot \dfrac{100}{26} \cdot \dfrac{223}{288} \approx 5{,}96\,\mathrm{m^3}$.
5. Preverimo smiselnost: tlak pade skoraj na četrtino (balon se napihne), mraz ga nekoliko skrči, zato je rezultat manjši od štirikratne prostornine.
6. Odgovor: v balonu je približno $84\,\mathrm{mol}$ oziroma $0{,}33\,\mathrm{kg}$ helija; na višini $10\,\mathrm{km}$ ima prostornino približno $6\,\mathrm{m^3}$.

Na sliki sta balona v istem merilu: prostornina se potroji, premer zraste le z $1{,}56\,\mathrm{m}$ na $2{,}25\,\mathrm{m}$.

:::risba skica
opis: Dva balona kot kroga v istem merilu. Levi, pri tleh, ima premer 1,56 m: prostornina 2 m³, tlak 100 kPa, temperatura 15 °C. Desni, na višini 10 km, ima premer 2,25 m: prostornina 6 m³, tlak 26 kPa, temperatura −50 °C.
območje: 0; -1,2 .. 6; 2,9
krog: 1,3; 1,2 | 0,78 | ozadje
napis: 1,3; 1,2 | 2 m^3
napis: 1,3; 2,35 | pri tleh
napis: 1,3; -0,3 | 100 kPa, 15 °C
napis: 1,3; -0,85 | premer 1,56 m
krog: 4,3; 1,2 | 1,125 | ozadje
napis: 4,3; 1,2 | 6 m^3
napis: 4,3; 2,6 | na 10 km
napis: 4,3; -0,3 | 26 kPa, −50 °C
napis: 4,3; -0,85 | premer 2,25 m
:::

### Primer 4: zdaj ti

Vrnimo se k plastenki s Kredarice. Zapreš jo pri $75\,\mathrm{kPa}$ in $2\,^\circ\mathrm{C}$, v Ljubljani je $98\,\mathrm{kPa}$ in $22\,^\circ\mathrm{C}$. Kolikšna je prostornina zraka v plastenki v Ljubljani?

**Podatki:** $V_1 = 0{,}5\,\mathrm{L}$, $p_1 = 75\,\mathrm{kPa}$, $t_1 = 2\,^\circ\mathrm{C}$, $p_2 = 98\,\mathrm{kPa}$, $t_2 = 22\,^\circ\mathrm{C}$
**Iščemo:** prostornino $V_2$

:::formula
$\dfrac{p_1 V_1}{T_1} = \dfrac{p_2 V_2}{T_2}$
:::

**Rešitev:**

1. Temperaturi v kelvinih: $T_1 = 275\,\mathrm{K}$, $T_2 = 295\,\mathrm{K}$.
2. Izrazimo $V_2 = V_1 \dfrac{p_1}{p_2} \dfrac{T_2}{T_1}$. Vstavi in izračunaj sam.

:::premisli
Kolikšna je $V_2$? Je večja ali manjša kot pri računu brez spremembe temperature ($0{,}38\,\mathrm{L}$)?
---
$V_2 = 0{,}5\,\mathrm{L} \cdot \dfrac{75}{98} \cdot \dfrac{295}{275} \approx 0{,}41\,\mathrm{L}$. Večja je, ker toplejši zrak v mestu potrebuje več prostora; plastenka je zato nekoliko manj zmečkana.
:::

Trda plastenka zdrži del razlike tlakov, zato je v resnici zmečkana še manj.

## Pogoste napake

- **Temperatura v stopinjah Celzija.** Dijak vstavi $t = 20$ namesto $T = 293\,\mathrm{K}$. Plinski zakoni pa veljajo za absolutno temperaturo; pri $0\,^\circ\mathrm{C}$ bi s Celzijem delil z nič. Vsako temperaturo najprej pretvori v kelvine.
- **Litri in kilopaskali v $pV = nRT$.** Ker je $R = 8{,}31\,\mathrm{J/(mol\,K)}$, morajo biti tlak v Pa in prostornina v $\mathrm{m^3}$. Kdor vstavi samo kPa ali samo litre, dobi $1000$-krat napačen rezultat. Par kPa in L skupaj se izide, ker je $1\,\mathrm{kPa \cdot L} = 1\,\mathrm{J}$; tako sta narisana grafa zgoraj. V razmerjih ($p_1 V_1 = p_2 V_2$) enote smeš obdržati, ker se pokrajšajo.
- **»Večji tlak, večja prostornina.«** Ker pri segrevanju rasteta obe, dijak misli, da tlak in prostornina vedno rasteta skupaj. Pri stalni temperaturi sta obratno sorazmerna: če tlak pade na polovico, se prostornina podvoji.
- **Nadtlak namesto tlaka.** Merilnik na črpalki pokaže, za koliko je tlak v gumi večji od zunanjega. V plinske zakone vstavi pravi tlak, sicer razmerja niso pravilna: v Primeru 2 bi z nadtlakoma dobil $49\,^\circ\mathrm{C}$ namesto $37\,^\circ\mathrm{C}$.

## Povzetek

- Idealni plin: molekule kot točke, brez privlačnih sil, le trki; zrak in helij pri običajnih pogojih se tako obnašata.
- Plinska enačba: $pV = nRT$, $R = 8{,}31\,\mathrm{J/(mol\,K)}$, $n = \dfrac{m}{M}$; $p$ v Pa, $V$ v $\mathrm{m^3}$, $T$ v K.
- Za dano količino plina je $\dfrac{pV}{T}$ stalen: $\dfrac{p_1 V_1}{T_1} = \dfrac{p_2 V_2}{T_2}$.
- Posebni primeri: izotermna ($pV$ stalen, Boyle-Mariottov zakon), izobarna ($V/T$ stalen, Gay-Lussacov zakon), izohorna ($p/T$ stalen, Amontonsov zakon).
- Merilnik na črpalki kaže nadtlak; v zakone sodi pravi tlak (nadtlak plus zunanji tlak).
- Temperatura vedno v kelvinih; absolutna ničla je pri $-273\,^\circ\mathrm{C}$.

## Drugače: Z analogijo

Predstavljaj si igrišče za skvoš, po katerem brez prestanka leti $20$ žogic. Žogice so molekule, tlak pa pove, kako pogosto in kako močno udarjajo ob stene.

- **Manjše igrišče.** Zadnjo steno premakni do polovice. Žogice so dvakrat bolj na gosto, zato vsak kos stene dobi dvakrat več udarcev: prostornina na polovico, tlak dvakrat večji.
- **Hitrejše žogice.** Segret plin so hitrejše žogice. Udarijo močneje in se prej vrnejo, zato tlak raste s temperaturo.
- **Več žogic.** S $40$ žogicami je udarcev dvakrat več. To je $n$ v enačbi $pV = nRT$.
- **Premična stena.** Če se stena lahko odmika, jo hitrejše žogice potisnejo nazaj, dokler redkejši, a močnejši udarci na steno ne pritiskajo spet enako kot prej.

Analogija ima mejo: prave žogice se sčasoma ustavijo, molekule pa pri trkih ne izgubljajo energije, zato tlak ne pojenja.

## Drugače: Bolj natančno

Plinsko enačbo lahko zapišemo s številom molekul $N$: $pV = N k_B T$, kjer je $k_B = 1{,}38 \cdot 10^{-23}\,\mathrm{J/K}$ Boltzmannova konstanta. Ker je v molu $N_A = 6{,}02 \cdot 10^{23}$ molekul, velja $R = N_A k_B$.

Idealni plin predpostavlja dvoje: molekule nimajo lastne prostornine in se med trki ne privlačijo. Pri visokem tlaku so molekule tako blizu, da njihova lastna prostornina ni več zanemarljiva. Pri nizki temperaturi, blizu utekočinjenja, privlačne sile zmanjšajo tlak na stene.

## Preveri se

? Na grafu so štiri stanja plina. Tri pripadajo isti količini plina pri isti temperaturi. Odčitaj koordinate točk: katera ne spada zraven?
:::risba graf
opis: Graf tlaka p v kilopaskalih v odvisnosti od prostornine V v litrih s štirimi točkami. A je pri 1 L in 400 kPa, B pri 2 L in 300 kPa, C pri 4 L in 100 kPa, D pri 8 L in 50 kPa.
x: 0 .. 9 | 1 | V (L)
y: 0 .. 500 | 50 | p (kPa)
točka: 1; 400 | A | nad desno
točka: 2; 300 | B | nad desno
točka: 4; 100 | C | nad desno
točka: 8; 50 | D | nad desno
:::
- A
~ Največji tlak ne pomeni, da točka izstopa. Produkt je $1 \cdot 400 = 400\,\mathrm{kPa\,L}$, enako kot pri dveh drugih.
+ B
- C
~ Prostornina je štirikrat večja kot pri A, tlak pa štirikrat manjši. Tako mora biti: $4 \cdot 100 = 400\,\mathrm{kPa\,L}$.
- D
~ Majhen tlak pri veliki prostornini je pričakovan: $8 \cdot 50 = 400\,\mathrm{kPa\,L}$.
> Pri stalni temperaturi je $pV$ stalen. Točke A, C in D dajo $400\,\mathrm{kPa\,L}$, točka B pa $2 \cdot 300 = 600\,\mathrm{kPa\,L}$. Ni dovolj, da tlak pada, ko prostornina raste.

? Graf kaže prostornino plina v odvisnosti od absolutne temperature pri stalnem tlaku $100\,\mathrm{kPa}$. Z grafa odčitaj eno točko na premici in izračunaj, koliko molov plina je v posodi. Vzemi $R = 8{,}31\,\mathrm{J/(mol\,K)}$.
:::risba graf
opis: Graf prostornine V v litrih v odvisnosti od absolutne temperature T v kelvinih. Premica gre iz izhodišča in enakomerno narašča do desnega roba mreže; os T sega do 600 K, os V do 50 L. Vrednosti je treba odčitati z mreže.
x: 0 .. 600 | 100 | T (K)
y: 0 .. 50 | 10 | V (L)
f: x/15 | modra | 0 .. 600
:::
= 0,80 mol | 0,03
~ 802 | Prostornino si vstavil v litrih. Ob tlaku v Pa mora biti v $\mathrm{m^3}$: $20\,\mathrm{L} = 0{,}020\,\mathrm{m^3}$.
~ 0,0008 | Tlak si vstavil v kPa, prostornino pa v $\mathrm{m^3}$. Z $R = 8{,}31\,\mathrm{J/(mol\,K)}$ mora biti tlak v Pa.
~ 1,25 | Izračunal si $\dfrac{RT}{pV}$, obratno vrednost. Iz $pV = nRT$ sledi $n = \dfrac{pV}{RT}$.
> Premica gre skozi točko $300\,\mathrm{K}$, $20\,\mathrm{L}$ (tudi $600\,\mathrm{K}$, $40\,\mathrm{L}$). $n = \dfrac{pV}{RT} = \dfrac{100\,000 \cdot 0{,}020}{8{,}31 \cdot 300} \approx 0{,}80\,\mathrm{mol}$. Ker je $\dfrac{V}{T}$ stalen, da vsaka točka premice isto.

? Zakaj je guma kolesa zjutraj po mrzli noči mehkejša kot popoldne na soncu, čeprav je nihče ni dopolnil?
- Ker ponoči nekaj zraka uide skozi ventil.
~ Če bi zrak ušel, guma popoldne ne bi bila spet trda. Sprememba se vrača, zato jo povzroča temperatura.
- Ker se guma na mrazu raztegne in ima zrak več prostora.
~ Guma se pri ohlajanju kvečjemu malo skrči. Njena prostornina se skoraj ne spremeni, spremeni se tlak.
- Ker se zrak v mrazu skrči, manjša prostornina pa pomeni manjši tlak.
~ To je napaka »manjša prostornina, manjši tlak«. Plin vedno zapolni vso gumo; pri stisnjenem plinu bi bil tlak večji, ne manjši.
+ Ker je zrak v gumi hladnejši, pri skoraj enaki prostornini pa je tlak sorazmeren z absolutno temperaturo.
> Pri izohorni spremembi je $\dfrac{p}{T}$ stalen. Nižja temperatura ponoči pomeni nižji tlak, na soncu pa tlak spet zraste.

? Plin v zaprti jeklenki ima pri $27\,^\circ\mathrm{C}$ tlak $200\,\mathrm{kPa}$. Sošolka računa tlak pri $327\,^\circ\mathrm{C}$ v treh korakih: (1) prostornina je stalna, zato velja $\dfrac{p_1}{T_1} = \dfrac{p_2}{T_2}$; (2) izrazi $p_2 = p_1 \dfrac{T_2}{T_1}$; (3) vstavi $p_2 = 200\,\mathrm{kPa} \cdot \dfrac{327}{27}$ in dobi približno $2400\,\mathrm{kPa}$. Kateri korak je napačen?
- 1. korak
~ Jeklenka je toga, prostornina in količina plina se ne spremenita. Zakon je izbran pravilno.
- 2. korak
~ Enačbo je pomnožila s $T_2$, kar je pravilno. Napaka je šele pri vstavljanju.
+ 3. korak
- Noben, rezultat je pravilen.
~ Tlak bi zrasel dvanajstkrat, ker je vstavila stopinje Celzija. Sorazmernost velja le za absolutno temperaturo.
> V 3. koraku morata biti temperaturi v kelvinih: $T_1 = 300\,\mathrm{K}$, $T_2 = 600\,\mathrm{K}$. Tlak se podvoji na $400\,\mathrm{kPa}$.

? Nogometno žogo napihneš v garderobi pri $22\,^\circ\mathrm{C}$; merilnik pokaže nadtlak $0{,}80\,\mathrm{bar}$, zunanji tlak je $1{,}00\,\mathrm{bar}$. Na igrišču se zrak v žogi ohladi na $2\,^\circ\mathrm{C}$. Koliko pokaže merilnik zdaj, če se prostornina žoge ne spremeni?
= 0,68 bar | 0,01
~ 0,75 | V zakon si vstavil nadtlak: $0{,}80 \cdot \tfrac{275}{295}$. S temperaturo je sorazmeren pravi tlak, $1{,}80\,\mathrm{bar}$.
~ 1,68 | To je pravi tlak v žogi. Merilnik pokaže le razliko do zunanjega tlaka, zato odštej $1{,}00\,\mathrm{bar}$.
~ 0,07 | Dve napaki: vstavil si nadtlak in temperaturi v stopinjah ($0{,}80 \cdot \tfrac{2}{22}$). V zakon sodita pravi tlak in kelvini.
> Pravi tlak: $p_1 = 1{,}80\,\mathrm{bar}$. Pri stalni prostornini je $p_2 = 1{,}80\,\mathrm{bar} \cdot \dfrac{275}{295} \approx 1{,}68\,\mathrm{bar}$, merilnik pa pokaže $0{,}68\,\mathrm{bar}$.

? V štirih posodah je po $1\,\mathrm{mol}$ istega plina. Razvrsti posode od najnižjega do najvišjega tlaka.
1. $50\,\mathrm{L}$ pri $300\,\mathrm{K}$
2. $25\,\mathrm{L}$ pri $300\,\mathrm{K}$
3. $25\,\mathrm{L}$ pri $450\,\mathrm{K}$
4. $10\,\mathrm{L}$ pri $300\,\mathrm{K}$
> Pri enaki množini je tlak sorazmeren s $\dfrac{T}{V}$: $6$, $12$, $18$ in $30\,\mathrm{K/L}$. Manjša prostornina in višja temperatura obe povečata tlak.

:::simboli
p | tlak | p = \frac{nRT}{V} | Pa
V | prostornina | V = \frac{nRT}{p} | m^3
T | absolutna temperatura | T = \frac{pV}{nR} | K
n | množina snovi (količina plina) | n = \frac{m}{M} | mol
R | splošna plinska konstanta | R = \frac{pV}{nT} | J/(mol\,K) | $8{,}31\,\mathrm{J/(mol\,K)}$
m | masa plina | m = nM | kg
M | molska masa | | kg/mol | v besedilu tudi g/mol: helij $4$, zrak $29$
p_1, p_2 | tlak v začetnem in končnem stanju | | Pa | v razmerjih sme ostati kPa ali bar
V_1, V_2 | prostornina v začetnem in končnem stanju | | m^3 | v razmerjih sme ostati L ali $\mathrm{cm^3}$
t | temperatura v stopinjah Celzija | t = T - 273 | ^\circ\mathrm{C}
t_1, t_2 | temperatura v začetnem in končnem stanju v stopinjah Celzija | | ^\circ\mathrm{C}
N | število molekul | N = n N_A | –
k_B | Boltzmannova konstanta | | J/K | $1{,}38 \cdot 10^{-23}\,\mathrm{J/K}$
N_A | Avogadrova konstanta | | 1/mol | $6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$
V' | vmesna prostornina po prvem koraku | V' = \frac{p_1 V_1}{p_2} | m^3
T_1, T_2 | absolutna temperatura v začetnem in končnem stanju | | K
:::
