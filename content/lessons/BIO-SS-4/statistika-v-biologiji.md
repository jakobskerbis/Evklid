---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Lara igra bobne v šolskem bendu. Na vajah opazi, da ji po hitrih skladbah srce razbija še dolgo po koncu. Za raziskovalno nalogo pri biologiji se odloči preveriti, ali hitra glasba pospeši srčni utrip tudi pri poslušalcih.

Deset sošolcev posluša počasno skladbo, deset drugih hitro. Nato vsakemu izmeri utrip. Povprečji sta $75\,\text{/min}$ in $82\,\text{/min}$. Lara je navdušena, mentorica pa vpraša: »Kako veš, da to ni naključje? Z drugimi dvajsetimi sošolci bi morda dobila ravno obratno.«

Lara potrebuje odgovor, ki ni »zdi se mi«. Tak odgovor da statistika. Skoraj vsak graf v znanstvenem članku ima črtice napak in pripis $p < 0{,}05$; po tej lekciji ju boš znal prebrati.

## Razlaga

Najprej slike, simboli šele na koncu.

**1. Pike na številski premici.** Nariši številsko premico od $60$ do $100$ udarcev na minuto. Nad njo nariši deset pik za skupino s počasno glasbo, pod njo deset pik za hitro glasbo. Zgornje pike ležijo med približno $66$ in $84$, spodnje med $72$ in $92$. Vrsti se na sredini prekrivata.

**Povprečje** je točka, v kateri bi premica s pikami ostala v ravnovesju, kot gugalnica. Zgoraj je pri $75$, spodaj pri $82$. Povprečje pove, kje je sredina podatkov, ne pa, kako so raztreseni.

**2. Razpršenost.** Predstavljaj si še eno skupino s povprečjem $75$, pri kateri so vse pike stisnjene med $73$ in $77$. Povprečje je enako, slika pa povsem drugačna. **Standardni odklon** $s$ je tipična razdalja pike od povprečja. Stisnjene pike imajo majhen $s$, raztresene velik. Enoto ima enako kot podatki.

V simulaciji spodaj »Sredine in razpršenost podatkov« povečaj drsnik »razpršenost«. Opazi, da se histogram razširi in standardni odklon (tam označen s $\sigma$) zraste, povprečje pa ostane skoraj enako.

**3. Kako zanesljivo je povprečje.** Če bi Lara meritev ponovila z drugimi desetimi sošolci, bi dobila malo drugačno povprečje. Za koliko se povprečje tipično premakne od vzorca do vzorca, pove **standardna napaka** $\mathrm{SE}$. Odvisna je od razpršenosti in od števila meritev $n$: več meritev, manjša napaka. Ne pada pa sorazmerno z $n$, ampak počasneje, s korenom $\sqrt{n}$.

Na stolpčnem diagramu povprečje nariše stolpec, standardno napako pa navpična črtica na vrhu, **črtica napake**. Če se črtici dveh stolpcev močno prekrivata, je razlika lahko le naključna. O mejnih primerih odloči test.

:::premisli
Lara bi rada standardno napako razpolovila. Koliko sošolcev mora izmeriti v vsaki skupini namesto $10$?
---
$40$, torej štirikrat več. Standardna napaka pada s korenom števila meritev: $\sqrt{4} = 2$. Standardni odklon pa ostane približno enak, saj so ljudje še vedno enako različni.
:::

**4. t-test: sta povprečji res različni?** Test začne z izhodiščno predpostavko, **ničelno hipotezo**: »med skupinama ni razlike, opažena razlika je naključna«. Nato izračuna $t$, ki pove, koliko standardnih napak sta povprečji narazen. Velik $t$ pomeni, da bi bila tako velika razlika le po naključju malo verjetna.

Vrednost $t$ primerjamo s **kritično vrednostjo** iz tabele. Ta je odvisna od **stopinj prostosti**, pri dveh skupinah $n_1 + n_2 - 2$. V biologiji navadno izberemo mejo $p = 0{,}05$: razliko imamo za pravo, če bi tako veliko razliko samo naključje dalo v manj kot $5\,\%$ primerov.

| stopinje prostosti | 8 | 10 | 18 |
|---|---|---|---|
| kritični $t$ ($p = 0{,}05$) | 2,31 | 2,23 | 2,10 |

Če je $t$ večji od kritične vrednosti, ničelno hipotezo zavrnemo: razlika je **statistično značilna**. Če je manjši, je ne zavrnemo. To ne dokaže, da razlike ni, le dokazov je premalo.

**5. Korelacija: oblak pik.** Zdaj nariši pravokoten koordinatni sistem. Na vodoravno os daj tempo skladbe (udarci na minuto), na navpično utrip poslušalca. Vsak poslušalec je ena pika. Ta slika je **razsevni diagram**.

Če pike ležijo ob naraščajoči premici, je korelacija pozitivna. Če ob padajoči, je negativna. Če tvorijo okrogel oblak, korelacije ni. Moč pove **korelacijski koeficient** $r$, ki je vedno med $-1$ in $1$. Vrednosti blizu $1$ ali $-1$ pomenijo močno povezanost, blizu $0$ šibko ali nobene.

Iz prejšnje lekcije veš: korelacija je povezanost, ne vzrok.

:::premisli
Kakšen $r$ pričakuješ med razdaljo od zvočnika in izmerjeno glasnostjo zvoka? Pozitiven ali negativen, blizu $0$ ali blizu $\pm 1$?
---
Negativen in precej blizu $-1$. Dlje od zvočnika je glasnost vedno manjša, zato pike ležijo tesno ob padajoči krivulji. Ker ta krivulja ni ravna črta, $r$ (ki meri, kako blizu premice so pike) ne doseže čisto $-1$.
:::

**6. Hi-kvadrat test: štetja po kategorijah.** Ko podatki niso meritve, ampak štetja v kategorijah (vijolični ali beli cvetovi, izbrana glasbena zvrst), uporabimo **hi-kvadrat test** $\chi^2$. Postavi tabelo: v vsako vrstico kategorijo, opaženo število $O$ in pričakovano število $E$, ki ga napove ničelna hipoteza. Večja kot so odstopanja, večji je $\chi^2$.

Stopinje prostosti so število kategorij manj ena, $k - 1$. Kritične vrednosti pri $p = 0{,}05$: $3{,}84$ za eno stopinjo, $5{,}99$ za dve. Če je $\chi^2$ manjši od kritične vrednosti, so odstopanja lahko naključna in podatki se ujemajo s pričakovanjem.

**7. Kateri test?**

| Podatki | Uporabi |
|---|---|
| ena skupina meritev | povprečje, $s$, $\mathrm{SE}$ |
| dve skupini meritev | t-test |
| štetja po kategorijah | hi-kvadrat test |
| dve meritvi na vsakem osebku | korelacija |

V simulaciji spodaj »Izbira statističnega testa« razvrsti primere. Pri vsakem se najprej vprašaj: so to meritve ali štetja?

**8. Formule na enem mestu.** $\mathrm{SE}_r$ je standardna napaka razlike med povprečjema; $r$ tu pomeni razliko, ne korelacije. Znak $\sum$ pomeni »seštej vse«: vse meritve oziroma vse kategorije.

$$\bar{x} = \frac{\sum x_i}{n} \qquad s = \sqrt{\frac{\sum (x_i - \bar{x})^2}{n - 1}} \qquad \mathrm{SE} = \frac{s}{\sqrt{n}}$$

$$\mathrm{SE}_r = \sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}} \qquad t = \frac{\bar{x}_1 - \bar{x}_2}{\mathrm{SE}_r}$$

$$\chi^2 = \sum \frac{(O - E)^2}{E}$$

## Rešeni primeri

### Primer 1 (lažji): opis ene skupine

Lara izmeri utrip petim sošolcem po hitri skladbi: $72$, $80$, $76$, $84$ in $78$ udarcev na minuto. Izračunaj povprečje, standardni odklon in standardno napako.

**Podatki:** $x = 72, 80, 76, 84, 78\,\text{/min}$, $n = 5$
**Iščemo:** $\bar{x}$, $s$ in $\mathrm{SE}$

:::formula
$\bar{x} = \dfrac{\sum x_i}{n}$, $\quad s = \sqrt{\dfrac{\sum (x_i - \bar{x})^2}{n - 1}}$, $\quad \mathrm{SE} = \dfrac{s}{\sqrt{n}}$
:::

**Rešitev:**

1. Vsota: $72 + 80 + 76 + 84 + 78 = 390$.
2. Povprečje: $\bar{x} = \dfrac{390}{5} = 78\,\text{/min}$.
3. Odmiki od povprečja so $-6$, $2$, $-2$, $6$ in $0$. Kvadriramo jih, da se pozitivni in negativni ne odštejejo: $36 + 4 + 4 + 36 + 0 = 80$.
4. Delimo z $n - 1 = 4$: $\dfrac{80}{4} = 20$, nato korenimo: $s = \sqrt{20} \approx 4{,}47\,\text{/min}$.
5. $\mathrm{SE} = \dfrac{4{,}47}{\sqrt{5}} \approx 2{,}0\,\text{/min}$.
6. Odgovor: povprečni utrip je $78\,\text{/min}$, posamezniki od njega tipično odstopajo za $4{,}5\,\text{/min}$, povprečje samo pa je negotovo za približno $2\,\text{/min}$.

### Primer 2: t-test za Larino raziskavo

Skupina s počasno glasbo ($n_2 = 10$) ima povprečni utrip $75\,\text{/min}$ in $s_2 = 5\,\text{/min}$. Skupina s hitro glasbo ($n_1 = 10$) ima $82\,\text{/min}$ in $s_1 = 6\,\text{/min}$. Ali je razlika statistično značilna pri $p = 0{,}05$?

**Podatki:** $\bar{x}_1 = 82\,\text{/min}$, $s_1 = 6\,\text{/min}$, $n_1 = 10$; $\bar{x}_2 = 75\,\text{/min}$, $s_2 = 5\,\text{/min}$, $n_2 = 10$; $p = 0{,}05$; kritični $t$ za $18$ stopinj prostosti je $2{,}10$
**Iščemo:** $t$ in odločitev o ničelni hipotezi

:::formula
$\mathrm{SE}_r = \sqrt{\dfrac{s_1^2}{n_1} + \dfrac{s_2^2}{n_2}}$, $\quad t = \dfrac{\bar{x}_1 - \bar{x}_2}{\mathrm{SE}_r}$
:::

**Rešitev:**

1. Ničelna hipoteza: glasba ne vpliva na utrip.
2. $\dfrac{s_1^2}{n_1} = \dfrac{36}{10} = 3{,}6$ in $\dfrac{s_2^2}{n_2} = \dfrac{25}{10} = 2{,}5$.
3. $\mathrm{SE}_r = \sqrt{3{,}6 + 2{,}5} = \sqrt{6{,}1} \approx 2{,}47\,\text{/min}$.
4. $t = \dfrac{82 - 75}{2{,}47} \approx 2{,}83$. Povprečji sta torej skoraj tri standardne napake narazen.
5. Stopinje prostosti: $10 + 10 - 2 = 18$, kritična vrednost je $2{,}10$.
6. Ker je $2{,}83 > 2{,}10$, ničelno hipotezo zavrnemo.
7. Odgovor: razlika $7\,\text{/min}$ je statistično značilna. Lara lahko mentorici odgovori, da je tako velika razlika po naključju malo verjetna (manj kot $5\,\%$).

### Primer 3 (težji): ali se križanje ujema s 3 : 1?

Pri križanju dveh heterozigotnih rastlin graha ($Vv \times Vv$) dobimo $400$ potomcev: $290$ z vijoličnimi in $110$ z belimi cvetovi. Ali se rezultat ujema s pričakovanim razmerjem $3 : 1$?

**Podatki:** $O_\text{vijol.} = 290$, $O_\text{bel.} = 110$, skupaj $400$; pričakovano razmerje $3 : 1$; $p = 0{,}05$; kritična vrednost za $1$ stopinjo prostosti je $3{,}84$
**Iščemo:** pričakovani števili, $\chi^2$ in odločitev

:::formula
$E = \text{delež} \cdot \text{skupno število}$, $\quad \chi^2 = \sum \dfrac{(O - E)^2}{E}$, $\quad$ stopinje prostosti $= k - 1$
:::

**Rešitev:**

1. Ničelna hipoteza: razmerje je $3 : 1$, odstopanja so naključna.
2. Pričakovano: vijoličnih $\dfrac{3}{4} \cdot 400 = 300$, belih $\dfrac{1}{4} \cdot 400 = 100$.
3. Vijolični: $\dfrac{(290 - 300)^2}{300} = \dfrac{100}{300} \approx 0{,}33$.
4. Beli: $\dfrac{(110 - 100)^2}{100} = \dfrac{100}{100} = 1$.
5. $\chi^2 \approx 0{,}33 + 1 = 1{,}33$.
6. Kategoriji sta dve, zato je stopinja prostosti $2 - 1 = 1$, kritična vrednost $3{,}84$.
7. Ker je $1{,}33 < 3{,}84$, ničelne hipoteze ne zavrnemo.
8. Odgovor: odstopanje od $300 : 100$ je lahko naključno; rezultat se ujema z razmerjem $3 : 1$.

### Primer 4: zdaj ti

Šestdeset dijakov izbere eno od treh glasbenih zvrsti, ob kateri se najlažje uči: klasično jih izbere $28$, pop $18$, elektronsko $14$. Ali imajo dijaki kakšno zvrst raje, ali so razlike naključne?

**Podatki:** $O = 28, 18, 14$; skupaj $60$; $3$ kategorije; $p = 0{,}05$; kritična vrednost za $2$ stopinji prostosti je $5{,}99$
**Iščemo:** $\chi^2$ in odločitev

:::formula
$\chi^2 = \sum \dfrac{(O - E)^2}{E}$, $\quad$ stopinje prostosti $= k - 1$
:::

**Rešitev:**

1. Ničelna hipoteza: vse tri zvrsti so enako priljubljene, zato $E = \dfrac{60}{3} = 20$ za vsako.
2. Prispevki: $\dfrac{(28 - 20)^2}{20} = 3{,}2$, $\dfrac{(18 - 20)^2}{20} = 0{,}2$, $\dfrac{(14 - 20)^2}{20} = 1{,}8$.
3. Seštej prispevke in odloči sam.

:::premisli
Kolikšen je $\chi^2$ in kaj sklepamo?
---
$\chi^2 = 3{,}2 + 0{,}2 + 1{,}8 = 5{,}2$. Stopinji prostosti sta $3 - 1 = 2$. Ker je $5{,}2 < 5{,}99$, ničelne hipoteze ne zavrnemo: razlike so lahko naključne, čeprav je $28$ na videz precej več kot $14$.
:::

## Pogoste napake

Pri statistiki se redko zmotimo v računu. Pogosteje izberemo napačno mero ali napačno razložimo rezultat.

- **Zamenjava $s$ in $\mathrm{SE}$.** Kdor misli, da več meritev zmanjša standardni odklon, pozablja, da ljudje ostanejo enako različni. Z večjim $n$ se zmanjša standardna napaka, $s$ pa ostane približno enak. Popravek: $s$ opisuje posameznike, $\mathrm{SE}$ povprečje.
- **Korelacija kot vzrok.** Visok $r$ med dvema količinama ne pove, katera vpliva na katero, niti ali ju obe povzroča tretja. Popravek: vzrok pokaže poskus s kontrolno skupino.
- **Stopinje prostosti enake številu kategorij.** Pri hi-kvadrat testu z dvema kategorijama nekateri vzamejo $2$ stopinji in napačno kritično vrednost $5{,}99$. Popravek: stopinje prostosti so $k - 1$.
- **»t je manjši od kritične vrednosti, torej razlike ni.«** Test le pove, da dokazov za razliko ni dovolj. Popravek: reci »ničelne hipoteze ne zavrnemo«; morda bi več meritev razliko pokazalo.
- **Hi-kvadrat z odstotki.** Če v formulo vstaviš odstotke namesto štetij, dobiš napačen $\chi^2$, ker je odvisen od velikosti vzorca. Popravek: vedno računaj s štetji.

## Povzetek

- Povprečje $\bar{x}$ opiše sredino, standardni odklon $s$ tipično razdaljo podatkov od povprečja.
- Standardna napaka $\mathrm{SE} = \dfrac{s}{\sqrt{n}}$ pove, kako natančno poznamo povprečje; z večjim $n$ se zmanjša.
- t-test primerja povprečji dveh skupin meritev; stopinje prostosti $n_1 + n_2 - 2$.
- Hi-kvadrat test primerja opažena in pričakovana štetja po kategorijah; $\chi^2 = \sum \dfrac{(O - E)^2}{E}$, stopinje prostosti $k - 1$.
- Če je testna vrednost večja od kritične pri $p = 0{,}05$, ničelno hipotezo zavrnemo in je razlika statistično značilna.
- Korelacijski koeficient $r$ je med $-1$ in $1$ in meri moč povezanosti, ne vzroka.

## Drugače: Z analogijo

Predstavljaj si, da dva bobnarja igrata isto skladbo, tempo pa meri metronom v aplikaciji.

- **Povprečje** je tempo, ki ga bobnar v povprečju drži.
- **Standardni odklon** je, koliko posamezni udarci »plešejo« okoli tega tempa. Natančen bobnar ima majhen $s$, nervozen velik.
- **Standardna napaka** je, kako dobro iz enega posnetka oceniš njegov pravi tempo. Iz osmih taktov ga oceniš slabo, iz sto taktov dobro.
- **t-test** odgovori na vprašanje, ali drugi bobnar res igra hitreje ali je le v kratkem posnetku slučajno pohitel.

Kadar se bobnarja ločita za manj, kot znaša njuno tipično nihanje, iz kratkega posnetka ne moreš reči, kdo je hitrejši. Tako tudi t-test ne zavrne ničelne hipoteze, ko je razlika majhna v primerjavi s standardno napako.

## Drugače: Iz vsakdanjega življenja

Pri vremenski napovedi slišiš: »Jutri $20\,^\circ\text{C}$, plus minus $2\,^\circ\text{C}$.« Prva številka je kot povprečje, druga kot negotovost. Če za dve mesti napovedo $20 \pm 2$ in $21 \pm 2$, ne veš, kje bo topleje. Pri $20 \pm 1$ in $27 \pm 1$ pa je jasno. To je ideja črtic napak in t-testa.

Hi-kvadrat srečaš pri metu kovanca. V $100$ metih pričakuješ $50$ grbov. Če jih pade $54$, nihče ne posumi na goljufijo. Pri $80$ pa vsak. Test izmeri, kje je meja med »še naključje« in »nekaj ni prav«.

## Preveri se

? Tri od teh vrednosti so lahko korelacijski koeficient, ena ne more biti. Katera ne sodi zraven?
- $r = -0{,}6$
~ Negativen $r$ je dovoljen: pomeni, da ena količina pada, ko druga raste.
- $r = 0$
~ $r = 0$ je mogoč: pomeni, da linearne povezanosti ni.
+ $r = 1{,}4$
- $r = 0{,}8$
~ $0{,}8$ je med $-1$ in $1$ in pomeni močno pozitivno povezanost.
> Korelacijski koeficient je vedno med $-1$ in $1$, zato $1{,}4$ ni mogoč.

? Standardni odklon utripa v vzorcu $36$ dijakov je $12\,\text{/min}$. Kolikšna je standardna napaka?
- $0{,}33\,\text{/min}$
~ To je $\dfrac{12}{36}$: pozabil si koreniti $n$.
+ $2\,\text{/min}$
- $72\,\text{/min}$
~ To je $12 \cdot 6$. Standardni odklon deliš s $\sqrt{n}$, ne množiš.
> $\mathrm{SE} = \dfrac{s}{\sqrt{n}} = \dfrac{12}{\sqrt{36}} = \dfrac{12}{6} = 2\,\text{/min}$.

? Lara poveča število merjencev v skupini z $10$ na $40$. Kaj se zgodi?
- Standardni odklon se razpolovi.
~ Standardni odklon opisuje, kako različni so ljudje. To se z več meritvami ne spremeni.
- Standardna napaka se zmanjša na četrtino.
~ Napaka pada s korenom $n$, ne z $n$: $\sqrt{4} = 2$.
+ Standardna napaka se približno razpolovi, standardni odklon ostane približno enak.
- Oba ostaneta enaka.
~ Standardni odklon res ostane približno enak, standardna napaka pa se zmanjša, ker je povprečje več meritev natančnejše.
> $\mathrm{SE} = \dfrac{s}{\sqrt{n}}$: štirikrat večji $n$ pomeni dvakrat manjšo $\mathrm{SE}$.

? Pri križanju pričakujemo razmerje $3 : 1$. Od $100$ potomcev je $70$ in $30$. Rešitev: (1) $E = 75$ in $25$. (2) $\chi^2 = \dfrac{25}{75} + \dfrac{25}{25} \approx 1{,}33$. (3) Kategoriji sta dve, zato sta stopinji prostosti $2$ in kritična vrednost $5{,}99$. (4) Ker je $1{,}33$ manjši od kritične vrednosti, ničelne hipoteze ne zavrnemo. Kateri korak je napačen?
- Korak (1)
~ $\dfrac{3}{4} \cdot 100 = 75$ in $\dfrac{1}{4} \cdot 100 = 25$, to je pravilno.
- Korak (2)
~ $(70 - 75)^2 = 25$ in $(30 - 25)^2 = 25$, deljeno z $E$; račun je pravilen.
+ Korak (3)
- Korak (4)
~ Sklep drži: $1{,}33$ je manjši tudi od prave kritične vrednosti $3{,}84$.
> Stopinje prostosti so $k - 1 = 1$, kritična vrednost je $3{,}84$. Ker je $1{,}33 < 3{,}84$, je sklep o naključnem odstopanju vseeno pravilen.

? Raziskava na $200$ dijakih pokaže korelacijo $r = 0{,}45$ med urami vaje na inštrumentu na teden in oceno iz matematike. Časopis zapiše: »Glasba te naredi pametnejšega.« Kaj je pravilno?
- Ker je $r$ pozitiven, vaja izboljša ocene.
~ Pozitiven $r$ pove le, da količini skupaj naraščata, ne katera vpliva na katero.
- $r = 0{,}45$ pomeni, da je $45\,\%$ dijakov, ki vadijo, boljših pri matematiki.
~ $r$ ni odstotek dijakov, ampak mera moči povezanosti med $-1$ in $1$.
+ Povezanost je zmerna, a ne dokaže vzroka; obe količini lahko poveča na primer delovna navada.
- Ker $r$ ni $1$, povezave sploh ni.
~ Povezave ni pri $r$ blizu $0$. Vrednost $0{,}45$ pomeni zmerno pozitivno povezanost.
> Korelacija meri povezanost. Da vaja izboljša ocene, bi pokazal šele poskus z naključno razporeditvijo v skupine.

:::simboli
x | posamezna meritev (npr. srčni utrip) |  | /min
\bar{x} | povprečje meritev | \bar{x} = \frac{\sum x_i}{n} | /min
n | število meritev (velikost vzorca) | | –
s | standardni odklon | s = \sqrt{\dfrac{\sum (x_i - \bar{x})^2}{n - 1}} | /min | tipična razdalja meritve od povprečja
s_1, s_2 | standardna odklona obeh skupin | | /min
n_1, n_2 | števili meritev v obeh skupinah | | –
\bar{x}_1, \bar{x}_2 | povprečji obeh skupin | | /min
\mathrm{SE} | standardna napaka | \mathrm{SE} = \dfrac{s}{\sqrt{n}} | /min | koliko se povprečje tipično premakne od vzorca do vzorca
\mathrm{SE}_r | standardna napaka razlike | \mathrm{SE}_r = \sqrt{\dfrac{s_1^2}{n_1} + \dfrac{s_2^2}{n_2}} | /min | r pomeni razliko, ne korelacije
t | testna statistika t | t = \dfrac{\bar{x}_1 - \bar{x}_2}{\mathrm{SE}_r} | – | koliko standardnih napak sta povprečji narazen
E | pričakovano število v kategoriji | E = \text{delež} \cdot \text{skupno število} | – | napove ga ničelna hipoteza
O | opaženo število v kategoriji | | –
\chi | hi-kvadrat (testna statistika χ²) | \chi^2 = \sum \dfrac{(O - E)^2}{E} | – | večja odstopanja dajo večji χ²
k | število kategorij | | – | stopinje prostosti so k − 1
:::
