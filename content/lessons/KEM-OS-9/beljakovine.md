---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nika igra violino. Teden pred šolskim koncertom je inštrument začel brenčati pri vsakem močnejšem tonu. Violinar Tomaž ga je pogledal in takoj našel vzrok: na robu se je zgornja plošča odlepila od stranice. Za popravilo ni vzel lepila iz trgovine. Iz omarice je vzel rjava zrnca **kožnega kleja**, jih namočil v vodo in lonček postavil v vodno kopel.

»Klej mora biti topel, nikoli pa ne sme zavreti,« je rekel. »In čez trideset let ga bo nekdo s toploto in vlago spet raztopil, ko bo violino odpiral za popravilo.«

Nika je ugotovila še nekaj. Njene strune so iz ovčjih črev, žima na loku je konjska dlaka, klej je narejen iz živalske kože. Vse to je iz iste vrste snovi: iz **beljakovin**. Ko razumeš, kako so beljakovine zgrajene, razumeš tudi, zakaj klej drži, zakaj ga ne smeš kuhati in zakaj je beljak po kuhanju trd.

## Razlaga

**Najprej en sam primer: trije glicini.** Glicin $\mathrm{H_2NCH_2COOH}$ je najpreprostejša aminokislina, $M = 75\,\text{g/mol}$. Že poznaš peptidno vez: skupina $\mathrm{{-}COOH}$ ene aminokisline se poveže s skupino $\mathrm{{-}NH_2}$ druge, pri tem odide molekula vode. Povežimo tri glicine:

$$\mathrm{H_2N{-}CH_2{-}CO{-}NH{-}CH_2{-}CO{-}NH{-}CH_2{-}COOH}$$

Preštej: med tremi glicini sta **dve** peptidni vezi $\mathrm{{-}CO{-}NH{-}}$. Zato sta odšli dve molekuli vode ($M = 18\,\text{g/mol}$). Molska masa verige:

$$M = 3 \cdot 75 - 2 \cdot 18 = 189$$

Veriga ima torej $189\,\text{g/mol}$, ne $225\,\text{g/mol}$.

**Posplošimo.** Aminokisline v verigi so kot členi verižice: med dvema sosednjima je vedno ena vez. Pri $n$ aminokislinah je vezi in molekul vode za eno manj:

$$N = n - 1$$

Kratki verigi (do približno 50 aminokislin) rečemo **peptid**. Dolgi verigi s sto, tisoč ali več aminokislinami rečemo **beljakovina**.

:::premisli
Koliko molekul vode odide, ko nastane ena veriga iz $100$ aminokislin? In koliko, če iz istih $100$ aminokislin nastaneta dve ločeni verigi po $50$? Najprej napovej, nato preveri s pravilom.
---
Pri eni verigi $99$. Prva aminokislina se veže z drugo, druga s tretjo in tako naprej do zadnje. Vezi je vedno za eno manj kot členov, tako kot je pri treh glicinih nastalo dvoje vezi. Pri dveh verigah $49 + 49 = 98$: vsaka veriga ima svoj začetek in konec, med obema verigama pa ni vezi.
:::

V simulaciji spodaj »Beljakovine iz aminokislin« sestavi verigo iz štirih aminokislin. Štej molekule vode, ki odidejo, in jih primerjaj s številom členov.

**Zaporedje.** V beljakovinah je $20$ različnih aminokislin. Beljakovine se med sabo razlikujejo po tem, katere aminokisline imajo, koliko jih je in v kakšnem **zaporedju** si sledijo. Že ena zamenjana aminokislina lahko spremeni, kako beljakovina deluje.

**Oblika.** Dolga veriga ne leži ravno. Zvije se v vijačnico, se zloži in se zvije v klobčič. Ta prostorska **oblika** je za beljakovino nujna: encim deluje le, če ima pravo obliko, kot ključ deluje le s pravimi zobci. Narisano z besedami (Gly je okrajšava za glicin, Ala za alanin, Ser za serin):

```
zaporedje:  Gly–Ala–Gly–Ser–…   (kot niz kroglic)
oblika:     niz se zvije v vijačnico, ta v klobčič
```

**Denaturacija.** Pri segrevanju, v kislini, v bazi, v alkoholu ali s solmi težkih kovin (npr. bakra, svinca) beljakovina izgubi svojo obliko. Temu rečemo **denaturacija**. Peptidne vezi pri tem ostanejo, zaporedje ostane, spremeni se le zvitje. Tako se beljak pri kuhanju strdi in pobeli. Večinoma je denaturacija nepovratna.

:::premisli
Kuhano jajce se ne vrne v surovo, ko se ohladi. Zakaj ne, če pa so vse peptidne vezi ostale cele?
---
Ker se odvite verige med kuhanjem prepletejo in zlepijo med sabo, ne s pravimi deli lastne verige. Zaporedje je enako, prava oblika pa se ne vzpostavi več sama od sebe.
:::

**Hidroliza.** Pri prebavi (ali pri dolgem kuhanju v vodi) se peptidne vezi trgajo, ob vsaki se veže molekula vode. Iz beljakovine nastanejo krajše verige in na koncu aminokisline. To je obrat nastanka verige, tako kot pri škrobu.

**Zdaj razumeš Tomaža.** Klej je raztopljen kolagen iz kože. Dolge verige se med sušenjem prepletejo in trdno držijo les skupaj. Če klej znova in znova kuhaš, se verige s hidrolizo trgajo na krajše kose, ti pa se slabše prepletajo, zato klej drži slabše.

**Pomen.** Beljakovine opravljajo v telesu zelo različne naloge:

| vloga | beljakovina | kaj dela |
|---|---|---|
| gradbena | kolagen, keratin | kite, koža; lasje, nohti, žima |
| gibanje | mišične beljakovine | krčijo mišice |
| encimi | amilaza v slini | pospeši razgradnjo škroba |
| prenos | hemoglobin | nosi kisik po krvi |
| hormoni | inzulin | uravnava glukozo v krvi |
| obramba | protitelesa | prepoznajo bakterije in viruse |

Beljakovine dobimo s hrano: meso, ribe, jajca, mleko, sir, fižol, soja. Telo jih s prebavo razgradi v aminokisline in iz njih sestavi svoje beljakovine. Devet aminokislin moramo dobiti s hrano, ker jih telo ne naredi samo. Imenujemo jih **esencialne aminokisline**. Kot vir energije dajo beljakovine približno $17\,\text{kJ/g}$, toliko kot ogljikovi hidrati.

**Dokaz.** Beljakovine dokažemo z **biuretnim reagentom**. To je modra raztopina natrijevega hidroksida in bakrovega sulfata. Če dodamo beljakovino, se raztopina obarva **vijolično**. Spomni se: jodovica dokaže škrob (temno modro), Fehlingov reagent glukozo (opečnato rdeča oborina).

## Rešeni primeri

### Primer 1 (lažji): štetje vezi

Peptid ima $12$ aminokislin v eni verigi. Koliko peptidnih vezi ima in koliko molekul vode je odšlo, ko je nastal?

**Podatki:** število aminokislin $n = 12$, ena veriga
**Iščemo:** število peptidnih vezi $N$ in število molekul vode

:::formula
$N = n - 1$; pri vsaki vezi odide ena molekula vode.
:::

**Rešitev:**

1. Vezi so samo med sosednjima aminokislinama, zato jih je za eno manj kot členov: $N = 12 - 1 = 11$.
2. Vsaka vez je sprostila eno molekulo vode, torej je odšlo $11$ molekul vode.
3. Odgovor: peptid ima $11$ peptidnih vezi; pri nastanku je odšlo $11$ molekul vode.

### Primer 2: molska masa tetrapeptida

Štirje glicini se povežejo v eno verigo. Kolikšna je njena molska masa? Glicin ima $M = 75\,\text{g/mol}$, voda $18\,\text{g/mol}$.

**Podatki:** $n = 4$, $M(\text{glicin}) = 75\,\text{g/mol}$, $M(\mathrm{H_2O}) = 18\,\text{g/mol}$
**Iščemo:** molsko maso verige $M$

:::formula
$M = n \cdot 75\,\text{g/mol} - (n - 1) \cdot 18\,\text{g/mol}$
:::

**Rešitev:**

1. Štirje glicini skupaj: $4 \cdot 75 = 300$, torej $300\,\text{g/mol}$.
2. Vezi so $4 - 1 = 3$, zato odidejo tri molekule vode: $3 \cdot 18 = 54$, torej $54\,\text{g/mol}$.
3. Odštejemo, ker voda ni več del verige: $300 - 54 = 246$.
4. Odgovor: veriga štirih glicinov ima molsko maso $246\,\text{g/mol}$.

### Primer 3 (težji): malica pred nastopom

Pevka pred koncertom poje $150\,\text{g}$ skute. Masni delež beljakovin v skuti je $12\,\%$. Koliko energije dobi iz beljakovin? Beljakovine dajo $17\,\text{kJ/g}$.

**Podatki:** $m_\text{s} = 150\,\text{g}$, $w = 12\,\% = 0{,}12$, $e = 17\,\text{kJ/g}$
**Iščemo:** energijo iz beljakovin $E$

:::formula
$m = w \cdot m_\text{s}$, nato $E = m \cdot e$
:::

**Rešitev:**

1. Najprej masa beljakovin, saj skuta ni čista beljakovina: $m = 0{,}12 \cdot 150\,\text{g} = 18\,\text{g}$.
2. Vsak gram da $17\,\text{kJ}$: $E = 18\,\text{g} \cdot 17\,\text{kJ/g} = 306\,\text{kJ}$.
3. Odgovor: iz beljakovin v skuti dobi pevka $306\,\text{kJ}$ energije.

### Primer 4 – zdaj ti: koliko členov?

Veriga, zgrajena samo iz glicinov, ima molsko maso $360\,\text{g/mol}$. Iz koliko glicinov je?

**Podatki:** $M = 360\,\text{g/mol}$, $M(\text{glicin}) = 75\,\text{g/mol}$, $M(\mathrm{H_2O}) = 18\,\text{g/mol}$
**Iščemo:** število glicinov $n$

:::formula
$M = n \cdot 75\,\text{g/mol} - (n - 1) \cdot 18\,\text{g/mol}$
:::

**Rešitev:**

1. Vsak glicin prinese $75$, vsaka vez odnese $18$. Odpravimo oklepaj: $75n - 18(n - 1) = 75n - 18n + 18 = 57n + 18$.
2. Zapišemo enačbo $57n + 18 = 360$, ker mora biti masa verige $360\,\text{g/mol}$.
3. Izračunaj $n$ sam, nato preveri rezultat z vstavljanjem.

:::premisli
Koliko glicinov je v verigi?
---
$57n = 360 - 18 = 342$, torej $n = 342 : 57 = 6$. Preizkus: $6 \cdot 75 - 5 \cdot 18 = 450 - 90 = 360$. Veriga ima $6$ glicinov.
:::

## Pogoste napake

- **»Molekul vode je toliko kot aminokislin.«** Učenec pri $12$ aminokislinah odšteje $12$ molekul vode. A voda odide le pri vezi, vezi pa je ena manj kot členov. Pravilno: $N = n - 1$.
- **Pozabljena voda.** Molsko maso verige izračuna kot vsoto aminokislin ($4 \cdot 75 = 300\,\text{g/mol}$). Atomi, ki so odšli kot voda, niso več v verigi. Od vsote odštej $(n - 1) \cdot 18\,\text{g/mol}$.
- **»Pri kuhanju beljakovina razpade na aminokisline.«** Kuhanje beljaka verig ne pretrga, spremeni le njihovo obliko (denaturacija). Razpad na aminokisline je hidroliza, ki poteka pri prebavi.
- **»Beljakovine so le za mišice.«** Mišice so samo ena od nalog. Encimi, hemoglobin, inzulin in protitelesa so prav tako beljakovine.
- **Zamenjani dokazi.** Vijolična barva z biuretnim reagentom pomeni beljakovine. Temno modra z jodovico pomeni škrob, opečnato rdeča oborina s Fehlingovim reagentom glukozo.

## Povzetek

- Beljakovine so dolge verige aminokislin, povezanih s peptidnimi vezmi $\mathrm{{-}CO{-}NH{-}}$; kratke verige so peptidi.
- Pri $n$ aminokislinah nastane $n - 1$ vezi in odide $n - 1$ molekul vode; $M = 75n - 18(n-1)$ za verigo glicinov.
- Beljakovino določata zaporedje $20$ različnih aminokislin in prostorska oblika (vijačnica, klobčič).
- Denaturacija (toplota, kisline, baze, alkohol, soli težkih kovin) uniči obliko, vezi ostanejo; hidroliza (prebava) pretrga vezi do aminokislin.
- Pomen: gradbene (kolagen, keratin), mišične, encimi, prenos (hemoglobin), hormoni (inzulin), obramba (protitelesa); energija $\approx 17\,\text{kJ/g}$.
- Dokaz: biuretni reagent se z beljakovinami obarva vijolično.

## Drugače: Z analogijo

Beljakovina je kot melodija.

- **Aminokisline so toni.** Na voljo je $20$ različnih, tako kot ima glasbenik na voljo omejeno število tonov.
- **Zaporedje je melodija.** Isti toni v drugem vrstnem redu dajo drugo pesem. Iste aminokisline v drugem zaporedju dajo drugo beljakovino. Če v pesmi zamenjaš en sam ton, jo poslušalec takoj sliši drugače.
- **Oblika je kot pravilno navit kabel za mikrofon.** Lepo zvit kabel zavzame malo prostora in se brez težav odvije. Če ga pustiš na vročem odru in se zaplete v vozle, žica ostane ista in cela, uporaben pa ni več. To je denaturacija.
- **Hidroliza je kot rezanje kabla na koščke.** Takrat žica res ni več cela.

Analogija ima mejo: tonov ne povezuje nič, aminokisline pa so v verigi zares kemijsko vezane.

## Drugače: Bolj natančno

Kemiki opišejo zgradbo beljakovine na štirih ravneh:

1. **Primarna zgradba** je zaporedje aminokislin v verigi.
2. **Sekundarna zgradba** so ponavljajoči se vzorci, na primer vijačnica ali nagubana ploskev. Držijo jih šibke vezi med skupinami $\mathrm{{-}CO{-}}$ in $\mathrm{{-}NH{-}}$ v isti verigi.
3. **Terciarna zgradba** je celotno zvitje verige v prostoru. Pri nekaterih beljakovinah (inzulin, keratin v laseh) dele verig povezujejo še žveplovi mostovi.
4. **Kvartarna zgradba** je povezava več verig. Hemoglobin ima štiri verige.

Denaturacija poruši drugo, tretjo in četrto raven, prva ostane. Kako pomembna je prva raven, kaže srpastocelična anemija: v dveh od štirih verig hemoglobina (vsaka od teh ima $146$ aminokislin) je zamenjana ena sama. Rdeče krvničke so zato srpaste in slabše prenašajo kisik.

Biuretni reagent se obarva z verigami, ki imajo vsaj dve peptidni vezi. Posamezne aminokisline vijolične barve ne dajo.

## Preveri se

? Katera snov **ne** spada med ostale?
- keratin
~ Keratin je beljakovina las, nohtov in konjske žime na loku, čeprav ga ne jemo.
- kolagen
~ Kolagen je beljakovina kože in kit; iz njega je tudi kožni klej.
+ škrob
- hemoglobin
~ Hemoglobin je beljakovina v krvi, ki nosi kisik. Barvo ima, a je vseeno veriga aminokislin.
> Škrob je polisaharid iz glukoz. Keratin, kolagen in hemoglobin so beljakovine, verige aminokislin.

? Beljakovina ima eno verigo s $30$ aminokislinami. Koliko molekul vode je odšlo pri njenem nastanku?
- $30$
~ Voda odide pri vsaki vezi, ne pri vsaki aminokislini. Vezi je ena manj kot členov.
+ $29$
- $31$
~ Vezi so samo med sosednjimi členi; na koncih verige ni nobene dodatne vezi.
- $15$
~ To dobiš, če aminokisline razdeliš v ločene pare ($30 : 2$). V verigi se vsak člen veže z naslednjim, tudi drugi s tretjim.
> $N = n - 1 = 30 - 1 = 29$ peptidnih vezi, zato $29$ molekul vode.

? Beljak pri kuhanju postane bel in trd. Kaj se zgodi z beljakovinami v njem?
- Razpadejo na posamezne aminokisline.
~ To je hidroliza, ki poteka pri prebavi. Pri kuhanju jajca peptidne vezi ostanejo.
+ Spremeni se njihova oblika, zaporedje in peptidne vezi ostanejo.
- Spremenijo se v maščobe.
~ Iz beljakovine pri kuhanju ne nastane nova vrsta snovi, kot je ester glicerola.
- Iz verig izhlapi voda, zato se strdijo.
~ Strditev ne pride od izhlapevanja; tudi jajce v lupini se strdi, čeprav voda ne more ven.
> To je denaturacija: toplota poruši prostorsko obliko verig, te se prepletejo in strdijo. Vezi med aminokislinami ostanejo.

? Luka računa molsko maso verige iz petih glicinov. V katerem koraku se je zmotil?
1) $5 \cdot 75 = 375$, torej $375\,\text{g/mol}$.
2) Nastane $5$ peptidnih vezi.
3) Odide $5 \cdot 18 = 90$, torej $90\,\text{g/mol}$.
4) $M = 375 - 90 = 285$, torej $285\,\text{g/mol}$.
- v 1. koraku
~ Pet glicinov ima skupaj res $375\,\text{g/mol}$; napaka je pozneje.
+ v 2. koraku
- v 3. koraku
~ Račun $5 \cdot 18 = 90$ je pravilen, a že izhaja iz napačnega števila vezi.
- nikjer, rezultat je pravilen
~ Pri petih členih sta na koncih proste skupini, vezi so le med sosedi.
> Pri $5$ glicinih so le $4$ vezi. Pravilno: $375 - 4 \cdot 18 = 375 - 72 = 303$, torej $303\,\text{g/mol}$.

? Nika po napornem vadenju vpraša trenerja, zakaj mora jesti tudi jajca, mleko ali fižol, ne le kruh. Kaj je najboljši odgovor?
- Ker beljakovine dajo veliko več energije kot ogljikovi hidrati.
~ Beljakovine dajo približno $17\,\text{kJ/g}$, toliko kot ogljikovi hidrati. Njihov pomen ni v energiji.
+ Ker telo iz aminokislin v hrani gradi svoje beljakovine, nekaterih aminokislin pa samo ne naredi.
- Ker telo beljakovine iz hrane vgradi v mišice nespremenjene.
~ Telo beljakovine najprej s hidrolizo razgradi v aminokisline in iz njih sestavi svoje.
- Ker so beljakovine potrebne samo mišicam.
~ Beljakovine so tudi encimi, hormoni, protitelesa in hemoglobin, ne le mišice.
> Telo s prebavo dobi aminokisline in iz njih sestavlja svoje beljakovine. Devet aminokislin je esencialnih: dobimo jih lahko samo s hrano.

:::simboli
M | molska masa (aminokisline, vode ali verige) | M = n \cdot 75 - (n - 1) \cdot 18 | g/mol | relacija velja za verigo samih glicinov
n | število aminokislin v verigi | | –
N | število peptidnih vezi (in molekul vode) | N = n - 1 | –
m | masa beljakovin | m = w \cdot m_\text{s} | g
w | masni delež beljakovin v skuti | | –
m_\text{s} | masa skute | | g
E | energija iz beljakovin | E = m \cdot e | kJ
e | energijska vrednost beljakovin | | kJ/g | približno $17\,\text{kJ/g}$
:::
