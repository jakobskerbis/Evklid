---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

»S to pijačo boš skočila pet centimetrov višje,« je Niki rekla soigralka. Nika trenira odbojko in trener ji je naročil, da mora pri bloku skočiti višje. Pijača je draga: steklenica stane toliko kot polovica njene tedenske žepnine.

Naslednji dan Nika pred treningom spije pijačo. Obuje tudi nove copate in se ogreva dvakrat dlje kot običajno. Ob steni skoči enkrat in oznaka je res $4\,\text{cm}$ višje kot prejšnji teden. »Pijača deluje!«

Ali naj Nika odslej kupuje pijačo? Še ne ve. Na podobna vprašanja odgovarjajo znanstveniki vsak dan: ali zdravilo pomaga, ali gnojilo poveča pridelek, ali vadba izboljša vzdržljivost. Odgovor dobijo z dobro načrtovanim poskusom. Kakšen bi moral biti Nikin?

## Razlaga

Nikin sklep se zdi logičen: nekaj je spremenila in rezultat je boljši. A v njenem »poskusu« sta skriti dve napaki.

**Napaka 1: spremenila je tri stvari hkrati.** Pijačo, copate in ogrevanje. Višji skok je lahko posledica katerekoli od njih ali vseh skupaj. Iz enega rezultata tega ne razbereš.

**Napaka 2: skočila je le enkrat.** Če skočiš desetkrat, vsak skok ni enako visok. Enkrat si bolj spočit, drugič se slabše odrineš. Razlika $4\,\text{cm}$ je lahko samo naključje.

Popravimo poskus korak za korakom.

**Raziskovalno vprašanje.** Dober poskus se začne z vprašanjem, na katero lahko odgovorimo z merjenjem. »Ali je pijača dobra?« ni tako vprašanje, saj ne vemo, kaj bi merili. Boljše je: »Ali pijača X pred treningom poveča višino Nikinega skoka?« Vprašanje omenja eno stvar, ki jo spreminjamo, in eno, ki jo merimo.

**Spremenljivke.** Spremenljivka je vse, kar se v poskusu lahko spreminja. Ločimo tri vrste:

| Vrsta | Pomen | Pri Niki |
|---|---|---|
| neodvisna spremenljivka | to *mi* spreminjamo | pijača X ali voda |
| odvisna spremenljivka | to *merimo* | višina skoka v cm |
| kontrolirani pogoji | ostanejo enaki | copati, ogrevanje, ura, spanec |

Neodvisno spremenljivko spreminjamo namerno. Odvisna je »odvisna« od nje: ko spremenimo prvo, opazujemo, ali se spremeni druga. Vse drugo držimo enako, da na rezultat vpliva le neodvisna spremenljivka.

Del poskusa, kjer neodvisne spremenljivke ne spremenimo (Nika pije vodo), je **kontrolni poskus**. Z njim primerjamo rezultat s pijačo.

:::premisli
Nika na dan s pijačo skače v telovadnici, na dan z vodo pa na igrišču na pesku. Zakaj iz rezultata ne bo mogla sklepati o pijači?
---
Ker se je poleg pijače spremenila še podlaga. Na pesku se slabše odrineš, zato bi bil skok z vodo nižji tudi, če pijača ne bi imela nobenega učinka. Podlaga bi morala biti kontroliran pogoj.
:::

**Ponovljivost.** Nika zdaj vsakič skoči trikrat:

| Skok | Voda [cm] | Pijača X [cm] |
|---|---|---|
| 1. | 42 | 43 |
| 2. | 44 | 41 |
| 3. | 40 | 45 |
| povprečje | 42 | 43 |

**Povprečje** dobimo tako, da meritve seštejemo in vsoto delimo s številom meritev. Razlika povprečij je le $1\,\text{cm}$, posamezni skoki pa nihajo kar za $4\,\text{cm}$. Tako majhno razliko lahko povzroči že naključje, zato ne moremo trditi, da pijača pomaga. Več ponovitev bi dalo zanesljivejši odgovor.

Poskus je **ponovljiv**, če ga lahko kdo drug izvede po istem opisu in dobi podoben rezultat. Zato natančno zapišemo, kaj smo naredili. In zato en sam poskus nikoli ne zadošča za trden sklep.

**Graf.** Ko neodvisno spremenljivko spreminjamo v več korakih, rezultate narišemo. Na vodoravno os nanesemo neodvisno spremenljivko, na navpično pa odvisno.

Nika na tekalni stezi meri srčni utrip pri različnih hitrostih teka: pri $6\,\text{km/h}$ ima $100$ udarcev na minuto, pri $8\,\text{km/h}$ $120$, pri $10\,\text{km/h}$ $140$. Točke ležijo na premici. Pri enakem povečanju hitrosti se utrip vsakič poveča za enako ($20$). Taki odvisnosti rečemo **linearna**.

:::premisli
Kolikšen utrip napoveš pri $12\,\text{km/h}$, če odvisnost ostane linearna? Napovej, preden pogledaš.
---
$160$ udarcev na minuto: vsaka $2\,\text{km/h}$ več prinese $20$ udarcev več.
:::

Mnogo odvisnosti v biologiji ni linearnih. Takim rečemo **nelinearne**: točke ne ležijo na premici, ampak na krivulji. Primer so **encimi**, beljakovine, ki v telesu pospešijo kemijske reakcije, na primer razgradnjo hrane.

V simulaciji spodaj »Poskus: temperatura in delovanje encima« spreminjaj temperaturo od $10\,^\circ\text{C}$ do $70\,^\circ\text{C}$. Opazi: hitrost reakcije najprej narašča, okoli telesne temperature je največja, nato hitro pade. Krivulja ima vrh, zato odvisnost ni linearna. V drugi simulaciji, »Spremenljivke pri poskusu«, razvrsti dele poskusa s kvasovkami med neodvisno, odvisno spremenljivko in kontrolirane pogoje.

## Rešeni primeri

### Primer 1: reakcija z ravnilom

Jan želi vedeti, ali glasna glasba upočasni reakcijo. Prijatelj spusti ravnilo, Jan ga ujame med palcem in kazalcem in odčita, koliko centimetrov je ravnilo padlo. Enkrat meri v tišini, enkrat ob glasni glasbi. Vsakič uporabi isto ravnilo, isto roko in istega prijatelja. Določi spremenljivke.

**Podatki:** spreminja se glasba (tišina ali glasna glasba); meri se razdalja padca ravnila v cm; enaki ostanejo ravnilo, roka in prijatelj
**Iščemo:** neodvisno in odvisno spremenljivko ter kontrolirane pogoje

:::formula
neodvisna = kar spreminjamo; odvisna = kar merimo; kontrolirani pogoji = vse drugo, kar ostane enako
:::

**Rešitev:**

1. Jan namerno spreminja glasbo, zato je glasba neodvisna spremenljivka.
2. Meri razdaljo padca ravnila, zato je to odvisna spremenljivka. Daljša razdalja pomeni počasnejšo reakcijo.
3. Ravnilo, roka in prijatelj ostanejo enaki, zato so kontrolirani pogoji. Merjenje v tišini je kontrolni poskus.
4. Odgovor: neodvisna spremenljivka je glasba, odvisna razdalja padca ravnila, kontrolirani pogoji pa ravnilo, roka in prijatelj.

### Primer 2: povprečje ponovitev

Jan vsako različico ponovi trikrat. V tišini ravnilo pade $18\,\text{cm}$, $22\,\text{cm}$ in $20\,\text{cm}$, ob glasbi $25\,\text{cm}$, $21\,\text{cm}$ in $23\,\text{cm}$. Za koliko se povprečja razlikujejo in kaj lahko sklepa?

**Podatki:** tišina: $18$, $22$, $20\,\text{cm}$; glasba: $25$, $21$, $23\,\text{cm}$
**Iščemo:** povprečji, njuno razliko in sklep

:::formula
$\text{povprečje} = \dfrac{\text{vsota meritev}}{\text{število meritev}}$
:::

**Rešitev:**

1. Tišina: $\dfrac{18 + 22 + 20}{3} = \dfrac{60}{3} = 20\,\text{cm}$.
2. Glasba: $\dfrac{25 + 21 + 23}{3} = \dfrac{69}{3} = 23\,\text{cm}$.
3. Razlika: $23 - 20 = 3\,\text{cm}$. Ob glasbi je ravnilo v povprečju padlo dlje, torej je bila reakcija počasnejša.
4. Posamezne meritve nihajo za do $4\,\text{cm}$, kar je več od razlike. Sklep je zato previden.
5. Odgovor: povprečji se razlikujeta za $3\,\text{cm}$. Rezultat nakazuje, da glasba upočasni reakcijo, za trden sklep pa potrebuje več ponovitev.

### Primer 3: utrip po teku

Tina po teku vsako minuto izmeri srčni utrip (v udarcih na minuto): ob koncu teka $160$, po $1$ minuti $130$, po $2$ minutah $115$, po $3$ minutah $107$, po $4$ minutah $103$. Je odvisnost utripa od časa linearna? Sošolec pravi: »V prvi minuti je padel za 30, torej bo po 6 minutah $160 - 6 \cdot 30$.« Ima prav?

**Podatki:** čas $0$, $1$, $2$, $3$, $4\,\text{min}$; utrip $160$, $130$, $115$, $107$, $103$ udarcev na minuto
**Iščemo:** ali je odvisnost linearna in ali sošolčeva napoved drži

:::formula
Odvisnost je linearna, če se pri enakih korakih neodvisne spremenljivke odvisna spremeni vsakič za enako.
:::

**Rešitev:**

1. Izračunamo spremembe v vsaki minuti: $160 - 130 = 30$, $130 - 115 = 15$, $115 - 107 = 8$, $107 - 103 = 4$.
2. Spremembe niso enake, ampak se manjšajo. Odvisnost je nelinearna: utrip pada najprej hitro, nato vedno počasneje.
3. Sošolčeva napoved: $160 - 6 \cdot 30 = -20$. Negativnega utripa ni, zato napoved ne more biti pravilna.
4. Odgovor: odvisnost je nelinearna. Sošolec se moti, ker je nelinearno odvisnost obravnaval kot linearno; utrip se bo približal vrednosti v mirovanju.

### Primer 4: zdaj ti

Rok med treningom nogometa tehta, koliko vode izgubi z znojenjem. Po $20$ minutah je izgubil $300\,\text{g}$, po $40$ minutah $600\,\text{g}$, po $60$ minutah $900\,\text{g}$. Koliko vode bi izgubil v $50$ minutah, če odvisnost ostane linearna?

**Podatki:** $20\,\text{min}$: $300\,\text{g}$; $40\,\text{min}$: $600\,\text{g}$; $60\,\text{min}$: $900\,\text{g}$; iskani čas $50\,\text{min}$
**Iščemo:** izguba vode po $50\,\text{min}$

:::formula
izguba v minuti $= \dfrac{\text{izguba}}{\text{čas}}$, nato izguba $=$ izguba v minuti $\cdot$ čas
:::

**Rešitev:**

1. Vsakih $20$ minut izgubi $300\,\text{g}$ več, zato je odvisnost linearna.
2. V eni minuti: $\dfrac{300\,\text{g}}{20\,\text{min}} = 15\,\text{g/min}$.
3. Izračunaj sam, nato preveri:

:::premisli
Koliko vode izgubi v $50$ minutah?
---
$15\,\text{g/min} \cdot 50\,\text{min} = 750\,\text{g}$, kar je približno tri četrt litra. Toliko naj bi med treningom tudi popil.
:::

## Pogoste napake

- **Več sprememb hkrati.** »Spremenim vse, kar bi lahko pomagalo, pa bo rezultat hitreje boljši.« Res je morda boljši, a ne veš, zakaj. Spreminjaj eno stvar, vse drugo naj ostane enako.
- **Ena meritev zadošča.** Vsaka meritev malo niha. En sam rezultat je lahko naključje. Ponovi meritev večkrat in izračunaj povprečje.
- **Zamenjava spremenljivk.** Neodvisna je tista, ki jo *ti* izbereš, odvisna tista, ki jo *izmeriš*. Na grafu gre neodvisna na vodoravno os. Če osi zamenjaš, graf napačno pokaže, kaj je od česa odvisno.
- **Vsaka odvisnost je linearna.** Če prva dva koraka prineseta enako spremembo, to še ne pomeni, da se bo tako nadaljevalo. Izračunaj spremembe na vseh korakih in preveri, ali so enake.
- **»Poskus ni uspel, ker ni potrdil napovedi.«** Tudi rezultat »pijača ne pomaga« je odgovor na vprašanje. Poskus je neuspešen le, če je slabo načrtovan.

## Povzetek

- Poskus se začne z raziskovalnim vprašanjem, na katero odgovorimo z merjenjem.
- Neodvisna spremenljivka je tisto, kar spreminjamo; odvisna tisto, kar merimo; kontrolirani pogoji ostanejo enaki. Kontrolni poskus služi za primerjavo.
- Meritve ponovimo in izračunamo povprečje; poskus je ponovljiv, če ga drugi po opisu izvedejo s podobnim rezultatom.
- Na grafu je neodvisna spremenljivka na vodoravni osi, odvisna na navpični.
- Linearna odvisnost: pri enakih korakih enake spremembe, točke na premici. Nelinearna: spremembe različne, točke na krivulji (utrip po teku, encim in temperatura).

## Drugače: Kot zgodba

Nika je razočarana, a ne obupa. S trenerjem se dogovorita za pravi poskus.

Dva tedna bo vsak torek in četrtek skakala ob steni v telovadnici, ob isti uri in v istih copatih. Ogrevanje bo trajalo vedno deset minut. Trener ji pred skoki da plastenko, na kateri ni napisa. Nika ne ve, ali je v njej pijača X ali voda z enakim okusom. Tako njeno pričakovanje ne vpliva na skok.

Vsakič skoči petkrat. Trener vpisuje višine. Po dveh tednih imata pri vsaki pijači po deset skokov. Povprečji se razlikujeta za manj kot centimeter.

»Kaj pa soigralka?« vpraša Nika. »Njej je pomagalo.« Trener se nasmehne: »Ali je kdaj skočila brez pijače pod enakimi pogoji?« Nika ugotovi, da odgovor pozna. Žepnino porabi za nove štulpe.

## Drugače: Korak za korakom s številkami

Recept za poskus, na primeru »Ali ogrevanje vpliva na število sklec v eni minuti?«:

1. **Vprašanje:** ena neodvisna spremenljivka (ogrevanje: $0$ ali $10$ minut), ena odvisna (število sklec v $1$ minuti).
2. **Kontrolirani pogoji:** ista oseba, ista ura, enak počitek pred začetkom.
3. **Ponovitve:** vsako različico izvedeš trikrat, na različne dni. Brez ogrevanja: $20$, $22$, $21$ sklec. Z ogrevanjem: $24$, $23$, $25$ sklec.
4. **Povprečje:** brez ogrevanja $\dfrac{63}{3} = 21$, z ogrevanjem $\dfrac{72}{3} = 24$.
5. **Primerjava:** razlika $24 - 21 = 3$ sklece. Meritve v vsaki skupini nihajo le za $2$, skupini se ne prekrivata.
6. **Sklep:** ogrevanje je pri tej osebi povečalo število sklec. Da velja splošno, bi poskus ponovili z več osebami.

## Preveri se

? Poskus: »Ali temperatura vode vpliva na število mehurčkov, ki jih naredijo kvasovke?« Kaj od naštetega **ni** kontroliran pogoj?
- masa kvasa v vsaki epruveti
~ Masa kvasa mora biti povsod enaka, sicer ne veš, ali je več mehurčkov zaradi temperature ali zaradi več kvasa.
- količina sladkorja
~ Sladkor je hrana kvasovk. Če ga je ponekod več, rezultat ni odvisen le od temperature.
+ temperatura vode
- prostornina vode
~ Prostornina mora biti enaka, sicer je sladkor ponekod bolj razredčen kot drugje.
> Temperaturo vode namerno spreminjamo, zato je neodvisna spremenljivka. Vse drugo ostane enako.

? Zakaj meritev v poskusu ponovimo večkrat?
- Da dobimo večji rezultat.
~ Ponavljanje ne poveča rezultata; povprečje je lahko tudi manjše od prve meritve.
+ Ker posamezne meritve nihajo; povprečje več meritev je zanesljivejše.
- Da potrdimo svojo napoved.
~ Poskus ne sme biti narejen tako, da potrdi napoved. Rezultat je lahko tudi drugačen od pričakovanega.
> Ena meritev je lahko naključno višja ali nižja. Pri več ponovitvah se naključne razlike izravnajo.

? Luka preverja, ali kofein poveča število zadetkov pri metu na koš. Kateri korak njegovega načrta je napačen?
- 1. korak: vprašanje »Ali kofein poveča število zadetkov od 20 metov?«
~ To je dobro vprašanje: ena spremenljivka, ki jo spreminjamo, in ena, ki jo merimo.
- 2. korak: en dan pije čaj s kofeinom, drugi dan čaj brez kofeina.
~ To je pravilno: čaj brez kofeina je kontrolni poskus.
+ 3. korak: s kofeinom meče z žogo za odrasle, brez kofeina z manjšo, lažjo žogo.
- 4. korak: vsak dan meče trikrat po 20 metov in izračuna povprečje.
~ Ponovitve in povprečje so pravilen korak.
> Žoga bi morala biti kontroliran pogoj. Ker se spremeni, ne vemo, ali je razlika zaradi kofeina ali zaradi žoge.

? Ema izmeri, koliko sekund zdrži v planku: $31$, $35$, $33$ in $37\,\text{s}$. Kolikšno je povprečje?
- $136\,\text{s}$
~ To je vsota. Deliti jo moraš še s številom meritev, $4$.
+ $34\,\text{s}$
- $33\,\text{s}$
~ $33$ je le ena od meritev. Povprečje upošteva vse štiri.
> $\dfrac{31 + 35 + 33 + 37}{4} = \dfrac{136}{4} = 34\,\text{s}$.

? Trener meri, kako hitro igralci pretečejo $30\,\text{m}$ po različno dolgem treningu. Po prvem tednu se čas skrajša za $0{,}3\,\text{s}$, po drugem še za $0{,}1\,\text{s}$, po tretjem še za $0{,}05\,\text{s}$. Kakšna je odvisnost časa od števila tednov treninga?
- linearna, ker se čas vsak teden skrajša
~ Pri linearni odvisnosti bi se čas vsak teden skrajšal za *enako*. Tu so spremembe vse manjše.
+ nelinearna, ker se izboljšanje iz tedna v teden manjša
- ni je mogoče določiti brez grafa
~ Graf pomaga, a dovolj je primerjati spremembe na enakih korakih: $0{,}3$; $0{,}1$ in $0{,}05\,\text{s}$ niso enake.
> Spremembe na enakih korakih niso enake, zato točke ne ležijo na premici: odvisnost je nelinearna.

:::simboli
\text{povprečje} | povprečje meritev | \text{povprečje} = \dfrac{\text{vsota meritev}}{\text{število meritev}} | | v isti enoti kot meritve (cm, s)
\text{vsota meritev} | vsota vseh meritev | | | v isti enoti kot meritve
\text{število meritev} | število meritev (ponovitev) | | –
\text{izguba} | izguba vode z znojenjem | \text{izguba} = (\text{izguba v minuti}) \cdot \text{čas} | g | izguba v minuti je $\dfrac{\text{izguba}}{\text{čas}}$, npr. 15 g/min
\text{čas} | čas treninga | | min
:::
