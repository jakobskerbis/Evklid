---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka. Keramičar ima na polici dve plastenki. V prvi je razredčena solna (klorovodikova) kislina, s katero po polaganju odstrani cementno prevleko s ploščic. V drugi je ocetna kislina, s katero z armatur odstrani vodni kamen. Koncentracija obeh je enaka, $0{,}10\,\mathrm{mol/L}$.

Merilnik pH pri solni kislini pokaže $1{,}00$, pri ocetni kislini pa $2{,}88$.

Poskusi sam, preden bereš naprej: kolikšen delež molekul ocetne kisline je sploh oddal proton? Namig: pH pove koncentracijo oksonijevih ionov.

Odgovor te bo presenetil in razloži, zakaj je kis varen v kuhinji, solna kislina pa ne. Spoznal boš število, ki pove, kako močna je kislina, in mešanice, ki pH držijo skoraj pri miru. Takim mešanicam rečemo pufri: brez njih ne bi delovala kri, ne barvanje volne ne mnogi postopki v delavnici.

## Razlaga

**1. Rešitev uganke.** Pri ocetni kislini je $[\mathrm{H_3O^+}] = 10^{-2{,}88} \approx 1{,}3 \cdot 10^{-3}\,\mathrm{mol/L}$. To je le približno $1{,}3\,\%$ od $0{,}10\,\mathrm{mol/L}$. Od tisoč molekul jih torej le kakih trinajst odda proton. Ostale ostanejo cele.

Pri klorovodikovi kislini velja, kar poznaš iz lekcije o pH: $[\mathrm{H_3O^+}] = c$. Proton odda vsaka molekula. Postavimo obe kislini drugo ob drugo:

| | $\mathrm{HCl}$ (močna) | $\mathrm{CH_3COOH}$ (šibka) |
|---|---|---|
| reakcija z vodo | poteče do konca, $\to$ | ravnotežje, $\rightleftharpoons$ |
| delež, ki odda proton | skoraj $100\,\%$ | okoli $1\,\%$ |
| $[\mathrm{H_3O^+}]$ pri $c = 0{,}10\,\mathrm{mol/L}$ | $0{,}10\,\mathrm{mol/L}$ | $1{,}3 \cdot 10^{-3}\,\mathrm{mol/L}$ |

**Šibka kislina** je kislina, ki v vodi odda proton le delno; vzpostavi se ravnotežje. Pozor: »šibka« pomeni *majhen delež*, ne *majhne koncentracije*. Tudi koncentriran kis je šibka kislina.

**2. Konstanta kislosti.** Za ravnotežje že znaš zapisati konstanto. Ocetno kislino zapišimo splošno kot $\mathrm{HA}$, njeno konjugirano bazo $\mathrm{CH_3COO^-}$ (acetatni ion) pa kot $\mathrm{A^-}$:

$$\mathrm{HA} + \mathrm{H_2O} \rightleftharpoons \mathrm{H_3O^+} + \mathrm{A^-}$$

Vode je v razredčeni raztopini toliko, da se njena koncentracija praktično ne spremeni. Zato je ne pišemo v izraz; skrita je v konstanti. Dobimo **konstanto kislosti** $K_\mathrm{a}$:

$$K_\mathrm{a} = \frac{[\mathrm{H_3O^+}] \cdot [\mathrm{A^-}]}{[\mathrm{HA}]}$$

Večja kot je $K_\mathrm{a}$, več je produktov v ravnotežju in močnejša je kislina. Kot vsaka konstanta ravnotežja je odvisna le od temperature, ne od koncentracije. Ker so števila zelo majhna, jih pogosto zapišemo kot $\mathrm{p}K_\mathrm{a} = -\log K_\mathrm{a}$, tako kot pH. Pri $\mathrm{p}K_\mathrm{a}$ velja obratno: manjši $\mathrm{p}K_\mathrm{a}$ pomeni močnejšo kislino. Vrednosti pri $25\,^\circ\mathrm{C}$:

| Kislina | $K_\mathrm{a}$ [mol/L] | $\mathrm{p}K_\mathrm{a}$ |
|---|---|---|
| fluorovodikova, $\mathrm{HF}$ | $6{,}8 \cdot 10^{-4}$ | $3{,}17$ |
| mravljinčna, $\mathrm{HCOOH}$ | $1{,}8 \cdot 10^{-4}$ | $3{,}74$ |
| ocetna, $\mathrm{CH_3COOH}$ | $1{,}8 \cdot 10^{-5}$ | $4{,}74$ |
| ogljikova, $\mathrm{H_2CO_3}$ | $4{,}3 \cdot 10^{-7}$ | $6{,}37$ |

V simulaciji spodaj »Močne in šibke kisline« izberi HCl in nato ocetno kislino pri enaki koncentraciji. Primerjaj pH in stolpec $\alpha$: to je delež molekul, ki so oddale proton (v simulaciji piše, da so disociirale). Nato ocetno kislino razredči z drsnikom in opazuj, kaj se zgodi z $\alpha$.

:::premisli
Kis razredčimo z vodo. Kaj se zgodi z **deležem** molekul, ki oddajo proton? Pomagaj si z Le Chatelierjevim načelom.
---
Delež naraste. Razredčenje zmanjša vse koncentracije, ravnotežje pa se premakne v smer, kjer je več raztopljenih delcev: iz ene molekule $\mathrm{HA}$ nastaneta dva iona. Pri $0{,}0010\,\mathrm{mol/L}$ odda proton že okoli $12{,}5\,\%$ molekul. Koncentracija $\mathrm{H_3O^+}$ se vseeno zmanjša, zato pH naraste.
:::

**3. pH šibke kisline.** Za močno kislino je bil račun en korak: $[\mathrm{H_3O^+}] = c$. Pri šibki potrebujemo $K_\mathrm{a}$. Vsaka molekula, ki odda proton, da en ion $\mathrm{H_3O^+}$ in en ion $\mathrm{A^-}$, zato je $[\mathrm{A^-}] = [\mathrm{H_3O^+}]$. Ker jih odda le majhen delež, je $[\mathrm{HA}] \approx c$. V izraz za $K_\mathrm{a}$ vstavimo in dobimo $K_\mathrm{a} \approx [\mathrm{H_3O^+}]^2 / c$, torej:

$$[\mathrm{H_3O^+}] = \sqrt{K_\mathrm{a} \cdot c}$$

Približek je dober, dokler odda proton manj kot okoli $5\,\%$ molekul.

**4. Šibke baze.** Enako razmišljamo pri amonijaku, ki proton sprejme le delno:

$$\mathrm{NH_3} + \mathrm{H_2O} \rightleftharpoons \mathrm{NH_4^+} + \mathrm{OH^-}$$

Konstanta bazičnosti je $K_\mathrm{b} = \dfrac{[\mathrm{NH_4^+}] \cdot [\mathrm{OH^-}]}{[\mathrm{NH_3}]} = 1{,}8 \cdot 10^{-5}\,\mathrm{mol/L}$. Po isti poti dobimo $[\mathrm{OH^-}] = \sqrt{K_\mathrm{b} \cdot c}$, nato pOH in $\mathrm{pH} = 14 - \mathrm{pOH}$. Čistilo za okna z $0{,}10\,\mathrm{mol/L}$ amonijaka ima zato pH okoli $11{,}1$, ne $13$ kot raztopina močne baze z enako koncentracijo.

**5. Pufri.** Spet primerjava. V $1{,}0\,\mathrm{L}$ čiste vode dodamo $0{,}010\,\mathrm{mol}$ $\mathrm{HCl}$: pH pade s $7$ na $2$. Enako količino dodamo v liter mešanice ocetne kisline in natrijevega acetata: pH se spremeni za manj kot desetinko. Zakaj?

Mešanica vsebuje **šibko kislino in njeno konjugirano bazo** v podobnih količinah. Taki mešanici rečemo **pufer** (ali pufrska raztopina). Vsak del ima svojo nalogo:

- dodane ione $\mathrm{H_3O^+}$ prestreže baza: $\mathrm{CH_3COO^-} + \mathrm{H_3O^+} \to \mathrm{CH_3COOH} + \mathrm{H_2O}$;
- dodane ione $\mathrm{OH^-}$ prestreže kislina: $\mathrm{CH_3COOH} + \mathrm{OH^-} \to \mathrm{CH_3COO^-} + \mathrm{H_2O}$.

Močna kislina ali baza se tako spremeni v šibko, pH pa se le malo premakne. pH pufra dobimo iz istega izraza za $K_\mathrm{a}$, le da ga rešimo na $[\mathrm{H_3O^+}]$:

$$[\mathrm{H_3O^+}] = K_\mathrm{a} \cdot \frac{[\mathrm{HA}]}{[\mathrm{A^-}]}$$

pH je torej odvisen od **razmerja** med kislino in bazo, ne od njune količine. Če sta koncentraciji enaki, je $[\mathrm{H_3O^+}] = K_\mathrm{a}$ in $\mathrm{pH} = \mathrm{p}K_\mathrm{a}$. Acetatni pufer zato najbolje deluje okoli pH $4{,}7$, pufer iz $\mathrm{H_2CO_3}/\mathrm{HCO_3^-}$ v krvi pa skupaj z drugimi pufri drži pH pri $7{,}4$.

:::premisli
Pufer razredčimo z enako prostornino vode. Napovej dve stvari: ali se pH spremeni in ali razredčeni pufer prestreže enako dodane kisline kot prej. Utemelji z izrazom zgoraj.
---
Skoraj ne. Obe koncentraciji se razpolovita, njuno razmerje $\dfrac{[\mathrm{HA}]}{[\mathrm{A^-}]}$ pa ostane enako. Razredčen pufer pa prenese manj dodane kisline ali baze, ker ima manj delcev, ki jo prestrežejo.
:::

Pufer ni čarobna škatla: ko dodana kislina porabi skoraj ves $\mathrm{A^-}$, pH strmo pade. Koliko kisline ali baze pufer prenese, je njegova **kapaciteta**.

## Rešeni primeri

### Primer 1: konstanta iz meritve

Obrtnik pred čiščenjem vodnega kamna izmeri pH raztopine ocetne kisline s koncentracijo $0{,}10\,\mathrm{mol/L}$. Merilnik pokaže $2{,}88$. Kolikšna je konstanta kislosti?

**Podatki:** $c = 0{,}10\,\mathrm{mol/L}$, $\mathrm{pH} = 2{,}88$
**Iščemo:** konstanto kislosti $K_\mathrm{a}$

:::formula
$[\mathrm{H_3O^+}] = 10^{-\mathrm{pH}}$, $K_\mathrm{a} = \dfrac{[\mathrm{H_3O^+}] \cdot [\mathrm{A^-}]}{[\mathrm{HA}]}$
:::

**Rešitev:**

1. Iz pH: $[\mathrm{H_3O^+}] = 10^{-2{,}88} = 1{,}32 \cdot 10^{-3}\,\mathrm{mol/L}$.
2. Vsaka molekula, ki odda proton, da tudi en acetatni ion, zato $[\mathrm{A^-}] = 1{,}32 \cdot 10^{-3}\,\mathrm{mol/L}$.
3. Cele molekule: $[\mathrm{HA}] = 0{,}10 - 0{,}00132 = 0{,}0987\,\mathrm{mol/L}$, ker od začetnih molekul odštejemo tiste, ki so oddale proton.
4. $K_\mathrm{a} = \dfrac{(1{,}32 \cdot 10^{-3})^2}{0{,}0987} \approx 1{,}77 \cdot 10^{-5}\,\mathrm{mol/L}$.
5. Odgovor: konstanta kislosti je približno $1{,}8 \cdot 10^{-5}\,\mathrm{mol/L}$, kar se ujema z vrednostjo v tabeli.

### Primer 2: kis za ploščice

Keramičar po fugiranju obriše ploščice z raztopino ocetne kisline s koncentracijo $0{,}50\,\mathrm{mol/L}$. Kolikšen je pH? $K_\mathrm{a} = 1{,}8 \cdot 10^{-5}\,\mathrm{mol/L}$.

**Podatki:** $c = 0{,}50\,\mathrm{mol/L}$, $K_\mathrm{a} = 1{,}8 \cdot 10^{-5}\,\mathrm{mol/L}$
**Iščemo:** $\mathrm{pH}$

:::formula
$[\mathrm{H_3O^+}] = \sqrt{K_\mathrm{a} \cdot c}$, $\mathrm{pH} = -\log[\mathrm{H_3O^+}]$
:::

**Rešitev:**

1. $[\mathrm{H_3O^+}] = \sqrt{1{,}8 \cdot 10^{-5} \cdot 0{,}50} = 3{,}0 \cdot 10^{-3}\,\mathrm{mol/L}$.
2. Preverimo približek: $\dfrac{0{,}0030}{0{,}50} = 0{,}006$, to je $0{,}6\,\%$, kar je manj od $5\,\%$. Približek $[\mathrm{HA}] \approx c$ je dober.
3. $\mathrm{pH} = -\log(3{,}0 \cdot 10^{-3}) = 2{,}52$.
4. Odgovor: pH raztopine je $2{,}52$. Kot močna kislina bi imela pH $0{,}30$.

### Primer 3: pufer v barvarski kopeli

Pri barvanju volne s kislimi barvili mora pH kopeli ostati čim bolj stalen. Barvarka pripravi $1{,}0\,\mathrm{L}$ kopeli z $0{,}10\,\mathrm{mol}$ ocetne kisline in $0{,}18\,\mathrm{mol}$ natrijevega acetata. Kolikšen je pH? Kolikšen je pH, ko v kopel pride $0{,}010\,\mathrm{mol}$ močne kisline? Primerjaj z enakim dodatkom v $1{,}0\,\mathrm{L}$ vode.

**Podatki:** $V = 1{,}0\,\mathrm{L}$, $n(\mathrm{HA}) = 0{,}10\,\mathrm{mol}$, $n(\mathrm{A^-}) = 0{,}18\,\mathrm{mol}$, dodano $n(\mathrm{H_3O^+}) = 0{,}010\,\mathrm{mol}$, $K_\mathrm{a} = 1{,}8 \cdot 10^{-5}\,\mathrm{mol/L}$
**Iščemo:** pH pred dodatkom in po njem; pH vode po enakem dodatku

:::formula
$[\mathrm{H_3O^+}] = K_\mathrm{a} \cdot \dfrac{[\mathrm{HA}]}{[\mathrm{A^-}]}$; dodani $\mathrm{H_3O^+}$ pretvori $\mathrm{A^-}$ v $\mathrm{HA}$.
:::

**Rešitev:**

1. Prostornina je $1{,}0\,\mathrm{L}$, zato so koncentracije v mol/L enake množinam.
2. Pred dodatkom: $[\mathrm{H_3O^+}] = 1{,}8 \cdot 10^{-5} \cdot \dfrac{0{,}10}{0{,}18} = 1{,}0 \cdot 10^{-5}\,\mathrm{mol/L}$, torej $\mathrm{pH} = 5{,}00$.
3. Dodana kislina reagira z acetatom: $n(\mathrm{A^-}) = 0{,}18 - 0{,}010 = 0{,}17\,\mathrm{mol}$ in $n(\mathrm{HA}) = 0{,}10 + 0{,}010 = 0{,}11\,\mathrm{mol}$.
4. Po dodatku: $[\mathrm{H_3O^+}] = 1{,}8 \cdot 10^{-5} \cdot \dfrac{0{,}11}{0{,}17} = 1{,}16 \cdot 10^{-5}\,\mathrm{mol/L}$, torej $\mathrm{pH} = 4{,}93$.
5. V vodi ni nikogar, ki bi protone prestregel: $[\mathrm{H_3O^+}] = 0{,}010\,\mathrm{mol/L}$, $\mathrm{pH} = 2{,}00$.
6. Odgovor: pH kopeli je $5{,}00$ in se po dodatku zniža le na $4{,}93$. V vodi bi isti dodatek pH znižal s $7$ na $2$.

### Primer 4: zdaj ti – pufer po meri

Za drugo barvilo potrebuje barvarka pH $4{,}50$. Koncentracija ocetne kisline naj bo $0{,}10\,\mathrm{mol/L}$. Kolikšna mora biti koncentracija acetata?

**Podatki:** $\mathrm{pH} = 4{,}50$, $[\mathrm{HA}] = 0{,}10\,\mathrm{mol/L}$, $K_\mathrm{a} = 1{,}8 \cdot 10^{-5}\,\mathrm{mol/L}$
**Iščemo:** $[\mathrm{A^-}]$

:::formula
$\dfrac{[\mathrm{A^-}]}{[\mathrm{HA}]} = \dfrac{K_\mathrm{a}}{[\mathrm{H_3O^+}]}$
:::

**Rešitev:**

1. $[\mathrm{H_3O^+}] = 10^{-4{,}50} = 3{,}16 \cdot 10^{-5}\,\mathrm{mol/L}$.
2. Izraz za $K_\mathrm{a}$ preuredimo tako, da je razmerje baze in kisline samo na levi (formula zgoraj).
3. Izračunaj razmerje in nato $[\mathrm{A^-}]$ sam, nato preveri:

:::premisli
Koliko je razmerje in kolikšna je koncentracija acetata?
---
$\dfrac{[\mathrm{A^-}]}{[\mathrm{HA}]} = \dfrac{1{,}8 \cdot 10^{-5}}{3{,}16 \cdot 10^{-5}} \approx 0{,}57$, zato $[\mathrm{A^-}] = 0{,}57 \cdot 0{,}10\,\mathrm{mol/L} = 0{,}057\,\mathrm{mol/L}$. Acetata je manj kot kisline, ker je želeni pH nižji od $\mathrm{p}K_\mathrm{a} = 4{,}74$.
:::

## Pogoste napake

- **Šibka kislina kot močna.** Učenec za kis z $0{,}10\,\mathrm{mol/L}$ zapiše $[\mathrm{H_3O^+}] = c$ in dobi pH $1{,}00$. To velja le, če odda proton vsaka molekula. Pri šibki kislini uporabi $K_\mathrm{a}$: pH je okoli $2{,}9$ (merilnik je pokazal $2{,}88$).
- **Pozabljen koren.** Iz $K_\mathrm{a} = [\mathrm{H_3O^+}]^2/c$ nekdo zapiše $[\mathrm{H_3O^+}] = K_\mathrm{a} \cdot c$ in dobi pH, ki je skoraj nevtralen. Na levi je kvadrat, zato moraš koreniti.
- **»Šibka« zamenjana z »razredčena«.** Moč pove delež molekul, ki oddajo proton (to meri $K_\mathrm{a}$). Koncentracija pove, koliko kisline je v litru. Koncentriran kis je še vedno šibka kislina.
- **»Vsaka mešanica kisline in soli je pufer.«** Mešanica $\mathrm{HCl}$ in $\mathrm{NaCl}$ ni pufer: $\mathrm{Cl^-}$ je prešibka baza, da bi prestregel dodane ione $\mathrm{H_3O^+}$. Pufer sestavljata šibka kislina in njena konjugirana baza (ali šibka baza in njena konjugirana kislina).
- **»Pufer ima pH 7.«** pH pufra je blizu $\mathrm{p}K_\mathrm{a}$ izbrane kisline: acetatni okoli $4{,}7$. Pufer pH ne nevtralizira, le drži ga pri miru.

## Povzetek

- Šibka kislina odda proton le delno; v vodi se vzpostavi ravnotežje $\mathrm{HA} + \mathrm{H_2O} \rightleftharpoons \mathrm{H_3O^+} + \mathrm{A^-}$.
- Konstanta kislosti: $K_\mathrm{a} = \dfrac{[\mathrm{H_3O^+}][\mathrm{A^-}]}{[\mathrm{HA}]}$; večja $K_\mathrm{a}$ (manjši $\mathrm{p}K_\mathrm{a} = -\log K_\mathrm{a}$) pomeni močnejšo kislino. Odvisna je le od temperature.
- pH šibke kisline: $[\mathrm{H_3O^+}] = \sqrt{K_\mathrm{a} \cdot c}$, če odda proton manj kot okoli $5\,\%$ molekul. Za šibko bazo enako s $K_\mathrm{b}$ in $[\mathrm{OH^-}]$.
- Ob razredčenju delež molekul, ki oddajo proton, naraste, $[\mathrm{H_3O^+}]$ pa se vseeno zmanjša, zato pH naraste.
- Pufer je mešanica šibke kisline in njene konjugirane baze; prestreže dodano kislino ali bazo.
- pH pufra: $[\mathrm{H_3O^+}] = K_\mathrm{a} \cdot \dfrac{[\mathrm{HA}]}{[\mathrm{A^-}]}$; pri enakih koncentracijah je $\mathrm{pH} = \mathrm{p}K_\mathrm{a}$. Razredčenje pH skoraj ne spremeni.

## Drugače: Na sliki

Stolpci kažejo, kaj se zgodi z vsakimi tisoč molekulami kisline v raztopini s koncentracijo $0{,}10\,\mathrm{mol/L}$.

:::risba stolpci
opis: Stolpčni prikaz za 1000 molekul kisline pri koncentraciji 0,10 mol/L. Pri HCl jih 1000 odda proton, cela ne ostane nobena. Pri ocetni kislini jih 13 odda proton, 987 jih ostane celih.
os: število molekul od 1000
korak: 200
stolpec: HCl, oddale | 1000
stolpec: HCl, cele | 0
stolpec: ocetna, oddale | 13
stolpec: ocetna, cele | 987
:::

Pri ocetni kislini je stolpec »oddale« komaj viden. Prav ta nizki stolpec je $[\mathrm{H_3O^+}]$, visoki stolpec celih molekul pa je imenovalec v $K_\mathrm{a}$. Ko razredčiš, nizki stolpec relativno zraste.

## Drugače: Iz vsakdanjega življenja

Beseda pufer prihaja iz nemške besede za **blažilnik**, kakršnega imajo železniški vagoni na koncih. Ko vagon trči v drugega, blažilnik sunek prestreže, vagon se le malo premakne.

- Brez blažilnika (čista voda) gre ves sunek naravnost v vagon: pH skoči s $7$ na $2$.
- Z blažilnikom (pufer) se sunek porazdeli: pH se premakne s $5{,}00$ na $4{,}93$.
- Blažilnik ima dve vzmeti za dve smeri: acetat prestreže kislino, ocetna kislina bazo.
- Tudi blažilnik ima mejo. Pri premočnem trku se stisne do konca; pufer odpove, ko se porabi ena od obeh snovi.

## Preveri se

? Raztopini $\mathrm{HF}$ ($K_\mathrm{a} = 6{,}8 \cdot 10^{-4}\,\mathrm{mol/L}$) in ocetne kisline ($K_\mathrm{a} = 1{,}8 \cdot 10^{-5}\,\mathrm{mol/L}$) imata enako koncentracijo. Katera ima nižji pH?
+ Raztopina $\mathrm{HF}$.
- Raztopina ocetne kisline.
~ Manjša $K_\mathrm{a}$ pomeni šibkejšo kislino, manj $\mathrm{H_3O^+}$ in višji pH.
- Obe enakega, ker imata enako koncentracijo.
~ Pri šibkih kislinah pH ni določen le s koncentracijo, ampak tudi s $K_\mathrm{a}$.
> $\mathrm{HF}$ ima večjo $K_\mathrm{a}$, zato odda proton večji delež molekul, $[\mathrm{H_3O^+}]$ je večja in pH nižji.

? Katera trditev o konstanti kislosti $K_\mathrm{a}$ drži?
- Ko kislino razredčimo, se $K_\mathrm{a}$ zmanjša.
~ Razredčenje spremeni koncentracije, ne konstante. $K_\mathrm{a}$ je odvisna le od temperature.
+ Večja $K_\mathrm{a}$ pomeni, da pri enaki koncentraciji odda proton večji delež molekul kisline.
- Večji $\mathrm{p}K_\mathrm{a}$ pomeni močnejšo kislino.
~ $\mathrm{p}K_\mathrm{a} = -\log K_\mathrm{a}$: večja $K_\mathrm{a}$ da manjši $\mathrm{p}K_\mathrm{a}$, tako kot več $\mathrm{H_3O^+}$ da manjši pH.
> $K_\mathrm{a}$ je konstanta ravnotežja: več produktov ($\mathrm{H_3O^+}$ in $\mathrm{A^-}$) pomeni večjo vrednost in močnejšo kislino.

? Čebelar uporablja mravljinčno kislino s koncentracijo $0{,}20\,\mathrm{mol/L}$, $K_\mathrm{a} = 1{,}8 \cdot 10^{-4}\,\mathrm{mol/L}$. Kolikšen je pH?
- $0{,}70$
~ To je pH močne kisline, $-\log 0{,}20$. Mravljinčna kislina je šibka, odda proton le majhen delež molekul.
+ $2{,}22$
- $4{,}44$
~ Tako dobiš, če pozabiš koreniti: $-\log(1{,}8 \cdot 10^{-4} \cdot 0{,}20)$.
- $3{,}74$
~ To je $\mathrm{p}K_\mathrm{a}$, ne pH. pH je odvisen tudi od koncentracije.
> $[\mathrm{H_3O^+}] = \sqrt{1{,}8 \cdot 10^{-4} \cdot 0{,}20} = 6{,}0 \cdot 10^{-3}\,\mathrm{mol/L}$, $\mathrm{pH} = -\log(6{,}0 \cdot 10^{-3}) = 2{,}22$.

? Ana je računala pH ocetne kisline s $c = 0{,}010\,\mathrm{mol/L}$: »$[\mathrm{H_3O^+}] = K_\mathrm{a} \cdot c = 1{,}8 \cdot 10^{-7}\,\mathrm{mol/L}$, $\mathrm{pH} = 6{,}74$.« Kje je napaka?
- Uporabiti bi morala $[\mathrm{H_3O^+}] = c$, torej pH $2{,}00$.
~ To velja za močno kislino. Ocetna kislina je šibka.
+ Pozabila je koreniti: $[\mathrm{H_3O^+}] = \sqrt{K_\mathrm{a} \cdot c}$, pH je $3{,}37$.
- Napake ni; pH šibke kisline je blizu $7$.
~ Raztopina kisline s $0{,}010\,\mathrm{mol/L}$ ni skoraj nevtralna. Rezultat $6{,}74$ je znak, da je v računu napaka.
> Iz $K_\mathrm{a} = [\mathrm{H_3O^+}]^2/c$ sledi $[\mathrm{H_3O^+}] = \sqrt{1{,}8 \cdot 10^{-7}} = 4{,}2 \cdot 10^{-4}\,\mathrm{mol/L}$ in $\mathrm{pH} = 3{,}37$.

? Pri teku v kri prihaja mlečna kislina, pH krvi pa ostane skoraj $7{,}4$. Kaj ga drži pri miru?
- Mlečna kislina se v krvi takoj razgradi v vodo.
~ Mlečna kislina se ne spremeni v vodo; njene protone mora nekaj prestreči.
- Kri je nevtralna in kisline ne vplivajo nanjo.
~ Kri ni »imuna« na kisline: brez pufrov bi njen pH močno padel.
+ Ioni $\mathrm{HCO_3^-}$ pufra prestrežejo protone in nastane šibka kislina $\mathrm{H_2CO_3}$.
> Pufer $\mathrm{H_2CO_3}/\mathrm{HCO_3^-}$ spremeni dodane ione $\mathrm{H_3O^+}$ v šibko kislino, razmerje se le malo spremeni, zato pH ostane skoraj enak.

:::simboli
K_\mathrm{a} | konstanta kislosti | K_\mathrm{a} = \frac{[\mathrm{H_3O^+}] \cdot [\mathrm{A^-}]}{[\mathrm{HA}]} | mol/L | večja $K_\mathrm{a}$, močnejša kislina
K_\mathrm{b} | konstanta bazičnosti | K_\mathrm{b} = \frac{[\mathrm{NH_4^+}] \cdot [\mathrm{OH^-}]}{[\mathrm{NH_3}]} | mol/L |
\mathrm{p}K_\mathrm{a} | negativni logaritem konstante kislosti | \mathrm{p}K_\mathrm{a} = -\log K_\mathrm{a} | – | manjši $\mathrm{p}K_\mathrm{a}$, močnejša kislina
c | začetna množinska koncentracija kisline ali baze | | mol/L | oglati oklepaji [ ] pomenijo ravnotežno koncentracijo
\mathrm{pH} | pH | \mathrm{pH} = -\log[\mathrm{H_3O^+}] | – |
:::
