---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Zakaj LED-svetilka za gojenje bazilike sveti vijolično in ne belo? Oddaja predvsem modro in rdečo svetlobo, zelene pa le malo. Zeleno svetlobo bi kupec namreč plačal, rastlina pa bi je porabila malo. In drugo vprašanje: kako ti sendvič za $3$ evre da dovolj energije, da popoldne prekolesariš $20\,\mathrm{km}$?

Obe vprašanji vodita do istega: od kod celica dobi ATP, valuto, s katero plača vsako svoje delo? V mišici in v listu ga izdela isti stroj, **ATP-sintaza**. Poganjajo jo protoni, ki tečejo skozi membrano. V tvojih mišicah stoji v membrani mitohondrija, v listu bazilike v membrani kloroplasta.

Ista pot elektronov po membrani in protonov skoznjo pojasni tudi, zakaj dihamo kisik in kdaj se vrtnarju splača kupiti več svetlobe, kdaj pa več $\mathrm{CO_2}$.

## Razlaga

### Napačna ideja 1: »Energija iz hrane gre naravnost v ATP«

Zdi se logično: glukoza ima energijo, celica jo pretoči v ATP. Pri glikolizi in v Krebsovem ciklu res nastane nekaj ATP neposredno. Veliko večino ATP pa celica izdela posredno, v treh korakih:

1. **Prenos elektronov.** Elektrone iz razgradnje hrane prinašata NADH in $\mathrm{FADH_2}$. Elektroni potujejo po verigi beljakovin v notranji membrani mitohondrija in na vsakem koraku oddajo nekaj energije. Na koncu jih sprejme kisik, ki se z $\mathrm{H^+}$ poveže v vodo. Zato dihamo.
2. **Protonski gradient.** Beljakovine verige s to energijo črpajo protone ($\mathrm{H^+}$) iz matriksa (notranjosti mitohondrija) v medmembranski prostor (med notranjo in zunanjo membrano). Na eni strani membrane je zdaj več $\mathrm{H^+}$ kot na drugi.
3. **ATP-sintaza.** Protoni tečejo po gradientu nazaj v matriks skozi ATP-sintazo. Del te beljakovine se vrti kot turbina v hidroelektrarni in iz ADP in fosfata sestavi ATP.

Energija je torej vmes shranjena kot razlika v koncentraciji $\mathrm{H^+}$, podobno kot voda za jezom.

Kako vemo, da je gradient res vmesni korak? Leta 1966 sta André Jagendorf in Ernest Uribe namočila tilakoide (notranje membrane kloroplasta) v kislo raztopino s pH 4, da so se napolnili s protoni. Nato sta jih v temi prenesla v raztopino s pH 8, v kateri sta bila ADP in fosfat. Tilakoidi so naredili ATP brez svetlobe in brez prenosa elektronov. Zadoščal je gradient.

:::premisli
Bi tilakoidi v tem poskusu naredili ATP, če bi jih iz raztopine s pH 4 prenesli v drugo raztopino s pH 4? Napovej in utemelji.
---
Ne. Brez razlike v koncentraciji $\mathrm{H^+}$ med notranjostjo in okolico protoni nimajo kam teči, zato se ATP-sintaza ne vrti. Odloča razlika, ne kislost sama. Takšen del poskusa je dobra kontrolna skupina.
:::

### Napačna ideja 2: »Rastline imajo kloroplaste namesto mitohondrijev«

Rastlinska celica ima oboje. Kloroplast s svetlobo izdela ATP in NADPH, ki ju porabi za vezavo $\mathrm{CO_2}$ v sladkor. Mitohondrij ta sladkor razgradi, kadar celica potrebuje ATP, tudi ponoči. Organela delujeta po istem načelu. V kloroplastu je **lumen** prostor znotraj tilakoide, **stroma** pa tekočina okoli tilakoid:

| | mitohondrij | kloroplast |
|---|---|---|
| vir energije | elektroni iz hrane | svetloba vzbudi elektrone klorofila |
| $\mathrm{H^+}$ se nabirajo | v medmembranskem prostoru | v lumnu tilakoide |
| ATP nastaja | v matriksu | v stromi |
| končni sprejemnik elektronov | $\mathrm{O_2}$ (nastane voda) | $\mathrm{NADP^+}$ (nastane NADPH) |

V kloroplastu svetloba v fotosistemu (skupku klorofila in beljakovin v tilakoidni membrani) vzbudi elektron klorofila. Vrzel zapolni elektron iz vode: voda se razcepi, sprosti se kisik, protoni ostanejo v lumnu. Vzbujeni elektroni potujejo po verigi v tilakoidni membrani, ki v lumen prečrpa še več $\mathrm{H^+}$. Na svetlobi ima lumen pH okoli 5, stroma okoli 8. Protoni tečejo iz lumna skozi ATP-sintazo v stromo, kjer Calvinov cikel porabi ATP.

En celoten obrat ATP-sintaze da 3 ATP. V kloroplastu špinače ima vrtljivi obroč 14 podenot, zato za en obrat potrebuje 14 protonov, po enega za vsako podenoto. Takih obratov naredi več kot sto na sekundo.

V simulaciji spodaj »3D: Tilakoidna membrana in ATP-sintaza« pojdi z »Naprej« do ATP-sintaze. Opazuj, na kateri strani membrane je več $\mathrm{H^+}$ in v katero smer tečejo.

### Napačna ideja 3: »List največ porabi zelene svetlobe, saj je zelen«

Ravno obratno. List je zelen, ker zeleno svetlobo odbije in prepusti bolj kot druge barve in prav ta pride v naše oko. **Absorpcijski spekter** pokaže, koliko svetlobe posamezne valovne dolžine pigment vpije. Klorofil a najbolj vpija modro svetlobo (okoli $430\,\mathrm{nm}$) in rdečo (okoli $660\,\mathrm{nm}$):

:::risba stolpci
opis: Približna absorpcija svetlobe klorofila a pri šestih valovnih dolžinah: 430 nm (modra) 100 %, 480 nm 5 %, 550 nm (zelena) 4 %, 620 nm 20 %, 660 nm (rdeča) 80 %, 720 nm 2 %. Visoka stolpca sta pri modri in rdeči, najnižji pri zeleni.
os: absorpcija (%)
korak: 20
stolpec: 430 nm | 100
stolpec: 480 nm | 5
stolpec: 550 nm | 4
stolpec: 620 nm | 20
stolpec: 660 nm | 80
stolpec: 720 nm | 2
:::

Zato imajo svetilke za gojenje največ modrih in rdečih diod. Karotenoidi, rumeni in oranžni pigmenti, vpijajo še modrozeleno svetlobo in energijo predajo klorofilu.

:::premisli
Rastlino osvetliš samo z zeleno svetlobo $550\,\mathrm{nm}$, enako močno kot prej z rdečo. Kaj napoveš za hitrost fotosinteze in zakaj?
---
Fotosinteza bo počasnejša. Klorofil zelene svetlobe vpije najmanj, zato je manj vzbujenih elektronov, manj prečrpanih $\mathrm{H^+}$ ter manj ATP in NADPH. Ne ustavi pa se: cel list ima več plasti celic in pomožne pigmente, zato vseeno vpije precejšen del zelene svetlobe in fotosinteza teče, le počasneje kot pri rdeči.
:::

### Napačna ideja 4: »Več svetlobe vedno pomeni hitrejšo fotosintezo«

Fotosinteza hkrati potrebuje svetlobo, $\mathrm{CO_2}$ in primerno temperaturo za encime Calvinovega cikla. Hitrost določa tisti dejavnik, ki ga je glede na potrebe najmanj: **omejujoči dejavnik**. Če primanjkuje $\mathrm{CO_2}$, dodatna svetloba ne pomaga, ker Calvinov cikel ne more vezati več ogljika. Zato vrtnarji v rastlinjake dovajajo $\mathrm{CO_2}$ (v zraku ga je okoli $420\,\mathrm{ppm}$, to je $420$ delcev na milijon, v rastlinjaku do okoli $1000\,\mathrm{ppm}$), a le, kadar je svetlobe dovolj.

Za koliko odstotkov se je hitrost spremenila, izračunaš iz hitrosti prej ($v_1$) in potem ($v_2$):

$$p = \frac{v_2 - v_1}{v_1} \cdot 100\,\%$$

### C3 in CAM: kdaj odpreti listne reže

Večina rastlin (pšenica, fižol, bazilika) so **rastline C3**. Encim RuBisCO veže $\mathrm{CO_2}$ podnevi; prvi stabilni produkt ima tri ogljikove atome, od tod ime. Listne reže morajo biti podnevi odprte, zato rastline C3 v vročini izgubijo veliko vode.

**Rastline CAM** (kaktusi, ananas, tolstičevke) odprejo reže ponoči, ko je hladneje in vlažneje. $\mathrm{CO_2}$ vežejo v jabolčno kislino in jo shranijo v vakuoli. Podnevi imajo reže zaprte; iz kisline sprostijo $\mathrm{CO_2}$, Calvinov cikel pa ga z ATP in NADPH iz svetlobnih reakcij veže v sladkor. Za enako količino vezanega $\mathrm{CO_2}$ tako izgubijo približno desetkrat manj vode.

## Rešeni primeri

### Primer 1 (lažji): koliko več protonov je v lumnu

Na svetlobi ima lumen tilakoide pH $5$, stroma pa pH $8$. Kolikokrat večja je koncentracija $\mathrm{H^+}$ v lumnu kot v stromi?

**Podatki:** $\mathrm{pH_l} = 5$ (lumen), $\mathrm{pH_s} = 8$ (stroma)
**Iščemo:** razmerje koncentracij $k$

:::formula
$[\mathrm{H^+}] = 10^{-\mathrm{pH}}\,\mathrm{mol/L}$, zato $k = 10^{\mathrm{pH_s} - \mathrm{pH_l}}$
:::

**Rešitev:**

1. Lumen: $[\mathrm{H^+}] = 10^{-5}\,\mathrm{mol/L}$; stroma: $[\mathrm{H^+}] = 10^{-8}\,\mathrm{mol/L}$.
2. Razlika: $\Delta \mathrm{pH} = 8 - 5 = 3$. Manjši pH pomeni več $\mathrm{H^+}$, zato je več protonov v lumnu.
3. $k = 10^{3} = 1000$, ker vsaka enota pH pomeni desetkratno razliko v koncentraciji.
4. Odgovor: v lumnu je koncentracija $\mathrm{H^+}$ $1000$-krat večja kot v stromi.

### Primer 2: menjalni tečaj ATP-sintaze

ATP-sintaza v kloroplastu deluje kot menjalnica: za en obrat sprejme $14$ protonov in izplača $3$ ATP. Koliko protonov »stane« en ATP? Koliko protonov mora steči skozi ATP-sintazo, da nastane $30$ ATP?

**Podatki:** $14$ protonov na obrat, $3$ ATP na obrat, $N_{\mathrm{ATP}} = 30$
**Iščemo:** število protonov na en ATP in skupno število protonov $N_{\mathrm{H}}$

:::formula
$N_{\mathrm{H}} = \dfrac{14}{3} \cdot N_{\mathrm{ATP}}$
:::

**Rešitev:**

1. Cena enega ATP: $\dfrac{14}{3} \approx 4{,}67$ protona, ker en obrat da tri ATP.
2. Za $30$ ATP: $N_{\mathrm{H}} = \dfrac{14}{3} \cdot 30 = 140$.
3. Preizkus z obrati: $\dfrac{30}{3} = 10$ obratov, vsak po $14$ protonov, $10 \cdot 14 = 140$.
4. Odgovor: en ATP stane približno $4{,}67$ protona; za $30$ ATP mora skozi ATP-sintazo steči $140$ protonov.

### Primer 3 (težji): kaj naj vrtnar kupi

Vrtnar goji paradižnik v rastlinjaku. Izmeril je hitrost fotosinteze (sproščanje kisika v relativnih enotah) pri dveh jakostih svetlobe in dveh koncentracijah $\mathrm{CO_2}$:

| svetloba | $400\,\mathrm{ppm}$ $\mathrm{CO_2}$ | $800\,\mathrm{ppm}$ $\mathrm{CO_2}$ |
|---|---|---|
| šibka (brez lučk) | 10 | 10 |
| močna (z lučkami) | 16 | 22 |

Zdaj ima šibko svetlobo in $400\,\mathrm{ppm}$ $\mathrm{CO_2}$. Letos ima denar le za eno naložbo: lučke ali jeklenke s $\mathrm{CO_2}$. Kaj naj kupi in za koliko odstotkov se hitrost poveča? Kaj naj kupi naslednje leto, ko lučke že ima?

**Podatki:** izhodišče: šibka svetloba in $400\,\mathrm{ppm}$ $\mathrm{CO_2}$; hitrosti iz tabele: šibka svetloba $10$ (pri $400\,\mathrm{ppm}$) in $10$ (pri $800\,\mathrm{ppm}$), močna svetloba $16$ (pri $400\,\mathrm{ppm}$) in $22$ (pri $800\,\mathrm{ppm}$)
**Iščemo:** omejujoči dejavnik letos in prihodnje leto ter relativno povečanje $p$

:::formula
$p = \dfrac{v_2 - v_1}{v_1} \cdot 100\,\%$, kjer je $v_1$ hitrost pred nakupom in $v_2$ po njem
:::

**Rešitev:**

1. Samo več $\mathrm{CO_2}$: hitrost ostane $10$. Pri šibki svetlobi je omejujoči dejavnik svetloba, ker Calvinov cikel nima dovolj ATP in NADPH.
2. Samo lučke: $p = \dfrac{16 - 10}{10} \cdot 100 = 60$, torej $60\,\%$ hitreje. Letos naj kupi lučke.
3. Z lučkami je svetlobe dovolj. Zdaj omejuje $\mathrm{CO_2}$, saj ga dodatek pospeši s $16$ na $22$.
4. Relativno povečanje drugo leto izračunaj sam:

:::premisli
Koliko je $p = \dfrac{22 - 16}{16} \cdot 100\,\%$?
---
$p = 37{,}5\,\%$. Drugo leto naj kupi $\mathrm{CO_2}$. Povečanje je manjše od $60\,\%$, ker se računa od večje osnove ($16$ namesto $10$).
:::

## Pogoste napake

Te zmote se pogosto pojavijo na maturi:

- **»Mitohondrij naredi energijo.«** Energije ni mogoče ustvariti. Mitohondrij energijo, shranjeno v hrani, pretvori v energijo ATP, del se sprosti kot toplota.
- **»ATP-sintaza črpa protone.«** Črpa jih veriga za prenos elektronov. ATP-sintaza protone spušča nazaj po gradientu in pri tem dela ATP: je turbina, ne črpalka.
- **»List je zelen, ker najbolj vpija zeleno svetlobo.«** Vidimo svetlobo, ki se odbije ali prepusti. Klorofil zelene vpije najmanj.
- **»Več svetlobe vedno pospeši fotosintezo.«** Pomaga le, kadar je svetloba omejujoči dejavnik. Če primanjkuje $\mathrm{CO_2}$ ali je prehladno, dodatne lučke ne spremenijo ničesar.
- **»Rastline CAM fotosintetizirajo ponoči.«** Ponoči samo vežejo $\mathrm{CO_2}$ v kislino. Calvinov cikel potrebuje ATP in NADPH iz svetlobnih reakcij, zato teče podnevi.

## Povzetek

- Mitohondrij in kloroplast izdelata ATP po istem načelu: prenos elektronov po verigi v membrani → protonski gradient → ATP-sintaza.
- V mitohondriju elektroni prihajajo iz hrane in končajo na kisiku (voda); $\mathrm{H^+}$ se nabirajo v medmembranskem prostoru, ATP nastaja v matriksu.
- V kloroplastu svetloba vzbudi elektrone klorofila, voda se razcepi (kisik); $\mathrm{H^+}$ se nabirajo v lumnu (pH okoli 5), ATP nastaja v stromi (pH okoli 8).
- ATP-sintaza je turbina: protoni po gradientu jo zavrtijo; v kloroplastu $14$ protonov na obrat, $3$ ATP na obrat.
- Klorofil vpija predvsem modro in rdečo svetlobo, zeleno odbija.
- Hitrost fotosinteze določa omejujoči dejavnik (svetloba, $\mathrm{CO_2}$, temperatura).
- Rastline C3 vežejo $\mathrm{CO_2}$ podnevi; rastline CAM ponoči z odprtimi režami shranijo $\mathrm{CO_2}$ v kislino in prihranijo vodo.

## Drugače: Kot zgodba

Proton se je rodil zjutraj, ko je sončni žarek zadel list bazilike. Molekula vode v tilakoidi je oddala dva elektrona klorofilu, iz nje sta ostala kisik in dva protona. Naš proton je ostal v lumnu, ozkem prostoru znotraj tilakoide.

Tam je bila gneča. Elektroni so po membrani tekli naprej, verige beljakovin pa so v lumen nosile vedno več protonov. Kmalu jih je bilo tisočkrat več kot zunaj, v stromi. Vsi so silili ven, a membrana jih ni pustila skozi. Edina vrata so bila ATP-sintaza.

Naš proton se je s trinajstimi drugimi prerinil skozi vrtljivi obroč. Obroč se je zavrtel za en obrat in na drugi strani so nastale tri molekule ATP. Proton je pristal v stromi, kjer je Calvinov cikel ATP takoj porabil za gradnjo sladkorja.

Zvečer je mitohondrij v isti celici razgradil del tega sladkorja in protone črpal čez svojo membrano. Zgodba se je ponovila, le da je elektrone na koncu pobral kisik.

## Drugače: Korak za korakom s številkami

Sledi številkam za eno ATP-sintazo v kloroplastu na svetlobi:

1. Razlika pH: $8 - 5 = 3$, zato je v lumnu $10^3 = 1000$-krat več $\mathrm{H^+}$ kot v stromi.
2. En obrat: $14$ protonov skozi obroč, nastanejo $3$ ATP.
3. Recimo, da se zavrti $100$-krat na sekundo: $100 \cdot 14 = 1400$ protonov na sekundo.
4. ATP na sekundo: $100 \cdot 3 = 300$.
5. V eni uri: $300 \cdot 3600 = 1080000$ ATP iz ene same ATP-sintaze.

Če gradient izgine (na primer v temi), se obroč ustavi in vsa ta števila padejo na nič.

## Preveri se

? Na embalaži svetilke za rastline piše, da je »prilagojena absorpcijskemu spektru klorofila«. Kaj je absorpcijski spekter?
- Barve, ki jih list odbija in jih zato vidimo.
~ To je ravno obratno: odbito svetlobo vidimo, pigment pa je ni vpil.
+ Prikaz, koliko svetlobe posamezne valovne dolžine pigment vpije.
- Prikaz, koliko ATP nastane v listu pri vsaki barvi svetlobe.
~ Spekter meri vpijanje svetlobe v pigmentu, ne pridelka ATP.
> Klorofil a ima vrha absorpcije pri modri (okoli $430\,\mathrm{nm}$) in rdeči (okoli $660\,\mathrm{nm}$) svetlobi, zato svetilka oddaja predvsem ti dve barvi.

? Vrtnarka pri stalni koncentraciji $\mathrm{CO_2}$ izmeri hitrost fotosinteze (v relativnih enotah) pri šibki, srednji in močni svetlobi. Kateri niz meritev kaže, da pri močni svetlobi svetloba ni več omejujoči dejavnik?
- šibka $8$, srednja $14$, močna $20$
~ Najvišja končna hitrost še ne pove, da je svetlobe dovolj. Hitrost z vsako dodano svetlobo raste, torej svetloba še omejuje.
+ šibka $8$, srednja $15$, močna $15$
- šibka $8$, srednja $10$, močna $12$
~ Hitrost raste počasneje, a še raste. Svetloba neha omejevati šele, ko dodatna svetloba hitrosti ne spremeni več.
> Od srednje do močne svetlobe hitrost ostane $15$. Dodatna svetloba ne pomaga več, zato zdaj omejuje nekaj drugega, na primer $\mathrm{CO_2}$ ali temperatura.

? Snov 2,4-dinitrofenol naredi notranjo membrano mitohondrija prepustno za $\mathrm{H^+}$. Kaj se zgodi?
- Prenos elektronov se ustavi, kisika se ne porablja več.
~ Elektroni še naprej tečejo do kisika; snov le odpre bližnjico za protone.
- ATP nastaja hitreje, ker protoni hitreje tečejo nazaj.
~ Protoni tečejo mimo ATP-sintaze, zato je ne vrtijo.
+ Elektroni tečejo naprej, a protoni uidejo mimo ATP-sintaze: ATP nastaja malo, energija se sprosti kot toplota.
> Gradient se sproti izgublja, zato ATP-sintaza miruje. Mitohondrij še vedno razgrajuje hrano in porablja kisik, energija pa se sprošča kot toplota. Zato je ta snov nevarna: povzroči lahko smrtno nevarno pregretje telesa.

? V lumnu tilakoide je pH $6$, v stromi pH $8$. Kolikokrat večja je koncentracija $\mathrm{H^+}$ v lumnu?
- $2$
~ Razlika pH ni razmerje koncentracij. Vsaka enota pH pomeni desetkratno spremembo.
- $1{,}33$
~ To je $8 : 6$. Vrednosti pH ne delimo, ker je pH logaritemska lestvica.
+ $100$
- $0{,}01$
~ Razmerje je obrnjeno: manjši pH pomeni več $\mathrm{H^+}$, zato je v lumnu več protonov.
> $k = 10^{8 - 6} = 10^2 = 100$.

? ATP-sintaza v kloroplastu za en obrat porabi $14$ protonov in naredi $3$ ATP. Skoznjo je steklo $70$ protonov. Koliko ATP je nastalo?
- $5$
~ To je število obratov. Vsak obrat da $3$ ATP, ne enega.
+ $15$
- $210$
~ To je $70 \cdot 3$, kot da bi vsak proton dal $3$ ATP. Tri ATP da šele $14$ protonov skupaj.
- $70$
~ En proton ne da enega ATP. Za $3$ ATP je potrebnih $14$ protonov.
> $\dfrac{70}{14} = 5$ obratov, $5 \cdot 3 = 15$ ATP.

<<RACUN
vrednost: 10^(8-5) | 1000
vrednost: 14/3 | 4.67
vrednost: 14/3*30 | 140
vrednost: 30/3 | 10
vrednost: (16-10)/10*100 | 60
vrednost: (22-16)/16*100 | 37.5
vrednost: 100*14 | 1400
vrednost: 100*3 | 300
vrednost: 300*3600 | 1080000
vrednost: 10^(8-6) | 100
vrednost: 70/14*3 | 15
>>

:::simboli
\mathrm{pH} | pH raztopine | | – | manjši pH pomeni več $\mathrm{H^+}$
\mathrm{pH_l} | pH v lumnu tilakoide | | –
\mathrm{pH_s} | pH v stromi | | –
\Delta \mathrm{pH} | razlika pH med stromo in lumnom | \Delta \mathrm{pH} = \mathrm{pH_s} - \mathrm{pH_l} | –
k | razmerje koncentracij $\mathrm{H^+}$ v lumnu in stromi | k = 10^{\mathrm{pH_s} - \mathrm{pH_l}} | –
N_{\mathrm{H}} | število protonov skozi ATP-sintazo | N_{\mathrm{H}} = \dfrac{14}{3} \cdot N_{\mathrm{ATP}} | – | velja za kloroplast s $14$ podenotami obroča
N_{\mathrm{ATP}} | število nastalih molekul ATP | | –
p | relativno povečanje hitrosti fotosinteze | p = \dfrac{v_2 - v_1}{v_1} \cdot 100\,\% | \%
v_1 | hitrost fotosinteze prej | | – | relativne enote
v_2 | hitrost fotosinteze potem | | – | relativne enote
:::
