---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nogometno žogo napolniš v topli garderobi in je trda. Pol ure kasneje, na igrišču pri $2\,^\circ\mathrm{C}$, je opazno mehkejša, čeprav iz nje ni ušel niti malo zraka.

Po tekmi pustiš balon navijačev v avtu na soncu. Ko se vrneš, je napet do poka, čeprav vanj nihče ni pihal.

Na videz gre za dva različna pojava: žoga se »izprazni«, balon se »napihne«. V resnici je za obema ista ideja. Plin v posodi nima svoje stalne prostornine ali tlaka. Odvisna sta od tega, **koliko delcev** je v njej in **kako hitro se gibljejo**, torej od temperature. Ko to znaš zapisati z eno enačbo, lahko izračunaš, koliko zraka je v žogi, koliko plina nastane pri reakciji ali koliko časa zdrži potapljaška jeklenka.

## Razlaga

**Rešimo najprej en primer.** V laboratoriju pri $0\,^\circ\mathrm{C}$ in tlaku $101{,}3\,\mathrm{kPa}$ napolnimo štiri enake balone. V vsakega damo po en mol drugačnega plina in izmerimo prostornino:

| plin | masa 1 mol | $V$ [L] |
|---|---|---|
| $\mathrm{H_2}$ | $2{,}0\,\mathrm{g}$ | $22{,}4$ |
| $\mathrm{He}$ | $4{,}0\,\mathrm{g}$ | $22{,}4$ |
| $\mathrm{O_2}$ | $32{,}0\,\mathrm{g}$ | $22{,}4$ |
| $\mathrm{CO_2}$ | $44{,}0\,\mathrm{g}$ | $22{,}4$ |

Mase so zelo različne: mol ogljikovega dioksida je $22$-krat težji od mola vodika. Prostornina pa je pri vseh enaka. Pri plinu torej ni pomembno, **katera** snov je, ampak **koliko** delcev je.

:::premisli
Molekula $\mathrm{CO_2}$ je precej večja od molekule $\mathrm{H_2}$. Zakaj potem en mol obeh zavzame enako prostornino?
---
V plinu so delci zelo daleč narazen, medmolekulske sile so zanemarljive. Skoraj vsa prostornina je prazen prostor med delci, njihova lastna velikost pri tem skoraj ne šteje.
:::

**Prvi korak posplošitve: molska prostornina.** Prostornino enega mola plina imenujemo **molska prostornina** $V_m$. Dobimo jo, ko prostornino plina delimo z množino:

$$V_m = \frac{V}{n}$$

Enota je $\mathrm{L/mol}$ (liter je isto kot $\mathrm{dm^3}$). Pri **normalnih pogojih**, to je pri $0\,^\circ\mathrm{C}$ in $101{,}3\,\mathrm{kPa}$, je za vsak plin $V_m = 22{,}4\,\mathrm{L/mol}$. Iz tega sledi, da dva mola zavzameta $44{,}8\,\mathrm{L}$, pol mola pa $11{,}2\,\mathrm{L}$.

**Drugi korak: pogoji niso vedno normalni.** V športni dvorani je okoli $25\,^\circ\mathrm{C}$. Tam en mol plina zavzame več, približno $24{,}5\,\mathrm{L}$. Molska prostornina je enaka za vse pline, a le pri **istih** pogojih. Ko se spremeni temperatura ali tlak, se spremeni tudi $V_m$. Prav to se je zgodilo z žogo in balonom.

**Tretji korak: ena enačba za vse pogoje.** Tlak $p$, prostornino $V$, množino $n$ in temperaturo $T$ plina poveže **splošna plinska enačba**:

$$pV = nRT$$

Pri tem je $R$ **splošna plinska konstanta**. Če tlak pišeš v $\mathrm{kPa}$ in prostornino v $\mathrm{L}$, je

$$R = 8{,}314\,\mathrm{\frac{kPa \cdot L}{mol \cdot K}}$$

Temperatura mora biti v **kelvinih**. Iz stopinj Celzija $t$ jo dobiš tako, da prišteješ $273$:

$$T = t + 273$$

Pri $0\,^\circ\mathrm{C}$ je torej $T = 273\,\mathrm{K}$, pri $25\,^\circ\mathrm{C}$ pa $T = 298\,\mathrm{K}$.

Preveri, da enačba res da molsko prostornino. Pri $n = 1\,\mathrm{mol}$, $T = 273\,\mathrm{K}$ in $p = 101{,}3\,\mathrm{kPa}$ dobiš $V = \frac{8{,}314 \cdot 273}{101{,}3}\,\mathrm{L} \approx 22{,}4\,\mathrm{L}$.

Enačba vsebuje tudi oba pojava iz uvoda. Če se $T$ zniža in $V$ ostane enaka (žoga), se zniža tlak. Če se $T$ zviša in tlak ostane skoraj enak (raztegljiv balon), se poveča prostornina.

V simulaciji spodaj, »Plin v posodi: tlak, prostornina, temperatura«, pusti množino pri miru in temperaturo podvoji, na primer s $300\,\mathrm{K}$ na $600\,\mathrm{K}$. Opazuj, kako se spremeni tlak in kako hitro se gibljejo delci.

:::premisli
Žogo s tlakom $180\,\mathrm{kPa}$ napolniš pri $22\,^\circ\mathrm{C}$ in jo neseš na igrišče s $2\,^\circ\mathrm{C}$. Ali tlak pade na desetino ($2$ namesto $22$)? Napovej in utemelji.
---
Ne. Računati moraš s kelvini: $T$ pade z $295\,\mathrm{K}$ na $275\,\mathrm{K}$, to je na približno $93\,\%$. Tlak pade le na okoli $168\,\mathrm{kPa}$. Žoga je mehkejša, a še zdaleč ni prazna.
:::

## Rešeni primeri

### Primer 1: balon navijačev

Navijači napolnijo balon s helijem. Pri normalnih pogojih ima balon prostornino $11{,}2\,\mathrm{L}$. Koliko helija je v njem (množina in masa)?

**Podatki:** $V = 11{,}2\,\mathrm{L}$, normalni pogoji: $V_m = 22{,}4\,\mathrm{L/mol}$, $M(\mathrm{He}) = 4{,}0\,\mathrm{g/mol}$
**Iščemo:** množino $n$ in maso $m$ helija

:::formula
$n = \dfrac{V}{V_m}$, nato $m = n \cdot M$
:::

**Rešitev:**

1. Pogoji so normalni, zato smemo uporabiti $22{,}4\,\mathrm{L/mol}$: $n = \dfrac{11{,}2\,\mathrm{L}}{22{,}4\,\mathrm{L/mol}} = 0{,}5\,\mathrm{mol}$.
2. Maso dobimo iz molske mase: $m = 0{,}5\,\mathrm{mol} \cdot 4{,}0\,\mathrm{g/mol} = 2{,}0\,\mathrm{g}$.
3. Odgovor: v balonu je $0{,}5\,\mathrm{mol}$ helija, kar so samo $2\,\mathrm{g}$.

### Primer 2: zrak v nogometni žogi

Nogometna žoga ima prostornino $5{,}5\,\mathrm{L}$. Tlak zraka v njej je $180\,\mathrm{kPa}$, temperatura $20\,^\circ\mathrm{C}$. Koliko molov zraka je v žogi in kolikšna je masa tega zraka? Povprečna molska masa zraka je $29\,\mathrm{g/mol}$.

**Podatki:** $V = 5{,}5\,\mathrm{L}$, $p = 180\,\mathrm{kPa}$, $t = 20\,^\circ\mathrm{C}$, $M = 29\,\mathrm{g/mol}$, $R = 8{,}314\,\mathrm{kPa \cdot L/(mol \cdot K)}$
**Iščemo:** množino $n$ in maso $m$ zraka

:::formula
$n = \dfrac{pV}{RT}$, nato $m = n \cdot M$
:::

**Rešitev:**

1. Temperatura v kelvinih: $T = 20 + 273 = 293\,\mathrm{K}$.
2. Pogoji niso normalni, zato $22{,}4\,\mathrm{L/mol}$ ne velja. Iz $pV = nRT$ izrazimo $n$ in vstavimo (kPa in L se ujemata z enoto $R$):
   $$n = \frac{180 \cdot 5{,}5}{8{,}314 \cdot 293} \approx 0{,}406\,\mathrm{mol}$$
3. Masa: $m = 0{,}406\,\mathrm{mol} \cdot 29\,\mathrm{g/mol} \approx 11{,}8\,\mathrm{g}$.
4. Odgovor: v žogi je približno $0{,}41\,\mathrm{mol}$ zraka z maso okoli $12\,\mathrm{g}$. Zrak torej ni brez mase: v žogi ga je za dobrih deset gramov.

### Primer 3: plinski gorilnik v planinah

Planinci si skuhajo čaj na gorilniku z butanom $\mathrm{C_4H_{10}}$. Zgori $58\,\mathrm{g}$ butana:

$$\mathrm{2\,C_4H_{10} + 13\,O_2 \rightarrow 8\,CO_2 + 10\,H_2O}$$

Koliko litrov ogljikovega dioksida nastane pri $25\,^\circ\mathrm{C}$ in $101{,}3\,\mathrm{kPa}$?

**Podatki:** $m(\mathrm{C_4H_{10}}) = 58\,\mathrm{g}$, $M(\mathrm{C_4H_{10}}) = 58\,\mathrm{g/mol}$, $t = 25\,^\circ\mathrm{C}$, $p = 101{,}3\,\mathrm{kPa}$, urejena enačba zgoraj
**Iščemo:** prostornino $V(\mathrm{CO_2})$

:::formula
$n = \dfrac{m}{M}$, razmerje koeficientov $2 : 8$, nato $V = \dfrac{nRT}{p}$
:::

**Rešitev:**

1. Množina butana: $n(\mathrm{C_4H_{10}}) = \dfrac{58\,\mathrm{g}}{58\,\mathrm{g/mol}} = 1\,\mathrm{mol}$.
2. Koeficienta $2$ in $8$ povesta, da nastane štirikrat več $\mathrm{CO_2}$ kot zgori butana: $n(\mathrm{CO_2}) = 4 \cdot 1\,\mathrm{mol} = 4\,\mathrm{mol}$.
3. Temperatura: $T = 25 + 273 = 298\,\mathrm{K}$.
4. Prostornina iz plinske enačbe:
   $$V = \frac{4 \cdot 8{,}314 \cdot 298}{101{,}3} \approx 97{,}8\,\mathrm{L}$$
5. Odgovor: nastane približno $98\,\mathrm{L}$ ogljikovega dioksida, kar bi napolnilo skoraj deset veder.

Preverba: pri $25\,^\circ\mathrm{C}$ je $V_m \approx 24{,}5\,\mathrm{L/mol}$, in $4 \cdot 24{,}5 = 98$.

### Primer 4: zdaj ti

Potapljaška jeklenka ima prostornino $12\,\mathrm{L}$. Napolnjena je z zrakom pod tlakom $20\,000\,\mathrm{kPa}$ pri $15\,^\circ\mathrm{C}$. Koliko molov zraka je v njej?

**Podatki:** $V = 12\,\mathrm{L}$, $p = 20\,000\,\mathrm{kPa}$, $t = 15\,^\circ\mathrm{C}$, $R = 8{,}314\,\mathrm{kPa \cdot L/(mol \cdot K)}$
**Iščemo:** množino $n$

:::formula
$n = \dfrac{pV}{RT}$
:::

**Rešitev:**

1. Tlak je v kPa, prostornina v L, pretvarjati ni treba.
2. Temperaturo pretvori v kelvine in vstavi v formulo. Izračunaj sam, nato preveri:

:::premisli
Koliko je $n$?
---
$T = 15 + 273 = 288\,\mathrm{K}$, $n = \dfrac{20\,000 \cdot 12}{8{,}314 \cdot 288} \approx 100\,\mathrm{mol}$. To je toliko zraka, kot bi ga bilo v približno $2400\,\mathrm{L}$ pri navadnem tlaku.
:::

## Pogoste napake

- **Stopinje Celzija v plinski enačbi.** Kdor vstavi $t = 20$ namesto $T = 293\,\mathrm{K}$, dobi skoraj $15$-krat preveliko množino. Pri $0\,^\circ\mathrm{C}$ bi delil celo z nič. Enačba velja samo za kelvine, ker se ti štejejo od $0\,\mathrm{K}$, kjer je gibanje delcev najmanjše; $0\,^\circ\mathrm{C}$ je le tališče ledu. Vedno najprej $T = t + 273$.
- **$22{,}4\,\mathrm{L/mol}$ za vse pogoje.** Ta vrednost velja le pri $0\,^\circ\mathrm{C}$ in $101{,}3\,\mathrm{kPa}$. V sobi je $V_m \approx 24{,}5\,\mathrm{L/mol}$, v jeklenki pod visokim tlakom je mnogo manjša. Če pogoji niso normalni, računaj s $pV = nRT$.
- **Molska prostornina tudi za tekočine.** En mol vode ni $22{,}4\,\mathrm{L}$, ampak le okoli $18\,\mathrm{mL}$. V tekočini in trdni snovi se delci dotikajo, zato je prostornina odvisna od velikosti in vrste delcev. $V_m$ je enaka za vse snovi le pri plinih.
- **Težji plin, večja prostornina.** Mol $\mathrm{CO_2}$ ni večji od mola $\mathrm{H_2}$. Pri istih pogojih ima enako število delcev enako prostornino, ne glede na maso.
- **Neujemanje enot.** Kdor vstavi tlak v Pa, prostornino pa v L, z $R = 8{,}314$ dobi $1000$-krat preveliko množino. Tlak v kPa in prostornino v L uporabljaj skupaj.

## Povzetek

- Pri istem tlaku in temperaturi ima en mol katerega koli plina enako prostornino, ker so delci daleč narazen.
- Molska prostornina: $V_m = \dfrac{V}{n}$, enota $\mathrm{L/mol}$. Pri normalnih pogojih ($0\,^\circ\mathrm{C}$; $101{,}3\,\mathrm{kPa}$) je $22{,}4\,\mathrm{L/mol}$, pri $25\,^\circ\mathrm{C}$ približno $24{,}5\,\mathrm{L/mol}$.
- Splošna plinska enačba: $pV = nRT$, $R = 8{,}314\,\mathrm{kPa \cdot L/(mol \cdot K)}$ (tlak v kPa, prostornina v L).
- Temperatura vedno v kelvinih: $T = t + 273$.
- Pri stalni prostornini nižja temperatura pomeni nižji tlak; pri stalnem tlaku višja temperatura pomeni večjo prostornino.

## Drugače: Z analogijo

Predstavljaj si telovadnico, v kateri otroci tekajo v vse smeri in se zaletavajo v stene.

- **Število otrok** je množina $n$. Več otrok pomeni več udarcev v stene.
- **Udarci v stene** so tlak $p$. Stena čuti, kolikokrat in kako močno jo zadenejo.
- **Hitrost teka** je temperatura $T$. Utrujeni otroci (mraz) tečejo počasneje in redkeje zadenejo steno.
- **Velikost telovadnice** je prostornina $V$. V večji dvorani pot do stene traja dlje, udarcev je manj.

Ali so otroci veliki ali majhni, skoraj ne šteje, ker je med njimi veliko prostora. Zato je mol helija enako »prostoren« kot mol ogljikovega dioksida.

Na mrzlem igrišču otroci (molekule v žogi) upočasnijo, stene zadevajo redkeje in šibkeje, žoga je mehkejša. V vročem avtu se v balonu pospešijo, tiščijo v steno močneje, in ker je ta raztegljiva, se balon poveča.

## Drugače: Bolj natančno

Enačba $pV = nRT$ velja za **idealni plin**: delci nimajo lastne prostornine in med njimi ni privlačnih sil. Pravi plini se temu dobro približajo pri navadnih pogojih. Pri zelo visokem tlaku (v jeklenki) ali tik nad vreliščem pa ne: delci so blizu, medmolekulske sile in lastna prostornina delcev postanejo opazni.

Natančna povezava je $T = t + 273{,}15$. Za šolske račune zadostuje $273$.

V osnovnih enotah SI je $R = 8{,}314\,\mathrm{J/(mol \cdot K)}$, tlak je takrat v Pa, prostornina v $\mathrm{m^3}$. Ker je $1\,\mathrm{kPa \cdot L} = 1\,\mathrm{J}$, je to ista številka kot pri kPa in L.

Pozor na dogovore. Starejši »normalni pogoji« so $0\,^\circ\mathrm{C}$ in $101{,}3\,\mathrm{kPa}$ ($V_m = 22{,}4\,\mathrm{L/mol}$). Mednarodna zveza za kemijo (IUPAC) za **standardne pogoje** danes uporablja $0\,^\circ\mathrm{C}$ in $100\,\mathrm{kPa}$, kar da $V_m \approx 22{,}7\,\mathrm{L/mol}$. V nalogi vedno preveri, kateri pogoji so podani.

## Preveri se

? Trener reče: »V naši dvorani je molska prostornina zraka $24{,}5\,\mathrm{L/mol}$.« Kaj to pomeni?
- En liter zraka v dvorani ima maso $24{,}5\,\mathrm{g}$.
~ Masa enega mola je molska masa (v g/mol). Molska prostornina govori o litrih, ne o gramih.
+ En mol zraka pri pogojih v dvorani zavzame $24{,}5\,\mathrm{L}$.
- En mol zraka zavzame $24{,}5\,\mathrm{L}$ pri vsaki temperaturi in tlaku.
~ Molska prostornina je odvisna od pogojev. Na mrazu ali pod večjim tlakom bi bila manjša.
> $V_m = \dfrac{V}{n}$ je prostornina enega mola plina pri danih pogojih. Pri $25\,^\circ\mathrm{C}$ je približno $24{,}5\,\mathrm{L/mol}$.

? Razvrsti plinske vzorce po prostornini od najmanjše do največje (vsi pri istih pogojih): $2\,\mathrm{g}$ $\mathrm{H_2}$, $16\,\mathrm{g}$ $\mathrm{O_2}$, $44\,\mathrm{g}$ $\mathrm{CO_2}$, $8\,\mathrm{g}$ $\mathrm{He}$.
- $\mathrm{H_2} < \mathrm{He} < \mathrm{O_2} < \mathrm{CO_2}$
~ To je razvrstitev po masi. Prostornina plina je odvisna od množine, ne od mase.
- $\mathrm{He} < \mathrm{H_2} < \mathrm{O_2} < \mathrm{CO_2}$
~ To je razvrstitev po velikosti delcev. Pri plinu velikost delcev skoraj ne vpliva na prostornino.
+ $\mathrm{O_2} < \mathrm{H_2} = \mathrm{CO_2} < \mathrm{He}$
> Množine so $0{,}5\,\mathrm{mol}$ $\mathrm{O_2}$, $1\,\mathrm{mol}$ $\mathrm{H_2}$, $1\,\mathrm{mol}$ $\mathrm{CO_2}$ in $2\,\mathrm{mol}$ $\mathrm{He}$. Večja množina, večja prostornina.

? Zaprto jeklenko s plinom segrejemo s $27\,^\circ\mathrm{C}$ na $327\,^\circ\mathrm{C}$. Prostornina se ne spremeni. Kaj se zgodi s tlakom?
- Poveča se približno $12$-krat.
~ To je razmerje stopinj Celzija ($327 : 27$). Tlak je sorazmeren s temperaturo v kelvinih.
- Ostane enak, ker je jeklenka zaprta in plin ne more uiti.
~ Množina res ostane enaka, a hitrejši delci močneje in pogosteje udarjajo v stene.
+ Podvoji se.
> $T$ naraste s $300\,\mathrm{K}$ na $600\,\mathrm{K}$, torej na dvojno vrednost. Pri stalnih $n$ in $V$ je tlak sorazmeren s $T$.

? Koliko litrov zavzame $0{,}25\,\mathrm{mol}$ kisika pri normalnih pogojih?
- $89{,}6\,\mathrm{L}$
~ To je $22{,}4 : 0{,}25$. Množino moraš z molsko prostornino pomnožiti, ne deliti.
- $8\,\mathrm{L}$
~ To je masa v gramih ($0{,}25 \cdot 32$), ne prostornina.
- $6{,}1\,\mathrm{L}$
~ Tu je uporabljena molska prostornina pri $25\,^\circ\mathrm{C}$. Pri normalnih pogojih je $22{,}4\,\mathrm{L/mol}$.
+ $5{,}6\,\mathrm{L}$
> $V = n \cdot V_m = 0{,}25\,\mathrm{mol} \cdot 22{,}4\,\mathrm{L/mol} = 5{,}6\,\mathrm{L}$.

? Žogica za vaterpolo ima pri $20\,^\circ\mathrm{C}$ in $101{,}3\,\mathrm{kPa}$ prostornino $3{,}0\,\mathrm{L}$. Koliko molov zraka je v njej?
- $1{,}83\,\mathrm{mol}$
~ Tu je temperatura vstavljena v stopinjah Celzija ($20$). Potrebuješ $T = 293\,\mathrm{K}$.
- $125\,\mathrm{mol}$
~ Tlak je vstavljen v Pa. Z $R = 8{,}314$ in prostornino v L mora biti tlak v kPa.
- $0{,}134\,\mathrm{mol}$
~ To je $3{,}0 : 22{,}4$, a $22{,}4\,\mathrm{L/mol}$ velja pri $0\,^\circ\mathrm{C}$, ne pri $20\,^\circ\mathrm{C}$.
+ $0{,}125\,\mathrm{mol}$
> $n = \dfrac{pV}{RT} = \dfrac{101{,}3 \cdot 3{,}0}{8{,}314 \cdot 293} \approx 0{,}125\,\mathrm{mol}$.

:::simboli
V_m | molska prostornina | V_m = \frac{V}{n} | L/mol | pri normalnih pogojih $22{,}4\,\mathrm{L/mol}$
V | prostornina plina | V = \frac{nRT}{p} | L
n | množina plina | n = \frac{pV}{RT} | mol
p | tlak plina | p = \frac{nRT}{V} | kPa
T | temperatura v kelvinih | T = t + 273 | K
t | temperatura v stopinjah Celzija | | °C
R | splošna plinska konstanta | | kPa \cdot L/(mol \cdot K) | $8{,}314$, enaka za vse pline
m | masa | m = n \cdot M | g
M | molska masa | M = \frac{m}{n} | g/mol
:::
