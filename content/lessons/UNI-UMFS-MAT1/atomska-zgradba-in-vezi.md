---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Uganka iz delavnice. Na mizi ležijo trije predmeti: kos bakrene cevi, keramična ploščica in grudica kremena (iz takega peska je steklo). Vsi trije so trdni, vsi so iz atomov, ki se tesno držijo skupaj. Velja pa:

- samo enega lahko s kladivom skuješ v drugo obliko, ne da bi počil;
- samo eden prevaja električni tok;
- dva se ob močnem udarcu razletita na ostre kose.

Ugani, kateri je kateri, in poskusi povedati, *zakaj*. Ne beri naprej, dokler nimaš odgovora.

Rešitev: bakreno cev skuješ in skozi baker teče tok, ploščica in kremen pa sta krhka izolatorja. Na odgovor »zakaj« pa ne zadostuje »baker je kovina«. Razlika je v tem, kaj počnejo zunanji elektroni med atomi. Kdor to razume, zna izbrati material za streho, kabel, brusni kamen ali ognjevzdržno opeko, ne da bi si zapomnil sto tabel.

## Razlaga

**1. Atom na kratko.** Atom ima majhno jedro iz protonov in nevtronov, okoli njega so elektroni. Število protonov je **vrstno število** $Z$; v nevtralnem atomu je enako številu elektronov. Elektroni so razporejeni v lupine. Za vezi štejejo le elektroni v zunanji lupini, **valenčni elektroni**: natrij ima enega, magnezij dva, silicij štiri, kisik šest, klor sedem.

**Elektronegativnost** $\chi$ pove, kako močno atom v vezi privlači elektrone. Kovine z leve strani periodnega sistema jo imajo majhno (Na $0{,}93$, Al $1{,}61$), nekovine z desne veliko (O $3{,}44$, Cl $3{,}16$).

**2. Staro izhodišče: kovalentna vez.** Iz kemije poznaš molekulo $\mathrm{Cl_2}$. Atoma imata enako elektronegativnost, zato si en par elektronov *delita*: par sedi med njima in ju drži skupaj. Taka **kovalentna vez** je **usmerjena**: deluje le med dvema točno določenima atomoma, v točno določeni smeri.

V trdnini se ista vez ponovi v vse smeri. V diamantu je vsak ogljikov atom s štirimi vezmi povezan s štirimi sosedi, v kremenu ($\mathrm{SiO_2}$) je vsak silicij vezan na štiri kisike. Dobimo eno samo velikansko mrežo.

**3. Prva razlika: različna elektronegativnost → ionska vez.** Kaj se zgodi, če se srečata atoma z zelo različno elektronegativnostjo, na primer Na in Cl? Klor elektron ne le privlači močneje, ampak ga natriju skoraj povsem *vzame*. Nastaneta **iona**: kation $\mathrm{Na^+}$ in anion $\mathrm{Cl^-}$. Drži ju električna privlačnost nasprotnih nabojev. To je **ionska vez**.

Glavna razlika do kovalentne: ionska vez **ni usmerjena**. Ion privlači vse nasprotno nabite sosede okoli sebe enako, v vseh smereh. V kristalu soli je vsak $\mathrm{Na^+}$ obkrožen s šestimi $\mathrm{Cl^-}$ in obratno.

**4. Druga razlika: elektronov je malo, atomov veliko → kovinska vez.** V bakru so vsi atomi enaki in imajo malo valenčnih elektronov. Elektronov je premalo, da bi atom z vsakim sosedom sestavil svoj par, zato atomi valenčne elektrone oddajo *vsem skupaj*. Ostanejo pozitivna jedra z notranjimi elektroni (**ionski ostanki**), med njimi pa se prosto giblje **elektronski oblak** (»elektronsko morje«). Oblak drži ostanke skupaj. To je **kovinska vez**; tudi ta ni usmerjena.

Slika v besedah, tri vrste vezi drugo ob drugi:

```
kovalentna     ionska          kovinska
 A:A:A        + - + -         + + + +
 : : :        - + - +          ~~~~~~~   (oblak e⁻)
 A:A:A        + - + -         + + + +
(par med       (sosedi so      (elektroni
 dvema)         nasprotni)      so skupni)
```

:::premisli
Kovalentna vez je pri diamantu zelo močna. Napovej: ali je diamant zaradi tega tudi težko zlomiti z udarcem kladiva?
---
Ne. Diamant je zelo trd (težko ga razi), a krhek. Usmerjene vezi ne dovolijo, da bi plast atomov zdrsnila na novo mesto. Ob prevelikem udarcu se vezi pretrgajo naenkrat in kristal poči. Trdota in žilavost nista isto.
:::

**5. Iz vezi do lastnosti.** Lastnosti sledijo iz dveh vprašanj: *ali so elektroni prosti* in *ali je vez usmerjena*.

| Vez | Elektroni | Primer | Tipične lastnosti |
|---|---|---|---|
| kovinska | skupni, prosti | Cu, Al, Fe | prevodna, kovna, sijajna |
| ionska | preneseni, vezani na ione | NaCl, MgO | izolator, trda, krhka |
| kovalentna | v parih med sosedoma | diamant, Si, $\mathrm{SiO_2}$ | izolator (Si polprevodnik), trda, krhka |

Zakaj je kovina kovna? Ko plast ionskih ostankov zdrsne za en atom, je okolica enaka kot prej: oblak se preprosto prerazporedi, vez ostane. Pri ionskem kristalu pa po zdrsu za eno razdaljo med sosednjima ionoma pridejo $\mathrm{Na^+}$ nad $\mathrm{Na^+}$ in $\mathrm{Cl^-}$ nad $\mathrm{Cl^-}$. Enaki naboji se odbijejo, kristal se razkolje po ravni ploskvi.

:::premisli
Zakaj trden NaCl ne prevaja toka, čeprav je sestavljen iz nabitih ionov? Kdaj ga začne prevajati?
---
Ioni so v trdnem kristalu ujeti na svojih mestih, prostih elektronov ni. Tok prevaja šele talina ali raztopina, kjer se ioni lahko premikajo.
:::

**6. Moč vezi in tališče.** Močnejša vez pomeni, da je treba več energije, da atome razmaknemo. Zato ima material z močnejšo vezjo višje tališče in večji modul elastičnosti. Pri ionski vezi silo med ionoma opiše Coulombov zakon:

$$F = \frac{k\, z_1 z_2\, e^2}{r^2}$$

Tu sta $z_1$ in $z_2$ velikosti nabojev ionov v enotah osnovnega naboja $e$, $r$ razdalja med središčema ionov, $k = 8{,}99 \cdot 10^9\,\mathrm{N\,m^2/C^2}$. Večja naboja in manjši ioni pomenijo močnejšo vez.

**7. Vezi so mešane.** Čisto ionske ali čisto kovalentne vezi med različnimi atomi skoraj ni. Delež ionskega značaja ocenimo iz razlike elektronegativnosti $\Delta\chi = |\chi_A - \chi_B|$:

$$p_\mathrm{i} = 1 - e^{-0{,}25\,(\Delta\chi)^2}$$

Tu je $e$ Eulerjevo število ($\approx 2{,}718$), ne osnovni naboj. Pri $\Delta\chi = 0$ je vez čisto kovalentna ($p_\mathrm{i} = 0$), pri velikih razlikah se $p_\mathrm{i}$ približa $1$. Keramike, kot sta $\mathrm{Al_2O_3}$ in $\mathrm{SiO_2}$, ležijo vmes.

**8. Šibke vezi med molekulami.** Polimer, na primer PVC ali polietilen, ima znotraj verige kovalentne vezi, med verigami pa le šibke **sekundarne vezi** (van der Waalsove, vodikove). Zato se plastična cev zmehča že pod $150\,^\circ\mathrm{C}$: popustijo vezi med verigami, ne v njih.

## Rešeni primeri

### Primer 1: sila med ionoma v soli

Razdalja med središčema sosednjih ionov $\mathrm{Na^+}$ in $\mathrm{Cl^-}$ v kristalu je $0{,}282\,\mathrm{nm}$. Kolikšna je privlačna sila med njima?

**Podatki:** $z_1 = 1$, $z_2 = 1$, $r = 0{,}282\,\mathrm{nm}$, $e = 1{,}602 \cdot 10^{-19}\,\mathrm{C}$, $k = 8{,}99 \cdot 10^9\,\mathrm{N\,m^2/C^2}$
**Iščemo:** silo $F$

:::formula
$F = \dfrac{k\, z_1 z_2\, e^2}{r^2}$
:::

**Rešitev:**

1. Razdaljo pretvorimo v metre, ker je $k$ podan v metrih: $r = 0{,}282 \cdot 10^{-9}\,\mathrm{m} = 2{,}82 \cdot 10^{-10}\,\mathrm{m}$.
2. Števec: $k e^2 = 8{,}99 \cdot 10^9 \cdot (1{,}602 \cdot 10^{-19})^2 = 2{,}307 \cdot 10^{-28}\,\mathrm{N\,m^2}$.
3. Imenovalec: $r^2 = 7{,}952 \cdot 10^{-20}\,\mathrm{m^2}$.
4. Delimo: $F = 2{,}307 \cdot 10^{-28} / 7{,}952 \cdot 10^{-20} \approx 2{,}90 \cdot 10^{-9}\,\mathrm{N}$.
5. Odgovor: iona se privlačita s silo približno $2{,}9 \cdot 10^{-9}\,\mathrm{N}$. Sila se zdi drobna, a deluje med enim samim parom ionov; v vsakem zrnu soli je takih parov neštetokrat več, zato kristal drži trdno.

### Primer 2: koliko ionski je korund

Brusni papir za les je pogosto prevlečen s korundom, $\mathrm{Al_2O_3}$. Elektronegativnost aluminija je $1{,}61$, kisika $3{,}44$. Kolikšen je delež ionskega značaja vezi Al–O?

**Podatki:** $\chi_\mathrm{Al} = 1{,}61$, $\chi_\mathrm{O} = 3{,}44$
**Iščemo:** delež ionskega značaja $p_\mathrm{i}$

:::formula
$\Delta\chi = |\chi_A - \chi_B|$, $\;p_\mathrm{i} = 1 - e^{-0{,}25\,(\Delta\chi)^2}$
:::

**Rešitev:**

1. Razlika elektronegativnosti: $\Delta\chi = 3{,}44 - 1{,}61 = 1{,}83$.
2. Kvadriramo, ker eksponent vsebuje $(\Delta\chi)^2$: $1{,}83^2 = 3{,}349$.
3. Eksponent: $0{,}25 \cdot 3{,}349 = 0{,}837$, torej $e^{-0{,}837} = 0{,}433$.
4. $p_\mathrm{i} = 1 - 0{,}433 = 0{,}567$, kar je $56{,}7\,\%$.
5. Odgovor: vez Al–O je približno $57\,\%$ ionska in $43\,\%$ kovalentna. V obeh deležih so elektroni vezani na atome ali ione, prostih ni; zato je korund trd, krhek izolator.

### Primer 3: zakaj je opeka za peč iz MgO, ne iz soli

Ognjevzdržne opeke za kovaške in steklarske peči delajo iz magnezijevega oksida. MgO in NaCl imata enako kristalno zgradbo. V MgO sta iona $\mathrm{Mg^{2+}}$ in $\mathrm{O^{2-}}$ oddaljena $0{,}211\,\mathrm{nm}$. Kolikokrat močnejša je privlačna sila med sosednjima ionoma kot v NaCl (Primer 1)? Kaj to pove o tališču?

**Podatki:** MgO: $z_1 = 2$, $z_2 = 2$, $r_\mathrm{MgO} = 0{,}211\,\mathrm{nm}$; NaCl: $z_1 = z_2 = 1$, $r_\mathrm{NaCl} = 0{,}282\,\mathrm{nm}$, $F_\mathrm{NaCl} = 2{,}90 \cdot 10^{-9}\,\mathrm{N}$
**Iščemo:** razmerje $F_\mathrm{MgO} / F_\mathrm{NaCl}$ in silo $F_\mathrm{MgO}$

:::formula
Ker se $k$ in $e$ okrajšata: $\dfrac{F_\mathrm{MgO}}{F_\mathrm{NaCl}} = \dfrac{2 \cdot 2}{1 \cdot 1} \cdot \left(\dfrac{r_\mathrm{NaCl}}{r_\mathrm{MgO}}\right)^2$
:::

**Rešitev:**

1. Naboja prineseta faktor $2 \cdot 2 = 4$.
2. Manjša razdalja prinese $(0{,}282 / 0{,}211)^2 = 1{,}786$; razdalja je v imenovalcu, zato manjši ioni silo povečajo.
3. Razmerje: $4 \cdot 1{,}786 = 7{,}14$.
4. Sila v MgO: $F_\mathrm{MgO} = 7{,}14 \cdot 2{,}90 \cdot 10^{-9} \approx 2{,}07 \cdot 10^{-8}\,\mathrm{N}$.
5. Odgovor: vez v MgO je približno $7$-krat močnejša. Zato se MgO tali šele pri okoli $2800\,^\circ\mathrm{C}$, NaCl pa že pri $801\,^\circ\mathrm{C}$. Opeka iz MgO zdrži ogenj, sol bi v peči stekla.

### Primer 4 – zdaj ti: brusni kamen iz SiC

Brusne plošče za kotne brusilke so pogosto iz silicijevega karbida, SiC. Elektronegativnost silicija je $1{,}90$, ogljika $2{,}55$. Je vez Si–C pretežno ionska ali kovalentna?

**Podatki:** $\chi_\mathrm{Si} = 1{,}90$, $\chi_\mathrm{C} = 2{,}55$
**Iščemo:** delež ionskega značaja $p_\mathrm{i}$ in vrsto vezi

:::formula
$p_\mathrm{i} = 1 - e^{-0{,}25\,(\Delta\chi)^2}$
:::

**Rešitev:**

1. $\Delta\chi = 2{,}55 - 1{,}90 = 0{,}65$.
2. $0{,}65^2 = 0{,}4225$ in $0{,}25 \cdot 0{,}4225 = 0{,}1056$.
3. Izračunaj $e^{-0{,}1056}$ in $p_\mathrm{i}$ sam, nato preveri:

:::premisli
Koliko je $p_\mathrm{i}$ in kaj to pomeni za brusni kamen?
---
$e^{-0{,}1056} \approx 0{,}900$, zato $p_\mathrm{i} \approx 0{,}10$, torej okoli $10\,\%$. Vez je pretežno kovalentna in usmerjena: SiC je zelo trd (zato brusi kamen in barvne kovine), a krhek, zato plošča ob udarcu poči in jo moramo uporabljati z zaščitnim pokrovom.
:::

## Pogoste napake

- **»Kovina je ionska, saj so v njej ioni.«** V kovini so res pozitivni ionski ostanki, a ni anionov. Elektroni ne pripadajo nobenemu atomu, ampak vsem. Prav zato so prosti in kovina prevaja tok.
- **»Močnejša vez pomeni žilavejši material.«** Moč vezi določa tališče in togost, ne kovnosti. Diamant ima izjemno močne vezi in je krhek. Za kovnost je odločilno, ali je vez neusmerjena in ali po zdrsu ostane enaka.
- **»Vez je ali ionska ali kovalentna.«** Med različnimi atomi je vez skoraj vedno mešana. Delež ionskega značaja izračunaj iz $\Delta\chi$: pri $\mathrm{SiO_2}$ je okoli $45\,\%$, pri $\mathrm{Al_2O_3}$ okoli $57\,\%$.
- **»Ionska snov prevaja, ker ima nabite delce.«** Za prevajanje se morajo nosilci naboja *premikati*. V trdnem ionskem kristalu so ioni ujeti.
- **Pozabljen kvadrat v formuli za $p_\mathrm{i}$.** V eksponentu je $(\Delta\chi)^2$. Brez kvadrata dobiš pri MgO $41\,\%$ namesto $68\,\%$.

## Povzetek

- Za vezi štejejo valenčni elektroni; elektronegativnost $\chi$ pove, kako močno jih atom privlači.
- Kovalentna vez: par elektronov med dvema atomoma, vez je usmerjena (diamant, Si, $\mathrm{SiO_2}$).
- Ionska vez: elektron preide z atoma z majhnim $\chi$ na atom z velikim $\chi$; drži jo Coulombova privlačnost, ni usmerjena (NaCl, MgO).
- Kovinska vez: ionski ostanki v skupnem oblaku prostih elektronov, ni usmerjena (Cu, Al, Fe).
- Prosti elektroni → prevodnost; neusmerjena vez, ki po zdrsu ostane enaka → kovnost. Ionske in kovalentne trdnine so trde, krhke in izolatorji.
- Močnejša vez → višje tališče: $F = \dfrac{k z_1 z_2 e^2}{r^2}$. Delež ionskega značaja: $p_\mathrm{i} = 1 - e^{-0{,}25(\Delta\chi)^2}$.
- Polimeri: kovalentno v verigi, šibke sekundarne vezi med verigami → nizko mehčališče.

## Drugače: Na sliki

Nariši tri kvadratne mreže s po devetimi krožci.

- **Kovinska:** v vse krožce napiši »+«, prostor med njimi pa pobarvaj ali pošrafiraj: to je elektronski oblak. Zdaj si zamisli, da zgornjo vrsto potisneš za en krožec v desno. Pod vsakim »+« je spet oblak in spet »+«: nič se ni pokvarilo.
- **Ionska:** izmenično napiši »+« in »−« kot na šahovnici. Zgornjo vrsto potisni za en krožec. Zdaj stoji »+« nad »+« in »−« nad »−«. Nariši puščice, ki kažejo narazen: kristal se razkolje.
- **Kovalentna:** krožce poveži s kratkimi črtami do sosedov. Pri zdrsu bi morale vse črte med vrstama naenkrat počiti. Ni oblaka, ki bi jih nadomestil.

Iz treh slik prebereš skoraj vse: kje so prosti elektroni (prevodnost) in kaj se zgodi ob zdrsu (kovnost ali krhkost).

## Drugače: Iz vsakdanjega življenja

Pomisli na tri načine, kako se ljudje držijo skupaj na gradbišču.

- **Kovalentna vez** je kot dva delavca, ki skupaj neseta eno bruno: drži ju skupni predmet, in to samo njiju, v točno določeni smeri. Če eden stopi vstran, bruno pade.
- **Ionska vez** je kot magnetki na hladilniku: nasprotna pola se privlačita z vseh strani. Če pa zamakneš vrsto, se srečata enaka pola in odskočita.
- **Kovinska vez** je kot ekipa, ki si podaja orodje iz skupnega zaboja: vsak lahko seže po kateremkoli orodju. Če se delavec premakne na drugo mesto, je zaboj še vedno v dosegu, ekipa drži skupaj.

Zato kovač kuje železo, keramičar pa ploščico raje reže z diamantnim kolescem, kot da bi jo upogibal.

## Preveri se

? Katera trditev o kovinski vezi je pravilna?
- Elektron preide s kovinskega atoma na sosednji kovinski atom, ki postane anion.
~ To je opis ionske vezi. V kovini so vsi atomi enaki, anionov ni.
+ Valenčni elektroni so skupni vsem atomom in se prosto gibljejo med ionskimi ostanki.
- Vsak atom je s parom elektronov vezan na točno določene sosede.
~ To je kovalentna, usmerjena vez. Kovinska vez ni usmerjena.
> V kovini atomi oddajo valenčne elektrone skupnemu oblaku. Prosti elektroni pojasnijo prevodnost, neusmerjenost pa kovnost.

? Elektronegativnost magnezija je $1{,}31$, kisika $3{,}44$. Kolikšen je delež ionskega značaja vezi Mg–O?
- $41\,\%$
~ Pozabil si kvadrat: v eksponentu je $(\Delta\chi)^2$, ne $\Delta\chi$.
- $32\,\%$
~ To je $e^{-0{,}25(\Delta\chi)^2}$, kovalentni del. Ionski del je $1$ minus to.
+ $68\,\%$
- $100\,\%$
~ MgO je res pretežno ionski, a nobena vez med različnimi atomi ni čisto ionska.
> $\Delta\chi = 2{,}13$, $(\Delta\chi)^2 = 4{,}537$, $e^{-1{,}134} = 0{,}322$, $p_\mathrm{i} = 1 - 0{,}322 \approx 0{,}68$.

? Študent je zapisal: »(1) Diamant ima zelo močne kovalentne vezi. (2) Zato ima zelo visoko tališče. (3) Zato se ob udarcu kladiva ne zlomi. (4) Torej bi bil odličen za glavo kladiva.« Kje je napaka?
- V koraku (2): tališče ni povezano z močjo vezi.
~ Prav močne vezi dajo visoko tališče, ta korak drži.
+ V koraku (3): usmerjene vezi ne dopustijo zdrsa, zato je diamant krhek.
- Nikjer, sklep je pravilen.
~ Trdota in žilavost nista isto. Diamant je najtrši, a ob udarcu poči.
> Moč vezi ne pove, ali se material plastično deformira. Usmerjena kovalentna vez se ob zdrsu pretrga, zato je diamant krhek in ni primeren za kladivo.

? Z enakim udarcem kladiva udarimo bakren žebelj in kristal kuhinjske soli. Kaj najbolje opiše razliko?
- Žebelj se skrivi, ker je kovinska vez šibkejša od ionske.
~ Kovnost ni posledica šibke vezi. Baker se tali pri $1085\,^\circ\mathrm{C}$, NaCl pri $801\,^\circ\mathrm{C}$, pa se baker kljub temu kuje.
+ Žebelj se skrivi, ker po zdrsu plasti elektronski oblak vez ohrani; sol poči, ker po zdrsu enaki ioni pridejo drug ob drugega.
- Oba se enako skrivita, ker sta oba kristala.
~ Kristalna zgradba sama ne določa kovnosti; odloča vrsta vezi.
> Pri kovini je okolica atoma po zdrsu enaka. Pri ionskem kristalu se po zdrsu srečajo enaki naboji in se odbijejo, zato se kristal razkolje.

? Električni kabel v hiši ima bakreno žilo in izolacijo iz PVC. Zakaj PVC ne prevaja toka?
- Ker so v PVC ionske vezi in so ioni ujeti v kristalu.
~ PVC je polimer s kovalentnimi vezmi v verigi, ne ionski kristal.
+ Ker so elektroni v kovalentnih vezeh vezani v pare med sosednjima atomoma in ni prostih elektronov.
- Ker je izolacija debelejša od bakrene žile.
~ Debelina ne odloča; tudi tanek sloj bakra prevaja. Odloča, ali so elektroni prosti.
> Prevaja material s prostimi nosilci naboja. V bakru so elektroni skupni vsem atomom, v PVC so vezani v kovalentne pare.

:::simboli
F | privlačna sila med ionoma | F = \dfrac{k z_1 z_2 e^2}{r^2} | N
k | Coulombova konstanta | | N\,m^2/C^2 | $8{,}99 \cdot 10^9$
z_1, z_2 | velikosti nabojev ionov (v enotah $e$) | | – | npr. $2$ za $\mathrm{Mg^{2+}}$
e | osnovni naboj | | C | $1{,}602 \cdot 10^{-19}$; v $e^{\dots}$ Eulerjevo število
r | razdalja med središčema ionov | | m
r_\mathrm{NaCl} | razdalja med ionoma v NaCl | | m
r_\mathrm{MgO} | razdalja med ionoma v MgO | | m
F_\mathrm{NaCl} | sila med ionoma v NaCl | | N
F_\mathrm{MgO} | sila med ionoma v MgO | | N
p_\mathrm{i} | delež ionskega značaja | p_\mathrm{i} = 1 - e^{-0{,}25\,(\Delta\chi)^2} | – | med $0$ in $1$
\Delta\chi | razlika elektronegativnosti | \Delta\chi = |\chi_A - \chi_B| | –
\chi_A, \chi_B | elektronegativnosti atomov A in B | | – | Paulingova lestvica
:::
