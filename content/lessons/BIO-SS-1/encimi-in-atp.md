---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Za papirno kašo ali za lepljenje tapet si pripraviš **klister**: škrob iz moke premešaš z vročo vodo, da nastane gosta lepljiva masa. Restavratorji v muzejih morajo tak star klister odstraniti s hrbta stoletnih zemljevidov in plakatov. Strgati ne smejo, ker bi papir raztrgali. Zato na lepilo nanesejo gel z beljakovino, kakršna je tudi v tvoji slini. Ta razgradi škrob v nekaj minutah.

To beljakovino lahko preizkusiš sam. V šoli v šest epruvet daš enako količino razredčenega klistra, v pet od njih še enako količino raztopine **amilaze**. Vsako minuto kapljico iz epruvete preizkusiš z jodovico: dokler je škrob še tam, se kapljica obarva modro-črno, ko ga ni več, ostane rjava. Izmeriš, po kolikem času modra barva izgine. Kaj vse vpliva na ta čas, in zakaj sploh?

## Razlaga

**1. Rezultati poskusa.** V vsaki epruveti je bilo $12\,\text{mg}$ škroba.

| Epruveta | Pogoji | Modra barva izgine po |
|---|---|---|
| A | amilaza, $5\,^\circ\text{C}$ (led) | $15\,\text{min}$ |
| B | amilaza, $20\,^\circ\text{C}$ | $6\,\text{min}$ |
| C | amilaza, $37\,^\circ\text{C}$ | $2\,\text{min}$ |
| D | amilaza, prej prekuhana, nato $37\,^\circ\text{C}$ | po $30\,\text{min}$ še modro |
| E | amilaza s kisom, $37\,^\circ\text{C}$ | po $30\,\text{min}$ še modro |
| F | brez amilaze, $37\,^\circ\text{C}$ | po $30\,\text{min}$ še modro |

Preden bereš naprej, poišči v tabeli tri vzorce.

**2. Prvi vzorec: brez amilaze nič.** Epruveta F je kontrola. Škrob v vodi sam od sebe razpada neznansko počasi, v pol ure praktično nič. Amilaza reakcijo močno pospeši. Snov, ki reakcijo pospeši, sama pa se pri tem ne porabi, je **katalizator**. Katalizator iz živih celic je **encim**. Skoraj vsi encimi so **beljakovine**, imena imajo pogosto končnico *-aza* (amilaza, laktaza, lipaza).

Snov, ki jo encim predela, je **substrat** (tu škrob), kar nastane, so **produkti** (tu maltoza, sladkor iz dveh glukoz). Encim po reakciji ostane enak in lahko takoj zgrabi naslednjo molekulo substrata.

**3. Drugi vzorec: topleje je hitreje, a le do meje.** Od A do C se čas krajša. **Hitrost reakcije** $v$ je masa substrata, ki se razgradi v enoti časa:

$$v = \frac{m}{t}$$

Pri $5\,^\circ\text{C}$ je $v = \frac{12\,\text{mg}}{15\,\text{min}} = 0{,}8\,\text{mg/min}$, pri $20\,^\circ\text{C}$ $2\,\text{mg/min}$, pri $37\,^\circ\text{C}$ $6\,\text{mg/min}$. Delci se v toplejšem gibljejo hitreje in se pogosteje srečajo. Pravilo palca: pod optimumom se hitrost pri dvigu za $10\,^\circ\text{C}$ približno podvoji.

Epruveta D pokaže drugo stran. Vročina je porušila obliko beljakovine, kar že poznaš kot **denaturacijo**. Ko se encim ohladi, oblike ne dobi nazaj. Temperatura, pri kateri encim dela najhitreje, je **optimalna temperatura**; pri večini človeških encimov je okoli $37\,^\circ\text{C}$.

:::risba graf
opis: Hitrost razgradnje škroba z amilazo v odvisnosti od temperature. Od 0 do 37 °C krivulja raste (pri 5 °C 0,8, pri 20 °C 2, pri 37 °C 6 mg/min), nad 37 °C strmo pade in pri 60 °C doseže 0.
x: 0 .. 70 | 10 | temperatura (°C)
y: 0 .. 7 | 1 | hitrost (mg/min)
črta: 0; 0,5 -> 5; 0,8 -> 20; 2 -> 30; 3,8 -> 37; 6 -> 45; 4 -> 50; 1,5 -> 60; 0 -> 70; 0 | modra
točka: 5; 0,8 | A | nad
točka: 20; 2 | B | nad
točka: 37; 6 | C (optimum) | nad
točka: 60; 0 | denaturiran | nad
podnapis: Krivulja raste do optimuma pri 37 °C, nad njim encim denaturira.
:::

:::premisli
Epruveto A iz ledu prestaviš v vodo s $37\,^\circ\text{C}$. Napovej: bo jodovica čez nekaj minut še modra? Primerjaj z epruveto D.
---
Ne, modra barva hitro izgine, kot v C. Mraz encima ne poškoduje, le upočasni gibanje delcev. Vročina v D pa je encim trajno denaturirala.
:::

**4. Tretji vzorec: kis ustavi encim.** V epruveti E je kis znižal pH. Kislina spremeni naboje na beljakovini in s tem njeno obliko. Vsak encim ima svoj **optimalni pH**: amilaza iz sline okoli $7$, pepsin v kislem želodcu okoli $2$, tripsin v tankem črevesu okoli $8$.

V simulaciji spodaj »Encim in temperatura« nastavi temperaturo najprej na $37\,^\circ\text{C}$, nato na $5\,^\circ\text{C}$ in na $60\,^\circ\text{C}$. Opazuj, kolikšna je aktivnost encima in kako simulacija pojasni razliko med mrazom in vročino.

**5. Zakaj je oblika tako pomembna: aktivno mesto.** Na površini encima je majhna vdolbina, **aktivno mesto**. Vanjo se prilega le substrat prave oblike, kot ključ v ključavnico. Temu pravimo **model ključa in ključavnice**. Substrat in encim tvorita **encimsko-substratni kompleks**, v njem se vezi v substratu raztegnejo in pretrgajo, produkti odidejo, encim pa je pripravljen za novo molekulo. Ker se prilega le en substrat, je encim **specifičen**: amilaza razgradi škrob, maščob pa ne.

Kot vsak model je tudi ta poenostavljen: aktivno mesto ni togo, ob vezavi substrata se malo prilagodi. Bistvo pa drži: če se oblika poruši, se ključ ne prilega več.

:::premisli
Škrob in celuloza sta oba zgrajena iz glukoze. Zakaj amilaza v slini razgradi škrob v kruhu, celulozo v solati pa ne?
---
Glukoze sta v škrobu in celulozi povezani na drugačen način, zato imata molekuli drugačno obliko. Celuloza se ne prilega v aktivno mesto amilaze, zato je ta ne razgradi.
:::

**6. Encim zniža oviro.** Vsaka reakcija potrebuje na začetku nekaj energije, **aktivacijsko energijo**, podobno kot moraš voziček najprej potisniti čez prag. Encim drži substrat v ugodni legi in s tem oviro zniža. Zato reakcije v celici tečejo hitro pri telesni temperaturi, brez segrevanja.

**7. Presnova.** Vse kemijske reakcije v organizmu skupaj so **presnova** (metabolizem). Razgradnja velikih molekul v manjše (glukoza v ogljikov dioksid in vodo pri celičnem dihanju) sprošča energijo. Izgradnja (aminokisline v beljakovino) energijo porabi. Vsak korak vodi svoj encim.

**8. ATP: polnilna baterija celice.** Kako energija iz razgradnje pride do izgradnje? Prenaša jo **ATP** (adenozin trifosfat): adenin, sladkor riboza in tri zaporedne fosfatne skupine. Ko celica od ATP s hidrolizo (cepitvijo z vodo) odcepi zadnjo fosfatno skupino, nastane **ADP** (adenozin difosfat), sprosti pa se energija:

$\mathrm{ATP} + \mathrm{H_2O} \rightarrow \mathrm{ADP} + \text{fosfat} + \text{energija}$

S to energijo celica poganja natrijevo-kalijevo črpalko, krčenje mišic in gradnjo beljakovin. V mitohondrijih se iz ADP in fosfata z energijo iz hrane spet naredi ATP. ATP je zato kot akumulator vrtalnika: izprazniš ga pri delu, napolniš na polnilcu, in to stokrat. Ni dolgoročna zaloga; za to ima celica škrob, glikogen in maščobe.

## Rešeni primeri

### Primer 1: kolikokrat hitreje

Iz tabele poskusa: v epruveti B ($20\,^\circ\text{C}$) amilaza razgradi $12\,\text{mg}$ škroba v $6\,\text{min}$, v epruveti C ($37\,^\circ\text{C}$) enako količino v $2\,\text{min}$. Kolikšni sta hitrosti in kolikokrat hitreje poteka reakcija pri $37\,^\circ\text{C}$?

**Podatki:** $m = 12\,\text{mg}$, $t_B = 6\,\text{min}$, $t_C = 2\,\text{min}$
**Iščemo:** hitrosti $v_B$, $v_C$ in razmerje $\dfrac{v_C}{v_B}$

:::formula
$v = \dfrac{m}{t}$
:::

**Rešitev:**

1. Pri $20\,^\circ\text{C}$: $v_B = \dfrac{12\,\text{mg}}{6\,\text{min}} = 2\,\text{mg/min}$.
2. Pri $37\,^\circ\text{C}$: $v_C = \dfrac{12\,\text{mg}}{2\,\text{min}} = 6\,\text{mg/min}$.
3. Razmerje: $\dfrac{v_C}{v_B} = \dfrac{6}{2} = 3$. Krajši čas pomeni večjo hitrost.
4. Odgovor: pri $37\,^\circ\text{C}$ amilaza dela s hitrostjo $6\,\text{mg/min}$, trikrat hitreje kot pri $20\,^\circ\text{C}$ ($2\,\text{mg/min}$).

### Primer 2: restavratorka in star zemljevid

Na hrbtu starega zemljevida je $30\,\text{mg}$ škrobnega klistra. Restavratorka nanese gel z amilazo, ki pri $37\,^\circ\text{C}$ razgradi $6\,\text{mg}$ škroba na minuto. Koliko časa mora gel delovati? Pomočnik predlaga, da bi gel segreli na $70\,^\circ\text{C}$, »da bo šlo hitreje«. Ali ima prav?

**Podatki:** $m = 30\,\text{mg}$, $v = 6\,\text{mg/min}$ pri $37\,^\circ\text{C}$, predlog: $70\,^\circ\text{C}$
**Iščemo:** čas $t$; ali je segrevanje smiselno

:::formula
$t = \dfrac{m}{v}$ (iz $v = \dfrac{m}{t}$)
:::

**Rešitev:**

1. Iščemo čas, zato zvezo obrnemo: $t = \dfrac{m}{v}$.
2. $t = \dfrac{30\,\text{mg}}{6\,\text{mg/min}} = 5\,\text{min}$.
3. Pri $70\,^\circ\text{C}$ je temperatura daleč nad optimumom. Amilaza bi denaturirala, aktivno mesto bi izgubilo obliko, škrob pa bi ostal na papirju.
4. Odgovor: gel mora delovati $5\,\text{min}$. Pomočnik nima prav: segrevanje nad optimum encim uniči, delo bi bilo počasnejše, ne hitrejše.

### Primer 3: kolikokrat na dan se napolni baterija

V telesu odraslega človeka je hkrati le okoli $250\,\text{g}$ ATP. V enem dnevu telo pri običajnem delu porabi okoli $60\,\text{kg}$ ATP. Kolikokrat na dan se mora povprečna molekula ATP znova »napolniti« iz ADP? Na koliko minut se to zgodi?

**Podatki:** $m_\text{ATP} = 250\,\text{g}$, $m_\text{dan} = 60\,\text{kg} = 60\,000\,\text{g}$, en dan $= 24\,\text{h}$
**Iščemo:** število polnjenj $n$ in čas med polnjenjema $t_1$

:::formula
$n = \dfrac{m_\text{dan}}{m_\text{ATP}}$, $\quad t_1 = \dfrac{24 \cdot 60\,\text{min}}{n}$
:::

**Rešitev:**

1. Obe masi v gramih: $m_\text{dan} = 60\,000\,\text{g}$.
2. $n = \dfrac{60\,000\,\text{g}}{250\,\text{g}} = 240$. Telo ima malo ATP, zato ga mora neprestano obnavljati.
3. Dan ima $24 \cdot 60 = 1440$ minut. Ta čas razdeli na $n$ enakih delov. Preden odpreš rešitev, oceni: so to sekunde, minute ali ure?

:::premisli
Na koliko minut se povprečna molekula ATP znova napolni? Kaj to pove o tem, zakaj ATP ni zaloga energije?
---
$t_1 = \dfrac{1440\,\text{min}}{240} = 6\,\text{min}$. ATP se porabi in obnovi v nekaj minutah, zato je prenašalec, ne skladišče. Kot akumulator vrtalnika, ki ga ves dan menjaš na polnilcu.
:::

## Pogoste napake

- **»Encim se pri reakciji porabi.«** Napačno sklepanje: ko škroba ni več, je tudi encima konec. V resnici encim ostane nespremenjen in ponovno uporaben. Zato zadošča zelo malo encima za veliko substrata.
- **»Topleje je vedno hitreje.«** Velja le do optimalne temperature. Nad njo beljakovina denaturira in hitrost pade proti nič. Graf hitrosti ni naraščajoča premica, temveč ima vrh.
- **»Mraz encim uniči.«** Mraz reakcijo le upočasni. Ko se encim ogreje, spet dela. Trajno ga poškodujeta vročina ali neprimeren pH. Zato hrano v hladilniku ohranjamo, s kuhanjem pa encime uničimo.
- **»Encim deluje na vse snovi.«** Aktivno mesto sprejme le substrat ustrezne oblike. Amilaza ne razgradi celuloze ne beljakovin.
- **»ATP je zaloga energije.«** ATP je prenašalec za kratek čas, obnovi se v nekaj minutah. Dolgoročna zaloga so škrob, glikogen in maščobe.

## Povzetek

- Presnova so vse kemijske reakcije v organizmu; razgradnja energijo sprošča, izgradnja jo porabi.
- Encimi so beljakovine, biološki katalizatorji: pospešijo reakcijo, zmanjšajo aktivacijsko energijo in se ne porabijo.
- Substrat se veže v aktivno mesto (model ključa in ključavnice), nastane encimsko-substratni kompleks, nato produkti. Encim je specifičen.
- Hitrost reakcije $v = \dfrac{m}{t}$ raste s temperaturo do optimuma (pri človeku okoli $37\,^\circ\text{C}$); nad njim encim denaturira, trajno. Mraz le upočasni.
- Vsak encim ima optimalni pH (pepsin okoli $2$, amilaza iz sline okoli $7$).
- ATP (adenin, riboza, tri fosfatne skupine) prenaša energijo: $\mathrm{ATP} \rightarrow \mathrm{ADP} + \text{fosfat}$ jo sprosti, v mitohondrijih se ATP znova sestavi.

## Drugače: Korak za korakom s številkami

Kako iz meritev poiščeš optimalno temperaturo:

1. Za vsako epruveto izračunaj hitrost $v = \dfrac{m}{t}$. Iz tabele: A $\dfrac{12}{15} = 0{,}8\,\text{mg/min}$, B $\dfrac{12}{6} = 2\,\text{mg/min}$, C $\dfrac{12}{2} = 6\,\text{mg/min}$.
2. Kjer modra barva ne izgine, je hitrost praktično $0$ (D, E, F).
3. Primerjaj sosednje: od A do B $\dfrac{2}{0{,}8} = 2{,}5$-krat, od B do C $\dfrac{6}{2} = 3$-krat hitreje.
4. Največja izmerjena hitrost je pri $37\,^\circ\text{C}$: to je najboljša ocena optimuma.
5. Za natančnejši optimum bi izmeril še pri $30$, $40$ in $45\,^\circ\text{C}$ in vsak poskus ponovil vsaj trikrat.
6. Za oceno uporabi pravilo palca: pod optimumom $+10\,^\circ\text{C}$ pomeni približno dvakrat večjo hitrost. Iz $2\,\text{mg/min}$ pri $20\,^\circ\text{C}$ oceniš okoli $4\,\text{mg/min}$ pri $30\,^\circ\text{C}$.

## Drugače: Kot zgodba

V delavnici stole sestavlja mizar Encim. Ima eno samo šablono, izrezano točno za en kos, nogo stola. Ko nogo položi vanjo, jo v hipu pritrdi na sedež. Brez šablone bi se trudil pol ure, z njo opravi v sekundi, šablona pa ostane cela za naslednji stol.

Nekega dne prinese vajenec nogo mize. Ne gre v šablono, mizar je ne more pritrditi. Šablona je specifična.

Pozimi je v delavnici mrzlo in mizar dela počasi, a dela. Poleti pa nekdo pusti šablono na peči. Plastika se zvije. Ko se ohladi, ostane zvita in nobena noga se ne prilega več. Tako je z denaturacijo: ni poti nazaj.

Mizar dela z akumulatorskim vrtalnikom. Poln akumulator je ATP. Ko vrta, se izprazni v ADP. Na polnilcu v kotu, ki ga poganja elektrarna mitohondrij, se spet napolni. Mizar ima le nekaj akumulatorjev, a ves dan jih menja, zato vrtalnik nikoli ne obstane.

## Preveri se

? Katero zaporedje meritev hitrosti (v $\text{mg/min}$ pri $10$; $25$; $37$; $50$; $70\,^\circ\text{C}$) ustreza encimu iz človeškega telesa?
- $1$; $3$; $6$; $9$; $12$
~ Hitrost ne raste v nedogled: nad optimumom beljakovina denaturira.
+ $1$; $3$; $6$; $2$; $0$
- $6$; $4$; $3$; $2$; $1$
~ Mraz encima ne izboljša, le upočasni gibanje delcev. Največja hitrost je pri telesni temperaturi.
- $0$; $0$; $6$; $0$; $0$
~ Encim deluje tudi pod optimumom, le počasneje. Pri $10$ in $25\,^\circ\text{C}$ hitrost ni nič.
> Hitrost raste do optimuma okoli $37\,^\circ\text{C}$, nad njim pa zaradi denaturacije hitro pade proti $0$.

? Encim pri $10\,^\circ\text{C}$ razgradi $4\,\text{mg}$ substrata na minuto. Oceni hitrost pri $20\,^\circ\text{C}$ (oboje pod optimumom).
- okoli $4\,\text{mg/min}$
~ Temperatura vpliva na gibanje delcev, zato se hitrost spremeni.
+ okoli $8\,\text{mg/min}$
- okoli $40\,\text{mg/min}$
~ Dvig za $10\,^\circ\text{C}$ ne pomeni desetkrat večje hitrosti, ampak približno dvakrat večjo.
> Pravilo palca: pod optimumom se hitrost pri dvigu za $10\,^\circ\text{C}$ približno podvoji, $4 \cdot 2 = 8$.

? Nariban surov krompir prekuhaš in kašo ohladiš na $37\,^\circ\text{C}$. Zakaj encimi iz krompirja v njej ne delujejo več?
- Ker so se pri reakcijah med kuhanjem porabili.
~ Encimi se pri reakcijah ne porabijo; ostanejo nespremenjeni.
- Ker so še prehladni, da bi spet delovali.
~ $37\,^\circ\text{C}$ je ugodna temperatura. Težava ni mraz, ampak prejšnja vročina.
+ Ker je vročina trajno porušila obliko aktivnega mesta (denaturacija).
> Denaturacija je nepovratna: ohlajena beljakovina ne dobi prvotne oblike, zato se substrat ne prilega več.

? Amilaza dela s hitrostjo $3\,\text{mg/min}$ in je škrob razgradila v $5\,\text{min}$. Koliko škroba je bilo v epruveti?
- $0{,}6\,\text{mg}$
~ To je $\dfrac{3}{5}$. Iz $v = \dfrac{m}{t}$ sledi $m = v \cdot t$, torej množiš.
+ $15\,\text{mg}$
- $1{,}7\,\text{mg}$
~ To je $\dfrac{5}{3}$, čas deljen s hitrostjo. Masa je $m = v \cdot t$.
> $m = v \cdot t = 3\,\text{mg/min} \cdot 5\,\text{min} = 15\,\text{mg}$.

? Pepsin razgrajuje beljakovine v želodcu pri pH okoli $2$. Kaj se z njim zgodi, ko s hrano pride v tanko črevo s pH okoli $8$?
+ Skoraj preneha delovati, ker se spremeni oblika aktivnega mesta.
- Dela hitreje, ker je pH večji.
~ Večji pH ni boljši; vsak encim ima svoj optimum, pepsin pri $2$.
- Spremeni se v ATP in da črevesu energijo.
~ Pepsin je beljakovina, ATP pa ni beljakovina; encim se v ATP ne pretvori.
> Pri pH daleč od optimuma se spremenijo naboji in oblika beljakovine, substrat se ne prilega več. V črevesu beljakovine razgrajuje tripsin z optimumom okoli pH $8$.

<<RACUN
vrednost: 12/15 | 0.8
vrednost: 12/6 | 2
vrednost: 12/2 | 6
vrednost: 6/2 | 3
vrednost: 2/0.8 | 2.5
vrednost: 30/6 | 5
vrednost: 60000/250 | 240
vrednost: 24*60 | 1440
vrednost: 1440/240 | 6
vrednost: 4*2 | 8
vrednost: 3*5 | 15
>>

:::simboli
v | hitrost reakcije (razgradnje škroba) | v = \dfrac{m}{t} | mg/min
m | masa razgrajenega substrata (škroba) | m = v \cdot t | mg
t | čas reakcije | t = \dfrac{m}{v} | min
v_B, v_C | hitrost v epruveti B in C | | mg/min
t_B, t_C | čas v epruveti B in C | | min
n | število polnjenj ATP na dan | n = \dfrac{m_\text{dan}}{m_\text{ATP}} | – |
m_\text{dan} | masa ATP, porabljena v enem dnevu | | g
m_\text{ATP} | masa ATP v telesu hkrati | | g
t_1 | čas med dvema polnjenjema molekule ATP | t_1 = \dfrac{24 \cdot 60\,\text{min}}{n} | min
:::
