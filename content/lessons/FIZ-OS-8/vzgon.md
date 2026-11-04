---
stanje: osnutek
demo: gostota
avtor: AI
---

## Zakaj se tega učimo

Pred trgovino stoji kad z ledeno vodo, v njej pločevinke pijač. Navadne kole ležijo na dnu. Dietne, v čisto enakih pločevinkah in po enaki ceni, plavajo na gladini.

To se zdi narobe. Pločevinki sta enako veliki, iz enake pločevine, v obeh je $0{,}33\,\mathrm{L}$ pijače. Razlikujeta se le v sladkorju: navadna kola ga ima okoli $35\,\mathrm{g}$, dietna skoraj nič. Kako lahko malo sladkorja odloči, ali pločevinka potone?

Odgovor skriva sila, ki jo voda izvaja na vsako telo v njej: **vzgon**. Z njim razložimo, zakaj plava jeklena ladja, zakaj se v morju lažje plava kot v jezeru in zakaj staro jajce splava, sveže pa potone.

## Razlaga

**Kocka pod vodo.** Predstavljaj si kocko z robom $10\,\mathrm{cm}$, potopljeno tako, da je zgornja ploskev $10\,\mathrm{cm}$ pod gladino, spodnja pa $20\,\mathrm{cm}$. Voda pritiska nanjo z vseh strani, pravokotno na vsako ploskev. Sili na levo in desno stranico sta enaki in nasprotni, zato se izničita. Drugače je zgoraj in spodaj, ker tlak z globino narašča ($p = \rho g h$). Vsaka ploskev meri $S = 0{,}01\,\mathrm{m^2}$, sila nanjo pa je tlak krat ploščina, $F = p \cdot S$:

| ploskev | globina | tlak vode | sila na ploskev |
|---|---|---|---|
| zgornja (sila navzdol) | $0{,}1\,\mathrm{m}$ | $981\,\mathrm{Pa}$ | $9{,}81\,\mathrm{N}$ |
| spodnja (sila navzgor) | $0{,}2\,\mathrm{m}$ | $1962\,\mathrm{Pa}$ | $19{,}62\,\mathrm{N}$ |

Od spodaj voda potiska močneje kot od zgoraj. Rezultanta obeh sil kaže navzgor in meri $19{,}62\,\mathrm{N} - 9{,}81\,\mathrm{N} = 9{,}81\,\mathrm{N}$. To je **vzgon**: sila, s katero tekočina potiska potopljeno telo navzgor.

:::premisli
Kocko spustimo še $20\,\mathrm{cm}$ globlje. Bo vzgon večji, manjši ali enak? Zakaj?
---
Enak. Tlak na zgornjo ploskev naraste, a za enako vrednost naraste tudi tlak na spodnjo: sili sta zdaj $29{,}43\,\mathrm{N}$ in $39{,}24\,\mathrm{N}$, razlika je spet $9{,}81\,\mathrm{N}$. Ko je telo v celoti pod vodo, je vzgon od globine neodvisen.
:::

**Kaj pomeni $9{,}81\,\mathrm{N}$.** Kocka z robom $10\,\mathrm{cm}$ ima prostornino $1\,\mathrm{dm^3} = 1\,\mathrm{L}$. Toliko vode je kocka odrinila s prostora, ki ga zdaj zavzema sama; rečemo, da jo je **izpodrinila**. Liter vode ima maso $1\,\mathrm{kg}$ in težo ravno $9{,}81\,\mathrm{N}$. Vzgon je torej enak teži vode, ki bi bila na mestu kocke.

To velja za vsako telo in vsako tekočino. To pravilo imenujemo **Arhimedov zakon**: vzgon je enak teži izpodrinjene tekočine. Od snovi, iz katere je telo, in od njegove teže vzgon ni odvisen. Odvisen je od prostornine potopljenega dela in od gostote tekočine.

**Silomer v vodi.** Telo obesimo na silomer, ga odčitamo v zraku in nato v vodi. V vodi kaže silomer manj, ker del teže prevzame vzgon:

| kaj merimo | odčitek silomera |
|---|---|
| v zraku | teža telesa $F_g$ |
| v vodi | $F_g - F_{vz}$ |
| razlika | vzgon $F_{vz}$ |

Preveri to v simulaciji spodaj (Vzgon in Arhimedov zakon): telo počasi spuščaj v vodo in spremljaj silomer. Odčitek pada, dokler se telo ne potopi v celoti, potem pa ostane enak, prav kot je napovedal račun s kocko.

**Plava ali potone?** Na telo, ki ga spustimo pod vodo, delujeta dve sili: teža navzdol in vzgon navzgor. Kot pri vsakih dveh nasprotnih silah odloča večja. Namesto sil lahko primerjamo tudi gostoti: povsem potopljeno telo izpodrine natanko svojo prostornino vode, zato je ta voda težja od telesa ravno takrat, ko je telo redkejše od nje.

| sili (telo povsem pod vodo) | gostoti | kaj se zgodi |
|---|---|---|
| vzgon večji od teže | telo redkejše od tekočine | splava na gladino |
| vzgon enak teži | enaki gostoti | lebdi |
| vzgon manjši od teže | telo gostejše od tekočine | potone |

Telo, ki splava, se na gladini ustavi, ko je pod vodo le toliko njegove prostornine, da je vzgon enak teži. Tedaj sta sili v ravnovesju. Zato kos lesa plava napol potopljen, ledena gora pa skoraj povsem.

:::premisli
Jeklo ima skoraj osemkrat večjo gostoto od vode, žebelj potone. Zakaj potem jeklena ladja plava?
---
Ladja je votla. Z jeklenimi stenami in zrakom v notranjosti zavzame ogromno prostornine, zato izpodrine veliko vode in vzgon je velik. Povprečna gostota ladje (jeklo in zrak skupaj) je manjša od gostote vode. Žebelj enake mase izpodrine le malo vode.
:::

**Iz besed v formulo.** Teža izpodrinjene tekočine je njena masa, pomnožena z $g$, masa pa je gostota krat prostornina. Tako dobimo:

$$F_{vz} = \rho_t \cdot g \cdot V$$

Tu je $\rho_t$ gostota tekočine (ne telesa!), $V$ prostornina potopljenega dela telesa v $\mathrm{m^3}$ in $g = 9{,}81\,\mathrm{N/kg}$.

## Rešeni primeri

### Primer 1: ključavnica za kolo

Novo ključavnico za kolo obesiš na silomer. V zraku kaže $7{,}8\,\mathrm{N}$, ko jo povsem potopiš v vodo, pa $6{,}8\,\mathrm{N}$. Kolikšen je vzgon?

**Podatki:** odčitek v zraku $F_g = 7{,}8\,\mathrm{N}$, odčitek v vodi $F_1 = 6{,}8\,\mathrm{N}$
**Iščemo:** vzgon $F_{vz}$

:::formula
$F_{vz} = F_g - F_1$
:::

**Rešitev:**

1. Silomer v vodi kaže manj, ker vzgon potiska ključavnico navzgor; razlika je ravno vzgon.
2. $F_{vz} = 7{,}8\,\mathrm{N} - 6{,}8\,\mathrm{N} = 1{,}0\,\mathrm{N}$.
3. Odgovor: vzgon na ključavnico je $1{,}0\,\mathrm{N}$.

### Primer 2: krompir na silomeru

Krompir s prostornino $200\,\mathrm{cm^3}$ ima težo $2{,}16\,\mathrm{N}$. Kolikšen vzgon deluje nanj, ko je povsem v vodi? Kaj tedaj pokaže silomer?

**Podatki:** $V = 200\,\mathrm{cm^3}$, $F_g = 2{,}16\,\mathrm{N}$, $\rho_t = 1000\,\mathrm{kg/m^3}$, $g = 9{,}81\,\mathrm{N/kg}$
**Iščemo:** vzgon $F_{vz}$ in odčitek silomera $F_1$

:::formula
$F_{vz} = \rho_t \cdot g \cdot V$, nato $F_1 = F_g - F_{vz}$
:::

**Rešitev:**

1. Prostornino pretvorimo v $\mathrm{m^3}$, ker je gostota v $\mathrm{kg/m^3}$: $200\,\mathrm{cm^3} = 0{,}0002\,\mathrm{m^3}$.
2. $F_{vz} = 1000\,\mathrm{kg/m^3} \cdot 9{,}81\,\mathrm{N/kg} \cdot 0{,}0002\,\mathrm{m^3} \approx 1{,}96\,\mathrm{N}$.
3. $F_1 = 2{,}16\,\mathrm{N} - 1{,}96\,\mathrm{N} = 0{,}20\,\mathrm{N}$.
4. Odgovor: vzgon je približno $1{,}96\,\mathrm{N}$, silomer v vodi kaže le $0{,}20\,\mathrm{N}$. Krompir je skoraj tako »lahek« kot voda, a vseeno potone.

### Primer 3: skrivnost pločevinke

Vzemimo približne podatke za polno pločevinko navadne kole: zunanja prostornina $360\,\mathrm{cm^3}$, masa $370\,\mathrm{g}$. Ali v vodi potone? Kolikšna bi smela biti največja masa pločevinke, da ne bi potonila?

**Podatki:** $V = 360\,\mathrm{cm^3}$, $m = 370\,\mathrm{g}$, $\rho_t = 1000\,\mathrm{kg/m^3}$, $g = 9{,}81\,\mathrm{N/kg}$
**Iščemo:** primerjavo $F_{vz}$ in $F_g$; največjo maso $m_{max}$

:::formula
$F_{vz} = \rho_t \cdot g \cdot V$ in $F_g = m \cdot g$; telo ne potone, če je $F_{vz} \ge F_g$
:::

**Rešitev:**

1. Pretvorimo: $V = 0{,}00036\,\mathrm{m^3}$ in $m = 0{,}37\,\mathrm{kg}$.
2. Vzgon, ko je pločevinka povsem pod vodo: $F_{vz} = 1000 \cdot 9{,}81 \cdot 0{,}00036 \approx 3{,}53\,\mathrm{N}$.
3. Teža: $F_g = 0{,}37 \cdot 9{,}81 \approx 3{,}63\,\mathrm{N}$.
4. Teža je večja od vzgona, zato pločevinka potone.
5. Največja masa: vzgon mora biti vsaj enak teži, torej mora biti masa pločevinke največ enaka masi izpodrinjene vode, $m_{max} = 1000\,\mathrm{kg/m^3} \cdot 0{,}00036\,\mathrm{m^3} = 0{,}36\,\mathrm{kg}$.
6. Odgovor: navadna kola potone. Pločevinka z maso do $360\,\mathrm{g}$ bi plavala; dietni, ki je brez sladkorja lažja za več kot $10\,\mathrm{g}$, to uspe.

### Primer 4: zdaj ti

Jajce iz trgovine ima maso $60\,\mathrm{g}$ in prostornino $55\,\mathrm{cm^3}$. V navadni vodi potone. Ali splava v slani vodi z gostoto $1150\,\mathrm{kg/m^3}$?

**Podatki:** $m = 60\,\mathrm{g}$, $V = 55\,\mathrm{cm^3}$, $\rho_t = 1150\,\mathrm{kg/m^3}$, $g = 9{,}81\,\mathrm{N/kg}$
**Iščemo:** ali je vzgon večji od teže

:::formula
$F_g = m \cdot g$ in $F_{vz} = \rho_t \cdot g \cdot V$
:::

**Rešitev:**

1. Pretvorimo: $m = 0{,}06\,\mathrm{kg}$, $V = 0{,}000055\,\mathrm{m^3}$.
2. Teža jajca: $F_g = 0{,}06 \cdot 9{,}81 \approx 0{,}59\,\mathrm{N}$.
3. Izračunaj vzgon v slani vodi in primerjaj s težo:

:::premisli
Koliko je $F_{vz} = 1150 \cdot 9{,}81 \cdot 0{,}000055$ in kaj se zgodi z jajcem?
---
$F_{vz} \approx 0{,}62\,\mathrm{N}$. To je več od teže $0{,}59\,\mathrm{N}$, zato jajce v slani vodi splava. V navadni vodi bi bil vzgon le okoli $0{,}54\,\mathrm{N}$, zato tam potone.
:::

## Pogoste napake

- **Gostota telesa namesto gostote tekočine.** Za krompir bi kdo v $F_{vz} = \rho_t \cdot g \cdot V$ vstavil gostoto krompirja. Vzgon je teža izpodrinjene *tekočine*, zato v formulo sodi gostota vode, olja ali slane vode.
- **Težje telo ima večji vzgon.** Ključavnica in kos plastelina enake prostornine izpodrineta enako vode in imata enak vzgon. Teža odloča le o tem, ali telo potone, ne o velikosti vzgona.
- **Globlje, večji vzgon.** Res tlak z globino raste, a na zgornji in spodnji ploskvi za enako vrednost, zato razlika sil ostane enaka. Ko je telo v celoti pod gladino, se vzgon ne spreminja več.
- **Cela prostornina plavajočega telesa.** Za plavajoče telo šteje le potopljeni del. Kdor vstavi celo prostornino kosa lesa, dobi vzgon, večji od teže, čeprav les mirno plava v ravnovesju.
- **Kubični centimetri v formuli.** Če vstaviš $300$ namesto $0{,}0003\,\mathrm{m^3}$, dobiš milijonkrat prevelik vzgon. Pred računanjem pretvori v $\mathrm{m^3}$.

## Povzetek

- Na potopljeno telo tekočina deluje s silo navzgor, z vzgonom $F_{vz}$; nastane, ker je tlak spodaj večji kot zgoraj.
- Arhimedov zakon: vzgon je enak teži izpodrinjene tekočine, $F_{vz} = \rho_t \cdot g \cdot V$.
- Vzgon je odvisen od gostote tekočine in prostornine potopljenega dela, ne od teže telesa in ne od globine (ko je telo povsem pod vodo).
- Silomer: vzgon je razlika odčitkov v zraku in v tekočini.
- Povsem potopljeno telo splava, če je vzgon večji od teže, lebdi pri enakih silah in potone, če je vzgon manjši. Plavajoče telo je v ravnovesju: $F_{vz} = F_g$.

## Drugače: Z analogijo

Predstavljaj si gugalnico. Na en sedež posediš telo, na drugega »vodo, ki bi bila na njegovem mestu«: natanko toliko vode, kolikor je prostornina telesa. Kateri sedež je težji, ta gre dol.

- Pločevinka navadne kole je težja od svoje »vodne dvojnice«, zato pade na dno.
- Dietna je lažja, zato jo voda odrine navzgor.
- Ladja ima ogromno vodno dvojnico (vso vodo, ki bi zapolnila njen trup), zato zmaga, čeprav je iz jekla.

Gugalnica ne pove, *koliko* telesa je pod gladino, ko plava. To pove ravnovesje: telo potone le toliko, da je dvojnica potopljenega dela enako težka kot celo telo.

## Drugače: Iz vsakdanjega življenja

- **Jajca iz trgovine.** Sveže jajce v kozarcu vode potone. Starejšemu se v notranjosti nabere zračni mehurček, prostornina ostane enaka, masa pa se zmanjša, zato se dvigne ali splava.
- **Tovorna ladja.** Bolj ko je naložena, globlje se pogrezne, saj mora izpodriniti več vode za večjo težo. Na trupu ima črte, do katerih jo smejo naložiti.
- **Rešilni jopič.** Napolnjen z lahko peno ali zrakom poveča prostornino telesa skoraj brez dodatne teže, zato skupaj splavata.
- **Morje proti jezeru.** Slana voda je gostejša, zato je vzgon pri isti potopljeni prostornini večji. V Mrtvem morju človek leži na vodi kot na blazini.
- **Riba s plavalnim mehurjem.** Ko ga napihne, se poveča njena prostornina in vzgon, zato se dvigne; ko ga izprazni, se spusti.

## Preveri se

? Steklenico olja obesiš na silomer: v zraku kaže $9\,\mathrm{N}$, v vodi $6\,\mathrm{N}$. Kaj pomenijo $3\,\mathrm{N}$ razlike?
- Težo olja v steklenici
~ Teža celotne steklenice z oljem je $9\,\mathrm{N}$, kar pokaže silomer v zraku. Razlika nastane šele v vodi.
+ Vzgon, s katerim voda potiska steklenico navzgor
- Silo trenja med steklenico in vodo
~ Steklenica v vodi miruje, zato nanjo ne deluje upor ali trenje. Manjši odčitek povzroči sila vode navzgor.
> Razlika odčitkov v zraku in v tekočini je vzgon: $F_{vz} = 9\,\mathrm{N} - 6\,\mathrm{N} = 3\,\mathrm{N}$.

? Kos železa s prostornino $1\,\mathrm{L}$ potopimo povsem v olje ($900\,\mathrm{kg/m^3}$), vodo ($1000\,\mathrm{kg/m^3}$) in slano vodo ($1100\,\mathrm{kg/m^3}$). Uredi tekočine od **največjega** do **najmanjšega** vzgona.
+ slana voda, voda, olje
- olje, voda, slana voda
~ Obrnil si vrstni red. Gostejša tekočina pri isti prostornini da večji vzgon.
- V vseh treh je vzgon enak, saj gre za isto železo.
~ Vzgon ni odvisen od snovi telesa, je pa odvisen od gostote tekočine.
> Prostornina je ista, zato odloča $\rho_t$: $10{,}79\,\mathrm{N}$ v slani vodi, $9{,}81\,\mathrm{N}$ v vodi, $8{,}83\,\mathrm{N}$ v olju.

? Žogo, ki plava na vodi, z roko potisneš povsem pod gladino. Kaj se zgodi z vzgonom?
- Ostane enak, ker se teža žoge ni spremenila.
~ Vzgon ni odvisen od teže, ampak od izpodrinjene prostornine, ta pa se je povečala.
- Zmanjša se, ker je žoga globlje.
~ Globina pri povsem potopljenem telesu ne vpliva na vzgon, tu pa se poveča potopljena prostornina.
+ Poveča se, ker žoga izpodrine več vode.
> Med plavanjem je bil pod vodo le del žoge. Ko jo potopiš, izpodrine več vode, vzgon postane večji od teže in ko jo spustiš, poskoči navzgor.

? Telo s prostornino $300\,\mathrm{cm^3}$ je povsem v vodi. Kolikšen je vzgon? ($g = 9{,}81\,\mathrm{N/kg}$)
- $2\,943\,000\,\mathrm{N}$
~ Prostornino si vstavil v $\mathrm{cm^3}$. Najprej pretvori: $300\,\mathrm{cm^3} = 0{,}0003\,\mathrm{m^3}$.
- $0{,}3\,\mathrm{N}$
~ To je masa izpodrinjene vode v kilogramih ($0{,}3\,\mathrm{kg}$). Za silo jo pomnoži še z $g$.
+ $2{,}94\,\mathrm{N}$
> $F_{vz} = 1000\,\mathrm{kg/m^3} \cdot 9{,}81\,\mathrm{N/kg} \cdot 0{,}0003\,\mathrm{m^3} \approx 2{,}94\,\mathrm{N}$.

? Telo s prostornino $2\,\mathrm{dm^3}$ in maso $1{,}5\,\mathrm{kg}$ držiš povsem pod vodo in ga spustiš. Kolikšna je rezultanta teže in vzgona v tistem trenutku? ($g = 9{,}81\,\mathrm{N/kg}$)
- $19{,}6\,\mathrm{N}$ navzgor
~ To je le vzgon. Nasproti njemu deluje še teža, ki jo moraš odšteti.
- $34{,}3\,\mathrm{N}$ navzgor
~ Teža in vzgon kažeta nasprotno, zato ju odštejemo, ne seštejemo.
- $4{,}9\,\mathrm{N}$ navzdol
~ Velikost je prava, smer ne: rezultanta kaže v smer večje sile, tu je to vzgon.
+ $4{,}9\,\mathrm{N}$ navzgor
> $F_{vz} = 1000 \cdot 9{,}81 \cdot 0{,}002 = 19{,}62\,\mathrm{N}$, $F_g = 1{,}5 \cdot 9{,}81 \approx 14{,}72\,\mathrm{N}$. Razlika $4{,}9\,\mathrm{N}$ kaže navzgor, zato telo splava.

:::simboli
F_{vz} | vzgon | F_{vz} = \rho_t \cdot g \cdot V | N | kaže navpično navzgor
\rho_t | gostota tekočine | | kg/m^3 | ne gostota telesa
\rho | gostota tekočine | | kg/m^3 | v $p = \rho g h$
g | gravitacijski pospešek | | N/kg | na Zemlji $9{,}81\,\mathrm{N/kg}$
V | prostornina potopljenega dela telesa | | m^3 | enaka prostornini izpodrinjene tekočine
p | tlak v tekočini | p = \rho g h | Pa
h | globina pod gladino | | m
S | ploščina ploskve | | m^2
F_g | teža telesa | F_g = m \cdot g | N
m | masa telesa | | kg
F_1 | odčitek silomera v vodi | F_1 = F_g - F_{vz} | N
m_{max} | največja masa, pri kateri telo še ne potone | m_{max} = \rho_t \cdot V | kg
:::
