---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta 1783 je francoski fizik Jacques Charles iz Pariza poletel z balonom, polnim vodika. Balon je imel ventil, skozi katerega je lahko izpuščal plin, ko se je ta v redkejšem zraku širil. Pozneje je meril, kako se plini raztezajo pri segrevanju; zakon o tem v mnogih državah še danes nosi njegovo ime.

Isti pojav srečaš na planinski turi. Na Kredarici popiješ vodo in zapreš prazno plastenko s prostornino $0{,}5\,\mathrm{L}$. Zračni tlak je tam okoli $75\,\mathrm{kPa}$. Ko se vrneš v Ljubljano, kjer je tlak okoli $98\,\mathrm{kPa}$, je plastenka zmečkana. Koliko prostornine je izgubila?

V nasprotju s trdninami, ki se pri segrevanju razširijo le za tisočinke, plin močno spremeni prostornino, kadar se spremeni tlak ali temperatura. Iste zveze uporabljajo potapljači pri dihanju pod vodo, kolesarji pri polnjenju gum in meteorologi pri vremenskih balonih.

## Razlaga

**1. Stanje plina.** Plin vedno zapolni vso posodo. Njegove molekule se gibljejo hitro in neurejeno ter trkajo ob stene; vsi ti trki skupaj dajo **tlak** $p$ (v paskalih, $1\,\mathrm{bar} = 100\,\mathrm{kPa}$). Stanje plina opišejo štiri količine: tlak $p$, prostornina $V$ (v $\mathrm{m^3}$, $1\,\mathrm{L} = 10^{-3}\,\mathrm{m^3}$), temperatura $T$ v kelvinih (številsko $T = t + 273$, torej je $0\,^\circ\mathrm{C}$ enako $273\,\mathrm{K}$) in **množina snovi** $n$ v molih, na kratko količina plina (en mol je $6{,}02 \cdot 10^{23}$ molekul).

*Preveri:* koliko $\mathrm{m^3}$ je $0{,}5\,\mathrm{L}$? Odgovor: $5 \cdot 10^{-4}\,\mathrm{m^3}$.

**2. Stalna temperatura.** V valju z batom sta $2\,\mathrm{L}$ zraka pri $100\,\mathrm{kPa}$. Bat potisni tako, da plinu ostane polovica prostornine, $1\,\mathrm{L}$. Molekule so enako hitre, a jih je v vsakem kubičnem centimetru dvakrat več, zato vsak kos stene zadenejo dvakrat pogosteje. Tlak se podvoji na $200\,\mathrm{kPa}$.

:::risba skica
opis: Dva valja z batom, plin je osenčen. V levem je bat izvlečen skoraj do konca valja: 8 molekul je razporejenih po prostornini 2 L, tlak je 100 kPa. V desnem je bat potisnjen do polovice valja: istih 8 molekul je v prostornini 1 L, torej dvakrat bolj na gosto, tlak je 200 kPa. Del valja za batom je v obeh prazen.
območje: 0; -1,6 .. 10,6; 2,9
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
črta: 7,8; 0 -> 9,8; 0
črta: 7,8; 2 -> 9,8; 2
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

Graf kaže to zvezo za $1\,\mathrm{mol}$ zraka pri $300\,\mathrm{K}$. Pri $V = 25\,\mathrm{L}$ je tlak $99{,}72\,\mathrm{kPa}$. Osenčeni pravokotnik pod točko ima ploščino $pV = 2493\,\mathrm{kPa\,L}$. V aplikaciji premakni drsnik za prostornino na $10\,\mathrm{L}$: pravokotnik je ožji in višji ($249{,}3\,\mathrm{kPa}$), njegova ploščina pa ostane $2493$. Nato premakni drsnik za temperaturo na $600\,\mathrm{K}$ in opazuj, da se cela krivulja dvigne, ploščina pa podvoji. Zakaj, pove 5. točka.

:::risba graf
opis: Graf tlaka p v kilopaskalih v odvisnosti od prostornine V v litrih za 1 mol plina pri stalni temperaturi. Krivulja pada: večja prostornina, manjši tlak. V aplikaciji se z drsnikoma spreminjata prostornina in temperatura. Izbrano je V = {V} L in T = {T} K: tlak je {8,31*T/V} kPa, pravokotnik med izhodiščem in točko na krivulji ima ploščino {8,31*T} kPa·L.
x: 0 .. 60 | 10 | V (L)
y: 0 .. 600 | 100 | p (kPa)
drsnik: V | 10 .. 50 | 5 | 25 | prostornina V v litrih
drsnik: T | 200 .. 600 | 50 | 300 | temperatura T v kelvinih
pravokotnik: 0; 0 .. V; 8,31*T/V | oranžna
f: 8,31*T/x | modra | 5 .. 52
točka: V; 8,31*T/V
podnapis: V = {V} L, T = {T} K: p = {8,31*T/V} kPa, pV = {8,31*T} kPa·L
:::

*Preveri:* plin pri stalni temperaturi stisneš na tretjino prostornine. Kaj se zgodi s tlakom? Odgovor: postane trikrat večji.

**3. Stalni tlak.** Balon na soncu se napihne, v mrazu se skrči. Hitrejše molekule udarjajo močneje in opno potiskajo navzven, dokler niso trki toliko redkejši, da je tlak spet enak zunanjemu. Spreminjata se torej temperatura in prostornina. Za $1\,\mathrm{mol}$ idealnega plina pri $100\,\mathrm{kPa}$ izračunamo (z enačbo iz 5. točke; meritve na zraku dajo skoraj enako):

| $t$ [$^\circ\mathrm{C}$] | $T$ [K] | $V$ [L] | $V/T$ [L/K] |
|---|---|---|---|
| $-100$ | $173$ | $14{,}4$ | $0{,}083$ |
| $0$ | $273$ | $22{,}7$ | $0{,}083$ |
| $100$ | $373$ | $31{,}0$ | $0{,}083$ |

Zadnji stolpec je stalen: prostornina je premo sorazmerna z absolutno temperaturo. Pri nas je to **Gay-Lussacov zakon**, drugod mu rečejo Charlesov. Sorazmernost velja le v kelvinih, ne v stopinjah Celzija. Če bi zvezo podaljšal k nižjim temperaturam, bi prostornina dosegla nič pri $0\,\mathrm{K}$, to je pri $-273\,^\circ\mathrm{C}$. Tej temperaturi pravimo **absolutna ničla**.

$$\frac{V_1}{T_1} = \frac{V_2}{T_2}$$

Na grafu so tri točke iz tabele. Polna črta jih povezuje, črtkana je podaljšek proti mrazu. Pod sliko piše, da je pri $0\,^\circ\mathrm{C}$ prostornina $22{,}69\,\mathrm{L}$ (v tabeli zaokroženo na $22{,}7$). V aplikaciji z drsnikom spremeni tlak: pri $50\,\mathrm{kPa}$ je premica strmejša, pri $200\,\mathrm{kPa}$ položnejša. Naklon premice je za $1\,\mathrm{mol}$ enak $R/p$, zato je pri polovičnem tlaku dvakrat večji. Opazuj, kje premica zadene vodoravno os: vedno pri $-273\,^\circ\mathrm{C}$.

:::risba graf
opis: Graf prostornine V v litrih v odvisnosti od temperature t v stopinjah Celzija za 1 mol plina pri stalnem tlaku. Premica narašča; polna je med −100 in 100 °C, kjer so tri točke iz tabele, črtkan podaljšek seka vodoravno os pri −273 °C. V aplikaciji se z drsnikom spreminja tlak. Izbrano je p = {p} kPa: pri 0 °C je prostornina {8,31*273/p} L. Pri vsakem tlaku premica zadene os v isti točki, −273 °C.
x: -300 .. 200 | 100 | t (°C)
y: 0 .. 70 | 10 | V (L)
drsnik: p | 50 .. 200 | 25 | 100 | tlak p v kilopaskalih
f: 8,31*(x + 273)/p | modra črtkano | -273 .. -100
f: 8,31*(x + 273)/p | modra | -100 .. 100
točka: -100; 8,31*173/p
točka: 0; 8,31*273/p
točka: 100; 8,31*373/p
točka: -273; 0 | | | oranžna
puščica: -225; 37 -> -268; 4 | | | oranžna
napis: -215; 43 | −273 °C | | oranžna
podnapis: p = {p} kPa: pri 0 °C je V = {8,31*273/p:.2} L
:::

*Preveri:* pri stalnem tlaku segreješ plin s $300\,\mathrm{K}$ na $450\,\mathrm{K}$. Kolikšna je nova prostornina? Odgovor: $1{,}5$-krat večja.

:::premisli
Sošolec reče: »Plin segrejem z $10\,^\circ\mathrm{C}$ na $20\,^\circ\mathrm{C}$, temperatura se podvoji, torej se podvoji tudi prostornina.« Napovej, za koliko se prostornina res poveča, in pojasni, zakaj se moti.
---
Le za približno $3{,}5\,\%$: absolutna temperatura zraste z $283\,\mathrm{K}$ na $293\,\mathrm{K}$. Celzijeva lestvica ima ničlo pri zmrzišču vode, ne tam, kjer bi plin imel prostornino nič, zato razmerje stopinj nima fizikalnega pomena.
:::

**4. Stalna prostornina.** V zaprti jeklenki ali gumi se prostornina skoraj ne spremeni. Ko plin segrejemo, so molekule hitrejše, ob stene udarjajo močneje in pogosteje. Tlak raste premo sorazmerno z absolutno temperaturo. To je **Amontonsov zakon**:

$$\frac{p_1}{T_1} = \frac{p_2}{T_2}$$

*Preveri:* plin v zaprti jeklenki segreješ z $280\,\mathrm{K}$ na $350\,\mathrm{K}$. Kaj se zgodi s tlakom? Odgovor: postane $1{,}25$-krat večji.

Tri posebne spremembe v pregledu:

| sprememba | kaj je stalno | zakon |
|---|---|---|
| izotermna | $T$ | $pV$ stalen (Boyle-Mariottov) |
| izobarna | $p$ | $V/T$ stalen (Gay-Lussacov) |
| izohorna | $V$ | $p/T$ stalen (Amontonsov) |

**5. Vse naenkrat.** Pri plastenki s Kredarice se spremenita tlak in temperatura hkrati, saj je na vrhu hladneje kot v mestu. Tako spremembo razdelimo na dva koraka, ki ju že poznamo. Najprej pri stalni temperaturi $T_1$ spremenimo tlak s $p_1$ na $p_2$. Po Boyle-Mariottovem zakonu dobi plin vmesno prostornino $V'$:

$$V' = \frac{p_1 V_1}{p_2}$$

Nato ga pri stalnem tlaku $p_2$ segrejemo s $T_1$ na $T_2$. Po Gay-Lussacovem zakonu velja:

$$\frac{V'}{T_1} = \frac{V_2}{T_2}$$

Vstavimo $V'$ in tlak $p_2$ prenesemo na desno. Za dano količino plina je torej $\dfrac{pV}{T}$ stalen:

$$\frac{p_1 V_1}{T_1} = \frac{p_2 V_2}{T_2}$$

Koliko je ta stalnica? Tega ne moremo izpeljati, treba jo je izmeriti. Meritve pokažejo, da je za en mol katerega koli plina $\dfrac{pV}{T} = 8{,}31\,\mathrm{J/K}$. To je **splošna plinska konstanta** $R = 8{,}31\,\mathrm{J/(mol\,K)}$. Z njo sta narisana oba grafa, zato jo lahko iz njiju prebereš nazaj: $\dfrac{100\,000\,\mathrm{Pa} \cdot 0{,}02269\,\mathrm{m^3}}{273\,\mathrm{K}} \approx 8{,}31\,\mathrm{J/K}$.

Kaj pa dva mola? Združi dve enaki posodi z enim molom pri istem tlaku in temperaturi: $p$ in $T$ ostaneta, prostornina se podvoji. Stalnica je torej sorazmerna z množino snovi $n$. Tako dobimo **plinsko enačbo**:

$$pV = nRT$$

Zato se je ploščina pravokotnika na prvem grafu pri $600\,\mathrm{K}$ podvojila: $pV$ raste premo sorazmerno s $T$.

Količino plina izračunamo iz mase: $n = \dfrac{m}{M}$, kjer je $M$ molska masa (za helij $4\,\mathrm{g/mol}$, za zrak okoli $29\,\mathrm{g/mol}$).

*Preveri:* kolikšno prostornino ima $1\,\mathrm{mol}$ plina pri $273\,\mathrm{K}$ in $101{,}3\,\mathrm{kPa}$? Odgovor: $V = \dfrac{8{,}31 \cdot 273}{101\,300}\,\mathrm{m^3} \approx 0{,}0224\,\mathrm{m^3}$, to je $22{,}4\,\mathrm{L}$.

:::premisli
En mol helija ima maso $4\,\mathrm{g}$, en mol kisika $32\,\mathrm{g}$. Kateri od njiju ima pri enakem tlaku in temperaturi večjo prostornino?
---
Prostornini sta enaki. V enačbi $pV = nRT$ ni molske mase: šteje le število molekul, ne njihova masa. Lažje molekule helija ob steno udarijo šibkeje, a so hitrejše in zato trkajo pogosteje. Oboje se ravno izravna, zato je tlak enak kot pri težjih molekulah kisika.
:::

**6. Idealni plin.** Enačba $pV = nRT$ natančno velja za **idealni plin**: model, v katerem so molekule drobne točke, ki se med seboj ne privlačijo in le trkajo. Zrak, helij in drugi plini se pri običajnih tlakih in temperaturah obnašajo skoraj idealno. Odstopanja so velika pri zelo visokih tlakih in pri gostih plinih tik pred utekočinjenjem, na primer pri ogljikovem dioksidu v gasilnem aparatu (okoli $60\,\mathrm{bar}$).

V simulaciji spodaj (»Plin v posodi: tlak, prostornina, temperatura«) nastavi temperaturo na $300\,\mathrm{K}$ in prostornino na $20\,\mathrm{dm^3}$ (to je $20\,\mathrm{L}$), nato prostornino zmanjšaj na $10\,\mathrm{dm^3}$. Opazuj, da se tlak podvoji, molekule pa so enako hitre kot prej.

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
5. Odgovor: zrak v gumi se je segrel na približno $37\,^\circ\mathrm{C}$. Zato tlak v gumah meri pred vožnjo, ko so hladne.

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
2. Iz plinske enačbe izrazimo $n = \dfrac{p_1 V_1}{R T_1}$. Vstavimo osnovne enote, tlak v paskalih: $n = \dfrac{100\,000 \cdot 2}{8{,}31 \cdot 288}\,\mathrm{mol} \approx 83{,}6\,\mathrm{mol}$.
3. Masa: $m = 83{,}6\,\mathrm{mol} \cdot 0{,}004\,\mathrm{kg/mol} \approx 0{,}33\,\mathrm{kg}$ (molsko maso $4\,\mathrm{g/mol}$ pišemo kot $0{,}004\,\mathrm{kg/mol}$, da dobimo maso v kg).
4. Na višini se spremenita tlak in temperatura, zato vzamemo združeni zakon in izrazimo $V_2 = V_1 \dfrac{p_1}{p_2} \dfrac{T_2}{T_1}$. Vstavimo: $V_2 = 2\,\mathrm{m^3} \cdot \dfrac{100}{26} \cdot \dfrac{223}{288} \approx 5{,}96\,\mathrm{m^3}$.
5. Preverimo smiselnost: tlak pade skoraj na četrtino (balon se napihne), mraz ga nekoliko skrči, zato je rezultat manjši od štirikratne prostornine.
6. Odgovor: v balonu je približno $84\,\mathrm{mol}$ oziroma $0{,}33\,\mathrm{kg}$ helija; na višini $10\,\mathrm{km}$ ima prostornino približno $6\,\mathrm{m^3}$. Še višje se napihne toliko, da poči.

Slika kaže oba balona kot krogli v istem merilu. Prostornina se potroji, premer pa zraste le z $1{,}56\,\mathrm{m}$ na $2{,}25\,\mathrm{m}$, ker prostornina raste s tretjo potenco premera.

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

Račun privzame, da je tlak v plastenki enak zunanjemu. Trda plastenka zdrži del razlike tlakov, zato je v resnici zmečkana še nekoliko manj.

## Pogoste napake

- **Temperatura v stopinjah Celzija.** Dijak vstavi $t = 20$ namesto $T = 293\,\mathrm{K}$, ker je tako napisano v nalogi. Plinski zakoni pa veljajo za absolutno temperaturo; pri $0\,^\circ\mathrm{C}$ bi s Celzijem delil z nič. Vsako temperaturo najprej pretvori v kelvine.
- **Litri in kilopaskali v $pV = nRT$.** Ker je $R = 8{,}31\,\mathrm{J/(mol\,K)}$, morajo biti tlak v Pa in prostornina v $\mathrm{m^3}$. Kdor vstavi samo kPa ali samo litre, dobi $1000$-krat napačen rezultat. Par kPa in L skupaj se izide, ker je $1\,\mathrm{kPa \cdot L} = 1\,\mathrm{J}$; tako sta narisana grafa zgoraj. Varneje je vedno pretvoriti v Pa in $\mathrm{m^3}$. V razmerjih ($p_1 V_1 = p_2 V_2$) enote smeš obdržati, ker se pokrajšajo.
- **»Večji tlak, večja prostornina.«** Ker pri segrevanju rasteta obe, dijak misli, da tlak in prostornina vedno rasteta skupaj. Pri stalni temperaturi sta obratno sorazmerna: če tlak pade na polovico, se prostornina podvoji.
- **Nadtlak namesto tlaka.** Merilnik na črpalki pokaže, za koliko je tlak v gumi večji od zunanjega. Kazalec pri $2\,\mathrm{bar}$ pomeni pravi tlak okoli $3\,\mathrm{bar}$. V plinske zakone vstavi pravi tlak, sicer razmerja niso pravilna: v Primeru 2 bi z nadtlakoma dobil $49\,^\circ\mathrm{C}$ namesto $37\,^\circ\mathrm{C}$.

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
- **Premična stena.** Če se stena lahko odmika, jo hitrejše žogice potisnejo nazaj, dokler redkejši, a močnejši udarci na steno ne pritiskajo spet enako kot prej. Tako se balon na soncu napihne pri enakem tlaku.

Analogija ima mejo: prave žogice se sčasoma ustavijo, molekule pa ne. Pri trkih ne izgubljajo energije, zato tlak v zaprti posodi ne pojenja.

## Drugače: Bolj natančno

Plinsko enačbo lahko zapišemo s številom molekul $N$: $pV = N k_B T$, kjer je $k_B = 1{,}38 \cdot 10^{-23}\,\mathrm{J/K}$ Boltzmannova konstanta. Ker je v molu $N_A = 6{,}02 \cdot 10^{23}$ molekul, velja $R = N_A k_B$.

Idealni plin predpostavlja dvoje: molekule nimajo lastne prostornine in se med trki ne privlačijo. Pri visokem tlaku so molekule tako blizu, da njihova lastna prostornina ni več zanemarljiva. Pri nizki temperaturi, blizu utekočinjenja, privlačne sile zmanjšajo tlak na stene. Ko se plin utekočini, enačba zanj ne velja več. Ko se vodna para v oblaku kondenzira v kapljice, se zmanjša množina pare $n$; para, ki ostane, še vedno dobro sledi $pV = nRT$.

Absolutne ničle pri resničnih plinih ne opazimo kot »prostornino nič«, ker se prej utekočinijo; premica iz meritev pa za vse pline kaže na isto točko, $-273{,}15\,^\circ\mathrm{C}$.

## Preveri se

? Štiri meritve tlaka in prostornine naj bi pripadale isti količini plina pri isti temperaturi. Katera ne spada zraven?
- $1\,\mathrm{L}$ pri $400\,\mathrm{kPa}$
~ Največji tlak ne pomeni, da meritev izstopa. Produkt je $400\,\mathrm{kPa\,L}$, enako kot pri dveh drugih.
- $2\,\mathrm{L}$ pri $200\,\mathrm{kPa}$
~ Prostornina je dvakrat večja kot pri prvi meritvi, tlak pa za polovico manjši. Tako mora biti, produkt je spet $400\,\mathrm{kPa\,L}$.
+ $4\,\mathrm{L}$ pri $150\,\mathrm{kPa}$
- $8\,\mathrm{L}$ pri $50\,\mathrm{kPa}$
~ Majhen tlak pri veliki prostornini je pričakovan: $8 \cdot 50 = 400\,\mathrm{kPa\,L}$.
> Pri stalni temperaturi je $pV$ stalen. Tri meritve dajo $400\,\mathrm{kPa\,L}$, meritev $4\,\mathrm{L}$ pri $150\,\mathrm{kPa}$ pa $600\,\mathrm{kPa\,L}$. Ni dovolj, da tlak pada, ko prostornina raste.

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
+ približno $0{,}68\,\mathrm{bar}$
- približno $0{,}75\,\mathrm{bar}$
~ V zakon je vstavljen nadtlak: $0{,}80 \cdot \tfrac{275}{295}$. S temperaturo je sorazmeren pravi tlak, $1{,}80\,\mathrm{bar}$.
- približno $1{,}68\,\mathrm{bar}$
~ To je pravi tlak v žogi. Merilnik pokaže le razliko do zunanjega tlaka, zato odštej $1{,}00\,\mathrm{bar}$.
- približno $0{,}07\,\mathrm{bar}$
~ Tu sta dve napaki: vstavljena sta nadtlak in temperaturi v stopinjah ($0{,}80 \cdot \tfrac{2}{22}$). V zakon sodita pravi tlak $1{,}80\,\mathrm{bar}$ in razmerje v kelvinih, $\tfrac{275}{295}$.
> Pravi tlak: $p_1 = 1{,}80\,\mathrm{bar}$. Pri stalni prostornini je $p_2 = 1{,}80\,\mathrm{bar} \cdot \dfrac{275}{295} \approx 1{,}68\,\mathrm{bar}$, merilnik pa pokaže $0{,}68\,\mathrm{bar}$.

:::simboli
p | tlak | p = \frac{nRT}{V} | Pa
V | prostornina | V = \frac{nRT}{p} | m^3
T | absolutna temperatura | T = \frac{pV}{nR} | K
n | množina snovi (količina plina) | n = \frac{m}{M} | mol
R | splošna plinska konstanta | R = \frac{pV}{nT} | J/(mol\,K) | $8{,}31\,\mathrm{J/(mol\,K)}$
m | masa plina | m = nM | kg
M | molska masa | | kg/mol | helij $0{,}004\,\mathrm{kg/mol}$
p_1, p_2 | tlak v začetnem in končnem stanju | | Pa
V_1, V_2 | prostornina v začetnem in končnem stanju | | m^3
t | temperatura v stopinjah Celzija | t = T - 273 | ^\circ\mathrm{C}
t_1, t_2 | temperatura v začetnem in končnem stanju v stopinjah Celzija | | ^\circ\mathrm{C}
N | število molekul | N = n N_A | –
k_B | Boltzmannova konstanta | | J/K | $1{,}38 \cdot 10^{-23}\,\mathrm{J/K}$
N_A | Avogadrova konstanta | | 1/mol | $6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$
V' | vmesna prostornina po prvem koraku | V' = \frac{p_1 V_1}{p_2} | m^3
T_1, T_2 | absolutna temperatura v začetnem in končnem stanju | | K
:::
