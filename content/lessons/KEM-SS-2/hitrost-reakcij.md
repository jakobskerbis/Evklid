---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Molekule v zraku letijo hitreje od zvoka. Zvok potuje s približno $340\,\mathrm{m/s}$, molekula dušika pri sobni temperaturi v povprečju s skoraj $480\,\mathrm{m/s}$, molekula vodika celo s skoraj $1800\,\mathrm{m/s}$. Vsaka molekula v sekundi trči z drugimi nekaj milijardkrat.

Zdaj pa paradoks. Zmes vodika in kisika lahko v zaprti posodi stoji leta, ne da bi se karkoli zgodilo. Reakcija, v kateri nastane voda, sprosti veliko energije, delci pa nenehno trkajo. Pa vendar nič. Ko zmesi približaš iskro, se zasliši glasen **pok**, ki ga pri pouku uporabljamo kot dokaz za vodik.

Kako je mogoče, da milijarde trkov na sekundo ne naredijo nič, ena iskra pa vse? Odgovor pove, zakaj hrana v hladilniku zdrži dlje, zakaj moka v zraku lahko eksplodira in kako avtomobilski katalizator čisti izpušne pline.

## Razlaga

**Trk ni dovolj.** Predstavljaj si dva delca, ki letita drug proti drugemu. Trk se lahko konča na tri načine:

| trk | dovolj energije? | prava usmerjenost? | izid |
|---|---|---|---|
| počasen, čelni | ne | da | odbijeta se |
| hiter, s strani | da | ne | odbijeta se |
| hiter, pravilno obrnjen | da | da | nastane produkt |

Le zadnji trk je **uspešen trk**. Najmanjšo energijo, ki jo morata delca imeti ob trku, da reakcija steče, imenujemo **aktivacijska energija** $E_\mathrm{a}$. Pri sobni temperaturi ima tako energijo le majhen delež molekul vodika in kisika. Iskra krajevno močno segreje zmes, nekaj molekul zreagira, sproščena energija segreje sosede in reakcija se v hipu razširi.

**Energijski hrib.** Pot od reaktantov do produktov si nariši kot cesto čez hrib. Levo spodaj so reaktanti, desno še nižje produkti. Vmes je vrh, ki je za $E_\mathrm{a}$ višje od reaktantov. Delec, ki nima dovolj energije, se do vrha ne povzpne in se vrne nazaj.

**Hitrost reakcije** pove, koliko reaktanta se porabi ali koliko produkta nastane v eni sekundi (ali drugi enoti časa). V laboratoriju jo merimo na različne načine: s prostornino nastalega plina, z izgubo mase, s spremembo barve ali s časom, v katerem raztopina postane motna. Ko magnezij reagira s kislino, slišiš šumenje mehurčkov vodika; glasnejše in gostejše šumenje pomeni hitrejšo reakcijo.

**Kaj vpliva na hitrost.** Vsak dejavnik spremeni bodisi število trkov bodisi delež uspešnih:

| dejavnik | kaj se zgodi z delci | hitrost |
|---|---|---|
| večja koncentracija | več delcev v istem prostoru, več trkov | večja |
| višja temperatura | večji delež delcev ima energijo vsaj $E_\mathrm{a}$ | večja |
| bolj razdrobljena trdna snov | večja površina, več delcev dostopnih za trk | večja |
| narava snovi | različne vezi, različno visok hrib | odvisno od snovi |
| katalizator | nižji hrib, več uspešnih trkov | večja |

:::premisli
Magnezijev trak enkrat potopiš v klorovodikovo kislino s koncentracijo $1\,\mathrm{mol/L}$, drugič v kislino z $2\,\mathrm{mol/L}$. Napovej, kako se bo razlikovalo šumenje. Kaj se v bolj koncentrirani kislini spremeni: hitrost delcev kisline, njihova energija ali njihovo število?
---
V bolj koncentrirani kislini šumi močneje. V istem prostoru je dvakrat več delcev kisline, zato ti v sekundi pogosteje zadenejo površino magnezija in v sekundi nastane več vodika.
:::

**Temperatura deluje močneje, kot bi pričakoval.** Pri segrevanju z $20\,^\circ\mathrm{C}$ na $30\,^\circ\mathrm{C}$ se delci gibljejo le približno $2\,\%$ hitreje. Pa vendar se hitrost mnogih reakcij pri tem približno podvoji. Temu približnemu pravilu pravimo **pravilo $10\,^\circ\mathrm{C}$**.

V simulaciji spodaj »Hitrost reakcije in trki delcev« pusti število delcev enako in temperaturo nastavi najprej na $25\,^\circ\mathrm{C}$, nato na $75\,^\circ\mathrm{C}$. Opazuj odstotek uspešnih trkov v izpisu in to, kako strmo pada graf števila delcev A.

:::premisli
Zakaj se hitrost podvoji, čeprav so delci hitrejši le za okoli $2\,\%$ in je tudi trkov le malo več?
---
Ker ne šteje število trkov, ampak število *uspešnih* trkov. Delež delcev z energijo vsaj $E_\mathrm{a}$ je majhen in z višanjem temperature hitro raste: že malo več energije prevede čez vrh hriba veliko več delcev.
:::

**Katalizator.** Katalizator je snov, ki reakcijo pospeši, sama pa se pri tem ne porabi. Na koncu ga je enako kot na začetku. Reakciji ponudi drugo pot, kot predor skozi hrib: aktivacijska energija je nižja, zato ima pri isti temperaturi zadostno energijo veliko večji delež delcev. Katalizator ne spremeni, kateri produkti nastanejo, in ne spremeni, koliko energije se sprosti. Spremeni le, kako hitro pridemo do konca.

Primeri: manganov dioksid $\mathrm{MnO_2}$ pospeši razkroj vodikovega peroksida, platina v avtomobilskem katalizatorju pretvarja strupeni $\mathrm{CO}$ v $\mathrm{CO_2}$, platina tudi vžge zmes vodika in kisika brez iskre. Biološkim katalizatorjem pravimo **encimi**; amilaza v slini začne razgrajevati škrob že v ustih.

**Na koncu še simboli.** Povprečno hitrost v časovnem intervalu zapišemo kot spremembo koncentracije, deljeno s časom:

$$v = \frac{|\Delta c|}{\Delta t}$$

Enota je $\mathrm{mol/(L \cdot s)}$. Ker se koncentracija reaktanta zmanjšuje, je $\Delta c$ negativen; absolutno vrednost pišemo, da je hitrost pozitivna. Kadar merimo plin, uporabimo kar prostornino na čas, na primer $\mathrm{mL/s}$.

## Rešeni primeri

### Primer 1: trak ali prah

Enako maso magnezija damo v enako kislino. Trak da v $30\,\mathrm{s}$ $45\,\mathrm{mL}$ vodika, prah enako prostornino v $9\,\mathrm{s}$. Kolikšni sta povprečni hitrosti nastajanja vodika in kolikokrat je reakcija s prahom hitrejša?

**Podatki:** $V = 45\,\mathrm{mL}$, $t_\mathrm{trak} = 30\,\mathrm{s}$, $t_\mathrm{prah} = 9\,\mathrm{s}$, masa in kislina enaki
**Iščemo:** hitrosti $v_\mathrm{trak}$, $v_\mathrm{prah}$ in njuno razmerje

:::formula
$v = \dfrac{V}{t}$ (prostornina plina na čas)
:::

**Rešitev:**

1. Trak: $v_\mathrm{trak} = \dfrac{45\,\mathrm{mL}}{30\,\mathrm{s}} = 1{,}5\,\mathrm{mL/s}$.
2. Prah: $v_\mathrm{prah} = \dfrac{45\,\mathrm{mL}}{9\,\mathrm{s}} = 5\,\mathrm{mL/s}$.
3. Razmerje: $\dfrac{5}{1{,}5} \approx 3{,}3$; razlog je večja površina prahu, saj je masa enaka.
4. Odgovor: trak daje $1{,}5\,\mathrm{mL/s}$, prah $5\,\mathrm{mL/s}$ vodika, torej je reakcija s prahom približno $3{,}3$-krat hitrejša.

### Primer 2: hitrost se s časom manjša

Pri reakciji magnezija s klorovodikovo kislino izmerimo koncentracijo kisline. Na začetku je $1{,}50\,\mathrm{mol/L}$, po $120\,\mathrm{s}$ je $1{,}20\,\mathrm{mol/L}$, po nadaljnjih $120\,\mathrm{s}$ pa $1{,}02\,\mathrm{mol/L}$. Izračunaj povprečno hitrost v obeh intervalih in pojasni razliko.

**Podatki:** $c_0 = 1{,}50\,\mathrm{mol/L}$, $c_1 = 1{,}20\,\mathrm{mol/L}$, $c_2 = 1{,}02\,\mathrm{mol/L}$, $\Delta t = 120\,\mathrm{s}$ za vsak interval
**Iščemo:** $v_1$ in $v_2$

:::formula
$v = \dfrac{|\Delta c|}{\Delta t}$
:::

**Rešitev:**

1. Prvi interval: $|\Delta c| = 1{,}50 - 1{,}20 = 0{,}30$, torej $0{,}30\,\mathrm{mol/L}$.
2. $v_1 = \dfrac{0{,}30\,\mathrm{mol/L}}{120\,\mathrm{s}} = 0{,}0025\,\mathrm{mol/(L \cdot s)}$.
3. Drugi interval: $|\Delta c| = 1{,}20 - 1{,}02 = 0{,}18$, torej $0{,}18\,\mathrm{mol/L}$.
4. $v_2 = \dfrac{0{,}18\,\mathrm{mol/L}}{120\,\mathrm{s}} = 0{,}0015\,\mathrm{mol/(L \cdot s)}$.
5. Hitrost je padla, ker je kisline manj: manjša koncentracija pomeni manj trkov v sekundi.
6. Odgovor: v prvih dveh minutah je hitrost $0{,}0025\,\mathrm{mol/(L \cdot s)}$, v naslednjih dveh le $0{,}0015\,\mathrm{mol/(L \cdot s)}$.

### Primer 3: pevka in šumeča tableta

Pevka Ana si pred koncertom pripravi šumečo tableto vitamina C. V vodi z $20\,^\circ\mathrm{C}$ šumenje traja $80\,\mathrm{s}$. Po pravilu $10\,^\circ\mathrm{C}$ oceni: (a) koliko časa bi šumelo v vodi s $40\,^\circ\mathrm{C}$; (b) kako topla bi morala biti voda, da bi bila tableta raztopljena v $10\,\mathrm{s}$?

**Podatki:** $T_1 = 20\,^\circ\mathrm{C}$, $t_1 = 80\,\mathrm{s}$, $T_2 = 40\,^\circ\mathrm{C}$, želeni čas $t_3 = 10\,\mathrm{s}$
**Iščemo:** čas $t_2$ in temperaturo $T_3$

:::formula
Vsakih $+10\,^\circ\mathrm{C}$ se hitrost približno podvoji, zato se čas razpolovi.
:::

**Rešitev:**

1. Z $20\,^\circ\mathrm{C}$ na $40\,^\circ\mathrm{C}$ sta dva koraka po $10\,^\circ\mathrm{C}$, hitrost se poveča $2 \cdot 2 = 4$-krat.
2. Čas je obratno sorazmeren s hitrostjo: $t_2 = \dfrac{80\,\mathrm{s}}{4} = 20\,\mathrm{s}$.
3. Za (b): čas se mora skrajšati $\dfrac{80\,\mathrm{s}}{10\,\mathrm{s}} = 8$-krat.
4. $8 = 2 \cdot 2 \cdot 2$, torej potrebujemo tri podvojitve, to je $3 \cdot 10\,^\circ\mathrm{C} = 30\,^\circ\mathrm{C}$ več.
5. $T_3 = 20\,^\circ\mathrm{C} + 30\,^\circ\mathrm{C} = 50\,^\circ\mathrm{C}$.
6. Odgovor: pri $40\,^\circ\mathrm{C}$ tableta šumi okoli $20\,\mathrm{s}$; za $10\,\mathrm{s}$ bi potrebovali vodo s približno $50\,^\circ\mathrm{C}$. Pravilo je le ocena, a za vrstni red velikosti zadošča.

### Primer 4: izračunaj sam

V dve epruveti z enako raztopino vodikovega peroksida damo: v prvo nič, v drugo $0{,}5\,\mathrm{g}$ manganovega dioksida. V $60\,\mathrm{s}$ se v prvi sprosti $0{,}5\,\mathrm{mL}$ kisika, v drugi $60\,\mathrm{mL}$. Kolikokrat je reakcija s katalizatorjem hitrejša in koliko $\mathrm{MnO_2}$ ostane po reakciji?

**Podatki:** $V_1 = 0{,}5\,\mathrm{mL}$, $V_2 = 60\,\mathrm{mL}$, $t = 60\,\mathrm{s}$, $m(\mathrm{MnO_2}) = 0{,}5\,\mathrm{g}$
**Iščemo:** razmerje hitrosti in maso katalizatorja po reakciji

:::formula
$\dfrac{v_2}{v_1} = \dfrac{V_2}{V_1}$, ker je čas enak.
:::

**Rešitev:**

1. Čas je pri obeh enak, zato lahko primerjamo kar prostornini plina.
2. Izračunaj razmerje in odgovori še na vprašanje o masi:

:::premisli
Koliko je $\dfrac{60\,\mathrm{mL}}{0{,}5\,\mathrm{mL}}$ in koliko $\mathrm{MnO_2}$ ostane?
---
$120$: reakcija s katalizatorjem je $120$-krat hitrejša. Po reakciji je še vedno $0{,}5\,\mathrm{g}$ $\mathrm{MnO_2}$, ker se katalizator ne porabi.
:::

## Pogoste napake

- **»Vsak trk je reakcija.«** Če bi to veljalo, bi zmes vodika in kisika eksplodirala sama od sebe. Uspešen je le trk z energijo vsaj $E_\mathrm{a}$ in pravo usmerjenostjo. Zato šteje *delež* uspešnih trkov.
- **»Toplota pomaga le zato, ker je trkov več.«** Trkov je pri $+10\,^\circ\mathrm{C}$ le nekaj odstotkov več, hitrost pa se podvoji. Odločilno je, da ima več delcev dovolj energije za prehod čez hrib.
- **»Katalizator se porabi« ali »katalizator da več produkta«.** Katalizator ostane nespremenjen, zato ga na koncu ne štejemo med reaktante ali produkte. Produkta nastane enako, le prej.
- **»Večji kos ima več snovi, zato reagira hitreje.«** Hitrost ni odvisna od tega, koliko snovi je skupaj, ampak koliko delcev je na površini. Pri enaki masi ima prah veliko večjo površino.
- **»Hitrost je ves čas enaka.«** Ko se reaktanti porabljajo, njihova koncentracija pada in reakcija se upočasnjuje, kot v primeru 2.

## Povzetek

- Reakcija poteče le ob uspešnem trku: dovolj energije (vsaj aktivacijska energija $E_\mathrm{a}$) in prava usmerjenost.
- Hitrost reakcije je sprememba koncentracije (ali količine produkta) v času: $v = \dfrac{|\Delta c|}{\Delta t}$, enota $\mathrm{mol/(L \cdot s)}$.
- Hitrost povečajo: večja koncentracija, višja temperatura, bolj razdrobljena trdna snov in katalizator; odvisna je tudi od narave snovi.
- Pravilo $10\,^\circ\mathrm{C}$: pri segrevanju za $10\,^\circ\mathrm{C}$ se hitrost približno podvoji, ker raste delež delcev z dovolj energije.
- Katalizator zniža aktivacijsko energijo, se ne porabi in ne spremeni produktov niti sproščene energije. Encimi so biološki katalizatorji.

## Drugače: Z analogijo

Pomisli na klavirsko tipko. Če jo pritisneš zelo nežno, kladivce ne doseže strune in tona ni. Za ton mora biti pritisk dovolj močan: to je aktivacijska energija.

- **Trk brez dovolj energije** je kot prenežen pritisk: tipka se premakne, tona ni.
- **Višja temperatura** je kot pianist, ki igra močneje: veliko več pritiskov preseže prag, čeprav jih ni bistveno več.
- **Večja koncentracija** je kot več prstov na klaviaturi: več pritiskov v sekundi.
- **Katalizator** je kot lažja mehanika klavirja: kladivce doseže struno že pri nežnejšem pritisku. Tipke so iste in ton je isti, le zazveni pri več pritiskih.

## Drugače: Iz vsakdanjega življenja

- **Hladilnik:** pri $4\,^\circ\mathrm{C}$ potekajo reakcije, zaradi katerih se hrana kvari, nekajkrat počasneje kot pri sobni temperaturi.
- **Kurjenje:** poleno se vžge težko, trske hitro, žagovina ali moka v zraku pa lahko eksplodira. Masa je ista, površina vse večja.
- **Kitarske strune:** na vlažnem in s potnimi prsti strune hitreje zarjavijo, ker voda in soli s kože pospešujeta korozijo.
- **Pralni prašek:** encimi v prašku razgrajujejo madeže že pri $30\,^\circ\mathrm{C}$, za kar bi brez njih potrebovali veliko višjo temperaturo.
- **Slina:** če kruh dolgo žvečiš, postane sladek, ker amilaza škrob razgradi do sladkorja.

## Preveri se

? Platina v avtomobilskem izpuhu pospeši pretvorbo $\mathrm{CO}$ v $\mathrm{CO_2}$, po letih vožnje pa je platine še vedno enako. Kaj je platina v tej reakciji?
- reaktant
~ Reaktant se pri reakciji porablja. Platine pa je na koncu enako kot na začetku.
+ katalizator
- produkt
~ Produkt je $\mathrm{CO_2}$, ki nastane. Platina je bila tam že pred reakcijo.
> Snov, ki reakcijo pospeši in se pri tem ne porabi, je katalizator. Zniža aktivacijsko energijo.

? Enako maso magnezija damo v klorovodikovo kislino. Razvrsti od najhitrejše do najpočasnejše reakcije: (A) trak, $1\,\mathrm{mol/L}$, $20\,^\circ\mathrm{C}$; (B) prah, $1\,\mathrm{mol/L}$, $20\,^\circ\mathrm{C}$; (C) prah, $2\,\mathrm{mol/L}$, $40\,^\circ\mathrm{C}$.
- A, B, C
~ Trak ima pri enaki masi najmanjšo površino. Večji kos ne pomeni hitrejše reakcije.
- B, C, A
~ C ima enako površino kot B, a večjo koncentracijo in višjo temperaturo, zato je hitrejša od B.
+ C, B, A
> C ima vse tri prednosti: prah, večjo koncentracijo in višjo temperaturo. B ima le večjo površino od A.

? Kaj se zgodi, če reakciji dodamo katalizator, vse drugo pa ostane enako?
- Nastane več produkta.
~ Katalizator ne spremeni, koliko produkta nastane. Isto količino dobimo le prej.
- Katalizator se porabi in ga moramo sproti dodajati.
~ Katalizator na koncu ostane nespremenjen; to ga loči od reaktanta.
+ Aktivacijska energija se zniža in reakcija poteka hitreje.
- Delci se začnejo gibati hitreje.
~ Hitrost delcev je odvisna od temperature, ne od katalizatorja. Katalizator zniža hrib, ne pospeši delcev.
> Katalizator ponudi pot z nižjo aktivacijsko energijo, zato je več trkov uspešnih. Produkti in sproščena energija ostanejo enaki.

? Koncentracija reaktanta pade z $0{,}80\,\mathrm{mol/L}$ na $0{,}50\,\mathrm{mol/L}$ v $60\,\mathrm{s}$. Kolikšna je povprečna hitrost reakcije?
- $0{,}30\,\mathrm{mol/(L \cdot s)}$
~ To je le sprememba koncentracije. Hitrost je sprememba, deljena s časom.
- $0{,}013\,\mathrm{mol/(L \cdot s)}$
~ Tu je začetna koncentracija deljena s časom. Deliti moraš *spremembo* koncentracije.
+ $0{,}0050\,\mathrm{mol/(L \cdot s)}$
- $200\,\mathrm{mol/(L \cdot s)}$
~ To je čas, deljen s spremembo koncentracije. Koncentracija je v števcu.
> $v = \dfrac{|\Delta c|}{\Delta t} = \dfrac{0{,}30\,\mathrm{mol/L}}{60\,\mathrm{s}} = 0{,}0050\,\mathrm{mol/(L \cdot s)}$.

? Reakcija pri $20\,^\circ\mathrm{C}$ traja $120\,\mathrm{s}$. Koliko približno traja pri $50\,^\circ\mathrm{C}$, če velja pravilo $10\,^\circ\mathrm{C}$?
- $40\,\mathrm{s}$
~ Tri korake po $10\,^\circ\mathrm{C}$ si štel kot trikrat hitrejšo reakcijo. Vsak korak hitrost *podvoji*, zato je skupaj $2 \cdot 2 \cdot 2 = 8$.
- $360\,\mathrm{s}$
~ Pri višji temperaturi je reakcija hitrejša, zato traja manj časa, ne več.
- $30\,\mathrm{s}$
~ To sta le dve podvojitvi. Z $20\,^\circ\mathrm{C}$ na $50\,^\circ\mathrm{C}$ so trije koraki po $10\,^\circ\mathrm{C}$.
+ $15\,\mathrm{s}$
> Trije koraki po $10\,^\circ\mathrm{C}$ pomenijo $8$-krat večjo hitrost, zato čas $\dfrac{120\,\mathrm{s}}{8} = 15\,\mathrm{s}$.

:::simboli
v | hitrost reakcije | v = \frac{\lvert \Delta c \rvert}{\Delta t} | mol/(L s) | pri merjenju plina v = V : t, v mL/s
c | množinska koncentracija reaktanta | | mol/L | Δc je negativna, zato pišemo absolutno vrednost
t | čas | | s
V | prostornina nastalega plina | | mL
v_1 | hitrost reakcije brez katalizatorja | v_1 = \dfrac{V_1}{t} | mL/s | v primeru 2 hitrost v prvem intervalu, v mol/(L s)
v_2 | hitrost reakcije s katalizatorjem | v_2 = \dfrac{V_2}{t} | mL/s | v primeru 2 hitrost v drugem intervalu, v mol/(L s)
V_1 | prostornina kisika brez katalizatorja | | mL
V_2 | prostornina kisika s katalizatorjem | | mL
:::
