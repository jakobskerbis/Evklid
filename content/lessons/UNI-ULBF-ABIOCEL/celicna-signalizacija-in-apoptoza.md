---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec po vajah trdi: »Zdravo telo svojih celic ne ubija. Če celica umre, je šlo nekaj narobe.« Zveni logično. Vendar se pri odraslem človeku vsak dan namerno, po natančnem programu, odstrani nekaj deset milijard celic. Prav zato imaš ločene prste in zato večina celic s poškodovano DNA ne postane rakavih.

Da celica »ve«, kdaj naj se deli, kdaj naj sprosti glukozo in kdaj naj umre, mora sprejemati sporočila od drugih celic. Večina teh sporočil v celico sploh ne vstopi: celica na površini zazna le njihov »dotik« in ga sama pretvori v dejanje. Ob koncu lekcije boš znal sošolcu odgovoriti s številkami.

## Razlaga

**Od prenosa snovi do prenosa sporočila.** Iz lekcije o bioloških membranah poznaš prenos snovi: glukoza ali ion **preide** membrano skozi kanal ali prenašalec. Pri signalizaciji je bistvena razlika ta, da membrano pogosto prestopi le **informacija**, molekula pa ostane zunaj.

| | Prenos snovi | Celična signalizacija |
|---|---|---|
| Kaj prečka membrano | sama molekula | navadno le informacija |
| Ključna beljakovina | kanal, prenašalec | **receptor** |
| Posledica | spremeni se koncentracija snovi | spremeni se delovanje celice |
| Ojačitev | ne | da, kaskada |

**Receptor** je beljakovina, ki prepozna točno določeno signalno molekulo (**ligand**) in se ob vezavi spremeni. Ligandi potujejo po krvi do oddaljenih celic (**endokrino**, hormoni), do sosednjih celic (**parakrino**), nazaj na celico, ki jih je izločila (**avtokrino**), ali po sinaptični reži (živčni prenašalci).

**Kje je receptor, odloča topnost liganda.** Lipofilne molekule, na primer steroidni hormoni (kortizol, estradiol), prehajajo fosfolipidni dvosloj. Njihovi **znotrajcelični receptorji** so v citoplazmi ali jedru in delujejo kot transkripcijski dejavniki: neposredno vklopijo ali izklopijo gene. Hidrofilni ligandi (adrenalin, inzulin, acetilholin) membrane ne prehajajo, zato potrebujejo **membranske receptorje**. Te delimo v tri skupine:

1. **Ionotropni receptorji** so kanali, ki se odprejo ob vezavi liganda. Acetilholin na skeletni mišici odpre kanal za $\mathrm{Na^+}$. Odziv traja milisekunde.
2. **Receptorji, sklopljeni z G-proteinom**, sedemkrat prečkajo membrano. Vezani ligand aktivira **G-protein**, beljakovino na notranji strani membrane, ki veže gvaninske nukleotide: ta zamenja GDP za GTP in vklopi naslednji encim.
3. **Receptorji z encimsko aktivnostjo**, na primer **receptorske tirozin-kinaze** (receptor za inzulin, za rastne dejavnike). Ob vezavi si same pripnejo fosfatne skupine (se **fosforilirajo**) in sprožijo verigo fosforilacij.

:::premisli
Kortizol in adrenalin sta oba hormona stresa. Kateri bo po vezavi na receptor hitreje spremenil delovanje celice in zakaj?
---
Adrenalin. Njegov membranski receptor prek G-proteina v sekundah spremeni aktivnost že obstoječih encimov. Kortizol deluje prek genov, zato mora celica najprej prepisati mRNA in sintetizirati nove beljakovine, kar traja ure.
:::

**Sekundarni obveščevalci.** Hidrofilni ligand je **prvi obveščevalec**: ostane zunaj. Znotraj celice sporočilo nosijo majhne molekule, **sekundarni obveščevalci**:

- **cAMP**: G-protein $\mathrm{G_s}$ aktivira encim **adenilat-ciklaza**, ki iz ATP naredi cAMP. Ta aktivira **protein-kinazo A** (PKA), ki fosforilira tarčne beljakovine. Protein $\mathrm{G_i}$ adenilat-ciklazo zavira.
- **IP₃ in DAG**: G-protein $\mathrm{G_q}$ aktivira **fosfolipazo C**, ki razcepi membranski fosfolipid v IP₃ in DAG. IP₃ sprosti $\mathrm{Ca^{2+}}$ iz endoplazemskega retikuluma, DAG skupaj s $\mathrm{Ca^{2+}}$ aktivira protein-kinazo C.
- **$\mathrm{Ca^{2+}}$** in **cGMP** sta dodatna pogosta obveščevalca.

Vsak korak kaskade aktivira veliko molekul naslednjega koraka, zato se signal **ojači**. Ker se števila na vsakem koraku množijo, iz ene molekule adrenalina nastanejo milijoni molekul glukoze. Signal mora tudi **ugasniti**: G-protein sam hidrolizira svoj GTP, **fosfodiesteraza** razgradi cAMP, **fosfataze** odstranijo fosfate.

**Od signala do smrti: apoptoza ob nekrozi.** Celica lahko umre na dva načina. Spet ju je najlaže razumeti iz razlik:

| | Nekroza | Apoptoza |
|---|---|---|
| Sproži jo | poškodba (ishemija, strup, opeklina) | signal, program |
| Celica | nabrekne, membrana poči | se skrči, membrana ostane cela |
| Vsebina | izteče v okolico | zaprta v apoptotska telesca |
| Vnetje | da | ne |

Apoptoza je **programirana celična smrt**, ki porablja ATP. Kromatin se zgosti, DNA se razreže na odseke, celica razpade na **apoptotska telesca**. Fosfatidilserin, fosfolipid, ki je sicer na notranji strani membrane, se obrne navzven in makrofagom sporoča »pojej me«. Okolica ne opazi ničesar.

Izvršilni encimi apoptoze so **kaspaze**, proteaze, ki razgradijo celične beljakovine. Sprožita jih dve poti:

- **Notranja (mitohondrijska) pot**: poškodba DNA aktivira **p53**. Ta najprej ustavi celični cikel (kontrolna točka v G1), pri prevelikih poškodbah pa vklopi beljakovine Bax. Mitohondrij sprosti **citokrom c**, ki z Apaf-1 sestavi **apoptosom**. Ta aktivira kaspazo 9, nato izvršilni kaspazi 3 in 7. Beljakovina **Bcl-2** pot zavira.
- **Zunanja pot**: ligand (na primer Fas-ligand na celici ubijalki) se veže na **receptor smrti** Fas na tarčni celici. Ta aktivira kaspazo 8, nato kaspazo 3.

Zunanja pot je torej celična signalizacija v najbolj dobesedni obliki: receptor, kaskada, odziv.

:::premisli
Rakava celica ima okvarjen gen za p53. Zakaj se kljub poškodovani DNA še naprej deli?
---
Brez p53 poškodba DNA ne ustavi cikla v G1 in ne sproži notranje poti apoptoze. Celica nima »stikala«, ki bi jo popravilo ali odstranilo, zato se poškodbe kopičijo v hčerinskih celicah.
:::

## Rešeni primeri

### Primer 1 (lažji): kam se veže ligand

Za štiri signalne molekule določi vrsto receptorja: estradiol (steroid), adrenalin na jetrni celici, acetilholin na skeletni mišici, inzulin.

**Podatki:** estradiol je lipofilen; adrenalin, acetilholin in inzulin so hidrofilni; acetilholin na mišici odpre kanal; inzulin aktivira kinazo
**Iščemo:** vrsto receptorja za vsako molekulo

:::formula
Lipofilen ligand → znotrajcelični receptor. Hidrofilen ligand → membranski receptor: kanal (ionotropni), G-protein ali encim.
:::

**Rešitev:**

1. Estradiol prehaja lipidni dvosloj, zato ima znotrajcelični receptor, ki deluje na gene.
2. Adrenalin na jetrih deluje prek receptorja, sklopljenega z G-proteinom, in cAMP.
3. Acetilholin na mišici odpre kanal: ionotropni receptor.
4. Inzulinski receptor je receptorska tirozin-kinaza, ker sam fosforilira.
5. Odgovor: estradiol – znotrajcelični, adrenalin – G-protein, acetilholin – ionotropni, inzulin – tirozin-kinaza.

### Primer 2: ojačitev kaskade

En aktiven receptor za adrenalin aktivira $10$ G-proteinov. Vsak aktivira eno adenilat-ciklazo, ki naredi $100$ molekul cAMP. Za vsako aktivno katalitično podenoto PKA sta potrebni $2$ molekuli cAMP. Vsaka podenota fosforilira $10$ encimov, vsak encim sprosti $1000$ molekul glukoza-1-fosfata. Koliko produkta nastane iz ene molekule adrenalina?

**Podatki:** $1$ receptor, $10$ G-proteinov na receptor, $100$ cAMP na ciklazo, $2$ cAMP na podenoto PKA, $10$ encimov na podenoto, $1000$ molekul produkta na encim
**Iščemo:** število molekul produkta $N$

:::formula
$N = 1 \cdot 10 \cdot 100 \cdot \dfrac12 \cdot 10 \cdot 1000$ (pri vsakem koraku množimo, pri porabi delimo)
:::

**Rešitev:**

1. Molekul cAMP: $1 \cdot 10 \cdot 100 = 1000$.
2. Aktivnih podenot PKA: $1000 / 2 = 500$, ker se po dve molekuli cAMP porabita za eno podenoto.
3. Fosforiliranih encimov: $500 \cdot 10 = 5000$.
4. Produkta: $5000 \cdot 1000 = 5\,000\,000$.
5. Odgovor: iz ene molekule adrenalina nastane okoli $5 \cdot 10^6$ molekul glukoza-1-fosfata. Kot snežna kepa, ki se po pobočju navzdol spremeni v plaz.

### Primer 3 (težji): ima sošolec prav?

Pri odraslem z apoptozo vsak dan odmre okoli $6 \cdot 10^{10}$ celic. Telo ima okoli $3 \cdot 10^{13}$ celic. Koliko celic odmre v vsaki sekundi in kolikšen delež telesa se zamenja v enem dnevu? Ali to podpira sošolčevo trditev?

**Podatki:** $N_\text{dan} = 6 \cdot 10^{10}$ celic, $N_\text{telo} = 3 \cdot 10^{13}$ celic, $1$ dan $= 86400\,\mathrm{s}$
**Iščemo:** število celic na sekundo in delež na dan

:::formula
celic na sekundo $= \dfrac{N_\text{dan}}{86400\,\mathrm{s}}$, $\qquad$ delež $= \dfrac{N_\text{dan}}{N_\text{telo}} \cdot 100\,\%$
:::

**Rešitev:**

1. Na sekundo: $\dfrac{6 \cdot 10^{10}}{86400\,\mathrm{s}} \approx 6{,}9 \cdot 10^{5}\,\mathrm{s^{-1}}$, torej skoraj $700\,000$ celic.
2. Delež na dan: $\dfrac{6 \cdot 10^{10}}{3 \cdot 10^{13}} = 0{,}002 = 0{,}2\,\%$.
3. Če bi bile to nekroze, bi telo stalno gorelo od vnetja. Ker ga ni, gre za tiho, programirano smrt, ki nadomešča stare celice v krvi in črevesju.
4. Odgovor: vsako sekundo odmre skoraj $700\,000$ celic, na dan $0{,}2\,\%$ telesa. Sošolec nima prav: apoptoza je del zdravega delovanja telesa.

### Primer 4 – zdaj ti

V celični kulturi dodajo Fas-ligand. Po eni uri se celice skrčijo, fosfatidilserin je na zunanji strani membrane, celice v okolici ne kažejo vnetja. Prva aktivna kaspaza je kaspaza 8. Za katero vrsto smrti gre in po kateri poti?

**Podatki:** sprožilec Fas-ligand, skrčenje celic, fosfatidilserin zunaj, brez vnetja, prva aktivna kaspaza 8
**Iščemo:** vrsto celične smrti in pot

:::formula
Skrčenje + cela membrana + brez vnetja → apoptoza. Receptor smrti + kaspaza 8 → zunanja pot; citokrom c + kaspaza 9 → notranja pot.
:::

**Rešitev:**

1. Skrčenje, obrnjen fosfatidilserin in odsotnost vnetja kažejo na apoptozo, ne na nekrozo.
2. Določi pot sam.

:::premisli
Katera pot apoptoze je bila sprožena in zakaj mitohondrij tu ni bil prvi korak?
---
Zunanja pot: Fas-ligand se je vezal na receptor smrti Fas, ta je aktiviral kaspazo 8, ki nato aktivira izvršilno kaspazo 3. Mitohondrij in kaspaza 9 tu nista bila prva.
:::

## Pogoste napake

- **»Hormon mora vstopiti v celico, da deluje.«** To velja le za lipofilne hormone. Adrenalin in inzulin ostaneta zunaj; v celico pride le informacija prek receptorja in sekundarnih obveščevalcev.
- **»Sekundarni obveščevalec je drug hormon, ki pride po krvi.«** Ne: nastane šele v celici (cAMP, IP₃, DAG, $\mathrm{Ca^{2+}}$), ko je receptor že aktiviran.
- **»Ojačitev pomeni, da vsak korak prišteje nekaj molekul.«** Števila po korakih se **množijo**, ne seštevajo. S seštevanjem dobiš nekaj tisoč namesto milijonov.
- **»Apoptoza je vedno znak bolezni.«** Apoptoza oblikuje prste med razvojem, odstrani avtoreaktivne limfocite in stare celice. Bolezen je pogosto ravno to, da apoptoza odpove (rak) ali je premočna (nevrodegeneracija).
- **»Apoptoza in nekroza sta isto, le različno hitro.«** Razlika ni v hitrosti, ampak v mehanizmu: apoptoza je nadzorovana, celica se skrči in ne povzroči vnetja; pri nekrozi celica poči in sproži vnetje.

## Povzetek

- Pri signalizaciji membrano navadno prečka informacija, ne molekula. Ligand se veže na specifičen receptor.
- Lipofilni ligandi (steroidi) imajo znotrajcelične receptorje, ki uravnavajo gene (počasi). Hidrofilni imajo membranske: ionotropne (kanali), sklopljene z G-proteinom in receptorske kinaze.
- Sekundarni obveščevalci: cAMP (adenilat-ciklaza → PKA), IP₃ in DAG (fosfolipaza C → $\mathrm{Ca^{2+}}$, PKC), $\mathrm{Ca^{2+}}$, cGMP. Kaskada signal ojači z množenjem; ugasnejo ga GTPaza, fosfodiesteraza in fosfataze.
- Apoptoza je programirana celična smrt: skrčenje, razrez DNA, apoptotska telesca, fosfatidilserin navzven, brez vnetja. Nekroza: celica nabrekne, membrana poči, nastane vnetje.
- Notranja pot: p53 → Bax → citokrom c → apoptosom → kaspaza 9 → kaspaza 3. Zunanja pot: Fas → kaspaza 8 → kaspaza 3. Bcl-2 apoptozo zavira.
- Pri odraslem z apoptozo odmre okoli $6 \cdot 10^{10}$ celic na dan.

## Za izpit

Znati moraš povedati:
- razliko med prenosom snovi in prenosom sporočila ter definicije pojmov ligand, receptor, prvi in sekundarni obveščevalec;
- zakaj topnost liganda določa lego receptorja in kako hitro deluje znotrajcelični receptor v primerjavi z membranskim;
- tri skupine membranskih receptorjev s primerom in mehanizmom vsake;
- poti $\mathrm{G_s}$ → adenilat-ciklaza → cAMP → PKA in $\mathrm{G_q}$ → fosfolipaza C → IP₃, DAG → $\mathrm{Ca^{2+}}$, PKC ter tri načine ugašanja signala;
- zakaj se števila v kaskadi množijo in kako izračunaš ojačitev;
- razlike med apoptozo in nekrozo ter korake notranje in zunanje poti apoptoze z vlogo p53, Bax, Bcl-2 in kaspaz.

### Naloga 1

Jetrna celica ima na površini $4000$ receptorjev za adrenalin. Pri dani koncentraciji hormona je zasedenih $5\,\%$ receptorjev. Vsak zaseden receptor aktivira $10$ G-proteinov $\mathrm{G_s}$, vsak G-protein vklopi eno adenilat-ciklazo. Ciklaza izdeluje $100$ molekul cAMP na sekundo, dokler G-protein ne hidrolizira svojega GTP, kar se zgodi povprečno po $10\,\mathrm{s}$. Prostornina celice je $4 \cdot 10^{-12}\,\mathrm{L}$, Avogadrova konstanta je $6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}$. Razgradnjo cAMP zanemari. (a) Koliko molekul cAMP nastane? (b) Za koliko se zviša koncentracija cAMP v celici? (c) Največ koliko katalitičnih podenot PKA lahko ta cAMP aktivira? (d) Mutacija v $\mathrm{G_s}$ upočasni hidrolizo GTP, tako da ciklaza dela povprečno $60\,\mathrm{s}$. Kolikšna sta zdaj število molekul in koncentracija cAMP? Kateri korak ugašanja je odpovedal?

**Rešitev:**

1. Zasedenih receptorjev: $4000 \cdot 0{,}05 = 200$.
2. Aktivnih G-proteinov in s tem ciklaz: $200 \cdot 10 = 2000$.
3. (a) Molekul cAMP: $2000 \cdot 100 \cdot 10 = 2\,000\,000$, torej $2 \cdot 10^6$.
4. (b) Množina: $\dfrac{2 \cdot 10^6}{6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}} \approx 3{,}32 \cdot 10^{-18}\,\mathrm{mol}$.
5. Koncentracija: $\dfrac{3{,}32 \cdot 10^{-18}\,\mathrm{mol}}{4 \cdot 10^{-12}\,\mathrm{L}} \approx 8{,}3 \cdot 10^{-7}\,\mathrm{mol/L}$, to je okoli $0{,}83\,\mathrm{\mu mol/L}$.
6. (c) Za eno podenoto PKA sta potrebni $2$ molekuli cAMP: $2\,000\,000 / 2 = 1\,000\,000$ podenot.
7. (d) Čas delovanja ciklaze je $6$-krat daljši: $2000 \cdot 100 \cdot 60 = 12\,000\,000$ molekul, koncentracija $6 \cdot 0{,}83 \approx 5{,}0\,\mathrm{\mu mol/L}$.
8. Odgovor: nastane $2 \cdot 10^6$ molekul cAMP, koncentracija se zviša za okoli $0{,}83\,\mathrm{\mu mol/L}$, aktivira se največ $10^6$ podenot PKA. Pri mutaciji nastane $1{,}2 \cdot 10^7$ molekul (okoli $5\,\mathrm{\mu mol/L}$). Odpovedalo je prvo ugašanje, lastna GTPazna aktivnost G-proteina; fosfodiesteraza in fosfataze delujejo, a ciklaze ne ustavijo.

### Naloga 2

Natančno navedi korake notranje in zunanje poti apoptoze. Nato utemelji, ali lahko celica ubijalka uniči tumorsko celico, ki ima okvarjen gen za p53 in izdeluje preveč beljakovine Bcl-2.

**Rešitev:**

1. Notranja pot: poškodba DNA aktivira p53. Ta najprej ustavi celični cikel v G1, pri prevelikih poškodbah pa vklopi beljakovine Bax.
2. Mitohondrij sprosti citokrom c, ki z Apaf-1 sestavi apoptosom. Apoptosom aktivira kaspazo 9, ta pa izvršilni kaspazi 3 in 7.
3. Zunanja pot: Fas-ligand na celici ubijalki se veže na receptor smrti Fas na tarčni celici. Receptor aktivira kaspazo 8, ta pa kaspazo 3.
4. Obe poti se združita pri izvršilnih kaspazah, ki razgradijo celične beljakovine. Sledijo zgostitev kromatina, razrez DNA, apoptotska telesca in fosfatidilserin na zunanji strani membrane.
5. Tumorska celica: brez p53 poškodba DNA ne vklopi Bax, presežek Bcl-2 pa mitohondrijsko pot dodatno zavira. Notranja pot je torej zaprta na dveh mestih.
6. Zunanja pot ne potrebuje ne p53 ne mitohondrija: Fas → kaspaza 8 → kaspaza 3. Če ima celica receptor Fas in delujoče kaspaze, jo celica ubijalka lahko uniči.
7. Sklep: da, po zunanji poti. Okvari p53 in Bcl-2 celico zaščitita pred »samomorom« po poškodbi DNA, ne pa pred ukazom od zunaj.

### Naloga 3

Kofein v visokih koncentracijah zavira fosfodiesterazo. Utemelji, ali kofein učinek adrenalina na jetrno celico okrepi ali oslabi. Nato utemelji, kaj se zgodi s cAMP, če se hkrati z adrenalinom na isto celico veže ligand, katerega receptor aktivira $\mathrm{G_i}$.

**Rešitev:**

1. Adrenalin prek receptorja in $\mathrm{G_s}$ vklopi adenilat-ciklazo, ta iz ATP dela cAMP, cAMP aktivira PKA.
2. Količino cAMP določata nastajanje (ciklaza) in razgradnja (fosfodiesteraza).
3. Kofein upočasni razgradnjo. Pri enakem nastajanju se cAMP nabere više in ostane dlje, PKA je dlje aktivna.
4. Kofein torej učinek adrenalina okrepi in podaljša, čeprav se sam na adrenalinski receptor ne veže. Signal je še vedno odvisen od liganda: brez aktivne ciklaze nastaja le malo cAMP.
5. $\mathrm{G_i}$ adenilat-ciklazo zavira. Ista ciklaza dobi hkrati ukaz za vklop ($\mathrm{G_s}$) in za izklop ($\mathrm{G_i}$), zato nastane manj cAMP kot pri samem adrenalinu.
6. Sklep: raven cAMP je vsota nasprotnih vplivov. Celica odziv uravnava na dveh mestih, pri nastajanju in pri razgradnji sekundarnega obveščevalca.

## Drugače: Na sliki

Kaskado cAMP si nariši kot drevo, ki se navzdol širi:

:::risba skica
opis: Kaskada cAMP kot drevo, ki se navzdol širi. Od zgoraj navzdol si sledijo: adrenalin (1 molekula), receptor (1), G-proteini (10), adenilat-ciklaze (10), cAMP (1000), podenote PKA (500), encimi (5000), produkt (5 000 000). Vsaka stopnja je pas, ki je tem širši, čim več je molekul; širine niso v merilu. Puščice kažejo od vsake stopnje k naslednji.
območje: 0; 0 .. 34; 25
pravokotnik: 6,5; 22,2 .. 7,5; 23,8 | modra polno
črta: 7; 22,2 -> 7; 20,8 | puščica
napis: 14,5; 23 | adrenalin (1) | desno
pravokotnik: 6,5; 19,2 .. 7,5; 20,8 | modra polno
črta: 7; 19,2 -> 7; 17,8 | puščica
napis: 14,5; 20 | receptor (1) | desno
pravokotnik: 5,65; 16,2 .. 8,35; 17,8 | modra polno
črta: 7; 16,2 -> 7; 14,8 | puščica
napis: 14,5; 17 | G-proteini (10) | desno
pravokotnik: 5,65; 13,2 .. 8,35; 14,8 | modra polno
črta: 7; 13,2 -> 7; 11,8 | puščica
napis: 14,5; 14 | adenilat-ciklaze (10) | desno
pravokotnik: 3,95; 10,2 .. 10,05; 11,8 | modra polno
črta: 7; 10,2 -> 7; 8,8 | puščica
napis: 14,5; 11 | cAMP (1000) | desno
pravokotnik: 4,21; 7,2 .. 9,79; 8,8 | modra polno
črta: 7; 7,2 -> 7; 5,8 | puščica
napis: 14,5; 8 | podenote PKA (500) | desno
pravokotnik: 3,36; 4,2 .. 10,64; 5,8 | modra polno
črta: 7; 4,2 -> 7; 2,8 | puščica
napis: 14,5; 5 | encimi (5000) | desno
pravokotnik: 0,81; 1,2 .. 13,19; 2,8 | modra polno
napis: 14,5; 2 | produkt (5 000 000) | desno
:::

Drevo se navzdol širi, le pri PKA se zoži, ker vsako sproščeno podenoto sprostita dve molekuli cAMP. Fosfodiesteraza je kot škarje, ki drevo ob koncu odrežejo pri cAMP.

Apoptozo nariši v štirih sličicah: (1) okrogla celica, (2) manjša celica z zgoščenim jedrom, (3) celica z mehurčki na površini, (4) kup majhnih kroglic, ki jih obda makrofag. Nekroza ima le dve: (1) celica, (2) večja celica, iz katere v okolico brizga vsebina.

## Drugače: Uporaba v stroki

**Tarče zdravil.** Približno tretjina odobrenih zdravil deluje na receptorje, sklopljene z G-proteinom. Salbutamol pri astmi aktivira adrenalinski receptor beta2 v bronhih (prek $\mathrm{G_s}$ in cAMP se gladko mišičje sprosti), zaviralci beta pa sorodni receptor beta1 na srcu zasedejo in ga ne aktivirajo. Pri iskanju novih učinkovin v laboratoriju zato v celicah merijo sekundarne obveščevalce, najpogosteje cAMP in $\mathrm{Ca^{2+}}$.

**Merjenje apoptoze.** V celični kulturi apoptozo dokažejo z aneksinom V, beljakovino, ki se veže na fosfatidilserin na zunanji strani membrane. Dodajo še barvilo, ki vstopi le skozi poškodovano membrano. S pretočnim citometrom nato ločijo žive, zgodnje apoptotske ter pozno apoptotske ali nekrotične celice. Drugi testi merijo aktivnost kaspaze 3 ali pokažejo razrezano DNA.

**Bioreaktor.** Celice, ki izdelujejo terapevtska protitelesa, ob pomanjkanju hranil odmirajo z apoptozo. Biotehnologi jim zato vstavijo gen za Bcl-2 ali sorodno beljakovino, da kultura dlje živi in nastane več produkta.

**Zdravljenje raka.** Nekatere levkemije preživijo, ker izdelujejo preveč Bcl-2. Zdravilo venetoklaks Bcl-2 zavre in rakavim celicam vrne notranjo pot apoptoze.

## Preveri se

? Katera trditev o sekundarnih obveščevalcih je pravilna?
- Sekundarni obveščevalec je hormon, ki ga izloči druga žleza.
~ Sekundarni obveščevalci ne krožijo po krvi; nastanejo v tarčni celici po aktivaciji receptorja.
+ cAMP nastane iz ATP z adenilat-ciklazo in aktivira protein-kinazo A.
- IP₃ odpre kanale za $\mathrm{Na^+}$ v celični membrani.
~ IP₃ sprosti $\mathrm{Ca^{2+}}$ iz endoplazemskega retikuluma, ne odpira kanalov za $\mathrm{Na^+}$ v plazmalemi.
- Steroidni hormoni delujejo prek cAMP.
~ Steroidi so lipofilni in delujejo prek znotrajceličnih receptorjev neposredno na gene.
> Adenilat-ciklaza, ki jo vklopi $\mathrm{G_s}$, pretvori ATP v cAMP; cAMP aktivira PKA, ki fosforilira tarčne beljakovine.

? Receptor aktivira $5$ G-proteinov, vsak prek ciklaze da $20$ molekul cAMP, vsaka molekula cAMP (posredno) sproži nastanek $50$ molekul produkta. Koliko produkta nastane?
- $75$
~ To je vsota $5 + 20 + 50$. Pri kaskadi se števila množijo.
- $1000$
~ Pozabil si en korak: $20 \cdot 50 = 1000$ velja za en G-protein, teh pa je $5$.
+ $5000$
- $250$
~ To je $5 \cdot 50$ brez koraka s cAMP.
> $5 \cdot 20 \cdot 50 = 5000$ molekul produkta.

? Študentka računa ojačitev: $10$ G-proteinov, po $100$ cAMP, po $10$ encimov na cAMP. Zapiše: (1) cAMP: $10 \cdot 100 = 1000$. (2) encimi: $1000 + 10 = 1010$. (3) Odgovor: $1010$ encimov. Kje je napaka?
- V koraku 1, ker bi morala seštevati.
~ Korak 1 je pravilen: $10$ G-proteinov po $100$ molekul cAMP je $1000$.
+ V koraku 2, ker bi morala množiti: $1000 \cdot 10 = 10000$.
- Nikjer, rezultat je pravilen.
~ $1010$ dobiš le s seštevanjem; vsaka molekula cAMP sproži $10$ encimov, zato se množi.
> Ojačitev je množenje po vseh korakih: $10 \cdot 100 \cdot 10 = 10000$ encimov.

? V čem se apoptoza razlikuje od nekroze?
- Apoptoza je hitrejša, sicer sta enaki.
~ Razlika ni v hitrosti, temveč v mehanizmu in posledicah za okolico.
- Pri apoptozi celica nabrekne in poči.
~ To opisuje nekrozo. Apoptotska celica se skrči in membrana ostane cela.
+ Apoptoza je nadzorovana, porablja ATP in ne povzroči vnetja.
- Pri apoptozi se vsebina celice izlije in pritegne vnetne celice.
~ Vsebina ostane zaprta v apoptotskih telescih, ki jih makrofagi tiho odstranijo.
> Apoptoza je program: skrčenje, razrez DNA, apoptotska telesca, fosfatidilserin navzven, brez vnetja.

? Toksin kolere trajno aktivira protein $\mathrm{G_s}$ v celicah črevesja. Kaj se zgodi?
- cAMP v celici pade, ker se ciklaza izčrpa.
~ Trajno aktiven $\mathrm{G_s}$ ciklazo ves čas vklaplja, zato cAMP narašča, ne pada.
+ cAMP ostane visok, celice izločajo ione in vodo, nastane huda driska.
- Celice takoj odmrejo z nekrozo.
~ Toksin ne poškoduje membrane; spremeni signalizacijo, zato celice delujejo preveč, ne odmrejo.
> $\mathrm{G_s}$ ne more ugasniti, adenilat-ciklaza neprestano dela cAMP. PKA odpre kanale za $\mathrm{Cl^-}$, za njim gre voda v črevo.

:::simboli
N | število molekul produkta | N = 1 \cdot 10 \cdot 100 \cdot \dfrac12 \cdot 10 \cdot 1000 | – | ojačanje signala v kaskadi
N_\text{dan} | število celic, ki odmrejo v enem dnevu | | – | okoli 6 · 10¹⁰
N_\text{telo} | število vseh celic v telesu | | – | okoli 3 · 10¹³
:::
